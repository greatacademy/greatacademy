// Further knowledge points for topics of Methods of Proof, each a skill the topic's own
// points leave out. See `deeperMethodsOfProofPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { proofDrawings1 } from "../explanation-drawings-methods-of-proof-1.ts";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

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
/** firstOf keeps the first mistake for each wrong value. */
const firstOf = <T extends { readonly value: unknown }>(ms: readonly T[]): T[] =>
  ms.filter((m, i) => ms.findIndex((x) => String(x.value) === String(m.value)) === i);
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
    "Building a subset means deciding, for each element, whether it is in or out. An element that must be in, or must be out, leaves no decision. Only the remaining elements each offer two choices. So the number of subsets is a power of two whose exponent counts just the undecided elements. The subsets of $\\{1, \\dots, 6\\}$ that contain $1$ but not $6$ leave $4$ elements free: $2^{4} = 16$ subsets.\n\n> **Watch out.** A forbidden element is decided just as much as a required one. Both leave the exponent, and the count is divided by $2$ for each, not reduced by subtraction.",
    "构造子集就是对每个元素决定它在或不在。必须在或必须不在的元素没有选择的余地。只有其余的元素各有两种选择。所以子集的个数是二的幂，指数只计算尚未确定的元素。$\\{1, \\dots, 6\\}$ 中含 $1$ 但不含 $6$ 的子集，还剩 $4$ 个元素可以自由选择：共 $2^{4} = 16$ 个。\n\n> **注意。** 必不含的元素和必含的元素一样，都已确定。它们都不计入指数，每个都使个数除以 $2$，而不是做减法。",
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
      wrong: [2 ** (n - inside - outside - 1)],
      mistakes: [
        why(
          2 ** (n - inside),
          `That settles only the required numbers; the forbidden ones are decided too, so they leave the exponent as well.`,
          `这只确定了必含的数；必不含的数同样已经确定，也不计入指数。`,
        ),
        why(
          2 ** n - 2 ** (inside + outside),
          "That subtracts from the number of all subsets; each decided element halves the count instead.",
          "这是从全部子集的个数中做减法；每个确定的元素应使个数减半。",
        ),
        why(
          2 ** n,
          `That counts every subset of the ${n} numbers, ignoring the conditions.`,
          `这数的是 ${n} 个数的全部子集，没有考虑条件。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Settle the named numbers", "确定指定的数"],
            t(
              `${inside} number${inside === 1 ? " is" : "s are"} in and ${outside} ${outside === 1 ? "is" : "are"} out, so $${inside} + ${outside} = ${inside + outside}$ numbers are decided and $${n} - ${inside + outside} = ${free}$ are free.`,
              `${inside} 个数必在，${outside} 个数必不在，所以 $${inside} + ${outside} = ${inside + outside}$ 个数已经确定，还剩 $${n} - ${inside + outside} = ${free}$ 个可以自由选择。`,
            ),
          ],
          [
            ["Count the free choices", "数自由的选择"],
            t(
              `Each free number is in or out: $2^{${free}} = ${answer}$ subsets.`,
              `每个自由的数可在可不在：共 $2^{${free}} = ${answer}$ 个子集。`,
            ),
          ],
        ],
        t(
          `Start from all $2^{${n}}$ subsets. Each condition on one number keeps exactly half of them, so $2^{${n}} \\div 2^{${inside + outside}} = ${answer}$.`,
          `从全部 $2^{${n}}$ 个子集出发。关于一个数的每个条件恰好保留一半，所以 $2^{${n}} \\div 2^{${inside + outside}} = ${answer}$。`,
        ),
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
    "A partition into two blocks is fixed once one block is chosen, because the other block is whatever remains. If the sizes differ, choose the block of the first size. If they are equal, this counts each partition twice, since a partition does not say which block came first, so divide by two. A set of $4$ elements splits into blocks of $1$ and $3$ in $\\binom{4}{1} = 4$ ways, and into two blocks of $2$ in $\\binom{4}{2} \\div 2 = 3$ ways.\n\n> **Watch out.** Halve only when the two blocks have the same size. With different sizes, the block of the smaller size already tells the blocks apart, and nothing is counted twice.",
    "分成两块时，选定一块，划分就确定了，因为另一块就是剩下的元素。如果大小不同，就选出第一种大小的块。如果大小相等，这样会把每个划分算两次，因为划分不区分哪一块在前，所以要除以二。$4$ 元集合分成 $1$ 元块和 $3$ 元块有 $\\binom{4}{1} = 4$ 种方式，分成两个 $2$ 元块有 $\\binom{4}{2} \\div 2 = 3$ 种方式。\n\n> **注意。** 只有两块大小相同时才除以二。大小不同时，较小的那块本身就把两块区分开了，没有重复计数。",
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
      mistakes: [
        a === b
          ? why(
              choose,
              "That counts each partition twice: choosing either of its two blocks gives the same partition.",
              "这把每种划分算了两次：选出它的两块中的任何一块，得到的是同一种划分。",
            )
          : why(
              2 * choose,
              `Choosing the block of ${a} already fixes the partition; the blocks differ in size, so nothing needs doubling.`,
              `选出 ${a} 元的块就已确定划分；两块大小不同，不需要乘以二。`,
            ),
        why(
          2 ** (n - 1) - 1,
          "That counts every partition into two blocks, whatever their sizes.",
          "这数的是分成两块的所有划分，没有限定块的大小。",
        ),
        why(
          a * b,
          "That multiplies the block sizes; a block is a choice of elements, counted by a binomial coefficient.",
          "这是把块的大小相乘；一个块是对元素的选取，要用组合数来数。",
        ),
      ],
      solution: walked(
        [
          [
            ["Choose one block", "选出一块"],
            t(
              `Choose the ${a} elements of ${a === b ? "one" : "the smaller"} block: $\\binom{${n}}{${a}} = ${choose}$ ways. The other ${b} elements form the other block.`,
              `选出${a === b ? "其中一块" : "较小一块"}的 ${a} 个元素：$\\binom{${n}}{${a}} = ${choose}$ 种方式。其余 ${b} 个元素组成另一块。`,
            ),
          ],
          a === b
            ? [
                ["Remove the double count", "去掉重复计数"],
                t(
                  `The two blocks have no order, so each partition was counted twice: $${choose} \\div 2 = ${answer}$.`,
                  `两块没有顺序，每种划分被算了两次：$${choose} \\div 2 = ${answer}$。`,
                ),
              ]
            : [
                ["Count the partitions", "数出划分"],
                t(`Each choice gives a different partition, so there are $${answer}$.`, `每种选法给出不同的划分，所以共 $${answer}$ 种。`),
              ],
        ],
        a === b
          ? t(
              `Fix one element; its block needs $${a - 1}$ of the other $${n - 1}$ elements, which gives $\\binom{${n - 1}}{${a - 1}} = ${binom(n - 1, a - 1)}$ partitions, counted once each.`,
              `固定一个元素；它所在的块还需从其余 $${n - 1}$ 个元素中选 $${a - 1}$ 个，得 $\\binom{${n - 1}}{${a - 1}} = ${binom(n - 1, a - 1)}$ 种划分，每种只算一次。`,
            )
          : t(
              `Choosing the block of ${b} instead gives $\\binom{${n}}{${b}} = ${binom(n, b)}$, the same count.`,
              `改为选出 ${b} 元的块，得 $\\binom{${n}}{${b}} = ${binom(n, b)}$，个数相同。`,
            ),
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
    "The difference of two indicator functions is $1$, $-1$ or $0$ at each point, and its square is $1$ exactly where the point lies in one set but not the other. So summing this square over a finite universe counts the symmetric difference. Algebra with indicators turns into counting with sets in this way. With $A = \\{1, 2, 3\\}$ and $B = \\{3, 4\\}$, the terms are $1$ at $1$, $2$ and $4$, and $0$ at $3$, so the sum is $3$.\n\n> **Watch out.** A point in both sets gives $(1 - 1)^2 = 0$, so the sum is not $|A| + |B|$; and a point of $B$ only gives $(0 - 1)^2 = 1$, not $-1$, so it adds to the sum rather than cancelling.",
    "两个指示函数之差在每一点上是 $1$、$-1$ 或 $0$，它的平方恰好在该点只属于其中一个集合时为 $1$。所以在有限全集上对这个平方求和，数的就是对称差。指示函数的代数运算就是这样转化为集合计数的。取 $A = \\{1, 2, 3\\}$，$B = \\{3, 4\\}$，各项在 $1$、$2$、$4$ 处为 $1$，在 $3$ 处为 $0$，所以和是 $3$。\n\n> **注意。** 同时属于两个集合的点给出 $(1 - 1)^2 = 0$，所以和不是 $|A| + |B|$；只属于 $B$ 的点给出 $(0 - 1)^2 = 1$，而不是 $-1$，所以它使和增加，不会抵消。",
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
      mistakes: [
        why(
          a + b,
          "That counts the points of $A \\cap B$, but there each term is $(1 - 1)^2 = 0$.",
          "这算上了 $A \\cap B$ 中的点，但在那里每一项都是 $(1 - 1)^2 = 0$。",
        ),
        why(
          a + b - shared,
          "That is $|A \\cup B|$; the points of $A \\cap B$ give $0$, so they must be left out entirely.",
          "这是 $|A \\cup B|$；$A \\cap B$ 中的点给出 $0$，应当完全去掉。",
        ),
        why(
          Math.abs(a - b),
          "That lets the points of $B$ only cancel those of $A$ only, but squaring makes each of their terms $1$, not $-1$.",
          "这让只属于 $B$ 的点抵消了只属于 $A$ 的点，但平方后它们的每一项都是 $1$，不是 $-1$。",
        ),
      ],
      solution: walked(
        [
          [
            ["Find the value of each term", "求每一项的值"],
            t(
              "The term is $(1 - 0)^2 = 1$ or $(0 - 1)^2 = 1$ for $x$ in exactly one of the sets, and $0$ for $x$ in both or in neither.",
              "$x$ 恰属于一个集合时，该项为 $(1 - 0)^2 = 1$ 或 $(0 - 1)^2 = 1$；$x$ 两个都属于或都不属于时为 $0$。",
            ),
          ],
          [
            ["Count the points in exactly one set", "数恰属于一个集合的点"],
            t(
              `$|A \\setminus B| = ${a} - ${shared} = ${p}$ and $|B \\setminus A| = ${b} - ${shared} = ${q}$, so the sum is $${p} + ${q} = ${answer}$.`,
              `$|A \\setminus B| = ${a} - ${shared} = ${p}$，$|B \\setminus A| = ${b} - ${shared} = ${q}$，所以和是 $${p} + ${q} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Expand the square: $\\mathbf{1}_A^2 - 2 \\mathbf{1}_A \\mathbf{1}_B + \\mathbf{1}_B^2 = \\mathbf{1}_A - 2 \\cdot \\mathbf{1}_{A \\cap B} + \\mathbf{1}_B$, whose sum is $${a} - 2 \\cdot ${shared} + ${b} = ${answer}$.`,
          `展开平方：$\\mathbf{1}_A^2 - 2 \\mathbf{1}_A \\mathbf{1}_B + \\mathbf{1}_B^2 = \\mathbf{1}_A - 2 \\cdot \\mathbf{1}_{A \\cap B} + \\mathbf{1}_B$，求和得 $${a} - 2 \\cdot ${shared} + ${b} = ${answer}$。`,
        ),
      ),
    });
  },
};

const symmetricDifference: KnowledgePointDef = {
  id: "the-size-of-a-symmetric-difference",
  figure: linearAlgebraDrawings1["the-difference-of-sets#the-size-of-a-symmetric-difference"],
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
    'To count lists of pairwise disjoint subsets, decide for each element where it goes rather than choosing the subsets one at a time. Each element lies in one of the subsets or, if the union need not be everything, in none of them. The decisions are independent, so the count is a power. For lists of $2$ disjoint subsets of a $3$-element set, each element goes into the first, the second or neither: $3^{3} = 27$ lists.\n\n> **Watch out.** "In none of them" is a place only when the union need not be the whole set. And the number of places is the base, the number of elements the exponent, not the other way round.',
    "要数两两不交的子集序列，不必逐个选子集，而是对每个元素决定它的去向。每个元素属于其中一个子集；如果并集不必是全集，它也可以不属于任何子集。这些决定相互独立，所以个数是一个幂。$3$ 元集合由 $2$ 个两两不交的子集组成的序列，每个元素可进入第一个、第二个或都不进入：共 $3^{3} = 27$ 个。\n\n> **注意。** 只有当并集不必是全集时，“都不属于”才算一种去向。并且去向的个数是底数，元素的个数是指数，不要弄反。",
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
      mistakes: [
        whole
          ? why(
              (r + 1) ** n,
              "That lets an element lie in none of the subsets, but the union must be the whole set, so every element goes into one.",
              "这允许元素不属于任何子集，但并集必须是整个集合，所以每个元素都要进入某一个子集。",
            )
          : why(
              r ** n,
              "That forces every element into a subset; the union need not be the whole set, so lying in none is one more place.",
              "这迫使每个元素都进入某个子集；并集不必是整个集合，所以“都不属于”也是一种去向。",
            ),
        why(
          2 ** (r * n),
          "That decides for each subset separately whether it holds an element, which lets an element lie in two subsets at once.",
          "这对每个子集分别决定是否含某元素，会让一个元素同时属于两个子集。",
        ),
        why(
          n ** places,
          `That swaps base and exponent: each of the ${n} elements has ${places} places, which gives $${places}^{${n}}$.`,
          `这把底数和指数弄反了：${n} 个元素各有 ${places} 种去向，应为 $${places}^{${n}}$。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Count the places for one element", "数一个元素的去向"],
            whole
              ? t(
                  `Disjoint subsets whose union is everything give each element exactly one of the ${r} subsets: ${places} places.`,
                  `两两不交且并集是全集，所以每个元素恰好属于 ${r} 个子集之一：${places} 种去向。`,
                )
              : t(
                  `Disjoint subsets give each element at most one of the ${r} subsets, or none: $${r} + 1 = ${places}$ places.`,
                  `两两不交，所以每个元素至多属于 ${r} 个子集之一，也可以都不属于：$${r} + 1 = ${places}$ 种去向。`,
                ),
          ],
          [
            ["Multiply the independent choices", "把独立的选择相乘"],
            t(
              `The ${n} elements choose independently: $${places}^{${n}} = ${answer}$ lists.`,
              `${n} 个元素各自独立选择：共 $${places}^{${n}} = ${answer}$ 个序列。`,
            ),
          ],
        ],
        t(
          `Build the set one element at a time. With one element there are $${places}$ lists, one for each place it can go, and each new element multiplies the count by $${places}$, giving $${places}^{${n}} = ${answer}$.`,
          `逐个加入元素。只有一个元素时有 $${places}$ 个序列，对应它的每种去向；每加入一个新元素，个数乘以 $${places}$，得 $${places}^{${n}} = ${answer}$。`,
        ),
      ),
    });
  },
};

