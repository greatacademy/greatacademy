// 1st Grade Math: counting and numbers to 120, tens and ones, comparing, adding
// and subtracting within 20, the equal sign, word problems, and adding and
// subtracting tens.

import type { TopicDef } from "@ga/content";
import {
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  jumpsFigure,
  lengthBarsFigure,
  numberLineFigure,
  tenFramesFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  blockRowsFigure,
  captioned,
  compareBarsFigure,
  compared,
  hopsFigure,
  type Pair,
  partWholeBarFigure,
  pickedMath,
  type Slip,
  solved,
  type Walk,
} from "./early-grades-more-kit.ts";
import { blocksFigure, numberWordsEn, numberWordsZh, plural } from "./grade-2-numbers-operations.ts";

const countingTo120 = earlyTopic(
  "counting-to-120",
  ["Counting to 120", "数到 120"],
  ["Count on from any number up to 120, and say which number comes next.", "从任意一个数开始往后数，一直数到 120，并说出下一个数。"],
  [],
  ["1.NBT.A.1"],
  [
    earlyPoint(
      "the-number-that-comes-next",
      ["The number that comes next", "下一个数"],
      [
        "Each number is one more than the number before it. To find the next number, add one to the ones: after 46 comes 47. When the ones digit is 9, the ones are full, so a new ten starts. After 39 comes 40, and after 99 comes 100.\n\nCheck: on a number line the next number is one step to the right. One step right from 39 is 40.\n\n> **Watch out.** After a 9, the tens go up by one. After 59 comes 60, not 50.",
        "每个数都比它前面的数多 1。找下一个数，就给个位加 1：46 后面是 47。个位是 9 时，一已经满了，要开始新的一个十。39 后面是 40，99 后面是 100。\n\n检验：在数轴上，下一个数就在右边一格。从 39 往右走一格是 40。\n\n> **注意。** 个位是 9 时，十位要加 1。59 后面是 60，不是 50。",
      ],
      (rng) => {
        const crossing = rng.bool();
        const n = crossing ? 10 * rng.int(1, 11) + 9 : rng.int(5, 119);
        const answer = n + 1;
        const ones = n % 10;
        return solved(
          [`What number comes right after ${n}?`, `${n} 后面紧接着的数是多少？`],
          answer,
          [
            [
              ["Look at the ones", "看个位"],
              ones === 9
                ? [
                    `The ones digit of ${n} is 9, so the ones are full and a new ten starts.`,
                    `${n} 的个位是 9，一已经满了，要开始新的一个十。`,
                  ]
                : [`The ones digit of ${n} is ${ones}. One more makes it ${ones + 1}.`, `${n} 的个位是 ${ones}，多 1 就是 ${ones + 1}。`],
            ],
            [["Count on one", "往后数一个"], ["", ""], [`${n} + 1 = ${answer}`]],
          ],
          [`Count back one from ${answer}: you land on ${n}.`, `从 ${answer} 往回数一个，正好是 ${n}。`],
          [
            [
              n - 1,
              `That is the number just before ${n}. The question asks for the one after it.`,
              `这是 ${n} 前面的数，题目问的是后面的数。`,
            ],
            [n + 10, "That is ten more. The next number is only one more.", "这是多 10 的数，下一个数只多 1。"],
            ones === 9
              ? [
                  n - 9,
                  `The ones go back to 0, but the tens must go up too: after ${n} comes ${answer}.`,
                  `个位变成 0，但十位也要加 1：${n} 后面是 ${answer}。`,
                ]
              : [n + 2, `That skips ${answer}. Count on just one.`, `这跳过了 ${answer}，只要往后数一个。`],
          ],
        );
      },
      captioned(
        numberLineFigure(36, 42, 1, 40),
        "A number line from 36 to 42 with 40 marked, one step after 39.",
        "从 36 到 42 的数轴，标出 39 后面一格的 40。",
      ),
    ),
    earlyPoint(
      "the-missing-number-when-counting",
      ["The missing number when counting", "数数时缺少的数"],
      [
        "When a number is missing, look at its neighbours. The number before the box tells you where you are. Add one to it. In 57, 58, ☐, 60, the box comes right after 58, so it holds 59.\n\nCheck: the number after the box is 60, and one less than 60 is 59. Both neighbours agree.\n\n> **Watch out.** Do not copy a neighbour into the box. The box holds a new number, one more than the number before it.",
        "缺一个数时，看看它两边的数。方框前面的数告诉你数到了哪里，给它加 1。在 57、58、☐、60 中，方框紧跟在 58 后面，所以是 59。\n\n检验：方框后面是 60，比 60 少 1 的数是 59。两边的数都对得上。\n\n> **注意。** 不要把旁边的数抄进方框。方框里是一个新的数，比前面的数多 1。",
      ],
      (rng) => {
        const start = rng.int(4, 115);
        const gap = rng.int(1, 3);
        const answer = start + gap;
        const shown = [0, 1, 2, 3, 4].map((i) => (i === gap ? "\\square" : `${start + i}`)).join(", ");
        return solved(
          [`What number goes in the box? $${shown}$`, `方框里填几？$${shown}$`],
          answer,
          [
            [
              ["Find the number before the box", "找方框前面的数"],
              [`The number just before the box is ${answer - 1}.`, `方框前面紧挨着的数是 ${answer - 1}。`],
            ],
            [["Count on one", "往后数一个"], ["", ""], [`${answer - 1} + 1 = ${answer}`]],
          ],
          [
            `The number just after the box is ${answer + 1}, and one less than ${answer + 1} is ${answer}.`,
            `方框后面的数是 ${answer + 1}，比 ${answer + 1} 少 1 的数是 ${answer}。`,
          ],
          [
            [
              answer - 1,
              `That is the number before the box. It is already in the list; the box holds one more.`,
              `这是方框前面的数，它已经写出来了，方框里的数要多 1。`,
            ],
            [answer + 1, `That is the number after the box. The box comes one step earlier.`, `这是方框后面的数，方框要往前一格。`],
            [start, "That is the first number in the list. Count on from it to the box.", "这是第一个数，要从它往后数到方框。"],
          ],
        );
      },
      captioned(
        numberLineFigure(56, 61, 1, 59),
        "A number line from 56 to 61 with 59 marked, between 58 and 60.",
        "从 56 到 61 的数轴，标出 58 和 60 之间的 59。",
      ),
    ),
  ],
  [
    "Mia is counting her stickers. She has 38. She gets one more, and now she has 39. She gets one more again. The ones are full, so a new ten starts: now she has 40.\n\nCheck: on a number line, 40 is one step to the right of 39.\n\nIn this lesson we count on from any number up to 120, fill in a missing number, and find the number that comes before.",
    "米娅在数贴纸。她有 38 张。又得到一张，现在是 39 张。再得到一张，一满了，开始新的一个十：现在是 40 张。\n\n检验：在数轴上，40 在 39 右边一格。\n\n本课我们从任意一个数往后数到 120，找出缺少的数，再找出前一个数。",
  ],
);

const readingWritingTo120 = earlyTopic(
  "reading-and-writing-numbers-to-120",
  ["Reading and Writing Numbers to 120", "读写 120 以内的数"],
  ["Count a set of objects, and write a number named in words with digits.", "数出一组物品的个数，并把用文字说的数写成数字。"],
  ["counting-to-120"],
  ["1.NBT.A.1"],
  [
    earlyPoint(
      "counting-rows-of-counters",
      ["Counting rows of counters", "数一排排的圆片"],
      [
        "A big group is easy to count in rows of ten. Count the full rows by tens: 10, 20, 30. Then count on the last row by ones: 31, 32, 33, 34. So 3 full rows and 4 more make 34.\n\nCheck: 3 tens and 4 ones is written 34, with the tens on the left.\n\n> **Watch out.** Write the tens first. 3 full rows and 4 more is 34, not 43.",
        "一大堆东西排成每行十个，就容易数了。整行按十数：10、20、30。最后一行一个一个接着数：31、32、33、34。所以 3 个整行再加 4 个是 34。\n\n检验：3 个十和 4 个一写作 34，十在左边。\n\n> **注意。** 先写十。3 个整行再加 4 个是 34，不是 43。",
      ],
      (rng) => {
        const n = rng.int(11, 58);
        const fullRows = Math.floor(n / 10);
        const left = n % 10;
        const tens = Array.from({ length: fullRows }, (_, i) => 10 * (i + 1)).join(", ");
        return solved(
          ["How many counters are there?", "一共有多少个圆片？"],
          n,
          [
            [
              ["Count the full rows by tens", "整行按十数"],
              [`There ${fullRows === 1 ? "is 1 full row" : `are ${fullRows} full rows`} of ten:`, `有 ${fullRows} 个整行，每行十个：`],
              [tens],
            ],
            [
              ["Count on the rest", "接着数剩下的"],
              left === 0
                ? [`No counters are left over, so the count stops at ${n}.`, `没有剩下的圆片，所以数到 ${n} 就停。`]
                : [
                    `The last row has ${plural(left, "counter")}. Count on ${left} from ${10 * fullRows} to reach ${n}.`,
                    `最后一行有 ${left} 个，从 ${10 * fullRows} 接着数 ${left} 个，数到 ${n}。`,
                  ],
            ],
          ],
          [
            `${plural(fullRows, "ten")} and ${plural(left, "one")} make $${10 * fullRows} + ${left} = ${n}$.`,
            `${fullRows} 个十和 ${left} 个一合起来是 $${10 * fullRows} + ${left} = ${n}$。`,
          ],
          [
            left === 0
              ? [
                  fullRows,
                  `This leaves out the 0. With no counters left over, a 0 holds the ones place: ${n}.`,
                  `这漏掉了 0。没有剩下的圆片，个位要写 0：${n}。`,
                ]
              : [
                  10 * left + fullRows,
                  "This writes the ones before the tens. The full rows give the tens digit, on the left.",
                  "这把一写在了十前面。整行的个数是十位，要写在左边。",
                ],
            [
              fullRows + left,
              "This counts each full row as one counter. A full row is ten.",
              "这把每个整行当成一个圆片了。一个整行是十个。",
            ],
            [n + 10, "This counts one row too many. Count each full row once.", "这多数了一行，每个整行只数一次。"],
          ],
          countersFigure(n, 10),
        );
      },
      captioned(countersFigure(34, 10), "34 counters: 3 full rows of ten and 4 more.", "34 个圆片：3 个十个一行的整行，再加 4 个。"),
    ),
    earlyPoint(
      "writing-a-named-number",
      ["Writing a named number", "写出说到的数"],
      [
        "A number's name tells you how to write it. Twenty-seven means 2 tens and 7 ones. Write the tens on the left and the ones on the right: 27. Sixty has no ones, so a 0 goes in the ones place: 60.\n\nCheck: the blocks for 27 are 2 rods and 7 small squares, just as twenty-seven says.\n\n> **Watch out.** Twenty-seven is 27, not 72. The tens come first, on the left.",
        "数的读法告诉你怎么写。二十七是 2 个十和 7 个一。十写在左边，一写在右边：27。六十没有一，所以个位写 0：60。\n\n检验：27 的积木是 2 根长条和 7 个小方块，正是二十七。\n\n> **注意。** 二十七写作 27，不是 72。十在前，写在左边。",
      ],
      (rng) => {
        const n = rng.bool() ? rng.int(11, 99) : rng.int(100, 120);
        const tens = Math.floor(n / 10);
        const ones = n % 10;
        const rest = n - 100;
        if (n < 100)
          return solved(
            [`Write this number with digits: ${numberWordsEn(n)}.`, `用数字写出这个数：${numberWordsZh(n)}。`],
            n,
            [
              [
                ["Find the tens and ones", "找出十和一"],
                [
                  `The name ${numberWordsEn(n)} means ${plural(tens, "ten")} and ${plural(ones, "one")}.`,
                  `${numberWordsZh(n)}表示 ${tens} 个十和 ${ones} 个一。`,
                ],
              ],
              [
                ["Write the digits", "写出数字"],
                ones === 0
                  ? [`Write ${tens} for the tens, and a 0 because there are no ones: ${n}.`, `十位写 ${tens}，没有一，个位写 0：${n}。`]
                  : [
                      `Write ${tens} for the tens on the left and ${ones} for the ones on the right: ${n}.`,
                      `左边十位写 ${tens}，右边个位写 ${ones}：${n}。`,
                    ],
              ],
            ],
            [
              `${plural(tens, "ten")} are ${10 * tens}, and $${10 * tens} + ${ones} = ${n}$.`,
              `${tens} 个十是 ${10 * tens}，$${10 * tens} + ${ones} = ${n}$。`,
            ],
            [
              ones === 0
                ? [
                    tens,
                    `This leaves out the 0. The name ${numberWordsEn(n)} has no ones, so a 0 holds the ones place.`,
                    `这漏掉了 0。${numberWordsZh(n)}没有一，个位要写 0。`,
                  ]
                : [10 * ones + tens, "This swaps the digits. The tens go on the left.", "这把两个数字写反了，十要写在左边。"],
              [n + 10, "That has one ten too many.", "这多了一个十。"],
              [n - 10, "That has one ten too few.", "这少了一个十。"],
            ],
          );
        return solved(
          [`Write this number with digits: ${numberWordsEn(n)}.`, `用数字写出这个数：${numberWordsZh(n)}。`],
          n,
          [
            [
              ["Find the hundred and the rest", "找出一百和剩下的部分"],
              [`The name ${numberWordsEn(n)} means 100 and ${rest} more.`, `${numberWordsZh(n)}表示 100 再加 ${rest}。`],
            ],
            [
              ["Write the digits", "写出数字"],
              rest < 10
                ? [`Write 1 for the hundred, 0 for the tens and ${rest} for the ones: ${n}.`, `百位写 1，十位写 0，个位写 ${rest}：${n}。`]
                : [`Write 1 for the hundred, then ${rest}: ${n}.`, `百位写 1，后面写 ${rest}：${n}。`],
            ],
          ],
          [`$100 + ${rest} = ${n}$.`, `$100 + ${rest} = ${n}$。`],
          [
            [rest, "This leaves out the hundred. Write 1 first.", "这漏掉了一百，要先写 1。"],
            rest < 10
              ? [
                  Number(`100${rest}`),
                  `This writes 100 and then ${rest} after it. The ${rest} goes in the ones place of 100: ${n}.`,
                  `这在 100 后面又写了 ${rest}。${rest} 应该放在 100 的个位上：${n}。`,
                ]
              : [n + 10, "That has one ten too many.", "这多了一个十。"],
            [n - 10, "That has one ten too few.", "这少了一个十。"],
          ],
        );
      },
      captioned(
        blocksFigure(0, 2, 7),
        "Twenty-seven: 2 rods for the tens and 7 small squares for the ones.",
        "二十七：2 根长条表示十，7 个小方块表示一。",
      ),
    ),
  ],
  [
    "Leo spills a jar of buttons. He puts them in rows of ten. There are 3 full rows and 4 more buttons. He counts the rows: 10, 20, 30. Then he counts on: 31, 32, 33, 34.\n\nCheck: 3 tens and 4 ones is written 34. The 3 on the left counts the tens.\n\nIn this lesson we count big groups by tens and ones, and write numbers from their names.",
    "利奥打翻了一罐纽扣。他把纽扣排成每行十个。有 3 个整行，还多 4 个。他先数整行：10、20、30。再接着数：31、32、33、34。\n\n检验：3 个十和 4 个一写作 34。左边的 3 数的是十。\n\n本课我们按十和一数一大堆东西，并根据读法写出数。",
  ],
);

const tenAndSomeOnes = earlyTopic(
  "ten-and-some-ones",
  ["Ten and Some Ones", "一个十和几个一"],
  ["See the numbers from 11 to 19 as one ten and some ones.", "把 11 到 19 看成一个十和几个一。"],
  ["reading-and-writing-numbers-to-120"],
  ["1.NBT.B.2.B"],
  [
    earlyPoint(
      "counting-with-ten-frames",
      ["Counting with ten-frames", "用十格框来数"],
      [
        "A ten-frame holds exactly 10 counters: 5 on top and 5 below. When a frame is full, you know it is 10 without counting. Then count on the second frame. A full frame and 4 more: 10, then 11, 12, 13, 14.\n\nCheck: $10 + 4 = 14$.\n\n> **Watch out.** Count every counter, whatever its color. Filled and hollow counters both count.",
        "十格框正好放 10 个圆片：上面 5 个，下面 5 个。框满了，不用数就知道是 10。然后接着数第二个框。一个满框再加 4 个：10，接着 11、12、13、14。\n\n检验：$10 + 4 = 14$。\n\n> **注意。** 每个圆片都要数，不管什么颜色。实心的和空心的都算。",
      ],
      (rng) => {
        const total = rng.int(11, 19);
        const filled = rng.int(3, total - 1);
        const more = total - 10;
        return solved(
          ["How many counters are in the frames altogether?", "这些框里一共有多少个圆片？"],
          total,
          [
            [
              ["Find the full frame", "找满的框"],
              ["The first frame is full, so it holds 10. The colors do not matter.", "第一个框是满的，所以有 10 个，颜色不影响。"],
            ],
            [
              ["Count on the second frame", "接着数第二个框"],
              [`The second frame has ${more}. Count on ${more} from 10:`, `第二个框有 ${more} 个，从 10 接着数 ${more} 个：`],
              [`10 + ${more} = ${total}`],
            ],
          ],
          [
            `Count the filled and the hollow counters: $${filled} + ${total - filled} = ${total}$.`,
            `把实心和空心的圆片加起来：$${filled} + ${total - filled} = ${total}$。`,
          ],
          [
            [filled, "This counts only the filled counters. The hollow ones count too.", "这只数了实心的圆片，空心的也要数。"],
            [total - filled, "This counts only the hollow counters. The filled ones count too.", "这只数了空心的圆片，实心的也要数。"],
            [more, "This counts only the second frame. The full frame adds 10.", "这只数了第二个框，满的框还有 10 个。"],
          ],
          tenFramesFigure(filled, total - filled),
        );
      },
      captioned(tenFramesFigure(10, 4), "A full ten-frame and 4 more counters: 14.", "一个满的十格框，再加 4 个圆片：14。"),
    ),
    earlyPoint(
      "teen-numbers-as-ten-plus-ones",
      ["Teen numbers as ten plus ones", "十几等于十加几"],
      [
        "The numbers from 11 to 19 are each one ten and some ones. In 16, the 1 on the left is not one thing. It is a whole ten. The 6 tells the extra ones. So 16 is $10 + 6$.\n\nCheck: count on 6 from 10: 11, 12, 13, 14, 15, 16.\n\n> **Watch out.** The 1 in 16 means one ten, not one counter. 16 is $10 + 6$, not $1 + 6$.",
        "11 到 19 都是一个十和几个一。在 16 中，左边的 1 不是一个东西，而是一个完整的十。6 说明多出几个一。所以 16 是 $10 + 6$。\n\n检验：从 10 接着数 6 个：11、12、13、14、15、16。\n\n> **注意。** 16 里的 1 表示一个十，不是一个圆片。16 是 $10 + 6$，不是 $1 + 6$。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const n = 10 + k;
        const form = rng.int(0, 3);
        const toN: readonly Slip[] = [
          [k, `That is only the ones. The ten is still there: ${n}.`, `这只是几个一，还有一个十：${n}。`],
          [1 + k, `This counts the ten as 1. The 1 in ${n} stands for a whole ten.`, `这把十当成了 1。${n} 里的 1 表示一个十。`],
          [10 * k + 1, `This puts the ones in the tens place. The ten goes on the left: ${n}.`, `这把一放到了十位上。十要写在左边：${n}。`],
          [10, "That is only the ten. Add the ones too.", "这只是那个十，还要加上几个一。"],
        ];
        const build: readonly Walk[] = [
          [
            ["Start with the ten", "先看十"],
            ["10 is one ten, so it makes the 1 on the left.", "10 是一个十，就是左边的 1。"],
          ],
          [["Add the ones", "再加上一"], [`The ${k} ones make the digit on the right:`, `${k} 个一就是右边的数字：`], [`10 + ${k} = ${n}`]],
        ];
        const check: Pair = [`Count on ${k} from 10 and you land on ${n}.`, `从 10 接着数 ${k} 个，正好数到 ${n}。`];
        if (form === 0) return solved([`What is $10 + ${k}$?`, `$10 + ${k}$ 等于多少？`], n, build, check, toN);
        if (form === 2)
          return solved([`What number is 1 ten and ${plural(k, "one")}?`, `1 个十和 ${k} 个一是多少？`], n, build, check, toN);
        if (form === 1)
          return solved(
            [`What number goes in the box? $10 + \\square = ${n}$`, `方框里填几？$10 + \\square = ${n}$`],
            k,
            [
              [
                ["Split the number", "拆开这个数"],
                [`${n} is one ten and ${plural(k, "one")}.`, `${n} 是一个十和 ${k} 个一。`],
              ],
              [
                ["Find the box", "找出方框"],
                ["The 10 is already there, so the box holds the ones:", "10 已经有了，所以方框里是几个一："],
                [`10 + ${k} = ${n}`],
              ],
            ],
            [`Count on from 10: ${k} more steps reach ${n}.`, `从 10 往后数，再数 ${k} 个就到 ${n}。`],
            [
              [n, "That is the whole number. The box is only the part added to 10.", "这是整个数，方框里只是加在 10 上的那部分。"],
              [1, "That is the tens digit. The box holds the ones.", "这是十位上的数字，方框里是几个一。"],
              [10, "That is the ten that is already there. The box is the other part.", "这是已经有的那个十，方框是另一部分。"],
            ],
          );
        return solved(
          [`How many ones are left over after making one ten from ${n}?`, `从 ${n} 里拿出一个十，还剩几个一？`],
          k,
          [
            [
              ["Make the ten", "拿出一个十"],
              [`Take 10 out of ${n}.`, `从 ${n} 里拿出 10。`],
            ],
            [["Count what is left", "数剩下的"], ["", ""], [`${n} - 10 = ${k}`]],
          ],
          [`Put the ten back: $10 + ${k} = ${n}$.`, `把十放回去：$10 + ${k} = ${n}$。`],
          [
            [n, "That is the whole number. Take the ten away first.", "这是整个数，要先拿走那个十。"],
            [1, "That is the number of tens, not ones.", "这是十的个数，不是一的个数。"],
            [10, "That is the ten you took out. The question asks what is left.", "这是拿走的那个十，题目问的是剩下的。"],
          ],
        );
      },
      captioned(
        blocksFigure(0, 1, 6),
        "16 as 1 rod for the ten and 6 small squares for the ones.",
        "16：1 根长条表示十，6 个小方块表示一。",
      ),
    ),
  ],
  [
    "Ava has a full ten-frame of counters and 6 more counters next to it. She does not count the full frame. She knows it is 10. Then she counts on: 11, 12, 13, 14, 15, 16.\n\nCheck: one ten and 6 ones is $10 + 6 = 16$.\n\nIn this lesson we see the numbers from 11 to 19 as one ten and some ones.",
    "艾娃有一个摆满圆片的十格框，旁边还有 6 个圆片。她不用数满框，知道那是 10。然后接着数：11、12、13、14、15、16。\n\n检验：一个十和 6 个一是 $10 + 6 = 16$。\n\n本课我们把 11 到 19 看成一个十和几个一。",
  ],
);

