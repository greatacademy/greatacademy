// Number Theory: arithmetic functions, powers modulo n, primitive roots, quadratic
// residues and Diophantine equations, building on the divisibility and congruence
// topics of Methods of Proof and Discrete Mathematics.

import type { Figure, Problem, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";

import { numberProblem, why } from "../problems.ts";
import {
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
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Miss is a typical wrong answer with the reason a learner reaches it, in English and Chinese. */
export type Miss = readonly [value: number | Q, en: string, zh: string];

/** Walk is a titled step of a solution, with what it says in English and Chinese. */
export type Walk = readonly [title: Pair, say: Pair];

/** Slip is a wrong option with the reason a learner picks it, in English and Chinese. */
export type Slip = readonly [option: Pair, en: string, zh: string];

/** keyOf compares answers that are whole numbers or fractions. */
const keyOf = (v: number | Q) => (typeof v === "number" ? `${v}` : v.toLatex());

/** walk writes titled steps followed by a check that takes a second route. */
export const walk = (steps: readonly Walk[], check: Pair) =>
  walked(
    steps.map(([title, [en, zh]]) => [title, t(en, zh)] as const),
    t(check[0], check[1]),
  );

/** worked builds a number problem whose typical wrong answers are explained and whose solution is walked through;
 * it gives nothing when fewer than two of the wrong answers differ from the answer and from each other. */
export function worked(
  prompt: Pair,
  answer: number | Q,
  misses: readonly Miss[],
  steps: readonly Walk[],
  check: Pair,
  figure?: Figure,
): Problem | undefined {
  const seen = new Set([keyOf(answer)]);
  const kept = misses.filter(([v]) => (typeof v !== "number" || Number.isFinite(v)) && !seen.has(keyOf(v)) && Boolean(seen.add(keyOf(v))));
  if (kept.length < 2) return undefined;
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    mistakes: kept.map(([v, en, zh]) => why(v, en, zh)),
    solution: walk(steps, check),
  });
  return figure ? { ...problem, figure } : problem;
}

/** until runs a generator again until it gives a problem. */
export function until(make: () => Problem | undefined): Problem {
  for (;;) {
    const problem = make();
    if (problem) return problem;
  }
}

/** chosen builds a choice problem whose wrong options each carry their reason and whose solution is walked through. */
export function chosen(
  rng: Parameters<typeof choose>[0],
  prompt: Pair,
  correct: Pair,
  wrong: readonly Slip[],
  steps: readonly Walk[],
  check: Pair,
  figure?: Figure,
): Problem {
  const solution = walk(steps, check);
  return reasoned(
    choose(
      rng,
      prompt,
      correct,
      wrong.map(([o]) => o),
      [solution.en, solution["zh-CN"]],
      figure,
    ),
    wrong.map(([[en], why, whyZh]) => [en, why, whyZh] as const),
  );
}

/** lesson gives a topic its introduction: a worked example, a check of it, and what the lesson covers. */
export const lesson = (def: TopicDef, scene: Pair, check: Pair, plan: Pair): TopicDef => ({
  ...def,
  intro: t(`${scene[0]}\n\nCheck: ${check[0]}\n\nIn this lesson we ${plan[0]}`, `${scene[1]}\n\n检验：${check[1]}\n\n本课我们${plan[1]}`),
});

/** times writes numbers as a product, such as 2 \times 3 \times 4. */
export const times = (values: readonly number[]) => values.join(" \\times ");

/** sigma adds the positive divisors of n. */
export const sigma = (n: number) => divisors(n).reduce((a, b) => a + b, 0);

/** oddPrimes are the odd primes that the questions on residues use. */
const oddPrimes = primesUpTo(199).filter((p) => p > 2);

/** residues lists the nonzero squares modulo a prime. */
const residues = (p: number) => [...new Set(Array.from({ length: p - 1 }, (_, i) => ((i + 1) * (i + 1)) % p))].sort((a, b) => a - b);

/** legendre is the Legendre symbol of a over an odd prime p. */
export const legendre = (a: number, p: number) => {
  const value = powMod(a, (p - 1) / 2, p);
  return value === p - 1 ? -1 : value;
};

/** isPrimitiveRoot tells whether g generates the units modulo a prime. */
const isPrimitiveRoot = (g: number, p: number) => g % p !== 0 && orderMod(g, p) === p - 1;

/** mobius is the Möbius function. */
export const mobius = (n: number) => {
  const factors = factorize(n);
  return factors.some(([, e]) => e > 1) ? 0 : factors.length % 2 === 0 ? 1 : -1;
};

/** signWord writes a Legendre symbol's value as an option. */
const signWord = (v: number): Pair => same(`${v}`);

/** smallDivisors lists the divisors of n up to its square root. */
const smallDivisors = (n: number) => divisors(n).filter((d) => d * d <= n);

/** pairCheck counts the divisors of n a second way, in pairs d and n/d. */
const pairCheck = (n: number): Pair => {
  const low = smallDivisors(n);
  const square = Number.isInteger(Math.sqrt(n));
  const total = square ? 2 * low.length - 1 : 2 * low.length;
  return [
    `The divisors up to $\\sqrt{${n}}$ are $${low.join(", ")}$, and each pairs with $\\frac{${n}}{d}$${square ? `, except $${Math.sqrt(n)}$, which pairs with itself` : ""}: $${square ? `2 \\times ${low.length} - 1` : `2 \\times ${low.length}`} = ${total}$.`,
    `不超过 $\\sqrt{${n}}$ 的因数是 $${low.join(", ")}$，每个都与 $\\frac{${n}}{d}$ 配对${square ? `，只有 $${Math.sqrt(n)}$ 与自己配对` : ""}：$${square ? `2 \\times ${low.length} - 1` : `2 \\times ${low.length}`} = ${total}$。`,
  ];
};

