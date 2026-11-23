// 2nd Grade Math: skip counting, even and odd numbers, arrays, place value to
// 1,000, adding and subtracting within 100 and with models within 1,000, and word
// problems within 100.

import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  arrayFigure,
  baseTenFigure,
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  jumpsFigure,
  numberLineFigure,
  tenFramesFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  blockRowsFigure,
  captioned,
  compareBarsFigure,
  compared,
  factTriangleFigure,
  hopsFigure,
  type MathWrong,
  type Pair,
  partWholeBarFigure,
  picked,
  pickedMath,
  type Slip,
  solved,
  type Wrong,
} from "./early-grades-more-kit.ts";

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tensWords = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const digitsZh = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** numberWordsEn writes a whole number from 1 to 1,000 in English words, such as three hundred forty-two. */
export function numberWordsEn(n: number): string {
  if (n === 1000) return "one thousand";
  if (n >= 100) {
    const rest = n % 100;
    return `${ones[Math.floor(n / 100)]} hundred${rest ? ` ${numberWordsEn(rest)}` : ""}`;
  }
  if (n >= 20) return `${tensWords[Math.floor(n / 10)]}${n % 10 ? `-${ones[n % 10]}` : ""}`;
  return n >= 10 ? (teens[n - 10] as string) : (ones[n] as string);
}

/** numberWordsZh writes a whole number from 1 to 1,000 in Chinese numerals, such as 三百四十二. */
export function numberWordsZh(n: number): string {
  if (n === 1000) return "一千";
  const h = Math.floor(n / 100);
  const ten = Math.floor((n % 100) / 10);
  const one = n % 10;
  if (h === 0) {
    const tens = ten === 0 ? "" : ten === 1 ? "十" : `${digitsZh[ten]}十`;
    return `${tens}${one ? digitsZh[one] : ""}`;
  }
  const tens = ten === 0 ? (one ? "零" : "") : `${digitsZh[ten]}十`;
  return `${digitsZh[h]}百${tens}${one ? digitsZh[one] : ""}`;
}

/** blocksFigure draws base-ten blocks with an alt text that names only the kinds of block present, in the right number. */
export function blocksFigure(hundreds: number, tens: number, single: number): Figure {
  const _en = (n: number, word: string, many: string) => (n === 0 ? [] : [`${n} ${n === 1 ? word : many}`]);
  const _zh = (n: number, word: string) => (n === 0 ? [] : [`${n} 个${word}`]);
  return {
    svg: baseTenFigure(hundreds, tens, single).svg,
    alt: t(
      `Base-ten blocks, where large squares are hundreds, rods are tens and small squares are ones: ${[..._en(hundreds, "large square", "large squares"), ..._en(tens, "rod", "rods"), ..._en(single, "small square", "small squares")].join(", ")}.`,
      `十进制积木，大方块是百，长条是十，小方块是一：${[..._zh(hundreds, "大方块"), ..._zh(tens, "长条"), ..._zh(single, "小方块")].join("、")}。`,
    ),
  };
}

/** fittingBlocks picks hundreds, tens and ones whose blocks fit across a figure. */
function fittingBlocks(rng: Rng): [number, number, number] {
  const h = rng.int(1, 4);
  return [h, rng.int(0, h === 4 ? 5 : 9), rng.int(0, 9)];
}

/** plural writes a count with its noun, adding s unless the count is 1. */
export const plural = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

/** placeWords names counts of hundreds, tens and ones, such as 3 hundreds, 1 ten and 4 ones. */
function placeWords(hundreds: number, tens: number, single: number): string {
  return `${plural(hundreds, "hundred")}, ${plural(tens, "ten")} and ${plural(single, "one")}`;
}

/** expanded writes a number's nonzero place parts joined by plus signs. */
function expanded(n: number): string {
  const parts = [Math.floor(n / 100) * 100, Math.floor((n % 100) / 10) * 10, n % 10].filter((p) => p > 0);
  return parts.join(" + ");
}

/** skipCheck says how a count by 2s, 5s or 10s can be checked by its last digit. */
function skipCheck(step: number, n: number): Pair {
  if (step === 10)
    return [
      `Counting by tens keeps the ones digit the same, and ${n} ends in ${n % 10} like the others.`,
      `按 10 数时个位不变，${n} 的个位和其他数一样，都是 ${n % 10}。`,
    ];
  if (step === 5)
    return [`Counting by fives always ends in 5 or 0, and ${n} ends in ${n % 10}.`, `按 5 数时个位总是 5 或 0，${n} 的个位是 ${n % 10}。`];
  return [
    `Counting by twos from an even number stays even, and ${n} ends in ${n % 10}, an even digit.`,
    `从偶数开始按 2 数，得到的都是偶数，${n} 的个位是 ${n % 10}，是偶数。`,
  ];
}

const skipCountingTwosFivesTens = earlyTopic(
  "skip-counting-by-2s-5s-and-10s",
  ["Skip Counting by 2s, 5s and 10s", "2 个 2 个、5 个 5 个、10 个 10 个地数"],
  ["Count forward by twos, fives and tens, and find a missing number in a count.", "按 2、按 5、按 10 往后数，并找出数列中缺少的数。"],
  ["counting-to-120"],
  ["2.NBT.A.2"],
  [
    earlyPoint(
      "the-next-number-in-a-skip-count",
      ["The next number in a skip count", "跳着数的下一个数"],
      [
        "Look at 15, 20, 25, 30. Each number is 5 more than the one before. One more jump of 5 gives 35.\n\nCheck: counting by fives always ends in 5 or 0, and 35 ends in 5.\n\n> **Watch out.** The next number is not 31. Jump by 5 each time, not by 1.",
        "看 15、20、25、30。每个数都比前一个多 5。再跳一次 5，就是 35。\n\n检验：按 5 数时，个位总是 5 或 0，35 的个位是 5。\n\n> **注意。** 下一个数不是 31。每次要跳 5，不是跳 1。",
      ],
      (rng) => {
        const step = rng.pick([2, 5, 10]);
        const start = step * rng.int(1, step === 2 ? 40 : step === 5 ? 16 : 8);
        const shown = [0, 1, 2, 3].map((i) => start + i * step);
        const last = start + 3 * step;
        const answer = last + step;
        const list = shown.join(", ");
        return solved(
          [`What number comes next? $${list}, \\square$`, `下一个数是多少？$${list}, \\square$`],
          answer,
          [
            [
              ["Find the jump", "找出每次跳多少"],
              ["Two numbers next to each other differ by", "相邻两个数相差"],
              [`${start + step} - ${start} = ${step}`],
            ],
            [
              ["Jump once more", "再跳一次"],
              ["Add the same jump to the last number:", "在最后一个数上再加同样多："],
              [`${last} + ${step} = ${answer}`],
            ],
          ],
          skipCheck(step, answer),
          [
            [last + 1, `That jumps by 1, not by ${step}.`, `这只跳了 1，应该跳 ${step}。`],
            [answer + step, "That jumps twice.", "这跳了两次。"],
            [last, "That repeats the last number.", "这是重复了最后一个数。"],
          ],
        );
      },
      captioned(
        jumpsFigure(10, 40, 5, [15, 20, 25, 30, 35]),
        "Jumps of 5 from 15: 20, 25, 30 and then 35.",
        "从 15 开始每次跳 5：20、25、30，然后是 35。",
      ),
    ),
    {
      ...earlyPoint(
        "a-missing-point-on-a-skip-count",
        ["A missing point on a skip count", "跳着数时缺少的点"],
        [
          "This number line counts by fives, so each space is worth 5. The marked point is 5 jumps from 0. Count them: 5, 10, 15, 20, 25. The point is at 25.\n\nCheck: $5 + 5 + 5 + 5 + 5 = 25$.\n\n> **Watch out.** Five spaces is not 5. Each space is worth 5, so count by fives.",
          "这条数轴按 5 数，每一格代表 5。标出的点离 0 有 5 跳。数一数：5、10、15、20、25。这个点是 25。\n\n检验：$5 + 5 + 5 + 5 + 5 = 25$。\n\n> **注意。** 5 格不是 5。每一格代表 5，要五个五个地数。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10]);
          const lo = step * rng.int(0, step === 2 ? 30 : step === 5 ? 12 : 6);
          const jumps = rng.int(4, 7);
          const at = rng.int(2, jumps - 1);
          const answer = lo + at * step;
          const counted = Array.from({ length: at }, (_, i) => lo + (i + 1) * step);
          return {
            ...solved(
              [`This number line counts by ${step}s. What number is at the marked point?`, `这条数轴按 ${step} 数。标出的点是多少？`],
              answer,
              [
                [
                  ["Count the jumps", "数跳了几次"],
                  [`The point is ${at} jumps from ${lo}, and each jump is ${step}.`, `这个点离 ${lo} 有 ${at} 跳，每跳 ${step}。`],
                ],
                [
                  [`Count on by ${step}s`, `按 ${step} 往后数`],
                  [`${counted.join(", ")}.`, `${counted.join("、")}。`],
                ],
              ],
              [
                `$${lo} + ${Array<number>(at).fill(step).join(" + ")} = ${answer}$.`,
                `$${lo} + ${Array<number>(at).fill(step).join(" + ")} = ${answer}$。`,
              ],
              [
                [lo + at, `That counts each jump as 1. Each jump is ${step}.`, `这把每跳当成了 1，其实每跳是 ${step}。`],
                [answer - step, "That is one jump short.", "这少跳了一次。"],
                [answer + step, "That is one jump too many.", "这多跳了一次。"],
              ],
              numberLineFigure(lo, lo + jumps * step, step, answer, false),
            ),
            solutionFigure: jumpsFigure(
              lo,
              lo + jumps * step,
              step,
              Array.from({ length: at + 1 }, (_, i) => lo + i * step),
              false,
            ),
          };
        },
      ),
      figure: gradeDrawings2["skip-counting-by-2s-5s-and-10s#a-missing-point-on-a-skip-count"],
    },
  ],
  [
    "Mo puts his socks in pairs and counts by twos: 2, 4, 6, 8, 10. He has 10 socks.\n\nCheck: there are 5 pairs, and $2 + 2 + 2 + 2 + 2 = 10$.\n\nIn this lesson we count by 2s, 5s and 10s and find a missing number in a count.",
    "小莫把袜子配成双，两只两只地数：2、4、6、8、10。他有 10 只袜子。\n\n检验：一共 5 双，$2 + 2 + 2 + 2 + 2 = 10$。\n\n本课我们按 2、按 5、按 10 往后数，并找出数列中缺少的数。",
  ],
);

const evenAndOdd = earlyTopic(
  "even-and-odd-numbers",
  ["Even and Odd Numbers", "偶数和奇数"],
  [
    "Tell even numbers from odd ones by pairing things up, and write an even number as two equal addends.",
    "通过两两配对分辨偶数和奇数，并把偶数写成两个相同的加数。",
  ],
  ["skip-counting-by-2s-5s-and-10s", "doubles-and-near-doubles"],
  ["2.OA.C.3"],
  [
    earlyPoint(
      "pairing-counters-to-see-even-or-odd",
      ["Pairing counters to see even or odd", "配对看偶数和奇数"],
      [
        "Here are 9 counters. Put them in pairs: 4 pairs, and 1 is left with no partner. So 9 is odd.\n\nCheck: 9 ends in 9, and a number ending in 1, 3, 5, 7 or 9 is odd.\n\n> **Watch out.** Look at the last digit only. 30 is even, even though 3 is odd.",
        "这里有 9 个圆片。两个两个地配对：配成 4 对，剩下 1 个没有伙伴。所以 9 是奇数。\n\n检验：9 的个位是 9，个位是 1、3、5、7、9 的数都是奇数。\n\n> **注意。** 只看个位。30 是偶数，虽然 3 是奇数。",
      ],
      (rng) => {
        if (rng.bool()) {
          const n = rng.int(7, 20);
          const say = (v: number, even: boolean): Pair => [
            `${v} counters, an ${even ? "even" : "odd"} number`,
            `${v} 个圆片，是${even ? "偶数" : "奇数"}`,
          ];
          const even = n % 2 === 0;
          const wrong: Wrong[] = [
            [
              say(n, !even),
              even ? "Every counter has a partner, so the number is even." : "One counter is left with no partner, so the number is odd.",
              even ? "每个圆片都有伙伴，所以是偶数。" : "剩下一个圆片没有伙伴，所以是奇数。",
            ],
            [say(n + 1, !even), `There are ${n} counters, not ${n + 1}.`, `一共有 ${n} 个圆片，不是 ${n + 1} 个。`],
            [say(n - 1, !even), `There are ${n} counters, not ${n - 1}.`, `一共有 ${n} 个圆片，不是 ${n - 1} 个。`],
          ];
          return picked(
            rng,
            ["Count these counters and pair them up. Which of these is right?", "数一数这些圆片，再两个两个地配对。下面哪一句是对的？"],
            say(n, even),
            wrong,
            [
              [
                ["Count the counters", "数圆片"],
                [`There are ${n} counters.`, `一共有 ${n} 个圆片。`],
              ],
              [
                ["Pair them up", "两个两个配对"],
                even
                  ? [`They make ${n / 2} pairs with none left over, so ${n} is even.`, `正好配成 ${n / 2} 对，没有剩下，所以 ${n} 是偶数。`]
                  : [
                      `They make ${(n - 1) / 2} pairs and 1 is left over, so ${n} is odd.`,
                      `配成 ${(n - 1) / 2} 对，还剩 1 个，所以 ${n} 是奇数。`,
                    ],
              ],
            ],
            [
              `${n} ends in ${n % 10}, which is ${even ? "an even" : "an odd"} digit.`,
              `${n} 的个位是 ${n % 10}，是${even ? "偶数" : "奇数"}。`,
            ],
            countersFigure(n, 2),
          );
        }
        const asksEven = rng.bool();
        const pick = (even: boolean) => 2 * rng.int(2, 49) + (even ? 0 : 1);
        const correct = pick(asksEven);
        const others = new Set<number>();
        while (others.size < 3) others.add(pick(!asksEven));
        const kind = asksEven ? ["even", "偶数"] : ["odd", "奇数"];
        const not = asksEven ? ["odd", "奇数"] : ["even", "偶数"];
        const wrong: MathWrong[] = [...others].map((v) => [
          `${v}`,
          `${v} ends in ${v % 10}, so it is ${not[0]}.`,
          `${v} 的个位是 ${v % 10}，所以是${not[1]}。`,
        ]);
        return pickedMath(
          rng,
          [`Which of these numbers is ${kind[0]}?`, `下面哪个数是${kind[1]}？`],
          `${correct}`,
          wrong,
          [
            [
              ["Look at the last digit", "看个位"],
              [
                "Even numbers end in 0, 2, 4, 6 or 8; odd numbers end in 1, 3, 5, 7 or 9.",
                "偶数的个位是 0、2、4、6、8；奇数的个位是 1、3、5、7、9。",
              ],
            ],
            [
              ["Find the one that fits", "找出符合的数"],
              [`${correct} ends in ${correct % 10}, so it is ${kind[0]}.`, `${correct} 的个位是 ${correct % 10}，所以是${kind[1]}。`],
            ],
          ],
          asksEven
            ? [
                `$${correct} = ${correct / 2} + ${correct / 2}$, two equal addends, so it is even.`,
                `$${correct} = ${correct / 2} + ${correct / 2}$，是两个相同的加数，所以是偶数。`,
              ]
            : [
                `$${correct} = ${(correct - 1) / 2} + ${(correct + 1) / 2}$: it cannot be split into two equal addends, so it is odd.`,
                `$${correct} = ${(correct - 1) / 2} + ${(correct + 1) / 2}$：分不成两个相同的加数，所以是奇数。`,
              ],
        );
      },
      captioned(countersFigure(9, 2), "9 counters in pairs: 4 pairs and 1 left over.", "9 个圆片配对：4 对，剩下 1 个。"),
    ),
    earlyPoint(
      "even-numbers-as-two-equal-addends",
      ["Even numbers as two equal addends", "偶数等于两个相同的加数"],
      [
        "Share 8 counters into two equal piles. Take each pair apart and put one in each pile. Each pile gets 4, so $8 = 4 + 4$.\n\nCheck: $4 + 4 = 8$.\n\n> **Watch out.** Each pile is half of 8, not 8. Do not write $8 + 8$.",
        "把 8 个圆片分成同样多的两堆。把每一对拆开，一边放一个。每堆 4 个，所以 $8 = 4 + 4$。\n\n检验：$4 + 4 = 8$。\n\n> **注意。** 每堆是 8 的一半，不是 8。不要写成 $8 + 8$。",
      ],
      (rng) => {
        const half = rng.int(2, 20);
        const n = 2 * half;
        const thing = rng.pick(earlyThings);
        const prompt: Pair = rng.bool()
          ? [
              `The same number goes in both boxes. What is it? $${n} = \\square + \\square$`,
              `两个方框里填同一个数。这个数是多少？$${n} = \\square + \\square$`,
            ]
          : [
              `${rng.pick(earlyNames)} shares ${n} ${thing.en} into two equal piles. How many ${thing.en} go in each pile?`,
              `把 ${n} ${thing.unit}${thing.zh}分成同样多的两堆。每堆有多少${thing.unit}？`,
            ];
        return solved(
          prompt,
          half,
          [
            [
              ["Split into pairs", "分成对"],
              [`${n} makes ${half} pairs.`, `${n} 可以配成 ${half} 对。`],
            ],
            [
              ["One from each pair", "每对拆开各放一个"],
              [`Each side gets one from every pair, so each side has ${half}.`, `每一对拆开后两边各放一个，所以每边有 ${half}。`],
            ],
          ],
          [`$${half} + ${half} = ${n}$.`, `$${half} + ${half} = ${n}$。`],
          [
            [n, `That is the whole ${n}, not one of the two equal parts.`, `这是整个 ${n}，不是两份中的一份。`],
            [n - 2, "That takes away 2 instead of sharing into two equal parts.", "这是减去 2，不是平均分成两份。"],
            [
              half + 1,
              `That makes the parts too big: $${half + 1} + ${half + 1} = ${n + 2}$.`,
              `这样每份太多了：$${half + 1} + ${half + 1} = ${n + 2}$。`,
            ],
          ],
        );
      },
      captioned(
        countersFigure(8, 2),
        "8 counters in 4 pairs, ready to share into two piles of 4.",
        "8 个圆片排成 4 对，可以分成两堆，每堆 4 个。",
      ),
    ),
  ],
  [
    "Lena has 7 apples and wants to share them with her brother. She gives one to each of them, again and again. At the end, 1 apple is left over.\n\nCheck: 6 apples share as $3 + 3$, and 7 is 1 more than that.\n\nIn this lesson we tell even numbers from odd numbers and write even numbers as two equal addends.",
    "莉娜有 7 个苹果，想和弟弟分。她一人一个地分，最后剩下 1 个。\n\n检验：6 个苹果可以分成 $3 + 3$，7 比 6 多 1。\n\n本课我们分辨偶数和奇数，并把偶数写成两个相同的加数。",
  ],
);

