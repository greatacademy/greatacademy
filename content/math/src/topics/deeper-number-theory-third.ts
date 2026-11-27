// Third knowledge points for thin topics of Number Theory: the reverse question, a harder case
// or a common trap. See `deeperNumberTheoryThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { ask, divisors, factorize, isPrime, orderMod, point, powMod, primesUpTo, totient } from "../university-kit.ts";
import { gcd } from "./deeper-methods-of-proof-third.ts";
import { type Miss, pw, until, worked } from "./number-theory-course.ts";

/** legendre evaluates the Legendre symbol by Euler's criterion. */
const legendre = (a: number, p: number) => {
  const value = powMod(((a % p) + p) % p, (p - 1) / 2, p);
  return value === p - 1 ? -1 : value;
};
/** symbol writes a Legendre or Jacobi symbol. */
const symbol = (a: number | string, p: number | string) => `\\left(\\frac{${a}}{${p}}\\right)`;
/** oddPrimes lists the odd primes from a lower bound to an upper bound. */
const oddPrimes = (low: number, high: number) => primesUpTo(high).filter((p) => p >= low && p > 2);
/** isSquare tells whether a nonnegative integer is a perfect square. */
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

/** negativePell lists values of d below 200 with the smallest y solving x^2 - dy^2 = -1 for y below 1000. */
const negativePell: readonly (readonly [number, number, number])[] = [...Array(198).keys()]
  .map((i) => i + 2)
  .filter((d) => !isSquare(d))
  .flatMap((d) => {
    for (let y = 1; y < 1000; y++) {
      const square = d * y * y - 1;
      if (isSquare(square)) return [[d, Math.round(Math.sqrt(square)), y] as const];
    }
    return [];
  });

const fibonacciPeriod = point(
  "fibonacci-remainders-repeat",
  ["Fibonacci remainders repeat", "斐波那契余数的循环"],
  [
    "Modulo $m$, a Fibonacci number depends only on the two before it, and there are finitely many pairs of remainders, so the remainders repeat. Once the length of the cycle is known, a very distant term can be found by reducing its index modulo this length.",
    "模 $m$ 时，斐波那契数只取决于它前面的两项，而余数对只有有限多个，所以余数会循环。一旦知道循环长度，就可以把下标模这个长度化简，从而求出很远的项。",
  ],
  (rng) => {
    const m = rng.int(3, 12);
    const k = rng.int(30, 2000);
    const values = [0, 1];
    let period = 0;
    for (let i = 2; period === 0; i++) {
      values.push(((values[i - 1] as number) + (values[i - 2] as number)) % m);
      if (values[i - 1] === 0 && values[i] === 1) period = i - 1;
    }
    const r = k % period;
    const answer = values[r] as number;
    return ask(
      [
        `With $F_1 = F_2 = 1$, the remainders of the Fibonacci numbers modulo $${m}$ repeat with period $${period}$. What is the remainder of $F_{${k}}$ when divided by $${m}$?`,
        `设 $F_1 = F_2 = 1$，斐波那契数模 $${m}$ 的余数以 $${period}$ 为周期循环。$F_{${k}}$ 除以 $${m}$ 的余数是多少？`,
      ],
      answer,
      [k % m, values[r + 1] as number, r % m],
      [
        `Since $${k} \\equiv ${r} \\pmod{${period}}$, the term has the same remainder as $F_{${r}}$${r === 0 ? ", taken as $F_0 = 0$" : ""}. That remainder is $${answer}$.`,
        `由于 $${k} \\equiv ${r} \\pmod{${period}}$，这一项与 $F_{${r}}$${r === 0 ? "（取 $F_0 = 0$）" : ""}的余数相同。这个余数是 $${answer}$。`,
      ],
    );
  },
);

const singularLift = point(
  "lifting-when-the-derivative-vanishes",
  ["Lifting when the derivative vanishes", "导数为零时的提升"],
  [
    "Hensel's lemma gives a unique lift only when $f'(r) \\not\\equiv 0 \\pmod{p}$. When the derivative vanishes, $f(r + pk) \\equiv f(r) \\pmod{p^{2}}$ for every $k$. So either every one of the $p$ candidates is a lift, or none of them is.",
    "只有当 $f'(r) \\not\\equiv 0 \\pmod{p}$ 时，亨泽尔引理才给出唯一的提升。当导数为零时，对每个 $k$ 都有 $f(r + pk) \\equiv f(r) \\pmod{p^{2}}$。所以要么 $p$ 个候选全都是提升，要么一个都不是。",
  ],
  (rng) => {
    const p = rng.pick([3, 5, 7]);
    const r = rng.int(1, p - 1);
    const t = rng.bool() ? p * rng.int(0, 1) : rng.int(1, p - 1);
    const c = r * r + p * t;
    const f = poly([1, "x^{2}"], [-2 * r, "x"], [c, ""]);
    const answer = [...Array(p).keys()].filter((k) => (p * p * k * k + p * t) % (p * p) === 0).length;
    return ask(
      [
        `Let $f(x) = ${f}$. Then $f(${r}) \\equiv 0$ and $f'(${r}) \\equiv 0 \\pmod{${p}}$. How many solutions of $f(x) \\equiv 0 \\pmod{${p * p}}$ with $0 \\le x < ${p * p}$ satisfy $x \\equiv ${r} \\pmod{${p}}$?`,
        `设 $f(x) = ${f}$。则 $f(${r}) \\equiv 0$ 且 $f'(${r}) \\equiv 0 \\pmod{${p}}$。满足 $0 \\le x < ${p * p}$ 和 $x \\equiv ${r} \\pmod{${p}}$ 的 $f(x) \\equiv 0 \\pmod{${p * p}}$ 的解有多少个？`,
      ],
      answer,
      [1, 2, answer === 0 ? p : 0],
      answer === 0
        ? [
            `Every candidate $x = ${r} + ${p}k$ has $f(x) \\equiv f(${r}) = ${p * t} \\pmod{${p * p}}$, which is not zero, so no candidate is a solution.`,
            `每个候选 $x = ${r} + ${p}k$ 都满足 $f(x) \\equiv f(${r}) = ${p * t} \\pmod{${p * p}}$，它不为零，所以没有候选是解。`,
          ]
        : [
            `Every candidate $x = ${r} + ${p}k$ has $f(x) \\equiv f(${r}) = ${p * t} \\pmod{${p * p}}$, which is zero, so all $${p}$ candidates are solutions.`,
            `每个候选 $x = ${r} + ${p}k$ 都满足 $f(x) \\equiv f(${r}) = ${p * t} \\pmod{${p * p}}$，它为零，所以全部 $${p}$ 个候选都是解。`,
          ],
    );
  },
);

