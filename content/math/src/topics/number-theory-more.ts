// More of Number Theory: valuations, divisibility tests, repeating decimals, Hensel lifting, Mersenne numbers,
// pseudoprimes, the Jacobi symbol, Dirichlet convolution, Farey sequences, best approximations,
// Gaussian integers, Fibonacci divisibility, primes in progressions and sums of several squares.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { divisors, factorize, orderMod, type Pair, point, powMod, primesUpTo, same, topic, totient } from "../university-kit.ts";
import { chosen, lesson, type Miss, mobius, pw, type Slip, until, type Walk, worked } from "./number-theory-course.ts";

/** gcd returns the greatest common divisor of two nonnegative numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** legendreExponent returns the exponent of the prime p in n!. */
const legendreExponent = (n: number, p: number): number => {
  let total = 0;
  for (let power = p; power <= n; power *= p) total += Math.floor(n / power);
  return total;
};

/** digitsOf returns the decimal digits of n from the left. */
const digitsOf = (n: number): number[] => String(n).split("").map(Number);

/** legendre returns the Legendre symbol of a modulo the odd prime p. */
const legendre = (a: number, p: number): number => {
  const r = powMod(((a % p) + p) % p, (p - 1) / 2, p);
  return r === p - 1 ? -1 : r;
};

/** jacobi returns the Jacobi symbol of a modulo the odd number n. */
const jacobi = (a: number, n: number): number => factorize(n).reduce((sign, [p, e]) => sign * legendre(a, p) ** e, 1);

/** fibonacci returns the Fibonacci number with index n, where the first two are 1. */
const fibonacci = (n: number): number => {
  let [a, b] = [0, 1];
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
};

/** legendreTerms lists the powers of p up to n, the denominators of Legendre's formula for n!. */
const legendreTerms = (n: number, p: number): number[] => {
  const powers: number[] = [];
  for (let power = p; power <= n; power *= p) powers.push(power);
  return powers;
};

/** baseDigits returns the digits of n in base p from the left. */
const baseDigits = (n: number, p: number): number[] => {
  const digits: number[] = [];
  for (let m = n; m > 0; m = Math.floor(m / p)) digits.unshift(m % p);
  return digits.length > 0 ? digits : [0];
};

/** carries counts the carries when a and b are added in base p. */
const carries = (a: number, b: number, p: number): number => {
  let [count, carry] = [0, 0];
  for (let [x, y] = [a, b]; x > 0 || y > 0; [x, y] = [Math.floor(x / p), Math.floor(y / p)]) {
    carry = (x % p) + (y % p) + carry >= p ? 1 : 0;
    count += carry;
  }
  return count;
};

/** decimalOf runs the long division of num by n and returns the digits before the repeat and the repeating block. */
const decimalOf = (num: number, n: number): { front: string; repeat: string } => {
  const seen = new Map<number, number>();
  let digits = "";
  let r = num % n;
  while (!seen.has(r)) {
    seen.set(r, digits.length);
    digits += String(Math.floor((r * 10) / n));
    r = (r * 10) % n;
  }
  const start = seen.get(r) ?? 0;
  return { front: digits.slice(0, start), repeat: digits.slice(start) };
};

/** korseltFailure says why a number is not a Carmichael number, in English and Chinese. */
const korseltFailure = (v: number): [string, string] => {
  const factors = factorize(v);
  const square = factors.find(([, e]) => e > 1);
  const shown = factors.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
  if (square)
    return [`$${v} = ${shown}$ has a square factor, so it fails Korselt's criterion.`, `$${v} = ${shown}$ 有平方因子，不满足科塞特判据。`];
  const bad = factors.find(([p]) => (v - 1) % (p - 1) !== 0)?.[0] ?? 2;
  return [
    `$${v} = ${shown}$, and $${bad - 1}$ does not divide $${v - 1}$, so it fails Korselt's criterion.`,
    `$${v} = ${shown}$，而 $${bad - 1}$ 不整除 $${v - 1}$，不满足科塞特判据。`,
  ];
};

/** sumOfSquares finds k positive whole numbers, largest first, whose squares add up to n, if there are any. */
const sumOfSquares = (n: number, k: number, limit = n): number[] | undefined => {
  if (k === 0) return n === 0 ? [] : undefined;
  for (let r = Math.min(Math.floor(Math.sqrt(n)), limit); r >= 1; r--) {
    const rest = sumOfSquares(n - r * r, k - 1, r);
    if (rest) return [r, ...rest];
  }
  return undefined;
};

const valuations = topic(
  "prime-valuations",
  ["Prime Valuations", "素数赋值"],
  ["Track the exact power of a prime in products, factorials and binomial coefficients.", "跟踪乘积、阶乘和二项式系数中素数的确切幂次。"],
  ["properties-of-prime-divisibility"],
  [],
  [
    point(
      "the-valuation-of-a-product",
      ["The valuation of a product", "乘积的赋值"],
      [
        "The valuation $v_p(n)$ is the exponent of the prime $p$ in $n$. It turns products into sums, since $v_p(ab) = v_p(a) + v_p(b)$, and powers into multiples, since $v_p(a^k) = k \\, v_p(a)$. For $12^{3} \\cdot 40$ with $p = 2$: $12 = 2^{2} \\cdot 3$ and $40 = 2^{3} \\cdot 5$, so $v_2 = 3 \\cdot 2 + 3 = 9$.\n\nCheck: $12^{3} \\cdot 40 = 69120 = 2^{9} \\cdot 135$, and $135$ is odd.\n\n> **Watch out.** The power multiplies only the valuation of the base it sits on. Adding $2 + 3$ forgets the cube, and $3 \\cdot (2 + 3)$ cubes the $40$ as well.",
        "赋值 $v_p(n)$ 是素数 $p$ 在 $n$ 中的指数。它把乘积变成和，因为 $v_p(ab) = v_p(a) + v_p(b)$，也把幂变成倍数，因为 $v_p(a^k) = k \\, v_p(a)$。对 $12^{3} \\cdot 40$ 取 $p = 2$：$12 = 2^{2} \\cdot 3$，$40 = 2^{3} \\cdot 5$，所以 $v_2 = 3 \\cdot 2 + 3 = 9$。\n\n检验：$12^{3} \\cdot 40 = 69120 = 2^{9} \\cdot 135$，而 $135$ 是奇数。\n\n> **注意。** 幂次只乘它所在的底数的赋值。算 $2 + 3$ 忘了立方，算 $3 \\cdot (2 + 3)$ 又把 $40$ 也立方了。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5]);
          const [i, j] = [rng.int(1, 4), rng.int(1, 3)];
          const [u, v] = [rng.pick([1, 7, 11, 13]), rng.pick([1, 7, 11, 13, 17])];
          const k = rng.int(2, 6);
          const a = p ** i * u;
          const b = p ** j * v;
          const answer = i * k + j;
          const split = (e: number, rest: number) => (rest === 1 ? pw(p, e) : `${pw(p, e)} \\cdot ${rest}`);
          return worked(
            [`What is $v_{${p}}(${a}^{${k}} \\cdot ${b})$?`, `$v_{${p}}(${a}^{${k}} \\cdot ${b})$ 是多少？`],
            answer,
            [
              [
                i + j,
                "That adds the two valuations but forgets the power on the first factor.",
                "那把两个赋值相加了，却忘了第一个因数上的幂。",
              ],
              [
                i * k,
                "That counts the power of the first factor and leaves out the second factor.",
                "那只算了第一个因数的幂，漏掉了第二个因数。",
              ],
              [
                (i + j) * k,
                "That raises the second factor to the power as well; the power sits only on the first.",
                "那把第二个因数也乘方了；幂只作用在第一个因数上。",
              ],
              [
                i + k,
                "That adds the exponent to the valuation; a power multiplies the valuation.",
                "那把指数加到赋值上了；乘方是把赋值乘以指数。",
              ],
            ],
            [
              [
                ["Factor the bases", "分解底数"],
                [
                  `$${a} = ${split(i, u)}$ and $${b} = ${split(j, v)}$, so $v_{${p}}(${a}) = ${i}$ and $v_{${p}}(${b}) = ${j}$.`,
                  `$${a} = ${split(i, u)}$，$${b} = ${split(j, v)}$，所以 $v_{${p}}(${a}) = ${i}$，$v_{${p}}(${b}) = ${j}$。`,
                ],
              ],
              [
                ["Multiply for the power", "乘方变乘法"],
                [`$v_{${p}}(${a}^{${k}}) = ${k} \\cdot ${i} = ${i * k}$.`, `$v_{${p}}(${a}^{${k}}) = ${k} \\cdot ${i} = ${i * k}$。`],
              ],
              [
                ["Add for the product", "乘积变加法"],
                [`$${i * k} + ${j} = ${answer}$.`, `$${i * k} + ${j} = ${answer}$。`],
              ],
            ],
            [
              `The product is $${pw(p, answer)}$ times ${u === 1 && v === 1 ? "nothing else" : `$${u === 1 ? "" : `${u}^{${k}}`}${u !== 1 && v !== 1 ? " \\cdot " : ""}${v === 1 ? "" : v}$`}, and ${u === 1 && v === 1 ? "so the exponent is exactly" : `that is not a multiple of ${p}, so the exponent is exactly`} $${answer}$.`,
              `这个乘积是 $${pw(p, answer)}$ ${u === 1 && v === 1 ? "本身" : `乘以 $${u === 1 ? "" : `${u}^{${k}}`}${u !== 1 && v !== 1 ? " \\cdot " : ""}${v === 1 ? "" : v}$，后者不是 ${p} 的倍数`}，所以指数恰好是 $${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "trailing-zeros-of-a-factorial",
      ["Trailing zeros of a factorial", "阶乘末尾的零"],
      [
        "Each trailing zero of $n!$ needs a factor of 10, and factors of 2 are more plentiful than factors of 5. So the number of zeros is $v_5(n!) = \\lfloor \\frac{n}{5} \\rfloor + \\lfloor \\frac{n}{25} \\rfloor + \\cdots$. The later terms count the numbers that contribute more than one factor of 5. For $100!$ this is $20 + 4 = 24$ zeros.\n\nCheck: $v_2(100!) = 50 + 25 + 12 + 6 + 3 + 1 = 97$, far more than $24$, so the fives are what run out first.\n\n> **Watch out.** Stopping at $\\lfloor \\frac{n}{5} \\rfloor$ misses the extra five in $25, 50, 75, 100$, and dividing $n$ by 10 counts only the multiples of 10.",
        "$n!$ 末尾的每个零都需要一个因子 10，而因子 2 比因子 5 多。所以零的个数是 $v_5(n!) = \\lfloor \\frac{n}{5} \\rfloor + \\lfloor \\frac{n}{25} \\rfloor + \\cdots$。后面几项数的是贡献不止一个因子 5 的数。对 $100!$，这是 $20 + 4 = 24$ 个零。\n\n检验：$v_2(100!) = 50 + 25 + 12 + 6 + 3 + 1 = 97$，远多于 $24$，所以先用完的是因子 5。\n\n> **注意。** 只算到 $\\lfloor \\frac{n}{5} \\rfloor$ 会漏掉 $25, 50, 75, 100$ 里多出的因子 5；用 $n$ 除以 10 只数到了 10 的倍数。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(26, 400);
          const answer = legendreExponent(n, 5);
          const terms = legendreTerms(n, 5);
          const digitSum = baseDigits(n, 5).reduce((x, y) => x + y, 0);
          return worked(
            [`How many zeros does $${n}!$ end with?`, `$${n}!$ 末尾有多少个零？`],
            answer,
            [
              [
                Math.floor(n / 5),
                "That counts the multiples of 5 once each and misses the extra factor of 5 in the multiples of 25.",
                "那把 5 的倍数各数了一次，漏掉了 25 的倍数里多出的因子 5。",
              ],
              [
                Math.floor(n / 10),
                "That counts only the multiples of 10; a 2 from one number and a 5 from another also make a 10.",
                "那只数了 10 的倍数；一个数里的 2 和另一个数里的 5 也能凑成 10。",
              ],
              [
                legendreExponent(n, 2),
                "That counts the factors of 2, which are plentiful; the zeros are limited by the factors of 5.",
                "那数的是因子 2，它们很多；零的个数受因子 5 限制。",
              ],
            ],
            [
              [
                ["Count the factors of 5", "数因子 5"],
                [
                  `Each trailing zero needs a 10, and the fives are scarcer than the twos, so count $v_5(${n}!)$.`,
                  `每个末尾零需要一个 10，而因子 5 比因子 2 少，所以数 $v_5(${n}!)$。`,
                ],
              ],
              [
                ["Add the floors", "把取整相加"],
                [
                  `$${terms.map((q) => `\\lfloor \\frac{${n}}{${q}} \\rfloor`).join(" + ")} = ${terms.map((q) => Math.floor(n / q)).join(" + ")} = ${answer}$.`,
                  `$${terms.map((q) => `\\lfloor \\frac{${n}}{${q}} \\rfloor`).join(" + ")} = ${terms.map((q) => Math.floor(n / q)).join(" + ")} = ${answer}$。`,
                ],
              ],
            ],
            [
              `Legendre's formula also reads $v_5(n!) = \\frac{n - s}{4}$, where $s$ is the digit sum of $n$ in base 5. Here $${n} = ${baseDigits(n, 5).join("")}_5$ has $s = ${digitSum}$, and $\\frac{${n} - ${digitSum}}{4} = ${answer}$.`,
              `勒让德公式也可写成 $v_5(n!) = \\frac{n - s}{4}$，其中 $s$ 是 $n$ 的五进制数字和。这里 $${n} = ${baseDigits(n, 5).join("")}_5$，$s = ${digitSum}$，$\\frac{${n} - ${digitSum}}{4} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "the-valuation-of-a-binomial-coefficient",
      ["The valuation of a binomial coefficient", "二项式系数的赋值"],
      [
        "Since $\\binom{n}{k} = \\frac{n!}{k! (n - k)!}$, its valuation is $v_p(n!) - v_p(k!) - v_p((n - k)!)$, and each term comes from Legendre's formula. For $\\binom{10}{4}$ and $p = 2$: $v_2(10!) = 5 + 2 + 1 = 8$, $v_2(4!) = 3$ and $v_2(6!) = 4$, so the valuation is $8 - 3 - 4 = 1$.\n\nCheck: $\\binom{10}{4} = 210 = 2 \\cdot 105$. Kummer's theorem agrees: adding $4 = 100_2$ and $6 = 110_2$ in base 2 makes exactly one carry.\n\n> **Watch out.** Subtract the valuations of both factorials below the bar. Using $v_p(n!)$ alone, or taking away only one of them, leaves far too many factors of $p$.",
        "因为 $\\binom{n}{k} = \\frac{n!}{k! (n - k)!}$，它的赋值是 $v_p(n!) - v_p(k!) - v_p((n - k)!)$，每一项都由勒让德公式得出。对 $\\binom{10}{4}$ 取 $p = 2$：$v_2(10!) = 5 + 2 + 1 = 8$，$v_2(4!) = 3$，$v_2(6!) = 4$，所以赋值是 $8 - 3 - 4 = 1$。\n\n检验：$\\binom{10}{4} = 210 = 2 \\cdot 105$。库默尔定理也一致：在二进制下把 $4 = 100_2$ 和 $6 = 110_2$ 相加，恰好进位一次。\n\n> **注意。** 分母里的两个阶乘的赋值都要减去。只用 $v_p(n!)$，或只减其中一个，会留下太多因子 $p$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5]);
          const n = rng.int(10, 60);
          const k = rng.int(2, n - 2);
          const [a, b, c] = [legendreExponent(n, p), legendreExponent(k, p), legendreExponent(n - k, p)];
          const answer = a - b - c;
          const sum = (m: number) => {
            const values = legendreTerms(m, p).map((q) => Math.floor(m / q));
            return values.length > 1 ? `${values.join(" + ")} = ${legendreExponent(m, p)}` : `${legendreExponent(m, p)}`;
          };
          return worked(
            [`What is $v_{${p}} \\left( \\binom{${n}}{${k}} \\right)$?`, `$v_{${p}} \\left( \\binom{${n}}{${k}} \\right)$ 是多少？`],
            answer,
            [
              [
                a,
                `That is $v_{${p}}(${n}!)$ alone; the factorials below the bar take factors of ${p} away.`,
                `那只是 $v_{${p}}(${n}!)$；分母里的阶乘会消去因子 ${p}。`,
              ],
              [
                a - b,
                `That subtracts $v_{${p}}(${k}!)$ but not $v_{${p}}(${n - k}!)$.`,
                `那减去了 $v_{${p}}(${k}!)$，却没减 $v_{${p}}(${n - k}!)$。`,
              ],
              [
                a - c,
                `That subtracts $v_{${p}}(${n - k}!)$ but not $v_{${p}}(${k}!)$.`,
                `那减去了 $v_{${p}}(${n - k}!)$，却没减 $v_{${p}}(${k}!)$。`,
              ],
            ],
            [
              [
                ["Apply Legendre's formula", "用勒让德公式"],
                [
                  `$v_{${p}}(${n}!) = ${sum(n)}$, $v_{${p}}(${k}!) = ${sum(k)}$ and $v_{${p}}(${n - k}!) = ${sum(n - k)}$.`,
                  `$v_{${p}}(${n}!) = ${sum(n)}$，$v_{${p}}(${k}!) = ${sum(k)}$，$v_{${p}}(${n - k}!) = ${sum(n - k)}$。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [`$${a} - ${b} - ${c} = ${answer}$.`, `$${a} - ${b} - ${c} = ${answer}$。`],
              ],
            ],
            [
              `By Kummer's theorem the valuation is the number of carries when $${k} = ${baseDigits(k, p).join("")}_{${p}}$ and $${n - k} = ${baseDigits(n - k, p).join("")}_{${p}}$ are added in base ${p}, and there are ${carries(k, n - k, p)} of them.`,
              `由库默尔定理，赋值等于在 ${p} 进制下把 $${k} = ${baseDigits(k, p).join("")}_{${p}}$ 与 $${n - k} = ${baseDigits(n - k, p).join("")}_{${p}}$ 相加时的进位次数，共 ${carries(k, n - k, p)} 次。`,
            ],
          );
        }),
    ),
  ],
);