const countingNestedQuantifiers: KnowledgePointDef = {
  id: "counting-the-values-that-satisfy-a-quantified-condition",
  title: t("Counting the values that satisfy a quantified condition", "数满足量词条件的值"),
  explanation: t(
    "To decide a statement with an inner quantifier, look for the extreme case. A universal claim must survive its hardest value, while an existential claim only needs its easiest value. Once the inner quantifier has been replaced by this one case, what remains is an ordinary condition on the outer variable, and its values can be counted. For $x \\in \\{1, \\dots, 10\\}$, the statement $(\\forall y \\in \\{1, 2, 3\\})\\; x + y \\le 7$ comes down to its hardest case $y = 3$, that is $x \\le 4$: four values.\n\n> **Watch out.** An inner for all uses the hardest value, an inner there exists the easiest. Using the wrong one gives the count for the other statement.",
    "判断含内层量词的命题时，要找极端情形。全称命题必须经得起最难的值，而存在命题只需要最容易的值。把内层量词换成这一种情形后，剩下的就是关于外层变量的普通条件，可以数出它的取值。对 $x \\in \\{1, \\dots, 10\\}$，命题 $(\\forall y \\in \\{1, 2, 3\\})\\; x + y \\le 7$ 归结为最难的情形 $y = 3$，即 $x \\le 4$：四个值。\n\n> **注意。** 内层的“对所有”用最难的值，内层的“存在”用最容易的值。用反了，得到的是另一个命题的个数。",
  ),
  generate(rng) {
    const n = rng.int(8, 15);
    const m = rng.int(2, 6);
    const room = rng.int(1, 6);
    const k = room + m;
    const universal = rng.pick([true, false]);
    const answer = universal ? room : Math.min(n, k - 1);
    const quantifier = universal ? "\\forall" : "\\exists";
    const capped = !universal && n <= k - 1;
    return numberProblem({
      prompt: t(
        `For how many $x \\in \\{1, \\dots, ${n}\\}$ is the statement $(${quantifier} y \\in \\{1, \\dots, ${m}\\})\\; x + y \\le ${k}$ true?`,
        `对多少个 $x \\in \\{1, \\dots, ${n}\\}$，命题 $(${quantifier} y \\in \\{1, \\dots, ${m}\\})\\; x + y \\le ${k}$ 为真？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.min(n, k), answer + 1],
      mistakes: [
        universal
          ? why(
              Math.min(n, k - 1),
              `That uses the easiest value $y = 1$; a for all must hold even for the hardest, $y = ${m}$.`,
              `这用的是最容易的值 $y = 1$；“对所有”连最难的 $y = ${m}$ 也必须成立。`,
            )
          : why(
              room,
              `That uses the hardest value $y = ${m}$; a there exists needs only the easiest, $y = 1$.`,
              `这用的是最难的值 $y = ${m}$；“存在”只需要最容易的 $y = 1$。`,
            ),
        why(
          Math.min(n, k),
          "That allows $y = 0$, which is not in the domain of $y$; it starts at $1$.",
          "这相当于允许 $y = 0$，但 $y$ 的论域从 $1$ 开始。",
        ),
      ],
      solution: walked(
        [
          [
            ["Replace the inner quantifier by its extreme case", "把内层量词换成极端情形"],
            universal
              ? t(
                  `Every $y$ must work, and the hardest is the largest, $y = ${m}$. So the statement says $x + ${m} \\le ${k}$, that is $x \\le ${room}$.`,
                  `每个 $y$ 都必须成立，最难的是最大的 $y = ${m}$。所以命题就是 $x + ${m} \\le ${k}$，即 $x \\le ${room}$。`,
                )
              : t(
                  `One $y$ is enough, and the easiest is the smallest, $y = 1$. So the statement says $x + 1 \\le ${k}$, that is $x \\le ${k - 1}$.`,
                  `只要一个 $y$ 就够了，最容易的是最小的 $y = 1$。所以命题就是 $x + 1 \\le ${k}$，即 $x \\le ${k - 1}$。`,
                ),
          ],
          [
            ["Count the values of $x$", "数出 $x$ 的值"],
            capped
              ? t(
                  `Every $x$ from $1$ to $${n}$ satisfies it: $${answer}$ values.`,
                  `从 $1$ 到 $${n}$ 的每个 $x$ 都满足：$${answer}$ 个值。`,
                )
              : t(`$x = 1, \\dots, ${answer}$: $${answer}$ values.`, `$x = 1, \\dots, ${answer}$：$${answer}$ 个值。`),
          ],
        ],
        universal
          ? t(
              `Test the boundary. At $x = ${room}$ the largest sum is $${room} + ${m} = ${k}$, which is allowed; at $x = ${room + 1}$, $y = ${m}$ gives $${k + 1} > ${k}$.`,
              `检验边界。$x = ${room}$ 时最大的和是 $${room} + ${m} = ${k}$，可以；$x = ${room + 1}$ 时，$y = ${m}$ 得 $${k + 1} > ${k}$。`,
            )
          : capped
            ? t(
                `Test the largest value: $x = ${n}$ with $y = 1$ gives $${n + 1} \\le ${k}$, so even it counts.`,
                `检验最大的值：$x = ${n}$ 取 $y = 1$ 得 $${n + 1} \\le ${k}$，所以它也算。`,
              )
            : t(
                `Test the boundary. At $x = ${k - 1}$, $y = 1$ gives $${k}$, which is allowed; at $x = ${k}$, even $y = 1$ gives $${k + 1} > ${k}$.`,
                `检验边界。$x = ${k - 1}$ 时，$y = 1$ 得 $${k}$，可以；$x = ${k}$ 时，即使 $y = 1$ 也得 $${k + 1} > ${k}$。`,
              ),
      ),
    });
  },
};

const extremeOfDefinedSet: KnowledgePointDef = {
  id: "the-largest-element-of-a-set-given-by-conditions",
  title: t("The largest element of a set given by conditions", "由条件给出的集合的最大元"),
  explanation: t(
    "A set given by conditions may have no largest element in general, but a nonempty bounded set of integers always has one. To find it, turn the conditions into a bound and then move down from that bound to the first integer that meets the remaining conditions. An absolute value bound gives an interval. For $\\{x \\in \\mathbb{Z} : |x - 3| \\le 7 \\text{ and } 4 \\mid x\\}$, the first condition gives $-4 \\le x \\le 10$, and the largest multiple of $4$ there is $8$.\n\n> **Watch out.** The end of the interval is the largest element only if it meets the other conditions too. Move down from it, never up: a larger number leaves the interval.",
    "由条件给出的集合一般可能没有最大元，但非空有上界的整数集一定有。要求出它，先把条件化成一个上界，再从上界往下，找到第一个满足其余条件的整数。绝对值不等式给出一个区间。对 $\\{x \\in \\mathbb{Z} : |x - 3| \\le 7 \\text{ 且 } 4 \\mid x\\}$，第一个条件给出 $-4 \\le x \\le 10$，其中 $4$ 的最大倍数是 $8$。\n\n> **注意。** 区间的端点只有在也满足其他条件时才是最大元。要从端点往下找，不能往上：更大的数就离开区间了。",
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
      mistakes: [
        why(top, `That is the right end of the interval, but it is not a multiple of ${m}.`, `这是区间的右端点，但它不是 ${m} 的倍数。`),
        why(
          answer + m,
          `That is a multiple of ${m}, but it is larger than ${top}, so it lies outside the interval.`,
          `这是 ${m} 的倍数，但它大于 ${top}，不在区间内。`,
        ),
        why(
          c - r,
          "That is the left end of the interval, where the smallest elements are, not the largest.",
          "这是区间的左端点，那里是最小的元素，不是最大的。",
        ),
      ],
      solution: walked(
        [
          [
            ["Turn the absolute value into an interval", "把绝对值化为区间"],
            t(
              `$|${poly([1, "x"], [-c, ""])}| \\le ${r}$ means $${c} - ${r} \\le x \\le ${c} + ${r}$, that is $${c - r} \\le x \\le ${top}$.`,
              `$|${poly([1, "x"], [-c, ""])}| \\le ${r}$ 即 $${c} - ${r} \\le x \\le ${c} + ${r}$，也就是 $${c - r} \\le x \\le ${top}$。`,
            ),
          ],
          [
            [`Move down to a multiple of ${m}`, `往下找 ${m} 的倍数`],
            t(
              `$${top} = ${m} \\cdot ${Math.floor(top / m)} + ${top - Math.floor(top / m) * m}$, so the largest multiple of ${m} up to ${top} is $${m} \\cdot ${Math.floor(top / m)} = ${answer}$.`,
              `$${top} = ${m} \\cdot ${Math.floor(top / m)} + ${top - Math.floor(top / m) * m}$，所以不超过 ${top} 的 ${m} 的最大倍数是 $${m} \\cdot ${Math.floor(top / m)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer}$ meets both conditions: $|${answer} - (${c})| = ${Math.abs(answer - c)} \\le ${r}$ and ${m} divides it. The next multiple, $${answer + m}$, gives $|${answer + m} - (${c})| = ${Math.abs(answer + m - c)} > ${r}$.`,
          `$${answer}$ 满足两个条件：$|${answer} - (${c})| = ${Math.abs(answer - c)} \\le ${r}$，且 ${m} 整除它。下一个倍数 $${answer + m}$ 给出 $|${answer + m} - (${c})| = ${Math.abs(answer + m - c)} > ${r}$。`,
        ),
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
  k === 1 ? "p_1" : k === 2 ? "(p_1 \\land p_2)" : k === 3 ? "(p_1 \\land p_2 \\land p_3)" : `(p_1 \\land \\dots \\land p_{${k}})`;

const falseRowsOfAConditional: KnowledgePointDef = {
  id: "the-false-rows-of-a-conditional",
  title: t("The false rows of a conditional", "条件命题的假行"),
  explanation: t(
    "A conditional is false in only one situation: its hypothesis is true and its conclusion is false. So its false rows are easy to count even when its true rows are not: fix the values that this situation requires, and let every other variable take either value. In a table of the $5$ variables $p_1$, $p_2$, $q$, $r$, $s$, the conditional $(p_1 \\land p_2) \\to q$ is false only when $p_1$ and $p_2$ are true and $q$ is false. That fixes $3$ variables; $r$ and $s$ are free, so there are $2^{2} = 4$ false rows.\n\n> **Watch out.** $q$ is not free: the false case needs it false. Fix it together with the variables of the hypothesis.",
    "条件命题只在一种情况下为假：前件为真而后件为假。所以即使真行不好数，假行也容易数：固定这种情况所要求的值，再让其余每个变量任意取值。在 $p_1$、$p_2$、$q$、$r$、$s$ 这 $5$ 个变量的真值表中，$(p_1 \\land p_2) \\to q$ 只在 $p_1$、$p_2$ 为真且 $q$ 为假时为假。这固定了 $3$ 个变量；$r$、$s$ 自由，所以有 $2^{2} = 4$ 个假行。\n\n> **注意。** $q$ 不是自由的：为假的情形要求它为假。要把它和前件中的变量一起固定。",
  ),
  generate(rng) {
    const k = rng.int(1, 4);
    const n = rng.int(k + 1, 10);
    const answer = 2 ** (n - k - 1);
    const named = k === 1 ? "$p_1$" : k === 2 ? "$p_1$, $p_2$" : `$p_1$ to $p_{${k}}$`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including ${named} and $q$. In how many rows is $${conjunction(k)} \\to q$ false?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 ${named} 和 $q$。$${conjunction(k)} \\to q$ 在多少行为假？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** n - answer, 2 ** (n - 1), 2 ** (n - k)],
      mistakes: [
        why(2 ** n - answer, "That counts the rows where the conditional is true.", "这是条件命题为真的行数。"),
        why(2 ** (n - 1), "That fixes only $q$; the hypothesis must be true as well.", "这只固定了 $q$；前件也必须为真。"),
        why(2 ** (n - k), "That lets $q$ vary; the false case needs $q$ false.", "这让 $q$ 任意取值了；为假的情形要求 $q$ 为假。"),
      ],
      solution: walked(
        [
          [
            ["Find the one false case", "找出唯一为假的情形"],
            t(
              `A conditional is false only when its hypothesis is true and its conclusion false: every $p_i$ true and $q$ false. That fixes $${k} + 1 = ${k + 1}$ variables.`,
              `条件命题只在前件真、后件假时为假：每个 $p_i$ 都为真且 $q$ 为假。这固定了 $${k} + 1 = ${k + 1}$ 个变量。`,
            ),
          ],
          [
            ["Let the others vary", "其余变量任意取值"],
            t(
              `The other $${n - k - 1}$ variables are free, each true or false, so there are $2^{${n - k - 1}} = ${answer}$ false rows.`,
              `其余 $${n - k - 1}$ 个变量自由，每个可真可假，所以有 $2^{${n - k - 1}} = ${answer}$ 个假行。`,
            ),
          ],
        ],
        t(
          `With no free variables there would be exactly one false row, T…T then F for $q$; each of the $${n - k - 1}$ free variables doubles that: $${[1, ...Array.from({ length: n - k - 1 }, (_, i) => 2 ** (i + 1))].join(", ")}$.`,
          `若没有自由变量，就恰有一个假行：各 $p_i$ 为 T，$q$ 为 F；$${n - k - 1}$ 个自由变量每个使它翻倍：$${[1, ...Array.from({ length: n - k - 1 }, (_, i) => 2 ** (i + 1))].join(", ")}$。`,
        ),
      ),
    });
  },
};

const trueRowsOfBiconditionals: KnowledgePointDef = {
  id: "the-true-rows-of-several-biconditionals",
  title: t("The true rows of several biconditionals", "多个双条件的真行"),
  explanation: t(
    "A biconditional is true when its two sides have the same value, which is $2$ of the $4$ value pairs of its two variables, TT and FF. So it allows half of the rows. If several biconditionals share no variables, each separately halves the rows, because each ties one variable to another and leaves the rest alone. In $4$ variables, $(p_1 \\leftrightarrow q_1) \\land (p_2 \\leftrightarrow q_2)$ is true in $16 \\div 2 \\div 2 = 4$ rows: $p_1$ and $p_2$ are free, and each $q_i$ copies its $p_i$.\n\n> **Watch out.** A biconditional does not fix its variables; it allows two of their four value pairs. It halves the rows, it does not quarter them.",
    "双条件在两边取值相同时为真，这是它两个变量的 $4$ 种取值中的 $2$ 种，TT 与 FF。所以它允许一半的行。如果几个双条件没有公共变量，每一个都独立地使行数减半，因为每一个只把一个变量绑定到另一个变量，不影响其余变量。在 $4$ 个变量中，$(p_1 \\leftrightarrow q_1) \\land (p_2 \\leftrightarrow q_2)$ 在 $16 \\div 2 \\div 2 = 4$ 行为真：$p_1$、$p_2$ 自由，每个 $q_i$ 与对应的 $p_i$ 相同。\n\n> **注意。** 双条件并不固定它的变量；它允许两个变量四种取值中的两种。它使行数减半，而不是变为四分之一。",
  ),
  generate(rng) {
    const k = rng.int(1, 4);
    const n = rng.int(2 * k, 12);
    const answer = 2 ** (n - k);
    const pair = (i: number) => `(p_{${i}} \\leftrightarrow q_{${i}})`;
    const formula = k === 1 ? pair(1) : k === 2 ? `${pair(1)} \\land ${pair(2)}` : `${pair(1)} \\land \\dots \\land ${pair(k)}`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including every $p_i$ and $q_i$ in $${formula}$. In how many rows is this formula true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $${formula}$ 中的每个 $p_i$ 和 $q_i$。这个公式在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** n - answer, 2 ** (n - 1), 2 ** (n - 2 * k)],
      mistakes: [
        why(2 ** n - answer, "That counts the rows where the formula is false.", "这是公式为假的行数。"),
        why(
          2 ** (n - 1),
          "That halves the rows only once; each biconditional halves them again.",
          "这只减半了一次；每个双条件都要再减半一次。",
        ),
        why(
          2 ** (n - 2 * k),
          "That fixes both variables of each biconditional, but each allows two value pairs, TT and FF.",
          "这把每个双条件的两个变量都固定了，但每个双条件允许两种取值，TT 和 FF。",
        ),
      ],
      solution: walked(
        [
          [
            ["One biconditional halves the rows", "一个双条件使行数减半"],
            t(
              "$p_i \\leftrightarrow q_i$ is true when $q_i$ has the same value as $p_i$: for each choice of the other variables, one of the two values of $q_i$ works.",
              "$p_i \\leftrightarrow q_i$ 在 $q_i$ 与 $p_i$ 取值相同时为真：其余变量每取定一组值，$q_i$ 的两种取值中恰有一种可行。",
            ),
          ],
          [
            ["Halve once for each", "每个都减半一次"],
            t(
              `The ${count(k, "biconditional shares", "biconditionals share")} no variables, so the halvings are independent: $2^{${n}} \\div 2^{${k}} = ${answer}$.`,
              `这 ${k} 个双条件没有公共变量，所以每次减半互不影响：$2^{${n}} \\div 2^{${k}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Count another way. Each pair $p_i, q_i$ has $2$ allowed value pairs, and the other $${n - 2 * k}$ variables are free: $2^{${k}} \\cdot 2^{${n - 2 * k}} = ${answer}$.`,
          `换一种数法。每一对 $p_i, q_i$ 有 $2$ 种允许的取值，其余 $${n - 2 * k}$ 个变量自由：$2^{${k}} \\cdot 2^{${n - 2 * k}} = ${answer}$。`,
        ),
      ),
    });
  },
};
const conditionsOnMultiples: KnowledgePointDef = {
  id: "counting-sufficient-and-necessary-divisibility-conditions",
  title: t("Counting sufficient and necessary divisibility conditions", "数可除性的充分条件和必要条件"),
  explanation: t(
    'Saying that $P$ is sufficient for $Q$ means $P \\to Q$, and saying that $P$ is necessary for $Q$ means $Q \\to P$. Being a multiple of $a$ implies being a multiple of $k$ exactly when $k$ divides $a$. So these two words turn a question about conditions into one about divisors or about multiples. For $a = 6$, "$n$ is a multiple of $6$" is sufficient for "$n$ is a multiple of $k$" when $k$ is $1$, $2$, $3$ or $6$.\n\n> **Watch out.** The two words point in opposite directions. Sufficient leads to the divisors of $a$, necessary to the multiples of $a$; swapping them counts the wrong set.',
    "说 $P$ 是 $Q$ 的充分条件，就是 $P \\to Q$；说 $P$ 是 $Q$ 的必要条件，就是 $Q \\to P$。是 $a$ 的倍数蕴涵是 $k$ 的倍数，当且仅当 $k$ 整除 $a$。所以这两个词把关于条件的问题变成了关于因数或倍数的问题。对 $a = 6$，当 $k$ 为 $1$、$2$、$3$ 或 $6$ 时，“$n$ 是 $6$ 的倍数”是“$n$ 是 $k$ 的倍数”的充分条件。\n\n> **注意。** 这两个词方向相反。充分条件引向 $a$ 的因数，必要条件引向 $a$ 的倍数；弄反了就数错了集合。",
  ),
  generate(rng) {
    const a = rng.int(6, 60);
    const divisors = divisorsOf(a);
    if (rng.pick([true, false])) {
      const answer = divisors.length;
      const other = oneTo(a).find((k) => a % k !== 0)!;
      return numberProblem({
        prompt: t(
          `For how many positive integers $k$ is "$n$ is a multiple of ${a}" a sufficient condition for "$n$ is a multiple of $k$"?`,
          `对多少个正整数 $k$，"$n$ 是 ${a} 的倍数"是"$n$ 是 $k$ 的倍数"的充分条件？`,
        ),
        answer,
        form: "integer",
        wrong: [answer - 2, answer - 1, a],
        mistakes: [
          why(
            a,
            `That counts every $k$ up to ${a}; only the divisors of ${a} work.`,
            `这数的是 ${a} 以内的所有 $k$；只有 ${a} 的因数可以。`,
          ),
          why(
            answer - 2,
            `That leaves out $1$ and ${a}; both divide ${a}, so both count.`,
            `这漏掉了 $1$ 和 ${a}；它们都整除 ${a}，都要算。`,
          ),
        ],
        solution: walked(
          [
            [
              ["Write the condition as an implication", "把条件写成蕴涵"],
              t(
                `Sufficient means "multiple of ${a}" $\\to$ "multiple of $k$", which holds exactly when $k$ divides ${a}.`,
                `充分条件即“${a} 的倍数”$\\to$“$k$ 的倍数”，这当且仅当 $k$ 整除 ${a}。`,
              ),
            ],
            [
              ["Count the divisors", "数出因数"],
              t(
                `The divisors of ${a} are ${divisors.join(", ")}: ${answer} numbers.`,
                `${a} 的因数是 ${divisors.join(", ")}：共 ${answer} 个。`,
              ),
            ],
          ],
          t(
            `Try $k = ${other}$, which does not divide ${a}: the number ${a} is a multiple of ${a} but not of ${other}, so the implication fails and ${other} is rightly left out.`,
            `试不整除 ${a} 的 $k = ${other}$：${a} 是 ${a} 的倍数，却不是 ${other} 的倍数，蕴涵不成立，所以 ${other} 确实不算。`,
          ),
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
      wrong: [answer + 1],
      mistakes: [
        why(
          divisors.length,
          `That counts the divisors of ${a}, which answers the sufficient question; necessary turns the implication around.`,
          `这数的是 ${a} 的因数，回答的是充分条件的问题；必要条件把蕴涵反过来。`,
        ),
        why(top - answer, `That counts the $k$ that are not multiples of ${a}.`, `这数的是不是 ${a} 的倍数的 $k$。`),
      ],
      solution: walked(
        [
          [
            ["Write the condition as an implication", "把条件写成蕴涵"],
            t(
              `Necessary means "multiple of $k$" $\\to$ "multiple of ${a}": every multiple of $k$, $k$ itself included, is a multiple of ${a}. That holds exactly when ${a} divides $k$.`,
              `必要条件即“$k$ 的倍数”$\\to$“${a} 的倍数”：$k$ 的每个倍数，包括 $k$ 本身，都是 ${a} 的倍数。这当且仅当 ${a} 整除 $k$。`,
            ),
          ],
          [
            [`Count the multiples of ${a}`, `数出 ${a} 的倍数`],
            t(
              `There are $\\lfloor ${top} / ${a} \\rfloor = ${answer}$ multiples of ${a} from 1 to ${top}.`,
              `从 1 到 ${top} 中 ${a} 的倍数有 $\\lfloor ${top} / ${a} \\rfloor = ${answer}$ 个。`,
            ),
          ],
        ],
        t(
          `Try $k = ${a + 1}$: it is a multiple of itself but not of ${a}, so it is rightly left out. Try $k = ${2 * a}$: every multiple of ${2 * a} is a multiple of ${a}, so it counts.`,
          `试 $k = ${a + 1}$：它是自身的倍数，却不是 ${a} 的倍数，所以确实不算。试 $k = ${2 * a}$：${2 * a} 的每个倍数都是 ${a} 的倍数，所以它算。`,
        ),
      ),
    });
  },
};

const squaresByCases: KnowledgePointDef = {
  id: "the-remainders-a-square-can-leave",
  title: t("The remainders a square can leave", "平方数可能的余数"),
  explanation: t(
    "A claim about all integers can often be proved by finitely many cases, one for each remainder. The remainder of a square depends only on the remainder of the number, so it is enough to square each residue. Since $n$ and $-n$ have the same square, only half of the residues need to be tried. On division by $4$: $0^2 = 0$, $1^2 = 1$, $2^2 = 4 \\equiv 0$, so a square leaves only $0$ or $1$.\n\n> **Watch out.** Count different remainders, not residues tried. Two residues whose squares agree give one remainder, not two.",
    "关于所有整数的命题，常常可以按余数分成有限种情况来证明。平方数的余数只取决于这个数的余数，所以只要把每个余数平方。由于 $n$ 和 $-n$ 的平方相同，只需试一半的余数。除以 $4$ 时：$0^2 = 0$，$1^2 = 1$，$2^2 = 4 \\equiv 0$，所以平方数只余 $0$ 或 $1$。\n\n> **注意。** 要数不同的余数，而不是试过的余数个数。两个余数的平方相同时，只算一个余数。",
  ),
  generate(rng) {
    const m = rng.int(3, 32);
    const half = Math.floor(m / 2);
    const squares = [...Array(half + 1).keys()].map((i) => (i * i) % m);
    const values = [...new Set(squares)].sort((x, y) => x - y);
    const answer = values.length;
    const r = half + 1;
    return numberProblem({
      prompt: t(
        `As $n$ runs through the integers, how many different remainders can $n^2$ leave on division by ${m}?`,
        `当 $n$ 取遍所有整数时，$n^2$ 除以 ${m} 可能有多少种不同的余数？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(
          m,
          `That counts the remainders of $n$; different remainders of $n$ can give the same remainder of $n^2$.`,
          `这数的是 $n$ 的余数；$n$ 的不同余数可以给出 $n^2$ 的相同余数。`,
        ),
        why(
          half + 1,
          `That counts the residues tried, but some of their squares leave the same remainder.`,
          `这数的是试过的余数个数，但其中有些平方的余数相同。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Halve the cases", "情况减半"],
            t(
              `$n$ and $${m} - n$ have the same square modulo $${m}$, so the residues $0$ to $${half}$ cover every case.`,
              `$n$ 与 $${m} - n$ 的平方模 $${m}$ 相同，所以余数 $0$ 到 $${half}$ 就覆盖了所有情况。`,
            ),
          ],
          [
            ["Square them", "把它们平方"],
            t(`Their squares leave the remainders $${squares.join(", ")}$.`, `它们的平方分别余 $${squares.join(", ")}$。`),
          ],
          [
            ["Count the different ones", "数不同的余数"],
            t(
              `The different remainders are $${values.join(", ")}$: ${answer} of them.`,
              `不同的余数是 $${values.join(", ")}$：共 ${answer} 个。`,
            ),
          ],
        ],
        t(
          `A residue past $${half}$ adds nothing new: $${r}^2 = ${r * r}$ leaves $${(r * r) % m}$, the same as $${m - r}^2$.`,
          `超过 $${half}$ 的余数不会带来新的结果：$${r}^2 = ${r * r}$ 余 $${(r * r) % m}$，与 $${m - r}^2$ 相同。`,
        ),
      ),
    });
  },
};

const rationalisingMultiplier: KnowledgePointDef = {
  id: "the-smallest-multiplier-that-makes-a-root-rational",
  title: t("The smallest multiplier that makes a root rational", "使根式成为有理数的最小乘数"),
  explanation: t(
    "The square root of a positive integer is rational only if the integer is a perfect square; otherwise it is irrational, by the usual contradiction. So to make a root rational, every prime in the integer must have an even exponent. Write the integer as a square times a square-free part. That part supplies the smallest multiplier. For $\\sqrt{12k}$: $12 = 4 \\cdot 3$, so $k = 3$ gives $\\sqrt{36} = 6$.\n\n> **Watch out.** Only the square-free part needs a partner. The square factor is already a perfect square, so multiplying by its root adds nothing.",
    "正整数的平方根只有在这个数是完全平方数时才是有理数，否则由通常的反证法知它是无理数。所以要使根式成为有理数，每个素因子的指数都必须是偶数。把这个数写成一个平方数乘以无平方因子的部分，这一部分就是最小的乘数。对 $\\sqrt{12k}$：$12 = 4 \\cdot 3$，所以 $k = 3$ 得 $\\sqrt{36} = 6$。\n\n> **注意。** 只有无平方因子的部分需要配对。平方因子本身已经是完全平方数，再乘以它的平方根没有用处。",
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
      mistakes: firstOf([
        why(
          a,
          `$k = ${a}$ works, since $${a}^2$ is a square, but it is not the smallest.`,
          `$k = ${a}$ 可行，因为 $${a}^2$ 是平方数，但它不是最小的。`,
        ),
        why(
          s,
          `$${s * s}$ is already a perfect square; it is the part $${free}$ that needs a partner.`,
          `$${s * s}$ 已经是完全平方数；需要配对的是 $${free}$ 这一部分。`,
        ),
        why(
          s * free,
          `The factor $${s}$ is not needed: $${s * s}$ is already a perfect square.`,
          `不需要因数 $${s}$：$${s * s}$ 已经是完全平方数。`,
        ),
      ]),
      solution: walked(
        [
          [["Split off the square", "分出平方因子"], t(`$${a} = ${s * s} \\cdot ${free}$.`, `$${a} = ${s * s} \\cdot ${free}$。`)],
          [
            ["Simplify the root", "化简根式"],
            t(
              `$\\sqrt{${a}k} = ${s}\\sqrt{${free}k}$, which is rational only if $${free}k$ is a perfect square.`,
              `$\\sqrt{${a}k} = ${s}\\sqrt{${free}k}$，只有 $${free}k$ 是完全平方数时它才是有理数。`,
            ),
          ],
          [
            ["Choose the smallest k", "取最小的 k"],
            t(
              `$${free}$ has no square factor, so the smallest choice is $k = ${free}$.`,
              `$${free}$ 没有平方因子，所以最小取 $k = ${free}$。`,
            ),
          ],
        ],
        t(
          `$${a} \\cdot ${free} = ${a * free} = ${s * free}^2$, so $\\sqrt{${a * free}} = ${s * free}$.`,
          `$${a} \\cdot ${free} = ${a * free} = ${s * free}^2$，所以 $\\sqrt{${a * free}} = ${s * free}$。`,
        ),
      ),
    });
  },
};

const remainderForAFactor: KnowledgePointDef = {
  id: "a-remainder-for-a-factor-of-the-divisor",
  title: t("A remainder for a factor of the divisor", "除数的因数对应的余数"),
  explanation: t(
    "If you know the remainder of $n$ on division by $ab$, you also know its remainder on division by $a$. Write $n = abq + r$ and notice that $abq$ is a multiple of $a$. So only $r$ matters. The converse fails: knowing the remainder for $a$ does not determine the remainder for $ab$.\n\n> **Watch out.** A remainder on division by $a$ is less than $a$. The old remainder $r$ is usually too big, so divide it by $a$ in turn.",
    "如果知道 $n$ 除以 $ab$ 的余数，也就知道它除以 $a$ 的余数。写出 $n = abq + r$，注意 $abq$ 是 $a$ 的倍数，所以只有 $r$ 起作用。反过来不成立：知道除以 $a$ 的余数，并不能确定除以 $ab$ 的余数。\n\n> **注意。** 除以 $a$ 的余数小于 $a$。原来的余数 $r$ 通常太大，还要再除以 $a$。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const r = rng.int(a, a * b - 1);
    const answer = r % a;
    const n = a * b + r;
    return numberProblem({
      prompt: t(
        `An integer $n$ leaves remainder ${r} on division by ${a * b}. What remainder does it leave on division by ${a}?`,
        `整数 $n$ 除以 ${a * b} 余 ${r}。它除以 ${a} 余多少？`,
      ),
      answer,
      form: "integer",
      wrong: [a - answer],
      mistakes: firstOf([
        why(
          r,
          `That is the remainder on division by $${a * b}$; a remainder on division by $${a}$ must be less than $${a}$.`,
          `这是除以 $${a * b}$ 的余数；除以 $${a}$ 的余数必须小于 $${a}$。`,
        ),
        why(
          Math.floor(r / a),
          `That is the quotient of $${r}$ by $${a}$, not the remainder.`,
          `这是 $${r}$ 除以 $${a}$ 的商，而不是余数。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Write n with the larger divisor", "用较大的除数写出 n"],
            t(`$n = ${a * b}q + ${r}$ for some integer $q$.`, `存在整数 $q$ 使 $n = ${a * b}q + ${r}$。`),
          ],
          [
            [`Drop the multiple of ${a}`, `去掉 ${a} 的倍数`],
            t(
              `$${a * b}q = ${a}(${b}q)$ is a multiple of $${a}$, so $n$ leaves the same remainder as $${r} = ${a} \\cdot ${Math.floor(r / a)} + ${answer}$: the remainder is $${answer}$.`,
              `$${a * b}q = ${a}(${b}q)$ 是 $${a}$ 的倍数，所以 $n$ 的余数与 $${r} = ${a} \\cdot ${Math.floor(r / a)} + ${answer}$ 相同：余数是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `Take $q = 1$: $n = ${n} = ${a} \\cdot ${Math.floor(n / a)} + ${answer}$.`,
          `取 $q = 1$：$n = ${n} = ${a} \\cdot ${Math.floor(n / a)} + ${answer}$。`,
        ),
      ),
    });
  },
};

const euclidSteps: KnowledgePointDef = {
  id: "counting-the-divisions-of-the-euclidean-algorithm",
  title: t("Counting the divisions of the Euclidean algorithm", "数欧几里得算法的除法次数"),
  explanation: t(
    "The cost of the Euclidean algorithm is the number of divisions it performs. Every two steps at least halve the larger number, so this count grows only with the number of digits, which is why the algorithm is fast even for huge inputs. Trace the remainders until one of them is zero, and count that last division too.\n\n> **Watch out.** Count the division that leaves remainder $0$ as well: it is the one that shows the previous remainder is the gcd.",
    "欧几里得算法的代价是它做除法的次数。每两步至少使较大的数减半，所以这个次数只随位数增长，这就是算法即使对很大的输入也很快的原因。依次写出余数，直到某个余数为零，最后这次除法也要算上。\n\n> **注意。** 余数为 $0$ 的那次除法也要算上：正是它说明了前一个余数是最大公因数。",
  ),
  generate(rng) {
    const a = rng.int(40, 300);
    const b = rng.int(11, a - 1);
    const lines: string[] = [];
    let x = a;
    let y = b;
    while (y !== 0) {
      const next = x % y;
      lines.push(`${x} = ${y} \\cdot ${Math.floor(x / y)} + ${next}`);
      x = y;
      y = next;
    }
    const answer = lines.length;
    return numberProblem({
      prompt: t(
        `The Euclidean algorithm is applied to ${a} and ${b}. How many divisions does it make, including the one that leaves remainder 0?`,
        `对 ${a} 和 ${b} 使用欧几里得算法。它要做多少次除法，包括余数为 0 的那一次？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(answer - 1, "That leaves out the last division, the one with remainder $0$.", "这漏掉了最后一次余数为 $0$ 的除法。"),
        why(x, "That is the gcd the algorithm finds, not the number of divisions.", "这是算法求出的最大公因数，而不是除法的次数。"),
      ]),
      solution: walked(
        [
          [["Run the divisions", "依次做除法"], t("Divide until a remainder is $0$:", "一直除到余数为 $0$："), lines],
          [
            ["Count them", "数一数"],
            t(`There is one line per division, so there are $${answer}$ divisions.`, `每次除法一行，所以共有 $${answer}$ 次除法。`),
          ],
        ],
        t(
          `The last nonzero remainder $${x}$ divides both numbers: $${a} = ${x} \\cdot ${a / x}$ and $${b} = ${x} \\cdot ${b / x}$, so the algorithm did end at the gcd.`,
          `最后一个非零余数 $${x}$ 整除两个数：$${a} = ${x} \\cdot ${a / x}$，$${b} = ${x} \\cdot ${b / x}$，所以算法确实在最大公因数处结束。`,
        ),
      ),
    });
  },
};

const smallestPositiveSolution: KnowledgePointDef = {
  id: "the-smallest-positive-x-of-a-linear-diophantine-equation",
  title: t("The smallest positive $x$ of a linear Diophantine equation", "线性丢番图方程的最小正 $x$"),
  explanation: t(
    "For coprime $a$ and $b$, the values of $x$ in the integer solutions of $ax + by = c$ differ by multiples of $b$, because adding $b$ to $x$ can be balanced by subtracting $a$ from $y$. So exactly one solution has $x$ between $1$ and $b$. Here $y$ may be negative, so positivity of $y$ is not required.\n\n> **Watch out.** The values of $x$ repeat every $b$, the coefficient of $y$, not every $a$. Once one solution is found, any smaller positive $x$ must differ from it by a multiple of $b$.",
    "$a$、$b$ 互素时，$ax + by = c$ 的整数解中，$x$ 的值相差 $b$ 的倍数，因为给 $x$ 加 $b$，可以通过给 $y$ 减 $a$ 来抵消。所以恰有一个解的 $x$ 在 $1$ 到 $b$ 之间。这里 $y$ 可以是负数，不要求它为正。\n\n> **注意。** $x$ 的值每隔 $b$（$y$ 的系数）重复一次，而不是每隔 $a$。找到一个解后，更小的正 $x$ 必须与它相差 $b$ 的倍数。",
  ),
  generate(rng) {
    const a = rng.int(3, 15);
    let b = rng.int(3, 15);
    while (gcd(a, b) !== 1) b += 1;
    const c = rng.int(20, 100);
    let x = 1;
    while ((c - a * x) % b !== 0) x += 1;
    const y = (c - a * x) / b;
    const rems = Array.from({ length: x }, (_, i) => (((c - a * (i + 1)) % b) + b) % b).join(", ");
    return numberProblem({
      prompt: t(
        `Among the integer solutions of $${poly([a, "x"], [b, "y"])} = ${c}$, where $y$ may be negative, what is the smallest positive value of $x$?`,
        `在 $${poly([a, "x"], [b, "y"])} = ${c}$ 的整数解中（$y$ 可以为负），$x$ 的最小正值是多少？`,
      ),
      answer: x,
      form: "integer",
      wrong: [(c % b) + 1],
      mistakes: firstOf([
        why(
          x + b,
          `That gives a solution, but $${b}$ less is one too: the values of $x$ repeat every $${b}$.`,
          `这给出一个解，但再减 $${b}$ 也是解：$x$ 的值每隔 $${b}$ 重复一次。`,
        ),
        why(
          b,
          `That is how often $x$ repeats, not a solution: $${c} - ${a} \\cdot ${b}$ is not a multiple of $${b}$.`,
          `这是 $x$ 重复的间隔，而不是解：$${c} - ${a} \\cdot ${b}$ 不是 $${b}$ 的倍数。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["State the condition", "写出条件"],
            t(
              `$y = \\frac{${c} - ${a}x}{${b}}$ is an integer exactly when $${b} \\mid ${c} - ${a}x$.`,
              `$y = \\frac{${c} - ${a}x}{${b}}$ 是整数当且仅当 $${b} \\mid ${c} - ${a}x$。`,
            ),
          ],
          [
            ["Try x from 1 upward", "从 1 开始试 x"],
            t(
              `For $x = 1, \\dots, ${x}$ the remainders of $${c} - ${a}x$ on division by $${b}$ are $${rems}$. The first $0$ is at $x = ${x}$, with $y = ${y}$.`,
              `$x = 1, \\dots, ${x}$ 时，$${c} - ${a}x$ 除以 $${b}$ 的余数依次是 $${rems}$。第一个 $0$ 出现在 $x = ${x}$，此时 $y = ${y}$。`,
            ),
          ],
        ],
        t(
          `$${a} \\cdot ${x} + ${b} \\cdot ${y < 0 ? `(${y})` : y} = ${a * x} ${y < 0 ? "-" : "+"} ${Math.abs(b * y)} = ${c}$.`,
          `$${a} \\cdot ${x} + ${b} \\cdot ${y < 0 ? `(${y})` : y} = ${a * x} ${y < 0 ? "-" : "+"} ${Math.abs(b * y)} = ${c}$。`,
        ),
      ),
    });
  },
};

const gcdTimesLcm: KnowledgePointDef = {
  id: "a-number-from-its-gcd-and-lcm",
  title: t("A number from its gcd and lcm", "由最大公因数和最小公倍数求数"),
  explanation: t(
    "For positive integers, $\\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = ab$. In each prime, the gcd takes the smaller exponent and the lcm the larger, so together they use both exponents, just as the product $ab$ does. Knowing one number with the gcd and the lcm therefore determines the other number.\n\n> **Watch out.** Divide the whole product $\\gcd \\cdot \\operatorname{lcm}$ by the known number. The quotient $\\frac{\\operatorname{lcm}}{a}$ alone misses the factor from the gcd.",
    "对正整数，$\\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = ab$。对每个素数，最大公因数取较小的指数，最小公倍数取较大的指数，所以二者合起来用到了两个指数，和乘积 $ab$ 一样。因此知道一个数以及最大公因数和最小公倍数，就能确定另一个数。\n\n> **注意。** 要用整个乘积 $\\gcd \\cdot \\operatorname{lcm}$ 除以已知的数。只算 $\\frac{\\operatorname{lcm}}{a}$ 会漏掉来自最大公因数的因子。",
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
      wrong: [lcm - a],
      mistakes: firstOf([
        why(
          q,
          "That is the lcm divided by $a$; the factor from the gcd is missing.",
          "这是最小公倍数除以 $a$；漏掉了来自最大公因数的因子。",
        ),
        why(g * lcm, "That is the product $ab$ itself; divide it by $a$.", "这是乘积 $ab$ 本身；还要除以 $a$。"),
      ]),
      solution: walked(
        [
          [
            ["Use the product rule", "用乘积关系"],
            t(
              `$ab = \\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = ${g} \\cdot ${lcm} = ${g * lcm}$.`,
              `$ab = \\gcd(a, b) \\cdot \\operatorname{lcm}(a, b) = ${g} \\cdot ${lcm} = ${g * lcm}$。`,
            ),
          ],
          [["Divide by a", "除以 a"], t(`$b = \\frac{${g * lcm}}{${a}} = ${b}$.`, `$b = \\frac{${g * lcm}}{${a}} = ${b}$。`)],
        ],
        t(
          `$\\gcd(${a}, ${b}) = ${g}$, and $\\frac{${a} \\cdot ${b}}{${g}} = ${lcm}$ is the lcm, as given.`,
          `$\\gcd(${a}, ${b}) = ${g}$，且 $\\frac{${a} \\cdot ${b}}{${g}} = ${lcm}$ 正是给定的最小公倍数。`,
        ),
      ),
    });
  },
};

const legendre: KnowledgePointDef = {
  id: "the-power-of-a-prime-in-a-factorial",
  title: t("The power of a prime in a factorial", "阶乘中素数的幂次"),
  explanation: t(
    "To find the exponent of a prime $p$ in $n!$, count the factors from $1$ to $n$ that contribute. Each multiple of $p$ gives one factor, each multiple of $p^2$ gives one more, and so on. So the exponent is $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$, and the sum stops once the power exceeds $n$.\n\n> **Watch out.** A multiple of $p^2$ contributes two factors of $p$, so it is counted again in the second term. Stopping at $\\lfloor \\frac{n}{p} \\rfloor$ undercounts.",
    "要求素数 $p$ 在 $n!$ 中的指数，就数 $1$ 到 $n$ 中贡献因子的数。$p$ 的每个倍数贡献一个因子，$p^2$ 的每个倍数再多贡献一个，依此类推。所以指数是 $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$，幂超过 $n$ 后这个和就终止了。\n\n> **注意。** $p^2$ 的倍数贡献两个因子 $p$，所以在第二项中要再数一次。只算到 $\\lfloor \\frac{n}{p} \\rfloor$ 会数少。",
  ),
  generate(rng) {
    const p = rng.pick([2, 3, 5, 7]);
    const n = rng.int(p * p, 200);
    const parts: number[] = [];
    const lines: string[] = [];
    let e = 1;
    for (let power = p; power <= n; power *= p, e++) {
      parts.push(Math.floor(n / power));
      lines.push(
        `\\left\\lfloor \\frac{${n}}{${p}^{${e}}} \\right\\rfloor = \\left\\lfloor \\frac{${n}}{${power}} \\right\\rfloor = ${Math.floor(n / power)}`,
      );
    }
    const answer = parts.reduce((sum, v) => sum + v, 0);
    return numberProblem({
      prompt: t(`What is the largest $k$ for which $${p}^k$ divides $${n}!$?`, `使 $${p}^k$ 整除 $${n}!$ 的最大 $k$ 是多少？`),
      answer,
      form: "integer",
      wrong: [(parts[0] ?? 0) + (parts[1] ?? 0) + 1],
      mistakes: firstOf([
        why(
          Math.floor(n / p),
          `That counts the multiples of $${p}$ only; multiples of $${p * p}$ give a second factor of $${p}$.`,
          `这只数了 $${p}$ 的倍数；$${p * p}$ 的倍数还会贡献第二个因子 $${p}$。`,
        ),
        why(
          Math.floor(n / (p - 1)),
          `That approximates the sum by $\\frac{n}{p - 1}$; the floors make the true sum smaller.`,
          `这是用 $\\frac{n}{p - 1}$ 近似这个和；取整后真实的和更小。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the multiples of each power", "数每个幂的倍数"],
            t(
              `Each power of $${p}$ up to $${n}$ adds one factor for each of its multiples:`,
              `不超过 $${n}$ 的 $${p}$ 的每个幂，对它的每个倍数各贡献一个因子：`,
            ),
            lines,
          ],
          [["Add", "相加"], t(`$${parts.join(" + ")} = ${answer}$.`, `$${parts.join(" + ")} = ${answer}$。`)],
        ],
        t(
          `The next power, $${p}^{${e}} = ${p ** e}$, exceeds $${n}$, so it adds nothing, and the sum is complete.`,
          `下一个幂 $${p}^{${e}} = ${p ** e}$ 超过了 $${n}$，不再贡献，所以这个和是完整的。`,
        ),
      ),
    });
  },
};

const coefficientForInduction: KnowledgePointDef = {
  id: "finding-the-formula-that-induction-will-prove",
  title: t("Finding the formula that induction will prove", "求出归纳法要证明的公式"),
  explanation: t(
    "Induction proves a formula but does not say where it came from. The inductive step can find it: if $S(n) = \\alpha n^2 + \\beta n$, then $S(n + 1) - S(n)$ must equal the next term for every $n$. Comparing the coefficients of $n$ and the constants fixes $\\alpha$ and $\\beta$, and then the base case holds automatically.\n\n> **Watch out.** $S(n + 1) - S(n)$ is the term at $k = n + 1$, not at $k = n$. Substitute $n + 1$ for $k$ before comparing.",
    "归纳法能证明公式，却不说明公式从何而来。归纳步骤可以用来求公式：如果 $S(n) = \\alpha n^2 + \\beta n$，那么对每个 $n$，$S(n + 1) - S(n)$ 都必须等于下一项。比较 $n$ 的系数和常数项就确定了 $\\alpha$ 和 $\\beta$，这时基础情形自动成立。\n\n> **注意。** $S(n + 1) - S(n)$ 是 $k = n + 1$ 时的项，而不是 $k = n$ 时的。比较之前先把 $k$ 换成 $n + 1$。",
  ),
  generate(rng) {
    const a = rng.int(1, 8);
    const b = rng.pick([...Array(19).keys()].map((i) => i - 9).filter((i) => i !== 0));
    const answer = Q.of(a + 2 * b, 2);
    const alpha = Q.of(a, 2);
    const term = poly([a, "k"], [b, ""]);
    const next = poly([a, "n"], [a + b, ""]);
    const top = a + 2 * b < 0 ? `(${a + 2 * b})` : `${a + 2 * b}`;
    return numberProblem({
      prompt: t(
        `There are constants with $\\sum_{k=1}^{n} (${term}) = \\alpha n^2 + \\beta n$ for every positive integer $n$. Find $\\beta$.`,
        `存在常数使得对每个正整数 $n$，$\\sum_{k=1}^{n} (${term}) = \\alpha n^2 + \\beta n$。求 $\\beta$。`,
      ),
      answer,
      wrong: [Q.of(a + b)],
      mistakes: [
        why(alpha, "That is $\\alpha$, the coefficient of $n^2$.", "这是 $\\alpha$，即 $n^2$ 的系数。"),
        ...(a === 2 * b
          ? []
          : [
              why(
                Q.of(b),
                "That matches the constants without the $\\alpha$ that $\\alpha(2n + 1)$ also contributes.",
                "这样比较常数项时漏掉了 $\\alpha(2n + 1)$ 中 $\\alpha$ 的贡献。",
              ),
            ]),
      ],
      solution: walked(
        [
          [
            ["Take the difference", "作差"],
            t(
              `$S(n + 1) - S(n) = \\alpha(2n + 1) + \\beta$, and it must equal the term at $k = n + 1$, which is $${poly([a, "(n + 1)"], [b, ""])} = ${next}$.`,
              `$S(n + 1) - S(n) = \\alpha(2n + 1) + \\beta$，它必须等于 $k = n + 1$ 时的项，即 $${poly([a, "(n + 1)"], [b, ""])} = ${next}$。`,
            ),
          ],
          [
            ["Compare coefficients", "比较系数"],
            t(
              `The coefficients of $n$ give $2\\alpha = ${a}$, so $\\alpha = ${alpha.toLatex()}$. The constants give $\\alpha + \\beta = ${a + b}$, so $\\beta = ${answer.toLatex()}$.`,
              `比较 $n$ 的系数得 $2\\alpha = ${a}$，所以 $\\alpha = ${alpha.toLatex()}$。比较常数项得 $\\alpha + \\beta = ${a + b}$，所以 $\\beta = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `At $n = 1$: $\\alpha + \\beta = \\frac{${a} + ${top}}{2} = ${a + b}$, which is the first term, $${a} \\cdot 1 ${b < 0 ? "-" : "+"} ${Math.abs(b)}$.`,
          `$n = 1$ 时：$\\alpha + \\beta = \\frac{${a} + ${top}}{2} = ${a + b}$，正是第一项 $${a} \\cdot 1 ${b < 0 ? "-" : "+"} ${Math.abs(b)}$。`,
        ),
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
    "A function whose range avoids certain values of the codomain is simply a function into the smaller set that remains. So counting such functions needs no new idea: remove the values that must be missed, and count the functions into what is left. Each input now has fewer outputs to choose from. From a $3$-element set to a $5$-element set, avoiding one given value: $4^{3} = 64$ functions.\n\n> **Watch out.** Remove the forbidden values from the codomain, not from the domain. Every input still needs an output, so the exponent stays at the number of inputs.",
    "值域避开陪域中某些值的函数，其实就是到剩余较小集合的函数。所以数这样的函数不需要新想法：去掉必须避开的值，再数到剩余集合的函数。现在每个输入可选的输出更少了。从 $3$ 元集合到 $5$ 元集合、避开一个给定值的函数有 $4^{3} = 64$ 个。\n\n> **注意。** 要从陪域中去掉禁止的值，而不是从定义域中去掉。每个输入仍然需要一个输出，所以指数仍是输入的个数。",
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
      wrong: [answer + 1],
      mistakes: firstOf([
        why(n ** m, "That counts every function, ignoring the values that must be missed.", "这数的是全部函数，忽略了必须避开的值。"),
        why(n ** m - answer, "That counts the functions that do reach a forbidden value.", "这数的是确实取到禁止值的函数。"),
        why(
          left ** (m - 1),
          "The exponent is the number of inputs; every input still needs an output.",
          "指数是输入的个数；每个输入仍然需要一个输出。",
        ),
        why(
          m ** left,
          "Base and exponent are swapped: each input picks one of the allowed outputs.",
          "底数与指数弄反了：每个输入从允许的输出中选一个。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Remove the forbidden values", "去掉禁止的值"],
            t(
              `$${k}$ of the $${n}$ outputs are off limits, leaving $${left}$ allowed outputs.`,
              `$${n}$ 个输出中有 $${k}$ 个不能用，剩下 $${left}$ 个允许的输出。`,
            ),
          ],
          [
            ["Count the functions", "数函数"],
            t(
              `Each of the $${m}$ inputs picks one of the $${left}$, independently: $${left}^{${m}} = ${answer}$.`,
              `$${m}$ 个输入各自独立地从这 $${left}$ 个中选一个：$${left}^{${m}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `With one input there would be $${left}$ functions, one per allowed output, and each further input multiplies the count by $${left}$ again: $${Array(m).fill(left).join(" \\cdot ")} = ${answer}$.`,
          `只有一个输入时有 $${left}$ 个函数，每个允许的输出对应一个；每多一个输入，个数就再乘以 $${left}$：$${Array(m).fill(left).join(" \\cdot ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const floorSum: KnowledgePointDef = {
  id: "the-sum-of-a-run-of-floors",
  title: t("The sum of a run of floors", "一串取整值的和"),
  explanation: t(
    "The values of $\\lfloor \\frac{k}{m} \\rfloor$ form long runs: the value stays the same for $m$ consecutive $k$ before going up by one. So a sum of floors is best done by grouping equal values, not term by term. Be careful at the two ends, where a run may be shorter than $m$. For $\\sum_{k=1}^{7} \\lfloor \\frac{k}{3} \\rfloor$: the values are $0, 0, 1, 1, 1, 2, 2$, so the sum is $3 \\cdot 1 + 2 \\cdot 2 = 7$.\n\n> **Watch out.** The last run is cut short: the top value $q = \\lfloor \\frac{N}{m} \\rfloor$ appears only for $k = qm, \\dots, N$, that is $N - qm + 1$ times, not $m$ times.",
    "$\\lfloor \\frac{k}{m} \\rfloor$ 的值成段出现：连续 $m$ 个 $k$ 的值相同，然后增加一。所以取整值的和最好把相同的值分为一组来算，而不是逐项相加。要注意两端，那里的一段可能不足 $m$ 项。对 $\\sum_{k=1}^{7} \\lfloor \\frac{k}{3} \\rfloor$：各值为 $0, 0, 1, 1, 1, 2, 2$，所以和为 $3 \\cdot 1 + 2 \\cdot 2 = 7$。\n\n> **注意。** 最后一段被截短：最大值 $q = \\lfloor \\frac{N}{m} \\rfloor$ 只在 $k = qm, \\dots, N$ 时出现，即 $N - qm + 1$ 次，而不是 $m$ 次。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const N = rng.int(10, 60);
    const q = Math.floor(N / m);
    const r = N % m;
    const full = (m * q * (q - 1)) / 2;
    const answer = full + q * (r + 1);
    const span = (a: number, b: number) => (a === b ? `k = ${a}` : `k = ${a}, \\dots, ${b}`);
    const zeros = span(1, m - 1);
    const last = span(q * m, N);
    const upTo = q <= 4 ? [...Array(q - 1).keys()].map((i) => i + 1).join(", ") : `1, \\dots, ${q - 1}`;
    const middle =
      q === 1
        ? { en: "and ", zh: "" }
        : q === 2
          ? { en: `the value $1$ fills a run of $${m}$ terms, and `, zh: `值 $1$ 占连续 $${m}$ 项，` }
          : { en: `each value $${upTo}$ fills a run of $${m}$ terms, and `, zh: `值 $${upTo}$ 各占连续 $${m}$ 项，` };
    const fullStep: [[string, string], ReturnType<typeof t>][] =
      q === 1
        ? []
        : [
            [
              ["Add the full runs", "加上完整的段"],
              t(
                `$${m}(${upTo.replaceAll(",", " +")}) = ${m} \\cdot \\frac{${q} \\cdot ${q - 1}}{2} = ${full}$.`,
                `$${m}(${upTo.replaceAll(",", " +")}) = ${m} \\cdot \\frac{${q} \\cdot ${q - 1}}{2} = ${full}$。`,
              ),
            ],
          ];
    return numberProblem({
      prompt: t(
        `Find $\\sum_{k=1}^{${N}} \\left\\lfloor \\frac{k}{${m}} \\right\\rfloor$.`,
        `求 $\\sum_{k=1}^{${N}} \\left\\lfloor \\frac{k}{${m}} \\right\\rfloor$。`,
      ),
      answer,
      form: "integer",
      wrong: [answer + q],
      mistakes: firstOf([
        why(
          Math.floor((N * (N + 1)) / (2 * m)),
          "That divides the whole sum by the divisor, but each term is rounded down on its own.",
          "这是把整个和除以除数，但每一项都是单独向下取整的。",
        ),
        why(full, `That leaves out the last run, where the value $${q}$ appears.`, `这漏掉了最后一段，即值 $${q}$ 出现的那些项。`),
        why(
          (m * q * (q + 1)) / 2,
          `That counts the value $${q}$ a full $${m}$ times, but the sum stops at $k = ${N}$.`,
          `这把值 $${q}$ 算了整整 $${m}$ 次，但求和止于 $k = ${N}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the runs", "找出各段"],
            t(
              `The value $0$ fills $${zeros}$, ${middle.en}the value $${q}$ fills $${last}$: ${count(r + 1, "term", "terms")}.`,
              `值 $0$ 占 $${zeros}$，${middle.zh}值 $${q}$ 占 $${last}$：共 $${r + 1}$ 项。`,
            ),
          ],
          ...fullStep,
          [
            ["Add the last run", "加上最后一段"],
            t(
              `$${q} \\cdot ${r + 1} = ${q * (r + 1)}$, so the sum is $${full} + ${q * (r + 1)} = ${answer}$.`,
              `$${q} \\cdot ${r + 1} = ${q * (r + 1)}$，所以和为 $${full} + ${q * (r + 1)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The runs hold $${m - 1} + ${m} \\cdot ${q - 1} + ${r + 1} = ${N}$ terms, one for each $k$ from $1$ to $${N}$.`,
          `各段共有 $${m - 1} + ${m} \\cdot ${q - 1} + ${r + 1} = ${N}$ 项，正好对应 $k = 1$ 到 $${N}$。`,
        ),
      ),
    });
  },
};

const decodingAFiniteSet: KnowledgePointDef = {
  id: "decoding-a-finite-set-from-its-number",
  title: t("Decoding a finite set from its number", "由编号还原有限集"),
  explanation: t(
    "Sending a finite set $S$ of natural numbers to $\\sum_{s \\in S} 2^s$ is a bijection onto the natural numbers, because binary digits are unique. This is one way to see that the finite subsets of the naturals are countable. To decode a number, write it in binary: the positions of the ones, counted from zero, are the elements. For $13 = 1101_2 = 2^{3} + 2^{2} + 2^{0}$, the set is $\\{0, 2, 3\\}$.\n\n> **Watch out.** Places are counted from $0$ at the right: the units digit stands for the element $0$. Counting from $1$ shifts every element up by one.",
    "把有限自然数集 $S$ 映到 $\\sum_{s \\in S} 2^s$，是到自然数的双射，因为二进制表示是唯一的。这是说明自然数的有限子集可数的一种方式。要还原一个数，把它写成二进制：一所在的位置（从零数起）就是集合的元素。对 $13 = 1101_2 = 2^{3} + 2^{2} + 2^{0}$，集合是 $\\{0, 2, 3\\}$。\n\n> **注意。** 位置从右边的 $0$ 开始数：个位代表元素 $0$。从 $1$ 开始数会使每个元素都大一。",
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
    const powers = [...elements]
      .reverse()
      .map((s) => `2^{${s}}`)
      .join(" + ");
    return numberProblem({
      prompt: t(
        `Each finite set $S$ of natural numbers, starting from 0, is numbered by $\\sum_{s \\in S} 2^s$. Find the sum of the elements of the set numbered ${N}.`,
        `从 0 开始的自然数构成的每个有限集 $S$，都用 $\\sum_{s \\in S} 2^s$ 编号。求编号为 ${N} 的集合的元素之和。`,
      ),
      answer,
      form: "integer",
      wrong: [answer - 1],
      mistakes: firstOf([
        why(
          answer + size,
          "That counts the places from $1$; the units place stands for the element $0$.",
          "这是从 $1$ 开始数位置；个位代表元素 $0$。",
        ),
        why(size, "That is the number of elements, not their sum.", "这是元素的个数，而不是它们的和。"),
        why(
          elements[elements.length - 1] ?? 0,
          "That is only the largest element; add all of them.",
          "这只是最大的元素；要把所有元素相加。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Write it in binary", "写成二进制"],
            t(`$${N} = ${N.toString(2)}_2 = ${powers}$.`, `$${N} = ${N.toString(2)}_2 = ${powers}$。`),
          ],
          [
            ["Read off the elements", "读出元素"],
            t(`The exponents are the elements: $S = \\{${elements.join(", ")}\\}$.`, `指数就是元素：$S = \\{${elements.join(", ")}\\}$。`),
          ],
          [["Add them", "相加"], t(`$${elements.join(" + ")} = ${answer}$.`, `$${elements.join(" + ")} = ${answer}$。`)],
        ],
        t(
          `$${elements.map((s) => 2 ** s).join(" + ")} = ${N}$, so this set has the given number.`,
          `$${elements.map((s) => 2 ** s).join(" + ")} = ${N}$，所以这个集合的编号正是所给的数。`,
        ),
      ),
    });
  },
};

const nonCoprimeRemainders: KnowledgePointDef = {
  id: "two-congruences-with-moduli-that-share-a-factor",
  title: t("Two congruences with moduli that share a factor", "模数有公因数的两个同余式"),
  explanation: t(
    "When the moduli share a factor, the Chinese remainder theorem does not apply directly. Two congruences can then conflict, and they are consistent only if the remainders agree modulo the gcd of the moduli. When they are consistent, the solutions repeat with period equal to the lcm of the moduli, not with period equal to their product.\n\n> **Watch out.** The period is $\\operatorname{lcm}(m, n)$, which is smaller than $mn$ here, so the smallest positive solution lies below the lcm. The lcm itself is a period, not a solution.",
    "模数有公因数时，不能直接用中国剩余定理。这时两个同余式可能冲突，只有余数模两个模数的最大公因数相同时才相容。相容时，解的周期是两个模数的最小公倍数，而不是它们的乘积。\n\n> **注意。** 周期是 $\\operatorname{lcm}(m, n)$，这里它小于 $mn$，所以最小正解在最小公倍数以下。最小公倍数本身是周期，不是解。",
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
    const run: number[] = [];
    for (let y = a === 0 ? m : a; y <= x; y += m) run.push(y);
    const off = (y: number): [string, string] => [
      `$${y}$ leaves remainder $${y % m}$ on division by $${m}$ and $${y % n}$ on division by $${n}$.`,
      `$${y}$ 除以 $${m}$ 余 $${y % m}$，除以 $${n}$ 余 $${y % n}$。`,
    ];
    return numberProblem({
      prompt: t(
        `Find the smallest positive integer $x$ with $x \\equiv ${a} \\pmod{${m}}$ and $x \\equiv ${b} \\pmod{${n}}$.`,
        `求满足 $x \\equiv ${a} \\pmod{${m}}$ 和 $x \\equiv ${b} \\pmod{${n}}$ 的最小正整数 $x$。`,
      ),
      answer: x,
      form: "integer",
      wrong: [x + lcm, lcm, a + b],
      mistakes: firstOf([
        why(
          x + lcm,
          `That satisfies both, but it is not the smallest: subtract the period $${lcm}$.`,
          `它同时满足两个同余式，但不是最小的：减去周期 $${lcm}$。`,
        ),
        why(
          lcm,
          `$${lcm}$ is the period of the solutions, not a solution: it leaves remainder $0$ on both divisions.`,
          `$${lcm}$ 是解的周期，不是解：两次除法的余数都是 $0$。`,
        ),
        why(a + b, ...off(a + b)),
      ]),
      solution: walked(
        [
          [
            ["Check that the congruences agree", "检查同余式是否相容"],
            t(
              `$\\gcd(${m}, ${n}) = ${g}$, and both remainders leave $${a % g}$ on division by $${g}$, so solutions exist and repeat every $\\operatorname{lcm}(${m}, ${n}) = ${lcm}$.`,
              `$\\gcd(${m}, ${n}) = ${g}$，两个余数除以 $${g}$ 都余 $${a % g}$，所以有解，且每隔 $\\operatorname{lcm}(${m}, ${n}) = ${lcm}$ 重复。`,
            ),
          ],
          [
            ["Search one congruence", "沿一个同余式查找"],
            run.length === 1
              ? t(
                  `The first positive number that leaves $${a}$ on division by $${m}$ is $${x}$, and it already leaves $${b}$ on division by $${n}$.`,
                  `除以 $${m}$ 余 $${a}$ 的第一个正整数是 $${x}$，它除以 $${n}$ 恰好余 $${b}$。`,
                )
              : t(
                  `The positive numbers that leave $${a}$ on division by $${m}$ begin $${run.join(", ")}$, and the first of them that leaves $${b}$ on division by $${n}$ is $${x}$.`,
                  `除以 $${m}$ 余 $${a}$ 的正整数依次是 $${run.join(", ")}$，其中第一个除以 $${n}$ 余 $${b}$ 的是 $${x}$。`,
                ),
          ],
        ],
        t(
          `$${x} = ${m} \\cdot ${Math.floor(x / m)} + ${a}$ and $${x} = ${n} \\cdot ${Math.floor(x / n)} + ${b}$, with $${x} < ${lcm}$.`,
          `$${x} = ${m} \\cdot ${Math.floor(x / m)} + ${a}$，$${x} = ${n} \\cdot ${Math.floor(x / n)} + ${b}$，且 $${x} < ${lcm}$。`,
        ),
      ),
    });
  },
};

const countingZeroDivisors: KnowledgePointDef = {
  id: "counting-the-zero-divisors-modulo-n",
  title: t("Counting the zero divisors modulo $n$", "数模 $n$ 的零因子"),
  explanation: t(
    "In the integers modulo $n$, a nonzero class is either a unit or a zero divisor, and it cannot be both. A class is a unit exactly when it is coprime to $n$. So there are $\\varphi(n)$ units, and the other nonzero classes are all zero divisors, which gives $n - \\varphi(n) - 1$ of them. In $\\mathbb{Z}_{10}$: $\\varphi(10) = 4$, so there are $10 - 4 - 1 = 5$ zero divisors, namely $[2], [4], [5], [6], [8]$.\n\n> **Watch out.** Subtract $1$ for the class $[0]$, which is neither a unit nor counted as a zero divisor here. $n - \\varphi(n)$ counts $[0]$ as well.",
    "在模 $n$ 的整数中，非零的类要么是单位，要么是零因子，不可能二者都是。一个类是单位，当且仅当它与 $n$ 互素。所以有 $\\varphi(n)$ 个单位，其余非零的类都是零因子，共 $n - \\varphi(n) - 1$ 个。在 $\\mathbb{Z}_{10}$ 中：$\\varphi(10) = 4$，所以零因子有 $10 - 4 - 1 = 5$ 个，即 $[2], [4], [5], [6], [8]$。\n\n> **注意。** 要为类 $[0]$ 减去 $1$：它既不是单位，这里也不算作零因子。$n - \\varphi(n)$ 把 $[0]$ 也算进去了。",
  ),
  generate(rng) {
    const n = rng.pick([...Array(55).keys()].map((i) => i + 6).filter((i) => totient(i) !== i - 1));
    const phi = totient(n);
    const answer = n - phi - 1;
    const p = divisorsOf(n)[1]!;
    return numberProblem({
      prompt: t(`How many nonzero classes of $\\mathbb{Z}_{${n}}$ are zero divisors?`, `$\\mathbb{Z}_{${n}}$ 中有多少个非零的类是零因子？`),
      answer,
      form: "integer",
      wrong: [divisorsOf(n).length - 2],
      mistakes: firstOf([
        why(phi, "That counts the units, the classes coprime to the modulus.", "这数的是单位，即与模互素的类。"),
        why(n - phi, "That counts $[0]$ as well; only nonzero classes are asked about.", "这把 $[0]$ 也算进去了；题目只问非零的类。"),
      ]),
      solution: walked(
        [
          [
            ["Count the units", "数单位"],
            t(
              `The units are the classes coprime to $${n}$: $\\varphi(${n}) = ${phi}$.`,
              `单位是与 $${n}$ 互素的类：$\\varphi(${n}) = ${phi}$。`,
            ),
          ],
          [
            ["Take the rest", "取其余的类"],
            t(
              `Every other nonzero class is a zero divisor: $${n} - ${phi} - 1 = ${answer}$.`,
              `其余非零的类都是零因子：$${n} - ${phi} - 1 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `For example, $\\gcd(${p}, ${n}) = ${p}$, and $[${p}] \\cdot [${n / p}] = [${n}] = [0]$, so $[${p}]$ is one of the zero divisors.`,
          `例如 $\\gcd(${p}, ${n}) = ${p}$，且 $[${p}] \\cdot [${n / p}] = [${n}] = [0]$，所以 $[${p}]$ 是零因子之一。`,
        ),
      ),
    });
  },
};

const countingPropertyRelations: KnowledgePointDef = {
  id: "counting-relations-with-a-given-property",
  title: t("Counting relations with a given property", "数具有给定性质的关系"),
  explanation: t(
    "A relation on a set of $n$ elements is a subset of the $n^2$ ordered pairs. A property fixes some pairs and links others, and the free decisions that remain give a power of two. Reflexivity fixes the $n$ diagonal pairs, while symmetry makes each off-diagonal pair and its mirror image into a single decision. On a set of $3$ elements there are $2^{9 - 3} = 2^6$ reflexive relations.\n\n> **Watch out.** For symmetry, $(a, b)$ and $(b, a)$ are one decision, not two, but each diagonal pair $(a, a)$ is still a decision of its own.",
    "$n$ 元集合上的关系是 $n^2$ 个有序对的子集。性质固定了一些有序对，又把另一些绑定在一起，剩下的自由选择给出二的幂。自反性固定了对角线上的 $n$ 个有序对，对称性则使每个非对角有序对和它的镜像成为同一个选择。$3$ 元集合上的自反关系有 $2^{9 - 3} = 2^6$ 个。\n\n> **注意。** 对于对称性，$(a, b)$ 与 $(b, a)$ 是一个选择而不是两个，但每个对角有序对 $(a, a)$ 仍各自是一个选择。",
  ),
  generate(rng) {
    const n = rng.int(2, 9);
    const offDiagonal = n * n - n;
    const kinds = [
      {
        en: "reflexive",
        zh: "自反",
        k: offDiagonal,
        stepEn: `The $${n}$ diagonal pairs must all be in, so only the $${n * n} - ${n} = ${offDiagonal}$ other pairs are free.`,
        stepZh: `对角线上的 $${n}$ 个有序对必须都在其中，所以只有其余 $${n * n} - ${n} = ${offDiagonal}$ 个有序对可以自由选择。`,
      },
      {
        en: "irreflexive",
        zh: "反自反",
        k: offDiagonal,
        stepEn: `The $${n}$ diagonal pairs must all be out, so only the $${n * n} - ${n} = ${offDiagonal}$ other pairs are free.`,
        stepZh: `对角线上的 $${n}$ 个有序对必须都不在其中，所以只有其余 $${n * n} - ${n} = ${offDiagonal}$ 个有序对可以自由选择。`,
      },
      {
        en: "symmetric",
        zh: "对称",
        k: (n * (n + 1)) / 2,
        stepEn: `Each of the $${n}$ diagonal pairs is one decision, and each of the $${offDiagonal / 2}$ mirror couples is one decision: $${n} + ${offDiagonal / 2} = ${(n * (n + 1)) / 2}$.`,
        stepZh: `对角线上的 $${n}$ 个有序对各是一个选择，$${offDiagonal / 2}$ 组镜像也各是一个选择：$${n} + ${offDiagonal / 2} = ${(n * (n + 1)) / 2}$。`,
      },
      {
        en: "both reflexive and symmetric",
        zh: "既自反又对称",
        k: offDiagonal / 2,
        stepEn: `The diagonal is fixed, and each of the $${offDiagonal / 2}$ mirror couples is one decision.`,
        stepZh: `对角线已固定，$${offDiagonal / 2}$ 组镜像各是一个选择。`,
      },
    ];
    const kind = rng.pick(kinds);
    const mistakes = firstOf([
      why(n * n, "That leaves every pair free, as if there were no condition.", "这让每个有序对都自由选择，好像没有任何条件。"),
      ...(kind.k === offDiagonal
        ? [
            why(
              (n * (n + 1)) / 2,
              "That counts the pairs on or above the diagonal, which is the count for symmetric relations.",
              "这数的是对角线上及其上方的有序对，那是对称关系的计数。",
            ),
          ]
        : [
            why(
              offDiagonal,
              kind.en === "symmetric"
                ? "That leaves out the diagonal and counts each mirror couple twice."
                : "That counts each mirror couple twice; $(a, b)$ and $(b, a)$ are one decision.",
              kind.en === "symmetric"
                ? "这漏掉了对角线，又把每组镜像算了两次。"
                : "这把每组镜像算了两次；$(a, b)$ 与 $(b, a)$ 是一个选择。",
            ),
          ]),
      why(n, "That counts only the diagonal pairs.", "这只数了对角线上的有序对。"),
    ]);
    return numberProblem({
      prompt: t(
        `The number of ${kind.en} relations on a set of ${n} elements is $2^k$. Find $k$.`,
        `${n} 元集合上${kind.zh}的关系有 $2^k$ 个。求 $k$。`,
      ),
      answer: kind.k,
      solveFor: "k",
      mistakes,
      solution: walked(
        [
          [
            ["Count the pairs", "数有序对"],
            t(
              `A set of $${n}$ elements has $${n}^2 = ${n * n}$ ordered pairs, $${n}$ of them on the diagonal.`,
              `$${n}$ 元集合有 $${n}^2 = ${n * n}$ 个有序对，其中 $${n}$ 个在对角线上。`,
            ),
          ],
          [["Count the free decisions", "数自由的选择"], t(kind.stepEn, kind.stepZh)],
        ],
        t(
          `Each free decision is in or out, which makes $2^{${kind.k}}$ relations, so $k = ${kind.k}$.`,
          `每个自由的选择是放入或不放入，共 $2^{${kind.k}}$ 个关系，所以 $k = ${kind.k}$。`,
        ),
      ),
    });
  },
};

const relationsOfASize: KnowledgePointDef = {
  id: "relations-with-a-given-number-of-pairs",
  title: t("Relations with a given number of pairs", "含给定个数有序对的关系"),
  explanation: t(
    "A relation from one set to another is any subset of their Cartesian product. So once the number of pairs is fixed, choosing a relation is choosing that many pairs from the product. The count is a binomial coefficient on the size of the product, not on the sizes of the two sets themselves. From a set of $2$ elements to a set of $3$, the product has $6$ pairs, so $\\binom{6}{2} = 15$ relations have exactly $2$ pairs.\n\n> **Watch out.** The pairs of a relation are chosen without order and without repetition, so the count is $\\binom{mn}{k}$, not $(mn)^k$.",
    "从一个集合到另一个集合的关系，就是它们笛卡儿积的任意子集。所以有序对的个数确定后，选关系就是从笛卡儿积中选出这么多个有序对。个数是以笛卡儿积的大小为上标的二项式系数，而不是以两个集合本身的大小为上标。从 $2$ 元集合到 $3$ 元集合，笛卡儿积有 $6$ 个有序对，所以恰含 $2$ 个有序对的关系有 $\\binom{6}{2} = 15$ 个。\n\n> **注意。** 关系中的有序对是不计顺序、不重复地选出的，所以个数是 $\\binom{mn}{k}$，而不是 $(mn)^k$。",
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
      mistakes: firstOf([
        why(2 ** size, "That counts all relations, of every size.", "这数的是所有大小的关系。"),
        why(
          size ** k,
          "That picks the pairs in order and allows repeats; a relation is a set of pairs.",
          "这是按顺序且可重复地选有序对；关系是有序对的集合。",
        ),
        why(
          binom(m + n, k),
          "That chooses from the elements of the two sets, not from the pairs of their product.",
          "这是从两个集合的元素中选，而不是从笛卡儿积的有序对中选。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the product", "数笛卡儿积"],
            t(`The Cartesian product has $${m} \\cdot ${n} = ${size}$ pairs.`, `笛卡儿积有 $${m} \\cdot ${n} = ${size}$ 个有序对。`),
          ],
          [
            ["Choose the pairs", "选出有序对"],
            t(
              `A relation with $${k}$ pairs picks $${k}$ of them: $\\binom{${size}}{${k}} = ${answer}$.`,
              `含 $${k}$ 个有序对的关系从中选出 $${k}$ 个：$\\binom{${size}}{${k}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\binom{${size}}{${k}} = \\dfrac{${[...Array(k).keys()].map((i) => size - i).join(" \\cdot ")}}{${k}!} = ${answer}$.`,
          `$\\binom{${size}}{${k}} = \\dfrac{${[...Array(k).keys()].map((i) => size - i).join(" \\cdot ")}}{${k}!} = ${answer}$。`,
        ),
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
      : `(${letter}_1 ${op} \\dots ${op} ${letter}_{${k}})`;
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
  figure: linearAlgebraDrawings1["visualizing-cartesian-products#the-overlap-of-two-products-of-intervals"],
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
  figure: proofDrawings1["truth-tables#rows-with-a-given-number-of-true-variables"],
  title: t("Rows with a given number of true variables", "恰有给定个数变量为真的行"),
  explanation: t(
    "A row of a truth table is one choice of true or false for every variable, so it is the same thing as the subset of variables that are true. Rows with a fixed number of true variables therefore match subsets of a fixed size. In $4$ variables, the rows with exactly $2$ true are the pairs $\\{p, q\\}$, $\\{p, r\\}$, $\\{p, s\\}$, $\\{q, r\\}$, $\\{q, s\\}$, $\\{r, s\\}$: $\\binom{4}{2} = 6$ rows. This is also why the entries of a row of Pascal's triangle add up to the total number of rows: $1 + 4 + 6 + 4 + 1 = 16$.\n\n> **Watch out.** Exactly $k$ true means the others are all false. Fixing $k$ variables as true and letting the rest vary counts rows with at least $k$ true, several times over.",
    "真值表的一行就是给每个变量选定真或假，所以它和取真的变量组成的子集是一回事。因此取真变量个数固定的行，对应大小固定的子集。在 $4$ 个变量中，恰有 $2$ 个为真的行就是 $\\{p, q\\}$、$\\{p, r\\}$、$\\{p, s\\}$、$\\{q, r\\}$、$\\{q, s\\}$、$\\{r, s\\}$ 这些对：$\\binom{4}{2} = 6$ 行。这也是帕斯卡三角形一行中各数之和等于总行数的原因：$1 + 4 + 6 + 4 + 1 = 16$。\n\n> **注意。** 恰有 $k$ 个为真，意味着其余变量都为假。固定 $k$ 个变量为真、让其余变量任意取值，数的是至少 $k$ 个为真的行，而且有重复。",
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
      mistakes: [
        why(2 ** n, "That counts every row, whatever the number of true variables.", "这是全部行数，不论有几个变量为真。"),
        why(
          2 ** (n - k),
          "That fixes some variables as true but lets the others vary; they must all be false.",
          "这固定了一些变量为真，却让其余变量任意取值；它们必须都为假。",
        ),
        why(binom(n, k - 1), `That is the count for ${k - 1} true variables.`, `这是恰有 ${k - 1} 个变量为真的行数。`),
      ],
      solution: walked(
        [
          [
            ["Match rows to subsets", "把行对应到子集"],
            t(
              `A row with exactly ${count(k, "true variable", "true variables")} is fixed by choosing which ${k === 1 ? "variable is" : "variables are"} true; the others are then false.`,
              `恰有 ${k} 个变量为真的一行，由选定哪 ${k} 个变量为真而确定；其余变量都为假。`,
            ),
          ],
          [
            ["Count the choices", "数出选法"],
            t(
              `Choose ${k} of the ${n} variables: $\\binom{${n}}{${k}} = ${answer}$ rows.`,
              `从 ${n} 个变量中选 ${k} 个：$\\binom{${n}}{${k}} = ${answer}$ 行。`,
            ),
          ],
        ],
        t(
          `Choosing instead the ${n - k} variables that are false fixes the same rows: $\\binom{${n}}{${n - k}} = ${binom(n, n - k)}$, the same number.`,
          `改为选定为假的 ${n - k} 个变量，确定的是同样的行：$\\binom{${n}}{${n - k}} = ${binom(n, n - k)}$，个数相同。`,
        ),
      ),
    });
  },
};

const formulasUpToEquivalence: KnowledgePointDef = {
  id: "counting-formulas-up-to-equivalence",
  title: t("Counting formulas up to equivalence", "在等价意义下数公式"),
  explanation: t(
    "Infinitely many formulas can be written in a few variables, but two of them are logically equivalent exactly when their truth-table columns match. So counting formulas up to equivalence means counting columns. A column is decided by the set of rows in which it is true, and any set of rows is possible, so columns correspond to subsets of the rows. In $2$ variables the table has $4$ rows, and the formulas true in exactly one row are $\\binom{4}{1} = 4$: $p \\land q$, $p \\land \\neg q$, $\\neg p \\land q$ and $\\neg p \\land \\neg q$.\n\n> **Watch out.** Count columns, not ways of writing: $p$ and $\\neg \\neg p$ are two formulas but one column, so they count once.",
    "几个变量可以写出无穷多个公式，但两个公式逻辑等价，当且仅当它们的真值表列相同。所以在等价意义下数公式，就是数列。一列由它取真的行组成的集合决定，而任何一组行都是可能的，所以列和行的子集一一对应。$2$ 个变量的真值表有 $4$ 行，恰好一行为真的公式有 $\\binom{4}{1} = 4$ 个：$p \\land q$、$p \\land \\neg q$、$\\neg p \\land q$ 和 $\\neg p \\land \\neg q$。\n\n> **注意。** 数的是列，不是写法：$p$ 与 $\\neg \\neg p$ 是两个公式，却是同一列，只算一次。",
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
      mistakes: [
        why(2 ** rows, "That counts every column, whatever its number of true rows.", "这是全部的列数，不论有几行为真。"),
        required
          ? why(binom(rows, k), "That ignores the row that must be among the true ones.", "这忽略了必须为真的那一行。")
          : why(binom(rows, k - 1), "That chooses one row too few.", "这少选了一行。"),
      ],
      solution: walked(
        [
          [
            ["Count the rows", "数出行数"],
            t(`${n} variables give $2^{${n}} = ${rows}$ rows.`, `${n} 个变量共有 $2^{${n}} = ${rows}$ 行。`),
          ],
          [
            ["Choose the true rows", "选出为真的行"],
            required
              ? t(
                  `A class of equivalent formulas is fixed by its set of true rows. One of the ${k} is already chosen, so choose the other ${count(k - 1, "row", "rows")} from the remaining ${rows - 1}: $\\binom{${rows - 1}}{${k - 1}} = ${answer}$.`,
                  `一类等价的公式由它为真的行组成的集合决定。${k} 行中已选定一行，再从其余 ${rows - 1} 行中选另外 ${k - 1} 行：$\\binom{${rows - 1}}{${k - 1}} = ${answer}$。`,
                )
              : t(
                  `A class of equivalent formulas is fixed by its set of true rows, so choose ${count(k, "row", "rows")} of the ${rows}: $\\binom{${rows}}{${k}} = ${answer}$.`,
                  `一类等价的公式由它为真的行组成的集合决定，所以从 ${rows} 行中选 ${k} 行：$\\binom{${rows}}{${k}} = ${answer}$。`,
                ),
          ],
        ],
        required
          ? t(
              `Of all $\\binom{${rows}}{${k}} = ${binom(rows, k)}$ columns with ${k} true rows, the fraction that includes a given row is $\\frac{${k}}{${rows}}$, and $${binom(rows, k)} \\cdot \\frac{${k}}{${rows}} = ${answer}$.`,
              `在全部 $\\binom{${rows}}{${k}} = ${binom(rows, k)}$ 个有 ${k} 行为真的列中，包含某一给定行的占 $\\frac{${k}}{${rows}}$，而 $${binom(rows, k)} \\cdot \\frac{${k}}{${rows}} = ${answer}$。`,
            )
          : t(
              `Negating a formula turns its ${k} true rows into ${rows - k} true rows, one for one, so the count for ${rows - k} true rows must be the same: $\\binom{${rows}}{${rows - k}} = ${binom(rows, rows - k)}$.`,
              `对公式取否定，会把 ${k} 个真行一一变成 ${rows - k} 个真行，所以恰有 ${rows - k} 行为真的个数必然相同：$\\binom{${rows}}{${rows - k}} = ${binom(rows, rows - k)}$。`,
            ),
      ),
    });
  },
};

const termsAfterDistributing: KnowledgePointDef = {
  id: "counting-the-terms-after-distributing",
  title: t("Counting the terms after distributing", "数分配后的项数"),
  explanation: t(
    "Distributing one connective over the other works like multiplying out brackets. Each term of the result takes one variable from every bracket, so by the multiplication principle the number of terms is the product of the bracket sizes. For $(a_1 \\lor a_2) \\land (b_1 \\lor b_2 \\lor b_3)$ the terms are $a_i \\land b_j$ for each of $2$ choices of $i$ and $3$ of $j$: $2 \\cdot 3 = 6$ terms. This is why repeated distribution can make a formula far longer, even though the new formula is logically equivalent to the old one.\n\n> **Watch out.** The sizes multiply; they do not add. Two brackets of $3$ give $9$ terms, not $6$.",
    "用一个联结词对另一个联结词作分配，就像把括号乘开。结果中的每一项都从每个括号中各取一个变量，所以由乘法原理，项数是各括号大小的乘积。对 $(a_1 \\lor a_2) \\land (b_1 \\lor b_2 \\lor b_3)$，各项是 $a_i \\land b_j$，$i$ 有 $2$ 种取法，$j$ 有 $3$ 种：共 $2 \\cdot 3 = 6$ 项。这就是反复分配会使公式变长很多的原因，尽管新公式和原公式逻辑等价。\n\n> **注意。** 各括号的大小要相乘，而不是相加。两个各有 $3$ 项的括号得 $9$ 项，不是 $6$ 项。",
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
    const sum = sizes.reduce((s, v) => s + v, 0);
    return numberProblem({
      prompt: t(
        `All the variables in $${brackets.join(` ${outer} `)}$ are different. The formula is distributed fully into a ${resultEn}. How many ${termEn} does the result have?`,
        `$${brackets.join(` ${outer} `)}$ 中的变量各不相同。把公式完全分配成${resultZh}。结果中有多少个${termZh}？`,
      ),
      answer,
      form: "integer",
      wrong: [sum, m ** n, three ? m * n : m * n * 2, answer + m],
      mistakes: [
        why(
          sum,
          "That adds the sizes of the brackets; each term takes one variable from every bracket, so they multiply.",
          "这是把各括号的大小相加；每一项从每个括号各取一个变量，所以要相乘。",
        ),
        why(
          m ** n,
          "That raises one size to the power of the other; the sizes multiply.",
          "这是把一个大小作为另一个的指数；各括号大小应相乘。",
        ),
        ...(three ? [why(m * n, "That leaves out the third bracket.", "这漏掉了第三个括号。")] : []),
      ],
      solution: walked(
        [
          [
            ["See what a term is", "看一项是什么"],
            t(
              `Distributing ${outerAnd ? "$\\land$ over $\\lor$" : "$\\lor$ over $\\land$"} pairs every part of one bracket with every part of the others, so each of the ${termEn} takes one variable from each bracket.`,
              `把${outerAnd ? " $\\land$ 对 $\\lor$ " : " $\\lor$ 对 $\\land$ "}分配，会使一个括号的每一部分与其他括号的每一部分配对，所以每个${termZh}都从每个括号各取一个变量。`,
            ),
          ],
          [
            ["Multiply the choices", "把选法相乘"],
            t(
              `The brackets have ${sizes.join(", ")} variables, so by the multiplication principle there are $${sizes.join(" \\cdot ")} = ${answer}$ ${termEn}.`,
              `各括号分别有 ${sizes.join("、")} 个变量，所以由乘法原理，共有 $${sizes.join(" \\cdot ")} = ${answer}$ 个${termZh}。`,
            ),
          ],
        ],
        t(
          `Fix the variable taken from the first bracket: each of its $${m}$ choices goes with $${sizes.slice(1).join(" \\cdot ")} = ${answer / m}$ ways to finish the term, and $${m} \\cdot ${answer / m} = ${answer}$.`,
          `固定从第一个括号取的变量：它的 $${m}$ 种取法，每种都有 $${sizes.slice(1).join(" \\cdot ")} = ${answer / m}$ 种方式补全这一项，$${m} \\cdot ${answer / m} = ${answer}$。`,
        ),
      ),
    });
  },
};

const rowsThroughDeMorgan: KnowledgePointDef = {
  id: "counting-rows-through-de-morgan",
  title: t("Counting rows through De Morgan's laws", "用德摩根律数行"),
  explanation: t(
    "A negated conjunction becomes a disjunction of negations, and a disjunction is hard to count directly because it is true in so many ways. It is false in only one way, though: every negated variable is false, that is, every original variable true. So count that case and subtract it from all the rows. A negated disjunction is easier still, because it becomes a conjunction that fixes its variables. In $5$ variables, $\\neg(p_1 \\land p_2)$ fails only when $p_1$ and $p_2$ are true, in $2^{3} = 8$ rows, so it is true in $32 - 8 = 24$.\n\n> **Watch out.** For a negated conjunction, the rows you count first are the false ones. Subtract them from the total before answering.",
    "合取的否定变成否定的析取，而析取有太多方式为真，很难直接数。但它只有一种方式为假：每个带否定的变量都为假，也就是每个原变量都为真。所以数出这种情形，再从总行数中减去。析取的否定更简单，因为它变成一个合取，直接固定了其中的变量。在 $5$ 个变量中，$\\neg(p_1 \\land p_2)$ 只在 $p_1$、$p_2$ 都为真时不成立，共 $2^{3} = 8$ 行，所以它在 $32 - 8 = 24$ 行为真。\n\n> **注意。** 对合取的否定，先数出的是假行。回答之前要从总数中减去它们。",
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
      mistakes: [
        why(conjunctive ? fixed : 2 ** n - fixed, "That counts the rows where the formula is false.", "这是公式为假的行数。"),
        why(2 ** n, "That counts every row of the table.", "这是全部行数。"),
        why(
          2 ** (n - 1),
          "That treats the formula as halving the rows; it involves all of its variables, not one.",
          "这把公式当作只使行数减半；它涉及其中所有变量，而不是一个。",
        ),
      ],
      solution: walked(
        [
          [
            ["Apply De Morgan's law", "用德摩根律"],
            conjunctive
              ? t(
                  `$\\neg(p_1 \\land \\dots \\land p_{${k}})$ is $\\neg p_1 \\lor \\dots \\lor \\neg p_{${k}}$: at least one $p_i$ is false. It fails only when all ${k} are true.`,
                  `$\\neg(p_1 \\land \\dots \\land p_{${k}})$ 即 $\\neg p_1 \\lor \\dots \\lor \\neg p_{${k}}$：至少有一个 $p_i$ 为假。只有 ${k} 个都为真时它才不成立。`,
                )
              : t(
                  `$\\neg(p_1 \\lor \\dots \\lor p_{${k}})$ is $\\neg p_1 \\land \\dots \\land \\neg p_{${k}}$: every $p_i$ is false.`,
                  `$\\neg(p_1 \\lor \\dots \\lor p_{${k}})$ 即 $\\neg p_1 \\land \\dots \\land \\neg p_{${k}}$：每个 $p_i$ 都为假。`,
                ),
          ],
          [
            ["Count", "计数"],
            conjunctive
              ? t(
                  `The failing case fixes ${k} variables and leaves ${n - k} free: $2^{${n - k}} = ${fixed}$ rows. So the formula is true in $2^{${n}} - ${fixed} = ${2 ** n} - ${fixed} = ${answer}$ rows.`,
                  `不成立的情形固定 ${k} 个变量，剩 ${n - k} 个自由：$2^{${n - k}} = ${fixed}$ 行。所以公式在 $2^{${n}} - ${fixed} = ${2 ** n} - ${fixed} = ${answer}$ 行为真。`,
                )
              : t(
                  `That fixes ${k} variables and leaves ${n - k} free: $2^{${n - k}} = ${answer}$ rows.`,
                  `这固定了 ${k} 个变量，剩 ${n - k} 个自由：$2^{${n - k}} = ${answer}$ 行。`,
                ),
          ],
        ],
        t(
          `The ${k} variables $p_i$ have $2^{${k}} = ${2 ** k}$ value combinations, of which ${conjunctive ? `all but one` : "exactly one"} make the formula true, and each combination fills $2^{${n - k}}$ rows: $${conjunctive ? 2 ** k - 1 : 1} \\cdot ${fixed} = ${answer}$.`,
          `${k} 个变量 $p_i$ 共有 $2^{${k}} = ${2 ** k}$ 种取值组合，其中${conjunctive ? "除一种外都" : "恰有一种"}使公式为真，每种组合占 $2^{${n - k}}$ 行：$${conjunctive ? 2 ** k - 1 : 1} \\cdot ${fixed} = ${answer}$。`,
        ),
      ),
    });
  },
};

const rowsOfACompoundConclusion: KnowledgePointDef = {
  id: "rows-of-a-conditional-with-a-compound-conclusion",
  title: t("Rows of a conditional with a compound conclusion", "结论为复合命题的条件命题的行"),
  explanation: t(
    "Rewriting a conditional as a disjunction, $\\neg p \\lor Q$, splits its true rows into two groups that do not overlap: those where $p$ is false, whatever else happens, and those where $p$ is true and $Q$ holds. Counting each group separately is usually simpler than checking rows, and the size of the conclusion only affects the second group. In $4$ variables, $p \\to (q_1 \\land q_2)$ is true in the $8$ rows with $p$ false, and in the $2$ rows with $p$, $q_1$, $q_2$ all true: $10$ rows.\n\n> **Watch out.** Do not forget the rows where $p$ is false: there the conditional is true whatever the conclusion is.",
    "把条件命题改写成析取 $\\neg p \\lor Q$，就把它的真行分成不重叠的两组：一组是 $p$ 为假的行，不论其他变量如何；另一组是 $p$ 为真且 $Q$ 成立的行。分别数这两组，通常比逐行检查简单，而结论的大小只影响第二组。在 $4$ 个变量中，$p \\to (q_1 \\land q_2)$ 在 $p$ 为假的 $8$ 行为真，在 $p$、$q_1$、$q_2$ 都为真的 $2$ 行也为真：共 $10$ 行。\n\n> **注意。** 不要漏掉 $p$ 为假的行：那里不论结论如何，条件命题都为真。",
  ),
  generate(rng) {
    const k = rng.int(2, 4);
    const n = rng.int(k + 3, 11);
    const conjunctive = rng.pick([true, false]);
    const half = 2 ** (n - 1);
    const fixed = 2 ** (n - 1 - k);
    const second = conjunctive ? fixed : half - fixed;
    const answer = half + second;
    const falseRows = half - second;
    const formula = `p \\to ${joined("q", k, conjunctive ? "\\land" : "\\lor")}`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including those in $${formula}$. In how many rows is this formula true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $${formula}$ 中的变量。这个公式在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [second, half, 2 ** n - answer],
      mistakes: [
        why(
          second,
          "That counts only the rows with $p$ true; with $p$ false the conditional is true as well.",
          "这只数了 $p$ 为真的行；$p$ 为假时条件命题也为真。",
        ),
        why(half, "That counts only the rows with $p$ false.", "这只数了 $p$ 为假的行。"),
        why(2 ** n - answer, "That counts the rows where the formula is false.", "这是公式为假的行数。"),
      ],
      solution: walked(
        [
          [
            ["Rewrite as a disjunction", "改写成析取"],
            t(
              `$${formula}$ is equivalent to $\\neg p \\lor ${joined("q", k, conjunctive ? "\\land" : "\\lor")}$, so it is true when $p$ is false, or when $p$ is true and the conclusion holds.`,
              `$${formula}$ 等价于 $\\neg p \\lor ${joined("q", k, conjunctive ? "\\land" : "\\lor")}$，所以在 $p$ 为假时为真，或在 $p$ 为真且结论成立时为真。`,
            ),
          ],
          [
            ["Count the rows with $p$ false", "数 $p$ 为假的行"],
            t(`Half of the $2^{${n}}$ rows have $p$ false: $${half}$.`, `$2^{${n}}$ 行中有一半 $p$ 为假：$${half}$ 行。`),
          ],
          [
            ["Count the rows with $p$ true", "数 $p$ 为真的行"],
            conjunctive
              ? t(
                  `Then every $q_i$ must be true, which fixes ${k + 1} variables: $2^{${n - 1 - k}} = ${second}$ rows. The total is $${half} + ${second} = ${answer}$.`,
                  `这时每个 $q_i$ 都必须为真，固定了 ${k + 1} 个变量：$2^{${n - 1 - k}} = ${second}$ 行。总数是 $${half} + ${second} = ${answer}$。`,
                )
              : t(
                  `Then some $q_i$ must be true. Of the $${half}$ rows with $p$ true, only the $2^{${n - 1 - k}} = ${fixed}$ with every $q_i$ false fail, leaving $${second}$. The total is $${half} + ${second} = ${answer}$.`,
                  `这时某个 $q_i$ 必须为真。$p$ 为真的 $${half}$ 行中，只有每个 $q_i$ 都为假的 $2^{${n - 1 - k}} = ${fixed}$ 行不成立，剩 $${second}$ 行。总数是 $${half} + ${second} = ${answer}$。`,
                ),
          ],
        ],
        t(
          `Count the false rows instead: $p$ true and the conclusion false, which is $${falseRows}$ rows. Then $${answer} + ${falseRows} = ${2 ** n} = 2^{${n}}$, every row counted once.`,
          `改数假行：$p$ 为真且结论为假，共 $${falseRows}$ 行。$${answer} + ${falseRows} = ${2 ** n} = 2^{${n}}$，每一行恰好数了一次。`,
        ),
      ),
    });
  },
};

const relatedConditionalRows: KnowledgePointDef = {
  id: "rows-where-a-conditional-and-a-related-statement-compare",
  title: t("Comparing a conditional with a related statement row by row", "逐行比较条件命题和相关命题"),
  explanation: t(
    'Over the four value pairs TT, TF, FT, FF of $p$ and $q$, the conditional $p \\to q$ takes the values T, F, T, T. Its contrapositive $\\neg q \\to \\neg p$ is equivalent to it and takes the same values. The converse $q \\to p$ and the inverse $\\neg p \\to \\neg q$ are equivalent to each other and take T, T, F, T: they agree with the conditional only in TT and FF, where $p$ and $q$ have the same value. Every other variable of a larger table just repeats each value pair, $2^{n-2}$ times in $n$ variables.\n\n> **Watch out.** "Both true" and "different" are different questions. Count the value pairs for the one asked, then multiply by the rows each pair fills.',
    "在 $p$、$q$ 的四种取值 TT、TF、FT、FF 下，条件命题 $p \\to q$ 依次为 T、F、T、T。它的逆否命题 $\\neg q \\to \\neg p$ 与它等价，取值相同。逆命题 $q \\to p$ 与否命题 $\\neg p \\to \\neg q$ 彼此等价，依次为 T、T、F、T：它们只在 TT 和 FF，即 $p$ 与 $q$ 取值相同时，与条件命题一致。更大的真值表中，其余每个变量只是把每种取值重复，$n$ 个变量时每种重复 $2^{n-2}$ 次。\n\n> **注意。** “同时为真”和“取值不同”是不同的问题。先数出所问情形的取值组合，再乘以每种组合所占的行数。",
  ),
  generate(rng) {
    const n = rng.int(3, 10);
    const kind = rng.pick([
      { en: "converse", zh: "逆命题", latex: "q \\to p", both: 2, differ: 2, column: "T, T, F, T" },
      { en: "inverse", zh: "否命题", latex: "\\neg p \\to \\neg q", both: 2, differ: 2, column: "T, T, F, T" },
      { en: "contrapositive", zh: "逆否命题", latex: "\\neg q \\to \\neg p", both: 3, differ: 0, column: "T, F, T, T" },
    ]);
    const differ = rng.pick([true, false]);
    const each = 2 ** (n - 2);
    const pairs = differ ? kind.differ : kind.both;
    const answer = pairs * each;
    const whereEn = differ ? (pairs === 0 ? "none of them" : "TF and FT") : pairs === 2 ? "TT and FF" : "TT, FT and FF";
    const whereZh = differ ? (pairs === 0 ? "一种也没有" : "TF 和 FT") : pairs === 2 ? "TT 和 FF" : "TT、FT 和 FF";
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
      mistakes: [
        why(2 ** n, "That counts every row of the table.", "这是全部行数。"),
        why(3 * each, "That counts the rows where $p \\to q$ alone is true.", "这只数了 $p \\to q$ 为真的行。"),
        why(each, "That counts the rows of a single value pair of $p$ and $q$.", "这只数了 $p$、$q$ 一种取值所占的行。"),
      ],
      solution: walked(
        [
          [
            ["Compare the columns", "比较两列"],
            t(
              `The ${kind.en} is $${kind.latex}$. Over TT, TF, FT, FF, $p \\to q$ takes T, F, T, T and the ${kind.en} takes ${kind.column}. They are ${differ ? "different" : "both true"} in ${whereEn}: ${pairs} of the 4 value pairs.`,
              `${kind.zh}是 $${kind.latex}$。在 TT、TF、FT、FF 下，$p \\to q$ 依次为 T、F、T、T，${kind.zh}依次为 ${kind.column}。两者${differ ? "取值不同" : "同时为真"}的是${whereZh}：4 种取值中的 ${pairs} 种。`,
            ),
          ],
          [
            ["Multiply by the rows of each pair", "乘以每种取值的行数"],
            t(
              `The other ${n - 2} variables are free, so each value pair fills $2^{${n - 2}} = ${each}$ rows: $${pairs} \\cdot ${each} = ${answer}$.`,
              `其余 ${n - 2} 个变量自由，所以每种取值占 $2^{${n - 2}} = ${each}$ 行：$${pairs} \\cdot ${each} = ${answer}$。`,
            ),
          ],
        ],
        kind.differ === 0
          ? t(
              `The contrapositive is equivalent to $p \\to q$, so they never differ and are both true wherever $p \\to q$ is, in 3 of the 4 value pairs. ${differ ? "The count of 0 fits." : "That is the count found."}`,
              `逆否命题与 $p \\to q$ 等价，所以它们从不不同，并在 $p \\to q$ 为真的 4 种取值中的 3 种同时为真。${differ ? "行数为 0，相符。" : "与所求一致。"}`,
            )
          : t(
              `The 4 value pairs split into those where the two agree, TT and FF, and those where they differ, TF and FT. Where they agree both are T, so "both true" and "different" each take 2 value pairs, $2 \\cdot ${each} = ${2 * each}$ rows, and together they fill all $2^{${n}} = ${2 ** n}$ rows.`,
              `4 种取值分为两者一致的 TT、FF 和两者不同的 TF、FT。一致时两者都为 T，所以“同时为真”与“取值不同”各占 2 种取值，即 $2 \\cdot ${each} = ${2 * each}$ 行，合起来正好是全部 $2^{${n}} = ${2 ** n}$ 行。`,
            ),
      ),
    });
  },
};

const andOrOfDivisibility: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-divisibility-and-or-or",
  title: t("Counting the truth set of a divisibility AND or OR", "数可除性的合取或析取的真值集"),
  explanation: t(
    "The truth set of a conjunction is the intersection of the two truth sets, and the truth set of a disjunction is their union. For divisibility predicates, being divisible by both numbers means being divisible by their lcm, not necessarily by their product. The disjunction then follows by inclusion-exclusion, since adding the two counts counts the common multiples twice. From $1$ to $100$, there are $25$ multiples of $4$ and $16$ of $6$; the $8$ multiples of $\\operatorname{lcm}(4, 6) = 12$ are in both, so $25 + 16 - 8 = 33$ numbers are divisible by $4$ or $6$.\n\n> **Watch out.** The common multiples are the multiples of the lcm, which can be smaller than the product: $12$ is divisible by both $4$ and $6$, though not by $24$.",
    "合取的真值集是两个真值集的交，析取的真值集是它们的并。对可除性谓词，同时被两个数整除就是被它们的最小公倍数整除，而不一定被它们的乘积整除。析取再由容斥原理得出，因为两个个数相加时，公倍数被算了两次。从 $1$ 到 $100$，$4$ 的倍数有 $25$ 个，$6$ 的倍数有 $16$ 个；$\\operatorname{lcm}(4, 6) = 12$ 的 $8$ 个倍数两边都有，所以被 $4$ 或 $6$ 整除的数有 $25 + 16 - 8 = 33$ 个。\n\n> **注意。** 公倍数是最小公倍数的倍数，最小公倍数可能比乘积小：$12$ 能被 $4$ 和 $6$ 整除，却不能被 $24$ 整除。",
  ),
  generate(rng) {
    const [a, b] = rng.pick(independentDivisors);
    const size = rng.int(270, 500);
    const lcm = lcmOf(a, b);
    const onA = Math.floor(size / a);
    const onB = Math.floor(size / b);
    const onBoth = Math.floor(size / lcm);
    const onProduct = Math.floor(size / (a * b));
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
      wrong: both ? [onBoth + 1, onBoth - 1] : [],
      mistakes: both
        ? [
            why(
              onProduct,
              `That counts the multiples of $${a} \\cdot ${b}$; the numbers divisible by both are the multiples of the lcm, which is smaller.`,
              `这数的是 $${a} \\cdot ${b}$ 的倍数；同时被两者整除的是最小公倍数的倍数，它更小。`,
            ),
            why(
              Math.min(onA, onB),
              "That counts the multiples of one number only; they must be multiples of both.",
              "这只数了一个数的倍数；它们必须同时是两者的倍数。",
            ),
          ]
        : [
            why(
              onA + onB,
              "That adds the two counts, so the common multiples are counted twice.",
              "这把两个个数直接相加，公倍数被算了两次。",
            ),
            why(
              onA + onB - onProduct,
              `That takes away the multiples of $${a} \\cdot ${b}$; the numbers counted twice are the multiples of the lcm.`,
              `这减去的是 $${a} \\cdot ${b}$ 的倍数；被算了两次的是最小公倍数的倍数。`,
            ),
            why(size - onA - onB + onBoth, "That counts the numbers divisible by neither.", "这数的是两者都不能整除的数。"),
          ],
      solution: both
        ? walked(
            [
              [
                ["Combine the conditions", "合并条件"],
                t(
                  `$${a} \\mid x$ and $${b} \\mid x$ hold together exactly when $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ divides $x$.`,
                  `$${a} \\mid x$ 与 $${b} \\mid x$ 同时成立，当且仅当 $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 整除 $x$。`,
                ),
              ],
              [
                ["Count the multiples", "数出倍数"],
                t(`$\\lfloor ${size} / ${lcm} \\rfloor = ${answer}$.`, `$\\lfloor ${size} / ${lcm} \\rfloor = ${answer}$。`),
              ],
            ],
            t(
              `The last of them is $${lcm} \\cdot ${answer} = ${lcm * answer} \\le ${size}$, and the next, $${lcm * (answer + 1)}$, is beyond ${size}.`,
              `其中最后一个是 $${lcm} \\cdot ${answer} = ${lcm * answer} \\le ${size}$，下一个 $${lcm * (answer + 1)}$ 超出了 ${size}。`,
            ),
          )
        : walked(
            [
              [
                ["Count each condition", "分别计数"],
                t(`There are ${onA} multiples of ${a} and ${onB} multiples of ${b}.`, `${a} 的倍数有 ${onA} 个，${b} 的倍数有 ${onB} 个。`),
              ],
              [
                ["Remove the double count", "去掉重复计数"],
                t(
                  `The ${onBoth} multiples of $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ were counted twice, so the count is $${onA} + ${onB} - ${onBoth} = ${answer}$.`,
                  `$\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 的 ${onBoth} 个倍数被算了两次，所以个数是 $${onA} + ${onB} - ${onBoth} = ${answer}$。`,
                ),
              ],
            ],
            t(
              `Count the three separate parts instead: only ${a}, $${onA} - ${onBoth} = ${onA - onBoth}$; only ${b}, $${onB} - ${onBoth} = ${onB - onBoth}$; both, ${onBoth}. Together $${onA - onBoth} + ${onB - onBoth} + ${onBoth} = ${answer}$.`,
              `改为分三部分数：只被 ${a} 整除的 $${onA} - ${onBoth} = ${onA - onBoth}$ 个；只被 ${b} 整除的 $${onB} - ${onBoth} = ${onB - onBoth}$ 个；两者都整除的 ${onBoth} 个。合计 $${onA - onBoth} + ${onB - onBoth} + ${onBoth} = ${answer}$。`,
            ),
          ),
    });
  },
};

const conditionalOfDivisibility: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-divisibility-conditional",
  title: t("Counting the truth set of a divisibility conditional", "数可除性条件命题的真值集"),
  explanation: t(
    'A conditional predicate is false only where its hypothesis holds and its conclusion fails. So it is usually easier to count the false values and subtract them than to count the true ones. Here the false values are the multiples of the first number that are not multiples of the second, which means removing the common multiples from the first group. From $1$ to $100$, "if $4 \\mid x$, then $6 \\mid x$" fails for the $25 - 8 = 17$ multiples of $4$ that are not multiples of $12$, so it holds for $83$ values.\n\n> **Watch out.** Every $x$ that is not a multiple of the first number makes the conditional true, whatever happens to the second.',
    "条件谓词只在假设成立而结论不成立时为假。所以数出假的值再减去，通常比直接数真的值容易。这里假的值是第一个数的倍数中不是第二个数倍数的那些，也就是从第一组倍数中去掉公倍数。从 $1$ 到 $100$，“如果 $4 \\mid x$，那么 $6 \\mid x$”对 $4$ 的倍数中不是 $12$ 的倍数的 $25 - 8 = 17$ 个值为假，所以对 $83$ 个值为真。\n\n> **注意。** 每个不是第一个数倍数的 $x$ 都使条件命题为真，不论第二个条件如何。",
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
      mistakes: [
        why(
          onBoth,
          `That counts only the $x$ where both divisibilities hold; the $x$ that are not multiples of ${a} make the conditional true too.`,
          `这只数了两个整除都成立的 $x$；不是 ${a} 的倍数的 $x$ 也使条件命题为真。`,
        ),
        why(falseValues, "That counts the values where the conditional is false.", "这数的是条件命题为假的值。"),
        why(
          size - onA,
          `That counts only the $x$ where the hypothesis fails; the multiples of ${lcm} make the conditional true as well.`,
          `这只数了假设不成立的 $x$；${lcm} 的倍数也使条件命题为真。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Find the false values", "找出假的值"],
            t(
              `The conditional fails for multiples of ${a} that are not multiples of ${b}. There are ${onA} multiples of ${a}, and ${onBoth} of them are multiples of $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$, which leaves ${falseValues} false values.`,
              `条件命题对是 ${a} 的倍数但不是 ${b} 的倍数的值为假。${a} 的倍数有 ${onA} 个，其中 ${onBoth} 个是 $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 的倍数，所以有 ${falseValues} 个假值。`,
            ),
          ],
          [
            ["Subtract", "相减"],
            t(`It is true for $${size} - ${falseValues} = ${answer}$ values.`, `它对 $${size} - ${falseValues} = ${answer}$ 个值为真。`),
          ],
        ],
        t(
          `Count the true values directly: the hypothesis fails for $${size} - ${onA} = ${size - onA}$ values, and both parts hold for ${onBoth}. Together $${size - onA} + ${onBoth} = ${answer}$.`,
          `直接数真的值：假设不成立的有 $${size} - ${onA} = ${size - onA}$ 个，两部分都成立的有 ${onBoth} 个。合计 $${size - onA} + ${onBoth} = ${answer}$。`,
        ),
      ),
    });
  },
};

const thresholdOfAQuantifier: KnowledgePointDef = {
  id: "the-threshold-that-makes-a-quantified-statement-true",
  title: t("The threshold that makes a quantified statement true", "使量词命题为真的临界值"),
  explanation: t(
    "A universal statement over a finite set is a chain of conditions, one for each element, so a bound must beat the largest value of the expression. An existential statement needs only one element to work, so a bound must reach just the smallest value. The same expression and domain can therefore give very different thresholds for the two quantifiers. On $\\{-1, 0, 1, 2\\}$, $x^2$ takes the values $1, 0, 1, 4$: $(\\forall x)\\; x^2 \\le c$ needs $c \\ge 4$, while $(\\exists x)\\; x^2 \\le c$ needs only $c \\ge 0$.\n\n> **Watch out.** The extreme value need not be at an end of the set. A square is smallest where its base is closest to $0$, which may be in the middle.",
    "有限集上的全称命题是一串条件，每个元素一个，所以上界必须不小于表达式的最大值。存在命题只需要一个元素成立，所以上界只要达到最小值。因此同样的表达式和定义域，在两种量词下的临界值可能相差很大。在 $\\{-1, 0, 1, 2\\}$ 上，$x^2$ 取值 $1, 0, 1, 4$：$(\\forall x)\\; x^2 \\le c$ 需要 $c \\ge 4$，而 $(\\exists x)\\; x^2 \\le c$ 只需 $c \\ge 0$。\n\n> **注意。** 极值不一定在集合的端点。平方在底数最接近 $0$ 处最小，那可能在中间。",
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
    const first = values[0] ?? 0;
    const last = values[values.length - 1] ?? 0;
    return numberProblem({
      prompt: t(
        `What is the smallest integer $c$ for which $(${quantifier} x \\in \\{${low}, ${low + 1}, \\dots, ${high}\\})\\; ${square} \\le c$ is true?`,
        `使 $(${quantifier} x \\in \\{${low}, ${low + 1}, \\dots, ${high}\\})\\; ${square} \\le c$ 为真的最小整数 $c$ 是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        universal
          ? why(
              smallest,
              "That is the smallest value; for all $x$ the bound must cover the largest.",
              "这是最小值；对所有 $x$，上界必须盖过最大值。",
            )
          : why(
              largest,
              "That is the largest value; one $x$ is enough, so the smallest value suffices.",
              "这是最大值；一个 $x$ 就够了，所以最小值就行。",
            ),
        why(
          answer + 1,
          "The inequality is $\\le$, so $c$ may equal the extreme value itself.",
          "不等式是 $\\le$，所以 $c$ 可以等于极值本身。",
        ),
        why(
          first,
          `That is the value at $x = ${low}$, one end of the set; the ${universal ? "largest" : "smallest"} value is elsewhere.`,
          `这是端点 $x = ${low}$ 处的值；${universal ? "最大" : "最小"}值在别处。`,
        ),
        why(
          last,
          `That is the value at $x = ${high}$, one end of the set; the ${universal ? "largest" : "smallest"} value is elsewhere.`,
          `这是端点 $x = ${high}$ 处的值；${universal ? "最大" : "最小"}值在别处。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Decide which extreme matters", "确定看哪个极值"],
            universal
              ? t(
                  `Every $x$ must satisfy the inequality, so $c$ must be at least the largest value of $${square}$ on the set.`,
                  `每个 $x$ 都必须满足不等式，所以 $c$ 至少是 $${square}$ 在集合上的最大值。`,
                )
              : t(
                  `One $x$ is enough, so $c$ only has to reach the smallest value of $${square}$ on the set.`,
                  `一个 $x$ 就够了，所以 $c$ 只需达到 $${square}$ 在集合上的最小值。`,
                ),
          ],
          [
            ["Find it", "求出它"],
            t(
              `For $x = ${low}, \\dots, ${high}$ the values are $${values.join(", ")}$. The ${universal ? "largest" : "smallest"} is $${answer}$, at $x = ${at}$.`,
              `对 $x = ${low}, \\dots, ${high}$，取值为 $${values.join(", ")}$。${universal ? "最大" : "最小"}的是 $${answer}$，在 $x = ${at}$ 处。`,
            ),
          ],
        ],
        universal
          ? t(
              `With $c = ${answer}$ every value is at most $${answer}$; with $c = ${answer - 1}$ the value at $x = ${at}$ fails.`,
              `取 $c = ${answer}$，每个值都不超过 $${answer}$；取 $c = ${answer - 1}$，$x = ${at}$ 处的值不满足。`,
            )
          : t(
              `With $c = ${answer}$ the value $x = ${at}$ works; with $c = ${answer - 1}$ no $x$ works, since every value is at least $${answer}$.`,
              `取 $c = ${answer}$，$x = ${at}$ 满足；取 $c = ${answer - 1}$，没有 $x$ 满足，因为每个值都至少是 $${answer}$。`,
            ),
      ),
    });
  },
};

const implicationChainRows: KnowledgePointDef = {
  id: "the-true-rows-of-an-implication-chain",
  title: t("The true rows of an implication chain", "蕴涵链的真行"),
  explanation: t(
    "By transitivity, a chain of implications forces every later variable to be true as soon as one variable is true. So along the chain the values can only switch once, from false to true, and they can never switch back. The allowed patterns are therefore fixed by the place where this switch occurs, and there is also the pattern with no switch at all. For $(p_1 \\to p_2) \\land (p_2 \\to p_3)$ they are FFF, FFT, FTT and TTT: four rows.\n\n> **Watch out.** The number of falses at the start can be anything from $0$ to $k$, which is $k + 1$ choices, not $k$: both the all-true and the all-false patterns count.",
    "由传递性，蕴涵链一旦有一个变量为真，后面的变量都必须为真。所以沿着链条，取值只能从假变为真一次，不能再变回去。因此允许的模式由这个转变发生的位置决定，此外还有完全不转变的模式。对 $(p_1 \\to p_2) \\land (p_2 \\to p_3)$，它们是 FFF、FFT、FTT 和 TTT：四行。\n\n> **注意。** 开头假的个数可以是 $0$ 到 $k$ 中任何一个，共 $k + 1$ 种，不是 $k$ 种：全真和全假的模式都要算。",
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
          : `(p_1 \\to p_2) \\land \\dots \\land (p_{${k - 1}} \\to p_{${k}})`;
    return numberProblem({
      prompt: t(
        `A truth table lists all values of ${n} variables, including $p_1$ to $p_{${k}}$. In how many rows is $${links}$ true?`,
        `真值表列出 ${n} 个变量的所有取值，其中包括 $p_1$ 到 $p_{${k}}$。$${links}$ 在多少行为真？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** (n - 1), answer + each],
      mistakes: [
        why(
          k * each,
          `That misses a pattern: the number of falses can be any of $0, 1, \\dots, ${k}$, which is ${k + 1} choices.`,
          `这漏了一种模式：假的个数可以是 $0, 1, \\dots, ${k}$ 中任何一个，共 ${k + 1} 种。`,
        ),
        why(2 ** n - answer, "That counts the rows where the chain is false.", "这数的是链为假的行。"),
      ],
      solution: walked(
        [
          [
            ["Find the patterns along the chain", "找出链上的模式"],
            t(
              `Once some $p_i$ is true, every later one must be, so the values read some falses followed by trues. The number of falses can be $0, 1, \\dots, ${k}$: ${patterns} patterns.`,
              `一旦某个 $p_i$ 为真，后面的都必须为真，所以取值是若干个假后面跟着若干个真。假的个数可以是 $0, 1, \\dots, ${k}$：${patterns} 种模式。`,
            ),
          ],
          extra === 0
            ? [
                ["Count the rows", "数出行数"],
                t(`There are no other variables, so there are ${answer} rows.`, `没有其他变量，所以有 ${answer} 行。`),
              ]
            : [
                ["Fill in the free variables", "填入自由变量"],
                t(
                  `${extra === 1 ? "The other variable is free" : `The other ${extra} variables are free`}, so each pattern fills $2^{${extra}} = ${each}$ rows: $${patterns} \\cdot ${each} = ${answer}$.`,
                  `其余 ${extra} 个变量自由，所以每种模式占 $2^{${extra}} = ${each}$ 行：$${patterns} \\cdot ${each} = ${answer}$。`,
                ),
              ],
        ],
        t(
          "Try the shortest chain, $p_1 \\to p_2 \\to p_3$: the patterns are FFF, FFT, FTT and TTT, while FTF, TFF, TFT and TTF each break a link. That is $4 = 3 + 1$, as the rule says.",
          "试最短的链 $p_1 \\to p_2 \\to p_3$：模式是 FFF、FFT、FTT 和 TTT，而 FTF、TFF、TFT、TTF 都会断开某一环。共 $4 = 3 + 1$ 种，与规律相符。",
        ),
      ),
    });
  },
};

const chainsOfSubsets: KnowledgePointDef = {
  id: "counting-nested-chains-of-subsets",
  title: t("Counting nested chains of subsets", "数嵌套的子集链"),
  explanation: t(
    "Proving $A \\subseteq B$ means following one element at a time, and counting nested subsets works the same way. For a chain of subsets, an element is settled by the first set it enters, since the inclusions force it into all the later sets. Each element decides independently of the others, which turns the count of chains into a power. For $A_1 \\subseteq A_2$ inside a $2$-element set, each element is in $A_1$ (and so in $A_2$), in $A_2$ only, or in neither: $3^{2} = 9$ chains.\n\n> **Watch out.** Choosing each set freely gives $2^{rn}$ lists, most of them not nested. An element does not choose in or out for each set separately; it chooses where it first enters, or none.",
    "证明 $A \\subseteq B$ 要逐个元素地追踪，数嵌套的子集也是这样。对于一条子集链，一个元素由它最先进入的集合决定，因为包含关系迫使它进入所有后面的集合。每个元素的决定相互独立，所以子集链的个数是一个幂。对 $2$ 元集合中的 $A_1 \\subseteq A_2$，每个元素属于 $A_1$（因而属于 $A_2$）、只属于 $A_2$ 或都不属于：共 $3^{2} = 9$ 条链。\n\n> **注意。** 每个集合自由选取会得到 $2^{rn}$ 个序列，其中大多数不嵌套。元素不是对每个集合分别决定在或不在，而是决定它最先进入哪个集合，或者都不进入。",
  ),
  generate(rng) {
    if (rng.pick([true, false])) {
      const r = rng.int(2, 4);
      const n = rng.int(2, 8);
      const answer = (r + 1) ** n;
      const chain = [...Array(r).keys()].map((i) => `A_{${i + 1}}`).join(" \\subseteq ");
      return numberProblem({
        prompt: t(
          `Let $U$ be a set of ${n} elements. How many lists of subsets of $U$ satisfy $${chain}$?`,
          `设 $U$ 是 ${n} 元集合。$U$ 的子集组成的序列中，有多少个满足 $${chain}$？`,
        ),
        answer,
        form: "integer",
        mistakes: [
          why(
            2 ** (r * n),
            `That chooses each of the ${r} sets freely, and most of those lists are not nested.`,
            `这对 ${r} 个集合分别自由选取，其中大多数序列并不嵌套。`,
          ),
          why(r ** n, "That leaves out the choice of an element lying in none of the sets.", "这漏掉了元素不属于任何一个集合的情形。"),
          why(
            r * 2 ** n,
            `That multiplies $${r}$ by $2^{${n}}$; each element has its own ${r + 1} choices, so the choices multiply over the ${n} elements.`,
            `这是把 $${r}$ 乘以 $2^{${n}}$；每个元素各有 ${r + 1} 种选择，应对 ${n} 个元素把选择数相乘。`,
          ),
        ],
        solution: walked(
          [
            [
              ["Count the choices of one element", "数一个元素的选择"],
              t(
                `An element first enters $A_1$, $A_2$, …, or $A_{${r}}$, and is then in every later set; or it is in none. That is $${r} + 1 = ${r + 1}$ choices.`,
                `一个元素最先进入 $A_1$、$A_2$、…、$A_{${r}}$ 之一，此后属于所有后面的集合；或者都不属于。共 $${r} + 1 = ${r + 1}$ 种选择。`,
              ),
            ],
            [
              ["Multiply over the elements", "对所有元素相乘"],
              t(`$${r + 1}^{${n}} = ${answer}$ chains.`, `共 $${r + 1}^{${n}} = ${answer}$ 条链。`),
            ],
          ],
          t(
            `List the chains for one element: it can be in all ${r} sets, in the last ${r - 1}, …, in the last one only, or in none. That is ${r + 1} chains, matching $${r + 1}^{1}$, and each further element multiplies the count by ${r + 1}.`,
            `对一个元素列出所有链：它可以属于全部 ${r} 个集合、属于后 ${r - 1} 个、……、只属于最后一个，或都不属于。共 ${r + 1} 条链，与 $${r + 1}^{1}$ 一致；每增加一个元素，个数乘以 ${r + 1}。`,
          ),
        ),
      });
    }
    const n = rng.int(3, 9);
    const m = rng.int(1, n - 1);
    const answer = binom(n, m) * 2 ** m;
    const byX = [...Array(m + 1).keys()].map((k) => binom(n, k) * binom(n - k, m - k));
    return numberProblem({
      prompt: t(
        `Let $U$ be a set of ${n} elements. How many pairs of subsets of $U$ satisfy $X \\subseteq Y$ and $|Y| = ${m}$?`,
        `设 $U$ 是 ${n} 元集合。$U$ 的子集对中，有多少对满足 $X \\subseteq Y$ 且 $|Y| = ${m}$？`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          binom(n, m),
          `That counts only the choices of $Y$; each $Y$ still has $2^{${m}}$ subsets $X$.`,
          `这只数了 $Y$ 的选法；每个 $Y$ 还有 $2^{${m}}$ 个子集 $X$。`,
        ),
        why(2 ** n, "That counts the subsets of $U$; both $Y$ and $X$ must be chosen.", "这数的是 $U$ 的子集；$Y$ 和 $X$ 都要选。"),
        why(
          2 ** m,
          `That counts the sets $X$ for one $Y$; there are $\\binom{${n}}{${m}}$ choices of $Y$.`,
          `这是一个 $Y$ 对应的 $X$ 的个数；$Y$ 有 $\\binom{${n}}{${m}}$ 种选法。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Choose Y", "选出 Y"],
            t(
              `$Y$ is ${m} of the ${n} elements: $\\binom{${n}}{${m}} = ${binom(n, m)}$ ways.`,
              `$Y$ 由 ${n} 个元素中的 ${m} 个组成：$\\binom{${n}}{${m}} = ${binom(n, m)}$ 种。`,
            ),
          ],
          [["Choose X inside Y", "在 Y 中选出 X"], t(`$Y$ has $2^{${m}} = ${2 ** m}$ subsets.`, `$Y$ 有 $2^{${m}} = ${2 ** m}$ 个子集。`)],
          [
            ["Multiply", "相乘"],
            t(`$${binom(n, m)} \\cdot ${2 ** m} = ${answer}$ pairs.`, `共 $${binom(n, m)} \\cdot ${2 ** m} = ${answer}$ 对。`),
          ],
        ],
        t(
          `Choose $X$ first instead. With $|X| = k$, the other $${m} - k$ elements of $Y$ come from the remaining $${n} - k$: $\\sum_{k=0}^{${m}} \\binom{${n}}{k}\\binom{${n} - k}{${m} - k} = ${byX.join(" + ")} = ${answer}$.`,
          `改为先选 $X$。若 $|X| = k$，$Y$ 的另外 $${m} - k$ 个元素从其余 $${n} - k$ 个中选：$\\sum_{k=0}^{${m}} \\binom{${n}}{k}\\binom{${n} - k}{${m} - k} = ${byX.join(" + ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const intersectionWithAUnion: KnowledgePointDef = {
  id: "the-size-of-a-distributed-set-expression",
  title: t("The size of a distributed set expression", "分配后集合表达式的大小"),
  explanation: t(
    "The distributive law rewrites $A \\cap (B \\cup C)$ as a union of two intersections, and inclusion-exclusion counts a union of two sets from their overlap. The overlap of those two intersections is the triple intersection, so that is the part counted twice. Likewise, $A \\cup (B \\cap C)$ is a union whose two parts overlap in the triple intersection too. With $|A \\cap B| = 5$, $|A \\cap C| = 4$ and $|A \\cap B \\cap C| = 2$, $|A \\cap (B \\cup C)| = 5 + 4 - 2 = 7$.\n\n> **Watch out.** Subtract the triple intersection exactly once. Not subtracting it counts those elements twice; subtracting it twice leaves them out, though they belong to the set.",
    "分配律把 $A \\cap (B \\cup C)$ 改写成两个交集的并，而容斥原理由重叠部分算出两个集合的并的大小。这两个交集的重叠部分就是三者的交，这正是被算了两次的部分。同样，$A \\cup (B \\cap C)$ 也是一个并，它的两部分也在三者的交上重叠。若 $|A \\cap B| = 5$，$|A \\cap C| = 4$，$|A \\cap B \\cap C| = 2$，则 $|A \\cap (B \\cup C)| = 5 + 4 - 2 = 7$。\n\n> **注意。** 三者的交恰好减一次。不减，这些元素被算了两次；减两次，就把它们漏掉了，而它们属于这个集合。",
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
        mistakes: [
          why(
            ab + ac,
            "That counts the elements of $A \\cap B \\cap C$ twice, once in each intersection.",
            "这把 $A \\cap B \\cap C$ 的元素算了两次，每个交集里各一次。",
          ),
          why(
            ab + ac - 2 * triple,
            "That subtracts $A \\cap B \\cap C$ twice, which leaves its elements out, though they are in $A \\cap (B \\cup C)$.",
            "这把 $A \\cap B \\cap C$ 减了两次，漏掉了它的元素，而它们属于 $A \\cap (B \\cup C)$。",
          ),
          why(answer + 2 * triple, "That adds the overlap instead of subtracting it.", "这把重叠部分加上了，而不是减去。"),
        ],
        solution: walked(
          [
            [
              ["Distribute", "分配"],
              t("$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$.", "$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$。"),
            ],
            [
              ["Find the overlap", "找出重叠部分"],
              t("$(A \\cap B) \\cap (A \\cap C) = A \\cap B \\cap C$.", "$(A \\cap B) \\cap (A \\cap C) = A \\cap B \\cap C$。"),
            ],
            [
              ["Apply inclusion-exclusion", "应用容斥原理"],
              t(`$${ab} + ${ac} - ${triple} = ${answer}$.`, `$${ab} + ${ac} - ${triple} = ${answer}$。`),
            ],
          ],
          t(
            `Split the set into parts that do not overlap: $A \\cap B$ outside $C$ has $${ab - triple}$ elements, $A \\cap C$ outside $B$ has $${ac - triple}$, and $A \\cap B \\cap C$ has $${triple}$. Together $${ab - triple} + ${ac - triple} + ${triple} = ${answer}$.`,
            `把集合拆成互不重叠的部分：$A \\cap B$ 中不在 $C$ 里的有 $${ab - triple}$ 个元素，$A \\cap C$ 中不在 $B$ 里的有 $${ac - triple}$ 个，$A \\cap B \\cap C$ 有 $${triple}$ 个。合计 $${ab - triple} + ${ac - triple} + ${triple} = ${answer}$。`,
          ),
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
      mistakes: [
        why(
          a + bc,
          "That counts the elements of $A \\cap B \\cap C$ twice, once in $A$ and once in $B \\cap C$.",
          "这把 $A \\cap B \\cap C$ 的元素算了两次：在 $A$ 中一次，在 $B \\cap C$ 中一次。",
        ),
        why(
          a + bc - 2 * triple,
          "That subtracts $A \\cap B \\cap C$ twice, which leaves its elements out, though they are in the union.",
          "这把 $A \\cap B \\cap C$ 减了两次，漏掉了它的元素，而它们属于这个并集。",
        ),
        why(
          a + triple,
          "That adds $A \\cap B \\cap C$, which is already inside $A$; the new elements are those of $B \\cap C$ outside $A$.",
          "这加上的是 $A \\cap B \\cap C$，它已经在 $A$ 里了；新增的元素是 $B \\cap C$ 中不在 $A$ 里的那些。",
        ),
      ],
      solution: walked(
        [
          [
            ["Find the overlap", "找出重叠部分"],
            t(
              "The two parts $A$ and $B \\cap C$ overlap in $A \\cap (B \\cap C) = A \\cap B \\cap C$.",
              "两部分 $A$ 与 $B \\cap C$ 的重叠部分是 $A \\cap (B \\cap C) = A \\cap B \\cap C$。",
            ),
          ],
          [
            ["Apply inclusion-exclusion", "应用容斥原理"],
            t(`$${a} + ${bc} - ${triple} = ${answer}$.`, `$${a} + ${bc} - ${triple} = ${answer}$。`),
          ],
        ],
        t(
          `Start from the $${a}$ elements of $A$ and add the elements of $B \\cap C$ outside $A$, of which there are $${bc} - ${triple} = ${bc - triple}$: $${a} + ${bc - triple} = ${answer}$.`,
          `从 $A$ 的 $${a}$ 个元素出发，再加上 $B \\cap C$ 中不在 $A$ 里的元素，共 $${bc} - ${triple} = ${bc - triple}$ 个：$${a} + ${bc - triple} = ${answer}$。`,
        ),
      ),
    });
  },
};

const linearDividesQuadratic: KnowledgePointDef = {
  id: "when-a-linear-expression-divides-a-quadratic",
  title: t("When a linear expression divides a quadratic", "一次式何时整除二次式"),
  explanation: t(
    "If $d$ divides both $u$ and $v$, then it divides any combination of them, and this works in reverse too. So when a variable expression divides another, subtract a multiple of the divisor to remove the variable. What is left is a fixed number that the divisor must divide, which leaves only finitely many values to check. For $n + 2 \\mid n^2 + 5$: $n^2 + 5 = (n + 2)(n - 2) + 9$, so $n + 2 \\mid 9$; with $n + 2 > 2$ that leaves $3$ and $9$, so $n = 1$ or $n = 7$.\n\n> **Watch out.** For positive $n$, $n + a$ is larger than $a$, so only the divisors greater than $a$ give a value of $n$. The smaller divisors would need $n \\le 0$.",
    "如果 $d$ 同时整除 $u$ 和 $v$，它就整除它们的任何线性组合，反过来也一样。所以当含变量的式子整除另一个式子时，减去除式的倍数以消去变量。剩下的是一个固定的数，除式必须整除它，于是只需检查有限多个值。对 $n + 2 \\mid n^2 + 5$：$n^2 + 5 = (n + 2)(n - 2) + 9$，所以 $n + 2 \\mid 9$；由 $n + 2 > 2$，只剩 $3$ 和 $9$，所以 $n = 1$ 或 $n = 7$。\n\n> **注意。** 对正整数 $n$，$n + a$ 大于 $a$，所以只有大于 $a$ 的因数才给出 $n$ 的值。较小的因数需要 $n \\le 0$。",
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
    const d0 = large[0]!;
    const n0 = d0 - a;
    const v0 = n0 * n0 + c;
    return numberProblem({
      prompt: t(
        `For how many positive integers $n$ does $${divisor}$ divide $n^2 + ${c}$?`,
        `对多少个正整数 $n$，$${divisor}$ 整除 $n^2 + ${c}$？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(
          divisors.length,
          `That counts every divisor of $${fixed}$, but $${divisor} > ${a}$, so the divisors up to $${a}$ give no positive $n$.`,
          `这数的是 $${fixed}$ 的所有因数，但 $${divisor} > ${a}$，所以不超过 $${a}$ 的因数给不出正整数 $n$。`,
        ),
        why(
          divisorsOf(c).length,
          `The fixed number is not $${c}$: dividing $n^2 + ${c}$ by $${divisor}$ leaves $${a * a} + ${c} = ${fixed}$.`,
          `固定的数不是 $${c}$：$n^2 + ${c}$ 除以 $${divisor}$ 余 $${a * a} + ${c} = ${fixed}$。`,
        ),
        why(
          fixed,
          `$${fixed}$ is the number $${divisor}$ must divide, not the number of values of $n$.`,
          `$${fixed}$ 是 $${divisor}$ 必须整除的数，而不是 $n$ 的个数。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Remove the variable", "消去变量"],
            t(`$n^2 + ${c} = (${divisor})(${other}) + ${fixed}$.`, `$n^2 + ${c} = (${divisor})(${other}) + ${fixed}$。`),
          ],
          [
            ["Find what the divisor must divide", "找出除式必须整除的数"],
            t(
              `$${divisor}$ divides $n^2 + ${c}$ and $(${divisor})(${other})$, so it divides their difference $${fixed}$.`,
              `$${divisor}$ 整除 $n^2 + ${c}$ 和 $(${divisor})(${other})$，所以整除它们的差 $${fixed}$。`,
            ),
          ],
          [
            ["Count", "计数"],
            t(
              `The divisors of $${fixed}$ greater than $${a}$ are $${large.join(", ")}$, each giving one $n = d - ${a}$: ${answer} value${answer === 1 ? "" : "s"}.`,
              `$${fixed}$ 的大于 $${a}$ 的因数是 $${large.join(", ")}$，每个给出一个 $n = d - ${a}$：共 ${answer} 个值。`,
            ),
          ],
        ],
        t(
          `At $n = ${n0}$, $${divisor} = ${d0}$ and $n^2 + ${c} = ${v0} = ${d0} \\cdot ${v0 / d0}$.`,
          `$n = ${n0}$ 时，$${divisor} = ${d0}$，$n^2 + ${c} = ${v0} = ${d0} \\cdot ${v0 / d0}$。`,
        ),
      ),
    });
  },
};

const smallestCounterexample: KnowledgePointDef = {
  id: "the-smallest-counterexample-to-a-non-divisibility-claim",
  title: t("The smallest counterexample to a non-divisibility claim", "不可除性命题的最小反例"),
  explanation: t(
    "One counterexample is enough to disprove a universal statement, and the search can be kept short. The remainder of a polynomial on division by a fixed number depends only on the remainder of the input, so the remainders repeat. If no counterexample turns up within one full period of inputs, then none exists. Otherwise, going through them in order finds the smallest. For the claim $5 \\nmid n^2 + 1$, $n = 1$ gives $2$ and $n = 2$ gives $5$, so $n = 2$ is the smallest counterexample.\n\n> **Watch out.** A counterexample is an $n$ where the claim fails, that is, where the expression is a multiple. Look for remainder $0$, and stop at the first one.",
    "一个反例就足以推翻全称命题，而且搜索范围可以很小。多项式除以固定的数所得的余数，只取决于输入的余数，所以余数是循环的。如果在输入的一个完整周期内找不到反例，那么反例就不存在。否则，按顺序检查就能找到最小的反例。对命题 $5 \\nmid n^2 + 1$，$n = 1$ 得 $2$，$n = 2$ 得 $5$，所以最小的反例是 $n = 2$。\n\n> **注意。** 反例是使命题不成立的 $n$，也就是使表达式成为倍数的 $n$。要找余数为 $0$ 的情况，并在第一个处停下。",
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
    const hit = value(answer);
    return numberProblem({
      prompt: t(
        `Claim: "for every positive integer $n$, $${m} \\nmid ${formula}$." Find the smallest positive integer $n$ that is a counterexample.`,
        `命题："对每个正整数 $n$，$${m} \\nmid ${formula}$。"求作为反例的最小正整数 $n$。`,
      ),
      answer,
      form: "integer",
      wrong: [m - answer],
      mistakes: firstOf([
        why(
          answer + 1,
          `A smaller $n$ already makes the expression a multiple of $${m}$.`,
          `更小的 $n$ 就已经使表达式成为 $${m}$ 的倍数。`,
        ),
        why(
          answer + m,
          `The remainders repeat every $${m}$, so this is a counterexample too, but not the smallest.`,
          `余数每 $${m}$ 个循环一次，所以这也是反例，但不是最小的。`,
        ),
        why(
          m,
          `$${m}$ is the divisor in the claim; the counterexample is found by checking $n = 1, 2, 3, \\ldots$ in order.`,
          `$${m}$ 是命题中的除数；反例要按 $n = 1, 2, 3, \\ldots$ 的顺序检查才能找到。`,
        ),
      ]),
      solution: walked(
        [
          ...(answer === 1
            ? []
            : ([
                [
                  ["Check in order", "按顺序检查"],
                  t(
                    answer === 2
                      ? `At $n = 1$, the remainder on division by $${m}$ is $${remainders[0]}$, not $0$.`
                      : `For $n$ from $1$ to $${answer - 1}$, the remainders on division by $${m}$ are $${remainders.join(", ")}$, none of them $0$.`,
                    answer === 2
                      ? `$n = 1$ 时，除以 $${m}$ 的余数是 $${remainders[0]}$，不是 $0$。`
                      : `$n$ 从 $1$ 到 $${answer - 1}$ 时，除以 $${m}$ 的余数是 $${remainders.join(", ")}$，都不是 $0$。`,
                  ),
                ],
              ] as const)),
          [
            ["The first multiple", "第一个倍数"],
            t(
              `At $n = ${answer}$ the expression equals $${hit}$, a multiple of $${m}$, so the claim fails there.`,
              `$n = ${answer}$ 时表达式等于 $${hit}$，是 $${m}$ 的倍数，所以命题在此不成立。`,
            ),
          ],
        ],
        t(
          `$${answer}^2 + ${a === 1 ? "" : `${a} \\cdot `}${answer} + ${b} = ${hit} = ${m} \\cdot ${hit / m}$.`,
          `$${answer}^2 + ${a === 1 ? "" : `${a} \\cdot `}${answer} + ${b} = ${hit} = ${m} \\cdot ${hit / m}$。`,
        ),
      ),
    });
  },
};

const biconditionalOfDivisibility: KnowledgePointDef = {
  id: "counting-the-truth-set-of-a-divisibility-biconditional",
  title: t("Counting the truth set of a divisibility biconditional", "数可除性双条件的真值集"),
  explanation: t(
    'Proving a biconditional takes two directions because it says that its two sides stand or fall together. It holds when both sides are true and also when both sides are false, a case that is easy to forget. So its truth set has two separate parts. Each part can be counted on its own, and the two counts are then added. In $\\{1, \\dots, 12\\}$, "$2 \\mid x$ if and only if $3 \\mid x$" holds at $6, 12$ (both true) and at $1, 5, 7, 11$ (both false): $6$ values.\n\n> **Watch out.** The values divisible by neither number make the biconditional true as well. Counting only the common multiples leaves them out.',
    "证明双条件要证两个方向，因为它是说两边同真同假。两边都真时它成立，两边都假时它也成立，后一种情形容易被忘记。所以它的真值集由两个分开的部分组成。每部分可以单独数，再把两个个数相加。在 $\\{1, \\dots, 12\\}$ 中，“$2 \\mid x$ 当且仅当 $3 \\mid x$”在 $6, 12$（两边都真）和 $1, 5, 7, 11$（两边都假）处成立：共 $6$ 个值。\n\n> **注意。** 两个数都不能整除的值也使双条件为真。只数公倍数会把它们漏掉。",
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
    const differ = onA - both + (onB - both);
    return numberProblem({
      prompt: t(
        `Let $U = \\{1, 2, \\dots, ${size}\\}$. For how many $x \\in U$ is "$${a} \\mid x$ if and only if $${b} \\mid x$" true?`,
        `设 $U = \\{1, 2, \\dots, ${size}\\}$。对多少个 $x \\in U$，"$${a} \\mid x$ 当且仅当 $${b} \\mid x$"为真？`,
      ),
      answer,
      form: "integer",
      mistakes: firstOf([
        why(
          both,
          "That counts only where both sides are true; the biconditional also holds where both are false.",
          "这只数了两边都真的情况；两边都假时双条件也成立。",
        ),
        why(
          neither,
          "That counts only where both sides are false; the common multiples make it true as well.",
          "这只数了两边都假的情况；公倍数也使它为真。",
        ),
        why(
          size - answer,
          "That counts where the two sides disagree, which is exactly where the biconditional is false.",
          "这数的是两边不一致的情况，恰好是双条件为假的地方。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Both sides true", "两边都真"],
            t(
              `$x$ is a multiple of $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$: $\\lfloor ${size} / ${lcm} \\rfloor = ${both}$ values.`,
              `$x$ 是 $\\operatorname{lcm}(${a}, ${b}) = ${lcm}$ 的倍数：$\\lfloor ${size} / ${lcm} \\rfloor = ${both}$ 个值。`,
            ),
          ],
          [
            ["Both sides false", "两边都假"],
            t(
              `$x$ is a multiple of neither: $${size} - (${onA} + ${onB} - ${both}) = ${neither}$ values.`,
              `$x$ 两个都不是其倍数：$${size} - (${onA} + ${onB} - ${both}) = ${neither}$ 个值。`,
            ),
          ],
          [["Add", "相加"], t(`$${both} + ${neither} = ${answer}$.`, `$${both} + ${neither} = ${answer}$。`)],
        ],
        t(
          `The sides disagree for $(${onA} - ${both}) + (${onB} - ${both}) = ${differ}$ values, and $${answer} + ${differ} = ${size}$, all of $U$.`,
          `两边不一致的有 $(${onA} - ${both}) + (${onB} - ${both}) = ${differ}$ 个值，而 $${answer} + ${differ} = ${size}$，正好是 $U$ 的全部。`,
        ),
      ),
    });
  },
};

const divisorForcingASquare: KnowledgePointDef = {
  id: "the-smallest-divisor-that-forces-a-square-divisibility",
  title: t("The smallest divisor that forces a square divisibility", "迫使平方可除的最小除数"),
  explanation: t(
    'A statement with negated parts, such as one that begins with a failure of divisibility, becomes much easier through its contrapositive, which is a positive claim about divisibility. Squaring a number doubles the exponent of each prime. So for a square to contain a given prime power, the number itself needs only about half of that exponent, rounded up when the exponent is odd. For "if $8 \\nmid n^2$ then $b \\nmid n$": $8 = 2^3$, so $b = 2^2 = 4$; indeed $4 \\mid n$ gives $16 \\mid n^2$, while $b = 2$ fails at $n = 2$.\n\n> **Watch out.** Halve each exponent and round up, prime by prime. Rounding down gives a $b$ whose square misses a factor of the number.',
    "含否定部分的命题，比如以不能整除开头的命题，通过逆否命题就容易得多，因为逆否命题是关于整除的肯定说法。把一个数平方，每个素数的指数都翻倍。所以要使平方含有给定的素数幂，这个数本身只需要大约一半的指数，指数为奇数时向上取整。对“若 $8 \\nmid n^2$，则 $b \\nmid n$”：$8 = 2^3$，所以 $b = 2^2 = 4$；确实由 $4 \\mid n$ 得 $16 \\mid n^2$，而 $b = 2$ 在 $n = 2$ 时不成立。\n\n> **注意。** 对每个素数，把指数折半并向上取整。向下取整得到的 $b$，其平方会缺少原数的某个因数。",
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
      mistakes: firstOf([
        why(
          a,
          `$${a}$ works but is not the smallest: $b$ needs only half of each exponent, since squaring doubles them.`,
          `$${a}$ 可行但不是最小的：平方使指数翻倍，所以 $b$ 只需要每个指数的一半。`,
        ),
        why(
          p * q,
          `That takes each prime once; each exponent in $b$ must be at least half of the one in $${a}$.`,
          `这让每个素数只出现一次；$b$ 中每个指数至少要是 $${a}$ 中指数的一半。`,
        ),
        why(
          p ** Math.floor(e / 2) * q ** Math.floor(f / 2),
          "That rounds the halved exponents down, so its square is missing a factor; round up instead.",
          "这把折半后的指数向下取整了，它的平方会缺少因数；应当向上取整。",
        ),
        why(answer * p, "That works but is larger than needed.", "这可行，但比所需的大。"),
      ]),
      solution: walked(
        [
          [
            ["Take the contrapositive", "取逆否命题"],
            t(
              `The claim says: if $b \\mid n$, then $${a} \\mid n^2$. Taking $n = b$ shows $${a} \\mid b^2$ is needed.`,
              `命题等价于：若 $b \\mid n$，则 $${a} \\mid n^2$。取 $n = b$ 可知需要 $${a} \\mid b^2$。`,
            ),
          ],
          [
            ["Factor", "分解"],
            t(`$${a} = ${primePower(p, e)} \\cdot ${primePower(q, f)}$.`, `$${a} = ${primePower(p, e)} \\cdot ${primePower(q, f)}$。`),
          ],
          [
            ["Halve the exponents, rounding up", "指数折半，向上取整"],
            t(
              `$b = ${primePower(p, eUp)} \\cdot ${primePower(q, fUp)} = ${answer}$. It works, because $b \\mid n$ gives $b^2 \\mid n^2$.`,
              `$b = ${primePower(p, eUp)} \\cdot ${primePower(q, fUp)} = ${answer}$。它可行，因为由 $b \\mid n$ 得 $b^2 \\mid n^2$。`,
            ),
          ],
        ],
        t(
          `$b^2 = ${answer * answer} = ${a} \\cdot ${(answer * answer) / a}$, so $${a} \\mid b^2$.`,
          `$b^2 = ${answer * answer} = ${a} \\cdot ${(answer * answer) / a}$，所以 $${a} \\mid b^2$。`,
        ),
      ),
    });
  },
};

const pigeonholeByContradiction: KnowledgePointDef = {
  id: "the-pigeonhole-bound-by-contradiction",
  title: t("The pigeonhole bound by contradiction", "用反证法得到的鸽巢界"),
  explanation: t(
    "The pigeonhole principle is a proof by contradiction. Assume that every box holds fewer than some number of objects, add up the boxes, and find that the total is too small to account for all the objects. To show that a bound is the best possible, you also need an arrangement that spreads the objects as evenly as it can. With $10$ objects in $3$ boxes, if every box held at most $3$, there would be at most $9$ objects, so some box holds at least $4$.\n\n> **Watch out.** Divide and round up: the guaranteed count is $\\lceil \\text{objects} / \\text{boxes} \\rceil$. Rounding down gives a number that an even spread already beats.",
    "鸽巢原理是一种反证法。假设每个盒子里的物体都少于某个数，把各盒相加，发现总数太小，不足以容纳所有物体。要说明一个界是最好的，还需要给出一种尽量平均地分配物体的安排。$10$ 个物体放入 $3$ 个盒子，如果每个盒子至多 $3$ 个，总共至多 $9$ 个，所以某个盒子至少有 $4$ 个。\n\n> **注意。** 要相除后向上取整：能保证的个数是 $\\lceil \\text{物体数} / \\text{盒子数} \\rceil$。向下取整得到的数，平均分配时就已经超过了。",
  ),
  generate(rng) {
    const boxes = rng.int(3, 12);
    if (rng.pick([true, false])) {
      const objects = rng.int(20, 120);
      const answer = Math.ceil(objects / boxes);
      const capacity = boxes * (answer - 1);
      const full = objects - capacity;
      return numberProblem({
        prompt: t(
          `A total of ${objects} objects are placed in ${boxes} boxes. What is the largest $k$ such that some box must hold at least $k$ objects, however they are placed?`,
          `把 ${objects} 个物体放入 ${boxes} 个盒子。无论怎样放，某个盒子里必定至少有 $k$ 个物体，这样的 $k$ 最大是多少？`,
        ),
        answer,
        form: "integer",
        mistakes: firstOf([
          why(
            Math.floor(objects / boxes),
            "The quotient was rounded down; the guaranteed count rounds it up.",
            "商被向下取整了；能保证的个数要向上取整。",
          ),
          why(
            answer + 1,
            `An even spread keeps every box at $${answer}$ or fewer, so this is not guaranteed.`,
            `平均分配时每个盒子都不超过 $${answer}$ 个，所以这不能保证。`,
          ),
          why(
            objects - boxes + 1,
            "That is the most one box can hold, not what some box must hold.",
            "这是一个盒子最多能放的数，而不是某个盒子必定有的数。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Assume the opposite", "假设反面"],
              t(`Suppose every box held at most $${answer - 1}$.`, `假设每个盒子至多有 $${answer - 1}$ 个。`),
            ],
            [
              ["Count", "计数"],
              t(
                `Then the total is at most $${boxes} \\cdot ${answer - 1} = ${capacity} < ${objects}$, a contradiction. So some box holds at least $${answer}$.`,
                `那么总数至多是 $${boxes} \\cdot ${answer - 1} = ${capacity} < ${objects}$，矛盾。所以某个盒子至少有 $${answer}$ 个。`,
              ),
            ],
          ],
          t(
            full === boxes
              ? `No larger $k$ is forced: put $${answer}$ in every box, for $${boxes} \\cdot ${answer} = ${objects}$ objects.`
              : `No larger $k$ is forced: put $${answer}$ in ${full} box${full === 1 ? "" : "es"} and $${answer - 1}$ in the other ${boxes - full}, for $${full} \\cdot ${answer} + ${boxes - full} \\cdot ${answer - 1} = ${objects}$ objects.`,
            full === boxes
              ? `更大的 $k$ 不能保证：每个盒子各放 $${answer}$ 个，共 $${boxes} \\cdot ${answer} = ${objects}$ 个。`
              : `更大的 $k$ 不能保证：${full} 个盒子各放 $${answer}$ 个，其余 ${boxes - full} 个各放 $${answer - 1}$ 个，共 $${full} \\cdot ${answer} + ${boxes - full} \\cdot ${answer - 1} = ${objects}$ 个。`,
          ),
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
      mistakes: firstOf([
        why(
          boxes * k,
          `$${answer}$ objects already force it; $${boxes} \\cdot ${k}$ is more than needed.`,
          `$${answer}$ 个物体就已经能保证；$${boxes} \\cdot ${k}$ 比所需的多。`,
        ),
        why(
          answer - 1,
          `With $${answer - 1}$ objects every box can hold exactly $${k - 1}$, so no box reaches $${k}$.`,
          `有 $${answer - 1}$ 个物体时，每个盒子可以恰好放 $${k - 1}$ 个，没有盒子达到 $${k}$ 个。`,
        ),
        why(
          boxes + k - 1,
          `Each box can take $${k - 1}$ before any reaches $${k}$, so multiply by the number of boxes rather than adding.`,
          `每个盒子在达到 $${k}$ 个之前都能放 $${k - 1}$ 个，所以要乘以盒子数，而不是相加。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the most that is not enough", "找出不够的最大数"],
            t(
              `With $${boxes} \\cdot ${k - 1} = ${answer - 1}$ objects, every box can hold exactly $${k - 1}$, so that is not enough.`,
              `有 $${boxes} \\cdot ${k - 1} = ${answer - 1}$ 个物体时，每个盒子可以恰好放 $${k - 1}$ 个，所以还不够。`,
            ),
          ],
          [
            ["Add one", "再加一个"],
            t(
              `With $${answer}$ objects, if every box held at most $${k - 1}$, there would be at most $${answer - 1}$ objects, a contradiction.`,
              `有 $${answer}$ 个物体时，如果每个盒子至多放 $${k - 1}$ 个，最多只有 $${answer - 1}$ 个物体，矛盾。`,
            ),
          ],
        ],
        t(
          `$\\lceil ${answer} / ${boxes} \\rceil = ${k}$, while $\\lceil ${answer - 1} / ${boxes} \\rceil = ${k - 1}$.`,
          `$\\lceil ${answer} / ${boxes} \\rceil = ${k}$，而 $\\lceil ${answer - 1} / ${boxes} \\rceil = ${k - 1}$。`,
        ),
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
    "The standard contradiction shows that the square root of a positive integer is either an integer or irrational, and never a fraction in between. So asking whether a root is rational is the same as asking whether the integer under it is a perfect square. A difference of two squares then factors, which turns the condition into a search through factor pairs. For $\\sqrt{n^2 + 15}$: $(m - n)(m + n) = 15$ with pairs $(1, 15)$ and $(3, 5)$, giving $n = 7$ and $n = 1$.\n\n> **Watch out.** The two factors differ by $2n$, so they must have the same parity. A pair of opposite parity gives no integer $n$ and must be left out.",
    "标准的反证法说明，正整数的平方根要么是整数，要么是无理数，绝不会是中间的分数。所以问根式是否为有理数，就是问根号下的整数是否为完全平方数。两个平方数之差可以因式分解，于是这个条件就变成了对因数对的搜索。对 $\\sqrt{n^2 + 15}$：$(m - n)(m + n) = 15$，因数对为 $(1, 15)$ 和 $(3, 5)$，给出 $n = 7$ 和 $n = 1$。\n\n> **注意。** 两个因数相差 $2n$，所以奇偶性必须相同。奇偶性不同的因数对给不出整数 $n$，必须排除。",
  ),
  generate(rng) {
    const usable = [...Array(118).keys()].map((i) => i + 3).filter((v) => factorPairs(v).length > 0);
    const c = rng.pick(usable);
    const pairs = factorPairs(c);
    const answer = pairs.length;
    const values = pairs.map(([d, e]) => (e - d) / 2);
    const allPairs = divisorsOf(c).filter((d) => d * d < c).length;
    const listed = pairs.map(([d, e]) => `(${d}, ${e})`).join(", ");
    const [d0, e0] = pairs[0]!;
    const n0 = (e0 - d0) / 2;
    const m0 = (e0 + d0) / 2;
    return numberProblem({
      prompt: t(
        `For how many positive integers $n$ is $\\sqrt{n^2 + ${c}}$ rational?`,
        `对多少个正整数 $n$，$\\sqrt{n^2 + ${c}}$ 是有理数？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(
          allPairs,
          "That counts every factor pair, but a pair of opposite parity gives no integer $n$.",
          "这数的是所有因数对，但奇偶性不同的因数对给不出整数 $n$。",
        ),
        why(
          divisorsOf(c).length,
          "That counts divisors; each value of $n$ comes from a pair of factors of the same parity.",
          "这数的是因数；每个 $n$ 来自一对奇偶性相同的因数。",
        ),
        why(values[0] ?? 0, "That is one of the values of $n$, not the number of values.", "这是 $n$ 的一个值，而不是值的个数。"),
      ]),
      solution: walked(
        [
          [
            ["Reduce to integers", "化为整数"],
            t(
              `The root is rational only if it is an integer $m$, and then $m^2 - n^2 = ${c}$.`,
              `根式为有理数时只能是整数 $m$，这时 $m^2 - n^2 = ${c}$。`,
            ),
          ],
          [
            ["Factor", "因式分解"],
            t(
              `$(m - n)(m + n) = ${c}$. The factors differ by $2n$, so they have the same parity and the first is smaller.`,
              `$(m - n)(m + n) = ${c}$。两个因数相差 $2n$，所以奇偶性相同，且第一个较小。`,
            ),
          ],
          [
            ["List the pairs", "列出因数对"],
            t(
              `${answer === 1 ? `The only such pair is ${listed}` : `The pairs are ${listed}`}, giving $n = ${values.join(", ")}$: ${answer} value${answer === 1 ? "" : "s"}.`,
              `这样的因数对是 ${listed}，给出 $n = ${values.join(", ")}$：共 ${answer} 个值。`,
            ),
          ],
        ],
        t(`At $n = ${n0}$, $n^2 + ${c} = ${n0 * n0 + c} = ${m0}^2$.`, `$n = ${n0}$ 时，$n^2 + ${c} = ${n0 * n0 + c} = ${m0}^2$。`),
      ),
    });
  },
};

const leastPositiveBezoutY: KnowledgePointDef = {
  id: "the-bezout-solution-with-the-least-positive-y",
  title: t("The Bézout solution with the least positive $y$", "$y$ 最小且为正的贝祖解"),
  explanation: t(
    "One Bézout pair gives all the others. Adding the same multiple of the lcm to one term and removing it from the other keeps the total fixed. So after dividing out the gcd, $x$ moves in steps of the reduced second coefficient and $y$ moves in steps of the reduced first coefficient, in opposite directions. This lets you slide to the solution you want.\n\n> **Watch out.** $y$ moves in steps of $\\frac{a}{\\gcd(a, b)}$, not of $a$ itself. Steps of $a$ skip solutions when the gcd is larger than $1$.",
    "一组贝祖系数可以给出其他所有的贝祖系数。给一项加上最小公倍数的某个倍数，同时从另一项减去它，总和不变。所以约去最大公因数后，$x$ 以约简后的第二个系数为步长，$y$ 以约简后的第一个系数为步长，方向相反地变化。这样就能滑动到想要的解。\n\n> **注意。** $y$ 的步长是 $\\frac{a}{\\gcd(a, b)}$，而不是 $a$ 本身。当最大公因数大于 $1$ 时，以 $a$ 为步长会跳过一些解。",
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
    const ys = Array.from({ length: k + 1 }, (_, i) => givenY + i * u).join(", ");
    const par = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    return numberProblem({
      prompt: t(
        `Given $${a}(${givenX}) + ${b}(${givenY}) = ${g}$, find the least positive value of $y$ among the integer solutions of $${a}x + ${b}y = ${g}$.`,
        `已知 $${a}(${givenX}) + ${b}(${givenY}) = ${g}$，在 $${a}x + ${b}y = ${g}$ 的整数解中，求 $y$ 的最小正值。`,
      ),
      answer: y,
      form: "integer",
      wrong: [u - y],
      mistakes: firstOf([
        why(y + u, `That is positive, but $${u}$ less is still positive: keep sliding.`, `它是正的，但再减 $${u}$ 仍是正的：继续滑动。`),
        why(v, `That is the step size for $x$, not a value of $y$.`, `这是 $x$ 的步长，而不是 $y$ 的值。`),
        why(
          -givenY,
          `Changing the sign of $y$ does not keep the sum; $y$ moves only in steps of $${u}$.`,
          `改变 $y$ 的符号不能保持总和；$y$ 只能以 $${u}$ 为步长变化。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the step sizes", "求步长"],
            t(
              `$${a} \\cdot ${v} = ${b} \\cdot ${u} = ${a * v}$, so subtracting $${v}$ from $x$ while adding $${u}$ to $y$ keeps the sum fixed, and every solution comes this way.`,
              `$${a} \\cdot ${v} = ${b} \\cdot ${u} = ${a * v}$，所以从 $x$ 减去 $${v}$、同时给 $y$ 加上 $${u}$，总和不变，而且所有解都这样得到。`,
            ),
          ],
          [
            ["Slide y up", "向上滑动 y"],
            t(
              `Adding $${u}$ to $y$ repeatedly gives $${ys}$. The first positive value is $y = ${y}$, with $x = ${givenX} - ${k * v} = ${x}$.`,
              `反复给 $y$ 加 $${u}$ 得 $${ys}$。第一个正值是 $y = ${y}$，此时 $x = ${givenX} - ${k * v} = ${x}$。`,
            ),
          ],
        ],
        t(
          `$${a} \\cdot ${par(x)} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${g}$, and $${y} - ${u} = ${y - u}$ is not positive.`,
          `$${a} \\cdot ${par(x)} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${g}$，而 $${y} - ${u} = ${y - u}$ 不是正数。`,
        ),
      ),
    });
  },
};

const largestUnmakeableAmount: KnowledgePointDef = {
  id: "the-largest-amount-that-two-stamps-cannot-make",
  title: t("The largest amount that two stamps cannot make", "两种邮票凑不出的最大面值"),
  explanation: t(
    "Strong induction suits claims that reach back several steps. If a run of consecutive amounts as long as one stamp's value can all be made, then every later amount can be made too, by adding that stamp to an amount in the run or later. So finding where the run begins also finds the last amount that cannot be made.\n\n> **Watch out.** Amounts near $ab$ can be made: $ab$ is $b$ stamps of $a$, and $ab - a$ is $b - 1$ of them. For coprime values the last gap is $ab - a - b$.",
    "强归纳法适合需要回溯好几步的命题。如果连续若干个面值都能凑出，且个数等于一种邮票的面值，那么之后的每个面值也都能凑出，只要在这段或更后的某个面值上再加一张这种邮票。所以找到这一段的起点，也就找到了最后一个凑不出的面值。\n\n> **注意。** 接近 $ab$ 的面值都能凑出：$ab$ 是 $b$ 张 $a$，$ab - a$ 是 $b - 1$ 张 $a$。对互素的面值，最后一个凑不出的是 $ab - a - b$。",
  ),
  generate(rng) {
    const pairs = [...Array(11).keys()]
      .map((i) => i + 3)
      .flatMap((a) => [...Array(16 - a).keys()].map((i) => [a, a + 1 + i] as const))
      .filter(([a, b]) => b <= 15 && gcd(a, b) === 1);
    const [a, b] = rng.pick(pairs);
    const answer = a * b - a - b;
    const make = (m: number) => {
      for (let y = 0; b * y <= m; y++) if ((m - b * y) % a === 0) return `${a} \\cdot ${(m - b * y) / a} + ${b} \\cdot ${y}`;
      return "";
    };
    return numberProblem({
      prompt: t(
        `Stamps come in values of ${a} and ${b}, with as many of each as needed. What is the largest whole amount that cannot be made exactly?`,
        `邮票有 ${a} 和 ${b} 两种面值，每种数量不限。不能恰好凑出的最大整数面值是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [],
      mistakes: firstOf([
        why(a * b, `That can be made: $${b}$ stamps of $${a}$.`, `它可以凑出：$${b}$ 张 $${a}$。`),
        why(a * b - a, `That can be made: $${b - 1}$ stamps of $${a}$.`, `它可以凑出：$${b - 1}$ 张 $${a}$。`),
        why(a * b - b, `That can be made: $${a - 1}$ stamps of $${b}$.`, `它可以凑出：$${a - 1}$ 张 $${b}$。`),
        why(answer + 1, `That can be made: $${answer + 1} = ${make(answer + 1)}$.`, `它可以凑出：$${answer + 1} = ${make(answer + 1)}$。`),
      ]),
      solution: walked(
        [
          [
            [`Show ${answer} cannot be made`, `说明 ${answer} 凑不出`],
            t(
              `If $${answer} = ${a}x + ${b}y$ with $x, y \\ge 0$, then $${a}(x + 1) + ${b}(y + 1) = ${a * b}$. So $${b} \\mid x + 1$ and $${a} \\mid y + 1$, which forces $x + 1 \\ge ${b}$ and $y + 1 \\ge ${a}$, and the left side is at least $${2 * a * b}$, a contradiction.`,
              `若 $${answer} = ${a}x + ${b}y$，其中 $x, y \\ge 0$，则 $${a}(x + 1) + ${b}(y + 1) = ${a * b}$。于是 $${b} \\mid x + 1$，$${a} \\mid y + 1$，迫使 $x + 1 \\ge ${b}$，$y + 1 \\ge ${a}$，左边至少是 $${2 * a * b}$，矛盾。`,
            ),
          ],
          [
            ["Show every larger amount can be made", "说明更大的面值都能凑出"],
            t(
              `The $${a}$ amounts from $${answer + 1}$ to $${answer + a}$ can each be made, and strong induction adds a stamp of $${a}$ to reach every amount after them.`,
              `从 $${answer + 1}$ 到 $${answer + a}$ 的 $${a}$ 个面值都能凑出，再用强归纳法加一张 $${a}$ 的邮票，就能得到之后的每个面值。`,
            ),
          ],
        ],
        t(
          `The run begins with $${answer + 1} = ${make(answer + 1)}$ and $${answer + 2} = ${make(answer + 2)}$.`,
          `这一段以 $${answer + 1} = ${make(answer + 1)}$ 和 $${answer + 2} = ${make(answer + 2)}$ 开始。`,
        ),
      ),
    });
  },
};

const termsOutsideABand: KnowledgePointDef = {
  id: "counting-the-terms-outside-an-epsilon-band",
  title: t("Counting the terms outside an epsilon band", "数 $\\varepsilon$ 带之外的项"),
  explanation: t(
    "A null sequence is one that, for every positive tolerance, has only finitely many terms outside the band around zero. Saying that all terms from some index on are inside is the same as saying that only a finite number stay out. For a decreasing sequence, these outside terms are exactly the first ones, so they can be counted by solving one inequality. For $a_n = \\frac{2}{n + 1}$ and $\\varepsilon = \\frac{1}{5}$: $\\frac{2}{n + 1} \\ge \\frac{1}{5}$ means $n + 1 \\le 10$, so $n \\le 9$, and $9$ terms stay out.\n\n> **Watch out.** Solve for $n$ itself, not for $n$ plus the shift in the denominator, and keep the boundary: a term exactly equal to $\\varepsilon$ is not inside the open band.",
    "零序列是指，对每个正的容许误差，零附近的带之外只有有限多项。说从某一项起所有项都在带内，和说只有有限项留在带外，是一回事。对递减序列，带外的项恰好是最前面的那些，所以解一个不等式就能数出它们。对 $a_n = \\frac{2}{n + 1}$ 和 $\\varepsilon = \\frac{1}{5}$：$\\frac{2}{n + 1} \\ge \\frac{1}{5}$ 即 $n + 1 \\le 10$，所以 $n \\le 9$，有 $9$ 项留在带外。\n\n> **注意。** 要解出 $n$ 本身，而不是 $n$ 加上分母中的平移量；还要保留边界：恰好等于 $\\varepsilon$ 的项不在开带之内。",
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
      wrong: [answer + 1],
      mistakes: firstOf([
        why(reach, `That is the bound on $n + ${s}$, not on $n$.`, `这是 $n + ${s}$ 的上界，而不是 $n$ 的上界。`),
        why(
          answer - 1,
          "That drops the term exactly equal to $\\varepsilon$; the inequality allows equality.",
          "这去掉了恰好等于 $\\varepsilon$ 的那一项；不等式允许取等号。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Write the inequality", "写出不等式"],
            t(
              `Every term is positive, so the condition is $${term} \\ge \\dfrac{1}{${k}}$, that is $n + ${s} \\le ${a} \\cdot ${k} = ${reach}$.`,
              `每一项都是正的，所以条件是 $${term} \\ge \\dfrac{1}{${k}}$，即 $n + ${s} \\le ${a} \\cdot ${k} = ${reach}$。`,
            ),
          ],
          [
            ["Solve for n", "解出 n"],
            t(
              `$n \\le ${reach} - ${s} = ${answer}$, so $n = 1, \\dots, ${answer}$: ${count(answer, "integer", "integers")}.`,
              `$n \\le ${reach} - ${s} = ${answer}$，所以 $n = 1, \\dots, ${answer}$：共 ${answer} 个。`,
            ),
          ],
        ],
        t(
          `$a_{${answer}} = \\dfrac{${a}}{${reach}} = \\dfrac{1}{${k}}$ is still out, while $a_{${answer + 1}} = \\dfrac{${a}}{${reach + 1}} < \\dfrac{1}{${k}}$ is in.`,
          `$a_{${answer}} = \\dfrac{${a}}{${reach}} = \\dfrac{1}{${k}}$ 仍在带外，而 $a_{${answer + 1}} = \\dfrac{${a}}{${reach + 1}} < \\dfrac{1}{${k}}$ 在带内。`,
        ),
      ),
    });
  },
};

const increasingFunctions: KnowledgePointDef = {
  id: "counting-strictly-increasing-functions",
  title: t("Counting strictly increasing functions", "数严格递增函数"),
  explanation: t(
    "A strictly increasing function between sets of integers is automatically injective, because different inputs have different outputs. It is also fixed by its range, since the outputs must appear in increasing order, leaving just one way to assign them. So choosing such a function is the same as choosing its set of outputs, which is a subset rather than an arrangement. From $\\{1, 2\\}$ to $\\{1, 2, 3, 4\\}$ there are $\\binom{4}{2} = 6$: the range $\\{2, 4\\}$, for instance, gives only $f(1) = 2$, $f(2) = 4$.\n\n> **Watch out.** Do not multiply by the orders of the outputs: only the increasing order is allowed, so each set of outputs gives exactly one function.",
    "整数集之间的严格递增函数自动是单射，因为不同的输入有不同的输出。它也由值域决定，因为输出必须按递增顺序排列，只有一种分配方式。所以选这样的函数就等于选它的输出集合，这是一个子集，而不是一种排列。从 $\\{1, 2\\}$ 到 $\\{1, 2, 3, 4\\}$ 共有 $\\binom{4}{2} = 6$ 个：例如值域 $\\{2, 4\\}$ 只给出 $f(1) = 2$，$f(2) = 4$。\n\n> **注意。** 不要再乘以输出的排列数：只允许递增的顺序，所以每个输出集合恰好给出一个函数。",
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
      wrong: [answer + 1],
      mistakes: firstOf([
        why(
          arrangements,
          "That counts every order of the outputs, but only the increasing order is allowed.",
          "这数的是输出的所有顺序，但只允许递增的顺序。",
        ),
        why(n ** m, "That counts every function, including ones that repeat or go down.", "这数的是所有函数，包括有重复值或会下降的函数。"),
        why(
          binom(n + m - 1, m),
          "That counts functions that never go down, which may repeat a value.",
          "这数的是从不下降的函数，它们可能重复取值。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Reduce to the range", "归结为值域"],
            t(
              `The ${m} outputs are different, and once the set of them is chosen they must go to $1, \\dots, ${m}$ in increasing order: one function per set.`,
              `${m} 个输出互不相同；一旦选定它们的集合，就必须按递增顺序分给 $1, \\dots, ${m}$：每个集合对应一个函数。`,
            ),
          ],
          [
            ["Count the ranges", "数值域"],
            t(
              `A set of ${m} outputs out of ${n} can be chosen in $\\binom{${n}}{${m}} = ${answer}$ ways.`,
              `从 ${n} 个中选 ${m} 个输出，有 $\\binom{${n}}{${m}} = ${answer}$ 种方式。`,
            ),
          ],
        ],
        t(
          `The $${m}! = ${factorial(m)}$ orders of each set give all $${arrangements}$ injections, and $${arrangements} \\div ${factorial(m)} = ${answer}$: exactly one order per set is increasing.`,
          `每个集合的 $${m}! = ${factorial(m)}$ 种顺序给出全部 $${arrangements}$ 个单射，而 $${arrangements} \\div ${factorial(m)} = ${answer}$：每个集合恰有一种顺序是递增的。`,
        ),
      ),
    });
  },
};

const fixedPointBijections: KnowledgePointDef = {
  id: "bijections-with-exactly-k-fixed-points",
  title: t("Bijections with a given number of fixed points", "恰有给定个数不动点的双射"),
  explanation: t(
    "A fixed point of a bijection is an input sent to itself. To count bijections with a given number of them, choose the fixed points, and then rearrange the rest so that nothing stays put. The bijections with no fixed point at all satisfy $D_m = (m - 1)(D_{m-1} + D_{m-2})$, with $D_0 = 1$ and $D_1 = 0$, which are found by following where one element goes. On $\\{1, 2, 3, 4\\}$ with exactly one fixed point: choose it in $4$ ways, then move the other three in $D_3 = 2$ ways, for $8$ bijections.\n\n> **Watch out.** The elements that are not chosen as fixed points must all move. Letting them be rearranged freely, with $(n - k)!$ ways, lets more fixed points in.",
    "双射的不动点是映到自身的输入。要数恰有给定个数不动点的双射，先选出不动点，再重排其余元素，使它们都不留在原位。完全没有不动点的双射满足 $D_m = (m - 1)(D_{m-1} + D_{m-2})$，其中 $D_0 = 1$，$D_1 = 0$，这是通过追踪一个元素的去向得到的。在 $\\{1, 2, 3, 4\\}$ 上恰有一个不动点：选它有 $4$ 种方式，再让其余三个都移动有 $D_3 = 2$ 种方式，共 $8$ 个双射。\n\n> **注意。** 没被选为不动点的元素必须全部移动。若让它们任意重排，即 $(n - k)!$ 种方式，就会混进更多的不动点。",
  ),
  generate(rng) {
    const n = rng.int(3, 9);
    const k = rng.int(0, n - 2);
    const left = n - k;
    const moved = derangements(left);
    const answer = binom(n, k) * moved;
    const table = [...Array(left + 1).keys()].map((i) => `D_{${i}} = ${derangements(i)}`).join(",\\ ");
    const approx = (factorial(left) / Math.E).toFixed(2);
    const choose: [[string, string], ReturnType<typeof t>][] =
      k === 0
        ? []
        : [
            [
              ["Choose the fixed points", "选出不动点"],
              t(
                `Choose the $${k}$ fixed ${k === 1 ? "point" : "points"}: $\\binom{${n}}{${k}} = ${binom(n, k)}$ ways.`,
                `选出 $${k}$ 个不动点：$\\binom{${n}}{${k}} = ${binom(n, k)}$ 种方式。`,
              ),
            ],
          ];
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
      wrong: [answer + 1],
      mistakes: firstOf([
        why(factorial(n), "That counts every bijection, whatever its fixed points.", "这数的是所有双射，不管它们有几个不动点。"),
        why(
          binom(n, k) * factorial(left),
          "That lets the other values be rearranged freely, so some of them may stay put.",
          "这让其余的值任意重排，于是其中一些可能留在原位。",
        ),
        why(
          moved,
          "That counts only the ways to move the rest; the fixed points must be chosen too.",
          "这只数了移动其余元素的方式；还要选出不动点。",
        ),
        why(
          factorial(left),
          "That rearranges the rest freely and forgets to choose the fixed points.",
          "这让其余元素任意重排，又忘了选出不动点。",
        ),
      ]),
      solution: walked(
        [
          ...choose,
          [
            ["Move the rest", "移动其余元素"],
            t(
              `${k === 0 ? `All $${n}$ values` : `The other $${left}$ values`} must move. From the recurrence: $${table}$.`,
              `${k === 0 ? `$${n}$ 个值都` : `其余 $${left}$ 个值都`}必须移动。由递推式：$${table}$。`,
            ),
          ],
          k === 0
            ? [["Read off the count", "读出个数"], t(`$D_{${n}} = ${answer}$.`, `$D_{${n}} = ${answer}$。`)]
            : [["Multiply", "相乘"], t(`$${binom(n, k)} \\cdot ${moved} = ${answer}$.`, `$${binom(n, k)} \\cdot ${moved} = ${answer}$。`)],
        ],
        t(
          `$D_m$ is the whole number nearest to $\\frac{m!}{e}$, and $\\frac{${left}!}{e} \\approx ${approx}$, which rounds to $${moved}$.`,
          `$D_m$ 是最接近 $\\frac{m!}{e}$ 的整数，而 $\\frac{${left}!}{e} \\approx ${approx}$，四舍五入正是 $${moved}$。`,
        ),
      ),
    });
  },
};

const reducedFractions: KnowledgePointDef = {
  id: "counting-reduced-fractions-by-denominator",
  title: t("Counting reduced fractions by denominator", "按分母数既约分数"),
  explanation: t(
    "The rationals are countable because they can be listed by denominator, and each denominator contributes only finitely many fractions to a bounded interval. Each rational has exactly one form in lowest terms, so nothing is counted twice. In a unit interval, the number of reduced fractions with a given denominator is the number of numerators coprime to it, which is Euler's totient of that denominator. In $(0, 1]$ with denominator $6$: only $\\frac{1}{6}$ and $\\frac{5}{6}$, so $\\varphi(6) = 2$.\n\n> **Watch out.** Count only numerators coprime to the denominator: $\\frac{2}{6}$ is $\\frac{1}{3}$, which belongs to the denominator $3$.",
    "有理数可数，是因为可以按分母把它们列出来，而每个分母在有界区间内只贡献有限多个分数。每个有理数恰有一种既约形式，所以不会重复计算。在单位区间内，给定分母的既约分数个数，等于与分母互素的分子个数，也就是该分母的欧拉函数值。在 $(0, 1]$ 中分母为 $6$ 的：只有 $\\frac{1}{6}$ 和 $\\frac{5}{6}$，所以 $\\varphi(6) = 2$。\n\n> **注意。** 只数与分母互素的分子：$\\frac{2}{6}$ 就是 $\\frac{1}{3}$，它属于分母 $3$。",
  ),
  generate(rng) {
    if (rng.pick([true, false])) {
      const top = rng.int(4, 25);
      const parts = [...Array(top).keys()].map((i) => totient(i + 1));
      const answer = parts.reduce((sum, v) => sum + v, 0);
      const lastNumerators = [...Array(top).keys()].map((i) => i + 1).filter((i) => gcd(i, top) === 1);
      return numberProblem({
        prompt: t(
          `How many rational numbers in $(0, 1]$ have a denominator of at most ${top} in lowest terms?`,
          `$(0, 1]$ 中有多少个有理数的既约形式的分母不超过 ${top}？`,
        ),
        answer,
        form: "integer",
        wrong: [answer + 1],
        mistakes: firstOf([
          why(
            (top * (top + 1)) / 2,
            "That counts fractions that are not in lowest terms, so some numbers are counted twice.",
            "这数进了不是既约形式的分数，所以有些数被重复计算。",
          ),
          why(
            answer - 1,
            "$1 = \\frac{1}{1}$ is in $(0, 1]$ and counts for the denominator $1$.",
            "$1 = \\frac{1}{1}$ 在 $(0, 1]$ 中，算作分母 $1$ 的分数。",
          ),
          why(top, "Each denominator can give more than one fraction.", "每个分母可以给出不止一个分数。"),
        ]),
        solution: walked(
          [
            [
              ["Count by denominator", "按分母计数"],
              t(
                `Denominator $q$ gives one reduced fraction for each numerator from $1$ to $q$ coprime to $q$: $\\varphi(q)$ fractions.`,
                `分母 $q$ 对 $1$ 到 $q$ 中每个与 $q$ 互素的分子给出一个既约分数：共 $\\varphi(q)$ 个。`,
              ),
            ],
            [
              ["Add them", "相加"],
              t(
                `From $q = 1$ to $q = ${top}$: $${parts.join(" + ")} = ${answer}$.`,
                `从 $q = 1$ 到 $q = ${top}$：$${parts.join(" + ")} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `The last term: the numerators coprime to $${top}$ are $${lastNumerators.join(", ")}$, which is $${lastNumerators.length}$ of them, matching $\\varphi(${top}) = ${parts[top - 1]}$.`,
            `最后一项：与 $${top}$ 互素的分子是 $${lastNumerators.join(", ")}$，共 $${lastNumerators.length}$ 个，与 $\\varphi(${top}) = ${parts[top - 1]}$ 一致。`,
          ),
        ),
      });
    }
    const q = rng.int(3, 30);
    const width = rng.int(1, 5);
    const phi = totient(q);
    const answer = width * phi;
    const numerators = [...Array(q).keys()].map((i) => i + 1).filter((i) => gcd(i, q) === 1);
    return numberProblem({
      prompt: t(
        `How many rational numbers in $(0, ${width}]$ have denominator exactly ${q} in lowest terms?`,
        `$(0, ${width}]$ 中有多少个有理数的既约形式的分母恰好是 ${q}？`,
      ),
      answer,
      form: "integer",
      wrong: [width * phi + 1],
      mistakes: firstOf([
        why(
          width * q,
          "That counts every numerator, but a numerator sharing a factor with the denominator gives a smaller denominator.",
          "这数了所有分子，但与分母有公因数的分子会给出更小的分母。",
        ),
        why(width * (q - 1), `Not every numerator below $${q}$ is coprime to $${q}$.`, `并非小于 $${q}$ 的每个分子都与 $${q}$ 互素。`),
        ...(width === 1 ? [] : [why(phi, "That counts only the first unit interval.", "这只数了第一个单位区间。")]),
      ]),
      solution: walked(
        [
          [
            ["One unit interval", "一个单位区间"],
            t(
              `In $(0, 1]$, $\\frac{p}{${q}}$ is in lowest terms exactly when $p$ is coprime to $${q}$: $p = ${numerators.join(", ")}$, so $\\varphi(${q}) = ${phi}$ fractions.`,
              `在 $(0, 1]$ 中，$\\frac{p}{${q}}$ 是既约的当且仅当 $p$ 与 $${q}$ 互素：$p = ${numerators.join(", ")}$，所以有 $\\varphi(${q}) = ${phi}$ 个分数。`,
            ),
          ],
          [
            ["All the unit intervals", "所有单位区间"],
            width === 1
              ? t(`The interval is $(0, 1]$ itself, so the count is $${answer}$.`, `区间就是 $(0, 1]$ 本身，所以个数是 $${answer}$。`)
              : t(
                  `Adding $${q}$ to a numerator keeps it coprime to $${q}$, so each of the $${width}$ unit intervals holds $${phi}$: $${width} \\cdot ${phi} = ${answer}$.`,
                  `分子加上 $${q}$ 仍与 $${q}$ 互素，所以 $${width}$ 个单位区间各有 $${phi}$ 个：$${width} \\cdot ${phi} = ${answer}$。`,
                ),
          ],
        ],
        t(
          `$\\frac{1}{${q}}$ is counted and $\\frac{${q}}{${q}} = 1$ is not, since in lowest terms it has denominator $1$.`,
          `$\\frac{1}{${q}}$ 被计入，而 $\\frac{${q}}{${q}} = 1$ 不计入，因为它的既约形式分母是 $1$。`,
        ),
      ),
    });
  },
};

const cycleLengthOfPowers: KnowledgePointDef = {
  id: "the-cycle-length-of-powers-modulo-n",
  title: t("The cycle length of powers modulo $n$", "模 $n$ 的幂的循环长度"),
  explanation: t(
    "Because a congruence can be multiplied by the same number on both sides, each power's remainder is decided by the one before it. Once a power of a number coprime to the modulus reaches remainder $1$, the next power repeats the base, and the whole cycle starts over. This is why very large powers can be reduced by working with the length of that cycle.\n\n> **Watch out.** The cycle length divides $\\varphi(m)$ but is often smaller, so neither $\\varphi(m)$ nor $m - 1$ can be taken on trust. List the remainders until the first $1$ appears.",
    "由于同余式两边可以乘同一个数，每个幂的余数都由前一个幂的余数决定。与模互素的数的某个幂的余数一旦为 $1$，下一个幂就回到底数，整个循环重新开始。这就是可以利用循环长度化简很大的幂的原因。\n\n> **注意。** 循环长度整除 $\\varphi(m)$，但常常更小，所以不能想当然地取 $\\varphi(m)$ 或 $m - 1$。要把余数列出来，直到第一次出现 $1$。",
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
      mistakes: firstOf([
        why(
          totient(m),
          `$\\varphi(${m}) = ${totient(m)}$ is a multiple of the cycle length; the first power $\\equiv 1$ can come sooner.`,
          `$\\varphi(${m}) = ${totient(m)}$ 是循环长度的倍数；第一个 $\\equiv 1$ 的幂可能更早出现。`,
        ),
        why(
          m - 1,
          `$${m - 1}$ is not where the cycle has to close; list the remainders to find the first $1$.`,
          `循环不一定在 $${m - 1}$ 处闭合；列出余数，找到第一个 $1$。`,
        ),
        why(answer + 1, "That counts one step past the first remainder $1$.", "这数到了第一个余数 $1$ 之后的一步。"),
      ]),
      solution: walked(
        [
          [
            ["List the remainders", "列出余数"],
            t(`Multiply by $${a}$ and reduce modulo $${m}$ at each step:`, `每步乘以 $${a}$ 并对 $${m}$ 取模：`),
            remainders.map((r, i) => `${a}^{${i + 1}} \\equiv ${r}`),
          ],
          [
            ["Find the first 1", "找出第一个 1"],
            t(
              `The first remainder $1$ comes at the power $${answer}$, so $k = ${answer}$.`,
              `余数 $1$ 第一次出现在第 $${answer}$ 次幂，所以 $k = ${answer}$。`,
            ),
          ],
        ],
        t(
          `One more factor gives $${a}^{${answer + 1}} \\equiv 1 \\cdot ${a} \\equiv ${a % m}$, the first remainder again, so the cycle starts over.`,
          `再乘一次得 $${a}^{${answer + 1}} \\equiv 1 \\cdot ${a} \\equiv ${a % m}$，又回到第一个余数，循环重新开始。`,
        ),
      ),
    });
  },
};

