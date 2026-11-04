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

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** matrix writes a grid of numbers as a LaTeX matrix. */
const matrix = (rows: number[][]) => `\\begin{pmatrix} ${rows.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** binary writes a positive integer as a base 2 numeral. */
const binary = (n: number) => `\\mathrm{${n.toString(2)}}_{2}`;
/** productOf multiplies a list of numbers. */
const productOf = (values: number[]) => values.reduce((a, b) => a * b, 1);

const functionsWithFixedValues: KnowledgePointDef = {
  id: "boolean-functions-with-values-fixed-on-some-inputs",
  title: t("Boolean functions with values fixed on some inputs", "在部分输入上取值固定的布尔函数"),
  explanation: t(
    "A Boolean function of $n$ variables is nothing more than a choice of 0 or 1 for each of its $2^n$ input rows, and these choices are independent. Fixing the value on some rows removes those choices and leaves the rest free. So each remaining row doubles the count, and the answer is a power of 2 with the number of free rows as exponent.",
    "$n$ 个变量的布尔函数，不过是为 $2^n$ 个输入行各选 0 或 1，这些选择相互独立。在某些行上固定取值，就去掉了这些选择，其余的行仍然自由。所以每个剩下的行都使个数翻倍，答案是 2 的幂，指数是自由行的个数。",
  ),
  generate(rng) {
    const n = rng.int(3, 4);
    const rows = 2 ** n;
    const fixed = rng.int(1, rows - 1);
    const value = rng.int(0, 1);
    const free = rows - fixed;
    const answer = 2 ** free;
    return numberProblem({
      prompt: t(
        `How many Boolean functions of ${n} variables take the value ${value} on each of ${fixed} chosen input ${fixed === 1 ? "row" : "rows"}?`,
        `有多少个 ${n} 元布尔函数，在选定的 ${fixed} 个输入行上都取值 ${value}？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** rows, 2 ** fixed, free, 2 * free, answer + 1],
      solution: t(
        `There are ${rows} rows, and ${free} of them remain free. Each free row has 2 possible values, so the count is $${pow(2, free)}${free === 1 ? "" : ` = ${answer}`}$.`,
        `一共有 ${rows} 行，其中 ${free} 行仍然自由。每个自由行有 2 种取值，所以个数是 $${pow(2, free)}${free === 1 ? "" : ` = ${answer}`}$。`,
      ),
    });
  },
};

const distributingClauses: KnowledgePointDef = {
  id: "the-number-of-terms-after-distributing-clauses",
  title: t("The number of terms after distributing clauses", "分配子句后的项数"),
  explanation: t(
    "Distributing $\\wedge$ over $\\vee$ turns a conjunction of clauses into a disjunctive normal form. Each resulting term is made by picking one literal from every clause, just as each term of a product of sums picks one summand from every bracket. So the number of terms is the product of the clause sizes, which is why converting between normal forms can make a formula grow quickly.",
    "把 $\\wedge$ 对 $\\vee$ 分配，就把子句的合取变成析取范式。得到的每一项都是从每个子句中各选一个文字构成的，正如和的乘积展开时，每一项从每个括号中各选一项。所以项数是各子句大小的乘积，这也是范式转换会使公式迅速变大的原因。",
  ),
  generate(rng) {
    const sizes = range(1, rng.int(2, 4)).map(() => rng.int(2, 6));
    const answer = productOf(sizes);
    const sum = sizes.reduce((a, b) => a + b, 0);
    const list = `${sizes.slice(0, -1).join(", ")} and ${sizes[sizes.length - 1]}`;
    return numberProblem({
      prompt: t(
        `A conjunction has ${sizes.length} clauses, with ${list} literals, and no variable occurs twice. Distributing $\\wedge$ over $\\vee$ gives a disjunctive normal form. How many terms does it have before any simplification?`,
        `一个合取式有 ${sizes.length} 个子句，文字个数分别是 ${sizes.join("、")}，没有变量出现两次。把 $\\wedge$ 对 $\\vee$ 分配，得到一个析取范式。化简之前它有多少项？`,
      ),
      answer,
      form: "integer",
      wrong: [sum, sizes.length, answer + 1, 2 ** sum],
      solution: t(
        `Each term picks one literal from every clause, so there are $${sizes.join(" \\cdot ")} = ${answer}$ terms.`,
        `每一项从每个子句中各选一个文字，所以有 $${sizes.join(" \\cdot ")} = ${answer}$ 项。`,
      ),
    });
  },
};

const clausesOfWidth: KnowledgePointDef = {
  id: "counting-the-clauses-of-a-given-width",
  title: t("Counting the clauses of a given width", "计算给定宽度的子句数"),
  explanation: t(
    "A clause with exactly $k$ literals on $k$ different variables is built in two independent steps. First choose which $k$ of the $n$ variables appear, which can be done in $\\binom{n}{k}$ ways. Then decide for each chosen variable whether it appears plain or negated, which gives $2^k$ ways. A variable cannot appear in both forms, because such a clause would always be true.",
    "恰有 $k$ 个文字、涉及 $k$ 个不同变量的子句，分两个独立的步骤构造。先选出 $n$ 个变量中出现的 $k$ 个，有 $\\binom{n}{k}$ 种选法。再决定每个选中的变量是原样出现还是取反出现，有 $2^k$ 种方式。一个变量不能以两种形式同时出现，因为这样的子句永远为真。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(2, Math.min(n, 5));
    const choose = binom(n, k);
    const answer = choose * 2 ** k;
    return numberProblem({
      prompt: t(
        `Over ${n} variables, how many clauses have exactly ${k} literals on ${k} different variables?`,
        `在 ${n} 个变量上，有多少个子句恰有 ${k} 个文字，且涉及 ${k} 个不同的变量？`,
      ),
      answer,
      form: "integer",
      wrong: [choose, 2 ** k, binom(2 * n, k), n ** k],
      solution: t(
        `Choose the variables in $\\binom{${n}}{${k}} = ${choose}$ ways and their signs in $2^{${k}} = ${2 ** k}$ ways. The product is $${answer}$.`,
        `选择变量有 $\\binom{${n}}{${k}} = ${choose}$ 种方法，选择符号有 $2^{${k}} = ${2 ** k}$ 种方法。乘积是 $${answer}$。`,
      ),
    });
  },
};

const mintermsOfConjunction: KnowledgePointDef = {
  id: "the-minterms-of-a-single-conjunction",
  title: t("The minterms of a single conjunction", "单个合取式的极小项"),
  explanation: t(
    "A minterm mentions every variable, so a shorter conjunction stands for several minterms at once. The literals that are present fix the values of their variables, and each variable that is missing can take either value. So a conjunction of $k$ literals over $n$ variables is true on $2^{n - k}$ rows, and its principal disjunctive normal form has that many minterms.",
    "极小项涉及每个变量，所以较短的合取式同时代表多个极小项。出现的文字固定了相应变量的取值，每个没有出现的变量都可以取任一值。所以 $n$ 个变量上 $k$ 个文字的合取式在 $2^{n - k}$ 行上为真，它的主析取范式就有这么多个极小项。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const k = rng.int(1, n - 1);
    const literals = range(1, k).map((i) => `${rng.int(0, 1) === 0 ? "\\neg " : ""}x_{${i}}`);
    const answer = 2 ** (n - k);
    return numberProblem({
      prompt: t(
        `A function of the ${n} variables $x_{1}, \\dots, x_{${n}}$ is $f = ${literals.join(" \\wedge ")}$. How many minterms does its principal disjunctive normal form have?`,
        `$x_{1}, \\dots, x_{${n}}$ 这 ${n} 个变量的函数是 $f = ${literals.join(" \\wedge ")}$。它的主析取范式有多少个极小项？`,
      ),
      answer,
      form: "integer",
      wrong: [1, n - k, 2 ** k, 2 ** n - answer, k],
      solution: t(
        `The formula fixes ${k} of the variables and leaves ${n - k} free, which gives $${pow(2, n - k)}${n - k === 1 ? "" : ` = ${answer}`}$ true rows.`,
        `这个公式固定了 ${k} 个变量，留下 ${n - k} 个自由变量，于是有 $${pow(2, n - k)}${n - k === 1 ? "" : ` = ${answer}`}$ 个为真的行。`,
      ),
    });
  },
};

