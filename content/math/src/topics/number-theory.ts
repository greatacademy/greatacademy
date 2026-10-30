import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { factorizationLatex, gcd, isPrime, lcm, primeFactors } from "@ga/subject-math";

import { choiceProblem, factorizationProblem, numberProblem, steps, yesNo } from "../problems.ts";

const digitSum = (n: number) => [...String(n)].reduce((s, d) => s + Number(d), 0);

/** composite draws a composite number in [lo, hi] that is not a perfect power of one prime, so its factorization has two primes or more. */
function composite(rng: Rng, lo: number, hi: number): number {
  for (;;) {
    const n = rng.int(lo, hi);
    if (!isPrime(n) && primeFactors(n).length >= 2) return n;
  }
}

/** pair draws two numbers with a common factor other than 1, neither a multiple of the other. */
function pair(rng: Rng): [number, number] {
  for (;;) {
    const g = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15]);
    const a = g * rng.int(2, 9);
    const b = g * rng.int(2, 9);
    if (a !== b && a % b !== 0 && b % a !== 0 && a <= 120 && b <= 120) return [a, b];
  }
}

const factorLine = (n: number) => `${n} = ${factorizationLatex(primeFactors(n))}`;

export const divisibilityRules: TopicDef = {
  id: "divisibility-rules",
  title: t("Divisibility Rules", "整除的判定"),
  summary: t(
    "Tell whether a whole number is divisible by 2, 3, 4, 5, 6, 9 or 10 without dividing.",
    "不做除法，判断一个整数能否被 2、3、4、5、6、9 或 10 整除。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "divisible-by-2-5-10",
      title: t("Divisibility by 2, 5 and 10", "被 2、5、10 整除"),
      explanation: t(
        "A whole number $a$ is **divisible** by $b$ when $a \\div b$ leaves no remainder; then $b$ is a **factor** of $a$ and $a$ is a **multiple** of $b$.\n\nThe last digit decides divisibility by $2$, $5$ and $10$:\n\n- by $2$ when the last digit is $0, 2, 4, 6$ or $8$ (the number is **even**);\n- by $5$ when the last digit is $0$ or $5$;\n- by $10$ when the last digit is $0$.",
        "当 $a \\div b$ 没有余数时，称整数 $a$ 能被 $b$ **整除**；这时 $b$ 是 $a$ 的**因数**，$a$ 是 $b$ 的**倍数**。\n\n能否被 $2$、$5$、$10$ 整除只看个位：\n\n- 个位是 $0, 2, 4, 6, 8$ 时能被 $2$ 整除（这个数是**偶数**）；\n- 个位是 $0$ 或 $5$ 时能被 $5$ 整除；\n- 个位是 $0$ 时能被 $10$ 整除。",
      ),
      generate(rng) {
        const d = rng.pick([2, 5, 10]);
        const n = rng.bool() ? d * rng.int(11, 999) : rng.int(101, 9999);
        const yes = n % d === 0;
        const last = n % 10;
        const rule = {
          2: t("is even", "是偶数"),
          5: t("is $0$ or $5$", "是 $0$ 或 $5$"),
          10: t("is $0$", "是 $0$"),
        }[d]!;
        return choiceProblem({
          prompt: t(`Is $${n}$ divisible by $${d}$?`, `$${n}$ 能被 $${d}$ 整除吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `The last digit is $${last}$. A number is divisible by $${d}$ exactly when its last digit ${rule.en}, so $${n}$ is ${yes ? "" : "not "}divisible by $${d}$.`,
            `个位是 $${last}$。一个数能被 $${d}$ 整除，当且仅当它的个位${rule["zh-CN"]}，所以 $${n}$ ${yes ? "能" : "不能"}被 $${d}$ 整除。`,
          ),
        });
      },
    },
    {
      id: "divisible-by-3-4-6-9",
      title: t("Divisibility by 3, 4, 6 and 9", "被 3、4、6、9 整除"),
      explanation: t(
        "- By $3$: when the **sum of the digits** is divisible by $3$. For $741$: $7 + 4 + 1 = 12$, and $12$ is divisible by $3$, so $741$ is too.\n- By $9$: when the sum of the digits is divisible by $9$.\n- By $4$: when the number formed by the **last two digits** is divisible by $4$. $1{,}316$ is, because $16$ is.\n- By $6$: when the number is divisible by both $2$ and $3$.",
        "- 被 $3$ 整除：**各位数字之和**能被 $3$ 整除。例如 $741$：$7 + 4 + 1 = 12$，$12$ 能被 $3$ 整除，所以 $741$ 也能。\n- 被 $9$ 整除：各位数字之和能被 $9$ 整除。\n- 被 $4$ 整除：**末两位**组成的数能被 $4$ 整除。$1{,}316$ 能被 $4$ 整除，因为 $16$ 能。\n- 被 $6$ 整除：同时能被 $2$ 和 $3$ 整除。",
      ),
      generate(rng) {
        const d = rng.pick([3, 4, 6, 9]);
        const n = rng.bool() ? d * rng.int(12, 1111) : rng.int(102, 9999);
        const yes = n % d === 0;
        const s = digitSum(n);
        const lastTwo = n % 100;
        let reason: { en: string; "zh-CN": string };
        switch (d) {
          case 3:
          case 9:
            reason = t(
              `The digits add up to $${s}$, which is ${s % d === 0 ? "" : "not "}divisible by $${d}$.`,
              `各位数字之和是 $${s}$，它${s % d === 0 ? "能" : "不能"}被 $${d}$ 整除。`,
            );
            break;
          case 4:
            reason = t(
              `The last two digits form $${lastTwo}$, which is ${lastTwo % 4 === 0 ? "" : "not "}divisible by $4$.`,
              `末两位组成的数是 $${lastTwo}$，它${lastTwo % 4 === 0 ? "能" : "不能"}被 $4$ 整除。`,
            );
            break;
          default:
            reason = t(
              `$${n}$ is ${n % 2 === 0 ? "even" : "odd"}, and its digits add up to $${s}$, which is ${s % 3 === 0 ? "" : "not "}divisible by $3$. It must be divisible by both $2$ and $3$.`,
              `$${n}$ 是${n % 2 === 0 ? "偶数" : "奇数"}，各位数字之和 $${s}$ ${s % 3 === 0 ? "能" : "不能"}被 $3$ 整除；被 $6$ 整除要求同时能被 $2$ 和 $3$ 整除。`,
            );
        }
        return choiceProblem({
          prompt: t(`Is $${n}$ divisible by $${d}$?`, `$${n}$ 能被 $${d}$ 整除吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(
            `${reason.en} So $${n}$ is ${yes ? "" : "not "}divisible by $${d}$.`,
            `${reason["zh-CN"]}所以 $${n}$ ${yes ? "能" : "不能"}被 $${d}$ 整除。`,
          ),
        });
      },
    },
  ],
};

