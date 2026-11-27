// Further knowledge points for topics of Number Theory, each a skill the topic's own points
// leave out. See `deeperNumberTheoryPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";
import { say, withMistakes } from "../problems.ts";

import { ask, divisors, factorize, orderMod, point, powMod, primesUpTo, totient } from "../university-kit.ts";
import { type Miss, pw, until, worked } from "./number-theory-course.ts";

/** gcd returns the greatest common divisor of two nonnegative numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** sigma returns the sum of the positive divisors of n. */
const sigma = (n: number) => divisors(n).reduce((x, y) => x + y, 0);

/** shownFactors writes the prime factorization of n, leaving out exponents of one. */
const shownFactors = (n: number) =>
  factorize(n)
    .map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`))
    .join(" \\times ");

/** firstRoot is the smallest primitive root modulo a prime. */
const firstRoot = (p: number) => {
  let g = 2;
  while (orderMod(g, p) !== p - 1) g++;
  return g;
};

const oddDivisorCounts = point(
  "numbers-with-an-odd-number-of-divisors",
  ["Numbers with an odd number of divisors", "因子个数为奇数的数"],
  [
    "Divisors come in pairs $d$ and $\\frac{n}{d}$, and a pair collapses to one divisor only when $d^2 = n$. So a number has an odd number of divisors exactly when it is a perfect square, and counting such numbers up to $N$ is counting the squares up to $N$. Up to $30$ they are $1, 4, 9, 16, 25$, five numbers, and $5$ is the whole part of $\\sqrt{30}$, since $5^2 = 25 \\le 30 < 36 = 6^2$.\n\nCheck: $16$ has the divisors $1, 2, 4, 8, 16$, five of them, because $4$ pairs with itself, while $18$ has $1, 2, 3, 6, 9, 18$, six of them.\n\n> **Watch out.** The count is the whole part of $\\sqrt{N}$, not half of $N$: a number with an odd number of divisors is not the same as an odd number.",
    "因子成对出现，即 $d$ 和 $\\frac{n}{d}$，只有当 $d^2 = n$ 时一对才合为一个。所以一个数的因子个数为奇数，当且仅当它是完全平方数；数到 $N$ 为止的这种数，就是数到 $N$ 为止的完全平方数。到 $30$ 为止它们是 $1, 4, 9, 16, 25$，共五个，而 $5$ 正是 $\\sqrt{30}$ 的整数部分，因为 $5^2 = 25 \\le 30 < 36 = 6^2$。\n\n检验：$16$ 的因子是 $1, 2, 4, 8, 16$，共五个，因为 $4$ 与自己配对；而 $18$ 的因子是 $1, 2, 3, 6, 9, 18$，共六个。\n\n> **注意。** 个数是 $\\sqrt{N}$ 的整数部分，而不是 $N$ 的一半：因子个数为奇数的数，并不是奇数。",
  ],
  (rng) =>
    until(() => {
      const N = rng.int(20, 2000);
      let answer = 1;
      while ((answer + 1) * (answer + 1) <= N) answer++;
      const misses: Miss[] = [
        [
          Math.floor(N / 2),
          "That counts about half of the numbers, as if the odd numbers were meant; the question is how many divisors each number has, and that count is odd only for squares.",
          "那数了大约一半的数，好像问的是奇数；问题问的是每个数有多少个因子，而这个个数只有平方数才是奇数。",
        ],
        [
          answer + 1,
          `That counts one square too many: $${answer + 1}^2 = ${(answer + 1) * (answer + 1)}$ is larger than $${N}$.`,
          `那多数了一个平方数：$${answer + 1}^2 = ${(answer + 1) * (answer + 1)}$ 比 $${N}$ 大。`,
        ],
        [
          answer - 1,
          `That leaves out one square, either the first one, $1$, or the last one, $${answer}^2 = ${answer * answer}$.`,
          `那漏掉了一个平方数，要么是第一个 $1$，要么是最后一个 $${answer}^2 = ${answer * answer}$。`,
        ],
      ];
      const root = Math.sqrt(N);
      const exact = answer * answer === N;
      return worked(
        [
          `How many whole numbers from 1 to ${N} have an odd number of positive divisors?`,
          `从 1 到 ${N} 的整数中，有多少个数的正因子个数是奇数？`,
        ],
        answer,
        misses,
        [
          [
            ["Pair the divisors", "给因子配对"],
            [
              "Each divisor $d$ pairs with $\\frac{n}{d}$, so the count is odd only when some $d$ pairs with itself, that is, when $n$ is a perfect square.",
              "每个因子 $d$ 与 $\\frac{n}{d}$ 配对，所以只有某个 $d$ 与自己配对，也就是 $n$ 是完全平方数时，个数才是奇数。",
            ],
          ],
          [
            ["Find the largest square", "找最大的平方数"],
            [
              `$${answer}^2 = ${answer * answer} \\le ${N} < ${(answer + 1) * (answer + 1)} = ${answer + 1}^2$, so the squares are $1, 4, \\ldots, ${answer}^2$.`,
              `$${answer}^2 = ${answer * answer} \\le ${N} < ${(answer + 1) * (answer + 1)} = ${answer + 1}^2$，所以平方数是 $1, 4, \\ldots, ${answer}^2$。`,
            ],
          ],
          [
            ["Count them", "数出个数"],
            [
              `One square for each base from $1$ to $${answer}$: $${answer}$ numbers.`,
              `底数从 $1$ 到 $${answer}$ 各一个平方数：共 $${answer}$ 个。`,
            ],
          ],
        ],
        exact
          ? [
              `$\\sqrt{${N}} = ${answer}$ exactly, and its whole part is $${answer}$.`,
              `$\\sqrt{${N}} = ${answer}$ 恰好成立，整数部分是 $${answer}$。`,
            ]
          : [
              `$\\sqrt{${N}} \\approx ${root.toFixed(2)}$, whose whole part is $${answer}$.`,
              `$\\sqrt{${N}} \\approx ${root.toFixed(2)}$，整数部分是 $${answer}$。`,
            ],
      );
    }),
);

const reciprocalSum = point(
  "the-sum-of-the-reciprocals-of-the-divisors",
  ["The sum of the reciprocals of the divisors", "因子倒数之和"],
  [
    "As $d$ runs over the divisors of $n$, so does $\\frac{n}{d}$. So $\\sum_{d \\mid n} \\frac{1}{d} = \\frac{1}{n} \\sum_{d \\mid n} \\frac{n}{d} = \\frac{\\sigma(n)}{n}$, and the value 2 is the mark of a perfect number. For $6$ the divisors are $1, 2, 3, 6$, and $1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{6} = 2 = \\frac{12}{6} = \\frac{\\sigma(6)}{6}$.\n\nCheck: for $4$, $1 + \\frac{1}{2} + \\frac{1}{4} = \\frac{7}{4}$, and $\\sigma(4) = 1 + 2 + 4 = 7$.\n\n> **Watch out.** Divide $\\sigma(n)$ by $n$, not $n$ by $\\sigma(n)$: the divisor $1$ alone contributes $1$, so the sum is never below $1$.",
    "当 $d$ 取遍 $n$ 的因子时，$\\frac{n}{d}$ 也取遍。所以 $\\sum_{d \\mid n} \\frac{1}{d} = \\frac{1}{n} \\sum_{d \\mid n} \\frac{n}{d} = \\frac{\\sigma(n)}{n}$，值为 2 是完全数的标志。$6$ 的因子是 $1, 2, 3, 6$，而 $1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{6} = 2 = \\frac{12}{6} = \\frac{\\sigma(6)}{6}$。\n\n检验：对 $4$，$1 + \\frac{1}{2} + \\frac{1}{4} = \\frac{7}{4}$，而 $\\sigma(4) = 1 + 2 + 4 = 7$。\n\n> **注意。** 是 $\\sigma(n)$ 除以 $n$，不是 $n$ 除以 $\\sigma(n)$：单是因子 $1$ 就贡献 $1$，所以这个和从不小于 $1$。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(6, 60);
      const s = sigma(n);
      const ds = divisors(n);
      const answer = Q.of(s, n);
      const misses: Miss[] = [
        [
          Q.of(n, s),
          "That turns the fraction upside down; the divisor $1$ alone contributes $1$, so the sum is at least $1$.",
          "那把分数倒过来了；单是因子 $1$ 就贡献 $1$，所以和至少是 $1$。",
        ],
        [
          Q.of(ds.length, n),
          "That puts the number of divisors over $n$; over the common denominator $n$, each $\\frac{1}{d}$ becomes $\\frac{n/d}{n}$, so the numerator is the sum of the divisors.",
          "那是把因子个数放在 $n$ 上面；通分到分母 $n$ 后，每个 $\\frac{1}{d}$ 变成 $\\frac{n/d}{n}$，所以分子是因子之和。",
        ],
        [
          Q.of(s - n, n),
          `That uses only the proper divisors in the numerator, which drops the term $1$ that comes from the divisor $1$.`,
          `那在分子中只用了真因子，漏掉了由因子 $1$ 得到的那一项 $1$。`,
        ],
      ];
      return worked(
        [`What is the sum of the reciprocals of all positive divisors of ${n}?`, `${n} 的所有正因子的倒数之和是多少？`],
        answer,
        misses,
        [
          [
            ["List the divisors", "列出因子"],
            [
              `The divisors of $${n}$ are $${ds.join(", ")}$, and they add up to $\\sigma(${n}) = ${s}$.`,
              `$${n}$ 的因子是 $${ds.join(", ")}$，它们的和是 $\\sigma(${n}) = ${s}$。`,
            ],
          ],
          [
            ["Use a common denominator", "通分"],
            [
              `Over the denominator $${n}$, the reciprocal of $d$ is $\\frac{${n}/d}{${n}}$, and $${n}/d$ runs over the same divisors, so the sum is $\\frac{${s}}{${n}}$.`,
              `以 $${n}$ 为分母，$d$ 的倒数是 $\\frac{${n}/d}{${n}}$，而 $${n}/d$ 取遍同样的因子，所以和是 $\\frac{${s}}{${n}}$。`,
            ],
          ],
          [
            ["Reduce", "约分"],
            [`$\\frac{${s}}{${n}} = ${answer.toLatex()}$.`, `$\\frac{${s}}{${n}} = ${answer.toLatex()}$。`],
          ],
        ],
        [
          `From the factorization $${n} = ${shownFactors(n)}$, $\\sigma(${n}) = ${factorize(n)
            .map(([p, e]) => sigma(p ** e))
            .join(" \\times ")} = ${s}$, the same numerator.`,
          `由分解式 $${n} = ${shownFactors(n)}$，$\\sigma(${n}) = ${factorize(n)
            .map(([p, e]) => sigma(p ** e))
            .join(" \\times ")} = ${s}$，分子相同。`,
        ],
      );
    }),
);

const abundance = point(
  "the-abundance-of-a-number",
  ["The abundance of a number", "数的盈余"],
  [
    "The abundance of $n$ is $\\sigma(n) - 2 n$, the amount by which the proper divisors exceed $n$. It is positive for abundant numbers, zero for perfect numbers and negative for deficient numbers. For $12$, $\\sigma(12) = 1 + 2 + 3 + 4 + 6 + 12 = 28$, so the abundance is $28 - 24 = 4$ and $12$ is abundant.\n\nCheck: the proper divisors of $12$ add up to $1 + 2 + 3 + 4 + 6 = 16$, which exceeds $12$ by $4$.\n\n> **Watch out.** Subtract $2n$ from $\\sigma(n)$, or $n$ from the sum of the proper divisors; subtracting $n$ from $\\sigma(n)$ only removes $n$ itself and gives the sum of the proper divisors.",
    "$n$ 的盈余是 $\\sigma(n) - 2 n$，即真因子之和超过 $n$ 的量。盈数为正，完全数为零，亏数为负。对 $12$，$\\sigma(12) = 1 + 2 + 3 + 4 + 6 + 12 = 28$，所以盈余是 $28 - 24 = 4$，$12$ 是盈数。\n\n检验：$12$ 的真因子之和是 $1 + 2 + 3 + 4 + 6 = 16$，比 $12$ 多 $4$。\n\n> **注意。** 从 $\\sigma(n)$ 中减去 $2n$，或者从真因子之和中减去 $n$；从 $\\sigma(n)$ 中只减去 $n$，只是去掉了 $n$ 本身，得到的是真因子之和。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(6, 120);
      const s = sigma(n);
      const answer = s - 2 * n;
      const proper = divisors(n).filter((d) => d < n);
      const misses: Miss[] = [
        [
          s - n,
          `That is the sum of the proper divisors, $${s - n}$; the abundance compares it with $${n}$, so subtract $${n}$ once more.`,
          `那是真因子之和 $${s - n}$；盈余要把它与 $${n}$ 比较，所以还要再减去 $${n}$。`,
        ],
        [
          s,
          `That is $\\sigma(${n})$ itself, before $2 \\times ${n}$ is subtracted.`,
          `那是 $\\sigma(${n})$ 本身，还没有减去 $2 \\times ${n}$。`,
        ],
        [2 * n - s, "That subtracts the wrong way round, which flips the sign.", "那减反了，符号就反了。"],
      ];
      return worked(
        [`What is the abundance $\\sigma(n) - 2n$ of ${n}?`, `${n} 的盈余 $\\sigma(n) - 2n$ 是多少？`],
        answer,
        misses,
        [
          [
            ["Add the divisors", "把因子相加"],
            [`$\\sigma(${n}) = ${divisors(n).join(" + ")} = ${s}$.`, `$\\sigma(${n}) = ${divisors(n).join(" + ")} = ${s}$。`],
          ],
          [
            ["Subtract twice the number", "减去这个数的两倍"],
            [`$${s} - ${2 * n} = ${answer}$.`, `$${s} - ${2 * n} = ${answer}$。`],
          ],
        ],
        [
          `The proper divisors add up to $${proper.join(" + ")} = ${s - n}$, and $${s - n} - ${n} = ${answer}$.`,
          `真因子之和是 $${proper.join(" + ")} = ${s - n}$，而 $${s - n} - ${n} = ${answer}$。`,
        ],
      );
    }),
);

const primeGaps = point(
  "arbitrarily-long-gaps-between-primes",
  ["Arbitrarily long gaps between primes", "任意长的素数间隔"],
  [
    "Every number in the list $n! + 2, n! + 3, \\ldots, n! + n$ is composite, since $k$ divides both $n!$ and $k$. So there are runs of $n - 1$ consecutive composites for every $n$, and primes thin out in this sense, even though there are infinitely many of them. For $n = 5$, $5! = 120$, and $122, 123, 124, 125$ are divisible by $2, 3, 4, 5$ in turn: four composites in a row.\n\nCheck: $123 = 3 \\times 41$ and $125 = 5^{3}$, as the rule says.\n\n> **Watch out.** The list starts at $n! + 2$, so it has $n - 1$ numbers, not $n$. The number $n! + 1$ is not covered, and it can be prime: $2! + 1 = 3$ and $3! + 1 = 7$.",
    "列表 $n! + 2, n! + 3, \\ldots, n! + n$ 中的每个数都是合数，因为 $k$ 既整除 $n!$ 又整除 $k$。所以对每个 $n$ 都有 $n - 1$ 个连续合数；尽管素数有无穷多个，但在这个意义上它们越来越稀疏。对 $n = 5$，$5! = 120$，而 $122, 123, 124, 125$ 依次被 $2, 3, 4, 5$ 整除：连续四个合数。\n\n检验：$123 = 3 \\times 41$，$125 = 5^{3}$，与规则相符。\n\n> **注意。** 列表从 $n! + 2$ 开始，所以有 $n - 1$ 个数，而不是 $n$ 个。$n! + 1$ 不在其中，它可能是素数：$2! + 1 = 3$，$3! + 1 = 7$。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(5, 40);
      const k = 2 * rng.int(1, Math.floor((n - 1) / 2)) + 1;
      let smallest = 3;
      while (k % smallest !== 0) smallest += 2;
      if (rng.bool())
        return worked(
          [
            `How many consecutive composite numbers does the list $${n}! + 2, \\ldots, ${n}! + ${n}$ contain?`,
            `列表 $${n}! + 2, \\ldots, ${n}! + ${n}$ 含有多少个连续合数？`,
          ],
          n - 1,
          [
            [
              n,
              `That counts from $${n}! + 1$, which is not in the list and need not be composite.`,
              `那从 $${n}! + 1$ 数起，它不在列表中，也不一定是合数。`,
            ],
            [
              n - 2,
              `That leaves out one end of the list, $${n}! + 2$ or $${n}! + ${n}$.`,
              `那漏掉了列表的一端，$${n}! + 2$ 或 $${n}! + ${n}$。`,
            ],
          ],
          [
            [
              ["Find a divisor of each term", "找出每一项的因数"],
              [
                `For $k$ from $2$ to $${n}$, $k$ divides $${n}!$ and $k$, so $k$ divides $${n}! + k$, which is larger than $k$ and so composite.`,
                `对从 $2$ 到 $${n}$ 的 $k$，$k$ 整除 $${n}!$ 和 $k$，所以 $k$ 整除 $${n}! + k$，而它比 $k$ 大，所以是合数。`,
              ],
            ],
            [
              ["Count the terms", "数项数"],
              [
                `$k$ takes the values $2, 3, \\ldots, ${n}$, which is $${n} - 1 = ${n - 1}$ numbers.`,
                `$k$ 取 $2, 3, \\ldots, ${n}$，共 $${n} - 1 = ${n - 1}$ 个数。`,
              ],
            ],
          ],
          [
            `The two ends factor as $${n}! + 2 = 2 \\left( \\frac{${n}!}{2} + 1 \\right)$ and $${n}! + ${n} = ${n} \\left( ${n - 1}! + 1 \\right)$, both composite.`,
            `两端分解为 $${n}! + 2 = 2 \\left( \\frac{${n}!}{2} + 1 \\right)$ 和 $${n}! + ${n} = ${n} \\left( ${n - 1}! + 1 \\right)$，都是合数。`,
          ],
        );
      const misses: Miss[] = [
        [
          2,
          `$2$ divides $${n}!$ but not $${k}$, which is odd, so $2$ does not divide $${n}! + ${k}$.`,
          `$2$ 整除 $${n}!$，但不整除奇数 $${k}$，所以 $2$ 不整除 $${n}! + ${k}$。`,
        ],
      ];
      if (k !== smallest)
        misses.push([
          k,
          `$${k}$ does divide the sum, but it is not prime; its smaller prime factor $${smallest}$ divides the sum too.`,
          `$${k}$ 确实整除这个和，但它不是质数；它更小的质因数 $${smallest}$ 也整除这个和。`,
        ]);
      if (k % n !== 0)
        misses.push([
          n,
          `$${n}$ divides $${n}!$, but it divides the sum only if it divides $${k}$, which it does not.`,
          `$${n}$ 整除 $${n}!$，但只有它整除 $${k}$ 时才整除这个和，而它不整除。`,
        ]);
      if (smallest !== 3)
        misses.push([
          3,
          `$3$ divides $${n}!$ but not $${k}$, so it does not divide the sum.`,
          `$3$ 整除 $${n}!$ 但不整除 $${k}$，所以不整除这个和。`,
        ]);
      return worked(
        [`What is the smallest prime factor of $${n}! + ${k}$?`, `$${n}! + ${k}$ 的最小质因数是多少？`],
        smallest,
        misses,
        [
          [
            ["Use the factorial", "利用阶乘"],
            [
              `Every prime up to $${n}$ divides $${n}!$, so such a prime divides $${n}! + ${k}$ exactly when it divides $${k}$.`,
              `不超过 $${n}$ 的每个质数都整除 $${n}!$，所以这样的质数整除 $${n}! + ${k}$ 当且仅当它整除 $${k}$。`,
            ],
          ],
          [
            ["Factor the added number", "分解加上的数"],
            [
              `The smallest prime factor of $${k}$ is $${smallest}$, and it is at most $${n}$, so no smaller prime divides the sum.`,
              `$${k}$ 的最小质因数是 $${smallest}$，它不超过 $${n}$，所以没有更小的质数整除这个和。`,
            ],
          ],
        ],
        [
          `$${n}! + ${k} = ${smallest} \\left( \\frac{${n}!}{${smallest}} + ${k / smallest} \\right)$, and the bracket is whole because $${smallest} \\le ${n}$.`,
          `$${n}! + ${k} = ${smallest} \\left( \\frac{${n}!}{${smallest}} + ${k / smallest} \\right)$，括号里是整数，因为 $${smallest} \\le ${n}$。`,
        ],
      );
    }),
);

const solutionSpacing = point(
  "how-solutions-of-a-congruence-are-spaced",
  ["How solutions of a congruence are spaced", "同余式解的间隔"],
  [
    "When $d = \\gcd(a, n)$ divides $b$, the congruence $a x \\equiv b \\pmod{n}$ has $d$ solutions modulo $n$. They are evenly spaced, $\\frac{n}{d}$ apart, because adding $\\frac{n}{d}$ to $x$ adds a multiple of $n$ to $a x$. So one solution quickly gives all of them.\n\n> **Watch out.** $d$ is how many solutions there are, not how far apart they lie. The spacing is $\\frac{n}{d}$, the modulus shared out among the $d$ solutions.",
    "当 $d = \\gcd(a, n)$ 整除 $b$ 时，同余式 $a x \\equiv b \\pmod{n}$ 模 $n$ 有 $d$ 个解。它们等距分布，间隔 $\\frac{n}{d}$，因为给 $x$ 加 $\\frac{n}{d}$ 使 $a x$ 增加 $n$ 的倍数。所以由一个解很快就能得到全部解。\n\n> **注意。** $d$ 是解的个数，而不是解之间的间隔。间隔是 $\\frac{n}{d}$，即模被 $d$ 个解平分。",
  ],
  (rng) => {
    const d = rng.int(2, 6);
    const m = rng.pick([3, 5, 7, 8, 9, 11, 13]);
    let u = rng.int(2, 10);
    while (gcd(u, m) !== 1) u++;
    const [a, n] = [d * u, d * m];
    const b = a * rng.int(1, m - 1);
    const roots = Array.from({ length: n }, (_, x) => x).filter((x) => (a * x - (b % n)) % n === 0);
    const first = roots[0] ?? 0;
    return withMistakes(
      ask(
        [
          `The solutions of $${a} x \\equiv ${b % n} \\pmod{${n}}$ are evenly spaced. How far apart are they?`,
          `$${a} x \\equiv ${b % n} \\pmod{${n}}$ 的解是等距分布的。它们相隔多少？`,
        ],
        m,
        [d, n, u, m + d].filter((v) => v !== m),
        [
          `**Step 1: Count the solutions.** $\\gcd(${a}, ${n}) = ${d}$, and $${d}$ divides $${b % n}$, so there are $${d}$ solutions modulo $${n}$.\n\n**Step 2: Share out the modulus.** Evenly spaced around $${n}$, they lie $\\frac{${n}}{${d}} = ${m}$ apart: adding $${m}$ to $x$ adds $${a} \\cdot ${m} = ${n} \\cdot ${u}$ to $${a}x$.\n\n**Check.** The solutions are $${roots.join(", ")}$, and consecutive ones differ by $${m}$; for instance $${a} \\cdot ${first} = ${a * first} = ${n} \\cdot ${(a * first - (b % n)) / n} + ${b % n}$.`,
          `**第一步：数出解的个数。** $\\gcd(${a}, ${n}) = ${d}$，且 $${d}$ 整除 $${b % n}$，所以模 $${n}$ 有 $${d}$ 个解。\n\n**第二步：平分模。** 它们在 $${n}$ 中等距分布，间隔 $\\frac{${n}}{${d}} = ${m}$：给 $x$ 加 $${m}$，$${a}x$ 就增加 $${a} \\cdot ${m} = ${n} \\cdot ${u}$。\n\n**检验。** 解是 $${roots.join(", ")}$，相邻两个相差 $${m}$；例如 $${a} \\cdot ${first} = ${a * first} = ${n} \\cdot ${(a * first - (b % n)) / n} + ${b % n}$。`,
        ],
      ),
      [
        say(
          String(d),
          `$${d}$ is how many solutions there are; the spacing is the modulus divided by $${d}$.`,
          `$${d}$ 是解的个数；间隔是模除以 $${d}$。`,
        ),
        say(
          String(n),
          `That is the modulus; $${d}$ solutions fit inside it, so they lie closer together.`,
          `这是模；模内有 $${d}$ 个解，所以它们靠得更近。`,
        ),
        say(
          String(u),
          `$${u}$ is the coefficient divided by $${d}$; the spacing comes from the modulus, not the coefficient.`,
          `$${u}$ 是系数除以 $${d}$；间隔来自模，而不是系数。`,
        ),
      ].filter((m2, i, all) => m2.response !== String(m) && all.findIndex((x) => x.response === m2.response) === i),
    );
  },
);

const weightedMu = point(
  "a-weighted-sum-of-the-mobius-function",
  ["A weighted sum of the Möbius function", "默比乌斯函数的加权和"],
  [
    "The formula $\\varphi(n) = n \\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ can be read in reverse. So the weighted sum $\\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ equals $\\frac{\\varphi(n)}{n}$, which is the product of $1 - \\frac{1}{p}$ over the primes dividing $n$; only the primes matter, not their exponents. For $12$ the divisors with $\\mu(d) \\ne 0$ are $1, 2, 3, 6$, and $1 - \\frac{1}{2} - \\frac{1}{3} + \\frac{1}{6} = \\frac{1}{3}$.\n\nCheck: $\\varphi(12) = 4$ and $\\frac{4}{12} = \\frac{1}{3}$; also $\\left( 1 - \\frac{1}{2} \\right) \\left( 1 - \\frac{1}{3} \\right) = \\frac{1}{3}$.\n\n> **Watch out.** Divisors with a repeated prime, such as $4$ and $12$, have $\\mu(d) = 0$ and drop out, and $6$, with two primes, counts with a plus sign.",
    "公式 $\\varphi(n) = n \\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ 可以反过来读。所以加权和 $\\sum_{d \\mid n} \\frac{\\mu(d)}{d}$ 等于 $\\frac{\\varphi(n)}{n}$，即对 $n$ 的素因子取 $1 - \\frac{1}{p}$ 之积；只有素因子起作用，指数不起作用。对 $12$，$\\mu(d) \\ne 0$ 的因子是 $1, 2, 3, 6$，而 $1 - \\frac{1}{2} - \\frac{1}{3} + \\frac{1}{6} = \\frac{1}{3}$。\n\n检验：$\\varphi(12) = 4$，$\\frac{4}{12} = \\frac{1}{3}$；另外 $\\left( 1 - \\frac{1}{2} \\right) \\left( 1 - \\frac{1}{3} \\right) = \\frac{1}{3}$。\n\n> **注意。** 含重复素因子的因子，如 $4$ 和 $12$，有 $\\mu(d) = 0$，不计入；而含两个素因子的 $6$ 带正号。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(6, 200);
      const primes = factorize(n).map(([p]) => p);
      const answer = Q.of(totient(n), n);
      const written = primes.map((p) => `\\left( 1 - \\frac{1}{${p}} \\right)`).join(" ");
      const plus = primes.reduce((v, p) => v.mul(Q.of(p + 1, p)), Q.one);
      const liouville = divisors(n).reduce(
        (v, d) => v.add(Q.of(factorize(d).reduce((c, [, e]) => c + e, 0) % 2 === 0 ? 1 : -1, d)),
        Q.zero,
      );
      const terms = divisors(n).filter((d) => factorize(d).every(([, e]) => e === 1));
      const sign = (d: number) => (factorize(d).length % 2 === 0 ? 1 : -1);
      const shown = terms
        .map((d, i) => {
          const part = d === 1 ? "1" : `\\frac{1}{${d}}`;
          return i === 0 ? part : `${sign(d) > 0 ? "+" : "-"} ${part}`;
        })
        .join(" ");
      const misses: Miss[] = [
        [
          plus,
          "That adds every term with a plus sign; $\\mu(d) = -1$ when $d$ has an odd number of primes.",
          "那是把每一项都取正号；当 $d$ 含奇数个素因子时 $\\mu(d) = -1$。",
        ],
        [
          Q.of(totient(n)),
          `That is $\\varphi(${n})$ itself; the weighted sum is $\\varphi(${n})$ divided by $${n}$.`,
          `那是 $\\varphi(${n})$ 本身；加权和是 $\\varphi(${n})$ 除以 $${n}$。`,
        ],
        [
          Q.zero,
          "That is the plain sum $\\sum_{d \\mid n} \\mu(d)$, which is $0$ for $n > 1$; here each term is divided by $d$.",
          "那是不加权的和 $\\sum_{d \\mid n} \\mu(d)$，对 $n > 1$ 它是 $0$；这里每一项都要除以 $d$。",
        ],
        [
          liouville,
          "That gives the divisors with a repeated prime a sign as well; $\\mu(d) = 0$ for them, so they drop out.",
          "那给含重复素因子的因子也加了符号；它们的 $\\mu(d) = 0$，应当去掉。",
        ],
      ];
      return worked(
        [`What is $\\sum_{d \\mid ${n}} \\frac{\\mu(d)}{d}$?`, `$\\sum_{d \\mid ${n}} \\frac{\\mu(d)}{d}$ 是多少？`],
        answer,
        misses,
        [
          [
            ["Keep the squarefree divisors", "保留无平方因子的因子"],
            [
              `$${n} = ${shownFactors(n)}$, and only the divisors without a repeated prime count: $${terms.join(", ")}$, with sign $-$ for an odd number of primes.`,
              `$${n} = ${shownFactors(n)}$，只有不含重复素因子的因子计入：$${terms.join(", ")}$，含奇数个素因子的取负号。`,
            ],
          ],
          [
            ["Add the terms", "把各项相加"],
            [`$${shown} = ${answer.toLatex()}$.`, `$${shown} = ${answer.toLatex()}$。`],
          ],
        ],
        [
          `The primes of $${n}$ give $${written} = ${answer.toLatex()}$, which is $\\frac{\\varphi(${n})}{${n}} = \\frac{${totient(n)}}{${n}}$.`,
          `$${n}$ 的素因子给出 $${written} = ${answer.toLatex()}$，即 $\\frac{\\varphi(${n})}{${n}} = \\frac{${totient(n)}}{${n}}$。`,
        ],
      );
    }),
);

const elementsOfOrder = point(
  "how-many-residues-have-a-given-order",
  ["How many residues have a given order", "给定阶的剩余个数"],
  [
    "Modulo a prime $p$, there is a primitive root $g$, so every nonzero residue is a power of $g$. The powers with order exactly $d$, for $d$ dividing $p - 1$, number $\\varphi(d)$, and adding over all $d$ recovers $p - 1$, since $\\sum_{d \\mid n} \\varphi(d) = n$. Modulo $13$, the residues of order $4$ number $\\varphi(4) = 2$: they are $5$ and $8$, since $5^2 = 25 \\equiv 12$ and $8^2 = 64 \\equiv 12$, and $12 \\equiv -1$ squares to $1$.\n\nCheck: over the divisors $1, 2, 3, 4, 6, 12$ of $12$, the counts $1 + 1 + 2 + 2 + 2 + 4$ add up to $12$, every nonzero residue once.\n\n> **Watch out.** The count is $\\varphi(d)$, not $d$: the $d$ solutions of $x^d \\equiv 1$ include those of smaller order. And $\\varphi(p - 1)$ counts only the primitive roots, the residues of order $p - 1$.",
    "模素数 $p$ 存在原根 $g$，所以每个非零剩余都是 $g$ 的幂。对整除 $p - 1$ 的 $d$，阶恰为 $d$ 的幂有 $\\varphi(d)$ 个，对所有 $d$ 求和就回到 $p - 1$，因为 $\\sum_{d \\mid n} \\varphi(d) = n$。模 $13$ 时，阶为 $4$ 的剩余有 $\\varphi(4) = 2$ 个：它们是 $5$ 和 $8$，因为 $5^2 = 25 \\equiv 12$，$8^2 = 64 \\equiv 12$，而 $12 \\equiv -1$ 的平方是 $1$。\n\n检验：对 $12$ 的因子 $1, 2, 3, 4, 6, 12$，个数 $1 + 1 + 2 + 2 + 2 + 4$ 之和是 $12$，每个非零剩余恰好数一次。\n\n> **注意。** 个数是 $\\varphi(d)$，不是 $d$：$x^d \\equiv 1$ 的 $d$ 个解中包含阶更小的剩余。而 $\\varphi(p - 1)$ 只数原根，即阶为 $p - 1$ 的剩余。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick(primesUpTo(100).filter((v) => v > 11));
      const d = rng.pick(divisors(p - 1).filter((v) => v > 2));
      const answer = totient(d);
      const g = firstRoot(p);
      const found = Array.from({ length: p - 1 }, (_, i) => i + 1).filter((x) => orderMod(x, p) === d);
      const misses: Miss[] = [
        [
          d,
          `$${d}$ is the order itself; only $\\varphi(${d})$ of the $${d}$ solutions of $x^{${d}} \\equiv 1$ have order exactly $${d}$.`,
          `$${d}$ 是阶本身；$x^{${d}} \\equiv 1$ 的 $${d}$ 个解中只有 $\\varphi(${d})$ 个的阶恰为 $${d}$。`,
        ],
        [
          totient(p - 1),
          `That counts the primitive roots, the residues of order $${p - 1}$, not those of order $${d}$.`,
          `那数的是原根，即阶为 $${p - 1}$ 的剩余，而不是阶为 $${d}$ 的剩余。`,
        ],
        [
          (p - 1) / d,
          `That is how many times $${d}$ goes into $${p - 1}$, not a count of residues.`,
          `那是 $${p - 1}$ 中含有几个 $${d}$，不是剩余的个数。`,
        ],
      ];
      return worked(
        [`How many residues modulo ${p} have order exactly ${d}?`, `模 ${p} 阶恰为 ${d} 的剩余有多少个？`],
        answer,
        misses,
        [
          [
            ["Write residues as powers", "把剩余写成幂"],
            [
              `$${g}$ is a primitive root modulo $${p}$, so every nonzero residue is $${g}^k$ for some $k$ from $1$ to $${p - 1}$, and $${g}^k$ has order $\\frac{${p - 1}}{\\gcd(k, ${p - 1})}$.`,
              `$${g}$ 是模 $${p}$ 的原根，所以每个非零剩余都是某个 $${g}^k$，$k$ 从 $1$ 到 $${p - 1}$，而 $${g}^k$ 的阶是 $\\frac{${p - 1}}{\\gcd(k, ${p - 1})}$。`,
            ],
          ],
          [
            ["Count the exponents", "数指数"],
            [
              `The order is $${d}$ exactly when $\\gcd(k, ${p - 1}) = ${(p - 1) / d}$, that is, $k = ${d === p - 1 ? "" : `${(p - 1) / d} `}j$ with $j$ coprime to $${d}$: $\\varphi(${d}) = ${answer}$ choices.`,
              `阶恰为 $${d}$ 当且仅当 $\\gcd(k, ${p - 1}) = ${(p - 1) / d}$，即 $k = ${d === p - 1 ? "" : `${(p - 1) / d} `}j$ 且 $j$ 与 $${d}$ 互质：共 $\\varphi(${d}) = ${answer}$ 种。`,
            ],
          ],
        ],
        found.length <= 8
          ? [
              `Testing every residue, those of order $${d}$ are $${found.join(", ")}$, which is $${found.length}$ of them.`,
              `逐个检验，阶为 $${d}$ 的剩余是 $${found.join(", ")}$，共 $${found.length}$ 个。`,
            ]
          : [
              `Testing every residue finds $${found.length}$ of order $${d}$, the smallest being $${found.slice(0, 3).join(", ")}$.`,
              `逐个检验，阶为 $${d}$ 的剩余共 $${found.length}$ 个，最小的几个是 $${found.slice(0, 3).join(", ")}$。`,
            ],
      );
    }),
);

const logOfProduct = point(
  "the-discrete-logarithm-of-a-product",
  ["The discrete logarithm of a product", "积的离散对数"],
  [
    "If $g$ is a primitive root modulo $p$, then $g^x g^y = g^{x + y}$. So discrete logarithms turn multiplication into addition, like ordinary logarithms, with the exponents read modulo $p - 1$ because $g^{p - 1} \\equiv 1$. Modulo $11$ with $g = 2$: $2^{8} = 256 \\equiv 3$ and $2^{4} = 16 \\equiv 5$, so $\\log 3 = 8$, $\\log 5 = 4$ and $\\log 15 = 8 + 4 = 12 \\equiv 2 \\pmod{10}$.\n\nCheck: $15 \\equiv 4 \\pmod{11}$, and indeed $2^{2} = 4$.\n\n> **Watch out.** Reduce the sum modulo $p - 1$, not modulo $p$: the powers of $g$ repeat every $p - 1$ steps. And logarithms of a product add; they do not multiply.",
    "如果 $g$ 是模 $p$ 的原根，那么 $g^x g^y = g^{x + y}$。所以离散对数像普通对数一样，把乘法变成加法，指数模 $p - 1$ 来读，因为 $g^{p - 1} \\equiv 1$。模 $11$、$g = 2$ 时：$2^{8} = 256 \\equiv 3$，$2^{4} = 16 \\equiv 5$，所以 $\\log 3 = 8$，$\\log 5 = 4$，$\\log 15 = 8 + 4 = 12 \\equiv 2 \\pmod{10}$。\n\n检验：$15 \\equiv 4 \\pmod{11}$，而确实 $2^{2} = 4$。\n\n> **注意。** 和要模 $p - 1$ 约化，不是模 $p$：$g$ 的幂每 $p - 1$ 步重复一次。并且积的对数是相加，不是相乘。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43]);
      const [x, y] = rng.sample(
        Array.from({ length: p - 2 }, (_, i) => i + 1),
        2,
      ) as [number, number];
      const answer = (x + y) % (p - 1);
      const g = firstRoot(p);
      const [a, b] = [powMod(g, x, p), powMod(g, y, p)];
      const misses: Miss[] = [
        [
          (x * y) % (p - 1),
          "That multiplies the logarithms; the logarithm of a product is the sum of the logarithms.",
          "那是把对数相乘；积的对数是对数之和。",
        ],
        [
          x + y,
          `That forgets to reduce modulo $${p - 1}$; the answer has to lie from $0$ to $${p - 2}$.`,
          `那忘了模 $${p - 1}$ 约化；答案应在 $0$ 到 $${p - 2}$ 之间。`,
        ],
        [
          (x + y) % p,
          `That reduces modulo $${p}$; the exponents repeat every $${p - 1}$ steps, because $g^{${p - 1}} \\equiv 1$.`,
          `那是模 $${p}$ 约化；指数每 $${p - 1}$ 步重复，因为 $g^{${p - 1}} \\equiv 1$。`,
        ],
        [
          Math.abs(x - y),
          "That subtracts the logarithms, which gives the logarithm of a quotient, not of a product.",
          "那是把对数相减，得到的是商的对数，不是积的对数。",
        ],
      ];
      return worked(
        [
          `Modulo ${p}, a primitive root has $\\log a = ${x}$ and $\\log b = ${y}$. What is $\\log(ab)$, from 0 up to ${p - 2}?`,
          `模 ${p} 时，以某原根为底，$\\log a = ${x}$，$\\log b = ${y}$。$\\log(ab)$ 是多少（从 0 到 ${p - 2}）？`,
        ],
        answer,
        misses,
        [
          [
            ["Add the logarithms", "对数相加"],
            [
              `$${pw("g", x)} ${pw("g", y)} = g^{${x} + ${y}} = g^{${x + y}}$.`,
              `$${pw("g", x)} ${pw("g", y)} = g^{${x} + ${y}} = g^{${x + y}}$。`,
            ],
          ],
          [
            [`Reduce modulo ${p - 1}`, `模 ${p - 1} 约化`],
            [
              x + y >= p - 1
                ? `$${x + y} - ${p - 1} = ${answer}$, because $g^{${p - 1}} \\equiv 1$.`
                : `$${x + y}$ already lies from $0$ to $${p - 2}$.`,
              x + y >= p - 1
                ? `$${x + y} - ${p - 1} = ${answer}$，因为 $g^{${p - 1}} \\equiv 1$。`
                : `$${x + y}$ 已经在 $0$ 到 $${p - 2}$ 之间。`,
            ],
          ],
        ],
        [
          `With the primitive root $${g}$: $${pw(g, x)} \\equiv ${a}$ and $${pw(g, y)} \\equiv ${b}$, their product is $${a * b} \\equiv ${(a * b) % p}$, and $${pw(g, answer)} \\equiv ${powMod(g, answer, p)}$, the same residue.`,
          `取原根 $${g}$：$${pw(g, x)} \\equiv ${a}$，$${pw(g, y)} \\equiv ${b}$，它们的积是 $${a * b} \\equiv ${(a * b) % p}$，而 $${pw(g, answer)} \\equiv ${powMod(g, answer, p)}$，是同一个剩余。`,
        ],
      );
    }),
);

const smallRoot = point(
  "solving-a-quadratic-congruence",
  ["Solving a quadratic congruence", "解二次同余式"],
  [
    "When $a$ is a quadratic residue modulo an odd prime $p$, the congruence $x^2 \\equiv a$ has two solutions, and they are negatives of each other, so they add up to $p$. For small primes, one can be found by trying $a$, $a + p$, $a + 2 p$ and so on until a perfect square appears. For $x^2 \\equiv 10 \\pmod{13}$: $10$ and $23$ are not squares, but $36 = 6^2$ is, so $x = 6$, and the other solution is $13 - 6 = 7$.\n\nCheck: $7^2 = 49 = 3 \\times 13 + 10$, so $7$ works too.\n\n> **Watch out.** $a$ is the square, not the root; and of the two roots $r$ and $p - r$, the smaller one is at most $\\frac{p - 1}{2}$.",
    "当 $a$ 是模奇素数 $p$ 的二次剩余时，同余式 $x^2 \\equiv a$ 有两个解，它们互为相反数，所以它们的和是 $p$。对小素数，可以试 $a$、$a + p$、$a + 2 p$ 等，直到出现完全平方数。对 $x^2 \\equiv 10 \\pmod{13}$：$10$ 和 $23$ 不是平方数，而 $36 = 6^2$ 是，所以 $x = 6$，另一个解是 $13 - 6 = 7$。\n\n检验：$7^2 = 49 = 3 \\times 13 + 10$，所以 $7$ 也是解。\n\n> **注意。** $a$ 是平方，不是根；两个根 $r$ 和 $p - r$ 中，较小的不超过 $\\frac{p - 1}{2}$。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick([7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
      const r = rng.int(2, (p - 1) / 2);
      const a = (r * r) % p;
      const tries = Array.from({ length: (r * r - a) / p + 1 }, (_, i) => a + i * p);
      const plain = Math.floor(Math.sqrt(a));
      const misses: Miss[] = [
        [
          p - r,
          `That is the larger of the two solutions; the smaller one is $${p} - ${p - r} = ${r}$.`,
          `那是两个解中较大的一个；较小的是 $${p} - ${p - r} = ${r}$。`,
        ],
        [
          a,
          `$${a}$ is the number being square-rooted, not its square root: $${a}^2 = ${a * a} \\equiv ${(a * a) % p}$.`,
          `$${a}$ 是被开方的数，不是它的平方根：$${a}^2 = ${a * a} \\equiv ${(a * a) % p}$。`,
        ],
        [
          plain,
          `That rounds the ordinary square root of $${a}$ down and ignores the modulus: $${plain}^2 = ${plain * plain}$, which is not $${a}$ modulo $${p}$.`,
          `那是把 $${a}$ 的普通平方根向下取整，忽略了模：$${plain}^2 = ${plain * plain}$，模 $${p}$ 不等于 $${a}$。`,
        ],
      ];
      return worked(
        [
          `What is the smaller positive solution of $x^2 \\equiv ${a} \\pmod{${p}}$?`,
          `$x^2 \\equiv ${a} \\pmod{${p}}$ 较小的正整数解是多少？`,
        ],
        r,
        misses,
        [
          [
            ["Add the modulus until a square appears", "加模直到出现平方数"],
            [
              `Try $${tries.join(", ")}$: the first perfect square is $${r * r} = ${r}^2$.`,
              `试 $${tries.join(", ")}$：第一个完全平方数是 $${r * r} = ${r}^2$。`,
            ],
          ],
          [
            ["Take the smaller root", "取较小的根"],
            [
              `The roots are $${r}$ and $${p} - ${r} = ${p - r}$, and the smaller is $${r}$.`,
              `两个根是 $${r}$ 和 $${p} - ${r} = ${p - r}$，较小的是 $${r}$。`,
            ],
          ],
        ],
        [
          `$${r}^2 = ${r * r} = ${(r * r - a) / p} \\times ${p} + ${a}$, and $${p - r}^2 = ${(p - r) * (p - r)} = ${((p - r) * (p - r) - a) / p} \\times ${p} + ${a}$.`,
          `$${r}^2 = ${r * r} = ${(r * r - a) / p} \\times ${p} + ${a}$，而 $${p - r}^2 = ${(p - r) * (p - r)} = ${((p - r) * (p - r) - a) / p} \\times ${p} + ${a}$。`,
        ],
      );
    }),
);

const threeModFourRoot = point(
  "a-square-root-formula-for-three-mod-four",
  ["A square root formula for three mod four", "模四余三的平方根公式"],
  [
    "When $p \\equiv 3 \\pmod{4}$ and $a$ is a quadratic residue, one square root is given directly by $x = a^{(p + 1) / 4}$. Indeed, $x^2 = a^{(p + 1) / 2} = a \\cdot a^{(p - 1) / 2}$, and Euler's criterion says that the last factor is 1, so no search is needed. For $p = 11$ and $a = 5$ the exponent is $\\frac{12}{4} = 3$, and $5^{3} = 125 = 11 \\times 11 + 4$, so $x = 4$.\n\nCheck: $4^2 = 16 = 11 + 5$, so $4^2 \\equiv 5 \\pmod{11}$.\n\n> **Watch out.** The formula needs $p \\equiv 3 \\pmod{4}$, so that $\\frac{p + 1}{4}$ is whole, and it gives one of the two roots; the other is $p - x$.",
    "当 $p \\equiv 3 \\pmod{4}$ 且 $a$ 是二次剩余时，一个平方根可以直接由 $x = a^{(p + 1) / 4}$ 给出。事实上，$x^2 = a^{(p + 1) / 2} = a \\cdot a^{(p - 1) / 2}$，而欧拉判别法说明最后一个因子是 1，所以不需要搜索。对 $p = 11$、$a = 5$，指数是 $\\frac{12}{4} = 3$，而 $5^{3} = 125 = 11 \\times 11 + 4$，所以 $x = 4$。\n\n检验：$4^2 = 16 = 11 + 5$，所以 $4^2 \\equiv 5 \\pmod{11}$。\n\n> **注意。** 这个公式要求 $p \\equiv 3 \\pmod{4}$，这样 $\\frac{p + 1}{4}$ 才是整数；它给出两个根中的一个，另一个是 $p - x$。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick([7, 11, 19, 23, 31, 43, 47, 59, 67, 71]);
      const r = rng.int(2, p - 2);
      const a = (r * r) % p;
      const e = (p + 1) / 4;
      const answer = powMod(a, e, p);
      const powers = Array.from({ length: e }, (_, i) => powMod(a, i + 1, p));
      const chain = e <= 3 ? powers.map((_, i) => pw(a, i + 1)).join(", ") : `${a}, ${pw(a, 2)}, \\ldots, ${pw(a, e)}`;
      const misses: Miss[] = [
        [
          p - answer,
          `That is the other square root, $${p} - ${answer}$; the formula gives $${answer}$ itself.`,
          `那是另一个平方根 $${p} - ${answer}$；公式给出的是 $${answer}$ 本身。`,
        ],
        [a, `That is $a$ itself; the formula raises $a$ to the power $${e}$.`, `那是 $a$ 本身；公式要把 $a$ 升到 $${e}$ 次幂。`],
        [e, `That is the exponent $\\frac{p + 1}{4} = ${e}$, not the power.`, `那是指数 $\\frac{p + 1}{4} = ${e}$，不是幂。`],
        [
          1,
          `That uses the exponent $\\frac{p - 1}{2}$, which gives Euler's criterion value $1$, not a root.`,
          `那用了指数 $\\frac{p - 1}{2}$，得到的是欧拉判别法的值 $1$，不是根。`,
        ],
      ];
      return worked(
        [
          `What does $x = a^{(p + 1) / 4}$ give for $a = ${a}$ and $p = ${p}$, from 0 up to ${p - 1}?`,
          `$a = ${a}$，$p = ${p}$ 时，$x = a^{(p + 1) / 4}$ 给出什么（从 0 到 ${p - 1}）？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the exponent", "求指数"],
            [`$\\frac{${p} + 1}{4} = ${e}$.`, `$\\frac{${p} + 1}{4} = ${e}$。`],
          ],
          [
            ["Raise to the power", "求幂"],
            [
              `Multiplying by $${a}$ each time and reducing modulo $${p}$, the powers $${chain}$ are $${powers.join(", ")}$, so $x = ${answer}$.`,
              `每次乘以 $${a}$ 并模 $${p}$ 约化，幂 $${chain}$ 依次是 $${powers.join(", ")}$，所以 $x = ${answer}$。`,
            ],
          ],
        ],
        [
          `$${answer}^2 = ${answer * answer} = ${Math.floor((answer * answer) / p)} \\times ${p} + ${(answer * answer) % p}$, which is $${a}$, as a square root should give.`,
          `$${answer}^2 = ${answer * answer} = ${Math.floor((answer * answer) / p)} \\times ${p} + ${(answer * answer) % p}$，即 $${a}$，正是平方根应有的结果。`,
        ],
      );
    }),
);

const tripleArea = {
  ...point(
    "the-area-of-a-pythagorean-triangle",
    ["The area of a Pythagorean triangle", "毕达哥拉斯三角形的面积"],
    [
      "With $a = m^2 - n^2$, $b = 2 m n$ and $c = m^2 + n^2$, the area of the right triangle is $\\frac{1}{2} a b = m n (m^2 - n^2)$. This is always a multiple of 6, so the area can be found without first computing the sides, and Fermat proved it is never a perfect square. For $m = 2$ and $n = 1$ the sides are $3$, $4$ and $5$, and the area is $2 \\cdot 1 \\cdot (4 - 1) = 6$.\n\nCheck: half the product of the legs is $\\frac{3 \\cdot 4}{2} = 6$.\n\n> **Watch out.** The area uses the two legs, $m^2 - n^2$ and $2mn$, and halves their product; the hypotenuse $m^2 + n^2$ plays no part.",
      "设 $a = m^2 - n^2$，$b = 2 m n$，$c = m^2 + n^2$，直角三角形的面积是 $\\frac{1}{2} a b = m n (m^2 - n^2)$。它总是 6 的倍数，所以不必先算出边就能求面积，费马还证明了它从来不是完全平方数。对 $m = 2$、$n = 1$，三边是 $3$、$4$、$5$，面积是 $2 \\cdot 1 \\cdot (4 - 1) = 6$。\n\n检验：两条直角边之积的一半是 $\\frac{3 \\cdot 4}{2} = 6$。\n\n> **注意。** 面积用的是两条直角边 $m^2 - n^2$ 和 $2mn$，取它们之积的一半；斜边 $m^2 + n^2$ 不参与。",
    ],
    (rng) =>
      until(() => {
        const m = rng.int(2, 9);
        const n = rng.int(1, m - 1);
        const [a, b, c] = [m * m - n * n, 2 * m * n, m * m + n * n];
        const answer = m * n * a;
        const misses: Miss[] = [
          [
            2 * answer,
            "That is the product of the legs; the area of a right triangle is half of it.",
            "那是两条直角边之积；直角三角形的面积是它的一半。",
          ],
          [a, "That is the leg $m^2 - n^2$, not the area.", "那是直角边 $m^2 - n^2$，不是面积。"],
          [b, "That is the leg $2mn$, not the area.", "那是直角边 $2mn$，不是面积。"],
          [
            m * n * c,
            "That uses the hypotenuse $m^2 + n^2$ in place of the leg $m^2 - n^2$.",
            "那用斜边 $m^2 + n^2$ 代替了直角边 $m^2 - n^2$。",
          ],
        ];
        return worked(
          [
            `What is the area of the right triangle from Euclid's formula with $m = ${m}$ and $n = ${n}$?`,
            `欧几里得公式中 $m = ${m}$，$n = ${n}$ 的直角三角形面积是多少？`,
          ],
          answer,
          misses,
          [
            [
              ["Find the legs", "求直角边"],
              [
                `$m^2 - n^2 = ${m * m} - ${n * n} = ${a}$ and $2mn = 2 \\cdot ${m} \\cdot ${n} = ${b}$.`,
                `$m^2 - n^2 = ${m * m} - ${n * n} = ${a}$，$2mn = 2 \\cdot ${m} \\cdot ${n} = ${b}$。`,
              ],
            ],
            [
              ["Halve their product", "取积的一半"],
              [`$\\frac{${a} \\cdot ${b}}{2} = ${answer}$.`, `$\\frac{${a} \\cdot ${b}}{2} = ${answer}$。`],
            ],
          ],
          [
            `$m n (m^2 - n^2) = ${m} \\cdot ${n} \\cdot ${a} = ${answer}$, and $${a}^2 + ${b}^2 = ${a * a + b * b} = ${c}^2$, so the triangle is right.`,
            `$m n (m^2 - n^2) = ${m} \\cdot ${n} \\cdot ${a} = ${answer}$，而 $${a}^2 + ${b}^2 = ${a * a + b * b} = ${c}^2$，所以是直角三角形。`,
          ],
        );
      }),
  ),
  figure: numberTheoryDrawings1["pythagorean-triples#the-area-of-a-pythagorean-triangle"],
};

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