const arraysAndRepeatedAddition = earlyTopic(
  "arrays-and-repeated-addition",
  ["Arrays and Repeated Addition", "点阵和重复相加"],
  ["Find how many are in an array by adding its equal rows.", "把点阵中相同的行加起来，求出一共有多少个。"],
  ["skip-counting-by-2s-5s-and-10s"],
  ["2.OA.C.4"],
  [
    earlyPoint(
      "adding-the-rows-of-an-array",
      ["Adding the rows of an array", "把点阵的每行加起来"],
      [
        "This array has 3 rows with 4 dots in each. Add one 4 for each row: $4 + 4 + 4 = 12$.\n\nCheck: count by the columns instead: 4 columns of 3 make $3 + 3 + 3 + 3 = 12$.\n\n> **Watch out.** Do not add the rows and the dots in a row, $3 + 4$. Add 4 once for every row.",
        "这个点阵有 3 行，每行 4 个点。有几行就加几个 4：$4 + 4 + 4 = 12$。\n\n检验：换成按列加：4 列，每列 3 个，$3 + 3 + 3 + 3 = 12$。\n\n> **注意。** 不要把行数和每行的个数相加，算成 $3 + 4$。每一行都要加一个 4。",
      ],
      (rng) => {
        const rows = rng.int(2, 5);
        const columns = rng.int(2, 5);
        const answer = rows * columns;
        const sum = Array(rows).fill(`${columns}`).join(" + ");
        const byColumns = Array(columns).fill(`${rows}`).join(" + ");
        return solved(
          rng.pick([
            ["How many dots are in this array?", "这个点阵里有多少个点？"],
            ["Add the rows of this array. How many dots are there in all?", "把这个点阵的每行加起来。一共有多少个点？"],
            ["Each row of this array is one addend. What is the sum?", "这个点阵的每一行是一个加数。和是多少？"],
          ] as const),
          answer,
          [
            [
              ["Read the rows", "看行"],
              [`There are ${rows} rows with ${columns} dots in each.`, `有 ${rows} 行，每行 ${columns} 个点。`],
            ],
            [["Add one row at a time", "一行一行地加"], ["Add the rows:", "把各行加起来："], [`${sum} = ${answer}`]],
          ],
          [`Add the columns instead: $${byColumns} = ${answer}$.`, `换成按列加：$${byColumns} = ${answer}$。`],
          [
            [rows + columns, "That adds the number of rows and the number in a row.", "这是把行数和每行的个数相加了。"],
            [answer - columns, "That leaves out one row.", "这漏掉了一行。"],
            [answer + columns, "That adds one row too many.", "这多加了一行。"],
          ],
          arrayFigure(rows, columns),
        );
      },
      captioned(arrayFigure(3, 4), "An array of 3 rows with 4 dots in each.", "3 行、每行 4 个点的点阵。"),
    ),
    earlyPoint(
      "matching-an-array-to-a-sum",
      ["Matching an array to a sum", "找出点阵对应的加法"],
      [
        "This array has 3 rows of 4. Each row is one addend, so the sum is $4 + 4 + 4$: the 4 is written 3 times.\n\nCheck: $4 + 4 + 4 = 12$, and counting the dots also gives 12.\n\n> **Watch out.** Count the addends. $4 + 4$ has only 2 rows, but the array has 3.",
        "这个点阵有 3 行，每行 4 个。每一行是一个加数，所以加法是 $4 + 4 + 4$：4 写了 3 次。\n\n检验：$4 + 4 + 4 = 12$，数点也是 12 个。\n\n> **注意。** 要数加数的个数。$4 + 4$ 只有 2 行，可点阵有 3 行。",
      ],
      (rng) => {
        const rows = rng.int(3, 5);
        const columns = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        const sum = (count: number, each: number) => Array(count).fill(`${each}`).join(" + ");
        const wrong: MathWrong[] = [
          [
            `${rows} + ${columns}`,
            "This adds the number of rows and the number in a row, not the dots in every row.",
            "这是把行数和每行的个数相加，不是把每一行的点加起来。",
          ],
          [
            sum(rows - 1, columns),
            `This has only ${rows - 1} addends, but the array has ${rows} rows.`,
            `这里只有 ${rows - 1} 个加数，而点阵有 ${rows} 行。`,
          ],
          [
            sum(rows + 1, columns),
            `This has ${rows + 1} addends, but the array has ${rows} rows.`,
            `这里有 ${rows + 1} 个加数，而点阵只有 ${rows} 行。`,
          ],
        ];
        return pickedMath(
          rng,
          rng.pick([
            ["This array has one addend for each row. Which sum matches it?", "这个点阵每一行对应一个加数。哪个加法与它相符？"],
            ["Which sum adds the rows of this array?", "哪个加法是把这个点阵的每行加起来？"],
          ] as const),
          sum(rows, columns),
          wrong,
          [
            [
              ["Count the dots in a row", "数每行的点"],
              [`Each row has ${columns} dots, so each addend is ${columns}.`, `每行 ${columns} 个点，所以每个加数是 ${columns}。`],
            ],
            [
              ["Count the rows", "数行数"],
              [`There are ${rows} rows, so ${columns} is written ${rows} times.`, `有 ${rows} 行，所以 ${columns} 要写 ${rows} 次。`],
            ],
          ],
          [
            `The sum is ${rows * columns}, and there are ${rows * columns} dots in the array.`,
            `和是 ${rows * columns}，点阵里也正好有 ${rows * columns} 个点。`,
          ],
          arrayFigure(rows, columns),
        );
      },
      captioned(arrayFigure(3, 4), "3 rows of 4: one addend of 4 for each row.", "3 行，每行 4 个：每一行是一个加数 4。"),
    ),
  ],
  [
    "Eggs sit in a box in 2 rows of 6. Instead of counting one by one, Nora adds the rows: $6 + 6 = 12$.\n\nCheck: count by twos along the box: 2, 4, 6, 8, 10, 12.\n\nIn this lesson we find how many are in an array by adding its equal rows.",
    "鸡蛋在盒子里排成 2 行，每行 6 个。诺拉不一个一个数，而是把两行加起来：$6 + 6 = 12$。\n\n检验：沿着盒子两个两个地数：2、4、6、8、10、12。\n\n本课我们把点阵中相同的行加起来，求出一共有多少个。",
  ],
);

const understandingHundreds = earlyTopic(
  "hundreds-as-bundles-of-tens",
  ["Hundreds as Bundles of Tens", "百是十个十"],
  [
    "See that 10 tens make a hundred, and count how many tens are in a number of hundreds.",
    "明白 10 个十是一百，并数出若干个百里有多少个十。",
  ],
  ["tens-and-ones", "skip-counting-by-2s-5s-and-10s"],
  ["2.NBT.A.1"],
  [
    earlyPoint(
      "tens-in-whole-hundreds",
      ["Tens in whole hundreds", "整百里有几个十"],
      [
        "Ten tens make one hundred. So 3 hundreds are 10 tens, 10 tens and 10 tens: 30 tens.\n\nCheck: count by tens up to 300: 10, 20, …, 300 takes 30 counts.\n\n> **Watch out.** 3 hundreds is not 3 tens. Each hundred holds 10 tens.",
        "10 个十是一百。所以 3 个百是 10 个十、10 个十、再 10 个十：30 个十。\n\n检验：十个十个地数到 300：10、20、……、300，正好数 30 次。\n\n> **注意。** 3 个百不是 3 个十。每个百里有 10 个十。",
      ],
      (rng) => {
        const h = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        if (rng.bool())
          return solved(
            [
              `${name} needs ${h * 100} ${thing.en}, and they come in packs of 10. How many packs does ${name} need?`,
              `${name} 需要 ${h * 100} ${thing.unit}${thing.zh}，每包 10 ${thing.unit}。${name} 需要多少包？`,
            ],
            h * 10,
            [
              [
                ["Count the hundreds", "数有几个百"],
                [`${h * 100} is ${h} hundreds.`, `${h * 100} 是 ${h} 个百。`],
              ],
              [
                ["Turn hundreds into tens", "把百换成十"],
                ["Each hundred is 10 tens:", "每个百是 10 个十："],
                [`${h} \\times 10 = ${h * 10}`],
              ],
            ],
            [`Count by tens: ${h * 10} packs of 10 make ${h * 100}.`, `十个十个地数：${h * 10} 包，每包 10，正好是 ${h * 100}。`],
            [
              [h, "That counts hundreds, not packs of 10.", "这数的是百，不是 10 个一包的包数。"],
              [h * 100, "That is the number of things, not packs.", "这是东西的个数，不是包数。"],
              [h * 10 + 10, "That is one pack of 10 too many.", "这多算了一包。"],
            ],
          );
        return solved(
          [
            `${name} has ${h * 10} packs of ${thing.en}, with 10 in each pack. How many hundreds of ${thing.en} is that?`,
            `${name} 有 ${h * 10} 包${thing.zh}，每包 10 ${thing.unit}。这是多少个百？`,
          ],
          h,
          [
            [
              ["Group the packs", "把包分组"],
              ["Every 10 packs of 10 make one hundred.", "每 10 包就是一个百。"],
            ],
            [
              ["Count the groups", "数有几组"],
              [`${h * 10} packs make ${h} groups of 10 packs.`, `${h * 10} 包可以分成 ${h} 组，每组 10 包。`],
            ],
          ],
          [
            `${h * 10} packs hold ${h * 100} things, and ${h * 100} is ${h} hundreds.`,
            `${h * 10} 包一共是 ${h * 100} ${thing.unit}，${h * 100} 就是 ${h} 个百。`,
          ],
          [
            [h * 10, "That is the number of packs, not hundreds.", "这是包数，不是百的个数。"],
            [h * 100, "That is the number of things, not hundreds.", "这是东西的个数，不是百的个数。"],
            [h + 1, "That is one hundred too many.", "这多算了一个百。"],
          ],
        );
      },
      captioned(blocksFigure(3, 0, 0), "3 hundreds; each large square is 10 tens.", "3 个百；每个大方块是 10 个十。"),
    ),
    earlyPoint(
      "tens-in-hundreds-and-tens",
      ["Counting all the tens", "数出所有的十"],
      [
        "These blocks are 2 hundreds and 4 tens. Each hundred is 10 tens, so the hundreds make 20 tens. With the 4 rods, that is 24 tens.\n\nCheck: the blocks show 240, and 24 tens is 240.\n\n> **Watch out.** Do not count a large square as one ten. Each one is 10 tens.",
        "这些积木是 2 个百和 4 个十。每个百是 10 个十，所以两个百是 20 个十，再加 4 根长条，一共 24 个十。\n\n检验：积木表示 240，24 个十也是 240。\n\n> **注意。** 不要把一个大方块当成一个十，它是 10 个十。",
      ],
      (rng) => {
        const h = rng.int(1, 4);
        const tens = rng.int(1, h === 4 ? 5 : 9);
        const answer = 10 * h + tens;
        return solved(
          ["How many tens do these blocks make in all?", "这些积木一共是多少个十？"],
          answer,
          [
            [
              ["Turn hundreds into tens", "把百换成十"],
              [`${h === 1 ? "1 hundred is" : `${h} hundreds are`} ${10 * h} tens.`, `${h} 个百是 ${10 * h} 个十。`],
            ],
            [["Add the rods", "加上长条"], [`There are ${tens} more rods:`, `还有 ${tens} 根长条：`], [`${10 * h} + ${tens} = ${answer}`]],
          ],
          [
            `The blocks show ${100 * h + 10 * tens}, and ${answer} tens is ${10 * answer}.`,
            `积木表示 ${100 * h + 10 * tens}，${answer} 个十也是 ${10 * answer}。`,
          ],
          [
            [h + tens, "That counts each large square as one ten.", "这把每个大方块当成了一个十。"],
            [100 * h + 10 * tens, "That is the number the blocks show, not the count of tens.", "这是积木表示的数，不是十的个数。"],
            [10 * h, "That leaves out the rods.", "这漏掉了长条。"],
          ],
          blocksFigure(h, tens, 0),
        );
      },
      captioned(blocksFigure(2, 4, 0), "2 hundreds and 4 tens: 24 tens in all.", "2 个百和 4 个十：一共 24 个十。"),
    ),
  ],
  [
    "A shop packs pencils in boxes of 10. Ten boxes go into one big carton, so a carton holds 100 pencils.\n\nCheck: count the boxes by tens: 10, 20, …, 100.\n\nIn this lesson we see that 10 tens make a hundred, and count the tens in hundreds.",
    "商店把铅笔 10 支装一盒，10 盒装一大箱，所以一大箱是 100 支。\n\n检验：一盒一盒十个十个地数：10、20、……、100。\n\n本课我们知道 10 个十是一百，并数出几个百里有几个十。",
  ],
);

