// More of Number Theory: valuations, divisibility tests, repeating decimals, Hensel lifting, Mersenne numbers,
// pseudoprimes, the Jacobi symbol, Dirichlet convolution, Farey sequences, best approximations,
// Gaussian integers, Fibonacci divisibility, primes in progressions and sums of several squares.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import {
  ask,
  choose,
  divisors,
  factorize,
  orderMod,
  type Pair,
  point,
  powMod,
  primesUpTo,
  same,
  topic,
  totient,
} from "../university-kit.ts";

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
        "The valuation $v_p(n)$ is the exponent of the prime $p$ in $n$. It turns products into sums, since $v_p(ab) = v_p(a) + v_p(b)$, and powers into multiples. So a question about the exact power of a prime dividing a large product becomes simple addition.",
        "赋值 $v_p(n)$ 是素数 $p$ 在 $n$ 中的指数。它把乘积变成和，因为 $v_p(ab) = v_p(a) + v_p(b)$，也把幂变成倍数。所以大乘积被素数整除的确切幂次，就变成了简单的加法。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5]);
        const [i, j] = [rng.int(1, 4), rng.int(1, 3)];
        const [u, v] = [rng.pick([1, 7, 11, 13]), rng.pick([1, 7, 11, 13, 17])];
        const k = rng.int(2, 6);
        const a = p ** i * u;
        const b = p ** j * v;
        const answer = i * k + j;
        return ask(
          [`What is $v_{${p}}(${a}^{${k}} \\cdot ${b})$?`, `$v_{${p}}(${a}^{${k}} \\cdot ${b})$ 是多少？`],
          answer,
          [i + j, i * k, (i + j) * k, answer + 1],
          [
            `$v_{${p}}(${a}) = ${i}$ and $v_{${p}}(${b}) = ${j}$, so the valuation is $${k} \\cdot ${i} + ${j} = ${answer}$.`,
            `$v_{${p}}(${a}) = ${i}$，$v_{${p}}(${b}) = ${j}$，所以赋值是 $${k} \\cdot ${i} + ${j} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "trailing-zeros-of-a-factorial",
      ["Trailing zeros of a factorial", "阶乘末尾的零"],
      [
        "Each trailing zero of $n!$ needs a factor of 10, and factors of 2 are more plentiful than factors of 5. So the number of zeros is $v_5(n!) = \\lfloor \\frac{n}{5} \\rfloor + \\lfloor \\frac{n}{25} \\rfloor + \\cdots$. The later terms count the numbers that contribute more than one factor of 5.",
        "$n!$ 末尾的每个零都需要一个因子 10，而因子 2 比因子 5 多。所以零的个数是 $v_5(n!) = \\lfloor \\frac{n}{5} \\rfloor + \\lfloor \\frac{n}{25} \\rfloor + \\cdots$。后面几项数的是贡献不止一个因子 5 的数。",
      ],
      (rng) => {
        const n = rng.int(26, 400);
        const answer = legendreExponent(n, 5);
        return ask(
          [`How many zeros does $${n}!$ end with?`, `$${n}!$ 末尾有多少个零？`],
          answer,
          [Math.floor(n / 5), Math.floor(n / 10), answer + 1, legendreExponent(n, 2)].filter((v) => v !== answer),
          [
            `Count the factors of 5: $\\lfloor \\frac{${n}}{5} \\rfloor + \\lfloor \\frac{${n}}{25} \\rfloor${n >= 125 ? ` + \\lfloor \\frac{${n}}{125} \\rfloor` : ""} = ${answer}$.`,
            `数因子 5 的个数：$\\lfloor \\frac{${n}}{5} \\rfloor + \\lfloor \\frac{${n}}{25} \\rfloor${n >= 125 ? ` + \\lfloor \\frac{${n}}{125} \\rfloor` : ""} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-valuation-of-a-binomial-coefficient",
      ["The valuation of a binomial coefficient", "二项式系数的赋值"],
      [
        "Since $\\binom{n}{k} = \\frac{n!}{k! (n - k)!}$, its valuation is $v_p(n!) - v_p(k!) - v_p((n - k)!)$, and each term comes from Legendre's formula. Kummer's theorem gives the same number another way: it counts the carries when $k$ and $n - k$ are added in base $p$.",
        "因为 $\\binom{n}{k} = \\frac{n!}{k! (n - k)!}$，它的赋值是 $v_p(n!) - v_p(k!) - v_p((n - k)!)$，每一项都由勒让德公式得出。库默尔定理用另一种方式给出同一个数：它等于在 $p$ 进制下把 $k$ 和 $n - k$ 相加时的进位次数。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5]);
        const n = rng.int(10, 60);
        const k = rng.int(2, n - 2);
        const [a, b, c] = [legendreExponent(n, p), legendreExponent(k, p), legendreExponent(n - k, p)];
        const answer = a - b - c;
        return ask(
          [`What is $v_{${p}} \\left( \\binom{${n}}{${k}} \\right)$?`, `$v_{${p}} \\left( \\binom{${n}}{${k}} \\right)$ 是多少？`],
          answer,
          [a, a - b, answer + 1, answer + 2],
          [
            `The three factorials have valuations ${a}, ${b} and ${c}, so the answer is $${a} - ${b} - ${c} = ${answer}$.`,
            `三个阶乘的赋值分别是 ${a}、${b} 和 ${c}，所以答案是 $${a} - ${b} - ${c} = ${answer}$。`,
          ],
        );
      },
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
        "Because $10 \\equiv 1 \\pmod{9}$, every power of 10 is also 1 modulo 9, so a number has the same remainder as the sum of its digits. The same holds modulo 3. This is the reason behind the classical test for divisibility by 9, and the rule of casting out nines.",
        "因为 $10 \\equiv 1 \\pmod{9}$，10 的每个幂模 9 也都是 1，所以一个数与它的数字和有相同的余数。模 3 也一样。这就是能被 9 整除的经典判别法和弃九法的道理。",
      ],
      (rng) => {
        const n = rng.int(1000, 999999);
        const m = rng.pick([3, 9]);
        const sum = digitsOf(n).reduce((x, y) => x + y, 0);
        const answer = n % m;
        return ask(
          [`What is the remainder when ${n} is divided by ${m}?`, `${n} 除以 ${m} 的余数是多少？`],
          answer,
          [(answer + 1) % m, (answer + 2) % m, n % 10, sum].filter((v) => v !== answer),
          [
            `The digit sum is ${sum}, and it leaves the same remainder as the number: ${answer}.`,
            `数字和是 ${sum}，它与原数的余数相同，都是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-alternating-sum-for-eleven",
      ["The alternating sum for eleven", "判别 11 的交错和"],
      [
        "Because $10 \\equiv -1 \\pmod{11}$, the powers of 10 alternate between 1 and $-1$. So a number is congruent modulo 11 to the alternating sum of its digits, starting with a plus sign at the units digit. In particular, it is divisible by 11 exactly when that sum is.",
        "因为 $10 \\equiv -1 \\pmod{11}$，10 的幂在 1 和 $-1$ 之间交替。所以一个数模 11 同余于它各位数字的交错和，从个位起取正号。特别地，当且仅当这个和能被 11 整除时，这个数能被 11 整除。",
      ],
      (rng) => {
        const n = rng.int(1000, 999999);
        const answer = n % 11;
        const digits = digitsOf(n).reverse();
        const alternating = digits.reduce((x, d, i) => x + (i % 2 === 0 ? d : -d), 0);
        const written = digits.map((d, i) => (i === 0 ? String(d) : `${i % 2 === 0 ? "+" : "-"} ${d}`)).join(" ");
        return ask(
          [`What is the remainder when ${n} is divided by 11?`, `${n} 除以 11 的余数是多少？`],
          answer,
          [(answer + 1) % 11, digits.reduce((x, y) => x + y, 0) % 11, (answer + 10) % 11, (answer + 2) % 11].filter((v) => v !== answer),
          [
            `From the units digit, the alternating sum is $${written} = ${alternating}$, which leaves remainder ${answer} on division by 11.`,
            `从个位起，交错和是 $${written} = ${alternating}$，它除以 11 余 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "a-test-for-other-divisors",
      ["A test for other divisors", "其他除数的判别法"],
      [
        "Powers of 10 are eventually simple for many divisors. Modulo 8, only the last three digits matter, because 1000 is a multiple of 8. Modulo 7, 11 and 13 together, $1001 = 7 \\cdot 11 \\cdot 13$ gives $1000 \\equiv -1$, so alternate sums of three-digit blocks reveal the remainder.",
        "对许多除数，10 的幂最终很简单。模 8 时只看末三位，因为 1000 是 8 的倍数。对 7、11 和 13，$1001 = 7 \\cdot 11 \\cdot 13$ 给出 $1000 \\equiv -1$，所以每三位分块取交错和就能得到余数。",
      ],
      (rng) => {
        const m = rng.pick([7, 13]);
        const high = rng.int(1, 99);
        const low = rng.int(100, 999);
        const n = high * 1000 + low;
        const answer = n % m;
        return ask(
          [
            `Use $1000 \\equiv -1$ to find the remainder when ${n} is divided by ${m}.`,
            `利用 $1000 \\equiv -1$，求 ${n} 除以 ${m} 的余数。`,
          ],
          answer,
          [(low + high) % m, low % m, (answer + 1) % m, high % m].filter((v) => v !== answer),
          [
            `$${n} \\equiv ${low} - ${high} = ${low - high} \\pmod{${m}}$, which leaves remainder ${answer}.`,
            `$${n} \\equiv ${low} - ${high} = ${low - high} \\pmod{${m}}$，余数是 ${answer}。`,
          ],
        );
      },
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
        "When $n$ is coprime to 10, the decimal of $\\frac{1}{n}$ repeats from the start, with period equal to the order of 10 modulo $n$. Long division makes this visible: the remainders are the powers of 10 modulo $n$, and the digits repeat as soon as a remainder does.",
        "当 $n$ 与 10 互素时，$\\frac{1}{n}$ 的小数从头开始循环，周期等于 10 模 $n$ 的阶。长除法能让人看清这一点：余数就是 10 的幂模 $n$，余数一重复，数字就重复。",
      ],
      (rng) => {
        const n = rng.pick(Array.from({ length: 120 }, (_, i) => i + 3).filter((v) => gcd(v, 10) === 1));
        const answer = orderMod(10, n);
        return ask(
          [`What is the period of the repeating decimal of $\\frac{1}{${n}}$?`, `$\\frac{1}{${n}}$ 的循环小数的周期是多少？`],
          answer,
          [totient(n), n - 1, answer + 1, answer * 2].filter((v) => v !== answer),
          [
            `The period is the smallest $k$ with $10^k \\equiv 1 \\pmod{${n}}$, and this first happens at $k = ${answer}$.`,
            `周期是满足 $10^k \\equiv 1 \\pmod{${n}}$ 的最小 $k$，第一次满足是在 $k = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "the-digits-before-the-repeat",
      ["The digits before the repeat", "循环前的数字"],
      [
        "A fraction in lowest terms has a terminating decimal exactly when its denominator has only the primes 2 and 5. In general write $n = 2^a 5^b m$ with $m$ coprime to 10. The non-repeating part then has $\\max(a, b)$ digits, and the repeating part has the period that comes from $m$.",
        "最简分数的小数有限，当且仅当分母只含素因子 2 和 5。一般地，写 $n = 2^a 5^b m$，其中 $m$ 与 10 互素。不循环部分有 $\\max(a, b)$ 位，循环部分的周期由 $m$ 决定。",
      ],
      (rng) => {
        const [a, b] = [rng.int(0, 5), rng.int(0, 3)];
        const m = rng.pick([3, 7, 9, 11, 13, 17, 21]);
        const n = 2 ** a * 5 ** b * m;
        const answer = Math.max(a, b);
        return ask(
          [
            `How many digits come before the repeating part in the decimal of $\\frac{1}{${n}}$?`,
            `$\\frac{1}{${n}}$ 的小数中，循环部分之前有多少位数字？`,
          ],
          answer,
          [a + b, Math.min(a, b) === answer ? answer + 1 : Math.min(a, b), answer + 1, answer + 2],
          [
            `$${n} = 2^{${a}} \\cdot 5^{${b}} \\cdot ${m}$, so the number of digits is the larger of ${a} and ${b}, which is ${answer}.`,
            `$${n} = 2^{${a}} \\cdot 5^{${b}} \\cdot ${m}$，所以位数是 ${a} 和 ${b} 中较大的一个，即 ${answer}。`,
          ],
        );
      },
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
        "If $f(r) \\equiv 0 \\pmod{p}$ and $f'(r)$ is not divisible by $p$, then there is a unique root modulo $p^2$ of the form $r + p t$. Expanding gives $f(r) + p t f'(r) \\equiv 0 \\pmod{p^2}$, a linear congruence for $t$. Repeating the step reaches any power of $p$.",
        "如果 $f(r) \\equiv 0 \\pmod{p}$，且 $f'(r)$ 不被 $p$ 整除，那么模 $p^2$ 有唯一形如 $r + p t$ 的根。展开得 $f(r) + p t f'(r) \\equiv 0 \\pmod{p^2}$，这是关于 $t$ 的线性同余式。重复这一步就能到达 $p$ 的任何幂。",
      ],
      (rng) => {
        const p = rng.pick([3, 5, 7, 11]);
        const r = rng.int(1, (p - 1) / 2);
        const t = rng.int(1, p - 1);
        const root = r + p * t;
        const square = root * root;
        const a = square % (p * p);
        return ask(
          [
            `The congruence $x^2 \\equiv ${a} \\pmod{${p * p}}$ has a solution with $x \\equiv ${r} \\pmod{${p}}$. What is this solution between 0 and ${p * p}?`,
            `同余式 $x^2 \\equiv ${a} \\pmod{${p * p}}$ 有一个解满足 $x \\equiv ${r} \\pmod{${p}}$。这个解在 0 和 ${p * p} 之间是多少？`,
          ],
          root,
          [r, p * p - root, (root + p) % (p * p), a],
          [
            `Try $x = ${r} + ${p} t$. Then $${r * r} + ${2 * r * p} t \\equiv ${a} \\pmod{${p * p}}$ gives $t = ${t}$, so $x = ${root}$.`,
            `试 $x = ${r} + ${p} t$。则 $${r * r} + ${2 * r * p} t \\equiv ${a} \\pmod{${p * p}}$ 给出 $t = ${t}$，所以 $x = ${root}$。`,
          ],
        );
      },
    ),
    point(
      "counting-square-roots-modulo-a-prime-power",
      ["Counting square roots modulo a prime power", "模素数幂的平方根个数"],
      [
        "For an odd prime $p$ and a number $a$ not divisible by $p$, Hensel's lemma says each square root of $a$ modulo $p$ lifts uniquely. So $x^2 \\equiv a \\pmod{p^k}$ has exactly as many solutions as it has modulo $p$: two when $a$ is a quadratic residue, and none otherwise, for every $k$.",
        "对奇素数 $p$ 和不被 $p$ 整除的 $a$，亨泽尔引理说 $a$ 模 $p$ 的每个平方根都能唯一提升。所以 $x^2 \\equiv a \\pmod{p^k}$ 的解数与模 $p$ 相同：$a$ 是二次剩余时两个，否则没有，对每个 $k$ 都如此。",
      ],
      (rng) => {
        const p = rng.pick([3, 5, 7, 11, 13]);
        const k = rng.int(2, 4);
        const a = rng.int(1, p - 1);
        const answer = legendre(a, p) === 1 ? 2 : 0;
        const multiple = a + p * rng.int(0, 3);
        return ask(
          [
            `How many solutions does $x^2 \\equiv ${multiple} \\pmod{${p}^{${k}}}$ have?`,
            `$x^2 \\equiv ${multiple} \\pmod{${p}^{${k}}}$ 有多少个解？`,
          ],
          answer,
          [answer === 2 ? 0 : 2, 1, k, 2 * k].filter((v) => v !== answer),
          [
            `Modulo ${p}, the number reduces to ${a}, which is ${answer === 2 ? "a quadratic residue, so it has two square roots, and each lifts uniquely" : "not a quadratic residue, so there is nothing to lift"}.`,
            `模 ${p} 时这个数化为 ${a}，它${answer === 2 ? "是二次剩余，有两个平方根，每个都能唯一提升" : "不是二次剩余，所以没有可提升的根"}。`,
          ],
        );
      },
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
        "If $d$ divides $n$, then $2^d - 1$ divides $2^n - 1$, by the factorization of $x^k - 1$ with $x = 2^d$. So a Mersenne number $2^n - 1$ can be prime only when $n$ is prime. The converse fails: $2^{11} - 1 = 23 \\cdot 89$ even though 11 is prime.",
        "如果 $d$ 整除 $n$，那么 $2^d - 1$ 整除 $2^n - 1$，这由 $x^k - 1$（$x = 2^d$）的因式分解得出。所以梅森数 $2^n - 1$ 只有当 $n$ 是素数时才可能是素数。反过来不成立：11 是素数，但 $2^{11} - 1 = 23 \\cdot 89$。",
      ],
      (rng) => {
        const d = rng.int(2, 7);
        const k = rng.int(2, 6);
        const n = d * k;
        const answer = 2 ** d - 1;
        return ask(
          [
            `Since ${d} divides ${n}, which factor of $2^{${n}} - 1$ does this give, in the form $2^{${d}} - 1$?`,
            `因为 ${d} 整除 ${n}，由此得到 $2^{${n}} - 1$ 的哪个因子（形如 $2^{${d}} - 1$）？`,
          ],
          answer,
          [2 ** d, 2 ** k - 1, 2 ** d + 1, 2 ** (d - 1)].filter((v) => v !== answer),
          [
            `With $x = 2^{${d}}$, the number $x^{${k}} - 1$ has the factor $x - 1 = ${answer}$.`,
            `令 $x = 2^{${d}}$，则 $x^{${k}} - 1$ 有因子 $x - 1 = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "an-even-perfect-number",
      ["An even perfect number", "偶完全数"],
      [
        "Euclid showed that when $2^p - 1$ is prime, the number $2^{p-1} (2^p - 1)$ is perfect, and Euler showed that every even perfect number has this form. So each Mersenne prime gives one even perfect number. No odd perfect number is known, and none has ever been ruled out.",
        "欧几里得证明：当 $2^p - 1$ 是素数时，$2^{p-1} (2^p - 1)$ 是完全数；欧拉证明每个偶完全数都是这种形式。所以每个梅森素数对应一个偶完全数。至今没有发现奇完全数，也没有人证明它不存在。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7, 13, 17, 19]);
        const m = 2 ** p - 1;
        const perfect = 2 ** (p - 1) * m;
        const kind = rng.int(0, 3);
        const given: Pair = [
          `$2^{${p}} - 1 = ${m}$ is prime, and $N = 2^{${p - 1}} \\cdot ${m}$.`,
          `$2^{${p}} - 1 = ${m}$ 是素数，$N = 2^{${p - 1}} \\cdot ${m}$。`,
        ];
        if (kind === 0) {
          return ask(
            [`${given[0]} What is $N$?`, `${given[1]}$N$ 是多少？`],
            perfect,
            [2 ** p * m, m * m, 2 ** (p - 1) + m],
            [
              `Multiplying gives $2^{${p - 1}} \\cdot ${m} = ${perfect}$, and this number is perfect.`,
              `相乘得 $2^{${p - 1}} \\cdot ${m} = ${perfect}$，这个数是完全数。`,
            ],
          );
        }
        if (kind === 1) {
          return ask(
            [`${given[0]} How many positive divisors does $N$ have?`, `${given[1]}$N$ 有多少个正因子？`],
            2 * p,
            [p, p + 1, 2 * p - 1, 2 * p + 2],
            [
              `The power of 2 gives ${p} choices and the prime gives 2, so there are $${p} \\cdot 2 = ${2 * p}$ divisors.`,
              `2 的幂有 ${p} 种选择，素数有 2 种，所以共有 $${p} \\cdot 2 = ${2 * p}$ 个因子。`,
            ],
          );
        }
        if (kind === 2) {
          return ask(
            [
              `${given[0]} What is the sum $\\sigma(N)$ of all positive divisors of $N$?`,
              `${given[1]}$N$ 的所有正因子之和 $\\sigma(N)$ 是多少？`,
            ],
            2 * perfect,
            [perfect, 2 * perfect - 1, 2 * perfect + m],
            [
              `A perfect number has $\\sigma(N) = 2N$, and here $2N = ${2 * perfect}$.`,
              `完全数满足 $\\sigma(N) = 2N$，这里 $2N = ${2 * perfect}$。`,
            ],
          );
        }
        return ask(
          [
            `${given[0]} What is the sum of the positive divisors of $N$ other than $N$ itself?`,
            `${given[1]}除 $N$ 本身外，$N$ 的正因子之和是多少？`,
          ],
          perfect,
          [2 * perfect, perfect - 1, perfect + m],
          [`$N$ is perfect, so its other divisors add up to $N = ${perfect}$.`, `$N$ 是完全数，所以其余因子之和就是 $N = ${perfect}$。`],
        );
      },
    ),
    point(
      "fermat-numbers-are-coprime",
      ["Fermat numbers are coprime", "费马数互素"],
      [
        "The Fermat numbers are $F_n = 2^{2^n} + 1$. They satisfy $F_0 F_1 \\cdots F_{n-1} = F_n - 2$, so any common factor of two of them would divide 2, and they are odd. Hence they are pairwise coprime, which gives another proof that there are infinitely many primes.",
        "费马数是 $F_n = 2^{2^n} + 1$。它们满足 $F_0 F_1 \\cdots F_{n-1} = F_n - 2$，所以其中任意两个的公因子都整除 2，而它们都是奇数。因此它们两两互素，这又证明了素数有无穷多个。",
      ],
      (rng) => {
        const fermat = (n: number) => 2 ** (2 ** n) + 1;
        if (rng.bool()) {
          const n = rng.int(2, 5);
          const F = fermat(n);
          return ask(
            [
              `Given $F_{${n}} = ${F}$, what is the product $F_0 F_1 \\cdots F_{${n - 1}}$?`,
              `已知 $F_{${n}} = ${F}$，乘积 $F_0 F_1 \\cdots F_{${n - 1}}$ 是多少？`,
            ],
            F - 2,
            [F, F - 1, F + 2],
            [`The identity gives $F_{${n}} - 2 = ${F - 2}$.`, `恒等式给出 $F_{${n}} - 2 = ${F - 2}$。`],
          );
        }
        const n = rng.int(1, 4);
        const c = rng.int(2, 9);
        const [F, E] = [fermat(n), fermat(n - 1)];
        const answer = gcd(c * F, E);
        return ask(
          [
            `With $F_{${n}} = ${F}$ and $F_{${n - 1}} = ${E}$, what is $\\gcd(${c} F_{${n}}, F_{${n - 1}})$?`,
            `已知 $F_{${n}} = ${F}$，$F_{${n - 1}} = ${E}$，$\\gcd(${c} F_{${n}}, F_{${n - 1}})$ 是多少？`,
          ],
          answer,
          [F, c, E, 2].filter((v) => v !== answer),
          [
            `Fermat numbers are coprime, so only the factor ${c} can share anything with $F_{${n - 1}}$, and the result is ${answer}.`,
            `费马数互素，所以只有因子 ${c} 可能与 $F_{${n - 1}}$ 有公因子，结果是 ${answer}。`,
          ],
        );
      },
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
        "If $a^{n-1}$ is not 1 modulo $n$, then $a$ is a witness that $n$ is composite. If $n$ is composite and yet $a^{n-1} \\equiv 1$, then $a$ is called a Fermat liar, and $n$ a pseudoprime to base $a$. So passing the test does not prove that a number is prime.",
        "如果 $a^{n-1}$ 模 $n$ 不是 1，$a$ 就是 $n$ 为合数的证人。如果 $n$ 是合数却有 $a^{n-1} \\equiv 1$，$a$ 就称为费马说谎者，$n$ 称为以 $a$ 为底的伪素数。所以通过检验并不能证明一个数是素数。",
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
        const liar: Pair = [`${a} is a Fermat liar for ${n}`, `${a} 是 ${n} 的费马说谎者`];
        const witness: Pair = [`${a} is a witness that ${n} is composite`, `${a} 是 ${n} 为合数的证人`];
        return choose(
          rng,
          [
            `The number ${n} is composite, and $${a}^{${n - 1}} \\equiv ${value} \\pmod{${n}}$. Which statement is correct?`,
            `${n} 是合数，并且 $${a}^{${n - 1}} \\equiv ${value} \\pmod{${n}}$。哪个说法正确？`,
          ],
          value === 1 ? liar : witness,
          [
            liar,
            witness,
            [`This proves ${n} is prime`, `这证明 ${n} 是素数`],
            [`This says nothing about base ${a}`, `这对底 ${a} 没有任何说明`],
          ],
          [
            value === 1
              ? "The power is 1 even though the number is composite, so the test is fooled."
              : "The power is not 1, which cannot happen for a prime when the base is coprime to it, so the test exposes the number.",
            value === 1
              ? "尽管这个数是合数，幂却等于 1，所以检验被骗过了。"
              : "幂不等于 1，这对素数和与它互素的底不可能发生，所以检验揭示了这个数是合数。",
          ],
        );
      },
    ),
    point(
      "korselts-criterion",
      ["Korselt's criterion", "科塞特判据"],
      [
        "A Carmichael number is a composite that passes the Fermat test for every base coprime to it. Korselt's criterion says that $n$ is one exactly when $n$ is squarefree and $p - 1$ divides $n - 1$ for each prime $p$ dividing $n$. The smallest example is $561 = 3 \\cdot 11 \\cdot 17$.",
        "卡迈克尔数是对每个与它互素的底都能通过费马检验的合数。科塞特判据说：$n$ 是卡迈克尔数，当且仅当 $n$ 无平方因子，且对 $n$ 的每个素因子 $p$，$p - 1$ 整除 $n - 1$。最小的例子是 $561 = 3 \\cdot 11 \\cdot 17$。",
      ],
      (rng) => {
        const carmichael = rng.pick(CARMICHAEL);
        const prime = rng.pick(factorize(carmichael).map(([p]) => p));
        const askValue = rng.bool();
        const answer = (carmichael - 1) / (prime - 1);
        const others = rng.sample([15, 21, 45, 91, 341, 1387], 3);
        if (askValue) {
          return ask(
            [
              `The Carmichael number ${carmichael} has the prime factor ${prime}. What is $(${carmichael} - 1) \\div (${prime} - 1)$?`,
              `卡迈克尔数 ${carmichael} 有素因子 ${prime}。$(${carmichael} - 1) \\div (${prime} - 1)$ 是多少？`,
            ],
            answer,
            [answer + 1, answer - 1, carmichael - 1, prime - 1],
            [
              `Korselt's criterion says this division comes out whole: $${carmichael - 1} \\div ${prime - 1} = ${answer}$.`,
              `科塞特判据说这个除法得整数：$${carmichael - 1} \\div ${prime - 1} = ${answer}$。`,
            ],
          );
        }
        return choose(
          rng,
          ["Which of these numbers is a Carmichael number?", "下面哪个数是卡迈克尔数？"],
          same(String(carmichael)),
          others.map((v) => same(String(v))),
          [
            `${carmichael} is squarefree, with $p - 1$ dividing ${carmichael - 1} for each of its primes. Each of the others fails Korselt's criterion, through a square factor or through a prime whose predecessor does not divide the number minus 1.`,
            `${carmichael} 无平方因子，且每个素因子的 $p - 1$ 都整除 ${carmichael - 1}。其他的数都不满足科塞特判据：要么有平方因子，要么有某个素因子减 1 不整除这个数减 1。`,
          ],
        );
      },
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
        "For an odd $n = p_1 p_2 \\cdots p_k$, the Jacobi symbol is the product of the Legendre symbols of $a$ modulo each $p_i$. A value of $-1$ proves that $a$ is not a square modulo $n$. A value of $+1$ proves nothing, since two minus signs can cancel.",
        "对奇数 $n = p_1 p_2 \\cdots p_k$，雅可比符号是 $a$ 模每个 $p_i$ 的勒让德符号之积。值为 $-1$ 证明 $a$ 模 $n$ 不是平方数。值为 $+1$ 不能说明什么，因为两个负号可以抵消。",
      ],
      (rng) => {
        const [p, q] = rng.sample([3, 5, 7, 11, 13], 2) as [number, number];
        const n = p * q;
        let a = rng.int(2, 30);
        while (gcd(a, n) !== 1) a++;
        const [x, y] = [legendre(a, p), legendre(a, q)];
        const answer = x * y;
        return ask(
          [`What is the Jacobi symbol $\\left( \\frac{${a}}{${n}} \\right)$?`, `雅可比符号 $\\left( \\frac{${a}}{${n}} \\right)$ 是多少？`],
          answer,
          [-answer, 0, 2, -2],
          [
            `$${n} = ${p} \\cdot ${q}$, and the Legendre symbols are ${x} modulo ${p} and ${y} modulo ${q}. Their product is ${answer}.`,
            `$${n} = ${p} \\cdot ${q}$，勒让德符号模 ${p} 是 ${x}，模 ${q} 是 ${y}。它们的积是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "what-a-plus-one-means",
      ["What a plus one means", "加一意味着什么"],
      [
        "The Jacobi symbol obeys reciprocity, so it can be computed quickly, as in the Euclidean algorithm, without factoring. But a value of $+1$ leaves open whether $a$ is a square modulo $n$. The number $a$ is a square modulo $n$ only when it is a residue for every prime factor of $n$.",
        "雅可比符号服从互反律，所以可以像欧几里得算法那样快速计算，不必分解。但值为 $+1$ 时，$a$ 模 $n$ 是否为平方数仍不确定。只有当它对 $n$ 的每个素因子都是剩余时，才是模 $n$ 的平方数。",
      ],
      (rng) => {
        const [p, q] = rng.sample([3, 5, 7, 11, 13], 2) as [number, number];
        const n = p * q;
        const options = Array.from({ length: n - 1 }, (_, i) => i + 1).filter((v) => gcd(v, n) === 1);
        const a = rng.pick(options);
        const symbol = jacobi(a, n);
        const isSquare = legendre(a, p) === 1 && legendre(a, q) === 1;
        const squareText: Pair = [`${a} is a square modulo ${n}`, `${a} 是模 ${n} 的平方数`];
        const notText: Pair = [`${a} is not a square modulo ${n}`, `${a} 不是模 ${n} 的平方数`];
        return choose(
          rng,
          [
            `The Jacobi symbol of ${a} over $${n} = ${p} \\cdot ${q}$ is ${symbol}, with Legendre symbols ${legendre(a, p)} modulo ${p} and ${legendre(a, q)} modulo ${q}. What follows?`,
            `${a} 对 $${n} = ${p} \\cdot ${q}$ 的雅可比符号是 ${symbol}，勒让德符号模 ${p} 是 ${legendre(a, p)}，模 ${q} 是 ${legendre(a, q)}。可以得出什么？`,
          ],
          isSquare ? squareText : notText,
          [squareText, notText, ["Nothing can be concluded", "无法得出结论"]],
          [
            isSquare
              ? "Both Legendre symbols are 1, so square roots exist modulo each prime, and the Chinese remainder theorem combines them."
              : "Some Legendre symbol is $-1$, so there is no square root modulo that prime, and hence none modulo the product.",
            isSquare
              ? "两个勒让德符号都是 1，所以模每个素数都有平方根，由中国剩余定理把它们合起来。"
              : "有一个勒让德符号是 $-1$，所以模那个素数没有平方根，因而模乘积也没有。",
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
        "The Dirichlet convolution of $f$ and $g$ is $(f * g)(n) = \\sum_{d \\mid n} f(d) g(n / d)$. Many familiar functions arise this way: with $\\mathbf{1}$ the constant function 1, we have $\\mathbf{1} * \\mathbf{1} = \\tau$, the number of divisors, and $\\mathbf{1} * \\operatorname{id} = \\sigma$, the sum of divisors.",
        "$f$ 和 $g$ 的狄利克雷卷积是 $(f * g)(n) = \\sum_{d \\mid n} f(d) g(n / d)$。许多熟悉的函数都这样产生：记 $\\mathbf{1}$ 为常数函数 1，则 $\\mathbf{1} * \\mathbf{1} = \\tau$（因子个数），$\\mathbf{1} * \\operatorname{id} = \\sigma$（因子和）。",
      ],
      (rng) => {
        const n = rng.pick([6, 8, 10, 12, 14, 15, 18, 20, 21, 22, 24, 26, 28, 30, 36]);
        const ds = divisors(n);
        const kind = rng.int(0, 2);
        const [name, answer] =
          kind === 0
            ? ["\\operatorname{id} * \\operatorname{id}", ds.length * n]
            : kind === 1
              ? ["\\mathbf{1} * \\operatorname{id}", ds.reduce((x, d) => x + d, 0)]
              : ["\\operatorname{id} * \\varphi", ds.reduce((x, d) => x + d * totient(n / d), 0)];
        return ask(
          [`With $\\operatorname{id}(n) = n$, what is $(${name})(${n})$?`, `记 $\\operatorname{id}(n) = n$，$(${name})(${n})$ 是多少？`],
          answer,
          [ds.length, n, ds.reduce((x, d) => x + d, 0) + n, answer + 1].filter((v) => v !== answer),
          [
            `Sum over the divisors ${ds.join(", ")} of ${n}: the terms add up to ${answer}.`,
            `对 ${n} 的因子 ${ds.join("、")} 求和：各项之和是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-inverse-of-one",
      ["The inverse of one", "常数 1 的逆"],
      [
        "Convolution has an identity $\\varepsilon$, equal to 1 at $n = 1$ and 0 elsewhere. The Möbius function is the inverse of $\\mathbf{1}$: the sum $\\sum_{d \\mid n} \\mu(d)$ is 1 when $n = 1$ and 0 otherwise. Convolving with $\\mu$ undoes a divisor sum, which is what Möbius inversion does.",
        "卷积有单位元 $\\varepsilon$，它在 $n = 1$ 时为 1，其他情况为 0。默比乌斯函数是 $\\mathbf{1}$ 的逆：和 $\\sum_{d \\mid n} \\mu(d)$ 在 $n = 1$ 时为 1，否则为 0。与 $\\mu$ 作卷积能撤销因子求和，这正是默比乌斯反演所做的事。",
      ],
      (rng) => {
        const n = rng.int(2, 60);
        const c = rng.int(2, 9);
        const useOne = rng.bool();
        const value = useOne ? 0 : totient(n);
        const answer = c * value;
        return ask(
          [
            useOne ? `What is $${c} \\sum_{d \\mid ${n}} \\mu(d)$?` : `What is $${c} \\sum_{d \\mid ${n}} \\mu(d) \\frac{${n}}{d}$?`,
            useOne ? `$${c} \\sum_{d \\mid ${n}} \\mu(d)$ 是多少？` : `$${c} \\sum_{d \\mid ${n}} \\mu(d) \\frac{${n}}{d}$ 是多少？`,
          ],
          answer,
          [c, c * n, answer + c, c * divisors(n).length].filter((v) => v !== answer),
          [
            useOne
              ? `The sum is $(\\mu * \\mathbf{1})(${n}) = \\varepsilon(${n}) = 0$, since ${n} is not 1. So the value is 0.`
              : `The sum is $(\\mu * \\operatorname{id})(${n}) = \\varphi(${n}) = ${value}$. Multiplying by ${c} gives ${answer}.`,
            useOne
              ? `这个和是 $(\\mu * \\mathbf{1})(${n}) = \\varepsilon(${n}) = 0$，因为 ${n} 不是 1。所以值为 0。`
              : `这个和是 $(\\mu * \\operatorname{id})(${n}) = \\varphi(${n}) = ${value}$。乘 ${c} 得 ${answer}。`,
          ],
        );
      },
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
        "The Farey sequence of order $n$ lists the reduced fractions in $[0, 1]$ with denominator at most $n$. Neighbors $\\frac{a}{b}, \\frac{c}{d}$ satisfy $b c - a d = 1$. The first fraction to appear between them, as the order grows, is their mediant $\\frac{a + c}{b + d}$.",
        "$n$ 阶法里数列列出 $[0, 1]$ 中分母不超过 $n$ 的最简分数。相邻分数 $\\frac{a}{b}, \\frac{c}{d}$ 满足 $b c - a d = 1$。随着阶数增大，第一个出现在它们之间的分数是中位分数 $\\frac{a + c}{b + d}$。",
      ],
      (rng) => {
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
        return ask(
          [
            `The fractions $\\frac{${a}}{${b}}$ and $\\frac{${c}}{${d}}$ are Farey neighbors. Which fraction appears first between them?`,
            `$\\frac{${a}}{${b}}$ 和 $\\frac{${c}}{${d}}$ 是法里相邻分数。它们之间最先出现的分数是什么？`,
          ],
          answer,
          [Q.of(a * d + b * c, 2 * b * d), Q.of(a + c, b * d), Q.of(a * c, b + d), Q.of(a + 1, b + 1)],
          [
            `The mediant adds the numerators and the denominators: $\\frac{${a} + ${c}}{${b} + ${d}} = ${answer.toLatex()}$.`,
            `中位分数把分子和分母分别相加：$\\frac{${a} + ${c}}{${b} + ${d}} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-length-of-a-farey-sequence",
      ["The length of a Farey sequence", "法里数列的长度"],
      [
        "The fractions in the Farey sequence with denominator exactly $k > 1$ number $\\varphi(k)$, because the numerators are the residues coprime to $k$. Counting 0 and 1 separately gives the length $1 + \\sum_{k=1}^{n} \\varphi(k)$. This grows like $\\frac{3 n^2}{\\pi^2}$, connecting fractions and the density of coprime pairs.",
        "法里数列中分母恰为 $k > 1$ 的分数有 $\\varphi(k)$ 个，因为分子是与 $k$ 互素的剩余。把 0 和 1 单独计入，长度是 $1 + \\sum_{k=1}^{n} \\varphi(k)$。它按 $\\frac{3 n^2}{\\pi^2}$ 增长，把分数和互素数对的密度联系起来。",
      ],
      (rng) => {
        const n = rng.int(3, 28);
        const sum = Array.from({ length: n }, (_, i) => totient(i + 1)).reduce((x, y) => x + y, 0);
        const answer = 1 + sum;
        return ask(
          [
            `How many fractions does the Farey sequence of order ${n} have, including 0 and 1?`,
            `${n} 阶法里数列有多少个分数（包括 0 和 1）？`,
          ],
          answer,
          [sum, answer + 1, n * n, Math.floor((n * (n + 1)) / 2) + 1].filter((v) => v !== answer),
          [
            `$1 + \\varphi(1) + \\cdots + \\varphi(${n}) = 1 + ${sum} = ${answer}$.`,
            `$1 + \\varphi(1) + \\cdots + \\varphi(${n}) = 1 + ${sum} = ${answer}$。`,
          ],
        );
      },
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
        "Convergents of a continued fraction satisfy $p_k = a_k p_{k-1} + p_{k-2}$ and $q_k = a_k q_{k-1} + q_{k-2}$. So each new partial quotient builds the next fraction directly from the two before it, without any need to expand the nested fraction again from the bottom.",
        "连分数的渐近分数满足 $p_k = a_k p_{k-1} + p_{k-2}$，$q_k = a_k q_{k-1} + q_{k-2}$。所以每个新的部分商直接由前两个分数构造出下一个分数，不必再从底部重新展开嵌套分数。",
      ],
      (rng) => {
        const a0 = rng.int(1, 5);
        const a1 = rng.int(2, 7);
        const a2 = rng.int(1, 9);
        const [p0, q0] = [a0, 1];
        const [p1, q1] = [a0 * a1 + 1, a1];
        const [p2, q2] = [a2 * p1 + p0, a2 * q1 + q0];
        const answer = Q.of(p2, q2);
        return ask(
          [
            `A continued fraction has convergents $${p0}$ and $\\frac{${p1}}{${q1}}$, and the next partial quotient is ${a2}. What is the next convergent?`,
            `一个连分数的渐近分数是 $${p0}$ 和 $\\frac{${p1}}{${q1}}$，下一个部分商是 ${a2}。下一个渐近分数是什么？`,
          ],
          answer,
          [Q.of(p1 + p0, q1 + q0), Q.of(a2 * p1, a2 * q1 + 1), Q.of(a2 * p0 + p1, a2 * q0 + q1), Q.of(p2 + 1, q2)],
          [
            `$p = ${a2} \\cdot ${p1} + ${p0} = ${p2}$ and $q = ${a2} \\cdot ${q1} + ${q0} = ${q2}$.`,
            `$p = ${a2} \\cdot ${p1} + ${p0} = ${p2}$，$q = ${a2} \\cdot ${q1} + ${q0} = ${q2}$。`,
          ],
        );
      },
    ),
    point(
      "how-close-a-convergent-is",
      ["How close a convergent is", "渐近分数有多接近"],
      [
        "A convergent $\\frac{p}{q}$ of $x$ satisfies $|x - \\frac{p}{q}| < \\frac{1}{q^2}$, far closer than a typical fraction with that denominator. The next convergent, with denominator $q'$, lies at distance exactly $\\frac{1}{q q'}$ from it. In fact, no fraction with a smaller or equal denominator comes closer to $x$.",
        "$x$ 的渐近分数 $\\frac{p}{q}$ 满足 $|x - \\frac{p}{q}| < \\frac{1}{q^2}$，比同分母的一般分数接近得多。它与下一个渐近分数（分母为 $q'$）的距离恰为 $\\frac{1}{q q'}$。事实上，分母不超过它的分数都不会比它更接近 $x$。",
      ],
      (rng) => {
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
        return ask(
          [
            `Two consecutive convergents have denominators ${q} and ${next}. How far apart are they?`,
            `两个相邻的渐近分数，分母分别是 ${q} 和 ${next}。它们相距多远？`,
          ],
          answer,
          [Q.of(1, q * q), Q.of(1, next * next), Q.of(1, q + next), Q.of(2, q * next)],
          [
            `Their cross difference is $\\pm 1$, so the distance is $\\frac{1}{${q} \\cdot ${next}} = ${answer.toLatex()}$.`,
            `交叉差是 $\\pm 1$，所以距离是 $\\frac{1}{${q} \\cdot ${next}} = ${answer.toLatex()}$。`,
          ],
        );
      },
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
        "The norm of $a + bi$ is $N(a + bi) = a^2 + b^2$, and it satisfies $N(zw) = N(z) N(w)$. So a factorization in the Gaussian integers gives a factorization of the norm in the ordinary integers. This turns a question about complex numbers into arithmetic with whole numbers.",
        "$a + bi$ 的范数是 $N(a + bi) = a^2 + b^2$，它满足 $N(zw) = N(z) N(w)$。所以高斯整数中的分解给出范数在普通整数中的分解。这就把关于复数的问题变成了整数算术。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
        const [n1, n2] = [a * a + b * b, c * c + d * d];
        const product = `(${a} + ${b === 1 ? "" : b}i)(${c} + ${d === 1 ? "" : d}i)`;
        const answer = n1 * n2;
        return ask(
          [`What is the norm of $${product}$?`, `$${product}$ 的范数是多少？`],
          answer,
          [n1 + n2, a * c - b * d, n1 * n2 + 1, (a + b) * (c + d)].filter((v) => v !== answer),
          [
            `The norms are ${n1} and ${n2}, and the norm of the product is their product, ${answer}.`,
            `范数分别是 ${n1} 和 ${n2}，乘积的范数是它们的积 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "which-primes-stay-prime",
      ["Which primes stay prime", "哪些素数仍是素数"],
      [
        "An odd prime $p$ with $p \\equiv 1 \\pmod{4}$ splits as $(a + bi)(a - bi)$, since it is a sum of two squares. A prime with $p \\equiv 3 \\pmod{4}$ stays prime in the Gaussian integers. The prime 2 is a special case: it equals $-i (1 + i)^2$, a unit times a square.",
        "满足 $p \\equiv 1 \\pmod{4}$ 的奇素数 $p$ 分解为 $(a + bi)(a - bi)$，因为它是两个平方数之和。满足 $p \\equiv 3 \\pmod{4}$ 的素数在高斯整数中仍是素数。素数 2 是特例：它等于 $-i (1 + i)^2$，即单位乘平方。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(200).filter((v) => v > 2));
        const splits = p % 4 === 1;
        const stays: Pair = [`${p} stays prime`, `${p} 仍是素数`];
        const split: Pair = [`${p} is a product of two conjugate primes`, `${p} 是两个共轭素数之积`];
        return choose(
          rng,
          [`What happens to ${p} in the Gaussian integers?`, `${p} 在高斯整数中是什么情况？`],
          splits ? split : stays,
          [stays, split, [`${p} becomes a unit`, `${p} 变成单位`], [`${p} is a unit times a square`, `${p} 是单位乘平方`]],
          [
            `The remainder of ${p} on division by 4 is ${p % 4}, so it ${splits ? "is a sum of two squares and splits" : "is not a sum of two squares and stays prime"}.`,
            `${p} 除以 4 的余数是 ${p % 4}，所以它${splits ? "是两个平方数之和，会分解" : "不是两个平方数之和，仍是素数"}。`,
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
        "The Fibonacci numbers satisfy $\\gcd(F_m, F_n) = F_{\\gcd(m, n)}$. The Euclidean algorithm on the indices mirrors the one on the values, because consecutive Fibonacci numbers are coprime. In particular, $F_m$ divides $F_n$ when $m$ divides $n$, so a prime Fibonacci number needs a prime index, with $F_4 = 3$ as the only exception.",
        "斐波那契数满足 $\\gcd(F_m, F_n) = F_{\\gcd(m, n)}$。对下标做欧几里得算法，与对数值做是一一对应的，因为相邻的斐波那契数互素。特别地，当 $m$ 整除 $n$ 时 $F_m$ 整除 $F_n$，所以斐波那契素数的下标必须是素数，唯一的例外是 $F_4 = 3$。",
      ],
      (rng) => {
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
        return ask(
          [`Let $F_1 = F_2 = 1$. What is $\\gcd(F_{${m}}, F_{${n}})$?`, `设 $F_1 = F_2 = 1$。$\\gcd(F_{${m}}, F_{${n}})$ 是多少？`],
          answer,
          [g, fibonacci(g + 1), fibonacci(g - 1) === answer ? answer + 2 : fibonacci(g - 1), 1].filter((x) => x !== answer),
          [
            `$\\gcd(${m}, ${n}) = ${g}$, so the answer is $F_{${g}} = ${answer}$.`,
            `$\\gcd(${m}, ${n}) = ${g}$，所以答案是 $F_{${g}} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "when-a-fibonacci-number-is-a-multiple",
      ["When a Fibonacci number is a multiple", "斐波那契数何时是倍数"],
      [
        "Modulo any $n$, the Fibonacci numbers repeat with a period, since there are finitely many pairs of consecutive residues. For the divisors 2, 3, 4 and 5, the multiples occur exactly at indices divisible by 3, 4, 6 and 5. So the index alone settles the question.",
        "模任何 $n$，斐波那契数都周期重复，因为相邻剩余的数对只有有限个。对除数 2、3、4 和 5，倍数恰好出现在下标被 3、4、6 和 5 整除的地方。所以只看下标就能判断。",
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
        return choose(
          rng,
          [
            `With $F_1 = F_2 = 1$, the first multiple of ${d} is $F_{${step}}$. Is $F_{${index}}$ a multiple of ${d}?`,
            `设 $F_1 = F_2 = 1$，${d} 的第一个倍数是 $F_{${step}}$。$F_{${index}}$ 是 ${d} 的倍数吗？`,
          ],
          remainderIsZero ? yes : no,
          [yes, no, [`It depends on the remainder of ${index} on division by ${d}`, `取决于 ${index} 除以 ${d} 的余数`]],
          [
            `The multiples of ${d} occur exactly at the multiples of the index ${step}. The remainder of ${index} on division by ${step} is ${index % step}.`,
            `${d} 的倍数恰好出现在下标是 ${step} 的倍数的地方。${index} 除以 ${step} 的余数是 ${index % step}。`,
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
        "Dirichlet's theorem says that when $\\gcd(a, d) = 1$, the progression $a, a + d, a + 2d, \\ldots$ contains infinitely many primes. When the gcd exceeds 1, every term shares that factor, so at most one term can be prime. The condition is therefore exactly what is needed.",
        "狄利克雷定理说：当 $\\gcd(a, d) = 1$ 时，等差数列 $a, a + d, a + 2d, \\ldots$ 含有无穷多个素数。当最大公因数大于 1 时，每一项都有这个因子，所以至多一项是素数。因此这个条件恰好是所需要的。",
      ],
      (rng) => {
        const d = rng.int(2, 30);
        const a = rng.int(1, 30);
        const g = gcd(a, d);
        const many: Pair = ["Infinitely many", "无穷多个"];
        const few: Pair = ["At most one", "至多一个"];
        return choose(
          rng,
          [
            `How many primes does the progression $${a}, ${a + d}, ${a + 2 * d}, \\ldots$ contain?`,
            `等差数列 $${a}, ${a + d}, ${a + 2 * d}, \\ldots$ 含有多少个素数？`,
          ],
          g === 1 ? many : few,
          [many, few, ["Exactly two", "恰好两个"], ["About half of its terms", "约一半的项"]],
          [
            g === 1
              ? `$\\gcd(${a}, ${d}) = 1$, so Dirichlet's theorem applies.`
              : `$\\gcd(${a}, ${d}) = ${g}$, so every term is a multiple of ${g}, and only ${g} itself could be prime.`,
            g === 1
              ? `$\\gcd(${a}, ${d}) = 1$，所以狄利克雷定理适用。`
              : `$\\gcd(${a}, ${d}) = ${g}$，所以每一项都是 ${g} 的倍数，只有 ${g} 本身可能是素数。`,
          ],
        );
      },
    ),
    point(
      "euclids-method-for-three-mod-four",
      ["Euclid's method for three mod four", "模四余三的欧几里得方法"],
      [
        "To show that infinitely many primes have remainder 3 modulo 4, suppose the list is finite and form $N = 4 p_1 \\cdots p_k - 1$. Then $N$ has remainder 3, and a product of numbers with remainder 1 has remainder 1, so $N$ has a prime factor with remainder 3 that is not in the list.",
        "要证明模 4 余 3 的素数有无穷多个，假设它们有限，构造 $N = 4 p_1 \\cdots p_k - 1$。则 $N$ 余 3，而余 1 的数之积仍余 1，所以 $N$ 有一个余 3 的素因子，它不在列表中。",
      ],
      (rng) => {
        const list = rng.sample([3, 7, 11, 19, 23], rng.int(1, 3)).sort((x, y) => x - y);
        const product = list.reduce((x, y) => x * y, 1);
        const N = 4 * product - 1;
        const c = factorize(N).find(([p]) => p % 4 === 3)?.[0] ?? N;
        return ask(
          [
            `Starting from the primes ${list.join(", ")}, form $N = 4 \\cdot ${product} - 1$. What is the smallest prime factor of $N$ with remainder 3 on division by 4?`,
            `从素数 ${list.join("、")} 出发，构造 $N = 4 \\cdot ${product} - 1$。$N$ 被 4 除余 3 的最小素因子是多少？`,
          ],
          c,
          [N, list[0] as number, N + 2, 4 * product + 1],
          [
            `$N = ${N}$, and its prime factorization contains ${c}. This prime is new, as it does not divide $4 \\cdot ${product}$.`,
            `$N = ${N}$，它的素因子分解中含 ${c}。这个素数是新的，因为它不整除 $4 \\cdot ${product}$。`,
          ],
        );
      },
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
        "Lagrange's theorem says every whole number is a sum of four squares. Legendre's theorem says that three squares are enough unless the number has the form $4^a (8b + 7)$. So the numbers that truly need four squares can be found by dividing out factors of 4 and looking at the remainder modulo 8.",
        "拉格朗日定理说每个正整数都是四个平方数之和。勒让德定理说：除非这个数形如 $4^a (8b + 7)$，否则三个平方数就够了。所以真正需要四个平方数的数，可以先除去因子 4，再看模 8 的余数。",
      ],
      (rng) => {
        const needs = rng.bool();
        const a = rng.int(0, 2);
        const b = rng.int(0, 12);
        const value = needs ? 4 ** a * (8 * b + 7) : 4 ** a * (8 * b + rng.pick([1, 2, 3, 5, 6]));
        const three: Pair = ["Three squares are enough", "三个平方数就够了"];
        const four: Pair = ["Four squares are needed", "需要四个平方数"];
        return choose(
          rng,
          [`Can ${value} be written as a sum of three squares, allowing zero?`, `${value} 能写成三个平方数之和吗（允许有 0）？`],
          needs ? four : three,
          [three, four, ["Five squares are needed", "需要五个平方数"]],
          [
            `Dividing out powers of 4 leaves ${value / 4 ** a}, with remainder ${(value / 4 ** a) % 8} on division by 8. ${needs ? "That is the excluded form." : "That is not the excluded form."}`,
            `除去 4 的幂后剩下 ${value / 4 ** a}，除以 8 余 ${(value / 4 ** a) % 8}。${needs ? "这正是被排除的形式。" : "这不是被排除的形式。"}`,
          ],
        );
      },
    ),
    point(
      "the-fewest-squares",
      ["The fewest squares", "最少的平方数个数"],
      [
        "The fewest squares needed is 1 for a perfect square. It is 2 when each prime with remainder 3 modulo 4 appears to an even power. It is 4 for the form $4^a (8b + 7)$, and 3 for everything else. So these theorems give the exact count without any search.",
        "完全平方数只需 1 个平方数。当每个模 4 余 3 的素数都以偶次幂出现时，需要 2 个。形如 $4^a (8b + 7)$ 的数需要 4 个，其余的需要 3 个。所以这些定理不用搜索就能给出确切的个数。",
      ],
      (rng) => {
        const n = rng.int(2, 300);
        const root = Math.round(Math.sqrt(n));
        let reduced = n;
        while (reduced % 4 === 0) reduced /= 4;
        const answer = root * root === n ? 1 : factorize(n).every(([p, e]) => p % 4 !== 3 || e % 2 === 0) ? 2 : reduced % 8 === 7 ? 4 : 3;
        return ask(
          [`What is the fewest number of nonzero squares that add up to ${n}?`, `和为 ${n} 的非零平方数最少有几个？`],
          answer,
          [1, 2, 3, 4].filter((v) => v !== answer),
          [
            answer === 1
              ? `${n} is itself the square of ${root}.`
              : answer === 2
                ? `${n} is not a square, and each prime with remainder 3 modulo 4 appears to an even power, so two squares suffice.`
                : answer === 4
                  ? `${n} has the form $4^a (8b + 7)$, so it needs four squares.`
                  : `${n} is not a sum of two squares, and it does not have the form $4^a (8b + 7)$, so three squares suffice.`,
            answer === 1
              ? `${n} 本身是 ${root} 的平方。`
              : answer === 2
                ? `${n} 不是平方数，每个模 4 余 3 的素数都以偶次幂出现，所以两个平方数就够了。`
                : answer === 4
                  ? `${n} 形如 $4^a (8b + 7)$，所以需要四个平方数。`
                  : `${n} 不是两个平方数之和，也不是 $4^a (8b + 7)$ 的形式，所以三个平方数就够了。`,
          ],
        );
      },
    ),
  ],
);

/** numberTheoryMoreTopics holds the later topics of the Number Theory course. */
export const numberTheoryMoreTopics: readonly TopicDef[] = [
  valuations,
  divisibilityTests,
  decimals,
  hensel,
  mersenne,
  pseudoprimes,
  jacobiTopic,
  convolution,
  farey,
  approximations,
  gaussian,
  fibonacciDivisibility,
  progressions,
  squares,
];