const orderOfResidue = point(
  "when-the-powers-first-return-to-one",
  ["When the powers first return to one", "幂何时首次回到一"],
  [
    "If $a$ is coprime to $n$, the remainders of its powers eventually reach $1$. The first exponent where this happens is the order of $a$, and then the remainders repeat. The order divides $\\varphi(n)$ but is often smaller, so it has to be found directly. Modulo $7$, the powers of $2$ leave $2, 4, 1$, so the order of $2$ is $3$, although $\\varphi(7) = 6$.\n\nCheck: $3$ divides $6$, and indeed $2^{6} = 64 = 9 \\times 7 + 1$ is $1$ again, the second time round.\n\n> **Watch out.** Euler's theorem says that $a^{\\varphi(n)} \\equiv 1$, but the order is the first exponent that gives $1$, and it can be a proper divisor of $\\varphi(n)$.",
    "如果 $a$ 与 $n$ 互素，它的幂的余数最终会到达 $1$。首次到达的指数就是 $a$ 的阶，之后余数开始循环。阶整除 $\\varphi(n)$，但常常更小，所以必须直接求出。模 $7$ 时，$2$ 的幂的余数是 $2, 4, 1$，所以 $2$ 的阶是 $3$，尽管 $\\varphi(7) = 6$。\n\n检验：$3$ 整除 $6$，而且 $2^{6} = 64 = 9 \\times 7 + 1$ 确实又是 $1$，这是第二次回到 $1$。\n\n> **注意。** 欧拉定理说 $a^{\\varphi(n)} \\equiv 1$，但阶是第一个给出 $1$ 的指数，它可能是 $\\varphi(n)$ 的真因数。",
  ],
  (rng) =>
    until(() => {
      const n = rng.int(7, 30);
      let a = rng.int(2, n - 2);
      while (gcd(a, n) !== 1) a = a === n - 2 ? 2 : a + 1;
      const answer = orderMod(a, n);
      const phi = totient(n);
      const powers = [...Array(answer).keys()].map((i) => powMod(a, i + 1, n));
      const misses: Miss[] = [
        [
          phi,
          `$\\varphi(${n}) = ${phi}$ always gives $1$ by Euler's theorem, but $1$ comes earlier, at $k = ${answer}$.`,
          `由欧拉定理，$\\varphi(${n}) = ${phi}$ 总能给出 $1$，但 $1$ 更早出现，在 $k = ${answer}$。`,
        ],
        [
          n - 1,
          `That uses $n - 1$, as in Fermat's theorem; the order is the first exponent that gives $1$, and it divides $\\varphi(${n}) = ${phi}$.`,
          `那用了费马定理中的 $n - 1$；阶是第一个给出 $1$ 的指数，它整除 $\\varphi(${n}) = ${phi}$。`,
        ],
        [
          2 * answer,
          `That is the second time the powers return to $1$; the first is at $k = ${answer}$.`,
          `那是幂第二次回到 $1$；第一次在 $k = ${answer}$。`,
        ],
      ];
      return worked(
        [
          `What is the smallest positive $k$ with $${a}^{k} \\equiv 1 \\pmod{${n}}$?`,
          `满足 $${a}^{k} \\equiv 1 \\pmod{${n}}$ 的最小正整数 $k$ 是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Multiply and reduce", "相乘并约化"],
            [
              `Multiplying by $${a}$ each time and reducing modulo $${n}$, the powers $${a}, ${a}^{2}, \\ldots$ leave $${powers.join(", ")}$.`,
              `每次乘以 $${a}$ 并模 $${n}$ 约化，幂 $${a}, ${a}^{2}, \\ldots$ 的余数依次是 $${powers.join(", ")}$。`,
            ],
          ],
          [
            ["Find the first 1", "找第一个 1"],
            [`The value $1$ first appears at $k = ${answer}$.`, `$1$ 首次出现在 $k = ${answer}$。`],
          ],
        ],
        [
          `$${answer}$ divides $\\varphi(${n}) = ${phi}$, as an order must: $${phi} = ${answer} \\times ${phi / answer}$.`,
          `$${answer}$ 整除 $\\varphi(${n}) = ${phi}$，阶理应如此：$${phi} = ${answer} \\times ${phi / answer}$。`,
        ],
      );
    }),
);

const fermatSum = point(
  "a-sum-of-powers-modulo-a-prime",
  ["A sum of powers modulo a prime", "模素数的幂和"],
  [
    "By Fermat's little theorem, $k^{p - 1} \\equiv 1 \\pmod{p}$ when $p$ does not divide $k$, but the multiples of $p$ contribute $0$. So a sum of such powers counts the terms that are not multiples of $p$. For $1^{4} + 2^{4} + \\cdots + 13^{4}$ modulo $5$, the bases $5$ and $10$ contribute $0$ and the other $11$ contribute $1$ each, so the remainder is that of $11$, which is $1$.\n\nCheck: $1^{4} = 1$, $2^{4} = 16$, $3^{4} = 81$ and $4^{4} = 256$ all leave $1$ modulo $5$, as Fermat's theorem says.\n\n> **Watch out.** Do not count every term as $1$: the multiples of $p$ give $0$, and forgetting them gives the wrong remainder.",
    "由费马小定理，当 $p$ 不整除 $k$ 时，$k^{p - 1} \\equiv 1 \\pmod{p}$，但 $p$ 的倍数贡献 $0$。所以这样的幂和就是在数不是 $p$ 的倍数的项。对 $1^{4} + 2^{4} + \\cdots + 13^{4}$ 模 $5$，底数 $5$ 和 $10$ 贡献 $0$，其余 $11$ 个各贡献 $1$，所以余数就是 $11$ 的余数 $1$。\n\n检验：$1^{4} = 1$，$2^{4} = 16$，$3^{4} = 81$，$4^{4} = 256$ 模 $5$ 都余 $1$，与费马定理相符。\n\n> **注意。** 不要把每一项都算作 $1$：$p$ 的倍数给出 $0$，忘了它们就会得到错误的余数。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick([5, 7, 11, 13, 17, 19, 23]);
      const N = rng.int(p + 3, 100);
      const multiples = Math.floor(N / p);
      const count = N - multiples;
      const answer = count % p;
      const left = N % p;
      const misses: Miss[] = [
        [
          N % p,
          `That counts all $${N}$ terms as $1$; the $${multiples}$ multiples of $${p}$ contribute $0$.`,
          `那把全部 $${N}$ 项都算作 $1$；$${p}$ 的 $${multiples}$ 个倍数贡献 $0$。`,
        ],
        [
          multiples % p,
          `That counts the multiples of $${p}$, which are the terms that contribute $0$, instead of the others.`,
          `那数的是 $${p}$ 的倍数，正是贡献 $0$ 的项，而不是其余的项。`,
        ],
        [
          count,
          `$${count}$ is the number of terms that contribute $1$, but it still has to be reduced modulo $${p}$.`,
          `$${count}$ 是贡献 $1$ 的项数，但还要模 $${p}$ 约化。`,
        ],
      ];
      return worked(
        [
          `What is the remainder of $1^{${p - 1}} + 2^{${p - 1}} + \\cdots + ${N}^{${p - 1}}$ when divided by $${p}$?`,
          `$1^{${p - 1}} + 2^{${p - 1}} + \\cdots + ${N}^{${p - 1}}$ 除以 $${p}$ 的余数是多少？`,
        ],
        answer,
        misses,
        [
          [
            ["Set aside the multiples", "除去倍数"],
            [
              `$${p}$ divides $${multiples}$ of the bases from $1$ to $${N}$, and their terms are $0$ modulo $${p}$.`,
              `从 $1$ 到 $${N}$ 的底数中有 $${multiples}$ 个被 $${p}$ 整除，它们的项模 $${p}$ 为 $0$。`,
            ],
          ],
          [
            ["Apply Fermat's theorem", "应用费马定理"],
            [
              `Each of the other $${N} - ${multiples} = ${count}$ terms is $1$ modulo $${p}$.`,
              `其余 $${N} - ${multiples} = ${count}$ 项模 $${p}$ 各为 $1$。`,
            ],
          ],
          [
            ["Reduce", "约化"],
            [
              `$${count} = ${Math.floor(count / p)} \\times ${p} + ${answer}$.`,
              `$${count} = ${Math.floor(count / p)} \\times ${p} + ${answer}$。`,
            ],
          ],
        ],
        [
          `Group the bases in blocks of $${p}$: each of the $${multiples}$ full blocks gives $${p - 1} \\equiv -1$, and the $${left}$ bases left over give $${left}$, so the sum is $${left} - ${multiples} \\equiv ${answer} \\pmod{${p}}$.`,
          `把底数每 $${p}$ 个分为一组：$${multiples}$ 个完整组各给出 $${p - 1} \\equiv -1$，剩下的 $${left}$ 个底数给出 $${left}$，所以和是 $${left} - ${multiples} \\equiv ${answer} \\pmod{${p}}$。`,
        ],
      );
    }),
);

const dirichletClasses = point(
  "how-many-classes-hold-infinitely-many-primes",
  ["How many classes hold infinitely many primes", "多少个剩余类含无穷多素数"],
  [
    "If $\\gcd(a, m) = d > 1$, then every number in the class of $a$ modulo $m$ is a multiple of $d$, so the class holds at most one prime. Dirichlet's theorem says that each of the other classes holds infinitely many, and these classes number $\\varphi(m)$.",
    "如果 $\\gcd(a, m) = d > 1$，那么 $a$ 模 $m$ 的剩余类中每个数都是 $d$ 的倍数，所以这个类至多含一个素数。狄利克雷定理说其余每个类都含无穷多个素数，这些类共有 $\\varphi(m)$ 个。",
  ],
  (rng) => {
    let m = rng.int(6, 120);
    while (isPrime(m)) m++;
    const answer = totient(m);
    return ask(
      [
        `Of the $${m}$ residue classes modulo $${m}$, how many contain infinitely many primes?`,
        `在模 $${m}$ 的 $${m}$ 个剩余类中，有多少个含有无穷多个素数？`,
      ],
      answer,
      [m - 1, m, primesUpTo(m).length],
      [
        `Exactly the classes of residues coprime to $${m}$ qualify, by Dirichlet's theorem, and each other class holds at most one prime. The count is $\\varphi(${m}) = ${answer}$.`,
        `由狄利克雷定理，恰好是与 $${m}$ 互素的余数对应的类符合条件，其他每个类至多含一个素数。个数是 $\\varphi(${m}) = ${answer}$。`,
      ],
    );
  },
);

const totientPreimages = point(
  "solving-an-equation-in-the-totient",
  ["Solving an equation in the totient", "解关于欧拉函数的方程"],
  [
    "Going backward from a value of $\\varphi$ is harder than computing it. Several numbers can share a totient, and some even numbers are not totients at all. Since $\\frac{n}{\\varphi(n)}$ stays small, only finitely many $n$ need to be checked for any given value. For $\\varphi(n) = 4$ the solutions are $5, 8, 10, 12$, four of them.\n\nCheck: $\\varphi(5) = 4$, $\\varphi(8) = 8 \\cdot \\frac{1}{2} = 4$, $\\varphi(10) = 1 \\times 4 = 4$ and $\\varphi(12) = 12 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 4$.\n\n> **Watch out.** Do not stop at the first solution: when $m$ is odd, $2m$ has the same totient as $m$, so solutions often come in pairs. And an even value can have no solution at all, as $\\varphi(n) = 14$ shows.",
    "从 $\\varphi$ 的值反推比计算它更难。几个数可以有相同的欧拉函数值，而有些偶数根本不是欧拉函数值。由于 $\\frac{n}{\\varphi(n)}$ 总是较小，对给定的值只需检验有限多个 $n$。对 $\\varphi(n) = 4$，解是 $5, 8, 10, 12$，共四个。\n\n检验：$\\varphi(5) = 4$，$\\varphi(8) = 8 \\cdot \\frac{1}{2} = 4$，$\\varphi(10) = 1 \\times 4 = 4$，$\\varphi(12) = 12 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 4$。\n\n> **注意。** 不要在找到第一个解时就停下：当 $m$ 是奇数时，$2m$ 与 $m$ 的欧拉函数值相同，所以解常常成对出现。而一个偶数值也可能根本没有解，例如 $\\varphi(n) = 14$。",
  ],
  (rng) =>
    until(() => {
      const k = 2 * rng.int(1, 30);
      const list = [...Array(6 * k).keys()].map((i) => i + 1).filter((n) => totient(n) === k);
      const answer = list.length;
      const odd = list.filter((n) => n % 2 === 1).length;
      const last = list[list.length - 1] ?? 0;
      const misses: Miss[] =
        answer === 0
          ? [
              [
                1,
                `That assumes every even number is a value of $\\varphi$; checking every candidate finds none with $\\varphi(n) = ${k}$.`,
                `那假定每个偶数都是 $\\varphi$ 的值；逐一检验所有候选，没有一个满足 $\\varphi(n) = ${k}$。`,
              ],
              [
                2,
                "That assumes the solutions come in a pair $m$ and $2m$; here there is nothing to pair.",
                "那假定解成对出现，即 $m$ 和 $2m$；这里根本没有可以配对的解。",
              ],
            ]
          : [
              [
                odd,
                "That counts only the odd solutions; when $m$ is odd, $2m$ has the same totient.",
                "那只数了奇数解；当 $m$ 是奇数时，$2m$ 的欧拉函数值相同。",
              ],
              [answer - 1, `That misses one of the solutions, often the largest, $${last}$.`, `那漏掉了一个解，往往是最大的 $${last}$。`],
              [
                0,
                `That assumes there is no solution, but $\\varphi(${list[0]}) = ${k}$.`,
                `那假定没有解，但 $\\varphi(${list[0]}) = ${k}$。`,
              ],
            ];
      const phiOf = (n: number) =>
        `\\varphi(${n}) = ${n}${factorize(n)
          .map(([p]) => ` \\cdot \\frac{${p - 1}}{${p}}`)
          .join("")} = ${totient(n)}`;
      return worked(
        [`How many positive integers $n$ satisfy $\\varphi(n) = ${k}$?`, `有多少个正整数 $n$ 满足 $\\varphi(n) = ${k}$？`],
        answer,
        misses,
        [
          [
            ["Bound the search", "限定搜索范围"],
            [
              `$\\frac{n}{\\varphi(n)}$ stays small for numbers of this size, so every solution lies below $6 \\times ${k} = ${6 * k}$.`,
              `对这样大小的数，$\\frac{n}{\\varphi(n)}$ 都较小，所以每个解都小于 $6 \\times ${k} = ${6 * k}$。`,
            ],
          ],
          [
            ["Check the candidates", "检验候选"],
            answer === 0
              ? [
                  `No $n$ below $${6 * k}$ has $\\varphi(n) = ${k}$, so the count is $0$.`,
                  `小于 $${6 * k}$ 的 $n$ 中没有满足 $\\varphi(n) = ${k}$ 的，所以个数是 $0$。`,
                ]
              : [`The solutions are $${list.join(", ")}$, which makes $${answer}$.`, `解是 $${list.join(", ")}$，共 $${answer}$ 个。`],
          ],
        ],
        answer === 0
          ? [
              `If $${k} + 1 = ${k + 1}$ were prime it would be a solution, but it is not: $${phiOf(k + 1)}$.`,
              `如果 $${k} + 1 = ${k + 1}$ 是素数，它就是一个解，但它不是：$${phiOf(k + 1)}$。`,
            ]
          : [`For the largest one, $${phiOf(last)}$.`, `对最大的那个解，$${phiOf(last)}$。`],
      );
    }),
);

const fareyNeighbor = point(
  "the-right-neighbor-in-a-farey-sequence",
  ["The right neighbor in a Farey sequence", "法里数列中的右邻"],
  [
    "Consecutive fractions $\\frac{a}{b} < \\frac{c}{d}$ in a Farey sequence satisfy $bc - ad = 1$. So the neighbor of a given fraction solves this equation, with $d$ as large as the order allows. The mediant is not the neighbor unless its denominator also fits within the order.",
    "法里数列中相邻的分数 $\\frac{a}{b} < \\frac{c}{d}$ 满足 $bc - ad = 1$。所以给定分数的邻居是这个方程的解，其中 $d$ 在阶数允许的范围内尽可能大。中间分数不一定是邻居，除非它的分母也不超过阶数。",
  ],
  (rng) => {
    const n = rng.int(5, 15);
    const b = rng.int(2, n);
    let a = rng.int(1, b - 1);
    while (gcd(a, b) !== 1) a = a === b - 1 ? 1 : a + 1;
    let c = 1;
    let d = 1;
    for (let q = 1; q <= n; q++) {
      const top = Math.floor((a * q) / b) + 1;
      if (top * d < c * q) {
        c = top;
        d = q;
      }
    }
    return ask(
      [
        `In the Farey sequence of order $${n}$, what is the denominator of the fraction immediately after $\\frac{${a}}{${b}}$?`,
        `在 $${n}$ 阶法里数列中，紧接在 $\\frac{${a}}{${b}}$ 之后的分数的分母是多少？`,
      ],
      d,
      [d === n ? n - 1 : n, b + d, b === d ? d + 1 : b],
      [
        `The next fraction is $\\frac{${c}}{${d}}$. The check $${b} \\cdot ${c} - ${a} \\cdot ${d} = 1$ holds, and $${d}$ is the largest denominator up to $${n}$ for which it does.`,
        `下一个分数是 $\\frac{${c}}{${d}}$。验证 $${b} \\cdot ${c} - ${a} \\cdot ${d} = 1$ 成立，而且 $${d}$ 是不超过 $${n}$ 的分母中满足这个等式的最大者。`,
      ],
    );
  },
);

const powerTower = point(
  "a-tower-of-exponents",
  ["A tower of exponents", "指数塔"],
  [
    "In a tower $a^{b^{c}}$, the exponent is enormous, but it matters only modulo $\\varphi(n)$ when $a$ is coprime to $n$. So the top of the tower is reduced with one modulus, and the resulting power of $a$ is then computed with another. For $3^{2^{5}}$ modulo $7$: $\\varphi(7) = 6$ and $2^{5} = 32 = 5 \\times 6 + 2$, so the remainder is that of $3^{2} = 9$, which is $2$.\n\nCheck: squaring again and again, $3^{2} \\equiv 2$, $3^{4} \\equiv 4$, $3^{8} \\equiv 2$, $3^{16} \\equiv 4$ and $3^{32} \\equiv 16 \\equiv 2 \\pmod{7}$.\n\n> **Watch out.** Reduce the exponent modulo $\\varphi(n)$, not modulo $n$, and read $b^{c}$ as a power, not as the product $bc$.",
    "在指数塔 $a^{b^{c}}$ 中，指数非常大，但当 $a$ 与 $n$ 互素时，它只在模 $\\varphi(n)$ 下起作用。所以先用一个模数化简塔顶，再用另一个模数计算所得的 $a$ 的幂。对 $3^{2^{5}}$ 模 $7$：$\\varphi(7) = 6$，$2^{5} = 32 = 5 \\times 6 + 2$，所以余数就是 $3^{2} = 9$ 的余数 $2$。\n\n检验：反复平方，$3^{2} \\equiv 2$，$3^{4} \\equiv 4$，$3^{8} \\equiv 2$，$3^{16} \\equiv 4$，$3^{32} \\equiv 16 \\equiv 2 \\pmod{7}$。\n\n> **注意。** 指数要模 $\\varphi(n)$ 约化，不是模 $n$；并且 $b^{c}$ 是幂，不是乘积 $bc$。",
  ],
  (rng) =>
    until(() => {
      const n = rng.pick([7, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20]);
      let a = rng.int(2, n - 1);
      while (gcd(a, n) !== 1) a = a === n - 1 ? 2 : a + 1;
      const b = rng.int(2, 9);
      const c = rng.int(2, 9);
      const phi = totient(n);
      const top = b ** c;
      const e = top % phi;
      const answer = powMod(a, e, n);
      const order = orderMod(a, n);
      const misses: Miss[] = [
        [
          powMod(a, b * c, n),
          `That reads the exponent $${b}^{${c}}$ as the product $${b} \\times ${c} = ${b * c}$.`,
          `那把指数 $${b}^{${c}}$ 当成了乘积 $${b} \\times ${c} = ${b * c}$。`,
        ],
        [
          powMod(a, top % n, n),
          `That reduces the exponent modulo $${n}$; exponents repeat modulo $\\varphi(${n}) = ${phi}$, not modulo $${n}$.`,
          `那把指数模 $${n}$ 约化了；指数是模 $\\varphi(${n}) = ${phi}$ 循环，不是模 $${n}$。`,
        ],
        [
          e % n,
          `$${e}$ is the reduced exponent, not the power; $${a}$ still has to be raised to it.`,
          `$${e}$ 是约化后的指数，不是幂；还要把 $${a}$ 升到这个次幂。`,
        ],
        [
          powMod(a, b + c, n),
          `That adds $${b}$ and $${c}$ instead of raising $${b}$ to the power $${c}$.`,
          `那是把 $${b}$ 和 $${c}$ 相加，而不是求 $${b}$ 的 $${c}$ 次幂。`,
        ],
      ];
      return worked(
        [`What is the remainder of $${a}^{${b}^{${c}}}$ when divided by $${n}$?`, `$${a}^{${b}^{${c}}}$ 除以 $${n}$ 的余数是多少？`],
        answer,
        misses,
        [
          [
            ["Reduce the top", "化简塔顶"],
            [
              `$\\gcd(${a}, ${n}) = 1$ and $\\varphi(${n}) = ${phi}$, so only $${b}^{${c}} = ${top}$ modulo $${phi}$ matters: $${top} = ${Math.floor(top / phi)} \\times ${phi} + ${e}$.`,
              `$\\gcd(${a}, ${n}) = 1$，$\\varphi(${n}) = ${phi}$，所以只需 $${b}^{${c}} = ${top}$ 模 $${phi}$ 的值：$${top} = ${Math.floor(top / phi)} \\times ${phi} + ${e}$。`,
            ],
          ],
          [
            ["Compute the power", "计算幂"],
            [`$${pw(a, e)} \\equiv ${answer} \\pmod{${n}}$.`, `$${pw(a, e)} \\equiv ${answer} \\pmod{${n}}$。`],
          ],
        ],
        [
          `The order of $${a}$ modulo $${n}$ is $${order}$, and $${top} \\equiv ${top % order} \\pmod{${order}}$, so the power is also $${pw(a, top % order)} \\equiv ${powMod(a, top % order, n)}$.`,
          `$${a}$ 模 $${n}$ 的阶是 $${order}$，而 $${top} \\equiv ${top % order} \\pmod{${order}}$，所以这个幂也等于 $${pw(a, top % order)} \\equiv ${powMod(a, top % order, n)}$。`,
        ],
      );
    }),
);

const halfFactorial = point(
  "the-square-of-half-the-factorial",
  ["The square of half the factorial", "一半阶乘的平方"],
  [
    "Pairing $k$ with $p - k \\equiv -k$ in Wilson's theorem gives $(p - 1)! \\equiv (-1)^{h}(h!)^{2}$, where $h = \\frac{p - 1}{2}$. So $(h!)^{2}$ is $-1$ modulo $p$ when $p \\equiv 1 \\pmod{4}$, which gives a square root of $-1$, and it is $1$ otherwise. For $p = 13$, $h = 6$ and $6! = 720 = 55 \\times 13 + 5$, and $5^2 = 25 = 13 + 12$, so $(6!)^{2} \\equiv 12 \\equiv -1$.\n\nCheck: for $p = 7$, $h = 3$ is odd, and $3! = 6 \\equiv -1$, whose square is $1$, as the rule says for $7 \\equiv 3 \\pmod{4}$.\n\n> **Watch out.** The sign comes from $(-1)^{h}$, so look at whether $h$ is even or odd; and write $-1$ as the remainder $p - 1$.",
    "在威尔逊定理中把 $k$ 与 $p - k \\equiv -k$ 配对，得 $(p - 1)! \\equiv (-1)^{h}(h!)^{2}$，其中 $h = \\frac{p - 1}{2}$。所以当 $p \\equiv 1 \\pmod{4}$ 时，$(h!)^{2}$ 模 $p$ 为 $-1$，这给出了 $-1$ 的平方根；否则它为 $1$。对 $p = 13$，$h = 6$，$6! = 720 = 55 \\times 13 + 5$，而 $5^2 = 25 = 13 + 12$，所以 $(6!)^{2} \\equiv 12 \\equiv -1$。\n\n检验：对 $p = 7$，$h = 3$ 是奇数，$3! = 6 \\equiv -1$，它的平方是 $1$，与 $7 \\equiv 3 \\pmod{4}$ 时的规则相符。\n\n> **注意。** 符号来自 $(-1)^{h}$，所以要看 $h$ 是偶数还是奇数；并且 $-1$ 要写成余数 $p - 1$。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick(oddPrimes(5, 199));
      const h = (p - 1) / 2;
      const answer = p % 4 === 1 ? p - 1 : 1;
      let f = 1;
      for (let k = 2; k <= h; k++) f = (f * k) % p;
      const misses: Miss[] = [
        [
          answer === 1 ? p - 1 : 1,
          `That takes the sign of $(-1)^{${h}}$ the wrong way round: $${h}$ is ${h % 2 === 0 ? "even" : "odd"}.`,
          `那把 $(-1)^{${h}}$ 的符号弄反了：$${h}$ 是${h % 2 === 0 ? "偶数" : "奇数"}。`,
        ],
        [h, `That is $h = ${h}$ itself, not the square of $${h}!$.`, `那是 $h = ${h}$ 本身，而不是 $${h}!$ 的平方。`],
        [
          0,
          `$${p}$ does not divide $${h}!$, because every factor of $${h}!$ is smaller than $${p}$.`,
          `$${p}$ 不整除 $${h}!$，因为 $${h}!$ 的每个因数都小于 $${p}$。`,
        ],
      ];
      return worked(
        [`What is the remainder of $(${h}!)^{2}$ when divided by $${p}$?`, `$(${h}!)^{2}$ 除以 $${p}$ 的余数是多少？`],
        answer,
        misses,
        [
          [
            ["Pair the factors", "给因数配对"],
            [
              `In $(${p - 1})!$, pair $k$ with $${p} - k \\equiv -k$ for $k$ up to $${h}$: $(${p - 1})! \\equiv (-1)^{${h}} (${h}!)^{2}$.`,
              `在 $(${p - 1})!$ 中，对不超过 $${h}$ 的 $k$，把 $k$ 与 $${p} - k \\equiv -k$ 配对：$(${p - 1})! \\equiv (-1)^{${h}} (${h}!)^{2}$。`,
            ],
          ],
          [
            ["Use Wilson's theorem", "应用威尔逊定理"],
            [
              `$(${p - 1})! \\equiv -1$, so $(${h}!)^{2} \\equiv ${h % 2 === 0 ? "-1" : "1"}$, since $${h}$ is ${h % 2 === 0 ? "even" : "odd"}; the remainder is $${answer}$.`,
              `$(${p - 1})! \\equiv -1$，所以 $(${h}!)^{2} \\equiv ${h % 2 === 0 ? "-1" : "1"}$，因为 $${h}$ 是${h % 2 === 0 ? "偶数" : "奇数"}；余数是 $${answer}$。`,
            ],
          ],
        ],
        [
          `Multiplying out modulo $${p}$, $${h}! \\equiv ${f}$, and $${f}^2 = ${f * f} = ${Math.floor((f * f) / p)} \\times ${p} + ${(f * f) % p}$.`,
          `模 $${p}$ 连乘得 $${h}! \\equiv ${f}$，而 $${f}^2 = ${f * f} = ${Math.floor((f * f) / p)} \\times ${p} + ${(f * f) % p}$。`,
        ],
      );
    }),
);

