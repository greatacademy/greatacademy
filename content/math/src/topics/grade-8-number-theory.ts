import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { factorizationLatex, gcd, lcm, primeFactors } from "@ga/subject-math";

import { factorizationProblem, steps, withMistakes } from "../problems.ts";
import { type Pair, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import { chosenMath, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { factorTape } from "./grade-8-kit.ts";
import { areaGridFigure, equalTape, tapeFigure } from "./upper-grades-kit.ts";

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

// ---------------------------------------------------------------------------
// Divisibility tests

/** lastDigitWhy says why a number fails the last-digit test for 2, 5 or 10. */
function lastDigitWhy(m: number, d: number): readonly [string, string, string] {
  const last = m % 10;
  if (d === 2) return [grouped(m), `It ends in $${last}$, which is odd.`, `它的末位是 $${last}$，是奇数。`];
  if (d === 5) return [grouped(m), `It ends in $${last}$, which is neither $0$ nor $5$.`, `它的末位是 $${last}$，既不是 $0$ 也不是 $5$。`];
  return last === 5
    ? [grouped(m), "It ends in $5$, so it is divisible by $5$ but not by $10$.", "它的末位是 $5$，所以能被 $5$ 整除，但不能被 $10$ 整除。"]
    : [grouped(m), `It ends in $${last}$, not $0$.`, `它的末位是 $${last}$，不是 $0$。`];
}

/** tailOf writes the last two digits of m for 4, or the last three for 8, as a multiple of d plus a remainder. */
function tailOf(m: number, d: number): string {
  const k = d === 4 ? 2 : 3;
  const tail = m % 10 ** k;
  const r = tail % d;
  return `${tail} = ${d} \\cdot ${Math.floor(tail / d)}${r === 0 ? "" : ` + ${r}`}`;
}

/** primeFactored asks for a prime factorization, works it in labelled steps with a check, and answers each wrong factorization with its reason. */
function primeFactored(prompt: Pair, n: number, walk: readonly Walk[], check: Pair, saids: readonly (readonly [string, string, string])[]) {
  const problem = factorizationProblem({
    prompt: t(prompt[0], prompt[1]),
    value: n,
    wrong: saids.map(([response]) => response),
    solution: walkThrough(walk, check),
  });
  return withMistakes(
    problem,
    saids.filter(([response]) => problem.wrong?.includes(response)).map(([response, en, zh]) => ({ response, why: t(en, zh) })),
  );
}

/** divisibilityOfIntegersBy2510_4And8 tests divisibility by 2, 5 and 10 from the last digit and by 4 and 8 from the last two or three. */
export const divisibilityOfIntegersBy2510_4And8 = withIntro(
  topic(
    "divisibility-of-integers-by-2-5-10-4-and-8",
    t("Divisibility of Integers by 2, 5, 10, 4, and 8", "整数能否被 2、5、10、4 和 8 整除"),
    t(
      "Because 10 is divisible by 2 and 5, only the last digit decides divisibility by 2, 5 and 10. Because 100 is divisible by 4 and 1,000 by 8, only the last two digits decide divisibility by 4, and only the last three decide divisibility by 8.",
      "因为 10 能被 2 和 5 整除，所以一个数能否被 2、5、10 整除只看末位数字。因为 100 能被 4 整除，1,000 能被 8 整除，所以能否被 4 整除只看末两位，能否被 8 整除只看末三位。",
    ),
    ["divisibility-rules"],
    ["4.OA.B.4"],
    [
      lesson(
        "divisible-by-2-5-and-10",
        ["Divisibility by 2, 5 and 10", "被 2、5 和 10 整除"],
        [
          [
            "A whole number is divisible by $2$ when its last digit is even, by $5$ when its last digit is $0$ or $5$, and by $10$ when its last digit is $0$. So $4{,}735$ is divisible by $5$ but not by $2$ or $10$. The other digits do not matter, because every place except the ones place is a multiple of $10$.",
            "整数的末位数字是偶数时能被 $2$ 整除，末位是 $0$ 或 $5$ 时能被 $5$ 整除，末位是 $0$ 时能被 $10$ 整除。所以 $4{,}735$ 能被 $5$ 整除，但不能被 $2$ 或 $10$ 整除。其他数字无关紧要，因为个位以外的每一位都是 $10$ 的倍数。",
          ],
          [
            "Divide: $4{,}735 = 5 \\times 947$, while $4{,}735 \\div 2$ leaves a remainder of $1$.",
            "做除法：$4{,}735 = 5 \\times 947$，而 $4{,}735 \\div 2$ 余 $1$。",
          ],
          [
            "Ending in $5$ is enough for $5$ but not for $10$; only a last digit of $0$ gives $10$.",
            "末位是 $5$ 能被 $5$ 整除，但不能被 $10$ 整除；只有末位是 $0$ 才能被 $10$ 整除。",
          ],
        ],
        (rng) => {
          const d = rng.pick([2, 5, 10]);
          const n = d * rng.int(Math.ceil(1000 / d), Math.floor(99999 / d));
          const others = misses(rng, d, n, d === 10 ? [(m) => m % 5 === 0] : []);
          const rule: Pair =
            d === 2
              ? [`Only $${grouped(n)}$ ends in an even digit, $${n % 10}$.`, `只有 $${grouped(n)}$ 的末位是偶数 $${n % 10}$。`]
              : d === 5
                ? [`Only $${grouped(n)}$ ends in $0$ or $5$.`, `只有 $${grouped(n)}$ 的末位是 $0$ 或 $5$。`]
                : [`Only $${grouped(n)}$ ends in $0$.`, `只有 $${grouped(n)}$ 的末位是 $0$。`];
          return chosenMath(
            rng,
            [`Which of these numbers is divisible by $${d}$?`, `下面哪个数能被 $${d}$ 整除？`],
            grouped(n),
            others.map((m) => lastDigitWhy(m, d)),
            [
              [
                ["Read the last digits", "看末位数字"],
                [
                  "Every place except the ones place is a multiple of $10$, so only the last digit decides:",
                  "个位以外的每一位都是 $10$ 的倍数，所以只看末位数字：",
                ],
                [n, ...others].map((m) => `${grouped(m)} \\rightarrow ${m % 10}`),
              ],
              [["Pick the number", "选出这个数"], rule],
            ],
            divided(n, d),
          );
        },
        tapeFigure(
          [
            {
              total: "4735",
              pieces: [
                { size: 6, text: "4730 = 10 · 473" },
                { size: 1, text: "5", lit: true },
              ],
            },
          ],
          [
            "4735 is 4730 + 5: the 4730 is a multiple of 10, so only the last digit 5 decides divisibility by 2, 5 and 10.",
            "4735 是 4730 + 5：4730 是 10 的倍数，所以能否被 2、5、10 整除只看末位 5。",
          ],
        ),
      ),
      lesson(
        "divisible-by-4-and-8",
        ["Divisibility by 4 and 8", "被 4 和 8 整除"],
        [
          [
            "$7{,}316$ is divisible by $4$ because its last two digits form $16 = 4 \\cdot 4$. For $8$, use the last three digits: $7{,}316$ ends in $316 = 8 \\cdot 39 + 4$, so it is not divisible by $8$. The rest does not matter, since $100$ is a multiple of $4$ and $1{,}000$ a multiple of $8$.",
            "$7{,}316$ 能被 $4$ 整除，因为它的末两位组成 $16 = 4 \\cdot 4$。判断能否被 $8$ 整除要看末三位：$7{,}316$ 的末三位是 $316 = 8 \\cdot 39 + 4$，所以它不能被 $8$ 整除。其余数位无关紧要，因为 $100$ 是 $4$ 的倍数，$1{,}000$ 是 $8$ 的倍数。",
          ],
          [
            "Divide: $7{,}316 = 4 \\times 1{,}829$, and $1{,}829$ is odd, so $7{,}316$ is not a multiple of $8$.",
            "做除法：$7{,}316 = 4 \\times 1{,}829$，而 $1{,}829$ 是奇数，所以 $7{,}316$ 不是 $8$ 的倍数。",
          ],
          [
            "An even last digit is not enough for $4$: $7{,}318$ ends in $18$, which is not a multiple of $4$.",
            "末位是偶数不足以说明能被 $4$ 整除：$7{,}318$ 的末两位是 $18$，不是 $4$ 的倍数。",
          ],
        ],
        (rng) => {
          const d = rng.pick([4, 8]);
          const n = d * rng.int(Math.ceil(1000 / d), Math.floor(99999 / d));
          // An even number that fails for 4, or a multiple of 4 that fails for 8, is the wrong choice most worth having.
          const others = misses(rng, d, n, d === 4 ? [(m) => m % 2 === 0] : [(m) => m % 4 === 0, (m) => m % 2 === 0]);
          const [k, kZh] = d === 4 ? ["two", "两"] : ["three", "三"];
          return chosenMath(
            rng,
            [`Which of these numbers is divisible by $${d}$?`, `下面哪个数能被 $${d}$ 整除？`],
            grouped(n),
            others.map((m) =>
              d === 8 && m % 4 === 0
                ? ([
                    grouped(m),
                    `It is divisible by $4$, but its last three digits give $${tailOf(m, 8)}$.`,
                    `它能被 $4$ 整除，但末三位是 $${tailOf(m, 8)}$。`,
                  ] as const)
                : ([grouped(m), `Its last ${k} digits give $${tailOf(m, d)}$.`, `它的末${kZh}位是 $${tailOf(m, d)}$。`] as const),
            ),
            [
              [
                ["Read the last digits", "看末几位"],
                [
                  d === 4
                    ? "$100$ is a multiple of $4$, so only the last two digits decide:"
                    : "$1{,}000$ is a multiple of $8$, so only the last three digits decide:",
                  d === 4 ? "$100$ 是 $4$ 的倍数，所以只看末两位：" : "$1{,}000$ 是 $8$ 的倍数，所以只看末三位：",
                ],
                [n, ...others].map((m) => `${grouped(m)} \\rightarrow ${tailOf(m, d)}`),
              ],
              [
                ["Pick the multiple", "选出倍数"],
                [
                  `Only the last ${k} digits of $${grouped(n)}$ leave no remainder, so it is divisible by $${d}$.`,
                  `只有 $${grouped(n)}$ 的末${kZh}位没有余数，所以它能被 $${d}$ 整除。`,
                ],
              ],
            ],
            divided(n, d),
          );
        },
        tapeFigure(
          [
            {
              total: "7316",
              pieces: [
                { size: 6, text: "7300 = 100 · 73" },
                { size: 1, text: "16", lit: true },
              ],
            },
          ],
          [
            "7316 is 7300 + 16: 7300 is a multiple of 100 and so of 4, so only the last two digits 16 decide divisibility by 4.",
            "7316 是 7300 + 16：7300 是 100 的倍数，也就是 4 的倍数，所以能否被 4 整除只看末两位 16。",
          ],
        ),
      ),
    ],
  ),
  [
    "A baker has $7{,}316$ cookies to pack into boxes of $2$, $4$, $5$, $8$ or $10$, with none left over. Which box sizes work?",
    "面包师有 $7{,}316$ 块饼干，要平均装进每盒 $2$、$4$、$5$、$8$ 或 $10$ 块的盒子，不能有剩余。哪几种盒子可以？",
  ],
  [
    "It ends in $6$, so $2$ works and $5$ and $10$ do not. Its last two digits $16$ make $4$ work, but $316 = 8 \\cdot 39 + 4$, so $8$ fails.",
    "末位是 $6$，所以 $2$ 可以，$5$ 和 $10$ 不行。末两位 $16$ 说明 $4$ 可以，但 $316 = 8 \\cdot 39 + 4$，所以 $8$ 不行。",
  ],
  [
    "test for $2$, $5$ and $10$ from the last digit, and for $4$ and $8$ from the last two or three.",
    "根据末位检验能否被 $2$、$5$、$10$ 整除，根据末两位或末三位检验能否被 $4$、$8$ 整除。",
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

/** divided writes the check by division of n by one of its factors d. */
const divided = (n: number, d: number): Pair => [
  `Divide: $${grouped(n)} = ${d} \\times ${grouped(n / d)}$.`,
  `做除法：$${grouped(n)} = ${d} \\times ${grouped(n / d)}$。`,
];

/** misses draws three different numbers from 1,000 to 99,999 that d does not divide, other than n; the first ones pass wants in order. */
function misses(rng: Rng, d: number, n: number, wants: readonly ((m: number) => boolean)[] = []): number[] {
  const out: number[] = [];
  while (out.length < 3) {
    const m = rng.int(1000, 99999);
    const want = wants[out.length];
    if (m % d !== 0 && m !== n && !out.includes(m) && (!want || want(m))) out.push(m);
  }
  return out;
}

/** primeBars draws the prime factors of two numbers as bars of single primes, with the shared ones shaded. */
function primeBars(bars: readonly (readonly [total: string, pieces: readonly (readonly [text: string, shared: boolean])[]])[], alt: Pair) {
  return tapeFigure(
    bars.map(([total, pieces]) => ({ total, pieces: pieces.map(([text, lit]) => ({ size: 1, text, lit })) })),
    alt,
  );
}

/** multiplied multiplies out a factorization, writing 1 for an empty one. */
const multiplied = (fs: Factors) => grouped(product(fs));

/** divisibilityOfIntegersBy3_9_6And7 tests divisibility by 3 and 9 with digit sums, by 6 with both 2 and 3, and by 7. */
export const divisibilityOfIntegersBy3_9_6And7 = withIntro(
  topic(
    "divisibility-of-integers-by-3-9-6-and-7",
    t("Divisibility of Integers by 3, 9, 6, and 7", "整数能否被 3、9、6 和 7 整除"),
    t(
      "A number is divisible by 3 when the sum of its digits is, and by 9 when the sum of its digits is. It is divisible by 6 when it is divisible by both 2 and 3. For 7, drop the last digit and subtract twice it from what is left; the number is divisible by 7 exactly when the result is.",
      "一个数各位数字之和能被 3 整除时，这个数能被 3 整除；各位数字之和能被 9 整除时，这个数能被 9 整除。一个数同时能被 2 和 3 整除时，它能被 6 整除。判断能否被 7 整除：去掉末位数字，用剩下的数减去末位数字的 2 倍；原数能被 7 整除当且仅当所得的数能被 7 整除。",
    ),
    ["divisibility-of-integers-by-2-5-10-4-and-8"],
    ["4.OA.B.4"],
    [
      lesson(
        "divisible-by-3-and-9",
        ["Divisibility by 3 and 9", "被 3 和 9 整除"],
        [
          [
            "A number is divisible by $3$ when its digit sum is, and by $9$ when its digit sum is. $5{,}271$ has digit sum $5 + 2 + 7 + 1 = 15$. $15$ is a multiple of $3$ but not of $9$, so $5{,}271$ is divisible by $3$ and not by $9$.",
            "各位数字之和能被 $3$ 整除，这个数就能被 $3$ 整除；能被 $9$ 整除，这个数就能被 $9$ 整除。$5{,}271$ 的各位数字之和是 $5 + 2 + 7 + 1 = 15$。$15$ 是 $3$ 的倍数，不是 $9$ 的倍数，所以 $5{,}271$ 能被 $3$ 整除，不能被 $9$ 整除。",
          ],
          [
            "$5{,}271 = 3 \\times 1{,}757$, while $5{,}271 \\div 9$ leaves a remainder of $6$.",
            "$5{,}271 = 3 \\times 1{,}757$，而 $5{,}271 \\div 9$ 余 $6$。",
          ],
          [
            "Passing the test for $3$ is not enough for $9$. Every multiple of $9$ is a multiple of $3$, but not the other way around.",
            "通过 $3$ 的检验，不等于能被 $9$ 整除。$9$ 的倍数都是 $3$ 的倍数，反过来却不一定。",
          ],
        ],
        (rng) => {
          const d = rng.pick([3, 9]);
          const n = d * rng.int(Math.ceil(1000 / d), Math.floor(99999 / d));
          // For 9, a multiple of 3 that is not a multiple of 9 is the wrong choice most worth having.
          const others = misses(rng, d, n, d === 9 ? [(m) => m % 3 === 0] : []);
          const s = digitSum(n);
          return chosenMath(
            rng,
            [`Which of these numbers is divisible by $${d}$?`, `下面哪个数能被 $${d}$ 整除？`],
            grouped(n),
            others.map((m) => {
              const t3 = digitSum(m);
              return d === 9 && t3 % 3 === 0
                ? ([
                    grouped(m),
                    `Its digit sum $${t3}$ is a multiple of $3$ but not of $9$.`,
                    `它的各位数字之和 $${t3}$ 是 $3$ 的倍数，但不是 $9$ 的倍数。`,
                  ] as const)
                : ([
                    grouped(m),
                    `Its digit sum $${t3}$ is not a multiple of $${d}$.`,
                    `它的各位数字之和 $${t3}$ 不是 $${d}$ 的倍数。`,
                  ] as const);
            }),
            [
              [
                ["Add the digits", "把各位数字相加"],
                ["Find the digit sum of each number:", "求出每个数的各位数字之和："],
                [n, ...others].map((m) => `${[...String(m)].join(" + ")} = ${digitSum(m)}`),
              ],
              [
                ["Pick the multiple", "选出倍数"],
                [
                  `Only $${s}$ is a multiple of $${d}$, so $${grouped(n)}$ is divisible by $${d}$.`,
                  `只有 $${s}$ 是 $${d}$ 的倍数，所以 $${grouped(n)}$ 能被 $${d}$ 整除。`,
                ],
              ],
            ],
            divided(n, d),
          );
        },
        tapeFigure(
          [
            {
              total: "5271",
              pieces: [
                { size: 5, text: "5·999" },
                { size: 3, text: "2·99" },
                { size: 2, text: "7·9" },
                { size: 3, text: "15", lit: true },
              ],
            },
          ],
          [
            "5271 is 5·999 + 2·99 + 7·9 + 15: the first three parts are multiples of 9, so only the digit sum 15 decides.",
            "5271 是 5·999 + 2·99 + 7·9 + 15：前三部分都是 9 的倍数，所以只看各位数字之和 15。",
          ],
        ),
      ),
      lesson(
        "divisible-by-6-and-7",
        ["Divisibility by 6 and 7", "被 6 和 7 整除"],
        [
          [
            "A number is divisible by $6$ when it passes the tests for both $2$ and $3$: $4{,}314$ is even and has digit sum $12$. For $7$, drop the last digit and subtract twice it, until the number is small. $3{,}157$ gives $315 - 14 = 301$, then $30 - 2 = 28 = 4 \\cdot 7$, so $3{,}157$ is divisible by $7$.",
            "同时通过 $2$ 和 $3$ 的检验，这个数就能被 $6$ 整除：$4{,}314$ 是偶数，各位数字之和是 $12$。判断 $7$：去掉末位数字，用剩下的数减去它的 $2$ 倍，直到数变小。$3{,}157$ 得 $315 - 14 = 301$，再得 $30 - 2 = 28 = 4 \\cdot 7$，所以 $3{,}157$ 能被 $7$ 整除。",
          ],
          ["$4{,}314 = 6 \\times 719$ and $3{,}157 = 7 \\times 451$.", "$4{,}314 = 6 \\times 719$，$3{,}157 = 7 \\times 451$。"],
          [
            "Divisibility by $6$ needs both tests. $4{,}316$ is even, but its digit sum $14$ is not a multiple of $3$.",
            "能被 $6$ 整除需要两个检验都通过。$4{,}316$ 是偶数，但各位数字之和 $14$ 不是 $3$ 的倍数。",
          ],
        ],
        (rng) => {
          const d = rng.pick([6, 7]);
          const n = d * rng.int(Math.ceil(1000 / d), Math.floor(99999 / d));
          const prompt: Pair = [`Which of these numbers is divisible by $${d}$?`, `下面哪个数能被 $${d}$ 整除？`];
          if (d === 6) {
            // One number that is even only, one that passes only the test for 3, and one more.
            const others = misses(rng, 6, n, [(m) => m % 2 === 0, (m) => m % 3 === 0]);
            const s = digitSum(n);
            return chosenMath(
              rng,
              prompt,
              grouped(n),
              others.map((m) =>
                m % 2 === 0
                  ? ([
                      grouped(m),
                      `It is even, but its digit sum $${digitSum(m)}$ is not a multiple of $3$.`,
                      `它是偶数，但各位数字之和 $${digitSum(m)}$ 不是 $3$ 的倍数。`,
                    ] as const)
                  : m % 3 === 0
                    ? ([
                        grouped(m),
                        "Its digit sum is a multiple of $3$, but it is odd.",
                        "它的各位数字之和是 $3$ 的倍数，但它是奇数。",
                      ] as const)
                    : ([
                        grouped(m),
                        "It is odd, and its digit sum is not a multiple of $3$.",
                        "它是奇数，各位数字之和也不是 $3$ 的倍数。",
                      ] as const),
              ),
              [
                [
                  ["Test for 2", "检验 2"],
                  [`$${grouped(n)}$ ends in $${n % 10}$, so it is even.`, `$${grouped(n)}$ 的末位是 $${n % 10}$，所以它是偶数。`],
                ],
                [
                  ["Test for 3", "检验 3"],
                  [
                    `Its digit sum is $${s}$, a multiple of $3$. It passes both tests, so it is divisible by $6$.`,
                    `它的各位数字之和是 $${s}$，是 $3$ 的倍数。两个检验都通过，所以它能被 $6$ 整除。`,
                  ],
                ],
              ],
              divided(n, 6),
            );
          }
          const [lines, m] = sevenSteps(n);
          return chosenMath(
            rng,
            prompt,
            grouped(n),
            misses(rng, 7, n).map((o) => {
              const end = sevenSteps(o)[1];
              return [
                grouped(o),
                `The test ends at $${end}$, which is not a multiple of $7$.`,
                `检验最后得到 $${end}$，不是 $7$ 的倍数。`,
              ] as const;
            }),
            [
              [
                ["Drop and subtract", "去掉末位再相减"],
                [
                  `For $${grouped(n)}$, drop the last digit and subtract twice it, until the number is small:`,
                  `对 $${grouped(n)}$，去掉末位数字，用剩下的数减去它的 $2$ 倍，直到数变小：`,
                ],
                lines,
              ],
              [
                ["Test the result", "检验结果"],
                [
                  `$${m}$ is a multiple of $7$, so $${grouped(n)}$ is divisible by $7$.`,
                  `$${m}$ 是 $7$ 的倍数，所以 $${grouped(n)}$ 能被 $7$ 整除。`,
                ],
              ],
            ],
            divided(n, 7),
          );
        },
        equalTape(6, "719", "4314"),
      ),
      lesson(
        "a-missing-digit-for-divisibility",
        ["A missing digit for divisibility", "使数能被整除的缺失数字"],
        [
          [
            "The tests for $3$ and $9$ use the digit sum, so they can also find a missing digit. Add the known digits, then find what reaches the next multiple. For $47\\square1$ and $9$: $4 + 7 + 1 = 12$, and the next multiple of $9$ is $18$, so the digit is $6$.",
            "$3$ 和 $9$ 的检验看各位数字之和，所以也能用来找缺失的数字。先把已知数字相加，再看加多少能到下一个倍数。对 $47\\square1$ 和 $9$：$4 + 7 + 1 = 12$，下一个 $9$ 的倍数是 $18$，所以这个数字是 $6$。",
          ],
          ["$4{,}761 = 9 \\times 529$.", "$4{,}761 = 9 \\times 529$。"],
          [
            "For $3$, several digits may work, since they differ by $3$. Read whether the question wants the smallest one.",
            "对 $3$ 来说，可能有几个数字都行，它们相差 $3$。要看清题目是不是要最小的那个。",
          ],
        ],
        (rng) => {
          const digits = [rng.int(1, 9), rng.int(0, 9), rng.int(0, 9), rng.int(0, 9)];
          const nine = rng.bool();
          const firstSum = digits.reduce((total, v) => total + v, 0);
          if (nine && firstSum % 9 === 0) digits[3] = digits[3] === 9 ? 8 : (digits[3] as number) + 1;
          const sum = digits.reduce((total, v) => total + v, 0);
          const modulus = nine ? 9 : 3;
          const answer = (modulus - (sum % modulus)) % modulus;
          const gap = rng.int(1, 3);
          const shown = digits.map((d, i) => (i === gap ? `${d}\\square` : `${d}`)).join("");
          const off = (v: number) =>
            (sum + v) % modulus === 0
              ? ([v, "That digit works, but a smaller one does too.", "这个数字也行，但还有更小的。"] as const)
              : ([
                  v,
                  `That makes the digit sum $${sum + v}$, which is not a multiple of $${modulus}$.`,
                  `这样各位数字之和是 $${sum + v}$，不是 $${modulus}$ 的倍数。`,
                ] as const);
          return valued(
            nine
              ? [
                  `The digit in the box makes $${shown}$ divisible by $9$. Which digit is it?`,
                  `方框里的数字使 $${shown}$ 能被 $9$ 整除。这个数字是几？`,
                ]
              : [
                  `What is the smallest digit that can go in the box to make $${shown}$ divisible by $3$?`,
                  `方框里最小填什么数字，才能使 $${shown}$ 能被 $3$ 整除？`,
                ],
            answer,
            [
              [
                ["Add the known digits", "把已知数字相加"],
                [`$${digits.join(" + ")} = ${sum}$.`, `$${digits.join(" + ")} = ${sum}$。`],
              ],
              [
                ["Reach the next multiple", "凑到下一个倍数"],
                answer === 0
                  ? [
                      `$${sum}$ is already a multiple of $3$, so the smallest digit is $0$.`,
                      `$${sum}$ 已经是 $3$ 的倍数，所以最小的数字是 $0$。`,
                    ]
                  : [
                      `The next multiple of $${modulus}$ is $${sum + answer}$, so the digit is $${sum + answer} - ${sum} = ${answer}$.`,
                      `下一个 $${modulus}$ 的倍数是 $${sum + answer}$，所以这个数字是 $${sum + answer} - ${sum} = ${answer}$。`,
                    ],
              ],
            ],
            [
              `With $${answer}$ in the box the digit sum is $${sum + answer} = ${modulus} \\times ${(sum + answer) / modulus}$.`,
              `方框里填 $${answer}$，各位数字之和是 $${sum + answer} = ${modulus} \\times ${(sum + answer) / modulus}$。`,
            ],
            [
              [sum % modulus, "That is the remainder of the digit sum, not what it still needs.", "这是数字和的余数，不是还差的数。"],
              ...[answer + 1, answer + 2, (answer + 3) % 10, modulus].filter((v) => v <= 9).map(off),
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "18",
              pieces: [
                { size: 12, text: "12" },
                { size: 6, text: "6", lit: true },
              ],
            },
          ],
          ["The known digits make 12; 6 more reaches 18, the next multiple of 9.", "已知数字之和是 12；再加 6 就到 18，下一个 9 的倍数。"],
        ),
      ),
    ],
  ),
  [
    "A school has $5{,}271$ stickers to pack into equal bags of $3$, $6$, $7$ or $9$, with none left over. Which bag sizes work?",
    "学校有 $5{,}271$ 张贴纸，要平均装进每袋 $3$、$6$、$7$ 或 $9$ 张的袋子，不能有剩余。哪几种袋子可以？",
  ],
  [
    "The digit sum is $15$, so $3$ works and $9$ does not. The number is odd, so $6$ fails. And $5{,}271 = 7 \\times 753$.",
    "各位数字之和是 $15$，所以 $3$ 可以，$9$ 不行。这个数是奇数，所以 $6$ 不行。而 $5{,}271 = 7 \\times 753$。",
  ],
  ["test for $3$, $9$, $6$ and $7$, and find a missing digit.", "检验能否被 $3$、$9$、$6$ 和 $7$ 整除，并找出缺失的数字。"],
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
export const primeFactorsTopic = withIntro(
  topic(
    "prime-factors",
    t("Prime Factors", "质因数"),
    t(
      "The prime factors of a number are the primes that divide it. Dividing by the smallest prime that goes in, again and again until 1 is left, finds all of them, and writing repeated primes with exponents gives the prime factorization: 360 = 2³ · 3² · 5.",
      "一个数的质因数是能整除它的质数。反复用能整除它的最小质数去除，直到得 1，就能找出所有质因数；把重复的质数写成幂，就得到质因数分解：360 = 2³ · 3² · 5。",
    ),
    ["prime-and-composite-numbers"],
    ["6.NS.B.4"],
    [
      lesson(
        "the-largest-prime-factor",
        ["The largest prime factor", "最大的质因数"],
        [
          [
            "To find the largest prime factor of $546$, divide by primes in order: $546 \\div 2 = 273$, $273 \\div 3 = 91$, $91 \\div 7 = 13$, and $13$ is prime. So $546 = 2 \\cdot 3 \\cdot 7 \\cdot 13$, and the largest prime factor is $13$.",
            "求 $546$ 最大的质因数，按顺序用质数去除：$546 \\div 2 = 273$，$273 \\div 3 = 91$，$91 \\div 7 = 13$，而 $13$ 是质数。所以 $546 = 2 \\cdot 3 \\cdot 7 \\cdot 13$，最大的质因数是 $13$。",
          ],
          [
            "Multiply back: $13 \\cdot 7 \\cdot 3 \\cdot 2 = 91 \\cdot 6 = 546$.",
            "乘回去：$13 \\cdot 7 \\cdot 3 \\cdot 2 = 91 \\cdot 6 = 546$。",
          ],
          ["The largest factor other than $546$ itself is $273$, which is not prime.", "除 $546$ 本身以外最大的因数是 $273$，它不是质数。"],
        ],
        (rng) => {
          const fs = drawFactors(rng, 60, 2000, 2);
          const n = product(fs);
          const ps = fs.map(([p]) => p);
          const big = ps[ps.length - 1]!;
          const second = ps[ps.length - 2]!;
          const powers = [...fs].reverse().map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`));
          const values = [...fs].reverse().map(([p, e]) => `${p ** e}`);
          return valued(
            [`What is the largest prime factor of $${grouped(n)}$?`, `$${grouped(n)}$ 最大的质因数是多少？`],
            big,
            [
              [
                ["Divide by primes", "用质数依次去除"],
                ["Start with the smallest prime that goes in, again and again:", "从能整除的最小质数开始，反复去除："],
                divisions(n),
              ],
              [
                ["Read the largest", "找出最大的"],
                [
                  `So $${grouped(n)} = ${latex(fs)}$, and the largest prime used is $${big}$.`,
                  `所以 $${grouped(n)} = ${latex(fs)}$，用到的最大质数是 $${big}$。`,
                ],
              ],
            ],
            [
              `Multiply back from the largest. Every factor is a power of a prime, and together they make the number: $${powers.join(" \\cdot ")} = ${values.join(" \\cdot ")} = ${grouped(n)}$.`,
              `从最大的开始乘回去。每个因数都是质数的幂，合起来正是这个数：$${powers.join(" \\cdot ")} = ${values.join(" \\cdot ")} = ${grouped(n)}$。`,
            ],
            [
              [
                n / ps[0]!,
                `That is the largest factor other than $${grouped(n)}$, but it is not prime.`,
                `这是除 $${grouped(n)}$ 以外最大的因数，但它不是质数。`,
              ],
              [ps[0]!, "That is the smallest prime factor.", "这是最小的质因数。"],
              [second, "That is a prime factor, but not the largest.", "这是一个质因数，但不是最大的。"],
              [big * second, "That is a product of two primes, so it is not prime.", "这是两个质数的积，所以不是质数。"],
            ],
          );
        },
        factorTape(
          [
            ["2", 1],
            ["3", 1],
            ["7", 1],
            ["13", 1],
          ],
          "546",
          ["546 is 2 · 3 · 7 · 13, and 13 is the largest of these primes.", "546 是 2 · 3 · 7 · 13，其中最大的质数是 13。"],
        ),
      ),
      lesson(
        "prime-factorization-with-exponents",
        ["Prime factorization with exponents", "用指数写质因数分解"],
        [
          [
            "$360 \\div 2 = 180$, $180 \\div 2 = 90$, $90 \\div 2 = 45$, $45 \\div 3 = 15$, $15 \\div 3 = 5$, and $5$ is prime. The prime $2$ was used three times and $3$ twice, so $360 = 2^{3} \\cdot 3^{2} \\cdot 5$.",
            "$360 \\div 2 = 180$，$180 \\div 2 = 90$，$90 \\div 2 = 45$，$45 \\div 3 = 15$，$15 \\div 3 = 5$，而 $5$ 是质数。质数 $2$ 用了三次，$3$ 用了两次，所以 $360 = 2^{3} \\cdot 3^{2} \\cdot 5$。",
          ],
          [
            "Multiply back: $2^{3} \\cdot 3^{2} \\cdot 5 = 8 \\cdot 9 \\cdot 5 = 360$.",
            "乘回去：$2^{3} \\cdot 3^{2} \\cdot 5 = 8 \\cdot 9 \\cdot 5 = 360$。",
          ],
          [
            "Every factor in the answer must be prime: $2^{3} \\cdot 45$ is not finished.",
            "答案中的每个因数都必须是质数：$2^{3} \\cdot 45$ 还没有分解完。",
          ],
        ],
        (rng) => {
          let fs: Factors;
          do fs = drawFactors(rng, 100, 3000);
          while (fs.every(([, e]) => e === 1));
          const n = product(fs);
          const [p, e] = fs[0]!;
          const rest = n / p ** e;
          const restComposite = fs.length > 2 || fs[1]![1] > 1;
          return primeFactored(
            [`Write the prime factorization of $${grouped(n)}$ using exponents.`, `用指数形式写出 $${grouped(n)}$ 的质因数分解。`],
            n,
            [
              [
                ["Divide by primes", "用质数依次去除"],
                ["Start with the smallest prime that goes in, again and again:", "从能整除的最小质数开始，反复去除："],
                divisions(n),
              ],
              [
                ["Count each prime", "数出每个质数"],
                [
                  `Each prime's exponent is how many times it was used: $${grouped(n)} = ${latex(fs)}$.`,
                  `每个质数用了几次，指数就是几：$${grouped(n)} = ${latex(fs)}$。`,
                ],
              ],
            ],
            [
              `Multiply back: $${latex(fs)} = ${fs.map(([q, f]) => `${q ** f}`).join(" \\cdot ")} = ${grouped(n)}$.`,
              `乘回去：$${latex(fs)} = ${fs.map(([q, f]) => `${q ** f}`).join(" \\cdot ")} = ${grouped(n)}$。`,
            ],
            [
              ...(restComposite
                ? ([
                    [
                      `${latex([[p, e]])} \\cdot ${rest}`,
                      `That stops early: $${rest}$ is not prime.`,
                      `这是分解到一半就停了：$${rest}$ 不是质数。`,
                    ],
                  ] as const)
                : []),
              [
                factorizationLatex(fs.map(([q]) => [q, 1])),
                `That drops the repeated primes; it is $${multiplied(fs.map(([q]) => [q, 1] as const))}$.`,
                `这是漏掉了重复的质数；它等于 $${multiplied(fs.map(([q]) => [q, 1] as const))}$。`,
              ],
            ],
          );
        },
        factorTape(
          [
            ["2", 3],
            ["3", 2],
            ["5", 1],
          ],
          "360",
          ["360 is three 2s, two 3s and one 5, written 2³ · 3² · 5.", "360 是三个 2、两个 3 和一个 5 相乘，写作 2³ · 3² · 5。"],
        ),
      ),
    ],
  ),
  [
    "A secret number was made by multiplying primes, and it came out as $546$. Which primes went in?",
    "一个秘密数是由几个质数相乘得到的，结果是 $546$。用了哪些质数？",
  ],
  [
    "$546 = 2 \\cdot 273 = 2 \\cdot 3 \\cdot 91 = 2 \\cdot 3 \\cdot 7 \\cdot 13$.",
    "$546 = 2 \\cdot 273 = 2 \\cdot 3 \\cdot 91 = 2 \\cdot 3 \\cdot 7 \\cdot 13$。",
  ],
  [
    "find the prime factors of a number and write its prime factorization with exponents.",
    "找出一个数的质因数，并用指数写出它的质因数分解。",
  ],
);

/** theFundamentalTheoremOfArithmetic uses the uniqueness of prime factorizations. */
export const theFundamentalTheoremOfArithmetic = withIntro(
  topic(
    "the-fundamental-theorem-of-arithmetic",
    t("The Fundamental Theorem of Arithmetic", "算术基本定理"),
    t(
      "The fundamental theorem of arithmetic says that every whole number greater than 1 is a product of primes in exactly one way, apart from the order of the factors. So a number's prime factorization tells everything about its factors: d divides n exactly when every prime appears in d at most as many times as in n.",
      "算术基本定理指出：每个大于 1 的整数都能写成质数的乘积，而且除因数的顺序外写法唯一。所以一个数的质因数分解决定了它的全部因数：d 整除 n，当且仅当每个质数在 d 中出现的次数不超过在 n 中出现的次数。",
    ),
    ["prime-factors"],
    ["6.NS.B.4"],
    [
      lesson(
        "recognizing-the-prime-factorization",
        ["Recognizing the prime factorization", "识别质因数分解"],
        [
          [
            "$72$ can be written as $8 \\cdot 9$, $2^{2} \\cdot 18$ or $2^{3} \\cdot 3^{2}$. Only the last is its prime factorization, because $8$, $9$ and $18$ are not prime. The fundamental theorem says every way of breaking $72$ into primes ends at the same $2^{3} \\cdot 3^{2}$. So primes with other exponents, such as $2^{2} \\cdot 3^{3}$, make a different number.",
            "$72$ 可以写成 $8 \\cdot 9$、$2^{2} \\cdot 18$ 或 $2^{3} \\cdot 3^{2}$。只有最后一个是它的质因数分解，因为 $8$、$9$ 和 $18$ 都不是质数。算术基本定理说，把 $72$ 分解成质数，无论怎样分，最后都是同一个 $2^{3} \\cdot 3^{2}$。所以指数不同的质数乘积，例如 $2^{2} \\cdot 3^{3}$，是另一个数。",
          ],
          ["$2^{3} \\cdot 3^{2} = 8 \\cdot 9 = 72$.", "$2^{3} \\cdot 3^{2} = 8 \\cdot 9 = 72$。"],
          [
            "Every factor must be prime. $8 \\cdot 9$ equals $72$, but it is not the prime factorization.",
            "每个因数都必须是质数。$8 \\cdot 9$ 等于 $72$，但它不是质因数分解。",
          ],
        ],
        (rng) => {
          let fs: Factors;
          do fs = drawFactors(rng, 60, 1500);
          while (fs.every(([, e]) => e === 1));
          const n = product(fs);
          const i = fs.findIndex(([, e]) => e > 1);
          const [p, e] = fs[i]!;
          const right = latex(fs);
          // A product equal to n with a composite factor, and products of the right primes with an exponent changed.
          const composite = fs.map(([q, f], j) => (j === i ? `${q ** e}` : f === 1 ? `${q}` : `${q}^{${f}}`)).join(" \\cdot ");
          const less = fs.map(([q, f], j) => [q, j === i ? f - 1 : f] as const).filter(([, f]) => f > 0);
          const more = fs.map(([q, f], j) => [q, j === (i + 1) % fs.length ? f + 1 : f] as const);
          const swapped = fs.map(([q], j) => [q, fs[fs.length - 1 - j]![1]] as const);
          const options: [string, string, string][] = [
            [composite, `This equals $${grouped(n)}$, but $${p ** e}$ is not prime.`, `它等于 $${grouped(n)}$，但 $${p ** e}$ 不是质数。`],
            [latex(less), `This is $${multiplied(less)}$; one exponent is too small.`, `它等于 $${multiplied(less)}$；有一个指数太小了。`],
            [latex(more), `This is $${multiplied(more)}$; one exponent is too large.`, `它等于 $${multiplied(more)}$；有一个指数太大了。`],
            [
              latex(swapped),
              `The exponents sit on the wrong primes; this is $${multiplied(swapped)}$.`,
              `指数放错了质数；它等于 $${multiplied(swapped)}$。`,
            ],
          ];
          return chosenMath(
            rng,
            [`Which of these is the prime factorization of $${grouped(n)}$?`, `下面哪一个是 $${grouped(n)}$ 的质因数分解？`],
            right,
            options.filter(([o], k) => o !== right && options.findIndex(([w]) => w === o) === k).slice(0, 3),
            [
              [
                ["Divide by primes", "用质数依次去除"],
                ["Start with the smallest prime that goes in, again and again:", "从能整除的最小质数开始，反复去除："],
                divisions(n),
              ],
              [
                ["Count each prime", "数出每个质数"],
                [
                  `Each prime appears as often as it was used: $${grouped(n)} = ${right}$.`,
                  `每个质数用了几次，指数就是几：$${grouped(n)} = ${right}$。`,
                ],
              ],
            ],
            [
              `Multiply back: $${fs.map(([q, f]) => `${q ** f}`).join(" \\cdot ")} = ${grouped(n)}$.`,
              `乘回去：$${fs.map(([q, f]) => `${q ** f}`).join(" \\cdot ")} = ${grouped(n)}$。`,
            ],
          );
        },
        factorTape(
          [
            ["2", 3],
            ["3", 2],
          ],
          "72",
          [
            "72 is three 2s and two 3s, and no other way of breaking it into primes exists.",
            "72 是三个 2 和两个 3 相乘，分解成质数只有这一种结果。",
          ],
        ),
      ),
      lesson(
        "divisibility-from-the-factorization",
        ["Factors from the factorization", "由质因数分解判断因数"],
        [
          [
            "Let $n = 2^{3} \\cdot 3 \\cdot 5^{2}$. $n$ is divisible by $12 = 2^{2} \\cdot 3$, because it has at least two $2$s and one $3$. It is not divisible by $9 = 3^{2}$, as it has only one $3$. Nor is it divisible by $14 = 2 \\cdot 7$, as $7$ is not among its primes. There is no need to multiply out $n$.",
            "设 $n = 2^{3} \\cdot 3 \\cdot 5^{2}$。$n$ 能被 $12 = 2^{2} \\cdot 3$ 整除，因为它至少有两个 $2$ 和一个 $3$。它不能被 $9 = 3^{2}$ 整除，因为只有一个 $3$。也不能被 $14 = 2 \\cdot 7$ 整除，因为 $7$ 不在它的质因数里。不需要把 $n$ 乘出来。",
          ],
          ["$n = 600$, and $600 \\div 12 = 50$, a whole number.", "$n = 600$，而 $600 \\div 12 = 50$，是整数。"],
          [
            "Count the copies too. $3$ divides $n$, but $9 = 3^{2}$ needs two $3$s.",
            "还要数个数。$3$ 能整除 $n$，但 $9 = 3^{2}$ 需要两个 $3$。",
          ],
        ],
        (rng) => {
          const fs = drawFactors(rng, 200, 200000);
          const own = new Map(fs.map(([p, e]) => [p, e]));
          const missing = smallPrimes.filter((p) => !own.has(p) && p <= 11);
          const first = fs[0]![0];
          const ds = rng
            .sample([...fs], Math.min(2, fs.length))
            .map(([p, e]) => [p, rng.int(1, e)] as const)
            .sort((a, b) => a[0] - b[0]);
          const d = product(ds);
          // Divisors that ask for one copy too many of a prime, or for a prime n does not have.
          const wrongs: Factors[] = [
            ...fs.map(([p, e]) => [[p, e + 1]] as Factors),
            ...missing.map(
              (q): Factors => [
                [Math.min(q, first), 1],
                [Math.max(q, first), 1],
              ],
            ),
          ];
          const picked = rng.sample(wrongs, 3);
          const quotient = fs.map(([p, e]) => [p, e - (new Map(ds).get(p) ?? 0)] as const).filter(([, e]) => e > 0);
          return chosenMath(
            rng,
            [`Let $n = ${latex(fs)}$. Which of these divides $n$?`, `设 $n = ${latex(fs)}$。下面哪个数能整除 $n$？`],
            grouped(d),
            picked.map((w) => {
              const [p, e] = w.find(([q, f]) => (own.get(q) ?? 0) < f)!;
              const has = own.get(p) ?? 0;
              return has === 0
                ? ([
                    grouped(product(w)),
                    `It needs the prime $${p}$, which $n$ does not have.`,
                    `它需要质因数 $${p}$，而 $n$ 没有。`,
                  ] as const)
                : ([
                    grouped(product(w)),
                    `It is $${latex(w)}$ and needs ${e} factors of $${p}$, but $n$ has only ${has}.`,
                    `它是 $${latex(w)}$，需要 ${e} 个因数 $${p}$，而 $n$ 只有 ${has} 个。`,
                  ] as const);
            }),
            [
              [
                ["Factor the choice", "分解这个选项"],
                [`$${grouped(d)} = ${latex(ds)}$.`, `$${grouped(d)} = ${latex(ds)}$。`],
              ],
              [
                ["Compare the exponents", "比较指数"],
                [
                  `Every prime of $${grouped(d)}$ appears in $n$ at least as many times, so it divides $n$.`,
                  `$${grouped(d)}$ 的每个质因数在 $n$ 中出现的次数都不少于在它里面的次数，所以它能整除 $n$。`,
                ],
              ],
            ],
            [
              `$n \\div ${grouped(d)} = ${quotient.length > 0 ? latex(quotient) : "1"}$, a whole number.`,
              `$n \\div ${grouped(d)} = ${quotient.length > 0 ? latex(quotient) : "1"}$，是整数。`,
            ],
          );
        },
        factorTape(
          [
            ["2", 3],
            ["3", 1],
            ["5", 2],
          ],
          "600",
          [
            "600 is three 2s, one 3 and two 5s; 12 uses two of the 2s and the 3.",
            "600 是三个 2、一个 3 和两个 5 相乘；12 用了其中两个 2 和那个 3。",
          ],
        ),
      ),
      lesson(
        "counting-factors-from-a-prime-factorization",
        ["Counting factors from a prime factorization", "由质因数分解数因数的个数"],
        [
          [
            "Each factor of a number picks how many copies of each prime to use, from none up to all. A prime with exponent $3$ gives $4$ choices: $p^{0}$, $p^{1}$, $p^{2}$ and $p^{3}$. The choices are independent, so they multiply. So $2^{3} \\cdot 3^{2}$ has $4 \\times 3 = 12$ factors.",
            "一个数的每个因数，都是决定每个质数用几个，从一个不用到全部用上。指数是 $3$ 的质数有 $4$ 种选择：$p^{0}$、$p^{1}$、$p^{2}$ 和 $p^{3}$。这些选择相互独立，所以要相乘。所以 $2^{3} \\cdot 3^{2}$ 有 $4 \\times 3 = 12$ 个因数。",
          ],
          [
            "The factors of $72$ are $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$: twelve of them.",
            "$72$ 的因数是 $1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72$，一共十二个。",
          ],
          [
            "Add one to each exponent, then multiply. $2^{3} \\cdot 3^{2}$ has $12$ factors, not $3 \\times 2 = 6$.",
            "每个指数先加一，再相乘。$2^{3} \\cdot 3^{2}$ 有 $12$ 个因数，不是 $3 \\times 2 = 6$ 个。",
          ],
        ],
        (rng) => {
          const primes = rng.pick([
            [2, 3],
            [2, 5],
            [3, 5],
            [2, 7],
            [3, 7],
            [2, 3, 5],
            [2, 3, 7],
            [2, 5, 7],
            [3, 5, 7],
            [2, 3, 11],
          ]);
          const powers = primes.map(() => rng.int(1, 5));
          const answer = powers.reduce((total, v) => total * (v + 1), 1);
          const shown = primes.map((p, i) => (powers[i] === 1 ? `${p}` : `${p}^{${powers[i]}}`)).join(" \\times ");
          const sum = powers.reduce((total, v) => total + v, 0);
          // The check lists the factors when there are few, and otherwise counts them in groups by the first prime.
          const all = primes
            .reduce((ds: number[], p, i) => ds.flatMap((d) => Array.from({ length: (powers[i] ?? 0) + 1 }, (_, k) => d * p ** k)), [1])
            .sort((x, y) => x - y);
          const listed = all.map((d) => `$${grouped(d)}$`);
          const first = powers[0] ?? 0;
          const rest = answer / (first + 1);
          const restShown = primes
            .slice(1)
            .map((p, i) => (powers[i + 1] === 1 ? `${p}` : `${p}^{${powers[i + 1]}}`))
            .join(" \\times ");
          return valued(
            [
              `A number has the prime factorization $${shown}$. How many positive factors does it have, including 1 and itself?`,
              `一个数的质因数分解是 $${shown}$。它有多少个正因数（包括 1 和它本身）？`,
            ],
            answer,
            [
              [
                ["Count the choices for each prime", "数出每个质数的选择"],
                ["Each prime can be used from $0$ times up to its exponent:", "每个质数可以用 $0$ 次到它的指数次："],
                primes.map((p, i) => `${p}^{0}, \\ldots, ${p}^{${powers[i]}}: \\ ${(powers[i] ?? 0) + 1}`),
              ],
              [
                ["Multiply", "相乘"],
                ["The choices are independent, so they multiply:", "这些选择相互独立，所以相乘："],
                [`${powers.map((v) => v + 1).join(" \\times ")} = ${answer}`],
              ],
            ],
            answer <= 12
              ? [`List them all: ${listed.join(", ")}. That makes $${answer}$.`, `全部列出来：${listed.join("、")}，一共 $${answer}$ 个。`]
              : [
                  `Sort the factors by how many $${primes[0]}$s they use: each of the $${first + 1}$ groups, from $${primes[0]}^{0}$ to $${primes[0]}^{${first}}$, holds the same $${rest}$ factors of $${restShown}$, and $${first + 1} \\times ${rest} = ${answer}$.`,
                  `按用了几个 $${primes[0]}$ 把因数分组：从 $${primes[0]}^{0}$ 到 $${primes[0]}^{${first}}$ 共 $${first + 1}$ 组，每组都是 $${restShown}$ 的那 $${rest}$ 个因数，$${first + 1} \\times ${rest} = ${answer}$。`,
                ],
            [
              [sum, "That adds the exponents; the choices multiply.", "这是把指数相加了；选择数要相乘。"],
              [
                sum + powers.length,
                "That adds one to each exponent but then adds; the choices multiply.",
                "这是每个指数加了一，却又相加了；选择数要相乘。",
              ],
              [
                powers.reduce((total, v) => total * v, 1),
                "That multiplies the exponents and forgets the choice of using none.",
                "这是把指数相乘了，忘了一个都不用这种选择。",
              ],
            ],
          );
        },
        areaGridFigure(
          ["1", "2", "4", "8"],
          ["1", "3", "9"],
          [
            ["1", "3", "9"],
            ["2", "6", "18"],
            ["4", "12", "36"],
            ["8", "24", "72"],
          ],
        ),
      ),
    ],
  ),
  [
    "Two students break $72$ into primes. One starts with $8 \\times 9$, the other with $2 \\times 36$. Will they end with the same primes?",
    "两个同学把 $72$ 分解成质数。一个从 $8 \\times 9$ 开始，另一个从 $2 \\times 36$ 开始。最后得到的质数会一样吗？",
  ],
  [
    "Both reach $2^{3} \\cdot 3^{2}$: $8 \\cdot 9 = 2^{3} \\cdot 3^{2}$ and $2 \\cdot 36 = 2 \\cdot 2^{2} \\cdot 3^{2}$.",
    "两人都得到 $2^{3} \\cdot 3^{2}$：$8 \\cdot 9 = 2^{3} \\cdot 3^{2}$，$2 \\cdot 36 = 2 \\cdot 2^{2} \\cdot 3^{2}$。",
  ],
  [
    "recognize the one prime factorization, read factors from it, and count them.",
    "识别唯一的质因数分解，由它判断因数，并数出因数的个数。",
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
export const findingGreatestCommonFactorsUsingPrimeFactorization = withIntro(
  topic(
    "finding-greatest-common-factors-using-prime-factorization",
    t("Finding Greatest Common Factors Using Prime Factorization", "用质因数分解求最大公因数"),
    t(
      "To find the greatest common factor of two numbers, write both prime factorizations. The GCF is the product of the primes they share, each with the smaller of its two exponents.",
      "求两个数的最大公因数，先写出它们的质因数分解。最大公因数是两数公有的质因数的乘积，每个质因数取两个指数中较小的那个。",
    ),
    ["the-fundamental-theorem-of-arithmetic", "greatest-common-factor"],
    ["6.NS.B.4"],
    [
      lesson(
        "gcf-of-two-numbers",
        ["Two numbers", "两个数"],
        [
          [
            "To find the greatest common factor, write both prime factorizations. Then take each shared prime with the smaller of its two exponents. $84 = 2^{2} \\cdot 3 \\cdot 7$ and $90 = 2 \\cdot 3^{2} \\cdot 5$ share $2$ and $3$, each with smaller exponent $1$, so the GCF is $2 \\cdot 3 = 6$.",
            "求最大公因数，先写出两个数的质因数分解。再把公有的质因数各取两个指数中较小的那个。$84 = 2^{2} \\cdot 3 \\cdot 7$，$90 = 2 \\cdot 3^{2} \\cdot 5$，公有 $2$ 和 $3$，较小的指数都是 $1$，所以最大公因数是 $2 \\cdot 3 = 6$。",
          ],
          [
            "$84 \\div 6 = 14$ and $90 \\div 6 = 15$, and $14$ and $15$ share no factor.",
            "$84 \\div 6 = 14$，$90 \\div 6 = 15$，而 $14$ 和 $15$ 没有公因数。",
          ],
          [
            "Leave out primes found in only one number. $5$ and $7$ are not part of the GCF of $84$ and $90$.",
            "只在一个数里出现的质因数不算。$5$ 和 $7$ 不在 $84$ 和 $90$ 的最大公因数里。",
          ],
        ],
        (rng) => {
          const [a, b] = commonPair(rng, 24, 400);
          const [x, y] = [product(a), product(b)];
          const g = combine(a, b, "gcf");
          const G = gcd(x, y);
          const common = new Set(g.map(([p]) => p));
          const larger = product(combine(a, b, "lcm").filter(([p]) => common.has(p)));
          return valued(
            [`Find the greatest common factor of $${x}$ and $${y}$.`, `求 $${x}$ 和 $${y}$ 的最大公因数。`],
            G,
            [
              [
                ["Factor both numbers", "分解两个数"],
                ["Write each prime factorization:", "写出质因数分解："],
                [`${x} = ${latex(a)}`, `${y} = ${latex(b)}`],
              ],
              [
                ["Take the shared primes", "取公有的质因数"],
                ["Keep each shared prime with its smaller exponent:", "每个公有质因数取较小的指数："],
                [`${latex(g)} = ${G}`],
              ],
            ],
            [
              `$${x} \\div ${G} = ${x / G}$ and $${y} \\div ${G} = ${y / G}$, and these share no factor.`,
              `$${x} \\div ${G} = ${x / G}$，$${y} \\div ${G} = ${y / G}$，两者没有公因数。`,
            ],
            [
              [larger, "That uses the larger exponents; the GCF takes the smaller ones.", "这是取了较大的指数；最大公因数取较小的。"],
              [[...common].reduce((v, p) => v * p, 1), "That drops the exponents of the shared primes.", "这是丢掉了公有质因数的指数。"],
              [lcm(x, y), "That is the lowest common multiple, not the greatest common factor.", "这是最小公倍数，不是最大公因数。"],
            ],
          );
        },
        primeBars(
          [
            [
              "84",
              [
                ["2", true],
                ["2", false],
                ["3", true],
                ["7", false],
              ],
            ],
            [
              "90",
              [
                ["2", true],
                ["3", true],
                ["3", false],
                ["5", false],
              ],
            ],
          ],
          [
            "84 and 90 share one 2 and one 3, shaded; their product 6 is the greatest common factor.",
            "84 和 90 公有一个 2 和一个 3（涂色部分）；它们的积 6 就是最大公因数。",
          ],
        ),
      ),
      lesson(
        "gcf-of-factored-numbers",
        ["Numbers given as prime factorizations", "以质因数分解给出的数"],
        [
          [
            "When the numbers come as prime factorizations, read the GCF straight off them. For $A = 2^{4} \\cdot 3^{2} \\cdot 7$ and $B = 2^{2} \\cdot 3^{5} \\cdot 5$, the shared primes are $2$ and $3$. Their smaller exponents are $2$ and $2$, so the GCF is $2^{2} \\cdot 3^{2} = 36$. There is no need to multiply out $A$ and $B$.",
            "两个数以质因数分解给出时，可以直接读出最大公因数。对于 $A = 2^{4} \\cdot 3^{2} \\cdot 7$ 和 $B = 2^{2} \\cdot 3^{5} \\cdot 5$，公有的质因数是 $2$ 和 $3$。较小的指数分别是 $2$ 和 $2$，所以最大公因数是 $2^{2} \\cdot 3^{2} = 36$。不需要把 $A$ 和 $B$ 乘出来。",
          ],
          [
            "$A$ has four $2$s and two $3$s, $B$ has two $2$s and five $3$s, so both hold $2^{2} \\cdot 3^{2}$.",
            "$A$ 有四个 $2$、两个 $3$，$B$ 有两个 $2$、五个 $3$，所以两者都含 $2^{2} \\cdot 3^{2}$。",
          ],
          [
            "Take the smaller exponent, not the larger. $2^{4} \\cdot 3^{5}$ does not divide $A$.",
            "要取较小的指数，不是较大的。$2^{4} \\cdot 3^{5}$ 不能整除 $A$。",
          ],
        ],
        (rng) => {
          const [a, b] = commonPair(rng, 200, 100000);
          const g = combine(a, b, "gcf");
          const common = [...new Set(g.map(([p]) => p))];
          const larger = combine(a, b, "lcm").filter(([p]) => common.includes(p));
          const listed = common.map((p) => `$${p}$`);
          const over = g.length > 1 ? `\\left(${latex(g)}\\right)` : latex(g);
          // left is what remains of a factorization once the GCF is divided out.
          const left = (fs: Factors) => {
            const rest = fs.map(([p, e]) => [p, e - (g.find(([q]) => q === p)?.[1] ?? 0)] as const).filter(([, e]) => e > 0);
            return rest.length ? latex(rest) : "1";
          };
          return valued(
            [
              `$A = ${latex(a)}$ and $B = ${latex(b)}$. What is the greatest common factor of $A$ and $B$?`,
              `$A = ${latex(a)}$，$B = ${latex(b)}$。$A$ 和 $B$ 的最大公因数是多少？`,
            ],
            product(g),
            [
              [
                ["Find the shared primes", "找出公有的质因数"],
                common.length === 1
                  ? [`The only prime in both is ${listed[0]}.`, `两个数公有的质因数只有 ${listed[0]}。`]
                  : [`The primes in both are ${listed.join(" and ")}.`, `两个数公有的质因数是 ${listed.join(" 和 ")}。`],
              ],
              [
                ["Take the smaller exponents", "取较小的指数"],
                ["Multiply them, each with its smaller exponent:", "把它们相乘，每个取较小的指数："],
                [`${latex(g)} = ${multiplied(g)}`],
              ],
            ],
            [
              `Divide it out: $A \\div ${over} = ${left(a)}$ and $B \\div ${over} = ${left(b)}$. These share no prime, so no larger number divides both.`,
              `把它除掉：$A \\div ${over} = ${left(a)}$，$B \\div ${over} = ${left(b)}$。两者没有公有的质因数，所以没有更大的数能同时整除 $A$ 和 $B$。`,
            ],
            [
              [product(larger), "That uses the larger exponents of the shared primes.", "这是给公有质因数取了较大的指数。"],
              [common.reduce((v, p) => v * p, 1), "That drops the exponents of the shared primes.", "这是丢掉了公有质因数的指数。"],
            ],
          );
        },
        primeBars(
          [
            [
              "A",
              [
                ["2²", true],
                ["2²", false],
                ["3²", true],
                ["7", false],
              ],
            ],
            [
              "B",
              [
                ["2²", true],
                ["3²", true],
                ["3³", false],
                ["5", false],
              ],
            ],
          ],
          [
            "A and B both hold 2² and 3², shaded; the greatest common factor is 2²·3² = 36.",
            "A 和 B 都含 2² 和 3²（涂色部分）；最大公因数是 2²·3² = 36。",
          ],
        ),
      ),
      lesson(
        "the-largest-square-tile-for-a-floor",
        ["The largest square tile for a floor", "铺地面的最大正方形地砖"],
        [
          [
            "A square tile covers a rectangle exactly only if its side divides both sides of the rectangle. So the largest tile has a side equal to the GCF of the two lengths. Divide to find how many tiles fit along each side, then multiply the two counts.",
            "正方形地砖要恰好铺满长方形，它的边长必须同时整除长方形的两条边。所以最大的地砖边长等于两个长度的最大公因数。用除法求出每条边能放几块，再把两个数相乘。",
          ],
          [
            "A $12$ by $18$ floor takes tiles of side $6$: $2 \\times 3 = 6$ tiles, and $6 \\times 36 = 216 = 12 \\times 18$.",
            "$12$ 乘 $18$ 的地面用边长 $6$ 的地砖：$2 \\times 3 = 6$ 块，而 $6 \\times 36 = 216 = 12 \\times 18$。",
          ],
          [
            "Count tiles, not the side. The GCF is the side of one tile, not the number of tiles.",
            "要数地砖的块数，不是边长。最大公因数是一块地砖的边长，不是块数。",
          ],
        ],
        (rng) => {
          const g = rng.int(2, 15);
          const m = rng.int(2, 9);
          const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m && gcd(v, m) === 1));
          const w = g * m;
          const h = g * n;
          const answer = m * n;
          return valued(
            [
              `A floor measuring $${w}$ cm by $${h}$ cm is covered exactly by equal square tiles, using the largest whole-number side possible. How many tiles are needed?`,
              `一块 $${w}$ 厘米乘 $${h}$ 厘米的地面，用边长为整数且尽可能大的相同正方形地砖恰好铺满。需要多少块地砖？`,
            ],
            answer,
            [
              [
                ["Find the tile side", "求地砖边长"],
                [
                  `The side must divide both lengths, and $${m}$ and $${n}$ share no factor, so the largest side is $${g}$ cm:`,
                  `边长必须同时整除两个长度，而 $${m}$ 和 $${n}$ 没有公因数，所以最大边长是 $${g}$ 厘米：`,
                ],
                [`${w} = ${g} \\times ${m}`, `${h} = ${g} \\times ${n}`],
              ],
              [
                ["Count the tiles", "数地砖"],
                [`$${m}$ tiles fit along one side and $${n}$ along the other:`, `一条边放 $${m}$ 块，另一条边放 $${n}$ 块：`],
                [`${m} \\times ${n} = ${answer}`],
              ],
            ],
            [
              `Areas agree: $${answer} \\times ${g}^{2} = ${answer * g * g} = ${w} \\times ${h}$.`,
              `面积相符：$${answer} \\times ${g}^{2} = ${answer * g * g} = ${w} \\times ${h}$。`,
            ],
            [
              [g, "That is the side of one tile, not the number of tiles.", "这是一块地砖的边长，不是块数。"],
              [m + n, "That adds the counts along the two sides; they multiply.", "这是把两条边上的块数相加了；要相乘。"],
              [m * h, "That multiplies one count by a whole side length.", "这是用一条边的块数乘了另一条边的长度。"],
              [2 * (m + n), "That counts only the tiles around the edge.", "这是只数了边上一圈的地砖。"],
            ],
          );
        },
        areaGridFigure(
          ["6", "6"],
          ["6", "6", "6"],
          [
            ["1", "2", "3"],
            ["4", "5", "6"],
          ],
        ),
      ),
    ],
  ),
  [
    "A baker has $84$ muffins and $90$ cookies. She wants as many equal trays as she can, each with the same mix and nothing left over.",
    "面包师有 $84$ 个松饼和 $90$ 块饼干。她想装尽可能多的相同托盘，每盘搭配一样，没有剩余。",
  ],
  [
    "The number of trays is the GCF: $84 = 2^{2} \\cdot 3 \\cdot 7$ and $90 = 2 \\cdot 3^{2} \\cdot 5$ share $2 \\cdot 3 = 6$.",
    "托盘数就是最大公因数：$84 = 2^{2} \\cdot 3 \\cdot 7$ 和 $90 = 2 \\cdot 3^{2} \\cdot 5$ 公有 $2 \\cdot 3 = 6$。",
  ],
  ["find greatest common factors from prime factorizations and use them to tile a floor.", "用质因数分解求最大公因数，并用它来铺地砖。"],
);

/** findingLowestCommonMultiplesUsingPrimeFactorization multiplies all the primes with their larger exponents. */
export const findingLowestCommonMultiplesUsingPrimeFactorization = withIntro(
  topic(
    "finding-lowest-common-multiples-using-prime-factorization",
    t("Finding Lowest Common Multiples Using Prime Factorization", "用质因数分解求最小公倍数"),
    t(
      "To find the lowest common multiple of two numbers, write both prime factorizations. The LCM is the product of every prime that appears in either number, each with the larger of its two exponents.",
      "求两个数的最小公倍数，先写出它们的质因数分解。最小公倍数是在任一个数中出现的所有质因数的乘积，每个质因数取两个指数中较大的那个。",
    ),
    ["finding-greatest-common-factors-using-prime-factorization", "least-common-multiple"],
    ["6.NS.B.4"],
    [
      lesson(
        "lcm-of-two-numbers",
        ["Two numbers", "两个数"],
        [
          [
            "To find the lowest common multiple, write both prime factorizations. Then take every prime that appears in either number, each with the larger of its exponents. $18 = 2 \\cdot 3^{2}$ and $60 = 2^{2} \\cdot 3 \\cdot 5$ give $2^{2} \\cdot 3^{2} \\cdot 5 = 180$.",
            "求最小公倍数，先写出两个数的质因数分解。再把任一个数里出现的每个质因数都取上，指数取较大的那个。$18 = 2 \\cdot 3^{2}$，$60 = 2^{2} \\cdot 3 \\cdot 5$，得 $2^{2} \\cdot 3^{2} \\cdot 5 = 180$。",
          ],
          ["$180 \\div 18 = 10$ and $180 \\div 60 = 3$, both whole.", "$180 \\div 18 = 10$，$180 \\div 60 = 3$，都是整数。"],
          [
            "The product is a common multiple, but often not the lowest. $18 \\times 60 = 1{,}080$, six times the LCM.",
            "两数之积是公倍数，但往往不是最小的。$18 \\times 60 = 1{,}080$，是最小公倍数的六倍。",
          ],
        ],
        (rng) => {
          const [a, b] = commonPair(rng, 12, 200);
          const [x, y] = [product(a), product(b)];
          const l = combine(a, b, "lcm");
          const L = lcm(x, y);
          const sharedOnly = product(l.filter(([p]) => a.some(([q]) => q === p) && b.some(([q]) => q === p)));
          return valued(
            [`Find the lowest common multiple of $${x}$ and $${y}$.`, `求 $${x}$ 和 $${y}$ 的最小公倍数。`],
            L,
            [
              [
                ["Factor both numbers", "分解两个数"],
                ["Write each prime factorization:", "写出质因数分解："],
                [`${x} = ${latex(a)}`, `${y} = ${latex(b)}`],
              ],
              [
                ["Take every prime", "取所有质因数"],
                ["Keep every prime with its larger exponent:", "每个质因数取较大的指数："],
                [`${latex(l)} = ${grouped(L)}`],
              ],
            ],
            [
              `$${grouped(L)} \\div ${x} = ${L / x}$ and $${grouped(L)} \\div ${y} = ${L / y}$, both whole.`,
              `$${grouped(L)} \\div ${x} = ${L / x}$，$${grouped(L)} \\div ${y} = ${L / y}$，都是整数。`,
            ],
            [
              [x * y, "That is a common multiple, but not the lowest one.", "这是公倍数，但不是最小的。"],
              [gcd(x, y), "That is the greatest common factor, not the lowest common multiple.", "这是最大公因数，不是最小公倍数。"],
              [
                sharedOnly,
                "That keeps only the shared primes; the LCM needs every prime.",
                "这是只取了公有的质因数；最小公倍数要取所有质因数。",
              ],
            ],
          );
        },
        primeBars(
          [
            [
              "18",
              [
                ["2", false],
                ["3", false],
                ["3", false],
              ],
            ],
            [
              "60",
              [
                ["2", false],
                ["2", false],
                ["3", false],
                ["5", false],
              ],
            ],
            [
              "180",
              [
                ["2", true],
                ["2", true],
                ["3", true],
                ["3", true],
                ["5", true],
              ],
            ],
          ],
          [
            "180 holds every prime of 18 and of 60, each as often as the larger count.",
            "180 含有 18 和 60 的每个质因数，个数取较多的那个。",
          ],
        ),
      ),
      lesson(
        "lcm-of-factored-numbers",
        ["Numbers given as prime factorizations", "以质因数分解给出的数"],
        [
          [
            "When the numbers come as prime factorizations, read the LCM straight off them. For $A = 2^{3} \\cdot 5$ and $B = 2 \\cdot 3^{2} \\cdot 5^{2}$, every prime appears with its larger exponent. So the LCM is $2^{3} \\cdot 3^{2} \\cdot 5^{2} = 1{,}800$.",
            "两个数以质因数分解给出时，可以直接读出最小公倍数。对于 $A = 2^{3} \\cdot 5$ 和 $B = 2 \\cdot 3^{2} \\cdot 5^{2}$，每个质因数都要出现，并取较大的指数。所以最小公倍数是 $2^{3} \\cdot 3^{2} \\cdot 5^{2} = 1{,}800$。",
          ],
          ["$1{,}800 \\div 40 = 45$ and $1{,}800 \\div 450 = 4$.", "$1{,}800 \\div 40 = 45$，$1{,}800 \\div 450 = 4$。"],
          [
            "Include primes found in only one number. Dropping $3^{2}$ gives $200$, which $B = 450$ does not divide.",
            "只在一个数里出现的质因数也要取。漏掉 $3^{2}$ 得 $200$，而 $B = 450$ 不能整除它。",
          ],
        ],
        (rng) => {
          const [a, b] = commonPair(rng, 20, 3000);
          const l = combine(a, b, "lcm");
          const g = combine(a, b, "gcf");
          const shared = l.filter(([p]) => g.some(([q]) => q === p));
          const L = product(l);
          const primes = l.map(([p]) => `$${p}$`);
          return valued(
            [
              `$A = ${latex(a)}$ and $B = ${latex(b)}$. What is the lowest common multiple of $A$ and $B$? Give it as a number.`,
              `$A = ${latex(a)}$，$B = ${latex(b)}$。$A$ 和 $B$ 的最小公倍数是多少？写出它的值。`,
            ],
            L,
            [
              [
                ["List every prime", "列出所有质因数"],
                [`The primes of $A$ or $B$ are ${primes.join(", ")}.`, `$A$ 或 $B$ 的质因数有 ${primes.join("、")}。`],
              ],
              [
                ["Take the larger exponents", "取较大的指数"],
                ["Multiply them, each with its larger exponent:", "把它们相乘，每个取较大的指数："],
                [`${latex(l)} = ${grouped(L)}`],
              ],
            ],
            [
              `$${grouped(L)} \\div A = ${grouped(L / product(a))}$ and $${grouped(L)} \\div B = ${grouped(L / product(b))}$, both whole.`,
              `$${grouped(L)} \\div A = ${grouped(L / product(a))}$，$${grouped(L)} \\div B = ${grouped(L / product(b))}$，都是整数。`,
            ],
            [
              [
                product(shared),
                "That keeps only the shared primes; the LCM needs every prime.",
                "这是只取了公有的质因数；最小公倍数要取所有质因数。",
              ],
              [product(g), "That is the greatest common factor, not the lowest common multiple.", "这是最大公因数，不是最小公倍数。"],
              [
                product(a) * product(b),
                "That is $A$ times $B$, a common multiple but not the lowest.",
                "这是 $A$ 乘 $B$，是公倍数，但不是最小的。",
              ],
            ],
          );
        },
        primeBars(
          [
            [
              "A",
              [
                ["2³", true],
                ["5", false],
              ],
            ],
            [
              "B",
              [
                ["2", false],
                ["3²", true],
                ["5²", true],
              ],
            ],
          ],
          [
            "The larger powers, shaded, are 2³ from A and 3², 5² from B; the LCM is 2³·3²·5² = 1800.",
            "较大的幂（涂色部分）是 A 的 2³ 和 B 的 3²、5²；最小公倍数是 2³·3²·5² = 1800。",
          ],
        ),
      ),
      lesson(
        "the-other-number-from-its-gcf-and-lcm",
        ["The other number from its GCF and LCM", "由最大公因数和最小公倍数求另一个数"],
        [
          [
            "For two positive whole numbers, the GCF times the LCM equals the product of the numbers. Each prime's smaller power goes into the GCF and its larger power into the LCM, so together they use every factor once. So the product of the GCF and the LCM, divided by one number, gives the other.",
            "对两个正整数，最大公因数乘以最小公倍数等于这两个数的积。每个质数较小的幂进入最大公因数，较大的幂进入最小公倍数，合起来每个因数恰好用一次。所以用最大公因数与最小公倍数的积除以其中一个数，就得到另一个数。",
          ],
          [
            "$12$ and $18$ have GCF $6$ and LCM $36$, and $6 \\times 36 = 216 = 12 \\times 18$.",
            "$12$ 和 $18$ 的最大公因数是 $6$，最小公倍数是 $36$，而 $6 \\times 36 = 216 = 12 \\times 18$。",
          ],
          [
            "Divide the product by the known number. Dividing the LCM by the GCF gives $36 \\div 6 = 6$, which is not the other number.",
            "要用积除以已知的数。用最小公倍数除以最大公因数得 $36 \\div 6 = 6$，这不是另一个数。",
          ],
        ],
        (rng) => {
          const g = rng.int(2, 12);
          const m = rng.int(2, 9);
          const n = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== m && gcd(v, m) === 1));
          const a = g * m;
          const answer = g * n;
          const multiple = g * m * n;
          return valued(
            [
              `Two numbers have a greatest common factor of $${g}$ and a lowest common multiple of $${multiple}$. One of the numbers is $${a}$. What is the other?`,
              `两个数的最大公因数是 $${g}$，最小公倍数是 $${multiple}$。其中一个数是 $${a}$。另一个数是多少？`,
            ],
            answer,
            [
              [
                ["Multiply the GCF and LCM", "最大公因数乘最小公倍数"],
                ["Their product equals the product of the two numbers:", "它们的积等于两个数的积："],
                [`${g} \\times ${multiple} = ${g * multiple}`],
              ],
              [
                ["Divide by the known number", "除以已知的数"],
                ["The other number is what is left:", "剩下的就是另一个数："],
                [`${g * multiple} \\div ${a} = ${answer}`],
              ],
            ],
            [
              `$${a} = ${g} \\times ${m}$ and $${answer} = ${g} \\times ${n}$ have GCF $${g}$ and LCM $${g} \\times ${m} \\times ${n} = ${multiple}$.`,
              `$${a} = ${g} \\times ${m}$ 和 $${answer} = ${g} \\times ${n}$ 的最大公因数是 $${g}$，最小公倍数是 $${g} \\times ${m} \\times ${n} = ${multiple}$。`,
            ],
            [
              [n, "That is the other number divided by the GCF.", "这是另一个数除以最大公因数的结果。"],
              [multiple - a, "That subtracts the known number from the LCM.", "这是用最小公倍数减去了已知的数。"],
              [multiple / g, "That divides the LCM by the GCF.", "这是用最小公倍数除以了最大公因数。"],
            ],
          );
        },
        tapeFigure(
          [
            { total: "216", pieces: [{ size: 1, text: "6 × 36" }] },
            { total: "216", pieces: [{ size: 1, text: "12 × 18", lit: true }] },
          ],
          [
            "The GCF times the LCM of 12 and 18, 6 × 36, equals 12 × 18: both are 216.",
            "12 和 18 的最大公因数乘最小公倍数 6 × 36，等于 12 × 18：都是 216。",
          ],
        ),
      ),
    ],
  ),
  [
    "One bus leaves every $18$ minutes and another every $60$ minutes. They leave together at $8{:}00$. When do they next leave together?",
    "一路公交车每 $18$ 分钟发一班，另一路每 $60$ 分钟发一班。它们在 $8{:}00$ 同时发车。下一次同时发车是什么时候？",
  ],
  [
    "The wait is the LCM, $2^{2} \\cdot 3^{2} \\cdot 5 = 180$ minutes, so they meet again at $11{:}00$.",
    "等待的时间是最小公倍数 $2^{2} \\cdot 3^{2} \\cdot 5 = 180$ 分钟，所以 $11{:}00$ 再次同时发车。",
  ],
  [
    "find lowest common multiples from prime factorizations and link them with the GCF.",
    "用质因数分解求最小公倍数，并把它和最大公因数联系起来。",
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

/** theMissingDigitForDivisibilityBy4 finds the smallest digit that makes a number divisible by 4; it is the third point of divisibility-of-integers-by-2-5-10-4-and-8, to take the place of the one in the deeper files. */
export const theMissingDigitForDivisibilityBy4 = lesson(
  "the-missing-digit-for-divisibility-by-4",
  ["The missing digit for divisibility by 4", "能被 4 整除时缺少的数字"],
  [
    [
      "Only the last two digits decide whether a number divides by $4$, since every multiple of $100$ does. So try the digits in order until the last two digits form a multiple of $4$. For $57\\square2$: $02$ is not a multiple of $4$, but $12 = 4 \\cdot 3$ is, so the digit is $1$.",
      "能否被 $4$ 整除只看最后两位，因为 $100$ 的倍数都能被 $4$ 整除。所以依次试数字，直到最后两位是 $4$ 的倍数。对 $57\\square2$：$02$ 不是 $4$ 的倍数，$12 = 4 \\cdot 3$ 是，所以这个数字是 $1$。",
    ],
    ["Divide: $5{,}712 = 4 \\times 1{,}428$.", "做除法：$5{,}712 = 4 \\times 1{,}428$。"],
    [
      "The digit in the tens place changes the last two digits by tens, so it matters; copying the ones digit does not help.",
      "十位上的数字以十为单位改变末两位，所以它很重要；照抄个位数字没有用。",
    ],
  ],
  (rng) => {
    const head = rng.int(10, 99);
    const u = rng.pick([0, 2, 4, 6, 8]);
    let d = 0;
    while ((10 * d + u) % 4 !== 0) d += 1;
    const n = head * 100 + 10 * d + u;
    const tried = Array.from({ length: d + 1 }, (_, i) => {
      const v = 10 * i + u;
      return `${`${v}`.padStart(2, "0")} = 4 \\cdot ${Math.floor(v / 4)}${v % 4 === 0 ? "" : ` + ${v % 4}`}`;
    });
    return valued(
      [
        `What is the smallest digit that can go in the box so that the number divides by $4$? $$${head}\\square${u}$$`,
        `方框里填什么最小的数字，才能使这个数被 $4$ 整除？$$${head}\\square${u}$$`,
      ],
      d,
      [
        [
          ["Look at the last two digits", "看末两位"],
          ["$100$ is a multiple of $4$, so only the box and the last digit decide.", "$100$ 是 $4$ 的倍数，所以只看方框和末位数字。"],
        ],
        [
          ["Try the digits in order", "依次试数字"],
          ["Start from $0$ and stop at the first multiple of $4$:", "从 $0$ 开始，试到第一个 $4$ 的倍数为止："],
          tried,
        ],
      ],
      divided(n, 4),
      [
        [
          d + 1,
          `That makes the last two digits $${10 * (d + 1) + u}$, which is not a multiple of $4$.`,
          `这样末两位是 $${10 * (d + 1) + u}$，不是 $4$ 的倍数。`,
        ],
        [d + 2, "That digit works, but a smaller one does too.", "这个数字也行，但还有更小的。"],
        [
          u,
          "That copies the last digit; the tens digit is what changes the last two digits.",
          "这是照抄了末位数字；改变末两位的是十位数字。",
        ],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "5712",
        pieces: [
          { size: 6, text: "5700 = 100 · 57" },
          { size: 1, text: "12", lit: true },
        ],
      },
    ],
    [
      "5712 is 5700 + 12: 5700 is a multiple of 4, so the digit in the box only has to make 12.",
      "5712 是 5700 + 12：5700 是 4 的倍数，所以方框里的数字只需让末两位成为 12。",
    ],
  ),
);

/** theNumberFromItsPrimeFactors multiplies out a prime factorization; it is the third point of prime-factors, to take the place of the one in the deeper files. */
export const theNumberFromItsPrimeFactors = lesson(
  "the-number-from-its-prime-factors",
  ["The number from its prime factors", "由质因数还原这个数"],
  [
    [
      "A prime factorization names exactly one number, so multiplying the powers together recovers it. Each exponent says how many times its prime is used, and it is not a multiplier: $2^{3} \\cdot 5 = 8 \\cdot 5 = 40$.",
      "质因数分解对应唯一的数，所以把各个幂相乘就能还原。指数表示质数用了几次，不是乘数：$2^{3} \\cdot 5 = 8 \\cdot 5 = 40$。",
    ],
    [
      "Divide back by primes: $40 \\div 2 = 20$, $20 \\div 2 = 10$, $10 \\div 2 = 5$, three $2$s and a $5$.",
      "用质数除回去：$40 \\div 2 = 20$，$20 \\div 2 = 10$，$10 \\div 2 = 5$，三个 $2$ 和一个 $5$。",
    ],
    ["$2^{3}$ is $8$, not $2 \\cdot 3 = 6$.", "$2^{3}$ 是 $8$，不是 $2 \\cdot 3 = 6$。"],
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const b = rng.int(0, 3);
    const c = rng.int(1, 2);
    const q = rng.pick([5, 7, 11]);
    const n = 2 ** a * 3 ** b * q ** c;
    const fs: Factors = [[2, a], ...(b > 0 ? ([[3, b]] as const) : []), [q, c]];
    const powers = fs.map(([p, e]) => `${p ** e}`);
    return valued(
      [`What number has the prime factorization $${latex(fs)}$?`, `质因数分解为 $${latex(fs)}$ 的数是多少？`],
      n,
      [
        [
          ["Work out each power", "算出每个幂"],
          ["Each exponent says how many times its prime is used:", "指数表示这个质数用了几次："],
          fs.map(([p, e]) => `${p}^{${e}} = ${p ** e}`),
        ],
        [["Multiply", "相乘"], ["Multiply the powers together:", "把各个幂相乘："], [`${powers.join(" \\cdot ")} = ${grouped(n)}`]],
      ],
      [
        `Divide back by primes, starting with the smallest:${steps(...divisions(n))}That uses each prime as often as its exponent says.`,
        `用质数从小到大除回去：${steps(...divisions(n))}每个质数用的次数正好等于它的指数。`,
      ],
      [
        [
          fs.reduce((v, [p, e]) => v * p * e, 1),
          "That multiplies each prime by its exponent instead of raising it to that power.",
          "这是把每个质数乘以指数，而不是求它的幂。",
        ],
        [fs.reduce((v, [p, e]) => v + p ** e, 0), "That adds the powers instead of multiplying them.", "这是把各个幂相加了，而不是相乘。"],
        [fs.reduce((v, [p]) => v * p, 1), "That ignores the exponents.", "这是忽略了指数。"],
      ],
    );
  },
  factorTape(
    [
      ["2", 3],
      ["5", 1],
    ],
    "40",
    ["Three 2s and one 5 multiply to 40.", "三个 2 和一个 5 相乘得 40。"],
  ),
);
