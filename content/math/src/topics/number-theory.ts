import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { factorizationLatex, gcd, isPrime, lcm, primeFactors } from "@ga/subject-math";

import { factorizationProblem } from "../problems.ts";
import { type Pair, picked, pickedMath, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import { answered, digitsChart, type Miss, point, tapeFigure } from "./upper-grades-kit.ts";

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

/** yes and no are the two answers of a yes-or-no question. */
const yes: Pair = ["Yes", "能"];
const no: Pair = ["No", "不能"];

/** cutBars draws bars of n, each cut into equal parts, one bar for each count in `counts`. */
const cutBars = (n: number, counts: readonly number[]): Figure =>
  tapeFigure(
    counts.map((k) => ({ pieces: Array.from({ length: k }, () => ({ size: 1 / k, text: String(n / k) })) })),
    [`Bars of ${n}, cut into ${counts.join(", ")} equal parts.`, `几个长 ${n} 的长条，分别平均分成 ${counts.join("、")} 份。`],
  );

/** sharedBars draws a and b each cut into g equal parts. */
const sharedBars = (a: number, b: number, g: number): Figure =>
  tapeFigure(
    [
      { total: String(a), pieces: Array.from({ length: Math.min(g, 12) }, () => ({ size: a / g, text: String(a / g) })) },
      { total: String(b), pieces: Array.from({ length: Math.min(g, 12) }, () => ({ size: b / g, text: String(b / g) })) },
    ],
    [`Bars of ${a} and ${b}, each cut into ${g} equal parts.`, `长条 ${a} 和 ${b}，各平均分成 ${g} 份。`],
  );

/** meetBars draws two bars of length m, cut into pieces of a and of b. */
const meetBars = (a: number, b: number, m: number): Figure =>
  tapeFigure(
    [
      { total: String(m), pieces: Array.from({ length: m / a }, () => ({ size: a, text: String(a) })) },
      { pieces: Array.from({ length: m / b }, () => ({ size: b, text: String(b) })) },
    ],
    [
      `Two bars of ${m}, one cut into pieces of ${a}, the other into pieces of ${b}.`,
      `两个长 ${m} 的长条，一个分成每段 ${a}，另一个分成每段 ${b}。`,
    ],
  );

/** smallestFactor is the smallest prime factor of a composite n. */
const smallestFactor = (n: number): number => primeFactors(n)[0]![0];

export const divisibilityRules: TopicDef = {
  id: "divisibility-rules",
  title: t("Divisibility Rules", "整除的判定"),
  summary: t(
    "Tell whether a whole number is divisible by 2, 3, 4, 5, 6, 9 or 10 without dividing.",
    "不做除法，判断一个整数能否被 2、3、4、5、6、9 或 10 整除。",
  ),
  intro: t(
    "Can 135 stickers go into packs of 5 with none left? Look at the last digit. It is 5, so yes: $135 \\div 5 = 27$.\n\nCheck: $27 \\times 5 = 135$.\n\nIn this lesson we tell whether a number divides by 2, 3, 4, 5, 6, 9 or 10 without dividing.",
    "135 张贴纸能每 5 张一包、正好分完吗？看个位，是 5，所以能：$135 \\div 5 = 27$。\n\n检验：$27 \\times 5 = 135$。\n\n本课我们不用做除法，就判断一个数能否被 2、3、4、5、6、9、10 整除。",
  ),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "divisible-by-2-5-10",
      ["Divisibility by 2, 5 and 10", "被 2、5、10 整除"],
      [
        "Look only at the last digit. A number divides by 2 if it ends in 0, 2, 4, 6 or 8. It divides by 5 if it ends in 0 or 5. It divides by 10 if it ends in 0. So 340 divides by all three.\n\nCheck: $340 \\div 10 = 34$.\n\n> **Watch out.** A number ending in 5 divides by 5 but not by 10.",
        "只看个位。个位是 0、2、4、6、8 的数能被 2 整除；个位是 0 或 5 的数能被 5 整除；个位是 0 的数能被 10 整除。所以 340 能被这三个数整除。\n\n检验：$340 \\div 10 = 34$。\n\n> **注意。** 个位是 5 的数能被 5 整除，但不能被 10 整除。",
      ],
      (rng) => {
        const d = rng.pick([2, 5, 10]);
        const n = rng.bool() ? d * rng.int(11, 999) : rng.int(101, 9999);
        const ok = n % d === 0;
        const last = n % 10;
        const rule: Pair = d === 2 ? ["0, 2, 4, 6 or 8", "0、2、4、6、8"] : d === 5 ? ["0 or 5", "0 或 5"] : ["0", "0"];
        return picked(
          rng,
          [`Is $${n}$ divisible by $${d}$?`, `$${n}$ 能被 $${d}$ 整除吗？`],
          ok ? yes : no,
          [
            ok
              ? [
                  no,
                  `It ends in ${last}, and numbers ending in ${rule[0]} divide by ${d}.`,
                  `个位是 ${last}，个位是 ${rule[1]} 的数能被 ${d} 整除。`,
                ]
              : [
                  yes,
                  `It ends in ${last}. Only numbers ending in ${rule[0]} divide by ${d}.`,
                  `个位是 ${last}，只有个位是 ${rule[1]} 的数才能被 ${d} 整除。`,
                ],
          ],
          [
            [
              ["Read the last digit", "看个位"],
              [`The last digit is ${last}.`, `个位是 ${last}。`],
            ],
            [
              ["Use the rule", "用规则"],
              ok
                ? [`${last} is one of ${rule[0]}, so yes.`, `${last} 属于 ${rule[1]}，所以能。`]
                : [`${last} is not one of ${rule[0]}, so no.`, `${last} 不属于 ${rule[1]}，所以不能。`],
            ],
          ],
          ok
            ? [`$${n} \\div ${d} = ${n / d}$.`, `$${n} \\div ${d} = ${n / d}$。`]
            : [`$${n} \\div ${d} = ${Math.floor(n / d)}$ R ${n % d}.`, `$${n} \\div ${d} = ${Math.floor(n / d)}$ 余 ${n % d}。`],
          digitsChart([n], String(n).length - 1),
        );
      },
      digitsChart([340], 2),
    ),
    point(
      "divisible-by-3-4-6-9",
      ["Divisibility by 3, 4, 6 and 9", "被 3、4、6、9 整除"],
      [
        "For 3 or 9, add the digits. 738: $7 + 3 + 8 = 18$, and 18 divides by 3 and 9, so 738 does too. For 4, look at the last two digits. For 6, the number must be even and divide by 3.\n\nCheck: $738 \\div 9 = 82$.\n\n> **Watch out.** For 4, the last digit alone is not enough. 34 is even, but 4 does not go into 34.",
        "判断 3 或 9：把各位数字相加。738：$7 + 3 + 8 = 18$，18 能被 3 和 9 整除，所以 738 也能。判断 4：看末两位。判断 6：既要是偶数，又要能被 3 整除。\n\n检验：$738 \\div 9 = 82$。\n\n> **注意。** 判断 4 只看个位不够。34 是偶数，但不能被 4 整除。",
      ],
      (rng) => {
        const d = rng.pick([3, 4, 6, 9]);
        const n = rng.bool() ? d * rng.int(12, 1111) : rng.int(102, 9999);
        const ok = n % d === 0;
        const s = [...String(n)].reduce((a, c) => a + Number(c), 0);
        const two = n % 100;
        const read: Walk =
          d === 4
            ? [
                ["Read the last two digits", "看末两位"],
                [`The last two digits make ${two}.`, `末两位是 ${two}。`],
              ]
            : [["Add the digits", "各位相加"], ["", ""], [`${[...String(n)].join(" + ")} = ${s}`]];
        const judge: Pair =
          d === 4
            ? [`${two} is ${two % 4 ? "not " : ""}a multiple of 4.`, `${two} ${two % 4 ? "不" : ""}是 4 的倍数。`]
            : d === 6
              ? [
                  `${n} is ${n % 2 ? "odd" : "even"}, and ${s} is ${s % 3 ? "not " : ""}a multiple of 3. Both are needed.`,
                  `${n} 是${n % 2 ? "奇" : "偶"}数，${s} ${s % 3 ? "不" : ""}是 3 的倍数。两条都要满足。`,
                ]
              : [`${s} is ${s % d ? "not " : ""}a multiple of ${d}.`, `${s} ${s % d ? "不" : ""}是 ${d} 的倍数。`];
        return picked(
          rng,
          [`Is $${n}$ divisible by $${d}$?`, `$${n}$ 能被 $${d}$ 整除吗？`],
          ok ? yes : no,
          [ok ? [no, judge[0], judge[1]] : [yes, judge[0], judge[1]]],
          [read, [["Use the rule", "用规则"], judge]],
          ok
            ? [`$${n} \\div ${d} = ${n / d}$.`, `$${n} \\div ${d} = ${n / d}$。`]
            : [`$${n} \\div ${d} = ${Math.floor(n / d)}$ R ${n % d}.`, `$${n} \\div ${d} = ${Math.floor(n / d)}$ 余 ${n % d}。`],
          digitsChart([n]),
        );
      },
      digitsChart([738]),
    ),
  ],
};