const sigmaValue = point(
  "the-sum-of-divisors-from-a-factorization",
  ["The sum of divisors from a factorization", "由分解式求因数和"],
  [
    "The sum of divisors $\\sigma$ is multiplicative, so it can be computed separately on each prime power and multiplied. On a prime power, $\\sigma(p^{a}) = 1 + p + \\cdots + p^{a}$, and listing the divisors would take much longer once the number has many of them. For $72 = 2^{3} \\cdot 3^{2}$: $\\sigma(8) = 1 + 2 + 4 + 8 = 15$ and $\\sigma(9) = 1 + 3 + 9 = 13$, so $\\sigma(72) = 15 \\cdot 13 = 195$.\n\nCheck: the twelve divisors $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$ add up to $195$.\n\n> **Watch out.** Multiply the sums for the prime powers, do not add them; and $(a + 1)(b + 1)$ counts the divisors, it does not add them.",
    "因数和函数 $\\sigma$ 是可乘的，所以可以在每个素数幂上分别计算再相乘。在素数幂上，$\\sigma(p^{a}) = 1 + p + \\cdots + p^{a}$，当数的因数很多时，逐一列出因数要慢得多。对 $72 = 2^{3} \\cdot 3^{2}$：$\\sigma(8) = 1 + 2 + 4 + 8 = 15$，$\\sigma(9) = 1 + 3 + 9 = 13$，所以 $\\sigma(72) = 15 \\cdot 13 = 195$。\n\n检验：十二个因数 $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$ 之和是 $195$。\n\n> **注意。** 各素数幂的和要相乘，不是相加；而 $(a + 1)(b + 1)$ 是因数的个数，不是因数之和。",
  ],
  (rng) =>
    until(() => {
      const [p, q] = rng.sample([2, 3, 5, 7, 11, 13], 2).sort((x, y) => x - y) as [number, number];
      const a = rng.int(1, p <= 3 ? 3 : p === 5 ? 2 : 1);
      const b = rng.int(1, q <= 5 ? 2 : 1);
      const n = p ** a * q ** b;
      const sumP = (p ** (a + 1) - 1) / (p - 1);
      const sumQ = (q ** (b + 1) - 1) / (q - 1);
      const answer = sumP * sumQ;
      const terms = (r: number, e: number) => Array.from({ length: e + 1 }, (_, i) => (i === 0 ? "1" : pw(r, i))).join(" + ");
      const misses: Miss[] = [
        [n + 1, `That adds only $1$ and $${n}$, as if $${n}$ were prime.`, `那只加了 $1$ 和 $${n}$，好像 $${n}$ 是素数。`],
        [(a + 1) * (b + 1), "That is the number of divisors, not their sum.", "那是因数的个数，不是因数之和。"],
        [
          sumP + sumQ,
          `That adds $\\sigma(${pw(p, a)})$ and $\\sigma(${pw(q, b)})$; for coprime parts the sums multiply.`,
          `那是把 $\\sigma(${pw(p, a)})$ 与 $\\sigma(${pw(q, b)})$ 相加；对互素的部分，和要相乘。`,
        ],
      ];
      return worked(
        [
          `Let $\\sigma(n)$ be the sum of the positive divisors of $n$. Find $\\sigma(${n})$.`,
          `设 $\\sigma(n)$ 是 $n$ 的所有正因数之和。求 $\\sigma(${n})$。`,
        ],
        answer,
        misses,
        [
          [
            ["Factor", "分解"],
            [`$${n} = ${pw(p, a)} \\cdot ${pw(q, b)}$.`, `$${n} = ${pw(p, a)} \\cdot ${pw(q, b)}$。`],
          ],
          [
            ["Sum each prime power", "对每个素数幂求和"],
            [
              `$\\sigma(${pw(p, a)}) = ${terms(p, a)} = ${sumP}$ and $\\sigma(${pw(q, b)}) = ${terms(q, b)} = ${sumQ}$.`,
              `$\\sigma(${pw(p, a)}) = ${terms(p, a)} = ${sumP}$，$\\sigma(${pw(q, b)}) = ${terms(q, b)} = ${sumQ}$。`,
            ],
          ],
          [
            ["Multiply", "相乘"],
            [`$${sumP} \\cdot ${sumQ} = ${answer}$.`, `$${sumP} \\cdot ${sumQ} = ${answer}$。`],
          ],
        ],
        [`The divisors $${divisors(n).join(", ")}$ add up to $${answer}$.`, `因数 $${divisors(n).join(", ")}$ 之和是 $${answer}$。`],
      );
    }),
);

