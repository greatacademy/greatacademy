// Further knowledge points for topics of Discrete Mathematics, each a skill the
// topic's own points leave out. See `deeperDiscreteMathematicsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

/** inParens puts a negative number in parentheses, for use inside a sum or under a power. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => [...Array(hi - lo + 1).keys()].map((i) => i + lo);
/** gcd gives the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** totient counts the integers from 1 to n coprime to n. */
const totient = (n: number) => range(1, n).filter((i) => gcd(i, n) === 1).length;
/** binom gives the binomial coefficient. */
const binom = (n: number, k: number) => {
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return c;
};
/** powersMod lists a^1, a^2, … mod n up to and including the first 1, for a coprime to n. */
const powersMod = (a: number, n: number) => {
  const out = [a % n];
  while (out[out.length - 1] !== 1) out.push(((out[out.length - 1] as number) * a) % n);
  return out;
};
/** powMod gives b^e mod n. */
const powMod = (b: number, e: number, n: number) => {
  let r = 1;
  for (let i = 0; i < e; i++) r = (r * b) % n;
  return r;
};
/** derangements counts the permutations of m items that fix none of them. */
const derangements = (m: number): number => (m === 0 ? 1 : m === 1 ? 0 : (m - 1) * (derangements(m - 1) + derangements(m - 2)));
/** pow writes a base to an exponent, leaving out an exponent of one. */
const pow = (base: number, e: number) => (e === 1 ? `${base}` : `${base}^{${e}}`);

const functionsOfAGivenWeight: KnowledgePointDef = {
  id: "boolean-functions-of-a-given-weight",
  title: t("Boolean functions of a given weight", "给定权重的布尔函数"),
  explanation: t(
    "The weight of a Boolean function is the number of inputs on which it equals one. A function of $n$ variables has $2^n$ inputs, and choosing the function is the same as choosing which inputs get a one. So the functions of weight $k$ are counted by a binomial coefficient, not by a power of two.",
    "布尔函数的权重是它取值为一的输入个数。$n$ 元函数有 $2^n$ 个输入，确定函数就是选出哪些输入取一。所以权重为 $k$ 的函数个数是一个二项式系数，而不是二的幂。",
  ),
  generate(rng) {
    const [n, k] = rng.pick([
      ...range(1, 3).map((k) => [2, k] as const),
      ...range(1, 7).map((k) => [3, k] as const),
      ...range(1, 15).map((k) => [4, k] as const),
      ...range(1, 4).map((k) => [5, k] as const),
    ]);
    const inputs = 2 ** n;
    const answer = binom(inputs, k);
    return numberProblem({
      prompt: t(
        `How many Boolean functions of ${n} variables equal 1 on exactly ${k} of their inputs?`,
        `有多少个 ${n} 元布尔函数恰好在 ${k} 个输入上取值为 1？`,
      ),
      answer,
      form: "integer",
      wrong: [inputs * k, binom(inputs, k - 1), 2 ** inputs],
      solution: t(
        `There are $2^{${n}} = ${inputs}$ inputs, and a function is fixed by choosing which ${k} of them give 1. That makes $\\binom{${inputs}}{${k}} = ${answer}$ functions.`,
        `共有 $2^{${n}} = ${inputs}$ 个输入，选出取 1 的 ${k} 个输入就确定了函数。所以有 $\\binom{${inputs}}{${k}} = ${answer}$ 个函数。`,
      ),
    });
  },
};

const selfDualCompletions: KnowledgePointDef = {
  id: "completing-a-self-dual-function",
  title: t("Completing a self-dual function", "补全自对偶函数"),
  explanation: t(
    "A self-dual function satisfies $f(\\bar{x}) = \\overline{f(x)}$, so its value on an input fixes its value on the complementary input. The inputs therefore fall into complementary pairs, with one free choice per pair. Counting completions means counting the pairs that nothing has decided yet, and each of them doubles the count.",
    "自对偶函数满足 $f(\\bar{x}) = \\overline{f(x)}$，所以它在一个输入上的值决定了在互补输入上的值。于是输入分成互补的对，每一对只有一次自由选择。计算补全的方式，就是数出尚未确定的对，每一对都使个数加倍。",
  ),
  generate(rng) {
    const [n, k] = rng.pick([
      [2, 1] as const,
      ...range(1, 3).map((k) => [3, k] as const),
      ...range(1, 7).map((k) => [4, k] as const),
      ...range(1, 15).map((k) => [5, k] as const),
    ]);
    const pairs = 2 ** (n - 1);
    const free = pairs - k;
    const answer = 2 ** free;
    const shown = free === 1 ? "$2$" : `$2^{${free}} = ${answer}$`;
    return numberProblem({
      prompt: t(
        `The values of a self-dual Boolean function of ${n} variables are known on ${k} inputs, no two of which are complements. How many such functions have these values?`,
        `一个 ${n} 元自对偶布尔函数在 ${k} 个输入上的值已知，这些输入两两不互补。有多少个这样的函数取这些值？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** (2 ** n - k), 2 ** pairs, 2 ** (free + 1)],
      solution: t(
        `The $2^{${n}}$ inputs form ${pairs} complementary pairs. The known values settle ${k} of them, which leaves ${free} free, so there are ${shown} functions.`,
        `$2^{${n}}$ 个输入组成 ${pairs} 个互补对。已知的值确定了其中 ${k} 对，还剩 ${free} 对可以自由选择，所以有 ${shown} 个函数。`,
      ),
    });
  },
};

const thresholdWeight: KnowledgePointDef = {
  id: "the-true-inputs-of-a-threshold-function",
  title: t("The true inputs of a threshold function", "阈值函数的真输入"),
  explanation: t(
    "A threshold function equals one when at least $k$ of its variables equal one. It is monotonic, because turning a zero into a one can never bring the count below the threshold. Its value depends only on how many ones an input has, so its true inputs can be counted by adding a binomial coefficient for each allowed count.",
    "阈值函数在至少 $k$ 个变量取一时取值为一。它是单调的，因为把零改成一不会使个数降到阈值以下。它的值只取决于输入中一的个数，所以可以对每个允许的个数加上一个二项式系数，数出真输入。",
  ),
  generate(rng) {
    const [n, k] = rng.pick(range(3, 8).flatMap((n) => range(1, n).map((k) => [n, k] as const)));
    const counts = range(k, n);
    const answer = counts.reduce((s, j) => s + binom(n, j), 0);
    const terms = counts.map((j) => `\\binom{${n}}{${j}}`).join(" + ");
    return numberProblem({
      prompt: t(
        `The function $f(x_1, \\dots, x_{${n}})$ equals 1 exactly when at least ${k} of its variables equal 1. On how many inputs does it equal 1?`,
        `函数 $f(x_1, \\dots, x_{${n}})$ 恰好在至少 ${k} 个变量取 1 时取值为 1。它在多少个输入上取值为 1？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n, k), 2 ** n - answer, 2 ** (n - k)],
      solution: t(
        `Add over the number of ones an input can have: $${terms} = ${answer}$.`,
        `按输入中一的个数相加：$${terms} = ${answer}$。`,
      ),
    });
  },
};