const maxtermsFromMinterms: KnowledgePointDef = {
  id: "the-maxterms-from-the-number-of-minterms",
  title: t("The maxterms from the number of minterms", "由极小项个数求极大项个数"),
  explanation: t(
    "Every input row of a function falls into exactly one of two groups. A row where the function is true gives a minterm of the principal disjunctive normal form, and a row where it is false gives a maxterm of the principal conjunctive normal form. So the numbers of minterms and maxterms always add to $2^n$, and knowing one tells you the other.",
    "函数的每个输入行恰好属于两类之一。函数为真的行给出主析取范式的一个极小项，函数为假的行给出主合取范式的一个极大项。所以极小项和极大项的个数之和总是 $2^n$，知道其中一个就知道另一个。",
  ),
  generate(rng) {
    const n = rng.int(2, 8);
    const rows = 2 ** n;
    const m = rng.int(1, rows - 1);
    const answer = rows - m;
    return numberProblem({
      prompt: t(
        `The principal disjunctive normal form of a function of ${n} variables has ${m} ${m === 1 ? "minterm" : "minterms"}. How many maxterms does its principal conjunctive normal form have?`,
        `一个 ${n} 元函数的主析取范式有 ${m} 个极小项。它的主合取范式有多少个极大项？`,
      ),
      answer,
      form: "integer",
      wrong: [m, rows, answer + 1, Math.max(answer - 1, 0)],
      solution: t(
        `There are $2^{${n}} = ${rows}$ rows, and ${m} of them are true. The other $${answer}$ give the maxterms.`,
        `一共有 $2^{${n}} = ${rows}$ 行，其中 ${m} 行为真。其余 $${answer}$ 行给出极大项。`,
      ),
    });
  },
};

const monomialsOfDegree: KnowledgePointDef = {
  id: "counting-the-monomials-of-a-given-degree",
  title: t("Counting the monomials of a given degree", "计算给定次数的单项式数"),
  explanation: t(
    "In a Boolean polynomial, $x \\wedge x = x$, so no variable ever needs an exponent above 1. A monomial is therefore determined by the set of variables it contains, and its degree is the size of that set. Counting monomials of degree $d$ in $n$ variables is the same as counting subsets of size $d$, which is why the answer is a binomial coefficient and not a power.",
    "在布尔多项式中，$x \\wedge x = x$，所以任何变量的指数都不需要超过 1。因此单项式由它所含变量的集合决定，次数就是这个集合的大小。计算 $n$ 个变量上 $d$ 次单项式的个数，就是计算大小为 $d$ 的子集个数，所以答案是二项式系数，而不是幂。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const d = rng.int(2, n - 1);
    const answer = binom(n, d);
    return numberProblem({
      prompt: t(
        `How many different monomials of degree ${d} can a Boolean polynomial in ${n} variables contain?`,
        `${n} 个变量的布尔多项式可以含有多少个不同的 ${d} 次单项式？`,
      ),
      answer,
      form: "integer",
      wrong: [n ** d, 2 ** n, 2 ** d, n * d],
      solution: t(
        `A monomial of degree ${d} is a set of ${d} variables, so there are $\\binom{${n}}{${d}} = ${answer}$ of them.`,
        `${d} 次单项式就是 ${d} 个变量的集合，所以有 $\\binom{${n}}{${d}} = ${answer}$ 个。`,
      ),
    });
  },
};

const karnaughGroups: KnowledgePointDef = {
  id: "counting-the-groups-of-a-karnaugh-map",
  title: t("Counting the groups of a Karnaugh map", "计算卡诺图中的分组数"),
  explanation: t(
    "A valid group of $2^j$ cells in a Karnaugh map lets exactly $j$ variables vary while the others stay fixed. To describe such a group, choose which $j$ variables are free, then choose a value for each of the remaining $n - j$ variables. Multiplying the two counts gives every group. It also shows that wrapping around the edges of the map is part of the count.",
    "卡诺图中 $2^j$ 个格子的有效分组，恰好让 $j$ 个变量变化，其他变量保持固定。要描述这样的分组，先选出哪 $j$ 个变量自由，再为其余 $n - j$ 个变量各选一个值。两个计数相乘，就得到所有分组。这也说明，绕过图边缘的分组也包括在内。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const j = rng.int(1, n - 1);
    const choose = binom(n, j);
    const values = 2 ** (n - j);
    const answer = choose * values;
    return numberProblem({
      prompt: t(
        `A valid group of $${2 ** j}$ cells in a Karnaugh map of ${n} variables lets ${j} ${j === 1 ? "variable" : "variables"} vary and fixes the others. How many different groups of this size are there?`,
        `${n} 个变量的卡诺图中，$${2 ** j}$ 个格子的有效分组让 ${j} 个变量变化，并固定其他变量。这样大小的不同分组有多少个？`,
      ),
      answer,
      form: "integer",
      wrong: [choose, values, choose * 2 ** j, 2 ** n],
      solution: t(
        `Choose the free variables in $\\binom{${n}}{${j}} = ${choose}$ ways and the values of the others in $${values}$ ways. The product is $${answer}$.`,
        `选择自由变量有 $\\binom{${n}}{${j}} = ${choose}$ 种方法，选择其他变量的值有 $${values}$ 种方法。乘积是 $${answer}$。`,
      ),
    });
  },
};

const affineDependingOn: KnowledgePointDef = {
  id: "affine-functions-that-depend-on-a-given-number-of-variables",
  title: t("Affine functions that depend on a given number of variables", "依赖给定个数变量的仿射函数"),
  explanation: t(
    "An affine Boolean function has the form $c \\oplus x_{i_1} \\oplus \\dots \\oplus x_{i_k}$, and the variables in the sum are exactly the ones it depends on, since changing any of them flips the output. So to count them, choose the $k$ variables, then choose the constant $c$. The constant has two values, and it does not change which variables matter.",
    "仿射布尔函数的形式是 $c \\oplus x_{i_1} \\oplus \\dots \\oplus x_{i_k}$，和中的变量恰好就是它依赖的变量，因为改变其中任何一个都会翻转输出。所以要计数，先选这 $k$ 个变量，再选常数 $c$。常数有两个值，它不改变函数依赖哪些变量。",
  ),
  generate(rng) {
    const n = rng.int(2, 14);
    const k = rng.int(1, n);
    const choose = binom(n, k);
    const answer = 2 * choose;
    return numberProblem({
      prompt: t(
        `How many affine Boolean functions of ${n} variables depend on exactly ${k} of them?`,
        `有多少个 ${n} 元仿射布尔函数恰好依赖其中 ${k} 个变量？`,
      ),
      answer,
      form: "integer",
      wrong: [choose, 2 ** (n + 1), 2 ** k, n, choose + 1],
      solution: t(
        `Choose the variables in $\\binom{${n}}{${k}} = ${choose}$ ways, and the constant in 2 ways. That gives $${answer}$.`,
        `选择变量有 $\\binom{${n}}{${k}} = ${choose}$ 种方法，选择常数有 2 种方法。一共是 $${answer}$ 个。`,
      ),
    });
  },
};