export const primeAndCompositeNumbers: TopicDef = {
  id: "prime-and-composite-numbers",
  title: t("Prime and Composite Numbers", "质数与合数"),
  summary: t("Tell primes from composite numbers by looking for factors.", "通过寻找因数区分质数与合数。"),
  prerequisites: ["divisibility-rules"],
  encompasses: [{ topic: "divisibility-rules", weight: 0.4 }],
  xp: 8,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    {
      id: "identifying-primes",
      title: t("Identifying primes", "判断质数"),
      explanation: t(
        "A **prime number** is a whole number greater than $1$ whose only factors are $1$ and itself: $2, 3, 5, 7, 11, 13, \\dots$. A whole number greater than $1$ with any other factor is **composite**: $12 = 3 \\cdot 4$. The numbers $0$ and $1$ are neither.\n\nTo test a number, try dividing it by the primes $2, 3, 5, 7, \\dots$ in turn. You can stop once the square of the prime is larger than the number: a composite number always has a factor no larger than its square root. For $91$: it is not divisible by $2$, $3$ or $5$, but $91 = 7 \\cdot 13$, so it is composite.",
        "**质数**是大于 $1$、且因数只有 $1$ 和它本身的整数：$2, 3, 5, 7, 11, 13, \\dots$。大于 $1$ 且还有其他因数的整数是**合数**，例如 $12 = 3 \\cdot 4$。$0$ 和 $1$ 既不是质数也不是合数。\n\n判断一个数时，依次用质数 $2, 3, 5, 7, \\dots$ 去除。当质数的平方已经大于这个数时就可以停止：合数一定有一个不超过它平方根的因数。例如 $91$：不能被 $2$、$3$、$5$ 整除，但 $91 = 7 \\cdot 13$，所以是合数。",
      ),
      generate(rng) {
        const n = rng.bool(0.08) ? rng.pick([0, 1]) : rng.int(2, 150);
        const correct = n < 2 ? 2 : isPrime(n) ? 0 : 1;
        const smallest = correct === 1 ? primeFactors(n)[0]![0] : 0;
        const solution =
          correct === 2
            ? t(
                `$${n}$ is neither prime nor composite: primes and composites are greater than $1$.`,
                `$${n}$ 既不是质数也不是合数：质数和合数都大于 $1$。`,
              )
            : correct === 0
              ? t(
                  `No prime whose square is at most $${n}$ divides $${n}$, so its only factors are $1$ and $${n}$: it is prime.`,
                  `平方不超过 $${n}$ 的质数都不能整除 $${n}$，所以它的因数只有 $1$ 和 $${n}$：它是质数。`,
                )
              : t(
                  `$${n} = ${smallest} \\cdot ${n / smallest}$, so $${n}$ is composite.`,
                  `$${n} = ${smallest} \\cdot ${n / smallest}$，所以 $${n}$ 是合数。`,
                );
        return choiceProblem({
          prompt: t(`Is $${n}$ prime, composite, or neither?`, `$${n}$ 是质数、合数，还是都不是？`),
          options: [t("Prime", "质数"), t("Composite", "合数"), t("Neither", "都不是")],
          correct,
          solution,
        });
      },
    },
  ],
};