const gateDepth: KnowledgePointDef = {
  id: "the-depth-of-a-tree-of-gates",
  title: t("The depth of a tree of gates", "门电路树的深度"),
  explanation: t(
    "Combining many inputs with two-input gates takes one gate fewer than the number of inputs, however they are arranged. The arrangement decides the delay, which is the number of gates on the longest path. Each level can at most double the number of inputs covered, so the best depth is a rounded-up base-two logarithm.",
    "用两输入门合并多个输入，无论怎样安排，所需的门都比输入少一个。安排方式决定的是延迟，也就是最长路径上门的个数。每一层最多使覆盖的输入翻倍，所以最优深度是向上取整的以二为底的对数。",
  ),
  generate(rng) {
    const n = rng.int(5, 200);
    const answer = Math.ceil(Math.log2(n));
    return numberProblem({
      prompt: t(
        `An AND of ${n} inputs is built from two-input AND gates. What is the smallest possible number of gates on the longest path from an input to the output?`,
        `用两输入与门构造 ${n} 个输入的与。从输入到输出的最长路径上，门的个数最少是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [n - 1, answer - 1, Math.ceil(n / 2)],
      solution: t(
        `A tree with $k$ levels has at most $2^k$ inputs. Since $2^{${answer - 1}} = ${2 ** (answer - 1)}$ is too few and $2^{${answer}} = ${2 ** answer}$ is enough, the answer is ${answer}.`,
        `$k$ 层的树最多有 $2^k$ 个输入。由于 $2^{${answer - 1}} = ${2 ** (answer - 1)}$ 不够，而 $2^{${answer}} = ${2 ** answer}$ 足够，答案是 ${answer}。`,
      ),
    });
  },
};

const twosComplement: KnowledgePointDef = {
  id: "reading-twos-complement",
  title: t("Reading two's complement", "读二进制补码"),
  explanation: t(
    "Computers subtract by adding negative numbers written in two's complement. In this code the leading bit of an eight-bit pattern has the weight $-128$ instead of $128$, while all the other bits keep their usual weights. So a pattern that starts with one stands for a negative number, found by adding up the weights.",
    "计算机通过加上用补码表示的负数来做减法。在这种编码中，八位模式的最高位权重是 $-128$ 而不是 $128$，其余各位的权重不变。所以以一开头的模式表示负数，把各位权重相加就能得到它的值。",
  ),
  generate(rng) {
    const v = rng.int(128, 255);
    const bits = v.toString(2);
    const rest = v - 128;
    const answer = v - 256;
    return numberProblem({
      prompt: t(
        `The 8-bit pattern $${bits}$ is an integer in two's complement. What is its value?`,
        `8 位模式 $${bits}$ 是用补码表示的整数。它的值是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [v, 128 - v, v - 255],
      solution: t(
        `The leading bit has weight $-128$, and the remaining bits make ${rest}. So the value is $-128 + ${rest} = ${answer}$.`,
        `最高位的权重是 $-128$，其余各位合起来是 ${rest}。所以值是 $-128 + ${rest} = ${answer}$。`,
      ),
    });
  },
};

const binaryPeriod: KnowledgePointDef = {
  id: "the-period-of-a-binary-fraction",
  title: t("The period of a binary fraction", "二进制小数的周期"),
  explanation: t(
    "A fraction with an odd denominator $q$ has a binary expansion that repeats from the first digit. The length of the repeating block is the smallest $k$ for which $2^k$ leaves remainder one on division by $q$. The numerator does not matter as long as the fraction is in lowest terms and below one.",
    "分母 $q$ 为奇数的分数，其二进制展开从第一位起就循环。循环节的长度是使 $2^k$ 除以 $q$ 余一的最小 $k$。只要分数是最简的且小于一，分子就不起作用。",
  ),
  generate(rng) {
    const q = rng.pick(
      range(1, 49)
        .map((i) => 2 * i + 1)
        .filter((n) => powersMod(2, n).length <= 12),
    );
    const p = rng.pick(range(1, q - 1).filter((i) => gcd(i, q) === 1));
    const powers = powersMod(2, q);
    const answer = powers.length;
    const list = powers.join(", ");
    return numberProblem({
      prompt: t(
        `How long is the repeating block in the binary expansion of $\\frac{${p}}{${q}}$?`,
        `$\\frac{${p}}{${q}}$ 的二进制展开中，循环节有多长？`,
      ),
      answer,
      form: "integer",
      wrong: [q - 1, totient(q), answer + 1],
      solution: t(
        `The powers $2^1, 2^2, \\dots$ leave the remainders ${list} on division by ${q}. The first remainder of 1 is at the power ${answer}, so the block has length ${answer}.`,
        `幂 $2^1, 2^2, \\dots$ 除以 ${q} 的余数依次是 ${list}。第一个余 1 的是第 ${answer} 次幂，所以循环节长度是 ${answer}。`,
      ),
    });
  },
};

const bitsOfAHexNumber: KnowledgePointDef = {
  id: "the-number-of-bits-of-a-hexadecimal-integer",
  title: t("The number of bits of a hexadecimal integer", "十六进制整数的位数"),
  explanation: t(
    "Each hexadecimal digit stands for exactly four bits, so converting between the two bases never needs arithmetic. The one exception is the leading digit. It may start with zeros in its four bits, and these are not written. So only the leading digit needs thought when counting the bits of the number.",
    "每个十六进制数字恰好对应四个二进制位，所以这两种进制之间的转换不需要计算。唯一的例外是最高位的数字。它的四位可能以零开头，而这些零不写出来。所以数二进制位数时，只有最高位数字需要留意。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const lead = rng.int(1, 15);
    const tail = range(1, k - 1)
      .map(() => rng.int(0, 15).toString(16).toUpperCase())
      .join("");
    const hex = `${lead.toString(16).toUpperCase()}${tail}`;
    const leadBits = lead.toString(2);
    const answer = 4 * (k - 1) + leadBits.length;
    return numberProblem({
      prompt: t(
        `How many bits does $${hex}_{16}$ have when written in binary without leading zeros?`,
        `$${hex}_{16}$ 写成不带前导零的二进制时有多少位？`,
      ),
      answer,
      form: "integer",
      wrong: [4 * k, 4 * (k - 1), k],
      solution: t(
        `${k === 2 ? "The digit after the first gives" : `The ${k - 1} digits after the first give`} $${4 * (k - 1)}$ bits. The first digit is $${leadBits}$ in binary, which adds ${leadBits.length}, for a total of ${answer}.`,
        `第一位之后的 ${k - 1} 个数字给出 $${4 * (k - 1)}$ 位。第一位数字的二进制是 $${leadBits}$，再加 ${leadBits.length} 位，共 ${answer} 位。`,
      ),
    });
  },
};

const digitSumRemainder: KnowledgePointDef = {
  id: "remainders-from-the-digit-sum-in-base-b",
  title: t("Remainders from the digit sum in base b", "由数字和求 b 进制数的余数"),
  explanation: t(
    "The rule that a number and its digit sum have the same remainder on division by nine works in every base. In base $b$, each power of $b$ leaves remainder one on division by $b - 1$. So each digit counts as itself, and the remainder can be found without converting the number to decimal.",
    "一个数与其数字和除以九的余数相同，这条规则在任何进制中都成立。在 $b$ 进制中，$b$ 的每个幂除以 $b - 1$ 都余一。所以每个数字都只算它本身，不必把数转换成十进制就能求出余数。",
  ),
  generate(rng) {
    const b = rng.int(5, 9);
    const first = rng.int(1, b - 1);
    const others = [rng.int(0, b - 1), rng.int(0, b - 1), rng.int(0, b - 1)];
    const digits = [first, ...others];
    const sum = digits.reduce((s, x) => s + x, 0);
    const answer = sum % (b - 1);
    const last = others[2] as number;
    return numberProblem({
      prompt: t(
        `What is the remainder when $${digits.join("")}_{${b}}$ is divided by ${b - 1}?`,
        `$${digits.join("")}_{${b}}$ 除以 ${b - 1} 的余数是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [sum, last % (b - 1), (sum + 1) % (b - 1)],
      solution: t(
        `Each power of ${b} leaves remainder 1 on division by ${b - 1}, so only the digit sum matters. It is $${digits.join(" + ")} = ${sum}$, which leaves remainder ${answer}.`,
        `${b} 的每个幂除以 ${b - 1} 都余 1，所以只看数字和。它是 $${digits.join(" + ")} = ${sum}$，余数是 ${answer}。`,
      ),
    });
  },
};

const fermatTest: KnowledgePointDef = {
  id: "the-fermat-primality-test",
  title: t("The Fermat primality test", "费马素性检验"),
  explanation: t(
    "Fermat's little theorem says that $a^{n-1}$ leaves remainder one on division by a prime $n$, when $a$ is not a multiple of it. So a different remainder proves that $n$ is composite, even though no factor has been found. Repeated squaring makes the power quick to compute, even for very large numbers.",
    "费马小定理说，当 $n$ 是素数且 $a$ 不是它的倍数时，$a^{n-1}$ 除以 $n$ 余一。所以余数不是一就证明了 $n$ 是合数，尽管并没有找到因子。反复平方使这个幂很快就能算出，即使数非常大也是如此。",
  ),
  generate(rng) {
    const composites = range(4, 49)
      .map((i) => 2 * i + 1)
      .filter((n) => range(2, n - 1).some((i) => n % i === 0));
    const [a, n] = rng.pick(
      [2, 3, 5, 7].flatMap((a) => composites.filter((n) => gcd(a, n) === 1 && powMod(a, n - 1, n) !== 1).map((n) => [a, n] as const)),
    );
    const e = n - 1;
    const answer = powMod(a, e, n);
    const squares: string[] = [];
    for (let j = 2; j <= e; j *= 2) squares.push(`${a}^{${j}} \\equiv ${powMod(a, j, n)}`);
    const parts = range(0, 7)
      .map((i) => 2 ** i)
      .filter((v) => (e & v) !== 0)
      .reverse();
    const split = parts.length > 1 ? `$${e} = ${parts.join(" + ")}$` : "";
    return numberProblem({
      prompt: t(
        `To test whether ${n} is prime with the base ${a}, find the remainder of $${a}^{${e}}$ on division by ${n}.`,
        `用底 ${a} 检验 ${n} 是否为素数：求 $${a}^{${e}}$ 除以 ${n} 的余数。`,
      ),
      answer,
      form: "integer",
      wrong: [1, n - 1, (answer * a) % n],
      solution: t(
        `Squaring gives $${squares.join(", \\quad ")}$. ${split ? `Using ${split}, the product is ${answer}.` : `So the remainder is ${answer}.`} This is not 1, so ${n} is composite.`,
        `反复平方得 $${squares.join(", \\quad ")}$。${split ? `由 ${split}，乘积是 ${answer}。` : `所以余数是 ${answer}。`}它不是 1，所以 ${n} 是合数。`,
      ),
    });
  },
};

const coprimeInARange: KnowledgePointDef = {
  id: "counting-coprime-integers-in-a-range",
  title: t("Counting coprime integers in a range", "数区间内的互素整数"),
  explanation: t(
    "Whether an integer is coprime to $n$ depends only on its remainder on division by $n$. So the pattern of coprime integers repeats with period $n$, with exactly $\\varphi(n)$ of them in each block. A range made of whole blocks therefore contains a multiple of $\\varphi(n)$, and this is not the totient of the range's end.",
    "一个整数是否与 $n$ 互素，只取决于它除以 $n$ 的余数。所以互素整数的分布以 $n$ 为周期重复，每一段恰有 $\\varphi(n)$ 个。因此由完整的若干段组成的区间，其个数是 $\\varphi(n)$ 的倍数，这并不是区间端点的欧拉函数值。",
  ),
  generate(rng) {
    const n = rng.pick(range(6, 60).filter((v) => totient(v) < v - 1));
    const m = rng.int(2, 9);
    const N = n * m;
    const phi = totient(n);
    const answer = m * phi;
    return numberProblem({
      prompt: t(`How many of the integers from 1 to ${N} are coprime to ${n}?`, `从 1 到 ${N} 的整数中，有多少个与 ${n} 互素？`),
      answer,
      form: "integer",
      wrong: [phi, N - answer, answer + m],
      solution: t(
        `The range splits into ${m} blocks of length ${n}, and each holds $\\varphi(${n}) = ${phi}$ integers coprime to ${n}. That makes $${m} \\cdot ${phi} = ${answer}$.`,
        `这个区间分成 ${m} 段，每段长 ${n}，每段有 $\\varphi(${n}) = ${phi}$ 个与 ${n} 互素的整数。所以共有 $${m} \\cdot ${phi} = ${answer}$ 个。`,
      ),
    });
  },
};

const orderModN: KnowledgePointDef = {
  id: "the-order-of-a-number-modulo-n",
  title: t("The order of a number modulo n", "数模 n 的阶"),
  explanation: t(
    "Euler's theorem guarantees that $a^{\\varphi(n)}$ leaves remainder one, but a smaller power may already do so. The smallest such positive exponent is called the order of $a$ modulo $n$, and it always divides $\\varphi(n)$. Knowing the order is what lets you reduce an exponent as far as it can possibly go.",
    "欧拉定理保证 $a^{\\varphi(n)}$ 余一，但更小的幂可能已经余一。满足这一点的最小正指数叫作 $a$ 模 $n$ 的阶，它总是整除 $\\varphi(n)$。知道了阶，才能把指数化简到最小。",
  ),
  generate(rng) {
    const n = rng.int(7, 25);
    const a = rng.pick(range(2, n - 2).filter((i) => gcd(i, n) === 1));
    const powers = powersMod(a, n);
    const answer = powers.length;
    return numberProblem({
      prompt: t(
        `What is the smallest positive integer $k$ for which $${a}^k$ leaves remainder 1 on division by ${n}?`,
        `使 $${a}^k$ 除以 ${n} 余 1 的最小正整数 $k$ 是多少？`,
      ),
      answer,
      solveFor: "k",
      wrong: [totient(n), n - 1, 2 * answer],
      solution: t(
        `The powers of ${a} leave the remainders ${powers.join(", ")}. The remainder 1 first appears at the power ${answer}, and ${answer} divides $\\varphi(${n}) = ${totient(n)}$.`,
        `${a} 的幂的余数依次是 ${powers.join(", ")}。余数 1 第一次出现在第 ${answer} 次幂，并且 ${answer} 整除 $\\varphi(${n}) = ${totient(n)}$。`,
      ),
    });
  },
};

const linearCipherKeys: KnowledgePointDef = {
  id: "counting-keys-of-a-linear-cipher",
  title: t("Counting keys of a linear cipher", "线性密码的密钥个数"),
  explanation: t(
    "A linear cipher $E(x) = ax + b$ can only be decrypted if $a$ has an inverse modulo the alphabet size $m$, which requires $a$ to be coprime to $m$. The shift $b$ may be anything. So the number of keys is $m\\varphi(m)$, and for a small alphabet the cipher can be broken simply by trying them all.",
    "线性密码 $E(x) = ax + b$ 要能解密，$a$ 必须在模字母表大小 $m$ 下有逆元，这要求 $a$ 与 $m$ 互素。平移量 $b$ 可以任取。所以密钥个数是 $m\\varphi(m)$，字母表较小时，只要逐个尝试就能破解。",
  ),
  generate(rng) {
    const m = rng.int(10, 50);
    const phi = totient(m);
    const answer = m * phi;
    return numberProblem({
      prompt: t(
        `How many keys $(a, b)$ does the linear cipher $E(x) = ax + b$ have on an alphabet of ${m} symbols, if every key must allow decryption?`,
        `在 ${m} 个符号的字母表上，线性密码 $E(x) = ax + b$ 有多少个密钥 $(a, b)$？要求每个密钥都能解密。`,
      ),
      answer,
      form: "integer",
      wrong: [m * m, m * (m - 1), phi],
      solution: t(
        `The multiplier must be coprime to ${m}, which allows $\\varphi(${m}) = ${phi}$ values, and the shift has ${m} values. That makes $${phi} \\cdot ${m} = ${answer}$ keys.`,
        `乘数必须与 ${m} 互素，有 $\\varphi(${m}) = ${phi}$ 种取法，平移量有 ${m} 种取法。所以有 $${phi} \\cdot ${m} = ${answer}$ 个密钥。`,
      ),
    });
  },
};

const discreteLog: KnowledgePointDef = {
  id: "recovering-a-private-exponent-by-search",
  title: t("Recovering a private exponent by search", "通过搜索恢复私有指数"),
  explanation: t(
    "An eavesdropper on the Diffie–Hellman protocol sees the prime, the base and the public values. Finding a private exponent from these is the discrete logarithm problem. With a small prime, one can simply list powers of the base until the public value appears. The protocol is secure only because this search is hopeless for a huge prime.",
    "窃听迪菲–赫尔曼协议的人能看到素数、底和公开值。由这些求私有指数，就是离散对数问题。素数很小时，只要依次列出底的幂，直到公开值出现。这个协议之所以安全，只是因为素数巨大时这种搜索毫无希望。",
  ),
  generate(rng) {
    const options = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43].flatMap((p) =>
      range(2, p - 2).flatMap((g) => {
        const order = powersMod(g, p).length;
        return range(2, Math.min(7, order - 1)).map((x) => [p, g, x] as const);
      }),
    );
    const [p, g, x] = rng.pick(options);
    const A = powMod(g, x, p);
    const list = range(2, x)
      .map((j) => `${g}^{${j}} \\equiv ${powMod(g, j, p)}`)
      .join(", \\quad ");
    return numberProblem({
      prompt: t(
        `In the Diffie–Hellman protocol with prime ${p} and base ${g}, the public value is ${A}. Find the smallest positive private exponent that gives this value.`,
        `在素数为 ${p}、底为 ${g} 的迪菲–赫尔曼协议中，公开值是 ${A}。求给出这个值的最小正私有指数。`,
      ),
      answer: x,
      form: "integer",
      wrong: [x + 1, p - 1 - x, A],
      solution: t(
        `List the powers modulo ${p}: $${list}$. The value ${A} first appears at the exponent ${x}.`,
        `列出模 ${p} 的幂：$${list}$。值 ${A} 第一次出现在指数 ${x} 处。`,
      ),
    });
  },
};