export const primeAndCompositeNumbers: TopicDef = {
  id: "prime-and-composite-numbers",
  title: t("Prime and Composite Numbers", "质数与合数"),
  summary: t("Tell primes from composite numbers by looking for factors.", "通过寻找因数区分质数与合数。"),
  intro: t(
    "Can 13 chairs be set in equal rows of more than one? Rows of 2, 3, 4… never work. Only 1 row of 13, or 13 rows of 1. So 13 is a prime number. 12 can be 2 rows of 6, so 12 is composite.\n\nCheck: the factors of 13 are only 1 and 13.\n\nIn this lesson we tell primes from composite numbers.",
    "13 把椅子能摆成几排、每排同样多（不止一排）吗？每排 2、3、4……都不行，只能 1 排 13 把，或 13 排各 1 把。所以 13 是质数。12 可以摆成 2 排各 6 把，所以 12 是合数。\n\n检验：13 的因数只有 1 和 13。\n\n本课我们区分质数和合数。",
  ),
  prerequisites: ["divisibility-rules"],
  encompasses: [{ topic: "divisibility-rules", weight: 0.4 }],
  xp: 8,
  standards: ["CCSS.4.OA.B.4"],
  knowledgePoints: [
    point(
      "identifying-primes",
      ["Identifying primes", "判断质数"],
      [
        "A prime has exactly two factors, 1 and itself. A composite number has more. 0 and 1 are neither. 21 is composite, because $21 = 3 \\times 7$.\n\nCheck: 23 does not divide by 2, 3 or any number up to 4, so 23 is prime.\n\n> **Watch out.** 1 is not a prime. It has only one factor.",
        "质数正好有两个因数：1 和它本身。合数的因数多于两个。0 和 1 既不是质数也不是合数。21 是合数，因为 $21 = 3 \\times 7$。\n\n检验：23 不能被 2、3、4 整除，所以 23 是质数。\n\n> **注意。** 1 不是质数，它只有一个因数。",
      ],
      (rng) => {
        const n = rng.bool(0.08) ? rng.pick([0, 1]) : rng.int(2, 150);
        const kind = n < 2 ? 2 : isPrime(n) ? 0 : 1;
        const names: Pair[] = [
          ["Prime", "质数"],
          ["Composite", "合数"],
          ["Neither", "都不是"],
        ];
        const p = kind === 1 ? smallestFactor(n) : 0;
        const whyNot: Record<number, Pair> =
          kind === 0
            ? {
                1: [`${n} has no factor but 1 and ${n}.`, `${n} 除了 1 和它本身没有别的因数。`],
                2: ["Only 0 and 1 are neither.", "只有 0 和 1 两个都不是。"],
              }
            : kind === 1
              ? {
                  0: [`$${n} = ${p} \\times ${n / p}$, so it has more than two factors.`, `$${n} = ${p} \\times ${n / p}$，因数多于两个。`],
                  2: ["Only 0 and 1 are neither.", "只有 0 和 1 两个都不是。"],
                }
              : {
                  0: [`A prime has two factors, but ${n} does not.`, `质数有两个因数，${n} 没有。`],
                  1: [`A composite number is greater than 1.`, "合数都大于 1。"],
                };
        return picked(
          rng,
          [`Is $${n}$ prime, composite, or neither?`, `$${n}$ 是质数、合数，还是都不是？`],
          names[kind]!,
          [0, 1, 2].filter((k) => k !== kind).map((k) => [names[k]!, whyNot[k]![0], whyNot[k]![1]] as [Pair, string, string]),
          [
            [
              ["Look for factors", "找因数"],
              kind === 1
                ? [`${p} goes into ${n}.`, `${p} 能整除 ${n}。`]
                : kind === 0
                  ? [
                      `Nothing from 2 up to ${Math.floor(Math.sqrt(n))} goes into ${n}.`,
                      `从 2 到 ${Math.floor(Math.sqrt(n))} 都不能整除 ${n}。`,
                    ]
                  : [`${n} is less than 2.`, `${n} 小于 2。`],
            ],
            [
              ["Decide", "判断"],
              [
                `So ${n} is ${names[kind]![0].toLowerCase()}.`,
                `所以 ${n} ${kind === 2 ? "既不是质数也不是合数" : `是${names[kind]![1]}`}。`,
              ],
            ],
          ],
          kind === 1
            ? [`$${p} \\times ${n / p} = ${n}$.`, `$${p} \\times ${n / p} = ${n}$。`]
            : kind === 0
              ? [`The factors of ${n} are 1 and ${n} only.`, `${n} 的因数只有 1 和 ${n}。`]
              : [
                  `${n} has ${n === 1 ? "one factor" : "every number as a factor"}, not two.`,
                  `${n} ${n === 1 ? "只有一个因数" : "的因数有无数个"}，不是两个。`,
                ],
          kind === 1 ? cutBars(n, [p]) : digitsChart([n]),
        );
      },
      cutBars(21, [3, 7]),
    ),
    point(
      "spotting-the-prime",
      ["Spotting the prime among odd numbers", "在奇数中找出质数"],
      [
        "Odd numbers can still be composite. Among 51, 57, 59 and 91: $51 = 3 \\times 17$, $57 = 3 \\times 19$ and $91 = 7 \\times 13$. Only 59 is prime.\n\nCheck: 59 does not divide by 2, 3, 5 or 7.\n\n> **Watch out.** Test 3 and 7. They hide in numbers like 57 and 91.",
        "奇数也可能是合数。在 51、57、59、91 中：$51 = 3 \\times 17$，$57 = 3 \\times 19$，$91 = 7 \\times 13$。只有 59 是质数。\n\n检验：59 不能被 2、3、5、7 整除。\n\n> **注意。** 要试 3 和 7，它们常藏在 57、91 这样的数里。",
      ],
      (rng) => {
        const range = Array.from({ length: 170 }, (_, i) => i + 30).filter((n) => n % 2 !== 0 && n % 5 !== 0);
        const prime = rng.pick(range.filter(isPrime));
        const fakes = rng.sample(
          range.filter((n) => !isPrime(n)),
          3,
        );
        return pickedMath(
          rng,
          [`Which of these numbers is prime?`, `下面哪个数是质数？`],
          String(prime),
          fakes.map((n): [string, string, string] => [
            String(n),
            `$${n} = ${smallestFactor(n)} \\times ${n / smallestFactor(n)}$.`,
            `$${n} = ${smallestFactor(n)} \\times ${n / smallestFactor(n)}$。`,
          ]),
          [
            [["Test each number", "逐个检验"], ["", ""], fakes.map((n) => `${n} = ${smallestFactor(n)} \\times ${n / smallestFactor(n)}`)],
            [
              ["Find the one left", "找剩下的"],
              [`${prime} has no factor but 1 and itself.`, `${prime} 除了 1 和它本身没有别的因数。`],
            ],
          ],
          [`Try 3, 7, 11 and 13 on ${prime}: none goes in evenly.`, `用 3、7、11、13 去除 ${prime}，都除不尽。`],
          cutBars(fakes[0]!, [smallestFactor(fakes[0]!)]),
        );
      },
      cutBars(91, [7]),
    ),
  ],
};