const tensAndOnes = earlyTopic(
  "tens-and-ones",
  ["Tens and Ones", "十和一"],
  ["Read a two-digit number from its tens and ones.", "根据十和一读出两位数。"],
  ["ten-and-some-ones"],
  ["1.NBT.B.2"],
  [
    earlyPoint(
      "reading-rods-and-squares",
      ["Reading rods and squares", "读长条和小方块"],
      [
        "A rod is a ten. A small square is a one. Count the rods first: that is the tens digit, on the left. Then count the squares: that is the ones digit, on the right. 4 rods and 3 squares show 43.\n\nCheck: count the rods by tens and the squares by ones: 10, 20, 30, 40, then 41, 42, 43.\n\n> **Watch out.** Do not swap the places. 4 rods and 3 squares make 43, not 34.",
        "一根长条是一个十，一个小方块是一个一。先数长条，这是十位，写在左边。再数小方块，这是个位，写在右边。4 根长条和 3 个小方块表示 43。\n\n检验：长条按十数，小方块按一数：10、20、30、40，再数 41、42、43。\n\n> **注意。** 不要把两位弄反。4 根长条和 3 个小方块是 43，不是 34。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const single = rng.int(0, 9);
        const answer = 10 * tens + single;
        return solved(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          answer,
          [
            [
              ["Count the rods", "数长条"],
              [
                `There ${tens === 1 ? "is 1 rod" : `are ${tens} rods`}, so the tens digit is ${tens}.`,
                `有 ${tens} 根长条，所以十位是 ${tens}。`,
              ],
            ],
            [
              ["Count the squares", "数小方块"],
              [
                `There ${single === 1 ? "is 1 small square" : `are ${single} small squares`}, so the ones digit is ${single}.`,
                `有 ${single} 个小方块，所以个位是 ${single}。`,
              ],
              [`${10 * tens} + ${single} = ${answer}`],
            ],
          ],
          [
            `Count the rods by tens to reach ${10 * tens}, then count on ${single} to reach ${answer}.`,
            `长条按十数到 ${10 * tens}，再接着数 ${single} 个，数到 ${answer}。`,
          ],
          [
            single === 0
              ? [tens, "This forgets the 0. With no small squares, a 0 holds the ones place.", "这漏掉了 0。没有小方块，个位要写 0。"]
              : [
                  10 * single + tens,
                  "This swaps the places. The rods are tens and go on the left.",
                  "这把两位弄反了。长条是十，要写在左边。",
                ],
            [tens + single, "This counts every block as one. A rod is ten ones.", "这把每块积木都当成一。一根长条是十个一。"],
          ],
          blocksFigure(0, tens, single),
        );
      },
      captioned(blocksFigure(0, 4, 3), "43 as 4 rods and 3 small squares.", "43：4 根长条和 3 个小方块。"),
    ),
    earlyPoint(
      "the-tens-and-ones-in-a-number",
      ["The tens and ones in a number", "一个数里的十和一"],
      [
        "Each digit of a two-digit number has a job. The left digit counts tens. The right digit counts ones. In 58, the 5 means 5 tens, which is 50. The 8 means 8 ones.\n\nCheck: 5 tens and 8 ones is $50 + 8 = 58$.\n\n> **Watch out.** 58 has 5 tens, not 50 tens. 50 is what the 5 tens are worth.",
        "两位数的每个数字都有自己的任务。左边的数字数十，右边的数字数一。在 58 中，5 表示 5 个十，也就是 50。8 表示 8 个一。\n\n检验：5 个十和 8 个一是 $50 + 8 = 58$。\n\n> **注意。** 58 里有 5 个十，不是 50 个十。50 是这 5 个十合起来的大小。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const single = rng.int(1, 9);
        const n = 10 * tens + single;
        return rng.bool()
          ? solved(
              [`How many tens are in ${n}?`, `${n} 里有几个十？`],
              tens,
              [
                [
                  ["Find the tens digit", "找十位"],
                  [`The tens digit is the left one. In ${n} it is ${tens}.`, `十位是左边的数字，${n} 的十位是 ${tens}。`],
                ],
                [
                  ["Say what it counts", "说出它数的是什么"],
                  [`So ${n} has ${plural(tens, "ten")}, worth ${10 * tens}:`, `所以 ${n} 有 ${tens} 个十，合起来是 ${10 * tens}：`],
                  [`${n} = ${10 * tens} + ${single}`],
                ],
              ],
              [
                `${tens === 1 ? "1 rod" : `${tens} rods`} and ${single === 1 ? "1 small square" : `${single} small squares`} show ${n}.`,
                `${tens} 根长条和 ${single} 个小方块表示 ${n}。`,
              ],
              [
                [single, "That is the ones digit, on the right.", "这是右边的个位数字。"],
                [n, "That is the whole number.", "这是整个数。"],
                [
                  10 * tens,
                  "That is what the tens are worth. The question asks how many tens.",
                  "这是这些十合起来的大小，题目问的是几个十。",
                ],
              ],
            )
          : solved(
              [`After taking out all the tens of ${n}, how many ones are left?`, `把 ${n} 里所有的十拿走，还剩几个一？`],
              single,
              [
                [
                  ["Take out the tens", "拿走十"],
                  [`${n} has ${plural(tens, "ten")}, which make ${10 * tens}.`, `${n} 有 ${tens} 个十，合起来是 ${10 * tens}。`],
                ],
                [
                  ["Read the ones", "读出个位"],
                  ["What is left is the right digit:", "剩下的就是右边的数字："],
                  [`${n} - ${10 * tens} = ${single}`],
                ],
              ],
              [`Put the tens back: $${10 * tens} + ${single} = ${n}$.`, `把十放回去：$${10 * tens} + ${single} = ${n}$。`],
              [
                [tens, "That is the number of tens you took out.", "这是拿走的十的个数。"],
                [n, "That is the whole number, before the tens are taken out.", "这是拿走十之前的整个数。"],
                [10 * single, "This reads the ones as tens. The right digit counts ones.", "这把一当成了十。右边的数字数的是一。"],
              ],
            );
      },
      captioned(
        blocksFigure(0, 5, 8),
        "58 as 5 rods for the tens and 8 small squares for the ones.",
        "58：5 根长条表示十，8 个小方块表示一。",
      ),
    ),
  ],
  [
    "Sam builds with blocks. Each rod is a ten. Each small square is a one. He has 4 rods and 3 squares. He counts the rods: 10, 20, 30, 40. Then the squares: 41, 42, 43.\n\nCheck: 4 tens and 3 ones is $40 + 3 = 43$.\n\nIn this lesson we read two-digit numbers from tens and ones, and say what each digit counts.",
    "萨姆在搭积木。一根长条是一个十，一个小方块是一个一。他有 4 根长条和 3 个小方块。他先数长条：10、20、30、40。再数小方块：41、42、43。\n\n检验：4 个十和 3 个一是 $40 + 3 = 43$。\n\n本课我们根据十和一读出两位数，并说出每个数字数的是什么。",
  ],
);

