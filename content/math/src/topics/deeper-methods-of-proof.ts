// Further knowledge points for topics of Methods of Proof, each a skill the topic's own
// points leave out. See `deeperMethodsOfProofPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

/** binom gives the binomial coefficient of n over k. */
const binom = (n: number, k: number): number => {
  let out = 1;
  for (let i = 1; i <= k; i++) out = (out * (n - k + i)) / i;
  return Math.round(out);
};
/** gcd gives the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** totient counts the integers from 1 to n coprime to n. */
const totient = (n: number) => [...Array(n).keys()].filter((i) => gcd(i + 1, n) === 1).length;
/** divisorsOf lists the positive divisors of n in increasing order. */
const divisorsOf = (n: number) => [...Array(n).keys()].map((i) => i + 1).filter((i) => n % i === 0);
/** count sets a noun beside a number, with its singular for one. */
const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const threeSets: KnowledgePointDef = {
  id: "inclusion-exclusion-for-three-sets",
  title: t("Inclusion-exclusion for three sets", "三个集合的容斥原理"),
  explanation: t(
    "Adding the sizes of three sets counts each element of a pairwise overlap too often, so the three pairwise overlaps are subtracted. But then an element in all three sets has been added three times and subtracted three times. So the triple overlap must be added back once to count that element correctly.",
    "把三个集合的大小相加，会重复计算两两交集中的元素，所以要减去三个两两交集。但这样一来，同时属于三个集合的元素被加了三次又减了三次。所以要把三者的交集再加回一次，才能正确地计算这些元素。",
  ),
  generate(rng) {
    const all = rng.int(1, 5);
    const ab = all + rng.int(1, 6);
    const ac = all + rng.int(1, 6);
    const bc = all + rng.int(1, 6);
    const a = ab + ac - all + rng.int(1, 9);
    const b = ab + bc - all + rng.int(1, 9);
    const c = ac + bc - all + rng.int(1, 9);
    const answer = a + b + c - ab - ac - bc + all;
    return numberProblem({
      prompt: t(
        `Finite sets have $|A| = ${a}$, $|B| = ${b}$, $|C| = ${c}$, $|A \\cap B| = ${ab}$, $|A \\cap C| = ${ac}$, $|B \\cap C| = ${bc}$ and $|A \\cap B \\cap C| = ${all}$. Find $|A \\cup B \\cup C|$.`,
        `有限集满足 $|A| = ${a}$，$|B| = ${b}$，$|C| = ${c}$，$|A \\cap B| = ${ab}$，$|A \\cap C| = ${ac}$，$|B \\cap C| = ${bc}$，$|A \\cap B \\cap C| = ${all}$。求 $|A \\cup B \\cup C|$。`,
      ),
      answer,
      form: "integer",
      wrong: [answer - all, a + b + c, answer - 2 * all],
      solution: t(
        `Inclusion-exclusion gives $${a} + ${b} + ${c} - ${ab} - ${ac} - ${bc} + ${all} = ${answer}$.`,
        `由容斥原理得 $${a} + ${b} + ${c} - ${ab} - ${ac} - ${bc} + ${all} = ${answer}$。`,
      ),
    });
  },
};

const constrainedSubsets: KnowledgePointDef = {
  id: "subsets-with-required-and-forbidden-elements",
  title: t("Subsets with required and forbidden elements", "必含和必不含某些元素的子集"),
  explanation: t(
    "Building a subset means deciding, for each element, whether it is in or out. An element that must be in, or must be out, leaves no decision. Only the remaining elements each offer two choices. So the number of subsets is a power of two whose exponent counts just the undecided elements.",
    "构造子集就是对每个元素决定它在或不在。必须在或必须不在的元素没有选择的余地。只有其余的元素各有两种选择。所以子集的个数是二的幂，指数只计算尚未确定的元素。",
  ),
  generate(rng) {
    const n = rng.int(7, 12);
    const inside = rng.int(1, 3);
    const outside = rng.int(1, 3);
    const free = n - inside - outside;
    const answer = 2 ** free;
    const firstEn = inside === 1 ? "the number 1" : inside === 2 ? "the numbers 1 and 2" : "each of the numbers 1 to 3";
    const firstZh = inside === 1 ? "数 1" : inside === 2 ? "数 1 和 2" : "1 到 3 的每个数";
    const lastEn =
      outside === 1 ? `not the number ${n}` : outside === 2 ? `neither ${n - 1} nor ${n}` : `none of the numbers ${n - 2} to ${n}`;
    const lastZh = outside === 1 ? `不含数 ${n}` : outside === 2 ? `不含 ${n - 1} 和 ${n}` : `不含 ${n - 2} 到 ${n} 的任何数`;
    return numberProblem({
      prompt: t(
        `How many subsets of $\\{1, 2, \\dots, ${n}\\}$ contain ${firstEn} and ${lastEn}?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 有多少个子集包含${firstZh}，且${lastZh}？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** (n - inside), 2 ** n - 2 ** (inside + outside), 2 ** (n - inside - outside - 1)],
      solution: t(
        `The ${inside + outside} named numbers are decided, which leaves ${free} free ones. So there are $2^{${free}} = ${answer}$ subsets.`,
        `指定的 ${inside + outside} 个数已经确定，还剩 ${free} 个可以自由选择。所以有 $2^{${free}} = ${answer}$ 个子集。`,
      ),
    });
  },
};

const subsetsThroughAnElement: KnowledgePointDef = {
  id: "subsets-of-a-given-size-through-an-element",
  title: t("Subsets of a given size through an element", "含某元素的给定大小的子集"),
  explanation: t(
    "To count the subsets of a given size that contain a particular element, put that element in first. What is left is to choose the rest of the subset from the other elements. So a size and a set both drop by one, and which element was named makes no difference to the count.",
    "要数含某个元素的给定大小的子集，先把这个元素放进去。剩下的就是从其他元素中选出子集的其余部分。所以子集大小和集合大小都减一，而指定的是哪个元素，对个数没有影响。",
  ),
  generate(rng) {
    const n = rng.int(5, 12);
    const k = rng.int(2, 5);
    const m = rng.int(1, n);
    const answer = binom(n - 1, k - 1);
    return numberProblem({
      prompt: t(
        `How many ${k}-element subsets of $\\{1, 2, \\dots, ${n}\\}$ contain the number ${m}?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 有多少个含数 ${m} 的 ${k} 元子集？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n, k), binom(n - 1, k), binom(n, k - 1)],
      solution: t(
        `With ${m} included, choose the other ${k - 1} from the remaining ${n - 1} numbers: $\\binom{${n - 1}}{${k - 1}} = ${answer}$.`,
        `放入 ${m} 后，从其余 ${n - 1} 个数中选另外 ${k - 1} 个：$\\binom{${n - 1}}{${k - 1}} = ${answer}$。`,
      ),
    });
  },
};

const partitionsWithBlockSizes: KnowledgePointDef = {
  id: "partitions-into-two-blocks-of-given-sizes",
  title: t("Partitions into two blocks of given sizes", "分成两个给定大小的块"),
  explanation: t(
    "A partition into two blocks is fixed once one block is chosen, because the other block is whatever remains. If the sizes differ, choose the block of the first size. If they are equal, this counts each partition twice, since a partition does not say which block came first, so divide by two.",
    "分成两块时，选定一块，划分就确定了，因为另一块就是剩下的元素。如果大小不同，就选出第一种大小的块。如果大小相等，这样会把每个划分算两次，因为划分不区分哪一块在前，所以要除以二。",
  ),
  generate(rng) {
    const a = rng.int(1, 8);
    const b = rng.int(a, 8);
    const n = a + b;
    const choose = binom(n, a);
    const answer = a === b ? choose / 2 : choose;
    const sizesEn =
      a === b ? `two blocks of ${count(a, "element", "elements")} each` : `one block of ${count(a, "element", "elements")} and one of ${b}`;
    const sizesZh = a === b ? `两个各含 ${a} 个元素的块` : `一个 ${a} 元的块和一个 ${b} 元的块`;
    return numberProblem({
      prompt: t(`How many partitions of a set of ${n} elements consist of ${sizesEn}?`, `${n} 元集合有多少种划分由${sizesZh}组成？`),
      answer,
      form: "integer",
      wrong: [a === b ? choose : 2 * choose, 2 ** (n - 1) - 1, a * b],
      solution:
        a === b
          ? t(
              `Choosing one block gives $\\binom{${n}}{${a}} = ${choose}$ ways, but the two blocks have no order, so each partition is counted twice. That leaves ${answer}.`,
              `选出一块有 $\\binom{${n}}{${a}} = ${choose}$ 种方式，但两块没有顺序，每种划分被算了两次。所以有 ${answer} 种。`,
            )
          : t(
              `Choosing the block of ${a} fixes the partition, since the rest form the other block. That gives $\\binom{${n}}{${a}} = ${answer}$.`,
              `选出 ${a} 元的块就确定了划分，因为其余元素组成另一块。所以有 $\\binom{${n}}{${a}} = ${answer}$ 种。`,
            ),
    });
  },
};

const pairsInAProduct: KnowledgePointDef = {
  id: "pairs-of-a-product-that-meet-a-condition",
  title: t("Pairs of a product that meet a condition", "笛卡儿积中满足条件的数对"),
  explanation: t(
    "A condition on the pairs of a Cartesian product picks out a subset of its grid. To count this subset, fix the first coordinate and count the second coordinates that are allowed, then add over the first coordinate. This is the same as counting the points of the grid one column at a time.",
    "对笛卡儿积中数对的条件选出网格的一个子集。要数这个子集，先固定第一个坐标，数出允许的第二个坐标，再对第一个坐标求和。这和逐列数网格中的点是一回事。",
  ),
  generate(rng) {
    const m = rng.int(3, 12);
    const n = rng.int(3, 12);
    const terms = [...Array(m).keys()].map((i) => n - i - 1).filter((v) => v > 0);
    const answer = terms.reduce((sum, v) => sum + v, 0);
    return numberProblem({
      prompt: t(
        `Let $A = \\{1, \\dots, ${m}\\}$ and $B = \\{1, \\dots, ${n}\\}$. How many pairs $(a, b) \\in A \\times B$ have $a < b$?`,
        `设 $A = \\{1, \\dots, ${m}\\}$，$B = \\{1, \\dots, ${n}\\}$。$A \\times B$ 中有多少个数对 $(a, b)$ 满足 $a < b$？`,
      ),
      answer,
      form: "integer",
      wrong: [m * n, answer + Math.min(m, n), m * n - answer],
      solution: t(
        `Starting from $a = 1$, the number of allowed $b$ is ${terms.join(", ")}, one value of $a$ at a time. These add to $${answer}$.`,
        `从 $a = 1$ 起，每个 $a$ 允许的 $b$ 依次有 ${terms.join(", ")} 个。它们的和是 $${answer}$。`,
      ),
    });
  },
};

const squaredIndicatorDifference: KnowledgePointDef = {
  id: "the-sum-of-a-squared-indicator-difference",
  title: t("The sum of a squared indicator difference", "指示函数之差平方的和"),
  explanation: t(
    "The difference of two indicator functions is $1$, $-1$ or $0$ at each point, and its square is $1$ exactly where the point lies in one set but not the other. So summing this square over a finite universe counts the symmetric difference. Algebra with indicators turns into counting with sets in this way.",
    "两个指示函数之差在每一点上是 $1$、$-1$ 或 $0$，它的平方恰好在该点只属于其中一个集合时为 $1$。所以在有限全集上对这个平方求和，数的就是对称差。指示函数的代数运算就是这样转化为集合计数的。",
  ),
  generate(rng) {
    const shared = rng.int(1, 9);
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const a = shared + p;
    const b = shared + q;
    const answer = p + q;
    return numberProblem({
      prompt: t(
        `Subsets $A$ and $B$ of a finite set $U$ have $|A| = ${a}$, $|B| = ${b}$ and $|A \\cap B| = ${shared}$. Find $\\sum_{x \\in U} \\left(\\mathbf{1}_A(x) - \\mathbf{1}_B(x)\\right)^2$.`,
        `有限集 $U$ 的子集 $A$、$B$ 满足 $|A| = ${a}$，$|B| = ${b}$，$|A \\cap B| = ${shared}$。求 $\\sum_{x \\in U} \\left(\\mathbf{1}_A(x) - \\mathbf{1}_B(x)\\right)^2$。`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, a + b - shared, Math.abs(a - b)],
      solution: t(
        `Each term is 1 exactly for $x$ in one set only, so the sum is $${a} + ${b} - 2 \\cdot ${shared} = ${answer}$.`,
        `每一项恰好在 $x$ 只属于一个集合时为 1，所以和是 $${a} + ${b} - 2 \\cdot ${shared} = ${answer}$。`,
      ),
    });
  },
};

const symmetricDifference: KnowledgePointDef = {
  id: "the-size-of-a-symmetric-difference",
  title: t("The size of a symmetric difference", "对称差的大小"),
  explanation: t(
    "The symmetric difference $A \\triangle B$ is the union of the two one-way differences, so it holds the elements in exactly one of the sets. It is what remains of the union after removing the intersection. Since the sizes of $A$ and $B$ together count the union and the intersection once each, $|A \\triangle B| = 2|A \\cup B| - |A| - |B|$.",
    "对称差 $A \\triangle B$ 是两个单向差集的并，所以它包含恰好属于一个集合的元素。它是并集去掉交集后剩下的部分。由于 $A$ 和 $B$ 的大小之和恰好把并集和交集各算一次，所以 $|A \\triangle B| = 2|A \\cup B| - |A| - |B|$。",
  ),
  generate(rng) {
    const shared = rng.int(1, 9);
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const a = shared + p;
    const b = shared + q;
    const union = shared + p + q;
    const answer = p + q;
    return numberProblem({
      prompt: t(
        `Finite sets have $|A| = ${a}$, $|B| = ${b}$ and $|A \\cup B| = ${union}$. Find $|A \\triangle B|$.`,
        `有限集满足 $|A| = ${a}$，$|B| = ${b}$，$|A \\cup B| = ${union}$。求 $|A \\triangle B|$。`,
      ),
      answer,
      form: "integer",
      wrong: [union + shared, a + b, 2 * shared],
      solution: t(
        `The intersection has size $${a} + ${b} - ${union} = ${shared}$. Removing it from the union leaves $${union} - ${shared} = ${answer}$.`,
        `交集的大小是 $${a} + ${b} - ${union} = ${shared}$。从并集中去掉它，剩下 $${union} - ${shared} = ${answer}$。`,
      ),
    });
  },
};

const disjointLists: KnowledgePointDef = {
  id: "counting-lists-of-pairwise-disjoint-subsets",
  title: t("Counting lists of pairwise disjoint subsets", "数两两不交的子集序列"),
  explanation: t(
    "To count lists of pairwise disjoint subsets, decide for each element where it goes rather than choosing the subsets one at a time. Each element lies in one of the subsets or, if the union need not be everything, in none of them. The decisions are independent, so the count is a power.",
    "要数两两不交的子集序列，不必逐个选子集，而是对每个元素决定它的去向。每个元素属于其中一个子集；如果并集不必是全集，它也可以不属于任何子集。这些决定相互独立，所以个数是一个幂。",
  ),
  generate(rng) {
    const r = rng.int(2, 4);
    const n = rng.int(2, 8);
    const whole = rng.pick([true, false]);
    const places = whole ? r : r + 1;
    const answer = places ** n;
    return numberProblem({
      prompt: whole
        ? t(
            `How many ordered lists of ${r} pairwise disjoint subsets of a set of ${n} elements have the whole set as their union?`,
            `${n} 元集合有多少个由 ${r} 个两两不交的子集组成的有序序列，其并集是整个集合？`,
          )
        : t(
            `How many ordered lists of ${r} pairwise disjoint subsets does a set of ${n} elements have?`,
            `${n} 元集合有多少个由 ${r} 个两两不交的子集组成的有序序列？`,
          ),
      answer,
      form: "integer",
      wrong: [whole ? (r + 1) ** n : r ** n, 2 ** (r * n), n ** places],
      solution: whole
        ? t(
            `Each of the ${n} elements lies in exactly one of the ${r} subsets, which gives $${r}^{${n}} = ${answer}$.`,
            `${n} 个元素各恰好属于 ${r} 个子集之一，所以有 $${r}^{${n}} = ${answer}$ 个。`,
          )
        : t(
            `Each of the ${n} elements lies in one of the ${r} subsets or in none, which is ${places} places. That gives $${places}^{${n}} = ${answer}$.`,
            `${n} 个元素各属于 ${r} 个子集之一或不属于任何一个，共 ${places} 种去向。所以有 $${places}^{${n}} = ${answer}$ 个。`,
          ),
    });
  },
};

const countingNestedQuantifiers: KnowledgePointDef = {
  id: "counting-the-values-that-satisfy-a-quantified-condition",
  title: t("Counting the values that satisfy a quantified condition", "数满足量词条件的值"),
  explanation: t(
    "To decide a statement with an inner quantifier, look for the extreme case. A universal claim must survive its hardest value, while an existential claim only needs its easiest value. Once the inner quantifier has been replaced by this one case, what remains is an ordinary condition on the outer variable, and its values can be counted.",
    "判断含内层量词的命题时，要找极端情形。全称命题必须经得起最难的值，而存在命题只需要最容易的值。把内层量词换成这一种情形后，剩下的就是关于外层变量的普通条件，可以数出它的取值。",
  ),
  generate(rng) {
    const n = rng.int(8, 15);
    const m = rng.int(2, 6);
    const room = rng.int(1, 6);
    const k = room + m;
    const universal = rng.pick([true, false]);
    const answer = universal ? room : Math.min(n, k - 1);
    const quantifier = universal ? "\\forall" : "\\exists";
    return numberProblem({
      prompt: t(
        `For how many $x \\in \\{1, \\dots, ${n}\\}$ is the statement $(${quantifier} y \\in \\{1, \\dots, ${m}\\})\\; x + y \\le ${k}$ true?`,
        `对多少个 $x \\in \\{1, \\dots, ${n}\\}$，命题 $(${quantifier} y \\in \\{1, \\dots, ${m}\\})\\; x + y \\le ${k}$ 为真？`,
      ),
      answer,
      form: "integer",
      wrong: [universal ? Math.min(n, k - 1) : room, Math.min(n, k), answer + 1],
      solution: universal
        ? t(
            `The hardest value is $y = ${m}$, so the statement says $x \\le ${room}$. That holds for ${answer} values.`,
            `最难的值是 $y = ${m}$，所以命题就是 $x \\le ${room}$。满足它的有 ${answer} 个值。`,
          )
        : t(
            `The easiest value is $y = 1$, so the statement says $x \\le ${k - 1}$. Within the given range, that holds for ${answer} values.`,
            `最容易的值是 $y = 1$，所以命题就是 $x \\le ${k - 1}$。在给定范围内，满足它的有 ${answer} 个值。`,
          ),
    });
  },
};

const extremeOfDefinedSet: KnowledgePointDef = {
  id: "the-largest-element-of-a-set-given-by-conditions",
  title: t("The largest element of a set given by conditions", "由条件给出的集合的最大元"),
  explanation: t(
    "A set given by conditions may have no largest element in general, but a nonempty bounded set of integers always has one. To find it, turn the conditions into a bound and then move down from that bound to the first integer that meets the remaining conditions. An absolute value bound gives an interval.",
    "由条件给出的集合一般可能没有最大元，但非空有上界的整数集一定有。要求出它，先把条件化成一个上界，再从上界往下，找到第一个满足其余条件的整数。绝对值不等式给出一个区间。",
  ),
  generate(rng) {
    const c = rng.pick([...Array(41).keys()].map((i) => i - 20).filter((i) => i !== 0));
    const m = rng.int(2, 9);
    const r = rng.int(m, 20);
    const top = c + r;
    const answer = Math.floor(top / m) * m + 0;
    return numberProblem({
      prompt: t(
        `Find the largest element of $\\{x \\in \\mathbb{Z} : |${poly([1, "x"], [-c, ""])}| \\le ${r} \\text{ and } ${m} \\mid x\\}$.`,
        `求 $\\{x \\in \\mathbb{Z} : |${poly([1, "x"], [-c, ""])}| \\le ${r} \\text{ 且 } ${m} \\mid x\\}$ 的最大元。`,
      ),
      answer,
      form: "integer",
      wrong: [top, answer + m, c - r],
      solution: t(
        `The first condition says $${c - r} \\le x \\le ${top}$. The largest multiple of ${m} up to ${top} is $${answer}$.`,
        `第一个条件就是 $${c - r} \\le x \\le ${top}$。不超过 ${top} 的 ${m} 的最大倍数是 $${answer}$。`,
      ),
    });
  },
};

const latticePoints: KnowledgePointDef = {
  id: "counting-the-integer-points-of-a-region",
  title: t("Counting the integer points of a region", "数区域内的整点"),
  explanation: t(
    "A set of integer points in the plane can be counted one vertical line at a time. Fix $x$, solve the conditions for $y$, and count the integers allowed. Then add over $x$. Remember to include the points on the axes when the inequalities allow zero, since each line then holds one more point.",
    "平面上的整点集可以沿竖线逐条来数。固定 $x$，解出关于 $y$ 的条件，数出允许的整数，再对 $x$ 求和。不等式允许取零时，别忘了算上坐标轴上的点，因为这时每条线都多一个点。",
  ),
  generate(rng) {
    const a = rng.int(2, 5);
    const b = rng.int(1, 4);
    const c = rng.int(5, 20);
    const columns: number[] = [];
    for (let x = 0; a * x <= c; x++) columns.push(Math.floor((c - a * x) / b) + 1);
    const answer = columns.reduce((sum, v) => sum + v, 0);
    const line = poly([a, "x"], [b, "y"]);
    let strict = 0;
    for (let x = 0; a * x < c; x++) strict += Math.ceil((c - a * x) / b);
    let positive = 0;
    for (let x = 1; a * x < c; x++) positive += Math.max(0, Math.floor((c - a * x) / b));
    return numberProblem({
      prompt: t(
        `How many points does $\\{(x, y) \\in \\mathbb{Z}^2 : x \\ge 0,\\ y \\ge 0,\\ ${line} \\le ${c}\\}$ have?`,
        `$\\{(x, y) \\in \\mathbb{Z}^2 : x \\ge 0,\\ y \\ge 0,\\ ${line} \\le ${c}\\}$ 有多少个点？`,
      ),
      answer,
      form: "integer",
      wrong: [strict, positive, (Math.floor(c / a) + 1) * (Math.floor(c / b) + 1)],
      solution: t(
        `From $x = 0$ upward, the numbers of allowed $y$ are ${columns.join(", ")}. These add to $${answer}$.`,
        `从 $x = 0$ 起，允许的 $y$ 依次有 ${columns.join(", ")} 个。它们的和是 $${answer}$。`,
      ),
    });
  },
};

/** conjunction writes the conjunction of the variables named by a letter and an index. */
const conjunction = (k: number) =>
  k === 1 ? "p_1" : k === 2 ? "(p_1 \\land p_2)" : k === 3 ? "(p_1 \\land p_2 \\land p_3)" : `(p_1 \\land \\dots \\land p_${k})`;

const falseRowsOfAConditional: KnowledgePointDef = {
  id: "the-false-rows-of-a-conditional",
  title: t("The false rows of a conditional", "条件命题的假行"),
  explanation: t(
    "A conditional is false in only one situation: its hypothesis is true and its conclusion is false. So the false rows of its truth table are easy to count even when the true rows are not. Fix the values that this situation requires, and let every variable that is not mentioned take either value.",
    "条件命题只在一种情况下为假：前件为真而后件为假。所以即使真行不好数，真值表中的假行也容易数。固定这种情况所要求的值，再让没有出现的变量任意取值。",
  ),
  generate(rng) {
    const k = rng.int(1, 4);
    const n = rng.int(k + 1, 10);
    const answer = 2 ** (n - k - 1);
    const named = k === 1 ? "$p_1$" : k === 2 ? "$p_1$, $p_2$" : `$p_1$ to $p_${k}$`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including ${named} and $q$. In how many rows is $${conjunction(k)} \\to q$ false?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 ${named} 和 $q$。$${conjunction(k)} \\to q$ 在多少行为假？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** n - answer, 2 ** (n - 1), 2 ** (n - k)],
      solution: t(
        `It is false only when every $p_i$ is true and $q$ is false, which fixes ${k + 1} variables. The others are free, so the count is $2^{${n - k - 1}} = ${answer}$.`,
        `只有每个 $p_i$ 为真且 $q$ 为假时才为假，这固定了 ${k + 1} 个变量。其余变量自由，所以行数是 $2^{${n - k - 1}} = ${answer}$。`,
      ),
    });
  },
};