const divisibilityTests = topic(
  "divisibility-tests",
  ["Divisibility Tests", "整除判别法"],
  ["Derive the digit tests from powers of ten modulo $n$.", "由 10 的幂模 $n$ 推出数字判别法。"],
  ["modular-congruence"],
  [],
  [
    point(
      "remainder-from-the-digit-sum",
      ["Remainder from the digit sum", "由数字和求余数"],
      [
        "Because $10 \\equiv 1 \\pmod{9}$, every power of 10 is also 1 modulo 9, so a number has the same remainder as the sum of its digits. The same holds modulo 3. For $5831$ the digit sum is $5 + 8 + 3 + 1 = 17$, and $17$ leaves $8$ on division by 9, so $5831$ leaves $8$ too.\n\nCheck: $9 \\cdot 647 = 5823$ and $5831 - 5823 = 8$.\n\n> **Watch out.** The digit sum itself is not the remainder until it is reduced: $17$ still has to be divided by 9.",
        "因为 $10 \\equiv 1 \\pmod{9}$，10 的每个幂模 9 也都是 1，所以一个数与它的数字和有相同的余数。模 3 也一样。$5831$ 的数字和是 $5 + 8 + 3 + 1 = 17$，$17$ 除以 9 余 $8$，所以 $5831$ 也余 $8$。\n\n检验：$9 \\cdot 647 = 5823$，$5831 - 5823 = 8$。\n\n> **注意。** 数字和要再约化才是余数：$17$ 还得除以 9。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(1000, 999999);
          const m = rng.pick([3, 9]);
          const digits = digitsOf(n);
          const sum = digits.reduce((x, y) => x + y, 0);
          const answer = n % m;
          const other = m === 9 ? 3 : 9;
          return worked(
            [`What is the remainder when ${n} is divided by ${m}?`, `${n} 除以 ${m} 的余数是多少？`],
            answer,
            [
              [sum, `That is the digit sum before it is reduced modulo ${m}.`, `那是还没有模 ${m} 约化的数字和。`],
              [
                n % 10,
                "That is the last digit, which decides the remainder on division by 10, not this one.",
                "那是个位数字，它决定的是除以 10 的余数。",
              ],
              [n % other, `That is the remainder on division by ${other}.`, `那是除以 ${other} 的余数。`],
            ],
            [
              [
                ["Add the digits", "数字相加"],
                [`$${digits.join(" + ")} = ${sum}$.`, `$${digits.join(" + ")} = ${sum}$。`],
              ],
              [
                ["Reduce the sum", "约化数字和"],
                [
                  `Since $10 \\equiv 1 \\pmod{${m}}$, the number leaves the same remainder as ${sum}, which is ${answer}.`,
                  `因为 $10 \\equiv 1 \\pmod{${m}}$，原数与 ${sum} 余数相同，都是 ${answer}。`,
                ],
              ],
            ],
            [
              `$${m} \\cdot ${(n - answer) / m} = ${n - answer}$, and $${n} - ${n - answer} = ${answer}$.`,
              `$${m} \\cdot ${(n - answer) / m} = ${n - answer}$，而 $${n} - ${n - answer} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "the-alternating-sum-for-eleven",
      ["The alternating sum for eleven", "判别 11 的交错和"],
      [
        "Because $10 \\equiv -1 \\pmod{11}$, the powers of 10 alternate between 1 and $-1$. So a number is congruent modulo 11 to the alternating sum of its digits, starting with a plus sign at the units digit. For $5823$ this is $3 - 2 + 8 - 5 = 4$, so $5823$ leaves $4$ on division by 11.\n\nCheck: $11 \\cdot 529 = 5819$ and $5823 - 5819 = 4$.\n\n> **Watch out.** The plus sign belongs to the units digit. Starting the signs from the left digit of a number with an even count of digits flips every sign and gives the negative of the remainder.",
        "因为 $10 \\equiv -1 \\pmod{11}$，10 的幂在 1 和 $-1$ 之间交替。所以一个数模 11 同余于它各位数字的交错和，从个位起取正号。$5823$ 的交错和是 $3 - 2 + 8 - 5 = 4$，所以 $5823$ 除以 11 余 $4$。\n\n检验：$11 \\cdot 529 = 5819$，$5823 - 5819 = 4$。\n\n> **注意。** 正号属于个位。对位数为偶数的数从最左一位起定符号，会把每个符号都反过来，得到余数的相反数。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(1000, 999999);
          const answer = n % 11;
          const digits = digitsOf(n).reverse();
          const alternating = digits.reduce((x, d, i) => x + (i % 2 === 0 ? d : -d), 0);
          const written = digits.map((d, i) => (i === 0 ? String(d) : `${i % 2 === 0 ? "+" : "-"} ${d}`)).join(" ");
          return worked(
            [`What is the remainder when ${n} is divided by 11?`, `${n} 除以 11 的余数是多少？`],
            answer,
            [
              [
                digits.reduce((x, y) => x + y, 0) % 11,
                "That reduces the plain digit sum, which works for 9 because $10 \\equiv 1$, but modulo 11 we have $10 \\equiv -1$.",
                "那是把普通数字和约化，这对 9 成立，因为 $10 \\equiv 1$；但模 11 时 $10 \\equiv -1$。",
              ],
              [
                (11 - answer) % 11,
                "That takes the signs the wrong way round, which gives the negative of the remainder.",
                "那把符号取反了，得到的是余数的相反数。",
              ],
              [n % 10, "That is the last digit, which is the remainder on division by 10.", "那是个位数字，是除以 10 的余数。"],
            ],
            [
              [
                ["Alternate from the units digit", "从个位起交错"],
                [`$${written} = ${alternating}$.`, `$${written} = ${alternating}$。`],
              ],
              [
                ["Reduce modulo 11", "模 11 约化"],
                [
                  `$${alternating} \\equiv ${answer} \\pmod{11}$, so the remainder is ${answer}.`,
                  `$${alternating} \\equiv ${answer} \\pmod{11}$，所以余数是 ${answer}。`,
                ],
              ],
            ],
            [
              `$11 \\cdot ${(n - answer) / 11} = ${n - answer}$, and $${n} - ${n - answer} = ${answer}$.`,
              `$11 \\cdot ${(n - answer) / 11} = ${n - answer}$，而 $${n} - ${n - answer} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "a-test-for-other-divisors",
      ["A test for other divisors", "其他除数的判别法"],
      [
        "Powers of 10 are eventually simple for many divisors. Modulo 8, only the last three digits matter, because 1000 is a multiple of 8. Modulo 7, 11 and 13 together, $1001 = 7 \\cdot 11 \\cdot 13$ gives $1000 \\equiv -1$, so alternate sums of three-digit blocks reveal the remainder. For $52419$ modulo 7, the blocks are $52$ and $419$, and $419 - 52 = 367 = 7 \\cdot 52 + 3$, so the remainder is $3$.\n\nCheck: $7 \\cdot 7488 = 52416$ and $52419 - 52416 = 3$.\n\n> **Watch out.** The block in front is multiplied by $1000 \\equiv -1$, so it is subtracted from the last block, not added to it.",
        "对许多除数，10 的幂最终很简单。模 8 时只看末三位，因为 1000 是 8 的倍数。对 7、11 和 13，$1001 = 7 \\cdot 11 \\cdot 13$ 给出 $1000 \\equiv -1$，所以每三位分块取交错和就能得到余数。求 $52419$ 模 7，分块是 $52$ 和 $419$，$419 - 52 = 367 = 7 \\cdot 52 + 3$，所以余数是 $3$。\n\n检验：$7 \\cdot 7488 = 52416$，$52419 - 52416 = 3$。\n\n> **注意。** 前面那块乘的是 $1000 \\equiv -1$，所以要从末块中减去，而不是加上。",
      ],
      (rng) =>
        until(() => {
          const m = rng.pick([7, 13]);
          const high = rng.int(1, 99);
          const low = rng.int(100, 999);
          const n = high * 1000 + low;
          const answer = n % m;
          const gap = low - high;
          return worked(
            [
              `Use $1000 \\equiv -1$ to find the remainder when ${n} is divided by ${m}.`,
              `利用 $1000 \\equiv -1$，求 ${n} 除以 ${m} 的余数。`,
            ],
            answer,
            [
              [
                (low + high) % m,
                "That adds the two blocks; the front block is multiplied by $1000 \\equiv -1$, so it is subtracted.",
                "那把两块相加了；前面那块乘的是 $1000 \\equiv -1$，应当减去。",
              ],
              [
                low % m,
                "That keeps only the last three digits, which works modulo 8 but not here.",
                "那只保留了末三位，这对 8 成立，这里不行。",
              ],
              [high % m, "That keeps only the front block.", "那只保留了前面那块。"],
            ],
            [
              [
                ["Split into blocks", "分块"],
                [`$${n} = ${high} \\cdot 1000 + ${low}$.`, `$${n} = ${high} \\cdot 1000 + ${low}$。`],
              ],
              [
                ["Replace 1000 by $-1$", "把 1000 换成 $-1$"],
                [`$${n} \\equiv ${low} - ${high} = ${gap} \\pmod{${m}}$.`, `$${n} \\equiv ${low} - ${high} = ${gap} \\pmod{${m}}$。`],
              ],
              [
                ["Reduce", "约化"],
                [
                  `$${gap} = ${m} \\cdot ${Math.floor(gap / m)} + ${answer}$, so the remainder is ${answer}.`,
                  `$${gap} = ${m} \\cdot ${Math.floor(gap / m)} + ${answer}$，所以余数是 ${answer}。`,
                ],
              ],
            ],
            [
              `$${m} \\cdot ${(n - answer) / m} = ${n - answer}$, and $${n} - ${n - answer} = ${answer}$.`,
              `$${m} \\cdot ${(n - answer) / m} = ${n - answer}$，而 $${n} - ${n - answer} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const decimals = topic(
  "periods-of-repeating-decimals",
  ["Periods of Repeating Decimals", "循环小数的周期"],
  ["Link the length of a repeating decimal to an order modulo $n$.", "把循环节的长度与模 $n$ 的阶联系起来。"],
  ["the-order-of-an-integer-modulo-n"],
  [],
  [
    point(
      "the-period-is-an-order",
      ["The period is an order", "周期就是阶"],
      [
        "When $n$ is coprime to 10, the decimal of $\\frac{1}{n}$ repeats from the start, with period equal to the order of 10 modulo $n$. Long division makes this visible: the remainders are the powers of 10 modulo $n$, and the digits repeat as soon as a remainder does. For $n = 7$ the powers of 10 leave $3, 2, 6, 4, 5, 1$, so the order is 6 and $\\frac{1}{7} = 0.\\overline{142857}$.\n\nCheck: $999999 = 7 \\cdot 142857$, so $\\frac{1}{7} = \\frac{142857}{999999}$, a block of six digits repeated.\n\n> **Watch out.** The period divides $\\varphi(n)$ but need not equal it: $\\frac{1}{11} = 0.\\overline{09}$ has period 2, while $\\varphi(11) = 10$.",
        "当 $n$ 与 10 互素时，$\\frac{1}{n}$ 的小数从头开始循环，周期等于 10 模 $n$ 的阶。长除法能让人看清这一点：余数就是 10 的幂模 $n$，余数一重复，数字就重复。对 $n = 7$，10 的各次幂的余数是 $3, 2, 6, 4, 5, 1$，所以阶是 6，$\\frac{1}{7} = 0.\\overline{142857}$。\n\n检验：$999999 = 7 \\cdot 142857$，所以 $\\frac{1}{7} = \\frac{142857}{999999}$，正是六位一组的循环。\n\n> **注意。** 周期整除 $\\varphi(n)$，但不一定等于它：$\\frac{1}{11} = 0.\\overline{09}$ 的周期是 2，而 $\\varphi(11) = 10$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.pick(Array.from({ length: 120 }, (_, i) => i + 3).filter((v) => gcd(v, 10) === 1));
          const answer = orderMod(10, n);
          const phi = totient(n);
          const tried = divisors(phi).filter((d) => d <= answer && (d > 1 || answer === 1));
          const decimal = decimalOf(1, n);
          return worked(
            [`What is the period of the repeating decimal of $\\frac{1}{${n}}$?`, `$\\frac{1}{${n}}$ 的循环小数的周期是多少？`],
            answer,
            [
              [
                phi,
                `That is $\\varphi(${n})$; the period divides it but can be smaller.`,
                `那是 $\\varphi(${n})$；周期整除它，但可能更小。`,
              ],
              [
                n - 1,
                `That is $${n} - 1$, the longest period a denominator of ${n} could have, not the actual one.`,
                `那是 $${n} - 1$，是分母 ${n} 可能的最长周期，不是实际周期。`,
              ],
              [
                answer * 2,
                "That doubles the period, perhaps by counting the repeating block twice.",
                "那把周期加倍了，大概是把循环节数了两遍。",
              ],
            ],
            [
              [
                ["Narrow the candidates", "缩小范围"],
                [
                  `The period is the order of 10 modulo ${n}, which divides $\\varphi(${n}) = ${phi}$.`,
                  `周期是 10 模 ${n} 的阶，它整除 $\\varphi(${n}) = ${phi}$。`,
                ],
              ],
              [
                ["Test the divisors in order", "依次试因数"],
                [
                  `${tried.map((d) => `$${pw(10, d)} \\equiv ${powMod(10, d, n)}$`).join(", ")} modulo ${n}, so the first power that gives 1 is $k = ${answer}$.`,
                  `模 ${n} 时 ${tried.map((d) => `$${pw(10, d)} \\equiv ${powMod(10, d, n)}$`).join("，")}，所以第一个给出 1 的幂是 $k = ${answer}$。`,
                ],
              ],
            ],
            [
              `Long division gives $\\frac{1}{${n}} = 0.\\overline{${decimal.repeat}}$, a block of ${decimal.repeat.length} digits.`,
              `长除法给出 $\\frac{1}{${n}} = 0.\\overline{${decimal.repeat}}$，循环节有 ${decimal.repeat.length} 位。`,
            ],
          );
        }),
    ),
    point(
      "the-digits-before-the-repeat",
      ["The digits before the repeat", "循环前的数字"],
      [
        "A fraction in lowest terms has a terminating decimal exactly when its denominator has only the primes 2 and 5. In general write $n = 2^a 5^b m$ with $m$ coprime to 10. The non-repeating part then has $\\max(a, b)$ digits, and the repeating part has the period that comes from $m$. For $12 = 2^{2} \\cdot 3$ this gives $\\max(2, 0) = 2$ digits before the repeat.\n\nCheck: long division gives $\\frac{1}{12} = 0.08\\overline{3}$, with the two digits $0$ and $8$ in front of the repeating $3$.\n\n> **Watch out.** The count is the larger of the two exponents, not their sum: multiplying by $10^{\\max(a, b)}$ already clears both the twos and the fives.",
        "最简分数的小数有限，当且仅当分母只含素因子 2 和 5。一般地，写 $n = 2^a 5^b m$，其中 $m$ 与 10 互素。不循环部分有 $\\max(a, b)$ 位，循环部分的周期由 $m$ 决定。对 $12 = 2^{2} \\cdot 3$，循环前有 $\\max(2, 0) = 2$ 位。\n\n检验：长除法给出 $\\frac{1}{12} = 0.08\\overline{3}$，循环的 $3$ 前面正是 $0$ 和 $8$ 两位。\n\n> **注意。** 位数是两个指数中较大的那个，不是它们的和：乘以 $10^{\\max(a, b)}$ 已经同时消去了因子 2 和因子 5。",
      ],
      (rng) =>
        until(() => {
          const [a, b] = [rng.int(0, 5), rng.int(0, 3)];
          const m = rng.pick([3, 7, 9, 11, 13, 17, 21]);
          const n = 2 ** a * 5 ** b * m;
          const answer = Math.max(a, b);
          const parts = [a > 0 ? pw(2, a) : "", b > 0 ? pw(5, b) : "", `${m}`].filter(Boolean).join(" \\cdot ");
          const decimal = decimalOf(1, n);
          return worked(
            [
              `How many digits come before the repeating part in the decimal of $\\frac{1}{${n}}$?`,
              `$\\frac{1}{${n}}$ 的小数中，循环部分之前有多少位数字？`,
            ],
            answer,
            [
              [
                a + b,
                "That adds the two exponents; one power of 10 clears a 2 and a 5 at once, so only the larger exponent counts.",
                "那把两个指数相加了；一个 10 同时消去一个 2 和一个 5，所以只看较大的指数。",
              ],
              [
                Math.min(a, b),
                "That takes the smaller exponent; the extra factors of the larger one still need their own digits.",
                "那取了较小的指数；较大指数多出的因子仍需要各自的位数。",
              ],
              [
                answer + 1,
                "That counts one digit too many, perhaps the first digit of the repeating block.",
                "那多数了一位，大概把循环节的第一位也算进去了。",
              ],
            ],
            [
              [
                ["Factor the denominator", "分解分母"],
                [
                  `$${n} = ${parts}$, so $a = ${a}$, $b = ${b}$ and the part coprime to 10 is ${m}.`,
                  `$${n} = ${parts}$，所以 $a = ${a}$，$b = ${b}$，与 10 互素的部分是 ${m}。`,
                ],
              ],
              [
                ["Take the larger exponent", "取较大的指数"],
                answer === 0
                  ? [
                      `There are no factors of 2 or 5, so the decimal repeats from the start: $\\max(0, 0) = 0$ digits in front.`,
                      `没有因子 2 或 5，所以小数从头开始循环：前面有 $\\max(0, 0) = 0$ 位。`,
                    ]
                  : [
                      `Multiplying by $${pw(10, answer)}$ leaves a fraction with denominator ${m}, which repeats from the start, so there are $\\max(${a}, ${b}) = ${answer}$ digits in front.`,
                      `乘以 $${pw(10, answer)}$ 后分母只剩 ${m}，它从头开始循环，所以前面有 $\\max(${a}, ${b}) = ${answer}$ 位。`,
                    ],
              ],
            ],
            [
              `Long division gives $\\frac{1}{${n}} = 0.${decimal.front}\\overline{${decimal.repeat}}$, with ${answer} ${answer === 1 ? "digit" : "digits"} before the bar.`,
              `长除法给出 $\\frac{1}{${n}} = 0.${decimal.front}\\overline{${decimal.repeat}}$，横线前有 ${answer} 位。`,
            ],
          );
        }),
    ),
  ],
);

const hensel = topic(
  "hensels-lemma",
  ["Hensel's Lemma", "亨泽尔引理"],
  ["Lift a root of a polynomial from modulo $p$ to modulo $p^2$.", "把多项式的根从模 $p$ 提升到模 $p^2$。"],
  ["multiplicative-inverses-modulo-n"],
  [],
  [
    point(
      "lifting-a-root",
      ["Lifting a root", "提升一个根"],
      [
        "If $f(r) \\equiv 0 \\pmod{p}$ and $f'(r)$ is not divisible by $p$, then there is a unique root modulo $p^2$ of the form $r + p t$. Expanding gives $f(r) + p t f'(r) \\equiv 0 \\pmod{p^2}$, a linear congruence for $t$. Repeating the step reaches any power of $p$. For $x^2 \\equiv 2 \\pmod{49}$ with $x \\equiv 3 \\pmod{7}$: $(3 + 7t)^2 \\equiv 9 + 42 t$, and $9 + 42 t \\equiv 2$ means $6 t \\equiv -1 \\pmod{7}$, so $t = 1$ and $x = 10$.\n\nCheck: $10^{2} = 100 = 2 \\cdot 49 + 2$.\n\n> **Watch out.** The lift must stay congruent to $r$ modulo $p$. The other root $49 - 10 = 39$ also squares to 2, but it lifts the root $4$, not $3$.",
        "如果 $f(r) \\equiv 0 \\pmod{p}$，且 $f'(r)$ 不被 $p$ 整除，那么模 $p^2$ 有唯一形如 $r + p t$ 的根。展开得 $f(r) + p t f'(r) \\equiv 0 \\pmod{p^2}$，这是关于 $t$ 的线性同余式。重复这一步就能到达 $p$ 的任何幂。对 $x^2 \\equiv 2 \\pmod{49}$ 且 $x \\equiv 3 \\pmod{7}$：$(3 + 7t)^2 \\equiv 9 + 42 t$，由 $9 + 42 t \\equiv 2$ 得 $6 t \\equiv -1 \\pmod{7}$，所以 $t = 1$，$x = 10$。\n\n检验：$10^{2} = 100 = 2 \\cdot 49 + 2$。\n\n> **注意。** 提升后的根模 $p$ 仍须与 $r$ 同余。另一个根 $49 - 10 = 39$ 的平方也是 2，但它提升的是根 $4$，不是 $3$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([3, 5, 7, 11]);
          const r = rng.int(1, (p - 1) / 2);
          const t = rng.int(1, p - 1);
          const root = r + p * t;
          const square = root * root;
          const a = square % (p * p);
          const diff = a - r * r;
          const c = (((diff / p) % p) + p) % p;
          return worked(
            [
              `The congruence $x^2 \\equiv ${a} \\pmod{${p * p}}$ has a solution with $x \\equiv ${r} \\pmod{${p}}$. What is this solution between 0 and ${p * p}?`,
              `同余式 $x^2 \\equiv ${a} \\pmod{${p * p}}$ 有一个解满足 $x \\equiv ${r} \\pmod{${p}}$。这个解在 0 和 ${p * p} 之间是多少？`,
            ],
            root,
            [
              [r, `That is the root modulo ${p}, before it is lifted.`, `那是模 ${p} 的根，还没有提升。`],
              [
                p * p - root,
                `That is the other square root of ${a}, which is congruent to $-${r}$ modulo ${p}, not to ${r}.`,
                `那是 ${a} 的另一个平方根，它模 ${p} 同余于 $-${r}$，而不是 ${r}。`,
              ],
              [
                (root + p) % (p * p),
                `That takes $t$ one too large; check the linear congruence for $t$ again.`,
                `那把 $t$ 取大了一；请重新解关于 $t$ 的线性同余式。`,
              ],
              [a, "That is the right-hand side of the congruence, not a root of it.", "那是同余式的右边，不是它的根。"],
            ],
            [
              [
                ["Write the lift", "写出提升形式"],
                [
                  `Put $x = ${r} + ${p} t$. Then $x^2 \\equiv ${r * r} + ${2 * r * p} t \\pmod{${p * p}}$.`,
                  `设 $x = ${r} + ${p} t$。则 $x^2 \\equiv ${r * r} + ${2 * r * p} t \\pmod{${p * p}}$。`,
                ],
              ],
              [
                ["Solve for $t$", "解出 $t$"],
                [
                  `$${2 * r * p} t \\equiv ${a} - ${r * r} = ${diff} \\pmod{${p * p}}$. Dividing by ${p} gives $${2 * r} t \\equiv ${c} \\pmod{${p}}$, so $t = ${t}$.`,
                  `$${2 * r * p} t \\equiv ${a} - ${r * r} = ${diff} \\pmod{${p * p}}$。两边除以 ${p} 得 $${2 * r} t \\equiv ${c} \\pmod{${p}}$，所以 $t = ${t}$。`,
                ],
              ],
              [
                ["Assemble", "合成"],
                [`$x = ${r} + ${p} \\cdot ${t} = ${root}$.`, `$x = ${r} + ${p} \\cdot ${t} = ${root}$。`],
              ],
            ],
            [
              `$${root}^{2} = ${square} = ${p * p} \\cdot ${(square - a) / (p * p)} + ${a}$, and $${root} = ${p} \\cdot ${t} + ${r}$ is congruent to ${r} modulo ${p}.`,
              `$${root}^{2} = ${square} = ${p * p} \\cdot ${(square - a) / (p * p)} + ${a}$，而 $${root} = ${p} \\cdot ${t} + ${r}$ 模 ${p} 同余于 ${r}。`,
            ],
          );
        }),
    ),
    point(
      "counting-square-roots-modulo-a-prime-power",
      ["Counting square roots modulo a prime power", "模素数幂的平方根个数"],
      [
        "For an odd prime $p$ and a number $a$ not divisible by $p$, Hensel's lemma says each square root of $a$ modulo $p$ lifts uniquely, because the derivative $2x$ is not divisible by $p$. So $x^2 \\equiv a \\pmod{p^k}$ has exactly as many solutions as it has modulo $p$: two when $a$ is a quadratic residue, and none otherwise, for every $k$. For $a = 2$ and $p = 7$, the squares $3^{2} = 9$ and $4^{2} = 16$ leave 2, so there are two roots modulo every power of 7.\n\nCheck: modulo 49 the roots are $10$ and $39$: $10^{2} = 100 = 2 \\cdot 49 + 2$ and $39^{2} = 1521 = 31 \\cdot 49 + 2$.\n\n> **Watch out.** The number of roots does not grow with $k$. Each root modulo $p$ has exactly one lift, so a higher power gives neither more roots nor fewer.",
        "对奇素数 $p$ 和不被 $p$ 整除的 $a$，亨泽尔引理说 $a$ 模 $p$ 的每个平方根都能唯一提升，因为导数 $2x$ 不被 $p$ 整除。所以 $x^2 \\equiv a \\pmod{p^k}$ 的解数与模 $p$ 相同：$a$ 是二次剩余时两个，否则没有，对每个 $k$ 都如此。对 $a = 2$，$p = 7$，平方 $3^{2} = 9$ 和 $4^{2} = 16$ 都余 2，所以模 7 的每个幂都有两个根。\n\n检验：模 49 的根是 $10$ 和 $39$：$10^{2} = 100 = 2 \\cdot 49 + 2$，$39^{2} = 1521 = 31 \\cdot 49 + 2$。\n\n> **注意。** 根的个数不随 $k$ 增长。模 $p$ 的每个根恰好有一个提升，所以更高的幂既不多出根，也不少根。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([3, 5, 7, 11, 13]);
          const k = rng.int(2, 4);
          const a = rng.int(1, p - 1);
          const answer = legendre(a, p) === 1 ? 2 : 0;
          const multiple = a + p * rng.int(0, 3);
          const half = (p - 1) / 2;
          const r = Array.from({ length: p - 1 }, (_, i) => i + 1).find((x) => (x * x) % p === a);
          const squares = [...new Set(Array.from({ length: half }, (_, i) => ((i + 1) * (i + 1)) % p))].sort((x, y) => x - y);
          return worked(
            [
              `How many solutions does $x^2 \\equiv ${multiple} \\pmod{${p}^{${k}}}$ have?`,
              `$x^2 \\equiv ${multiple} \\pmod{${p}^{${k}}}$ 有多少个解？`,
            ],
            answer,
            [
              [
                answer === 2 ? 0 : 2,
                answer === 2
                  ? `${a} is a square modulo ${p}, so there are roots to lift.`
                  : `${a} is not a square modulo ${p}, so there is no root to lift.`,
                answer === 2 ? `${a} 是模 ${p} 的平方，所以有根可以提升。` : `${a} 不是模 ${p} 的平方，所以没有根可以提升。`,
              ],
              [
                1,
                `Roots modulo an odd prime come in pairs $\\pm x$, so there cannot be just one.`,
                `模奇素数的根成对出现 $\\pm x$，不可能只有一个。`,
              ],
              [
                k,
                "That ties the count to the exponent; the number of roots does not grow with the power.",
                "那把个数与指数挂钩了；根的个数不随幂次增长。",
              ],
              [
                2 * k,
                "That lets each power add two roots; each root modulo the prime has exactly one lift.",
                "那让每升一次幂多两个根；模素数的每个根恰好只有一个提升。",
              ],
            ],
            [
              [
                ["Reduce modulo the prime", "模素数约化"],
                multiple === a
                  ? [
                      `${a} is already a remainder modulo ${p}, and it is not divisible by ${p}.`,
                      `${a} 已是模 ${p} 的余数，且不被 ${p} 整除。`,
                    ]
                  : [`$${multiple} \\equiv ${a} \\pmod{${p}}$.`, `$${multiple} \\equiv ${a} \\pmod{${p}}$。`],
              ],
              [
                ["Decide whether it is a square", "判断是否是平方"],
                [
                  `Euler's criterion: $${pw(a, half)} \\equiv ${answer === 2 ? "1" : "-1"} \\pmod{${p}}$, so ${a} is ${answer === 2 ? "" : "not "}a quadratic residue.`,
                  `欧拉判别法：$${pw(a, half)} \\equiv ${answer === 2 ? "1" : "-1"} \\pmod{${p}}$，所以 ${a} ${answer === 2 ? "是" : "不是"}二次剩余。`,
                ],
              ],
              [
                ["Lift", "提升"],
                [
                  answer === 2
                    ? `The derivative $2x$ is not divisible by ${p}, so each of the two roots lifts uniquely: ${answer} solutions.`
                    : "With no root modulo the prime, there is no solution modulo any power of it.",
                  answer === 2
                    ? `导数 $2x$ 不被 ${p} 整除，所以两个根各自唯一提升：共 ${answer} 个解。`
                    : "模素数无根，模它的任何幂也无解。",
                ],
              ],
            ],
            r === undefined
              ? [
                  `The nonzero squares modulo ${p} are $${squares.join(", ")}$, and ${a} is not among them.`,
                  `模 ${p} 的非零平方是 $${squares.join(", ")}$，其中没有 ${a}。`,
                ]
              : [
                  `$${r}^{2} = ${r * r}$ and $${p - r}^{2} = ${(p - r) * (p - r)}$ both leave ${a} on division by ${p}, so there are two roots to lift.`,
                  `$${r}^{2} = ${r * r}$ 与 $${p - r}^{2} = ${(p - r) * (p - r)}$ 除以 ${p} 都余 ${a}，所以有两个根可以提升。`,
                ],
          );
        }),
    ),
  ],
);

const mersenne = topic(
  "mersenne-and-fermat-numbers",
  ["Mersenne and Fermat Numbers", "梅森数和费马数"],
  ["Factor numbers near powers of two, and connect them to perfect numbers.", "分解接近 2 的幂的数，并把它们与完全数联系起来。"],
  ["perfect-numbers", "fermats-little-theorem"],
  [],
  [
    point(
      "a-factor-of-two-to-a-composite-power",
      ["A factor of two to a composite power", "2 的合数次幂减一的因子"],
      [
        "If $d$ divides $n$, then $2^d - 1$ divides $2^n - 1$, by the factorization of $x^k - 1$ with $x = 2^d$. So a Mersenne number $2^n - 1$ can be prime only when $n$ is prime. For $n = 15 = 3 \\cdot 5$, the divisor 3 gives the factor $2^{3} - 1 = 7$ of $2^{15} - 1 = 32767$.\n\nCheck: $7 \\cdot 4681 = 32767$.\n\n> **Watch out.** The converse fails: $2^{11} - 1 = 2047 = 23 \\cdot 89$ even though 11 is prime. A prime exponent is necessary, not enough.",
        "如果 $d$ 整除 $n$，那么 $2^d - 1$ 整除 $2^n - 1$，这由 $x^k - 1$（$x = 2^d$）的因式分解得出。所以梅森数 $2^n - 1$ 只有当 $n$ 是素数时才可能是素数。对 $n = 15 = 3 \\cdot 5$，因数 3 给出 $2^{15} - 1 = 32767$ 的因子 $2^{3} - 1 = 7$。\n\n检验：$7 \\cdot 4681 = 32767$。\n\n> **注意。** 反过来不成立：11 是素数，但 $2^{11} - 1 = 2047 = 23 \\cdot 89$。素数指数是必要条件，不是充分条件。",
      ],
      (rng) =>
        until(() => {
          const d = rng.pick([3, 5, 7, 11, 13]);
          const k = rng.pick([3, 5, 7, 9, 11, 13, 15, 17, 19, 21]);
          const n = d * k;
          let s = 2;
          while (n % s !== 0) s += 1;
          const m = n / s;
          const answer = 2 ** s - 1;
          const misses: Miss[] = [
            [2 ** s, `That is $2^{${s}}$ itself; the factor is one less than the power.`, `那是 $2^{${s}}$ 本身；因子比这个幂小一。`],
            [
              2 ** s + 1,
              `That is $2^{${s}} + 1$; the factorization of $x^k - 1$ gives the factor $x - 1$, not $x + 1$.`,
              `那是 $2^{${s}} + 1$；$x^k - 1$ 的分解给出的因子是 $x - 1$，不是 $x + 1$。`,
            ],
            [
              2 ** (s - 1),
              `That is $2^{${s - 1}}$, an even number, which cannot divide the odd number $2^{${n}} - 1$.`,
              `那是 $2^{${s - 1}}$，是偶数，不可能整除奇数 $2^{${n}} - 1$。`,
            ],
          ];
          if (m <= 30)
            misses.unshift([
              2 ** m - 1,
              `That is the factor $2^{${m}} - 1$ from the divisor ${m}, not from the smallest divisor ${s}.`,
              `那是由因数 ${m} 得到的因子 $2^{${m}} - 1$，不是由最小因数 ${s} 得到的。`,
            ]);
          return worked(
            [
              `Take the smallest divisor of ${n} above 1. Which factor of $2^{${n}} - 1$ does that divisor give?`,
              `取 ${n} 大于 1 的最小因数。这个因数给出 $2^{${n}} - 1$ 的哪个因子？`,
            ],
            answer,
            misses,
            [
              [
                ["Find the smallest divisor", "找最小因数"],
                [
                  `${n} is odd, and the smallest divisor above 1 is ${s}, with $${n} = ${s} \\cdot ${m}$.`,
                  `${n} 是奇数，大于 1 的最小因数是 ${s}，$${n} = ${s} \\cdot ${m}$。`,
                ],
              ],
              [
                ["Factor the difference of powers", "分解幂差"],
                [
                  `With $x = 2^{${s}}$, $2^{${n}} - 1 = x^{${m}} - 1 = (x - 1)(x^{${m - 1}} + \\cdots + x + 1)$, so $x - 1 = ${answer}$ is a factor.`,
                  `令 $x = 2^{${s}}$，则 $2^{${n}} - 1 = x^{${m}} - 1 = (x - 1)(x^{${m - 1}} + \\cdots + x + 1)$，所以 $x - 1 = ${answer}$ 是因子。`,
                ],
              ],
            ],
            [
              `Modulo ${answer}, $2^{${s}} \\equiv 1$, so $2^{${n}} = (2^{${s}})^{${m}} \\equiv 1$, and ${answer} divides $2^{${n}} - 1$.`,
              `模 ${answer} 时 $2^{${s}} \\equiv 1$，所以 $2^{${n}} = (2^{${s}})^{${m}} \\equiv 1$，即 ${answer} 整除 $2^{${n}} - 1$。`,
            ],
          );
        }),
    ),
    point(
      "an-even-perfect-number",
      ["An even perfect number", "偶完全数"],
      [
        "Euclid showed that when $2^p - 1$ is prime, the number $2^{p-1} (2^p - 1)$ is perfect, and Euler showed that every even perfect number has this form. So each Mersenne prime gives one even perfect number. For $p = 3$, $2^{3} - 1 = 7$ is prime and $N = 2^{2} \\cdot 7 = 28$; its divisors below 28 are $1, 2, 4, 7, 14$, which add up to 28.\n\nCheck: $\\sigma(28) = \\sigma(4) \\, \\sigma(7) = 7 \\cdot 8 = 56 = 2 \\cdot 28$.\n\n> **Watch out.** The Mersenne number must be prime. For $p = 11$, $2^{11} - 1 = 23 \\cdot 89$, and $2^{10} \\cdot 2047$ is not perfect. No odd perfect number is known, and their existence has not been ruled out.",
        "欧几里得证明：当 $2^p - 1$ 是素数时，$2^{p-1} (2^p - 1)$ 是完全数；欧拉证明每个偶完全数都是这种形式。所以每个梅森素数对应一个偶完全数。对 $p = 3$，$2^{3} - 1 = 7$ 是素数，$N = 2^{2} \\cdot 7 = 28$；它小于 28 的因子 $1, 2, 4, 7, 14$ 之和是 28。\n\n检验：$\\sigma(28) = \\sigma(4) \\, \\sigma(7) = 7 \\cdot 8 = 56 = 2 \\cdot 28$。\n\n> **注意。** 梅森数必须是素数。对 $p = 11$，$2^{11} - 1 = 23 \\cdot 89$，$2^{10} \\cdot 2047$ 不是完全数。至今没有发现奇完全数，也没有人证明它不存在。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5, 7, 13, 17, 19]);
          const m = 2 ** p - 1;
          const half = 2 ** (p - 1);
          const perfect = half * m;
          const kind = rng.int(0, 3);
          const given: Pair = [
            `$2^{${p}} - 1 = ${m}$ is prime, and $N = ${pw(2, p - 1)} \\cdot ${m}$.`,
            `$2^{${p}} - 1 = ${m}$ 是素数，$N = ${pw(2, p - 1)} \\cdot ${m}$。`,
          ];
          const sigmaSteps: Walk[] = [
            [
              ["Use multiplicativity", "用积性"],
              [
                `$\\sigma(N) = \\sigma(${pw(2, p - 1)}) \\, \\sigma(${m})$, since the two factors are coprime.`,
                `$\\sigma(N) = \\sigma(${pw(2, p - 1)}) \\, \\sigma(${m})$，因为两个因数互素。`,
              ],
            ],
            [
              ["Sum each factor", "分别求和"],
              [
                `$\\sigma(${pw(2, p - 1)}) = 2^{${p}} - 1 = ${m}$ and $\\sigma(${m}) = ${m} + 1 = ${m + 1}$.`,
                `$\\sigma(${pw(2, p - 1)}) = 2^{${p}} - 1 = ${m}$，$\\sigma(${m}) = ${m} + 1 = ${m + 1}$。`,
              ],
            ],
            [
              ["Multiply", "相乘"],
              [`$${m} \\cdot ${m + 1} = ${2 * perfect}$.`, `$${m} \\cdot ${m + 1} = ${2 * perfect}$。`],
            ],
          ];
          if (kind === 0) {
            return worked(
              [`${given[0]} What is $N$?`, `${given[1]}$N$ 是多少？`],
              perfect,
              [
                [
                  2 ** p * m,
                  `That uses $2^{${p}}$; the power of 2 in $N$ is one less, $${pw(2, p - 1)}$.`,
                  `那用了 $2^{${p}}$；$N$ 中 2 的幂要小一，是 $${pw(2, p - 1)}$。`,
                ],
                [
                  m * m,
                  "That squares the Mersenne prime instead of multiplying it by the power of 2.",
                  "那把梅森素数平方了，而不是乘以 2 的幂。",
                ],
                [half + m, "That adds the two factors instead of multiplying them.", "那把两个因数相加了，而不是相乘。"],
              ],
              [
                [
                  ["Evaluate the power", "算出幂"],
                  [`$${pw(2, p - 1)} = ${half}$.`, `$${pw(2, p - 1)} = ${half}$。`],
                ],
                [
                  ["Multiply", "相乘"],
                  [`$N = ${half} \\cdot ${m} = ${perfect}$.`, `$N = ${half} \\cdot ${m} = ${perfect}$。`],
                ],
              ],
              [
                `$\\sigma(N) = ${m} \\cdot ${m + 1} = ${2 * perfect} = 2 \\cdot ${perfect}$, so $N$ is perfect, as Euclid's theorem says.`,
                `$\\sigma(N) = ${m} \\cdot ${m + 1} = ${2 * perfect} = 2 \\cdot ${perfect}$，所以 $N$ 是完全数，正如欧几里得定理所说。`,
              ],
            );
          }
          if (kind === 1) {
            return worked(
              [`${given[0]} How many positive divisors does $N$ have?`, `${given[1]}$N$ 有多少个正因子？`],
              2 * p,
              [
                [p, `That counts only the powers of 2, from $1$ to $${pw(2, p - 1)}$.`, `那只数了 2 的幂，从 $1$ 到 $${pw(2, p - 1)}$。`],
                [
                  p + 1,
                  "That adds the choices for the two factors instead of multiplying them.",
                  "那把两个因数的选择数相加了，而不是相乘。",
                ],
                [
                  2 * p - 2,
                  `That uses the exponent ${p - 1} without adding one, which leaves out the zeroth power.`,
                  `那直接用了指数 ${p - 1}，没有加一，漏掉了零次幂。`,
                ],
                [2 * p - 1, "That leaves out one divisor, probably $1$ or $N$ itself.", "那漏掉了一个因子，多半是 $1$ 或 $N$ 本身。"],
              ],
              [
                [
                  ["Read the exponents", "读出指数"],
                  [
                    `$N = ${pw(2, p - 1)} \\cdot ${m}$ has exponents ${p - 1} and 1.`,
                    `$N = ${pw(2, p - 1)} \\cdot ${m}$ 的指数是 ${p - 1} 和 1。`,
                  ],
                ],
                [
                  ["Add one and multiply", "加一后相乘"],
                  [`$(${p - 1} + 1)(1 + 1) = ${p} \\cdot 2 = ${2 * p}$.`, `$(${p - 1} + 1)(1 + 1) = ${p} \\cdot 2 = ${2 * p}$。`],
                ],
              ],
              [
                `The divisors are the ${p} powers of 2 from $1$ to $${half}$, and the ${p} numbers ${m} times as large: ${p} + ${p} = ${2 * p}.`,
                `这些因子是从 $1$ 到 $${half}$ 的 ${p} 个 2 的幂，以及它们各乘 ${m} 得到的 ${p} 个数：${p} + ${p} = ${2 * p}。`,
              ],
            );
          }
          if (kind === 2) {
            return worked(
              [
                `${given[0]} What is the sum $\\sigma(N)$ of all positive divisors of $N$?`,
                `${given[1]}$N$ 的所有正因子之和 $\\sigma(N)$ 是多少？`,
              ],
              2 * perfect,
              [
                [
                  perfect,
                  "That is the sum of the divisors other than $N$; $\\sigma(N)$ includes $N$ itself.",
                  "那是除 $N$ 外的因子之和；$\\sigma(N)$ 还包括 $N$ 本身。",
                ],
                [2 * perfect - 1, "That leaves out the divisor $1$.", "那漏掉了因子 $1$。"],
                [2 * perfect + m, `That counts the divisor ${m} twice.`, `那把因子 ${m} 数了两次。`],
              ],
              sigmaSteps,
              [
                `A perfect number has $\\sigma(N) = 2N$, and $2 \\cdot ${perfect} = ${2 * perfect}$.`,
                `完全数满足 $\\sigma(N) = 2N$，而 $2 \\cdot ${perfect} = ${2 * perfect}$。`,
              ],
            );
          }
          return worked(
            [
              `${given[0]} What is the sum of the positive divisors of $N$ other than $N$ itself?`,
              `${given[1]}除 $N$ 本身外，$N$ 的正因子之和是多少？`,
            ],
            perfect,
            [
              [2 * perfect, "That is $\\sigma(N)$, which still includes $N$ itself.", "那是 $\\sigma(N)$，其中还包括 $N$ 本身。"],
              [perfect - 1, "That leaves out the divisor $1$.", "那漏掉了因子 $1$。"],
              [perfect + m, `That counts the divisor ${m} twice.`, `那把因子 ${m} 数了两次。`],
            ],
            [
              ...sigmaSteps,
              [
                ["Take away $N$", "减去 $N$"],
                [`$${2 * perfect} - ${perfect} = ${perfect}$.`, `$${2 * perfect} - ${perfect} = ${perfect}$。`],
              ],
            ],
            [
              `$N = ${half} \\cdot ${m} = ${perfect}$ is perfect, so its other divisors add up to $N$ itself.`,
              `$N = ${half} \\cdot ${m} = ${perfect}$ 是完全数，所以其余因子之和正是 $N$。`,
            ],
          );
        }),
    ),
    point(
      "fermat-numbers-are-coprime",
      ["Fermat numbers are coprime", "费马数互素"],
      [
        "The Fermat numbers are $F_n = 2^{2^n} + 1$. They satisfy $F_0 F_1 \\cdots F_{n-1} = F_n - 2$, so any common factor of two of them would divide 2, and they are odd. Hence they are pairwise coprime, which gives another proof that there are infinitely many primes. For example $F_0 F_1 F_2 = 3 \\cdot 5 \\cdot 17 = 255$ and $F_3 = 257$.\n\nCheck: $255 = 257 - 2$, as the identity says.\n\n> **Watch out.** The identity subtracts 2, not 1: the product is $F_n - 2 = 2^{2^n} - 1$, the difference of squares $(2^{2^{n-1}} - 1)(2^{2^{n-1}} + 1)$ unfolded.",
        "费马数是 $F_n = 2^{2^n} + 1$。它们满足 $F_0 F_1 \\cdots F_{n-1} = F_n - 2$，所以其中任意两个的公因子都整除 2，而它们都是奇数。因此它们两两互素，这又证明了素数有无穷多个。例如 $F_0 F_1 F_2 = 3 \\cdot 5 \\cdot 17 = 255$，而 $F_3 = 257$。\n\n检验：$255 = 257 - 2$，与恒等式一致。\n\n> **注意。** 恒等式减的是 2 而不是 1：乘积是 $F_n - 2 = 2^{2^n} - 1$，即平方差 $(2^{2^{n-1}} - 1)(2^{2^{n-1}} + 1)$ 逐层展开。",
      ],
      (rng) =>
        until(() => {
          const fermat = (n: number) => 2 ** (2 ** n) + 1;
          if (rng.bool()) {
            const n = rng.int(2, 5);
            const F = fermat(n);
            const list = Array.from({ length: n }, (_, i) => fermat(i));
            return worked(
              [
                `Given $F_{${n}} = ${F}$, what is the product $F_0 F_1 \\cdots F_{${n - 1}}$?`,
                `已知 $F_{${n}} = ${F}$，乘积 $F_0 F_1 \\cdots F_{${n - 1}}$ 是多少？`,
              ],
              F - 2,
              [
                [F, `That is $F_{${n}}$ itself; the product falls 2 short of it.`, `那是 $F_{${n}}$ 本身；乘积比它小 2。`],
                [F - 1, `That subtracts 1; the product is $F_{${n}} - 2$.`, `那减的是 1；乘积是 $F_{${n}} - 2$。`],
                [F + 2, "That adds 2 instead of subtracting it.", "那是加 2，而不是减 2。"],
              ],
              [
                [
                  ["Recall the identity", "回顾恒等式"],
                  [
                    `$F_0 F_1 \\cdots F_{n-1} = F_n - 2$, by induction: $(F_{n-1} - 2) F_{n-1} = 2^{2^n} - 1 = F_n - 2$.`,
                    `$F_0 F_1 \\cdots F_{n-1} = F_n - 2$，由归纳法：$(F_{n-1} - 2) F_{n-1} = 2^{2^n} - 1 = F_n - 2$。`,
                  ],
                ],
                [
                  ["Apply it", "代入"],
                  [`$F_{${n}} - 2 = ${F} - 2 = ${F - 2}$.`, `$F_{${n}} - 2 = ${F} - 2 = ${F - 2}$。`],
                ],
              ],
              [`Multiplying directly, $${list.join(" \\cdot ")} = ${F - 2}$.`, `直接相乘，$${list.join(" \\cdot ")} = ${F - 2}$。`],
            );
          }
          const n = rng.int(1, 4);
          const c = rng.int(2, 9);
          const [F, E] = [fermat(n), fermat(n - 1)];
          const answer = gcd(c * F, E);
          const r = (c * F) % E;
          return worked(
            [
              `With $F_{${n}} = ${F}$ and $F_{${n - 1}} = ${E}$, what is $\\gcd(${c} F_{${n}}, F_{${n - 1}})$?`,
              `已知 $F_{${n}} = ${F}$，$F_{${n - 1}} = ${E}$，$\\gcd(${c} F_{${n}}, F_{${n - 1}})$ 是多少？`,
            ],
            answer,
            [
              [F, `That is $F_{${n}}$, which shares no factor with $F_{${n - 1}}$.`, `那是 $F_{${n}}$，它与 $F_{${n - 1}}$ 没有公因子。`],
              [
                c,
                `That assumes ${c} divides $F_{${n - 1}}$; only the common part of ${c} and ${E} counts.`,
                `那假定 ${c} 整除 $F_{${n - 1}}$；只有 ${c} 与 ${E} 的公共部分才算。`,
              ],
              [
                E,
                `That is $F_{${n - 1}}$ itself, which would have to divide $${c} F_{${n}}$.`,
                `那是 $F_{${n - 1}}$ 本身，那样它就得整除 $${c} F_{${n}}$。`,
              ],
              [2, "Fermat numbers are odd, so 2 cannot divide them.", "费马数都是奇数，2 不可能整除它们。"],
            ],
            [
              [
                ["Drop the Fermat factor", "去掉费马数因子"],
                [
                  `$F_{${n}}$ and $F_{${n - 1}}$ are coprime, so $\\gcd(${c} F_{${n}}, F_{${n - 1}}) = \\gcd(${c}, ${E})$.`,
                  `$F_{${n}}$ 与 $F_{${n - 1}}$ 互素，所以 $\\gcd(${c} F_{${n}}, F_{${n - 1}}) = \\gcd(${c}, ${E})$。`,
                ],
              ],
              [
                ["Finish", "算完"],
                [`$\\gcd(${c}, ${E}) = ${answer}$.`, `$\\gcd(${c}, ${E}) = ${answer}$。`],
              ],
            ],
            [
              `By the Euclidean algorithm, $${c * F} = ${E} \\cdot ${Math.floor((c * F) / E)} + ${r}$, so the gcd is $\\gcd(${E}, ${r}) = ${answer}$.`,
              `由欧几里得算法，$${c * F} = ${E} \\cdot ${Math.floor((c * F) / E)} + ${r}$，所以最大公因数是 $\\gcd(${E}, ${r}) = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const CARMICHAEL = [561, 1105, 1729, 2465, 2821, 6601, 8911, 10585, 15841, 29341, 41041];

const pseudoprimes = topic(
  "pseudoprimes-and-carmichael-numbers",
  ["Pseudoprimes and Carmichael Numbers", "伪素数和卡迈克尔数"],
  ["See how composite numbers can pass the Fermat test.", "了解合数如何能通过费马检验。"],
  ["the-order-of-an-integer-modulo-n"],
  [],
  [
    point(
      "a-witness-or-a-liar",
      ["A witness or a liar", "证人还是说谎者"],
      [
        "If $a^{n-1}$ is not 1 modulo $n$, then $a$ is a witness that $n$ is composite. If $n$ is composite and yet $a^{n-1} \\equiv 1$, then $a$ is called a Fermat liar, and $n$ a pseudoprime to base $a$. For $n = 15$ and $a = 4$: $4^{2} = 16 \\equiv 1$, so $4^{14} = (4^{2})^{7} \\equiv 1 \\pmod{15}$, and 4 is a liar for the composite 15.\n\nCheck: the order of 4 modulo 15 is 2, and 2 divides $15 - 1 = 14$, which is exactly when the power comes out as 1.\n\n> **Watch out.** Passing the test does not prove that a number is prime. Only a failure is conclusive: a single witness proves the number composite.",
        "如果 $a^{n-1}$ 模 $n$ 不是 1，$a$ 就是 $n$ 为合数的证人。如果 $n$ 是合数却有 $a^{n-1} \\equiv 1$，$a$ 就称为费马说谎者，$n$ 称为以 $a$ 为底的伪素数。对 $n = 15$，$a = 4$：$4^{2} = 16 \\equiv 1$，所以 $4^{14} = (4^{2})^{7} \\equiv 1 \\pmod{15}$，4 是合数 15 的说谎者。\n\n检验：4 模 15 的阶是 2，而 2 整除 $15 - 1 = 14$，这正是幂等于 1 的条件。\n\n> **注意。** 通过检验并不能证明一个数是素数。只有不通过才是确定的：一个证人就证明了这个数是合数。",
      ],
      (rng) => {
        const [n, a] = rng.pick([
          [15, 4],
          [15, 2],
          [15, 11],
          [21, 8],
          [21, 2],
          [25, 7],
          [25, 2],
          [28, 9],
          [28, 3],
          [33, 10],
          [33, 2],
          [35, 6],
          [35, 2],
          [39, 14],
          [39, 2],
          [45, 17],
          [45, 2],
          [49, 18],
          [49, 2],
          [51, 16],
          [51, 2],
          [85, 4],
          [85, 2],
          [91, 3],
          [91, 2],
          [341, 2],
          [341, 3],
          [561, 2],
        ] as const);
        const value = powMod(a, n - 1, n);
        const order = orderMod(a, n);
        const liar: Pair = [`${a} is a Fermat liar for ${n}`, `${a} 是 ${n} 的费马说谎者`];
        const witness: Pair = [`${a} is a witness that ${n} is composite`, `${a} 是 ${n} 为合数的证人`];
        const factors = factorize(n)
          .map(([p, e]) => pw(p, e))
          .join(" \\cdot ");
        const isLiar = value === 1;
        const wrong: Slip[] = [
          isLiar
            ? [witness, "A witness gives a power other than 1; here the power is 1.", "证人给出的幂不是 1；这里幂等于 1。"]
            : [liar, "A liar gives the power 1, as a prime would; here the power is not 1.", "说谎者像素数那样给出幂 1；这里幂不是 1。"],
          [
            [`This proves ${n} is prime`, `这证明 ${n} 是素数`],
            `${n} is composite, and no Fermat test can prove a number prime.`,
            `${n} 是合数，任何费马检验都不能证明一个数是素数。`,
          ],
          [
            [`This says nothing about base ${a}`, `这对底 ${a} 没有任何说明`],
            `The value of the power decides whether ${a} is a liar or a witness.`,
            `幂的值决定了 ${a} 是说谎者还是证人。`,
          ],
        ];
        return chosen(
          rng,
          [
            `The number ${n} is composite, and $${a}^{${n - 1}} \\equiv ${value} \\pmod{${n}}$. Which statement is correct?`,
            `${n} 是合数，并且 $${a}^{${n - 1}} \\equiv ${value} \\pmod{${n}}$。哪个说法正确？`,
          ],
          isLiar ? liar : witness,
          wrong,
          [
            [
              ["Note that the number is composite", "注意它是合数"],
              [`$${n} = ${factors}$, and ${a} is coprime to it.`, `$${n} = ${factors}$，且 ${a} 与它互素。`],
            ],
            [
              ["Read the power", "看幂的值"],
              isLiar
                ? [
                    `The power is 1, as it would be for a prime, so the test is fooled and ${a} is a liar.`,
                    `幂等于 1，就像素数那样，所以检验被骗过了，${a} 是说谎者。`,
                  ]
                : [
                    `The power is ${value}, not 1, which cannot happen for a prime and a coprime base, so ${a} is a witness.`,
                    `幂是 ${value} 而不是 1，这对素数和互素的底不可能发生，所以 ${a} 是证人。`,
                  ],
            ],
          ],
          isLiar
            ? [
                `The order of ${a} modulo ${n} is ${order}, and ${order} divides ${n - 1}, so the power is 1.`,
                `${a} 模 ${n} 的阶是 ${order}，${order} 整除 ${n - 1}，所以幂等于 1。`,
              ]
            : [
                `The order of ${a} modulo ${n} is ${order}, and $${n - 1} = ${order} \\cdot ${Math.floor((n - 1) / order)} + ${(n - 1) % order}$, so the power cannot be 1.`,
                `${a} 模 ${n} 的阶是 ${order}，而 $${n - 1} = ${order} \\cdot ${Math.floor((n - 1) / order)} + ${(n - 1) % order}$，所以幂不可能是 1。`,
              ],
        );
      },
    ),
    point(
      "korselts-criterion",
      ["Korselt's criterion", "科塞特判据"],
      [
        "A Carmichael number is a composite that passes the Fermat test for every base coprime to it. Korselt's criterion says that $n$ is one exactly when $n$ is squarefree and $p - 1$ divides $n - 1$ for each prime $p$ dividing $n$. The smallest example is $561 = 3 \\cdot 11 \\cdot 17$: here $2$, $10$ and $16$ all divide $560$.\n\nCheck: $560 = 2 \\cdot 280 = 10 \\cdot 56 = 16 \\cdot 35$.\n\n> **Watch out.** Every prime has to pass. $91 = 7 \\cdot 13$ has $6$ dividing $90$, but $12$ does not, so 91 is not a Carmichael number.",
        "卡迈克尔数是对每个与它互素的底都能通过费马检验的合数。科塞特判据说：$n$ 是卡迈克尔数，当且仅当 $n$ 无平方因子，且对 $n$ 的每个素因子 $p$，$p - 1$ 整除 $n - 1$。最小的例子是 $561 = 3 \\cdot 11 \\cdot 17$：这里 $2$、$10$、$16$ 都整除 $560$。\n\n检验：$560 = 2 \\cdot 280 = 10 \\cdot 56 = 16 \\cdot 35$。\n\n> **注意。** 每个素因子都必须满足。$91 = 7 \\cdot 13$ 中 $6$ 整除 $90$，但 $12$ 不整除，所以 91 不是卡迈克尔数。",
      ],
      (rng) =>
        until(() => {
          const carmichael = rng.pick(CARMICHAEL);
          const primes = factorize(carmichael).map(([p]) => p);
          const prime = rng.pick(primes);
          const askValue = rng.bool();
          const answer = (carmichael - 1) / (prime - 1);
          const shown = primes.join(" \\cdot ");
          if (askValue) {
            return worked(
              [
                `The Carmichael number ${carmichael} has the prime factor ${prime}. What is $(${carmichael} - 1) \\div (${prime} - 1)$?`,
                `卡迈克尔数 ${carmichael} 有素因子 ${prime}。$(${carmichael} - 1) \\div (${prime} - 1)$ 是多少？`,
              ],
              answer,
              [
                [
                  carmichael / prime,
                  `That divides ${carmichael} by ${prime}; the criterion divides one less by one less.`,
                  `那是 ${carmichael} 除以 ${prime}；判据是两者各减 1 再相除。`,
                ],
                [
                  carmichael - 1,
                  `That is $${carmichael} - 1$ before dividing by $${prime} - 1$.`,
                  `那是还没除以 $${prime} - 1$ 的 $${carmichael} - 1$。`,
                ],
                [prime - 1, `That is the divisor $${prime} - 1$, not the quotient.`, `那是除数 $${prime} - 1$，不是商。`],
              ],
              [
                [
                  ["Subtract one from each", "各减一"],
                  [
                    `$${carmichael} - 1 = ${carmichael - 1}$ and $${prime} - 1 = ${prime - 1}$.`,
                    `$${carmichael} - 1 = ${carmichael - 1}$，$${prime} - 1 = ${prime - 1}$。`,
                  ],
                ],
                [
                  ["Divide", "相除"],
                  [
                    `Korselt's criterion says this comes out whole: $${carmichael - 1} \\div ${prime - 1} = ${answer}$.`,
                    `科塞特判据说结果是整数：$${carmichael - 1} \\div ${prime - 1} = ${answer}$。`,
                  ],
                ],
              ],
              [`$${prime - 1} \\cdot ${answer} = ${carmichael - 1}$.`, `$${prime - 1} \\cdot ${answer} = ${carmichael - 1}$。`],
            );
          }
          const others = rng.sample([15, 21, 45, 91, 341, 1387], 3);
          return chosen(
            rng,
            ["Which of these numbers is a Carmichael number?", "下面哪个数是卡迈克尔数？"],
            same(String(carmichael)),
            others.map((v): Slip => [same(String(v)), ...korseltFailure(v)]),
            [
              [
                ["Factor", "分解"],
                [`$${carmichael} = ${shown}$, which is squarefree.`, `$${carmichael} = ${shown}$，无平方因子。`],
              ],
              [
                ["Test each prime", "逐个检验素因子"],
                [
                  `${primes.map((p) => `$${p - 1}$`).join(", ")} all divide $${carmichael - 1}$, so Korselt's criterion holds.`,
                  `${primes.map((p) => `$${p - 1}$`).join("、")} 都整除 $${carmichael - 1}$，所以满足科塞特判据。`,
                ],
              ],
            ],
            [
              `As a Carmichael number must, ${carmichael} passes the Fermat test to base 2: $2^{${carmichael - 1}} \\equiv ${powMod(2, carmichael - 1, carmichael)} \\pmod{${carmichael}}$.`,
              `作为卡迈克尔数，${carmichael} 能通过以 2 为底的费马检验：$2^{${carmichael - 1}} \\equiv ${powMod(2, carmichael - 1, carmichael)} \\pmod{${carmichael}}$。`,
            ],
          );
        }),
    ),
  ],
);