const atMostOnePartner: KnowledgePointDef = {
  id: "counting-relations-with-at-most-one-partner",
  title: t("Counting relations with at most one partner", "数至多有一个对应元素的关系"),
  explanation: t(
    'A relation is a function when each element of the first set has exactly one partner. Relaxing this to at most one partner gives each element one more option, namely having no partner at all. The choices are still independent, so the count is again a power. If the elements that do have partners are specified, choose those first and then their partners. From a set of $2$ elements to a set of $3$, there are $(3 + 1)^2 = 16$ such relations.\n\n> **Watch out.** "No partner" is one extra choice per element, so the base is $n + 1$, not $n$. And the exponent is the size of the first set, the one whose elements choose.',
    "当第一个集合的每个元素恰有一个对应元素时，关系就是函数。把条件放宽为至多一个对应元素，每个元素就多了一种选择，也就是没有对应元素。这些选择仍然相互独立，所以个数还是一个幂。如果规定了哪些元素有对应元素的个数，就先选出这些元素，再选它们的对应元素。从 $2$ 元集合到 $3$ 元集合，这样的关系有 $(3 + 1)^2 = 16$ 个。\n\n> **注意。** “没有对应元素”是每个元素多出的一种选择，所以底数是 $n + 1$ 而不是 $n$。指数是第一个集合的大小，也就是做选择的那些元素的个数。",
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
        wrong: [m * n],
        mistakes: firstOf([
          why(
            n ** m,
            `That counts the functions, where every element has a partner; "no partner" is allowed too.`,
            "这数的是函数，其中每个元素都有对应元素；但也允许没有对应元素。",
          ),
          why(
            2 ** (m * n),
            "That counts all relations, including those with two partners for one element.",
            "这数的是所有关系，包括一个元素有两个对应元素的情形。",
          ),
          why(
            (m + 1) ** n,
            "The exponent belongs to the first set, whose elements make the choices.",
            "指数应是第一个集合的大小，是它的元素在做选择。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Count one element's choices", "数一个元素的选择"],
              t(
                `Each element picks one of $${n}$ partners or none: $${n} + 1 = ${n + 1}$ choices.`,
                `每个元素从 $${n}$ 个对应元素中选一个，或者不选：$${n} + 1 = ${n + 1}$ 种选择。`,
              ),
            ],
            [
              ["Multiply", "相乘"],
              t(
                `The $${m}$ elements choose independently: $${n + 1}^{${m}} = ${answer}$.`,
                `$${m}$ 个元素独立选择：$${n + 1}^{${m}} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `Sorting by how many elements have partners: $${[...Array(m + 1).keys()].map((d) => `\\binom{${m}}{${d}} ${n}^{${d}}`).join(" + ")} = ${answer}$, by the binomial theorem.`,
            `按有对应元素的个数分类：$${[...Array(m + 1).keys()].map((d) => `\\binom{${m}}{${d}} ${n}^{${d}}`).join(" + ")} = ${answer}$，由二项式定理。`,
          ),
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
      mistakes: firstOf([
        why(
          n ** d,
          `That fixes which elements have partners; they can be any $${d}$ of the $${m}$.`,
          `这固定了哪些元素有对应元素；它们可以是 $${m}$ 个中的任意 $${d}$ 个。`,
        ),
        why((n + 1) ** m, "That counts the relations with any number of elements having partners.", "这数的是有对应元素的个数任意的关系。"),
        why(
          binom(m * n, d),
          `That chooses $${d}$ pairs freely, which can give one element two partners.`,
          `这是任意选 $${d}$ 个有序对，可能让一个元素有两个对应元素。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Choose the elements", "选出元素"],
            t(
              `The $${d}$ elements with partners: $\\binom{${m}}{${d}} = ${binom(m, d)}$ ways.`,
              `有对应元素的 $${d}$ 个元素：$\\binom{${m}}{${d}} = ${binom(m, d)}$ 种方式。`,
            ),
          ],
          [
            ["Choose their partners", "选出对应元素"],
            t(
              `Each picks one of $${n}$: $${n}^{${d}} = ${n ** d}$ ways.`,
              `每个元素从 $${n}$ 个中选一个：$${n}^{${d}} = ${n ** d}$ 种方式。`,
            ),
          ],
          [["Multiply", "相乘"], t(`$${binom(m, d)} \\cdot ${n ** d} = ${answer}$.`, `$${binom(m, d)} \\cdot ${n ** d} = ${answer}$。`)],
        ],
        t(
          `The other $${m - d}$ ${m - d === 1 ? "element has" : "elements have"} no partner, so nothing more is chosen; adding over every number of elements with partners gives the total $${n + 1}^{${m}}$.`,
          `其余 $${m - d}$ 个元素没有对应元素，不需要再选；对所有可能的个数求和，得到总数 $${n + 1}^{${m}}$。`,
        ),
      ),
    });
  },
};