const countingGroupsOfTen = earlyTopic(
  "counting-groups-of-ten",
  ["Counting Groups of Ten", "数整十"],
  ["See 10, 20, 30 and so on as one, two, three or more tens with no ones.", "把 10、20、30 等看成一个十、两个十、三个十等，没有一。"],
  ["tens-and-ones"],
  ["1.NBT.B.2.C"],
  [
    earlyPoint(
      "bags-of-ten",
      ["Bags of ten", "每袋十个"],
      [
        "Things packed in tens are quick to count. Count the bags by tens: 10, 20, 30. Three bags of ten are 30. The 3 tells how many tens. The 0 says there are no extra ones.\n\nCheck: three tens are $10 + 10 + 10 = 30$.\n\n> **Watch out.** Each bag is 10, not 1. Three bags of ten hold 30 things, not 3.",
        "每十个装一袋，数起来就快。按十数袋子：10、20、30。三袋就是 30。3 说明有几个十，0 说明没有多余的一。\n\n检验：三个十是 $10 + 10 + 10 = 30$。\n\n> **注意。** 每袋是 10 个，不是 1 个。三袋一共是 30 个，不是 3 个。",
      ],
      (rng) => {
        const bags = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const answer = 10 * bags;
        const tens = Array.from({ length: bags }, (_, i) => 10 * (i + 1));
        return solved(
          [
            `${name} has ${bags} bags with 10 ${thing.en} in each bag. How many ${thing.en} is that?`,
            `${name} 有 ${bags} 个袋子，每袋 10 ${thing.unit}${thing.zh}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [["Count by tens", "按十数"], ["Say one ten for each bag:", "每个袋子数一个十："], [tens.join(", ")]],
            [
              ["Read the total", "读出总数"],
              [`${bags} tens are ${answer}.`, `${bags} 个十是 ${answer}。`],
            ],
          ],
          [
            `Add the bags: $${tens.map(() => "10").join(" + ")} = ${answer}$.`,
            `把每袋加起来：$${tens.map(() => "10").join(" + ")} = ${answer}$。`,
          ],
          [
            [bags, "That counts the bags. Each bag holds 10.", "这数的是袋子，每袋有 10 个。"],
            [bags + 10, "This adds 10 only once. Each bag adds 10.", "这只加了一次 10，每个袋子都要加 10。"],
            [answer + 10, "That is one bag too many. Count each bag once.", "这多数了一袋，每袋只数一次。"],
          ],
        );
      },
      captioned(countersFigure(30, 10), "30 counters in 3 rows of ten.", "30 个圆片，排成 3 行，每行十个。"),
    ),
    earlyPoint(
      "how-many-tens-in-a-round-number",
      ["How many tens in a round number", "整十数里有几个十"],
      [
        "Now go the other way. Start with 70 and ask how many tens it holds. The left digit tells you: 70 is 7 tens. So 70 things fill exactly 7 bags of ten, with none left over.\n\nCheck: count by tens to 70: 10, 20, 30, 40, 50, 60, 70. That is 7 counts.\n\n> **Watch out.** The answer is the number of bags, 7, not the 70 things.",
        "现在倒过来想。从 70 出发，问它里面有几个十。左边的数字就告诉你：70 是 7 个十。所以 70 个东西正好装满 7 袋，每袋十个，没有剩余。\n\n检验：按十数到 70：10、20、30、40、50、60、70，一共数了 7 次。\n\n> **注意。** 答案是袋子的个数 7，不是 70 个东西。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const n = 10 * tens;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const list = Array.from({ length: tens }, (_, i) => 10 * (i + 1)).join(", ");
        return solved(
          [
            `${name} puts ${n} ${thing.en} into bags of 10. How many bags can ${name} fill?`,
            `${name} 把 ${n} ${thing.unit}${thing.zh}装进袋子，每袋 10 ${thing.unit}。能装满多少袋？`,
          ],
          tens,
          [
            [
              ["Read the tens digit", "看十位"],
              [`${n} has the tens digit ${tens} and 0 ones.`, `${n} 的十位是 ${tens}，个位是 0。`],
            ],
            [
              ["Fill the bags", "装袋"],
              [`Each bag takes one ten, so ${tens} bags are filled and nothing is left.`, `每袋装一个十，所以装满 ${tens} 袋，没有剩余。`],
            ],
          ],
          [`Count by tens up to ${n}: ${list}. That is ${tens} counts.`, `按十数到 ${n}：${list}，一共数了 ${tens} 次。`],
          [
            [n, "That is how many things there are. The question asks for bags.", "这是东西的个数，题目问的是袋数。"],
            [10, "That is how many go in each bag, not how many bags.", "这是每袋装的个数，不是袋数。"],
            [tens - 1, "That is one bag short. The last ten fills a bag too.", "这少了一袋，最后一个十也能装满一袋。"],
          ],
        );
      },
      captioned(countersFigure(70, 10), "70 counters in 7 rows of ten.", "70 个圆片，排成 7 行，每行十个。"),
    ),
  ],
  [
    "Ben packs crayons in boxes of 10. He fills 3 boxes. He counts the boxes by tens: 10, 20, 30. So he has 30 crayons.\n\nCheck: 30 is 3 tens and 0 ones. The 3 tells how many boxes.\n\nIn this lesson we count groups of ten, and find how many tens are in 10, 20, 30 and so on.",
    "本把蜡笔装进盒子，每盒 10 支。他装满了 3 盒。他按十数盒子：10、20、30。所以他有 30 支蜡笔。\n\n检验：30 是 3 个十和 0 个一。3 说明有几盒。\n\n本课我们数整十，并找出 10、20、30 等数里有几个十。",
  ],
);

const comparingTwoDigit = earlyTopic(
  "comparing-two-digit-numbers",
  ["Comparing Two-Digit Numbers", "比较两位数"],
  [
    "Compare two-digit numbers by looking at the tens first, and use the symbols for greater, less and equal.",
    "先看十位来比较两位数，并使用大于、小于和等于的符号。",
  ],
  ["tens-and-ones"],
  ["1.NBT.B.3"],
  [
    earlyPoint(
      "the-symbol-between-two-digit-numbers",
      ["The symbol between two numbers", "两个数之间的符号"],
      [
        "Look at the tens first. One ten is worth more than all the ones up to 9. So the number with more tens is greater: $41 > 39$, even though 1 is less than 9. Only when the tens match do you look at the ones. The open side of the symbol faces the greater number.\n\nCheck: on a number line, 41 is to the right of 39, so it is greater.\n\n> **Watch out.** Do not decide by the ones first. 39 has 9 ones, but 41 is still greater because it has more tens.",
        "先看十位。一个十比 9 以内所有的一都大。所以十位大的数就大：$41 > 39$，虽然 1 比 9 小。只有十位相同时，才去看个位。符号开口的一边对着较大的数。\n\n检验：在数轴上，41 在 39 的右边，所以 41 大。\n\n> **注意。** 不要先看个位。39 有 9 个一，但 41 的十更多，所以 41 还是更大。",
      ],
      (rng) => {
        const a = rng.int(10, 99);
        const kind = rng.int(0, 7);
        const sameTens = 10 * Math.floor(a / 10) + rng.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a % 10));
        const b = kind === 0 ? a : kind <= 3 ? sameTens : rng.pick([...Array(90).keys()].map((v) => v + 10).filter((v) => v !== a));
        const rel = a < b ? 0 : a === b ? 1 : 2;
        const [ta, oa, tb, ob] = [Math.floor(a / 10), a % 10, Math.floor(b / 10), b % 10];
        const sym = ["<", "=", ">"][rel] as string;
        const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
        const onesFirst = ta !== tb && lo % 10 > hi % 10;
        const pointsWrong = (big: number): Pair =>
          onesFirst
            ? [
                `This looks at the ones first. ${lo} has more ones, but ${hi} has more tens.`,
                `这先看了个位。${lo} 的一更多，但 ${hi} 的十更多。`,
              ]
            : [
                `That would make ${big === a ? b : a} the greater number, but ${big} is greater.`,
                `这表示 ${big === a ? b : a} 更大，但其实 ${big} 更大。`,
              ];
        const notSame: Pair = ["The two numbers have different digits, so they are not equal.", "两个数的数字不同，所以不相等。"];
        const reasons: readonly [Pair, Pair, Pair] =
          rel === 1
            ? [
                ["That says the first number is less, but the two numbers are the same.", "这表示第一个数小，但两个数一样。"],
                ["", ""],
                ["That says the first number is greater, but the two numbers are the same.", "这表示第一个数大，但两个数一样。"],
              ]
            : rel === 0
              ? [["", ""], notSame, pointsWrong(b)]
              : [pointsWrong(a), notSame, ["", ""]];
        return compared(
          `${a}`,
          `${b}`,
          rel,
          [
            [
              ["Compare the tens", "比十位"],
              ta === tb
                ? [`Both numbers have ${plural(ta, "ten")}. The tens match.`, `两个数都有 ${ta} 个十，十位相同。`]
                : [`${a} has ${plural(ta, "ten")} and ${b} has ${plural(tb, "ten")}.`, `${a} 有 ${ta} 个十，${b} 有 ${tb} 个十。`],
            ],
            [
              ["Decide", "作出判断"],
              rel === 1
                ? ["The ones match too, so the numbers are equal:", "个位也相同，所以两个数相等："]
                : ta === tb
                  ? [`Compare the ones, ${oa} and ${ob}. So ${hi} is greater:`, `比个位：${oa} 和 ${ob}。所以 ${hi} 更大：`]
                  : [`${hi} has more tens, so it is greater:`, `${hi} 的十更多，所以它更大：`],
              [`${a} ${sym} ${b}`],
            ],
          ],
          rel === 1
            ? ["The same digits in the same places name the same number.", "相同的数字在相同的数位上，表示的是同一个数。"]
            : [
                `On a number line, ${hi} is to the right of ${lo}, so ${hi} is greater.`,
                `在数轴上，${hi} 在 ${lo} 的右边，所以 ${hi} 更大。`,
              ],
          reasons,
        );
      },
      captioned(
        numberLineFigure(38, 42, 1, 41),
        "A number line from 38 to 42 with 41 marked, to the right of 39.",
        "从 38 到 42 的数轴，标出 39 右边的 41。",
      ),
    ),
    earlyPoint(
      "greatest-and-least-two-digit-numbers",
      ["Greatest and least", "最大和最小"],
      [
        "To find the greatest, look at the tens digits and pick the largest. If two numbers share it, the larger ones digit decides. For 52, 48, 57 and 19, the largest tens digit is 5. Both 52 and 57 have it, and 7 ones beat 2 ones. So 57 is the greatest.\n\nCheck: in order, $19 < 48 < 52 < 57$. The last one is 57.\n\n> **Watch out.** A big ones digit does not make a number big. 48 has 8 ones, but 52 is greater.",
        "要找最大的数，先看十位，挑出最大的十位。如果有两个数十位相同，就看个位，个位大的更大。在 52、48、57、19 中，最大的十位是 5。52 和 57 都是，7 个一比 2 个一多，所以 57 最大。\n\n检验：按顺序排是 $19 < 48 < 52 < 57$，最后一个是 57。\n\n> **注意。** 个位大不等于这个数大。48 有 8 个一，但 52 更大。",
      ],
      (rng) => {
        const pool = rng.sample(
          [...Array(90).keys()].map((v) => v + 10),
          4,
        );
        const asksGreatest = rng.bool();
        const sorted = [...pool].sort((x, y) => x - y);
        const correct = (asksGreatest ? sorted[3] : sorted[0]) as number;
        const tens = (v: number) => Math.floor(v / 10);
        const tc = tens(correct);
        const ties = pool.filter((v) => tens(v) === tc);
        const word: Pair = asksGreatest ? ["greatest", "最大"] : ["least", "最小"];
        const why = (v: number): readonly [string, string, string] => {
          if (v === (asksGreatest ? sorted[0] : sorted[3]))
            return [
              `${v}`,
              `${v} is the ${asksGreatest ? "least" : "greatest"} number, the opposite of what is asked.`,
              `${v} 是${asksGreatest ? "最小" : "最大"}的数，正好相反。`,
            ];
          if (tens(v) === tc)
            return [
              `${v}`,
              `${v} has the same tens as ${correct}, but ${asksGreatest ? "fewer" : "more"} ones.`,
              `${v} 和 ${correct} 十位相同，但一${asksGreatest ? "更少" : "更多"}。`,
            ];
          if ((asksGreatest && v % 10 > correct % 10) || (!asksGreatest && v % 10 < correct % 10))
            return [
              `${v}`,
              `${v} has ${asksGreatest ? "more" : "fewer"} ones, but the tens decide: ${correct} has ${asksGreatest ? "more" : "fewer"} tens.`,
              `${v} 的一${asksGreatest ? "更多" : "更少"}，但要看十位：${correct} 的十${asksGreatest ? "更多" : "更少"}。`,
            ];
          return [
            `${v}`,
            `${v} has ${asksGreatest ? "fewer" : "more"} tens than ${correct}.`,
            `${v} 的十比 ${correct} ${asksGreatest ? "少" : "多"}。`,
          ];
        };
        return pickedMath(
          rng,
          [`Which of these numbers is the ${word[0]}?`, `下面哪个数${word[1]}？`],
          `${correct}`,
          pool.filter((v) => v !== correct).map(why),
          [
            [
              ["Compare the tens", "比十位"],
              [
                `The tens digits are ${pool.map(tens).join(", ")}. The ${asksGreatest ? "largest" : "smallest"} is ${tc}.`,
                `十位分别是 ${pool.map(tens).join("、")}，其中${asksGreatest ? "最大" : "最小"}的是 ${tc}。`,
              ],
            ],
            [
              ["Look at the ones", "看个位"],
              ties.length > 1
                ? [
                    `${ties.join(" and ")} both have ${tc} tens, so compare the ones: ${correct} is the ${word[0]}.`,
                    `${ties.join(" 和 ")} 的十位都是 ${tc}，再比个位：${correct} ${word[1]}。`,
                  ]
                : [
                    `Only ${correct} has ${tc} tens, so no ones need comparing: it is the ${word[0]}.`,
                    `只有 ${correct} 的十位是 ${tc}，不用再比个位：它${word[1]}。`,
                  ],
            ],
          ],
          [
            `Put the numbers in order: $${sorted.join(" < ")}$. The ${asksGreatest ? "last" : "first"} one is ${correct}.`,
            `把这些数排好顺序：$${sorted.join(" < ")}$。${asksGreatest ? "最后" : "第一"}个是 ${correct}。`,
          ],
        );
      },
      captioned(
        lengthBarsFigure(["52", "48", "57", "19"], [52, 48, 57, 19]),
        "Bars as long as 52, 48, 57 and 19: the bar for 57 is the longest.",
        "长度为 52、48、57、19 的长条：57 的长条最长。",
      ),
    ),
  ],
  [
    "Two classes collect cans. Class A has 41 cans. Class B has 39 cans. 39 has more ones, but 41 has more tens. 4 tens are more than 3 tens, so Class A has more: $41 > 39$.\n\nCheck: on a number line, 41 is to the right of 39.\n\nIn this lesson we compare two-digit numbers by their tens first, and find the greatest and the least.",
    "两个班收集易拉罐。A 班有 41 个，B 班有 39 个。39 的一更多，但 41 的十更多。4 个十比 3 个十多，所以 A 班的多：$41 > 39$。\n\n检验：在数轴上，41 在 39 的右边。\n\n本课我们先看十位来比较两位数，并找出最大的数和最小的数。",
  ],
);

const countingOn = earlyTopic(
  "counting-on-to-add",
  ["Counting On to Add", "往后数来做加法"],
  ["Add a small number by starting at the larger number and counting on.", "从较大的数开始往后数，加上一个小的数。"],
  ["counting-to-120"],
  ["1.OA.C.5"],
  [
    earlyPoint(
      "counting-on-along-a-number-line",
      ["Counting on along a number line", "在数轴上往后数"],
      [
        "Adding means moving forward. Put your finger on the first number. Make one hop to the right for each one you add. For $7 + 3$, start at 7 and hop: 8, 9, 10. You stop on 10, so $7 + 3 = 10$.\n\nCheck: hop back 3 from 10: 9, 8, 7. You are back where you began.\n\n> **Watch out.** Do not count the number you start on. The first hop lands on 8, not 7.",
        "加法就是往前走。把手指放在第一个数上，加几就向右跳几下。算 $7 + 3$ 时，从 7 开始跳：8、9、10。停在 10，所以 $7 + 3 = 10$。\n\n检验：从 10 往回跳 3 下：9、8、7，又回到了开始的地方。\n\n> **注意。** 开始的数不要数。第一跳落在 8，不是 7。",
      ],
      (rng) => {
        const a = rng.int(3, 15);
        const b = rng.int(2, Math.min(5, 20 - a));
        const lo = Math.max(0, a - rng.int(0, 2));
        const answer = a + b;
        const hops = Array.from({ length: b }, (_, i) => a + i + 1).join(", ");
        return {
          ...solved(
            [
              `The marked point is at ${a}. Count on ${b} more. What number do you reach?`,
              `标出的点在 ${a}。再往后数 ${b} 个。到了哪个数？`,
            ],
            answer,
            [
              [
                ["Start at the marked point", "从标出的点开始"],
                [`Put your finger on ${a}. It is not counted.`, `把手指放在 ${a} 上，这个数不算。`],
              ],
              [["Hop to the right", "向右跳"], [`Make ${b} hops, saying each number:`, `跳 ${b} 下，每跳一下说出一个数：`], [hops]],
            ],
            [`Hop back ${b} from ${answer}: you land on ${a} again.`, `从 ${answer} 往回跳 ${b} 下，又回到 ${a}。`],
            [
              [
                answer - 1,
                `This counts ${a} as the first hop. The first hop lands on ${a + 1}.`,
                `这把 ${a} 当成了第一跳。第一跳落在 ${a + 1}。`,
              ],
              [a, "That is where you started. Make the hops too.", "这是开始的地方，还要往后跳。"],
              [b, "That is the number of hops, not where they end.", "这是跳的次数，不是停下的地方。"],
            ],
            numberLineFigure(lo, lo + 10, 1, a),
          ),
          solutionFigure: jumpsFigure(
            lo,
            lo + 10,
            1,
            Array.from({ length: b + 1 }, (_, i) => a + i),
          ),
        };
      },
      gradeDrawings2["counting-on-to-add#counting-on-along-a-number-line"],
    ),
    earlyPoint(
      "starting-from-the-bigger-number",
      ["Starting from the bigger number", "从较大的数开始"],
      [
        "You can add in either order, so start with the bigger number. Then there is less to count. For $2 + 9$, start at 9 and count on two: 10, 11. Starting at 2 would take nine counts.\n\nCheck: $9 + 2 = 11$ and $2 + 9 = 11$. The order does not change the total.\n\n> **Watch out.** Do not count the start again. From 9, the first count is 10.",
        "加法可以换顺序，所以从较大的数开始，要数的就少了。算 $2 + 9$ 时，从 9 开始往后数两个：10、11。从 2 开始要数九次。\n\n检验：$9 + 2 = 11$，$2 + 9 = 11$，顺序不影响结果。\n\n> **注意。** 开始的数不要再数。从 9 开始，第一个数的是 10。",
      ],
      (rng) => {
        const big = rng.int(4, 17);
        const small = rng.int(1, Math.min(3, 20 - big));
        const [a, b] = rng.bool() ? [big, small] : [small, big];
        const answer = big + small;
        const counts = Array.from({ length: small }, (_, i) => big + i + 1).join(", ");
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Pick the bigger number", "选较大的数"],
              a === big
                ? [`${big} is the bigger number, so start there.`, `${big} 是较大的数，就从它开始。`]
                : [`You can add in any order, so start at the bigger number, ${big}.`, `加法可以换顺序，所以从较大的数 ${big} 开始。`],
            ],
            [
              ["Count on the smaller number", "往后数较小的数"],
              [`Count on ${small}: ${counts}.`, `往后数 ${small} 个：${counts}。`],
              [`${big} + ${small} = ${answer}`],
            ],
          ],
          [
            `Start at ${small} instead and count on ${big}: you also reach ${answer}, but it takes ${big} counts.`,
            `如果从 ${small} 开始往后数 ${big} 个，也得到 ${answer}，只是要数 ${big} 次。`,
          ],
          [
            [big, "That is the starting number. Count on the other number too.", "这是开始的数，还要往后数另一个数。"],
            [
              answer - 1,
              `This counts ${big} as one of the counts. Start counting at ${big + 1}.`,
              `这把 ${big} 也算进去了，要从 ${big + 1} 开始数。`,
            ],
            [
              answer + 1,
              `This counts on one extra. Stop after ${small} ${small === 1 ? "count" : "counts"}.`,
              `这多数了一个，数 ${small} 次就停。`,
            ],
          ],
        );
      },
      captioned(jumpsFigure(5, 15, 1, [9, 10, 11]), "Two hops from 9 to 11 on a number line.", "在数轴上从 9 跳两下到 11。"),
    ),
  ],
  [
    "Zoe has 8 shells. She finds 3 more. She does not count from 1. She keeps 8 in her head and counts on: 9, 10, 11. She has 11 shells.\n\nCheck: count back 3 from 11: 10, 9, 8. That is the 8 she started with.\n\nIn this lesson we add by counting on, starting from the bigger number.",
    "佐伊有 8 个贝壳，又找到 3 个。她不从 1 开始数，而是记住 8，往后数：9、10、11。她有 11 个贝壳。\n\n检验：从 11 往回数 3 个：10、9、8，正是她原来的 8 个。\n\n本课我们从较大的数开始，往后数来做加法。",
  ],
);

const countingBack = earlyTopic(
  "counting-back-to-subtract",
  ["Counting Back to Subtract", "往前数来做减法"],
  ["Take away a small number by counting back from the larger number.", "从较大的数往前数，减去一个小的数。"],
  ["counting-on-to-add"],
  ["1.OA.C.5"],
  [
    earlyPoint(
      "counting-back-along-a-number-line",
      ["Counting back along a number line", "在数轴上往前数"],
      [
        "Taking away means moving back. Put your finger on the first number. Make one hop to the left for each one you take away. For $10 - 3$, start at 10 and hop: 9, 8, 7. You stop on 7, so $10 - 3 = 7$.\n\nCheck: hop forward 3 from 7: 8, 9, 10. You are back at 10.\n\n> **Watch out.** Hop to the left, not the right. Taking away makes the number smaller.",
        "减法就是往回走。把手指放在第一个数上，减几就向左跳几下。算 $10 - 3$ 时，从 10 开始跳：9、8、7。停在 7，所以 $10 - 3 = 7$。\n\n检验：从 7 往前跳 3 下：8、9、10，又回到 10。\n\n> **注意。** 要向左跳，不是向右。减去以后，数会变小。",
      ],
      (rng) => {
        const a = rng.int(6, 20);
        const b = rng.int(2, 5);
        const hi = Math.min(20, a + rng.int(0, 2));
        const lo = Math.max(0, hi - 10);
        const answer = a - b;
        const hops = Array.from({ length: b }, (_, i) => a - i - 1).join(", ");
        return {
          ...solved(
            [`The marked point is at ${a}. Count back ${b}. What number do you reach?`, `标出的点在 ${a}。往前数 ${b} 个。到了哪个数？`],
            answer,
            [
              [
                ["Start at the marked point", "从标出的点开始"],
                [`Put your finger on ${a}. It is not counted.`, `把手指放在 ${a} 上，这个数不算。`],
              ],
              [["Hop to the left", "向左跳"], [`Make ${b} hops, saying each number:`, `跳 ${b} 下，每跳一下说出一个数：`], [hops]],
            ],
            [`Hop forward ${b} from ${answer}: you are back at ${a}.`, `从 ${answer} 往前跳 ${b} 下，又回到 ${a}。`],
            [
              [a + b, "This hops to the right. Taking away moves left.", "这是向右跳了。减法要向左跳。"],
              [a, "That is where you started. Make the hops too.", "这是开始的地方，还要往回跳。"],
              [
                answer + 1,
                `This counts ${a} as the first hop. The first hop lands on ${a - 1}.`,
                `这把 ${a} 当成了第一跳。第一跳落在 ${a - 1}。`,
              ],
            ],
            numberLineFigure(lo, lo + 10, 1, a),
          ),
          solutionFigure: jumpsFigure(
            lo,
            lo + 10,
            1,
            Array.from({ length: b + 1 }, (_, i) => a - i),
          ),
        };
      },
      gradeDrawings2["counting-back-to-subtract#counting-back-along-a-number-line"],
    ),
    earlyPoint(
      "counting-back-in-your-head",
      ["Counting back in your head", "在心里往前数"],
      [
        "To take away 1, 2 or 3, count back in your head. Keep the first number in mind. Say the numbers below it, one finger for each. For $15 - 3$: 14, 13, 12. Three fingers are up, so stop. The answer is 12.\n\nCheck: $12 + 3 = 15$, so adding back gives the start.\n\n> **Watch out.** The first number is not one of the counts. For $15 - 3$, start by saying 14.",
        "只减 1、2 或 3 时，可以在心里往前数。记住第一个数，往下说它前面的数，每说一个伸出一根手指。算 $15 - 3$：14、13、12。伸出三根手指了，就停下。答案是 12。\n\n检验：$12 + 3 = 15$，加回去正好是开始的数。\n\n> **注意。** 第一个数不算在内。算 $15 - 3$ 时，要从 14 开始说。",
      ],
      (rng) => {
        const a = rng.int(5, 20);
        const b = rng.int(1, 3);
        const answer = a - b;
        const counts = Array.from({ length: b }, (_, i) => a - i - 1).join(", ");
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Count back", "往前数"],
              [`Keep ${a} in mind and say ${b === 1 ? "the number" : `${b} numbers`} below it:`, `记住 ${a}，往下说 ${b} 个数：`],
              [counts],
            ],
            [
              ["Read the answer", "读出答案"],
              [`The last number said is ${answer}.`, `最后说的数是 ${answer}。`],
            ],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去：$${answer} + ${b} = ${a}$。`],
          [
            [a + b, "This counts up. Taking away counts back.", "这是往后数了。减法要往前数。"],
            [a, "That is the starting number. Take some away.", "这是开始的数，还要减去。"],
            [
              answer + 1,
              `This counts ${a} as one of the counts. Start by saying ${a - 1}.`,
              `这把 ${a} 也算进去了，要从 ${a - 1} 开始说。`,
            ],
          ],
        );
      },
      captioned(
        jumpsFigure(10, 16, 1, [15, 14, 13, 12]),
        "Three hops back from 15 to 12 on a number line.",
        "在数轴上从 15 往回跳三下到 12。",
      ),
    ),
  ],
  [
    "There are 12 birds on a fence. 3 fly away. Nia counts back from 12: 11, 10, 9. So 9 birds are left.\n\nCheck: the 9 birds left and the 3 that flew away make $9 + 3 = 12$.\n\nIn this lesson we take away by counting back.",
    "篱笆上有 12 只鸟，飞走了 3 只。妮娅从 12 往前数：11、10、9。所以还剩 9 只。\n\n检验：剩下的 9 只和飞走的 3 只合起来是 $9 + 3 = 12$。\n\n本课我们往前数来做减法。",
  ],
);