const rsaFactorFromTotient: KnowledgePointDef = {
  id: "factoring-an-rsa-modulus-from-its-totient",
  title: t("Factoring an RSA modulus from its totient", "由欧拉函数值分解 RSA 模数"),
  explanation: t(
    "For $n = pq$, we have $\\varphi(n) = n - (p + q) + 1$. So anyone who learns $\\varphi(n)$ also learns the sum $p + q$, and the primes are then the two roots of a quadratic with a known sum and product. Keeping $\\varphi(n)$ secret is therefore just as important as keeping the primes secret.",
    "对 $n = pq$，有 $\\varphi(n) = n - (p + q) + 1$。所以知道 $\\varphi(n)$ 的人也就知道了和 $p + q$，而这两个素数就是已知和与积的二次方程的两根。因此 $\\varphi(n)$ 的保密与素数本身的保密同样重要。",
  ),
  generate(rng) {
    const primes = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const p = rng.pick(primes.slice(0, -1));
    const q = rng.pick(primes.filter((v) => v > p));
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const sum = p + q;
    return numberProblem({
      prompt: t(
        `An RSA modulus $n = ${n}$ is a product of two primes, and $\\varphi(n) = ${phi}$. Find the larger prime.`,
        `RSA 模数 $n = ${n}$ 是两个素数之积，$\\varphi(n) = ${phi}$。求较大的素数。`,
      ),
      answer: q,
      form: "integer",
      wrong: [p, sum, n - phi],
      solution: t(
        `The sum of the primes is $${n} - ${phi} + 1 = ${sum}$. They are the roots of $${poly([1, "x^2"], [-sum, "x"], [n, ""])} = 0$, namely ${p} and ${q}.`,
        `两个素数之和是 $${n} - ${phi} + 1 = ${sum}$。它们是 $${poly([1, "x^2"], [-sum, "x"], [n, ""])} = 0$ 的两根，即 ${p} 和 ${q}。`,
      ),
    });
  },
};

