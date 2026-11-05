// The rest of a first course in Number Theory: unique factorization, bases, factoring and primality algorithms,
// public-key exchange, quadratic congruences, Mobius inversion, the size of primes, indices, binomials modulo primes,
// descent, quadratic forms, periodic continued fractions, Dirichlet series, and quadratic integers.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import {
  ask,
  choose,
  divisors,
  factorizationLatex,
  factorize,
  isPrime,
  orderMod,
  pickComposite,
  point,
  powMod,
  primesUpTo,
  same,
  topic,
  totient,
} from "../university-kit.ts";

/** gcdOf computes the greatest common divisor of two positive whole numbers. */
const gcdOf = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcdOf(b, a % b));

/** smallPrimes lists the primes used by the generators in this file. */
const smallPrimes = primesUpTo(60);

/** oddPrimes lists the odd primes used by the generators in this file. */
const oddPrimes = smallPrimes.filter((p) => p !== 2);

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
        "Every whole number above 1 factors into primes in exactly one way. A common divisor can use each prime at most as often as both numbers do, so the gcd takes the smaller exponent of each prime.",
        "每个大于 1 的整数都以唯一的方式分解成质数。公约数中每个质数的次数不能超过两个数各自的次数，所以最大公约数对每个质数取较小的指数。",
      ],
      (rng) => {
        const [p, q] = rng.sample([2, 3, 5, 7], 2) as [number, number];
        const [a, b, c, d] = [rng.int(2, 7), rng.int(2, 7), rng.int(2, 6), rng.int(2, 6)];
        const lo = p ** Math.min(a, b) * q ** Math.min(c, d);
        return ask(
          [
            `What is the gcd of $${p}^{${a}} \\cdot ${q}^{${c}}$ and $${p}^{${b}} \\cdot ${q}^{${d}}$?`,
            `$${p}^{${a}} \\cdot ${q}^{${c}}$ 和 $${p}^{${b}} \\cdot ${q}^{${d}}$ 的最大公约数是多少？`,
          ],
          lo,
          [p ** Math.max(a, b) * q ** Math.max(c, d), p ** Math.min(a, b), lo * p],
          [
            `Take the smaller exponent of each prime: $${p}^{${Math.min(a, b)}} \\cdot ${q}^{${Math.min(c, d)}}$.`,
            `对每个质数取较小的指数：$${p}^{${Math.min(a, b)}} \\cdot ${q}^{${Math.min(c, d)}}$。`,
          ],
        );
      },
    ),
    point(
      "the-lcm-from-exponents",
      ["The lcm from exponents", "由指数求最小公倍数"],
      [
        "A common multiple must contain each prime at least as often as each of the two numbers does. So the lcm takes the larger exponent of each prime, and a prime dividing only one number still appears.",
        "公倍数中每个质数的次数必须不少于两个数各自的次数。所以最小公倍数对每个质数取较大的指数，只整除一个数的质数也要出现。",
      ],
      (rng) => {
        const [p, q, r] = rng.sample([2, 3, 5, 7], 3) as [number, number, number];
        const [a, b, c] = [rng.int(2, 5), rng.int(2, 5), rng.int(2, 4)];
        const big = p ** Math.max(a, b) * q ** c * r;
        return ask(
          [
            `What is the lcm of $${p}^{${a}} \\cdot ${q}^{${c}}$ and $${p}^{${b}} \\cdot ${r}$?`,
            `$${p}^{${a}} \\cdot ${q}^{${c}}$ 和 $${p}^{${b}} \\cdot ${r}$ 的最小公倍数是多少？`,
          ],
          big,
          [p ** Math.min(a, b), p ** Math.max(a, b) * q ** c, p ** (a + b) * q ** c * r === big ? big * p : p ** (a + b) * q ** c * r],
          [`Take the larger exponent of ${p}, and keep both ${q} and ${r}.`, `取 ${p} 的较大指数，并保留 ${q} 和 ${r}。`],
        );
      },
    ),
    point(
      "the-product-formula",
      ["The product formula", "乘积公式"],
      [
        "For each prime, the smaller exponent plus the larger exponent is the sum of both exponents. So the gcd times the lcm equals the product of the two numbers, and knowing one of them gives the other.",
        "对每个质数，较小指数加较大指数等于两个指数之和。所以最大公约数乘最小公倍数等于两个数的乘积，知道其中一个就能得到另一个。",
      ],
      (rng) => {
        const g = rng.int(2, 15);
        const x = rng.int(2, 25);
        let y = rng.int(2, 25);
        if (gcdOf(x, y) !== 1) y = x + 1;
        const a = g * x;
        const b = g * y;
        return ask(
          [
            `Two numbers are $a = ${a}$ and $b$, with $\\gcd(a, b) = ${g}$ and $\\operatorname{lcm}(a, b) = ${g * x * y}$. What is $b$?`,
            `两个数是 $a = ${a}$ 和 $b$，$\\gcd(a, b) = ${g}$，$\\operatorname{lcm}(a, b) = ${g * x * y}$。$b$ 是多少？`,
          ],
          b,
          [g * x * y - a, y, b + g],
          [
            `The product $ab$ equals $${g} \\cdot ${g * x * y}$, so divide that by ${a}.`,
            `乘积 $ab$ 等于 $${g} \\cdot ${g * x * y}$，再除以 ${a}。`,
          ],
        );
      },
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
        "In base $b$, each digit counts a power of $b$. So a numeral is a polynomial in $b$, and its value can be computed by working from the leading digit, multiplying by $b$ and adding the next digit.",
        "在 $b$ 进制中，每个数字计算 $b$ 的一个幂。所以数码是关于 $b$ 的多项式，可以从最高位开始，每次乘 $b$ 再加下一位来计算它的值。",
      ],
      (rng) => {
        const b = rng.int(3, 9);
        const d = [rng.int(1, b - 1), rng.int(0, b - 1), rng.int(0, b - 1), rng.int(0, b - 1)];
        const [d0, d1, d2, d3] = d as [number, number, number, number];
        const v = d0 * b ** 3 + d1 * b * b + d2 * b + d3;
        return ask(
          [`What is the value of the base ${b} numeral $${d.join("")}_{${b}}$?`, `${b} 进制数码 $${d.join("")}_{${b}}$ 的值是多少？`],
          v,
          [d0 + d1 + d2 + d3, d0 * b * b + d1 * b + d2, v + b],
          [
            `Compute $${d0} \\cdot ${b}^{3} + ${d1} \\cdot ${b}^{2} + ${d2} \\cdot ${b} + ${d3}$.`,
            `计算 $${d0} \\cdot ${b}^{3} + ${d1} \\cdot ${b}^{2} + ${d2} \\cdot ${b} + ${d3}$。`,
          ],
        );
      },
    ),
    point(
      "digits-by-repeated-division",
      ["Digits by repeated division", "反复除法求数字"],
      [
        "Dividing by $b$ leaves the last digit as the remainder. Repeating with the quotient produces the digits from right to left, which is why the division algorithm guarantees that an expansion exists and is unique.",
        "除以 $b$ 的余数是最后一位。对商重复这一步，从右到左得到各位数字，这就是带余除法保证展开存在且唯一的原因。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const n = rng.int(b * b, b ** 3 * 4 + 200);
        let sum = 0;
        for (let m = n; m > 0; m = Math.floor(m / b)) sum += m % b;
        return ask(
          [`Write ${n} in base ${b}. What is the sum of its digits?`, `把 ${n} 写成 ${b} 进制。它的各位数字之和是多少？`],
          sum,
          [sum + 1, sum === 1 ? 2 : sum - 1, n % b === sum ? sum + 2 : n % b],
          [`Divide ${n} by ${b} repeatedly, and add up the remainders.`, `反复用 ${b} 除 ${n}，再把余数相加。`],
        );
      },
    ),
    point(
      "divisibility-in-base-b",
      ["Divisibility in base b", "b 进制中的整除性"],
      [
        "Since $b \\equiv 1 \\pmod{b - 1}$, a numeral in base $b$ is congruent to its digit sum modulo $b - 1$. This generalizes the rule for divisibility by nine in base ten.",
        "因为 $b \\equiv 1 \\pmod{b - 1}$，$b$ 进制数码模 $b - 1$ 同余于它的数字和。这推广了十进制中被九整除的规则。",
      ],
      (rng) => {
        const b = rng.int(4, 16);
        const count = rng.int(3, 6);
        const d = Array.from({ length: count }, () => rng.int(0, Math.min(b - 1, 9)));
        d[0] = rng.int(1, Math.min(b - 1, 9));
        const s = d.reduce((x, y) => x + y, 0);
        return ask(
          [
            `What is the remainder when $${d.join("")}_{${b}}$ is divided by ${b - 1}?`,
            `$${d.join("")}_{${b}}$ 除以 ${b - 1} 的余数是多少？`,
          ],
          s % (b - 1),
          [
            (s + 1) % (b - 1),
            (d[d.length - 1] as number) % (b - 1) === s % (b - 1) ? (s + 2) % (b - 1) : (d[d.length - 1] as number) % (b - 1),
            b - 1,
          ],
          [`The digit sum is ${s}, and the remainder is that sum modulo ${b - 1}.`, `数字和是 ${s}，余数就是这个和模 ${b - 1}。`],
        );
      },
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
        "To write $n = a^{2} - b^{2}$, we need $a^{2} \\ge n$. So the search starts at the smallest whole number whose square reaches $n$, and it moves upward until the difference is a perfect square.",
        "要写成 $n = a^{2} - b^{2}$，需要 $a^{2} \\ge n$。所以搜索从平方达到 $n$ 的最小整数开始，向上移动，直到差是完全平方数。",
      ],
      (rng) => {
        const n = 2 * rng.int(20, 4000) + 1;
        const a = Math.ceil(Math.sqrt(n));
        return ask(
          [`Fermat's method on $n = ${n}$ starts at which value of $a$?`, `对 $n = ${n}$ 用费马方法，从哪个 $a$ 值开始？`],
          a,
          [a - 1, a + 1, Math.floor(n / 2)],
          [
            `It is the smallest $a$ with $a^{2} \\ge ${n}$, and $${a}^{2} = ${a * a}$.`,
            `这是满足 $a^{2} \\ge ${n}$ 的最小 $a$，而 $${a}^{2} = ${a * a}$。`,
          ],
        );
      },
    ),
    point(
      "factoring-from-two-squares",
      ["Factoring from two squares", "由两个平方数分解"],
      [
        "Once $a^{2} - n$ is a square $b^{2}$, the number factors as $n = (a - b)(a + b)$. So the factors of $n$ are read at once from the two values found by the search.",
        "一旦 $a^{2} - n$ 是平方数 $b^{2}$，这个数就分解成 $n = (a - b)(a + b)$。所以 $n$ 的因数可以从搜索得到的两个值直接读出。",
      ],
      (rng) => {
        const a = rng.int(30, 300);
        const b = rng.int(1, 25);
        const n = a * a - b * b;
        return ask(
          [
            `Given $${a}^{2} - ${n} = ${b}^{2}$, what is the smaller factor from Fermat's method?`,
            `已知 $${a}^{2} - ${n} = ${b}^{2}$，费马方法给出的较小因数是多少？`,
          ],
          a - b,
          [a + b, a, b],
          [`The factors are $${a} - ${b}$ and $${a} + ${b}$.`, `因数是 $${a} - ${b}$ 和 $${a} + ${b}$。`],
        );
      },
    ),
    point(
      "running-the-search",
      ["Running the search", "进行搜索"],
      [
        "The method succeeds quickly when the two factors are close, because then $a$ is close to the square root of $n$. If the factors are far apart, then many values of $a$ must be tried.",
        "当两个因数接近时，这个方法很快成功，因为这时 $a$ 接近 $n$ 的平方根。如果因数相差很远，就要试很多个 $a$ 值。",
      ],
      (rng) => {
        const m = rng.int(15, 150);
        const gap = rng.int(1, 6);
        const n = (2 * m + 1) * (2 * m + 1 + 2 * gap);
        const a = 2 * m + 1 + gap;
        return ask(
          [
            `Use Fermat's method to factor $${n}$, which has two close factors. What is the larger factor?`,
            `用费马方法分解 $${n}$，它有两个接近的因数。较大的因数是多少？`,
          ],
          a + gap,
          [a - gap, a, a + gap + 2],
          [
            `Starting at $a = ${a}$ gives $a^{2} - ${n} = ${gap * gap}$, so $b = ${gap}$.`,
            `从 $a = ${a}$ 开始得 $a^{2} - ${n} = ${gap * gap}$，所以 $b = ${gap}$。`,
          ],
        );
      },
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
        "The method iterates $x \\mapsto x^{2} + c$ modulo $n$. The sequence behaves like a random one, and because there are finitely many residues, it must eventually repeat, tracing out a shape like the letter rho.",
        "这个方法在模 $n$ 下迭代 $x \\mapsto x^{2} + c$。序列表现得像随机序列，因为剩余只有有限个，它最终必然重复，画出一个像字母 rho 的形状。",
      ],
      (rng) => {
        const n = pickComposite(rng, 91, 1500);
        const x = rng.int(2, 40);
        const c = rng.int(1, 5);
        const x1 = (x * x + c) % n;
        const x2 = (x1 * x1 + c) % n;
        return ask(
          [
            `With $f(x) = x^{2} + ${c}$ modulo ${n} and $x_0 = ${x}$, what is $x_2$?`,
            `取 $f(x) = x^{2} + ${c}$ 模 ${n}，$x_0 = ${x}$，$x_2$ 是多少？`,
          ],
          x2,
          [x1, (x2 + c) % n === x2 ? x2 + 1 : (x2 + c) % n, (x1 * x1) % n === x2 ? x1 + 1 : (x1 * x1) % n],
          [`First $x_1 = ${x1}$, and then apply the map again.`, `先得 $x_1 = ${x1}$，再应用一次映射。`],
        );
      },
    ),
    point(
      "a-factor-from-a-difference",
      ["A factor from a difference", "由差得因数"],
      [
        "If two terms agree modulo a hidden prime factor $p$, then $p$ divides their difference. So the gcd of the difference and $n$ reveals a factor, without our having to know $p$ in advance.",
        "如果两项模隐藏的质因数 $p$ 相同，那么 $p$ 整除它们的差。所以差与 $n$ 的最大公约数给出一个因数，而不必事先知道 $p$。",
      ],
      (rng) => {
        const [p, q] = rng.sample(oddPrimes, 2) as [number, number];
        const n = p * q;
        const j = rng.int(1, q - 1);
        const x = rng.int(1, n - 1 - p * j);
        const y = x + p * j;
        const g = gcdOf(y - x, n);
        return ask(
          [
            `In Pollard's method on $n = ${n}$, two terms are ${x} and ${y}. What is $\\gcd(${y} - ${x}, ${n})$?`,
            `对 $n = ${n}$ 用波拉德方法，两项是 ${x} 和 ${y}。$\\gcd(${y} - ${x}, ${n})$ 是多少？`,
          ],
          g,
          [g === p ? q : p, y - x === g ? g + 1 : y - x, 1 === g ? n : 1],
          [
            `The difference is ${y - x}, and $\\gcd(${y - x}, ${n}) = ${g}$ by the Euclidean algorithm, so ${g} is a factor of ${n}.`,
            `差是 ${y - x}，由欧几里得算法 $\\gcd(${y - x}, ${n}) = ${g}$，所以 ${g} 是 ${n} 的因子。`,
          ],
        );
      },
    ),
    point(
      "the-cycle-of-the-sequence",
      ["The cycle of the sequence", "序列的循环"],
      [
        "Floyd's trick moves one pointer once and another twice per step, and they must meet inside the cycle. For a small modulus we can list the terms directly, and so find how long the tail and the cycle are.",
        "弗洛伊德的技巧让一个指针每步走一次，另一个走两次，它们必然在循环内相遇。对小的模数可以直接列出各项，从而求出尾部和循环的长度。",
      ],
      (rng) => {
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
        const cycle = i - (seen.get(x) as number);
        return ask(
          [
            `Iterate $x \\mapsto x^{2} + ${c}$ modulo ${p}, starting at ${x0}. How long is the cycle that the sequence falls into?`,
            `从 ${x0} 开始，在模 ${p} 下迭代 $x \\mapsto x^{2} + ${c}$。序列落入的循环有多长？`,
          ],
          cycle,
          [cycle + 1, i === cycle ? i + 2 : i, cycle + 2],
          [
            `The terms are ${[...seen.keys(), x].join(", ")}. The value ${x} comes back after ${cycle} steps.`,
            `各项是 ${[...seen.keys(), x].join("、")}。值 ${x} 经过 ${cycle} 步后再次出现。`,
          ],
        );
      },
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
        "Two people agree in public on a prime $p$ and a base $g$. Each one picks a private exponent and announces $g$ to that power modulo $p$, and recovering the exponent from this number is a discrete logarithm problem.",
        "两人公开约定质数 $p$ 和底数 $g$。每人选一个私有指数，并公布 $g$ 的这个次幂模 $p$，从这个数恢复指数就是离散对数问题。",
      ],
      (rng) => {
        const p = rng.pick(smallPrimes.filter((v) => v >= 11));
        const g = rng.int(2, p - 2);
        const a = rng.int(2, 12);
        return ask(
          [
            `With $p = ${p}$ and $g = ${g}$, a private exponent is ${a}. What value is announced?`,
            `取 $p = ${p}$，$g = ${g}$，私有指数是 ${a}。公布的值是什么？`,
          ],
          powMod(g, a, p),
          [(g * a) % p, (powMod(g, a, p) + 1) % p, powMod(a, g, p) === powMod(g, a, p) ? (powMod(g, a, p) + 2) % p : powMod(a, g, p)],
          [
            `Compute $${g}^{${a}} \\equiv ${powMod(g, a, p)} \\pmod{${p}}$.`,
            `计算 $${g}^{${a}} \\equiv ${powMod(g, a, p)} \\pmod{${p}}$。`,
          ],
        );
      },
    ),
    point(
      "the-shared-secret",
      ["The shared secret", "共同的密钥"],
      [
        "Each person raises the other's public value to their own private exponent. Both obtain $g^{ab}$ modulo $p$, so they share a secret number that was never sent across the open channel.",
        "每人把对方的公开值升到自己的私有指数次幂。两人都得到 $g^{ab}$ 模 $p$，所以共享一个从未在公开信道上传送的秘密数。",
      ],
      (rng) => {
        const p = rng.pick(smallPrimes.filter((v) => v >= 11));
        const g = rng.int(2, p - 2);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const pub = powMod(g, b, p);
        const key = powMod(pub, a, p);
        return ask(
          [
            `With $p = ${p}$ and $g = ${g}$, your private exponent is ${a}, and you receive the public value ${pub}. What is the shared secret?`,
            `取 $p = ${p}$，$g = ${g}$，你的私有指数是 ${a}，收到的公开值是 ${pub}。共同的密钥是什么？`,
          ],
          key,
          [powMod(g, a, p) === key ? (key + 1) % p : powMod(g, a, p), (pub * a) % p === key ? (key + 2) % p : (pub * a) % p, (key + 3) % p],
          [
            `Raise the received value to your exponent: $${pub}^{${a}} \\equiv ${key} \\pmod{${p}}$.`,
            `把收到的值升到你的指数次幂：$${pub}^{${a}} \\equiv ${key} \\pmod{${p}}$。`,
          ],
        );
      },
    ),
    point(
      "breaking-a-small-exchange",
      ["Breaking a small exchange", "破解小的交换"],
      [
        "An eavesdropper who can find a discrete logarithm can compute the secret. With a small prime, simply trying the exponents one by one is enough, which is why real systems use extremely large primes.",
        "能求离散对数的窃听者就能算出密钥。质数很小时，逐个试指数就足够了，这就是实际系统使用极大质数的原因。",
      ],
      (rng) => {
        const p = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59]);
        let g = 2;
        while (orderMod(g, p) !== p - 1) g += 1;
        const a = rng.int(2, p - 2);
        return ask(
          [
            `With $p = ${p}$ and $g = ${g}$, someone announces ${powMod(g, a, p)}. What private exponent between 1 and ${p - 1} was used?`,
            `取 $p = ${p}$，$g = ${g}$，某人公布 ${powMod(g, a, p)}。使用的私有指数（在 1 和 ${p - 1} 之间）是多少？`,
          ],
          a,
          [a === p - 2 ? a - 1 : a + 1, p - 1 - a === a ? a - 1 : p - 1 - a, powMod(g, a, p) === a ? a + 2 : powMod(g, a, p)],
          [
            `The powers of ${g} modulo ${p} are ${Array.from({ length: a }, (_, i) => powMod(g, i + 1, p)).join(", ")}, so the announced value appears at exponent ${a}.`,
            `${g} 模 ${p} 的幂是 ${Array.from({ length: a }, (_, i) => powMod(g, i + 1, p)).join("、")}，所以公布的值出现在指数 ${a}。`,
          ],
        );
      },
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
        "By the Chinese remainder theorem, solutions modulo $pq$ correspond to pairs of solutions modulo $p$ and $q$. So if $a$ is a nonzero square modulo both odd primes, then $x^{2} \\equiv a$ has exactly four solutions.",
        "由中国剩余定理，模 $pq$ 的解对应模 $p$ 和模 $q$ 的解对。所以如果 $a$ 模两个奇质数都是非零平方数，$x^{2} \\equiv a$ 恰有四个解。",
      ],
      (rng) => {
        const [p, q] = rng.sample(oddPrimes, 2) as [number, number];
        const r = rng.pick(oddPrimes.filter((v) => v !== p && v !== q));
        const three = rng.bool();
        const n = three ? p * q * r : p * q;
        const c = three ? 8 : 4;
        return ask(
          [`How many solutions does $x^{2} \\equiv 1 \\pmod{${n}}$ have?`, `$x^{2} \\equiv 1 \\pmod{${n}}$ 有多少个解？`],
          c,
          [2, three ? 6 : 3, three ? 3 : 8],
          [
            `Each of the ${three ? "three" : "two"} odd prime factors gives $\\pm 1$, so there are $2^{${three ? 3 : 2}}$ solutions.`,
            `这${three ? "三" : "两"}个奇质因数各给出 $\\pm 1$，所以有 $2^{${three ? 3 : 2}}$ 个解。`,
          ],
        );
      },
    ),
    point(
      "a-prime-power-of-two",
      ["A power of two", "二的幂"],
      [
        "Powers of two behave differently. Modulo 8 and any higher power of 2, the congruence $x^{2} \\equiv 1$ has four solutions, namely $\\pm 1$ and $\\pm 1$ shifted by half of the modulus, while modulo 2 and 4 it has fewer.",
        "二的幂的情况不同。模 8 及更高的 2 的幂，同余式 $x^{2} \\equiv 1$ 有四个解，即 $\\pm 1$ 和平移了模数一半的 $\\pm 1$，而模 2 和模 4 的解更少。",
      ],
      (rng) => {
        const k = rng.int(3, 14);
        const n = 2 ** k;
        const m = n / 2 + 1;
        const v = rng.int(1, 3);
        return ask(
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
          v === 1 ? 4 : v === 2 ? m : m - 2,
          v === 1 ? [2, k, 8] : v === 2 ? [m - 2, m - 1, m + 1] : [m, m - 1, m - 3],
          [
            `The solutions are $\\pm 1$ and $${n / 2} \\pm 1$, because $(${n / 2} \\pm 1)^{2} = ${n / 2}^{2} \\pm 2 \\cdot ${n / 2} + 1$, and both $${n / 2}^{2}$ and $2 \\cdot ${n / 2}$ are multiples of ${n}.`,
            `解是 $\\pm 1$ 和 $${n / 2} \\pm 1$，因为 $(${n / 2} \\pm 1)^{2} = ${n / 2}^{2} \\pm 2 \\cdot ${n / 2} + 1$，而 $${n / 2}^{2}$ 和 $2 \\cdot ${n / 2}$ 都是 ${n} 的倍数。`,
          ],
        );
      },
    ),
    point(
      "combining-roots-with-crt",
      ["Combining roots with CRT", "用中国剩余定理组合根"],
      [
        "To solve $x^{2} \\equiv a$ modulo a product, find the roots modulo each factor and then combine them. A root modulo the product can be tested directly by squaring it, which confirms the work.",
        "要解模乘积的 $x^{2} \\equiv a$，先求模每个因子的根，再组合它们。可以通过平方直接检验模乘积的根，从而确认结果。",
      ],
      (rng) => {
        const [p, q] = rng.sample([7, 11, 13, 17, 19, 23], 2) as [number, number];
        const n = p * q;
        const pool = Array.from({ length: Math.floor(n / 2) - 1 }, (_, i) => i + 2).filter(
          (y) => gcdOf(y, n) === 1 && !Number.isInteger(Math.sqrt((y * y) % n)),
        );
        const a = rng.pick(pool) ** 2 % n;
        const roots: number[] = [];
        for (let y = 1; y < n; y++) if ((y * y) % n === a) roots.push(y);
        return ask(
          [
            `What is the smallest positive solution of $x^{2} \\equiv ${a} \\pmod{${n}}$?`,
            `$x^{2} \\equiv ${a} \\pmod{${n}}$ 的最小正解是多少？`,
          ],
          roots[0] as number,
          [(roots[1] ?? 1) as number, n - (roots[0] as number), (roots[0] as number) + 1],
          [
            `Find the roots modulo ${p} and ${q}, and combine them by the Chinese remainder theorem. The solutions are ${roots.join(", ")}, so the smallest is ${roots[0]}.`,
            `求模 ${p} 和模 ${q} 的根，再用中国剩余定理组合。解是 ${roots.join("、")}，所以最小的是 ${roots[0]}。`,
          ],
        );
      },
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
        "The system $x \\equiv a \\pmod{m}$, $x \\equiv b \\pmod{n}$ has a solution exactly when $\\gcd(m, n)$ divides $b - a$. Otherwise, the two conditions disagree modulo that gcd, and no number can meet both.",
        "方程组 $x \\equiv a \\pmod{m}$，$x \\equiv b \\pmod{n}$ 有解，当且仅当 $\\gcd(m, n)$ 整除 $b - a$。否则两个条件模这个最大公约数不一致，没有数能同时满足。",
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
        const consistent = (((b - a) % gcdOf(m, n)) + gcdOf(m, n)) % gcdOf(m, n) === 0;
        const yes: [string, string] = ["It has solutions", "它有解"];
        const no: [string, string] = ["It has no solution", "它无解"];
        return choose(
          rng,
          [
            `Does the system $x \\equiv ${a} \\pmod{${m}}$, $x \\equiv ${b} \\pmod{${n}}$ have a solution?`,
            `方程组 $x \\equiv ${a} \\pmod{${m}}$，$x \\equiv ${b} \\pmod{${n}}$ 有解吗？`,
          ],
          consistent ? yes : no,
          [
            consistent ? no : yes,
            ["It has exactly one whole number solution", "它恰有一个整数解"],
            ["It depends on the size of $x$", "这取决于 $x$ 的大小"],
          ],
          [
            `Here $\\gcd(${m}, ${n}) = ${gcdOf(m, n)}$, and $${b} - ${a}$ is ${consistent ? "" : "not "}a multiple of it.`,
            `这里 $\\gcd(${m}, ${n}) = ${gcdOf(m, n)}$，而 $${b} - ${a}$ ${consistent ? "是" : "不是"}它的倍数。`,
          ],
        );
      },
    ),
    point(
      "the-modulus-of-the-solution",
      ["The modulus of the solution", "解的模"],
      [
        "When a solution exists, it is unique modulo the lcm of the moduli, not modulo their product. So the number of solutions in a range can be counted from that lcm.",
        "解存在时，它在模各模数的最小公倍数下唯一，而不是模它们的乘积。所以范围内解的个数可以由最小公倍数算出。",
      ],
      (rng) => {
        const g = rng.int(2, 12);
        const x = rng.int(2, 15);
        let y = rng.int(2, 15);
        if (gcdOf(x, y) !== 1) y = x + 1;
        const lcm = g * x * y;
        const k = rng.int(2, 9);
        return ask(
          [
            `A consistent system has the moduli ${g * x} and ${g * y}. How many solutions does it have in a run of ${k * lcm} consecutive integers?`,
            `一个相容的方程组的模是 ${g * x} 和 ${g * y}。它在连续 ${k * lcm} 个整数中有多少个解？`,
          ],
          k,
          [k * g, Q.of(k * lcm, g * g * x * y), k + 1],
          [`Solutions repeat every $\\operatorname{lcm} = ${lcm}$ integers.`, `解每隔 $\\operatorname{lcm} = ${lcm}$ 个整数重复一次。`],
        );
      },
    ),
    point(
      "solving-the-system",
      ["Solving the system", "解方程组"],
      [
        "Write $x = a + mk$ and substitute into the second condition. After dividing through by the gcd, this is an ordinary linear congruence in $k$, and solving it gives the smallest solution.",
        "写 $x = a + mk$，代入第二个条件。两边除以最大公约数后，它是关于 $k$ 的普通线性同余式，解它就得到最小的解。",
      ],
      (rng) => {
        const g = rng.int(2, 6);
        const [u, v] = rng.sample([2, 3, 5, 7, 11], 2) as [number, number];
        const m = g * u;
        const n = g * v;
        const lcm = (m * n) / gcdOf(m, n);
        const x = rng.int(Math.max(m, n), lcm - 1);
        return ask(
          [
            `Find the smallest nonnegative solution of $x \\equiv ${x % m} \\pmod{${m}}$, $x \\equiv ${x % n} \\pmod{${n}}$.`,
            `求 $x \\equiv ${x % m} \\pmod{${m}}$，$x \\equiv ${x % n} \\pmod{${n}}$ 的最小非负解。`,
          ],
          x,
          [x + lcm, (x + m) % lcm === x ? x + 1 : (x + m) % lcm, x + m * n],
          [
            `Substitute $x = ${x % m} + ${m}k$ into the second condition: the first $k$ that works is ${Math.floor(x / m)}, which gives $x = ${x}$. Solutions repeat every ${lcm}.`,
            `把 $x = ${x % m} + ${m}k$ 代入第二个条件：第一个可行的 $k$ 是 ${Math.floor(x / m)}，得 $x = ${x}$。解每隔 ${lcm} 重复一次。`,
          ],
        );
      },
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
        "The test writes $n - 1 = 2^{s} d$ with $d$ odd. It computes $a^{d}$ modulo $n$ and squares repeatedly, looking at the chain of values leading up to $a^{n - 1}$.",
        "这个检验写 $n - 1 = 2^{s} d$，其中 $d$ 是奇数。它计算 $a^{d}$ 模 $n$ 再反复平方，观察通向 $a^{n - 1}$ 的一串值。",
      ],
      (rng) => {
        const s = rng.int(1, 8);
        const d = 2 * rng.int(1, 60) + 1;
        const n = 2 ** s * d + 1;
        const askS = rng.bool();
        return ask(
          [
            `For $n = ${n}$, write $n - 1 = 2^{s} d$ with $d$ odd. What is ${askS ? "$s$" : "$d$"}?`,
            `对 $n = ${n}$，写 $n - 1 = 2^{s} d$，其中 $d$ 是奇数。${askS ? "$s$" : "$d$"} 是多少？`,
          ],
          askS ? s : d,
          askS ? [s + 1, s === 1 ? 2 : s - 1, d] : [2 * d, n - 1, s === d ? d + 2 : s],
          [
            `Here $n - 1 = ${n - 1}$, and halving until the result is odd gives $2^{${s}} \\cdot ${d}$.`,
            `这里 $n - 1 = ${n - 1}$，一直减半到奇数，得 $2^{${s}} \\cdot ${d}$。`,
          ],
        );
      },
    ),
    point(
      "the-first-term-of-the-chain",
      ["The first term of the chain", "链的第一项"],
      [
        "The number $n$ passes for the base $a$ when the chain starts at 1, or when $-1$ appears somewhere in the chain before the last term. In any other case, $a$ is a witness that $n$ is composite.",
        "当链从 1 开始，或者 $-1$ 出现在最后一项之前的某处时，$n$ 对底数 $a$ 通过检验。其他情况下 $a$ 是 $n$ 为合数的证据。",
      ],
      (rng) => {
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
        return ask(
          [
            `For $n = ${n}$, we have $n - 1 = 2^{${s}} \\cdot ${d}$. What is the first term $${a}^{${d}}$ modulo ${n} of the chain?`,
            `对 $n = ${n}$，有 $n - 1 = 2^{${s}} \\cdot ${d}$。链的第一项 $${a}^{${d}}$ 模 ${n} 是多少？`,
          ],
          v,
          [(v * v) % n === v ? (v + 1) % n : (v * v) % n, (a * d) % n === v ? (v + 2) % n : (a * d) % n, (v + 1) % n],
          [`Use repeated squaring to compute the power of ${a} modulo ${n}.`, `用反复平方计算 ${a} 模 ${n} 的幂。`],
        );
      },
    ),
    point(
      "a-square-root-exposes-a-factor",
      ["A square root exposes a factor", "平方根揭露因数"],
      [
        "If the chain reaches 1 from a value $v$ other than $\\pm 1$, then $v$ is a nontrivial square root of 1. Since $n$ divides $(v - 1)(v + 1)$ but neither factor alone, $\\gcd(v - 1, n)$ is a proper factor.",
        "如果链从不是 $\\pm 1$ 的值 $v$ 到达 1，那么 $v$ 是 1 的非平凡平方根。因为 $n$ 整除 $(v - 1)(v + 1)$ 但不单独整除任何一个因子，$\\gcd(v - 1, n)$ 是真因数。",
      ],
      (rng) => {
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
        return ask(
          [
            `Modulo ${n}, the value ${v} squares to 1. What is $\\gcd(${v} - 1, ${n})$?`,
            `模 ${n} 时，${v} 的平方是 1。$\\gcd(${v} - 1, ${n})$ 是多少？`,
          ],
          g,
          [n / g, v - 1 === g ? v + 1 : v - 1, 1],
          [
            `Since ${n} divides $(${v} - 1)(${v} + 1)$, the gcd finds one factor of ${n}.`,
            `因为 ${n} 整除 $(${v} - 1)(${v} + 1)$，最大公约数找到 ${n} 的一个因数。`,
          ],
        );
      },
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
        "If $F(n)$ is the sum of $f(d)$ over the divisors $d$ of $n$, then $f(n)$ is the sum of $\\mu(d)F\\left(\\frac{n}{d}\\right)$. For $n = pq$ with distinct primes, this is $F(pq) - F(p) - F(q) + F(1)$.",
        "如果 $F(n)$ 是 $f(d)$ 对 $n$ 的除数 $d$ 求和，那么 $f(n)$ 是 $\\mu(d)F\\left(\\frac{n}{d}\\right)$ 的和。对不同质数之积 $n = pq$，它是 $F(pq) - F(p) - F(q) + F(1)$。",
      ],
      (rng) => {
        const [p, q] = rng.sample([2, 3, 5, 7, 11, 13], 2) as [number, number];
        const [a, b, c, d] = [rng.int(1, 9), rng.int(10, 40), rng.int(10, 40), rng.int(80, 200)];
        return ask(
          [
            `Let $F(n) = \\sum_{d \\mid n} f(d)$. Given $F(1) = ${a}$, $F(${p}) = ${b}$, $F(${q}) = ${c}$ and $F(${p * q}) = ${d}$, what is $f(${p * q})$?`,
            `设 $F(n) = \\sum_{d \\mid n} f(d)$。已知 $F(1) = ${a}$，$F(${p}) = ${b}$，$F(${q}) = ${c}$，$F(${p * q}) = ${d}$，$f(${p * q})$ 是多少？`,
          ],
          d - b - c + a,
          [d - b - c - a, d - b - c, d + b + c + a],
          [`Inversion gives $${d} - ${b} - ${c} + ${a} = ${d - b - c + a}$.`, `反演给出 $${d} - ${b} - ${c} + ${a} = ${d - b - c + a}$。`],
        );
      },
    ),
    point(
      "the-totient-from-inversion",
      ["The totient from inversion", "由反演得欧拉函数"],
      [
        "Since the totients of the divisors of $n$ add up to $n$, inversion gives $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$. Only squarefree divisors matter here, because $\\mu$ vanishes on the others.",
        "因为 $n$ 的各除数的欧拉函数之和是 $n$，反演给出 $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$。这里只有无平方因子的除数起作用，因为 $\\mu$ 在其他除数上为零。",
      ],
      (rng) => {
        const n = rng.int(12, 400);
        const signed = divisors(n)
          .map((d) => {
            const f = factorize(d);
            return f.some(([, e]) => e > 1) ? 0 : ((f.length % 2 === 0 ? 1 : -1) * n) / d;
          })
          .filter((v) => v !== 0);
        const sum = signed.map((v, i) => (i === 0 ? `${v}` : v < 0 ? ` - ${-v}` : ` + ${v}`)).join("");
        return ask(
          [
            `Use $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$ to compute $\\varphi(${n})$.`,
            `用 $\\varphi(n) = \\sum_{d \\mid n} \\mu(d)\\frac{n}{d}$ 计算 $\\varphi(${n})$。`,
          ],
          totient(n),
          [n - 1 === totient(n) ? n : n - 1, totient(n) + 1, divisors(n).length === totient(n) ? totient(n) + 2 : divisors(n).length],
          [
            `Only the squarefree divisors count: $\\varphi(${n}) = ${sum} = ${totient(n)}$.`,
            `只有无平方因子的除数起作用：$\\varphi(${n}) = ${sum} = ${totient(n)}$。`,
          ],
        );
      },
    ),
    point(
      "counting-irreducible-strings",
      ["Counting primitive strings", "计算本原串"],
      [
        "A string is primitive when it is not a repetition of a shorter string. The strings of length $n$ over $k$ letters are each a repetition of a unique primitive string of some length dividing $n$. So inversion counts the primitive strings: $\\sum_{d \\mid n} \\mu(d) k^{n/d}$.",
        "一个串如果不是更短的串的重复，就称为本原串。长度为 $n$、字母表有 $k$ 个字母的每个串，都是某个长度整除 $n$ 的唯一本原串的重复。所以反演给出本原串的个数：$\\sum_{d \\mid n} \\mu(d) k^{n/d}$。",
      ],
      (rng) => {
        const k = rng.int(2, 5);
        const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const mu = (d: number): number => {
          const f = factorize(d);
          if (f.some(([, e]) => e > 1)) return 0;
          return f.length % 2 === 0 ? 1 : -1;
        };
        const total = divisors(n).reduce((sum, d) => sum + mu(d) * k ** (n / d), 0);
        const terms = divisors(n)
          .filter((d) => mu(d) !== 0)
          .map((d, i) => `${i === 0 ? "" : mu(d) < 0 ? " - " : " + "}${k}^{${n / d}}`)
          .join("");
        return ask(
          [`How many primitive strings of length ${n} are there over ${k} letters?`, `在 ${k} 个字母上，长度为 ${n} 的本原串有多少个？`],
          total,
          [k ** n, total + k, Q.of(total, n)],
          [
            `Sum $\\mu(d) \\cdot ${k}^{${n}/d}$ over the divisors $d$ of ${n}: $${terms} = ${total}$.`,
            `对 ${n} 的除数 $d$ 求和 $\\mu(d) \\cdot ${k}^{${n}/d}$：$${terms} = ${total}$。`,
          ],
        );
      },
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
        "To add up $\\tau(k)$ for $k$ up to $n$, count pairs $(d, k)$ with $d$ dividing $k$ the other way around. Each $d$ divides $\\left\\lfloor\\frac{n}{d}\\right\\rfloor$ numbers, so the sum equals $\\sum_{d} \\left\\lfloor\\frac{n}{d}\\right\\rfloor$.",
        "要对 $k$ 不超过 $n$ 求 $\\tau(k)$ 的和，换一种方式数 $d$ 整除 $k$ 的对 $(d, k)$。每个 $d$ 整除 $\\left\\lfloor\\frac{n}{d}\\right\\rfloor$ 个数，所以和等于 $\\sum_{d} \\left\\lfloor\\frac{n}{d}\\right\\rfloor$。",
      ],
      (rng) => {
        const n = rng.int(6, 60);
        let sum = 0;
        for (let d = 1; d <= n; d++) sum += Math.floor(n / d);
        return ask(
          [`What is $\\tau(1) + \\tau(2) + \\cdots + \\tau(${n})$?`, `$\\tau(1) + \\tau(2) + \\cdots + \\tau(${n})$ 是多少？`],
          sum,
          [sum + 1, sum - 1, n * divisors(n).length === sum ? sum + 2 : n * divisors(n).length],
          [
            `Add $\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ for $d$ from 1 to ${n}.`,
            `对 $d$ 从 1 到 ${n} 求 $\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ 的和。`,
          ],
        );
      },
    ),
    point(
      "summing-the-sigma-function",
      ["Summing the sigma function", "对 sigma 函数求和"],
      [
        "The same swap handles $\\sigma$: each $d$ contributes itself once for every multiple up to $n$. So the sum of $\\sigma(k)$ for $k$ up to $n$ equals the sum of $d\\left\\lfloor\\frac{n}{d}\\right\\rfloor$.",
        "同样的交换也适用于 $\\sigma$：每个 $d$ 对不超过 $n$ 的每个倍数贡献自身一次。所以 $k$ 不超过 $n$ 时 $\\sigma(k)$ 的和等于 $d\\left\\lfloor\\frac{n}{d}\\right\\rfloor$ 的和。",
      ],
      (rng) => {
        const n = rng.int(5, 50);
        let sum = 0;
        for (let d = 1; d <= n; d++) sum += d * Math.floor(n / d);
        let tau = 0;
        for (let d = 1; d <= n; d++) tau += Math.floor(n / d);
        return ask(
          [`What is $\\sigma(1) + \\sigma(2) + \\cdots + \\sigma(${n})$?`, `$\\sigma(1) + \\sigma(2) + \\cdots + \\sigma(${n})$ 是多少？`],
          sum,
          [tau, sum + n, sum - 1],
          [
            `Add $d\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ for $d$ from 1 to ${n}.`,
            `对 $d$ 从 1 到 ${n} 求 $d\\left\\lfloor\\frac{${n}}{d}\\right\\rfloor$ 的和。`,
          ],
        );
      },
    ),
    point(
      "coprime-pairs",
      ["Coprime pairs", "互质对"],
      [
        "The number of pairs $(a, b)$ with $1 \\le a < b \\le n$ and $\\gcd(a, b) = 1$ is the sum of $\\varphi(b)$ for $b$ from 2 to $n$. As $n$ grows, the chance that two numbers are coprime tends to $\\frac{6}{\\pi^{2}}$.",
        "满足 $1 \\le a < b \\le n$ 和 $\\gcd(a, b) = 1$ 的对 $(a, b)$ 的个数，是 $b$ 从 2 到 $n$ 时 $\\varphi(b)$ 的和。当 $n$ 增大时，两个数互质的概率趋于 $\\frac{6}{\\pi^{2}}$。",
      ],
      (rng) => {
        const n = rng.int(5, 60);
        let sum = 0;
        for (let b = 2; b <= n; b++) sum += totient(b);
        return ask(
          [`How many pairs $1 \\le a < b \\le ${n}$ have $\\gcd(a, b) = 1$?`, `有多少对 $1 \\le a < b \\le ${n}$ 满足 $\\gcd(a, b) = 1$？`],
          sum,
          [sum + 1, (n * (n - 1)) / 2 === sum ? sum + 2 : (n * (n - 1)) / 2, sum + totient(n)],
          [`Add $\\varphi(b)$ for $b$ from 2 to ${n}.`, `对 $b$ 从 2 到 ${n} 求 $\\varphi(b)$ 的和。`],
        );
      },
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
        "The prime number theorem says that $\\pi(x)$ is close to $\\frac{x}{\\ln x}$ for large $x$. Using the value $\\ln 10 \\approx 2.3$, we get quick estimates for the count of primes up to a power of ten.",
        "素数定理说明，对大的 $x$，$\\pi(x)$ 接近 $\\frac{x}{\\ln x}$。用 $\\ln 10 \\approx 2.3$ 可以快速估计不超过 10 的幂的质数个数。",
      ],
      (rng) => {
        const k = rng.int(2, 30);
        const c = rng.int(1, 9);
        return ask(
          [
            `Using $\\ln 10 \\approx 2.3$, the estimate $\\frac{x}{\\ln x}$ at $x = ${c} \\cdot 10^{${k}}$ with $\\ln x \\approx ${k} \\cdot 2.3$ is $m \\cdot 10^{${k}}$. What is $m$?`,
            `用 $\\ln 10 \\approx 2.3$，估计式 $\\frac{x}{\\ln x}$ 在 $x = ${c} \\cdot 10^{${k}}$、$\\ln x \\approx ${k} \\cdot 2.3$ 时是 $m \\cdot 10^{${k}}$。$m$ 是多少？`,
          ],
          Q.of(10 * c, 23 * k),
          [Q.of(c, 23 * k), Q.of(10 * c, 23), Q.of(23 * k, 10 * c)],
          [`Divide ${c} by the product $${k} \\cdot 2.3$.`, `用 ${c} 除以乘积 $${k} \\cdot 2.3$。`],
        );
      },
    ),
    point(
      "the-density-of-primes",
      ["The density of primes", "质数的密度"],
      [
        "Near a large number $x$, about one number in $\\ln x$ is prime. So replacing $x$ by $x^{k}$ multiplies the typical gap by $k$, since $\\ln x^{k} = k \\ln x$, and primes thin out slowly as the numbers get larger.",
        "在大数 $x$ 附近，大约每 $\\ln x$ 个数中有一个质数。所以把 $x$ 换成 $x^{k}$，典型间隔就乘以 $k$，因为 $\\ln x^{k} = k \\ln x$，质数随数的增大而缓慢变稀。",
      ],
      (rng) => {
        const g = rng.int(5, 50);
        const k = rng.int(2, 15);
        return ask(
          [
            `Near $x$, the typical gap between primes is about ${g}. What is the typical gap near $x^{${k}}$?`,
            `在 $x$ 附近，质数的典型间隔约为 ${g}。在 $x^{${k}}$ 附近典型间隔是多少？`,
          ],
          g * k,
          [g ** 2, g + k, g],
          [`The gap is about $\\ln x$, and $\\ln(x^{${k}}) = ${k}\\ln x$.`, `间隔约为 $\\ln x$，而 $\\ln(x^{${k}}) = ${k}\\ln x$。`],
        );
      },
    ),
    point(
      "bertrands-postulate",
      ["Bertrand's postulate", "伯特兰公设"],
      [
        "Bertrand's postulate guarantees a prime strictly between $n$ and $2n$ for every $n > 1$. The theorem says nothing about how close to $n$ that prime is, so we still have to search for the first one.",
        "伯特兰公设保证对每个 $n > 1$，在 $n$ 和 $2n$ 之间有一个质数。定理没有说这个质数离 $n$ 多近，所以仍要搜索第一个。",
      ],
      (rng) => {
        const n = rng.int(8, 500);
        let p = n + 1;
        while (!isPrime(p)) p += 1;
        let q = p + 1;
        while (!isPrime(q)) q += 1;
        return ask(
          [
            `Bertrand's postulate promises a prime between ${n} and ${2 * n}. What is the smallest such prime?`,
            `伯特兰公设保证 ${n} 和 ${2 * n} 之间有一个质数。最小的这样的质数是多少？`,
          ],
          p,
          [q, 2 * n - 1, n + 1 === p ? p + 2 : n + 1],
          [`Check the numbers just above ${n}; the first prime is ${p}.`, `检查 ${n} 之后的数；第一个质数是 ${p}。`],
        );
      },
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
        "A primitive root exists modulo $n$ exactly when $n$ is 1, 2, 4, an odd prime power, or twice an odd prime power. For other moduli, every unit has an order smaller than $\\varphi(n)$.",
        "模 $n$ 有原根，当且仅当 $n$ 是 1、2、4、奇质数的幂，或奇质数的幂的二倍。对其他模，每个单位的阶都小于 $\\varphi(n)$。",
      ],
      (rng) => {
        const has = (n: number): boolean => {
          if (n === 2 || n === 4) return true;
          const m = n % 2 === 0 ? n / 2 : n;
          if (m % 2 === 0) return false;
          return factorize(m).length === 1;
        };
        const n = rng.int(5, 400);
        const yes = has(n);
        const a: [string, string] = ["Yes, primitive roots exist", "有，原根存在"];
        const b: [string, string] = ["No, there is no primitive root", "没有，不存在原根"];
        return choose(
          rng,
          [`Does the modulus ${n} have a primitive root?`, `模 ${n} 有原根吗？`],
          yes ? a : b,
          [yes ? b : a, ["Only when it is prime", "只有它是质数时才有"], ["Every modulus has exactly one", "每个模恰有一个"]],
          [
            `Here ${n} factors as $${factorizationLatex(factorize(n))}$. A primitive root exists only for 2, 4, $p^{k}$ and $2p^{k}$ with $p$ an odd prime, and ${n} ${yes ? "has" : "does not have"} one of these forms.`,
            `这里 ${n} 分解为 $${factorizationLatex(factorize(n))}$。只有 2、4、$p^{k}$ 和 $2p^{k}$（$p$ 为奇质数）才有原根，而 ${n} ${yes ? "是" : "不是"}这些形式之一。`,
          ],
        );
      },
    ),
    point(
      "counting-primitive-roots",
      ["Counting primitive roots", "计算原根的个数"],
      [
        "If a primitive root $g$ exists, then the units are the powers of $g$, and $g^{k}$ is a primitive root exactly when $k$ is coprime to $\\varphi(n)$. So the count of primitive roots is $\\varphi(\\varphi(n))$.",
        "如果原根 $g$ 存在，单位就是 $g$ 的幂，而 $g^{k}$ 是原根当且仅当 $k$ 与 $\\varphi(n)$ 互质。所以原根的个数是 $\\varphi(\\varphi(n))$。",
      ],
      (rng) => {
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
        return ask(
          [`How many primitive roots does the modulus ${n} have?`, `模 ${n} 有多少个原根？`],
          totient(f),
          [f, totient(f) + 1, totient(f) === 1 ? 2 : totient(f) - 1],
          [
            `We have $\\varphi(${n}) = ${f}$, and the count is $\\varphi(${f}) = ${totient(f)}$.`,
            `$\\varphi(${n}) = ${f}$，个数是 $\\varphi(${f}) = ${totient(f)}$。`,
          ],
        );
      },
    ),
    point(
      "the-largest-order",
      ["The largest order", "最大的阶"],
      [
        "For a modulus $n = pq$ with distinct odd primes, the order of any unit divides $\\operatorname{lcm}(p - 1, q - 1)$. This is smaller than $\\varphi(n)$ because both $p - 1$ and $q - 1$ are even, so no primitive root exists.",
        "对不同奇质数之积 $n = pq$，任何单位的阶都整除 $\\operatorname{lcm}(p - 1, q - 1)$。因为 $p - 1$ 和 $q - 1$ 都是偶数，它小于 $\\varphi(n)$，所以不存在原根。",
      ],
      (rng) => {
        const [p, q] = rng.sample(oddPrimes, 2) as [number, number];
        const l = ((p - 1) * (q - 1)) / gcdOf(p - 1, q - 1);
        return ask(
          [`What is the largest possible order of a unit modulo ${p * q}?`, `模 ${p * q} 的单位的最大可能的阶是多少？`],
          l,
          [(p - 1) * (q - 1), Math.max(p, q) - 1 === l ? l + 2 : Math.max(p, q) - 1, l + 1],
          [
            `A unit's order is the lcm of its orders modulo ${p} and ${q}, which can reach ${p - 1} and ${q - 1} independently, so the largest is $\\operatorname{lcm}(${p - 1}, ${q - 1}) = ${l}$.`,
            `单位的阶是它模 ${p} 和模 ${q} 的阶的最小公倍数，这两个阶可以分别独立达到 ${p - 1} 和 ${q - 1}，所以最大值是 $\\operatorname{lcm}(${p - 1}, ${q - 1}) = ${l}$。`,
          ],
        );
      },
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
        "With a primitive root $g$ modulo $p$, the index of $a$ is the exponent $k$ with $g^{k} \\equiv a$. Indices behave like logarithms, so the index of a product is the sum of the indices modulo $p - 1$.",
        "取模 $p$ 的原根 $g$，$a$ 的指标是满足 $g^{k} \\equiv a$ 的指数 $k$。指标的行为像对数，所以乘积的指标是指标之和模 $p - 1$。",
      ],
      (rng) => {
        const p = rng.pick([17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
        const [i, j] = rng.sample(
          Array.from({ length: p - 2 }, (_, v) => v + 1),
          2,
        ) as [number, number];
        return ask(
          [
            `Modulo ${p}, we have $\\operatorname{ind}(a) = ${i}$ and $\\operatorname{ind}(b) = ${j}$. What is $\\operatorname{ind}(ab)$, as a number from 0 to ${p - 2}?`,
            `模 ${p} 时，$\\operatorname{ind}(a) = ${i}$，$\\operatorname{ind}(b) = ${j}$。$\\operatorname{ind}(ab)$ 是多少（取 0 到 ${p - 2}）？`,
          ],
          (i + j) % (p - 1),
          [
            (i * j) % (p - 1) === (i + j) % (p - 1) ? ((i + j) % (p - 1)) + 1 : (i * j) % (p - 1),
            (i + j) % p === (i + j) % (p - 1) ? ((i + j) % (p - 1)) + 2 : (i + j) % p,
            Math.abs(i - j) === (i + j) % (p - 1) ? ((i + j) % (p - 1)) + 3 : Math.abs(i - j),
          ],
          [`Add ${i} and ${j}, and reduce modulo $p - 1 = ${p - 1}$.`, `把 ${i} 和 ${j} 相加，再模 $p - 1 = ${p - 1}$。`],
        );
      },
    ),
    point(
      "solving-a-power-congruence",
      ["Solving a power congruence", "解幂同余式"],
      [
        "Taking indices turns $x^{k} \\equiv a$ into the linear congruence $k \\operatorname{ind}(x) \\equiv \\operatorname{ind}(a)$ modulo $p - 1$. So the number of solutions is either 0 or $\\gcd(k, p - 1)$.",
        "取指标把 $x^{k} \\equiv a$ 变成线性同余式 $k \\operatorname{ind}(x) \\equiv \\operatorname{ind}(a)$ 模 $p - 1$。所以解的个数是 0 或 $\\gcd(k, p - 1)$。",
      ],
      (rng) => {
        const p = rng.pick([13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
        const k = rng.int(2, 18);
        const x = rng.int(2, p - 2);
        const a = powMod(x, k, p);
        const g = gcdOf(k, p - 1);
        return ask(
          [`How many solutions does $x^{${k}} \\equiv ${a} \\pmod{${p}}$ have?`, `$x^{${k}} \\equiv ${a} \\pmod{${p}}$ 有多少个解？`],
          g,
          [k === g ? g + 1 : k, g === 1 ? 2 : 1, 0],
          [
            `A solution exists because $${x}^{${k}} \\equiv ${a}$, so the count is $\\gcd(${k}, ${p - 1})$.`,
            `解存在，因为 $${x}^{${k}} \\equiv ${a}$，所以个数是 $\\gcd(${k}, ${p - 1})$。`,
          ],
        );
      },
    ),
    point(
      "kth-power-residues",
      ["Power residues", "幂剩余"],
      [
        "The $k$th powers form a subgroup of the units. Its size is $\\frac{p - 1}{\\gcd(k, p - 1)}$, so a fraction $\\frac{1}{\\gcd(k, p - 1)}$ of the units are $k$th powers modulo $p$.",
        "$k$ 次幂构成单位的子群。它的大小是 $\\frac{p - 1}{\\gcd(k, p - 1)}$，所以模 $p$ 的单位中有 $\\frac{1}{\\gcd(k, p - 1)}$ 是 $k$ 次幂。",
      ],
      (rng) => {
        const p = rng.pick([...oddPrimes.filter((v) => v >= 7), 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]);
        const k = rng.int(2, 12);
        const g = gcdOf(k, p - 1);
        return ask(
          [`How many distinct nonzero $${k}$th powers are there modulo ${p}?`, `模 ${p} 有多少个不同的非零 $${k}$ 次幂？`],
          (p - 1) / g,
          [p - 1 === (p - 1) / g ? p - 2 : p - 1, g === (p - 1) / g ? g + 1 : g, (p - 1) / g + 1],
          [`Divide $p - 1 = ${p - 1}$ by $\\gcd(${k}, ${p - 1}) = ${g}$.`, `用 $\\gcd(${k}, ${p - 1}) = ${g}$ 除 $p - 1 = ${p - 1}$。`],
        );
      },
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
        "The exponent of $p$ in $n!$ is $\\left\\lfloor\\frac{n}{p}\\right\\rfloor + \\left\\lfloor\\frac{n}{p^{2}}\\right\\rfloor + \\cdots$. Each term counts the multiples of a higher power, because a multiple of $p^{2}$ supplies a second factor.",
        "$n!$ 中 $p$ 的指数是 $\\left\\lfloor\\frac{n}{p}\\right\\rfloor + \\left\\lfloor\\frac{n}{p^{2}}\\right\\rfloor + \\cdots$。每一项数更高次幂的倍数，因为 $p^{2}$ 的倍数提供第二个因子。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7]);
        const n = rng.int(20, 800);
        let e = 0;
        const floors: number[] = [];
        for (let m = Math.floor(n / p); m > 0; m = Math.floor(m / p)) {
          e += m;
          floors.push(m);
        }
        const added = floors.length > 1 ? `${floors.join(" + ")} = ${e}` : `${e}`;
        return ask(
          [`What is the exponent of ${p} in $${n}!$?`, `$${n}!$ 中 ${p} 的指数是多少？`],
          e,
          [Math.floor(n / p) === e ? e + 1 : Math.floor(n / p), e + 1, e - 1],
          [
            `Add $\\left\\lfloor\\frac{${n}}{${p}^{i}}\\right\\rfloor$ for $i = 1, 2, \\ldots$ until the terms vanish: $${added}$.`,
            `对 $i = 1, 2, \\ldots$ 求 $\\left\\lfloor\\frac{${n}}{${p}^{i}}\\right\\rfloor$ 的和，直到项为零：$${added}$。`,
          ],
        );
      },
    ),
    point(
      "trailing-zeros",
      ["Trailing zeros", "末尾的零"],
      [
        "The zeros at the end of $n!$ count the factors of ten. Factors of 2 are more common than factors of 5 in a factorial, so the number of trailing zeros is the exponent of 5 in $n!$.",
        "$n!$ 末尾的零计算因子十的个数。阶乘中因子 2 比因子 5 多，所以末尾零的个数是 $n!$ 中 5 的指数。",
      ],
      (rng) => {
        const n = rng.int(25, 3000);
        let e = 0;
        const floors: number[] = [];
        for (let m = Math.floor(n / 5); m > 0; m = Math.floor(m / 5)) {
          e += m;
          floors.push(m);
        }
        return ask(
          [`How many zeros does $${n}!$ end in?`, `$${n}!$ 末尾有多少个零？`],
          e,
          [Math.floor(n / 5) === e ? e + 1 : Math.floor(n / 5), Math.floor(n / 10), e + 1],
          [
            `Count factors of 5: add $\\left\\lfloor\\frac{${n}}{5^{i}}\\right\\rfloor$ for each $i$: $${floors.join(" + ")} = ${e}$.`,
            `数因子 5：对每个 $i$ 加 $\\left\\lfloor\\frac{${n}}{5^{i}}\\right\\rfloor$：$${floors.join(" + ")} = ${e}$。`,
          ],
        );
      },
    ),
    point(
      "carries-in-a-binomial",
      ["Carries in a binomial", "二项式中的进位"],
      [
        "Kummer's theorem says that the exponent of $p$ in $\\binom{m + n}{m}$ equals the number of carries when adding $m$ and $n$ in base $p$. So in base 2, a carry-free sum means the binomial coefficient is odd.",
        "库默尔定理说，$\\binom{m + n}{m}$ 中 $p$ 的指数等于在 $p$ 进制中把 $m$ 和 $n$ 相加时的进位次数。所以在二进制中，没有进位的和意味着二项式系数是奇数。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5]);
        const m = rng.int(3, 200);
        const n = rng.int(3, 200);
        let carries = 0;
        let carry = 0;
        for (let a = m, b = n; a > 0 || b > 0; a = Math.floor(a / p), b = Math.floor(b / p)) {
          carry = (a % p) + (b % p) + carry >= p ? 1 : 0;
          carries += carry;
        }
        return ask(
          [`What is the exponent of ${p} in $\\binom{${m + n}}{${m}}$?`, `$\\binom{${m + n}}{${m}}$ 中 ${p} 的指数是多少？`],
          carries,
          [carries + 1, carries === 0 ? 2 : carries - 1, carries + 2],
          [`Add ${m} and ${n} in base ${p}, and count the carries.`, `在 ${p} 进制中把 ${m} 和 ${n} 相加，数进位次数。`],
        );
      },
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
        "Lucas' theorem says that $\\binom{n}{k}$ modulo $p$ is the product of the binomial coefficients of the base $p$ digits. So a huge coefficient reduces to a product of very small ones.",
        "卢卡斯定理说，$\\binom{n}{k}$ 模 $p$ 是 $p$ 进制各位数字的二项式系数之积。所以巨大的系数化简成很小的系数之积。",
      ],
      (rng) => {
        const p = rng.pick([3, 5, 7, 11, 13]);
        const n1 = rng.int(1, p - 1);
        const n0 = rng.int(1, p - 1);
        const k1 = rng.int(0, n1);
        const k0 = rng.int(0, n0);
        const c = (a: number, b: number): number => {
          let r = 1;
          for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1);
          return r;
        };
        const v = (c(n1, k1) * c(n0, k0)) % p;
        const n = n1 * p + n0;
        const k = k1 * p + k0;
        return ask(
          [`What is $\\binom{${n}}{${k}}$ modulo ${p}?`, `$\\binom{${n}}{${k}}$ 模 ${p} 是多少？`],
          v,
          [(v + 1) % p, c(n1, k1) % p === v ? (v + 2) % p : c(n1, k1) % p, c(n0, k0) % p === v ? (v + 3) % p : c(n0, k0) % p],
          [
            `In base ${p} the digits are $(${n1}, ${n0})$ and $(${k1}, ${k0})$, so multiply: $\\binom{${n1}}{${k1}}\\binom{${n0}}{${k0}} = ${c(n1, k1)} \\cdot ${c(n0, k0)} \\equiv ${v} \\pmod{${p}}$.`,
            `在 ${p} 进制中数字是 $(${n1}, ${n0})$ 和 $(${k1}, ${k0})$，所以相乘：$\\binom{${n1}}{${k1}}\\binom{${n0}}{${k0}} = ${c(n1, k1)} \\cdot ${c(n0, k0)} \\equiv ${v} \\pmod{${p}}$。`,
          ],
        );
      },
    ),
    point(
      "odd-entries-of-a-row",
      ["Odd entries of a row", "一行中的奇数项"],
      [
        "With $p = 2$, the coefficient $\\binom{n}{k}$ is odd exactly when every binary digit of $k$ is at most the matching digit of $n$. So row $n$ of Pascal's triangle has $2^{s}$ odd entries, where $s$ counts the ones in $n$.",
        "取 $p = 2$，系数 $\\binom{n}{k}$ 是奇数，当且仅当 $k$ 的每个二进制位都不超过 $n$ 的对应位。所以帕斯卡三角形第 $n$ 行有 $2^{s}$ 个奇数项，其中 $s$ 是 $n$ 中 1 的个数。",
      ],
      (rng) => {
        const n = rng.int(5, 2000);
        const s = n.toString(2).replace(/0/g, "").length;
        return ask(
          [`How many entries in row ${n} of Pascal's triangle are odd?`, `帕斯卡三角形第 ${n} 行有多少个奇数项？`],
          2 ** s,
          [s, 2 ** (s + 1), n + 1 === 2 ** s ? 2 ** s + 2 : n + 1],
          [
            `In binary, ${n} is ${n.toString(2)}, with ${s} ones, so the count is $2^{${s}}$.`,
            `${n} 的二进制是 ${n.toString(2)}，有 ${s} 个 1，所以个数是 $2^{${s}}$。`,
          ],
        );
      },
    ),
    point(
      "a-row-not-divisible-by-p",
      ["Entries not divisible by p", "不被 p 整除的项"],
      [
        "In base $p$, each digit $n_i$ allows $n_i + 1$ choices of the matching digit of $k$. So the number of entries of row $n$ not divisible by $p$ is the product of $n_i + 1$ over all digits.",
        "在 $p$ 进制中，每位 $n_i$ 允许 $k$ 的对应位有 $n_i + 1$ 种选择。所以第 $n$ 行不被 $p$ 整除的项数是所有位上 $n_i + 1$ 的乘积。",
      ],
      (rng) => {
        const p = rng.pick([3, 5, 7]);
        const n = rng.int(p + 1, p ** 3 + 300);
        let prod = 1;
        const digits: number[] = [];
        for (let m = n; m > 0; m = Math.floor(m / p)) {
          digits.unshift(m % p);
          prod *= (m % p) + 1;
        }
        return ask(
          [
            `How many entries in row ${n} of Pascal's triangle are not divisible by ${p}?`,
            `帕斯卡三角形第 ${n} 行有多少项不被 ${p} 整除？`,
          ],
          prod,
          [
            prod + 1,
            n + 1 === prod ? prod + 2 : n + 1,
            digits.reduce((a, b) => a + b + 1, 0) === prod ? prod + 3 : digits.reduce((a, b) => a + b + 1, 0),
          ],
          [
            `In base ${p} the digits of ${n} are ${digits.join(", ")}; multiply each digit plus one: $${digits.map((d) => d + 1).join(" \\cdot ")} = ${prod}$.`,
            `${n} 的 ${p} 进制数字是 ${digits.join(", ")}；把每位加一后相乘：$${digits.map((d) => d + 1).join(" \\cdot ")} = ${prod}$。`,
          ],
        );
      },
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
        "A congruence can prove that an equation has no solution. Squares are only 0 or 1 modulo 4, and only 0, 1 or 4 modulo 8, so a sum of few squares cannot reach certain residues.",
        "同余可以证明方程无解。平方数模 4 只能是 0 或 1，模 8 只能是 0、1 或 4，所以少数几个平方数之和达不到某些剩余。",
      ],
      (rng) => {
        const m = rng.int(5, 60);
        const set = new Set<number>();
        for (let x = 0; x < m; x++) set.add((x * x) % m);
        return ask(
          [`How many different residues do squares take modulo ${m}, counting 0?`, `平方数模 ${m} 取多少个不同的剩余（包括 0）？`],
          set.size,
          [m, set.size + 1, set.size - 1],
          [
            `Square each of the residues from 0 to ${m - 1}, and count the distinct results.`,
            `把 0 到 ${m - 1} 的每个剩余平方，再数不同的结果。`,
          ],
        );
      },
    ),
    point(
      "an-equation-with-no-solution",
      ["An equation with no solution", "无解的方程"],
      [
        "Numbers of the form $4k + 3$ are never the sum of two squares, because two squares add to 0, 1 or 2 modulo 4. A single small modulus can settle the question for infinitely many numbers.",
        "形如 $4k + 3$ 的数永远不是两个平方数之和，因为两个平方数相加模 4 得 0、1 或 2。一个小的模数就能解决无穷多个数的问题。",
      ],
      (rng) => {
        const k = rng.int(2, 400);
        const bad = 4 * k + 3;
        const a = rng.int(1, 30);
        const b = rng.int(1, 30);
        const good = a * a + b * b;
        const options: [string, string][] = [
          [`${bad}`, `${bad}`],
          [`${good}`, `${good}`],
          [`${(a + 1) ** 2 + b * b}`, `${(a + 1) ** 2 + b * b}`],
          [`${(a + 2) ** 2 + (b + 1) ** 2}`, `${(a + 2) ** 2 + (b + 1) ** 2}`],
        ];
        return choose(
          rng,
          ["Which of these numbers cannot be a sum of two squares of whole numbers?", "这些数中哪个不可能是两个整数的平方和？"],
          options[0] as [string, string],
          options.slice(1),
          [
            `${bad} leaves a remainder of 3 modulo 4, and two squares can never add to that.`,
            `${bad} 模 4 余 3，两个平方数相加永远得不到这个余数。`,
          ],
        );
      },
    ),
    point(
      "a-descent-step",
      ["A descent step", "递降的一步"],
      [
        "Fermat's descent shows that a solution would produce a smaller one, which is impossible for whole numbers. For $x^{2} + y^{2} = 3z^{2}$, squares modulo 3 force 3 to divide both $x$ and $y$, and then dividing gives a smaller solution.",
        "费马的递降法说明一个解会产生更小的解，这对整数是不可能的。对 $x^{2} + y^{2} = 3z^{2}$，平方数模 3 迫使 3 整除 $x$ 和 $y$，再除以它就得到更小的解。",
      ],
      (rng) => {
        const prime = rng.pick([3, 7, 11, 19, 23]);
        const e = rng.int(1, 4);
        const m = rng.int(1, 40) * prime + rng.int(1, prime - 1);
        const x = prime ** e * m;
        return ask(
          [
            `Descent on $x^{2} + y^{2} = ${prime}z^{2}$ replaces $(x, y, z)$ by $(x, y, z)$ divided by ${prime}. If $x = ${x}$, how many steps are possible before $x$ stops being divisible by ${prime}?`,
            `对 $x^{2} + y^{2} = ${prime}z^{2}$ 的递降把 $(x, y, z)$ 换成 $(x, y, z)$ 除以 ${prime}。如果 $x = ${x}$，在 $x$ 不再被 ${prime} 整除之前能进行多少步？`,
          ],
          e,
          [e + 1, e + 2, m],
          [
            `Since $${x} = ${prime}^{${e}} \\cdot ${m}$, it stops after ${e} steps, yet descent never stops, so no solution exists.`,
            `因为 $${x} = ${prime}^{${e}} \\cdot ${m}$，它在 ${e} 步后停止，而递降永不停止，所以没有解。`,
          ],
        );
      },
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
        "The number of integer pairs with $x^{2} + y^{2} = n$, counting order and signs, is $r_2(n) = 4(d_1 - d_3)$. Here $d_1$ and $d_3$ count the divisors of $n$ that are 1 and 3 modulo 4.",
        "满足 $x^{2} + y^{2} = n$ 的整数对的个数（计顺序和符号）是 $r_2(n) = 4(d_1 - d_3)$。这里 $d_1$ 和 $d_3$ 分别数 $n$ 的模 4 余 1 和余 3 的除数。",
      ],
      (rng) => {
        const n = rng.int(5, 500);
        const ds = divisors(n);
        const d1 = ds.filter((d) => d % 4 === 1).length;
        const d3 = ds.filter((d) => d % 4 === 3).length;
        const r = 4 * (d1 - d3);
        return ask(
          [
            `How many integer pairs $(x, y)$, counting order and signs, satisfy $x^{2} + y^{2} = ${n}$?`,
            `有多少个整数对 $(x, y)$（计顺序和符号）满足 $x^{2} + y^{2} = ${n}$？`,
          ],
          r,
          [r + 4, d1 - d3 === r ? r + 8 : d1 - d3, 4 * d1 === r ? r + 12 : 4 * d1],
          [
            `${n} has ${d1} divisors congruent to 1 modulo 4 and ${d3} congruent to 3, so the count is $4(${d1} - ${d3}) = ${r}$.`,
            `${n} 有 ${d1} 个模 4 余 1 的除数和 ${d3} 个模 4 余 3 的除数，所以个数是 $4(${d1} - ${d3}) = ${r}$。`,
          ],
        );
      },
    ),
    point(
      "primes-of-the-form-4k-plus-1",
      ["Primes of the form 4k + 1", "形如 4k + 1 的质数"],
      [
        "A prime $p \\equiv 1 \\pmod{4}$ is a sum of two squares in exactly one way, apart from order and signs. So $r_2(p) = 8$, while $r_2(q) = 0$ for a prime $q \\equiv 3 \\pmod{4}$.",
        "质数 $p \\equiv 1 \\pmod{4}$ 除顺序和符号外，恰有一种方式写成两个平方数之和。所以 $r_2(p) = 8$，而对质数 $q \\equiv 3 \\pmod{4}$，$r_2(q) = 0$。",
      ],
      (rng) => {
        const pool = primesUpTo(400).filter((v) => v % 2 === 1);
        const p = rng.pick(pool);
        const r = p % 4 === 1 ? 8 : 0;
        return ask(
          [
            `What is $r_2(${p})$, the number of integer pairs with $x^{2} + y^{2} = ${p}$?`,
            `$r_2(${p})$ 是多少，即满足 $x^{2} + y^{2} = ${p}$ 的整数对个数？`,
          ],
          r,
          r === 8 ? [4, 2, 0] : [8, 4, 2],
          [`The prime ${p} is ${p % 4} modulo 4, which decides the count.`, `质数 ${p} 模 4 余 ${p % 4}，这决定了个数。`],
        );
      },
    ),
    point(
      "the-average-number-of-representations",
      ["The average number of representations", "表示数的平均值"],
      [
        "Adding $r_2(k)$ for $k$ up to $n$ counts the lattice points in the disc of radius $\\sqrt{n}$. The area of that disc shows that the average value of $r_2$ tends to $\\pi$, as Gauss noticed.",
        "对 $k$ 不超过 $n$ 求 $r_2(k)$ 的和，就是数半径 $\\sqrt{n}$ 的圆内的格点。这个圆的面积说明 $r_2$ 的平均值趋于 $\\pi$，正如高斯所注意到的。",
      ],
      (rng) => {
        const r = rng.int(2, 15);
        const n = r * r + rng.int(0, 2 * r);
        let count = 0;
        const m = Math.floor(Math.sqrt(n));
        for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) if (x * x + y * y <= n && x * x + y * y > 0) count += 1;
        return ask(
          [
            `How many nonzero lattice points $(x, y)$ satisfy $x^{2} + y^{2} \\le ${n}$?`,
            `有多少个非零格点 $(x, y)$ 满足 $x^{2} + y^{2} \\le ${n}$？`,
          ],
          count,
          [count + 1, (2 * m + 1) ** 2 - 1 === count ? count + 2 : (2 * m + 1) ** 2 - 1, 4 * n === count ? count + 3 : 4 * n],
          [
            `This count is the sum of $r_2(k)$ for $k$ from 1 to ${n}, and it is close to $${n}\\pi$.`,
            `这个个数是 $k$ 从 1 到 ${n} 时 $r_2(k)$ 的和，接近 $${n}\\pi$。`,
          ],
        );
      },
    ),
  ],
);

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
        "Take the multiples $a, 2a, \\ldots, \\frac{p - 1}{2}a$ modulo $p$. Gauss's lemma says that the symbol $\\left(\\frac{a}{p}\\right)$ is $(-1)^{\\mu}$, where $\\mu$ counts the residues above $\\frac{p}{2}$.",
        "取倍数 $a, 2a, \\ldots, \\frac{p - 1}{2}a$ 模 $p$。高斯引理说，符号 $\\left(\\frac{a}{p}\\right)$ 是 $(-1)^{\\mu}$，其中 $\\mu$ 数大于 $\\frac{p}{2}$ 的剩余。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((v) => v >= 11));
        const a = rng.int(2, p - 1);
        let mu = 0;
        for (let k = 1; k <= (p - 1) / 2; k++) if ((k * a) % p > p / 2) mu += 1;
        return ask(
          [
            `For $p = ${p}$ and $a = ${a}$, how many of $a, 2a, \\ldots, ${(p - 1) / 2}a$ have a residue above $\\frac{${p}}{2}$?`,
            `对 $p = ${p}$，$a = ${a}$，$a, 2a, \\ldots, ${(p - 1) / 2}a$ 中有多少个的剩余大于 $\\frac{${p}}{2}$？`,
          ],
          mu,
          [mu + 1, (p - 1) / 2 - mu === mu ? mu + 2 : (p - 1) / 2 - mu, mu === 0 ? 2 : mu - 1],
          [
            `Reduce each multiple of ${a} modulo ${p}, and count those above ${(p - 1) / 2}.`,
            `把 ${a} 的每个倍数模 ${p}，再数大于 ${(p - 1) / 2} 的个数。`,
          ],
        );
      },
    ),
    point(
      "the-symbol-from-the-count",
      ["The symbol from the count", "由个数得符号"],
      [
        "Pairing each large residue with its negative turns the product of the multiples into a sign times $\\left(\\frac{p - 1}{2}\\right)!$. Comparing with Euler's criterion gives the symbol as $(-1)^{\\mu}$.",
        "把每个大剩余与它的负数配对，倍数之积就变成一个符号乘 $\\left(\\frac{p - 1}{2}\\right)!$。与欧拉判别法比较，得符号是 $(-1)^{\\mu}$。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((v) => v >= 11));
        const a = rng.int(2, p - 1);
        let mu = 0;
        for (let k = 1; k <= (p - 1) / 2; k++) if ((k * a) % p > p / 2) mu += 1;
        return ask(
          [`What is $\\left(\\frac{${a}}{${p}}\\right)$, using Gauss's lemma?`, `用高斯引理，$\\left(\\frac{${a}}{${p}}\\right)$ 是多少？`],
          mu % 2 === 0 ? 1 : -1,
          [mu % 2 === 0 ? -1 : 1, 0, mu === 1 || mu === 0 ? 2 : mu],
          [
            `There are ${mu} residues above $\\frac{${p}}{2}$, so the sign is $(-1)^{${mu}}$.`,
            `有 ${mu} 个剩余大于 $\\frac{${p}}{2}$，所以符号是 $(-1)^{${mu}}$。`,
          ],
        );
      },
    ),
    point(
      "the-symbol-of-two",
      ["The symbol of two", "二的符号"],
      [
        "Applying the lemma to $a = 2$ gives a formula that depends only on $p$ modulo 8. The value of $\\left(\\frac{2}{p}\\right)$ is 1 when $p \\equiv \\pm 1 \\pmod{8}$, and $-1$ when $p \\equiv \\pm 3 \\pmod{8}$.",
        "对 $a = 2$ 应用引理，得到只依赖 $p$ 模 8 的公式。当 $p \\equiv \\pm 1 \\pmod{8}$ 时 $\\left(\\frac{2}{p}\\right)$ 是 1，当 $p \\equiv \\pm 3 \\pmod{8}$ 时是 $-1$。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(600).filter((v) => v > 2));
        const r = p % 8;
        const v = r === 1 || r === 7 ? 1 : -1;
        return ask(
          [`What is $\\left(\\frac{2}{${p}}\\right)$?`, `$\\left(\\frac{2}{${p}}\\right)$ 是多少？`],
          v,
          [-v, 0, 2],
          [
            `Here ${p} is ${r} modulo 8, which is ${v === 1 ? "" : "not "}$\\pm 1$.`,
            `这里 ${p} 模 8 余 ${r}，它${v === 1 ? "是" : "不是"} $\\pm 1$。`,
          ],
        );
      },
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
        "A form $ax^{2} + bxy + cy^{2}$ has discriminant $b^{2} - 4ac$. An integer change of variables with determinant $\\pm 1$ does not change it, so the discriminant is the basic invariant of a family of equivalent forms.",
        "型 $ax^{2} + bxy + cy^{2}$ 的判别式是 $b^{2} - 4ac$。行列式为 $\\pm 1$ 的整数变量替换不改变它，所以判别式是等价型族的基本不变量。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 15), rng.int(1, 15), rng.int(1, 15)];
        return ask(
          [`What is the discriminant of $${a}x^{2} + ${b}xy + ${c}y^{2}$?`, `$${a}x^{2} + ${b}xy + ${c}y^{2}$ 的判别式是多少？`],
          b * b - 4 * a * c,
          [b * b + 4 * a * c, 4 * a * c - b * b, b * b - a * c],
          [`Compute $${b}^{2} - 4 \\cdot ${a} \\cdot ${c}$.`, `计算 $${b}^{2} - 4 \\cdot ${a} \\cdot ${c}$。`],
        );
      },
    ),
    point(
      "a-change-of-variables",
      ["A change of variables", "变量替换"],
      [
        "Replacing $x$ by $x + ty$ leaves $a$ unchanged, and changes $b$ to $b + 2at$. Equivalent forms represent exactly the same numbers, so we can choose $t$ to make $b$ small, which is the first step of reduction.",
        "把 $x$ 换成 $x + ty$，$a$ 不变，$b$ 变成 $b + 2at$。等价的型表示完全相同的数，所以可以选 $t$ 使 $b$ 变小，这是约化的第一步。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 12), rng.int(1, 15), rng.int(1, 15)];
        const s = rng.int(2, 7);
        return ask(
          [
            `In $${a}x^{2} + ${b}xy + ${c}y^{2}$, replace $x$ by $x + ${s}y$. What is the new coefficient of $y^{2}$?`,
            `在 $${a}x^{2} + ${b}xy + ${c}y^{2}$ 中，把 $x$ 换成 $x + ${s}y$。$y^{2}$ 的新系数是多少？`,
          ],
          a * s * s + b * s + c,
          [a * s + b + c, c, a * s * s + c],
          [
            `The new coefficient is the old form at $(${s}, 1)$: $${a} \\cdot ${s * s} + ${b} \\cdot ${s} + ${c}$.`,
            `新系数是旧的型在 $(${s}, 1)$ 处的值：$${a} \\cdot ${s * s} + ${b} \\cdot ${s} + ${c}$。`,
          ],
        );
      },
    ),
    point(
      "which-primes-are-represented",
      ["Which primes are represented", "哪些质数被表示"],
      [
        "A prime not dividing the discriminant $D$ is represented by some form of that discriminant exactly when $D$ is a square modulo the prime. So quadratic residues decide which primes can appear, as with $x^{2} + 2y^{2}$ and $x^{2} + 3y^{2}$.",
        "不整除判别式 $D$ 的质数，被该判别式的某个型表示，当且仅当 $D$ 模这个质数是平方数。所以二次剩余决定哪些质数能出现，例如 $x^{2} + 2y^{2}$ 和 $x^{2} + 3y^{2}$。",
      ],
      (rng) => {
        const k = rng.pick([1, 2, 3]);
        const pool = primesUpTo(300).filter((v) => v > 3);
        const p = rng.pick(pool);
        let found = false;
        for (let y = 0; k * y * y <= p; y++) {
          const x = Math.round(Math.sqrt(p - k * y * y));
          if (x * x + k * y * y === p) found = true;
        }
        const form = k === 1 ? "x^{2} + y^{2}" : `x^{2} + ${k}y^{2}`;
        const a: [string, string] = ["Yes, it is represented", "是，它被表示"];
        const b: [string, string] = ["No, it is not represented", "不，它不被表示"];
        const rule = k === 1 ? "1 modulo 4" : k === 2 ? "1 or 3 modulo 8" : "1 modulo 3";
        const ruleZh = k === 1 ? "模 4 余 1" : k === 2 ? "模 8 余 1 或 3" : "模 3 余 1";
        return choose(
          rng,
          [`Is the prime ${p} represented by the form $${form}$?`, `质数 ${p} 被型 $${form}$ 表示吗？`],
          found ? a : b,
          [found ? b : a, ["Only with a negative $x$", "只在 $x$ 为负时"], ["Only when $y$ is zero", "只在 $y$ 为零时"]],
          [
            `Primes represented by this form are those that are ${rule}. Here ${p} leaves remainder ${p % (k === 1 ? 4 : k === 2 ? 8 : 3)}, so it ${found ? "is" : "is not"} represented.`,
            `这个型表示的质数是${ruleZh}的质数。这里 ${p} 的余数是 ${p % (k === 1 ? 4 : k === 2 ? 8 : 3)}，所以它${found ? "被" : "不被"}表示。`,
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
        "If $x = a + \\frac{1}{x}$, then $x$ solves $x^{2} - ax - 1 = 0$. So the purely periodic fraction with the single repeating term $a$ equals $\\frac{a + \\sqrt{a^{2} + 4}}{2}$, which is a quadratic irrational.",
        "如果 $x = a + \\frac{1}{x}$，那么 $x$ 满足 $x^{2} - ax - 1 = 0$。所以只有单个循环项 $a$ 的纯周期连分数等于 $\\frac{a + \\sqrt{a^{2} + 4}}{2}$，是二次无理数。",
      ],
      (rng) => {
        const a = rng.int(1, 40);
        const d = a * a + 4;
        const right = same(`\\frac{${a} + \\sqrt{${d}}}{2}`);
        return choose(
          rng,
          [`What is the value of the continued fraction with every term equal to ${a}?`, `每一项都等于 ${a} 的连分数的值是多少？`],
          right,
          [same(`\\frac{${a} + \\sqrt{${a * a + 1}}}{2}`), same(`\\frac{${a} - \\sqrt{${d}}}{2}`), same(`${a} + \\sqrt{${d}}`)],
          [`Solve $x = ${a} + \\frac{1}{x}$, and take the positive root.`, `解 $x = ${a} + \\frac{1}{x}$，取正根。`],
        );
      },
    ),
    point(
      "the-expansion-of-a-square-root",
      ["The expansion of a square root", "平方根的展开"],
      [
        "Lagrange's theorem says that the continued fraction of a quadratic irrational is eventually periodic. For $\\sqrt{a^{2} + 1}$, the expansion is $[a; \\overline{2a}]$, so its repeating term is double the first term.",
        "拉格朗日定理说，二次无理数的连分数最终是周期的。对 $\\sqrt{a^{2} + 1}$，展开是 $[a; \\overline{2a}]$，所以循环项是第一项的两倍。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        return ask(
          [`What term repeats in the continued fraction of $\\sqrt{${a * a + 1}}$?`, `$\\sqrt{${a * a + 1}}$ 的连分数中循环的项是什么？`],
          2 * a,
          [a, 2 * a + 1, a + 1],
          [
            `Since $\\sqrt{${a * a + 1}} - ${a}$ has reciprocal $\\sqrt{${a * a + 1}} + ${a}$, the term is $2 \\cdot ${a}$.`,
            `因为 $\\sqrt{${a * a + 1}} - ${a}$ 的倒数是 $\\sqrt{${a * a + 1}} + ${a}$，所以这一项是 $2 \\cdot ${a}$。`,
          ],
        );
      },
    ),
    point(
      "a-convergent-of-a-square-root",
      ["A convergent of a square root", "平方根的渐近分数"],
      [
        "The convergents of $[a; \\overline{2a}]$ come from cutting the fraction short. They approximate the square root extremely well, and the first few are $a$, then $a + \\frac{1}{2a}$, and so on.",
        "$[a; \\overline{2a}]$ 的渐近分数来自截断连分数。它们对平方根的逼近非常好，前几个是 $a$，然后是 $a + \\frac{1}{2a}$，依此类推。",
      ],
      (rng) => {
        const a = rng.int(2, 40);
        return ask(
          [
            `What is the second convergent of $\\sqrt{${a * a + 1}} = [${a}; ${2 * a}, ${2 * a}, \\ldots]$, the one using two terms?`,
            `$\\sqrt{${a * a + 1}} = [${a}; ${2 * a}, ${2 * a}, \\ldots]$ 的第二个渐近分数（用两项）是多少？`,
          ],
          Q.of(2 * a * a + 1, 2 * a),
          [Q.of(2 * a * a - 1, 2 * a), Q.of(a * a + 1, a), Q.of(2 * a * a + 1, a)],
          [`Compute $${a} + \\frac{1}{${2 * a}}$.`, `计算 $${a} + \\frac{1}{${2 * a}}$。`],
        );
      },
    ),
  ],
);

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
        "A Dirichlet series is $\\sum \\frac{f(n)}{n^{s}}$, and multiplying two series convolves their coefficients. So $\\zeta(s)^{2}$ has coefficient $\\tau(n)$, while $\\zeta(s)\\zeta(s - 1)$ has coefficient $\\sigma(n)$.",
        "狄利克雷级数是 $\\sum \\frac{f(n)}{n^{s}}$，两个级数相乘就是系数的卷积。所以 $\\zeta(s)^{2}$ 的系数是 $\\tau(n)$，而 $\\zeta(s)\\zeta(s - 1)$ 的系数是 $\\sigma(n)$。",
      ],
      (rng) => {
        const n = rng.int(6, 300);
        const ds = divisors(n);
        const sigma = ds.reduce((a, b) => a + b, 0);
        const useTau = rng.bool();
        return ask(
          useTau
            ? [
                `What is the coefficient of $\\frac{1}{${n}^{s}}$ in $\\zeta(s)^{2}$?`,
                `$\\zeta(s)^{2}$ 中 $\\frac{1}{${n}^{s}}$ 的系数是多少？`,
              ]
            : [
                `What is the coefficient of $\\frac{1}{${n}^{s}}$ in $\\zeta(s)\\zeta(s - 1)$?`,
                `$\\zeta(s)\\zeta(s - 1)$ 中 $\\frac{1}{${n}^{s}}$ 的系数是多少？`,
              ],
          useTau ? ds.length : sigma,
          useTau ? [sigma, ds.length + 1, totient(n) === ds.length ? ds.length + 2 : totient(n)] : [ds.length, sigma + 1, totient(n)],
          useTau
            ? [`This coefficient counts the ${ds.length} divisors of ${n}.`, `这个系数数 ${n} 的 ${ds.length} 个除数。`]
            : [`This coefficient adds the divisors of ${n}.`, `这个系数把 ${n} 的除数相加。`],
        );
      },
    ),
    point(
      "an-euler-factor",
      ["An Euler factor", "欧拉因子"],
      [
        "Unique factorization turns $\\zeta(s)$ into a product over primes of $\\frac{1}{1 - p^{-s}}$. Each factor is a geometric series of the powers of one prime, and the product expands to give every whole number exactly once.",
        "唯一分解把 $\\zeta(s)$ 变成对质数的乘积 $\\frac{1}{1 - p^{-s}}$。每个因子是一个质数各次幂的几何级数，乘积展开后每个整数恰好出现一次。",
      ],
      (rng) => {
        const p = rng.pick(smallPrimes);
        const s = rng.int(1, 3);
        const q = p ** s;
        return ask(
          [`What is the Euler factor of $\\zeta(${s + 1})$ at the prime ${p}?`, `$\\zeta(${s + 1})$ 在质数 ${p} 处的欧拉因子是多少？`],
          Q.of(p ** (s + 1), p ** (s + 1) - 1),
          [Q.of(p ** (s + 1) - 1, p ** (s + 1)), Q.of(q, q + 1), Q.of(p + 1, p)],
          [`Use $\\frac{1}{1 - p^{-s}}$, with $p^{s} = ${p ** (s + 1)}$.`, `用 $\\frac{1}{1 - p^{-s}}$，其中 $p^{s} = ${p ** (s + 1)}$。`],
        );
      },
    ),
    point(
      "the-reciprocal-of-zeta",
      ["The reciprocal of zeta", "ζ 的倒数"],
      [
        "Since $\\mu$ is the convolution inverse of the constant function 1, the series with coefficients $\\mu(n)$ is $\\frac{1}{\\zeta(s)}$. So reading a coefficient of this reciprocal is the same as computing the Möbius function.",
        "因为 $\\mu$ 是常数函数 1 的卷积逆，系数为 $\\mu(n)$ 的级数是 $\\frac{1}{\\zeta(s)}$。所以读这个倒数的系数就是计算莫比乌斯函数。",
      ],
      (rng) => {
        const n = rng.int(6, 600);
        const f = factorize(n);
        const m = f.some(([, e]) => e > 1) ? 0 : f.length % 2 === 0 ? 1 : -1;
        return ask(
          [
            `What is the coefficient of $\\frac{1}{${n}^{s}}$ in $\\frac{1}{\\zeta(s)}$?`,
            `$\\frac{1}{\\zeta(s)}$ 中 $\\frac{1}{${n}^{s}}$ 的系数是多少？`,
          ],
          m,
          m === 0 ? [1, -1, 2] : [-m, 0, 2],
          [
            `This coefficient is $\\mu(${n})$, and ${n} has ${f.length} distinct prime factors${m === 0 ? ", with a repeated one" : ""}.`,
            `这个系数是 $\\mu(${n})$，${n} 有 ${f.length} 个不同的质因数${m === 0 ? "，并有重复的因数" : ""}。`,
          ],
        );
      },
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
        "In $\\mathbb{Z}[\\sqrt{-d}]$, the norm of $a + b\\sqrt{-d}$ is $a^{2} + db^{2}$, and the norm of a product is the product of the norms. So a factorization upstairs gives a factorization of ordinary whole numbers downstairs.",
        "在 $\\mathbb{Z}[\\sqrt{-d}]$ 中，$a + b\\sqrt{-d}$ 的范数是 $a^{2} + db^{2}$，乘积的范数是范数之积。所以这里的分解给出普通整数的分解。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        const [a, b, c, e] = [rng.int(1, 9), rng.int(1, 6), rng.int(1, 9), rng.int(1, 6)];
        const n1 = a * a + d * b * b;
        const n2 = c * c + d * e * e;
        return ask(
          [
            `What is the norm of $(${a} + ${b === 1 ? "" : b}\\sqrt{-${d}})(${c} + ${e === 1 ? "" : e}\\sqrt{-${d}})$?`,
            `$(${a} + ${b === 1 ? "" : b}\\sqrt{-${d}})(${c} + ${e === 1 ? "" : e}\\sqrt{-${d}})$ 的范数是多少？`,
          ],
          n1 * n2,
          [n1 + n2, n1, n1 * n2 + d],
          [`The norms of the factors are ${n1} and ${n2}, and norms multiply.`, `两个因子的范数是 ${n1} 和 ${n2}，范数相乘。`],
        );
      },
    ),
    point(
      "units-from-the-norm",
      ["Units from the norm", "由范数得单位"],
      [
        "An element is a unit exactly when its norm is 1. In $\\mathbb{Z}[\\sqrt{-d}]$ with $d \\ge 2$, this forces $b = 0$ and $a = \\pm 1$, while $\\mathbb{Z}[i]$ has four units and real quadratic rings have infinitely many.",
        "元素是单位当且仅当它的范数是 1。在 $d \\ge 2$ 的 $\\mathbb{Z}[\\sqrt{-d}]$ 中，这迫使 $b = 0$，$a = \\pm 1$，而 $\\mathbb{Z}[i]$ 有四个单位，实二次环有无穷多个单位。",
      ],
      (rng) => {
        const d = rng.int(2, 60);
        return ask(
          [`How many units does the ring $\\mathbb{Z}[\\sqrt{-${d}}]$ have?`, `环 $\\mathbb{Z}[\\sqrt{-${d}}]$ 有多少个单位？`],
          2,
          [4, 1, 8],
          [
            `In $a^{2} + ${d}b^{2} = 1$, $b$ must be 0, which leaves $a = \\pm 1$.`,
            `在 $a^{2} + ${d}b^{2} = 1$ 中 $b$ 必须是 0，剩下 $a = \\pm 1$。`,
          ],
        );
      },
    ),
    point(
      "a-failure-of-unique-factorization",
      ["A failure of unique factorization", "唯一分解的失败"],
      [
        "In $\\mathbb{Z}[\\sqrt{-5}]$, the number 6 equals $2 \\cdot 3$ and also $(1 + \\sqrt{-5})(1 - \\sqrt{-5})$. Norms show that all four factors are irreducible, so factorization into irreducibles is not unique there.",
        "在 $\\mathbb{Z}[\\sqrt{-5}]$ 中，6 等于 $2 \\cdot 3$，也等于 $(1 + \\sqrt{-5})(1 - \\sqrt{-5})$。范数说明四个因子都不可约，所以那里分解成不可约元不是唯一的。",
      ],
      (rng) => {
        const a = rng.int(1, 25);
        const b = rng.int(1, 12);
        const n = a * a + 5 * b * b;
        const bs = b === 1 ? "" : `${b}`;
        return ask(
          [
            `In $\\mathbb{Z}[\\sqrt{-5}]$, what whole number equals $(${a} + ${bs}\\sqrt{-5})(${a} - ${bs}\\sqrt{-5})$?`,
            `在 $\\mathbb{Z}[\\sqrt{-5}]$ 中，$(${a} + ${bs}\\sqrt{-5})(${a} - ${bs}\\sqrt{-5})$ 等于哪个整数？`,
          ],
          n,
          [a * a - 5 * b * b === n ? n + 1 : a * a - 5 * b * b, a * a + b * b, n + 5],
          [
            `The product is $${a}^{2} + 5 \\cdot ${b}^{2}$, because $(\\sqrt{-5})^{2} = -5$.`,
            `乘积是 $${a}^{2} + 5 \\cdot ${b}^{2}$，因为 $(\\sqrt{-5})^{2} = -5$。`,
          ],
        );
      },
    ),
  ],
);

/** numberTheoryExtraTopics holds the topics that complete the Number Theory course. */
export const numberTheoryExtraTopics: readonly TopicDef[] = [
  fundamentalTheorem,
  baseExpansions,
  fermatFactor,
  pollard,
  diffieHellman,
  quadraticComposite,
  generalCrt,
  millerRabin,
  mobiusInversion,
  averageOrder,
  primeSize,
  primitiveExist,
  indices,
  legendreFormula,
  lucas,
  descent,
  sumOfSquaresFunction,
  gaussLemma,
  quadraticForms,
  periodicCf,
  dirichletSeries,
  quadraticIntegers,
];
