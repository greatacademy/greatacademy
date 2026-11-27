// The rest of a first course in Number Theory: unique factorization, bases, factoring and primality algorithms,
// public-key exchange, quadratic congruences, Mobius inversion, the size of primes, indices, binomials modulo primes,
// descent, quadratic forms, periodic continued fractions, Dirichlet series, and quadratic integers.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";

import {
  divisors,
  factorizationLatex,
  factorize,
  isPrime,
  type Pair,
  pickComposite,
  point,
  powMod,
  primesUpTo,
  same,
  topic,
  totient,
} from "../university-kit.ts";
import { chosen, lesson, type Miss, mobius, pw, type Slip, until, worked } from "./number-theory-course.ts";

/** gcdOf computes the greatest common divisor of two positive whole numbers. */
const gcdOf = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcdOf(b, a % b));

/** smallPrimes lists the primes used by the generators in this file. */
const smallPrimes = primesUpTo(60);

/** oddPrimes lists the odd primes used by the generators in this file. */
const oddPrimes = smallPrimes.filter((p) => p !== 2);

/** digitsIn lists the digits of n in base b, the leading digit first. */
const digitsIn = (n: number, b: number): number[] => {
  const out: number[] = [];
  for (let m = n; m > 0; m = Math.floor(m / b)) out.unshift(m % b);
  return out.length > 0 ? out : [0];
};

/** product writes prime powers as a product, leaving out zero exponents, or 1 when nothing is left. */
const product = (parts: readonly (readonly [number, number])[]): string => {
  const kept = parts.filter(([, e]) => e > 0).map(([p, e]) => pw(p, e));
  return kept.length > 0 ? kept.join(" \\cdot ") : "1";
};

/** euclid writes the division steps of the Euclidean algorithm on a and b, with a at least b. */
const euclid = (a: number, b: number): string => {
  const steps: string[] = [];
  let [x, y] = [a, b];
  while (y > 0) {
    steps.push(`${x} = ${Math.floor(x / y)} \\cdot ${y} + ${x % y}`);
    [x, y] = [y, x % y];
  }
  return steps.join(", \\; ");
};

/** halves checks a power modulo m a second way, as the product of two smaller powers. */
const halves = (g: number, e: number, m: number): Pair => {
  const h = Math.floor(e / 2);
  const [u, w] = [powMod(g, h, m), powMod(g, e - h, m)];
  const v = (u * w) % m;
  const text = `$${pw(g, e)} = ${pw(g, h)} \\cdot ${pw(g, e - h)} \\equiv ${u} \\cdot ${w} = ${u * w} \\equiv ${v} \\pmod{${m}}$`;
  return [`Split the exponent: ${text}.`, `把指数拆开：${text}。`];
};

/** orderOf finds the multiplicative order of a unit a modulo n. */
const orderOf = (a: number, n: number): number => {
  let k = 1;
  for (let v = a % n; v !== 1; v = (v * a) % n) k += 1;
  return k;
};

/** factorialExponent adds the floors of n over the powers of p, the exponent of p in n!. */
const factorialExponent = (n: number, p: number): number => {
  let e = 0;
  for (let m = Math.floor(n / p); m > 0; m = Math.floor(m / p)) e += m;
  return e;
};

/** binomial computes a binomial coefficient exactly. */
const binomial = (n: number, k: number): bigint => {
  let r = 1n;
  for (let i = 0; i < k; i++) r = (r * BigInt(n - i)) / BigInt(i + 1);
  return r;
};

/** small computes a binomial coefficient that fits in an ordinary number. */
const small = (n: number, k: number): number => Number(binomial(n, k));

/** rowModP counts the entries of row n of Pascal's triangle not divisible by p, building the row modulo p. */
const rowModP = (n: number, p: number): number => {
  let row = [1];
  for (let i = 1; i <= n; i++) {
    const next = [1];
    for (let k = 1; k < i; k++) next.push(((row[k - 1] as number) + (row[k] as number)) % p);
    next.push(1);
    row = next;
  }
  return row.filter((v) => v !== 0).length;
};

const fundamentalTheorem = topic(
  "gcd-and-lcm-from-prime-exponents",
  ["The GCD and LCM From Prime Exponents", "由质数指数求最大公约数和最小公倍数"],
  [
    "Read the gcd and the lcm from prime exponents, and link them by a product formula.",
    "从质因数的指数读出最大公约数和最小公倍数，并用乘积公式把它们联系起来。",
  ],
  ["the-fundamental-theorem-of-arithmetic"],
  [],
  [
    point(
      "the-gcd-from-exponents",
      ["The gcd from exponents", "由指数求最大公约数"],
      [
        "Every whole number above 1 factors into primes in exactly one way. A common divisor can use each prime at most as often as both numbers do, so the gcd takes the smaller exponent of each prime. For $2^{3} \\cdot 3^{5}$ and $2^{5} \\cdot 3^{2}$ the smaller exponents are 3 and 2, so the gcd is $2^{3} \\cdot 3^{2} = 72$.\n\nCheck: dividing by 72 leaves $3^{3} = 27$ and $2^{2} = 4$, which share no prime, so no larger common divisor exists.\n\n> **Watch out.** Taking the larger exponent of each prime gives the lcm, not the gcd. And a prime keeps its place in the gcd only if it divides both numbers.",
        "每个大于 1 的整数都以唯一的方式分解成质数。公约数中每个质数的次数不能超过两个数各自的次数，所以最大公约数对每个质数取较小的指数。对 $2^{3} \\cdot 3^{5}$ 和 $2^{5} \\cdot 3^{2}$，较小的指数是 3 和 2，所以最大公约数是 $2^{3} \\cdot 3^{2} = 72$。\n\n检验：除以 72 后剩下 $3^{3} = 27$ 和 $2^{2} = 4$，它们没有公共质数，所以不存在更大的公约数。\n\n> **注意。** 对每个质数取较大的指数得到的是最小公倍数，不是最大公约数。而且只有同时整除两个数的质数才留在最大公约数里。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = (rng.sample([2, 3, 5, 7], 2) as [number, number]).sort((x, y) => x - y);
          const [a, b, c, d] = [rng.int(2, 7), rng.int(2, 7), rng.int(2, 6), rng.int(2, 6)];
          const [m, k] = [Math.min(a, b), Math.min(c, d)];
          const lo = p ** m * q ** k;
          return worked(
            [
              `What is the gcd of $${p}^{${a}} \\cdot ${q}^{${c}}$ and $${p}^{${b}} \\cdot ${q}^{${d}}$?`,
              `$${p}^{${a}} \\cdot ${q}^{${c}}$ 和 $${p}^{${b}} \\cdot ${q}^{${d}}$ 的最大公约数是多少？`,
            ],
            lo,
            [
              [
                p ** Math.max(a, b) * q ** Math.max(c, d),
                "That takes the larger exponent of each prime, which gives the lcm.",
                "那对每个质数取了较大的指数，得到的是最小公倍数。",
              ],
              [p ** m, `That leaves out the prime ${q}, which divides both numbers.`, `那漏掉了质数 ${q}，它同时整除两个数。`],
              [q ** k, `That leaves out the prime ${p}, which divides both numbers.`, `那漏掉了质数 ${p}，它同时整除两个数。`],
              [
                p ** m * q ** Math.max(c, d),
                `That takes the smaller exponent of ${p} but the larger one of ${q}; every prime takes its smaller exponent.`,
                `那对 ${p} 取了较小的指数，对 ${q} 却取了较大的；每个质数都要取较小的指数。`,
              ],
            ],
            [
              [
                [`Compare the exponents of ${p}`, `比较 ${p} 的指数`],
                [`The exponents are ${a} and ${b}, and the smaller is ${m}.`, `指数是 ${a} 和 ${b}，较小的是 ${m}。`],
              ],
              [
                [`Compare the exponents of ${q}`, `比较 ${q} 的指数`],
                [`The exponents are ${c} and ${d}, and the smaller is ${k}.`, `指数是 ${c} 和 ${d}，较小的是 ${k}。`],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${p}^{${m}} \\cdot ${q}^{${k}} = ${p ** m} \\cdot ${q ** k} = ${lo}$.`,
                  `$${p}^{${m}} \\cdot ${q}^{${k}} = ${p ** m} \\cdot ${q ** k} = ${lo}$。`,
                ],
              ],
            ],
            [
              `Dividing by ${lo} leaves $${product([
                [p, a - m],
                [q, c - k],
              ])}$ and $${product([
                [p, b - m],
                [q, d - k],
              ])}$, and for each prime one of these has exponent 0, so they share no prime.`,
              `除以 ${lo} 后剩下 $${product([
                [p, a - m],
                [q, c - k],
              ])}$ 和 $${product([
                [p, b - m],
                [q, d - k],
              ])}$，每个质数在其中一个里的指数是 0，所以它们没有公共质数。`,
            ],
          );
        }),
    ),
    point(
      "the-lcm-from-exponents",
      ["The lcm from exponents", "由指数求最小公倍数"],
      [
        "A common multiple must contain each prime at least as often as each of the two numbers does. So the lcm takes the larger exponent of each prime, and a prime dividing only one number still appears. For $2^{2} \\cdot 3$ and $2^{3} \\cdot 5$ the lcm is $2^{3} \\cdot 3 \\cdot 5 = 120$.\n\nCheck: the gcd is $2^{2} = 4$, and $4 \\cdot 120 = 480 = 12 \\cdot 40$, the product of the two numbers.\n\n> **Watch out.** Adding the exponents of a shared prime gives the product of the numbers, not the lcm. And a prime that divides only one of the numbers must not be dropped.",
        "公倍数中每个质数的次数必须不少于两个数各自的次数。所以最小公倍数对每个质数取较大的指数，只整除一个数的质数也要出现。对 $2^{2} \\cdot 3$ 和 $2^{3} \\cdot 5$，最小公倍数是 $2^{3} \\cdot 3 \\cdot 5 = 120$。\n\n检验：最大公约数是 $2^{2} = 4$，而 $4 \\cdot 120 = 480 = 12 \\cdot 40$，正是两个数的乘积。\n\n> **注意。** 把公共质数的指数相加，得到的是两个数的乘积，不是最小公倍数。只整除其中一个数的质数也不能丢掉。",
      ],
      (rng) =>
        until(() => {
          const [p, q, r] = rng.sample([2, 3, 5, 7], 3) as [number, number, number];
          const [a, b, c] = [rng.int(2, 5), rng.int(2, 5), rng.int(2, 4)];
          const hi = Math.max(a, b);
          const big = p ** hi * q ** c * r;
          return worked(
            [
              `What is the lcm of $${p}^{${a}} \\cdot ${q}^{${c}}$ and $${p}^{${b}} \\cdot ${r}$?`,
              `$${p}^{${a}} \\cdot ${q}^{${c}}$ 和 $${p}^{${b}} \\cdot ${r}$ 的最小公倍数是多少？`,
            ],
            big,
            [
              [
                p ** Math.min(a, b),
                `That is the gcd: it takes the smaller exponent of ${p} and drops the primes that divide only one number.`,
                `那是最大公约数：它取 ${p} 的较小指数，并丢掉了只整除一个数的质数。`,
              ],
              [
                p ** hi * q ** c,
                `That drops ${r}, which divides only the second number but must still divide the lcm.`,
                `那丢掉了 ${r}，它只整除第二个数，但仍必须整除最小公倍数。`,
              ],
              [
                p ** (a + b) * q ** c * r,
                `That adds the exponents of ${p}, which gives the product of the two numbers, not the lcm.`,
                `那把 ${p} 的指数相加了，得到的是两个数的乘积，不是最小公倍数。`,
              ],
            ],
            [
              [
                [`The larger power of ${p}`, `${p} 的较大次幂`],
                [`The exponents are ${a} and ${b}, so take $${p}^{${hi}}$.`, `指数是 ${a} 和 ${b}，所以取 $${p}^{${hi}}$。`],
              ],
              [
                ["Keep the other primes", "保留其他质数"],
                [
                  `$${q}^{${c}}$ divides only the first number and ${r} only the second, and both stay.`,
                  `$${q}^{${c}}$ 只整除第一个数，${r} 只整除第二个数，两者都要保留。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${p}^{${hi}} \\cdot ${q}^{${c}} \\cdot ${r} = ${p ** hi} \\cdot ${q ** c} \\cdot ${r} = ${big}$.`,
                  `$${p}^{${hi}} \\cdot ${q}^{${c}} \\cdot ${r} = ${p ** hi} \\cdot ${q ** c} \\cdot ${r} = ${big}$。`,
                ],
              ],
            ],
            [
              `The gcd is $${p}^{${Math.min(a, b)}}$, and $${p}^{${Math.min(a, b)}} \\cdot ${p}^{${hi}} \\cdot ${q}^{${c}} \\cdot ${r} = ${p}^{${a + b}} \\cdot ${q}^{${c}} \\cdot ${r}$, the product of the two numbers.`,
              `最大公约数是 $${p}^{${Math.min(a, b)}}$，而 $${p}^{${Math.min(a, b)}} \\cdot ${p}^{${hi}} \\cdot ${q}^{${c}} \\cdot ${r} = ${p}^{${a + b}} \\cdot ${q}^{${c}} \\cdot ${r}$，正是两个数的乘积。`,
            ],
          );
        }),
    ),
    point(
      "the-product-formula",
      ["The product formula", "乘积公式"],
      [
        "For each prime, the smaller exponent plus the larger exponent is the sum of both exponents. So the gcd times the lcm equals the product of the two numbers, and knowing one of them gives the other. If $a = 36$, the gcd is 6 and the lcm is 180, then $ab = 6 \\cdot 180 = 1080$ and $b = \\frac{1080}{36} = 30$.\n\nCheck: $36 = 6 \\cdot 6$ and $30 = 6 \\cdot 5$, so the gcd is $6$ and the lcm is $6 \\cdot 6 \\cdot 5 = 180$.\n\n> **Watch out.** The lcm divided by $a$ is not $b$: the gcd has to be multiplied in first. And the formula multiplies; subtracting $a$ from the lcm means nothing.",
        "对每个质数，较小指数加较大指数等于两个指数之和。所以最大公约数乘最小公倍数等于两个数的乘积，知道其中一个就能得到另一个。如果 $a = 36$，最大公约数是 6，最小公倍数是 180，那么 $ab = 6 \\cdot 180 = 1080$，$b = \\frac{1080}{36} = 30$。\n\n检验：$36 = 6 \\cdot 6$，$30 = 6 \\cdot 5$，所以最大公约数是 $6$，最小公倍数是 $6 \\cdot 6 \\cdot 5 = 180$。\n\n> **注意。** 最小公倍数除以 $a$ 不是 $b$：要先乘上最大公约数。而且公式是相乘；用最小公倍数减去 $a$ 没有意义。",
      ],
      (rng) =>
        until(() => {
          const g = rng.int(2, 15);
          const x = rng.int(2, 25);
          let y = rng.int(2, 25);
          if (gcdOf(x, y) !== 1) y = x + 1;
          const a = g * x;
          const b = g * y;
          const l = g * x * y;
          return worked(
            [
              `Two numbers are $a = ${a}$ and $b$, with $\\gcd(a, b) = ${g}$ and $\\operatorname{lcm}(a, b) = ${l}$. What is $b$?`,
              `两个数是 $a = ${a}$ 和 $b$，$\\gcd(a, b) = ${g}$，$\\operatorname{lcm}(a, b) = ${l}$。$b$ 是多少？`,
            ],
            b,
            [
              [
                y,
                "That divides the lcm by $a$ and forgets to multiply by the gcd first.",
                "那是用最小公倍数除以 $a$，忘了先乘最大公约数。",
              ],
              [l - a, "That subtracts $a$ from the lcm; the formula multiplies and divides.", "那是用最小公倍数减去 $a$；公式是乘和除。"],
              [g * l, "That is the product $ab$; divide it by $a$ to get $b$.", "那是乘积 $ab$；还要除以 $a$ 才得到 $b$。"],
            ],
            [
              [
                ["Use the product formula", "用乘积公式"],
                [
                  `$ab = \\gcd \\cdot \\operatorname{lcm} = ${g} \\cdot ${l} = ${g * l}$.`,
                  `$ab = \\gcd \\cdot \\operatorname{lcm} = ${g} \\cdot ${l} = ${g * l}$。`,
                ],
              ],
              [
                ["Divide by $a$", "除以 $a$"],
                [`$b = \\frac{${g * l}}{${a}} = ${b}$.`, `$b = \\frac{${g * l}}{${a}} = ${b}$。`],
              ],
            ],
            [
              `$${a} = ${g} \\cdot ${x}$ and $${b} = ${g} \\cdot ${y}$ with $\\gcd(${x}, ${y}) = 1$, so the gcd is ${g} and the lcm is $${g} \\cdot ${x} \\cdot ${y} = ${l}$.`,
              `$${a} = ${g} \\cdot ${x}$，$${b} = ${g} \\cdot ${y}$，且 $\\gcd(${x}, ${y}) = 1$，所以最大公约数是 ${g}，最小公倍数是 $${g} \\cdot ${x} \\cdot ${y} = ${l}$。`,
            ],
          );
        }),
    ),
  ],
);

const baseExpansions = topic(
  "base-expansions",
  ["Base Expansions", "进制展开"],
  [
    "Convert between bases using the division algorithm, and read divisibility from digits.",
    "用带余除法在进制之间转换，并从数字读出整除性。",
  ],
  ["the-division-algorithm"],
  [],
  [
    point(
      "the-value-of-digits",
      ["The value of digits", "数字的值"],
      [
        "In base $b$, each digit counts a power of $b$. So a numeral is a polynomial in $b$, and its value can be computed by working from the leading digit, multiplying by $b$ and adding the next digit. For $2101_{3}$ the place values are $27, 9, 3, 1$, so the value is $2 \\cdot 27 + 1 \\cdot 9 + 0 \\cdot 3 + 1 = 64$.\n\nCheck: from the leading digit, $2 \\cdot 3 + 1 = 7$, then $7 \\cdot 3 + 0 = 21$, then $21 \\cdot 3 + 1 = 64$.\n\n> **Watch out.** The leading digit of a four-digit numeral counts $b^{3}$, not $b^{4}$, because the last digit counts $b^{0} = 1$. Adding the digits gives the digit sum, not the value.",
        "在 $b$ 进制中，每个数字计算 $b$ 的一个幂。所以数码是关于 $b$ 的多项式，可以从最高位开始，每次乘 $b$ 再加下一位来计算它的值。对 $2101_{3}$，各位的位值是 $27, 9, 3, 1$，所以值是 $2 \\cdot 27 + 1 \\cdot 9 + 0 \\cdot 3 + 1 = 64$。\n\n检验：从最高位开始，$2 \\cdot 3 + 1 = 7$，然后 $7 \\cdot 3 + 0 = 21$，再然后 $21 \\cdot 3 + 1 = 64$。\n\n> **注意。** 四位数码的最高位表示 $b^{3}$，不是 $b^{4}$，因为最后一位表示 $b^{0} = 1$。把各位数字相加得到的是数字和，不是值。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(3, 9);
          const d = [rng.int(1, b - 1), rng.int(0, b - 1), rng.int(0, b - 1), rng.int(0, b - 1)];
          const [d0, d1, d2, d3] = d as [number, number, number, number];
          const v = d0 * b ** 3 + d1 * b * b + d2 * b + d3;
          const h1 = d0 * b + d1;
          const h2 = h1 * b + d2;
          return worked(
            [`What is the value of the base ${b} numeral $${d.join("")}_{${b}}$?`, `${b} 进制数码 $${d.join("")}_{${b}}$ 的值是多少？`],
            v,
            [
              [
                d0 + d1 + d2 + d3,
                "That adds the digits, which gives the digit sum, not the value.",
                "那把各位数字相加了，得到的是数字和，不是值。",
              ],
              [Number(d.join("")), "That reads the numeral as if it were written in base ten.", "那把这个数码当成十进制来读了。"],
              [
                d0 * b ** 4 + d1 * b ** 3 + d2 * b * b + d3 * b,
                `That gives the leading digit the place value $${b}^{4}$; the last digit counts $${b}^{0} = 1$, so the leading one counts $${b}^{3}$.`,
                `那让最高位表示 $${b}^{4}$；最后一位表示 $${b}^{0} = 1$，所以最高位表示 $${b}^{3}$。`,
              ],
              [
                d3 * b ** 3 + d2 * b * b + d1 * b + d0,
                "That reads the digits from the right, as if the last digit were the leading one.",
                "那是从右往左读数字，把最后一位当成了最高位。",
              ],
            ],
            [
              [
                ["Write the place values", "写出位值"],
                [
                  `From the left the digits count $${b}^{3} = ${b ** 3}$, $${b}^{2} = ${b * b}$, $${b}$ and $1$.`,
                  `从左起各位分别表示 $${b}^{3} = ${b ** 3}$、$${b}^{2} = ${b * b}$、$${b}$ 和 $1$。`,
                ],
              ],
              [
                ["Multiply and add", "相乘再相加"],
                [
                  `$${d0} \\cdot ${b ** 3} + ${d1} \\cdot ${b * b} + ${d2} \\cdot ${b} + ${d3} = ${d0 * b ** 3} + ${d1 * b * b} + ${d2 * b} + ${d3} = ${v}$.`,
                  `$${d0} \\cdot ${b ** 3} + ${d1} \\cdot ${b * b} + ${d2} \\cdot ${b} + ${d3} = ${d0 * b ** 3} + ${d1 * b * b} + ${d2 * b} + ${d3} = ${v}$。`,
                ],
              ],
            ],
            [
              `From the leading digit: $${d0} \\cdot ${b} + ${d1} = ${h1}$, then $${h1} \\cdot ${b} + ${d2} = ${h2}$, then $${h2} \\cdot ${b} + ${d3} = ${v}$.`,
              `从最高位开始：$${d0} \\cdot ${b} + ${d1} = ${h1}$，然后 $${h1} \\cdot ${b} + ${d2} = ${h2}$，再然后 $${h2} \\cdot ${b} + ${d3} = ${v}$。`,
            ],
          );
        }),
    ),
    point(
      "digits-by-repeated-division",
      ["Digits by repeated division", "反复除法求数字"],
      [
        "Dividing by $b$ leaves the last digit as the remainder. Repeating with the quotient produces the digits from right to left, which is why the division algorithm guarantees that an expansion exists and is unique. For 45 in base 4: $45 = 11 \\cdot 4 + 1$, $11 = 2 \\cdot 4 + 3$ and $2 = 0 \\cdot 4 + 2$, so $45 = 231_{4}$, with digit sum $2 + 3 + 1 = 6$.\n\nCheck: $2 \\cdot 16 + 3 \\cdot 4 + 1 = 45$.\n\n> **Watch out.** The digits are the remainders, read from the last division back to the first. The quotients are not digits, and the decimal digits of the number have nothing to do with its digits in base $b$.",
        "除以 $b$ 的余数是最后一位。对商重复这一步，从右到左得到各位数字，这就是带余除法保证展开存在且唯一的原因。把 45 写成 4 进制：$45 = 11 \\cdot 4 + 1$，$11 = 2 \\cdot 4 + 3$，$2 = 0 \\cdot 4 + 2$，所以 $45 = 231_{4}$，数字和是 $2 + 3 + 1 = 6$。\n\n检验：$2 \\cdot 16 + 3 \\cdot 4 + 1 = 45$。\n\n> **注意。** 各位数字是余数，要从最后一次除法倒着读回第一次。商不是数字，这个数的十进制数字与它在 $b$ 进制中的数字也毫无关系。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(2, 9);
          const n = rng.int(b * b, b ** 3 * 4 + 200);
          const steps: string[] = [];
          const quotients: number[] = [];
          for (let m = n; m > 0; m = Math.floor(m / b)) {
            steps.push(`${m} = ${Math.floor(m / b)} \\cdot ${b} + ${m % b}`);
            if (Math.floor(m / b) > 0) quotients.push(Math.floor(m / b));
          }
          const digits = digitsIn(n, b);
          const sum = digits.reduce((x, y) => x + y, 0);
          const rebuilt = digits.map((dg, i) => `${dg} \\cdot ${pw(b, digits.length - 1 - i)}`).join(" + ");
          return worked(
            [`Write ${n} in base ${b}. What is the sum of its digits?`, `把 ${n} 写成 ${b} 进制。它的各位数字之和是多少？`],
            sum,
            [
              [
                quotients.reduce((x, y) => x + y, 0),
                "That adds the quotients; the digits are the remainders.",
                "那把商加起来了；各位数字是余数。",
              ],
              [
                String(n)
                  .split("")
                  .reduce((x, y) => x + Number(y), 0),
                "That adds the decimal digits of the number, which are its digits in base ten.",
                "那把这个数的十进制数字加起来了，那是它在十进制中的数字。",
              ],
              [n % b, "That keeps only the last digit, the first remainder.", "那只保留了最后一位，也就是第一个余数。"],
              [digits.length, "That counts the digits instead of adding them.", "那数了数字的个数，而没有把它们相加。"],
            ],
            [
              [
                [`Divide by ${b} repeatedly`, `反复除以 ${b}`],
                [`$${steps.join(", \\; ")}$.`, `$${steps.join(", \\; ")}$。`],
              ],
              [
                ["Read the remainders backward", "倒着读余数"],
                [`So $${n} = ${digits.join("")}_{${b}}$.`, `所以 $${n} = ${digits.join("")}_{${b}}$。`],
              ],
              [
                ["Add the digits", "把数字相加"],
                [`$${digits.join(" + ")} = ${sum}$.`, `$${digits.join(" + ")} = ${sum}$。`],
              ],
            ],
            [`$${rebuilt} = ${n}$.`, `$${rebuilt} = ${n}$。`],
          );
        }),
    ),
    point(
      "divisibility-in-base-b",
      ["Divisibility in base b", "b 进制中的整除性"],
      [
        "Since $b \\equiv 1 \\pmod{b - 1}$, every power of $b$ is also $1$ modulo $b - 1$. So a numeral in base $b$ is congruent to its digit sum modulo $b - 1$, which generalizes the rule for divisibility by nine in base ten. For $3521_{6}$ the digit sum is $11$, which leaves $1$ on division by 5.\n\nCheck: $3521_{6} = 3 \\cdot 216 + 5 \\cdot 36 + 2 \\cdot 6 + 1 = 841 = 168 \\cdot 5 + 1$.\n\n> **Watch out.** The digit sum works modulo $b - 1$; the last digit alone settles the remainder modulo $b$, and the alternating sum is the test for $b + 1$. Reduce the digit sum at the end.",
        "因为 $b \\equiv 1 \\pmod{b - 1}$，$b$ 的每个幂模 $b - 1$ 也都是 $1$。所以 $b$ 进制数码模 $b - 1$ 同余于它的数字和，这推广了十进制中被九整除的规则。对 $3521_{6}$，数字和是 $11$，除以 5 余 $1$。\n\n检验：$3521_{6} = 3 \\cdot 216 + 5 \\cdot 36 + 2 \\cdot 6 + 1 = 841 = 168 \\cdot 5 + 1$。\n\n> **注意。** 数字和对模 $b - 1$ 有效；只看最后一位决定的是模 $b$ 的余数，交错和是对 $b + 1$ 的检验。最后还要把数字和化简。",
      ],
      (rng) =>
        until(() => {
          const b = rng.int(4, 16);
          const count = rng.int(3, 6);
          const d = Array.from({ length: count }, () => rng.int(0, Math.min(b - 1, 9)));
          d[0] = rng.int(1, Math.min(b - 1, 9));
          const s = d.reduce((x, y) => x + y, 0);
          const r = s % (b - 1);
          const last = d[d.length - 1] as number;
          const alt = d.reduceRight((acc, dg, i) => acc + ((d.length - 1 - i) % 2 === 0 ? dg : -dg), 0);
          const value = d.reduce((acc, dg) => acc * b + dg, 0);
          return worked(
            [
              `What is the remainder when $${d.join("")}_{${b}}$ is divided by ${b - 1}?`,
              `$${d.join("")}_{${b}}$ 除以 ${b - 1} 的余数是多少？`,
            ],
            r,
            [
              [s, `That is the digit sum itself; reduce it modulo ${b - 1}.`, `那是数字和本身；还要把它模 ${b - 1} 化简。`],
              [
                last,
                `That takes the last digit, which settles the remainder modulo ${b}, not modulo ${b - 1}.`,
                `那取了最后一位，它决定的是模 ${b} 的余数，不是模 ${b - 1} 的。`,
              ],
              [
                ((alt % (b - 1)) + (b - 1)) % (b - 1),
                `That uses the alternating digit sum, which is the test for ${b + 1}, not for ${b - 1}.`,
                `那用了交错数字和，它是对 ${b + 1} 的检验，不是对 ${b - 1} 的。`,
              ],
            ],
            [
              [
                ["Each power of the base", "底数的每个幂"],
                [
                  `$${b} \\equiv 1 \\pmod{${b - 1}}$, so every power of ${b} is $1$ modulo ${b - 1}, and each digit counts just once.`,
                  `$${b} \\equiv 1 \\pmod{${b - 1}}$，所以 ${b} 的每个幂模 ${b - 1} 都是 $1$，每位数字只算一次。`,
                ],
              ],
              [
                ["Add the digits", "把数字相加"],
                [`$${d.join(" + ")} = ${s}$.`, `$${d.join(" + ")} = ${s}$。`],
              ],
              [
                ["Reduce", "化简"],
                [
                  `$${s} = ${Math.floor(s / (b - 1))} \\cdot ${b - 1} + ${r}$.`,
                  `$${s} = ${Math.floor(s / (b - 1))} \\cdot ${b - 1} + ${r}$。`,
                ],
              ],
            ],
            [
              `In base ten the numeral is ${value}, and $${value} = ${Math.floor(value / (b - 1))} \\cdot ${b - 1} + ${r}$.`,
              `这个数码在十进制中是 ${value}，而 $${value} = ${Math.floor(value / (b - 1))} \\cdot ${b - 1} + ${r}$。`,
            ],
          );
        }),
    ),
  ],
);

const fermatFactor = topic(
  "fermat-factorization",
  ["Fermat Factorization", "费马分解法"],
  ["Factor an odd number by writing it as a difference of two squares.", "把奇数写成两个平方数之差来分解它。"],
  ["properties-of-prime-divisibility"],
  [],
  [
    point(
      "the-starting-value",
      ["The starting value", "起始值"],
      [
        "To write $n = a^{2} - b^{2}$, we need $a^{2} \\ge n$. So the search starts at the smallest whole number whose square reaches $n$, and it moves upward until $a^{2} - n$ is a perfect square. For $n = 391$: $19^{2} = 361$ is too small and $20^{2} = 400$ is enough, so the search starts at $a = 20$.\n\nCheck: $400 - 391 = 9 = 3^{2}$, so the very first value works, and $391 = 17 \\cdot 23$.\n\n> **Watch out.** Rounding $\\sqrt{n}$ down gives a square below $n$, and then $a^{2} - n$ is negative. Only when $n$ is itself a perfect square does the search start exactly at $\\sqrt{n}$.",
        "要写成 $n = a^{2} - b^{2}$，需要 $a^{2} \\ge n$。所以搜索从平方达到 $n$ 的最小整数开始，向上移动，直到 $a^{2} - n$ 是完全平方数。对 $n = 391$：$19^{2} = 361$ 太小，$20^{2} = 400$ 足够，所以搜索从 $a = 20$ 开始。\n\n检验：$400 - 391 = 9 = 3^{2}$，所以第一个值就成功了，$391 = 17 \\cdot 23$。\n\n> **注意。** 把 $\\sqrt{n}$ 向下取整，得到的平方小于 $n$，这时 $a^{2} - n$ 是负数。只有 $n$ 本身是完全平方数时，搜索才恰好从 $\\sqrt{n}$ 开始。",
      ],
      (rng) =>
        until(() => {
          const n = 2 * rng.int(20, 4000) + 1;
          const a = Math.ceil(Math.sqrt(n));
          return worked(
            [`Fermat's method on $n = ${n}$ starts at which value of $a$?`, `对 $n = ${n}$ 用费马方法，从哪个 $a$ 值开始？`],
            a,
            [
              [
                a * a === n ? a + 1 : a - 1,
                a * a === n
                  ? `That skips $a = ${a}$, whose square is exactly ${n}.`
                  : `That rounds $\\sqrt{${n}}$ down; its square, ${(a - 1) ** 2}, is below ${n}.`,
                a * a === n
                  ? `那跳过了 $a = ${a}$，它的平方恰好是 ${n}。`
                  : `那是把 $\\sqrt{${n}}$ 向下取整；它的平方 ${(a - 1) ** 2} 小于 ${n}。`,
              ],
              [
                (n + 1) / 2,
                `That is the value of $a$ for the trivial factorization $1 \\cdot ${n}$, where the search would end, not start.`,
                `那是平凡分解 $1 \\cdot ${n}$ 对应的 $a$ 值，搜索在那里结束，而不是开始。`,
              ],
              [
                Math.round(n / 2),
                "That halves $n$; the start is near the square root of $n$, not near half of it.",
                "那是把 $n$ 减半；起点在 $n$ 的平方根附近，而不是在一半附近。",
              ],
            ],
            [
              [
                ["Bracket the square root", "夹住平方根"],
                [
                  `$${a - 1}^{2} = ${(a - 1) ** 2}$ and $${a}^{2} = ${a * a}$, so $${a - 1}^{2} < ${n} \\le ${a}^{2}$.`,
                  `$${a - 1}^{2} = ${(a - 1) ** 2}$，$${a}^{2} = ${a * a}$，所以 $${a - 1}^{2} < ${n} \\le ${a}^{2}$。`,
                ],
              ],
              [
                ["Take the upper value", "取上面的值"],
                [`The smallest $a$ with $a^{2} \\ge ${n}$ is ${a}.`, `满足 $a^{2} \\ge ${n}$ 的最小 $a$ 是 ${a}。`],
              ],
            ],
            [
              `$${a}^{2} - ${n} = ${a * a - n} \\ge 0$, while $${a - 1}^{2} - ${n} = ${(a - 1) ** 2 - n}$ is negative.`,
              `$${a}^{2} - ${n} = ${a * a - n} \\ge 0$，而 $${a - 1}^{2} - ${n} = ${(a - 1) ** 2 - n}$ 是负数。`,
            ],
          );
        }),
    ),
    point(
      "factoring-from-two-squares",
      ["Factoring from two squares", "由两个平方数分解"],
      [
        "Once $a^{2} - n$ is a square $b^{2}$, the number factors as $n = (a - b)(a + b)$. So the factors of $n$ are read at once from the two values found by the search. For example, $47^{2} - 2193 = 2209 - 2193 = 16 = 4^{2}$, so $2193 = (47 - 4)(47 + 4) = 43 \\cdot 51$.\n\nCheck: $43 \\cdot 51 = 2193$.\n\n> **Watch out.** The factors are $a - b$ and $a + b$, not $a$ and $b$ themselves.",
        "一旦 $a^{2} - n$ 是平方数 $b^{2}$，这个数就分解成 $n = (a - b)(a + b)$。所以 $n$ 的因数可以从搜索得到的两个值直接读出。例如 $47^{2} - 2193 = 2209 - 2193 = 16 = 4^{2}$，所以 $2193 = (47 - 4)(47 + 4) = 43 \\cdot 51$。\n\n检验：$43 \\cdot 51 = 2193$。\n\n> **注意。** 因数是 $a - b$ 和 $a + b$，而不是 $a$ 和 $b$ 本身。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(30, 300);
          const b = rng.int(1, 25);
          const n = a * a - b * b;
          return worked(
            [
              `Given $${a}^{2} - ${n} = ${b}^{2}$, what is the smaller factor from Fermat's method?`,
              `已知 $${a}^{2} - ${n} = ${b}^{2}$，费马方法给出的较小因数是多少？`,
            ],
            a - b,
            [
              [a + b, "That is the larger factor, $a + b$.", "那是较大的因数 $a + b$。"],
              [a, "That takes $a$ itself; the factors are $a - b$ and $a + b$.", "那取了 $a$ 本身；因数是 $a - b$ 和 $a + b$。"],
              [b, "That takes $b$ itself; the factors are $a - b$ and $a + b$.", "那取了 $b$ 本身；因数是 $a - b$ 和 $a + b$。"],
            ],
            [
              [
                ["Factor the difference of squares", "分解平方差"],
                [
                  `$${n} = ${a}^{2} - ${b}^{2} = (${a} - ${b})(${a} + ${b})$.`,
                  `$${n} = ${a}^{2} - ${b}^{2} = (${a} - ${b})(${a} + ${b})$。`,
                ],
              ],
              [
                ["Compute the factors", "算出因数"],
                [`The factors are ${a - b} and ${a + b}, and the smaller is ${a - b}.`, `因数是 ${a - b} 和 ${a + b}，较小的是 ${a - b}。`],
              ],
            ],
            [`$${a - b} \\cdot ${a + b} = ${n}$.`, `$${a - b} \\cdot ${a + b} = ${n}$。`],
          );
        }),
    ),
    point(
      "running-the-search",
      ["Running the search", "进行搜索"],
      [
        "The method succeeds quickly when the two factors are close, because then $a$ is close to the square root of $n$. If the factors are far apart, then many values of $a$ must be tried. For $n = 1763$, $\\sqrt{1763} \\approx 41.99$, so the search starts at $a = 42$, and $42^{2} - 1763 = 1 = 1^{2}$ at once. So $1763 = 41 \\cdot 43$.\n\nCheck: $41 \\cdot 43 = 1763$.\n\n> **Watch out.** The value $a$ where the search stops lies halfway between the factors; it is not a factor itself.",
        "当两个因数接近时，这个方法很快成功，因为这时 $a$ 接近 $n$ 的平方根。如果因数相差很远，就要试很多个 $a$ 值。对 $n = 1763$，$\\sqrt{1763} \\approx 41.99$，所以搜索从 $a = 42$ 开始，而 $42^{2} - 1763 = 1 = 1^{2}$，立刻成功。所以 $1763 = 41 \\cdot 43$。\n\n检验：$41 \\cdot 43 = 1763$。\n\n> **注意。** 搜索停下时的 $a$ 位于两个因数正中间；它本身不是因数。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(15, 150);
          const gap = rng.int(1, 6);
          const n = (2 * m + 1) * (2 * m + 1 + 2 * gap);
          const a = 2 * m + 1 + gap;
          return worked(
            [
              `Use Fermat's method to factor $${n}$, which has two close factors. What is the larger factor?`,
              `用费马方法分解 $${n}$，它有两个接近的因数。较大的因数是多少？`,
            ],
            a + gap,
            [
              [a - gap, "That is the smaller factor, $a - b$.", "那是较小的因数 $a - b$。"],
              [
                a,
                "That is the value of $a$ where the search stops, halfway between the factors.",
                "那是搜索停下时的 $a$ 值，位于两个因数正中间。",
              ],
              [a + gap * gap, "That adds $b^{2}$ to $a$; the factor is $a + b$.", "那是给 $a$ 加上 $b^{2}$；因数是 $a + b$。"],
            ],
            [
              [
                ["Start at the square root", "从平方根开始"],
                [
                  `$${a - 1}^{2} = ${(a - 1) ** 2} < ${n} \\le ${a * a} = ${a}^{2}$, so start at $a = ${a}$.`,
                  `$${a - 1}^{2} = ${(a - 1) ** 2} < ${n} \\le ${a * a} = ${a}^{2}$，所以从 $a = ${a}$ 开始。`,
                ],
              ],
              [
                ["Test for a square", "检验是否为平方数"],
                [
                  `$${a}^{2} - ${n} = ${gap * gap} = ${gap}^{2}$, so $b = ${gap}$.`,
                  `$${a}^{2} - ${n} = ${gap * gap} = ${gap}^{2}$，所以 $b = ${gap}$。`,
                ],
              ],
              [
                ["Read the factors", "读出因数"],
                [
                  `$${n} = (${a} - ${gap})(${a} + ${gap}) = ${a - gap} \\cdot ${a + gap}$, and the larger is ${a + gap}.`,
                  `$${n} = (${a} - ${gap})(${a} + ${gap}) = ${a - gap} \\cdot ${a + gap}$，较大的是 ${a + gap}。`,
                ],
              ],
            ],
            [`$${a - gap} \\cdot ${a + gap} = ${n}$.`, `$${a - gap} \\cdot ${a + gap} = ${n}$。`],
          );
        }),
    ),
  ],
);