const firstOrderLimit: KnowledgePointDef = {
  id: "the-limit-of-a-first-order-recurrence",
  title: t("The limit of a first-order recurrence", "一阶递推的极限"),
  explanation: t(
    "The recurrence $a_{n+1} = ra_n + c$ has the fixed point $L$ with $L = rL + c$. The distance from $L$ is multiplied by $r$ at each step, so if $|r| < 1$ the sequence tends to $L$, whatever the starting value is. The limit can thus be found without solving for the general term.",
    "递推 $a_{n+1} = ra_n + c$ 有不动点 $L$，满足 $L = rL + c$。每一步到 $L$ 的距离都乘以 $r$，所以当 $|r| < 1$ 时，无论初始值是多少，数列都趋于 $L$。因此不必求出通项就能得到极限。",
  ),
  generate(rng) {
    const r = rng.pick([
      Q.of(1, 2),
      Q.of(-1, 2),
      Q.of(1, 3),
      Q.of(-1, 3),
      Q.of(1, 4),
      Q.of(-1, 4),
      Q.of(2, 3),
      Q.of(-2, 3),
      Q.of(3, 4),
      Q.of(-3, 4),
    ]);
    const c = rng.pick(range(-12, 12).filter((v) => v !== 0));
    const start = rng.int(1, 9);
    const gap = Q.of(1).sub(r);
    const answer = Q.of(c).div(gap);
    const step = `${r.toLatex()}a_n ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = ${start}$ and $a_{n+1} = ${step}$. Find $\\lim_{n \\to \\infty} a_n$.`,
        `数列满足 $a_0 = ${start}$，$a_{n+1} = ${step}$。求 $\\lim_{n \\to \\infty} a_n$。`,
      ),
      answer,
      wrong: [Q.of(c).div(Q.of(1).add(r)), Q.of(c), Q.of(c).mul(r)],
      solution: t(
        `The ratio has size below 1, so the sequence tends to the fixed point. From $L = ${r.toLatex()}L ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ we get $${gap.toLatex()}L = ${c}$, so $L = ${answer.toLatex()}$. The starting value does not matter.`,
        `比值的绝对值小于 1，所以数列趋于不动点。由 $L = ${r.toLatex()}L ${c < 0 ? "-" : "+"} ${Math.abs(c)}$ 得 $${gap.toLatex()}L = ${c}$，所以 $L = ${answer.toLatex()}$。初始值不起作用。`,
      ),
    });
  },
};

const recurrenceFromRoots: KnowledgePointDef = {
  id: "a-recurrence-from-its-solutions",
  title: t("A recurrence from its solutions", "由解求递推关系"),
  explanation: t(
    "The solutions $Ar^n + Bs^n$ tell you the characteristic roots, so the recurrence can be rebuilt from them. The characteristic equation of $a_{n+2} = pa_{n+1} + qa_n$ is $x^2 - px - q = 0$. Comparing it with $(x - r)(x - s) = 0$ gives $p$ as the sum of the roots and $q$ as minus their product.",
    "解 $Ar^n + Bs^n$ 给出了特征根，所以可以由它们还原递推关系。$a_{n+2} = pa_{n+1} + qa_n$ 的特征方程是 $x^2 - px - q = 0$。与 $(x - r)(x - s) = 0$ 比较，得 $p$ 是两根之和，$q$ 是两根之积的相反数。",
  ),
  generate(rng) {
    const pool = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
    const r = rng.pick(pool);
    const s = rng.pick(pool.filter((v) => v !== r));
    const asksP = rng.pick([true, false]);
    const name = asksP ? "p" : "q";
    const answer = asksP ? r + s : -r * s;
    return numberProblem({
      prompt: t(
        `Every sequence $a_n = A \\cdot ${inParens(r)}^n + B \\cdot ${inParens(s)}^n$ satisfies $a_{n+2} = pa_{n+1} + qa_n$. Find $${name}$.`,
        `每个数列 $a_n = A \\cdot ${inParens(r)}^n + B \\cdot ${inParens(s)}^n$ 都满足 $a_{n+2} = pa_{n+1} + qa_n$。求 $${name}$。`,
      ),
      answer,
      solveFor: name,
      wrong: asksP ? [-(r + s), r * s, -r * s] : [r * s, r + s, -(r + s)],
      solution: t(
        `The roots $${r}$ and $${s}$ give the characteristic equation $${poly([1, "x^2"], [-(r + s), "x"], [r * s, ""])} = 0$. Comparing it with $x^2 - px - q = 0$ gives $${name} = ${answer}$.`,
        `根 $${r}$ 和 $${s}$ 给出特征方程 $${poly([1, "x^2"], [-(r + s), "x"], [r * s, ""])} = 0$。与 $x^2 - px - q = 0$ 比较，得 $${name} = ${answer}$。`,
      ),
    });
  },
};