const skipCountingByHundreds = earlyTopic(
  "skip-counting-by-100s",
  ["Counting by 10s and 100s Up to 1,000", "在 1000 以内按 10 和按 100 数"],
  [
    "Count on by tens and hundreds from any number, and count how many jumps there are.",
    "从任意一个数开始按 10 和按 100 往后数，并数出跳了几次。",
  ],
  ["hundreds-as-bundles-of-tens"],
  ["2.NBT.A.2"],
  [
    earlyPoint(
      "counting-on-by-hundreds",
      ["Counting on by hundreds", "按 100 往后数"],
      [
        "Count by 100s from 135: 235, 335, 435. Only the hundreds digit goes up by one. The 3 tens and 5 ones stay.\n\nCheck: $435 - 335 = 100$.\n\n> **Watch out.** Do not change the tens. Counting by 100s adds whole hundreds only.",
        "从 135 开始按 100 数：235、335、435。只有百位每次加 1，十位的 3 和个位的 5 都不变。\n\n检验：$435 - 335 = 100$。\n\n> **注意。** 不要改十位。按 100 数只加整百。",
      ],
      (rng) => {
        const start = 100 * rng.int(1, 5) + 10 * rng.int(0, 9) + rng.int(0, 9);
        const jumps = rng.int(2, 3);
        const list = Array.from({ length: jumps + 1 }, (_, i) => start + i * 100);
        const last = list[list.length - 1] as number;
        const answer = last + 100;
        return solved(
          [
            `Count by 100s. What number comes next? $${list.join(", ")}, \\square$`,
            `按 100 数。下一个数是多少？$${list.join(", ")}, \\square$`,
          ],
          answer,
          [
            [
              ["See what changes", "看哪一位在变"],
              ["Only the hundreds digit goes up by one each time.", "每次只有百位加 1。"],
            ],
            [["Make one more jump", "再跳一次"], ["Add 100 to the last number:", "在最后一个数上加 100："], [`${last} + 100 = ${answer}`]],
          ],
          [
            `The tens and ones of ${answer} match those of ${start}, as they should.`,
            `${answer} 的十位和个位与 ${start} 一样，正应该这样。`,
          ],
          [
            [last + 10, "That adds 10, not 100.", "这是加了 10，不是加 100。"],
            [last + 1, "That adds 1, not 100.", "这是加了 1，不是加 100。"],
            [answer + 100, "That jumps twice.", "这跳了两次。"],
          ],
        );
      },
      captioned(hopsFigure([135, 235, 335, 435]), "Jumps of 100 from 135: 235, 335, 435.", "从 135 开始每次跳 100：235、335、435。"),
    ),
    earlyPoint(
      "how-many-jumps-of-ten-or-a-hundred",
      ["How many jumps of 10 or 100", "跳了几次 10 或 100"],
      [
        "From 240 to 290 by tens: 250, 260, 270, 280, 290. That is 5 jumps.\n\nCheck: $290 - 240 = 50$, and 50 is 5 tens.\n\n> **Watch out.** The answer is the number of jumps, 5, not the distance, 50.",
        "从 240 按 10 数到 290：250、260、270、280、290，一共跳了 5 次。\n\n检验：$290 - 240 = 50$，50 是 5 个十。\n\n> **注意。** 问的是跳的次数 5，不是相差的 50。",
      ],
      (rng) => {
        const step = rng.pick([10, 100]);
        const jumps = rng.int(3, 7);
        const lo = step === 100 ? 100 * rng.int(0, 2) + 10 * rng.int(0, 9) : 10 * rng.int(10, 80);
        const hi = lo + jumps * step;
        const stops = Array.from({ length: jumps }, (_, i) => lo + (i + 1) * step);
        return solved(
          [`How many jumps of ${step} go from ${lo} to ${hi}?`, `从 ${lo} 到 ${hi}，每次跳 ${step}，要跳几次？`],
          jumps,
          [
            [
              [`Count on by ${step}s`, `按 ${step} 往后数`],
              [`${stops.join(", ")}.`, `${stops.join("、")}。`],
            ],
            [
              ["Count the jumps", "数跳的次数"],
              [`That is ${jumps} jumps.`, `一共跳了 ${jumps} 次。`],
            ],
          ],
          [
            `$${hi} - ${lo} = ${hi - lo}$, and ${hi - lo} is ${jumps} ${step === 10 ? "tens" : "hundreds"}.`,
            `$${hi} - ${lo} = ${hi - lo}$，${hi - lo} 是 ${jumps} 个${step === 10 ? "十" : "百"}。`,
          ],
          [
            [hi - lo, "That is the distance, not the number of jumps.", "这是相差的数，不是跳的次数。"],
            [jumps + 1, `That counts the start, ${lo}, as a jump.`, `这把起点 ${lo} 也算成了一次。`],
            [jumps - 1, "That misses the last jump.", "这漏了最后一次。"],
          ],
          numberLineFigure(lo, hi, step, undefined, false),
        );
      },
      captioned(
        jumpsFigure(240, 290, 10, [240, 250, 260, 270, 280, 290]),
        "Five jumps of 10 from 240 to 290.",
        "从 240 到 290 跳了五次，每次 10。",
      ),
    ),
  ],
  [
    "Ali has 350 points in a game. Each level gives 100 more: 450, 550, 650.\n\nCheck: the 50 stays the same each time; only the hundreds grow.\n\nIn this lesson we count on by 10s and 100s and count how many jumps there are.",
    "阿里在游戏里有 350 分。每过一关多 100 分：450、550、650。\n\n检验：每次后面的 50 都不变，只有百位在变。\n\n本课我们按 10 和按 100 往后数，并数出跳了几次。",
  ],
);

const placeValueToThousand = earlyTopic(
  "place-value-up-to-1000",
  ["Place Value Up to 1,000", "1000 以内的数位"],
  ["Read a number from hundreds, tens and ones, and say what each digit is worth.", "根据百、十、一读出一个数，并说出每个数字代表多少。"],
  ["hundreds-as-bundles-of-tens"],
  ["2.NBT.A.1"],
  [
    earlyPoint(
      "reading-blocks-as-a-number",
      ["Reading blocks as a number", "把积木读成一个数"],
      [
        "These blocks are 2 large squares, 0 rods and 6 small squares: 2 hundreds, 0 tens and 6 ones. That is 206.\n\nCheck: $200 + 6 = 206$.\n\n> **Watch out.** Do not write 26. With no tens, a 0 must hold the tens place.",
        "这些积木是 2 个大方块、0 根长条和 6 个小方块：2 个百、0 个十、6 个一，这个数是 206。\n\n检验：$200 + 6 = 206$。\n\n> **注意。** 不要写成 26。没有十，十位要写 0 占位。",
      ],
      (rng) => {
        const [h, tens, single] = fittingBlocks(rng);
        const answer = 100 * h + 10 * tens + single;
        return solved(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          answer,
          [
            [
              ["Count each kind", "每种分开数"],
              [`The blocks are ${placeWords(h, tens, single)}.`, `有 ${h} 个百、${tens} 个十和 ${single} 个一。`],
            ],
            [
              ["Write the digits in order", "按顺序写数字"],
              [`Hundreds, then tens, then ones: ${answer}.`, `百位、十位、个位依次写：${answer}。`],
            ],
          ],
          [`$${100 * h} + ${10 * tens} + ${single} = ${answer}$.`, `$${100 * h} + ${10 * tens} + ${single} = ${answer}$。`],
          [
            [h + tens + single, "That counts every block as one.", "这把每块积木都当成了一。"],
            [100 * single + 10 * tens + h, "That writes the digits in the wrong order.", "这把数字的顺序写反了。"],
            [100 * h + 10 * single + tens, "That swaps the tens and the ones.", "这把十位和个位换了。"],
          ],
          blocksFigure(h, tens, single),
        );
      },
      captioned(blocksFigure(2, 0, 6), "2 hundreds, no tens and 6 ones: 206.", "2 个百、没有十、6 个一：206。"),
    ),
    earlyPoint(
      "the-value-of-a-digit",
      ["The value of a digit", "数字代表多少"],
      [
        "In 547, the 4 sits in the tens place. It means 4 tens, so it is worth 40.\n\nCheck: $547 = 500 + 40 + 7$, and the 4 shows up as 40.\n\n> **Watch out.** The 4 is not worth just 4. Find its place first.",
        "在 547 中，4 在十位上，表示 4 个十，所以它代表 40。\n\n检验：$547 = 500 + 40 + 7$，4 在这里是 40。\n\n> **注意。** 这个 4 不只是 4。先找出它在哪一位。",
      ],
      (rng) => {
        const [h, tens, single] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
        const n = 100 * h + 10 * tens + single;
        const place = rng.int(0, 2);
        const digit = [h, tens, single][place] as number;
        const size = [100, 10, 1][place] as number;
        const answer = digit * size;
        const names: Pair = [["hundreds", "tens", "ones"][place] as string, ["百", "十", "个"][place] as string];
        return solved(
          [`In the number ${n}, what is the digit ${digit} worth?`, `在 ${n} 这个数中，数字 ${digit} 代表多少？`],
          answer,
          [
            [
              ["Find its place", "找出它在哪一位"],
              [`Counting from the right, the ${digit} is in the ${names[0]} place.`, `从右往左数，${digit} 在${names[1]}位上。`],
            ],
            [
              ["Find its value", "求它代表多少"],
              [
                `It means ${digit} ${names[0] === "ones" ? "ones" : names[0]}:`,
                `它表示 ${digit} 个${names[1] === "个" ? "一" : names[1]}：`,
              ],
              [`${digit} \\times ${size} = ${answer}`],
            ],
          ],
          [
            `$${n} = ${100 * h} + ${10 * tens} + ${single}$, and the ${digit} shows up as ${answer}.`,
            `$${n} = ${100 * h} + ${10 * tens} + ${single}$，${digit} 在这里是 ${answer}。`,
          ],
          [
            [digit, "That is the digit, not what it is worth in its place.", "这只是数字本身，不是它在这一位上代表的数。"],
            [digit * 10, "That treats it as if it were in the tens place.", "这把它当成在十位上了。"],
            [digit * 100, "That treats it as if it were in the hundreds place.", "这把它当成在百位上了。"],
          ],
        );
      },
      captioned(blocksFigure(5, 4, 7), "547 in blocks: 5 hundreds, 4 tens and 7 ones.", "用积木表示 547：5 个百、4 个十、7 个一。"),
    ),
  ],
  [
    "A teacher counts the class's stickers: 3 full sheets of 100, 4 strips of 10 and 2 loose ones. That is 342 stickers.\n\nCheck: $300 + 40 + 2 = 342$.\n\nIn this lesson we read numbers from hundreds, tens and ones and say what each digit is worth.",
    "老师数全班的贴纸：3 整张，每张 100；4 条，每条 10；还有 2 张散的。一共 342 张。\n\n检验：$300 + 40 + 2 = 342$。\n\n本课我们根据百、十、一读出数，并说出每个数字代表多少。",
  ],
);

const expandedForm = earlyTopic(
  "expanded-form-up-to-1000",
  ["Expanded Form Up to 1,000", "1000 以内数的展开式"],
  ["Write a three-digit number as hundreds plus tens plus ones, and back again.", "把三位数写成几百加几十加几，也能倒过来写。"],
  ["place-value-up-to-1000"],
  ["2.NBT.A.3"],
  [
    earlyPoint(
      "from-expanded-form-to-a-number",
      ["From expanded form to a number", "由展开式写出数"],
      [
        "$300 + 6$ has 3 hundreds, no tens and 6 ones. Put each part in its place: 306.\n\nCheck: 306 pulled apart is $300 + 0 + 6$.\n\n> **Watch out.** Do not write 36. With no tens, a 0 holds the tens place.",
        "$300 + 6$ 有 3 个百、没有十、6 个一。把每部分放回自己的数位：306。\n\n检验：306 拆开是 $300 + 0 + 6$。\n\n> **注意。** 不要写成 36。没有十，十位要写 0 占位。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const tens = rng.int(0, 9);
        const single = tens === 0 ? rng.int(1, 9) : rng.int(0, 9);
        const n = 100 * h + 10 * tens + single;
        return solved(
          [`What number is $${expanded(n)}$?`, `$${expanded(n)}$ 是多少？`],
          n,
          [
            [
              ["Read each part", "看每一部分"],
              [`There are ${h} hundreds, ${tens} tens and ${single} ones.`, `有 ${h} 个百、${tens} 个十、${single} 个一。`],
            ],
            [
              ["Put each in its place", "放回各自的数位"],
              [`Hundreds ${h}, tens ${tens}, ones ${single}: ${n}.`, `百位 ${h}，十位 ${tens}，个位 ${single}：${n}。`],
            ],
          ],
          [`Pull ${n} apart again: $${expanded(n)}$.`, `再把 ${n} 拆开：$${expanded(n)}$。`],
          [
            [h + tens + single, "That adds the digits instead of placing them.", "这是把数字加起来了，没有按数位写。"],
            [10 * h + tens + single, "That leaves out a place, so the number is too small.", "这少了一个数位，数变小了。"],
            [100 * h + 10 * single + tens, "That swaps the tens and the ones.", "这把十位和个位换了。"],
            [10 * h + single, "That drops the 0 that holds the tens place.", "这漏掉了十位上占位的 0。"],
          ],
        );
      },
      captioned(blocksFigure(3, 0, 6), "3 hundreds and 6 ones, with no tens: 306.", "3 个百和 6 个一，没有十：306。"),
    ),
    earlyPoint(
      "the-missing-part-of-expanded-form",
      ["The missing part of expanded form", "展开式中缺少的部分"],
      [
        "Look at $472 = 400 + \\square + 2$. The missing part is the 7 in the tens place. It is worth 70.\n\nCheck: $400 + 70 + 2 = 472$.\n\n> **Watch out.** The box is 70, not 7. A digit in the tens place needs a 0 after it.",
        "看 $472 = 400 + \\square + 2$。缺的是十位上的 7，它代表 70。\n\n检验：$400 + 70 + 2 = 472$。\n\n> **注意。** 方框里是 70，不是 7。十位上的数字后面要加一个 0。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const tens = rng.int(1, 9);
        const single = rng.int(1, 9);
        const n = 100 * h + 10 * tens + single;
        const blank = rng.int(0, 2);
        const parts = [100 * h, 10 * tens, single];
        const answer = parts[blank] as number;
        const shown = parts.map((p, i) => (i === blank ? "\\square" : `${p}`)).join(" + ");
        const digit = [h, tens, single][blank] as number;
        const names: Pair = [["hundreds", "tens", "ones"][blank] as string, ["百", "十", "个"][blank] as string];
        const rest = parts.filter((_, i) => i !== blank);
        return solved(
          [`What number goes in the box? $${n} = ${shown}$`, `方框里填几？$${n} = ${shown}$`],
          answer,
          [
            [
              ["Find the missing place", "找出缺的数位"],
              [
                `The ${names[0]} part is missing, and ${n} has ${digit} there.`,
                `缺的是${names[1]}位的部分，${n} 的${names[1]}位是 ${digit}。`,
              ],
            ],
            [
              ["Find what it is worth", "求它代表多少"],
              [`In the ${names[0]} place, ${digit} is worth ${answer}.`, `在${names[1]}位上，${digit} 代表 ${answer}。`],
            ],
          ],
          [`$${n} - ${rest[0]} - ${rest[1]} = ${answer}$.`, `$${n} - ${rest[0]} - ${rest[1]} = ${answer}$。`],
          [
            [digit, "That is the digit, not what it is worth in its place.", "这只是数字本身，不是它在这一位上代表的数。"],
            [digit * 10, "That gives the digit the value of the tens place.", "这把它当成十位上的数了。"],
            [digit * 100, "That gives the digit the value of the hundreds place.", "这把它当成百位上的数了。"],
          ],
        );
      },
      captioned(blocksFigure(4, 7, 2), "472 in blocks: 400, 70 and 2.", "用积木表示 472：400、70 和 2。"),
    ),
  ],
  [
    "Kai's book has 253 pages. He thinks of it as 200 pages, then 50, then 3 more: $200 + 50 + 3$.\n\nCheck: putting the parts back in their places gives 253.\n\nIn this lesson we write three-digit numbers as hundreds plus tens plus ones, and back again.",
    "凯的书有 253 页。他把它看成 200 页，再 50 页，再 3 页：$200 + 50 + 3$。\n\n检验：把各部分放回自己的数位，又是 253。\n\n本课我们把三位数写成几百加几十加几，也能倒过来写。",
  ],
);

