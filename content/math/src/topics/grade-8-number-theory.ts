import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { factorizationLatex, gcd, lcm, primeFactors } from "@ga/subject-math";

import { choiceProblem, factorizationProblem, numberProblem, steps, yesNo } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 8th Grade Math, number theory: divisibility tests, prime factors, the fundamental theorem of arithmetic, and
// greatest common factors and lowest common multiples found from prime factorizations.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** Factors is a prime factorization: [prime, exponent] pairs in increasing order of the primes. */
type Factors = readonly (readonly [number, number])[];

/** grouped writes n with thousands separators. */
const grouped = (n: number) => n.toLocaleString("en-US").replace(/,/g, "{,}");

/** digitSum adds the digits of n. */
const digitSum = (n: number) => [...String(n)].reduce((s, d) => s + Number(d), 0);

/** latex writes a prime factorization with exponents. */
const latex = (fs: Factors) => factorizationLatex(fs.map(([p, e]) => [p, e]));

/** product multiplies out a prime factorization. */
const product = (fs: Factors) => fs.reduce((v, [p, e]) => v * p ** e, 1);

/** verdict is the solution sentence ending for a yes-or-no divisibility question. */
const verdict = (yes: boolean, n: number, d: number): Text =>
  yes
    ? t(`so $${grouped(n)}$ is divisible by $${d}$.`, `所以 $${grouped(n)}$ 能被 $${d}$ 整除。`)
    : t(`so $${grouped(n)}$ is not divisible by $${d}$.`, `所以 $${grouped(n)}$ 不能被 $${d}$ 整除。`);

/** divisibleQuestion asks whether n is divisible by d, with a solution that gives the reason and the verdict. */
function divisibleQuestion(n: number, d: number, reason: Text) {
  const yes = n % d === 0;
  const v = verdict(yes, n, d);
  return choiceProblem({
    prompt: t(`Is $${grouped(n)}$ divisible by $${d}$?`, `$${grouped(n)}$ 能被 $${d}$ 整除吗？`),
    options: yesNo,
    correct: yes ? 0 : 1,
    solution: t(`${reason.en}, ${v.en}`, `${reason["zh-CN"]}，${v["zh-CN"]}`),
  });
}

/** multipleOrNot draws a number between lo and hi that is a multiple of d about half the time. */
function multipleOrNot(rng: Rng, d: number, lo: number, hi: number): number {
  if (rng.bool()) return d * rng.int(Math.ceil(lo / d), Math.floor(hi / d));
  const n = rng.int(lo, hi - 1);
  return n % d === 0 ? n + 1 : n;
}

// ---------------------------------------------------------------------------
// Divisibility tests

