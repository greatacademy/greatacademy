// Third knowledge points for thin topics of Methods of Proof, on induction, limits, cardinality,
// congruences and relations: the reverse question, a harder case or a common trap.
// See `deeperMethodsOfProofThird2Points`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, choose, divisors, point, powMod, same } from "../university-kit.ts";
import { gcd, lcm } from "./deeper-methods-of-proof-third.ts";

/** pairs writes a list of ordered pairs. */
const pairs = (list: readonly (readonly [number, number])[]) => list.map(([a, b]) => `(${a}, ${b})`).join(", ");

const baseCaseMatters = point(
  "the-base-case-an-inductive-step-cannot-supply",
  ["The base case an inductive step cannot supply", "归纳步骤无法提供的基础情形"],
  [
    "An inductive step can succeed even when the claim is false, because it only passes truth along. For $d \\mid a^{n} + c$ with $d \\mid a - 1$, the step works for every $c$, so the base case alone decides which values of $c$ make the claim true.",
    "即使命题不成立，归纳步骤也可能成功，因为它只是传递真值。对于 $d \\mid a^{n} + c$，当 $d \\mid a - 1$ 时，归纳步骤对每个 $c$ 都成立，所以只有基础情形决定哪些 $c$ 使命题成立。",
  ],
  (rng) => {
    const d = rng.int(2, 9);
    const a = d * rng.int(1, 3) + 1;
    const low = rng.int(5, 40);
    let c = low + 1;
    while ((a + c) % d !== 0) c++;
    const plain = low + 1 + ((d - ((low + 1) % d)) % d);
    return ask(
      [
        `For which smallest integer $c > ${low}$ does $${d} \\mid ${a}^{n} + c$ hold for every positive integer $n$?`,
        `对于大于 $${low}$ 的哪个最小整数 $c$，$${d} \\mid ${a}^{n} + c$ 对每个正整数 $n$ 都成立？`,
      ],
      c,
      [c + d, plain === c ? c + 1 : plain, low + 1 === c ? c + 2 : low + 1],
      [
        `Since $${a}^{k+1} + c = ${a}(${a}^{k} + c) - ${a - 1}c$ and $${d} \\mid ${a - 1}$, the step holds for any $c$. The base case needs $${d} \\mid ${a} + c$, and the smallest such $c$ above $${low}$ is $${c}$.`,
        `由于 $${a}^{k+1} + c = ${a}(${a}^{k} + c) - ${a - 1}c$ 且 $${d} \\mid ${a - 1}$，所以归纳步骤对任何 $c$ 都成立。基础情形要求 $${d} \\mid ${a} + c$，大于 $${low}$ 的最小 $c$ 是 $${c}$。`,
      ],
    );
  },
);

const smallestNForNull = point(
  "the-exact-n-for-a-null-sequence",
  ["The exact N for a null sequence", "零序列的精确 N"],
  [
    "For a decreasing sequence, the definition of the limit can be solved exactly. The inequality $|a_{n}| < \\varepsilon$ is strict, so when the boundary value is a whole number, $N$ must be one more than it, since the boundary term only equals $\\varepsilon$.",
    "对于递减序列，极限的定义可以精确求解。不等式 $|a_{n}| < \\varepsilon$ 是严格的，所以当边界值是整数时，$N$ 必须比它大一，因为边界项只是等于 $\\varepsilon$。",
  ],
  (rng) => {
    const c = rng.int(2, 9);
    const b = rng.int(1, 9);
    const m = rng.pick([10, 20, 50, 100, 200]);
    const edge = c * m - b;
    const answer = edge + 1;
    return ask(
      [
        `Let $a_{n} = \\dfrac{${c}}{n + ${b}}$ and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ with $|a_{n}| < \\varepsilon$ for all $n \\ge N$.`,
        `设 $a_{n} = \\dfrac{${c}}{n + ${b}}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使 $|a_{n}| < \\varepsilon$ 对所有 $n \\ge N$ 成立。`,
      ],
      answer,
      [edge, c * m + 1, c * m],
      [
        `The inequality means $n + ${b} > ${c * m}$, so $n > ${edge}$. At $n = ${edge}$ the term equals $\\varepsilon$, so the smallest $N$ is $${answer}$.`,
        `不等式相当于 $n + ${b} > ${c * m}$，所以 $n > ${edge}$。当 $n = ${edge}$ 时，这一项等于 $\\varepsilon$，所以最小的 $N$ 是 $${answer}$。`,
      ],
    );
  },
);