const numberNames = earlyTopic(
  "number-names-up-to-1000",
  ["Number Names Up to 1,000", "1000 以内数的读法"],
  ["Read and write three-digit numbers in words.", "读出并写出三位数的文字形式。"],
  ["place-value-up-to-1000"],
  ["2.NBT.A.3"],
  [
    earlyPoint(
      "from-words-to-a-number",
      ["From words to a number", "由文字写出数"],
      [
        "Three hundred five: 3 hundreds, no tens, 5 ones. Write 3, then 0, then 5: 305.\n\nCheck: read 305 aloud. It says three hundred five.\n\n> **Watch out.** Do not write 35 or 350. The 0 goes in the tens place.",
        "三百零五：3 个百、没有十、5 个一。依次写 3、0、5：305。\n\n检验：把 305 读出来，正是三百零五。\n\n> **注意。** 不要写成 35 或 350。0 要写在十位上。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const tens = rng.int(0, 9);
        const single = rng.int(0, 9);
        const n = 100 * h + 10 * tens + single;
        const slips: Slip[] = [
          [100 * h + 10 * single + tens, "That swaps the tens and the ones.", "这把十位和个位换了。"],
          [10 * h + tens + single, "That leaves out a place, so the number is too small.", "这少写了一位，数变小了。"],
        ];
        if (tens === 0) slips.push([10 * h + single, "That drops the 0 in the tens place.", "这漏掉了十位上的 0。"]);
        return solved(
          [`Write this number with digits: ${numberWordsEn(n)}.`, `用数字写出这个数：${numberWordsZh(n)}。`],
          n,
          [
            [
              ["Listen for each place", "听出每一位"],
              [`It says ${h} hundreds, ${tens} tens and ${single} ones.`, `它说的是 ${h} 个百、${tens} 个十、${single} 个一。`],
            ],
            [
              ["Write the digits in order", "按顺序写数字"],
              [`Hundreds ${h}, tens ${tens}, ones ${single}: ${n}.`, `百位 ${h}，十位 ${tens}，个位 ${single}：${n}。`],
            ],
          ],
          [`Read ${n} aloud: ${numberWordsEn(n)}.`, `把 ${n} 读出来：${numberWordsZh(n)}。`],
          slips,
        );
      },
      captioned(blocksFigure(3, 0, 5), "Three hundred five in blocks: 3 hundreds and 5 ones.", "用积木表示三百零五：3 个百和 5 个一。"),
    ),
    earlyPoint(
      "from-a-number-to-words",
      ["From a number to words", "由数写出读法"],
      [
        "To say 418, read the hundreds first: four hundred. Then say the rest, 18, as eighteen. So 418 is four hundred eighteen.\n\nCheck: write the digits from the words: 4 hundreds and 18 more is 418.\n\n> **Watch out.** Read the last two digits together. 418 is not four hundred one eight.",
        "读 418，先读百位：四百。再把后面的 18 读作十八。所以 418 读作四百一十八。\n\n检验：按读法写数字：4 个百再加 18，是 418。\n\n> **注意。** 后两位要合起来读。418 不读作四百一八。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const tens = rng.int(0, 8);
        const single = rng.int(0, 9);
        const n = 100 * h + 10 * tens + single;
        const words = (v: number): Pair => [numberWordsEn(v), numberWordsZh(v)];
        const cands: [number, string, string][] = [
          [100 * h + 10 * single + tens, "That name swaps the tens and the ones.", "这个读法把十位和个位换了。"],
          [n + 100, "That name has one hundred too many.", "这个读法多了一个百。"],
          [n + 10, "That name has one ten too many.", "这个读法多了一个十。"],
          [n + 1, "That name has one too many.", "这个读法多了 1。"],
        ];
        const seen = new Set([n]);
        const wrong: Wrong[] = [];
        for (const [v, en, zh] of cands) {
          if (seen.has(v) || wrong.length === 3) continue;
          seen.add(v);
          wrong.push([words(v), en, zh]);
        }
        return picked(
          rng,
          [`Which is the name of $${n}$?`, `$${n}$ 怎么读？`],
          words(n),
          wrong,
          [
            [
              ["Read the hundreds", "先读百位"],
              [`${h} in the hundreds place is ${numberWordsEn(100 * h)}.`, `百位上的 ${h} 读作${numberWordsZh(100 * h)}。`],
            ],
            [
              ["Read the rest", "再读后面"],
              n % 100 === 0
                ? ["There is nothing more to say.", "后面没有别的要读。"]
                : [`The rest, ${n % 100}, is ${numberWordsEn(n % 100)}.`, `后面的部分读作${numberWordsZh(n).slice(2)}。`],
            ],
          ],
          [
            `Write the digits from the name: ${h} hundreds and ${n % 100} more is ${n}.`,
            `按读法写数字：${h} 个百再加 ${n % 100}，是 ${n}。`,
          ],
        );
      },
      captioned(blocksFigure(4, 1, 8), "418 in blocks: 4 hundreds and 18 more.", "用积木表示 418：4 个百，再加 18。"),
    ),
  ],
  [
    "On a check, Grandpa writes 260 in words: two hundred sixty. The bank reads the words back as 2, 6, 0.\n\nCheck: 2 hundreds and 6 tens is 260.\n\nIn this lesson we read and write three-digit numbers in words.",
    "爷爷在支票上把 260 写成文字：二百六十。银行按文字读出 2、6、0。\n\n检验：2 个百和 6 个十是 260。\n\n本课我们读出并写出三位数的文字形式。",
  ],
);

const comparingToThousand = earlyTopic(
  "comparing-numbers-up-to-1000",
  ["Comparing Numbers Up to 1,000", "比较 1000 以内的数"],
  ["Compare three-digit numbers by looking at hundreds, then tens, then ones.", "按百、十、一的顺序比较三位数。"],
  ["place-value-up-to-1000", "comparing-two-digit-numbers"],
  ["2.NBT.A.4"],
  [
    earlyPoint(
      "the-symbol-between-two-numbers",
      ["The symbol between two numbers", "两个数之间的符号"],
      [
        "Compare 389 and 412. Start at the left: 3 hundreds is less than 4 hundreds. So $389 < 412$.\n\nCheck: on a number line, 389 comes before 400 and 412 comes after it.\n\n> **Watch out.** Do not look at the ones first. 389 has more ones, but 412 has more hundreds.",
        "比较 389 和 412。从左边开始：3 个百比 4 个百少。所以 $389 < 412$。\n\n检验：在数轴上，389 在 400 前面，412 在 400 后面。\n\n> **注意。** 不要先看个位。389 的个位大，但 412 的百位大。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const a = 100 * h + rng.int(0, 99);
        const kind = rng.int(0, 7);
        const b =
          kind === 0
            ? a
            : kind <= 3
              ? 100 * h + rng.pick([...Array(100).keys()].filter((v) => v !== a % 100))
              : 100 * rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== h)) + (a % 100);
        const rel = a < b ? 0 : a === b ? 1 : 2;
        const sym = ["<", "=", ">"][rel] as string;
        const da = String(a);
        const db = String(b);
        const at = [0, 1, 2].find((i) => da[i] !== db[i]);
        const placeName: Pair[] = [
          ["hundreds", "百"],
          ["tens", "十"],
          ["ones", "个"],
        ];
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return compared(
          `${a}`,
          `${b}`,
          rel,
          [
            [
              ["Compare from the left", "从左边开始比"],
              at === undefined
                ? ["Every digit is the same.", "每一位都相同。"]
                : [
                    `The first place that differs is the ${placeName[at]?.[0]}: ${da[at]} and ${db[at]}.`,
                    `第一个不同的是${placeName[at]?.[1]}位：${da[at]} 和 ${db[at]}。`,
                  ],
            ],
            [
              ["Choose the sign", "选符号"],
              at === undefined ? ["The numbers are equal.", "两个数相等。"] : [`So ${lo} is less than ${hi}.`, `所以 ${lo} 比 ${hi} 小。`],
              [`${a} ${sym} ${b}`],
            ],
          ],
          at === undefined
            ? ["They sit at the same spot on a number line.", "它们在数轴上是同一个点。"]
            : [`Counting up, ${lo} comes before ${hi}.`, `往上数时，${lo} 在 ${hi} 前面。`],
          [
            a === b
              ? ["The numbers are equal, so neither is less.", "两个数相等，没有哪个更小。"]
              : [`${a} is greater than ${b}.`, `${a} 比 ${b} 大。`],
            [`${a} and ${b} are different numbers.`, `${a} 和 ${b} 是不同的数。`],
            a === b
              ? ["The numbers are equal, so neither is greater.", "两个数相等，没有哪个更大。"]
              : [`${a} is less than ${b}.`, `${a} 比 ${b} 小。`],
          ],
        );
      },
      captioned(
        numberLineFigure(380, 420, 10, 400),
        "A number line from 380 to 420: 389 sits before 400 and 412 after it.",
        "从 380 到 420 的数轴：389 在 400 前面，412 在 400 后面。",
      ),
    ),
    earlyPoint(
      "greatest-and-least-of-four-numbers",
      ["Greatest and least of four numbers", "四个数中最大和最小的"],
      [
        "Which is greatest: 254, 245, 352, 325? Hundreds first: 352 and 325 have 3 hundreds. Then tens: 5 tens beats 2 tens. So 352 is greatest.\n\nCheck: in order, 245, 254, 325, 352.\n\n> **Watch out.** Once the hundreds pick out the leaders, do not go back to the others.",
        "哪个最大：254、245、352、325？先看百位：352 和 325 有 3 个百。再看十位：5 个十比 2 个十多。所以 352 最大。\n\n检验：按顺序是 245、254、325、352。\n\n> **注意。** 百位已经选出领先的数以后，就不要再回头看其他的数。",
      ],
      (rng) => {
        const base = 100 * rng.int(1, 8);
        const pool = rng.sample(
          [...Array(200).keys()].map((v) => base + v),
          4,
        );
        const asksGreatest = rng.bool();
        const sorted = [...pool].sort((x, y) => x - y);
        const correct = (asksGreatest ? sorted[3] : sorted[0]) as number;
        const wrong: MathWrong[] = pool
          .filter((v) => v !== correct)
          .map((v) =>
            asksGreatest
              ? [`${v}`, `${v} is less than ${correct}.`, `${v} 比 ${correct} 小。`]
              : [`${v}`, `${v} is greater than ${correct}.`, `${v} 比 ${correct} 大。`],
          );
        return pickedMath(
          rng,
          [`Which of these numbers is the ${asksGreatest ? "greatest" : "least"}?`, `下面哪个数${asksGreatest ? "最大" : "最小"}？`],
          `${correct}`,
          wrong,
          [
            [
              ["Compare the hundreds", "先比百位"],
              ["Keep only the numbers that can still win.", "只留下还可能是答案的数。"],
            ],
            [
              ["Then tens, then ones", "再比十位和个位"],
              [`That picks out ${correct}.`, `这样选出 ${correct}。`],
            ],
          ],
          [
            `In order: ${sorted.join(", ")}, so the ${asksGreatest ? "greatest" : "least"} is ${correct}.`,
            `按顺序是 ${sorted.join("、")}，所以${asksGreatest ? "最大" : "最小"}的是 ${correct}。`,
          ],
        );
      },
      captioned(
        numberLineFigure(240, 360, 20),
        "A number line from 240 to 360 for putting 245, 254, 325 and 352 in order.",
        "从 240 到 360 的数轴，可以给 245、254、325、352 排序。",
      ),
    ),
  ],
  [
    "Two schools collect cans. One has 418 and the other 481. Both have 4 hundreds, so look at the tens: 8 tens beats 1 ten. The second school has more.\n\nCheck: $418 < 481$, and 481 is closer to 500.\n\nIn this lesson we compare three-digit numbers by hundreds, then tens, then ones.",
    "两所学校收集罐子。一所有 418 个，另一所有 481 个。都是 4 个百，就看十位：8 个十比 1 个十多。第二所学校收得多。\n\n检验：$418 < 481$，481 更接近 500。\n\n本课我们按百、十、一的顺序比较三位数。",
  ],
);

const addingTenOrHundred = earlyTopic(
  "adding-and-subtracting-10-or-100",
  ["Adding and Subtracting 10 or 100", "加减 10 或 100"],
  ["Add or take away 10 or 100 in your head by changing one digit.", "通过改变一个数字，心算加减 10 或 100。"],
  ["place-value-up-to-1000", "ten-more-and-ten-less"],
  ["2.NBT.B.8"],
  [
    earlyPoint(
      "adding-ten-or-a-hundred-in-your-head",
      ["Adding 10 or 100 in your head", "心算加 10 或 100"],
      [
        "$362 + 10$: one more ten, so the tens digit goes from 6 to 7. That gives 372.\n\nCheck: $372 - 362 = 10$.\n\n> **Watch out.** Adding 10 changes the tens, not the ones. 363 is only 1 more.",
        "$362 + 10$：多一个十，十位从 6 变成 7，得 372。\n\n检验：$372 - 362 = 10$。\n\n> **注意。** 加 10 改变的是十位，不是个位。363 只多了 1。",
      ],
      (rng) => {
        const crossing = rng.int(0, 4) === 0;
        const n = crossing ? 100 * rng.int(1, 8) + 90 + rng.int(0, 9) : 100 + rng.int(0, 799);
        const step = crossing ? 10 : rng.pick([10, 100]);
        const answer = n + step;
        const place: Pair = step === 10 ? ["tens", "十"] : ["hundreds", "百"];
        return solved(
          [`What is $${n} + ${step}$?`, `$${n} + ${step}$ 等于多少？`],
          answer,
          [
            [
              ["See which digit changes", "看哪一位变"],
              [`Adding ${step} adds one to the ${place[0]}.`, `加 ${step} 就是${place[1]}位加 1。`],
            ],
            crossing
              ? [
                  ["Make a new hundred", "满十进一"],
                  [`The tens digit is 9, so one more ten makes a new hundred: ${answer}.`, `十位是 9，再加一个十就满一百：${answer}。`],
                ]
              : [
                  ["Change that digit", "改这一位"],
                  [`So ${n} becomes ${answer}.`, `所以 ${n} 变成 ${answer}。`],
                ],
          ],
          [`Take it back: $${answer} - ${step} = ${n}$.`, `倒回去验算：$${answer} - ${step} = ${n}$。`],
          [
            [n + 1, "That adds 1, not 10 or 100.", "这只加了 1。"],
            [
              n + (step === 10 ? 100 : 10),
              `That changes the wrong digit. Adding ${step} changes the ${place[0]}.`,
              `这改错了数位。加 ${step} 改变的是${place[1]}位。`,
            ],
            [n - step, "That takes away instead of adding.", "这里应该加，却减了。"],
          ],
        );
      },
      captioned(hopsFigure([362, 372]), "A hop of 10 from 362 to 372.", "从 362 跳 10 到 372。"),
    ),
    earlyPoint(
      "taking-away-ten-or-a-hundred-in-your-head",
      ["Taking away 10 or 100 in your head", "心算减 10 或 100"],
      [
        "$305 - 10$: there are no tens to take, so trade 1 hundred for 10 tens. Now take one ten away: 295.\n\nCheck: $295 + 10 = 305$.\n\n> **Watch out.** 305 take away 10 is not 395. The hundreds go down, not up.",
        "$305 - 10$：十位上没有十可拿，就把 1 个百换成 10 个十，再拿走一个十：295。\n\n检验：$295 + 10 = 305$。\n\n> **注意。** 305 减 10 不是 395。百位要变小，不是变大。",
      ],
      (rng) => {
        const crossing = rng.int(0, 4) === 0;
        const n = crossing ? 100 * rng.int(2, 9) + rng.int(0, 9) : 110 + rng.int(0, 880);
        const step = crossing || n < 200 ? 10 : rng.pick([10, 100]);
        const answer = n - step;
        const place: Pair = step === 10 ? ["tens", "十"] : ["hundreds", "百"];
        const slips: Slip[] = [
          [n - 1, "That takes away 1, not 10 or 100.", "这只减了 1。"],
          [n + step, "That adds instead of taking away.", "这里应该减，却加了。"],
          [
            n - (step === 10 ? 100 : 10),
            `That changes the wrong digit. Taking away ${step} changes the ${place[0]}.`,
            `这改错了数位。减 ${step} 改变的是${place[1]}位。`,
          ],
        ];
        if (crossing) slips.unshift([n + 90, "The hundreds go down by one when you trade, not up.", "换的时候百位要减 1，不是加。"]);
        return solved(
          [`What is $${n} - ${step}$?`, `$${n} - ${step}$ 等于多少？`],
          answer,
          [
            [
              ["See which digit changes", "看哪一位变"],
              [`Taking away ${step} takes one from the ${place[0]}.`, `减 ${step} 就是${place[1]}位减 1。`],
            ],
            crossing
              ? [
                  ["Trade a hundred", "换一个百"],
                  [
                    `There are no tens, so trade 1 hundred for 10 tens and take one away: ${answer}.`,
                    `十位上没有十，把 1 个百换成 10 个十，再拿走一个：${answer}。`,
                  ],
                ]
              : [
                  ["Change that digit", "改这一位"],
                  [`So ${n} becomes ${answer}.`, `所以 ${n} 变成 ${answer}。`],
                ],
          ],
          [`Add it back: $${answer} + ${step} = ${n}$.`, `加回去验算：$${answer} + ${step} = ${n}$。`],
          slips,
        );
      },
      captioned(hopsFigure([305, 295]), "A hop of 10 back from 305 to 295.", "从 305 往回跳 10 到 295。"),
    ),
  ],
  [
    "Sara has 245 stamps. Her aunt gives her a book of 100 more. Now the hundreds go from 2 to 3: she has 345.\n\nCheck: $345 - 100 = 245$.\n\nIn this lesson we add or take away 10 or 100 in our heads by changing one digit.",
    "萨拉有 245 张邮票，姑姑又给她一本 100 张的。百位从 2 变成 3：现在有 345 张。\n\n检验：$345 - 100 = 245$。\n\n本课我们通过改变一个数字，心算加减 10 或 100。",
  ],
);