const countingDivisors = topic(
  "counting-divisors",
  ["Counting Divisors", "因数的个数"],
  ["Count the divisors of a number from its prime factorization.", "由质因数分解求一个数的因数个数。"],
  ["properties-of-prime-divisibility"],
  [],
  [
    point(
      "divisors-from-a-factorization",
      ["Divisors from a factorization", "由分解式求因数个数"],
      [
        "A divisor of a number takes each prime of the factorization to some power from zero up to the exponent there. Those choices are independent, so the count multiplies: an exponent $e$ contributes $e + 1$ choices. For $72 = 2^{3} \\times 3^{2}$ the power of $2$ is one of $4$ choices and the power of $3$ one of $3$, so $72$ has $4 \\times 3 = 12$ divisors.\n\nCheck: listing them gives $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$, twelve divisors.\n\n> **Watch out.** Add one to each exponent before multiplying. Adding the exponents, $3 + 2 = 5$, counts only prime factors, and multiplying them, $3 \\times 2 = 6$, forgets the zeroth power, which gives divisors such as $1$ and $9$.",
        "一个数的因数，对分解式中的每个质数取从零到该指数之间的某个幂。这些选择相互独立，所以个数相乘：指数 $e$ 贡献 $e + 1$ 种选择。对 $72 = 2^{3} \\times 3^{2}$，$2$ 的幂有 $4$ 种选择，$3$ 的幂有 $3$ 种，所以 $72$ 有 $4 \\times 3 = 12$ 个因数。\n\n检验：列出来是 $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$，共十二个。\n\n> **注意。** 每个指数先加一再相乘。把指数相加 $3 + 2 = 5$ 只数到了质因数；把指数直接相乘 $3 \\times 2 = 6$ 忘了零次幂，漏掉了 $1$、$9$ 这样的因数。",
      ],
      (rng) =>
        until(() => {
          const primes = rng.shuffle([2, 3, 5, 7, 11]).slice(0, rng.int(2, 3));
          const factors = primes.sort((p, q) => p - q).map((p): [number, number] => [p, rng.int(1, 5)]);
          const answer = factors.reduce((v, [, e]) => v * (e + 1), 1);
          const sum = factors.reduce((v, [, e]) => v + e, 0);
          const shown = factorizationLatex(factors);
          const square = factors.every(([, e]) => e % 2 === 0);
          return worked(
            [`How many positive divisors does $${shown}$ have?`, `$${shown}$ 有多少个正因数？`],
            answer,
            [
              [
                sum,
                "That adds the exponents, which counts the prime factors, not the divisors.",
                "那是把指数相加，数的是质因数，不是因数。",
              ],
              [
                factors.reduce((v, [, e]) => v * e, 1),
                "That multiplies the exponents themselves and leaves out the zeroth power of each prime, so divisors such as $1$ are missed.",
                "那是把指数本身相乘，漏掉了每个质数的零次幂，所以像 $1$ 这样的因数没有数到。",
              ],
              [
                sum + 1,
                "That adds one to the sum of the exponents; the choices for different primes multiply, they do not add.",
                "那是给指数之和加一；不同质数的选择要相乘，而不是相加。",
              ],
              [
                answer - 1,
                "That leaves out one divisor, probably $1$, which takes every prime to the zeroth power.",
                "那漏掉了一个因数，多半是 $1$，它取每个质数的零次幂。",
              ],
            ],
            [
              [
                ["Read the exponents", "读出指数"],
                [`The exponents are $${factors.map(([, e]) => e).join(", ")}$.`, `指数是 $${factors.map(([, e]) => e).join(", ")}$。`],
              ],
              [
                ["Add one to each", "各加一"],
                [
                  `Each exponent $e$ allows the powers $0$ to $e$, so $${factors.map(([, e]) => e + 1).join(", ")}$ choices.`,
                  `每个指数 $e$ 允许 $0$ 到 $e$ 次幂，所以分别有 $${factors.map(([, e]) => e + 1).join(", ")}$ 种选择。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [`$${times(factors.map(([, e]) => e + 1))} = ${answer}$.`, `$${times(factors.map(([, e]) => e + 1))} = ${answer}$。`],
              ],
            ],
            [
              `Divisors pair up as $d$ and $\\frac{n}{d}$, so the count is odd exactly when the number is a square. Here ${square ? "every exponent is even" : "some exponent is odd"}, and $${answer}$ is ${answer % 2 === 1 ? "odd" : "even"}, as it should be.`,
              `因数按 $d$ 与 $\\frac{n}{d}$ 配对，所以个数为奇数当且仅当这个数是平方数。这里${square ? "每个指数都是偶数" : "有奇数指数"}，而 $${answer}$ 是${answer % 2 === 1 ? "奇数" : "偶数"}，与之相符。`,
            ],
          );
        }),
    ),
    point(
      "divisors-of-a-number",
      ["Divisors of a given number", "求给定数的因数个数"],
      [
        "To count the divisors of a number that is not yet factored, factor it first and then apply the product of the exponents plus one. Listing the divisors in pairs works for small numbers and checks the answer, since each divisor below the square root pairs with one above it. For $90 = 2 \\times 3^{2} \\times 5$ the count is $2 \\times 3 \\times 2 = 12$.\n\nCheck: the divisors up to $\\sqrt{90}$ are $1, 2, 3, 5, 6, 9$, six of them, and each pairs with one above, so there are $2 \\times 6 = 12$.\n\n> **Watch out.** A perfect square is the only case with an odd count: its square root pairs with itself, so count it once, not twice.",
        "要数还没有分解的数的因数，先分解，再用各指数加一的积。对较小的数，成对列出因数也可行，并能检验答案，因为每个小于平方根的因数都对应一个大于平方根的因数。对 $90 = 2 \\times 3^{2} \\times 5$，个数是 $2 \\times 3 \\times 2 = 12$。\n\n检验：不超过 $\\sqrt{90}$ 的因数是 $1, 2, 3, 5, 6, 9$，共六个，每个对应一个更大的因数，所以共 $2 \\times 6 = 12$ 个。\n\n> **注意。** 只有完全平方数的因数个数是奇数：它的平方根与自己配对，只能数一次，不能数两次。",
      ],
      (rng) =>
        until(() => {
          const n = pickComposite(rng, 12, 720);
          const factors = factorize(n);
          const answer = divisors(n).length;
          return worked(
            [`How many positive divisors does $${n}$ have?`, `$${n}$ 有多少个正因数？`],
            answer,
            [
              [
                factors.reduce((v, [, e]) => v + e, 0),
                "That counts the prime factors with their repeats, not the divisors.",
                "那数的是计重数的质因数，不是因数。",
              ],
              [factors.length, "That counts the distinct primes only.", "那只数了不同的质数。"],
              [
                factors.reduce((v, [, e]) => v * e, 1),
                "That multiplies the exponents without adding one, which leaves out the zeroth powers.",
                "那是把指数直接相乘，没有加一，漏掉了零次幂。",
              ],
              [
                answer - 2,
                "That leaves out $1$ and the number itself, which are divisors too.",
                "那漏掉了 $1$ 和这个数本身，它们也是因数。",
              ],
              [
                smallDivisors(n).length,
                "That counts only the divisors up to the square root; each of them pairs with another one above it.",
                "那只数了不超过平方根的因数；它们每个都对应一个更大的因数。",
              ],
            ],
            [
              [
                ["Factor", "分解"],
                [`$${n} = ${factorizationLatex(factors)}$.`, `$${n} = ${factorizationLatex(factors)}$。`],
              ],
              [
                ["Multiply the exponents plus one", "各指数加一相乘"],
                [`$${times(factors.map(([, e]) => e + 1))} = ${answer}$.`, `$${times(factors.map(([, e]) => e + 1))} = ${answer}$。`],
              ],
            ],
            pairCheck(n),
          );
        }),
    ),
  ],
);

const sumOfDivisors = topic(
  "the-sum-of-divisors-function",
  ["The Sum of Divisors Function", "因数和函数"],
  ["Add the divisors of a number, directly or through its factorization.", "直接或通过分解式求一个数的因数和。"],
  ["counting-divisors"],
  [],
  [
    point(
      "sigma-of-a-number",
      ["The sum of the divisors", "求因数和"],
      [
        "The function $\\sigma$ adds all positive divisors of a number, including one and the number itself. It is multiplicative, so for coprime parts the sums multiply. This makes a factorization the fast way: find the sum for each prime power separately, then multiply. For $12$ the divisors are $1, 2, 3, 4, 6, 12$, so $\\sigma(12) = 28$.\n\nCheck: $12 = 2^{2} \\times 3$, and $\\sigma(4) \\times \\sigma(3) = 7 \\times 4 = 28$.\n\n> **Watch out.** Forgetting the number itself is the usual slip when listing divisors by hand: $1 + 2 + 3 + 4 + 6 = 16$ is the sum of the proper divisors, not $\\sigma(12)$.",
        "函数 $\\sigma$ 把一个数的所有正因数相加，包括 1 和这个数本身。它是积性函数，所以互质部分的和可以相乘。因此用分解式最快：分别求每个质数幂的和，再相乘。$12$ 的因数是 $1, 2, 3, 4, 6, 12$，所以 $\\sigma(12) = 28$。\n\n检验：$12 = 2^{2} \\times 3$，而 $\\sigma(4) \\times \\sigma(3) = 7 \\times 4 = 28$。\n\n> **注意。** 手工列举时最常见的差错是漏掉这个数本身：$1 + 2 + 3 + 4 + 6 = 16$ 是真因数之和，不是 $\\sigma(12)$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(6, 200);
          const answer = sigma(n);
          const parts = factorize(n).map(([p, e]) => [p ** e, sigma(p ** e)] as const);
          return worked(
            [`What is $\\sigma(${n})$, the sum of the positive divisors of $${n}$?`, `$\\sigma(${n})$，即 $${n}$ 的正因数之和，是多少？`],
            answer,
            [
              [answer - n, `That leaves out $${n}$ itself, which divides $${n}$ too.`, `那漏掉了 $${n}$ 本身，它也是 $${n}$ 的因数。`],
              [answer - 1, "That leaves out the divisor $1$.", "那漏掉了因数 $1$。"],
              [divisors(n).length, "That counts the divisors instead of adding them.", "那是数因数的个数，而不是把它们相加。"],
              [answer + n, `That counts $${n}$ twice.`, `那把 $${n}$ 数了两次。`],
            ],
            [
              [
                ["List the divisors", "列出因数"],
                [`The divisors of $${n}$ are $${divisors(n).join(", ")}$.`, `$${n}$ 的因数是 $${divisors(n).join(", ")}$。`],
              ],
              [
                ["Add them", "相加"],
                [`They add to $${answer}$.`, `它们的和是 $${answer}$。`],
              ],
            ],
            parts.length === 1
              ? [
                  `$${n}$ is a prime power, and $\\sigma(${n})$ also follows from the geometric sum of its powers: $${answer}$.`,
                  `$${n}$ 是质数幂，$\\sigma(${n})$ 也可由各次幂的几何级数求出：$${answer}$。`,
                ]
              : [
                  `$\\sigma$ is multiplicative: $${parts.map(([q]) => `\\sigma(${q})`).join(" \\times ")} = ${times(parts.map(([, s]) => s))} = ${answer}$.`,
                  `$\\sigma$ 是积性函数：$${parts.map(([q]) => `\\sigma(${q})`).join(" \\times ")} = ${times(parts.map(([, s]) => s))} = ${answer}$。`,
                ],
          );
        }),
    ),
    point(
      "sigma-of-a-prime-power",
      ["The sum for a prime power", "质数幂的因数和"],
      [
        "The divisors of a prime power are the powers of that prime from the zeroth up to the given exponent. They form a geometric series, so the sum is the next power minus one, divided by the prime minus one. For $3^{3}$ that is $\\frac{3^{4} - 1}{3 - 1} = \\frac{80}{2} = 40$.\n\nCheck: adding the terms directly, $1 + 3 + 9 + 27 = 40$.\n\n> **Watch out.** Divide by the prime minus one: $3^{4} - 1 = 80$ alone is twice too big here. And start from the zeroth power, $1$, not from the prime itself.",
        "质数幂的因数是这个质数从零次到给定指数的各次幂。它们构成几何级数，所以和等于下一次幂减一，再除以质数减一。对 $3^{3}$，和是 $\\frac{3^{4} - 1}{3 - 1} = \\frac{80}{2} = 40$。\n\n检验：直接相加，$1 + 3 + 9 + 27 = 40$。\n\n> **注意。** 要除以质数减一：这里只算 $3^{4} - 1 = 80$ 会大一倍。并且要从零次幂 $1$ 开始，而不是从质数本身开始。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5, 7, 11, 13, 17, 19]);
          const k = rng.int(2, p === 2 ? 9 : p === 3 ? 6 : 4);
          const answer = (p ** (k + 1) - 1) / (p - 1);
          const powers = Array.from({ length: k + 1 }, (_, i) => p ** i);
          return worked(
            [`What is $\\sigma(${p}^{${k}})$?`, `$\\sigma(${p}^{${k}})$ 是多少？`],
            answer,
            [
              [p ** (k + 1) - 1, `That forgets to divide by $${p} - 1$.`, `那忘了除以 $${p} - 1$。`],
              [p ** k, `That is $${p}^{${k}}$ itself, only the largest divisor.`, `那是 $${p}^{${k}}$ 本身，只是最大的因数。`],
              [
                answer - 1,
                "That starts from the prime instead of from the zeroth power, $1$.",
                "那是从质数本身开始，而不是从零次幂 $1$ 开始。",
              ],
              [answer - p ** k, `That stops one power early and leaves out $${p}^{${k}}$.`, `那少加了一次幂，漏掉了 $${p}^{${k}}$。`],
              [k + 1, "That counts the divisors instead of adding them.", "那是数因数的个数，而不是把它们相加。"],
            ],
            [
              [
                ["List the divisors", "列出因数"],
                [`The divisors are $1, ${p}, \\dots, ${p}^{${k}}$.`, `因数是 $1, ${p}, \\dots, ${p}^{${k}}$。`],
              ],
              [
                ["Sum the geometric series", "求几何级数的和"],
                p === 2
                  ? [
                      `$\\frac{2^{${k + 1}} - 1}{2 - 1} = 2^{${k + 1}} - 1 = ${answer}$.`,
                      `$\\frac{2^{${k + 1}} - 1}{2 - 1} = 2^{${k + 1}} - 1 = ${answer}$。`,
                    ]
                  : [
                      `$\\frac{${p}^{${k + 1}} - 1}{${p} - 1} = \\frac{${p ** (k + 1) - 1}}{${p - 1}} = ${answer}$.`,
                      `$\\frac{${p}^{${k + 1}} - 1}{${p} - 1} = \\frac{${p ** (k + 1) - 1}}{${p - 1}} = ${answer}$。`,
                    ],
              ],
            ],
            [`Adding the terms directly, $${powers.join(" + ")} = ${answer}$.`, `直接相加，$${powers.join(" + ")} = ${answer}$。`],
          );
        }),
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
        "The proper divisors of a number are all its positive divisors except the number itself. Their sum is $\\sigma$ of the number minus the number. Comparing this sum with the number is what sorts numbers into kinds. For $20$ the proper divisors are $1, 2, 4, 5, 10$, which add to $22$.\n\nCheck: $\\sigma(20) = \\sigma(4) \\times \\sigma(5) = 7 \\times 6 = 42$, and $42 - 20 = 22$.\n\n> **Watch out.** One counts as a proper divisor of every number greater than one, and it is easily left out when adding them; the number itself is the one divisor to leave out.",
        "一个数的真因数是除它本身以外的所有正因数。它们的和等于这个数的 $\\sigma$ 值减去这个数。把这个和与这个数比较，就能给数分类。$20$ 的真因数是 $1, 2, 4, 5, 10$，和为 $22$。\n\n检验：$\\sigma(20) = \\sigma(4) \\times \\sigma(5) = 7 \\times 6 = 42$，而 $42 - 20 = 22$。\n\n> **注意。** 1 是每个大于 1 的数的真因数，相加时很容易漏掉；要去掉的只有这个数本身。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(10, 300);
          const answer = sigma(n) - n;
          const proper = divisors(n).filter((d) => d < n);
          return worked(
            [`What is the sum of the proper divisors of $${n}$?`, `$${n}$ 的真因数之和是多少？`],
            answer,
            [
              [sigma(n), `That includes $${n}$ itself, which is not a proper divisor.`, `那包括了 $${n}$ 本身，它不是真因数。`],
              [answer - 1, "That leaves out $1$, which is a proper divisor.", "那漏掉了 $1$，它是真因数。"],
              [n, "That is the number itself, not the sum of its proper divisors.", "那是这个数本身，不是它的真因数之和。"],
              [proper.length, "That counts the proper divisors instead of adding them.", "那是数真因数的个数，而不是把它们相加。"],
            ],
            [
              [
                ["List the proper divisors", "列出真因数"],
                [`They are $${proper.join(", ")}$.`, `它们是 $${proper.join(", ")}$。`],
              ],
              [
                ["Add them", "相加"],
                [`They add to $${answer}$.`, `它们的和是 $${answer}$。`],
              ],
            ],
            [
              `$\\sigma(${n}) = ${sigma(n)}$, and $${sigma(n)} - ${n} = ${answer}$.`,
              `$\\sigma(${n}) = ${sigma(n)}$，而 $${sigma(n)} - ${n} = ${answer}$。`,
            ],
          );
        }),
    ),
    point(
      "classifying-a-number-by-its-divisors",
      ["Classifying by the proper divisors", "按真因数分类"],
      [
        "A number is perfect when its proper divisors add up to exactly the number, abundant when they add up to more, and deficient when they add up to less. Six and 28 are the first perfect numbers, and these are rare. Every prime is deficient, since its only proper divisor is one. For $12$ the proper divisors $1, 2, 3, 4, 6$ add to $16 > 12$, so $12$ is abundant.\n\nCheck: equivalently compare $\\sigma(12) = 28$ with $2 \\times 12 = 24$; since $28 > 24$, $12$ is abundant.\n\n> **Watch out.** Leave the number itself out of the sum. With it included, the sum always exceeds the number, and every number would look abundant.",
        "真因数之和恰好等于这个数时，它是完全数；大于时是过剩数；小于时是亏数。6 和 28 是最小的完全数，这种数很稀少。每个质数都是亏数，因为它唯一的真因数是 1。$12$ 的真因数 $1, 2, 3, 4, 6$ 之和为 $16 > 12$，所以 $12$ 是过剩数。\n\n检验：也可以比较 $\\sigma(12) = 28$ 与 $2 \\times 12 = 24$；因为 $28 > 24$，$12$ 是过剩数。\n\n> **注意。** 求和时不要包括这个数本身。包括它的话，和总是大于这个数，每个数都会像是过剩数。",
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
        const reasons: Record<string, readonly [string, string]> = {
          perfect: [
            `That needs the proper divisors to add to exactly $${n}$, but they add to $${sum}$.`,
            `那要求真因数之和恰好是 $${n}$，但它们的和是 $${sum}$。`,
          ],
          abundant:
            sum < n
              ? [
                  `That would need a sum above $${n}$; including $${n}$ itself gives $${sigma(n)}$, but the proper divisors add to only $${sum}$.`,
                  `那要求和大于 $${n}$；把 $${n}$ 本身算进去是 $${sigma(n)}$，但真因数之和只有 $${sum}$。`,
                ]
              : [`That needs a sum above $${n}$, but the sum is exactly $${n}$.`, `那要求和大于 $${n}$，但和恰好是 $${n}$。`],
          deficient: [
            `That needs a sum below $${n}$, but the proper divisors add to $${sum}$.`,
            `那要求和小于 $${n}$，但真因数之和是 $${sum}$。`,
          ],
        };
        const relation = sum === n ? ["equal to", "等于"] : sum > n ? ["more than", "大于"] : ["less than", "小于"];
        const twice = sigma(n) === 2 * n ? "=" : sigma(n) > 2 * n ? ">" : "<";
        return chosen(
          rng,
          [`What kind of number is $${n}$?`, `$${n}$ 是哪一类数？`],
          words[kind] as Pair,
          Object.entries(words)
            .filter(([k]) => k !== kind)
            .map(([k, w]) => [w, ...(reasons[k] as readonly [string, string])] as const),
          [
            [
              ["List the proper divisors", "列出真因数"],
              [
                `They are $${divisors(n)
                  .filter((d) => d < n)
                  .join(", ")}$.`,
                `它们是 $${divisors(n)
                  .filter((d) => d < n)
                  .join(", ")}$。`,
              ],
            ],
            [
              ["Compare", "比较"],
              [`They add to $${sum}$, which is ${relation[0]} $${n}$.`, `它们的和是 $${sum}$，${relation[1]} $${n}$。`],
            ],
          ],
          [
            `$\\sigma(${n}) = ${sigma(n)} ${twice} ${2 * n} = 2 \\times ${n}$, which says the same.`,
            `$\\sigma(${n}) = ${sigma(n)} ${twice} ${2 * n} = 2 \\times ${n}$，结论相同。`,
          ],
        );
      },
    ),
  ],
);

/** pw writes a power, leaving out an exponent of one. */
export const pw = (base: number | string, e: number) => (e === 1 ? `${base}` : `${base}^{${e}}`);

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
        "A composite number up to $N$ has a prime factor no larger than the square root of $N$, because two factors both above the root would multiply to more than $N$. So the sieve can stop once it has crossed out the multiples of every prime up to the root. Everything left is prime, without testing any further. For $N = 150$, $\\sqrt{150} \\approx 12.2$, so crossing out the multiples of $2, 3, 5, 7, 11$ is enough.\n\nCheck: the next prime, $13$, has $13^{2} = 169 > 150$, so every multiple of $13$ up to $150$ also has a smaller prime factor and is already crossed out.\n\n> **Watch out.** The last prime to use is the largest prime not above the root, not the root itself and not the first prime past it. For $150$ that is $11$, not $12$ and not $13$.",
        "不超过 $N$ 的合数，一定有一个不大于 $N$ 的平方根的质因数，因为两个都大于平方根的因数相乘会超过 $N$。所以筛法把不超过平方根的每个质数的倍数划掉后就可以停止。剩下的都是质数，不用再检验。对 $N = 150$，$\\sqrt{150} \\approx 12.2$，所以划掉 $2, 3, 5, 7, 11$ 的倍数就够了。\n\n检验：下一个质数 $13$ 满足 $13^{2} = 169 > 150$，所以不超过 $150$ 的 $13$ 的倍数都还有更小的质因数，已经被划掉了。\n\n> **注意。** 最后要用的质数是不超过平方根的最大质数，不是平方根本身，也不是超过平方根的第一个质数。对 $150$ 是 $11$，不是 $12$，也不是 $13$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(30, 2000);
          const root = Math.floor(Math.sqrt(n));
          const answer = primesUpTo(root).at(-1) as number;
          const after = primesUpTo(root + 40).find((p) => p > root) as number;
          return worked(
            [
              `To find all primes up to $${n}$ with the sieve, what is the largest prime whose multiples must be crossed out?`,
              `用筛法求出不超过 $${n}$ 的所有质数时，必须划掉其倍数的最大质数是多少？`,
            ],
            answer,
            [
              [
                after,
                `That is the first prime past the root; its square, $${after * after}$, is above $${n}$, so its multiples are already crossed out.`,
                `那是超过平方根的第一个质数；它的平方 $${after * after}$ 大于 $${n}$，所以它的倍数已经被划掉了。`,
              ],
              [
                root,
                `That is $\\sqrt{${n}}$ rounded down, but $${root}$ is not prime, and its multiples go with its prime factors.`,
                `那是 $\\sqrt{${n}}$ 向下取整，但 $${root}$ 不是质数，它的倍数随它的质因数一起被划掉。`,
              ],
              [
                Math.floor(n / 2),
                `That stops at half of $${n}$, which is far more than needed; the square root is the bound.`,
                `那是停在 $${n}$ 的一半，远远超过需要；界限是平方根。`,
              ],
              [
                primesUpTo(n).at(-1) as number,
                `That is the largest prime up to $${n}$, which the sieve finds, not one it must sieve with.`,
                `那是不超过 $${n}$ 的最大质数，它是筛出来的结果，而不是要用来筛的质数。`,
              ],
            ],
            [
              [
                ["Find the root", "求平方根"],
                [`$\\sqrt{${n}}$ lies between $${root}$ and $${root + 1}$.`, `$\\sqrt{${n}}$ 在 $${root}$ 和 $${root + 1}$ 之间。`],
              ],
              [
                ["Take the largest prime below it", "取不超过它的最大质数"],
                [`The primes up to $${root}$ end with $${answer}$.`, `不超过 $${root}$ 的质数中最大的是 $${answer}$。`],
              ],
            ],
            [
              `$${answer}^{2} = ${answer * answer} \\le ${n}$, while the next prime has $${after}^{2} = ${after * after} > ${n}$.`,
              `$${answer}^{2} = ${answer * answer} \\le ${n}$，而下一个质数满足 $${after}^{2} = ${after * after} > ${n}$。`,
            ],
          );
        }),
    ),
    point(
      "testing-primes-up-to-the-root",
      ["Finding the prime among four", "四个数中找质数"],
      [
        "To test a number for primality, try dividing by each prime up to its square root. Numbers such as 91, 119 and 133 look prime because no small rule catches them, yet they have factors of seven. Once the primes up to the root are exhausted without a divisor, the number is prime, and no larger candidate needs checking. For $127$, $\\sqrt{127} \\approx 11.3$, and none of $2, 3, 5, 7, 11$ divides it, so $127$ is prime.\n\nCheck: the remainders are $127 = 2 \\times 63 + 1 = 3 \\times 42 + 1 = 5 \\times 25 + 2 = 7 \\times 18 + 1 = 11 \\times 11 + 6$, none of them zero.\n\n> **Watch out.** Passing the tests for $2$, $3$ and $5$ does not make a number prime: $91 = 7 \\times 13$ and $143 = 11 \\times 13$ pass all three.",
        "检验一个数是否为质数，要用不超过它平方根的每个质数去除。91、119、133 这样的数看起来像质数，因为简单的规则查不出来，但它们都有因数 7。不超过平方根的质数都除不尽时，这个数就是质数，不需要再试更大的数。对 $127$，$\\sqrt{127} \\approx 11.3$，$2, 3, 5, 7, 11$ 都不能整除它，所以 $127$ 是质数。\n\n检验：余数分别是 $127 = 2 \\times 63 + 1 = 3 \\times 42 + 1 = 5 \\times 25 + 2 = 7 \\times 18 + 1 = 11 \\times 11 + 6$，都不为零。\n\n> **注意。** 通过 $2$、$3$、$5$ 的检验并不说明是质数：$91 = 7 \\times 13$，$143 = 11 \\times 13$ 都能通过这三项检验。",
      ],
      (rng) => {
        const prime = rng.pick(primesUpTo(400).filter((p) => p > 50));
        const hard = Array.from({ length: 400 }, (_, i) => i + 50).filter((n) => !isPrime(n) && n % 2 !== 0 && n % 3 !== 0 && n % 5 !== 0);
        const others = rng.shuffle(hard).slice(0, 3);
        const [lo, hi] = bounds([prime, ...others]);
        const tried = primesUpTo(Math.floor(Math.sqrt(prime)));
        return chosen(
          rng,
          [`Which of these numbers between $${lo}$ and $${hi}$ is prime?`, `下列在 $${lo}$ 和 $${hi}$ 之间的数中，哪个是质数？`],
          same(`${prime}`),
          others.map((n) => {
            const f = factorizationLatex(factorize(n));
            return [
              same(`${n}`),
              `It passes the tests for 2, 3 and 5, but $${n} = ${f}$, so it is composite.`,
              `它能通过 2、3、5 的检验，但 $${n} = ${f}$，所以是合数。`,
            ] as const;
          }),
          [
            [
              ["Factor the others", "分解其余的数"],
              [
                `${others.map((n) => `$${n} = ${factorizationLatex(factorize(n))}$`).join(", ")}.`,
                `${others.map((n) => `$${n} = ${factorizationLatex(factorize(n))}$`).join("，")}。`,
              ],
            ],
            [
              ["Test the remaining one", "检验剩下的数"],
              [
                `The primes up to $\\sqrt{${prime}}$ are $${tried.join(", ")}$, and none of them divides $${prime}$, so it is prime.`,
                `不超过 $\\sqrt{${prime}}$ 的质数是 $${tried.join(", ")}$，它们都不能整除 $${prime}$，所以它是质数。`,
              ],
            ],
          ],
          [
            `The remainders of $${prime}$ on division by $${tried.join(", ")}$ are $${tried.map((p) => prime % p).join(", ")}$, none of them zero.`,
            `$${prime}$ 除以 $${tried.join(", ")}$ 的余数是 $${tried.map((p) => prime % p).join(", ")}$，都不为零。`,
          ],
        );
      },
    ),
  ],
);

/** decadeCounts counts the primes in each block of ten up to x. */
const decadeCounts = (x: number) => {
  const list = primesUpTo(x);
  return Array.from({ length: Math.ceil(x / 10) }, (_, i) => list.filter((p) => p > 10 * i && p <= 10 * (i + 1)).length);
};

const countingPrimes = topic(
  "the-distribution-of-primes",
  ["The Distribution of Primes", "质数的分布"],
  ["Count primes exactly for small bounds, and estimate them for large ones.", "在范围较小时准确数质数，在范围较大时作估计。"],
  ["the-sieve-of-eratosthenes"],
  [["the-sieve-of-eratosthenes", 0.3]],
  [
    {
      ...point(
        "the-prime-counting-function",
        ["The prime counting function", "质数计数函数"],
        [
          "The function $\\pi(x)$ counts the primes up to $x$, and it has nothing to do with the circle constant. The value does not change between one prime and the next, so it is a staircase that rises by one at each prime. For $x = 30$ the primes are $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$, so $\\pi(30) = 10$.\n\nCheck: by blocks of ten, there are $4$ primes up to $10$, $4$ from $11$ to $20$ and $2$ from $21$ to $30$, and $4 + 4 + 2 = 10$.\n\n> **Watch out.** Two counts as prime and one does not, which is the commonest source of an off-by-one error. And the answer is how many primes there are, not the largest of them.",
          "函数 $\\pi(x)$ 数不超过 $x$ 的质数个数，它和圆周率没有关系。在相邻两个质数之间，它的值不变，所以它是一段段台阶，每遇到一个质数就升高 1。对 $x = 30$，质数是 $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$，所以 $\\pi(30) = 10$。\n\n检验：按每十个一段，不超过 $10$ 的有 $4$ 个，$11$ 到 $20$ 有 $4$ 个，$21$ 到 $30$ 有 $2$ 个，$4 + 4 + 2 = 10$。\n\n> **注意。** 2 是质数，1 不是，这是差一错误最常见的来源。而且答案是质数的个数，不是其中最大的质数。",
        ],
        (rng) =>
          until(() => {
            const x = rng.int(12, 120);
            const list = primesUpTo(x);
            const answer = list.length;
            const blocks = decadeCounts(x);
            return worked(
              [`What is $\\pi(${x})$, the number of primes up to $${x}$?`, `$\\pi(${x})$，即不超过 $${x}$ 的质数个数，是多少？`],
              answer,
              [
                [answer + 1, "That counts $1$ as a prime, but $1$ is not prime.", "那把 $1$ 算成了质数，但 $1$ 不是质数。"],
                [answer - 1, "That leaves out $2$, the one even prime.", "那漏掉了 $2$，唯一的偶质数。"],
                [
                  list.at(-1) as number,
                  "That is the largest prime up to the bound, not the number of primes.",
                  "那是不超过这个界限的最大质数，不是质数的个数。",
                ],
                [Math.ceil(x / 2), "That counts the odd numbers, many of which are composite.", "那数的是奇数，其中很多是合数。"],
              ],
              [
                [
                  ["List the primes", "列出质数"],
                  [`The primes up to $${x}$ are $${list.join(", ")}$.`, `不超过 $${x}$ 的质数是 $${list.join(", ")}$。`],
                ],
                [
                  ["Count them", "数个数"],
                  [`There are $${answer}$ of them.`, `一共 $${answer}$ 个。`],
                ],
              ],
              [
                `By blocks of ten, the counts are $${blocks.join(", ")}$, and $${blocks.join(" + ")} = ${answer}$.`,
                `按每十个一段，个数分别是 $${blocks.join(", ")}$，而 $${blocks.join(" + ")} = ${answer}$。`,
              ],
            );
          }),
      ),
      figure: numberTheoryDrawings1["the-distribution-of-primes#the-prime-counting-function"],
    },
    point(
      "estimating-with-the-prime-number-theorem",
      ["Estimating with the prime number theorem", "用素数定理估计"],
      [
        "The prime number theorem says that the number of primes up to $x$ is close to $\\frac{x}{\\ln x}$, in the sense that the ratio tends to one. The estimate runs a little low, but it shows how primes thin out: near $x$, about one number in every $\\ln x$ is prime, though the gaps vary a great deal. For $x = 10000$, $\\ln 10000 \\approx 9.210$, and $\\frac{10000}{9.210} \\approx 1086$.\n\nCheck: the true count is $\\pi(10000) = 1229$, a little above the estimate, as expected, and the ratio $\\frac{1229}{1086} \\approx 1.13$ is near one.\n\n> **Watch out.** The logarithm is the natural one. Using $\\log_{10}$ gives $\\frac{10000}{4} = 2500$, about twice the true count.",
        "素数定理说，不超过 $x$ 的质数个数接近 $\\frac{x}{\\ln x}$，意思是两者之比趋向于 1。这个估计略微偏低，但它显示了质数怎样变稀：在 $x$ 附近，大约每 $\\ln x$ 个数中有一个质数，不过间隔变化很大。对 $x = 10000$，$\\ln 10000 \\approx 9.210$，$\\frac{10000}{9.210} \\approx 1086$。\n\n检验：真实个数是 $\\pi(10000) = 1229$，比估计稍多，符合预期，比值 $\\frac{1229}{1086} \\approx 1.13$ 接近 1。\n\n> **注意。** 这里的对数是自然对数。用 $\\log_{10}$ 会得到 $\\frac{10000}{4} = 2500$，约为真实个数的两倍。",
      ],
      (rng) =>
        until(() => {
          const x = 1000 * rng.int(1, 40);
          const answer = Math.round(x / Math.log(x));
          const truth = primesUpTo(x).length;
          return worked(
            [
              `Using $\\frac{x}{\\ln x}$, estimate the number of primes up to $${x}$, to the nearest whole number.`,
              `用 $\\frac{x}{\\ln x}$ 估计不超过 $${x}$ 的质数个数，结果取最接近的整数。`,
            ],
            answer,
            [
              [
                Math.round(x / Math.log10(x)),
                "That uses the base-ten logarithm; the theorem uses the natural logarithm.",
                "那用的是以 10 为底的对数；定理用的是自然对数。",
              ],
              [
                Math.round(x / Math.log2(x)),
                "That uses the base-two logarithm; the theorem uses the natural logarithm.",
                "那用的是以 2 为底的对数；定理用的是自然对数。",
              ],
              [
                Math.round(Math.log(x)),
                "That is $\\ln x$ itself, the typical gap between primes, not their number.",
                "那是 $\\ln x$ 本身，即质数间的典型间隔，不是质数的个数。",
              ],
              [
                Math.round(x / 2),
                "That counts the odd numbers, which overstates the primes greatly.",
                "那数的是奇数，大大高估了质数的个数。",
              ],
            ],
            [
              [
                ["Take the natural logarithm", "求自然对数"],
                [`$\\ln ${x} \\approx ${Math.log(x).toFixed(3)}$.`, `$\\ln ${x} \\approx ${Math.log(x).toFixed(3)}$。`],
              ],
              [
                ["Divide", "相除"],
                [
                  `$\\frac{${x}}{${Math.log(x).toFixed(3)}} \\approx ${answer}$.`,
                  `$\\frac{${x}}{${Math.log(x).toFixed(3)}} \\approx ${answer}$。`,
                ],
              ],
            ],
            [
              `The true count is $\\pi(${x}) = ${truth}$, a little above the estimate, as the theorem's estimate runs low.`,
              `真实个数是 $\\pi(${x}) = ${truth}$，比估计稍多，因为定理的估计偏低。`,
            ],
          );
        }),
    ),
  ],
);

/** binaryPlan lists the squares a^(2^i) modulo n and the ones the binary digits of k select. */
const binaryPlan = (a: number, k: number, n: number) => {
  const bits = k.toString(2).split("").reverse();
  const squares = bits.map((_, i) => powMod(a, 2 ** i, n));
  const used = bits.flatMap((b, i) => (b === "1" ? [i] : []));
  return { squares, used };
};

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
        "A large power need not be computed in full before reducing. Square the base repeatedly, reducing after each step, and then multiply together the squares that match the binary digits of the exponent. Each reduction keeps the numbers small, so even an exponent in the thousands takes only a dozen multiplications. For $3^{13} \\bmod 7$: $13 = 8 + 4 + 1$, and the squares are $3$, $3^{2} \\equiv 2$, $3^{4} \\equiv 4$, $3^{8} \\equiv 2$, so $3^{13} \\equiv 2 \\times 4 \\times 3 = 24 \\equiv 3 \\pmod{7}$.\n\nCheck: $3^{6} \\equiv 1 \\pmod{7}$, so $3^{13} = (3^{6})^{2} \\times 3 \\equiv 3$.\n\n> **Watch out.** Reduce the base and the intermediate products modulo $n$, never the exponent: $3^{13}$ is not $3^{6}$ just because $13 \\equiv 6 \\pmod{7}$.",
        "大的幂不必先完整算出再取余。反复把底数平方，每一步都取余，再把与指数二进制各位对应的平方乘起来。每次取余都让数保持很小，所以即使指数有几千，也只需要十来次乘法。求 $3^{13} \\bmod 7$：$13 = 8 + 4 + 1$，各平方是 $3$，$3^{2} \\equiv 2$，$3^{4} \\equiv 4$，$3^{8} \\equiv 2$，所以 $3^{13} \\equiv 2 \\times 4 \\times 3 = 24 \\equiv 3 \\pmod{7}$。\n\n检验：$3^{6} \\equiv 1 \\pmod{7}$，所以 $3^{13} = (3^{6})^{2} \\times 3 \\equiv 3$。\n\n> **注意。** 要对底数和中间的积取模 $n$，而不能对指数取模：不能因为 $13 \\equiv 6 \\pmod{7}$ 就把 $3^{13}$ 当成 $3^{6}$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(7, 40);
          const a = rng.int(2, n - 1);
          const k = rng.int(9, 64);
          const answer = powMod(a, k, n);
          const { squares, used } = binaryPlan(a, k, n);
          const before = powMod(a, k - 1, n);
          return worked(
            [`What is the remainder of $${a}^{${k}}$ when divided by $${n}$?`, `$${a}^{${k}}$ 除以 $${n}$ 的余数是多少？`],
            answer,
            [
              [
                (a * k) % n,
                `That multiplies the base by the exponent, $${a} \\times ${k}$, instead of raising it to the power.`,
                `那是把底数乘以指数 $${a} \\times ${k}$，而不是求幂。`,
              ],
              [
                powMod(a, k % n, n),
                `That reduces the exponent modulo $${n}$, which is not allowed; only the base and the products may be reduced.`,
                `那是把指数模 $${n}$ 约简，这是不允许的；只能对底数和积取模。`,
              ],
              [
                powMod(a, k + 1, n),
                "That multiplies in one factor too many, so it is the next power.",
                "那多乘了一个因子，得到的是下一次幂。",
              ],
              [before, "That is one power short, so it leaves out a factor of the base.", "那少乘了一次，漏掉了一个底数因子。"],
            ],
            [
              [
                ["Write the exponent in binary", "把指数写成二进制"],
                [
                  `$${k} = ${used
                    .map((i) => 2 ** i)
                    .reverse()
                    .join(" + ")}$.`,
                  `$${k} = ${used
                    .map((i) => 2 ** i)
                    .reverse()
                    .join(" + ")}$。`,
                ],
              ],
              [
                ["Square repeatedly", "反复平方"],
                [
                  `Modulo $${n}$: ${squares.map((s, i) => `$${pw(a, 2 ** i)} \\equiv ${s}$`).join(", ")}.`,
                  `模 $${n}$：${squares.map((s, i) => `$${pw(a, 2 ** i)} \\equiv ${s}$`).join("，")}。`,
                ],
              ],
              [
                ["Multiply the chosen squares", "把选中的平方相乘"],
                [
                  `$${times(used.map((i) => squares[i] as number))} \\equiv ${answer} \\pmod{${n}}$.`,
                  `$${times(used.map((i) => squares[i] as number))} \\equiv ${answer} \\pmod{${n}}$。`,
                ],
              ],
            ],
            [
              `$${a}^{${k - 1}} \\equiv ${before}$, and $${before} \\times ${a} = ${before * a} \\equiv ${answer} \\pmod{${n}}$.`,
              `$${a}^{${k - 1}} \\equiv ${before}$，而 $${before} \\times ${a} = ${before * a} \\equiv ${answer} \\pmod{${n}}$。`,
            ],
          );
        }),
    ),
    point(
      "the-last-digit-of-a-power",
      ["The last digit of a power", "幂的个位数字"],
      [
        "The last digit of a number is its remainder modulo ten, and the last digits of powers repeat in a short cycle. Powers of 3, for instance, end in 3, 9, 7, 1 and then start over. So only the exponent's position in the cycle matters, which means that a huge exponent is no harder to handle than a small one. For $7^{2026}$: the last digits of powers of $7$ run $7, 9, 3, 1$, and $2026 = 4 \\times 506 + 2$, so $7^{2026}$ ends in $9$.\n\nCheck: $7^{2} = 49$ ends in $9$, and $7^{2026} = (7^{4})^{506} \\times 7^{2}$ with $7^{4} = 2401$ ending in $1$.\n\n> **Watch out.** Reduce the exponent by the cycle length, four, not by ten; and when the remainder is zero, the position is the last one in the cycle, not the first.",
        "一个数的个位数字就是它模 10 的余数，幂的个位数字按短周期重复。例如 3 的幂依次以 3、9、7、1 结尾，然后重新开始。所以只有指数在周期中的位置才重要，这意味着很大的指数并不比小指数更难处理。求 $7^{2026}$：$7$ 的幂的个位数字依次是 $7, 9, 3, 1$，而 $2026 = 4 \\times 506 + 2$，所以 $7^{2026}$ 的个位是 $9$。\n\n检验：$7^{2} = 49$ 的个位是 $9$，而 $7^{2026} = (7^{4})^{506} \\times 7^{2}$，其中 $7^{4} = 2401$ 的个位是 $1$。\n\n> **注意。** 要按周期长度 4 约简指数，而不是按 10；余数为零时，位置是周期的最后一个，而不是第一个。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([2, 3, 4, 7, 8, 9, 12, 13, 17, 18, 23, 27]);
          const k = rng.int(20, 2024);
          const answer = powMod(a, k, 10);
          const cycle = [1, 2, 3, 4].map((i) => powMod(a, i, 10));
          const place = ((k - 1) % 4) + 1;
          const d = a % 10;
          return worked(
            [`What is the last digit of $${a}^{${k}}$?`, `$${a}^{${k}}$ 的个位数字是多少？`],
            answer,
            [
              [
                d,
                "That is the last digit of the base; the last digit changes with each power.",
                "那是底数的个位数字；幂的个位数字每次都在变。",
              ],
              [
                powMod(a, k % 10, 10),
                "That reduces the exponent modulo ten, but the last digits repeat every four powers.",
                "那是把指数模 10 约简，但个位数字每四次幂重复一次。",
              ],
              [powMod(a, k + 1, 10), "That takes the next place in the cycle, one step too far.", "那取了周期中的下一个位置，多走了一步。"],
              [
                (d * k) % 10,
                "That multiplies the last digit by the exponent instead of raising it to the power.",
                "那是把个位数字乘以指数，而不是求幂。",
              ],
            ],
            [
              [
                ["Find the cycle", "找出周期"],
                [
                  `The last digits of $${a}, ${a}^{2}, ${a}^{3}, ${a}^{4}$ are $${cycle.join(", ")}$, and then they repeat.`,
                  `$${a}, ${a}^{2}, ${a}^{3}, ${a}^{4}$ 的个位数字是 $${cycle.join(", ")}$，然后重复。`,
                ],
              ],
              [
                ["Find the place", "找出位置"],
                [
                  `$${k}$ leaves remainder $${k % 4}$ on division by $4$, so the place is $${place}$.`,
                  `$${k}$ 除以 $4$ 余 $${k % 4}$，所以位置是第 $${place}$ 个。`,
                ],
              ],
              [
                ["Read the digit", "读出数字"],
                [`Place $${place}$ in the cycle is $${answer}$.`, `周期中第 $${place}$ 个是 $${answer}$。`],
              ],
            ],
            [
              `Only the last digit of the base matters: $${pw(d, place)} = ${d ** place}$, which ends in $${answer}$.`,
              `只有底数的个位数字起作用：$${pw(d, place)} = ${d ** place}$，个位是 $${answer}$。`,
            ],
          );
        }),
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
        "For a prime $p$ and a number $a$ not divisible by it, $a^{p-1}$ leaves remainder one. So exponents may be reduced modulo $p - 1$, not modulo $p$. This turns an enormous exponent into one smaller than $p$. The theorem needs $p$ to be prime and $a$ to be coprime to it, and both conditions should be checked first. For $2^{100} \\bmod 11$: $100 = 10 \\times 10 + 0$, so $2^{100} = (2^{10})^{10} \\equiv 1$.\n\nCheck: $2^{10} = 1024 = 11 \\times 93 + 1$, so indeed $2^{10} \\equiv 1 \\pmod{11}$.\n\n> **Watch out.** The exponent is reduced modulo $p - 1$, not $p$: reducing $100$ modulo $11$ would leave the exponent $1$ and give $2$, which is wrong.",
        "对质数 $p$ 和不被它整除的数 $a$，$a^{p-1}$ 除以 $p$ 余 1。所以指数可以模 $p - 1$ 约简，而不是模 $p$。这能把极大的指数变成比 $p$ 小的指数。这个定理要求 $p$ 是质数且 $a$ 与它互质，这两个条件要先检查。求 $2^{100} \\bmod 11$：$100 = 10 \\times 10 + 0$，所以 $2^{100} = (2^{10})^{10} \\equiv 1$。\n\n检验：$2^{10} = 1024 = 11 \\times 93 + 1$，确实 $2^{10} \\equiv 1 \\pmod{11}$。\n\n> **注意。** 指数要模 $p - 1$ 约简，而不是模 $p$：把 $100$ 模 $11$ 约简会让指数变成 $1$、结果为 $2$，这是错的。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([5, 7, 11, 13, 17, 19, 23, 29, 31]);
          const a = rng.int(2, p - 1);
          const k = rng.int(100, 9999);
          const reduced = k % (p - 1);
          const q = (k - reduced) / (p - 1);
          const answer = powMod(a, k, p);
          return worked(
            [`What is the remainder of $${a}^{${k}}$ when divided by $${p}$?`, `$${a}^{${k}}$ 除以 $${p}$ 的余数是多少？`],
            answer,
            [
              [
                powMod(a, k % p, p),
                `That reduces the exponent modulo $${p}$; Fermat's theorem lets it be reduced modulo $${p - 1}$.`,
                `那是把指数模 $${p}$ 约简；费马定理允许的是模 $${p - 1}$ 约简。`,
              ],
              [
                reduced,
                "That stops at the reduced exponent and forgets to raise the base to it.",
                "那停在了约简后的指数，忘了再求底数的这次幂。",
              ],
              [
                1,
                `That takes the whole power to be $1$, but $${k}$ is not a multiple of $${p - 1}$.`,
                `那把整个幂当成 $1$，但 $${k}$ 不是 $${p - 1}$ 的倍数。`,
              ],
              [
                (a * reduced) % p,
                "That multiplies the base by the reduced exponent instead of raising it to that power.",
                "那是把底数乘以约简后的指数，而不是求幂。",
              ],
            ],
            [
              [
                ["Check the conditions", "检查条件"],
                [
                  `$${p}$ is prime and does not divide $${a}$, so $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$.`,
                  `$${p}$ 是质数且不整除 $${a}$，所以 $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$。`,
                ],
              ],
              [
                ["Reduce the exponent", "约简指数"],
                [
                  `$${k} = ${p - 1} \\times ${q} + ${reduced}$, so $${a}^{${k}} \\equiv ${pw(a, reduced)}$.`,
                  `$${k} = ${p - 1} \\times ${q} + ${reduced}$，所以 $${a}^{${k}} \\equiv ${pw(a, reduced)}$。`,
                ],
              ],
              [
                ["Compute the small power", "计算小的幂"],
                [`$${pw(a, reduced)} \\equiv ${answer} \\pmod{${p}}$.`, `$${pw(a, reduced)} \\equiv ${answer} \\pmod{${p}}$。`],
              ],
            ],
            [
              `$${p - 1} \\times ${q} + ${reduced} = ${k}$, so $${a}^{${k}} = ${pw(`(${a}^{${p - 1}})`, q)} \\times ${pw(a, reduced)}$, and the first factor is $\\equiv 1$.`,
              `$${p - 1} \\times ${q} + ${reduced} = ${k}$，所以 $${a}^{${k}} = ${pw(`(${a}^{${p - 1}})`, q)} \\times ${pw(a, reduced)}$，而第一个因子 $\\equiv 1$。`,
            ],
          );
        }),
    ),
    point(
      "an-inverse-from-a-power",
      ["An inverse from a power", "用幂求逆元"],
      [
        "Fermat's little theorem also supplies inverses. Since $a \\cdot a^{p-2} = a^{p-1}$, which is one, the inverse of $a$ modulo $p$ is $a^{p-2}$. This gives a route that uses only repeated squaring, as an alternative to running the extended Euclidean algorithm. For $3$ modulo $7$: $3^{5} = 243 = 7 \\times 34 + 5$, so the inverse is $5$.\n\nCheck: $3 \\times 5 = 15 = 2 \\times 7 + 1$, so $3 \\times 5 \\equiv 1 \\pmod{7}$.\n\n> **Watch out.** The power is $p - 2$, not $p - 1$: $a^{p-1}$ is always $1$, which is the product $a$ times its inverse, not the inverse itself.",
        "费马小定理也能给出逆元。因为 $a \\cdot a^{p-2} = a^{p-1}$，也就是 1，所以 $a$ 模 $p$ 的逆元是 $a^{p-2}$。这是一条只用反复平方的途径，可以替代扩展欧几里得算法。求 $3$ 模 $7$ 的逆元：$3^{5} = 243 = 7 \\times 34 + 5$，所以逆元是 $5$。\n\n检验：$3 \\times 5 = 15 = 2 \\times 7 + 1$，所以 $3 \\times 5 \\equiv 1 \\pmod{7}$。\n\n> **注意。** 指数是 $p - 2$，不是 $p - 1$：$a^{p-1}$ 总是 $1$，那是 $a$ 与其逆元的积，而不是逆元本身。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([7, 11, 13, 17, 19, 23, 29]);
          const a = rng.int(2, p - 1);
          const answer = powMod(a, p - 2, p);
          return worked(
            [
              `Use Fermat's little theorem to find the inverse of $${a}$ modulo $${p}$, as a number from 1 to ${p - 1}.`,
              `用费马小定理求 $${a}$ 模 $${p}$ 的逆元，结果取 1 到 ${p - 1} 之间的数。`,
            ],
            answer,
            [
              [
                1,
                `That is $${a}^{${p - 1}}$, which is always $1$; the inverse is one power lower.`,
                `那是 $${a}^{${p - 1}}$，它总是 $1$；逆元要低一次幂。`,
              ],
              [
                p - a,
                `That is the additive inverse, $-${a}$, which adds to $0$ with $${a}$ rather than multiplying to $1$.`,
                `那是加法逆元 $-${a}$，它与 $${a}$ 相加得 $0$，而不是相乘得 $1$。`,
              ],
              [powMod(a, p - 3, p), `That uses the power $${p - 3}$, one too low.`, `那用的是 $${p - 3}$ 次幂，低了一次。`],
            ],
            [
              [
                ["Choose the power", "确定指数"],
                [`The inverse is $${a}^{p-2} = ${a}^{${p - 2}}$.`, `逆元是 $${a}^{p-2} = ${a}^{${p - 2}}$。`],
              ],
              [
                ["Compute it", "计算"],
                [
                  `By repeated squaring, $${a}^{${p - 2}} \\equiv ${answer} \\pmod{${p}}$.`,
                  `用反复平方，$${a}^{${p - 2}} \\equiv ${answer} \\pmod{${p}}$。`,
                ],
              ],
            ],
            [
              `$${a} \\times ${answer} = ${a * answer} = ${p} \\times ${(a * answer - 1) / p} + 1$, so the product is $\\equiv 1 \\pmod{${p}}$.`,
              `$${a} \\times ${answer} = ${a * answer} = ${p} \\times ${(a * answer - 1) / p} + 1$，所以乘积 $\\equiv 1 \\pmod{${p}}$。`,
            ],
          );
        }),
    ),
  ],
);