const makingTen = earlyTopic(
  "making-ten-to-add",
  ["Making Ten to Add", "凑十法"],
  ["Know the pairs that make ten, and use them to add numbers past ten.", "掌握凑成十的数对，并用它们计算超过十的加法。"],
  ["counting-on-to-add", "ten-and-some-ones"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "pairs-that-make-ten",
      ["Pairs that make ten", "凑成十的数对"],
      [
        "Our counting is built on ten, so the pairs that make ten are worth knowing. Look at a ten-frame with 7 counters. The empty boxes show how many more would fill it. There are 3 empty boxes, so 7 and 3 make ten.\n\nCheck: count on 3 from 7: 8, 9, 10.\n\n> **Watch out.** Count the empty boxes, not the full ones. 7 counters need 3 more, not 7.",
        "我们是按十来数数的，所以能凑成十的数对很值得记住。看一个放了 7 个圆片的十格框。空格说明还要几个才能放满。有 3 个空格，所以 7 和 3 凑成十。\n\n检验：从 7 往后数 3 个：8、9、10。\n\n> **注意。** 要数空格，不是数放了圆片的格子。7 个圆片还差 3 个，不是 7 个。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const answer = 10 - a;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const counts = Array.from({ length: answer }, (_, i) => a + i + 1).join(", ");
        return rng.bool()
          ? solved(
              ["How many more counters would fill this frame?", "还要多少个圆片才能放满这个框？"],
              answer,
              [
                [
                  ["Count the counters", "数圆片"],
                  [`The frame has ${plural(a, "counter")}.`, `框里有 ${a} 个圆片。`],
                ],
                [
                  ["Count the empty boxes", "数空格"],
                  [
                    `A frame has 10 boxes, so ${answer} ${answer === 1 ? "is" : "are"} empty:`,
                    `一个框有 10 个格子，所以有 ${answer} 个空格：`,
                  ],
                  [`10 - ${a} = ${answer}`],
                ],
              ],
              [`$${a} + ${answer} = 10$, a full frame.`, `$${a} + ${answer} = 10$，正好放满一个框。`],
              [
                [a, "That counts the full boxes. The question asks how many are empty.", "这数的是放了圆片的格子，题目问的是空格。"],
                [10, "That is the whole frame. Some boxes are already full.", "这是整个框，有些格子已经放了圆片。"],
              ],
              tenFramesFigure(a),
            )
          : solved(
              [
                `${name} has ${a} ${a === 1 ? thing.en.replace(/s$/, "") : thing.en} and wants 10. How many more ${thing.en} does ${name} need?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，想要 10 ${thing.unit}。还需要多少${thing.unit}？`,
              ],
              answer,
              [
                [
                  ["Say what is needed", "想想要求什么"],
                  [
                    `${name} has ${a} and wants 10, so find the number that makes 10 with ${a}.`,
                    `${name} 有 ${a} ${thing.unit}，想要 10 ${thing.unit}，所以要找和 ${a} 凑成 10 的数。`,
                  ],
                ],
                [["Find the partner", "找出另一半"], ["", ""], [`${a} + ${answer} = 10`]],
              ],
              [
                `Count on from ${a}: ${counts}. That reaches 10 after ${answer} ${answer === 1 ? "count" : "counts"}.`,
                `从 ${a} 往后数：${counts}，数了 ${answer} 次到 10。`,
              ],
              [
                [a, `That is how many ${name} already has.`, `这是 ${name} 已经有的个数。`],
                [10, `That is how many ${name} wants in all, not how many more.`, `这是 ${name} 想要的总数，不是还需要的个数。`],
                [a + 10, "This adds 10 on. The total should be 10.", "这是又加了 10，总数应该是 10。"],
              ],
            );
      },
      captioned(tenFramesFigure(7), "A ten-frame with 7 counters and 3 empty boxes.", "放了 7 个圆片、还有 3 个空格的十格框。"),
    ),
    earlyPoint(
      "adding-past-ten-by-making-ten",
      ["Adding past ten by making ten", "用凑十法加过十"],
      [
        "To add past ten, fill up to ten first, then add what is left. For $8 + 5$: 8 needs 2 to make ten. Split 5 into 2 and 3. $8 + 2 = 10$, and ten and 3 more is 13.\n\nCheck: count on 5 from 8: 9, 10, 11, 12, 13.\n\n> **Watch out.** After 2 moves over to make ten, only 3 are left to add, not 5.",
        "加过十时，先凑满十，再加剩下的。算 $8 + 5$：8 还差 2 就是十，把 5 分成 2 和 3。$8 + 2 = 10$，十再加 3 是 13。\n\n检验：从 8 往后数 5 个：9、10、11、12、13。\n\n> **注意。** 拿出 2 凑成十以后，只剩 3 要加，不是 5。",
      ],
      (rng) => {
        const a = rng.int(6, 9);
        const b = rng.int(11 - a, 9);
        const need = 10 - a;
        const rest = a + b - 10;
        const answer = a + b;
        const figure = tenFramesFigure(a, b);
        return rng.bool()
          ? solved(
              [
                `Fill the first frame to make ten. What number goes in the box? $${a} + ${b} = 10 + \\square$`,
                `先把第一个框放满，凑成十。方框里填几？$${a} + ${b} = 10 + \\square$`,
              ],
              rest,
              [
                [
                  ["Fill up to ten", "凑满十"],
                  [`${a} needs ${need} more to make ten.`, `${a} 还差 ${need} 就是十。`],
                  [`${a} + ${need} = 10`],
                ],
                [
                  ["Find what is left", "求剩下的"],
                  [`Take those ${need} from ${b}:`, `从 ${b} 里拿出这 ${need} 个：`],
                  [`${b} - ${need} = ${rest}`],
                ],
              ],
              [
                `$10 + ${rest} = ${answer}$, and $${a} + ${b} = ${answer}$ too.`,
                `$10 + ${rest} = ${answer}$，$${a} + ${b}$ 也等于 ${answer}。`,
              ],
              [
                [b, `That is all of ${b}. ${need} of it went to make ten.`, `这是整个 ${b}，其中 ${need} 个已经拿去凑十了。`],
                [need, "That is the part moved to make ten. The box is what is left.", "这是拿去凑十的部分，方框里是剩下的。"],
                [answer, "That is the whole sum. The box is what is added to 10.", "这是总和，方框里是加在 10 上的数。"],
              ],
              figure,
            )
          : solved(
              [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
              answer,
              [
                [
                  ["Make ten", "凑十"],
                  [`${a} needs ${need}. Split ${b} into ${need} and ${rest}.`, `${a} 差 ${need}，把 ${b} 分成 ${need} 和 ${rest}。`],
                  [`${a} + ${need} = 10`],
                ],
                [["Add the rest", "加上剩下的"], ["", ""], [`10 + ${rest} = ${answer}`]],
              ],
              [`Count on ${b} from ${a}: you reach ${answer}.`, `从 ${a} 往后数 ${b} 个，数到 ${answer}。`],
              [
                [rest, "That is only what is left after making ten. Add the ten too.", "这只是凑十后剩下的，还要加上十。"],
                [
                  10 + b,
                  `This adds all of ${b} to 10. But ${need} of them already went into the ten.`,
                  `这把整个 ${b} 加到了 10 上，可其中 ${need} 个已经用来凑十了。`,
                ],
                [answer - 1, "This is one short. Count the last one too.", "这少了 1，最后一个也要算上。"],
              ],
              figure,
            );
      },
      captioned(
        tenFramesFigure(8, 5),
        "8 filled and 5 hollow counters: 2 hollow counters fill the first frame and 3 are left.",
        "8 个实心圆片和 5 个空心圆片：2 个空心圆片放满第一个框，还剩 3 个。",
      ),
    ),
  ],
  [
    "Kim has 8 red beads and 5 blue beads. She moves 2 blue beads next to the red ones. Now she has a full ten, and 3 blue beads are left. Ten and 3 is 13.\n\nCheck: count on 5 from 8: 9, 10, 11, 12, 13.\n\nIn this lesson we learn the pairs that make ten, and use them to add past ten.",
    "金有 8 颗红珠子和 5 颗蓝珠子。她把 2 颗蓝珠子挪到红珠子旁边，凑成了一个十，还剩 3 颗蓝珠子。十和 3 是 13。\n\n检验：从 8 往后数 5 个：9、10、11、12、13。\n\n本课我们记住能凑成十的数对，并用它们计算超过十的加法。",
  ],
);

const doublesAndNearDoubles = earlyTopic(
  "doubles-and-near-doubles",
  ["Doubles and Near Doubles", "两个相同的数相加和相近的数相加"],
  [
    "Know sums of two equal numbers, and use them to add numbers that are next to each other.",
    "记住两个相同的数相加的结果，并用它们计算相邻的两个数相加。",
  ],
  ["counting-on-to-add"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "adding-a-number-to-itself",
      ["Adding a number to itself", "一个数加它自己"],
      [
        "A double is a number added to itself, like two rows of 6 eggs. Count on 6 from 6: 7, 8, 9, 10, 11, 12. So $6 + 6 = 12$. Doubles come up everywhere, so learn them by heart.\n\nCheck: the two rows match egg for egg, and 12 eggs fill 2 rows of 6.\n\n> **Watch out.** A double adds the number twice. $6 + 6$ is 12, not 6.",
        "两个相同的数相加，就像两排鸡蛋，每排 6 个。从 6 往后数 6 个：7、8、9、10、11、12。所以 $6 + 6 = 12$。这样的算式到处都用得上，要记熟。\n\n检验：两排鸡蛋一个对一个，12 个鸡蛋正好排成 2 排，每排 6 个。\n\n> **注意。** 要把这个数加两次。$6 + 6$ 是 12，不是 6。",
      ],
      (rng) => {
        const n = rng.int(2, 10);
        const answer = 2 * n;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const walk: readonly Walk[] = [
          [
            ["See two equal groups", "看出两组一样多"],
            [`There are two groups of ${n}.`, `有两组，每组 ${n}。`],
          ],
          [["Add the double", "相加"], ["", ""], [`${n} + ${n} = ${answer}`]],
        ];
        const check: Pair = [`Count on ${n} from ${n}: you reach ${answer}.`, `从 ${n} 往后数 ${n} 个，数到 ${answer}。`];
        return rng.bool()
          ? solved([`What is $${n} + ${n}$?`, `$${n} + ${n}$ 等于多少？`], answer, walk, check, [
              [n, `That is only one ${n}. A double adds it twice.`, `这只是一个 ${n}，要加两次。`],
              [n + 1, `This adds 1 instead of ${n}.`, `这加的是 1，不是 ${n}。`],
            ])
          : solved(
              [
                `${name} has ${n} ${thing.en} in each of two boxes. How many ${thing.en} is that?`,
                `${name} 有两个盒子，每个盒子里有 ${n} ${thing.unit}${thing.zh}。一共有多少${thing.unit}${thing.zh}？`,
              ],
              answer,
              walk,
              check,
              [
                [n, "That is one box. There are two boxes.", "这只是一个盒子里的，一共有两个盒子。"],
                [
                  n + 2,
                  `This counts the 2 boxes as 2 more ${thing.en}. Add ${n} for each box.`,
                  `这把 2 个盒子当成了 2 ${thing.unit}，每个盒子要加 ${n}。`,
                ],
              ],
            );
      },
      captioned(countersFigure(12, 6), "Two rows of 6 counters: 12 in all.", "两排圆片，每排 6 个：一共 12 个。"),
    ),
    earlyPoint(
      "using-a-double-you-know",
      ["Using a double you know", "用记住的算式"],
      [
        "When two numbers are next to each other, like 6 and 7, use a double. You know $6 + 6 = 12$. 7 is one more than 6, so $6 + 7$ is one more than 12. That is 13.\n\nCheck: use the other double. $7 + 7 = 14$, and one less is 13.\n\n> **Watch out.** Add just one to the double. $6 + 7$ is 13, not 14.",
        "两个数相邻时，比如 6 和 7，可以用两个相同的数相加。你知道 $6 + 6 = 12$。7 比 6 多 1，所以 $6 + 7$ 比 12 多 1，是 13。\n\n检验：用另一个算式。$7 + 7 = 14$，少 1 是 13。\n\n> **注意。** 只比相同数的和多 1。$6 + 7$ 是 13，不是 14。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const up = rng.bool();
        const [a, b] = up ? [n, n + 1] : [n + 1, n];
        const answer = 2 * n + 1;
        const walk: readonly Walk[] = [
          [["Find the double", "找相同数的和"], [`The smaller number is ${n}.`, `较小的数是 ${n}。`], [`${n} + ${n} = ${2 * n}`]],
          [
            ["Add one more", "再加 1"],
            [`${n + 1} is one more than ${n}, so add 1:`, `${n + 1} 比 ${n} 多 1，所以再加 1：`],
            [`${2 * n} + 1 = ${answer}`],
          ],
        ];
        const check: Pair = [
          `Use the bigger double: $${n + 1} + ${n + 1} = ${2 * n + 2}$, and one less is ${answer}.`,
          `用较大的数：$${n + 1} + ${n + 1} = ${2 * n + 2}$，少 1 是 ${answer}。`,
        ];
        const slips: readonly Slip[] = [
          [
            2 * n,
            `That is $${n} + ${n}$. One number is ${n + 1}, so add one more.`,
            `这是 $${n} + ${n}$。有一个数是 ${n + 1}，还要再加 1。`,
          ],
          [
            2 * n + 2,
            `That is $${n + 1} + ${n + 1}$. One number is ${n}, so it is one less.`,
            `这是 $${n + 1} + ${n + 1}$。有一个数是 ${n}，所以要少 1。`,
          ],
        ];
        return rng.bool()
          ? solved([`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`], answer, walk, check, slips)
          : solved(
              [
                `You know that $${n} + ${n} = ${2 * n}$. What is $${a} + ${b}$?`,
                `你知道 $${n} + ${n} = ${2 * n}$。$${a} + ${b}$ 等于多少？`,
              ],
              answer,
              walk,
              check,
              slips,
            );
      },
      captioned(countersFigure(13, 6), "Two rows of 6 counters and 1 more: 13.", "两排圆片，每排 6 个，再多 1 个：13。"),
    ),
  ],
  [
    "A spider has 4 legs on each side. That is $4 + 4 = 8$ legs. Two bikes have $2 + 2 = 4$ wheels. Doubles are easy to see, because both sides match.\n\nCheck: count the spider's legs one by one: 1, 2, 3, 4, 5, 6, 7, 8.\n\nIn this lesson we learn doubles by heart, and use them to add numbers that are next to each other.",
    "蜘蛛每边有 4 条腿，一共 $4 + 4 = 8$ 条腿。两辆自行车有 $2 + 2 = 4$ 个轮子。两个相同的数相加很好看出来，因为两边一样多。\n\n检验：把蜘蛛的腿一条一条地数：1、2、3、4、5、6、7、8。\n\n本课我们记熟两个相同的数相加，并用它们计算相邻的两个数相加。",
  ],
);

const addingInAnyOrder = earlyTopic(
  "adding-in-any-order",
  ["Adding in Any Order", "加数交换顺序"],
  ["See that swapping two addends keeps the sum the same.", "明白交换两个加数，和不变。"],
  ["counting-on-to-add"],
  ["1.OA.B.3"],
  [
    earlyPoint(
      "swapping-two-addends",
      ["Swapping two addends", "交换两个加数"],
      [
        "Two groups side by side can be seen from either side. Walk around them, and the groups swap places, but the counters stay the same. So $3 + 5$ and $5 + 3$ are both 8.\n\nCheck: count on 5 from 3, then count on 3 from 5. Both reach 8.\n\n> **Watch out.** In $3 + 5 = 5 + \\square$, the box holds the number that moved, 3. It is not the total, 8.",
        "两组圆片并排放着，从哪一边看都行。走到另一边，两组就换了位置，但圆片还是那些。所以 $3 + 5$ 和 $5 + 3$ 都是 8。\n\n检验：从 3 往后数 5 个，再从 5 往后数 3 个，都数到 8。\n\n> **注意。** 在 $3 + 5 = 5 + \\square$ 中，方框里是换了位置的那个数 3，不是总数 8。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a && v + a <= 20));
        return solved(
          [`What number goes in the box? $${a} + ${b} = ${b} + \\square$`, `方框里填几？$${a} + ${b} = ${b} + \\square$`],
          a,
          [
            [
              ["Look at both sides", "看两边"],
              [`The left side adds ${a} and ${b}. The right side adds ${b} and the box.`, `左边是 ${a} 加 ${b}，右边是 ${b} 加方框。`],
            ],
            [
              ["Swap the addends", "交换加数"],
              ["Swapping keeps the sum, so the box holds the other addend:", "交换加数和不变，所以方框里是另一个加数："],
              [`${a} + ${b} = ${b} + ${a}`],
            ],
          ],
          [
            `Both sides make ${a + b}: $${a} + ${b} = ${a + b}$ and $${b} + ${a} = ${a + b}$.`,
            `两边都是 ${a + b}：$${a} + ${b} = ${a + b}$，$${b} + ${a} = ${a + b}$。`,
          ],
          [
            [
              b,
              `That copies the ${b} already on the right. The box holds the other addend.`,
              `这照抄了右边已有的 ${b}，方框里是另一个加数。`,
            ],
            [a + b, "That is the sum. The box holds one addend.", "这是和，方框里是一个加数。"],
          ],
        );
      },
      captioned(
        tenFramesFigure(3, 5),
        "3 filled and 5 hollow counters: 8 from either side.",
        "3 个实心圆片和 5 个空心圆片：从哪边数都是 8。",
      ),
    ),
    earlyPoint(
      "using-a-known-sum",
      ["Using a sum you know", "用知道的和"],
      [
        "When you know one sum, its partner comes free. If $6 + 8 = 14$, then $8 + 6$ is also 14. Only the order changed, so the total stays.\n\nCheck: count on 6 from 8: 9, 10, 11, 12, 13, 14.\n\n> **Watch out.** Look before you count. The answer may already be on the page.",
        "知道一个和，与它相对的那个和也就知道了。如果 $6 + 8 = 14$，那么 $8 + 6$ 也是 14。只是顺序变了，总数不变。\n\n检验：从 8 往后数 6 个：9、10、11、12、13、14。\n\n> **注意。** 先看再数，答案可能已经写在题目里了。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.pick([3, 4, 5, 6, 7, 8].filter((v) => v !== a));
        const answer = a + b;
        return solved(
          [`You know that $${a} + ${b} = ${answer}$. What is $${b} + ${a}$?`, `你知道 $${a} + ${b} = ${answer}$。$${b} + ${a}$ 等于多少？`],
          answer,
          [
            [
              ["Compare the sums", "比较两个算式"],
              [
                `$${b} + ${a}$ has the same addends as $${a} + ${b}$, in swapped order.`,
                `$${b} + ${a}$ 和 $${a} + ${b}$ 的加数相同，只是换了顺序。`,
              ],
            ],
            [["Use the known sum", "用知道的和"], ["So it has the same total:", "所以总数一样："], [`${b} + ${a} = ${answer}`]],
          ],
          [`Count on ${a} from ${b}: you reach ${answer}.`, `从 ${b} 往后数 ${a} 个，数到 ${answer}。`],
          [
            [a, "That is one addend, not the sum.", "这是一个加数，不是和。"],
            [b, "That is one addend, not the sum.", "这是一个加数，不是和。"],
            [Math.abs(a - b), "This subtracts. The sign is plus.", "这是做了减法，符号是加号。"],
          ],
        );
      },
      captioned(tenFramesFigure(6, 8), "6 filled and 8 hollow counters: 14 in all.", "6 个实心圆片和 8 个空心圆片：一共 14 个。"),
    ),
  ],
  [
    "Jo lines up 3 red cars and then 5 blue cars. Her friend looks from the other side. He sees 5 blue cars and then 3 red cars. It is the same 8 cars.\n\nCheck: $3 + 5 = 8$ and $5 + 3 = 8$.\n\nIn this lesson we see that swapping two addends keeps the sum the same.",
    "乔先摆了 3 辆红色小汽车，又摆了 5 辆蓝色小汽车。她的朋友从另一边看，先看到 5 辆蓝色的，再看到 3 辆红色的。还是那 8 辆车。\n\n检验：$3 + 5 = 8$，$5 + 3 = 8$。\n\n本课我们明白交换两个加数，和不变。",
  ],
);