export const primeFactorization: TopicDef = {
  id: "prime-factorization",
  title: t("Prime Factorization", "分解质因数"),
  summary: t("Write a whole number as a product of primes using a factor tree.", "用因数树把整数写成质数的乘积。"),
  intro: t(
    "Break 60 into factors until every piece is prime: $60 = 2 \\times 30$, $30 = 2 \\times 15$, $15 = 3 \\times 5$. So $60 = 2 \\times 2 \\times 3 \\times 5 = 2^2 \\times 3 \\times 5$.\n\nCheck: $4 \\times 3 \\times 5 = 60$.\n\nIn this lesson we write a number as a product of primes with a factor tree.",
    "把 60 不断分解，直到每个因数都是质数：$60 = 2 \\times 30$，$30 = 2 \\times 15$，$15 = 3 \\times 5$。所以 $60 = 2 \\times 2 \\times 3 \\times 5 = 2^2 \\times 3 \\times 5$。\n\n检验：$4 \\times 3 \\times 5 = 60$。\n\n本课我们用因数树把一个数写成质数的乘积。",
  ),
  prerequisites: ["prime-and-composite-numbers"],
  encompasses: [
    { topic: "prime-and-composite-numbers", weight: 0.5 },
    { topic: "divisibility-rules", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.6.NS.B.4"],
  knowledgePoints: [
    point(
      "factor-trees",
      ["Factor trees", "因数树"],
      [
        "Divide by the smallest prime again and again. $84 \\div 2 = 42$, $42 \\div 2 = 21$, $21 \\div 3 = 7$. So $84 = 2^2 \\times 3 \\times 7$.\n\nCheck: $4 \\times 3 \\times 7 = 84$.\n\n> **Watch out.** Do not stop at a composite factor. $84 = 2 \\times 42$ is not finished.",
        "反复用最小的质数去除。$84 \\div 2 = 42$，$42 \\div 2 = 21$，$21 \\div 3 = 7$。所以 $84 = 2^2 \\times 3 \\times 7$。\n\n检验：$4 \\times 3 \\times 7 = 84$。\n\n> **注意。** 不能停在合数上，$84 = 2 \\times 42$ 还没分完。",
      ],
      (rng) => {
        const n = composite(rng, 12, 400);
        const fs = primeFactors(n);
        const [p] = fs[0]!;
        const answer = factorizationLatex(fs);
        return factorizationProblem({
          prompt: t(`Write the prime factorization of $${n}$.`, `把 $${n}$ 分解质因数。`),
          value: n,
          wrong: [`${p} \\cdot ${n / p}`, factorizationLatex(fs.map(([q]) => [q, 1]))],
          solution: walkThrough(
            [
              [["Divide by primes", "用质数去除"], ["", ""], divisions(n)],
              [["Collect the primes", "写出质数的积"], ["", ""], [`${n} = ${answer}`]],
            ],
            [`Multiply back: $${answer} = ${n}$.`, `乘回去：$${answer} = ${n}$。`],
          ),
        });
      },
      cutBars(84, [2, 4, 12]),
    ),
    point(
      "exponents-in-a-factorization",
      ["Reading exponents and prime factors", "读出指数与质因数"],
      [
        "In $360 = 2^3 \\times 3^2 \\times 5$, the exponent of 2 is 3, because 2 appears three times. The largest prime factor is 5. There are 3 different primes.\n\nCheck: $8 \\times 9 \\times 5 = 360$.\n\n> **Watch out.** A prime with no exponent written has exponent 1.",
        "在 $360 = 2^3 \\times 3^2 \\times 5$ 中，2 的指数是 3，因为 2 出现了三次。最大的质因数是 5，一共有 3 个不同的质因数。\n\n检验：$8 \\times 9 \\times 5 = 360$。\n\n> **注意。** 没写指数的质数，指数是 1。",
      ],
      (rng) => {
        for (;;) {
          const n = 2 ** rng.int(0, 5) * 3 ** rng.int(0, 3) * 5 ** rng.int(0, 2) * rng.pick([1, 1, 7, 11, 13]);
          if (n < 40 || n > 2000) continue;
          const fs = primeFactors(n);
          if (fs.length < 2) continue;
          const kind = rng.int(0, 2);
          const p = rng.pick(fs.map(([q]) => q));
          const exp = fs.find(([q]) => q === p)![1];
          const largest = fs[fs.length - 1]![0];
          const total = fs.reduce((s, [, e]) => s + e, 0);
          const line = `${n} = ${factorizationLatex(fs)}`;
          const asks: Pair[] = [
            [`What is the exponent of $${p}$ in the prime factorization of $${n}$?`, `$${n}$ 的质因数分解中，$${p}$ 的指数是多少？`],
            [`What is the largest prime factor of $${n}$?`, `$${n}$ 的最大质因数是多少？`],
            [`How many different prime factors does $${n}$ have?`, `$${n}$ 有几个不同的质因数？`],
          ];
          const reads: Pair[] = [
            [`${p} appears ${exp} time${exp > 1 ? "s" : ""}.`, `${p} 出现了 ${exp} 次。`],
            [
              `The primes are ${fs.map(([q]) => q).join(", ")}. The largest is ${largest}.`,
              `质因数是 ${fs.map(([q]) => q).join("、")}，最大的是 ${largest}。`,
            ],
            [
              `The different primes are ${fs.map(([q]) => q).join(", ")}: ${fs.length} of them.`,
              `不同的质因数是 ${fs.map(([q]) => q).join("、")}，共 ${fs.length} 个。`,
            ],
          ];
          const misses: Miss[][] = [
            [
              [exp + 1, "That counts one too many.", "这多数了一次。"],
              [p, "That is the prime, not its exponent.", "这是质数本身，不是指数。"],
              [p ** exp, "That is the power, not the exponent.", "这是幂的值，不是指数。"],
            ],
            [
              [n / largest, "That is a factor, but not a prime.", "这是因数，但不是质数。"],
              [fs[0]![0], "That is the smallest prime factor.", "这是最小的质因数。"],
              [n, "That is the number itself.", "这是这个数本身。"],
            ],
            [
              [total, "That counts repeated primes again.", "这把重复的质数也数进去了。"],
              [fs.length + 1, "That counts 1, which is not a prime.", "这把 1 也数进去了，1 不是质数。"],
              [largest, "That is the largest prime, not how many.", "这是最大的质数，不是个数。"],
            ],
          ];
          const answer = [exp, largest, fs.length][kind]!;
          return answered(
            asks[kind]!,
            answer,
            [
              [["Factor", "分解"], ["", ""], [line]],
              [["Read it", "读出来"], reads[kind]!],
            ],
            [`Multiply back to check: $${factorizationLatex(fs)} = ${n}$.`, `乘回去检验：$${factorizationLatex(fs)} = ${n}$。`],
            misses[kind]!,
          );
        }
      },
      cutBars(360, [2, 8, 40]),
    ),
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
  intro: t(
    "A baker has 24 rolls and 36 buns to pack into identical boxes, as many boxes as possible. $24 = 2^3 \\times 3$ and $36 = 2^2 \\times 3^2$. They share $2^2 \\times 3 = 12$. So 12 boxes.\n\nCheck: $24 \\div 12 = 2$ and $36 \\div 12 = 3$.\n\nIn this lesson we find the greatest common factor from prime factorizations.",
    "面包师有 24 个面包卷和 36 个小面包，要装进相同的盒子，盒子尽量多。$24 = 2^3 \\times 3$，$36 = 2^2 \\times 3^2$，公共部分是 $2^2 \\times 3 = 12$。所以装 12 盒。\n\n检验：$24 \\div 12 = 2$，$36 \\div 12 = 3$。\n\n本课我们用质因数分解求最大公因数。",
  ),
  prerequisites: ["prime-factorization"],
  encompasses: [{ topic: "prime-factorization", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.6.NS.B.4"],
  knowledgePoints: [
    point(
      "gcf-from-factorizations",
      ["Using prime factorizations", "利用质因数分解"],
      [
        "Factor both numbers. Take each prime they share, with the smaller exponent. $24 = 2^3 \\times 3$ and $36 = 2^2 \\times 3^2$, so the greatest common factor is $2^2 \\times 3 = 12$.\n\nCheck: 12 divides both, and $24 \\div 12 = 2$, $36 \\div 12 = 3$ share no factor.\n\n> **Watch out.** Use the smaller exponent, not the larger.",
        "先把两个数分解质因数，取共有的质数，指数取较小的。$24 = 2^3 \\times 3$，$36 = 2^2 \\times 3^2$，所以最大公因数是 $2^2 \\times 3 = 12$。\n\n检验：12 能整除这两个数，商 2 和 3 没有公因数。\n\n> **注意。** 指数要取较小的，不是较大的。",
      ],
      (rng) => {
        const [a, b] = pair(rng);
        const g = gcd(a, b);
        return answered(
          [`Find the greatest common factor of $${a}$ and $${b}$.`, `求 $${a}$ 和 $${b}$ 的最大公因数。`],
          g,
          [
            [
              ["Factor both", "分解两个数"],
              ["", ""],
              [factorLine(a), factorLine(b)],
            ],
            [
              ["Take shared primes", "取共有的质数"],
              ["Use each shared prime with the smaller exponent.", "每个共有的质数取较小的指数。"],
              [g === 1 || isPrime(g) ? String(g) : `${factorizationLatex(primeFactors(g))} = ${g}`],
            ],
          ],
          [
            `$${a} \\div ${g} = ${a / g}$ and $${b} \\div ${g} = ${b / g}$, which share no factor but 1.`,
            `$${a} \\div ${g} = ${a / g}$，$${b} \\div ${g} = ${b / g}$，这两个商只有公因数 1。`,
          ],
          [
            [lcm(a, b), "That is the least common multiple.", "这是最小公倍数。"],
            [a * b, "That multiplies the numbers.", "这是两数相乘。"],
            [isPrime(g) ? 1 : smallestFactor(g), "That is a common factor, but not the greatest.", "这是公因数，但不是最大的。"],
          ],
          { figure: sharedBars(a, b, g) },
        );
      },
      sharedBars(24, 36, 12),
    ),
    point(
      "gcf-in-word-problems",
      ["Equal groups with nothing left over", "均分且没有剩余"],
      [
        "Share 18 apples and 30 oranges into identical bags, as many as possible. The number of bags must divide 18 and 30. The greatest common factor is 6, so 6 bags, each with 3 apples and 5 oranges.\n\nCheck: $6 \\times 3 = 18$ and $6 \\times 5 = 30$.\n\n> **Watch out.** Read whether the question asks for the number of bags or what is in each bag.",
        "把 18 个苹果和 30 个橙子装进相同的袋子，袋子尽量多。袋数要同时整除 18 和 30，最大公因数是 6，所以装 6 袋，每袋 3 个苹果、5 个橙子。\n\n检验：$6 \\times 3 = 18$，$6 \\times 5 = 30$。\n\n> **注意。** 看清问的是袋数，还是每袋有几个。",
      ],
      (rng) => {
        const [a, b] = pair(rng);
        const g = gcd(a, b);
        const [x, xZh, y, yZh, kit, kitZh] = rng.pick([
          ["red roses", "朵红玫瑰", "white roses", "朵白玫瑰", "bouquets", "花束"],
          ["apples", "个苹果", "oranges", "个橙子", "gift bags", "礼品袋"],
          ["boys", "名男生", "girls", "名女生", "teams", "队"],
          ["pencils", "支铅笔", "erasers", "块橡皮", "kits", "文具包"],
        ] as const);
        const askEach = rng.bool();
        return answered(
          askEach
            ? [
                `There are $${a}$ ${x} and $${b}$ ${y}. They are shared into as many identical ${kit} as possible with nothing left over. How many ${x} are in each of the ${kit}?`,
                `有 $${a}$ ${xZh}和 $${b}$ ${yZh}，要分成尽可能多的相同${kitZh}，没有剩余。每份${kitZh}里有多少${xZh.slice(1)}？`,
              ]
            : [
                `There are $${a}$ ${x} and $${b}$ ${y}. What is the greatest number of identical ${kit} that can be made using all of them, with nothing left over?`,
                `有 $${a}$ ${xZh}和 $${b}$ ${yZh}，全部用完且没有剩余，最多能分成多少份相同的${kitZh}？`,
              ],
          askEach ? a / g : g,
          [
            [
              ["Find the number of groups", "求份数"],
              [
                `The number must divide ${a} and ${b}. The greatest common factor is ${g}.`,
                `份数要同时整除 ${a} 和 ${b}，最大公因数是 ${g}。`,
              ],
            ],
            askEach
              ? [["Share", "求每份"], ["", ""], [`${a} \\div ${g} = ${a / g}`]]
              : [
                  ["Answer", "作答"],
                  [`So ${g} ${kit}.`, `所以是 ${g} 份。`],
                ],
          ],
          [
            `${g} ${kit} with ${a / g} and ${b / g} each use $${g} \\times ${a / g} = ${a}$ and $${g} \\times ${b / g} = ${b}$.`,
            `${g} 份，每份 ${a / g} 和 ${b / g}，正好用完 $${g} \\times ${a / g} = ${a}$ 和 $${g} \\times ${b / g} = ${b}$。`,
          ],
          askEach
            ? [
                [g, "That is the number of groups.", "这是份数。"],
                [b / g, `That is how many ${y} are in each.`, `这是每份里另一种的个数。`],
                [a / (isPrime(g) ? 1 : smallestFactor(g)), "That makes fewer groups than possible.", "这样分的份数不是最多。"],
              ]
            : [
                [lcm(a, b), "That is the least common multiple.", "这是最小公倍数。"],
                [a / g, "That is how many are in each group.", "这是每份的个数。"],
                [isPrime(g) ? 1 : smallestFactor(g), "That is a common factor, but not the greatest.", "这是公因数，但不是最大的。"],
              ],
          { figure: sharedBars(a, b, g) },
        );
      },
      sharedBars(18, 30, 6),
    ),
  ],
};

export const leastCommonMultiple: TopicDef = {
  id: "least-common-multiple",
  title: t("Least Common Multiples", "最小公倍数"),
  summary: t("Find the least common multiple of two numbers from their prime factorizations.", "用质因数分解求两个数的最小公倍数。"),
  intro: t(
    "Hot dogs come in packs of 8 and buns in packs of 12. How few of each can you buy to have the same number? $8 = 2^3$ and $12 = 2^2 \\times 3$. The least common multiple is $2^3 \\times 3 = 24$.\n\nCheck: 3 packs of 8 and 2 packs of 12 both make 24.\n\nIn this lesson we find the least common multiple from prime factorizations.",
    "热狗每包 8 根，面包每包 12 个。至少各买多少，数量才一样多？$8 = 2^3$，$12 = 2^2 \\times 3$，最小公倍数是 $2^3 \\times 3 = 24$。\n\n检验：3 包热狗和 2 包面包都是 24。\n\n本课我们用质因数分解求最小公倍数。",
  ),
  prerequisites: ["prime-factorization"],
  encompasses: [{ topic: "prime-factorization", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.6.NS.B.4"],
  knowledgePoints: [
    point(
      "lcm-from-factorizations",
      ["Using prime factorizations", "利用质因数分解"],
      [
        "Factor both numbers. Take every prime that appears, with the larger exponent. $8 = 2^3$, $12 = 2^2 \\times 3$, so the least common multiple is $2^3 \\times 3 = 24$.\n\nCheck: $24 \\div 8 = 3$ and $24 \\div 12 = 2$.\n\n> **Watch out.** Use the larger exponent. $2^2 \\times 3 = 12$ is not a multiple of 8.",
        "先把两个数分解质因数，取出现过的每个质数，指数取较大的。$8 = 2^3$，$12 = 2^2 \\times 3$，所以最小公倍数是 $2^3 \\times 3 = 24$。\n\n检验：$24 \\div 8 = 3$，$24 \\div 12 = 2$。\n\n> **注意。** 指数取较大的。$2^2 \\times 3 = 12$ 不是 8 的倍数。",
      ],
      (rng) => {
        const [a, b] = pair(rng);
        const m = lcm(a, b);
        return answered(
          [`Find the least common multiple of $${a}$ and $${b}$.`, `求 $${a}$ 和 $${b}$ 的最小公倍数。`],
          m,
          [
            [
              ["Factor both", "分解两个数"],
              ["", ""],
              [factorLine(a), factorLine(b)],
            ],
            [
              ["Take every prime", "取所有质数"],
              ["Use each prime with the larger exponent.", "每个质数取较大的指数。"],
              [`${factorizationLatex(primeFactors(m))} = ${m}`],
            ],
          ],
          [
            `$${m} \\div ${a} = ${m / a}$ and $${m} \\div ${b} = ${m / b}$.`,
            `$${m} \\div ${a} = ${m / a}$，$${m} \\div ${b} = ${m / b}$。`,
          ],
          [
            [a * b, "That is a common multiple, but not the least.", "这是公倍数，但不是最小的。"],
            [gcd(a, b), "That is the greatest common factor.", "这是最大公因数。"],
            [Math.max(a, b), `That is not a multiple of ${Math.min(a, b)}.`, `这不是 ${Math.min(a, b)} 的倍数。`],
          ],
          { figure: meetBars(a, b, m) },
        );
      },
      meetBars(8, 12, 24),
    ),
    point(
      "lcm-in-word-problems",
      ["When repeating events line up", "周期事件何时重合"],
      [
        "One bus leaves every 12 minutes, another every 18. They just left together. They leave together again at the least common multiple: $12 = 2^2 \\times 3$, $18 = 2 \\times 3^2$, so $2^2 \\times 3^2 = 36$ minutes.\n\nCheck: $36 \\div 12 = 3$ and $36 \\div 18 = 2$.\n\n> **Watch out.** $12 \\times 18 = 216$ is a time they meet, but not the first.",
        "一路公交每 12 分钟发车，另一路每 18 分钟。刚才同时发车，下次同时发车是在最小公倍数：$12 = 2^2 \\times 3$，$18 = 2 \\times 3^2$，所以是 $2^2 \\times 3^2 = 36$ 分钟后。\n\n检验：$36 \\div 12 = 3$，$36 \\div 18 = 2$。\n\n> **注意。** $12 \\times 18 = 216$ 时也同时发车，但不是第一次。",
      ],
      (rng) => {
        const [a, b] = pair(rng);
        const m = lcm(a, b);
        const [one, other, unit, oneZh, otherZh, unitZh, unitWordZh] = rng.pick([
          ["One lighthouse flashes", "another", "seconds", "一座灯塔每", "另一座每", "秒闪光一次", "秒"],
          ["One bus leaves the station", "another", "minutes", "一路公交每", "另一路每", "分钟发车一次", "分钟"],
          ["One runner passes the start line", "another", "seconds", "一名跑步者每", "另一名每", "秒经过起点一次", "秒"],
          ["One machine needs servicing", "another", "days", "一台机器每", "另一台每", "天需要保养一次", "天"],
        ] as const);
        return answered(
          [
            `${one} every $${a}$ ${unit} and ${other} every $${b}$ ${unit}. Both did so together just now. After how many ${unit} will they next do so together?`,
            `${oneZh} $${a}$ ${unitZh}，${otherZh} $${b}$ ${unitZh}。刚才两者同时发生。至少再过多少${unitWordZh}会再次同时发生？`,
          ],
          m,
          [
            [
              ["Factor both", "分解两个数"],
              ["", ""],
              [factorLine(a), factorLine(b)],
            ],
            [["Find the least common multiple", "求最小公倍数"], ["", ""], [`${factorizationLatex(primeFactors(m))} = ${m}`]],
          ],
          [
            `$${m} \\div ${a} = ${m / a}$ and $${m} \\div ${b} = ${m / b}$, both whole.`,
            `$${m} \\div ${a} = ${m / a}$，$${m} \\div ${b} = ${m / b}$，都是整数。`,
          ],
          [
            [a * b, "That is a time they meet, but not the first.", "这时也同时发生，但不是第一次。"],
            [gcd(a, b), "That is the greatest common factor.", "这是最大公因数。"],
            [a + b, "That adds the two times.", "这把两个时间相加了。"],
          ],
          { figure: meetBars(a, b, m) },
        );
      },
      meetBars(12, 18, 36),
    ),
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