/** phiProduct writes φ(n) as a product over the prime powers of n, such as 2^{2} \times 1 \times 2. */
const phiProduct = (n: number) =>
  factorize(n)
    .map(([p, e]) => (e === 1 ? `${p - 1}` : `${pw(p, e - 1)} \\times ${p - 1}`))
    .join(" \\times ");

/** phiFractions writes φ(n) as n times one minus the reciprocal of each prime. */
const phiFractions = (n: number) =>
  `${n} \\times ${factorize(n)
    .map(([p]) => `\\frac{${p - 1}}{${p}}`)
    .join(" \\times ")} = ${totient(n)}`;

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
        "Euler's function $\\varphi(n)$ counts the numbers from one to $n$ that share no factor with $n$. From the factorization, each prime contributes a fraction of one minus its reciprocal, so $\\varphi(n)$ is $n$ times the product of those fractions. Removing the multiples of each prime separately works only because the primes are distinct, which the product takes into account. For $60 = 2^{2} \\times 3 \\times 5$: $\\varphi(60) = 60 \\times \\frac{1}{2} \\times \\frac{2}{3} \\times \\frac{4}{5} = 16$.\n\nCheck: prime power by prime power, $\\varphi(4) \\times \\varphi(3) \\times \\varphi(5) = 2 \\times 2 \\times 4 = 16$.\n\n> **Watch out.** Subtracting the multiples of each prime one after another counts the common multiples twice: $60 - 30 - 20 - 12 = -2$ is impossible. The product of the fractions handles the overlaps.",
        "欧拉函数 $\\varphi(n)$ 数 1 到 $n$ 中与 $n$ 没有公因数的数。由分解式，每个质数贡献 1 减其倒数这个比例，所以 $\\varphi(n)$ 是 $n$ 乘这些比例之积。分别去掉每个质数的倍数之所以可行，是因为这些质数互不相同，而乘积已把这一点考虑在内。对 $60 = 2^{2} \\times 3 \\times 5$：$\\varphi(60) = 60 \\times \\frac{1}{2} \\times \\frac{2}{3} \\times \\frac{4}{5} = 16$。\n\n检验：按质数幂分别计算，$\\varphi(4) \\times \\varphi(3) \\times \\varphi(5) = 2 \\times 2 \\times 4 = 16$。\n\n> **注意。** 依次减去每个质数的倍数，会把公倍数重复减去：$60 - 30 - 20 - 12 = -2$ 是不可能的。各比例相乘才正确处理了重叠部分。",
      ],
      (rng) =>
        until(() => {
          const n = pickComposite(rng, 10, 300);
          const answer = totient(n);
          const factors = factorize(n);
          return worked(
            [`What is $\\varphi(${n})$?`, `$\\varphi(${n})$ 是多少？`],
            answer,
            [
              [n - 1, `That is the value for a prime, but $${n}$ is composite.`, `那是质数的值，但 $${n}$ 是合数。`],
              [
                n - factors.length,
                "That takes away one number per prime, instead of all the multiples of each prime.",
                "那是每个质数只去掉一个数，而不是去掉它的所有倍数。",
              ],
              [
                n - factors.reduce((v, [p]) => v + n / p, 0),
                "That subtracts the multiples of each prime separately and so removes the common multiples twice.",
                "那是分别减去每个质数的倍数，把公倍数减了两次。",
              ],
              [
                factors.reduce((v, [p]) => v * (p - 1), 1),
                "That multiplies the primes minus one but leaves out the lower powers of repeated primes.",
                "那只把各质数减一相乘，漏掉了重复质数的较低次幂。",
              ],
              [Math.floor(n / 2), "That removes only the even numbers.", "那只去掉了偶数。"],
            ],
            [
              [
                ["Factor", "分解"],
                [`$${n} = ${factorizationLatex(factors)}$.`, `$${n} = ${factorizationLatex(factors)}$。`],
              ],
              [
                ["Use the prime powers", "按质数幂计算"],
                [`$\\varphi(${n}) = ${phiProduct(n)} = ${answer}$.`, `$\\varphi(${n}) = ${phiProduct(n)} = ${answer}$。`],
              ],
            ],
            [`With the fractions, $${phiFractions(n)}$.`, `用比例计算，$${phiFractions(n)}$。`],
          );
        }),
    ),
    point(
      "fractions-in-lowest-terms",
      ["Fractions in lowest terms", "最简分数的个数"],
      [
        "The totient counts something visible: the fractions between zero and one with a given denominator that are already in lowest terms. A fraction $\\frac{k}{n}$ reduces exactly when $k$ and $n$ share a factor, so the fractions that do not reduce are counted by $\\varphi(n)$. This gives a useful check for small denominators, by listing them. For $n = 12$, $\\varphi(12) = 12 \\times \\frac{1}{2} \\times \\frac{2}{3} = 4$.\n\nCheck: the list is $\\frac{1}{12}, \\frac{5}{12}, \\frac{7}{12}, \\frac{11}{12}$, four fractions.\n\n> **Watch out.** The fraction $\\frac{n}{n}$ reduces to one and is not counted, and a numerator need not divide $n$ to share a factor with it: $\\frac{9}{12}$ reduces although $9$ does not divide $12$.",
        "欧拉函数数的东西看得见：分母给定、在 0 和 1 之间、已是最简形式的分数。分数 $\\frac{k}{n}$ 能约分，当且仅当 $k$ 和 $n$ 有公因数，所以不能约分的分数个数就是 $\\varphi(n)$。对较小的分母，可以列出来作为检验。对 $n = 12$，$\\varphi(12) = 12 \\times \\frac{1}{2} \\times \\frac{2}{3} = 4$。\n\n检验：列出来是 $\\frac{1}{12}, \\frac{5}{12}, \\frac{7}{12}, \\frac{11}{12}$，共四个。\n\n> **注意。** 分数 $\\frac{n}{n}$ 约分后是 1，不算在内；分子不必整除 $n$ 也可能与它有公因数：$9$ 不整除 $12$，但 $\\frac{9}{12}$ 仍能约分。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(6, 120);
          const answer = totient(n);
          const factors = factorize(n);
          return worked(
            [
              `How many fractions $\\frac{k}{${n}}$ with $1 \\le k \\le ${n}$ are in lowest terms?`,
              `满足 $1 \\le k \\le ${n}$ 的分数 $\\frac{k}{${n}}$ 中，有多少个是最简分数？`,
            ],
            answer,
            [
              [
                n - 1,
                `That leaves out only $\\frac{${n}}{${n}}$, but other fractions reduce too.`,
                `那只去掉了 $\\frac{${n}}{${n}}$，但别的分数也能约分。`,
              ],
              [
                n - divisors(n).length,
                `That removes only the numerators that divide $${n}$; a numerator sharing a factor with $${n}$ also reduces.`,
                `那只去掉了整除 $${n}$ 的分子；与 $${n}$ 有公因数的分子也能约分。`,
              ],
              [answer + 1, `That counts $\\frac{${n}}{${n}}$, which reduces to $1$.`, `那算上了 $\\frac{${n}}{${n}}$，它约分后是 $1$。`],
              [
                divisors(n).length,
                `That counts the divisors of $${n}$ instead of the numerators coprime to it.`,
                `那数的是 $${n}$ 的因数，而不是与它互质的分子。`,
              ],
            ],
            [
              [
                ["Restate", "转化"],
                [
                  `$\\frac{k}{${n}}$ is in lowest terms exactly when $k$ is coprime to $${n}$, so the count is $\\varphi(${n})$.`,
                  `$\\frac{k}{${n}}$ 是最简分数当且仅当 $k$ 与 $${n}$ 互质，所以个数是 $\\varphi(${n})$。`,
                ],
              ],
              [
                ["Factor", "分解"],
                [`$${n} = ${factorizationLatex(factors)}$.`, `$${n} = ${factorizationLatex(factors)}$。`],
              ],
              [
                ["Compute", "计算"],
                [`$\\varphi(${n}) = ${phiProduct(n)} = ${answer}$.`, `$\\varphi(${n}) = ${phiProduct(n)} = ${answer}$。`],
              ],
            ],
            [`With the fractions, $${phiFractions(n)}$.`, `用比例计算，$${phiFractions(n)}$。`],
          );
        }),
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
    ["using-fermats-little-theorem", 0.2],
    ["computing-and-counting-with-the-totient", 0.4],
  ],
  [
    point(
      "reducing-modulo-the-totient",
      ["Reducing modulo the totient", "模欧拉函数约简"],
      [
        "Euler's theorem extends Fermat's: for a base coprime to $n$, the base to the power $\\varphi(n)$ leaves remainder one. So exponents reduce modulo $\\varphi(n)$. The condition that base and modulus are coprime matters, and without it the statement can fail. When $n$ is prime, $\\varphi(n)$ is $n - 1$, and this is just Fermat's little theorem again. For $5^{100} \\bmod 12$: $\\varphi(12) = 4$ and $100 = 4 \\times 25$, so $5^{100} \\equiv 1$.\n\nCheck: $5^{2} = 25 = 2 \\times 12 + 1$, so already $5^{2} \\equiv 1$, and $5^{100} = (5^{2})^{50} \\equiv 1$.\n\n> **Watch out.** For a composite modulus the exponent reduces modulo $\\varphi(n)$, not $n - 1$: for $n = 12$ that is $4$, not $11$. And the base must be coprime to $n$: $2^{4} = 16 \\equiv 4 \\pmod{12}$, not $1$.",
        "欧拉定理推广了费马小定理：底数与 $n$ 互质时，底数的 $\\varphi(n)$ 次幂余 1。所以指数可以模 $\\varphi(n)$ 约简。底数和模数互质这个条件很重要，缺少它，结论可能不成立。当 $n$ 是质数时，$\\varphi(n)$ 就是 $n - 1$，这正是费马小定理。求 $5^{100} \\bmod 12$：$\\varphi(12) = 4$，$100 = 4 \\times 25$，所以 $5^{100} \\equiv 1$。\n\n检验：$5^{2} = 25 = 2 \\times 12 + 1$，所以已有 $5^{2} \\equiv 1$，于是 $5^{100} = (5^{2})^{50} \\equiv 1$。\n\n> **注意。** 模数是合数时，指数要模 $\\varphi(n)$ 约简，而不是模 $n - 1$：对 $n = 12$ 是 $4$，不是 $11$。并且底数必须与 $n$ 互质：$2^{4} = 16 \\equiv 4 \\pmod{12}$，不是 $1$。",
      ],
      (rng) =>
        until(() => {
          const n = rng.pick([8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 26, 27, 28, 30]);
          const a = rng.pick(coprimeBases(n));
          const k = rng.int(100, 9999);
          const phi = totient(n);
          const r = k % phi;
          const q = (k - r) / phi;
          const answer = powMod(a, k, n);
          return worked(
            [`What is the remainder of $${a}^{${k}}$ when divided by $${n}$?`, `$${a}^{${k}}$ 除以 $${n}$ 的余数是多少？`],
            answer,
            [
              [
                powMod(a, k % (n - 1), n),
                `That reduces the exponent modulo $${n - 1}$ as if $${n}$ were prime; for a composite modulus use $\\varphi(${n}) = ${phi}$.`,
                `那是把 $${n}$ 当成质数，把指数模 $${n - 1}$ 约简；合数模数要用 $\\varphi(${n}) = ${phi}$。`,
              ],
              [
                powMod(a, k % n, n),
                `That reduces the exponent modulo $${n}$, which is not allowed.`,
                `那是把指数模 $${n}$ 约简，这是不允许的。`,
              ],
              [
                r,
                "That stops at the reduced exponent and forgets to raise the base to it.",
                "那停在了约简后的指数，忘了再求底数的这次幂。",
              ],
              [
                (a * r) % n,
                "That multiplies the base by the reduced exponent instead of raising it to that power.",
                "那是把底数乘以约简后的指数，而不是求幂。",
              ],
            ],
            [
              [
                ["Find the totient", "求欧拉函数"],
                [`$\\gcd(${a}, ${n}) = 1$ and $\\varphi(${n}) = ${phi}$.`, `$\\gcd(${a}, ${n}) = 1$，$\\varphi(${n}) = ${phi}$。`],
              ],
              [
                ["Reduce the exponent", "约简指数"],
                [
                  `$${k} = ${phi} \\times ${q} + ${r}$, so $${a}^{${k}} \\equiv ${pw(a, r)}$.`,
                  `$${k} = ${phi} \\times ${q} + ${r}$，所以 $${a}^{${k}} \\equiv ${pw(a, r)}$。`,
                ],
              ],
              [
                ["Compute the small power", "计算小的幂"],
                [`$${pw(a, r)} \\equiv ${answer} \\pmod{${n}}$.`, `$${pw(a, r)} \\equiv ${answer} \\pmod{${n}}$。`],
              ],
            ],
            [
              `$${phi} \\times ${q} + ${r} = ${k}$, and $${pw(a, phi)} \\equiv ${powMod(a, phi, n)} \\pmod{${n}}$, as Euler's theorem says, so the factor $${pw(`(${pw(a, phi)})`, q)}$ is $\\equiv 1$.`,
              `$${phi} \\times ${q} + ${r} = ${k}$，且 $${pw(a, phi)} \\equiv ${powMod(a, phi, n)} \\pmod{${n}}$，与欧拉定理一致，所以因子 $${pw(`(${pw(a, phi)})`, q)}$ $\\equiv 1$。`,
            ],
          );
        }),
    ),
    point(
      "the-last-two-digits",
      ["The last two digits", "最后两位数字"],
      [
        "The last two digits of a number are its remainder modulo 100. For a base coprime to 100, Euler's theorem applies with $\\varphi(100) = 40$, so only the exponent modulo 40 matters. This means that a base ending in 1, 3, 7 or 9 can have its last two digits found with just a few multiplications, however large the power. For $3^{2025}$: $2025 = 40 \\times 50 + 25$, and $3^{25} \\equiv 43 \\pmod{100}$, so $3^{2025}$ ends in $43$.\n\nCheck: the last digit alone follows the cycle $3, 9, 7, 1$, and $2025$ leaves $1$ modulo $4$, so the last digit is $3$, matching $43$.\n\n> **Watch out.** Reduce the exponent modulo $40$, not $100$; and keep both digits, since the last digit alone answers a different question.",
        "一个数的最后两位数字就是它模 100 的余数。底数与 100 互质时，可以用欧拉定理，$\\varphi(100) = 40$，所以只有指数模 40 才重要。这意味着，以 1、3、7、9 结尾的底数，不论幂多大，只需几次乘法就能求出最后两位数字。求 $3^{2025}$：$2025 = 40 \\times 50 + 25$，而 $3^{25} \\equiv 43 \\pmod{100}$，所以 $3^{2025}$ 的最后两位是 $43$。\n\n检验：单看个位，周期是 $3, 9, 7, 1$，$2025$ 模 $4$ 余 $1$，所以个位是 $3$，与 $43$ 相符。\n\n> **注意。** 指数要模 $40$ 约简，而不是模 $100$；并且要保留两位数字，只看个位回答的是另一个问题。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37, 39]);
          const k = rng.int(41, 3000);
          const r = k % 40;
          const answer = powMod(a, k, 100);
          return worked(
            [`What number do the last two digits of $${a}^{${k}}$ form?`, `$${a}^{${k}}$ 的最后两位数字组成的数是多少？`],
            answer,
            [
              [
                powMod(a, k % 100, 100),
                "That reduces the exponent modulo $100$; Euler's theorem allows reducing it modulo $\\varphi(100) = 40$.",
                "那是把指数模 $100$ 约简；欧拉定理允许的是模 $\\varphi(100) = 40$ 约简。",
              ],
              [
                powMod(a, k, 10),
                "That is only the last digit; the question asks for the last two.",
                "那只是个位数字；题目问的是最后两位。",
              ],
              [powMod(a, r + 1, 100), "That takes one power too many after reducing the exponent.", "那在约简指数后多乘了一次幂。"],
              [
                powMod(a, k % 10, 100),
                "That reduces the exponent modulo ten, which has nothing to do with the last two digits.",
                "那是把指数模 10 约简，这与最后两位无关。",
              ],
            ],
            [
              [
                ["Reduce the exponent", "约简指数"],
                [
                  `$\\varphi(100) = 40$ and $${k} = 40 \\times ${(k - r) / 40} + ${r}$.`,
                  `$\\varphi(100) = 40$，而 $${k} = 40 \\times ${(k - r) / 40} + ${r}$。`,
                ],
              ],
              [
                ["Compute the small power", "计算小的幂"],
                [`$${pw(a, r)} \\equiv ${answer} \\pmod{100}$.`, `$${pw(a, r)} \\equiv ${answer} \\pmod{100}$。`],
              ],
            ],
            [
              `The last digit alone is $${a}^{${k}} \\bmod 10 = ${powMod(a, k, 10)}$, which matches the last digit of $${answer}$.`,
              `单看个位，$${a}^{${k}} \\bmod 10 = ${powMod(a, k, 10)}$，与 $${answer}$ 的个位相符。`,
            ],
          );
        }),
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
        "Wilson's theorem says that $(p - 1)!$ leaves remainder $p - 1$ modulo a prime $p$, because each factor pairs with its inverse, leaving only one and $p - 1$. Dividing by $p - 1$ and by $p - 2$ in turn gives the neighbours: $(p - 2)!$ leaves one, since $p - 1$ is congruent to $-1$. So these large factorials need no multiplication at all. For $p = 11$: $10! \\equiv -1$, and $10! = 9! \\times 10 \\equiv 9! \\times (-1)$, so $9! \\equiv 1 \\pmod{11}$.\n\nCheck: $9! = 362880 = 11 \\times 32989 + 1$.\n\n> **Watch out.** A factorial below $p$ contains no factor $p$, so its remainder is never $0$; and dividing by $p - 1 \\equiv -1$ changes the sign, so $(p - 2)!$ is $1$, not $-1$.",
        "威尔逊定理说，$(p - 1)!$ 模质数 $p$ 余 $p - 1$，因为每个因数都和它的逆配对，只剩下 1 和 $p - 1$。依次除以 $p - 1$ 和 $p - 2$，就得到相邻的情况：$(p - 2)!$ 余 1，因为 $p - 1$ 同余于 $-1$。所以这些很大的阶乘根本不用做乘法。对 $p = 11$：$10! \\equiv -1$，而 $10! = 9! \\times 10 \\equiv 9! \\times (-1)$，所以 $9! \\equiv 1 \\pmod{11}$。\n\n检验：$9! = 362880 = 11 \\times 32989 + 1$。\n\n> **注意。** 小于 $p$ 的阶乘不含因数 $p$，所以余数从不为 $0$；除以 $p - 1 \\equiv -1$ 会改变符号，所以 $(p - 2)!$ 是 $1$，而不是 $-1$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(primesUpTo(100).filter((q) => q > 5));
          const k = rng.int(1, 3);
          const answer = factorialMod(p - k, p);
          const misses: Miss[] = [
            [
              0,
              `$${p - k}!$ has no factor $${p}$, so it is not a multiple of $${p}$.`,
              `$${p - k}!$ 不含因数 $${p}$，所以不是 $${p}$ 的倍数。`,
            ],
            [
              p - 1,
              `That is Wilson's value for $${p - 1}!$; the factors above $${p - k}$ still have to be divided out, and each one is negative modulo $${p}$.`,
              `那是威尔逊定理给出的 $${p - 1}!$ 的值；还要除掉大于 $${p - k}$ 的因数，而它们模 $${p}$ 都是负的。`,
            ],
            [1, `That is the value for $${p - 2}!$, not $${p - k}!$.`, `那是 $${p - 2}!$ 的值，不是 $${p - k}!$ 的值。`],
            ...(k === 3
              ? ([
                  [
                    (p + 1) / 2,
                    "That drops the minus sign: it solves $2x \\equiv 1$ instead of $2x \\equiv -1$.",
                    "那丢掉了负号：解的是 $2x \\equiv 1$，而不是 $2x \\equiv -1$。",
                  ],
                ] as const)
              : []),
          ];
          const steps: Walk[] = [
            [
              ["Apply Wilson's theorem", "应用威尔逊定理"],
              [`$${p - 1}! \\equiv -1 \\pmod{${p}}$.`, `$${p - 1}! \\equiv -1 \\pmod{${p}}$。`],
            ],
          ];
          if (k === 2)
            steps.push([
              ["Divide out the top factor", "除掉最大的因数"],
              [
                `$${p - 1}! = ${p - 2}! \\times ${p - 1}$ and $${p - 1} \\equiv -1$, so $${p - 2}! \\times (-1) \\equiv -1$, giving $${p - 2}! \\equiv 1$.`,
                `$${p - 1}! = ${p - 2}! \\times ${p - 1}$，而 $${p - 1} \\equiv -1$，所以 $${p - 2}! \\times (-1) \\equiv -1$，得 $${p - 2}! \\equiv 1$。`,
              ],
            ]);
          if (k === 3)
            steps.push([
              ["Divide out the top factors", "除掉最大的两个因数"],
              [
                `$${p - 1}! = ${p - 3}! \\times ${p - 2} \\times ${p - 1} \\equiv ${p - 3}! \\times (-2) \\times (-1) = 2 \\times ${p - 3}!$, so $2 \\times ${p - 3}! \\equiv -1 \\equiv ${p - 1}$, giving $${p - 3}! \\equiv ${answer}$.`,
                `$${p - 1}! = ${p - 3}! \\times ${p - 2} \\times ${p - 1} \\equiv ${p - 3}! \\times (-2) \\times (-1) = 2 \\times ${p - 3}!$，所以 $2 \\times ${p - 3}! \\equiv -1 \\equiv ${p - 1}$，得 $${p - 3}! \\equiv ${answer}$。`,
              ],
            ]);
          steps.push([
            ["Write the remainder", "写出余数"],
            [`The remainder is $${answer}$.`, `余数是 $${answer}$。`],
          ]);
          const check: Pair =
            k === 1
              ? [
                  `Multiplying $1 \\times 2 \\times \\dots \\times ${p - 1}$ and reducing modulo $${p}$ after each step also ends at $${p - 1}$.`,
                  `把 $1 \\times 2 \\times \\dots \\times ${p - 1}$ 逐步相乘并模 $${p}$ 约简，最后也得到 $${p - 1}$。`,
                ]
              : k === 2
                ? [
                    `Multiplying back, $1 \\times ${p - 1} = ${p - 1} \\equiv -1$, which is Wilson's value.`,
                    `乘回去，$1 \\times ${p - 1} = ${p - 1} \\equiv -1$，正是威尔逊定理的值。`,
                  ]
                : [
                    `Multiplying back, $2 \\times ${answer} = ${2 * answer} \\equiv -1 \\pmod{${p}}$, as needed.`,
                    `乘回去，$2 \\times ${answer} = ${2 * answer} \\equiv -1 \\pmod{${p}}$，符合要求。`,
                  ];
          return worked(
            [`What is the remainder of $${p - k}!$ when divided by $${p}$?`, `$${p - k}!$ 除以 $${p}$ 的余数是多少？`],
            answer,
            misses,
            steps,
            check,
          );
        }),
    ),
    point(
      "factorials-and-composites",
      ["Factorials and composites", "阶乘与合数"],
      [
        "Wilson's theorem has a converse: $(n - 1)!$ leaves remainder $n - 1$ modulo $n$ only when $n$ is prime. For a composite $n > 4$, the factors below $n$ already include enough to make a multiple of $n$, so the remainder is $0$. The only exception is $n = 4$, where $3! = 6$ leaves remainder $2$. For $n = 15 = 3 \\times 5$, both $3$ and $5$ appear in $14!$, so $15$ divides $14!$.\n\nCheck: for $n = 9 = 3^{2}$, the factors $3$ and $6$ both appear in $8!$ and give $3 \\times 6 = 18$, a multiple of $9$, so $8! \\equiv 0 \\pmod{9}$ too.\n\n> **Watch out.** Only a prime gives $n - 1$; a composite above $4$ gives $0$, even a square of a prime, where the factor appears in two different multiples.",
        "威尔逊定理有逆命题：只有当 $n$ 是质数时，$(n - 1)!$ 模 $n$ 才余 $n - 1$。对合数 $n > 4$，小于 $n$ 的因数已经足以构成 $n$ 的倍数，所以余数是 $0$。唯一的例外是 $n = 4$，此时 $3! = 6$，余 $2$。对 $n = 15 = 3 \\times 5$，$3$ 和 $5$ 都出现在 $14!$ 中，所以 $15$ 整除 $14!$。\n\n检验：对 $n = 9 = 3^{2}$，因数 $3$ 和 $6$ 都出现在 $8!$ 中，$3 \\times 6 = 18$ 是 $9$ 的倍数，所以 $8! \\equiv 0 \\pmod{9}$ 也成立。\n\n> **注意。** 只有质数给出 $n - 1$；大于 $4$ 的合数给出 $0$，即使是质数的平方也一样，因为那个质因数出现在两个不同的倍数里。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(4, 60);
          const answer = factorialMod(n - 1, n);
          const prime = isPrime(n);
          const q = factorize(n)[0]?.[0] as number;
          const b = n / q;
          const steps: Walk[] = prime
            ? [
                [
                  ["Recognize a prime", "识别质数"],
                  [`$${n}$ is prime.`, `$${n}$ 是质数。`],
                ],
                [
                  ["Apply Wilson's theorem", "应用威尔逊定理"],
                  [`$${n - 1}! \\equiv -1$, which is $${n - 1}$.`, `$${n - 1}! \\equiv -1$，也就是 $${n - 1}$。`],
                ],
              ]
            : n === 4
              ? [
                  [
                    ["Compute directly", "直接计算"],
                    ["$3! = 6$.", "$3! = 6$。"],
                  ],
                  [
                    ["Reduce", "取余"],
                    ["$6 = 4 + 2$, so the remainder is $2$; this is the one exception.", "$6 = 4 + 2$，所以余数是 $2$；这是唯一的例外。"],
                  ],
                ]
              : [
                  [
                    ["Split the modulus", "拆分模数"],
                    b === q
                      ? [
                          `$${n} = ${q}^{2}$, and both $${q}$ and $${2 * q}$ are below $${n}$.`,
                          `$${n} = ${q}^{2}$，而 $${q}$ 和 $${2 * q}$ 都小于 $${n}$。`,
                        ]
                      : [
                          `$${n} = ${q} \\times ${b}$ with two different factors below $${n}$.`,
                          `$${n} = ${q} \\times ${b}$，两个不同的因数都小于 $${n}$。`,
                        ],
                  ],
                  [
                    ["Conclude", "得出结论"],
                    [
                      `Those factors appear in $${n - 1}!$, so $${n}$ divides it and the remainder is $0$.`,
                      `这些因数都出现在 $${n - 1}!$ 中，所以 $${n}$ 整除它，余数是 $0$。`,
                    ],
                  ],
                ];
          const check: Pair = prime
            ? [
                `The numbers $2$ to $${n - 2}$ pair off with their inverses, leaving $1 \\times ${n - 1} \\equiv -1$.`,
                `$2$ 到 $${n - 2}$ 的数与各自的逆两两配对，剩下 $1 \\times ${n - 1} \\equiv -1$。`,
              ]
            : n === 4
              ? [
                  "$2$ is the only factor of $3!$ that shares a prime with $4$, and it supplies just one $2$, so $4$ does not divide $3!$.",
                  "$3!$ 中只有因数 $2$ 与 $4$ 有公共质因数，而它只提供一个 $2$，所以 $4$ 不整除 $3!$。",
                ]
              : b === q
                ? [
                    `$${q} \\times ${2 * q} = ${2 * n} = 2 \\times ${n}$, a multiple of $${n}$.`,
                    `$${q} \\times ${2 * q} = ${2 * n} = 2 \\times ${n}$，是 $${n}$ 的倍数。`,
                  ]
                : [
                    `$${q} \\times ${b} = ${n}$, and both factors are among $1, 2, \\dots, ${n - 1}$.`,
                    `$${q} \\times ${b} = ${n}$，两个因数都在 $1, 2, \\dots, ${n - 1}$ 中。`,
                  ];
          return worked(
            [`What is the remainder of $${n - 1}!$ when divided by $${n}$?`, `$${n - 1}!$ 除以 $${n}$ 的余数是多少？`],
            answer,
            [
              [
                n - 1,
                `That is Wilson's value, which holds only for primes, and $${n}$ is composite.`,
                `那是威尔逊定理的值，只对质数成立，而 $${n}$ 是合数。`,
              ],
              n === 4
                ? [
                    0,
                    "$4 = 2 \\times 2$ needs two factors of $2$, but $3!$ has only one.",
                    "$4 = 2 \\times 2$ 需要两个因数 $2$，但 $3!$ 只有一个。",
                  ]
                : [
                    0,
                    `A factorial below a prime has no factor $${n}$, so it is not a multiple of $${n}$.`,
                    `小于质数的阶乘不含因数 $${n}$，所以不是 $${n}$ 的倍数。`,
                  ],
              [1, "Wilson's theorem gives $-1$, not $1$.", "威尔逊定理给出的是 $-1$，不是 $1$。"],
              [2, "Only $n = 4$ gives remainder $2$.", "只有 $n = 4$ 给出余数 $2$。"],
            ],
            steps,
            check,
          );
        }),
    ),
  ],
);