const integersWithBits: KnowledgePointDef = {
  id: "integers-with-a-given-number-of-binary-digits-and-ones",
  title: t("Integers with a given number of binary digits and ones", "给定二进制位数和 1 的个数的整数"),
  explanation: t(
    "The leading digit of a positive binary integer is always 1, because a leading 0 would simply not be written. So in an integer with $n$ digits and $k$ ones, one of the ones is already placed. The remaining $k - 1$ ones can occupy any of the other $n - 1$ positions, which gives a binomial coefficient with both numbers reduced by one.",
    "正二进制整数的最高位总是 1，因为最高位的 0 根本不会写出来。所以在 $n$ 位、含 $k$ 个 1 的整数中，已经有一个 1 的位置确定了。其余 $k - 1$ 个 1 可以占据另外 $n - 1$ 个位置中的任意位置，于是得到两个数都减一的二项式系数。",
  ),
  generate(rng) {
    const n = rng.int(3, 16);
    const k = rng.int(1, n);
    const answer = binom(n - 1, k - 1);
    return numberProblem({
      prompt: t(
        `How many positive integers have exactly ${n} binary digits, with no leading zeros, of which exactly ${k} ${k === 1 ? "is" : "are"} 1?`,
        `有多少个正整数恰有 ${n} 位二进制数字（最高位不为零），其中恰有 ${k} 个 1？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n, k), 2 ** (n - 1), n - 1, answer + 1],
      solution: t(
        `The first digit is 1, and the other ones go among the remaining ${n - 1} digits. Their places can be chosen in $\\binom{${n - 1}}{${k - 1}} = ${answer}$ ways.`,
        `最高位是 1，其余的 1 放在另外 ${n - 1} 位中。选择它们的位置有 $\\binom{${n - 1}}{${k - 1}} = ${answer}$ 种方法。`,
      ),
    });
  },
};

const dividingByPowerOfTwo: KnowledgePointDef = {
  id: "dividing-by-a-power-of-two-in-binary",
  title: t("Dividing by a power of two in binary", "二进制中除以 2 的幂"),
  explanation: t(
    "Dividing by 2 in binary moves every digit one place to the right, just as dividing by 10 does in decimal. So dividing by $2^k$, which is written as a 1 followed by $k$ zeros, removes the last $k$ digits of the number. Those digits form the remainder, and the digits left over form the quotient. No long division is needed at all.",
    "在二进制中除以 2，就是把每一位右移一位，正如十进制中除以 10。所以除以 $2^k$（写作 1 后跟 $k$ 个零），就是去掉数的最后 $k$ 位。这些位构成余数，留下的位构成商。根本不需要长除法。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const x = rng.int(100, 4000);
    const divisor = 2 ** k;
    const answer = Math.floor(x / divisor);
    return numberProblem({
      prompt: t(
        `Find the quotient, ignoring the remainder, when $${binary(x)}$ is divided by $${binary(divisor)}$. Write it in decimal.`,
        `求 $${binary(x)}$ 除以 $${binary(divisor)}$ 的商（不计余数）。用十进制表示。`,
      ),
      answer,
      form: "integer",
      wrong: [Math.floor(x / 2 ** (k - 1)), Math.floor(x / 2 ** (k + 1)), x % divisor, x * divisor],
      solution: t(
        `The divisor is $2^{${k}}$, so remove the last ${k} digits. This leaves $${binary(answer)} = ${answer}$.`,
        `除数是 $2^{${k}}$，所以去掉最后 ${k} 位。留下 $${binary(answer)} = ${answer}$。`,
      ),
    });
  },
};

const hexOnes: KnowledgePointDef = {
  id: "counting-the-ones-of-a-hexadecimal-number",
  title: t("Counting the ones of a hexadecimal number", "计算十六进制数中 1 的个数"),
  explanation: t(
    "Each hexadecimal digit corresponds to exactly four binary digits, because $16 = 2^4$. So a hexadecimal numeral converts to binary one digit at a time, with no carrying and no arithmetic on the whole number. This makes questions about individual bits easy to answer. In particular, the number of ones in the whole number is the sum of the counts for each digit.",
    "每个十六进制数字恰好对应四个二进制数字，因为 $16 = 2^4$。所以十六进制数可以逐位转换成二进制，不需要进位，也不需要对整个数做运算。这使得关于单个位的问题很容易回答。特别地，整个数中 1 的个数，就是每个数字对应个数的和。",
  ),
  generate(rng) {
    const length = rng.int(3, 5);
    const digits = range(1, length).map((i) => (i === 1 ? rng.int(1, 15) : rng.int(0, 15)));
    const numeral = digits.map((d) => d.toString(16).toUpperCase()).join("");
    const counts = digits.map((d) => d.toString(2).split("0").join("").length);
    const answer = counts.reduce((a, b) => a + b, 0);
    const parts = digits.map((d) => d.toString(2).padStart(4, "0")).join("\\ ");
    return numberProblem({
      prompt: t(
        `How many of the binary digits of $\\mathrm{${numeral}}_{16}$ are 1?`,
        `$\\mathrm{${numeral}}_{16}$ 的二进制数字中有多少个 1？`,
      ),
      answer,
      form: "integer",
      wrong: [4 * length, 4 * length - answer, length, answer + 1],
      solution: t(
        `Digit by digit, the number is $\\mathrm{${parts}}_{2}$, which has ${answer} ${answer === 1 ? "one" : "ones"}.`,
        `逐位写出，这个数是 $\\mathrm{${parts}}_{2}$，其中有 ${answer} 个 1。`,
      ),
    });
  },
};

const placesInPowerBase: KnowledgePointDef = {
  id: "the-number-of-places-of-a-fraction-in-a-power-of-two-base",
  title: t("The number of places of a fraction in a power of two base", "分数在 2 的幂进制下的位数"),
  explanation: t(
    "A fraction with odd numerator and denominator $2^k$ terminates after exactly $k$ places in base 2. In base 4 or base 8, each digit stands for a block of two or three binary digits. So the binary places are grouped into blocks from the point, and a block that is only partly filled still needs a digit. That is why the count rounds up.",
    "分子为奇数、分母为 $2^k$ 的分数，在二进制下恰好在 $k$ 位后终止。在四进制或八进制下，每个数字代表两个或三个二进制数字组成的一组。所以从小数点起把二进制位分组，只填了一部分的组仍然需要一个数字。这就是计数要向上取整的原因。",
  ),
  generate(rng) {
    const k = rng.int(2, 12);
    const denominator = 2 ** k;
    const m = 2 * rng.int(0, denominator / 2 - 1) + 1;
    const block = rng.int(2, 3);
    const base = 2 ** block;
    const answer = Math.ceil(k / block);
    return numberProblem({
      prompt: t(
        `How many digits does $\\frac{${m}}{${denominator}}$ have after the point when written in base ${base}?`,
        `$\\frac{${m}}{${denominator}}$ 用 ${base} 进制写出时，小数点后有多少位？`,
      ),
      answer,
      form: "integer",
      wrong: [k, Math.floor(k / block) === answer ? answer + 1 : Math.floor(k / block), k * block, denominator],
      solution: t(
        `In base 2 there are ${k} places, because $${denominator} = 2^{${k}}$. Grouping them in blocks of ${block} takes ${answer} ${answer === 1 ? "block" : "blocks"}.`,
        `在二进制下有 ${k} 位，因为 $${denominator} = 2^{${k}}$。把它们按 ${block} 位一组分组，需要 ${answer} 组。`,
      ),
    });
  },
};

const affineDecrypt: KnowledgePointDef = {
  id: "decrypting-a-letter-of-an-affine-cipher",
  title: t("Decrypting a letter of an affine cipher", "解密仿射密码的字母"),
  explanation: t(
    "An affine cipher encrypts a letter number $x$ as $y = ax + b$ modulo 26. To undo it, undo the steps in reverse order: subtract $b$, then multiply by the inverse of $a$ modulo 26. The inverse exists exactly when $a$ is coprime to 26, which is why only those values make usable keys. Dividing by $a$ as an ordinary fraction does not work.",
    "仿射密码把字母编号 $x$ 加密成模 26 的 $y = ax + b$。要还原，就按相反的顺序撤销各步：先减去 $b$，再乘以 $a$ 模 26 的逆。逆存在当且仅当 $a$ 与 26 互素，所以只有这些值才能作为可用的密钥。像普通分数那样除以 $a$ 是行不通的。",
  ),
  generate(rng) {
    const a = rng.pick([3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]);
    const b = rng.int(1, 25);
    const x = rng.int(0, 25);
    const y = (a * x + b) % 26;
    const inverse = range(1, 25).find((v) => (a * v) % 26 === 1) ?? 1;
    const difference = (((y - b) % 26) + 26) % 26;
    return numberProblem({
      prompt: t(
        `Letters are numbered $\\mathrm{A} = 0, \\dots, \\mathrm{Z} = 25$. A letter was encrypted as $x \\mapsto ${a}x + ${b} \\pmod{26}$, and the result is $${y}$. Find the original letter's number $x$.`,
        `字母编号为 $\\mathrm{A} = 0, \\dots, \\mathrm{Z} = 25$。一个字母按 $x \\mapsto ${a}x + ${b} \\pmod{26}$ 加密，结果是 $${y}$。求原字母的编号 $x$。`,
      ),
      answer: x,
      form: "integer",
      wrong: [difference, (a * y + b) % 26, (inverse * y) % 26, (inverse * (y + b)) % 26, (x + 1) % 26],
      solution: t(
        `Modulo 26, the inverse of ${a} is ${inverse}, and $${y} - ${b} \\equiv ${difference}$. So $x \\equiv ${inverse} \\cdot ${difference} \\equiv ${x}$.`,
        `模 26 时，${a} 的逆是 ${inverse}，且 $${y} - ${b} \\equiv ${difference}$。所以 $x \\equiv ${inverse} \\cdot ${difference} \\equiv ${x}$。`,
      ),
    });
  },
};