const mobiusInversion = point(
  "recovering-a-function-by-mobius-inversion",
  ["Recovering a function by Mobius inversion", "用默比乌斯反演还原函数"],
  [
    "If $g(n) = \\sum_{d \\mid n} f(d)$ for all $n$, then $g = f * \\mathbf{1}$, and convolving with $\\mu$ recovers $f = \\mu * g$. When $g$ is multiplicative, so is $f$, which means that $f(n)$ can be computed on each prime power of $n$ and multiplied.",
    "如果对所有 $n$ 都有 $g(n) = \\sum_{d \\mid n} f(d)$，那么 $g = f * \\mathbf{1}$，与 $\\mu$ 卷积可还原 $f = \\mu * g$。当 $g$ 是可乘函数时，$f$ 也是，这意味着可以在 $n$ 的每个素数幂上计算 $f(n)$ 再相乘。",
  ],
  (rng) => {
    const e = rng.int(2, 3);
    const n = rng.int(6, 40);
    const parts = factorize(n).map(([p, a]) => (p ** a) ** e - (p ** (a - 1)) ** e);
    const answer = parts.reduce((x, y) => x * y, 1);
    return ask(
      [
        `A function $f$ satisfies $\\sum_{d \\mid n} f(d) = n^{${e}}$ for all positive integers $n$. Find $f(${n})$.`,
        `函数 $f$ 对所有正整数 $n$ 满足 $\\sum_{d \\mid n} f(d) = n^{${e}}$。求 $f(${n})$。`,
      ],
      answer,
      [n ** e - 1, totient(n) ** e, totient(n)],
      [
        `On a prime power, inversion gives $f(p^{a}) = (p^{a})^{${e}} - (p^{a - 1})^{${e}}$. For $${n}$ the factors are $${parts.join(", ")}$, and their product is $${answer}$.`,
        `在素数幂上，反演给出 $f(p^{a}) = (p^{a})^{${e}} - (p^{a - 1})^{${e}}$。对 $${n}$，各因子是 $${parts.join(", ")}$，它们的积是 $${answer}$。`,
      ],
    );
  },
);

