// Third knowledge points for thin topics of Abstract Algebra, on group actions, rings and
// polynomials: the reverse question, a harder case or a common trap.
// See `deeperAbstractAlgebraThird2Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { ask, choose, divisors, factorize, type Pair, point, powMod, totient } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { factorial } from "./deeper-abstract-algebra-third.ts";
import { gcd, lcm } from "./deeper-methods-of-proof-third.ts";

/** binomial gives the number of ways to choose k things from n. */
const binomial = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
};
/** inverseMod finds the inverse of a nonzero residue modulo a prime. */
const inverseMod = (a: number, p: number) => {
  for (let x = 1; x < p; x++) if ((((a * x) % p) + p) % p === 1) return x;
  return 0;
};
/** quaternionProduct multiplies two quaternions given as coefficient lists. */
const quaternionProduct = (p: readonly number[], q: readonly number[]) => {
  const [a, b, c, d] = p as [number, number, number, number];
  const [e, f, g, h] = q as [number, number, number, number];
  return [a * e - b * f - c * g - d * h, a * f + b * e + c * h - d * g, a * g - b * h + c * e + d * f, a * h + b * g - c * f + d * e];
};

const burnside = point(
  "counting-orbits-from-fixed-points",
  ["Counting orbits from fixed points", "由不动点计算轨道数"],
  [
    "Burnside's lemma counts orbits by averaging: the number of orbits is the sum over the group of the number of points each element fixes, divided by the order of the group. The identity fixes every point, so it must be included in the sum.",
    "伯恩赛德引理用求平均的方法计算轨道数：轨道数等于群中每个元素固定的点数之和，再除以群的阶。单位元固定每个点，所以必须计入总和。",
  ],
  (rng) => {
    const g = rng.pick([4, 6, 8, 10, 12]);
    // A real action of the cyclic group: an orbit of size d is fixed pointwise by the multiples of d.
    const answer = rng.int(3, 8);
    const orbits = [...Array(answer).keys()].map(() => rng.pick(divisors(g)));
    const size = orbits.reduce((a, b) => a + b, 0);
    const fixes = [...Array(g - 1).keys()].map((i) => orbits.filter((d) => (i + 1) % d === 0).reduce((a, b) => a + b, 0));
    const total = size + fixes.reduce((a, b) => a + b, 0);
    const list = rng.shuffle(fixes);
    return ask(
      [
        `A group of order $${g}$ acts on a set of $${size}$ points. Besides the identity, its elements fix $${list.join(", ")}$ points. How many orbits are there?`,
        `阶为 $${g}$ 的群作用在 $${size}$ 个点的集合上。除单位元外，各元素分别固定 $${list.join(", ")}$ 个点。有多少个轨道？`,
      ],
      answer,
      [Math.floor((total - size) / g), Math.floor(total / (g - 1)), total],
      [
        `The identity fixes all $${size}$ points, so the total is $${total}$. Dividing by the group order gives $\\frac{${total}}{${g}} = ${answer}$.`,
        `单位元固定全部 $${size}$ 个点，所以总和是 $${total}$。除以群的阶，得 $\\frac{${total}}{${g}} = ${answer}$。`,
      ],
    );
  },
);

const orbitsFromStabilizers = point(
  "the-number-of-orbits-when-stabilizers-agree",
  ["The number of orbits when stabilizers agree", "稳定子大小相同时的轨道数"],
  [
    "If every stabilizer has the same order, then the orbit-stabilizer theorem makes all the orbits the same size, namely the group order divided by the stabilizer order. Since the orbits partition the set, the number of orbits is the set size divided by this common orbit size.",
    "如果每个稳定子的阶都相同，轨道-稳定子定理使所有轨道大小相同，都等于群的阶除以稳定子的阶。由于轨道划分集合，轨道数就是集合大小除以这个公共的轨道大小。",
  ],
  (rng) => {
    const g = rng.pick([12, 24, 36, 48, 60, 72, 120]);
    const s = rng.pick(divisors(g).filter((d) => d > 1 && d < g));
    const size = g / s;
    const answer = rng.int(2, 12);
    const X = answer * size;
    return ask(
      [
        `A group of order $${g}$ acts on a set of $${X}$ elements, and every stabilizer has order $${s}$. How many orbits are there?`,
        `阶为 $${g}$ 的群作用在 $${X}$ 个元素的集合上，每个稳定子的阶都是 $${s}$。有多少个轨道？`,
      ],
      answer,
      [size, X === g ? X + 1 : Math.max(X, g), s === answer ? answer + 1 : s],
      [
        `Each orbit has $\\frac{${g}}{${s}} = ${size}$ elements, and the orbits partition the set. So there are $\\frac{${X}}{${size}} = ${answer}$ orbits.`,
        `每个轨道有 $\\frac{${g}}{${s}} = ${size}$ 个元素，轨道划分集合。所以有 $\\frac{${X}}{${size}} = ${answer}$ 个轨道。`,
      ],
    );
  },
);

const dihedralClasses = {
  ...point(
    "the-conjugacy-classes-of-a-dihedral-group",
    ["The conjugacy classes of a dihedral group", "二面体群的共轭类"],
    [
      "The class equation sorts a group by conjugacy. In $D_{n}$, each rotation is conjugate to its inverse, and the reflections form one class for odd $n$ and two for even $n$. So the number of classes depends on the parity of $n$.",
      "类方程按共轭关系对群进行分类。在 $D_{n}$ 中，每个旋转都与它的逆共轭，反射当 $n$ 为奇数时构成一个类，当 $n$ 为偶数时构成两个类。所以类的个数取决于 $n$ 的奇偶性。",
    ],
    (rng) => {
      const n = rng.int(3, 40);
      const even = n % 2 === 0;
      const rotationClasses = even ? n / 2 + 1 : (n + 1) / 2;
      const reflectionClasses = even ? 2 : 1;
      const answer = rotationClasses + reflectionClasses;
      return ask(
        [
          `How many conjugacy classes does the dihedral group $D_{${n}}$ of order $${2 * n}$ have?`,
          `阶为 $${2 * n}$ 的二面体群 $D_{${n}}$ 有多少个共轭类？`,
        ],
        answer,
        [n, 2 * n, rotationClasses + (even ? 1 : 2)],
        [
          `The rotations form $${rotationClasses}$ classes, by pairing each with its inverse. The reflections form $${reflectionClasses}$ ${reflectionClasses === 1 ? "class" : "classes"}, since $${n}$ is ${even ? "even" : "odd"}. The total is $${answer}$.`,
          `把每个旋转与它的逆配对，旋转构成 $${rotationClasses}$ 个类。由于 $${n}$ 是${even ? "偶数" : "奇数"}，反射构成 $${reflectionClasses}$ 个类。总数是 $${answer}$。`,
        ],
      );
    },
  ),
  figure: algebraDrawings2["the-class-equation-of-a-group-action#the-conjugacy-classes-of-a-dihedral-group"],
};

const cycleConjugates = point(
  "the-number-of-conjugates-of-a-cycle",
  ["The number of conjugates of a cycle", "循环的共轭元个数"],
  [
    "Two permutations are conjugate exactly when they have the same cycle type, so the conjugates of a cycle are all the cycles of that length. Choosing and ordering the letters overcounts each cycle once for each of its cyclic rotations, so the count is $\\frac{n!}{k \\cdot (n - k)!}$.",
    "两个置换共轭当且仅当它们的循环类型相同，所以一个循环的共轭元就是所有同长度的循环。选择并排列字母时，每个循环按其旋转方式被重复计数，所以个数是 $\\frac{n!}{k \\cdot (n - k)!}$。",
  ],
  (rng) => {
    const n = rng.int(4, 10);
    const k = rng.int(2, n);
    const answer = factorial(n) / (k * factorial(n - k));
    const cycle = [...Array(k).keys()].map((i) => i + 1).join("\\;");
    return ask(
      [`How many conjugates does $(${cycle})$ have in $S_{${n}}$?`, `$(${cycle})$ 在 $S_{${n}}$ 中有多少个共轭元？`],
      answer,
      [binomial(n, k), factorial(n) / factorial(n - k), factorial(n) / k],
      [
        `The conjugates are the cycles of length $${k}$. There are $\\frac{${n}!}{${n - k}!}$ ordered choices of letters, and each cycle arises $${k}$ times, which gives $${answer}$.`,
        `共轭元就是长度为 $${k}$ 的循环。字母的有序选择有 $\\frac{${n}!}{${n - k}!}$ 种，每个循环出现 $${k}$ 次，所以得 $${answer}$。`,
      ],
    );
  },
);