const factsWithinTwenty = earlyTopic(
  "adding-and-subtracting-within-20-quickly",
  ["Adding and Subtracting Within 20 Quickly", "快速计算 20 以内的加减法"],
  [
    "Know sums and differences within 20 quickly, using strategies that make them easy.",
    "运用让计算变容易的方法，快速算出 20 以内的和与差。",
  ],
  ["subtracting-through-ten", "related-addition-and-subtraction-facts"],
  ["2.OA.B.2"],
  [
    earlyPoint(
      "sums-to-twenty-by-strategy",
      ["Sums to 20 by strategy", "用方法算 20 以内的和"],
      [
        "$8 + 6$: move 2 from the 6 to the 8 to make a ten. Then $10 + 4 = 14$.\n\nCheck: count on from 8 six times: 9, 10, 11, 12, 13, 14.\n\n> **Watch out.** After you move 2, only 4 are left of the 6. Do not add the whole 6 to the ten.",
        "$8 + 6$：从 6 里拿 2 给 8，凑成十。再算 $10 + 4 = 14$。\n\n检验：从 8 往后数六个：9、10、11、12、13、14。\n\n> **注意。** 拿走 2 以后，6 只剩 4。不要再把整个 6 加到十上。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const answer = a + b;
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        const need = 10 - big;
        const walk: [Pair, Pair, string[]?][] =
          answer > 10
            ? [
                [
                  ["Make a ten", "凑十"],
                  [`Move ${need} from the ${small} to the ${big}:`, `从 ${small} 里拿 ${need} 给 ${big}：`],
                  [`${big} + ${need} = 10`],
                ],
                [
                  ["Add what is left", "加上剩下的"],
                  [`${small} has ${small - need} left:`, `${small} 还剩 ${small - need}：`],
                  [`10 + ${small - need} = ${answer}`],
                ],
              ]
            : [
                [
                  ["Start from the bigger number", "从大数开始"],
                  [`Start at ${big}.`, `从 ${big} 开始。`],
                ],
                [["Count on", "往后数"], [`Count on ${small}:`, `往后数 ${small}：`], [`${big} + ${small} = ${answer}`]],
              ];
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          walk,
          [`Take it back: $${answer} - ${b} = ${a}$.`, `倒回去验算：$${answer} - ${b} = ${a}$。`],
          [
            [answer + 1, "That counts the starting number again when counting on.", "往后数时把起点又数了一次。"],
            [answer - 1, "That is one short. Count the jumps again.", "少了 1，再数一遍。"],
            [
              10 + small,
              `That adds the whole ${small} to the ten. Some of it was used to make the ten.`,
              `这把整个 ${small} 加到了十上，可它有一部分已经用来凑十了。`,
            ],
          ],
        );
      },
      captioned(tenFramesFigure(10, 4), "8 and 2 fill a ten frame; 4 more makes 14.", "8 和 2 填满一个十格，再加 4 是 14。"),
    ),
    earlyPoint(
      "differences-from-a-sum-you-know",
      ["Differences from a sum you know", "用会的加法算差"],
      [
        "$15 - 7$: think 7 plus what makes 15? $7 + 8 = 15$, so $15 - 7 = 8$.\n\nCheck: $15 - 8 = 7$ is the other fact in the same family.\n\n> **Watch out.** Do not add 15 and 7. The question asks what is left.",
        "$15 - 7$：想 7 加几得 15？$7 + 8 = 15$，所以 $15 - 7 = 8$。\n\n检验：$15 - 8 = 7$ 是同一组算式。\n\n> **注意。** 不要把 15 和 7 加起来。问的是还剩多少。",
      ],
      (rng) => {
        const b = rng.int(3, 9);
        const answer = rng.int(3, 9);
        const a = b + answer;
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Turn it into adding", "改成加法想"],
              [`Ask: ${b} plus what makes ${a}?`, `想：${b} 加几得 ${a}？`],
            ],
            [
              ["Use the sum you know", "用会的加法"],
              [`${b} + ${answer} = ${a}, so:`, `${b} + ${answer} = ${a}，所以：`],
              [`${a} - ${b} = ${answer}`],
            ],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去验算：$${answer} + ${b} = ${a}$。`],
          [
            [a + b, "That adds instead of taking away.", "这里应该减，却加了。"],
            [answer + 1, "That is one too many. Check the sum again.", "多了 1，再检查一下加法。"],
            [answer - 1, "That is one too few. Check the sum again.", "少了 1，再检查一下加法。"],
          ],
        );
      },
      captioned(factTriangleFigure(15, 7, 8), "A fact triangle: 7 and 8 make 15.", "算式三角：7 和 8 合起来是 15。"),
    ),
  ],
  [
    "Mia has 9 red beads and 5 blue beads. She moves 1 blue bead next to the red ones to make 10. Then 4 blue beads are left: 14 beads in all.\n\nCheck: $14 - 5 = 9$.\n\nIn this lesson we use make-a-ten and the facts we know to add and take away within 20 quickly.",
    "米娅有 9 颗红珠子和 5 颗蓝珠子。她把 1 颗蓝珠子挪到红珠子旁边，凑成 10，还剩 4 颗蓝的：一共 14 颗。\n\n检验：$14 - 5 = 9$。\n\n本课我们用凑十和会的算式，快速算 20 以内的加减法。",
  ],
);

const addingWithinHundred = earlyTopic(
  "adding-within-100",
  ["Adding Within 100", "100 以内的加法"],
  [
    "Add two-digit numbers by adding tens and ones, trading ten ones for a ten when needed.",
    "把十和一分别相加来计算两位数加法，必要时把十个一换成一个十。",
  ],
  ["adding-and-subtracting-within-20-quickly", "adding-tens-to-two-digit-numbers"],
  ["2.NBT.B.5"],
  [
    earlyPoint(
      "adding-tens-and-ones",
      ["Adding tens and ones", "十和一分别相加"],
      [
        "$34 + 25$: tens first, $30 + 20 = 50$. Then ones, $4 + 5 = 9$. Put them together: 59.\n\nCheck: count on from 34 by 2 tens (44, 54), then 5 ones: 59.\n\n> **Watch out.** Do not add all four digits together. A ten is worth 10, not 1.",
        "$34 + 25$：先加十，$30 + 20 = 50$；再加一，$4 + 5 = 9$。合起来是 59。\n\n检验：从 34 往后数 2 个十（44、54），再数 5 个一：59。\n\n> **注意。** 不要把四个数字全加在一起。一个十是 10，不是 1。",
      ],
      (rng) => {
        const at = rng.int(1, 7);
        const bt = rng.int(1, 8 - at);
        const ao = rng.int(1, 8);
        const bo = rng.int(1, 9 - ao);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a + b;
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [
            [["Add the tens", "十位相加"], ["Tens with tens:", "十和十相加："], [`${10 * at} + ${10 * bt} = ${10 * (at + bt)}`]],
            [["Add the ones", "个位相加"], ["Ones with ones:", "一和一相加："], [`${ao} + ${bo} = ${ao + bo}`]],
            [
              ["Put them together", "合起来"],
              [`${10 * (at + bt)} and ${ao + bo} make ${answer}.`, `${10 * (at + bt)} 和 ${ao + bo} 合起来是 ${answer}。`],
            ],
          ],
          [`Take it back: $${answer} - ${b} = ${a}$.`, `倒回去验算：$${answer} - ${b} = ${a}$。`],
          [
            [at + bt + ao + bo, "That adds all the digits as if each were a one.", "这把每个数字都当成一来加了。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
            [answer - 10, "That has one ten too few.", "这少了一个十。"],
          ],
          blockRowsFigure([
            [0, at, ao],
            [0, bt, bo],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 4],
          [0, 2, 5],
        ]),
        "34 and 25 in blocks: 5 tens and 9 ones together.",
        "用积木表示 34 和 25：合起来是 5 个十和 9 个一。",
      ),
    ),
    earlyPoint(
      "trading-ten-ones-for-a-ten",
      ["Trading ten ones for a ten", "把十个一换成一个十"],
      [
        "These blocks are 3 tens and 14 ones. Ten of the ones make a new ten. Now there are 4 tens and 4 ones: 44.\n\nCheck: $30 + 14 = 44$.\n\n> **Watch out.** Do not write 314. Ones over 9 must be traded first.",
        "这些积木是 3 个十和 14 个一。其中十个一换成一个新的十。现在是 4 个十和 4 个一：44。\n\n检验：$30 + 14 = 44$。\n\n> **注意。** 不要写成 314。个位超过 9，要先换。",
      ],
      (rng) => {
        const tens = rng.int(2, 6);
        const single = rng.int(11, 18);
        const answer = 10 * tens + single;
        return solved(
          ["Trade ten ones for one ten. What number do these blocks show?", "把十个一换成一个十。这些积木表示什么数？"],
          answer,
          [
            [
              ["Trade ten ones", "换十个一"],
              [`${single} ones are 1 ten and ${plural(single - 10, "one")}.`, `${single} 个一是 1 个十和 ${single - 10} 个一。`],
            ],
            [
              ["Count again", "重新数"],
              [
                `Now there are ${tens + 1} tens and ${plural(single - 10, "one")}: ${answer}.`,
                `现在是 ${tens + 1} 个十和 ${single - 10} 个一：${answer}。`,
              ],
            ],
          ],
          [`$${10 * tens} + ${single} = ${answer}$.`, `$${10 * tens} + ${single} = ${answer}$。`],
          [
            [answer - 10, "That drops the ten made from the ones.", "这漏掉了用一换来的那个十。"],
            [tens + single, "That counts each rod as one.", "这把每根长条当成了一。"],
            [100 * tens + single, "That writes the ones after the tens without trading.", "这没有换，就把个位直接写在十位后面了。"],
          ],
          blocksFigure(0, tens, single),
        );
      },
      captioned(
        blocksFigure(0, 3, 14),
        "3 tens and 14 ones: trade 10 ones to get 4 tens and 4 ones.",
        "3 个十和 14 个一：换掉 10 个一，得 4 个十和 4 个一。",
      ),
    ),
    earlyPoint(
      "adding-with-a-new-ten",
      ["Adding with a new ten", "相加时产生新的十"],
      [
        "$27 + 38$: ones first, $7 + 8 = 15$. That is a new ten and 5 ones. Tens: $20 + 30 + 10 = 60$. So the sum is 65.\n\nCheck: $27 + 40 = 67$, and $67 - 2 = 65$.\n\n> **Watch out.** Do not forget the new ten. 55 leaves it out.",
        "$27 + 38$：先算个位，$7 + 8 = 15$，是一个新的十和 5 个一。十位：$20 + 30 + 10 = 60$。所以和是 65。\n\n检验：$27 + 40 = 67$，$67 - 2 = 65$。\n\n> **注意。** 别忘了新的十。55 就是把它漏了。",
      ],
      (rng) => {
        const ao = rng.int(2, 9);
        const bo = rng.int(Math.max(1, 10 - ao), 9);
        const at = rng.int(1, 7);
        const bt = rng.int(1, 8 - at);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a + b;
        const s = ao + bo;
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Add the ones", "先加个位"],
              [
                s === 10 ? "The ones make a new ten:" : `The ones make a new ten and ${s - 10} more:`,
                s === 10 ? "个位凑成一个新的十：" : `个位得一个新的十，还多 ${s - 10}：`,
              ],
              [`${ao} + ${bo} = ${s}`],
            ],
            [
              ["Add the tens with the new ten", "十位加上新的十"],
              ["Tens, plus the new ten:", "十位相加，再加新的十："],
              [`${10 * at} + ${10 * bt} + 10 = ${10 * (at + bt + 1)}`],
            ],
            [
              ["Put them together", "合起来"],
              [`${10 * (at + bt + 1)} and ${s - 10} make ${answer}.`, `${10 * (at + bt + 1)} 和 ${s - 10} 合起来是 ${answer}。`],
            ],
          ],
          [`Take it back: $${answer} - ${b} = ${a}$.`, `倒回去验算：$${answer} - ${b} = ${a}$。`],
          [
            [answer - 10, "That forgets the new ten from the ones.", "这忘了个位满十进的那个十。"],
            [answer + 10, "That adds the new ten twice.", "这把新的十加了两次。"],
            [
              10 * (at + bt) + s,
              "That writes the ones sum straight after the tens without trading.",
              "这没有进位，把个位的和直接写在后面了。",
            ],
          ],
          blockRowsFigure([
            [0, at, ao],
            [0, bt, bo],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 2, 7],
          [0, 3, 8],
        ]),
        "27 and 38 in blocks: 15 ones trade for a ten and 5 ones.",
        "用积木表示 27 和 38：15 个一换成一个十和 5 个一。",
      ),
    ),
  ],
  [
    "Leo reads 26 pages on Monday and 17 on Tuesday. The ones, 6 and 7, make 13: a new ten and 3. With the 2 tens and 1 ten, that is 43 pages.\n\nCheck: $43 - 17 = 26$.\n\nIn this lesson we add two-digit numbers by tens and ones, trading ten ones for a ten when we need to.",
    "利奥星期一读了 26 页，星期二读了 17 页。个位 6 和 7 得 13：一个新的十和 3。再加上 2 个十和 1 个十，一共 43 页。\n\n检验：$43 - 17 = 26$。\n\n本课我们把两位数的十和一分别相加，需要时把十个一换成一个十。",
  ],
);

const subtractingWithinHundred = earlyTopic(
  "subtracting-within-100",
  ["Subtracting Within 100", "100 以内的减法"],
  [
    "Subtract two-digit numbers by taking tens and ones, trading a ten for ten ones when needed.",
    "把十和一分别相减来计算两位数减法，必要时把一个十换成十个一。",
  ],
  ["adding-within-100", "subtracting-multiples-of-ten"],
  ["2.NBT.B.5"],
  [
    earlyPoint(
      "taking-away-tens-and-ones",
      ["Taking away tens and ones", "十和一分别相减"],
      [
        "$58 - 23$: tens, $50 - 20 = 30$. Ones, $8 - 3 = 5$. Together: 35.\n\nCheck: $35 + 23 = 58$.\n\n> **Watch out.** Do not add the numbers. Taking away makes the answer smaller than 58.",
        "$58 - 23$：十位，$50 - 20 = 30$；个位，$8 - 3 = 5$。合起来是 35。\n\n检验：$35 + 23 = 58$。\n\n> **注意。** 不要把两个数加起来。减了以后答案要比 58 小。",
      ],
      (rng) => {
        const at = rng.int(3, 9);
        const bt = rng.int(1, at - 1);
        const ao = rng.int(2, 9);
        const bo = rng.int(1, ao);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a - b;
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [["Take the tens", "十位相减"], ["Tens from tens:", "十减十："], [`${at * 10} - ${bt * 10} = ${(at - bt) * 10}`]],
            [["Take the ones", "个位相减"], ["Ones from ones:", "一减一："], [`${ao} - ${bo} = ${ao - bo}`]],
            [
              ["Put them together", "合起来"],
              [`${(at - bt) * 10} and ${ao - bo} make ${answer}.`, `${(at - bt) * 10} 和 ${ao - bo} 合起来是 ${answer}。`],
            ],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去验算：$${answer} + ${b} = ${a}$。`],
          [
            [a + b, "That adds instead of taking away.", "这里应该减，却加了。"],
            [answer + 10, "That takes away one ten too few.", "这少减了一个十。"],
            [answer - 10, "That takes away one ten too many.", "这多减了一个十。"],
          ],
          blocksFigure(0, at, ao),
        );
      },
      captioned(
        blocksFigure(0, 5, 8),
        "58 in blocks: take away 2 tens and 3 ones to leave 35.",
        "用积木表示 58：拿走 2 个十和 3 个一，剩 35。",
      ),
    ),
    earlyPoint(
      "trading-a-ten-for-ten-ones",
      ["Trading a ten for ten ones", "把一个十换成十个一"],
      [
        "$42 - 7$: 42 has only 2 ones, not enough to take 7. Open one ten: now 3 tens and 12 ones.\n\nCheck: $30 + 12 = 42$, so the number has not changed.\n\n> **Watch out.** After the trade there are 12 ones, not 10. Keep the 2 you had.",
        "$42 - 7$：42 只有 2 个一，不够减 7。打开一个十：现在是 3 个十和 12 个一。\n\n检验：$30 + 12 = 42$，这个数没有变。\n\n> **注意。** 换了以后是 12 个一，不是 10 个。原来的 2 个还在。",
      ],
      (rng) => {
        const at = rng.int(2, 9);
        const ao = rng.int(0, 8);
        const bo = rng.int(ao + 1, 9);
        const bt = rng.int(1, at - 1);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = ao + 10;
        return solved(
          [
            `To work out $${a} - ${b}$, you trade one ten for ten ones. How many ones do you have after the trade?`,
            `计算 $${a} - ${b}$ 时，要把一个十换成十个一。换了以后有多少个一？`,
          ],
          answer,
          [
            [
              ["Count the ones you have", "数原来的一"],
              [`${a} has ${ao === 0 ? "no ones" : plural(ao, "one")}, fewer than ${bo}.`, `${a} 有 ${ao} 个一，比 ${bo} 少。`],
            ],
            [
              ["Add ten from the trade", "加上换来的十个一"],
              ["The trade brings ten more ones:", "换来十个一："],
              [`${ao} + 10 = ${answer}`],
            ],
          ],
          [
            `${at - 1} tens and ${answer} ones is still $${10 * (at - 1)} + ${answer} = ${a}$.`,
            `${at - 1} 个十和 ${answer} 个一仍然是 $${10 * (at - 1)} + ${answer} = ${a}$。`,
          ],
          [
            [10, "That leaves out the ones you had before.", "这漏掉了原来的一。"],
            [ao, "That forgets the ten ones from the trade.", "这忘了换来的十个一。"],
            [bo, "That is the ones digit of the number taken away.", "这是减数的个位。"],
            [ao + 1, "A ten trades for ten ones, not one.", "一个十换成十个一，不是一个。"],
          ],
          blocksFigure(0, at, ao),
        );
      },
      captioned(blocksFigure(0, 3, 12), "42 shown as 3 tens and 12 ones after the trade.", "换了以后，42 表示成 3 个十和 12 个一。"),
    ),
    earlyPoint(
      "subtracting-with-a-trade",
      ["Subtracting with a trade", "需要换的减法"],
      [
        "$52 - 17$: 2 ones is less than 7, so trade a ten. Now 4 tens and 12 ones. Ones: $12 - 7 = 5$. Tens: $4 - 1 = 3$. The answer is 35.\n\nCheck: $35 + 17 = 52$.\n\n> **Watch out.** Do not take 2 from 7 to get 5 ones and 4 tens. 45 is wrong. The 7 is taken from the 2, so trade first.",
        "$52 - 17$：2 个一比 7 少，所以换一个十。现在是 4 个十和 12 个一。个位：$12 - 7 = 5$。十位：$4 - 1 = 3$。答案是 35。\n\n检验：$35 + 17 = 52$。\n\n> **注意。** 不要用 7 减 2 得 5，再写成 45。是从 2 里减 7，要先换。",
      ],
      (rng) => {
        const at = rng.int(3, 9);
        const ao = rng.int(0, 8);
        const bo = rng.int(ao + 1, 9);
        const bt = rng.int(1, at - 2);
        const a = 10 * at + ao;
        const b = 10 * bt + bo;
        const answer = a - b;
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Trade a ten", "换一个十"],
              [
                `${ao} ones is less than ${bo}, so ${a} becomes ${plural(at - 1, "ten")} and ${ao + 10} ones.`,
                `${ao} 个一比 ${bo} 少，所以 ${a} 变成 ${at - 1} 个十和 ${ao + 10} 个一。`,
              ],
            ],
            [["Take the ones", "个位相减"], ["Ones:", "个位："], [`${ao + 10} - ${bo} = ${ao + 10 - bo}`]],
            [["Take the tens", "十位相减"], ["Tens:", "十位："], [`${at - 1} - ${bt} = ${at - 1 - bt}`]],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去验算：$${answer} + ${b} = ${a}$。`],
          [
            [
              10 * (at - bt) + (bo - ao),
              "That takes the smaller ones digit from the bigger one, so no ten is traded.",
              "这用大的个位减小的个位，没有换十。",
            ],
            [answer + 10, "That forgets that one ten was traded away.", "这忘了已经换走了一个十。"],
            [answer - 10, "That takes away one ten too many.", "这多减了一个十。"],
          ],
          blocksFigure(0, at, ao),
        );
      },
      captioned(
        blocksFigure(0, 4, 12),
        "52 traded to 4 tens and 12 ones, ready to take away 17.",
        "52 换成 4 个十和 12 个一，就可以减 17 了。",
      ),
    ),
  ],
  [
    "A bus has 43 people. At a stop, 18 get off. There are only 3 ones, so open a ten: 3 tens and 13 ones. $13 - 8 = 5$ and $3 - 1 = 2$, so 25 people are left.\n\nCheck: $25 + 18 = 43$.\n\nIn this lesson we take away tens and ones, trading a ten for ten ones when we need to.",
    "公交车上有 43 人，到站下去 18 人。个位只有 3，就打开一个十：3 个十和 13 个一。$13 - 8 = 5$，$3 - 1 = 2$，车上还有 25 人。\n\n检验：$25 + 18 = 43$。\n\n本课我们把十和一分别相减，需要时把一个十换成十个一。",
  ],
);

const addingSeveral = earlyTopic(
  "adding-several-two-digit-numbers",
  ["Adding Several Two-Digit Numbers", "几个两位数相加"],
  [
    "Add three or four two-digit numbers, adding the tens and ones and looking for easy pairs.",
    "把三四个两位数相加，分别加十和一，并找容易相加的数对。",
  ],
  ["adding-within-100"],
  ["2.NBT.B.6"],
  [
    earlyPoint(
      "adding-three-two-digit-numbers",
      ["Adding three two-digit numbers", "三个两位数相加"],
      [
        "$23 + 15 + 32$: the tens make $20 + 10 + 30 = 60$. The ones make $3 + 5 + 2 = 10$. So the total is 70.\n\nCheck: add in another order: $23 + 32 = 55$, and $55 + 15 = 70$.\n\n> **Watch out.** Do not stop after two numbers. Add all three.",
        "$23 + 15 + 32$：十加起来是 $20 + 10 + 30 = 60$，一加起来是 $3 + 5 + 2 = 10$。所以总数是 70。\n\n检验：换个顺序加：$23 + 32 = 55$，$55 + 15 = 70$。\n\n> **注意。** 不要只加两个数就停下，三个数都要加。",
      ],
      (rng) => {
        const nums = [rng.int(11, 39), rng.int(11, 39), rng.int(11, 29)] as const;
        const [a, b, c] = nums;
        const answer = a + b + c;
        const tens = 10 * nums.reduce((s, v) => s + Math.floor(v / 10), 0);
        const single = nums.reduce((s, v) => s + (v % 10), 0);
        return solved(
          [`What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c}$ 等于多少？`],
          answer,
          [
            [
              ["Add the tens", "十位相加"],
              ["All the tens:", "所有的十："],
              [`${nums.map((v) => 10 * Math.floor(v / 10)).join(" + ")} = ${tens}`],
            ],
            [["Add the ones", "个位相加"], ["All the ones:", "所有的一："], [`${nums.map((v) => v % 10).join(" + ")} = ${single}`]],
            [["Put them together", "合起来"], ["Tens and ones together:", "十和一合起来："], [`${tens} + ${single} = ${answer}`]],
          ],
          [
            `Add in another order: $${a} + ${c} = ${a + c}$, and $${a + c} + ${b} = ${answer}$.`,
            `换个顺序加：$${a} + ${c} = ${a + c}$，$${a + c} + ${b} = ${answer}$。`,
          ],
          [
            [a + b, "That stops after the first two numbers.", "这只加了前两个数。"],
            [answer - 10, "That loses a ten made by the ones.", "这漏掉了个位凑成的一个十。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          partWholeBarFigure([a, b, c], -1),
        );
      },
      captioned(
        partWholeBarFigure([23, 15, 32], -1),
        "A bar made of 23, 15 and 32; the whole is unknown.",
        "由 23、15 和 32 组成的条形图，总数未知。",
      ),
    ),
    earlyPoint(
      "adding-four-two-digit-numbers",
      ["Adding four two-digit numbers", "四个两位数相加"],
      [
        "$14 + 26 + 13 + 17$: pair numbers whose ones make ten. $14 + 26 = 40$ and $13 + 17 = 30$. Then $40 + 30 = 70$.\n\nCheck: tens $10 + 20 + 10 + 10 = 50$, ones $4 + 6 + 3 + 7 = 20$, and $50 + 20 = 70$.\n\n> **Watch out.** Count the numbers. It is easy to leave one out when there are four.",
        "$14 + 26 + 13 + 17$：把个位能凑成十的配成对。$14 + 26 = 40$，$13 + 17 = 30$，再算 $40 + 30 = 70$。\n\n检验：十位 $10 + 20 + 10 + 10 = 50$，个位 $4 + 6 + 3 + 7 = 20$，$50 + 20 = 70$。\n\n> **注意。** 数一数有几个数。四个数时很容易漏掉一个。",
      ],
      (rng) => {
        const nums = [rng.int(11, 29), rng.int(11, 29), rng.int(11, 29), rng.int(11, 29)] as const;
        const shown = nums.join(" + ");
        const answer = nums.reduce((s, v) => s + v, 0);
        const tens = 10 * nums.reduce((s, v) => s + Math.floor(v / 10), 0);
        const single = nums.reduce((s, v) => s + (v % 10), 0);
        const [a, b, c, d] = nums;
        return solved(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [
            [
              ["Add the tens", "十位相加"],
              ["All the tens:", "所有的十："],
              [`${nums.map((v) => 10 * Math.floor(v / 10)).join(" + ")} = ${tens}`],
            ],
            [["Add the ones", "个位相加"], ["All the ones:", "所有的一："], [`${nums.map((v) => v % 10).join(" + ")} = ${single}`]],
            [["Put them together", "合起来"], ["Tens and ones together:", "十和一合起来："], [`${tens} + ${single} = ${answer}`]],
          ],
          [
            `Add in pairs: $${a} + ${b} = ${a + b}$, $${c} + ${d} = ${c + d}$, and $${a + b} + ${c + d} = ${answer}$.`,
            `两个两个地加：$${a} + ${b} = ${a + b}$，$${c} + ${d} = ${c + d}$，$${a + b} + ${c + d} = ${answer}$。`,
          ],
          [
            [answer - d, "That leaves out the last number.", "这漏掉了最后一个数。"],
            [answer - 10, "That loses a ten made by the ones.", "这漏掉了个位凑成的一个十。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          partWholeBarFigure([a, b, c, d], -1),
        );
      },
      captioned(
        partWholeBarFigure([14, 26, 13, 17], -1),
        "A bar made of 14, 26, 13 and 17; the whole is unknown.",
        "由 14、26、13 和 17 组成的条形图，总数未知。",
      ),
    ),
  ],
  [
    "Three friends pick apples: 24, 31 and 16. The ones 4 and 6 make a ten, so add those first: $24 + 16 = 40$. Then $40 + 31 = 71$.\n\nCheck: tens $20 + 30 + 10 = 60$, ones $4 + 1 + 6 = 11$, and $60 + 11 = 71$.\n\nIn this lesson we add three or four two-digit numbers, adding tens and ones and looking for easy pairs.",
    "三个朋友摘苹果：24 个、31 个、16 个。个位 4 和 6 凑成十，先加它们：$24 + 16 = 40$。再算 $40 + 31 = 71$。\n\n检验：十位 $20 + 30 + 10 = 60$，个位 $4 + 1 + 6 = 11$，$60 + 11 = 71$。\n\n本课我们把三四个两位数相加，分别加十和一，并找容易相加的数对。",
  ],
);

const missingNumbers = earlyTopic(
  "missing-numbers-within-100",
  ["Missing Numbers Within 100", "100 以内的未知数"],
  ["Find the unknown number in an addition or subtraction sentence within 100.", "求出 100 以内加减算式中的未知数。"],
  ["subtracting-within-100"],
  ["2.NBT.B.5", "2.OA.A.1"],
  [
    earlyPoint(
      "the-missing-addend-within-100",
      ["The missing addend", "未知加数"],
      [
        "$28 + \\square = 65$: the whole is 65 and one part is 28. The missing part is $65 - 28 = 37$.\n\nCheck: count up from 28: 3 tens to 58, then 7 ones to 65. That is 37.\n\n> **Watch out.** The box is a part, not the total. Do not write 65 in it.",
        "$28 + \\square = 65$：总数是 65，一部分是 28。另一部分是 $65 - 28 = 37$。\n\n检验：从 28 往上数：3 个十到 58，再 7 个一到 65，一共 37。\n\n> **注意。** 方框里是一部分，不是总数。不要填 65。",
      ],
      (rng) => {
        const a = rng.int(12, 58);
        const answer = rng.int(12, 40);
        const total = a + answer;
        const first = rng.bool();
        const shown = first ? `${a} + \\square = ${total}` : `\\square + ${a} = ${total}`;
        return solved(
          [`What number goes in the box? $${shown}$`, `方框里填几？$${shown}$`],
          answer,
          [
            [
              ["Find the whole and the part", "找出总数和部分"],
              [`The whole is ${total}. One part is ${a}.`, `总数是 ${total}，一部分是 ${a}。`],
            ],
            [["Take the part away", "用总数减去部分"], ["The other part is:", "另一部分是："], [`${total} - ${a} = ${answer}`]],
          ],
          [`Put it back: $${a} + ${answer} = ${total}$.`, `代回去：$${a} + ${answer} = ${total}$。`],
          [
            [total, "That is the total, not the missing part.", "这是总数，不是未知的部分。"],
            [a + total, "That adds the part to the total.", "这把部分和总数加起来了。"],
            [answer + 10, "That is one ten too many.", "这多了一个十。"],
          ],
          partWholeBarFigure([a, answer], 1),
        );
      },
      captioned(
        partWholeBarFigure([28, 37], 1),
        "A whole of 65: one part is 28 and the other is unknown.",
        "总数是 65：一部分是 28，另一部分未知。",
      ),
    ),
    earlyPoint(
      "the-missing-number-in-a-subtraction",
      ["The missing number in a subtraction", "减法中的未知数"],
      [
        "$\\square - 24 = 31$: 24 was taken away and 31 is left. The start is both parts together: $24 + 31 = 55$.\n\nCheck: $55 - 24 = 31$.\n\n> **Watch out.** Do not take 24 from 31. The start must be bigger than what is left.",
        "$\\square - 24 = 31$：拿走了 24，剩下 31。开始的数是两部分合起来：$24 + 31 = 55$。\n\n检验：$55 - 24 = 31$。\n\n> **注意。** 不要用 31 减 24。开始的数一定比剩下的多。",
      ],
      (rng) => {
        const take = rng.int(11, 39);
        const left = rng.int(11, 45);
        const start = take + left;
        if (rng.bool())
          return solved(
            [`What number goes in the box? $\\square - ${take} = ${left}$`, `方框里填几？$\\square - ${take} = ${left}$`],
            start,
            [
              [
                ["See the parts", "看清两部分"],
                [`${take} was taken away and ${left} is left.`, `拿走了 ${take}，剩下 ${left}。`],
              ],
              [
                ["Put the parts together", "两部分合起来"],
                ["The start is both parts:", "开始的数是两部分之和："],
                [`${take} + ${left} = ${start}`],
              ],
            ],
            [`$${start} - ${take} = ${left}$.`, `$${start} - ${take} = ${left}$。`],
            [
              [
                Math.abs(left - take),
                "That takes one number from the other. The start is the two parts together.",
                "这是两个数相减。开始的数应该是两部分合起来。",
              ],
              [start + 10, "That is one ten too many.", "这多了一个十。"],
              [start - 10, "That is one ten too few.", "这少了一个十。"],
            ],
            partWholeBarFigure([take, left], -1),
          );
        return solved(
          [`What number goes in the box? $${start} - \\square = ${left}$`, `方框里填几？$${start} - \\square = ${left}$`],
          take,
          [
            [
              ["See the parts", "看清两部分"],
              [`The whole is ${start}. ${left} is left.`, `总数是 ${start}，剩下 ${left}。`],
            ],
            [["Find the part taken away", "求拿走的部分"], ["What was taken away is:", "拿走的是："], [`${start} - ${left} = ${take}`]],
          ],
          [`$${start} - ${take} = ${left}$.`, `$${start} - ${take} = ${left}$。`],
          [
            [start + left, "That adds the numbers instead of finding the gap.", "这把两个数加起来了，没有求差。"],
            [left, "That is what is left, not what was taken away.", "这是剩下的，不是拿走的。"],
            [take + 10, "That is one ten too many.", "这多了一个十。"],
          ],
          partWholeBarFigure([take, left], 0),
        );
      },
      captioned(partWholeBarFigure([24, 31], -1), "Parts 24 and 31; the whole is unknown.", "两部分是 24 和 31，总数未知。"),
    ),
  ],
  [
    "Zoe had some stickers. She gave away 15 and has 20 left. Put the two parts back together: she had 35.\n\nCheck: $35 - 15 = 20$.\n\nIn this lesson we find the unknown number in an addition or subtraction sentence by thinking of a whole and its parts.",
    "佐伊有一些贴纸。她送出 15 张，还剩 20 张。把两部分合起来：她原来有 35 张。\n\n检验：$35 - 15 = 20$。\n\n本课我们想着总数和两部分，求出加减算式中的未知数。",
  ],
);

const addingWithModels = earlyTopic(
  "adding-within-1000-with-models",
  ["Adding Within 1,000 With Blocks", "用积木计算 1000 以内的加法"],
  [
    "Add three-digit numbers by putting hundreds with hundreds, tens with tens and ones with ones.",
    "百和百、十和十、一和一放在一起，计算三位数加法。",
  ],
  ["adding-within-100", "expanded-form-up-to-1000"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "adding-to-the-blocks",
      ["Adding to the blocks", "往积木上加"],
      [
        "The blocks show 213. Add 152: hundreds $2 + 1 = 3$, tens $1 + 5 = 6$, ones $3 + 2 = 5$. The total is 365.\n\nCheck: $365 - 152 = 213$.\n\n> **Watch out.** Keep like blocks together. Do not add hundreds to tens.",
        "积木表示 213。加上 152：百 $2 + 1 = 3$，十 $1 + 5 = 6$，一 $3 + 2 = 5$。总数是 365。\n\n检验：$365 - 152 = 213$。\n\n> **注意。** 相同的积木放在一起。不要把百和十相加。",
      ],
      (rng) => {
        const [h, tens, single] = fittingBlocks(rng);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, 9 - h);
        const bt = rng.int(0, 9 - tens);
        const bo = rng.int(0, 9 - single);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n + b;
        return solved(
          [`These blocks show a number. Add $${b}$ to it. What is the total?`, `这些积木表示一个数。把它加上 $${b}$。总数是多少？`],
          answer,
          [
            [
              ["Read the blocks", "读积木"],
              [`The blocks show ${n}.`, `积木表示 ${n}。`],
            ],
            [
              ["Add each kind", "同种积木相加"],
              [
                `Hundreds ${h + bh}, tens ${tens + bt}, ones ${single + bo}.`,
                `百 ${h + bh} 个，十 ${tens + bt} 个，一 ${single + bo} 个。`,
              ],
              [`${n} + ${b} = ${answer}`],
            ],
          ],
          [`Take it back: $${answer} - ${b} = ${n}$.`, `倒回去验算：$${answer} - ${b} = ${n}$。`],
          [
            [b, "That is only the number added, without the blocks.", "这只是加上的数，漏了积木。"],
            [answer + 100, "That has one hundred too many.", "这多了一个百。"],
            [answer - 100, "That has one hundred too few.", "这少了一个百。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          blocksFigure(h, tens, single),
        );
      },
      captioned(blocksFigure(2, 1, 3), "213 in blocks, before 152 is added.", "用积木表示 213，还没加上 152。"),
    ),
    earlyPoint(
      "making-a-new-ten-with-three-digit-numbers",
      ["Making a new ten", "凑成新的十"],
      [
        "$136 + 247$: ones $6 + 7 = 13$, a new ten and 3 ones. Tens $3 + 4 + 1 = 8$. Hundreds $1 + 2 = 3$. The total is 383.\n\nCheck: $136 + 250 = 386$, and $386 - 3 = 383$.\n\n> **Watch out.** Put the new ten with the tens. 373 forgets it.",
        "$136 + 247$：个位 $6 + 7 = 13$，是一个新的十和 3 个一。十位 $3 + 4 + 1 = 8$。百位 $1 + 2 = 3$。总数是 383。\n\n检验：$136 + 250 = 386$，$386 - 3 = 383$。\n\n> **注意。** 新的十要放到十位上。373 就是把它忘了。",
      ],
      (rng) => {
        const h = rng.int(1, 3);
        const tens = rng.int(0, 7);
        const single = rng.int(3, 9);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, 5);
        const bt = rng.int(0, 8 - tens);
        const bo = rng.int(10 - single, 9);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n + b;
        const s = single + bo;
        return solved(
          [`These blocks show a number. Add $${b}$ to it. What is the total?`, `这些积木表示一个数。把它加上 $${b}$。总数是多少？`],
          answer,
          [
            [
              ["Add the ones", "先加个位"],
              [
                `The blocks show ${n}. The ones make a new ten and ${plural(s - 10, "one")}:`,
                `积木表示 ${n}。个位得一个新的十和 ${s - 10} 个一：`,
              ],
              [`${single} + ${bo} = ${s}`],
            ],
            [["Add the tens with the new ten", "十位加上新的十"], ["Tens:", "十位："], [`${tens} + ${bt} + 1 = ${tens + bt + 1}`]],
            [
              ["Add the hundreds", "百位相加"],
              [`Hundreds ${h} + ${bh} = ${h + bh}, so the total is ${answer}.`, `百位 ${h} + ${bh} = ${h + bh}，所以总数是 ${answer}。`],
            ],
          ],
          [`Take it back: $${answer} - ${b} = ${n}$.`, `倒回去验算：$${answer} - ${b} = ${n}$。`],
          [
            [answer - 10, "That forgets the new ten made from the ones.", "这忘了个位满十进的那个十。"],
            [answer + 10, "That adds the new ten twice.", "这把新的十加了两次。"],
            [answer + 100, "That has one hundred too many.", "这多了一个百。"],
          ],
          blocksFigure(h, tens, single),
        );
      },
      captioned(blocksFigure(1, 3, 6), "136 in blocks; adding 7 ones makes a new ten.", "用积木表示 136；再加 7 个一就凑成一个新的十。"),
    ),
  ],
  [
    "A farm has 245 hens and buys 132 more. Hundreds $2 + 1 = 3$, tens $4 + 3 = 7$, ones $5 + 2 = 7$. Now there are 377 hens.\n\nCheck: $377 - 132 = 245$.\n\nIn this lesson we add three-digit numbers by putting hundreds, tens and ones each with their own kind.",
    "农场有 245 只母鸡，又买来 132 只。百 $2 + 1 = 3$，十 $4 + 3 = 7$，一 $5 + 2 = 7$。现在有 377 只。\n\n检验：$377 - 132 = 245$。\n\n本课我们把百和百、十和十、一和一放在一起，计算三位数加法。",
  ],
);

const subtractingWithModels = earlyTopic(
  "subtracting-within-1000-with-models",
  ["Subtracting Within 1,000 With Blocks", "用积木计算 1000 以内的减法"],
  [
    "Subtract three-digit numbers by taking away blocks of each kind, opening a ten when needed.",
    "分别拿走每种积木来计算三位数减法，必要时打开一个十。",
  ],
  ["subtracting-within-100", "adding-within-1000-with-models"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "taking-away-from-the-blocks",
      ["Taking away from the blocks", "从积木中拿走"],
      [
        "The blocks show 375. Take away 142: hundreds $3 - 1 = 2$, tens $7 - 4 = 3$, ones $5 - 2 = 3$. 233 is left.\n\nCheck: $233 + 142 = 375$.\n\n> **Watch out.** Take each kind from its own kind. Do not take ones from the tens.",
        "积木表示 375。拿走 142：百 $3 - 1 = 2$，十 $7 - 4 = 3$，一 $5 - 2 = 3$。剩下 233。\n\n检验：$233 + 142 = 375$。\n\n> **注意。** 每种积木从同种积木里拿。不要从十里拿一。",
      ],
      (rng) => {
        const [hRaw, tens, single] = fittingBlocks(rng);
        const h = Math.max(2, hRaw);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, h - 1);
        const bt = rng.int(0, tens);
        const bo = rng.int(0, single);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n - b;
        return solved(
          [`These blocks show a number. Take away $${b}$. How much is left?`, `这些积木表示一个数。拿走 $${b}$。还剩多少？`],
          answer,
          [
            [
              ["Read the blocks", "读积木"],
              [`The blocks show ${n}.`, `积木表示 ${n}。`],
            ],
            [
              ["Take from each kind", "每种分别拿"],
              [
                `Hundreds ${h - bh}, tens ${tens - bt}, ones ${single - bo} are left.`,
                `剩下百 ${h - bh} 个，十 ${tens - bt} 个，一 ${single - bo} 个。`,
              ],
              [`${n} - ${b} = ${answer}`],
            ],
          ],
          [`Add back: $${answer} + ${b} = ${n}$.`, `加回去验算：$${answer} + ${b} = ${n}$。`],
          [
            [n + b, "That adds instead of taking away.", "这里应该减，却加了。"],
            [answer + 100, "That takes away one hundred too few.", "这少减了一个百。"],
            [answer + 10, "That takes away one ten too few.", "这少减了一个十。"],
          ],
          blocksFigure(h, tens, single),
        );
      },
      captioned(blocksFigure(3, 7, 5), "375 in blocks, before 142 is taken away.", "用积木表示 375，还没拿走 142。"),
    ),
    earlyPoint(
      "opening-a-ten-with-three-digit-numbers",
      ["Opening a ten", "打开一个十"],
      [
        "The blocks show 243. Take away 118. 3 ones is less than 8, so open a ten: 3 tens and 13 ones. Ones $13 - 8 = 5$, tens $3 - 1 = 2$, hundreds $2 - 1 = 1$. 125 is left.\n\nCheck: $125 + 118 = 243$.\n\n> **Watch out.** Do not take 3 from 8. 135 is wrong. Open a ten first.",
        "积木表示 243，拿走 118。3 个一比 8 少，打开一个十：3 个十和 13 个一。个位 $13 - 8 = 5$，十位 $3 - 1 = 2$，百位 $2 - 1 = 1$。剩下 125。\n\n检验：$125 + 118 = 243$。\n\n> **注意。** 不要用 8 减 3。135 是错的。要先打开一个十。",
      ],
      (rng) => {
        const h = rng.int(2, 4);
        const tens = rng.int(1, 5);
        const single = rng.int(0, 8);
        const n = 100 * h + 10 * tens + single;
        const bh = rng.int(1, h - 1);
        const bt = rng.int(0, tens - 1);
        const bo = rng.int(single + 1, 9);
        const b = 100 * bh + 10 * bt + bo;
        const answer = n - b;
        return solved(
          [`These blocks show a number. Take away $${b}$. How much is left?`, `这些积木表示一个数。拿走 $${b}$。还剩多少？`],
          answer,
          [
            [
              ["Open a ten", "打开一个十"],
              [
                `The blocks show ${n}. ${single} ones is less than ${bo}, so open a ten: ${tens - 1} tens and ${single + 10} ones.`,
                `积木表示 ${n}。${single} 个一比 ${bo} 少，打开一个十：${tens - 1} 个十和 ${single + 10} 个一。`,
              ],
            ],
            [["Take the ones", "个位相减"], ["Ones:", "个位："], [`${single + 10} - ${bo} = ${single + 10 - bo}`]],
            [
              ["Take the tens and hundreds", "十位和百位相减"],
              [
                `Tens ${tens - 1} - ${bt} = ${tens - 1 - bt}, hundreds ${h} - ${bh} = ${h - bh}. So ${answer} is left.`,
                `十位 ${tens - 1} - ${bt} = ${tens - 1 - bt}，百位 ${h} - ${bh} = ${h - bh}。剩下 ${answer}。`,
              ],
            ],
          ],
          [`Add back: $${answer} + ${b} = ${n}$.`, `加回去验算：$${answer} + ${b} = ${n}$。`],
          [
            [
              100 * (h - bh) + 10 * (tens - bt) + (bo - single),
              "That takes the smaller ones digit from the bigger one instead of opening a ten.",
              "这用大的个位减小的个位，没有打开一个十。",
            ],
            [answer + 10, "That forgets the ten that was opened.", "这忘了已经打开了一个十。"],
            [answer + 100, "That takes away one hundred too few.", "这少减了一个百。"],
          ],
          blocksFigure(h, tens, single),
        );
      },
      captioned(blocksFigure(2, 4, 3), "243 in blocks; one ten will be opened into ten ones.", "用积木表示 243；要把一个十打开成十个一。"),
    ),
  ],
  [
    "A library has 365 books and lends out 123. Hundreds $3 - 1 = 2$, tens $6 - 2 = 4$, ones $5 - 3 = 2$. 242 books are left on the shelves.\n\nCheck: $242 + 123 = 365$.\n\nIn this lesson we take away each kind of block from its own kind, opening a ten when we need to.",
    "图书馆有 365 本书，借出去 123 本。百 $3 - 1 = 2$，十 $6 - 2 = 4$，一 $5 - 3 = 2$。书架上还有 242 本。\n\n检验：$242 + 123 = 365$。\n\n本课我们从每种积木里拿走同种积木，需要时打开一个十。",
  ],
);

const wordProblems = earlyTopic(
  "word-problems-within-100",
  ["Word Problems Within 100", "100 以内的应用题"],
  [
    "Solve stories about adding to, taking from and missing starts, with numbers up to 100.",
    "解决 100 以内关于增加、减少和求原来有多少的应用题。",
  ],
  ["missing-numbers-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "adding-to-stories",
      ["Stories about adding to", "增加的故事"],
      [
        "Ben has 36 marbles and wins 25 more. The two amounts go together, so add: $36 + 25 = 61$.\n\nCheck: the answer is more than both 36 and 25, as it should be.\n\n> **Watch out.** Do not subtract just because the numbers are big. Getting more means adding.",
        "本有 36 颗弹珠，又赢了 25 颗。两部分合在一起，所以相加：$36 + 25 = 61$。\n\n检验：答案比 36 和 25 都大，正应该这样。\n\n> **注意。** 不要因为数大就去减。得到更多就是加。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(12, 58);
        const b = rng.int(11, 40);
        const answer = a + b;
        return solved(
          rng.bool()
            ? [
                `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [
                `There are ${a} ${thing.en} in one box and ${b} ${thing.en} in another. How many ${thing.en} are there in all?`,
                `一个盒子里有 ${a} ${thing.unit}${thing.zh}，另一个盒子里有 ${b} ${thing.unit}。一共有多少${thing.unit}${thing.zh}？`,
              ],
          answer,
          [
            [
              ["Decide what to do", "想好怎么算"],
              ["Two amounts go together, so add.", "两部分合在一起，所以用加法。"],
            ],
            [["Add", "相加"], ["Add the two amounts:", "把两个数相加："], [`${a} + ${b} = ${answer}`]],
          ],
          [`Take one part back off: $${answer} - ${b} = ${a}$.`, `去掉一部分验算：$${answer} - ${b} = ${a}$。`],
          [
            [Math.abs(a - b), "That subtracts. Putting together means adding.", "这是减法。合在一起应该用加法。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
            [answer - 10, "That forgets the new ten from the ones.", "这忘了个位满十进的那个十。"],
          ],
          partWholeBarFigure([a, b], -1),
        );
      },
      captioned(partWholeBarFigure([36, 25], -1), "Parts 36 and 25 make an unknown whole.", "两部分 36 和 25，总数未知。"),
    ),
    earlyPoint(
      "taking-from-stories",
      ["Stories about taking from", "减少的故事"],
      [
        "Ava has 54 stickers and gives away 21. Start with 54 and take away 21: $54 - 21 = 33$.\n\nCheck: $33 + 21 = 54$.\n\n> **Watch out.** The answer must be less than 54. If you get more, you added.",
        "艾娃有 54 张贴纸，送出 21 张。从 54 里减去 21：$54 - 21 = 33$。\n\n检验：$33 + 21 = 54$。\n\n> **注意。** 答案一定比 54 小。如果比 54 大，就是加错了。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const answer = rng.int(11, 50);
        const b = rng.int(11, 39);
        const a = answer + b;
        return solved(
          [
            `${name} has ${a} ${thing.en} and gives away ${b} of them. How many ${thing.en} does ${name} have left?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，送给别人 ${b} ${thing.unit}。${name} 还剩多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [
              ["Decide what to do", "想好怎么算"],
              ["Some are given away, so take them off.", "送出了一些，所以要减去。"],
            ],
            [["Subtract", "相减"], ["Start minus what is given away:", "开始的数减去送出的："], [`${a} - ${b} = ${answer}`]],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去验算：$${answer} + ${b} = ${a}$。`],
          [
            [a + b, "That adds. Giving away makes the amount smaller.", "这是加法。送出去数量会变少。"],
            [answer + 10, "That takes away one ten too few.", "这少减了一个十。"],
            [answer - 10, "That takes away one ten too many.", "这多减了一个十。"],
          ],
          partWholeBarFigure([b, answer], 1),
        );
      },
      captioned(partWholeBarFigure([21, 33], 1), "A whole of 54: 21 given away, the rest unknown.", "总数 54：送出 21，剩下的未知。"),
    ),
    earlyPoint(
      "stories-with-a-missing-start",
      ["Stories with a missing start", "求原来有多少的故事"],
      [
        "Kim gave away 18 cards and has 25 left. How many did she have? Put back what she gave: $25 + 18 = 43$.\n\nCheck: $43 - 18 = 25$.\n\n> **Watch out.** Gave away does not always mean subtract. Here we work back to the start, so we add.",
        "金送出 18 张卡片，还剩 25 张。她原来有几张？把送出的加回来：$25 + 18 = 43$。\n\n检验：$43 - 18 = 25$。\n\n> **注意。** 看到“送出”不一定用减法。这里是倒推原来有多少，所以要加。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const change = rng.int(11, 35);
        const start = change + rng.int(11, 50);
        const left = start - change;
        if (rng.bool())
          return solved(
            [
              `${name} gave away ${change} ${thing.en} and has ${left} left. How many ${thing.en} did ${name} have at the start?`,
              `${name} 送出 ${change} ${thing.unit}${thing.zh}，还剩 ${left} ${thing.unit}。${name} 原来有多少${thing.unit}${thing.zh}？`,
            ],
            start,
            [
              [
                ["Run the story backwards", "把故事倒过来想"],
                ["Put back what was given away.", "把送出去的放回来。"],
              ],
              [["Add", "相加"], ["What is left plus what was given:", "剩下的加上送出的："], [`${left} + ${change} = ${start}`]],
            ],
            [`Run it forward: $${start} - ${change} = ${left}$.`, `顺着再算一遍：$${start} - ${change} = ${left}$。`],
            [
              [
                Math.abs(left - change),
                "That subtracts. To find the start, put back what was given away.",
                "这是减法。求原来有多少，要把送出的加回来。",
              ],
              [start + 10, "That has one ten too many.", "这多了一个十。"],
              [start - 10, "That forgets the new ten from the ones.", "这忘了个位满十进的那个十。"],
            ],
            partWholeBarFigure([change, left], -1),
          );
        return solved(
          [
            `${name} got ${change} more ${thing.en} and now has ${start}. How many ${thing.en} did ${name} have at the start?`,
            `${name} 又得到 ${change} ${thing.unit}${thing.zh}，现在有 ${start} ${thing.unit}。${name} 原来有多少${thing.unit}${thing.zh}？`,
          ],
          left,
          [
            [
              ["Run the story backwards", "把故事倒过来想"],
              ["Take off what was added.", "去掉后来得到的。"],
            ],
            [["Subtract", "相减"], ["Now minus what was added:", "现在的数减去得到的："], [`${start} - ${change} = ${left}`]],
          ],
          [`Run it forward: $${left} + ${change} = ${start}$.`, `顺着再算一遍：$${left} + ${change} = ${start}$。`],
          [
            [start + change, "That adds. To find the start, take off what was added.", "这是加法。求原来有多少，要减去后来得到的。"],
            [left + 10, "That takes away one ten too few.", "这少减了一个十。"],
            [start, "That is how many there are now, not at the start.", "这是现在的数量，不是原来的。"],
          ],
          partWholeBarFigure([left, change], 0),
        );
      },
      captioned(partWholeBarFigure([18, 25], -1), "18 given away and 25 left; the start is unknown.", "送出 18，剩下 25，原来的数未知。"),
    ),
  ],
  [
    "A class collects 46 cans on Monday and 38 on Tuesday. Put them together: $46 + 38 = 84$ cans.\n\nCheck: $84 - 38 = 46$.\n\nIn this lesson we solve stories about adding to, taking from and finding the start.",
    "一个班星期一收集了 46 个罐子，星期二收集了 38 个。合起来：$46 + 38 = 84$ 个。\n\n检验：$84 - 38 = 46$。\n\n本课我们解决增加、减少和求原来有多少的故事。",
  ],
);