const pollard = topic(
  "pollards-rho-method",
  ["Pollard's Rho Method", "波拉德 rho 方法"],
  ["Find a factor from a repeating sequence modulo a hidden prime.", "从模隐藏质数的循环序列中找到因数。"],
  ["the-euclidean-algorithm", "modular-congruence"],
  [],
  [
    point(
      "iterating-the-map",
      ["Iterating the map", "迭代映射"],
      [
        "The method iterates $x \\mapsto x^{2} + c$ modulo $n$. The sequence behaves like a random one, and because there are finitely many residues, it must eventually repeat, tracing out a shape like the letter rho. With $n = 91$, $c = 1$ and $x_0 = 2$: $x_1 = 5$, $x_2 = 26$, and $x_3 = 677 = 7 \\cdot 91 + 40$, so $x_3 = 40$.\n\nCheck: the same map modulo the factor 7 gives $2, 5, 5, 5$, and indeed $26 \\equiv 5$ and $40 \\equiv 5 \\pmod{7}$.\n\n> **Watch out.** Add $c$ after squaring every time, and reduce modulo $n$ after each step, not only at the end.",
        "这个方法在模 $n$ 下迭代 $x \\mapsto x^{2} + c$。序列表现得像随机序列，因为剩余只有有限个，它最终必然重复，画出一个像字母 rho 的形状。取 $n = 91$，$c = 1$，$x_0 = 2$：$x_1 = 5$，$x_2 = 26$，$x_3 = 677 = 7 \\cdot 91 + 40$，所以 $x_3 = 40$。\n\n检验：同一个映射模因数 7 给出 $2, 5, 5, 5$，而确实 $26 \\equiv 5$，$40 \\equiv 5 \\pmod{7}$。\n\n> **注意。** 每次平方后都要加 $c$，并且每一步之后都要模 $n$，而不是只在最后才模。",
      ],
      (rng) =>
        until(() => {
          const n = pickComposite(rng, 91, 1500);
          const x = rng.int(2, 40);
          const c = rng.int(1, 5);
          const x1 = (x * x + c) % n;
          const x2 = (x1 * x1 + c) % n;
          const p = (factorize(n)[0] as [number, number])[0];
          const y0 = x % p;
          const y1 = (y0 * y0 + c) % p;
          const y2 = (y1 * y1 + c) % p;
          return worked(
            [
              `With $f(x) = x^{2} + ${c}$ modulo ${n} and $x_0 = ${x}$, what is $x_2$?`,
              `取 $f(x) = x^{2} + ${c}$ 模 ${n}，$x_0 = ${x}$，$x_2$ 是多少？`,
            ],
            x2,
            [
              [x1, "That is $x_1$; the map has to be applied twice.", "那是 $x_1$；映射要用两次。"],
              [(x1 * x1) % n, `That squares $x_1$ but forgets to add ${c}.`, `那把 $x_1$ 平方了，却忘了加 ${c}。`],
              [x1 * x1 + c, `That forgets to reduce modulo ${n}.`, `那忘了模 ${n} 化简。`],
              [
                (x ** 4 + c) % n,
                `That squares twice but adds ${c} only once; the map adds ${c} at every step.`,
                `那平方了两次却只加了一次 ${c}；映射每一步都要加 ${c}。`,
              ],
            ],
            [
              [
                ["The first step", "第一步"],
                [
                  `$x_1 = ${x}^{2} + ${c} = ${x * x + c} \\equiv ${x1} \\pmod{${n}}$.`,
                  `$x_1 = ${x}^{2} + ${c} = ${x * x + c} \\equiv ${x1} \\pmod{${n}}$。`,
                ],
              ],
              [
                ["The second step", "第二步"],
                [
                  `$x_2 = ${x1}^{2} + ${c} = ${x1 * x1 + c} \\equiv ${x2} \\pmod{${n}}$.`,
                  `$x_2 = ${x1}^{2} + ${c} = ${x1 * x1 + c} \\equiv ${x2} \\pmod{${n}}$。`,
                ],
              ],
            ],
            [
              `Run the same map modulo the factor ${p} of ${n}: $${y0}, ${y1}, ${y2}$, and $${x2} \\equiv ${x2 % p} \\pmod{${p}}$ agrees with the last term.`,
              `对 ${n} 的因数 ${p} 运行同一个映射：$${y0}, ${y1}, ${y2}$，而 $${x2} \\equiv ${x2 % p} \\pmod{${p}}$ 与最后一项一致。`,
            ],
          );
        }),
    ),
    point(
      "a-factor-from-a-difference",
      ["A factor from a difference", "由差得因数"],
      [
        "If two terms agree modulo a hidden prime factor $p$, then $p$ divides their difference. So the gcd of the difference and $n$ reveals a factor, without our having to know $p$ in advance. For $n = 221$ with terms 20 and 59, the difference is 39, and $221 = 5 \\cdot 39 + 26$, $39 = 1 \\cdot 26 + 13$, $26 = 2 \\cdot 13$, so the gcd is 13.\n\nCheck: $221 = 13 \\cdot 17$ and $39 = 13 \\cdot 3$.\n\n> **Watch out.** The difference itself is usually not a factor of $n$; only its gcd with $n$ is. A gcd of 1 means these two terms told us nothing.",
        "如果两项模隐藏的质因数 $p$ 相同，那么 $p$ 整除它们的差。所以差与 $n$ 的最大公约数给出一个因数，而不必事先知道 $p$。对 $n = 221$，两项是 20 和 59，差是 39，而 $221 = 5 \\cdot 39 + 26$，$39 = 1 \\cdot 26 + 13$，$26 = 2 \\cdot 13$，所以最大公约数是 13。\n\n检验：$221 = 13 \\cdot 17$，$39 = 13 \\cdot 3$。\n\n> **注意。** 差本身通常不是 $n$ 的因数；只有它与 $n$ 的最大公约数才是。最大公约数是 1 说明这两项没有提供信息。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = rng.sample(oddPrimes, 2) as [number, number];
          const n = p * q;
          const j = rng.int(1, q - 1);
          const x = rng.int(1, n - 1 - p * j);
          const y = x + p * j;
          const g = gcdOf(y - x, n);
          return worked(
            [
              `In Pollard's method on $n = ${n}$, two terms are ${x} and ${y}. What is $\\gcd(${y} - ${x}, ${n})$?`,
              `对 $n = ${n}$ 用波拉德方法，两项是 ${x} 和 ${y}。$\\gcd(${y} - ${x}, ${n})$ 是多少？`,
            ],
            g,
            [
              [
                n / g,
                `That is the other factor of ${n}; the difference ${y - x} is a multiple of ${g}, not of ${n / g}.`,
                `那是 ${n} 的另一个因数；差 ${y - x} 是 ${g} 的倍数，不是 ${n / g} 的倍数。`,
              ],
              [y - x, `That is the difference itself, which does not divide ${n}.`, `那是差本身，它不整除 ${n}。`],
              [
                1,
                "That treats the two numbers as coprime; run the Euclidean algorithm to the end.",
                "那把两个数当成了互质；要把欧几里得算法做完。",
              ],
              [n, `That takes ${n} itself, which does not divide the difference.`, `那取了 ${n} 本身，它不整除差。`],
            ],
            [
              [
                ["Take the difference", "求差"],
                [`$${y} - ${x} = ${y - x}$.`, `$${y} - ${x} = ${y - x}$。`],
              ],
              [
                ["Run the Euclidean algorithm", "用欧几里得算法"],
                [`$${euclid(n, y - x)}$, so the gcd is ${g}.`, `$${euclid(n, y - x)}$，所以最大公约数是 ${g}。`],
              ],
            ],
            [
              `$${n} = ${g} \\cdot ${n / g}$ and $${y - x} = ${g} \\cdot ${(y - x) / g}$, and ${n / g} does not divide ${(y - x) / g}.`,
              `$${n} = ${g} \\cdot ${n / g}$，$${y - x} = ${g} \\cdot ${(y - x) / g}$，而 ${n / g} 不整除 ${(y - x) / g}。`,
            ],
          );
        }),
    ),
    point(
      "the-cycle-of-the-sequence",
      ["The cycle of the sequence", "序列的循环"],
      [
        "Floyd's trick moves one pointer once and another twice per step, and they must meet inside the cycle. For a small modulus we can list the terms directly, and so find how long the tail and the cycle are. Modulo 11 with $x \\mapsto x^{2} + 1$ from 0, the terms are $0, 1, 2, 5, 4, 6, 4$: the tail is $0, 1, 2, 5$ and the cycle is $4, 6$, of length 2.\n\nCheck: $4^{2} + 1 = 17 \\equiv 6$ and $6^{2} + 1 = 37 \\equiv 4 \\pmod{11}$, so 4 returns after 2 steps.\n\n> **Watch out.** The cycle length counts only the repeating part. The number of terms before the first repeat is the tail plus the cycle.",
        "弗洛伊德的技巧让一个指针每步走一次，另一个走两次，它们必然在循环内相遇。对小的模数可以直接列出各项，从而求出尾部和循环的长度。模 11 用 $x \\mapsto x^{2} + 1$ 从 0 开始，各项是 $0, 1, 2, 5, 4, 6, 4$：尾部是 $0, 1, 2, 5$，循环是 $4, 6$，长度为 2。\n\n检验：$4^{2} + 1 = 17 \\equiv 6$，$6^{2} + 1 = 37 \\equiv 4 \\pmod{11}$，所以 4 在 2 步后回来。\n\n> **注意。** 循环长度只数重复的部分。第一次重复之前的项数是尾部加循环。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(oddPrimes.filter((v) => v >= 11));
          const x0 = rng.int(0, p - 1);
          const c = rng.int(1, 6);
          const seen = new Map<number, number>();
          let x = x0;
          let i = 0;
          while (!seen.has(x)) {
            seen.set(x, i);
            x = (x * x + c) % p;
            i += 1;
          }
          const tail = seen.get(x) as number;
          const cycle = i - tail;
          const loop = [...seen.keys()].slice(tail);
          const terms = [...seen.keys(), x];
          return worked(
            [
              `Iterate $x \\mapsto x^{2} + ${c}$ modulo ${p}, starting at ${x0}. How long is the cycle that the sequence falls into?`,
              `从 ${x0} 开始，在模 ${p} 下迭代 $x \\mapsto x^{2} + ${c}$。序列落入的循环有多长？`,
            ],
            cycle,
            [
              [
                i,
                "That counts every term before the repeat, the tail as well as the cycle.",
                "那数了重复之前的所有项，把尾部和循环都算进去了。",
              ],
              [tail, "That counts the tail, the terms before the cycle starts.", "那数的是尾部，即循环开始之前的项。"],
              [
                cycle + 1,
                "That counts the repeated value twice, at the start and the end of the cycle.",
                "那把重复的值在循环的开头和结尾各算了一次。",
              ],
            ],
            [
              [
                ["List the terms", "列出各项"],
                [`$${terms.join(", ")}$.`, `$${terms.join(", ")}$。`],
              ],
              [
                ["Find the first repeat", "找到第一次重复"],
                [
                  `The value ${x} first appeared as term ${tail}, and it comes back as term ${i}.`,
                  `值 ${x} 第一次出现在第 ${tail} 项，又在第 ${i} 项出现。`,
                ],
              ],
              [
                ["Count the cycle", "数循环"],
                [`$${i} - ${tail} = ${cycle}$.`, `$${i} - ${tail} = ${cycle}$。`],
              ],
            ],
            [
              `The cycle is $${loop.join(", ")}$, ${cycle} values, and the next term after ${loop[loop.length - 1]} is $${loop[loop.length - 1]}^{2} + ${c} = ${(loop[loop.length - 1] as number) ** 2 + c} \\equiv ${x} \\pmod{${p}}$.`,
              `循环是 $${loop.join(", ")}$，共 ${cycle} 个值，而 ${loop[loop.length - 1]} 之后的下一项是 $${loop[loop.length - 1]}^{2} + ${c} = ${(loop[loop.length - 1] as number) ** 2 + c} \\equiv ${x} \\pmod{${p}}$。`,
            ],
          );
        }),
    ),
  ],
);

const diffieHellman = topic(
  "the-diffie-hellman-key-exchange",
  ["The Diffie-Hellman Key Exchange", "迪菲-赫尔曼密钥交换"],
  ["Agree on a shared secret in public, using powers modulo a prime.", "用模质数的幂在公开场合约定共同的密钥。"],
  ["discrete-logarithms"],
  [],
  [
    point(
      "a-public-value",
      ["A public value", "公开值"],
      [
        "Two people agree in public on a prime $p$ and a base $g$. Each one picks a private exponent and announces $g$ to that power modulo $p$, and recovering the exponent from this number is a discrete logarithm problem. With $p = 23$, $g = 5$ and the private exponent 6: $5^{2} = 25 \\equiv 2$, $5^{4} \\equiv 2^{2} = 4$ and $5^{6} = 5^{4} \\cdot 5^{2} \\equiv 8$, so the announced value is 8.\n\nCheck: $5^{6} = 15625 = 679 \\cdot 23 + 8$.\n\n> **Watch out.** The announced value is a power, not a product: $5 \\cdot 6 = 30$ is not it. The base is $g$ and the private number is the exponent, not the other way around.",
        "两人公开约定质数 $p$ 和底数 $g$。每人选一个私有指数，并公布 $g$ 的这个次幂模 $p$，从这个数恢复指数就是离散对数问题。取 $p = 23$，$g = 5$，私有指数为 6：$5^{2} = 25 \\equiv 2$，$5^{4} \\equiv 2^{2} = 4$，$5^{6} = 5^{4} \\cdot 5^{2} \\equiv 8$，所以公布的值是 8。\n\n检验：$5^{6} = 15625 = 679 \\cdot 23 + 8$。\n\n> **注意。** 公布的值是幂，不是乘积：$5 \\cdot 6 = 30$ 不对。底数是 $g$，私有数是指数，不能颠倒。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(smallPrimes.filter((v) => v >= 11));
          const g = rng.int(2, p - 2);
          const a = rng.int(2, 12);
          const v = powMod(g, a, p);
          const list = Array.from({ length: a }, (_, i) => powMod(g, i + 1, p));
          return worked(
            [
              `With $p = ${p}$ and $g = ${g}$, a private exponent is ${a}. What value is announced?`,
              `取 $p = ${p}$，$g = ${g}$，私有指数是 ${a}。公布的值是什么？`,
            ],
            v,
            [
              [
                (g * a) % p,
                "That multiplies the base by the exponent; the announced value is a power.",
                "那是把底数乘以指数；公布的值是幂。",
              ],
              [powMod(a, g, p), "That swaps the base and the exponent.", "那把底数和指数颠倒了。"],
              [powMod(g, a - 1, p), "That stops one multiplication short.", "那少乘了一次。"],
            ],
            [
              [
                ["Multiply by the base step by step", "逐步乘以底数"],
                [
                  `The powers of ${g} up to $${g}^{${a}}$ modulo ${p} are $${list.join(", ")}$.`,
                  `${g} 直到 $${g}^{${a}}$ 的各次幂模 ${p} 依次是 $${list.join(", ")}$。`,
                ],
              ],
              [
                ["Read the last one", "读出最后一个"],
                [`$${g}^{${a}} \\equiv ${v} \\pmod{${p}}$.`, `$${g}^{${a}} \\equiv ${v} \\pmod{${p}}$。`],
              ],
            ],
            halves(g, a, p),
          );
        }),
    ),
    point(
      "the-shared-secret",
      ["The shared secret", "共同的密钥"],
      [
        "Each person raises the other's public value to their own private exponent. Both obtain $g^{ab}$ modulo $p$, so they share a secret number that was never sent across the open channel. With $p = 23$ and $g = 5$, if your exponent is 6 and you receive 19, the secret is $19^{6} \\equiv (-4)^{6} = 4096 \\equiv 2 \\pmod{23}$.\n\nCheck: your partner's exponent is 15, since $5^{15} \\equiv 19$, and your public value is $5^{6} \\equiv 8$; your partner computes $8^{15} \\equiv 2$ as well.\n\n> **Watch out.** The secret combines the received value with your own exponent. Your own public value $g^{a}$ is known to everyone, so it cannot be the secret.",
        "每人把对方的公开值升到自己的私有指数次幂。两人都得到 $g^{ab}$ 模 $p$，所以共享一个从未在公开信道上传送的秘密数。取 $p = 23$，$g = 5$，如果你的指数是 6，收到的是 19，密钥就是 $19^{6} \\equiv (-4)^{6} = 4096 \\equiv 2 \\pmod{23}$。\n\n检验：对方的指数是 15，因为 $5^{15} \\equiv 19$；你的公开值是 $5^{6} \\equiv 8$；对方算出的 $8^{15} \\equiv 2$ 也一样。\n\n> **注意。** 密钥由收到的值和你自己的指数组合而成。你自己的公开值 $g^{a}$ 人人都知道，不可能是密钥。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(smallPrimes.filter((v) => v >= 11));
          const g = rng.int(2, p - 2);
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const pub = powMod(g, b, p);
          const mine = powMod(g, a, p);
          const key = powMod(pub, a, p);
          const list = Array.from({ length: a }, (_, i) => powMod(pub, i + 1, p));
          return worked(
            [
              `With $p = ${p}$ and $g = ${g}$, your private exponent is ${a}, and you receive the public value ${pub}. What is the shared secret?`,
              `取 $p = ${p}$，$g = ${g}$，你的私有指数是 ${a}，收到的公开值是 ${pub}。共同的密钥是什么？`,
            ],
            key,
            [
              [mine, "That is your own public value, which everyone can see.", "那是你自己的公开值，人人都能看到。"],
              [
                (pub * a) % p,
                "That multiplies the received value by your exponent; raise it to that power.",
                "那是把收到的值乘以你的指数；应当升到这个次幂。",
              ],
              [powMod(a, pub, p), "That swaps the base and the exponent.", "那把底数和指数颠倒了。"],
            ],
            [
              [
                ["Raise the received value to your exponent", "把收到的值升到你的指数次幂"],
                [
                  `The powers of ${pub} up to $${pub}^{${a}}$ modulo ${p} are $${list.join(", ")}$.`,
                  `${pub} 直到 $${pub}^{${a}}$ 的各次幂模 ${p} 依次是 $${list.join(", ")}$。`,
                ],
              ],
              [
                ["Read the secret", "读出密钥"],
                [`$${pub}^{${a}} \\equiv ${key} \\pmod{${p}}$.`, `$${pub}^{${a}} \\equiv ${key} \\pmod{${p}}$。`],
              ],
            ],
            [
              `The other side used the exponent ${b}, since $${g}^{${b}} \\equiv ${pub}$. Your public value is $${g}^{${a}} \\equiv ${mine}$, and the other side computes $${mine}^{${b}} \\equiv ${powMod(mine, b, p)} \\pmod{${p}}$, the same number.`,
              `对方用的指数是 ${b}，因为 $${g}^{${b}} \\equiv ${pub}$。你的公开值是 $${g}^{${a}} \\equiv ${mine}$，对方算出 $${mine}^{${b}} \\equiv ${powMod(mine, b, p)} \\pmod{${p}}$，是同一个数。`,
            ],
          );
        }),
    ),
    point(
      "breaking-a-small-exchange",
      ["Breaking a small exchange", "破解小的交换"],
      [
        "An eavesdropper who can find a discrete logarithm can compute the secret. With a small prime, simply trying the exponents one by one is enough, which is why real systems use extremely large primes. With $p = 11$ and $g = 2$, the powers of 2 are $2, 4, 8, 5, 10, 9, \\ldots$, so the announced value 9 came from the exponent 6.\n\nCheck: $2^{6} = 64 = 5 \\cdot 11 + 9$.\n\n> **Watch out.** The exponent is the position in the list of powers, starting from $g$ itself; it is not the announced value. Counting from $g^{0} = 1$ makes it one too large.",
        "能求离散对数的窃听者就能算出密钥。质数很小时，逐个试指数就足够了，这就是实际系统使用极大质数的原因。取 $p = 11$，$g = 2$，2 的幂是 $2, 4, 8, 5, 10, 9, \\ldots$，所以公布的值 9 来自指数 6。\n\n检验：$2^{6} = 64 = 5 \\cdot 11 + 9$。\n\n> **注意。** 指数是在幂的列表中的位置，从 $g$ 本身数起；它不是公布的值。从 $g^{0} = 1$ 开始数会多一。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]);
          let g = 2;
          while (orderOf(g, p) !== p - 1) g += 1;
          const a = rng.int(2, p - 2);
          const v = powMod(g, a, p);
          const list = Array.from({ length: a }, (_, i) => powMod(g, i + 1, p));
          return worked(
            [
              `With $p = ${p}$ and $g = ${g}$, someone announces ${v}. What private exponent between 1 and ${p - 1} was used?`,
              `取 $p = ${p}$，$g = ${g}$，某人公布 ${v}。使用的私有指数（在 1 和 ${p - 1} 之间）是多少？`,
            ],
            a,
            [
              [v, "That takes the announced value for the exponent.", "那把公布的值当成了指数。"],
              [a + 1, `That counts from $${g}^{0} = 1$ as the first entry, one too many.`, `那把 $${g}^{0} = 1$ 当成第一项来数，多了一。`],
              [
                p - 1 - a,
                `That exponent gives the inverse of ${v}, since $${g}^{${p - 1 - a}} \\cdot ${g}^{${a}} = ${g}^{${p - 1}} \\equiv 1$.`,
                `那个指数给出的是 ${v} 的逆，因为 $${g}^{${p - 1 - a}} \\cdot ${g}^{${a}} = ${g}^{${p - 1}} \\equiv 1$。`,
              ],
            ],
            [
              [
                [`List the powers of ${g}`, `列出 ${g} 的幂`],
                [
                  `Modulo ${p}, $${g}, ${g}^{2}, \\ldots$ are $${list.join(", ")}$.`,
                  `模 ${p} 时，$${g}, ${g}^{2}, \\ldots$ 依次是 $${list.join(", ")}$。`,
                ],
              ],
              [
                ["Find the announced value", "找到公布的值"],
                [`${v} appears at position ${a}, so the exponent is ${a}.`, `${v} 出现在第 ${a} 个位置，所以指数是 ${a}。`],
              ],
            ],
            halves(g, a, p),
          );
        }),
    ),
  ],
);

const quadraticComposite = topic(
  "quadratic-congruences-modulo-composites",
  ["Quadratic Congruences Modulo Composites", "模合数的二次同余"],
  ["Count and combine the square roots modulo a product of primes.", "计算并组合模质数乘积的平方根。"],
  ["the-chinese-remainder-theorem", "quadratic-residues"],
  [],
  [
    point(
      "counting-the-roots",
      ["Counting the roots", "计算根的个数"],
      [
        "By the Chinese remainder theorem, solutions modulo $pq$ correspond to pairs of solutions modulo $p$ and $q$. So if $a$ is a nonzero square modulo both odd primes, then $x^{2} \\equiv a$ has exactly four solutions. Modulo 15, $x^{2} \\equiv 1$ has the roots $1, 4, 11, 14$: they are $\\pm 1$ modulo 3 paired with $\\pm 1$ modulo 5.\n\nCheck: $4^{2} = 16 = 15 + 1$ and $11^{2} = 121 = 8 \\cdot 15 + 1$.\n\n> **Watch out.** The counts multiply, so $k$ odd primes give $2^{k}$ roots, not $2k$. The mixed roots, $+1$ modulo one prime and $-1$ modulo another, are easy to forget.",
        "由中国剩余定理，模 $pq$ 的解对应模 $p$ 和模 $q$ 的解对。所以如果 $a$ 模两个奇质数都是非零平方数，$x^{2} \\equiv a$ 恰有四个解。模 15 时，$x^{2} \\equiv 1$ 的根是 $1, 4, 11, 14$：它们是模 3 的 $\\pm 1$ 与模 5 的 $\\pm 1$ 配成的对。\n\n检验：$4^{2} = 16 = 15 + 1$，$11^{2} = 121 = 8 \\cdot 15 + 1$。\n\n> **注意。** 个数要相乘，所以 $k$ 个奇质数给出 $2^{k}$ 个根，而不是 $2k$ 个。模一个质数为 $+1$、模另一个为 $-1$ 的混合根很容易被忘掉。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = rng.sample(oddPrimes, 2) as [number, number];
          const r = rng.pick(oddPrimes.filter((v) => v !== p && v !== q));
          const three = rng.bool();
          const k = three ? 3 : 2;
          const n = three ? p * q * r : p * q;
          const c = 2 ** k;
          const primes = (three ? [p, q, r] : [p, q]).sort((x, y) => x - y);
          const roots: number[] = [];
          for (let y = 1; y < n; y++) if ((y * y) % n === 1) roots.push(y);
          const second = roots[1] as number;
          return worked(
            [`How many solutions does $x^{2} \\equiv 1 \\pmod{${n}}$ have?`, `$x^{2} \\equiv 1 \\pmod{${n}}$ 有多少个解？`],
            c,
            [
              [
                2,
                `That counts only $\\pm 1$, as for a prime modulus; ${n} has ${k} prime factors.`,
                `那只数了 $\\pm 1$，就像模数是质数一样；${n} 有 ${k} 个质因数。`,
              ],
              [
                2 * k,
                "That adds two roots per prime; the choices for different primes multiply.",
                "那是每个质数加两个根；不同质数的选择要相乘。",
              ],
              [c - 1, "That misses one combination of signs.", "那漏掉了一种符号组合。"],
            ],
            [
              [
                ["Factor the modulus", "分解模数"],
                [
                  `$${n} = ${primes.join(" \\cdot ")}$, with ${k} odd prime factors.`,
                  `$${n} = ${primes.join(" \\cdot ")}$，有 ${k} 个奇质因数。`,
                ],
              ],
              [
                ["Roots modulo each prime", "模每个质数的根"],
                [
                  "Modulo an odd prime, $x^{2} \\equiv 1$ has exactly the two roots $\\pm 1$.",
                  "模奇质数时，$x^{2} \\equiv 1$ 恰有两个根 $\\pm 1$。",
                ],
              ],
              [
                ["Combine by the Chinese remainder theorem", "用中国剩余定理组合"],
                [
                  `Each choice of signs gives one root, so there are $2^{${k}} = ${c}$.`,
                  `每种符号选择给出一个根，所以共有 $2^{${k}} = ${c}$ 个。`,
                ],
              ],
            ],
            [
              `The roots are $${roots.join(", ")}$; for example $${second}^{2} = ${second * second} = ${(second * second - 1) / n} \\cdot ${n} + 1$.`,
              `这些根是 $${roots.join(", ")}$；例如 $${second}^{2} = ${second * second} = ${(second * second - 1) / n} \\cdot ${n} + 1$。`,
            ],
          );
        }),
    ),
    point(
      "a-prime-power-of-two",
      ["A power of two", "二的幂"],
      [
        "Powers of two behave differently. Modulo 8 and any higher power of 2, the congruence $x^{2} \\equiv 1$ has four solutions, namely $\\pm 1$ and $\\pm 1$ shifted by half of the modulus, while modulo 2 and 4 it has fewer. Modulo 16 the roots are $1, 7, 9, 15$, since $(8 \\pm 1)^{2} = 64 \\pm 16 + 1$ and both 64 and 16 are multiples of 16.\n\nCheck: $7^{2} = 49 = 3 \\cdot 16 + 1$ and $9^{2} = 81 = 5 \\cdot 16 + 1$.\n\n> **Watch out.** The count stays at 4 however high the power of 2 is; it does not grow with the exponent. Half of the modulus itself is not a root, since its square is a multiple of the modulus.",
        "二的幂的情况不同。模 8 及更高的 2 的幂，同余式 $x^{2} \\equiv 1$ 有四个解，即 $\\pm 1$ 和平移了模数一半的 $\\pm 1$，而模 2 和模 4 的解更少。模 16 时根是 $1, 7, 9, 15$，因为 $(8 \\pm 1)^{2} = 64 \\pm 16 + 1$，而 64 和 16 都是 16 的倍数。\n\n检验：$7^{2} = 49 = 3 \\cdot 16 + 1$，$9^{2} = 81 = 5 \\cdot 16 + 1$。\n\n> **注意。** 不管 2 的幂多高，个数始终是 4；它不随指数增长。模数的一半本身不是根，因为它的平方是模数的倍数。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(3, 14);
          const n = 2 ** k;
          const h = n / 2;
          const m = h + 1;
          const v = rng.int(1, 3);
          const answer = v === 1 ? 4 : v === 2 ? m : m - 2;
          const misses: Miss[] =
            v === 1
              ? [
                  [2, "That counts only $\\pm 1$, as for an odd prime.", "那只数了 $\\pm 1$，就像模奇质数一样。"],
                  [
                    k,
                    "That gives one root per factor of 2; the count is 4 for every power from 8 on.",
                    "那是每个因子 2 给一个根；从 8 起每个 2 的幂都是 4 个。",
                  ],
                  [2 * k, "That lets the count grow with the exponent; it stays at 4.", "那让个数随指数增长；它始终是 4。"],
                ]
              : [
                  [
                    v === 2 ? m - 2 : m,
                    v === 2 ? "That is the other shifted root, just below half." : "That is the other shifted root, just above half.",
                    v === 2 ? "那是另一个平移后的根，略小于一半。" : "那是另一个平移后的根，略大于一半。",
                  ],
                  [
                    h,
                    `That is half the modulus itself, whose square is a multiple of ${n}.`,
                    `那是模数的一半本身，它的平方是 ${n} 的倍数。`,
                  ],
                  [n - 1, "That is $-1$, one of the two obvious roots.", "那是 $-1$，两个显然的根之一。"],
                ];
          const shown = v === 1 ? m : answer;
          return worked(
            v === 1
              ? [`How many solutions does $x^{2} \\equiv 1 \\pmod{${n}}$ have?`, `$x^{2} \\equiv 1 \\pmod{${n}}$ 有多少个解？`]
              : v === 2
                ? [
                    `Besides $\\pm 1$, the congruence $x^{2} \\equiv 1 \\pmod{${n}}$ has a solution just above half of the modulus. What is it?`,
                    `除 $\\pm 1$ 外，$x^{2} \\equiv 1 \\pmod{${n}}$ 有一个略大于模数一半的解。它是多少？`,
                  ]
                : [
                    `Besides $\\pm 1$, the congruence $x^{2} \\equiv 1 \\pmod{${n}}$ has a solution just below half of the modulus. What is it?`,
                    `除 $\\pm 1$ 外，$x^{2} \\equiv 1 \\pmod{${n}}$ 有一个略小于模数一半的解。它是多少？`,
                  ],
            answer,
            misses,
            [
              [
                ["Shift by half the modulus", "平移模数的一半"],
                [
                  `$(${h} \\pm 1)^{2} = ${h}^{2} \\pm 2 \\cdot ${h} + 1$, and both $${h}^{2}$ and $2 \\cdot ${h} = ${n}$ are multiples of ${n}.`,
                  `$(${h} \\pm 1)^{2} = ${h}^{2} \\pm 2 \\cdot ${h} + 1$，而 $${h}^{2}$ 和 $2 \\cdot ${h} = ${n}$ 都是 ${n} 的倍数。`,
                ],
              ],
              [
                ["List the roots", "列出根"],
                [
                  `The roots are $1, ${h - 1}, ${h + 1}, ${n - 1}$${v === 1 ? ", four in all" : `, and the one asked for is ${answer}`}.`,
                  `根是 $1, ${h - 1}, ${h + 1}, ${n - 1}$${v === 1 ? "，共四个" : `，所求的是 ${answer}`}。`,
                ],
              ],
            ],
            [
              `$${shown}^{2} = ${shown * shown} = ${(shown * shown - 1) / n} \\cdot ${n} + 1$.`,
              `$${shown}^{2} = ${shown * shown} = ${(shown * shown - 1) / n} \\cdot ${n} + 1$。`,
            ],
          );
        }),
    ),
    point(
      "combining-roots-with-crt",
      ["Combining roots with CRT", "用中国剩余定理组合根"],
      [
        "To solve $x^{2} \\equiv a$ modulo a product, find the roots modulo each factor and then combine them. A root modulo the product can be tested directly by squaring it, which confirms the work. For $x^{2} \\equiv 15 \\pmod{77}$: modulo 7, $15 \\equiv 1$ has the roots $\\pm 1$, and modulo 11, $15 \\equiv 4$ has the roots $\\pm 2$. The four combinations give $13, 20, 57, 64$, so the smallest root is 13.\n\nCheck: $13^{2} = 169 = 2 \\cdot 77 + 15$.\n\n> **Watch out.** A root modulo one prime is not yet a root modulo the product; it has to satisfy both conditions at once.",
        "要解模乘积的 $x^{2} \\equiv a$，先求模每个因子的根，再组合它们。可以通过平方直接检验模乘积的根，从而确认结果。对 $x^{2} \\equiv 15 \\pmod{77}$：模 7 时 $15 \\equiv 1$，根是 $\\pm 1$；模 11 时 $15 \\equiv 4$，根是 $\\pm 2$。四种组合给出 $13, 20, 57, 64$，所以最小的根是 13。\n\n检验：$13^{2} = 169 = 2 \\cdot 77 + 15$。\n\n> **注意。** 模一个质数的根还不是模乘积的根；它必须同时满足两个条件。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = (rng.sample([7, 11, 13, 17, 19, 23], 2) as [number, number]).sort((x, y) => x - y);
          const n = p * q;
          const pool = Array.from({ length: Math.floor(n / 2) - 1 }, (_, i) => i + 2).filter(
            (y) => gcdOf(y, n) === 1 && !Number.isInteger(Math.sqrt((y * y) % n)),
          );
          const a = rng.pick(pool) ** 2 % n;
          const roots: number[] = [];
          for (let y = 1; y < n; y++) if ((y * y) % n === a) roots.push(y);
          const rootMod = (m: number) => {
            for (let y = 1; y < m; y++) if ((y * y) % m === a % m) return y;
            return 0;
          };
          const [rp, rq] = [rootMod(p), rootMod(q)];
          const r0 = roots[0] as number;
          const pairs = roots.map((y) => `${y} \\equiv ${y % p} \\ (${p}), \\ ${y % q} \\ (${q})`).join("; \\; ");
          return worked(
            [
              `What is the smallest positive solution of $x^{2} \\equiv ${a} \\pmod{${n}}$?`,
              `$x^{2} \\equiv ${a} \\pmod{${n}}$ 的最小正解是多少？`,
            ],
            r0,
            [
              [roots[1] as number, "That is a root, but not the smallest one.", "那是一个根，但不是最小的。"],
              [n - r0, "That is the negative of the smallest root, which is the largest root.", "那是最小根的相反数，也就是最大的根。"],
              [rp, `That is a root modulo ${p} only; it must also be a root modulo ${q}.`, `那只是模 ${p} 的根；它还必须是模 ${q} 的根。`],
              [rq, `That is a root modulo ${q} only; it must also be a root modulo ${p}.`, `那只是模 ${q} 的根；它还必须是模 ${p} 的根。`],
            ],
            [
              [
                [`Roots modulo ${p}`, `模 ${p} 的根`],
                [
                  `$${a} \\equiv ${a % p} \\pmod{${p}}$, with the roots $\\pm ${rp}$, that is ${rp} and ${p - rp}.`,
                  `$${a} \\equiv ${a % p} \\pmod{${p}}$，根是 $\\pm ${rp}$，即 ${rp} 和 ${p - rp}。`,
                ],
              ],
              [
                [`Roots modulo ${q}`, `模 ${q} 的根`],
                [
                  `$${a} \\equiv ${a % q} \\pmod{${q}}$, with the roots $\\pm ${rq}$, that is ${rq} and ${q - rq}.`,
                  `$${a} \\equiv ${a % q} \\pmod{${q}}$，根是 $\\pm ${rq}$，即 ${rq} 和 ${q - rq}。`,
                ],
              ],
              [
                ["Combine the four pairs", "组合四对"],
                [`$${pairs}$. The smallest is ${r0}.`, `$${pairs}$。最小的是 ${r0}。`],
              ],
            ],
            [
              `$${r0}^{2} = ${r0 * r0} = ${Math.floor((r0 * r0) / n)} \\cdot ${n} + ${a}$.`,
              `$${r0}^{2} = ${r0 * r0} = ${Math.floor((r0 * r0) / n)} \\cdot ${n} + ${a}$。`,
            ],
          );
        }),
    ),
  ],
);