const relationsByClassCount: KnowledgePointDef = {
  id: "equivalence-relations-with-a-given-number-of-classes",
  title: t("Equivalence relations with a given number of classes", "恰有给定个数等价类的等价关系"),
  explanation: t(
    "Equivalence relations on a set correspond exactly to partitions of it, because a relation's classes form a partition and a partition's blocks define a relation. To count them by number of classes, follow the last element. It either forms a class alone or joins one of the classes of a partition of the other elements. This gives the recurrence $S(n, k) = S(n - 1, k - 1) + k \\cdot S(n - 1, k)$. For example, $S(4, 2) = S(3, 1) + 2 \\cdot S(3, 2) = 1 + 2 \\cdot 3 = 7$.\n\n> **Watch out.** The classes have no labels, so do not multiply by $k!$, and do not count $k^n$ assignments to $k$ labelled boxes, which may leave a box empty.",
    "集合上的等价关系和它的划分一一对应，因为关系的等价类构成划分，而划分的块定义一个关系。要按等价类的个数来数，就追踪最后一个元素。它要么单独成为一类，要么加入其余元素的某个划分的一类。这就给出递推式 $S(n, k) = S(n - 1, k - 1) + k \\cdot S(n - 1, k)$。例如 $S(4, 2) = S(3, 1) + 2 \\cdot S(3, 2) = 1 + 2 \\cdot 3 = 7$。\n\n> **注意。** 等价类没有标号，所以不要乘以 $k!$，也不要数成把元素放进 $k$ 个有标号盒子的 $k^n$ 种方式，那样还可能有空盒。",
  ),
  generate(rng) {
    const n = rng.int(3, 10);
    const k = rng.int(2, n - 1);
    const answer = stirling(n, k);
    const alone = stirling(n - 1, k - 1);
    const joining = stirling(n - 1, k);
    const surjections = [...Array(k + 1).keys()].reduce((sum, j) => sum + (-1) ** j * binom(k, j) * (k - j) ** n, 0);
    return numberProblem({
      prompt: t(
        `How many equivalence relations on a set of ${n} elements have exactly ${k} equivalence classes?`,
        `${n} 元集合上有多少个等价关系恰有 ${k} 个等价类？`,
      ),
      answer,
      form: "integer",
      mistakes: firstOf([
        why(
          binom(n, k),
          `That chooses $${k}$ elements; a partition places every element in some class.`,
          `这是选出 $${k}$ 个元素；划分要把每个元素都放进某个类。`,
        ),
        why(
          k ** n,
          "That counts assignments to labelled classes, some of which may be empty.",
          "这数的是放进有标号类的方式，其中有的类可能为空。",
        ),
        why(
          answer * factorial(k),
          "That labels the classes; the classes of a relation have no order.",
          "这给类加了标号；关系的等价类没有顺序。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Follow the last element", "追踪最后一个元素"],
            t(
              `It is alone, leaving $${k - 1}$ ${k - 1 === 1 ? "class" : "classes"} for the other $${n - 1}$ elements, or it joins one of the $${k}$ classes of a partition of the others: $S(${n}, ${k}) = S(${n - 1}, ${k - 1}) + ${k} \\cdot S(${n - 1}, ${k})$.`,
              `它要么单独成类，其余 $${n - 1}$ 个元素分成 $${k - 1}$ 类；要么加入其余元素某个划分的 $${k}$ 个类之一：$S(${n}, ${k}) = S(${n - 1}, ${k - 1}) + ${k} \\cdot S(${n - 1}, ${k})$。`,
            ),
          ],
          [
            ["Use the smaller counts", "代入较小的个数"],
            t(
              `$S(${n - 1}, ${k - 1}) = ${alone}$ and $S(${n - 1}, ${k}) = ${joining}$, so $${alone} + ${k} \\cdot ${joining} = ${answer}$.`,
              `$S(${n - 1}, ${k - 1}) = ${alone}$，$S(${n - 1}, ${k}) = ${joining}$，所以 $${alone} + ${k} \\cdot ${joining} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Onto maps from the $${n}$ elements to $${k}$ labelled classes number $\\sum_{j=0}^{${k}} (-1)^j \\binom{${k}}{j} (${k} - j)^{${n}} = ${surjections}$, and $${k}! \\cdot ${answer} = ${surjections}$ as well.`,
          `从 $${n}$ 个元素到 $${k}$ 个有标号类的满射有 $\\sum_{j=0}^{${k}} (-1)^j \\binom{${k}}{j} (${k} - j)^{${n}} = ${surjections}$ 个，而 $${k}! \\cdot ${answer} = ${surjections}$，一致。`,
        ),
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
    "The truth set of a predicate over the integers is often a run of consecutive integers. When a quadratic with positive leading coefficient factors as $(x - r)(x - s)$, it is negative exactly between its roots. The inequality $\\le 0$ includes both roots, and the strict inequality $< 0$ leaves them out. So the two versions differ by exactly two elements, which is why one must read the sign carefully before counting. For $x^2 - 5x + 4 = (x - 1)(x - 4)$, the predicate $\\le 0$ holds for $1, 2, 3, 4$ and $< 0$ only for $2, 3$.\n\n> **Watch out.** The integers from $r$ to $s$ number $s - r + 1$, not $s - r$; for the strict inequality take away both roots.",
    "整数上谓词的真值集常常是一段连续的整数。当首项系数为正的二次式分解为 $(x - r)(x - s)$ 时，它恰好在两根之间为负。不等式 $\\le 0$ 包含两个根，严格不等式 $< 0$ 不包含。所以两种情况恰好差两个元素，这就是为什么计数前要仔细看符号。对 $x^2 - 5x + 4 = (x - 1)(x - 4)$，谓词 $\\le 0$ 对 $1, 2, 3, 4$ 成立，$< 0$ 只对 $2, 3$ 成立。\n\n> **注意。** 从 $r$ 到 $s$ 的整数有 $s - r + 1$ 个，不是 $s - r$ 个；严格不等式还要去掉两个根。",
  ),
  generate(rng) {
    const r = rng.int(-9, 6);
    const s = r + rng.int(2, 9);
    const strict = rng.pick([true, false]);
    const answer = strict ? s - r - 1 : s - r + 1;
    const form = poly([1, "x^2"], [-(r + s), "x"], [r * s, ""]);
    const factored = `(${poly([1, "x"], [-r, ""])})(${poly([1, "x"], [-s, ""])})`;
    const sign = strict ? "<" : "\\le";
    const [from, to] = strict ? [r + 1, s - 1] : [r, s];
    return numberProblem({
      prompt: t(`How many integers $x$ make the predicate $${form} ${sign} 0$ true?`, `有多少个整数 $x$ 使谓词 $${form} ${sign} 0$ 为真？`),
      answer,
      form: "integer",
      wrong: [s - r + 2, Math.abs(s) + 1],
      mistakes: [
        why(
          s - r,
          `That subtracts the roots; the integers from $${from}$ to $${to}$ number $${to} - (${from}) + 1$.`,
          `这只是两根相减；从 $${from}$ 到 $${to}$ 的整数有 $${to} - (${from}) + 1$ 个。`,
        ),
        strict
          ? why(
              s - r + 1,
              "That includes the roots, where the quadratic equals $0$ and is not less than $0$.",
              "这包含了两个根，在那里二次式等于 $0$，并不小于 $0$。",
            )
          : why(
              s - r - 1,
              "That leaves out the roots, where the quadratic equals $0$ and so satisfies $\\le 0$.",
              "这漏掉了两个根，在那里二次式等于 $0$，满足 $\\le 0$。",
            ),
      ],
      solution: walked(
        [
          [
            ["Factor", "因式分解"],
            t(
              `$${form} = ${factored}$, with roots $${r}$ and $${s}$; it is negative between them and positive outside.`,
              `$${form} = ${factored}$，根为 $${r}$ 和 $${s}$；在两根之间为负，两根之外为正。`,
            ),
          ],
          [
            ["Count the integers", "数出整数"],
            t(
              `${strict ? "The roots, where it equals $0$, are excluded" : "The roots, where it equals $0$, are included"}, so $x$ runs from $${from}$ to $${to}$: $${to} - (${from}) + 1 = ${answer}$ integers.`,
              `${strict ? "根处等于 $0$，不包含在内" : "根处等于 $0$，包含在内"}，所以 $x$ 从 $${from}$ 到 $${to}$：$${to} - (${from}) + 1 = ${answer}$ 个整数。`,
            ),
          ],
        ],
        t(
          `Try $x = ${r + 1}$: $(${1})(${r + 1 - s}) = ${r + 1 - s} < 0$, so it counts. Try $x = ${s + 1}$: $(${s + 1 - r})(1) = ${s + 1 - r} > 0$, so it does not.`,
          `试 $x = ${r + 1}$：$(${1})(${r + 1 - s}) = ${r + 1 - s} < 0$，算在内。试 $x = ${s + 1}$：$(${s + 1 - r})(1) = ${s + 1 - r} > 0$，不算。`,
        ),
      ),
    });
  },
};

const notBetweenCount: KnowledgePointDef = {
  id: "counting-the-values-outside-a-negated-conjunction",
  title: t("Counting the values outside a negated conjunction", "计算否定合取之外的值"),
  explanation: t(
    "By De Morgan's law, the negation of $x > a \\land x < b$ is $x \\le a \\lor x \\ge b$. Notice that the strict inequalities become non-strict, so that $a$ and $b$ themselves satisfy the negation. On a finite domain, the truth set of a negation is the complement of the original truth set. So it is usually quickest to count the values that satisfy the conjunction, and then to subtract this from the size of the domain. On $\\{1, \\dots, 20\\}$, $x > 5 \\land x < 9$ holds for $6, 7, 8$, so its negation holds for $20 - 3 = 17$ values.\n\n> **Watch out.** $a$ and $b$ themselves make the negation true: the negation of $x > a$ is $x \\le a$, which includes $a$.",
    "由德摩根律，$x > a \\land x < b$ 的否定是 $x \\le a \\lor x \\ge b$。注意严格不等式变成了非严格的，所以 $a$ 和 $b$ 本身满足否定。在有限论域上，否定的真值集是原真值集的补集。所以通常最快的方法是数满足合取的值，再从论域的大小中减去。在 $\\{1, \\dots, 20\\}$ 上，$x > 5 \\land x < 9$ 对 $6, 7, 8$ 成立，所以它的否定对 $20 - 3 = 17$ 个值成立。\n\n> **注意。** $a$ 和 $b$ 本身使否定为真：$x > a$ 的否定是 $x \\le a$，包含 $a$。",
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
      mistakes: [
        why(inside, "That counts the values where the conjunction holds, not its negation.", "这数的是合取成立的值，不是它的否定。"),
        why(answer - 2, `That leaves out ${a} and ${b}; both satisfy the negation.`, `这漏掉了 ${a} 和 ${b}；它们都满足否定。`),
        why(
          answer - 1,
          `That leaves out one of ${a} and ${b}; both satisfy the negation.`,
          `这漏掉了 ${a} 和 ${b} 中的一个；它们都满足否定。`,
        ),
        why(
          n,
          `That counts the whole domain; the values strictly between ${a} and ${b} make the negation false.`,
          `这数了整个论域；严格介于 ${a} 和 ${b} 之间的值使否定为假。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Count the conjunction", "数出合取的值"],
            t(
              `$x > ${a} \\land x < ${b}$ holds for $${a + 1}, \\dots, ${b - 1}$: $${inside}$ values.`,
              `$x > ${a} \\land x < ${b}$ 对 $${a + 1}, \\dots, ${b - 1}$ 成立：$${inside}$ 个值。`,
            ),
          ],
          [
            ["Take the complement", "取补集"],
            t(
              `The negation holds for the other $${n} - ${inside} = ${answer}$ values.`,
              `否定对其余 $${n} - ${inside} = ${answer}$ 个值成立。`,
            ),
          ],
        ],
        t(
          `Use De Morgan's law instead: $x \\le ${a}$ gives ${a} values and $x \\ge ${b}$ gives $${n} - ${b} + 1 = ${n - b + 1}$, together $${a} + ${n - b + 1} = ${answer}$.`,
          `改用德摩根律：$x \\le ${a}$ 有 ${a} 个值，$x \\ge ${b}$ 有 $${n} - ${b} + 1 = ${n - b + 1}$ 个，合计 $${a} + ${n - b + 1} = ${answer}$。`,
        ),
      ),
    });
  },
};

const conditionalFromSizes: KnowledgePointDef = {
  id: "the-size-of-the-truth-set-of-a-conditional",
  title: t("The size of the truth set of a conditional", "条件句真值集的大小"),
  explanation: t(
    "The conditional $P(x) \\Rightarrow Q(x)$ fails only where $P$ holds and $Q$ does not. In terms of sets, its truth set is the complement of $P \\setminus Q$. The number of elements in $P \\setminus Q$ is $|P| - |P \\cap Q|$, so the conditional holds for all the remaining elements of the domain. In a domain of $30$ where $P$ holds for $10$ and both hold for $4$, it fails for $6$ elements and holds for $24$.\n\n> **Watch out.** Elements outside $P$ all count as true, whether or not they lie in $Q$; that is the part easy to overlook.",
    "条件句 $P(x) \\Rightarrow Q(x)$ 只在 $P$ 成立而 $Q$ 不成立时为假。用集合的语言，它的真值集是 $P \\setminus Q$ 的补集。$P \\setminus Q$ 的元素个数是 $|P| - |P \\cap Q|$，所以条件句对论域中所有其余元素成立。在 $30$ 个元素的论域中，若 $P$ 对 $10$ 个成立、两者都对 $4$ 个成立，则它对 $6$ 个元素为假，对 $24$ 个为真。\n\n> **注意。** $P$ 之外的元素都算真，不管它们是否在 $Q$ 中；这是容易忽略的部分。",
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
      wrong: [size - q + both],
      mistakes: [
        why(
          both,
          "That counts only where both hold; the elements outside $P$ make the conditional true as well.",
          "这只数了两者都成立的元素；$P$ 之外的元素也使条件句为真。",
        ),
        why(
          size - p,
          "That counts only the elements outside $P$; those where both hold make it true as well.",
          "这只数了 $P$ 之外的元素；两者都成立的元素也使它为真。",
        ),
        why(onlyP, "That counts the elements where the conditional is false.", "这数的是条件句为假的元素。"),
        why(
          size - both,
          "That takes away the elements where both hold, but the conditional is true there; it fails only where $P$ holds without $Q$.",
          "这去掉了两者都成立的元素，但条件句在那里为真；它只在 $P$ 成立而 $Q$ 不成立时为假。",
        ),
      ],
      solution: walked(
        [
          [
            ["Find where it fails", "找出为假之处"],
            t(
              `It fails where $P$ holds without $Q$: $${p} - ${both} = ${onlyP}$ elements.`,
              `它在 $P$ 成立而 $Q$ 不成立时为假：$${p} - ${both} = ${onlyP}$ 个元素。`,
            ),
          ],
          [
            ["Subtract", "相减"],
            t(`It is true for $${size} - ${onlyP} = ${answer}$ elements.`, `它对 $${size} - ${onlyP} = ${answer}$ 个元素为真。`),
          ],
        ],
        t(
          `Count the true elements directly: $${size} - ${p} = ${size - p}$ lie outside $P$ and ${both} satisfy both, together $${size - p} + ${both} = ${answer}$.`,
          `直接数为真的元素：$P$ 之外有 $${size} - ${p} = ${size - p}$ 个，两者都成立的有 ${both} 个，合计 $${size - p} + ${both} = ${answer}$。`,
        ),
      ),
    });
  },
};