const quadraticLimit = point(
  "the-n-for-a-quadratic-ratio",
  ["The N for a quadratic ratio", "二次比值的 N"],
  [
    "With squares on top and bottom, the distance to the limit is a constant over $n^{2} + c$. So the inequality gives a bound on $n^{2}$, and a square root appears in the answer for $N$. This is a harder case of the same procedure as for linear ratios.",
    "分子分母都有平方时，到极限的距离是一个常数除以 $n^{2} + c$。所以不等式给出 $n^{2}$ 的界，$N$ 的答案中出现平方根。这是与线性比值相同步骤的更难情形。",
  ],
  (rng) => {
    const a = rng.int(2, 5);
    const c = rng.int(1, 9);
    let b = rng.int(1, 30);
    if (b === a * c) b += 1;
    const m = rng.pick([10, 20, 100]);
    const K = Math.abs(b - a * c);
    const bound = K * m - c;
    const answer = Math.floor(Math.sqrt(bound)) + 1;
    return ask(
      [
        `Let $a_{n} = \\dfrac{${a}n^{2} + ${b}}{n^{2} + ${c}}$, which tends to $${a}$, and $\\varepsilon = \\dfrac{1}{${m}}$. Find the smallest positive integer $N$ with $|a_{n} - ${a}| < \\varepsilon$ for all $n \\ge N$.`,
        `设 $a_{n} = \\dfrac{${a}n^{2} + ${b}}{n^{2} + ${c}}$，它趋于 $${a}$，$\\varepsilon = \\dfrac{1}{${m}}$。求最小的正整数 $N$，使 $|a_{n} - ${a}| < \\varepsilon$ 对所有 $n \\ge N$ 成立。`,
      ],
      answer,
      [answer + 1, bound + 1, Math.floor(Math.sqrt(K * m)) + 2],
      [
        `The distance is $\\dfrac{${K}}{n^{2} + ${c}}$. The inequality becomes $n^{2} > ${bound}$, and the smallest such positive integer is $${answer}$, after which the distance keeps decreasing.`,
        `距离是 $\\dfrac{${K}}{n^{2} + ${c}}$。不等式变为 $n^{2} > ${bound}$，满足它的最小正整数是 $${answer}$，此后距离继续减小。`,
      ],
    );
  },
);

const quadraticInfinite = point(
  "the-n-for-a-sequence-that-dips-first",
  ["The N for a sequence that dips first", "先下降的序列的 N"],
  [
    "A sequence with an infinite limit need not increase from the start. For $n^{2} - bn$, the early terms fall before growing, and solving the quadratic inequality still gives the threshold, with the positive root marking where the terms stay above $M$.",
    "极限为无穷的序列不一定从一开始就递增。对于 $n^{2} - bn$，前面的项会先下降再增长，解二次不等式仍能得到阈值，正根标出了此后各项一直高于 $M$ 的位置。",
  ],
  (rng) => {
    const b = rng.int(1, 12);
    const M = rng.int(50, 600);
    const f = (n: number) => n * n - b * n;
    let N = Math.ceil(Math.sqrt(M)) + b + 5;
    while (N > 1 && f(N - 1) > M) N--;
    const root = ((b + Math.sqrt(b * b + 4 * M)) / 2).toFixed(2);
    const expr = poly([1, "n^{2}"], [-b, "n"]);
    return ask(
      [
        `Let $a_{n} = ${expr}$ and $M = ${M}$. Find the smallest positive integer $N$ such that $a_{n} > M$ for all $n \\ge N$.`,
        `设 $a_{n} = ${expr}$，$M = ${M}$。求最小的正整数 $N$，使 $a_{n} > M$ 对所有 $n \\ge N$ 成立。`,
      ],
      N,
      [N + 1, N - 1, Math.ceil(Math.sqrt(M)) === N ? N + 2 : Math.ceil(Math.sqrt(M))],
      [
        `The inequality $${expr} - ${M} > 0$ has positive root about $${root}$. So it holds for $n$ above this root, and the smallest such integer is $${N}$.`,
        `不等式 $${expr} - ${M} > 0$ 的正根约为 $${root}$。所以当 $n$ 大于这个根时成立，满足条件的最小整数是 $${N}$。`,
      ],
    );
  },
);

const minusInfinity = point(
  "proving-a-limit-of-minus-infinity",
  ["Proving a limit of minus infinity", "证明极限为负无穷"],
  [
    "For a limit of $-\\infty$, the definition reverses: given any $M$, however negative, the terms must eventually stay below it. Solving the inequality involves dividing by a negative coefficient, which flips the inequality and gives a lower bound on $N$.",
    "对于极限为 $-\\infty$，定义要反过来：给定任意 $M$，无论多么小，各项最终都必须低于它。解不等式时要除以负系数，不等号会翻转，从而得到 $N$ 的下界。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(1, 30);
    const expr = poly([b, ""], [-a, "n"]);
    return choose(
      rng,
      [
        `To prove $${expr} \\to -\\infty$, given $M < ${b}$, which condition on $N$ ensures $a_{n} < M$ for all $n \\ge N$?`,
        `要证明 $${expr} \\to -\\infty$，给定 $M < ${b}$，$N$ 满足什么条件能保证 $a_{n} < M$ 对所有 $n \\ge N$ 成立？`,
      ],
      same(`N > \\frac{${b} - M}{${a}}`),
      [same(`N > \\frac{M - ${b}}{${a}}`), same(`N < \\frac{${b} - M}{${a}}`), same(`N > \\frac{${b} + M}{${a}}`)],
      [
        `We need $${expr} < M$, so $${a}n > ${b} - M$ and $n > \\frac{${b} - M}{${a}}$. Taking $N$ above this value works for all larger $n$ as well.`,
        `需要 $${expr} < M$，所以 $${a}n > ${b} - M$，$n > \\frac{${b} - M}{${a}}$。取 $N$ 大于这个值，对所有更大的 $n$ 也成立。`,
      ],
    );
  },
);