const partitionsIntoThree: KnowledgePointDef = {
  id: "partitions-into-exactly-three-parts",
  title: t("Partitions into exactly three parts", "恰好分成三部分的分拆"),
  explanation: t(
    "To count partitions of $n$ into exactly three parts, list them with $a \\ge b \\ge c \\ge 1$, so that each partition appears once. A useful shortcut is that the count equals $\\frac{n^2}{12}$ rounded to the nearest whole number. Compositions are a different thing: there, order matters and the count is $\\binom{n - 1}{2}$. Each partition corresponds to as many as six compositions.",
    "要计算 $n$ 恰好分成三部分的分拆数，就按 $a \\ge b \\ge c \\ge 1$ 列出，使每个分拆只出现一次。一个有用的捷径是，这个个数等于 $\\frac{n^2}{12}$ 四舍五入到最接近的整数。有序分解是另一回事：那里顺序有关，个数是 $\\binom{n - 1}{2}$。每个分拆最多对应六个有序分解。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const answer = Math.round((n * n) / 12);
    return numberProblem({
      prompt: t(
        `In how many ways can ${n} be written as a sum of exactly 3 positive integers, if order does not matter?`,
        `不计顺序，${n} 有多少种方法写成恰好 3 个正整数之和？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n - 1, 2), Math.floor(n / 2), n, answer + 1],
      solution: t(
        `The count is $\\frac{${n * n}}{12}$ rounded to the nearest whole number, which is ${answer}.`,
        `这个个数是 $\\frac{${n * n}}{12}$ 四舍五入到最接近的整数，也就是 ${answer}。`,
      ),
    });
  },
};

const twoUpperBounds: KnowledgePointDef = {
  id: "integer-solutions-with-two-upper-bounds",
  title: t("Integer solutions with two upper bounds", "带两个上界的整数解"),
  explanation: t(
    "Upper bounds are handled by inclusion and exclusion. Start from all nonnegative solutions, then subtract those that break the first bound and those that break the second. Breaking $x_1 \\le a$ means $x_1 \\ge a + 1$, and subtracting $a + 1$ from $x_1$ turns this into an ordinary count with a smaller total. Solutions that break both were subtracted twice, so add them back.",
    "上界用容斥原理处理。先取所有非负解，再减去违反第一个上界的解和违反第二个上界的解。违反 $x_1 \\le a$ 就是 $x_1 \\ge a + 1$，从 $x_1$ 中减去 $a + 1$，就化成总和更小的普通计数。同时违反两者的解被减了两次，所以要加回来。",
  ),
  generate(rng) {
    const n = rng.int(8, 20);
    const a = rng.int(2, n - 1);
    const b = rng.int(2, n - 1);
    const count = (total: number) => (total < 0 ? 0 : binom(total + 2, 2));
    const all = count(n);
    const overA = count(n - a - 1);
    const overB = count(n - b - 1);
    const overBoth = count(n - a - b - 2);
    const answer = all - overA - overB + overBoth;
    return numberProblem({
      prompt: t(
        `How many solutions in nonnegative integers does $x_{1} + x_{2} + x_{3} = ${n}$ have with $x_{1} \\le ${a}$ and $x_{2} \\le ${b}$?`,
        `$x_{1} + x_{2} + x_{3} = ${n}$ 有多少组非负整数解满足 $x_{1} \\le ${a}$ 且 $x_{2} \\le ${b}$？`,
      ),
      answer,
      form: "integer",
      wrong: [all, all - overA, all - overB, all - overA - overB, (a + 1) * (b + 1)],
      solution: t(
        `There are ${all} solutions in all, ${overA} break the first bound, ${overB} break the second, and ${overBoth} break both. So the count is $${all} - ${overA} - ${overB} + ${overBoth} = ${answer}$.`,
        `一共有 ${all} 组解，${overA} 组违反第一个上界，${overB} 组违反第二个上界，${overBoth} 组同时违反两者。所以个数是 $${all} - ${overA} - ${overB} + ${overBoth} = ${answer}$。`,
      ),
    });
  },
};

const coefficientSum: KnowledgePointDef = {
  id: "the-sum-of-the-coefficients-of-a-multinomial-expansion",
  title: t("The sum of the coefficients of a multinomial expansion", "多项式展开的系数和"),
  explanation: t(
    "Setting every variable equal to 1 turns each term of an expansion into its coefficient alone, so the expression's value at that point is the sum of all the coefficients. There is no need to find any single term. This works for negative coefficients as well, where signs inside the bracket simply combine first, and the power is taken afterwards.",
    "令每个变量都等于 1，展开式的每一项就只剩下它的系数，所以这一点上的表达式的值就是所有系数之和。根本不需要求出任何单独的项。对负系数也同样成立，括号内的符号先合并，然后再求幂。",
  ),
  generate(rng) {
    const a = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const c = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
    const n = rng.int(2, 6);
    const sum = a + b + c;
    const answer = sum ** n;
    const size = Math.abs(a) + Math.abs(b) + Math.abs(c);
    return numberProblem({
      prompt: t(
        `Find the sum of all the coefficients in the expansion of $(${poly([a, "x"], [b, "y"], [c, "z"])})^{${n}}$.`,
        `求 $(${poly([a, "x"], [b, "y"], [c, "z"])})^{${n}}$ 展开式中所有系数之和。`,
      ),
      answer,
      form: "integer",
      wrong: [size ** n, sum * n, a ** n + b ** n + c ** n, 3 ** n, answer + 1],
      solution: t(
        `Put $x = y = z = 1$. The bracket equals $${sum}$, so the sum is $${inParens(sum)}^{${n}} = ${answer}$.`,
        `令 $x = y = z = 1$。括号的值是 $${sum}$，所以和是 $${inParens(sum)}^{${n}} = ${answer}$。`,
      ),
    });
  },
};

const termsWithAllVariables: KnowledgePointDef = {
  id: "the-terms-of-a-multinomial-expansion-that-contain-every-variable",
  title: t("The terms of a multinomial expansion that contain every variable", "多项式展开中含所有变量的项"),
  explanation: t(
    "A term of $(x_1 + \\dots + x_k)^n$ is decided by its exponents, which are whole numbers adding to $n$. A term that contains every variable has all its exponents at least 1. Giving each variable one copy first leaves $n - k$ to share out freely among $k$ variables, and stars and bars then gives $\\binom{n - 1}{k - 1}$ such terms, fewer than the full count.",
    "$(x_1 + \\dots + x_k)^n$ 的一项由它的指数决定，这些指数是和为 $n$ 的整数。含所有变量的项，所有指数都至少是 1。先给每个变量一份，剩下 $n - k$ 份在 $k$ 个变量中自由分配，于是隔板法给出 $\\binom{n - 1}{k - 1}$ 个这样的项，比全部项数少。",
  ),
  generate(rng) {
    const k = rng.int(3, 6);
    const n = rng.int(k, 20);
    const answer = binom(n - 1, k - 1);
    const bracket = range(1, k)
      .map((i) => `x_{${i}}`)
      .join(" + ");
    return numberProblem({
      prompt: t(
        `After like terms are collected, how many terms of the expansion of $(${bracket})^{${n}}$ contain all ${k} variables?`,
        `合并同类项后，$(${bracket})^{${n}}$ 的展开式中有多少项含全部 ${k} 个变量？`,
      ),
      answer,
      form: "integer",
      wrong: [binom(n + k - 1, k - 1), binom(n, k - 1), answer + 1, n],
      solution: t(
        `The exponents are all at least 1 and add to ${n}, so there are $\\binom{${n - 1}}{${k - 1}} = ${answer}$ such terms.`,
        `指数都至少是 1，且和为 ${n}，所以有 $\\binom{${n - 1}}{${k - 1}} = ${answer}$ 个这样的项。`,
      ),
    });
  },
};

const graphsWithEdges: KnowledgePointDef = {
  id: "labeled-graphs-with-a-given-number-of-edges",
  title: t("Labeled graphs with a given number of edges", "给定边数的标号图"),
  explanation: t(
    "A simple graph on labeled vertices is decided by which pairs of vertices are joined. There are $\\binom{n}{2}$ pairs available, and a graph with exactly $m$ edges chooses $m$ of them. So the count is a binomial coefficient applied twice. Labeled means that two graphs with the same shape but different vertex names count as different, unlike counting graphs up to isomorphism.",
    "标号顶点上的简单图，由哪些顶点对相连决定。可用的顶点对有 $\\binom{n}{2}$ 个，恰有 $m$ 条边的图从中选出 $m$ 个。所以计数用了两次二项式系数。标号意味着形状相同但顶点名称不同的两个图算作不同的图，这与同构意义下的计数不同。",
  ),
  generate(rng) {
    const n = rng.int(3, 8);
    const pairs = binom(n, 2);
    const m = rng.int(1, pairs - 1);
    const answer = binom(pairs, m);
    return numberProblem({
      prompt: t(
        `How many simple graphs on ${n} labeled vertices have exactly ${m} ${m === 1 ? "edge" : "edges"}?`,
        `${n} 个标号顶点上，有多少个简单图恰有 ${m} 条边？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** pairs, binom(n, Math.min(m, n)), pairs, pairs * m],
      solution: t(
        `There are $\\binom{${n}}{2} = ${pairs}$ pairs of vertices, and the graph chooses ${m} of them, in $\\binom{${pairs}}{${m}} = ${answer}$ ways.`,
        `一共有 $\\binom{${n}}{2} = ${pairs}$ 个顶点对，图从中选出 ${m} 个，有 $\\binom{${pairs}}{${m}} = ${answer}$ 种方法。`,
      ),
    });
  },
};

const fewestVertices: KnowledgePointDef = {
  id: "the-fewest-vertices-for-a-given-maximum-degree",
  title: t("The fewest vertices for a given maximum degree", "给定最大度时的最少顶点数"),
  explanation: t(
    "The handshaking lemma gives a lower bound on the number of vertices. If no degree exceeds $d$, the sum of the degrees is at most $dn$, and it must equal $2m$. So $n \\ge \\frac{2m}{d}$, and since $n$ is a whole number, this rounds up. When $d$ is smaller than $n$, a graph with degrees as equal as possible reaches this bound.",
    "握手引理给出顶点数的下界。如果没有度超过 $d$，度数之和最多是 $dn$，而它必须等于 $2m$。所以 $n \\ge \\frac{2m}{d}$，由于 $n$ 是整数，要向上取整。当 $d$ 小于 $n$ 时，度数尽量相等的图可以达到这个下界。",
  ),
  generate(rng) {
    const n = rng.int(4, 20);
    const d = rng.int(2, n - 1);
    const m = rng.int(Math.floor(((n - 1) * d) / 2) + 1, Math.floor((n * d) / 2));
    const bound = Q.of(2 * m, d);
    return numberProblem({
      prompt: t(
        `A simple graph has ${m} edges, and no vertex has degree above ${d}. What is the fewest vertices it can have?`,
        `一个简单图有 ${m} 条边，没有顶点的度超过 ${d}。它最少有多少个顶点？`,
      ),
      answer: n,
      form: "integer",
      wrong: [m, d + 1, Math.floor(m / d), n + 1, n - 1],
      solution: t(
        `The degrees add to ${2 * m} and each is at most ${d}, so the number of vertices is at least $${bound.toLatex()}$. The smallest whole number allowed is ${n}.`,
        `度数之和是 ${2 * m}，每个度最多是 ${d}，所以顶点数至少是 $${bound.toLatex()}$。允许的最小整数是 ${n}。`,
      ),
    });
  },
};