const whereExistsFails: KnowledgePointDef = {
  id: "counting-the-values-where-an-inner-exists-fails",
  title: t("Counting the values where an inner exists fails", "计算内层存在量词不成立的值"),
  explanation: t(
    "To disprove $\\forall x\\,\\exists y\\,P(x, y)$, one needs an $x$ for which $\\forall y\\,\\neg P(x, y)$ holds, meaning that no $y$ works. So each value of $x$ is tested on its own. When $P$ says that $x + y = k$, the only possible partner is $y = k - x$, and the question is whether this number lies in the domain of $y$. With $x, y \\in \\{1, \\dots, 5\\}$ and $k = 8$, the partners of $x = 1, 2$ would be $7, 6$, outside the domain, so two values of $x$ have none.\n\n> **Watch out.** The partner must lie in the domain at both ends: $k - x$ can be too large as well as too small.",
    "要否定 $\\forall x\\,\\exists y\\,P(x, y)$，需要一个 $x$ 使 $\\forall y\\,\\neg P(x, y)$ 成立，也就是没有 $y$ 可行。所以要逐个检验 $x$ 的每个值。当 $P$ 表示 $x + y = k$ 时，唯一可能的搭档是 $y = k - x$，问题是这个数是否在 $y$ 的论域中。若 $x, y \\in \\{1, \\dots, 5\\}$，$k = 8$，则 $x = 1, 2$ 的搭档应是 $7, 6$，在论域之外，所以有两个 $x$ 没有搭档。\n\n> **注意。** 搭档必须两头都落在论域内：$k - x$ 可能太大，也可能太小。",
  ),
  generate(rng) {
    const n = rng.int(4, 20);
    const m = rng.int(4, 20);
    const k = rng.int(3, n + m);
    const has = (x: number) => k - x >= 1 && k - x <= m;
    const good = oneTo(n).filter(has).length;
    const answer = n - good;
    const lo = Math.max(1, k - m);
    const hi = Math.min(n, k - 1);
    const without = oneTo(n).find((x) => !has(x));
    return numberProblem({
      prompt: t(
        `Let $x$ range over $\\{1, \\dots, ${n}\\}$ and $y$ over $\\{1, \\dots, ${m}\\}$. For how many values of $x$ is $\\neg\\exists y\\,(x + y = ${k})$ true?`,
        `设 $x$ 取遍 $\\{1, \\dots, ${n}\\}$，$y$ 取遍 $\\{1, \\dots, ${m}\\}$。有多少个 $x$ 使 $\\neg\\exists y\\,(x + y = ${k})$ 为真？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.abs(n - m), answer + 1],
      mistakes: [
        why(
          good,
          "That counts the $x$ that do have a partner; the statement asks for those without one.",
          "这数的是有搭档的 $x$；命题问的是没有搭档的。",
        ),
        why(
          n,
          `That counts every $x$; some have the partner $y = ${k} - x$ in the domain.`,
          `这数了每个 $x$；有些 $x$ 的搭档 $y = ${k} - x$ 在论域内。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Find which $x$ have a partner", "找出有搭档的 $x$"],
            good === 0
              ? t(
                  `The only candidate is $y = ${k} - x$, and it would need $1 \\le ${k} - x \\le ${m}$; no $x$ in the domain manages that.`,
                  `唯一的候选是 $y = ${k} - x$，需要 $1 \\le ${k} - x \\le ${m}$；论域中没有 $x$ 做得到。`,
                )
              : t(
                  `The only candidate is $y = ${k} - x$, and $1 \\le ${k} - x \\le ${m}$ means $${k - m} \\le x \\le ${k - 1}$. Within the domain that is $x = ${lo}, \\dots, ${hi}$: $${good}$ values.`,
                  `唯一的候选是 $y = ${k} - x$，而 $1 \\le ${k} - x \\le ${m}$ 即 $${k - m} \\le x \\le ${k - 1}$。在论域内是 $x = ${lo}, \\dots, ${hi}$：$${good}$ 个值。`,
                ),
          ],
          [
            ["Count the rest", "数出其余的"],
            t(`$${n} - ${good} = ${answer}$ values of $x$ have no partner.`, `没有搭档的 $x$ 有 $${n} - ${good} = ${answer}$ 个。`),
          ],
        ],
        without === undefined
          ? t(
              `Test both ends: $x = 1$ has the partner $y = ${k - 1}$ and $x = ${n}$ has $y = ${k - n}$, both in $\\{1, \\dots, ${m}\\}$, so every $x$ has one.`,
              `检验两端：$x = 1$ 的搭档是 $y = ${k - 1}$，$x = ${n}$ 的搭档是 $y = ${k - n}$，都在 $\\{1, \\dots, ${m}\\}$ 中，所以每个 $x$ 都有搭档。`,
            )
          : t(
              `Test one of them: $x = ${without}$ would need $y = ${k - without}$, which is not in $\\{1, \\dots, ${m}\\}$, so indeed no $y$ works.`,
              `检验其中一个：$x = ${without}$ 需要 $y = ${k - without}$，它不在 $\\{1, \\dots, ${m}\\}$ 中，所以确实没有 $y$ 可行。`,
            ),
      ),
    });
  },
};