const generalCrt = topic(
  "systems-with-non-coprime-moduli",
  ["Systems With Non-Coprime Moduli", "模不互质的同余方程组"],
  ["Decide whether a system of congruences is consistent, and find its solutions.", "判断同余方程组是否相容，并求它的解。"],
  ["the-chinese-remainder-theorem"],
  [],
  [
    point(
      "the-compatibility-test",
      ["The compatibility test", "相容性检验"],
      [
        "The system $x \\equiv a \\pmod{m}$, $x \\equiv b \\pmod{n}$ has a solution exactly when $\\gcd(m, n)$ divides $b - a$. Otherwise, the two conditions disagree modulo that gcd, and no number can meet both. For $x \\equiv 3 \\pmod{6}$ and $x \\equiv 5 \\pmod{8}$, the gcd 2 divides $5 - 3 = 2$, so solutions exist; but $x \\equiv 3 \\pmod{6}$ and $x \\equiv 4 \\pmod{8}$ ask $x$ to be odd and even at once.\n\nCheck: $21 = 3 \\cdot 6 + 3 = 2 \\cdot 8 + 5$ solves the first system.\n\n> **Watch out.** The test uses the gcd of the moduli, not their product. Solvability has nothing to do with how large $x$ is, and a solvable system has infinitely many integer solutions.",
        "方程组 $x \\equiv a \\pmod{m}$，$x \\equiv b \\pmod{n}$ 有解，当且仅当 $\\gcd(m, n)$ 整除 $b - a$。否则两个条件模这个最大公约数不一致，没有数能同时满足。对 $x \\equiv 3 \\pmod{6}$ 和 $x \\equiv 5 \\pmod{8}$，最大公约数 2 整除 $5 - 3 = 2$，所以有解；而 $x \\equiv 3 \\pmod{6}$ 和 $x \\equiv 4 \\pmod{8}$ 要求 $x$ 同时是奇数和偶数。\n\n检验：$21 = 3 \\cdot 6 + 3 = 2 \\cdot 8 + 5$ 是第一个方程组的解。\n\n> **注意。** 检验用的是模的最大公约数，不是它们的乘积。是否有解与 $x$ 的大小无关，而有解的方程组有无穷多个整数解。",
      ],
      (rng) => {
        const g = rng.int(2, 9);
        const [u, v] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9], 2) as [number, number];
        const m = g * u;
        const n = g * v;
        const a = rng.int(0, m - 1);
        const ok = rng.bool();
        const b0 = ok ? a + g * rng.int(0, 5) : a + g * rng.int(0, 5) + rng.int(1, g - 1);
        const b = b0 % n;
        const d = gcdOf(m, n);
        const consistent = (((b - a) % d) + d) % d === 0;
        const l = (m * n) / d;
        let x = 0;
        while (consistent && (x % m !== a || x % n !== b)) x += 1;
        const yes: Pair = ["It has solutions", "它有解"];
        const no: Pair = ["It has no solution", "它无解"];
        const slips: Slip[] = [
          consistent
            ? [
                no,
                `Here $${d}$ divides $${b} - ${a} = ${b - a}$, so the two conditions agree modulo ${d} and can be met together.`,
                `这里 $${d}$ 整除 $${b} - ${a} = ${b - a}$，所以两个条件模 ${d} 一致，可以同时满足。`,
              ]
            : [
                yes,
                `The first condition forces $x \\equiv ${a % d}$ and the second $x \\equiv ${b % d} \\pmod{${d}}$, and these disagree.`,
                `第一个条件迫使 $x \\equiv ${a % d}$，第二个迫使 $x \\equiv ${b % d} \\pmod{${d}}$，两者矛盾。`,
              ],
          [
            ["It has exactly one whole number solution", "它恰有一个整数解"],
            consistent
              ? `Solutions repeat every $\\operatorname{lcm}(${m}, ${n}) = ${l}$ integers, so there are infinitely many.`
              : "No integer meets both conditions, so there is not even one solution.",
            consistent
              ? `解每隔 $\\operatorname{lcm}(${m}, ${n}) = ${l}$ 个整数重复一次，所以有无穷多个。`
              : "没有整数同时满足两个条件，所以连一个解也没有。",
          ],
          [
            ["It depends on the size of $x$", "这取决于 $x$ 的大小"],
            "Whether solutions exist depends only on the moduli and the remainders, through the gcd.",
            "是否有解只取决于模和余数，通过最大公约数判断。",
          ],
        ];
        return chosen(
          rng,
          [
            `Does the system $x \\equiv ${a} \\pmod{${m}}$, $x \\equiv ${b} \\pmod{${n}}$ have a solution?`,
            `方程组 $x \\equiv ${a} \\pmod{${m}}$，$x \\equiv ${b} \\pmod{${n}}$ 有解吗？`,
          ],
          consistent ? yes : no,
          slips,
          [
            [
              ["The gcd of the moduli", "模的最大公约数"],
              [`$\\gcd(${m}, ${n}) = ${d}$.`, `$\\gcd(${m}, ${n}) = ${d}$。`],
            ],
            [
              [`Compare modulo ${d}`, `模 ${d} 比较`],
              [
                `$${a} \\equiv ${a % d}$ and $${b} \\equiv ${b % d} \\pmod{${d}}$, so $${b} - ${a}$ is ${consistent ? "" : "not "}a multiple of ${d}.`,
                `$${a} \\equiv ${a % d}$，$${b} \\equiv ${b % d} \\pmod{${d}}$，所以 $${b} - ${a}$ ${consistent ? "是" : "不是"} ${d} 的倍数。`,
              ],
            ],
          ],
          consistent
            ? [
                `$x = ${x}$ works: $${x} = ${Math.floor(x / m)} \\cdot ${m} + ${a} = ${Math.floor(x / n)} \\cdot ${n} + ${b}$.`,
                `$x = ${x}$ 满足：$${x} = ${Math.floor(x / m)} \\cdot ${m} + ${a} = ${Math.floor(x / n)} \\cdot ${n} + ${b}$。`,
              ]
            : [
                `Every solution of the first condition leaves ${a % d} on division by ${d}, and every solution of the second leaves ${b % d}, so none can be both.`,
                `第一个条件的每个解除以 ${d} 余 ${a % d}，第二个条件的每个解余 ${b % d}，所以不可能同时满足。`,
              ],
        );
      },
    ),
    point(
      "the-modulus-of-the-solution",
      ["The modulus of the solution", "解的模"],
      [
        "When a solution exists, it is unique modulo the lcm of the moduli, not modulo their product. So the number of solutions in a range can be counted from that lcm. For the moduli 6 and 8 the lcm is 24, so a run of 72 consecutive integers holds $\\frac{72}{24} = 3$ solutions.\n\nCheck: $x \\equiv 3 \\pmod{6}$, $x \\equiv 5 \\pmod{8}$ has the solutions $21, 45, 69$ among $0, 1, \\ldots, 71$.\n\n> **Watch out.** Two solutions differ by a common multiple of both moduli, and the smallest one is the lcm, here 24, not $6 \\cdot 8 = 48$.",
        "解存在时，它在模各模数的最小公倍数下唯一，而不是模它们的乘积。所以范围内解的个数可以由最小公倍数算出。模 6 和 8 的最小公倍数是 24，所以连续 72 个整数中有 $\\frac{72}{24} = 3$ 个解。\n\n检验：$x \\equiv 3 \\pmod{6}$，$x \\equiv 5 \\pmod{8}$ 在 $0, 1, \\ldots, 71$ 中的解是 $21, 45, 69$。\n\n> **注意。** 两个解相差两个模的公倍数，最小的是最小公倍数，这里是 24，不是 $6 \\cdot 8 = 48$。",
      ],
      (rng) =>
        until(() => {
          const g = rng.int(2, 12);
          const x = rng.int(2, 15);
          let y = rng.int(2, 15);
          if (gcdOf(x, y) !== 1) y = x + 1;
          const lcm = g * x * y;
          const k = rng.int(2, 9);
          const [m, n] = [g * x, g * y];
          return worked(
            [
              `A consistent system has the moduli ${m} and ${n}. How many solutions does it have in a run of ${k * lcm} consecutive integers?`,
              `一个相容的方程组的模是 ${m} 和 ${n}。它在连续 ${k * lcm} 个整数中有多少个解？`,
            ],
            k,
            [
              [
                Q.of(k, g),
                `That uses the product ${m * n} as the period; solutions repeat every lcm, ${lcm}.`,
                `那把乘积 ${m * n} 当成了周期；解每隔最小公倍数 ${lcm} 重复一次。`,
              ],
              [
                k * Math.min(x, y),
                `That uses the larger modulus ${Math.max(m, n)} as the period; the period is the lcm.`,
                `那把较大的模 ${Math.max(m, n)} 当成了周期；周期是最小公倍数。`,
              ],
              [
                k + 1,
                "That counts both ends; a run of whole periods holds exactly one solution per period.",
                "那把两端都算了；整数个周期的一段中每个周期恰有一个解。",
              ],
            ],
            [
              [
                ["The lcm of the moduli", "模的最小公倍数"],
                [
                  `$\\gcd(${m}, ${n}) = ${g}$, so $\\operatorname{lcm}(${m}, ${n}) = \\frac{${m} \\cdot ${n}}{${g}} = ${lcm}$.`,
                  `$\\gcd(${m}, ${n}) = ${g}$，所以 $\\operatorname{lcm}(${m}, ${n}) = \\frac{${m} \\cdot ${n}}{${g}} = ${lcm}$。`,
                ],
              ],
              [
                ["Count the periods", "数周期"],
                [
                  `There is one solution in every ${lcm} consecutive integers, so $\\frac{${k * lcm}}{${lcm}} = ${k}$.`,
                  `每连续 ${lcm} 个整数中有一个解，所以 $\\frac{${k * lcm}}{${lcm}} = ${k}$。`,
                ],
              ],
            ],
            [
              `$${lcm} = ${m} \\cdot ${y} = ${n} \\cdot ${x}$ is a multiple of both moduli, and since $\\gcd(${x}, ${y}) = 1$, no smaller positive number is.`,
              `$${lcm} = ${m} \\cdot ${y} = ${n} \\cdot ${x}$ 是两个模的公倍数，而因为 $\\gcd(${x}, ${y}) = 1$，没有更小的正数是。`,
            ],
          );
        }),
    ),
    point(
      "solving-the-system",
      ["Solving the system", "解方程组"],
      [
        "Write $x = a + mk$ and substitute into the second condition. After dividing through by the gcd, this is an ordinary linear congruence in $k$, and solving it gives the smallest solution. For $x \\equiv 3 \\pmod{6}$, $x \\equiv 5 \\pmod{8}$: $3 + 6k \\equiv 5$ gives $6k \\equiv 2 \\pmod{8}$, so $3k \\equiv 1 \\pmod{4}$, $k \\equiv 3$, and $x = 3 + 18 = 21$.\n\nCheck: $21 = 3 \\cdot 6 + 3$ and $21 = 2 \\cdot 8 + 5$.\n\n> **Watch out.** Dividing by the gcd divides the modulus too: $6k \\equiv 2 \\pmod{8}$ becomes $3k \\equiv 1 \\pmod{4}$. One of the two remainders alone is not a solution.",
        "写 $x = a + mk$，代入第二个条件。两边除以最大公约数后，它是关于 $k$ 的普通线性同余式，解它就得到最小的解。对 $x \\equiv 3 \\pmod{6}$，$x \\equiv 5 \\pmod{8}$：由 $3 + 6k \\equiv 5$ 得 $6k \\equiv 2 \\pmod{8}$，所以 $3k \\equiv 1 \\pmod{4}$，$k \\equiv 3$，$x = 3 + 18 = 21$。\n\n检验：$21 = 3 \\cdot 6 + 3$，$21 = 2 \\cdot 8 + 5$。\n\n> **注意。** 除以最大公约数时模也要除：$6k \\equiv 2 \\pmod{8}$ 变成 $3k \\equiv 1 \\pmod{4}$。只取两个余数中的一个不是解。",
      ],
      (rng) =>
        until(() => {
          const g = rng.int(2, 6);
          const [u, v] = rng.sample([2, 3, 5, 7, 11], 2) as [number, number];
          const m = g * u;
          const n = g * v;
          const lcm = (m * n) / gcdOf(m, n);
          const x = rng.int(Math.max(m, n), lcm - 1);
          const [r, s] = [x % m, x % n];
          const k = Math.floor(x / m);
          const rhs = (((s - r) % n) + n) % n;
          const reduced = (((rhs / g) % v) + v) % v;
          return worked(
            [
              `Find the smallest nonnegative solution of $x \\equiv ${r} \\pmod{${m}}$, $x \\equiv ${s} \\pmod{${n}}$.`,
              `求 $x \\equiv ${r} \\pmod{${m}}$，$x \\equiv ${s} \\pmod{${n}}$ 的最小非负解。`,
            ],
            x,
            [
              [x + lcm, `That is a solution, but ${lcm} more than the smallest.`, `那是一个解，但比最小的解大 ${lcm}。`],
              [r, `That keeps the first remainder, which fails the second condition.`, `那保留了第一个余数，它不满足第二个条件。`],
              [s, `That keeps the second remainder, which fails the first condition.`, `那保留了第二个余数，它不满足第一个条件。`],
            ],
            [
              [
                ["Substitute", "代入"],
                [
                  `$x = ${r} + ${m}k$, and the second condition becomes $${m}k \\equiv ${rhs} \\pmod{${n}}$.`,
                  `$x = ${r} + ${m}k$，第二个条件变成 $${m}k \\equiv ${rhs} \\pmod{${n}}$。`,
                ],
              ],
              [
                [`Divide by ${g}`, `除以 ${g}`],
                [
                  `$\\gcd(${m}, ${n}) = ${g}$, so $${u}k \\equiv ${reduced} \\pmod{${v}}$, which gives $k \\equiv ${k} \\pmod{${v}}$.`,
                  `$\\gcd(${m}, ${n}) = ${g}$，所以 $${u}k \\equiv ${reduced} \\pmod{${v}}$，得 $k \\equiv ${k} \\pmod{${v}}$。`,
                ],
              ],
              [
                ["Find $x$", "求 $x$"],
                [
                  `$x = ${r} + ${m} \\cdot ${k} = ${x}$, and solutions repeat every ${lcm}.`,
                  `$x = ${r} + ${m} \\cdot ${k} = ${x}$，解每隔 ${lcm} 重复一次。`,
                ],
              ],
            ],
            [
              `$${x} = ${k} \\cdot ${m} + ${r}$ and $${x} = ${Math.floor(x / n)} \\cdot ${n} + ${s}$.`,
              `$${x} = ${k} \\cdot ${m} + ${r}$，$${x} = ${Math.floor(x / n)} \\cdot ${n} + ${s}$。`,
            ],
          );
        }),
    ),
  ],
);

const millerRabin = topic(
  "the-miller-rabin-test",
  ["The Miller-Rabin Test", "米勒-拉宾检验"],
  ["Use square roots of 1 to expose composite numbers, even Carmichael numbers.", "利用 1 的平方根揭露合数，甚至卡迈克尔数。"],
  ["pseudoprimes-and-carmichael-numbers", "quadratic-congruences-modulo-composites"],
  [],
  [
    point(
      "splitting-off-powers-of-two",
      ["Splitting off powers of two", "分离二的幂"],
      [
        "The test writes $n - 1 = 2^{s} d$ with $d$ odd. It computes $a^{d}$ modulo $n$ and squares repeatedly, looking at the chain of values leading up to $a^{n - 1}$. For $n = 97$, halving $96$ gives $48, 24, 12, 6, 3$, five halvings, so $s = 5$ and $d = 3$.\n\nCheck: $2^{5} \\cdot 3 = 96$, and 3 is odd.\n\n> **Watch out.** Split $n - 1$, not $n$, which is odd. Keep halving until the result is odd; stopping early leaves $d$ even.",
        "这个检验写 $n - 1 = 2^{s} d$，其中 $d$ 是奇数。它计算 $a^{d}$ 模 $n$ 再反复平方，观察通向 $a^{n - 1}$ 的一串值。对 $n = 97$，把 $96$ 减半得 $48, 24, 12, 6, 3$，共减半五次，所以 $s = 5$，$d = 3$。\n\n检验：$2^{5} \\cdot 3 = 96$，而 3 是奇数。\n\n> **注意。** 要拆的是 $n - 1$，不是本身为奇数的 $n$。要一直减半到结果为奇数；提前停下会让 $d$ 仍是偶数。",
      ],
      (rng) =>
        until(() => {
          const s = rng.int(1, 8);
          const d = 2 * rng.int(1, 60) + 1;
          const n = 2 ** s * d + 1;
          const askS = rng.bool();
          const chain = Array.from({ length: s + 1 }, (_, i) => (n - 1) / 2 ** i);
          const misses: Miss[] = askS
            ? [
                [0, `That works with ${n}, which is already odd, instead of ${n - 1}.`, `那用的是本身已是奇数的 ${n}，而不是 ${n - 1}。`],
                [s - 1, "That stops one halving early, which leaves $d$ even.", "那少减半了一次，$d$ 仍是偶数。"],
                [d, "That gives $d$, the odd part, instead of the number of halvings.", "那给出了奇数部分 $d$，而不是减半的次数。"],
              ]
            : [
                [n - 1, "That leaves $n - 1$ unhalved.", "那没有把 $n - 1$ 减半。"],
                [2 * d, "That stops one halving early; the result is still even.", "那少减半了一次；结果仍是偶数。"],
                [n, `That works with ${n} itself, which is odd, instead of ${n - 1}.`, `那用的是本身为奇数的 ${n}，而不是 ${n - 1}。`],
              ];
          return worked(
            [
              `For $n = ${n}$, write $n - 1 = 2^{s} d$ with $d$ odd. What is ${askS ? "$s$" : "$d$"}?`,
              `对 $n = ${n}$，写 $n - 1 = 2^{s} d$，其中 $d$ 是奇数。${askS ? "$s$" : "$d$"} 是多少？`,
            ],
            askS ? s : d,
            misses,
            [
              [
                ["Start from $n - 1$", "从 $n - 1$ 开始"],
                [`$n - 1 = ${n - 1}$.`, `$n - 1 = ${n - 1}$。`],
              ],
              [
                ["Halve until odd", "减半到奇数"],
                [
                  `$${chain.join(", ")}$: ${s} halvings end at the odd number ${d}.`,
                  `$${chain.join(", ")}$：减半 ${s} 次后得到奇数 ${d}。`,
                ],
              ],
              [
                ["Read $s$ and $d$", "读出 $s$ 和 $d$"],
                [`$s = ${s}$ and $d = ${d}$.`, `$s = ${s}$，$d = ${d}$。`],
              ],
            ],
            [
              `$${pw(2, s)} \\cdot ${d} = ${2 ** s} \\cdot ${d} = ${n - 1}$, and ${d} is odd.`,
              `$${pw(2, s)} \\cdot ${d} = ${2 ** s} \\cdot ${d} = ${n - 1}$，而 ${d} 是奇数。`,
            ],
          );
        }),
    ),
    point(
      "the-first-term-of-the-chain",
      ["The first term of the chain", "链的第一项"],
      [
        "The number $n$ passes for the base $a$ when the chain starts at 1, or when $-1$ appears somewhere in the chain before the last term. In any other case, $a$ is a witness that $n$ is composite. For $n = 561 = 2^{4} \\cdot 35 + 1$ and $a = 2$, the chain is $2^{35} \\equiv 263$, then $166, 67, 1, 1$. It never shows $-1 \\equiv 560$, so 2 is a witness, although 561 fools the Fermat test.\n\nCheck: $2^{35} = 2^{17} \\cdot 2^{18} \\equiv 359 \\cdot 157 \\equiv 263 \\pmod{561}$.\n\n> **Watch out.** The first term is $a^{d}$, not $a^{n - 1}$, which is the last term and the whole Fermat test. A power is not a product: $a \\cdot d$ is something else.",
        "当链从 1 开始，或者 $-1$ 出现在最后一项之前的某处时，$n$ 对底数 $a$ 通过检验。其他情况下 $a$ 是 $n$ 为合数的证据。对 $n = 561 = 2^{4} \\cdot 35 + 1$，$a = 2$，链是 $2^{35} \\equiv 263$，然后 $166, 67, 1, 1$。它从未出现 $-1 \\equiv 560$，所以 2 是证据，尽管 561 能骗过费马检验。\n\n检验：$2^{35} = 2^{17} \\cdot 2^{18} \\equiv 359 \\cdot 157 \\equiv 263 \\pmod{561}$。\n\n> **注意。** 第一项是 $a^{d}$，不是作为最后一项、也就是整个费马检验的 $a^{n - 1}$。幂不是乘积：$a \\cdot d$ 是另一回事。",
      ],
      (rng) =>
        until(() => {
          const n = rng.pick([
            91, 121, 133, 145, 169, 187, 209, 217, 221, 247, 259, 289, 301, 319, 341, 361, 391, 403, 451, 481, 533, 561, 589, 645, 703, 781,
            793, 1105, 1729, 2047,
          ]);
          const a = rng.pick([2, 3, 5, 7]);
          let d = n - 1;
          let s = 0;
          while (d % 2 === 0) {
            d /= 2;
            s += 1;
          }
          const v = powMod(a, d, n);
          const chain = Array.from({ length: s + 1 }, (_, i) => powMod(a, d * 2 ** i, n));
          return worked(
            [
              `For $n = ${n}$, we have $n - 1 = ${pw(2, s)} \\cdot ${d}$. What is the first term $${a}^{${d}}$ modulo ${n} of the chain?`,
              `对 $n = ${n}$，有 $n - 1 = ${pw(2, s)} \\cdot ${d}$。链的第一项 $${a}^{${d}}$ 模 ${n} 是多少？`,
            ],
            v,
            [
              [(v * v) % n, "That squares once too often; it is the second term of the chain.", "那多平方了一次；那是链的第二项。"],
              [(a * d) % n, "That multiplies the base by the exponent; the term is a power.", "那是把底数乘以指数；这一项是幂。"],
              [
                powMod(a, n - 1, n),
                `That is $${a}^{${n - 1}}$, the last term of the chain, which the Fermat test looks at.`,
                `那是链的最后一项 $${a}^{${n - 1}}$，也就是费马检验看的那一项。`,
              ],
            ],
            [
              [
                ["Compute the power", "计算幂"],
                [`By repeated squaring, $${a}^{${d}} \\equiv ${v} \\pmod{${n}}$.`, `用反复平方，$${a}^{${d}} \\equiv ${v} \\pmod{${n}}$。`],
              ],
              [
                ["Place it in the chain", "放进链里"],
                [
                  `The whole chain is $${chain.join(", ")}$, from $${a}^{${d}}$ up to $${a}^{${n - 1}}$.`,
                  `整条链是 $${chain.join(", ")}$，从 $${a}^{${d}}$ 到 $${a}^{${n - 1}}$。`,
                ],
              ],
            ],
            halves(a, d, n),
          );
        }),
    ),
    point(
      "a-square-root-exposes-a-factor",
      ["A square root exposes a factor", "平方根揭露因数"],
      [
        "If the chain reaches 1 from a value $v$ other than $\\pm 1$, then $v$ is a nontrivial square root of 1. Since $n$ divides $(v - 1)(v + 1)$ but neither factor alone, $\\gcd(v - 1, n)$ is a proper factor. Modulo 21, $8^{2} = 64 = 3 \\cdot 21 + 1$, and $\\gcd(7, 21) = 7$.\n\nCheck: $\\gcd(9, 21) = 3$ gives the other factor, and $3 \\cdot 7 = 21$.\n\n> **Watch out.** The factor is the gcd, not $v - 1$ itself, which usually does not divide $n$. The gcd of $v + 1$ and $n$ gives the complementary factor.",
        "如果链从不是 $\\pm 1$ 的值 $v$ 到达 1，那么 $v$ 是 1 的非平凡平方根。因为 $n$ 整除 $(v - 1)(v + 1)$ 但不单独整除任何一个因子，$\\gcd(v - 1, n)$ 是真因数。模 21 时，$8^{2} = 64 = 3 \\cdot 21 + 1$，而 $\\gcd(7, 21) = 7$。\n\n检验：$\\gcd(9, 21) = 3$ 给出另一个因数，而 $3 \\cdot 7 = 21$。\n\n> **注意。** 因数是最大公约数，不是 $v - 1$ 本身，后者通常不整除 $n$。$v + 1$ 与 $n$ 的最大公约数给出互补的因数。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = rng.sample(
            oddPrimes.filter((v) => v >= 5 && v <= 53),
            2,
          ) as [number, number];
          const n = p * q;
          let v = 1;
          for (let t = 2; t < n - 1; t++) {
            if ((t * t) % n === 1) {
              v = t;
              break;
            }
          }
          const g = gcdOf(v - 1, n);
          return worked(
            [
              `Modulo ${n}, the value ${v} squares to 1. What is $\\gcd(${v} - 1, ${n})$?`,
              `模 ${n} 时，${v} 的平方是 1。$\\gcd(${v} - 1, ${n})$ 是多少？`,
            ],
            g,
            [
              [n / g, `That is $\\gcd(${v} + 1, ${n})$, the other factor.`, `那是 $\\gcd(${v} + 1, ${n})$，另一个因数。`],
              [v - 1, `That is ${v - 1} itself, which does not divide ${n}.`, `那是 ${v - 1} 本身，它不整除 ${n}。`],
              [
                1,
                `That treats ${v - 1} and ${n} as coprime; but ${n} divides $(${v} - 1)(${v} + 1)$ and not ${v} + 1, so they share a factor.`,
                `那把 ${v - 1} 和 ${n} 当成了互质；但 ${n} 整除 $(${v} - 1)(${v} + 1)$ 而不整除 ${v} + 1，所以它们有公因数。`,
              ],
            ],
            [
              [
                ["Use the square root", "利用平方根"],
                [
                  `$(${v} - 1)(${v} + 1) = ${v}^{2} - 1 = ${v * v - 1} = ${(v * v - 1) / n} \\cdot ${n}$.`,
                  `$(${v} - 1)(${v} + 1) = ${v}^{2} - 1 = ${v * v - 1} = ${(v * v - 1) / n} \\cdot ${n}$。`,
                ],
              ],
              [
                ["Run the Euclidean algorithm", "用欧几里得算法"],
                [`$${euclid(n, v - 1)}$, so the gcd is ${g}.`, `$${euclid(n, v - 1)}$，所以最大公约数是 ${g}。`],
              ],
            ],
            [
              `$\\gcd(${v + 1}, ${n}) = ${n / g}$, and $${g} \\cdot ${n / g} = ${n}$.`,
              `$\\gcd(${v + 1}, ${n}) = ${n / g}$，而 $${g} \\cdot ${n / g} = ${n}$。`,
            ],
          );
        }),
    ),
  ],
);

const mobiusInversion = topic(
  "mobius-inversion",
  ["Möbius Inversion", "莫比乌斯反演"],
  ["Recover a function from its divisor sums.", "由除数和恢复函数。"],
  ["dirichlet-convolution"],
  [],
  [
    point(
      "recovering-a-value",
      ["Recovering a value", "恢复一个值"],
      [
        "If $F(n)$ is the sum of $f(d)$ over the divisors $d$ of $n$, then $f(n)$ is the sum of $\\mu(d)F\\left(\\frac{n}{d}\\right)$. For $n = pq$ with distinct primes, this is $F(pq) - F(p) - F(q) + F(1)$. With $F(1) = 1$, $F(2) = 4$, $F(3) = 5$ and $F(6) = 14$: $f(6) = 14 - 4 - 5 + 1 = 6$.\n\nCheck: $f(1) = 1$, $f(2) = 4 - 1 = 3$, $f(3) = 5 - 1 = 4$, and $1 + 3 + 4 + 6 = 14 = F(6)$.\n\n> **Watch out.** $\\mu(pq) = +1$, so $F(1)$ is added back, not subtracted: $F(p)$ and $F(q)$ both contain $f(1)$.",
        "如果 $F(n)$ 是 $f(d)$ 对 $n$ 的除数 $d$ 求和，那么 $f(n)$ 是 $\\mu(d)F\\left(\\frac{n}{d}\\right)$ 的和。对不同质数之积 $n = pq$，它是 $F(pq) - F(p) - F(q) + F(1)$。已知 $F(1) = 1$，$F(2) = 4$，$F(3) = 5$，$F(6) = 14$：$f(6) = 14 - 4 - 5 + 1 = 6$。\n\n检验：$f(1) = 1$，$f(2) = 4 - 1 = 3$，$f(3) = 5 - 1 = 4$，而 $1 + 3 + 4 + 6 = 14 = F(6)$。\n\n> **注意。** $\\mu(pq) = +1$，所以 $F(1)$ 要加回来，而不是减去：$F(p)$ 和 $F(q)$ 都含有 $f(1)$。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = (rng.sample([2, 3, 5, 7, 11, 13], 2) as [number, number]).sort((x, y) => x - y);
          const [a, b, c, d] = [rng.int(1, 9), rng.int(10, 40), rng.int(10, 40), rng.int(80, 200)];
          const f = d - b - c + a;
          return worked(
            [
              `Let $F(n) = \\sum_{d \\mid n} f(d)$. Given $F(1) = ${a}$, $F(${p}) = ${b}$, $F(${q}) = ${c}$ and $F(${p * q}) = ${d}$, what is $f(${p * q})$?`,
              `设 $F(n) = \\sum_{d \\mid n} f(d)$。已知 $F(1) = ${a}$，$F(${p}) = ${b}$，$F(${q}) = ${c}$，$F(${p * q}) = ${d}$，$f(${p * q})$ 是多少？`,
            ],
            f,
            [
              [
                d - b - c - a,
                `That subtracts $F(1)$; since $\\mu(${p * q}) = 1$, it is added.`,
                `那减去了 $F(1)$；因为 $\\mu(${p * q}) = 1$，它要加上。`,
              ],
              [d - b - c, "That leaves out the term $F(1)$.", "那漏掉了 $F(1)$ 这一项。"],
              [
                d - a,
                `That subtracts only $F(1)$, as if ${p * q} had no other divisors.`,
                `那只减去了 $F(1)$，好像 ${p * q} 没有别的除数。`,
              ],
            ],
            [
              [
                ["The Möbius values", "莫比乌斯函数值"],
                [
                  `The divisors of ${p * q} are $1, ${p}, ${q}, ${p * q}$, with $\\mu = 1, -1, -1, 1$.`,
                  `${p * q} 的除数是 $1, ${p}, ${q}, ${p * q}$，对应 $\\mu = 1, -1, -1, 1$。`,
                ],
              ],
              [
                ["Invert", "反演"],
                [
                  `$f(${p * q}) = F(${p * q}) - F(${q}) - F(${p}) + F(1) = ${d} - ${c} - ${b} + ${a} = ${f}$.`,
                  `$f(${p * q}) = F(${p * q}) - F(${q}) - F(${p}) + F(1) = ${d} - ${c} - ${b} + ${a} = ${f}$。`,
                ],
              ],
            ],
            [
              `$f(1) = ${a}$, $f(${p}) = ${b} - ${a} = ${b - a}$, $f(${q}) = ${c} - ${a} = ${c - a}$, and $${a} + ${b - a} + ${c - a} + ${f < 0 ? `(${f})` : f} = ${d} = F(${p * q})$.`,
              `$f(1) = ${a}$，$f(${p}) = ${b} - ${a} = ${b - a}$，$f(${q}) = ${c} - ${a} = ${c - a}$，而 $${a} + ${b - a} + ${c - a} + ${f < 0 ? `(${f})` : f} = ${d} = F(${p * q})$。`,
            ],
          );
        }),
    ),
    point(
      "the-totient-from-inversion",
      ["The totient from inversion", "由反演得欧拉函数"],
      [
        "Since the totients of the divisors of $n$ add up to $n$, inversion gives $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$. Only squarefree divisors matter here, because $\\mu$ vanishes on the others. For $n = 12$ the squarefree divisors are $1, 2, 3, 6$, so $\\varphi(12) = 12 - 6 - 4 + 2 = 4$.\n\nCheck: the numbers up to 12 coprime to 12 are $1, 5, 7, 11$, four of them.\n\n> **Watch out.** The sign of $\\mu(d)$ follows the number of primes in $d$: minus for one prime, plus for two. Divisors such as 4, with a square factor, contribute nothing.",
        "因为 $n$ 的各除数的欧拉函数之和是 $n$，反演给出 $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$。这里只有无平方因子的除数起作用，因为 $\\mu$ 在其他除数上为零。对 $n = 12$，无平方因子的除数是 $1, 2, 3, 6$，所以 $\\varphi(12) = 12 - 6 - 4 + 2 = 4$。\n\n检验：不超过 12 且与 12 互质的数是 $1, 5, 7, 11$，共四个。\n\n> **注意。** $\\mu(d)$ 的符号取决于 $d$ 中质数的个数：一个质数为负，两个为正。像 4 这样含平方因子的除数不起作用。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(12, 400);
          const free = divisors(n).filter((d) => mobius(d) !== 0);
          const signed = free.map((d) => (mobius(d) * n) / d);
          const sum = signed.map((v, i) => (i === 0 ? `${v}` : v < 0 ? ` - ${-v}` : ` + ${v}`)).join("");
          const phi = totient(n);
          const primes = factorize(n).map(([p]) => p);
          return worked(
            [
              `Use $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$ to compute $\\varphi(${n})$.`,
              `用 $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$ 计算 $\\varphi(${n})$。`,
            ],
            phi,
            [
              [n - 1, `That is the count for a prime; ${n} is not prime.`, `那是质数的情形；${n} 不是质数。`],
              [
                signed.reduce((x, y) => x + Math.abs(y), 0),
                "That adds every term and forgets the signs $\\mu(d)$.",
                "那把每一项都加上了，忘了符号 $\\mu(d)$。",
              ],
              [divisors(n).length, "That counts the divisors of $n$ instead.", "那数的是 $n$ 的除数个数。"],
            ],
            [
              [
                ["The squarefree divisors", "无平方因子的除数"],
                [
                  `$${n} = ${factorizationLatex(factorize(n))}$, so the squarefree divisors are $${free.join(", ")}$.`,
                  `$${n} = ${factorizationLatex(factorize(n))}$，所以无平方因子的除数是 $${free.join(", ")}$。`,
                ],
              ],
              [
                ["Add with signs", "带符号相加"],
                [`$\\varphi(${n}) = ${sum} = ${phi}$.`, `$\\varphi(${n}) = ${sum} = ${phi}$。`],
              ],
            ],
            [
              `The product formula gives $${n} \\cdot ${primes.map((p) => `\\frac{${p - 1}}{${p}}`).join(" \\cdot ")} = ${phi}$.`,
              `乘积公式给出 $${n} \\cdot ${primes.map((p) => `\\frac{${p - 1}}{${p}}`).join(" \\cdot ")} = ${phi}$。`,
            ],
          );
        }),
    ),
    point(
      "counting-irreducible-strings",
      ["Counting primitive strings", "计算本原串"],
      [
        "A string is primitive when it is not a repetition of a shorter string. The strings of length $n$ over $k$ letters are each a repetition of a unique primitive string of some length dividing $n$. So inversion counts the primitive strings: $\\sum_{d \\mid n} \\mu(d) k^{n/d}$. For $n = 4$ and $k = 2$ this is $2^{4} - 2^{2} = 12$.\n\nCheck: there are 2 primitive strings of length 1 and $2^{2} - 2 = 2$ of length 2, and $2 + 2 + 12 = 16 = 2^{4}$, all the strings of length 4.\n\n> **Watch out.** Subtracting only the $k$ constant strings is right when $n$ is prime, but not in general. Dividing by $n$ counts necklaces, a different question.",
        "一个串如果不是更短的串的重复，就称为本原串。长度为 $n$、字母表有 $k$ 个字母的每个串，都是某个长度整除 $n$ 的唯一本原串的重复。所以反演给出本原串的个数：$\\sum_{d \\mid n} \\mu(d) k^{n/d}$。对 $n = 4$，$k = 2$，这是 $2^{4} - 2^{2} = 12$。\n\n检验：长度为 1 的本原串有 2 个，长度为 2 的有 $2^{2} - 2 = 2$ 个，而 $2 + 2 + 12 = 16 = 2^{4}$，正是长度为 4 的全部串。\n\n> **注意。** 只减去 $k$ 个常数串在 $n$ 是质数时是对的，一般情况下不对。除以 $n$ 数的是项链，是另一个问题。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 5);
          const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
          const prim = (m: number) => divisors(m).reduce((sum, d) => sum + mobius(d) * k ** (m / d), 0);
          const total = prim(n);
          const terms = divisors(n)
            .filter((d) => mobius(d) !== 0)
            .map((d, i) => `${i === 0 ? "" : mobius(d) < 0 ? " - " : " + "}${pw(k, n / d)}`)
            .join("");
          const parts = divisors(n).map((d) => prim(d));
          return worked(
            [`How many primitive strings of length ${n} are there over ${k} letters?`, `在 ${k} 个字母上，长度为 ${n} 的本原串有多少个？`],
            total,
            [
              [k ** n, "That counts all strings, including the repetitions of shorter ones.", "那数了所有串，包括较短串的重复。"],
              [
                k ** n - k,
                "That removes only the constant strings; repetitions of other shorter strings must go too.",
                "那只去掉了常数串；其他较短串的重复也要去掉。",
              ],
              [
                Q.of(total, n),
                "That divides by $n$, which counts necklaces up to rotation instead.",
                "那除以了 $n$，数的是旋转意义下的项链。",
              ],
            ],
            [
              [
                ["The divisors and their Möbius values", "除数及其莫比乌斯函数值"],
                [
                  `The divisors of ${n} with $\\mu(d) \\ne 0$ are $${divisors(n)
                    .filter((d) => mobius(d) !== 0)
                    .join(", ")}$.`,
                  `${n} 的除数中 $\\mu(d) \\ne 0$ 的是 $${divisors(n)
                    .filter((d) => mobius(d) !== 0)
                    .join(", ")}$。`,
                ],
              ],
              [
                ["Add with signs", "带符号相加"],
                [`$${terms} = ${total}$.`, `$${terms} = ${total}$。`],
              ],
            ],
            [
              `Each string is a repetition of a primitive string whose length divides ${n}. The primitive counts for the lengths $${divisors(n).join(", ")}$ are $${parts.join(", ")}$, and $${parts.join(" + ")} = ${k ** n} = ${k}^{${n}}$.`,
              `每个串都是某个长度整除 ${n} 的本原串的重复。长度为 $${divisors(n).join(", ")}$ 的本原串个数是 $${parts.join(", ")}$，而 $${parts.join(" + ")} = ${k ** n} = ${k}^{${n}}$。`,
            ],
          );
        }),
    ),
  ],
);

