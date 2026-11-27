// Third knowledge points for thin topics of Abstract Algebra, on group actions, rings and
// polynomials: the reverse question, a harder case or a common trap.
// See `deeperAbstractAlgebraThird2Points`.

import type { KnowledgePointDef, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { choose, divisors, factorize, type Pair, point, powMod, totient } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { factorial } from "./deeper-abstract-algebra-third.ts";
import { gcd, lcm } from "./deeper-methods-of-proof-third.ts";

/** asPair turns a text into a pair, so that a walked solution can go where a pair is expected. */
const asPair = (x: Text): Pair => [x.en, x["zh-CN"]];

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
    "Burnside's lemma counts orbits by averaging: the number of orbits is the sum over the group of the number of points each element fixes, divided by the order of the group. The identity fixes every point, so it must be included in the sum.\n\nA group of order $4$ acts on $7$ points, and besides the identity its elements fix $1$, $3$ and $1$ points. The sum is $7 + 1 + 3 + 1 = 12$, so there are $\\frac{12}{4} = 3$ orbits.\n\nCheck: the cyclic group of order $4$ acting with orbits of sizes $1$, $2$ and $4$ gives exactly these fixed points, and it has $3$ orbits.\n\n> **Watch out.** Leaving out the identity gives $\\frac{1 + 3 + 1}{4} = \\frac{5}{4}$, not even a whole number; its fixed points, the whole set, belong in the sum.",
    "伯恩赛德引理用求平均的方法计算轨道数：轨道数等于群中每个元素固定的点数之和，再除以群的阶。单位元固定每个点，所以必须计入总和。\n\n阶为 $4$ 的群作用在 $7$ 个点上，除单位元外各元素分别固定 $1$、$3$、$1$ 个点。总和是 $7 + 1 + 3 + 1 = 12$，所以有 $\\frac{12}{4} = 3$ 个轨道。\n\n检验：$4$ 阶循环群以大小为 $1$、$2$、$4$ 的轨道作用时，恰好给出这些不动点个数，它有 $3$ 个轨道。\n\n> **注意。** 漏掉单位元会得到 $\\frac{1 + 3 + 1}{4} = \\frac{5}{4}$，连整数都不是；单位元的不动点，也就是整个集合，必须计入总和。",
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
    return numberProblem({
      prompt: t(
        `A group of order $${g}$ acts on a set of $${size}$ points. Besides the identity, its elements fix $${list.join(", ")}$ points. How many orbits are there?`,
        `阶为 $${g}$ 的群作用在 $${size}$ 个点的集合上。除单位元外，各元素分别固定 $${list.join(", ")}$ 个点。有多少个轨道？`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          Math.floor((total - size) / g),
          `That leaves out the identity, which fixes all $${size}$ points.`,
          `这漏掉了单位元，它固定全部 $${size}$ 个点。`,
        ),
        why(
          Math.floor(total / (g - 1)),
          `That divides by $${g - 1}$, the elements other than the identity; the average is over all $${g}$ elements.`,
          `这是除以单位元以外的 $${g - 1}$ 个元素；平均要对全部 $${g}$ 个元素取。`,
        ),
        why(total, `That is the sum of the fixed points; divide it by the order $${g}$.`, `这是不动点之和；还要除以群的阶 $${g}$。`),
      ]),
      solution: walked(
        [
          [
            ["Add the fixed points", "求不动点之和"],
            t(
              `The identity fixes all $${size}$ points, so the total is $${size} + ${list.join(" + ")} = ${total}$.`,
              `单位元固定全部 $${size}$ 个点，所以总和是 $${size} + ${list.join(" + ")} = ${total}$。`,
            ),
          ],
          [
            ["Divide by the order", "除以群的阶"],
            t(
              `By Burnside's lemma there are $\\frac{${total}}{${g}} = ${answer}$ orbits.`,
              `由伯恩赛德引理，共有 $\\frac{${total}}{${g}} = ${answer}$ 个轨道。`,
            ),
          ],
        ],
        t(`$${answer} \\cdot ${g} = ${total}$, the sum of the fixed points.`, `$${answer} \\cdot ${g} = ${total}$，正是不动点之和。`),
      ),
    });
  },
);

const orbitsFromStabilizers = point(
  "the-number-of-orbits-when-stabilizers-agree",
  ["The number of orbits when stabilizers agree", "稳定子大小相同时的轨道数"],
  [
    "If every stabilizer has the same order, then the orbit-stabilizer theorem makes all the orbits the same size, namely the group order divided by the stabilizer order. Since the orbits partition the set, the number of orbits is the set size divided by this common orbit size.\n\nA group of order $24$ acts on $30$ elements, and every stabilizer has order $4$. Each orbit has $\\frac{24}{4} = 6$ elements, so there are $\\frac{30}{6} = 5$ orbits.\n\nCheck: $5$ orbits of $6$ elements make $5 \\cdot 6 = 30$ elements.\n\n> **Watch out.** Divide the size of the set by the size of an orbit, not by the order of the stabilizer: $\\frac{30}{4}$ is not even a whole number.",
    "如果每个稳定子的阶都相同，轨道-稳定子定理使所有轨道大小相同，都等于群的阶除以稳定子的阶。由于轨道划分集合，轨道数就是集合大小除以这个公共的轨道大小。\n\n阶为 $24$ 的群作用在 $30$ 个元素上，每个稳定子的阶都是 $4$。每个轨道有 $\\frac{24}{4} = 6$ 个元素，所以有 $\\frac{30}{6} = 5$ 个轨道。\n\n检验：$5$ 个各含 $6$ 个元素的轨道共有 $5 \\cdot 6 = 30$ 个元素。\n\n> **注意。** 要用集合的大小除以轨道的大小，而不是除以稳定子的阶：$\\frac{30}{4}$ 连整数都不是。",
  ],
  (rng) => {
    const g = rng.pick([12, 24, 36, 48, 60, 72, 120]);
    const s = rng.pick(divisors(g).filter((d) => d > 1 && d < g));
    const size = g / s;
    const answer = rng.int(2, 12);
    const X = answer * size;
    return numberProblem({
      prompt: t(
        `A group of order $${g}$ acts on a set of $${X}$ elements, and every stabilizer has order $${s}$. How many orbits are there?`,
        `阶为 $${g}$ 的群作用在 $${X}$ 个元素的集合上，每个稳定子的阶都是 $${s}$。有多少个轨道？`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(size, "That is the size of each orbit, not the number of orbits.", "这是每个轨道的大小，而不是轨道的个数。"),
        why(X, "That is the number of elements; each orbit holds several of them.", "这是元素的个数；每个轨道含有多个元素。"),
        why(g, "That is the order of the group, not the number of orbits.", "这是群的阶，而不是轨道的个数。"),
        why(s, "That is the order of each stabilizer, not the number of orbits.", "这是每个稳定子的阶，而不是轨道的个数。"),
      ]),
      solution: walked(
        [
          [
            ["Find the orbit size", "求轨道的大小"],
            t(
              `By the orbit-stabilizer theorem each orbit has $\\frac{${g}}{${s}} = ${size}$ elements.`,
              `由轨道-稳定子定理，每个轨道有 $\\frac{${g}}{${s}} = ${size}$ 个元素。`,
            ),
          ],
          [
            ["Divide the set", "划分集合"],
            t(
              `The orbits partition the set, so there are $\\frac{${X}}{${size}} = ${answer}$ orbits.`,
              `轨道划分集合，所以有 $\\frac{${X}}{${size}} = ${answer}$ 个轨道。`,
            ),
          ],
        ],
        t(
          `$${answer}$ orbits of $${size}$ elements make $${answer} \\cdot ${size} = ${X}$ elements.`,
          `$${answer}$ 个各含 $${size}$ 个元素的轨道共有 $${answer} \\cdot ${size} = ${X}$ 个元素。`,
        ),
      ),
    });
  },
);