const parameterForRepeatedRoot: KnowledgePointDef = {
  id: "the-coefficient-that-makes-a-root-repeated",
  title: t("The coefficient that makes a root repeated", "使特征根重复的系数"),
  explanation: t(
    "The form of the solution of a second-order recurrence depends on the discriminant of its characteristic equation. Positive gives two real roots, negative gives complex roots, and zero gives a repeated root, where the solution changes to $(A + Bn)r^n$. Setting the discriminant to zero finds the coefficient at this boundary between the other two cases.",
    "二阶递推的解的形式取决于特征方程的判别式。为正时有两个实根，为负时有复根，为零时有重根，此时解变为 $(A + Bn)r^n$。令判别式为零，就求出了处于另外两种情形分界处的系数。",
  ),
  generate(rng) {
    const p = rng.pick(range(-15, 15).filter((v) => v !== 0));
    const answer = Q.of(-p * p, 4);
    const root = Q.of(p, 2);
    return numberProblem({
      prompt: t(
        `For which $k$ does the recurrence $a_{n+2} = ${poly([p, "a_{n+1}"])} + ka_n$ have a repeated characteristic root?`,
        `$k$ 取何值时，递推 $a_{n+2} = ${poly([p, "a_{n+1}"])} + ka_n$ 有重特征根？`,
      ),
      answer,
      solveFor: "k",
      wrong: [Q.of(p * p, 4), Q.of(-p * p, 2), Q.of(-p, 2)],
      solution: t(
        `The characteristic equation is $${poly([1, "x^2"], [-p, "x"])} - k = 0$, with discriminant $${inParens(p)}^2 + 4k$. Setting this to zero gives $k = ${answer.toLatex()}$, and the repeated root is $${root.toLatex()}$.`,
        `特征方程是 $${poly([1, "x^2"], [-p, "x"])} - k = 0$，判别式是 $${inParens(p)}^2 + 4k$。令它为零，得 $k = ${answer.toLatex()}$，重根是 $${root.toLatex()}$。`,
      ),
    });
  },
};

const periodicRecurrence: KnowledgePointDef = {
  id: "far-terms-of-a-periodic-recurrence",
  title: t("Far terms of a periodic recurrence", "周期递推的远项"),
  explanation: t(
    "When the characteristic roots are complex with modulus one, the powers of the roots just turn around the unit circle. If the angle is a simple fraction of a full turn, the sequence repeats exactly. So a term with a large index can be found by writing out one period and reducing the index by the length of the period.",
    "特征根是模为一的复数时，根的幂只是在单位圆上旋转。如果角度是整圈的简单分数，数列就严格重复。所以求下标很大的项时，只要写出一个周期，再按周期长度化简下标。",
  ),
  generate(rng) {
    const p = rng.pick([0, 1, -1]);
    const period = p === 0 ? 4 : p === 1 ? 6 : 3;
    const pool = range(-9, 9).filter((v) => v !== 0);
    const a0 = rng.pick(pool);
    const a1 = rng.pick(pool.filter((v) => v !== a0));
    const terms = [a0, a1];
    for (let i = 2; i < period; i++) terms.push(p * (terms[i - 1] as number) - (terms[i - 2] as number));
    const rem = rng.int(2, period - 1);
    const N = period * rng.int(5, 40) + rem;
    const answer = terms[rem] as number;
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = ${a0}$, $a_1 = ${a1}$ and $a_{n+2} = ${poly([p, "a_{n+1}"], [-1, "a_n"])}$. Find $a_{${N}}$.`,
        `数列满足 $a_0 = ${a0}$，$a_1 = ${a1}$，$a_{n+2} = ${poly([p, "a_{n+1}"], [-1, "a_n"])}$。求 $a_{${N}}$。`,
      ),
      answer,
      form: "integer",
      wrong: [a0, a1, -answer, a0 + a1],
      solution: t(
        `The terms run $${terms.join(", ")}$ and then repeat, since the next two are again $${a0}$ and $${a1}$. The period is ${period}, and ${N} leaves remainder ${rem}, so $a_{${N}} = a_{${rem}} = ${answer}$.`,
        `各项依次是 $${terms.join(", ")}$，然后重复，因为接下来两项又是 $${a0}$ 和 $${a1}$。周期是 ${period}，${N} 除以 ${period} 余 ${rem}，所以 $a_{${N}} = a_{${rem}} = ${answer}$。`,
      ),
    });
  },
};

const productOfFiniteSums: KnowledgePointDef = {
  id: "coefficients-of-a-product-of-finite-sums",
  title: t("Coefficients of a product of finite sums", "有限和之积的系数"),
  explanation: t(
    "A generating function turns counting into multiplication. In a product of two finite sums, each way of making the power $x^m$ picks one exponent from each factor, with the exponents adding to $m$. So the coefficient counts the pairs of allowed exponents with that sum, which is how limits on choices enter a counting problem.",
    "生成函数把计数变成乘法。在两个有限和的乘积中，得到幂 $x^m$ 的每种方式都是从每个因子选一个指数，使指数之和为 $m$。所以系数就是和为该值的可选指数对的个数，选择上的限制正是这样进入计数问题的。",
  ),
  generate(rng) {
    const a = rng.int(3, 8);
    const b = rng.int(3, 8);
    const m = rng.int(2, a + b - 1);
    const low = Math.max(0, m - b);
    const high = Math.min(a, m);
    const answer = high - low + 1;
    const sum = (top: number) => `(1 + x + \\dots + x^{${top}})`;
    return numberProblem({
      prompt: t(`Find the coefficient of $x^{${m}}$ in $${sum(a)}${sum(b)}$.`, `求 $${sum(a)}${sum(b)}$ 中 $x^{${m}}$ 的系数。`),
      answer,
      form: "integer",
      wrong: [m + 1, Math.min(a, b) + 1, a + b - m + 2],
      solution: t(
        `Count pairs $i + j = ${m}$ with $i \\le ${a}$ and $j \\le ${b}$. The first exponent can run from ${low} to ${high}, which gives ${answer} pairs.`,
        `数满足 $i + j = ${m}$、$i \\le ${a}$、$j \\le ${b}$ 的数对。第一个指数可以从 ${low} 取到 ${high}，共 ${answer} 对。`,
      ),
    });
  },
};

const seriesFromGeneratingFunction: KnowledgePointDef = {
  id: "summing-a-recursive-series-with-its-generating-function",
  title: t("Summing a recursive series with its generating function", "用生成函数求递推级数的和"),
  explanation: t(
    "The generating function $G(x) = \\sum a_nx^n$ of a recurrence is a rational function. Evaluating it at a point inside its radius of convergence gives the sum of an infinite series. So a sum like $\\sum \\frac{a_n}{k^n}$ needs no formula for the terms at all: just put $x = \\frac{1}{k}$ into the rational function.",
    "递推的生成函数 $G(x) = \\sum a_nx^n$ 是有理函数。在收敛半径内的一点取值，就得到一个无穷级数的和。所以像 $\\sum \\frac{a_n}{k^n}$ 这样的和完全不需要通项公式：只要把 $x = \\frac{1}{k}$ 代入这个有理函数。",
  ),
  generate(rng) {
    const p = rng.int(1, 3);
    const q = rng.int(1, 3);
    const a0 = rng.int(0, 3);
    const a1 = rng.int(1, 4);
    const k = p + q + rng.int(1, 4);
    const lin = a1 - p * a0;
    const top = a0 * k * k + lin * k;
    const bottom = k * k - p * k - q;
    const answer = Q.of(top, bottom);
    const raw = `\\frac{${top}}{${bottom}}`;
    const value = raw === answer.toLatex() ? raw : `${raw} = ${answer.toLatex()}`;
    const numerator = poly([a0, ""], [lin, "x"]);
    const denominator = poly([1, ""], [-p, "x"], [-q, "x^2"]);
    return numberProblem({
      prompt: t(
        `A sequence has $a_0 = ${a0}$, $a_1 = ${a1}$ and $a_{n+2} = ${poly([p, "a_{n+1}"], [q, "a_n"])}$. Find $\\sum_{n=0}^{\\infty} \\frac{a_n}{${k}^n}$.`,
        `数列满足 $a_0 = ${a0}$，$a_1 = ${a1}$，$a_{n+2} = ${poly([p, "a_{n+1}"], [q, "a_n"])}$。求 $\\sum_{n=0}^{\\infty} \\frac{a_n}{${k}^n}$。`,
      ),
      answer,
      wrong: [Q.of(top, k * k + p * k + q), Q.of(a0 * k + a1, k), Q.of(top, k * k - p * k + q)],
      solution: t(
        `The generating function is $G(x) = \\frac{${numerator}}{${denominator}}$. Putting $x = \\frac{1}{${k}}$ and multiplying top and bottom by $${k * k}$ gives $${value}$.`,
        `生成函数是 $G(x) = \\frac{${numerator}}{${denominator}}$。代入 $x = \\frac{1}{${k}}$，分子分母同乘 $${k * k}$，得 $${value}$。`,
      ),
    });
  },
};

const facesOfARegularPlanarGraph: KnowledgePointDef = {
  id: "faces-of-a-regular-planar-graph",
  title: t("Faces of a regular planar graph", "正则平面图的面数"),
  explanation: t(
    "Euler's formula $V - E + F = 2$ needs the number of edges, and for a regular graph the handshaking lemma supplies it: the degrees add up to twice the edges. Combining the two facts gives the number of faces from the number of vertices and the common degree alone, without ever drawing the graph.",
    "欧拉公式 $V - E + F = 2$ 需要边数，而对正则图，握手引理正好给出它：度数之和等于边数的两倍。把这两个事实结合起来，只由顶点数和公共的度数就能得到面数，完全不必画出这个图。",
  ),
  generate(rng) {
    const [k, V] = rng.pick([...range(2, 20).map((i) => [3, 2 * i] as const), ...range(3, 20).map((i) => [4, 2 * i] as const)]);
    const E = (k * V) / 2;
    const answer = 2 - V + E;
    return numberProblem({
      prompt: t(
        `A connected planar graph has ${V} vertices, each of degree ${k}. How many faces does a plane drawing of it have?`,
        `一个连通平面图有 ${V} 个顶点，每个顶点的度都是 ${k}。它的平面画法有多少个面？`,
      ),
      answer,
      form: "integer",
      wrong: [E, answer - 2, answer - 1],
      solution: t(
        `The handshaking lemma gives $E = \\frac{${k} \\cdot ${V}}{2} = ${E}$. Euler's formula then gives $F = 2 - ${V} + ${E} = ${answer}$.`,
        `由握手引理得 $E = \\frac{${k} \\cdot ${V}}{2} = ${E}$。再由欧拉公式得 $F = 2 - ${V} + ${E} = ${answer}$。`,
      ),
    });
  },
};