const orders = topic(
  "the-order-of-an-integer-modulo-n",
  ["The Order of an Integer Modulo n", "整数模 n 的阶"],
  ["Find the least power that gives one, and what orders are possible.", "求得到 1 的最小幂，并判断哪些阶是可能的。"],
  ["reducing-exponents-with-eulers-theorem"],
  [],
  [
    point(
      "finding-an-order",
      ["Finding an order", "求阶"],
      [
        "The order of $a$ modulo $n$ is the smallest positive exponent $k$ with $a^{k} \\equiv 1 \\pmod{n}$. It exists exactly when $a$ is coprime to $n$, and it divides $\\varphi(n)$, by Euler's theorem. So only the divisors of $\\varphi(n)$ need checking, which is often quicker than listing the powers one after another until the value $1$ appears. For $2$ modulo $7$: the powers are $2, 4, 1$, so the order is $3$.\n\nCheck: $3$ divides $\\varphi(7) = 6$, as it must.\n\n> **Watch out.** The order is the first exponent that gives $1$, not $\\varphi(n)$ itself: $2^{6} \\equiv 1 \\pmod{7}$ too, but $2^{3}$ already is.",
        "$a$ 模 $n$ 的阶是使 $a^{k} \\equiv 1 \\pmod{n}$ 的最小正指数 $k$。它存在当且仅当 $a$ 与 $n$ 互质，并且由欧拉定理，它整除 $\\varphi(n)$。所以只需检查 $\\varphi(n)$ 的因数，这通常比逐个列出幂直到出现 $1$ 要快。求 $2$ 模 $7$ 的阶：幂依次是 $2, 4, 1$，所以阶是 $3$。\n\n检验：$3$ 整除 $\\varphi(7) = 6$，这是必然的。\n\n> **注意。** 阶是第一个得到 $1$ 的指数，而不是 $\\varphi(n)$ 本身：$2^{6} \\equiv 1 \\pmod{7}$ 也成立，但 $2^{3}$ 已经是 $1$ 了。",
      ],
      (rng) =>
        until(() => {
          const n = rng.pick([7, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 29, 31]);
          const a = rng.pick(coprimeBases(n));
          const answer = orderMod(a, n);
          const phi = totient(n);
          const powers = Array.from({ length: answer }, (_, i) => powMod(a, i + 1, n));
          return worked(
            [`What is the order of $${a}$ modulo $${n}$?`, `$${a}$ 模 $${n}$ 的阶是多少？`],
            answer,
            [
              [
                phi,
                `$${pw(a, phi)} \\equiv 1$ by Euler's theorem, but a smaller power already gives $1$.`,
                `由欧拉定理 $${pw(a, phi)} \\equiv 1$，但更小的幂已经得到 $1$。`,
              ],
              [
                n - 1,
                `That treats $${n}$ as if every order were $${n - 1}$; the order is the first power that gives $1$.`,
                `那以为阶总是 $${n - 1}$；阶是第一个得到 $1$ 的幂。`,
              ],
              [2 * answer, "That goes on to the second time the value $1$ appears.", "那数到了第二次出现 $1$ 的位置。"],
              [a, "That is the base, not an exponent.", "那是底数，不是指数。"],
            ],
            [
              [
                ["List the powers", "列出各次幂"],
                [
                  `Modulo $${n}$, the powers of $${a}$ are $${powers.join(", ")}$.`,
                  `模 $${n}$，$${a}$ 的各次幂是 $${powers.join(", ")}$。`,
                ],
              ],
              [
                ["Find the first 1", "找到第一个 1"],
                [`The value $1$ first appears at power $${answer}$.`, `$1$ 第一次出现在第 $${answer}$ 次幂。`],
              ],
            ],
            [
              `$\\varphi(${n}) = ${phi} = ${answer} \\times ${phi / answer}$, so the order divides $\\varphi(${n})$, as it must.`,
              `$\\varphi(${n}) = ${phi} = ${answer} \\times ${phi / answer}$，所以阶整除 $\\varphi(${n})$，这是必然的。`,
            ],
          );
        }),
    ),
    point(
      "which-orders-are-possible",
      ["Which orders are possible", "哪些阶是可能的"],
      [
        "The order of any element modulo a prime $p$ divides $p - 1$, because the units form a group of that size and the order of an element divides the order of the group. So a number that does not divide $p - 1$ cannot be an order. The converse also holds modulo a prime: every divisor of $p - 1$ occurs as an order. Modulo $13$ the possible orders are the divisors of $12$: $1, 2, 3, 4, 6, 12$, so $5$ is impossible.\n\nCheck: $3$ has order $3$ modulo $13$, since $3^{3} = 27 = 2 \\times 13 + 1$, and $3$ divides $12$.\n\n> **Watch out.** It is $p - 1$ that the orders divide, not $p$: modulo $13$, the order $13$ is impossible, and so is any number above $12$.",
        "模质数 $p$ 时，任何元素的阶都整除 $p - 1$，因为单位构成这个大小的群，而元素的阶整除群的阶。所以不整除 $p - 1$ 的数不可能是阶。模质数时逆命题也成立：$p - 1$ 的每个因数都是某个元素的阶。模 $13$ 时可能的阶是 $12$ 的因数 $1, 2, 3, 4, 6, 12$，所以 $5$ 不可能。\n\n检验：$3$ 模 $13$ 的阶是 $3$，因为 $3^{3} = 27 = 2 \\times 13 + 1$，而 $3$ 整除 $12$。\n\n> **注意。** 阶整除的是 $p - 1$，不是 $p$：模 $13$ 时阶 $13$ 不可能，任何大于 $12$ 的数也不可能。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(250).filter((q) => q > 10));
        const good = divisors(p - 1).filter((d) => d > 1);
        const bad = Array.from({ length: p - 2 }, (_, i) => i + 2).filter((d) => (p - 1) % d !== 0);
        const answer = rng.pick(bad);
        const others = rng.shuffle(good).slice(0, 3);
        return chosen(
          rng,
          [`Which of these cannot be the order of a number modulo the prime $${p}$?`, `下列哪个不可能是某个数模质数 $${p}$ 的阶？`],
          same(`${answer}`),
          others.map(
            (d) =>
              [
                same(`${d}`),
                `$${p - 1} = ${d} \\times ${(p - 1) / d}$, so $${d}$ divides $${p - 1}$ and does occur as an order.`,
                `$${p - 1} = ${d} \\times ${(p - 1) / d}$，所以 $${d}$ 整除 $${p - 1}$，确实是某个数的阶。`,
              ] as const,
          ),
          [
            [
              ["Find the group size", "求群的大小"],
              [
                `The units modulo $${p}$ form a group of size $${p - 1}$, so every order divides $${p - 1}$.`,
                `模 $${p}$ 的单位构成大小为 $${p - 1}$ 的群，所以每个阶都整除 $${p - 1}$。`,
              ],
            ],
            [
              ["Test the options", "检验选项"],
              [
                `$${others.join(", ")}$ divide $${p - 1}$, but $${answer}$ does not.`,
                `$${others.join(", ")}$ 都整除 $${p - 1}$，但 $${answer}$ 不整除。`,
              ],
            ],
          ],
          [
            `$${p - 1} = ${answer} \\times ${Math.floor((p - 1) / answer)} + ${(p - 1) % answer}$, a nonzero remainder.`,
            `$${p - 1} = ${answer} \\times ${Math.floor((p - 1) / answer)} + ${(p - 1) % answer}$，余数不为零。`,
          ],
        );
      },
    ),
  ],
);

/** rootTests lists the exponents (p − 1)/q that decide whether g is a primitive root modulo p, with the powers they give. */
const rootTests = (g: number, p: number) => factorize(p - 1).map(([q]) => [(p - 1) / q, powMod(g, (p - 1) / q, p)] as const);

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
        "A primitive root modulo a prime $p$ is a number of the largest possible order, $p - 1$, so that its powers run through every nonzero remainder. To test a candidate $g$, it is enough to check that $g^{(p-1)/q} \\not\\equiv 1 \\pmod{p}$ for every prime factor $q$ of $p - 1$. This saves computing the entire list of powers. Modulo $11$, $p - 1 = 10 = 2 \\times 5$, so test the exponents $5$ and $2$: for $g = 2$, $2^{5} = 32 \\equiv 10$ and $2^{2} = 4$, neither is $1$, so $2$ is a primitive root.\n\nCheck: the powers of $2$ modulo $11$ are $2, 4, 8, 5, 10, 9, 7, 3, 6, 1$, all ten nonzero remainders.\n\n> **Watch out.** Test every prime factor of $p - 1$. Modulo $11$, $g = 3$ passes the test with exponent $5$ only if $3^{5} \\not\\equiv 1$, but $3^{5} = 243 \\equiv 1$, so $3$ has order $5$ and is not a primitive root.",
        "模质数 $p$ 的原根是阶最大（等于 $p - 1$）的数，它的幂遍历所有非零余数。检验候选数 $g$ 时，只要对 $p - 1$ 的每个质因数 $q$ 检查 $g^{(p-1)/q} \\not\\equiv 1 \\pmod{p}$ 就够了。这样不必算出全部的幂。模 $11$ 时，$p - 1 = 10 = 2 \\times 5$，所以检验指数 $5$ 和 $2$：对 $g = 2$，$2^{5} = 32 \\equiv 10$，$2^{2} = 4$，都不是 $1$，所以 $2$ 是原根。\n\n检验：$2$ 模 $11$ 的各次幂是 $2, 4, 8, 5, 10, 9, 7, 3, 6, 1$，正是全部十个非零余数。\n\n> **注意。** $p - 1$ 的每个质因数都要检验。模 $11$ 时，$3$ 要通过指数 $5$ 的检验需 $3^{5} \\not\\equiv 1$，但 $3^{5} = 243 \\equiv 1$，所以 $3$ 的阶是 $5$，不是原根。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(97).filter((q) => q > 5));
        const all = Array.from({ length: p - 2 }, (_, i) => i + 2);
        const roots = all.filter((g) => isPrimitiveRoot(g, p));
        const rest = all.filter((g) => !isPrimitiveRoot(g, p));
        const exponents = factorize(p - 1).map(([q]) => (p - 1) / q);
        const testLine = (g: number): Pair => {
          const tests = rootTests(g, p);
          return [
            `For $${g}$: ${tests.map(([e, v]) => `$${pw(g, e)} \\equiv ${v}$`).join(", ")}.`,
            `对 $${g}$：${tests.map(([e, v]) => `$${pw(g, e)} \\equiv ${v}$`).join("，")}。`,
          ];
        };
        const setup: Walk = [
          ["Choose the test exponents", "确定检验指数"],
          [
            `$${p - 1} = ${factorizationLatex(factorize(p - 1))}$, so test the exponents $${exponents.join(", ")}$.`,
            `$${p - 1} = ${factorizationLatex(factorize(p - 1))}$，所以检验指数 $${exponents.join(", ")}$。`,
          ],
        ];
        if (rng.bool() && roots.length >= 3) {
          const answer = rng.pick(rest);
          const shown = rng.shuffle(roots).slice(0, 3);
          return chosen(
            rng,
            [`Which of these is not a primitive root modulo $${p}$?`, `下列哪个不是模 $${p}$ 的原根？`],
            same(`${answer}`),
            shown.map(
              (g) =>
                [
                  same(`${g}`),
                  `None of the test powers of $${g}$ is $1$, so its order is $${p - 1}$ and it is a primitive root.`,
                  `$${g}$ 的检验幂都不是 $1$，所以它的阶是 $${p - 1}$，是原根。`,
                ] as const,
            ),
            [
              setup,
              [["Test the one that fails", "检验不通过的数"], testLine(answer)],
              [
                ["Conclude", "得出结论"],
                [
                  `A test power of $${answer}$ is $1$, so its order is less than $${p - 1}$.`,
                  `$${answer}$ 有一个检验幂是 $1$，所以它的阶小于 $${p - 1}$。`,
                ],
              ],
            ],
            [
              `Listing powers directly, the order of $${answer}$ modulo $${p}$ is $${orderMod(answer, p)}$, less than $${p - 1}$.`,
              `直接列出各次幂，$${answer}$ 模 $${p}$ 的阶是 $${orderMod(answer, p)}$，小于 $${p - 1}$。`,
            ],
          );
        }
        const root = rng.pick(roots);
        const others = rng.shuffle(rest).slice(0, 3);
        return chosen(
          rng,
          [`Which of these is a primitive root modulo $${p}$?`, `下列哪个是模 $${p}$ 的原根？`],
          same(`${root}`),
          others.map(
            (g) =>
              [
                same(`${g}`),
                `Its order is only $${orderMod(g, p)}$, so its powers miss some nonzero remainders.`,
                `它的阶只有 $${orderMod(g, p)}$，所以它的幂取不到某些非零余数。`,
              ] as const,
          ),
          [
            setup,
            [["Test the candidate", "检验候选数"], testLine(root)],
            [
              ["Conclude", "得出结论"],
              [`No test power of $${root}$ is $1$, so its order is $${p - 1}$.`, `$${root}$ 的检验幂都不是 $1$，所以它的阶是 $${p - 1}$。`],
            ],
          ],
          [
            `Listing powers directly, the other options have orders $${others.map((g) => orderMod(g, p)).join(", ")}$, all less than $${p - 1}$.`,
            `直接列出各次幂，其他选项的阶是 $${others.map((g) => orderMod(g, p)).join(", ")}$，都小于 $${p - 1}$。`,
          ],
        );
      },
    ),
    point(
      "counting-primitive-roots",
      ["Counting primitive roots", "数原根的个数"],
      [
        "Modulo a prime $p$, the units form a cyclic group of size $p - 1$, and a cyclic group of that size has $\\varphi(p - 1)$ generators. So the number of primitive roots modulo $p$ is $\\varphi(p - 1)$, not $\\varphi(p)$. Modulo $13$, for instance, there are $\\varphi(12) = 4$, and not all $12$ units.\n\nCheck: the primitive roots modulo $13$ are $2, 6, 7, 11$, four of them.\n\n> **Watch out.** Apply $\\varphi$ to $p - 1$, not to $p$: $\\varphi(13) = 12$ counts all the units, not the generators.",
        "模质数 $p$ 时，单位构成大小为 $p - 1$ 的循环群，这样的循环群有 $\\varphi(p - 1)$ 个生成元。所以模 $p$ 的原根个数是 $\\varphi(p - 1)$，而不是 $\\varphi(p)$。例如模 $13$ 时有 $\\varphi(12) = 4$ 个，而不是全部 $12$ 个单位。\n\n检验：模 $13$ 的原根是 $2, 6, 7, 11$，共四个。\n\n> **注意。** 要对 $p - 1$ 求 $\\varphi$，而不是对 $p$：$\\varphi(13) = 12$ 数的是全部单位，不是生成元。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(primesUpTo(200).filter((q) => q > 5));
          const answer = totient(p - 1);
          return worked(
            [`How many primitive roots are there modulo the prime $${p}$?`, `模质数 $${p}$ 的原根有多少个？`],
            answer,
            [
              [
                p - 1,
                `That is $\\varphi(${p})$, the number of all units, not of generators.`,
                `那是 $\\varphi(${p})$，即全部单位的个数，不是生成元的个数。`,
              ],
              [
                (p - 1) / 2,
                "That assumes half the units are generators, which is true only when $p - 1$ is a power of two.",
                "那以为一半的单位是生成元，这只在 $p - 1$ 是 2 的幂时成立。",
              ],
              [
                divisors(p - 1).length,
                `That counts the divisors of $${p - 1}$, which are the possible orders, not the generators.`,
                `那数的是 $${p - 1}$ 的因数，即可能的阶，不是生成元。`,
              ],
              [
                1,
                "There is more than one primitive root; any power of one with exponent coprime to $p - 1$ is another.",
                "原根不止一个；原根的与 $p - 1$ 互质的次幂都是原根。",
              ],
            ],
            [
              [
                ["Count generators", "数生成元"],
                [
                  `The units form a cyclic group of size $${p - 1}$, with $\\varphi(${p - 1})$ generators.`,
                  `单位构成大小为 $${p - 1}$ 的循环群，有 $\\varphi(${p - 1})$ 个生成元。`,
                ],
              ],
              [
                ["Compute", "计算"],
                [
                  `$${p - 1} = ${factorizationLatex(factorize(p - 1))}$, so $\\varphi(${p - 1}) = ${phiProduct(p - 1)} = ${answer}$.`,
                  `$${p - 1} = ${factorizationLatex(factorize(p - 1))}$，所以 $\\varphi(${p - 1}) = ${phiProduct(p - 1)} = ${answer}$。`,
                ],
              ],
            ],
            [`With the fractions, $${phiFractions(p - 1)}$.`, `用比例计算，$${phiFractions(p - 1)}$。`],
          );
        }),
    ),
  ],
);