const oddExpressionPairs: KnowledgePointDef = {
  id: "counting-the-pairs-that-make-an-expression-odd",
  title: t("Counting the pairs that make an expression odd", "计算使表达式为奇数的数对"),
  explanation: t(
    "A proof about parity often starts by factoring. Since $mn + m = m(n + 1)$, the expression is a product, and a product is odd exactly when every factor is odd. So $m$ must be odd and $n + 1$ must be odd, which means that $n$ is even. These two conditions are independent of each other, so the number of pairs is a simple product of the number of odd $m$ and the number of even $n$. With $1 \\le m \\le 3$ and $1 \\le n \\le 4$: $m \\in \\{1, 3\\}$ and $n \\in \\{2, 4\\}$, so $2 \\cdot 2 = 4$ pairs.\n\n> **Watch out.** $n + 1$ is odd when $n$ is even. Requiring $n$ itself to be odd makes $n + 1$ even and the product even.",
    "关于奇偶性的证明常常从因式分解开始。由于 $mn + m = m(n + 1)$，表达式是乘积，而乘积为奇数当且仅当每个因子都是奇数。所以 $m$ 必须是奇数，$n + 1$ 必须是奇数，也就是 $n$ 是偶数。这两个条件相互独立，所以数对的个数就是奇数 $m$ 的个数与偶数 $n$ 的个数之积。当 $1 \\le m \\le 3$，$1 \\le n \\le 4$ 时：$m \\in \\{1, 3\\}$，$n \\in \\{2, 4\\}$，共 $2 \\cdot 2 = 4$ 对。\n\n> **注意。** $n$ 为偶数时 $n + 1$ 才是奇数。要求 $n$ 本身为奇数会使 $n + 1$ 为偶数，乘积也为偶数。",
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
      wrong: [answer + 1],
      mistakes: firstOf([
        why(a * b - answer, "That counts the pairs that make the expression even.", "这数的是使表达式为偶数的数对。"),
        why(oddA * oddB, "$n + 1$ is odd when $n$ is even, not when $n$ is odd.", "$n$ 为偶数时 $n + 1$ 才是奇数，而不是 $n$ 为奇数时。"),
        why(evenA * evenB, "An even $m$ makes the product even; $m$ must be odd.", "偶数 $m$ 会使乘积为偶数；$m$ 必须是奇数。"),
      ]),
      solution: walked(
        [
          [["Factor", "因式分解"], t("$mn + m = m(n + 1)$.", "$mn + m = m(n + 1)$。")],
          [
            ["Make every factor odd", "使每个因子都是奇数"],
            t(
              "A product is odd exactly when every factor is: $m$ odd and $n + 1$ odd, that is, $n$ even.",
              "乘积为奇数当且仅当每个因子都是奇数：$m$ 为奇数，$n + 1$ 为奇数，即 $n$ 为偶数。",
            ),
          ],
          [
            ["Count", "计数"],
            t(
              `There are $${oddA}$ odd values of $m$ and $${evenB}$ even values of $n$: $${oddA} \\cdot ${evenB} = ${answer}$ pairs.`,
              `奇数 $m$ 有 $${oddA}$ 个，偶数 $n$ 有 $${evenB}$ 个：共 $${oddA} \\cdot ${evenB} = ${answer}$ 对。`,
            ),
          ],
        ],
        t(
          "At $(m, n) = (1, 2)$, $mn + m = 3$ is odd; at $(1, 1)$, $mn + m = 2$ is even.",
          "$(m, n) = (1, 2)$ 时 $mn + m = 3$ 是奇数；$(1, 1)$ 时 $mn + m = 2$ 是偶数。",
        ),
      ),
    });
  },
};