const addingThreeNumbers = earlyTopic(
  "adding-three-numbers-within-20",
  ["Adding Three Numbers Within 20", "20 以内三个数相加"],
  ["Add three numbers, choosing which two to add first.", "把三个数相加，并选择先加哪两个。"],
  ["making-ten-to-add", "adding-in-any-order"],
  ["1.OA.B.3", "1.OA.A.2"],
  [
    earlyPoint(
      "adding-three-in-a-row",
      ["Adding three in a row", "连加三个数"],
      [
        "To add three numbers, add two of them first. Then add the third to that. For $3 + 4 + 5$: $3 + 4 = 7$, then $7 + 5 = 12$.\n\nCheck: add in another order. $4 + 5 = 9$, then $9 + 3 = 12$. The answer is the same.\n\n> **Watch out.** Do not stop after two numbers. All three must be added.",
        "三个数相加，先加其中两个，再把第三个加上去。算 $3 + 4 + 5$：$3 + 4 = 7$，再算 $7 + 5 = 12$。\n\n检验：换个顺序加。$4 + 5 = 9$，再算 $9 + 3 = 12$，答案一样。\n\n> **注意。** 不要加了两个数就停下，三个数都要加。",
      ],
      (rng) => {
        const a = rng.int(2, 8);
        const b = rng.int(2, 7);
        const c = rng.int(2, Math.min(9, 20 - a - b));
        const answer = a + b + c;
        return solved(
          [`What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c}$ 等于多少？`],
          answer,
          [
            [["Add the first two", "先加前两个"], ["", ""], [`${a} + ${b} = ${a + b}`]],
            [["Add the third", "再加第三个"], ["", ""], [`${a + b} + ${c} = ${answer}`]],
          ],
          [
            `Add the last two first: $${b} + ${c} = ${b + c}$, then $${b + c} + ${a} = ${answer}$.`,
            `先加后两个：$${b} + ${c} = ${b + c}$，再算 $${b + c} + ${a} = ${answer}$。`,
          ],
          [
            [a + b, `That stops after the first two numbers. Add ${c} too.`, `这只加了前两个数，还要加 ${c}。`],
            [b + c, `That leaves out ${a}.`, `这漏掉了 ${a}。`],
            [a + c, `That leaves out ${b}.`, `这漏掉了 ${b}。`],
          ],
        );
      },
      captioned(partWholeBarFigure([3, 4, 5], 9), "A bar of 12 split into parts of 3, 4 and 5.", "一个长条表示 12，分成 3、4、5 三段。"),
    ),
    earlyPoint(
      "finding-the-pair-that-makes-ten",
      ["Finding the pair that makes ten", "找出凑成十的一对"],
      [
        "Before adding three numbers, look for two that make ten. Add those first, even if they are not next to each other. For $7 + 4 + 3$, 7 and 3 make ten. Ten and 4 is 14.\n\nCheck: add in order instead. $7 + 4 = 11$, then $11 + 3 = 14$.\n\n> **Watch out.** The pair must make exactly 10. 7 and 4 make 11, not ten.",
        "三个数相加前，先找能凑成十的两个数，先加它们，即使它们不挨着。算 $7 + 4 + 3$，7 和 3 凑成十，十再加 4 是 14。\n\n检验：按顺序加。$7 + 4 = 11$，再算 $11 + 3 = 14$。\n\n> **注意。** 这两个数要正好凑成 10。7 和 4 是 11，不是十。",
      ],
      (rng) => {
        const k = rng.int(1, 4);
        const other = rng.pick([2, 3, 4, 5, 6, 7, 8].filter((v) => v !== k && v !== 10 - k && v + k !== 10 && v + (10 - k) !== 10));
        const nums = rng.shuffle([k, 10 - k, other]);
        const shown = nums.join(" + ");
        return pickedMath(
          rng,
          [`To work out $${shown}$, which two numbers should you add first to make ten?`, `要算 $${shown}$，应该先加哪两个数来凑成十？`],
          `${k} + ${10 - k}`,
          [
            [`${k} + ${other}`, `$${k} + ${other} = ${k + other}$, which is not 10.`, `$${k} + ${other} = ${k + other}$，不是 10。`],
            [
              `${10 - k} + ${other}`,
              `$${10 - k} + ${other} = ${10 - k + other}$, which is not 10.`,
              `$${10 - k} + ${other} = ${10 - k + other}$，不是 10。`,
            ],
            [
              `${other} + ${other}`,
              `This uses ${other} twice, and $${other} + ${other} = ${2 * other}$, which is not 10.`,
              `这把 ${other} 用了两次，而且 $${other} + ${other} = ${2 * other}$，不是 10。`,
            ],
          ],
          [
            [
              ["Look for ten", "找十"],
              [`Try the pairs. $${k} + ${10 - k} = 10$.`, `试一试每一对。$${k} + ${10 - k} = 10$。`],
            ],
            [
              ["Add the last number", "加上剩下的数"],
              [`Ten and ${other} is easy to read:`, `十加 ${other} 一下就能读出来：`],
              [`10 + ${other} = ${10 + other}`],
            ],
          ],
          [
            `Add another pair first: $${k} + ${other} = ${k + other}$, then $${k + other} + ${10 - k} = ${10 + other}$. The total is the same.`,
            `先加另一对：$${k} + ${other} = ${k + other}$，再算 $${k + other} + ${10 - k} = ${10 + other}$，总数一样。`,
          ],
        );
      },
      captioned(
        tenFramesFigure(7, 3),
        "7 filled and 3 hollow counters fill one ten-frame.",
        "7 个实心圆片和 3 个空心圆片正好放满一个十格框。",
      ),
    ),
  ],
  [
    "Sam picks 4 apples, then 6 apples, then 3 apples. He sees that 4 and 6 make 10. Ten and 3 more is 13. So he has 13 apples.\n\nCheck: add in another order. $6 + 3 = 9$, then $9 + 4 = 13$.\n\nIn this lesson we add three numbers, and choose a good pair to add first.",
    "萨姆先摘了 4 个苹果，又摘了 6 个，再摘了 3 个。他发现 4 和 6 凑成 10，十再加 3 是 13。所以他有 13 个苹果。\n\n检验：换个顺序加。$6 + 3 = 9$，再算 $9 + 4 = 13$。\n\n本课我们把三个数相加，并选好先加的一对。",
  ],
);