const discreteLogs = topic(
  "discrete-logarithms",
  ["Discrete Logarithms", "离散对数"],
  ["Solve for an exponent modulo a prime, and see how a key exchange uses it.", "求模质数的指数，并了解密钥交换怎样使用它。"],
  ["primitive-roots"],
  [],
  [
    point(
      "solving-for-the-exponent",
      ["Solving for the exponent", "求指数"],
      [
        "The discrete logarithm of $h$ to base $g$ modulo $p$ is the exponent $x$ with $g^x \\equiv h \\pmod{p}$. For a primitive root, every nonzero remainder has exactly one such exponent from $0$ to $p - 2$. Small cases are solved by listing powers. For large primes no fast method is known, which is exactly why cryptography relies on this problem. To solve $3^{x} \\equiv 13 \\pmod{17}$: the powers of $3$ are $3, 9, 10, 13$, so $x = 4$.\n\nCheck: $3^{4} = 81 = 4 \\times 17 + 13$.\n\n> **Watch out.** The answer is the exponent, not the power: the list is read by position, and the first entry, $3$, is the first power, not the zeroth.",
        "$h$ 以 $g$ 为底模 $p$ 的离散对数，是满足 $g^x \\equiv h \\pmod{p}$ 的指数 $x$。对原根，每个非零余数恰有一个这样的指数，取值从 0 到 $p - 2$。小的情况可以列出幂来求解。对大的质数，还不知道快速的方法，这正是密码学依赖这个问题的原因。解 $3^{x} \\equiv 13 \\pmod{17}$：$3$ 的各次幂是 $3, 9, 10, 13$，所以 $x = 4$。\n\n检验：$3^{4} = 81 = 4 \\times 17 + 13$。\n\n> **注意。** 答案是指数，不是幂的值：按位置读这张表，第一项 $3$ 是一次幂，不是零次幂。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([7, 11, 13, 17, 19, 23, 29, 31]);
          const g = rng.pick(Array.from({ length: p - 2 }, (_, i) => i + 2).filter((v) => isPrimitiveRoot(v, p)));
          const x = rng.int(2, p - 2);
          const h = powMod(g, x, p);
          const powers = Array.from({ length: x }, (_, i) => powMod(g, i + 1, p));
          const prev = powMod(g, x - 1, p);
          return worked(
            [
              `Find $x$ with $0 \\le x \\le ${p - 2}$ such that $${g}^x \\equiv ${h} \\pmod{${p}}$.`,
              `求满足 $0 \\le x \\le ${p - 2}$ 且 $${g}^x \\equiv ${h} \\pmod{${p}}$ 的 $x$。`,
            ],
            x,
            [
              [h, "That is the value of the power, not the exponent.", "那是幂的值，不是指数。"],
              [x - 1, "That counts the first power in the list as the zeroth.", "那把表中的一次幂当成了零次幂。"],
              [
                p - 1 - x,
                `That is the exponent of the inverse of $${h}$, since $${g}^{${p - 1 - x}} \\times ${g}^{${x}} = ${g}^{${p - 1}} \\equiv 1$.`,
                `那是 $${h}$ 的逆元的指数，因为 $${g}^{${p - 1 - x}} \\times ${g}^{${x}} = ${g}^{${p - 1}} \\equiv 1$。`,
              ],
            ],
            [
              [
                ["List the powers", "列出各次幂"],
                [
                  `Modulo $${p}$, the powers of $${g}$ are $${powers.join(", ")}$.`,
                  `模 $${p}$，$${g}$ 的各次幂是 $${powers.join(", ")}$。`,
                ],
              ],
              [
                ["Read the position", "读出位置"],
                [`$${h}$ appears at power $${x}$.`, `$${h}$ 出现在第 $${x}$ 次幂。`],
              ],
            ],
            [
              `$${pw(g, x - 1)} \\equiv ${prev}$, and $${prev} \\times ${g} = ${prev * g} \\equiv ${h} \\pmod{${p}}$.`,
              `$${pw(g, x - 1)} \\equiv ${prev}$，而 $${prev} \\times ${g} = ${prev * g} \\equiv ${h} \\pmod{${p}}$。`,
            ],
          );
        }),
    ),
    point(
      "a-diffie-hellman-key",
      ["A Diffie–Hellman key", "迪菲–赫尔曼密钥"],
      [
        "In a Diffie–Hellman exchange, two people share a prime $p$ and a base $g$ in public and keep secret exponents $a$ and $b$. One sends $g^{a}$, the other sends $g^{b}$, and each raises what they receive to their own secret. Both arrive at $g^{ab}$ modulo $p$, while an eavesdropper would need a discrete logarithm to find it. With $p = 23$, $g = 5$, $a = 6$ and $b = 15$: the messages are $5^{6} \\equiv 8$ and $5^{15} \\equiv 19$, and the first person computes $19^{6} \\equiv 2$.\n\nCheck: the second person computes $8^{15} \\equiv 2 \\pmod{23}$, the same key.\n\n> **Watch out.** Raise the received value to your own secret. Multiplying by the secret, or adding the two secrets in the exponent, gives a number the other person cannot reach.",
        "在迪菲–赫尔曼交换中，两个人公开共用一个质数 $p$ 和一个底数 $g$，分别保留秘密指数 $a$ 和 $b$。一人发送 $g^{a}$，另一人发送 $g^{b}$，再各自把收到的值取自己秘密次幂。两人都得到模 $p$ 的 $g^{ab}$，而窃听者需要求离散对数才能得到它。取 $p = 23$，$g = 5$，$a = 6$，$b = 15$：发送的值是 $5^{6} \\equiv 8$ 和 $5^{15} \\equiv 19$，第一个人计算 $19^{6} \\equiv 2$。\n\n检验：第二个人计算 $8^{15} \\equiv 2 \\pmod{23}$，得到同一个密钥。\n\n> **注意。** 要把收到的值取自己秘密次幂。乘以秘密，或把两个秘密在指数上相加，得到的数对方算不出来。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([23, 29, 31, 37, 41, 43, 47]);
          const g = rng.pick(Array.from({ length: p - 2 }, (_, i) => i + 2).filter((v) => isPrimitiveRoot(v, p)));
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const sent = powMod(g, a, p);
          const other = powMod(g, b, p);
          const key = powMod(g, a * b, p);
          return worked(
            [
              `With prime $${p}$ and base $${g}$, one person has secret $${a}$ and receives $${other}$ from the other. What is the shared key?`,
              `质数为 $${p}$，底数为 $${g}$，一个人的秘密是 $${a}$，收到对方发来的 $${other}$。共同密钥是多少？`,
            ],
            key,
            [
              [sent, `That is this person's own message, $${g}^{${a}}$, not the key.`, `那是这个人自己发出的值 $${g}^{${a}}$，不是密钥。`],
              [other, "That is the received value itself, before raising it to the secret.", "那是收到的值本身，还没有取秘密次幂。"],
              [
                (other * a) % p,
                "That multiplies the received value by the secret instead of raising it to that power.",
                "那是把收到的值乘以秘密，而不是取秘密次幂。",
              ],
              [
                powMod(g, a + b, p),
                "That adds the secrets in the exponent; the key is $g^{ab}$, which multiplies them.",
                "那是把两个秘密在指数上相加；密钥是 $g^{ab}$，指数要相乘。",
              ],
            ],
            [
              [
                ["Raise the received value", "把收到的值取幂"],
                [`The key is $${other}^{${a}}$ modulo $${p}$.`, `密钥是 $${other}^{${a}}$ 模 $${p}$。`],
              ],
              [
                ["Compute", "计算"],
                [`$${other}^{${a}} \\equiv ${key} \\pmod{${p}}$.`, `$${other}^{${a}} \\equiv ${key} \\pmod{${p}}$。`],
              ],
            ],
            [
              `The other person's secret is $${b}$, since $${g}^{${b}} \\equiv ${other}$; they compute $${sent}^{${b}} \\equiv ${key}$, the same key $${g}^{${a * b}}$.`,
              `对方的秘密是 $${b}$，因为 $${g}^{${b}} \\equiv ${other}$；对方计算 $${sent}^{${b}} \\equiv ${key}$，是同一个密钥 $${g}^{${a * b}}$。`,
            ],
          );
        }),
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
        "A number is a quadratic residue modulo a prime when it is congruent to a perfect square and not divisible by the prime. To list the residues, square only the numbers from one to half of $p$, because $x$ and $-x$ have the same square. The remaining nonzero remainders are the nonresidues, and these have no square root modulo $p$. Modulo $11$, the squares of $1$ to $5$ are $1, 4, 9, 5, 3$, so the residues are $1, 3, 4, 5, 9$ and the nonresidues $2, 6, 7, 8, 10$.\n\nCheck: $6^{2} = 36 \\equiv 3$ and $10^{2} = 100 \\equiv 1$, already on the list, as $6 \\equiv -5$ and $10 \\equiv -1$.\n\n> **Watch out.** Reduce each square modulo $p$ before comparing: $5^{2} = 25$ is the residue $3$ modulo $11$, and $25$ itself is not on the list.",
        "一个数如果同余于完全平方数且不被质数整除，就是模这个质数的二次剩余。要列出二次剩余，只需把 1 到 $p$ 的一半的数平方，因为 $x$ 和 $-x$ 的平方相同。其余的非零余数是二次非剩余，模 $p$ 时它们不是任何数的平方。模 $11$ 时，$1$ 到 $5$ 的平方是 $1, 4, 9, 5, 3$，所以二次剩余是 $1, 3, 4, 5, 9$，二次非剩余是 $2, 6, 7, 8, 10$。\n\n检验：$6^{2} = 36 \\equiv 3$，$10^{2} = 100 \\equiv 1$，都已在表中，因为 $6 \\equiv -5$，$10 \\equiv -1$。\n\n> **注意。** 比较之前要先把每个平方模 $p$ 约简：$5^{2} = 25$ 模 $11$ 是二次剩余 $3$，而 $25$ 本身不在表中。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((q) => q > 10 && q < 100));
        const squares = residues(p);
        const others = Array.from({ length: p - 1 }, (_, i) => i + 1).filter((v) => !squares.includes(v));
        const rootOf = (v: number) => Array.from({ length: p - 1 }, (_, i) => i + 1).find((x) => (x * x) % p === v) as number;
        const half = (p - 1) / 2;
        const listing: Walk = [
          ["List the squares", "列出平方数"],
          [
            `Squaring $1$ to $${half}$ modulo $${p}$ gives the residues $${squares.join(", ")}$.`,
            `把 $1$ 到 $${half}$ 平方并模 $${p}$，得到二次剩余 $${squares.join(", ")}$。`,
          ],
        ];
        const euler = (v: number): Pair => {
          const r = powMod(v, half, p);
          return [
            `By Euler's criterion, $${v}^{${half}} \\equiv ${r} \\pmod{${p}}$, which is ${r === 1 ? "$1$, so a residue" : "$-1$, so a nonresidue"}.`,
            `由欧拉判别法，$${v}^{${half}} \\equiv ${r} \\pmod{${p}}$，${r === 1 ? "是 $1$，所以是二次剩余" : "是 $-1$，所以是二次非剩余"}。`,
          ];
        };
        if (rng.bool()) {
          const answer = rng.pick(others);
          const shown = rng.shuffle(squares).slice(0, 3);
          return chosen(
            rng,
            [`Which of these is not a quadratic residue modulo $${p}$?`, `下列哪个不是模 $${p}$ 的二次剩余？`],
            same(`${answer}`),
            shown.map(
              (v) =>
                [
                  same(`${v}`),
                  `$${rootOf(v)}^{2} = ${rootOf(v) ** 2} \\equiv ${v} \\pmod{${p}}$, so it is a residue.`,
                  `$${rootOf(v)}^{2} = ${rootOf(v) ** 2} \\equiv ${v} \\pmod{${p}}$，所以它是二次剩余。`,
                ] as const,
            ),
            [
              listing,
              [
                ["Compare", "比较"],
                [`$${answer}$ is not among them.`, `$${answer}$ 不在其中。`],
              ],
            ],
            euler(answer),
          );
        }
        const answer = rng.pick(squares);
        const shown = rng.shuffle(others).slice(0, 3);
        const root = rootOf(answer);
        return chosen(
          rng,
          [`Which of these is a quadratic residue modulo $${p}$?`, `下列哪个是模 $${p}$ 的二次剩余？`],
          same(`${answer}`),
          shown.map(
            (v) =>
              [
                same(`${v}`),
                `$${v}$ is not among the squares modulo $${p}$, so no number squares to it.`,
                `$${v}$ 不在模 $${p}$ 的平方数中，所以没有数的平方等于它。`,
              ] as const,
          ),
          [
            listing,
            [
              ["Compare", "比较"],
              [
                `$${root}^{2} = ${root * root} \\equiv ${answer} \\pmod{${p}}$, and $${answer}$ is the only option on the list.`,
                `$${root}^{2} = ${root * root} \\equiv ${answer} \\pmod{${p}}$，而 $${answer}$ 是唯一在表中的选项。`,
              ],
            ],
          ],
          euler(answer),
        );
      },
    ),
    point(
      "counting-residues",
      ["Counting residues", "数二次剩余的个数"],
      [
        "Modulo an odd prime $p$, squaring sends $x$ and $-x$ to the same value and no other pair collides, so the $p - 1$ nonzero remainders produce exactly half that many squares. There are therefore as many residues as nonresidues. The count does not depend on anything else about $p$, and a composite modulus behaves quite differently, so primality is essential. Modulo $13$ there are $\\frac{12}{2} = 6$ residues: $1, 3, 4, 9, 10, 12$.\n\nCheck: the other six nonzero remainders, $2, 5, 6, 7, 8, 11$, are the nonresidues, and $6 + 6 = 12$.\n\n> **Watch out.** Zero is a square but is not counted as a residue, so the count is $\\frac{p - 1}{2}$, not $\\frac{p + 1}{2}$.",
        "模奇质数 $p$ 时，平方把 $x$ 和 $-x$ 送到同一个值，其他的数不会相撞，所以 $p - 1$ 个非零余数恰好产生一半那么多的平方数。因此二次剩余和二次非剩余一样多。这个个数和 $p$ 的其他性质无关，合数模数的情况很不相同，所以质数这个条件很关键。模 $13$ 时有 $\\frac{12}{2} = 6$ 个二次剩余：$1, 3, 4, 9, 10, 12$。\n\n检验：其余六个非零余数 $2, 5, 6, 7, 8, 11$ 是二次非剩余，$6 + 6 = 12$。\n\n> **注意。** 零是平方数，但不算二次剩余，所以个数是 $\\frac{p - 1}{2}$，而不是 $\\frac{p + 1}{2}$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(primesUpTo(300).filter((q) => q > 2));
          const asksNon = rng.bool();
          const answer = (p - 1) / 2;
          return worked(
            [
              `How many nonzero ${asksNon ? "quadratic nonresidues" : "quadratic residues"} are there modulo $${p}$?`,
              `模 $${p}$ 的非零${asksNon ? "二次非剩余" : "二次剩余"}有多少个？`,
            ],
            answer,
            [
              [
                p - 1,
                "That counts every nonzero remainder; only half of them are squares.",
                "那数的是所有非零余数；其中只有一半是平方数。",
              ],
              [answer + 1, "That counts $0$ as well, which is excluded.", "那把 $0$ 也算进去了，但 $0$ 不计入。"],
              [p, "That counts every remainder, zero included.", "那数的是所有余数，包括零。"],
              [totient(p - 1), "That is the number of primitive roots, a different count.", "那是原根的个数，是另一个计数。"],
            ],
            [
              [
                ["Pair the remainders", "把余数配对"],
                [
                  `The $${p - 1}$ nonzero remainders pair off as $x$ and $-x$, with equal squares.`,
                  `$${p - 1}$ 个非零余数两两配对成 $x$ 和 $-x$，平方相同。`,
                ],
              ],
              [
                ["Halve", "取一半"],
                [
                  `So there are $\\frac{${p - 1}}{2} = ${answer}$ residues, and the other $${answer}$ are nonresidues.`,
                  `所以有 $\\frac{${p - 1}}{2} = ${answer}$ 个二次剩余，另外 $${answer}$ 个是二次非剩余。`,
                ],
              ],
            ],
            [
              `$${answer} + ${answer} = ${p - 1}$ accounts for every nonzero remainder exactly once.`,
              `$${answer} + ${answer} = ${p - 1}$，每个非零余数恰好计入一次。`,
            ],
          );
        }),
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
        "The Legendre symbol $\\left(\\frac{a}{p}\\right)$ records whether $a$ is a square modulo the odd prime $p$: $1$ for a residue, $-1$ for a nonresidue, and $0$ when $p$ divides $a$. The numerator can be reduced modulo $p$ first, since the symbol depends only on the remainder. For small primes, a list of the squares settles the matter. For $\\left(\\frac{20}{7}\\right)$: $20 \\equiv 6 \\pmod{7}$, and the squares modulo $7$ are $1, 2, 4$, so the symbol is $-1$.\n\nCheck: by Euler's criterion, $6^{3} = 216 = 30 \\times 7 + 6$, and $6 \\equiv -1$.\n\n> **Watch out.** The symbol is not a fraction and is not $a$ divided by $p$; its only values are $1$, $-1$ and $0$.",
        "勒让德符号 $\\left(\\frac{a}{p}\\right)$ 记录 $a$ 模奇质数 $p$ 是否为平方数：二次剩余为 $1$，二次非剩余为 $-1$，$p$ 整除 $a$ 时为 $0$。分子可以先模 $p$ 约简，因为符号只取决于余数。对较小的质数，列出平方数就能解决问题。求 $\\left(\\frac{20}{7}\\right)$：$20 \\equiv 6 \\pmod{7}$，模 $7$ 的平方数是 $1, 2, 4$，所以符号是 $-1$。\n\n检验：由欧拉判别法，$6^{3} = 216 = 30 \\times 7 + 6$，而 $6 \\equiv -1$。\n\n> **注意。** 这个符号不是分数，也不是 $a$ 除以 $p$；它只取 $1$、$-1$、$0$ 三个值。",
      ],
      (rng) => {
        const p = rng.pick(oddPrimes.filter((q) => q >= 5 && q < 40));
        const a = rng.int(2, 60);
        const value = legendre(a % p, p);
        const r = a % p;
        const half = (p - 1) / 2;
        const reasons: Record<string, readonly [string, string]> =
          r === 0
            ? {
                "1": [`$${p}$ divides $${a}$, so the symbol is $0$, not $\\pm 1$.`, `$${p}$ 整除 $${a}$，所以符号是 $0$，不是 $\\pm 1$。`],
                "-1": [`$${p}$ divides $${a}$, so the symbol is $0$, not $\\pm 1$.`, `$${p}$ 整除 $${a}$，所以符号是 $0$，不是 $\\pm 1$。`],
              }
            : {
                "1": [
                  `$${r}$ is not among the squares modulo $${p}$, so it is not a residue.`,
                  `$${r}$ 不在模 $${p}$ 的平方数中，所以不是二次剩余。`,
                ],
                "-1": [`$${r}$ is a square modulo $${p}$, so it is a residue.`, `$${r}$ 是模 $${p}$ 的平方数，所以是二次剩余。`],
                "0": [
                  `$0$ would need $${p}$ to divide $${a}$, but $${a}$ leaves $${r}$.`,
                  `$0$ 要求 $${p}$ 整除 $${a}$，但 $${a}$ 余 $${r}$。`,
                ],
              };
        return chosen(
          rng,
          [`What is $\\left(\\frac{${a}}{${p}}\\right)$?`, `$\\left(\\frac{${a}}{${p}}\\right)$ 是多少？`],
          signWord(value),
          [1, -1, 0].filter((v) => v !== value).map((v) => [signWord(v), ...(reasons[`${v}`] as readonly [string, string])] as const),
          r === 0
            ? [
                [
                  ["Reduce the numerator", "约简分子"],
                  [
                    `$${a} = ${p} \\times ${a / p}$, so $${a} \\equiv 0 \\pmod{${p}}$.`,
                    `$${a} = ${p} \\times ${a / p}$，所以 $${a} \\equiv 0 \\pmod{${p}}$。`,
                  ],
                ],
                [
                  ["Read the symbol", "读出符号"],
                  ["When the prime divides the numerator, the symbol is $0$.", "质数整除分子时，符号是 $0$。"],
                ],
              ]
            : [
                [
                  ["Reduce the numerator", "约简分子"],
                  [`$${a} \\equiv ${r} \\pmod{${p}}$.`, `$${a} \\equiv ${r} \\pmod{${p}}$。`],
                ],
                [
                  ["Compare with the squares", "与平方数比较"],
                  [
                    `The squares modulo $${p}$ are $${residues(p).join(", ")}$, so $${r}$ ${value === 1 ? "is a residue" : "is a nonresidue"}.`,
                    `模 $${p}$ 的平方数是 $${residues(p).join(", ")}$，所以 $${r}$ ${value === 1 ? "是二次剩余" : "是二次非剩余"}。`,
                  ],
                ],
              ],
          r === 0
            ? [
                `Any multiple of $${p}$ is $\\equiv 0$, and $0$ is neither a residue nor a nonresidue.`,
                `$${p}$ 的倍数都 $\\equiv 0$，而 $0$ 既不是二次剩余也不是二次非剩余。`,
              ]
            : [
                `By Euler's criterion, $${pw(r, half)} \\equiv ${powMod(r, half, p)} \\pmod{${p}}$, which is $${value}$.`,
                `由欧拉判别法，$${pw(r, half)} \\equiv ${powMod(r, half, p)} \\pmod{${p}}$，即 $${value}$。`,
              ],
        );
      },
    ),
    point(
      "multiplying-symbols",
      ["Multiplying symbols", "符号相乘"],
      [
        "The Legendre symbol is multiplicative in its numerator: the symbol of a product is the product of the symbols. In words, residue times residue is a residue, nonresidue times residue is a nonresidue, and nonresidue times nonresidue is a residue. That last case surprises many people. It lets a composite numerator be broken into primes and evaluated piece by piece. Modulo $7$, $3$ and $5$ are both nonresidues, so $\\left(\\frac{15}{7}\\right) = (-1) \\times (-1) = 1$.\n\nCheck: $15 \\equiv 1 \\pmod{7}$, and $1 = 1^{2}$ is a square.\n\n> **Watch out.** Multiply the symbols, do not add them: two nonresidues give $1$, not $-2$, and the result is never $0$ unless $p$ divides the product.",
        "勒让德符号关于分子是积性的：积的符号等于符号的积。也就是说，剩余乘剩余是剩余，非剩余乘剩余是非剩余，非剩余乘非剩余是剩余。最后一种情况让很多人意外。这样就能把合数分子分解成质数，逐个计算。模 $7$ 时，$3$ 和 $5$ 都是二次非剩余，所以 $\\left(\\frac{15}{7}\\right) = (-1) \\times (-1) = 1$。\n\n检验：$15 \\equiv 1 \\pmod{7}$，而 $1 = 1^{2}$ 是平方数。\n\n> **注意。** 符号要相乘，不能相加：两个二次非剩余得到 $1$，不是 $-2$；而且除非 $p$ 整除这个积，结果不会是 $0$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(oddPrimes.filter((q) => q > 10 && q < 90));
          const [a, b] = rng.sample(
            Array.from({ length: p - 2 }, (_, i) => i + 2),
            2,
          ) as [number, number];
          const [la, lb] = [legendre(a, p), legendre(b, p)];
          const value = la * lb;
          const r = (a * b) % p;
          const half = (p - 1) / 2;
          const shown = (v: number) => (v < 0 ? `(${v})` : `${v}`);
          return worked(
            [
              `Given $\\left(\\frac{${a}}{${p}}\\right) = ${la}$ and $\\left(\\frac{${b}}{${p}}\\right) = ${lb}$, what is $\\left(\\frac{${a * b}}{${p}}\\right)$?`,
              `已知 $\\left(\\frac{${a}}{${p}}\\right) = ${la}$，$\\left(\\frac{${b}}{${p}}\\right) = ${lb}$，$\\left(\\frac{${a * b}}{${p}}\\right)$ 是多少？`,
            ],
            value,
            [
              [
                -value,
                la === -1 && lb === -1
                  ? "Two nonresidues multiply to a residue, not a nonresidue."
                  : "That flips the sign of the product of the symbols.",
                la === -1 && lb === -1 ? "两个二次非剩余相乘是二次剩余，不是二次非剩余。" : "那把两个符号之积的正负号弄反了。",
              ],
              [
                la + lb,
                "That adds the symbols; the symbol is multiplicative, so they multiply.",
                "那是把符号相加；这个符号是积性的，所以要相乘。",
              ],
              [0, `$0$ would need $${p}$ to divide $${a * b}$, which it does not.`, `$0$ 要求 $${p}$ 整除 $${a * b}$，但它不整除。`],
            ],
            [
              [
                ["Use multiplicativity", "利用积性"],
                [
                  `$\\left(\\frac{${a * b}}{${p}}\\right) = \\left(\\frac{${a}}{${p}}\\right) \\left(\\frac{${b}}{${p}}\\right)$.`,
                  `$\\left(\\frac{${a * b}}{${p}}\\right) = \\left(\\frac{${a}}{${p}}\\right) \\left(\\frac{${b}}{${p}}\\right)$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [`$${shown(la)} \\times ${shown(lb)} = ${value}$.`, `$${shown(la)} \\times ${shown(lb)} = ${value}$。`],
              ],
            ],
            [
              `Directly, $${a * b} \\equiv ${r} \\pmod{${p}}$, and by Euler's criterion $${pw(r, half)} \\equiv ${powMod(r, half, p)}$, which is $${value}$.`,
              `直接计算，$${a * b} \\equiv ${r} \\pmod{${p}}$，由欧拉判别法 $${pw(r, half)} \\equiv ${powMod(r, half, p)}$，即 $${value}$。`,
            ],
          );
        }),
    ),
  ],
);