const averageOrder = topic(
  "averages-of-arithmetic-functions",
  ["Averages of Arithmetic Functions", "算术函数的平均值"],
  ["Sum arithmetic functions by swapping the order of counting.", "交换计数次序来对算术函数求和。"],
  ["multiplicative-functions"],
  [],
  [
    point(
      "summing-the-divisor-function",
      ["Summing the divisor function", "对除数函数求和"],
      [
        "To add up $\\tau(k)$ for $k$ up to $n$, count pairs $(d, k)$ with $d$ dividing $k$ the other way around. Each $d$ divides $\\left\\lfloor\\frac{n}{d}\\right\\rfloor$ numbers, so the sum equals $\\sum_{d} \\left\\lfloor\\frac{n}{d}\\right\\rfloor$. For $n = 6$: $6 + 3 + 2 + 1 + 1 + 1 = 14$.\n\nCheck: $\\tau(1), \\ldots, \\tau(6)$ are $1, 2, 2, 3, 2, 4$, which add to 14.\n\n> **Watch out.** The term $d = 1$ counts $n$ pairs, since 1 divides everything; do not leave it out. And $\\tau(n)$ alone is only the last term of the sum.",
        "要对 $k$ 不超过 $n$ 求 $\\tau(k)$ 的和，换一种方式数 $d$ 整除 $k$ 的对 $(d, k)$。每个 $d$ 整除 $\\left\\lfloor\\frac{n}{d}\\right\\rfloor$ 个数，所以和等于 $\\sum_{d} \\left\\lfloor\\frac{n}{d}\\right\\rfloor$。对 $n = 6$：$6 + 3 + 2 + 1 + 1 + 1 = 14$。\n\n检验：$\\tau(1), \\ldots, \\tau(6)$ 是 $1, 2, 2, 3, 2, 4$，加起来是 14。\n\n> **注意。** $d = 1$ 这一项数了 $n$ 对，因为 1 整除一切；不要漏掉它。而 $\\tau(n)$ 只是和的最后一项。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(6, 60);
          const floors = Array.from({ length: n }, (_, i) => Math.floor(n / (i + 1)));
          const sum = floors.reduce((x, y) => x + y, 0);
          const r = Math.floor(Math.sqrt(n));
          const low = floors.slice(0, r);
          const lowSum = low.reduce((x, y) => x + y, 0);
          return worked(
            [`What is $\\tau(1) + \\tau(2) + \\cdots + \\tau(${n})$?`, `$\\tau(1) + \\tau(2) + \\cdots + \\tau(${n})$ 是多少？`],
            sum,
            [
              [divisors(n).length, `That is $\\tau(${n})$ alone, the last term of the sum.`, `那只是 $\\tau(${n})$，和的最后一项。`],
              [
                lowSum,
                `That stops at $d = ${r}$, near $\\sqrt{${n}}$, without the other half of the count.`,
                `那停在了 $\\sqrt{${n}}$ 附近的 $d = ${r}$，漏掉了另一半。`,
              ],
              [sum - n, "That leaves out $d = 1$, which divides every number.", "那漏掉了 $d = 1$，它整除每个数。"],
            ],
            [
              [
                ["Swap the order of counting", "交换计数次序"],
                [
                  `Count each divisor $d$ once for each multiple of it up to ${n}: there are $\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ of them.`,
                  `每个除数 $d$ 对它不超过 ${n} 的每个倍数各数一次：共 $\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ 个。`,
                ],
              ],
              [
                ["Add the floors", "把取整值相加"],
                [`$${floors.join(" + ")} = ${sum}$.`, `$${floors.join(" + ")} = ${sum}$。`],
              ],
            ],
            [
              `Counting the pairs $de \\le ${n}$ on both sides of $\\sqrt{${n}}$ gives $2(${low.join(" + ")}) - ${r}^{2} = ${2 * lowSum} - ${r * r} = ${sum}$.`,
              `在 $\\sqrt{${n}}$ 两侧数满足 $de \\le ${n}$ 的对，得 $2(${low.join(" + ")}) - ${r}^{2} = ${2 * lowSum} - ${r * r} = ${sum}$。`,
            ],
          );
        }),
    ),
    point(
      "summing-the-sigma-function",
      ["Summing the sigma function", "对 sigma 函数求和"],
      [
        "The same swap handles $\\sigma$: each $d$ contributes itself once for every multiple up to $n$. So the sum of $\\sigma(k)$ for $k$ up to $n$ equals the sum of $d\\left\\lfloor\\frac{n}{d}\\right\\rfloor$. For $n = 4$: $1 \\cdot 4 + 2 \\cdot 2 + 3 \\cdot 1 + 4 \\cdot 1 = 15$.\n\nCheck: $\\sigma(1) + \\sigma(2) + \\sigma(3) + \\sigma(4) = 1 + 3 + 4 + 7 = 15$.\n\n> **Watch out.** Each divisor is added, not just counted; counting gives the sum of $\\tau$. The floor matters: without it every term would be $n$.",
        "同样的交换也适用于 $\\sigma$：每个 $d$ 对不超过 $n$ 的每个倍数贡献自身一次。所以 $k$ 不超过 $n$ 时 $\\sigma(k)$ 的和等于 $d\\left\\lfloor\\frac{n}{d}\\right\\rfloor$ 的和。对 $n = 4$：$1 \\cdot 4 + 2 \\cdot 2 + 3 \\cdot 1 + 4 \\cdot 1 = 15$。\n\n检验：$\\sigma(1) + \\sigma(2) + \\sigma(3) + \\sigma(4) = 1 + 3 + 4 + 7 = 15$。\n\n> **注意。** 每个除数要加上它自身，而不只是数一次；只数一次得到的是 $\\tau$ 的和。取整很重要：没有它，每一项都会是 $n$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(5, 50);
          let sum = 0;
          let tau = 0;
          for (let d = 1; d <= n; d++) {
            sum += d * Math.floor(n / d);
            tau += Math.floor(n / d);
          }
          const tri = Array.from({ length: n }, (_, i) => Math.floor(n / (i + 1))).map((q) => (q * (q + 1)) / 2);
          const shown = Array.from({ length: Math.min(n, 6) }, (_, i) => `${i + 1} \\cdot ${Math.floor(n / (i + 1))}`).join(" + ");
          return worked(
            [
              `What is $\\sigma(1) + \\sigma(2) + \\cdots + \\sigma(${n})$?`,
              `$\\sigma(1) + \\sigma(2) + \\cdots + \\sigma(${n})$ 是多少？`,
            ],
            sum,
            [
              [
                tau,
                "That counts each divisor once instead of adding it, which gives the sum of $\\tau$.",
                "那把每个除数只数了一次而没有加上它自身，得到的是 $\\tau$ 的和。",
              ],
              [
                divisors(n).reduce((x, y) => x + y, 0),
                `That is $\\sigma(${n})$ alone, the last term.`,
                `那只是 $\\sigma(${n})$，最后一项。`,
              ],
              [
                n * n,
                "That drops the floor, so every term $d \\cdot \\frac{n}{d}$ becomes $n$.",
                "那去掉了取整，于是每一项 $d \\cdot \\frac{n}{d}$ 都成了 $n$。",
              ],
            ],
            [
              [
                ["Swap the order of counting", "交换计数次序"],
                [
                  `Each $d$ is added once for each of its $\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ multiples up to ${n}.`,
                  `每个 $d$ 对它不超过 ${n} 的 $\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ 个倍数各加一次。`,
                ],
              ],
              [
                ["Add the terms", "把各项相加"],
                [`$${shown}${n > 6 ? " + \\cdots" : ""} = ${sum}$.`, `$${shown}${n > 6 ? " + \\cdots" : ""} = ${sum}$。`],
              ],
            ],
            [
              `Group by the cofactor $m$ instead: it pairs with every $d \\le \\frac{${n}}{m}$, and these add to a triangular number. So the sum is $${tri.join(" + ")} = ${sum}$.`,
              `改按余因子 $m$ 分组：它与每个 $d \\le \\frac{${n}}{m}$ 配对，这些 $d$ 之和是三角形数。所以和是 $${tri.join(" + ")} = ${sum}$。`,
            ],
          );
        }),
    ),
    point(
      "coprime-pairs",
      ["Coprime pairs", "互质对"],
      [
        "The number of pairs $(a, b)$ with $1 \\le a < b \\le n$ and $\\gcd(a, b) = 1$ is the sum of $\\varphi(b)$ for $b$ from 2 to $n$. As $n$ grows, the chance that two numbers are coprime tends to $\\frac{6}{\\pi^{2}}$. For $n = 5$: $\\varphi(2) + \\varphi(3) + \\varphi(4) + \\varphi(5) = 1 + 2 + 2 + 4 = 9$.\n\nCheck: of the 10 pairs from $1, \\ldots, 5$, only $(2, 4)$ shares a factor, so 9 are coprime.\n\n> **Watch out.** Start at $b = 2$: the pair $(1, 1)$ has $a = b$ and is not allowed. Not every pair is coprime, so $\\frac{n(n - 1)}{2}$ is too many.",
        "满足 $1 \\le a < b \\le n$ 和 $\\gcd(a, b) = 1$ 的对 $(a, b)$ 的个数，是 $b$ 从 2 到 $n$ 时 $\\varphi(b)$ 的和。当 $n$ 增大时，两个数互质的概率趋于 $\\frac{6}{\\pi^{2}}$。对 $n = 5$：$\\varphi(2) + \\varphi(3) + \\varphi(4) + \\varphi(5) = 1 + 2 + 2 + 4 = 9$。\n\n检验：从 $1, \\ldots, 5$ 中取的 10 对里，只有 $(2, 4)$ 有公因数，所以 9 对互质。\n\n> **注意。** 从 $b = 2$ 开始：对 $(1, 1)$ 中 $a = b$，不允许。并非每一对都互质，所以 $\\frac{n(n - 1)}{2}$ 太多了。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(5, 60);
          const phis = Array.from({ length: n - 1 }, (_, i) => totient(i + 2));
          const sum = phis.reduce((x, y) => x + y, 0);
          let ordered = 0;
          for (let d = 1; d <= n; d++) ordered += mobius(d) * Math.floor(n / d) ** 2;
          return worked(
            [
              `How many pairs $1 \\le a < b \\le ${n}$ have $\\gcd(a, b) = 1$?`,
              `有多少对 $1 \\le a < b \\le ${n}$ 满足 $\\gcd(a, b) = 1$？`,
            ],
            sum,
            [
              [(n * (n - 1)) / 2, "That counts every pair, coprime or not.", "那数了所有的对，不管是否互质。"],
              [sum + 1, "That also counts $(1, 1)$, where $a = b$.", "那还数了 $a = b$ 的 $(1, 1)$。"],
              [sum - totient(n), `That stops at $b = ${n - 1}$ and leaves out $b = ${n}$.`, `那停在了 $b = ${n - 1}$，漏掉了 $b = ${n}$。`],
            ],
            [
              [
                ["Fix the larger number", "固定较大的数"],
                [
                  "For each $b$, exactly $\\varphi(b)$ values of $a < b$ are coprime to $b$.",
                  "对每个 $b$，恰有 $\\varphi(b)$ 个 $a < b$ 与 $b$ 互质。",
                ],
              ],
              [
                ["Add the totients", "把欧拉函数值相加"],
                [
                  `$\\varphi(2) + \\cdots + \\varphi(${n}) = ${phis.join(" + ")} = ${sum}$.`,
                  `$\\varphi(2) + \\cdots + \\varphi(${n}) = ${phis.join(" + ")} = ${sum}$。`,
                ],
              ],
            ],
            [
              `Counting the ordered coprime pairs in $\\{1, \\ldots, ${n}\\}^{2}$ by inclusion and exclusion gives $\\sum_{d} \\mu(d) \\left\\lfloor\\frac{${n}}{d}\\right\\rfloor^{2} = ${ordered}$. Removing $(1, 1)$ and halving leaves $\\frac{${ordered} - 1}{2} = ${sum}$.`,
              `用容斥原理数 $\\{1, \\ldots, ${n}\\}^{2}$ 中有序的互质对，得 $\\sum_{d} \\mu(d) \\left\\lfloor\\frac{${n}}{d}\\right\\rfloor^{2} = ${ordered}$。去掉 $(1, 1)$ 再除以二，剩下 $\\frac{${ordered} - 1}{2} = ${sum}$。`,
            ],
          );
        }),
    ),
  ],
);

const primeSize = topic(
  "the-prime-number-theorem",
  ["The Prime Number Theorem", "素数定理"],
  ["Estimate how many primes there are up to a given size.", "估计不超过给定大小的质数有多少个。"],
  ["the-distribution-of-primes"],
  [],
  [
    point(
      "estimating-the-count",
      ["Estimating the count", "估计个数"],
      [
        "The prime number theorem says that $\\pi(x)$ is close to $\\frac{x}{\\ln x}$ for large $x$. Using the value $\\ln 10 \\approx 2.3$, we get quick estimates for the count of primes up to a power of ten. For $x = 10^{6}$, $\\ln x \\approx 6 \\cdot 2.3 = 13.8$, so $\\pi(x) \\approx \\frac{10^{6}}{13.8} \\approx 72500$.\n\nCheck: the true count is $\\pi(10^{6}) = 78498$, within about 8 percent, and the relative error shrinks as $x$ grows.\n\n> **Watch out.** The logarithm is natural, so $\\ln 10^{k} \\approx 2.3k$, not $k$. And $\\frac{1}{2.3} = \\frac{10}{23}$: the factor 10 must not be lost.",
        "素数定理说明，对大的 $x$，$\\pi(x)$ 接近 $\\frac{x}{\\ln x}$。用 $\\ln 10 \\approx 2.3$ 可以快速估计不超过 10 的幂的质数个数。对 $x = 10^{6}$，$\\ln x \\approx 6 \\cdot 2.3 = 13.8$，所以 $\\pi(x) \\approx \\frac{10^{6}}{13.8} \\approx 72500$。\n\n检验：真实的个数是 $\\pi(10^{6}) = 78498$，误差约 8%，而且 $x$ 越大相对误差越小。\n\n> **注意。** 这里是自然对数，所以 $\\ln 10^{k} \\approx 2.3k$，而不是 $k$。而且 $\\frac{1}{2.3} = \\frac{10}{23}$：因子 10 不能丢。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 30);
          const c = rng.int(1, 9);
          const m = Q.of(10 * c, 23 * k);
          return worked(
            [
              `Using $\\ln 10 \\approx 2.3$, the estimate $\\frac{x}{\\ln x}$ at $x = ${c} \\cdot 10^{${k}}$ with $\\ln x \\approx ${k} \\cdot 2.3$ is $m \\cdot 10^{${k}}$. What is $m$?`,
              `用 $\\ln 10 \\approx 2.3$，估计式 $\\frac{x}{\\ln x}$ 在 $x = ${c} \\cdot 10^{${k}}$、$\\ln x \\approx ${k} \\cdot 2.3$ 时是 $m \\cdot 10^{${k}}$。$m$ 是多少？`,
            ],
            m,
            [
              [
                Q.of(c, 23 * k),
                "That drops the factor 10 from $\\frac{1}{2.3} = \\frac{10}{23}$.",
                "那丢掉了 $\\frac{1}{2.3} = \\frac{10}{23}$ 中的因子 10。",
              ],
              [Q.of(10 * c, 23), `That forgets the factor ${k} in $\\ln x$.`, `那忘了 $\\ln x$ 中的因子 ${k}。`],
              [Q.of(23 * k, 10 * c), "That turns the fraction upside down.", "那把分数颠倒了。"],
            ],
            [
              [
                ["Keep the power of 10 in front", "把 10 的幂留在外面"],
                [
                  `$\\frac{x}{\\ln x} \\approx \\frac{${c} \\cdot 10^{${k}}}{${k} \\cdot 2.3}$, so $m = \\frac{${c}}{${k} \\cdot 2.3}$.`,
                  `$\\frac{x}{\\ln x} \\approx \\frac{${c} \\cdot 10^{${k}}}{${k} \\cdot 2.3}$，所以 $m = \\frac{${c}}{${k} \\cdot 2.3}$。`,
                ],
              ],
              [
                ["Clear the decimal", "去掉小数"],
                [
                  `$m = \\frac{10 \\cdot ${c}}{23 \\cdot ${k}} = \\frac{${10 * c}}{${23 * k}} = ${m.toLatex()}$.`,
                  `$m = \\frac{10 \\cdot ${c}}{23 \\cdot ${k}} = \\frac{${10 * c}}{${23 * k}} = ${m.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Multiply back: $${m.toLatex()} \\cdot ${k} \\cdot 2.3 = ${m.toLatex()} \\cdot \\frac{${23 * k}}{10} = ${c}$, the coefficient of $x$.`,
              `乘回去：$${m.toLatex()} \\cdot ${k} \\cdot 2.3 = ${m.toLatex()} \\cdot \\frac{${23 * k}}{10} = ${c}$，正是 $x$ 的系数。`,
            ],
          );
        }),
    ),
    point(
      "the-density-of-primes",
      ["The density of primes", "质数的密度"],
      [
        "Near a large number $x$, about one number in $\\ln x$ is prime. So replacing $x$ by $x^{k}$ multiplies the typical gap by $k$, since $\\ln x^{k} = k \\ln x$, and primes thin out slowly as the numbers get larger. Near $10^{10}$ the typical gap is about $10 \\cdot 2.3 = 23$, and near $10^{20} = (10^{10})^{2}$ it is about $46$.\n\nCheck: $\\ln 10^{20} = 20 \\cdot 2.3 = 46 = 2 \\cdot 23$.\n\n> **Watch out.** The gap is multiplied by the exponent $k$; it is not squared or raised to the power $k$, because the logarithm turns powers into multiples.",
        "在大数 $x$ 附近，大约每 $\\ln x$ 个数中有一个质数。所以把 $x$ 换成 $x^{k}$，典型间隔就乘以 $k$，因为 $\\ln x^{k} = k \\ln x$，质数随数的增大而缓慢变稀。在 $10^{10}$ 附近典型间隔约为 $10 \\cdot 2.3 = 23$，在 $10^{20} = (10^{10})^{2}$ 附近约为 $46$。\n\n检验：$\\ln 10^{20} = 20 \\cdot 2.3 = 46 = 2 \\cdot 23$。\n\n> **注意。** 间隔是乘以指数 $k$，而不是平方或升到 $k$ 次幂，因为对数把幂变成倍数。",
      ],
      (rng) =>
        until(() => {
          const g = rng.int(5, 50);
          const k = rng.int(2, 15);
          return worked(
            [
              `Near $x$, the typical gap between primes is about ${g}. What is the typical gap near $x^{${k}}$?`,
              `在 $x$ 附近，质数的典型间隔约为 ${g}。在 $x^{${k}}$ 附近典型间隔是多少？`,
            ],
            g * k,
            [
              [g * g, "That squares the gap; the logarithm turns the power into a multiple.", "那把间隔平方了；对数把幂变成倍数。"],
              [g + k, `That adds ${k} to the gap; it is multiplied by ${k}.`, `那给间隔加上了 ${k}；应当乘以 ${k}。`],
              [g, "That keeps the gap unchanged, but primes thin out as numbers grow.", "那让间隔保持不变，但数越大质数越稀。"],
            ],
            [
              [
                ["The gap is a logarithm", "间隔是对数"],
                [`The typical gap near $x$ is $\\ln x \\approx ${g}$.`, `$x$ 附近的典型间隔是 $\\ln x \\approx ${g}$。`],
              ],
              [
                ["Take the logarithm of the power", "取幂的对数"],
                [
                  `$\\ln x^{${k}} = ${k} \\ln x \\approx ${k} \\cdot ${g} = ${g * k}$.`,
                  `$\\ln x^{${k}} = ${k} \\ln x \\approx ${k} \\cdot ${g} = ${g * k}$。`,
                ],
              ],
            ],
            [
              `The share of primes falls from about $\\frac{1}{${g}}$ near $x$ to $\\frac{1}{${g * k}}$ near $x^{${k}}$, ${k} times smaller, and the gap is the reciprocal of that share.`,
              `质数所占的比例从 $x$ 附近的约 $\\frac{1}{${g}}$ 降到 $x^{${k}}$ 附近的 $\\frac{1}{${g * k}}$，小了 ${k} 倍，而间隔是这个比例的倒数。`,
            ],
          );
        }),
    ),
    point(
      "bertrands-postulate",
      ["Bertrand's postulate", "伯特兰公设"],
      [
        "Bertrand's postulate guarantees a prime strictly between $n$ and $2n$ for every $n > 1$. The theorem says nothing about how close to $n$ that prime is, so we still have to search for the first one. For $n = 24$: $25 = 5 \\cdot 5$, $26 = 2 \\cdot 13$, $27 = 3 \\cdot 9$ and $28 = 2 \\cdot 14$ are composite, and 29 is prime.\n\nCheck: $29 < 48$, and 29 is not divisible by 2, 3 or 5, the primes up to $\\sqrt{29}$.\n\n> **Watch out.** The prime must lie strictly above $n$, so $n$ itself never counts. The number just after $n$ need not be prime.",
        "伯特兰公设保证对每个 $n > 1$，在 $n$ 和 $2n$ 之间有一个质数。定理没有说这个质数离 $n$ 多近，所以仍要搜索第一个。对 $n = 24$：$25 = 5 \\cdot 5$，$26 = 2 \\cdot 13$，$27 = 3 \\cdot 9$，$28 = 2 \\cdot 14$ 都是合数，而 29 是质数。\n\n检验：$29 < 48$，而且 29 不被 2、3、5 整除，这些是不超过 $\\sqrt{29}$ 的质数。\n\n> **注意。** 质数必须严格大于 $n$，所以 $n$ 本身从不算数。紧跟在 $n$ 后面的数不一定是质数。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(8, 500);
          let p = n + 1;
          while (!isPrime(p)) p += 1;
          let q = p + 1;
          while (!isPrime(q)) q += 1;
          let below = 2 * n - 1;
          while (!isPrime(below)) below -= 1;
          const tested: string[] = [];
          for (let m = n + 1; m < p; m++) {
            const f = (factorize(m)[0] as [number, number])[0];
            tested.push(`${m} = ${f} \\cdot ${m / f}`);
          }
          const small = primesUpTo(Math.floor(Math.sqrt(p)));
          return worked(
            [
              `Bertrand's postulate promises a prime between ${n} and ${2 * n}. What is the smallest such prime?`,
              `伯特兰公设保证 ${n} 和 ${2 * n} 之间有一个质数。最小的这样的质数是多少？`,
            ],
            p,
            [
              [q, `That skips ${p}, which is prime.`, `那跳过了质数 ${p}。`],
              [n + 1, `That assumes ${n + 1} is prime without testing it.`, `那没有检验就认定 ${n + 1} 是质数。`],
              [
                below,
                `That is the largest prime below ${2 * n}, not the smallest above ${n}.`,
                `那是小于 ${2 * n} 的最大质数，不是大于 ${n} 的最小质数。`,
              ],
            ],
            [
              [
                [`Test the numbers after ${n}`, `检验 ${n} 之后的数`],
                [
                  tested.length > 0 ? `$${tested.join(", \\; ")}$ are composite.` : `The first number after ${n} is ${p}.`,
                  tested.length > 0 ? `$${tested.join(", \\; ")}$ 都是合数。` : `${n} 之后的第一个数是 ${p}。`,
                ],
              ],
              [
                ["The first prime", "第一个质数"],
                [
                  `${p} has no smaller factor, so it is the smallest prime above ${n}.`,
                  `${p} 没有更小的因数，所以它是大于 ${n} 的最小质数。`,
                ],
              ],
            ],
            [
              `$${p} < ${2 * n}$, and ${p} is not divisible by any of $${small.join(", ")}$, the primes up to $\\sqrt{${p}}$.`,
              `$${p} < ${2 * n}$，而且 ${p} 不被 $${small.join(", ")}$ 中任何一个整除，这些是不超过 $\\sqrt{${p}}$ 的质数。`,
            ],
          );
        }),
    ),
  ],
);

const primitiveExist = topic(
  "which-moduli-have-primitive-roots",
  ["Which Moduli Have Primitive Roots", "哪些模有原根"],
  ["Decide when a primitive root exists, and count how many there are.", "判断原根何时存在，并计算有多少个。"],
  ["primitive-roots"],
  [],
  [
    point(
      "the-classification",
      ["The classification", "分类"],
      [
        "A primitive root exists modulo $n$ exactly when $n$ is 1, 2, 4, an odd prime power, or twice an odd prime power. For other moduli, every unit has an order smaller than $\\varphi(n)$. So $18 = 2 \\cdot 3^{2}$ has a primitive root, and 5 is one: its powers modulo 18 are $5, 7, 17, 13, 11, 1$, all six units. But $12 = 2^{2} \\cdot 3$ has none, since every unit $1, 5, 7, 11$ squares to 1.\n\nCheck: $\\varphi(18) = 6$, and 5 has order exactly 6.\n\n> **Watch out.** Twice an odd prime power works, but four times one does not, and neither does 8. Being prime is enough but not necessary.",
        "模 $n$ 有原根，当且仅当 $n$ 是 1、2、4、奇质数的幂，或奇质数的幂的二倍。对其他模，每个单位的阶都小于 $\\varphi(n)$。所以 $18 = 2 \\cdot 3^{2}$ 有原根，5 就是一个：它模 18 的幂是 $5, 7, 17, 13, 11, 1$，正好是全部六个单位。而 $12 = 2^{2} \\cdot 3$ 没有原根，因为每个单位 $1, 5, 7, 11$ 的平方都是 1。\n\n检验：$\\varphi(18) = 6$，而 5 的阶恰好是 6。\n\n> **注意。** 奇质数幂的二倍可以，四倍就不行，8 也不行。是质数是充分条件，但不是必要条件。",
      ],
      (rng) => {
        const has = (n: number): boolean => {
          if (n === 2 || n === 4) return true;
          const m = n % 2 === 0 ? n / 2 : n;
          if (m % 2 === 0) return false;
          return factorize(m).length === 1;
        };
        const n = rng.int(7, 400);
        const yes = has(n);
        const phi = totient(n);
        const units = Array.from({ length: n - 1 }, (_, i) => i + 1).filter((u) => gcdOf(u, n) === 1);
        const orders = units.map((u) => orderOf(u, n));
        const top = Math.max(...orders);
        const root = units[orders.indexOf(top)] as number;
        const a: Pair = ["Yes, primitive roots exist", "有，原根存在"];
        const b: Pair = ["No, there is no primitive root", "没有，不存在原根"];
        const count = totient(phi);
        const slips: Slip[] = [
          yes
            ? [
                b,
                `${n} has one of the forms $p^{k}$ or $2p^{k}$ with $p$ an odd prime, and such a modulus has primitive roots.`,
                `${n} 是 $p^{k}$ 或 $2p^{k}$（$p$ 为奇质数）的形式之一，这样的模有原根。`,
              ]
            : [
                a,
                `${n} is not 2, 4, $p^{k}$ or $2p^{k}$ with $p$ an odd prime, so every unit has order below $\\varphi(${n}) = ${phi}$.`,
                `${n} 不是 2、4、$p^{k}$ 或 $2p^{k}$（$p$ 为奇质数），所以每个单位的阶都小于 $\\varphi(${n}) = ${phi}$。`,
              ],
          [
            ["Yes, and every unit is one", "有，而且每个单位都是原根"],
            "The unit 1 has order 1, so not every unit is a primitive root.",
            "单位 1 的阶是 1，所以不是每个单位都是原根。",
          ],
          [
            ["There is exactly one primitive root", "恰有一个原根"],
            yes
              ? `When primitive roots exist there are $\\varphi(\\varphi(n))$ of them, here $\\varphi(${phi}) = ${count}$.`
              : `Modulo ${n} there is no primitive root at all.`,
            yes ? `原根存在时有 $\\varphi(\\varphi(n))$ 个，这里是 $\\varphi(${phi}) = ${count}$ 个。` : `模 ${n} 根本没有原根。`,
          ],
        ];
        return chosen(
          rng,
          [`Does the modulus ${n} have a primitive root?`, `模 ${n} 有原根吗？`],
          yes ? a : b,
          slips,
          [
            [
              ["Factor the modulus", "分解模数"],
              [`$${n} = ${factorizationLatex(factorize(n))}$.`, `$${n} = ${factorizationLatex(factorize(n))}$。`],
            ],
            [
              ["Compare with the list", "与列表比较"],
              [
                `Primitive roots exist only for 2, 4, $p^{k}$ and $2p^{k}$ with $p$ an odd prime, and ${n} ${yes ? "has" : "does not have"} one of these forms.`,
                `只有 2、4、$p^{k}$ 和 $2p^{k}$（$p$ 为奇质数）才有原根，而 ${n} ${yes ? "是" : "不是"}这些形式之一。`,
              ],
            ],
          ],
          yes
            ? [
                `$\\varphi(${n}) = ${phi}$, and ${root} has order ${top}, so it is a primitive root.`,
                `$\\varphi(${n}) = ${phi}$，而 ${root} 的阶是 ${top}，所以它是原根。`,
              ]
            : [
                `$\\varphi(${n}) = ${phi}$, but the largest order of any unit is ${top}, reached by ${root}.`,
                `$\\varphi(${n}) = ${phi}$，但单位的最大阶是 ${top}，由 ${root} 达到。`,
              ],
        );
      },
    ),
    point(
      "counting-primitive-roots",
      ["Counting primitive roots", "计算原根的个数"],
      [
        "If a primitive root $g$ exists, then the units are the powers of $g$, and $g^{k}$ is a primitive root exactly when $k$ is coprime to $\\varphi(n)$. So the count of primitive roots is $\\varphi(\\varphi(n))$. Modulo 13, $\\varphi(13) = 12$ and $\\varphi(12) = 4$: the primitive roots are $2$, $2^{5}$, $2^{7}$ and $2^{11}$, that is $2, 6, 11, 7$.\n\nCheck: testing every unit modulo 13 finds exactly these four with order 12.\n\n> **Watch out.** For a prime power the inner value is $\\varphi(n)$, not $n - 1$: modulo 9 it is $\\varphi(9) = 6$, so there are $\\varphi(6) = 2$ primitive roots. Not every quadratic nonresidue is a primitive root.",
        "如果原根 $g$ 存在，单位就是 $g$ 的幂，而 $g^{k}$ 是原根当且仅当 $k$ 与 $\\varphi(n)$ 互质。所以原根的个数是 $\\varphi(\\varphi(n))$。模 13 时，$\\varphi(13) = 12$，$\\varphi(12) = 4$：原根是 $2$、$2^{5}$、$2^{7}$、$2^{11}$，即 $2, 6, 11, 7$。\n\n检验：逐个检验模 13 的单位，恰好找到这四个阶为 12 的。\n\n> **注意。** 对质数的幂，里面的值是 $\\varphi(n)$，而不是 $n - 1$：模 9 时它是 $\\varphi(9) = 6$，所以有 $\\varphi(6) = 2$ 个原根。并不是每个二次非剩余都是原根。",
      ],
      (rng) =>
        until(() => {
          const n = rng.pick([
            ...oddPrimes,
            9,
            25,
            27,
            49,
            81,
            121,
            125,
            169,
            18,
            50,
            54,
            98,
            162,
            242,
            250,
            338,
            61,
            67,
            71,
            73,
            79,
            83,
            89,
            97,
            101,
            103,
            107,
            109,
            113,
            127,
          ]);
          const f = totient(n);
          const count = totient(f);
          const roots = Array.from({ length: n - 1 }, (_, i) => i + 1).filter((u) => gcdOf(u, n) === 1 && orderOf(u, n) === f);
          return worked(
            [`How many primitive roots does the modulus ${n} have?`, `模 ${n} 有多少个原根？`],
            count,
            [
              [f, "That counts every unit; only those of the full order are primitive roots.", "那数了每个单位；只有阶为满阶的才是原根。"],
              [
                f / 2,
                "That counts the quadratic nonresidues, half of the units; not all of them are primitive roots.",
                "那数的是二次非剩余，占单位的一半；它们并不都是原根。",
              ],
              [f - 1, "That counts every unit except 1.", "那数了除 1 以外的每个单位。"],
            ],
            [
              [
                ["The number of units", "单位的个数"],
                [
                  `$${n} = ${factorizationLatex(factorize(n))}$, so $\\varphi(${n}) = ${f}$.`,
                  `$${n} = ${factorizationLatex(factorize(n))}$，所以 $\\varphi(${n}) = ${f}$。`,
                ],
              ],
              [
                ["Count the exponents coprime to it", "数与它互质的指数"],
                [
                  `$${f} = ${factorizationLatex(factorize(f))}$, so $\\varphi(${f}) = ${count}$.`,
                  `$${f} = ${factorizationLatex(factorize(f))}$，所以 $\\varphi(${f}) = ${count}$。`,
                ],
              ],
            ],
            [
              `Testing the order of every unit modulo ${n} finds exactly ${roots.length} of order ${f}, the smallest being ${roots[0]}.`,
              `逐个检验模 ${n} 的单位的阶，恰好找到 ${roots.length} 个阶为 ${f} 的，最小的是 ${roots[0]}。`,
            ],
          );
        }),
    ),
    point(
      "the-largest-order",
      ["The largest order", "最大的阶"],
      [
        "For a modulus $n = pq$ with distinct odd primes, the order of any unit divides $\\operatorname{lcm}(p - 1, q - 1)$. This is smaller than $\\varphi(n)$ because both $p - 1$ and $q - 1$ are even, so no primitive root exists. Modulo 15 the largest order is $\\operatorname{lcm}(2, 4) = 4$, while $\\varphi(15) = 8$.\n\nCheck: 2 has order 4 modulo 15, since its powers are $2, 4, 8, 1$.\n\n> **Watch out.** The orders modulo $p$ and $q$ combine by the lcm, not the product. Taking only the larger of $p - 1$ and $q - 1$ can fall short of the lcm.",
        "对不同奇质数之积 $n = pq$，任何单位的阶都整除 $\\operatorname{lcm}(p - 1, q - 1)$。因为 $p - 1$ 和 $q - 1$ 都是偶数，它小于 $\\varphi(n)$，所以不存在原根。模 15 时最大的阶是 $\\operatorname{lcm}(2, 4) = 4$，而 $\\varphi(15) = 8$。\n\n检验：2 模 15 的阶是 4，因为它的幂是 $2, 4, 8, 1$。\n\n> **注意。** 模 $p$ 和模 $q$ 的阶按最小公倍数组合，而不是相乘。只取 $p - 1$ 和 $q - 1$ 中较大的那个可能达不到最小公倍数。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = (rng.sample(oddPrimes, 2) as [number, number]).sort((x, y) => x - y);
          const g = gcdOf(p - 1, q - 1);
          const l = ((p - 1) * (q - 1)) / g;
          return worked(
            [`What is the largest possible order of a unit modulo ${p * q}?`, `模 ${p * q} 的单位的最大可能的阶是多少？`],
            l,
            [
              [
                (p - 1) * (q - 1),
                `That is $\\varphi(${p * q})$, which would need a primitive root.`,
                `那是 $\\varphi(${p * q})$，那需要有原根。`,
              ],
              [q - 1, `That takes only the order ${q - 1} available modulo ${q}.`, `那只取了模 ${q} 能达到的阶 ${q - 1}。`],
              [
                ((p - 1) * (q - 1)) / 2,
                "That halves $\\varphi$; the largest order is $\\varphi$ divided by the gcd of $p - 1$ and $q - 1$.",
                "那把 $\\varphi$ 减半了；最大的阶是 $\\varphi$ 除以 $p - 1$ 与 $q - 1$ 的最大公约数。",
              ],
            ],
            [
              [
                ["Split by the Chinese remainder theorem", "用中国剩余定理拆开"],
                [
                  `A unit's order is the lcm of its orders modulo ${p} and ${q}, which can reach ${p - 1} and ${q - 1} independently.`,
                  `单位的阶是它模 ${p} 和模 ${q} 的阶的最小公倍数，这两个阶可以分别独立达到 ${p - 1} 和 ${q - 1}。`,
                ],
              ],
              [
                ["Take the lcm", "取最小公倍数"],
                [
                  `$\\operatorname{lcm}(${p - 1}, ${q - 1}) = \\frac{${p - 1} \\cdot ${q - 1}}{${g}} = ${l}$.`,
                  `$\\operatorname{lcm}(${p - 1}, ${q - 1}) = \\frac{${p - 1} \\cdot ${q - 1}}{${g}} = ${l}$。`,
                ],
              ],
            ],
            [
              `${l} is a multiple of both ${p - 1} and ${q - 1}, and $\\frac{\\varphi(${p * q})}{${l}} = \\frac{${(p - 1) * (q - 1)}}{${l}} = ${g} = \\gcd(${p - 1}, ${q - 1})$.`,
              `${l} 同时是 ${p - 1} 和 ${q - 1} 的倍数，而 $\\frac{\\varphi(${p * q})}{${l}} = \\frac{${(p - 1) * (q - 1)}}{${l}} = ${g} = \\gcd(${p - 1}, ${q - 1})$。`,
            ],
          );
        }),
    ),
  ],
);