const jacobiTopic = topic(
  "the-jacobi-symbol",
  ["The Jacobi Symbol", "雅可比符号"],
  ["Extend the Legendre symbol to odd composites, and compute it without factoring.", "把勒让德符号推广到奇合数，不分解也能计算。"],
  ["quadratic-reciprocity"],
  [],
  [
    point(
      "the-symbol-from-a-factorization",
      ["The symbol from a factorization", "由分解求符号"],
      [
        "For an odd $n = p_1 p_2 \\cdots p_k$, the Jacobi symbol is the product of the Legendre symbols of $a$ modulo each $p_i$. A value of $-1$ proves that $a$ is not a square modulo $n$. For $\\left( \\frac{2}{15} \\right)$: modulo 3, $2 \\equiv -1$, and modulo 5, $2^{2} = 4 \\equiv -1$, so the symbol is $(-1)(-1) = 1$.\n\nCheck: the squares modulo 3 are $1$ and those modulo 5 are $1, 4$; 2 is in neither list, so both Legendre symbols are $-1$.\n\n> **Watch out.** A value of $+1$ proves nothing, since two minus signs can cancel: $\\left( \\frac{2}{15} \\right) = 1$, yet 2 is not a square modulo 15.",
        "对奇数 $n = p_1 p_2 \\cdots p_k$，雅可比符号是 $a$ 模每个 $p_i$ 的勒让德符号之积。值为 $-1$ 证明 $a$ 模 $n$ 不是平方数。求 $\\left( \\frac{2}{15} \\right)$：模 3 时 $2 \\equiv -1$，模 5 时 $2^{2} = 4 \\equiv -1$，所以符号是 $(-1)(-1) = 1$。\n\n检验：模 3 的平方是 $1$，模 5 的平方是 $1, 4$；2 都不在其中，所以两个勒让德符号都是 $-1$。\n\n> **注意。** 值为 $+1$ 不能说明什么，因为两个负号可以抵消：$\\left( \\frac{2}{15} \\right) = 1$，但 2 不是模 15 的平方数。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = rng.sample([3, 5, 7, 11, 13], 2) as [number, number];
          const n = p * q;
          let a = rng.int(2, 30);
          while (gcd(a, n) !== 1) a++;
          const [x, y] = [legendre(a, p), legendre(a, q)];
          const answer = x * y;
          const euler = (r: number) =>
            a % r === 1
              ? `$${a} \\equiv 1 \\pmod{${r}}$, a square, so the symbol is 1`
              : `$${pw(a % r, (r - 1) / 2)} \\equiv ${legendre(a, r)} \\pmod{${r}}$`;
          const eulerZh = (r: number) =>
            a % r === 1
              ? `$${a} \\equiv 1 \\pmod{${r}}$，是平方，符号为 1`
              : `$${pw(a % r, (r - 1) / 2)} \\equiv ${legendre(a, r)} \\pmod{${r}}$`;
          const squares = (r: number) =>
            [...new Set(Array.from({ length: (r - 1) / 2 }, (_, i) => ((i + 1) * (i + 1)) % r))].sort((u, v) => u - v);
          const among = (r: number) => (legendre(a, r) === 1 ? "is" : "is not");
          return worked(
            [
              `What is the Jacobi symbol $\\left( \\frac{${a}}{${n}} \\right)$?`,
              `雅可比符号 $\\left( \\frac{${a}}{${n}} \\right)$ 是多少？`,
            ],
            answer,
            [
              [-answer, "That has one of the Legendre symbols with the wrong sign.", "那把其中一个勒让德符号的符号弄反了。"],
              [
                0,
                `The symbol is 0 only when ${a} shares a factor with ${n}, and here they are coprime.`,
                `只有 ${a} 与 ${n} 有公因子时符号才是 0，而这里它们互素。`,
              ],
              [
                x,
                `That is the Legendre symbol modulo ${p} alone; the factor modulo ${q} is left out.`,
                `那只是模 ${p} 的勒让德符号；漏掉了模 ${q} 的因子。`,
              ],
              [
                y,
                `That is the Legendre symbol modulo ${q} alone; the factor modulo ${p} is left out.`,
                `那只是模 ${q} 的勒让德符号；漏掉了模 ${p} 的因子。`,
              ],
            ],
            [
              [
                ["Factor the modulus", "分解模数"],
                [`$${n} = ${p} \\cdot ${q}$.`, `$${n} = ${p} \\cdot ${q}$。`],
              ],
              [
                ["Apply Euler's criterion", "用欧拉判别法"],
                [`${euler(p)}; ${euler(q)}.`, `${eulerZh(p)}；${eulerZh(q)}。`],
              ],
              [
                ["Multiply", "相乘"],
                [`$(${x})(${y}) = ${answer}$.`, `$(${x})(${y}) = ${answer}$。`],
              ],
            ],
            [
              `The nonzero squares modulo ${p} are $${squares(p).join(", ")}$ and modulo ${q} are $${squares(q).join(", ")}$. ${a} reduces to ${a % p} and ${a % q}, which ${among(p)} a square modulo ${p} and ${among(q)} a square modulo ${q}, matching the signs.`,
              `模 ${p} 的非零平方是 $${squares(p).join(", ")}$，模 ${q} 的是 $${squares(q).join(", ")}$。${a} 分别化为 ${a % p} 和 ${a % q}，前者${legendre(a, p) === 1 ? "是" : "不是"}模 ${p} 的平方，后者${legendre(a, q) === 1 ? "是" : "不是"}模 ${q} 的平方，与符号相符。`,
            ],
          );
        }),
    ),
    point(
      "what-a-plus-one-means",
      ["What a plus one means", "加一意味着什么"],
      [
        "The Jacobi symbol obeys reciprocity, so it can be computed quickly, as in the Euclidean algorithm, without factoring. But a value of $+1$ leaves open whether $a$ is a square modulo $n$. The number $a$ is a square modulo $n$ only when it is a residue for every prime factor of $n$. For $a = 4$ and $n = 15$, 4 is a square modulo both 3 and 5, so it is a square modulo 15; indeed $2^{2} = 4$.\n\nCheck: for $a = 2$ and $n = 15$ the symbol is also $+1$, but the squares modulo 15 of the units are $1$ and $4$, so 2 is not a square.\n\n> **Watch out.** The Jacobi symbol alone cannot tell these two cases apart. Only the Legendre symbols for each prime settle the question.",
        "雅可比符号服从互反律，所以可以像欧几里得算法那样快速计算，不必分解。但值为 $+1$ 时，$a$ 模 $n$ 是否为平方数仍不确定。只有当它对 $n$ 的每个素因子都是剩余时，才是模 $n$ 的平方数。对 $a = 4$，$n = 15$，4 模 3 和模 5 都是平方，所以它是模 15 的平方；确实 $2^{2} = 4$。\n\n检验：对 $a = 2$，$n = 15$，符号同样是 $+1$，但与 15 互素的数的平方模 15 只有 $1$ 和 $4$，所以 2 不是平方数。\n\n> **注意。** 单凭雅可比符号无法区分这两种情形。只有每个素因子的勒让德符号才能定论。",
      ],
      (rng) => {
        const [p, q] = rng.sample([3, 5, 7, 11, 13], 2) as [number, number];
        const n = p * q;
        const options = Array.from({ length: n - 1 }, (_, i) => i + 1).filter((v) => gcd(v, n) === 1);
        const a = rng.pick(options);
        const symbol = jacobi(a, n);
        const [x, y] = [legendre(a, p), legendre(a, q)];
        const isSquare = x === 1 && y === 1;
        const squareText: Pair = [`${a} is a square modulo ${n}`, `${a} 是模 ${n} 的平方数`];
        const notText: Pair = [`${a} is not a square modulo ${n}`, `${a} 不是模 ${n} 的平方数`];
        const root = options.find((v) => (v * v) % n === a);
        const bad = x === -1 ? p : q;
        const badSquares = [...new Set(Array.from({ length: (bad - 1) / 2 }, (_, i) => ((i + 1) * (i + 1)) % bad))].sort((u, v) => u - v);
        return chosen(
          rng,
          [
            `The Jacobi symbol of ${a} over $${n} = ${p} \\cdot ${q}$ is ${symbol}, with Legendre symbols ${x} modulo ${p} and ${y} modulo ${q}. What follows?`,
            `${a} 对 $${n} = ${p} \\cdot ${q}$ 的雅可比符号是 ${symbol}，勒让德符号模 ${p} 是 ${x}，模 ${q} 是 ${y}。可以得出什么？`,
          ],
          isSquare ? squareText : notText,
          [
            isSquare
              ? [
                  notText,
                  "Both Legendre symbols are 1, so there are square roots modulo each prime.",
                  "两个勒让德符号都是 1，所以模每个素数都有平方根。",
                ]
              : [
                  squareText,
                  "A square modulo the product would also be a square modulo each prime, but one Legendre symbol is $-1$.",
                  "模乘积的平方数模每个素数也是平方数，但有一个勒让德符号是 $-1$。",
                ],
            [
              ["Nothing can be concluded", "无法得出结论"],
              "The Jacobi symbol alone would leave it open, but the Legendre symbols for both primes are given and settle it.",
              "单凭雅可比符号确实无法确定，但两个素数的勒让德符号都已给出，足以定论。",
            ],
          ],
          [
            [
              ["Look at each prime", "看每个素数"],
              [`The Legendre symbols are ${x} modulo ${p} and ${y} modulo ${q}.`, `勒让德符号模 ${p} 是 ${x}，模 ${q} 是 ${y}。`],
            ],
            [
              ["Combine", "合起来"],
              isSquare
                ? [
                    "Both are 1, so square roots exist modulo each prime, and the Chinese remainder theorem combines them.",
                    "两个都是 1，所以模每个素数都有平方根，由中国剩余定理把它们合起来。",
                  ]
                : [
                    "Some Legendre symbol is $-1$, so there is no square root modulo that prime, and hence none modulo the product.",
                    "有一个勒让德符号是 $-1$，所以模那个素数没有平方根，因而模乘积也没有。",
                  ],
            ],
          ],
          root !== undefined
            ? root * root < n
              ? [`Indeed $${root}^{2} = ${a}$.`, `确实 $${root}^{2} = ${a}$。`]
              : [
                  `Indeed $${root}^{2} = ${root * root} = ${n} \\cdot ${(root * root - a) / n} + ${a}$.`,
                  `确实 $${root}^{2} = ${root * root} = ${n} \\cdot ${(root * root - a) / n} + ${a}$。`,
                ]
            : [
                `The nonzero squares modulo ${bad} are $${badSquares.join(", ")}$, and ${a} reduces to ${a % bad}, which is not among them.`,
                `模 ${bad} 的非零平方是 $${badSquares.join(", ")}$，而 ${a} 化为 ${a % bad}，不在其中。`,
              ],
        );
      },
    ),
  ],
);