export const primeFactorization: TopicDef = {
  id: "prime-factorization",
  title: t("Prime Factorization", "分解质因数"),
  summary: t("Write a whole number as a product of primes using a factor tree.", "用因数树把整数写成质数的乘积。"),
  prerequisites: ["prime-and-composite-numbers"],
  encompasses: [
    { topic: "prime-and-composite-numbers", weight: 0.5 },
    { topic: "divisibility-rules", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.6.NS.B.4"],
  knowledgePoints: [
    {
      id: "factor-trees",
      title: t("Factor trees", "因数树"),
      explanation: t(
        "Every whole number greater than $1$ can be written as a product of primes in exactly one way, apart from the order of the factors. This is its **prime factorization**.\n\nTo find it, split the number into any two factors, then keep splitting each factor that is not prime. For $60$: $60 = 6 \\cdot 10 = (2 \\cdot 3) \\cdot (2 \\cdot 5)$. Collect equal primes with exponents and write them in increasing order: $60 = 2^{2} \\cdot 3 \\cdot 5$.",
        "每个大于 $1$ 的整数都能写成质数的乘积，而且除因数的顺序外写法唯一，这就是它的**质因数分解**。\n\n方法是：先把这个数拆成任意两个因数，再继续拆其中不是质数的因数。例如 $60$：$60 = 6 \\cdot 10 = (2 \\cdot 3) \\cdot (2 \\cdot 5)$。把相同的质数用指数合并，并按从小到大排列：$60 = 2^{2} \\cdot 3 \\cdot 5$。",
      ),
      generate(rng) {
        const n = composite(rng, 12, 400);
        const fs = primeFactors(n);
        const [p] = fs[0]!;
        const answer = factorizationLatex(fs);
        // Typical mistakes: stopping at a composite factor, or dropping a repeated prime.
        const wrong = [`${p} \\cdot ${n / p}`, factorizationLatex(fs.map(([q]) => [q, 1]))];
        return factorizationProblem({
          prompt: t(`Write the prime factorization of $${n}$.`, `把 $${n}$ 分解质因数。`),
          value: n,
          wrong,
          solution: t(
            `Divide by primes repeatedly, starting with the smallest:${steps(...divisions(n))}So $${n} = ${answer}$.`,
            `从最小的质数开始反复相除：${steps(...divisions(n))}所以 $${n} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** divisions lists the steps of dividing n by its smallest prime factor until 1 is left: "60 \div 2 = 30". */
function divisions(n: number): string[] {
  const out: string[] = [];
  let m = n;
  while (m > 1) {
    const [p] = primeFactors(m)[0]!;
    out.push(`${m} \\div ${p} = ${m / p}`);
    m /= p;
  }
  return out;
}

export const greatestCommonFactor: TopicDef = {
  id: "greatest-common-factor",
  title: t("Greatest Common Factor", "最大公因数"),
  summary: t("Find the greatest common factor of two numbers from their prime factorizations.", "用质因数分解求两个数的最大公因数。"),
  prerequisites: ["prime-factorization"],
  encompasses: [{ topic: "prime-factorization", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.6.NS.B.4"],
  knowledgePoints: [
    {
      id: "gcf-from-factorizations",
      title: t("Using prime factorizations", "利用质因数分解"),
      explanation: t(
        "The **greatest common factor** (GCF) of two numbers is the largest number that divides both.\n\nWrite both prime factorizations. The GCF is the product of the primes they share, each raised to the **smaller** of its two exponents. For $36 = 2^{2} \\cdot 3^{2}$ and $60 = 2^{2} \\cdot 3 \\cdot 5$: they share $2^{2}$ and $3^{1}$, so the GCF is $2^{2} \\cdot 3 = 12$.",
        "两个数的**最大公因数**是能同时整除它们的最大的数。\n\n先写出两个数的质因数分解。最大公因数是它们共有的质数之积，每个质数取两个指数中**较小**的一个。例如 $36 = 2^{2} \\cdot 3^{2}$，$60 = 2^{2} \\cdot 3 \\cdot 5$：共有 $2^{2}$ 和 $3^{1}$，所以最大公因数是 $2^{2} \\cdot 3 = 12$。",
      ),
      generate(rng) {
        const [a, b] = pair(rng);
        const g = gcd(a, b);
        return numberProblem({
          prompt: t(`Find the greatest common factor of $${a}$ and $${b}$.`, `求 $${a}$ 和 $${b}$ 的最大公因数。`),
          answer: g,
          form: "integer",
          wrong: [lcm(a, b), a * b, primeFactors(g)[0]![0]],
          solution: t(
            `${steps(factorLine(a), factorLine(b))}Take each shared prime with its smaller exponent: the greatest common factor is $${g === 1 ? "1" : `${factorizationLatex(primeFactors(g))}${isPrime(g) ? "" : ` = ${g}`}`}$.`,
            `${steps(factorLine(a), factorLine(b))}每个共有的质数取较小的指数：最大公因数是 $${g === 1 ? "1" : `${factorizationLatex(primeFactors(g))}${isPrime(g) ? "" : ` = ${g}`}`}$。`,
          ),
        });
      },
    },
  ],
};

export const leastCommonMultiple: TopicDef = {
  id: "least-common-multiple",
  title: t("Least Common Multiple", "最小公倍数"),
  summary: t("Find the least common multiple of two numbers from their prime factorizations.", "用质因数分解求两个数的最小公倍数。"),
  prerequisites: ["prime-factorization"],
  encompasses: [{ topic: "prime-factorization", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.6.NS.B.4"],
  knowledgePoints: [
    {
      id: "lcm-from-factorizations",
      title: t("Using prime factorizations", "利用质因数分解"),
      explanation: t(
        "The **least common multiple** (LCM) of two numbers is the smallest positive number that both divide.\n\nWrite both prime factorizations. The LCM is the product of every prime that appears in either, each raised to the **larger** of its exponents. For $12 = 2^{2} \\cdot 3$ and $18 = 2 \\cdot 3^{2}$: the LCM is $2^{2} \\cdot 3^{2} = 36$.\n\nThe product $12 \\cdot 18 = 216$ is a common multiple too, but not the least one.",
        "两个数的**最小公倍数**是能被它们同时整除的最小正数。\n\n先写出两个数的质因数分解。最小公倍数是出现在任一分解中的所有质数之积，每个质数取**较大**的指数。例如 $12 = 2^{2} \\cdot 3$，$18 = 2 \\cdot 3^{2}$：最小公倍数是 $2^{2} \\cdot 3^{2} = 36$。\n\n乘积 $12 \\cdot 18 = 216$ 也是公倍数，但不是最小的。",
      ),
      generate(rng) {
        const [a, b] = pair(rng);
        const m = lcm(a, b);
        return numberProblem({
          prompt: t(`Find the least common multiple of $${a}$ and $${b}$.`, `求 $${a}$ 和 $${b}$ 的最小公倍数。`),
          answer: m,
          form: "integer",
          wrong: [a * b, gcd(a, b), Math.max(a, b)],
          solution: t(
            `${steps(factorLine(a), factorLine(b))}Take every prime with its larger exponent: the least common multiple is $${factorizationLatex(primeFactors(m))} = ${m}$.`,
            `${steps(factorLine(a), factorLine(b))}每个质数取较大的指数：最小公倍数是 $${factorizationLatex(primeFactors(m))} = ${m}$。`,
          ),
        });
      },
    },
  ],
};

/** numberTheoryTopics are the topics on divisibility, primes, and common factors and multiples. */
export const numberTheoryTopics: readonly TopicDef[] = [
  divisibilityRules,
  primeAndCompositeNumbers,
  primeFactorization,
  greatestCommonFactor,
  leastCommonMultiple,
];