const indices = topic(
  "index-arithmetic",
  ["Index Arithmetic", "指标算术"],
  ["Turn multiplication modulo a prime into addition, like a logarithm table.", "把模质数的乘法变成加法，就像对数表。"],
  ["which-moduli-have-primitive-roots", "discrete-logarithms"],
  [],
  [
    point(
      "the-index-of-a-product",
      ["The index of a product", "乘积的指标"],
      [
        "With a primitive root $g$ modulo $p$, the index of $a$ is the exponent $k$ with $g^{k} \\equiv a$. Indices behave like logarithms, so the index of a product is the sum of the indices modulo $p - 1$. Modulo 11 with $g = 2$: $\\operatorname{ind}(3) = 8$ and $\\operatorname{ind}(7) = 7$, so $\\operatorname{ind}(21) = 8 + 7 = 15 \\equiv 5 \\pmod{10}$.\n\nCheck: $21 \\equiv 10$, and $2^{5} = 32 = 2 \\cdot 11 + 10$.\n\n> **Watch out.** Indices are reduced modulo $p - 1$, the order of $g$, not modulo $p$. Multiplying indices belongs to powers, not to products.",
        "取模 $p$ 的原根 $g$，$a$ 的指标是满足 $g^{k} \\equiv a$ 的指数 $k$。指标的行为像对数，所以乘积的指标是指标之和模 $p - 1$。模 11、取 $g = 2$：$\\operatorname{ind}(3) = 8$，$\\operatorname{ind}(7) = 7$，所以 $\\operatorname{ind}(21) = 8 + 7 = 15 \\equiv 5 \\pmod{10}$。\n\n检验：$21 \\equiv 10$，而 $2^{5} = 32 = 2 \\cdot 11 + 10$。\n\n> **注意。** 指标要模 $p - 1$，即 $g$ 的阶，而不是模 $p$。把指标相乘对应的是幂，不是乘积。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
          const [i, j] = rng.sample(
            Array.from({ length: p - 2 }, (_, v) => v + 1),
            2,
          ) as [number, number];
          const answer = (i + j) % (p - 1);
          let g = 2;
          while (orderOf(g, p) !== p - 1) g += 1;
          const [a, b] = [powMod(g, i, p), powMod(g, j, p)];
          return worked(
            [
              `Modulo ${p}, we have $\\operatorname{ind}(a) = ${i}$ and $\\operatorname{ind}(b) = ${j}$. What is $\\operatorname{ind}(ab)$, as a number from 0 to ${p - 2}?`,
              `模 ${p} 时，$\\operatorname{ind}(a) = ${i}$，$\\operatorname{ind}(b) = ${j}$。$\\operatorname{ind}(ab)$ 是多少（取 0 到 ${p - 2}）？`,
            ],
            answer,
            [
              [
                (i * j) % (p - 1),
                "That multiplies the indices; that is the rule for powers, not for products.",
                "那是把指标相乘；那是幂的规则，不是乘积的。",
              ],
              [
                (i + j) % p,
                `That reduces modulo ${p}; indices live modulo $p - 1 = ${p - 1}$.`,
                `那是模 ${p} 化简；指标是模 $p - 1 = ${p - 1}$ 的。`,
              ],
              [i + j, `That forgets to reduce modulo ${p - 1}.`, `那忘了模 ${p - 1} 化简。`],
              [Math.abs(i - j), "That subtracts the indices, which is the rule for a quotient.", "那是把指标相减，那是商的规则。"],
            ],
            [
              [
                ["Add the indices", "把指标相加"],
                [
                  `$${pw("g", i)} \\cdot ${pw("g", j)} = g^{${i + j}}$, so add: $${i} + ${j} = ${i + j}$.`,
                  `$${pw("g", i)} \\cdot ${pw("g", j)} = g^{${i + j}}$，所以相加：$${i} + ${j} = ${i + j}$。`,
                ],
              ],
              [
                [`Reduce modulo ${p - 1}`, `模 ${p - 1} 化简`],
                [
                  `$g^{${p - 1}} \\equiv 1$, so $${i + j} \\equiv ${answer} \\pmod{${p - 1}}$.`,
                  `$g^{${p - 1}} \\equiv 1$，所以 $${i + j} \\equiv ${answer} \\pmod{${p - 1}}$。`,
                ],
              ],
            ],
            [
              `Take the primitive root $g = ${g}$: then $a \\equiv ${pw(g, i)} \\equiv ${a}$ and $b \\equiv ${pw(g, j)} \\equiv ${b}$, so $ab \\equiv ${(a * b) % p}$, and indeed $${pw(g, answer)} \\equiv ${powMod(g, answer, p)} \\pmod{${p}}$.`,
              `取原根 $g = ${g}$：则 $a \\equiv ${pw(g, i)} \\equiv ${a}$，$b \\equiv ${pw(g, j)} \\equiv ${b}$，所以 $ab \\equiv ${(a * b) % p}$，而确实 $${pw(g, answer)} \\equiv ${powMod(g, answer, p)} \\pmod{${p}}$。`,
            ],
          );
        }),
    ),
    point(
      "solving-a-power-congruence",
      ["Solving a power congruence", "解幂同余式"],
      [
        "Taking indices turns $x^{k} \\equiv a$ into the linear congruence $k \\operatorname{ind}(x) \\equiv \\operatorname{ind}(a)$ modulo $p - 1$. So the number of solutions is either 0 or $\\gcd(k, p - 1)$. For $x^{3} \\equiv 1 \\pmod{13}$, $\\gcd(3, 12) = 3$, and the solutions are $1, 3, 9$.\n\nCheck: $3^{3} = 27 = 2 \\cdot 13 + 1$ and $9^{3} = 729 = 56 \\cdot 13 + 1$.\n\n> **Watch out.** The count is the gcd, not the degree $k$, and not 1 as for a linear congruence modulo a prime. It is 0 only when no solution exists at all.",
        "取指标把 $x^{k} \\equiv a$ 变成线性同余式 $k \\operatorname{ind}(x) \\equiv \\operatorname{ind}(a)$ 模 $p - 1$。所以解的个数是 0 或 $\\gcd(k, p - 1)$。对 $x^{3} \\equiv 1 \\pmod{13}$，$\\gcd(3, 12) = 3$，解是 $1, 3, 9$。\n\n检验：$3^{3} = 27 = 2 \\cdot 13 + 1$，$9^{3} = 729 = 56 \\cdot 13 + 1$。\n\n> **注意。** 个数是最大公约数，不是次数 $k$，也不是像模质数的线性同余式那样的 1。只有根本没有解时它才是 0。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
          const k = rng.int(2, 18);
          const x = rng.int(2, p - 2);
          const a = powMod(x, k, p);
          const g = gcdOf(k, p - 1);
          const sols = Array.from({ length: p - 1 }, (_, i) => i + 1).filter((y) => powMod(y, k, p) === a);
          return worked(
            [`How many solutions does $x^{${k}} \\equiv ${a} \\pmod{${p}}$ have?`, `$x^{${k}} \\equiv ${a} \\pmod{${p}}$ 有多少个解？`],
            g,
            [
              [k, `That takes the degree ${k}; the count is $\\gcd(${k}, ${p - 1})$.`, `那取了次数 ${k}；个数是 $\\gcd(${k}, ${p - 1})$。`],
              [1, "That treats it like a linear congruence with a single solution.", "那把它当成了只有一个解的线性同余式。"],
              [0, `That says there is no solution, but $x = ${x}$ is one.`, `那说没有解，但 $x = ${x}$ 就是一个解。`],
            ],
            [
              [
                ["Take indices", "取指标"],
                [
                  `$${k} \\operatorname{ind}(x) \\equiv \\operatorname{ind}(${a}) \\pmod{${p - 1}}$.`,
                  `$${k} \\operatorname{ind}(x) \\equiv \\operatorname{ind}(${a}) \\pmod{${p - 1}}$。`,
                ],
              ],
              [
                ["A solution exists", "解存在"],
                [
                  `$${x}^{${k}} \\equiv ${a}$, so the linear congruence is solvable.`,
                  `$${x}^{${k}} \\equiv ${a}$，所以这个线性同余式有解。`,
                ],
              ],
              [
                ["Count by the gcd", "用最大公约数计数"],
                [
                  `A solvable linear congruence modulo ${p - 1} has $\\gcd(${k}, ${p - 1}) = ${g}$ solutions.`,
                  `有解的模 ${p - 1} 线性同余式有 $\\gcd(${k}, ${p - 1}) = ${g}$ 个解。`,
                ],
              ],
            ],
            [
              `Raising each of $1, \\ldots, ${p - 1}$ to the power ${k} finds the solutions $${sols.join(", ")}$, ${sols.length} in all.`,
              `把 $1, \\ldots, ${p - 1}$ 逐个升到 ${k} 次幂，找到解 $${sols.join(", ")}$，共 ${sols.length} 个。`,
            ],
          );
        }),
    ),
    point(
      "kth-power-residues",
      ["Power residues", "幂剩余"],
      [
        "The $k$th powers form a subgroup of the units. Its size is $\\frac{p - 1}{\\gcd(k, p - 1)}$, so a fraction $\\frac{1}{\\gcd(k, p - 1)}$ of the units are $k$th powers modulo $p$. Modulo 13 with $k = 4$: $\\gcd(4, 12) = 4$, so there are $\\frac{12}{4} = 3$ fourth powers, namely $1, 3, 9$.\n\nCheck: $2^{4} = 16 \\equiv 3$, $3^{4} = 81 \\equiv 3$ and $4^{4} = 256 \\equiv 9 \\pmod{13}$, and every other unit lands on one of $1, 3, 9$ too.\n\n> **Watch out.** Divide by the gcd, not by $k$. The gcd itself counts the solutions of $x^{k} \\equiv 1$, which is how many units share each $k$th power.",
        "$k$ 次幂构成单位的子群。它的大小是 $\\frac{p - 1}{\\gcd(k, p - 1)}$，所以模 $p$ 的单位中有 $\\frac{1}{\\gcd(k, p - 1)}$ 是 $k$ 次幂。模 13、取 $k = 4$：$\\gcd(4, 12) = 4$，所以有 $\\frac{12}{4} = 3$ 个四次幂，即 $1, 3, 9$。\n\n检验：$2^{4} = 16 \\equiv 3$，$3^{4} = 81 \\equiv 3$，$4^{4} = 256 \\equiv 9 \\pmod{13}$，其余单位也都落在 $1, 3, 9$ 之一。\n\n> **注意。** 要除以最大公约数，而不是除以 $k$。最大公约数本身数的是 $x^{k} \\equiv 1$ 的解，也就是共享同一个 $k$ 次幂的单位个数。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([...oddPrimes.filter((v) => v >= 7), 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]);
          const k = rng.int(2, 12);
          const g = gcdOf(k, p - 1);
          if (g === 1) return undefined;
          const values = [...new Set(Array.from({ length: p - 1 }, (_, i) => powMod(i + 1, k, p)))].sort((x, y) => x - y);
          return worked(
            [`How many distinct nonzero $${k}$th powers are there modulo ${p}?`, `模 ${p} 有多少个不同的非零 $${k}$ 次幂？`],
            (p - 1) / g,
            [
              [p - 1, "That counts every unit, but different units can share a power.", "那数了每个单位，但不同的单位可能有相同的幂。"],
              [
                g,
                `That is $\\gcd(${k}, ${p - 1})$, the number of units sharing each power.`,
                `那是 $\\gcd(${k}, ${p - 1})$，共享同一个幂的单位个数。`,
              ],
              [Q.of(p - 1, k), `That divides by ${k} instead of by the gcd.`, `那是除以 ${k}，而不是除以最大公约数。`],
            ],
            [
              [
                ["The gcd", "最大公约数"],
                [`$\\gcd(${k}, ${p - 1}) = ${g}$.`, `$\\gcd(${k}, ${p - 1}) = ${g}$。`],
              ],
              [
                ["Divide the units", "把单位分组"],
                [
                  `Each $${k}$th power comes from exactly ${g} units, so there are $\\frac{${p - 1}}{${g}} = ${(p - 1) / g}$.`,
                  `每个 $${k}$ 次幂恰好来自 ${g} 个单位，所以共有 $\\frac{${p - 1}}{${g}} = ${(p - 1) / g}$ 个。`,
                ],
              ],
            ],
            values.length <= 16
              ? [
                  `Raising every unit to the power ${k} gives the values $${values.join(", ")}$, ${values.length} in all.`,
                  `把每个单位升到 ${k} 次幂，得到的值是 $${values.join(", ")}$，共 ${values.length} 个。`,
                ]
              : [
                  `Raising every unit to the power ${k} and listing the results gives ${values.length} distinct values.`,
                  `把每个单位升到 ${k} 次幂并列出结果，得到 ${values.length} 个不同的值。`,
                ],
          );
        }),
    ),
  ],
);

const legendreFormula = topic(
  "legendres-formula-and-kummers-theorem",
  ["Legendre's Formula and Kummer's Theorem", "勒让德公式和库默尔定理"],
  ["Find how often a prime divides a factorial or a binomial coefficient.", "求质数整除阶乘或二项式系数的次数。"],
  ["prime-valuations"],
  [],
  [
    point(
      "the-exponent-in-a-factorial",
      ["The exponent in a factorial", "阶乘中的指数"],
      [
        "The exponent of $p$ in $n!$ is $\\left\\lfloor\\frac{n}{p}\\right\\rfloor + \\left\\lfloor\\frac{n}{p^{2}}\\right\\rfloor + \\cdots$. Each term counts the multiples of a higher power, because a multiple of $p^{2}$ supplies a second factor. For $p = 3$ and $n = 100$: $33 + 11 + 3 + 1 = 48$.\n\nCheck: $100 = 10201_{3}$ has digit sum 4, and $\\frac{100 - 4}{3 - 1} = 48$.\n\n> **Watch out.** Keep going until the floors reach 0; stopping after $\\left\\lfloor\\frac{n}{p}\\right\\rfloor$ misses the extra factors in the multiples of $p^{2}, p^{3}, \\ldots$.",
        "$n!$ 中 $p$ 的指数是 $\\left\\lfloor\\frac{n}{p}\\right\\rfloor + \\left\\lfloor\\frac{n}{p^{2}}\\right\\rfloor + \\cdots$。每一项数更高次幂的倍数，因为 $p^{2}$ 的倍数提供第二个因子。对 $p = 3$，$n = 100$：$33 + 11 + 3 + 1 = 48$。\n\n检验：$100 = 10201_{3}$ 的数字和是 4，而 $\\frac{100 - 4}{3 - 1} = 48$。\n\n> **注意。** 要一直算到取整值为 0；只算到 $\\left\\lfloor\\frac{n}{p}\\right\\rfloor$ 会漏掉 $p^{2}, p^{3}, \\ldots$ 的倍数里多出的因子。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5, 7]);
          const n = rng.int(20, 800);
          const floors: number[] = [];
          for (let m = Math.floor(n / p); m > 0; m = Math.floor(m / p)) floors.push(m);
          const e = floors.reduce((x, y) => x + y, 0);
          const added = floors.length > 1 ? `${floors.join(" + ")} = ${e}` : `${e}`;
          const digits = digitsIn(n, p);
          const s = digits.reduce((x, y) => x + y, 0);
          return worked(
            [`What is the exponent of ${p} in $${n}!$?`, `$${n}!$ 中 ${p} 的指数是多少？`],
            e,
            [
              [
                floors[0] as number,
                `That stops after $\\left\\lfloor\\frac{${n}}{${p}}\\right\\rfloor$ and misses the extra factors in multiples of $${p}^{2}$.`,
                `那只算到 $\\left\\lfloor\\frac{${n}}{${p}}\\right\\rfloor$，漏掉了 $${p}^{2}$ 的倍数里多出的因子。`,
              ],
              [
                (floors[0] as number) + (floors[1] ?? 0),
                `That stops after two terms and misses the multiples of $${p}^{3}$.`,
                `那只算了两项，漏掉了 $${p}^{3}$ 的倍数。`,
              ],
              [
                Math.floor(n / (p - 1)),
                `That divides ${n} by ${p - 1}, which only bounds the exponent from above.`,
                `那是用 ${p - 1} 除 ${n}，只给出指数的上界。`,
              ],
            ],
            [
              [
                ["Count the multiples of each power", "数每个幂的倍数"],
                [
                  `$\\left\\lfloor\\frac{${n}}{${p}^{i}}\\right\\rfloor$ for $i = 1, 2, \\ldots$ are $${floors.join(", ")}$, and then 0.`,
                  `$\\left\\lfloor\\frac{${n}}{${p}^{i}}\\right\\rfloor$ 对 $i = 1, 2, \\ldots$ 依次是 $${floors.join(", ")}$，然后是 0。`,
                ],
              ],
              [
                ["Add", "相加"],
                [`$${added}$.`, `$${added}$。`],
              ],
            ],
            [
              `In base ${p}, $${n} = ${digits.join("")}_{${p}}$ with digit sum ${s}, and $\\frac{${n} - ${s}}{${p} - 1} = ${e}$.`,
              `在 ${p} 进制中 $${n} = ${digits.join("")}_{${p}}$，数字和是 ${s}，而 $\\frac{${n} - ${s}}{${p} - 1} = ${e}$。`,
            ],
          );
        }),
    ),
    point(
      "trailing-zeros",
      ["Trailing zeros", "末尾的零"],
      [
        "The zeros at the end of $n!$ count the factors of ten. Factors of 2 are more common than factors of 5 in a factorial, so the number of trailing zeros is the exponent of 5 in $n!$. For $1000!$ this is $200 + 40 + 8 + 1 = 249$.\n\nCheck: $1000 = 13000_{5}$ has digit sum 4, and $\\frac{1000 - 4}{4} = 249$.\n\n> **Watch out.** Dividing by 10 counts only the multiples of 10, and stopping at $\\left\\lfloor\\frac{n}{5}\\right\\rfloor$ misses the second five in 25, 50, 75 and so on.",
        "$n!$ 末尾的零计算因子十的个数。阶乘中因子 2 比因子 5 多，所以末尾零的个数是 $n!$ 中 5 的指数。对 $1000!$，这是 $200 + 40 + 8 + 1 = 249$。\n\n检验：$1000 = 13000_{5}$ 的数字和是 4，而 $\\frac{1000 - 4}{4} = 249$。\n\n> **注意。** 除以 10 只数到了 10 的倍数；只算到 $\\left\\lfloor\\frac{n}{5}\\right\\rfloor$ 会漏掉 25、50、75 等数里的第二个因子 5。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(25, 3000);
          const floors: number[] = [];
          for (let m = Math.floor(n / 5); m > 0; m = Math.floor(m / 5)) floors.push(m);
          const e = floors.reduce((x, y) => x + y, 0);
          const digits = digitsIn(n, 5);
          const s = digits.reduce((x, y) => x + y, 0);
          return worked(
            [`How many zeros does $${n}!$ end in?`, `$${n}!$ 末尾有多少个零？`],
            e,
            [
              [
                Math.floor(n / 5),
                "That counts the multiples of 5 once each and misses the extra fives in the multiples of 25.",
                "那把 5 的倍数各数了一次，漏掉了 25 的倍数里多出的 5。",
              ],
              [
                Math.floor(n / 10),
                "That counts only the multiples of 10; a 2 and a 5 from different numbers also make a 10.",
                "那只数了 10 的倍数；来自不同数的 2 和 5 也能凑成 10。",
              ],
              [
                factorialExponent(n, 2),
                "That counts the factors of 2, which are plentiful; the fives run out first.",
                "那数的是因子 2，它们很多；先用完的是因子 5。",
              ],
            ],
            [
              [
                ["Count the factors of 5", "数因子 5"],
                [
                  `Each zero needs a 10, and fives are scarcer than twos, so add $\\left\\lfloor\\frac{${n}}{5^{i}}\\right\\rfloor$: $${floors.join(" + ")}$.`,
                  `每个零需要一个 10，而 5 比 2 少，所以把 $\\left\\lfloor\\frac{${n}}{5^{i}}\\right\\rfloor$ 相加：$${floors.join(" + ")}$。`,
                ],
              ],
              [
                ["Add", "相加"],
                [
                  `$${floors.length > 1 ? `${floors.join(" + ")} = ` : ""}${e}$.`,
                  `$${floors.length > 1 ? `${floors.join(" + ")} = ` : ""}${e}$。`,
                ],
              ],
            ],
            [
              `In base 5, $${n} = ${digits.join("")}_{5}$ with digit sum ${s}, and $\\frac{${n} - ${s}}{4} = ${e}$.`,
              `在 5 进制中 $${n} = ${digits.join("")}_{5}$，数字和是 ${s}，而 $\\frac{${n} - ${s}}{4} = ${e}$。`,
            ],
          );
        }),
    ),
    point(
      "carries-in-a-binomial",
      ["Carries in a binomial", "二项式中的进位"],
      [
        "Kummer's theorem says that the exponent of $p$ in $\\binom{m + n}{m}$ equals the number of carries when adding $m$ and $n$ in base $p$. So in base 2, a carry-free sum means the binomial coefficient is odd. Adding $3 = 011_{2}$ and $5 = 101_{2}$ carries in all three columns, so $2^{3}$ divides $\\binom{8}{3} = 56$ exactly.\n\nCheck: $56 = 8 \\cdot 7$, and 7 is odd.\n\n> **Watch out.** A carry coming in from the right can cause a new carry, so add the columns in order with the carried 1. The exponent of $p$ in $m + n$ alone tells nothing.",
        "库默尔定理说，$\\binom{m + n}{m}$ 中 $p$ 的指数等于在 $p$ 进制中把 $m$ 和 $n$ 相加时的进位次数。所以在二进制中，没有进位的和意味着二项式系数是奇数。把 $3 = 011_{2}$ 和 $5 = 101_{2}$ 相加，三列都有进位，所以 $2^{3}$ 恰好整除 $\\binom{8}{3} = 56$。\n\n检验：$56 = 8 \\cdot 7$，而 7 是奇数。\n\n> **注意。** 从右边进来的进位可能引起新的进位，所以要带着进的 1 按顺序逐列相加。只看 $m + n$ 中 $p$ 的指数说明不了什么。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5]);
          const m = rng.int(3, 200);
          const n = rng.int(3, 200);
          let carries = 0;
          let naive = 0;
          let carry = 0;
          const columns: string[] = [];
          for (let a = m, b = n; a > 0 || b > 0 || carry > 0; a = Math.floor(a / p), b = Math.floor(b / p)) {
            if (a === 0 && b === 0) break;
            const total = (a % p) + (b % p) + carry;
            if ((a % p) + (b % p) >= p) naive += 1;
            columns.push(`${a % p} + ${b % p}${carry ? " + 1" : ""} = ${total}`);
            carry = total >= p ? 1 : 0;
            carries += carry;
          }
          const vSum = factorialExponent(m + n, p) - factorialExponent(m + n - 1, p);
          const e = factorialExponent(m + n, p) - factorialExponent(m, p) - factorialExponent(n, p);
          return worked(
            [`What is the exponent of ${p} in $\\binom{${m + n}}{${m}}$?`, `$\\binom{${m + n}}{${m}}$ 中 ${p} 的指数是多少？`],
            carries,
            [
              [
                naive,
                "That ignores the carried 1, which can push the next column over as well.",
                "那忽略了进上来的 1，它也可能让下一列进位。",
              ],
              [vSum, `That is the exponent of ${p} in ${m + n} alone.`, `那只是 ${m + n} 中 ${p} 的指数。`],
              [
                factorialExponent(m, p) + factorialExponent(n, p),
                `That adds the exponents of ${p} in $${m}!$ and $${n}!$; those are subtracted from the exponent in $${m + n}!$.`,
                `那把 $${m}!$ 和 $${n}!$ 中 ${p} 的指数相加了；它们应当从 $${m + n}!$ 的指数中减去。`,
              ],
            ],
            [
              [
                [`Write both in base ${p}`, `都写成 ${p} 进制`],
                [
                  `$${m} = ${digitsIn(m, p).join("")}_{${p}}$ and $${n} = ${digitsIn(n, p).join("")}_{${p}}$.`,
                  `$${m} = ${digitsIn(m, p).join("")}_{${p}}$，$${n} = ${digitsIn(n, p).join("")}_{${p}}$。`,
                ],
              ],
              [
                ["Add column by column", "逐列相加"],
                [
                  `From the right: $${columns.join(", \\; ")}$; a column carries when its total reaches ${p}.`,
                  `从右起：$${columns.join(", \\; ")}$；一列的和达到 ${p} 就进位。`,
                ],
              ],
              [
                ["Count the carries", "数进位"],
                [`There ${carries === 1 ? "is 1 carry" : `are ${carries} carries`}.`, `共有 ${carries} 次进位。`],
              ],
            ],
            [
              `Legendre's formula gives $${factorialExponent(m + n, p)} - ${factorialExponent(m, p)} - ${factorialExponent(n, p)} = ${e}$ for the exponents of ${p} in $${m + n}!$, $${m}!$ and $${n}!$.`,
              `勒让德公式给出 $${m + n}!$、$${m}!$、$${n}!$ 中 ${p} 的指数，而 $${factorialExponent(m + n, p)} - ${factorialExponent(m, p)} - ${factorialExponent(n, p)} = ${e}$。`,
            ],
          );
        }),
    ),
  ],
);

const lucas = topic(
  "lucas-theorem",
  ["Lucas' Theorem", "卢卡斯定理"],
  ["Reduce a binomial coefficient modulo a prime, one base digit at a time.", "逐位把二项式系数模质数化简。"],
  ["base-expansions", "fermats-little-theorem"],
  [],
  [
    point(
      "binomials-modulo-a-prime",
      ["Binomials modulo a prime", "模质数的二项式系数"],
      [
        "Lucas' theorem says that $\\binom{n}{k}$ modulo $p$ is the product of the binomial coefficients of the base $p$ digits. So a huge coefficient reduces to a product of very small ones. For $\\binom{13}{6}$ modulo 5: $13 = 23_{5}$ and $6 = 11_{5}$, so $\\binom{13}{6} \\equiv \\binom{2}{1}\\binom{3}{1} = 6 \\equiv 1$.\n\nCheck: $\\binom{13}{6} = 1716 = 343 \\cdot 5 + 1$.\n\n> **Watch out.** Pair the digits by place: leading with leading, last with last. Then multiply the small coefficients; adding them is wrong.",
        "卢卡斯定理说，$\\binom{n}{k}$ 模 $p$ 是 $p$ 进制各位数字的二项式系数之积。所以巨大的系数化简成很小的系数之积。对 $\\binom{13}{6}$ 模 5：$13 = 23_{5}$，$6 = 11_{5}$，所以 $\\binom{13}{6} \\equiv \\binom{2}{1}\\binom{3}{1} = 6 \\equiv 1$。\n\n检验：$\\binom{13}{6} = 1716 = 343 \\cdot 5 + 1$。\n\n> **注意。** 按数位配对：最高位对最高位，最后一位对最后一位。然后把小的系数相乘；把它们相加是错的。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([3, 5, 7, 11, 13]);
          const n1 = rng.int(1, p - 1);
          const n0 = rng.int(1, p - 1);
          const k1 = rng.int(0, n1);
          const k0 = rng.int(0, n0);
          const [c1, c0] = [small(n1, k1), small(n0, k0)];
          const v = (c1 * c0) % p;
          const n = n1 * p + n0;
          const k = k1 * p + k0;
          const full = binomial(n, k);
          const big = full.toString();
          return worked(
            [`What is $\\binom{${n}}{${k}}$ modulo ${p}?`, `$\\binom{${n}}{${k}}$ 模 ${p} 是多少？`],
            v,
            [
              [c1 % p, "That keeps only the leading digits and drops the last ones.", "那只保留了最高位，丢掉了最后一位。"],
              [c0 % p, "That keeps only the last digits and drops the leading ones.", "那只保留了最后一位，丢掉了最高位。"],
              [
                (c1 + c0) % p,
                "That adds the small coefficients; Lucas' theorem multiplies them.",
                "那把小的系数相加了；卢卡斯定理是把它们相乘。",
              ],
            ],
            [
              [
                [`Write both in base ${p}`, `都写成 ${p} 进制`],
                [
                  `$${n} = ${n1} \\cdot ${p} + ${n0}$ and $${k} = ${k1} \\cdot ${p} + ${k0}$, so the digits are $(${n1}, ${n0})$ and $(${k1}, ${k0})$.`,
                  `$${n} = ${n1} \\cdot ${p} + ${n0}$，$${k} = ${k1} \\cdot ${p} + ${k0}$，所以数字是 $(${n1}, ${n0})$ 和 $(${k1}, ${k0})$。`,
                ],
              ],
              [
                ["Multiply the small coefficients", "把小的系数相乘"],
                [
                  `$\\binom{${n1}}{${k1}}\\binom{${n0}}{${k0}} = ${c1} \\cdot ${c0} = ${c1 * c0} \\equiv ${v} \\pmod{${p}}$.`,
                  `$\\binom{${n1}}{${k1}}\\binom{${n0}}{${k0}} = ${c1} \\cdot ${c0} = ${c1 * c0} \\equiv ${v} \\pmod{${p}}$。`,
                ],
              ],
            ],
            big.length <= 15
              ? [
                  `$\\binom{${n}}{${k}} = ${big} = ${(full / BigInt(p)).toString()} \\cdot ${p} + ${v}$.`,
                  `$\\binom{${n}}{${k}} = ${big} = ${(full / BigInt(p)).toString()} \\cdot ${p} + ${v}$。`,
                ]
              : [
                  `In full, $\\binom{${n}}{${k}}$ has ${big.length} digits, and dividing it by ${p} leaves ${Number(full % BigInt(p))}.`,
                  `完整地算，$\\binom{${n}}{${k}}$ 有 ${big.length} 位，而它除以 ${p} 余 ${Number(full % BigInt(p))}。`,
                ],
          );
        }),
    ),
    {
      ...point(
        "odd-entries-of-a-row",
        ["Odd entries of a row", "一行中的奇数项"],
        [
          "With $p = 2$, the coefficient $\\binom{n}{k}$ is odd exactly when every binary digit of $k$ is at most the matching digit of $n$. So row $n$ of Pascal's triangle has $2^{s}$ odd entries, where $s$ counts the ones in $n$. Row 5 is $1, 5, 10, 10, 5, 1$, and $5 = 101_{2}$ has two ones, so it has $2^{2} = 4$ odd entries.\n\nCheck: the odd entries are $1, 5, 5, 1$, at $k = 0, 1, 4, 5$, exactly the $k$ whose binary digits fit under $101_{2}$.\n\n> **Watch out.** The count is $2^{s}$, not $s$: each one in $n$ doubles the choices for $k$. The zeros of $n$ allow only one choice and add nothing.",
          "取 $p = 2$，系数 $\\binom{n}{k}$ 是奇数，当且仅当 $k$ 的每个二进制位都不超过 $n$ 的对应位。所以帕斯卡三角形第 $n$ 行有 $2^{s}$ 个奇数项，其中 $s$ 是 $n$ 中 1 的个数。第 5 行是 $1, 5, 10, 10, 5, 1$，而 $5 = 101_{2}$ 有两个 1，所以它有 $2^{2} = 4$ 个奇数项。\n\n检验：奇数项是 $1, 5, 5, 1$，在 $k = 0, 1, 4, 5$ 处，正是二进制位都不超过 $101_{2}$ 的那些 $k$。\n\n> **注意。** 个数是 $2^{s}$，不是 $s$：$n$ 中每个 1 让 $k$ 的选择加倍。$n$ 中的 0 只允许一种选择，不增加个数。",
        ],
        (rng) =>
          until(() => {
            const n = rng.int(5, 2000);
            const bits = n.toString(2);
            const s = bits.replace(/0/g, "").length;
            return worked(
              [`How many entries in row ${n} of Pascal's triangle are odd?`, `帕斯卡三角形第 ${n} 行有多少个奇数项？`],
              2 ** s,
              [
                [
                  s,
                  "That counts the ones in the binary form; each one doubles the count.",
                  "那数的是二进制中 1 的个数；每个 1 让个数加倍。",
                ],
                [n + 1, "That counts every entry of the row, odd or even.", "那数了这一行的每一项，不管奇偶。"],
                [
                  2 ** bits.length,
                  "That counts every binary digit of $n$, but a digit 0 allows only one choice.",
                  "那数了 $n$ 的每个二进制位，但数字 0 只允许一种选择。",
                ],
                [s + 1, "That adds one to the number of ones; the choices multiply.", "那是给 1 的个数加一；选择要相乘。"],
              ],
              [
                [
                  ["Write $n$ in binary", "把 $n$ 写成二进制"],
                  [`$${n} = ${bits}_{2}$, with ${s} ones.`, `$${n} = ${bits}_{2}$，有 ${s} 个 1。`],
                ],
                [
                  ["Count the choices", "数选择"],
                  [
                    `Each 1 lets the matching digit of $k$ be 0 or 1, and each 0 forces 0, so there are $${pw(2, s)} = ${2 ** s}$ choices of $k$.`,
                    `每个 1 让 $k$ 的对应位取 0 或 1，每个 0 迫使它取 0，所以 $k$ 有 $${pw(2, s)} = ${2 ** s}$ 种选择。`,
                  ],
                ],
              ],
              [
                `Building row ${n} modulo 2 entry by entry, from $\\binom{n}{k} = \\binom{n - 1}{k - 1} + \\binom{n - 1}{k}$, leaves ${rowModP(n, 2)} odd entries.`,
                `用 $\\binom{n}{k} = \\binom{n - 1}{k - 1} + \\binom{n - 1}{k}$ 逐项构造模 2 的第 ${n} 行，得到 ${rowModP(n, 2)} 个奇数项。`,
              ],
            );
          }),
      ),
      figure: numberTheoryDrawings1["lucas-theorem#odd-entries-of-a-row"],
    },
    point(
      "a-row-not-divisible-by-p",
      ["Entries not divisible by p", "不被 p 整除的项"],
      [
        "In base $p$, each digit $n_i$ allows $n_i + 1$ choices of the matching digit of $k$. So the number of entries of row $n$ not divisible by $p$ is the product of $n_i + 1$ over all digits. For row 10 and $p = 3$: $10 = 101_{3}$, so the count is $2 \\cdot 1 \\cdot 2 = 4$.\n\nCheck: the entries not divisible by 3 are $\\binom{10}{0}, \\binom{10}{1}, \\binom{10}{9}, \\binom{10}{10}$, that is $1, 10, 10, 1$; for instance $\\binom{10}{2} = 45$ is a multiple of 3.\n\n> **Watch out.** Multiply the numbers $n_i + 1$; adding them, or multiplying the digits themselves, gives the wrong count. A digit 0 still allows one choice.",
        "在 $p$ 进制中，每位 $n_i$ 允许 $k$ 的对应位有 $n_i + 1$ 种选择。所以第 $n$ 行不被 $p$ 整除的项数是所有位上 $n_i + 1$ 的乘积。对第 10 行和 $p = 3$：$10 = 101_{3}$，所以个数是 $2 \\cdot 1 \\cdot 2 = 4$。\n\n检验：不被 3 整除的项是 $\\binom{10}{0}, \\binom{10}{1}, \\binom{10}{9}, \\binom{10}{10}$，即 $1, 10, 10, 1$；例如 $\\binom{10}{2} = 45$ 是 3 的倍数。\n\n> **注意。** 要把各个 $n_i + 1$ 相乘；把它们相加，或者把数字本身相乘，都会算错。数字 0 仍然允许一种选择。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([3, 5, 7]);
          const n = rng.int(p + 1, p ** 3 + 300);
          const digits = digitsIn(n, p);
          const prod = digits.reduce((acc, d) => acc * (d + 1), 1);
          return worked(
            [
              `How many entries in row ${n} of Pascal's triangle are not divisible by ${p}?`,
              `帕斯卡三角形第 ${n} 行有多少项不被 ${p} 整除？`,
            ],
            prod,
            [
              [n + 1, "That counts every entry of the row.", "那数了这一行的每一项。"],
              [
                digits.reduce((a, b) => a + b + 1, 0),
                "That adds the numbers $n_i + 1$; the choices multiply.",
                "那把各个 $n_i + 1$ 相加了；选择要相乘。",
              ],
              [
                digits.reduce((a, b) => a * b, 1),
                "That multiplies the digits without adding one to each.",
                "那把数字直接相乘，没有给每位加一。",
              ],
            ],
            [
              [
                [`Write ${n} in base ${p}`, `把 ${n} 写成 ${p} 进制`],
                [`$${n} = ${digits.join("")}_{${p}}$.`, `$${n} = ${digits.join("")}_{${p}}$。`],
              ],
              [
                ["Multiply the choices", "把选择相乘"],
                [`$${digits.map((d) => d + 1).join(" \\cdot ")} = ${prod}$.`, `$${digits.map((d) => d + 1).join(" \\cdot ")} = ${prod}$。`],
              ],
            ],
            [
              `Building row ${n} modulo ${p} entry by entry, from $\\binom{n}{k} = \\binom{n - 1}{k - 1} + \\binom{n - 1}{k}$, leaves ${rowModP(n, p)} nonzero entries.`,
              `用 $\\binom{n}{k} = \\binom{n - 1}{k - 1} + \\binom{n - 1}{k}$ 逐项构造模 ${p} 的第 ${n} 行，得到 ${rowModP(n, p)} 个非零项。`,
            ],
          );
        }),
    ),
  ],
);