const dihedralClasses = {
  ...point(
    "the-conjugacy-classes-of-a-dihedral-group",
    ["The conjugacy classes of a dihedral group", "二面体群的共轭类"],
    [
      "The class equation sorts a group by conjugacy. In $D_{n}$, each rotation is conjugate to its inverse, and the reflections form one class for odd $n$ and two for even $n$. So the number of classes depends on the parity of $n$.\n\nIn $D_{7}$ the rotation classes are $\\{e\\}$, $\\{r, r^{6}\\}$, $\\{r^{2}, r^{5}\\}$ and $\\{r^{3}, r^{4}\\}$, and the $7$ reflections form one class, so there are $4 + 1 = 5$ classes.\n\nCheck: the class sizes $1 + 2 + 2 + 2 + 7 = 14$ add up to the order of $D_{7}$.\n\n> **Watch out.** For even $n$ the half turn $r^{n/2}$ is its own inverse and forms a class of its own, and the reflections split into two classes.",
      "类方程按共轭关系对群进行分类。在 $D_{n}$ 中，每个旋转都与它的逆共轭，反射当 $n$ 为奇数时构成一个类，当 $n$ 为偶数时构成两个类。所以类的个数取决于 $n$ 的奇偶性。\n\n在 $D_{7}$ 中，旋转的共轭类为 $\\{e\\}$、$\\{r, r^{6}\\}$、$\\{r^{2}, r^{5}\\}$、$\\{r^{3}, r^{4}\\}$，$7$ 个反射构成一个类，所以共有 $4 + 1 = 5$ 个类。\n\n检验：各类大小之和 $1 + 2 + 2 + 2 + 7 = 14$，正是 $D_{7}$ 的阶。\n\n> **注意。** $n$ 为偶数时，半周旋转 $r^{n/2}$ 是它自身的逆，单独构成一个类，而反射分成两个类。",
    ],
    (rng) => {
      const n = rng.int(3, 40);
      const even = n % 2 === 0;
      const rotationClasses = even ? n / 2 + 1 : (n + 1) / 2;
      const reflectionClasses = even ? 2 : 1;
      const answer = rotationClasses + reflectionClasses;
      const pairs = even ? n / 2 - 1 : (n - 1) / 2;
      const pairSizes = pairs === 1 ? "2" : `${pairs} \\cdot 2`;
      return numberProblem({
        prompt: t(
          `How many conjugacy classes does the dihedral group $D_{${n}}$ of order $${2 * n}$ have?`,
          `阶为 $${2 * n}$ 的二面体群 $D_{${n}}$ 有多少个共轭类？`,
        ),
        answer,
        mistakes: distinctRingMistakes(answer, [
          why(
            n,
            "That counts the rotations, one class each, and leaves out the reflections.",
            "这是把每个旋转算作一个类，并且漏掉了反射。",
          ),
          why(2 * n, "That is the order of the group; conjugate elements share a class.", "这是群的阶；互相共轭的元素属于同一个类。"),
          why(
            rotationClasses + (even ? 1 : 2),
            even
              ? `For even $${n}$ the reflections form two classes, by the parity of the exponent, not one.`
              : `For odd $${n}$ all the reflections are conjugate and form one class, not two.`,
            even
              ? `$${n}$ 为偶数时，反射按指数的奇偶构成两个类，而不是一个。`
              : `$${n}$ 为奇数时，全部反射互相共轭，构成一个类，而不是两个。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Count the rotation classes", "数旋转的共轭类"],
              even
                ? t(
                    `$\\{e\\}$, $\\{r^{${n / 2}}\\}$ and the $${pairs}$ ${pairs === 1 ? "pair" : "pairs"} $\\{r^{k}, r^{-k}\\}$: $${rotationClasses}$ classes.`,
                    `$\\{e\\}$、$\\{r^{${n / 2}}\\}$ 与 $${pairs}$ 对 $\\{r^{k}, r^{-k}\\}$：共 $${rotationClasses}$ 个类。`,
                  )
                : t(
                    `$\\{e\\}$ and the $${pairs}$ ${pairs === 1 ? "pair" : "pairs"} $\\{r^{k}, r^{-k}\\}$: $${rotationClasses}$ classes.`,
                    `$\\{e\\}$ 与 $${pairs}$ 对 $\\{r^{k}, r^{-k}\\}$：共 $${rotationClasses}$ 个类。`,
                  ),
            ],
            [
              ["Count the reflection classes", "数反射的共轭类"],
              t(
                `$${n}$ is ${even ? "even" : "odd"}, so the reflections form $${reflectionClasses}$ ${reflectionClasses === 1 ? "class" : "classes"}: $${rotationClasses} + ${reflectionClasses} = ${answer}$.`,
                `$${n}$ 是${even ? "偶数" : "奇数"}，所以反射构成 $${reflectionClasses}$ 个类：$${rotationClasses} + ${reflectionClasses} = ${answer}$。`,
              ),
            ],
          ],
          even
            ? t(
                `The class sizes $1 + 1 + ${pairSizes} + 2 \\cdot ${n / 2}$ add up to $${2 * n}$, the order of the group.`,
                `各类大小之和 $1 + 1 + ${pairSizes} + 2 \\cdot ${n / 2}$ 等于 $${2 * n}$，正是群的阶。`,
              )
            : t(
                `The class sizes $1 + ${pairSizes} + ${n}$ add up to $${2 * n}$, the order of the group.`,
                `各类大小之和 $1 + ${pairSizes} + ${n}$ 等于 $${2 * n}$，正是群的阶。`,
              ),
        ),
      });
    },
  ),
  figure: algebraDrawings2["the-class-equation-of-a-group-action#the-conjugacy-classes-of-a-dihedral-group"],
};

const cycleConjugates = point(
  "the-number-of-conjugates-of-a-cycle",
  ["The number of conjugates of a cycle", "循环的共轭元个数"],
  [
    "Two permutations are conjugate exactly when they have the same cycle type, so the conjugates of a cycle are all the cycles of that length. Choosing and ordering the letters overcounts each cycle once for each of its cyclic rotations, so the count is $\\frac{n!}{k \\cdot (n - k)!}$.\n\nIn $S_{5}$ the conjugates of $(1\\;2\\;3)$ are the $3$-cycles: $\\frac{5!}{3 \\cdot 2!} = \\frac{120}{6} = 20$ of them.\n\nCheck: the $3$ letters can be chosen in $\\binom{5}{3} = 10$ ways, and each choice gives $2$ different $3$-cycles, so $10 \\cdot 2 = 20$.\n\n> **Watch out.** Divide by $k$: $(1\\;2\\;3)$, $(2\\;3\\;1)$ and $(3\\;1\\;2)$ are the same cycle, written from different starting letters.",
    "两个置换共轭当且仅当它们的循环类型相同，所以一个循环的共轭元就是所有同长度的循环。选择并排列字母时，每个循环按其旋转方式被重复计数，所以个数是 $\\frac{n!}{k \\cdot (n - k)!}$。\n\n在 $S_{5}$ 中，$(1\\;2\\;3)$ 的共轭元就是各个 $3$-循环：共 $\\frac{5!}{3 \\cdot 2!} = \\frac{120}{6} = 20$ 个。\n\n检验：$3$ 个字母有 $\\binom{5}{3} = 10$ 种选法，每种选法给出 $2$ 个不同的 $3$-循环，所以 $10 \\cdot 2 = 20$。\n\n> **注意。** 要除以 $k$：$(1\\;2\\;3)$、$(2\\;3\\;1)$、$(3\\;1\\;2)$ 是同一个循环，只是从不同的字母开始写。",
  ],
  (rng) => {
    const n = rng.int(4, 10);
    const k = rng.int(2, n);
    const answer = factorial(n) / (k * factorial(n - k));
    const cycle = [...Array(k).keys()].map((i) => i + 1).join("\\;");
    const ordered = factorial(n) / factorial(n - k);
    return numberProblem({
      prompt: t(`How many conjugates does $(${cycle})$ have in $S_{${n}}$?`, `$(${cycle})$ 在 $S_{${n}}$ 中有多少个共轭元？`),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          binomial(n, k),
          `That chooses the ${k} letters but not the order around the cycle.`,
          `这选出了 ${k} 个字母，但没有考虑它们在循环中的顺序。`,
        ),
        why(
          ordered,
          `That orders the letters, but each cycle can be written from any of its $${k}$ letters.`,
          `这对字母排了序，但每个循环可以从它的 $${k}$ 个字母中任何一个开始写。`,
        ),
        why(
          factorial(n) / k,
          `That divides $${n}!$ by $${k}$, but the letters outside the cycle are not arranged at all.`,
          `这是用 $${n}!$ 除以 $${k}$，但循环以外的字母根本不需要排列。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Order the letters", "排列字母"],
            t(
              `The conjugates are the cycles of length $${k}$. Writing one down takes an ordered choice of $${k}$ letters: $\\frac{${n}!}{${n - k}!} = ${ordered}$ ways.`,
              `共轭元就是长度为 $${k}$ 的循环。写出一个这样的循环需要有序地选出 $${k}$ 个字母：共 $\\frac{${n}!}{${n - k}!} = ${ordered}$ 种。`,
            ),
          ],
          [
            ["Divide by the starting letters", "除以起始字母的选法"],
            t(
              `Each cycle arises $${k}$ times, once for each starting letter: $\\frac{${ordered}}{${k}} = ${answer}$.`,
              `每个循环出现 $${k}$ 次，每个起始字母一次：$\\frac{${ordered}}{${k}} = ${answer}$。`,
            ),
          ],
        ],
        k === 2
          ? t(
              `Each pair of letters gives one transposition, and $\\binom{${n}}{2} = ${answer}$.`,
              `每对字母给出一个对换，且 $\\binom{${n}}{2} = ${answer}$。`,
            )
          : k === n
            ? t(
                `The cycle uses all $${n}$ letters; starting it at $1$, the other letters can follow in $${n - 1}! = ${answer}$ orders.`,
                `这个循环用到全部 $${n}$ 个字母；从 $1$ 开始写，其余字母有 $${n - 1}! = ${answer}$ 种排列顺序。`,
              )
            : t(
                `Choose the letters in $\\binom{${n}}{${k}} = ${binomial(n, k)}$ ways; each choice gives $${k - 1}! = ${factorial(k - 1)}$ cycles, and $${binomial(n, k)} \\cdot ${factorial(k - 1)} = ${answer}$.`,
                `字母有 $\\binom{${n}}{${k}} = ${binomial(n, k)}$ 种选法；每种选法给出 $${k - 1}! = ${factorial(k - 1)}$ 个循环，且 $${binomial(n, k)} \\cdot ${factorial(k - 1)} = ${answer}$。`,
              ),
      ),
    });
  },
);

const rotationsWithCycles = {
  ...point(
    "how-many-rotations-have-a-given-cycle-type",
    ["How many rotations have a given cycle type", "具有给定循环类型的旋转个数"],
    [
      "The rotation $r^{j}$ of a regular $n$-gon splits the vertices into $\\gcd(j, n)$ cycles. So the number of rotations with exactly $d$ cycles is the number of $j$ with $\\gcd(j, n) = d$, and this count equals $\\varphi\\left(\\frac{n}{d}\\right)$.\n\nIn a regular hexagon, the rotations with exactly $2$ cycles are those with $\\gcd(j, 6) = 2$, namely $r^{2}$ and $r^{4}$: $\\varphi(3) = 2$ rotations.\n\nCheck: $r^{2}$ has the cycles $(0\\;2\\;4)$ and $(1\\;3\\;5)$, and $r^{4}$ the same two sets of vertices.\n\n> **Watch out.** Apply $\\varphi$ to $\\frac{n}{d}$, the length of each cycle, not to $d$: above, $\\varphi(2) = 1$ would miss one of the two rotations.",
      "正 $n$ 边形的旋转 $r^{j}$ 把顶点分成 $\\gcd(j, n)$ 个循环。所以恰好有 $d$ 个循环的旋转个数，就是满足 $\\gcd(j, n) = d$ 的 $j$ 的个数，它等于 $\\varphi\\left(\\frac{n}{d}\\right)$。\n\n在正六边形中，恰有 $2$ 个循环的旋转是满足 $\\gcd(j, 6) = 2$ 的那些，即 $r^{2}$ 与 $r^{4}$：共 $\\varphi(3) = 2$ 个旋转。\n\n检验：$r^{2}$ 的循环是 $(0\\;2\\;4)$ 与 $(1\\;3\\;5)$，$r^{4}$ 的循环也是这两组顶点。\n\n> **注意。** $\\varphi$ 要作用于每个循环的长度 $\\frac{n}{d}$，而不是 $d$：上例中 $\\varphi(2) = 1$ 会漏掉两个旋转中的一个。",
    ],
    (rng) => {
      let n = rng.int(6, 60);
      while (divisors(n).length < 4) n++;
      const d = rng.pick(divisors(n).filter((x) => x < n));
      const quotient = n / d;
      const answer = totient(quotient);
      const jt = d === 1 ? "t" : `${d}t`;
      return numberProblem({
        prompt: t(
          `How many of the $${n}$ rotations of a regular ${n}-gon split the vertices into exactly $${d}$ ${d === 1 ? "cycle" : "cycles"}?`,
          `正 ${n} 边形的 $${n}$ 个旋转中，有多少个恰好把顶点分成 $${d}$ 个循环？`,
        ),
        answer,
        mistakes: distinctRingMistakes(answer, [
          why(
            d,
            "That is the number of cycles, not the number of rotations that have them.",
            "这是循环的个数，而不是具有这些循环的旋转个数。",
          ),
          why(
            quotient,
            `That is the length of each cycle; only the $j = ${jt}$ with $\\gcd(t, ${quotient}) = 1$ count.`,
            `这是每个循环的长度；只有满足 $\\gcd(t, ${quotient}) = 1$ 的 $j = ${jt}$ 才算数。`,
          ),
          why(
            totient(n),
            `That counts the rotations with $\\gcd(j, ${n}) = 1$, which have a single cycle.`,
            `这数的是满足 $\\gcd(j, ${n}) = 1$ 的旋转，它们只有一个循环。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Set up the condition", "写出条件"],
              t(
                `$r^{j}$ has $\\gcd(j, ${n})$ cycles, so we count $j$ from $1$ to $${n}$ with $\\gcd(j, ${n}) = ${d}$.`,
                `$r^{j}$ 有 $\\gcd(j, ${n})$ 个循环，所以要数 $1$ 到 $${n}$ 中满足 $\\gcd(j, ${n}) = ${d}$ 的 $j$。`,
              ),
            ],
            [
              ["Count the exponents", "数指数"],
              t(
                `Writing $j = ${jt}$ with $1 \\le t \\le ${quotient}$, we need $\\gcd(t, ${quotient}) = 1$, which gives $\\varphi(${quotient}) = ${answer}$ rotations.`,
                `写成 $j = ${jt}$，$1 \\le t \\le ${quotient}$，需要 $\\gcd(t, ${quotient}) = 1$，所以有 $\\varphi(${quotient}) = ${answer}$ 个旋转。`,
              ),
            ],
          ],
          t(
            `Each of these rotations has order $${quotient}$, so its cycles have length $${quotient}$, and $\\frac{${n}}{${quotient}} = ${d}$ cycles.`,
            `每个这样的旋转阶为 $${quotient}$，所以它的循环长度为 $${quotient}$，共 $\\frac{${n}}{${quotient}} = ${d}$ 个循环。`,
          ),
        ),
      });
    },
  ),
  figure: algebraDrawings2["cycle-types-of-permutations-of-some-groups#how-many-rotations-have-a-given-cycle-type"],
};

const wordOrbits = point(
  "the-number-of-orbits-on-words",
  ["The number of orbits on words", "单词上的轨道数"],
  [
    "When $S_{n}$ permutes the positions of a word, the orbit of a word is determined by how many times each letter appears. So the number of orbits equals the number of ways to write $n$ as an ordered sum of $k$ nonnegative counts, which is $\\binom{n + k - 1}{k - 1}$.\n\nFor words of length $3$ on the two letters $\\text{A}$ and $\\text{B}$, an orbit is fixed by how many $\\text{A}$'s the word has, $0$, $1$, $2$ or $3$, so there are $\\binom{4}{1} = 4$ orbits.\n\nCheck: the orbits are those of $\\text{BBB}$, $\\text{ABB}$, $\\text{AAB}$ and $\\text{AAA}$.\n\n> **Watch out.** The lower index is $k - 1$, the number of bars between the $k$ letters, not $k$: above, $\\binom{4}{2} = 6$ would be too many.",
    "当 $S_{n}$ 置换单词的位置时，单词的轨道由每个字母出现的次数决定。所以轨道数等于把 $n$ 写成 $k$ 个非负计数的有序和的方法数，即 $\\binom{n + k - 1}{k - 1}$。\n\n对由两个字母 $\\text{A}$、$\\text{B}$ 组成的长度为 $3$ 的单词，轨道由单词中 $\\text{A}$ 的个数 $0$、$1$、$2$ 或 $3$ 确定，所以有 $\\binom{4}{1} = 4$ 个轨道。\n\n检验：这些轨道就是 $\\text{BBB}$、$\\text{ABB}$、$\\text{AAB}$、$\\text{AAA}$ 的轨道。\n\n> **注意。** 下标是 $k - 1$，即隔开 $k$ 个字母所需的隔板数，而不是 $k$：上例中 $\\binom{4}{2} = 6$ 就太多了。",
  ],
  (rng) => {
    const n = rng.int(3, 10);
    const k = rng.int(2, 5);
    const answer = binomial(n + k - 1, k - 1);
    const bars = k === 2 ? "$1$ bar" : `$${k - 1}$ bars`;
    return numberProblem({
      prompt: t(
        `$S_{${n}}$ acts by permuting the positions of words of length $${n}$ on an alphabet of $${k}$ letters. How many orbits are there?`,
        `$S_{${n}}$ 通过置换位置，作用在由 $${k}$ 个字母组成的长度为 $${n}$ 的单词上。有多少个轨道？`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          k ** n,
          "That counts the words, but rearranging the letters of a word stays in its orbit.",
          "这数的是单词，但重排一个单词的字母仍在同一轨道中。",
        ),
        why(
          binomial(n + k - 1, k),
          `That takes $${k}$ as the lower index; ${k} letters need only ${bars} between them.`,
          `这把 $${k}$ 当作下标；${k} 个字母之间只需要 $${k - 1}$ 块隔板。`,
        ),
        why(
          n + k,
          "That adds the length and the number of letters, which counts nothing here.",
          "这是把长度与字母个数相加，在这里没有意义。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Reduce to counts", "化为计数"],
            t(
              `Permuting positions can rearrange a word in any way, so an orbit is fixed by the counts of the $${k}$ letters, which add up to $${n}$.`,
              `置换位置可以任意重排单词，所以轨道由 $${k}$ 个字母的计数确定，这些计数之和为 $${n}$。`,
            ),
          ],
          [
            ["Place stars and bars", "放置星号与隔板"],
            t(
              `Such counts correspond to $${n}$ stars and ${bars} in a row of $${n + k - 1}$ places: $\\binom{${n + k - 1}}{${k - 1}} = ${answer}$.`,
              `这样的计数对应于在 $${n + k - 1}$ 个位置上排 $${n}$ 个星号与 $${k - 1}$ 块隔板：$\\binom{${n + k - 1}}{${k - 1}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Choosing the places of the stars instead gives $\\binom{${n + k - 1}}{${n}} = ${answer}$ as well.`,
          `改为选择星号的位置，同样得到 $\\binom{${n + k - 1}}{${n}} = ${answer}$。`,
        ),
      ),
    });
  },
);

const rotationFixedColorings = {
  ...point(
    "the-colorings-a-rotation-fixes",
    ["The colorings a rotation fixes", "旋转固定的着色"],
    [
      "A necklace coloring is fixed by a rotation exactly when each cycle of the rotation has a single color. A rotation by $j$ places has $\\gcd(j, n)$ cycles, so it fixes $k^{\\gcd(j, n)}$ colorings, and these are the numbers that enter Burnside's lemma.\n\nWith $6$ beads and $2$ colors, the rotation through $2$ places has the $\\gcd(2, 6) = 2$ cycles of beads $\\{1, 3, 5\\}$ and $\\{2, 4, 6\\}$, so it fixes $2^{2} = 4$ colorings.\n\nCheck: they are the two one-color necklaces and the two that alternate the colors.\n\n> **Watch out.** The exponent is the number of cycles, $\\gcd(j, n)$, not their length $\\frac{n}{\\gcd(j, n)}$: above, $2^{3} = 8$ would be too many.",
      "一种项链着色被旋转固定，当且仅当旋转的每个循环都只有一种颜色。旋转 $j$ 个位置有 $\\gcd(j, n)$ 个循环，所以固定 $k^{\\gcd(j, n)}$ 种着色，这些数就是代入伯恩赛德引理的数。\n\n$6$ 颗珠子、$2$ 种颜色时，旋转 $2$ 个位置有 $\\gcd(2, 6) = 2$ 个珠子循环 $\\{1, 3, 5\\}$ 与 $\\{2, 4, 6\\}$，所以固定 $2^{2} = 4$ 种着色。\n\n检验：它们是两种单色项链和两种颜色交替的项链。\n\n> **注意。** 指数是循环的个数 $\\gcd(j, n)$，而不是循环的长度 $\\frac{n}{\\gcd(j, n)}$：上例中 $2^{3} = 8$ 就太多了。",
    ],
    (rng) => {
      const n = rng.int(4, 12);
      const j = rng.int(1, n - 1);
      const k = rng.int(2, 4);
      const g = gcd(j, n);
      const answer = k ** g;
      const power = g === 1 ? `${k}` : `${k}^{${g}}`;
      return numberProblem({
        prompt: t(
          `A necklace has $${n}$ beads, each with one of $${k}$ colors. How many colorings are unchanged by the rotation through $${j}$ ${j === 1 ? "place" : "places"}?`,
          `项链有 $${n}$ 颗珠子，每颗取 $${k}$ 种颜色之一。旋转 $${j}$ 个位置后，有多少种着色保持不变？`,
        ),
        answer,
        mistakes: distinctRingMistakes(answer, [
          why(
            k ** (n / g),
            `That raises $${k}$ to the length of each cycle, $${n / g}$, instead of the number of cycles, $${g}$.`,
            `这是以每个循环的长度 $${n / g}$ 为指数，而应以循环的个数 $${g}$ 为指数。`,
          ),
          why(k ** n, "That counts all colorings; most of them change under the rotation.", "这数的是全部着色；其中大多数在旋转下会改变。"),
          why(
            k * g,
            `That multiplies $${k}$ by the number of cycles instead of raising it to that power.`,
            `这是用 $${k}$ 乘以循环的个数，而不是求它的这个次幂。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Find the cycles", "求循环"],
              t(
                `The rotation has $\\gcd(${j}, ${n}) = ${g}$ ${g === 1 ? "cycle" : "cycles"} of beads, each of length $${n / g}$.`,
                `这个旋转把珠子分成 $\\gcd(${j}, ${n}) = ${g}$ 个循环，每个长度为 $${n / g}$。`,
              ),
            ],
            [
              ["Color each cycle", "给每个循环着色"],
              t(
                `A fixed coloring gives each cycle a single color, so the count is $${power} = ${answer}$.`,
                `被固定的着色在每个循环上只用一种颜色，所以个数是 $${power} = ${answer}$。`,
              ),
            ],
          ],
          g === 1
            ? t(
                `Every bead lies in the single cycle, so only the $${k}$ one-color colorings are fixed.`,
                `每颗珠子都在唯一的循环中，所以只有 $${k}$ 种单色着色被固定。`,
              )
            : t(
                `Beads $1$ to $${g}$ lie in different cycles, and choosing their colors fixes all the others: $${power} = ${answer}$ choices.`,
                `第 $1$ 到第 $${g}$ 颗珠子位于不同的循环中，选定它们的颜色就确定了其余所有珠子：共 $${power} = ${answer}$ 种选法。`,
              ),
        ),
      });
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
    "Synthetic division works over any field. Over $\\mathbb{Z}_{p}$, each step multiplies by the root and adds the next coefficient, reducing modulo $p$. The last number is the remainder, and the numbers before it are the coefficients of the quotient.\n\nOver $\\mathbb{Z}_{5}$, divide $x^{3} + 2x + 1$ by $x - 3$: the coefficients $1, 0, 2, 1$ give $1$, then $(3)(1) + 0 = 3$, then $(3)(3) + 2 = 11 \\equiv 1$, then $(3)(1) + 1 = 4$. So the quotient is $x^{2} + 3x + 1$ and the remainder is $4$.\n\nCheck: $f(3) = 27 + 6 + 1 = 34 \\equiv 4 \\pmod{5}$, the remainder.\n\n> **Watch out.** The last number is the remainder, not part of the quotient: above, $4$ is the remainder and the constant term of the quotient is $1$.",
    "综合除法对任何域都适用。在 $\\mathbb{Z}_{p}$ 上，每一步乘以根再加上下一个系数，并模 $p$ 化简。最后一个数是余数，它前面的数是商的系数。\n\n在 $\\mathbb{Z}_{5}$ 上，用 $x - 3$ 除 $x^{3} + 2x + 1$：系数 $1, 0, 2, 1$ 依次给出 $1$，$(3)(1) + 0 = 3$，$(3)(3) + 2 = 11 \\equiv 1$，$(3)(1) + 1 = 4$。所以商是 $x^{2} + 3x + 1$，余数是 $4$。\n\n检验：$f(3) = 27 + 6 + 1 = 34 \\equiv 4 \\pmod{5}$，正是余数。\n\n> **注意。** 最后一个数是余数，不属于商：上例中 $4$ 是余数，商的常数项是 $1$。",
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
    return numberProblem({
      prompt: t(
        `In $\\mathbb{Z}_{${p}}[x]$, divide $${f}$ by $x - ${a}$. What is the constant term of the quotient, as a value from $0$ to $${p - 1}$?`,
        `在 $\\mathbb{Z}_{${p}}[x]$ 中，用 $x - ${a}$ 除 $${f}$。商的常数项是多少，取值范围为 $0$ 到 $${p - 1}$？`,
      ),
      answer: q1,
      mistakes: distinctRingMistakes(q1, [
        why(
          r,
          "That is the remainder, the last number of the synthetic division; the constant term of the quotient comes just before it.",
          "这是余数，即综合除法的最后一个数；商的常数项在它前面。",
        ),
        why(q2, "That is the coefficient of $x$ in the quotient.", "这是商中 $x$ 的系数。"),
        why(
          (a * q2) % p,
          `That multiplies by the root but forgets to add the next coefficient $${c}$.`,
          `这乘了根，却忘了加上下一个系数 $${c}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Run the synthetic division", "做综合除法"],
            t(
              `With the root $${a}$: bring down $1$, then $(${a})(1) + ${b} = ${a + b} \\equiv ${q2}$, then $(${a})(${q2}) + ${c} = ${a * q2 + c} \\equiv ${q1}$, then $(${a})(${q1}) + ${d} = ${a * q1 + d} \\equiv ${r}$.`,
              `用根 $${a}$：先写下 $1$，再算 $(${a})(1) + ${b} = ${a + b} \\equiv ${q2}$，$(${a})(${q2}) + ${c} = ${a * q2 + c} \\equiv ${q1}$，$(${a})(${q1}) + ${d} = ${a * q1 + d} \\equiv ${r}$。`,
            ),
          ],
          [
            ["Read off the quotient", "读出商"],
            t(
              `The last number $${r}$ is the remainder, so the quotient is $${q0text}$, whose constant term is $${q1}$.`,
              `最后一个数 $${r}$ 是余数，所以商是 $${q0text}$，常数项是 $${q1}$。`,
            ),
          ],
        ],
        t(
          `The constant term of $(x - ${a})(${q0text}) + ${r}$ is $-(${a})(${q1}) + ${r} = ${r - a * q1} \\equiv ${d} \\pmod{${p}}$, the constant term of $${f}$.`,
          `$(x - ${a})(${q0text}) + ${r}$ 的常数项为 $-(${a})(${q1}) + ${r} = ${r - a * q1} \\equiv ${d} \\pmod{${p}}$，正是 $${f}$ 的常数项。`,
        ),
      ),
    });
  },
);

const commonRoot = point(
  "a-common-root-from-the-gcd",
  ["A common root from the gcd", "由最大公因式求公共根"],
  [
    "A common root of two polynomials is a root of their greatest common divisor, so the Euclidean algorithm finds common roots without factoring either polynomial. For two monic quadratics, one subtraction already gives a linear polynomial whose root can be read off.\n\nOver $\\mathbb{Z}_{7}$, $(x^{2} + 4x + 3) - (x^{2} + 5x + 4) = -x - 1 \\equiv 6x + 6$, whose root is $-1 = 6$.\n\nCheck: $36 + 24 + 3 = 63$ and $36 + 30 + 4 = 70$ are both multiples of $7$.\n\n> **Watch out.** Every common root is a root of the difference, but not the other way round: substitute the candidate into both polynomials, because two polynomials with no common root still have a difference with a root.",
    "两个多项式的公共根是它们的最大公因式的根，所以欧几里得算法不必分解任一多项式就能求出公共根。对两个首一二次多项式，一次相减就得到一个一次多项式，它的根可以直接读出。\n\n在 $\\mathbb{Z}_{7}$ 上，$(x^{2} + 4x + 3) - (x^{2} + 5x + 4) = -x - 1 \\equiv 6x + 6$，它的根是 $-1 = 6$。\n\n检验：$36 + 24 + 3 = 63$ 与 $36 + 30 + 4 = 70$ 都是 $7$ 的倍数。\n\n> **注意。** 每个公共根都是差的根，反过来却不一定：要把候选根代入两个多项式检验，因为没有公共根的两个多项式，它们的差照样有根。",
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
    const at = (s: number, t1: number, t0: number) => `${s}^{2} + (${t1})(${s}) + ${t0} = ${s * s + t1 * s + t0}`;
    return numberProblem({
      prompt: t(
        `The polynomials $${f}$ and $${g}$ in $\\mathbb{Z}_{${p}}[x]$ have exactly one common root. Find it, as a value from $0$ to $${p - 1}$.`,
        `$\\mathbb{Z}_{${p}}[x]$ 中的多项式 $${f}$ 和 $${g}$ 恰好有一个公共根。求它，取值范围为 $0$ 到 $${p - 1}$。`,
      ),
      answer: a,
      mistakes: distinctRingMistakes(a, [
        why(b, `$${b}$ is a root of $${f}$ only, not of $${g}$.`, `$${b}$ 只是 $${f}$ 的根，不是 $${g}$ 的根。`),
        why(c, `$${c}$ is a root of $${g}$ only, not of $${f}$.`, `$${c}$ 只是 $${g}$ 的根，不是 $${f}$ 的根。`),
        why((a + 1) % p, `That is off by one: the root of $${diff}$ is $${a}$.`, `差了 $1$：$${diff}$ 的根是 $${a}$。`),
      ]),
      solution: walked(
        [
          [
            ["Subtract", "相减"],
            t(
              `The squares cancel, and the difference is $${diff}$; any common root is a root of it.`,
              `平方项抵消，差是 $${diff}$；任何公共根都是它的根。`,
            ),
          ],
          [
            ["Solve the linear equation", "解一次方程"],
            t(`$${diff} \\equiv 0$ gives $x = ${a}$ modulo $${p}$.`, `由 $${diff} \\equiv 0$ 得 $x = ${a}$（模 $${p}$）。`),
          ],
        ],
        t(
          `$${at(a, f1, f0)}$ and $${at(a, g1, g0)}$ are both multiples of $${p}$.`,
          `$${at(a, f1, f0)}$ 与 $${at(a, g1, g0)}$ 都是 $${p}$ 的倍数。`,
        ),
      ),
    });
  },
);

const inverseModLinear = point(
  "the-inverse-modulo-a-linear-polynomial",
  ["The inverse modulo a linear polynomial", "模一次多项式的逆"],
  [
    "Modulo $x - a$, every polynomial is congruent to its value at $a$, so the quotient ring is just $\\mathbb{Z}_{p}$. The extended Euclidean algorithm stops after one step: the inverse of a polynomial is a constant, namely the inverse of its value at $a$.\n\nIn $\\mathbb{Z}_{7}[x]/\\langle x - 2 \\rangle$, $x^{2} + 1 \\equiv 2^{2} + 1 = 5$, and $5^{-1} = 3$, so the inverse of $x^{2} + 1$ is $3$.\n\nCheck: $(5)(3) = 15 = 2 \\cdot 7 + 1$.\n\n> **Watch out.** Invert the value, do not stop at it: $5$ is what $x^{2} + 1$ equals in the quotient ring, and its inverse $3$ is the answer.",
    "模 $x - a$ 时，每个多项式都同余于它在 $a$ 处的值，所以商环就是 $\\mathbb{Z}_{p}$。扩展欧几里得算法一步就结束：多项式的逆是一个常数，即它在 $a$ 处的值的逆。\n\n在 $\\mathbb{Z}_{7}[x]/\\langle x - 2 \\rangle$ 中，$x^{2} + 1 \\equiv 2^{2} + 1 = 5$，而 $5^{-1} = 3$，所以 $x^{2} + 1$ 的逆是 $3$。\n\n检验：$(5)(3) = 15 = 2 \\cdot 7 + 1$。\n\n> **注意。** 要对这个值求逆，不能停在值本身：$5$ 是 $x^{2} + 1$ 在商环中等于的数，它的逆 $3$ 才是答案。",
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
    return numberProblem({
      prompt: t(
        `In $\\mathbb{Z}_{${p}}[x]/\\langle x - ${a} \\rangle$, the inverse of $${f}$ is a constant. Find it, as a value from $1$ to $${p - 1}$.`,
        `在 $\\mathbb{Z}_{${p}}[x]/\\langle x - ${a} \\rangle$ 中，$${f}$ 的逆是一个常数。求它，取值范围为 $1$ 到 $${p - 1}$。`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          value,
          `$${value}$ is the value at $${a}$, what the polynomial equals in the quotient ring; the answer is its inverse.`,
          `$${value}$ 是在 $${a}$ 处的值，即该多项式在商环中等于的数；答案是它的逆。`,
        ),
        why(
          a,
          `That is the root $${a}$; the polynomial reduces to its value there, not to $${a}$.`,
          `这是根 $${a}$；多项式约化为它在该处的值，而不是 $${a}$。`,
        ),
        why(
          p - answer,
          `That is the negative of the inverse: $(${value})(${p - answer}) \\equiv -1$, not $1$.`,
          `这是逆的相反数：$(${value})(${p - answer}) \\equiv -1$，不是 $1$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Reduce modulo the linear polynomial", "模一次多项式约化"],
            t(
              `Modulo $x - ${a}$ the polynomial equals its value at $${a}$: $${a}^{2} + (${b})(${a}) + ${c} = ${a * a + b * a + c} \\equiv ${value}$.`,
              `模 $x - ${a}$ 时，这个多项式等于它在 $${a}$ 处的值：$${a}^{2} + (${b})(${a}) + ${c} = ${a * a + b * a + c} \\equiv ${value}$。`,
            ),
          ],
          [
            ["Invert the value", "对这个值求逆"],
            t(
              `$(${value})(${answer}) = ${value * answer} \\equiv 1 \\pmod{${p}}$, so the inverse is $${answer}$.`,
              `$(${value})(${answer}) = ${value * answer} \\equiv 1 \\pmod{${p}}$，所以逆是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$(${f})(${answer}) - 1$ takes the value $${value * answer} - 1 = ${value * answer - 1}$ at $${a}$, a multiple of $${p}$, so $x - ${a}$ divides it.`,
          `$(${f})(${answer}) - 1$ 在 $${a}$ 处的值为 $${value * answer} - 1 = ${value * answer - 1}$，是 $${p}$ 的倍数，所以 $x - ${a}$ 整除它。`,
        ),
      ),
    });
  },
);

const realFactorCount = point(
  "the-real-factors-of-x-to-the-n-minus-one",
  ["The real factors of a power minus one", "幂减一的实因式"],
  [
    "Over the reals, $x^{n} - 1$ has the linear factor $x - 1$, and also $x + 1$ when $n$ is even. The other complex roots occur in conjugate pairs, and each pair gives one irreducible quadratic, so the count depends on the parity of $n$.\n\n$x^{5} - 1$ has the real root $1$ and two conjugate pairs of nonreal roots, so over $\\mathbb{R}$ it is $x - 1$ times two irreducible quadratics: $3$ factors.\n\nCheck: the degrees add up, $1 + 2 + 2 = 5$.\n\n> **Watch out.** For odd $n$, $-1$ is not a root: $(-1)^{5} - 1 = -2$, so $x + 1$ is not a factor of $x^{5} - 1$.",
    "在实数上，$x^{n} - 1$ 有一次因式 $x - 1$，当 $n$ 为偶数时还有 $x + 1$。其余的复根成共轭对出现，每对给出一个不可约的二次因式，所以个数取决于 $n$ 的奇偶性。\n\n$x^{5} - 1$ 有实根 $1$ 和两对共轭的非实根，所以在 $\\mathbb{R}$ 上它是 $x - 1$ 乘以两个不可约二次因式：共 $3$ 个因式。\n\n检验：次数相加 $1 + 2 + 2 = 5$。\n\n> **注意。** $n$ 为奇数时 $-1$ 不是根：$(-1)^{5} - 1 = -2$，所以 $x + 1$ 不是 $x^{5} - 1$ 的因式。",
  ],
  (rng) => {
    const n = rng.int(5, 40);
    const even = n % 2 === 0;
    const linear = even ? 2 : 1;
    const quadratic = (n - linear) / 2;
    const answer = linear + quadratic;
    return numberProblem({
      prompt: t(
        `Into how many monic irreducible factors does $x^{${n}} - 1$ split over $\\mathbb{R}$?`,
        `$x^{${n}} - 1$ 在 $\\mathbb{R}$ 上分解为多少个首一不可约因式？`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          n,
          "That counts the roots; over $\\mathbb{R}$ each conjugate pair of roots gives one quadratic factor.",
          "这数的是根；在 $\\mathbb{R}$ 上每对共轭根只给出一个二次因式。",
        ),
        even
          ? why(quadratic, "That leaves out the linear factors $x - 1$ and $x + 1$.", "这漏掉了一次因式 $x - 1$ 与 $x + 1$。")
          : why(quadratic, "That leaves out the linear factor $x - 1$.", "这漏掉了一次因式 $x - 1$。"),
        why(
          answer + 1,
          even
            ? "That counts one factor too many; only $1$ and $-1$ are real roots."
            : "That counts one factor too many; for odd $n$, $-1$ is not a root, so $x + 1$ is not a factor.",
          even ? "这多数了一个因式；只有 $1$ 和 $-1$ 是实根。" : "这多数了一个因式；$n$ 为奇数时 $-1$ 不是根，所以 $x + 1$ 不是因式。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the real roots", "找实根"],
            even
              ? t(
                  `Since ${n} is even, $1$ and $-1$ are the real roots, giving $x - 1$ and $x + 1$.`,
                  `由于 ${n} 是偶数，实根是 $1$ 与 $-1$，给出 $x - 1$ 与 $x + 1$。`,
                )
              : t(`Since ${n} is odd, $1$ is the only real root, giving $x - 1$.`, `由于 ${n} 是奇数，唯一的实根是 $1$，给出 $x - 1$。`),
          ],
          [
            ["Pair the other roots", "把其余的根配对"],
            t(
              `The other $${n - linear}$ roots form $${quadratic}$ conjugate pairs, each giving an irreducible quadratic, so the total is $${linear} + ${quadratic} = ${answer}$.`,
              `其余 $${n - linear}$ 个根构成 $${quadratic}$ 对共轭复根，每对给出一个不可约二次因式，所以总数是 $${linear} + ${quadratic} = ${answer}$。`,
            ),
          ],
        ],
        t(`The degrees add up: $${linear} + 2(${quadratic}) = ${n}$.`, `次数相加：$${linear} + 2(${quadratic}) = ${n}$。`),
      ),
    });
  },
);

const cubicByRoots = point(
  "deciding-a-cubic-by-its-roots",
  ["Deciding a cubic by its roots", "由根判断三次多项式"],
  [
    "A polynomial of degree two or three over a field is reducible exactly when it has a root in the field, because any factorization must contain a linear factor. So testing all the residues decides the question, but this shortcut does not work for higher degrees.\n\nOver $\\mathbb{Z}_{5}$, $x^{3} + x + 1$ takes the values $1, 3, 1, 1, 4$ at $0, 1, 2, 3, 4$, so it has no root and is irreducible.\n\nCheck: $4^{3} + 4 + 1 = 69 = 13 \\cdot 5 + 4$, the last value.\n\n> **Watch out.** The shortcut stops at degree $3$: over $\\mathbb{Z}_{2}$, $x^{4} + x^{2} + 1 = (x^{2} + x + 1)^{2}$ has no root but is reducible.",
    "域上二次或三次多项式可约，当且仅当它在该域中有根，因为任何分解都必须包含一次因式。所以检验所有余数就能判断，但这个捷径对更高次数不适用。\n\n在 $\\mathbb{Z}_{5}$ 上，$x^{3} + x + 1$ 在 $0, 1, 2, 3, 4$ 处的值为 $1, 3, 1, 1, 4$，所以无根，因而不可约。\n\n检验：$4^{3} + 4 + 1 = 69 = 13 \\cdot 5 + 4$，正是最后一个值。\n\n> **注意。** 这个捷径只到三次为止：在 $\\mathbb{Z}_{2}$ 上，$x^{4} + x^{2} + 1 = (x^{2} + x + 1)^{2}$ 没有根，却是可约的。",
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
    const quotient = root === undefined ? "" : poly([1, "x^{2}"], [root, "x"], [(root * root + a) % p, ""]);
    const reasons: Reason[] = [
      [
        noRoot[0],
        `$f(${root ?? fake}) = 0$, so $x - ${root ?? fake}$ is a factor.`,
        `$f(${root ?? fake}) = 0$，所以 $x - ${root ?? fake}$ 是因式。`,
      ],
      [
        hasRoot[0],
        `$f(${fake}) = ${value(fake)}$, not $0$, and no residue gives $0$.`,
        `$f(${fake}) = ${value(fake)}$，不是 $0$，而且没有哪个余数给出 $0$。`,
      ],
      [
        degree[0],
        "An odd degree does not decide irreducibility over a finite field; only the roots do.",
        "奇数次数并不能决定有限域上的不可约性；只有根才能。",
      ],
      [
        noLinear[0],
        "Not every cubic over a finite field factors: a cubic with no root is irreducible.",
        "并非有限域上每个三次多项式都能分解：没有根的三次多项式是不可约的。",
      ],
    ];
    return reasoned(
      choose(
        rng,
        [`Is $${f}$ irreducible over $\\mathbb{Z}_{${p}}$?`, `$${f}$ 在 $\\mathbb{Z}_{${p}}$ 上是否不可约？`],
        option,
        others,
        asPair(
          walked(
            [
              [
                ["Evaluate at every residue", "在每个余数处求值"],
                t(`Its values at $0, 1, \\dots, ${p - 1}$ are $${values}$.`, `它在 $0, 1, \\dots, ${p - 1}$ 处的值是 $${values}$。`),
              ],
              [
                ["Decide", "判断"],
                root === undefined
                  ? t(
                      "None is zero, so the cubic has no linear factor, and a cubic that factors must have one; it is irreducible.",
                      "没有一个为零，所以三次多项式没有一次因式，而可分解的三次多项式必有一次因式；它是不可约的。",
                    )
                  : t(
                      `The value at $${root}$ is zero, so $x - ${root}$ is a factor.`,
                      `在 $${root}$ 处的值为零，所以 $x - ${root}$ 是因式。`,
                    ),
              ],
            ],
            root === undefined
              ? t(`None of $${values}$ is $0$.`, `$${values}$ 都不是 $0$。`)
              : t(
                  `$${f} = (x - ${root})(${quotient})$ in $\\mathbb{Z}_{${p}}[x]$.`,
                  `在 $\\mathbb{Z}_{${p}}[x]$ 中，$${f} = (x - ${root})(${quotient})$。`,
                ),
          ),
        ),
      ),
      reasons,
    );
  },
);

const rationalCandidates = point(
  "counting-the-candidates-of-the-rational-root-test",
  ["Counting the candidates of the rational root test", "计算有理根检验的候选数"],
  [
    "The rational root test lists the fractions $\\pm \\frac{r}{s}$, with $r$ dividing the constant term and $s$ dividing the leading coefficient. Different pairs can give the same number, so the candidates must be counted in lowest terms, or the same value is counted twice.\n\nFor $2x^{3} + x + 4$, $r$ divides $4$ and $s$ divides $2$: the $6$ fractions $\\frac{1}{1}, \\frac{2}{1}, \\frac{4}{1}, \\frac{1}{2}, \\frac{2}{2}, \\frac{4}{2}$ give only the $4$ values $1, 2, 4, \\frac{1}{2}$, so there are $8$ candidates with the signs.\n\nCheck: $\\frac{2}{2} = 1$ and $\\frac{4}{2} = 2$ repeat earlier values.\n\n> **Watch out.** Reduce before counting, and remember the signs: each positive value $v$ gives the two candidates $v$ and $-v$.",
    "有理根检验列出分数 $\\pm \\frac{r}{s}$，其中 $r$ 整除常数项，$s$ 整除首项系数。不同的数对可能给出同一个数，所以候选数必须按最简分数计算，否则同一个值会被计算两次。\n\n对 $2x^{3} + x + 4$，$r$ 整除 $4$，$s$ 整除 $2$：$6$ 个分数 $\\frac{1}{1}, \\frac{2}{1}, \\frac{4}{1}, \\frac{1}{2}, \\frac{2}{2}, \\frac{4}{2}$ 只给出 $4$ 个值 $1, 2, 4, \\frac{1}{2}$，加上符号共 $8$ 个候选。\n\n检验：$\\frac{2}{2} = 1$ 与 $\\frac{4}{2} = 2$ 重复了前面的值。\n\n> **注意。** 计数前要先约分，还要记得符号：每个正值 $v$ 给出 $v$ 与 $-v$ 两个候选。",
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
    const whole = divisors(last).length;
    return numberProblem({
      prompt: t(
        `How many different rational numbers does the rational root test list as candidates for $${f}$?`,
        `对 $${f}$，有理根检验列出多少个不同的有理数作为候选？`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          2 * pairsCount === answer ? answer + 2 : 2 * pairsCount,
          "That counts every pair without reducing the fractions, so equal values are counted more than once.",
          "这没有约分就把每个数对都算上了，所以相等的值被计算了不止一次。",
        ),
        why(list.length, "That forgets the negative candidates.", "这漏掉了负的候选。"),
        why(
          whole * 2,
          "That counts only the whole-number candidates; the divisors of the leading coefficient give fractions too.",
          "这只数了整数候选；首项系数的因数也给出分数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["List the divisors", "列出因数"],
            t(
              `The constant term ${last} has the positive divisors ${divisors(last).join(", ")}, and the leading coefficient ${lead} has ${divisors(lead).join(", ")}: $${pairsCount}$ fractions.`,
              `常数项 ${last} 的正因数是 ${divisors(last).join("、")}，首项系数 ${lead} 的正因数是 ${divisors(lead).join("、")}：共 $${pairsCount}$ 个分数。`,
            ),
          ],
          [
            ["Reduce and add the signs", "约分并加上符号"],
            t(
              `Reducing the fractions leaves $${list.length}$ positive values, and with the signs there are $${answer}$.`,
              `约分后剩下 $${list.length}$ 个正值，加上符号共 $${answer}$ 个。`,
            ),
          ],
        ],
        t(
          `Of the $${list.length}$ positive values, $${whole}$ are whole numbers, the divisors of ${last}, and $${list.length - whole}$ are proper fractions; doubling for the signs gives $${answer}$.`,
          `$${list.length}$ 个正值中，$${whole}$ 个是整数，即 ${last} 的因数，$${list.length - whole}$ 个是真分数；按符号加倍得 $${answer}$。`,
        ),
      ),
    });
  },
);

