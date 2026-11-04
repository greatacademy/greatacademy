// Number Theory: arithmetic functions, powers modulo n, primitive roots, quadratic
// residues and Diophantine equations, building on the divisibility and congruence
// topics of Methods of Proof and Discrete Mathematics.

import type { TopicDef } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";

import {
  ask,
  bounds,
  choose,
  divisors,
  factorizationLatex,
  factorize,
  isPrime,
  orderMod,
  type Pair,
  pickComposite,
  point,
  powMod,
  primesUpTo,
  same,
  topic,
  totient,
} from "../university-kit.ts";

/** sigma adds the positive divisors of n. */
const sigma = (n: number) => divisors(n).reduce((a, b) => a + b, 0);

/** oddPrimes are the odd primes that the questions on residues use. */
const oddPrimes = primesUpTo(199).filter((p) => p > 2);

/** residues lists the nonzero squares modulo a prime. */
const residues = (p: number) => [...new Set(Array.from({ length: p - 1 }, (_, i) => ((i + 1) * (i + 1)) % p))].sort((a, b) => a - b);

/** legendre is the Legendre symbol of a over an odd prime p. */
const legendre = (a: number, p: number) => {
  const value = powMod(a, (p - 1) / 2, p);
  return value === p - 1 ? -1 : value;
};

/** isPrimitiveRoot tells whether g generates the units modulo a prime. */
const isPrimitiveRoot = (g: number, p: number) => g % p !== 0 && orderMod(g, p) === p - 1;

/** mobius is the Möbius function. */
const mobius = (n: number) => {
  const factors = factorize(n);
  return factors.some(([, e]) => e > 1) ? 0 : factors.length % 2 === 0 ? 1 : -1;
};

/** signWord writes a Legendre symbol's value as an option. */
const signWord = (v: number): Pair => same(`${v}`);