const descent = topic(
  "infinite-descent-and-modular-obstructions",
  ["Infinite Descent and Modular Obstructions", "无穷递降和模障碍"],
  ["Rule out whole number solutions by congruences or by descent.", "用同余或递降排除整数解。"],
  ["pythagorean-triples", "modular-congruence"],
  [],
  [
    point(
      "squares-modulo-a-small-number",
      ["Squares modulo a small number", "模小数的平方"],
      [
        "A congruence can prove that an equation has no solution, because squares reach only some residues. Since $(m - x)^{2} \\equiv x^{2}$, squaring $0, 1, \\ldots, \\left\\lfloor\\frac{m}{2}\\right\\rfloor$ finds them all. Modulo 12 the squares of $0, 1, \\ldots, 6$ are $0, 1, 4, 9, 4, 1, 0$, so squares take only the 4 residues $0, 1, 4, 9$.\n\nCheck: modulo 4 a square is 0 or 1, and modulo 3 it is 0 or 1, so by the Chinese remainder theorem there are $2 \\cdot 2 = 4$ residues modulo 12.\n\n> **Watch out.** Different numbers often have the same square, so count distinct results, not numbers squared. And 0 is a square too.",
        "同余可以证明方程无解，因为平方数只能取到某些剩余。由于 $(m - x)^{2} \\equiv x^{2}$，把 $0, 1, \\ldots, \\left\\lfloor\\frac{m}{2}\\right\\rfloor$ 平方就能找到全部。模 12 时 $0, 1, \\ldots, 6$ 的平方是 $0, 1, 4, 9, 4, 1, 0$，所以平方数只取 $0, 1, 4, 9$ 这 4 个剩余。\n\n检验：模 4 时平方数是 0 或 1，模 3 时也是 0 或 1，所以由中国剩余定理，模 12 有 $2 \\cdot 2 = 4$ 个剩余。\n\n> **注意。** 不同的数常常有相同的平方，所以要数不同的结果，而不是数被平方的数。而且 0 也是平方数。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(5, 60);
          const squares = Array.from({ length: Math.floor(m / 2) + 1 }, (_, x) => (x * x) % m);
          const set = [...new Set(squares)].sort((a, b) => a - b);
          const parts = factorize(m);
          const counts = parts.map(([p, e]) => {
            const q = p ** e;
            return [q, new Set(Array.from({ length: q }, (_, x) => (x * x) % q)).size] as const;
          });
          return worked(
            [`How many different residues do squares take modulo ${m}, counting 0?`, `平方数模 ${m} 取多少个不同的剩余（包括 0）？`],
            set.length,
            [
              [m, "That counts every residue, but many numbers share a square.", "那数了每个剩余，但许多数有相同的平方。"],
              [
                Math.floor(m / 2) + 1,
                `That counts the numbers $0, \\ldots, ${Math.floor(m / 2)}$ squared, but some of them share a square.`,
                `那数了被平方的数 $0, \\ldots, ${Math.floor(m / 2)}$，但其中有些平方相同。`,
              ],
              [set.length - 1, "That leaves out 0, which is the square of 0.", "那漏掉了 0，它是 0 的平方。"],
            ],
            [
              [
                ["Square up to half the modulus", "平方到模数的一半"],
                [
                  `$(${m} - x)^{2} \\equiv x^{2}$, so square $0, \\ldots, ${Math.floor(m / 2)}$: $${squares.join(", ")}$.`,
                  `$(${m} - x)^{2} \\equiv x^{2}$，所以平方 $0, \\ldots, ${Math.floor(m / 2)}$：$${squares.join(", ")}$。`,
                ],
              ],
              [
                ["Count the distinct values", "数不同的值"],
                [
                  `The distinct residues are $${set.join(", ")}$, ${set.length} in all.`,
                  `不同的剩余是 $${set.join(", ")}$，共 ${set.length} 个。`,
                ],
              ],
            ],
            counts.length > 1
              ? [
                  `By the Chinese remainder theorem, multiply the counts modulo each prime power: ${counts.map(([q, c]) => `${c} modulo ${q}`).join(", ")}, so $${counts.map(([, c]) => c).join(" \\cdot ")} = ${set.length}$.`,
                  `由中国剩余定理，把模各个质数幂的个数相乘：${counts.map(([q, c]) => `模 ${q} 有 ${c} 个`).join("，")}，所以 $${counts.map(([, c]) => c).join(" \\cdot ")} = ${set.length}$。`,
                ]
              : [
                  `Squaring the upper half $${Math.floor(m / 2)}, \\ldots, ${m - 1}$ as well repeats the same values, so the ${set.length} residues are all of them.`,
                  `再把上半部分 $${Math.floor(m / 2)}, \\ldots, ${m - 1}$ 也平方，得到的是同样的值，所以这 ${set.length} 个剩余就是全部。`,
                ],
          );
        }),
    ),
    point(
      "an-equation-with-no-solution",
      ["An equation with no solution", "无解的方程"],
      [
        "Two squares add to 0, 1 or 2 modulo 4, since each square is 0 or 1. So a number of the form $4k + 3$ is never a sum of two squares, and one small modulus settles infinitely many cases. For example $2023 = 4 \\cdot 505 + 3$ is not a sum of two squares, while $2026 = 45^{2} + 1^{2}$ is.\n\nCheck: trying every $x$ from 0 to 44, the number $2023 - x^{2}$ is never a perfect square.\n\n> **Watch out.** The test only rules numbers out. A number that is 1 or 2 modulo 4, such as 21, can still fail to be a sum of two squares.",
        "两个平方数相加模 4 得 0、1 或 2，因为每个平方数是 0 或 1。所以形如 $4k + 3$ 的数永远不是两个平方数之和，一个小的模数就能解决无穷多种情形。例如 $2023 = 4 \\cdot 505 + 3$ 不是两个平方数之和，而 $2026 = 45^{2} + 1^{2}$ 是。\n\n检验：对 0 到 44 的每个 $x$，$2023 - x^{2}$ 都不是完全平方数。\n\n> **注意。** 这个检验只能排除。模 4 余 1 或 2 的数，例如 21，仍然可能不是两个平方数之和。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 400);
          const bad = 4 * k + 3;
          const a = rng.int(1, 30);
          const b = rng.int(1, 30);
          const sums = [
            [a, b],
            [a + 1, b],
            [a + 2, b + 1],
          ] as const;
          const values = sums.map(([x, y]) => x * x + y * y);
          if (new Set([bad, ...values]).size < 4) return undefined;
          const slips: Slip[] = sums.map(([x, y], i) => {
            const v = values[i] as number;
            return [
              [`${v}`, `${v}`],
              `$${v} = ${x}^{2} + ${y}^{2}$, so it is a sum of two squares.`,
              `$${v} = ${x}^{2} + ${y}^{2}$，所以它是两个平方数之和。`,
            ];
          });
          const root = Math.floor(Math.sqrt(bad));
          return chosen(
            rng,
            ["Which of these numbers cannot be a sum of two squares of whole numbers?", "这些数中哪个不可能是两个整数的平方和？"],
            [`${bad}`, `${bad}`],
            slips,
            [
              [
                ["Squares modulo 4", "平方数模 4"],
                [
                  "Every square is 0 or 1 modulo 4, so two squares add to 0, 1 or 2.",
                  "每个平方数模 4 是 0 或 1，所以两个平方数相加得 0、1 或 2。",
                ],
              ],
              [
                ["Reduce each number", "化简每个数"],
                [
                  `$${bad} = 4 \\cdot ${k} + 3$, while ${values.map((v) => `$${v} \\equiv ${v % 4}$`).join(", ")}.`,
                  `$${bad} = 4 \\cdot ${k} + 3$，而 ${values.map((v) => `$${v} \\equiv ${v % 4}$`).join("，")}。`,
                ],
              ],
              [
                ["Rule it out", "排除"],
                [`So ${bad} cannot be a sum of two squares.`, `所以 ${bad} 不可能是两个平方数之和。`],
              ],
            ],
            [
              `Trying every $x$ from 0 to ${root}, the number $${bad} - x^{2}$ is never a perfect square; the other three are written as sums of squares above.`,
              `对 0 到 ${root} 的每个 $x$，$${bad} - x^{2}$ 都不是完全平方数；另外三个数已经写成了平方和。`,
            ],
          );
        }),
    ),
    point(
      "a-descent-step",
      ["A descent step", "递降的一步"],
      [
        "Fermat's descent shows that a solution would produce a smaller one, which is impossible for whole numbers. For $x^{2} + y^{2} = 3z^{2}$, squares modulo 3 are 0 or 1, so 3 divides both $x$ and $y$, then $z$, and dividing by 3 gives a smaller solution. A solution with $x = 45 = 3^{2} \\cdot 5$ would go $45 \\to 15 \\to 5$, so it allows 2 steps and then breaks down.\n\nCheck: $45 = 3 \\cdot 15 = 3 \\cdot 3 \\cdot 5$, and 5 is not a multiple of 3.\n\n> **Watch out.** The number of steps is the exponent of the prime in $x$, not the quotient left over. Since descent never really stops, a finite count is the contradiction that rules the solution out.",
        "费马的递降法说明一个解会产生更小的解，这对整数是不可能的。对 $x^{2} + y^{2} = 3z^{2}$，平方数模 3 是 0 或 1，所以 3 整除 $x$ 和 $y$，进而整除 $z$，再除以 3 就得到更小的解。若一个解有 $x = 45 = 3^{2} \\cdot 5$，它会经过 $45 \\to 15 \\to 5$，所以允许 2 步，然后就进行不下去。\n\n检验：$45 = 3 \\cdot 15 = 3 \\cdot 3 \\cdot 5$，而 5 不是 3 的倍数。\n\n> **注意。** 步数是这个质数在 $x$ 中的指数，而不是剩下的商。由于递降本应永不停止，有限的步数正是排除这个解的矛盾。",
      ],
      (rng) =>
        until(() => {
          const prime = rng.pick([3, 7, 11, 19, 23]);
          const e = rng.int(1, 4);
          const m = rng.int(1, 40) * prime + rng.int(1, prime - 1);
          const x = prime ** e * m;
          const chain = Array.from({ length: e + 1 }, (_, i) => x / prime ** i);
          return worked(
            [
              `Descent on $x^{2} + y^{2} = ${prime}z^{2}$ replaces $(x, y, z)$ by $(x, y, z)$ divided by ${prime}. If $x = ${x}$, how many steps are possible before $x$ stops being divisible by ${prime}?`,
              `对 $x^{2} + y^{2} = ${prime}z^{2}$ 的递降把 $(x, y, z)$ 换成 $(x, y, z)$ 除以 ${prime}。如果 $x = ${x}$，在 $x$ 不再被 ${prime} 整除之前能进行多少步？`,
            ],
            e,
            [
              [m, "That is the part of $x$ left at the end, not the number of steps.", "那是最后剩下的 $x$ 的部分，不是步数。"],
              [
                x / prime,
                `That divides once and reports the new $x$ instead of counting the steps.`,
                `那只除了一次，报告了新的 $x$，而不是数步数。`,
              ],
              [e + 1, "That counts the starting value as a step as well.", "那把起始值也算作了一步。"],
            ],
            [
              [
                [`Divide by ${prime} while you can`, `能除就用 ${prime} 除`],
                [`$${chain.join(" \\to ")}$.`, `$${chain.join(" \\to ")}$。`],
              ],
              [
                ["Count the arrows", "数箭头"],
                [
                  `${m} is not a multiple of ${prime}, so there ${e === 1 ? "is 1 step" : `are ${e} steps`}; descent would need infinitely many, so no solution exists.`,
                  `${m} 不是 ${prime} 的倍数，所以共 ${e} 步；递降需要无穷多步，所以没有解。`,
                ],
              ],
            ],
            [
              `Factor directly: $${x} = ${pw(prime, e)} \\cdot ${m}$, and the exponent of ${prime} is ${e}.`,
              `直接分解：$${x} = ${pw(prime, e)} \\cdot ${m}$，${prime} 的指数是 ${e}。`,
            ],
          );
        }),
    ),
  ],
);

const sumOfSquaresFunction = topic(
  "the-sum-of-squares-function",
  ["The Sum of Squares Function", "平方和函数"],
  ["Count all ways of writing a number as a sum of two squares.", "计算把一个数写成两个平方数之和的所有方式。"],
  ["sums-of-two-squares", "counting-divisors"],
  [],
  [
    point(
      "the-count-from-divisors",
      ["The count from divisors", "由除数计数"],
      [
        "The number of integer pairs with $x^{2} + y^{2} = n$, counting order and signs, is $r_2(n) = 4(d_1 - d_3)$, where $d_1$ and $d_3$ count the divisors of $n$ that are 1 and 3 modulo 4. For $n = 65$ the divisors are $1, 5, 13, 65$, all 1 modulo 4, so $r_2(65) = 4(4 - 0) = 16$.\n\nCheck: $65 = 1^{2} + 8^{2} = 4^{2} + 7^{2}$, and each gives 8 pairs by order and signs, so 16 in all.\n\n> **Watch out.** Divisors that are 3 modulo 4 are subtracted, and even divisors are ignored. The factor 4 counts the signs and swaps, so do not drop it.",
        "满足 $x^{2} + y^{2} = n$ 的整数对的个数（计顺序和符号）是 $r_2(n) = 4(d_1 - d_3)$，其中 $d_1$ 和 $d_3$ 分别数 $n$ 的模 4 余 1 和余 3 的除数。对 $n = 65$，除数是 $1, 5, 13, 65$，都模 4 余 1，所以 $r_2(65) = 4(4 - 0) = 16$。\n\n检验：$65 = 1^{2} + 8^{2} = 4^{2} + 7^{2}$，每种按顺序和符号给出 8 个对，共 16 个。\n\n> **注意。** 模 4 余 3 的除数要减去，偶数除数不计。因子 4 计的是符号和交换，不要丢掉。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(5, 500);
          const ds = divisors(n);
          const d1 = ds.filter((d) => d % 4 === 1);
          const d3 = ds.filter((d) => d % 4 === 3);
          const r = 4 * (d1.length - d3.length);
          if (r === 0) return undefined;
          const reps: string[] = [];
          for (let x = 0; 2 * x * x <= n; x++) {
            const y = Math.round(Math.sqrt(n - x * x));
            if (y * y === n - x * x) reps.push(`${x}^{2} + ${y}^{2}`);
          }
          return worked(
            [
              `How many integer pairs $(x, y)$, counting order and signs, satisfy $x^{2} + y^{2} = ${n}$?`,
              `有多少个整数对 $(x, y)$（计顺序和符号）满足 $x^{2} + y^{2} = ${n}$？`,
            ],
            r,
            [
              [d1.length - d3.length, "That forgets the factor 4 for the signs and the order.", "那忘了计符号和顺序的因子 4。"],
              [4 * d1.length, "That does not subtract the divisors that are 3 modulo 4.", "那没有减去模 4 余 3 的除数。"],
              [
                4 * ds.length,
                "That counts every divisor, but only odd divisors count, with signs.",
                "那数了每个除数，但只有奇数除数才计，而且带符号。",
              ],
            ],
            [
              [
                ["Sort the odd divisors", "给奇数除数分类"],
                [
                  `The divisors that are 1 modulo 4 are $${d1.join(", ")}$, and those that are 3 modulo 4 are ${d3.length ? `$${d3.join(", ")}$` : "none"}.`,
                  `模 4 余 1 的除数是 $${d1.join(", ")}$，模 4 余 3 的除数${d3.length ? `是 $${d3.join(", ")}$` : "没有"}。`,
                ],
              ],
              [
                ["Apply the formula", "代入公式"],
                [`$4(${d1.length} - ${d3.length}) = ${r}$.`, `$4(${d1.length} - ${d3.length}) = ${r}$。`],
              ],
            ],
            [
              `Listing directly, $${n} = ${reps.join(" = ")}$, and with all orders and signs these give ${r} pairs.`,
              `直接列出，$${n} = ${reps.join(" = ")}$，计入所有顺序和符号共得 ${r} 个对。`,
            ],
          );
        }),
    ),
    point(
      "primes-of-the-form-4k-plus-1",
      ["Primes of the form 4k + 1", "形如 4k + 1 的质数"],
      [
        "A prime $p \\equiv 1 \\pmod{4}$ is a sum of two squares in exactly one way, apart from order and signs. So $r_2(p) = 8$, while $r_2(q) = 0$ for a prime $q \\equiv 3 \\pmod{4}$. For example $29 = 5^{2} + 2^{2}$, and the pairs are $(\\pm 5, \\pm 2)$ and $(\\pm 2, \\pm 5)$, so $r_2(29) = 8$.\n\nCheck: the divisors 1 and 29 are both 1 modulo 4, so $4(2 - 0) = 8$.\n\n> **Watch out.** One way apart from order and signs still gives 8 pairs: 4 sign choices times 2 orders. Since $p$ is odd, its two squares differ, so the swap is new.",
        "质数 $p \\equiv 1 \\pmod{4}$ 除顺序和符号外，恰有一种方式写成两个平方数之和。所以 $r_2(p) = 8$，而对质数 $q \\equiv 3 \\pmod{4}$，$r_2(q) = 0$。例如 $29 = 5^{2} + 2^{2}$，整数对是 $(\\pm 5, \\pm 2)$ 和 $(\\pm 2, \\pm 5)$，所以 $r_2(29) = 8$。\n\n检验：除数 1 和 29 都模 4 余 1，所以 $4(2 - 0) = 8$。\n\n> **注意。** 除顺序和符号外只有一种方式，仍然给出 8 个对：4 种符号选择乘 2 种顺序。由于 $p$ 是奇数，它的两个平方数不同，所以交换得到新的对。",
      ],
      (rng) =>
        until(() => {
          const pool = primesUpTo(400).filter((v) => v % 2 === 1);
          const p = rng.pick(pool);
          const good = p % 4 === 1;
          let rep = "";
          for (let x = 1; good && 2 * x * x < p; x++) {
            const y = Math.round(Math.sqrt(p - x * x));
            if (y * y === p - x * x) rep = `${y}^{2} + ${x}^{2}`;
          }
          return worked(
            [
              `What is $r_2(${p})$, the number of integer pairs with $x^{2} + y^{2} = ${p}$?`,
              `$r_2(${p})$ 是多少，即满足 $x^{2} + y^{2} = ${p}$ 的整数对个数？`,
            ],
            good ? 8 : 0,
            good
              ? [
                  [
                    1,
                    "That counts the one way apart from order and signs, not the pairs.",
                    "那数的是除顺序和符号外的那一种方式，而不是整数对。",
                  ],
                  [
                    4,
                    "That counts the signs but forgets that swapping the two squares gives new pairs.",
                    "那计了符号，但忘了交换两个平方数会得到新的对。",
                  ],
                  [2, "That counts the two orders but forgets the signs.", "那计了两种顺序，但忘了符号。"],
                ]
              : [
                  [
                    8,
                    `That is the count for primes that are 1 modulo 4, but ${p} is 3 modulo 4.`,
                    `那是模 4 余 1 的质数的个数，但 ${p} 模 4 余 3。`,
                  ],
                  [4, `That supposes some representation exists, but ${p} is 3 modulo 4.`, `那假设存在某种表示，但 ${p} 模 4 余 3。`],
                ],
            [
              [
                ["Reduce modulo 4", "模 4 化简"],
                [`$${p} \\equiv ${p % 4} \\pmod{4}$.`, `$${p} \\equiv ${p % 4} \\pmod{4}$。`],
              ],
              good
                ? [
                    ["Count the pairs", "数整数对"],
                    [
                      `$${p} = ${rep}$ in exactly one way, and 4 sign choices times 2 orders give 8 pairs.`,
                      `$${p} = ${rep}$ 恰有一种方式，4 种符号选择乘 2 种顺序得 8 个对。`,
                    ],
                  ]
                : [
                    ["Rule it out", "排除"],
                    [
                      "Two squares add to 0, 1 or 2 modulo 4, never 3, so there are no pairs.",
                      "两个平方数相加模 4 得 0、1 或 2，永远不是 3，所以没有整数对。",
                    ],
                  ],
            ],
            good
              ? [
                  `The divisors 1 and ${p} are both 1 modulo 4, so $r_2(${p}) = 4(2 - 0) = 8$.`,
                  `除数 1 和 ${p} 都模 4 余 1，所以 $r_2(${p}) = 4(2 - 0) = 8$。`,
                ]
              : [
                  `The divisor 1 is 1 modulo 4 and the divisor ${p} is 3 modulo 4, so $r_2(${p}) = 4(1 - 1) = 0$.`,
                  `除数 1 模 4 余 1，除数 ${p} 模 4 余 3，所以 $r_2(${p}) = 4(1 - 1) = 0$。`,
                ],
          );
        }),
    ),
    point(
      "the-average-number-of-representations",
      ["The average number of representations", "表示数的平均值"],
      [
        "Adding $r_2(k)$ for $k$ from 1 to $n$ counts the nonzero lattice points in the disc of radius $\\sqrt{n}$. The disc has area $\\pi n$, so the average value of $r_2$ tends to $\\pi$, as Gauss noticed. For $n = 5$ the points are the 4 at distance 1, the 4 at $\\sqrt{2}$, the 4 at 2 and the 8 at $\\sqrt{5}$, which is 20, close to $5\\pi \\approx 15.7$.\n\nCheck: in the first quadrant with $x \\ge 1$ and $y \\ge 0$ the points are $(1, 0), (2, 0), (1, 1), (1, 2), (2, 1)$, and four quarter turns give $4 \\cdot 5 = 20$.\n\n> **Watch out.** Count the points inside the disc, not the whole square around it, and leave out only the origin. The count is close to $\\pi n$ but not equal to it.",
        "对 $k$ 从 1 到 $n$ 求 $r_2(k)$ 的和，就是数半径 $\\sqrt{n}$ 的圆内的非零格点。这个圆的面积是 $\\pi n$，所以 $r_2$ 的平均值趋于 $\\pi$，正如高斯所注意到的。对 $n = 5$，格点是距离 1 的 4 个、距离 $\\sqrt{2}$ 的 4 个、距离 2 的 4 个和距离 $\\sqrt{5}$ 的 8 个，共 20 个，接近 $5\\pi \\approx 15.7$。\n\n检验：在 $x \\ge 1$、$y \\ge 0$ 的第一象限部分，格点是 $(1, 0), (2, 0), (1, 1), (1, 2), (2, 1)$，转四个四分之一圈得 $4 \\cdot 5 = 20$。\n\n> **注意。** 要数圆内的点，而不是外面整个正方形里的点，只去掉原点。这个个数接近 $\\pi n$，但不等于它。",
      ],
      (rng) =>
        until(() => {
          const r = rng.int(2, 7);
          const n = r * r + rng.int(0, 2 * r);
          const m = Math.floor(Math.sqrt(n));
          const columns: number[] = [];
          let quarter = 0;
          for (let x = 1; x <= m; x++) {
            const c = Math.floor(Math.sqrt(n - x * x)) + 1;
            columns.push(c);
            quarter += c;
          }
          const count = 4 * quarter;
          const rs: number[] = [];
          for (let k = 1; k <= n; k++) {
            let c = 0;
            for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) if (x * x + y * y === k) c += 1;
            rs.push(c);
          }
          return worked(
            [
              `How many nonzero lattice points $(x, y)$ satisfy $x^{2} + y^{2} \\le ${n}$?`,
              `有多少个非零格点 $(x, y)$ 满足 $x^{2} + y^{2} \\le ${n}$？`,
            ],
            count,
            [
              [
                (2 * m + 1) ** 2 - 1,
                `That counts the whole square with $|x|, |y| \\le ${m}$, including its corners outside the disc.`,
                `那数了 $|x|, |y| \\le ${m}$ 的整个正方形，包括圆外的角。`,
              ],
              [
                Math.round(Math.PI * n),
                `That is the area $${n}\\pi$, which is only close to the count.`,
                `那是面积 $${n}\\pi$，它只是接近这个个数。`,
              ],
              [count + 1, "That includes the origin, which is not a nonzero point.", "那把原点也算进去了，它不是非零点。"],
            ],
            [
              [
                ["Count one quarter", "数四分之一"],
                [
                  `For $x = 1, \\ldots, ${m}$ and $y \\ge 0$, the columns hold $${columns.join(" + ")} = ${quarter}$ points.`,
                  `对 $x = 1, \\ldots, ${m}$ 且 $y \\ge 0$，各列分别有 $${columns.join(" + ")} = ${quarter}$ 个点。`,
                ],
              ],
              [
                ["Turn it four times", "转四次"],
                [
                  `Quarter turns about the origin cover every nonzero point once, so $4 \\cdot ${quarter} = ${count}$.`,
                  `绕原点转四分之一圈，每个非零点恰被覆盖一次，所以 $4 \\cdot ${quarter} = ${count}$。`,
                ],
              ],
            ],
            [
              `Adding the nonzero values of $r_2(k)$ for $k = 1, \\ldots, ${n}$ gives $${rs.filter((c) => c > 0).join(" + ")} = ${count}$, close to $${n}\\pi \\approx ${(n * Math.PI).toFixed(1)}$.`,
              `把 $k = 1, \\ldots, ${n}$ 的非零 $r_2(k)$ 相加得 $${rs.filter((c) => c > 0).join(" + ")} = ${count}$，接近 $${n}\\pi \\approx ${(n * Math.PI).toFixed(1)}$。`,
            ],
          );
        }),
    ),
  ],
);

/** muOf counts the multiples a, 2a, ..., (p - 1)/2 a whose residue modulo p lies above p / 2. */
const muOf = (a: number, p: number): { mu: number; residues: number[] } => {
  const residues = Array.from({ length: (p - 1) / 2 }, (_, k) => ((k + 1) * a) % p);
  return { mu: residues.filter((r) => r > p / 2).length, residues };
};

const gaussLemma = topic(
  "gausss-lemma",
  ["Gauss's Lemma", "高斯引理"],
  ["Compute the Legendre symbol by counting residues in the upper half.", "通过数上半部分的剩余来计算勒让德符号。"],
  ["the-legendre-symbol"],
  [],
  [
    point(
      "counting-the-large-residues",
      ["Counting the large residues", "数大剩余"],
      [
        "Take the multiples $a, 2a, \\ldots, \\frac{p - 1}{2}a$ modulo $p$. Gauss's lemma says that the symbol $\\left(\\frac{a}{p}\\right)$ is $(-1)^{\\mu}$, where $\\mu$ counts the residues above $\\frac{p}{2}$. For $p = 11$ and $a = 3$ the multiples $3, 6, 9, 12, 15$ leave $3, 6, 9, 1, 4$, and two of these, 6 and 9, lie above 5.5, so $\\mu = 2$.\n\nCheck: $3^{5} = 243 = 22 \\cdot 11 + 1$, so by Euler's criterion the symbol is $1 = (-1)^{2}$.\n\n> **Watch out.** Reduce each multiple modulo $p$ before comparing, and compare with $\\frac{p}{2}$; the count of small residues is $\\frac{p - 1}{2} - \\mu$, a different number.",
        "取倍数 $a, 2a, \\ldots, \\frac{p - 1}{2}a$ 模 $p$。高斯引理说，符号 $\\left(\\frac{a}{p}\\right)$ 是 $(-1)^{\\mu}$，其中 $\\mu$ 数大于 $\\frac{p}{2}$ 的剩余。对 $p = 11$，$a = 3$，倍数 $3, 6, 9, 12, 15$ 的剩余是 $3, 6, 9, 1, 4$，其中 6 和 9 两个大于 5.5，所以 $\\mu = 2$。\n\n检验：$3^{5} = 243 = 22 \\cdot 11 + 1$，所以由欧拉判别法，符号是 $1 = (-1)^{2}$。\n\n> **注意。** 比较之前要把每个倍数模 $p$ 化简，并与 $\\frac{p}{2}$ 比较；小剩余的个数是 $\\frac{p - 1}{2} - \\mu$，是另一个数。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(oddPrimes.filter((v) => v >= 11));
          const a = rng.int(2, p - 1);
          const { mu, residues } = muOf(a, p);
          const h = (p - 1) / 2;
          const unreduced = Array.from({ length: h }, (_, k) => (k + 1) * a).filter((v) => v > p / 2).length;
          const e = powMod(a, h, p);
          return worked(
            [
              `For $p = ${p}$ and $a = ${a}$, how many of $a, 2a, \\ldots, ${h}a$ have a residue above $\\frac{${p}}{2}$?`,
              `对 $p = ${p}$，$a = ${a}$，$a, 2a, \\ldots, ${h}a$ 中有多少个的剩余大于 $\\frac{${p}}{2}$？`,
            ],
            mu,
            [
              [h - mu, "That counts the residues below half instead of above.", "那数的是小于一半的剩余，而不是大于一半的。"],
              [h, `That counts all ${h} multiples.`, `那数了全部 ${h} 个倍数。`],
              [unreduced, `That compares the multiples before reducing them modulo ${p}.`, `那是在模 ${p} 化简之前就比较了倍数。`],
            ],
            [
              [
                [`Reduce the multiples modulo ${p}`, `把倍数模 ${p} 化简`],
                [
                  `The residues of $${a}, ${2 * a}, \\ldots, ${h * a}$ are $${residues.join(", ")}$.`,
                  `$${a}, ${2 * a}, \\ldots, ${h * a}$ 的剩余是 $${residues.join(", ")}$。`,
                ],
              ],
              [
                ["Count those above half", "数大于一半的"],
                [
                  `Above $\\frac{${p}}{2}$ means at least ${h + 1}, and ${mu} of the residues are.`,
                  `大于 $\\frac{${p}}{2}$ 即至少是 ${h + 1}，有 ${mu} 个剩余是这样。`,
                ],
              ],
            ],
            [
              `Euler's criterion gives $${a}^{${h}} \\equiv ${e === 1 ? "1" : "-1"} \\pmod{${p}}$, matching $${pw("(-1)", mu)} = ${mu % 2 === 0 ? "1" : "-1"}$.`,
              `欧拉判别法给出 $${a}^{${h}} \\equiv ${e === 1 ? "1" : "-1"} \\pmod{${p}}$，与 $${pw("(-1)", mu)} = ${mu % 2 === 0 ? "1" : "-1"}$ 一致。`,
            ],
          );
        }),
    ),
    point(
      "the-symbol-from-the-count",
      ["The symbol from the count", "由个数得符号"],
      [
        "Pairing each large residue with its negative turns the product of the multiples into a sign times $\\left(\\frac{p - 1}{2}\\right)!$. Comparing with Euler's criterion gives the symbol as $(-1)^{\\mu}$. For $p = 13$ and $a = 5$, the residues of $5, 10, \\ldots, 30$ are $5, 10, 2, 7, 12, 4$, and three of them, 10, 7 and 12, exceed 6.5, so $\\left(\\frac{5}{13}\\right) = (-1)^{3} = -1$.\n\nCheck: $5^{2} = 25 \\equiv -1$, so $5^{6} \\equiv (-1)^{3} = -1 \\pmod{13}$, as Euler's criterion requires.\n\n> **Watch out.** Only the parity of $\\mu$ matters, and the symbol is $1$ or $-1$, never $\\mu$ itself and never 0 when $p$ does not divide $a$.",
        "把每个大剩余与它的负数配对，倍数之积就变成一个符号乘 $\\left(\\frac{p - 1}{2}\\right)!$。与欧拉判别法比较，得符号是 $(-1)^{\\mu}$。对 $p = 13$，$a = 5$，$5, 10, \\ldots, 30$ 的剩余是 $5, 10, 2, 7, 12, 4$，其中 10、7、12 三个大于 6.5，所以 $\\left(\\frac{5}{13}\\right) = (-1)^{3} = -1$。\n\n检验：$5^{2} = 25 \\equiv -1$，所以 $5^{6} \\equiv (-1)^{3} = -1 \\pmod{13}$，符合欧拉判别法。\n\n> **注意。** 只有 $\\mu$ 的奇偶性有用，符号是 $1$ 或 $-1$，绝不是 $\\mu$ 本身；当 $p$ 不整除 $a$ 时也绝不是 0。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(oddPrimes.filter((v) => v >= 11));
          const a = rng.int(2, p - 1);
          const { mu, residues } = muOf(a, p);
          const h = (p - 1) / 2;
          const v = mu % 2 === 0 ? 1 : -1;
          const e = powMod(a, h, p);
          return worked(
            [
              `What is $\\left(\\frac{${a}}{${p}}\\right)$, using Gauss's lemma?`,
              `用高斯引理，$\\left(\\frac{${a}}{${p}}\\right)$ 是多少？`,
            ],
            v,
            [
              [
                -v,
                "That flips the sign; an even count gives 1 and an odd count gives $-1$.",
                "那把符号弄反了；偶数个得 1，奇数个得 $-1$。",
              ],
              [
                0,
                `The symbol is 0 only when ${p} divides the top, and it does not divide ${a}.`,
                `只有 ${p} 整除分子时符号才是 0，而它不整除 ${a}。`,
              ],
              [mu, "That gives the count itself; the symbol is $(-1)$ raised to it.", "那给出了个数本身；符号是 $(-1)$ 的这个次幂。"],
            ],
            [
              [
                ["Reduce the multiples", "化简倍数"],
                [
                  `The residues of $${a}, ${2 * a}, \\ldots, ${h * a}$ are $${residues.join(", ")}$.`,
                  `$${a}, ${2 * a}, \\ldots, ${h * a}$ 的剩余是 $${residues.join(", ")}$。`,
                ],
              ],
              [
                ["Count and take the sign", "计数并取符号"],
                [
                  `${mu} of them exceed $\\frac{${p}}{2}$, so the symbol is $${pw("(-1)", mu)} = ${v}$.`,
                  `其中 ${mu} 个大于 $\\frac{${p}}{2}$，所以符号是 $${pw("(-1)", mu)} = ${v}$。`,
                ],
              ],
            ],
            [
              `Euler's criterion: $${a}^{${h}} \\equiv ${e === 1 ? "1" : "-1"} \\pmod{${p}}$, the same sign.`,
              `欧拉判别法：$${a}^{${h}} \\equiv ${e === 1 ? "1" : "-1"} \\pmod{${p}}$，符号相同。`,
            ],
          );
        }),
    ),
    point(
      "the-symbol-of-two",
      ["The symbol of two", "二的符号"],
      [
        "Applying the lemma to $a = 2$ gives a formula that depends only on $p$ modulo 8. The multiples $2, 4, \\ldots, p - 1$ need no reducing, and those above $\\frac{p}{2}$ number $\\mu = \\frac{p - 1}{2} - \\left\\lfloor\\frac{p}{4}\\right\\rfloor$. So $\\left(\\frac{2}{p}\\right)$ is 1 when $p \\equiv \\pm 1 \\pmod{8}$, and $-1$ when $p \\equiv \\pm 3 \\pmod{8}$. For $p = 17 \\equiv 1$, the symbol is 1.\n\nCheck: $\\mu = 8 - 4 = 4$ is even, and indeed $6^{2} = 36 \\equiv 2 \\pmod{17}$.\n\n> **Watch out.** The rule looks at $p$ modulo 8, not modulo 4: $p = 17$ and $p = 5$ are both 1 modulo 4, yet $\\left(\\frac{2}{5}\\right) = -1$.",
        "对 $a = 2$ 应用引理，得到只依赖 $p$ 模 8 的公式。倍数 $2, 4, \\ldots, p - 1$ 不必化简，其中大于 $\\frac{p}{2}$ 的个数是 $\\mu = \\frac{p - 1}{2} - \\left\\lfloor\\frac{p}{4}\\right\\rfloor$。所以当 $p \\equiv \\pm 1 \\pmod{8}$ 时 $\\left(\\frac{2}{p}\\right)$ 是 1，当 $p \\equiv \\pm 3 \\pmod{8}$ 时是 $-1$。对 $p = 17 \\equiv 1$，符号是 1。\n\n检验：$\\mu = 8 - 4 = 4$ 是偶数，而确实 $6^{2} = 36 \\equiv 2 \\pmod{17}$。\n\n> **注意。** 这个规则看的是 $p$ 模 8，而不是模 4：$p = 17$ 和 $p = 5$ 都模 4 余 1，但 $\\left(\\frac{2}{5}\\right) = -1$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(primesUpTo(600).filter((v) => v > 2));
          const r = p % 8;
          const v = r === 1 || r === 7 ? 1 : -1;
          const h = (p - 1) / 2;
          const mu = h - Math.floor(p / 4);
          const mod4 = p % 4 === 1 ? 1 : -1;
          return worked(
            [`What is $\\left(\\frac{2}{${p}}\\right)$?`, `$\\left(\\frac{2}{${p}}\\right)$ 是多少？`],
            v,
            [
              [-v, `That flips the sign; ${p} is ${r} modulo 8.`, `那把符号弄反了；${p} 模 8 余 ${r}。`],
              [0, `The symbol is 0 only when ${p} divides 2.`, `只有 ${p} 整除 2 时符号才是 0。`],
              [
                mod4,
                "That uses the rule for $-1$, which depends on $p$ modulo 4, not the rule for 2.",
                "那用的是 $-1$ 的规则，它依赖 $p$ 模 4，而不是 2 的规则。",
              ],
            ],
            [
              [
                ["Reduce modulo 8", "模 8 化简"],
                [`$${p} \\equiv ${r} \\pmod{8}$.`, `$${p} \\equiv ${r} \\pmod{8}$。`],
              ],
              [
                ["Apply the rule", "应用规则"],
                [
                  `${r} is ${v === 1 ? "" : "not "}$\\pm 1$ modulo 8, so the symbol is $${v}$.`,
                  `${r} 模 8 ${v === 1 ? "是" : "不是"} $\\pm 1$，所以符号是 $${v}$。`,
                ],
              ],
            ],
            [
              `By Gauss's lemma, $\\mu = ${h} - \\left\\lfloor\\frac{${p}}{4}\\right\\rfloor = ${h} - ${Math.floor(p / 4)} = ${mu}$, and $${pw("(-1)", mu)} = ${v}$.`,
              `由高斯引理，$\\mu = ${h} - \\left\\lfloor\\frac{${p}}{4}\\right\\rfloor = ${h} - ${Math.floor(p / 4)} = ${mu}$，而 $${pw("(-1)", mu)} = ${v}$。`,
            ],
          );
        }),
    ),
  ],
);