const missedResidues = point(
  "how-far-a-map-is-from-surjective",
  ["How far a map is from surjective", "映射离满射有多远"],
  [
    "A map is surjective when it misses nothing, and counting the missed elements measures the failure. For multiplication by $a$ on residues modulo $m$, the image is exactly the multiples of $\\gcd(a, m)$, so the map is surjective only when this greatest common divisor is one.",
    "映射不遗漏任何元素时是满射，计算遗漏的元素就能衡量它的不足。对模 $m$ 的剩余类乘以 $a$，像恰好是 $\\gcd(a, m)$ 的倍数，所以只有当这个最大公约数为一时才是满射。",
  ],
  (rng) => {
    const m = rng.int(6, 40);
    const a = rng.int(2, m - 1);
    const g = gcd(a, m);
    const image = m / g;
    const answer = m - image;
    return ask(
      [
        `Let $f: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${m}}$ be $f(x) = ${a}x$. How many elements of the codomain are not in the image of $f$?`,
        `设 $f: \\mathbb{Z}_{${m}} \\to \\mathbb{Z}_{${m}}$，$f(x) = ${a}x$。陪域中有多少个元素不在 $f$ 的像中？`,
      ],
      answer,
      [image, g, m - g],
      [
        `The image is the set of multiples of $\\gcd(${a}, ${m}) = ${g}$, which has $${image}$ elements. So $${m} - ${image} = ${answer}$ elements are missed.`,
        `像是 $\\gcd(${a}, ${m}) = ${g}$ 的倍数组成的集合，有 $${image}$ 个元素。所以遗漏了 $${m} - ${image} = ${answer}$ 个元素。`,
      ],
    );
  },
);

const cantorPairing = point(
  "the-cantor-pairing-function",
  ["The Cantor pairing function", "康托尔配对函数"],
  [
    "The formula $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$ numbers the pairs of naturals along diagonals. It is a bijection from $\\mathbb{N} \\times \\mathbb{N}$ onto $\\mathbb{N}$, which shows that a product of two countable sets is countable. The triangular number counts the earlier diagonals.",
    "公式 $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$ 沿对角线给自然数对编号。它是从 $\\mathbb{N} \\times \\mathbb{N}$ 到 $\\mathbb{N}$ 的双射，说明两个可数集的乘积是可数的。其中的三角形数计算前面各条对角线上的点数。",
  ],
  (rng) => {
    const x = rng.int(0, 14);
    const y = rng.int(0, 14);
    const s = x + y;
    const tri = (s * (s + 1)) / 2;
    const answer = tri + y;
    return ask(
      [
        `The bijection $\\pi: \\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$ is $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$. Find $\\pi(${x}, ${y})$.`,
        `双射 $\\pi: \\mathbb{N} \\times \\mathbb{N} \\to \\mathbb{N}$ 为 $\\pi(x, y) = \\frac{(x + y)(x + y + 1)}{2} + y$。求 $\\pi(${x}, ${y})$。`,
      ],
      answer,
      [tri, tri + x + 1, s * (s + 1) + y],
      [
        `Here $x + y = ${s}$, so the earlier diagonals contain $\\frac{${s} \\cdot ${s + 1}}{2} = ${tri}$ pairs. Adding $y = ${y}$ gives $${answer}$.`,
        `这里 $x + y = ${s}$，所以前面的对角线共有 $\\frac{${s} \\cdot ${s + 1}}{2} = ${tri}$ 个数对。加上 $y = ${y}$，得 $${answer}$。`,
      ],
    );
  },
);

const intervalRayInverse = point(
  "inverting-a-bijection-onto-a-ray",
  ["Inverting a bijection onto a ray", "求到射线的双射的逆"],
  [
    "The map $f(x) = \\frac{x - a}{b - x}$ sends $(a, b)$ onto $(0, \\infty)$. Finding the input for a given output proves surjectivity, and solving the equation gives $x = \\frac{a + by}{1 + y}$, which always lies between $a$ and $b$ when $y$ is positive.",
    "映射 $f(x) = \\frac{x - a}{b - x}$ 把 $(a, b)$ 映到 $(0, \\infty)$ 上。求给定输出对应的输入就能证明满射性，解方程得 $x = \\frac{a + by}{1 + y}$，当 $y$ 为正时它总在 $a$ 与 $b$ 之间。",
  ],
  (rng) => {
    const a = rng.int(-9, 9);
    const b = a + rng.int(1, 9);
    const y = rng.int(1, 12);
    const answer = Q.of(a + b * y, 1 + y);
    const fx = `\\dfrac{${poly([1, "x"], [-a, ""])}}{${poly([b, ""], [-1, "x"])}}`;
    return ask(
      [
        `The function $f(x) = ${fx}$ is a bijection from $(${a}, ${b})$ onto $(0, \\infty)$. Find the $x$ with $f(x) = ${y}$.`,
        `函数 $f(x) = ${fx}$ 是从 $(${a}, ${b})$ 到 $(0, \\infty)$ 的双射。求满足 $f(x) = ${y}$ 的 $x$。`,
      ],
      answer,
      [Q.of(b + a * y, 1 + y), Q.of(a + b * y, y), Q.of(a + y, 1 + y)],
      [
        `The equation gives $${poly([1, "x"], [-a, ""])} = ${y}(${poly([b, ""], [-1, "x"])})$, so $${1 + y}x = ${a + b * y}$ and $x = ${answer.toLatex()}$. This value lies inside the interval.`,
        `方程给出 $${poly([1, "x"], [-a, ""])} = ${y}(${poly([b, ""], [-1, "x"])})$，所以 $${1 + y}x = ${a + b * y}$，$x = ${answer.toLatex()}$。这个值在区间内。`,
      ],
    );
  },
);