const rotationsWithCycles = {
  ...point(
    "how-many-rotations-have-a-given-cycle-type",
    ["How many rotations have a given cycle type", "具有给定循环类型的旋转个数"],
    [
      "The rotation $r^{j}$ of a regular $n$-gon splits the vertices into $\\gcd(j, n)$ cycles. So the number of rotations with exactly $d$ cycles is the number of $j$ with $\\gcd(j, n) = d$, and this count equals $\\varphi\\left(\\frac{n}{d}\\right)$.",
      "正 $n$ 边形的旋转 $r^{j}$ 把顶点分成 $\\gcd(j, n)$ 个循环。所以恰好有 $d$ 个循环的旋转个数，就是满足 $\\gcd(j, n) = d$ 的 $j$ 的个数，它等于 $\\varphi\\left(\\frac{n}{d}\\right)$。",
    ],
    (rng) => {
      let n = rng.int(6, 60);
      while (divisors(n).length < 4) n++;
      const d = rng.pick(divisors(n).filter((x) => x < n));
      const quotient = n / d;
      const answer = totient(quotient);
      return ask(
        [
          `How many of the $${n}$ rotations of a regular ${n}-gon split the vertices into exactly $${d}$ ${d === 1 ? "cycle" : "cycles"}?`,
          `正 ${n} 边形的 $${n}$ 个旋转中，有多少个恰好把顶点分成 $${d}$ 个循环？`,
        ],
        answer,
        [d, quotient, totient(n)],
        [
          `We count $j$ with $\\gcd(j, ${n}) = ${d}$. Writing $j = ${d}t$, we need $\\gcd(t, ${quotient}) = 1$, which gives $\\varphi(${quotient}) = ${answer}$ rotations.`,
          `要计算满足 $\\gcd(j, ${n}) = ${d}$ 的 $j$。写成 $j = ${d}t$，需要 $\\gcd(t, ${quotient}) = 1$，所以有 $\\varphi(${quotient}) = ${answer}$ 个旋转。`,
        ],
      );
    },
  ),
  figure: algebraDrawings2["cycle-types-of-permutations-of-some-groups#how-many-rotations-have-a-given-cycle-type"],
};

const wordOrbits = point(
  "the-number-of-orbits-on-words",
  ["The number of orbits on words", "单词上的轨道数"],
  [
    "When $S_{n}$ permutes the positions of a word, the orbit of a word is determined by how many times each letter appears. So the number of orbits equals the number of ways to write $n$ as an ordered sum of $k$ nonnegative counts, which is $\\binom{n + k - 1}{k - 1}$.",
    "当 $S_{n}$ 置换单词的位置时，单词的轨道由每个字母出现的次数决定。所以轨道数等于把 $n$ 写成 $k$ 个非负计数的有序和的方法数，即 $\\binom{n + k - 1}{k - 1}$。",
  ],
  (rng) => {
    const n = rng.int(3, 10);
    const k = rng.int(2, 5);
    const answer = binomial(n + k - 1, k - 1);
    return ask(
      [
        `$S_{${n}}$ acts by permuting the positions of words of length $${n}$ on an alphabet of $${k}$ letters. How many orbits are there?`,
        `$S_{${n}}$ 通过置换位置，作用在由 $${k}$ 个字母组成的长度为 $${n}$ 的单词上。有多少个轨道？`,
      ],
      answer,
      [k ** n, binomial(n + k - 1, k), n + k],
      [
        `An orbit is fixed by the counts of the $${k}$ letters, which add up to $${n}$. The number of such counts is $\\binom{${n + k - 1}}{${k - 1}} = ${answer}$.`,
        `轨道由 $${k}$ 个字母的计数确定，这些计数之和为 $${n}$。这样的计数有 $\\binom{${n + k - 1}}{${k - 1}} = ${answer}$ 种。`,
      ],
    );
  },
);

const rotationFixedColorings = {
  ...point(
    "the-colorings-a-rotation-fixes",
    ["The colorings a rotation fixes", "旋转固定的着色"],
    [
      "A necklace coloring is fixed by a rotation exactly when each cycle of the rotation has a single color. A rotation by $j$ places has $\\gcd(j, n)$ cycles, so it fixes $k^{\\gcd(j, n)}$ colorings, and these are the numbers that enter Burnside's lemma.",
      "一种项链着色被旋转固定，当且仅当旋转的每个循环都只有一种颜色。旋转 $j$ 个位置有 $\\gcd(j, n)$ 个循环，所以固定 $k^{\\gcd(j, n)}$ 种着色，这些数就是代入伯恩赛德引理的数。",
    ],
    (rng) => {
      const n = rng.int(4, 12);
      const j = rng.int(1, n - 1);
      const k = rng.int(2, 4);
      const g = gcd(j, n);
      const answer = k ** g;
      return ask(
        [
          `A necklace has $${n}$ beads, each with one of $${k}$ colors. How many colorings are unchanged by the rotation through $${j}$ ${j === 1 ? "place" : "places"}?`,
          `项链有 $${n}$ 颗珠子，每颗取 $${k}$ 种颜色之一。旋转 $${j}$ 个位置后，有多少种着色保持不变？`,
        ],
        answer,
        [k ** (n / g) === answer ? answer * k : k ** (n / g), k ** n === answer ? answer + 1 : k ** n, k * g],
        [
          `The rotation has $\\gcd(${j}, ${n}) = ${g}$ ${g === 1 ? "cycle" : "cycles"} of beads, and each cycle has one color. So the count is $${k}^{${g}} = ${answer}$.`,
          `这个旋转把珠子分成 $\\gcd(${j}, ${n}) = ${g}$ 个循环，每个循环一种颜色。所以个数是 $${k}^{${g}} = ${answer}$。`,
        ],
      );
    },
  ),
  figure: algebraDrawings2["colorings-of-necklaces#the-colorings-a-rotation-fixes"],
};

/** distinctRingMistakes keeps the typical mistakes whose values differ from the answer, each value once. */
const distinctRingMistakes = <T extends { readonly value: unknown }>(answer: unknown, list: readonly T[]): T[] =>
  list.filter((m, i) => m.value !== answer && list.findIndex((x) => x.value === m.value) === i);