const quadraticForms = topic(
  "binary-quadratic-forms",
  ["Binary Quadratic Forms", "二元二次型"],
  [
    "Compute discriminants, recognize equivalent forms, and see which numbers a form represents.",
    "计算判别式，识别等价的型，并看一个型表示哪些数。",
  ],
  ["sums-of-two-squares"],
  [],
  [
    point(
      "the-discriminant",
      ["The discriminant", "判别式"],
      [
        "A form $ax^{2} + bxy + cy^{2}$ has discriminant $D = b^{2} - 4ac$. An integer change of variables with determinant $\\pm 1$ does not change it, so the discriminant is the basic invariant of a family of equivalent forms. For $2x^{2} + 3xy + 4y^{2}$: $D = 3^{2} - 4 \\cdot 2 \\cdot 4 = 9 - 32 = -23$.\n\nCheck: the matrix $\\begin{pmatrix} 4 & 3 \\\\ 3 & 8 \\end{pmatrix}$, with entries $2a, b, b, 2c$, has determinant $32 - 9 = 23$, and $D$ is its negative.\n\n> **Watch out.** It is $b^{2}$ minus $4ac$, in that order. A form whose values are all positive has a negative discriminant, so a negative $D$ is normal here.",
        "型 $ax^{2} + bxy + cy^{2}$ 的判别式是 $D = b^{2} - 4ac$。行列式为 $\\pm 1$ 的整数变量替换不改变它，所以判别式是等价型族的基本不变量。对 $2x^{2} + 3xy + 4y^{2}$：$D = 3^{2} - 4 \\cdot 2 \\cdot 4 = 9 - 32 = -23$。\n\n检验：矩阵 $\\begin{pmatrix} 4 & 3 \\\\ 3 & 8 \\end{pmatrix}$ 的元素是 $2a, b, b, 2c$，行列式是 $32 - 9 = 23$，而 $D$ 是它的相反数。\n\n> **注意。** 是 $b^{2}$ 减 $4ac$，顺序不能反。值全为正的型判别式是负的，所以这里 $D$ 为负很正常。",
      ],
      (rng) =>
        until(() => {
          const [a, b, c] = [rng.int(2, 15), rng.int(1, 15), rng.int(1, 15)];
          const D = b * b - 4 * a * c;
          const det = 4 * a * c - b * b;
          return worked(
            [
              `What is the discriminant of $${a}x^{2} + ${b === 1 ? "" : b}xy + ${c === 1 ? "" : c}y^{2}$?`,
              `$${a}x^{2} + ${b === 1 ? "" : b}xy + ${c === 1 ? "" : c}y^{2}$ 的判别式是多少？`,
            ],
            D,
            [
              [b * b + 4 * a * c, "That adds $4ac$; the discriminant subtracts it.", "那加上了 $4ac$；判别式是减去它。"],
              [det, "That subtracts in the wrong order, $4ac - b^{2}$.", "那减反了顺序，算成了 $4ac - b^{2}$。"],
              [b * b - a * c, "That leaves out the factor 4 in $4ac$.", "那漏掉了 $4ac$ 中的因子 4。"],
            ],
            [
              [
                ["Read the coefficients", "读出系数"],
                [`$a = ${a}$, $b = ${b}$, $c = ${c}$.`, `$a = ${a}$，$b = ${b}$，$c = ${c}$。`],
              ],
              [
                ["Compute $b^{2} - 4ac$", "计算 $b^{2} - 4ac$"],
                [
                  `$${b}^{2} - 4 \\cdot ${a} \\cdot ${c} = ${b * b} - ${4 * a * c} = ${D}$.`,
                  `$${b}^{2} - 4 \\cdot ${a} \\cdot ${c} = ${b * b} - ${4 * a * c} = ${D}$。`,
                ],
              ],
            ],
            [
              `The matrix $\\begin{pmatrix} ${2 * a} & ${b} \\\\ ${b} & ${2 * c} \\end{pmatrix}$ has determinant $${4 * a * c} - ${b * b} = ${det}$, and $D$ is its negative, $${D}$.`,
              `矩阵 $\\begin{pmatrix} ${2 * a} & ${b} \\\\ ${b} & ${2 * c} \\end{pmatrix}$ 的行列式是 $${4 * a * c} - ${b * b} = ${det}$，而 $D$ 是它的相反数 $${D}$。`,
            ],
          );
        }),
    ),
    point(
      "a-change-of-variables",
      ["A change of variables", "变量替换"],
      [
        "Replacing $x$ by $x + sy$ leaves $a$ unchanged, changes $b$ to $b + 2as$, and changes $c$ to $as^{2} + bs + c$, the value of the form at $(s, 1)$. Equivalent forms represent exactly the same numbers, so we can choose $s$ to make $b$ small, which is the first step of reduction. In $2x^{2} + 3xy + 4y^{2}$ with $s = 2$: $b$ becomes $3 + 8 = 11$ and $c$ becomes $8 + 6 + 4 = 18$.\n\nCheck: the discriminant is unchanged, since $11^{2} - 4 \\cdot 2 \\cdot 18 = 121 - 144 = -23 = 3^{2} - 4 \\cdot 2 \\cdot 4$.\n\n> **Watch out.** The new $c$ collects three terms: $as^{2}$ from $a(x + sy)^{2}$, $bs$ from $b(x + sy)y$, and the old $c$. Do not forget to square $s$.",
        "把 $x$ 换成 $x + sy$，$a$ 不变，$b$ 变成 $b + 2as$，$c$ 变成 $as^{2} + bs + c$，即型在 $(s, 1)$ 处的值。等价的型表示完全相同的数，所以可以选 $s$ 使 $b$ 变小，这是约化的第一步。在 $2x^{2} + 3xy + 4y^{2}$ 中取 $s = 2$：$b$ 变成 $3 + 8 = 11$，$c$ 变成 $8 + 6 + 4 = 18$。\n\n检验：判别式不变，因为 $11^{2} - 4 \\cdot 2 \\cdot 18 = 121 - 144 = -23 = 3^{2} - 4 \\cdot 2 \\cdot 4$。\n\n> **注意。** 新的 $c$ 收集三项：$a(x + sy)^{2}$ 中的 $as^{2}$、$b(x + sy)y$ 中的 $bs$ 和原来的 $c$。不要忘了把 $s$ 平方。",
      ],
      (rng) =>
        until(() => {
          const [a, b, c] = [rng.int(2, 12), rng.int(1, 15), rng.int(1, 15)];
          const s = rng.int(2, 7);
          const c2 = a * s * s + b * s + c;
          const b2 = b + 2 * a * s;
          return worked(
            [
              `In $${a}x^{2} + ${b === 1 ? "" : b}xy + ${c === 1 ? "" : c}y^{2}$, replace $x$ by $x + ${s}y$. What is the new coefficient of $y^{2}$?`,
              `在 $${a}x^{2} + ${b === 1 ? "" : b}xy + ${c === 1 ? "" : c}y^{2}$ 中，把 $x$ 换成 $x + ${s}y$。$y^{2}$ 的新系数是多少？`,
            ],
            c2,
            [
              [
                c,
                "That keeps the old coefficient, but the substitution adds $y^{2}$ terms.",
                "那保留了原来的系数，但替换会产生新的 $y^{2}$ 项。",
              ],
              [a * s + b * s + c, `That forgets to square ${s} in $a(x + ${s}y)^{2}$.`, `那忘了把 $a(x + ${s}y)^{2}$ 中的 ${s} 平方。`],
              [
                a * s * s + c,
                `That misses the term $${b} \\cdot ${s}$ coming from the $xy$ term.`,
                `那漏掉了来自 $xy$ 项的 $${b} \\cdot ${s}$。`,
              ],
            ],
            [
              [
                ["Expand each term", "展开每一项"],
                [
                  `$${a}(x + ${s}y)^{2}$ gives $${a * s * s}y^{2}$, and $${b}(x + ${s}y)y$ gives $${b * s}y^{2}$.`,
                  `$${a}(x + ${s}y)^{2}$ 给出 $${a * s * s}y^{2}$，$${b}(x + ${s}y)y$ 给出 $${b * s}y^{2}$。`,
                ],
              ],
              [
                ["Collect", "合并"],
                [`$${a * s * s} + ${b * s} + ${c} = ${c2}$.`, `$${a * s * s} + ${b * s} + ${c} = ${c2}$。`],
              ],
            ],
            [
              `With the new middle coefficient $${b} + 2 \\cdot ${a} \\cdot ${s} = ${b2}$, the discriminant $${b2}^{2} - 4 \\cdot ${a} \\cdot ${c2} = ${b2 * b2 - 4 * a * c2}$ equals the old one, $${b}^{2} - 4 \\cdot ${a} \\cdot ${c} = ${b * b - 4 * a * c}$.`,
              `新的中间系数是 $${b} + 2 \\cdot ${a} \\cdot ${s} = ${b2}$，判别式 $${b2}^{2} - 4 \\cdot ${a} \\cdot ${c2} = ${b2 * b2 - 4 * a * c2}$ 等于原来的 $${b}^{2} - 4 \\cdot ${a} \\cdot ${c} = ${b * b - 4 * a * c}$。`,
            ],
          );
        }),
    ),
    point(
      "which-primes-are-represented",
      ["Which primes are represented", "哪些质数被表示"],
      [
        "A prime not dividing the discriminant $D$ is represented by some form of that discriminant exactly when $D$ is a square modulo the prime. When the discriminant has only one class of forms, as for $x^{2} + y^{2}$, $x^{2} + 2y^{2}$ and $x^{2} + 3y^{2}$, this decides the primes by a congruence. For $x^{2} + 2y^{2}$, with $D = -8$, the primes are those that are 1 or 3 modulo 8; for example $11 = 3^{2} + 2 \\cdot 1^{2}$.\n\nCheck: $-8 \\equiv 3 \\pmod{11}$, and $5^{2} = 25 \\equiv 3$, so $D$ is a square modulo 11.\n\n> **Watch out.** Since $x$ and $y$ appear only squared, their signs never matter. And $y = 0$ would make the prime a perfect square, so both variables are nonzero.",
        "不整除判别式 $D$ 的质数，被该判别式的某个型表示，当且仅当 $D$ 模这个质数是平方数。当判别式只有一类型时，例如 $x^{2} + y^{2}$、$x^{2} + 2y^{2}$ 和 $x^{2} + 3y^{2}$，这就用一个同余条件决定了质数。对 $x^{2} + 2y^{2}$，$D = -8$，被表示的质数是模 8 余 1 或 3 的质数；例如 $11 = 3^{2} + 2 \\cdot 1^{2}$。\n\n检验：$-8 \\equiv 3 \\pmod{11}$，而 $5^{2} = 25 \\equiv 3$，所以 $D$ 模 11 是平方数。\n\n> **注意。** 因为 $x$ 和 $y$ 只以平方出现，它们的符号无关紧要。而 $y = 0$ 会使这个质数是完全平方数，所以两个变量都不为零。",
      ],
      (rng) => {
        const k = rng.pick([1, 2, 3]);
        const pool = primesUpTo(300).filter((v) => v > 3);
        const p = rng.pick(pool);
        let rep: [number, number] | undefined;
        for (let y = 1; k * y * y < p; y++) {
          const x = Math.round(Math.sqrt(p - k * y * y));
          if (x * x + k * y * y === p) rep = [x, y];
        }
        const found = rep !== undefined;
        const form = k === 1 ? "x^{2} + y^{2}" : `x^{2} + ${k}y^{2}`;
        const yes: Pair = ["Yes, it is represented", "是，它被表示"];
        const no: Pair = ["No, it is not represented", "不，它不被表示"];
        const m = k === 1 ? 4 : k === 2 ? 8 : 3;
        const rule = k === 1 ? "1 modulo 4" : k === 2 ? "1 or 3 modulo 8" : "1 modulo 3";
        const ruleZh = k === 1 ? "模 4 余 1" : k === 2 ? "模 8 余 1 或 3" : "模 3 余 1";
        const top = Math.floor(Math.sqrt(p / k));
        const ky = (y: number) => (k === 1 ? `${y}^{2}` : `${k} \\cdot ${y}^{2}`);
        return chosen(
          rng,
          [`Is the prime ${p} represented by the form $${form}$?`, `质数 ${p} 被型 $${form}$ 表示吗？`],
          found ? yes : no,
          [
            [
              found ? no : yes,
              `${p} is ${p % m} modulo ${m}, and the primes this form represents are exactly those that are ${rule}.`,
              `${p} 模 ${m} 余 ${p % m}，而这个型表示的质数恰好是${ruleZh}的质数。`,
            ],
            [
              ["Only with a negative $x$", "只在 $x$ 为负时"],
              "$x$ appears only squared, so its sign cannot matter.",
              "$x$ 只以平方出现，所以它的符号无关紧要。",
            ],
            [
              ["Only when $y$ is zero", "只在 $y$ 为零时"],
              `With $y = 0$ the form gives $x^{2}$, a perfect square, and ${p} is not one.`,
              `当 $y = 0$ 时型给出 $x^{2}$，是完全平方数，而 ${p} 不是。`,
            ],
          ],
          [
            [
              ["Recall the rule", "回忆规则"],
              [
                `The discriminant has one class of forms, so $${form}$ represents exactly the primes that are ${rule}.`,
                `这个判别式只有一类型，所以 $${form}$ 恰好表示${ruleZh}的质数。`,
              ],
            ],
            [
              [`Reduce modulo ${m}`, `模 ${m} 化简`],
              [
                `$${p} \\equiv ${p % m} \\pmod{${m}}$, so it ${found ? "is" : "is not"} represented.`,
                `$${p} \\equiv ${p % m} \\pmod{${m}}$，所以它${found ? "被" : "不被"}表示。`,
              ],
            ],
          ],
          rep
            ? [`Directly, $${p} = ${rep[0]}^{2} + ${ky(rep[1])}$.`, `直接验证：$${p} = ${rep[0]}^{2} + ${ky(rep[1])}$。`]
            : [
                `Directly, for $y = 1, \\ldots, ${top}$ the number $${p} - ${k === 1 ? "" : k}y^{2}$ is never a perfect square, and $y = 0$ leaves ${p}, which is not a square either.`,
                `直接验证：对 $y = 1, \\ldots, ${top}$，$${p} - ${k === 1 ? "" : k}y^{2}$ 都不是完全平方数，而 $y = 0$ 剩下 ${p}，也不是平方数。`,
              ],
        );
      },
    ),
  ],
);

const periodicCf = topic(
  "periodic-continued-fractions",
  ["Periodic Continued Fractions", "周期连分数"],
  ["Connect repeating continued fractions to quadratic irrationals.", "把循环连分数与二次无理数联系起来。"],
  ["continued-fractions"],
  [],
  [
    point(
      "the-value-of-a-repeating-fraction",
      ["The value of a repeating fraction", "循环连分数的值"],
      [
        "If $x = a + \\frac{1}{x}$, then $x$ solves $x^{2} - ax - 1 = 0$. So the purely periodic fraction with the single repeating term $a$ equals the positive root $\\frac{a + \\sqrt{a^{2} + 4}}{2}$, a quadratic irrational. With every term 1 this gives the golden ratio $\\frac{1 + \\sqrt{5}}{2} \\approx 1.618$.\n\nCheck: $1 + \\frac{1}{1.618} \\approx 1 + 0.618 = 1.618$, so the value reproduces itself.\n\n> **Watch out.** The discriminant of $x^{2} - ax - 1$ is $a^{2} + 4$, not $a^{2} + 1$. Take the positive root, since every term is positive, and keep the division by 2.",
        "如果 $x = a + \\frac{1}{x}$，那么 $x$ 满足 $x^{2} - ax - 1 = 0$。所以只有单个循环项 $a$ 的纯周期连分数等于正根 $\\frac{a + \\sqrt{a^{2} + 4}}{2}$，是二次无理数。每一项都是 1 时，这给出黄金比 $\\frac{1 + \\sqrt{5}}{2} \\approx 1.618$。\n\n检验：$1 + \\frac{1}{1.618} \\approx 1 + 0.618 = 1.618$，所以这个值再现了自己。\n\n> **注意。** $x^{2} - ax - 1$ 的判别式是 $a^{2} + 4$，不是 $a^{2} + 1$。因为每一项都是正的，要取正根，并且别忘了除以 2。",
      ],
      (rng) => {
        const a = rng.int(1, 40);
        const d = a * a + 4;
        const v = (a + Math.sqrt(d)) / 2;
        return chosen(
          rng,
          [`What is the value of the continued fraction with every term equal to ${a}?`, `每一项都等于 ${a} 的连分数的值是多少？`],
          same(`\\frac{${a} + \\sqrt{${d}}}{2}`),
          [
            [
              same(`\\frac{${a} + \\sqrt{${a * a + 1}}}{2}`),
              `That uses $${a}^{2} + 1$ under the root; the discriminant of $x^{2} - ${a}x - 1$ is $${a}^{2} + 4 = ${d}$.`,
              `那在根号下用了 $${a}^{2} + 1$；$x^{2} - ${a}x - 1$ 的判别式是 $${a}^{2} + 4 = ${d}$。`,
            ],
            [
              same(`\\frac{${a} - \\sqrt{${d}}}{2}`),
              "That is the negative root, but a fraction with positive terms is positive.",
              "那是负根，但各项为正的连分数是正的。",
            ],
            [same(`${a} + \\sqrt{${d}}`), "That forgets to divide by 2 in the quadratic formula.", "那忘了在求根公式中除以 2。"],
          ],
          [
            [
              ["Use the repetition", "利用循环"],
              [
                `The tail after the first term is the whole fraction again, so $x = ${a} + \\frac{1}{x}$, that is $x^{2} - ${a}x - 1 = 0$.`,
                `第一项之后的尾部又是整个连分数，所以 $x = ${a} + \\frac{1}{x}$，即 $x^{2} - ${a}x - 1 = 0$。`,
              ],
            ],
            [
              ["Solve and take the positive root", "求解并取正根"],
              [
                `$x = \\frac{${a} \\pm \\sqrt{${a * a} + 4}}{2}$, and the positive root is $\\frac{${a} + \\sqrt{${d}}}{2}$.`,
                `$x = \\frac{${a} \\pm \\sqrt{${a * a} + 4}}{2}$，正根是 $\\frac{${a} + \\sqrt{${d}}}{2}$。`,
              ],
            ],
          ],
          [
            `Numerically $\\frac{${a} + \\sqrt{${d}}}{2} \\approx ${v.toFixed(4)}$, and $${a} + \\frac{1}{${v.toFixed(4)}} \\approx ${(a + 1 / v).toFixed(4)}$, the same value.`,
            `数值上 $\\frac{${a} + \\sqrt{${d}}}{2} \\approx ${v.toFixed(4)}$，而 $${a} + \\frac{1}{${v.toFixed(4)}} \\approx ${(a + 1 / v).toFixed(4)}$，是同一个值。`,
          ],
        );
      },
    ),
    point(
      "the-expansion-of-a-square-root",
      ["The expansion of a square root", "平方根的展开"],
      [
        "Lagrange's theorem says that the continued fraction of a quadratic irrational is eventually periodic. For $\\sqrt{a^{2} + 1}$ the first term is $a$, and $\\frac{1}{\\sqrt{a^{2} + 1} - a} = \\sqrt{a^{2} + 1} + a$, whose whole part is $2a$ and whose remainder is $\\sqrt{a^{2} + 1} - a$ again. So the expansion is $[a; \\overline{2a}]$; for instance $\\sqrt{10} = [3; \\overline{6}]$.\n\nCheck: $3 + \\frac{1}{6} = \\frac{19}{6}$, and $\\left(\\frac{19}{6}\\right)^{2} = \\frac{361}{36} = 10 + \\frac{1}{36}$, very close to 10.\n\n> **Watch out.** The repeating term is $2a$, not the first term $a$. It comes from $\\sqrt{a^{2} + 1} + a$, which lies between $2a$ and $2a + 1$.",
        "拉格朗日定理说，二次无理数的连分数最终是周期的。对 $\\sqrt{a^{2} + 1}$，第一项是 $a$，而 $\\frac{1}{\\sqrt{a^{2} + 1} - a} = \\sqrt{a^{2} + 1} + a$，它的整数部分是 $2a$，余下的又是 $\\sqrt{a^{2} + 1} - a$。所以展开是 $[a; \\overline{2a}]$；例如 $\\sqrt{10} = [3; \\overline{6}]$。\n\n检验：$3 + \\frac{1}{6} = \\frac{19}{6}$，而 $\\left(\\frac{19}{6}\\right)^{2} = \\frac{361}{36} = 10 + \\frac{1}{36}$，非常接近 10。\n\n> **注意。** 循环项是 $2a$，不是第一项 $a$。它来自 $\\sqrt{a^{2} + 1} + a$，这个数在 $2a$ 和 $2a + 1$ 之间。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 60);
          const n = a * a + 1;
          return worked(
            [`What term repeats in the continued fraction of $\\sqrt{${n}}$?`, `$\\sqrt{${n}}$ 的连分数中循环的项是什么？`],
            2 * a,
            [
              [a, "That is the first term, which does not repeat.", "那是第一项，它不循环。"],
              [
                2 * a + 1,
                `That rounds $\\sqrt{${n}} + ${a}$ up; its whole part is ${2 * a}.`,
                `那把 $\\sqrt{${n}} + ${a}$ 向上取整了；它的整数部分是 ${2 * a}。`,
              ],
              [
                a + 1,
                `That rounds $\\sqrt{${n}}$ up instead of finding the next term.`,
                `那把 $\\sqrt{${n}}$ 向上取整了，而不是求下一项。`,
              ],
            ],
            [
              [
                ["The first term", "第一项"],
                [`$${a}^{2} < ${n} < ${a + 1}^{2}$, so the first term is ${a}.`, `$${a}^{2} < ${n} < ${a + 1}^{2}$，所以第一项是 ${a}。`],
              ],
              [
                ["Invert the remainder", "把余数取倒数"],
                [
                  `$\\frac{1}{\\sqrt{${n}} - ${a}} = \\frac{\\sqrt{${n}} + ${a}}{${n} - ${a * a}} = \\sqrt{${n}} + ${a}$.`,
                  `$\\frac{1}{\\sqrt{${n}} - ${a}} = \\frac{\\sqrt{${n}} + ${a}}{${n} - ${a * a}} = \\sqrt{${n}} + ${a}$。`,
                ],
              ],
              [
                ["Read the term and the repeat", "读出这一项和循环"],
                [
                  `Its whole part is ${2 * a}, and the remainder is $\\sqrt{${n}} - ${a}$ again, so ${2 * a} repeats.`,
                  `它的整数部分是 ${2 * a}，余下的又是 $\\sqrt{${n}} - ${a}$，所以 ${2 * a} 循环。`,
                ],
              ],
            ],
            [
              `$${a} + \\frac{1}{${2 * a}} = ${Q.of(2 * a * a + 1, 2 * a).toLatex()}$, and its square is $${n} + \\frac{1}{${4 * a * a}}$, very close to ${n}.`,
              `$${a} + \\frac{1}{${2 * a}} = ${Q.of(2 * a * a + 1, 2 * a).toLatex()}$，它的平方是 $${n} + \\frac{1}{${4 * a * a}}$，非常接近 ${n}。`,
            ],
          );
        }),
    ),
    point(
      "a-convergent-of-a-square-root",
      ["A convergent of a square root", "平方根的渐近分数"],
      [
        "The convergents of $[a; \\overline{2a}]$ come from cutting the fraction short. They approximate the square root extremely well: the first is $a$, and the second is $a + \\frac{1}{2a} = \\frac{2a^{2} + 1}{2a}$. For $\\sqrt{10} = [3; \\overline{6}]$ the second convergent is $3 + \\frac{1}{6} = \\frac{19}{6}$.\n\nCheck: $19^{2} - 10 \\cdot 6^{2} = 361 - 360 = 1$, so $\\frac{19}{6}$ solves Pell's equation, as a good convergent should.\n\n> **Watch out.** Add $\\frac{1}{2a}$, do not subtract it, and put the whole part over the denominator $2a$: $a = \\frac{2a^{2}}{2a}$.",
        "$[a; \\overline{2a}]$ 的渐近分数来自截断连分数。它们对平方根的逼近非常好：第一个是 $a$，第二个是 $a + \\frac{1}{2a} = \\frac{2a^{2} + 1}{2a}$。对 $\\sqrt{10} = [3; \\overline{6}]$，第二个渐近分数是 $3 + \\frac{1}{6} = \\frac{19}{6}$。\n\n检验：$19^{2} - 10 \\cdot 6^{2} = 361 - 360 = 1$，所以 $\\frac{19}{6}$ 满足佩尔方程，正如好的渐近分数应当满足的。\n\n> **注意。** 要加上 $\\frac{1}{2a}$，而不是减去，并把整数部分化成分母为 $2a$ 的分数：$a = \\frac{2a^{2}}{2a}$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 40);
          const n = a * a + 1;
          const [p, q] = [2 * a * a + 1, 2 * a];
          return worked(
            [
              `What is the second convergent of $\\sqrt{${n}} = [${a}; ${2 * a}, ${2 * a}, \\ldots]$, the one using two terms?`,
              `$\\sqrt{${n}} = [${a}; ${2 * a}, ${2 * a}, \\ldots]$ 的第二个渐近分数（用两项）是多少？`,
            ],
            Q.of(p, q),
            [
              [
                Q.of(2 * a * a - 1, 2 * a),
                `That subtracts $\\frac{1}{${2 * a}}$ instead of adding it.`,
                `那减去了 $\\frac{1}{${2 * a}}$，而不是加上。`,
              ],
              [
                Q.of(a * a + 1, a),
                `That adds $\\frac{1}{${a}}$, using the first term in place of ${2 * a}.`,
                `那加上了 $\\frac{1}{${a}}$，用第一项代替了 ${2 * a}。`,
              ],
              [
                Q.of(2 * a * a + 1, a),
                `That puts the numerator over ${a} instead of ${2 * a}.`,
                `那把分子放在 ${a} 上，而不是 ${2 * a} 上。`,
              ],
            ],
            [
              [
                ["Cut after two terms", "在两项后截断"],
                [`$${a} + \\frac{1}{${2 * a}}$.`, `$${a} + \\frac{1}{${2 * a}}$。`],
              ],
              [
                ["Combine", "合并"],
                [
                  `$\\frac{${a} \\cdot ${2 * a} + 1}{${2 * a}} = \\frac{${p}}{${q}}$.`,
                  `$\\frac{${a} \\cdot ${2 * a} + 1}{${2 * a}} = \\frac{${p}}{${q}}$。`,
                ],
              ],
            ],
            [
              `$${p}^{2} - ${n} \\cdot ${q}^{2} = ${p * p} - ${n * q * q} = 1$, so the convergent solves Pell's equation for ${n}.`,
              `$${p}^{2} - ${n} \\cdot ${q}^{2} = ${p * p} - ${n * q * q} = 1$，所以这个渐近分数满足 ${n} 的佩尔方程。`,
            ],
          );
        }),
    ),
  ],
);

/** signed writes a number for a sum, wrapping a negative value in parentheses. */
const signed = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** squared writes the square of a number, wrapping a negative base in parentheses. */
const squared = (v: number) => (v < 0 ? `(${v})^{2}` : `${v}^{2}`);

const dirichletSeries = topic(
  "dirichlet-series-and-the-zeta-function",
  ["Dirichlet Series and the Zeta Function", "狄利克雷级数和 ζ 函数"],
  ["Multiply series to find arithmetic functions, and factor zeta over primes.", "把级数相乘得到算术函数，并把 ζ 函数按质数分解。"],
  ["dirichlet-convolution"],
  [],
  [
    point(
      "coefficients-of-products",
      ["Coefficients of products", "乘积的系数"],
      [
        "A Dirichlet series is $\\sum \\frac{f(n)}{n^{s}}$, and multiplying two series convolves their coefficients: the coefficient of $\\frac{1}{n^{s}}$ in the product is $\\sum_{de = n} f(d)g(e)$. So $\\zeta(s)^{2}$ has coefficient $\\tau(n)$, while $\\zeta(s)\\zeta(s - 1)$, whose second factor has coefficients $e$, has coefficient $\\sigma(n)$. For $n = 12$ the divisors are $1, 2, 3, 4, 6, 12$, so the coefficients are $\\tau(12) = 6$ and $\\sigma(12) = 28$.\n\nCheck: $12 = 2^{2} \\cdot 3$, so $\\tau(12) = 3 \\cdot 2 = 6$ and $\\sigma(12) = 7 \\cdot 4 = 28$.\n\n> **Watch out.** $\\zeta(s)^{2}$ counts the divisors and $\\zeta(s)\\zeta(s - 1)$ adds them; the shift $s - 1$ is what puts the weight $e$ on each divisor. Neither gives the totient.",
        "狄利克雷级数是 $\\sum \\frac{f(n)}{n^{s}}$，两个级数相乘就是系数的卷积：乘积中 $\\frac{1}{n^{s}}$ 的系数是 $\\sum_{de = n} f(d)g(e)$。所以 $\\zeta(s)^{2}$ 的系数是 $\\tau(n)$，而 $\\zeta(s)\\zeta(s - 1)$ 的第二个因子系数是 $e$，乘积的系数是 $\\sigma(n)$。对 $n = 12$，除数是 $1, 2, 3, 4, 6, 12$，所以系数是 $\\tau(12) = 6$ 和 $\\sigma(12) = 28$。\n\n检验：$12 = 2^{2} \\cdot 3$，所以 $\\tau(12) = 3 \\cdot 2 = 6$，$\\sigma(12) = 7 \\cdot 4 = 28$。\n\n> **注意。** $\\zeta(s)^{2}$ 数除数，$\\zeta(s)\\zeta(s - 1)$ 把除数相加；正是平移 $s - 1$ 给每个除数加上了权 $e$。两者都不给出欧拉函数。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(6, 300);
          const ds = divisors(n);
          const sigmaN = ds.reduce((a, b) => a + b, 0);
          const useTau = rng.bool();
          const parts = factorize(n);
          const tauForm = parts.map(([, e]) => `${e + 1}`).join(" \\cdot ");
          const sigmaForm = parts.map(([p, e]) => `${(p ** (e + 1) - 1) / (p - 1)}`).join(" \\cdot ");
          const shown = ds.length <= 16 ? `$${ds.join(", ")}$` : `${ds.length} numbers`;
          const shownZh = ds.length <= 16 ? `$${ds.join(", ")}$` : `${ds.length} 个数`;
          return worked(
            useTau
              ? [
                  `What is the coefficient of $\\frac{1}{${n}^{s}}$ in $\\zeta(s)^{2}$?`,
                  `$\\zeta(s)^{2}$ 中 $\\frac{1}{${n}^{s}}$ 的系数是多少？`,
                ]
              : [
                  `What is the coefficient of $\\frac{1}{${n}^{s}}$ in $\\zeta(s)\\zeta(s - 1)$?`,
                  `$\\zeta(s)\\zeta(s - 1)$ 中 $\\frac{1}{${n}^{s}}$ 的系数是多少？`,
                ],
            useTau ? ds.length : sigmaN,
            useTau
              ? [
                  [
                    sigmaN,
                    "That adds the divisors, which is the coefficient of $\\zeta(s)\\zeta(s - 1)$.",
                    "那把除数相加了，那是 $\\zeta(s)\\zeta(s - 1)$ 的系数。",
                  ],
                  [
                    totient(n),
                    `That is $\\varphi(${n})$, which does not come from $\\zeta(s)^{2}$.`,
                    `那是 $\\varphi(${n})$，它不来自 $\\zeta(s)^{2}$。`,
                  ],
                  [ds.length - 1, `That leaves out ${n} itself, or 1, from the divisors.`, `那从除数中漏掉了 ${n} 本身或 1。`],
                ]
              : [
                  [
                    ds.length,
                    "That counts the divisors, which is the coefficient of $\\zeta(s)^{2}$.",
                    "那数了除数，那是 $\\zeta(s)^{2}$ 的系数。",
                  ],
                  [sigmaN - n, `That leaves out the divisor ${n} itself.`, `那漏掉了除数 ${n} 本身。`],
                  [
                    totient(n),
                    `That is $\\varphi(${n})$, which does not come from this product.`,
                    `那是 $\\varphi(${n})$，它不来自这个乘积。`,
                  ],
                ],
            [
              [
                ["Convolve the coefficients", "把系数卷积"],
                useTau
                  ? [
                      `Both factors have coefficients 1, so the coefficient is $\\sum_{de = ${n}} 1 \\cdot 1$, the number of divisors.`,
                      `两个因子的系数都是 1，所以系数是 $\\sum_{de = ${n}} 1 \\cdot 1$，即除数的个数。`,
                    ]
                  : [
                      `$\\zeta(s - 1) = \\sum \\frac{e}{e^{s}}$, so the coefficient is $\\sum_{de = ${n}} 1 \\cdot e$, the sum of the divisors.`,
                      `$\\zeta(s - 1) = \\sum \\frac{e}{e^{s}}$，所以系数是 $\\sum_{de = ${n}} 1 \\cdot e$，即除数之和。`,
                    ],
              ],
              [
                ["List the divisors", "列出除数"],
                useTau
                  ? [
                      `The divisors of ${n} are ${shown}, so the coefficient is ${ds.length}.`,
                      `${n} 的除数是 ${shownZh}，所以系数是 ${ds.length}。`,
                    ]
                  : [`The divisors of ${n} are ${shown}, and they add to ${sigmaN}.`, `${n} 的除数是 ${shownZh}，它们的和是 ${sigmaN}。`],
              ],
            ],
            useTau
              ? [
                  `$${n} = ${factorizationLatex(factorize(n))}$, so $\\tau(${n}) = ${tauForm} = ${ds.length}$.`,
                  `$${n} = ${factorizationLatex(factorize(n))}$，所以 $\\tau(${n}) = ${tauForm} = ${ds.length}$。`,
                ]
              : [
                  `$${n} = ${factorizationLatex(factorize(n))}$, and multiplying $1 + p + \\cdots + p^{e}$ over the prime powers gives $${sigmaForm} = ${sigmaN}$.`,
                  `$${n} = ${factorizationLatex(factorize(n))}$，把各质数幂的 $1 + p + \\cdots + p^{e}$ 相乘得 $${sigmaForm} = ${sigmaN}$。`,
                ],
          );
        }),
    ),
    point(
      "an-euler-factor",
      ["An Euler factor", "欧拉因子"],
      [
        "Unique factorization turns $\\zeta(s)$ into a product over primes of $\\frac{1}{1 - p^{-s}}$. Each factor is a geometric series of the powers of one prime, and the product expands to give every whole number exactly once. For $\\zeta(2)$ at the prime 2 the factor is $\\frac{1}{1 - 2^{-2}} = \\frac{1}{1 - \\frac{1}{4}} = \\frac{4}{3}$.\n\nCheck: the series $1 + \\frac{1}{4} + \\frac{1}{16} + \\cdots$ has partial sums $1, 1.25, 1.3125, \\ldots$, approaching $\\frac{4}{3} \\approx 1.333$.\n\n> **Watch out.** Take the reciprocal of $1 - p^{-s}$, and use the exponent of the zeta value itself: for $\\zeta(2)$ the factor at $p$ uses $p^{2}$, not $p$.",
        "唯一分解把 $\\zeta(s)$ 变成对质数的乘积 $\\frac{1}{1 - p^{-s}}$。每个因子是一个质数各次幂的几何级数，乘积展开后每个整数恰好出现一次。对 $\\zeta(2)$ 在质数 2 处，因子是 $\\frac{1}{1 - 2^{-2}} = \\frac{1}{1 - \\frac{1}{4}} = \\frac{4}{3}$。\n\n检验：级数 $1 + \\frac{1}{4} + \\frac{1}{16} + \\cdots$ 的部分和是 $1, 1.25, 1.3125, \\ldots$，趋于 $\\frac{4}{3} \\approx 1.333$。\n\n> **注意。** 要取 $1 - p^{-s}$ 的倒数，并用 ζ 值本身的指数：对 $\\zeta(2)$，在 $p$ 处的因子用 $p^{2}$，而不是 $p$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(smallPrimes.filter((v) => v <= 31));
          const e = rng.int(1, 3);
          const N = p ** (e + 1);
          const low = p ** e;
          return worked(
            [`What is the Euler factor of $\\zeta(${e + 1})$ at the prime ${p}?`, `$\\zeta(${e + 1})$ 在质数 ${p} 处的欧拉因子是多少？`],
            Q.of(N, N - 1),
            [
              [
                Q.of(N - 1, N),
                `That is $1 - ${p}^{-${e + 1}}$ itself; the factor is its reciprocal.`,
                `那是 $1 - ${p}^{-${e + 1}}$ 本身；因子是它的倒数。`,
              ],
              [Q.of(N, N + 1), `That uses $1 + ${p}^{-${e + 1}}$, with the wrong sign.`, `那用了 $1 + ${p}^{-${e + 1}}$，符号错了。`],
              [
                Q.of(low, low - 1),
                `That uses $${pw(p, e)}$ instead of $${p}^{${e + 1}}$.`,
                `那用了 $${pw(p, e)}$，而不是 $${p}^{${e + 1}}$。`,
              ],
            ],
            [
              [
                ["Write the factor", "写出因子"],
                [
                  `At $s = ${e + 1}$ the factor is $\\frac{1}{1 - ${p}^{-${e + 1}}} = \\frac{1}{1 - \\frac{1}{${N}}}$.`,
                  `在 $s = ${e + 1}$ 处因子是 $\\frac{1}{1 - ${p}^{-${e + 1}}} = \\frac{1}{1 - \\frac{1}{${N}}}$。`,
                ],
              ],
              [
                ["Simplify", "化简"],
                [
                  `$\\frac{1}{\\frac{${N - 1}}{${N}}} = \\frac{${N}}{${N - 1}}$.`,
                  `$\\frac{1}{\\frac{${N - 1}}{${N}}} = \\frac{${N}}{${N - 1}}$。`,
                ],
              ],
            ],
            [
              `The geometric series $1 + \\frac{1}{${N}} + \\frac{1}{${N * N}} + \\cdots$ of the powers of ${p} has ratio $\\frac{1}{${N}}$, and $\\frac{${N}}{${N - 1}} \\cdot \\frac{${N - 1}}{${N}} = 1$ confirms that it sums to $\\frac{${N}}{${N - 1}}$.`,
              `${p} 的各次幂组成的几何级数 $1 + \\frac{1}{${N}} + \\frac{1}{${N * N}} + \\cdots$ 公比是 $\\frac{1}{${N}}$，而 $\\frac{${N}}{${N - 1}} \\cdot \\frac{${N - 1}}{${N}} = 1$ 证实它的和是 $\\frac{${N}}{${N - 1}}$。`,
            ],
          );
        }),
    ),
    point(
      "the-reciprocal-of-zeta",
      ["The reciprocal of zeta", "ζ 的倒数"],
      [
        "Since $\\mu$ is the convolution inverse of the constant function 1, the series with coefficients $\\mu(n)$ is $\\frac{1}{\\zeta(s)}$. So reading a coefficient of this reciprocal is the same as computing the Möbius function. For $n = 30 = 2 \\cdot 3 \\cdot 5$, three distinct primes and no square, the coefficient is $\\mu(30) = (-1)^{3} = -1$.\n\nCheck: $\\zeta(s) \\cdot \\frac{1}{\\zeta(s)} = 1$ makes $\\sum_{d \\mid 30} \\mu(d) = 0$, and over the proper divisors $1, 2, 3, 5, 6, 10, 15$ the values are $1 - 1 - 1 - 1 + 1 + 1 + 1 = 1$, so $\\mu(30) = -1$.\n\n> **Watch out.** A repeated prime factor makes the coefficient 0, whatever the number of primes. Otherwise the sign is $(-1)^{k}$ for $k$ distinct primes, not $k$ itself.",
        "因为 $\\mu$ 是常数函数 1 的卷积逆，系数为 $\\mu(n)$ 的级数是 $\\frac{1}{\\zeta(s)}$。所以读这个倒数的系数就是计算莫比乌斯函数。对 $n = 30 = 2 \\cdot 3 \\cdot 5$，三个不同的质数且没有平方因子，系数是 $\\mu(30) = (-1)^{3} = -1$。\n\n检验：$\\zeta(s) \\cdot \\frac{1}{\\zeta(s)} = 1$ 使 $\\sum_{d \\mid 30} \\mu(d) = 0$，而在真除数 $1, 2, 3, 5, 6, 10, 15$ 上的值是 $1 - 1 - 1 - 1 + 1 + 1 + 1 = 1$，所以 $\\mu(30) = -1$。\n\n> **注意。** 有重复的质因数时系数是 0，不管有几个质数。否则符号是 $(-1)^{k}$，$k$ 是不同质数的个数，而不是 $k$ 本身。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(6, 600);
          const f = factorize(n);
          const k = f.length;
          const m = mobius(n);
          const proper = divisors(n).filter((d) => d < n);
          const values = proper.map((d) => mobius(d)).filter((v) => v !== 0);
          const total = values.reduce((a, b) => a + b, 0);
          const repeated = f.find(([, e]) => e > 1);
          return worked(
            [
              `What is the coefficient of $\\frac{1}{${n}^{s}}$ in $\\frac{1}{\\zeta(s)}$?`,
              `$\\frac{1}{\\zeta(s)}$ 中 $\\frac{1}{${n}^{s}}$ 的系数是多少？`,
            ],
            m,
            m === 0
              ? [
                  [
                    (-1) ** k,
                    "That ignores the repeated prime factor, which makes the coefficient 0.",
                    "那忽略了重复的质因数，它使系数为 0。",
                  ],
                  [k, "That gives the number of distinct primes instead of a coefficient.", "那给出了不同质数的个数，而不是系数。"],
                  [1, "That takes the coefficient of $\\zeta(s)$, which is always 1.", "那取的是 $\\zeta(s)$ 的系数，它总是 1。"],
                ]
              : [
                  [
                    -m,
                    `That flips the sign; ${k} distinct primes give $${pw("(-1)", k)} = ${m}$.`,
                    `那把符号弄反了；${k} 个不同的质数给出 $${pw("(-1)", k)} = ${m}$。`,
                  ],
                  [0, `That treats ${n} as having a square factor, but it has none.`, `那把 ${n} 当作有平方因子，但它没有。`],
                  [k, "That gives the number of distinct primes instead of the sign.", "那给出了不同质数的个数，而不是符号。"],
                ],
            [
              [
                ["The coefficient is the Möbius function", "系数就是莫比乌斯函数"],
                [
                  `$\\frac{1}{\\zeta(s)} = \\sum \\frac{\\mu(n)}{n^{s}}$, so the coefficient is $\\mu(${n})$.`,
                  `$\\frac{1}{\\zeta(s)} = \\sum \\frac{\\mu(n)}{n^{s}}$，所以系数是 $\\mu(${n})$。`,
                ],
              ],
              [
                ["Factor", "分解"],
                repeated
                  ? [
                      `$${n} = ${factorizationLatex(factorize(n))}$ has the square factor $${repeated[0]}^{2}$, so $\\mu(${n}) = 0$.`,
                      `$${n} = ${factorizationLatex(factorize(n))}$ 有平方因子 $${repeated[0]}^{2}$，所以 $\\mu(${n}) = 0$。`,
                    ]
                  : [
                      `$${n} = ${factorizationLatex(factorize(n))}$ has ${k} distinct primes and no square, so $\\mu(${n}) = ${pw("(-1)", k)} = ${m}$.`,
                      `$${n} = ${factorizationLatex(factorize(n))}$ 有 ${k} 个不同的质数且无平方因子，所以 $\\mu(${n}) = ${pw("(-1)", k)} = ${m}$。`,
                    ],
              ],
            ],
            [
              `$\\zeta(s) \\cdot \\frac{1}{\\zeta(s)} = 1$ makes $\\sum_{d \\mid ${n}} \\mu(d) = 0$. The nonzero values over the proper divisors add to $${values.map(signed).join(" + ")} = ${total}$, so $\\mu(${n}) = ${-total === 0 ? 0 : -total}$.`,
              `$\\zeta(s) \\cdot \\frac{1}{\\zeta(s)} = 1$ 使 $\\sum_{d \\mid ${n}} \\mu(d) = 0$。真除数上的非零值之和是 $${values.map(signed).join(" + ")} = ${total}$，所以 $\\mu(${n}) = ${-total === 0 ? 0 : -total}$。`,
            ],
          );
        }),
    ),
  ],
);