const diagonalDistance = point(
  "how-the-diagonal-sequence-differs-from-a-row",
  ["How the diagonal sequence differs from a row", "对角序列与某一行的差异"],
  [
    "The diagonal sequence is built to differ from the $k$-th row at position $k$. It may differ at other positions too, but this one guaranteed position is all that the argument uses, and it works for every row in the list at once.",
    "对角序列的构造保证它与第 $k$ 行在第 $k$ 位不同。它也可能在其他位置不同，但论证只用到这个有保证的位置，并且它同时对列表中的每一行都有效。",
  ],
  (rng) => {
    const rows = [0, 1, 2, 3, 4].map(() => [0, 1, 2, 3, 4].map(() => rng.int(0, 1)));
    const diagonal = rows.map((r, i) => 1 - (r[i] as number));
    const k = rng.int(0, 4);
    const row = rows[k] as number[];
    const answer = diagonal.filter((v, i) => v !== row[i]).length;
    const list = rows.map((r, i) => `s_{${i + 1}} = ${r.join("")}`).join(",\\ ");
    return ask(
      [
        `Let $${list}$. Let $d$ be the sequence obtained by flipping the diagonal digits. In how many of the $5$ positions does $d$ differ from $s_{${k + 1}}$?`,
        `设 $${list}$。令 $d$ 为翻转对角线上的数字得到的序列。$d$ 与 $s_{${k + 1}}$ 在 $5$ 个位置中有多少个不同？`,
      ],
      answer,
      [(answer + 1) % 6, (answer + 2) % 6, (answer + 3) % 6],
      [
        `Flipping the diagonal gives $d = ${diagonal.join("")}$. Comparing it digit by digit with $s_{${k + 1}} = ${row.join("")}$ gives $${answer}$ differences, including position $${k + 1}$.`,
        `翻转对角线得 $d = ${diagonal.join("")}$。与 $s_{${k + 1}} = ${row.join("")}$ 逐位比较，有 $${answer}$ 处不同，其中包括第 $${k + 1}$ 位。`,
      ],
    );
  },
);

const injectionScale = point(
  "scaling-an-injection-into-an-open-interval",
  ["Scaling an injection into an open interval", "把单射缩放到开区间内"],
  [
    "To apply the Cantor-Bernstein-Schroder theorem, an injection often has to fit a closed interval into an open one. Shifting away from an endpoint and dividing by a large enough number does this, since a linear map with nonzero slope is injective.",
    "应用康托尔-伯恩斯坦-施罗德定理时，常常要把闭区间单射到开区间内。先从端点移开，再除以足够大的数就能做到，因为斜率不为零的线性映射是单射。",
  ],
  (rng) => {
    const c = rng.int(1, 20);
    const p = rng.int(1, 20);
    const answer = c + p + 1;
    return ask(
      [
        `For which smallest positive integer $q$ does $x \\mapsto \\dfrac{x + ${p}}{q}$ map $[0, ${c}]$ injectively into $(0, 1)$?`,
        `当最小的正整数 $q$ 取何值时，$x \\mapsto \\dfrac{x + ${p}}{q}$ 把 $[0, ${c}]$ 单射到 $(0, 1)$ 内？`,
      ],
      answer,
      [c + p, p + 1, c + 1],
      [
        `The largest output is $\\frac{${c + p}}{q}$, and it must be strictly below $1$, so $q > ${c + p}$. The smallest output $\\frac{${p}}{q}$ is positive, so $q = ${answer}$ works.`,
        `最大的输出是 $\\frac{${c + p}}{q}$，它必须严格小于 $1$，所以 $q > ${c + p}$。最小的输出 $\\frac{${p}}{q}$ 为正，所以 $q = ${answer}$ 满足条件。`,
      ],
    );
  },
);

const missedSubsets = point(
  "how-many-subsets-a-map-must-miss",
  ["How many subsets a map must miss", "映射必定遗漏多少子集"],
  [
    "Cantor's theorem says that no map from a set to its power set is surjective. For a finite set, this can be counted: an $n$-element set has $2^{n}$ subsets, and a map hits only as many subsets as it has distinct values, which is at most $n$.",
    "康托尔定理说，从一个集合到它的幂集不存在满射。对有限集可以具体计数：$n$ 元集有 $2^{n}$ 个子集，而映射能取到的子集数等于它的不同值的个数，至多为 $n$。",
  ],
  (rng) => {
    const n = rng.int(3, 9);
    const j = rng.int(1, n);
    const answer = 2 ** n - j;
    return ask(
      [
        `A map $f: A \\to \\mathcal{P}(A)$ on a set with $${n}$ elements takes exactly $${j}$ different values. How many subsets of $A$ are not in its image?`,
        `$${n}$ 元集 $A$ 上的映射 $f: A \\to \\mathcal{P}(A)$ 恰好取 $${j}$ 个不同的值。$A$ 有多少个子集不在它的像中？`,
      ],
      answer,
      [2 ** n - n === answer ? 2 ** n : 2 ** n - n, n - j, 2 * n - j],
      [
        `The set has $2^{${n}} = ${2 ** n}$ subsets, and the image contains $${j}$ of them. So $${2 ** n} - ${j} = ${answer}$ are missed, which is at least one for every map.`,
        `这个集合有 $2^{${n}} = ${2 ** n}$ 个子集，像包含其中 $${j}$ 个。所以遗漏了 $${2 ** n} - ${j} = ${answer}$ 个，对每个映射至少遗漏一个。`,
      ],
    );
  },
);