const mostBipartiteEdges: KnowledgePointDef = {
  id: "the-most-edges-of-a-bipartite-graph",
  title: t("The most edges of a bipartite graph", "二部图的最多边数"),
  explanation: t(
    "A bipartite graph with parts of sizes $a$ and $b$ has at most $ab$ edges, reached by the complete bipartite graph. For a fixed total $a + b = n$, the product is largest when the parts are as equal as possible. So a graph on $n$ vertices with no odd cycle has at most $\\lfloor \\frac{n^2}{4} \\rfloor$ edges.",
    "两部分大小为 $a$ 和 $b$ 的二部图最多有 $ab$ 条边，完全二部图达到这个值。总数 $a + b = n$ 固定时，两部分越接近相等，乘积越大。所以 $n$ 个顶点且没有奇圈的图最多有 $\\lfloor \\frac{n^2}{4} \\rfloor$ 条边。",
  ),
  generate(rng) {
    const n = rng.int(5, 44);
    const a = Math.floor(n / 2);
    const b = n - a;
    const answer = a * b;
    return numberProblem({
      prompt: t(
        `What is the largest possible number of edges of a bipartite graph with ${n} vertices?`,
        `${n} 个顶点的二部图最多有多少条边？`,
      ),
      answer,
      form: "integer",
      wrong: [(n * (n - 1)) / 2, n - 1, a * a],
      solution: t(
        `The product of the part sizes is largest for parts of sizes ${a} and ${b}. All edges between them are allowed, which makes $${a} \\cdot ${b} = ${answer}$ edges.`,
        `两部分大小为 ${a} 和 ${b} 时乘积最大。它们之间的边都可以连，共 $${a} \\cdot ${b} = ${answer}$ 条边。`,
      ),
    });
  },
};

const treesWithAGivenVertexDegree: KnowledgePointDef = {
  id: "labeled-trees-where-one-vertex-has-a-given-degree",
  title: t("Labeled trees where one vertex has a given degree", "某顶点度数给定的标号树"),
  explanation: t(
    "A labeled tree on $n$ vertices corresponds to a Prüfer word of length $n - 2$, and a vertex appears in the word one time fewer than its degree. So fixing the degree of one vertex fixes how often its label occurs. Choose the positions for this label, and fill the remaining positions freely with the other labels.",
    "$n$ 个顶点的标号树对应长度为 $n - 2$ 的普吕弗序列，一个顶点在序列中出现的次数比它的度少一。所以确定一个顶点的度，就确定了它的标号出现的次数。选出这个标号的位置，其余位置用其他标号任意填写。",
  ),
  generate(rng) {
    const [n, d] = rng.pick(range(4, 9).flatMap((n) => range(1, n - 1).map((d) => [n, d] as const)));
    const places = binom(n - 2, d - 1);
    const rest = n - 1 - d;
    const answer = places * (n - 1) ** rest;
    const fill = rest === 0 ? "" : ` \\cdot ${pow(n - 1, rest)}`;
    const count = t(
      rest === 0
        ? "No other positions remain."
        : `The other ${rest === 1 ? "position takes" : `${rest} positions take`} any of ${n - 1} labels.`,
      rest === 0 ? "没有其他位置了。" : `其余 ${rest} 个位置可以取 ${n - 1} 个标号中的任一个。`,
    );
    return numberProblem({
      prompt: t(
        `How many labeled trees on the vertices $1, \\dots, ${n}$ have vertex 1 of degree ${d}?`,
        `顶点为 $1, \\dots, ${n}$ 的标号树中，有多少棵的顶点 1 的度是 ${d}？`,
      ),
      answer,
      form: "integer",
      wrong: [n ** (n - 2), places, (n - 1) ** rest * d],
      solution: t(
        `Vertex 1 appears ${d - 1} times in the Prüfer word of length ${n - 2}, in $\\binom{${n - 2}}{${d - 1}}$ ways. ${count.en} The total is $\\binom{${n - 2}}{${d - 1}}${fill} = ${answer}$.`,
        `顶点 1 在长度为 ${n - 2} 的普吕弗序列中出现 ${d - 1} 次，有 $\\binom{${n - 2}}{${d - 1}}$ 种方式。${count["zh-CN"]}总数是 $\\binom{${n - 2}}{${d - 1}}${fill} = ${answer}$。`,
      ),
    });
  },
};