const quadraticIntegers = topic(
  "unique-factorization-in-quadratic-integers",
  ["Unique Factorization in Quadratic Integers", "二次整数中的唯一分解"],
  ["Use the norm to study factorization, and see unique factorization fail.", "用范数研究分解，并看到唯一分解失败。"],
  ["gaussian-integers"],
  [],
  [
    point(
      "the-norm-is-multiplicative",
      ["The norm is multiplicative", "范数是乘性的"],
      [
        "In $\\mathbb{Z}[\\sqrt{-d}]$, the norm of $a + b\\sqrt{-d}$ is $a^{2} + db^{2}$, and the norm of a product is the product of the norms. So a factorization upstairs gives a factorization of ordinary whole numbers downstairs. In $\\mathbb{Z}[\\sqrt{-2}]$, $N(1 + \\sqrt{-2}) = 3$ and $N(1 + 2\\sqrt{-2}) = 9$, so the product has norm 27.\n\nCheck: $(1 + \\sqrt{-2})(1 + 2\\sqrt{-2}) = 1 - 4 + 3\\sqrt{-2} = -3 + 3\\sqrt{-2}$, whose norm is $9 + 2 \\cdot 9 = 27$.\n\n> **Watch out.** The norm adds $db^{2}$ because $(\\sqrt{-d})^{2} = -d$; subtracting it is the rule for real square roots. Norms multiply; they do not add.",
        "在 $\\mathbb{Z}[\\sqrt{-d}]$ 中，$a + b\\sqrt{-d}$ 的范数是 $a^{2} + db^{2}$，乘积的范数是范数之积。所以这里的分解给出普通整数的分解。在 $\\mathbb{Z}[\\sqrt{-2}]$ 中，$N(1 + \\sqrt{-2}) = 3$，$N(1 + 2\\sqrt{-2}) = 9$，所以乘积的范数是 27。\n\n检验：$(1 + \\sqrt{-2})(1 + 2\\sqrt{-2}) = 1 - 4 + 3\\sqrt{-2} = -3 + 3\\sqrt{-2}$，它的范数是 $9 + 2 \\cdot 9 = 27$。\n\n> **注意。** 范数加上 $db^{2}$，因为 $(\\sqrt{-d})^{2} = -d$；减去它是实平方根的规则。范数相乘，而不是相加。",
      ],
      (rng) =>
        until(() => {
          const d = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
          const [a, b, c, e] = [rng.int(1, 9), rng.int(1, 6), rng.int(1, 9), rng.int(1, 6)];
          const n1 = a * a + d * b * b;
          const n2 = c * c + d * e * e;
          const re = a * c - d * b * e;
          const im = a * e + b * c;
          const co = (v: number) => (v === 1 ? "" : `${v}`);
          const elt = `(${a} + ${co(b)}\\sqrt{-${d}})(${c} + ${co(e)}\\sqrt{-${d}})`;
          return worked(
            [`What is the norm of $${elt}$?`, `$${elt}$ 的范数是多少？`],
            n1 * n2,
            [
              [n1 + n2, "That adds the norms; the norm of a product is their product.", "那把范数相加了；乘积的范数是范数之积。"],
              [n1, "That gives the norm of the first factor only.", "那只给出了第一个因子的范数。"],
              [
                (a * a - d * b * b) * (c * c - d * e * e),
                `That subtracts $${d}b^{2}$, as for $\\sqrt{${d}}$; here $(\\sqrt{-${d}})^{2} = -${d}$.`,
                `那减去了 $${d}b^{2}$，像 $\\sqrt{${d}}$ 那样；这里 $(\\sqrt{-${d}})^{2} = -${d}$。`,
              ],
            ],
            [
              [
                ["Norm of each factor", "每个因子的范数"],
                [
                  `$${a}^{2} + ${d} \\cdot ${b}^{2} = ${n1}$ and $${c}^{2} + ${d} \\cdot ${e}^{2} = ${n2}$.`,
                  `$${a}^{2} + ${d} \\cdot ${b}^{2} = ${n1}$，$${c}^{2} + ${d} \\cdot ${e}^{2} = ${n2}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [`$${n1} \\cdot ${n2} = ${n1 * n2}$.`, `$${n1} \\cdot ${n2} = ${n1 * n2}$。`],
              ],
            ],
            [
              `Multiplying out gives $${re} + ${im}\\sqrt{-${d}}$, whose norm is $${squared(re)} + ${d} \\cdot ${im}^{2} = ${re * re} + ${d * im * im} = ${n1 * n2}$.`,
              `直接相乘得 $${re} + ${im}\\sqrt{-${d}}$，它的范数是 $${squared(re)} + ${d} \\cdot ${im}^{2} = ${re * re} + ${d * im * im} = ${n1 * n2}$。`,
            ],
          );
        }),
    ),
    point(
      "units-from-the-norm",
      ["Units from the norm", "由范数得单位"],
      [
        "An element is a unit exactly when its norm is 1, because $N(u)N(u^{-1}) = N(1) = 1$ and norms are positive whole numbers. In $\\mathbb{Z}[\\sqrt{-d}]$ with $d \\ge 2$, this forces $b = 0$ and $a = \\pm 1$, so there are just two units. In $\\mathbb{Z}[\\sqrt{-5}]$, for example, $a^{2} + 5b^{2} = 1$ leaves only $\\pm 1$.\n\nCheck: in $\\mathbb{Z}[i]$, where $d = 1$, the equation $a^{2} + b^{2} = 1$ also allows $b = \\pm 1$, giving the four units $\\pm 1, \\pm i$; the extra two need $d = 1$.\n\n> **Watch out.** Do not forget $-1$, which is a unit in every ring. And the four units of $\\mathbb{Z}[i]$ do not carry over to larger $d$.",
        "元素是单位当且仅当它的范数是 1，因为 $N(u)N(u^{-1}) = N(1) = 1$，而范数是正整数。在 $d \\ge 2$ 的 $\\mathbb{Z}[\\sqrt{-d}]$ 中，这迫使 $b = 0$，$a = \\pm 1$，所以只有两个单位。例如在 $\\mathbb{Z}[\\sqrt{-5}]$ 中，$a^{2} + 5b^{2} = 1$ 只剩下 $\\pm 1$。\n\n检验：在 $d = 1$ 的 $\\mathbb{Z}[i]$ 中，方程 $a^{2} + b^{2} = 1$ 还允许 $b = \\pm 1$，得到四个单位 $\\pm 1, \\pm i$；多出的两个需要 $d = 1$。\n\n> **注意。** 不要忘了 $-1$，它在每个环中都是单位。而 $\\mathbb{Z}[i]$ 的四个单位不能推广到更大的 $d$。",
      ],
      (rng) =>
        until(() => {
          const d = rng.int(2, 60);
          return worked(
            [`How many units does the ring $\\mathbb{Z}[\\sqrt{-${d}}]$ have?`, `环 $\\mathbb{Z}[\\sqrt{-${d}}]$ 有多少个单位？`],
            2,
            [
              [4, "That is the count for $\\mathbb{Z}[i]$, where $d = 1$.", "那是 $\\mathbb{Z}[i]$ 的个数，那里 $d = 1$。"],
              [1, "That forgets $-1$, which is also a unit.", "那忘了 $-1$，它也是单位。"],
            ],
            [
              [
                ["Units have norm 1", "单位的范数是 1"],
                [`A unit $a + b\\sqrt{-${d}}$ needs $a^{2} + ${d}b^{2} = 1$.`, `单位 $a + b\\sqrt{-${d}}$ 需要 $a^{2} + ${d}b^{2} = 1$。`],
              ],
              [
                ["Solve", "求解"],
                [
                  `If $b \\ne 0$ the norm is at least ${d}, so $b = 0$ and $a^{2} = 1$, that is $a = \\pm 1$: 2 units.`,
                  `若 $b \\ne 0$，范数至少是 ${d}，所以 $b = 0$，$a^{2} = 1$，即 $a = \\pm 1$：2 个单位。`,
                ],
              ],
            ],
            [
              "Both really are units, since $1 \\cdot 1 = 1$ and $(-1)(-1) = 1$, and any other element has norm at least 2, so it has no inverse.",
              "两者确实都是单位，因为 $1 \\cdot 1 = 1$，$(-1)(-1) = 1$；而其他元素的范数至少是 2，所以没有逆元。",
            ],
          );
        }),
    ),
    point(
      "a-failure-of-unique-factorization",
      ["A failure of unique factorization", "唯一分解的失败"],
      [
        "In $\\mathbb{Z}[\\sqrt{-5}]$, the number 6 equals $2 \\cdot 3$ and also $(1 + \\sqrt{-5})(1 - \\sqrt{-5})$. Norms show that all four factors are irreducible, so factorization into irreducibles is not unique there. The norms are 4, 9, 6 and 6, and a proper factor would need norm 2 or 3, but $a^{2} + 5b^{2}$ never equals 2 or 3.\n\nCheck: $(1 + \\sqrt{-5})(1 - \\sqrt{-5}) = 1 - (\\sqrt{-5})^{2} = 1 + 5 = 6$, and both factorizations have norm product $4 \\cdot 9 = 6 \\cdot 6 = 36$.\n\n> **Watch out.** A conjugate pair multiplies to $a^{2} + 5b^{2}$, a sum, because $(\\sqrt{-5})^{2} = -5$. Square $b$ before multiplying by 5.",
        "在 $\\mathbb{Z}[\\sqrt{-5}]$ 中，6 等于 $2 \\cdot 3$，也等于 $(1 + \\sqrt{-5})(1 - \\sqrt{-5})$。范数说明四个因子都不可约，所以那里分解成不可约元不是唯一的。范数分别是 4、9、6、6，真因子需要范数 2 或 3，但 $a^{2} + 5b^{2}$ 永远不等于 2 或 3。\n\n检验：$(1 + \\sqrt{-5})(1 - \\sqrt{-5}) = 1 - (\\sqrt{-5})^{2} = 1 + 5 = 6$，而两种分解的范数之积都是 $4 \\cdot 9 = 6 \\cdot 6 = 36$。\n\n> **注意。** 一对共轭相乘得 $a^{2} + 5b^{2}$，是和，因为 $(\\sqrt{-5})^{2} = -5$。先把 $b$ 平方再乘 5。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 25);
          const b = rng.int(1, 12);
          const n = a * a + 5 * b * b;
          const bs = b === 1 ? "" : `${b}`;
          return worked(
            [
              `In $\\mathbb{Z}[\\sqrt{-5}]$, what whole number equals $(${a} + ${bs}\\sqrt{-5})(${a} - ${bs}\\sqrt{-5})$?`,
              `在 $\\mathbb{Z}[\\sqrt{-5}]$ 中，$(${a} + ${bs}\\sqrt{-5})(${a} - ${bs}\\sqrt{-5})$ 等于哪个整数？`,
            ],
            n,
            [
              [a * a - 5 * b * b, "That treats $(\\sqrt{-5})^{2}$ as 5; it is $-5$.", "那把 $(\\sqrt{-5})^{2}$ 当作 5；它是 $-5$。"],
              [a * a + b * b, "That drops the factor 5 from $(\\sqrt{-5})^{2}$.", "那丢掉了 $(\\sqrt{-5})^{2}$ 中的因子 5。"],
              [
                a * a + 5 * b,
                `That forgets to square ${b === 1 ? "the coefficient 1" : b}.`,
                `那忘了把${b === 1 ? "系数 1" : ` ${b} `}平方。`,
              ],
            ],
            [
              [
                ["Use the difference of squares", "用平方差"],
                [
                  `$(${a} + ${bs}\\sqrt{-5})(${a} - ${bs}\\sqrt{-5}) = ${a}^{2} - ${b === 1 ? "" : `${b}^{2}`}(\\sqrt{-5})^{2}$.`,
                  `$(${a} + ${bs}\\sqrt{-5})(${a} - ${bs}\\sqrt{-5}) = ${a}^{2} - ${b === 1 ? "" : `${b}^{2}`}(\\sqrt{-5})^{2}$。`,
                ],
              ],
              [
                ["Replace the square root", "替换平方根"],
                [
                  `$(\\sqrt{-5})^{2} = -5$, so this is $${a * a} + 5 \\cdot ${b * b} = ${n}$.`,
                  `$(\\sqrt{-5})^{2} = -5$，所以这是 $${a * a} + 5 \\cdot ${b * b} = ${n}$。`,
                ],
              ],
            ],
            [
              `Each factor has norm $${a}^{2} + 5 \\cdot ${b}^{2} = ${n}$, and the whole number ${n} has norm $${n}^{2} = ${n} \\cdot ${n}$, as multiplicativity requires.`,
              `每个因子的范数是 $${a}^{2} + 5 \\cdot ${b}^{2} = ${n}$，而整数 ${n} 的范数是 $${n}^{2} = ${n} \\cdot ${n}$，符合乘性。`,
            ],
          );
        }),
    ),
  ],
);

/** numberTheoryExtraTopics holds the topics that complete the Number Theory course. */
export const numberTheoryExtraTopics: readonly TopicDef[] = [
  lesson(
    fundamentalTheorem,
    [
      "What are the gcd and the lcm of 84 and 90? Factor both: $84 = 2^{2} \\cdot 3 \\cdot 7$ and $90 = 2 \\cdot 3^{2} \\cdot 5$. The gcd takes each prime to its lower exponent, $2 \\cdot 3 = 6$, and the lcm takes the higher one, $2^{2} \\cdot 3^{2} \\cdot 5 \\cdot 7 = 1260$.",
      "84 和 90 的最大公约数和最小公倍数是多少？把两者分解：$84 = 2^{2} \\cdot 3 \\cdot 7$，$90 = 2 \\cdot 3^{2} \\cdot 5$。最大公约数让每个质数取较低的指数，$2 \\cdot 3 = 6$；最小公倍数取较高的，$2^{2} \\cdot 3^{2} \\cdot 5 \\cdot 7 = 1260$。",
    ],
    ["$6 \\cdot 1260 = 7560 = 84 \\cdot 90$.", "$6 \\cdot 1260 = 7560 = 84 \\cdot 90$。"],
    [
      "read the gcd and the lcm from prime factorizations, and use the product formula that links them.",
      "从质因数分解读出最大公约数和最小公倍数，并用联系两者的乘积公式。",
    ],
  ),
  lesson(
    baseExpansions,
    [
      "How is 2013 written in base 5? Divide repeatedly by 5: $2013 = 402 \\cdot 5 + 3$, $402 = 80 \\cdot 5 + 2$, $80 = 16 \\cdot 5 + 0$, $16 = 3 \\cdot 5 + 1$, and 3 is left. Reading the remainders from the last gives $31023_{5}$.",
      "2013 用 5 进制怎么写？反复除以 5：$2013 = 402 \\cdot 5 + 3$，$402 = 80 \\cdot 5 + 2$，$80 = 16 \\cdot 5 + 0$，$16 = 3 \\cdot 5 + 1$，剩下 3。从最后一个余数读起得 $31023_{5}$。",
    ],
    [
      "$3 \\cdot 625 + 1 \\cdot 125 + 0 \\cdot 25 + 2 \\cdot 5 + 3 = 2013$.",
      "$3 \\cdot 625 + 1 \\cdot 125 + 0 \\cdot 25 + 2 \\cdot 5 + 3 = 2013$。",
    ],
    [
      "find the value of digits in any base, convert by repeated division, and test divisibility in base $b$.",
      "求任意进制中数字的值，用反复除法转换进制，并在 $b$ 进制中检验整除性。",
    ],
  ),
  lesson(
    fermatFactor,
    [
      "Can 391 be split as a difference of two squares? The first square above it is $20^{2} = 400$, and $400 - 391 = 9 = 3^{2}$. So $391 = 20^{2} - 3^{2} = (20 - 3)(20 + 3) = 17 \\cdot 23$.",
      "391 能写成两个平方数之差吗？比它大的第一个平方数是 $20^{2} = 400$，而 $400 - 391 = 9 = 3^{2}$。所以 $391 = 20^{2} - 3^{2} = (20 - 3)(20 + 3) = 17 \\cdot 23$。",
    ],
    ["$17 \\cdot 23 = 340 + 51 = 391$.", "$17 \\cdot 23 = 340 + 51 = 391$。"],
    [
      "write an odd number as a difference of two squares, search upward from its square root, and see why the method is quick when the two factors are close.",
      "把奇数写成两个平方数之差，从它的平方根向上搜索，并看到为什么两个因子接近时这个方法很快。",
    ],
  ),
  lesson(
    pollard,
    [
      "Pollard's method iterates $x \\mapsto x^{2} + 1$ modulo $n = 8051$ from 2: $2, 5, 26, 677, 7474, 2839, 871$. Comparing the third and sixth terms, $\\gcd(871 - 677, 8051) = \\gcd(194, 8051) = 97$, a factor found without trial division.",
      "波拉德方法从 2 起模 $n = 8051$ 迭代 $x \\mapsto x^{2} + 1$：$2, 5, 26, 677, 7474, 2839, 871$。比较第三项和第六项，$\\gcd(871 - 677, 8051) = \\gcd(194, 8051) = 97$，不用试除就找到了一个因子。",
    ],
    ["$97 \\cdot 83 = 8051$, and $194 = 2 \\cdot 97$.", "$97 \\cdot 83 = 8051$，而 $194 = 2 \\cdot 97$。"],
    [
      "iterate a polynomial modulo $n$, take the gcd of a difference with $n$ to find a factor, and measure the cycle the sequence falls into.",
      "模 $n$ 迭代多项式，取差与 $n$ 的最大公约数来找因子，并测量序列落入的循环。",
    ],
  ),
  lesson(
    diffieHellman,
    [
      "Two people agree on $p = 23$ and $g = 5$. One keeps the secret 4 and sends $5^{4} \\bmod 23 = 4$; the other keeps 3 and sends $5^{3} \\bmod 23 = 10$. Each raises what arrives to their own secret: $10^{4} \\equiv 18$ and $4^{3} = 64 \\equiv 18$, so both now share 18.",
      "两人约定 $p = 23$，$g = 5$。一人保留秘密 4，发送 $5^{4} \\bmod 23 = 4$；另一人保留 3，发送 $5^{3} \\bmod 23 = 10$。各自把收到的数升到自己秘密的次幂：$10^{4} \\equiv 18$，$4^{3} = 64 \\equiv 18$，所以两人现在共享 18。",
    ],
    [
      "$5^{12} = (5^{4})^{3} = (5^{3})^{4}$, and $10000 = 434 \\cdot 23 + 18$.",
      "$5^{12} = (5^{4})^{3} = (5^{3})^{4}$，而 $10000 = 434 \\cdot 23 + 18$。",
    ],
    [
      "compute a public value, find the shared secret from either side, and break a small exchange by finding a discrete logarithm.",
      "计算公开值，从任一方求出共享秘密，并通过求离散对数破解一个小的交换。",
    ],
  ),
  lesson(
    quadraticComposite,
    [
      "Solve $x^{2} \\equiv 15 \\pmod{77}$. Modulo 7, $15 \\equiv 1$, so $x \\equiv \\pm 1$; modulo 11, $15 \\equiv 4$, so $x \\equiv \\pm 2$. The Chinese remainder theorem combines the four pairs into the roots $13, 20, 57, 64$.",
      "解 $x^{2} \\equiv 15 \\pmod{77}$。模 7 时 $15 \\equiv 1$，所以 $x \\equiv \\pm 1$；模 11 时 $15 \\equiv 4$，所以 $x \\equiv \\pm 2$。中国剩余定理把四对组合成根 $13, 20, 57, 64$。",
    ],
    [
      "$13^{2} = 169 = 2 \\cdot 77 + 15$ and $20^{2} = 400 = 5 \\cdot 77 + 15$, while $64 = 77 - 13$ and $57 = 77 - 20$.",
      "$13^{2} = 169 = 2 \\cdot 77 + 15$，$20^{2} = 400 = 5 \\cdot 77 + 15$，而 $64 = 77 - 13$，$57 = 77 - 20$。",
    ],
    [
      "count the square roots modulo a composite number, handle the power of two, and combine roots with the Chinese remainder theorem.",
      "数模合数的平方根个数，处理 2 的幂，并用中国剩余定理组合根。",
    ],
  ),
  lesson(
    generalCrt,
    [
      "Can $x \\equiv 3 \\pmod{6}$ and $x \\equiv 5 \\pmod{8}$ hold together? The moduli share the factor $\\gcd(6, 8) = 2$, which divides $5 - 3$, so they agree. The solution is unique modulo $\\operatorname{lcm}(6, 8) = 24$, and checking $5, 13, 21$ finds $x \\equiv 21$.",
      "$x \\equiv 3 \\pmod{6}$ 和 $x \\equiv 5 \\pmod{8}$ 能同时成立吗？两个模有公因子 $\\gcd(6, 8) = 2$，它整除 $5 - 3$，所以相容。解模 $\\operatorname{lcm}(6, 8) = 24$ 唯一，检查 $5, 13, 21$ 得 $x \\equiv 21$。",
    ],
    ["$21 = 3 \\cdot 6 + 3$ and $21 = 2 \\cdot 8 + 5$.", "$21 = 3 \\cdot 6 + 3$，$21 = 2 \\cdot 8 + 5$。"],
    [
      "test whether congruences with moduli that are not coprime agree, find the modulus of the solution, and solve such a system.",
      "检验模不互素的同余式是否相容，求解的模，并解这样的方程组。",
    ],
  ),
  lesson(
    millerRabin,
    [
      "Is 561 prime? Write $560 = 2^{4} \\cdot 35$. Then $2^{35} \\equiv 263$, and squaring gives $166$, $67$, $1$ modulo 561. So 67 is a square root of 1 that is not $\\pm 1$, which no prime allows: 561 is composite.",
      "561 是质数吗？写 $560 = 2^{4} \\cdot 35$。则 $2^{35} \\equiv 263$，再平方依次得模 561 的 $166$、$67$、$1$。所以 67 是 1 的平方根却不是 $\\pm 1$，这对质数不可能：561 是合数。",
    ],
    [
      "$\\gcd(67 - 1, 561) = 33$ and $\\gcd(67 + 1, 561) = 17$, and $33 \\cdot 17 = 561$.",
      "$\\gcd(67 - 1, 561) = 33$，$\\gcd(67 + 1, 561) = 17$，而 $33 \\cdot 17 = 561$。",
    ],
    [
      "split off the powers of two from $n - 1$, compute the first term of the chain, and expose a factor from a square root of 1 that is not $\\pm 1$.",
      "从 $n - 1$ 中分出 2 的幂，计算链的第一项，并由不是 $\\pm 1$ 的 1 的平方根找出因子。",
    ],
  ),
  lesson(
    mobiusInversion,
    [
      "Suppose $\\sum_{d \\mid n} f(d) = n$ for every $n$. Möbius inversion gives $f(12) = \\sum_{d \\mid 12} \\mu(d) \\frac{12}{d} = 12 - 6 - 4 + 2 = 4$, since only the squarefree divisors $1, 2, 3, 6$ count.",
      "设对每个 $n$ 都有 $\\sum_{d \\mid n} f(d) = n$。莫比乌斯反演给出 $f(12) = \\sum_{d \\mid 12} \\mu(d) \\frac{12}{d} = 12 - 6 - 4 + 2 = 4$，因为只有无平方因子的除数 $1, 2, 3, 6$ 才计入。",
    ],
    [
      "$f$ is the totient, and $\\varphi(12) = 12 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 4$: the numbers $1, 5, 7, 11$.",
      "$f$ 就是欧拉函数，而 $\\varphi(12) = 12 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 4$：即 $1, 5, 7, 11$。",
    ],
    [
      "recover a function from its divisor sums, find the totient by inversion, and count primitive strings.",
      "由除数和恢复函数，用反演求欧拉函数，并数本原字符串。",
    ],
  ),
  lesson(
    averageOrder,
    [
      "Add the divisor counts from 1 to 10: $1 + 2 + 2 + 3 + 2 + 4 + 2 + 4 + 3 + 4 = 27$. On average a number up to 10 has 2.7 divisors, and this average grows like $\\ln n$.",
      "把 1 到 10 的除数个数相加：$1 + 2 + 2 + 3 + 2 + 4 + 2 + 4 + 3 + 4 = 27$。平均而言，不超过 10 的数有 2.7 个除数，这个平均值像 $\\ln n$ 一样增长。",
    ],
    [
      "Counting by the divisor instead, $d$ divides $\\left\\lfloor\\frac{10}{d}\\right\\rfloor$ of the numbers, and $10 + 5 + 3 + 2 + 2 + 1 + 1 + 1 + 1 + 1 = 27$.",
      "改为按除数计数，$d$ 整除其中 $\\left\\lfloor\\frac{10}{d}\\right\\rfloor$ 个数，而 $10 + 5 + 3 + 2 + 2 + 1 + 1 + 1 + 1 + 1 = 27$。",
    ],
    [
      "add the divisor function and the divisor sum up to $n$, and count coprime pairs with the Möbius function.",
      "求除数函数和除数和到 $n$ 的累加，并用莫比乌斯函数数互素的数对。",
    ],
  ),
  lesson(
    primeSize,
    [
      "The prime number theorem says that near $n$ about one number in $\\ln n$ is prime. Near 1000, $\\ln 1000 \\approx 6.9$, so the 100 numbers from 1000 to 1100 should hold about $\\frac{100}{6.9} \\approx 14.5$ primes; there are in fact 16.",
      "质数定理说，在 $n$ 附近大约每 $\\ln n$ 个数中有一个质数。在 1000 附近，$\\ln 1000 \\approx 6.9$，所以 1000 到 1100 这 100 个数中应有约 $\\frac{100}{6.9} \\approx 14.5$ 个质数；实际有 16 个。",
    ],
    [
      "The primes are $1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097$.",
      "这些质数是 $1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097$。",
    ],
    [
      "estimate how many primes lie below a bound, estimate the density of primes near a number, and use Bertrand's postulate.",
      "估计一个界以下有多少个质数，估计一个数附近质数的密度，并使用伯特兰公设。",
    ],
  ),
  lesson(
    primitiveExist,
    [
      "Does 18 have a primitive root? Its powers of 5 are $5, 7, 17, 13, 11, 1$, so 5 has order $6 = \\varphi(18)$ and is one. But 15 has none: modulo 3 and 5 the orders divide 2 and 4, so no unit has order more than $\\operatorname{lcm}(2, 4) = 4 < \\varphi(15) = 8$.",
      "18 有原根吗？5 的幂依次是 $5, 7, 17, 13, 11, 1$，所以 5 的阶是 $6 = \\varphi(18)$，它就是原根。但 15 没有：模 3 和模 5 时阶分别整除 2 和 4，所以没有单位的阶超过 $\\operatorname{lcm}(2, 4) = 4 < \\varphi(15) = 8$。",
    ],
    [
      "$18 = 2 \\cdot 3^{2}$ has the form $2p^{k}$, which the classification allows, while $15 = 3 \\cdot 5$ has two odd primes.",
      "$18 = 2 \\cdot 3^{2}$ 具有 $2p^{k}$ 的形式，分类允许它；而 $15 = 3 \\cdot 5$ 有两个奇质数。",
    ],
    [
      "decide which moduli have primitive roots, count the primitive roots, and find the largest order of a unit.",
      "判断哪些模有原根，数原根的个数，并求单位的最大阶。",
    ],
  ),
  lesson(
    indices,
    [
      "Solve $x^{2} \\equiv 5 \\pmod{11}$ with the primitive root 2. Since $2^{4} = 16 \\equiv 5$, the index of 5 is 4, and the congruence becomes $2 \\operatorname{ind}(x) \\equiv 4 \\pmod{10}$. So $\\operatorname{ind}(x)$ is 2 or 7, and $x$ is $2^{2} = 4$ or $2^{7} \\equiv 7$.",
      "用原根 2 解 $x^{2} \\equiv 5 \\pmod{11}$。因为 $2^{4} = 16 \\equiv 5$，5 的指标是 4，同余式变成 $2 \\operatorname{ind}(x) \\equiv 4 \\pmod{10}$。所以 $\\operatorname{ind}(x)$ 是 2 或 7，$x$ 是 $2^{2} = 4$ 或 $2^{7} \\equiv 7$。",
    ],
    ["$4^{2} = 16 = 11 + 5$ and $7^{2} = 49 = 44 + 5$.", "$4^{2} = 16 = 11 + 5$，$7^{2} = 49 = 44 + 5$。"],
    [
      "add indices to multiply, count the solutions of a power congruence, and count the power residues modulo a prime.",
      "用指标相加来做乘法，数幂同余式的解，并数模质数的幂剩余。",
    ],
  ),
  lesson(
    legendreFormula,
    [
      "How many zeros does $100!$ end in? Each zero needs a factor 5, and there are $\\left\\lfloor\\frac{100}{5}\\right\\rfloor + \\left\\lfloor\\frac{100}{25}\\right\\rfloor = 20 + 4 = 24$ of them, with twos to spare.",
      "$100!$ 末尾有多少个零？每个零需要一个因子 5，共有 $\\left\\lfloor\\frac{100}{5}\\right\\rfloor + \\left\\lfloor\\frac{100}{25}\\right\\rfloor = 20 + 4 = 24$ 个，而因子 2 有富余。",
    ],
    [
      "$100 = 400_{5}$ has digit sum 4, and $\\frac{100 - 4}{5 - 1} = 24$.",
      "$100 = 400_{5}$ 的数字和是 4，而 $\\frac{100 - 4}{5 - 1} = 24$。",
    ],
    [
      "find the exponent of a prime in a factorial, count trailing zeros, and count carries to find the exponent in a binomial coefficient.",
      "求阶乘中质数的指数，数末尾的零，并通过数进位求二项式系数中的指数。",
    ],
  ),
  lesson(
    lucas,
    [
      "Is $\\binom{10}{3}$ divisible by 3? In base 3, $10 = 101_{3}$ and $3 = 010_{3}$. The middle digits give $\\binom{0}{1} = 0$, so Lucas' theorem makes the whole product $\\binom{1}{0}\\binom{0}{1}\\binom{1}{0} = 0$ modulo 3.",
      "$\\binom{10}{3}$ 能被 3 整除吗？在 3 进制中，$10 = 101_{3}$，$3 = 010_{3}$。中间一位给出 $\\binom{0}{1} = 0$，所以卢卡斯定理使整个乘积 $\\binom{1}{0}\\binom{0}{1}\\binom{1}{0}$ 模 3 为 0。",
    ],
    ["$\\binom{10}{3} = 120 = 3 \\cdot 40$.", "$\\binom{10}{3} = 120 = 3 \\cdot 40$。"],
    [
      "reduce a binomial coefficient digit by digit, count the odd entries in a row of Pascal's triangle, and count the entries not divisible by $p$.",
      "逐位化简二项式系数，数帕斯卡三角形一行中的奇数项，并数不被 $p$ 整除的项。",
    ],
  ),
  lesson(
    descent,
    [
      "Does $x^{2} + y^{2} = 3z^{2}$ have a solution with $z \\ne 0$? Squares are 0 or 1 modulo 3, so $x^{2} + y^{2} \\equiv 0$ forces 3 to divide $x$ and $y$. Then 9 divides $3z^{2}$, so 3 divides $z$, and dividing all three by 3 gives a smaller solution, forever. So there is none.",
      "$x^{2} + y^{2} = 3z^{2}$ 有 $z \\ne 0$ 的解吗？平方数模 3 是 0 或 1，所以 $x^{2} + y^{2} \\equiv 0$ 迫使 3 整除 $x$ 和 $y$。于是 9 整除 $3z^{2}$，所以 3 整除 $z$，三者都除以 3 得到更小的解，永无止境。所以没有解。",
    ],
    [
      "Modulo 3 the sums of two residues from $\\{0, 1\\}$ are $0 + 0 = 0$, $0 + 1 = 1$ and $1 + 1 = 2$, and only $0 + 0$ gives 0.",
      "模 3 时，从 $\\{0, 1\\}$ 中取两个剩余相加得 $0 + 0 = 0$、$0 + 1 = 1$、$1 + 1 = 2$，只有 $0 + 0$ 得 0。",
    ],
    [
      "find the squares modulo a small number, rule out an equation by a congruence, and carry out a descent step.",
      "求模小数的平方，用同余排除方程，并进行递降的一步。",
    ],
  ),
  lesson(
    sumOfSquaresFunction,
    [
      "In how many ways is 25 a sum of two squares, counting order and signs? Its divisors $1, 5, 25$ are all 1 modulo 4, so $r_2(25) = 4(3 - 0) = 12$.",
      "25 写成两个平方数之和有多少种方式（计顺序和符号）？它的除数 $1, 5, 25$ 都模 4 余 1，所以 $r_2(25) = 4(3 - 0) = 12$。",
    ],
    [
      "$25 = 0^{2} + 5^{2} = 3^{2} + 4^{2}$: the pairs $(0, \\pm 5)$ and $(\\pm 5, 0)$ give 4, and $(\\pm 3, \\pm 4)$ and $(\\pm 4, \\pm 3)$ give 8.",
      "$25 = 0^{2} + 5^{2} = 3^{2} + 4^{2}$：$(0, \\pm 5)$ 和 $(\\pm 5, 0)$ 给出 4 个，$(\\pm 3, \\pm 4)$ 和 $(\\pm 4, \\pm 3)$ 给出 8 个。",
    ],
    [
      "count representations from divisors, see that a prime $4k + 1$ has 8 and a prime $4k + 3$ has none, and count lattice points in a disc.",
      "由除数计算表示数，看到质数 $4k + 1$ 有 8 个而质数 $4k + 3$ 没有，并数圆内的格点。",
    ],
  ),
  lesson(
    gaussLemma,
    [
      "Is 3 a square modulo 7? The multiples $3, 6, 9$ leave $3, 6, 2$, and only 6 lies above $\\frac{7}{2}$. So $\\mu = 1$ and Gauss's lemma gives $\\left(\\frac{3}{7}\\right) = (-1)^{\\mu} = -1$: it is not.",
      "3 是模 7 的平方数吗？倍数 $3, 6, 9$ 的剩余是 $3, 6, 2$，只有 6 大于 $\\frac{7}{2}$。所以 $\\mu = 1$，高斯引理给出 $\\left(\\frac{3}{7}\\right) = (-1)^{\\mu} = -1$：不是。",
    ],
    [
      "$3^{3} = 27 = 4 \\cdot 7 - 1$, so Euler's criterion gives $-1$ too; and the squares modulo 7 are $1, 2, 4$.",
      "$3^{3} = 27 = 4 \\cdot 7 - 1$，所以欧拉判别法也给出 $-1$；而模 7 的平方数是 $1, 2, 4$。",
    ],
    [
      "count the large residues among the multiples, read the symbol from the count, and find the symbol of 2.",
      "数倍数中的大剩余，由个数读出符号，并求 2 的符号。",
    ],
  ),
  lesson(
    quadraticForms,
    [
      "The form $x^{2} + xy + y^{2}$ has discriminant $1 - 4 = -3$. It represents the prime 7, since $2^{2} + 2 \\cdot 1 + 1^{2} = 7$, and 7 is 1 modulo 3, as every prime it represents apart from 3 must be.",
      "型 $x^{2} + xy + y^{2}$ 的判别式是 $1 - 4 = -3$。它表示质数 7，因为 $2^{2} + 2 \\cdot 1 + 1^{2} = 7$，而 7 模 3 余 1，除 3 以外它表示的每个质数都必须如此。",
    ],
    [
      "$-3 \\equiv 4 = 2^{2} \\pmod{7}$, so the discriminant is a square modulo 7.",
      "$-3 \\equiv 4 = 2^{2} \\pmod{7}$，所以判别式模 7 是平方数。",
    ],
    [
      "compute the discriminant of a form, change variables without changing it, and decide which primes a form represents.",
      "计算型的判别式，在不改变它的前提下替换变量，并判断一个型表示哪些质数。",
    ],
  ),
  lesson(
    periodicCf,
    [
      "What number is $[1; 2, 2, 2, \\ldots]$? Call it $x$. Then $x - 1$ is $\\frac{1}{1 + x}$, because the tail $[2; 2, 2, \\ldots]$ equals $1 + x$. Clearing the fraction gives $x^{2} = 2$, so the fraction is $\\sqrt{2}$.",
      "$[1; 2, 2, 2, \\ldots]$ 是哪个数？记它为 $x$。则 $x - 1$ 等于 $\\frac{1}{1 + x}$，因为尾部 $[2; 2, 2, \\ldots]$ 等于 $1 + x$。去分母得 $x^{2} = 2$，所以这个连分数是 $\\sqrt{2}$。",
    ],
    [
      "The convergents are $1, \\frac{3}{2}, \\frac{7}{5}, \\frac{17}{12}$, and $17^{2} - 2 \\cdot 12^{2} = 289 - 288 = 1$.",
      "渐近分数是 $1, \\frac{3}{2}, \\frac{7}{5}, \\frac{17}{12}$，而 $17^{2} - 2 \\cdot 12^{2} = 289 - 288 = 1$。",
    ],
    [
      "find the value of a repeating fraction, expand the square root of $a^{2} + 1$, and compute one of its convergents.",
      "求循环连分数的值，展开 $a^{2} + 1$ 的平方根，并计算它的一个渐近分数。",
    ],
  ),
  lesson(
    dirichletSeries,
    [
      "What is the coefficient of $\\frac{1}{6^{s}}$ in $\\zeta(s)^{2}$? It counts the pairs $(d, e)$ with $de = 6$: $(1, 6), (2, 3), (3, 2), (6, 1)$. So it is $4 = \\tau(6)$.",
      "$\\zeta(s)^{2}$ 中 $\\frac{1}{6^{s}}$ 的系数是多少？它数满足 $de = 6$ 的数对 $(d, e)$：$(1, 6), (2, 3), (3, 2), (6, 1)$。所以它是 $4 = \\tau(6)$。",
    ],
    ["$6 = 2 \\cdot 3$, so $\\tau(6) = 2 \\cdot 2 = 4$.", "$6 = 2 \\cdot 3$，所以 $\\tau(6) = 2 \\cdot 2 = 4$。"],
    [
      "read the coefficients of a product of series, compute an Euler factor of zeta, and find the coefficients of $\\frac{1}{\\zeta(s)}$.",
      "读出级数乘积的系数，计算 ζ 函数的欧拉因子，并求 $\\frac{1}{\\zeta(s)}$ 的系数。",
    ],
  ),
  lesson(
    quadraticIntegers,
    [
      "In $\\mathbb{Z}[\\sqrt{-5}]$, $6 = 2 \\cdot 3 = (1 + \\sqrt{-5})(1 - \\sqrt{-5})$. The norms of the four factors are 4, 9, 6 and 6, and since $a^{2} + 5b^{2}$ is never 2 or 3, none of them splits further. So 6 has two different factorizations.",
      "在 $\\mathbb{Z}[\\sqrt{-5}]$ 中，$6 = 2 \\cdot 3 = (1 + \\sqrt{-5})(1 - \\sqrt{-5})$。四个因子的范数是 4、9、6、6，而 $a^{2} + 5b^{2}$ 永远不是 2 或 3，所以它们都不能再分。所以 6 有两种不同的分解。",
    ],
    ["$(1 + \\sqrt{-5})(1 - \\sqrt{-5}) = 1 - (-5) = 6$.", "$(1 + \\sqrt{-5})(1 - \\sqrt{-5}) = 1 - (-5) = 6$。"],
    [
      "multiply norms, find the units from the norm, and see unique factorization fail in $\\mathbb{Z}[\\sqrt{-5}]$.",
      "把范数相乘，由范数求单位，并看到唯一分解在 $\\mathbb{Z}[\\sqrt{-5}]$ 中失败。",
    ],
  ),
];