const decimalDigit = point(
  "a-distant-digit-of-a-repeating-decimal",
  ["A distant digit of a repeating decimal", "循环小数中很远的数字"],
  [
    "A fraction with a purely repeating decimal has a digit pattern of fixed length, so the digit in a distant position depends only on the position modulo this length. A remainder of $0$ means the last digit of the repeating block, not the first.",
    "纯循环小数的数字模式长度固定，所以很远位置上的数字只取决于位置模这个长度的余数。余数为 $0$ 表示循环节的最后一个数字，而不是第一个。",
  ],
  (rng) => {
    const q = rng.pick([7, 13, 17, 19, 21, 23, 27, 29, 37, 41, 101]);
    let a = rng.int(1, q - 1);
    while (gcd(a, q) !== 1) a = a === q - 1 ? 1 : a + 1;
    const k = rng.int(20, 500);
    const L = orderMod(10, q);
    const digits: number[] = [];
    let r = a;
    for (let i = 0; i < L; i++) {
      digits.push(Math.floor((10 * r) / q));
      r = (10 * r) % q;
    }
    const at = (k - 1) % L;
    const answer = digits[at] as number;
    return ask(
      [
        `What is digit number $${k}$ after the decimal point in the decimal of $\\frac{${a}}{${q}}$?`,
        `$\\frac{${a}}{${q}}$ 的小数中，小数点后第 $${k}$ 位数字是多少？`,
      ],
      answer,
      [digits[(at + 1) % L] as number, digits[(at + L - 1) % L] as number, L % 10],
      [
        `The repeating block is $${digits.join("")}$, of length $${L}$. Position $${k}$ is place $${at + 1}$ of the block, and that digit is $${answer}$.`,
        `循环节是 $${digits.join("")}$，长度为 $${L}$。第 $${k}$ 位对应循环节的第 $${at + 1}$ 位，这个数字是 $${answer}$。`,
      ],
    );
  },
);

const fermatLiars = point(
  "counting-the-fermat-liars",
  ["Counting the Fermat liars", "计算费马说谎者"],
  [
    "A Fermat liar for a composite odd $n$ is a base $a$ coprime to $n$ with $a^{n - 1} \\equiv 1 \\pmod{n}$. Modulo each prime power of $n$, the number of solutions is $\\gcd(n - 1, p - 1)$, so the number of liars is the product of these over the primes $p$ dividing $n$.",
    "奇合数 $n$ 的费马说谎者是与 $n$ 互素且满足 $a^{n - 1} \\equiv 1 \\pmod{n}$ 的底 $a$。模 $n$ 的每个素数幂，解的个数是 $\\gcd(n - 1, p - 1)$，所以说谎者的个数是这些数对整除 $n$ 的素数 $p$ 之积。",
  ],
  (rng) => {
    let n = 2 * rng.int(7, 170) + 1;
    while (isPrime(n)) n += 2;
    const parts = factorize(n).map(([p]) => [p, gcd(n - 1, p - 1)] as const);
    const answer = parts.reduce((x, [, g]) => x * g, 1);
    const shown = parts.map(([p, g]) => `\\gcd(${n - 1}, ${p - 1}) = ${g}`).join(", ");
    return ask(
      [
        `How many bases $a$ with $1 \\le a < ${n}$ and $\\gcd(a, ${n}) = 1$ satisfy $a^{${n - 1}} \\equiv 1 \\pmod{${n}}$?`,
        `有多少个满足 $1 \\le a < ${n}$ 和 $\\gcd(a, ${n}) = 1$ 的底 $a$ 使得 $a^{${n - 1}} \\equiv 1 \\pmod{${n}}$？`,
      ],
      answer,
      [totient(n) === answer ? answer + 2 : totient(n), answer === 1 ? 2 : 1, answer + 1],
      [
        `The factors are $${shown}$. Their product gives $${answer}$ bases, counting the trivial ones.`,
        `各因子是 $${shown}$。它们的积给出 $${answer}$ 个底，其中包括平凡的底。`,
      ],
    );
  },
);

