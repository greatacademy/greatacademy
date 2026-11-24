import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { compared, type Pair, picked, pickedMath, type Walk } from "./early-grades-more-kit.ts";
import {
  answered,
  digitsChart,
  grouped,
  lineFigure,
  type Miss,
  placeChartFigure,
  placesOf,
  point,
  tapeFigure,
} from "./upper-grades-kit.ts";

// 4th Grade Math: expressions and patterns, place value, comparing and rounding, and adding and subtracting whole numbers.

/** fmt writes a whole number in LaTeX with thousands separators: "3{,}400". */
const fmt = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** plain writes a whole number with thousands separators for running text: "3,400". */
const plain = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** digitsOf lists the digits of n from the ones place up. */
const digitsOf = (n: number): number[] => String(n).split("").reverse().map(Number);

/** digitAt is the digit of n in place k (0 for the ones). */
const digitAt = (n: number, k: number): number => Math.floor(n / 10 ** k) % 10;

/** randomWithDigits is a random whole number with exactly d digits. */
const randomWithDigits = (rng: Rng, d: number): number => rng.int(10 ** (d - 1), 10 ** d - 1);

/** placeNames are the names of the places of a whole number, from the ones. */
const placeNames: readonly Text[] = [
  t("ones", "个位"),
  t("tens", "十位"),
  t("hundreds", "百位"),
  t("thousands", "千位"),
  t("ten thousands", "万位"),
  t("hundred thousands", "十万位"),
  t("millions", "百万位"),
];

/** roundNames name rounding to the nearest 10ᵏ. */
const roundNames: readonly Text[] = [
  t("one", "一"),
  t("ten", "十"),
  t("hundred", "百"),
  t("thousand", "千"),
  t("ten thousand", "万"),
  t("hundred thousand", "十万"),
];

const enOnes = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const enTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** below1000En writes 1 ≤ n < 1000 in English words. */
function below1000En(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const rest = r === 0 ? "" : r < 20 ? enOnes[r]! : `${enTens[Math.floor(r / 10)]}${r % 10 ? `-${enOnes[r % 10]}` : ""}`;
  return [h ? `${enOnes[h]} hundred` : "", rest].filter(Boolean).join(" ");
}

/** wordsEn writes a whole number below a billion in English words: "three thousand, forty-five". */
export function wordsEn(n: number): string {
  if (n === 0) return "zero";
  const groups: [number, string][] = [
    [Math.floor(n / 1e6), " million"],
    [Math.floor(n / 1e3) % 1000, " thousand"],
    [n % 1000, ""],
  ];
  return groups
    .filter(([g]) => g > 0)
    .map(([g, name]) => below1000En(g) + name)
    .join(", ");
}

const zhDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** below10000Zh writes 1 ≤ n < 10000 in Chinese, with 零 for inner gaps. */
function below10000Zh(n: number): string {
  const units = ["", "十", "百", "千"];
  let out = "";
  let gap = false;
  for (let k = 3; k >= 0; k--) {
    const d = digitAt(n, k);
    if (d === 0) {
      if (out) gap = true;
      continue;
    }
    if (gap) out += "零";
    gap = false;
    out += zhDigits[d]! + units[k]!;
  }
  return out;
}

/** wordsZh writes a whole number below a hundred million in Chinese: "三千零四十五". */
export function wordsZh(n: number): string {
  if (n === 0) return "零";
  const high = Math.floor(n / 10000);
  const low = n % 10000;
  let out = high ? `${below10000Zh(high)}万` : "";
  if (low) out += (high && low < 1000 ? "零" : "") + below10000Zh(low);
  return n >= 10 && n < 20 ? out.slice(1) : out;
}

/** noCarrySum adds digit by digit, forgetting to carry. */
function noCarrySum(a: number, b: number): number {
  let out = 0;
  for (let k = 0; k < 8; k++) out += ((digitAt(a, k) + digitAt(b, k)) % 10) * 10 ** k;
  return out;
}

/** smallerFromLarger subtracts the smaller digit from the larger in every place, a typical subtraction slip. */
function smallerFromLarger(a: number, b: number): number {
  let out = 0;
  for (let k = 0; k < 8; k++) out += Math.abs(digitAt(a, k) - digitAt(b, k)) * 10 ** k;
  return out;
}

/** roundTo rounds n to the nearest multiple of 10ᵏ, halves up. */
const roundTo = (n: number, k: number) => Math.round(n / 10 ** k) * 10 ** k;

/** expandedTerms lists the nonzero place-value parts of n, largest first. */
const expandedTerms = (n: number): number[] =>
  digitsOf(n)
    .map((d, k) => d * 10 ** k)
    .filter((x) => x > 0)
    .reverse();

/** expandedTex writes n in expanded form. */
const expandedTex = (n: number) => expandedTerms(n).map(fmt).join(" + ");

/** Context is a word-problem setting: a thing counted, in both languages. */
interface Context {
  readonly en: string;
  readonly zh: string;
}

const things: readonly Context[] = [
  { en: "books", zh: "本书" },
  { en: "stickers", zh: "张贴纸" },
  { en: "apples", zh: "个苹果" },
  { en: "marbles", zh: "颗弹珠" },
  { en: "pencils", zh: "支铅笔" },
  { en: "stamps", zh: "枚邮票" },
  { en: "shells", zh: "个贝壳" },
  { en: "cards", zh: "张卡片" },
];

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

/** standardsOf is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

// ---------------------------------------------------------------------------
// Expressions, comparison and patterns

/** range0 lists 0, 1, …, n − 1. */
const range0 = (n: number) => Array.from({ length: n }, (_, i) => i);

/** groupsTape draws `count` equal pieces of `each` after an optional first piece, with a total over the bar. */
const groupsTape = (first: number | null, count: number, each: number, total: string, alt: Pair): Figure =>
  tapeFigure(
    [
      {
        total,
        pieces: [
          ...(first === null ? [] : [{ size: first, text: `${first}` }]),
          ...range0(count).map(() => ({ size: each, text: `${each}`, lit: true })),
        ],
      },
    ],
    alt,
  );

/** timesBars draws a short bar for the smaller amount above a long bar made of `k` copies of it, with the larger amount over the long bar. */
const timesBars = (small: string, k: number, large: string): Figure =>
  tapeFigure(
    [{ pieces: [{ size: 1, text: small, lit: true }] }, { total: large, pieces: range0(k).map(() => ({ size: 1, text: small })) }],
    [
      `A short bar marked ${small}, and a long bar made of ${k} copies of it, marked ${large} in all.`,
      `一个短条标着 ${small}；一个长条由 ${k} 个这样的短条组成，一共是 ${large}。`,
    ],
  );

/** evaluatingExpressionsInvolvingAdditionAndMultiplication applies the order of operations to + and ×. */
export const evaluatingExpressionsInvolvingAdditionAndMultiplication: TopicDef = {
  id: "evaluating-expressions-involving-addition-and-multiplication",
  title: t("Evaluating Expressions Involving Addition and Multiplication", "计算含加法和乘法的算式"),
  summary: t(
    "In an expression with addition and multiplication, multiply first and then add, unless parentheses say otherwise: 4 + 3 × 5 = 4 + 15 = 19, but (4 + 3) × 5 = 7 × 5 = 35.",
    "在含加法和乘法的算式中，先乘后加，除非括号另有规定：4 + 3 × 5 = 4 + 15 = 19，而 (4 + 3) × 5 = 7 × 5 = 35。",
  ),
  intro: t(
    "Leo buys 1 pen for \\$4 and 3 notebooks for \\$5 each. He pays $4 + 3 \\times 5$ dollars. The 3 notebooks cost $3 \\times 5 = 15$. Then add the pen: $4 + 15 = 19$.\n\nCheck: count it out. $4$, then $9$, $14$, $19$. Leo pays \\$19.\n\nIn this lesson we learn the order: multiply before adding, and work out parentheses first.",
    "利奥买了 1 支 4 元的笔和 3 本每本 5 元的本子，要付 $4 + 3 \\times 5$ 元。3 本本子是 $3 \\times 5 = 15$ 元，再加上笔：$4 + 15 = 19$。\n\n检验：一样一样地数：$4$，再数 $9$、$14$、$19$。利奥要付 19 元。\n\n本课我们学习运算顺序：先乘后加，有括号先算括号。",
  ),
  prerequisites: ["products-and-factors", "adding-two-digit-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    point(
      "multiplying-before-adding",
      ["Multiply before adding", "先乘后加"],
      [
        "Multiply first, then add. Do this even when the plus sign comes first. In $6 + 4 \\times 3$, first $4 \\times 3 = 12$. Then $6 + 12 = 18$.\n\nCheck: $4 \\times 3$ is three 4s. Count on from 6 by 4s: 10, 14, 18.\n\n> **Watch out.** Do not add first. $6 + 4 = 10$ and $10 \\times 3 = 30$ is wrong.",
        "先乘，再加。加号写在前面也一样。在 $6 + 4 \\times 3$ 中，先算 $4 \\times 3 = 12$，再算 $6 + 12 = 18$。\n\n检验：$4 \\times 3$ 是 3 个 4。从 6 开始 4 个 4 个地数：10、14、18。\n\n> **注意。** 不要先加。先算 $6 + 4 = 10$，再算 $10 \\times 3 = 30$，是错的。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 30), rng.int(2, 9), rng.int(2, 9)];
        const multFirst = rng.bool();
        const tex = multFirst ? `${b} \\times ${c} + ${a}` : `${a} + ${b} \\times ${c}`;
        const value = a + b * c;
        return answered(
          [`Evaluate $${tex}$.`, `计算 $${tex}$。`],
          value,
          [
            [["Multiply first", "先算乘法"], ["", ""], [`${b} \\times ${c} = ${b * c}`]],
            [["Then add", "再算加法"], ["", ""], [`${b * c} + ${a} = ${value}`]],
          ],
          [
            `Add ${a} and ${b} copies of ${c} one at a time: $${a}${range0(b)
              .map(() => ` + ${c}`)
              .join("")} = ${value}$.`,
            `把 ${a} 和 ${b} 个 ${c} 一个一个加起来：$${a}${range0(b)
              .map(() => ` + ${c}`)
              .join("")} = ${value}$。`,
          ],
          [
            multFirst
              ? [b * (c + a), `That adds ${c} + ${a} first. Multiply before adding.`, `这是先算了 ${c} + ${a}。要先乘后加。`]
              : [(a + b) * c, `That adds ${a} + ${b} first. Multiply before adding.`, `这是先算了 ${a} + ${b}。要先乘后加。`],
            [a + b + c, "That adds all three numbers. The × sign means multiply.", "这是把三个数都加了起来。× 表示乘法。"],
            [b * c, `That is only the product. Add ${a} to it as well.`, `这只是乘积，还要再加上 ${a}。`],
          ],
        );
      },
      groupsTape(6, 3, 4, "18", [
        "A bar with a piece of 6 and then three pieces of 4, 18 in all.",
        "一个长条：先是 6，再是 3 段 4，一共 18。",
      ]),
    ),
    point(
      "parentheses-with-addition-and-multiplication",
      ["Parentheses first", "先算括号"],
      [
        "Parentheses go first. Work out what is inside them. Then do the rest. In $(6 + 4) \\times 3$, first $6 + 4 = 10$. Then $10 \\times 3 = 30$.\n\nCheck: three groups of $6 + 4$ are three 6s and three 4s. $18 + 12 = 30$.\n\n> **Watch out.** Do not multiply only the 4. $6 + 4 \\times 3 = 18$ is a different problem.",
        "先算括号里面的，再算其余的。在 $(6 + 4) \\times 3$ 中，先算 $6 + 4 = 10$，再算 $10 \\times 3 = 30$。\n\n检验：3 组 $6 + 4$，就是 3 个 6 和 3 个 4。$18 + 12 = 30$。\n\n> **注意。** 不要只用 4 去乘 3。$6 + 4 \\times 3 = 18$ 是另一道题。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(2, 20), rng.int(2, 20), rng.int(2, 9)];
        const left = rng.bool();
        const tex = left ? `(${a} + ${b}) \\times ${c}` : `${c} \\times (${a} + ${b})`;
        const value = (a + b) * c;
        return answered(
          [`Evaluate $${tex}$.`, `计算 $${tex}$。`],
          value,
          [
            [["Work out the parentheses", "先算括号"], ["", ""], [`${a} + ${b} = ${a + b}`]],
            [["Then multiply", "再算乘法"], ["", ""], [`${a + b} \\times ${c} = ${value}`]],
          ],
          [
            `Multiply each number in the parentheses: $${a} \\times ${c} + ${b} \\times ${c} = ${a * c} + ${b * c} = ${value}$.`,
            `用括号里的每个数分别去乘：$${a} \\times ${c} + ${b} \\times ${c} = ${a * c} + ${b * c} = ${value}$。`,
          ],
          [
            left
              ? [
                  a + b * c,
                  `That multiplies only ${b} by ${c}. Add inside the parentheses first.`,
                  `这只用 ${b} 乘了 ${c}。要先算括号里的加法。`,
                ]
              : [
                  c * a + b,
                  `That multiplies only ${a} by ${c}. Add inside the parentheses first.`,
                  `这只用 ${a} 乘了 ${c}。要先算括号里的加法。`,
                ],
            [a * b * c, "That multiplies all three numbers. Inside the parentheses is a plus sign.", "这是三个数都相乘了。括号里是加号。"],
            [
              a + b + c,
              "That adds all three numbers. Multiply the sum by the number outside.",
              "这是三个数都相加了。要用括号里的和去乘外面的数。",
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "30",
            pieces: range0(3).flatMap(() => [
              { size: 6, text: "6" },
              { size: 4, text: "4", lit: true },
            ]),
          },
        ],
        ["A bar made of three copies of 6 and 4, 30 in all.", "一个长条由 3 组“6 和 4”组成，一共 30。"],
      ),
    ),
  ],
};

