// A third knowledge point for the 1st Grade Math topics that had two: the same idea
// run backwards, carried past a decade, or matched to a number sentence.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import {
  baseTenFigure,
  clockFigure,
  cutBarFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  jumpsFigure,
  lengthBarsFigure,
  numberLineFigure,
  polygonFigure,
  tallyFigure,
  tenFramesFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  blockRowsFigure,
  captioned,
  compareBarsFigure,
  factTriangleFigure,
  hopsFigure,
  type MathWrong,
  numberBondFigure,
  type Pair,
  partWholeBarFigure,
  picked,
  pickedMath,
  type Slip,
  solved,
  type Wrong,
} from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts, its generator and its figure. */
const skill = earlyPoint;

/** storyThing picks a name and a thing for a word problem. */
const storyThing = (rng: Rng) => ({ who: rng.pick(earlyNames), thing: rng.pick(earlyThings) });

/** clockHours are the hours a clock can show. */
const clockHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** run lists the numbers from `from` to `to`, one step at a time, for counting aloud. */
const run = (from: number, to: number): number[] => Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => from + (to >= from ? i : -i));

/** deeperGrade1ThirdPoints holds the third knowledge points of 1st Grade Math, by topic. */
export const deeperGrade1ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "counting-to-120": [
    skill(
      "the-number-that-comes-before",
      ["The number that comes before", "前一个数"],
      [
        "Count back from 70: 70, 69. The number just before 70 is 69. It is one less.\n\nCheck: count on from 69. The next number is 70.\n\n> **Watch out.** The number before 70 is not 60. Count back one, not ten.",
        "从 70 倒着数：70、69。紧挨在 70 前面的数是 69，比 70 少 1。\n\n检验：从 69 往后数，下一个数就是 70。\n\n> **注意。** 70 前面的数不是 60。要倒数一个，不是倒数十个。",
      ],
      (rng) => {
        const n = rng.bool() ? rng.int(2, 12) * 10 : rng.int(21, 120);
        const round = n % 10 === 0;
        const slips: Slip[] = [
          [n + 1, `That is the number after ${n}.`, `这是 ${n} 后面的数。`],
          [n - 10, "That is ten less, not one less.", "这是少 10，不是少 1。"],
          [n - 2, "That goes back two numbers.", "这倒数了两个。"],
        ];
        if (round)
          slips.unshift([
            n + 9,
            "This keeps the tens the same. Before a round number, the tens go down by one.",
            "这里十位没有变。整十数前面的数，十位要少 1。",
          ]);
        return solved(
          [`What number comes right before ${n}?`, `紧挨在 ${n} 前面的数是几？`],
          n - 1,
          [
            [
              ["Count back one", "倒着数一个"],
              [`Say ${n}, then the number before it: ${n - 1}.`, `先说 ${n}，再说它前面的数：${n - 1}。`],
            ],
            round
              ? [
                  ["Look at the digits", "看数位"],
                  [`${n} ends in 0, so the tens go down by one and the ones become 9.`, `${n} 的个位是 0，所以十位少 1，个位变成 9。`],
                ]
              : [
                  ["Look at the digits", "看数位"],
                  ["Only the ones digit goes down by one.", "只有个位少 1。"],
                ],
          ],
          [`Count on one from ${n - 1}: the next number is ${n}.`, `从 ${n - 1} 往后数一个，正好是 ${n}。`],
          slips,
        );
      },
      captioned(
        numberLineFigure(66, 72, 1, 69),
        "A number line from 66 to 72 with 69 marked, just before 70.",
        "从 66 到 72 的数轴，标出 70 前面的 69。",
      ),
    ),
  ],
  "reading-and-writing-numbers-to-120": [
    skill(
      "numbers-past-one-hundred",
      ["Numbers past one hundred", "一百多的数"],
      [
        "One hundred seven is 1 hundred, no tens and 7 ones. Write 1 for the hundred, 0 for the tens and 7 for the ones: 107.\n\nCheck: 107 is 7 more than 100.\n\n> **Watch out.** Do not write 1007. The 0 only holds the tens place.",
        "一百零七是 1 个百、0 个十和 7 个一。百位写 1，十位写 0，个位写 7：107。\n\n检验：107 比 100 多 7。\n\n> **注意。** 不要写成 1007。0 只是占住十位。",
      ],
      (rng) => {
        const n = rng.int(101, 120);
        const k = n - 100;
        const ones = [
          "",
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
          "twenty",
        ];
        const zh =
          k < 10
            ? `一百零${"一二三四五六七八九".charAt(n - 101)}`
            : n === 110
              ? "一百一十"
              : n === 120
                ? "一百二十"
                : `一百一十${"一二三四五六七八九".charAt(n - 111)}`;
        const prompt: Pair = rng.bool()
          ? [`What number has 1 hundred and ${k} more?`, `1 个百再加 ${k} 是多少？`]
          : [`Write this number with digits: one hundred ${ones[k]}.`, `用数字写出这个数：${zh}。`];
        const slips: Slip[] = [
          [
            Number(`100${k}`),
            `This writes 100 and then ${k} after it. The ${k} goes in the tens and ones.`,
            `这是先写 100 再接着写 ${k}。${k} 要写在十位和个位上。`,
          ],
          [k, "That leaves out the hundred.", "这漏掉了一百。"],
        ];
        if (k < 10)
          slips.push([
            100 + k * 10,
            `This puts the ${k} in the tens place. With no tens, write 0 there.`,
            `这把 ${k} 写在了十位。没有十，十位要写 0。`,
          ]);
        return solved(
          prompt,
          n,
          [
            [
              ["Write the hundred", "写百位"],
              ["The hundred is the 1 in front.", "一百就是最前面的 1。"],
            ],
            k < 10
              ? [
                  ["Write the tens and ones", "写十位和个位"],
                  [`There are no tens, so write 0, then ${k} ones: ${n}.`, `没有十，十位写 0，个位写 ${k}：${n}。`],
                ]
              : [
                  ["Write the tens and ones", "写十位和个位"],
                  [`${k} fills the tens and ones: ${n}.`, `后面两位写 ${k}：${n}。`],
                ],
          ],
          [`${n} is ${k} more than 100: $100 + ${k} = ${n}$.`, `${n} 比 100 多 ${k}：$100 + ${k} = ${n}$。`],
          slips,
        );
      },
      captioned(baseTenFigure(1, 0, 7), "1 hundred, no tens and 7 ones: 107.", "1 个百、没有十、7 个一：107。"),
    ),
  ],
  "ten-and-some-ones": [
    skill(
      "teen-numbers-from-ones-and-a-ten",
      ["Teen numbers told out of order", "打乱顺序说出的十几"],
      [
        "Six loose ones and one box of ten. The ten is still written first: 1 ten and 6 ones is 16.\n\nCheck: $10 + 6 = 16$.\n\n> **Watch out.** Do not write 61 because the 6 was said first. The ten always goes in the tens place.",
        "6 个散的和满满一盒 10 个。十还是要写在前面：1 个十和 6 个一是 16。\n\n检验：$10 + 6 = 16$。\n\n> **注意。** 不要因为先说了 6 就写成 61。十总是写在十位上。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const { who, thing } = storyThing(rng);
        return solved(
          [
            `${who} has ${a} loose ${thing.en} and one full box of ten ${thing.en}. How many ${thing.en} is that?`,
            `${who} 有 ${a} 个散装的${thing.zh}和满满一盒 10 个${thing.zh}。一共有多少个${thing.zh}？`,
          ],
          10 + a,
          [
            [
              ["Find the tens and ones", "找出十和一"],
              [`The box is 1 ten, and there are ${a} loose ones.`, `一盒是 1 个十，散的有 ${a} 个一。`],
            ],
            [
              ["Write the ten first", "先写十"],
              [`1 ten and ${a} ones is ${10 + a}.`, `1 个十和 ${a} 个一是 ${10 + a}。`],
            ],
          ],
          [`$10 + ${a} = ${10 + a}$.`, `$10 + ${a} = ${10 + a}$。`],
          [
            [a * 10 + 1, `That writes the ${a} first, as if it were ${a} tens.`, `这把 ${a} 写在了前面，好像有 ${a} 个十。`],
            [a, "That leaves out the box of ten.", "这漏掉了那一盒 10 个。"],
            [a + 1, "That counts the box as just one.", "这把一整盒当成了 1 个。"],
          ],
        );
      },
      captioned(baseTenFigure(0, 1, 6), "1 ten and 6 ones: 16.", "1 个十和 6 个一：16。"),
    ),
  ],
  "tens-and-ones": [
    skill(
      "more-than-nine-ones",
      ["More than nine ones", "超过九个一"],
      [
        "Here are 2 tens and 13 ones. Trade 10 of the ones for a ten. Now there are 3 tens and 3 ones, which is 33.\n\nCheck: $20 + 13 = 33$.\n\n> **Watch out.** Do not write 213. The ones place can hold only one digit.",
        "这里有 2 个十和 13 个一。把其中 10 个一换成 1 个十，就有 3 个十和 3 个一，也就是 33。\n\n检验：$20 + 13 = 33$。\n\n> **注意。** 不要写成 213。个位上只能写一个数字。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const ones = rng.int(10, 19);
        const n = tens * 10 + ones;
        return solved(
          [`What number is ${tens} tens and ${ones} ones?`, `${tens} 个十和 ${ones} 个一是多少？`],
          n,
          [
            [
              ["Trade ten ones", "十个一换一个十"],
              [
                `${ones} ones are 1 ten and ${ones - 10} ones, so now there are ${tens + 1} tens and ${ones - 10} ones.`,
                `${ones} 个一是 1 个十和 ${ones - 10} 个一，所以现在有 ${tens + 1} 个十和 ${ones - 10} 个一。`,
              ],
            ],
            [
              ["Read the number", "读出这个数"],
              [`${tens + 1} tens and ${ones - 10} ones is ${n}.`, `${tens + 1} 个十和 ${ones - 10} 个一是 ${n}。`],
            ],
          ],
          [`Add them as they are: $${tens * 10} + ${ones} = ${n}$.`, `直接相加：$${tens * 10} + ${ones} = ${n}$。`],
          [
            [Number(`${tens}${ones}`), `That writes ${ones} after the tens without trading.`, `这没有换，直接把 ${ones} 写在了十的后面。`],
            [tens + ones, "That adds the digits as if they were all ones.", "这把十也当成了一来加。"],
            [n - 10, "That drops the ten made by the trade.", "这把换来的那个十丢掉了。"],
          ],
        );
      },
      captioned(baseTenFigure(0, 2, 13), "2 tens and 13 ones.", "2 个十和 13 个一。"),
    ),
  ],
  "counting-groups-of-ten": [
    skill(
      "more-bags-to-reach-a-number",
      ["More bags to reach a number", "还需要几袋"],
      [
        "Ben has 30 and wants 70. Each bag holds 10. Count on by tens: 40, 50, 60, 70. That is 4 tens, so he needs 4 more bags.\n\nCheck: $30 + 40 = 70$.\n\n> **Watch out.** The answer is the number of bags, 4, not 40 things.",
        "小本有 30 个，想要 70 个。每袋 10 个。十个十个往后数：40、50、60、70。数了 4 个十，所以还需要 4 袋。\n\n检验：$30 + 40 = 70$。\n\n> **注意。** 问的是袋数，是 4 袋，不是 40 个。",
      ],
      (rng) => {
        const have = rng.int(1, 6);
        const more = rng.int(1, 12 - have);
        const { who, thing } = storyThing(rng);
        const steps = Array.from({ length: more }, (_, i) => (have + i + 1) * 10);
        return solved(
          [
            `${who} has ${have * 10} ${thing.en} and wants ${(have + more) * 10}. They come in bags of 10. How many more bags does ${who} need?`,
            `${who} 有 ${have * 10} 个${thing.zh}，想要 ${(have + more) * 10} 个。${thing.zh}每袋 10 个。${who} 还需要几袋？`,
          ],
          more,
          [
            [
              ["Count on by tens", "十个十个往后数"],
              [`From ${have * 10}: ${steps.join(", ")}.`, `从 ${have * 10} 开始：${steps.join("、")}。`],
            ],
            [
              ["Count the jumps", "数跳了几次"],
              [`That is ${more} tens, and each bag is one ten.`, `一共 ${more} 个十，每袋是 1 个十。`],
            ],
          ],
          [
            `$${have * 10} + ${more * 10} = ${(have + more) * 10}$, and ${more * 10} is ${more} bags of 10.`,
            `$${have * 10} + ${more * 10} = ${(have + more) * 10}$，${more * 10} 就是 ${more} 袋。`,
          ],
          [
            [more * 10, "That counts the things, not the bags.", "这数的是个数，不是袋数。"],
            [have + more, "That is how many bags in all, not how many more.", "这是一共的袋数，不是还需要的袋数。"],
            [more + 1, "That counts the starting number as a jump.", "这把起点也算成了一次。"],
          ],
        );
      },
      captioned(jumpsFigure(0, 80, 10, [30, 40, 50, 60, 70]), "Four jumps of ten from 30 to 70.", "从 30 到 70 跳了四次，每次 10。"),
    ),
  ],
  "comparing-two-digit-numbers": [
    skill(
      "the-number-in-the-middle",
      ["The number in the middle", "中间的数"],
      [
        "Put 52, 45 and 48 in order. Look at the tens first: 52 has 5 tens, so it is the largest. 45 and 48 both have 4 tens, so look at the ones: 45 is less. In order: 45, 48, 52.\n\nCheck: 48 is greater than 45 and less than 52.\n\n> **Watch out.** Do not compare the ones first. 52 is greater than 48, even though 2 is less than 8.",
        "把 52、45、48 排好顺序。先看十位：52 有 5 个十，最大。45 和 48 都有 4 个十，再看个位：45 小。顺序是 45、48、52。\n\n检验：48 比 45 大，比 52 小。\n\n> **注意。** 不要先比个位。虽然 2 比 8 小，但 52 比 48 大。",
      ],
      (rng) => {
        const [lo, mid, hi] = [...new Set(Array.from({ length: 9 }, () => rng.int(11, 99)))].sort((a, b) => a - b).slice(0, 3) as [
          number,
          number,
          number,
        ];
        const shown = rng.shuffle([lo, mid, hi]);
        return solved(
          [
            `Put ${shown[0]}, ${shown[1]} and ${shown[2]} in order. Which number is in the middle?`,
            `把 ${shown[0]}、${shown[1]}、${shown[2]} 排好顺序。中间的数是几？`,
          ],
          mid,
          [
            [
              ["Compare the tens first", "先比十位"],
              ["Look at the tens digits, and at the ones only when the tens are the same.", "先看十位，十位相同时再看个位。"],
            ],
            [
              ["Put them in order", "排好顺序"],
              [`From least to greatest: ${lo}, ${mid}, ${hi}.`, `从小到大：${lo}、${mid}、${hi}。`],
            ],
          ],
          [
            `${mid} is greater than ${lo} and less than ${hi}, so it sits between them.`,
            `${mid} 比 ${lo} 大，比 ${hi} 小，正好在它们中间。`,
          ],
          [
            [lo, "That is the smallest number.", "这是最小的数。"],
            [hi, "That is the largest number.", "这是最大的数。"],
            [shown[1] as number, "That is the middle of the list as written, before putting it in order.", "这是没排序时写在中间的数。"],
          ],
        );
      },
      captioned(
        numberLineFigure(44, 53, 1, 48),
        "A number line from 44 to 53 with 48 marked, between 45 and 52.",
        "从 44 到 53 的数轴，标出 45 和 52 之间的 48。",
      ),
    ),
  ],
  "counting-on-to-add": [
    skill(
      "how-many-were-counted-on",
      ["How many were counted on", "往后数了几个"],
      [
        "Start at 8 and count on to 12: 9, 10, 11, 12. You said 4 numbers, so 4 were counted on.\n\nCheck: $8 + 4 = 12$.\n\n> **Watch out.** Do not count the 8. Start with the number after it.",
        "从 8 开始往后数到 12：9、10、11、12。说了 4 个数，所以往后数了 4 个。\n\n检验：$8 + 4 = 12$。\n\n> **注意。** 8 不要数进去，要从它后面的数开始数。",
      ],
      (rng) => {
        const a = rng.int(3, 14);
        const b = rng.int(2, 6);
        const said = run(a + 1, a + b);
        return solved(
          [
            `Start at ${a} and count on until you say ${a + b}. How many numbers did you count on?`,
            `从 ${a} 开始往后数，一直数到 ${a + b}。往后数了几个数？`,
          ],
          b,
          [
            [
              ["Count on from the start", "从起点往后数"],
              [`After ${a} you say ${said.join(", ")}.`, `${a} 后面依次说 ${said.join("、")}。`],
            ],
            [
              ["Count the numbers said", "数说了几个数"],
              [`That is ${b} numbers.`, `一共说了 ${b} 个数。`],
            ],
          ],
          [`$${a} + ${b} = ${a + b}$.`, `$${a} + ${b} = ${a + b}$。`],
          [
            [b + 1, `That counts the starting number ${a} too.`, `这把起点 ${a} 也数进去了。`],
            [a + b, "That is where the count ended, not how many were counted.", "这是数到的数，不是数了几个。"],
            [a, "That is the starting number.", "这是起点。"],
          ],
        );
      },
      captioned(hopsFigure([8, 9, 10, 11, 12]), "Four hops of one from 8 to 12.", "从 8 到 12 跳了四次，每次 1。"),
    ),
  ],
  "counting-back-to-subtract": [
    skill(
      "where-the-count-started",
      ["Where the count started", "从哪里开始数的"],
      [
        "Mia counted back 3 and landed on 9. Go the other way: count forward 3 from 9, saying 10, 11, 12. She started at 12.\n\nCheck: count back 3 from 12: 11, 10, 9.\n\n> **Watch out.** Do not count back again. To undo going back, go forward.",
        "米娅倒着数了 3 个，落在 9 上。反过来，从 9 往后数 3 个：10、11、12。她是从 12 开始的。\n\n检验：从 12 倒着数 3 个：11、10、9。\n\n> **注意。** 不要再倒着数。要还原倒着数，就往后数。",
      ],
      (rng) => {
        const end = rng.int(2, 14);
        const b = rng.int(2, 5);
        const forward = run(end + 1, end + b);
        const back = run(end + b - 1, end);
        return solved(
          [
            `Mia counted back ${b} and landed on ${end}. Which number did Mia start from?`,
            `米娅倒着数了 ${b} 个，落在 ${end} 上。米娅是从几开始数的？`,
          ],
          end + b,
          [
            [
              ["Undo the count", "反过来数"],
              [`Mia went back ${b}, so go forward ${b} from ${end}.`, `米娅往回数了 ${b} 个，所以从 ${end} 往后数 ${b} 个。`],
            ],
            [
              ["Count forward", "往后数"],
              [`${forward.join(", ")}: the start was ${end + b}.`, `${forward.join("、")}：起点是 ${end + b}。`],
            ],
          ],
          [`Count back ${b} from ${end + b}: ${back.join(", ")}.`, `从 ${end + b} 倒着数 ${b} 个：${back.join("、")}。`],
          [
            [end - b, "That counts back again instead of forward.", "这又倒着数了，应该往后数。"],
            [end, "That is where Mia landed, not where she started.", "这是米娅落到的数，不是起点。"],
            [end + b + 1, "That counts one too many.", "多数了一个。"],
          ],
        );
      },
      captioned(hopsFigure([12, 11, 10, 9]), "Three hops back from 12 to 9.", "从 12 往回跳三次到 9。"),
    ),
  ],
  "making-ten-to-add": [
    skill(
      "the-same-sum-as-ten-and-some",
      ["The same sum as ten and some", "改写成十加几"],
      [
        "In $8 + 5$, the 8 needs 2 more to make ten. Move 2 from the 5 to the 8. That gives $10 + 3$.\n\nCheck: $8 + 5 = 13$ and $10 + 3 = 13$.\n\n> **Watch out.** The box is not 5. After 2 of the 5 move over, only 3 are left.",
        "在 $8 + 5$ 中，8 还差 2 凑成十。把 5 里的 2 移给 8，就得到 $10 + 3$。\n\n检验：$8 + 5 = 13$，$10 + 3 = 13$。\n\n> **注意。** 方框里不是 5。5 里的 2 移走以后，只剩 3。",
      ],
      (rng) => {
        const a = rng.int(6, 9);
        const b = rng.int(11 - a, 9);
        const left = a + b - 10;
        return solved(
          [`What number goes in the box? $$${a} + ${b} = 10 + \\square$$`, `方框里填几？$$${a} + ${b} = 10 + \\square$$`],
          left,
          [
            [
              ["Make ten", "凑十"],
              [`${a} needs ${10 - a} more to make 10. Take them from the ${b}.`, `${a} 还差 ${10 - a} 凑成 10，从 ${b} 里拿。`],
            ],
            [
              ["See what is left", "看还剩几"],
              [`The ${b} gave away ${10 - a}:`, `${b} 拿走了 ${10 - a}：`],
              [`${b} - ${10 - a} = ${left}`],
            ],
          ],
          [
            `Both sides make ${a + b}: $${a} + ${b} = ${a + b}$ and $10 + ${left} = ${a + b}$.`,
            `两边都是 ${a + b}：$${a} + ${b} = ${a + b}$，$10 + ${left} = ${a + b}$。`,
          ],
          [
            [a + b, "That is the whole sum. The 10 is already on the right side.", "这是整个和，右边已经有 10 了。"],
            [10 - a, "That is what moved over to make ten, not what is left.", "这是移过去凑十的数，不是剩下的数。"],
            [
              b,
              `That keeps all of the ${b}, but ${10 - a} of it went to make ten.`,
              `这把 ${b} 全留下了，可是其中 ${10 - a} 已经拿去凑十了。`,
            ],
          ],
        );
      },
      captioned(
        tenFramesFigure(8, 5),
        "8 counters and 5 counters: 2 of the 5 can fill the first ten frame.",
        "8 个和 5 个圆片：5 个里的 2 个可以把第一个十格填满。",
      ),
    ),
  ],
  "doubles-and-near-doubles": [
    skill(
      "the-double-in-the-middle",
      ["The double in the middle", "中间的双倍"],
      [
        "In $6 + 8$, take 1 from the 8 and give it to the 6. Now it is $7 + 7$, and that double is 14.\n\nCheck: use the double $6 + 6 = 12$. The 8 is 2 more than 6, so the sum is $12 + 2 = 14$.\n\n> **Watch out.** Use the number in the middle, 7. The doubles $6 + 6$ and $8 + 8$ are not the same sum.",
        "在 $6 + 8$ 中，从 8 里拿 1 给 6，就变成 $7 + 7$，这个双倍是 14。\n\n检验：用双倍 $6 + 6 = 12$。8 比 6 多 2，所以和是 $12 + 2 = 14$。\n\n> **注意。** 要用中间的数 7。$6 + 6$ 和 $8 + 8$ 的和都不一样。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const [x, y] = rng.bool() ? [a, a + 2] : [a + 2, a];
        const m = a + 1;
        if (rng.bool())
          return solved(
            [
              `What number goes in the box? $$${x} + ${y} = \\square + \\square$$ Both boxes hold the same number.`,
              `方框里填几？$$${x} + ${y} = \\square + \\square$$ 两个方框里的数相同。`,
            ],
            m,
            [
              [
                ["Find the middle number", "找中间的数"],
                [`${m} is between ${a} and ${a + 2}.`, `${m} 在 ${a} 和 ${a + 2} 中间。`],
              ],
              [
                ["Move one", "移一个"],
                [`Move 1 from ${a + 2} to ${a}: both become ${m}.`, `把 ${a + 2} 中的 1 移给 ${a}：两个数都变成 ${m}。`],
              ],
            ],
            [
              `$${m} + ${m} = ${2 * m}$ and $${x} + ${y} = ${2 * m}$, the same sum.`,
              `$${m} + ${m} = ${2 * m}$，$${x} + ${y} = ${2 * m}$，和相同。`,
            ],
            [
              [a, `That is the smaller number. ${a} + ${a} is 2 too small.`, `这是小的那个数，${a} + ${a} 少了 2。`],
              [a + 2, `That is the larger number. ${a + 2} + ${a + 2} is 2 too big.`, `这是大的那个数，${a + 2} + ${a + 2} 多了 2。`],
              [2 * m, "That is the sum, not the number in each box.", "这是和，不是每个方框里的数。"],
            ],
          );
        return solved(
          [`Think of the double in the middle. What is $${x} + ${y}$?`, `想想中间的双倍。$${x} + ${y}$ 是多少？`],
          2 * m,
          [
            [
              ["Find the double", "找双倍"],
              [`Move 1 from the larger to the smaller:`, `从大的数拿 1 给小的数：`],
              [`${x} + ${y} = ${m} + ${m}`],
            ],
            [["Add the double", "算双倍"], ["Now add:", "再相加："], [`${m} + ${m} = ${2 * m}`]],
          ],
          [
            `Use the double of ${a}: $${a} + ${a} = ${2 * a}$, and 2 more is ${2 * m}.`,
            `用 ${a} 的双倍：$${a} + ${a} = ${2 * a}$，再多 2 就是 ${2 * m}。`,
          ],
          [
            [2 * a, `That is the double of ${a}. The other number is 2 more.`, `这是 ${a} 的双倍，另一个数还多 2。`],
            [2 * a + 4, `That is the double of ${a + 2}. The other number is 2 less.`, `这是 ${a + 2} 的双倍，另一个数少 2。`],
            [2 * a + 1, `That is 1 short of the double ${m} + ${m}.`, `这比双倍 ${m} + ${m} 少了 1。`],
          ],
        );
      },
      captioned(numberLineFigure(5, 9, 1, 7), "6, 7 and 8 on a number line: 7 is in the middle.", "数轴上的 6、7、8：7 在中间。"),
    ),
  ],
  "adding-in-any-order": [
    skill(
      "three-addends-in-any-order",
      ["Three addends in any order", "三个加数换顺序"],
      [
        "Look at $2 + 5 + 4 = 4 + 2 + \\square$. The right side already has the 4 and the 2. The one still missing is 5.\n\nCheck: $2 + 5 + 4 = 11$ and $4 + 2 + 5 = 11$.\n\n> **Watch out.** The box is not 11. It holds one addend, not the sum.",
        "看 $2 + 5 + 4 = 4 + 2 + \\square$。右边已经有 4 和 2，还缺的是 5。\n\n检验：$2 + 5 + 4 = 11$，$4 + 2 + 5 = 11$。\n\n> **注意。** 方框里不是 11。方框里是一个加数，不是和。",
      ],
      (rng) => {
        const [a, b, c] = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3) as [number, number, number];
        return solved(
          [
            `What number goes in the box? $$${a} + ${b} + ${c} = ${c} + ${a} + \\square$$`,
            `方框里填几？$$${a} + ${b} + ${c} = ${c} + ${a} + \\square$$`,
          ],
          b,
          [
            [
              ["Match the addends", "对一对加数"],
              [`The right side already has ${c} and ${a}.`, `右边已经有 ${c} 和 ${a}。`],
            ],
            [
              ["Find the one missing", "找出缺的那个"],
              [`The left side also has ${b}, so the box is ${b}.`, `左边还有 ${b}，所以方框里是 ${b}。`],
            ],
          ],
          [
            `Both sides make ${a + b + c}: $${c} + ${a} + ${b} = ${a + b + c}$.`,
            `两边都是 ${a + b + c}：$${c} + ${a} + ${b} = ${a + b + c}$。`,
          ],
          [
            [a + b + c, "That is the whole sum, not one addend.", "这是整个和，不是一个加数。"],
            [a, `${a} is already on the right side.`, `${a} 已经在右边了。`],
            [c, `${c} is already on the right side.`, `${c} 已经在右边了。`],
          ],
        );
      },
      captioned(partWholeBarFigure([2, 5, 4], 9), "A bar of 11 made of 2, 5 and 4.", "由 2、5、4 组成的 11。"),
    ),
  ],
  "adding-three-numbers-within-20": [
    skill(
      "the-missing-third-number",
      ["The missing third number", "缺少的第三个数"],
      [
        "Look at $4 + 3 + \\square = 12$. First $4 + 3 = 7$. From 7 to 12 is 5, so the box is 5.\n\nCheck: $4 + 3 + 5 = 12$.\n\n> **Watch out.** The box is not 7. Seven is what the first two numbers make.",
        "看 $4 + 3 + \\square = 12$。先算 $4 + 3 = 7$。从 7 到 12 是 5，所以方框里是 5。\n\n检验：$4 + 3 + 5 = 12$。\n\n> **注意。** 方框里不是 7。7 是前两个数的和。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const c = rng.int(2, 6);
        const total = a + b + c;
        return solved(
          [`What number goes in the box? $$${a} + ${b} + \\square = ${total}$$`, `方框里填几？$$${a} + ${b} + \\square = ${total}$$`],
          c,
          [
            [["Add the two you know", "先加已知的两个数"], ["First:", "先算："], [`${a} + ${b} = ${a + b}`]],
            [
              ["Find what is still needed", "求还差多少"],
              [`From ${a + b} to ${total}:`, `从 ${a + b} 到 ${total}：`],
              [`${total} - ${a + b} = ${c}`],
            ],
          ],
          [`$${a} + ${b} + ${c} = ${total}$.`, `$${a} + ${b} + ${c} = ${total}$。`],
          [
            [a + b, "That is what the first two numbers make.", "这是前两个数的和。"],
            [total - a, `This takes away only ${a}. Take away ${b} too.`, `这只减去了 ${a}，还要减去 ${b}。`],
            [total, "That is the total.", "这是总数。"],
          ],
        );
      },
      captioned(partWholeBarFigure([4, 3, 5], 2), "A bar of 12 cut into 4, 3 and an unknown part.", "12 分成 4、3 和一个未知的部分。"),
    ),
  ],
  "subtracting-through-ten": [
    skill(
      "counting-up-to-subtract",
      ["Counting up to subtract", "往上数做减法"],
      [
        "For $13 - 8$, count up from 8. From 8 to 10 is 2. From 10 to 13 is 3. Together that is $2 + 3 = 5$.\n\nCheck: $8 + 5 = 13$.\n\n> **Watch out.** Add both hops. The 2 alone or the 3 alone is only part of the way.",
        "算 $13 - 8$，从 8 往上数。从 8 到 10 是 2，从 10 到 13 是 3。合起来是 $2 + 3 = 5$。\n\n检验：$8 + 5 = 13$。\n\n> **注意。** 两段都要加上。只算 2 或只算 3，都只走了一部分。",
      ],
      (rng) => {
        const b = rng.int(6, 9);
        const a = rng.int(11, 10 + b - 1);
        return solved(
          [
            `Count up from ${b} through 10 to ${a}. How far is it from ${b} to ${a}?`,
            `从 ${b} 经过 10 往上数到 ${a}。从 ${b} 到 ${a} 相差多少？`,
          ],
          a - b,
          [
            [
              ["Count up to 10", "先数到 10"],
              [`From ${b} to 10 is ${10 - b}.`, `从 ${b} 到 10 是 ${10 - b}。`],
            ],
            [
              [`Count on to ${a}`, `再数到 ${a}`],
              [`From 10 to ${a} is ${a - 10}. Add the two hops:`, `从 10 到 ${a} 是 ${a - 10}。把两段加起来：`],
              [`${10 - b} + ${a - 10} = ${a - b}`],
            ],
          ],
          [`$${b} + ${a - b} = ${a}$, so $${a} - ${b} = ${a - b}$.`, `$${b} + ${a - b} = ${a}$，所以 $${a} - ${b} = ${a - b}$。`],
          [
            [10 - b, "That is only the hop up to 10.", "这只是到 10 的那一段。"],
            [a - 10, "That is only the hop from 10.", "这只是从 10 开始的那一段。"],
            [a + b, "That adds the numbers instead of finding how far apart they are.", "这是把两个数加起来了，不是求相差多少。"],
          ],
        );
      },
      captioned(hopsFigure([8, 10, 13]), "Hops from 8 up to 10 and from 10 up to 13.", "从 8 跳到 10，再从 10 跳到 13。"),
    ),
  ],
  "related-addition-and-subtraction-facts": [
    skill(
      "completing-a-fact-family",
      ["Completing a fact family", "补全算式家族"],
      [
        "$6 + 7 = 13$. In $13 - \\square = 6$, 13 is the whole and 6 is one part. The box is the other part, 7.\n\nCheck: $13 - 7 = 6$.\n\n> **Watch out.** The box is not 6. Taking 6 away from 13 leaves 7, not 6.",
        "$6 + 7 = 13$。在 $13 - \\square = 6$ 中，13 是整体，6 是一个部分。方框里是另一个部分 7。\n\n检验：$13 - 7 = 6$。\n\n> **注意。** 方框里不是 6。13 减去 6 剩下 7，不是 6。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        return solved(
          [
            `These facts are in one family: $${a} + ${b} = ${a + b}$ and $${a + b} - \\square = ${a}$. What number goes in the box?`,
            `这些算式属于同一个家族：$${a} + ${b} = ${a + b}$ 和 $${a + b} - \\square = ${a}$。方框里填几？`,
          ],
          b,
          [
            [
              ["Find the whole and the parts", "找整体和部分"],
              [`${a + b} is the whole, and ${a} and ${b} are its parts.`, `${a + b} 是整体，${a} 和 ${b} 是它的两部分。`],
            ],
            [
              ["Take away the other part", "去掉另一部分"],
              [`To leave ${a}, take away ${b}:`, `要剩下 ${a}，就去掉 ${b}：`],
              [`${a + b} - ${b} = ${a}`],
            ],
          ],
          [`Add back: $${a} + ${b} = ${a + b}$.`, `加回去验算：$${a} + ${b} = ${a + b}$。`],
          [
            [a, `Taking ${a} away would leave ${b}, not ${a}.`, `去掉 ${a} 会剩下 ${b}，不是 ${a}。`],
            [a + b, "That is the whole.", "这是整体。"],
            [b + 1, "That takes away one too many.", "这多去掉了一个。"],
          ],
        );
      },
      captioned(
        factTriangleFigure(13, 6, 7),
        "A fact triangle with 13 on top and 6 and 7 below.",
        "算式三角形：上面是 13，下面是 6 和 7。",
      ),
    ),
  ],
  "missing-addends-within-20": [
    skill(
      "the-box-at-the-start-of-a-subtraction",
      ["The box at the start of a subtraction", "减法开头的方框"],
      [
        "In $\\square - 4 = 9$, the box is the whole: taking 4 away left 9. Put the parts back together: $9 + 4 = 13$.\n\nCheck: $13 - 4 = 9$.\n\n> **Watch out.** Do not subtract here. $9 - 4 = 5$, and taking 4 from 5 leaves 1, not 9.",
        "在 $\\square - 4 = 9$ 中，方框是整体：去掉 4 后剩下 9。把两部分合起来：$9 + 4 = 13$。\n\n检验：$13 - 4 = 9$。\n\n> **注意。** 这里不能用减法。$9 - 4 = 5$，而 5 去掉 4 只剩 1，不是 9。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const c = rng.int(2, 10);
        return solved(
          [`What number goes in the box? $$\\square - ${b} = ${c}$$`, `方框里填几？$$\\square - ${b} = ${c}$$`],
          b + c,
          [
            [
              ["Find the whole", "找整体"],
              [`The box is the whole, and ${b} and ${c} are its parts.`, `方框是整体，${b} 和 ${c} 是它的两部分。`],
            ],
            [["Put the parts together", "把部分合起来"], ["Add:", "相加："], [`${c} + ${b} = ${b + c}`]],
          ],
          [`$${b + c} - ${b} = ${c}$.`, `$${b + c} - ${b} = ${c}$。`],
          [
            [Math.abs(c - b), "That subtracts. The box is the whole, so add.", "这是减。方框是整体，要用加法。"],
            [c, "That is what was left, not the start.", "这是剩下的数，不是开始的数。"],
            [b, "That is what was taken away.", "这是去掉的数。"],
          ],
        );
      },
      captioned(partWholeBarFigure([9, 4], -1), "A bar with parts 9 and 4 and an unknown whole.", "两部分是 9 和 4，整体未知。"),
    ),
  ],
  "the-equal-sign": [
    skill(
      "subtraction-on-one-side",
      ["Subtraction on one side", "一边是减法"],
      [
        "Look at $12 - 3 = \\square + 4$. The left side is 9. What and 4 make 9? 5 does.\n\nCheck: $5 + 4 = 9$ and $12 - 3 = 9$.\n\n> **Watch out.** The box is not 9. Nine is the value of each side, and the right side still adds 4 to the box.",
        "看 $12 - 3 = \\square + 4$。左边等于 9。几加 4 等于 9？是 5。\n\n检验：$5 + 4 = 9$，$12 - 3 = 9$。\n\n> **注意。** 方框里不是 9。9 是每一边的值，右边还要在方框上加 4。",
      ],
      (rng) => {
        const a = rng.int(9, 18);
        const b = rng.int(2, 7);
        const c = rng.int(1, a - b - 1);
        const side = a - b;
        return solved(
          [`What number goes in the box? $$${a} - ${b} = \\square + ${c}$$`, `方框里填几？$$${a} - ${b} = \\square + ${c}$$`],
          side - c,
          [
            [["Work out the full side", "先算完整的一边"], ["The left side:", "左边："], [`${a} - ${b} = ${side}`]],
            [
              ["Make the other side match", "让另一边相等"],
              [`What and ${c} make ${side}?`, `几加 ${c} 等于 ${side}？`],
              [`${side} - ${c} = ${side - c}`],
            ],
          ],
          [`$${side - c} + ${c} = ${side}$, the same as $${a} - ${b}$.`, `$${side - c} + ${c} = ${side}$，和 $${a} - ${b}$ 一样。`],
          [
            [side, `That is the value of the left side. The right side adds ${c} more.`, `这是左边的值，右边还要再加 ${c}。`],
            [side + c, `That adds ${c} instead of taking it away.`, `这里应该减去 ${c}，却加了。`],
            [a - c, `This leaves out the ${b} taken away on the left.`, `这漏掉了左边减去的 ${b}。`],
          ],
        );
      },
      captioned(numberBondFigure(9, null, 4), "9 split into an unknown part and 4.", "9 分成一个未知的数和 4。"),
    ),
  ],
  "adding-to-word-problems": [
    skill(
      "the-sentence-that-tells-the-story",
      ["The sentence that tells the story", "与故事相符的算式"],
      [
        "Ana has 7 shells and finds 5 more. More came, so the amounts join: $7 + 5 = \\square$.\n\nCheck: after finding more, Ana should have more than 7, and $7 + 5 = 12$ is more than 7.\n\n> **Watch out.** Do not take away. Getting more makes the number grow.",
        "安娜有 7 个贝壳，又找到 5 个。又来了一些，就把两部分合起来：$7 + 5 = \\square$。\n\n检验：又找到一些以后，安娜的贝壳应该比 7 个多，$7 + 5 = 12$，确实比 7 多。\n\n> **注意。** 不要用减法。又得到一些，数量会变多。",
      ],
      (rng) => {
        const a = rng.int(4, 12);
        const b = rng.int(2, 8);
        const { who, thing } = storyThing(rng);
        const wrong: MathWrong[] = [
          [`${a} - ${b} = \\square`, "This takes away, but the story gets more.", "这是减，但故事里是又得到了一些。"],
          [
            `${a} + \\square = ${b}`,
            `This makes ${b} the total, but ${b} is how many more came.`,
            `这把 ${b} 当成了总数，但 ${b} 是又得到的数量。`,
          ],
          [
            `\\square - ${b} = ${a}`,
            "This starts from the total and takes away, but the story starts with what is there and adds.",
            "这是从总数开始减，但故事是从原有的数量开始加。",
          ],
        ];
        return pickedMath(
          rng,
          [
            `${who} has ${a} ${thing.en} and gets ${b} more. Which number sentence tells this story?`,
            `${who} 有 ${a} 个${thing.zh}，又得到 ${b} 个。哪个算式与这个故事相符？`,
          ],
          `${a} + ${b} = \\square`,
          wrong,
          [
            [
              ["See what happens", "看故事里发生了什么"],
              [`${who} gets ${b} more, so the two amounts join.`, `${who} 又得到 ${b} 个，两部分要合起来。`],
            ],
            [
              ["Write the sentence", "写出算式"],
              [`Start with ${a}, add ${b}, and the total is unknown:`, `从 ${a} 开始，加上 ${b}，总数未知：`],
              [`${a} + ${b} = \\square`],
            ],
          ],
          [
            `The total, ${a + b}, is more than ${a}, as it should be after getting more.`,
            `总数 ${a + b} 比 ${a} 多，又得到一些后本来就该变多。`,
          ],
        );
      },
      captioned(partWholeBarFigure([7, 5], -1), "A bar of 7 and 5 joined, with the total unknown.", "7 和 5 合在一起，总数未知。"),
    ),
  ],
  "taking-away-word-problems": [
    skill(
      "the-sentence-for-taking-away",
      ["The sentence for taking away", "表示拿走的算式"],
      [
        "Ben has 10 apples and gives away 4. Start with the whole and take away: $10 - 4 = \\square$.\n\nCheck: 6 are left, and $6 + 4 = 10$ puts the apples back together.\n\n> **Watch out.** Write the whole first. $4 - 10$ has the numbers the wrong way round.",
        "小本有 10 个苹果，送出 4 个。从整体开始减：$10 - 4 = \\square$。\n\n检验：剩下 6 个，$6 + 4 = 10$，合起来又是原来的苹果。\n\n> **注意。** 整体要写在前面。$4 - 10$ 把两个数写反了。",
      ],
      (rng) => {
        const a = rng.int(9, 20);
        const b = rng.int(2, a - 2);
        const { who, thing } = storyThing(rng);
        const wrong: MathWrong[] = [
          [`${a} + ${b} = \\square`, "This adds, but the story gives some away.", "这是加，但故事里是送出了一些。"],
          [
            `${b} - ${a} = \\square`,
            `This takes ${a} from ${b}. The whole, ${a}, comes first.`,
            `这是从 ${b} 里减 ${a}。整体 ${a} 要写在前面。`,
          ],
          [`\\square + ${a} = ${b}`, `This makes ${b} the total, but ${a} is the whole.`, `这把 ${b} 当成了总数，可整体是 ${a}。`],
        ];
        return pickedMath(
          rng,
          [
            `${who} has ${a} ${thing.en} and gives away ${b}. Which number sentence tells this story?`,
            `${who} 有 ${a} 个${thing.zh}，送出 ${b} 个。哪个算式与这个故事相符？`,
          ],
          `${a} - ${b} = \\square`,
          wrong,
          [
            [
              ["Find the whole", "找整体"],
              [`${who} starts with all ${a}.`, `${who} 一开始有 ${a} 个，这是整体。`],
            ],
            [
              ["Take away what leaves", "减去送出的"],
              [`${b} are given away, and what is left is unknown:`, `送出 ${b} 个，剩下的未知：`],
              [`${a} - ${b} = \\square`],
            ],
          ],
          [
            `What is left and what was given away make the whole: $${a - b} + ${b} = ${a}$.`,
            `剩下的和送出的合起来是整体：$${a - b} + ${b} = ${a}$。`,
          ],
        );
      },
      captioned(
        partWholeBarFigure([6, 4], 0),
        "10 apples in all: 4 given away and an unknown number left.",
        "一共 10 个苹果：送出 4 个，剩下的未知。",
      ),
    ),
  ],
  "comparing-word-problems-within-20": [
    skill(
      "how-many-more-to-have-the-same",
      ["How many more to have the same", "再要多少才一样多"],
      [
        "Sam has 7 and Lily has 11. Sam counts on to 11: 8, 9, 10, 11. That is 4, so Sam needs 4 more.\n\nCheck: $11 - 7 = 4$.\n\n> **Watch out.** Do not add 7 and 11. Sam needs only the difference.",
        "小山有 7 个，莉莉有 11 个。小山往后数到 11：8、9、10、11，数了 4 个，所以小山还需要 4 个。\n\n检验：$11 - 7 = 4$。\n\n> **注意。** 不要把 7 和 11 加起来。小山只需要相差的那部分。",
      ],
      (rng) => {
        const a = rng.int(3, 12);
        const b = a + rng.int(2, 8);
        const [p, q] = rng.shuffle(earlyNames).slice(0, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `${p} has ${a} ${thing.en} and ${q} has ${b}. How many more ${thing.en} does ${p} need to have as many as ${q}?`,
            `${p} 有 ${a} 个${thing.zh}，${q} 有 ${b} 个。${p} 还需要多少个${thing.zh}才能和 ${q} 一样多？`,
          ],
          b - a,
          [
            [
              ["Compare the two", "比一比"],
              [`${q} has ${b}, which is more than ${p}'s ${a}.`, `${q} 有 ${b} 个，比 ${p} 的 ${a} 个多。`],
            ],
            [
              ["Find the difference", "求相差多少"],
              [`${p} must go from ${a} up to ${b}:`, `${p} 要从 ${a} 增加到 ${b}：`],
              [`${b} - ${a} = ${b - a}`],
            ],
          ],
          [`Count on: $${a} + ${b - a} = ${b}$.`, `往后数验算：$${a} + ${b - a} = ${b}$。`],
          [
            [a + b, "That adds the two amounts.", "这是把两人的数量加起来了。"],
            [b, `That is how many ${q} has.`, `这是 ${q} 有的数量。`],
            [a, `That is how many ${p} has.`, `这是 ${p} 有的数量。`],
          ],
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [7, 11], "gap"),
        "Bar A is Sam's 7 and bar B is Lily's 11: the gap is how many more Sam needs.",
        "A 条是小山的 7 个，B 条是莉莉的 11 个：差的那段就是小山还需要的。",
      ),
    ),
  ],
  "word-problems-with-a-missing-part": [
    skill(
      "how-many-went-away",
      ["How many went away", "去掉了多少"],
      [
        "Kim had 12 stickers and gave some away. Now she has 5. From 5 up to 12 is 7, so she gave away 7.\n\nCheck: $12 - 7 = 5$.\n\n> **Watch out.** 5 is what is left, not what went away.",
        "金有 12 张贴纸，送出了一些，现在还有 5 张。从 5 往上数到 12 是 7，所以她送出了 7 张。\n\n检验：$12 - 7 = 5$。\n\n> **注意。** 5 是剩下的，不是送出的。",
      ],
      (rng) => {
        const a = rng.int(9, 20);
        const left = rng.int(2, a - 2);
        const { who, thing } = storyThing(rng);
        return solved(
          [
            `${who} had ${a} ${thing.en} and gave some away. Now ${who} has ${left} left. How many did ${who} give away?`,
            `${who} 原来有 ${a} 个${thing.zh}，送出了一些，现在还剩 ${left} 个。${who} 送出了多少个？`,
          ],
          a - left,
          [
            [
              ["Find the whole and the part", "找整体和部分"],
              [`The start, ${a}, is the whole, and ${left} is the part left.`, `开始的 ${a} 个是整体，剩下的 ${left} 个是一部分。`],
            ],
            [["Subtract", "相减"], ["The other part went away:", "另一部分就是送出的："], [`${a} - ${left} = ${a - left}`]],
          ],
          [`$${left} + ${a - left} = ${a}$, the number at the start.`, `$${left} + ${a - left} = ${a}$，正好是开始的数。`],
          [
            [a + left, "That adds instead of finding the part given away.", "这是加，应该求送出的部分。"],
            [left, "That is what is left.", "这是剩下的数。"],
            [a, "That is the number at the start.", "这是开始的数。"],
          ],
        );
      },
      captioned(partWholeBarFigure([5, 7], 1), "A bar of 12: 5 left and an unknown part given away.", "12 分成剩下的 5 和送出的未知部分。"),
    ),
  ],
  "three-addend-word-problems": [
    skill(
      "the-third-amount-in-a-story",
      ["The third amount in a story", "故事中的第三个数"],
      [
        "There are 14 crayons in three boxes. Two boxes hold 5 and 6. Those make $5 + 6 = 11$, and $14 - 11 = 3$ are in the third box.\n\nCheck: $5 + 6 + 3 = 14$.\n\n> **Watch out.** Take both known boxes away from the total, not just one.",
        "三个盒子里一共有 14 支蜡笔。两个盒子里有 5 支和 6 支，合起来是 $5 + 6 = 11$，$14 - 11 = 3$，第三个盒子里有 3 支。\n\n检验：$5 + 6 + 3 = 14$。\n\n> **注意。** 两个已知的盒子都要从总数里减去，不能只减一个。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const c = rng.int(2, 6);
        const total = a + b + c;
        const { who, thing } = storyThing(rng);
        return solved(
          [
            `${who} has ${total} ${thing.en} in three boxes. One box holds ${a} and another holds ${b}. How many are in the third box?`,
            `${who} 的三个盒子里一共有 ${total} 个${thing.zh}。一个盒子有 ${a} 个，另一个有 ${b} 个。第三个盒子里有多少个？`,
          ],
          c,
          [
            [["Add the boxes you know", "把已知的盒子加起来"], ["Two boxes hold", "两个盒子共有"], [`${a} + ${b} = ${a + b}`]],
            [
              ["Take them from the total", "从总数里减去"],
              ["The rest are in the third box:", "剩下的在第三个盒子里："],
              [`${total} - ${a + b} = ${c}`],
            ],
          ],
          [`$${a} + ${b} + ${c} = ${total}$.`, `$${a} + ${b} + ${c} = ${total}$。`],
          [
            [a + b, "That is the two known boxes together.", "这是两个已知盒子的和。"],
            [total, "That is the total.", "这是总数。"],
            [total - a, `This takes away only ${a}. Take away ${b} too.`, `这只减去了 ${a}，还要减去 ${b}。`],
          ],
        );
      },
      captioned(partWholeBarFigure([5, 6, 3], 2), "A bar of 14 cut into 5, 6 and an unknown part.", "14 分成 5、6 和一个未知的部分。"),
    ),
  ],
  "adding-multiples-of-ten": [
    skill(
      "the-missing-round-number",
      ["The missing round number", "缺少的整十数"],
      [
        "Look at $30 + \\square = 70$. Think in tens: 3 tens and how many tens make 7 tens? 4 tens, which is 40.\n\nCheck: $30 + 40 = 70$.\n\n> **Watch out.** Write 40, not 4. The box holds tens.",
        "看 $30 + \\square = 70$。用十来想：3 个十加几个十等于 7 个十？4 个十，也就是 40。\n\n检验：$30 + 40 = 70$。\n\n> **注意。** 要写 40，不是 4。方框里是几个十。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(1, 9 - a);
        return solved(
          [
            `What number goes in the box? $$${a * 10} + \\square = ${(a + b) * 10}$$`,
            `方框里填几？$$${a * 10} + \\square = ${(a + b) * 10}$$`,
          ],
          b * 10,
          [
            [
              ["Think in tens", "用十来想"],
              [
                `${a * 10} is ${a} tens and ${(a + b) * 10} is ${a + b} tens.`,
                `${a * 10} 是 ${a} 个十，${(a + b) * 10} 是 ${a + b} 个十。`,
              ],
            ],
            [
              ["Find the missing tens", "找缺的十"],
              [
                `${a} tens need ${b} more tens to make ${a + b} tens, and ${b} tens is ${b * 10}:`,
                `${a} 个十还差 ${b} 个十才到 ${a + b} 个十，也就是 ${b * 10}：`,
              ],
              [`${a + b} - ${a} = ${b}`],
            ],
          ],
          [`$${a * 10} + ${b * 10} = ${(a + b) * 10}$.`, `$${a * 10} + ${b * 10} = ${(a + b) * 10}$。`],
          [
            [b, "That counts the tens but writes them as ones.", "这数对了十的个数，却写成了一。"],
            [(a + b) * 10, "That is the total.", "这是总数。"],
            [(b + 1) * 10, "That is one ten too many.", "这多了一个十。"],
          ],
        );
      },
      captioned(jumpsFigure(0, 80, 10, [30, 40, 50, 60, 70]), "From 30 to 70 is four jumps of ten: 40.", "从 30 到 70 跳了四个十：40。"),
    ),
  ],
  "adding-tens-to-two-digit-numbers": [
    skill(
      "adding-tens-and-then-ones",
      ["Adding tens and then ones", "先加整十再加一"],
      [
        "Work out $23 + 20 + 4$. Add the tens first: $23 + 20 = 43$. Then the ones: $43 + 4 = 47$.\n\nCheck: add the ones first: $23 + 4 = 27$, then $27 + 20 = 47$.\n\n> **Watch out.** The 20 changes only the tens digit. Do not add 2 to the ones.",
        "算 $23 + 20 + 4$。先加整十：$23 + 20 = 43$。再加一：$43 + 4 = 47$。\n\n检验：先加一：$23 + 4 = 27$，再算 $27 + 20 = 47$。\n\n> **注意。** 加 20 只改变十位，不要把 2 加到个位上。",
      ],
      (rng) => {
        const tens = rng.int(1, 5);
        const ones = rng.int(1, 5);
        const addTens = rng.int(1, 4) * 10;
        const addOnes = rng.int(1, 9 - ones);
        const n = tens * 10 + ones;
        const sum = n + addTens + addOnes;
        return solved(
          [`What is $${n} + ${addTens} + ${addOnes}$?`, `$${n} + ${addTens} + ${addOnes}$ 是多少？`],
          sum,
          [
            [["Add the tens", "先加整十"], ["The tens digit changes:", "十位改变："], [`${n} + ${addTens} = ${n + addTens}`]],
            [["Add the ones", "再加一"], ["The ones digit changes:", "个位改变："], [`${n + addTens} + ${addOnes} = ${sum}`]],
          ],
          [
            `Add the ones first: $${n} + ${addOnes} = ${n + addOnes}$, then $${n + addOnes} + ${addTens} = ${sum}$.`,
            `先加一：$${n} + ${addOnes} = ${n + addOnes}$，再算 $${n + addOnes} + ${addTens} = ${sum}$。`,
          ],
          [
            [n + addTens, `That forgets to add ${addOnes}.`, `这忘了加 ${addOnes}。`],
            [n + addOnes, `That forgets to add ${addTens}.`, `这忘了加 ${addTens}。`],
            [
              n + addTens / 10 + addOnes,
              `This adds ${addTens / 10} to the ones instead of ${addTens / 10} tens.`,
              `这把 ${addTens / 10} 加到了个位上，应该加 ${addTens / 10} 个十。`,
            ],
          ],
        );
      },
      captioned(
        blockRowsFigure([
          [0, 2, 3],
          [0, 2, 0],
          [0, 0, 4],
        ]),
        "23 in blocks, then 2 more tens and 4 more ones.",
        "用积木表示 23，再加 2 个十和 4 个一。",
      ),
    ),
  ],
  "ten-more-and-ten-less": [
    skill(
      "the-number-from-ten-more",
      ["The number from ten more", "由多十求原数"],
      [
        "10 more than a number is 46. Go back 10: the tens go from 4 to 3 and the ones stay 6. The number is 36.\n\nCheck: $36 + 10 = 46$.\n\n> **Watch out.** Do not add 10 again. The number is 10 less than 46.",
        "比一个数多 10 的数是 46。往回退 10：十位从 4 变成 3，个位还是 6。这个数是 36。\n\n检验：$36 + 10 = 46$。\n\n> **注意。** 不要再加 10。这个数比 46 少 10。",
      ],
      (rng) => {
        const n = rng.int(11, 89);
        const up = rng.bool();
        const seen = up ? n + 10 : n - 10;
        return solved(
          up
            ? [`10 more than a number is ${seen}. What is the number?`, `比一个数多 10 的数是 ${seen}。这个数是几？`]
            : [`10 less than a number is ${seen}. What is the number?`, `比一个数少 10 的数是 ${seen}。这个数是几？`],
          n,
          [
            up
              ? [
                  ["Turn it around", "反过来想"],
                  [`${seen} is 10 more, so the number is 10 less than ${seen}.`, `${seen} 比这个数多 10，所以这个数比 ${seen} 少 10。`],
                ]
              : [
                  ["Turn it around", "反过来想"],
                  [`${seen} is 10 less, so the number is 10 more than ${seen}.`, `${seen} 比这个数少 10，所以这个数比 ${seen} 多 10。`],
                ],
            [
              ["Change the tens", "改十位"],
              [`The tens digit goes ${up ? "down" : "up"} by one and the ones stay the same:`, `十位${up ? "少" : "多"} 1，个位不变：`],
              [`${seen} ${up ? "-" : "+"} 10 = ${n}`],
            ],
          ],
          up ? [`$${n} + 10 = ${seen}$.`, `$${n} + 10 = ${seen}$。`] : [`$${n} - 10 = ${seen}$.`, `$${n} - 10 = ${seen}$。`],
          [
            [
              up ? seen + 10 : seen - 10,
              `That goes the wrong way. The number is 10 ${up ? "less" : "more"} than ${seen}.`,
              `方向反了。这个数比 ${seen} ${up ? "少" : "多"} 10。`,
            ],
            [seen, "That is the number given, not the one asked for.", "这是题目给的数，不是要求的数。"],
            [up ? seen - 1 : seen + 1, "That changes the ones instead of the tens.", "这改了个位，应该改十位。"],
          ],
        );
      },
      captioned(hopsFigure([46, 36]), "A hop of 10 back from 46 to 36.", "从 46 往回跳 10 到 36。"),
    ),
  ],
  "subtracting-multiples-of-ten": [
    skill(
      "how-many-tens-were-taken",
      ["How many tens were taken", "减去了几个十"],
      [
        "Look at $80 - \\square = 50$. 8 tens went down to 5 tens, so 3 tens were taken. That is 30.\n\nCheck: $80 - 30 = 50$.\n\n> **Watch out.** Write 30, not 3. Three tens is 30.",
        "看 $80 - \\square = 50$。8 个十变成 5 个十，减去了 3 个十，也就是 30。\n\n检验：$80 - 30 = 50$。\n\n> **注意。** 要写 30，不是 3。3 个十是 30。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(1, a - 1);
        return solved(
          [
            `What number goes in the box? $$${a * 10} - \\square = ${(a - b) * 10}$$`,
            `方框里填几？$$${a * 10} - \\square = ${(a - b) * 10}$$`,
          ],
          b * 10,
          [
            [
              ["Think in tens", "用十来想"],
              [
                `${a * 10} is ${a} tens and ${(a - b) * 10} is ${a - b} tens.`,
                `${a * 10} 是 ${a} 个十，${(a - b) * 10} 是 ${a - b} 个十。`,
              ],
            ],
            [
              ["Find the tens taken", "找减去的十"],
              [`So ${b} tens were taken, which is ${b * 10}:`, `所以减去了 ${b} 个十，也就是 ${b * 10}：`],
              [`${a} - ${a - b} = ${b}`],
            ],
          ],
          [`$${a * 10} - ${b * 10} = ${(a - b) * 10}$.`, `$${a * 10} - ${b * 10} = ${(a - b) * 10}$。`],
          [
            [b, "That writes the tens as ones.", "这把十写成了一。"],
            [(a - b) * 10, "That is what is left.", "这是剩下的数。"],
            [(2 * a - b) * 10, "That adds instead of subtracting.", "这里应该减，却加了。"],
          ],
        );
      },
      captioned(hopsFigure([80, 70, 60, 50]), "Three hops of 10 back from 80 to 50.", "从 80 往回跳三次，每次 10，到 50。"),
    ),
  ],
  "comparing-lengths-directly": [
    skill(
      "shortest-to-longest",
      ["From shortest to longest", "从最短到最长"],
      [
        "A is longer than B. B is longer than C. So C is the shortest, then B, then A.\n\nCheck: read the list backward: A, B, C goes from longest to shortest, just as the clues say.\n\n> **Watch out.** The one named first is not always the shortest. Find the one that is shorter than the others.",
        "A 比 B 长，B 比 C 长。所以 C 最短，然后是 B，最后是 A。\n\n检验：倒过来读：A、B、C 是从最长到最短，正好和线索相符。\n\n> **注意。** 先说到的不一定最短，要找比别的都短的那一个。",
      ],
      (rng) => {
        const items: readonly Pair[] = [
          ["belt", "腰带"],
          ["rope", "绳子"],
          ["ribbon", "丝带"],
          ["string", "细绳"],
          ["scarf", "围巾"],
          ["pencil", "铅笔"],
          ["straw", "吸管"],
        ];
        const [a, b, c] = rng.shuffle(items).slice(0, 3) as [Pair, Pair, Pair];
        const list = (x: Pair, y: Pair, z: Pair): Pair => [`${x[0]}, ${y[0]}, ${z[0]}`, `${x[1]}、${y[1]}、${z[1]}`];
        const wrong: Wrong[] = [
          [list(a, b, c), "That goes from longest to shortest.", "这是从最长到最短。"],
          [list(b, c, a), `That puts the ${b[0]} first, but the ${c[0]} is shorter.`, `这把${b[1]}放在最前面，可是${c[1]}更短。`],
          [
            list(c, a, b),
            `That puts the ${a[0]} before the ${b[0]}, but the ${b[0]} is shorter.`,
            `这把${a[1]}放在${b[1]}前面，可是${b[1]}更短。`,
          ],
        ];
        return picked(
          rng,
          [
            `The ${a[0]} is longer than the ${b[0]}. The ${b[0]} is longer than the ${c[0]}. Which list goes from shortest to longest?`,
            `${a[1]}比${b[1]}长，${b[1]}比${c[1]}长。哪个顺序是从最短到最长？`,
          ],
          list(c, b, a),
          wrong,
          [
            [
              ["Find the shortest", "找最短的"],
              [
                `The ${c[0]} is shorter than the ${b[0]}, which is shorter than the ${a[0]}. So the ${c[0]} is shortest.`,
                `${c[1]}比${b[1]}短，${b[1]}又比${a[1]}短，所以${c[1]}最短。`,
              ],
            ],
            [
              ["Find the longest", "找最长的"],
              [
                `The ${a[0]} is longer than the ${b[0]}, so the ${a[0]} is longest and the ${b[0]} is in the middle.`,
                `${a[1]}比${b[1]}长，所以${a[1]}最长，${b[1]}在中间。`,
              ],
            ],
          ],
          [
            `Read the list backward: ${a[0]}, ${b[0]}, ${c[0]} goes from longest to shortest, as the clues say.`,
            `倒过来读：${a[1]}、${b[1]}、${c[1]}是从最长到最短，和线索相符。`,
          ],
        );
      },
      captioned(
        lengthBarsFigure(["A", "B", "C"], [9, 6, 3]),
        "Three strips from the same line: A is longest and C is shortest.",
        "从同一条线开始的三条：A 最长，C 最短。",
      ),
    ),
  ],
  "measuring-with-non-standard-units": [
    skill(
      "smaller-units-take-more",
      ["Smaller units take more", "单位越小，数量越多"],
      [
        "A desk is 4 pencils long. Each pencil is as long as 3 paper clips, so the desk is also 3, 6, 9, 12 clips long. The clips are shorter, so more of them fit.\n\nCheck: line up 12 clips along the desk. They reach the same end as the 4 pencils.\n\n> **Watch out.** A bigger count does not mean a longer desk. The desk did not change; only the unit did.",
        "一张书桌有 4 支铅笔长。每支铅笔和 3 个回形针一样长，所以书桌也是 3、6、9、12 个回形针长。回形针更短，所以能放下更多个。\n\n检验：沿着书桌摆 12 个回形针，正好到 4 支铅笔的另一头。\n\n> **注意。** 数量大不代表书桌更长。书桌没有变，变的只是单位。",
      ],
      (rng) => {
        const things: readonly Pair[] = [
          ["table", "桌子"],
          ["desk", "书桌"],
          ["bench", "长凳"],
          ["shelf", "书架"],
          ["door", "门"],
          ["rug", "地毯"],
        ];
        const units: readonly Pair[] = [
          ["paper clips", "回形针"],
          ["erasers", "橡皮"],
          ["crayons", "蜡笔"],
          ["pencils", "铅笔"],
          ["rulers", "尺子"],
        ];
        const object = rng.pick(things);
        const i = rng.int(0, units.length - 2);
        const j = rng.int(i + 1, units.length - 1);
        const [small, large] = [units[i] as Pair, units[j] as Pair];
        const wrong: Wrong[] = [
          [
            [`the count of ${large[0]}`, `${large[1]}的数量`],
            `The ${large[0]} are longer, so fewer of them fit.`,
            `${large[1]}更长，所以放下的更少。`,
          ],
          [
            ["both counts are the same", "两次数量相同"],
            "The units are different sizes, so the counts are different.",
            "两种单位长短不同，数出的数也不同。",
          ],
          [
            [`the ${object[0]} decides, not the unit`, `由${object[1]}决定，与单位无关`],
            `The ${object[0]} is the same both times; only the unit changed.`,
            `两次量的是同一个${object[1]}，变的只是单位。`,
          ],
        ];
        return picked(
          rng,
          [
            `Leo measures a ${object[0]} with ${small[0]} and again with ${large[0]}. ${large[0][0]?.toUpperCase()}${large[0].slice(1)} are longer. Which count is bigger?`,
            `里奥用${small[1]}量${object[1]}，又用${large[1]}量了一次。${large[1]}更长。哪次数出的数更大？`,
          ],
          [`the count of ${small[0]}`, `${small[1]}的数量`],
          wrong,
          [
            [
              ["Compare the units", "比单位"],
              [`The ${large[0]} are longer than the ${small[0]}.`, `${large[1]}比${small[1]}长。`],
            ],
            [
              ["Think about how many fit", "想想能放下几个"],
              [
                `The ${small[0]} are shorter, so more of them fit along the ${object[0]}.`,
                `${small[1]}更短，所以沿着${object[1]}能放下更多。`,
              ],
            ],
          ],
          [
            `Lay them side by side: several ${small[0]} fit along just one of the ${large[0]}, so the count of ${small[0]} is bigger.`,
            `把它们并排比一比：和${large[1]}一样长的地方，要放好几个${small[1]}，所以${small[1]}的数量更大。`,
          ],
        );
      },
      captioned(
        cutBarFigure([3, 3, 3, 3]),
        "A desk 4 pencils long; each pencil is as long as 3 clips, so it is 12 clips long.",
        "书桌有 4 支铅笔长；每支铅笔和 3 个回形针一样长，所以是 12 个回形针长。",
      ),
    ),
  ],
  "telling-time-to-the-hour": [
    skill(
      "hours-later-and-earlier",
      ["Hours later and earlier", "几小时之后和之前"],
      [
        "It is 11 o'clock. Three hours later, the short hand moves on: 12, 1, 2. It will be 2 o'clock.\n\nCheck: count back 3 hours from 2: 1, 12, 11.\n\n> **Watch out.** After 12 comes 1, not 13.",
        "现在是 11 点。3 小时后，短针往前走：12、1、2。那时是 2 点。\n\n检验：从 2 往回数 3 小时：1、12、11。\n\n> **注意。** 12 后面是 1，不是 13。",
      ],
      (rng) => {
        const h = rng.pick(clockHours);
        const d = rng.int(1, 4);
        const later = rng.bool();
        const step = (x: number, k: number) => ((x - 1 + k + 120) % 12) + 1;
        const ans = step(h, later ? d : -d);
        const other = step(h, later ? -d : d);
        const path = Array.from({ length: d }, (_, i) => step(h, (later ? 1 : -1) * (i + 1)));
        const back = Array.from({ length: d }, (_, i) => step(ans, (later ? -1 : 1) * (i + 1)));
        const hours = d > 1 ? "hours" : "hour";
        const slips: Slip[] = [
          [
            other,
            `That counts ${later ? "back" : "forward"}, but the question asks ${later ? "later" : "earlier"}.`,
            `这是往${later ? "回" : "前"}数了，题目问的是${later ? "之后" : "之前"}。`,
          ],
          [h, "That is the time now.", "这是现在的时间。"],
          [step(ans, later ? 1 : -1), "That counts one hour too many.", "这多数了一小时。"],
        ];
        if (later && h + d > 12) slips.unshift([h + d, "After 12 the clock starts again at 1.", "钟面上 12 之后又从 1 开始。"]);
        return solved(
          later
            ? [`It is ${h} o'clock. What hour will it be in ${d} ${hours}?`, `现在是 ${h} 点。${d} 小时后是几点？`]
            : [`It is ${h} o'clock. What hour was it ${d} ${hours} ago?`, `现在是 ${h} 点。${d} 小时前是几点？`],
          ans,
          [
            [
              ["Start at the hour", "从现在的整点开始"],
              [`The short hand points to ${h}.`, `短针指着 ${h}。`],
            ],
            [
              [later ? "Count forward" : "Count back", later ? "往前数" : "往回数"],
              [`${path.join(", ")}: it lands on ${ans}.`, `${path.join("、")}：落在 ${ans}。`],
            ],
          ],
          [
            `Count the other way from ${ans}: ${back.join(", ")}, which is the time now.`,
            `从 ${ans} 反方向数：${back.join("、")}，正好是现在的时间。`,
          ],
          slips,
          clockFigure(h, 0),
        );
      },
      captioned(clockFigure(11, 0), "A clock at 11 o'clock.", "钟面上是 11 点。"),
    ),
  ],
  "telling-time-to-the-half-hour": [
    skill(
      "half-an-hour-later",
      ["Half an hour later", "半小时之后"],
      [
        "It is half past 3. Half an hour later, the long hand moves from 6 to 12 and the short hand reaches 4. It is 4 o'clock.\n\nCheck: half an hour before 4 o'clock is half past 3.\n\n> **Watch out.** It is not half past 4. Two half hours make one hour, so half past 3 and half an hour is 4 o'clock.",
        "现在是 3 点半。半小时后，长针从 6 走到 12，短针走到 4。现在是 4 点。\n\n检验：4 点的半小时前正是 3 点半。\n\n> **注意。** 不是 4 点半。两个半小时是一小时，所以 3 点半再过半小时是 4 点。",
      ],
      (rng) => {
        const h = rng.int(2, 10);
        const fromHalf = rng.bool();
        const later = rng.bool();
        const word = (x: number): Pair =>
          x % 2 === 1 ? [`half past ${(x - 1) / 2}`, `${(x - 1) / 2} 点半`] : [`${x / 2} o'clock`, `${x / 2} 点`];
        const start = 2 * h + (fromHalf ? 1 : 0);
        const answer = start + (later ? 1 : -1);
        const reasons: Readonly<Record<number, Pair>> = {
          2: ["That is a whole hour later.", "这是一小时以后。"],
          [-2]: ["That is a whole hour earlier.", "这是一小时以前。"],
          1: ["That is half an hour later, but the question asks earlier.", "这是半小时以后，题目问的是之前。"],
          [-1]: ["That is half an hour earlier, but the question asks later.", "这是半小时以前，题目问的是之后。"],
        };
        const wrong: Wrong[] = [2, -2, 1, -1]
          .filter((o) => start + o !== answer)
          .map((o) => {
            const why = reasons[o] as Pair;
            return [word(start + o), why[0], why[1]];
          });
        const longFrom = fromHalf ? 6 : 12;
        const longTo = fromHalf ? 12 : 6;
        return picked(
          rng,
          later
            ? [`It is ${word(start)[0]}. What time is it half an hour later?`, `现在是 ${word(start)[1]}。半小时后是几点？`]
            : [`It is ${word(start)[0]}. What time was it half an hour ago?`, `现在是 ${word(start)[1]}。半小时前是几点？`],
          word(answer),
          wrong,
          [
            [
              ["Move the long hand", "移动长针"],
              [
                `Half an hour moves the long hand halfway round, from ${longFrom} to ${longTo}.`,
                `半小时让长针走半圈，从 ${longFrom} 走到 ${longTo}。`,
              ],
            ],
            [
              ["Read the time", "读出时间"],
              [`So the time is ${word(answer)[0]}.`, `所以时间是 ${word(answer)[1]}。`],
            ],
          ],
          [
            `Go back the other way: half an hour ${later ? "before" : "after"} ${word(answer)[0]} is ${word(start)[0]}.`,
            `反过来想：${word(answer)[1]}的半小时${later ? "前" : "后"}正是 ${word(start)[1]}。`,
          ],
          clockFigure(h, fromHalf ? 30 : 0),
        );
      },
      captioned(clockFigure(3, 30), "A clock at half past 3.", "钟面上是 3 点半。"),
    ),
  ],
  "tally-charts": [
    skill(
      "counting-bundles-of-tallies",
      ["Counting bundles of tallies", "数成捆的计数符号"],
      [
        "Here are 3 bundles and 2 more strokes. Count the bundles by fives: 5, 10, 15. Then count on the strokes: 16, 17. That is 17.\n\nCheck: $5 + 5 + 5 + 2 = 17$.\n\n> **Watch out.** A bundle is 5, not 1. Do not count it as one mark.",
        "这里有 3 捆，另外还有 2 条竖线。先五个五个地数：5、10、15。再接着数竖线：16、17。一共是 17。\n\n检验：$5 + 5 + 5 + 2 = 17$。\n\n> **注意。** 一捆是 5，不是 1。不要把一捆当成一条。",
      ],
      (rng) => {
        const bundles = rng.int(2, 9);
        const single = rng.int(1, 4);
        const n = bundles * 5 + single;
        const fives = Array.from({ length: bundles }, (_, i) => 5 * (i + 1));
        const on = run(bundles * 5 + 1, n);
        return solved(
          [
            `A tally chart shows ${bundles} full bundles of five and ${single} more stroke${single > 1 ? "s" : ""}. What number is that?`,
            `一个计数表上有 ${bundles} 捆（每捆 5 个）和另外 ${single} 条竖线。这是多少？`,
          ],
          n,
          [
            [
              ["Count the bundles by fives", "五个五个地数"],
              [`${fives.join(", ")}.`, `${fives.join("、")}。`],
            ],
            [
              ["Count on the strokes", "接着数竖线"],
              [`${on.join(", ")}: that is ${n}.`, `${on.join("、")}：一共是 ${n}。`],
            ],
          ],
          [
            `$${Array<number>(bundles).fill(5).join(" + ")} + ${single} = ${n}$.`,
            `$${Array<number>(bundles).fill(5).join(" + ")} + ${single} = ${n}$。`,
          ],
          [
            [bundles + single, "That counts each bundle as one mark.", "这把每一捆当成了一条。"],
            [bundles * 10 + single, "That counts each bundle as ten.", "这把每一捆当成了 10。"],
            [bundles * 5, "That leaves out the single strokes.", "这漏掉了单独的竖线。"],
          ],
          tallyFigure([""], [n]),
        );
      },
      captioned(tallyFigure([""], [17]), "17 tally marks: 3 bundles of five and 2 more.", "17 条计数符号：3 捆五个，另外 2 条。"),
    ),
  ],
  "first-picture-graphs": [
    {
      ...skill(
        "votes-in-all-on-a-picture-graph",
        ["Votes in all on a picture graph", "图画统计图上的总票数"],
        [
          "Each dot is one vote. The rows have 4, 6 and 3 dots. Add every row: $4 + 6 + 3 = 13$ votes.\n\nCheck: add in another order, $6 + 4 + 3 = 13$.\n\n> **Watch out.** Do not stop after two rows. Every row has votes in it.",
          "每个点是一票。三行分别有 4、6、3 个点。每一行都加上：$4 + 6 + 3 = 13$ 票。\n\n检验：换个顺序加，$6 + 4 + 3 = 13$。\n\n> **注意。** 不要只加两行就停下，每一行都有票。",
        ],
        (rng) => {
          const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
          const total = a + b + c;
          return solved(
            [
              `On a picture graph the cats row has ${a} dots, the dogs row has ${b} and the fish row has ${c}. Each dot is one vote. How many votes are there in all?`,
              `一张图画统计图上，猫这一行有 ${a} 个点，狗这一行有 ${b} 个点，鱼这一行有 ${c} 个点。每个点代表一票。一共有多少票？`,
            ],
            total,
            [
              [
                ["Read each row", "读出每一行"],
                [`Cats ${a}, dogs ${b}, fish ${c}.`, `猫 ${a}，狗 ${b}，鱼 ${c}。`],
              ],
              [["Add the rows", "把各行加起来"], ["Every vote counts once:", "每一票都算一次："], [`${a} + ${b} + ${c} = ${total}`]],
            ],
            [`Add in another order: $${c} + ${b} + ${a} = ${total}$.`, `换个顺序加：$${c} + ${b} + ${a} = ${total}$。`],
            [
              [a + b, "That leaves out the fish row.", "这漏掉了鱼这一行。"],
              [Math.max(a, b, c), "That is only the longest row.", "这只是最长的一行。"],
              [3, "That counts the rows, not the dots.", "这数的是行数，不是点数。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["first-picture-graphs#votes-in-all-on-a-picture-graph"],
    },
  ],
  "first-bar-graphs": [
    {
      ...skill(
        "how-many-more-on-a-bar-graph",
        ["How many more on a bar graph", "条形统计图上多多少"],
        [
          'Bar A stops at 4 and bar B stops at 9. B is taller, so subtract: $9 - 4 = 5$. Class B has 5 more.\n\nCheck: count up from the top of A to the top of B: 5, 6, 7, 8, 9. That is 5 steps.\n\n> **Watch out.** Do not add the bars. "How many more" asks for the difference.',
          "A 条到 4，B 条到 9。B 条更高，所以相减：$9 - 4 = 5$。B 班多 5 个。\n\n检验：从 A 条的顶端往上数到 B 条的顶端：5、6、7、8、9，一共 5 格。\n\n> **注意。** 不要把两条加起来。“多多少”问的是相差多少。",
        ],
        (rng) => {
          const a = rng.int(2, 8);
          const b = a + rng.int(1, 9);
          const [p, q] = rng.shuffle(["A", "B", "C", "D", "E", "F"]).slice(0, 2) as [string, string];
          return solved(
            [
              `On a bar graph, the bar for class ${p} stops at ${b} and the bar for class ${q} stops at ${a}. How many more cans did class ${p} collect than class ${q}?`,
              `在一张条形统计图上，${p} 班的条形到 ${b}，${q} 班的条形到 ${a}。${p} 班比 ${q} 班多收集了多少个罐子？`,
            ],
            b - a,
            [
              [
                ["Read the tops", "读出顶端"],
                [`Class ${p} is at ${b} and class ${q} is at ${a}.`, `${p} 班到 ${b}，${q} 班到 ${a}。`],
              ],
              [["Subtract", "相减"], ["Take the smaller from the larger:", "大数减小数："], [`${b} - ${a} = ${b - a}`]],
            ],
            [`Add back: $${a} + ${b - a} = ${b}$.`, `加回去验算：$${a} + ${b - a} = ${b}$。`],
            [
              [a + b, "That adds the two bars.", "这是把两条加起来了。"],
              [b, `That is only the bar for class ${p}.`, `这只是 ${p} 班的条形。`],
              [a, `That is only the bar for class ${q}.`, `这只是 ${q} 班的条形。`],
            ],
          );
        },
      ),
      figure: gradeDrawings2["first-bar-graphs#how-many-more-on-a-bar-graph"],
    },
  ],
  "defining-attributes-of-shapes": [
    skill(
      "what-does-not-change-a-shape",
      ["What does not change a shape", "什么不会改变形状"],
      [
        "A triangle has 3 sides and 3 corners. Paint it, turn it or draw it bigger, and it still has 3 sides, so it is still a triangle. Cut off one corner and it gets 4 sides.\n\nCheck: count the sides after the cut. There are 4, so it is no longer a triangle.\n\n> **Watch out.** Turning a shape does not change it. A triangle upside down is still a triangle.",
        "三角形有 3 条边和 3 个角。涂色、转动或画大，它还是 3 条边，还是三角形。切掉一个角，它就有 4 条边了。\n\n检验：数一数切过以后的边，有 4 条，所以不再是三角形。\n\n> **注意。** 转动不会改变形状。倒过来的三角形还是三角形。",
      ],
      (rng) => {
        const shapes: readonly { name: Pair; sides: number }[] = [
          { name: ["triangle", "三角形"], sides: 3 },
          { name: ["square", "正方形"], sides: 4 },
          { name: ["rectangle", "长方形"], sides: 4 },
          { name: ["pentagon", "五边形"], sides: 5 },
          { name: ["hexagon", "六边形"], sides: 6 },
        ];
        const colors: readonly Pair[] = [
          ["red", "红色"],
          ["blue", "蓝色"],
          ["green", "绿色"],
          ["yellow", "黄色"],
          ["purple", "紫色"],
          ["orange", "橙色"],
        ];
        const { name: shape, sides } = rng.pick(shapes);
        const color = rng.pick(colors);
        const wrong: Wrong[] = [
          [["painting it another color", "涂成另一种颜色"], "Color does not change the sides or the corners.", "颜色不会改变边和角。"],
          [["turning it upside down", "把它倒过来"], "Turning keeps the same sides and corners.", "转动后边和角都没变。"],
          [
            ["drawing it twice as big", "画成两倍大"],
            "A bigger copy has the same number of sides and corners.",
            "画大以后边和角的数量都不变。",
          ],
        ];
        return picked(
          rng,
          [
            `Grace has a ${color[0]} ${shape[0]}. Which change makes it a different shape?`,
            `格蕾丝有一个${color[1]}的${shape[1]}。哪种变化会使它变成另一种形状？`,
          ],
          ["cutting off one corner", "切掉一个角"],
          wrong,
          [
            [
              ["Count the sides now", "数现在的边"],
              [`A ${shape[0]} has ${sides} sides and ${sides} corners.`, `${shape[1]}有 ${sides} 条边和 ${sides} 个角。`],
            ],
            [
              ["See what each change does", "看每种变化"],
              [
                `Cutting off a corner makes ${sides + 1} sides, so it is no longer a ${shape[0]}.`,
                `切掉一个角会变成 ${sides + 1} 条边，所以不再是${shape[1]}。`,
              ],
            ],
          ],
          [
            `Painting, turning and drawing it bigger all leave ${sides} sides and ${sides} corners.`,
            `涂色、转动和画大以后，都还是 ${sides} 条边、${sides} 个角。`,
          ],
        );
      },
      captioned(
        polygonFigure(
          [
            [1, 9],
            [4, 3],
            [6, 3],
            [9, 9],
          ],
          t("A triangle with its top corner cut off.", "切掉顶角的三角形。"),
        ),
        "A triangle with its top corner cut off now has 4 sides.",
        "切掉顶角的三角形现在有 4 条边。",
      ),
    ),
  ],
  "composing-shapes": [
    {
      ...skill(
        "how-many-pieces-for-several-shapes",
        ["How many pieces for several shapes", "拼几个图形要多少块"],
        [
          "Two triangles make one square. For three squares, count by twos: 2, 4, 6. That is 6 triangles.\n\nCheck: $2 + 2 + 2 = 6$.\n\n> **Watch out.** The answer is not 3. Three is the number of squares; each square needs 2 triangles.",
          "两个三角形拼成一个正方形。拼三个正方形，两个两个地数：2、4、6。需要 6 个三角形。\n\n检验：$2 + 2 + 2 = 6$。\n\n> **注意。** 答案不是 3。3 是正方形的个数，每个正方形要 2 个三角形。",
        ],
        (rng) => {
          const kinds: readonly [Pair, Pair][] = [
            [
              ["squares", "正方形"],
              ["rectangles", "长方形"],
            ],
            [
              ["triangles", "三角形"],
              ["squares", "正方形"],
            ],
            [
              ["half circles", "半圆"],
              ["circles", "圆"],
            ],
          ];
          const [piece, big] = rng.pick(kinds);
          const k = rng.int(2, 10);
          const twos = Array.from({ length: k }, (_, i) => 2 * (i + 1));
          return solved(
            [
              `Each of the ${big[0]} takes 2 ${piece[0]}. How many ${piece[0]} do ${k} ${big[0]} take?`,
              `2 个${piece[1]}能拼成 1 个${big[1]}。拼 ${k} 个${big[1]}需要多少个${piece[1]}？`,
            ],
            2 * k,
            [
              [
                ["One shape", "先看一个"],
                [`One of the ${big[0]} takes 2 ${piece[0]}.`, `拼 1 个${big[1]}要 2 个${piece[1]}。`],
              ],
              [
                ["Count by twos", "两个两个地数"],
                [`Once for each of the ${k}: ${twos.join(", ")}.`, `拼 ${k} 个就数 ${k} 次：${twos.join("、")}。`],
              ],
            ],
            [`$${Array<number>(k).fill(2).join(" + ")} = ${2 * k}$.`, `$${Array<number>(k).fill(2).join(" + ")} = ${2 * k}$。`],
            [
              [k, `That counts the ${big[0]}, not the ${piece[0]}.`, `这数的是${big[1]}的个数，不是${piece[1]}的个数。`],
              [k + 2, "That adds 2 once instead of 2 for each shape.", "这只加了一次 2，应该每个都加 2。"],
              [2 * k + 2, "That is one shape too many.", "这多算了一个图形。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["composing-shapes#how-many-pieces-for-several-shapes"],
    },
  ],
};