const quadraticCount = point(
  "the-number-of-roots-of-a-quadratic-modulo-a-prime",
  ["The number of roots of a quadratic modulo a prime", "模素数二次方程的根数"],
  [
    "Completing the square shows that $x^{2} + bx + c \\equiv 0 \\pmod{p}$ has as many roots as the discriminant $D = b^{2} - 4c$ has square roots. So the count is $1 + \\left(\\frac{D}{p}\\right)$, which is two, one or zero, and one occurs only when $p$ divides $D$. For $x^{2} + x + 1$ modulo $7$, $D = 1 - 4 = -3 \\equiv 4 = 2^{2}$, a nonzero square, so there are two roots.\n\nCheck: $x = 2$ gives $4 + 2 + 1 = 7$ and $x = 4$ gives $16 + 4 + 1 = 21$, both multiples of $7$.\n\n> **Watch out.** The count is $1 + \\left(\\frac{D}{p}\\right)$, not the symbol itself, and $D \\equiv 0$ gives one double root, not two.",
    "配方说明 $x^{2} + bx + c \\equiv 0 \\pmod{p}$ 的根数等于判别式 $D = b^{2} - 4c$ 的平方根个数。所以个数是 $1 + \\left(\\frac{D}{p}\\right)$，即二、一或零，而一只在 $p$ 整除 $D$ 时出现。对 $x^{2} + x + 1$ 模 $7$，$D = 1 - 4 = -3 \\equiv 4 = 2^{2}$，是非零平方数，所以有两个根。\n\n检验：$x = 2$ 给出 $4 + 2 + 1 = 7$，$x = 4$ 给出 $16 + 4 + 1 = 21$，都是 $7$ 的倍数。\n\n> **注意。** 个数是 $1 + \\left(\\frac{D}{p}\\right)$，而不是符号本身；$D \\equiv 0$ 时只有一个二重根，不是两个根。",
  ],
  (rng) =>
    until(() => {
      const p = rng.pick(oddPrimes(5, 43));
      const b = rng.int(0, p - 1);
      const c = rng.int(1, 4) === 1 ? (b * b * powMod(4, p - 2, p)) % p : rng.int(0, p - 1);
      const D = (((b * b - 4 * c) % p) + p) % p;
      const value = legendre(D, p);
      const answer = 1 + value;
      const f = poly([1, "x^{2}"], [b, "x"], [c, ""]);
      const roots = [...Array(p).keys()].filter((x) => (x * x + b * x + c) % p === 0);
      const misses: Miss[] = [
        [
          value,
          `That is the symbol $${symbol("D", p)}$ itself; the number of roots is $1$ plus it.`,
          `那是符号 $${symbol("D", p)}$ 本身；根的个数是 $1$ 加上它。`,
        ],
        [
          2,
          D === 0
            ? `$D \\equiv 0$, so the two roots of the formula coincide in one double root.`
            : "That assumes every quadratic has two roots; that happens only when $D$ is a nonzero square.",
          D === 0 ? `$D \\equiv 0$，所以公式给出的两个根重合为一个二重根。` : "那假定每个二次式都有两个根；只有 $D$ 是非零平方数时才如此。",
        ],
        [
          answer === 0 ? 1 : 0,
          answer === 0
            ? `One root happens only when $${p}$ divides $D$, and here $D \\equiv ${D}$.`
            : "That treats $D$ as a non-residue; but it has a square root modulo the prime.",
          answer === 0 ? `只有 $${p}$ 整除 $D$ 时才有一个根，而这里 $D \\equiv ${D}$。` : "那把 $D$ 当成了非剩余；但它模这个素数有平方根。",
        ],
      ];
      return worked(
        [
          `How many roots does $${f} \\equiv 0 \\pmod{${p}}$ have with $0 \\le x < ${p}$?`,
          `$${f} \\equiv 0 \\pmod{${p}}$ 在 $0 \\le x < ${p}$ 内有多少个根？`,
        ],
        answer,
        misses,
        [
          [
            ["Find the discriminant", "求判别式"],
            [
              `$D = ${b}^{2} - 4 \\cdot ${c} = ${b * b - 4 * c} \\equiv ${D} \\pmod{${p}}$.`,
              `$D = ${b}^{2} - 4 \\cdot ${c} = ${b * b - 4 * c} \\equiv ${D} \\pmod{${p}}$。`,
            ],
          ],
          [
            ["Evaluate the symbol", "计算符号"],
            D === 0
              ? [`$${p}$ divides $D$, so the symbol is $0$.`, `$${p}$ 整除 $D$，所以符号是 $0$。`]
              : [
                  `By Euler's criterion, $${D}^{${(p - 1) / 2}} \\equiv ${value === 1 ? "1" : "-1"}$, so $${symbol(D, p)} = ${value}$.`,
                  `由欧拉判别法，$${D}^{${(p - 1) / 2}} \\equiv ${value === 1 ? "1" : "-1"}$，所以 $${symbol(D, p)} = ${value}$。`,
                ],
          ],
          [
            ["Add one", "加一"],
            [
              `The count is $1 + ${value === -1 ? "(-1)" : value} = ${answer}$.`,
              `个数是 $1 + ${value === -1 ? "(-1)" : value} = ${answer}$。`,
            ],
          ],
        ],
        roots.length === 0
          ? [`Trying every $x$ from $0$ to $${p - 1}$ gives no root.`, `逐一试 $0$ 到 $${p - 1}$ 的每个 $x$，没有根。`]
          : [
              `Trying every $x$ from $0$ to $${p - 1}$, the roots are $${roots.join(", ")}$.`,
              `逐一试 $0$ 到 $${p - 1}$ 的每个 $x$，根是 $${roots.join(", ")}$。`,
            ],
      );
    }),
);

const fullReciprocity = point(
  "a-symbol-with-two-large-primes",
  ["A symbol with two large primes", "两个大素数的符号"],
  [
    "To evaluate a Legendre symbol of two large primes, flip it by reciprocity and then reduce the new top modulo the new bottom. The flip changes the sign only when both primes are $3$ modulo $4$, and the reduction leaves a much smaller symbol to evaluate. For $\\left(\\frac{13}{17}\\right)$, $17 \\equiv 1 \\pmod{4}$, so $\\left(\\frac{13}{17}\\right) = \\left(\\frac{17}{13}\\right) = \\left(\\frac{4}{13}\\right) = 1$, since $4 = 2^{2}$.\n\nCheck: by Euler's criterion, $13 \\equiv -4 \\pmod{17}$ and $(-4)^{8} = 4^{8} = 16^{4} \\equiv (-1)^{4} = 1$.\n\n> **Watch out.** The minus sign appears only when both primes are $3$ modulo $4$; one such prime is not enough. And a symbol of two different primes is never $0$.",
    "计算两个大素数的勒让德符号时，先用互反律翻转，再把新的分子模新的分母化简。只有当两个素数都模 $4$ 余 $3$ 时，翻转才改变符号，化简后留下的符号要小得多。对 $\\left(\\frac{13}{17}\\right)$，$17 \\equiv 1 \\pmod{4}$，所以 $\\left(\\frac{13}{17}\\right) = \\left(\\frac{17}{13}\\right) = \\left(\\frac{4}{13}\\right) = 1$，因为 $4 = 2^{2}$。\n\n检验：由欧拉判别法，$13 \\equiv -4 \\pmod{17}$，而 $(-4)^{8} = 4^{8} = 16^{4} \\equiv (-1)^{4} = 1$。\n\n> **注意。** 只有两个素数都模 $4$ 余 $3$ 时才出现负号；只有一个这样的素数是不够的。而两个不同素数的符号永远不是 $0$。",
  ],
  (rng) =>
    until(() => {
      const [q, p] = rng.sample(oddPrimes(11, 199), 2).sort((x, y) => x - y) as [number, number];
      const sign = p % 4 === 3 && q % 4 === 3 ? -1 : 1;
      const r = p % q;
      const inner = legendre(r, q);
      const answer = legendre(q, p);
      const misses: Miss[] = [
        [
          -answer,
          sign === -1
            ? `That leaves out the minus sign of the flip; both $${q}$ and $${p}$ are $3$ modulo $4$.`
            : `That puts in a minus sign, but the flip changes the sign only when both primes are $3$ modulo $4$, and here they are not.`,
          sign === -1
            ? `那漏掉了翻转的负号；$${q}$ 和 $${p}$ 都模 $4$ 余 $3$。`
            : `那加了负号，但只有两个素数都模 $4$ 余 $3$ 时翻转才变号，而这里不是。`,
        ],
        [
          0,
          `The symbol is $0$ only when the bottom divides the top; $${p}$ does not divide $${q}$.`,
          `只有分母整除分子时符号才是 $0$；$${p}$ 不整除 $${q}$。`,
        ],
      ];
      const euler = powMod(q, (p - 1) / 2, p);
      return worked(
        [`What is $${symbol(q, p)}$?`, `$${symbol(q, p)}$ 是多少？`],
        answer,
        misses,
        [
          [
            ["Flip by reciprocity", "用互反律翻转"],
            [
              `$${symbol(q, p)} = ${sign === 1 ? "" : "-"}${symbol(p, q)}$, ${sign === 1 ? "since not both primes are 3 modulo 4" : "since both primes are 3 modulo 4"}.`,
              `$${symbol(q, p)} = ${sign === 1 ? "" : "-"}${symbol(p, q)}$，因为${sign === 1 ? "两个素数不都模 4 余 3" : "两个素数都模 4 余 3"}。`,
            ],
          ],
          [
            ["Reduce the top", "化简分子"],
            [
              `$${p} = ${Math.floor(p / q)} \\times ${q} + ${r}$, so $${symbol(p, q)} = ${symbol(r, q)}$, and Euler's criterion gives $${r}^{${(q - 1) / 2}} \\equiv ${inner === 1 ? "1" : "-1"} \\pmod{${q}}$, so it is $${inner}$.`,
              `$${p} = ${Math.floor(p / q)} \\times ${q} + ${r}$，所以 $${symbol(p, q)} = ${symbol(r, q)}$，欧拉判别法给出 $${r}^{${(q - 1) / 2}} \\equiv ${inner === 1 ? "1" : "-1"} \\pmod{${q}}$，所以它是 $${inner}$。`,
            ],
          ],
          [
            ["Restore the sign", "恢复符号"],
            [
              `$${sign === 1 ? "" : "-"}${inner === 1 ? "1" : "(-1)"} = ${answer}$.`,
              `$${sign === 1 ? "" : "-"}${inner === 1 ? "1" : "(-1)"} = ${answer}$。`,
            ],
          ],
        ],
        [
          `Directly by Euler's criterion, $${q}^{${(p - 1) / 2}} \\equiv ${euler} ${euler === 1 ? "" : "\\equiv -1 "}\\pmod{${p}}$.`,
          `直接用欧拉判别法，$${q}^{${(p - 1) / 2}} \\equiv ${euler} ${euler === 1 ? "" : "\\equiv -1 "}\\pmod{${p}}$。`,
        ],
      );
    }),
);