/** divisibilityOfIntegersBy2510_4And8 tests divisibility by 2, 5 and 10 from the last digit and by 4 and 8 from the last two or three. */
export const divisibilityOfIntegersBy2510_4And8 = topic(
  "divisibility-of-integers-by-2-5-10-4-and-8",
  t("Divisibility of Integers by 2, 5, 10, 4, and 8", "整数能否被 2、5、10、4 和 8 整除"),
  t(
    "Because 10 is divisible by 2 and 5, only the last digit decides divisibility by 2, 5 and 10. Because 100 is divisible by 4 and 1,000 by 8, only the last two digits decide divisibility by 4, and only the last three decide divisibility by 8.",
    "因为 10 能被 2 和 5 整除，所以一个数能否被 2、5、10 整除只看末位数字。因为 100 能被 4 整除，1,000 能被 8 整除，所以能否被 4 整除只看末两位，能否被 8 整除只看末三位。",
  ),
  ["divisibility-rules"],
  ["4.OA.B.4"],
  [
    {
      id: "divisible-by-2-5-and-10",
      title: t("Divisibility by 2, 5 and 10", "被 2、5 和 10 整除"),
      explanation: t(
        "A whole number is divisible by $2$ when its last digit is even, by $5$ when its last digit is $0$ or $5$, and by $10$ when its last digit is $0$. So $4{,}735$ is divisible by $5$ but not by $2$ or $10$. The other digits do not matter, because every place except the ones place is a multiple of $10$.",
        "整数的末位数字是偶数时能被 $2$ 整除，末位是 $0$ 或 $5$ 时能被 $5$ 整除，末位是 $0$ 时能被 $10$ 整除。所以 $4{,}735$ 能被 $5$ 整除，但不能被 $2$ 或 $10$ 整除。其他数字无关紧要，因为个位以外的每一位都是 $10$ 的倍数。",
      ),
      generate(rng) {
        const d = rng.pick([2, 5, 10]);
        const n = multipleOrNot(rng, d, 1000, 99999);
        const last = n % 10;
        const reason =
          d === 2
            ? t(
                `The last digit is $${last}$, which is ${last % 2 === 0 ? "" : "not "}even`,
                `末位数字是 $${last}$，${last % 2 === 0 ? "是" : "不是"}偶数`,
              )
            : d === 5
              ? t(
                  `The last digit is $${last}$, which is ${last % 5 === 0 ? "" : "neither $0$ nor "}${last % 5 === 0 ? `$0$ or $5$` : "$5$"}`,
                  `末位数字是 $${last}$，${last % 5 === 0 ? "是 $0$ 或 $5$" : "既不是 $0$ 也不是 $5$"}`,
                )
              : t(
                  `The last digit is $${last}$, ${last === 0 ? "which is" : "not"} $0$`,
                  `末位数字是 $${last}$，${last === 0 ? "是" : "不是"} $0$`,
                );
        return divisibleQuestion(n, d, reason);
      },
    },
    {
      id: "divisible-by-4-and-8",
      title: t("Divisibility by 4 and 8", "被 4 和 8 整除"),
      explanation: t(
        "$7{,}316$ is divisible by $4$ because its last two digits form $16 = 4 \\cdot 4$. For $8$, use the last three digits: $7{,}316$ ends in $316 = 8 \\cdot 39 + 4$, so it is not divisible by $8$. An even last digit is not enough for $4$: $7{,}318$ ends in $18$, which is not a multiple of $4$.",
        "$7{,}316$ 能被 $4$ 整除，因为它的末两位组成 $16 = 4 \\cdot 4$。判断能否被 $8$ 整除要看末三位：$7{,}316$ 的末三位是 $316 = 8 \\cdot 39 + 4$，所以它不能被 $8$ 整除。末位是偶数不足以说明能被 $4$ 整除：$7{,}318$ 的末两位是 $18$，不是 $4$ 的倍数。",
      ),
      generate(rng) {
        const d = rng.pick([4, 8]);
        // Even numbers only, so that the last digit alone does not decide.
        let n = multipleOrNot(rng, d, 1000, 99999);
        if (n % 2 === 1) n += 1;
        const k = d === 4 ? 2 : 3;
        const tail = n % 10 ** k;
        const q = Math.floor(tail / d);
        const r = tail % d;
        const shown = `${tail}`.padStart(k, "0");
        const reason = t(
          `The last ${k === 2 ? "two" : "three"} digits form $${shown}$, and $${tail} = ${d} \\cdot ${q}${r === 0 ? "" : ` + ${r}`}$`,
          `末${k === 2 ? "两" : "三"}位组成 $${shown}$，而 $${tail} = ${d} \\cdot ${q}${r === 0 ? "" : ` + ${r}`}$`,
        );
        return divisibleQuestion(n, d, reason);
      },
    },
  ],
);

/** sevenSteps writes the steps of the test for 7: drop the last digit and subtract twice it, until the number is small. */
function sevenSteps(n: number): [string[], number] {
  const out: string[] = [];
  let m = n;
  while (m >= 100) {
    const [head, last] = [Math.floor(m / 10), m % 10];
    out.push(`${head} - 2 \\cdot ${last} = ${head - 2 * last}`);
    m = head - 2 * last;
  }
  return [out, m];
}