const comparingWordProblems = earlyTopic(
  "comparing-word-problems-within-100",
  ["Comparing Word Problems Within 100", "100 以内的比较应用题"],
  ["Solve stories that compare two amounts, with words like more and fewer.", "解决比较两个数量的应用题，题中有“多”和“少”这样的词。"],
  ["word-problems-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "how-many-more-or-fewer",
      ["How many more or fewer", "多多少或少多少"],
      [
        "Tom has 42 cards and Eva has 27. How many more does Tom have? The gap is $42 - 27 = 15$.\n\nCheck: $27 + 15 = 42$.\n\n> **Watch out.** More here does not mean add. 69 is the total, not the gap.",
        "汤姆有 42 张卡片，伊娃有 27 张。汤姆比伊娃多几张？差是 $42 - 27 = 15$。\n\n检验：$27 + 15 = 42$。\n\n> **注意。** 这里的“多”不是加法。69 是总数，不是差。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const small = rng.int(12, 50);
        const answer = rng.int(5, 39);
        const big = small + answer;
        const fewer = rng.bool();
        return solved(
          fewer
            ? [
                `${n1} has ${big} ${thing.en} and ${n2} has ${small}. How many fewer ${thing.en} does ${n2} have than ${n1}?`,
                `${n1} 有 ${big} ${thing.unit}${thing.zh}，${n2} 有 ${small} ${thing.unit}。${n2} 比 ${n1} 少多少${thing.unit}？`,
              ]
            : [
                `${n1} has ${small} ${thing.en} and ${n2} has ${big}. How many more ${thing.en} does ${n2} have than ${n1}?`,
                `${n1} 有 ${small} ${thing.unit}${thing.zh}，${n2} 有 ${big} ${thing.unit}。${n2} 比 ${n1} 多多少${thing.unit}？`,
              ],
          answer,
          [
            [
              ["Find the gap", "找出差"],
              [
                `Line the two amounts up. The extra part is the gap between ${big} and ${small}.`,
                `把两个数量并排摆。多出来的部分就是 ${big} 和 ${small} 的差。`,
              ],
            ],
            [["Subtract", "相减"], ["Larger minus smaller:", "大数减小数："], [`${big} - ${small} = ${answer}`]],
          ],
          [`Add the gap to the smaller amount: $${small} + ${answer} = ${big}$.`, `把差加到小数上：$${small} + ${answer} = ${big}$。`],
          [
            [big + small, "That is the total of both, not the gap.", "这是两人一共的数，不是差。"],
            [big, "That is the larger amount, not the gap.", "这是较大的数量，不是差。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          compareBarsFigure(["A", "B"], fewer ? [big, small] : [small, big], "gap"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [42, 27], "gap"),
        "Bar A is Tom's 42 and bar B is Eva's 27; the gap is unknown.",
        "长条 A 是汤姆的 42，长条 B 是伊娃的 27，差未知。",
      ),
    ),
    earlyPoint(
      "finding-an-amount-from-a-comparison",
      ["Finding an amount from a comparison", "由比较求数量"],
      [
        "Liam has 35 shells. Noah has 12 more than Liam. Noah has the longer bar, so add: $35 + 12 = 47$.\n\nCheck: $47 - 35 = 12$, the gap in the story.\n\n> **Watch out.** First ask who has more. If the known amount is the bigger one, you subtract.",
        "利亚姆有 35 个贝壳。诺亚比利亚姆多 12 个。诺亚的长条更长，所以相加：$35 + 12 = 47$。\n\n检验：$47 - 35 = 12$，正是故事里的差。\n\n> **注意。** 先问谁多。如果已知的是较多的那个，就要减。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const known = rng.int(25, 60);
        const diff = rng.int(5, 24);
        const more = rng.bool();
        const hidden = rng.bool();
        // In the "hidden" wording the known amount belongs to the person being compared, so the word and the operation disagree.
        const adds = hidden ? !more : more;
        const answer = adds ? known + diff : known - diff;
        const sign = adds ? "+" : "-";
        return solved(
          hidden
            ? [
                `${n1} has ${known} ${thing.en}. That is ${diff} ${more ? "more" : "fewer"} than ${n2} has. How many ${thing.en} does ${n2} have?`,
                `${n1} 有 ${known} ${thing.unit}${thing.zh}，比 ${n2} ${more ? "多" : "少"} ${diff} ${thing.unit}。${n2} 有多少${thing.unit}？`,
              ]
            : [
                `${n1} has ${known} ${thing.en}. ${n2} has ${diff} ${more ? "more" : "fewer"} than ${n1}. How many ${thing.en} does ${n2} have?`,
                `${n1} 有 ${known} ${thing.unit}${thing.zh}。${n2} 比 ${n1} ${more ? "多" : "少"} ${diff} ${thing.unit}。${n2} 有多少${thing.unit}？`,
              ],
          answer,
          [
            [
              ["Ask who has more", "先问谁多"],
              [`${n2} has ${adds ? "more" : "fewer"} than ${n1}.`, `${n2} 比 ${n1} ${adds ? "多" : "少"}。`],
            ],
            [
              [adds ? "Add the gap" : "Take away the gap", adds ? "加上差" : "减去差"],
              [adds ? "So add the gap:" : "So take the gap away:", adds ? "所以加上差：" : "所以减去差："],
              [`${known} ${sign} ${diff} = ${answer}`],
            ],
          ],
          [
            `The gap between ${known} and ${answer} is $${Math.max(known, answer)} - ${Math.min(known, answer)} = ${diff}$.`,
            `${known} 和 ${answer} 的差是 $${Math.max(known, answer)} - ${Math.min(known, answer)} = ${diff}$。`,
          ],
          [
            [
              adds ? known - diff : known + diff,
              `That goes the wrong way. ${n2} has ${adds ? "more" : "fewer"} than ${n1}.`,
              `方向反了。${n2} 比 ${n1} ${adds ? "多" : "少"}。`,
            ],
            [diff, "That is the gap, not the amount.", "这是差，不是数量。"],
            [known, `That is ${n1}'s amount, not ${n2}'s.`, `这是 ${n1} 的数量，不是 ${n2} 的。`],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          compareBarsFigure(["A", "B"], [known, answer], "second"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [35, 47], "second"),
        "Bar A is Liam's 35; bar B is 12 longer and unknown.",
        "长条 A 是利亚姆的 35；长条 B 长 12，数未知。",
      ),
    ),
  ],
  [
    "Mom buys 30 apples and 18 pears. Line them up one for one: 18 pairs match and 12 apples are extra. So there are 12 more apples.\n\nCheck: $18 + 12 = 30$.\n\nIn this lesson we solve stories that compare two amounts with more and fewer.",
    "妈妈买了 30 个苹果和 18 个梨。一个对一个排好：18 对配上了，还多出 12 个苹果。所以苹果多 12 个。\n\n检验：$18 + 12 = 30$。\n\n本课我们解决用“多”和“少”比较两个数量的故事。",
  ],
);

const twoStepWordProblems = earlyTopic(
  "two-step-word-problems-within-100",
  ["Two-Step Word Problems Within 100", "100 以内的两步应用题"],
  ["Solve stories that take two steps of adding or subtracting.", "解决需要两步加减的应用题。"],
  ["comparing-word-problems-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "one-change-after-another",
      ["One change after another", "接连两次变化"],
      [
        "Jo has 30 beads, gets 25 more, then uses 18. First $30 + 25 = 55$. Then $55 - 18 = 37$.\n\nCheck: the net change is $25 - 18 = 7$ more, and $30 + 7 = 37$.\n\n> **Watch out.** Do not stop after the first step. 55 is only halfway.",
        "乔有 30 颗珠子，又得到 25 颗，然后用掉 18 颗。先算 $30 + 25 = 55$，再算 $55 - 18 = 37$。\n\n检验：一共多了 $25 - 18 = 7$ 颗，$30 + 7 = 37$。\n\n> **注意。** 不要算完第一步就停。55 只是走了一半。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const start = rng.int(20, 50);
        const gain = rng.int(11, 35);
        const lose = rng.int(11, start + gain - 11);
        const answer = start + gain - lose;
        const loseFirst = rng.bool() && lose < start;
        const mid = loseFirst ? start - lose : start + gain;
        const net: Pair =
          gain >= lose
            ? [
                `The net change is $${gain} - ${lose} = ${gain - lose}$ more, and $${start} + ${gain - lose} = ${answer}$.`,
                `一共多了 $${gain} - ${lose} = ${gain - lose}$ ${thing.unit}，$${start} + ${gain - lose} = ${answer}$。`,
              ]
            : [
                `The net change is $${lose} - ${gain} = ${lose - gain}$ fewer, and $${start} - ${lose - gain} = ${answer}$.`,
                `一共少了 $${lose} - ${gain} = ${lose - gain}$ ${thing.unit}，$${start} - ${lose - gain} = ${answer}$。`,
              ];
        return solved(
          loseFirst
            ? [
                `${name} has ${start} ${thing.en}, gives away ${lose}, and then gets ${gain} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${start} ${thing.unit}${thing.zh}，送出 ${lose} ${thing.unit}，又得到 ${gain} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [
                `${name} has ${start} ${thing.en}, gets ${gain} more, and then gives away ${lose}. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${start} ${thing.unit}${thing.zh}，又得到 ${gain} ${thing.unit}，然后送出 ${lose} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ],
          answer,
          loseFirst
            ? [
                [["First change", "第一次变化"], ["Take off what is given away:", "减去送出的："], [`${start} - ${lose} = ${mid}`]],
                [["Second change", "第二次变化"], ["Add what is gained:", "加上得到的："], [`${mid} + ${gain} = ${answer}`]],
              ]
            : [
                [["First change", "第一次变化"], ["Add what is gained:", "加上得到的："], [`${start} + ${gain} = ${mid}`]],
                [["Second change", "第二次变化"], ["Take off what is given away:", "减去送出的："], [`${mid} - ${lose} = ${answer}`]],
              ],
          net,
          [
            [mid, "That stops after the first step.", "这只算了第一步。"],
            [start + gain + lose, "That adds what was given away instead of taking it off.", "送出的应该减，却加了。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          hopsFigure([start, mid, answer], true),
        );
      },
      captioned(
        hopsFigure([30, 55, 37]),
        "Two hops: up 25 from 30 to 55, then back 18 to 37.",
        "跳两次：从 30 往前跳 25 到 55，再往回跳 18 到 37。",
      ),
    ),
    earlyPoint(
      "putting-together-then-comparing",
      ["Putting together, then comparing", "先合起来，再比较"],
      [
        "Ann has 14 red and 23 blue pens. Ben has 45 pens. How many more does Ben have? First Ann's total: $14 + 23 = 37$. Then the gap: $45 - 37 = 8$.\n\nCheck: $37 + 8 = 45$.\n\n> **Watch out.** Compare Ben with Ann's total, not with one of her groups.",
        "安有 14 支红笔和 23 支蓝笔。本有 45 支笔。本比安多几支？先算安一共有：$14 + 23 = 37$。再求差：$45 - 37 = 8$。\n\n检验：$37 + 8 = 45$。\n\n> **注意。** 要用本的数和安的总数比，不是和她的其中一组比。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const a = rng.int(11, 35);
        const b = rng.int(11, 35);
        const answer = rng.int(4, 25);
        const other = a + b + answer;
        return solved(
          [
            `${n1} has ${a} ${thing.en} in one bag and ${b} in another. ${n2} has ${other} ${thing.en}. How many more ${thing.en} does ${n2} have than ${n1}?`,
            `${n1} 的一个袋子里有 ${a} ${thing.unit}${thing.zh}，另一个袋子里有 ${b} ${thing.unit}。${n2} 有 ${other} ${thing.unit}${thing.zh}。${n2} 比 ${n1} 多多少${thing.unit}？`,
          ],
          answer,
          [
            [["Put together", "先合起来"], [`${n1}'s total:`, `${n1} 一共有：`], [`${a} + ${b} = ${a + b}`]],
            [
              ["Compare", "再比较"],
              [`The gap between ${other} and ${a + b}:`, `${other} 和 ${a + b} 的差：`],
              [`${other} - ${a + b} = ${answer}`],
            ],
          ],
          [`$${a + b} + ${answer} = ${other}$.`, `$${a + b} + ${answer} = ${other}$。`],
          [
            [a + b, `That is ${n1}'s total, not the gap.`, `这是 ${n1} 的总数，不是差。`],
            [other - a, `That compares with one bag only, not ${n1}'s total.`, `这只和一个袋子比了，没有和 ${n1} 的总数比。`],
            [other - b, `That compares with one bag only, not ${n1}'s total.`, `这只和一个袋子比了，没有和 ${n1} 的总数比。`],
          ],
          compareBarsFigure(["A", "B"], [a + b, other], "gap"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [37, 45], "gap"),
        "Bar A is Ann's total 37 and bar B is Ben's 45; the gap is unknown.",
        "长条 A 是安的总数 37，长条 B 是本的 45，差未知。",
      ),
    ),
  ],
  [
    "A baker makes 40 rolls, sells 25, then bakes 30 more. First $40 - 25 = 15$, then $15 + 30 = 45$ rolls.\n\nCheck: $45 - 30 = 15$ and $15 + 25 = 40$.\n\nIn this lesson we solve stories that take two steps, one at a time.",
    "面包师做了 40 个面包，卖掉 25 个，又烤了 30 个。先算 $40 - 25 = 15$，再算 $15 + 30 = 45$ 个。\n\n检验：$45 - 30 = 15$，$15 + 25 = 40$。\n\n本课我们一步一步地解决需要两步的故事。",
  ],
);

/** gradeTwoNumberTopics are the number and operation topics of 2nd Grade Math, in teaching order. */
export const gradeTwoNumberTopics: readonly TopicDef[] = [
  skipCountingTwosFivesTens,
  evenAndOdd,
  arraysAndRepeatedAddition,
  understandingHundreds,
  skipCountingByHundreds,
  placeValueToThousand,
  expandedForm,
  numberNames,
  comparingToThousand,
  addingTenOrHundred,
  factsWithinTwenty,
  addingWithinHundred,
  subtractingWithinHundred,
  addingSeveral,
  missingNumbers,
  addingWithModels,
  subtractingWithModels,
  wordProblems,
  comparingWordProblems,
  twoStepWordProblems,
];