const countingDivisors = topic(
  "counting-divisors",
  ["Counting Divisors", "因数的个数"],
  ["Count the divisors of a number from its prime factorization.", "由质因数分解求一个数的因数个数。"],
  ["properties-of-prime-divisibility"],
  [["properties-of-prime-divisibility", 0.3]],
  [
    point(
      "divisors-from-a-factorization",
      ["Divisors from a factorization", "由分解式求因数个数"],
      [
        "A divisor of a number takes each prime of the factorization to some power from zero up to the exponent there. Those choices are independent, so the count multiplies: an exponent e contributes e + 1 choices. Adding the exponents instead counts only prime factors, and it misses every divisor that mixes the primes.",
        "一个数的因数，对分解式中的每个质数取从零到该指数之间的某个幂。这些选择相互独立，所以个数相乘：指数 e 贡献 e + 1 种选择。如果把指数相加，只数到了质因数，漏掉了所有混合不同质数的因数。",
      ],
      (rng) => {
        const primes = rng.shuffle([2, 3, 5, 7, 11]).slice(0, rng.int(2, 3));
        const factors = primes.sort((p, q) => p - q).map((p): [number, number] => [p, rng.int(1, 5)]);
        const answer = factors.reduce((v, [, e]) => v * (e + 1), 1);
        const sum = factors.reduce((v, [, e]) => v + e, 0);
        const shown = factorizationLatex(factors);
        return ask(
          [`How many positive divisors does $${shown}$ have?`, `$${shown}$ 有多少个正因数？`],
          answer,
          [sum, sum + 1, factors.reduce((v, [, e]) => v * e, 1), answer - 1],
          [
            `Each exponent e gives e + 1 choices, so the count is $${factors.map(([, e]) => e + 1).join(" \\times ")} = ${answer}$.`,
            `每个指数 e 给出 e + 1 种选择，所以个数是 $${factors.map(([, e]) => e + 1).join(" \\times ")} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "divisors-of-a-number",
      ["Divisors of a given number", "求给定数的因数个数"],
      [
        "To count the divisors of a number that is not yet factored, factor it first and then apply the product of the exponents plus one. Listing the divisors in pairs works for small numbers and checks the answer, since each divisor below the square root pairs with one above it. A perfect square is the only case with an odd count.",
        "要数还没有分解的数的因数，先分解，再用各指数加一的积。对较小的数，成对列出因数也可行，并能检验答案，因为每个小于平方根的因数都对应一个大于平方根的因数。只有完全平方数的因数个数是奇数。",
      ],
      (rng) => {
        const n = pickComposite(rng, 12, 720);
        const factors = factorize(n);
        const answer = divisors(n).length;
        return ask(
          [`How many positive divisors does $${n}$ have?`, `$${n}$ 有多少个正因数？`],
          answer,
          [factors.reduce((v, [, e]) => v + e, 0), answer + 2, Math.max(answer - 2, 1), factors.length],
          [
            `$${n} = ${factorizationLatex(factors)}$, so the count is $${factors.map(([, e]) => e + 1).join(" \\times ")} = ${answer}$.`,
            `$${n} = ${factorizationLatex(factors)}$，所以个数是 $${factors.map(([, e]) => e + 1).join(" \\times ")} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const sumOfDivisors = topic(
  "the-sum-of-divisors-function",
  ["The Sum of Divisors Function", "因数和函数"],
  ["Add the divisors of a number, directly or through its factorization.", "直接或通过分解式求一个数的因数和。"],
  ["counting-divisors"],
  [["counting-divisors", 0.5]],
  [
    point(
      "sigma-of-a-number",
      ["The sum of the divisors", "求因数和"],
      [
        "The function sigma adds all positive divisors of a number, including one and the number itself. It is multiplicative, so for coprime parts the sums multiply. This makes a factorization the fast way: find the sum for each prime power separately, then multiply. Forgetting the number itself is the usual slip when listing divisors by hand.",
        "函数 $\\sigma$ 把一个数的所有正因数相加，包括 1 和这个数本身。它是积性函数，所以互质部分的和可以相乘。因此用分解式最快：分别求每个质数幂的和，再相乘。手工列举时最常见的差错是漏掉这个数本身。",
      ],
      (rng) => {
        const n = rng.int(6, 200);
        const answer = sigma(n);
        return ask(
          [`What is $\\sigma(${n})$, the sum of the positive divisors of $${n}$?`, `$\\sigma(${n})$，即 $${n}$ 的正因数之和，是多少？`],
          answer,
          [answer - n, answer - 1, divisors(n).length, answer + n],
          [
            `The divisors are ${divisors(n).join(", ")}, and they add to ${answer}.`,
            `因数是 ${divisors(n).join("、")}，它们的和是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "sigma-of-a-prime-power",
      ["The sum for a prime power", "质数幂的因数和"],
      [
        "The divisors of a prime power are the powers of that prime from the zeroth up to the given exponent. They form a geometric series, so the sum is the next power minus one, divided by the prime minus one. Using this saves listing the terms, and it is the building block for the sum of the divisors of any number.",
        "质数幂的因数是这个质数从零次到给定指数的各次幂。它们构成几何级数，所以和等于下一次幂减一，再除以质数减一。这样不必列出各项，它也是求任何数因数和的基本部件。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7, 11, 13, 17, 19]);
        const k = rng.int(2, p === 2 ? 9 : p === 3 ? 6 : 4);
        const answer = (p ** (k + 1) - 1) / (p - 1);
        return ask(
          [`What is $\\sigma(${p}^{${k}})$?`, `$\\sigma(${p}^{${k}})$ 是多少？`],
          answer,
          [p ** (k + 1) - 1, p ** k, answer - p ** k, k + 1],
          [
            `The divisors are the powers of ${p} up to $${p}^{${k}}$, and their sum is $\\frac{${p}^{${k + 1}} - 1}{${p} - 1} = ${answer}$.`,
            `因数是 ${p} 从零次到 $${p}^{${k}}$ 的各次幂，它们的和是 $\\frac{${p}^{${k + 1}} - 1}{${p} - 1} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const perfectNumbers = topic(
  "perfect-numbers",
  ["Perfect, Abundant and Deficient Numbers", "完全数、过剩数和亏数"],
  ["Compare a number with the sum of its proper divisors.", "比较一个数和它的真因数之和。"],
  ["the-sum-of-divisors-function"],
  [["the-sum-of-divisors-function", 0.6]],
  [
    point(
      "the-aliquot-sum",
      ["The sum of proper divisors", "真因数之和"],
      [
        "The proper divisors of a number are all its positive divisors except the number itself. Their sum is sigma of the number minus the number. Comparing this sum with the number is what sorts numbers into kinds. Note that one counts as a proper divisor of every number greater than one, which is easily left out when adding them.",
        "一个数的真因数是除它本身以外的所有正因数。它们的和等于这个数的 $\\sigma$ 值减去这个数。把这个和与这个数比较，就能给数分类。注意 1 是每个大于 1 的数的真因数，相加时很容易漏掉。",
      ],
      (rng) => {
        const n = rng.int(10, 300);
        const answer = sigma(n) - n;
        return ask(
          [`What is the sum of the proper divisors of $${n}$?`, `$${n}$ 的真因数之和是多少？`],
          answer,
          [sigma(n), answer - 1, n, divisors(n).length - 1],
          [
            `$\\sigma(${n}) = ${sigma(n)}$, and taking away ${n} itself leaves ${answer}.`,
            `$\\sigma(${n}) = ${sigma(n)}$，减去 ${n} 本身剩下 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "classifying-a-number-by-its-divisors",
      ["Classifying by the proper divisors", "按真因数分类"],
      [
        "A number is perfect when its proper divisors add up to exactly the number, abundant when they add up to more, and deficient when they add up to less. Six and 28 are the first perfect numbers, and these are rare. Every prime is deficient, since its only proper divisor is one, and every multiple of a perfect number beyond it is abundant.",
        "真因数之和恰好等于这个数时，它是完全数；大于时是过剩数；小于时是亏数。6 和 28 是最小的完全数，这种数很稀少。每个质数都是亏数，因为它唯一的真因数是 1；完全数本身以外的倍数都是过剩数。",
      ],
      (rng) => {
        const n = rng.bool(0.12) ? rng.pick([6, 28, 496]) : rng.int(10, 400);
        const sum = sigma(n) - n;
        const words: Record<string, Pair> = {
          perfect: ["Perfect", "完全数"],
          abundant: ["Abundant", "过剩数"],
          deficient: ["Deficient", "亏数"],
        };
        const kind = sum === n ? "perfect" : sum > n ? "abundant" : "deficient";
        return choose(
          rng,
          [`What kind of number is $${n}$?`, `$${n}$ 是哪一类数？`],
          words[kind] as Pair,
          Object.entries(words)
            .filter(([k]) => k !== kind)
            .map(([, w]) => w),
          [
            `Its proper divisors add up to ${sum}, which is ${sum === n ? "equal to" : sum > n ? "more than" : "less than"} ${n}.`,
            `它的真因数之和是 ${sum}，${sum === n ? "等于" : sum > n ? "大于" : "小于"} ${n}。`,
          ],
        );
      },
    ),
  ],
);

const sieve = topic(
  "the-sieve-of-eratosthenes",
  ["The Sieve of Eratosthenes", "埃拉托色尼筛法"],
  ["Find primes by crossing out multiples, and know when to stop.", "用划掉倍数的方法找质数，并知道何时可以停止。"],
  ["prime-and-composite-numbers"],
  [["prime-and-composite-numbers", 0.5]],
  [
    point(
      "where-the-sieve-can-stop",
      ["Where the sieve can stop", "筛法可以停在哪里"],
      [
        "A composite number up to N has a prime factor no larger than the square root of N, because two factors both above the root would multiply to more than N. So the sieve can stop once it has crossed out the multiples of every prime up to the root. Everything left is prime, without testing any further.",
        "不超过 N 的合数，一定有一个不大于 N 的平方根的质因数，因为两个都大于平方根的因数相乘会超过 N。所以筛法把不超过平方根的每个质数的倍数划掉后就可以停止。剩下的都是质数，不用再检验。",
      ],
      (rng) => {
        const n = rng.int(30, 2000);
        const root = Math.floor(Math.sqrt(n));
        const answer = primesUpTo(root).at(-1) as number;
        const after = primesUpTo(root + 40).find((p) => p > root) as number;
        return ask(
          [
            `To find all primes up to $${n}$ with the sieve, what is the largest prime whose multiples must be crossed out?`,
            `用筛法求出不超过 $${n}$ 的所有质数时，必须划掉其倍数的最大质数是多少？`,
          ],
          answer,
          [root === answer ? root + 1 : root, after, Math.floor(n / 2), primesUpTo(n).at(-1) as number],
          [
            `Since $\\sqrt{${n}}$ is between ${root} and ${root + 1}, only primes up to ${root} matter, and the largest of these is ${answer}.`,
            `因为 $\\sqrt{${n}}$ 在 ${root} 和 ${root + 1} 之间，所以只需考虑不超过 ${root} 的质数，其中最大的是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "testing-primes-up-to-the-root",
      ["Finding the prime among four", "四个数中找质数"],
      [
        "To test a number for primality, try dividing by each prime up to its square root. Numbers such as 91, 119 and 133 look prime because no small rule catches them, yet they have factors of seven. Once the primes up to the root are exhausted without a divisor, the number is prime, and no larger candidate needs checking.",
        "检验一个数是否为质数，要用不超过它平方根的每个质数去除。91、119、133 这样的数看起来像质数，因为简单的规则查不出来，但它们都有因数 7。不超过平方根的质数都除不尽时，这个数就是质数，不需要再试更大的数。",
      ],
      (rng) => {
        const prime = rng.pick(primesUpTo(400).filter((p) => p > 50));
        const hard = Array.from({ length: 400 }, (_, i) => i + 50).filter((n) => !isPrime(n) && n % 2 !== 0 && n % 3 !== 0 && n % 5 !== 0);
        const others = rng.shuffle(hard).slice(0, 3);
        const [lo, hi] = bounds([prime, ...others]);
        return choose(
          rng,
          [`Which of these numbers between $${lo}$ and $${hi}$ is prime?`, `下列在 $${lo}$ 和 $${hi}$ 之间的数中，哪个是质数？`],
          same(`${prime}`),
          others.map((n) => same(`${n}`)),
          [
            `${others.map((n) => `$${n} = ${factorizationLatex(factorize(n))}$`).join(", ")}. No prime up to $\\sqrt{${prime}}$ divides ${prime}.`,
            `${others.map((n) => `$${n} = ${factorizationLatex(factorize(n))}$`).join("，")}。不超过 $\\sqrt{${prime}}$ 的质数都不能整除 ${prime}。`,
          ],
        );
      },
    ),
  ],
);

const countingPrimes = topic(
  "the-distribution-of-primes",
  ["The Distribution of Primes", "质数的分布"],
  ["Count primes exactly for small bounds, and estimate them for large ones.", "在范围较小时准确数质数，在范围较大时作估计。"],
  ["the-sieve-of-eratosthenes"],
  [["the-sieve-of-eratosthenes", 0.3]],
  [
    point(
      "the-prime-counting-function",
      ["The prime counting function", "质数计数函数"],
      [
        "The function pi of x counts the primes up to x, and it has nothing to do with the circle constant. The value does not change between one prime and the next, so it is a staircase that rises by one at each prime. Note that two counts as prime, and that one does not, which is the commonest source of an off-by-one error.",
        "函数 π(x) 数不超过 x 的质数个数，它和圆周率没有关系。在相邻两个质数之间，它的值不变，所以它是一段段台阶，每遇到一个质数就升高 1。注意 2 是质数，1 不是，这是差一错误最常见的来源。",
      ],
      (rng) => {
        const x = rng.int(12, 120);
        const list = primesUpTo(x);
        const answer = list.length;
        return ask(
          [`What is $\\pi(${x})$, the number of primes up to $${x}$?`, `$\\pi(${x})$，即不超过 $${x}$ 的质数个数，是多少？`],
          answer,
          [answer + 1, answer - 1, list.at(-1) as number, Math.round(x / 2)],
          [
            `The primes up to ${x} are ${list.join(", ")}, and there are ${answer} of them.`,
            `不超过 ${x} 的质数是 ${list.join("、")}，一共 ${answer} 个。`,
          ],
        );
      },
    ),
    point(
      "estimating-with-the-prime-number-theorem",
      ["Estimating with the prime number theorem", "用素数定理估计"],
      [
        "The prime number theorem says that the number of primes up to x is close to x divided by the natural logarithm of x, in the sense that the ratio tends to one. The estimate runs a little low, but it shows how primes thin out: near x, about one number in every ln x is prime, though the gaps vary a great deal.",
        "素数定理说，不超过 x 的质数个数接近 x 除以 x 的自然对数，意思是两者之比趋向于 1。这个估计略微偏低，但它显示了质数怎样变稀：在 x 附近，大约每 ln x 个数中有一个质数，不过间隔变化很大。",
      ],
      (rng) => {
        const x = 1000 * rng.int(1, 40);
        const answer = Math.round(x / Math.log(x));
        return ask(
          [
            `Using $\\frac{x}{\\ln x}$, estimate the number of primes up to $${x}$, to the nearest whole number.`,
            `用 $\\frac{x}{\\ln x}$ 估计不超过 $${x}$ 的质数个数，结果取最接近的整数。`,
          ],
          answer,
          [Math.round(x / Math.log10(x)), Math.round(Math.log(x)), Math.round(x / 2), Math.round(x / Math.log2(x))],
          [
            `$\\ln ${x} \\approx ${Math.log(x).toFixed(3)}$, and dividing ${x} by this gives about ${answer}.`,
            `$\\ln ${x} \\approx ${Math.log(x).toFixed(3)}$，用 ${x} 除以它，约等于 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const powersModulo = topic(
  "powers-modulo-n",
  ["Powers Modulo n", "模 n 的幂"],
  ["Compute large powers modulo n by repeated squaring.", "用反复平方计算模 n 的大幂。"],
  ["the-multiplication-properties-of-modular-arithmetic"],
  [["the-multiplication-properties-of-modular-arithmetic", 0.5]],
  [
    point(
      "repeated-squaring",
      ["Repeated squaring", "反复平方"],
      [
        "A large power need not be computed in full before reducing. Square the base repeatedly, reducing after each step, and then multiply together the squares that match the binary digits of the exponent. Each reduction keeps the numbers small, so even an exponent in the thousands takes only a dozen multiplications, and the intermediate products stay manageable.",
        "大的幂不必先完整算出再取余。反复把底数平方，每一步都取余，再把与指数二进制各位对应的平方乘起来。每次取余都让数保持很小，所以即使指数有几千，也只需要十来次乘法，中间的积也都容易处理。",
      ],
      (rng) => {
        const n = rng.int(7, 40);
        const a = rng.int(2, n - 1);
        const k = rng.int(9, 64);
        const answer = powMod(a, k, n);
        return ask(
          [`What is the remainder of $${a}^{${k}}$ when divided by $${n}$?`, `$${a}^{${k}}$ 除以 $${n}$ 的余数是多少？`],
          answer,
          [(a * k) % n, powMod(a, k + 1, n), powMod(a, k - 1, n), (answer + 1) % n],
          [
            `Reducing after each squaring, the powers $${a}^{2^i}$ modulo ${n} are ${[0, 1, 2, 3].map((i) => powMod(a, 2 ** i, n)).join(", ")}, and so on. Multiplying those for the binary digits of ${k} gives ${answer}.`,
            `每次平方后取余，$${a}^{2^i}$ 模 ${n} 依次是 ${[0, 1, 2, 3].map((i) => powMod(a, 2 ** i, n)).join("、")} 等。把 ${k} 的二进制各位对应的值相乘，得 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "the-last-digit-of-a-power",
      ["The last digit of a power", "幂的个位数字"],
      [
        "The last digit of a number is its remainder modulo ten, and the last digits of powers repeat in a short cycle. Powers of 3, for instance, end in 3, 9, 7, 1 and then start over. So only the exponent's position in the cycle matters, which means that a huge exponent is no harder to handle than a small one.",
        "一个数的个位数字就是它模 10 的余数，幂的个位数字按短周期重复。例如 3 的幂依次以 3、9、7、1 结尾，然后重新开始。所以只有指数在周期中的位置才重要，这意味着很大的指数并不比小指数更难处理。",
      ],
      (rng) => {
        const a = rng.pick([2, 3, 4, 7, 8, 9, 12, 13, 17, 18, 23, 27]);
        const k = rng.int(20, 2024);
        const answer = powMod(a, k, 10);
        const cycle = [1, 2, 3, 4].map((i) => powMod(a, i, 10));
        return ask(
          [`What is the last digit of $${a}^{${k}}$?`, `$${a}^{${k}}$ 的个位数字是多少？`],
          answer,
          [a % 10, k % 10, (answer + 2) % 10, powMod(a, k + 1, 10)],
          [
            `The last digits of the powers of ${a} run ${cycle.join(", ")} and then repeat, and position ${k} in this cycle gives ${answer}.`,
            `${a} 的幂的个位数字依次是 ${cycle.join("、")}，然后重复，第 ${k} 个位置上是 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const fermatLittle = topic(
  "using-fermats-little-theorem",
  ["Using Fermat's Little Theorem", "运用费马小定理"],
  ["Reduce exponents modulo p − 1, and find inverses from a power.", "把指数模 p − 1 约简，并用幂求逆元。"],
  ["fermats-little-theorem", "powers-modulo-n"],
  [
    ["fermats-little-theorem", 0.5],
    ["powers-modulo-n", 0.6],
  ],
  [
    point(
      "reducing-the-exponent",
      ["Reducing the exponent", "约简指数"],
      [
        "For a prime p and a number a not divisible by it, a to the power p − 1 leaves remainder one. So exponents may be reduced modulo p − 1, not modulo p. This turns an enormous exponent into one smaller than p. The theorem needs p to be prime and a to be coprime to it, and both conditions should be checked first.",
        "对质数 p 和不被它整除的数 a，a 的 p − 1 次幂除以 p 余 1。所以指数可以模 p − 1 约简，而不是模 p。这能把极大的指数变成比 p 小的指数。这个定理要求 p 是质数且 a 与它互质，这两个条件要先检查。",
      ],
      (rng) => {
        const p = rng.pick([5, 7, 11, 13, 17, 19, 23, 29, 31]);
        const a = rng.int(2, p - 1);
        const k = rng.int(100, 9999);
        const reduced = k % (p - 1);
        const answer = powMod(a, k, p);
        return ask(
          [`What is the remainder of $${a}^{${k}}$ when divided by $${p}$?`, `$${a}^{${k}}$ 除以 $${p}$ 的余数是多少？`],
          answer,
          [powMod(a, k % p, p), reduced, powMod(a, reduced + 1, p), (answer + 1) % p],
          [
            `Since $${a}^{${p - 1}} \\equiv 1$, the exponent can be taken modulo ${p - 1}: ${k} leaves ${reduced}. And $${a}^{${reduced}} \\equiv ${answer} \\pmod{${p}}$.`,
            `因为 $${a}^{${p - 1}} \\equiv 1$，指数可以模 ${p - 1}：${k} 余 ${reduced}。而 $${a}^{${reduced}} \\equiv ${answer} \\pmod{${p}}$。`,
          ],
        );
      },
    ),
    point(
      "an-inverse-from-a-power",
      ["An inverse from a power", "用幂求逆元"],
      [
        "Fermat's little theorem also supplies inverses. Since a multiplied by a to the power p − 2 equals a to the power p − 1, which is one, the inverse of a modulo p is a to the power p − 2. This gives a route that uses only repeated squaring, as an alternative to running the extended Euclidean algorithm.",
        "费马小定理也能给出逆元。因为 a 乘 a 的 p − 2 次幂等于 a 的 p − 1 次幂，也就是 1，所以 a 模 p 的逆元是 a 的 p − 2 次幂。这是一条只用反复平方的途径，可以替代扩展欧几里得算法。",
      ],
      (rng) => {
        const p = rng.pick([7, 11, 13, 17, 19, 23, 29]);
        const a = rng.int(2, p - 1);
        const answer = powMod(a, p - 2, p);
        return ask(
          [
            `Use Fermat's little theorem to find the inverse of $${a}$ modulo $${p}$, as a number from 1 to ${p - 1}.`,
            `用费马小定理求 $${a}$ 模 $${p}$ 的逆元，结果取 1 到 ${p - 1} 之间的数。`,
          ],
          answer,
          [powMod(a, p - 1, p), p - a, powMod(a, p - 3, p), (answer % (p - 1)) + 1],
          [
            `The inverse is $${a}^{${p - 2}} \\equiv ${answer}$, and indeed $${a} \\times ${answer} = ${a * answer} \\equiv 1 \\pmod{${p}}$.`,
            `逆元是 $${a}^{${p - 2}} \\equiv ${answer}$，确实 $${a} \\times ${answer} = ${a * answer} \\equiv 1 \\pmod{${p}}$。`,
          ],
        );
      },
    ),
  ],
);

const totientFunction = topic(
  "computing-and-counting-with-the-totient",
  ["Computing and Counting With the Totient", "用欧拉函数计算和计数"],
  ["Find the totient of any number from its factorization, and use it to count fractions.", "由分解式求任何数的欧拉函数值，并用它数分数。"],
  ["eulers-totient-function", "counting-divisors"],
  [["eulers-totient-function", 0.5]],
  [
    point(
      "totient-of-a-number",
      ["The totient of a number", "求欧拉函数值"],
      [
        "Euler's function phi of n counts the numbers from one to n that share no factor with n. From the factorization, each prime contributes a fraction of one minus its reciprocal, so phi of n is n times the product of those fractions. Removing the multiples of each prime separately works only because the primes are distinct, which the product takes into account.",
        "欧拉函数 φ(n) 数 1 到 n 中与 n 没有公因数的数。由分解式，每个质数贡献 1 减其倒数这个比例，所以 φ(n) 是 n 乘这些比例之积。分别去掉每个质数的倍数之所以可行，是因为这些质数互不相同，而乘积已把这一点考虑在内。",
      ],
      (rng) => {
        const n = pickComposite(rng, 10, 300);
        const answer = totient(n);
        const factors = factorize(n);
        return ask(
          [`What is $\\varphi(${n})$?`, `$\\varphi(${n})$ 是多少？`],
          answer,
          [n - factors.length, n - 1, Math.floor(n / 2), answer + 2],
          [
            `$${n} = ${factorizationLatex(factors)}$, so $\\varphi(${n}) = ${factors.map(([p, e]) => (e === 1 ? `${p - 1}` : `${p}^{${e - 1}} \\cdot ${p - 1}`)).join(" \\cdot ")} = ${answer}$.`,
            `$${n} = ${factorizationLatex(factors)}$，所以 $\\varphi(${n}) = ${factors.map(([p, e]) => (e === 1 ? `${p - 1}` : `${p}^{${e - 1}} \\cdot ${p - 1}`)).join(" \\cdot ")} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "fractions-in-lowest-terms",
      ["Fractions in lowest terms", "最简分数的个数"],
      [
        "The totient counts something visible: the fractions between zero and one with a given denominator that are already in lowest terms. A fraction k over n reduces exactly when k and n share a factor, so the fractions that do not reduce are counted by phi of n. This gives a useful check for small denominators, by listing them.",
        "欧拉函数数的东西看得见：分母给定、在 0 和 1 之间、已是最简形式的分数。分数 k/n 能约分，当且仅当 k 和 n 有公因数，所以不能约分的分数个数就是 φ(n)。对较小的分母，可以列出来作为检验。",
      ],
      (rng) => {
        const n = rng.int(6, 120);
        const answer = totient(n);
        return ask(
          [
            `How many fractions $\\frac{k}{${n}}$ with $1 \\le k \\le ${n}$ are in lowest terms?`,
            `满足 $1 \\le k \\le ${n}$ 的分数 $\\frac{k}{${n}}$ 中，有多少个是最简分数？`,
          ],
          answer,
          [n - 1, n - divisors(n).length, answer + 1, divisors(n).length],
          [
            `A fraction is in lowest terms when $k$ is coprime to ${n}, and $\\varphi(${n}) = ${answer}$ values of $k$ are.`,
            `当 $k$ 与 ${n} 互质时分数是最简的，这样的 $k$ 有 $\\varphi(${n}) = ${answer}$ 个。`,
          ],
        );
      },
    ),
  ],
);

/** coprimeBase picks a base coprime to n. */
const coprimeBases = (n: number) => Array.from({ length: n - 2 }, (_, i) => i + 2).filter((a) => gcd(a, n) === 1);

const eulerTheorem = topic(
  "reducing-exponents-with-eulers-theorem",
  ["Reducing Exponents With Euler's Theorem", "用欧拉定理约简指数"],
  ["Reduce exponents modulo φ(n) when the modulus is not prime.", "模数不是质数时，把指数模 φ(n) 约简。"],
  ["eulers-theorem", "using-fermats-little-theorem", "computing-and-counting-with-the-totient"],
  [
    ["eulers-theorem", 0.6],
    ["using-fermats-little-theorem", 0.5],
    ["computing-and-counting-with-the-totient", 0.4],
  ],
  [
    point(
      "reducing-modulo-the-totient",
      ["Reducing modulo the totient", "模欧拉函数约简"],
      [
        "Euler's theorem extends Fermat's: for a base coprime to n, the base to the power phi of n leaves remainder one. So exponents reduce modulo phi of n. The condition that base and modulus are coprime matters, and without it the statement can fail. When n is prime, phi of n is n − 1, and this is just Fermat's little theorem again.",
        "欧拉定理推广了费马小定理：底数与 n 互质时，底数的 φ(n) 次幂余 1。所以指数可以模 φ(n) 约简。底数和模数互质这个条件很重要，缺少它，结论可能不成立。当 n 是质数时，φ(n) 就是 n − 1，这正是费马小定理。",
      ],
      (rng) => {
        const n = rng.pick([8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 26, 27, 28, 30]);
        const a = rng.pick(coprimeBases(n));
        const k = rng.int(100, 9999);
        const phi = totient(n);
        const answer = powMod(a, k, n);
        return ask(
          [`What is the remainder of $${a}^{${k}}$ when divided by $${n}$?`, `$${a}^{${k}}$ 除以 $${n}$ 的余数是多少？`],
          answer,
          [powMod(a, k % n, n), k % phi, powMod(a, (k % phi) + 1, n), (answer + 2) % n],
          [
            `$\\varphi(${n}) = ${phi}$ and ${k} leaves ${k % phi} modulo ${phi}, so the power reduces to $${a}^{${k % phi}} \\equiv ${answer} \\pmod{${n}}$.`,
            `$\\varphi(${n}) = ${phi}$，${k} 模 ${phi} 余 ${k % phi}，所以这个幂约简为 $${a}^{${k % phi}} \\equiv ${answer} \\pmod{${n}}$。`,
          ],
        );
      },
    ),
    point(
      "the-last-two-digits",
      ["The last two digits", "最后两位数字"],
      [
        "The last two digits of a number are its remainder modulo 100. For a base coprime to 100, Euler's theorem applies with phi of 100 equal to 40, so only the exponent modulo 40 matters. This means that a base ending in 1, 3, 7 or 9 can have its last two digits found with just a few multiplications, however large the power.",
        "一个数的最后两位数字就是它模 100 的余数。底数与 100 互质时，可以用欧拉定理，φ(100) = 40，所以只有指数模 40 才重要。这意味着，以 1、3、7、9 结尾的底数，不论幂多大，只需几次乘法就能求出最后两位数字。",
      ],
      (rng) => {
        const a = rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37, 39]);
        const k = rng.int(41, 3000);
        const answer = powMod(a, k, 100);
        return ask(
          [`What number do the last two digits of $${a}^{${k}}$ form?`, `$${a}^{${k}}$ 的最后两位数字组成的数是多少？`],
          answer,
          [powMod(a, k % 100, 100), powMod(a, k, 10), powMod(a, (k % 40) + 1, 100), k % 100],
          [
            `$\\varphi(100) = 40$, so the exponent reduces to ${k % 40}, and $${a}^{${k % 40}} \\equiv ${answer} \\pmod{100}$.`,
            `$\\varphi(100) = 40$，所以指数约简为 ${k % 40}，而 $${a}^{${k % 40}} \\equiv ${answer} \\pmod{100}$。`,
          ],
        );
      },
    ),
  ],
);

/** factorialMod computes m! modulo n. */
const factorialMod = (m: number, n: number) => {
  let value = 1 % n;
  for (let i = 2; i <= m; i++) value = (value * i) % n;
  return value;
};

const wilson = topic(
  "wilsons-theorem",
  ["Wilson's Theorem", "威尔逊定理"],
  ["Use the value of (p − 1)! modulo p, and what it says about composites.", "利用 (p − 1)! 模 p 的值，以及它对合数的意义。"],
  ["multiplicative-inverses-modulo-n"],
  [["multiplicative-inverses-modulo-n", 0.3]],
  [
    point(
      "factorials-just-below-a-prime",
      ["Factorials just below a prime", "略小于质数的阶乘"],
      [
        "Wilson's theorem says that (p − 1)! leaves remainder p − 1 modulo a prime p, because each factor pairs with its inverse, leaving only one and p − 1. Dividing by p − 1 and by p − 2 in turn gives the neighbours: (p − 2)! leaves one, since p − 1 is congruent to minus one. So these large factorials need no multiplication at all.",
        "威尔逊定理说，(p − 1)! 模质数 p 余 p − 1，因为每个因数都和它的逆配对，只剩下 1 和 p − 1。依次除以 p − 1 和 p − 2，就得到相邻的情况：(p − 2)! 余 1，因为 p − 1 同余于 −1。所以这些很大的阶乘根本不用做乘法。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(100).filter((q) => q > 5));
        const k = rng.int(1, 3);
        const answer = factorialMod(p - k, p);
        return ask(
          [`What is the remainder of $${p - k}!$ when divided by $${p}$?`, `$${p - k}!$ 除以 $${p}$ 的余数是多少？`],
          answer,
          [0, p - 1 === answer ? 1 : p - 1, k, p - k === answer ? p - 2 : p - k],
          [
            k === 1
              ? `By Wilson's theorem, $${p - 1}! \\equiv -1$, which is ${p - 1}.`
              : `By Wilson's theorem, $${p - 1}! \\equiv -1$. Dividing by the factors above ${p - k} leaves ${answer}.`,
            k === 1
              ? `由威尔逊定理，$${p - 1}! \\equiv -1$，也就是 ${p - 1}。`
              : `由威尔逊定理，$${p - 1}! \\equiv -1$。除以大于 ${p - k} 的因数，剩下 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "factorials-and-composites",
      ["Factorials and composites", "阶乘与合数"],
      [
        "Wilson's theorem has a converse: (n − 1)! leaves remainder n − 1 modulo n only when n is prime. For a composite n above four, the factors below n already include enough to make a multiple of n, so the remainder is zero. The value four is the only exception, where 3! is six, which leaves remainder two.",
        "威尔逊定理有逆命题：只有当 n 是质数时，(n − 1)! 模 n 才余 n − 1。对大于 4 的合数 n，小于 n 的因数已经足以构成 n 的倍数，所以余数是 0。4 是唯一的例外，此时 3! 等于 6，余 2。",
      ],
      (rng) => {
        const n = rng.int(4, 60);
        const answer = factorialMod(n - 1, n);
        return ask(
          [`What is the remainder of $${n - 1}!$ when divided by $${n}$?`, `$${n - 1}!$ 除以 $${n}$ 的余数是多少？`],
          answer,
          [answer === 0 ? n - 1 : 0, 1, 2, answer === 0 ? Math.floor(n / 2) : n - 2],
          [
            isPrime(n)
              ? `${n} is prime, so Wilson's theorem gives $${n - 1}! \\equiv -1$, which is ${n - 1}.`
              : n === 4
                ? "$3! = 6$, and 6 leaves 2 when divided by 4. This is the one exception among composites."
                : `${n} is composite and above 4, so its factors appear among the numbers below it, and the remainder is 0.`,
            isPrime(n)
              ? `${n} 是质数，由威尔逊定理 $${n - 1}! \\equiv -1$，也就是 ${n - 1}。`
              : n === 4
                ? "$3! = 6$，6 除以 4 余 2。这是合数中唯一的例外。"
                : `${n} 是大于 4 的合数，它的因数都出现在比它小的数中，所以余数是 0。`,
          ],
        );
      },
    ),
  ],
);

const orders = topic(
  "the-order-of-an-integer-modulo-n",
  ["The Order of an Integer Modulo n", "整数模 n 的阶"],
  ["Find the least power that gives one, and what orders are possible.", "求得到 1 的最小幂，并判断哪些阶是可能的。"],
  ["reducing-exponents-with-eulers-theorem"],
  [["reducing-exponents-with-eulers-theorem", 0.4]],
  [
    point(
      "finding-an-order",
      ["Finding an order", "求阶"],
      [
        "The order of a modulo n is the smallest positive power of a that leaves remainder one. It exists exactly when a is coprime to n, and it divides phi of n, by Euler's theorem. So only the divisors of phi of n need checking, which is often quicker than listing the powers one after another until the value one appears.",
        "a 模 n 的阶是使余数为 1 的最小正幂。它存在当且仅当 a 与 n 互质，并且由欧拉定理，它整除 φ(n)。所以只需检查 φ(n) 的因数，这通常比逐个列出幂直到出现 1 要快。",
      ],
      (rng) => {
        const n = rng.pick([7, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 29, 31]);
        const a = rng.pick(coprimeBases(n));
        const answer = orderMod(a, n);
        const phi = totient(n);
        return ask(
          [`What is the order of $${a}$ modulo $${n}$?`, `$${a}$ 模 $${n}$ 的阶是多少？`],
          answer,
          [phi === answer ? phi + 1 : phi, a, n - 1 === answer ? n : n - 1, answer + 1],
          [
            `The powers of ${a} modulo ${n} are ${Array.from({ length: answer }, (_, i) => powMod(a, i + 1, n)).join(", ")}. The value 1 first appears at power ${answer}.`,
            `${a} 模 ${n} 的幂依次是 ${Array.from({ length: answer }, (_, i) => powMod(a, i + 1, n)).join("、")}。1 第一次出现在 ${answer} 次幂。`,
          ],
        );
      },
    ),
    point(
      "which-orders-are-possible",
      ["Which orders are possible", "哪些阶是可能的"],
      [
        "The order of any element modulo a prime p divides p − 1, because the units form a group of that size and the order of an element divides the order of the group. So a number that does not divide p − 1 cannot be an order. The converse also holds modulo a prime: every divisor of p − 1 occurs as an order.",
        "模质数 p 时，任何元素的阶都整除 p − 1，因为单位元构成这个大小的群，而元素的阶整除群的阶。所以不整除 p − 1 的数不可能是阶。模质数时逆命题也成立：p − 1 的每个因数都是某个元素的阶。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(250).filter((q) => q > 10));
        const good = divisors(p - 1).filter((d) => d > 1);
        const bad = Array.from({ length: p - 2 }, (_, i) => i + 2).filter((d) => (p - 1) % d !== 0);
        const answer = rng.pick(bad);
        const others = rng.shuffle(good).slice(0, 3);
        return choose(
          rng,
          [`Which of these cannot be the order of a number modulo the prime $${p}$?`, `下列哪个不可能是某个数模质数 $${p}$ 的阶？`],
          same(`${answer}`),
          others.map((d) => same(`${d}`)),
          [
            `Orders modulo ${p} divide ${p - 1}. The number ${answer} does not divide ${p - 1}, and the others do.`,
            `模 ${p} 的阶整除 ${p - 1}。${answer} 不整除 ${p - 1}，其他几个都整除。`,
          ],
        );
      },
    ),
  ],
);

const primitiveRoots = topic(
  "primitive-roots",
  ["Primitive Roots", "原根"],
  ["Recognize a generator of the units modulo a prime, and count them.", "识别模质数单位群的生成元，并数出它们的个数。"],
  ["the-order-of-an-integer-modulo-n"],
  [["the-order-of-an-integer-modulo-n", 0.6]],
  [
    point(
      "recognizing-a-primitive-root",
      ["Recognizing a primitive root", "识别原根"],
      [
        "A primitive root modulo a prime p is a number of the largest possible order, p − 1, so that its powers run through every nonzero remainder. To test a candidate, it is enough to check that none of its powers with exponent p − 1 divided by a prime factor of p − 1 gives one. This saves computing the entire list of powers.",
        "模质数 p 的原根是阶最大（等于 p − 1）的数，它的幂遍历所有非零余数。检验一个候选数时，只要检查指数为 p − 1 除以 p − 1 的某个质因数的幂都不等于 1 就够了。这样不必算出全部的幂。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(97).filter((q) => q > 5));
        const all = Array.from({ length: p - 2 }, (_, i) => i + 2);
        const roots = all.filter((g) => isPrimitiveRoot(g, p));
        const rest = all.filter((g) => !isPrimitiveRoot(g, p));
        const orders = (values: readonly number[], word: string) => values.map((g) => `${g} ${word} ${orderMod(g, p)}`);
        if (rng.bool() && roots.length >= 3) {
          const answer = rng.pick(rest);
          const shown = rng.shuffle(roots).slice(0, 3);
          return choose(
            rng,
            [`Which of these is not a primitive root modulo $${p}$?`, `下列哪个不是模 $${p}$ 的原根？`],
            same(`${answer}`),
            shown.map((g) => same(`${g}`)),
            [
              `The order of ${answer} is ${orderMod(answer, p)}, which is less than ${p - 1}, and each of the others has order ${p - 1}.`,
              `${answer} 的阶是 ${orderMod(answer, p)}，小于 ${p - 1}，其他几个数的阶都是 ${p - 1}。`,
            ],
          );
        }
        const root = rng.pick(roots);
        const others = rng.shuffle(rest).slice(0, 3);
        return choose(
          rng,
          [`Which of these is a primitive root modulo $${p}$?`, `下列哪个是模 $${p}$ 的原根？`],
          same(`${root}`),
          others.map((g) => same(`${g}`)),
          [
            `The order of ${root} is ${p - 1}. The others have smaller orders: ${orders(others, "has order").join(", ")}.`,
            `${root} 的阶是 ${p - 1}。其他的阶更小：${orders(others, "的阶是").join("，")}。`,
          ],
        );
      },
    ),
    point(
      "counting-primitive-roots",
      ["Counting primitive roots", "数原根的个数"],
      [
        "Modulo a prime p, the units form a cyclic group of size p − 1, and a cyclic group of that size has phi of p − 1 generators. So the number of primitive roots modulo p is phi of p − 1, not phi of p. Modulo 13, for instance, there are phi of 12, which is four, and not all twelve units.",
        "模质数 p 时，单位元构成大小为 p − 1 的循环群，这样的循环群有 φ(p − 1) 个生成元。所以模 p 的原根个数是 φ(p − 1)，而不是 φ(p)。例如模 13 时有 φ(12) = 4 个，而不是全部 12 个单位元。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(200).filter((q) => q > 5));
        const answer = totient(p - 1);
        return ask(
          [`How many primitive roots are there modulo the prime $${p}$?`, `模质数 $${p}$ 的原根有多少个？`],
          answer,
          [p - 1, answer + 1, (p - 1) / 2, totient(p - 1) === divisors(p - 1).length ? answer + 2 : divisors(p - 1).length],
          [
            `The units form a cyclic group of size ${p - 1}, which has $\\varphi(${p - 1}) = ${answer}$ generators.`,
            `单位元构成大小为 ${p - 1} 的循环群，它有 $\\varphi(${p - 1}) = ${answer}$ 个生成元。`,
          ],
        );
      },
    ),
  ],
);

const discreteLogs = topic(
  "discrete-logarithms",
  ["Discrete Logarithms", "离散对数"],
  ["Solve for an exponent modulo a prime, and see how a key exchange uses it.", "求模质数的指数，并了解密钥交换怎样使用它。"],
  ["primitive-roots"],
  [["primitive-roots", 0.4]],
  [
    point(
      "solving-for-the-exponent",
      ["Solving for the exponent", "求指数"],
      [
        "The discrete logarithm of h to base g modulo p is the exponent x with g to the x equal to h. For a primitive root, every nonzero remainder has exactly one such exponent from zero to p − 2. Small cases are solved by listing powers. For large primes no fast method is known, which is exactly why cryptography relies on this problem.",
        "h 以 g 为底模 p 的离散对数，是满足 g 的 x 次幂等于 h 的指数 x。对原根，每个非零余数恰有一个这样的指数，取值从 0 到 p − 2。小的情况可以列出幂来求解。对大的质数，还不知道快速的方法，这正是密码学依赖这个问题的原因。",
      ],
      (rng) => {
        const p = rng.pick([7, 11, 13, 17, 19, 23, 29, 31]);
        const g = rng.pick(Array.from({ length: p - 2 }, (_, i) => i + 2).filter((v) => isPrimitiveRoot(v, p)));
        const x = rng.int(2, p - 2);
        const h = powMod(g, x, p);
        return ask(
          [
            `Find $x$ with $0 \\le x \\le ${p - 2}$ such that $${g}^x \\equiv ${h} \\pmod{${p}}$.`,
            `求满足 $0 \\le x \\le ${p - 2}$ 且 $${g}^x \\equiv ${h} \\pmod{${p}}$ 的 $x$。`,
          ],
          x,
          [h, (x + 1) % (p - 1), p - 1 - x, (x * 2) % (p - 1)],
          [
            `The powers of ${g} are ${Array.from({ length: x }, (_, i) => powMod(g, i + 1, p)).join(", ")}, and ${h} is at power ${x}.`,
            `${g} 的幂依次是 ${Array.from({ length: x }, (_, i) => powMod(g, i + 1, p)).join("、")}，${h} 出现在 ${x} 次幂。`,
          ],
        );
      },
    ),
    point(
      "a-diffie-hellman-key",
      ["A Diffie–Hellman key", "迪菲–赫尔曼密钥"],
      [
        "In a Diffie–Hellman exchange, two people share a prime and a base in public and each keeps a secret exponent. Each sends the base to their own secret, and raises what they receive to that same secret. Both arrive at the base to the product of the secrets, while an eavesdropper would need a discrete logarithm to find it.",
        "在迪菲–赫尔曼交换中，两个人公开共用一个质数和一个底数，各自保留一个秘密指数。每人发送底数的秘密次幂，再把收到的值取自己秘密次幂。两人都得到底数的两个秘密之积次幂，而窃听者需要求离散对数才能得到它。",
      ],
      (rng) => {
        const p = rng.pick([23, 29, 31, 37, 41, 43, 47]);
        const g = rng.pick(Array.from({ length: p - 2 }, (_, i) => i + 2).filter((v) => isPrimitiveRoot(v, p)));
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const sent = powMod(g, a, p);
        const other = powMod(g, b, p);
        const key = powMod(g, a * b, p);
        return ask(
          [
            `With prime $${p}$ and base $${g}$, one person has secret $${a}$ and receives $${other}$ from the other. What is the shared key?`,
            `质数为 $${p}$，底数为 $${g}$，一个人的秘密是 $${a}$，收到对方发来的 $${other}$。共同密钥是多少？`,
          ],
          key,
          [sent, other, powMod(g, a + b, p), (other * a) % p],
          [
            `The key is the received value to the secret: $${other}^{${a}} \\equiv ${key} \\pmod{${p}}$.`,
            `密钥是收到的值的秘密次幂：$${other}^{${a}} \\equiv ${key} \\pmod{${p}}$。`,
          ],
        );
      },
    ),
  ],
);

const quadraticResidues = topic(
  "quadratic-residues",
  ["Quadratic Residues", "二次剩余"],
  ["Identify the squares modulo a prime and count them.", "识别模质数的平方数并数出它们的个数。"],
  ["multiplicative-inverses-modulo-n"],
  [],
  [
    point(
      "recognizing-a-residue",
      ["Recognizing a quadratic residue", "识别二次剩余"],
      [
        "A number is a quadratic residue modulo a prime when it is congruent to a perfect square and not divisible by the prime. To list the residues, square only the numbers from one to half of p, because x and −x have the same square. The remaining nonzero remainders are the nonresidues, and these cannot be square roots of anything modulo p.",
        "一个数如果同余于完全平方数且不被质数整除，就是模这个质数的二次剩余。要列出二次剩余，只需把 1 到 p 的一半的数平方，因为 x 和 −x 的平方相同。其余的非零余数是二次非剩余，模 p 时它们不是任何数的平方。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((q) => q > 10 && q < 100));
        const squares = residues(p);
        const others = Array.from({ length: p - 1 }, (_, i) => i + 1).filter((v) => !squares.includes(v));
        const rootOf = (v: number) => Array.from({ length: p - 1 }, (_, i) => i + 1).find((x) => (x * x) % p === v) as number;
        if (rng.bool()) {
          const answer = rng.pick(others);
          const shown = rng.shuffle(squares).slice(0, 3);
          const proof = shown.map((v) => `$${rootOf(v)}^2 \\equiv ${v}$`);
          return choose(
            rng,
            [`Which of these is not a quadratic residue modulo $${p}$?`, `下列哪个不是模 $${p}$ 的二次剩余？`],
            same(`${answer}`),
            shown.map((v) => same(`${v}`)),
            [
              `The others are squares: ${proof.join(", ")}. The nonzero squares modulo ${p} are ${squares.join(", ")}, and ${answer} is not among them.`,
              `其他几个是平方数：${proof.join("，")}。模 ${p} 的非零平方数是 ${squares.join("、")}，${answer} 不在其中。`,
            ],
          );
        }
        const answer = rng.pick(squares);
        const shown = rng.shuffle(others).slice(0, 3);
        const root = rootOf(answer);
        return choose(
          rng,
          [`Which of these is a quadratic residue modulo $${p}$?`, `下列哪个是模 $${p}$ 的二次剩余？`],
          same(`${answer}`),
          shown.map((v) => same(`${v}`)),
          [
            `$${root}^2 = ${root * root} \\equiv ${answer} \\pmod{${p}}$, and none of the other numbers is a square modulo ${p}.`,
            `$${root}^2 = ${root * root} \\equiv ${answer} \\pmod{${p}}$，其他几个数模 ${p} 都不是平方数。`,
          ],
        );
      },
    ),
    point(
      "counting-residues",
      ["Counting residues", "数二次剩余的个数"],
      [
        "Modulo an odd prime p, squaring sends x and −x to the same value and no other pair collides, so the p − 1 nonzero remainders produce exactly half that many squares. There are therefore as many residues as nonresidues. The count does not depend on anything else about p, and a composite modulus behaves quite differently, so primality is essential.",
        "模奇质数 p 时，平方把 x 和 −x 送到同一个值，其他的数不会相撞，所以 p − 1 个非零余数恰好产生一半那么多的平方数。因此二次剩余和二次非剩余一样多。这个个数和 p 的其他性质无关，合数模数的情况很不相同，所以质数这个条件很关键。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(300).filter((q) => q > 2));
        const asksNon = rng.bool();
        const answer = (p - 1) / 2;
        return ask(
          [
            `How many nonzero ${asksNon ? "quadratic nonresidues" : "quadratic residues"} are there modulo $${p}$?`,
            `模 $${p}$ 的非零${asksNon ? "二次非剩余" : "二次剩余"}有多少个？`,
          ],
          answer,
          [p - 1, answer + 1, p, totient(p - 1)],
          [
            `The ${p - 1} nonzero remainders pair off as $x$ and $-x$ with equal squares, so half of them, ${answer}, are residues, and ${answer} are not.`,
            `${p - 1} 个非零余数两两配对成 $x$ 和 $-x$，平方相同，所以其中一半（${answer} 个）是二次剩余，另外 ${answer} 个不是。`,
          ],
        );
      },
    ),
  ],
);

const legendreSymbol = topic(
  "the-legendre-symbol",
  ["The Legendre Symbol", "勒让德符号"],
  ["Evaluate the symbol directly and through its multiplicative property.", "直接以及利用积性计算勒让德符号。"],
  ["quadratic-residues"],
  [["quadratic-residues", 0.6]],
  [
    point(
      "evaluating-the-symbol",
      ["Evaluating the Legendre symbol", "计算勒让德符号"],
      [
        "The Legendre symbol of a over p records whether a is a square modulo the odd prime p: one for a residue, minus one for a nonresidue, and zero when p divides a. The numerator can be reduced modulo p first, since the symbol depends only on the remainder. For small primes, a list of the squares settles the matter.",
        "勒让德符号 (a/p) 记录 a 模奇质数 p 是否为平方数：二次剩余为 1，二次非剩余为 −1，p 整除 a 时为 0。分子可以先模 p 约简，因为符号只取决于余数。对较小的质数，列出平方数就能解决问题。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((q) => q >= 5 && q < 40));
        const a = rng.int(2, 60);
        const value = legendre(a % p, p);
        const r = a % p;
        return choose(
          rng,
          [`What is $\\left(\\frac{${a}}{${p}}\\right)$?`, `$\\left(\\frac{${a}}{${p}}\\right)$ 是多少？`],
          signWord(value),
          [1, -1, 0].filter((v) => v !== value).map(signWord),
          [
            r === 0
              ? `${p} divides ${a}, so the symbol is 0.`
              : `${a} leaves ${r} modulo ${p}. The nonzero squares modulo ${p} are ${residues(p).join(", ")}, so ${r} ${value === 1 ? "is a residue" : "is not a residue"}.`,
            r === 0
              ? `${p} 整除 ${a}，所以符号是 0。`
              : `${a} 模 ${p} 余 ${r}。模 ${p} 的非零平方数是 ${residues(p).join("、")}，所以 ${r} ${value === 1 ? "是二次剩余" : "不是二次剩余"}。`,
          ],
        );
      },
    ),
    point(
      "multiplying-symbols",
      ["Multiplying symbols", "符号相乘"],
      [
        "The Legendre symbol is multiplicative in its numerator: the symbol of a product is the product of the symbols. In words, residue times residue is a residue, nonresidue times residue is a nonresidue, and nonresidue times nonresidue is a residue. That last case surprises many people. It lets a composite numerator be broken into primes and evaluated piece by piece.",
        "勒让德符号关于分子是积性的：积的符号等于符号的积。也就是说，剩余乘剩余是剩余，非剩余乘剩余是非剩余，非剩余乘非剩余是剩余。最后一种情况让很多人意外。这样就能把合数分子分解成质数，逐个计算。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((q) => q > 10 && q < 90));
        const a = rng.int(2, p - 1);
        const b = rng.int(2, p - 1);
        const [la, lb] = [legendre(a, p), legendre(b, p)];
        const value = la * lb;
        return ask(
          [
            `Given $\\left(\\frac{${a}}{${p}}\\right) = ${la}$ and $\\left(\\frac{${b}}{${p}}\\right) = ${lb}$, what is $\\left(\\frac{${a * b}}{${p}}\\right)$?`,
            `已知 $\\left(\\frac{${a}}{${p}}\\right) = ${la}$，$\\left(\\frac{${b}}{${p}}\\right) = ${lb}$，$\\left(\\frac{${a * b}}{${p}}\\right)$ 是多少？`,
          ],
          value,
          [-value, 0, la + lb, 2],
          [
            `The symbol is multiplicative, so the value is $${la < 0 ? `(${la})` : la} \\times ${lb < 0 ? `(${lb})` : lb} = ${value}$.`,
            `这个符号是积性的，所以值是 $${la < 0 ? `(${la})` : la} \\times ${lb < 0 ? `(${lb})` : lb} = ${value}$。`,
          ],
        );
      },
    ),
  ],
);

const eulerCriterion = topic(
  "eulers-criterion",
  ["Euler's Criterion", "欧拉判别法"],
  ["Decide residues with a power, including when −1 is a square.", "用幂判断二次剩余，包括 −1 何时是平方数。"],
  ["the-legendre-symbol", "using-fermats-little-theorem"],
  [["the-legendre-symbol", 0.5]],
  [
    point(
      "the-half-power",
      ["The half power", "半幂"],
      [
        "Euler's criterion says that a to the power (p − 1)/2 is congruent to the Legendre symbol of a over p. By Fermat's little theorem, the square of this half power is one, so it can only be one or minus one, and minus one is written as p − 1. This gives a calculation by repeated squaring, with no need for a table of squares.",
        "欧拉判别法说，a 的 (p − 1)/2 次幂同余于勒让德符号 (a/p)。由费马小定理，这个半幂的平方是 1，所以它只能是 1 或 −1，而 −1 写作 p − 1。这样就可以用反复平方来计算，不需要平方数表。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((q) => q > 5));
        const a = rng.int(2, p - 1);
        const half = (p - 1) / 2;
        const answer = powMod(a, half, p);
        return ask(
          [`What is the remainder of $${a}^{${half}}$ when divided by $${p}$?`, `$${a}^{${half}}$ 除以 $${p}$ 的余数是多少？`],
          answer,
          [answer === 1 ? p - 1 : 1, 0, a, half],
          [
            `By Euler's criterion the value is 1 or ${p - 1}, and ${a} ${answer === 1 ? "is" : "is not"} a square modulo ${p}, so the remainder is ${answer}.`,
            `由欧拉判别法，这个值是 1 或 ${p - 1}，而 ${a} 模 ${p} ${answer === 1 ? "是" : "不是"}平方数，所以余数是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "when-minus-one-is-a-square",
      ["When −1 is a square", "−1 何时是平方数"],
      [
        "Applying Euler's criterion to minus one gives minus one to the power (p − 1)/2, which is one when (p − 1)/2 is even. So minus one is a square modulo an odd prime exactly when the prime leaves remainder one on division by four. For primes leaving remainder three, no number squares to minus one, as with the real numbers.",
        "把欧拉判别法用于 −1，得到 −1 的 (p − 1)/2 次幂，当 (p − 1)/2 是偶数时为 1。所以 −1 模奇质数是平方数，当且仅当这个质数除以 4 余 1。对除以 4 余 3 的质数，没有数的平方等于 −1，就像在实数中一样。",
      ],
      (rng) => {
        const pick = rng.pick(primesUpTo(300).filter((q) => q % 4 === 1));
        const others = rng.shuffle(primesUpTo(300).filter((q) => q % 4 === 3)).slice(0, 3);
        const root = Array.from({ length: pick - 1 }, (_, i) => i + 1).find((x) => (x * x + 1) % pick === 0) as number;
        const [lo, hi] = bounds([pick, ...others]);
        return choose(
          rng,
          [
            `Modulo which of these primes between $${lo}$ and $${hi}$ is $-1$ a square?`,
            `模下列在 $${lo}$ 和 $${hi}$ 之间的哪个质数时，$-1$ 是平方数？`,
          ],
          same(`${pick}`),
          others.map((q) => same(`${q}`)),
          [
            `${pick} leaves 1 on division by 4, and $${root}^2 \\equiv -1 \\pmod{${pick}}$. The other primes leave 3 on division by 4.`,
            `${pick} 除以 4 余 1，而且 $${root}^2 \\equiv -1 \\pmod{${pick}}$。其他几个质数除以 4 余 3。`,
          ],
        );
      },
    ),
  ],
);

const reciprocity = topic(
  "quadratic-reciprocity",
  ["Quadratic Reciprocity", "二次互反律"],
  ["Flip a Legendre symbol, and use the rule for the numerator 2.", "翻转勒让德符号，并使用分子为 2 的规则。"],
  ["eulers-criterion"],
  [["eulers-criterion", 0.4]],
  [
    point(
      "flipping-a-symbol",
      ["Flipping a symbol", "翻转符号"],
      [
        "Quadratic reciprocity links two odd primes: the symbol of p over q equals the symbol of q over p, except that the sign changes when both primes leave remainder three on division by four. After flipping, the larger number can be reduced modulo the smaller one. Repeating this makes the numbers fall quickly, as in the Euclidean algorithm, until the value is easy to see.",
        "二次互反律联系两个奇质数：(p/q) 等于 (q/p)，只有当两个质数除以 4 都余 3 时才变号。翻转之后，较大的数可以模较小的数约简。重复这样做，数会很快变小，就像欧几里得算法一样，直到结果一目了然。",
      ],
      (rng) => {
        const pool = oddPrimes.filter((q) => q >= 5 && q < 90);
        const [p, q] = rng.shuffle(pool) as [number, number];
        const value = legendre(p, q);
        const both = p % 4 === 3 && q % 4 === 3;
        const flipped = legendre(q, p);
        return choose(
          rng,
          [
            `Given $\\left(\\frac{${q}}{${p}}\\right) = ${flipped}$, what is $\\left(\\frac{${p}}{${q}}\\right)$?`,
            `已知 $\\left(\\frac{${q}}{${p}}\\right) = ${flipped}$，$\\left(\\frac{${p}}{${q}}\\right)$ 是多少？`,
          ],
          signWord(value),
          [signWord(-value), signWord(0), ["It cannot be determined", "无法确定"]],
          [
            both
              ? `Both primes leave 3 on division by 4, so flipping changes the sign, and the value is ${value}.`
              : `At least one prime leaves 1 on division by 4, so flipping keeps the sign, and the value is ${value}.`,
            both
              ? `两个质数除以 4 都余 3，所以翻转会变号，结果是 ${value}。`
              : `至少有一个质数除以 4 余 1，所以翻转不变号，结果是 ${value}。`,
          ],
        );
      },
    ),
    point(
      "the-symbol-of-two",
      ["The symbol of two", "2 的符号"],
      [
        "Reciprocity needs a separate rule for the number two, because two is even. The rule depends on the prime modulo eight: two is a square when the prime leaves remainder one or seven, and it is not when the prime leaves remainder three or five. Together with the rule for minus one, this handles every numerator that arises after factoring.",
        "互反律对 2 需要单独的规则，因为 2 是偶数。这个规则取决于质数模 8 的余数：质数余 1 或 7 时，2 是平方数；余 3 或 5 时不是。结合 −1 的规则，就能处理分解后出现的所有分子。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(400).filter((q) => q > 2));
        const value = p % 8 === 1 || p % 8 === 7 ? 1 : -1;
        return choose(
          rng,
          [`What is $\\left(\\frac{2}{${p}}\\right)$?`, `$\\left(\\frac{2}{${p}}\\right)$ 是多少？`],
          signWord(value),
          [signWord(-value), signWord(0), signWord(2)],
          [`${p} leaves ${p % 8} on division by 8, so the value is ${value}.`, `${p} 除以 8 余 ${p % 8}，所以值是 ${value}。`],
        );
      },
    ),
  ],
);

/** twoSquares writes a prime leaving remainder 1 on division by 4 as a sum of two squares. */
const twoSquares = (p: number): [number, number] => {
  for (let a = 1; a * a < p; a++) {
    const b = Math.round(Math.sqrt(p - a * a));
    if (a <= b && a * a + b * b === p) return [a, b];
  }
  return [0, 0];
};

const sumsOfSquares = topic(
  "sums-of-two-squares",
  ["Sums of Two Squares", "两个平方数之和"],
  ["Decide which primes and numbers are a sum of two squares.", "判断哪些质数和整数是两个平方数之和。"],
  ["eulers-criterion"],
  [],
  [
    point(
      "primes-as-sums-of-two-squares",
      ["Primes as sums of two squares", "表示为两平方数之和的质数"],
      [
        "Fermat's theorem on sums of two squares says that an odd prime is a sum of two squares exactly when it leaves remainder one on division by four. Squares leave remainder zero or one modulo four, so a sum of two squares can never leave three. The hard direction of the proof uses the fact that minus one is a square for these primes.",
        "费马平方和定理说，奇质数是两个平方数之和，当且仅当它除以 4 余 1。平方数模 4 余 0 或 1，所以两个平方数之和不可能余 3。证明中困难的方向用到了这样的事实：对这些质数，−1 是平方数。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(400).filter((q) => q % 4 === 1));
        const [a, b] = twoSquares(p);
        return ask(
          [
            `The prime $${p}$ equals $a^2 + b^2$ for positive integers $a < b$. What is $b$?`,
            `质数 $${p}$ 等于 $a^2 + b^2$，其中 $a < b$ 是正整数。$b$ 是多少？`,
          ],
          b,
          [a, a + b, Math.floor(Math.sqrt(p)) + 1, b - 1],
          [
            `$${p} = ${a}^2 + ${b}^2$, because $${a * a} + ${b * b} = ${p}$.`,
            `$${p} = ${a}^2 + ${b}^2$，因为 $${a * a} + ${b * b} = ${p}$。`,
          ],
        );
      },
    ),
    point(
      "numbers-as-sums-of-two-squares",
      ["Numbers as sums of two squares", "表示为两平方数之和的整数"],
      [
        "A positive integer is a sum of two squares exactly when every prime leaving remainder three on division by four appears in its factorization to an even power. So 45, which is 9 times 5, works, as it has an even power of three, whereas 21 does not. The identity for a product of two such sums explains why the property passes to products.",
        "正整数是两个平方数之和，当且仅当它的分解式中每个除以 4 余 3 的质数都是偶数次幂。所以 45 = 9 × 5 可以，因为 3 的幂是偶数；而 21 不行。两个这样的和相乘的恒等式，说明了这个性质为什么能传给积。",
      ],
      (rng) => {
        const works = (n: number) => factorize(n).every(([p, e]) => p % 4 !== 3 || e % 2 === 0);
        const pool = Array.from({ length: 300 }, (_, i) => i + 10);
        const answer = rng.pick(pool.filter((n) => works(n) && !isPrime(n)));
        const others = rng.shuffle(pool.filter((n) => !works(n))).slice(0, 3);
        const [lo, hi] = bounds([answer, ...others]);
        return choose(
          rng,
          [
            `Which of these numbers between $${lo}$ and $${hi}$ is a sum of two squares?`,
            `下列在 $${lo}$ 和 $${hi}$ 之间的数中，哪个是两个平方数之和？`,
          ],
          same(`${answer}`),
          others.map((n) => same(`${n}`)),
          [
            `$${answer} = ${factorizationLatex(factorize(answer))}$ has an even power of every prime leaving 3 on division by 4, and each of the others has an odd power of such a prime.`,
            `$${answer} = ${factorizationLatex(factorize(answer))}$，其中除以 4 余 3 的质数都是偶数次幂；其他几个数中都有这样的质数是奇数次幂。`,
          ],
        );
      },
    ),
  ],
);

const pythagoreanTriples = topic(
  "pythagorean-triples",
  ["Pythagorean Triples", "勾股数"],
  ["Generate triples from two numbers and recognize primitive ones.", "由两个数生成勾股数，并识别本原勾股数。"],
  ["properties-of-prime-divisibility"],
  [],
  [
    point(
      "generating-a-triple",
      ["Generating a triple", "生成勾股数"],
      [
        "Every primitive Pythagorean triple comes from two coprime numbers m and n of opposite parity, with m larger: the legs are m squared minus n squared and twice mn, and the hypotenuse is m squared plus n squared. Checking the identity by expanding is a good exercise. Scaling a primitive triple by any factor then gives all the others.",
        "每个本原勾股数都来自两个互质且奇偶性相反的数 m 和 n（m 较大）：两条直角边是 $m^2 - n^2$ 和 $2mn$，斜边是 $m^2 + n^2$。展开验证这个恒等式是很好的练习。把本原勾股数乘任意倍数，就得到其余所有勾股数。",
      ],
      (rng) => {
        const m = rng.int(2, 12);
        const n = rng.pick(Array.from({ length: m - 1 }, (_, i) => i + 1).filter((v) => gcd(m, v) === 1 && (m + v) % 2 === 1));
        const [a, b, c] = [m * m - n * n, 2 * m * n, m * m + n * n];
        const which = rng.int(0, 2);
        const names: Pair[] = [
          ["the odd leg", "奇数直角边"],
          ["the even leg", "偶数直角边"],
          ["the hypotenuse", "斜边"],
        ];
        const name = names[which] as Pair;
        const answer = [a, b, c][which] as number;
        return ask(
          [
            `Take $m = ${m}$ and $n = ${n}$ in the formula for primitive Pythagorean triples. What is ${name[0]}?`,
            `在本原勾股数公式中取 $m = ${m}$，$n = ${n}$。${name[1]}是多少？`,
          ],
          answer,
          [[a, b, c][(which + 1) % 3] as number, [a, b, c][(which + 2) % 3] as number, m + n, m * n, answer + 2],
          [
            `The triple is $m^2 - n^2 = ${a}$, $2mn = ${b}$, $m^2 + n^2 = ${c}$, and $${a}^2 + ${b}^2 = ${c}^2$.`,
            `这组勾股数是 $m^2 - n^2 = ${a}$，$2mn = ${b}$，$m^2 + n^2 = ${c}$，且 $${a}^2 + ${b}^2 = ${c}^2$。`,
          ],
        );
      },
    ),
    point(
      "recognizing-a-primitive-triple",
      ["Recognizing a primitive triple", "识别本原勾股数"],
      [
        "A Pythagorean triple is primitive when its three numbers have no common factor. Any common factor of two of the numbers also divides the third, so checking a single pair is enough. A scaled triple such as 9, 12, 15 satisfies the equation yet is not primitive. Exactly one leg of a primitive triple is even, which gives a second quick check.",
        "三个数没有公因数的勾股数是本原的。其中两个数的公因数也整除第三个数，所以只需检查一对。像 9、12、15 这样放大后的勾股数满足方程，但不是本原的。本原勾股数恰有一条直角边是偶数，这是第二个快速检验。",
      ],
      (rng) => {
        const primitive = (m: number, n: number): [number, number, number] => [m * m - n * n, 2 * m * n, m * m + n * n];
        const pairs: [number, number][] = [];
        for (let m = 2; m <= 8; m++) for (let n = 1; n < m; n++) if (gcd(m, n) === 1 && (m + n) % 2 === 1) pairs.push([m, n]);
        const [m0, n0] = rng.pick(pairs);
        const right = primitive(m0, n0);
        const others = rng.shuffle(pairs.filter(([m, n]) => m !== m0 || n !== n0)).slice(0, 3);
        const scaled = others.map(([m, n]) => {
          const factor = rng.int(2, 4);
          return primitive(m, n).map((v) => v * factor);
        });
        const write = (triple: readonly number[]) => same(`(${triple.join(", ")})`);
        const [lo, hi] = bounds([right, ...scaled].map((triple) => Math.max(...triple)));
        return choose(
          rng,
          [
            `Which of these Pythagorean triples, with hypotenuses between $${lo}$ and $${hi}$, is primitive?`,
            `下列斜边在 $${lo}$ 和 $${hi}$ 之间的勾股数中，哪组是本原的？`,
          ],
          write(right),
          scaled.map(write),
          [
            `The numbers ${right.join(", ")} have no common factor, and each of the others has one.`,
            `${right.join("、")} 没有公因数，其他几组都有公因数。`,
          ],
        );
      },
    ),
  ],
);

const multiplicativeFunctions = topic(
  "multiplicative-functions",
  ["Multiplicative Functions", "积性函数"],
  ["Use multiplicativity for coprime parts, and adjust when they are not coprime.", "对互质部分使用积性，不互质时作调整。"],
  ["computing-and-counting-with-the-totient", "the-sum-of-divisors-function"],
  [
    ["computing-and-counting-with-the-totient", 0.4],
    ["the-sum-of-divisors-function", 0.4],
  ],
  [
    point(
      "values-on-coprime-products",
      ["Values on coprime products", "互质之积上的值"],
      [
        "A function on the positive integers is multiplicative when its value at a product of two coprime numbers is the product of its values. The divisor count, the divisor sum and the totient all have this property. So their value at any number follows from the values at its prime powers, which is why factoring comes first when computing any of these.",
        "正整数上的函数，如果在两个互质数之积上的值等于各自值的积，就是积性函数。因数个数、因数和和欧拉函数都有这个性质。所以它们在任何数上的值都由质数幂上的值决定，这就是为什么计算它们时要先分解。",
      ],
      (rng) => {
        const a = rng.pick([3, 4, 5, 7, 8, 9, 11, 13]);
        const b = rng.pick([3, 4, 5, 7, 8, 9, 11, 13, 16, 25].filter((v) => gcd(a, v) === 1));
        const fn = rng.pick([
          { tex: "\\tau", f: (n: number) => divisors(n).length },
          { tex: "\\sigma", f: sigma },
          { tex: "\\varphi", f: totient },
        ]);
        const [fa, fb] = [fn.f(a), fn.f(b)];
        return ask(
          [
            `Given $${fn.tex}(${a}) = ${fa}$ and $${fn.tex}(${b}) = ${fb}$, what is $${fn.tex}(${a * b})$?`,
            `已知 $${fn.tex}(${a}) = ${fa}$，$${fn.tex}(${b}) = ${fb}$，$${fn.tex}(${a * b})$ 是多少？`,
          ],
          fa * fb,
          [fa + fb, fa * fb + 1, a * b, fa * b],
          [
            `${a} and ${b} are coprime and the function is multiplicative, so the value is $${fa} \\times ${fb} = ${fa * fb}$.`,
            `${a} 和 ${b} 互质，这个函数是积性的，所以值是 $${fa} \\times ${fb} = ${fa * fb}$。`,
          ],
        );
      },
    ),
    point(
      "when-the-parts-share-a-factor",
      ["When the parts share a factor", "当两部分有公因数时"],
      [
        "Multiplicativity needs coprime parts, and the product of the values is wrong otherwise. For the totient, the correction is that phi of ab equals phi of a times phi of b times the greatest common divisor over phi of that divisor. So the true value exceeds the naive product. It helps to refactor the product into prime powers rather than trust the shortcut.",
        "积性要求两部分互质，否则值的积就是错的。对欧拉函数，修正公式是 φ(ab) = φ(a)φ(b) · d/φ(d)，其中 d 是最大公因数。所以真实值比简单的积要大。最好把积重新分解成质数幂，而不要相信这个捷径。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 6]);
        const a = d * rng.int(1, 6);
        const b = d * rng.int(2, 7);
        const answer = totient(a * b);
        const naive = totient(a) * totient(b);
        return ask(
          [
            `What is $\\varphi(${a * b})$, where $${a * b} = ${a} \\times ${b}$?`,
            `$\\varphi(${a * b})$ 是多少？这里 $${a * b} = ${a} \\times ${b}$。`,
          ],
          answer,
          [naive === answer ? answer + 2 : naive, answer + 1, a * b - 1, totient(a) + totient(b)],
          [
            `${a} and ${b} share a factor, so multiplying $\\varphi(${a}) \\times \\varphi(${b})$ does not work. Instead $${a * b} = ${factorizationLatex(factorize(a * b))}$ gives ${answer}.`,
            `${a} 和 ${b} 有公因数，所以不能直接用 $\\varphi(${a}) \\times \\varphi(${b})$。而 $${a * b} = ${factorizationLatex(factorize(a * b))}$ 给出 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const mobiusFunction = topic(
  "the-mobius-function",
  ["The Möbius Function", "默比乌斯函数"],
  ["Evaluate the function and invert a divisor sum.", "计算这个函数并反演因数和。"],
  ["multiplicative-functions"],
  [["multiplicative-functions", 0.3]],
  [
    point(
      "evaluating-mu",
      ["Evaluating the Möbius function", "计算默比乌斯函数"],
      [
        "The Möbius function is zero when a number has a repeated prime factor, one when it is a product of an even number of distinct primes, and minus one when it is a product of an odd number. So it only looks at the shape of the factorization. By convention its value at one is one, the product of no primes, which counts as even.",
        "默比乌斯函数在一个数有重复质因数时为 0，是偶数个不同质数之积时为 1，是奇数个不同质数之积时为 −1。所以它只看分解式的形状。按约定，它在 1 处的值是 1，因为 1 是零个质数之积，算作偶数个。",
      ],
      (rng) => {
        const n = pickComposite(rng, 4, 500);
        const value = mobius(n);
        const factors = factorize(n);
        return choose(
          rng,
          [`What is $\\mu(${n})$?`, `$\\mu(${n})$ 是多少？`],
          signWord(value),
          [1, -1, 0].filter((v) => v !== value).map(signWord),
          [
            value === 0
              ? `$${n} = ${factorizationLatex(factors)}$ has a repeated prime factor, so the value is 0.`
              : `$${n} = ${factorizationLatex(factors)}$ is a product of ${factors.length} distinct ${factors.length === 1 ? "prime" : "primes"}, so the value is ${value}.`,
            value === 0
              ? `$${n} = ${factorizationLatex(factors)}$ 有重复的质因数，所以值是 0。`
              : `$${n} = ${factorizationLatex(factors)}$ 是 ${factors.length} 个不同质数之积，所以值是 ${value}。`,
          ],
        );
      },
    ),
    point(
      "inverting-a-divisor-sum",
      ["Inverting a divisor sum", "反演因数和"],
      [
        "When F of n is the sum of f of d over the divisors d of n, Möbius inversion recovers f from F: f of n is the sum, over divisors d, of mu of d times F of n over d. The terms with a repeated prime vanish. For a prime power, only two terms survive, so f at that power is the difference of two consecutive values of F.",
        "如果 F(n) 是 f(d) 对 n 的所有因数 d 之和，默比乌斯反演可以由 F 求出 f：f(n) 是 $\\mu(d)F(n/d)$ 对所有因数 d 之和。含重复质数的项都消失了。对质数幂，只留下两项，所以 f 在这个幂处的值是 F 相邻两个值之差。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7]);
        const k = rng.int(2, 4);
        const values = Array.from({ length: k + 1 }, () => 0);
        let total = rng.int(1, 5);
        values[0] = total;
        for (let i = 1; i <= k; i++) {
          total += rng.int(2, 30);
          values[i] = total;
        }
        const [high, low] = [values[k] as number, values[k - 1] as number];
        return ask(
          [
            `Let $F(n) = \\sum_{d \\mid n} f(d)$. Given $F(${p}^{${k}}) = ${high}$ and $F(${p}^{${k - 1}}) = ${low}$, what is $f(${p}^{${k}})$?`,
            `设 $F(n) = \\sum_{d \\mid n} f(d)$。已知 $F(${p}^{${k}}) = ${high}$，$F(${p}^{${k - 1}}) = ${low}$，$f(${p}^{${k}})$ 是多少？`,
          ],
          high - low,
          [high + low, high, low, high - low - 1],
          [
            `The divisors of $${p}^{${k}}$ are those of $${p}^{${k - 1}}$ and $${p}^{${k}}$ itself, so $f(${p}^{${k}}) = ${high} - ${low} = ${high - low}$.`,
            `$${p}^{${k}}$ 的因数就是 $${p}^{${k - 1}}$ 的因数加上 $${p}^{${k}}$ 本身，所以 $f(${p}^{${k}}) = ${high} - ${low} = ${high - low}$。`,
          ],
        );
      },
    ),
  ],
);

/** continuedValue evaluates a finite continued fraction. */
const continuedValue = (terms: readonly number[]): Q => {
  let value = Q.of(terms.at(-1) as number);
  for (let i = terms.length - 2; i >= 0; i--) value = Q.of(terms[i] as number).add(Q.of(1).div(value));
  return value;
};

const continuedFractions = topic(
  "continued-fractions",
  ["Continued Fractions", "连分数"],
  ["Evaluate a continued fraction, and expand a rational number as one.", "计算连分数，并把有理数展开成连分数。"],
  ["the-euclidean-algorithm"],
  [["the-euclidean-algorithm", 0.4]],
  [
    point(
      "evaluating-a-continued-fraction",
      ["Evaluating a continued fraction", "计算连分数"],
      [
        "The notation with a semicolon lists the whole parts of a nested fraction: the first number, plus one over the second, plus one over the third, and so on. To evaluate it, start at the innermost term and work outward, inverting and adding at each stage. Starting from the outside does not work, because each stage depends on the value below it.",
        "带分号的记号列出嵌套分数的各整数部分：第一个数，加上 1 除以第二个数，再加 1 除以第三个数，依此类推。计算时要从最里面的项开始向外算，每一步先取倒数再相加。从外面开始不行，因为每一步都依赖下一层的值。",
      ],
      (rng) => {
        const terms = [rng.int(1, 4), rng.int(1, 5), rng.int(1, 6), rng.int(2, 6)];
        const answer = continuedValue(terms);
        const shorter = continuedValue(terms.slice(0, 3));
        const reversed = continuedValue([...terms].reverse());
        return ask(
          [
            `What is $[${terms[0]}; ${terms.slice(1).join(", ")}]$ as a fraction?`,
            `$[${terms[0]}; ${terms.slice(1).join(", ")}]$ 写成分数是多少？`,
          ],
          answer,
          [shorter, reversed, Q.of(terms.reduce((a, b) => a + b, 0)), answer.add(Q.of(1))],
          [`Working from the inside out, the value is $${answer.toLatex()}$.`, `从里向外计算，值是 $${answer.toLatex()}$。`],
        );
      },
    ),
    point(
      "expanding-a-rational-number",
      ["Expanding a rational number", "展开有理数"],
      [
        "The terms of a continued fraction for a rational number are the quotients of the Euclidean algorithm applied to its numerator and denominator. Each step takes the whole part and inverts what is left. The process must end, since the remainders keep falling, and that is the reason why rational numbers have finite expansions and irrational numbers do not.",
        "有理数的连分数各项，就是对分子和分母做欧几里得算法时得到的商。每一步取整数部分，再把剩下的取倒数。这个过程一定会结束，因为余数不断减小，这正是有理数的展开有限而无理数的展开无限的原因。",
      ],
      (rng) => {
        const terms = [rng.int(1, 5), rng.int(1, 6), rng.int(1, 6), rng.int(2, 7)];
        const value = continuedValue(terms);
        const position = rng.int(1, 3);
        const answer = terms[position] as number;
        const labels: Pair[] = [
          ["", ""],
          ["$a_1$", "$a_1$"],
          ["$a_2$", "$a_2$"],
          ["$a_3$", "$a_3$"],
        ];
        return ask(
          [
            `Expand $${value.toLatex()}$ as $[a_0; a_1, a_2, a_3]$, with the last term above 1. What is ${(labels[position] as Pair)[0]}?`,
            `把 $${value.toLatex()}$ 展开成 $[a_0; a_1, a_2, a_3]$，最后一项大于 1。${(labels[position] as Pair)[1]} 是多少？`,
          ],
          answer,
          [
            terms[0] as number,
            answer + 1,
            Math.max(answer - 1, 0) === answer ? answer + 2 : Math.max(answer - 1, 0),
            terms[(position % 3) + 1] === answer ? answer + 3 : (terms[(position % 3) + 1] as number),
          ],
          [
            `The Euclidean algorithm gives the quotients ${terms.join(", ")}, so the expansion is $[${terms[0]}; ${terms.slice(1).join(", ")}]$.`,
            `欧几里得算法给出的商是 ${terms.join("、")}，所以展开式是 $[${terms[0]}; ${terms.slice(1).join(", ")}]$。`,
          ],
        );
      },
    ),
  ],
);

/** pellSolution finds the smallest positive solution of x^2 - dy^2 = 1 with y up to a limit. */
const pellSolution = (d: number): [number, number] | undefined => {
  for (let y = 1; y <= 300; y++) {
    const x = Math.round(Math.sqrt(d * y * y + 1));
    if (x * x - d * y * y === 1) return [x, y];
  }
  return undefined;
};

/** pellValues lists the numbers d that are not squares and have a small fundamental solution. */
const pellValues = Array.from({ length: 118 }, (_, i) => i + 2).filter((d) => !Number.isInteger(Math.sqrt(d)) && pellSolution(d));

const pell = topic(
  "pells-equation",
  ["Pell's Equation", "佩尔方程"],
  ["Find the smallest solution, and build the next one from it.", "求最小解，并由它构造下一个解。"],
  ["continued-fractions", "linear-diophantine-equations"],
  [],
  [
    point(
      "the-fundamental-solution",
      ["The fundamental solution", "基本解"],
      [
        "Pell's equation asks for whole numbers with x squared minus d times y squared equal to one, where d is not a square. Trying y equal to one, two, three and so on, and checking whether d times y squared plus one is a square, finds the smallest solution for small d. That solution, called the fundamental one, determines all the others.",
        "佩尔方程要求整数满足 $x^2 - dy^2 = 1$，其中 d 不是平方数。依次试 y = 1、2、3……，检查 $dy^2 + 1$ 是否为平方数，就能在 d 较小时找到最小解。这个解叫基本解，它决定了所有其他的解。",
      ],
      (rng) => {
        const d = rng.pick(pellValues);
        const [x, y] = pellSolution(d) as [number, number];
        return ask(
          [
            `What is the smallest positive $y$ for which $x^2 - ${d}y^2 = 1$ has a whole-number solution $x$?`,
            `使 $x^2 - ${d}y^2 = 1$ 有整数解 $x$ 的最小正整数 $y$ 是多少？`,
          ],
          y,
          [x, y + 1, Math.max(y - 1, 2), d],
          [
            `$${d} \\times ${y}^2 + 1 = ${d * y * y + 1} = ${x}^2$, and no smaller $y$ makes this a square.`,
            `$${d} \\times ${y}^2 + 1 = ${d * y * y + 1} = ${x}^2$，更小的 $y$ 都不能使它成为平方数。`,
          ],
        );
      },
    ),
    point(
      "the-next-solution",
      ["The next solution", "下一个解"],
      [
        "Solutions of Pell's equation combine like numbers of the form $x + y\\sqrt{d}$, and multiplying two solutions gives another. So squaring the fundamental solution gives the next: the new x is x squared plus d times y squared, and the new y is twice xy. Repeating this produces infinitely many solutions, and all of them arise as powers of the fundamental one.",
        "佩尔方程的解可以像 $x + y\\sqrt{d}$ 形式的数那样组合，两个解相乘得到另一个解。所以把基本解平方就得到下一个解：新的 x 是 $x^2 + dy^2$，新的 y 是 $2xy$。重复这样做可以得到无穷多个解，而且所有的解都是基本解的幂。",
      ],
      (rng) => {
        const d = rng.pick(pellValues.filter((v) => (pellSolution(v) as [number, number])[1] <= 30));
        const [x, y] = pellSolution(d) as [number, number];
        const newX = x * x + d * y * y;
        const newY = 2 * x * y;
        const asksX = rng.bool();
        return ask(
          [
            `The smallest solution of $x^2 - ${d}y^2 = 1$ is $(${x}, ${y})$. In the next solution, what is ${asksX ? "$x$" : "$y$"}?`,
            `$x^2 - ${d}y^2 = 1$ 的最小解是 $(${x}, ${y})$。下一个解中，${asksX ? "$x$" : "$y$"} 是多少？`,
          ],
          asksX ? newX : newY,
          asksX ? [newY, 2 * x, x * x, newX + 1] : [newX, 2 * y, x * y, newY + 1],
          [
            `Squaring gives $x' = ${x}^2 + ${d} \\times ${y}^2 = ${newX}$ and $y' = 2 \\times ${x} \\times ${y} = ${newY}$.`,
            `平方得 $x' = ${x}^2 + ${d} \\times ${y}^2 = ${newX}$，$y' = 2 \\times ${x} \\times ${y} = ${newY}$。`,
          ],
        );
      },
    ),
  ],
);

/** numberTheoryCourseTopics holds the topics written for the Number Theory course. */
export const numberTheoryCourseTopics: readonly TopicDef[] = [
  countingDivisors,
  sumOfDivisors,
  perfectNumbers,
  sieve,
  countingPrimes,
  powersModulo,
  fermatLittle,
  totientFunction,
  eulerTheorem,
  wilson,
  orders,
  primitiveRoots,
  discreteLogs,
  quadraticResidues,
  legendreSymbol,
  eulerCriterion,
  reciprocity,
  sumsOfSquares,
  pythagoreanTriples,
  multiplicativeFunctions,
  mobiusFunction,
  continuedFractions,
  pell,
];