const convolution = topic(
  "dirichlet-convolution",
  ["Dirichlet Convolution", "狄利克雷卷积"],
  ["Combine arithmetic functions by summing over the divisors.", "通过对因子求和来组合算术函数。"],
  ["the-mobius-function"],
  [],
  [
    point(
      "computing-a-convolution",
      ["Computing a convolution", "计算卷积"],
      [
        "The Dirichlet convolution of $f$ and $g$ is $(f * g)(n) = \\sum_{d \\mid n} f(d) g(n / d)$. Many familiar functions arise this way: with $\\mathbf{1}$ the constant function 1, we have $\\mathbf{1} * \\mathbf{1} = \\tau$, the number of divisors, and $\\mathbf{1} * \\operatorname{id} = \\sigma$, the sum of divisors. For $n = 6$, $(\\mathbf{1} * \\operatorname{id})(6) = 6 + 3 + 2 + 1 = 12$, one term for each divisor $d = 1, 2, 3, 6$.\n\nCheck: the convolution of multiplicative functions is multiplicative, so $\\sigma(6) = \\sigma(2) \\, \\sigma(3) = 3 \\cdot 4 = 12$.\n\n> **Watch out.** Each term pairs $d$ with its complement $\\frac{n}{d}$: the first function is evaluated at $d$ and the second at $\\frac{n}{d}$, not both at $d$.",
        "$f$ 和 $g$ 的狄利克雷卷积是 $(f * g)(n) = \\sum_{d \\mid n} f(d) g(n / d)$。许多熟悉的函数都这样产生：记 $\\mathbf{1}$ 为常数函数 1，则 $\\mathbf{1} * \\mathbf{1} = \\tau$（因子个数），$\\mathbf{1} * \\operatorname{id} = \\sigma$（因子和）。对 $n = 6$，$(\\mathbf{1} * \\operatorname{id})(6) = 6 + 3 + 2 + 1 = 12$，每个因子 $d = 1, 2, 3, 6$ 各贡献一项。\n\n检验：积性函数的卷积仍是积性的，所以 $\\sigma(6) = \\sigma(2) \\, \\sigma(3) = 3 \\cdot 4 = 12$。\n\n> **注意。** 每一项把 $d$ 与它的补因子 $\\frac{n}{d}$ 配对：第一个函数在 $d$ 处取值，第二个在 $\\frac{n}{d}$ 处取值，而不是都在 $d$ 处。",
      ],
      (rng) =>
        until(() => {
          const n = rng.pick([6, 8, 10, 12, 14, 15, 18, 20, 21, 22, 24, 26, 28, 30, 36]);
          const ds = divisors(n);
          const kind = rng.int(0, 2);
          const tau = ds.length;
          const sum = ds.reduce((x, d) => x + d, 0);
          const terms = ds.map((d) => (kind === 0 ? d * (n / d) : kind === 1 ? n / d : d * totient(n / d)));
          const answer = terms.reduce((x, y) => x + y, 0);
          const name =
            kind === 0
              ? "\\operatorname{id} * \\operatorname{id}"
              : kind === 1
                ? "\\mathbf{1} * \\operatorname{id}"
                : "\\operatorname{id} * \\varphi";
          const term = kind === 0 ? "d \\cdot \\frac{n}{d} = n" : kind === 1 ? "\\frac{n}{d}" : "d \\, \\varphi(\\frac{n}{d})";
          const local = (p: number, e: number) =>
            kind === 0 ? (e + 1) * p ** e : kind === 1 ? (p ** (e + 1) - 1) / (p - 1) : p ** e + e * (p ** e - p ** (e - 1));
          const closed = kind === 0 ? "(e + 1) p^e" : kind === 1 ? "\\frac{p^{e+1} - 1}{p - 1}" : "p^e + e (p^e - p^{e-1})";
          const factors = factorize(n);
          const values = factors.map(([p, e]) => local(p, e));
          const misses: Miss[] =
            kind === 0
              ? [
                  [n, `That keeps one term; every divisor gives a term equal to ${n}.`, `那只保留了一项；每个因子都给出一项 ${n}。`],
                  [tau, `That counts the terms without their value ${n}.`, `那只数了项数，没有乘每项的值 ${n}。`],
                  [
                    sum,
                    "That is $\\mathbf{1} * \\operatorname{id} = \\sigma$, with the constant function in place of the first $\\operatorname{id}$.",
                    "那是 $\\mathbf{1} * \\operatorname{id} = \\sigma$，把第一个 $\\operatorname{id}$ 换成了常数函数。",
                  ],
                ]
              : kind === 1
                ? [
                    [
                      tau,
                      "That is $\\mathbf{1} * \\mathbf{1} = \\tau$, which counts the divisors instead of adding them.",
                      "那是 $\\mathbf{1} * \\mathbf{1} = \\tau$，数的是因子个数，不是因子之和。",
                    ],
                    [sum - n, `That leaves out the divisor ${n} itself.`, `那漏掉了因子 ${n} 本身。`],
                    [sum - 1, "That leaves out the divisor 1.", "那漏掉了因子 1。"],
                  ]
                : [
                    [
                      n,
                      "That is $\\mathbf{1} * \\varphi = \\operatorname{id}$, with the constant function in place of $\\operatorname{id}$.",
                      "那是 $\\mathbf{1} * \\varphi = \\operatorname{id}$，把 $\\operatorname{id}$ 换成了常数函数。",
                    ],
                    [
                      sum,
                      "That is $\\operatorname{id} * \\mathbf{1} = \\sigma$, which leaves out $\\varphi$.",
                      "那是 $\\operatorname{id} * \\mathbf{1} = \\sigma$，漏掉了 $\\varphi$。",
                    ],
                    [
                      tau * n,
                      "That replaces $\\varphi(\\frac{n}{d})$ by $\\frac{n}{d}$, which gives $\\operatorname{id} * \\operatorname{id}$.",
                      "那把 $\\varphi(\\frac{n}{d})$ 换成了 $\\frac{n}{d}$，得到的是 $\\operatorname{id} * \\operatorname{id}$。",
                    ],
                  ];
          return worked(
            [`With $\\operatorname{id}(n) = n$, what is $(${name})(${n})$?`, `记 $\\operatorname{id}(n) = n$，$(${name})(${n})$ 是多少？`],
            answer,
            misses,
            [
              [
                ["List the divisors", "列出因子"],
                [
                  `The divisors of ${n} are $${ds.join(", ")}$, and each $d$ gives the term $${term}$.`,
                  `${n} 的因子是 $${ds.join(", ")}$，每个 $d$ 给出一项 $${term}$。`,
                ],
              ],
              [
                ["Add the terms", "各项相加"],
                [`$${terms.join(" + ")} = ${answer}$.`, `$${terms.join(" + ")} = ${answer}$。`],
              ],
            ],
            [
              `The convolution is multiplicative, and on a prime power $p^e$ it equals $${closed}$. Over $${n} = ${factors.map(([p, e]) => pw(p, e)).join(" \\cdot ")}$ this gives $${values.join(" \\cdot ")}${values.length > 1 ? ` = ${answer}` : ""}$.`,
              `这个卷积是积性的，在素数幂 $p^e$ 上等于 $${closed}$。对 $${n} = ${factors.map(([p, e]) => pw(p, e)).join(" \\cdot ")}$，得 $${values.join(" \\cdot ")}${values.length > 1 ? ` = ${answer}` : ""}$。`,
            ],
          );
        }),
    ),
    point(
      "the-inverse-of-one",
      ["The inverse of one", "常数 1 的逆"],
      [
        "Convolution has an identity $\\varepsilon$, equal to 1 at $n = 1$ and 0 elsewhere. The Möbius function is the inverse of $\\mathbf{1}$: the sum $\\sum_{d \\mid n} \\mu(d)$ is 1 when $n = 1$ and 0 otherwise. Convolving with $\\mu$ undoes a divisor sum, which is what Möbius inversion does: from $\\mathbf{1} * \\varphi = \\operatorname{id}$ it gives $\\mu * \\operatorname{id} = \\varphi$. For $n = 12$, $\\sum_{d \\mid 12} \\mu(d) \\frac{12}{d} = 12 - 6 - 4 + 2 = 4 = \\varphi(12)$.\n\nCheck: $\\varphi(12) = 12 (1 - \\frac{1}{2})(1 - \\frac{1}{3}) = 4$, and the divisors $4$ and $12$, which are not squarefree, add nothing because $\\mu$ is 0 there.\n\n> **Watch out.** The signs matter. Dropping them adds $12 + 6 + 4 + 2 = 24$, which undoes nothing.",
        "卷积有单位元 $\\varepsilon$，它在 $n = 1$ 时为 1，其他情况为 0。默比乌斯函数是 $\\mathbf{1}$ 的逆：和 $\\sum_{d \\mid n} \\mu(d)$ 在 $n = 1$ 时为 1，否则为 0。与 $\\mu$ 作卷积能撤销因子求和，这正是默比乌斯反演所做的事：由 $\\mathbf{1} * \\varphi = \\operatorname{id}$ 得到 $\\mu * \\operatorname{id} = \\varphi$。对 $n = 12$，$\\sum_{d \\mid 12} \\mu(d) \\frac{12}{d} = 12 - 6 - 4 + 2 = 4 = \\varphi(12)$。\n\n检验：$\\varphi(12) = 12 (1 - \\frac{1}{2})(1 - \\frac{1}{3}) = 4$；因子 $4$ 和 $12$ 不是无平方因子数，$\\mu$ 在那里为 0，不贡献。\n\n> **注意。** 符号很重要。去掉符号相加得 $12 + 6 + 4 + 2 = 24$，什么也没有撤销。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(2, 60);
          const c = rng.int(2, 9);
          const useOne = rng.bool();
          const value = useOne ? 0 : totient(n);
          const answer = c * value;
          const squarefree = divisors(n).filter((d) => mobius(d) !== 0);
          const signed = (f: (d: number) => number) =>
            squarefree.map((d, i) => (i === 0 ? `${f(d)}` : `${mobius(d) === 1 ? "+" : "-"} ${f(d)}`)).join(" ");
          const primes = factorize(n).map(([p]) => p);
          const psi = squarefree.reduce((x, d) => x + n / d, 0);
          if (useOne) {
            return worked(
              [`What is $${c} \\sum_{d \\mid ${n}} \\mu(d)$?`, `$${c} \\sum_{d \\mid ${n}} \\mu(d)$ 是多少？`],
              answer,
              [
                [
                  c,
                  `That uses the value at $n = 1$; the sum is 1 only there, and ${n} is not 1.`,
                  `那用的是 $n = 1$ 时的值；只有那时和才是 1，而 ${n} 不是 1。`,
                ],
                [
                  c * squarefree.length,
                  "That drops the signs of $\\mu(d)$ and counts the squarefree divisors.",
                  "那去掉了 $\\mu(d)$ 的符号，数的是无平方因子的因子。",
                ],
                [
                  c * divisors(n).length,
                  "That treats every $\\mu(d)$ as 1, which gives the number of divisors.",
                  "那把每个 $\\mu(d)$ 都当成 1，得到的是因子个数。",
                ],
              ],
              [
                [
                  ["Recognize the convolution", "认出卷积"],
                  [
                    `$\\sum_{d \\mid ${n}} \\mu(d) = (\\mu * \\mathbf{1})(${n}) = \\varepsilon(${n})$.`,
                    `$\\sum_{d \\mid ${n}} \\mu(d) = (\\mu * \\mathbf{1})(${n}) = \\varepsilon(${n})$。`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `Since ${n} is not 1, $\\varepsilon(${n}) = 0$, and $${c} \\cdot 0 = 0$.`,
                    `因为 ${n} 不是 1，$\\varepsilon(${n}) = 0$，而 $${c} \\cdot 0 = 0$。`,
                  ],
                ],
              ],
              [
                `Only the squarefree divisors $${squarefree.join(", ")}$ count, with signs $${signed(() => 1)} = 0$.`,
                `只有无平方因子的因子 $${squarefree.join(", ")}$ 起作用，带符号相加 $${signed(() => 1)} = 0$。`,
              ],
            );
          }
          return worked(
            [
              `What is $${c} \\sum_{d \\mid ${n}} \\mu(d) \\frac{${n}}{d}$?`,
              `$${c} \\sum_{d \\mid ${n}} \\mu(d) \\frac{${n}}{d}$ 是多少？`,
            ],
            answer,
            [
              [value, `That is the sum alone, without the factor ${c}.`, `那只是和本身，漏掉了因子 ${c}。`],
              [
                c * n,
                "That uses $\\mathbf{1} * \\varphi = \\operatorname{id}$; the Möbius function undoes that sum instead.",
                "那用的是 $\\mathbf{1} * \\varphi = \\operatorname{id}$；默比乌斯函数恰好撤销这个和。",
              ],
              [c * psi, "That drops the signs of $\\mu(d)$.", "那去掉了 $\\mu(d)$ 的符号。"],
            ],
            [
              [
                ["Recognize the convolution", "认出卷积"],
                [
                  `The sum is $(\\mu * \\operatorname{id})(${n})$, which by Möbius inversion of $\\mathbf{1} * \\varphi = \\operatorname{id}$ is $\\varphi(${n})$.`,
                  `这个和是 $(\\mu * \\operatorname{id})(${n})$，由 $\\mathbf{1} * \\varphi = \\operatorname{id}$ 的默比乌斯反演，它等于 $\\varphi(${n})$。`,
                ],
              ],
              [
                ["Compute the totient", "计算欧拉函数"],
                [
                  `Using the prime ${primes.length === 1 ? "factor" : "factors"} $${primes.join(", ")}$, $\\varphi(${n}) = ${value}$.`,
                  `由 ${n} 的素因子 $${primes.join(", ")}$ 得 $\\varphi(${n}) = ${value}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [`$${c} \\cdot ${value} = ${answer}$.`, `$${c} \\cdot ${value} = ${answer}$。`],
              ],
            ],
            [
              `Directly, the squarefree divisors give $${signed((d) => n / d)} = ${value}$, and $${c} \\cdot ${value} = ${answer}$.`,
              `直接计算，无平方因子的因子给出 $${signed((d) => n / d)} = ${value}$，而 $${c} \\cdot ${value} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const farey = topic(
  "farey-sequences",
  ["Farey Sequences", "法里数列"],
  ["List fractions by size, and use the determinant rule for neighbors.", "按大小排列分数，并利用相邻分数的行列式规则。"],
  ["computing-and-counting-with-the-totient"],
  [],
  [
    point(
      "the-next-fraction-by-the-mediant",
      ["The next fraction by the mediant", "用中位分数求下一个分数"],
      [
        "The Farey sequence of order $n$ lists the reduced fractions in $[0, 1]$ with denominator at most $n$. Neighbors $\\frac{a}{b}, \\frac{c}{d}$ satisfy $b c - a d = 1$. The first fraction to appear between them, as the order grows, is their mediant $\\frac{a + c}{b + d}$. For the neighbors $\\frac{1}{3}$ and $\\frac{1}{2}$, the mediant is $\\frac{2}{5}$.\n\nCheck: $3 - 2 = 1$ shows they are neighbors, and $\\frac{2}{5}$ is a neighbor of each: $5 - 2 \\cdot 2 = 1$ and $2 \\cdot 3 - 5 = 1$.\n\n> **Watch out.** Do not average the fractions. Their average $\\frac{5}{12}$ also lies between them, but its denominator is larger, so it appears only later.",
        "$n$ 阶法里数列列出 $[0, 1]$ 中分母不超过 $n$ 的最简分数。相邻分数 $\\frac{a}{b}, \\frac{c}{d}$ 满足 $b c - a d = 1$。随着阶数增大，第一个出现在它们之间的分数是中位分数 $\\frac{a + c}{b + d}$。对相邻分数 $\\frac{1}{3}$ 和 $\\frac{1}{2}$，中位分数是 $\\frac{2}{5}$。\n\n检验：$3 - 2 = 1$ 说明它们相邻，而 $\\frac{2}{5}$ 与两者都相邻：$5 - 2 \\cdot 2 = 1$，$2 \\cdot 3 - 5 = 1$。\n\n> **注意。** 不要取平均。平均值 $\\frac{5}{12}$ 也在它们之间，但分母更大，要更晚才出现。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(2, 15);
          const a = rng.pick(Array.from({ length: b - 1 }, (_, i) => i + 1).filter((v) => gcd(v, b) === 1));
          let [c, d] = [1, 1];
          for (let y = 2; y <= b + 1; y++) {
            const x = (a * y + 1) / b;
            if (Number.isInteger(x) && x <= y) {
              [c, d] = [x, y];
              break;
            }
          }
          const answer = Q.of(a + c, b + d);
          return worked(
            [
              `The fractions $\\frac{${a}}{${b}}$ and $\\frac{${c}}{${d}}$ are Farey neighbors. Which fraction appears first between them?`,
              `$\\frac{${a}}{${b}}$ 和 $\\frac{${c}}{${d}}$ 是法里相邻分数。它们之间最先出现的分数是什么？`,
            ],
            answer,
            [
              [
                Q.of(a * d + b * c, 2 * b * d),
                "That is the average of the two fractions; it lies between them but has a larger denominator.",
                "那是两个分数的平均值；它在两者之间，但分母更大。",
              ],
              [Q.of(a + c, b * d), "That multiplies the denominators instead of adding them.", "那把分母相乘了，而不是相加。"],
              [Q.of(a * c, b + d), "That multiplies the numerators instead of adding them.", "那把分子相乘了，而不是相加。"],
              [
                Q.of(a + 1, b + 1),
                "That adds 1 to the top and bottom of the first fraction, which ignores the second one.",
                "那给第一个分数的分子分母各加 1，忽略了第二个分数。",
              ],
            ],
            [
              [
                ["Confirm the neighbors", "确认相邻"],
                [`$${b} \\cdot ${c} - ${a} \\cdot ${d} = ${b * c - a * d}$.`, `$${b} \\cdot ${c} - ${a} \\cdot ${d} = ${b * c - a * d}$。`],
              ],
              [
                ["Form the mediant", "构造中位分数"],
                [`$\\frac{${a} + ${c}}{${b} + ${d}} = ${answer.toLatex()}$.`, `$\\frac{${a} + ${c}}{${b} + ${d}} = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `The mediant is a neighbor of both: $${a + c} \\cdot ${b} - ${a} \\cdot ${b + d} = 1$ and $${c} \\cdot ${b + d} - ${d} \\cdot ${a + c} = 1$. A fraction strictly between neighbors needs a denominator of at least $${b} + ${d} = ${b + d}$, so none comes earlier.`,
              `中位分数与两者都相邻：$${a + c} \\cdot ${b} - ${a} \\cdot ${b + d} = 1$，$${c} \\cdot ${b + d} - ${d} \\cdot ${a + c} = 1$。严格位于相邻分数之间的分数，分母至少是 $${b} + ${d} = ${b + d}$，所以没有更早的。`,
            ],
          );
        }),
    ),
    point(
      "the-length-of-a-farey-sequence",
      ["The length of a Farey sequence", "法里数列的长度"],
      [
        "The fractions in the Farey sequence with denominator exactly $k > 1$ number $\\varphi(k)$, because the numerators are the residues coprime to $k$. Counting 0 and 1 separately gives the length $1 + \\sum_{k=1}^{n} \\varphi(k)$. This grows like $\\frac{3 n^2}{\\pi^2}$, connecting fractions and the density of coprime pairs. For $n = 5$: $1 + (1 + 1 + 2 + 2 + 4) = 11$.\n\nCheck: listing them, $0, \\frac{1}{5}, \\frac{1}{4}, \\frac{1}{3}, \\frac{2}{5}, \\frac{1}{2}, \\frac{3}{5}, \\frac{2}{3}, \\frac{3}{4}, \\frac{4}{5}, 1$, eleven fractions.\n\n> **Watch out.** Count only fractions in lowest terms: $\\frac{2}{4}$ is the same point as $\\frac{1}{2}$. Counting every numerator up to each denominator overcounts.",
        "法里数列中分母恰为 $k > 1$ 的分数有 $\\varphi(k)$ 个，因为分子是与 $k$ 互素的剩余。把 0 和 1 单独计入，长度是 $1 + \\sum_{k=1}^{n} \\varphi(k)$。它按 $\\frac{3 n^2}{\\pi^2}$ 增长，把分数和互素数对的密度联系起来。对 $n = 5$：$1 + (1 + 1 + 2 + 2 + 4) = 11$。\n\n检验：列出来是 $0, \\frac{1}{5}, \\frac{1}{4}, \\frac{1}{3}, \\frac{2}{5}, \\frac{1}{2}, \\frac{3}{5}, \\frac{2}{3}, \\frac{3}{4}, \\frac{4}{5}, 1$，共十一个。\n\n> **注意。** 只数最简分数：$\\frac{2}{4}$ 与 $\\frac{1}{2}$ 是同一个点。对每个分母把所有分子都数一遍会数多。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(3, 28);
          const phis = Array.from({ length: n }, (_, i) => totient(i + 1));
          const sum = phis.reduce((x, y) => x + y, 0);
          const answer = 1 + sum;
          return worked(
            [
              `How many fractions does the Farey sequence of order ${n} have, including 0 and 1?`,
              `${n} 阶法里数列有多少个分数（包括 0 和 1）？`,
            ],
            answer,
            [
              [
                sum,
                "That leaves out the fraction 0; the sum of the totients counts 1 but not 0.",
                "那漏掉了分数 0；欧拉函数之和数到了 1，却没有数 0。",
              ],
              [
                answer + 1,
                "That counts 1 twice, once on its own and once as $\\varphi(1)$.",
                "那把 1 数了两次：单独一次，作为 $\\varphi(1)$ 又一次。",
              ],
              [
                Math.floor((n * (n + 1)) / 2) + 1,
                "That counts every numerator up to each denominator, including fractions not in lowest terms.",
                "那对每个分母数了所有分子，包括不是最简的分数。",
              ],
            ],
            [
              [
                ["Count by denominator", "按分母计数"],
                [
                  `$\\varphi(1), \\ldots, \\varphi(${n})$ are $${phis.join(", ")}$, which add up to ${sum}.`,
                  `$\\varphi(1), \\ldots, \\varphi(${n})$ 是 $${phis.join(", ")}$，和为 ${sum}。`,
                ],
              ],
              [
                ["Add the fraction 0", "加上分数 0"],
                [`$1 + ${sum} = ${answer}$.`, `$1 + ${sum} = ${answer}$。`],
              ],
            ],
            [
              `The sequence is symmetric about $\\frac{1}{2}$: apart from $\\frac{1}{2}$ itself, its fractions pair up as $x$ and $1 - x$, so its length must be odd, and ${answer} is odd.`,
              `这个数列关于 $\\frac{1}{2}$ 对称：除 $\\frac{1}{2}$ 本身外，分数按 $x$ 与 $1 - x$ 配对，所以长度必为奇数，而 ${answer} 正是奇数。`,
            ],
          );
        }),
    ),
  ],
);

const approximations = topic(
  "best-rational-approximations",
  ["Best Rational Approximations", "最佳有理逼近"],
  ["Compute convergents of a continued fraction and measure how close they get.", "计算连分数的渐近分数，并衡量它们有多接近。"],
  ["continued-fractions"],
  [],
  [
    point(
      "the-next-convergent",
      ["The next convergent", "下一个渐近分数"],
      [
        "Convergents of a continued fraction satisfy $p_k = a_k p_{k-1} + p_{k-2}$ and $q_k = a_k q_{k-1} + q_{k-2}$. So each new partial quotient builds the next fraction directly from the two before it, without any need to expand the nested fraction again from the bottom. For $\\sqrt{2} = [1; 2, 2, \\ldots]$ the convergents $1$ and $\\frac{3}{2}$ with $a_2 = 2$ give $\\frac{2 \\cdot 3 + 1}{2 \\cdot 2 + 1} = \\frac{7}{5}$.\n\nCheck: expanding from the bottom, $1 + \\frac{1}{2 + \\frac{1}{2}} = 1 + \\frac{2}{5} = \\frac{7}{5}$.\n\n> **Watch out.** The partial quotient multiplies the latest convergent only. Adding numerators and denominators, $\\frac{1 + 3}{1 + 2}$, ignores $a_2$ entirely.",
        "连分数的渐近分数满足 $p_k = a_k p_{k-1} + p_{k-2}$，$q_k = a_k q_{k-1} + q_{k-2}$。所以每个新的部分商直接由前两个分数构造出下一个分数，不必再从底部重新展开嵌套分数。对 $\\sqrt{2} = [1; 2, 2, \\ldots]$，渐近分数 $1$ 和 $\\frac{3}{2}$ 以及 $a_2 = 2$ 给出 $\\frac{2 \\cdot 3 + 1}{2 \\cdot 2 + 1} = \\frac{7}{5}$。\n\n检验：从底部展开，$1 + \\frac{1}{2 + \\frac{1}{2}} = 1 + \\frac{2}{5} = \\frac{7}{5}$。\n\n> **注意。** 部分商只乘最近的渐近分数。把分子分母分别相加得 $\\frac{1 + 3}{1 + 2}$，完全忽略了 $a_2$。",
      ],
      (rng) =>
        until(() => {
          const a0 = rng.int(1, 5);
          const a1 = rng.int(2, 7);
          const a2 = rng.int(1, 9);
          const [p0, q0] = [a0, 1];
          const [p1, q1] = [a0 * a1 + 1, a1];
          const [p2, q2] = [a2 * p1 + p0, a2 * q1 + q0];
          const answer = Q.of(p2, q2);
          const inner = a2 === 1 ? `${a1} + 1` : `${a1} + \\frac{1}{${a2}}`;
          return worked(
            [
              `A continued fraction has convergents $${p0}$ and $\\frac{${p1}}{${q1}}$, and the next partial quotient is ${a2}. What is the next convergent?`,
              `一个连分数的渐近分数是 $${p0}$ 和 $\\frac{${p1}}{${q1}}$，下一个部分商是 ${a2}。下一个渐近分数是什么？`,
            ],
            answer,
            [
              [
                Q.of(p1 + p0, q1 + q0),
                "That adds the numerators and the denominators, which ignores the partial quotient.",
                "那把分子分母分别相加，忽略了部分商。",
              ],
              [
                Q.of(a2 * p0 + p1, a2 * q0 + q1),
                "That multiplies the older convergent by the partial quotient instead of the latest one.",
                "那用部分商乘了较早的渐近分数，而不是最近的那个。",
              ],
              [
                Q.of(p2 + 1, q2),
                "That adds 1 to the numerator, as if the next term were added once more.",
                "那给分子多加了 1，好像又加了一项。",
              ],
              [
                Q.of(a2 * p1, a2 * q1 + 1),
                "That adds 1 to the denominator in place of the earlier convergent.",
                "那用 1 代替了较早的渐近分数加到分母上。",
              ],
            ],
            [
              [
                ["Numerator", "分子"],
                [`$p_2 = ${a2} \\cdot ${p1} + ${p0} = ${p2}$.`, `$p_2 = ${a2} \\cdot ${p1} + ${p0} = ${p2}$。`],
              ],
              [
                ["Denominator", "分母"],
                [`$q_2 = ${a2} \\cdot ${q1} + ${q0} = ${q2}$.`, `$q_2 = ${a2} \\cdot ${q1} + ${q0} = ${q2}$。`],
              ],
            ],
            [
              `The convergents come from $[${a0}; ${a1}, ${a2}]$, and expanding from the bottom gives $${a0} + \\frac{1}{${inner}} = ${a0} + \\frac{${a2}}{${q2}} = ${answer.toLatex()}$.`,
              `这些渐近分数来自 $[${a0}; ${a1}, ${a2}]$，从底部展开得 $${a0} + \\frac{1}{${inner}} = ${a0} + \\frac{${a2}}{${q2}} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "how-close-a-convergent-is",
      ["How close a convergent is", "渐近分数有多接近"],
      [
        "A convergent $\\frac{p}{q}$ of $x$ satisfies $|x - \\frac{p}{q}| < \\frac{1}{q^2}$, far closer than a typical fraction with that denominator. The next convergent, with denominator $q'$, lies at distance exactly $\\frac{1}{q q'}$ from it. In fact, no fraction with a smaller or equal denominator comes closer to $x$. For $\\pi$, the convergents $\\frac{22}{7}$ and $\\frac{333}{106}$ have $22 \\cdot 106 - 333 \\cdot 7 = 2332 - 2331 = 1$, so they are $\\frac{1}{742}$ apart.\n\nCheck: $\\frac{22}{7} \\approx 3.142857$ and $\\frac{333}{106} \\approx 3.141509$ differ by about $0.001348$, and $\\frac{1}{742} \\approx 0.001348$.\n\n> **Watch out.** The gap between consecutive convergents is $\\frac{1}{q q'}$, the product of both denominators; $\\frac{1}{q^2}$ is only a bound on the distance to $x$.",
        "$x$ 的渐近分数 $\\frac{p}{q}$ 满足 $|x - \\frac{p}{q}| < \\frac{1}{q^2}$，比同分母的一般分数接近得多。它与下一个渐近分数（分母为 $q'$）的距离恰为 $\\frac{1}{q q'}$。事实上，分母不超过它的分数都不会比它更接近 $x$。对 $\\pi$，渐近分数 $\\frac{22}{7}$ 与 $\\frac{333}{106}$ 满足 $22 \\cdot 106 - 333 \\cdot 7 = 2332 - 2331 = 1$，所以相距 $\\frac{1}{742}$。\n\n检验：$\\frac{22}{7} \\approx 3.142857$，$\\frac{333}{106} \\approx 3.141509$，相差约 $0.001348$，而 $\\frac{1}{742} \\approx 0.001348$。\n\n> **注意。** 相邻渐近分数的距离是 $\\frac{1}{q q'}$，用的是两个分母之积；$\\frac{1}{q^2}$ 只是到 $x$ 的距离的上界。",
      ],
      (rng) =>
        until(() => {
          const [q, next] = rng.pick([
            [1, 7],
            [7, 106],
            [7, 113],
            [1, 2],
            [2, 5],
            [5, 12],
            [12, 29],
            [29, 70],
            [3, 8],
            [8, 21],
            [21, 55],
            [1, 3],
            [3, 10],
            [10, 33],
            [2, 7],
            [7, 16],
            [16, 39],
            [4, 9],
            [9, 22],
            [5, 13],
            [13, 34],
            [34, 89],
            [6, 13],
            [13, 19],
            [19, 32],
            [11, 30],
            [30, 41],
          ] as const);
          const answer = Q.of(1, q * next);
          const low = q === 1 ? "p" : `\\frac{p}{${q}}`;
          return worked(
            [
              `Two consecutive convergents have denominators ${q} and ${next}. How far apart are they?`,
              `两个相邻的渐近分数，分母分别是 ${q} 和 ${next}。它们相距多远？`,
            ],
            answer,
            [
              [
                Q.of(1, q * q),
                "That is the bound $\\frac{1}{q^2}$ on the distance to $x$, not the gap between the convergents.",
                "那是到 $x$ 的距离的上界 $\\frac{1}{q^2}$，不是两个渐近分数之间的距离。",
              ],
              [
                Q.of(1, next * next),
                "That uses the later denominator twice; the gap uses both denominators.",
                "那把后一个分母用了两次；距离要用两个分母。",
              ],
              [
                Q.of(1, q + next),
                "That adds the denominators; the gap has their product below the line.",
                "那把分母相加了；距离的分母是它们的积。",
              ],
              [
                Q.of(2, q * next),
                "That takes the cross difference to be 2; for consecutive convergents it is $\\pm 1$.",
                "那把交叉差当成了 2；相邻渐近分数的交叉差是 $\\pm 1$。",
              ],
            ],
            [
              [
                ["Use the cross difference", "用交叉差"],
                [
                  `Consecutive convergents $${low}$ and $\\frac{p'}{${next}}$ have $p' \\cdot ${q} - p \\cdot ${next} = \\pm 1$.`,
                  `相邻渐近分数 $${low}$ 与 $\\frac{p'}{${next}}$ 满足 $p' \\cdot ${q} - p \\cdot ${next} = \\pm 1$。`,
                ],
              ],
              [
                ["Divide by the denominators", "除以分母"],
                [
                  `$\\left| \\frac{p'}{${next}} - ${low} \\right| = \\frac{1}{${q} \\cdot ${next}} = ${answer.toLatex()}$.`,
                  `$\\left| \\frac{p'}{${next}} - ${low} \\right| = \\frac{1}{${q} \\cdot ${next}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$x$ lies between the two convergents, so each is within $${answer.toLatex()}$ of $x$, and since ${next} is larger than ${q} this is below $\\frac{1}{${q * q === 1 ? "q^2" : q * q}}$, as the bound requires.`,
              `$x$ 位于两个渐近分数之间，所以每个与 $x$ 的距离都不超过 $${answer.toLatex()}$；由于 ${next} 大于 ${q}，这小于 $\\frac{1}{${q * q === 1 ? "q^2" : q * q}}$，与上界相符。`,
            ],
          );
        }),
    ),
  ],
);

const gaussian = topic(
  "gaussian-integers",
  ["Gaussian Integers", "高斯整数"],
  ["Factor in the numbers $a + bi$, using the norm to guide the search.", "在 $a + bi$ 中做因式分解，用范数指导搜索。"],
  ["sums-of-two-squares"],
  [],
  [
    point(
      "the-norm-is-multiplicative",
      ["The norm is multiplicative", "范数是乘性的"],
      [
        "The norm of $a + bi$ is $N(a + bi) = a^2 + b^2$, and it satisfies $N(zw) = N(z) N(w)$. So a factorization in the Gaussian integers gives a factorization of the norm in the ordinary integers. This turns a question about complex numbers into arithmetic with whole numbers. For $(2 + i)(1 + 2i)$ the norms are $5$ and $5$, so the product has norm $25$.\n\nCheck: $(2 + i)(1 + 2i) = 2 + 4i + i + 2i^2 = 5i$, and $N(5i) = 0^2 + 5^2 = 25$.\n\n> **Watch out.** The norm squares both parts and adds them; it is the square of the absolute value. Norms multiply, so adding $5 + 5$ gives nothing meaningful.",
        "$a + bi$ 的范数是 $N(a + bi) = a^2 + b^2$，它满足 $N(zw) = N(z) N(w)$。所以高斯整数中的分解给出范数在普通整数中的分解。这就把关于复数的问题变成了整数算术。对 $(2 + i)(1 + 2i)$，两个范数都是 $5$，所以乘积的范数是 $25$。\n\n检验：$(2 + i)(1 + 2i) = 2 + 4i + i + 2i^2 = 5i$，而 $N(5i) = 0^2 + 5^2 = 25$。\n\n> **注意。** 范数是把两部分各自平方再相加，是绝对值的平方。范数相乘，所以把 $5 + 5$ 相加没有意义。",
      ],
      (rng) =>
        until(() => {
          const [a, b, c, d] = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
          const [n1, n2] = [a * a + b * b, c * c + d * d];
          const product = `(${a} + ${b === 1 ? "" : b}i)(${c} + ${d === 1 ? "" : d}i)`;
          const answer = n1 * n2;
          const [re, im] = [a * c - b * d, a * d + b * c];
          return worked(
            [`What is the norm of $${product}$?`, `$${product}$ 的范数是多少？`],
            answer,
            [
              [
                n1 + n2,
                "That adds the two norms; the norm of a product is the product of the norms.",
                "那把两个范数相加了；乘积的范数是范数之积。",
              ],
              [re, "That is the real part of the product, not its norm.", "那是乘积的实部，不是范数。"],
              [(a + b) * (c + d), "That adds the parts without squaring them.", "那把各部分直接相加，没有平方。"],
            ],
            [
              [
                ["Find each norm", "求各自的范数"],
                [`$${a}^2 + ${b}^2 = ${n1}$ and $${c}^2 + ${d}^2 = ${n2}$.`, `$${a}^2 + ${b}^2 = ${n1}$，$${c}^2 + ${d}^2 = ${n2}$。`],
              ],
              [
                ["Multiply", "相乘"],
                [`$N(zw) = N(z) N(w) = ${n1} \\cdot ${n2} = ${answer}$.`, `$N(zw) = N(z) N(w) = ${n1} \\cdot ${n2} = ${answer}$。`],
              ],
            ],
            [
              `Multiplying out gives real part $${a * c} - ${b * d} = ${re}$ and imaginary part $${a * d} + ${b * c} = ${im}$, and $(${re})^2 + ${im}^2 = ${re * re} + ${im * im} = ${answer}$.`,
              `展开得实部 $${a * c} - ${b * d} = ${re}$，虚部 $${a * d} + ${b * c} = ${im}$，而 $(${re})^2 + ${im}^2 = ${re * re} + ${im * im} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "which-primes-stay-prime",
      ["Which primes stay prime", "哪些素数仍是素数"],
      [
        "An odd prime $p$ with $p \\equiv 1 \\pmod{4}$ splits as $(a + bi)(a - bi)$, since it is a sum of two squares. A prime with $p \\equiv 3 \\pmod{4}$ stays prime in the Gaussian integers. The prime 2 is a special case: it equals $-i (1 + i)^2$, a unit times a square. For example $13 = 2^2 + 3^2 = (2 + 3i)(2 - 3i)$, while $7$ stays prime.\n\nCheck: $(2 + 3i)(2 - 3i) = 4 - 9i^2 = 4 + 9 = 13$. And 7 is not a sum of two squares, since squares leave 0 or 1 on division by 4 and two of them never leave 3.\n\n> **Watch out.** Being prime among the ordinary integers does not make a number prime among the Gaussian integers; the remainder modulo 4 decides.",
        "满足 $p \\equiv 1 \\pmod{4}$ 的奇素数 $p$ 分解为 $(a + bi)(a - bi)$，因为它是两个平方数之和。满足 $p \\equiv 3 \\pmod{4}$ 的素数在高斯整数中仍是素数。素数 2 是特例：它等于 $-i (1 + i)^2$，即单位乘平方。例如 $13 = 2^2 + 3^2 = (2 + 3i)(2 - 3i)$，而 $7$ 仍是素数。\n\n检验：$(2 + 3i)(2 - 3i) = 4 - 9i^2 = 4 + 9 = 13$。而 7 不是两个平方数之和，因为平方数除以 4 余 0 或 1，两个相加不会余 3。\n\n> **注意。** 在普通整数中是素数，不代表在高斯整数中也是素数；由模 4 的余数决定。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(200).filter((v) => v > 2));
        const splits = p % 4 === 1;
        const stays: Pair = [`${p} stays prime`, `${p} 仍是素数`];
        const split: Pair = [`${p} is a product of two conjugate primes`, `${p} 是两个共轭素数之积`];
        const x = Array.from({ length: 15 }, (_, i) => i + 1).find((v) => Number.isInteger(Math.sqrt(p - v * v)) && p - v * v > 0) ?? 0;
        const y = Math.sqrt(p - x * x);
        const [u, v] = [Math.min(x, y), Math.max(x, y)];
        const z = `${u} + ${v}i`;
        const zBar = `${u} - ${v}i`;
        return chosen(
          rng,
          [`What happens to ${p} in the Gaussian integers?`, `${p} 在高斯整数中是什么情况？`],
          splits ? split : stays,
          [
            splits
              ? [
                  stays,
                  `${p} leaves remainder 1 on division by 4, so it is a sum of two squares and splits.`,
                  `${p} 除以 4 余 1，所以是两个平方数之和，会分解。`,
                ]
              : [
                  split,
                  `${p} leaves remainder 3 on division by 4, so it is not a sum of two squares and cannot split.`,
                  `${p} 除以 4 余 3，所以不是两个平方数之和，不能分解。`,
                ],
            [
              [`${p} becomes a unit`, `${p} 变成单位`],
              `The units are $\\pm 1$ and $\\pm i$, of norm 1, but $N(${p}) = ${p * p}$.`,
              `单位是 $\\pm 1$ 和 $\\pm i$，范数为 1，而 $N(${p}) = ${p * p}$。`,
            ],
            [
              [`${p} is a unit times a square`, `${p} 是单位乘平方`],
              "That happens only for the prime 2, which equals $-i (1 + i)^2$.",
              "只有素数 2 是这样，它等于 $-i (1 + i)^2$。",
            ],
          ],
          [
            [
              ["Reduce modulo 4", "模 4 约化"],
              [`${p} leaves remainder ${p % 4} on division by 4.`, `${p} 除以 4 余 ${p % 4}。`],
            ],
            [
              ["Apply the rule", "用规则判断"],
              splits
                ? [
                    `A prime that leaves 1 is a sum of two squares, $${p} = ${u}^2 + ${v}^2$, and splits as $(${z})(${zBar})$.`,
                    `余 1 的素数是两个平方数之和，$${p} = ${u}^2 + ${v}^2$，分解为 $(${z})(${zBar})$。`,
                  ]
                : [
                    "A prime that leaves 3 is not a sum of two squares, so it stays prime.",
                    "余 3 的素数不是两个平方数之和，所以仍是素数。",
                  ],
            ],
          ],
          splits
            ? [
                `$(${z})(${zBar}) = ${u * u} + ${v * v} = ${p}$, and each factor has prime norm ${p}, so neither is a unit.`,
                `$(${z})(${zBar}) = ${u * u} + ${v * v} = ${p}$，每个因子的范数都是素数 ${p}，所以都不是单位。`,
              ]
            : [
                `A factor would have norm ${p}, so ${p} would be $a^2 + b^2$; but squares leave 0 or 1 on division by 4, and two of them never leave 3.`,
                `若有因子，其范数为 ${p}，即 ${p} 是 $a^2 + b^2$；但平方数除以 4 余 0 或 1，两个相加不会余 3。`,
              ],
        );
      },
    ),
  ],
);

const fibonacciDivisibility = topic(
  "divisibility-of-fibonacci-numbers",
  ["Divisibility of Fibonacci Numbers", "斐波那契数的整除性"],
  ["Use a remarkable gcd identity and the periodic pattern modulo $n$.", "利用一个奇妙的最大公因数恒等式和模 $n$ 的周期规律。"],
  ["the-euclidean-algorithm"],
  [],
  [
    point(
      "the-gcd-of-two-fibonacci-numbers",
      ["The gcd of two Fibonacci numbers", "两个斐波那契数的最大公因数"],
      [
        "The Fibonacci numbers satisfy $\\gcd(F_m, F_n) = F_{\\gcd(m, n)}$. The Euclidean algorithm on the indices mirrors the one on the values, because consecutive Fibonacci numbers are coprime. In particular, $F_m$ divides $F_n$ when $m$ divides $n$, so a prime Fibonacci number needs a prime index, with $F_4 = 3$ as the only exception. For $m = 12$ and $n = 18$: $\\gcd(12, 18) = 6$, so $\\gcd(F_{12}, F_{18}) = F_6 = 8$.\n\nCheck: $F_{12} = 144 = 8 \\cdot 18$ and $F_{18} = 2584 = 8 \\cdot 323$, and $\\gcd(18, 323) = 1$.\n\n> **Watch out.** The answer is the Fibonacci number at the gcd, not the gcd of the indices itself: here $8$, not $6$.",
        "斐波那契数满足 $\\gcd(F_m, F_n) = F_{\\gcd(m, n)}$。对下标做欧几里得算法，与对数值做是一一对应的，因为相邻的斐波那契数互素。特别地，当 $m$ 整除 $n$ 时 $F_m$ 整除 $F_n$，所以斐波那契素数的下标必须是素数，唯一的例外是 $F_4 = 3$。对 $m = 12$，$n = 18$：$\\gcd(12, 18) = 6$，所以 $\\gcd(F_{12}, F_{18}) = F_6 = 8$。\n\n检验：$F_{12} = 144 = 8 \\cdot 18$，$F_{18} = 2584 = 8 \\cdot 323$，而 $\\gcd(18, 323) = 1$。\n\n> **注意。** 答案是下标最大公因数处的斐波那契数，不是下标的最大公因数本身：这里是 $8$，不是 $6$。",
      ],
      (rng) =>
        until(() => {
          const g = rng.int(2, 9);
          const [u, v] = rng.pick([
            [1, 2],
            [2, 3],
            [3, 4],
            [1, 3],
            [3, 5],
            [2, 5],
            [4, 5],
          ] as const);
          const [m, n] = [g * u, g * v];
          const answer = fibonacci(g);
          const [fm, fn] = [fibonacci(m), fibonacci(n)];
          return worked(
            [`Let $F_1 = F_2 = 1$. What is $\\gcd(F_{${m}}, F_{${n}})$?`, `设 $F_1 = F_2 = 1$。$\\gcd(F_{${m}}, F_{${n}})$ 是多少？`],
            answer,
            [
              [
                g,
                `That is $\\gcd(${m}, ${n})$, the index; the answer is the Fibonacci number with that index.`,
                `那是 $\\gcd(${m}, ${n})$，只是下标；答案是这个下标处的斐波那契数。`,
              ],
              [
                fibonacci(n - m),
                `That is $F_{${n - m}}$, from the difference of the indices; the identity uses their gcd.`,
                `那是 $F_{${n - m}}$，用的是下标之差；恒等式用的是它们的最大公因数。`,
              ],
              [fibonacci(g + 1), `That is $F_{${g + 1}}$, one index too far.`, `那是 $F_{${g + 1}}$，下标多了一。`],
              [
                1,
                "That assumes the two Fibonacci numbers are coprime; only consecutive ones always are.",
                "那假定两个斐波那契数互素；只有相邻的才一定互素。",
              ],
            ],
            [
              [
                ["Take the gcd of the indices", "求下标的最大公因数"],
                [`$\\gcd(${m}, ${n}) = ${g}$.`, `$\\gcd(${m}, ${n}) = ${g}$。`],
              ],
              [
                ["Read off the Fibonacci number", "读出斐波那契数"],
                [`$\\gcd(F_{${m}}, F_{${n}}) = F_{${g}} = ${answer}$.`, `$\\gcd(F_{${m}}, F_{${n}}) = F_{${g}} = ${answer}$。`],
              ],
            ],
            [
              `Directly, $F_{${m}} = ${fm}$ and $F_{${n}} = ${fn}$, and the Euclidean algorithm on these values gives $\\gcd(${fm}, ${fn}) = ${gcd(fm, fn)}$.`,
              `直接计算，$F_{${m}} = ${fm}$，$F_{${n}} = ${fn}$，对这两个值做欧几里得算法得 $\\gcd(${fm}, ${fn}) = ${gcd(fm, fn)}$。`,
            ],
          );
        }),
    ),
    point(
      "when-a-fibonacci-number-is-a-multiple",
      ["When a Fibonacci number is a multiple", "斐波那契数何时是倍数"],
      [
        "Modulo any $n$, the Fibonacci numbers repeat with a period, since there are finitely many pairs of consecutive residues. For the divisors 2, 3, 4 and 5, the multiples occur exactly at indices divisible by 3, 4, 6 and 5. So the index alone settles the question. For the divisor 2: $F_3 = 2$, so $F_{30}$ is even, since 3 divides 30, while $F_{31}$ is odd.\n\nCheck: modulo 2 the Fibonacci numbers run $1, 1, 0, 1, 1, 0, \\ldots$, with a 0 exactly at every third index.\n\n> **Watch out.** Divide the index by the place of the first multiple, not by the divisor itself. For the divisor 3 the first multiple is $F_4 = 3$, so $F_8 = 21$ is a multiple of 3 although 3 does not divide 8.",
        "模任何 $n$，斐波那契数都周期重复，因为相邻剩余的数对只有有限个。对除数 2、3、4 和 5，倍数恰好出现在下标被 3、4、6 和 5 整除的地方。所以只看下标就能判断。对除数 2：$F_3 = 2$，所以 $F_{30}$ 是偶数，因为 3 整除 30，而 $F_{31}$ 是奇数。\n\n检验：模 2 时斐波那契数依次是 $1, 1, 0, 1, 1, 0, \\ldots$，恰好每隔三个下标出现一个 0。\n\n> **注意。** 要用第一个倍数的位置去除下标，而不是用除数本身。对除数 3，第一个倍数是 $F_4 = 3$，所以 $F_8 = 21$ 是 3 的倍数，尽管 3 不整除 8。",
      ],
      (rng) => {
        const [d, step] = rng.pick([
          [2, 3],
          [3, 4],
          [4, 6],
          [5, 5],
          [8, 6],
          [13, 7],
          [21, 8],
        ] as const);
        const index = rng.int(10, 300);
        const remainderIsZero = index % step === 0;
        const yes: Pair = [`Yes, because ${step} divides ${index}`, `是，因为 ${step} 整除 ${index}`];
        const no: Pair = [`No, because ${step} does not divide ${index}`, `不是，因为 ${step} 不整除 ${index}`];
        let [x, y] = [0, 1];
        for (let i = 0; i < index; i++) [x, y] = [y, (x + y) % d];
        return chosen(
          rng,
          [
            `With $F_1 = F_2 = 1$, the first multiple of ${d} is $F_{${step}}$. Is $F_{${index}}$ a multiple of ${d}?`,
            `设 $F_1 = F_2 = 1$，${d} 的第一个倍数是 $F_{${step}}$。$F_{${index}}$ 是 ${d} 的倍数吗？`,
          ],
          remainderIsZero ? yes : no,
          [
            remainderIsZero
              ? [
                  no,
                  `${index} is ${step} times ${index / step}, so ${step} does divide it.`,
                  `${index} 是 ${step} 的 ${index / step} 倍，所以 ${step} 整除它。`,
                ]
              : [
                  yes,
                  `${index} leaves remainder ${index % step} on division by ${step}, so ${step} does not divide it.`,
                  `${index} 除以 ${step} 余 ${index % step}，所以 ${step} 不整除它。`,
                ],
            [
              [`It depends on the remainder of ${index} on division by ${d}`, `取决于 ${index} 除以 ${d} 的余数`],
              `What matters is the index modulo ${step}, the place of the first multiple, not modulo the divisor ${d}.`,
              `起作用的是下标模 ${step}，即第一个倍数的位置，而不是模除数 ${d}。`,
            ],
          ],
          [
            [
              ["Locate the first multiple", "找到第一个倍数"],
              [
                `The multiples of ${d} occur exactly at the indices that are multiples of ${step}.`,
                `${d} 的倍数恰好出现在下标是 ${step} 的倍数的地方。`,
              ],
            ],
            [
              ["Divide the index", "用下标去除"],
              [`${index} leaves remainder ${index % step} on division by ${step}.`, `${index} 除以 ${step} 余 ${index % step}。`],
            ],
          ],
          [
            `Running the Fibonacci numbers modulo ${d} up to index ${index} gives the remainder ${x}, so $F_{${index}}$ is ${x === 0 ? "" : "not "}a multiple of ${d}.`,
            `把斐波那契数模 ${d} 一直算到下标 ${index}，得到余数 ${x}，所以 $F_{${index}}$ ${x === 0 ? "是" : "不是"} ${d} 的倍数。`,
          ],
        );
      },
    ),
  ],
);

const progressions = topic(
  "primes-in-arithmetic-progressions",
  ["Primes in Arithmetic Progressions", "等差数列中的素数"],
  ["Apply Dirichlet's theorem, and prove simple cases by Euclid's method.", "应用狄利克雷定理，并用欧几里得的方法证明简单情形。"],
  ["the-distribution-of-primes", "eulers-totient-function"],
  [],
  [
    point(
      "applying-dirichlets-theorem",
      ["Applying Dirichlet's theorem", "应用狄利克雷定理"],
      [
        "Dirichlet's theorem says that when $\\gcd(a, d) = 1$, the progression $a, a + d, a + 2d, \\ldots$ contains infinitely many primes. When the gcd exceeds 1, every term shares that factor, so at most one term can be prime. For $3, 13, 23, \\ldots$ with $\\gcd(3, 10) = 1$ there are infinitely many primes, while $6, 15, 24, \\ldots$ has $\\gcd(6, 9) = 3$, so every term is a multiple of 3 and none is prime.\n\nCheck: $3, 13, 23, 43, 53$ are already five primes in the first progression, and $6 = 3 \\cdot 2$, $15 = 3 \\cdot 5$, $24 = 3 \\cdot 8$ in the second.\n\n> **Watch out.** The theorem says nothing about how often the terms are prime: primes thin out, so they are never about half of the terms.",
        "狄利克雷定理说：当 $\\gcd(a, d) = 1$ 时，等差数列 $a, a + d, a + 2d, \\ldots$ 含有无穷多个素数。当最大公因数大于 1 时，每一项都有这个因子，所以至多一项是素数。对 $3, 13, 23, \\ldots$，$\\gcd(3, 10) = 1$，有无穷多个素数；而 $6, 15, 24, \\ldots$ 有 $\\gcd(6, 9) = 3$，每一项都是 3 的倍数，没有素数。\n\n检验：第一个数列中 $3, 13, 23, 43, 53$ 已是五个素数；第二个数列中 $6 = 3 \\cdot 2$，$15 = 3 \\cdot 5$，$24 = 3 \\cdot 8$。\n\n> **注意。** 定理不说明素数出现得多频繁：素数越来越稀，所以绝不会占约一半的项。",
      ],
      (rng) => {
        const d = rng.int(2, 30);
        const a = rng.int(1, 30);
        const g = gcd(a, d);
        const many: Pair = ["Infinitely many", "无穷多个"];
        const few: Pair = ["At most one", "至多一个"];
        const isPrime = (v: number) => v > 1 && factorize(v).length === 1 && (factorize(v)[0]?.[1] ?? 0) === 1;
        const found = Array.from({ length: 200 }, (_, k) => a + k * d)
          .filter(isPrime)
          .slice(0, 3);
        const first = [a, a + d, a + 2 * d];
        return chosen(
          rng,
          [
            `How many primes does the progression $${a}, ${a + d}, ${a + 2 * d}, \\ldots$ contain?`,
            `等差数列 $${a}, ${a + d}, ${a + 2 * d}, \\ldots$ 含有多少个素数？`,
          ],
          g === 1 ? many : few,
          [
            g === 1
              ? [
                  few,
                  `$\\gcd(${a}, ${d}) = 1$, so Dirichlet's theorem gives infinitely many.`,
                  `$\\gcd(${a}, ${d}) = 1$，所以狄利克雷定理给出无穷多个。`,
                ]
              : [
                  many,
                  `Every term is a multiple of $\\gcd(${a}, ${d}) = ${g}$, so the terms cannot keep being prime.`,
                  `每一项都是 $\\gcd(${a}, ${d}) = ${g}$ 的倍数，所以不可能一直出现素数。`,
                ],
            [
              ["Exactly two", "恰好两个"],
              "No progression has exactly two primes: either a common factor leaves at most one, or there are infinitely many.",
              "没有恰好含两个素数的等差数列：要么有公因子，至多一个；要么有无穷多个。",
            ],
            [
              ["About half of its terms", "约一半的项"],
              "Primes thin out, so their share of the terms tends to zero.",
              "素数越来越稀，在各项中所占比例趋于零。",
            ],
          ],
          [
            [
              ["Compute the gcd", "求最大公因数"],
              [`$\\gcd(${a}, ${d}) = ${g}$.`, `$\\gcd(${a}, ${d}) = ${g}$。`],
            ],
            [
              ["Apply the theorem", "应用定理"],
              g === 1
                ? [
                    "The gcd is 1, so Dirichlet's theorem applies and gives infinitely many primes.",
                    "最大公因数是 1，所以狄利克雷定理适用，给出无穷多个素数。",
                  ]
                : [
                    `Every term is a multiple of ${g}, and a multiple of ${g} is prime only if it equals ${g}, so at most one term is prime.`,
                    `每一项都是 ${g} 的倍数，而 ${g} 的倍数只有等于 ${g} 时才是素数，所以至多一项是素数。`,
                  ],
            ],
          ],
          g === 1
            ? [
                `The progression already contains the primes $${found.join(", ")}$ among its first terms.`,
                `这个数列的前若干项中已有素数 $${found.join(", ")}$。`,
              ]
            : [
                `The first terms are ${first.map((v) => `$${v} = ${g} \\cdot ${v / g}$`).join(", ")}, each a multiple of ${g}.`,
                `前几项是 ${first.map((v) => `$${v} = ${g} \\cdot ${v / g}$`).join("，")}，都是 ${g} 的倍数。`,
              ],
        );
      },
    ),
    point(
      "euclids-method-for-three-mod-four",
      ["Euclid's method for three mod four", "模四余三的欧几里得方法"],
      [
        "To show that infinitely many primes have remainder 3 modulo 4, suppose the list is finite and form $N = 4 p_1 \\cdots p_k - 1$. Then $N$ has remainder 3, and a product of numbers with remainder 1 has remainder 1, so $N$ has a prime factor with remainder 3 that is not in the list. From $3$ and $7$: $N = 4 \\cdot 21 - 1 = 83$, which is itself a prime with remainder 3.\n\nCheck: $83 = 4 \\cdot 20 + 3$, and it leaves $2$ on division by 3 and $6$ on division by 7, so it is a new prime.\n\n> **Watch out.** Use $4 p_1 \\cdots p_k - 1$, not $+ 1$. A number with remainder 1 can be a product of primes that all have remainder 1, so it proves nothing here.",
        "要证明模 4 余 3 的素数有无穷多个，假设它们有限，构造 $N = 4 p_1 \\cdots p_k - 1$。则 $N$ 余 3，而余 1 的数之积仍余 1，所以 $N$ 有一个余 3 的素因子，它不在列表中。由 $3$ 和 $7$：$N = 4 \\cdot 21 - 1 = 83$，它本身就是余 3 的素数。\n\n检验：$83 = 4 \\cdot 20 + 3$，它除以 3 余 $2$，除以 7 余 $6$，所以是一个新素数。\n\n> **注意。** 要用 $4 p_1 \\cdots p_k - 1$，而不是 $+ 1$。余 1 的数可能是若干个余 1 的素数之积，在这里什么也证明不了。",
      ],
      (rng) =>
        until(() => {
          const list = rng.sample([3, 7, 11, 19, 23], rng.int(1, 3)).sort((x, y) => x - y);
          const product = list.reduce((x, y) => x * y, 1);
          const N = 4 * product - 1;
          const factors = factorize(N);
          const threes = factors.filter(([p]) => p % 4 === 3).map(([p]) => p);
          const c = threes[0] ?? N;
          const smallest = factors[0]?.[0] ?? N;
          const largest = threes[threes.length - 1] ?? N;
          const shown = factors.map(([p, e]) => pw(p, e)).join(" \\cdot ");
          return worked(
            [
              `Starting from the primes ${list.join(", ")}, form $N = 4 \\cdot ${product} - 1$. What is the smallest prime factor of $N$ with remainder 3 on division by 4?`,
              `从素数 ${list.join("、")} 出发，构造 $N = 4 \\cdot ${product} - 1$。$N$ 被 4 除余 3 的最小素因子是多少？`,
            ],
            c,
            [
              [N, `That is $N$ itself, which is not prime: $${N} = ${shown}$.`, `那是 $N$ 本身，它不是素数：$${N} = ${shown}$。`],
              [
                list[0] ?? 3,
                `That prime is in the starting list, and it does not divide $N$, which leaves remainder ${N % (list[0] ?? 3)} on division by it.`,
                `这个素数在起始列表里，它不整除 $N$，$N$ 除以它余 ${N % (list[0] ?? 3)}。`,
              ],
              [
                smallest,
                "That is the smallest prime factor, but it leaves remainder 1 on division by 4.",
                "那是最小的素因子，但它除以 4 余 1。",
              ],
              [
                4 * product + 1,
                `That is $4 \\cdot ${product} + 1$, formed with the wrong sign; it is not even a factor of $N$.`,
                `那是 $4 \\cdot ${product} + 1$，符号用错了；它甚至不是 $N$ 的因子。`,
              ],
              [
                largest,
                "That prime factor leaves remainder 3, but it is not the smallest such factor.",
                "那个素因子除以 4 余 3，但不是最小的。",
              ],
            ],
            [
              [
                ["Form N", "构造 N"],
                [`$N = 4 \\cdot ${product} - 1 = ${N}$.`, `$N = 4 \\cdot ${product} - 1 = ${N}$。`],
              ],
              [
                ["Factor N", "分解 N"],
                [
                  `$${N} = ${shown}$${factors.length === 1 && factors[0]?.[1] === 1 ? ", a prime" : ""}.`,
                  `$${N} = ${shown}$${factors.length === 1 && factors[0]?.[1] === 1 ? "，是素数" : ""}。`,
                ],
              ],
              [
                ["Pick the remainder 3", "挑出余 3 的"],
                [
                  `The prime factors with remainder 3 on division by 4 are $${threes.join(", ")}$, and the smallest is ${c}.`,
                  `除以 4 余 3 的素因子是 $${threes.join(", ")}$，最小的是 ${c}。`,
                ],
              ],
            ],
            [
              `$${c} = 4 \\cdot ${(c - 3) / 4} + 3$ divides $N$, and it is new: each listed prime divides $4 \\cdot ${product}$, so it leaves remainder $p - 1$ on $N$, never 0.`,
              `$${c} = 4 \\cdot ${(c - 3) / 4} + 3$ 整除 $N$，而且是新的：列表中的每个素数都整除 $4 \\cdot ${product}$，所以 $N$ 除以它余 $p - 1$，不会是 0。`,
            ],
          );
        }),
    ),
  ],
);

const squares = topic(
  "sums-of-three-and-four-squares",
  ["Sums of Three and Four Squares", "三平方和与四平方和"],
  ["Find the fewest squares needed to write a whole number.", "求表示一个整数所需的最少平方数个数。"],
  ["sums-of-two-squares"],
  [],
  [
    point(
      "numbers-that-need-four-squares",
      ["Numbers that need four squares", "需要四个平方数的数"],
      [
        "Lagrange's theorem says every whole number is a sum of four squares. Legendre's theorem says that three squares are enough unless the number has the form $4^a (8b + 7)$. So the numbers that truly need four squares can be found by dividing out factors of 4 and looking at the remainder modulo 8. For $60 = 4 \\cdot 15$ and $15 = 8 \\cdot 1 + 7$, so 60 needs four squares: $60 = 49 + 9 + 1 + 1$.\n\nCheck: squares leave $0, 1$ or $4$ on division by 8, and no three of these add up to 7, so 15 is not a sum of three squares; neither is $60$, since a sum of three squares divisible by 4 has all three even.\n\n> **Watch out.** Divide out the factors of 4 before looking modulo 8. $28$ leaves 4 on division by 8, yet $28 = 4 \\cdot 7$ needs four squares.",
        "拉格朗日定理说每个正整数都是四个平方数之和。勒让德定理说：除非这个数形如 $4^a (8b + 7)$，否则三个平方数就够了。所以真正需要四个平方数的数，可以先除去因子 4，再看模 8 的余数。对 $60 = 4 \\cdot 15$，$15 = 8 \\cdot 1 + 7$，所以 60 需要四个平方数：$60 = 49 + 9 + 1 + 1$。\n\n检验：平方数除以 8 余 $0, 1$ 或 $4$，其中任意三个相加都不会余 7，所以 15 不是三个平方数之和；60 也不是，因为能被 4 整除的三平方和中三个数都是偶数。\n\n> **注意。** 要先除去因子 4 再看模 8。$28$ 除以 8 余 4，但 $28 = 4 \\cdot 7$ 需要四个平方数。",
      ],
      (rng) => {
        const needs = rng.bool();
        const a = rng.int(0, 2);
        const b = rng.int(0, 12);
        const value = needs ? 4 ** a * (8 * b + 7) : 4 ** a * (8 * b + rng.pick([1, 2, 3, 5, 6]));
        const three: Pair = ["Three squares are enough", "三个平方数就够了"];
        const four: Pair = ["Four squares are needed", "需要四个平方数"];
        const core = value / 4 ** a;
        const rep = (needs ? sumOfSquares(value, 4) : (sumOfSquares(value, 1) ?? sumOfSquares(value, 2) ?? sumOfSquares(value, 3))) ?? [];
        const written = rep.map((r) => r * r).join(" + ");
        return chosen(
          rng,
          [`Can ${value} be written as a sum of three squares, allowing zero?`, `${value} 能写成三个平方数之和吗（允许有 0）？`],
          needs ? four : three,
          [
            needs
              ? [
                  three,
                  `After dividing out the factors of 4, ${core} leaves 7 on division by 8, which is exactly the excluded form.`,
                  `除去因子 4 后，${core} 除以 8 余 7，正是被排除的形式。`,
                ]
              : [
                  four,
                  `After dividing out the factors of 4, ${core} leaves ${core % 8} on division by 8, not 7, so three squares suffice.`,
                  `除去因子 4 后，${core} 除以 8 余 ${core % 8}，不是 7，所以三个平方数就够了。`,
                ],
            [
              ["Five squares are needed", "需要五个平方数"],
              "Lagrange's theorem says four squares always suffice.",
              "拉格朗日定理说四个平方数总是够的。",
            ],
          ],
          [
            [
              ["Divide out the factors of 4", "除去因子 4"],
              [
                a === 0 ? `${value} is not a multiple of 4, so it stays ${core}.` : `$${value} = ${pw(4, a)} \\cdot ${core}$.`,
                a === 0 ? `${value} 不是 4 的倍数，仍是 ${core}。` : `$${value} = ${pw(4, a)} \\cdot ${core}$。`,
              ],
            ],
            [
              ["Look modulo 8", "看模 8"],
              [
                `${core} leaves remainder ${core % 8} on division by 8, so ${needs ? "it has the excluded form and four squares are needed" : "it does not have the excluded form and three squares are enough"}.`,
                `${core} 除以 8 余 ${core % 8}，所以${needs ? "它是被排除的形式，需要四个平方数" : "它不是被排除的形式，三个平方数就够了"}。`,
              ],
            ],
          ],
          needs
            ? [
                `Squares leave 0, 1 or 4 on division by 8, and no three of them make 7, so ${core} is not a sum of three squares${a > 0 ? `, and neither is ${value}, since a sum of three squares divisible by 4 has all three even` : ""}. Four work: $${value} = ${written}$.`,
                `平方数除以 8 余 0、1 或 4，任意三个都凑不出 7，所以 ${core} 不是三个平方数之和${a > 0 ? `；${value} 也不是，因为能被 4 整除的三平方和中三个数都是偶数` : ""}。四个可以：$${value} = ${written}$。`,
              ]
            : [`Indeed $${value} = ${written}$.`, `确实 $${value} = ${written}$。`],
        );
      },
    ),
    point(
      "the-fewest-squares",
      ["The fewest squares", "最少的平方数个数"],
      [
        "The fewest squares needed is 1 for a perfect square. It is 2 when each prime with remainder 3 modulo 4 appears to an even power. It is 4 for the form $4^a (8b + 7)$, and 3 for everything else. So these theorems give the exact count without any search. For $21 = 3 \\cdot 7$, both primes have remainder 3 and odd powers, so two squares fail; $21$ leaves 5 on division by 8, so three suffice: $21 = 16 + 4 + 1$.\n\nCheck: the squares below 21 are $1, 4, 9, 16$, and $21 - 1 = 20$, $21 - 4 = 17$, $21 - 9 = 12$, $21 - 16 = 5$ are not squares, so two squares are indeed not enough.\n\n> **Watch out.** Test in order from one square upwards. $25 = 9 + 16$ is a sum of two squares, but $25 = 5^2$ needs only one.",
        "完全平方数只需 1 个平方数。当每个模 4 余 3 的素数都以偶次幂出现时，需要 2 个。形如 $4^a (8b + 7)$ 的数需要 4 个，其余的需要 3 个。所以这些定理不用搜索就能给出确切的个数。对 $21 = 3 \\cdot 7$，两个素数都余 3 且是奇次幂，所以两个平方数不行；$21$ 除以 8 余 5，所以三个就够了：$21 = 16 + 4 + 1$。\n\n检验：小于 21 的平方数是 $1, 4, 9, 16$，而 $21 - 1 = 20$，$21 - 4 = 17$，$21 - 9 = 12$，$21 - 16 = 5$ 都不是平方数，所以两个平方数确实不够。\n\n> **注意。** 要从一个平方数开始依次检验。$25 = 9 + 16$ 是两个平方数之和，但 $25 = 5^2$ 只需一个。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(2, 300);
          const root = Math.round(Math.sqrt(n));
          let reduced = n;
          while (reduced % 4 === 0) reduced /= 4;
          const square = root * root === n;
          const two = factorize(n).every(([p, e]) => p % 4 !== 3 || e % 2 === 0);
          const answer = square ? 1 : two ? 2 : reduced % 8 === 7 ? 4 : 3;
          const odd = factorize(n).find(([p, e]) => p % 4 === 3 && e % 2 === 1)?.[0];
          const why = (v: number): Miss => {
            if (v < answer) {
              if (v === 1) return [1, `${n} is not a perfect square.`, `${n} 不是完全平方数。`];
              if (v === 2)
                return [
                  2,
                  `The prime ${odd} has remainder 3 modulo 4 and appears to an odd power, so ${n} is not a sum of two squares.`,
                  `素数 ${odd} 模 4 余 3，且以奇次幂出现，所以 ${n} 不是两个平方数之和。`,
                ];
              return [
                3,
                `After dividing out the factors of 4, ${reduced} leaves 7 on division by 8, so three squares are not enough.`,
                `除去因子 4 后，${reduced} 除以 8 余 7，所以三个平方数不够。`,
              ];
            }
            return [
              v,
              `${n} can be written with ${answer}, so ${v} is more than the fewest.`,
              `${n} 用 ${answer} 个就能写出，${v} 个不是最少的。`,
            ];
          };
          const rep = sumOfSquares(n, answer) ?? [];
          const shown = rep.map((r) => `${r}^2`).join(" + ");
          return worked(
            [`What is the fewest number of nonzero squares that add up to ${n}?`, `和为 ${n} 的非零平方数最少有几个？`],
            answer,
            [1, 2, 3, 4].filter((v) => v !== answer).map(why),
            (
              [
                [
                  ["Test one square", "试一个平方数"],
                  [
                    square
                      ? `$${n} = ${root}^2$, so one square is enough.`
                      : `${n} lies strictly between $${Math.floor(Math.sqrt(n))}^2$ and $${Math.floor(Math.sqrt(n)) + 1}^2$, so it is not a square.`,
                    square
                      ? `$${n} = ${root}^2$，一个平方数就够。`
                      : `${n} 严格位于 $${Math.floor(Math.sqrt(n))}^2$ 与 $${Math.floor(Math.sqrt(n)) + 1}^2$ 之间，不是平方数。`,
                  ],
                ],
                [
                  ["Test two squares", "试两个平方数"],
                  [
                    two
                      ? "Every prime with remainder 3 modulo 4 appears to an even power, so two squares are possible."
                      : `The prime ${odd} has remainder 3 modulo 4 and an odd power, so two squares are impossible.`,
                    two
                      ? "每个模 4 余 3 的素数都以偶次幂出现，所以两个平方数可以。"
                      : `素数 ${odd} 模 4 余 3 且是奇次幂，所以两个平方数不行。`,
                  ],
                ],
                [
                  ["Test three squares", "试三个平方数"],
                  [
                    `Dividing out the factors of 4 leaves ${reduced}, with remainder ${reduced % 8} on division by 8, so three squares ${reduced % 8 === 7 ? "fail and four are needed" : "are possible"}.`,
                    `除去因子 4 后剩 ${reduced}，除以 8 余 ${reduced % 8}，所以三个平方数${reduced % 8 === 7 ? "不行，需要四个" : "可以"}。`,
                  ],
                ],
              ] satisfies Walk[]
            ).slice(0, Math.min(answer, 3)),
            [
              `An explicit choice is $${n} = ${shown}$, with ${answer} ${answer === 1 ? "square" : "squares"}.`,
              `一个具体的写法是 $${n} = ${shown}$，共 ${answer} 个平方数。`,
            ],
          );
        }),
    ),
  ],
);

/** numberTheoryMoreTopics holds the later topics of the Number Theory course, each with its introduction. */
export const numberTheoryMoreTopics: readonly TopicDef[] = [
  lesson(
    valuations,
    [
      "How many factors of 3 does $\\binom{9}{3} = 84$ contain? Legendre's formula gives $v_3(9!) = 3 + 1 = 4$, $v_3(3!) = 1$ and $v_3(6!) = 2$, so $v_3 \\left( \\binom{9}{3} \\right) = 4 - 1 - 2 = 1$.",
      "$\\binom{9}{3} = 84$ 含有几个因子 3？勒让德公式给出 $v_3(9!) = 3 + 1 = 4$，$v_3(3!) = 1$，$v_3(6!) = 2$，所以 $v_3 \\left( \\binom{9}{3} \\right) = 4 - 1 - 2 = 1$。",
    ],
    ["$84 = 3 \\cdot 28$, and $28$ is not a multiple of 3.", "$84 = 3 \\cdot 28$，而 $28$ 不是 3 的倍数。"],
    [
      "track the exact power of a prime through products and powers, count the trailing zeros of a factorial with Legendre's formula, and find the valuation of a binomial coefficient.",
      "跟踪素数在乘积和幂中的确切幂次，用勒让德公式数阶乘末尾的零，并求二项式系数的赋值。",
    ],
  ),
  lesson(
    divisibilityTests,
    [
      "What does $123456$ leave on division by 9 and by 11? The digit sum is $21$, which leaves $3$ on division by 9. The alternating sum from the units digit is $6 - 5 + 4 - 3 + 2 - 1 = 3$, so the remainder on division by 11 is $3$ as well.",
      "$123456$ 除以 9 和除以 11 各余多少？数字和是 $21$，除以 9 余 $3$。从个位起的交错和是 $6 - 5 + 4 - 3 + 2 - 1 = 3$，所以除以 11 也余 $3$。",
    ],
    [
      "$9 \\cdot 13717 = 123453$ and $11 \\cdot 11223 = 123453$, three less than $123456$.",
      "$9 \\cdot 13717 = 123453$，$11 \\cdot 11223 = 123453$，都比 $123456$ 小 3。",
    ],
    [
      "derive the tests for 3 and 9 from $10 \\equiv 1$, the test for 11 from $10 \\equiv -1$, and block tests for 7 and 13 from $1000 \\equiv -1$.",
      "由 $10 \\equiv 1$ 推出 3 和 9 的判别法，由 $10 \\equiv -1$ 推出 11 的判别法，由 $1000 \\equiv -1$ 推出 7 和 13 的分块判别法。",
    ],
  ),
  lesson(
    decimals,
    [
      "How long is the repeating block of $\\frac{1}{13}$? The powers of 10 modulo 13 are $10, 9, 12, 3, 4, 1$, so the order of 10 is 6, and $\\frac{1}{13} = 0.\\overline{076923}$ has period 6.",
      "$\\frac{1}{13}$ 的循环节有多长？10 的各次幂模 13 是 $10, 9, 12, 3, 4, 1$，所以 10 的阶是 6，$\\frac{1}{13} = 0.\\overline{076923}$ 的周期是 6。",
    ],
    [
      "$13 \\cdot 76923 = 999999$, so $\\frac{1}{13} = \\frac{076923}{999999}$, a block of six digits repeated.",
      "$13 \\cdot 76923 = 999999$，所以 $\\frac{1}{13} = \\frac{076923}{999999}$，正是六位一组的循环。",
    ],
    [
      "read the period of a repeating decimal as an order modulo $n$, and count the digits before the repeat from the factors 2 and 5 of the denominator.",
      "把循环小数的周期看作模 $n$ 的阶，并由分母中的因子 2 和 5 数出循环前的位数。",
    ],
  ),
  lesson(
    hensel,
    [
      "Solve $x^2 \\equiv 6 \\pmod{25}$ with $x \\equiv 1 \\pmod{5}$. Put $x = 1 + 5t$: then $x^2 \\equiv 1 + 10 t$, and $1 + 10 t \\equiv 6$ means $2 t \\equiv 1 \\pmod{5}$, so $t = 3$ and $x = 16$.",
      "解 $x^2 \\equiv 6 \\pmod{25}$，且 $x \\equiv 1 \\pmod{5}$。设 $x = 1 + 5t$：则 $x^2 \\equiv 1 + 10 t$，由 $1 + 10 t \\equiv 6$ 得 $2 t \\equiv 1 \\pmod{5}$，所以 $t = 3$，$x = 16$。",
    ],
    ["$16^{2} = 256 = 10 \\cdot 25 + 6$.", "$16^{2} = 256 = 10 \\cdot 25 + 6$。"],
    [
      "lift a root from modulo $p$ to modulo $p^2$ by solving a linear congruence, and count the square roots modulo a power of an odd prime.",
      "通过解线性同余式把根从模 $p$ 提升到模 $p^2$，并数出模奇素数幂的平方根个数。",
    ],
  ),
  lesson(
    mersenne,
    [
      "Since $2 \\mid 6$ and $3 \\mid 6$, both $2^{2} - 1 = 3$ and $2^{3} - 1 = 7$ divide $2^{6} - 1 = 63 = 3^{2} \\cdot 7$. And because $2^{5} - 1 = 31$ is prime, $2^{4} \\cdot 31 = 496$ is a perfect number.",
      "因为 $2 \\mid 6$，$3 \\mid 6$，所以 $2^{2} - 1 = 3$ 和 $2^{3} - 1 = 7$ 都整除 $2^{6} - 1 = 63 = 3^{2} \\cdot 7$。又因为 $2^{5} - 1 = 31$ 是素数，$2^{4} \\cdot 31 = 496$ 是完全数。",
    ],
    [
      "$\\sigma(496) = \\sigma(16) \\, \\sigma(31) = 31 \\cdot 32 = 992 = 2 \\cdot 496$.",
      "$\\sigma(496) = \\sigma(16) \\, \\sigma(31) = 31 \\cdot 32 = 992 = 2 \\cdot 496$。",
    ],
    [
      "factor $2^n - 1$ from the divisors of $n$, build even perfect numbers from Mersenne primes, and see why the Fermat numbers are pairwise coprime.",
      "由 $n$ 的因数分解 $2^n - 1$，由梅森素数构造偶完全数，并看清费马数为什么两两互素。",
    ],
  ),
  lesson(
    pseudoprimes,
    [
      "The number $341 = 11 \\cdot 31$ is composite, yet $2^{10} = 1024 = 3 \\cdot 341 + 1$, so $2^{340} = (2^{10})^{34} \\equiv 1 \\pmod{341}$: the base 2 is fooled. The base 3 is not, since $3^{340} \\equiv 56 \\pmod{341}$.",
      "$341 = 11 \\cdot 31$ 是合数，但 $2^{10} = 1024 = 3 \\cdot 341 + 1$，所以 $2^{340} = (2^{10})^{34} \\equiv 1 \\pmod{341}$：底 2 被骗过了。底 3 没有，因为 $3^{340} \\equiv 56 \\pmod{341}$。",
    ],
    [
      "The order of 2 modulo 341 is 10, and 10 divides 340, which is exactly why the power comes out as 1.",
      "2 模 341 的阶是 10，而 10 整除 340，这正是幂等于 1 的原因。",
    ],
    [
      "tell Fermat liars from witnesses, and recognize Carmichael numbers, which fool every coprime base, by Korselt's criterion.",
      "区分费马说谎者和证人，并用科塞特判据认出骗过每个互素底的卡迈克尔数。",
    ],
  ),
  lesson(
    jacobiTopic,
    [
      "Compute $\\left( \\frac{5}{21} \\right) = \\left( \\frac{5}{3} \\right) \\left( \\frac{5}{7} \\right)$. Modulo 3, $5 \\equiv 2$ is not a square, and modulo 7 the squares are $1, 2, 4$, so 5 is not one either. The symbol is $(-1)(-1) = 1$.",
      "计算 $\\left( \\frac{5}{21} \\right) = \\left( \\frac{5}{3} \\right) \\left( \\frac{5}{7} \\right)$。模 3 时 $5 \\equiv 2$ 不是平方，模 7 的平方是 $1, 2, 4$，5 也不是。所以符号是 $(-1)(-1) = 1$。",
    ],
    [
      "The squares modulo 21 of the numbers coprime to 21 are $1, 4, 16$, and 5 is not among them, so the $+1$ does not make 5 a square.",
      "与 21 互素的数的平方模 21 只有 $1, 4, 16$，5 不在其中，所以 $+1$ 并不意味着 5 是平方。",
    ],
    [
      "compute the Jacobi symbol from the Legendre symbols of the prime factors, and learn what a value of $+1$ does and does not tell.",
      "由各素因子的勒让德符号计算雅可比符号，并弄清值为 $+1$ 能说明什么、不能说明什么。",
    ],
  ),
  lesson(
    convolution,
    [
      "Compute $(\\mathbf{1} * \\mathbf{1})(12) = \\sum_{d \\mid 12} 1$. Every divisor $1, 2, 3, 4, 6, 12$ contributes 1, so the value is $6 = \\tau(12)$.",
      "计算 $(\\mathbf{1} * \\mathbf{1})(12) = \\sum_{d \\mid 12} 1$。每个因子 $1, 2, 3, 4, 6, 12$ 贡献 1，所以值是 $6 = \\tau(12)$。",
    ],
    ["$12 = 2^{2} \\cdot 3$ gives $\\tau(12) = (2 + 1)(1 + 1) = 6$.", "$12 = 2^{2} \\cdot 3$ 给出 $\\tau(12) = (2 + 1)(1 + 1) = 6$。"],
    [
      "compute Dirichlet convolutions term by term over the divisors, and use the Möbius function as the inverse of $\\mathbf{1}$ to undo divisor sums.",
      "逐项对因子计算狄利克雷卷积，并把默比乌斯函数当作 $\\mathbf{1}$ 的逆来撤销因子求和。",
    ],
  ),
  lesson(
    farey,
    [
      "The Farey sequence of order 4 is $0, \\frac{1}{4}, \\frac{1}{3}, \\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}, 1$. The neighbors $\\frac{1}{3}$ and $\\frac{1}{2}$ satisfy $3 - 2 = 1$, and their mediant $\\frac{2}{5}$ is the first fraction to appear between them, in order 5.",
      "4 阶法里数列是 $0, \\frac{1}{4}, \\frac{1}{3}, \\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}, 1$。相邻分数 $\\frac{1}{3}$ 和 $\\frac{1}{2}$ 满足 $3 - 2 = 1$，它们的中位分数 $\\frac{2}{5}$ 是在 5 阶中第一个出现在它们之间的分数。",
    ],
    [
      "The length is $1 + \\varphi(1) + \\varphi(2) + \\varphi(3) + \\varphi(4) = 1 + 1 + 1 + 2 + 2 = 7$, matching the seven fractions listed.",
      "长度是 $1 + \\varphi(1) + \\varphi(2) + \\varphi(3) + \\varphi(4) = 1 + 1 + 1 + 2 + 2 = 7$，与列出的七个分数一致。",
    ],
    [
      "find the next fraction between Farey neighbors by the mediant, and count the fractions of a Farey sequence with the totient.",
      "用中位分数求法里相邻分数之间的下一个分数，并用欧拉函数数出法里数列的分数个数。",
    ],
  ),
  lesson(
    approximations,
    [
      "The continued fraction of $\\pi$ begins $[3; 7, 15, 1, \\ldots]$, with convergents $3, \\frac{22}{7}, \\frac{333}{106}$. The next one is $\\frac{1 \\cdot 333 + 22}{1 \\cdot 106 + 7} = \\frac{355}{113}$.",
      "$\\pi$ 的连分数开头是 $[3; 7, 15, 1, \\ldots]$，渐近分数是 $3, \\frac{22}{7}, \\frac{333}{106}$。下一个是 $\\frac{1 \\cdot 333 + 22}{1 \\cdot 106 + 7} = \\frac{355}{113}$。",
    ],
    [
      "$\\frac{355}{113} \\approx 3.1415929$ and $\\pi \\approx 3.1415927$ differ by far less than $\\frac{1}{113^2} \\approx 0.0000783$.",
      "$\\frac{355}{113} \\approx 3.1415929$ 与 $\\pi \\approx 3.1415927$ 的差远小于 $\\frac{1}{113^2} \\approx 0.0000783$。",
    ],
    [
      "build convergents with the recurrence for numerators and denominators, and measure the gap between consecutive convergents.",
      "用分子分母的递推构造渐近分数，并衡量相邻渐近分数之间的距离。",
    ],
  ),
  lesson(
    gaussian,
    [
      "Factor 13 among the Gaussian integers. Since $13 = 3^2 + 2^2$, it splits as $(3 + 2i)(3 - 2i)$, and each factor has norm 13, a prime, so each factor is a Gaussian prime.",
      "在高斯整数中分解 13。因为 $13 = 3^2 + 2^2$，它分解为 $(3 + 2i)(3 - 2i)$，每个因子的范数都是素数 13，所以都是高斯素数。",
    ],
    ["$(3 + 2i)(3 - 2i) = 9 - 4i^2 = 9 + 4 = 13$.", "$(3 + 2i)(3 - 2i) = 9 - 4i^2 = 9 + 4 = 13$。"],
    [
      "use the multiplicative norm to turn Gaussian factorizations into ordinary ones, and decide from the remainder modulo 4 which primes stay prime.",
      "用乘性的范数把高斯整数的分解变成普通整数的分解，并由模 4 的余数判断哪些素数仍是素数。",
    ],
  ),
  lesson(
    fibonacciDivisibility,
    [
      "What is $\\gcd(F_{10}, F_{15})$? The identity $\\gcd(F_m, F_n) = F_{\\gcd(m, n)}$ gives $F_5 = 5$, since $\\gcd(10, 15) = 5$.",
      "$\\gcd(F_{10}, F_{15})$ 是多少？恒等式 $\\gcd(F_m, F_n) = F_{\\gcd(m, n)}$ 给出 $F_5 = 5$，因为 $\\gcd(10, 15) = 5$。",
    ],
    [
      "$F_{10} = 55$ and $F_{15} = 610 = 11 \\cdot 55 + 5$, and $55 = 11 \\cdot 5$, so the Euclidean algorithm ends at 5.",
      "$F_{10} = 55$，$F_{15} = 610 = 11 \\cdot 55 + 5$，而 $55 = 11 \\cdot 5$，所以欧几里得算法停在 5。",
    ],
    [
      "compute the gcd of two Fibonacci numbers from their indices, and decide from the index whether a Fibonacci number is a multiple of a given number.",
      "由下标求两个斐波那契数的最大公因数，并由下标判断一个斐波那契数是否是给定数的倍数。",
    ],
  ),
  lesson(
    progressions,
    [
      "Start from the primes $3, 7, 11$, which leave 3 on division by 4, and form $N = 4 \\cdot 231 - 1 = 923 = 13 \\cdot 71$. The factor $71 = 4 \\cdot 17 + 3$ is a new prime with remainder 3.",
      "从除以 4 余 3 的素数 $3, 7, 11$ 出发，构造 $N = 4 \\cdot 231 - 1 = 923 = 13 \\cdot 71$。因子 $71 = 4 \\cdot 17 + 3$ 是一个新的余 3 的素数。",
    ],
    [
      "$13 \\cdot 71 = 923$, and 923 leaves 2, 6 and 10 on division by 3, 7 and 11, so none of them divides it.",
      "$13 \\cdot 71 = 923$，而 923 除以 3、7、11 分别余 2、6、10，所以它们都不整除它。",
    ],
    [
      "decide from a gcd how many primes a progression holds, using Dirichlet's theorem, and prove a simple case with Euclid's method.",
      "用狄利克雷定理由最大公因数判断等差数列含多少个素数，并用欧几里得的方法证明一个简单情形。",
    ],
  ),
  lesson(
    squares,
    [
      "Why does 7 need four squares? Squares leave 0, 1 or 4 on division by 8, and no three of those add up to 7, so $7 = 4 + 1 + 1 + 1$ cannot be shortened. By contrast $14 = 9 + 4 + 1$ uses three.",
      "为什么 7 需要四个平方数？平方数除以 8 余 0、1 或 4，其中任意三个相加都不会余 7，所以 $7 = 4 + 1 + 1 + 1$ 不能再短。相比之下 $14 = 9 + 4 + 1$ 只用三个。",
    ],
    [
      "The sums of three of $0, 1, 4$ are $0, 1, 2, 3, 4, 5, 6, 8, 9, 12$, and 7 is missing.",
      "从 $0, 1, 4$ 中取三个相加，得到 $0, 1, 2, 3, 4, 5, 6, 8, 9, 12$，唯独没有 7。",
    ],
    [
      "recognize the numbers of the form $4^a (8b + 7)$ that need four squares, and find the fewest squares for any number.",
      "认出需要四个平方数的 $4^a (8b + 7)$ 形式的数，并求任意数所需的最少平方数个数。",
    ],
  ),
];