const pseudosquares = point(
  "counting-residues-the-jacobi-symbol-cannot-see",
  ["Counting residues the Jacobi symbol cannot see", "雅可比符号看不出的剩余"],
  [
    "For $n = pq$, a unit has Jacobi symbol $1$ when its two Legendre symbols agree. It is a square only when both are $1$. So the units with both symbols $-1$ look like squares to the Jacobi symbol without being squares, and they make up a quarter of the units.",
    "对 $n = pq$，单位的雅可比符号为 $1$ 当且仅当它的两个勒让德符号相同。只有两者都为 $1$ 时它才是平方数。所以两个符号都为 $-1$ 的单位在雅可比符号看来像平方数，但并不是，它们占单位的四分之一。",
  ],
  (rng) => {
    const [p, q] = rng.sample(oddPrimes(3, 47), 2).sort((x, y) => x - y) as [number, number];
    const phi = (p - 1) * (q - 1);
    const answer = phi / 4;
    return ask(
      [
        `Among the units modulo $${p * q} = ${p} \\cdot ${q}$, how many have Jacobi symbol $1$ but are not squares modulo $${p * q}$?`,
        `在模 $${p * q} = ${p} \\cdot ${q}$ 的单位中，有多少个雅可比符号为 $1$ 但不是模 $${p * q}$ 的平方数？`,
      ],
      answer,
      [phi / 2, phi, (3 * phi) / 4],
      [
        `These units have Legendre symbol $-1$ for both primes. There are $\\frac{${p - 1}}{2} \\cdot \\frac{${q - 1}}{2} = ${answer}$ such units.`,
        `这些单位对两个素数的勒让德符号都是 $-1$。这样的单位有 $\\frac{${p - 1}}{2} \\cdot \\frac{${q - 1}}{2} = ${answer}$ 个。`,
      ],
    );
  },
);

const twoSquareCount = point(
  "how-many-ways-as-a-sum-of-two-squares",
  ["How many ways as a sum of two squares", "有多少种方式写成两个平方数之和"],
  [
    "A number can have several representations as a sum of two squares. By the identity $(a^{2} + b^{2})(c^{2} + d^{2}) = (ac - bd)^{2} + (ad + bc)^{2}$, products of such numbers tend to have more, so the count grows with the number of prime factors that are $1$ modulo $4$. For $65 = 5 \\cdot 13$, trying $a = 0, 1, \\ldots, 5$ finds $65 = 1^{2} + 8^{2} = 4^{2} + 7^{2}$, two ways.\n\nCheck: with $5 = 1^{2} + 2^{2}$ and $13 = 2^{2} + 3^{2}$, the identity gives $(2 - 6)^{2} + (3 + 4)^{2} = 16 + 49$ and $(2 + 6)^{2} + (3 - 4)^{2} = 64 + 1$, the same two.\n\n> **Watch out.** Count each pair once, with $a \\le b$: $1^{2} + 8^{2}$ and $8^{2} + 1^{2}$ are the same way. And $a = 0$ is allowed, as in $25 = 0^{2} + 5^{2}$.",
    "一个数可以有多种方式写成两个平方数之和。由恒等式 $(a^{2} + b^{2})(c^{2} + d^{2}) = (ac - bd)^{2} + (ad + bc)^{2}$，这类数的积往往有更多表示，所以个数随模 $4$ 余 $1$ 的素因子的个数增加。对 $65 = 5 \\cdot 13$，试 $a = 0, 1, \\ldots, 5$，得到 $65 = 1^{2} + 8^{2} = 4^{2} + 7^{2}$，共两种。\n\n检验：由 $5 = 1^{2} + 2^{2}$ 和 $13 = 2^{2} + 3^{2}$，恒等式给出 $(2 - 6)^{2} + (3 + 4)^{2} = 16 + 49$ 和 $(2 + 6)^{2} + (3 - 4)^{2} = 64 + 1$，正是这两种。\n\n> **注意。** 每一对只数一次，取 $a \\le b$：$1^{2} + 8^{2}$ 和 $8^{2} + 1^{2}$ 是同一种。并且允许 $a = 0$，例如 $25 = 0^{2} + 5^{2}$。",
  ],
  (rng) =>
    until(() => {
      let N = rng.int(50, 2000);
      let reps: [number, number][] = [];
      while (reps.length === 0) {
        N++;
        reps = [];
        for (let a = 0; 2 * a * a <= N; a++) {
          if (isSquare(N - a * a)) reps.push([a, Math.round(Math.sqrt(N - a * a))]);
        }
      }
      const answer = reps.length;
      const shown = reps.map(([a, b]) => `${a}^{2} + ${b}^{2}`).join(", ");
      let top = 0;
      while (2 * (top + 1) * (top + 1) <= N) top++;
      const ordered = reps.reduce((v, [a, b]) => v + (a === b ? 1 : 2), 0);
      const signed = reps.reduce((v, [a, b]) => v + (a === 0 || a === b ? 4 : 8), 0);
      const misses: Miss[] = [
        [
          ordered,
          "That counts each pair twice, once in each order; with $a \\le b$ each way is counted once.",
          "那把每一对按两种顺序各数了一次；取 $a \\le b$ 时每种只数一次。",
        ],
        [
          signed,
          "That counts signs and orders as well, as $r_2(N)$ does; the question asks for $0 \\le a \\le b$.",
          "那把符号和顺序也算进去了，就像 $r_2(N)$ 那样；题目要求 $0 \\le a \\le b$。",
        ],
        [answer - 1, `That misses one of them; the full list is $${shown}$.`, `那漏掉了一种；完整的列表是 $${shown}$。`],
      ];
      return worked(
        [
          `In how many ways can $${N}$ be written as $a^{2} + b^{2}$ with integers $0 \\le a \\le b$?`,
          `$${N}$ 有多少种方式写成 $a^{2} + b^{2}$，其中 $a, b$ 为整数且 $0 \\le a \\le b$？`,
        ],
        answer,
        misses,
        [
          [
            ["Bound the smaller square", "限定较小的平方"],
            [
              `Since $a \\le b$, $2a^{2} \\le ${N}$, so $a$ runs from $0$ to $${top}$.`,
              `由于 $a \\le b$，$2a^{2} \\le ${N}$，所以 $a$ 从 $0$ 取到 $${top}$。`,
            ],
          ],
          [
            ["Test the rest", "检验余下部分"],
            [
              `For each $a$, check whether $${N} - a^{2}$ is a square: this gives $${shown}$, so $${answer}$ ways.`,
              `对每个 $a$，检验 $${N} - a^{2}$ 是否为平方数：得到 $${shown}$，共 $${answer}$ 种。`,
            ],
          ],
        ],
        [
          `Each one adds up: ${reps.map(([a, b]) => `$${a * a} + ${b * b} = ${N}$`).join(", ")}.`,
          `每一种都加得对：${reps.map(([a, b]) => `$${a * a} + ${b * b} = ${N}$`).join("，")}。`,
        ],
      );
    }),
);

const gaussianDivision = point(
  "division-with-remainder-in-the-gaussian-integers",
  ["Division with remainder in the Gaussian integers", "高斯整数中的带余除法"],
  [
    "To divide in the Gaussian integers, compute the exact quotient by multiplying by the conjugate of the divisor, and round each part to the nearest integer. The remainder then has a smaller norm than the divisor, and this is what makes the Euclidean algorithm work.",
    "在高斯整数中做除法时，先乘以除数的共轭求出精确的商，再把每一部分四舍五入到最接近的整数。这样余数的范数小于除数的范数，这正是欧几里得算法成立的原因。",
  ],
  (rng) => {
    const c = rng.int(1, 5);
    const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const N = c * c + d * d;
    let a = rng.int(-30, 30);
    const b = rng.int(-30, 30);
    while ((2 * (a * c + b * d)) % N === 0 && (a * c + b * d) % N !== 0) a++;
    const X = a * c + b * d;
    const answer = Math.round(X / N);
    const other = X / N > answer ? answer + 1 : answer - 1;
    return ask(
      [
        `Divide $${poly([a, ""], [b, "i"]) || "0"}$ by $${poly([c, ""], [d, "i"])}$ in the Gaussian integers, rounding the exact quotient to the nearest Gaussian integer. What is the real part of the result?`,
        `在高斯整数中用 $${poly([c, ""], [d, "i"])}$ 除 $${poly([a, ""], [b, "i"]) || "0"}$，把精确的商四舍五入到最接近的高斯整数。结果的实部是多少？`,
      ],
      answer,
      [other, Math.round((a * c - b * d) / N), Math.trunc(a / c)],
      [
        `Multiplying by the conjugate of the divisor makes the denominator $${N}$, and the real part of the exact quotient is $${Q.of(X, N).toLatex()}$. The nearest integer is $${answer}$.`,
        `乘以除数的共轭后分母变为 $${N}$，精确商的实部是 $${Q.of(X, N).toLatex()}$。最接近的整数是 $${answer}$。`,
      ],
    );
  },
);