const normInRing = point(
  "the-norm-in-a-quadratic-integer-ring",
  ["The norm in a quadratic integer ring", "二次整数环中的范数"],
  [
    "Multiplying $a + b\\sqrt{d}$ by its conjugate removes the root and gives the norm $a^{2} - db^{2}$. The norm is multiplicative, so it turns questions about factoring in the ring into questions about ordinary integers, and an element is a unit exactly when its norm is $\\pm 1$.\n\nIn $\\mathbb{Z}[\\sqrt{5}]$, the norm of $3 + 2\\sqrt{5}$ is $3^{2} - 5 \\cdot 2^{2} = 9 - 20 = -11$; a norm can be negative.\n\nCheck: $(3 + 2\\sqrt{5})(3 - 2\\sqrt{5}) = 9 - 6\\sqrt{5} + 6\\sqrt{5} - 20 = -11$.\n\n> **Watch out.** Subtract $db^{2}$, do not add it, and square $b$ before multiplying by $d$: $(b\\sqrt{d})^{2} = b^{2}d$.",
    "把 $a + b\\sqrt{d}$ 乘以它的共轭可以去掉根号，得到范数 $a^{2} - db^{2}$。范数是可乘的，所以把环中的因式分解问题转化为普通整数的问题，一个元素是单位当且仅当它的范数是 $\\pm 1$。\n\n在 $\\mathbb{Z}[\\sqrt{5}]$ 中，$3 + 2\\sqrt{5}$ 的范数为 $3^{2} - 5 \\cdot 2^{2} = 9 - 20 = -11$；范数可以是负数。\n\n检验：$(3 + 2\\sqrt{5})(3 - 2\\sqrt{5}) = 9 - 6\\sqrt{5} + 6\\sqrt{5} - 20 = -11$。\n\n> **注意。** 要减去 $db^{2}$，而不是加上；并且先把 $b$ 平方再乘以 $d$：$(b\\sqrt{d})^{2} = b^{2}d$。",
  ],
  (rng) => {
    const d = rng.pick([2, 3, 5, 6, 7, 10, 11]);
    const a = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 8, 9]);
    const b = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const answer = a * a - d * b * b;
    const element = poly([a, ""], [b, `\\sqrt{${d}}`]);
    const conjugate = poly([a, ""], [-b, `\\sqrt{${d}}`]);
    const sq = (x: number) => (x < 0 ? `(${x})^{2}` : `${x}^{2}`);
    return numberProblem({
      prompt: t(
        `In $\\mathbb{Z}[\\sqrt{${d}}]$, find the norm of $${element}$, that is, its product with its conjugate $${conjugate}$.`,
        `在 $\\mathbb{Z}[\\sqrt{${d}}]$ 中，求 $${element}$ 的范数，即它与共轭 $${conjugate}$ 的积。`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          a * a + d * b * b,
          `That adds $${d} \\cdot ${b * b}$; the product of $${b}\\sqrt{${d}}$ and $${-b}\\sqrt{${d}}$ is negative, so subtract it.`,
          `那是加上了 $${d} \\cdot ${b * b}$；$${b}\\sqrt{${d}}$ 与 $${-b}\\sqrt{${d}}$ 之积为负，所以要减去。`,
        ),
        why(
          a * a - b * b,
          `That leaves out $${d}$: $(\\sqrt{${d}})^{2} = ${d}$, so the second term is $${d} \\cdot ${b * b}$.`,
          `那漏掉了 $${d}$：$(\\sqrt{${d}})^{2} = ${d}$，所以第二项是 $${d} \\cdot ${b * b}$。`,
        ),
        why(
          a * a - d * b,
          `That does not square $${b}$; the second term is $${d}b^{2} = ${d * b * b}$.`,
          `那没有把 $${b}$ 平方；第二项是 $${d}b^{2} = ${d * b * b}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Multiply by the conjugate", "乘以共轭"],
            t(
              `$(${element})(${conjugate}) = ${sq(a)} - (${b}\\sqrt{${d}})^{2}$, a difference of squares.`,
              `$(${element})(${conjugate}) = ${sq(a)} - (${b}\\sqrt{${d}})^{2}$，是平方差。`,
            ),
          ],
          [
            ["Compute", "计算"],
            t(
              `$(${b}\\sqrt{${d}})^{2} = ${d} \\cdot ${b * b} = ${d * b * b}$, so the norm is $${a * a} - ${d * b * b} = ${answer}$.`,
              `$(${b}\\sqrt{${d}})^{2} = ${d} \\cdot ${b * b} = ${d * b * b}$，所以范数为 $${a * a} - ${d * b * b} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Expanding term by term, the cross terms $${a * b}\\sqrt{${d}}$ and $${-a * b}\\sqrt{${d}}$ cancel, leaving $${a * a} - ${d * b * b} = ${answer}$.`,
          `逐项展开，交叉项 $${a * b}\\sqrt{${d}}$ 与 $${-a * b}\\sqrt{${d}}$ 相互抵消，剩下 $${a * a} - ${d * b * b} = ${answer}$。`,
        ),
      ),
    });
  },
);

const zeroDivisorCount = point(
  "counting-zero-divisors-in-a-residue-ring",
  ["Counting zero divisors in a residue ring", "计算剩余环中的零因子"],
  [
    "In the commutative ring $\\mathbb{Z}_{n}$, each nonzero element is either a unit or a zero divisor, depending on whether it is coprime to $n$. So the number of zero divisors is $n - \\varphi(n) - 1$, where the last term removes the zero element itself.\n\nIn $\\mathbb{Z}_{18}$, $\\varphi(18) = 6$, so there are $18 - 6 - 1 = 11$ nonzero zero divisors: $2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16$.\n\nCheck: each of these shares the factor $2$ or $3$ with $18$; for instance $4 \\cdot 9 = 36 \\equiv 0$.\n\n> **Watch out.** Subtract both the units and the zero element: $n - \\varphi(n)$ still counts $0$, and a unit is never a zero divisor.",
    "在交换环 $\\mathbb{Z}_{n}$ 中，每个非零元素要么是单位，要么是零因子，取决于它是否与 $n$ 互素。所以零因子的个数是 $n - \\varphi(n) - 1$，其中最后一项去掉了零元素本身。\n\n在 $\\mathbb{Z}_{18}$ 中，$\\varphi(18) = 6$，所以非零的零因子有 $18 - 6 - 1 = 11$ 个：$2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16$。\n\n检验：它们都与 $18$ 有公因数 $2$ 或 $3$；例如 $4 \\cdot 9 = 36 \\equiv 0$。\n\n> **注意。** 既要减去单位，也要减去零元素：$n - \\varphi(n)$ 仍把 $0$ 算在内，而单位绝不是零因子。",
  ],
  (rng) => {
    let n = rng.int(6, 120);
    while (totient(n) === n - 1) n++;
    const phi = totient(n);
    const answer = n - phi - 1;
    const p = (factorize(n)[0] as [number, number])[0];
    return numberProblem({
      prompt: t(`How many nonzero zero divisors does $\\mathbb{Z}_{${n}}$ have?`, `$\\mathbb{Z}_{${n}}$ 有多少个非零的零因子？`),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(n - phi, "That still counts $0$; the question asks for nonzero zero divisors.", "那仍把 $0$ 算在内；题目问的是非零的零因子。"),
        why(
          phi,
          `That is $\\varphi(${n})$, the number of units; units are never zero divisors.`,
          `那是 $\\varphi(${n})$，即单位的个数；单位绝不是零因子。`,
        ),
        why(n - 1, "That counts every nonzero element; the units must be removed.", "那数的是所有非零元素；还要去掉单位。"),
      ]),
      solution: walked(
        [
          [
            ["Count the units", "数单位"],
            t(
              `The units are the residues coprime to $${n}$: $\\varphi(${n}) = ${phi}$ of them.`,
              `单位是与 $${n}$ 互素的剩余：共 $\\varphi(${n}) = ${phi}$ 个。`,
            ),
          ],
          [
            ["Remove the units and zero", "去掉单位和零"],
            t(
              `Every other nonzero element is a zero divisor, so the count is $${n} - ${phi} - 1 = ${answer}$.`,
              `其余每个非零元素都是零因子，所以个数为 $${n} - ${phi} - 1 = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${p}$ is not coprime to $${n}$, and indeed $${p} \\cdot ${n / p} = ${n} \\equiv 0$ with both factors nonzero, so $${p}$ is a zero divisor.`,
          `$${p}$ 与 $${n}$ 不互素，确实 $${p} \\cdot ${n / p} = ${n} \\equiv 0$，两个因子都非零，所以 $${p}$ 是零因子。`,
        ),
      ),
    });
  },
);

const freshmansDream = point(
  "binomial-coefficients-modulo-the-characteristic",
  ["Binomial coefficients modulo the characteristic", "模特征的二项式系数"],
  [
    "In a commutative ring of prime characteristic $p$, the identity $(x + y)^{p} = x^{p} + y^{p}$ holds, because $p$ divides each middle binomial coefficient. For a composite characteristic this can fail, so the coefficients must be computed and reduced one at a time.\n\nIn $\\mathbb{Z}_{6}[x, y]$, the coefficient of $x^{2}y^{4}$ in $(x + y)^{6}$ is $\\binom{6}{2} = 15 \\equiv 3$, not $0$; in $\\mathbb{Z}_{7}[x, y]$, the coefficient of $x^{3}y^{4}$ in $(x + y)^{7}$ is $\\binom{7}{3} = 35 \\equiv 0$.\n\nCheck: $15 = 12 + 3$ and $35 = 5 \\cdot 7$.\n\n> **Watch out.** Only a prime characteristic kills every middle coefficient; for a composite $n$, compute $\\binom{n}{k}$ and reduce it, rather than assuming $0$.",
    "在素数特征 $p$ 的交换环中，恒等式 $(x + y)^{p} = x^{p} + y^{p}$ 成立，因为 $p$ 整除中间的每个二项式系数。对于合数特征这可能不成立，所以必须逐个计算并化简系数。\n\n在 $\\mathbb{Z}_{6}[x, y]$ 中，$(x + y)^{6}$ 里 $x^{2}y^{4}$ 的系数为 $\\binom{6}{2} = 15 \\equiv 3$，不是 $0$；在 $\\mathbb{Z}_{7}[x, y]$ 中，$(x + y)^{7}$ 里 $x^{3}y^{4}$ 的系数为 $\\binom{7}{3} = 35 \\equiv 0$。\n\n检验：$15 = 12 + 3$，$35 = 5 \\cdot 7$。\n\n> **注意。** 只有素数特征才能消去所有中间系数；对合数 $n$，要计算 $\\binom{n}{k}$ 再约化，而不能想当然地认为是 $0$。",
  ],
  (rng) => {
    const n = rng.pick([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const k = rng.int(1, n - 1);
    const c = binomial(n, k);
    const answer = c % n;
    const term = `${k === 1 ? "x" : `x^{${k}}`}${n - k === 1 ? "y" : `y^{${n - k}}`}`;
    const composite = ![5, 7, 11, 13].includes(n);
    return numberProblem({
      prompt: t(
        `In $\\mathbb{Z}_{${n}}[x, y]$, find the coefficient of $${term}$ in $(x + y)^{${n}}$, as a value from $0$ to $${n - 1}$.`,
        `在 $\\mathbb{Z}_{${n}}[x, y]$ 中，求 $(x + y)^{${n}}$ 里 $${term}$ 的系数，取值范围为 $0$ 到 $${n - 1}$。`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        c === answer
          ? why(answer + 1, "That is one too many: recompute the binomial coefficient.", "多了一：请重新计算二项式系数。")
          : why(
              c,
              `That is $\\binom{${n}}{${k}}$ before reducing; reduce it modulo $${n}$.`,
              `那是约化前的 $\\binom{${n}}{${k}}$；要把它模 $${n}$ 约化。`,
            ),
        why(
          0,
          `That assumes every middle coefficient vanishes, which is guaranteed only for a prime characteristic${composite ? `, and $${n}$ is not prime` : ""}.`,
          `那是假设中间系数都为零，这只对素数特征才有保证${composite ? `，而 $${n}$ 不是素数` : ""}。`,
        ),
        why(
          1,
          "That treats the term like $x^{n}$ or $y^{n}$, whose coefficient is $1$; a middle term has coefficient $\\binom{n}{k}$.",
          "那把这一项当作系数为 $1$ 的 $x^{n}$ 或 $y^{n}$；中间项的系数是 $\\binom{n}{k}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the binomial theorem", "用二项式定理"],
            t(
              `The coefficient of $${term}$ in $(x + y)^{${n}}$ is $\\binom{${n}}{${k}} = ${c}$.`,
              `$(x + y)^{${n}}$ 中 $${term}$ 的系数为 $\\binom{${n}}{${k}} = ${c}$。`,
            ),
          ],
          [
            ["Reduce", "约化"],
            t(
              `$${c} - ${answer} = ${c - answer}$ is a multiple of $${n}$, so the coefficient is $${answer}$.`,
              `$${c} - ${answer} = ${c - answer}$ 是 $${n}$ 的倍数，所以系数为 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$k\\binom{n}{k} = n\\binom{n - 1}{k - 1}$, so $(${k})(${answer}) = ${k * answer}$ must be a multiple of $${n}$, and it is.`,
          `$k\\binom{n}{k} = n\\binom{n - 1}{k - 1}$，所以 $(${k})(${answer}) = ${k * answer}$ 必是 $${n}$ 的倍数，确实如此。`,
        ),
      ),
    });
  },
);

const systemOverField = point(
  "solving-a-system-with-an-inverse-over-a-field",
  ["Solving a system with an inverse over a field", "在域上用逆矩阵解方程组"],
  [
    "A matrix inverse over $\\mathbb{Z}_{p}$ solves a linear system exactly as it does over the reals: $\\mathbf{x} = A^{-1}\\mathbf{b}$. All arithmetic stays inside the residues, and division by the determinant means multiplying by its inverse modulo $p$.\n\nOver $\\mathbb{Z}_{7}$, solve $\\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$. The determinant is $8 - 3 = 5$, whose inverse is $3$, since $15 \\equiv 1$. Then $x = 3((4)(1) - (1)(2)) = 3(2) = 6$ and $y = 3((2)(2) - (3)(1)) = 3(1) = 3$.\n\nCheck: $(2)(6) + (1)(3) = 15 \\equiv 1$ and $(3)(6) + (4)(3) = 30 \\equiv 2 \\pmod{7}$.\n\n> **Watch out.** Do not divide by the determinant as a fraction: multiply by its inverse modulo $p$, and reduce the result to a value from $0$ to $p - 1$.",
    "$\\mathbb{Z}_{p}$ 上的逆矩阵解线性方程组的方式与实数上相同：$\\mathbf{x} = A^{-1}\\mathbf{b}$。所有运算都在剩余中进行，除以行列式意味着乘以它模 $p$ 的逆。\n\n在 $\\mathbb{Z}_{7}$ 上解 $\\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$。行列式为 $8 - 3 = 5$，它的逆为 $3$，因为 $15 \\equiv 1$。于是 $x = 3((4)(1) - (1)(2)) = 3(2) = 6$，$y = 3((2)(2) - (3)(1)) = 3(1) = 3$。\n\n检验：$(2)(6) + (1)(3) = 15 \\equiv 1$，$(3)(6) + (4)(3) = 30 \\equiv 2 \\pmod{7}$。\n\n> **注意。** 不要把除以行列式当作分数来做：要乘以它模 $p$ 的逆，并把结果约化为 $0$ 到 $p - 1$ 之间的值。",
  ],
  (rng) => {
    const p = rng.pick([5, 7, 11, 13]);
    const a = rng.int(1, p - 1);
    const b = rng.int(0, p - 1);
    const c = rng.int(0, p - 1);
    let d = rng.int(1, p - 1);
    if ((a * d - b * c) % p === 0) d = d === p - 1 ? 1 : d + 1;
    const det = (((a * d - b * c) % p) + p) % p;
    const u = rng.int(0, p - 1);
    const v = rng.int(0, p - 1);
    const inv = inverseMod(det, p);
    const top = (((d * u - b * v) % p) + p) % p;
    const bottom = (((a * v - c * u) % p) + p) % p;
    const x = (inv * top) % p;
    const y = (inv * bottom) % p;
    const off = (shift: number) =>
      why((x + shift) % p, "That is not the solution: substituting it back does not give the right side.", "那不是解：代回去得不到右边。");
    return numberProblem({
      prompt: t(
        `Over $\\mathbb{Z}_{${p}}$, solve $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$. Find $x$, as a value from $0$ to $${p - 1}$.`,
        `在 $\\mathbb{Z}_{${p}}$ 上解 $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$。求 $x$，取值范围为 $0$ 到 $${p - 1}$。`,
      ),
      answer: x,
      mistakes: distinctRingMistakes(x, [
        y === x ? off(1) : why(y, "That is $y$, the second unknown; the question asks for $x$.", "那是第二个未知数 $y$；题目求的是 $x$。"),
        top === x
          ? off(2)
          : why(
              top,
              `That is $(${d})(${u}) - (${b})(${v})$ reduced, before multiplying by the inverse $${inv}$ of the determinant.`,
              `那是约化后的 $(${d})(${u}) - (${b})(${v})$，还没有乘以行列式的逆 $${inv}$。`,
            ),
        det === x ? off(3) : why(det, "That is the determinant, not the unknown $x$.", "那是行列式，而不是未知数 $x$。"),
      ]),
      solution: walked(
        [
          [
            ["Invert the determinant", "求行列式的逆"],
            t(
              `$(${a})(${d}) - (${b})(${c}) = ${a * d - b * c} \\equiv ${det}$, and $(${det})(${inv}) = ${det * inv} \\equiv 1 \\pmod{${p}}$, so the inverse of the determinant is $${inv}$.`,
              `$(${a})(${d}) - (${b})(${c}) = ${a * d - b * c} \\equiv ${det}$，而 $(${det})(${inv}) = ${det * inv} \\equiv 1 \\pmod{${p}}$，所以行列式的逆为 $${inv}$。`,
            ),
          ],
          [
            ["Apply the inverse matrix", "用逆矩阵"],
            t(
              `$x = ${inv}((${d})(${u}) - (${b})(${v})) = ${inv}(${d * u - b * v}) \\equiv (${inv})(${top}) \\equiv ${x} \\pmod{${p}}$, and similarly $y = ${y}$.`,
              `$x = ${inv}((${d})(${u}) - (${b})(${v})) = ${inv}(${d * u - b * v}) \\equiv (${inv})(${top}) \\equiv ${x} \\pmod{${p}}$，同理 $y = ${y}$。`,
            ),
          ],
        ],
        t(
          `$(${a})(${x}) + (${b})(${y}) = ${a * x + b * y} \\equiv ${u}$ and $(${c})(${x}) + (${d})(${y}) = ${c * x + d * y} \\equiv ${v} \\pmod{${p}}$.`,
          `$(${a})(${x}) + (${b})(${y}) = ${a * x + b * y} \\equiv ${u}$，$(${c})(${x}) + (${d})(${y}) = ${c * x + d * y} \\equiv ${v} \\pmod{${p}}$。`,
        ),
      ),
    });
  },
);

const subringIdentity = point(
  "the-identity-of-a-subring",
  ["The identity of a subring", "子环的单位元"],
  [
    "A subring of $\\mathbb{Z}_{n}$ can have its own identity, different from $1$. If $n = dm$ with $d$ and $m$ coprime, then $\\langle d \\rangle$ has an identity $e$, namely the element with $e \\equiv 0 \\pmod{d}$ and $e \\equiv 1 \\pmod{m}$.\n\nIn $\\mathbb{Z}_{20}$, the subring $\\langle 4 \\rangle = \\{0, 4, 8, 12, 16\\}$ has identity $16$: it is a multiple of $4$, and $16 \\equiv 1 \\pmod{5}$.\n\nCheck: $16 \\cdot 8 = 128 \\equiv 8$ and $16 \\cdot 12 = 192 \\equiv 12 \\pmod{20}$.\n\n> **Watch out.** The identity is not $1$, which does not lie in $\\langle d \\rangle$, and usually not $d$ itself: here $4 \\cdot 4 = 16 \\ne 4$.",
    "$\\mathbb{Z}_{n}$ 的子环可以有自己的单位元，不同于 $1$。如果 $n = dm$，且 $d$ 与 $m$ 互素，那么 $\\langle d \\rangle$ 有单位元 $e$，即满足 $e \\equiv 0 \\pmod{d}$ 和 $e \\equiv 1 \\pmod{m}$ 的元素。\n\n在 $\\mathbb{Z}_{20}$ 中，子环 $\\langle 4 \\rangle = \\{0, 4, 8, 12, 16\\}$ 的单位元为 $16$：它是 $4$ 的倍数，且 $16 \\equiv 1 \\pmod{5}$。\n\n检验：$16 \\cdot 8 = 128 \\equiv 8$，$16 \\cdot 12 = 192 \\equiv 12 \\pmod{20}$。\n\n> **注意。** 单位元不是 $1$，因为 $1$ 不在 $\\langle d \\rangle$ 中；通常也不是 $d$ 本身：这里 $4 \\cdot 4 = 16 \\ne 4$。",
  ],
  (rng) => {
    const [d, m] = rng.pick([
      [2, 3],
      [3, 2],
      [2, 5],
      [5, 2],
      [3, 4],
      [4, 3],
      [3, 5],
      [5, 3],
      [4, 5],
      [5, 4],
      [2, 7],
      [7, 2],
      [3, 7],
      [7, 3],
      [4, 7],
      [7, 4],
      [5, 6],
      [6, 5],
      [5, 7],
      [7, 5],
      [3, 8],
      [8, 3],
      [5, 8],
      [8, 5],
      [7, 8],
      [8, 7],
    ] as const);
    const n = d * m;
    let e = 0;
    while (e % d !== 0 || e % m !== 1) e += 1;
    const multiples = Array.from({ length: m }, (_, i) => i * d);
    return numberProblem({
      prompt: t(
        `The subring $\\langle ${d} \\rangle$ of $\\mathbb{Z}_{${n}}$ has a multiplicative identity. Find it.`,
        `$\\mathbb{Z}_{${n}}$ 的子环 $\\langle ${d} \\rangle$ 有乘法单位元。求它。`,
      ),
      answer: e,
      mistakes: distinctRingMistakes(e, [
        e === d
          ? why(
              (2 * d) % n,
              `That is another multiple of $${d}$, but it does not act as $1$: it is not $\\equiv 1 \\pmod{${m}}$.`,
              `那是 $${d}$ 的另一个倍数，但它不起 $1$ 的作用：它不 $\\equiv 1 \\pmod{${m}}$。`,
            )
          : why(
              d,
              `That is the generator; $${d} \\cdot ${d} = ${d * d} \\equiv ${(d * d) % n}$, not $${d}$, so it is not the identity.`,
              `那是生成元；$${d} \\cdot ${d} = ${d * d} \\equiv ${(d * d) % n}$，不是 $${d}$，所以它不是单位元。`,
            ),
        why(1, `$1$ is not a multiple of $${d}$, so it does not lie in the subring.`, `$1$ 不是 $${d}$ 的倍数，所以不在这个子环中。`),
        why(m, `$${m}$ is not a multiple of $${d}$, so it does not lie in the subring.`, `$${m}$ 不是 $${d}$ 的倍数，所以不在这个子环中。`),
      ]),
      solution: walked(
        [
          [
            ["State the conditions", "写出条件"],
            t(
              `The identity $e$ lies in $\\langle ${d} \\rangle$, so $e \\equiv 0 \\pmod{${d}}$, and it acts as $1$ on the subring, so $e \\equiv 1 \\pmod{${m}}$.`,
              `单位元 $e$ 在 $\\langle ${d} \\rangle$ 中，所以 $e \\equiv 0 \\pmod{${d}}$；它对子环起 $1$ 的作用，所以 $e \\equiv 1 \\pmod{${m}}$。`,
            ),
          ],
          [
            ["Search the multiples", "在倍数中查找"],
            t(
              `Among the multiples $${multiples.join(", ")}$ of $${d}$, the one that is $\\equiv 1 \\pmod{${m}}$ is $e = ${e}$.`,
              `在 $${d}$ 的倍数 $${multiples.join(", ")}$ 中，$\\equiv 1 \\pmod{${m}}$ 的是 $e = ${e}$。`,
            ),
          ],
        ],
        t(
          `$${e}^{2} = ${e * e} \\equiv ${(e * e) % n}$ and $(${e})(${d}) = ${e * d} \\equiv ${(e * d) % n} \\pmod{${n}}$, so $${e}$ fixes itself and the generator.`,
          `$${e}^{2} = ${e * e} \\equiv ${(e * e) % n}$，$(${e})(${d}) = ${e * d} \\equiv ${(e * d) % n} \\pmod{${n}}$，所以 $${e}$ 保持自身和生成元不变。`,
        ),
      ),
    });
  },
);

const kernelOfDiagonal = point(
  "the-kernel-of-a-map-into-a-product-ring",
  ["The kernel of a map into a product ring", "映到乘积环的映射的核"],
  [
    "The map $\\mathbb{Z} \\to \\mathbb{Z}_{a} \\times \\mathbb{Z}_{b}$ sends $x$ to its two residues. An integer lies in the kernel when both residues are zero, so it is a common multiple of $a$ and $b$, and the kernel is generated by their least common multiple.\n\nFor $\\mathbb{Z} \\to \\mathbb{Z}_{9} \\times \\mathbb{Z}_{12}$, the kernel is $36\\mathbb{Z}$, since $\\operatorname{lcm}(9, 12) = \\frac{9 \\cdot 12}{3} = 36$.\n\nCheck: $36 = 9 \\cdot 4 = 12 \\cdot 3$ goes to $(0, 0)$, while $18$ goes to $(0, 6)$.\n\n> **Watch out.** The generator is the lcm, not the product $ab$: $9 \\cdot 12 = 108$ is in the kernel, but so is the smaller $36$.",
    "映射 $\\mathbb{Z} \\to \\mathbb{Z}_{a} \\times \\mathbb{Z}_{b}$ 把 $x$ 映到它的两个余数。整数属于核，是指两个余数都为零，所以它是 $a$ 和 $b$ 的公倍数，核由它们的最小公倍数生成。\n\n对 $\\mathbb{Z} \\to \\mathbb{Z}_{9} \\times \\mathbb{Z}_{12}$，核为 $36\\mathbb{Z}$，因为 $\\operatorname{lcm}(9, 12) = \\frac{9 \\cdot 12}{3} = 36$。\n\n检验：$36 = 9 \\cdot 4 = 12 \\cdot 3$ 映到 $(0, 0)$，而 $18$ 映到 $(0, 6)$。\n\n> **注意。** 生成元是最小公倍数，而不是乘积 $ab$：$9 \\cdot 12 = 108$ 在核中，但更小的 $36$ 也在。",
  ],
  (rng) => {
    const a = rng.int(2, 24);
    let b = rng.int(2, 24);
    if (b === a) b += 1;
    const answer = lcm(a, b);
    const g = gcd(a, b);
    return numberProblem({
      prompt: t(
        `The ring homomorphism $\\varphi: \\mathbb{Z} \\to \\mathbb{Z}_{${a}} \\times \\mathbb{Z}_{${b}}$ is $\\varphi(x) = (x, x)$. Its kernel is $m\\mathbb{Z}$ with $m > 0$. Find $m$.`,
        `环同态 $\\varphi: \\mathbb{Z} \\to \\mathbb{Z}_{${a}} \\times \\mathbb{Z}_{${b}}$ 为 $\\varphi(x) = (x, x)$。它的核是 $m\\mathbb{Z}$，其中 $m > 0$。求 $m$。`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        a * b === answer
          ? why(answer + 1, "That is one too many: the generator is exactly the lcm.", "多了一：生成元恰好是最小公倍数。")
          : why(
              a * b,
              `That is the product $${a} \\cdot ${b}$, a common multiple but not the least, since $\\gcd(${a}, ${b}) = ${g}$.`,
              `那是乘积 $${a} \\cdot ${b}$，是公倍数但不是最小的，因为 $\\gcd(${a}, ${b}) = ${g}$。`,
            ),
        why(g, "That is the gcd; the kernel needs multiples of both moduli.", "那是最大公因数；核中的数必须同时是两个模的倍数。"),
        why(a + b, "That adds the moduli; the kernel consists of the common multiples.", "那是把两个模相加；核由公倍数组成。"),
      ]),
      solution: walked(
        [
          [
            ["Describe the kernel", "描述核"],
            t(`$x$ is in the kernel when both $${a} \\mid x$ and $${b} \\mid x$.`, `当 $${a} \\mid x$ 且 $${b} \\mid x$ 时，$x$ 属于核。`),
          ],
          [
            ["Take the lcm", "取最小公倍数"],
            t(
              `The positive generator is $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${answer}$.`,
              `正生成元是 $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer} \\div ${a} = ${answer / a}$ and $${answer} \\div ${b} = ${answer / b}$ are whole numbers, so $\\varphi(${answer}) = (0, 0)$.`,
          `$${answer} \\div ${a} = ${answer / a}$ 与 $${answer} \\div ${b} = ${answer / b}$ 都是整数，所以 $\\varphi(${answer}) = (0, 0)$。`,
        ),
      ),
    });
  },
);

const idempotents = point(
  "idempotents-and-homomorphisms-of-residue-rings",
  ["Idempotents and homomorphisms of residue rings", "幂等元与剩余环的同态"],
  [
    "A ring homomorphism out of a residue ring must send $1$ to an idempotent, an element with $e^{2} = e$. In $\\mathbb{Z}_{n}$, the Chinese remainder theorem gives $2^{\\omega(n)}$ idempotents, where $\\omega(n)$ counts the distinct prime factors of $n$, since each prime power takes either $0$ or $1$.\n\n$\\mathbb{Z}_{30}$, with $30 = 2 \\cdot 3 \\cdot 5$, has $2^{3} = 8$ idempotents: $0, 1, 6, 10, 15, 16, 21, 25$.\n\nCheck: $6^{2} = 36 \\equiv 6$, $10^{2} = 100 \\equiv 10$ and $15^{2} = 225 \\equiv 15 \\pmod{30}$.\n\n> **Watch out.** Count distinct primes, not prime factors with repetition: $\\mathbb{Z}_{8}$ has only the $2$ idempotents $0$ and $1$, although $8 = 2 \\cdot 2 \\cdot 2$.",
    "从剩余环出发的环同态必须把 $1$ 映到幂等元，即满足 $e^{2} = e$ 的元素。在 $\\mathbb{Z}_{n}$ 中，由中国剩余定理，有 $2^{\\omega(n)}$ 个幂等元，其中 $\\omega(n)$ 是 $n$ 的不同素因子个数，因为每个素数幂取 $0$ 或 $1$。\n\n$\\mathbb{Z}_{30}$ 中 $30 = 2 \\cdot 3 \\cdot 5$，有 $2^{3} = 8$ 个幂等元：$0, 1, 6, 10, 15, 16, 21, 25$。\n\n检验：$6^{2} = 36 \\equiv 6$，$10^{2} = 100 \\equiv 10$，$15^{2} = 225 \\equiv 15 \\pmod{30}$。\n\n> **注意。** 要数不同的素因子，而不是带重复的素因子：$\\mathbb{Z}_{8}$ 只有 $0$ 和 $1$ 这 $2$ 个幂等元，尽管 $8 = 2 \\cdot 2 \\cdot 2$。",
  ],
  (rng) => {
    const n = rng.int(6, 210);
    const list: number[] = [];
    for (let e = 0; e < n; e++) if ((e * e - e) % n === 0) list.push(e);
    const answer = list.length;
    const fs = factorize(n);
    const primes = fs.length;
    const powers = fs.map(([p, k]) => (k === 1 ? `${p}` : `${p}^{${k}}`)).join(" \\cdot ");
    const power = primes === 1 ? "2" : `2^{${primes}}`;
    const sample = list[2];
    return numberProblem({
      prompt: t(
        `How many elements $e$ of $\\mathbb{Z}_{${n}}$ satisfy $e^{2} = e$?`,
        `$\\mathbb{Z}_{${n}}$ 中有多少个元素 $e$ 满足 $e^{2} = e$？`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        answer === 2
          ? why(3, "That is one too many: a prime power has only the idempotents $0$ and $1$.", "多了一个：素数幂只有幂等元 $0$ 和 $1$。")
          : why(
              2,
              "That counts only $0$ and $1$; each prime power can independently take $0$ or $1$.",
              "那只数了 $0$ 和 $1$；每个素数幂都可以独立地取 $0$ 或 $1$。",
            ),
        primes === answer
          ? why(answer + 1, "That is one too many: there are exactly two choices per prime.", "多了一个：每个素数恰有两种选择。")
          : why(
              primes,
              `That counts the distinct primes; each gives two choices, so there are $${power}$ idempotents.`,
              `那数的是不同素因子的个数；每个给出两种选择，所以幂等元有 $${power}$ 个。`,
            ),
        why(
          answer + 2,
          "That is two too many: count the choices of $0$ or $1$ for each prime power.",
          "多了两个：要数每个素数幂取 $0$ 或 $1$ 的选择。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Factor the modulus", "分解模"],
            t(
              `$${n} = ${powers}$ has $${primes}$ distinct prime ${primes === 1 ? "factor" : "factors"}.`,
              `$${n} = ${powers}$ 有 $${primes}$ 个不同的素因子。`,
            ),
          ],
          [
            ["Count the choices", "数选择"],
            t(
              `By the Chinese remainder theorem, $e$ is $0$ or $1$ modulo each prime power, giving $${power} = ${answer}$ idempotents: $${list.join(", ")}$.`,
              `由中国剩余定理，$e$ 模每个素数幂为 $0$ 或 $1$，所以有 $${power} = ${answer}$ 个幂等元：$${list.join(", ")}$。`,
            ),
          ],
        ],
        sample === undefined
          ? t(
              `$${n}$ is a prime power, so only $0$ and $1$ are idempotent: $0^{2} = 0$ and $1^{2} = 1$.`,
              `$${n}$ 是素数幂，所以只有 $0$ 和 $1$ 是幂等元：$0^{2} = 0$，$1^{2} = 1$。`,
            )
          : t(
              `$${sample}^{2} = ${sample * sample} \\equiv ${(sample * sample) % n} \\pmod{${n}}$, so $${sample}$ is indeed idempotent.`,
              `$${sample}^{2} = ${sample * sample} \\equiv ${(sample * sample) % n} \\pmod{${n}}$，所以 $${sample}$ 确实是幂等元。`,
            ),
      ),
    });
  },
);

const quotientByLinear = point(
  "the-quotient-on-division-by-a-linear-polynomial",
  ["The quotient on division by a linear polynomial", "除以一次多项式的商"],
  [
    "Synthetic division works over any field. Over $\\mathbb{Z}_{p}$, each step multiplies by the root and adds the next coefficient, reducing modulo $p$. The last number is the remainder, and the numbers before it are the coefficients of the quotient.",
    "综合除法对任何域都适用。在 $\\mathbb{Z}_{p}$ 上，每一步乘以根再加上下一个系数，并模 $p$ 化简。最后一个数是余数，它前面的数是商的系数。",
  ],
  (rng) => {
    const p = rng.pick([5, 7, 11, 13]);
    const a = rng.int(1, p - 1);
    const b = rng.int(0, p - 1);
    const c = rng.int(0, p - 1);
    const d = rng.int(0, p - 1);
    const q2 = (a + b) % p;
    const q1 = (a * q2 + c) % p;
    const r = (a * q1 + d) % p;
    const f = poly([1, "x^{3}"], [b, "x^{2}"], [c, "x"], [d, ""]);
    const q0text = poly([1, "x^{2}"], [q2, "x"], [q1, ""]);
    return ask(
      [
        `In $\\mathbb{Z}_{${p}}[x]$, divide $${f}$ by $x - ${a}$. What is the constant term of the quotient, as a value from $0$ to $${p - 1}$?`,
        `在 $\\mathbb{Z}_{${p}}[x]$ 中，用 $x - ${a}$ 除 $${f}$。商的常数项是多少，取值范围为 $0$ 到 $${p - 1}$？`,
      ],
      q1,
      [r === q1 ? (q1 + 1) % p : r, q2 === q1 ? (q1 + 2) % p : q2, (a * q2) % p === q1 ? (q1 + 3) % p : (a * q2) % p],
      [
        `Synthetic division with the root $${a}$ gives the numbers $1, ${q2}, ${q1}$ and the remainder $${r}$. So the quotient is $${q0text}$, whose constant term is $${q1}$.`,
        `用根 $${a}$ 做综合除法，得数 $1, ${q2}, ${q1}$，余数是 $${r}$。所以商是 $${q0text}$，常数项是 $${q1}$。`,
      ],
    );
  },
);

const commonRoot = point(
  "a-common-root-from-the-gcd",
  ["A common root from the gcd", "由最大公因式求公共根"],
  [
    "A common root of two polynomials is a root of their greatest common divisor, so the Euclidean algorithm finds common roots without factoring either polynomial. For two monic quadratics, one subtraction already gives a linear polynomial whose root can be read off.",
    "两个多项式的公共根是它们的最大公因式的根，所以欧几里得算法不必分解任一多项式就能求出公共根。对两个首一二次多项式，一次相减就得到一个一次多项式，它的根可以直接读出。",
  ],
  (rng) => {
    const p = rng.pick([7, 11, 13, 17]);
    // Nonzero roots, since a root of 0 would show in the missing constant terms.
    const [a, b, c] = rng.sample(
      [...Array(p - 1).keys()].map((v) => v + 1),
      3,
    ) as [number, number, number];
    const coefficient = (s: number, t: number) => [(p - ((s + t) % p)) % p, (s * t) % p] as const;
    const [f1, f0] = coefficient(a, b);
    const [g1, g0] = coefficient(a, c);
    const f = poly([1, "x^{2}"], [f1, "x"], [f0, ""]);
    const g = poly([1, "x^{2}"], [g1, "x"], [g0, ""]);
    const u = (((f1 - g1) % p) + p) % p;
    const w = (((f0 - g0) % p) + p) % p;
    const diff = poly([u, "x"], [w, ""]);
    return ask(
      [
        `The polynomials $${f}$ and $${g}$ in $\\mathbb{Z}_{${p}}[x]$ have exactly one common root. Find it, as a value from $0$ to $${p - 1}$.`,
        `$\\mathbb{Z}_{${p}}[x]$ 中的多项式 $${f}$ 和 $${g}$ 恰好有一个公共根。求它，取值范围为 $0$ 到 $${p - 1}$。`,
      ],
      a,
      [b, c, (a + 1) % p],
      [
        `The difference of the two polynomials is $${diff}$, and any common root is a root of it. Its root is $${a}$, and substituting confirms that this is a root of both.`,
        `两个多项式之差是 $${diff}$，任何公共根都是它的根。它的根是 $${a}$，代入可验证这是两者的根。`,
      ],
    );
  },
);

const inverseModLinear = point(
  "the-inverse-modulo-a-linear-polynomial",
  ["The inverse modulo a linear polynomial", "模一次多项式的逆"],
  [
    "Modulo $x - a$, every polynomial is congruent to its value at $a$, so the quotient ring is just $\\mathbb{Z}_{p}$. The extended Euclidean algorithm stops after one step: the inverse of a polynomial is a constant, namely the inverse of its value at $a$.",
    "模 $x - a$ 时，每个多项式都同余于它在 $a$ 处的值，所以商环就是 $\\mathbb{Z}_{p}$。扩展欧几里得算法一步就结束：多项式的逆是一个常数，即它在 $a$ 处的值的逆。",
  ],
  (rng) => {
    const p = rng.pick([5, 7, 11, 13]);
    const a = rng.int(1, p - 1);
    const b = rng.int(0, p - 1);
    let c = rng.int(0, p - 1);
    if ((a * a + b * a + c) % p === 0) c = (c + 1) % p;
    const value = (a * a + b * a + c) % p;
    const answer = inverseMod(value, p);
    const f = poly([1, "x^{2}"], [b, "x"], [c, ""]);
    return ask(
      [
        `In $\\mathbb{Z}_{${p}}[x]/\\langle x - ${a} \\rangle$, the inverse of $${f}$ is a constant. Find it, as a value from $1$ to $${p - 1}$.`,
        `在 $\\mathbb{Z}_{${p}}[x]/\\langle x - ${a} \\rangle$ 中，$${f}$ 的逆是一个常数。求它，取值范围为 $1$ 到 $${p - 1}$。`,
      ],
      answer,
      [
        value === answer ? (answer % (p - 1)) + 1 : value,
        a === answer ? (answer % (p - 1)) + 1 : a,
        p - answer === answer ? 1 : p - answer,
      ],
      [
        `Modulo $x - ${a}$ the polynomial equals its value at $${a}$, which is $${value}$. The inverse of $${value}$ modulo $${p}$ is $${answer}$.`,
        `模 $x - ${a}$ 时，这个多项式等于它在 $${a}$ 处的值，即 $${value}$。$${value}$ 模 $${p}$ 的逆是 $${answer}$。`,
      ],
    );
  },
);

const realFactorCount = point(
  "the-real-factors-of-x-to-the-n-minus-one",
  ["The real factors of a power minus one", "幂减一的实因式"],
  [
    "Over the reals, $x^{n} - 1$ has the linear factor $x - 1$, and also $x + 1$ when $n$ is even. The other complex roots occur in conjugate pairs, and each pair gives one irreducible quadratic, so the count depends on the parity of $n$.",
    "在实数上，$x^{n} - 1$ 有一次因式 $x - 1$，当 $n$ 为偶数时还有 $x + 1$。其余的复根成共轭对出现，每对给出一个不可约的二次因式，所以个数取决于 $n$ 的奇偶性。",
  ],
  (rng) => {
    const n = rng.int(5, 40);
    const even = n % 2 === 0;
    const linear = even ? 2 : 1;
    const quadratic = (n - linear) / 2;
    const answer = linear + quadratic;
    return ask(
      [
        `Into how many monic irreducible factors does $x^{${n}} - 1$ split over $\\mathbb{R}$?`,
        `$x^{${n}} - 1$ 在 $\\mathbb{R}$ 上分解为多少个首一不可约因式？`,
      ],
      answer,
      [n, quadratic, answer + 1],
      [
        `The real roots give $${linear}$ linear ${linear === 1 ? "factor" : "factors"}. The other $${n - linear}$ roots form $${quadratic}$ conjugate pairs, each giving a quadratic, so the total is $${answer}$.`,
        `实根给出 $${linear}$ 个一次因式。其余 $${n - linear}$ 个根构成 $${quadratic}$ 对共轭复根，每对给出一个二次因式，所以总数是 $${answer}$。`,
      ],
    );
  },
);

const cubicByRoots = point(
  "deciding-a-cubic-by-its-roots",
  ["Deciding a cubic by its roots", "由根判断三次多项式"],
  [
    "A polynomial of degree two or three over a field is reducible exactly when it has a root in the field, because any factorization must contain a linear factor. So testing all the residues decides the question, but this shortcut does not work for higher degrees.",
    "域上二次或三次多项式可约，当且仅当它在该域中有根，因为任何分解都必须包含一次因式。所以检验所有余数就能判断，但这个捷径对更高次数不适用。",
  ],
  (rng) => {
    const p = rng.pick([3, 5, 7, 11]);
    const a = rng.int(0, p - 1);
    const b = rng.int(1, p - 1);
    const value = (x: number) => (powMod(x, 3, p) + a * x + b) % p;
    const roots = [...Array(p).keys()].filter((x) => value(x) === 0);
    const f = poly([1, "x^{3}"], [a, "x"], [b, ""]);
    const noRoot: Pair = [`Irreducible, since it has no root in $\\mathbb{Z}_{${p}}$`, `不可约，因为它在 $\\mathbb{Z}_{${p}}$ 中没有根`];
    const degree: Pair = ["Irreducible, since its degree is odd", "不可约，因为它的次数是奇数"];
    const root = roots[0];
    const fake = [...Array(p).keys()].filter((x) => value(x) !== 0)[0] ?? 0;
    const hasRoot: Pair = [`Reducible, since $${root ?? fake}$ is a root`, `可约，因为 $${root ?? fake}$ 是根`];
    const noLinear: Pair = ["Reducible, since every cubic over a finite field factors", "可约，因为有限域上每个三次多项式都能分解"];
    const option = root === undefined ? noRoot : hasRoot;
    const others = root === undefined ? [hasRoot, degree, noLinear] : [noRoot, degree, noLinear];
    const values = [...Array(p).keys()].map(value).join(", ");
    return choose(
      rng,
      [`Is $${f}$ irreducible over $\\mathbb{Z}_{${p}}$?`, `$${f}$ 在 $\\mathbb{Z}_{${p}}$ 上是否不可约？`],
      option,
      others,
      [
        `Its values at $0, 1, \\dots, ${p - 1}$ are $${values}$. ${root === undefined ? "None is zero, so a cubic has no linear factor and is irreducible." : `The value at $${root}$ is zero, so $x - ${root}$ is a factor.`}`,
        `它在 $0, 1, \\dots, ${p - 1}$ 处的值是 $${values}$。${root === undefined ? "没有一个为零，所以三次多项式没有一次因式，是不可约的。" : `在 $${root}$ 处的值为零，所以 $x - ${root}$ 是因式。`}`,
      ],
    );
  },
);

const rationalCandidates = point(
  "counting-the-candidates-of-the-rational-root-test",
  ["Counting the candidates of the rational root test", "计算有理根检验的候选数"],
  [
    "The rational root test lists the fractions $\\pm \\frac{r}{s}$, with $r$ dividing the constant term and $s$ dividing the leading coefficient. Different pairs can give the same number, so the candidates must be counted in lowest terms, or the same value is counted twice.",
    "有理根检验列出分数 $\\pm \\frac{r}{s}$，其中 $r$ 整除常数项，$s$ 整除首项系数。不同的数对可能给出同一个数，所以候选数必须按最简分数计算，否则同一个值会被计算两次。",
  ],
  (rng) => {
    const lead = rng.int(2, 12);
    const last = rng.int(2, 30);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const seen = new Set<string>();
    const list: [number, number][] = [];
    for (const r of divisors(last)) {
      for (const s of divisors(lead)) {
        const g = gcd(r, s);
        const key = `${r / g}/${s / g}`;
        if (!seen.has(key)) {
          seen.add(key);
          list.push([r / g, s / g]);
        }
      }
    }
    const answer = 2 * list.length;
    const pairsCount = divisors(last).length * divisors(lead).length;
    const f = poly([lead, "x^{3}"], [b, "x^{2}"], [c, "x"], [last, ""]);
    return ask(
      [
        `How many different rational numbers does the rational root test list as candidates for $${f}$?`,
        `对 $${f}$，有理根检验列出多少个不同的有理数作为候选？`,
      ],
      answer,
      [2 * pairsCount === answer ? answer + 2 : 2 * pairsCount, list.length, divisors(last).length * 2],
      [
        `The constant term has $${divisors(last).length}$ positive divisors and the leading coefficient has $${divisors(lead).length}$. Reducing the fractions leaves $${list.length}$ positive values, and with the signs there are $${answer}$.`,
        `常数项有 $${divisors(last).length}$ 个正因数，首项系数有 $${divisors(lead).length}$ 个。约分后剩下 $${list.length}$ 个正值，加上符号共 $${answer}$ 个。`,
      ],
    );
  },
);

const quaternionCommutator = point(
  "the-commutator-of-two-quaternions",
  ["The commutator of two quaternions", "两个四元数的交换子"],
  [
    "Linear equations over the quaternions need separate left and right solutions because multiplication is not commutative. The difference $pq - qp$ measures this. It has no real part, and only the vector parts contribute, so the real coefficients of $p$ and $q$ do not affect it.",
    "四元数上的线性方程需要分别求左解和右解，因为乘法不可交换。差 $pq - qp$ 衡量了这一点。它没有实部，只有向量部分起作用，所以 $p$ 和 $q$ 的实系数不影响它。",
  ],
  (rng) => {
    const entry = () => rng.int(-4, 4);
    const p = [entry(), entry(), rng.pick([-3, -2, -1, 1, 2, 3]), entry()];
    const q = [entry(), rng.pick([-3, -2, -1, 1, 2, 3]), entry(), entry()];
    const pq = quaternionProduct(p, q);
    const qp = quaternionProduct(q, p);
    const answer = (pq[3] as number) - (qp[3] as number);
    const show = (v: readonly number[]) => poly([v[0] as number, ""], [v[1] as number, "i"], [v[2] as number, "j"], [v[3] as number, "k"]);
    return ask(
      [
        `Let $p = ${show(p)}$ and $q = ${show(q)}$. Find the coefficient of $k$ in $pq - qp$.`,
        `设 $p = ${show(p)}$，$q = ${show(q)}$。求 $pq - qp$ 中 $k$ 的系数。`,
      ],
      answer,
      [pq[3] as number, -answer === answer ? 1 : -answer, answer === 0 ? 2 : answer / 2],
      [
        `We find $pq = ${show(pq)}$ and $qp = ${show(qp)}$. Subtracting the coefficients of $k$ gives $${answer}$.`,
        `算得 $pq = ${show(pq)}$，$qp = ${show(qp)}$。把 $k$ 的系数相减，得 $${answer}$。`,
      ],
    );
  },
);

/** deeperAbstractAlgebraThird2Points maps topics of Abstract Algebra, on group actions, rings and polynomials, to a third knowledge point. */
export const deeperAbstractAlgebraThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  orbits: [burnside],
  "the-orbit-stabilizer-theorem": [orbitsFromStabilizers],
  "the-class-equation-of-a-group-action": [dihedralClasses],
  "conjugacy-of-group-subsets-and-subgroups": [cycleConjugates],
  "cycle-types-of-permutations-of-some-groups": [rotationsWithCycles],
  "permutation-actions-on-sets-of-words": [wordOrbits],
  "colorings-of-necklaces": [rotationFixedColorings],
  "introduction-to-rings": [normInRing],
  "commutative-rings": [zeroDivisorCount],
  "the-characteristic-of-a-ring": [freshmansDream],
  "finding-the-inverse-of-a-matrix-over-a-ring": [systemOverField],
  subrings: [subringIdentity],
  "ring-homomorphisms": [kernelOfDiagonal],
  "ring-homomorphisms-between-residue-rings": [idempotents],
  "the-division-algorithm-in-rings-of-polynomials-over-finite-fields": [quotientByLinear],
  "the-euclidian-algorithm-in-rings-of-polynomials": [commonRoot],
  "the-extended-euclidian-algorithm-in-rings-of-polynomials": [inverseModLinear],
  "irreducible-polynomials-over-the-real-and-complex-numbers": [realFactorCount],
  "irreducible-polynomials-over-a-finite-field": [cubicByRoots],
  "reducibility-tests-for-polynomials-over-the-integers-and-rationals": [rationalCandidates],
  "linear-equations-over-quaternions": [quaternionCommutator],
};