const subtractingThroughTen = earlyTopic(
  "subtracting-through-ten",
  ["Subtracting Through Ten", "破十法"],
  ["Subtract from a teen number by stepping back to ten first.", "从十几减去一个数时，先退到十。"],
  ["counting-back-to-subtract", "making-ten-to-add"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "stepping-back-to-ten",
      ["Stepping back to ten", "先退到十"],
      [
        "To take away from a teen number, stop at ten on the way. For $14 - 6$: 14 is 4 more than ten, so take 4 first. That lands on 10. 6 is 4 and 2, so 2 more are left to take.\n\nCheck: $4 + 2 = 6$, so all 6 are taken.\n\n> **Watch out.** The 4 is already taken. Only 2 more are left to take, not 6.",
        "从十几里减去一个数，中间在十停一下。算 $14 - 6$：14 比十多 4，所以先减 4，落在 10 上。6 是 4 和 2，所以还要再减 2。\n\n检验：$4 + 2 = 6$，6 个都减掉了。\n\n> **注意。** 4 已经减过了，只要再减 2，不是 6。",
      ],
      (rng) => {
        const a = rng.int(11, 18);
        const first = a - 10;
        const b = rng.int(first + 1, 9);
        const more = b - first;
        return solved(
          [
            `To work out $${a} - ${b}$, first take away ${first} to reach 10. How much more do you need to take away?`,
            `要算 $${a} - ${b}$，先减 ${first} 到 10。还要再减多少？`,
          ],
          more,
          [
            [["Go back to ten", "退到十"], ["", ""], [`${a} - ${first} = 10`]],
            [
              ["Find what is left to take", "求还要减的"],
              [`${b} is ${first} and some more:`, `${b} 是 ${first} 和另一个数：`],
              [`${b} - ${first} = ${more}`],
            ],
          ],
          [`$${first} + ${more} = ${b}$, so the two parts take away all ${b}.`, `$${first} + ${more} = ${b}$，两次一共减了 ${b}。`],
          [
            [b, `That is all of ${b}. ${first} of it is already taken.`, `这是整个 ${b}，其中 ${first} 已经减过了。`],
            [
              first,
              "That is the first part, which reaches 10. The question asks how much more.",
              "这是第一次减的，它让你退到 10。题目问的是还要减多少。",
            ],
            [a - b, "That is the final answer of the subtraction, not how much more to take.", "这是减法最后的得数，不是还要减多少。"],
          ],
          hopsFigure([a, 10, a - b], true, 1),
        );
      },
      captioned(
        hopsFigure([14, 10, 8]),
        "A number line: a hop back 4 from 14 to 10, then 2 more to 8.",
        "数轴：从 14 往回跳 4 到 10，再跳 2 到 8。",
      ),
    ),
    earlyPoint(
      "subtracting-from-teen-numbers",
      ["Subtracting from teen numbers", "十几减几"],
      [
        "Now do the whole thing. For $13 - 5$: the ones digit 3 tells you to take 3 to land on 10. Then take the other 2 from 10. That leaves 8.\n\nCheck: add back. $8 + 5 = 13$.\n\n> **Watch out.** Do not take the small ones digit from the bigger number. $5 - 3 = 2$ gives 12, which is wrong.",
        "现在把整个方法用起来。算 $13 - 5$：个位 3 告诉你先减 3，落在 10 上。再用 10 减去剩下的 2，得 8。\n\n检验：加回去。$8 + 5 = 13$。\n\n> **注意。** 不要反过来用大数减个位的小数。$5 - 3 = 2$ 得出 12，是错的。",
      ],
      (rng) => {
        const a = rng.int(11, 18);
        const first = a - 10;
        const b = rng.int(first + 1, 9);
        const answer = a - b;
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Go back to ten", "退到十"],
              [`The ones digit is ${first}, so take ${first} first.`, `个位是 ${first}，所以先减 ${first}。`],
              [`${a} - ${first} = 10`],
            ],
            [
              ["Take the rest from ten", "用十减剩下的"],
              [
                `${b} is ${first} and ${b - first}, so take ${b - first} more.`,
                `${b} 是 ${first} 和 ${b - first}，所以再减 ${b - first}。`,
              ],
              [`10 - ${b - first} = ${answer}`],
            ],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去：$${answer} + ${b} = ${a}$。`],
          [
            [a + b, "This adds. The sign is minus.", "这是做了加法，符号是减号。"],
            [
              10 + b - first,
              `This takes ${first} from ${b}, the wrong way round. We take ${b} from ${a}.`,
              `这是用 ${b} 减 ${first}，减反了。要用 ${a} 减 ${b}。`,
            ],
            [b - first, "That is the second part to take away, not what is left.", "这是第二次要减的数，不是剩下的数。"],
            [answer + 1, `This is one too many. Count back ${b} whole steps.`, `这多了 1，要往回数满 ${b} 步。`],
          ],
        );
      },
      captioned(
        hopsFigure([13, 10, 8]),
        "A number line: a hop back 3 from 13 to 10, then 2 more to 8.",
        "数轴：从 13 往回跳 3 到 10，再跳 2 到 8。",
      ),
    ),
  ],
  [
    "Ana has 13 stickers. She gives 5 to a friend. First she gives 3, and she has 10 left. Then she gives 2 more, and she has 8 left.\n\nCheck: $8 + 5 = 13$, so 8 and the 5 she gave make 13.\n\nIn this lesson we take away from a teen number by going back to ten first.",
    "安娜有 13 张贴纸，她送给朋友 5 张。她先送 3 张，还剩 10 张；再送 2 张，还剩 8 张。\n\n检验：$8 + 5 = 13$，剩下的 8 张和送出的 5 张合起来是 13 张。\n\n本课我们从十几里减去一个数时，先退到十。",
  ],
);

const relatedFacts = earlyTopic(
  "related-addition-and-subtraction-facts",
  ["Related Addition and Subtraction Facts", "相关的加减算式"],
  ["Use an addition fact to find a subtraction, and spot facts from the same family.", "用加法算式求减法，并找出同一家的算式。"],
  ["counting-back-to-subtract", "adding-in-any-order"],
  ["1.OA.B.4", "1.OA.C.6"],
  [
    earlyPoint(
      "subtraction-from-a-known-sum",
      ["Subtraction from a known sum", "由知道的和求差"],
      [
        "Two parts make a whole. Take one part away, and the other part is left. You know $8 + 5 = 13$. So $13 - 5 = 8$.\n\nCheck: count back 5 from 13: 12, 11, 10, 9, 8.\n\n> **Watch out.** Taking away 5 leaves the other part, 8. The answer is not 5.",
        "两部分合成一个整体。拿走一部分，就剩下另一部分。你知道 $8 + 5 = 13$，所以 $13 - 5 = 8$。\n\n检验：从 13 往回数 5 个：12、11、10、9、8。\n\n> **注意。** 减去 5 剩下的是另一部分 8，答案不是 5。",
      ],
      (rng) => {
        const a = rng.int(3, 11);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        return solved(
          [`You know that $${a} + ${b} = ${c}$. What is $${c} - ${b}$?`, `你知道 $${a} + ${b} = ${c}$。$${c} - ${b}$ 等于多少？`],
          a,
          [
            [
              ["Find the whole and the parts", "找出整体和部分"],
              [`The whole is ${c}. The parts are ${a} and ${b}.`, `整体是 ${c}，两部分是 ${a} 和 ${b}。`],
            ],
            [
              ["Take one part away", "拿走一部分"],
              [`Taking ${b} away leaves the other part:`, `拿走 ${b}，剩下另一部分：`],
              [`${c} - ${b} = ${a}`],
            ],
          ],
          [`Count back ${b} from ${c}: you land on ${a}.`, `从 ${c} 往回数 ${b} 个，落在 ${a} 上。`],
          [
            [b, "That is the part taken away. The other part is left.", "这是拿走的部分，剩下的是另一部分。"],
            [c, "That is the whole. Some of it was taken away.", "这是整体，已经拿走了一部分。"],
            [c + b, "This adds. The sign is minus.", "这是做了加法，符号是减号。"],
          ],
          partWholeBarFigure([a, b], 0),
        );
      },
      captioned(partWholeBarFigure([8, 5], 2), "A bar of 13 made of parts 8 and 5.", "一个表示 13 的长条，由 8 和 5 两部分组成。"),
    ),
    earlyPoint(
      "facts-in-the-same-family",
      ["Facts in the same family", "同一家的算式"],
      [
        "A fact family uses one whole and its two parts. For 8, 5 and 13, the whole is 13. The family is $8 + 5 = 13$, $5 + 8 = 13$, $13 - 5 = 8$ and $13 - 8 = 5$.\n\nCheck: in each fact, the parts 8 and 5 make the whole 13.\n\n> **Watch out.** In a subtraction, the whole comes first. $5 - 8 = 13$ is not true.",
        "一家算式用一个整体和它的两部分。8、5、13 这三个数中，整体是 13。这一家是 $8 + 5 = 13$、$5 + 8 = 13$、$13 - 5 = 8$ 和 $13 - 8 = 5$。\n\n检验：每个算式里，8 和 5 两部分都合成整体 13。\n\n> **注意。** 减法里整体要写在最前面。$5 - 8 = 13$ 是错的。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.pick([3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        return pickedMath(
          rng,
          [
            `Which of these is true and uses the same three numbers as $${a} + ${b} = ${c}$?`,
            `下面哪个算式是对的，并且和 $${a} + ${b} = ${c}$ 用同样的三个数？`,
          ],
          `${c} - ${a} = ${b}`,
          [
            [`${c} - ${a} = ${a}`, `$${c} - ${a}$ is ${b}, not ${a}.`, `$${c} - ${a}$ 是 ${b}，不是 ${a}。`],
            [`${a} - ${b} = ${c}`, `The whole, ${c}, must come first when you subtract.`, `做减法时，整体 ${c} 要写在最前面。`],
            [`${c} + ${a} = ${b}`, `Adding to ${c} gives more than ${c}, not ${b}.`, `${c} 加上一个数会比 ${c} 大，不会是 ${b}。`],
          ],
          [
            [
              ["Find the whole", "找出整体"],
              [`The whole is ${c}. The parts are ${a} and ${b}.`, `整体是 ${c}，两部分是 ${a} 和 ${b}。`],
            ],
            [["Take a part from the whole", "用整体减一部分"], ["", ""], [`${c} - ${a} = ${b}`]],
          ],
          [`Add back: $${b} + ${a} = ${c}$.`, `加回去：$${b} + ${a} = ${c}$。`],
          partWholeBarFigure([a, b], 2),
        );
      },
      captioned(partWholeBarFigure([8, 5], 2), "A bar of 13 made of parts 8 and 5.", "一个表示 13 的长条，由 8 和 5 两部分组成。"),
    ),
  ],
  [
    "Tom has 8 red fish and 5 yellow fish. That is 13 fish. Then the 5 yellow fish swim away. The 8 red fish are left.\n\nCheck: $8 + 5 = 13$, and $13 - 5 = 8$.\n\nIn this lesson we use an addition fact to find a subtraction, and find facts in the same family.",
    "汤姆有 8 条红鱼和 5 条黄鱼，一共 13 条。后来 5 条黄鱼游走了，剩下 8 条红鱼。\n\n检验：$8 + 5 = 13$，$13 - 5 = 8$。\n\n本课我们用加法算式求减法，并找出同一家的算式。",
  ],
);

const missingAddends = earlyTopic(
  "missing-addends-within-20",
  ["Missing Addends Within 20", "20 以内的未知加数"],
  ["Find the unknown number in an addition or subtraction sentence within 20.", "求出 20 以内加减算式中的未知数。"],
  ["related-addition-and-subtraction-facts"],
  ["1.OA.D.8"],
  [
    earlyPoint(
      "the-box-in-an-addition",
      ["The box in an addition", "加法里的方框"],
      [
        "A box stands for a number we do not know yet. In $9 + \\square = 13$, the box is a missing part. Count up from 9 to 13: 10, 11, 12, 13. That is 4 counts, so the box is 4.\n\nCheck: $13 - 9 = 4$.\n\n> **Watch out.** The box is a part, not the total. Do not write 13.",
        "方框表示一个还不知道的数。在 $9 + \\square = 13$ 中，方框是缺少的一部分。从 9 往上数到 13：10、11、12、13，数了 4 次，所以方框里是 4。\n\n检验：$13 - 9 = 4$。\n\n> **注意。** 方框是一部分，不是总数，不要填 13。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const answer = rng.int(2, 8);
        const c = a + answer;
        const first = rng.bool();
        const shown = first ? `${a} + \\square = ${c}` : `\\square + ${a} = ${c}`;
        return solved(
          [`What number goes in the box? $${shown}$`, `方框里填几？$${shown}$`],
          answer,
          [
            [
              ["Find the total and the part", "找出总数和已知部分"],
              [`The total is ${c}. One part is ${a}.`, `总数是 ${c}，一部分是 ${a}。`],
            ],
            [
              ["Count up to the total", "往上数到总数"],
              [`From ${a} to ${c} is ${answer} counts:`, `从 ${a} 数到 ${c} 要数 ${answer} 次：`],
              [`${a} + ${answer} = ${c}`],
            ],
          ],
          [`Subtract instead: $${c} - ${a} = ${answer}$.`, `用减法算：$${c} - ${a} = ${answer}$。`],
          [
            [c, "That is the total. The box is a part.", "这是总数，方框里是一部分。"],
            [
              a + c,
              "This adds the two numbers. The box plus the part must make the total.",
              "这是把两个数加起来了。方框里的数加上已知部分要等于总数。",
            ],
            [a, `That copies the part you know. The box is the other part.`, `这照抄了已知的部分，方框里是另一部分。`],
          ],
          partWholeBarFigure(first ? [a, answer] : [answer, a], first ? 1 : 0),
        );
      },
      captioned(
        partWholeBarFigure([9, 4], 1),
        "A bar of 13 made of 9 and a missing part.",
        "一个表示 13 的长条，由 9 和一个未知部分组成。",
      ),
    ),
    earlyPoint(
      "the-box-in-a-subtraction",
      ["The box in a subtraction", "减法里的方框"],
      [
        "In $13 - \\square = 8$, some were taken from 13, and 8 are left. So 13 is made of 8 and the box. Count up from 8 to 13: 9, 10, 11, 12, 13. That is 5.\n\nCheck: $13 - 5 = 8$.\n\n> **Watch out.** The box is what was taken away, not what is left. It is 5, not 8.",
        "在 $13 - \\square = 8$ 中，从 13 里拿走一些，还剩 8。所以 13 由 8 和方框里的数组成。从 8 往上数到 13：9、10、11、12、13，数了 5 次。\n\n检验：$13 - 5 = 8$。\n\n> **注意。** 方框是拿走的数，不是剩下的数。是 5，不是 8。",
      ],
      (rng) => {
        const answer = rng.int(2, 9);
        const left = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => v !== answer));
        const c = answer + left;
        return solved(
          [`What number goes in the box? $${c} - \\square = ${left}$`, `方框里填几？$${c} - \\square = ${left}$`],
          answer,
          [
            [
              ["Find the parts", "找出两部分"],
              [`${c} is made of what is left, ${left}, and the box.`, `${c} 由剩下的 ${left} 和方框里的数组成。`],
            ],
            [
              ["Count up", "往上数"],
              [`From ${left} to ${c} is ${answer} counts:`, `从 ${left} 数到 ${c} 要数 ${answer} 次：`],
              [`${left} + ${answer} = ${c}`],
            ],
          ],
          [`Put it back in: $${c} - ${answer} = ${left}$.`, `放回算式里：$${c} - ${answer} = ${left}$。`],
          [
            [left, "That is what is left. The box is what was taken away.", "这是剩下的数，方框里是拿走的数。"],
            [c, "That is the number at the start, before anything was taken.", "这是开始时的数，还没有拿走。"],
            [
              c + left,
              `This adds the two numbers. Count up from ${left} to ${c} instead.`,
              `这是把两个数加起来了，应该从 ${left} 往上数到 ${c}。`,
            ],
          ],
          partWholeBarFigure([answer, left], 0),
        );
      },
      captioned(
        partWholeBarFigure([5, 8], 0),
        "A bar of 13 made of a missing part and 8.",
        "一个表示 13 的长条，由一个未知部分和 8 组成。",
      ),
    ),
  ],
  [
    "Mia needs 12 cups for a party. She has 8 cups. How many more does she need? She counts up from 8: 9, 10, 11, 12. That is 4 more cups.\n\nCheck: $8 + 4 = 12$.\n\nIn this lesson we find the number in the box in an addition or a subtraction.",
    "米娅开派对要 12 个杯子，她有 8 个，还要几个？她从 8 往上数：9、10、11、12，还要 4 个。\n\n检验：$8 + 4 = 12$。\n\n本课我们求出加法或减法算式里方框中的数。",
  ],
);

const theEqualSign = earlyTopic(
  "the-equal-sign",
  ["The Equal Sign", "等号"],
  ["Understand that the equal sign means both sides have the same value.", "明白等号表示两边的值相同。"],
  ["related-addition-and-subtraction-facts"],
  ["1.OA.D.7"],
  [
    earlyPoint(
      "which-sentence-is-true",
      ["Which sentence is true", "哪个算式是对的"],
      [
        "The equal sign means both sides are worth the same, like a level balance. Is $3 + 4 = 5 + 2$ true? The left side is 7. The right side is 7. They match, so it is true.\n\nCheck: line up 7 counters. Split them as 3 and 4, then as 5 and 2.\n\n> **Watch out.** The equal sign does not mean the answer comes next. $9 = 4 + 5$ is true too.",
        "等号表示两边一样多，就像平衡的天平。$3 + 4 = 5 + 2$ 对吗？左边是 7，右边也是 7，一样多，所以是对的。\n\n检验：摆 7 个圆片，可以分成 3 和 4，也可以分成 5 和 2。\n\n> **注意。** 等号后面不一定是得数。$9 = 4 + 5$ 也是对的。",
      ],
      (rng) => {
        const s = rng.int(6, 15);
        const p = rng.int(1, s - 1);
        const q = rng.pick([...Array(s - 1).keys()].map((v) => v + 1).filter((v) => v !== p && v !== s - p));
        const form = rng.int(0, 2);
        const correct = form === 0 ? `${p} + ${s - p} = ${q} + ${s - q}` : form === 1 ? `${s} = ${p} + ${s - p}` : `${s} = ${s}`;
        const check: Pair =
          form === 0
            ? [
                `${s} counters can be split as ${p} and ${s - p}, and also as ${q} and ${s - q}.`,
                `${s} 个圆片可以分成 ${p} 和 ${s - p}，也可以分成 ${q} 和 ${s - q}。`,
              ]
            : form === 1
              ? [`${s} counters can be split as ${p} and ${s - p}.`, `${s} 个圆片可以分成 ${p} 和 ${s - p}。`]
              : [`A number is always worth the same as itself.`, `一个数总是和它自己一样多。`];
        return pickedMath(
          rng,
          ["Which of these is true?", "下面哪个算式是对的？"],
          correct,
          [
            [
              `${p} + ${s - p} = ${q} + ${s - q + 1}`,
              `The left side is ${s}, but the right side is ${s + 1}.`,
              `左边是 ${s}，右边是 ${s + 1}。`,
            ],
            [`${s} = ${p} + ${s - p + 1}`, `The right side is ${s + 1}, not ${s}.`, `右边是 ${s + 1}，不是 ${s}。`],
            [`${s} = ${s + 1}`, `${s} and ${s + 1} are not the same number.`, `${s} 和 ${s + 1} 不是同一个数。`],
          ],
          [
            [
              ["Work out each side", "分别算出两边"],
              [`In $${correct}$, the left side is ${s} and the right side is ${s}.`, `在 $${correct}$ 中，左边是 ${s}，右边也是 ${s}。`],
            ],
            [
              ["Compare the sides", "比较两边"],
              [`Both sides are ${s}, so the sentence is true.`, `两边都是 ${s}，所以这个算式是对的。`],
            ],
          ],
          check,
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [7, 7], "none"),
        "Bar A is 3 + 4 and bar B is 5 + 2. Both are 7 long.",
        "长条 A 是 3 + 4，长条 B 是 5 + 2，两个都是 7。",
      ),
    ),
    earlyPoint(
      "balancing-both-sides",
      ["Balancing both sides", "让两边相等"],
      [
        "In $5 + 4 = \\square + 3$, work out the side you can first: $5 + 4 = 9$. The other side must be 9 too. What goes with 3 to make 9? It is 6.\n\nCheck: $6 + 3 = 9$, and $5 + 4 = 9$. The sides match.\n\n> **Watch out.** Do not write 9 in the box. Then the right side would be $9 + 3 = 12$.",
        "在 $5 + 4 = \\square + 3$ 中，先算能算的一边：$5 + 4 = 9$。另一边也必须是 9。几和 3 合成 9？是 6。\n\n检验：$6 + 3 = 9$，$5 + 4 = 9$，两边一样多。\n\n> **注意。** 方框里不要填 9，那样右边就是 $9 + 3 = 12$ 了。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const s = a + b;
        const c = rng.pick([...Array(s - 1).keys()].map((v) => v + 1).filter((v) => v !== a && v !== b));
        const answer = s - c;
        return solved(
          [`What number goes in the box? $${a} + ${b} = \\square + ${c}$`, `方框里填几？$${a} + ${b} = \\square + ${c}$`],
          answer,
          [
            [["Work out the left side", "算出左边"], ["", ""], [`${a} + ${b} = ${s}`]],
            [
              ["Make the right side match", "让右边一样多"],
              [`The right side must also be ${s}:`, `右边也必须是 ${s}：`],
              [`${s} - ${c} = ${answer}`],
            ],
          ],
          [
            `Put it in: $${answer} + ${c} = ${s}$, the same as $${a} + ${b}$.`,
            `放进去：$${answer} + ${c} = ${s}$，和 $${a} + ${b}$ 一样。`,
          ],
          [
            [
              s,
              `That is the left side. Then the right side would be $${s} + ${c} = ${s + c}$.`,
              `这是左边的和。那样右边就是 $${s} + ${c} = ${s + c}$。`,
            ],
            [s + c, "This adds all three numbers. The two sides must match.", "这是把三个数都加起来了，两边要一样多。"],
            [c, `That copies the ${c} already on the right.`, `这照抄了右边已有的 ${c}。`],
          ],
          partWholeBarFigure([answer, c], 0),
        );
      },
      captioned(partWholeBarFigure([6, 3], 0), "A bar of 9 made of a missing part and 3.", "一个表示 9 的长条，由一个未知部分和 3 组成。"),
    ),
  ],
  [
    "Leo puts 3 red blocks and 4 blue blocks on one side of a balance. On the other side he puts 5 green blocks and 2 yellow blocks. The balance stays level. Both sides hold 7 blocks, so we write $3 + 4 = 5 + 2$.\n\nCheck: $3 + 4 = 7$ and $5 + 2 = 7$.\n\nIn this lesson we learn that the equal sign means both sides are worth the same.",
    "利奥在天平一边放 3 块红积木和 4 块蓝积木，另一边放 5 块绿积木和 2 块黄积木。天平保持平衡。两边都是 7 块，所以我们写 $3 + 4 = 5 + 2$。\n\n检验：$3 + 4 = 7$，$5 + 2 = 7$。\n\n本课我们知道等号表示两边一样多。",
  ],
);

const addingToStories = earlyTopic(
  "adding-to-word-problems",
  ["Adding Stories Within 20", "20 以内的加法故事"],
  ["Solve stories within 20 about more arriving or about two groups put together.", "解决 20 以内关于又来了一些，或把两组合起来的故事。"],
  ["counting-on-to-add"],
  ["1.OA.A.1"],
  [
    earlyPoint(
      "more-come-along",
      ["More come along", "又来了一些"],
      [
        "Sam has 6 shells. He finds 3 more. The group gets bigger, so add: $6 + 3 = 9$.\n\nCheck: count on 3 from 6: 7, 8, 9.\n\n> **Watch out.** Use both numbers in the story. The answer is not just the 3 he found.",
        "萨姆有 6 个贝壳，又找到 3 个。东西变多了，所以用加法：$6 + 3 = 9$。\n\n检验：从 6 往后数 3 个：7、8、9。\n\n> **注意。** 故事里的两个数都要用上，答案不只是他找到的 3 个。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(3, 12);
        const b = rng.int(2, Math.min(8, 20 - a));
        const answer = a + b;
        return solved(
          [
            `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [
              ["Choose add or take away", "选加法还是减法"],
              [`${name} gets more, so the amount grows. Add.`, `${name} 又得到一些，数量变多了，用加法。`],
            ],
            [["Add", "相加"], ["", ""], [`${a} + ${b} = ${answer}`]],
          ],
          [`Add in the other order: $${b} + ${a} = ${answer}$.`, `交换顺序再加：$${b} + ${a} = ${answer}$。`],
          [
            [a, `That is how many ${name} had before getting more.`, `这是 ${name} 原来有的个数，还没加上新得到的。`],
            [b, "That is only the new ones.", "这只是新得到的。"],
            [Math.abs(a - b), "This subtracts. Getting more makes the amount bigger.", "这是做了减法。又得到一些，数量应该变多。"],
          ],
          partWholeBarFigure([a, b], -1),
        );
      },
      captioned(
        partWholeBarFigure([6, 3], -1),
        "A bar model: parts 6 and 3, and the whole unknown.",
        "线段图：两部分是 6 和 3，整体未知。",
      ),
    ),
    earlyPoint(
      "two-groups-together",
      ["Two groups together", "两组合起来"],
      [
        'There are 7 apples in a bowl and 5 in a bag. Nothing moves. But the question asks how many in all. Put the two groups together: $7 + 5 = 12$.\n\nCheck: make ten. 7 and 3 make 10, and 2 more is 12.\n\n> **Watch out.** "In all" means both groups. Do not answer with just one group.',
        "碗里有 7 个苹果，袋子里有 5 个。苹果没有动，可是题目问一共有多少。把两组合起来：$7 + 5 = 12$。\n\n检验：凑十。7 和 3 凑成 10，再多 2 是 12。\n\n> **注意。** “一共”是两组都算上，不要只答一组。",
      ],
      (rng) => {
        const thing = rng.pick(earlyThings);
        const place = rng.pick([
          { en: "on a table and", where: "on a shelf", zh1: "桌子上", zh2: "架子上" },
          { en: "in a box and", where: "in a bag", zh1: "盒子里", zh2: "袋子里" },
          { en: "on the floor and", where: "on a chair", zh1: "地上", zh2: "椅子上" },
        ]);
        const a = rng.int(3, 12);
        const b = rng.int(2, Math.min(8, 20 - a));
        const answer = a + b;
        return solved(
          [
            `There are ${a} ${thing.en} ${place.en} ${b} ${place.where}. How many ${thing.en} are there in all?`,
            `${place.zh1}有 ${a} ${thing.unit}${thing.zh}，${place.zh2}有 ${b} ${thing.unit}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [
              ["Find the two groups", "找出两组"],
              [`One group has ${a}. The other has ${b}.`, `一组有 ${a} ${thing.unit}，另一组有 ${b} ${thing.unit}。`],
            ],
            [["Put them together", "合起来"], ["", ""], [`${a} + ${b} = ${answer}`]],
          ],
          [`Count on ${b} from ${a}: you reach ${answer}.`, `从 ${a} 往后数 ${b} 个，数到 ${answer}。`],
          [
            [a, "That is only the first group.", "这只是第一组。"],
            [b, "That is only the second group.", "这只是第二组。"],
            [Math.abs(a - b), "This subtracts. In all means put the groups together.", "这是做了减法。“一共”要把两组合起来。"],
          ],
          partWholeBarFigure([a, b], -1),
        );
      },
      captioned(
        partWholeBarFigure([7, 5], -1),
        "A bar model: parts 7 and 5, and the whole unknown.",
        "线段图：两部分是 7 和 5，整体未知。",
      ),
    ),
  ],
  [
    "Sam has 6 shells. His sister gives him 3 more. Now he has more than before: $6 + 3 = 9$ shells.\n\nCheck: count on 3 from 6: 7, 8, 9.\n\nIn this lesson we solve stories where more come along, or where two groups go together.",
    "萨姆有 6 个贝壳，姐姐又给了他 3 个。现在比原来多了：$6 + 3 = 9$ 个贝壳。\n\n检验：从 6 往后数 3 个：7、8、9。\n\n本课我们解决又来了一些、或者两组合起来的故事。",
  ],
);

const takingAwayStories = earlyTopic(
  "taking-away-word-problems",
  ["Taking Away Stories Within 20", "20 以内的减法故事"],
  ["Solve stories within 20 about things going away, or about part of a group.", "解决 20 以内关于东西减少，或一组中一部分的故事。"],
  ["counting-back-to-subtract"],
  ["1.OA.A.1"],
  [
    earlyPoint(
      "some-go-away",
      ["Some go away", "少了一些"],
      [
        "Lily has 12 grapes. She eats 4. The group gets smaller, so subtract: $12 - 4 = 8$.\n\nCheck: add back. $8 + 4 = 12$.\n\n> **Watch out.** Some went away, so do not add. $12 + 4 = 16$ is more than she had at the start.",
        "莉莉有 12 颗葡萄，吃了 4 颗。东西变少了，所以用减法：$12 - 4 = 8$。\n\n检验：加回去。$8 + 4 = 12$。\n\n> **注意。** 少了一些，就不能用加法。$12 + 4 = 16$ 比她原来的还多。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(6, 20);
        const b = rng.int(2, a - 2);
        const answer = a - b;
        return solved(
          [
            `${name} has ${a} ${thing.en} and gives away ${b}. How many ${thing.en} does ${name} have left?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，送出 ${b} ${thing.unit}。${name} 还剩多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [
              ["Choose add or take away", "选加法还是减法"],
              [`${name} gives some away, so the amount shrinks. Subtract.`, `${name} 送出一些，数量变少了，用减法。`],
            ],
            [["Take away", "相减"], ["", ""], [`${a} - ${b} = ${answer}`]],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去：$${answer} + ${b} = ${a}$。`],
          [
            [a + b, "This adds. Giving away makes the amount smaller.", "这是做了加法。送出去以后，数量应该变少。"],
            [a, "That is how many at the start. Some were given away.", "这是原来的个数，已经送出了一些。"],
            [b, "That is how many were given away, not how many are left.", "这是送出的个数，不是剩下的个数。"],
          ],
          partWholeBarFigure([answer, b], 0),
        );
      },
      captioned(
        partWholeBarFigure([8, 4], 0),
        "A bar of 12: 4 eaten, and the part left unknown.",
        "一个表示 12 的长条：吃掉 4，剩下的部分未知。",
      ),
    ),
    earlyPoint(
      "the-rest-of-a-group",
      ["The rest of a group", "一组中其余的"],
      [
        'There are 10 balloons. 6 are red, and the rest are blue. The red ones are one part. The blue ones are the other part. So $10 - 6 = 4$ are blue.\n\nCheck: $6 + 4 = 10$, the whole group.\n\n> **Watch out.** "The rest" means the other part. Do not count the red ones again.',
        "有 10 个气球，6 个是红色的，其余的是蓝色的。红气球是一部分，蓝气球是另一部分。所以蓝气球有 $10 - 6 = 4$ 个。\n\n检验：$6 + 4 = 10$，正好是一整组。\n\n> **注意。** “其余的”是另一部分，不要再数红气球。",
      ],
      (rng) => {
        const color = rng.pick([
          { one: "red", other: "green", zh1: "红色", zh2: "绿色" },
          { one: "big", other: "small", zh1: "大", zh2: "小" },
          { one: "green", other: "yellow", zh1: "绿色", zh2: "黄色" },
        ]);
        const thing = rng.pick(earlyThings);
        const a = rng.int(6, 20);
        const b = rng.int(2, a - 2);
        const answer = a - b;
        return solved(
          [
            `There are ${a} ${thing.en}. ${b} are ${color.one}, and the rest are ${color.other}. How many are ${color.other}?`,
            `有 ${a} ${thing.unit}${thing.zh}。其中 ${b} ${thing.unit}是${color.zh1}的，其余的是${color.zh2}的。${color.zh2}的有多少${thing.unit}？`,
          ],
          answer,
          [
            [
              ["Find the whole and a part", "找出整体和一部分"],
              [`The whole is ${a}. The ${color.one} part is ${b}.`, `整体是 ${a}，${color.zh1}的部分是 ${b}。`],
            ],
            [["Find the other part", "求另一部分"], ["", ""], [`${a} - ${b} = ${answer}`]],
          ],
          [`$${b} + ${answer} = ${a}$, the whole group.`, `$${b} + ${answer} = ${a}$，正好是一整组。`],
          [
            [a + b, "This adds. The rest is part of the group, so it is smaller.", "这是做了加法。其余的是一组中的一部分，应该更少。"],
            [a, "That is the whole group.", "这是一整组的个数。"],
            [b, `That is how many are ${color.one}.`, `这是${color.zh1}的个数。`],
          ],
          partWholeBarFigure([b, answer], 1),
        );
      },
      captioned(
        partWholeBarFigure([6, 4], 1),
        "A bar of 10 made of 6 and a missing part.",
        "一个表示 10 的长条，由 6 和一个未知部分组成。",
      ),
    ),
  ],
  [
    "There are 12 ducks on a pond. 4 fly away. Now there are fewer: $12 - 4 = 8$ ducks are left.\n\nCheck: $8 + 4 = 12$.\n\nIn this lesson we solve stories where some go away, or where we find the rest of a group.",
    "池塘里有 12 只鸭子，飞走了 4 只。现在少了：还剩 $12 - 4 = 8$ 只鸭子。\n\n检验：$8 + 4 = 12$。\n\n本课我们解决少了一些、或者求一组中其余部分的故事。",
  ],
);

const comparingStories = earlyTopic(
  "comparing-word-problems-within-20",
  ["Comparing Stories Within 20", "20 以内的比较故事"],
  ["Solve stories within 20 that compare two amounts.", "解决 20 以内比较两个数量的故事。"],
  ["adding-to-word-problems", "taking-away-word-problems"],
  ["1.OA.A.1"],
  [
    earlyPoint(
      "how-many-more-within-twenty",
      ["How many more", "多多少"],
      [
        'Ben has 5 cars. Ava has 8 cars. Line them up in two rows. 5 of Ava\'s cars have a partner. 3 have none. So Ava has 3 more.\n\nCheck: $8 - 5 = 3$.\n\n> **Watch out.** "How many more" asks for the extra ones only. It is 3, not 8.',
        "本有 5 辆小汽车，艾娃有 8 辆。把它们排成两行。艾娃的车有 5 辆能配对，3 辆没有。所以艾娃多 3 辆。\n\n检验：$8 - 5 = 3$。\n\n> **注意。** “多多少”只问多出来的部分，是 3，不是 8。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const small = rng.int(2, 12);
        const answer = rng.int(1, Math.min(8, 20 - small));
        const big = small + answer;
        return solved(
          [
            `${n1} has ${small} ${thing.en} and ${n2} has ${big} ${thing.en}. How many more ${thing.en} does ${n2} have than ${n1}?`,
            `${n1} 有 ${small} ${thing.unit}${thing.zh}，${n2} 有 ${big} ${thing.unit}${thing.zh}。${n2} 比 ${n1} 多多少${thing.unit}？`,
          ],
          answer,
          [
            [
              ["Match them up", "一一对应"],
              [`${small} of ${n2}'s ${thing.en} have a partner.`, `${n2} 的${thing.zh}有 ${small} ${thing.unit}能配对。`],
            ],
            [["Count the extras", "数多出来的"], ["", ""], [`${big} - ${small} = ${answer}`]],
          ],
          [
            `Count up from ${small} to ${big}: that is ${answer} ${answer === 1 ? "count" : "counts"}.`,
            `从 ${small} 往上数到 ${big}，数了 ${answer} 次。`,
          ],
          [
            [big, `That is how many ${n2} has, not how many more.`, `这是 ${n2} 有的个数，不是多出来的个数。`],
            [small, `That is how many ${n1} has.`, `这是 ${n1} 有的个数。`],
            [big + small, "This adds the two amounts. Compare them instead.", "这是把两个数加起来了，应该比较它们。"],
          ],
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [5, 8], "gap"),
        "Bars of 5 and 8, with the extra piece unknown.",
        "长条 5 和 8，多出来的一截未知。",
      ),
    ),
    earlyPoint(
      "finding-the-other-amount",
      ["Finding the other amount", "求另一个数量"],
      [
        'Ben has 6 stickers. Ava has 3 more than Ben. Ava\'s row is longer, so add: $6 + 3 = 9$.\n\nCheck: $9 - 6 = 3$, so Ava does have 3 more.\n\n> **Watch out.** Read "more" or "fewer" first. If Ava had 3 fewer, you would subtract.',
        "本有 6 张贴纸，艾娃比本多 3 张。艾娃的那一行长，所以相加：$6 + 3 = 9$。\n\n检验：$9 - 6 = 3$，艾娃确实多 3 张。\n\n> **注意。** 先看是“多”还是“少”。如果艾娃少 3 张，就要相减。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const known = rng.int(6, 14);
        const diff = rng.int(2, 5);
        const more = rng.bool();
        const answer = more ? known + diff : known - diff;
        return solved(
          [
            `${n1} has ${known} ${thing.en}. ${n2} has ${diff} ${more ? "more" : "fewer"} than ${n1}. How many ${thing.en} does ${n2} have?`,
            `${n1} 有 ${known} ${thing.unit}${thing.zh}。${n2} 比 ${n1} ${more ? "多" : "少"} ${diff} ${thing.unit}。${n2} 有多少${thing.unit}？`,
          ],
          answer,
          [
            [
              ["See who has more", "看谁多"],
              more
                ? [`${n2} has more, so ${n2}'s row is longer. Add.`, `${n2} 多，所以 ${n2} 的那一行长，用加法。`]
                : [`${n2} has fewer, so ${n2}'s row is shorter. Subtract.`, `${n2} 少，所以 ${n2} 的那一行短，用减法。`],
            ],
            [
              [more ? "Add" : "Take away", more ? "相加" : "相减"],
              ["", ""],
              [more ? `${known} + ${diff} = ${answer}` : `${known} - ${diff} = ${answer}`],
            ],
          ],
          more
            ? [
                `$${answer} - ${known} = ${diff}$, so ${n2} has ${diff} more.`,
                `$${answer} - ${known} = ${diff}$，${n2} 确实多 ${diff} ${thing.unit}。`,
              ]
            : [
                `$${known} - ${answer} = ${diff}$, so ${n2} has ${diff} fewer.`,
                `$${known} - ${answer} = ${diff}$，${n2} 确实少 ${diff} ${thing.unit}。`,
              ],
          [
            more
              ? [known - diff, `This takes away. ${n2} has more, so add.`, `这是做了减法。${n2} 多，要用加法。`]
              : [known + diff, `This adds. ${n2} has fewer, so take away.`, `这是做了加法。${n2} 少，要用减法。`],
            [known, `That is how many ${n1} has.`, `这是 ${n1} 有的个数。`],
            [diff, `That is the difference, not how many ${n2} has.`, `这是相差的个数，不是 ${n2} 有的个数。`],
          ],
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [6, 9], "second"),
        "Bar A is 6. Bar B is 3 longer, and its number is unknown.",
        "长条 A 是 6，长条 B 长出 3，它的数未知。",
      ),
    ),
  ],
  [
    "Ben has 5 cars. Ava has 8 cars. They put the cars side by side. 3 of Ava's cars have no partner. So Ava has 3 more.\n\nCheck: $5 + 3 = 8$.\n\nIn this lesson we solve stories that compare two amounts.",
    "本有 5 辆小汽车，艾娃有 8 辆。他们把车并排摆好，艾娃有 3 辆车没有配对。所以艾娃多 3 辆。\n\n检验：$5 + 3 = 8$。\n\n本课我们解决比较两个数量的故事。",
  ],
);