const eulerCriterion = topic(
  "eulers-criterion",
  ["Euler's Criterion", "欧拉判别法"],
  ["Decide residues with a power, including when −1 is a square.", "用幂判断二次剩余，包括 −1 何时是平方数。"],
  ["the-legendre-symbol", "using-fermats-little-theorem"],
  [["the-legendre-symbol", 0.3]],
  [
    point(
      "the-half-power",
      ["The half power", "半幂"],
      [
        "Euler's criterion says that $a^{(p-1)/2}$ is congruent to the Legendre symbol $\\left(\\frac{a}{p}\\right)$. By Fermat's little theorem, the square of this half power is one, so it can only be $1$ or $-1$, and $-1$ is written as $p - 1$. This gives a calculation by repeated squaring, with no need for a table of squares. For $2^{5} \\bmod 11$: $2^{5} = 32 = 2 \\times 11 + 10$, so the value is $10 \\equiv -1$ and $2$ is a nonresidue modulo $11$.\n\nCheck: the squares modulo $11$ are $1, 3, 4, 5, 9$, and $2$ is not among them.\n\n> **Watch out.** The half power of a number not divisible by $p$ is never $0$ and never anything other than $1$ or $p - 1$; any other result means an arithmetic slip.",
        "欧拉判别法说，$a^{(p-1)/2}$ 同余于勒让德符号 $\\left(\\frac{a}{p}\\right)$。由费马小定理，这个半幂的平方是 1，所以它只能是 $1$ 或 $-1$，而 $-1$ 写作 $p - 1$。这样就可以用反复平方来计算，不需要平方数表。求 $2^{5} \\bmod 11$：$2^{5} = 32 = 2 \\times 11 + 10$，所以值是 $10 \\equiv -1$，$2$ 是模 $11$ 的二次非剩余。\n\n检验：模 $11$ 的平方数是 $1, 3, 4, 5, 9$，$2$ 不在其中。\n\n> **注意。** 不被 $p$ 整除的数，它的半幂从不为 $0$，也只能是 $1$ 或 $p - 1$；得到别的结果说明算错了。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(oddPrimes.filter((q) => q > 5));
          const a = rng.int(2, p - 1);
          const half = (p - 1) / 2;
          const answer = powMod(a, half, p);
          const { squares, used } = binaryPlan(a, half, p);
          const root = Array.from({ length: half }, (_, i) => i + 1).find((x) => (x * x) % p === a);
          return worked(
            [`What is the remainder of $${a}^{${half}}$ when divided by $${p}$?`, `$${a}^{${half}}$ 除以 $${p}$ 的余数是多少？`],
            answer,
            [
              [
                answer === 1 ? p - 1 : 1,
                answer === 1
                  ? `That is the value for a nonresidue, but $${a}$ is a square modulo $${p}$.`
                  : `That is the value for a residue, but $${a}$ is not a square modulo $${p}$.`,
                answer === 1
                  ? `那是二次非剩余的值，但 $${a}$ 是模 $${p}$ 的平方数。`
                  : `那是二次剩余的值，但 $${a}$ 不是模 $${p}$ 的平方数。`,
              ],
              ...(answer === p - 1
                ? ([
                    [
                      -1,
                      `That is $-1$ itself; as a remainder from $0$ to $${p - 1}$ it is written $${p - 1}$.`,
                      `那是 $-1$ 本身；作为 $0$ 到 $${p - 1}$ 之间的余数，要写成 $${p - 1}$。`,
                    ],
                  ] as const)
                : []),
              [
                0,
                `$${p}$ does not divide $${a}$, so no power of $${a}$ is $\\equiv 0$.`,
                `$${p}$ 不整除 $${a}$，所以 $${a}$ 的任何次幂都不 $\\equiv 0$。`,
              ],
              [half, "That is the exponent, not the value of the power.", "那是指数，不是幂的值。"],
            ],
            [
              [
                ["Square repeatedly", "反复平方"],
                [
                  `Modulo $${p}$: ${squares.map((s, i) => `$${pw(a, 2 ** i)} \\equiv ${s}$`).join(", ")}.`,
                  `模 $${p}$：${squares.map((s, i) => `$${pw(a, 2 ** i)} \\equiv ${s}$`).join("，")}。`,
                ],
              ],
              [
                ["Multiply the chosen squares", "把选中的平方相乘"],
                [
                  `$${half} = ${used
                    .map((i) => 2 ** i)
                    .reverse()
                    .join(" + ")}$, and $${times(used.map((i) => squares[i] as number))} \\equiv ${answer} \\pmod{${p}}$.`,
                  `$${half} = ${used
                    .map((i) => 2 ** i)
                    .reverse()
                    .join(" + ")}$，而 $${times(used.map((i) => squares[i] as number))} \\equiv ${answer} \\pmod{${p}}$。`,
                ],
              ],
            ],
            root
              ? [
                  `$${a}$ is a square, $${root}^{2} = ${root * root} \\equiv ${a}$, so Euler's criterion gives $1$.`,
                  `$${a}$ 是平方数，$${root}^{2} = ${root * root} \\equiv ${a}$，所以欧拉判别法给出 $1$。`,
                ]
              : [
                  `$${answer}^{2} = ${answer * answer} \\equiv 1 \\pmod{${p}}$, as Fermat's theorem requires, and $${answer} \\equiv -1$.`,
                  `$${answer}^{2} = ${answer * answer} \\equiv 1 \\pmod{${p}}$，符合费马定理，且 $${answer} \\equiv -1$。`,
                ],
          );
        }),
    ),
    point(
      "when-minus-one-is-a-square",
      ["When −1 is a square", "−1 何时是平方数"],
      [
        "Applying Euler's criterion to $-1$ gives $(-1)^{(p-1)/2}$, which is one when $(p - 1)/2$ is even. So $-1$ is a square modulo an odd prime exactly when the prime leaves remainder one on division by four. For primes leaving remainder three, no number squares to $-1$, as with the real numbers. For $13 = 4 \\times 3 + 1$, $-1$ is a square, and indeed $5^{2} = 25 = 2 \\times 13 - 1$.\n\nCheck: for $7 = 4 \\times 1 + 3$, the squares modulo $7$ are $1, 2, 4$, and $-1 \\equiv 6$ is not among them.\n\n> **Watch out.** Look at the remainder of $p$ on division by four, not at whether $p$ is odd: every odd prime is odd, but only those of the form $4k + 1$ have a square root of $-1$.",
        "把欧拉判别法用于 $-1$，得到 $(-1)^{(p-1)/2}$，当 $(p - 1)/2$ 是偶数时为 1。所以 $-1$ 模奇质数是平方数，当且仅当这个质数除以 4 余 1。对除以 4 余 3 的质数，没有数的平方等于 $-1$，就像在实数中一样。对 $13 = 4 \\times 3 + 1$，$-1$ 是平方数，确实 $5^{2} = 25 = 2 \\times 13 - 1$。\n\n检验：对 $7 = 4 \\times 1 + 3$，模 $7$ 的平方数是 $1, 2, 4$，而 $-1 \\equiv 6$ 不在其中。\n\n> **注意。** 要看 $p$ 除以 4 的余数，而不是看 $p$ 是不是奇数：奇质数都是奇数，但只有形如 $4k + 1$ 的才有 $-1$ 的平方根。",
      ],
      (rng) => {
        const pick = rng.pick(primesUpTo(300).filter((q) => q % 4 === 1));
        const others = rng.shuffle(primesUpTo(300).filter((q) => q % 4 === 3)).slice(0, 3);
        const root = Array.from({ length: pick - 1 }, (_, i) => i + 1).find((x) => (x * x + 1) % pick === 0) as number;
        const [lo, hi] = bounds([pick, ...others]);
        return chosen(
          rng,
          [
            `Modulo which of these primes between $${lo}$ and $${hi}$ is $-1$ a square?`,
            `模下列在 $${lo}$ 和 $${hi}$ 之间的哪个质数时，$-1$ 是平方数？`,
          ],
          same(`${pick}`),
          others.map(
            (q) =>
              [
                same(`${q}`),
                `$${q} = 4 \\times ${(q - 3) / 4} + 3$ leaves $3$ on division by $4$, so $-1$ is not a square modulo $${q}$.`,
                `$${q} = 4 \\times ${(q - 3) / 4} + 3$ 除以 $4$ 余 $3$，所以 $-1$ 不是模 $${q}$ 的平方数。`,
              ] as const,
          ),
          [
            [
              ["Divide by four", "除以四"],
              [
                `$${pick} = 4 \\times ${(pick - 1) / 4} + 1$, while the others leave $3$.`,
                `$${pick} = 4 \\times ${(pick - 1) / 4} + 1$，其他几个都余 $3$。`,
              ],
            ],
            [
              ["Apply Euler's criterion", "应用欧拉判别法"],
              [
                `$(-1)^{${(pick - 1) / 2}} = 1$ since $${(pick - 1) / 2}$ is even, so $-1$ is a square modulo $${pick}$.`,
                `因为 $${(pick - 1) / 2}$ 是偶数，$(-1)^{${(pick - 1) / 2}} = 1$，所以 $-1$ 是模 $${pick}$ 的平方数。`,
              ],
            ],
          ],
          [
            `$${root}^{2} + 1 = ${root * root + 1} = ${pick} \\times ${(root * root + 1) / pick}$, so $${root}^{2} \\equiv -1 \\pmod{${pick}}$.`,
            `$${root}^{2} + 1 = ${root * root + 1} = ${pick} \\times ${(root * root + 1) / pick}$，所以 $${root}^{2} \\equiv -1 \\pmod{${pick}}$。`,
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
  [],
  [
    point(
      "flipping-a-symbol",
      ["Flipping a symbol", "翻转符号"],
      [
        "Quadratic reciprocity links two odd primes: $\\left(\\frac{p}{q}\\right)$ equals $\\left(\\frac{q}{p}\\right)$, except that the sign changes when both primes leave remainder three on division by four. After flipping, the larger number can be reduced modulo the smaller one. Repeating this makes the numbers fall quickly, as in the Euclidean algorithm, until the value is easy to see. For $\\left(\\frac{7}{19}\\right)$: both $7$ and $19$ leave $3$, so $\\left(\\frac{7}{19}\\right) = -\\left(\\frac{19}{7}\\right) = -\\left(\\frac{5}{7}\\right) = -(-1) = 1$.\n\nCheck: $11^{2} = 121 = 6 \\times 19 + 7$, so $7$ is indeed a square modulo $19$.\n\n> **Watch out.** The sign changes only when both primes leave remainder three; if even one of them leaves one, the symbol flips unchanged.",
        "二次互反律联系两个奇质数：$\\left(\\frac{p}{q}\\right)$ 等于 $\\left(\\frac{q}{p}\\right)$，只有当两个质数除以 4 都余 3 时才变号。翻转之后，较大的数可以模较小的数约简。重复这样做，数会很快变小，就像欧几里得算法一样，直到结果一目了然。求 $\\left(\\frac{7}{19}\\right)$：$7$ 和 $19$ 除以 4 都余 $3$，所以 $\\left(\\frac{7}{19}\\right) = -\\left(\\frac{19}{7}\\right) = -\\left(\\frac{5}{7}\\right) = -(-1) = 1$。\n\n检验：$11^{2} = 121 = 6 \\times 19 + 7$，所以 $7$ 确实是模 $19$ 的平方数。\n\n> **注意。** 只有当两个质数都余 3 时才变号；只要有一个余 1，翻转后符号不变。",
      ],
      (rng) => {
        const pool = oddPrimes.filter((q) => q >= 5 && q < 90);
        const [p, q] = rng.shuffle(pool) as [number, number];
        const value = legendre(p, q);
        const both = p % 4 === 3 && q % 4 === 3;
        const flipped = legendre(q, p);
        const half = (q - 1) / 2;
        const r = p % q;
        return chosen(
          rng,
          [
            `Given $\\left(\\frac{${q}}{${p}}\\right) = ${flipped}$, what is $\\left(\\frac{${p}}{${q}}\\right)$?`,
            `已知 $\\left(\\frac{${q}}{${p}}\\right) = ${flipped}$，$\\left(\\frac{${p}}{${q}}\\right)$ 是多少？`,
          ],
          signWord(value),
          [
            [
              signWord(-value),
              both
                ? "Both primes leave 3 on division by 4, so the sign does change."
                : "At least one prime leaves 1 on division by 4, so the sign does not change.",
              both ? "两个质数除以 4 都余 3，所以符号要变。" : "至少有一个质数除以 4 余 1，所以符号不变。",
            ],
            [
              signWord(0),
              `$0$ would need $${q}$ to divide $${p}$, but they are different primes.`,
              `$0$ 要求 $${q}$ 整除 $${p}$，但它们是不同的质数。`,
            ],
            [
              ["It cannot be determined", "无法确定"],
              "Quadratic reciprocity determines it from the given symbol.",
              "二次互反律可以由已知的符号确定它。",
            ],
          ],
          [
            [
              ["Divide by four", "除以四"],
              [
                `$${p}$ leaves $${p % 4}$ and $${q}$ leaves $${q % 4}$ on division by $4$.`,
                `$${p}$ 除以 $4$ 余 $${p % 4}$，$${q}$ 除以 $4$ 余 $${q % 4}$。`,
              ],
            ],
            [
              ["Flip", "翻转"],
              both
                ? [
                    `Both leave $3$, so the sign changes: $\\left(\\frac{${p}}{${q}}\\right) = -(${flipped}) = ${value}$.`,
                    `两个都余 $3$，所以变号：$\\left(\\frac{${p}}{${q}}\\right) = -(${flipped}) = ${value}$。`,
                  ]
                : [
                    `Not both leave $3$, so the sign stays: $\\left(\\frac{${p}}{${q}}\\right) = ${value}$.`,
                    `并非两个都余 $3$，所以符号不变：$\\left(\\frac{${p}}{${q}}\\right) = ${value}$。`,
                  ],
            ],
          ],
          [
            `By Euler's criterion, $${p} \\equiv ${r} \\pmod{${q}}$ and $${pw(r, half)} \\equiv ${powMod(r, half, q)} \\pmod{${q}}$, which is $${value}$.`,
            `由欧拉判别法，$${p} \\equiv ${r} \\pmod{${q}}$，而 $${pw(r, half)} \\equiv ${powMod(r, half, q)} \\pmod{${q}}$，即 $${value}$。`,
          ],
        );
      },
    ),
    point(
      "the-symbol-of-two",
      ["The symbol of two", "2 的符号"],
      [
        "Reciprocity needs a separate rule for the number two, because two is even. The rule depends on the prime modulo eight: two is a square when the prime leaves remainder one or seven, and it is not when the prime leaves remainder three or five. Together with the rule for minus one, this handles every numerator that arises after factoring. For $p = 17 = 2 \\times 8 + 1$, $\\left(\\frac{2}{17}\\right) = 1$, and indeed $6^{2} = 36 = 2 \\times 17 + 2$.\n\nCheck: for $p = 11 = 8 + 3$, the squares modulo $11$ are $1, 3, 4, 5, 9$, and $2$ is not among them, so $\\left(\\frac{2}{11}\\right) = -1$.\n\n> **Watch out.** Use the remainder modulo eight, not modulo four: $7$ and $3$ both leave $3$ modulo four, yet $2$ is a square modulo $7$ and not modulo $3$.",
        "互反律对 2 需要单独的规则，因为 2 是偶数。这个规则取决于质数模 8 的余数：质数余 1 或 7 时，2 是平方数；余 3 或 5 时不是。结合 −1 的规则，就能处理分解后出现的所有分子。对 $p = 17 = 2 \\times 8 + 1$，$\\left(\\frac{2}{17}\\right) = 1$，确实 $6^{2} = 36 = 2 \\times 17 + 2$。\n\n检验：对 $p = 11 = 8 + 3$，模 $11$ 的平方数是 $1, 3, 4, 5, 9$，$2$ 不在其中，所以 $\\left(\\frac{2}{11}\\right) = -1$。\n\n> **注意。** 要看模 8 的余数，而不是模 4：$7$ 和 $3$ 模 4 都余 $3$，但 $2$ 是模 $7$ 的平方数，却不是模 $3$ 的平方数。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(400).filter((q) => q > 2));
        const value = p % 8 === 1 || p % 8 === 7 ? 1 : -1;
        const half = (p - 1) / 2;
        return chosen(
          rng,
          [`What is $\\left(\\frac{2}{${p}}\\right)$?`, `$\\left(\\frac{2}{${p}}\\right)$ 是多少？`],
          signWord(value),
          [
            [
              signWord(-value),
              value === 1
                ? `$${p}$ leaves $${p % 8}$ modulo $8$, and for $1$ or $7$ two is a square.`
                : `$${p}$ leaves $${p % 8}$ modulo $8$, and for $3$ or $5$ two is not a square.`,
              value === 1
                ? `$${p}$ 模 $8$ 余 $${p % 8}$，余 $1$ 或 $7$ 时 2 是平方数。`
                : `$${p}$ 模 $8$ 余 $${p % 8}$，余 $3$ 或 $5$ 时 2 不是平方数。`,
            ],
            [signWord(0), `$0$ would need $${p}$ to divide $2$, but $${p}$ is odd.`, `$0$ 要求 $${p}$ 整除 $2$，但 $${p}$ 是奇数。`],
            [signWord(2), "The symbol only takes the values $1$, $-1$ and $0$.", "这个符号只取 $1$、$-1$、$0$。"],
          ],
          [
            [
              ["Divide by eight", "除以八"],
              [`$${p} = 8 \\times ${Math.floor(p / 8)} + ${p % 8}$.`, `$${p} = 8 \\times ${Math.floor(p / 8)} + ${p % 8}$。`],
            ],
            [
              ["Apply the rule", "应用规则"],
              [`Remainder $${p % 8}$ gives $${value}$.`, `余数 $${p % 8}$ 给出 $${value}$。`],
            ],
          ],
          [
            `By Euler's criterion, $${pw(2, half)} \\equiv ${powMod(2, half, p)} \\pmod{${p}}$, which is $${value}$.`,
            `由欧拉判别法，$${pw(2, half)} \\equiv ${powMod(2, half, p)} \\pmod{${p}}$，即 $${value}$。`,
          ],
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

/** asTwoSquares finds whole numbers x ≤ y with x² + y² = n, if there are any. */
const asTwoSquares = (n: number): [number, number] | undefined => {
  for (let x = 0; 2 * x * x <= n; x++) {
    const y = Math.round(Math.sqrt(n - x * x));
    if (x * x + y * y === n) return [x, y];
  }
  return undefined;
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
        "Fermat's theorem on sums of two squares says that an odd prime is a sum of two squares exactly when it leaves remainder one on division by four. Squares leave remainder zero or one modulo four, so a sum of two squares can never leave three. The hard direction of the proof uses the fact that minus one is a square for these primes. For $p = 29$: trying $b = 5$ leaves $29 - 25 = 4 = 2^{2}$, so $29 = 2^{2} + 5^{2}$.\n\nCheck: $29 = 4 \\times 7 + 1$ leaves remainder one, as the theorem requires, and $4 + 25 = 29$.\n\n> **Watch out.** Start $b$ at the largest whole number not above $\\sqrt{p}$ and work down; a value with $b^{2} > p$ leaves a negative remainder and cannot work.",
        "费马平方和定理说，奇质数是两个平方数之和，当且仅当它除以 4 余 1。平方数模 4 余 0 或 1，所以两个平方数之和不可能余 3。证明中困难的方向用到了这样的事实：对这些质数，−1 是平方数。对 $p = 29$：试 $b = 5$，剩下 $29 - 25 = 4 = 2^{2}$，所以 $29 = 2^{2} + 5^{2}$。\n\n检验：$29 = 4 \\times 7 + 1$ 除以 4 余 1，符合定理，而且 $4 + 25 = 29$。\n\n> **注意。** $b$ 要从不超过 $\\sqrt{p}$ 的最大整数开始往下试；$b^{2} > p$ 时余下的是负数，不可能成立。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(primesUpTo(400).filter((q) => q % 4 === 1));
          const [a, b] = twoSquares(p);
          const top = Math.floor(Math.sqrt(p));
          const tried = Array.from({ length: top - b + 1 }, (_, i) => top - i);
          return worked(
            [
              `The prime $${p}$ equals $a^2 + b^2$ for positive integers $a < b$. What is $b$?`,
              `质数 $${p}$ 等于 $a^2 + b^2$，其中 $a < b$ 是正整数。$b$ 是多少？`,
            ],
            b,
            [
              [a, `That is $a$, the smaller of the two.`, `那是较小的 $a$。`],
              [a + b, "That adds $a$ and $b$ instead of giving $b$.", "那是把 $a$ 和 $b$ 相加，而不是 $b$。"],
              [b * b, "That is $b^{2}$, not $b$.", "那是 $b^{2}$，不是 $b$。"],
              [
                top + 1,
                `That is past $\\sqrt{${p}}$: its square, $${(top + 1) ** 2}$, is already above $${p}$.`,
                `那超过了 $\\sqrt{${p}}$：它的平方 $${(top + 1) ** 2}$ 已经大于 $${p}$。`,
              ],
            ],
            [
              [
                ["Bound b", "确定 b 的范围"],
                [`$b^{2} < ${p}$, so $b \\le ${top}$.`, `$b^{2} < ${p}$，所以 $b \\le ${top}$。`],
              ],
              [
                ["Try downward", "向下试"],
                [
                  `${tried.map((v) => `$${p} - ${v * v} = ${p - v * v}$`).join(", ")}; the last is $${a}^{2}$.`,
                  `${tried.map((v) => `$${p} - ${v * v} = ${p - v * v}$`).join("，")}；最后一个是 $${a}^{2}$。`,
                ],
              ],
            ],
            [
              `$${a * a} + ${b * b} = ${p}$, and $${p} = 4 \\times ${(p - 1) / 4} + 1$ leaves remainder one, as the theorem requires.`,
              `$${a * a} + ${b * b} = ${p}$，而 $${p} = 4 \\times ${(p - 1) / 4} + 1$ 除以 4 余 1，符合定理。`,
            ],
          );
        }),
    ),
    point(
      "numbers-as-sums-of-two-squares",
      ["Numbers as sums of two squares", "表示为两平方数之和的整数"],
      [
        "A positive integer is a sum of two squares exactly when every prime leaving remainder three on division by four appears in its factorization to an even power. So 45, which is 9 times 5, works, as it has an even power of three, whereas 21 does not. The identity for a product of two such sums explains why the property passes to products.\n\nCheck: $45 = 3^{2} + 6^{2} = 9 + 36$, while $21 - 0, 21 - 1, 21 - 4, 21 - 9, 21 - 16$ are $21, 20, 17, 12, 5$, none a square.\n\n> **Watch out.** A prime of the form $4k + 3$ is allowed when its power is even: $9 = 3^{2} = 0^{2} + 3^{2}$ is a sum of two squares, though $3$ is not.",
        "正整数是两个平方数之和，当且仅当它的分解式中每个除以 4 余 3 的质数都是偶数次幂。所以 45 = 9 × 5 可以，因为 3 的幂是偶数；而 21 不行。两个这样的和相乘的恒等式，说明了这个性质为什么能传给积。\n\n检验：$45 = 3^{2} + 6^{2} = 9 + 36$；而 $21 - 0, 21 - 1, 21 - 4, 21 - 9, 21 - 16$ 依次是 $21, 20, 17, 12, 5$，都不是平方数。\n\n> **注意。** 形如 $4k + 3$ 的质数只要是偶数次幂就可以：$9 = 3^{2} = 0^{2} + 3^{2}$ 是两个平方数之和，尽管 $3$ 不是。",
      ],
      (rng) => {
        const works = (n: number) => factorize(n).every(([p, e]) => p % 4 !== 3 || e % 2 === 0);
        const pool = Array.from({ length: 300 }, (_, i) => i + 10);
        const answer = rng.pick(pool.filter((n) => works(n) && !isPrime(n)));
        const others = rng.shuffle(pool.filter((n) => !works(n))).slice(0, 3);
        const [lo, hi] = bounds([answer, ...others]);
        const [x, y] = asTwoSquares(answer) as [number, number];
        const bad = (n: number) => factorize(n).find(([p, e]) => p % 4 === 3 && e % 2 === 1) as [number, number];
        return chosen(
          rng,
          [
            `Which of these numbers between $${lo}$ and $${hi}$ is a sum of two squares?`,
            `下列在 $${lo}$ 和 $${hi}$ 之间的数中，哪个是两个平方数之和？`,
          ],
          same(`${answer}`),
          others.map((n) => {
            const [p, e] = bad(n);
            return [
              same(`${n}`),
              `$${n} = ${factorizationLatex(factorize(n))}$ has the prime $${p}$, which leaves $3$ on division by $4$, to the odd power $${e}$.`,
              `$${n} = ${factorizationLatex(factorize(n))}$ 中，除以 $4$ 余 $3$ 的质数 $${p}$ 是奇数次幂 $${e}$。`,
            ] as const;
          }),
          [
            [
              ["Factor", "分解"],
              [`$${answer} = ${factorizationLatex(factorize(answer))}$.`, `$${answer} = ${factorizationLatex(factorize(answer))}$。`],
            ],
            [
              ["Check the primes of the form 4k + 3", "检查形如 4k + 3 的质数"],
              [
                "Each of them, if any, appears to an even power, so the number is a sum of two squares.",
                "这样的质数如果出现，都是偶数次幂，所以这个数是两个平方数之和。",
              ],
            ],
          ],
          [
            `Indeed $${answer} = ${x}^{2} + ${y}^{2} = ${x * x} + ${y * y}$.`,
            `确实 $${answer} = ${x}^{2} + ${y}^{2} = ${x * x} + ${y * y}$。`,
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
        "Every primitive Pythagorean triple comes from two coprime numbers $m$ and $n$ of opposite parity, with $m$ larger: the legs are $m^2 - n^2$ and $2mn$, and the hypotenuse is $m^2 + n^2$. Checking the identity by expanding is a good exercise. Scaling a primitive triple by any factor then gives all the others. With $m = 4$ and $n = 1$: the legs are $16 - 1 = 15$ and $2 \\times 4 \\times 1 = 8$, and the hypotenuse is $16 + 1 = 17$.\n\nCheck: $15^{2} + 8^{2} = 225 + 64 = 289 = 17^{2}$.\n\n> **Watch out.** Square first, then subtract or add: $m^{2} - n^{2}$ is not $(m - n)^{2}$, and the even leg has the factor $2$ in $2mn$.",
        "每个本原勾股数都来自两个互质且奇偶性相反的数 $m$ 和 $n$（$m$ 较大）：两条直角边是 $m^2 - n^2$ 和 $2mn$，斜边是 $m^2 + n^2$。展开验证这个恒等式是很好的练习。把本原勾股数乘任意倍数，就得到其余所有勾股数。取 $m = 4$，$n = 1$：两条直角边是 $16 - 1 = 15$ 和 $2 \\times 4 \\times 1 = 8$，斜边是 $16 + 1 = 17$。\n\n检验：$15^{2} + 8^{2} = 225 + 64 = 289 = 17^{2}$。\n\n> **注意。** 先平方再相减或相加：$m^{2} - n^{2}$ 不是 $(m - n)^{2}$；偶数直角边 $2mn$ 中有因数 $2$。",
      ],
      (rng) =>
        until(() => {
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
          const values = [a, b, c];
          const answer = values[which] as number;
          const slips: Miss[][] = [
            [[(m - n) ** 2, "That is $(m - n)^{2}$; the leg is $m^{2} - n^{2}$.", "那是 $(m - n)^{2}$；这条直角边是 $m^{2} - n^{2}$。"]],
            [[m * n, "That is $mn$, without the factor $2$.", "那是 $mn$，漏掉了因数 $2$。"]],
            [[(m + n) ** 2, "That is $(m + n)^{2}$; the hypotenuse is $m^{2} + n^{2}$.", "那是 $(m + n)^{2}$；斜边是 $m^{2} + n^{2}$。"]],
          ];
          return worked(
            [
              `Take $m = ${m}$ and $n = ${n}$ in the formula for primitive Pythagorean triples. What is ${name[0]}?`,
              `在本原勾股数公式中取 $m = ${m}$，$n = ${n}$。${name[1]}是多少？`,
            ],
            answer,
            [
              ...(slips[which] as Miss[]),
              ...[0, 1, 2]
                .filter((i) => i !== which)
                .map(
                  (i): Miss => [
                    values[i] as number,
                    `That is ${(names[i] as Pair)[0]}, not ${name[0]}.`,
                    `那是${(names[i] as Pair)[1]}，不是${name[1]}。`,
                  ],
                ),
            ],
            [
              [
                ["Square", "平方"],
                [`$m^{2} = ${m * m}$ and $n^{2} = ${n * n}$.`, `$m^{2} = ${m * m}$，$n^{2} = ${n * n}$。`],
              ],
              [
                ["Form the triple", "写出勾股数"],
                [
                  `$m^{2} - n^{2} = ${a}$, $2mn = ${b}$, $m^{2} + n^{2} = ${c}$.`,
                  `$m^{2} - n^{2} = ${a}$，$2mn = ${b}$，$m^{2} + n^{2} = ${c}$。`,
                ],
              ],
              [
                ["Pick the part asked for", "取所求的部分"],
                [`${name[0].charAt(0).toUpperCase()}${name[0].slice(1)} is $${answer}$.`, `${name[1]}是 $${answer}$。`],
              ],
            ],
            [
              `$${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${c * c} = ${c}^{2}$.`,
              `$${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${c * c} = ${c}^{2}$。`,
            ],
          );
        }),
    ),
    point(
      "recognizing-a-primitive-triple",
      ["Recognizing a primitive triple", "识别本原勾股数"],
      [
        "A Pythagorean triple is primitive when its three numbers have no common factor. Any common factor of two of the numbers also divides the third, so checking a single pair is enough. A scaled triple such as 9, 12, 15 satisfies the equation yet is not primitive. Exactly one leg of a primitive triple is even, which gives a second quick check. For $(20, 21, 29)$: $\\gcd(20, 21) = 1$, so the triple is primitive.\n\nCheck: $20^{2} + 21^{2} = 400 + 441 = 841 = 29^{2}$, and exactly one leg, $20$, is even.\n\n> **Watch out.** Satisfying $a^{2} + b^{2} = c^{2}$ does not make a triple primitive: $(9, 12, 15)$ does, but all three are multiples of $3$.",
        "三个数没有公因数的勾股数是本原的。其中两个数的公因数也整除第三个数，所以只需检查一对。像 9、12、15 这样放大后的勾股数满足方程，但不是本原的。本原勾股数恰有一条直角边是偶数，这是第二个快速检验。对 $(20, 21, 29)$：$\\gcd(20, 21) = 1$，所以它是本原的。\n\n检验：$20^{2} + 21^{2} = 400 + 441 = 841 = 29^{2}$，且恰有一条直角边 $20$ 是偶数。\n\n> **注意。** 满足 $a^{2} + b^{2} = c^{2}$ 并不说明是本原的：$(9, 12, 15)$ 满足它，但三个数都是 $3$ 的倍数。",
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
          return { factor, base: primitive(m, n), triple: primitive(m, n).map((v) => v * factor) };
        });
        const write = (triple: readonly number[]) => same(`(${triple.join(", ")})`);
        const [lo, hi] = bounds([right, ...scaled.map((s) => s.triple)].map((triple) => Math.max(...triple)));
        const [x, y, z] = right;
        return chosen(
          rng,
          [
            `Which of these Pythagorean triples, with hypotenuses between $${lo}$ and $${hi}$, is primitive?`,
            `下列斜边在 $${lo}$ 和 $${hi}$ 之间的勾股数中，哪组是本原的？`,
          ],
          write(right),
          scaled.map(
            ({ factor, base, triple }) =>
              [
                write(triple),
                `All three numbers are multiples of $${factor}$: it is $${factor}$ times $(${base.join(", ")})$.`,
                `三个数都是 $${factor}$ 的倍数：它是 $(${base.join(", ")})$ 的 $${factor}$ 倍。`,
              ] as const,
          ),
          [
            [
              ["Check a pair", "检查一对数"],
              [`For $(${right.join(", ")})$, $\\gcd(${x}, ${y}) = 1$.`, `对 $(${right.join(", ")})$，$\\gcd(${x}, ${y}) = 1$。`],
            ],
            [
              ["Conclude", "得出结论"],
              [
                "A common factor of the three would divide this pair, so there is none, and the triple is primitive.",
                "三个数的公因数一定整除这一对数，所以没有公因数，这组勾股数是本原的。",
              ],
            ],
          ],
          [
            `$${x}^{2} + ${y}^{2} = ${x * x + y * y} = ${z}^{2}$, and exactly one leg, $${y}$, is even.`,
            `$${x}^{2} + ${y}^{2} = ${x * x + y * y} = ${z}^{2}$，且恰有一条直角边 $${y}$ 是偶数。`,
          ],
        );
      },
    ),
  ],
);

/** directValue shows how τ, σ or φ of n follows from its prime powers. */
const directValue = (tex: string, n: number): string => {
  const factors = factorize(n);
  if (tex === "\\tau") return `${times(factors.map(([, e]) => e + 1))} = ${divisors(n).length}`;
  if (tex === "\\sigma") return `${times(factors.map(([p, e]) => sigma(p ** e)))} = ${sigma(n)}`;
  return `${phiProduct(n)} = ${totient(n)}`;
};

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
        "A function on the positive integers is multiplicative when its value at a product of two coprime numbers is the product of its values. The divisor count, the divisor sum and the totient all have this property. So their value at any number follows from the values at its prime powers, which is why factoring comes first when computing any of these. For $\\tau(45)$: $45 = 9 \\times 5$ with $\\gcd(9, 5) = 1$, so $\\tau(45) = \\tau(9) \\times \\tau(5) = 3 \\times 2 = 6$.\n\nCheck: the divisors of $45$ are $1, 3, 5, 9, 15, 45$, six of them.\n\n> **Watch out.** Multiply the values, do not add them; and the rule needs coprime parts: $\\tau(4) \\times \\tau(2) = 6$, but $\\tau(8) = 4$.",
        "正整数上的函数，如果在两个互质数之积上的值等于各自值的积，就是积性函数。因数个数、因数和和欧拉函数都有这个性质。所以它们在任何数上的值都由质数幂上的值决定，这就是为什么计算它们时要先分解。求 $\\tau(45)$：$45 = 9 \\times 5$，$\\gcd(9, 5) = 1$，所以 $\\tau(45) = \\tau(9) \\times \\tau(5) = 3 \\times 2 = 6$。\n\n检验：$45$ 的因数是 $1, 3, 5, 9, 15, 45$，共六个。\n\n> **注意。** 值要相乘，不能相加；并且这个规则要求两部分互质：$\\tau(4) \\times \\tau(2) = 6$，但 $\\tau(8) = 4$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([3, 4, 5, 7, 8, 9, 11, 13]);
          const b = rng.pick([3, 4, 5, 7, 8, 9, 11, 13, 16, 25].filter((v) => gcd(a, v) === 1));
          const fn = rng.pick([
            { tex: "\\tau", f: (n: number) => divisors(n).length },
            { tex: "\\sigma", f: sigma },
            { tex: "\\varphi", f: totient },
          ]);
          const [fa, fb] = [fn.f(a), fn.f(b)];
          return worked(
            [
              `Given $${fn.tex}(${a}) = ${fa}$ and $${fn.tex}(${b}) = ${fb}$, what is $${fn.tex}(${a * b})$?`,
              `已知 $${fn.tex}(${a}) = ${fa}$，$${fn.tex}(${b}) = ${fb}$，$${fn.tex}(${a * b})$ 是多少？`,
            ],
            fa * fb,
            [
              [fa + fb, "That adds the values; a multiplicative function multiplies them.", "那是把值相加；积性函数要把值相乘。"],
              [a * b, `That is the number $${a * b}$ itself, not the value of the function.`, `那是 $${a * b}$ 本身，不是函数值。`],
              [
                fa * b,
                `That applies the function to $${a}$ only and multiplies by $${b}$ itself.`,
                `那只对 $${a}$ 取了函数值，再乘以 $${b}$ 本身。`,
              ],
            ],
            [
              [
                ["Check the parts are coprime", "检查两部分互质"],
                [`$\\gcd(${a}, ${b}) = 1$.`, `$\\gcd(${a}, ${b}) = 1$。`],
              ],
              [
                ["Multiply the values", "把值相乘"],
                [`$${fn.tex}(${a * b}) = ${fa} \\times ${fb} = ${fa * fb}$.`, `$${fn.tex}(${a * b}) = ${fa} \\times ${fb} = ${fa * fb}$。`],
              ],
            ],
            [
              `From the factorization $${a * b} = ${factorizationLatex(factorize(a * b))}$, $${fn.tex}(${a * b}) = ${directValue(fn.tex, a * b)}$.`,
              `由分解式 $${a * b} = ${factorizationLatex(factorize(a * b))}$，$${fn.tex}(${a * b}) = ${directValue(fn.tex, a * b)}$。`,
            ],
          );
        }),
    ),
    point(
      "when-the-parts-share-a-factor",
      ["When the parts share a factor", "当两部分有公因数时"],
      [
        "Multiplicativity needs coprime parts, and the product of the values is wrong otherwise. For the totient, the correction is that $\\varphi(ab) = \\varphi(a)\\varphi(b) \\cdot \\frac{d}{\\varphi(d)}$, where $d$ is the greatest common divisor. So the true value exceeds the naive product. It helps to refactor the product into prime powers rather than trust the shortcut. For $\\varphi(36)$ with $36 = 6 \\times 6$: the naive product is $2 \\times 2 = 4$, but $36 = 2^{2} \\times 3^{2}$ gives $\\varphi(36) = 2 \\times 1 \\times 3 \\times 2 = 12$.\n\nCheck: the correction with $d = 6$ gives $4 \\times \\frac{6}{2} = 12$.\n\n> **Watch out.** Multiplying the values of parts that share a factor undercounts: $\\varphi(6) \\times \\varphi(6) = 4$ is far below $\\varphi(36) = 12$.",
        "积性要求两部分互质，否则值的积就是错的。对欧拉函数，修正公式是 $\\varphi(ab) = \\varphi(a)\\varphi(b) \\cdot \\frac{d}{\\varphi(d)}$，其中 $d$ 是最大公因数。所以真实值比简单的积要大。最好把积重新分解成质数幂，而不要相信这个捷径。求 $\\varphi(36)$，$36 = 6 \\times 6$：简单的积是 $2 \\times 2 = 4$，但 $36 = 2^{2} \\times 3^{2}$ 给出 $\\varphi(36) = 2 \\times 1 \\times 3 \\times 2 = 12$。\n\n检验：取 $d = 6$ 的修正公式给出 $4 \\times \\frac{6}{2} = 12$。\n\n> **注意。** 有公因数的两部分直接把值相乘会少算：$\\varphi(6) \\times \\varphi(6) = 4$ 远小于 $\\varphi(36) = 12$。",
      ],
      (rng) =>
        until(() => {
          const d = rng.pick([2, 3, 4, 5, 6]);
          const a = d * rng.int(1, 6);
          const b = d * rng.int(2, 7);
          const answer = totient(a * b);
          const naive = totient(a) * totient(b);
          const g = gcd(a, b);
          const fix = totient(g) === 1 ? `${naive} \\times ${g}` : `${naive} \\times \\frac{${g}}{${totient(g)}}`;
          return worked(
            [
              `What is $\\varphi(${a * b})$, where $${a * b} = ${a} \\times ${b}$?`,
              `$\\varphi(${a * b})$ 是多少？这里 $${a * b} = ${a} \\times ${b}$。`,
            ],
            answer,
            [
              [
                naive,
                `That multiplies $\\varphi(${a}) \\times \\varphi(${b})$, but $${a}$ and $${b}$ share the factor $${g}$.`,
                `那是 $\\varphi(${a}) \\times \\varphi(${b})$，但 $${a}$ 和 $${b}$ 有公因数 $${g}$。`,
              ],
              [totient(a) + totient(b), "That adds the two values, which is never the rule.", "那是把两个值相加，这从来不是规则。"],
              [a * b - 1, `That is the value for a prime, but $${a * b}$ is composite.`, `那是质数的值，但 $${a * b}$ 是合数。`],
            ],
            [
              [
                ["Notice the common factor", "注意公因数"],
                [`$\\gcd(${a}, ${b}) = ${g}$, so the parts are not coprime.`, `$\\gcd(${a}, ${b}) = ${g}$，所以两部分不互质。`],
              ],
              [
                ["Refactor", "重新分解"],
                [`$${a * b} = ${factorizationLatex(factorize(a * b))}$.`, `$${a * b} = ${factorizationLatex(factorize(a * b))}$。`],
              ],
              [
                ["Compute", "计算"],
                [`$\\varphi(${a * b}) = ${phiProduct(a * b)} = ${answer}$.`, `$\\varphi(${a * b}) = ${phiProduct(a * b)} = ${answer}$。`],
              ],
            ],
            [`With the correction for $d = ${g}$: $${fix} = ${answer}$.`, `用 $d = ${g}$ 的修正公式：$${fix} = ${answer}$。`],
          );
        }),
    ),
  ],
);