const linearCombination = point(
  "a-linear-combination-of-congruences",
  ["A linear combination of congruences", "同余式的线性组合"],
  [
    "Congruences can be multiplied by constants and added or subtracted, so a whole linear combination can be reduced using only the remainders. A subtraction may give a negative value, and then a multiple of the modulus must be added to bring it into the standard range.",
    "同余式可以乘以常数并相加或相减，所以整个线性组合只需用余数来化简。减法可能得到负值，这时要加上模的倍数，把它变到标准范围内。",
  ],
  (rng) => {
    const m = rng.int(5, 15);
    let r: number;
    let s: number;
    let k: number;
    let l: number;
    // A combination that vanishes before any reduction, or reduces to zero, says little.
    do {
      r = rng.int(1, m - 1);
      s = rng.int(1, m - 1);
      k = rng.int(2, 6);
      l = rng.int(2, 6);
    } while ((k * r - l * s) % m === 0);
    const raw = k * r - l * s;
    const answer = ((raw % m) + m) % m;
    return ask(
      [
        `Suppose $a \\equiv ${r} \\pmod{${m}}$ and $b \\equiv ${s} \\pmod{${m}}$. Find the remainder $x$ with $0 \\le x < ${m}$ and $${k}a - ${l}b \\equiv x \\pmod{${m}}$.`,
        `设 $a \\equiv ${r} \\pmod{${m}}$，$b \\equiv ${s} \\pmod{${m}}$。求满足 $0 \\le x < ${m}$ 且 $${k}a - ${l}b \\equiv x \\pmod{${m}}$ 的余数 $x$。`,
      ],
      answer,
      [(k * r + l * s) % m, Math.abs(raw) % m, (((r - s) % m) + m) % m],
      [
        `Substituting the remainders gives $${k} \\cdot ${r} - ${l} \\cdot ${s} = ${raw}$, and reducing this modulo $${m}$ gives $${answer}$.`,
        `代入余数，得 $${k} \\cdot ${r} - ${l} \\cdot ${s} = ${raw}$，把它模 $${m}$ 化简，得 $${answer}$。`,
      ],
    );
  },
);

const twoCancellations = point(
  "combining-two-cancellations",
  ["Combining two cancellations", "结合两次约分"],
  [
    "Cancelling $k$ from a congruence divides the modulus by $\\gcd(k, m)$. Two different cancellations give two moduli, and a number congruent under both is congruent under their least common multiple, so the two facts together are stronger than either one alone.",
    "从同余式中约去 $k$ 时，模要除以 $\\gcd(k, m)$。两次不同的约分给出两个模，在两者下都同余的数在它们的最小公倍数下也同余，所以两个事实合起来比单独任何一个都强。",
  ],
  (rng) => {
    let m: number;
    let k1: number;
    let k2: number;
    let m1: number;
    let m2: number;
    // Neither congruence alone may give what the two give together.
    do {
      m = rng.pick([12, 18, 24, 30, 36, 40, 42, 48, 60, 72]);
      k1 = rng.int(2, 15);
      k2 = rng.int(2, 15);
      m1 = m / gcd(k1, m);
      m2 = m / gcd(k2, m);
    } while (m1 % m2 === 0 || m2 % m1 === 0);
    const answer = lcm(m1, m2);
    return ask(
      [
        `Suppose $${k1}a \\equiv ${k1}b \\pmod{${m}}$ and $${k2}a \\equiv ${k2}b \\pmod{${m}}$. What is the largest $n$ for which $a \\equiv b \\pmod{n}$ must hold?`,
        `设 $${k1}a \\equiv ${k1}b \\pmod{${m}}$，$${k2}a \\equiv ${k2}b \\pmod{${m}}$。使 $a \\equiv b \\pmod{n}$ 必定成立的最大 $n$ 是多少？`,
      ],
      answer,
      [m1, m2, m1 * m2 === answer ? m + 1 : m1 * m2],
      [
        `Since $\\gcd(${k1}, ${m}) = ${gcd(k1, m)}$ and $\\gcd(${k2}, ${m}) = ${gcd(k2, m)}$, the two congruences give $a \\equiv b$ modulo $${m1}$ and modulo $${m2}$. Together these give the least common multiple, which is $${answer}$.`,
        `因为 $\\gcd(${k1}, ${m}) = ${gcd(k1, m)}$，$\\gcd(${k2}, ${m}) = ${gcd(k2, m)}$，两个同余式分别给出模 $${m1}$ 和模 $${m2}$ 下的 $a \\equiv b$。合起来就得到它们的最小公倍数，即 $${answer}$。`,
      ],
    );
  },
);

const powerResidue = point(
  "a-power-of-a-large-number-modulo-m",
  ["A power of a large number modulo m", "大数的幂模 m"],
  [
    "Induction on the multiplication property proves that $a \\equiv b \\pmod{m}$ implies $a^{n} \\equiv b^{n} \\pmod{m}$. So a large base can be replaced by its remainder before the power is taken, and the result can be reduced after each multiplication.",
    "对乘法性质用归纳法可证 $a \\equiv b \\pmod{m}$ 蕴涵 $a^{n} \\equiv b^{n} \\pmod{m}$。所以取幂之前可以把大底数换成它的余数，每次相乘后还能把结果化简。",
  ],
  (rng) => {
    const m = rng.int(5, 15);
    const r = rng.int(2, m - 1);
    const a = m * rng.int(3, 40) + r;
    const n = rng.int(2, 6);
    const answer = powMod(r, n, m);
    return ask(
      [`Find the remainder when $${a}^{${n}}$ is divided by $${m}$.`, `求 $${a}^{${n}}$ 除以 $${m}$ 的余数。`],
      answer,
      [r, (r * n) % m, (a * n) % m],
      [
        `Since $${a} \\equiv ${r} \\pmod{${m}}$, we have $${a}^{${n}} \\equiv ${r}^{${n}} \\equiv ${answer} \\pmod{${m}}$.`,
        `由于 $${a} \\equiv ${r} \\pmod{${m}}$，所以 $${a}^{${n}} \\equiv ${r}^{${n}} \\equiv ${answer} \\pmod{${m}}$。`,
      ],
    );
  },
);