const complementOfRegular: KnowledgePointDef = {
  id: "the-edges-of-the-complement-of-a-regular-graph",
  title: t("The edges of the complement of a regular graph", "正则图补图的边数"),
  explanation: t(
    "In the complement of a simple graph, a vertex is joined to exactly the vertices it was not joined to, leaving out itself. So a vertex of degree $r$ on $n$ vertices has degree $n - 1 - r$ in the complement. The complement of a regular graph is therefore regular too, and the handshaking lemma gives its edges. The total with the original is always $\\binom{n}{2}$.",
    "在简单图的补图中，一个顶点恰好与原来不相邻的顶点相连，不包括自身。所以 $n$ 个顶点的图中度为 $r$ 的顶点，在补图中的度是 $n - 1 - r$。因此正则图的补图也是正则的，握手引理给出它的边数。它与原图的边数之和总是 $\\binom{n}{2}$。",
  ),
  generate(rng) {
    const n = rng.int(5, 30);
    const options = range(1, n - 2).filter((r) => (n * r) % 2 === 0);
    const r = rng.pick(options);
    const degree = n - 1 - r;
    const answer = (n * degree) / 2;
    return numberProblem({
      prompt: t(
        `A simple ${r}-regular graph has ${n} vertices. How many edges does its complement have?`,
        `一个 ${r}-正则简单图有 ${n} 个顶点。它的补图有多少条边？`,
      ),
      answer,
      form: "integer",
      wrong: [(n * r) / 2, binom(n, 2), n * degree, degree],
      solution: t(
        `Each vertex has degree $${n} - 1 - ${r} = ${degree}$ in the complement, so it has $\\frac{${n} \\cdot ${degree}}{2} = ${answer}$ edges.`,
        `每个顶点在补图中的度是 $${n} - 1 - ${r} = ${degree}$，所以补图有 $\\frac{${n} \\cdot ${degree}}{2} = ${answer}$ 条边。`,
      ),
    });
  },
};