const trueRowsOfBiconditionals: KnowledgePointDef = {
  id: "the-true-rows-of-several-biconditionals",
  title: t("The true rows of several biconditionals", "多个双条件的真行"),
  explanation: t(
    "A biconditional is true when its two sides have the same value, so it allows only half of the rows. If several biconditionals share no variables, each of them separately halves the rows, because each one ties one variable to another. Requiring all of them therefore divides the number of rows by a power of two.",
    "双条件在两边取值相同时为真，所以它只允许一半的行。如果几个双条件没有公共变量，每一个都独立地使行数减半，因为每一个都把一个变量绑定到另一个变量。同时要求它们成立，行数就除以二的幂。",
  ),
  generate(rng) {
    const k = rng.int(1, 4);
    const n = rng.int(2 * k, 12);
    const answer = 2 ** (n - k);
    const pair = (i: number) => `(p_${i} \\leftrightarrow q_${i})`;
    const formula = k === 1 ? pair(1) : k === 2 ? `${pair(1)} \\land ${pair(2)}` : `${pair(1)} \\land \\dots \\land ${pair(k)}`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including every $p_i$ and $q_i$ in $${formula}$. In how many rows is this formula true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $${formula}$ 中的每个 $p_i$ 和 $q_i$。这个公式在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** n - answer, 2 ** (n - 1), 2 ** (n - 2 * k)],
      solution: t(
        `Each biconditional halves the rows, independently of any others. So $2^{${n}} \\div 2^{${k}} = ${answer}$ rows remain.`,
        `每个双条件都使行数减半，彼此独立。所以剩下 $2^{${n}} \\div 2^{${k}} = ${answer}$ 行。`,
      ),
    });
  },
};

const conditionsOnMultiples: KnowledgePointDef = {
  id: "counting-sufficient-and-necessary-divisibility-conditions",
  title: t("Counting sufficient and necessary divisibility conditions", "数可除性的充分条件和必要条件"),
  explanation: t(
    "Saying that $P$ is sufficient for $Q$ means $P \\to Q$, and saying that $P$ is necessary for $Q$ means $Q \\to P$. Being a multiple of $a$ implies being a multiple of $k$ exactly when $k$ divides $a$. So these two words turn a question about conditions into one about divisors or about multiples.",
    "说 $P$ 是 $Q$ 的充分条件，就是 $P \\to Q$；说 $P$ 是 $Q$ 的必要条件，就是 $Q \\to P$。是 $a$ 的倍数蕴涵是 $k$ 的倍数，当且仅当 $k$ 整除 $a$。所以这两个词把关于条件的问题变成了关于因数或倍数的问题。",
  ),
  generate(rng) {
    const a = rng.int(6, 60);
    const divisors = divisorsOf(a);
    if (rng.pick([true, false])) {
      const answer = divisors.length;
      return numberProblem({
        prompt: t(
          `For how many positive integers $k$ is "$n$ is a multiple of ${a}" a sufficient condition for "$n$ is a multiple of $k$"?`,
          `对多少个正整数 $k$，"$n$ 是 ${a} 的倍数"是"$n$ 是 $k$ 的倍数"的充分条件？`,
        ),
        answer,
        form: "integer",
        wrong: [answer - 2, answer - 1, a],
        solution: t(
          `The implication holds exactly when $k$ divides ${a}. The divisors are ${divisors.join(", ")}, which is ${answer} numbers.`,
          `这个蕴涵成立，当且仅当 $k$ 整除 ${a}。因数是 ${divisors.join(", ")}，共 ${answer} 个。`,
        ),
      });
    }
    const top = a * rng.int(2, 9) + rng.int(0, a - 1);
    const answer = Math.floor(top / a);
    return numberProblem({
      prompt: t(
        `For how many $k$ from 1 to ${top} is "$n$ is a multiple of ${a}" a necessary condition for "$n$ is a multiple of $k$"?`,
        `从 1 到 ${top} 的 $k$ 中，有多少个使"$n$ 是 ${a} 的倍数"成为"$n$ 是 $k$ 的倍数"的必要条件？`,
      ),
      answer,
      form: "integer",
      wrong: [divisors.length, top - answer, answer + 1],
      solution: t(
        `Necessary means that every multiple of $k$ is a multiple of ${a}, which holds exactly when ${a} divides $k$. There are $\\lfloor ${top} / ${a} \\rfloor = ${answer}$ such $k$.`,
        `必要条件的意思是 $k$ 的每个倍数都是 ${a} 的倍数，这当且仅当 ${a} 整除 $k$。这样的 $k$ 有 $\\lfloor ${top} / ${a} \\rfloor = ${answer}$ 个。`,
      ),
    });
  },
};

const squaresByCases: KnowledgePointDef = {
  id: "the-remainders-a-square-can-leave",
  title: t("The remainders a square can leave", "平方数可能的余数"),
  explanation: t(
    "A claim about all integers can often be proved by finitely many cases, one for each remainder. The remainder of a square depends only on the remainder of the number, so it is enough to square each residue. Since $n$ and $-n$ have the same square, only half of the residues need to be tried.",
    "关于所有整数的命题，常常可以按余数分成有限种情况来证明。平方数的余数只取决于这个数的余数，所以只要把每个余数平方。由于 $n$ 和 $-n$ 的平方相同，只需试一半的余数。",
  ),
  generate(rng) {
    const m = rng.int(3, 32);
    const half = Math.floor(m / 2);
    const values = [...new Set([...Array(half + 1).keys()].map((i) => (i * i) % m))].sort((x, y) => x - y);
    const answer = values.length;
    return numberProblem({
      prompt: t(
        `As $n$ runs through the integers, how many different remainders can $n^2$ leave on division by ${m}?`,
        `当 $n$ 取遍所有整数时，$n^2$ 除以 ${m} 可能有多少种不同的余数？`,
      ),
      answer,
      form: "integer",
      wrong: [m, half + 1, answer + 1],
      solution: t(
        `Squaring the residues 0 to ${half} covers every case and gives the remainders ${values.join(", ")}. That is ${answer} values.`,
        `把余数 0 到 ${half} 平方就覆盖了所有情况，得到余数 ${values.join(", ")}，共 ${answer} 个值。`,
      ),
    });
  },
};

const rationalisingMultiplier: KnowledgePointDef = {
  id: "the-smallest-multiplier-that-makes-a-root-rational",
  title: t("The smallest multiplier that makes a root rational", "使根式成为有理数的最小乘数"),
  explanation: t(
    "The square root of a positive integer is rational only if the integer is a perfect square; otherwise it is irrational, by the usual contradiction. So to make a root rational, every prime in the integer must have an even exponent. Write the integer as a square times a square-free part. That part supplies the smallest multiplier.",
    "正整数的平方根只有在这个数是完全平方数时才是有理数，否则由通常的反证法知它是无理数。所以要使根式成为有理数，每个素因子的指数都必须是偶数。把这个数写成一个平方数乘以无平方因子的部分，这一部分就是最小的乘数。",
  ),
  generate(rng) {
    const s = rng.int(2, 7);
    const free = rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]);
    const a = s * s * free;
    return numberProblem({
      prompt: t(
        `What is the smallest positive integer $k$ for which $\\sqrt{${a}k}$ is rational?`,
        `使 $\\sqrt{${a}k}$ 为有理数的最小正整数 $k$ 是多少？`,
      ),
      answer: free,
      form: "integer",
      wrong: [a, s, s * free],
      solution: t(
        `Since $${a} = ${s * s} \\cdot ${free}$, we have $\\sqrt{${a}k} = ${s}\\sqrt{${free}k}$. This is rational only if $${free}k$ is a perfect square, and ${free} is square-free, so the smallest choice is $k = ${free}$.`,
        `由于 $${a} = ${s * s} \\cdot ${free}$，所以 $\\sqrt{${a}k} = ${s}\\sqrt{${free}k}$。只有 $${free}k$ 是完全平方数时它才是有理数，而 ${free} 没有平方因子，所以最小取 $k = ${free}$。`,
      ),
    });
  },
};

const remainderForAFactor: KnowledgePointDef = {
  id: "a-remainder-for-a-factor-of-the-divisor",
  title: t("A remainder for a factor of the divisor", "除数的因数对应的余数"),
  explanation: t(
    "If you know the remainder of $n$ on division by $ab$, you also know its remainder on division by $a$. Write $n = abq + r$ and notice that $abq$ is a multiple of $a$. So only $r$ matters. The converse fails: knowing the remainder for $a$ does not determine the remainder for $ab$.",
    "如果知道 $n$ 除以 $ab$ 的余数，也就知道它除以 $a$ 的余数。写出 $n = abq + r$，注意 $abq$ 是 $a$ 的倍数，所以只有 $r$ 起作用。反过来不成立：知道除以 $a$ 的余数，并不能确定除以 $ab$ 的余数。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const r = rng.int(a, a * b - 1);
    const answer = r % a;
    return numberProblem({
      prompt: t(
        `An integer $n$ leaves remainder ${r} on division by ${a * b}. What remainder does it leave on division by ${a}?`,
        `整数 $n$ 除以 ${a * b} 余 ${r}。它除以 ${a} 余多少？`,
      ),
      answer,
      form: "integer",
      wrong: [r, Math.floor(r / a), a - answer],
      solution: t(
        `Write $n = ${a * b}q + ${r}$. The first term is a multiple of ${a}, and $${r} = ${a} \\cdot ${Math.floor(r / a)} + ${answer}$, so the remainder is ${answer}.`,
        `写出 $n = ${a * b}q + ${r}$。第一项是 ${a} 的倍数，而 $${r} = ${a} \\cdot ${Math.floor(r / a)} + ${answer}$，所以余数是 ${answer}。`,
      ),
    });
  },
};

const euclidSteps: KnowledgePointDef = {
  id: "counting-the-divisions-of-the-euclidean-algorithm",
  title: t("Counting the divisions of the Euclidean algorithm", "数欧几里得算法的除法次数"),
  explanation: t(
    "The cost of the Euclidean algorithm is the number of divisions it performs. Every two steps at least halve the larger number, so this count grows only with the number of digits, which is why the algorithm is fast even for huge inputs. Trace the remainders until one of them is zero, and count that last division too.",
    "欧几里得算法的代价是它做除法的次数。每两步至少使较大的数减半，所以这个次数只随位数增长，这就是算法即使对很大的输入也很快的原因。依次写出余数，直到某个余数为零，最后这次除法也要算上。",
  ),
  generate(rng) {
    const a = rng.int(40, 300);
    const b = rng.int(11, a - 1);
    const remainders: number[] = [];
    let x = a;
    let y = b;
    while (y !== 0) {
      const next = x % y;
      remainders.push(next);
      x = y;
      y = next;
    }
    const answer = remainders.length;
    return numberProblem({
      prompt: t(
        `The Euclidean algorithm is applied to ${a} and ${b}. How many divisions does it make, including the one that leaves remainder 0?`,
        `对 ${a} 和 ${b} 使用欧几里得算法。它要做多少次除法，包括余数为 0 的那一次？`,
      ),
      answer,
      form: "integer",
      wrong: [answer - 1, answer + 1, x],
      solution: t(
        `The successive remainders are ${remainders.join(", ")}, one for each division. That is ${answer} divisions.`,
        `依次得到的余数是 ${remainders.join(", ")}，每次除法一个。所以共 ${answer} 次除法。`,
      ),
    });
  },
};

const smallestPositiveSolution: KnowledgePointDef = {
  id: "the-smallest-positive-x-of-a-linear-diophantine-equation",
  title: t("The smallest positive $x$ of a linear Diophantine equation", "线性丢番图方程的最小正 $x$"),
  explanation: t(
    "For coprime $a$ and $b$, the values of $x$ in the integer solutions of $ax + by = c$ differ by multiples of $b$, because adding $b$ to $x$ can be balanced by subtracting $a$ from $y$. So exactly one solution has $x$ between $1$ and $b$. Here $y$ may be negative, so positivity of $y$ is not required.",
    "$a$、$b$ 互素时，$ax + by = c$ 的整数解中，$x$ 的值相差 $b$ 的倍数，因为给 $x$ 加 $b$，可以通过给 $y$ 减 $a$ 来抵消。所以恰有一个解的 $x$ 在 $1$ 到 $b$ 之间。这里 $y$ 可以是负数，不要求它为正。",
  ),
  generate(rng) {
    const a = rng.int(3, 15);
    let b = rng.int(3, 15);
    while (gcd(a, b) !== 1) b += 1;
    const c = rng.int(20, 100);
    let x = 1;
    while ((c - a * x) % b !== 0) x += 1;
    const y = (c - a * x) / b;
    return numberProblem({
      prompt: t(
        `Among the integer solutions of $${poly([a, "x"], [b, "y"])} = ${c}$, where $y$ may be negative, what is the smallest positive value of $x$?`,
        `在 $${poly([a, "x"], [b, "y"])} = ${c}$ 的整数解中（$y$ 可以为负），$x$ 的最小正值是多少？`,
      ),
      answer: x,
      form: "integer",
      wrong: [x + b, b, (c % b) + 1],
      solution: t(
        `The values of $x$ repeat every ${b}, so try $x$ from 1 upward. The first that makes $${c} - ${a}x$ divisible by ${b} is $x = ${x}$, with $y = ${y}$.`,
        `$x$ 的值每隔 ${b} 重复一次，所以从 1 开始试。第一个使 $${c} - ${a}x$ 被 ${b} 整除的是 $x = ${x}$，此时 $y = ${y}$。`,
      ),
    });
  },
};

const gcdTimesLcm: KnowledgePointDef = {
  id: "a-number-from-its-gcd-and-lcm",
  title: t("A number from its gcd and lcm", "由最大公因数和最小公倍数求数"),
  explanation: t(
    "For positive integers, $\\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = ab$. In each prime, the gcd takes the smaller exponent and the lcm the larger, so together they use both exponents, just as the product $ab$ does. Knowing one number with the gcd and the lcm therefore determines the other number.",
    "对正整数，$\\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = ab$。对每个素数，最大公因数取较小的指数，最小公倍数取较大的指数，所以二者合起来用到了两个指数，和乘积 $ab$ 一样。因此知道一个数以及最大公因数和最小公倍数，就能确定另一个数。",
  ),
  generate(rng) {
    const g = rng.int(2, 9);
    const p = rng.int(2, 12);
    let q = rng.int(2, 12);
    while (gcd(p, q) !== 1) q += 1;
    const a = g * p;
    const b = g * q;
    const lcm = g * p * q;
    return numberProblem({
      prompt: t(
        `Positive integers $a = ${a}$ and $b$ have $\\gcd(a, b) = ${g}$ and $\\operatorname{lcm}(a, b) = ${lcm}$. Find $b$.`,
        `正整数 $a = ${a}$ 和 $b$ 满足 $\\gcd(a, b) = ${g}$，$\\operatorname{lcm}(a, b) = ${lcm}$。求 $b$。`,
      ),
      answer: b,
      form: "integer",
      wrong: [q, g * lcm, lcm - a],
      solution: t(
        `Since $ab = \\gcd(a, b) \\cdot \\operatorname{lcm}(a, b)$, we get $b = \\frac{${g} \\cdot ${lcm}}{${a}} = ${b}$.`,
        `由于 $ab = \\gcd(a, b) \\cdot \\operatorname{lcm}(a, b)$，得 $b = \\frac{${g} \\cdot ${lcm}}{${a}} = ${b}$。`,
      ),
    });
  },
};

const legendre: KnowledgePointDef = {
  id: "the-power-of-a-prime-in-a-factorial",
  title: t("The power of a prime in a factorial", "阶乘中素数的幂次"),
  explanation: t(
    "To find the exponent of a prime $p$ in $n!$, count the factors from $1$ to $n$ that contribute. Each multiple of $p$ gives one factor, each multiple of $p^2$ gives one more, and so on. So the exponent is $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$, and the sum stops once the power exceeds $n$.",
    "要求素数 $p$ 在 $n!$ 中的指数，就数 $1$ 到 $n$ 中贡献因子的数。$p$ 的每个倍数贡献一个因子，$p^2$ 的每个倍数再多贡献一个，依此类推。所以指数是 $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$，幂超过 $n$ 后这个和就终止了。",
  ),
  generate(rng) {
    const p = rng.pick([2, 3, 5, 7]);
    const n = rng.int(p * p, 200);
    const parts: number[] = [];
    for (let power = p; power <= n; power *= p) parts.push(Math.floor(n / power));
    const answer = parts.reduce((sum, v) => sum + v, 0);
    return numberProblem({
      prompt: t(`What is the largest $k$ for which $${p}^k$ divides $${n}!$?`, `使 $${p}^k$ 整除 $${n}!$ 的最大 $k$ 是多少？`),
      answer,
      form: "integer",
      wrong: [Math.floor(n / p), (parts[0] ?? 0) + (parts[1] ?? 0) + 1, Math.floor(n / (p - 1))],
      solution: t(
        `Adding the multiples of each power of ${p} gives $${parts.join(" + ")} = ${answer}$.`,
        `把 ${p} 的各个幂的倍数个数相加，得 $${parts.join(" + ")} = ${answer}$。`,
      ),
    });
  },
};