const fourCycles: KnowledgePointDef = {
  id: "four-cycles-of-a-complete-bipartite-graph",
  title: t("Four-cycles of a complete bipartite graph", "完全二部图的四圈"),
  explanation: t(
    "A cycle in a bipartite graph alternates between the two parts, so its length is even and the shortest possible cycles have length four. A four-cycle uses two vertices from each part. In a complete bipartite graph, any such choice of vertices can be joined into exactly one four-cycle, so counting them reduces to choosing pairs.",
    "二部图中的圈在两部分之间交替，所以长度是偶数，最短的圈长度为四。四圈从每一部分各用两个顶点。在完全二部图中，这样选出的顶点恰好能连成一个四圈，所以计数就化为选取顶点对。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const n = rng.int(2, 9);
    const left = binom(m, 2);
    const right = binom(n, 2);
    const answer = left * right;
    return numberProblem({
      prompt: t(
        `How many cycles of length 4 does the complete bipartite graph $K_{${m},${n}}$ have?`,
        `完全二部图 $K_{${m},${n}}$ 有多少个长度为 4 的圈？`,
      ),
      answer,
      form: "integer",
      wrong: [m * n, left + right, 2 * answer],
      solution: t(
        `A 4-cycle is fixed by two vertices of each part. That gives $\\binom{${m}}{2}\\binom{${n}}{2} = ${left} \\cdot ${right} = ${answer}$ cycles.`,
        `4 圈由每一部分的两个顶点确定。所以共有 $\\binom{${m}}{2}\\binom{${n}}{2} = ${left} \\cdot ${right} = ${answer}$ 个圈。`,
      ),
    });
  },
};