const vacuousCases: KnowledgePointDef = {
  id: "counting-the-vacuous-cases-of-a-conditional",
  title: t("Counting the vacuous cases of a conditional", "计算条件句的空真情形"),
  explanation: t(
    'A conditional is vacuously true at a value where its hypothesis is false, and in that case its conclusion is never examined. This is why a universal claim only needs checking where the hypothesis holds. So the vacuous cases can be counted from the hypothesis alone, even if the conclusion looks relevant. In a domain of numbers, a hypothesis about divisibility is false for all the numbers that are not multiples of the divisor. On $\\{1, \\dots, 10\\}$, "if $3 \\mid x$, then $x > 4$" is vacuous at the $10 - 3 = 7$ values that are not multiples of $3$.\n\n> **Watch out.** Whether a case is vacuous depends only on the hypothesis. A value where the conclusion fails is not vacuous; if the hypothesis holds there, the conditional is false.',
    "在假设为假的值上，条件句是空真的，这时根本不用检查结论。这就是为什么全称命题只需要在假设成立的地方检查。所以只凭假设就能数出空真情形，即使结论看上去相关。在数的论域中，关于整除的假设对所有不是除数倍数的数都为假。在 $\\{1, \\dots, 10\\}$ 上，“如果 $3 \\mid x$，那么 $x > 4$”在不是 $3$ 的倍数的 $10 - 3 = 7$ 个值上空真。\n\n> **注意。** 一个情形是否空真只取决于假设。结论不成立的值并不空真；如果假设在那里成立，条件句就是假的。",
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
      wrong: [answer + 1],
      mistakes: firstOf([
        why(multiples, "Those are the values where the hypothesis holds, which are not vacuous.", "这些是假设成立的值，它们不是空真的。"),
        why(
          n,
          `The multiples of $${d}$ make the hypothesis true, so they are not vacuous.`,
          `$${d}$ 的倍数使假设为真，所以它们不是空真的。`,
        ),
        why(
          n - k,
          "That counts where the conclusion is true; vacuity depends only on the hypothesis.",
          "这数的是结论为真的值；是否空真只取决于假设。",
        ),
      ]),
      solution: walked(
        [
          [["Find the vacuous cases", "找出空真情形"], t(`They are the values with $${d} \\nmid x$.`, `它们是满足 $${d} \\nmid x$ 的值。`)],
          [
            ["Count the multiples", "数倍数"],
            t(
              `There are $\\lfloor ${n} / ${d} \\rfloor = ${multiples}$ multiples of $${d}$ in the domain.`,
              `论域中 $${d}$ 的倍数有 $\\lfloor ${n} / ${d} \\rfloor = ${multiples}$ 个。`,
            ),
          ],
          [["Subtract", "相减"], t(`$${n} - ${multiples} = ${answer}$.`, `$${n} - ${multiples} = ${answer}$。`)],
        ],
        t(
          `The largest multiple of $${d}$ in the domain is $${d * multiples} = ${d} \\cdot ${multiples}$, and $${multiples} + ${answer} = ${n}$ accounts for every value.`,
          `论域中 $${d}$ 的最大倍数是 $${d * multiples} = ${d} \\cdot ${multiples}$，而 $${multiples} + ${answer} = ${n}$ 涵盖了每个值。`,
        ),
      ),
    });
  },
};

const sumOfDivisors: KnowledgePointDef = {
  id: "the-sum-of-the-divisors-of-a-number",
  title: t("The sum of the divisors of a number", "一个数的因数之和"),
  explanation: t(
    "Every divisor of $p^a q^b$ has the form $p^i q^j$, with $0 \\le i \\le a$ and $0 \\le j \\le b$. Adding all of them gives a product of two sums, $(1 + p + \\dots + p^a)(1 + q + \\dots + q^b)$, as expanding the product shows. So no list of divisors is needed, and the idea works just as well for more primes. A number's divisors always include 1 and the number itself.\n\n> **Watch out.** Each sum starts at $p^0 = 1$. Leaving out the $1$ drops every divisor that does not use that prime.",
    "$p^a q^b$ 的每个因数都形如 $p^i q^j$，其中 $0 \\le i \\le a$，$0 \\le j \\le b$。把它们全部相加，得到两个和的乘积 $(1 + p + \\dots + p^a)(1 + q + \\dots + q^b)$，展开乘积就可以看出。所以不需要列出因数，这个想法对更多素数同样有效。一个数的因数总包含 1 和它本身。\n\n> **注意。** 每个和都从 $p^0 = 1$ 开始。漏掉 $1$，就丢掉了所有不含这个素数的因数。",
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
    const sumP = oneTo(a + 1)
      .map((i) => p ** (i - 1))
      .join(" + ");
    const sumQ = oneTo(b + 1)
      .map((i) => q ** (i - 1))
      .join(" + ");
    return numberProblem({
      prompt: t(`Find the sum of all positive divisors of ${n}.`, `求 ${n} 的所有正因数之和。`),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(
          n + 1,
          `That adds only $1$ and $${n}$; every $p^i q^j$ is a divisor too.`,
          `这只加了 $1$ 和 $${n}$；每个 $p^i q^j$ 也都是因数。`,
        ),
        why((a + 1) * (b + 1), "That is the number of divisors, not their sum.", "这是因数的个数，而不是它们的和。"),
        why(answer - n, `That leaves out $${n}$ itself, which is also a divisor.`, `这漏掉了 $${n}$ 本身，它也是因数。`),
      ]),
      solution: walked(
        [
          [
            ["Factor", "分解"],
            t(`$${n} = ${powerLatex(p, a)} \\cdot ${powerLatex(q, b)}$.`, `$${n} = ${powerLatex(p, a)} \\cdot ${powerLatex(q, b)}$。`),
          ],
          [
            ["Sum the powers of each prime", "对每个素数的幂求和"],
            t(`$${sumP} = ${first}$ and $${sumQ} = ${second}$.`, `$${sumP} = ${first}$，$${sumQ} = ${second}$。`),
          ],
          [["Multiply", "相乘"], t(`$${first} \\cdot ${second} = ${answer}$.`, `$${first} \\cdot ${second} = ${answer}$。`)],
        ],
        t(
          `Expanding $(${sumP})(${sumQ})$ gives $${a + 1} \\cdot ${b + 1} = ${(a + 1) * (b + 1)}$ terms, one for each divisor, from $1 \\cdot 1 = 1$ up to $${p ** a} \\cdot ${q ** b} = ${n}$.`,
          `展开 $(${sumP})(${sumQ})$ 得 $${a + 1} \\cdot ${b + 1} = ${(a + 1) * (b + 1)}$ 项，每个因数一项，从 $1 \\cdot 1 = 1$ 到 $${p ** a} \\cdot ${q ** b} = ${n}$。`,
        ),
      ),
    });
  },
};

const triangularMatrixCorner: KnowledgePointDef = {
  id: "the-corner-of-a-power-of-a-triangular-matrix",
  title: t("The corner of a power of a triangular matrix", "三角矩阵的幂的右上角"),
  explanation: t(
    "To guess a formula for the powers of $\\begin{pmatrix} r & a \\\\ 0 & r \\end{pmatrix}$, compute a few by hand. The corner entries come out as $a$, $2ra$, $3r^2a$, and so on, which suggests $nr^{n - 1}a$. Induction then proves it: multiplying by the matrix once more gives $r \\cdot nr^{n - 1}a + a \\cdot r^n = (n + 1)r^n a$. This has the same shape as the derivative of $r^n$, and that is no accident.\n\n> **Watch out.** The power of $r$ in the corner is $n - 1$, one less than on the diagonal. The factor $n$ counts the products that add up in the corner.",
    "要猜测 $\\begin{pmatrix} r & a \\\\ 0 & r \\end{pmatrix}$ 的幂的公式，先手算几个。右上角元素依次是 $a$、$2ra$、$3r^2a$ 等，这提示公式是 $nr^{n - 1}a$。然后用归纳法证明：再乘一次矩阵，得 $r \\cdot nr^{n - 1}a + a \\cdot r^n = (n + 1)r^n a$。它的形状与 $r^n$ 的导数相同，这并非巧合。\n\n> **注意。** 右上角中 $r$ 的指数是 $n - 1$，比对角线上少一。因子 $n$ 数的是在右上角累加的乘积个数。",
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
      wrong: [],
      mistakes: firstOf([
        why(
          a * r ** (n - 1),
          `That misses the factor $${n}$: the corner collects $${n}$ equal products.`,
          `这漏掉了因数 $${n}$：右上角累积了 $${n}$ 个相同的乘积。`,
        ),
        why(
          n * r ** n * a,
          "The power of $r$ in the corner is one less than the power of the matrix.",
          "右上角中 $r$ 的指数比矩阵的幂次小一。",
        ),
        why(r ** n, `That is a diagonal entry, $${r}^{${n}}$.`, `这是对角元素 $${r}^{${n}}$。`),
        why(n * a, `That drops the powers of $${r}$ that the diagonal contributes.`, `这丢掉了对角元素贡献的 $${r}$ 的幂。`),
      ]),
      solution: walked(
        [
          [
            ["Use the formula", "用公式"],
            t(
              `By induction the corner is $nr^{n - 1}a$: one more multiplication gives $r \\cdot nr^{n - 1}a + a \\cdot r^n = (n + 1)r^n a$.`,
              `由归纳法，右上角是 $nr^{n - 1}a$：再乘一次得 $r \\cdot nr^{n - 1}a + a \\cdot r^n = (n + 1)r^n a$。`,
            ),
          ],
          [
            ["Substitute", "代入"],
            t(
              `$${n} \\cdot ${r}^{${n - 1}} \\cdot ${a} = ${n} \\cdot ${r ** (n - 1)} \\cdot ${a} = ${answer}$.`,
              `$${n} \\cdot ${r}^{${n - 1}} \\cdot ${a} = ${n} \\cdot ${r ** (n - 1)} \\cdot ${a} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The square has corner $${r} \\cdot ${a} + ${a} \\cdot ${r} = ${2 * r * a} = 2 \\cdot ${r} \\cdot ${a}$, as the formula says for $n = 2$.`,
          `平方的右上角是 $${r} \\cdot ${a} + ${a} \\cdot ${r} = ${2 * r * a} = 2 \\cdot ${r} \\cdot ${a}$，与公式在 $n = 2$ 时一致。`,
        ),
      ),
    });
  },
};

const floorPreimage: KnowledgePointDef = {
  id: "the-size-of-a-preimage-under-a-floor-function",
  title: t("The size of a preimage under a floor function", "取整函数下原像的大小"),
  explanation: t(
    "Proving surjectivity means finding a preimage for each value, and it can be useful to find all of them. The numbers with $\\lfloor \\frac{n}{k} \\rfloor = v$ are exactly the block $kv \\le n < k(v + 1)$, which has $k$ integers. On a finite domain, though, the first and last blocks can be cut short. If the domain starts at 1, the block for 0 loses the number 0, and the last block stops at the end of the domain. On $\\{1, \\dots, 10\\}$ with $\\lfloor \\frac{x}{4} \\rfloor$: the value $0$ has preimage $\\{1, 2, 3\\}$, the value $1$ has $\\{4, 5, 6, 7\\}$, and the value $2$ has only $\\{8, 9, 10\\}$.\n\n> **Watch out.** The block stops just before $k(v + 1)$, which already has quotient $v + 1$. And at the two ends, intersect the block with the domain before counting.",
    "证明满射就是为每个值找一个原像，有时找出全部原像很有用。满足 $\\lfloor \\frac{n}{k} \\rfloor = v$ 的数恰好是一段 $kv \\le n < k(v + 1)$，有 $k$ 个整数。不过在有限论域上，第一段和最后一段可能被截短。如果论域从 1 开始，0 对应的一段就少了数 0，最后一段则停在论域的末尾。在 $\\{1, \\dots, 10\\}$ 上取 $\\lfloor \\frac{x}{4} \\rfloor$：值 $0$ 的原像是 $\\{1, 2, 3\\}$，值 $1$ 的原像是 $\\{4, 5, 6, 7\\}$，值 $2$ 的原像只有 $\\{8, 9, 10\\}$。\n\n> **注意。** 这一段止于 $k(v + 1)$ 之前，因为 $k(v + 1)$ 的商已经是 $v + 1$。在两端，要先把这一段与论域取交集再数。",
  ),
  generate(rng) {
    const k = rng.int(2, 9);
    const m = rng.int(2, 12);
    const r = rng.int(0, k - 1);
    const n = k * m + r;
    // The blocks at the two ends are the ones that can be cut short.
    const v = rng.pick([0, m, rng.int(1, m - 1)]);
    const preimage = oneTo(n).filter((x) => Math.floor(x / k) === v);
    const answer = preimage.length;
    const low = k * v;
    const high = k * (v + 1) - 1;
    const first = preimage[0] ?? 0;
    const end = preimage[preimage.length - 1] ?? 0;
    const cut =
      v === 0
        ? t("The domain starts at $1$, so $0$ is left out.", "论域从 $1$ 开始，所以 $0$ 被去掉。")
        : v === m && high > n
          ? t(`The domain stops at $${n}$, so the block is cut there.`, `论域止于 $${n}$，所以这一段在那里被截断。`)
          : t("The whole block lies in the domain.", "整段都在论域之内。");
    const after =
      end === n
        ? t(`$${end}$ is the last element of the domain.`, `$${end}$ 是论域的最后一个元素。`)
        : t(
            `the next number, $${end + 1}$, has $\\lfloor \\frac{${end + 1}}{${k}} \\rfloor = ${v + 1}$.`,
            `下一个数 $${end + 1}$ 满足 $\\lfloor \\frac{${end + 1}}{${k}} \\rfloor = ${v + 1}$。`,
          );
    return numberProblem({
      prompt: t(
        `Let $f : \\{1, 2, \\dots, ${n}\\} \\to \\mathbb{Z}$ with $f(x) = \\lfloor \\frac{x}{${k}} \\rfloor$. How many elements does the preimage $f^{-1}(\\{${v}\\})$ have?`,
        `设 $f : \\{1, 2, \\dots, ${n}\\} \\to \\mathbb{Z}$，$f(x) = \\lfloor \\frac{x}{${k}} \\rfloor$。原像 $f^{-1}(\\{${v}\\})$ 有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [k - 1, r + 1, answer + 2],
      mistakes: firstOf([
        why(
          k,
          "A full block has that many numbers, but this block is cut short by the domain.",
          "完整的一段有这么多个数，但这一段被论域截短了。",
        ),
        why(
          answer + 1,
          `That includes a number outside the preimage: check both ends of the block against the domain and against $${k * (v + 1)}$.`,
          `这多算了一个不在原像中的数：要用论域和 $${k * (v + 1)}$ 检查这一段的两端。`,
        ),
        why(
          k + 1,
          `The block stops before $${k * (v + 1)}$, whose quotient is already $${v + 1}$.`,
          `这一段止于 $${k * (v + 1)}$ 之前，它的商已经是 $${v + 1}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the block", "找出这一段"],
            t(
              `$\\lfloor \\frac{x}{${k}} \\rfloor = ${v}$ means $${low} \\le x < ${k * (v + 1)}$, that is $x = ${low}, \\dots, ${high}$.`,
              `$\\lfloor \\frac{x}{${k}} \\rfloor = ${v}$ 即 $${low} \\le x < ${k * (v + 1)}$，也就是 $x = ${low}, \\dots, ${high}$。`,
            ),
          ],
          [
            ["Keep the domain", "限制在论域内"],
            t(
              `${cut.en} The preimage is $\\{${preimage.join(", ")}\\}$: ${count(answer, "element", "elements")}.`,
              `${cut["zh-CN"]}原像是 $\\{${preimage.join(", ")}\\}$：共 ${answer} 个元素。`,
            ),
          ],
        ],
        t(
          `$\\lfloor \\frac{${first}}{${k}} \\rfloor = ${v}$ and $\\lfloor \\frac{${end}}{${k}} \\rfloor = ${v}$, while ${after.en}`,
          `$\\lfloor \\frac{${first}}{${k}} \\rfloor = ${v}$，$\\lfloor \\frac{${end}}{${k}} \\rfloor = ${v}$，而${after["zh-CN"]}`,
        ),
      ),
    });
  },
};

const residueOfLongSum: KnowledgePointDef = {
  id: "the-residue-of-a-long-sum",
  title: t("The residue of a long sum", "长求和的剩余"),
  explanation: t(
    "The least nonnegative residue of a sum like $1 + 2 + \\dots + n$ can be found without adding the terms one by one. The closed form $\\frac{n(n + 1)}{2}$ gives the whole sum at once, and dividing that by the modulus gives the residue. Take care not to reduce $n$ first and then apply the formula, because the division by 2 does not always behave well with congruences. Reducing after computing the exact integer is always safe.\n\n> **Watch out.** Divide $n(n + 1)$ by $2$ before reducing. The residue of $n(n + 1)$ alone belongs to twice the sum.",
    "像 $1 + 2 + \\dots + n$ 这样的和，其最小非负剩余不必逐项相加。封闭式 $\\frac{n(n + 1)}{2}$ 一下子给出整个和，再除以模就得到剩余。注意不要先化简 $n$ 再套公式，因为除以 2 与同余的配合并不总是可靠。算出精确的整数后再化简总是安全的。\n\n> **注意。** 先把 $n(n + 1)$ 除以 $2$ 再约化。只约化 $n(n + 1)$ 得到的是和的两倍的剩余。",
  ),
  generate(rng) {
    const n = rng.int(10, 200);
    const m = rng.int(3, 13);
    const sum = (n * (n + 1)) / 2;
    const answer = sum % m;
    const reduced = n % m;
    const twice = n * (n + 1);
    return numberProblem({
      prompt: t(
        `Find the least nonnegative residue of $1 + 2 + \\dots + ${n}$ modulo ${m}.`,
        `求 $1 + 2 + \\dots + ${n}$ 模 ${m} 的最小非负剩余。`,
      ),
      answer,
      form: "integer",
      wrong: [reduced, twice % m, ((reduced * (reduced + 1)) >> 1) % m, (answer + 1) % m],
      mistakes: firstOf([
        why(reduced, `That is the residue of $${n}$, the last term, not of the sum.`, `这是最后一项 $${n}$ 的剩余，而不是和的剩余。`),
        why(twice % m, "That leaves out the division by $2$ in the closed form.", "这漏掉了封闭式中的除以 $2$。"),
        why(
          ((reduced * (reduced + 1)) >> 1) % m,
          `That reduces $${n}$ before using the formula; the division by $2$ goes wrong after reducing.`,
          `这是先约化 $${n}$ 再用公式；约化之后除以 $2$ 会出错。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the closed form", "用封闭式"],
            t(
              `$1 + 2 + \\dots + ${n} = \\frac{${n} \\cdot ${n + 1}}{2} = ${sum}$.`,
              `$1 + 2 + \\dots + ${n} = \\frac{${n} \\cdot ${n + 1}}{2} = ${sum}$。`,
            ),
          ],
          [
            ["Divide by the modulus", "除以模"],
            t(
              `$${sum} = ${m} \\cdot ${Math.floor(sum / m)} + ${answer}$, so the residue is $${answer}$.`,
              `$${sum} = ${m} \\cdot ${Math.floor(sum / m)} + ${answer}$，所以剩余是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `Twice the sum is $${n} \\cdot ${n + 1} = ${twice} \\equiv ${twice % m}$, and $2 \\cdot ${answer} = ${2 * answer} \\equiv ${(2 * answer) % m} \\pmod{${m}}$, as it should be.`,
          `和的两倍是 $${n} \\cdot ${n + 1} = ${twice} \\equiv ${twice % m}$，而 $2 \\cdot ${answer} = ${2 * answer} \\equiv ${(2 * answer) % m} \\pmod{${m}}$，正好吻合。`,
        ),
      ),
    });
  },
};

const missingDigit: KnowledgePointDef = {
  id: "the-missing-digit-for-divisibility-by-nine",
  title: t("The missing digit for divisibility by nine", "被九整除所缺的数字"),
  explanation: t(
    "Since $10 \\equiv 1 \\pmod 9$, every power of 10 is also congruent to 1, and so a number is congruent to the sum of its digits modulo 9. This proves the digit test for divisibility by 9, and it turns a question about a long number into a question about a small sum. A missing digit must bring the digit sum to a multiple of 9, and among the digits only 0 and 9 have the same effect.\n\n> **Watch out.** The remainder of the known digits is not the missing digit. The missing digit is the gap from the known sum up to the next multiple of $9$.",
    "由于 $10 \\equiv 1 \\pmod 9$，10 的每个幂也同余于 1，所以一个数模 9 同余于它的各位数字之和。这证明了被 9 整除的数字判别法，也把关于长数字的问题变成了关于小和数的问题。所缺的数字必须使数字和成为 9 的倍数，而在所有数字中只有 0 和 9 的效果相同。\n\n> **注意。** 已知数字之和的余数不是所缺的数字。所缺的数字是已知数字之和到下一个 $9$ 的倍数的差。",
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
    const full = Number(`${first}${second}${answer}${third}${adjusted}`);
    const offBy = (d: number): [string, string] => [
      `Then the digit sum is $${known + d}$, which is not a multiple of $9$.`,
      `那样数字之和是 $${known + d}$，不是 $9$ 的倍数。`,
    ];
    return numberProblem({
      prompt: t(
        `The digit $\\square$ makes the number $${shown}$ divisible by 9. Find the digit.`,
        `数字 $\\square$ 使 $${shown}$ 能被 9 整除。求这个数字。`,
      ),
      answer,
      form: "integer",
      wrong: [9 - answer, (answer + 3) % 10, answer + 1, answer === 1 ? 2 : answer - 1],
      mistakes: firstOf([
        why(
          9 - answer,
          `That is the remainder of the known digits; the missing digit tops $${known}$ up to a multiple of $9$.`,
          `这是已知数字之和的余数；所缺的数字要把 $${known}$ 补到 $9$ 的倍数。`,
        ),
        why(answer + 1, ...offBy(answer + 1)),
        why(answer === 1 ? 2 : answer - 1, ...offBy(answer === 1 ? 2 : answer - 1)),
      ]),
      solution: walked(
        [
          [
            ["Add the known digits", "把已知数字相加"],
            t(
              `$${first} + ${second} + ${third} + ${adjusted} = ${known}$.`,
              `$${first} + ${second} + ${third} + ${adjusted} = ${known}$。`,
            ),
          ],
          [
            ["Reach the next multiple of 9", "补到下一个 9 的倍数"],
            t(
              `The next multiple of $9$ is $${known + answer}$, so the missing digit is $${known + answer} - ${known} = ${answer}$.`,
              `下一个 $9$ 的倍数是 $${known + answer}$，所以所缺的数字是 $${known + answer} - ${known} = ${answer}$。`,
            ),
          ],
        ],
        t(`$${full} = 9 \\cdot ${full / 9}$.`, `$${full} = 9 \\cdot ${full / 9}$。`),
      ),
    });
  },
};

const selfAdditiveInverses: KnowledgePointDef = {
  id: "the-residues-equal-to-their-own-additive-inverse",
  title: t("The residues equal to their own additive inverse", "等于自身加法逆元的剩余"),
  explanation: t(
    "Most residues pair up with a different additive inverse, since $x$ and $n - x$ are usually different. A residue equal to its own inverse must satisfy $2x \\equiv 0 \\pmod n$. The residue 0 always qualifies. When $n$ is even, the residue $\\frac{n}{2}$ also qualifies, and there are no others. So the count depends only on the parity of $n$, which also tells us about the pairing of the other residues.\n\n> **Watch out.** $2x \\equiv 0$ is not the same as $x \\equiv 0$. For an even modulus, $2 \\cdot \\frac{n}{2} = n \\equiv 0$ as well.",
    "大多数剩余与一个不同的加法逆元配对，因为 $x$ 和 $n - x$ 通常不同。等于自身逆元的剩余必须满足 $2x \\equiv 0 \\pmod n$。剩余 0 总是满足。当 $n$ 是偶数时，剩余 $\\frac{n}{2}$ 也满足，没有其他的了。所以个数只取决于 $n$ 的奇偶性，这也说明了其余剩余的配对情况。\n\n> **注意。** $2x \\equiv 0$ 与 $x \\equiv 0$ 不同。对偶数模，$2 \\cdot \\frac{n}{2} = n \\equiv 0$ 也成立。",
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
      mistakes: firstOf([
        even
          ? why(
              1,
              `That counts only $0$; with an even modulus, $2x \\equiv 0$ has another solution.`,
              `这只数了 $0$；模为偶数时，$2x \\equiv 0$ 还有一个解。`,
            )
          : why(2, `$\\frac{${n}}{2}$ is not a whole number, so it is not a residue.`, `$\\frac{${n}}{2}$ 不是整数，所以不是剩余。`),
        why(0, "$0$ always works, since $-0 = 0$.", "$0$ 总是满足，因为 $-0 = 0$。"),
        why(
          Math.floor(n / 2),
          "That counts the pairs $x$ and $n - x$; only residues paired with themselves count.",
          "这数的是 $x$ 与 $n - x$ 组成的对；只有与自身配对的剩余才算。",
        ),
        why(n, "Most residues differ from their inverse $n - x$.", "大多数剩余与它的逆元 $n - x$ 不同。"),
      ]),
      solution: walked(
        [
          [
            ["Rewrite the condition", "改写条件"],
            t(
              `$x \\equiv -x$ means $2x \\equiv 0 \\pmod{${n}}$, so $${n} \\mid 2x$.`,
              `$x \\equiv -x$ 意味着 $2x \\equiv 0 \\pmod{${n}}$，即 $${n} \\mid 2x$。`,
            ),
          ],
          [
            ["Solve in the range", "在范围内求解"],
            t(
              `For $0 \\le x < ${n}$, $2x$ lies in $[0, ${2 * n})$, so $2x = 0$ or $2x = ${n}$. ${even ? `Both work: $x = 0$ and $x = ${n / 2}$` : `Only $2x = 0$ works, since $${n}$ is odd`}, so the count is $${answer}$.`,
              `当 $0 \\le x < ${n}$ 时，$2x$ 在 $[0, ${2 * n})$ 中，所以 $2x = 0$ 或 $2x = ${n}$。${even ? `两者都可以：$x = 0$ 和 $x = ${n / 2}$` : `由于 $${n}$ 是奇数，只有 $2x = 0$ 可以`}，所以个数是 $${answer}$。`,
            ),
          ],
        ],
        even
          ? t(
              `$${n / 2} + ${n / 2} = ${n} \\equiv 0$, so $${n / 2}$ is its own inverse.`,
              `$${n / 2} + ${n / 2} = ${n} \\equiv 0$，所以 $${n / 2}$ 是自身的逆元。`,
            )
          : t(
              `Every other residue $x$ pairs with $${n} - x \\ne x$, which leaves only $0$ unpaired.`,
              `其余每个剩余 $x$ 都与 $${n} - x \\ne x$ 配对，只剩 $0$ 没有配对。`,
            ),
      ),
    });
  },
};

const selfMultiplicativeInverses: KnowledgePointDef = {
  id: "counting-the-residues-that-are-their-own-inverse",
  title: t("Counting the residues that are their own inverse", "计算自身就是逆元的剩余"),
  explanation: t(
    "A residue is its own multiplicative inverse when $x^2 \\equiv 1 \\pmod n$. The residues 1 and $n - 1$ always work. For a prime modulus there are no others, because $n$ dividing $(x - 1)(x + 1)$ forces it to divide one of the factors. For a composite modulus, the factors can share out the prime powers of $n$, and so there may be more solutions, for example 3 and 5 modulo 8.\n\n> **Watch out.** Being its own inverse is much rarer than having an inverse: count the solutions of $x^2 \\equiv 1$, not all residues coprime to $n$.",
    "当 $x^2 \\equiv 1 \\pmod n$ 时，剩余是它自身的乘法逆元。剩余 1 和 $n - 1$ 总是可行。对素数模没有其他解，因为 $n$ 整除 $(x - 1)(x + 1)$ 就必须整除其中一个因子。对合数模，两个因子可以分担 $n$ 的素数幂，所以可能有更多的解，例如模 8 时的 3 和 5。\n\n> **注意。** 自身就是逆元比有逆元少见得多：要数 $x^2 \\equiv 1$ 的解，而不是所有与 $n$ 互素的剩余。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const solutions = [...Array(n).keys()].filter((x) => (x * x) % n === 1);
    const answer = solutions.length;
    const half = solutions.filter((x) => 2 * x < n);
    return numberProblem({
      prompt: t(
        `How many residues $x$ in $\\{0, 1, \\dots, ${n - 1}\\}$ are their own multiplicative inverse modulo ${n}?`,
        `$\\{0, 1, \\dots, ${n - 1}\\}$ 中有多少个剩余 $x$ 在模 ${n} 下是自身的乘法逆元？`,
      ),
      answer,
      form: "integer",
      wrong: [2, totient(n), 1, answer + 2],
      mistakes: firstOf([
        why(
          2,
          `$1$ and $${n - 1}$ are not the only ones for this modulus; test the other residues too.`,
          `对这个模，$1$ 和 $${n - 1}$ 不是仅有的解；其他剩余也要检验。`,
        ),
        why(
          totient(n),
          "That counts every residue with an inverse, not those equal to their own inverse.",
          "这数的是所有有逆元的剩余，而不是等于自身逆元的剩余。",
        ),
        why(1, `$${n - 1}$ works as well: $(${n - 1})^2 \\equiv (-1)^2 = 1$.`, `$${n - 1}$ 也满足：$(${n - 1})^2 \\equiv (-1)^2 = 1$。`),
      ]),
      solution: walked(
        [
          [
            ["Test the squares", "检验平方"],
            t(`The residues with $x^2 \\equiv 1 \\pmod{${n}}$ are:`, `满足 $x^2 \\equiv 1 \\pmod{${n}}$ 的剩余是：`),
            solutions.map((x) => `${x}^2 = ${x * x} = ${n} \\cdot ${(x * x - 1) / n} + 1`),
          ],
          [["Count", "计数"], t(`That makes $${answer}$.`, `共 $${answer}$ 个。`)],
        ],
        t(
          `The solutions pair up as $x$ and $${n} - x$, since $(${n} - x)^2 \\equiv x^2$: ${half.map((x) => `$${x}, ${n - x}$`).join("; ")}.`,
          `解按 $x$ 与 $${n} - x$ 成对出现，因为 $(${n} - x)^2 \\equiv x^2$：${half.map((x) => `$${x}, ${n - x}$`).join("；")}。`,
        ),
      ),
    });
  },
};