const coefficientForInduction: KnowledgePointDef = {
  id: "finding-the-formula-that-induction-will-prove",
  title: t("Finding the formula that induction will prove", "求出归纳法要证明的公式"),
  explanation: t(
    "Induction proves a formula but does not say where it came from. The inductive step can find it: if $S(n) = \\alpha n^2 + \\beta n$, then $S(n + 1) - S(n)$ must equal the next term for every $n$. Comparing the coefficients of $n$ and the constants fixes $\\alpha$ and $\\beta$, and then the base case holds automatically.",
    "归纳法能证明公式，却不说明公式从何而来。归纳步骤可以用来求公式：如果 $S(n) = \\alpha n^2 + \\beta n$，那么对每个 $n$，$S(n + 1) - S(n)$ 都必须等于下一项。比较 $n$ 的系数和常数项就确定了 $\\alpha$ 和 $\\beta$，这时基础情形自动成立。",
  ),
  generate(rng) {
    const a = rng.int(1, 8);
    const b = rng.pick([...Array(19).keys()].map((i) => i - 9).filter((i) => i !== 0));
    const answer = Q.of(a + 2 * b, 2);
    const alpha = Q.of(a, 2);
    const term = poly([a, "k"], [b, ""]);
    return numberProblem({
      prompt: t(
        `There are constants with $\\sum_{k=1}^{n} (${term}) = \\alpha n^2 + \\beta n$ for every positive integer $n$. Find $\\beta$.`,
        `存在常数使得对每个正整数 $n$，$\\sum_{k=1}^{n} (${term}) = \\alpha n^2 + \\beta n$。求 $\\beta$。`,
      ),
      answer,
      wrong: [alpha, Q.of(b), Q.of(a + b)],
      solution: t(
        `The step needs $\\alpha(2n + 1) + \\beta = ${poly([a, "(n + 1)"], [b, ""])}$ for every $n$. The coefficients of $n$ give $\\alpha = ${alpha.toLatex()}$, and then the constants give $\\beta = ${answer.toLatex()}$.`,
        `归纳步骤要求对每个 $n$，$\\alpha(2n + 1) + \\beta = ${poly([a, "(n + 1)"], [b, ""])}$。比较 $n$ 的系数得 $\\alpha = ${alpha.toLatex()}$，再比较常数项得 $\\beta = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const countingFunctions: KnowledgePointDef = {
  id: "counting-all-functions-between-finite-sets",
  title: t("Counting all functions between finite sets", "数有限集之间的所有函数"),
  explanation: t(
    "A function assigns exactly one output to each input, with no further restriction. So each element of the domain makes its choice independently from the whole codomain. The count is therefore the size of the codomain raised to the size of the domain. This is why the set of such functions is written $B^A$.",
    "函数给每个输入指定恰好一个输出，没有其他限制。所以定义域的每个元素都独立地从整个陪域中选择。因此个数是陪域的大小的定义域大小次幂。这就是这类函数的集合记作 $B^A$ 的原因。",
  ),
  generate(rng) {
    const m = rng.int(2, 7);
    const n = rng.int(2, 7);
    const answer = n ** m;
    return numberProblem({
      prompt: t(
        `How many functions are there from a set of ${m} elements to a set of ${n} elements?`,
        `从 ${m} 元集合到 ${n} 元集合有多少个函数？`,
      ),
      answer,
      form: "integer",
      wrong: [m ** n, m * n, n ** (m - 1)],
      solution: t(
        `Each of the ${m} inputs chooses one of ${n} outputs, independently. That gives $${n}^{${m}} = ${answer}$ functions.`,
        `${m} 个输入各自独立地从 ${n} 个输出中选一个。所以有 $${n}^{${m}} = ${answer}$ 个函数。`,
      ),
    });
  },
};

const functionsMissingValues: KnowledgePointDef = {
  id: "functions-whose-range-misses-given-values",
  title: t("Functions whose range misses given values", "值域不含给定值的函数"),
  explanation: t(
    "A function whose range avoids certain values of the codomain is simply a function into the smaller set that remains. So counting such functions needs no new idea: remove the values that must be missed, and count the functions into what is left. Each input now has fewer outputs to choose from.",
    "值域避开陪域中某些值的函数，其实就是到剩余较小集合的函数。所以数这样的函数不需要新想法：去掉必须避开的值，再数到剩余集合的函数。现在每个输入可选的输出更少了。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const m = rng.int(2, 5);
    const k = rng.int(1, 2);
    const left = n - k;
    const answer = left ** m;
    return numberProblem({
      prompt: t(
        `A function goes from a set of ${m} elements to a set of ${n} elements. How many such functions have ${k === 1 ? "a given element" : "two given elements"} of the codomain outside the range?`,
        `函数从 ${m} 元集合映到 ${n} 元集合。这样的函数中，有多少个的值域不含陪域中${k === 1 ? "某个给定元素" : "两个给定元素"}？`,
      ),
      answer,
      form: "integer",
      wrong: [n ** m, n ** m - answer, left ** (m - 1)],
      solution: t(
        `Each of the ${m} inputs may go to any of the other ${left} elements, so there are $${left}^{${m}} = ${answer}$ functions.`,
        `${m} 个输入都可以映到其余 ${left} 个元素中的任何一个，所以有 $${left}^{${m}} = ${answer}$ 个函数。`,
      ),
    });
  },
};

const floorSum: KnowledgePointDef = {
  id: "the-sum-of-a-run-of-floors",
  title: t("The sum of a run of floors", "一串取整值的和"),
  explanation: t(
    "The values of $\\lfloor \\frac{k}{m} \\rfloor$ form long runs: the value stays the same for $m$ consecutive $k$ before going up by one. So a sum of floors is best done by grouping equal values, not term by term. Be careful at the two ends, where a run may be shorter than $m$.",
    "$\\lfloor \\frac{k}{m} \\rfloor$ 的值成段出现：连续 $m$ 个 $k$ 的值相同，然后增加一。所以取整值的和最好把相同的值分为一组来算，而不是逐项相加。要注意两端，那里的一段可能不足 $m$ 项。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const N = rng.int(10, 60);
    const q = Math.floor(N / m);
    const r = N % m;
    const full = (m * q * (q - 1)) / 2;
    const answer = full + q * (r + 1);
    return numberProblem({
      prompt: t(
        `Find $\\sum_{k=1}^{${N}} \\left\\lfloor \\frac{k}{${m}} \\right\\rfloor$.`,
        `求 $\\sum_{k=1}^{${N}} \\left\\lfloor \\frac{k}{${m}} \\right\\rfloor$。`,
      ),
      answer,
      form: "integer",
      wrong: [Math.floor((N * (N + 1)) / (2 * m)), full, (m * q * (q + 1)) / 2],
      solution: t(
        `Each value below ${q} occurs ${m} times, and these add to $${m} \\cdot \\frac{${q} \\cdot ${q - 1}}{2} = ${full}$. The value ${q} occurs ${r + 1} ${r === 0 ? "time" : "times"} at the end, which adds ${q * (r + 1)}. The sum is $${answer}$.`,
        `小于 ${q} 的每个值出现 ${m} 次，它们的和是 $${m} \\cdot \\frac{${q} \\cdot ${q - 1}}{2} = ${full}$。值 ${q} 在末尾出现 ${r + 1} 次，再加 ${q * (r + 1)}。总和是 $${answer}$。`,
      ),
    });
  },
};

const decodingAFiniteSet: KnowledgePointDef = {
  id: "decoding-a-finite-set-from-its-number",
  title: t("Decoding a finite set from its number", "由编号还原有限集"),
  explanation: t(
    "Sending a finite set $S$ of natural numbers to $\\sum_{s \\in S} 2^s$ is a bijection onto the natural numbers, because binary digits are unique. This is one way to see that the finite subsets of the naturals are countable. To decode a number, write it in binary: the positions of the ones, counted from zero, are the elements.",
    "把有限自然数集 $S$ 映到 $\\sum_{s \\in S} 2^s$，是到自然数的双射，因为二进制表示是唯一的。这是说明自然数的有限子集可数的一种方式。要还原一个数，把它写成二进制：一所在的位置（从零数起）就是集合的元素。",
  ),
  generate(rng) {
    const size = rng.int(3, 5);
    const pool = [...Array(10).keys()];
    const elements: number[] = [];
    for (let i = 0; i < size; i++) {
      const next = rng.pick(pool.filter((v) => !elements.includes(v)));
      elements.push(next);
    }
    elements.sort((x, y) => x - y);
    const N = elements.reduce((sum, s) => sum + 2 ** s, 0);
    const answer = elements.reduce((sum, s) => sum + s, 0);
    return numberProblem({
      prompt: t(
        `Each finite set $S$ of natural numbers, starting from 0, is numbered by $\\sum_{s \\in S} 2^s$. Find the sum of the elements of the set numbered ${N}.`,
        `从 0 开始的自然数构成的每个有限集 $S$，都用 $\\sum_{s \\in S} 2^s$ 编号。求编号为 ${N} 的集合的元素之和。`,
      ),
      answer,
      form: "integer",
      wrong: [answer + size, size, elements[elements.length - 1] ?? 0],
      solution: t(
        `In binary, ${N} is $${N.toString(2)}$, so the set is $\\{${elements.join(", ")}\\}$. Its elements add to $${answer}$.`,
        `${N} 的二进制是 $${N.toString(2)}$，所以集合是 $\\{${elements.join(", ")}\\}$，元素之和是 $${answer}$。`,
      ),
    });
  },
};

const nonCoprimeRemainders: KnowledgePointDef = {
  id: "two-congruences-with-moduli-that-share-a-factor",
  title: t("Two congruences with moduli that share a factor", "模数有公因数的两个同余式"),
  explanation: t(
    "When the moduli share a factor, the Chinese remainder theorem does not apply directly. Two congruences can then conflict, and they are consistent only if the remainders agree modulo the gcd of the moduli. When they are consistent, the solutions repeat with period equal to the lcm of the moduli, not with period equal to their product.",
    "模数有公因数时，不能直接用中国剩余定理。这时两个同余式可能冲突，只有余数模两个模数的最大公因数相同时才相容。相容时，解的周期是两个模数的最小公倍数，而不是它们的乘积。",
  ),
  generate(rng) {
    const g = rng.int(2, 6);
    const u = rng.int(2, 7);
    let v = rng.int(2, 7);
    while (gcd(u, v) !== 1) v += 1;
    const m = g * u;
    const n = g * v;
    const lcm = g * u * v;
    const x = rng.int(Math.max(m, n), lcm - 1);
    const a = x % m;
    const b = x % n;
    return numberProblem({
      prompt: t(
        `Find the smallest positive integer $x$ with $x \\equiv ${a} \\pmod{${m}}$ and $x \\equiv ${b} \\pmod{${n}}$.`,
        `求满足 $x \\equiv ${a} \\pmod{${m}}$ 和 $x \\equiv ${b} \\pmod{${n}}$ 的最小正整数 $x$。`,
      ),
      answer: x,
      form: "integer",
      wrong: [x + lcm, lcm, a + b],
      solution: t(
        `Both moduli are multiples of ${g}, and the remainders agree modulo ${g}, so solutions exist and repeat every $\\operatorname{lcm}(${m}, ${n}) = ${lcm}$. Going through the numbers that leave ${a} on division by ${m}, the first that leaves ${b} on division by ${n} is $${x}$.`,
        `两个模数都是 ${g} 的倍数，余数模 ${g} 相同，所以有解，且每隔 $\\operatorname{lcm}(${m}, ${n}) = ${lcm}$ 重复。逐个检查除以 ${m} 余 ${a} 的数，第一个除以 ${n} 余 ${b} 的是 $${x}$。`,
      ),
    });
  },
};

const countingZeroDivisors: KnowledgePointDef = {
  id: "counting-the-zero-divisors-modulo-n",
  title: t("Counting the zero divisors modulo $n$", "数模 $n$ 的零因子"),
  explanation: t(
    "In the integers modulo $n$, a nonzero class is either a unit or a zero divisor, and it cannot be both. A class is a unit exactly when it is coprime to $n$. So there are $\\varphi(n)$ units, and the other nonzero classes are all zero divisors, which gives $n - \\varphi(n) - 1$ of them.",
    "在模 $n$ 的整数中，非零的类要么是单位，要么是零因子，不可能二者都是。一个类是单位，当且仅当它与 $n$ 互素。所以有 $\\varphi(n)$ 个单位，其余非零的类都是零因子，共 $n - \\varphi(n) - 1$ 个。",
  ),
  generate(rng) {
    const n = rng.pick([...Array(55).keys()].map((i) => i + 6).filter((i) => totient(i) !== i - 1));
    const phi = totient(n);
    const answer = n - phi - 1;
    return numberProblem({
      prompt: t(`How many nonzero classes of $\\mathbb{Z}_{${n}}$ are zero divisors?`, `$\\mathbb{Z}_{${n}}$ 中有多少个非零的类是零因子？`),
      answer,
      form: "integer",
      wrong: [phi, n - phi, divisorsOf(n).length - 2],
      solution: t(
        `There are $\\varphi(${n}) = ${phi}$ units. Every other nonzero class is a zero divisor, so the count is $${n} - ${phi} - 1 = ${answer}$.`,
        `单位有 $\\varphi(${n}) = ${phi}$ 个。其余非零的类都是零因子，所以有 $${n} - ${phi} - 1 = ${answer}$ 个。`,
      ),
    });
  },
};

const countingPropertyRelations: KnowledgePointDef = {
  id: "counting-relations-with-a-given-property",
  title: t("Counting relations with a given property", "数具有给定性质的关系"),
  explanation: t(
    "A relation on a set of $n$ elements is a subset of the $n^2$ ordered pairs. A property fixes some pairs and links others, and the free decisions that remain give a power of two. Reflexivity fixes the $n$ diagonal pairs, while symmetry makes each off-diagonal pair and its mirror image into a single decision.",
    "$n$ 元集合上的关系是 $n^2$ 个有序对的子集。性质固定了一些有序对，又把另一些绑定在一起，剩下的自由选择给出二的幂。自反性固定了对角线上的 $n$ 个有序对，对称性则使每个非对角有序对和它的镜像成为同一个选择。",
  ),
  generate(rng) {
    const n = rng.int(2, 9);
    const offDiagonal = n * n - n;
    const kinds = [
      {
        en: "reflexive",
        zh: "自反",
        k: offDiagonal,
        whyEn: `The ${n} diagonal pairs are fixed, which leaves $${n * n} - ${n}$ free pairs`,
        whyZh: `对角线上的 ${n} 个有序对已固定，剩下 $${n * n} - ${n}$ 个自由的有序对`,
      },
      {
        en: "irreflexive",
        zh: "反自反",
        k: offDiagonal,
        whyEn: `The ${n} diagonal pairs are excluded, which leaves $${n * n} - ${n}$ free pairs`,
        whyZh: `对角线上的 ${n} 个有序对被排除，剩下 $${n * n} - ${n}$ 个自由的有序对`,
      },
      {
        en: "symmetric",
        zh: "对称",
        k: (n * (n + 1)) / 2,
        whyEn: `The ${n} diagonal pairs and the ${offDiagonal / 2} mirror couples are each one decision`,
        whyZh: `对角线上的 ${n} 个有序对和 ${offDiagonal / 2} 组镜像各是一个选择`,
      },
      {
        en: "both reflexive and symmetric",
        zh: "既自反又对称",
        k: offDiagonal / 2,
        whyEn: `The diagonal is fixed, and each of the ${offDiagonal / 2} mirror couples is one decision`,
        whyZh: `对角线已固定，${offDiagonal / 2} 组镜像各是一个选择`,
      },
    ];
    const kind = rng.pick(kinds);
    return numberProblem({
      prompt: t(
        `The number of ${kind.en} relations on a set of ${n} elements is $2^k$. Find $k$.`,
        `${n} 元集合上${kind.zh}的关系有 $2^k$ 个。求 $k$。`,
      ),
      answer: kind.k,
      solveFor: "k",
      wrong: [n * n, kind.k === offDiagonal ? (n * (n + 1)) / 2 : offDiagonal, n],
      solution: t(`${kind.whyEn}, so $k = ${kind.k}$.`, `${kind.whyZh}，所以 $k = ${kind.k}$。`),
    });
  },
};

const relationsOfASize: KnowledgePointDef = {
  id: "relations-with-a-given-number-of-pairs",
  title: t("Relations with a given number of pairs", "含给定个数有序对的关系"),
  explanation: t(
    "A relation from one set to another is any subset of their Cartesian product. So once the number of pairs is fixed, choosing a relation is choosing that many pairs from the product. The count is a binomial coefficient on the size of the product, not on the sizes of the two sets themselves.",
    "从一个集合到另一个集合的关系，就是它们笛卡儿积的任意子集。所以有序对的个数确定后，选关系就是从笛卡儿积中选出这么多个有序对。个数是以笛卡儿积的大小为上标的二项式系数，而不是以两个集合本身的大小为上标。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const n = rng.int(2, 6);
    const k = rng.int(2, 4);
    const size = m * n;
    const answer = binom(size, k);
    return numberProblem({
      prompt: t(
        `How many relations from a set of ${m} elements to a set of ${n} elements contain exactly ${k} ordered pairs?`,
        `从 ${m} 元集合到 ${n} 元集合的关系中，有多少个恰好含 ${k} 个有序对？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** size, size ** k, binom(m + n, k)],
      solution: t(
        `The Cartesian product has $${m} \\cdot ${n} = ${size}$ pairs, and a relation of this size picks ${k} of them: $\\binom{${size}}{${k}} = ${answer}$.`,
        `笛卡儿积有 $${m} \\cdot ${n} = ${size}$ 个有序对，这样的关系从中选出 ${k} 个：$\\binom{${size}}{${k}} = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** lcmOf gives the least common multiple of two positive integers. */
const lcmOf = (a: number, b: number) => (a * b) / gcd(a, b);
/** factorial gives n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
/** derangements counts the bijections of an m-element set that move every element. */
const derangements = (m: number): number => (m === 0 ? 1 : m === 1 ? 0 : (m - 1) * (derangements(m - 1) + derangements(m - 2)));
/** stirling counts the partitions of an n-element set into k nonempty blocks. */
const stirling = (n: number, k: number): number => {
  if (k === n) return 1;
  if (k === 0 || k > n) return 0;
  return stirling(n - 1, k - 1) + k * stirling(n - 1, k);
};
/** bezoutPair gives integers x and y with ax + by = gcd(a, b). */
const bezoutPair = (a: number, b: number): readonly [number, number] => {
  if (b === 0) return [1, 0];
  const [x, y] = bezoutPair(b, a % b);
  return [y, x - Math.floor(a / b) * y];
};
/** firstIntegers writes the set of the integers from 1 to n, spelled out when it is short. */
const firstIntegers = (n: number) => (n <= 3 ? `\\{${[...Array(n).keys()].map((i) => i + 1).join(", ")}\\}` : `\\{1, \\dots, ${n}\\}`);
/** primePower writes a prime power, leaving out an exponent of 1. */
const primePower = (p: number, e: number) => (e === 1 ? `${p}` : `${p}^{${e}}`);
/** joined writes the variables of a letter from 1 to k, joined by a connective, in parentheses. */
const joined = (letter: string, k: number, op: string) =>
  k === 2
    ? `(${letter}_1 ${op} ${letter}_2)`
    : k === 3
      ? `(${letter}_1 ${op} ${letter}_2 ${op} ${letter}_3)`
      : `(${letter}_1 ${op} \\dots ${op} ${letter}_${k})`;
/** independentDivisors lists the ordered pairs from 2 to 12 in which neither number divides the other. */
const independentDivisors: readonly (readonly [number, number])[] = [...Array(11).keys()]
  .flatMap((i) => [...Array(11).keys()].map((j) => [i + 2, j + 2] as const))
  .filter(([a, b]) => a % b !== 0 && b % a !== 0);

const unknownInASetEquality: KnowledgePointDef = {
  id: "solving-for-an-unknown-in-a-set-equality",
  title: t("Solving for an unknown in a set equality", "由集合相等求未知数"),
  explanation: t(
    "Two sets are equal when they have the same elements, and the order of a roster carries no meaning. So an equation between two-element sets does not say which element matches which. Both matchings have to be tried. A matching counts only if the value it gives for the unknown also makes the other pair of elements agree.",
    "两个集合相等是指它们有相同的元素，而列举时的顺序没有意义。所以两个二元集合之间的等式并没有说明哪个元素对应哪个。两种对应方式都要试。只有当一种对应方式求出的未知数也使另一对元素相等时，它才成立。",
  ),
  generate(rng) {
    const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let x = rng.int(-9, 9);
    // The two expressions agree only at x = a - b, where the set would have a single element.
    if (x === a - b) x += 1;
    const first = poly([1, "x"], [a, ""]);
    const second = poly([2, "x"], [b, ""]);
    const u = x + a;
    const v = 2 * x + b;
    const rejected = v - a;
    const rejectedValue = 2 * rejected + b;
    return numberProblem({
      prompt: t(
        `Find the integer $x$ for which $\\{${first}, ${second}\\} = \\{${Math.min(u, v)}, ${Math.max(u, v)}\\}$.`,
        `求使 $\\{${first}, ${second}\\} = \\{${Math.min(u, v)}, ${Math.max(u, v)}\\}$ 成立的整数 $x$。`,
      ),
      answer: x,
      form: "integer",
      wrong: [rejected, Q.of(u - b, 2), u, v],
      solution: t(
        `If $${first} = ${v}$, then $x = ${rejected}$ and $${second} = ${rejectedValue}$, which is not $${u}$, so this matching fails. If $${first} = ${u}$, then $x = ${x}$ and $${second} = ${v}$, as required. So $x = ${x}$.`,
        `如果 $${first} = ${v}$，那么 $x = ${rejected}$，$${second} = ${rejectedValue}$，它不等于 $${u}$，所以这种对应不成立。如果 $${first} = ${u}$，那么 $x = ${x}$，$${second} = ${v}$，符合要求。所以 $x = ${x}$。`,
      ),
    });
  },
};

const inNeitherSet: KnowledgePointDef = {
  id: "the-number-of-elements-in-neither-set",
  title: t("The number of elements in neither set", "两个集合都不含的元素个数"),
  explanation: t(
    "An element lies outside both sets exactly when it lies outside their union, which is De Morgan's law for complements. So the count of elements in neither set does not need a new formula. Find the size of the union by inclusion-exclusion, because adding the two sizes counts the overlap twice, and then subtract it from the universe.",
    "元素同时不属于两个集合，当且仅当它不属于它们的并集，这就是关于补集的德摩根律。所以数两个集合都不含的元素，不需要新公式。先用容斥原理求并集的大小，因为两个集合的大小相加时把交集算了两次，再用全集的大小减去它。",
  ),
  generate(rng) {
    const shared = rng.int(1, 9);
    const p = rng.int(1, 12);
    const q = rng.int(1, 12);
    const outside = rng.int(1, 15);
    const a = shared + p;
    const b = shared + q;
    const union = shared + p + q;
    const size = union + outside;
    return numberProblem({
      prompt: t(
        `Subsets $A$ and $B$ of a universal set $U$ have $|U| = ${size}$, $|A| = ${a}$, $|B| = ${b}$ and $|A \\cap B| = ${shared}$. Find $|A^c \\cap B^c|$.`,
        `全集 $U$ 的子集 $A$、$B$ 满足 $|U| = ${size}$，$|A| = ${a}$，$|B| = ${b}$，$|A \\cap B| = ${shared}$。求 $|A^c \\cap B^c|$。`,
      ),
      answer: outside,
      form: "integer",
      wrong: [size - a - b, size - shared, union],
      solution: t(
        `By De Morgan's law, $A^c \\cap B^c = (A \\cup B)^c$. The union has size $${a} + ${b} - ${shared} = ${union}$, so the complement has size $${size} - ${union} = ${outside}$.`,
        `由德摩根律，$A^c \\cap B^c = (A \\cup B)^c$。并集的大小是 $${a} + ${b} - ${shared} = ${union}$，所以补集的大小是 $${size} - ${union} = ${outside}$。`,
      ),
    });
  },
};

const overlapOfProducts: KnowledgePointDef = {
  id: "the-overlap-of-two-products-of-intervals",
  title: t("The overlap of two products of intervals", "两个区间之积的重叠部分"),
  explanation: t(
    "A point lies in a product of intervals when each of its coordinates lies in the matching interval. So a point lies in two products at once when its first coordinate lies in both first intervals and its second coordinate lies in both second intervals. The overlap of two rectangles is therefore itself a rectangle, built from the two overlaps of intervals.",
    "一个点属于区间之积，是指它的每个坐标都属于对应的区间。所以一个点同时属于两个积，是指它的第一个坐标属于两个第一区间，第二个坐标属于两个第二区间。因此两个矩形的重叠部分本身也是矩形，由两组区间的重叠部分构成。",
  ),
  generate(rng) {
    const segment = () => {
      const low = rng.int(-6, 6);
      const width = rng.int(1, 6);
      const before = rng.int(1, 4);
      const after = rng.int(1, 4);
      const nested = rng.pick([true, false]);
      const high = low + width;
      return {
        low,
        high,
        width,
        one: `[${low - before}, ${nested ? high + after : high}]`,
        other: `[${low}, ${nested ? high : high + after}]`,
        oneWidth: before + width + (nested ? after : 0),
        otherWidth: width + (nested ? 0 : after),
      };
    };
    const across = segment();
    const up = segment();
    const answer = across.width * up.width;
    const areas = across.oneWidth * up.oneWidth + across.otherWidth * up.otherWidth;
    const set = `(${across.one} \\times ${up.one}) \\cap (${across.other} \\times ${up.other})`;
    const overlap = `[${across.low}, ${across.high}] \\times [${up.low}, ${up.high}]`;
    return numberProblem({
      prompt: t(`Find the area of $${set}$.`, `求 $${set}$ 的面积。`),
      answer,
      form: "integer",
      wrong: [across.width + up.width, areas, areas - answer],
      solution: t(
        `Intersecting the first intervals and the second intervals separately gives $${overlap}$. Its area is $${across.width} \\cdot ${up.width} = ${answer}$.`,
        `分别求第一个区间和第二个区间的交，得到 $${overlap}$。它的面积是 $${across.width} \\cdot ${up.width} = ${answer}$。`,
      ),
    });
  },
};

const countingAnIndexedFamily: KnowledgePointDef = {
  id: "counting-the-elements-of-an-indexed-family",
  title: t("Counting the elements of an indexed family", "数集合族的元素"),
  explanation: t(
    "When each set of a family is a block of consecutive integers sliding along with its index, the union and the intersection are blocks too. The union runs from the smallest lower end to the largest upper end, provided that neighboring sets overlap. An integer in the intersection has to clear the largest lower end and stay under the smallest upper end.",
    "当集合族中的每个集合都是一段随指标滑动的连续整数时，并集和交集也都是连续的一段。只要相邻集合有重叠，并集就从最小的下端延伸到最大的上端。交集中的整数必须不小于最大的下端，且不大于最小的上端。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const w = rng.int(n, n + 8);
    const s = rng.int(-9, 9);
    const lower = poly([1, "i"], [s, ""]);
    const upper = poly([1, "i"], [s + w, ""]);
    const family = `A_i = \\{x \\in \\mathbb{Z} : ${lower} \\le x \\le ${upper}\\}`;
    const union = rng.pick([true, false]);
    const answer = union ? n + w : w - n + 2;
    return numberProblem({
      prompt: union
        ? t(
            `For $i = 1, \\dots, ${n}$, let $${family}$. How many integers are in $\\bigcup_{i=1}^{${n}} A_i$?`,
            `对 $i = 1, \\dots, ${n}$，设 $${family}$。$\\bigcup_{i=1}^{${n}} A_i$ 中有多少个整数？`,
          )
        : t(
            `For $i = 1, \\dots, ${n}$, let $${family}$. How many integers are in $\\bigcap_{i=1}^{${n}} A_i$?`,
            `对 $i = 1, \\dots, ${n}$，设 $${family}$。$\\bigcap_{i=1}^{${n}} A_i$ 中有多少个整数？`,
          ),
      answer,
      form: "integer",
      wrong: union ? [n * (w + 1), n + w + 1, w + 1] : [w - n + 1, w - n + 3, w + 1],
      solution: union
        ? t(
            `Neighbouring sets overlap, so the union has no gaps. It runs from $${s + 1}$ to $${s + n + w}$, which is ${answer} integers.`,
            `相邻集合有重叠，所以并集没有空隙。它从 $${s + 1}$ 到 $${s + n + w}$，共 ${answer} 个整数。`,
          )
        : t(
            `An integer in every set is at least the largest lower end, $${s + n}$, and at most the smallest upper end, $${s + 1 + w}$. That is ${answer} integers.`,
            `属于每个集合的整数不小于最大的下端 $${s + n}$，且不大于最小的上端 $${s + 1 + w}$。共 ${answer} 个整数。`,
          ),
    });
  },
};

const rowsWithKTrue: KnowledgePointDef = {
  id: "rows-with-a-given-number-of-true-variables",
  title: t("Rows with a given number of true variables", "恰有给定个数变量为真的行"),
  explanation: t(
    "A row of a truth table is one choice of true or false for every variable, so it is the same thing as the subset of variables that are true. Rows with a fixed number of true variables therefore match subsets of a fixed size. This is why the entries of Pascal's triangle add up to the total number of rows.",
    "真值表的一行就是给每个变量选定真或假，所以它和取真的变量组成的子集是一回事。因此取真变量个数固定的行，对应大小固定的子集。这就是帕斯卡三角形一行中各数之和等于总行数的原因。",
  ),
  generate(rng) {
    const n = rng.int(3, 10);
    const k = rng.int(1, n - 1);
    const answer = binom(n, k);
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables. In how many rows ${k === 1 ? "is exactly one of the variables" : `are exactly ${k} of the variables`} true?`,
        `真值表列出 ${n} 个变量的所有取值。有多少行恰有 ${k} 个变量为真？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** n, 2 ** (n - k), n * k, binom(n, k - 1)],
      solution: t(
        `Such a row is fixed by choosing which ${count(k, "variable is", "variables are")} true, and the others are then false. That gives $\\binom{${n}}{${k}} = ${answer}$ rows.`,
        `选定哪 ${k} 个变量为真，这样的一行就确定了，其余变量都为假。所以有 $\\binom{${n}}{${k}} = ${answer}$ 行。`,
      ),
    });
  },
};