const missingStartStories = earlyTopic(
  "word-problems-with-a-missing-part",
  ["Stories With a Missing Part", "缺少一部分的故事"],
  ["Solve stories within 20 where the start or the change is not known.", "解决 20 以内不知道开始或变化部分的故事。"],
  ["missing-addends-within-20", "comparing-word-problems-within-20"],
  ["1.OA.A.1"],
  [
    earlyPoint(
      "how-many-came-along",
      ["How many came along", "来了多少"],
      [
        "Zoe had 6 shells. She found some more. Now she has 13. Write $6 + \\square = 13$. Count up from 6 to 13: that is 7 counts. She found 7.\n\nCheck: $13 - 6 = 7$.\n\n> **Watch out.** The box is what she found, not what she has now. It is 7, not 13.",
        "佐伊原来有 6 个贝壳，又找到一些，现在有 13 个。写成 $6 + \\square = 13$。从 6 往上数到 13，数了 7 次。她找到 7 个。\n\n检验：$13 - 6 = 7$。\n\n> **注意。** 方框是她找到的，不是她现在有的。是 7，不是 13。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const start = rng.int(3, 12);
        const answer = rng.int(2, Math.min(8, 20 - start));
        const end = start + answer;
        return solved(
          [
            `${name} had ${start} ${thing.en} and then found some more. Now ${name} has ${end}. How many ${thing.en} did ${name} find?`,
            `${name} 原来有 ${start} ${thing.unit}${thing.zh}，后来又找到一些，现在有 ${end} ${thing.unit}。${name} 找到多少${thing.unit}？`,
          ],
          answer,
          [
            [
              ["Write a number sentence", "写出算式"],
              ["The box is the number found:", "方框是找到的个数："],
              [`${start} + \\square = ${end}`],
            ],
            [
              ["Count up", "往上数"],
              [`From ${start} to ${end} is ${answer} counts:`, `从 ${start} 数到 ${end} 要数 ${answer} 次：`],
              [`${start} + ${answer} = ${end}`],
            ],
          ],
          [`Subtract: $${end} - ${start} = ${answer}$.`, `用减法算：$${end} - ${start} = ${answer}$。`],
          [
            [end, "That is how many now, not how many were found.", "这是现在的个数，不是找到的个数。"],
            [start, "That is how many at the start.", "这是原来的个数。"],
            [end + start, `This adds. Count up from ${start} to ${end} instead.`, `这是做了加法，应该从 ${start} 往上数到 ${end}。`],
          ],
          partWholeBarFigure([start, answer], 1),
        );
      },
      captioned(
        partWholeBarFigure([6, 7], 1),
        "A bar of 13 made of 6 and a missing part.",
        "一个表示 13 的长条，由 6 和一个未知部分组成。",
      ),
    ),
    earlyPoint(
      "how-many-at-the-start",
      ["How many at the start", "开始有多少"],
      [
        "Max gave away 5 cards. He has 7 left. At the start he had both the 5 and the 7. So add: $7 + 5 = 12$.\n\nCheck: $12 - 5 = 7$, the number he has left.\n\n> **Watch out.** He gave cards away, so the start was bigger. Add, do not subtract.",
        "马克斯送出 5 张卡片，还剩 7 张。原来这 5 张和 7 张都在他手里，所以相加：$7 + 5 = 12$。\n\n检验：$12 - 5 = 7$，正好是剩下的张数。\n\n> **注意。** 他送出了卡片，所以原来的更多。要相加，不要相减。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const change = rng.int(2, 8);
        const other = rng.int(3, 11);
        const total = change + other;
        return rng.bool()
          ? solved(
              [
                `${name} gave away ${change} ${thing.en} and has ${other} left. How many ${thing.en} did ${name} have at the start?`,
                `${name} 送出 ${change} ${thing.unit}${thing.zh}，还剩 ${other} ${thing.unit}。${name} 原来有多少${thing.unit}？`,
              ],
              total,
              [
                [
                  ["Go back in the story", "倒过来想"],
                  [
                    `Before giving ${change} away, ${name} had those ${change} too.`,
                    `送出之前，这 ${change} ${thing.unit}也在 ${name} 手里。`,
                  ],
                ],
                [["Put them back", "加回来"], ["", ""], [`${other} + ${change} = ${total}`]],
              ],
              [`$${total} - ${change} = ${other}$, the number left.`, `$${total} - ${change} = ${other}$，正好是剩下的个数。`],
              [
                [
                  Math.abs(other - change),
                  "This subtracts. Giving away made it smaller, so the start was bigger.",
                  "这是做了减法。送出后变少了，所以原来的更多。",
                ],
                [change, "That is how many were given away.", "这是送出的个数。"],
                [other, "That is how many are left now.", "这是现在剩下的个数。"],
              ],
              partWholeBarFigure([other, change], -1),
            )
          : solved(
              [
                `${name} got ${change} more ${thing.en} and now has ${total}. How many ${thing.en} did ${name} have at the start?`,
                `${name} 又得到 ${change} ${thing.unit}${thing.zh}，现在有 ${total} ${thing.unit}。${name} 原来有多少${thing.unit}？`,
              ],
              other,
              [
                [
                  ["Go back in the story", "倒过来想"],
                  [`Before getting ${change} more, ${name} had fewer.`, `得到之前，${name} 的更少。`],
                ],
                [["Take the new ones away", "减去新得到的"], ["", ""], [`${total} - ${change} = ${other}`]],
              ],
              [`$${other} + ${change} = ${total}$, the number now.`, `$${other} + ${change} = ${total}$，正好是现在的个数。`],
              [
                [
                  total + change,
                  "This adds. Getting more made it bigger, so the start was smaller.",
                  "这是做了加法。得到后变多了，所以原来的更少。",
                ],
                [change, "That is how many were added.", "这是新得到的个数。"],
                [total, "That is how many now.", "这是现在的个数。"],
              ],
              partWholeBarFigure([other, change], 0),
            );
      },
      captioned(
        partWholeBarFigure([7, 5], -1),
        "A bar model: 7 left and 5 given away, and the start unknown.",
        "线段图：剩下 7，送出 5，原来的未知。",
      ),
    ),
  ],
  [
    "Zoe had some shells. She found 4 more, and now she has 10. How many did she have at the start? Take the 4 new ones away: $10 - 4 = 6$.\n\nCheck: $6 + 4 = 10$.\n\nIn this lesson we solve stories where the start or the change is missing.",
    "佐伊原来有一些贝壳，又找到 4 个，现在有 10 个。她原来有几个？把新找到的 4 个去掉：$10 - 4 = 6$。\n\n检验：$6 + 4 = 10$。\n\n本课我们解决不知道开始或者不知道变化了多少的故事。",
  ],
);

const threeAddendStories = earlyTopic(
  "three-addend-word-problems",
  ["Stories With Three Addends", "三个加数的故事"],
  ["Solve stories that add three whole numbers with a sum up to 20.", "解决把三个数相加、和不超过 20 的故事。"],
  ["adding-three-numbers-within-20"],
  ["1.OA.A.2"],
  [
    earlyPoint(
      "three-groups-in-a-story",
      ["Three groups in a story", "故事里的三组"],
      [
        "Kai has 3 pens in a cup, 5 in a box and 4 in a bag. Add all three: $3 + 5 = 8$, then $8 + 4 = 12$.\n\nCheck: add in another order. $5 + 4 = 9$, then $9 + 3 = 12$.\n\n> **Watch out.** Long stories hide numbers. Use all three, not just two.",
        "凯的杯子里有 3 支笔，盒子里有 5 支，袋子里有 4 支。三个数都要加：$3 + 5 = 8$，再算 $8 + 4 = 12$。\n\n检验：换个顺序加。$5 + 4 = 9$，再算 $9 + 3 = 12$。\n\n> **注意。** 故事长了容易漏数。三个数都要用，不能只加两个。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(2, 8);
        const b = rng.int(2, 7);
        const c = rng.int(2, Math.min(9, 20 - a - b));
        const answer = a + b + c;
        return solved(
          [
            `${name} has ${a} ${thing.en} in one box, ${b} in a second box and ${c} in a third box. How many ${thing.en} is that in all?`,
            `${name} 的第一个盒子里有 ${a} ${thing.unit}${thing.zh}，第二个盒子里有 ${b} ${thing.unit}，第三个盒子里有 ${c} ${thing.unit}。一共有多少${thing.unit}？`,
          ],
          answer,
          [
            [["Add two boxes", "先加两个盒子"], ["", ""], [`${a} + ${b} = ${a + b}`]],
            [["Add the third box", "再加第三个盒子"], ["", ""], [`${a + b} + ${c} = ${answer}`]],
          ],
          [
            `Add in another order: $${b} + ${c} = ${b + c}$, then $${b + c} + ${a} = ${answer}$.`,
            `换个顺序加：$${b} + ${c} = ${b + c}$，再算 $${b + c} + ${a} = ${answer}$。`,
          ],
          [
            [a + b, "That leaves out the third box.", "这漏掉了第三个盒子。"],
            [b + c, "That leaves out the first box.", "这漏掉了第一个盒子。"],
            [a + c, "That leaves out the second box.", "这漏掉了第二个盒子。"],
          ],
          partWholeBarFigure([a, b, c], -1),
        );
      },
      captioned(
        partWholeBarFigure([3, 5, 4], -1),
        "A bar model: parts 3, 5 and 4, and the whole unknown.",
        "线段图：三部分是 3、5、4，整体未知。",
      ),
    ),
    earlyPoint(
      "three-friends-together",
      ["Three friends together", "三个朋友合起来"],
      [
        "Ana has 4 marbles, Ben has 5 and Cal has 6. Look for a pair that makes ten. 4 and 6 make ten. Ten and 5 is 15.\n\nCheck: add in order. $4 + 5 = 9$, then $9 + 6 = 15$.\n\n> **Watch out.** Count each friend once. After you add 4 and 6, only the 5 is left.",
        "安娜有 4 颗弹珠，本有 5 颗，卡尔有 6 颗。先找能凑成十的一对。4 和 6 凑成十，十再加 5 是 15。\n\n检验：按顺序加。$4 + 5 = 9$，再算 $9 + 6 = 15$。\n\n> **注意。** 每个朋友只算一次。加了 4 和 6 以后，只剩 5 要加。",
      ],
      (rng) => {
        const [n1, n2, n3] = rng.sample(earlyNames, 3) as [string, string, string];
        const thing = rng.pick(earlyThings);
        const k = rng.int(2, 8);
        const c = rng.int(2, 9);
        const answer = 10 + c;
        return solved(
          [
            `${n1} has ${k} ${thing.en}, ${n2} has ${c} ${thing.en} and ${n3} has ${10 - k} ${thing.en}. How many ${thing.en} do they have together?`,
            `${n1} 有 ${k} ${thing.unit}${thing.zh}，${n2} 有 ${c} ${thing.unit}，${n3} 有 ${10 - k} ${thing.unit}。三个人一共有多少${thing.unit}？`,
          ],
          answer,
          [
            [
              ["Find a pair that makes ten", "找凑成十的一对"],
              [`${n1} and ${n3} make ten:`, `${n1} 和 ${n3} 的合起来是十：`],
              [`${k} + ${10 - k} = 10`],
            ],
            [["Add the third friend", "加上第三个人"], ["", ""], [`10 + ${c} = ${answer}`]],
          ],
          [
            `Add in order: $${k} + ${c} = ${k + c}$, then $${k + c} + ${10 - k} = ${answer}$.`,
            `按顺序加：$${k} + ${c} = ${k + c}$，再算 $${k + c} + ${10 - k} = ${answer}$。`,
          ],
          [
            [k + c, `That leaves out ${n3}'s ${10 - k}.`, `这漏掉了 ${n3} 的 ${10 - k} ${thing.unit}。`],
            [c + 10 - k, `That leaves out ${n1}'s ${k}.`, `这漏掉了 ${n1} 的 ${k} ${thing.unit}。`],
            [
              10,
              `That is only the pair that makes ten. Add ${n2}'s ${c} too.`,
              `这只是凑成十的一对，还要加上 ${n2} 的 ${c} ${thing.unit}。`,
            ],
          ],
        );
      },
      captioned(
        tenFramesFigure(4, 6),
        "4 filled and 6 hollow counters fill one ten-frame.",
        "4 个实心圆片和 6 个空心圆片正好放满一个十格框。",
      ),
    ),
  ],
  [
    "Ana has 4 marbles, Ben has 5 and Cal has 6. How many in all? 4 and 6 make ten, and ten and 5 is 15.\n\nCheck: $4 + 5 = 9$, and $9 + 6 = 15$.\n\nIn this lesson we solve stories that add three numbers.",
    "安娜有 4 颗弹珠，本有 5 颗，卡尔有 6 颗。一共有几颗？4 和 6 凑成十，十再加 5 是 15。\n\n检验：$4 + 5 = 9$，$9 + 6 = 15$。\n\n本课我们解决把三个数相加的故事。",
  ],
);

const addingMultiplesOfTen = earlyTopic(
  "adding-multiples-of-ten",
  ["Adding Tens", "整十数相加"],
  ["Add whole tens by thinking of them as bundles.", "把整十数看成一捆一捆的来相加。"],
  ["counting-groups-of-ten"],
  ["1.NBT.C.4"],
  [
    earlyPoint(
      "adding-two-round-numbers",
      ["Adding two round numbers", "两个整十数相加"],
      [
        "30 is 3 tens. 40 is 4 tens. So $30 + 40$ is 3 tens and 4 tens. That is 7 tens, or 70.\n\nCheck: count on by tens from 30: 40, 50, 60, 70. That is 4 jumps of ten.\n\n> **Watch out.** You are counting tens. The answer is 70, not 7.",
        "30 是 3 个十，40 是 4 个十。所以 $30 + 40$ 是 3 个十加 4 个十，一共 7 个十，也就是 70。\n\n检验：从 30 起一十一十地数：40、50、60、70，跳了 4 次十。\n\n> **注意。** 这里数的是十。答案是 70，不是 7。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(1, 9 - a);
        const answer = 10 * (a + b);
        const hops = Array.from({ length: b }, (_, i) => 10 * (a + i + 1));
        return solved(
          [`What is $${a * 10} + ${b * 10}$?`, `$${a * 10} + ${b * 10}$ 等于多少？`],
          answer,
          [
            [
              ["Think in tens", "看成几个十"],
              [`${a * 10} is ${plural(a, "ten")}. ${b * 10} is ${plural(b, "ten")}.`, `${a * 10} 是 ${a} 个十，${b * 10} 是 ${b} 个十。`],
            ],
            [
              ["Add the tens", "把十相加"],
              [`${a} + ${b} = ${a + b}, so there are ${a + b} tens:`, `${a} + ${b} = ${a + b}，一共 ${a + b} 个十：`],
              [`${a * 10} + ${b * 10} = ${answer}`],
            ],
          ],
          [`Count on by tens from ${a * 10}: ${hops.join(", ")}.`, `从 ${a * 10} 起一十一十地数：${hops.join("、")}。`],
          [
            [
              a + b,
              `That counts the tens but says them as ones. ${a + b} tens is ${answer}.`,
              `这数对了十的个数，却当成了一。${a + b} 个十是 ${answer}。`,
            ],
            [10 * a + b, `This adds ${b} as ones. ${b * 10} is ${plural(b, "ten")}.`, `这把 ${b} 当成了个位。${b * 10} 是 ${b} 个十。`],
          ],
          jumpsFigure(0, 100, 10, [10 * a, ...hops]),
        );
      },
      captioned(
        jumpsFigure(0, 100, 10, [30, 40, 50, 60, 70]),
        "A number line from 0 to 100: jumps of ten from 30 to 70.",
        "从 0 到 100 的数轴：从 30 起每次跳 10，跳到 70。",
      ),
    ),
    earlyPoint(
      "adding-rods-to-rods",
      ["Adding rods to rods", "长条加长条"],
      [
        "Each rod is a ten. 3 rods show 30. Add 2 more rods. Count the rods: 3, then 4, 5. 5 rods are 50.\n\nCheck: $30 + 20 = 50$.\n\n> **Watch out.** Each rod is ten, not one. 5 rods are 50, not 5.",
        "每根长条是一个十。3 根长条表示 30。再加 2 根，数一数长条：3，再数 4、5。5 根长条是 50。\n\n检验：$30 + 20 = 50$。\n\n> **注意。** 每根长条是十，不是一。5 根长条是 50，不是 5。",
      ],
      (rng) => {
        const a = rng.int(1, 7);
        const b = rng.int(1, 8 - a);
        const answer = 10 * (a + b);
        return solved(
          [`Add ${b * 10} to the number these blocks show. What is the total?`, `把这些积木表示的数加上 ${b * 10}。总数是多少？`],
          answer,
          [
            [
              ["Read the blocks", "读出积木"],
              [`There ${a === 1 ? "is 1 rod" : `are ${a} rods`}, so the blocks show ${10 * a}.`, `有 ${a} 根长条，表示 ${10 * a}。`],
            ],
            [
              ["Add the new rods", "加上新的长条"],
              [
                `${b * 10} is ${b} more ${b === 1 ? "rod" : "rods"}, so there are ${a + b} rods:`,
                `${b * 10} 是再加 ${b} 根，一共 ${a + b} 根：`,
              ],
              [`${10 * a} + ${b * 10} = ${answer}`],
            ],
          ],
          [`Count on by tens from ${10 * a}: you reach ${answer}.`, `从 ${10 * a} 起一十一十地数，数到 ${answer}。`],
          [
            [
              a + b,
              `That counts the rods. Each rod is ten, so ${a + b} rods are ${answer}.`,
              `这是长条的根数。每根是十，${a + b} 根是 ${answer}。`,
            ],
            [10 * a, `That is only the blocks shown. Add ${b * 10} too.`, `这只是图中积木表示的数，还要加上 ${b * 10}。`],
            [
              10 * a + b,
              `This adds ${b} ones. ${b * 10} is ${b} ${b === 1 ? "rod" : "rods"}.`,
              `这加的是 ${b} 个一。${b * 10} 是 ${b} 根长条。`,
            ],
          ],
          blocksFigure(0, a, 0),
        );
      },
      captioned(blocksFigure(0, 5, 0), "5 rods: 5 tens, or 50.", "5 根长条：5 个十，也就是 50。"),
    ),
  ],
  [
    "Pens come in packs of 10. Tia has 3 packs. Dad brings 2 more packs. Now she has 5 packs. That is 50 pens.\n\nCheck: $30 + 20 = 50$.\n\nIn this lesson we add tens by thinking of them as bundles.",
    "笔是 10 支一包的。蒂娅有 3 包，爸爸又带回 2 包。现在她有 5 包，也就是 50 支笔。\n\n检验：$30 + 20 = 50$。\n\n本课我们把整十数看成一捆一捆的十来相加。",
  ],
);