/** evaluatingExpressionsContainingMultiplicationAndDivision works left to right with × and ÷ and mixes all four operations. */
export const evaluatingExpressionsContainingMultiplicationAndDivision: TopicDef = {
  id: "evaluating-expressions-containing-multiplication-and-division",
  title: t("Evaluating Expressions Containing Multiplication and Division", "计算含乘法和除法的算式"),
  summary: t(
    "Multiplication and division have the same priority, so do them from left to right: 24 ÷ 4 × 2 = 6 × 2 = 12. Both come before addition and subtraction: 20 − 12 ÷ 3 = 20 − 4 = 16.",
    "乘法与除法同级，从左往右计算：24 ÷ 4 × 2 = 6 × 2 = 12。它们都先于加法和减法：20 − 12 ÷ 3 = 20 − 4 = 16。",
  ),
  intro: t(
    "Sara has 24 cookies. She shares them among 4 plates, and then she takes 2 plates. She has $24 \\div 4 \\times 2$ cookies. Each plate has $24 \\div 4 = 6$. Two plates have $6 \\times 2 = 12$.\n\nCheck: 2 of the 4 plates is half of the cookies. Half of 24 is 12.\n\nIn this lesson we work left to right with × and ÷, and do them before + and −.",
    "萨拉有 24 块饼干，平均放在 4 个盘子里，然后拿走 2 盘。她拿走了 $24 \\div 4 \\times 2$ 块。每盘 $24 \\div 4 = 6$ 块，2 盘是 $6 \\times 2 = 12$ 块。\n\n检验：4 盘中的 2 盘是一半，24 的一半是 12。\n\n本课我们学习乘除从左往右算，并且先乘除、后加减。",
  ),
  prerequisites: ["evaluating-expressions-involving-addition-and-multiplication", "relationship-between-multiplication-and-division"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    point(
      "multiplying-and-dividing-left-to-right",
      ["Left to right", "从左往右"],
      [
        "× and ÷ are equal partners. Do them in order, from left to right. In $36 \\div 6 \\times 3$, first $36 \\div 6 = 6$. Then $6 \\times 3 = 18$.\n\nCheck: cut 36 into 6 equal parts of 6 and take 3 parts. That is 18.\n\n> **Watch out.** Do not multiply first just because it is ×. $36 \\div 18 = 2$ is wrong.",
        "乘法和除法是同级运算，要从左往右依次算。在 $36 \\div 6 \\times 3$ 中，先算 $36 \\div 6 = 6$，再算 $6 \\times 3 = 18$。\n\n检验：把 36 平均分成 6 份，每份 6，取 3 份，是 18。\n\n> **注意。** 不能因为是乘法就先算。$36 \\div 18 = 2$ 是错的。",
      ],
      (rng) => {
        const b = rng.int(2, 6);
        const c = rng.pick([2, 3, 4, 6].filter((x) => x !== b));
        const q = rng.int(2, 9);
        const a = b * c * q;
        const value = (a / b) * c;
        return answered(
          [`Evaluate $${a} \\div ${b} \\times ${c}$.`, `计算 $${a} \\div ${b} \\times ${c}$。`],
          value,
          [
            [["Divide first, since it is on the left", "÷ 在左边，先算除法"], ["", ""], [`${a} \\div ${b} = ${a / b}`]],
            [["Then multiply", "再算乘法"], ["", ""], [`${a / b} \\times ${c} = ${value}`]],
          ],
          [
            `Undo the steps backwards: $${value} \\div ${c} = ${a / b}$ and $${a / b} \\times ${b} = ${a}$, the number we started with.`,
            `倒着算回去：$${value} \\div ${c} = ${a / b}$，$${a / b} \\times ${b} = ${a}$，正是开始的数。`,
          ],
          [
            [a / (b * c), `That multiplies ${b} × ${c} first. Work from left to right.`, `这是先算了 ${b} × ${c}。要从左往右算。`],
            [a / b + c, `That adds ${c}. The sign is ×, so multiply.`, `这是加了 ${c}。符号是 ×，要乘。`],
            [a / b, `That is only the first step. Multiply by ${c} as well.`, `这只算了第一步，还要乘 ${c}。`],
          ],
        );
      },
      tapeFigure(
        [{ total: "36", pieces: range0(6).map((i) => ({ size: 1, text: "6", lit: i < 3 })) }],
        ["A bar of 36 cut into 6 equal parts of 6, with 3 parts shaded.", "一个长条表示 36，平均分成 6 份，每份 6，涂色 3 份。"],
      ),
    ),
    point(
      "mixing-the-four-operations",
      ["All four operations", "四则混合运算"],
      [
        "First do × and ÷, left to right. Then do + and −, left to right. In $30 - 18 \\div 3$, first $18 \\div 3 = 6$. Then $30 - 6 = 24$.\n\nCheck: add back. $24 + 6 = 30$.\n\n> **Watch out.** Do not subtract first. $30 - 18 = 12$ and $12 \\div 3 = 4$ is wrong.",
        "先从左往右算乘除，再从左往右算加减。在 $30 - 18 \\div 3$ 中，先算 $18 \\div 3 = 6$，再算 $30 - 6 = 24$。\n\n检验：加回去，$24 + 6 = 30$。\n\n> **注意。** 不要先减。先算 $30 - 18 = 12$，再算 $12 \\div 3 = 4$，是错的。",
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const b = c * rng.int(2, 9);
        const a = rng.int(b / c + 1, 80);
        const plus = rng.bool();
        const op = plus ? "+" : "-";
        const value = plus ? a + b / c : a - b / c;
        const leftFirst = plus ? (a + b) / c : (a - b) / c;
        return answered(
          [`Evaluate $${a} ${op} ${b} \\div ${c}$.`, `计算 $${a} ${op} ${b} \\div ${c}$。`],
          value,
          [
            [["Divide first", "先算除法"], ["", ""], [`${b} \\div ${c} = ${b / c}`]],
            [[plus ? "Then add" : "Then subtract", plus ? "再算加法" : "再算减法"], ["", ""], [`${a} ${op} ${b / c} = ${value}`]],
          ],
          plus
            ? [`Take the ${b / c} back off: $${value} - ${b / c} = ${a}$.`, `再减去 ${b / c}：$${value} - ${b / c} = ${a}$。`]
            : [`Add the ${b / c} back: $${value} + ${b / c} = ${a}$.`, `把 ${b / c} 加回去：$${value} + ${b / c} = ${a}$。`],
          [
            ...(Number.isInteger(leftFirst)
              ? [
                  [
                    leftFirst,
                    `That does ${a} ${op} ${b} first. Divide before you ${plus ? "add" : "subtract"}.`,
                    `这是先算了 ${a} ${op} ${b}。要先除后${plus ? "加" : "减"}。`,
                  ] as const,
                ]
              : []),
            [
              plus ? a - b / c : a + b / c,
              `That ${plus ? "subtracts" : "adds"}. Look again at the sign.`,
              `这里${plus ? "减" : "加"}了，再看看符号。`,
            ],
            [
              b / c,
              `That is only the quotient. ${plus ? "Add it to" : "Take it from"} ${a} as well.`,
              `这只是商，还要${plus ? "加上" : "从"} ${a}${plus ? "" : " 里减去它"}。`,
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "30",
            pieces: [
              { size: 24, text: "24" },
              { size: 6, text: "6", lit: true },
            ],
          },
        ],
        ["A bar of 30 with a piece of 6 taken off, leaving 24.", "一个长条表示 30，去掉 6，还剩 24。"],
      ),
    ),
  ],
};

/** solvingMultistepWordProblemsUsingNumberOperations solves two-step word problems. */
export const solvingMultistepWordProblemsUsingNumberOperations: TopicDef = {
  id: "solving-multistep-word-problems-using-number-operations",
  title: t("Solving Multistep Word Problems Using Number Operations", "用四则运算解多步应用题"),
  summary: t(
    "A multistep word problem is solved one step at a time: decide what each step finds, choose its operation, and use its result in the next step.",
    "多步应用题要一步一步地解：确定每一步求什么、用哪种运算，再把它的结果用到下一步。",
  ),
  intro: t(
    "A shop has 6 boxes of 24 pencils. It sells 50 pencils. How many are left? We cannot answer in one go. First find all the pencils: $6 \\times 24 = 144$. Then take away the ones sold: $144 - 50 = 94$.\n\nCheck: $94 + 50 = 144$, and $144 \\div 6 = 24$ pencils in each box.\n\nIn this lesson we solve word problems in two steps, using the answer of the first step in the second.",
    "商店有 6 盒铅笔，每盒 24 支，卖出 50 支，还剩多少支？一步算不出来。先求一共有多少支：$6 \\times 24 = 144$。再减去卖出的：$144 - 50 = 94$。\n\n检验：$94 + 50 = 144$，$144 \\div 6 = 24$，正好每盒 24 支。\n\n本课我们分两步解应用题，第一步的结果用在第二步里。",
  ),
  prerequisites: ["evaluating-expressions-containing-multiplication-and-division", "subtracting-three-digit-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    point(
      "groups-then-subtract",
      ["Multiply, then subtract", "先乘再减"],
      [
        "Solve it in two steps. First multiply to find the total of the equal groups. Then subtract what was taken away. A shop has $6$ boxes of $24$ pencils and sells $50$. It had $6 \\times 24 = 144$, so $144 - 50 = 94$ are left.\n\nCheck: add back what was sold. $94 + 50 = 144$.\n\n> **Watch out.** Do not subtract from one box only. Find the total of all the boxes first.",
        "分两步解。先用乘法求出几组一共有多少，再减去拿走的。商店有 $6$ 盒铅笔，每盒 $24$ 支，卖出 $50$ 支。原有 $6 \\times 24 = 144$ 支，所以还剩 $144 - 50 = 94$ 支。\n\n检验：把卖出的加回去，$94 + 50 = 144$。\n\n> **注意。** 不要只从一盒里减。先求出所有盒子里一共有多少。",
      ],
      (rng) => {
        const th = rng.pick(things);
        const name = rng.pick(names);
        const a = rng.int(3, 9);
        const b = rng.int(12, 48);
        const c = rng.int(5, a * b - 5);
        const value = a * b - c;
        return answered(
          [
            `${name} has ${a} boxes with ${b} ${th.en} in each box and gives away ${c} ${th.en}. How many ${th.en} does ${name} have left?`,
            `${name} 有 ${a} 盒，每盒 ${b} ${th.zh}，送出 ${c} ${th.zh}。${name} 还剩多少${th.zh.slice(1)}？`,
          ],
          value,
          [
            [["Find the total", "求总数"], ["", ""], [`${a} \\times ${b} = ${a * b}`]],
            [["Take away what was given", "减去送出的"], ["", ""], [`${a * b} - ${c} = ${value}`]],
          ],
          [
            `Add back what was given away: $${value} + ${c} = ${a * b}$, which is ${a} boxes of ${b}.`,
            `把送出的加回去：$${value} + ${c} = ${a * b}$，正好是 ${a} 盒，每盒 ${b}。`,
          ],
          [
            [a * b + c, `That adds the ${c}. They were given away, so subtract.`, `这里加了 ${c}。送出去要用减法。`],
            [a * b, `That is the total before giving any away. Subtract the ${c} as well.`, `这是送出前的总数，还要减去 ${c}。`],
            [b - c, `That subtracts from one box. Find the total of all ${a} boxes first.`, `这是从一盒里减。要先求出 ${a} 盒一共有多少。`],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "144",
            pieces: [
              { size: 94, text: "?" },
              { size: 50, text: "50", lit: true },
            ],
          },
        ],
        ["A bar of 144 pencils, with 50 sold and an unknown part left.", "一个长条表示 144 支铅笔，卖出 50 支，剩下的部分未知。"],
      ),
    ),
    point(
      "add-then-multiply",
      ["Add, then multiply", "先加再乘"],
      [
        "Sometimes each group has two kinds of things. Add to find one group. Then multiply by the number of groups. A child ticket is \\$8 and an adult ticket is \\$12. For 5 pairs: $(8 + 12) \\times 5 = 20 \\times 5 = 100$ dollars.\n\nCheck: 5 child tickets are \\$40 and 5 adult tickets are \\$60. $40 + 60 = 100$.\n\n> **Watch out.** Write the parentheses. $8 + 12 \\times 5$ multiplies only the 12.",
        "有时每组里有两种东西。先加，求出一组的数，再乘组数。儿童票 8 元，成人票 12 元。5 对儿童和成人：$(8 + 12) \\times 5 = 20 \\times 5 = 100$ 元。\n\n检验：5 张儿童票 40 元，5 张成人票 60 元，$40 + 60 = 100$。\n\n> **注意。** 要写括号。$8 + 12 \\times 5$ 只用 12 乘了 5。",
      ],
      (rng) => {
        const a = rng.int(3, 15);
        const b = rng.int(a + 1, 25);
        const n = rng.int(3, 12);
        const value = (a + b) * n;
        return answered(
          [
            `A notebook costs \\$${a} and a pen costs \\$${b}. How many dollars do ${n} notebooks and ${n} pens cost in total?`,
            `一本笔记本 ${a} 元，一支钢笔 ${b} 元。${n} 本笔记本和 ${n} 支钢笔一共多少元？`,
          ],
          value,
          [
            [["Price of one of each", "一本加一支多少钱"], ["", ""], [`${a} + ${b} = ${a + b}`]],
            [[`Multiply by ${n}`, `乘 ${n}`], ["", ""], [`${a + b} \\times ${n} = ${value}`]],
          ],
          [
            `Price each kind on its own: $${a} \\times ${n} = ${a * n}$ and $${b} \\times ${n} = ${b * n}$, and $${a * n} + ${b * n} = ${value}$.`,
            `分开算：$${a} \\times ${n} = ${a * n}$，$${b} \\times ${n} = ${b * n}$，$${a * n} + ${b * n} = ${value}$。`,
          ],
          [
            [a + b * n, `That multiplies only the pens. There are ${n} notebooks too.`, `这只算了 ${n} 支钢笔，还有 ${n} 本笔记本。`],
            [a * n + b, `That multiplies only the notebooks. There are ${n} pens too.`, `这只算了 ${n} 本笔记本，还有 ${n} 支钢笔。`],
            [a + b, "That is the price of one of each. Multiply by the number of each.", "这是一本加一支的价钱，还要乘数量。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "100",
            pieces: range0(5).flatMap(() => [
              { size: 8, text: "8" },
              { size: 12, text: "12", lit: true },
            ]),
          },
        ],
        ["A bar made of 5 copies of 8 and 12, 100 in all.", "一个长条由 5 组“8 和 12”组成，一共 100。"],
      ),
    ),
  ],
};

/** furtherSolvingMultistepWordProblemsUsingTheFourOperations solves word problems with division and remainders. */
export const furtherSolvingMultistepWordProblemsUsingTheFourOperations: TopicDef = {
  id: "further-solving-multistep-word-problems-using-the-four-operations",
  title: t("Further Solving Multistep Word Problems Using the Four Operations", "用四则运算解多步应用题（进阶）"),
  summary: t(
    "Multistep problems may need division, and a remainder must be interpreted: if 27 people ride in cars that hold 4, then 27 ÷ 4 = 6 R 3, so 7 cars are needed.",
    "多步应用题可能需要除法，而余数要结合情境解释：27 人乘坐每辆可坐 4 人的汽车，27 ÷ 4 = 6……3，所以需要 7 辆车。",
  ),
  intro: t(
    "Three classes of 26 children go to the zoo. Each bus holds 20 children. First count the children: $3 \\times 26 = 78$. Then $78 \\div 20 = 3$ R $18$. Three buses are full, and 18 children are still waiting. They need one more bus, so 4 buses go.\n\nCheck: 4 buses hold $4 \\times 20 = 80$ children. That is enough for 78, but 3 buses hold only 60.\n\nIn this lesson we solve problems with two or three steps, and decide what a remainder means.",
    "3 个班去动物园，每班 26 人。每辆大巴坐 20 人。先算人数：$3 \\times 26 = 78$。再算 $78 \\div 20 = 3 \\cdots\\cdots 18$。3 辆车坐满了，还有 18 人在等，还要再来一辆，所以要 4 辆。\n\n检验：4 辆车能坐 $4 \\times 20 = 80$ 人，够 78 人坐；3 辆车只能坐 60 人。\n\n本课我们解两步或三步的应用题，并想清楚余数表示什么。",
  ),
  prerequisites: ["solving-multistep-word-problems-using-number-operations", "interpreting-remainders-in-context"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.3"),
  knowledgePoints: [
    point(
      "rounding-a-quotient-up-in-context",
      ["How many groups are needed?", "需要多少组"],
      [
        "First find how many there are. Then divide. If something is left over, it needs one more group. 3 classes of 26 students ride buses of 20. There are $3 \\times 26 = 78$ students. $78 \\div 20 = 3$ R $18$, so 4 buses are needed.\n\nCheck: 4 buses hold 80, enough for 78. 3 buses hold only 60.\n\n> **Watch out.** Do not drop the remainder. Those 18 students still need a seat.",
        "先求出一共有多少，再除。有剩余时，还要再加一组。3 个班，每班 26 人，乘坐每辆 20 人的大巴。共 $3 \\times 26 = 78$ 人，$78 \\div 20 = 3 \\cdots\\cdots 18$，所以要 4 辆。\n\n检验：4 辆能坐 80 人，够坐 78 人；3 辆只能坐 60 人。\n\n> **注意。** 不能丢掉余数。剩下的 18 人也要有座位。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        let c: number;
        do {
          a = rng.int(2, 6);
          b = rng.int(15, 35);
          c = rng.int(4, 12);
        } while ((a * b) % c === 0);
        const total = a * b;
        const q = Math.floor(total / c);
        const value = q + 1;
        return answered(
          [
            `${a} teams of ${b} players each travel in vans that hold ${c} players. How many vans are needed?`,
            `${a} 支队伍，每队 ${b} 名队员，乘坐每辆可坐 ${c} 人的面包车。需要多少辆面包车？`,
          ],
          value,
          [
            [["Count the players", "求总人数"], ["", ""], [`${a} \\times ${b} = ${total}`]],
            [["Divide into vans", "按每辆车分"], ["", ""], [`${total} \\div ${c} = ${q} \\text{ R } ${total % c}`]],
            [
              ["Use the remainder", "处理余数"],
              [
                `${q} vans are full and ${total % c} players are left. They need one more van: ${value} vans.`,
                `${q} 辆坐满，还剩 ${total % c} 人，要再加一辆：共 ${value} 辆。`,
              ],
            ],
          ],
          [
            `${value} vans hold $${value} \\times ${c} = ${value * c}$ players, enough for ${total}. ${q} vans hold only ${q * c}.`,
            `${value} 辆车能坐 $${value} \\times ${c} = ${value * c}$ 人，够 ${total} 人坐；${q} 辆只能坐 ${q * c} 人。`,
          ],
          [
            [
              q,
              `With ${q} vans, ${total % c} players have no seat. Add one more van.`,
              `${q} 辆车还有 ${total % c} 人没座位，要再加一辆。`,
            ],
            [
              total % c,
              "That is the remainder, the players left over. The question asks for vans.",
              "这是余数，即剩下的人数。题目问的是车的数量。",
            ],
            [Math.ceil(b / c), `That fits only one team. There are ${a} teams.`, `这只够一支队伍坐，一共有 ${a} 支队伍。`],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "78",
            pieces: [
              { size: 20, text: "20" },
              { size: 20, text: "20" },
              { size: 20, text: "20" },
              { size: 18, text: "18", lit: true, dashed: true },
            ],
          },
        ],
        ["A bar of 78 made of three full groups of 20 and a part of 18 left over.", "一个长条表示 78，由 3 个 20 和剩下的 18 组成。"],
      ),
    ),
    point(
      "three-step-word-problems",
      ["Three steps", "三步计算"],
      [
        "Some problems need three steps. Write each step on its own line. A baker makes 12 trays of 8 muffins. She packs them in bags of 6 and sells 10 bags. There are $12 \\times 8 = 96$ muffins. That is $96 \\div 6 = 16$ bags. So $16 - 10 = 6$ bags are left.\n\nCheck: 6 bags are 36 muffins. $96 - 36 = 60$ muffins were sold, which is 10 bags of 6.\n\n> **Watch out.** Keep track of what each number counts. 16 counts bags, not muffins.",
        "有的题要分三步。每一步写一行。面包师做了 12 盘松饼，每盘 8 个，每 6 个装一袋，卖出 10 袋。共有 $12 \\times 8 = 96$ 个，装成 $96 \\div 6 = 16$ 袋，所以还剩 $16 - 10 = 6$ 袋。\n\n检验：6 袋是 36 个，卖出 $96 - 36 = 60$ 个，正好是 10 袋，每袋 6 个。\n\n> **注意。** 记清每个数表示什么。16 是袋数，不是松饼的个数。",
      ],
      (rng) => {
        const per = rng.int(3, 8);
        const bags = rng.int(6, 20);
        const total = per * bags;
        const trayOpts = [2, 3, 4, 5, 6, 8, 10, 12].filter((x) => total % x === 0 && total / x >= 4);
        const trays = trayOpts.length > 0 ? rng.pick(trayOpts) : 1;
        const perTray = total / trays;
        const sold = rng.int(1, bags - 1);
        const value = bags - sold;
        return answered(
          [
            `A baker makes ${trays} trays of ${perTray} muffins, packs them in bags of ${per}, and sells ${sold} bags. How many bags are left?`,
            `面包师做了 ${trays} 盘松饼，每盘 ${perTray} 个，每 ${per} 个装一袋，卖出 ${sold} 袋。还剩多少袋？`,
          ],
          value,
          [
            [["Count the muffins", "求松饼总数"], ["", ""], [`${trays} \\times ${perTray} = ${total}`]],
            [["Count the bags", "求袋数"], ["", ""], [`${total} \\div ${per} = ${bags}`]],
            [["Take away the bags sold", "减去卖出的袋数"], ["", ""], [`${bags} - ${sold} = ${value}`]],
          ],
          [
            `${value} bags hold $${value * per}$ muffins, and ${sold} bags hold $${sold * per}$. $${value * per} + ${sold * per} = ${total}$, all the muffins.`,
            `${value} 袋有 $${value * per}$ 个，${sold} 袋有 $${sold * per}$ 个，$${value * per} + ${sold * per} = ${total}$，正好是全部松饼。`,
          ],
          [
            [bags, "That is all the bags. Take away the bags sold.", "这是全部的袋数，还要减去卖出的袋数。"],
            [
              total - sold,
              `That takes ${sold} muffins away, but ${sold} bags were sold.`,
              `这是减去了 ${sold} 个松饼，但卖出的是 ${sold} 袋。`,
            ],
            [total - sold * per, "That counts the muffins left. The question asks for bags.", "这是剩下的松饼个数，题目问的是袋数。"],
          ],
        );
      },
      tapeFigure(
        [{ total: "16", pieces: range0(16).map((i) => ({ size: 1, text: "", lit: i < 10 })) }],
        ["A bar of 16 bags, with 10 bags shaded as sold.", "一个长条表示 16 袋，其中 10 袋涂色表示卖出。"],
      ),
    ),
  ],
};

/** interpretingMultiplicationEquationsAsAComparison reads a × b = c as "c is a times as many as b". */
export const interpretingMultiplicationEquationsAsAComparison: TopicDef = {
  id: "interpreting-multiplication-equations-as-a-comparison",
  title: t("Interpreting Multiplication Equations as a Comparison", "把乘法算式理解为比较"),
  summary: t(
    "A multiplication equation can compare two amounts: 35 = 5 × 7 says that 35 is 5 times as many as 7, and also 7 times as many as 5.",
    "乘法算式可以表示两个量的比较：35 = 5 × 7 表示 35 是 7 的 5 倍，也是 5 的 7 倍。",
  ),
  intro: t(
    "Ana has 7 marbles. Her brother has 6 times as many. Line up his marbles in rows of 7: there are 6 rows. So he has $6 \\times 7 = 42$. The equation $42 = 6 \\times 7$ tells the story: 42 is 6 times as many as 7.\n\nCheck: share 42 marbles into rows of 7. $42 \\div 7 = 6$ rows.\n\nIn this lesson we read multiplication equations as comparisons, and write comparisons as equations.",
    "安娜有 7 颗弹珠，哥哥的弹珠是她的 6 倍。把哥哥的弹珠每 7 颗排一行，正好排 6 行，所以他有 $6 \\times 7 = 42$ 颗。算式 $42 = 6 \\times 7$ 讲的就是：42 是 7 的 6 倍。\n\n检验：把 42 颗每 7 颗排一行，$42 \\div 7 = 6$ 行。\n\n本课我们把乘法算式读成倍数比较，也把倍数比较写成算式。",
  ),
  prerequisites: ["products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.1"),
  knowledgePoints: [
    point(
      "reading-multiplicative-comparisons",
      ["How many times as many?", "是几倍"],
      [
        "A multiplication equation can compare two amounts. In $42 = 6 \\times 7$, the product 42 is the big amount. It is 6 times as many as 7. It is also 7 times as many as 6.\n\nCheck: 6 bars of 7 laid end to end make 42.\n\n> **Watch out.** The number of times is the other factor. 42 is 6 times as many as 7, not 7 times as many as 7.",
        "乘法算式可以表示倍数关系。在 $42 = 6 \\times 7$ 中，积 42 是大的量。它是 7 的 6 倍，也是 6 的 7 倍。\n\n检验：6 段 7 首尾相接，正好是 42。\n\n> **注意。** 倍数是另一个因数。42 是 7 的 6 倍，不是 7 的 7 倍。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        let b: number;
        do b = rng.int(2, 12);
        while (b === a);
        const c = a * b;
        return answered(
          [
            `$${c} = ${a} \\times ${b}$. Fill in the blank: $${c}$ is ___ times as many as $${b}$.`,
            `$${c} = ${a} \\times ${b}$。填空：$${c}$ 是 $${b}$ 的 ___ 倍。`,
          ],
          a,
          [
            [
              ["Find the big amount", "找出大的量"],
              [`The product ${c} is the big amount. It is compared with ${b}.`, `积 ${c} 是大的量，它和 ${b} 比。`],
            ],
            [
              ["Read the other factor", "看另一个因数"],
              [`The other factor is ${a}, so ${c} is ${a} times as many as ${b}.`, `另一个因数是 ${a}，所以 ${c} 是 ${b} 的 ${a} 倍。`],
            ],
          ],
          [`Divide: $${c} \\div ${b} = ${a}$.`, `用除法验证：$${c} \\div ${b} = ${a}$。`],
          [
            [b, `${b} is the amount being compared. Use the other factor.`, `${b} 是被比的量，要看另一个因数。`],
            [c - b, `That is how many more, by subtracting. The question asks how many times.`, `这是用减法求的“多多少”。题目问的是几倍。`],
            [c, "That is the product itself. The number of times is a factor.", "这是积本身，倍数是一个因数。"],
          ],
        );
      },
      timesBars("7", 6, "42"),
    ),
    point(
      "choosing-the-equation-for-a-comparison",
      ["Choosing the equation", "选出算式"],
      [
        '"48 is 6 times as many as 8" has three numbers. Put the big amount alone on one side. Multiply the other two on the other side: $48 = 6 \\times 8$.\n\nCheck: $6 \\times 8$ is 48, so the equation is true.\n\n> **Watch out.** "Times as many" means ×, not +. $48 = 6 + 8$ is false.',
        "“48 是 8 的 6 倍”里有三个数。把大的量单独放在一边，另一边是另外两个数相乘：$48 = 6 \\times 8$。\n\n检验：$6 \\times 8 = 48$，算式成立。\n\n> **注意。** “几倍”用乘号，不用加号。$48 = 6 + 8$ 不成立。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b: number;
        do b = rng.int(2, 12);
        while (b === a);
        const c = a * b;
        return pickedMath(
          rng,
          [`Which equation says "$${c}$ is $${a}$ times as many as $${b}$"?`, `哪个算式表示“$${c}$ 是 $${b}$ 的 $${a}$ 倍”？`],
          `${c} = ${a} \\times ${b}`,
          [
            [`${c} = ${a} + ${b}`, "That adds. Times as many means multiply.", "这是加法，几倍要用乘法。"],
            [
              `${b} = ${a} \\times ${c}`,
              `That makes ${b} the big amount. ${c} is the big amount.`,
              `这把 ${b} 当成了大的量，大的量是 ${c}。`,
            ],
            [`${a} = ${c} \\times ${b}`, `That makes ${a} the product. ${c} is the product.`, `这把 ${a} 当成了积，积是 ${c}。`],
          ],
          [
            [
              ["Find the big amount", "找出大的量"],
              [`${c} is the big amount, so it stands alone.`, `${c} 是大的量，单独写在一边。`],
            ],
            [["Multiply the other two", "另外两个数相乘"], ["", ""], [`${c} = ${a} \\times ${b}`]],
          ],
          [`$${a} \\times ${b} = ${c}$, so the equation is true.`, `$${a} \\times ${b} = ${c}$，算式成立。`],
          timesBars(`${b}`, a, `${c}`),
        );
      },
      timesBars("8", 6, "48"),
    ),
  ],
};

/** representingComparisonStatementsAsEquations writes comparison statements as equations and solves for an unknown factor. */
export const representingComparisonStatementsAsEquations: TopicDef = {
  id: "representing-comparison-statements-as-equations",
  title: t("Representing Comparison Statements as Equations", "用算式表示比较语句"),
  summary: t(
    '"A is 4 times as many as B" becomes the equation A = 4 × B; "A is 4 more than B" becomes A = B + 4. An unknown can stand for any of the amounts: "48 is 6 times as many as n" is 48 = 6 × n, so n = 8.',
    '"A 是 B 的 4 倍"写成算式 A = 4 × B；"A 比 B 多 4"写成 A = B + 4。未知数可以表示其中任何一个量："48 是 n 的 6 倍"即 48 = 6 × n，所以 n = 8。',
  ),
  intro: t(
    'Mia has 3 times as many shells as Leo. Leo has 9. We do not know Mia\'s number yet, so call it $m$. Then $m = 3 \\times 9 = 27$.\n\nCheck: 27 shells make 3 piles of 9.\n\nIn this lesson we write "times as many" and "more than" as equations, and find an unknown factor.',
    "米娅的贝壳数是利奥的 3 倍，利奥有 9 个。米娅有多少个还不知道，就用 $m$ 表示。那么 $m = 3 \\times 9 = 27$。\n\n检验：27 个贝壳正好分成 3 堆，每堆 9 个。\n\n本课我们把“几倍”和“多几”写成算式，并求出未知的因数。",
  ),
  prerequisites: ["interpreting-multiplication-equations-as-a-comparison"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.1", "4.OA.A.2"),
  knowledgePoints: [
    point(
      "writing-comparison-equations",
      ["Writing the equation", "写出算式"],
      [
        '"Times as many" means multiply. "More than" means add. Mia has 3 times as many shells as Leo, who has 9. With $m$ for Mia\'s shells: $m = 3 \\times 9$. If she had 3 more than Leo, it would be $m = 9 + 3$.\n\nCheck: $3 \\times 9 = 27$ is three piles of 9. $9 + 3 = 12$ is Leo\'s pile and 3 more.\n\n> **Watch out.** Read the words. "3 times as many" is not "3 more".',
        "“是……的几倍”用乘法，“比……多几”用加法。米娅的贝壳数是利奥的 3 倍，利奥有 9 个。用 $m$ 表示米娅的贝壳数：$m = 3 \\times 9$。如果她比利奥多 3 个，就是 $m = 9 + 3$。\n\n检验：$3 \\times 9 = 27$ 是 3 堆 9 个；$9 + 3 = 12$ 是利奥的一堆再多 3 个。\n\n> **注意。** 看清字眼。“3 倍”不是“多 3”。",
      ],
      (rng) => {
        const [p, q] = rng.sample(names, 2);
        const th = rng.pick(things);
        const k = rng.int(2, 9);
        const b = rng.int(3, 15);
        const times = rng.bool();
        const right = times ? `m = ${k} \\times ${b}` : `m = ${b} + ${k}`;
        return pickedMath(
          rng,
          times
            ? [
                `${p} has ${k} times as many ${th.en} as ${q}. ${q} has ${b}. Which equation gives ${p}'s number $m$?`,
                `${p} 的${th.zh.slice(1)}数是 ${q} 的 ${k} 倍。${q} 有 ${b} ${th.zh}。哪个算式能求出 ${p} 的数量 $m$？`,
              ]
            : [
                `${p} has ${k} more ${th.en} than ${q}. ${q} has ${b}. Which equation gives ${p}'s number $m$?`,
                `${p} 的${th.zh.slice(1)}比 ${q} 多 ${k} ${th.zh.slice(0, 1)}。${q} 有 ${b} ${th.zh}。哪个算式能求出 ${p} 的数量 $m$？`,
              ],
          right,
          [
            times
              ? [`m = ${b} + ${k}`, `That is ${k} more. ${k} times as many means multiply.`, `这是多 ${k}。${k} 倍要用乘法。`]
              : [`m = ${k} \\times ${b}`, `That is ${k} times as many. ${k} more means add.`, `这是 ${k} 倍。多 ${k} 要用加法。`],
            [`m = ${b} - ${k}`, `That makes ${p}'s number smaller. ${p} has more.`, `这让 ${p} 的数量变少了，${p} 的更多。`],
            [`m = ${b} \\div ${k}`, `That makes ${p}'s number smaller. ${p} has more.`, `这让 ${p} 的数量变少了，${p} 的更多。`],
          ],
          [
            [
              ["Read the comparison", "读懂比较"],
              times
                ? [`"${k} times as many" means ${k} groups of ${q}'s ${b}.`, `“${k} 倍”表示 ${k} 个 ${q} 的 ${b}。`]
                : [`"${k} more" means ${q}'s ${b} and ${k} extra.`, `“多 ${k}”表示 ${q} 的 ${b} 再多 ${k}。`],
            ],
            [["Write the equation", "写出算式"], ["", ""], [right]],
          ],
          times
            ? [
                `$m = ${k * b}$, and ${k * b} shared into ${k} equal groups gives ${b} in each.`,
                `$m = ${k * b}$，把 ${k * b} 平均分成 ${k} 份，每份是 ${b}。`,
              ]
            : [`$m = ${b + k}$, and $${b + k} - ${b} = ${k}$ more.`, `$m = ${b + k}$，$${b + k} - ${b} = ${k}$，正好多 ${k}。`],
        );
      },
      tapeFigure(
        [{ pieces: [{ size: 9, text: "9", lit: true }] }, { total: "m", pieces: range0(3).map(() => ({ size: 9, text: "9" })) }],
        ["A bar of 9, and a bar three times as long marked m.", "一个长条表示 9，另一个长条是它的 3 倍，标着 m。"],
      ),
    ),
    point(
      "solving-for-an-unknown-factor",
      ["Unknown factors", "求未知因数"],
      [
        '"56 is 7 times as many as $n$" is the equation $56 = 7 \\times n$. The unknown $n$ is a factor. Divide the product by the known factor: $n = 56 \\div 7 = 8$.\n\nCheck: put it back. $7 \\times 8 = 56$.\n\n> **Watch out.** Do not multiply $56 \\times 7$. The unknown is the small amount, so divide.',
        "“56 是 $n$ 的 7 倍”写成算式 $56 = 7 \\times n$。未知数 $n$ 是一个因数，用积除以已知的因数：$n = 56 \\div 7 = 8$。\n\n检验：代回去，$7 \\times 8 = 56$。\n\n> **注意。** 不要算 $56 \\times 7$。未知的是小的量，要用除法。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const n = rng.int(2, 12);
        const c = k * n;
        return answered(
          [`$${c}$ is $${k}$ times as many as $n$. Find $n$.`, `$${c}$ 是 $n$ 的 $${k}$ 倍。求 $n$。`],
          n,
          [
            [["Write the equation", "写出算式"], ["", ""], [`${c} = ${k} \\times n`]],
            [["Divide by the known factor", "用积除以已知因数"], ["", ""], [`n = ${c} \\div ${k} = ${n}`]],
          ],
          [`Put it back: $${k} \\times ${n} = ${c}$.`, `代回去：$${k} \\times ${n} = ${c}$。`],
          [
            [
              c * k,
              `That multiplies. ${c} is the big amount, so divide to find the small one.`,
              `这是乘了。${c} 是大的量，求小的量要用除法。`,
            ],
            [c - k, "That subtracts. Times as many means divide back.", "这是减法。倍数关系要用除法倒推。"],
            [c + k, "That adds. Times as many means divide back.", "这是加法。倍数关系要用除法倒推。"],
          ],
        );
      },
      timesBars("n", 7, "56"),
    ),
  ],
};

/** wordProblemsInvolvingAdditiveAndMultiplicativeComparison tells "times as many" from "more than". */
export const wordProblemsInvolvingAdditiveAndMultiplicativeComparison: TopicDef = {
  id: "word-problems-involving-additive-and-multiplicative-comparison",
  title: t("Word Problems Involving Additive and Multiplicative Comparison", "关于相差与倍数比较的应用题"),
  summary: t(
    '"How many more" compares by subtraction; "how many times as many" compares by division. A red ribbon of 24 cm and a blue one of 6 cm: the red one is 24 − 6 = 18 cm longer, and 24 ÷ 6 = 4 times as long.',
    '"多多少"用减法比较；"是几倍"用除法比较。红丝带长 24 厘米，蓝丝带长 6 厘米：红丝带长 24 − 6 = 18 厘米，是蓝丝带的 24 ÷ 6 = 4 倍。',
  ),
  intro: t(
    "A red ribbon is 24 cm long. A blue ribbon is 6 cm long. Lay them side by side. The red one sticks out by $24 - 6 = 18$ cm. Four blue ribbons end to end match the red one, so it is $24 \\div 6 = 4$ times as long.\n\nCheck: $6 + 18 = 24$, and $4 \\times 6 = 24$.\n\nIn this lesson we decide when to compare by subtracting and when by dividing or multiplying.",
    "红丝带长 24 厘米，蓝丝带长 6 厘米。把它们并排放，红丝带长出 $24 - 6 = 18$ 厘米。4 条蓝丝带首尾相接正好和红丝带一样长，所以红丝带是蓝丝带的 $24 \\div 6 = 4$ 倍。\n\n检验：$6 + 18 = 24$，$4 \\times 6 = 24$。\n\n本课我们判断什么时候用减法比较，什么时候用乘除法比较。",
  ),
  prerequisites: ["representing-comparison-statements-as-equations", "relationship-between-multiplication-and-division"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.A.2"),
  knowledgePoints: [
    point(
      "finding-an-amount-from-a-comparison",
      ["Finding the larger or smaller amount", "求较大量或较小量"],
      [
        "A dog weighs 5 times as much as a 4 kg cat. Five cats make one dog, so the dog weighs $5 \\times 4 = 20$ kg. Going the other way, a box holds 36 pens, 4 times as many as a cup. The cup holds $36 \\div 4 = 9$.\n\nCheck: $4 \\times 9 = 36$.\n\n> **Watch out.** Multiply to find the bigger amount. Divide to find the smaller one.",
        "狗的体重是 4 千克的猫的 5 倍。5 只猫才和一只狗一样重，所以狗重 $5 \\times 4 = 20$ 千克。反过来，一盒装 36 支笔，是一杯的 4 倍，那么一杯装 $36 \\div 4 = 9$ 支。\n\n检验：$4 \\times 9 = 36$。\n\n> **注意。** 求大的量用乘法，求小的量用除法。",
      ],
      (rng) => {
        const [p, q] = rng.sample(names, 2);
        const th = rng.pick(things);
        const k = rng.int(2, 9);
        const b = rng.int(3, 20);
        const larger = rng.bool();
        return larger
          ? answered(
              [
                `${q} has ${b} ${th.en}. ${p} has ${k} times as many. How many ${th.en} does ${p} have?`,
                `${q} 有 ${b} ${th.zh}。${p} 的数量是 ${q} 的 ${k} 倍。${p} 有多少${th.zh.slice(1)}？`,
              ],
              k * b,
              [
                [
                  ["Decide the operation", "确定运算"],
                  [`${p} has ${k} groups of ${b}, so multiply.`, `${p} 有 ${k} 个 ${b}，所以用乘法。`],
                ],
                [["Multiply", "计算"], ["", ""], [`${k} \\times ${b} = ${k * b}`]],
              ],
              [
                `Share ${k * b} into ${k} equal groups: $${k * b} \\div ${k} = ${b}$, ${q}'s number.`,
                `把 ${k * b} 平均分成 ${k} 份：$${k * b} \\div ${k} = ${b}$，正是 ${q} 的数量。`,
              ],
              [
                [k + b, `That adds ${k}. ${k} times as many means multiply.`, `这是加了 ${k}。${k} 倍要用乘法。`],
                [b, `That is ${q}'s number. ${p} has more.`, `这是 ${q} 的数量，${p} 的更多。`],
              ],
            )
          : answered(
              [
                `${p} has ${k * b} ${th.en}, which is ${k} times as many as ${q}. How many ${th.en} does ${q} have?`,
                `${p} 有 ${k * b} ${th.zh}，是 ${q} 的 ${k} 倍。${q} 有多少${th.zh.slice(1)}？`,
              ],
              b,
              [
                [
                  ["Decide the operation", "确定运算"],
                  [`${k * b} is ${k} groups of ${q}'s amount, so divide.`, `${k * b} 是 ${k} 个 ${q} 的数量，所以用除法。`],
                ],
                [["Divide", "计算"], ["", ""], [`${k * b} \\div ${k} = ${b}`]],
              ],
              [`$${k} \\times ${b} = ${k * b}$, ${p}'s number.`, `$${k} \\times ${b} = ${k * b}$，正是 ${p} 的数量。`],
              [
                [k * b - k, `That subtracts ${k}. Times as many means divide.`, `这是减了 ${k}。倍数关系要用除法。`],
                [k * b * k, `That multiplies. ${q} has fewer, so divide.`, `这是乘了。${q} 的更少，要用除法。`],
              ],
            );
      },
      timesBars("4", 5, "20"),
    ),
    point(
      "more-than-versus-times-as-many",
      ["How many more or how many times?", "多多少还是几倍"],
      [
        '"How many more" asks for the extra piece, so subtract. "How many times as many" asks how many copies fit, so divide. For 35 and 7: 35 is $35 - 7 = 28$ more than 7. It is $35 \\div 7 = 5$ times as many.\n\nCheck: $7 + 28 = 35$ and $5 \\times 7 = 35$.\n\n> **Watch out.** Read the question twice. "More" and "times" give different answers.',
        "“多多少”问的是多出来的部分，用减法。“是几倍”问的是能装下几个，用除法。35 和 7：35 比 7 多 $35 - 7 = 28$，是 7 的 $35 \\div 7 = 5$ 倍。\n\n检验：$7 + 28 = 35$，$5 \\times 7 = 35$。\n\n> **注意。** 题目要读两遍。“多多少”和“几倍”的答案不一样。",
      ],
      (rng) => {
        const [p, q] = rng.sample(names, 2);
        const k = rng.int(2, 9);
        const b = rng.int(3, 15);
        const a = k * b;
        const askTimes = rng.bool();
        return askTimes
          ? answered(
              [
                `${p} read ${a} pages and ${q} read ${b} pages. How many times as many pages did ${p} read?`,
                `${p} 读了 ${a} 页，${q} 读了 ${b} 页。${p} 读的页数是 ${q} 的几倍？`,
              ],
              k,
              [
                [
                  ["Decide the operation", "确定运算"],
                  [
                    '"How many times" asks how many copies of the smaller amount fit, so divide.',
                    "“几倍”问的是小的量能装下几个，所以用除法。",
                  ],
                ],
                [["Divide", "计算"], ["", ""], [`${a} \\div ${b} = ${k}`]],
              ],
              [`$${k} \\times ${b} = ${a}$.`, `$${k} \\times ${b} = ${a}$。`],
              [
                [a - b, "That is how many more. The question asks how many times.", "这是多多少，题目问的是几倍。"],
                [a + b, "That adds the pages. Compare them by dividing.", "这是把页数加起来了，要用除法比较。"],
              ],
            )
          : answered(
              [
                `${p} read ${a} pages and ${q} read ${b} pages. How many more pages did ${p} read?`,
                `${p} 读了 ${a} 页，${q} 读了 ${b} 页。${p} 比 ${q} 多读了多少页？`,
              ],
              a - b,
              [
                [
                  ["Decide the operation", "确定运算"],
                  ['"How many more" asks for the extra part, so subtract.', "“多多少”问的是多出来的部分，所以用减法。"],
                ],
                [["Subtract", "计算"], ["", ""], [`${a} - ${b} = ${a - b}`]],
              ],
              [`$${b} + ${a - b} = ${a}$.`, `$${b} + ${a - b} = ${a}$。`],
              [
                [k, "That is how many times as many. The question asks how many more.", "这是几倍，题目问的是多多少。"],
                [a + b, "That adds the pages. Compare them by subtracting.", "这是把页数加起来了，要用减法比较。"],
              ],
            );
      },
      tapeFigure(
        [
          { pieces: [{ size: 7, text: "7", lit: true }] },
          {
            pieces: [
              { size: 7, text: "7", lit: true },
              { size: 28, text: "28", dashed: true },
            ],
          },
        ],
        ["A bar of 7 and a bar of 35, with the extra 28 drawn dashed.", "一个长条是 7，另一个是 35，多出的 28 用虚线画出。"],
      ),
    ),
  ],
};

/** patternLine draws the first terms of a pattern on a number line with a jump from each term to the next. */
const patternLine = (terms: readonly number[], step: number): Figure => {
  const lo = Math.floor(Math.min(...terms) / step) * step;
  const hi = Math.ceil(Math.max(...terms) / step) * step;
  return lineFigure(
    {
      lo,
      hi,
      step,
      labels: terms,
      jumps: terms.slice(1).map((v, i) => [terms[i] ?? 0, v] as const),
      marks: [{ at: terms[terms.length - 1] ?? 0, result: true }],
    },
    [`A number line with jumps through ${terms.join(", ")}.`, `一条数轴，依次跳过 ${terms.join("、")}。`],
  );
};

/** generatingPatterns generates terms of a pattern from a rule. */
export const generatingPatterns: TopicDef = {
  id: "generating-patterns",
  title: t("Generating Patterns", "按规则生成数列"),
  summary: t(
    'A rule such as "start at 5 and add 4" generates the pattern 5, 9, 13, 17, …. Rules can also multiply, or combine two steps, such as "multiply by 2, then add 1".',
    '像"从 5 开始，每次加 4"这样的规则生成数列 5, 9, 13, 17, …。规则也可以是乘法，或者两步组合，比如"乘 2，再加 1"。',
  ),
  intro: t(
    'A frog sits on 7. Each jump takes it 5 further. It lands on 12, then 17, then 22. The rule "add 5" makes the pattern $7, 12, 17, 22, \\dots$\n\nCheck: from 7 to 22 is 3 jumps of 5. $7 + 3 \\times 5 = 22$.\n\nIn this lesson we use a rule to make the numbers of a pattern, one after another.',
    "一只青蛙在 7 上，每跳一次向前 5。它落在 12，再落在 17，然后是 22。规则“加 5”生成数列 $7, 12, 17, 22, \\dots$\n\n检验：从 7 到 22 跳了 3 次，每次 5，$7 + 3 \\times 5 = 22$。\n\n本课我们按规则，一个接一个地写出数列里的数。",
  ),
  prerequisites: ["adding-two-digit-whole-numbers", "products-and-factors"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.C.5"),
  knowledgePoints: [
    point(
      "terms-of-a-pattern-from-a-rule",
      ["Following a one-step rule", "按一步规则"],
      [
        "A rule tells how to get the next number from the one before. Start at the first number and use the rule again and again. Start at 7 and add 5: $7, 12, 17, 22, 27$. The 5th number is 27.\n\nCheck: the 5th number is 4 jumps after the first. $7 + 4 \\times 5 = 27$.\n\n> **Watch out.** The 5th number needs only 4 jumps, not 5. The first number is already there.",
        "规则告诉我们怎样由前一个数得到下一个数。从第一个数开始，一次又一次地用规则。从 7 开始，每次加 5：$7, 12, 17, 22, 27$。第 5 个数是 27。\n\n检验：第 5 个数在第一个数之后跳 4 次。$7 + 4 \\times 5 = 27$。\n\n> **注意。** 第 5 个数只要跳 4 次，不是 5 次。第一个数本来就在那里。",
      ],
      (rng) => {
        const mult = rng.bool(0.3);
        const a = mult ? rng.int(1, 5) : rng.int(1, 30);
        const d = mult ? rng.int(2, 3) : rng.int(2, 12);
        const n = mult ? rng.int(4, 6) : rng.int(5, 10);
        const terms = range0(n).map((i) => (mult ? a * d ** i : a + i * d));
        const value = terms[n - 1] ?? 0;
        return answered(
          mult
            ? [
                `A pattern starts at $${a}$, and the rule is "multiply by $${d}$". What is the ${n}th number?`,
                `一个数列从 $${a}$ 开始，规则是“乘 $${d}$”。第 ${n} 个数是多少？`,
              ]
            : [
                `A pattern starts at $${a}$, and the rule is "add $${d}$". What is the ${n}th number?`,
                `一个数列从 $${a}$ 开始，规则是“加 $${d}$”。第 ${n} 个数是多少？`,
              ],
          value,
          [
            [
              ["Count the steps", "数一数用几次规则"],
              [`The ${n}th number comes ${n - 1} steps after the first.`, `第 ${n} 个数在第一个数之后，要用 ${n - 1} 次规则。`],
            ],
            [["Use the rule each time", "每次都用规则"], ["", ""], [terms.join(", ")]],
          ],
          mult
            ? [
                `Multiply by ${d} ${n - 1} times at once: $${a} \\times ${d}^{${n - 1}} = ${value}$.`,
                `一次乘 ${n - 1} 个 ${d}：$${a} \\times ${d}^{${n - 1}} = ${value}$。`,
              ]
            : [
                `Add all the steps at once: $${a} + ${n - 1} \\times ${d} = ${value}$.`,
                `把每次加的一起算：$${a} + ${n - 1} \\times ${d} = ${value}$。`,
              ],
          mult
            ? [
                [
                  a * d ** n,
                  `That uses the rule ${n} times. The ${n}th number needs only ${n - 1}.`,
                  `这是用了 ${n} 次规则，第 ${n} 个数只要用 ${n - 1} 次。`,
                ],
                [terms[n - 2] ?? 0, `That is the number before the ${n}th.`, `这是第 ${n} 个数前面的数。`],
              ]
            : [
                [
                  a + n * d,
                  `That uses the rule ${n} times. The ${n}th number needs only ${n - 1}.`,
                  `这是用了 ${n} 次规则，第 ${n} 个数只要用 ${n - 1} 次。`,
                ],
                [terms[n - 2] ?? 0, `That is the number before the ${n}th.`, `这是第 ${n} 个数前面的数。`],
              ],
        );
      },
      patternLine([7, 12, 17, 22, 27], 5),
    ),
    point(
      "patterns-from-two-step-rules",
      ["Following a two-step rule", "按两步规则"],
      [
        'Some rules have two steps. Do both steps to get each new number. Then start again from that number. Start at 1 with "multiply by 2, then add 1": $1 \\times 2 + 1 = 3$, $3 \\times 2 + 1 = 7$, $7 \\times 2 + 1 = 15$.\n\nCheck: work back from 15. $15 - 1 = 14$ and $14 \\div 2 = 7$.\n\n> **Watch out.** Use the new number each time. Do not keep starting from 1.',
        "有的规则有两步。每得到一个新数，都要做完两步，再从这个新数开始。从 1 开始，规则是“乘 2，再加 1”：$1 \\times 2 + 1 = 3$，$3 \\times 2 + 1 = 7$，$7 \\times 2 + 1 = 15$。\n\n检验：从 15 倒推，$15 - 1 = 14$，$14 \\div 2 = 7$。\n\n> **注意。** 每次都用新得到的数，不要总从 1 开始。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const m = rng.int(2, 3);
        const c = rng.int(1, 5);
        const terms = [a];
        while (terms.length < 4) terms.push((terms[terms.length - 1] ?? 0) * m + c);
        const [, t1 = 0, t2 = 0, value = 0] = terms;
        return answered(
          [
            `A pattern starts at $${a}$, and the rule is "multiply by $${m}$, then add $${c}$". What is the 4th number?`,
            `一个数列从 $${a}$ 开始，规则是“乘 $${m}$，再加 $${c}$”。第 4 个数是多少？`,
          ],
          value,
          [
            [
              ["Make the 2nd and 3rd numbers", "求第 2 个和第 3 个数"],
              ["", ""],
              [`${a} \\times ${m} + ${c} = ${t1}`, `${t1} \\times ${m} + ${c} = ${t2}`],
            ],
            [["Make the 4th number", "求第 4 个数"], ["", ""], [`${t2} \\times ${m} + ${c} = ${value}`]],
          ],
          [
            `Work back from ${value}: $${value} - ${c} = ${value - c}$ and $${value - c} \\div ${m} = ${t2}$, the 3rd number.`,
            `从 ${value} 倒推：$${value} - ${c} = ${value - c}$，$${value - c} \\div ${m} = ${t2}$，正是第 3 个数。`,
          ],
          [
            [t2, "That is the 3rd number. Use the rule once more.", "这是第 3 个数，还要再用一次规则。"],
            [t2 * m, `That only multiplies. Add ${c} as well.`, `这只乘了，还要加 ${c}。`],
            [(t2 + c) * m, `That adds before multiplying. Multiply first, then add ${c}.`, `这是先加后乘了。要先乘，再加 ${c}。`],
          ],
        );
      },
      patternLine([1, 3, 7, 15], 1),
    ),
  ],
};

/** identifyingPatterns finds the rule of a pattern and continues it. */
export const identifyingPatterns: TopicDef = {
  id: "identifying-patterns",
  title: t("Identifying Patterns", "找出数列的规律"),
  summary: t(
    "To find the rule of a pattern, compare neighboring numbers: if the difference is always the same, the rule adds it; if each number is the same multiple of the one before, the rule multiplies.",
    "要找出数列的规律，就比较相邻的数：如果差总是相同，规则就是加上这个差；如果每个数都是前一个数的同一倍数，规则就是乘法。",
  ),
  intro: t(
    "Tom saves money each week. His totals are \\$4, \\$11, \\$18, \\$25. What will he have next week? From 4 to 11 is 7. From 11 to 18 is 7. From 18 to 25 is 7. He saves \\$7 a week, so next week he has $25 + 7 = 32$ dollars.\n\nCheck: 32 is also 4 jumps of 7 after the 4th number back, $4 + 4 \\times 7 = 32$.\n\nIn this lesson we find the rule of a pattern, continue it, and fill in a missing number.",
    "汤姆每周存钱，存款依次是 4 元、11 元、18 元、25 元。下周他有多少？从 4 到 11 多 7，从 11 到 18 多 7，从 18 到 25 也多 7。他每周存 7 元，所以下周有 $25 + 7 = 32$ 元。\n\n检验：从第一周的 4 元算起，跳 4 次 7：$4 + 4 \\times 7 = 32$。\n\n本课我们找出数列的规则，接着往下写，并填出缺少的数。",
  ),
  prerequisites: ["generating-patterns"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.OA.C.5"),
  knowledgePoints: [
    point(
      "continuing-a-pattern",
      ["The next number", "下一个数"],
      [
        "Compare each number with the one before it. Find the rule. Check that it works for every step. Then use it once more. In $4, 11, 18, 25$ each number is 7 more, so the next is $25 + 7 = 32$.\n\nCheck: $32 - 25 = 7$, the same step as before.\n\n> **Watch out.** Check every step, not just the first one. Some patterns multiply instead of add.",
        "比较每个数和它前面的数，找出规则。检查规则对每一步都成立，再用一次。在 $4, 11, 18, 25$ 中，每个数都多 7，所以下一个数是 $25 + 7 = 32$。\n\n检验：$32 - 25 = 7$，和前面每一步一样。\n\n> **注意。** 每一步都要检查，不能只看第一步。有的数列是乘，不是加。",
      ],
      (rng) => {
        const mult = rng.bool(0.3);
        const a = mult ? rng.int(1, 6) : rng.int(1, 40);
        const d = mult ? rng.int(2, 4) : rng.int(3, 15);
        const terms = range0(5).map((i) => (mult ? a * d ** i : a + i * d));
        const [, , t2 = 0, t3 = 0, value = 0] = terms;
        return answered(
          [
            `What is the next number in the pattern $${terms.slice(0, 4).join(", ")}, \\dots$?`,
            `数列 $${terms.slice(0, 4).join(", ")}, \\dots$ 的下一个数是多少？`,
          ],
          value,
          [
            [
              ["Find the rule", "找出规则"],
              mult
                ? [`Each number is ${d} times the one before.`, `每个数都是前一个数的 ${d} 倍。`]
                : [`Each number is ${d} more than the one before.`, `每个数都比前一个数多 ${d}。`],
            ],
            [["Use the rule once more", "再用一次规则"], ["", ""], [mult ? `${t3} \\times ${d} = ${value}` : `${t3} + ${d} = ${value}`]],
          ],
          mult
            ? [
                `$${value} \\div ${t3} = ${d}$, the same as $${t3} \\div ${t2}$.`,
                `$${value} \\div ${t3} = ${d}$，和 $${t3} \\div ${t2}$ 一样。`,
              ]
            : [`$${value} - ${t3} = ${d}$, the same as $${t3} - ${t2}$.`, `$${value} - ${t3} = ${d}$，和 $${t3} - ${t2}$ 一样。`],
          mult
            ? [
                [
                  t3 + (t3 - t2),
                  "That adds the last difference. The differences grow, so the rule multiplies.",
                  "这是加上了最后一个差。差越来越大，规则是乘法。",
                ],
                [t3 * 2, `That doubles. The rule multiplies by ${d}.`, `这是乘 2，规则是乘 ${d}。`],
              ]
            : [
                [t3 + d + 1, `That adds one too many. The step is ${d}.`, `这多加了 1，每次加 ${d}。`],
                [t3 * 2, `That doubles. The rule adds ${d}.`, `这是乘 2，规则是加 ${d}。`],
              ],
        );
      },
      patternLine([4, 11, 18, 25, 32], 7),
    ),
    point(
      "finding-a-missing-number-in-a-pattern",
      ["A missing number", "缺少的数"],
      [
        "Find the step from two known neighbors. Then use it to fill the gap. In $9, 15, \\square, 27, 33$ the step is 6. The missing number is $15 + 6 = 21$.\n\nCheck: one more step should give the next number. $21 + 6 = 27$.\n\n> **Watch out.** Find the step from two numbers that sit side by side. 15 and 27 are two steps apart.",
        "用两个挨着的已知数求出每一步是多少，再用它填空。在 $9, 15, \\square, 27, 33$ 中，每次加 6。缺少的数是 $15 + 6 = 21$。\n\n检验：再走一步应该得到后面的数，$21 + 6 = 27$。\n\n> **注意。** 要用挨着的两个数求每一步。15 和 27 之间隔了两步。",
      ],
      (rng) => {
        const a = rng.int(1, 50);
        const d = rng.int(2, 25);
        const terms = range0(5).map((i) => a + i * d);
        const gap = rng.int(1, 3);
        const value = terms[gap] ?? 0;
        const shown = terms.map((x, i) => (i === gap ? "\\square" : String(x)));
        const [x, y] = gap === 1 ? [terms[3] ?? 0, terms[4] ?? 0] : [terms[0] ?? 0, terms[1] ?? 0];
        return answered(
          [`Find the missing number in the pattern $${shown.join(", ")}$.`, `求数列 $${shown.join(", ")}$ 中缺少的数。`],
          value,
          [
            [["Find the step", "求每一步"], ["", ""], [`${y} - ${x} = ${d}`]],
            [["Fill the gap", "填空"], ["", ""], [`${terms[gap - 1]} + ${d} = ${value}`]],
          ],
          [
            `One more step gives the next number: $${value} + ${d} = ${terms[gap + 1]}$.`,
            `再走一步得到后面的数：$${value} + ${d} = ${terms[gap + 1]}$。`,
          ],
          [
            [value + d, "That is one step too far. The gap is right after the number before it.", "这多走了一步。空格紧挨在前一个数后面。"],
            [value + 1, `That is off by one. Each step is ${d}.`, `这差了 1，每一步是 ${d}。`],
            [
              ((terms[gap - 1] ?? 0) + (terms[gap + 1] ?? 0)) / 2 + d,
              "That adds an extra step. The gap is halfway between its neighbors.",
              "这多加了一步。空格正好在两边数的中间。",
            ],
          ],
        );
      },
      lineFigure(
        {
          lo: 9,
          hi: 33,
          step: 6,
          labels: [9, 15, 27, 33],
          marks: [{ at: 21, text: "?" }],
          jumps: [
            [15, 21],
            [21, 27],
          ],
        },
        [
          "A number line through 9, 15, 27 and 33 with the missing 21 marked by a question mark.",
          "一条数轴经过 9、15、27、33，缺少的 21 处画着问号。",
        ],
      ),
    ),
  ],
};

// ---------------------------------------------------------------------------
// Place value

/** chartOf writes the digits of n under the place values of a chart with `places` columns, blank on the left. */
const chartRow = (n: number, places: number): string[] =>
  String(n)
    .padStart(places, " ")
    .split("")
    .map((c) => c.trim());

/** placeValueKPs are the knowledge points of a place value topic for numbers with lo to hi digits. */
function placeValueKPs(lo: number, hi: number): KnowledgePointDef[] {
  const sample = hi <= 4 ? 5382 : 4706215;
  const chart = (lit: number) => placeChartFigure(placesOf(String(sample).length), [chartRow(sample, String(sample).length)], lit);
  return [
    point(
      `digits-in-places-${hi}`,
      ["The digit in a place", "某一位上的数字"],
      hi <= 4
        ? [
            "Each digit sits in a place. From the right, the places are ones, tens, hundreds and thousands. In $5{,}382$, the 2 is in the ones place and the 5 is in the thousands place.\n\nCheck: $5{,}382$ is 5 thousands, 3 hundreds, 8 tens and 2 ones.\n\n> **Watch out.** Count the places from the right, starting at the ones.",
            "每个数字都在一个数位上。从右往左依次是个位、十位、百位、千位。在 $5{,}382$ 中，2 在个位，5 在千位。\n\n检验：$5{,}382$ 是 5 个千、3 个百、8 个十和 2 个一。\n\n> **注意。** 数位要从右边的个位开始数。",
          ]
        : [
            "After the thousands come ten thousands, hundred thousands and millions. Commas split the digits into groups of three. In $4{,}706{,}215$ the 4 is in the millions place and the 0 is in the ten thousands place.\n\nCheck: count from the right: ones, tens, hundreds, thousands, ten thousands. The fifth digit from the right is 0.\n\n> **Watch out.** A zero still holds a place. Count it when you count places.",
            "千位之后是万位、十万位、百万位。逗号把数字每三位分成一组。在 $4{,}706{,}215$ 中，4 在百万位，0 在万位。\n\n检验：从右往左数：个位、十位、百位、千位、万位。右起第五个数字是 0。\n\n> **注意。** 0 也占一个数位，数数位时要算上它。",
          ],
      (rng) => {
        const n = randomWithDigits(rng, rng.int(lo, hi));
        const len = String(n).length;
        const k = rng.int(hi <= 4 ? 0 : 3, len - 1);
        const d = digitAt(n, k);
        const names = range0(k + 1).map((i) => placeNames[i]!);
        return answered(
          [`Which digit is in the ${placeNames[k]!.en} place of $${fmt(n)}$?`, `$${fmt(n)}$ 的${placeNames[k]!["zh-CN"]}上是哪个数字？`],
          d,
          [
            [
              ["Count places from the right", "从右往左数数位"],
              [`${names.map((x) => x.en).join(", ")}.`, `${names.map((x) => x["zh-CN"]).join("、")}。`],
            ],
            [
              ["Read the digit", "读出数字"],
              [`The ${placeNames[k]!.en} place holds ${d}.`, `${placeNames[k]!["zh-CN"]}上是 ${d}。`],
            ],
          ],
          [
            `The value of that digit is $${d} \\times ${fmt(10 ** k)} = ${fmt(d * 10 ** k)}$, and $${fmt(n)}$ does contain $${fmt(d * 10 ** k)}$ in its expanded form.`,
            `这个数字表示 $${d} \\times ${fmt(10 ** k)} = ${fmt(d * 10 ** k)}$，$${fmt(n)}$ 的展开式里正有 $${fmt(d * 10 ** k)}$ 这一项。`,
          ],
          [
            [digitAt(n, k + 1), "That digit is one place too far left.", "这个数字往左多数了一位。"],
            [digitAt(n, Math.max(0, k - 1)), "That digit is one place too far right.", "这个数字往右多数了一位。"],
            [
              digitAt(n, len - 1 - k),
              "That counts the places from the left. Start at the ones on the right.",
              "这是从左边数的。要从右边的个位开始数。",
            ],
          ],
          { figure: digitsChart([n], len - 1 - k) },
        );
      },
      chart(String(sample).length - (hi <= 4 ? 4 : 5)),
    ),
    point(
      `values-of-digits-${hi}`,
      ["The value of a digit", "数字表示的值"],
      hi <= 4
        ? [
            "A digit's value is the digit times its place. In $5{,}382$ the 3 is in the hundreds place. It is worth $3 \\times 100 = 300$.\n\nCheck: $5{,}382 = 5{,}000 + 300 + 80 + 2$. The 3 gives 300.\n\n> **Watch out.** The value is not just the digit. The 3 here is worth 300, not 3.",
            "数字表示的值 = 数字 × 它所在数位的计数单位。在 $5{,}382$ 中，3 在百位，表示 $3 \\times 100 = 300$。\n\n检验：$5{,}382 = 5{,}000 + 300 + 80 + 2$，3 表示 300。\n\n> **注意。** 表示的值不只是这个数字。这里的 3 表示 300，不是 3。",
          ]
        : [
            "Find the place of the digit. Then multiply the digit by that place. In $4{,}706{,}215$ the 7 is in the hundred thousands place. It is worth $700{,}000$.\n\nCheck: the 7 has five digits to its right, so its value is 7 followed by five zeros.\n\n> **Watch out.** Count every digit to its right, zeros too. Each one adds a zero to the value.",
            "先找出数字所在的数位，再用数字乘这一位的计数单位。在 $4{,}706{,}215$ 中，7 在十万位，表示 $700{,}000$。\n\n检验：7 右边有五个数字，所以它的值是 7 后面跟五个 0。\n\n> **注意。** 右边的每个数字都要数，0 也要数。每数一个，值就多一个 0。",
          ],
      (rng) => {
        let n: number;
        let k: number;
        do {
          n = randomWithDigits(rng, rng.int(lo, hi));
          k = rng.int(hi <= 4 ? 0 : 2, String(n).length - 1);
        } while (digitAt(n, k) === 0 || digitsOf(n).filter((x) => x === digitAt(n, k)).length > 1);
        const d = digitAt(n, k);
        const value = d * 10 ** k;
        const len = String(n).length;
        return answered(
          [`What is the value of the digit $${d}$ in $${fmt(n)}$?`, `$${fmt(n)}$ 中的数字 $${d}$ 表示多少？`],
          value,
          [
            [
              ["Find its place", "找出数位"],
              [`The ${d} is in the ${placeNames[k]!.en} place.`, `${d} 在${placeNames[k]!["zh-CN"]}上。`],
            ],
            [["Multiply by the place", "乘计数单位"], ["", ""], [`${d} \\times ${fmt(10 ** k)} = ${fmt(value)}`]],
          ],
          [
            `There ${k === 1 ? "is 1 digit" : `are ${k} digits`} to the right of the ${d}, so its value is ${d} followed by ${k === 1 ? "one zero" : `${k} zeros`}: $${fmt(value)}$.`,
            `${d} 右边有 ${k} 个数字，所以它的值是 ${d} 后面跟 ${k} 个 0：$${fmt(value)}$。`,
          ],
          [
            [d, "That is only the digit. Multiply it by its place.", "这只是数字本身，还要乘它的计数单位。"],
            [d * 10 ** (k + 1), "That is one place too far left: one zero too many.", "这往左多算了一位，多了一个 0。"],
            [
              k > 0 ? d * 10 ** (k - 1) : d * 100,
              k > 0 ? "That is one place too far right: one zero too few." : "That moves the digit. It is in the ones place.",
              k > 0 ? "这往右少算了一位，少了一个 0。" : "这挪了数位，它在个位上。",
            ],
          ],
          { figure: digitsChart([n], len - 1 - k) },
        );
      },
      chart(String(sample).length - (hi <= 4 ? 3 : 6)),
    ),
  ];
}

/** placeValueWithNumbersUpToFourDigits names digits and their values in numbers up to 9,999. */
export const placeValueWithNumbersUpToFourDigits: TopicDef = {
  id: "place-value-with-numbers-up-to-four-digits",
  title: t("Place Value With Numbers Up to Four Digits", "四位数以内的数位"),
  summary: t(
    "The places of a four-digit number are, from the right, the ones, tens, hundreds and thousands. Each place is worth ten times the place to its right, so the value of a digit is the digit times 1, 10, 100 or 1,000.",
    "四位数的数位从右往左依次是个位、十位、百位和千位。每一位的单位是它右边一位的十倍，所以一个数字表示的值等于这个数字乘 1、10、100 或 1,000。",
  ),
  intro: t(
    "A school has 5,382 books. They come in big boxes of 1,000, crates of 100, stacks of 10 and single books. There are 5 boxes, 3 crates, 8 stacks and 2 single books. Each digit of 5,382 counts one size.\n\nCheck: $5{,}000 + 300 + 80 + 2 = 5{,}382$.\n\nIn this lesson we name the place of each digit and find what each digit is worth.",
    "学校有 5,382 本书。书装在每箱 1,000 本的大箱、每筐 100 本的筐、每摞 10 本的书摞里，还有单本。一共 5 箱、3 筐、8 摞和 2 本。5,382 的每个数字数的是一种。\n\n检验：$5{,}000 + 300 + 80 + 2 = 5{,}382$。\n\n本课我们说出每个数字所在的数位，并求出它表示多少。",
  ),
  prerequisites: ["understanding-three-digit-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1", "4.NBT.A.2"),
  knowledgePoints: placeValueKPs(3, 4),
};

/** placeValueWithNumbersUpToSevenDigits extends place value to the millions. */
export const placeValueWithNumbersUpToSevenDigits: TopicDef = {
  id: "place-value-with-numbers-up-to-seven-digits",
  title: t("Place Value With Numbers Up to Seven Digits", "七位数以内的数位"),
  summary: t(
    "After the thousands come the ten thousands, hundred thousands and millions places. Commas separate the digits into groups of three: 4,706,215.",
    "千位之后是万位、十万位和百万位。逗号把数字从右往左每三位分成一组：4,706,215。",
  ),
  intro: t(
    "A city has 4,706,215 people. That is a big number, so commas split it into groups of three: 4 | 706 | 215. The 4 means 4 millions. The 7 means 7 hundred thousands.\n\nCheck: 4 millions is $4{,}000{,}000$, and the rest, $706{,}215$, is less than a million.\n\nIn this lesson we read places up to the millions and find the value of each digit.",
    "一座城市有 4,706,215 人。数很大，所以用逗号每三位分一组：4 | 706 | 215。4 表示 4 个百万，7 表示 7 个十万。\n\n检验：4 个百万是 $4{,}000{,}000$，剩下的 $706{,}215$ 不到一百万。\n\n本课我们认识到百万位为止的数位，并求出每个数字表示多少。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-four-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1", "4.NBT.A.2"),
  knowledgePoints: placeValueKPs(5, 7),
};

/** Confusion is a number a reader might take for another one, with the reason. */
type Confusion = readonly [value: number, en: string, zh: string];

/** confusions are numbers a reader might confuse with n: zeros dropped or added, neighboring digits swapped, and a place too many, each with its reason. */
function confusions(n: number): Confusion[] {
  const s = String(n);
  const out = new Map<number, Confusion>();
  const add = (v: number, en: string, zh: string) => {
    if (v !== n && !out.has(v)) out.set(v, [v, en, zh]);
  };
  [...s].forEach((c, i) => {
    if (c === "0")
      add(
        Number(s.slice(0, i) + s.slice(i + 1)),
        "That leaves out a zero, so the digits slide into the wrong places.",
        "这漏掉了一个 0，数字都挪错了数位。",
      );
  });
  const inner = [...s].findIndex((c, i) => i > 0 && c !== "0");
  if (inner > 0) add(Number(`${s.slice(0, inner)}0${s.slice(inner)}`), "That adds a zero that is not there.", "这多写了一个 0。");
  for (let i = 0; i + 1 < s.length; i++) {
    if (s[i] !== s[i + 1] && !(i === 0 && s[1] === "0")) {
      add(
        Number(s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2)),
        "That swaps two digits next to each other.",
        "这把相邻的两个数字写反了。",
      );
    }
  }
  add(n * 10, "That has one place too many.", "这多了一位。");
  return [...out.values()];
}

/** numberWithZeros is a random number of d digits with at least one inner zero. */
function numberWithZeros(rng: Rng, d: number): number {
  for (;;) {
    const digits = [rng.int(1, 9), ...range0(d - 1).map(() => (rng.bool(0.4) ? 0 : rng.int(1, 9)))];
    if (digits.slice(1).includes(0)) return Number(digits.join(""));
  }
}

/** wordFormKP builds a knowledge point that converts between numbers and words. */
function wordFormKP(id: string, lo: number, hi: number, toWords: boolean): KnowledgePointDef {
  const sample = hi <= 4 ? 3045 : 2006300;
  const places = String(sample).length;
  const explanation: Pair = toWords
    ? hi <= 4
      ? [
          `Read the thousands, then the hundreds, then the last two digits. $3{,}045$ is "three thousand, forty-five". There are no hundreds, so we say nothing for them.\n\nCheck: "three thousand" is 3,000 and "forty-five" is 45. $3{,}000 + 45 = 3{,}045$.\n\n> **Watch out.** Do not say a name for a zero. 3,045 is not "three thousand, zero hundred, forty-five".`,
          `中文读数从高位读起。$3{,}045$ 读作“${wordsZh(3045)}”。百位是 0，中间的 0 要读一个“零”。\n\n检验：“三千”是 3,000，“四十五”是 45，$3{,}000 + 45 = 3{,}045$。\n\n> **注意。** 末尾的 0 不读，中间的 0 只读一个“零”。`,
        ]
      : [
          `Split the digits into groups of three. Read each group, then its name: million, thousand. $2{,}006{,}300$ is "two million, six thousand, three hundred".\n\nCheck: $2{,}000{,}000 + 6{,}000 + 300 = 2{,}006{,}300$.\n\n> **Watch out.** A group of zeros is not read at all, but it still holds its places.`,
          `中文按四位一级读：先读万级，再读个级。$2{,}006{,}300$ 读作“${wordsZh(2006300)}”。\n\n检验：$2{,}000{,}000 + 6{,}000 + 300 = 2{,}006{,}300$。\n\n> **注意。** 每级末尾的 0 不读，中间连续的 0 只读一个“零”。`,
        ]
    : hi <= 4
      ? [
          `Write a digit for every place: thousands, hundreds, tens, ones. Use 0 for a place the words skip. "Five thousand, twenty" is $5{,}020$.\n\nCheck: read it back. $5{,}020$ is five thousand and twenty.\n\n> **Watch out.** Keep the zeros. Without them, five thousand twenty becomes 520.`,
          `每个数位都要写一个数字：千位、百位、十位、个位。没读到的数位写 0。“${wordsZh(5020)}”写作 $5{,}020$。\n\n检验：再读一遍，$5{,}020$ 读作“${wordsZh(5020)}”。\n\n> **注意。** 0 要写上。不写 0，五千零二十就成了 520。`,
        ]
      : [
          `Write each group of three digits. Fill the empty places with zeros. "Two million, six thousand, three hundred" is $2{,}006{,}300$.\n\nCheck: there are three digits after each comma, and the number reads back the same.\n\n> **Watch out.** Each group after a comma needs exactly three digits. "Six thousand" in a million is written 006.`,
          `按级写：先写万级，再写个级，空着的数位写 0。“${wordsZh(2006300)}”写作 $2{,}006{,}300$。\n\n检验：每个逗号后面正好三位，再读一遍也一样。\n\n> **注意。** 逗号后面的每一组都要写满三位。`,
        ];
  return point(
    id,
    hi <= 4 ? ["Numbers up to 9,999", "9,999 以内的数"] : ["Numbers up to millions", "百万级的数"],
    explanation,
    (rng) => {
      const n = numberWithZeros(rng, rng.int(lo, hi));
      const wrong = confusions(n);
      const figure = digitsChart([n]);
      const walk: Walk[] = [
        [
          ["Split into groups", "分级"],
          [`The digits group as ${plain(n)}.`, `按级分开：${plain(n)}。`],
        ],
        [
          ["Read each group", "逐级读写"],
          [`${plain(n)} is read "${wordsEn(n)}".`, `${plain(n)} 读作“${wordsZh(n)}”。`],
        ],
      ];
      const check: Pair = [
        `Build it back from the words: $${expandedTex(n)} = ${fmt(n)}$.`,
        `按读法拼回来：$${expandedTex(n)} = ${fmt(n)}$。`,
      ];
      if (toWords) {
        return picked(
          rng,
          [`How is $${fmt(n)}$ written in words?`, `$${fmt(n)}$ 怎么读？`],
          [wordsEn(n), wordsZh(n)],
          rng
            .shuffle(wrong)
            .slice(0, 3)
            .map(([v, en, zh]) => [[wordsEn(v), wordsZh(v)], `That is ${plain(v)}. ${en}`, `那是 ${plain(v)}。${zh}`] as const),
          walk,
          check,
          figure,
        );
      }
      return answered([`Write the number in digits: ${wordsEn(n)}.`, `用数字写出：${wordsZh(n)}。`], n, walk, check, wrong.slice(0, 3), {
        figure,
      });
    },
    placeChartFigure(placesOf(places), [chartRow(sample, places)], [...String(sample)].indexOf("0")),
  );
}

/** writingWholeNumbersInWords chooses the word form of a number. */
export const writingWholeNumbersInWords: TopicDef = {
  id: "writing-whole-numbers-in-words",
  title: t("Writing Whole Numbers in Words", "用文字写整数"),
  summary: t(
    'To write a number in words, read each group of three digits and name the group: 2,006,300 is "two million, six thousand, three hundred". Zeros are not read, but they decide which places the other digits are in.',
    '把整数写成文字时，按数级读出每一级再加上级名：2,006,300 读作"二百万六千三百"。0 不单独读出（中间的 0 读作"零"），但它决定了其他数字所在的数位。',
  ),
  intro: t(
    'Mom writes a check for a car. The amount must be in words, so nobody can change it. The car costs \\$3,045. She writes "three thousand, forty-five".\n\nCheck: three thousand is 3,000, and forty-five is 45. Together they make 3,045.\n\nIn this lesson we write numbers up to the millions in words.',
    "妈妈填一张买车的支票，金额要用汉字写，别人就改不了。车价 3,045 元，她写“三千零四十五”。\n\n检验：三千是 3,000，四十五是 45，合起来是 3,045。\n\n本课我们把百万以内的数写成文字。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    wordFormKP("writing-four-digit-numbers-in-words", 4, 4, true),
    wordFormKP("writing-large-numbers-in-words", 5, 7, true),
  ],
};

/** readingWholeNumbersWrittenInWords writes numbers given in words as digits. */
export const readingWholeNumbersWrittenInWords: TopicDef = {
  id: "reading-whole-numbers-written-in-words",
  title: t("Reading Whole Numbers Written in Words", "读懂用文字表示的整数"),
  summary: t(
    'To write a number given in words, write each group and fill the places nobody mentions with zeros: "five thousand, twenty" is 5,020.',
    '把用文字表示的数写成数字时，写出每一级，没有提到的数位用 0 补上："五千零二十"写作 5,020。',
  ),
  intro: t(
    "A radio says that five thousand, twenty runners took part in a race. Write it in digits. Five thousands: 5 in the thousands place. No hundreds: 0. Twenty: 2 tens and 0 ones. So 5,020.\n\nCheck: read 5,020 aloud. It says five thousand, twenty.\n\nIn this lesson we turn numbers in words into digits, with zeros in the empty places.",
    "广播说有五千零二十人参加了长跑。用数字写出来：五千，千位写 5；没有百，百位写 0；二十，十位写 2，个位写 0。所以是 5,020。\n\n检验：读一读 5,020，正是五千零二十。\n\n本课我们把文字表示的数写成数字，空着的数位写 0。",
  ),
  prerequisites: ["writing-whole-numbers-in-words"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    wordFormKP("reading-four-digit-numbers-written-in-words", 4, 4, false),
    wordFormKP("reading-large-numbers-written-in-words", 5, 7, false),
  ],
};

/** expandedChart draws a number above the rows of its expanded form, each term in its own row of a place-value chart. */
const expandedChart = (n: number): Figure => {
  const len = String(n).length;
  const terms = expandedTerms(n);
  return placeChartFigure(placesOf(len), [...terms.map((x) => chartRow(x, len)), chartRow(n, len)], -1);
};

/** convertingFromStandardFormToExpandedForm writes numbers in expanded form. */
export const convertingFromStandardFormToExpandedForm: TopicDef = {
  id: "converting-from-standard-form-to-expanded-form",
  title: t("Converting From Standard Form to Expanded Form", "把标准形式改写成展开形式"),
  summary: t(
    "The expanded form of a number is the sum of the values of its digits: 40,605 = 40,000 + 600 + 5. Zeros contribute nothing and are left out.",
    "一个数的展开形式是各个数字所表示的值之和：40,605 = 40,000 + 600 + 5。0 不表示任何值，可以省略。",
  ),
  intro: t(
    "Sam pays \\$7,308 in bills. He has \\$1,000 bills, \\$100 bills and \\$1 bills, but no \\$10 bills. He pays 7 thousands, 3 hundreds and 8 ones: $7{,}000 + 300 + 8$.\n\nCheck: $7{,}000 + 300 + 8 = 7{,}308$.\n\nIn this lesson we write a number as the sum of the values of its digits.",
    "萨姆付 7,308 元，用的是 1,000 元、100 元和 1 元的纸币，没有 10 元的。他付 7 个千、3 个百和 8 个一：$7{,}000 + 300 + 8$。\n\n检验：$7{,}000 + 300 + 8 = 7{,}308$。\n\n本课我们把一个数写成各个数字所表示的值的和。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    point(
      "choosing-the-expanded-form",
      ["Choosing the expanded form", "选出展开形式"],
      [
        "Expanded form adds up what each digit is worth. Write each digit that is not 0 with its place value. In $7{,}308$: $7{,}000 + 300 + 8$.\n\nCheck: add the terms back. $7{,}000 + 300 + 8 = 7{,}308$.\n\n> **Watch out.** Skip the zero, but keep the other digits in their places. The 8 is worth 8, not 80.",
        "展开式就是把每个数字表示的值加起来。把每个不是 0 的数字按它的数位写出来。$7{,}308 = 7{,}000 + 300 + 8$。\n\n检验：把各项加回去，$7{,}000 + 300 + 8 = 7{,}308$。\n\n> **注意。** 0 不用写，但其他数字要留在原来的数位上。这里的 8 表示 8，不是 80。",
      ],
      (rng) => {
        const n = numberWithZeros(rng, rng.int(4, 6));
        const terms = expandedTerms(n);
        const shiftLast = terms.map((x, i) => (i === terms.length - 1 ? x * 10 : x));
        const digitsOnly = [...String(n)].filter((c) => c !== "0");
        const tenth = terms.map((x) => (x >= 10 ? x / 10 : x * 10));
        return pickedMath(
          rng,
          [`Which is the expanded form of $${fmt(n)}$?`, `$${fmt(n)}$ 的展开形式是哪一个？`],
          expandedTex(n),
          [
            [
              shiftLast.map(fmt).join(" + "),
              "The last digit is one place too far left. The zero in between keeps it lower.",
              "最后一个数字往左多算了一位。中间的 0 占着位，它应该更低一位。",
            ],
            [
              digitsOnly.join(" + "),
              "That adds only the digits. Each digit is worth its place value.",
              "这只是把数字加起来，每个数字要按数位算它的值。",
            ],
            [tenth.map(fmt).join(" + "), "Every term is in the wrong place.", "每一项的数位都不对。"],
          ],
          [
            [
              ["Find each digit's place", "找出每个数字的数位"],
              [`Skip the zeros in ${plain(n)}.`, `${plain(n)} 中的 0 不用写。`],
            ],
            [["Write each value", "写出每个值"], ["", ""], [`${fmt(n)} = ${expandedTex(n)}`]],
          ],
          [`Add the terms back: $${expandedTex(n)} = ${fmt(n)}$.`, `把各项加回去：$${expandedTex(n)} = ${fmt(n)}$。`],
          expandedChart(n),
        );
      },
      expandedChart(7308),
    ),
    point(
      "missing-terms-of-expanded-forms",
      ["A missing term", "缺少的加数"],
      [
        "Look at the number place by place. Find the digit that is not written yet. The missing term is that digit's value. In $52{,}074 = 50{,}000 + 2{,}000 + \\square + 4$ the 7 is missing. It is in the tens place, so the box is 70.\n\nCheck: $50{,}000 + 2{,}000 + 70 + 4 = 52{,}074$.\n\n> **Watch out.** Write the value, not just the digit. The box holds 70, not 7.",
        "逐位对照原数，找出还没写出来的数字。缺少的项就是这个数字表示的值。在 $52{,}074 = 50{,}000 + 2{,}000 + \\square + 4$ 中，缺的是 7。它在十位，所以方框里是 70。\n\n检验：$50{,}000 + 2{,}000 + 70 + 4 = 52{,}074$。\n\n> **注意。** 要写它表示的值，不是数字本身。方框里是 70，不是 7。",
      ],
      (rng) => {
        const n = numberWithZeros(rng, rng.int(4, 7));
        const terms = expandedTerms(n);
        const gap = rng.int(0, terms.length - 1);
        const shown = terms.map((x, i) => (i === gap ? "\\square" : fmt(x)));
        const value = terms[gap]!;
        const lead = Number(String(value)[0]);
        const k = String(value).length - 1;
        return answered(
          [`Find the missing number: $${fmt(n)} = ${shown.join(" + ")}$.`, `求方框中的数：$${fmt(n)} = ${shown.join(" + ")}$。`],
          value,
          [
            [
              ["Find the missing digit", "找出缺少的数字"],
              [`The ${lead} in the ${placeNames[k]!.en} place has no term yet.`, `${placeNames[k]!["zh-CN"]}上的 ${lead} 还没有写出来。`],
            ],
            [["Write its value", "写出它的值"], ["", ""], [`${lead} \\times ${fmt(10 ** k)} = ${fmt(value)}`]],
          ],
          [`Add all the terms: $${expandedTex(n)} = ${fmt(n)}$.`, `把各项加起来：$${expandedTex(n)} = ${fmt(n)}$。`],
          [
            [lead, "That is only the digit. Write the value it stands for.", "这只是数字，要写它表示的值。"],
            [value * 10, "That has one zero too many.", "这多了一个 0。"],
            [
              value >= 10 ? value / 10 : value * 100,
              value >= 10 ? "That has one zero too few." : "That puts the digit in the wrong place.",
              value >= 10 ? "这少了一个 0。" : "这把数字放错了数位。",
            ],
          ],
          { figure: expandedChart(n) },
        );
      },
      placeChartFigure(placesOf(5), [chartRow(50000, 5), chartRow(2000, 5), ["", "", "", "?", ""], chartRow(4, 5), chartRow(52074, 5)], 3),
    ),
  ],
};

/** convertingFromExpandedFormToStandardForm adds the terms of expanded forms. */
export const convertingFromExpandedFormToStandardForm: TopicDef = {
  id: "converting-from-expanded-form-to-standard-form",
  title: t("Converting From Expanded Form to Standard Form", "把展开形式改写成标准形式"),
  summary: t(
    "To write an expanded form as a number, put each digit in its place and write zeros in the places that are missing: 6,000 + 50 + 3 = 6,053. The terms may come in any order.",
    "把展开形式写成一个数时，把每个数字放到它的数位上，缺少的数位写 0：6,000 + 50 + 3 = 6,053。各项可以按任意顺序给出。",
  ),
  intro: t(
    "Kim counts her coins in piles: 30,000 cents in rolls, 400 cents in bags and 7 loose cents. How many cents? Put each digit in its place: 3 ten thousands, 0 thousands, 4 hundreds, 0 tens, 7 ones. That is 30,407.\n\nCheck: $30{,}407 = 30{,}000 + 400 + 7$.\n\nIn this lesson we turn an expanded form back into one number.",
    "金把硬币分堆数：成卷的 30,000 分、成袋的 400 分和零散的 7 分。一共多少分？把每个数字放到数位上：3 个万、0 个千、4 个百、0 个十、7 个一，就是 30,407。\n\n检验：$30{,}407 = 30{,}000 + 400 + 7$。\n\n本课我们把展开式还原成一个数。",
  ),
  prerequisites: ["converting-from-standard-form-to-expanded-form"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    point(
      "writing-expanded-forms-as-numbers",
      ["Terms in order", "按顺序的展开形式"],
      [
        "Put each term's digit in its place. A place with no term gets a 0. $30{,}000 + 400 + 7 = 30{,}407$. There are no thousands and no tens, so those places hold zeros.\n\nCheck: $30{,}407$ has 5 digits, just like $30{,}000$, the largest term.\n\n> **Watch out.** Do not leave out the zeros. Without them you get 347.",
        "把每一项的数字放到它的数位上，没有的数位写 0。$30{,}000 + 400 + 7 = 30{,}407$。没有千和十，这两位写 0。\n\n检验：$30{,}407$ 是五位数，和最大的一项 $30{,}000$ 一样。\n\n> **注意。** 不要漏写 0，不然就成了 347。",
      ],
      (rng) => {
        const n = numberWithZeros(rng, rng.int(4, 7));
        const squash = Number([...String(n)].filter((c) => c !== "0").join(""));
        return answered(
          [`Write $${expandedTex(n)}$ as a number.`, `把 $${expandedTex(n)}$ 写成一个数。`],
          n,
          [
            [
              ["Count the places", "确定位数"],
              [
                `The largest term, ${plain(expandedTerms(n)[0]!)}, has ${String(n).length} digits, so the number has ${String(n).length} digits.`,
                `最大的一项 ${plain(expandedTerms(n)[0]!)} 是 ${String(n).length} 位数，所以这个数也是 ${String(n).length} 位数。`,
              ],
            ],
            [
              ["Fill each place", "填好每一位"],
              [
                `Write each digit in its place and 0 in the empty places: ${plain(n)}.`,
                `把每个数字写在它的数位上，空位写 0：${plain(n)}。`,
              ],
            ],
          ],
          [`Expand it again: $${fmt(n)} = ${expandedTex(n)}$.`, `再展开一次：$${fmt(n)} = ${expandedTex(n)}$。`],
          [
            [squash, "That leaves out the zeros, so the digits are in the wrong places.", "这漏写了 0，数字都挪错了数位。"],
            ...confusions(n).slice(1, 3),
          ],
          { figure: expandedChart(n) },
        );
      },
      expandedChart(30407),
    ),
    point(
      "writing-scrambled-expanded-forms-as-numbers",
      ["Terms in any order", "打乱顺序的展开形式"],
      [
        "The terms may be in any order. Sort them from largest to smallest. Then write each digit in its place. $8 + 500 + 20{,}000$ sorts to $20{,}000 + 500 + 8 = 20{,}508$.\n\nCheck: the order of adding does not change the sum. $8 + 500 = 508$ and $508 + 20{,}000 = 20{,}508$.\n\n> **Watch out.** Do not write the digits in the order you see them. The 8 still goes in the ones place.",
        "各项可能是乱序的。先从大到小排好，再把每个数字写在它的数位上。$8 + 500 + 20{,}000$ 排好是 $20{,}000 + 500 + 8 = 20{,}508$。\n\n检验：加的顺序不改变和。$8 + 500 = 508$，$508 + 20{,}000 = 20{,}508$。\n\n> **注意。** 不要按看到的顺序写数字。8 还是在个位上。",
      ],
      (rng) => {
        let n: number;
        do n = numberWithZeros(rng, rng.int(4, 7));
        while (expandedTerms(n).length < 3);
        const terms = rng.shuffle(expandedTerms(n));
        const squash = Number(terms.map((x) => String(x)[0]).join(""));
        return answered(
          [`Write $${terms.map(fmt).join(" + ")}$ as a number.`, `把 $${terms.map(fmt).join(" + ")}$ 写成一个数。`],
          n,
          [
            [["Sort the terms", "按数位排好"], ["", ""], [expandedTex(n)]],
            [
              ["Fill each place", "填好每一位"],
              [
                `Write each digit in its place and 0 in the empty places: ${plain(n)}.`,
                `把每个数字写在它的数位上，空位写 0：${plain(n)}。`,
              ],
            ],
          ],
          [
            `Add in the given order: $${terms.map(fmt).join(" + ")} = ${fmt(n)}$.`,
            `按原来的顺序加：$${terms.map(fmt).join(" + ")} = ${fmt(n)}$。`,
          ],
          [
            [squash, "That writes the digits in the order given. Sort them by place first.", "这是按给出的顺序写的数字，要先按数位排好。"],
            ...confusions(n).slice(0, 2),
          ],
          { figure: expandedChart(n) },
        );
      },
      expandedChart(20508),
    ),
  ],
};

/** unitWord names k units in a sentence: "hundreds" in English and "个百" in Chinese. */
const unitZh = (k: number) => `个${roundNames[k]!["zh-CN"]}`;

/** equivalentPlaceValueRepresentations counts the tens, hundreds or thousands in a number. */
export const equivalentPlaceValueRepresentations: TopicDef = {
  id: "equivalent-place-value-representations",
  title: t("Equivalent Place Value Representations", "等值的数位表示"),
  summary: t(
    "A number can be described in different units: 3,400 is 3 thousands 4 hundreds, but also 34 hundreds or 340 tens, since 1 thousand = 10 hundreds and 1 hundred = 10 tens.",
    "一个数可以用不同的计数单位来描述：3,400 是 3 个千和 4 个百，也是 34 个百或 340 个十，因为 1 个千 = 10 个百，1 个百 = 10 个十。",
  ),
  intro: t(
    "A bank packs \\$5,600 in \\$100 bills. How many bills? 5 thousands are 50 hundreds. Add the 6 hundreds: 56 bills.\n\nCheck: $56 \\times 100 = 5{,}600$.\n\nIn this lesson we count a number in tens, hundreds or thousands.",
    "银行把 5,600 元全换成 100 元的纸币，有多少张？5 个千是 50 个百，再加 6 个百：56 张。\n\n检验：$56 \\times 100 = 5{,}600$。\n\n本课我们用十、百、千作单位来数一个数。",
  ),
  prerequisites: ["converting-from-expanded-form-to-standard-form"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1"),
  knowledgePoints: [
    point(
      "counting-units-in-round-numbers",
      ["How many hundreds?", "有多少个百"],
      [
        "A number can be counted in any unit. $5{,}600$ is 56 hundreds, because each thousand is 10 hundreds. Cover the last two zeros: 56 is left.\n\nCheck: $56 \\times 100 = 5{,}600$.\n\n> **Watch out.** Count the hundreds inside the thousands too. $5{,}600$ is not just 6 hundreds.",
        "一个数可以用不同的单位来数。$5{,}600$ 是 56 个百，因为每个千是 10 个百。遮住末尾两个 0，剩下 56。\n\n检验：$56 \\times 100 = 5{,}600$。\n\n> **注意。** 千里面的百也要数进去。$5{,}600$ 不只是 6 个百。",
      ],
      (rng) => {
        const k = rng.int(1, 3);
        const q = rng.int(11, 999);
        const n = q * 10 ** k;
        return answered(
          [`$${fmt(n)}$ is how many ${placeNames[k]!.en}?`, `$${fmt(n)}$ 是多少${unitZh(k)}？`],
          q,
          [
            [
              ["Cover the zeros of the unit", "去掉计数单位的 0"],
              [
                `One ${roundNames[k]!.en} has ${k === 1 ? "one zero" : `${k} zeros`}. Cover ${k === 1 ? "the last zero" : `the last ${k} zeros`} of ${plain(n)}.`,
                `一${unitZh(k).slice(1)}有 ${k} 个 0，遮住 ${plain(n)} 末尾的 ${k} 个 0。`,
              ],
            ],
            [
              ["Read what is left", "读出剩下的数"],
              [`${plain(q)} is left.`, `剩下 ${plain(q)}。`],
            ],
          ],
          [`$${fmt(q)} \\times ${fmt(10 ** k)} = ${fmt(n)}$.`, `$${fmt(q)} \\times ${fmt(10 ** k)} = ${fmt(n)}$。`],
          [
            [
              digitAt(n, k),
              `That is only the ${placeNames[k]!.en} digit. Count the ${placeNames[k]!.en} in the larger places too.`,
              `这只是${placeNames[k]!["zh-CN"]}上的数字，更高数位里的也要数进去。`,
            ],
            [q * 10, "That covers one zero too few.", "这少遮了一个 0。"],
            [Math.floor(q / 10), "That covers one zero too many.", "这多遮了一个 0。"],
          ],
          { figure: placeChartFigure(placesOf(String(n).length), [chartRow(n, String(n).length)], String(n).length - 1 - k) },
        );
      },
      placeChartFigure(
        [1000, 100, 10, 1],
        [
          ["5", "6", "0", "0"],
          ["", "56", "0", "0"],
        ],
        1,
      ),
    ),
    point(
      "counting-whole-units-in-a-number",
      ["Whole tens in a number", "一个数中有多少个整十"],
      [
        "To count the whole tens, read all the digits left of the ones as one number. $4{,}237$ has 423 whole tens, and 7 ones are left over.\n\nCheck: $423 \\times 10 = 4{,}230$, and $4{,}230 + 7 = 4{,}237$.\n\n> **Watch out.** The tens digit alone is 3. It counts only the tens that are not part of a hundred.",
        "求一共有多少个整十，就把个位左边的所有数字当作一个数来读。$4{,}237$ 有 423 个十，剩下 7 个一。\n\n检验：$423 \\times 10 = 4{,}230$，$4{,}230 + 7 = 4{,}237$。\n\n> **注意。** 十位上的数字只是 3，它只数没有凑成百的十。",
      ],
      (rng) => {
        const n = randomWithDigits(rng, rng.int(4, 5));
        const k = rng.int(1, 2);
        const value = Math.floor(n / 10 ** k);
        const rest = n - value * 10 ** k;
        return answered(
          [`How many whole ${placeNames[k]!.en} are in $${fmt(n)}$?`, `$${fmt(n)}$ 中一共有多少${unitZh(k)}？`],
          value,
          [
            [
              ["Cut off the smaller places", "去掉更低的数位"],
              [
                `Drop the last ${k === 1 ? "digit" : `${k} digits`} of ${plain(n)}. They make ${rest}, less than one ${roundNames[k]!.en}.`,
                `去掉 ${plain(n)} 末尾 ${k} 位，它们是 ${rest}，不够一${unitZh(k).slice(1)}。`,
              ],
            ],
            [
              ["Read what is left", "读出剩下的数"],
              [`${plain(value)} whole ${placeNames[k]!.en} are left.`, `剩下 ${plain(value)}${unitZh(k)}。`],
            ],
          ],
          [
            `$${fmt(value)} \\times ${fmt(10 ** k)} + ${rest} = ${fmt(n)}$.`,
            `$${fmt(value)} \\times ${fmt(10 ** k)} + ${rest} = ${fmt(n)}$。`,
          ],
          [
            [
              digitAt(n, k),
              `That is only the ${placeNames[k]!.en} digit. Count the ${placeNames[k]!.en} inside the larger places too.`,
              `这只是${placeNames[k]!["zh-CN"]}上的数字，更高数位里的也要数进去。`,
            ],
            [
              Math.round(n / 10 ** k) === value ? value + 1 : Math.round(n / 10 ** k),
              "That rounds. Count only whole units.",
              "这是四舍五入了，只能数整的。",
            ],
            [Math.floor(n / 10 ** (k + 1)), "That drops one digit too many.", "这多去掉了一位。"],
          ],
          { figure: placeChartFigure(placesOf(String(n).length), [chartRow(n, String(n).length)], String(n).length - 1 - k) },
        );
      },
      placeChartFigure(
        [1000, 100, 10, 1],
        [
          ["4", "2", "3", "7"],
          ["", "", "423", "7"],
        ],
        2,
      ),
    ),
  ],
};

/** moreOnEquivalentPlaceValueRepresentations combines units given with more than nine of a kind. */
export const moreOnEquivalentPlaceValueRepresentations: TopicDef = {
  id: "more-on-equivalent-place-value-representations",
  title: t("More on Equivalent Place Value Representations", "等值的数位表示（进阶）"),
  summary: t(
    "When a description has ten or more of a unit, regroup them into the next unit: 5 thousands + 23 tens = 5,000 + 230 = 5,230.",
    "当某种计数单位有十个或更多时，把它们合并成更大的单位：5 个千 + 23 个十 = 5,000 + 230 = 5,230。",
  ),
  intro: t(
    "Raj has 3 bags of 1,000 beads and 14 boxes of 100 beads. Ten boxes make another bag. So he has 4 bags and 4 boxes: 4,400 beads.\n\nCheck: $3{,}000 + 1{,}400 = 4{,}400$.\n\nIn this lesson we put units together when there are ten or more of one kind.",
    "拉杰有 3 袋珠子，每袋 1,000 颗，还有 14 盒，每盒 100 颗。10 盒能凑成一袋，所以他有 4 袋和 4 盒：4,400 颗。\n\n检验：$3{,}000 + 1{,}400 = 4{,}400$。\n\n本课我们学习某种单位满十个以上时怎样合起来写成一个数。",
  ),
  prerequisites: ["equivalent-place-value-representations"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1"),
  knowledgePoints: [
    point(
      "combining-units-with-regrouping",
      ["Combining units", "合并计数单位"],
      [
        "Turn each part into a number and add. 3 thousands + 14 hundreds = $3{,}000 + 1{,}400 = 4{,}400$. Ten of the hundreds made one more thousand.\n\nCheck: 14 hundreds = 1 thousand and 4 hundreds. With the 3 thousands that is 4 thousands and 4 hundreds.\n\n> **Watch out.** Do not write the counts side by side. 3 thousands and 14 hundreds is not 31,400.",
        "把每一部分写成数再相加。3 个千 + 14 个百 = $3{,}000 + 1{,}400 = 4{,}400$。其中 10 个百凑成了一个千。\n\n检验：14 个百 = 1 个千和 4 个百，加上 3 个千，是 4 个千和 4 个百。\n\n> **注意。** 不能把个数直接并排写。3 个千和 14 个百不是 31,400。",
      ],
      (rng) => {
        const hiK = rng.int(2, 3);
        const loK = hiK - rng.int(1, 2);
        const a = rng.int(1, 9);
        const b = rng.int(10, 99);
        const big = a * 10 ** hiK;
        const small = b * 10 ** loK;
        const value = big + small;
        const len = String(value).length;
        return answered(
          [
            `Write as a number: $${a}$ ${a === 1 ? roundNames[hiK]!.en : placeNames[hiK]!.en} $+$ $${b}$ ${placeNames[loK]!.en}.`,
            `写成一个数：$${a}$ 个${roundNames[hiK]!["zh-CN"]} $+$ $${b}$ 个${roundNames[loK]!["zh-CN"]}。`,
          ],
          value,
          [
            [
              ["Write each part as a number", "把每部分写成数"],
              ["", ""],
              [`${a} \\times ${fmt(10 ** hiK)} = ${fmt(big)}`, `${b} \\times ${fmt(10 ** loK)} = ${fmt(small)}`],
            ],
            [["Add", "相加"], ["", ""], [`${fmt(big)} + ${fmt(small)} = ${fmt(value)}`]],
          ],
          [
            `Count the ${placeNames[loK]!.en} in the answer: $${fmt(value)} \\div ${fmt(10 ** loK)} = ${fmt(value / 10 ** loK)}$, and $${a}$ ${placeNames[hiK]!.en} are $${fmt(big / 10 ** loK)}$ of them. $${fmt(big / 10 ** loK)} + ${b} = ${fmt(value / 10 ** loK)}$.`,
            `数一数答案里有多少${unitZh(loK)}：$${fmt(value)} \\div ${fmt(10 ** loK)} = ${fmt(value / 10 ** loK)}$，$${a}$ 个${roundNames[hiK]!["zh-CN"]}是其中的 $${fmt(big / 10 ** loK)}$ 个。$${fmt(big / 10 ** loK)} + ${b} = ${fmt(value / 10 ** loK)}$。`,
          ],
          [
            [
              Number(`${a}${b}${"0".repeat(loK)}`),
              "That writes the counts side by side. Turn each part into a number and add.",
              "这是把个数并排写了。要把每部分写成数再相加。",
            ],
            [
              big + b,
              `That treats the ${b} as ones. They are ${placeNames[loK]!.en}.`,
              `这把 ${b} 当成了一，它们是${roundNames[loK]!["zh-CN"]}。`,
            ],
            [big + b * 10 ** (loK + 1), `That treats the ${b} as one place too big.`, `这把 ${b} 的单位当大了一位。`],
          ],
          {
            figure: placeChartFigure(
              placesOf(len),
              [Object.assign(Array(len).fill(""), { [len - 1 - hiK]: `${a}`, [len - 1 - loK]: `${b}` }), chartRow(value, len)],
              len - 1 - loK,
            ),
          },
        );
      },
      placeChartFigure(
        [1000, 100, 10, 1],
        [
          ["3", "14", "", ""],
          ["4", "4", "0", "0"],
        ],
        1,
      ),
    ),
    point(
      "combining-three-kinds-of-units",
      ["Three kinds of units", "三种计数单位"],
      [
        "Multiply each count by its unit. Then add. 2 hundreds + 15 tens + 12 ones $= 200 + 150 + 12 = 362$.\n\nCheck: regroup. 12 ones = 1 ten and 2 ones. 16 tens = 1 hundred and 6 tens. So 3 hundreds, 6 tens, 2 ones: 362.\n\n> **Watch out.** Do not just write the counts side by side. 21512 is wrong.",
        "把每个个数乘它的计数单位，再相加。2 个百 + 15 个十 + 12 个一 $= 200 + 150 + 12 = 362$。\n\n检验：重新组合。12 个一 = 1 个十和 2 个一；16 个十 = 1 个百和 6 个十。所以是 3 个百、6 个十、2 个一：362。\n\n> **注意。** 不能把个数直接并排写，21512 是错的。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(10, 30);
        const c = rng.int(10, 30);
        const value = a * 100 + b * 10 + c;
        return answered(
          [
            `Write as a number: $${a}$ ${a === 1 ? "hundred" : "hundreds"} $+$ $${b}$ tens $+$ $${c}$ ones.`,
            `写成一个数：$${a}$ 个百 $+$ $${b}$ 个十 $+$ $${c}$ 个一。`,
          ],
          value,
          [
            [
              ["Write each part as a number", "把每部分写成数"],
              [
                `${a} ${a === 1 ? "hundred" : "hundreds"} is ${a * 100}, ${b} tens is ${b * 10}, and ${c} ones is ${c}.`,
                `${a} 个百是 ${a * 100}，${b} 个十是 ${b * 10}，${c} 个一是 ${c}。`,
              ],
            ],
            [["Add", "相加"], ["", ""], [`${a * 100} + ${b * 10} + ${c} = ${fmt(value)}`]],
          ],
          [
            `Count it in tens: $${a * 10} + ${b} + ${Math.floor(c / 10)} = ${Math.floor(value / 10)}$ tens and ${c % 10} ones, which is $${fmt(value)}$.`,
            `按十来数：$${a * 10} + ${b} + ${Math.floor(c / 10)} = ${Math.floor(value / 10)}$ 个十，还有 ${c % 10} 个一，就是 $${fmt(value)}$。`,
          ],
          [
            [
              Number(`${a}${b}${c}`),
              "That writes the counts side by side. Turn each part into a number and add.",
              "这是把个数并排写了。要把每部分写成数再相加。",
            ],
            [a * 100 + b + c, `That treats the ${b} tens as ones.`, `这把 ${b} 个十当成了一。`],
            [a + b + c, "That adds the counts without their units.", "这把个数直接加了，没有乘计数单位。"],
          ],
          { figure: placeChartFigure([100, 10, 1], [[`${a}`, `${b}`, `${c}`], chartRow(value, 3)], -1) },
        );
      },
      placeChartFigure(
        [100, 10, 1],
        [
          ["2", "15", "12"],
          ["3", "6", "2"],
        ],
        -1,
      ),
    ),
  ],
};

/** equivalentPlaceValueRepresentationsAndBorrowing regroups one unit into ten of the next smaller unit. */
export const equivalentPlaceValueRepresentationsAndBorrowing: TopicDef = {
  id: "equivalent-place-value-representations-and-borrowing",
  title: t("Equivalent Place Value Representations and Borrowing", "等值的数位表示与借位"),
  summary: t(
    "Regrouping also works the other way: one hundred can be traded for ten tens. So 4,302 = 4 thousands + 3 hundreds + 0 tens + 2 ones = 4 thousands + 2 hundreds + 10 tens + 2 ones. Subtraction uses this to borrow.",
    "反过来也可以拆分：一个百可以换成十个十。所以 4,302 = 4 个千 + 3 个百 + 0 个十 + 2 个一 = 4 个千 + 2 个百 + 10 个十 + 2 个一。减法中的借位就是这样做的。",
  ),
  intro: t(
    "Zoe has 6 ten-dollar bills and 2 one-dollar bills: \\$62. She needs to pay \\$5 in ones. She trades one ten for ten ones. Now she has 5 tens and 12 ones. It is still \\$62.\n\nCheck: $50 + 12 = 62$.\n\nIn this lesson we trade one unit for ten smaller ones, as we do when we subtract.",
    "佐伊有 6 张 10 元和 2 张 1 元，共 62 元。她要用 1 元的付 5 元，就把一张 10 元换成 10 张 1 元。现在是 5 张 10 元和 12 张 1 元，还是 62 元。\n\n检验：$50 + 12 = 62$。\n\n本课我们学习把一个大单位换成十个小单位，就像减法里的退位。",
  ),
  prerequisites: ["more-on-equivalent-place-value-representations"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.B.4"),
  knowledgePoints: [
    point(
      "breaking-a-hundred-into-tens",
      ["Trading one for ten", "一换十"],
      [
        "Trade one unit for ten of the next smaller unit. One place goes down by 1. The place to its right goes up by 10. $652 = 6$ hundreds $+ 4$ tens $+ 12$ ones. One ten became ten ones.\n\nCheck: $600 + 40 + 12 = 652$.\n\n> **Watch out.** Both places change. If the ones go up by 10, the tens go down by 1.",
        "把一个单位换成十个小一级的单位。这一位少 1，右边一位多 10。$652 = 6$ 个百 $+ 4$ 个十 $+ 12$ 个一，一个十换成了十个一。\n\n检验：$600 + 40 + 12 = 652$。\n\n> **注意。** 两个数位都要变。个位多了 10，十位就要少 1。",
      ],
      (rng) => {
        let n: number;
        let k: number;
        do {
          n = randomWithDigits(rng, rng.int(3, 4));
          k = rng.int(1, String(n).length - 1);
        } while (digitAt(n, k) === 0);
        const len = String(n).length;
        const parts = range0(len)
          .reverse()
          .map((p) => ({ p, d: digitAt(n, p) - (p === k ? 1 : 0) + (p === k - 1 ? 10 : 0) }));
        const value = digitAt(n, k - 1) + 10;
        const shownEn = parts
          .map(
            (x) =>
              `${x.p === k - 1 ? "\\square" : `${x.d}`}\\text{ ${x.d === 1 && x.p !== k - 1 ? roundNames[x.p]!.en : placeNames[x.p]!.en}}`,
          )
          .join(" + ");
        const shownZh = parts.map((x) => `${x.p === k - 1 ? "\\square" : `${x.d}`}\\text{ ${unitZh(x.p)}}`).join(" + ");
        const total = parts.map((x) => x.d * 10 ** x.p);
        return answered(
          [`Fill in the box: $${fmt(n)} = ${shownEn}$`, `填空：$${fmt(n)} = ${shownZh}$`],
          value,
          [
            [
              ["See what was traded", "看换了什么"],
              [
                `The ${placeNames[k]!.en} went from ${digitAt(n, k)} to ${digitAt(n, k) - 1}, so one ${roundNames[k]!.en} became ten ${placeNames[k - 1]!.en}.`,
                `${placeNames[k]!["zh-CN"]}从 ${digitAt(n, k)} 变成了 ${digitAt(n, k) - 1}，一${unitZh(k).slice(1)}换成了十${unitZh(k - 1)}。`,
              ],
            ],
            [["Add the ten", "加上换来的十个"], ["", ""], [`${digitAt(n, k - 1)} + 10 = ${value}`]],
          ],
          [
            `Add up the parts: $${total.map(fmt).join(" + ")} = ${fmt(n)}$.`,
            `把各部分加起来：$${total.map(fmt).join(" + ")} = ${fmt(n)}$。`,
          ],
          [
            [digitAt(n, k - 1), "That leaves this place as it was. It got ten more.", "这一位没变。它应该多了十个。"],
            [value + 1, "That is one too many.", "这多了 1。"],
            [10, `That forgets the ${digitAt(n, k - 1)} already in this place.`, `这忘了这一位原来就有的 ${digitAt(n, k - 1)}。`],
          ],
          { figure: placeChartFigure(placesOf(len), [chartRow(n, len), parts.map((x) => (x.p === k - 1 ? "?" : `${x.d}`))], len - k) },
        );
      },
      placeChartFigure(
        [100, 10, 1],
        [
          ["6", "5", "2"],
          ["6", "4", "12"],
        ],
        2,
      ),
    ),
    point(
      "borrowing-across-zeros",
      ["Borrowing across a zero", "隔着 0 借位"],
      [
        "Sometimes the next place is 0. Then trade twice. In $4{,}302$, trade a hundred for ten tens. Then trade one of those tens for ten ones. Now it is 4 thousands + 2 hundreds + 9 tens + 12 ones.\n\nCheck: $4{,}000 + 200 + 90 + 12 = 4{,}302$.\n\n> **Watch out.** After the second trade, only 9 tens are left, not 10.",
        "有时旁边一位是 0，就要换两次。在 $4{,}302$ 中，先拿一个百换成十个十，再拿其中一个十换成十个一。现在是 4 个千 + 2 个百 + 9 个十 + 12 个一。\n\n检验：$4{,}000 + 200 + 90 + 12 = 4{,}302$。\n\n> **注意。** 第二次换过以后，十只剩 9 个，不是 10 个。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = rng.int(0, 8);
        const n = a * 1000 + b * 100 + c;
        const askTens = rng.bool();
        const value = askTens ? 9 : c + 10;
        const thousands = a === 1 ? "thousand" : "thousands";
        const hundreds = b - 1 === 1 ? "hundred" : "hundreds";
        return answered(
          askTens
            ? [
                `$${fmt(n)} = ${a}$ ${thousands} $+ ${b - 1}$ ${hundreds} $+ \\square$ tens $+ ${c + 10}$ ones. Find the number in the box.`,
                `$${fmt(n)} = ${a}$ 个千 $+ ${b - 1}$ 个百 $+ \\square$ 个十 $+ ${c + 10}$ 个一。求方框中的数。`,
              ]
            : [
                `$${fmt(n)} = ${a}$ ${thousands} $+ ${b - 1}$ ${hundreds} $+ 9$ tens $+ \\square$ ones. Find the number in the box.`,
                `$${fmt(n)} = ${a}$ 个千 $+ ${b - 1}$ 个百 $+ 9$ 个十 $+ \\square$ 个一。求方框中的数。`,
              ],
          value,
          [
            [
              ["Trade a hundred for ten tens", "一个百换十个十"],
              [`${b} hundreds become ${b - 1}, and the tens go from 0 to 10.`, `${b} 个百变成 ${b - 1} 个，十从 0 个变成 10 个。`],
            ],
            [
              ["Trade a ten for ten ones", "一个十换十个一"],
              [`The tens go from 10 to 9, and the ones go from ${c} to ${c + 10}.`, `十从 10 个变成 9 个，一从 ${c} 个变成 ${c + 10} 个。`],
            ],
          ],
          [
            `$${fmt(a * 1000)} + ${(b - 1) * 100} + 90 + ${c + 10} = ${fmt(n)}$.`,
            `$${fmt(a * 1000)} + ${(b - 1) * 100} + 90 + ${c + 10} = ${fmt(n)}$。`,
          ],
          askTens
            ? [
                [10, "That forgets the second trade. One ten went to the ones.", "这忘了第二次换。有一个十换成了一。"],
                [0, "That leaves the tens as they were. The hundred was traded into tens.", "这里十位没变。一个百已经换成了十个十。"],
              ]
            : [
                [c, "That leaves the ones as they were. They got ten more.", "这里个位没变。一应该多了十个。"],
                [c + 9, "That adds 9. A ten is ten ones.", "这是加了 9。一个十是十个一。"],
                [10, `That forgets the ${c} already in the ones place.`, `这忘了个位原来就有的 ${c} 个一。`],
              ],
          {
            figure: placeChartFigure(
              [1000, 100, 10, 1],
              [chartRow(n, 4), [`${a}`, `${b - 1}`, "10", `${c}`], [`${a}`, `${b - 1}`, askTens ? "?" : "9", askTens ? `${c + 10}` : "?"]],
              askTens ? 2 : 3,
            ),
          },
        );
      },
      placeChartFigure(
        [1000, 100, 10, 1],
        [
          ["4", "3", "0", "2"],
          ["4", "2", "10", "2"],
          ["4", "2", "9", "12"],
        ],
        2,
      ),
    ),
  ],
};

/** comparingPlaceValues compares the values of the same digit in different places. */
export const comparingPlaceValues: TopicDef = {
  id: "comparing-place-values",
  title: t("Comparing Place Values", "比较数位的值"),
  summary: t(
    "A digit in one place is worth ten times what it is worth in the place to its right. In 7,770 the first 7 is worth 7,000, which is 10 times the 700 of the second 7 and 100 times the 70 of the third.",
    "同一个数字在某一位上表示的值，是它在右边一位上所表示的值的十倍。在 7,770 中，第一个 7 表示 7,000，是第二个 7 所表示的 700 的 10 倍，是第三个 7 所表示的 70 的 100 倍。",
  ),
  intro: t(
    "Look at the number 7,770. It has three 7s, but they are not worth the same. The first is 7,000. The second is 700. The third is 70. Each 7 is worth 10 times the 7 on its right.\n\nCheck: $70 \\times 10 = 700$ and $700 \\times 10 = 7{,}000$.\n\nIn this lesson we compare what the same digit is worth in different places.",
    "看 7,770 这个数。它有三个 7，可是表示的值不一样：第一个是 7,000，第二个是 700，第三个是 70。每个 7 都是它右边那个 7 的 10 倍。\n\n检验：$70 \\times 10 = 700$，$700 \\times 10 = 7{,}000$。\n\n本课我们比较同一个数字在不同数位上表示的值。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.1"),
  knowledgePoints: [
    point(
      "comparing-a-digit-in-two-numbers",
      ["The same digit in two numbers", "两个数中的同一个数字"],
      [
        "Each place to the left is worth 10 times as much. Find what each digit is worth. Then divide. The 6 in $46{,}213$ is worth 6,000. The 6 in $3{,}562$ is worth 60. $6{,}000 \\div 60 = 100$.\n\nCheck: the 6s are two places apart. $10 \\times 10 = 100$.\n\n> **Watch out.** Two places apart is 100 times, not 2 times or 20 times.",
        "每向左一位，值就变成 10 倍。先求出每个数字表示的值，再相除。$46{,}213$ 中的 6 表示 6,000，$3{,}562$ 中的 6 表示 60。$6{,}000 \\div 60 = 100$。\n\n检验：两个 6 相差两位，$10 \\times 10 = 100$。\n\n> **注意。** 相差两位是 100 倍，不是 2 倍，也不是 20 倍。",
      ],
      (rng) => {
        const d = rng.int(1, 9);
        const i = rng.int(2, 5);
        const j = i - rng.int(1, 2);
        const make = (k: number) => {
          for (;;) {
            const n = randomWithDigits(rng, rng.int(k + 1, k + 2));
            const ds = digitsOf(n);
            ds[k] = d;
            const m = Number(ds.reverse().join(""));
            if (digitsOf(m).filter((x) => x === d).length === 1 && String(m).length === String(n).length) return m;
          }
        };
        const a = make(i);
        const b = make(j);
        const value = 10 ** (i - j);
        const [va, vb] = [d * 10 ** i, d * 10 ** j];
        const len = Math.max(String(a).length, String(b).length);
        return answered(
          [
            `The value of the $${d}$ in $${fmt(a)}$ is how many times the value of the $${d}$ in $${fmt(b)}$?`,
            `$${fmt(a)}$ 中的 $${d}$ 表示的值是 $${fmt(b)}$ 中的 $${d}$ 表示的值的多少倍？`,
          ],
          value,
          [
            [
              ["Find each value", "求出每个值"],
              [
                `In ${plain(a)} the ${d} is worth ${plain(va)}. In ${plain(b)} it is worth ${plain(vb)}.`,
                `${plain(a)} 中的 ${d} 表示 ${plain(va)}，${plain(b)} 中的 ${d} 表示 ${plain(vb)}。`,
              ],
            ],
            [["Divide", "相除"], ["", ""], [`${fmt(va)} \\div ${fmt(vb)} = ${fmt(value)}`]],
          ],
          [
            `The ${d}s are ${i - j === 1 ? "one place" : "two places"} apart, and each place is 10 times: ${i - j === 1 ? "10" : "$10 \\times 10 = 100$"}.`,
            `两个 ${d} 相差 ${i - j} 位，每一位是 10 倍：${i - j === 1 ? "10" : "$10 \\times 10 = 100$"}。`,
          ],
          [
            [i - j, "That counts the places between them. Each place multiplies by 10.", "这是相差的位数。每差一位要乘 10。"],
            [value * 10, "That is one place too many.", "这多算了一位。"],
            [
              value === 10 ? 100 : 10,
              value === 10 ? "They are only one place apart." : "They are two places apart.",
              value === 10 ? "它们只相差一位。" : "它们相差两位。",
            ],
          ],
          { figure: placeChartFigure(placesOf(len), [chartRow(a, len), chartRow(b, len)], -1) },
        );
      },
      placeChartFigure(placesOf(5), [chartRow(46213, 5), chartRow(3562, 5)], -1),
    ),
    point(
      "comparing-a-repeated-digit",
      ["A repeated digit", "重复出现的数字"],
      [
        "A digit may appear twice in one number. Count how many places apart they are. Each place multiplies the value by 10. In $5{,}352$ the first 5 is worth 5,000 and the second 50. They are two places apart, so the first is 100 times the second.\n\nCheck: $5{,}000 \\div 50 = 100$.\n\n> **Watch out.** The same digit can have very different values. Look at the place, not the digit.",
        "一个数字可能在一个数里出现两次。数一数它们相差几位，每差一位，值就乘 10。在 $5{,}352$ 中，第一个 5 表示 5,000，第二个表示 50。它们相差两位，所以前者是后者的 100 倍。\n\n检验：$5{,}000 \\div 50 = 100$。\n\n> **注意。** 同一个数字表示的值可以差很多，要看数位，不能只看数字。",
      ],
      (rng) => {
        const d = rng.int(1, 9);
        const len = rng.int(4, 7);
        const i = rng.int(2, len - 1);
        const j = rng.int(Math.max(0, i - 3), i - 1);
        const ds = range0(len).map((k) =>
          k === i || k === j ? d : rng.pick(range0(10).filter((x) => x !== d && (k !== len - 1 || x > 0))),
        );
        const n = Number(ds.reverse().join(""));
        const value = 10 ** (i - j);
        return answered(
          [
            `In $${fmt(n)}$, the $${d}$ in the ${placeNames[i]!.en} place is worth how many times the $${d}$ in the ${placeNames[j]!.en} place?`,
            `在 $${fmt(n)}$ 中，${placeNames[i]!["zh-CN"]}上的 $${d}$ 表示的值是${placeNames[j]!["zh-CN"]}上的 $${d}$ 的多少倍？`,
          ],
          value,
          [
            [
              ["Count the places between", "数相差几位"],
              [
                `From the ${placeNames[j]!.en} to the ${placeNames[i]!.en} is ${i - j} place${i - j > 1 ? "s" : ""}.`,
                `从${placeNames[j]!["zh-CN"]}到${placeNames[i]!["zh-CN"]}相差 ${i - j} 位。`,
              ],
            ],
            [
              ["Multiply by 10 for each place", "每差一位乘 10"],
              ["", ""],
              [
                i - j === 1
                  ? "10"
                  : `${range0(i - j)
                      .map(() => "10")
                      .join(" \\times ")} = ${fmt(value)}`,
              ],
            ],
          ],
          [
            `$${fmt(d * 10 ** i)} \\div ${fmt(d * 10 ** j)} = ${fmt(value)}$.`,
            `$${fmt(d * 10 ** i)} \\div ${fmt(d * 10 ** j)} = ${fmt(value)}$。`,
          ],
          [
            [i - j, "That is the number of places between them. Each place multiplies by 10.", "这是相差的位数。每差一位要乘 10。"],
            [value * 10, "That is one place too many.", "这多算了一位。"],
            [d, "That is the digit itself. Compare the values.", "这是数字本身，要比较它们表示的值。"],
          ],
          { figure: digitsChart([n]) },
        );
      },
      placeChartFigure(
        [1000, 100, 10, 1],
        [
          ["5", "3", "5", "2"],
          ["5", "0", "0", "0"],
          ["", "", "5", "0"],
        ],
        -1,
      ),
    ),
  ],
};

/** symbolReasons give the reasons the wrong symbols are wrong when a is less than, equal to or greater than b. */
const symbolReasons = (a: string, b: string): [Pair, Pair, Pair] => [
  [`That says ${a} is less than ${b}.`, `这表示 ${a} 小于 ${b}。`],
  [`That says the numbers are equal, but their digits differ.`, `这表示两数相等，可是它们的数字不一样。`],
  [`That says ${a} is greater than ${b}.`, `这表示 ${a} 大于 ${b}。`],
];

/** comparingWholeNumbers compares two whole numbers with <, = or >. */
export const comparingWholeNumbers: TopicDef = {
  id: "comparing-whole-numbers",
  title: t("Comparing Whole Numbers", "比较整数的大小"),
  summary: t(
    "A whole number with more digits is greater. With the same number of digits, compare from the left: the first place where the digits differ decides. The symbols < (less than), > (greater than) and = record the result.",
    "位数多的整数较大。位数相同时，从左往右比较：第一个数字不同的数位决定大小。用符号 <（小于）、>（大于）和 = 记录结果。",
  ),
  intro: t(
    "Two towns count their trees. Ashby has 47,312 trees and Brook has 47,298. Line the numbers up. The 4s match and the 7s match. In the hundreds, 3 beats 2. So Ashby has more: $47{,}312 > 47{,}298$.\n\nCheck: $47{,}312 - 47{,}298 = 14$, so Ashby has 14 more.\n\nIn this lesson we compare whole numbers place by place and write <, = or >.",
    "两个镇数树。甲镇有 47,312 棵，乙镇有 47,298 棵。把两个数对齐：4 一样，7 也一样，到百位 3 比 2 大。所以甲镇多：$47{,}312 > 47{,}298$。\n\n检验：$47{,}312 - 47{,}298 = 14$，甲镇多 14 棵。\n\n本课我们逐位比较整数的大小，并写出 <、= 或 >。",
  ),
  prerequisites: ["place-value-with-numbers-up-to-seven-digits"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    point(
      "comparing-numbers-with-different-numbers-of-digits",
      ["Different numbers of digits", "位数不同"],
      [
        "Count the digits first. The number with more digits is greater, whatever the digits are. $9{,}876 < 10{,}002$, because a five-digit number is at least 10,000.\n\nCheck: the biggest four-digit number is 9,999, and $9{,}999 + 1 = 10{,}000$.\n\n> **Watch out.** Do not compare the first digits when the lengths differ. 9 is bigger than 1, but 9,876 is smaller.",
        "先数位数。位数多的数大，不管各位上是什么数字。$9{,}876 < 10{,}002$，因为五位数至少是 10,000。\n\n检验：最大的四位数是 9,999，$9{,}999 + 1 = 10{,}000$。\n\n> **注意。** 位数不同时，不要比第一个数字。9 比 1 大，但 9,876 更小。",
      ],
      (rng) => {
        const da = rng.int(3, 6);
        const a = randomWithDigits(rng, da);
        const b = randomWithDigits(rng, da + (rng.bool() ? 1 : -1));
        const rel = a < b ? 0 : 2;
        const [la, lb] = [String(a).length, String(b).length];
        return compared(
          fmt(a),
          fmt(b),
          rel,
          [
            [
              ["Count the digits", "数位数"],
              [`${plain(a)} has ${la} digits and ${plain(b)} has ${lb}.`, `${plain(a)} 是 ${la} 位数，${plain(b)} 是 ${lb} 位数。`],
            ],
            [["More digits is greater", "位数多的大"], ["", ""], [`${fmt(a)} ${rel === 0 ? "<" : ">"} ${fmt(b)}`]],
          ],
          [
            `The smallest ${Math.max(la, lb)}-digit number is ${plain(10 ** (Math.max(la, lb) - 1))}, which is more than any ${Math.min(la, lb)}-digit number.`,
            `最小的 ${Math.max(la, lb)} 位数是 ${plain(10 ** (Math.max(la, lb) - 1))}，比任何 ${Math.min(la, lb)} 位数都大。`,
          ],
          symbolReasons(plain(a), plain(b)),
          digitsChart([a, b]),
        );
      },
      placeChartFigure(placesOf(5), [chartRow(9876, 5), chartRow(10002, 5)], 0),
    ),
    point(
      "comparing-numbers-with-the-same-number-of-digits",
      ["The same number of digits", "位数相同"],
      [
        "With the same number of digits, compare place by place from the left. The first place where the digits differ decides. $47{,}312$ and $47{,}298$ first differ in the hundreds: $3 > 2$. So $47{,}312 > 47{,}298$.\n\nCheck: subtract. $47{,}312 - 47{,}298 = 14$, which is more than 0.\n\n> **Watch out.** Stop at the first difference. 98 is bigger than 12, but that does not matter.",
        "位数相同时，从最高位起逐位比较。第一个不同的数位决定大小。$47{,}312$ 和 $47{,}298$ 第一个不同的是百位：$3 > 2$，所以 $47{,}312 > 47{,}298$。\n\n检验：相减，$47{,}312 - 47{,}298 = 14$，大于 0。\n\n> **注意。** 比到第一个不同的数位就停。98 比 12 大，但这不影响结果。",
      ],
      (rng) => {
        const len = rng.int(4, 7);
        const a = randomWithDigits(rng, len);
        const equal = rng.bool(0.15);
        let b = a;
        let k = 0;
        if (!equal) {
          k = rng.int(0, len - 2);
          const ds = digitsOf(a);
          let nd: number;
          do nd = rng.int(0, 9);
          while (nd === ds[k] || (k === len - 1 && nd === 0));
          ds[k] = nd;
          for (let i = 0; i < k; i++) ds[i] = rng.int(0, 9);
          b = Number(ds.reverse().join(""));
        }
        const rel = a < b ? 0 : a === b ? 1 : 2;
        const sym = ["<", "=", ">"][rel];
        return compared(
          fmt(a),
          fmt(b),
          rel,
          equal
            ? [
                [
                  ["Compare from the left", "从左往右比"],
                  ["Every place has the same digit.", "每一位上的数字都相同。"],
                ],
                [["Decide", "下结论"], ["", ""], [`${fmt(a)} = ${fmt(b)}`]],
              ]
            : [
                [
                  ["Find the first difference", "找第一个不同的数位"],
                  [
                    `From the left, the first place that differs is the ${placeNames[k]!.en}: ${digitAt(a, k)} and ${digitAt(b, k)}.`,
                    `从左往右，第一个不同的是${placeNames[k]!["zh-CN"]}：${digitAt(a, k)} 和 ${digitAt(b, k)}。`,
                  ],
                ],
                [["Decide", "下结论"], ["", ""], [`${fmt(a)} ${sym} ${fmt(b)}`]],
              ],
          equal
            ? ["Subtract: the difference is 0.", "相减，差是 0。"]
            : [
                `The difference is $${fmt(Math.abs(a - b))}$, and the ${rel === 0 ? "second" : "first"} number is the bigger one.`,
                `两数相差 $${fmt(Math.abs(a - b))}$，${rel === 0 ? "第二个" : "第一个"}数更大。`,
              ],
          symbolReasons(plain(a), plain(b)),
          digitsChart([a, b], equal ? -1 : len - 1 - k),
        );
      },
      placeChartFigure(placesOf(5), [chartRow(47312, 5), chartRow(47298, 5)], 2),
    ),
  ],
};

/** comparingWholeNumbersUsingPlaceValue picks the greatest number and finds missing digits in comparisons. */
export const comparingWholeNumbersUsingPlaceValue: TopicDef = {
  id: "comparing-whole-numbers-using-place-value",
  title: t("Comparing Whole Numbers Using Place Value", "利用数位比较整数"),
  summary: t(
    "Comparing place by place from the left also orders several numbers and decides which digits can fill a gap: 3,□52 < 3,652 holds for □ = 0, 1, …, 5.",
    "从左往右逐位比较，也可以给几个数排序，并确定空缺处可以填哪些数字：3,□52 < 3,652 在 □ = 0, 1, …, 5 时成立。",
  ),
  intro: t(
    "Four friends play a game. Their scores are 52,318, 52,381, 52,183 and 51,832. Who wins? Line them up. The ten thousands are all 5. In the thousands, 51,832 drops out. In the hundreds, 52,183 drops out. In the tens, 8 beats 1. The winner has 52,381.\n\nCheck: 52,381 is more than 52,318 by 63.\n\nIn this lesson we find the greatest or least of several numbers, and the digits that keep a comparison true.",
    "四个朋友玩游戏，得分是 52,318、52,381、52,183 和 51,832。谁赢了？把数对齐：万位都是 5；比千位，51,832 出局；比百位，52,183 出局；比十位，8 比 1 大。赢家得了 52,381 分。\n\n检验：52,381 比 52,318 多 63。\n\n本课我们在几个数中找最大或最小的数，并找出能让比较成立的数字。",
  ),
  prerequisites: ["comparing-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.2"),
  knowledgePoints: [
    point(
      "finding-the-greatest-number",
      ["The greatest number", "最大的数"],
      [
        "Line the numbers up by place. Compare from the left. At each place, keep only the numbers with the biggest digit. Go on until one is left. Of 52,318, 52,381, 52,183 and 51,832, the greatest is 52,381.\n\nCheck: put all four in order. $51{,}832 < 52{,}183 < 52{,}318 < 52{,}381$.\n\n> **Watch out.** Do not judge by the last digits. 52,318 ends in 8, but it is not the greatest.",
        "把几个数按数位对齐，从左往右比。每一位只留下数字最大的数，直到只剩一个。52,318、52,381、52,183 和 51,832 中，最大的是 52,381。\n\n检验：把四个数排好：$51{,}832 < 52{,}183 < 52{,}318 < 52{,}381$。\n\n> **注意。** 不能只看最后几位。52,318 的个位是 8，但它不是最大的。",
      ],
      (rng) => {
        const len = rng.int(4, 6);
        const base = digitsOf(randomWithDigits(rng, len)).reverse();
        const nums = new Set<number>([Number(base.join(""))]);
        while (nums.size < 4) {
          const ds = rng.shuffle([...base]);
          if (ds[0] !== 0) nums.add(Number(ds.join("")));
          if (nums.size < 4 && rng.bool(0.3)) {
            const v = [...base];
            const i = rng.int(1, len - 1);
            v[i] = rng.int(0, 9);
            nums.add(Number(v.join("")));
          }
        }
        const list = [...nums];
        const least = rng.bool(0.3);
        const target = least ? Math.min(...list) : Math.max(...list);
        const sorted = [...list].sort((a, b) => a - b);
        const firstDiff = (x: number) => {
          const s = String(x);
          const t0 = String(target);
          const i = [...s].findIndex((c, j) => c !== t0[j]);
          return [i, Number(s[i]), Number(t0[i])] as const;
        };
        return pickedMath(
          rng,
          least
            ? [`Which number is the least: $${list.map(fmt).join("$, $")}$?`, `$${list.map(fmt).join("$、$")}$ 中哪个数最小？`]
            : [`Which number is the greatest: $${list.map(fmt).join("$, $")}$?`, `$${list.map(fmt).join("$、$")}$ 中哪个数最大？`],
          fmt(target),
          list
            .filter((x) => x !== target)
            .map((x) => {
              const [i, dx, dt] = firstDiff(x);
              const place = placeNames[len - 1 - i]!;
              return [
                fmt(x),
                `It first differs from ${plain(target)} in the ${place.en} place, where it has ${dx} and ${plain(target)} has ${dt}. So it is ${least ? "greater" : "less"}.`,
                `它和 ${plain(target)} 第一个不同的是${place["zh-CN"]}：它是 ${dx}，${plain(target)} 是 ${dt}，所以它更${least ? "大" : "小"}。`,
              ] as const;
            }),
          [
            [
              ["Line them up by place", "按数位对齐"],
              [
                `All ${list.length} numbers have ${len} digits, so start at the left.`,
                `${list.length} 个数都是 ${len} 位数，从最高位开始比。`,
              ],
            ],
            [
              [`Keep the ${least ? "smallest" : "biggest"} digit each time`, least ? "每一位留下数字最小的" : "每一位留下数字最大的"],
              [`Comparing place by place leaves ${plain(target)}.`, `逐位比下来，剩下 ${plain(target)}。`],
            ],
          ],
          [`In order: $${sorted.map(fmt).join(" < ")}$.`, `从小到大排：$${sorted.map(fmt).join(" < ")}$。`],
          digitsChart(list),
        );
      },
      placeChartFigure(placesOf(5), [chartRow(52318, 5), chartRow(52381, 5), chartRow(52183, 5), chartRow(51832, 5)], 3),
    ),
    point(
      "missing-digits-in-comparisons",
      ["A missing digit", "缺少的数字"],
      [
        "Try the digit that makes the places match. Then look at the rest. In $3{,}\\square52 < 3{,}652$, try 6: then 3,652 and 3,652 are equal. Equal is not less, so 6 is too big. The greatest digit that works is 5.\n\nCheck: $3{,}552 < 3{,}652$ is true.\n\n> **Watch out.** When the matching digit gives equal numbers, it does not work. Go one lower.",
        "先试让这一位相同的数字，再看后面几位。在 $3{,}\\square52 < 3{,}652$ 中，试 6：3,652 和 3,652 相等。相等不是小于，所以 6 太大了。能填的最大数字是 5。\n\n检验：$3{,}552 < 3{,}652$ 成立。\n\n> **注意。** 填相同的数字后两数相等，就不行，要再小一点。",
      ],
      (rng) => {
        let b: number;
        let k: number;
        let a: number;
        const len = rng.int(4, 6);
        do {
          b = randomWithDigits(rng, len);
          k = rng.int(1, len - 2);
          const ds = digitsOf(b);
          for (let i = 0; i < k; i++) ds[i] = rng.int(0, 9);
          a = Number(ds.reverse().join(""));
        } while (digitAt(b, k) === 0 || digitAt(b, k) === 9 || a % 10 ** k === b % 10 ** k);
        const same = digitAt(b, k);
        const restA = a % 10 ** k;
        const restB = b % 10 ** k;
        const lowerLess = restA < restB;
        const value = lowerLess ? same : same - 1;
        let seen = 0;
        const target = String(a).length - 1 - k;
        const boxed = fmt(a)
          .split("")
          .map((c) => (/\d/.test(c) ? (seen++ === target ? "\\square" : c) : c))
          .join("");
        const withValue = a - digitAt(a, k) * 10 ** k + value * 10 ** k;
        return answered(
          [`What is the greatest digit that can go in the box? $$${boxed} < ${fmt(b)}$$`, `方框中最大能填几？$$${boxed} < ${fmt(b)}$$`],
          value,
          [
            [
              ["Try the matching digit", "先试相同的数字"],
              [`With ${same} in the box, the places up to the box match.`, `方框里填 ${same}，到方框为止各位都相同。`],
            ],
            [
              ["Look at the rest", "比后面几位"],
              lowerLess
                ? [
                    `Then ${restA} < ${restB}, so ${same} works. Any bigger digit makes the left number too big. The answer is ${value}.`,
                    `接下来 ${restA} < ${restB}，所以 ${same} 可以。再大就太大了。答案是 ${value}。`,
                  ]
                : [
                    `Then ${restA} is not less than ${restB}, so ${same} does not work. Go one lower: ${value}.`,
                    `接下来 ${restA} 不小于 ${restB}，所以 ${same} 不行，再小一个：${value}。`,
                  ],
            ],
          ],
          [`$${fmt(withValue)} < ${fmt(b)}$ is true.`, `$${fmt(withValue)} < ${fmt(b)}$ 成立。`],
          [
            lowerLess
              ? [
                  value - 1,
                  `${value - 1} works, but ${value} works too and is greater.`,
                  `${value - 1} 可以，但 ${value} 也可以，而且更大。`,
                ]
              : [
                  value + 1,
                  `With ${value + 1}, the rest gives ${restA} against ${restB}, and that is not less.`,
                  `填 ${value + 1} 时，后面是 ${restA} 比 ${restB}，不是小于。`,
                ],
            [9, "With 9, the left number is bigger.", "填 9 时，左边的数更大。"],
            [same + 1, `With ${same + 1}, the left number is bigger.`, `填 ${same + 1} 时，左边的数更大。`],
          ],
          { figure: placeChartFigure(placesOf(len), [chartRow(a, len).map((c, i) => (i === target ? "?" : c)), chartRow(b, len)], target) },
        );
      },
      placeChartFigure(
        [1000, 100, 10, 1],
        [
          ["3", "?", "5", "2"],
          ["3", "6", "5", "2"],
        ],
        1,
      ),
    ),
  ],
};

/** RoundingMode is the kind of rounding a topic practices. */
type RoundingMode = "down" | "up" | "nine" | "mixed";

/** roundingNumber is a number whose rounding to the nearest 10ᵏ is of the given kind. */
function roundingNumber(rng: Rng, k: number, mode: RoundingMode): number {
  for (;;) {
    const n = randomWithDigits(rng, rng.int(k + 2, Math.min(7, k + 4)));
    const next = digitAt(n, k - 1);
    const here = digitAt(n, k);
    if (mode === "down" && next < 5 && n % 10 ** k !== 0) return n;
    if (mode === "up" && next >= 5 && here !== 9) return n;
    if (mode === "nine" && next >= 5 && here === 9) return n;
    if (mode === "mixed" && here !== 9 && n % 10 ** k !== 0) return n;
  }
}

/** roundingLine draws the stretch between the two round numbers around n, with n marked and the halfway point labelled. */
const roundingLine = (n: number, k: number): Figure => {
  const unit = 10 ** k;
  const down = Math.floor(n / unit) * unit;
  const up = down + unit;
  return lineFigure({ lo: down, hi: up, step: unit / 10, labels: [down, down + unit / 2, up], marks: [{ at: n, text: grouped(n) }] }, [
    `A number line from ${grouped(down)} to ${grouped(up)} with ${grouped(n)} marked and the halfway point ${grouped(down + unit / 2)} labelled.`,
    `一条从 ${grouped(down)} 到 ${grouped(up)} 的数轴，标出 ${grouped(n)}，中点 ${grouped(down + unit / 2)} 也标了出来。`,
  ]);
};

/** roundingKP builds a rounding knowledge point for the places in ks. */
function roundingKP(
  id: string,
  title: Pair,
  mode: RoundingMode,
  ks: readonly number[],
  explanation: Pair,
  figure: Figure,
): KnowledgePointDef {
  return point(
    id,
    title,
    explanation,
    (rng) => {
      const k = rng.pick(ks);
      const n = roundingNumber(rng, k, mode);
      const value = roundTo(n, k);
      const down = Math.floor(n / 10 ** k) * 10 ** k;
      const up = down + 10 ** k;
      const next = digitAt(n, k - 1);
      const name = roundNames[k]!;
      const [toDown, toUp] = [n - down, up - n];
      return answered(
        [`Round $${fmt(n)}$ to the nearest ${name.en}.`, `把 $${fmt(n)}$ 四舍五入到${placeNames[k]!["zh-CN"]}。`],
        value,
        [
          [
            ["Find the two round numbers", "找出前后两个整数"],
            [`${plain(n)} is between ${plain(down)} and ${plain(up)}.`, `${plain(n)} 在 ${plain(down)} 和 ${plain(up)} 之间。`],
          ],
          [
            ["Look at the next digit", "看下一位"],
            next >= 5
              ? [
                  `The digit right after the ${placeNames[k]!.en} place is ${next}. That is 5 or more, so round up to ${plain(up)}.`,
                  `${placeNames[k]!["zh-CN"]}右边一位是 ${next}，大于或等于 5，所以进一，得 ${plain(up)}。`,
                ]
              : [
                  `The digit right after the ${placeNames[k]!.en} place is ${next}. That is less than 5, so round down to ${plain(down)}.`,
                  `${placeNames[k]!["zh-CN"]}右边一位是 ${next}，小于 5，所以舍去，得 ${plain(down)}。`,
                ],
          ],
        ],
        toDown === toUp
          ? [
              `${plain(n)} is exactly halfway, ${plain(toDown)} from each, and halfway rounds up.`,
              `${plain(n)} 正好在中间，离两边都是 ${plain(toDown)}，正中间要进一。`,
            ]
          : [
              `${plain(n)} is ${plain(toDown)} from ${plain(down)} and ${plain(toUp)} from ${plain(up)}, so ${plain(value)} is closer.`,
              `${plain(n)} 离 ${plain(down)} 有 ${plain(toDown)}，离 ${plain(up)} 有 ${plain(toUp)}，所以 ${plain(value)} 更近。`,
            ],
        [
          [
            value === down ? up : down,
            value === down ? "That rounds up, but the next digit is less than 5." : "That rounds down, but the next digit is 5 or more.",
            value === down ? "这是进一了，可是下一位小于 5。" : "这是舍去了，可是下一位大于或等于 5。",
          ],
          [roundTo(n, k + 1), "That rounds to the next bigger place.", "这是四舍五入到了更高一位。"],
          [roundTo(n, k - 1), "That rounds to the next smaller place.", "这是四舍五入到了更低一位。"],
          ...(mode === "nine"
            ? [
                [
                  down + 10 ** (k + 1),
                  "That writes 10 in one place. A 10 carries 1 to the place on the left.",
                  "这是在一位上写了 10。满十要向左边一位进 1。",
                ] as const,
              ]
            : []),
        ],
        { figure: roundingLine(n, k) },
      );
    },
    figure,
  );
}

/** roundingDownWholeNumbers rounds numbers whose next digit is less than 5. */
export const roundingDownWholeNumbers: TopicDef = {
  id: "rounding-down-whole-numbers",
  title: t("Rounding Down Whole Numbers", "整数的舍去"),
  summary: t(
    "To round to a place, look at the digit just to its right. If it is less than 5, round down: keep the digit in the rounding place and replace every digit to its right by 0. So 4,327 rounded to the nearest hundred is 4,300.",
    "把一个数四舍五入到某一位时，看这一位右边的数字。如果它小于 5，就舍去：保留这一位上的数字，把它右边的各位都改成 0。所以 4,327 四舍五入到百位是 4,300。",
  ),
  intro: t(
    'A game has 632 players. The news says "about 630 players". Why 630? On a number line, 632 sits between 630 and 640. It is only 2 away from 630, but 8 away from 640.\n\nCheck: the ones digit is 2, less than 5, so we round down.\n\nIn this lesson we round down to tens, hundreds, thousands and more.',
    "一个游戏有 632 名玩家，新闻说“约 630 名玩家”。为什么是 630？在数轴上，632 在 630 和 640 之间。它离 630 只有 2，离 640 有 8。\n\n检验：个位是 2，小于 5，所以舍去。\n\n本课我们学习把数舍去到十位、百位、千位和更高的数位。",
  ),
  prerequisites: ["comparing-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    roundingKP(
      "rounding-down-to-tens-and-hundreds",
      ["Tens and hundreds", "到十位和百位"],
      "down",
      [1, 2],
      [
        "Look at the digit just right of the place you round to. If it is less than 5, keep the rounding digit. Change every digit after it to 0. $632$ to the nearest ten is $630$.\n\nCheck: 632 is 2 from 630 and 8 from 640. 630 is closer.\n\n> **Watch out.** Rounding down does not take 1 away. 632 rounds to 630, not 620.",
        "看要保留的数位右边一位。如果小于 5，保留的数字不变，后面的各位都写成 0。$632$ 四舍五入到十位是 $630$。\n\n检验：632 离 630 有 2，离 640 有 8，630 更近。\n\n> **注意。** 舍去不是减 1。632 约等于 630，不是 620。",
      ],
      roundingLine(632, 1),
    ),
    roundingKP(
      "rounding-down-to-thousands-and-beyond",
      ["Thousands and beyond", "到千位及以上"],
      "down",
      [3, 4, 5],
      [
        "Bigger places work the same way. Look only at the next digit to the right. $58{,}412$ to the nearest thousand: the hundreds digit is 4, so it is $58{,}000$.\n\nCheck: 58,412 is 412 from 58,000 and 588 from 59,000.\n\n> **Watch out.** Look at the hundreds digit only. The 12 at the end does not matter.",
        "保留到更高的数位也一样，只看右边紧挨着的一位。$58{,}412$ 四舍五入到千位：百位是 4，所以是 $58{,}000$。\n\n检验：58,412 离 58,000 有 412，离 59,000 有 588。\n\n> **注意。** 只看百位，末尾的 12 不用管。",
      ],
      roundingLine(58412, 3),
    ),
  ],
};

/** roundingUpWholeNumbers rounds numbers whose next digit is 5 or more. */
export const roundingUpWholeNumbers: TopicDef = {
  id: "rounding-up-whole-numbers",
  title: t("Rounding Up Whole Numbers", "整数的进一"),
  summary: t(
    "If the digit to the right of the rounding place is 5 or more, round up: add 1 to the digit in the rounding place and replace every digit to its right by 0. So 4,372 rounded to the nearest hundred is 4,400.",
    "如果这一位右边的数字大于或等于 5，就进一：把这一位上的数字加 1，并把它右边的各位都改成 0。所以 4,372 四舍五入到百位是 4,400。",
  ),
  intro: t(
    "A jar holds 647 beans. Is that closer to 640 or to 650? On a number line, 647 is 7 past 640 but only 3 before 650. So it rounds up to 650.\n\nCheck: the ones digit is 7, which is 5 or more, so we round up.\n\nIn this lesson we round up, and decide between up and down.",
    "罐子里有 647 颗豆子。它更接近 640 还是 650？在数轴上，647 比 640 多 7，比 650 只少 3，所以进一成 650。\n\n检验：个位是 7，大于或等于 5，所以进一。\n\n本课我们学习进一，并判断是进一还是舍去。",
  ),
  prerequisites: ["rounding-down-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    roundingKP(
      "rounding-up-to-tens-and-hundreds",
      ["Tens and hundreds", "到十位和百位"],
      "up",
      [1, 2],
      [
        "If the next digit is 5 or more, add 1 to the rounding digit. Change every digit after it to 0. $647$ to the nearest ten is $650$.\n\nCheck: 647 is 3 from 650 and 7 from 640. 650 is closer.\n\n> **Watch out.** A 5 rounds up too. 645 rounds to 650.",
        "如果下一位是 5 或更大，就在保留的数字上加 1，后面的各位都写成 0。$647$ 四舍五入到十位是 $650$。\n\n检验：647 离 650 有 3，离 640 有 7，650 更近。\n\n> **注意。** 是 5 也要进一。645 约等于 650。",
      ],
      roundingLine(647, 1),
    ),
    roundingKP(
      "mixed-rounding-to-larger-places",
      ["Up or down", "进一还是舍去"],
      "mixed",
      [3, 4, 5],
      [
        "Look only at the digit just right of the rounding place. 5 or more rounds up. Less than 5 rounds down. $58{,}612$ to the nearest thousand: the hundreds digit is 6, so $59{,}000$.\n\nCheck: 58,612 is 388 from 59,000 and 612 from 58,000.\n\n> **Watch out.** Do not look further right. Only the very next digit decides.",
        "只看要保留的数位右边一位：5 或更大就进一，小于 5 就舍去。$58{,}612$ 四舍五入到千位：百位是 6，所以是 $59{,}000$。\n\n检验：58,612 离 59,000 有 388，离 58,000 有 612。\n\n> **注意。** 不要再往右看，只由紧挨着的那一位决定。",
      ],
      roundingLine(58612, 3),
    ),
  ],
};

/** roundingUpTheDigit9 rounds up when the rounding digit is 9, carrying into the next place. */
export const roundingUpTheDigit9: TopicDef = {
  id: "rounding-up-the-digit-9",
  title: t("Rounding Up the Digit 9", "数字 9 的进一"),
  summary: t(
    "When the digit in the rounding place is 9 and we round up, it becomes 10: write 0 and carry 1 to the place on its left. So 3,961 rounded to the nearest hundred is 4,000, and 29,95x rounds to 30,000 at the tens.",
    "当这一位上的数字是 9 而需要进一时，它变成 10：写 0 并向左边一位进 1。所以 3,961 四舍五入到百位是 4,000。",
  ),
  intro: t(
    "A shop sold 596 ice creams. Round to the nearest ten. The 9 tens should go up by one, but 10 tens make a hundred. So 596 rounds to 600.\n\nCheck: 596 is only 4 below 600, and 600 is a multiple of 10.\n\nIn this lesson we round up when the rounding digit is a 9.",
    "一家店卖了 596 个冰淇淋，四舍五入到十位。9 个十要再加一个，可是 10 个十就是一个百，所以 596 约等于 600。\n\n检验：596 只比 600 少 4，而 600 是整十数。\n\n本课我们学习当保留的数字是 9 时怎样进一。",
  ),
  prerequisites: ["rounding-up-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    roundingKP(
      "rounding-up-a-9-to-tens-and-hundreds",
      ["Tens and hundreds", "到十位和百位"],
      "nine",
      [1, 2],
      [
        "When the rounding digit is 9 and you round up, it becomes 10. Write 0 there and carry 1 to the left. $596$ to the nearest ten: 9 tens and 1 more ten make 1 hundred, so $600$.\n\nCheck: 596 is 4 from 600 and 6 from 590.\n\n> **Watch out.** Do not write 10 in one place. 5100 is wrong.",
        "保留的数字是 9 又要进一时，它变成 10：这一位写 0，向左边一位进 1。$596$ 四舍五入到十位：9 个十再加一个十是 1 个百，所以是 $600$。\n\n检验：596 离 600 有 4，离 590 有 6。\n\n> **注意。** 不能在一位上写 10，5100 是错的。",
      ],
      roundingLine(596, 1),
    ),
    roundingKP(
      "rounding-up-a-9-to-larger-places",
      ["Thousands and beyond", "到千位及以上"],
      "nine",
      [3, 4],
      [
        "Bigger places work the same way. A 9 that rounds up becomes 0 and carries 1 to the left. $49{,}712$ to the nearest thousand: the hundreds digit 7 says round up. 9 thousands become 10 thousands, so $50{,}000$.\n\nCheck: 49,712 is 288 from 50,000 and 712 from 49,000.\n\n> **Watch out.** The carry changes the digit on the left too. 4 becomes 5.",
        "更高的数位也一样。要进一的 9 变成 0，并向左边一位进 1。$49{,}712$ 四舍五入到千位：百位是 7，要进一，9 个千变成 10 个千，所以是 $50{,}000$。\n\n检验：49,712 离 50,000 有 288，离 49,000 有 712。\n\n> **注意。** 进位会让左边的数字也变：4 变成 5。",
      ],
      roundingLine(49712, 3),
    ),
  ],
};
// ---------------------------------------------------------------------------
// Addition and subtraction

/** Sizes chooses the numbers of an addition or subtraction exercise. */
type Sizes = (rng: Rng) => number[];

/** placeEn and placeZh name a column of a written sum: "Ones", "个位". */
const placeEn = (k: number) => placeNames[k]!.en.charAt(0).toUpperCase() + placeNames[k]!.en.slice(1);

/** addColumns works a sum column by column from the ones, saying each column's sum and carry. */
function addColumns(ns: readonly number[]): { en: string; zh: string; carries: number[] } {
  const s = ns.reduce((a, b) => a + b, 0);
  const width = String(Math.max(...ns)).length;
  const en: string[] = [];
  const zh: string[] = [];
  const carries: number[] = [0];
  let carry = 0;
  for (let k = 0; k < width; k++) {
    const ds = ns.filter((n) => n >= 10 ** k).map((n) => digitAt(n, k));
    const col = ds.reduce((a, b) => a + b, 0) + carry;
    const terms = [...ds, ...(carry ? [carry] : [])].join(" + ");
    const sumText = ds.length + (carry ? 1 : 0) > 1 ? `${terms} = ${col}` : `${col}`;
    const out = Math.floor(col / 10);
    if (out > 0 && k < width - 1) {
      en.push(`${placeEn(k)}: ${sumText}. Write ${col % 10}, carry ${out}.`);
      zh.push(`${placeNames[k]!["zh-CN"]}：${sumText}，写 ${col % 10}，进 ${out}。`);
    } else {
      en.push(`${placeEn(k)}: ${sumText}.`);
      zh.push(`${placeNames[k]!["zh-CN"]}：${sumText}。`);
    }
    carry = out;
    carries.push(out);
  }
  en.push(`So the sum is ${plain(s)}.`);
  zh.push(`所以和是 ${plain(s)}。`);
  return { en: en.join(" "), zh: zh.join(""), carries };
}

/** additionChart writes the carries, the addends and the sum in a place-value chart. */
function additionChart(ns: readonly number[]): Figure {
  const s = ns.reduce((a, b) => a + b, 0);
  const len = String(s).length;
  const { carries } = addColumns(ns);
  const carryRow = range0(len).map((i) => {
    const c = carries[len - 1 - i] ?? 0;
    return c > 0 && len - 1 - i > 0 ? `${c}` : "";
  });
  return placeChartFigure(placesOf(len), [carryRow, ...ns.map((n) => chartRow(n, len)), chartRow(s, len)]);
}

/** subColumns works a difference column by column from the ones, saying each borrow. */
function subColumns(a: number, b: number): { en: string; zh: string; tops: string[] } {
  const width = String(a).length;
  const en: string[] = [];
  const zh: string[] = [];
  const tops: string[] = [];
  let borrow = 0;
  for (let k = 0; k < width; k++) {
    const raw = digitAt(a, k);
    const bd = b >= 10 ** k ? digitAt(b, k) : 0;
    let top = raw - borrow;
    const lent = borrow > 0;
    const p = placeNames[k]!;
    if (top < bd) {
      top += 10;
      borrow = 1;
      if (lent && raw === 0) {
        en.push(`${placeEn(k)}: 0 lent 1, so it borrows from the left first and has 9. $9 - ${bd} = ${9 - bd}$.`);
        zh.push(`${p["zh-CN"]}：0 借出了 1，要先向左边借，变成 9。$9 - ${bd} = ${9 - bd}$。`);
      } else {
        const now = lent
          ? `${raw} lent 1, so it is ${raw - 1}. That is less than ${bd}, so borrow 1 from the left.`
          : `${raw} is less than ${bd}, so borrow 1 from the left.`;
        const nowZh = lent ? `${raw} 借出了 1，变成 ${raw - 1}，不够减 ${bd}，向左边借 1。` : `${raw} 不够减 ${bd}，向左边借 1。`;
        en.push(`${placeEn(k)}: ${now} $${top} - ${bd} = ${top - bd}$.`);
        zh.push(`${p["zh-CN"]}：${nowZh}$${top} - ${bd} = ${top - bd}$。`);
      }
    } else {
      borrow = 0;
      if (top === 0 && bd === 0 && k === width - 1) {
        en.push(`${placeEn(k)}: 1 lent 1, so nothing is left.`);
        zh.push(`${p["zh-CN"]}：1 借出了 1，什么也不剩。`);
      } else if (lent) {
        en.push(`${placeEn(k)}: ${raw} lent 1, so it is ${top}. $${top} - ${bd} = ${top - bd}$.`);
        zh.push(`${p["zh-CN"]}：${raw} 借出了 1，变成 ${top}。$${top} - ${bd} = ${top - bd}$。`);
      } else {
        en.push(`${placeEn(k)}: $${top} - ${bd} = ${top - bd}$.`);
        zh.push(`${p["zh-CN"]}：$${top} - ${bd} = ${top - bd}$。`);
      }
    }
    tops.unshift(`${top}`);
  }
  en.push(`So the difference is ${plain(a - b)}.`);
  zh.push(`所以差是 ${plain(a - b)}。`);
  return { en: en.join(" "), zh: zh.join(""), tops };
}

/** subtractionChart writes the top number, the number taken away and the difference in a place-value chart. */
function subtractionChart(a: number, b: number): Figure {
  const len = String(a).length;
  return placeChartFigure(placesOf(len), [chartRow(a, len), chartRow(b, len), chartRow(a - b, len)]);
}

/** partsTape draws a bar of the given parts with a total over it. */
const partsTape = (parts: readonly string[], sizes: readonly number[], total: string, lit = -1): Figure =>
  tapeFigure(
    [{ total, pieces: parts.map((text, i) => ({ size: sizes[i]!, text, lit: i === lit, dashed: text === "?" })) }],
    [
      `A bar cut into parts ${parts.join(", ")}, with ${total} over the whole bar.`,
      `一个长条，分成 ${parts.join("、")} 几段，整条上方写着 ${total}。`,
    ],
  );

/** additionTopic builds an addition topic: compute the sum, then solve a word problem. */
function additionTopic(
  id: string,
  title: Text,
  summary: Text,
  intro: Pair,
  prerequisites: string[],
  sizes: Sizes,
  example: readonly number[],
  watch: Pair,
): TopicDef {
  const exSum = example.reduce((a, b) => a + b, 0);
  const exWork = addColumns(example);
  const exTex = example.map(fmt).join(" + ");
  return {
    id,
    title,
    summary,
    intro: t(intro[0], intro[1]),
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss("4.NBT.B.4"),
    knowledgePoints: [
      point(
        `${id}-computing`,
        ["Finding the sum", "求和"],
        [
          `Line up the digits by place. Add each column from the right. If a column makes 10 or more, carry to the next column. $${exTex}$: ${exWork.en}\n\nCheck: subtract back. $${fmt(exSum)} - ${fmt(example[example.length - 1]!)} = ${fmt(exSum - example[example.length - 1]!)}$, which is ${example.length > 2 ? "the sum of the other numbers" : "the other number"}.\n\n> **Watch out.** ${watch[0]}`,
          `把相同数位对齐，从右往左逐列相加。某一列满 10，就向左边一列进位。$${exTex}$：${exWork.zh}\n\n检验：减回去。$${fmt(exSum)} - ${fmt(example[example.length - 1]!)} = ${fmt(exSum - example[example.length - 1]!)}$，正是${example.length > 2 ? "其他几个数的和" : "另一个加数"}。\n\n> **注意。** ${watch[1]}`,
        ],
        (rng) => {
          const ns = sizes(rng);
          const s = ns.reduce((a, b) => a + b, 0);
          const tex = ns.map(fmt).join(" + ");
          const work = addColumns(ns);
          const last = ns[ns.length - 1]!;
          const rest = ns.slice(0, -1);
          return answered(
            [`Find $${tex}$.`, `计算 $${tex}$。`],
            s,
            [
              [
                ["Line up the places", "数位对齐"],
                [`Write the numbers in columns with the ones under the ones.`, `把数竖着写，个位对齐个位。`],
              ],
              [
                ["Add column by column", "逐列相加"],
                [work.en, work.zh],
              ],
            ],
            [
              `Subtract back: $${fmt(s)} - ${fmt(last)} = ${fmt(s - last)}$. ${rest.length > 1 ? `That is $${rest.map(fmt).join(" + ")}$.` : "That is the first number."}`,
              `减回去：$${fmt(s)} - ${fmt(last)} = ${fmt(s - last)}$。${rest.length > 1 ? `这正是 $${rest.map(fmt).join(" + ")}$。` : "这正是第一个数。"}`,
            ],
            [
              [
                ns.reduce(noCarrySum),
                "That forgets to carry. A column of 10 or more gives 1 to the next column.",
                "这忘了进位。一列满 10 要向左边一列进 1。",
              ],
              [s - 10, "That drops a carry into the tens.", "这漏了向十位的进位。"],
              [s + 10, "That carries into the tens when it should not.", "这在十位多进了 1。"],
              [s - 100, "That drops a carry into the hundreds.", "这漏了向百位的进位。"],
            ],
            { figure: additionChart(ns) },
          );
        },
        additionChart(example),
      ),
      point(
        `${id}-word-problems`,
        ["Word problems", "应用题"],
        [
          `"How many in all" puts amounts together, so add. A website has ${plain(example[0]!)} visits on Monday and ${plain(example[1]!)} on Tuesday. In all: $${fmt(example[0]!)} + ${fmt(example[1]!)} = ${fmt(example[0]! + example[1]!)}$ visits.\n\nCheck: the total must be bigger than each day. ${plain(example[0]! + example[1]!)} is bigger than both.\n\n> **Watch out.** "In all" means add. Do not subtract the smaller amount.`,
          `“一共”是把几个量合起来，所以用加法。一个网站星期一被访问 ${plain(example[0]!)} 次，星期二 ${plain(example[1]!)} 次。一共：$${fmt(example[0]!)} + ${fmt(example[1]!)} = ${fmt(example[0]! + example[1]!)}$ 次。\n\n检验：总数一定比每一天都多。${plain(example[0]! + example[1]!)} 比两天都多。\n\n> **注意。** “一共”要用加法，不要用减法。`,
        ],
        (rng) => {
          const ns = sizes(rng);
          const s = ns.reduce((a, b) => a + b, 0);
          const days = [t("Monday", "星期一"), t("Tuesday", "星期二"), t("Wednesday", "星期三")];
          const partsEn = ns.map((n, i) => `${plain(n)}${i === 0 ? " visits" : ""} on ${days[i]!.en}`);
          const listEn = ns.length === 3 ? `${partsEn[0]}, ${partsEn[1]}, and ${partsEn[2]}` : partsEn.join(" and ");
          const listZh = ns.map((n, i) => `${days[i]!["zh-CN"]} ${plain(n)} 次`).join("，");
          const work = addColumns(ns);
          const big = Math.max(...ns);
          return answered(
            [`A website had ${listEn}. How many visits did it have in all?`, `一个网站的访问次数：${listZh}。一共被访问了多少次？`],
            s,
            [
              [
                ["Choose the operation", "选运算"],
                [`"In all" puts the ${ns.length} days together, so add.`, `“一共”是把这 ${ns.length} 天合起来，所以用加法。`],
                [`${ns.map(fmt).join(" + ")}`],
              ],
              [
                ["Add column by column", "逐列相加"],
                [work.en, work.zh],
              ],
            ],
            [
              `Subtract back: $${fmt(s)} - ${fmt(ns[0]!)} = ${fmt(s - ns[0]!)}$. That is ${ns.length > 2 ? `$${ns.slice(1).map(fmt).join(" + ")}$` : "the other day"}.`,
              `减回去：$${fmt(s)} - ${fmt(ns[0]!)} = ${fmt(s - ns[0]!)}$。这正是${ns.length > 2 ? ` $${ns.slice(1).map(fmt).join(" + ")}$` : "另一天的次数"}。`,
            ],
            [
              [ns.reduce(noCarrySum), "That forgets to carry.", "这忘了进位。"],
              [
                ns.length === 2 ? big - Math.min(...ns) : s - ns[ns.length - 1]!,
                ns.length === 2 ? "That subtracts. In all means add." : "That leaves out one day.",
                ns.length === 2 ? "这是减法。“一共”要用加法。" : "这漏加了一天。",
              ],
              [s - 100, "That drops a carry into the hundreds.", "这漏了向百位的进位。"],
            ],
            { figure: partsTape(ns.map(grouped), ns, "?") },
          );
        },
        partsTape([grouped(example[0]!), grouped(example[1]!)], [example[0]!, example[1]!], "?"),
      ),
    ],
  };
}

/** carrySizes picks numbers of the given digit counts whose sum carries at least once. */
const carrySizes =
  (...lens: number[]): Sizes =>
  (rng) => {
    for (;;) {
      const ns = lens.map((d) => randomWithDigits(rng, d));
      if (ns.reduce(noCarrySum) !== ns.reduce((a, b) => a + b, 0)) return ns;
    }
  };

/** carryWatch warns against forgetting a carry. */
const carryWatch: Pair = [
  "Add the carry into the next column. Forgetting it makes the answer too small.",
  "进上来的数要加到下一列里。忘了加，答案就小了。",
];

/** addingTwoDigitWholeNumbers adds two two-digit numbers with carrying. */
export const addingTwoDigitWholeNumbers = additionTopic(
  "adding-two-digit-whole-numbers",
  t("Adding Two-Digit Whole Numbers", "两位数加法"),
  t(
    "Add two-digit numbers by adding the ones, carrying a ten if the ones make 10 or more, and then adding the tens: 47 + 38 = 85.",
    "两位数相加：先加个位，满十向十位进一，再加十位：47 + 38 = 85。",
  ),
  [
    "Mia has 47 stickers. Her friend gives her 38 more. How many now? Add the ones: 7 + 8 = 15. That is 1 ten and 5 ones. Add the tens: 4 + 3 + 1 = 8. She has 85 stickers.\n\nCheck: 85 − 38 = 47.\n\nIn this lesson we add two-digit numbers and carry a ten.",
    "米娅有 47 张贴纸，朋友又给了她 38 张。现在有多少张？先加个位：7 + 8 = 15，是 1 个十和 5 个一。再加十位：4 + 3 + 1 = 8。她有 85 张。\n\n检验：85 − 38 = 47。\n\n本课我们学习两位数加法和进位。",
  ],
  ["place-value-with-numbers-up-to-four-digits"],
  carrySizes(2, 2),
  [47, 38],
  ["Line up the ones under the ones. Then add the carried ten to the tens.", "个位对齐个位。进上来的 1 个十要加到十位上。"],
);

/** addingThreeDigitAndTwoDigitNumbers adds a two-digit number to a three-digit one. */
export const addingThreeDigitAndTwoDigitNumbers = additionTopic(
  "adding-three-digit-and-two-digit-numbers",
  t("Adding Three-Digit and Two-Digit Numbers", "三位数加两位数"),
  t(
    "Line up the ones under the ones: 368 + 57 = 425. A carry from the tens goes into the hundreds.",
    "个位对齐个位：368 + 57 = 425。十位满十要向百位进一。",
  ),
  [
    "A farm has 368 hens and buys 57 more. Write 57 under 368 with the ones lined up. 8 + 7 = 15, carry 1. 6 + 5 + 1 = 12, carry 1. 3 + 1 = 4. Now there are 425 hens.\n\nCheck: 425 − 57 = 368.\n\nIn this lesson we add a two-digit number to a three-digit number.",
    "农场有 368 只母鸡，又买了 57 只。把 57 写在 368 下面，个位对齐。8 + 7 = 15，进 1；6 + 5 + 1 = 12，进 1；3 + 1 = 4。现在有 425 只。\n\n检验：425 − 57 = 368。\n\n本课我们学习三位数加两位数。",
  ],
  ["adding-two-digit-whole-numbers"],
  carrySizes(3, 2),
  [368, 57],
  ["Put the 2-digit number under the tens and ones, not under the hundreds.", "两位数要写在十位和个位下面，不要对着百位。"],
);

/** addingThreeDigitNumbers adds two three-digit numbers. */
export const addingThreeDigitNumbers = additionTopic(
  "adding-three-digit-numbers",
  t("Adding Three-Digit Numbers", "三位数加法"),
  t(
    "Add three-digit numbers column by column from the ones: 476 + 358 = 834. A carry from the hundreds makes a four-digit sum.",
    "三位数相加，从个位起逐列相加：476 + 358 = 834。百位满十会得到四位数的和。",
  ),
  [
    "A class reads 476 pages in May and 358 pages in June. How many pages? Ones: 6 + 8 = 14, carry 1. Tens: 7 + 5 + 1 = 13, carry 1. Hundreds: 4 + 3 + 1 = 8. They read 834 pages.\n\nCheck: 834 − 358 = 476.\n\nIn this lesson we add two three-digit numbers.",
    "一个班五月读了 476 页，六月读了 358 页，一共多少页？个位：6 + 8 = 14，进 1；十位：7 + 5 + 1 = 13，进 1；百位：4 + 3 + 1 = 8。一共 834 页。\n\n检验：834 − 358 = 476。\n\n本课我们学习三位数加三位数。",
  ],
  ["adding-three-digit-and-two-digit-numbers"],
  carrySizes(3, 3),
  [476, 358],
  carryWatch,
);

/** addingNumbersUpToFiveDigits adds numbers of up to five digits. */
export const addingNumbersUpToFiveDigits = additionTopic(
  "adding-numbers-up-to-five-digits",
  t("Adding Numbers Up to Five Digits", "五位数以内的加法"),
  t(
    "The same column method works for numbers of four and five digits: 36,478 + 8,965 = 45,443.",
    "四位数和五位数也用同样的竖式方法相加：36,478 + 8,965 = 45,443。",
  ),
  [
    "A stadium sells 36,478 tickets online and 8,965 at the gate. Bigger numbers, same steps: line up the ones and add each column from the right. The total is 45,443 tickets.\n\nCheck: 45,443 − 8,965 = 36,478.\n\nIn this lesson we add numbers with four and five digits.",
    "体育场网上卖出 36,478 张票，现场卖出 8,965 张。数大了，方法一样：个位对齐，从右往左逐列相加。一共 45,443 张。\n\n检验：45,443 − 8,965 = 36,478。\n\n本课我们学习四位数和五位数的加法。",
  ],
  ["adding-three-digit-numbers", "place-value-with-numbers-up-to-seven-digits"],
  (rng) => carrySizes(rng.int(4, 5), rng.int(3, 5))(rng),
  [36478, 8965],
  ["Line up by the ones on the right, not by the first digit on the left.", "要按右边的个位对齐，不是按左边第一位对齐。"],
);

/** addingNumbersUpToSevenDigits adds numbers in the millions. */
export const addingNumbersUpToSevenDigits = additionTopic(
  "adding-numbers-up-to-seven-digits",
  t("Adding Numbers Up to Seven Digits", "七位数以内的加法"),
  t(
    "Numbers in the millions are added the same way, keeping the digits lined up by place: 2,406,758 + 897,465 = 3,304,223.",
    "百万级的数也同样相加，注意数位对齐：2,406,758 + 897,465 = 3,304,223。",
  ),
  [
    "A city had 2,406,758 visitors last year and 897,465 more came this spring. Line up the ones and add column by column, carrying as you go. That is 3,304,223 visitors.\n\nCheck: 3,304,223 − 897,465 = 2,406,758.\n\nIn this lesson we add numbers in the millions.",
    "一座城市去年有 2,406,758 名游客，今年春天又来了 897,465 名。个位对齐，逐列相加，满十进一，一共 3,304,223 名。\n\n检验：3,304,223 − 897,465 = 2,406,758。\n\n本课我们学习百万级的数的加法。",
  ],
  ["adding-numbers-up-to-five-digits"],
  (rng) => carrySizes(rng.int(6, 7), rng.int(5, 7))(rng),
  [2406758, 897465],
  [
    "A carry can run through many columns. Keep adding it until a column is less than 10.",
    "进位可能一列接一列，要一直加到某一列不满 10 为止。",
  ],
);

/** addingThreeMultiDigitNumbers adds three numbers, where a carry can be 2. */
export const addingThreeMultiDigitNumbers = additionTopic(
  "adding-three-multi-digit-numbers",
  t("Adding Three Multi-Digit Numbers", "三个多位数相加"),
  t(
    "With three numbers, a column can sum to 20 or more, so the carry can be 2: 478 + 365 + 289 = 1,132.",
    "三个数相加时，某一列的和可能达到 20 或更多，进位可能是 2：478 + 365 + 289 = 1,132。",
  ),
  [
    "A shop sells 478, 365 and 289 apples on three days. Add all three at once. Ones: 8 + 5 + 9 = 22. That is 2 tens and 2 ones, so carry 2. The total is 1,132 apples.\n\nCheck: 478 + 365 = 843, and 843 + 289 = 1,132.\n\nIn this lesson we add three numbers, where a carry can be 2.",
    "商店三天分别卖出 478、365 和 289 个苹果。三个数一起加。个位：8 + 5 + 9 = 22，是 2 个十和 2 个一，所以进 2。一共 1,132 个。\n\n检验：478 + 365 = 843，843 + 289 = 1,132。\n\n本课我们学习三个数相加，进位可能是 2。",
  ],
  ["adding-numbers-up-to-five-digits"],
  (rng) => carrySizes(rng.int(3, 4), rng.int(3, 4), rng.int(2, 4))(rng),
  [478, 365, 289],
  ["A column of 20 or more carries 2, not 1.", "一列满 20 要进 2，不是进 1。"],
);

/** estimatingKP builds an estimation knowledge point rounding each number to the nearest 10ᵏ. */
function estimatingKP(id: string, k: number, subtract: boolean): KnowledgePointDef {
  const op = subtract ? "-" : "+";
  const ex = subtract ? (k === 2 ? [823, 368] : [7812, 2456]) : k === 2 ? [468, 237] : [4612, 2391];
  const [ea, eb] = [ex[0]!, ex[1]!];
  const [era, erb] = [roundTo(ea, k), roundTo(eb, k)];
  const [eEst, eExact] = subtract ? [era - erb, ea - eb] : [era + erb, ea + eb];
  const line = (est: number, exact: number) => {
    const unit = 10 ** k;
    const lo = Math.floor(Math.min(est, exact) / unit) * unit;
    let hi = Math.ceil(Math.max(est, exact) / unit) * unit;
    if (hi === lo) hi += unit;
    const labels = range0((hi - lo) / unit + 1).map((i) => lo + i * unit);
    return lineFigure(
      {
        lo,
        hi,
        step: unit / 10,
        labels,
        marks: [
          { at: exact, text: grouped(exact) },
          { at: est, result: true },
        ],
      },
      [
        `A number line showing the exact answer ${grouped(exact)} near the estimate ${grouped(est)}.`,
        `一条数轴，标出准确结果 ${grouped(exact)}，它靠近估算结果 ${grouped(est)}。`,
      ],
    );
  };
  return point(
    id,
    [`Rounding to the nearest ${roundNames[k]!.en}`, `四舍五入到${placeNames[k]!["zh-CN"]}`],
    [
      `To estimate, round each number first. Then ${subtract ? "subtract" : "add"} the round numbers. $${fmt(ea)} ${op} ${fmt(eb)} \\approx ${fmt(era)} ${op} ${fmt(erb)} = ${fmt(eEst)}$.\n\nCheck: the exact answer is $${fmt(eExact)}$, close to $${fmt(eEst)}$.\n\n> **Watch out.** Round each number before you ${subtract ? "subtract" : "add"}, not the exact answer after.`,
      `估算时，先把每个数取近似值，再把近似数${subtract ? "相减" : "相加"}。$${fmt(ea)} ${op} ${fmt(eb)} \\approx ${fmt(era)} ${op} ${fmt(erb)} = ${fmt(eEst)}$。\n\n检验：准确结果是 $${fmt(eExact)}$，和 $${fmt(eEst)}$ 接近。\n\n> **注意。** 要先把每个数取近似值再${subtract ? "减" : "加"}，不是算出准确结果后再取近似值。`,
    ],
    (rng) => {
      let a: number;
      let b: number;
      do {
        a = randomWithDigits(rng, k + 1);
        b = randomWithDigits(rng, k + 1);
        if (subtract && b > a) [a, b] = [b, a];
      } while (
        a === b ||
        roundTo(a, k) === roundTo(b, k) ||
        roundTo(subtract ? a - b : a + b, k) === (subtract ? roundTo(a, k) - roundTo(b, k) : roundTo(a, k) + roundTo(b, k)) ||
        a % 10 ** k === 0
      );
      const [ra, rb] = [roundTo(a, k), roundTo(b, k)];
      const value = subtract ? ra - rb : ra + rb;
      const exact = subtract ? a - b : a + b;
      const name = placeNames[k]!;
      return answered(
        [
          `Estimate $${fmt(a)} ${op} ${fmt(b)}$ by first rounding each number to the nearest ${roundNames[k]!.en}.`,
          `先把每个数四舍五入到${name["zh-CN"]}，再估算 $${fmt(a)} ${op} ${fmt(b)}$。`,
        ],
        value,
        [
          [
            ["Round each number", "把每个数取近似值"],
            [`Look at the digit right after the ${name.en} place.`, `看${name["zh-CN"]}右边一位。`],
            [`${fmt(a)} \\approx ${fmt(ra)}`, `${fmt(b)} \\approx ${fmt(rb)}`],
          ],
          [[subtract ? "Subtract" : "Add", subtract ? "相减" : "相加"], ["", ""], [`${fmt(ra)} ${op} ${fmt(rb)} = ${fmt(value)}`]],
        ],
        [
          `The exact answer is $${fmt(exact)}$, which is close to $${fmt(value)}$.`,
          `准确结果是 $${fmt(exact)}$，和 $${fmt(value)}$ 接近。`,
        ],
        [
          [exact, "That is the exact answer. The question asks for an estimate.", "这是准确结果，题目要的是估算结果。"],
          [roundTo(exact, k), "That rounds the exact answer. Round each number first.", "这是把准确结果取了近似值，要先把每个数取近似值。"],
          [
            subtract ? ra + rb : ra - rb,
            subtract ? "That adds. The problem subtracts." : "That subtracts. The problem adds.",
            subtract ? "这是加法，题目是减法。" : "这是减法，题目是加法。",
          ],
        ],
        { figure: line(value, exact) },
      );
    },
    line(eEst, eExact),
  );
}

/** estimatingMultiDigitAddition estimates sums by rounding first. */
export const estimatingMultiDigitAddition: TopicDef = {
  id: "estimating-multi-digit-addition",
  title: t("Estimating Multi-Digit Addition", "多位数加法的估算"),
  summary: t(
    "To estimate a sum, round each number first and add the rounded numbers: 4,612 + 2,391 ≈ 5,000 + 2,000 = 7,000. Estimates check whether an exact answer is reasonable.",
    "估算和时，先把每个数四舍五入，再把近似数相加：4,612 + 2,391 ≈ 5,000 + 2,000 = 7,000。估算可以检验精确答案是否合理。",
  ),
  intro: t(
    "Dad buys a bike for \\$468 and a helmet for \\$237. Is \\$700 about enough? Round: 468 is about 500 and 237 is about 200. $500 + 200 = 700$. So it is about right.\n\nCheck: the exact cost is $468 + 237 = 705$, close to 700.\n\nIn this lesson we estimate a sum by rounding each number first.",
    "爸爸买一辆 468 元的自行车和一个 237 元的头盔，700 元大约够吗？取近似值：468 约是 500，237 约是 200，$500 + 200 = 700$，差不多。\n\n检验：准确花费是 $468 + 237 = 705$，和 700 很接近。\n\n本课我们先把每个数取近似值，再估算和。",
  ),
  prerequisites: ["adding-numbers-up-to-five-digits", "rounding-up-whole-numbers"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [estimatingKP("estimating-sums-to-hundreds", 2, false), estimatingKP("estimating-sums-to-thousands", 3, false)],
};

/** subtractionTopic builds a subtraction topic: compute the difference, then solve a word problem. */
function subtractionTopic(
  id: string,
  title: Text,
  summary: Text,
  intro: Pair,
  prerequisites: string[],
  lens: (rng: Rng) => [number, number],
  example: readonly [number, number],
  watch: Pair,
): TopicDef {
  const pair = (rng: Rng): [number, number] => {
    for (;;) {
      const [la, lb] = lens(rng);
      const a = randomWithDigits(rng, la);
      const b = randomWithDigits(rng, lb);
      if (a > b && smallerFromLarger(a, b) !== a - b) return [a, b];
    }
  };
  const [ea, eb] = example;
  const exWork = subColumns(ea, eb);
  const misses = (a: number, b: number): Miss[] => [
    [
      smallerFromLarger(a, b),
      "That takes the smaller digit from the bigger one in each column. When the top digit is smaller, borrow.",
      "这是每列都用大数减小数。上面的数字小时要借位。",
    ],
    [a - b + 10, "That forgets that a place lent 1.", "这忘了某一位已经借出了 1。"],
    [a + b, "That adds. Taking away means subtract.", "这是加法，拿走要用减法。"],
  ];
  return {
    id,
    title,
    summary,
    intro: t(intro[0], intro[1]),
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss("4.NBT.B.4"),
    knowledgePoints: [
      point(
        `${id}-computing`,
        ["Finding the difference", "求差"],
        [
          `Line up the digits by place. Subtract each column from the right. If the top digit is too small, borrow 1 from the left. $${fmt(ea)} - ${fmt(eb)}$: ${exWork.en}\n\nCheck: add back. $${fmt(ea - eb)} + ${fmt(eb)} = ${fmt(ea)}$.\n\n> **Watch out.** ${watch[0]}`,
          `把相同数位对齐，从右往左逐列相减。上面的数字不够减，就向左边一位借 1。$${fmt(ea)} - ${fmt(eb)}$：${exWork.zh}\n\n检验：加回去。$${fmt(ea - eb)} + ${fmt(eb)} = ${fmt(ea)}$。\n\n> **注意。** ${watch[1]}`,
        ],
        (rng) => {
          const [a, b] = pair(rng);
          const work = subColumns(a, b);
          return answered(
            [`Find $${fmt(a)} - ${fmt(b)}$.`, `计算 $${fmt(a)} - ${fmt(b)}$。`],
            a - b,
            [
              [
                ["Line up the places", "数位对齐"],
                ["Write the smaller number under the larger one, ones under ones.", "把小的数写在大的数下面，个位对齐。"],
              ],
              [
                ["Subtract column by column", "逐列相减"],
                [work.en, work.zh],
              ],
            ],
            [`Add back: $${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}$.`, `加回去：$${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}$。`],
            [...misses(a, b), [a - b - 10, "That borrows from the tens when it does not need to.", "这在不需要时从十位借了 1。"]],
            { figure: subtractionChart(a, b) },
          );
        },
        subtractionChart(ea, eb),
      ),
      point(
        `${id}-word-problems`,
        ["Word problems", "应用题"],
        [
          `"How many are left" and "how many more" ask for a difference. Subtract the smaller amount from the larger one. A library has ${plain(ea)} books and lends out ${plain(eb)}. Left: $${fmt(ea)} - ${fmt(eb)} = ${fmt(ea - eb)}$.\n\nCheck: $${fmt(ea - eb)} + ${fmt(eb)} = ${fmt(ea)}$.\n\n> **Watch out.** "How many more" is a subtraction, even though it says "more".`,
          `“还剩多少”“多多少”求的都是差：用大的量减去小的量。图书馆有 ${plain(ea)} 本书，借出了 ${plain(eb)} 本。还剩 $${fmt(ea)} - ${fmt(eb)} = ${fmt(ea - eb)}$ 本。\n\n检验：$${fmt(ea - eb)} + ${fmt(eb)} = ${fmt(ea)}$。\n\n> **注意。** “多多少”虽然有个“多”字，却要用减法。`,
        ],
        (rng) => {
          const [a, b] = pair(rng);
          const kind = rng.int(0, 2);
          const prompts: Pair[] = [
            [
              `A library has ${plain(a)} books and lends out ${plain(b)} of them. How many books are still in the library?`,
              `图书馆有 ${plain(a)} 本书，借出了 ${plain(b)} 本。馆里还有多少本书？`,
            ],
            [
              `A warehouse has room for ${plain(a)} boxes. ${plain(b)} boxes are already inside. How many more boxes fit?`,
              `仓库能放 ${plain(a)} 个箱子，里面已经有 ${plain(b)} 个。还能再放多少个箱子？`,
            ],
            [
              `Video A has ${plain(a)} views and video B has ${plain(b)} views. How many more views does video A have?`,
              `视频 A 的播放次数是 ${plain(a)}，视频 B 的播放次数是 ${plain(b)}。视频 A 比视频 B 多播放多少次？`,
            ],
          ];
          const reasons: Pair[] = [
            ["The books lent out leave the library, so subtract them.", "借出的书离开了图书馆，所以要减去。"],
            ["The room left is the room not yet taken, so subtract the boxes inside.", "剩下的位置是还没占用的，所以要减去已有的箱子。"],
            ['"How many more" asks for the difference of the views.', "“多多少次”求的是两个播放次数的差。"],
          ];
          const work = subColumns(a, b);
          const figure =
            kind === 2
              ? tapeFigure(
                  [
                    {
                      pieces: [
                        { size: b, text: grouped(b) },
                        { size: a - b, text: "?", dashed: true },
                      ],
                    },
                    { pieces: [{ size: b, text: grouped(b), lit: true }] },
                  ],
                  [
                    `Two bars: ${grouped(a)} and ${grouped(b)}, with the extra part of the longer bar marked ?.`,
                    `两个长条：${grouped(a)} 和 ${grouped(b)}，长条多出的部分标着 ?。`,
                  ],
                )
              : partsTape([grouped(b), "?"], [b, a - b], grouped(a), 0);
          return answered(
            prompts[kind]!,
            a - b,
            [
              [["Choose the operation", "选运算"], reasons[kind]!, [`${fmt(a)} - ${fmt(b)}`]],
              [
                ["Subtract column by column", "逐列相减"],
                [work.en, work.zh],
              ],
            ],
            [`Add back: $${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}$.`, `加回去：$${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}$。`],
            misses(a, b),
            { figure },
          );
        },
        partsTape([grouped(eb), "?"], [eb, ea - eb], grouped(ea), 0),
      ),
    ],
  };
}

/** borrowWatch warns that a place that lent 1 is now 1 less. */
const borrowWatch: Pair = [
  "A place that lends 1 is now 1 less. Use the new digit in that column.",
  "借出 1 的那一位就少了 1，算这一列时要用新的数字。",
];

/** subtractingTwoDigitNumbers subtracts two-digit numbers with borrowing. */
export const subtractingTwoDigitNumbers = subtractionTopic(
  "subtracting-two-digit-numbers",
  t("Subtracting Two-Digit Numbers", "两位数减法"),
  t(
    "When the ones digit on top is smaller, borrow a ten: 72 − 38: 12 − 8 = 4 and 6 − 3 = 3, so 34.",
    "被减数个位不够减时，从十位借一：72 − 38：12 − 8 = 4，6 − 3 = 3，所以是 34。",
  ),
  [
    "Leo has 72 marbles and gives away 38. How many are left? In the ones, 2 is less than 8. Break 1 ten into 10 ones: now 12 ones and 6 tens. $12 - 8 = 4$ and $6 - 3 = 3$. He has 34 left.\n\nCheck: 34 + 38 = 72.\n\nIn this lesson we subtract two-digit numbers and borrow a ten.",
    "利奥有 72 颗弹珠，送出去 38 颗，还剩多少？个位 2 不够减 8，把 1 个十拆成 10 个一：个位变成 12，十位变成 6。$12 - 8 = 4$，$6 - 3 = 3$。还剩 34 颗。\n\n检验：34 + 38 = 72。\n\n本课我们学习两位数减法和退位。",
  ],
  ["adding-two-digit-whole-numbers"],
  () => [2, 2],
  [72, 38],
  ["Do not take 2 from 8 because 8 is bigger. The top digit is 2, so borrow.", "不能因为 8 大就用 8 减 2。上面是 2，要借位。"],
);

/** subtractingTwoDigitNumbersFromThreeDigitNumbers subtracts a two-digit number from a three-digit one. */
export const subtractingTwoDigitNumbersFromThreeDigitNumbers = subtractionTopic(
  "subtracting-two-digit-numbers-from-three-digit-numbers",
  t("Subtracting Two-Digit Numbers From Three-Digit Numbers", "三位数减两位数"),
  t(
    "Line up the ones under the ones. Borrowing may reach the hundreds: 405 − 68 = 337.",
    "个位对齐个位。借位可能要从百位借：405 − 68 = 337。",
  ),
  [
    "A baker has 405 rolls and sells 68. In the ones, 5 is less than 8, but the tens are 0. So borrow from the hundreds first: 4 hundreds become 3, and the tens become 10. Then lend 1 ten to the ones. Now 15 − 8 = 7, 9 − 6 = 3, and 3 hundreds. 337 rolls are left.\n\nCheck: 337 + 68 = 405.\n\nIn this lesson we subtract a two-digit number from a three-digit number.",
    "面包师有 405 个面包，卖出 68 个。个位 5 不够减 8，可是十位是 0，就先从百位借：4 个百变成 3 个百，十位变成 10。再借 1 个十给个位。现在 15 − 8 = 7，9 − 6 = 3，百位是 3。还剩 337 个。\n\n检验：337 + 68 = 405。\n\n本课我们学习三位数减两位数。",
  ],
  ["subtracting-two-digit-numbers", "equivalent-place-value-representations-and-borrowing"],
  () => [3, 2],
  [405, 68],
  [
    "Write the 2-digit number under the tens and ones. The hundreds have nothing to take away.",
    "两位数写在十位和个位下面。百位上没有要减的数。",
  ],
);

/** subtractingThreeDigitNumbers subtracts three-digit numbers. */
export const subtractingThreeDigitNumbers = subtractionTopic(
  "subtracting-three-digit-numbers",
  t("Subtracting Three-Digit Numbers", "三位数减法"),
  t(
    "Subtract three-digit numbers column by column, borrowing where needed: 724 − 386 = 338.",
    "三位数相减，逐列计算，需要时借位：724 − 386 = 338。",
  ),
  [
    "A school has 724 students. 386 go on a trip. How many stay? Ones: 4 is less than 6, so borrow: 14 − 6 = 8. Tens: 2 lent 1 and is 1, less than 8, so borrow: 11 − 8 = 3. Hundreds: 7 lent 1 and is 6: 6 − 3 = 3. 338 stay.\n\nCheck: 338 + 386 = 724.\n\nIn this lesson we subtract three-digit numbers, borrowing where we need to.",
    "学校有 724 名学生，386 名去春游，留下多少名？个位：4 不够减 6，借 1，14 − 6 = 8。十位：2 借出 1 剩 1，不够减 8，再借 1，11 − 8 = 3。百位：7 借出 1 剩 6，6 − 3 = 3。留下 338 名。\n\n检验：338 + 386 = 724。\n\n本课我们学习三位数减三位数，需要时借位。",
  ],
  ["subtracting-two-digit-numbers-from-three-digit-numbers"],
  () => [3, 3],
  [724, 386],
  borrowWatch,
);

/** subtractingNumbersUpToFiveDigits subtracts numbers of up to five digits. */
export const subtractingNumbersUpToFiveDigits = subtractionTopic(
  "subtracting-numbers-up-to-five-digits",
  t("Subtracting Numbers Up to Five Digits", "五位数以内的减法"),
  t(
    "Numbers of four and five digits are subtracted the same way: 50,312 − 7,648 = 42,664.",
    "四位数和五位数也同样相减：50,312 − 7,648 = 42,664。",
  ),
  [
    "A race has 50,312 runners at the start. 7,648 stop early. How many finish? Bigger numbers, same steps: line up the ones and borrow when the top digit is too small. 42,664 finish.\n\nCheck: 42,664 + 7,648 = 50,312.\n\nIn this lesson we subtract numbers with four and five digits.",
    "一场长跑有 50,312 人出发，7,648 人中途退出，多少人跑完？数大了，方法一样：个位对齐，上面不够减就借位。42,664 人跑完。\n\n检验：42,664 + 7,648 = 50,312。\n\n本课我们学习四位数和五位数的减法。",
  ],
  ["subtracting-three-digit-numbers"],
  (rng) => [rng.int(4, 5), rng.int(3, 5)],
  [50312, 7648],
  ["When the place to the left is 0, it must borrow first, and then it is 9.", "左边一位是 0 时，它要先借，借完变成 9。"],
);

/** subtractingNumbersUpToSevenDigits subtracts numbers in the millions. */
export const subtractingNumbersUpToSevenDigits = subtractionTopic(
  "subtracting-numbers-up-to-seven-digits",
  t("Subtracting Numbers Up to Seven Digits", "七位数以内的减法"),
  t(
    "Numbers in the millions are subtracted the same way: 3,005,120 − 1,467,385 = 1,537,735.",
    "百万级的数也同样相减：3,005,120 − 1,467,385 = 1,537,735。",
  ),
  [
    "A country has 3,005,120 trees and 1,467,385 are cut down. Line up the ones and subtract column by column. Several zeros in a row each borrow in turn and become 9. 1,537,735 trees are left.\n\nCheck: 1,537,735 + 1,467,385 = 3,005,120.\n\nIn this lesson we subtract numbers in the millions.",
    "一个国家有 3,005,120 棵树，砍掉了 1,467,385 棵。个位对齐，逐列相减。连着的几个 0 要一个接一个地借，都变成 9。还剩 1,537,735 棵。\n\n检验：1,537,735 + 1,467,385 = 3,005,120。\n\n本课我们学习百万级的数的减法。",
  ],
  ["subtracting-numbers-up-to-five-digits"],
  (rng) => [rng.int(6, 7), rng.int(5, 7)],
  [3005120, 1467385],
  borrowWatch,
);

/** estimatingMultiDigitSubtraction estimates differences by rounding first. */
export const estimatingMultiDigitSubtraction: TopicDef = {
  id: "estimating-multi-digit-subtraction",
  title: t("Estimating Multi-Digit Subtraction", "多位数减法的估算"),
  summary: t(
    "To estimate a difference, round each number first and subtract the rounded numbers: 7,812 − 2,456 ≈ 8,000 − 2,000 = 6,000.",
    "估算差时，先把每个数四舍五入，再把近似数相减：7,812 − 2,456 ≈ 8,000 − 2,000 = 6,000。",
  ),
  intro: t(
    "A town has \\$823 for a party and spends \\$368. About how much is left? Round: 823 is about 800 and 368 is about 400. $800 - 400 = 400$. About \\$400 is left.\n\nCheck: the exact amount is $823 - 368 = 455$, not far from 400.\n\nIn this lesson we estimate a difference by rounding each number first.",
    "小镇有 823 元办聚会，花了 368 元，大约还剩多少？取近似值：823 约是 800，368 约是 400，$800 - 400 = 400$。大约剩 400 元。\n\n检验：准确的是 $823 - 368 = 455$，和 400 相差不远。\n\n本课我们先把每个数取近似值，再估算差。",
  ),
  prerequisites: ["subtracting-numbers-up-to-five-digits", "estimating-multi-digit-addition"],
  encompasses: [],
  xp: 10,
  standards: ccss("4.NBT.A.3"),
  knowledgePoints: [
    estimatingKP("estimating-differences-to-hundreds", 2, true),
    estimatingKP("estimating-differences-to-thousands", 3, true),
  ],
};
/** grade4WholeNumberTopics are the 4th Grade Math topics on expressions, patterns, place value, rounding, addition and subtraction. */
export const grade4WholeNumberTopics: readonly TopicDef[] = [
  placeValueWithNumbersUpToFourDigits,
  placeValueWithNumbersUpToSevenDigits,
  writingWholeNumbersInWords,
  readingWholeNumbersWrittenInWords,
  convertingFromStandardFormToExpandedForm,
  convertingFromExpandedFormToStandardForm,
  equivalentPlaceValueRepresentations,
  moreOnEquivalentPlaceValueRepresentations,
  equivalentPlaceValueRepresentationsAndBorrowing,
  comparingPlaceValues,
  comparingWholeNumbers,
  comparingWholeNumbersUsingPlaceValue,
  roundingDownWholeNumbers,
  roundingUpWholeNumbers,
  roundingUpTheDigit9,
  addingTwoDigitWholeNumbers,
  addingThreeDigitAndTwoDigitNumbers,
  addingThreeDigitNumbers,
  addingNumbersUpToFiveDigits,
  addingNumbersUpToSevenDigits,
  addingThreeMultiDigitNumbers,
  estimatingMultiDigitAddition,
  subtractingTwoDigitNumbers,
  subtractingTwoDigitNumbersFromThreeDigitNumbers,
  subtractingThreeDigitNumbers,
  subtractingNumbersUpToFiveDigits,
  subtractingNumbersUpToSevenDigits,
  estimatingMultiDigitSubtraction,
  evaluatingExpressionsInvolvingAdditionAndMultiplication,
  evaluatingExpressionsContainingMultiplicationAndDivision,
  solvingMultistepWordProblemsUsingNumberOperations,
  furtherSolvingMultistepWordProblemsUsingTheFourOperations,
  interpretingMultiplicationEquationsAsAComparison,
  representingComparisonStatementsAsEquations,
  wordProblemsInvolvingAdditiveAndMultiplicativeComparison,
  generatingPatterns,
  identifyingPatterns,
];