const formulasUpToEquivalence: KnowledgePointDef = {
  id: "counting-formulas-up-to-equivalence",
  title: t("Counting formulas up to equivalence", "在等价意义下数公式"),
  explanation: t(
    "Infinitely many formulas can be written in a few variables, but two of them are logically equivalent exactly when their truth table columns match. So counting formulas up to equivalence means counting columns. A column is decided by the set of rows in which it is true, and any set of rows is possible, so columns correspond to subsets of the rows.",
    "几个变量可以写出无穷多个公式，但两个公式逻辑等价，当且仅当它们的真值表列相同。所以在等价意义下数公式，就是数列。一列由它取真的行组成的集合决定，而任何一组行都是可能的，所以列和行的子集一一对应。",
  ),
  generate(rng) {
    const n = rng.int(2, 4);
    const rows = 2 ** n;
    const required = rng.pick([true, false]);
    const k = rng.int(required ? 2 : 1, rows - 1);
    const answer = required ? binom(rows - 1, k - 1) : binom(rows, k);
    return numberProblem({
      prompt: required
        ? t(
            `Logically equivalent formulas are counted as one. How many different formulas in ${n} variables are true in exactly ${k} rows of the truth table, including the row where every variable is true?`,
            `逻辑等价的公式算作一个。${n} 个变量的公式中，有多少个不同的公式在真值表中恰好 ${k} 行为真，且其中包括所有变量都为真的那一行？`,
          )
        : t(
            `Logically equivalent formulas are counted as one. How many different formulas in ${n} variables are true in exactly ${count(k, "row", "rows")} of the truth table?`,
            `逻辑等价的公式算作一个。${n} 个变量的公式中，有多少个不同的公式在真值表中恰好 ${k} 行为真？`,
          ),
      answer,
      form: "integer",
      wrong: [2 ** rows, required ? binom(rows, k) : binom(rows, k - 1), rows * k],
      solution: required
        ? t(
            `The table has ${rows} rows, and one of the ${k} true rows is already chosen. Choose the other ${count(k - 1, "row", "rows")} from the remaining ${rows - 1} rows: $\\binom{${rows - 1}}{${k - 1}} = ${answer}$.`,
            `真值表有 ${rows} 行，${k} 个真行中已经选定了一行。再从其余 ${rows - 1} 行中选另外 ${k - 1} 行：$\\binom{${rows - 1}}{${k - 1}} = ${answer}$。`,
          )
        : t(
            `The table has ${rows} rows, and an equivalence class of formulas is fixed by which rows are true. Choosing them gives $\\binom{${rows}}{${k}} = ${answer}$.`,
            `真值表有 ${rows} 行，一个等价类的公式由哪些行为真决定。选出这些行，得 $\\binom{${rows}}{${k}} = ${answer}$。`,
          ),
    });
  },
};

const termsAfterDistributing: KnowledgePointDef = {
  id: "counting-the-terms-after-distributing",
  title: t("Counting the terms after distributing", "数分配后的项数"),
  explanation: t(
    "Distributing one connective over the other works like multiplying out brackets. Each term of the result takes one variable from every bracket, so the number of terms is the product of the bracket sizes, by the multiplication principle. This is why repeated distribution can make a formula far longer, even though the new formula is logically equivalent to the old one.",
    "用一个联结词对另一个联结词作分配，就像把括号乘开。结果中的每一项都从每个括号中各取一个变量，所以由乘法原理，项数是各括号大小的乘积。这就是反复分配会使公式变长很多的原因，尽管新公式和原公式逻辑等价。",
  ),
  generate(rng) {
    const m = rng.int(2, 7);
    const n = rng.int(2, 7);
    const three = rng.pick([true, false]);
    const r = three ? rng.int(2, 5) : 1;
    const outerAnd = rng.pick([true, false]);
    const inner = outerAnd ? "\\lor" : "\\land";
    const outer = outerAnd ? "\\land" : "\\lor";
    const brackets = [joined("a", m, inner), joined("b", n, inner), ...(three ? [joined("c", r, inner)] : [])];
    const sizes = three ? [m, n, r] : [m, n];
    const answer = m * n * r;
    const resultEn = outerAnd ? "disjunction of conjunctions" : "conjunction of disjunctions";
    const resultZh = outerAnd ? "合取式的析取" : "析取式的合取";
    const termEn = outerAnd ? "conjunctions" : "disjunctions";
    const termZh = outerAnd ? "合取式" : "析取式";
    return numberProblem({
      prompt: t(
        `All the variables in $${brackets.join(` ${outer} `)}$ are different. The formula is distributed fully into a ${resultEn}. How many ${termEn} does the result have?`,
        `$${brackets.join(` ${outer} `)}$ 中的变量各不相同。把公式完全分配成${resultZh}。结果中有多少个${termZh}？`,
      ),
      answer,
      form: "integer",
      wrong: [sizes.reduce((sum, v) => sum + v, 0), m ** n, three ? m * n : m * n * 2, answer + m],
      solution: t(
        `Each of the ${termEn} takes one variable from each bracket, so the count is $${sizes.join(" \\cdot ")} = ${answer}$.`,
        `每个${termZh}都从每个括号中各取一个变量，所以个数是 $${sizes.join(" \\cdot ")} = ${answer}$。`,
      ),
    });
  },
};

const rowsThroughDeMorgan: KnowledgePointDef = {
  id: "counting-rows-through-de-morgan",
  title: t("Counting rows through De Morgan's laws", "用德摩根律数行"),
  explanation: t(
    "A negated conjunction becomes a disjunction of negations, and a disjunction is hard to count directly because it is true in so many ways. It is false in only one way, though: every negated variable is false. So count that case and subtract it from all the rows. A negated disjunction is easier still, because it becomes a conjunction that fixes its variables.",
    "合取的否定变成否定的析取，而析取有太多方式为真，很难直接数。但它只有一种方式为假：每个带否定的变量都为假。所以数出这种情形，再从总行数中减去。析取的否定更简单，因为它变成一个合取，直接固定了其中的变量。",
  ),
  generate(rng) {
    const k = rng.int(2, 5);
    const n = rng.int(k + 2, 11);
    const conjunctive = rng.pick([true, false]);
    const fixed = 2 ** (n - k);
    const answer = conjunctive ? 2 ** n - fixed : fixed;
    const formula = `\\neg ${joined("p", k, conjunctive ? "\\land" : "\\lor")}`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including those in $${formula}$. In how many rows is this formula true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $${formula}$ 中的变量。这个公式在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [conjunctive ? fixed : 2 ** n - fixed, 2 ** n, 2 ** (n - 1)],
      solution: conjunctive
        ? t(
            `By De Morgan's law, the formula says that at least one $p_i$ is false. It fails only when all ${k} are true, which leaves ${n - k} free variables and $${fixed}$ rows. So it is true in $${2 ** n} - ${fixed} = ${answer}$ rows.`,
            `由德摩根律，这个公式是说至少有一个 $p_i$ 为假。只有 ${k} 个都为真时它才不成立，这时还有 ${n - k} 个自由变量，共 $${fixed}$ 行。所以它在 $${2 ** n} - ${fixed} = ${answer}$ 行为真。`,
          )
        : t(
            `By De Morgan's law, the formula says that every $p_i$ is false. That fixes ${k} variables and leaves ${n - k} free, so it is true in $2^{${n - k}} = ${answer}$ rows.`,
            `由德摩根律，这个公式是说每个 $p_i$ 都为假。这固定了 ${k} 个变量，还剩 ${n - k} 个自由变量，所以它在 $2^{${n - k}} = ${answer}$ 行为真。`,
          ),
    });
  },
};

const rowsOfACompoundConclusion: KnowledgePointDef = {
  id: "rows-of-a-conditional-with-a-compound-conclusion",
  title: t("Rows of a conditional with a compound conclusion", "结论为复合命题的条件命题的行"),
  explanation: t(
    "Rewriting a conditional as a disjunction, $\\neg p \\lor Q$, splits its true rows into two groups that do not overlap: those where $p$ is false, whatever else happens, and those where $p$ is true and $Q$ holds. Counting each group separately is usually simpler than checking rows, and the size of the conclusion only affects the second group.",
    "把条件命题改写成析取 $\\neg p \\lor Q$，就把它的真行分成不重叠的两组：一组是 $p$ 为假的行，不论其他变量如何；另一组是 $p$ 为真且 $Q$ 成立的行。分别数这两组，通常比逐行检查简单，而结论的大小只影响第二组。",
  ),
  generate(rng) {
    const k = rng.int(2, 4);
    const n = rng.int(k + 3, 11);
    const conjunctive = rng.pick([true, false]);
    const half = 2 ** (n - 1);
    const fixed = 2 ** (n - 1 - k);
    const second = conjunctive ? fixed : half - fixed;
    const answer = half + second;
    const formula = `p \\to ${joined("q", k, conjunctive ? "\\land" : "\\lor")}`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including those in $${formula}$. In how many rows is this formula true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $${formula}$ 中的变量。这个公式在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [second, half, 2 ** n - answer],
      solution: t(
        `The formula is equivalent to $\\neg p \\lor ${joined("q", k, conjunctive ? "\\land" : "\\lor")}$. It is true in the ${half} rows with $p$ false. With $p$ true, it needs ${conjunctive ? "every $q_i$ true" : "some $q_i$ true"}, which gives ${second} more rows. The total is $${half} + ${second} = ${answer}$.`,
        `这个公式等价于 $\\neg p \\lor ${joined("q", k, conjunctive ? "\\land" : "\\lor")}$。$p$ 为假的 ${half} 行都为真。$p$ 为真时，需要${conjunctive ? "每个 $q_i$ 都为真" : "某个 $q_i$ 为真"}，又有 ${second} 行。总数是 $${half} + ${second} = ${answer}$。`,
      ),
    });
  },
};

const relatedConditionalRows: KnowledgePointDef = {
  id: "rows-where-a-conditional-and-a-related-statement-compare",
  title: t("Comparing a conditional with a related statement row by row", "逐行比较条件命题和相关命题"),
  explanation: t(
    "The contrapositive of a conditional is equivalent to it, so the two match in every row. The converse and the inverse are equivalent to each other but not to the conditional. They agree with it only when both of its parts have the same value. A truth table shows at once why a true conditional cannot simply be reversed.",
    "条件命题的逆否命题和它等价，所以两者在每一行都相同。逆命题和否命题彼此等价，但和条件命题不等价。只有当条件命题的两部分取值相同时，它们才和它一致。真值表立刻说明了为什么真的条件命题不能随便反过来。",
  ),
  generate(rng) {
    const n = rng.int(3, 10);
    const kind = rng.pick([
      { en: "converse", zh: "逆命题", latex: "q \\to p", both: 2, differ: 2 },
      { en: "inverse", zh: "否命题", latex: "\\neg p \\to \\neg q", both: 2, differ: 2 },
      { en: "contrapositive", zh: "逆否命题", latex: "\\neg q \\to \\neg p", both: 3, differ: 0 },
    ]);
    const differ = rng.pick([true, false]);
    const each = 2 ** (n - 2);
    const pairs = differ ? kind.differ : kind.both;
    const answer = pairs * each;
    const whenEn = differ
      ? "$p$ and $q$ have different values"
      : pairs === 2
        ? "$p$ and $q$ have the same value"
        : "$p$ is false or $q$ is true";
    const whenZh = differ ? "$p$ 和 $q$ 取值不同" : pairs === 2 ? "$p$ 和 $q$ 取值相同" : "$p$ 为假或 $q$ 为真";
    return numberProblem({
      prompt: differ
        ? t(
            `A truth table lists all values of ${n} variables, including $p$ and $q$. In how many rows do $p \\to q$ and its ${kind.en} have different truth values?`,
            `真值表列出 ${n} 个变量的所有取值，其中包括 $p$ 和 $q$。$p \\to q$ 和它的${kind.zh}在多少行的真值不同？`,
          )
        : t(
            `A truth table lists all values of ${n} variables, including $p$ and $q$. In how many rows are $p \\to q$ and its ${kind.en} both true?`,
            `真值表列出 ${n} 个变量的所有取值，其中包括 $p$ 和 $q$。$p \\to q$ 和它的${kind.zh}在多少行同时为真？`,
          ),
      answer,
      form: "integer",
      wrong: [2 ** n, 3 * each, 2 ** (n - 1), each],
      solution:
        pairs === 0
          ? t(
              `The contrapositive $${kind.latex}$ is logically equivalent to $p \\to q$, so the two have the same value in every row. The count is 0.`,
              `逆否命题 $${kind.latex}$ 和 $p \\to q$ 逻辑等价，所以两者在每一行取值都相同。行数是 0。`,
            )
          : t(
              `The ${kind.en} is $${kind.latex}$. This happens exactly when ${whenEn}, which is ${pairs} of the 4 value pairs for $p$ and $q$. Each pair fills ${each} rows, so the count is $${pairs} \\cdot ${each} = ${answer}$.`,
              `${kind.zh}是 $${kind.latex}$。这恰好在${whenZh}时发生，这是 $p$、$q$ 的 4 种取值中的 ${pairs} 种。每种取值占 ${each} 行，所以行数是 $${pairs} \\cdot ${each} = ${answer}$。`,
            ),
    });
  },
};

const andOrOfDivisibility: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-divisibility-and-or-or",
  title: t("Counting the truth set of a divisibility AND or OR", "数可除性的合取或析取的真值集"),
  explanation: t(
    "The truth set of a conjunction is the intersection of the two truth sets, and the truth set of a disjunction is their union. For divisibility predicates, being divisible by both numbers means being divisible by their lcm, not necessarily by their product. The disjunction then follows by inclusion-exclusion, since adding the two counts counts the common multiples twice.",
    "合取的真值集是两个真值集的交，析取的真值集是它们的并。对可除性谓词，同时被两个数整除就是被它们的最小公倍数整除，而不一定被它们的乘积整除。析取再由容斥原理得出，因为两个个数相加时，公倍数被算了两次。",
  ),
  generate(rng) {
    const [a, b] = rng.pick(independentDivisors);
    const size = rng.int(270, 500);
    const lcm = lcmOf(a, b);
    const onA = Math.floor(size / a);
    const onB = Math.floor(size / b);
    const onBoth = Math.floor(size / lcm);
    const both = rng.pick([true, false]);
    const answer = both ? onBoth : onA + onB - onBoth;
    return numberProblem({
      prompt: both
        ? t(
            `Let $U = \\{1, 2, \\dots, ${size}\\}$. How many $x \\in U$ satisfy "$${a} \\mid x$ and $${b} \\mid x$"?`,
            `设 $U = \\{1, 2, \\dots, ${size}\\}$。有多少个 $x \\in U$ 满足"$${a} \\mid x$ 且 $${b} \\mid x$"？`,
          )
        : t(
            `Let $U = \\{1, 2, \\dots, ${size}\\}$. How many $x \\in U$ satisfy "$${a} \\mid x$ or $${b} \\mid x$"?`,
            `设 $U = \\{1, 2, \\dots, ${size}\\}$。有多少个 $x \\in U$ 满足"$${a} \\mid x$ 或 $${b} \\mid x$"？`,
          ),
      answer,
      form: "integer",
      wrong: both
        ? [Math.floor(size / (a * b)), Math.min(onA, onB), onBoth + 1, onBoth - 1]
        : [onA + onB, onA + onB - Math.floor(size / (a * b)), size - onA - onB + onBoth],
      solution: both
        ? t(
            `Both conditions hold exactly when $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ divides $x$, and $\\lfloor ${size} / ${lcm} \\rfloor = ${answer}$.`,
            `两个条件同时成立，当且仅当 $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 整除 $x$，而 $\\lfloor ${size} / ${lcm} \\rfloor = ${answer}$。`,
          )
        : t(
            `There are ${onA} multiples of ${a} and ${onB} multiples of ${b}. The ${onBoth} multiples of $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ are counted twice, so the count is $${onA} + ${onB} - ${onBoth} = ${answer}$.`,
            `${a} 的倍数有 ${onA} 个，${b} 的倍数有 ${onB} 个。$\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 的 ${onBoth} 个倍数被算了两次，所以个数是 $${onA} + ${onB} - ${onBoth} = ${answer}$。`,
          ),
    });
  },
};

const conditionalOfDivisibility: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-divisibility-conditional",
  title: t("Counting the truth set of a divisibility conditional", "数可除性条件命题的真值集"),
  explanation: t(
    "A conditional predicate is false only where its hypothesis holds and its conclusion fails. So it is usually easier to count the false values and subtract them than to count the true ones. Here the false values are the multiples of the first number that are not multiples of the second, which means removing the common multiples from the first group.",
    "条件谓词只在假设成立而结论不成立时为假。所以数出假的值再减去，通常比直接数真的值容易。这里假的值是第一个数的倍数中不是第二个数倍数的那些，也就是从第一组倍数中去掉公倍数。",
  ),
  generate(rng) {
    const [a, b] = rng.pick(independentDivisors);
    const size = rng.int(270, 500);
    const lcm = lcmOf(a, b);
    const onA = Math.floor(size / a);
    const onBoth = Math.floor(size / lcm);
    const falseValues = onA - onBoth;
    const answer = size - falseValues;
    return numberProblem({
      prompt: t(
        `Let $U = \\{1, 2, \\dots, ${size}\\}$. For how many $x \\in U$ is "if $${a} \\mid x$, then $${b} \\mid x$" true?`,
        `设 $U = \\{1, 2, \\dots, ${size}\\}$。对多少个 $x \\in U$，"如果 $${a} \\mid x$，那么 $${b} \\mid x$"为真？`,
      ),
      answer,
      form: "integer",
      wrong: [onBoth, falseValues, size - onA],
      solution: t(
        `The conditional is false for multiples of ${a} that are not multiples of ${b}. There are ${onA} multiples of ${a}, and ${onBoth} of them are multiples of $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$, which leaves ${falseValues} false values. So it is true for $${size} - ${falseValues} = ${answer}$ values.`,
        `条件命题对是 ${a} 的倍数但不是 ${b} 的倍数的值为假。${a} 的倍数有 ${onA} 个，其中 ${onBoth} 个是 $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 的倍数，所以有 ${falseValues} 个假值。因此它对 $${size} - ${falseValues} = ${answer}$ 个值为真。`,
      ),
    });
  },
};

const thresholdOfAQuantifier: KnowledgePointDef = {
  id: "the-threshold-that-makes-a-quantified-statement-true",
  title: t("The threshold that makes a quantified statement true", "使量词命题为真的临界值"),
  explanation: t(
    "A universal statement over a finite set is a chain of conditions, one for each element, so a bound must beat the largest value of the expression. An existential statement needs only one element to work, so a bound must reach just the smallest value. The same expression and domain can therefore give very different thresholds for the two quantifiers.",
    "有限集上的全称命题是一串条件，每个元素一个，所以上界必须不小于表达式的最大值。存在命题只需要一个元素成立，所以上界只要达到最小值。因此同样的表达式和定义域，在两种量词下的临界值可能相差很大。",
  ),
  generate(rng) {
    const p = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const low = rng.int(-5, 5);
    const high = low + rng.int(3, 8);
    const universal = rng.pick([true, false]);
    const xs = [...Array(high - low + 1).keys()].map((i) => low + i);
    const values = xs.map((x) => (x - p) ** 2);
    const largest = Math.max(...values);
    const smallest = Math.min(...values);
    const answer = universal ? largest : smallest;
    const at = xs[values.indexOf(answer)] ?? low;
    const square = `(${poly([1, "x"], [-p, ""])})^2`;
    const quantifier = universal ? "\\forall" : "\\exists";
    return numberProblem({
      prompt: t(
        `What is the smallest integer $c$ for which $(${quantifier} x \\in \\{${low}, ${low + 1}, \\dots, ${high}\\})\\; ${square} \\le c$ is true?`,
        `使 $(${quantifier} x \\in \\{${low}, ${low + 1}, \\dots, ${high}\\})\\; ${square} \\le c$ 为真的最小整数 $c$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [universal ? smallest : largest, answer + 1, values[0] ?? 0, values[values.length - 1] ?? 0],
      solution: universal
        ? t(
            `Every $x$ must satisfy the inequality, so $c$ must be at least the largest value of $${square}$ on the set. That value is ${largest}, reached at $x = ${at}$.`,
            `每个 $x$ 都必须满足这个不等式，所以 $c$ 至少是 $${square}$ 在这个集合上的最大值。这个值是 ${largest}，在 $x = ${at}$ 处取到。`,
          )
        : t(
            `One $x$ is enough, so $c$ only has to reach the smallest value of $${square}$ on the set. That value is ${smallest}, reached at $x = ${at}$.`,
            `只要有一个 $x$ 就够了，所以 $c$ 只需达到 $${square}$ 在这个集合上的最小值。这个值是 ${smallest}，在 $x = ${at}$ 处取到。`,
          ),
    });
  },
};

const implicationChainRows: KnowledgePointDef = {
  id: "the-true-rows-of-an-implication-chain",
  title: t("The true rows of an implication chain", "蕴涵链的真行"),
  explanation: t(
    "By transitivity, a chain of implications forces every later variable to be true as soon as one variable is true. So along the chain the values can only switch once, from false to true, and they can never switch back. The allowed patterns are therefore fixed by the place where this switch occurs, and there is also the pattern with no switch at all.",
    "由传递性，蕴涵链一旦有一个变量为真，后面的变量都必须为真。所以沿着链条，取值只能从假变为真一次，不能再变回去。因此允许的模式由这个转变发生的位置决定，此外还有完全不转变的模式。",
  ),
  generate(rng) {
    const k = rng.int(3, 8);
    const extra = rng.int(0, 4);
    const n = k + extra;
    const patterns = k + 1;
    const each = 2 ** extra;
    const answer = patterns * each;
    const links =
      k === 3
        ? "(p_1 \\to p_2) \\land (p_2 \\to p_3)"
        : k === 4
          ? "(p_1 \\to p_2) \\land (p_2 \\to p_3) \\land (p_3 \\to p_4)"
          : `(p_1 \\to p_2) \\land \\dots \\land (p_${k - 1} \\to p_${k})`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including $p_1$ to $p_${k}$. In how many rows is $${links}$ true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $p_1$ 到 $p_${k}$。$${links}$ 在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [k * each, 2 ** (n - 1), 2 ** n - answer, answer + each],
      solution:
        extra === 0
          ? t(
              `The values along the chain must be some falses followed by trues. The number of falses can be anything from 0 to ${k}, which gives ${answer} rows.`,
              `链条上的取值必须是若干个假后面跟着若干个真。假的个数可以是 0 到 ${k} 中的任何一个，所以有 ${answer} 行。`,
            )
          : t(
              `The values along the chain must be some falses followed by trues. The number of falses can be anything from 0 to ${k}, which gives ${patterns} patterns. ${extra === 1 ? "The other variable is free" : `The other ${extra} variables are free`}, so each pattern fills ${each} rows, and $${patterns} \\cdot ${each} = ${answer}$.`,
              `链条上的取值必须是若干个假后面跟着若干个真。假的个数可以是 0 到 ${k} 中的任何一个，所以有 ${patterns} 种模式。其余 ${extra} 个变量自由，所以每种模式占 ${each} 行，$${patterns} \\cdot ${each} = ${answer}$。`,
            ),
    });
  },
};

const chainsOfSubsets: KnowledgePointDef = {
  id: "counting-nested-chains-of-subsets",
  title: t("Counting nested chains of subsets", "数嵌套的子集链"),
  explanation: t(
    "Proving $A \\subseteq B$ means following one element at a time, and counting nested subsets works the same way. For a chain of subsets, an element is settled by the first set it enters, since the inclusions force it into all the later sets. Each element decides independently of the others, which turns the count of chains into a power.",
    "证明 $A \\subseteq B$ 要逐个元素地追踪，数嵌套的子集也是这样。对于一条子集链，一个元素由它最先进入的集合决定，因为包含关系迫使它进入所有后面的集合。每个元素的决定相互独立，所以子集链的个数是一个幂。",
  ),
  generate(rng) {
    if (rng.pick([true, false])) {
      const r = rng.int(2, 4);
      const n = rng.int(2, 8);
      const answer = (r + 1) ** n;
      const chain = [...Array(r).keys()].map((i) => `A_${i + 1}`).join(" \\subseteq ");
      return numberProblem({
        prompt: t(
          `Let $U$ be a set of ${n} elements. How many lists of subsets of $U$ satisfy $${chain}$?`,
          `设 $U$ 是 ${n} 元集合。$U$ 的子集组成的序列中，有多少个满足 $${chain}$？`,
        ),
        answer,
        form: "integer",
        wrong: [2 ** (r * n), r ** n, r * 2 ** n],
        solution: t(
          `Each element either enters first at one of the ${r} sets or is in none of them, which is ${r + 1} choices. For ${n} elements, that gives $${r + 1}^{${n}} = ${answer}$.`,
          `每个元素要么最先进入 ${r} 个集合之一，要么不属于任何一个，共 ${r + 1} 种选择。对 ${n} 个元素，得 $${r + 1}^{${n}} = ${answer}$。`,
        ),
      });
    }
    const n = rng.int(3, 9);
    const m = rng.int(1, n - 1);
    const answer = binom(n, m) * 2 ** m;
    return numberProblem({
      prompt: t(
        `Let $U$ be a set of ${n} elements. How many pairs of subsets of $U$ satisfy $X \\subseteq Y$ and $|Y| = ${m}$?`,
        `设 $U$ 是 ${n} 元集合。$U$ 的子集对中，有多少对满足 $X \\subseteq Y$ 且 $|Y| = ${m}$？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n, m), 2 ** n, 2 ** m],
      solution: t(
        `There are $\\binom{${n}}{${m}} = ${binom(n, m)}$ choices of $Y$, and each has ${2 ** m} subsets $X$. That gives $${binom(n, m)} \\cdot ${2 ** m} = ${answer}$.`,
        `$Y$ 有 $\\binom{${n}}{${m}} = ${binom(n, m)}$ 种选法，每个 $Y$ 有 ${2 ** m} 个子集 $X$。所以有 $${binom(n, m)} \\cdot ${2 ** m} = ${answer}$ 对。`,
      ),
    });
  },
};