const quaternionCommutator = point(
  "the-commutator-of-two-quaternions",
  ["The commutator of two quaternions", "两个四元数的交换子"],
  [
    "Linear equations over the quaternions need separate left and right solutions because multiplication is not commutative. The difference $pq - qp$ measures this. It has no real part, and only the vector parts contribute, so the real coefficients of $p$ and $q$ do not affect it.\n\nFor $p = i$ and $q = j$: $pq - qp = k - (-k) = 2k$, so the coefficient of $k$ is $2$.\n\nCheck: the coefficient of $k$ in $pq - qp$ is $2(b_{1}c_{2} - c_{1}b_{2})$, here $2((1)(1) - (0)(0)) = 2$.\n\n> **Watch out.** The terms do not cancel: $ij = k$ but $ji = -k$, so the commutator doubles them; and the real parts change nothing, as $(3 + i)j - j(3 + i) = 2k$ too.",
    "四元数上的线性方程需要分别求左解和右解，因为乘法不可交换。差 $pq - qp$ 衡量了这一点。它没有实部，只有向量部分起作用，所以 $p$ 和 $q$ 的实系数不影响它。\n\n对 $p = i$，$q = j$：$pq - qp = k - (-k) = 2k$，所以 $k$ 的系数是 $2$。\n\n检验：$pq - qp$ 中 $k$ 的系数是 $2(b_{1}c_{2} - c_{1}b_{2})$，这里是 $2((1)(1) - (0)(0)) = 2$。\n\n> **注意。** 这些项不会抵消：$ij = k$ 而 $ji = -k$，所以交换子把它们加倍；实部不起作用，$(3 + i)j - j(3 + i) = 2k$ 也一样。",
  ],
  (rng) => {
    const entry = () => rng.int(-4, 4);
    const p = [entry(), entry(), rng.pick([-3, -2, -1, 1, 2, 3]), entry()];
    const q = [entry(), rng.pick([-3, -2, -1, 1, 2, 3]), entry(), entry()];
    const pq = quaternionProduct(p, q);
    const qp = quaternionProduct(q, p);
    const answer = (pq[3] as number) - (qp[3] as number);
    const show = (v: readonly number[]) => poly([v[0] as number, ""], [v[1] as number, "i"], [v[2] as number, "j"], [v[3] as number, "k"]);
    const pk = pq[3] as number;
    const qk = qp[3] as number;
    return numberProblem({
      prompt: t(
        `Let $p = ${show(p)}$ and $q = ${show(q)}$. Find the coefficient of $k$ in $pq - qp$.`,
        `设 $p = ${show(p)}$，$q = ${show(q)}$。求 $pq - qp$ 中 $k$ 的系数。`,
      ),
      answer,
      mistakes: distinctRingMistakes(answer, [
        why(
          pk,
          "That is the coefficient of $k$ in $pq$ alone; subtract the one in $qp$.",
          "这只是 $pq$ 中 $k$ 的系数；还要减去 $qp$ 中的。",
        ),
        why(
          -answer === answer ? 1 : -answer,
          "That is the coefficient in $qp - pq$; the order of the subtraction matters.",
          "这是 $qp - pq$ 中的系数；相减的顺序是有影响的。",
        ),
        why(
          answer === 0 ? 2 : answer / 2,
          answer === 0
            ? "The cross terms cancel exactly here, so the coefficient is $0$."
            : "That is half the answer: the cross terms of $pq$ and $qp$ have opposite signs, so the difference doubles them.",
          answer === 0 ? "这里交叉项恰好抵消，所以系数是 $0$。" : "这是答案的一半：$pq$ 与 $qp$ 的交叉项符号相反，所以相减后加倍。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Multiply both ways", "两种顺序相乘"],
            t(`$pq = ${show(pq)}$ and $qp = ${show(qp)}$.`, `$pq = ${show(pq)}$，$qp = ${show(qp)}$。`),
          ],
          [
            ["Subtract", "相减"],
            t(`The coefficients of $k$ give $${pk} - (${qk}) = ${answer}$.`, `把 $k$ 的系数相减，得 $${pk} - (${qk}) = ${answer}$。`),
          ],
        ],
        t(
          `The coefficient of $k$ in $pq - qp$ is $2(b_{1}c_{2} - c_{1}b_{2}) = 2((${p[1]})(${q[2]}) - (${p[2]})(${q[1]})) = ${answer}$.`,
          `$pq - qp$ 中 $k$ 的系数为 $2(b_{1}c_{2} - c_{1}b_{2}) = 2((${p[1]})(${q[2]}) - (${p[2]})(${q[1]})) = ${answer}$。`,
        ),
      ),
    });
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