const treeAfterANewEdge: KnowledgePointDef = {
  id: "updating-a-spanning-tree-after-a-new-edge",
  title: t("Updating a spanning tree after a new edge", "新增一条边后更新生成树"),
  explanation: t(
    "A new edge need not mean rerunning Kruskal's algorithm. Adding the edge to the minimum spanning tree creates exactly one cycle. By the cycle property, the heaviest edge on that cycle can be left out of a minimum spanning tree. So compare the new edge with the heaviest edge on the tree path between its ends, and keep the lighter.",
    "新增一条边不必重新运行克鲁斯卡尔算法。把这条边加入最小生成树，恰好产生一个圈。根据圈性质，圈上最重的边可以不在最小生成树中。所以把新边与其两端之间树路径上最重的边比较，保留较轻的那条。",
  ),
  generate(rng) {
    const a = rng.int(2, 20);
    const b = rng.int(2, 20);
    const c = rng.int(2, 20);
    const top = Math.max(a, b, c);
    const W = a + b + c + rng.int(5, 40);
    const w = rng.pick(range(1, 25).filter((v) => v !== top));
    const answer = w < top ? W - top + w : W;
    return numberProblem({
      prompt: t(
        `A minimum spanning tree has total weight ${W}. A new edge of weight ${w} joins vertices $u$ and $v$, and the tree path between them has edges of weights ${a}, ${b} and ${c}. What is the weight of a minimum spanning tree now?`,
        `最小生成树的总权重是 ${W}。一条权重为 ${w} 的新边连接顶点 $u$ 和 $v$，树中它们之间的路径上的边权重为 ${a}、${b} 和 ${c}。现在最小生成树的权重是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [W + w, W - top, W - Math.min(a, b, c) + w],
      solution: t(
        w < top
          ? `The new edge closes a cycle whose heaviest edge has weight ${top}. Since ${w} is lighter, it replaces that edge, which gives $${W} - ${top} + ${w} = ${answer}$.`
          : `The new edge closes a cycle, and at weight ${w} it is the heaviest edge on it. So the tree stays as it is, with weight ${answer}.`,
        w < top
          ? `新边形成一个圈，圈上其他边中最重的权重是 ${top}。由于 ${w} 更轻，它替换那条边，得 $${W} - ${top} + ${w} = ${answer}$。`
          : `新边形成一个圈，权重为 ${w} 的它是圈上最重的边。所以树不变，权重仍是 ${answer}。`,
      ),
    });
  },
};

const productAutomaton: KnowledgePointDef = {
  id: "the-states-of-a-product-automaton",
  title: t("The states of a product automaton", "乘积自动机的状态数"),
  explanation: t(
    "To check two conditions at once, a finite automaton runs one automaton for each condition side by side. A state of the combined machine is a pair of states, so the sizes multiply. When the two conditions track independent counts, every pair must be remembered separately, and no automaton with fewer states can do the job.",
    "要同时检查两个条件，有限自动机让对应每个条件的自动机并行运行。组合机器的状态是一对状态，所以状态数相乘。当两个条件跟踪的是相互独立的计数时，每一对都必须分别记住，状态更少的自动机无法胜任。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const answer = a * b;
    return numberProblem({
      prompt: t(
        `A DFA accepts exactly the binary strings in which the number of 0s is divisible by ${a} and the number of 1s is divisible by ${b}. What is the smallest possible number of states?`,
        `一个 DFA 恰好接受这样的二进制串：0 的个数能被 ${a} 整除，1 的个数能被 ${b} 整除。它最少有多少个状态？`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, a + b - 1, 2 ** Math.max(a, b)],
      solution: t(
        `The machine must remember the count of 0s modulo ${a} and the count of 1s modulo ${b}. Two different pairs can always be told apart by some continuation, so each needs its own state, and there are $${a} \\cdot ${b} = ${answer}$ pairs.`,
        `机器必须记住 0 的个数模 ${a} 和 1 的个数模 ${b}。两个不同的数对总能被某个后续串区分，所以每一对都需要自己的状态，共有 $${a} \\cdot ${b} = ${answer}$ 对。`,
      ),
    });
  },
};

const divideAndConquerExponent: KnowledgePointDef = {
  id: "the-exponent-of-a-divide-and-conquer-recurrence",
  title: t("The exponent of a divide-and-conquer recurrence", "分治递推的指数"),
  explanation: t(
    "For $T(n) = aT\\left(\\frac{n}{b}\\right) + n^c$, the amount of work per level changes by a factor of $\\frac{a}{b^c}$. If this is above one, the bottom level dominates and $T(n) = \\Theta(n^{\\log_b a})$. If it is below one, the top level dominates and $T(n) = \\Theta(n^c)$. So comparing $a$ with $b^c$ decides the growth.",
    "对 $T(n) = aT\\left(\\frac{n}{b}\\right) + n^c$，每层的工作量按因子 $\\frac{a}{b^c}$ 变化。这个因子大于一时，最底层占主导，$T(n) = \\Theta(n^{\\log_b a})$。小于一时，最顶层占主导，$T(n) = \\Theta(n^c)$。所以比较 $a$ 与 $b^c$ 就能决定增长速度。",
  ),
  generate(rng) {
    const bottom = range(2, 5).flatMap((b) => range(1, 4).flatMap((e) => range(0, e - 1).map((c) => [b ** e, b, c, e] as const)));
    const top = range(2, 5).flatMap((b) => range(1, 4).flatMap((c) => range(2, Math.min(9, b ** c - 1)).map((a) => [a, b, c, c] as const)));
    const [a, b, c, answer] = rng.pick([...bottom, ...top]);
    const work = c === 0 ? "1" : c === 1 ? "n" : `n^{${c}}`;
    const power = b ** c;
    const bigger = a > power;
    const threshold = c === 1 ? `${b}` : `${b}^{${c}} = ${power}`;
    return numberProblem({
      prompt: t(
        `Let $T(n) = ${a}T\\left(\\frac{n}{${b}}\\right) + ${work}$. Then $T(n) = \\Theta(n^k)$. Find $k$.`,
        `设 $T(n) = ${a}T\\left(\\frac{n}{${b}}\\right) + ${work}$。则 $T(n) = \\Theta(n^k)$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: bigger ? [c, a, answer + 1] : [Math.floor(Math.log(a) / Math.log(b)), a, answer + 1],
      solution: t(
        bigger
          ? `Here $${a} > ${threshold}$, so the bottom level dominates and $k = \\log_{${b}} ${a} = ${answer}$.`
          : `Here $${a} < ${threshold}$, so the top level dominates and $k$ is the exponent of the work term, ${answer}.`,
        bigger
          ? `这里 $${a} > ${threshold}$，所以最底层占主导，$k = \\log_{${b}} ${a} = ${answer}$。`
          : `这里 $${a} < ${threshold}$，所以最顶层占主导，$k$ 是工作量项的指数 ${answer}。`,
      ),
    });
  },
};

const pairsWithASum: KnowledgePointDef = {
  id: "the-pigeonhole-principle-with-pairs-of-numbers",
  title: t("The pigeonhole principle with pairs of numbers", "数对上的鸽巢原理"),
  explanation: t(
    "The pigeonhole principle only needs boxes, and the boxes need not be given. To force two chosen numbers to have a given sum, make each box a pair of numbers with that sum. A number with no partner forms a box of its own. One number from each box avoids the sum, and one more number forces it.",
    "鸽巢原理只需要盒子，而盒子不必是现成的。要迫使选出的两个数有给定的和，就让每个盒子是和为该值的一对数。没有配对的数自成一盒。每盒选一个数可以避开这个和，再多选一个就无法避开。",
  ),
  generate(rng) {
    const N = rng.int(8, 60);
    const boxes = Math.ceil(N / 2);
    const answer = boxes + 1;
    return numberProblem({
      prompt: t(
        `What is the smallest $k$ such that any $k$ different numbers from $1, 2, \\dots, ${N}$ must include two with sum ${N + 1}?`,
        `最小的 $k$ 是多少，使得从 $1, 2, \\dots, ${N}$ 中任取 $k$ 个不同的数，都必有两个数的和为 ${N + 1}？`,
      ),
      answer,
      solveFor: "k",
      wrong: [boxes, N - 1, boxes + 2],
      solution: t(
        N % 2 === 0
          ? `The numbers form ${boxes} pairs with sum ${N + 1}. Taking one from each pair avoids the sum, and one more number forces it, so $k = ${answer}$.`
          : `The numbers form ${boxes - 1} pairs with sum ${N + 1}, and the middle number ${boxes} has no partner, which makes ${boxes} boxes. One from each box avoids the sum, and one more number forces it, so $k = ${answer}$.`,
        N % 2 === 0
          ? `这些数组成 ${boxes} 对和为 ${N + 1} 的数。每对取一个可以避开这个和，再多取一个就无法避开，所以 $k = ${answer}$。`
          : `这些数组成 ${boxes - 1} 对和为 ${N + 1} 的数，中间的数 ${boxes} 没有配对，共 ${boxes} 个盒子。每盒取一个可以避开这个和，再多取一个就无法避开，所以 $k = ${answer}$。`,
      ),
    });
  },
};

const fixedPoints: KnowledgePointDef = {
  id: "permutations-with-exactly-k-fixed-points",
  title: t("Permutations with exactly k fixed points", "恰有 k 个不动点的排列"),
  explanation: t(
    "Inclusion-exclusion counts the derangements, the permutations that leave nothing in place: $D_m = m!\\sum_{j=0}^{m} \\frac{(-1)^j}{j!}$, which begins $1, 0, 1, 2, 9, 44, 265$. To leave exactly $k$ items in place, first choose those $k$ items. The remaining items must then form a derangement, and the two counts multiply.",
    "容斥原理可以数出错排，即没有任何元素留在原位的排列：$D_m = m!\\sum_{j=0}^{m} \\frac{(-1)^j}{j!}$，开头几项是 $1, 0, 1, 2, 9, 44, 265$。要恰好使 $k$ 个元素留在原位，先选出这 $k$ 个元素。其余元素必须构成错排，两个计数相乘。",
  ),
  generate(rng) {
    const [n, k] = rng.pick(range(4, 10).flatMap((n) => range(1, n - 2).map((k) => [n, k] as const)));
    const left = n - k;
    const d = derangements(left);
    const choose = binom(n, k);
    const answer = choose * d;
    const factorial = range(1, left).reduce((s, i) => s * i, 1);
    return numberProblem({
      prompt: t(
        `${n} letters are put into ${n} addressed envelopes, one per envelope. In how many ways do exactly ${k} letters reach the right envelope?`,
        `把 ${n} 封信放进 ${n} 个写好地址的信封，每个信封一封。恰好 ${k} 封信放对的方式有多少种？`,
      ),
      answer,
      form: "integer",
      wrong: [choose, choose * factorial, d],
      solution: t(
        `Choose the ${k} correct letters in $\\binom{${n}}{${k}} = ${choose}$ ways. The other ${left} must all be wrong, which is $D_{${left}} = ${d}$ ways. The total is $${choose} \\cdot ${d} = ${answer}$.`,
        `选出放对的 ${k} 封信有 $\\binom{${n}}{${k}} = ${choose}$ 种方式。其余 ${left} 封必须全放错，有 $D_{${left}} = ${d}$ 种方式。总数是 $${choose} \\cdot ${d} = ${answer}$。`,
      ),
    });
  },
};

/** deeperDiscreteMathematicsPoints gives, by topic id, the knowledge points added after a Discrete Mathematics topic's own. */
export const deeperDiscreteMathematicsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "boolean-functions": [functionsOfAGivenWeight],
  "self-dual-boolean-functions": [selfDualCompletions],
  "monotonic-boolean-functions": [thresholdWeight],
  "logic-gates-and-combinational-circuits": [gateDepth],
  "adding-and-subtracting-binary-integers": [twosComplement],
  "binary-fractions": [binaryPeriod],
  "converting-between-binary-and-hexadecimal-integers": [bitsOfAHexNumber],
  "integers-in-arbitrary-bases": [digitSumRemainder],
  "fermats-little-theorem": [fermatTest],
  "eulers-totient-function": [coprimeInARange],
  "eulers-theorem": [orderModN],
  "the-linear-cipher": [linearCipherKeys],
  "the-diffie-hellman-protocol": [discreteLog],
  "the-rsa-cryptosystem": [rsaFactorFromTotient],
  "the-inclusion-exclusion-principle": [fixedPoints],
  "the-pigeonhole-principle": [pairsWithASum],
  "first-order-recurrence-relations": [firstOrderLimit],
  "second-order-homogeneous-recurrence-relations-with-distinct-real-roots": [recurrenceFromRoots],
  "second-order-homogeneous-recurrence-relations-with-repeated-roots": [parameterForRepeatedRoot],
  "second-order-homogeneous-recurrence-relations-with-complex-roots": [periodicRecurrence],
  "generating-functions": [productOfFiniteSums],
  "generating-functions-of-homogeneous-recurrence-relations": [seriesFromGeneratingFunction],
  "planar-graphs": [facesOfARegularPlanarGraph],
  "complete-and-bipartite-graphs": [mostBipartiteEdges],
  "counting-trees": [treesWithAGivenVertexDegree],
  "cycles-in-graphs": [fourCycles],
  "kruskals-algorithm": [treeAfterANewEdge],
  "deterministic-finite-automata": [productAutomaton],
  "big-theta-notation": [divideAndConquerExponent],
};