const contrapositiveValue = point(
  "the-residue-that-makes-a-contrapositive-true",
  ["The residue that makes a contrapositive true", "使逆否命题成立的余数"],
  [
    "A claim about non-congruence is usually easier in contrapositive form, where it is a direct calculation. To make such a claim true, work out what the contrapositive requires: if $n \\equiv s$, then $n^{2} \\equiv s^{2}$, and this value decides the residue.",
    "关于不同余的命题，用逆否形式通常更容易，这时只需直接计算。要使这样的命题成立，先弄清逆否命题的要求：如果 $n \\equiv s$，那么 $n^{2} \\equiv s^{2}$，这个值就决定了余数。",
  ],
  (rng) => {
    const m = rng.int(5, 20);
    const s = rng.int(2, m - 1);
    const answer = (s * s) % m;
    return ask(
      [
        `For which $r$ with $0 \\le r < ${m}$ is the claim "if $n^{2} \\not\\equiv r \\pmod{${m}}$, then $n \\not\\equiv ${s} \\pmod{${m}}$" true for every integer $n$?`,
        `对于满足 $0 \\le r < ${m}$ 的哪个 $r$，命题“如果 $n^{2} \\not\\equiv r \\pmod{${m}}$，那么 $n \\not\\equiv ${s} \\pmod{${m}}$”对每个整数 $n$ 都成立？`,
      ],
      answer,
      [s, (2 * s) % m, s * s],
      [
        `The contrapositive says that $n \\equiv ${s}$ implies $n^{2} \\equiv r$. Since $n^{2} \\equiv ${s * s} \\equiv ${answer} \\pmod{${m}}$, the value must be $r = ${answer}$.`,
        `逆否命题是：$n \\equiv ${s}$ 蕴涵 $n^{2} \\equiv r$。由于 $n^{2} \\equiv ${s * s} \\equiv ${answer} \\pmod{${m}}$，所以 $r = ${answer}$。`,
      ],
    );
  },
);

const solutionAboveModulus = point(
  "a-solution-beyond-the-modulus",
  ["A solution beyond the modulus", "大于模的解"],
  [
    "After dividing a congruence by the common factor, the solutions form a single class modulo the reduced modulus. So they repeat more often than the original modulus suggests, and the next solution beyond a given number is found by using the reduced step.",
    "同余式除以公因数后，解构成约化模下的一个剩余类。所以解重复的周期比原来的模所暗示的更短，超过给定数的下一个解要用约化后的步长来求。",
  ],
  (rng) => {
    const g = rng.int(2, 4);
    const reduced = rng.int(3, 9);
    let u = rng.int(2, 12);
    while (gcd(u, reduced) !== 1) u++;
    const c = rng.int(1, reduced - 1);
    const a = g * u;
    const m = g * reduced;
    const b = g * c;
    let x0 = 0;
    while ((u * x0 - c) % reduced !== 0) x0++;
    let answer = m + 1;
    while ((answer - x0) % reduced !== 0) answer++;
    return ask(
      [
        `Find the smallest integer $x > ${m}$ that satisfies $${a}x \\equiv ${b} \\pmod{${m}}$.`,
        `求满足 $${a}x \\equiv ${b} \\pmod{${m}}$ 且 $x > ${m}$ 的最小整数 $x$。`,
      ],
      answer,
      [x0 + m === answer ? answer + m : x0 + m, x0, answer + reduced],
      [
        `Dividing by $${g}$ gives $${u}x \\equiv ${c} \\pmod{${reduced}}$, so $x \\equiv ${x0} \\pmod{${reduced}}$. The first such integer above $${m}$ is $${answer}$.`,
        `除以 $${g}$，得 $${u}x \\equiv ${c} \\pmod{${reduced}}$，所以 $x \\equiv ${x0} \\pmod{${reduced}}$。大于 $${m}$ 的第一个这样的整数是 $${answer}$。`,
      ],
    );
  },
);

const solutionCount = point(
  "counting-the-solutions-of-a-linear-congruence",
  ["Counting the solutions of a linear congruence", "计算线性同余式的解数"],
  [
    "The equation $ax \\equiv b \\pmod{m}$ has solutions exactly when $g = \\gcd(a, m)$ divides $b$. In that case there are $g$ solutions among the residues modulo $m$, all of them congruent modulo $\\frac{m}{g}$. If $g$ does not divide $b$, there are none.",
    "方程 $ax \\equiv b \\pmod{m}$ 有解当且仅当 $g = \\gcd(a, m)$ 整除 $b$。这时在模 $m$ 的剩余中有 $g$ 个解，它们模 $\\frac{m}{g}$ 同余。如果 $g$ 不整除 $b$，就没有解。",
  ],
  (rng) => {
    const g = rng.int(2, 6);
    const reduced = rng.int(3, 9);
    let u = rng.int(1, 9);
    while (gcd(u, reduced) !== 1) u++;
    const a = g * u;
    const m = g * reduced;
    const solvable = rng.bool();
    const b = solvable ? g * rng.int(1, reduced - 1) : g * rng.int(0, reduced - 1) + rng.int(1, g - 1);
    const answer = solvable ? g : 0;
    return ask(
      [
        `How many solutions $x \\in \\{0, 1, \\dots, ${m - 1}\\}$ does $${a}x \\equiv ${b} \\pmod{${m}}$ have?`,
        `$${a}x \\equiv ${b} \\pmod{${m}}$ 在 $x \\in \\{0, 1, \\dots, ${m - 1}\\}$ 中有多少个解？`,
      ],
      answer,
      [1, solvable ? 0 : g, m],
      solvable
        ? [
            `$\\gcd(${a}, ${m}) = ${g}$ divides $${b}$, so there are solutions. They repeat every $${reduced}$, which gives $${g}$ of them below $${m}$.`,
            `$\\gcd(${a}, ${m}) = ${g}$ 整除 $${b}$，所以有解。解每隔 $${reduced}$ 重复一次，所以小于 $${m}$ 的解有 $${g}$ 个。`,
          ]
        : [
            `$\\gcd(${a}, ${m}) = ${g}$ does not divide $${b}$. The left side and the modulus are multiples of $${g}$, but $${b}$ is not, so there are no solutions.`,
            `$\\gcd(${a}, ${m}) = ${g}$ 不整除 $${b}$。左边和模都是 $${g}$ 的倍数，而 $${b}$ 不是，所以没有解。`,
          ],
    );
  },
);