const mobiusFunction = topic(
  "the-mobius-function",
  ["The Möbius Function", "默比乌斯函数"],
  ["Evaluate the function and invert a divisor sum.", "计算这个函数并反演因数和。"],
  ["multiplicative-functions"],
  [],
  [
    point(
      "evaluating-mu",
      ["Evaluating the Möbius function", "计算默比乌斯函数"],
      [
        "The Möbius function is zero when a number has a repeated prime factor, one when it is a product of an even number of distinct primes, and minus one when it is a product of an odd number. So it only looks at the shape of the factorization. By convention its value at one is one, the product of no primes, which counts as even. For $30 = 2 \\times 3 \\times 5$, three distinct primes, $\\mu(30) = -1$; for $12 = 2^{2} \\times 3$, $\\mu(12) = 0$.\n\nCheck: $(-1)^{3} = -1$, one factor $-1$ for each distinct prime of $30$.\n\n> **Watch out.** Look for a repeated prime before counting: $\\mu(12)$ is $0$, not $1$, even though $12$ has two distinct primes.",
        "默比乌斯函数在一个数有重复质因数时为 0，是偶数个不同质数之积时为 1，是奇数个不同质数之积时为 −1。所以它只看分解式的形状。按约定，它在 1 处的值是 1，因为 1 是零个质数之积，算作偶数个。对 $30 = 2 \\times 3 \\times 5$，三个不同质数，$\\mu(30) = -1$；对 $12 = 2^{2} \\times 3$，$\\mu(12) = 0$。\n\n检验：$(-1)^{3} = -1$，$30$ 的每个不同质数贡献一个 $-1$。\n\n> **注意。** 先看有没有重复的质数，再数个数：$\\mu(12)$ 是 $0$，不是 $1$，尽管 $12$ 有两个不同质数。",
      ],
      (rng) => {
        const n = pickComposite(rng, 4, 500);
        const value = mobius(n);
        const factors = factorize(n);
        const k = factors.length;
        const repeated = factors.find(([, e]) => e > 1);
        const shape = factorizationLatex(factors);
        const reasons: Record<string, readonly [string, string]> = repeated
          ? {
              "1": [
                `$${n} = ${shape}$ has the repeated prime $${repeated[0]}$, so the value is $0$ whatever the count.`,
                `$${n} = ${shape}$ 有重复的质数 $${repeated[0]}$，不论个数多少，值都是 $0$。`,
              ],
              "-1": [
                `$${n} = ${shape}$ has the repeated prime $${repeated[0]}$, so the value is $0$ whatever the count.`,
                `$${n} = ${shape}$ 有重复的质数 $${repeated[0]}$，不论个数多少，值都是 $0$。`,
              ],
            }
          : {
              "0": [`No prime is repeated in $${n} = ${shape}$.`, `$${n} = ${shape}$ 中没有重复的质数。`],
              "1": [
                `That needs an even number of distinct primes, but $${n}$ has $${k}$.`,
                `那要求有偶数个不同质数，但 $${n}$ 有 $${k}$ 个。`,
              ],
              "-1": [
                `That needs an odd number of distinct primes, but $${n}$ has $${k}$.`,
                `那要求有奇数个不同质数，但 $${n}$ 有 $${k}$ 个。`,
              ],
            };
        return chosen(
          rng,
          [`What is $\\mu(${n})$?`, `$\\mu(${n})$ 是多少？`],
          signWord(value),
          [1, -1, 0].filter((v) => v !== value).map((v) => [signWord(v), ...(reasons[`${v}`] as readonly [string, string])] as const),
          [
            [
              ["Factor", "分解"],
              [`$${n} = ${shape}$.`, `$${n} = ${shape}$。`],
            ],
            repeated
              ? [
                  ["Look for a repeat", "看有无重复"],
                  [`$${repeated[0]}$ is repeated, so $\\mu(${n}) = 0$.`, `$${repeated[0]}$ 重复出现，所以 $\\mu(${n}) = 0$。`],
                ]
              : [
                  ["Count the primes", "数质数"],
                  [
                    `There are $${k}$ distinct primes, none repeated, so $\\mu(${n}) = (-1)^{${k}} = ${value}$.`,
                    `有 $${k}$ 个不同质数，没有重复，所以 $\\mu(${n}) = (-1)^{${k}} = ${value}$。`,
                  ],
                ],
          ],
          repeated
            ? [
                `$${repeated[0] ** 2}$ divides $${n}$: $${n} = ${repeated[0] ** 2} \\times ${n / repeated[0] ** 2}$.`,
                `$${repeated[0] ** 2}$ 整除 $${n}$：$${n} = ${repeated[0] ** 2} \\times ${n / repeated[0] ** 2}$。`,
              ]
            : [
                `$\\mu$ is multiplicative, and each distinct prime contributes $\\mu(p) = -1$: the product of $${k}$ such factors is $${value}$.`,
                `$\\mu$ 是积性函数，每个不同质数贡献 $\\mu(p) = -1$：$${k}$ 个这样的因子之积是 $${value}$。`,
              ],
        );
      },
    ),
    point(
      "inverting-a-divisor-sum",
      ["Inverting a divisor sum", "反演因数和"],
      [
        "When $F(n)$ is the sum of $f(d)$ over the divisors $d$ of $n$, Möbius inversion recovers $f$ from $F$: $f(n)$ is the sum, over divisors $d$, of $\\mu(d)F(n/d)$. The terms with a repeated prime vanish. For a prime power, only two terms survive, so $f$ at that power is the difference of two consecutive values of $F$. If $F(8) = 15$ and $F(4) = 7$, then $f(8) = \\mu(1)F(8) + \\mu(2)F(4) = 15 - 7 = 8$.\n\nCheck: the divisors of $8$ are those of $4$ together with $8$, so $F(8) = F(4) + f(8) = 7 + 8 = 15$.\n\n> **Watch out.** Subtract the value at the next lower power, not at $1$: the terms $\\mu(4)$ and $\\mu(8)$ are $0$, but $\\mu(2) = -1$ is not.",
        "如果 $F(n)$ 是 $f(d)$ 对 $n$ 的所有因数 $d$ 之和，默比乌斯反演可以由 $F$ 求出 $f$：$f(n)$ 是 $\\mu(d)F(n/d)$ 对所有因数 $d$ 之和。含重复质数的项都消失了。对质数幂，只留下两项，所以 $f$ 在这个幂处的值是 $F$ 相邻两个值之差。若 $F(8) = 15$，$F(4) = 7$，则 $f(8) = \\mu(1)F(8) + \\mu(2)F(4) = 15 - 7 = 8$。\n\n检验：$8$ 的因数就是 $4$ 的因数加上 $8$，所以 $F(8) = F(4) + f(8) = 7 + 8 = 15$。\n\n> **注意。** 要减去低一次幂处的值，而不是 $1$ 处的值：$\\mu(4)$ 和 $\\mu(8)$ 是 $0$，但 $\\mu(2) = -1$ 不是。",
      ],
      (rng) =>
        until(() => {
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
          const top = pw(p, k);
          const below = pw(p, k - 1);
          return worked(
            [
              `Let $F(n) = \\sum_{d \\mid n} f(d)$. Given $F(${top}) = ${high}$ and $F(${below}) = ${low}$, what is $f(${top})$?`,
              `设 $F(n) = \\sum_{d \\mid n} f(d)$。已知 $F(${top}) = ${high}$，$F(${below}) = ${low}$，$f(${top})$ 是多少？`,
            ],
            high - low,
            [
              [high + low, "That adds the two values; inversion subtracts the lower one.", "那是把两个值相加；反演要减去较小幂处的值。"],
              [
                high,
                `That is $F(${top})$ itself, which also includes the values of $f$ at the smaller divisors.`,
                `那是 $F(${top})$ 本身，它还包括 $f$ 在较小因数处的值。`,
              ],
              [low, `That is $F(${below})$, the sum over the smaller divisors.`, `那是 $F(${below})$，即较小因数上的和。`],
            ],
            [
              [
                ["Keep the squarefree divisors", "保留无平方因子的因数"],
                [
                  `Among the divisors of $${top}$, only $1$ and $${p}$ have $\\mu \\neq 0$: $\\mu(1) = 1$, $\\mu(${p}) = -1$.`,
                  `在 $${top}$ 的因数中，只有 $1$ 和 $${p}$ 的 $\\mu \\neq 0$：$\\mu(1) = 1$，$\\mu(${p}) = -1$。`,
                ],
              ],
              [
                ["Invert", "反演"],
                [
                  `$f(${top}) = F(${top}) - F(${below}) = ${high} - ${low} = ${high - low}$.`,
                  `$f(${top}) = F(${top}) - F(${below}) = ${high} - ${low} = ${high - low}$。`,
                ],
              ],
            ],
            [
              `The divisors of $${top}$ are those of $${below}$ and $${top}$ itself, so $F(${top}) = ${low} + ${high - low} = ${high}$.`,
              `$${top}$ 的因数就是 $${below}$ 的因数加上 $${top}$ 本身，所以 $F(${top}) = ${low} + ${high - low} = ${high}$。`,
            ],
          );
        }),
    ),
  ],
);

/** continuedValue evaluates a finite continued fraction. */
const continuedValue = (terms: readonly number[]): Q => {
  let value = Q.of(terms.at(-1) as number);
  for (let i = terms.length - 2; i >= 0; i--) value = Q.of(terms[i] as number).add(Q.of(1).div(value));
  return value;
};

/** convergents runs the recurrence h = a h' + h'' for the numerators and denominators of a continued fraction. */
const convergents = (terms: readonly number[]) => {
  const hs: number[] = [];
  const ks: number[] = [];
  terms.forEach((a, i) => {
    hs.push(a * (hs[i - 1] ?? 1) + (hs[i - 2] ?? (i === 0 ? 0 : 1)));
    ks.push(a * (ks[i - 1] ?? 0) + (ks[i - 2] ?? (i === 0 ? 1 : 0)));
  });
  return { hs, ks };
};

/** euclidLines writes the divisions of the Euclidean algorithm on a fraction h/k. */
const euclidLines = (h: number, k: number) => {
  const lines: string[] = [];
  let [x, y] = [h, k];
  while (y !== 0) {
    lines.push(`${x} = ${Math.floor(x / y)} \\times ${y} + ${x % y}`);
    [x, y] = [y, x % y];
  }
  return lines;
};

const continuedFractions = topic(
  "continued-fractions",
  ["Continued Fractions", "连分数"],
  ["Evaluate a continued fraction, and expand a rational number as one.", "计算连分数，并把有理数展开成连分数。"],
  ["the-euclidean-algorithm"],
  [["the-euclidean-algorithm", 0.2]],
  [
    point(
      "evaluating-a-continued-fraction",
      ["Evaluating a continued fraction", "计算连分数"],
      [
        "The notation with a semicolon lists the whole parts of a nested fraction: $[a_0; a_1, a_2] = a_0 + \\frac{1}{a_1 + \\frac{1}{a_2}}$, and so on. To evaluate it, start at the innermost term and work outward, inverting and adding at each stage. Starting from the outside does not work, because each stage depends on the value below it. For $[2; 3, 4]$: $3 + \\frac{1}{4} = \\frac{13}{4}$, then $2 + \\frac{4}{13} = \\frac{30}{13}$.\n\nCheck: the recurrence $h_i = a_i h_{i-1} + h_{i-2}$ gives numerators $2, 7, 30$ and $k_i = a_i k_{i-1} + k_{i-2}$ gives denominators $1, 3, 13$, so the value is $\\frac{30}{13}$.\n\n> **Watch out.** Invert at each stage: $\\frac{1}{\\frac{13}{4}}$ is $\\frac{4}{13}$, and simply adding the terms, $2 + 3 + 4 = 9$, ignores the nesting.",
        "带分号的记号列出嵌套分数的各整数部分：$[a_0; a_1, a_2] = a_0 + \\frac{1}{a_1 + \\frac{1}{a_2}}$，依此类推。计算时要从最里面的项开始向外算，每一步先取倒数再相加。从外面开始不行，因为每一步都依赖下一层的值。求 $[2; 3, 4]$：$3 + \\frac{1}{4} = \\frac{13}{4}$，然后 $2 + \\frac{4}{13} = \\frac{30}{13}$。\n\n检验：递推 $h_i = a_i h_{i-1} + h_{i-2}$ 给出分子 $2, 7, 30$，$k_i = a_i k_{i-1} + k_{i-2}$ 给出分母 $1, 3, 13$，所以值是 $\\frac{30}{13}$。\n\n> **注意。** 每一步都要取倒数：$\\frac{13}{4}$ 的倒数是 $\\frac{4}{13}$；直接把各项相加 $2 + 3 + 4 = 9$ 忽略了嵌套。",
      ],
      (rng) =>
        until(() => {
          const terms = [rng.int(1, 4), rng.int(1, 5), rng.int(1, 6), rng.int(2, 6)];
          const answer = continuedValue(terms);
          const shorter = continuedValue(terms.slice(0, 3));
          const reversed = continuedValue([...terms].reverse());
          const { hs, ks } = convergents(terms);
          const stages = [2, 1, 0].map(
            (i) =>
              `$${terms[i]} + \\frac{1}{${continuedValue(terms.slice(i + 1)).toLatex()}} = ${continuedValue(terms.slice(i)).toLatex()}$`,
          );
          return worked(
            [
              `What is $[${terms[0]}; ${terms.slice(1).join(", ")}]$ as a fraction?`,
              `$[${terms[0]}; ${terms.slice(1).join(", ")}]$ 写成分数是多少？`,
            ],
            answer,
            [
              [shorter, "That leaves out the last term.", "那漏掉了最后一项。"],
              [
                reversed,
                "That reads the terms in reverse order, starting the nesting from the wrong end.",
                "那把各项的顺序弄反了，从错误的一端开始嵌套。",
              ],
              [
                Q.of(terms.reduce((a, b) => a + b, 0)),
                "That adds the terms without the nested fractions.",
                "那是把各项直接相加，没有嵌套的分数。",
              ],
            ],
            [
              [
                ["Start inside", "从里面开始"],
                [`${stages[0]}.`, `${stages[0]}。`],
              ],
              [
                ["Work outward", "向外计算"],
                [`${stages[1]}.`, `${stages[1]}。`],
              ],
              [
                ["Finish", "完成"],
                [`${stages[2]}.`, `${stages[2]}。`],
              ],
            ],
            [
              `The recurrence gives numerators $${hs.join(", ")}$ and denominators $${ks.join(", ")}$, so the value is $\\frac{${hs.at(-1)}}{${ks.at(-1)}}$.`,
              `递推给出分子 $${hs.join(", ")}$ 和分母 $${ks.join(", ")}$，所以值是 $\\frac{${hs.at(-1)}}{${ks.at(-1)}}$。`,
            ],
          );
        }),
    ),
    point(
      "expanding-a-rational-number",
      ["Expanding a rational number", "展开有理数"],
      [
        "The terms of a continued fraction for a rational number are the quotients of the Euclidean algorithm applied to its numerator and denominator. Each step takes the whole part and inverts what is left. The process must end, since the remainders keep falling, and that is the reason why rational numbers have finite expansions and irrational numbers do not. For $\\frac{43}{19}$: $43 = 2 \\times 19 + 5$, $19 = 3 \\times 5 + 4$, $5 = 1 \\times 4 + 1$, $4 = 4 \\times 1 + 0$, so $\\frac{43}{19} = [2; 3, 1, 4]$.\n\nCheck: from the inside, $1 + \\frac{1}{4} = \\frac{5}{4}$, $3 + \\frac{4}{5} = \\frac{19}{5}$, $2 + \\frac{5}{19} = \\frac{43}{19}$.\n\n> **Watch out.** The terms are the quotients, not the remainders; and $a_0$ is the whole part, so $a_1$ is the second quotient.",
        "有理数的连分数各项，就是对分子和分母做欧几里得算法时得到的商。每一步取整数部分，再把剩下的取倒数。这个过程一定会结束，因为余数不断减小，这正是有理数的展开有限而无理数的展开无限的原因。对 $\\frac{43}{19}$：$43 = 2 \\times 19 + 5$，$19 = 3 \\times 5 + 4$，$5 = 1 \\times 4 + 1$，$4 = 4 \\times 1 + 0$，所以 $\\frac{43}{19} = [2; 3, 1, 4]$。\n\n检验：从里向外，$1 + \\frac{1}{4} = \\frac{5}{4}$，$3 + \\frac{4}{5} = \\frac{19}{5}$，$2 + \\frac{5}{19} = \\frac{43}{19}$。\n\n> **注意。** 各项是商，不是余数；$a_0$ 是整数部分，所以 $a_1$ 是第二个商。",
      ],
      (rng) =>
        until(() => {
          const terms = [rng.int(1, 5), rng.int(1, 6), rng.int(1, 6), rng.int(2, 7)];
          const value = continuedValue(terms);
          const position = rng.int(1, 3);
          const answer = terms[position] as number;
          const label = `$a_${position}$`;
          const lines = euclidLines(Number(value.n), Number(value.d));
          const remainders = lines.map((line) => Number(line.split(" + ").at(-1)));
          return worked(
            [
              `Expand $${value.toLatex()}$ as $[a_0; a_1, a_2, a_3]$, with the last term above 1. What is ${label}?`,
              `把 $${value.toLatex()}$ 展开成 $[a_0; a_1, a_2, a_3]$，最后一项大于 1。${label} 是多少？`,
            ],
            answer,
            [
              [
                terms[position - 1] as number,
                `That is $a_${position - 1}$, one place earlier; $a_0$ is the first quotient.`,
                `那是前一个位置的 $a_${position - 1}$；$a_0$ 是第一个商。`,
              ],
              [
                remainders[position - 1] as number,
                "That is a remainder of the Euclidean algorithm, not a quotient.",
                "那是欧几里得算法的余数，不是商。",
              ],
              ...(position < 3
                ? ([
                    [
                      terms[position + 1] as number,
                      `That is $a_${position + 1}$, one place later.`,
                      `那是后一个位置的 $a_${position + 1}$。`,
                    ],
                  ] as const)
                : []),
            ],
            [
              [
                ["Run the Euclidean algorithm", "做欧几里得算法"],
                [`$${lines.join("$, $")}$.`, `$${lines.join("$，$")}$。`],
              ],
              [
                ["Read the quotients", "读出商"],
                [
                  `The quotients are $${terms.join(", ")}$, so ${label} $= ${answer}$.`,
                  `商依次是 $${terms.join(", ")}$，所以 ${label} $= ${answer}$。`,
                ],
              ],
            ],
            [
              `Evaluating $[${terms[0]}; ${terms.slice(1).join(", ")}]$ from the inside gives back $${value.toLatex()}$.`,
              `从里向外计算 $[${terms[0]}; ${terms.slice(1).join(", ")}]$，得回 $${value.toLatex()}$。`,
            ],
          );
        }),
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
        "Pell's equation asks for whole numbers with $x^2 - dy^2 = 1$, where $d$ is not a square. Trying $y = 1, 2, 3$ and so on, and checking whether $dy^2 + 1$ is a square, finds the smallest solution for small $d$. That solution, called the fundamental one, determines all the others. For $d = 7$: $7 + 1 = 8$, $28 + 1 = 29$ and $63 + 1 = 64 = 8^{2}$, so the smallest $y$ is $3$, with $x = 8$.\n\nCheck: $8^{2} - 7 \\times 3^{2} = 64 - 63 = 1$.\n\n> **Watch out.** The question asks for $y$, not $x$; and $y = 0$ with $x = 1$ is the trivial solution, which does not count.",
        "佩尔方程要求整数满足 $x^2 - dy^2 = 1$，其中 $d$ 不是平方数。依次试 $y = 1, 2, 3$……，检查 $dy^2 + 1$ 是否为平方数，就能在 $d$ 较小时找到最小解。这个解叫基本解，它决定了所有其他的解。对 $d = 7$：$7 + 1 = 8$，$28 + 1 = 29$，$63 + 1 = 64 = 8^{2}$，所以最小的 $y$ 是 $3$，$x = 8$。\n\n检验：$8^{2} - 7 \\times 3^{2} = 64 - 63 = 1$。\n\n> **注意。** 题目问的是 $y$，不是 $x$；$y = 0$、$x = 1$ 是平凡解，不算。",
      ],
      (rng) =>
        until(() => {
          const d = rng.pick(pellValues);
          const [x, y] = pellSolution(d) as [number, number];
          const shown = Array.from({ length: Math.min(y, 5) }, (_, i) => i + 1);
          return worked(
            [
              `What is the smallest positive $y$ for which $x^2 - ${d}y^2 = 1$ has a whole-number solution $x$?`,
              `使 $x^2 - ${d}y^2 = 1$ 有整数解 $x$ 的最小正整数 $y$ 是多少？`,
            ],
            y,
            [
              [x, `That is $x$, the other half of the solution $(${x}, ${y})$.`, `那是解 $(${x}, ${y})$ 中的 $x$。`],
              [d, "That is the coefficient $d$, not a solution.", "那是系数 $d$，不是解。"],
              [y * y, "That is $y^{2}$, not $y$.", "那是 $y^{2}$，不是 $y$。"],
              [
                0,
                "$y = 0$ gives only the trivial solution $x = 1$; the question asks for a positive $y$.",
                "$y = 0$ 只给出平凡解 $x = 1$；题目要求正的 $y$。",
              ],
            ],
            [
              [
                ["Try y = 1, 2, 3, …", "依次试 y = 1, 2, 3, …"],
                [
                  `${shown.map((v) => `$y = ${v}$: $${d * v * v + 1}$`).join(", ")}${y > 5 ? ", and so on" : ""}; ${y > 5 ? "the first square appears at" : "the first square is at"} $y = ${y}$.`,
                  `${shown.map((v) => `$y = ${v}$：$${d * v * v + 1}$`).join("，")}${y > 5 ? "，依此类推" : ""}；第一个平方数出现在 $y = ${y}$。`,
                ],
              ],
              [
                ["Read off x", "读出 x"],
                [
                  `$${d} \\times ${y}^{2} + 1 = ${d * y * y + 1} = ${x}^{2}$.`,
                  `$${d} \\times ${y}^{2} + 1 = ${d * y * y + 1} = ${x}^{2}$。`,
                ],
              ],
            ],
            [
              `$${x}^{2} - ${d} \\times ${y}^{2} = ${x * x} - ${d * y * y} = 1$.`,
              `$${x}^{2} - ${d} \\times ${y}^{2} = ${x * x} - ${d * y * y} = 1$。`,
            ],
          );
        }),
    ),
    point(
      "the-next-solution",
      ["The next solution", "下一个解"],
      [
        "Solutions of Pell's equation combine like numbers of the form $x + y\\sqrt{d}$, and multiplying two solutions gives another. So squaring the fundamental solution gives the next: the new $x$ is $x^2 + dy^2$, and the new $y$ is $2xy$. Repeating this produces infinitely many solutions, and all of them arise as powers of the fundamental one. For $d = 2$ with $(3, 2)$: $x' = 9 + 2 \\times 4 = 17$ and $y' = 2 \\times 3 \\times 2 = 12$.\n\nCheck: $17^{2} - 2 \\times 12^{2} = 289 - 288 = 1$.\n\n> **Watch out.** The new $x$ includes $dy^{2}$, not just $x^{2}$; and the new $y$ has the factor $2$ in $2xy$.",
        "佩尔方程的解可以像 $x + y\\sqrt{d}$ 形式的数那样组合，两个解相乘得到另一个解。所以把基本解平方就得到下一个解：新的 $x$ 是 $x^2 + dy^2$，新的 $y$ 是 $2xy$。重复这样做可以得到无穷多个解，而且所有的解都是基本解的幂。对 $d = 2$ 和 $(3, 2)$：$x' = 9 + 2 \\times 4 = 17$，$y' = 2 \\times 3 \\times 2 = 12$。\n\n检验：$17^{2} - 2 \\times 12^{2} = 289 - 288 = 1$。\n\n> **注意。** 新的 $x$ 要加上 $dy^{2}$，不只是 $x^{2}$；新的 $y$ 是 $2xy$，有因数 $2$。",
      ],
      (rng) =>
        until(() => {
          const d = rng.pick(pellValues.filter((v) => (pellSolution(v) as [number, number])[1] <= 30));
          const [x, y] = pellSolution(d) as [number, number];
          const newX = x * x + d * y * y;
          const newY = 2 * x * y;
          const asksX = rng.bool();
          return worked(
            [
              `The smallest solution of $x^2 - ${d}y^2 = 1$ is $(${x}, ${y})$. In the next solution, what is ${asksX ? "$x$" : "$y$"}?`,
              `$x^2 - ${d}y^2 = 1$ 的最小解是 $(${x}, ${y})$。下一个解中，${asksX ? "$x$" : "$y$"} 是多少？`,
            ],
            asksX ? newX : newY,
            asksX
              ? [
                  [newY, "That is the new $y$, $2xy$.", "那是新的 $y$，即 $2xy$。"],
                  [x * x, "That is $x^{2}$ without the term $dy^{2}$.", "那是 $x^{2}$，漏掉了 $dy^{2}$ 一项。"],
                  [2 * x, "That doubles $x$ instead of squaring the solution.", "那是把 $x$ 加倍，而不是把解平方。"],
                ]
              : [
                  [newX, "That is the new $x$, $x^{2} + dy^{2}$.", "那是新的 $x$，即 $x^{2} + dy^{2}$。"],
                  [x * y, "That is $xy$, without the factor $2$.", "那是 $xy$，漏掉了因数 $2$。"],
                  [2 * y, "That doubles $y$ instead of squaring the solution.", "那是把 $y$ 加倍，而不是把解平方。"],
                ],
            [
              [
                ["Square the solution", "把解平方"],
                [
                  `$(${x} + ${y === 1 ? "" : y}\\sqrt{${d}})^{2} = (${x}^{2} + ${d} \\times ${y}^{2}) + 2 \\times ${x} \\times ${y === 1 ? "" : y}\\sqrt{${d}}$.`,
                  `$(${x} + ${y === 1 ? "" : y}\\sqrt{${d}})^{2} = (${x}^{2} + ${d} \\times ${y}^{2}) + 2 \\times ${x} \\times ${y === 1 ? "" : y}\\sqrt{${d}}$。`,
                ],
              ],
              [
                ["Compute", "计算"],
                [
                  `$x' = ${x * x} + ${d * y * y} = ${newX}$ and $y' = ${newY}$.`,
                  `$x' = ${x * x} + ${d * y * y} = ${newX}$，$y' = ${newY}$。`,
                ],
              ],
            ],
            [
              `$${newX}^{2} - ${d} \\times ${newY}^{2} = ${newX * newX} - ${d * newY * newY} = 1$.`,
              `$${newX}^{2} - ${d} \\times ${newY}^{2} = ${newX * newX} - ${d * newY * newY} = 1$。`,
            ],
          );
        }),
    ),
  ],
);