const mostComponents: KnowledgePointDef = {
  id: "the-most-components-for-a-given-number-of-edges",
  title: t("The most components for a given number of edges", "给定边数时的最多连通分支数"),
  explanation: t(
    "To get as many connected components as possible, keep the edges from joining new vertices. That means packing all $m$ edges into the smallest possible group of $k$ vertices, the smallest $k$ with $\\binom{k}{2} \\ge m$, and leaving all the other vertices isolated. The group counts as one component, and each isolated vertex counts as another. Spreading the edges out would only lower the count.",
    "要得到尽可能多的连通分支，就不要让边连接新的顶点。也就是把所有 $m$ 条边放进尽可能少的 $k$ 个顶点中（满足 $\\binom{k}{2} \\ge m$ 的最小 $k$），其余顶点都孤立。这一组算一个分支，每个孤立顶点各算一个。把边分散开只会使个数减少。",
  ),
  generate(rng) {
    const n = rng.int(6, 30);
    const m = rng.int(1, Math.min(binom(n - 1, 2), 60));
    const k = range(2, n).find((v) => binom(v, 2) >= m) ?? n;
    const answer = n - k + 1;
    return numberProblem({
      prompt: t(
        `A simple graph has ${n} vertices and ${m} ${m === 1 ? "edge" : "edges"}. What is the largest number of connected components it can have?`,
        `一个简单图有 ${n} 个顶点、${m} 条边。它最多有多少个连通分支？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.max(n - m, 1), n, answer + 1, n - k],
      solution: t(
        `The smallest group of vertices that holds ${m} ${m === 1 ? "edge" : "edges"} has ${k} vertices, since $\\binom{${k}}{2} = ${binom(k, 2)}$. The other ${n - k} ${n - k === 1 ? "vertex stays" : "vertices stay"} isolated, which gives $${n - k} + 1 = ${answer}$ components.`,
        `能容纳 ${m} 条边的最小顶点组有 ${k} 个顶点，因为 $\\binom{${k}}{2} = ${binom(k, 2)}$。其余 ${n - k} 个顶点保持孤立，于是有 $${n - k} + 1 = ${answer}$ 个分支。`,
      ),
    });
  },
};

const treeCutVertices: KnowledgePointDef = {
  id: "the-cut-vertices-of-a-tree",
  title: t("The cut vertices of a tree", "树的割点"),
  explanation: t(
    "In a tree, each pair of vertices is joined by exactly one path. Removing a vertex of degree at least 2 cuts the path between two of its neighbors, so every such vertex is a cut vertex. Removing a leaf cannot disconnect anything, since no path passes through a leaf. So on three or more vertices, the cut vertices are exactly the vertices that are not leaves.",
    "在树中，每对顶点恰好由一条路径相连。去掉度至少为 2 的顶点，会切断它的两个邻点之间的路径，所以每个这样的顶点都是割点。去掉叶子不会使任何东西断开，因为没有路径经过叶子。所以在三个或更多顶点上，割点恰好就是不是叶子的顶点。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const leaves = rng.int(2, n - 1);
    const answer = n - leaves;
    return numberProblem({
      prompt: t(
        `A tree has ${n} vertices, and ${leaves} of them are leaves. How many cut vertices does it have?`,
        `一棵树有 ${n} 个顶点，其中 ${leaves} 个是叶子。它有多少个割点？`,
      ),
      answer,
      form: "integer",
      wrong: [leaves, n - 1, answer + 1, n],
      solution: t(
        `The cut vertices are the non-leaves, so there are $${n} - ${leaves} = ${answer}$.`,
        `割点就是非叶子顶点，所以有 $${n} - ${leaves} = ${answer}$ 个。`,
      ),
    });
  },
};

const fullTreeLeaves: KnowledgePointDef = {
  id: "the-leaves-of-a-full-tree",
  title: t("The leaves of a full tree", "满树的叶子"),
  explanation: t(
    "In a full $m$-ary tree, each internal vertex has exactly $m$ children. Every vertex except the root is a child of exactly one internal vertex, so with $i$ internal vertices the tree has $mi + 1$ vertices. Subtracting the internal ones leaves $(m - 1)i + 1$ leaves. The depth and shape of the tree play no part, so very different trees give the same count.",
    "在满 $m$ 叉树中，每个内部顶点恰有 $m$ 个孩子。除根以外的每个顶点都恰好是一个内部顶点的孩子，所以有 $i$ 个内部顶点的树共有 $mi + 1$ 个顶点。减去内部顶点，剩下 $(m - 1)i + 1$ 片叶子。树的深度和形状都不起作用，所以差别很大的树也给出相同的个数。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const i = rng.int(1, 40);
    const answer = (m - 1) * i + 1;
    return numberProblem({
      prompt: t(
        `In a rooted tree, every internal vertex has exactly ${m} children, and there are ${i} internal ${i === 1 ? "vertex" : "vertices"}. How many leaves does it have?`,
        `在一棵有根树中，每个内部顶点恰有 ${m} 个孩子，共有 ${i} 个内部顶点。它有多少片叶子？`,
      ),
      answer,
      form: "integer",
      wrong: [m * i + 1, m * i, (m - 1) * i, i + 1],
      solution: t(
        `The tree has $${m} \\cdot ${i} + 1 = ${m * i + 1}$ vertices, and removing the ${i} internal ones leaves ${answer}.`,
        `这棵树有 $${m} \\cdot ${i} + 1 = ${m * i + 1}$ 个顶点，去掉 ${i} 个内部顶点，剩下 ${answer} 个。`,
      ),
    });
  },
};

const traceOfCube: KnowledgePointDef = {
  id: "the-trace-of-the-cube-of-an-adjacency-matrix",
  title: t("The trace of the cube of an adjacency matrix", "邻接矩阵立方的迹"),
  explanation: t(
    "The diagonal entry $(A^3)_{ii}$ counts the walks of length 3 that start and end at vertex $i$. In a simple graph, such a walk must go around a triangle. Each triangle gives six of these walks across the whole diagonal, since it can start at any of three corners and go in either of two directions. So the trace is six times the number of triangles.",
    "对角元 $(A^3)_{ii}$ 计算从顶点 $i$ 出发并回到 $i$、长度为 3 的路线。在简单图中，这样的路线必须绕一个三角形。每个三角形在整条对角线上给出六条这样的路线，因为可以从三个角中任一个出发，并沿两个方向之一行走。所以迹是三角形个数的六倍。",
  ),
  generate(rng) {
    const size = 5;
    const grid = range(1, size).map(() => range(1, size).map(() => 0));
    const link = (i: number, j: number, on: number) => {
      const row = grid[i];
      const other = grid[j];
      if (row && other) {
        row[j] = on;
        other[i] = on;
      }
    };
    for (const i of range(0, size - 1)) {
      for (const j of range(i + 1, size - 1)) link(i, j, rng.int(0, 1));
    }
    link(0, 1, 1);
    link(1, 2, 1);
    link(0, 2, 1);
    const at = (i: number, j: number) => grid[i]?.[j] ?? 0;
    let triangles = 0;
    for (const i of range(0, size - 1)) {
      for (const j of range(i + 1, size - 1)) {
        for (const k of range(j + 1, size - 1)) triangles += at(i, j) * at(j, k) * at(i, k);
      }
    }
    const edges = grid.flat().reduce((a, b) => a + b, 0) / 2;
    const answer = 6 * triangles;
    return numberProblem({
      prompt: t(
        `A simple graph has adjacency matrix $A = ${matrix(grid)}$. Find $\\operatorname{tr}(A^3)$.`,
        `一个简单图的邻接矩阵是 $A = ${matrix(grid)}$。求 $\\operatorname{tr}(A^3)$。`,
      ),
      answer,
      form: "integer",
      wrong: [triangles, 3 * triangles, 2 * edges, answer + 1],
      solution: t(
        `The graph has ${triangles} ${triangles === 1 ? "triangle" : "triangles"}, and each gives 6 closed walks of length 3. So the trace is $${answer}$.`,
        `这个图有 ${triangles} 个三角形，每个给出 6 条长度为 3 的闭路线。所以迹是 $${answer}$。`,
      ),
    });
  },
};

const pathDistanceSum: KnowledgePointDef = {
  id: "the-sum-of-the-distance-matrix-of-a-path",
  title: t("The sum of the distance matrix of a path", "路径图距离矩阵的元素和"),
  explanation: t(
    "On a path with $n$ vertices, there are $n - d$ pairs of vertices at distance $d$. So the distances between unordered pairs add to $\\sum_{d = 1}^{n - 1} d(n - d) = \\binom{n + 1}{3}$. A distance matrix records each pair twice, once above the diagonal and once below it, while the diagonal itself is all zeros. The sum of all its entries is therefore double this total.",
    "在 $n$ 个顶点的路径上，距离为 $d$ 的顶点对有 $n - d$ 个。所以无序顶点对的距离之和是 $\\sum_{d = 1}^{n - 1} d(n - d) = \\binom{n + 1}{3}$。距离矩阵把每对记录两次，对角线上方一次，下方一次，而对角线全是零。因此它所有元素之和是这个总数的两倍。",
  ),
  generate(rng) {
    const n = rng.int(3, 30);
    const half = binom(n + 1, 3);
    const answer = 2 * half;
    return numberProblem({
      prompt: t(
        `A path graph has ${n} vertices. Find the sum of all the entries of its distance matrix.`,
        `一个路径图有 ${n} 个顶点。求它的距离矩阵所有元素之和。`,
      ),
      answer,
      form: "integer",
      wrong: [half, n * (n - 1), 2 * (n - 1), n * n],
      solution: t(
        `The unordered pairs contribute $\\binom{${n + 1}}{3} = ${half}$, and the matrix counts each pair twice, which gives $${answer}$.`,
        `无序顶点对贡献 $\\binom{${n + 1}}{3} = ${half}$，矩阵把每对计算两次，于是得 $${answer}$。`,
      ),
    });
  },
};

const dagMostEdges: KnowledgePointDef = {
  id: "the-most-edges-of-a-directed-acyclic-graph",
  title: t("The most edges of a directed acyclic graph", "有向无环图的最多边数"),
  explanation: t(
    "A directed acyclic graph can be placed in a topological order, with every edge pointing forward. So for each pair of vertices, only the forward edge is possible, and this gives at most one edge per pair. Adding every forward edge reaches that limit without creating a cycle. An edge in both directions between a pair of vertices would already be a cycle of length two.",
    "有向无环图可以排成拓扑序，每条边都指向前方。所以对每对顶点，只可能有向前的那条边，这样每对最多一条边。加上所有向前的边，就达到这个上限，而不产生圈。一对顶点之间两个方向都有边，本身就已经是长度为二的圈。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const answer = binom(n, 2);
    return numberProblem({
      prompt: t(
        `What is the largest number of edges a directed acyclic graph on ${n} vertices can have?`,
        `${n} 个顶点的有向无环图最多有多少条边？`,
      ),
      answer,
      form: "integer",
      wrong: [n * (n - 1), n - 1, answer - 1, n * n],
      solution: t(
        `A topological order allows one forward edge for each pair of vertices, so the largest number is $\\binom{${n}}{2} = ${answer}$.`,
        `拓扑序允许每对顶点有一条向前的边，所以最大值是 $\\binom{${n}}{2} = ${answer}$。`,
      ),
    });
  },
};

const twoChains: KnowledgePointDef = {
  id: "the-topological-orderings-of-two-separate-paths",
  title: t("The topological orderings of two separate paths", "两条独立路径的拓扑排序"),
  explanation: t(
    "A directed path allows only one order of its own vertices. If a graph consists of two separate paths, a topological ordering is any way of shuffling them together that keeps each path in order. Such a shuffle is decided by which positions go to the first path, and the vertices then fill those positions in their only possible order. So the count is one binomial coefficient.",
    "有向路径只允许它自身顶点的一种顺序。如果一个图由两条独立的路径组成，拓扑排序就是把它们混合在一起、同时保持每条路径内部顺序的任何方式。这样的混合由哪些位置分给第一条路径决定，然后顶点按唯一可能的顺序填入这些位置。所以计数就是一个二项式系数。",
  ),
  generate(rng) {
    const a = rng.int(2, 10);
    const b = rng.int(2, 10);
    const answer = binom(a + b, a);
    return numberProblem({
      prompt: t(
        `A directed graph consists of two separate directed paths, one with ${a} vertices and one with ${b}, and no other edges. How many topological orderings does it have?`,
        `一个有向图由两条独立的有向路径组成，一条有 ${a} 个顶点，另一条有 ${b} 个，没有其他边。它有多少种拓扑排序？`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, a * b, 2 ** (a + b), 2],
      solution: t(
        `Choose which ${a} of the ${a + b} positions go to the first path, in $\\binom{${a + b}}{${a}} = ${answer}$ ways.`,
        `选择 ${a + b} 个位置中哪 ${a} 个分给第一条路径，有 $\\binom{${a + b}}{${a}} = ${answer}$ 种方法。`,
      ),
    });
  },
};

const bfsDiscovered: KnowledgePointDef = {
  id: "the-vertices-a-breadth-first-search-finds-by-a-given-level",
  title: t("The vertices a breadth-first search finds by a given level", "广度优先搜索到某层时找到的顶点"),
  explanation: t(
    "A breadth-first search finds vertices in order of their distance from the start, finishing each level before moving to the next. In a complete $m$-ary tree started at the root, level $j$ has $m^j$ vertices, because each vertex on one level has $m$ children on the next. The number found once level $d$ is finished is the geometric sum of all the levels up to $d$.",
    "广度优先搜索按到起点的距离顺序找到顶点，完成一层后才进入下一层。在从根出发的完全 $m$ 叉树中，第 $j$ 层有 $m^j$ 个顶点，因为一层的每个顶点在下一层有 $m$ 个孩子。第 $d$ 层完成时找到的顶点数，就是到第 $d$ 层为止所有层的几何级数和。",
  ),
  generate(rng) {
    const m = rng.int(2, 6);
    const d = rng.int(1, 7);
    const answer = (m ** (d + 1) - 1) / (m - 1);
    return numberProblem({
      prompt: t(
        `A breadth-first search starts at the root of a complete ${m}-ary tree of height ${d + 2}, with the root on level 0. How many vertices have been discovered once level ${d} is finished?`,
        `广度优先搜索从高度为 ${d + 2} 的完全 ${m} 叉树的根出发，根在第 0 层。第 ${d} 层完成时，已经发现了多少个顶点？`,
      ),
      answer,
      form: "integer",
      wrong: [m ** d, m ** (d + 1), m * d + 1, answer - 1],
      solution: t(
        `The levels contain powers of ${m}, so the total is $\\frac{${m}^{${d + 1}} - 1}{${m} - 1} = ${answer}$.`,
        `各层的顶点数是 ${m} 的幂，所以总数是 $\\frac{${m}^{${d + 1}} - 1}{${m} - 1} = ${answer}$。`,
      ),
    });
  },
};

const primStar: KnowledgePointDef = {
  id: "the-spanning-tree-of-a-graph-with-sum-weights",
  title: t("The spanning tree of a graph with sum weights", "和权图的生成树"),
  explanation: t(
    "Prim's algorithm grows a tree by always adding the cheapest edge that leaves it. When vertices are numbered and an edge between $i$ and $j$ weighs $i + j$, the cheapest edge reaching any new vertex $j$ comes from the smallest vertex already in the tree. If the tree contains vertex 1, every new vertex is attached directly to vertex 1, so the tree is a star.",
    "普里姆算法总是加入离开当前树的最便宜的边，使树增长。当顶点编号，且 $i$、$j$ 之间的边权为 $i + j$ 时，到达任何新顶点 $j$ 的最便宜的边，来自树中最小的顶点。如果树含顶点 1，每个新顶点都直接连到顶点 1，所以这棵树是星形。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const answer = n - 1 + (n * (n + 1)) / 2 - 1;
    return numberProblem({
      prompt: t(
        `A complete graph has vertices $1, 2, \\dots, ${n}$, and the edge between $i$ and $j$ has weight $i + j$. Find the total weight of a minimum spanning tree.`,
        `一个完全图的顶点是 $1, 2, \\dots, ${n}$，$i$ 与 $j$ 之间的边权为 $i + j$。求最小生成树的总权重。`,
      ),
      answer,
      form: "integer",
      wrong: [n * n - 1, (n * (n + 1)) / 2 - 1, ((n - 1) * (n * (n + 1))) / 2, answer + 1],
      solution: t(
        `Every vertex $j \\ge 2$ joins vertex 1 with an edge of weight $1 + j$. These weights add to $${n - 1} + ${(n * (n + 1)) / 2 - 1} = ${answer}$.`,
        `每个顶点 $j \\ge 2$ 通过权为 $1 + j$ 的边连到顶点 1。这些权重之和是 $${n - 1} + ${(n * (n + 1)) / 2 - 1} = ${answer}$。`,
      ),
    });
  },
};

const gridPaths: KnowledgePointDef = {
  id: "the-shortest-paths-across-a-grid-graph",
  title: t("The shortest paths across a grid graph", "网格图中的最短路径"),
  explanation: t(
    "In a grid graph, moving from one corner to the opposite corner needs a fixed number of steps in each direction, and any shortest path uses no others. A shortest path is therefore a sequence of steps, in which we only choose the order of the two kinds. Choosing the positions of one kind decides the whole sequence, which gives a binomial coefficient instead of a search.",
    "在网格图中，从一个角走到对角，每个方向需要固定的步数，任何最短路径都不会多走。因此最短路径就是一列步子，我们只选择两种步子的顺序。选定其中一种步子的位置，就决定了整个序列，于是得到一个二项式系数，而不必搜索。",
  ),
  generate(rng) {
    const a = rng.int(2, 10);
    const b = rng.int(2, 10);
    const answer = binom(a + b, a);
    return numberProblem({
      prompt: t(
        `A grid graph has vertices $(i, j)$ with $0 \\le i \\le ${a}$ and $0 \\le j \\le ${b}$, and two vertices are joined when they differ by 1 in one coordinate. How many shortest paths go from $(0, 0)$ to $(${a}, ${b})$?`,
        `网格图的顶点是 $(i, j)$，$0 \\le i \\le ${a}$，$0 \\le j \\le ${b}$，两个顶点在一个坐标上相差 1 时相连。从 $(0, 0)$ 到 $(${a}, ${b})$ 有多少条最短路径？`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, (a + 1) * (b + 1), 2 ** (a + b), a * b],
      solution: t(
        `A shortest path has $${a} + ${b} = ${a + b}$ steps, and ${a} of them increase $i$. So there are $\\binom{${a + b}}{${a}} = ${answer}$ paths.`,
        `最短路径有 $${a} + ${b} = ${a + b}$ 步，其中 ${a} 步增加 $i$。所以有 $\\binom{${a + b}}{${a}} = ${answer}$ 条路径。`,
      ),
    });
  },
};

const mooreCount: KnowledgePointDef = {
  id: "counting-the-tables-of-a-moore-machine",
  title: t("Counting the tables of a Moore machine", "计算摩尔机的表"),
  explanation: t(
    "A Moore machine's table has two independent parts. Each pair of a state and an input symbol needs a next state, which makes $as$ entries with $s$ choices each. Each state also needs one output, which makes $s$ entries with $b$ choices each. The output belongs to the state and not to the transition, and this is what makes the count smaller than for a Mealy machine.",
    "摩尔机的表有两个独立的部分。每一对状态和输入符号需要一个下一状态，共 $as$ 项，每项有 $s$ 种选择。每个状态还需要一个输出，共 $s$ 项，每项有 $b$ 种选择。输出属于状态而不属于转移，这使得计数比米利机要小。",
  ),
  generate(rng) {
    const s = rng.int(2, 5);
    const a = s === 5 ? 2 : rng.int(2, 3);
    const b = rng.int(2, 5);
    const entries = a * s;
    const answer = s ** entries * b ** s;
    return numberProblem({
      prompt: t(
        `A Moore machine has ${s} states with a fixed start state, ${a} input symbols and ${b} output symbols. How many different tables of next states and outputs are there?`,
        `一个摩尔机有 ${s} 个状态（起始状态固定）、${a} 个输入符号和 ${b} 个输出符号。下一状态和输出构成的表有多少种？`,
      ),
      answer,
      form: "integer",
      wrong: [s ** entries, (s * b) ** entries, s ** a * b, s ** entries + b ** s],
      solution: t(
        `There are ${entries} next states with ${s} choices each, and ${s} outputs with ${b} choices each. So the count is $${s}^{${entries}} \\cdot ${b}^{${s}} = ${answer}$.`,
        `有 ${entries} 个下一状态，每个 ${s} 种选择；有 ${s} 个输出，每个 ${b} 种选择。所以个数是 $${s}^{${entries}} \\cdot ${b}^{${s}} = ${answer}$。`,
      ),
    });
  },
};

const noTwoOnes: KnowledgePointDef = {
  id: "the-accepted-strings-of-a-given-length-with-no-two-ones-together",
  title: t("Accepted strings of a given length with no two ones together", "没有相邻 1 的给定长度串"),
  explanation: t(
    "The states of a DFA can be used to count its accepted strings. For strings with no two consecutive ones, the DFA remembers whether the last symbol was a 1. A valid string of length $n$ either ends in 0, after any valid string of length $n - 1$, or ends in 01, after any valid string of length $n - 2$. So the counts follow the Fibonacci recurrence.",
    "DFA 的状态可以用来计算它接受的串的个数。对没有两个连续 1 的串，DFA 记住最后一个符号是否为 1。长度为 $n$ 的有效串，要么以 0 结尾（前面是任意长度为 $n - 1$ 的有效串），要么以 01 结尾（前面是任意长度为 $n - 2$ 的有效串）。所以这些个数满足斐波那契递推。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const counts = [1, 2];
    for (const i of range(2, n)) counts[i] = (counts[i - 1] ?? 0) + (counts[i - 2] ?? 0);
    const answer = counts[n] ?? 0;
    const shorter = counts[n - 1] ?? 0;
    const shortest = counts[n - 2] ?? 0;
    return numberProblem({
      prompt: t(
        `A DFA over $\\{0, 1\\}$ accepts exactly the strings with no two consecutive 1s. How many strings of length ${n} does it accept?`,
        `$\\{0, 1\\}$ 上的一个 DFA 恰好接受没有两个连续 1 的串。它接受多少个长度为 ${n} 的串？`,
      ),
      answer,
      form: "integer",
      wrong: [2 ** n, shorter, n + 1, answer + 1],
      solution: t(
        `The counts start at 1 for the empty string and 2 for length 1, and each is the sum of the previous two. For length ${n}, this gives $${shorter} + ${shortest} = ${answer}$.`,
        `个数从空串的 1 和长度 1 的 2 开始，每个都是前两个之和。长度为 ${n} 时，得 $${shorter} + ${shortest} = ${answer}$。`,
      ),
    });
  },
};

const regexBlock: KnowledgePointDef = {
  id: "the-strings-of-a-given-length-with-a-single-block-of-ones",
  title: t("The strings of a given length with a single block of ones", "只有一段 1 的给定长度串"),
  explanation: t(
    "A string matching $0^*1^*0^*$ is either all zeros or has one unbroken block of ones. A block is decided by where it starts and where it ends, which amounts to choosing two of the $n + 1$ gaps between and around the symbols. Adding the all-zero string gives the total. Different splits can produce the same all-zero string, so it must be counted only once.",
    "匹配 $0^*1^*0^*$ 的串，要么全是零，要么有一段连续的 1。这一段由它的起点和终点决定，相当于从符号之间及两端的 $n + 1$ 个间隙中选两个。再加上全零串，就得到总数。不同的拆分可以产生同一个全零串，所以它只能算一次。",
  ),
  generate(rng) {
    const n = rng.int(3, 35);
    const blocks = binom(n + 1, 2);
    const answer = blocks + 1;
    return numberProblem({
      prompt: t(
        `How many binary strings of length ${n} match the regular expression $0^*1^*0^*$?`,
        `长度为 ${n} 的二进制串中，有多少个匹配正则表达式 $0^*1^*0^*$？`,
      ),
      answer,
      form: "integer",
      wrong: [blocks, 2 ** n, n + 1, binom(n + 2, 2)],
      solution: t(
        `A block of ones can be chosen in $\\binom{${n + 1}}{2} = ${blocks}$ ways, and the all-zero string adds one more, which gives $${answer}$.`,
        `一段 1 有 $\\binom{${n + 1}}{2} = ${blocks}$ 种选法，全零串再加一个，于是得 $${answer}$。`,
      ),
    });
  },
};

const tmConfigurations: KnowledgePointDef = {
  id: "counting-the-configurations-of-a-turing-machine",
  title: t("Counting the configurations of a Turing machine", "计算图灵机的格局数"),
  explanation: t(
    "A configuration records everything needed to continue a computation: the current state, the position of the head, and the contents of the tape. On a tape limited to $c$ cells, these parts are independent, so the count is the product of the number of states, the $c$ head positions, and the number of tape contents. This count is what bounds how long a machine can run without repeating.",
    "格局记录了继续计算所需的一切：当前状态、读写头的位置和纸带的内容。在限于 $c$ 个单元的纸带上，这些部分相互独立，所以个数是状态数、$c$ 个读写头位置和纸带内容数的乘积。这个计数决定了机器在不重复的情况下最多能运行多久。",
  ),
  generate(rng) {
    const q = rng.int(2, 9);
    const c = rng.int(2, 8);
    const g = rng.int(2, 4);
    const tapes = g ** c;
    const answer = q * c * tapes;
    return numberProblem({
      prompt: t(
        `A Turing machine has ${q} states and ${g} tape symbols, and it uses only ${c} cells of its tape. How many configurations are possible?`,
        `一台图灵机有 ${q} 个状态和 ${g} 个纸带符号，只使用纸带上的 ${c} 个单元。可能的格局有多少个？`,
      ),
      answer,
      form: "integer",
      wrong: [q * tapes, tapes, q * c * g, (q + c) * tapes],
      solution: t(
        `There are ${q} states, ${c} head positions and $${g}^{${c}} = ${tapes}$ tape contents, so the product is $${answer}$.`,
        `有 ${q} 个状态、${c} 个读写头位置和 $${g}^{${c}} = ${tapes}$ 种纸带内容，所以乘积是 $${answer}$。`,
      ),
    });
  },
};

const sumOfPowersOrder: KnowledgePointDef = {
  id: "the-order-of-a-sum-of-powers",
  title: t("The order of a sum of powers", "幂和的阶"),
  explanation: t(
    "A loop that does $i^p$ work on its $i$th pass has total cost $\\sum_{i = 1}^n i^p$. Each of the $n$ terms is at most $n^p$, so the sum is $O(n^{p + 1})$. This exponent cannot be lowered, since the larger half of the terms are each at least $\\left(\\frac{n}{2}\\right)^p$. So summing raises the exponent by exactly one, whatever the constant in front.",
    "第 $i$ 次循环做 $i^p$ 的工作，总代价是 $\\sum_{i = 1}^n i^p$。$n$ 个项中每一项最多是 $n^p$，所以和是 $O(n^{p + 1})$。这个指数不能再降低，因为较大的一半项每项至少是 $\\left(\\frac{n}{2}\\right)^p$。所以求和恰好使指数增加一，与前面的常数无关。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const p = rng.int(1, 9);
    const answer = p + 1;
    const term = p === 1 ? "i" : `i^{${p}}`;
    const top = p === 1 ? "n" : `n^{${p}}`;
    return numberProblem({
      prompt: t(
        `Find the smallest integer $k$ such that $\\sum_{i=1}^{n} ${a}${term} = O(n^k)$.`,
        `求最小的整数 $k$，使 $\\sum_{i=1}^{n} ${a}${term} = O(n^k)$。`,
      ),
      answer,
      form: "integer",
      wrong: [p, p + 2, a + p, a * p],
      solution: t(
        `Each of the $n$ terms is at most $${a}${top}$, and the larger half are all a constant times that size. So the exponent is $${p} + 1 = ${answer}$.`,
        `$n$ 项中每项最多是 $${a}${top}$，较大的一半项都是这个大小的常数倍。所以指数是 $${p} + 1 = ${answer}$。`,
      ),
    });
  },
};

const omegaThreshold: KnowledgePointDef = {
  id: "the-threshold-where-an-exponential-overtakes-a-power",
  title: t("The threshold where an exponential overtakes a power", "指数函数超过幂函数的临界点"),
  explanation: t(
    "The statement $2^n = \\Omega(n^p)$ only needs its inequality to hold from some point on. Small values of $n$ can behave differently, and an inequality may hold at first, fail for a while, and then hold for good. So the threshold $n_0$ is one more than the last value where the inequality fails, and it is not the first value where it happens to hold.",
    "$2^n = \\Omega(n^p)$ 只要求不等式从某一点起成立。较小的 $n$ 可以表现不同，不等式可能开始成立，失败一段时间，然后一直成立。所以临界值 $n_0$ 比不等式失败的最后一个值大一，而不是它碰巧成立的第一个值。",
  ),
  generate(rng) {
    const c = rng.int(1, 60);
    const p = rng.int(2, 3);
    const holds = (n: number) => 2 ** n >= c * n ** p;
    const last =
      range(1, 64)
        .filter((n) => !holds(n))
        .pop() ?? 0;
    const answer = last + 1;
    const first = range(1, 64).find(holds) ?? answer;
    const scaled = c === 1 ? `n^{${p}}` : `${c}n^{${p}}`;
    return numberProblem({
      prompt: t(
        `Find the smallest positive integer $n_0$ such that $2^n \\ge ${scaled}$ for all integers $n \\ge n_0$.`,
        `求最小的正整数 $n_0$，使 $2^n \\ge ${scaled}$ 对所有整数 $n \\ge n_0$ 成立。`,
      ),
      answer,
      form: "integer",
      wrong: [first, last, answer + 1, answer + 2, c],
      solution: t(
        `At $n = ${last}$, the left side is $${2 ** last}$ and the right side is $${c * last ** p}$, so the inequality fails. At $n = ${answer}$, it is $${2 ** answer} \\ge ${c * answer ** p}$, and it holds from then on.`,
        `当 $n = ${last}$ 时，左边是 $${2 ** last}$，右边是 $${c * last ** p}$，所以不等式不成立。当 $n = ${answer}$ 时，$${2 ** answer} \\ge ${c * answer ** p}$，此后一直成立。`,
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
  "boolean-functions-and-logical-operations": [functionsWithFixedValues],
  "disjunctive-normal-forms": [distributingClauses],
  "conjunctive-normal-forms": [clausesOfWidth],
  "principal-disjunctive-normal-forms": [mintermsOfConjunction],
  "principal-conjunctive-normal-forms": [maxtermsFromMinterms],
  "boolean-polynomials": [monomialsOfDegree],
  "simplifying-logical-expressions-using-karnaugh-maps": [karnaughGroups],
  "affine-boolean-functions": [affineDependingOn],
  "binary-integers": [integersWithBits],
  "multiplying-and-dividing-binary-integers": [dividingByPowerOfTwo],
  "hexadecimal-integers": [hexOnes],
  "fractions-in-arbitrary-bases": [placesInPowerBase],
  "introduction-to-cryptography": [affineDecrypt],
  "partitions-of-natural-numbers": [partitionsIntoThree],
  "counting-integer-solutions-of-a-constrained-equation": [twoUpperBounds],
  "the-multinomial-theorem": [coefficientSum],
  "counting-terms-in-multinomial-expansions": [termsWithAllVariables],
  "introduction-to-graphs": [graphsWithEdges],
  "the-handshaking-lemma": [fewestVertices],
  "subgraphs-and-graph-complements": [complementOfRegular],
  "connected-graphs": [mostComponents],
  "cut-vertices-and-cut-edges": [treeCutVertices],
  "trees-and-forests": [fullTreeLeaves],
  "adjacency-matrices": [traceOfCube],
  "distance-matrices": [pathDistanceSum],
  "directed-acyclic-graphs": [dagMostEdges],
  "topological-ordering": [twoChains],
  "breadth-first-search": [bfsDiscovered],
  "prims-algorithm": [primStar],
  "shortest-paths-in-unweighted-graphs": [gridPaths],
  "moore-machines": [mooreCount],
  "the-language-of-automata": [noTwoOnes],
  "regular-expressions": [regexBlock],
  "introduction-to-turing-machines": [tmConfigurations],
  "big-o-notation": [sumOfPowersOrder],
  "big-omega-notation": [omegaThreshold],
};
