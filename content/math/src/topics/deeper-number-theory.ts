// Further knowledge points for topics of Number Theory, each a skill the topic's own points
// leave out. See `deeperNumberTheoryPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, divisors, factorize, point, powMod, primesUpTo, totient } from "../university-kit.ts";

/** gcd returns the greatest common divisor of two nonnegative numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** sigma returns the sum of the positive divisors of n. */
const sigma = (n: number) => divisors(n).reduce((x, y) => x + y, 0);

const oddDivisorCounts = point(
  "numbers-with-an-odd-number-of-divisors",
  ["Numbers with an odd number of divisors", "因子个数为奇数的数"],
  [
    "Divisors come in pairs $d$ and $\\frac{n}{d}$, and a pair collapses to one divisor only when $d^2 = n$. So a number has an odd number of divisors exactly when it is a perfect square. Counting such numbers up to $N$ is the same as counting the perfect squares up to $N$.",
    "因子成对出现，即 $d$ 和 $\\frac{n}{d}$，只有当 $d^2 = n$ 时一对才合为一个。所以一个数的因子个数为奇数，当且仅当它是完全平方数。数到 $N$ 为止的这种数，就是数到 $N$ 为止的完全平方数。",
  ],
  (rng) => {
    const N = rng.int(20, 2000);
    const answer = Math.floor(Math.sqrt(N));
    return ask(
      [
        `How many whole numbers from 1 to ${N} have an odd number of positive divisors?`,
        `从 1 到 ${N} 的整数中，有多少个数的正因子个数是奇数？`,
      ],
      answer,
      [Math.floor(N / 2), answer + 1, answer - 1, Math.ceil(N / 2) + 1].filter((v) => v !== answer),
      [
        `These are exactly the perfect squares, and the largest square up to ${N} is $${answer}^2$.`,
        `这些数恰好是完全平方数，不超过 ${N} 的最大平方数是 $${answer}^2$。`,
      ],
    );
  },
);