const threeSquareExceptions = point(
  "counting-the-numbers-that-need-four-squares",
  ["Counting the numbers that need four squares", "计算需要四个平方数的数"],
  [
    "By Legendre's three-square theorem, the numbers that are not sums of three squares are exactly those of the form $4^{a}(8b + 7)$. Counting only the numbers that are $7$ modulo $8$ misses their multiples by powers of four, such as $28$.",
    "由勒让德三平方定理，不能写成三个平方数之和的数恰好是形如 $4^{a}(8b + 7)$ 的数。只计算模 $8$ 余 $7$ 的数会漏掉它们乘以四的幂所得的数，例如 $28$。",
  ],
  (rng) => {
    const N = rng.int(30, 120);
    const list = [...Array(N).keys()]
      .map((i) => i + 1)
      .filter((n) => {
        let m = n;
        while (m % 4 === 0) m /= 4;
        return m % 8 === 7;
      });
    const answer = list.length;
    const plain = Math.floor((N + 1) / 8);
    return ask(
      [
        `How many integers from $1$ to $${N}$ cannot be written as a sum of three squares, allowing zero?`,
        `从 $1$ 到 $${N}$ 的整数中，有多少个不能写成三个平方数之和（允许为零）？`,
      ],
      answer,
      [plain === answer ? answer + 1 : plain, answer + 2, answer - 1],
      [
        `The numbers of the form $4^{a}(8b + 7)$ in this range are $${list.join(", ")}$, so the count is $${answer}$.`,
        `这个范围内形如 $4^{a}(8b + 7)$ 的数是 $${list.join(", ")}$，所以个数是 $${answer}$。`,
      ],
    );
  },
);

const bestDenominator = point(
  "the-best-fraction-with-a-limited-denominator",
  ["The best fraction with a limited denominator", "分母受限的最佳分数"],
  [
    "A larger denominator does not always give a better approximation. The best fractions with a limited denominator come from the continued fraction, as convergents or intermediate fractions, so the winner is often a smaller denominator than the limit allows.",
    "分母越大不一定逼近得越好。分母受限的最佳分数来自连分数，是渐近分数或中间分数，所以最佳者的分母常常小于限制所允许的值。",
  ],
  (rng) => {
    let n = rng.int(2, 60);
    while (isSquare(n)) n++;
    const D = rng.int(8, 40);
    const x = Math.sqrt(n);
    let best = Number.POSITIVE_INFINITY;
    let p = 1;
    let q = 1;
    for (let d = 1; d <= D; d++) {
      const top = Math.round(d * x);
      const error = Math.abs(x - top / d);
      if (error < best - 1e-12) {
        best = error;
        p = top;
        q = d;
      }
    }
    return ask(
      [
        `Among all fractions with positive denominator at most $${D}$, one in lowest terms is closest to $\\sqrt{${n}}$. What is its denominator?`,
        `在分母为正且不超过 $${D}$ 的所有分数中，有一个最简分数最接近 $\\sqrt{${n}}$。它的分母是多少？`,
      ],
      q,
      [q === D ? D - 1 : D, q + 1, q > 1 ? q - 1 : q + 2],
      [
        `For each denominator, take the nearest numerator and compare the errors. The smallest error comes from $\\frac{${p}}{${q}}$, so the denominator is $${q}$.`,
        `对每个分母取最接近的分子，再比较误差。最小的误差来自 $\\frac{${p}}{${q}}$，所以分母是 $${q}$。`,
      ],
    );
  },
);

const negativePellPoint = point(
  "the-negative-pell-equation",
  ["The negative Pell equation", "负佩尔方程"],
  [
    "The equation $x^{2} - dy^{2} = -1$ has solutions only for some $d$. When it does, its smallest solution is smaller than that of $x^{2} - dy^{2} = 1$, and squaring $x + y\\sqrt{d}$ turns it into a solution of the positive equation, with new $y$ equal to $2xy$. For $d = 13$, $13y^{2} - 1$ is $12, 51, 116, 207$ for $y = 1, 2, 3, 4$, none a square, and $324 = 18^{2}$ for $y = 5$, so the smallest $y$ is $5$, with $x = 18$.\n\nCheck: $18^{2} - 13 \\cdot 5^{2} = 324 - 325 = -1$, and squaring gives $649^{2} - 13 \\cdot 180^{2} = 1$, with $180 = 2 \\cdot 18 \\cdot 5$.\n\n> **Watch out.** The question asks for $y$, not $x$; and $2xy$ is the $y$ of the positive equation, which is larger.",
    "方程 $x^{2} - dy^{2} = -1$ 只对某些 $d$ 有解。有解时，它的最小解小于 $x^{2} - dy^{2} = 1$ 的最小解，把 $x + y\\sqrt{d}$ 平方就得到正方程的解，新的 $y$ 等于 $2xy$。对 $d = 13$，$y = 1, 2, 3, 4$ 时 $13y^{2} - 1$ 是 $12, 51, 116, 207$，都不是平方数，$y = 5$ 时是 $324 = 18^{2}$，所以最小的 $y$ 是 $5$，$x = 18$。\n\n检验：$18^{2} - 13 \\cdot 5^{2} = 324 - 325 = -1$，平方后得 $649^{2} - 13 \\cdot 180^{2} = 1$，其中 $180 = 2 \\cdot 18 \\cdot 5$。\n\n> **注意。** 题目问的是 $y$，不是 $x$；而 $2xy$ 是正方程的 $y$，更大。",
  ],
  (rng) =>
    until(() => {
      const [d, x, y] = rng.pick(negativePell);
      const misses: Miss[] = [
        [x, `$${x}$ is the matching $x$, not $y$.`, `$${x}$ 是对应的 $x$，不是 $y$。`],
        [
          2 * x * y,
          `$2xy = ${2 * x * y}$ is the $y$ of the positive equation $x^{2} - ${d}y^{2} = 1$, found by squaring.`,
          `$2xy = ${2 * x * y}$ 是平方后得到的正方程 $x^{2} - ${d}y^{2} = 1$ 的 $y$。`,
        ],
        [
          x * x,
          `$${x * x}$ is $${d}y^{2} - 1$, the square $x^{2}$, not $y$.`,
          `$${x * x}$ 是 $${d}y^{2} - 1$，即平方数 $x^{2}$，不是 $y$。`,
        ],
      ];
      const tried = Array.from({ length: Math.min(y - 1, 5) }, (_, i) => d * (i + 1) * (i + 1) - 1);
      return worked(
        [
          `What is the smallest positive $y$ for which $x^{2} - ${d}y^{2} = -1$ has a whole-number solution $x$?`,
          `使 $x^{2} - ${d}y^{2} = -1$ 有整数解 $x$ 的最小正整数 $y$ 是多少？`,
        ],
        y,
        misses,
        [
          [
            ["Try y in turn", "依次试 y"],
            y === 1
              ? [
                  `For $y = 1$, $${d} - 1 = ${x * x} = ${x}^{2}$ is already a square.`,
                  `$y = 1$ 时，$${d} - 1 = ${x * x} = ${x}^{2}$ 已经是平方数。`,
                ]
              : [
                  `For $y$ below $${y}$, $${d}y^{2} - 1$ is not a square${y - 1 > 5 ? "; it starts" : ":"} $${tried.join(", ")}${y - 1 > 5 ? ", \\ldots" : ""}$.`,
                  `$y$ 小于 $${y}$ 时，$${d}y^{2} - 1$ 都不是平方数${y - 1 > 5 ? "，开头几个是" : "："}$${tried.join(", ")}${y - 1 > 5 ? ", \\ldots" : ""}$。`,
                ],
          ],
          [
            ["Find the first square", "找第一个平方数"],
            [
              `For $y = ${y}$, $${d} \\cdot ${y}^{2} - 1 = ${x * x} = ${x}^{2}$.`,
              `$y = ${y}$ 时，$${d} \\cdot ${y}^{2} - 1 = ${x * x} = ${x}^{2}$。`,
            ],
          ],
        ],
        [
          `$${x}^{2} - ${d} \\cdot ${y}^{2} = ${x * x} - ${d * y * y} = -1$.`,
          `$${x}^{2} - ${d} \\cdot ${y}^{2} = ${x * x} - ${d * y * y} = -1$。`,
        ],
      );
    }),
);

/** deeperNumberTheoryThirdPoints maps topics of Number Theory to a third knowledge point. */
export const deeperNumberTheoryThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "divisibility-of-fibonacci-numbers": [fibonacciPeriod],
  "hensels-lemma": [singularLift],
  "powers-modulo-n": [orderOfResidue],
  "using-fermats-little-theorem": [fermatSum],
  "primes-in-arithmetic-progressions": [dirichletClasses],
  "computing-and-counting-with-the-totient": [totientPreimages],
  "farey-sequences": [fareyNeighbor],
  "reducing-exponents-with-eulers-theorem": [powerTower],
  "wilsons-theorem": [halfFactorial],
  "multiplicative-functions": [sigmaValue],
  "dirichlet-convolution": [mobiusInversion],
  "periods-of-repeating-decimals": [decimalDigit],
  "pseudoprimes-and-carmichael-numbers": [fermatLiars],
  "the-legendre-symbol": [quadraticCount],
  "quadratic-reciprocity": [fullReciprocity],
  "the-jacobi-symbol": [pseudosquares],
  "sums-of-two-squares": [twoSquareCount],
  "gaussian-integers": [gaussianDivision],
  "sums-of-three-and-four-squares": [threeSquareExceptions],
  "best-rational-approximations": [bestDenominator],
  "pells-equation": [negativePellPoint],
};