const relatedToN = point(
  "elements-related-to-a-given-number",
  ["Elements related to a given number", "与给定数相关的元素"],
  [
    "Membership in a relation on an infinite set can define a finite set of elements related to a given number. Under divisibility on the positive integers, the elements related to $n$ are exactly its divisors, so they can be counted by factorizing $n$.",
    "无限集上的关系可以确定与给定数相关的有限元素集。在正整数的整除关系下，与 $n$ 相关的元素恰好是它的因数，所以可以通过分解 $n$ 来计数。",
  ],
  (rng) => {
    const n = rng.int(12, 240);
    const list = divisors(n);
    const answer = list.length;
    return ask(
      [
        `On the positive integers, let $x \\mathrel{R} y \\iff x \\mid y$. How many positive integers $x$ satisfy $x \\mathrel{R} ${n}$?`,
        `在正整数上，设 $x \\mathrel{R} y \\iff x \\mid y$。有多少个正整数 $x$ 满足 $x \\mathrel{R} ${n}$？`,
      ],
      answer,
      [answer - 1, answer + 1, answer - 2],
      [
        `The elements related to $${n}$ are its divisors: $${list.join(", ")}$. There are $${answer}$ of them.`,
        `与 $${n}$ 相关的元素就是它的因数：$${list.join(", ")}$。共有 $${answer}$ 个。`,
      ],
    );
  },
);