const addingTensToTwoDigit = earlyTopic(
  "adding-tens-to-two-digit-numbers",
  ["Adding to Two-Digit Numbers", "两位数加整十数和一位数"],
  ["Add whole tens or some ones to a two-digit number, adding like with like.", "把整十数或几个一加到两位数上，相同的单位相加。"],
  ["adding-multiples-of-ten"],
  ["1.NBT.C.4"],
  [
    earlyPoint(
      "adding-whole-tens",
      ["Adding whole tens", "加整十数"],
      [
        "For $34 + 20$: 34 is 3 tens and 4 ones. 20 is 2 tens. Add the tens: 3 tens and 2 tens make 5 tens. The 4 ones stay. So the answer is 54.\n\nCheck: count on by tens from 34: 44, 54.\n\n> **Watch out.** Add tens to tens. $34 + 20$ is not 36.",
        "算 $34 + 20$：34 是 3 个十和 4 个一，20 是 2 个十。十和十相加：3 个十加 2 个十是 5 个十。4 个一不变。所以答案是 54。\n\n检验：从 34 起一十一十地数：44、54。\n\n> **注意。** 十要和十相加。$34 + 20$ 不是 36。",
      ],
      (rng) => {
        const at = rng.int(1, 7);
        const single = rng.int(1, 9);
        const bt = rng.int(1, 9 - at);
        const a = 10 * at + single;
        const answer = a + 10 * bt;
        const hops = Array.from({ length: bt }, (_, i) => a + 10 * (i + 1));
        return solved(
          [`What is $${a} + ${10 * bt}$?`, `$${a} + ${10 * bt}$ 等于多少？`],
          answer,
          [
            [
              ["Split into tens and ones", "分成十和一"],
              [
                `${a} is ${plural(at, "ten")} and ${plural(single, "one")}. ${10 * bt} is ${plural(bt, "ten")}.`,
                `${a} 是 ${at} 个十和 ${single} 个一，${10 * bt} 是 ${bt} 个十。`,
              ],
            ],
            [
              ["Add the tens", "十和十相加"],
              [`${at} + ${bt} = ${at + bt} tens. The ones stay ${single}:`, `${at} + ${bt} = ${at + bt} 个十，个位还是 ${single}：`],
              [`${a} + ${10 * bt} = ${answer}`],
            ],
          ],
          [`Count on by tens from ${a}: ${hops.join(", ")}.`, `从 ${a} 起一十一十地数：${hops.join("、")}。`],
          [
            [a + bt, `This adds ${bt} as ones. ${10 * bt} is ${plural(bt, "ten")}.`, `这把 ${bt} 当成了个位。${10 * bt} 是 ${bt} 个十。`],
            [a, "That is the number you started with.", "这是开始的数，还没有加。"],
            [10 * (at + bt), `This drops the ${plural(single, "one")}. The ones stay.`, `这丢掉了 ${single} 个一，个位要保留。`],
          ],
          blocksFigure(0, at, single),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 4],
          [0, 2, 0],
        ]),
        "Blocks: 34 in the top row and 20 in the bottom row.",
        "积木：上面一行是 34，下面一行是 20。",
      ),
    ),
    earlyPoint(
      "adding-some-ones",
      ["Adding some ones", "加几个一"],
      [
        "For $42 + 5$: 42 is 4 tens and 2 ones. Add the ones: $2 + 5 = 7$. The 4 tens stay. So the answer is 47.\n\nCheck: count on 5 from 42: 43, 44, 45, 46, 47.\n\n> **Watch out.** Add ones to ones. $42 + 5$ is not 92.",
        "算 $42 + 5$：42 是 4 个十和 2 个一。一和一相加：$2 + 5 = 7$。4 个十不变。所以答案是 47。\n\n检验：从 42 往后数 5 个：43、44、45、46、47。\n\n> **注意。** 一要和一相加。$42 + 5$ 不是 92。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const ao = rng.int(0, 7);
        const b = rng.int(1, 9 - ao);
        const a = 10 * tens + ao;
        const answer = a + b;
        const counts = Array.from({ length: b }, (_, i) => a + i + 1);
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Split into tens and ones", "分成十和一"],
              [`${a} is ${plural(tens, "ten")} and ${plural(ao, "one")}.`, `${a} 是 ${tens} 个十和 ${ao} 个一。`],
            ],
            [
              ["Add the ones", "一和一相加"],
              [`${ao} + ${b} = ${ao + b} ones. The tens stay ${tens}:`, `${ao} + ${b} = ${ao + b} 个一，十位还是 ${tens}：`],
              [`${a} + ${b} = ${answer}`],
            ],
          ],
          [`Count on ${b} from ${a}: ${counts.join(", ")}.`, `从 ${a} 往后数 ${b} 个：${counts.join("、")}。`],
          [
            [a + 10 * b, `This adds ${b} tens. ${b} is ones.`, `这加了 ${b} 个十，可 ${b} 是几个一。`],
            [a - b, "This subtracts. The sign is plus.", "这是做了减法，符号是加号。"],
            [tens + ao + b, "This adds all the digits. The tens are still tens.", "这把所有数字都加在一起了，十位上的数还是表示几个十。"],
          ],
          blocksFigure(0, tens, ao),
        );
      },
      captioned(blocksFigure(0, 4, 2), "4 rods and 2 small cubes show 42.", "4 根长条和 2 个小方块表示 42。"),
    ),
  ],
  [
    "Max has 34 stickers: 3 full sheets of ten and 4 loose ones. He gets 2 more full sheets. Now he has 5 sheets and 4 loose ones. That is 54.\n\nCheck: count on by tens from 34: 44, 54.\n\nIn this lesson we add tens or ones to a two-digit number: tens with tens, and ones with ones.",
    "马克斯有 34 张贴纸：3 整版，每版 10 张，还有 4 张散的。他又得到 2 整版。现在他有 5 版和 4 张散的，是 54 张。\n\n检验：从 34 起一十一十地数：44、54。\n\n本课我们把整十数或几个一加到两位数上：十和十相加，一和一相加。",
  ],
);

const tenMoreTenLess = earlyTopic(
  "ten-more-and-ten-less",
  ["Ten More and Ten Less", "多 10 和少 10"],
  [
    "Find the number that is 10 more or 10 less than a two-digit number without counting.",
    "不用数，就能说出比一个两位数多 10 或少 10 的数。",
  ],
  ["adding-tens-to-two-digit-numbers"],
  ["1.NBT.C.5"],
  [
    earlyPoint(
      "ten-more",
      ["Ten more", "多 10"],
      [
        "Ten more is one more rod. 47 is 4 rods and 7 cubes. Add a rod: 5 rods and 7 cubes. That is 57.\n\nCheck: on a hundred chart, 57 is just below 47.\n\n> **Watch out.** Change the tens digit, not the ones. 48 is one more, not ten more.",
        "多 10 就是多一根长条。47 是 4 根长条和 7 个小方块。加一根长条：5 根长条和 7 个小方块，是 57。\n\n检验：在百数表上看，57 就在 47 的正下方。\n\n> **注意。** 要变的是十位，不是个位。48 是多 1，不是多 10。",
      ],
      (rng) => {
        const n = rng.int(11, 89);
        const t = Math.floor(n / 10);
        const o = n % 10;
        const answer = n + 10;
        return solved(
          [`What number is 10 more than ${n}?`, `比 ${n} 多 10 的数是多少？`],
          answer,
          [
            [
              ["Read the tens and ones", "看十位和个位"],
              [`${n} is ${plural(t, "ten")} and ${plural(o, "one")}.`, `${n} 是 ${t} 个十和 ${o} 个一。`],
            ],
            [
              ["Add one ten", "加一个十"],
              [`Now there are ${t + 1} tens and still ${plural(o, "one")}:`, `现在是 ${t + 1} 个十，个位还是 ${o}：`],
              [`${n} + 10 = ${answer}`],
            ],
          ],
          [`On a hundred chart, ${answer} is straight below ${n}.`, `在百数表上，${answer} 就在 ${n} 的正下方。`],
          [
            [n + 1, "That is one more. Ten more changes the tens digit.", "这是多 1。多 10 要变十位。"],
            [n - 10, "That is ten less. Ten more is bigger.", "这是少 10。多 10 应该更大。"],
          ],
          blocksFigure(0, t, o),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 4, 7],
          [0, 5, 7],
        ]),
        "Blocks: 47 in the top row, and 57 with one more rod in the bottom row.",
        "积木：上面一行是 47，下面一行多一根长条，是 57。",
      ),
    ),
    earlyPoint(
      "ten-less",
      ["Ten less", "少 10"],
      [
        "Ten less is one rod fewer. 47 is 4 rods and 7 cubes. Take away a rod: 3 rods and 7 cubes. That is 37.\n\nCheck: on a hundred chart, 37 is just above 47.\n\n> **Watch out.** Change the tens digit, not the ones. 46 is one less, not ten less.",
        "少 10 就是少一根长条。47 是 4 根长条和 7 个小方块。拿走一根长条：3 根长条和 7 个小方块，是 37。\n\n检验：在百数表上看，37 就在 47 的正上方。\n\n> **注意。** 要变的是十位，不是个位。46 是少 1，不是少 10。",
      ],
      (rng) => {
        const n = rng.int(20, 99);
        const t = Math.floor(n / 10);
        const o = n % 10;
        const answer = n - 10;
        return solved(
          [`What number is 10 less than ${n}?`, `比 ${n} 少 10 的数是多少？`],
          answer,
          [
            [
              ["Read the tens and ones", "看十位和个位"],
              [`${n} is ${plural(t, "ten")} and ${plural(o, "one")}.`, `${n} 是 ${t} 个十和 ${o} 个一。`],
            ],
            [
              ["Take one ten away", "去掉一个十"],
              [
                `Now there ${t - 1 === 1 ? "is 1 ten" : `are ${t - 1} tens`} and still ${plural(o, "one")}:`,
                `现在是 ${t - 1} 个十，个位还是 ${o}：`,
              ],
              [`${n} - 10 = ${answer}`],
            ],
          ],
          [`Add back: $${answer} + 10 = ${n}$.`, `加回去：$${answer} + 10 = ${n}$。`],
          [
            [n - 1, "That is one less. Ten less changes the tens digit.", "这是少 1。少 10 要变十位。"],
            [n + 10, "That is ten more. Ten less is smaller.", "这是多 10。少 10 应该更小。"],
          ],
          blocksFigure(0, t, o),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 4, 7],
          [0, 3, 7],
        ]),
        "Blocks: 47 in the top row, and 37 with one rod fewer in the bottom row.",
        "积木：上面一行是 47，下面一行少一根长条，是 37。",
      ),
    ),
  ],
  [
    "Eggs come in boxes of 10. Mia has 4 boxes and 7 loose eggs. That is 47 eggs. She buys one more box. Now she has 57 eggs.\n\nCheck: $47 + 10 = 57$.\n\nIn this lesson we find ten more and ten less without counting.",
    "鸡蛋是 10 个一盒的。米娅有 4 盒，还有 7 个散的，一共 47 个。她又买了一盒，现在有 57 个鸡蛋。\n\n检验：$47 + 10 = 57$。\n\n本课我们不用数，就说出多 10 和少 10 的数。",
  ],
);

const subtractingMultiplesOfTen = earlyTopic(
  "subtracting-multiples-of-ten",
  ["Subtracting Tens", "整十数相减"],
  ["Take whole tens from whole tens, up to 90.", "在 90 以内，整十数减整十数。"],
  ["ten-more-and-ten-less"],
  ["1.NBT.C.6"],
  [
    earlyPoint(
      "taking-tens-from-tens",
      ["Taking tens from tens", "十减十"],
      [
        "70 is 7 tens. 40 is 4 tens. 7 tens take away 4 tens leaves 3 tens. That is 30.\n\nCheck: add back. $30 + 40 = 70$.\n\n> **Watch out.** Say the answer in tens. It is 30, not 3.",
        "70 是 7 个十，40 是 4 个十。7 个十减 4 个十，剩下 3 个十，也就是 30。\n\n检验：加回去。$30 + 40 = 70$。\n\n> **注意。** 答案要说成几个十。是 30，不是 3。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, a - 1);
        const answer = 10 * (a - b);
        return solved(
          [`What is $${a * 10} - ${b * 10}$?`, `$${a * 10} - ${b * 10}$ 等于多少？`],
          answer,
          [
            [
              ["Think in tens", "看成几个十"],
              [`${a * 10} is ${a} tens. ${b * 10} is ${plural(b, "ten")}.`, `${a * 10} 是 ${a} 个十，${b * 10} 是 ${b} 个十。`],
            ],
            [
              ["Take the tens away", "十减十"],
              [
                `${a} - ${b} = ${a - b}, so ${plural(a - b, "ten")} ${a - b === 1 ? "is" : "are"} left:`,
                `${a} - ${b} = ${a - b}，剩下 ${a - b} 个十：`,
              ],
              [`${a * 10} - ${b * 10} = ${answer}`],
            ],
          ],
          [`Add back: $${answer} + ${b * 10} = ${a * 10}$.`, `加回去：$${answer} + ${b * 10} = ${a * 10}$。`],
          [
            [
              a - b,
              `That counts the tens but says them as ones. ${plural(a - b, "ten")} is ${answer}.`,
              `这数对了十的个数，却当成了一。${a - b} 个十是 ${answer}。`,
            ],
            [10 * (a + b), "This adds. The sign is minus.", "这是做了加法，符号是减号。"],
            [10 * a - b, `This takes away ${b} ones. ${b * 10} is ${plural(b, "ten")}.`, `这减的是 ${b} 个一。${b * 10} 是 ${b} 个十。`],
          ],
          hopsFigure([a * 10, answer]),
        );
      },
      captioned(hopsFigure([70, 30]), "A number line: a hop back 40 from 70 to 30.", "数轴：从 70 往回跳 40，到 30。"),
    ),
    earlyPoint(
      "taking-away-rods",
      ["Taking away rods", "拿走长条"],
      [
        "7 rods show 70. Cross out 4 rods. 3 rods are left. 3 rods are 30.\n\nCheck: put the 4 rods back. 3 and 4 make 7 rods, or 70.\n\n> **Watch out.** Count the rods that are left, not the ones you crossed out.",
        "7 根长条表示 70。划掉 4 根，还剩 3 根。3 根长条是 30。\n\n检验：把 4 根放回去，3 根和 4 根是 7 根，也就是 70。\n\n> **注意。** 数剩下的长条，不是划掉的长条。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, a - 1);
        const answer = 10 * (a - b);
        return solved(
          [`These blocks show a number. Take away ${b * 10}. How much is left?`, `这些积木表示一个数。减去 ${b * 10}。还剩多少？`],
          answer,
          [
            [
              ["Read the blocks", "读出积木"],
              [`There are ${a} rods, so the blocks show ${10 * a}.`, `有 ${a} 根长条，表示 ${10 * a}。`],
            ],
            [
              ["Cross out rods", "划掉长条"],
              [
                `${b * 10} is ${b} ${b === 1 ? "rod" : "rods"}. ${a - b} ${a - b === 1 ? "rod is" : "rods are"} left:`,
                `${b * 10} 是 ${b} 根，还剩 ${a - b} 根：`,
              ],
              [`${10 * a} - ${b * 10} = ${answer}`],
            ],
          ],
          [`Put them back: $${answer} + ${b * 10} = ${10 * a}$.`, `放回去：$${answer} + ${b * 10} = ${10 * a}$。`],
          [
            [a - b, `That counts the rods left. Each rod is ten, so it is ${answer}.`, `这是剩下的根数。每根是十，所以是 ${answer}。`],
            [10 * a, "That is all the blocks. Some were taken away.", "这是所有积木，已经拿走了一些。"],
            [10 * b, "That is the part taken away, not what is left.", "这是拿走的部分，不是剩下的。"],
          ],
          blocksFigure(0, a, 0),
        );
      },
      captioned(blocksFigure(0, 7, 0), "7 rods: 7 tens, or 70.", "7 根长条：7 个十，也就是 70。"),
    ),
  ],
  [
    "A shop has 7 boxes of 10 crayons. That is 70 crayons. It sells 4 boxes. 3 boxes are left. That is 30 crayons.\n\nCheck: $30 + 40 = 70$.\n\nIn this lesson we take tens away from tens.",
    "商店有 7 盒蜡笔，每盒 10 支，一共 70 支。卖掉了 4 盒，还剩 3 盒，也就是 30 支。\n\n检验：$30 + 40 = 70$。\n\n本课我们学习整十数减整十数。",
  ],
);

/** gradeOneNumberTopics are the number and operation topics of 1st Grade Math, in teaching order. */
export const gradeOneNumberTopics: readonly TopicDef[] = [
  countingTo120,
  readingWritingTo120,
  tenAndSomeOnes,
  tensAndOnes,
  countingGroupsOfTen,
  comparingTwoDigit,
  countingOn,
  countingBack,
  makingTen,
  doublesAndNearDoubles,
  addingInAnyOrder,
  addingThreeNumbers,
  subtractingThroughTen,
  relatedFacts,
  missingAddends,
  theEqualSign,
  addingToStories,
  takingAwayStories,
  comparingStories,
  missingStartStories,
  threeAddendStories,
  addingMultiplesOfTen,
  addingTensToTwoDigit,
  tenMoreTenLess,
  subtractingMultiplesOfTen,
];