const domainOfSumRelation: KnowledgePointDef = {
  id: "the-domain-of-a-sum-relation",
  title: t("The domain of a sum relation", "和关系的定义域"),
  explanation: t(
    "The domain of a relation is the set of first coordinates that actually occur. For the relation $x + y = k$ on $\\{1, \\dots, n\\}$, a value of $x$ occurs when its partner $k - x$ is also between 1 and $n$. When $k$ is small, the partner fails to be positive for large $x$. When $k$ is large, the partner is too big for small $x$. So the domain is a run of consecutive integers, and both ends must be checked. On $\\{1, \\dots, 10\\}$ with $x + y = 14$, the partner $14 - x \\le 10$ needs $x \\ge 4$, so the domain is $\\{4, \\dots, 10\\}$: $7$ elements.\n\n> **Watch out.** Apply both bounds to the partner, $1 \\le k - x \\le n$, and intersect them with $1 \\le x \\le n$. The count is $\\text{last} - \\text{first} + 1$, not $\\text{last} - \\text{first}$.",
    "关系的定义域是实际出现的第一坐标的集合。对 $\\{1, \\dots, n\\}$ 上的关系 $x + y = k$，当搭档 $k - x$ 也在 1 和 $n$ 之间时，$x$ 的值才出现。$k$ 较小时，对大的 $x$，搭档不是正数。$k$ 较大时，对小的 $x$，搭档太大。所以定义域是一段连续的整数，两端都要检查。在 $\\{1, \\dots, 10\\}$ 上，对 $x + y = 14$，搭档 $14 - x \\le 10$ 要求 $x \\ge 4$，所以定义域是 $\\{4, \\dots, 10\\}$：共 $7$ 个元素。\n\n> **注意。** 对搭档同时用上两个界 $1 \\le k - x \\le n$，再与 $1 \\le x \\le n$ 取交集。个数是 $\\text{末项} - \\text{首项} + 1$，而不是 $\\text{末项} - \\text{首项}$。",
  ),
  generate(rng) {
    const n = rng.int(3, 20);
    const k = rng.int(3, 2 * n - 1);
    const domain = oneTo(n).filter((x) => k - x >= 1 && k - x <= n);
    const answer = domain.length;
    const first = domain[0]!;
    const last = domain[domain.length - 1]!;
    return numberProblem({
      prompt: t(
        `The relation $R$ on $\\{1, 2, \\dots, ${n}\\}$ has $(x, y) \\in R$ when $x + y = ${k}$. How many elements does the domain of $R$ have?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 上的关系 $R$ 定义为：当 $x + y = ${k}$ 时 $(x, y) \\in R$。$R$ 的定义域有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [k, Math.abs(2 * n - k)],
      mistakes: firstOf([
        why(answer - 1, "That is the last value minus the first; count both ends.", "这是末项减首项；两端都要算上。"),
        why(
          n,
          `Not every $x$ has a partner: $${k} - x$ must also lie between $1$ and $${n}$.`,
          `并非每个 $x$ 都有搭档：$${k} - x$ 也必须在 $1$ 与 $${n}$ 之间。`,
        ),
        why(k - 1, `That allows partners larger than $${n}$.`, `这允许了大于 $${n}$ 的搭档。`),
        why(answer + 1, "That counts one value whose partner falls outside the set.", "这多算了一个搭档落在集合之外的值。"),
      ]),
      solution: walked(
        [
          [
            ["Bound the partner", "限定搭档"],
            t(
              `$1 \\le ${k} - x \\le ${n}$ means $${k - n} \\le x \\le ${k - 1}$; together with $1 \\le x \\le ${n}$ this gives $${first} \\le x \\le ${last}$.`,
              `$1 \\le ${k} - x \\le ${n}$ 即 $${k - n} \\le x \\le ${k - 1}$；再结合 $1 \\le x \\le ${n}$，得 $${first} \\le x \\le ${last}$。`,
            ),
          ],
          [["Count", "计数"], t(`$${last} - ${first} + 1 = ${answer}$ values.`, `$${last} - ${first} + 1 = ${answer}$ 个值。`)],
        ],
        t(
          `At the ends, $(${first}, ${k - first})$ and $(${last}, ${k - last})$ are in $R$${first > 1 ? `, while $${first - 1}$ would need the partner $${k - first + 1} > ${n}$` : ""}${last < n ? `, and $${last + 1}$ would need the partner $${k - last - 1} < 1$` : ""}.`,
          `两端的 $(${first}, ${k - first})$ 与 $(${last}, ${k - last})$ 都在 $R$ 中${first > 1 ? `，而 $${first - 1}$ 需要搭档 $${k - first + 1} > ${n}$` : ""}${last < n ? `，$${last + 1}$ 需要搭档 $${k - last - 1} < 1$` : ""}。`,
        ),
      ),
    });
  },
};

const onesInDivisibilityMatrix: KnowledgePointDef = {
  id: "counting-the-ones-in-a-divisibility-matrix",
  title: t("Counting the ones in a divisibility matrix", "计算整除矩阵中 1 的个数"),
  explanation: t(
    "The matrix of a relation on $\\{1, \\dots, n\\}$ has a 1 in row $i$ and column $j$ when $i$ is related to $j$. So the number of ones is the number of pairs in the relation. For divisibility, row $d$ has a 1 at each multiple of $d$, which gives $\\lfloor \\frac{n}{d} \\rfloor$ ones. Adding along the rows avoids testing every entry, and it also equals the total number of divisors of the numbers up to $n$. For $n = 6$: $6 + 3 + 2 + 1 + 1 + 1 = 14$.\n\n> **Watch out.** Every row has at least one 1, on the diagonal, since $d \\mid d$. Row $d$ counts multiples of $d$ up to $n$, which is $\\lfloor n/d \\rfloor$, rounded down.",
    "$\\{1, \\dots, n\\}$ 上关系的矩阵，当 $i$ 与 $j$ 有关系时，第 $i$ 行第 $j$ 列为 1。所以 1 的个数就是关系中数对的个数。对整除关系，第 $d$ 行在 $d$ 的每个倍数处为 1，共 $\\lfloor \\frac{n}{d} \\rfloor$ 个。按行相加就不必检查每个元素，它也等于不超过 $n$ 的各数的因数个数之和。当 $n = 6$ 时：$6 + 3 + 2 + 1 + 1 + 1 = 14$。\n\n> **注意。** 因为 $d \\mid d$，每一行至少在对角线上有一个 1。第 $d$ 行数的是不超过 $n$ 的 $d$ 的倍数，即向下取整的 $\\lfloor n/d \\rfloor$。",
  ),
  generate(rng) {
    const n = rng.int(4, 40);
    const rows = oneTo(n).map((d) => Math.floor(n / d));
    const answer = rows.reduce((sum, r) => sum + r, 0);
    const divisorCounts = oneTo(n).map((j) => divisorsOf(j).length);
    const shown = n <= 12 ? rows.join(" + ") : `${rows.slice(0, 6).join(" + ")} + \\dots + ${rows[n - 1]}`;
    const shownColumns =
      n <= 12 ? divisorCounts.join(" + ") : `${divisorCounts.slice(0, 6).join(" + ")} + \\dots + ${divisorCounts[n - 1]}`;
    return numberProblem({
      prompt: t(
        `The relation "$i$ divides $j$" on $\\{1, 2, \\dots, ${n}\\}$ is written as a matrix of zeros and ones. How many ones does the matrix have?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 上的关系“$i$ 整除 $j$”写成 0 和 1 的矩阵。矩阵中有多少个 1？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(n, "That counts only the diagonal, or only the first row.", "这只数了对角线，或者只数了第一行。"),
        why(n * n, "That counts every entry; a 1 needs $i \\mid j$.", "这数的是所有元素；只有 $i \\mid j$ 时才是 1。"),
        why(
          (n * (n + 1)) / 2,
          "That counts every entry with $i \\le j$, but $i \\le j$ does not make $i$ divide $j$.",
          "这数的是所有 $i \\le j$ 的元素，但 $i \\le j$ 并不意味着 $i$ 整除 $j$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count each row", "逐行计数"],
            t(
              `Row $d$ has a 1 at each multiple of $d$ up to $${n}$: $\\lfloor ${n}/d \\rfloor$ ones.`,
              `第 $d$ 行在不超过 $${n}$ 的每个 $d$ 的倍数处为 1：共 $\\lfloor ${n}/d \\rfloor$ 个。`,
            ),
          ],
          [["Add the rows", "各行相加"], t(`$${shown} = ${answer}$.`, `$${shown} = ${answer}$。`)],
        ],
        t(
          `Counting by columns instead, column $j$ has one 1 for each divisor of $j$: $${shownColumns} = ${answer}$.`,
          `改为按列计数，第 $j$ 列中 $j$ 的每个因数对应一个 1：$${shownColumns} = ${answer}$。`,
        ),
      ),
    });
  },
};

const closureOfCycleOrChain: KnowledgePointDef = {
  id: "the-size-of-the-transitive-closure-of-a-cycle-or-chain",
  title: t("The size of the transitive closure of a cycle or chain", "环或链的传递闭包的大小"),
  explanation: t(
    "The transitive closure adds a pair $(a, b)$ whenever there is a path of arrows from $a$ to $b$. On a chain $a_1 \\to a_2 \\to \\dots \\to a_n$, an element reaches only those later in the chain, which gives one pair for each choice of two positions. On a cycle, every element reaches every element, including itself, by going all the way around. So joining up the two ends of a chain enlarges the closure considerably. A chain of $4$ elements has a closure of $\\binom{4}{2} = 6$ pairs; a cycle of $4$ has $4^2 = 16$.\n\n> **Watch out.** On a cycle, the pairs $(a, a)$ belong to the closure too, since going once around returns to the start. On a chain, they do not.",
    "传递闭包在从 $a$ 到 $b$ 有箭头路径时加入数对 $(a, b)$。在链 $a_1 \\to a_2 \\to \\dots \\to a_n$ 上，一个元素只能到达链中在它之后的元素，所以每选两个位置就有一对。在环上，每个元素都能到达每个元素，包括绕一圈回到自身。所以把链的两端连起来会使闭包大大增加。$4$ 个元素的链的闭包有 $\\binom{4}{2} = 6$ 个数对；$4$ 个元素的环有 $4^2 = 16$ 个。\n\n> **注意。** 在环上，数对 $(a, a)$ 也属于闭包，因为绕一圈会回到起点。在链上则没有这些数对。",
  ),
  generate(rng) {
    const n = rng.int(5, 20);
    const cycle = rng.pick([true, false]);
    const answer = cycle ? n * n : (n * (n - 1)) / 2;
    const rowSums = [...Array(n).keys()].map((i) => n - 1 - i);
    return numberProblem({
      prompt: t(
        `A relation consists of the pairs $(a_1, a_2), (a_2, a_3), \\dots, (a_{${n - 1}}, a_{${n}})$${cycle ? `, together with $(a_{${n}}, a_1)$` : ""}, on ${n} different elements. How many pairs does its transitive closure have?`,
        `${n} 个不同元素上的一个关系由数对 $(a_1, a_2), (a_2, a_3), \\dots, (a_{${n - 1}}, a_{${n}})$${cycle ? `以及 $(a_{${n}}, a_1)$` : ""}组成。它的传递闭包有多少个数对？`,
      ),
      answer,
      form: "integer",
      wrong: [(n * (n + 1)) / 2],
      mistakes: firstOf(
        cycle
          ? [
              why(
                n * (n - 1),
                "That leaves out the pairs $(a, a)$, which going once around the cycle produces.",
                "这漏掉了数对 $(a, a)$，绕环一圈就会得到它们。",
              ),
              why(
                n,
                "That counts only the arrows of the cycle; the closure adds every path.",
                "这只数了环上的箭头；闭包还要加入每条路径。",
              ),
              why(
                (n * (n - 1)) / 2,
                "That counts only forward pairs, as on a chain; on a cycle every element reaches every element.",
                "这只数了向前的数对，就像在链上；在环上每个元素都能到达每个元素。",
              ),
            ]
          : [
              why(
                n * (n - 1),
                "That counts backward pairs too; on a chain an element reaches only those after it.",
                "这把向后的数对也算进去了；在链上一个元素只能到达它之后的元素。",
              ),
              why(
                n - 1,
                "That counts only the arrows of the chain; the closure adds every path.",
                "这只数了链上的箭头；闭包还要加入每条路径。",
              ),
              why(n * n, "That is the closure of a cycle; a chain has no path back.", "这是环的闭包；链上没有回头的路径。"),
            ],
      ),
      solution: walked(
        cycle
          ? [
              [
                ["Follow the arrows", "沿箭头走"],
                t(
                  `From any $a_i$, going around the cycle passes through every element and returns to $a_i$.`,
                  `从任意 $a_i$ 出发，沿环走一圈会经过每个元素并回到 $a_i$。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(
                  `Each of the $${n}$ elements reaches all $${n}$, itself included: $${n}^2 = ${answer}$ pairs.`,
                  `$${n}$ 个元素中的每一个都能到达全部 $${n}$ 个，包括自身：$${n}^2 = ${answer}$ 个数对。`,
                ),
              ],
            ]
          : [
              [
                ["Follow the arrows", "沿箭头走"],
                t(
                  `From $a_i$ the arrows reach exactly $a_{i+1}, \\dots, a_{${n}}$, and never back.`,
                  `从 $a_i$ 出发，箭头恰好到达 $a_{i+1}, \\dots, a_{${n}}$，不会回头。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(
                  `Each pair of positions $i < j$ gives one pair: $\\binom{${n}}{2} = ${answer}$.`,
                  `每对位置 $i < j$ 给出一个数对：$\\binom{${n}}{2} = ${answer}$。`,
                ),
              ],
            ],
        cycle
          ? t(
              `The closure is all of $A \\times A$ for a set $A$ of $${n}$ elements, which has $${n} \\cdot ${n} = ${answer}$ pairs.`,
              `闭包就是 $${n}$ 元集合 $A$ 的全部 $A \\times A$，有 $${n} \\cdot ${n} = ${answer}$ 个数对。`,
            )
          : t(
              `Adding by starting point: $a_1$ reaches $${n - 1}$, $a_2$ reaches $${n - 2}$, and so on: $${rowSums.slice(0, 3).join(" + ")} + \\dots + 0 = ${answer}$.`,
              `按起点相加：$a_1$ 到达 $${n - 1}$ 个，$a_2$ 到达 $${n - 2}$ 个，依此类推：$${rowSums.slice(0, 3).join(" + ")} + \\dots + 0 = ${answer}$。`,
            ),
      ),
    });
  },
};

const classesOfEqualSquares: KnowledgePointDef = {
  id: "counting-the-classes-of-equal-squares",
  title: t("Counting the classes of equal squares", "计算平方相等的等价类"),
  explanation: t(
    "Any function defines an equivalence relation, by calling two elements related when they have the same image. The classes then correspond one-to-one with the different values that the function takes. So counting classes of $x \\sim y$ when $x^2 \\equiv y^2 \\pmod n$ is the same as counting the different squares modulo $n$. For an odd prime $p$, the residues $x$ and $-x$ pair up, apart from 0, so there are $\\frac{p + 1}{2}$ classes. Modulo $8$, the squares of $0, \\dots, 7$ leave $0, 1, 4, 1, 0, 1, 4, 1$: three classes.\n\n> **Watch out.** For a modulus that is not prime, more than two residues can share a square, as $1, 3, 5, 7$ do modulo $8$. List the squares instead of assuming $\\frac{n + 1}{2}$.",
    "任何函数都定义一个等价关系：两个元素的像相同时称它们相关。于是等价类与函数取到的不同值一一对应。所以当 $x^2 \\equiv y^2 \\pmod n$ 时 $x \\sim y$ 的类的个数，就是模 $n$ 的不同平方数的个数。对奇素数 $p$，除 0 以外，$x$ 和 $-x$ 配对，所以有 $\\frac{p + 1}{2}$ 个类。模 $8$ 时，$0, \\dots, 7$ 的平方余 $0, 1, 4, 1, 0, 1, 4, 1$：共三个类。\n\n> **注意。** 模不是素数时，可能有两个以上的余数平方相同，例如模 $8$ 的 $1, 3, 5, 7$。要列出平方，而不是假定个数是 $\\frac{n + 1}{2}$。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const half = Math.floor(n / 2);
    const firstSquares = [...Array(half + 1).keys()].map((x) => (x * x) % n);
    const values = [...new Set(firstSquares)].sort((a, b) => a - b);
    const answer = values.length;
    const r = half + 1;
    return numberProblem({
      prompt: t(
        `On $\\{0, 1, \\dots, ${n - 1}\\}$, let $x \\sim y$ when $x^2 \\equiv y^2 \\pmod{${n}}$. How many equivalence classes are there?`,
        `在 $\\{0, 1, \\dots, ${n - 1}\\}$ 上，当 $x^2 \\equiv y^2 \\pmod{${n}}$ 时令 $x \\sim y$。共有多少个等价类？`,
      ),
      answer,
      form: "integer",
      wrong: [totient(n), answer + 1],
      mistakes: firstOf([
        why(
          half + 1,
          "That pairs only $x$ with $-x$; other residues can share a square as well.",
          "这只把 $x$ 与 $-x$ 配对；其他余数也可能平方相同。",
        ),
        why(
          n,
          "That counts the elements; elements with the same square share one class.",
          "这数的是元素个数；平方相同的元素属于同一个类。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Halve the work", "减半"],
            t(
              `$x$ and $${n} - x$ have the same square, so squaring $0, \\dots, ${half}$ finds every value.`,
              `$x$ 与 $${n} - x$ 的平方相同，所以只需把 $0, \\dots, ${half}$ 平方就能找到所有值。`,
            ),
          ],
          [
            ["Square them", "平方"],
            t(`Modulo $${n}$, the squares are $${firstSquares.join(", ")}$.`, `模 $${n}$，这些平方为 $${firstSquares.join(", ")}$。`),
          ],
          [
            ["Count the different values", "数不同的值"],
            t(
              `The different values are $${values.join(", ")}$, one class each: $${answer}$ classes.`,
              `不同的值是 $${values.join(", ")}$，每个对应一个类：共 $${answer}$ 个类。`,
            ),
          ],
        ],
        t(
          `A residue past $${half}$ adds nothing new: $${r}^2 = ${r * r}$ leaves $${(r * r) % n}$, the same as $${n - r}^2$.`,
          `超过 $${half}$ 的余数不会带来新值：$${r}^2 = ${r * r}$ 余 $${(r * r) % n}$，与 $${n - r}^2$ 相同。`,
        ),
      ),
    });
  },
};

const modulusOfCongruence: KnowledgePointDef = {
  id: "counting-the-moduli-for-which-two-numbers-are-congruent",
  title: t("Counting the moduli for which two numbers are congruent", "计算使两数同余的模"),
  explanation: t(
    "By definition, $a \\equiv b \\pmod m$ means that $m$ divides $a - b$. So the moduli that make two given numbers congruent are exactly the divisors of their difference. Moduli are usually taken to be greater than 1, which removes one divisor from the count. The size of the numbers does not matter, only their difference, so that a question about large numbers can come down to factoring a small one.\n\n> **Watch out.** Only divisors of the difference work, not every number up to it, and $m = 1$ is left out of the count.",
    "按定义，$a \\equiv b \\pmod m$ 意味着 $m$ 整除 $a - b$。所以使两个给定的数同余的模，恰好是它们之差的因数。模通常取大于 1 的数，这样要从个数中去掉一个因数。这两个数本身的大小不重要，只有差才重要，所以关于大数的问题可以归结为分解一个小数。\n\n> **注意。** 只有差的因数才行，而不是不超过差的每个数，并且 $m = 1$ 不计入。",
  ),
  generate(rng) {
    const a = rng.int(1, 200);
    const difference = rng.int(4, 120);
    const b = a + difference;
    const divisors = divisorsOf(difference);
    const answer = divisors.length - 1;
    const pairs = divisors.filter((d) => d * d <= difference).map((d) => `${d} \\cdot ${difference / d}`);
    return numberProblem({
      prompt: t(
        `For how many integers $m > 1$ is $${b} \\equiv ${a} \\pmod m$ true?`,
        `有多少个整数 $m > 1$ 使 $${b} \\equiv ${a} \\pmod m$ 成立？`,
      ),
      answer,
      form: "integer",
      wrong: [divisors.length, difference, difference - 1, answer + 2],
      mistakes: firstOf([
        why(divisors.length, "That includes $m = 1$, which the question leaves out.", "这包括了 $m = 1$，而题目不计入它。"),
        why(
          difference,
          `Not every number up to $${difference}$ works; only its divisors do.`,
          `并不是不超过 $${difference}$ 的每个数都行；只有它的因数才行。`,
        ),
        why(
          difference - 1,
          `Not every number from $2$ to $${difference}$ works; only the divisors of $${difference}$ do.`,
          `并不是 $2$ 到 $${difference}$ 的每个数都行；只有 $${difference}$ 的因数才行。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Take the difference", "求差"],
            t(`$m$ must divide $${b} - ${a} = ${difference}$.`, `$m$ 必须整除 $${b} - ${a} = ${difference}$。`),
          ],
          [
            ["Count the divisors above 1", "数出大于 1 的因数"],
            t(
              `The divisors of $${difference}$ are $${divisors.join(", ")}$: $${divisors.length}$ of them, and leaving out $1$ gives $${answer}$.`,
              `$${difference}$ 的因数是 $${divisors.join(", ")}$：共 $${divisors.length}$ 个，去掉 $1$ 得 $${answer}$。`,
            ),
          ],
        ],
        t(
          `The divisors come in pairs with product $${difference}$: $${pairs.join(", \\ ")}$, which accounts for all $${divisors.length}$.`,
          `因数成对出现，乘积为 $${difference}$：$${pairs.join(", \\ ")}$，正好是全部 $${divisors.length}$ 个。`,
        ),
      ),
    });
  },
};

const injectiveMultiplications: KnowledgePointDef = {
  id: "counting-the-injective-multiplications-modulo-n",
  title: t("Counting the injective multiplications modulo n", "计算模 n 的单射乘法"),
  explanation: t(
    "The function $f(x) = ax$ on the residues modulo $n$ is injective exactly when $\\gcd(a, n) = 1$. If $ax \\equiv ay$, then $n$ divides $a(x - y)$, and when $a$ and $n$ share no factor, $n$ must divide $x - y$. If they do share a factor $d > 1$, then $f(\\frac{n}{d}) = f(0)$ gives two inputs with the same image. A function from a finite set to itself that is injective is also surjective. Modulo $8$, $a = 3$ gives the outputs $0, 3, 6, 1, 4, 7, 2, 5$, all different, while $a = 2$ gives $f(4) = 0 = f(0)$.\n\n> **Watch out.** Being nonzero is not enough: $a$ must share no factor with $n$. And $a = n$ acts as $0$, sending everything to $0$.",
    "模 $n$ 剩余上的函数 $f(x) = ax$ 是单射，当且仅当 $\\gcd(a, n) = 1$。如果 $ax \\equiv ay$，那么 $n$ 整除 $a(x - y)$，当 $a$ 与 $n$ 没有公因数时，$n$ 必须整除 $x - y$。如果它们有公因数 $d > 1$，那么 $f(\\frac{n}{d}) = f(0)$，两个输入有相同的像。有限集到自身的单射也是满射。模 $8$ 时，$a = 3$ 给出输出 $0, 3, 6, 1, 4, 7, 2, 5$，互不相同；而 $a = 2$ 给出 $f(4) = 0 = f(0)$。\n\n> **注意。** 不为零还不够：$a$ 必须与 $n$ 没有公因数。而 $a = n$ 相当于 $0$，把一切都映到 $0$。",
  ),
  generate(rng) {
    const n = rng.int(4, 60);
    const answer = totient(n);
    const primes = divisorsOf(n).filter((d) => d > 1 && divisorsOf(d).length === 2);
    const product = primes.map((p) => `\\left(1 - \\frac{1}{${p}}\\right)`).join("");
    const p = primes[0] ?? 2;
    return numberProblem({
      prompt: t(
        `For how many values of $a$ in $\\{1, 2, \\dots, ${n}\\}$ is the function $f(x) = ax$ on the residues modulo ${n} injective?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 中有多少个 $a$，使模 ${n} 剩余上的函数 $f(x) = ax$ 是单射？`,
      ),
      answer,
      form: "integer",
      wrong: [answer + 1],
      mistakes: firstOf([
        why(
          n - 1,
          `A nonzero $a$ that shares a factor with $${n}$ still sends two inputs to the same place.`,
          `与 $${n}$ 有公因数的非零 $a$ 仍会把两个输入映到同一处。`,
        ),
        why(
          n,
          `$a = ${n}$ acts as $0$, and an $a$ sharing a factor with $${n}$ is not injective.`,
          `$a = ${n}$ 相当于 $0$，而与 $${n}$ 有公因数的 $a$ 不是单射。`,
        ),
        why(
          Math.floor(n / 2),
          "Being odd is not the test; $a$ must share no prime factor with the modulus.",
          "判断标准不是奇数；$a$ 必须与模数没有公共素因数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["State the test", "写出判别条件"],
            t(`$f(x) = ax$ is injective exactly when $\\gcd(a, ${n}) = 1$.`, `$f(x) = ax$ 是单射当且仅当 $\\gcd(a, ${n}) = 1$。`),
          ],
          [
            ["Count those a", "数这样的 a"],
            t(
              `The primes dividing $${n}$ are $${primes.join(", ")}$, so $\\varphi(${n}) = ${n}${product} = ${answer}$.`,
              `整除 $${n}$ 的素数是 $${primes.join(", ")}$，所以 $\\varphi(${n}) = ${n}${product} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$a = ${p}$ shares the factor $${p}$ and is left out: indeed $f(${n / p}) = ${p} \\cdot ${n / p} = ${n} \\equiv 0 = f(0)$.`,
          `$a = ${p}$ 有公因数 $${p}$，所以不计入：确实 $f(${n / p}) = ${p} \\cdot ${n / p} = ${n} \\equiv 0 = f(0)$。`,
        ),
      ),
    });
  },
};

const oddTriangularNumbers: KnowledgePointDef = {
  id: "counting-the-odd-triangular-numbers",
  title: t("Counting the odd triangular numbers", "计算奇三角形数的个数"),
  explanation: t(
    "The parity of the triangular number $T_k = \\frac{k(k + 1)}{2}$ follows a pattern of period four: odd, odd, even, even. It is not enough to look at $k$ and $k + 1$ alone, because one of them is always even and the factor 2 cancels part of it. Only when the even one is a multiple of 4 is $T_k$ even. So $T_k$ is odd when $k$ leaves a remainder of 1 or 2 on division by 4.\n\n> **Watch out.** The product $k(k + 1)$ is always even, but halving it can remove its only factor $2$. So the parity of $T_k$ depends on $k$ modulo $4$, not modulo $2$.",
    "三角形数 $T_k = \\frac{k(k + 1)}{2}$ 的奇偶性呈周期为四的规律：奇、奇、偶、偶。只看 $k$ 和 $k + 1$ 不够，因为其中总有一个是偶数，而因子 2 会消去它的一部分。只有当那个偶数是 4 的倍数时，$T_k$ 才是偶数。所以当 $k$ 除以 4 余 1 或 2 时，$T_k$ 是奇数。\n\n> **注意。** 乘积 $k(k + 1)$ 总是偶数，但减半可能去掉它唯一的因子 $2$。所以 $T_k$ 的奇偶性取决于 $k$ 除以 $4$ 的余数，而不是除以 $2$ 的余数。",
  ),
  generate(rng) {
    const n = rng.int(5, 60);
    const answer = oneTo(n).filter((k) => k % 4 === 1 || k % 4 === 2).length;
    const blocks = Math.floor(n / 4);
    const rest = n % 4;
    return numberProblem({
      prompt: t(
        `How many of the numbers $\\frac{k(k + 1)}{2}$, for $k = 1, 2, \\dots, ${n}$, are odd?`,
        `当 $k = 1, 2, \\dots, ${n}$ 时，数 $\\frac{k(k + 1)}{2}$ 中有多少个是奇数？`,
      ),
      answer,
      form: "integer",
      wrong: [n, answer + 1],
      mistakes: firstOf([
        why(n - answer, "That counts the even ones.", "这数的是偶数。"),
        why(blocks, "Each block of four values of $k$ gives two odd numbers, not one.", "每四个连续的 $k$ 给出两个奇数，而不是一个。"),
        why(
          Math.ceil(n / 2),
          "That assumes odd and even alternate; the pattern has period four: odd, odd, even, even.",
          "这假设奇偶交替出现；实际规律的周期是四：奇、奇、偶、偶。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the pattern", "找规律"],
            t(
              "$T_k$ is odd exactly when $k$ leaves remainder $1$ or $2$ on division by $4$, since only then is the even one of $k$ and $k + 1$ not a multiple of $4$.",
              "当且仅当 $k$ 除以 $4$ 余 $1$ 或 $2$ 时 $T_k$ 是奇数，因为只有这时 $k$ 与 $k + 1$ 中的偶数不是 $4$ 的倍数。",
            ),
          ],
          [
            ["Count", "计数"],
            t(
              `$${n} = 4 \\cdot ${blocks} + ${rest}$. Each of the $${blocks}$ full blocks gives $2$, and the last $${rest}$ values give $${Math.min(rest, 2)}$: $2 \\cdot ${blocks} + ${Math.min(rest, 2)} = ${answer}$.`,
              `$${n} = 4 \\cdot ${blocks} + ${rest}$。$${blocks}$ 个完整的段各给出 $2$ 个，最后 $${rest}$ 个值给出 $${Math.min(rest, 2)}$ 个：$2 \\cdot ${blocks} + ${Math.min(rest, 2)} = ${answer}$。`,
            ),
          ],
        ],
        t(
          "The first eight are $1, 3, 6, 10, 15, 21, 28, 36$: odd, odd, even, even, odd, odd, even, even.",
          "前八个是 $1, 3, 6, 10, 15, 21, 28, 36$：奇、奇、偶、偶、奇、奇、偶、偶。",
        ),
      ),
    });
  },
};

const factorialBeatsPower: KnowledgePointDef = {
  id: "the-smallest-n-where-a-factorial-beats-a-power",
  title: t("The smallest n where a factorial beats a power", "阶乘超过幂的最小 n"),
  explanation: t(
    "Before an inductive proof of an inequality such as $n! > ca^n$ can start, the right base case must be found, by testing small values. The inductive step then goes through as soon as $n + 1 \\ge a$, because the left side is multiplied by $n + 1$ and the right side only by $a$. So the factorial must win eventually, whatever the values of $a$ and $c$, even though it starts off behind the power.\n\n> **Watch out.** The factorial starts behind, so test the values one by one up to the first win. A guess such as $n = a$ is usually too early.",
    "在用归纳法证明像 $n! > ca^n$ 这样的不等式之前，必须通过试小值找到正确的基础情形。只要 $n + 1 \\ge a$，归纳步骤就能完成，因为左边乘以 $n + 1$，而右边只乘以 $a$。所以无论 $a$ 和 $c$ 取什么值，阶乘最终一定会胜出，尽管开始时它落后于幂。\n\n> **注意。** 阶乘开始时落后，所以要逐个检验，直到第一次胜出。像 $n = a$ 这样的猜测通常太早。",
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
      wrong: [a + 1],
      mistakes: firstOf([
        why(
          n - 1,
          `At $n = ${n - 1}$ the factorial is still behind: $${previousLeft} \\le ${previousRight}$.`,
          `$n = ${n - 1}$ 时阶乘仍然落后：$${previousLeft} \\le ${previousRight}$。`,
        ),
        why(
          n + 1,
          `The factorial already wins at $n = ${n}$: $${left} > ${right}$.`,
          `阶乘在 $n = ${n}$ 时已经胜出：$${left} > ${right}$。`,
        ),
        why(
          a,
          `That is where the inductive step starts to work, not where the factorial first wins.`,
          `这是归纳步骤开始可行的地方，而不是阶乘第一次胜出的地方。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Test the values", "检验各值"],
            t(
              `At $n = ${n - 1}$ the two sides are $${previousLeft}$ and $${previousRight}$, so the factorial is still behind. At $n = ${n}$ they are $${left}$ and $${right}$, so it wins.`,
              `$n = ${n - 1}$ 时两边分别是 $${previousLeft}$ 和 $${previousRight}$，阶乘仍落后。$n = ${n}$ 时它们是 $${left}$ 和 $${right}$，阶乘胜出。`,
            ),
          ],
          [
            ["Check that it keeps winning", "确认之后一直胜出"],
            t(
              `From here each step multiplies the left side by at least $${n + 1}$ and the right side by only $${a}$, so $n = ${n}$ is the base case.`,
              `从这里起，每一步左边至少乘以 $${n + 1}$，右边只乘以 $${a}$，所以 $n = ${n}$ 就是基础情形。`,
            ),
          ],
        ],
        t(
          `At $n = ${n + 1}$: $${left * (n + 1)} > ${right * a}$, as the step predicts.`,
          `$n = ${n + 1}$ 时：$${left * (n + 1)} > ${right * a}$，与归纳步骤的预期一致。`,
        ),
      ),
    });
  },
};

const triplesWithSum: KnowledgePointDef = {
  id: "counting-the-triples-of-a-sum-relation",
  title: t("Counting the triples of a sum relation", "计算和关系中的三元组"),
  explanation: t(
    "A ternary relation is a set of triples, and its size can sometimes be found by a clever encoding. A triple of positive integers adding to $k$ corresponds to a choice of two cut points among the $k - 1$ gaps between $k$ objects in a row. Each choice gives three nonempty blocks, whose sizes form the triple. So the count is $\\binom{k - 1}{2}$, and the order within the triple is taken into account automatically. For $k = 5$: $\\binom{4}{2} = 6$ triples, such as $(1, 1, 3)$ and $(3, 1, 1)$.\n\n> **Watch out.** The cuts go in the $k - 1$ gaps between objects, not at the $k + 1$ positions including the ends: a cut at an end would leave an empty block, which is a zero.",
    "三元关系是三元组的集合，它的大小有时可以通过巧妙的编码求得。和为 $k$ 的正整数三元组，对应于在一行 $k$ 个对象之间的 $k - 1$ 个空隙中选两个切点。每种选法给出三个非空段，它们的大小构成三元组。所以个数是 $\\binom{k - 1}{2}$，三元组内的顺序也自动考虑在内。当 $k = 5$ 时：共 $\\binom{4}{2} = 6$ 个三元组，例如 $(1, 1, 3)$ 和 $(3, 1, 1)$。\n\n> **注意。** 切点放在对象之间的 $k - 1$ 个空隙中，而不是连同两端在内的 $k + 1$ 个位置：切在端点会留下空段，也就是 $0$。",
  ),
  generate(rng) {
    const k = rng.int(4, 40);
    const answer = binom(k - 1, 2);
    const byX = [...Array(k - 2).keys()].map((i) => k - 2 - i);
    return numberProblem({
      prompt: t(
        `The relation $R$ on the positive integers holds for $(x, y, z)$ when $x + y + z = ${k}$. How many triples does $R$ contain?`,
        `正整数上的关系 $R$ 在 $x + y + z = ${k}$ 时对 $(x, y, z)$ 成立。$R$ 包含多少个三元组？`,
      ),
      answer,
      form: "integer",
      wrong: [k * k, answer + 1],
      mistakes: firstOf([
        why(
          binom(k, 2),
          `That chooses from $${k}$ gaps; between $${k}$ objects there are only $${k - 1}$.`,
          `这是从 $${k}$ 个空隙中选；$${k}$ 个对象之间只有 $${k - 1}$ 个空隙。`,
        ),
        why(binom(k + 2, 2), "That allows zeros; the entries must be positive.", "这允许出现 $0$；三元组的分量必须是正数。"),
      ]),
      solution: walked(
        [
          [
            ["Encode the triples", "编码三元组"],
            t(
              `Line up $${k}$ objects; two cuts in the $${k - 1}$ gaps split them into blocks of sizes $x$, $y$, $z$, all positive.`,
              `把 $${k}$ 个对象排成一行；在 $${k - 1}$ 个空隙中切两刀，分成大小为 $x$、$y$、$z$ 的三段，都是正数。`,
            ),
          ],
          [["Count the cuts", "数切法"], t(`$\\binom{${k - 1}}{2} = ${answer}$.`, `$\\binom{${k - 1}}{2} = ${answer}$。`)],
        ],
        t(
          `Fixing $x$ instead: $x = 1$ leaves $${k - 2}$ choices of $y$, $x = 2$ leaves $${k - 3}$, and so on, which gives $${byX.slice(0, 2).join(" + ")} + \\dots + 1 = ${answer}$.`,
          `改为先固定 $x$：$x = 1$ 时 $y$ 有 $${k - 2}$ 种取法，$x = 2$ 时有 $${k - 3}$ 种，依此类推，得 $${byX.slice(0, 2).join(" + ")} + \\dots + 1 = ${answer}$。`,
        ),
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