/** divisibilityOfIntegersBy3_9_6And7 tests divisibility by 3 and 9 with digit sums, by 6 with both 2 and 3, and by 7. */
export const divisibilityOfIntegersBy3_9_6And7 = topic(
  "divisibility-of-integers-by-3-9-6-and-7",
  t("Divisibility of Integers by 3, 9, 6, and 7", "整数能否被 3、9、6 和 7 整除"),
  t(
    "A number is divisible by 3 when the sum of its digits is, and by 9 when the sum of its digits is. It is divisible by 6 when it is divisible by both 2 and 3. For 7, drop the last digit and subtract twice it from what is left; the number is divisible by 7 exactly when the result is.",
    "一个数各位数字之和能被 3 整除时，这个数能被 3 整除；各位数字之和能被 9 整除时，这个数能被 9 整除。一个数同时能被 2 和 3 整除时，它能被 6 整除。判断能否被 7 整除：去掉末位数字，用剩下的数减去末位数字的 2 倍；原数能被 7 整除当且仅当所得的数能被 7 整除。",
  ),
  ["divisibility-of-integers-by-2-5-10-4-and-8"],
  ["4.OA.B.4"],
  [
    {
      id: "divisible-by-3-and-9",
      title: t("Divisibility by 3 and 9", "被 3 和 9 整除"),
      explanation: t(
        "$5{,}271$ has digit sum $5 + 2 + 7 + 1 = 15$. $15$ is divisible by $3$ but not by $9$, so $5{,}271$ is divisible by $3$ and not by $9$. Every number divisible by $9$ is divisible by $3$, but not the other way around.",
        "$5{,}271$ 的各位数字之和为 $5 + 2 + 7 + 1 = 15$。$15$ 能被 $3$ 整除，但不能被 $9$ 整除，所以 $5{,}271$ 能被 $3$ 整除，不能被 $9$ 整除。能被 $9$ 整除的数都能被 $3$ 整除，反过来则不一定。",
      ),
      generate(rng) {
        const d = rng.pick([3, 9]);
        // For 9, multiples of 3 that are not multiples of 9 are the interesting wrong cases.
        let n = multipleOrNot(rng, d, 1000, 99999);
        if (d === 9 && n % 9 !== 0 && rng.bool(0.6)) n = n - (n % 3) + 3;
        const s = digitSum(n);
        const digits = [...String(n)].join(" + ");
        const reason = t(
          `The digit sum is $${digits} = ${s}$, which is ${s % d === 0 ? "" : "not "}divisible by $${d}$`,
          `各位数字之和为 $${digits} = ${s}$，${s % d === 0 ? "能" : "不能"}被 $${d}$ 整除`,
        );
        return divisibleQuestion(n, d, reason);
      },
    },
    {
      id: "divisible-by-6-and-7",
      title: t("Divisibility by 6 and 7", "被 6 和 7 整除"),
      explanation: t(
        "$4{,}314$ is even and has digit sum $12$, so it is divisible by both $2$ and $3$, and therefore by $6$. For $7$, take $3{,}157$: $315 - 2 \\cdot 7 = 301$, then $30 - 2 \\cdot 1 = 28 = 4 \\cdot 7$, so $3{,}157$ is divisible by $7$.",
        "$4{,}314$ 是偶数，各位数字之和为 $12$，所以它同时能被 $2$ 和 $3$ 整除，因而能被 $6$ 整除。判断 $3{,}157$ 能否被 $7$ 整除：$315 - 2 \\cdot 7 = 301$，再算 $30 - 2 \\cdot 1 = 28 = 4 \\cdot 7$，所以 $3{,}157$ 能被 $7$ 整除。",
      ),
      generate(rng) {
        const d = rng.pick([6, 7]);
        let n = multipleOrNot(rng, d, 1000, 99999);
        if (d === 6) {
          // Numbers that pass one of the two tests but not the other.
          if (n % 6 !== 0 && rng.bool(0.6)) n = rng.bool() ? n - (n % 3) + 3 + ((n - (n % 3) + 3) % 2 === 0 ? 3 : 0) : n + (n % 2);
          const s = digitSum(n);
          const even = n % 2 === 0;
          const reason = t(
            `$${grouped(n)}$ is ${even ? "even" : "odd"}, and its digit sum $${s}$ is ${s % 3 === 0 ? "" : "not "}divisible by $3$`,
            `$${grouped(n)}$ 是${even ? "偶数" : "奇数"}，各位数字之和 $${s}$ ${s % 3 === 0 ? "能" : "不能"}被 $3$ 整除`,
          );
          return divisibleQuestion(n, 6, reason);
        }
        const [lines, m] = sevenSteps(n);
        const work = lines.map((l) => `$${l}$`);
        const end = m <= 0 ? `$${m}$` : m % 7 === 0 ? `$${m} = ${m / 7} \\cdot 7$` : `$${m} = 7 \\cdot ${Math.floor(m / 7)} + ${m % 7}$`;
        const reason = t(
          `Drop the last digit and subtract twice it: ${work.join(", then ")}. ${m <= 0 ? `${end} is` : `${end}, which is`} ${m % 7 === 0 ? "" : "not "}a multiple of $7$`,
          `去掉末位数字，减去它的 $2$ 倍：${work.join("，再算 ")}。${end}${m <= 0 ? " " : "，"}${m % 7 === 0 ? "是" : "不是"} $7$ 的倍数`,
        );
        return divisibleQuestion(n, 7, reason);
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Prime factors and the fundamental theorem of arithmetic

/** smallPrimes are the primes used to build numbers with known factorizations. */
const smallPrimes = [2, 3, 5, 7, 11, 13];

/** drawFactors draws a factorization with two to four distinct primes and a value between lo and hi. */
function drawFactors(rng: Rng, lo: number, hi: number, maxExp = 3): Factors {
  for (;;) {
    const ps = rng.sample(smallPrimes, rng.int(2, 3)).sort((a, b) => a - b);
    const fs = ps.map((p) => [p, rng.int(1, p <= 3 ? maxExp : 2)] as const);
    const v = product(fs);
    if (v >= lo && v <= hi) return fs;
  }
}

/** divisions lists the steps of dividing n by its smallest prime factor until 1 is left. */
function divisions(n: number): string[] {
  const out: string[] = [];
  let m = n;
  while (m > 1) {
    const [p] = primeFactors(m)[0]!;
    out.push(`${grouped(m)} \\div ${p} = ${grouped(m / p)}`);
    m /= p;
  }
  return out;
}

/** primeFactorsTopic finds the largest prime factor of a number and writes its prime factorization with exponents. */
export const primeFactorsTopic = topic(
  "prime-factors",
  t("Prime Factors", "质因数"),
  t(
    "The prime factors of a number are the primes that divide it. Dividing by the smallest prime that goes in, again and again until 1 is left, finds all of them, and writing repeated primes with exponents gives the prime factorization: 360 = 2³ · 3² · 5.",
    "一个数的质因数是能整除它的质数。反复用能整除它的最小质数去除，直到得 1，就能找出所有质因数；把重复的质数写成幂，就得到质因数分解：360 = 2³ · 3² · 5。",
  ),
  ["prime-and-composite-numbers"],
  ["6.NS.B.4"],
  [
    {
      id: "the-largest-prime-factor",
      title: t("The largest prime factor", "最大的质因数"),
      explanation: t(
        "To find the largest prime factor of $546$, divide by primes in order: $546 \\div 2 = 273$, $273 \\div 3 = 91$, $91 \\div 7 = 13$, and $13$ is prime. So $546 = 2 \\cdot 3 \\cdot 7 \\cdot 13$, and the largest prime factor is $13$. The largest factor other than $546$ itself is $273$, which is not prime.",
        "求 $546$ 最大的质因数，按顺序用质数去除：$546 \\div 2 = 273$，$273 \\div 3 = 91$，$91 \\div 7 = 13$，而 $13$ 是质数。所以 $546 = 2 \\cdot 3 \\cdot 7 \\cdot 13$，最大的质因数是 $13$。除 $546$ 本身以外最大的因数是 $273$，它不是质数。",
      ),
      generate(rng) {
        const fs = drawFactors(rng, 60, 2000, 2);
        const n = product(fs);
        const ps = fs.map(([p]) => p);
        const big = ps[ps.length - 1]!;
        const second = ps[ps.length - 2]!;
        return numberProblem({
          prompt: t(`What is the largest prime factor of $${grouped(n)}$?`, `$${grouped(n)}$ 最大的质因数是多少？`),
          answer: big,
          form: "integer",
          // The largest factor, which is not prime, the smallest prime factor, and the second largest prime factor.
          wrong: [n / ps[0]!, ps[0]!, second, big * second],
          solution: t(
            `Divide by primes, starting with the smallest:${steps(...divisions(n))}So $${grouped(n)} = ${latex(fs)}$, and the largest prime factor is $${big}$.`,
            `从最小的质数开始依次相除：${steps(...divisions(n))}所以 $${grouped(n)} = ${latex(fs)}$，最大的质因数是 $${big}$。`,
          ),
        });
      },
    },
    {
      id: "prime-factorization-with-exponents",
      title: t("Prime factorization with exponents", "用指数写质因数分解"),
      explanation: t(
        "$360 \\div 2 = 180$, $180 \\div 2 = 90$, $90 \\div 2 = 45$, $45 \\div 3 = 15$, $15 \\div 3 = 5$, and $5$ is prime. The prime $2$ was used three times and $3$ twice, so $360 = 2^{3} \\cdot 3^{2} \\cdot 5$. Every factor in the answer must be prime: $2^{3} \\cdot 45$ is not finished.",
        "$360 \\div 2 = 180$，$180 \\div 2 = 90$，$90 \\div 2 = 45$，$45 \\div 3 = 15$，$15 \\div 3 = 5$，而 $5$ 是质数。质数 $2$ 用了三次，$3$ 用了两次，所以 $360 = 2^{3} \\cdot 3^{2} \\cdot 5$。答案中的每个因数都必须是质数：$2^{3} \\cdot 45$ 还没有分解完。",
      ),
      generate(rng) {
        const fs = drawFactors(rng, 100, 3000);
        if (fs.every(([, e]) => e === 1)) return this.generate(rng);
        const n = product(fs);
        const [p, e] = fs[0]!;
        return factorizationProblem({
          prompt: t(`Write the prime factorization of $${grouped(n)}$ using exponents.`, `用指数形式写出 $${grouped(n)}$ 的质因数分解。`),
          value: n,
          // Stopping at a composite factor, and dropping the repeated primes.
          wrong: [`${latex([[p, e]])} \\cdot ${n / p ** e}`, factorizationLatex(fs.map(([q]) => [q, 1]))],
          solution: t(
            `Divide by primes, starting with the smallest:${steps(...divisions(n))}Count how many times each prime was used: $${grouped(n)} = ${latex(fs)}$.`,
            `从最小的质数开始依次相除：${steps(...divisions(n))}数出每个质数用了几次：$${grouped(n)} = ${latex(fs)}$。`,
          ),
        });
      },
    },
  ],
);

/** theFundamentalTheoremOfArithmetic uses the uniqueness of prime factorizations. */
export const theFundamentalTheoremOfArithmetic = topic(
  "the-fundamental-theorem-of-arithmetic",
  t("The Fundamental Theorem of Arithmetic", "算术基本定理"),
  t(
    "The fundamental theorem of arithmetic says that every whole number greater than 1 is a product of primes in exactly one way, apart from the order of the factors. So a number's prime factorization tells everything about its factors: d divides n exactly when every prime appears in d at most as many times as in n.",
    "算术基本定理指出：每个大于 1 的整数都能写成质数的乘积，而且除因数的顺序外写法唯一。所以一个数的质因数分解决定了它的全部因数：d 整除 n，当且仅当每个质数在 d 中出现的次数不超过在 n 中出现的次数。",
  ),
  ["prime-factors"],
  ["6.NS.B.4"],
  [
    {
      id: "recognizing-the-prime-factorization",
      title: t("Recognizing the prime factorization", "识别质因数分解"),
      explanation: t(
        "$72$ can be written as $8 \\cdot 9$, $2^{2} \\cdot 18$ or $2^{3} \\cdot 3^{2}$, but only the last is its prime factorization, because $8$, $9$ and $18$ are not prime. By the fundamental theorem every way of breaking $72$ down into primes ends at the same $2^{3} \\cdot 3^{2}$, so a product of primes with a different exponent, such as $2^{2} \\cdot 3^{3}$, is a different number.",
        "$72$ 可以写成 $8 \\cdot 9$、$2^{2} \\cdot 18$ 或 $2^{3} \\cdot 3^{2}$，但只有最后一个是它的质因数分解，因为 $8$、$9$ 和 $18$ 都不是质数。根据算术基本定理，把 $72$ 分解成质数的每种方法都得到同一个 $2^{3} \\cdot 3^{2}$，所以指数不同的质数乘积，例如 $2^{2} \\cdot 3^{3}$，是另一个数。",
      ),
      generate(rng) {
        const fs = drawFactors(rng, 60, 1500);
        if (fs.every(([, e]) => e === 1)) return this.generate(rng);
        const n = product(fs);
        const i = fs.findIndex(([, e]) => e > 1);
        const [p, e] = fs[i]!;
        // A product equal to n with a composite factor, and products of the right primes with an exponent changed.
        const composite = fs.map(([q, f], j) => (j === i ? `${q ** e}` : f === 1 ? `${q}` : `${q}^{${f}}`)).join(" \\cdot ");
        const less = latex(fs.map(([q, f], j) => [q, j === i ? f - 1 : f] as const).filter(([, f]) => f > 0));
        const more = latex(fs.map(([q, f], j) => [q, j === (i + 1) % fs.length ? f + 1 : f] as const));
        const swapped = latex(fs.length >= 2 ? fs.map(([q], j) => [q, fs[fs.length - 1 - j]![1]] as const) : fs);
        return pickChoice(
          rng,
          t(`Which of these is the prime factorization of $${grouped(n)}$?`, `下面哪一个是 $${grouped(n)}$ 的质因数分解？`),
          mathText(latex(fs)),
          [...new Set([composite, less, more, swapped])].filter((s) => s !== latex(fs)).map(mathText),
          t(
            `Divide by primes:${steps(...divisions(n))}So $${grouped(n)} = ${latex(fs)}$. The product $${composite}$ also equals $${grouped(n)}$, but $${p ** e}$ is not prime; the other choices are products of primes with different exponents, so they are different numbers.`,
            `用质数依次相除：${steps(...divisions(n))}所以 $${grouped(n)} = ${latex(fs)}$。乘积 $${composite}$ 也等于 $${grouped(n)}$，但 $${p ** e}$ 不是质数；其他选项是指数不同的质数乘积，所以是别的数。`,
          ),
        );
      },
    },
    {
      id: "divisibility-from-the-factorization",
      title: t("Factors from the factorization", "由质因数分解判断因数"),
      explanation: t(
        "$n = 2^{3} \\cdot 3 \\cdot 5^{2}$. Is $n$ divisible by $12 = 2^{2} \\cdot 3$? Yes: $n$ has at least two $2$s and one $3$. It is not divisible by $9 = 3^{2}$, because $n$ has only one $3$, and not by $14 = 2 \\cdot 7$, because $7$ is not among its primes. There is no need to multiply out $n$.",
        "$n = 2^{3} \\cdot 3 \\cdot 5^{2}$。$n$ 能被 $12 = 2^{2} \\cdot 3$ 整除吗？能：$n$ 至少含有两个 $2$ 和一个 $3$。它不能被 $9 = 3^{2}$ 整除，因为 $n$ 只含一个 $3$；也不能被 $14 = 2 \\cdot 7$ 整除，因为 $7$ 不在它的质因数中。不需要把 $n$ 乘出来。",
      ),
      generate(rng) {
        const fs = drawFactors(rng, 200, 200000);
        const kind = rng.pick(["yes", "yes", "exponent", "prime"] as const);
        const own = new Map(fs.map(([p, e]) => [p, e]));
        let ds: [number, number][];
        if (kind === "yes") {
          ds = rng.sample([...fs], 2).map(([p, e]) => [p, rng.int(1, e)] as [number, number]);
        } else if (kind === "exponent") {
          const [p, e] = rng.pick(fs);
          ds = [[p, e + 1]];
          const other = fs.find(([q]) => q !== p);
          if (other) ds.push([other[0], 1]);
        } else {
          const missing = smallPrimes.filter((p) => !own.has(p) && p <= 11);
          ds = [
            [rng.pick(missing), 1],
            [fs[0]![0], 1],
          ];
        }
        ds.sort((a, b) => a[0] - b[0]);
        const d = product(ds);
        const yes = ds.every(([p, e]) => (own.get(p) ?? 0) >= e);
        const bad = ds.find(([p, e]) => (own.get(p) ?? 0) < e);
        const why = bad
          ? (own.get(bad[0]) ?? 0) === 0
            ? t(`$${bad[0]}$ is not one of the primes of $n$`, `$${bad[0]}$ 不是 $n$ 的质因数`)
            : t(
                `$${d}$ needs ${bad[1]} factors of $${bad[0]}$, but $n$ has only ${own.get(bad[0])}`,
                `$${d}$ 需要 ${bad[1]} 个因数 $${bad[0]}$，而 $n$ 只有 ${own.get(bad[0])} 个`,
              )
          : t(
              `every prime of $${d}$ appears in $n$ at least as many times`,
              `$${d}$ 的每个质因数在 $n$ 中出现的次数都不少于在 $${d}$ 中的次数`,
            );
        return choiceProblem({
          prompt: t(`Let $n = ${latex(fs)}$. Is $n$ divisible by $${d}$?`, `设 $n = ${latex(fs)}$。$n$ 能被 $${d}$ 整除吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `Factor $${d} = ${latex(ds)}$. ${yes ? "Yes" : "No"}: ${why.en}.`,
            `分解 $${d} = ${latex(ds)}$。${yes ? "能" : "不能"}：${why["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Greatest common factors and lowest common multiples

/** combine takes, for every prime of a or b, the smaller (gcf) or larger (lcm) exponent. */
function combine(a: Factors, b: Factors, op: "gcf" | "lcm"): Factors {
  const ma = new Map(a);
  const mb = new Map(b);
  const ps = [...new Set([...ma.keys(), ...mb.keys()])].sort((x, y) => x - y);
  return ps.map((p) => [p, (op === "gcf" ? Math.min : Math.max)(ma.get(p) ?? 0, mb.get(p) ?? 0)] as const).filter(([, e]) => e > 0);
}

/** commonPair draws two factorizations, neither dividing the other, whose GCF is composite and differs from the product of
 * the shared primes with their larger exponents, so that the usual mistakes give wrong answers. */
function commonPair(rng: Rng, lo: number, hi: number): [Factors, Factors] {
  for (;;) {
    const a = drawFactors(rng, lo, hi);
    const b = drawFactors(rng, lo, hi);
    const g = combine(a, b, "gcf");
    const shared = new Set(g.map(([p]) => p));
    const larger = combine(a, b, "lcm").filter(([p]) => shared.has(p));
    const [x, y] = [product(a), product(b)];
    const composite = g.length >= 2 || (g.length === 1 && g[0]![1] >= 2);
    if (composite && product(larger) !== product(g) && x % y !== 0 && y % x !== 0) return [a, b];
  }
}

/** findingGreatestCommonFactorsUsingPrimeFactorization multiplies the common primes with their smaller exponents. */
export const findingGreatestCommonFactorsUsingPrimeFactorization = topic(
  "finding-greatest-common-factors-using-prime-factorization",
  t("Finding Greatest Common Factors Using Prime Factorization", "用质因数分解求最大公因数"),
  t(
    "To find the greatest common factor of two numbers, write both prime factorizations. The GCF is the product of the primes they share, each with the smaller of its two exponents.",
    "求两个数的最大公因数，先写出它们的质因数分解。最大公因数是两数公有的质因数的乘积，每个质因数取两个指数中较小的那个。",
  ),
  ["the-fundamental-theorem-of-arithmetic", "greatest-common-factor"],
  ["6.NS.B.4"],
  [
    {
      id: "gcf-of-two-numbers",
      title: t("Two numbers", "两个数"),
      explanation: t(
        "$84 = 2^{2} \\cdot 3 \\cdot 7$ and $90 = 2 \\cdot 3^{2} \\cdot 5$. The shared primes are $2$ and $3$, and the smaller exponents are $1$ and $1$, so the GCF is $2 \\cdot 3 = 6$. Primes that appear in only one number, like $5$ and $7$, are left out.",
        "$84 = 2^{2} \\cdot 3 \\cdot 7$，$90 = 2 \\cdot 3^{2} \\cdot 5$。公有的质因数是 $2$ 和 $3$，较小的指数都是 $1$，所以最大公因数是 $2 \\cdot 3 = 6$。只在一个数中出现的质因数，如 $5$ 和 $7$，不计入。",
      ),
      generate(rng) {
        const [a, b] = commonPair(rng, 24, 400);
        const [x, y] = [product(a), product(b)];
        const g = combine(a, b, "gcf");
        const common = new Set(g.map(([p]) => p));
        // The larger exponents of the shared primes, each shared prime once, and the LCM.
        const larger = product(combine(a, b, "lcm").filter(([p]) => common.has(p)));
        return numberProblem({
          prompt: t(`Find the greatest common factor of $${x}$ and $${y}$.`, `求 $${x}$ 和 $${y}$ 的最大公因数。`),
          answer: gcd(x, y),
          form: "integer",
          wrong: [larger, [...common].reduce((v, p) => v * p, 1), lcm(x, y)],
          solution: t(
            `Write the prime factorizations:${steps(`${x} = ${latex(a)}`, `${y} = ${latex(b)}`)}Take each shared prime with the smaller exponent: $${latex(g)} = ${gcd(x, y)}$.`,
            `写出质因数分解：${steps(`${x} = ${latex(a)}`, `${y} = ${latex(b)}`)}公有的质因数各取较小的指数：$${latex(g)} = ${gcd(x, y)}$。`,
          ),
        });
      },
    },
    {
      id: "gcf-of-factored-numbers",
      title: t("Numbers given as prime factorizations", "以质因数分解给出的数"),
      explanation: t(
        "For $A = 2^{4} \\cdot 3^{2} \\cdot 7$ and $B = 2^{2} \\cdot 3^{5} \\cdot 5$, the GCF is $2^{2} \\cdot 3^{2} = 36$: the shared primes are $2$ and $3$, and their smaller exponents are $2$ and $2$. There is no need to multiply out $A$ and $B$.",
        "对于 $A = 2^{4} \\cdot 3^{2} \\cdot 7$ 和 $B = 2^{2} \\cdot 3^{5} \\cdot 5$，最大公因数是 $2^{2} \\cdot 3^{2} = 36$：公有的质因数是 $2$ 和 $3$，较小的指数分别是 $2$ 和 $2$。不需要把 $A$ 和 $B$ 乘出来。",
      ),
      generate(rng) {
        const [a, b] = commonPair(rng, 200, 100000);
        const g = combine(a, b, "gcf");
        const common = new Set(g.map(([p]) => p));
        const larger = combine(a, b, "lcm").filter(([p]) => common.has(p));
        return numberProblem({
          prompt: t(
            `$A = ${latex(a)}$ and $B = ${latex(b)}$. What is the greatest common factor of $A$ and $B$?`,
            `$A = ${latex(a)}$，$B = ${latex(b)}$。$A$ 和 $B$ 的最大公因数是多少？`,
          ),
          answer: product(g),
          form: "integer",
          // The larger exponents of the shared primes, and the shared primes without their exponents.
          wrong: [product(larger), [...common].reduce((v, p) => v * p, 1)],
          solution: t(
            `${common.size === 1 ? "The only shared prime is" : "The shared primes are"} ${[...common].map((p) => `$${p}$`).join(" and ")}. Take ${common.size === 1 ? "it" : "each"} with the smaller exponent: $${latex(g)} = ${grouped(product(g))}$.`,
            `公有的质因数${common.size === 1 ? "只有" : "是"} ${[...common].map((p) => `$${p}$`).join(" 和 ")}。${common.size === 1 ? "取" : "各取"}较小的指数：$${latex(g)} = ${grouped(product(g))}$。`,
          ),
        });
      },
    },
  ],
);

/** findingLowestCommonMultiplesUsingPrimeFactorization multiplies all the primes with their larger exponents. */
export const findingLowestCommonMultiplesUsingPrimeFactorization = topic(
  "finding-lowest-common-multiples-using-prime-factorization",
  t("Finding Lowest Common Multiples Using Prime Factorization", "用质因数分解求最小公倍数"),
  t(
    "To find the lowest common multiple of two numbers, write both prime factorizations. The LCM is the product of every prime that appears in either number, each with the larger of its two exponents.",
    "求两个数的最小公倍数，先写出它们的质因数分解。最小公倍数是在任一个数中出现的所有质因数的乘积，每个质因数取两个指数中较大的那个。",
  ),
  ["finding-greatest-common-factors-using-prime-factorization", "least-common-multiple"],
  ["6.NS.B.4"],
  [
    {
      id: "lcm-of-two-numbers",
      title: t("Two numbers", "两个数"),
      explanation: t(
        "$18 = 2 \\cdot 3^{2}$ and $60 = 2^{2} \\cdot 3 \\cdot 5$. Every prime that appears is $2$, $3$ or $5$, with larger exponents $2$, $2$ and $1$, so the LCM is $2^{2} \\cdot 3^{2} \\cdot 5 = 180$. Multiplying the numbers gives $1{,}080$, a common multiple but not the lowest.",
        "$18 = 2 \\cdot 3^{2}$，$60 = 2^{2} \\cdot 3 \\cdot 5$。出现的质因数有 $2$、$3$ 和 $5$，较大的指数分别是 $2$、$2$ 和 $1$，所以最小公倍数是 $2^{2} \\cdot 3^{2} \\cdot 5 = 180$。两数相乘得 $1{,}080$，是公倍数，但不是最小的。",
      ),
      generate(rng) {
        const [a, b] = commonPair(rng, 12, 200);
        const [x, y] = [product(a), product(b)];
        const l = combine(a, b, "lcm");
        // The product of the numbers, the GCF, and the shared primes only.
        const sharedOnly = product(l.filter(([p]) => a.some(([q]) => q === p) && b.some(([q]) => q === p)));
        return numberProblem({
          prompt: t(`Find the lowest common multiple of $${x}$ and $${y}$.`, `求 $${x}$ 和 $${y}$ 的最小公倍数。`),
          answer: lcm(x, y),
          form: "integer",
          wrong: [x * y, gcd(x, y), sharedOnly],
          solution: t(
            `Write the prime factorizations:${steps(`${x} = ${latex(a)}`, `${y} = ${latex(b)}`)}Take every prime with the larger exponent: $${latex(l)} = ${grouped(lcm(x, y))}$.`,
            `写出质因数分解：${steps(`${x} = ${latex(a)}`, `${y} = ${latex(b)}`)}每个质因数取较大的指数：$${latex(l)} = ${grouped(lcm(x, y))}$。`,
          ),
        });
      },
    },
    {
      id: "lcm-of-factored-numbers",
      title: t("Numbers given as prime factorizations", "以质因数分解给出的数"),
      explanation: t(
        "For $A = 2^{3} \\cdot 5$ and $B = 2 \\cdot 3^{2} \\cdot 5^{2}$, the LCM is $2^{3} \\cdot 3^{2} \\cdot 5^{2}$: every prime appears, with its larger exponent. Leaving out the $3^{2}$ because $A$ has no $3$ gives a number that $B$ does not divide.",
        "对于 $A = 2^{3} \\cdot 5$ 和 $B = 2 \\cdot 3^{2} \\cdot 5^{2}$，最小公倍数是 $2^{3} \\cdot 3^{2} \\cdot 5^{2}$：每个质因数都要出现，并取较大的指数。因为 $A$ 中没有 $3$ 就漏掉 $3^{2}$，得到的数不能被 $B$ 整除。",
      ),
      generate(rng) {
        const [a, b] = commonPair(rng, 20, 3000);
        const l = combine(a, b, "lcm");
        const g = combine(a, b, "gcf");
        const shared = l.filter(([p]) => g.some(([q]) => q === p));
        return numberProblem({
          prompt: t(
            `$A = ${latex(a)}$ and $B = ${latex(b)}$. What is the lowest common multiple of $A$ and $B$? Give it as a number.`,
            `$A = ${latex(a)}$，$B = ${latex(b)}$。$A$ 和 $B$ 的最小公倍数是多少？写出它的值。`,
          ),
          answer: product(l),
          form: "integer",
          // The shared primes only, the GCF, and the product A · B.
          wrong: [product(shared), product(g), product(a) * product(b)],
          solution: t(
            `Take every prime of $A$ or $B$ with the larger exponent:${steps(`${latex(l)} = ${grouped(product(l))}`)}`,
            `取 $A$ 或 $B$ 的每个质因数，指数取较大的：${steps(`${latex(l)} = ${grouped(product(l))}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade8NumberTheoryTopics lists the 8th grade topics on number theory. */
export const grade8NumberTheoryTopics: readonly TopicDef[] = [
  divisibilityOfIntegersBy2510_4And8,
  divisibilityOfIntegersBy3_9_6And7,
  primeFactorsTopic,
  theFundamentalTheoremOfArithmetic,
  findingGreatestCommonFactorsUsingPrimeFactorization,
  findingLowestCommonMultiplesUsingPrimeFactorization,
];