const reciprocalSum = point(
  "the-sum-of-the-reciprocals-of-the-divisors",
  ["The sum of the reciprocals of the divisors", "因子倒数之和"],
  [
    "As $d$ runs over the divisors of $n$, so does $\\frac{n}{d}$. So $\\sum_{d \\mid n} \\frac{1}{d} = \\frac{1}{n} \\sum_{d \\mid n} \\frac{n}{d} = \\frac{\\sigma(n)}{n}$. The value 2 is therefore the mark of a perfect number, which gives a quick way to compare a number with the perfect ones.",
    "当 $d$ 取遍 $n$ 的因子时，$\\frac{n}{d}$ 也取遍。所以 $\\sum_{d \\mid n} \\frac{1}{d} = \\frac{1}{n} \\sum_{d \\mid n} \\frac{n}{d} = \\frac{\\sigma(n)}{n}$。因此值为 2 是完全数的标志，这提供了一种把一个数与完全数比较的简便方法。",
  ],
  (rng) => {
    const n = rng.int(6, 60);
    const s = sigma(n);
    const answer = Q.of(s, n);
    return ask(
      [`What is the sum of the reciprocals of all positive divisors of ${n}?`, `${n} 的所有正因子的倒数之和是多少？`],
      answer,
      [Q.of(n, s), Q.of(divisors(n).length, n), Q.of(s - n, n), Q.of(s, n + 1)],
      [
        `The sum is $\\frac{\\sigma(${n})}{${n}} = \\frac{${s}}{${n}} = ${answer.toLatex()}$.`,
        `和是 $\\frac{\\sigma(${n})}{${n}} = \\frac{${s}}{${n}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const abundance = point(
  "the-abundance-of-a-number",
  ["The abundance of a number", "数的盈余"],
  [
    "The abundance of $n$ is $\\sigma(n) - 2 n$, the amount by which the proper divisors exceed $n$. It is positive for abundant numbers, zero for perfect numbers and negative for deficient numbers. Primes have the most negative value possible for their size, since their only proper divisor is 1.",
    "$n$ 的盈余是 $\\sigma(n) - 2 n$，即真因子之和超过 $n$ 的量。盈数为正，完全数为零，亏数为负。素数在同样大小的数中盈余最小，因为它唯一的真因子是 1。",
  ],
  (rng) => {
    const n = rng.int(6, 120);
    const s = sigma(n);
    const answer = s - 2 * n;
    return ask(
      [`What is the abundance $\\sigma(n) - 2n$ of ${n}?`, `${n} 的盈余 $\\sigma(n) - 2n$ 是多少？`],
      answer,
      [s - n, s, 2 * n - s, answer + 1].filter((v) => v !== answer),
      [
        `$\\sigma(${n}) = ${s}$, so the abundance is $${s} - ${2 * n} = ${answer}$.`,
        `$\\sigma(${n}) = ${s}$，所以盈余是 $${s} - ${2 * n} = ${answer}$。`,
      ],
    );
  },
);

const primeGaps = point(
  "arbitrarily-long-gaps-between-primes",
  ["Arbitrarily long gaps between primes", "任意长的素数间隔"],
  [
    "Every number in the list $n! + 2, n! + 3, \\ldots, n! + n$ is composite, since $k$ divides both $n!$ and $k$. So there are runs of $n - 1$ consecutive composites for every $n$. Primes thin out in this sense, even though there are infinitely many of them.",
    "列表 $n! + 2, n! + 3, \\ldots, n! + n$ 中的每个数都是合数，因为 $k$ 既整除 $n!$ 又整除 $k$。所以对每个 $n$ 都有 $n - 1$ 个连续合数。尽管素数有无穷多个，但在这个意义上它们越来越稀疏。",
  ],
  (rng) => {
    const n = rng.int(5, 40);
    const k = rng.int(2, n);
    const countIt = rng.bool();
    const answer = countIt ? n - 1 : k;
    return ask(
      countIt
        ? [
            `How many consecutive composite numbers does the list $${n}! + 2, \\ldots, ${n}! + ${n}$ contain?`,
            `列表 $${n}! + 2, \\ldots, ${n}! + ${n}$ 含有多少个连续合数？`,
          ]
        : [
            `The proof shows that $${n}! + ${k}$ is composite by naming one divisor of it. Which divisor does it name?`,
            `这个证明指出 $${n}! + ${k}$ 的一个因子，从而说明它是合数。它指出的因子是哪个？`,
          ],
      answer,
      countIt ? [n, n + 1, n - 2, 2 * n] : [k + 1, k - 1 > 1 ? k - 1 : k + 2, n + 1, k + 3],
      [
        countIt
          ? `The added term runs from 2 to ${n}, which gives ${n - 1} numbers, and each is composite.`
          : `${k} divides $${n}!$ and divides itself, so it divides the sum.`,
        countIt ? `加上的项从 2 到 ${n}，共 ${n - 1} 个数，每个都是合数。` : `${k} 整除 $${n}!$，也整除它自身，所以整除它们的和。`,
      ],
    );
  },
);

const solutionSpacing = point(
  "how-solutions-of-a-congruence-are-spaced",
  ["How solutions of a congruence are spaced", "同余式解的间隔"],
  [
    "When $d = \\gcd(a, n)$ divides $b$, the congruence $a x \\equiv b \\pmod{n}$ has $d$ solutions modulo $n$. They are evenly spaced, $\\frac{n}{d}$ apart, because adding $\\frac{n}{d}$ to $x$ adds a multiple of $n$ to $a x$. So one solution quickly gives all of them.",
    "当 $d = \\gcd(a, n)$ 整除 $b$ 时，同余式 $a x \\equiv b \\pmod{n}$ 模 $n$ 有 $d$ 个解。它们等距分布，间隔 $\\frac{n}{d}$，因为给 $x$ 加 $\\frac{n}{d}$ 使 $a x$ 增加 $n$ 的倍数。所以由一个解很快就能得到全部解。",
  ],
  (rng) => {
    const d = rng.int(2, 6);
    const m = rng.pick([3, 5, 7, 8, 9, 11, 13]);
    let u = rng.int(2, 10);
    while (gcd(u, m) !== 1) u++;
    const [a, n] = [d * u, d * m];
    const b = a * rng.int(1, m - 1);
    return ask(
      [
        `The solutions of $${a} x \\equiv ${b % n} \\pmod{${n}}$ are evenly spaced. How far apart are they?`,
        `$${a} x \\equiv ${b % n} \\pmod{${n}}$ 的解是等距分布的。它们相隔多少？`,
      ],
      m,
      [d, n, u, m + d].filter((v) => v !== m),
      [
        `$\\gcd(${a}, ${n}) = ${d}$, so there are ${d} solutions, spaced $\\frac{${n}}{${d}} = ${m}$ apart.`,
        `$\\gcd(${a}, ${n}) = ${d}$，所以有 ${d} 个解，间隔 $\\frac{${n}}{${d}} = ${m}$。`,
      ],
    );
  },
);

const weightedMu = point(
  "a-weighted-sum-of-the-mobius-function",
  ["A weighted sum of the Mobius function", "默比乌斯函数的加权和"],
  [
    "The formula $\\varphi(n) = n \\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ can be read in reverse. So the weighted sum $\\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ equals $\\frac{\\varphi(n)}{n}$, which is the product of $1 - \\frac{1}{p}$ over the primes dividing $n$. Only the primes matter, not their exponents.",
    "公式 $\\varphi(n) = n \\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ 可以反过来读。所以加权和 $\\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ 等于 $\\frac{\\varphi(n)}{n}$，即对 $n$ 的素因子取 $1 - \\frac{1}{p}$ 之积。只有素因子起作用，指数不起作用。",
  ],
  (rng) => {
    const n = rng.int(6, 200);
    const primes = factorize(n).map(([p]) => p);
    const answer = Q.of(totient(n), n);
    const written = primes.map((p) => `\\left( 1 - \\frac{1}{${p}} \\right)`).join(" ");
    return ask(
      [`What is $\\sum_{d \\mid ${n}} \\frac{\\mu(d)}{d}$?`, `$\\sum_{d \\mid ${n}} \\frac{\\mu(d)}{d}$ 是多少？`],
      answer,
      [Q.of(1, n), Q.of(n - 1, n), Q.of(totient(n), n + 1), Q.of(0, 1)].filter((v) => !v.eq(answer)),
      [`The primes of ${n} give $${written} = ${answer.toLatex()}$.`, `${n} 的素因子给出 $${written} = ${answer.toLatex()}$。`],
    );
  },
);

const elementsOfOrder = point(
  "how-many-residues-have-a-given-order",
  ["How many residues have a given order", "给定阶的剩余个数"],
  [
    "Modulo a prime $p$, there is a primitive root $g$, so every nonzero residue is a power of $g$. The powers with order exactly $d$, for $d$ dividing $p - 1$, number $\\varphi(d)$. Adding over all $d$ recovers $p - 1$, since $\\sum_{d \\mid n} \\varphi(d) = n$.",
    "模素数 $p$ 存在原根 $g$，所以每个非零剩余都是 $g$ 的幂。对整除 $p - 1$ 的 $d$，阶恰为 $d$ 的幂有 $\\varphi(d)$ 个。对所有 $d$ 求和就回到 $p - 1$，因为 $\\sum_{d \\mid n} \\varphi(d) = n$。",
  ],
  (rng) => {
    const p = rng.pick(primesUpTo(100).filter((v) => v > 11));
    const d = rng.pick(divisors(p - 1).filter((v) => v > 2));
    const answer = totient(d);
    return ask(
      [`How many residues modulo ${p} have order exactly ${d}?`, `模 ${p} 阶恰为 ${d} 的剩余有多少个？`],
      answer,
      [d, totient(p - 1), Math.floor((p - 1) / d), answer + 1].filter((v) => v !== answer),
      [`The count is $\\varphi(${d}) = ${answer}$.`, `个数是 $\\varphi(${d}) = ${answer}$。`],
    );
  },
);

const logOfProduct = point(
  "the-discrete-logarithm-of-a-product",
  ["The discrete logarithm of a product", "积的离散对数"],
  [
    "If $g$ is a primitive root modulo $p$, then $g^x g^y = g^{x + y}$. So discrete logarithms turn multiplication into addition, like ordinary logarithms. The exponents are read modulo $p - 1$, because $g^{p - 1} \\equiv 1$. Powers likewise turn into multiples of the logarithm.",
    "如果 $g$ 是模 $p$ 的原根，那么 $g^x g^y = g^{x + y}$。所以离散对数像普通对数一样，把乘法变成加法。指数模 $p - 1$ 来读，因为 $g^{p - 1} \\equiv 1$。幂同样变成对数的倍数。",
  ],
  (rng) => {
    const p = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43]);
    const [x, y] = [rng.int(1, p - 2), rng.int(1, p - 2)];
    const answer = (x + y) % (p - 1);
    return ask(
      [
        `Modulo ${p}, a primitive root has $\\log a = ${x}$ and $\\log b = ${y}$. What is $\\log(ab)$, from 0 up to ${p - 2}?`,
        `模 ${p} 时，以某原根为底，$\\log a = ${x}$，$\\log b = ${y}$。$\\log(ab)$ 是多少（从 0 到 ${p - 2}）？`,
      ],
      answer,
      [(x * y) % (p - 1), x + y === answer ? (x + y + 1) % (p - 1) : x + y, (x + y) % p, (answer + 1) % (p - 1)].filter(
        (v) => v !== answer,
      ),
      [`Logarithms add modulo ${p - 1}: $${x} + ${y} \\equiv ${answer}$.`, `对数模 ${p - 1} 相加：$${x} + ${y} \\equiv ${answer}$。`],
    );
  },
);

const smallRoot = point(
  "solving-a-quadratic-congruence",
  ["Solving a quadratic congruence", "解二次同余式"],
  [
    "When $a$ is a quadratic residue modulo an odd prime $p$, the congruence $x^2 \\equiv a$ has two solutions, and they are negatives of each other. So they add up to $p$. For small primes, one can be found by trying $a$, $a + p$, $a + 2 p$ and so on until a perfect square appears.",
    "当 $a$ 是模奇素数 $p$ 的二次剩余时，同余式 $x^2 \\equiv a$ 有两个解，它们互为相反数。所以它们的和是 $p$。对小素数，可以试 $a$、$a + p$、$a + 2 p$ 等，直到出现完全平方数。",
  ],
  (rng) => {
    const p = rng.pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
    const r = rng.int(2, (p - 1) / 2);
    const a = (r * r) % p;
    return ask(
      [
        `What is the smaller positive solution of $x^2 \\equiv ${a} \\pmod{${p}}$?`,
        `$x^2 \\equiv ${a} \\pmod{${p}}$ 较小的正整数解是多少？`,
      ],
      r,
      [p - r, a, r + 1, r - 1 > 0 ? r - 1 : r + 2].filter((v) => v !== r),
      [
        `$${r}^2 = ${r * r} \\equiv ${a} \\pmod{${p}}$, and the other solution is $${p} - ${r} = ${p - r}$.`,
        `$${r}^2 = ${r * r} \\equiv ${a} \\pmod{${p}}$，另一个解是 $${p} - ${r} = ${p - r}$。`,
      ],
    );
  },
);

const threeModFourRoot = point(
  "a-square-root-formula-for-three-mod-four",
  ["A square root formula for three mod four", "模四余三的平方根公式"],
  [
    "When $p \\equiv 3 \\pmod{4}$ and $a$ is a quadratic residue, one square root is given directly by $x = a^{(p + 1) / 4}$. Indeed, $x^2 = a^{(p + 1) / 2} = a \\cdot a^{(p - 1) / 2}$, and Euler's criterion says that the last factor is 1. No search is needed.",
    "当 $p \\equiv 3 \\pmod{4}$ 且 $a$ 是二次剩余时，一个平方根可以直接由 $x = a^{(p + 1) / 4}$ 给出。事实上，$x^2 = a^{(p + 1) / 2} = a \\cdot a^{(p - 1) / 2}$，而欧拉判别法说明最后一个因子是 1。不需要搜索。",
  ],
  (rng) => {
    const p = rng.pick([7, 11, 19, 23, 31, 43, 47, 59, 67, 71]);
    const r = rng.int(2, p - 2);
    const a = (r * r) % p;
    const e = (p + 1) / 4;
    const answer = powMod(a, e, p);
    return ask(
      [
        `What does $x = a^{(p + 1) / 4}$ give for $a = ${a}$ and $p = ${p}$, from 0 up to ${p - 1}?`,
        `$a = ${a}$，$p = ${p}$ 时，$x = a^{(p + 1) / 4}$ 给出什么（从 0 到 ${p - 1}）？`,
      ],
      answer,
      [p - answer, a, e, (answer + 1) % p].filter((v) => v !== answer),
      [
        `The exponent is ${e}, and $${a}^{${e}} \\equiv ${answer} \\pmod{${p}}$. Its square is ${a}, as required.`,
        `指数是 ${e}，$${a}^{${e}} \\equiv ${answer} \\pmod{${p}}$。它的平方是 ${a}，符合要求。`,
      ],
    );
  },
);

const tripleArea = point(
  "the-area-of-a-pythagorean-triangle",
  ["The area of a Pythagorean triangle", "毕达哥拉斯三角形的面积"],
  [
    "With $a = m^2 - n^2$, $b = 2 m n$ and $c = m^2 + n^2$, the area of the right triangle is $\\frac{1}{2} a b = m n (m^2 - n^2)$. This is always a multiple of 6. So the area can be found without first computing the sides, and Fermat proved it is never a perfect square.",
    "设 $a = m^2 - n^2$，$b = 2 m n$，$c = m^2 + n^2$，直角三角形的面积是 $\\frac{1}{2} a b = m n (m^2 - n^2)$。它总是 6 的倍数。所以不必先算出边就能求面积，费马还证明了它从来不是完全平方数。",
  ],
  (rng) => {
    const m = rng.int(2, 9);
    const n = rng.int(1, m - 1);
    const answer = m * n * (m * m - n * n);
    return ask(
      [
        `What is the area of the right triangle from Euclid's formula with $m = ${m}$ and $n = ${n}$?`,
        `欧几里得公式中 $m = ${m}$，$n = ${n}$ 的直角三角形面积是多少？`,
      ],
      answer,
      [2 * answer, m * m - n * n, 2 * m * n, m * n * (m * m + n * n)].filter((v) => v !== answer),
      [
        `The area is $${m} \\cdot ${n} \\cdot (${m * m} - ${n * n}) = ${answer}$.`,
        `面积是 $${m} \\cdot ${n} \\cdot (${m * m} - ${n * n}) = ${answer}$。`,
      ],
    );
  },
);

/** deeperNumberTheoryPoints maps topics of Number Theory to their further knowledge points. */
export const deeperNumberTheoryPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "counting-divisors": [oddDivisorCounts],
  "the-sum-of-divisors-function": [reciprocalSum],
  "perfect-numbers": [abundance],
  "the-distribution-of-primes": [primeGaps],
  "solving-linear-congruences": [solutionSpacing],
  "the-mobius-function": [weightedMu],
  "primitive-roots": [elementsOfOrder],
  "discrete-logarithms": [logOfProduct],
  "quadratic-residues": [smallRoot],
  "eulers-criterion": [threeModFourRoot],
  "pythagorean-triples": [tripleArea],
};