const symmetricUnion = point(
  "the-size-of-a-relation-with-its-inverse",
  ["The size of a relation with its inverse", "关系与其逆的并集大小"],
  [
    "The union $R \\cup R^{-1}$ is the smallest symmetric relation containing $R$. A pair and its reverse may both already be in $R$, and pairs of the form $(a, a)$ are their own reverses, so doubling the size of $R$ overcounts them.",
    "并集 $R \\cup R^{-1}$ 是包含 $R$ 的最小对称关系。一个序对及其反向可能都已经在 $R$ 中，形如 $(a, a)$ 的序对是自身的反向，所以把 $R$ 的大小加倍会多算它们。",
  ],
  (rng) => {
    const all: [number, number][] = [];
    for (let a = 1; a <= 5; a++) for (let b = 1; b <= 5; b++) all.push([a, b]);
    const R = rng.sample(all, rng.int(5, 9)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const has = (a: number, b: number) => R.some(([x, y]) => x === a && y === b);
    const overlap = R.filter(([a, b]) => has(b, a)).length;
    const answer = 2 * R.length - overlap;
    return ask(
      [
        `Let $R = \\{${pairs(R)}\\}$. How many pairs are in $R \\cup R^{-1}$?`,
        `设 $R = \\{${pairs(R)}\\}$。$R \\cup R^{-1}$ 中有多少个序对？`,
      ],
      answer,
      [answer === 2 * R.length ? answer - 1 : 2 * R.length, R.length, answer + 1],
      [
        `$R$ and $R^{-1}$ each have $${R.length}$ pairs, and $${overlap}$ pairs are in both. So the union has $${2 * R.length} - ${overlap} = ${answer}$ pairs.`,
        `$R$ 与 $R^{-1}$ 各有 $${R.length}$ 个序对，其中 $${overlap}$ 个同时属于两者。所以并集有 $${2 * R.length} - ${overlap} = ${answer}$ 个序对。`,
      ],
    );
  },
);

const reflexiveClosure = point(
  "pairs-needed-to-make-a-relation-reflexive",
  ["Pairs needed to make a relation reflexive", "使关系自反所需的序对"],
  [
    "A relation on a set is reflexive only if every element is related to itself. To repair a relation, add just the missing pairs of the form $(a, a)$. The other pairs in the relation play no part, so only the diagonal needs to be checked.",
    "集合上的关系只有在每个元素都与自身相关时才是自反的。要补全一个关系，只需添加缺少的形如 $(a, a)$ 的序对。关系中的其他序对不起作用，所以只需检查对角线。",
  ],
  (rng) => {
    const n = rng.int(3, 7);
    const all: [number, number][] = [];
    for (let a = 1; a <= n; a++) for (let b = 1; b <= n; b++) all.push([a, b]);
    const R = rng.sample(all, rng.int(4, Math.min(9, n * n - 1))).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const loops = R.filter(([a, b]) => a === b).length;
    const answer = n - loops;
    return ask(
      [
        `Let $R = \\{${pairs(R)}\\}$ on $\\{1, 2, \\dots, ${n}\\}$. How many pairs must be added to make $R$ reflexive?`,
        `$\\{1, 2, \\dots, ${n}\\}$ 上的 $R = \\{${pairs(R)}\\}$。要使 $R$ 自反，必须添加多少个序对？`,
      ],
      answer,
      [n, n * n - R.length, loops === 0 ? n + 1 : loops],
      [
        `$R$ already contains $${loops}$ of the $${n}$ required pairs of the form $(a, a)$, so $${answer}$ are missing.`,
        `在所需的 $${n}$ 个形如 $(a, a)$ 的序对中，$R$ 已包含 $${loops}$ 个，所以缺少 $${answer}$ 个。`,
      ],
    );
  },
);

const classCount = point(
  "counting-the-classes-of-an-equivalence-relation",
  ["Counting the classes of an equivalence relation", "计算等价关系的类数"],
  [
    "An equivalence proof can also reveal what the relation really is. When $p + q$ is a multiple of $d$, the condition $d \\mid pa + qb$ is the same as $d \\mid p(a - b)$, which means that $a$ and $b$ are congruent modulo $\\frac{d}{\\gcd(d, p)}$.",
    "等价关系的证明还能揭示关系的实质。当 $p + q$ 是 $d$ 的倍数时，条件 $d \\mid pa + qb$ 等同于 $d \\mid p(a - b)$，这意味着 $a$ 与 $b$ 模 $\\frac{d}{\\gcd(d, p)}$ 同余。",
  ],
  (rng) => {
    const d = rng.int(4, 18);
    const p = rng.int(2, d - 1);
    const q = d - p;
    const g = gcd(d, p);
    const answer = d / g;
    return ask(
      [
        `On $\\mathbb{Z}$, the relation $a \\sim b \\iff ${d} \\mid ${poly([p, "a"], [q, "b"])}$ is an equivalence relation. How many equivalence classes does it have?`,
        `在 $\\mathbb{Z}$ 上，关系 $a \\sim b \\iff ${d} \\mid ${poly([p, "a"], [q, "b"])}$ 是等价关系。它有多少个等价类？`,
      ],
      answer,
      [answer === d ? d + 1 : d, g === answer ? g + 1 : g, p === answer ? p + 1 : p],
      [
        `Since $${p} + ${q} = ${d}$, the condition is $${d} \\mid ${p}(a - b)$. With $\\gcd(${d}, ${p}) = ${g}$, this says that $a \\equiv b \\pmod{${answer}}$, which gives $${answer}$ classes.`,
        `由于 $${p} + ${q} = ${d}$，条件变为 $${d} \\mid ${p}(a - b)$。因为 $\\gcd(${d}, ${p}) = ${g}$，这表示 $a \\equiv b \\pmod{${answer}}$，所以有 $${answer}$ 个类。`,
      ],
    );
  },
);

const equalClassModuli = point(
  "the-moduli-for-which-two-classes-agree",
  ["The moduli for which two classes agree", "使两个类相同的模"],
  [
    "Two residue classes $[a]_{m}$ and $[b]_{m}$ are equal exactly when $m$ divides $a - b$. So the moduli that make two given classes equal are the divisors of the difference, and listing them answers the question without testing each modulus separately.",
    "两个剩余类 $[a]_{m}$ 与 $[b]_{m}$ 相等，当且仅当 $m$ 整除 $a - b$。所以使两个给定类相等的模就是差的因数，列出它们就能回答问题，不必逐一检验每个模。",
  ],
  (rng) => {
    const gap = rng.int(6, 72);
    const a = rng.int(-20, 40);
    const b = a + gap;
    const list = divisors(gap).filter((d) => d > 1);
    const answer = list.length;
    return ask(
      [`For how many integers $m > 1$ is $[${a}]_{m} = [${b}]_{m}$?`, `对于多少个大于 $1$ 的整数 $m$，有 $[${a}]_{m} = [${b}]_{m}$？`],
      answer,
      [answer + 1, gap, gap - 1],
      [
        `The classes are equal exactly when $m \\mid ${gap}$. The divisors above $1$ are $${list.join(", ")}$, so the number of moduli is $${answer}$.`,
        `这两个类相等当且仅当 $m \\mid ${gap}$。大于 $1$ 的因数是 $${list.join(", ")}$，所以有 $${answer}$ 个模。`,
      ],
    );
  },
);

/** deeperMethodsOfProofThird2Points maps topics of Methods of Proof, on induction, limits, cardinality, congruences and relations, to a third knowledge point. */
export const deeperMethodsOfProofThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "proving-divisibility-using-induction": [baseCaseMatters],
  "proving-the-limit-of-a-null-sequence": [smallestNForNull],
  "proving-the-finite-limit-of-a-sequence": [quadraticLimit],
  "infinite-limits-of-sequences": [quadraticInfinite],
  "proving-a-sequence-has-an-infinite-limit": [minusInfinity],
  surjections: [missedResidues],
  "discrete-infinite-sets-with-equal-cardinality": [cantorPairing],
  "continuous-infinite-sets-with-equal-cardinality": [intervalRayInverse],
  "cantors-diagonal-argument": [diagonalDistance],
  "the-cantor-bernstein-schroder-theorem": [injectionScale],
  "cantors-theorem": [missedSubsets],
  "the-addition-property-of-modular-arithmetic": [linearCombination],
  "the-division-properties-of-modular-arithmetic": [twoCancellations],
  "proving-properties-of-modular-congruence": [powerResidue],
  "proving-congruence-by-contrapositive": [contrapositiveValue],
  "solving-advanced-linear-congruences": [solutionAboveModulus],
  "proving-properties-of-linear-congruences": [solutionCount],
  "relations-on-infinite-sets": [relatedToN],
  "operations-on-relations": [symmetricUnion],
  "reflexive-and-irreflexive-relations": [reflexiveClosure],
  "proving-a-relation-is-an-equivalence-relation": [classCount],
  "residue-classes": [equalClassModuli],
};