const intersectionWithAUnion: KnowledgePointDef = {
  id: "the-size-of-a-distributed-set-expression",
  title: t("The size of a distributed set expression", "分配后集合表达式的大小"),
  explanation: t(
    "The distributive law rewrites $A \\cap (B \\cup C)$ as a union of two intersections, and inclusion-exclusion counts a union of two sets from their overlap. The overlap of those two intersections is the triple intersection, so that is the part counted twice. Likewise, $A \\cup (B \\cap C)$ is a union whose two parts overlap in the triple intersection too.",
    "分配律把 $A \\cap (B \\cup C)$ 改写成两个交集的并，而容斥原理由重叠部分算出两个集合的并的大小。这两个交集的重叠部分就是三者的交，这正是被算了两次的部分。同样，$A \\cup (B \\cap C)$ 也是一个并，它的两部分也在三者的交上重叠。",
  ),
  generate(rng) {
    const triple = rng.int(1, 6);
    if (rng.pick([true, false])) {
      const ab = triple + rng.int(1, 9);
      const ac = triple + rng.int(1, 9);
      const answer = ab + ac - triple;
      return numberProblem({
        prompt: t(
          `Finite sets have $|A \\cap B| = ${ab}$, $|A \\cap C| = ${ac}$ and $|A \\cap B \\cap C| = ${triple}$. Find $|A \\cap (B \\cup C)|$.`,
          `有限集满足 $|A \\cap B| = ${ab}$，$|A \\cap C| = ${ac}$，$|A \\cap B \\cap C| = ${triple}$。求 $|A \\cap (B \\cup C)|$。`,
        ),
        answer,
        form: "integer",
        wrong: [ab + ac, ab + ac - 2 * triple, answer + 2 * triple],
        solution: t(
          `Distributing gives $(A \\cap B) \\cup (A \\cap C)$, and these two sets overlap in $A \\cap B \\cap C$. So the size is $${ab} + ${ac} - ${triple} = ${answer}$.`,
          `分配后得 $(A \\cap B) \\cup (A \\cap C)$，这两个集合在 $A \\cap B \\cap C$ 上重叠。所以大小是 $${ab} + ${ac} - ${triple} = ${answer}$。`,
        ),
      });
    }
    const a = triple + rng.int(1, 12);
    const bc = triple + rng.int(1, 9);
    const answer = a + bc - triple;
    return numberProblem({
      prompt: t(
        `Finite sets have $|A| = ${a}$, $|B \\cap C| = ${bc}$ and $|A \\cap B \\cap C| = ${triple}$. Find $|A \\cup (B \\cap C)|$.`,
        `有限集满足 $|A| = ${a}$，$|B \\cap C| = ${bc}$，$|A \\cap B \\cap C| = ${triple}$。求 $|A \\cup (B \\cap C)|$。`,
      ),
      answer,
      form: "integer",
      wrong: [a + bc, a + bc - 2 * triple, a + triple],
      solution: t(
        `The sets $A$ and $B \\cap C$ overlap in $A \\cap B \\cap C$, so the size of their union is $${a} + ${bc} - ${triple} = ${answer}$.`,
        `集合 $A$ 和 $B \\cap C$ 在 $A \\cap B \\cap C$ 上重叠，所以它们的并的大小是 $${a} + ${bc} - ${triple} = ${answer}$。`,
      ),
    });
  },
};

const linearDividesQuadratic: KnowledgePointDef = {
  id: "when-a-linear-expression-divides-a-quadratic",
  title: t("When a linear expression divides a quadratic", "一次式何时整除二次式"),
  explanation: t(
    "If $d$ divides both $u$ and $v$, then it divides any combination of them, and this works in reverse too. So when a variable expression divides another, subtract a multiple of the divisor to remove the variable. What is left is a fixed number that the divisor must divide, which leaves only finitely many values to check.",
    "如果 $d$ 同时整除 $u$ 和 $v$，它就整除它们的任何线性组合，反过来也一样。所以当含变量的式子整除另一个式子时，减去除式的倍数以消去变量。剩下的是一个固定的数，除式必须整除它，于是只需检查有限多个值。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const c = rng.int(1, 40);
    const fixed = a * a + c;
    const divisors = divisorsOf(fixed);
    const large = divisors.filter((d) => d > a);
    const answer = large.length;
    const divisor = poly([1, "n"], [a, ""]);
    const other = poly([1, "n"], [-a, ""]);
    return numberProblem({
      prompt: t(
        `For how many positive integers $n$ does $${divisor}$ divide $n^2 + ${c}$?`,
        `对多少个正整数 $n$，$${divisor}$ 整除 $n^2 + ${c}$？`,
      ),
      answer,
      form: "integer",
      wrong: [divisors.length, answer + 1, divisorsOf(c).length, fixed],
      solution: t(
        `Since $n^2 + ${c} = (${divisor})(${other}) + ${fixed}$, the expression $${divisor}$ must divide ${fixed}. It is also greater than ${a}. ${answer === 1 ? `The only divisor of ${fixed} greater than ${a} is ${large.join(", ")}, which gives one $n$.` : `The divisors of ${fixed} greater than ${a} are ${large.join(", ")}, and each gives one $n$.`} So there ${answer === 1 ? "is 1 value" : `are ${answer} values`}.`,
        `由于 $n^2 + ${c} = (${divisor})(${other}) + ${fixed}$，所以 $${divisor}$ 必须整除 ${fixed}。它还大于 ${a}。${fixed} 的大于 ${a} 的因数是 ${large.join(", ")}，每个因数给出一个 $n$。所以有 ${answer} 个值。`,
      ),
    });
  },
};

const smallestCounterexample: KnowledgePointDef = {
  id: "the-smallest-counterexample-to-a-non-divisibility-claim",
  title: t("The smallest counterexample to a non-divisibility claim", "不可除性命题的最小反例"),
  explanation: t(
    "One counterexample is enough to disprove a universal statement, and the search can be kept short. The remainder of a polynomial on division by a fixed number depends only on the remainder of the input, so the remainders repeat. If no counterexample turns up within one full period of inputs, then none exists. Otherwise, going through them in order finds the smallest.",
    "一个反例就足以推翻全称命题，而且搜索范围可以很小。多项式除以固定的数所得的余数，只取决于输入的余数，所以余数是循环的。如果在输入的一个完整周期内找不到反例，那么反例就不存在。否则，按顺序检查就能找到最小的反例。",
  ),
  generate(rng) {
    const m = rng.int(5, 13);
    const a = rng.int(1, 9);
    const target = rng.int(1, m);
    const base = (m * m * m - target * target - a * target) % m;
    const lift = rng.int(0, 2);
    const b = base === 0 ? m * (lift + 1) : base + m * lift;
    const value = (n: number) => n * n + a * n + b;
    const remainders: number[] = [];
    let answer = 1;
    while (value(answer) % m !== 0) {
      remainders.push(value(answer) % m);
      answer += 1;
    }
    const formula = poly([1, "n^2"], [a, "n"], [b, ""]);
    return numberProblem({
      prompt: t(
        `Claim: "for every positive integer $n$, $${m} \\nmid ${formula}$." Find the smallest positive integer $n$ that is a counterexample.`,
        `命题："对每个正整数 $n$，$${m} \\nmid ${formula}$。"求作为反例的最小正整数 $n$。`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1, answer + m, m, m - answer],
      solution:
        answer === 1
          ? t(
              `At $n = 1$ the expression equals ${value(1)}, which is a multiple of ${m}. So $n = 1$ is the smallest counterexample.`,
              `当 $n = 1$ 时，表达式等于 ${value(1)}，它是 ${m} 的倍数。所以最小的反例是 $n = 1$。`,
            )
          : t(
              `${answer === 2 ? `At $n = 1$, the remainder on division by ${m} is ${remainders.join(", ")}, not 0.` : `For $n$ from 1 to ${answer - 1}, the remainders on division by ${m} are ${remainders.join(", ")}, none of them 0.`} At $n = ${answer}$ the expression equals ${value(answer)}, which is a multiple of ${m}. So the smallest counterexample is $n = ${answer}$.`,
              `${answer === 2 ? `当 $n = 1$ 时，除以 ${m} 的余数是 ${remainders.join(", ")}，不是 0。` : `当 $n$ 从 1 到 ${answer - 1} 时，除以 ${m} 的余数是 ${remainders.join(", ")}，都不是 0。`}当 $n = ${answer}$ 时，表达式等于 ${value(answer)}，它是 ${m} 的倍数。所以最小的反例是 $n = ${answer}$。`,
            ),
    });
  },
};

const biconditionalOfDivisibility: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-divisibility-biconditional",
  title: t("Counting the truth set of a divisibility biconditional", "数可除性双条件的真值集"),
  explanation: t(
    "Proving a biconditional takes two directions because it says that its two sides stand or fall together. It holds when both sides are true and also when both sides are false, a case that is easy to forget. So its truth set has two separate parts. Each part can be counted on its own, and the two counts are then added.",
    "证明双条件要证两个方向，因为它是说两边同真同假。两边都真时它成立，两边都假时它也成立，后一种情形容易被忘记。所以它的真值集由两个分开的部分组成。每部分可以单独数，再把两个个数相加。",
  ),
  generate(rng) {
    const [a, b] = rng.pick(independentDivisors);
    const size = rng.int(270, 500);
    const lcm = lcmOf(a, b);
    const onA = Math.floor(size / a);
    const onB = Math.floor(size / b);
    const both = Math.floor(size / lcm);
    const neither = size - onA - onB + both;
    const answer = both + neither;
    return numberProblem({
      prompt: t(
        `Let $U = \\{1, 2, \\dots, ${size}\\}$. For how many $x \\in U$ is "$${a} \\mid x$ if and only if $${b} \\mid x$" true?`,
        `设 $U = \\{1, 2, \\dots, ${size}\\}$。对多少个 $x \\in U$，"$${a} \\mid x$ 当且仅当 $${b} \\mid x$"为真？`,
      ),
      answer,
      form: "integer",
      wrong: [both, neither, size - answer],
      solution: t(
        `Both sides are true for the ${both} multiples of $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$. Both sides are false for the other $${size} - (${onA} + ${onB} - ${both}) = ${neither}$ values outside the two groups of multiples. The total is $${both} + ${neither} = ${answer}$.`,
        `$\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 的 ${both} 个倍数使两边都真。两组倍数之外的 $${size} - (${onA} + ${onB} - ${both}) = ${neither}$ 个值使两边都假。总数是 $${both} + ${neither} = ${answer}$。`,
      ),
    });
  },
};

const divisorForcingASquare: KnowledgePointDef = {
  id: "the-smallest-divisor-that-forces-a-square-divisibility",
  title: t("The smallest divisor that forces a square divisibility", "迫使平方可除的最小除数"),
  explanation: t(
    "A statement with negated parts, such as one that begins with a failure of divisibility, becomes much easier through its contrapositive, which is a positive claim about divisibility. Squaring a number doubles the exponent of each prime. So for a square to contain a given prime power, the number itself needs only about half of that exponent, rounded up when the exponent is odd.",
    "含否定部分的命题，比如以不能整除开头的命题，通过逆否命题就容易得多，因为逆否命题是关于整除的肯定说法。把一个数平方，每个素数的指数都翻倍。所以要使平方含有给定的素数幂，这个数本身只需要大约一半的指数，指数为奇数时向上取整。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [2, 3],
      [2, 5],
      [3, 5],
      [2, 7],
      [3, 7],
    ] as const);
    const e = rng.int(1, p === 2 ? 5 : 3);
    const f = rng.int(1, 3);
    const a = p ** e * q ** f;
    const eUp = Math.ceil(e / 2);
    const fUp = Math.ceil(f / 2);
    const answer = p ** eUp * q ** fUp;
    return numberProblem({
      prompt: t(
        `Find the smallest positive integer $b$ for which "if $${a} \\nmid n^2$, then $b \\nmid n$" is true for every integer $n$.`,
        `求使"如果 $${a} \\nmid n^2$，那么 $b \\nmid n$"对每个整数 $n$ 都成立的最小正整数 $b$。`,
      ),
      answer,
      form: "integer",
      wrong: [a, p * q, p ** Math.floor(e / 2) * q ** Math.floor(f / 2), answer * p],
      solution: t(
        `The contrapositive says that $b \\mid n$ implies $${a} \\mid n^2$. Taking $n = b$ shows that $${a} \\mid b^2$. Since $${a} = ${primePower(p, e)} \\cdot ${primePower(q, f)}$, the exponents in $b$ must be at least half of these, so the smallest choice is $b = ${primePower(p, eUp)} \\cdot ${primePower(q, fUp)} = ${answer}$. This $b$ works, because $b \\mid n$ gives $b^2 \\mid n^2$.`,
        `逆否命题是说 $b \\mid n$ 蕴涵 $${a} \\mid n^2$。取 $n = b$，得 $${a} \\mid b^2$。由于 $${a} = ${primePower(p, e)} \\cdot ${primePower(q, f)}$，$b$ 的指数至少是这些指数的一半，所以最小取 $b = ${primePower(p, eUp)} \\cdot ${primePower(q, fUp)} = ${answer}$。这个 $b$ 确实可行，因为由 $b \\mid n$ 可得 $b^2 \\mid n^2$。`,
      ),
    });
  },
};

const pigeonholeByContradiction: KnowledgePointDef = {
  id: "the-pigeonhole-bound-by-contradiction",
  title: t("The pigeonhole bound by contradiction", "用反证法得到的鸽巢界"),
  explanation: t(
    "The pigeonhole principle is a proof by contradiction. Assume that every box holds fewer than some number of objects, add up the boxes, and find that the total is too small to account for all the objects. To show that a bound is the best possible, you also need an arrangement that spreads the objects as evenly as it can.",
    "鸽巢原理是一种反证法。假设每个盒子里的物体都少于某个数，把各盒相加，发现总数太小，不足以容纳所有物体。要说明一个界是最好的，还需要给出一种尽量平均地分配物体的安排。",
  ),
  generate(rng) {
    const boxes = rng.int(3, 12);
    if (rng.pick([true, false])) {
      const objects = rng.int(20, 120);
      const answer = Math.ceil(objects / boxes);
      const capacity = boxes * (answer - 1);
      return numberProblem({
        prompt: t(
          `A total of ${objects} objects are placed in ${boxes} boxes. What is the largest $k$ such that some box must hold at least $k$ objects, however they are placed?`,
          `把 ${objects} 个物体放入 ${boxes} 个盒子。无论怎样放，某个盒子里必定至少有 $k$ 个物体，这样的 $k$ 最大是多少？`,
        ),
        answer,
        form: "integer",
        wrong: [Math.floor(objects / boxes), answer + 1, objects - boxes + 1],
        solution: t(
          `If every box held at most ${answer - 1}, the total would be at most $${boxes} \\cdot ${answer - 1} = ${capacity}$, which is less than ${objects}. That is a contradiction, so some box holds at least ${answer}. An even spread keeps every box at ${answer} or fewer, so no larger $k$ is guaranteed.`,
          `如果每个盒子至多有 ${answer - 1} 个，总数至多是 $${boxes} \\cdot ${answer - 1} = ${capacity}$，小于 ${objects}。这是矛盾，所以某个盒子至少有 ${answer} 个。平均分配时每个盒子都不超过 ${answer} 个，所以不能保证更大的 $k$。`,
        ),
      });
    }
    const k = rng.int(2, 9);
    const answer = boxes * (k - 1) + 1;
    return numberProblem({
      prompt: t(
        `Objects are placed in ${boxes} boxes. What is the smallest number of objects that guarantees that some box holds at least ${k} of them?`,
        `把物体放入 ${boxes} 个盒子。至少要有多少个物体，才能保证某个盒子里至少有 ${k} 个？`,
      ),
      answer,
      form: "integer",
      wrong: [boxes * k, answer - 1, boxes + k - 1],
      solution: t(
        `With $${boxes} \\cdot ${k - 1} = ${answer - 1}$ objects, every box can hold exactly ${k - 1}, so that is not enough. With ${answer} objects, assuming every box holds at most ${k - 1} allows only ${answer - 1} objects, a contradiction.`,
        `有 $${boxes} \\cdot ${k - 1} = ${answer - 1}$ 个物体时，每个盒子可以恰好放 ${k - 1} 个，所以还不够。有 ${answer} 个物体时，假设每个盒子至多放 ${k - 1} 个，最多只能放 ${answer - 1} 个，矛盾。`,
      ),
    });
  },
};

/** factorPairs lists the factor pairs (d, e) of c with d < e and with d and e of the same parity. */
const factorPairs = (c: number) =>
  divisorsOf(c)
    .filter((d) => d * d < c && (c / d - d) % 2 === 0)
    .map((d) => [d, c / d] as const);

const rationalShiftedSquare: KnowledgePointDef = {
  id: "when-a-shifted-square-has-a-rational-root",
  title: t("When a shifted square has a rational root", "平方数平移后的根何时为有理数"),
  explanation: t(
    "The standard contradiction shows that the square root of a positive integer is either an integer or irrational, and never a fraction in between. So asking whether a root is rational is the same as asking whether the integer under it is a perfect square. A difference of two squares then factors, which turns the condition into a search through factor pairs.",
    "标准的反证法说明，正整数的平方根要么是整数，要么是无理数，绝不会是中间的分数。所以问根式是否为有理数，就是问根号下的整数是否为完全平方数。两个平方数之差可以因式分解，于是这个条件就变成了对因数对的搜索。",
  ),
  generate(rng) {
    const usable = [...Array(118).keys()].map((i) => i + 3).filter((v) => factorPairs(v).length > 0);
    const c = rng.pick(usable);
    const pairs = factorPairs(c);
    const answer = pairs.length;
    const values = pairs.map(([d, e]) => (e - d) / 2);
    const allPairs = divisorsOf(c).filter((d) => d * d < c).length;
    const listed = pairs.map(([d, e]) => `(${d}, ${e})`).join(", ");
    return numberProblem({
      prompt: t(
        `For how many positive integers $n$ is $\\sqrt{n^2 + ${c}}$ rational?`,
        `对多少个正整数 $n$，$\\sqrt{n^2 + ${c}}$ 是有理数？`,
      ),
      answer,
      form: "integer",
      wrong: [allPairs, answer + 1, divisorsOf(c).length, values[0] ?? 0],
      solution: t(
        `The root is rational only if it is an integer $m$, and then $(m - n)(m + n) = ${c}$. The factors differ by $2n$, so they have the same parity and the first is smaller. ${answer === 1 ? `The only such factor pair is ${listed}, which gives $n = ${values.join(", ")}$.` : `The factor pairs are ${listed}, which give $n = ${values.join(", ")}$.`} So there ${answer === 1 ? "is 1 value" : `are ${answer} values`}.`,
        `根式为有理数时只能是整数 $m$，这时 $(m - n)(m + n) = ${c}$。两个因数相差 $2n$，所以奇偶性相同，且第一个较小。这样的因数对是 ${listed}，给出 $n = ${values.join(", ")}$。所以有 ${answer} 个值。`,
      ),
    });
  },
};

const leastPositiveBezoutY: KnowledgePointDef = {
  id: "the-bezout-solution-with-the-least-positive-y",
  title: t("The Bézout solution with the least positive $y$", "$y$ 最小且为正的贝祖解"),
  explanation: t(
    "One Bézout pair gives all the others. Adding the same multiple of the lcm to one term and removing it from the other keeps the total fixed. So after dividing out the gcd, $x$ moves in steps of the reduced second coefficient and $y$ moves in steps of the reduced first coefficient, in opposite directions. This lets you slide to the solution you want.",
    "一组贝祖系数可以给出其他所有的贝祖系数。给一项加上最小公倍数的某个倍数，同时从另一项减去它，总和不变。所以约去最大公因数后，$x$ 以约简后的第二个系数为步长，$y$ 以约简后的第一个系数为步长，方向相反地变化。这样就能滑动到想要的解。",
  ),
  generate(rng) {
    const g = rng.int(1, 6);
    const pairs = [...Array(21).keys()]
      .map((i) => i + 5)
      .flatMap((u) => [...Array(u - 3).keys()].map((i) => [u, i + 3] as const))
      .filter(([u, v]) => gcd(u, v) === 1);
    const [u, v] = rng.pick(pairs);
    const a = g * u;
    const b = g * v;
    const [, y0] = bezoutPair(u, v);
    const y = ((y0 % u) + u) % u;
    const x = (1 - v * y) / u;
    const k = rng.int(1, 3);
    const givenX = x + k * v;
    const givenY = y - k * u;
    return numberProblem({
      prompt: t(
        `Given $${a}(${givenX}) + ${b}(${givenY}) = ${g}$, find the least positive value of $y$ among the integer solutions of $${a}x + ${b}y = ${g}$.`,
        `已知 $${a}(${givenX}) + ${b}(${givenY}) = ${g}$，在 $${a}x + ${b}y = ${g}$ 的整数解中，求 $y$ 的最小正值。`,
      ),
      answer: y,
      form: "integer",
      wrong: [y + u, u - y, v, -givenY],
      solution: t(
        `Since $${a} \\cdot ${v} = ${b} \\cdot ${u}$, subtracting ${v} from $x$ while adding ${u} to $y$ keeps the sum fixed, and every solution comes this way. Adding ${u} to $${givenY}$ repeatedly reaches $y = ${y}$ as the first positive value, with $x = ${x}$. Check: $${a}(${x}) + ${b}(${y}) = ${g}$.`,
        `由于 $${a} \\cdot ${v} = ${b} \\cdot ${u}$，从 $x$ 减去 ${v}，同时给 $y$ 加上 ${u}，总和不变，而且所有解都这样得到。从 $${givenY}$ 起反复加 ${u}，第一个正值是 $y = ${y}$，此时 $x = ${x}$。验算：$${a}(${x}) + ${b}(${y}) = ${g}$。`,
      ),
    });
  },
};