/** intros gives each topic of the course its worked example, check and plan. */
const intros: Record<string, readonly [scene: Pair, check: Pair, plan: Pair]> = {
  "counting-divisors": [
    [
      "How many divisors does $36$ have? Since $36 = 2^{2} \\times 3^{2}$, a divisor takes $2$ to the power $0$, $1$ or $2$ and $3$ to the power $0$, $1$ or $2$, so there are $3 \\times 3 = 9$ divisors.",
      "$36$ 有多少个因数？因为 $36 = 2^{2} \\times 3^{2}$，因数中 $2$ 的指数取 $0$、$1$ 或 $2$，$3$ 的指数也取 $0$、$1$ 或 $2$，所以有 $3 \\times 3 = 9$ 个因数。",
    ],
    ["the list $1, 2, 3, 4, 6, 9, 12, 18, 36$ has nine entries.", "列出来是 $1, 2, 3, 4, 6, 9, 12, 18, 36$，共九个。"],
    [
      "count divisors from the exponents of a factorization, and factor a number first when it is given plainly.",
      "由分解式的指数数因数，对直接给出的数先分解。",
    ],
  ],
  "the-sum-of-divisors-function": [
    [
      "What is $\\sigma(18)$? Since $18 = 2 \\times 3^{2}$, $\\sigma(18) = \\sigma(2) \\times \\sigma(9) = 3 \\times 13 = 39$.",
      "$\\sigma(18)$ 是多少？因为 $18 = 2 \\times 3^{2}$，$\\sigma(18) = \\sigma(2) \\times \\sigma(9) = 3 \\times 13 = 39$。",
    ],
    ["adding the divisors directly, $1 + 2 + 3 + 6 + 9 + 18 = 39$.", "直接把因数相加，$1 + 2 + 3 + 6 + 9 + 18 = 39$。"],
    [
      "add divisors directly and through the factorization, and sum the divisors of a prime power as a geometric series.",
      "直接以及通过分解式求因数和，并用几何级数求质数幂的因数和。",
    ],
  ],
  "perfect-numbers": [
    [
      "Is $28$ perfect? Its proper divisors are $1, 2, 4, 7, 14$, and they add to $28$, so it is.",
      "$28$ 是完全数吗？它的真因数是 $1, 2, 4, 7, 14$，和为 $28$，所以是。",
    ],
    [
      "$\\sigma(28) = \\sigma(4) \\times \\sigma(7) = 7 \\times 8 = 56 = 2 \\times 28$.",
      "$\\sigma(28) = \\sigma(4) \\times \\sigma(7) = 7 \\times 8 = 56 = 2 \\times 28$。",
    ],
    [
      "add the proper divisors of a number and use the sum to call it perfect, abundant or deficient.",
      "求一个数的真因数之和，并据此判断它是完全数、过剩数还是亏数。",
    ],
  ],
  "the-sieve-of-eratosthenes": [
    [
      "To list the primes up to $50$, cross out the multiples of $2, 3, 5$ and $7$, since $\\sqrt{50} \\approx 7.07$. The $15$ numbers left, from $2$ to $47$, are prime.",
      "要列出不超过 $50$ 的质数，划掉 $2, 3, 5, 7$ 的倍数即可，因为 $\\sqrt{50} \\approx 7.07$。剩下的 $15$ 个数（从 $2$ 到 $47$）都是质数。",
    ],
    [
      "the next prime is $11$, and $11^{2} = 121 > 50$, so every multiple of $11$ up to $50$ has a smaller prime factor and is already crossed out.",
      "下一个质数是 $11$，而 $11^{2} = 121 > 50$，所以不超过 $50$ 的 $11$ 的倍数都有更小的质因数，已经被划掉了。",
    ],
    [
      "decide where the sieve can stop, and test a single number with the primes up to its square root.",
      "确定筛法在哪里可以停止，并用不超过平方根的质数检验单个数。",
    ],
  ],
  "the-distribution-of-primes": [
    [
      "There are $25$ primes up to $100$, so $\\pi(100) = 25$. The prime number theorem estimates $\\frac{100}{\\ln 100} \\approx \\frac{100}{4.605} \\approx 22$.",
      "不超过 $100$ 的质数有 $25$ 个，所以 $\\pi(100) = 25$。素数定理的估计是 $\\frac{100}{\\ln 100} \\approx \\frac{100}{4.605} \\approx 22$。",
    ],
    [
      "by blocks of ten, the counts are $4, 4, 2, 2, 3, 2, 2, 3, 2, 1$, which add to $25$; the estimate is a little low, as expected.",
      "按每十个一段，个数是 $4, 4, 2, 2, 3, 2, 2, 3, 2, 1$，和为 $25$；估计略低，符合预期。",
    ],
    [
      "count primes exactly with $\\pi(x)$, and estimate the count with the prime number theorem.",
      "用 $\\pi(x)$ 准确数质数，并用素数定理估计个数。",
    ],
  ],
  "powers-modulo-n": [
    [
      "What is $5^{20} \\bmod 13$? $5^{2} = 25 \\equiv 12 \\equiv -1$, so $5^{4} \\equiv 1$ and $5^{20} = (5^{4})^{5} \\equiv 1$.",
      "$5^{20} \\bmod 13$ 是多少？$5^{2} = 25 \\equiv 12 \\equiv -1$，所以 $5^{4} \\equiv 1$，$5^{20} = (5^{4})^{5} \\equiv 1$。",
    ],
    [
      "$5^{3} = 125 = 9 \\times 13 + 8$, and $8 \\times 5 = 40 = 3 \\times 13 + 1$, so indeed $5^{4} \\equiv 1$.",
      "$5^{3} = 125 = 9 \\times 13 + 8$，而 $8 \\times 5 = 40 = 3 \\times 13 + 1$，所以确实 $5^{4} \\equiv 1$。",
    ],
    [
      "compute large powers by repeated squaring, and find last digits from their short cycles.",
      "用反复平方计算大的幂，并由短周期求个位数字。",
    ],
  ],
  "using-fermats-little-theorem": [
    [
      "What is $3^{1000} \\bmod 7$? Since $3^{6} \\equiv 1$ and $1000 = 6 \\times 166 + 4$, the power reduces to $3^{4} = 81 = 11 \\times 7 + 4$, so the remainder is $4$.",
      "$3^{1000} \\bmod 7$ 是多少？因为 $3^{6} \\equiv 1$，而 $1000 = 6 \\times 166 + 4$，这个幂约简为 $3^{4} = 81 = 11 \\times 7 + 4$，所以余数是 $4$。",
    ],
    ["$3^{6} = 729 = 104 \\times 7 + 1$, as Fermat's little theorem says.", "$3^{6} = 729 = 104 \\times 7 + 1$，与费马小定理一致。"],
    ["reduce exponents modulo $p - 1$, and find inverses as the power $p - 2$.", "把指数模 $p - 1$ 约简，并用 $p - 2$ 次幂求逆元。"],
  ],
  "computing-and-counting-with-the-totient": [
    [
      "What is $\\varphi(45)$? Since $45 = 3^{2} \\times 5$, $\\varphi(45) = \\varphi(9) \\times \\varphi(5) = 6 \\times 4 = 24$.",
      "$\\varphi(45)$ 是多少？因为 $45 = 3^{2} \\times 5$，$\\varphi(45) = \\varphi(9) \\times \\varphi(5) = 6 \\times 4 = 24$。",
    ],
    [
      "with the fractions, $45 \\times \\frac{2}{3} \\times \\frac{4}{5} = 24$.",
      "用比例计算，$45 \\times \\frac{2}{3} \\times \\frac{4}{5} = 24$。",
    ],
    [
      "compute the totient from a factorization, and use it to count fractions in lowest terms.",
      "由分解式求欧拉函数值，并用它数最简分数。",
    ],
  ],
  "reducing-exponents-with-eulers-theorem": [
    [
      "What is the last digit of $7^{222}$? $\\varphi(10) = 4$ and $222 = 4 \\times 55 + 2$, so $7^{222} \\equiv 7^{2} = 49 \\equiv 9 \\pmod{10}$.",
      "$7^{222}$ 的个位数字是多少？$\\varphi(10) = 4$，$222 = 4 \\times 55 + 2$，所以 $7^{222} \\equiv 7^{2} = 49 \\equiv 9 \\pmod{10}$。",
    ],
    [
      "the last digits of the powers of $7$ run $7, 9, 3, 1$, and place $2$ in that cycle is $9$.",
      "$7$ 的幂的个位数字依次是 $7, 9, 3, 1$，周期中第 $2$ 个是 $9$。",
    ],
    [
      "reduce exponents modulo $\\varphi(n)$ for a composite modulus, and find the last two digits of large powers.",
      "对合数模数把指数模 $\\varphi(n)$ 约简，并求大幂的最后两位数字。",
    ],
  ],
  "wilsons-theorem": [
    [
      "What is $10! \\bmod 11$? The numbers $2$ to $9$ pair with their inverses, $2 \\times 6$, $3 \\times 4$, $5 \\times 9$ and $7 \\times 8$, each $\\equiv 1$, so $10! \\equiv 1 \\times 10 = 10$.",
      "$10! \\bmod 11$ 是多少？$2$ 到 $9$ 与各自的逆配对：$2 \\times 6$、$3 \\times 4$、$5 \\times 9$、$7 \\times 8$，每对都 $\\equiv 1$，所以 $10! \\equiv 1 \\times 10 = 10$。",
    ],
    ["$10! = 3628800 = 11 \\times 329890 + 10$.", "$10! = 3628800 = 11 \\times 329890 + 10$。"],
    [
      "use Wilson's theorem for factorials just below a prime, and see why composites above $4$ give $0$.",
      "用威尔逊定理求略小于质数的阶乘，并理解为什么大于 $4$ 的合数给出 $0$。",
    ],
  ],
  "the-order-of-an-integer-modulo-n": [
    [
      "What is the order of $3$ modulo $7$? The powers are $3, 2, 6, 4, 5, 1$, so the order is $6$.",
      "$3$ 模 $7$ 的阶是多少？各次幂是 $3, 2, 6, 4, 5, 1$，所以阶是 $6$。",
    ],
    [
      "$6$ divides $\\varphi(7) = 6$, as every order must, and no earlier power is $1$.",
      "$6$ 整除 $\\varphi(7) = 6$，每个阶都必须如此，而且更早的幂都不是 $1$。",
    ],
    ["find the order of a number, and decide which numbers can be orders modulo a prime.", "求一个数的阶，并判断哪些数可以是模质数的阶。"],
  ],
  "primitive-roots": [
    [
      "Is $3$ a primitive root modulo $7$? $6 = 2 \\times 3$, so test the exponents $3$ and $2$: $3^{3} = 27 \\equiv 6$ and $3^{2} = 9 \\equiv 2$, neither is $1$, so it is.",
      "$3$ 是模 $7$ 的原根吗？$6 = 2 \\times 3$，所以检验指数 $3$ 和 $2$：$3^{3} = 27 \\equiv 6$，$3^{2} = 9 \\equiv 2$，都不是 $1$，所以是。",
    ],
    ["the powers $3, 2, 6, 4, 5, 1$ cover all six nonzero remainders.", "各次幂 $3, 2, 6, 4, 5, 1$ 正好取遍六个非零余数。"],
    [
      "recognize primitive roots with the prime-factor test, and count them with $\\varphi(p - 1)$.",
      "用质因数检验识别原根，并用 $\\varphi(p - 1)$ 数它们的个数。",
    ],
  ],
  "discrete-logarithms": [
    [
      "Solve $2^{x} \\equiv 9 \\pmod{11}$. The powers of $2$ are $2, 4, 8, 5, 10, 9$, so $x = 6$.",
      "解 $2^{x} \\equiv 9 \\pmod{11}$。$2$ 的各次幂是 $2, 4, 8, 5, 10, 9$，所以 $x = 6$。",
    ],
    ["$2^{6} = 64 = 5 \\times 11 + 9$.", "$2^{6} = 64 = 5 \\times 11 + 9$。"],
    [
      "solve for an exponent by listing powers, and compute a shared Diffie–Hellman key.",
      "通过列出各次幂求指数，并计算迪菲–赫尔曼共同密钥。",
    ],
  ],
  "quadratic-residues": [
    [
      "Which numbers are squares modulo $7$? Squaring $1, 2, 3$ gives $1, 4, 2$, so the residues are $1, 2, 4$ and the nonresidues $3, 5, 6$.",
      "模 $7$ 时哪些数是平方数？把 $1, 2, 3$ 平方得 $1, 4, 2$，所以二次剩余是 $1, 2, 4$，二次非剩余是 $3, 5, 6$。",
    ],
    [
      "$4^{2} = 16 \\equiv 2$, $5^{2} = 25 \\equiv 4$ and $6^{2} = 36 \\equiv 1$ only repeat them.",
      "$4^{2} = 16 \\equiv 2$，$5^{2} = 25 \\equiv 4$，$6^{2} = 36 \\equiv 1$，只是重复了它们。",
    ],
    ["recognize quadratic residues modulo a prime, and count them.", "识别模质数的二次剩余，并数出它们的个数。"],
  ],
  "the-legendre-symbol": [
    [
      "What is $\\left(\\frac{10}{13}\\right)$? The squares modulo $13$ are $1, 3, 4, 9, 10, 12$, and $10$ is one of them, so the symbol is $1$.",
      "$\\left(\\frac{10}{13}\\right)$ 是多少？模 $13$ 的平方数是 $1, 3, 4, 9, 10, 12$，$10$ 在其中，所以符号是 $1$。",
    ],
    ["$6^{2} = 36 = 2 \\times 13 + 10$.", "$6^{2} = 36 = 2 \\times 13 + 10$。"],
    ["evaluate the Legendre symbol directly, and multiply symbols for a product.", "直接计算勒让德符号，并对积把符号相乘。"],
  ],
  "eulers-criterion": [
    [
      "Is $3$ a square modulo $11$? $3^{5} = 243 = 22 \\times 11 + 1$, so the half power is $1$ and $3$ is a residue.",
      "$3$ 是模 $11$ 的平方数吗？$3^{5} = 243 = 22 \\times 11 + 1$，半幂是 $1$，所以 $3$ 是二次剩余。",
    ],
    ["$5^{2} = 25 = 2 \\times 11 + 3$.", "$5^{2} = 25 = 2 \\times 11 + 3$。"],
    ["decide residues with the half power, and find when $-1$ is a square.", "用半幂判断二次剩余，并找出 $-1$ 何时是平方数。"],
  ],
  "quadratic-reciprocity": [
    [
      "What is $\\left(\\frac{3}{13}\\right)$? $13$ leaves $1$ on division by $4$, so $\\left(\\frac{3}{13}\\right) = \\left(\\frac{13}{3}\\right) = \\left(\\frac{1}{3}\\right) = 1$.",
      "$\\left(\\frac{3}{13}\\right)$ 是多少？$13$ 除以 $4$ 余 $1$，所以 $\\left(\\frac{3}{13}\\right) = \\left(\\frac{13}{3}\\right) = \\left(\\frac{1}{3}\\right) = 1$。",
    ],
    ["$4^{2} = 16 = 13 + 3$, so $3$ is indeed a square modulo $13$.", "$4^{2} = 16 = 13 + 3$，所以 $3$ 确实是模 $13$ 的平方数。"],
    [
      "flip Legendre symbols with quadratic reciprocity, and use the separate rule for $2$.",
      "用二次互反律翻转勒让德符号，并使用 $2$ 的单独规则。",
    ],
  ],
  "sums-of-two-squares": [
    [
      "Which of $13$ and $7$ is a sum of two squares? $13 = 4 \\times 3 + 1 = 2^{2} + 3^{2}$, while $7$ leaves $3$ on division by $4$ and is not.",
      "$13$ 和 $7$ 中哪个是两个平方数之和？$13 = 4 \\times 3 + 1 = 2^{2} + 3^{2}$；而 $7$ 除以 $4$ 余 $3$，不是。",
    ],
    ["$7 - 0, 7 - 1, 7 - 4$ are $7, 6, 3$, and none of them is a square.", "$7 - 0, 7 - 1, 7 - 4$ 依次是 $7, 6, 3$，都不是平方数。"],
    [
      "write primes of the form $4k + 1$ as sums of two squares, and decide which numbers are such sums.",
      "把形如 $4k + 1$ 的质数写成两个平方数之和，并判断哪些数是这样的和。",
    ],
  ],
  "pythagorean-triples": [
    [
      "With $m = 3$ and $n = 2$, the legs are $9 - 4 = 5$ and $2 \\times 3 \\times 2 = 12$, and the hypotenuse is $9 + 4 = 13$.",
      "取 $m = 3$，$n = 2$，两条直角边是 $9 - 4 = 5$ 和 $2 \\times 3 \\times 2 = 12$，斜边是 $9 + 4 = 13$。",
    ],
    ["$5^{2} + 12^{2} = 25 + 144 = 169 = 13^{2}$.", "$5^{2} + 12^{2} = 25 + 144 = 169 = 13^{2}$。"],
    [
      "generate primitive triples from $m$ and $n$, and recognize which triples are primitive.",
      "由 $m$ 和 $n$ 生成本原勾股数，并识别哪些勾股数是本原的。",
    ],
  ],
  "multiplicative-functions": [
    [
      "What is $\\sigma(20)$? $20 = 4 \\times 5$ with $\\gcd(4, 5) = 1$, so $\\sigma(20) = \\sigma(4) \\times \\sigma(5) = 7 \\times 6 = 42$.",
      "$\\sigma(20)$ 是多少？$20 = 4 \\times 5$，$\\gcd(4, 5) = 1$，所以 $\\sigma(20) = \\sigma(4) \\times \\sigma(5) = 7 \\times 6 = 42$。",
    ],
    ["$1 + 2 + 4 + 5 + 10 + 20 = 42$.", "$1 + 2 + 4 + 5 + 10 + 20 = 42$。"],
    [
      "use multiplicativity on coprime parts, and correct it when the parts share a factor.",
      "对互质部分使用积性，并在两部分有公因数时加以修正。",
    ],
  ],
  "the-mobius-function": [
    [
      "Over the divisors $1, 2, 3, 4, 6, 12$ of $12$, the Möbius function takes the values $1, -1, -1, 0, 1, 0$, which add to $0$.",
      "在 $12$ 的因数 $1, 2, 3, 4, 6, 12$ 上，默比乌斯函数的值是 $1, -1, -1, 0, 1, 0$，和为 $0$。",
    ],
    [
      "the same happens for $6$: $\\mu(1) + \\mu(2) + \\mu(3) + \\mu(6) = 1 - 1 - 1 + 1 = 0$, as for every number above $1$.",
      "对 $6$ 也一样：$\\mu(1) + \\mu(2) + \\mu(3) + \\mu(6) = 1 - 1 - 1 + 1 = 0$，每个大于 $1$ 的数都如此。",
    ],
    ["evaluate the Möbius function, and use it to invert a divisor sum.", "计算默比乌斯函数，并用它反演因数和。"],
  ],
  "continued-fractions": [
    [
      "What is $[1; 2, 2]$? From the inside, $2 + \\frac{1}{2} = \\frac{5}{2}$, then $1 + \\frac{2}{5} = \\frac{7}{5}$.",
      "$[1; 2, 2]$ 是多少？从里向外，$2 + \\frac{1}{2} = \\frac{5}{2}$，然后 $1 + \\frac{2}{5} = \\frac{7}{5}$。",
    ],
    [
      "the Euclidean algorithm on $7$ and $5$ gives $7 = 1 \\times 5 + 2$, $5 = 2 \\times 2 + 1$, $2 = 2 \\times 1 + 0$, with quotients $1, 2, 2$.",
      "对 $7$ 和 $5$ 做欧几里得算法：$7 = 1 \\times 5 + 2$，$5 = 2 \\times 2 + 1$，$2 = 2 \\times 1 + 0$，商是 $1, 2, 2$。",
    ],
    ["evaluate continued fractions, and expand rational numbers with the Euclidean algorithm.", "计算连分数，并用欧几里得算法展开有理数。"],
  ],
  "pells-equation": [
    [
      "Solve $x^{2} - 3y^{2} = 1$ in positive whole numbers. With $y = 1$, $3 + 1 = 4 = 2^{2}$, so the smallest solution is $(2, 1)$.",
      "求 $x^{2} - 3y^{2} = 1$ 的正整数解。取 $y = 1$，$3 + 1 = 4 = 2^{2}$，所以最小解是 $(2, 1)$。",
    ],
    [
      "$4 - 3 = 1$, and squaring gives the next solution $(7, 4)$, with $49 - 48 = 1$.",
      "$4 - 3 = 1$；平方得到下一个解 $(7, 4)$，$49 - 48 = 1$。",
    ],
    ["find the fundamental solution by trial, and build the next solution by squaring.", "用试验求基本解，并通过平方构造下一个解。"],
  ],
};

/** introduce gives a topic its introduction from the table above. */
const introduce = (def: TopicDef): TopicDef => {
  const entry = intros[def.id];
  return entry ? lesson(def, ...entry) : def;
};

/** numberTheoryCourseTopics are the topics of the Number Theory course defined in this file, each with its introduction. */
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
].map(introduce);
