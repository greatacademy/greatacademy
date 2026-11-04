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
};