const largestUnmakeableAmount: KnowledgePointDef = {
  id: "the-largest-amount-that-two-stamps-cannot-make",
  title: t("The largest amount that two stamps cannot make", "两种邮票凑不出的最大面值"),
  explanation: t(
    "Strong induction suits claims that reach back several steps. If a run of consecutive amounts as long as one stamp's value can all be made, then every later amount can be made too, by adding that stamp to an amount in the run or later. So finding where the run begins also finds the last amount that cannot be made.",
    "强归纳法适合需要回溯好几步的命题。如果连续若干个面值都能凑出，且个数等于一种邮票的面值，那么之后的每个面值也都能凑出，只要在这段或更后的某个面值上再加一张这种邮票。所以找到这一段的起点，也就找到了最后一个凑不出的面值。",
  ),
  generate(rng) {
    const pairs = [...Array(11).keys()]
      .map((i) => i + 3)
      .flatMap((a) => [...Array(16 - a).keys()].map((i) => [a, a + 1 + i] as const))
      .filter(([a, b]) => b <= 15 && gcd(a, b) === 1);
    const [a, b] = rng.pick(pairs);
    const answer = a * b - a - b;
    return numberProblem({
      prompt: t(
        `Stamps come in values of ${a} and ${b}, with as many of each as needed. What is the largest whole amount that cannot be made exactly?`,
        `邮票有 ${a} 和 ${b} 两种面值，每种数量不限。不能恰好凑出的最大整数面值是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [a * b, a * b - a, a * b - b, answer + 1],
      solution: t(
        `Every amount from $${answer + 1}$ on can be made: the ${a} amounts starting there can be checked directly, and strong induction adds a stamp of ${a} to reach the rest. If $${answer} = ${a}x + ${b}y$ with $x, y \\ge 0$, then $${a}(x + 1) + ${b}(y + 1) = ${a * b}$, which forces $x + 1 \\ge ${b}$ and $y + 1 \\ge ${a}$. The left side would then be at least $${2 * a * b}$, a contradiction. So the answer is ${answer}.`,
        `从 $${answer + 1}$ 起的每个面值都能凑出：从那里开始的 ${a} 个面值可以直接检验，再用强归纳法加一张 ${a} 的邮票得到其余面值。如果 $${answer} = ${a}x + ${b}y$，其中 $x, y \\ge 0$，那么 $${a}(x + 1) + ${b}(y + 1) = ${a * b}$，这迫使 $x + 1 \\ge ${b}$ 且 $y + 1 \\ge ${a}$。于是左边至少是 $${2 * a * b}$，矛盾。所以答案是 ${answer}。`,
      ),
    });
  },
};

const termsOutsideABand: KnowledgePointDef = {
  id: "counting-the-terms-outside-an-epsilon-band",
  title: t("Counting the terms outside an epsilon band", "数 $\\varepsilon$ 带之外的项"),
  explanation: t(
    "A null sequence is one that, for every positive tolerance, has only finitely many terms outside the band around zero. Saying that all terms from some index on are inside is the same as saying that only a finite number stay out. For a decreasing sequence, these outside terms are exactly the first ones, so they can be counted by solving one inequality.",
    "零序列是指，对每个正的容许误差，零附近的带之外只有有限多项。说从某一项起所有项都在带内，和说只有有限项留在带外，是一回事。对递减序列，带外的项恰好是最前面的那些，所以解一个不等式就能数出它们。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const k = rng.int(3, 20);
    const s = rng.int(1, Math.min(9, a * k - 1));
    const reach = a * k;
    const answer = reach - s;
    const term = `\\dfrac{${a}}{n + ${s}}`;
    return numberProblem({
      prompt: t(
        `Let $a_n = ${term}$ and $\\varepsilon = \\dfrac{1}{${k}}$. How many positive integers $n$ have $|a_n| \\ge \\varepsilon$?`,
        `设 $a_n = ${term}$，$\\varepsilon = \\dfrac{1}{${k}}$。有多少个正整数 $n$ 满足 $|a_n| \\ge \\varepsilon$？`,
      ),
      answer,
      form: "integer",
      wrong: [reach, answer + 1, answer - 1],
      solution: t(
        `The condition $${term} \\ge \\dfrac{1}{${k}}$ means $n + ${s} \\le ${a} \\cdot ${k} = ${reach}$, so $n \\le ${answer}$. That is ${answer === 1 ? "1 positive integer" : `${answer} positive integers`}.`,
        `条件 $${term} \\ge \\dfrac{1}{${k}}$ 就是 $n + ${s} \\le ${a} \\cdot ${k} = ${reach}$，所以 $n \\le ${answer}$。共 ${answer} 个正整数。`,
      ),
    });
  },
};

const increasingFunctions: KnowledgePointDef = {
  id: "counting-strictly-increasing-functions",
  title: t("Counting strictly increasing functions", "数严格递增函数"),
  explanation: t(
    "A strictly increasing function between sets of integers is automatically injective, because different inputs have different outputs. It is also fixed by its range, since the outputs must appear in increasing order, leaving just one way to assign them. So choosing such a function is the same as choosing its set of outputs, which is a subset rather than an arrangement.",
    "整数集之间的严格递增函数自动是单射，因为不同的输入有不同的输出。它也由值域决定，因为输出必须按递增顺序排列，只有一种分配方式。所以选这样的函数就等于选它的输出集合，这是一个子集，而不是一种排列。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const n = rng.int(m + 1, 12);
    const answer = binom(n, m);
    const arrangements = binom(n, m) * factorial(m);
    return numberProblem({
      prompt: t(
        `How many strictly increasing functions are there from $${firstIntegers(m)}$ to $${firstIntegers(n)}$?`,
        `从 $${firstIntegers(m)}$ 到 $${firstIntegers(n)}$ 有多少个严格递增函数？`,
      ),
      answer,
      form: "integer",
      wrong: [arrangements, n ** m, binom(n + m - 1, m)],
      solution: t(
        `Such a function is fixed by its ${m} outputs, which must then be assigned in increasing order. So the count is $\\binom{${n}}{${m}} = ${answer}$.`,
        `这样的函数由它的 ${m} 个输出决定，这些输出只能按递增顺序分配。所以个数是 $\\binom{${n}}{${m}} = ${answer}$。`,
      ),
    });
  },
};

const fixedPointBijections: KnowledgePointDef = {
  id: "bijections-with-exactly-k-fixed-points",
  title: t("Bijections with a given number of fixed points", "恰有给定个数不动点的双射"),
  explanation: t(
    "A fixed point of a bijection is an input sent to itself. To count bijections with a given number of them, choose the fixed points, and then rearrange the rest so that nothing stays put. The bijections with no fixed point at all satisfy $D_m = (m - 1)(D_{m-1} + D_{m-2})$, with $D_0 = 1$ and $D_1 = 0$, which are found by following where one element goes.",
    "双射的不动点是映到自身的输入。要数恰有给定个数不动点的双射，先选出不动点，再重排其余元素，使它们都不留在原位。完全没有不动点的双射满足 $D_m = (m - 1)(D_{m-1} + D_{m-2})$，其中 $D_0 = 1$，$D_1 = 0$，这是通过追踪一个元素的去向得到的。",
  ),
  generate(rng) {
    const n = rng.int(3, 9);
    const k = rng.int(0, n - 2);
    const left = n - k;
    const moved = derangements(left);
    const answer = binom(n, k) * moved;
    const ways = moved === 1 ? "1 way" : `${moved} ways`;
    return numberProblem({
      prompt:
        k === 0
          ? t(
              `How many bijections $f$ from $${firstIntegers(n)}$ to itself have no $x$ with $f(x) = x$?`,
              `从 $${firstIntegers(n)}$ 到自身的双射 $f$ 中，有多少个不存在满足 $f(x) = x$ 的 $x$？`,
            )
          : t(
              `How many bijections $f$ from $${firstIntegers(n)}$ to itself have exactly ${k === 1 ? "one $x$" : `${k} values of $x$`} with $f(x) = x$?`,
              `从 $${firstIntegers(n)}$ 到自身的双射 $f$ 中，有多少个恰有 ${k} 个 $x$ 满足 $f(x) = x$？`,
            ),
      answer,
      form: "integer",
      wrong: [factorial(n), binom(n, k) * factorial(left), moved, factorial(left), answer + 1],
      solution:
        k === 0
          ? t(
              `All ${n} values must move. The recurrence $D_m = (m - 1)(D_{m-1} + D_{m-2})$ gives $D_{${n}} = ${answer}$.`,
              `${n} 个值都必须移动。由递推式 $D_m = (m - 1)(D_{m-1} + D_{m-2})$ 得 $D_{${n}} = ${answer}$。`,
            )
          : t(
              `Choose the fixed points in $\\binom{${n}}{${k}} = ${binom(n, k)}$ ways. The other ${left} values must all move, which can be done in ${ways}. The product is ${answer}.`,
              `选出不动点有 $\\binom{${n}}{${k}} = ${binom(n, k)}$ 种方式。其余 ${left} 个值都必须移动，有 ${moved} 种方式。乘积是 ${answer}。`,
            ),
    });
  },
};

const reducedFractions: KnowledgePointDef = {
  id: "counting-reduced-fractions-by-denominator",
  title: t("Counting reduced fractions by denominator", "按分母数既约分数"),
  explanation: t(
    "The rationals are countable because they can be listed by denominator, and each denominator contributes only finitely many fractions to a bounded interval. Each rational has exactly one form in lowest terms, so nothing is counted twice. In a unit interval, the number of reduced fractions with a given denominator is the number of numerators coprime to it, which is Euler's totient of that denominator.",
    "有理数可数，是因为可以按分母把它们列出来，而每个分母在有界区间内只贡献有限多个分数。每个有理数恰有一种既约形式，所以不会重复计算。在单位区间内，给定分母的既约分数个数，等于与分母互素的分子个数，也就是该分母的欧拉函数值。",
  ),
  generate(rng) {
    if (rng.pick([true, false])) {
      const top = rng.int(4, 25);
      const parts = [...Array(top).keys()].map((i) => totient(i + 1));
      const answer = parts.reduce((sum, v) => sum + v, 0);
      return numberProblem({
        prompt: t(
          `How many rational numbers in $(0, 1]$ have a denominator of at most ${top} in lowest terms?`,
          `$(0, 1]$ 中有多少个有理数的既约形式的分母不超过 ${top}？`,
        ),
        answer,
        form: "integer",
        wrong: [(top * (top + 1)) / 2, answer - 1, top],
        solution: t(
          `Denominator $q$ gives one fraction for each numerator coprime to $q$, so it contributes $\\varphi(q)$ fractions. Adding from $q = 1$ to $q = ${top}$ gives $${parts.join(" + ")} = ${answer}$.`,
          `分母 $q$ 对每个与 $q$ 互素的分子给出一个分数，所以贡献 $\\varphi(q)$ 个分数。从 $q = 1$ 加到 $q = ${top}$，得 $${parts.join(" + ")} = ${answer}$。`,
        ),
      });
    }
    const q = rng.int(3, 30);
    const width = rng.int(1, 5);
    const phi = totient(q);
    const answer = width * phi;
    return numberProblem({
      prompt: t(
        `How many rational numbers in $(0, ${width}]$ have denominator exactly ${q} in lowest terms?`,
        `$(0, ${width}]$ 中有多少个有理数的既约形式的分母恰好是 ${q}？`,
      ),
      answer,
      form: "integer",
      wrong: [width * q, width * (q - 1), width * phi + 1, ...(width === 1 ? [] : [phi])],
      solution:
        width === 1
          ? t(
              `A fraction with this denominator is reduced exactly when its numerator is coprime to ${q}, and there are $\\varphi(${q}) = ${phi}$ such numerators up to ${q}.`,
              `分母为 ${q} 的分数是既约的，当且仅当分子与 ${q} 互素，而不超过 ${q} 的这样的分子有 $\\varphi(${q}) = ${phi}$ 个。`,
            )
          : t(
              `Each unit interval holds $\\varphi(${q}) = ${phi}$ reduced fractions with this denominator, because the numerators coprime to ${q} repeat with period ${q}. Over ${width} unit intervals, that gives $${width} \\cdot ${phi} = ${answer}$.`,
              `每个单位区间内有 $\\varphi(${q}) = ${phi}$ 个分母为 ${q} 的既约分数，因为与 ${q} 互素的分子以 ${q} 为周期重复。${width} 个单位区间共有 $${width} \\cdot ${phi} = ${answer}$ 个。`,
            ),
    });
  },
};

const cycleLengthOfPowers: KnowledgePointDef = {
  id: "the-cycle-length-of-powers-modulo-n",
  title: t("The cycle length of powers modulo $n$", "模 $n$ 的幂的循环长度"),
  explanation: t(
    "Because a congruence can be multiplied by the same number on both sides, each power's remainder is decided by the one before it. Once a power of a number coprime to the modulus reaches remainder $1$, the next power repeats the base, and the whole cycle starts over. This is why very large powers can be reduced by working with the length of that cycle.",
    "由于同余式两边可以乘同一个数，每个幂的余数都由前一个幂的余数决定。与模互素的数的某个幂的余数一旦为 $1$，下一个幂就回到底数，整个循环重新开始。这就是可以利用循环长度化简很大的幂的原因。",
  ),
  generate(rng) {
    const pairs = [...Array(11).keys()]
      .map((i) => i + 2)
      .flatMap((a) => [...Array(27).keys()].map((i) => [a, i + 5] as const))
      .filter(([a, m]) => gcd(a, m) === 1 && a % m !== 1);
    const [a, m] = rng.pick(pairs);
    const remainders = [a % m];
    while (remainders[remainders.length - 1] !== 1) remainders.push(((remainders[remainders.length - 1] ?? 1) * a) % m);
    const answer = remainders.length;
    return numberProblem({
      prompt: t(
        `What is the smallest positive integer $k$ with $${a}^k \\equiv 1 \\pmod{${m}}$?`,
        `满足 $${a}^k \\equiv 1 \\pmod{${m}}$ 的最小正整数 $k$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [totient(m), m - 1, answer + 1],
      solution: t(
        `Multiplying by ${a} and reducing modulo ${m} at each step, the powers of ${a} leave the remainders ${remainders.join(", ")}. The first remainder of 1 is number ${answer} in this list, so $k = ${answer}$.`,
        `每步乘以 ${a} 并对 ${m} 取模，${a} 的各次幂的余数依次是 ${remainders.join(", ")}。余数 1 第一次出现在第 ${answer} 个位置，所以 $k = ${answer}$。`,
      ),
    });
  },
};

const atMostOnePartner: KnowledgePointDef = {
  id: "counting-relations-with-at-most-one-partner",
  title: t("Counting relations with at most one partner", "数至多有一个对应元素的关系"),
  explanation: t(
    "A relation is a function when each element of the first set has exactly one partner. Relaxing this to at most one partner gives each element one more option, namely having no partner at all. The choices are still independent, so the count is again a power. If the elements that do have partners are specified, choose those first and then their partners.",
    "当第一个集合的每个元素恰有一个对应元素时，关系就是函数。把条件放宽为至多一个对应元素，每个元素就多了一种选择，也就是没有对应元素。这些选择仍然相互独立，所以个数还是一个幂。如果规定了哪些元素有对应元素的个数，就先选出这些元素，再选它们的对应元素。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const n = rng.int(2, 6);
    if (rng.pick([true, false])) {
      const answer = (n + 1) ** m;
      return numberProblem({
        prompt: t(
          `How many relations from a set of ${m} elements to a set of ${n} elements relate each element of the first set to at most one element of the second?`,
          `从 ${m} 元集合到 ${n} 元集合的关系中，有多少个使第一个集合的每个元素至多与第二个集合的一个元素相关？`,
        ),
        answer,
        form: "integer",
        wrong: [n ** m, 2 ** (m * n), m * n],
        solution: t(
          `Each of the ${m} elements either has one of ${n} partners or has none, which is ${n + 1} choices. So the count is $${n + 1}^{${m}} = ${answer}$.`,
          `${m} 个元素各自要么有 ${n} 个对应元素之一，要么没有，共 ${n + 1} 种选择。所以个数是 $${n + 1}^{${m}} = ${answer}$。`,
        ),
      });
    }
    const d = rng.int(1, m - 1);
    const answer = binom(m, d) * n ** d;
    return numberProblem({
      prompt: t(
        `A relation from a set of ${m} elements to a set of ${n} elements relates each element of the first set to at most one element of the second. How many such relations have exactly ${d === 1 ? "one element" : `${d} elements`} of the first set with a partner?`,
        `从 ${m} 元集合到 ${n} 元集合的关系使第一个集合的每个元素至多与第二个集合的一个元素相关。这样的关系中，有多少个使第一个集合恰有 ${d} 个元素有对应元素？`,
      ),
      answer,
      form: "integer",
      wrong: [n ** d, (n + 1) ** m, binom(m * n, d)],
      solution: t(
        `Choose the elements with partners in $\\binom{${m}}{${d}} = ${binom(m, d)}$ ways. Their partners can then be picked in ${n ** d} ways, so the count is $${binom(m, d)} \\cdot ${n ** d} = ${answer}$.`,
        `选出有对应元素的元素有 $\\binom{${m}}{${d}} = ${binom(m, d)}$ 种方式。再选它们的对应元素有 ${n ** d} 种方式，所以个数是 $${binom(m, d)} \\cdot ${n ** d} = ${answer}$。`,
      ),
    });
  },
};

const relationsByClassCount: KnowledgePointDef = {
  id: "equivalence-relations-with-a-given-number-of-classes",
  title: t("Equivalence relations with a given number of classes", "恰有给定个数等价类的等价关系"),
  explanation: t(
    "Equivalence relations on a set correspond exactly to partitions of it, because a relation's classes form a partition and a partition's blocks define a relation. To count them by number of classes, follow the last element. It either forms a class alone or joins one of the classes of a partition of the other elements. This gives a recurrence that builds the counts.",
    "集合上的等价关系和它的划分一一对应，因为关系的等价类构成划分，而划分的块定义一个关系。要按等价类的个数来数，就追踪最后一个元素。它要么单独成为一类，要么加入其余元素的某个划分的一类。这就给出了一个递推式，可以逐步算出这些个数。",
  ),
  generate(rng) {
    const n = rng.int(3, 10);
    const k = rng.int(2, n - 1);
    const answer = stirling(n, k);
    const alone = stirling(n - 1, k - 1);
    const joining = stirling(n - 1, k);
    return numberProblem({
      prompt: t(
        `How many equivalence relations on a set of ${n} elements have exactly ${k} equivalence classes?`,
        `${n} 元集合上有多少个等价关系恰有 ${k} 个等价类？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n, k), k ** n, answer * factorial(k)],
      solution: t(
        `Let $S(n, k)$ be this count. The last element is alone or joins one of the ${k} classes of the others, so $S(${n}, ${k}) = S(${n - 1}, ${k - 1}) + ${k} \\cdot S(${n - 1}, ${k}) = ${alone} + ${k} \\cdot ${joining} = ${answer}$.`,
        `设 $S(n, k)$ 是这个个数。最后一个元素要么单独成类，要么加入其余元素的 ${k} 个类之一，所以 $S(${n}, ${k}) = S(${n - 1}, ${k - 1}) + ${k} \\cdot S(${n - 1}, ${k}) = ${alone} + ${k} \\cdot ${joining} = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** oneTo lists the integers from 1 to n. */
const oneTo = (n: number) => [...Array(n).keys()].map((i) => i + 1);

/** powerLatex writes a prime power, leaving out an exponent of 1. */
const powerLatex = (base: number, exponent: number) => (exponent === 1 ? `${base}` : `${base}^{${exponent}}`);

const setOfSquares: KnowledgePointDef = {
  id: "the-size-of-a-set-of-squares",
  title: t("The size of a set of squares", "平方数集合的大小"),
  explanation: t(
    "A set lists each element once, however many times the condition produces it. In the set of $x^2$ with $x$ running from $-a$ to $b$, the values $x$ and $-x$ give the same square, so counting the values of $x$ overcounts. Only the sizes $0, 1, 2, \\dots$ matter, and these reach up to the larger of $a$ and $b$. So the size of the set is one more than that larger number.",
    "集合中每个元素只列一次，不管条件产生它多少次。在 $x$ 从 $-a$ 取到 $b$ 的 $x^2$ 的集合中，$x$ 和 $-x$ 给出相同的平方，所以数 $x$ 的个数会数多。只有绝对值 $0, 1, 2, \\dots$ 起作用，它们最大取到 $a$ 和 $b$ 中较大的数。所以集合的大小是这个较大的数加一。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const b = rng.pick(oneTo(12).filter((v) => v !== a));
    const top = Math.max(a, b);
    const answer = top + 1;
    return numberProblem({
      prompt: t(
        `How many elements does the set $\\{x^2 : x \\in \\mathbb{Z},\\ -${a} \\le x \\le ${b}\\}$ have?`,
        `集合 $\\{x^2 : x \\in \\mathbb{Z},\\ -${a} \\le x \\le ${b}\\}$ 有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [a + b + 1, Math.min(a, b) + 1, a + b, top],
      solution: t(
        `The squares are those of $0, 1, \\dots, ${top}$, since a negative value repeats the square of its opposite. That gives $${answer}$ elements.`,
        `这些平方是 $0, 1, \\dots, ${top}$ 的平方，因为负值只是重复其相反数的平方。所以有 $${answer}$ 个元素。`,
      ),
    });
  },
};

const quadraticTruthSet: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-quadratic-inequality",
  title: t("Counting the truth set of a quadratic inequality", "计算二次不等式真值集的大小"),
  explanation: t(
    "The truth set of a predicate over the integers is often a run of consecutive integers. When a quadratic with positive leading coefficient factors as $(x - r)(x - s)$, it is negative exactly between its roots. The inequality $\\le 0$ includes both roots, and the strict inequality $< 0$ leaves them out. So the two versions differ by exactly two elements, which is why one must read the sign carefully before counting.",
    "整数上谓词的真值集常常是一段连续的整数。当首项系数为正的二次式分解为 $(x - r)(x - s)$ 时，它恰好在两根之间为负。不等式 $\\le 0$ 包含两个根，严格不等式 $< 0$ 不包含。所以两种情况恰好差两个元素，这就是为什么计数前要仔细看符号。",
  ),
  generate(rng) {
    const r = rng.int(-9, 6);
    const s = r + rng.int(2, 9);
    const strict = rng.pick([true, false]);
    const answer = strict ? s - r - 1 : s - r + 1;
    const form = poly([1, "x^2"], [-(r + s), "x"], [r * s, ""]);
    const sign = strict ? "<" : "\\le";
    return numberProblem({
      prompt: t(`How many integers $x$ make the predicate $${form} ${sign} 0$ true?`, `有多少个整数 $x$ 使谓词 $${form} ${sign} 0$ 为真？`),
      answer,
      form: "integer",
      wrong: [s - r, strict ? s - r + 1 : s - r - 1, s - r + 2, Math.abs(s) + 1],
      solution: t(
        `The quadratic has roots $${r}$ and $${s}$, and it is negative between them. ${strict ? "The roots themselves are excluded" : "The roots themselves are included"}, which leaves $${answer}$ integers.`,
        `二次式的根是 $${r}$ 和 $${s}$，在它们之间为负。${strict ? "根本身不包含在内" : "根本身包含在内"}，所以有 $${answer}$ 个整数。`,
      ),
    });
  },
};

const notBetweenCount: KnowledgePointDef = {
  id: "counting-the-values-outside-a-negated-conjunction",
  title: t("Counting the values outside a negated conjunction", "计算否定合取之外的值"),
  explanation: t(
    "By De Morgan's law, the negation of $x > a \\land x < b$ is $x \\le a \\lor x \\ge b$. Notice that the strict inequalities become non-strict, so that $a$ and $b$ themselves satisfy the negation. On a finite domain, the truth set of a negation is the complement of the original truth set. So it is usually quickest to count the values that satisfy the conjunction, and then to subtract this from the size of the domain.",
    "由德摩根律，$x > a \\land x < b$ 的否定是 $x \\le a \\lor x \\ge b$。注意严格不等式变成了非严格的，所以 $a$ 和 $b$ 本身满足否定。在有限论域上，否定的真值集是原真值集的补集。所以通常最快的方法是数满足合取的值，再从论域的大小中减去。",
  ),
  generate(rng) {
    const n = rng.int(12, 60);
    const a = rng.int(1, n - 4);
    const b = a + rng.int(3, Math.min(10, n - a));
    const inside = b - a - 1;
    const answer = n - inside;
    return numberProblem({
      prompt: t(
        `On the domain $\\{1, 2, \\dots, ${n}\\}$, how many values of $x$ make $\\neg(x > ${a} \\land x < ${b})$ true?`,
        `在论域 $\\{1, 2, \\dots, ${n}\\}$ 上，有多少个 $x$ 使 $\\neg(x > ${a} \\land x < ${b})$ 为真？`,
      ),
      answer,
      form: "integer",
      wrong: [inside, answer - 1, answer - 2, n],
      solution: t(
        `The conjunction holds for the $${inside}$ integers strictly between ${a} and ${b}. The negation holds for the other $${n} - ${inside} = ${answer}$ values.`,
        `合取对严格介于 ${a} 和 ${b} 之间的 $${inside}$ 个整数成立。否定对其余 $${n} - ${inside} = ${answer}$ 个值成立。`,
      ),
    });
  },
};

const conditionalFromSizes: KnowledgePointDef = {
  id: "the-size-of-the-truth-set-of-a-conditional",
  title: t("The size of the truth set of a conditional", "条件句真值集的大小"),
  explanation: t(
    "The conditional $P(x) \\Rightarrow Q(x)$ fails only where $P$ holds and $Q$ does not. In terms of sets, its truth set is the complement of $P \\setminus Q$. The number of elements in $P \\setminus Q$ is $|P| - |P \\cap Q|$, so the conditional holds for all the remaining elements of the domain. Elements outside $P$ all count as true, whether or not they lie in $Q$, and that is the easy part to overlook.",
    "条件句 $P(x) \\Rightarrow Q(x)$ 只在 $P$ 成立而 $Q$ 不成立时为假。用集合的语言，它的真值集是 $P \\setminus Q$ 的补集。$P \\setminus Q$ 的元素个数是 $|P| - |P \\cap Q|$，所以条件句对论域中所有其余元素成立。$P$ 之外的元素都算真，不管它们是否在 $Q$ 中，这是容易忽略的部分。",
  ),
  generate(rng) {
    const both = rng.int(1, 12);
    const onlyP = rng.int(1, 15);
    const onlyQ = rng.int(1, 15);
    const neither = rng.int(1, 20);
    const size = both + onlyP + onlyQ + neither;
    const p = both + onlyP;
    const q = both + onlyQ;
    const answer = size - onlyP;
    return numberProblem({
      prompt: t(
        `In a domain of ${size} elements, $P(x)$ holds for ${p}, $Q(x)$ holds for ${q}, and both hold for ${both}. For how many elements is $P(x) \\Rightarrow Q(x)$ true?`,
        `在 ${size} 个元素的论域中，$P(x)$ 对 ${p} 个成立，$Q(x)$ 对 ${q} 个成立，两者都对 ${both} 个成立。$P(x) \\Rightarrow Q(x)$ 对多少个元素为真？`,
      ),
      answer,
      form: "integer",
      wrong: [both, size - p, size - both, size - q + both, onlyP],
      solution: t(
        `It fails where $P$ holds without $Q$, which is $${p} - ${both} = ${onlyP}$ elements. So it is true for $${size} - ${onlyP} = ${answer}$.`,
        `它在 $P$ 成立而 $Q$ 不成立时为假，这样的元素有 $${p} - ${both} = ${onlyP}$ 个。所以它对 $${size} - ${onlyP} = ${answer}$ 个元素为真。`,
      ),
    });
  },
};

const whereExistsFails: KnowledgePointDef = {
  id: "counting-the-values-where-an-inner-exists-fails",
  title: t("Counting the values where an inner exists fails", "计算内层存在量词不成立的值"),
  explanation: t(
    "To disprove $\\forall x\\,\\exists y\\,P(x, y)$, one needs an $x$ for which $\\forall y\\,\\neg P(x, y)$ holds, meaning that no $y$ works. So each value of $x$ is tested on its own. When $P$ says that $x + y = k$, the only possible partner is $y = k - x$, and the question is whether this number lies in the domain of $y$. Each $x$ whose partner lies outside is a counterexample to the statement.",
    "要否定 $\\forall x\\,\\exists y\\,P(x, y)$，需要一个 $x$ 使 $\\forall y\\,\\neg P(x, y)$ 成立，也就是没有 $y$ 可行。所以要逐个检验 $x$ 的每个值。当 $P$ 表示 $x + y = k$ 时，唯一可能的搭档是 $y = k - x$，问题是这个数是否在 $y$ 的论域中。搭档落在论域之外的每个 $x$ 都是这个命题的反例。",
  ),
  generate(rng) {
    const n = rng.int(4, 20);
    const m = rng.int(4, 20);
    const k = rng.int(3, n + m);
    const good = oneTo(n).filter((x) => k - x >= 1 && k - x <= m).length;
    const answer = n - good;
    return numberProblem({
      prompt: t(
        `Let $x$ range over $\\{1, \\dots, ${n}\\}$ and $y$ over $\\{1, \\dots, ${m}\\}$. For how many values of $x$ is $\\neg\\exists y\\,(x + y = ${k})$ true?`,
        `设 $x$ 取遍 $\\{1, \\dots, ${n}\\}$，$y$ 取遍 $\\{1, \\dots, ${m}\\}$。有多少个 $x$ 使 $\\neg\\exists y\\,(x + y = ${k})$ 为真？`,
      ),
      answer,
      form: "integer",
      wrong: [good, Math.abs(n - m), n, answer + 1],
      solution: t(
        `A partner $y = ${k} - x$ exists for $${good}$ of the values of $x$, since it must lie between 1 and ${m}. This leaves $${n} - ${good} = ${answer}$ values without one.`,
        `$y = ${k} - x$ 必须在 1 和 ${m} 之间，这对 $${good}$ 个 $x$ 成立。所以没有搭档的值有 $${n} - ${good} = ${answer}$ 个。`,
      ),
    });
  },
};

const oddExpressionPairs: KnowledgePointDef = {
  id: "counting-the-pairs-that-make-an-expression-odd",
  title: t("Counting the pairs that make an expression odd", "计算使表达式为奇数的数对"),
  explanation: t(
    "A proof about parity often starts by factoring. Since $mn + m = m(n + 1)$, the expression is a product, and a product is odd exactly when every factor is odd. So $m$ must be odd and $n + 1$ must be odd, which means that $n$ is even. These two conditions are independent of each other, so the number of pairs is a simple product of the number of odd $m$ and the number of even $n$.",
    "关于奇偶性的证明常常从因式分解开始。由于 $mn + m = m(n + 1)$，表达式是乘积，而乘积为奇数当且仅当每个因子都是奇数。所以 $m$ 必须是奇数，$n + 1$ 必须是奇数，也就是 $n$ 是偶数。这两个条件相互独立，所以数对的个数就是奇数 $m$ 的个数与偶数 $n$ 的个数之积。",
  ),
  generate(rng) {
    const a = rng.int(2, 30);
    const b = rng.int(2, 30);
    const oddA = Math.ceil(a / 2);
    const evenA = Math.floor(a / 2);
    const evenB = Math.floor(b / 2);
    const oddB = Math.ceil(b / 2);
    const answer = oddA * evenB;
    return numberProblem({
      prompt: t(
        `How many pairs $(m, n)$ with $1 \\le m \\le ${a}$ and $1 \\le n \\le ${b}$ make $mn + m$ odd?`,
        `有多少个数对 $(m, n)$，$1 \\le m \\le ${a}$，$1 \\le n \\le ${b}$，使 $mn + m$ 为奇数？`,
      ),
      answer,
      form: "integer",
      wrong: [a * b - answer, oddA * oddB, evenA * evenB, answer + 1],
      solution: t(
        `Since $mn + m = m(n + 1)$, we need $m$ odd and $n$ even. There are $${oddA}$ odd values of $m$ and $${evenB}$ even values of $n$, so the count is $${answer}$.`,
        `由于 $mn + m = m(n + 1)$，需要 $m$ 为奇数且 $n$ 为偶数。奇数 $m$ 有 $${oddA}$ 个，偶数 $n$ 有 $${evenB}$ 个，所以个数是 $${answer}$。`,
      ),
    });
  },
};

const vacuousCases: KnowledgePointDef = {
  id: "counting-the-vacuous-cases-of-a-conditional",
  title: t("Counting the vacuous cases of a conditional", "计算条件句的空真情形"),
  explanation: t(
    "A conditional is vacuously true at a value where its hypothesis is false, and in that case its conclusion is never examined. This is why a universal claim only needs checking where the hypothesis holds. So the vacuous cases can be counted from the hypothesis alone, even if the conclusion looks relevant. In a domain of numbers, a hypothesis about divisibility is false for all the numbers that are not multiples of the divisor.",
    "在假设为假的值上，条件句是空真的，这时根本不用检查结论。这就是为什么全称命题只需要在假设成立的地方检查。所以只凭假设就能数出空真情形，即使结论看上去相关。在数的论域中，关于整除的假设对所有不是除数倍数的数都为假。",
  ),
  generate(rng) {
    const n = rng.int(12, 80);
    const d = rng.int(2, 9);
    const k = rng.int(2, n - 1);
    const multiples = Math.floor(n / d);
    const answer = n - multiples;
    return numberProblem({
      prompt: t(
        `On the domain $\\{1, 2, \\dots, ${n}\\}$, consider "if $${d} \\mid x$, then $x > ${k}$". For how many values of $x$ is this true vacuously?`,
        `在论域 $\\{1, 2, \\dots, ${n}\\}$ 上，考虑“如果 $${d} \\mid x$，那么 $x > ${k}$”。有多少个 $x$ 使它空真？`,
      ),
      answer,
      form: "integer",
      wrong: [multiples, n, n - k, answer + 1],
      solution: t(
        `It is vacuous when the hypothesis fails. There are $${multiples}$ multiples of ${d} in the domain, which leaves $${n} - ${multiples} = ${answer}$ values.`,
        `假设不成立时它是空真的。论域中有 $${multiples}$ 个 ${d} 的倍数，剩下 $${n} - ${multiples} = ${answer}$ 个值。`,
      ),
    });
  },
};

const sumOfDivisors: KnowledgePointDef = {
  id: "the-sum-of-the-divisors-of-a-number",
  title: t("The sum of the divisors of a number", "一个数的因数之和"),
  explanation: t(
    "Every divisor of $p^a q^b$ has the form $p^i q^j$, with $0 \\le i \\le a$ and $0 \\le j \\le b$. Adding all of them gives a product of two sums, $(1 + p + \\dots + p^a)(1 + q + \\dots + q^b)$, as expanding the product shows. So no list of divisors is needed, and the idea works just as well for more primes. A number's divisors always include 1 and the number itself.",
    "$p^a q^b$ 的每个因数都形如 $p^i q^j$，其中 $0 \\le i \\le a$，$0 \\le j \\le b$。把它们全部相加，得到两个和的乘积 $(1 + p + \\dots + p^a)(1 + q + \\dots + q^b)$，展开乘积就可以看出。所以不需要列出因数，这个想法对更多素数同样有效。一个数的因数总包含 1 和它本身。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [2, 3],
      [2, 5],
      [2, 7],
      [3, 5],
      [3, 7],
      [5, 7],
    ] as const);
    const a = rng.int(1, 3);
    const b = rng.int(1, 2);
    const n = p ** a * q ** b;
    const first = (p ** (a + 1) - 1) / (p - 1);
    const second = (q ** (b + 1) - 1) / (q - 1);
    const answer = first * second;
    return numberProblem({
      prompt: t(`Find the sum of all positive divisors of ${n}.`, `求 ${n} 的所有正因数之和。`),
      answer,
      form: "integer",
      wrong: [n + 1, (a + 1) * (b + 1), answer - n, answer + 1],
      solution: t(
        `Since $${n} = ${powerLatex(p, a)} \\cdot ${powerLatex(q, b)}$, the sum is $(${oneTo(a + 1)
          .map((i) => p ** (i - 1))
          .join(" + ")})(${oneTo(b + 1)
          .map((i) => q ** (i - 1))
          .join(" + ")}) = ${first} \\cdot ${second} = ${answer}$.`,
        `由于 $${n} = ${powerLatex(p, a)} \\cdot ${powerLatex(q, b)}$，和是 $(${oneTo(a + 1)
          .map((i) => p ** (i - 1))
          .join(" + ")})(${oneTo(b + 1)
          .map((i) => q ** (i - 1))
          .join(" + ")}) = ${first} \\cdot ${second} = ${answer}$。`,
      ),
    });
  },
};

const triangularMatrixCorner: KnowledgePointDef = {
  id: "the-corner-of-a-power-of-a-triangular-matrix",
  title: t("The corner of a power of a triangular matrix", "三角矩阵的幂的右上角"),
  explanation: t(
    "To guess a formula for the powers of $\\begin{pmatrix} r & a \\\\ 0 & r \\end{pmatrix}$, compute a few by hand. The corner entries come out as $a$, $2ra$, $3r^2a$, and so on, which suggests $nr^{n - 1}a$. Induction then proves it: multiplying by the matrix once more gives $r \\cdot nr^{n - 1}a + a \\cdot r^n = (n + 1)r^n a$. This has the same shape as the derivative of $r^n$, and that is no accident.",
    "要猜测 $\\begin{pmatrix} r & a \\\\ 0 & r \\end{pmatrix}$ 的幂的公式，先手算几个。右上角元素依次是 $a$、$2ra$、$3r^2a$ 等，这提示公式是 $nr^{n - 1}a$。然后用归纳法证明：再乘一次矩阵，得 $r \\cdot nr^{n - 1}a + a \\cdot r^n = (n + 1)r^n a$。它的形状与 $r^n$ 的导数相同，这并非巧合。",
  ),
  generate(rng) {
    const r = rng.int(2, 3);
    const a = rng.int(1, 9);
    const n = rng.int(3, 6);
    const answer = n * r ** (n - 1) * a;
    return numberProblem({
      prompt: t(
        `Find the top right entry of $\\begin{pmatrix} ${r} & ${a} \\\\ 0 & ${r} \\end{pmatrix}^{${n}}$.`,
        `求 $\\begin{pmatrix} ${r} & ${a} \\\\ 0 & ${r} \\end{pmatrix}^{${n}}$ 右上角的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [a * r ** (n - 1), n * r ** n * a, r ** n, n * a],
      solution: t(
        `The formula $nr^{n - 1}a$, which induction proves, gives $${n} \\cdot ${r}^{${n - 1}} \\cdot ${a} = ${answer}$.`,
        `归纳法证明的公式 $nr^{n - 1}a$ 给出 $${n} \\cdot ${r}^{${n - 1}} \\cdot ${a} = ${answer}$。`,
      ),
    });
  },
};

const floorPreimage: KnowledgePointDef = {
  id: "the-size-of-a-preimage-under-a-floor-function",
  title: t("The size of a preimage under a floor function", "取整函数下原像的大小"),
  explanation: t(
    "Proving surjectivity means finding a preimage for each value, and it can be useful to find all of them. The numbers with $\\lfloor \\frac{n}{k} \\rfloor = v$ are exactly the block $kv \\le n < k(v + 1)$, which has $k$ integers. On a finite domain, though, the first and last blocks can be cut short. If the domain starts at 1, the block for 0 loses the number 0, and the last block stops at the end of the domain.",
    "证明满射就是为每个值找一个原像，有时找出全部原像很有用。满足 $\\lfloor \\frac{n}{k} \\rfloor = v$ 的数恰好是一段 $kv \\le n < k(v + 1)$，有 $k$ 个整数。不过在有限论域上，第一段和最后一段可能被截短。如果论域从 1 开始，0 对应的一段就少了数 0，最后一段则停在论域的末尾。",
  ),
  generate(rng) {
    const k = rng.int(2, 9);
    const m = rng.int(2, 12);
    const r = rng.int(0, k - 1);
    const n = k * m + r;
    const v = rng.int(0, m);
    const preimage = oneTo(n).filter((x) => Math.floor(x / k) === v);
    const answer = preimage.length;
    return numberProblem({
      prompt: t(
        `Let $f : \\{1, 2, \\dots, ${n}\\} \\to \\mathbb{Z}$ with $f(x) = \\lfloor \\frac{x}{${k}} \\rfloor$. How many elements does the preimage $f^{-1}(\\{${v}\\})$ have?`,
        `设 $f : \\{1, 2, \\dots, ${n}\\} \\to \\mathbb{Z}$，$f(x) = \\lfloor \\frac{x}{${k}} \\rfloor$。原像 $f^{-1}(\\{${v}\\})$ 有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [k, k - 1, r + 1, k + 1, answer + 1, answer + 2],
      solution: t(
        `In the domain, the numbers with quotient ${v} on division by ${k} are $${preimage.join(", ")}$. So the size of the preimage is $${answer}$.`,
        `论域中除以 ${k} 的商为 ${v} 的数是 $${preimage.join(", ")}$。所以原像的大小是 $${answer}$。`,
      ),
    });
  },
};

const residueOfLongSum: KnowledgePointDef = {
  id: "the-residue-of-a-long-sum",
  title: t("The residue of a long sum", "长求和的剩余"),
  explanation: t(
    "The least nonnegative residue of a sum like $1 + 2 + \\dots + n$ can be found without adding the terms one by one. The closed form $\\frac{n(n + 1)}{2}$ gives the whole sum at once, and dividing that by the modulus gives the residue. Take care not to reduce $n$ first and then apply the formula, because the division by 2 does not always behave well with congruences. Reducing after computing the exact integer is always safe.",
    "像 $1 + 2 + \\dots + n$ 这样的和，其最小非负剩余不必逐项相加。封闭式 $\\frac{n(n + 1)}{2}$ 一下子给出整个和，再除以模就得到剩余。注意不要先化简 $n$ 再套公式，因为除以 2 与同余的配合并不总是可靠。算出精确的整数后再化简总是安全的。",
  ),
  generate(rng) {
    const n = rng.int(10, 200);
    const m = rng.int(3, 13);
    const sum = (n * (n + 1)) / 2;
    const answer = sum % m;
    const reduced = n % m;
    return numberProblem({
      prompt: t(
        `Find the least nonnegative residue of $1 + 2 + \\dots + ${n}$ modulo ${m}.`,
        `求 $1 + 2 + \\dots + ${n}$ 模 ${m} 的最小非负剩余。`,
      ),
      answer,
      form: "integer",
      wrong: [reduced, (n * (n + 1)) % m, ((reduced * (reduced + 1)) >> 1) % m, (answer + 1) % m],
      solution: t(
        `The sum is $\\frac{${n} \\cdot ${n + 1}}{2} = ${sum}$, and dividing by ${m} leaves the remainder $${answer}$.`,
        `和是 $\\frac{${n} \\cdot ${n + 1}}{2} = ${sum}$，除以 ${m} 余 $${answer}$。`,
      ),
    });
  },
};

const missingDigit: KnowledgePointDef = {
  id: "the-missing-digit-for-divisibility-by-nine",
  title: t("The missing digit for divisibility by nine", "被九整除所缺的数字"),
  explanation: t(
    "Since $10 \\equiv 1 \\pmod 9$, every power of 10 is also congruent to 1, and so a number is congruent to the sum of its digits modulo 9. This proves the digit test for divisibility by 9, and it turns a question about a long number into a question about a small sum. A missing digit must bring the digit sum to a multiple of 9, and among the digits only 0 and 9 have the same effect.",
    "由于 $10 \\equiv 1 \\pmod 9$，10 的每个幂也同余于 1，所以一个数模 9 同余于它的各位数字之和。这证明了被 9 整除的数字判别法，也把关于长数字的问题变成了关于小和数的问题。所缺的数字必须使数字和成为 9 的倍数，而在所有数字中只有 0 和 9 的效果相同。",
  ),
  generate(rng) {
    const first = rng.int(1, 9);
    const second = rng.int(0, 9);
    const third = rng.int(0, 9);
    const fourth = rng.int(0, 9);
    const base = first + second + third + fourth;
    const adjusted = (9 - (base % 9)) % 9 === 0 ? (fourth === 9 ? 8 : fourth + 1) : fourth;
    const known = first + second + third + adjusted;
    const answer = (9 - (known % 9)) % 9;
    const shown = `${first}${second}\\square${third}${adjusted}`;
    return numberProblem({
      prompt: t(
        `The digit $\\square$ makes the number $${shown}$ divisible by 9. Find the digit.`,
        `数字 $\\square$ 使 $${shown}$ 能被 9 整除。求这个数字。`,
      ),
      answer,
      form: "integer",
      wrong: [9 - answer, (answer + 3) % 10, answer + 1, answer === 1 ? 2 : answer - 1],
      solution: t(
        `The known digits add to $${known}$, and the next multiple of 9 is $${known + answer}$. So the missing digit is $${answer}$.`,
        `已知数字之和是 $${known}$，下一个 9 的倍数是 $${known + answer}$。所以所缺的数字是 $${answer}$。`,
      ),
    });
  },
};

const selfAdditiveInverses: KnowledgePointDef = {
  id: "the-residues-equal-to-their-own-additive-inverse",
  title: t("The residues equal to their own additive inverse", "等于自身加法逆元的剩余"),
  explanation: t(
    "Most residues pair up with a different additive inverse, since $x$ and $n - x$ are usually different. A residue equal to its own inverse must satisfy $2x \\equiv 0 \\pmod n$. The residue 0 always qualifies. When $n$ is even, the residue $\\frac{n}{2}$ also qualifies, and there are no others. So the count depends only on the parity of $n$, which also tells us about the pairing of the other residues.",
    "大多数剩余与一个不同的加法逆元配对，因为 $x$ 和 $n - x$ 通常不同。等于自身逆元的剩余必须满足 $2x \\equiv 0 \\pmod n$。剩余 0 总是满足。当 $n$ 是偶数时，剩余 $\\frac{n}{2}$ 也满足，没有其他的了。所以个数只取决于 $n$ 的奇偶性，这也说明了其余剩余的配对情况。",
  ),
  generate(rng) {
    const n = rng.int(3, 60);
    const even = n % 2 === 0;
    const answer = even ? 2 : 1;
    return numberProblem({
      prompt: t(
        `How many residues $x$ in $\\{0, 1, \\dots, ${n - 1}\\}$ satisfy $x \\equiv -x \\pmod{${n}}$?`,
        `$\\{0, 1, \\dots, ${n - 1}\\}$ 中有多少个剩余 $x$ 满足 $x \\equiv -x \\pmod{${n}}$？`,
      ),
      answer,
      form: "integer",
      wrong: [even ? 1 : 2, 0, Math.floor(n / 2), n],
      solution: t(
        `The condition is $2x \\equiv 0 \\pmod{${n}}$. ${even ? `Its solutions are $0$ and $${n / 2}$` : "Since the modulus is odd, its only solution is $0$"}, so the count is $${answer}$.`,
        `条件是 $2x \\equiv 0 \\pmod{${n}}$。${even ? `它的解是 $0$ 和 $${n / 2}$` : "由于模是奇数，它唯一的解是 $0$"}，所以个数是 $${answer}$。`,
      ),
    });
  },
};

const selfMultiplicativeInverses: KnowledgePointDef = {
  id: "counting-the-residues-that-are-their-own-inverse",
  title: t("Counting the residues that are their own inverse", "计算自身就是逆元的剩余"),
  explanation: t(
    "A residue is its own multiplicative inverse when $x^2 \\equiv 1 \\pmod n$. The residues 1 and $n - 1$ always work. For a prime modulus there are no others, because $n$ dividing $(x - 1)(x + 1)$ forces it to divide one of the factors. For a composite modulus, the factors can share out the prime powers of $n$, and so there may be more solutions, for example 3 and 5 modulo 8.",
    "当 $x^2 \\equiv 1 \\pmod n$ 时，剩余是它自身的乘法逆元。剩余 1 和 $n - 1$ 总是可行。对素数模没有其他解，因为 $n$ 整除 $(x - 1)(x + 1)$ 就必须整除其中一个因子。对合数模，两个因子可以分担 $n$ 的素数幂，所以可能有更多的解，例如模 8 时的 3 和 5。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const solutions = [...Array(n).keys()].filter((x) => (x * x) % n === 1);
    const answer = solutions.length;
    return numberProblem({
      prompt: t(
        `How many residues $x$ in $\\{0, 1, \\dots, ${n - 1}\\}$ are their own multiplicative inverse modulo ${n}?`,
        `$\\{0, 1, \\dots, ${n - 1}\\}$ 中有多少个剩余 $x$ 在模 ${n} 下是自身的乘法逆元？`,
      ),
      answer,
      form: "integer",
      wrong: [2, totient(n), 1, answer + 2],
      solution: t(
        `The solutions of $x^2 \\equiv 1 \\pmod{${n}}$ are $${solutions.join(", ")}$, which makes $${answer}$.`,
        `$x^2 \\equiv 1 \\pmod{${n}}$ 的解是 $${solutions.join(", ")}$，共 $${answer}$ 个。`,
      ),
    });
  },
};

const domainOfSumRelation: KnowledgePointDef = {
  id: "the-domain-of-a-sum-relation",
  title: t("The domain of a sum relation", "和关系的定义域"),
  explanation: t(
    "The domain of a relation is the set of first coordinates that actually occur. For the relation $x + y = k$ on $\\{1, \\dots, n\\}$, a value of $x$ occurs when its partner $k - x$ is also between 1 and $n$. When $k$ is small, the partner fails to be positive for large $x$. When $k$ is large, the partner is too big for small $x$. So the domain is a run of consecutive integers, and both ends must be checked.",
    "关系的定义域是实际出现的第一坐标的集合。对 $\\{1, \\dots, n\\}$ 上的关系 $x + y = k$，当搭档 $k - x$ 也在 1 和 $n$ 之间时，$x$ 的值才出现。$k$ 较小时，对大的 $x$，搭档不是正数。$k$ 较大时，对小的 $x$，搭档太大。所以定义域是一段连续的整数，两端都要检查。",
  ),
  generate(rng) {
    const n = rng.int(3, 20);
    const k = rng.int(3, 2 * n - 1);
    const domain = oneTo(n).filter((x) => k - x >= 1 && k - x <= n);
    const answer = domain.length;
    return numberProblem({
      prompt: t(
        `The relation $R$ on $\\{1, 2, \\dots, ${n}\\}$ has $(x, y) \\in R$ when $x + y = ${k}$. How many elements does the domain of $R$ have?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 上的关系 $R$ 定义为：当 $x + y = ${k}$ 时 $(x, y) \\in R$。$R$ 的定义域有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [n, k, k - 1, Math.abs(2 * n - k), answer + 1, answer - 1],
      solution: t(
        `The value $${k} - x$ must also lie between 1 and ${n}, so $x$ runs from $${domain[0] ?? 0}$ to $${domain[domain.length - 1] ?? 0}$. That is $${answer}$ values.`,
        `$${k} - x$ 也必须在 1 和 ${n} 之间，所以 $x$ 从 $${domain[0] ?? 0}$ 取到 $${domain[domain.length - 1] ?? 0}$。共 $${answer}$ 个值。`,
      ),
    });
  },
};

const onesInDivisibilityMatrix: KnowledgePointDef = {
  id: "counting-the-ones-in-a-divisibility-matrix",
  title: t("Counting the ones in a divisibility matrix", "计算整除矩阵中 1 的个数"),
  explanation: t(
    "The matrix of a relation on $\\{1, \\dots, n\\}$ has a 1 in row $i$ and column $j$ when $i$ is related to $j$. So the number of ones is the number of pairs in the relation. For divisibility, row $d$ has a 1 at each multiple of $d$, which gives $\\lfloor \\frac{n}{d} \\rfloor$ ones. Adding along the rows avoids testing every entry, and it also equals the total number of divisors of the numbers up to $n$.",
    "$\\{1, \\dots, n\\}$ 上关系的矩阵，当 $i$ 与 $j$ 有关系时，第 $i$ 行第 $j$ 列为 1。所以 1 的个数就是关系中数对的个数。对整除关系，第 $d$ 行在 $d$ 的每个倍数处为 1，共 $\\lfloor \\frac{n}{d} \\rfloor$ 个。按行相加就不必检查每个元素，它也等于不超过 $n$ 的各数的因数个数之和。",
  ),
  generate(rng) {
    const n = rng.int(4, 40);
    const answer = oneTo(n).reduce((sum, d) => sum + Math.floor(n / d), 0);
    return numberProblem({
      prompt: t(
        `The relation "$i$ divides $j$" on $\\{1, 2, \\dots, ${n}\\}$ is written as a matrix of zeros and ones. How many ones does the matrix have?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 上的关系“$i$ 整除 $j$”写成 0 和 1 的矩阵。矩阵中有多少个 1？`,
      ),
      answer,
      form: "integer",
      wrong: [n, n * n, (n * (n + 1)) / 2, answer + 1],
      solution: t(
        `Row $d$ has $\\lfloor \\frac{${n}}{d} \\rfloor$ ones, one for each multiple of $d$. Adding over all the rows gives $${answer}$.`,
        `第 $d$ 行有 $\\lfloor \\frac{${n}}{d} \\rfloor$ 个 1，每个 $d$ 的倍数一个。对所有行求和，得 $${answer}$。`,
      ),
    });
  },
};

const closureOfCycleOrChain: KnowledgePointDef = {
  id: "the-size-of-the-transitive-closure-of-a-cycle-or-chain",
  title: t("The size of the transitive closure of a cycle or chain", "环或链的传递闭包的大小"),
  explanation: t(
    "The transitive closure adds a pair $(a, b)$ whenever there is a path of arrows from $a$ to $b$. On a chain $a_1 \\to a_2 \\to \\dots \\to a_n$, an element reaches only those later in the chain, which gives one pair for each choice of two positions. On a cycle, every element reaches every element, including itself, by going all the way around. So joining up the two ends of a chain enlarges the closure considerably.",
    "传递闭包在从 $a$ 到 $b$ 有箭头路径时加入数对 $(a, b)$。在链 $a_1 \\to a_2 \\to \\dots \\to a_n$ 上，一个元素只能到达链中在它之后的元素，所以每选两个位置就有一对。在环上，每个元素都能到达每个元素，包括绕一圈回到自身。所以把链的两端连起来会使闭包大大增加。",
  ),
  generate(rng) {
    const n = rng.int(5, 20);
    const cycle = rng.pick([true, false]);
    const answer = cycle ? n * n : (n * (n - 1)) / 2;
    return numberProblem({
      prompt: t(
        `A relation consists of the pairs $(a_1, a_2), (a_2, a_3), \\dots, (a_{${n - 1}}, a_{${n}})$${cycle ? `, together with $(a_{${n}}, a_1)$` : ""}, on ${n} different elements. How many pairs does its transitive closure have?`,
        `${n} 个不同元素上的一个关系由数对 $(a_1, a_2), (a_2, a_3), \\dots, (a_{${n - 1}}, a_{${n}})$${cycle ? `以及 $(a_{${n}}, a_1)$` : ""}组成。它的传递闭包有多少个数对？`,
      ),
      answer,
      form: "integer",
      wrong: [cycle ? n : n - 1, n * (n - 1), (n * (n + 1)) / 2, cycle ? (n * (n - 1)) / 2 : n * n],
      solution: t(
        cycle
          ? `The arrows form a cycle, so every element reaches all ${n} elements, itself included. This gives $${n}^2 = ${answer}$ pairs.`
          : `Each element reaches exactly those later in the chain, so each pair of positions gives one pair. This makes $\\binom{${n}}{2} = ${answer}$.`,
        cycle
          ? `箭头构成一个环，所以每个元素都能到达全部 ${n} 个元素，包括它自身。这样得 $${n}^2 = ${answer}$ 个数对。`
          : `每个元素恰好到达链中在它之后的元素，所以每两个位置给出一个数对。共 $\\binom{${n}}{2} = ${answer}$ 个。`,
      ),
    });
  },
};

const classesOfEqualSquares: KnowledgePointDef = {
  id: "counting-the-classes-of-equal-squares",
  title: t("Counting the classes of equal squares", "计算平方相等的等价类"),
  explanation: t(
    "Any function defines an equivalence relation, by calling two elements related when they have the same image. The classes then correspond one-to-one with the different values that the function takes. So counting classes of $x \\sim y$ when $x^2 \\equiv y^2 \\pmod n$ is the same as counting the different squares modulo $n$. For an odd prime $p$, the residues $x$ and $-x$ pair up, apart from 0, so there are $\\frac{p + 1}{2}$ classes.",
    "任何函数都定义一个等价关系：两个元素的像相同时称它们相关。于是等价类与函数取到的不同值一一对应。所以当 $x^2 \\equiv y^2 \\pmod n$ 时 $x \\sim y$ 的类的个数，就是模 $n$ 的不同平方数的个数。对奇素数 $p$，除 0 以外，$x$ 和 $-x$ 配对，所以有 $\\frac{p + 1}{2}$ 个类。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const squares = new Set([...Array(n).keys()].map((x) => (x * x) % n));
    const answer = squares.size;
    return numberProblem({
      prompt: t(
        `On $\\{0, 1, \\dots, ${n - 1}\\}$, let $x \\sim y$ when $x^2 \\equiv y^2 \\pmod{${n}}$. How many equivalence classes are there?`,
        `在 $\\{0, 1, \\dots, ${n - 1}\\}$ 上，当 $x^2 \\equiv y^2 \\pmod{${n}}$ 时令 $x \\sim y$。共有多少个等价类？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.floor((n + 1) / 2), n, totient(n), answer + 1],
      solution: t(
        `The classes match the different values of $x^2$ modulo ${n}, which are $${[...squares].sort((a, b) => a - b).join(", ")}$. That is $${answer}$ classes.`,
        `类与 $x^2$ 模 ${n} 的不同值对应，这些值是 $${[...squares].sort((a, b) => a - b).join(", ")}$。共 $${answer}$ 个类。`,
      ),
    });
  },
};

const modulusOfCongruence: KnowledgePointDef = {
  id: "counting-the-moduli-for-which-two-numbers-are-congruent",
  title: t("Counting the moduli for which two numbers are congruent", "计算使两数同余的模"),
  explanation: t(
    "By definition, $a \\equiv b \\pmod m$ means that $m$ divides $a - b$. So the moduli that make two given numbers congruent are exactly the divisors of their difference. Moduli are usually taken to be greater than 1, which removes one divisor from the count. The size of the numbers does not matter, only their difference, so that a question about large numbers can come down to factoring a small one.",
    "按定义，$a \\equiv b \\pmod m$ 意味着 $m$ 整除 $a - b$。所以使两个给定的数同余的模，恰好是它们之差的因数。模通常取大于 1 的数，这样要从个数中去掉一个因数。这两个数本身的大小不重要，只有差才重要，所以关于大数的问题可以归结为分解一个小数。",
  ),
  generate(rng) {
    const a = rng.int(1, 200);
    const difference = rng.int(4, 120);
    const b = a + difference;
    const divisors = divisorsOf(difference);
    const answer = divisors.length - 1;
    return numberProblem({
      prompt: t(
        `For how many integers $m > 1$ is $${b} \\equiv ${a} \\pmod m$ true?`,
        `有多少个整数 $m > 1$ 使 $${b} \\equiv ${a} \\pmod m$ 成立？`,
      ),
      answer,
      form: "integer",
      wrong: [divisors.length, difference, difference - 1, answer + 2],
      solution: t(
        `The modulus $m$ must divide $${b} - ${a} = ${difference}$, which has $${divisors.length}$ positive divisors. Leaving out 1 gives $${answer}$.`,
        `模 $m$ 必须整除 $${b} - ${a} = ${difference}$，它有 $${divisors.length}$ 个正因数。去掉 1，得 $${answer}$。`,
      ),
    });
  },
};

const injectiveMultiplications: KnowledgePointDef = {
  id: "counting-the-injective-multiplications-modulo-n",
  title: t("Counting the injective multiplications modulo n", "计算模 n 的单射乘法"),
  explanation: t(
    "The function $f(x) = ax$ on the residues modulo $n$ is injective exactly when $\\gcd(a, n) = 1$. If $ax \\equiv ay$, then $n$ divides $a(x - y)$, and when $a$ and $n$ share no factor, $n$ must divide $x - y$. If they do share a factor $d > 1$, then $f(\\frac{n}{d}) = f(0)$ gives two inputs with the same image. A function from a finite set to itself that is injective is also surjective.",
    "模 $n$ 剩余上的函数 $f(x) = ax$ 是单射，当且仅当 $\\gcd(a, n) = 1$。如果 $ax \\equiv ay$，那么 $n$ 整除 $a(x - y)$，当 $a$ 与 $n$ 没有公因数时，$n$ 必须整除 $x - y$。如果它们有公因数 $d > 1$，那么 $f(\\frac{n}{d}) = f(0)$，两个输入有相同的像。有限集到自身的单射也是满射。",
  ),
  generate(rng) {
    const n = rng.int(4, 60);
    const answer = totient(n);
    return numberProblem({
      prompt: t(
        `For how many values of $a$ in $\\{1, 2, \\dots, ${n}\\}$ is the function $f(x) = ax$ on the residues modulo ${n} injective?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 中有多少个 $a$，使模 ${n} 剩余上的函数 $f(x) = ax$ 是单射？`,
      ),
      answer,
      form: "integer",
      wrong: [n - 1, n, Math.floor(n / 2), answer + 1],
      solution: t(
        `The function is injective exactly when $\\gcd(a, ${n}) = 1$. There are $${answer}$ such values of $a$ up to ${n}.`,
        `函数是单射当且仅当 $\\gcd(a, ${n}) = 1$。不超过 ${n} 的这样的 $a$ 有 $${answer}$ 个。`,
      ),
    });
  },
};

const oddTriangularNumbers: KnowledgePointDef = {
  id: "counting-the-odd-triangular-numbers",
  title: t("Counting the odd triangular numbers", "计算奇三角形数的个数"),
  explanation: t(
    "The parity of the triangular number $T_k = \\frac{k(k + 1)}{2}$ follows a pattern of period four: odd, odd, even, even. It is not enough to look at $k$ and $k + 1$ alone, because one of them is always even and the factor 2 cancels part of it. Only when the even one is a multiple of 4 is $T_k$ even. So $T_k$ is odd when $k$ leaves a remainder of 1 or 2 on division by 4.",
    "三角形数 $T_k = \\frac{k(k + 1)}{2}$ 的奇偶性呈周期为四的规律：奇、奇、偶、偶。只看 $k$ 和 $k + 1$ 不够，因为其中总有一个是偶数，而因子 2 会消去它的一部分。只有当那个偶数是 4 的倍数时，$T_k$ 才是偶数。所以当 $k$ 除以 4 余 1 或 2 时，$T_k$ 是奇数。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const answer = oneTo(n).filter((k) => k % 4 === 1 || k % 4 === 2).length;
    return numberProblem({
      prompt: t(
        `How many of the numbers $\\frac{k(k + 1)}{2}$, for $k = 1, 2, \\dots, ${n}$, are odd?`,
        `当 $k = 1, 2, \\dots, ${n}$ 时，数 $\\frac{k(k + 1)}{2}$ 中有多少个是奇数？`,
      ),
      answer,
      form: "integer",
      wrong: [n - answer, Math.floor(n / 4), n, answer + 1, answer - 1],
      solution: t(
        `The number is odd exactly when $k$ leaves remainder 1 or 2 on division by 4. Up to ${n}, there are $${answer}$ such values of $k$.`,
        `当且仅当 $k$ 除以 4 余 1 或 2 时，这个数是奇数。不超过 ${n} 的这样的 $k$ 有 $${answer}$ 个。`,
      ),
    });
  },
};

const factorialBeatsPower: KnowledgePointDef = {
  id: "the-smallest-n-where-a-factorial-beats-a-power",
  title: t("The smallest n where a factorial beats a power", "阶乘超过幂的最小 n"),
  explanation: t(
    "Before an inductive proof of an inequality such as $n! > ca^n$ can start, the right base case must be found, by testing small values. The inductive step then goes through as soon as $n + 1 \\ge a$, because the left side is multiplied by $n + 1$ and the right side only by $a$. So the factorial must win eventually, whatever the values of $a$ and $c$, even though it starts off behind the power.",
    "在用归纳法证明像 $n! > ca^n$ 这样的不等式之前，必须通过试小值找到正确的基础情形。只要 $n + 1 \\ge a$，归纳步骤就能完成，因为左边乘以 $n + 1$，而右边只乘以 $a$。所以无论 $a$ 和 $c$ 取什么值，阶乘最终一定会胜出，尽管开始时它落后于幂。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const c = rng.int(1, 9);
    let n = 1;
    let left = 1;
    let right = c * a;
    while (left <= right) {
      n += 1;
      left *= n;
      right *= a;
    }
    const previousLeft = left / n;
    const previousRight = right / a;
    const scale = c === 1 ? "" : `${c} \\cdot `;
    return numberProblem({
      prompt: t(`Find the smallest positive integer $n$ with $n! > ${scale}${a}^n$.`, `求满足 $n! > ${scale}${a}^n$ 的最小正整数 $n$。`),
      answer: n,
      form: "integer",
      wrong: [n - 1, n + 1, a, a + 1],
      solution: t(
        `At $n = ${n - 1}$, the two sides are $${previousLeft}$ and $${previousRight}$. At $n = ${n}$, they are $${left}$ and $${right}$, so $n = ${n}$ is the first to work.`,
        `在 $n = ${n - 1}$ 时，两边分别是 $${previousLeft}$ 和 $${previousRight}$。在 $n = ${n}$ 时，它们是 $${left}$ 和 $${right}$，所以 $n = ${n}$ 是第一个满足的。`,
      ),
    });
  },
};

const triplesWithSum: KnowledgePointDef = {
  id: "counting-the-triples-of-a-sum-relation",
  title: t("Counting the triples of a sum relation", "计算和关系中的三元组"),
  explanation: t(
    "A ternary relation is a set of triples, and its size can sometimes be found by a clever encoding. A triple of positive integers adding to $k$ corresponds to a choice of two cut points among the $k - 1$ gaps between $k$ objects in a row. Each choice gives three nonempty blocks, whose sizes form the triple. So the count is $\\binom{k - 1}{2}$, and the order within the triple is taken into account automatically.",
    "三元关系是三元组的集合，它的大小有时可以通过巧妙的编码求得。和为 $k$ 的正整数三元组，对应于在一行 $k$ 个对象之间的 $k - 1$ 个空隙中选两个切点。每种选法给出三个非空段，它们的大小构成三元组。所以个数是 $\\binom{k - 1}{2}$，三元组内的顺序也自动考虑在内。",
  ),
  generate(rng) {
    const k = rng.int(4, 40);
    const answer = binom(k - 1, 2);
    return numberProblem({
      prompt: t(
        `The relation $R$ on the positive integers holds for $(x, y, z)$ when $x + y + z = ${k}$. How many triples does $R$ contain?`,
        `正整数上的关系 $R$ 在 $x + y + z = ${k}$ 时对 $(x, y, z)$ 成立。$R$ 包含多少个三元组？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(k, 2), binom(k + 2, 2), k * k, answer + 1],
      solution: t(
        `Choosing two of the ${k - 1} gaps between ${k} objects gives the triple. So the count is $\\binom{${k - 1}}{2} = ${answer}$.`,
        `在 ${k} 个对象之间的 ${k - 1} 个空隙中选两个，就给出三元组。所以个数是 $\\binom{${k - 1}}{2} = ${answer}$。`,
      ),
    });
  },
};

/** deeperMethodsOfProofPoints gives, by topic id, the knowledge points added after a Methods of Proof topic's own. */
export const deeperMethodsOfProofPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "cardinality-of-finite-sets": [threeSets],
  "power-sets": [constrainedSubsets],
  subsets: [subsetsThroughAnElement],
  "partitions-of-sets": [partitionsWithBlockSizes],
  "the-cartesian-product": [pairsInAProduct],
  "indicator-functions": [squaredIndicatorDifference],
  "the-difference-of-sets": [symmetricDifference],
  "disjoint-sets": [disjointLists],
  "nested-quantifiers": [countingNestedQuantifiers],
  "the-maximum-and-minimum-of-a-set": [extremeOfDefinedSet],
  "describing-planar-regions-using-set-builder-notation": [latticePoints],
  "conditional-statements": [falseRowsOfAConditional],
  "biconditional-statements": [trueRowsOfBiconditionals],
  "necessary-and-sufficient-conditions": [conditionsOnMultiples],
  "proof-by-cases": [squaresByCases],
  "proving-properties-of-irrationals-by-contradiction": [rationalisingMultiplier],
  "the-division-algorithm": [remainderForAFactor],
  "the-euclidean-algorithm": [euclidSteps],
  "linear-diophantine-equations": [smallestPositiveSolution],
  "properties-of-integer-divisibility": [gcdTimesLcm],
  "properties-of-prime-divisibility": [legendre],
  "mathematical-induction": [coefficientForInduction],
  "sets-and-functions": [countingFunctions],
  "into-functions": [functionsMissingValues],
  "the-floor-and-ceiling-functions": [floorSum],
  "the-cardinality-of-the-power-set-of-natural-numbers": [decodingAFiniteSet],
  "the-chinese-remainder-theorem": [nonCoprimeRemainders],
  "the-integers-modulo-n": [countingZeroDivisors],
  "symmetric-and-antisymmetric-relations": [countingPropertyRelations],
  "relations-on-finite-sets": [relationsOfASize],
  "equivalent-sets": [unknownInASetEquality],
  "set-complements": [inNeitherSet],
  "visualizing-cartesian-products": [overlapOfProducts],
  "indexed-sets": [countingAnIndexedFamily],
  "truth-tables": [rowsWithKTrue],
  "logical-equivalence": [formulasUpToEquivalence],
  "the-distributive-laws": [termsAfterDistributing],
  "de-morgans-laws-for-logic": [rowsThroughDeMorgan],
  "logical-equivalence-with-conditional-statements": [rowsOfACompoundConclusion],
  "converse-inverse-and-contrapositive": [relatedConditionalRows],
  "the-and-and-or-connectives-with-predicates": [andOrOfDivisibility],
  "conditional-statements-with-predicates": [conditionalOfDivisibility],
  "universal-and-existential-quantifiers": [thresholdOfAQuantifier],
  "disjunctive-syllogism-and-transitivity-of-implication": [implicationChainRows],
  "proving-subset-relations": [chainsOfSubsets],
  "distributive-properties-of-set-operations": [intersectionWithAUnion],
  "proving-divisibility": [linearDividesQuadratic],
  "disproving-universal-statements": [smallestCounterexample],
  "proving-biconditional-statements": [biconditionalOfDivisibility],
  "proving-divisibility-by-contrapositive": [divisorForcingASquare],
  "proof-by-contradiction": [pigeonholeByContradiction],
  "proving-irrationality-by-contradiction": [rationalShiftedSquare],
  "the-extended-euclidean-algorithm": [leastPositiveBezoutY],
  "strong-induction-and-recurrence-relations": [largestUnmakeableAmount],
  "the-limit-of-a-null-sequence": [termsOutsideABand],
  injections: [increasingFunctions],
  bijections: [fixedPointBijections],
  "cardinality-of-the-natural-numbers-integers-and-rationals": [reducedFractions],
  "the-multiplication-properties-of-modular-arithmetic": [cycleLengthOfPowers],
  "functional-relations": [atMostOnePartner],
  "equivalence-relations": [relationsByClassCount],
  "the-conditional-definition-of-a-set": [setOfSquares],
  "truth-sets-of-predicates": [quadraticTruthSet],
  "simplifying-predicate-expressions-using-de-morgans-laws": [notBetweenCount],
  "translating-between-logical-and-set-operations": [conditionalFromSizes],
  "negating-statements-with-nested-quantifiers": [whereExistsFails],
  "proving-parity": [oddExpressionPairs],
  "trivial-and-vacuous-proofs": [vacuousCases],
  "integer-divisibility": [sumOfDivisors],
  "proving-matrix-identities-using-induction": [triangularMatrixCorner],
  "proving-surjectivity": [floorPreimage],
  "modular-residues": [residueOfLongSum],
  "proving-divisibility-using-congruence": [missingDigit],
  "additive-inverses-modulo-n": [selfAdditiveInverses],
  "multiplicative-inverses-modulo-n": [selfMultiplicativeInverses],
  "the-domain-and-range-of-a-relation": [domainOfSumRelation],
  "graphical-representations-of-relations": [onesInDivisibilityMatrix],
  "transitive-relations": [closureOfCycleOrChain],
  "equivalence-classes": [classesOfEqualSquares],
  "modular-congruence": [modulusOfCongruence],
  "proving-injectivity": [injectiveMultiplications],
  parity: [oddTriangularNumbers],
  "proving-inequalities-using-induction": [factorialBeatsPower],
  "n-ary-relations": [triplesWithSum],
};
