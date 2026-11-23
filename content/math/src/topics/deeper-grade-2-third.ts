// A third knowledge point for the 2nd Grade Math topics that had two: the same idea
// run backwards, carried across a hundred, or used in a short story.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dotPlot } from "@ga/subject-math";
import {
  arrayFigure,
  baseTenFigure,
  clockFigure,
  coinsFigure,
  countersFigure,
  cutBarFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  gridFigure,
  jumpsFigure,
  numberLineFigure,
  rulerFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  blockRowsFigure,
  captioned,
  compareBarsFigure,
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

/** skill builds a knowledge point from its texts, generator and figure. */
const skill = earlyPoint;

/** storyThing picks a name and a thing for a word problem. */
const storyThing = (rng: Rng) => ({ who: rng.pick(earlyNames), thing: rng.pick(earlyThings) });

/** deeperGrade2ThirdPoints holds the third knowledge points of 2nd Grade Math, by topic. */
export const deeperGrade2ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "skip-counting-by-2s-5s-and-10s": [
    skill(
      "counting-back-by-a-step",
      ["Skip counting backward", "倒着跳数"],
      [
        "Count back by 5s: 40, 35, 30, 25. Each number is 5 less than the one before. The next one is $25 - 5 = 20$.\n\nCheck: $20 + 5 = 25$, so counting up from 20 gets back to 25.\n\n> **Watch out.** The numbers are getting smaller. Do not add the step.",
        "按 5 倒着数：40、35、30、25。每个数都比前一个少 5。下一个是 $25 - 5 = 20$。\n\n检验：$20 + 5 = 25$，从 20 往上数又回到 25。\n\n> **注意。** 这些数越来越小。不要加上步长。",
      ],
      (rng) => {
        const step = rng.pick([2, 5, 10]);
        const start = step * rng.int(8, 30);
        const list = [0, 1, 2, 3].map((i) => start - i * step);
        const last = start - 3 * step;
        const answer = start - 4 * step;
        return solved(
          [`What number comes next? $${list.join(", ")}, \\square$`, `下一个数是几？$${list.join(", ")}, \\square$`],
          answer,
          [
            [["Find the step", "找出步长"], ["Compare two neighbors:", "比较相邻的两个数："], [`${start} - ${start - step} = ${step}`]],
            [
              ["Take one more step back", "再往回走一步"],
              [`Each number is ${step} less:`, `每个数都少 ${step}：`],
              [`${last} - ${step} = ${answer}`],
            ],
          ],
          [`Count up again: $${answer} + ${step} = ${last}$.`, `再往上数：$${answer} + ${step} = ${last}$。`],
          [
            [last + step, "That counts up. The numbers are getting smaller.", "这是往上数了。这些数在变小。"],
            [last - 1, "That takes away 1, not the step.", "这只减了 1，不是步长。"],
            [answer - step, "That takes two steps back.", "这往回走了两步。"],
          ],
          hopsFigure([...list, answer], true),
        );
      },
      captioned(hopsFigure([40, 35, 30, 25]), "Hops of 5 back from 40: 35, 30, 25.", "从 40 每次往回跳 5：35、30、25。"),
    ),
  ],
  "even-and-odd-numbers": [
    skill(
      "even-or-odd-from-the-last-digit",
      ["Even or odd from the last digit", "由个位判断奇偶"],
      [
        "Is 346 even? Tens and hundreds always split into pairs, so look only at the ones. 346 ends in 6, and 6 makes 3 pairs. So 346 is even.\n\nCheck: $346 = 173 + 173$, two equal parts.\n\n> **Watch out.** Do not look at the first digit. 3 is odd, but 346 is even.",
        "346 是偶数吗？整十和整百总能两两分对，所以只看个位。346 的个位是 6，6 能分成 3 对。所以 346 是偶数。\n\n检验：$346 = 173 + 173$，能分成相等的两份。\n\n> **注意。** 不要看第一位。3 是奇数，可 346 是偶数。",
      ],
      (rng) => {
        const wantEven = rng.bool();
        const tens = rng.int(1, 89);
        const pick = (even: boolean) => tens * 10 + (even ? rng.pick([0, 2, 4, 6, 8]) : rng.pick([1, 3, 5, 7, 9]));
        const answer = pick(wantEven);
        const others = [pick(!wantEven) + 100, pick(!wantEven) + 200, pick(!wantEven) + 300];
        const word: Pair = wantEven ? ["even", "偶数"] : ["odd", "奇数"];
        const other: Pair = wantEven ? ["odd", "奇数"] : ["even", "偶数"];
        const wrong: Wrong[] = others.map((n) => [
          [`${n}`, `${n}`],
          `${n} ends in ${n % 10}, so it is ${other[0]}.`,
          `${n} 的个位是 ${n % 10}，所以是${other[1]}。`,
        ]);
        return picked(
          rng,
          [`Which of these numbers is ${word[0]}?`, `下面哪个数是${word[1]}？`],
          [`${answer}`, `${answer}`],
          wrong,
          [
            [
              ["Look at the ones", "只看个位"],
              ["Tens and hundreds always split into pairs, so only the last digit decides.", "整十和整百总能分对，所以只由个位决定。"],
            ],
            [
              ["Find the match", "找出符合的数"],
              [`${answer} ends in ${answer % 10}, which is ${word[0]}.`, `${answer} 的个位是 ${answer % 10}，是${word[1]}。`],
            ],
          ],
          wantEven
            ? [
                `$${answer} = ${answer / 2} + ${answer / 2}$, two equal parts.`,
                `$${answer} = ${answer / 2} + ${answer / 2}$，能分成相等的两份。`,
              ]
            : [
                `$${answer} = ${(answer - 1) / 2} + ${(answer + 1) / 2}$: the two parts always differ by one.`,
                `$${answer} = ${(answer - 1) / 2} + ${(answer + 1) / 2}$：两份总是差 1。`,
              ],
        );
      },
      captioned(countersFigure(6, 2), "The 6 ones of 346 make 3 pairs.", "346 个位上的 6 正好分成 3 对。"),
    ),
  ],
  "arrays-and-repeated-addition": [
    skill(
      "rows-and-columns-give-the-same-total",
      ["Rows and columns give the same total", "按行按列总数相同"],
      [
        "This array has 3 rows of 5. By rows: $5 + 5 + 5 = 15$. By columns there are 5 columns of 3: $3 + 3 + 3 + 3 + 3 = 15$.\n\nCheck: both sums count the same dots, so both are 15.\n\n> **Watch out.** The column sum has one 3 for each column. Count the columns: 5 of them.",
        "这个数组有 3 行，每行 5 个。按行加：$5 + 5 + 5 = 15$。按列看有 5 列，每列 3 个：$3 + 3 + 3 + 3 + 3 = 15$。\n\n检验：两个和数的是同样的点，所以都是 15。\n\n> **注意。** 按列相加时，每列写一个 3。数一数有几列：5 列。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const c = rng.int(2, 6);
        const rep = (n: number, k: number) => Array.from({ length: k }, () => n).join(" + ");
        const rows = rep(c, r);
        const cols = rep(r, c);
        const wrong: MathWrong[] = [
          [rep(r, c + 1), "That has one column too many.", "这多了一列。"],
          [`${r} + ${c}`, "That adds the number of rows and columns, not the dots.", "这是把行数和列数相加，不是点数。"],
          [rep(r + 1, c), `Each column has ${r} dots, not ${r + 1}.`, `每列有 ${r} 个点，不是 ${r + 1} 个。`],
        ];
        return pickedMath(
          rng,
          [
            `An array has ${r} rows with ${c} dots in each row. The rows give $${rows}$. Which sum adds its columns?`,
            `一个数组有 ${r} 行，每行 ${c} 个点。按行相加是 $${rows}$。哪个和是按列相加？`,
          ],
          cols,
          wrong,
          [
            [
              ["Count the columns", "数列数"],
              [`Each row has ${c} dots, so there are ${c} columns.`, `每行 ${c} 个点，所以有 ${c} 列。`],
            ],
            [
              ["Count down a column", "数一列"],
              [
                `Each column has one dot from each row: ${r} dots. So the sum has ${c} numbers, each ${r}.`,
                `每列从每行各取一个点：${r} 个点。所以和里有 ${c} 个 ${r}。`,
              ],
            ],
          ],
          [`Both sums count the same dots: each totals ${r * c}.`, `两个和数的是同样的点：都是 ${r * c}。`],
          arrayFigure(r, c),
        );
      },
      captioned(arrayFigure(3, 5), "3 rows of 5, which is also 5 columns of 3.", "3 行每行 5 个，也是 5 列每列 3 个。"),
    ),
  ],
  "hundreds-as-bundles-of-tens": [
    skill(
      "tens-needed-for-the-next-hundred",
      ["Tens needed for the next hundred", "到下一个整百还要几个十"],
      [
        "From 340 to 400, count by tens: 350, 360, 370, 380, 390, 400. That is 6 more tens.\n\nCheck: 340 has 4 tens; $4 + 6 = 10$ tens, which make a new hundred.\n\n> **Watch out.** Do not answer 4. That is the tens you have, not the tens you still need.",
        "从 340 到 400，一个十一个十地数：350、360、370、380、390、400，还要 6 个十。\n\n检验：340 有 4 个十；$4 + 6 = 10$ 个十，正好凑成一个新的百。\n\n> **注意。** 不要答 4。那是已经有的十，不是还要的十。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const tens = rng.int(1, 9);
        const n = h * 100 + tens * 10;
        const next = (h + 1) * 100;
        const answer = 10 - tens;
        return solved(
          [`How many more tens does it take to go from ${n} to ${next}?`, `从 ${n} 到 ${next} 还要几个十？`],
          answer,
          [
            [
              ["Count the tens you have", "数已有的十"],
              [`${n} has ${tens} tens after its hundreds.`, `${n} 在整百之外有 ${tens} 个十。`],
            ],
            [
              ["Fill up to ten tens", "补满十个十"],
              ["Ten tens make the next hundred:", "十个十凑成下一个百："],
              [`10 - ${tens} = ${answer}`],
            ],
          ],
          [
            `$${next} - ${n} = ${100 - tens * 10}$, and ${100 - tens * 10} is ${answer} tens.`,
            `$${next} - ${n} = ${100 - tens * 10}$，${100 - tens * 10} 是 ${answer} 个十。`,
          ],
          [
            [tens, "That is the tens you have, not the tens you need.", "这是已经有的十，不是还要的十。"],
            [100 - tens * 10, "That is the distance, not the number of tens.", "这是相差的数，不是十的个数。"],
            [answer + 1, "That is one ten too many.", "这多了一个十。"],
          ],
        );
      },
      captioned(
        jumpsFigure(340, 400, 10, [340, 350, 360, 370, 380, 390, 400]),
        "Six jumps of 10 from 340 to 400.",
        "从 340 跳到 400，每次 10，跳了六次。",
      ),
    ),
  ],
  "skip-counting-by-100s": [
    skill(
      "counting-back-by-hundreds",
      ["Counting back by hundreds", "一百一百地倒着数"],
      [
        "Count back by 100s from 738: 638, 538, 438. Only the hundreds digit goes down. The 3 tens and 8 ones stay.\n\nCheck: 3 hundreds back is $738 - 300 = 438$.\n\n> **Watch out.** Do not change the tens. 708 takes away tens, not hundreds.",
        "从 738 开始一百一百地倒着数：638、538、438。只有百位变小，十位的 3 和个位的 8 不变。\n\n检验：倒数 3 个一百就是 $738 - 300 = 438$。\n\n> **注意。** 不要改十位。708 减的是十，不是百。",
      ],
      (rng) => {
        const n = rng.int(450, 999);
        const k = rng.int(2, 4);
        const answer = n - k * 100;
        const stops = Array.from({ length: k }, (_, i) => n - (i + 1) * 100);
        return solved(
          [`Start at ${n} and count back by 100s, ${k} times. Where do you land?`, `从 ${n} 开始一百一百地倒着数 ${k} 次。落在几？`],
          answer,
          [
            [
              ["Count back", "倒着数"],
              [`${stops.join(", ")}.`, `${stops.join("、")}。`],
            ],
            [
              ["See what changed", "看哪一位变了"],
              [`Only the hundreds went down, ${k} times. You land on ${answer}.`, `只有百位减了 ${k} 次，落在 ${answer}。`],
            ],
          ],
          [`${k} hundreds back: $${n} - ${k * 100} = ${answer}$.`, `倒数 ${k} 个一百：$${n} - ${k * 100} = ${answer}$。`],
          [
            [n - k * 10, "That counts back by tens, not hundreds.", "这是按十倒着数，不是按百。"],
            [n - k, "That counts back by ones.", "这是按一倒着数。"],
            [n - (k + 1) * 100, "That counts back one hundred too many.", "这多数了一个一百。"],
          ],
        );
      },
      captioned(hopsFigure([738, 638, 538, 438]), "Hops of 100 back from 738: 638, 538, 438.", "从 738 每次往回跳 100：638、538、438。"),
    ),
  ],
  "place-value-up-to-1000": [
    skill(
      "building-a-number-from-digit-clues",
      ["Building a number from digit clues", "由数位线索组成数"],
      [
        "Clues: 7 ones, 3 hundreds, 5 tens. Put each digit in its place: hundreds 3, tens 5, ones 7. The number is 357.\n\nCheck: $300 + 50 + 7 = 357$.\n\n> **Watch out.** Do not write the digits in the order of the clues. 735 is wrong.",
        "线索：个位是 7，百位是 3，十位是 5。把每个数字放到自己的数位：百位 3，十位 5，个位 7。这个数是 357。\n\n检验：$300 + 50 + 7 = 357$。\n\n> **注意。** 不要按线索的顺序写数字。735 是错的。",
      ],
      (rng) => {
        const [h, te, o] = [rng.int(1, 9), rng.int(0, 9), rng.int(1, 9)];
        const n = h * 100 + te * 10 + o;
        return solved(
          [
            `A number has ${o} in the ones place, ${h} in the hundreds place and ${te} in the tens place. What is the number?`,
            `一个数个位是 ${o}，百位是 ${h}，十位是 ${te}。这个数是多少？`,
          ],
          n,
          [
            [
              ["Sort the clues", "整理线索"],
              [`Hundreds ${h}, tens ${te}, ones ${o}.`, `百位 ${h}，十位 ${te}，个位 ${o}。`],
            ],
            [
              ["Write from the left", "从左往右写"],
              [`Hundreds first, then tens, then ones: ${n}.`, `先写百位，再写十位、个位：${n}。`],
            ],
          ],
          [`$${h * 100} + ${te * 10} + ${o} = ${n}$.`, `$${h * 100} + ${te * 10} + ${o} = ${n}$。`],
          [
            [o * 100 + h * 10 + te, "That writes the digits in the order of the clues.", "这是按线索的顺序写的数字。"],
            [o * 100 + te * 10 + h, "That puts the hundreds and the ones the wrong way round.", "这把百位和个位写反了。"],
            [h * 100 + o * 10 + te, "That swaps the tens and the ones.", "这把十位和个位换了。"],
          ],
        );
      },
      captioned(baseTenFigure(3, 5, 7), "357 in blocks: 3 hundreds, 5 tens and 7 ones.", "用积木表示 357：3 个百、5 个十、7 个一。"),
    ),
  ],
  "expanded-form-up-to-1000": [
    skill(
      "expanded-form-out-of-order",
      ["Expanded form out of order", "打乱顺序的展开式"],
      [
        "$2 + 600 + 40$ starts with the ones. Sort the parts by value: 600 is the hundreds, 40 the tens, 2 the ones. The number is 642.\n\nCheck: $600 + 40 + 2 = 642$.\n\n> **Watch out.** Do not copy the digits in the order you see them. 264 is wrong.",
        "$2 + 600 + 40$ 是从个位开始写的。按大小整理：600 是百，40 是十，2 是一。这个数是 642。\n\n检验：$600 + 40 + 2 = 642$。\n\n> **注意。** 不要照着看到的顺序抄数字。264 是错的。",
      ],
      (rng) => {
        const [h, te, o] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
        const order = rng.shuffle([0, 1, 2]);
        if (order[0] === 0 && order[1] === 1) order.reverse();
        const values = [h * 100, te * 10, o];
        const digits = [h, te, o];
        const parts = order.map((i) => values[i] as number);
        const n = h * 100 + te * 10 + o;
        const copied = Number(order.map((i) => digits[i]).join(""));
        return solved(
          [`What number is $${parts.join(" + ")}$?`, `$${parts.join(" + ")}$ 是多少？`],
          n,
          [
            [
              ["Sort by value", "按大小整理"],
              [`Hundreds ${h * 100}, tens ${te * 10}, ones ${o}.`, `百是 ${h * 100}，十是 ${te * 10}，一是 ${o}。`],
            ],
            [
              ["Write the number", "写出这个数"],
              [`Hundreds ${h}, tens ${te}, ones ${o}: ${n}.`, `百位 ${h}，十位 ${te}，个位 ${o}：${n}。`],
            ],
          ],
          [`$${h * 100} + ${te * 10} + ${o} = ${n}$.`, `$${h * 100} + ${te * 10} + ${o} = ${n}$。`],
          [
            [copied, "That copies the digits in the order they are written.", "这是照着写的顺序抄的数字。"],
            [h + te + o, "That adds the digits instead of their values.", "这是把数字加起来，没有按它们代表的值。"],
            [h * 100 + o * 10 + te, "That swaps the tens and the ones.", "这把十位和个位换了。"],
          ],
        );
      },
      captioned(baseTenFigure(6, 4, 2), "642 in blocks: 600, 40 and 2.", "用积木表示 642：600、40 和 2。"),
    ),
  ],
  "number-names-up-to-1000": [
    skill(
      "names-with-no-tens",
      ["Names with no tens", "没有十位的数的读法"],
      [
        "Two hundred six: 2 hundreds, no tens, 6 ones. The name skips the tens, but the digits do not: write 206.\n\nCheck: 206 read aloud is two hundred six.\n\n> **Watch out.** Do not write 26. Without the 0, the 2 would mean 2 tens.",
        "二百零六：2 个百，没有十，6 个一。读的时候十位用“零”，写的时候十位要写 0：206。\n\n检验：206 读作二百零六。\n\n> **注意。** 不要写成 26。没有 0，2 就变成 2 个十了。",
      ],
      (rng) => {
        const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        const h = rng.int(1, 9);
        const o = rng.int(1, 9);
        const n = h * 100 + o;
        return solved(
          [`Write this number with digits: ${words[h]} hundred ${words[o]}.`, `用数字写出这个数：${zh[h]}百零${zh[o]}。`],
          n,
          [
            [
              ["Listen for each place", "听出每一位"],
              [`${h} hundreds, no tens, ${o} ones.`, `${h} 个百，没有十，${o} 个一。`],
            ],
            [
              ["Hold the empty place", "给空位占位"],
              [`Write 0 in the tens place: ${n}.`, `十位写 0：${n}。`],
            ],
          ],
          [`$${h * 100} + ${o} = ${n}$.`, `$${h * 100} + ${o} = ${n}$。`],
          [
            [h * 10 + o, "That drops the 0, so the hundreds become tens.", "这漏了 0，百就变成十了。"],
            [h * 100 + o * 10, "That puts the ones in the tens place.", "这把个位写到了十位上。"],
            [n + 10, "That has one ten, but the name has none.", "这有一个十，可读法里没有十。"],
          ],
        );
      },
      captioned(baseTenFigure(2, 0, 6), "Two hundred six: 2 hundreds, no tens, 6 ones.", "二百零六：2 个百，没有十，6 个一。"),
    ),
  ],
  "comparing-numbers-up-to-1000": [
    skill(
      "the-digit-that-keeps-it-true",
      ["The digit that keeps it true", "使不等式成立的数字"],
      [
        "$3\\square5 < 347$: the hundreds match, so try tens digits. With 4: $345 < 347$, true. With 5: $355 > 347$, false. So the largest digit is 4.\n\nCheck: 345 sits just left of 347 on a number line.\n\n> **Watch out.** Do not stop at the tens of 347. 4 works here only because 5 ones is less than 7.",
        "$3\\square5 < 347$：百位相同，就试十位。填 4：$345 < 347$，成立。填 5：$355 > 347$，不成立。所以最大填 4。\n\n检验：在数轴上，345 就在 347 的左边。\n\n> **注意。** 不要一看到 347 的十位就停。这里能填 4，是因为个位 5 比 7 小。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const te = rng.int(2, 8);
        const o = rng.int(0, 9);
        const n = h * 100 + te * 10 + o;
        const less = rng.bool();
        const trail = rng.int(0, 9);
        const correct = less ? (trail < o ? te : te - 1) : trail > o ? te : te + 1;
        const blank = `${h}\\square${trail}`;
        const sym = less ? "<" : ">";
        const make = (d: number) => h * 100 + d * 10 + trail;
        const next = less ? correct + 1 : correct - 1;
        const slips: Slip[] = [
          [
            next,
            `Then the number is ${make(next)}, which is not ${less ? "less" : "greater"} than ${n}.`,
            `那样得到 ${make(next)}，不${less ? "小于" : "大于"} ${n}。`,
          ],
          [
            less ? correct - 1 : correct + 1,
            `That works, but a ${less ? "larger" : "smaller"} digit works too.`,
            `这样也成立，但还有更${less ? "大" : "小"}的数字。`,
          ],
          [
            less ? 9 : 0,
            `Then the number is ${make(less ? 9 : 0)}, which is not ${less ? "less" : "greater"} than ${n}.`,
            `那样得到 ${make(less ? 9 : 0)}，不${less ? "小于" : "大于"} ${n}。`,
          ],
        ];
        return solved(
          less
            ? [`What is the largest digit that can go in the box? $$${blank} < ${n}$$`, `方框里最大能填几？$$${blank} < ${n}$$`]
            : [`What is the smallest digit that can go in the box? $$${blank} > ${n}$$`, `方框里最小能填几？$$${blank} > ${n}$$`],
          correct,
          [
            [
              ["Compare the hundreds", "先比百位"],
              [`Both have ${h} hundreds, so the tens decide.`, `百位都是 ${h}，由十位决定。`],
            ],
            [
              [`Try ${te} in the tens`, `十位试填 ${te}`],
              [
                `${make(te)} ${make(te) < n ? "<" : make(te) === n ? "=" : ">"} ${n}, so ${te} ${correct === te ? "works" : "does not work"}.`,
                `${make(te)} ${make(te) < n ? "<" : make(te) === n ? "=" : ">"} ${n}，所以 ${te} ${correct === te ? "可以" : "不行"}。`,
              ],
            ],
            [
              ["Choose the digit", "选出数字"],
              [
                `The ${less ? "largest" : "smallest"} digit that works is ${correct}:`,
                `能成立的${less ? "最大" : "最小"}数字是 ${correct}：`,
              ],
              [`${make(correct)} ${sym} ${n}`],
            ],
          ],
          [
            `One step further fails: ${make(next)} is not ${less ? "less" : "greater"} than ${n}.`,
            `再${less ? "大" : "小"}一个就不行：${make(next)} 不${less ? "小于" : "大于"} ${n}。`,
          ],
          slips.filter((s) => s[0] <= 9),
        );
      },
      captioned(
        numberLineFigure(340, 350, 1, 347, false),
        "A number line from 340 to 350 with 347 marked; 345 sits to its left.",
        "从 340 到 350 的数轴，标出 347；345 在它左边。",
      ),
    ),
  ],
  "adding-and-subtracting-10-or-100": [
    skill(
      "ten-or-a-hundred-across-a-boundary",
      ["Ten or a hundred more or less, undone", "由加减十或百求原数"],
      [
        "$\\square + 100 = 642$: something plus 100 made 642. Undo it by taking 100 away: $642 - 100 = 542$.\n\nCheck: $542 + 100 = 642$.\n\n> **Watch out.** Do not add 100 again. Undo adding with taking away.",
        "$\\square + 100 = 642$：一个数加 100 得 642。减去 100 来还原：$642 - 100 = 542$。\n\n检验：$542 + 100 = 642$。\n\n> **注意。** 不要再加 100。加法要用减法来还原。",
      ],
      (rng) => {
        const by = rng.pick([10, 100]);
        const n = rng.int(120, 880);
        const added = rng.bool();
        const shown = added ? n + by : n - by;
        const op = added ? "-" : "+";
        return solved(
          added
            ? [`What number goes in the box? $$\\square + ${by} = ${shown}$$`, `方框里填几？$$\\square + ${by} = ${shown}$$`]
            : [`What number goes in the box? $$\\square - ${by} = ${shown}$$`, `方框里填几？$$\\square - ${by} = ${shown}$$`],
          n,
          [
            [
              ["See what was done", "看做了什么"],
              added
                ? [`${by} was added to the box.`, `方框里的数加了 ${by}。`]
                : [`${by} was taken from the box.`, `方框里的数减了 ${by}。`],
            ],
            [
              ["Undo it", "还原"],
              added ? [`Take ${by} away:`, `减去 ${by}：`] : [`Add ${by} back:`, `加回 ${by}：`],
              [`${shown} ${op} ${by} = ${n}`],
            ],
          ],
          [`Put it in the box: $${n} ${added ? "+" : "-"} ${by} = ${shown}$.`, `代入方框：$${n} ${added ? "+" : "-"} ${by} = ${shown}$。`],
          [
            [added ? shown + by : shown - by, "That does the same step again instead of undoing it.", "这又做了一遍同样的事，没有还原。"],
            [shown, "That is the number after the change, not before.", "这是变化之后的数，不是之前的。"],
            [
              added ? shown - (by === 10 ? 100 : 10) : shown + (by === 10 ? 100 : 10),
              "That undoes with the wrong amount.",
              "这还原时用错了数。",
            ],
          ],
        );
      },
      captioned(hopsFigure([542, 642]), "A hop of 100 from 542 to 642.", "从 542 跳 100 到 642。"),
    ),
  ],
  "adding-and-subtracting-within-20-quickly": [
    skill(
      "the-box-on-either-side",
      ["The box on either side", "方框在任意一边"],
      [
        "$\\square + 6 = 14$: which fact has 6 and 14? $8 + 6 = 14$, so the box is 8.\n\nCheck: $14 - 6 = 8$.\n\n> **Watch out.** Do not add 6 and 14. The box is a part, so it is less than 14.",
        "$\\square + 6 = 14$：哪个算式里有 6 和 14？$8 + 6 = 14$，所以方框里是 8。\n\n检验：$14 - 6 = 8$。\n\n> **注意。** 不要把 6 和 14 相加。方框是一部分，比 14 小。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const s = a + b;
        const form = rng.int(0, 2);
        const prompt = form === 0 ? `\\square + ${b} = ${s}` : form === 1 ? `${s} - \\square = ${b}` : `${s} = ${b} + \\square`;
        return solved(
          [`What number goes in the box? $$${prompt}$$`, `方框里填几？$$${prompt}$$`],
          a,
          [
            [
              ["Find the three numbers", "找出这组数"],
              [`The fact uses ${b}, ${s} and the box. ${s} is the whole.`, `算式里有 ${b}、${s} 和方框。${s} 是总数。`],
            ],
            [["Use the fact you know", "用会的算式"], ["The box is the other part:", "方框是另一部分："], [`${b} + ${a} = ${s}`]],
          ],
          [`$${s} - ${b} = ${a}$.`, `$${s} - ${b} = ${a}$。`],
          [
            [s + b, "That adds the whole and the part.", "这把总数和部分加起来了。"],
            [a + 1, "That is one too many. Check the fact again.", "多了 1，再检查一下算式。"],
            [a - 1, "That is one too few. Check the fact again.", "少了 1，再检查一下算式。"],
          ],
          factTriangleFigure(s, b, null),
        );
      },
      captioned(factTriangleFigure(14, 6, 8), "A fact triangle: 6 and 8 make 14.", "算式三角：6 和 8 合起来是 14。"),
    ),
  ],
  "adding-several-two-digit-numbers": [
    skill(
      "choosing-a-friendly-pair",
      ["Choosing a friendly pair", "找好算的一对"],
      [
        "$23 + 35 + 17$: the ones 3 and 7 make ten. Add that pair first: $23 + 17 = 40$. Then $40 + 35 = 75$.\n\nCheck: in order, $23 + 35 = 58$ and $58 + 17 = 75$.\n\n> **Watch out.** Do not forget the third number after the pair. 40 is only part of the sum.",
        "$23 + 35 + 17$：个位 3 和 7 凑成十。先加这一对：$23 + 17 = 40$。再算 $40 + 35 = 75$。\n\n检验：按顺序加，$23 + 35 = 58$，$58 + 17 = 75$。\n\n> **注意。** 加完这一对，别忘了第三个数。40 只是一部分。",
      ],
      (rng) => {
        const o = rng.int(1, 9);
        const x = rng.int(1, 3) * 10 + o;
        const y = rng.int(1, 3) * 10 + (10 - o);
        const z = rng.int(11, 39);
        const list = rng.shuffle([x, y, z]);
        const answer = x + y + z;
        const [p, q, r] = list as [number, number, number];
        return solved(
          [
            `Add the two numbers whose ones make ten first. What is $${list.join(" + ")}$?`,
            `先把个位相加得十的两个数相加。$${list.join(" + ")}$ 是多少？`,
          ],
          answer,
          [
            [
              ["Find the friendly pair", "找出好算的一对"],
              [`${x} and ${y}: the ones ${o} and ${10 - o} make ten.`, `${x} 和 ${y}：个位 ${o} 和 ${10 - o} 凑成十。`],
              [`${x} + ${y} = ${x + y}`],
            ],
            [["Add the third number", "加上第三个数"], [`Then add ${z}:`, `再加 ${z}：`], [`${x + y} + ${z} = ${answer}`]],
          ],
          [
            `In order: $${p} + ${q} = ${p + q}$ and $${p + q} + ${r} = ${answer}$.`,
            `按顺序加：$${p} + ${q} = ${p + q}$，$${p + q} + ${r} = ${answer}$。`,
          ],
          [
            [x + y, "That is only the pair. Add the third number too.", "这只是那一对的和，还要加第三个数。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
            [answer - 10, "That loses the ten made by the pair.", "这漏掉了那一对凑成的十。"],
          ],
          partWholeBarFigure(list, -1),
        );
      },
      captioned(partWholeBarFigure([23, 35, 17], -1), "Parts 23, 35 and 17; the whole is unknown.", "三部分 23、35 和 17，总数未知。"),
    ),
  ],
  "missing-numbers-within-100": [
    skill(
      "the-whole-before-a-subtraction",
      ["The whole before a subtraction", "减法之前的整体"],
      [
        "$\\square - 28 = 45$: 28 was taken away and 45 is left. The box is the whole, so put the parts together: $28 + 45 = 73$.\n\nCheck: $73 - 28 = 45$.\n\n> **Watch out.** Do not take 28 from 45. The whole must be bigger than both parts.",
        "$\\square - 28 = 45$：去掉了 28，剩下 45。方框是整体，所以把两部分合起来：$28 + 45 = 73$。\n\n检验：$73 - 28 = 45$。\n\n> **注意。** 不要用 45 减 28。整体一定比两部分都大。",
      ],
      (rng) => {
        const b = rng.int(11, 49);
        const c = rng.int(11, 49);
        const answer = b + c;
        return solved(
          [`What number goes in the box? $$\\square - ${b} = ${c}$$`, `方框里填几？$$\\square - ${b} = ${c}$$`],
          answer,
          [
            [
              ["See the parts", "看清两部分"],
              [`${b} was taken away and ${c} is left. The box is the whole.`, `去掉 ${b}，剩下 ${c}。方框是整体。`],
            ],
            [["Put the parts together", "两部分合起来"], ["Add the parts:", "把两部分相加："], [`${b} + ${c} = ${answer}`]],
          ],
          [`$${answer} - ${b} = ${c}$.`, `$${answer} - ${b} = ${c}$。`],
          [
            [Math.abs(c - b), "That subtracts. The whole is the parts added together.", "这是相减。整体是两部分相加。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
            [answer - 10, "That forgets the new ten from the ones.", "这忘了个位满十进的那个十。"],
          ],
          partWholeBarFigure([b, c], -1),
        );
      },
      captioned(partWholeBarFigure([28, 45], -1), "Parts 28 and 45; the whole is unknown.", "两部分 28 和 45，整体未知。"),
    ),
  ],
  "adding-within-1000-with-models": [
    skill(
      "regrouping-tens-into-a-hundred",
      ["Regrouping tens into a hundred", "把十换成百"],
      [
        "$270 + 150$: tens $7 + 5 = 12$. Ten of those tens make a new hundred, leaving 2 tens. Hundreds $2 + 1 + 1 = 4$. The sum is 420.\n\nCheck: $270 + 130 = 400$, and $400 + 20 = 420$.\n\n> **Watch out.** Do not forget the new hundred. 320 leaves it out.",
        "$270 + 150$：十位 $7 + 5 = 12$。其中十个十换成一个新的百，剩 2 个十。百位 $2 + 1 + 1 = 4$。和是 420。\n\n检验：$270 + 130 = 400$，$400 + 20 = 420$。\n\n> **注意。** 别忘了新的百。320 就是把它漏了。",
      ],
      (rng) => {
        const [ha, hb] = [rng.int(1, 4), rng.int(1, 4)];
        const ta = rng.int(3, 9);
        const tb = rng.int(10 - ta, 9);
        const [oa, ob] = [rng.int(0, 4), rng.int(0, 5)];
        const a = ha * 100 + ta * 10 + oa;
        const b = hb * 100 + tb * 10 + ob;
        const answer = a + b;
        return solved(
          [`The tens need a trade. What is $${a} + ${b}$?`, `十位需要进位。$${a} + ${b}$ 是多少？`],
          answer,
          [
            [["Add the ones", "个位相加"], ["Ones:", "个位："], [`${oa} + ${ob} = ${oa + ob}`]],
            [
              ["Add the tens and trade", "十位相加并换"],
              [`${ta + tb} tens make 1 hundred and ${ta + tb - 10} tens.`, `${ta + tb} 个十是 1 个百和 ${ta + tb - 10} 个十。`],
              [`${ta} + ${tb} = ${ta + tb}`],
            ],
            [["Add the hundreds", "百位相加"], ["Hundreds, with the new one:", "百位加上新的百："], [`${ha} + ${hb} + 1 = ${ha + hb + 1}`]],
          ],
          [`Take it back: $${answer} - ${b} = ${a}$.`, `倒回去验算：$${answer} - ${b} = ${a}$。`],
          [
            [answer - 100, "That forgets the new hundred from the tens.", "这忘了十位满十进的那个百。"],
            [answer + 100, "That adds the new hundred twice.", "这把新的百加了两次。"],
            [answer - 10, "That has one ten too few.", "这少了一个十。"],
          ],
          blockRowsFigure([
            [ha, ta, oa],
            [hb, tb, ob],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [2, 7, 0],
          [1, 5, 0],
        ]),
        "270 and 150 in blocks: 12 tens trade for a hundred and 2 tens.",
        "用积木表示 270 和 150：12 个十换成一个百和 2 个十。",
      ),
    ),
  ],
  "subtracting-within-1000-with-models": [
    skill(
      "opening-a-hundred",
      ["Opening a hundred", "拆开一个百"],
      [
        "$425 - 182$: ones $5 - 2 = 3$. Tens: 2 is less than 8, so open a hundred into 10 tens. Now 3 hundreds and 12 tens. $12 - 8 = 4$ and $3 - 1 = 2$. The answer is 243.\n\nCheck: $243 + 182 = 425$.\n\n> **Watch out.** Do not take 2 from 8 in the tens. 363 is wrong. Open a hundred first.",
        "$425 - 182$：个位 $5 - 2 = 3$。十位 2 比 8 小，就把一个百拆成 10 个十。现在是 3 个百和 12 个十。$12 - 8 = 4$，$3 - 1 = 2$。答案是 243。\n\n检验：$243 + 182 = 425$。\n\n> **注意。** 十位不要用 8 减 2。363 是错的。要先拆开一个百。",
      ],
      (rng) => {
        const ha = rng.int(3, 9);
        const ta = rng.int(0, 5);
        const oa = rng.int(5, 9);
        const hb = rng.int(1, ha - 1);
        const tb = rng.int(ta + 1, 9);
        const ob = rng.int(0, oa);
        const a = ha * 100 + ta * 10 + oa;
        const b = hb * 100 + tb * 10 + ob;
        const answer = a - b;
        return solved(
          [`The tens need a hundred opened. What is $${a} - ${b}$?`, `十位不够减，要拆开一个百。$${a} - ${b}$ 是多少？`],
          answer,
          [
            [["Take the ones", "个位相减"], ["Ones:", "个位："], [`${oa} - ${ob} = ${oa - ob}`]],
            [
              ["Open a hundred", "拆开一个百"],
              [
                `${ta} tens is less than ${tb}, so ${a} becomes ${ha - 1} hundreds and ${ta + 10} tens.`,
                `${ta} 个十比 ${tb} 少，所以 ${a} 变成 ${ha - 1} 个百和 ${ta + 10} 个十。`,
              ],
              [`${ta + 10} - ${tb} = ${ta + 10 - tb}`],
            ],
            [["Take the hundreds", "百位相减"], ["Hundreds:", "百位："], [`${ha - 1} - ${hb} = ${ha - 1 - hb}`]],
          ],
          [`Add back: $${answer} + ${b} = ${a}$.`, `加回去验算：$${answer} + ${b} = ${a}$。`],
          [
            [
              (ha - hb) * 100 + (tb - ta) * 10 + oa - ob,
              "That takes the smaller tens digit from the bigger one instead of opening a hundred.",
              "这用大的十位减小的十位，没有拆开一个百。",
            ],
            [answer + 100, "That forgets the hundred that was opened.", "这忘了已经拆开了一个百。"],
            [answer - 100, "That takes away one hundred too many.", "这多减了一个百。"],
          ],
          baseTenFigure(ha, ta, oa),
        );
      },
      captioned(
        baseTenFigure(4, 2, 5),
        "425 in blocks; one hundred will be opened into 10 tens.",
        "用积木表示 425；要把一个百拆成 10 个十。",
      ),
    ),
  ],
  "comparing-word-problems-within-100": [
    skill(
      "how-many-to-catch-up",
      ["How many to catch up", "还要多少才赶上"],
      [
        "Ana has 30 cards, 12 fewer than Ben, so Ben has 42. Ben gives away 5 and has 37. To catch up, Ana needs $37 - 30 = 7$ more.\n\nCheck: $30 + 7 = 37$, the same as Ben.\n\n> **Watch out.** The gap changed when Ben gave some away. 12 is the old gap.",
        "安娜有 30 张卡片，比本少 12 张，所以本有 42 张。本送出 5 张，还有 37 张。安娜还要 $37 - 30 = 7$ 张才赶上。\n\n检验：$30 + 7 = 37$，和本一样多。\n\n> **注意。** 本送出卡片以后，差变了。12 是原来的差。",
      ],
      (rng) => {
        const a = rng.int(12, 60);
        const d = rng.int(7, 35);
        const [p, q] = rng.shuffle(earlyNames).slice(0, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const gift = rng.int(2, d - 2);
        const now = a + d - gift;
        const answer = d - gift;
        return solved(
          [
            `${p} has ${a} ${thing.en}, which is ${d} fewer than ${q} has. ${q} gives away ${gift} ${thing.en}. How many more must ${p} get to have as many as ${q}?`,
            `${p} 有 ${a} ${thing.unit}${thing.zh}，比 ${q} 少 ${d} ${thing.unit}。${q} 送出 ${gift} ${thing.unit}${thing.zh}。${p} 还要再得到多少${thing.unit}，才和 ${q} 一样多？`,
          ],
          answer,
          [
            [
              [`Find what ${q} has`, `求 ${q} 有多少`],
              [`${q} had ${d} more, then gave ${gift} away:`, `${q} 原来多 ${d}，后来送出 ${gift}：`],
              [`${a} + ${d} - ${gift} = ${now}`],
            ],
            [["Find the new gap", "求新的差"], [`${p} needs to reach ${now}:`, `${p} 要达到 ${now}：`], [`${now} - ${a} = ${answer}`]],
          ],
          [`$${a} + ${answer} = ${now}$, the same as ${q}.`, `$${a} + ${answer} = ${now}$，和 ${q} 一样多。`],
          [
            [d, "That is the old gap, before the gift.", "这是送出之前的差。"],
            [d + gift, "The gift makes the gap smaller, not bigger.", "送出东西会让差变小，不是变大。"],
            [now, `That is how many ${q} has now, not the gap.`, `这是 ${q} 现在有的数量，不是差。`],
          ],
          compareBarsFigure(["A", "B"], [a, now], "gap"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [30, 37], "gap"),
        "Bar A is Ana's 30 and bar B is Ben's 37 after the gift; the gap is unknown.",
        "长条 A 是安娜的 30，长条 B 是本送出后的 37，差未知。",
      ),
    ),
  ],
  "two-step-word-problems-within-100": [
    skill(
      "working-back-to-the-start",
      ["Working back to the start", "倒推回开始"],
      [
        "Sam got 15 shells, then gave away 8. Now he has 32. Undo the last step first: $32 + 8 = 40$. Then undo the first: $40 - 15 = 25$. He started with 25.\n\nCheck: $25 + 15 = 40$ and $40 - 8 = 32$.\n\n> **Watch out.** Undo each step the opposite way. Gave away means add back.",
        "萨姆得到 15 个贝壳，然后送出 8 个，现在有 32 个。先还原最后一步：$32 + 8 = 40$。再还原第一步：$40 - 15 = 25$。他开始有 25 个。\n\n检验：$25 + 15 = 40$，$40 - 8 = 32$。\n\n> **注意。** 每一步都要反过来还原。送出的要加回来。",
      ],
      (rng) => {
        const start = rng.int(15, 50);
        const gain = rng.int(6, 30);
        const lose = rng.int(4, start);
        const end = start + gain - lose;
        const { who, thing } = storyThing(rng);
        return solved(
          [
            `${who} got ${gain} ${thing.en} and then gave away ${lose}. Now ${who} has ${end}. How many did ${who} have at the start?`,
            `${who} 得到 ${gain} ${thing.unit}${thing.zh}，然后送出 ${lose} ${thing.unit}，现在有 ${end} ${thing.unit}。${who} 开始有多少${thing.unit}？`,
          ],
          start,
          [
            [
              ["Undo the last step", "还原最后一步"],
              [`Add back the ${lose} given away:`, `把送出的 ${lose} 加回来：`],
              [`${end} + ${lose} = ${end + lose}`],
            ],
            [
              ["Undo the first step", "还原第一步"],
              [`Take off the ${gain} that were got:`, `减去得到的 ${gain}：`],
              [`${end + lose} - ${gain} = ${start}`],
            ],
          ],
          [
            `Run it forward: $${start} + ${gain} = ${start + gain}$ and $${start + gain} - ${lose} = ${end}$.`,
            `顺着再算：$${start} + ${gain} = ${start + gain}$，$${start + gain} - ${lose} = ${end}$。`,
          ],
          [
            [end + gain - lose, "That does the steps again instead of undoing them.", "这又做了一遍，没有还原。"],
            [end + gain + lose, "Getting more is undone by taking away, not adding.", "得到的要用减法还原，不是加法。"],
            [end + lose, "That undoes only the last step.", "这只还原了最后一步。"],
          ],
        );
      },
      captioned(
        hopsFigure([25, 40, 32]),
        "Up 15 from 25 to 40, then back 8 to 32; work back from 32.",
        "从 25 往前跳 15 到 40，再往回跳 8 到 32；从 32 倒推回去。",
      ),
    ),
  ],
  "measuring-length-in-inches-and-centimeters": [
    skill(
      "the-other-end-on-a-ruler",
      ["The other end on a ruler", "尺子上的另一端"],
      [
        "A straw is 4 centimeters long, and one end is at the 3 mark. The other end is 4 more along the ruler: $3 + 4 = 7$.\n\nCheck: count the spaces from 3 to 7: 4 of them.\n\n> **Watch out.** Start counting at the end of the straw, 3, not at 0. The other end is not at the 4 mark.",
        "一根吸管长 4 厘米，一端对着 3。另一端在尺子上再往后 4：$3 + 4 = 7$。\n\n检验：数从 3 到 7 之间的格子：4 格。\n\n> **注意。** 要从吸管的一端 3 开始数，不是从 0 开始。另一端不在 4 的刻度上。",
      ],
      (rng) => {
        const start = rng.int(1, 9);
        const len = rng.int(2, 14);
        const inches = rng.bool();
        const unit: Pair = inches ? [len === 1 ? "inch" : "inches", "英寸"] : ["centimeters", "厘米"];
        const end = start + len;
        return solved(
          [
            `A straw is ${len} ${unit[0]} long. One end lines up with the ${start} mark on a ruler. Which mark does the other end reach, going up?`,
            `一根吸管长 ${len} ${unit[1]}。一端对着尺子上的 ${start} 刻度。另一端往大的方向对着哪个刻度？`,
          ],
          end,
          [
            [
              ["Start at the end", "从一端开始"],
              [`One end is at ${start}.`, `一端对着 ${start}。`],
            ],
            [
              ["Count on the length", "往后数长度"],
              [`Go ${len} more along the ruler:`, `在尺子上再往后 ${len}：`],
              [`${start} + ${len} = ${end}`],
            ],
          ],
          [
            `From ${end} back to ${start} is $${end} - ${start} = ${len}$, the length.`,
            `从 ${end} 回到 ${start} 是 $${end} - ${start} = ${len}$，正是长度。`,
          ],
          [
            [
              len,
              "That is the length. It would be the mark only if the straw started at 0.",
              "这是长度。只有吸管从 0 开始时，它才是刻度。",
            ],
            [end + 1, "That counts the starting mark as one of the spaces.", "这把开始的刻度也算成了一格。"],
            [Math.abs(len - start), "That subtracts. Going up the ruler means add.", "这是相减。往大的方向要相加。"],
          ],
        );
      },
      captioned(rulerFigure(4, "cm", 10, 3), "A straw from the 3 mark to the 7 mark: 4 centimeters.", "吸管从 3 到 7：4 厘米。"),
    ),
  ],
  "feet-and-meters": [
    skill(
      "feet-and-inches-together",
      ["Feet and inches together", "英尺和英寸合起来"],
      [
        "A board is 2 feet 5 inches long. Each foot is 12 inches, so 2 feet is $12 + 12 = 24$ inches. Add the 5 extra inches: $24 + 5 = 29$ inches.\n\nCheck: take away the feet, $29 - 12 - 12 = 5$, the extra inches.\n\n> **Watch out.** A foot is 12 inches, not 10. 2 feet 5 inches is not 25 inches.",
        "一块木板长 2 英尺 5 英寸。每英尺是 12 英寸，所以 2 英尺是 $12 + 12 = 24$ 英寸。再加上多出的 5 英寸：$24 + 5 = 29$ 英寸。\n\n检验：去掉英尺，$29 - 12 - 12 = 5$，正是多出的英寸。\n\n> **注意。** 1 英尺是 12 英寸，不是 10 英寸。2 英尺 5 英寸不是 25 英寸。",
      ],
      (rng) => {
        const f = rng.int(1, 5);
        const i = rng.int(1, 11);
        const things: readonly Pair[] = [
          ["board", "木板"],
          ["rope", "绳子"],
          ["table", "桌子"],
          ["ladder", "梯子"],
          ["fence", "栅栏"],
        ];
        const thing = rng.pick(things);
        const feet = f * 12;
        const twelves = Array<string>(f).fill("12").join(" + ");
        return solved(
          [
            `A ${thing[0]} is ${f} ${f === 1 ? "foot" : "feet"} ${i} ${i === 1 ? "inch" : "inches"} long. How long is it in inches?`,
            `${thing[1]}长 ${f} 英尺 ${i} 英寸。它是多少英寸？`,
          ],
          feet + i,
          [
            [["The feet in inches", "英尺换成英寸"], ["Each foot is 12 inches:", "每英尺是 12 英寸："], [`${twelves} = ${feet}`]],
            [["Add the extra inches", "加上多出的英寸"], [`${i} more inches:`, `再加 ${i} 英寸：`], [`${feet} + ${i} = ${feet + i}`]],
          ],
          [
            `Take away the feet: $${feet + i} - ${feet} = ${i}$, the extra inches.`,
            `去掉英尺：$${feet + i} - ${feet} = ${i}$，正是多出的英寸。`,
          ],
          [
            [
              f + i,
              "That adds the numbers of feet and inches as if they were the same unit.",
              "这把英尺数和英寸数直接相加，好像它们是同一个单位。",
            ],
            [f * 10 + i, "That counts a foot as 10 inches. A foot is 12 inches.", "这把 1 英尺当成了 10 英寸。1 英尺是 12 英寸。"],
            [feet, "That leaves out the extra inches.", "这漏了多出的英寸。"],
          ],
        );
      },
      captioned(
        partWholeBarFigure([12, 12, 5], -1),
        "2 feet 5 inches: 12 and 12 and 5 inches make 29 inches.",
        "2 英尺 5 英寸：12、12、5 英寸合起来是 29 英寸。",
      ),
    ),
  ],
  "same-length-in-different-units": [
    skill(
      "from-small-blocks-to-big-blocks",
      ["From small blocks to big blocks", "从小块到大块"],
      [
        "A shelf is 12 small blocks long, and 3 small blocks match one big block. Count by 3s up to 12: 3, 6, 9, 12. That is 4 counts, so the shelf is 4 big blocks long.\n\nCheck: $3 + 3 + 3 + 3 = 12$ small blocks.\n\n> **Watch out.** A bigger unit gives a smaller count. The shelf is fewer than 12 big blocks long.",
        "书架长 12 个小块，3 个小块和 1 个大块一样长。3 个 3 个地数到 12：3、6、9、12。数了 4 次，所以书架长 4 个大块。\n\n检验：$3 + 3 + 3 + 3 = 12$ 个小块。\n\n> **注意。** 单位越大，数出的个数越少。书架的长度不到 12 个大块。",
      ],
      (rng) => {
        const per = rng.int(2, 5);
        const big = rng.int(2, 9);
        const total = per * big;
        const counts = Array.from({ length: big }, (_, k) => (k + 1) * per);
        return solved(
          [
            `A shelf is ${total} small blocks long. One big block is as long as ${per} small blocks. How many big blocks long is the shelf?`,
            `书架长 ${total} 个小块。1 个大块和 ${per} 个小块一样长。书架长几个大块？`,
          ],
          big,
          [
            [
              ["Count by the big block", "按大块数"],
              [`Count by ${per}s up to ${total}:`, `${per} 个 ${per} 个地数到 ${total}：`],
              [counts.join(", ")],
            ],
            [
              ["Count the counts", "数次数"],
              [`That is ${big} counts, so ${big} big blocks.`, `数了 ${big} 次，所以是 ${big} 个大块。`],
            ],
          ],
          [
            `$${Array<string>(big).fill(`${per}`).join(" + ")} = ${total}$ small blocks.`,
            `$${Array<string>(big).fill(`${per}`).join(" + ")} = ${total}$ 个小块。`,
          ],
          [
            [total, "That is the length in small blocks. Big blocks give a smaller count.", "这是用小块量的长度。用大块数出的个数更少。"],
            [total + per, "A bigger unit makes the count smaller, not bigger.", "单位越大，个数越少，不是越多。"],
            [big + 1, "That is one count too many.", "这多数了一次。"],
          ],
        );
      },
      captioned(
        cutBarFigure([1, 1, 1, 1]),
        "A shelf 4 big blocks long; each big block is 3 small blocks, 12 in all.",
        "架子长 4 个大块；每个大块是 3 个小块，一共 12 个。",
      ),
    ),
  ],
  "estimating-lengths": [
    skill(
      "the-nearer-ten",
      ["Estimating from a list of guesses", "从几个估计中选择"],
      [
        "A door is about as tall as two long steps, and a long step is about a meter. So a door is about 2 m tall.\n\nCheck: 2 cm is only two fingers wide, far too short for a door.\n\n> **Watch out.** The unit matters. 2 m and 2 cm have the same number but are very different lengths.",
        "门大约有两大步那么高，一大步大约是 1 米。所以门大约高 2 米。\n\n检验：2 厘米只有两根手指那么宽，对门来说太短了。\n\n> **注意。** 单位很重要。2 米和 2 厘米数相同，长度却差得很远。",
      ],
      (rng) => {
        const items: readonly [Pair, string, readonly string[]][] = [
          [["a door", "门"], "2 m", ["2 cm", "20 m", "200 m"]],
          [["a pencil", "铅笔"], "18 cm", ["18 m", "1 cm", "80 m"]],
          [["a car", "小汽车"], "4 m", ["4 cm", "40 cm", "40 m"]],
          [["a classroom", "教室"], "9 m", ["9 cm", "90 cm", "90 m"]],
          [["a book", "书"], "25 cm", ["25 m", "2 cm", "2 m"]],
          [["a paper clip", "回形针"], "3 cm", ["3 m", "30 cm", "30 m"]],
          [["a bus", "公共汽车"], "12 m", ["12 cm", "120 cm", "120 m"]],
          [["a spoon", "勺子"], "15 cm", ["15 m", "1 cm", "1 m"]],
        ];
        const [thing, right, others] = rng.pick(items);
        const who = rng.pick(earlyNames);
        const cm = (s: string) => {
          const [n, u] = s.split(" ");
          return Number(n) * (u === "m" ? 100 : 1);
        };
        const sense = (s: string): string =>
          cm(s) > 100
            ? `${s}, ${Math.round(cm(s) / 100)} long steps`
            : cm(s) === 100
              ? "1 m, one long step"
              : `${s}, ${cm(s)} ${cm(s) === 1 ? "finger" : "fingers"} wide`;
        const zhSense = (s: string): string =>
          cm(s) >= 100 ? `${s} 大约是 ${Math.round(cm(s) / 100)} 大步` : `${s} 大约是 ${cm(s)} 根手指宽`;
        return picked(
          rng,
          [`${who} wants a sensible estimate. About how long is ${thing[0]}?`, `${who} 想做一个合理的估计。${thing[1]}大约多长？`],
          [right, right],
          others.map(
            (o): Wrong =>
              cm(o) < cm(right)
                ? [[o, o], `That is far too short for ${thing[0]}.`, `对${thing[1]}来说太短了。`]
                : [[o, o], `That is far too long for ${thing[0]}.`, `对${thing[1]}来说太长了。`],
          ),
          [
            [
              ["Picture the units", "想一想单位"],
              ["A centimeter is about a finger's width; a meter is about a long step.", "1 厘米大约是一根手指宽；1 米大约是一大步。"],
            ],
            [
              ["Compare", "比较"],
              [
                `${(thing[0][0] ?? "").toUpperCase()}${thing[0].slice(1)} is about ${sense(right)}.`,
                `${thing[1]}大约是 ${right}，${zhSense(right)}。`,
              ],
            ],
          ],
          [`The other guesses are far too short or far too long for ${thing[0]}.`, `其他的估计对${thing[1]}来说都太短或太长。`],
        );
      },
      captioned(
        rulerFigure(2, "m", 4),
        "A door about 2 m tall, next to a ruler marked in meters.",
        "大约高 2 米的门，旁边是以米为单位的尺子。",
      ),
    ),
  ],
  "comparing-lengths-by-measuring": [
    skill(
      "the-longer-length-from-the-difference",
      ["The longer length from the difference", "由差求较长的长度"],
      [
        "Ribbon A is 14 centimeters long. Ribbon B is 9 centimeters longer, so B is $14 + 9 = 23$ centimeters.\n\nCheck: $23 - 14 = 9$, the difference.\n\n> **Watch out.** Longer means add and shorter means subtract. $14 - 9 = 5$ would make B shorter.",
        "丝带 A 长 14 厘米。丝带 B 比它长 9 厘米，所以 B 长 $14 + 9 = 23$ 厘米。\n\n检验：$23 - 14 = 9$，正是相差的长度。\n\n> **注意。** 更长要加，更短要减。$14 - 9 = 5$ 会让 B 变短。",
      ],
      (rng) => {
        const a = rng.int(9, 60);
        const d = rng.int(3, 30);
        const longer = rng.bool();
        const items: readonly Pair[] = [
          ["ribbon", "丝带"],
          ["rope", "绳子"],
          ["string", "细绳"],
          ["wire", "铁丝"],
        ];
        const it = rng.pick(items);
        const answer = longer ? a + d : a;
        const shown = longer ? a : a + d;
        return solved(
          longer
            ? [
                `A ${it[0]} is ${a} centimeters long. A second ${it[0]} is ${d} centimeters longer. How long is the second, in centimeters?`,
                `一根${it[1]}长 ${a} 厘米。第二根比它长 ${d} 厘米。第二根长多少厘米？`,
              ]
            : [
                `A ${it[0]} is ${shown} centimeters long. A second ${it[0]} is ${d} centimeters shorter. How long is the second, in centimeters?`,
                `一根${it[1]}长 ${shown} 厘米。第二根比它短 ${d} 厘米。第二根长多少厘米？`,
              ],
          answer,
          [
            [["Choose the operation", "选运算"], longer ? ["Longer means add.", "更长要加。"] : ["Shorter means subtract.", "更短要减。"]],
            [
              ["Work it out", "计算"],
              ["The second one:", "第二根："],
              [longer ? `${a} + ${d} = ${answer}` : `${shown} - ${d} = ${answer}`],
            ],
          ],
          longer
            ? [`$${answer} - ${a} = ${d}$, the difference.`, `$${answer} - ${a} = ${d}$，正是相差的长度。`]
            : [`$${answer} + ${d} = ${shown}$, the first one.`, `$${answer} + ${d} = ${shown}$，正是第一根。`],
          [
            longer
              ? [a - d, "That subtracts, but the second one is longer.", "这是相减，但第二根更长。"]
              : [shown + d, "That adds, but the second one is shorter.", "这是相加，但第二根更短。"],
            [d, "That is only the difference, not the length.", "这只是相差的长度，不是第二根的长度。"],
            [answer + 10, "That is 10 too many. Check the tens.", "多了 10，检查十位。"],
          ],
          compareBarsFigure(["A", "B"], [shown, answer], "second"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [14, 23], "gap"),
        "Ribbon A is 14 and ribbon B is 23: B is 9 longer.",
        "丝带 A 是 14，丝带 B 是 23：B 长 9。",
      ),
    ),
  ],
  "length-word-problems": [
    skill(
      "the-length-before-the-cut",
      ["The length before the cut", "剪之前的长度"],
      [
        "Sam cuts 15 centimeters off a ribbon, and 20 centimeters are left. The ribbon was both pieces together: $15 + 20 = 35$ centimeters.\n\nCheck: $35 - 15 = 20$, the piece that is left.\n\n> **Watch out.** The ribbon was longer before the cut, so add. $20 - 15 = 5$ is shorter than the piece left.",
        "Sam 从一根丝带上剪下 15 厘米，还剩 20 厘米。原来的丝带是两段合起来：$15 + 20 = 35$ 厘米。\n\n检验：$35 - 15 = 20$，正是剩下的一段。\n\n> **注意。** 剪之前丝带更长，所以要加。$20 - 15 = 5$ 比剩下的一段还短。",
      ],
      (rng) => {
        const cut = rng.int(11, 45);
        const left = rng.int(11, 54);
        const who = rng.pick(earlyNames);
        const whole = cut + left;
        return solved(
          [
            `${who} cuts ${cut} centimeters off a ribbon and ${left} centimeters are left. How long was the ribbon before the cut, in centimeters?`,
            `${who} 从一根丝带上剪下 ${cut} 厘米，还剩 ${left} 厘米。剪之前丝带长多少厘米？`,
          ],
          whole,
          [
            [
              ["See the two pieces", "看两段"],
              [`The cut piece is ${cut} and the piece left is ${left}.`, `剪下的一段是 ${cut}，剩下的一段是 ${left}。`],
            ],
            [["Put them together", "合起来"], ["Add the pieces:", "把两段相加："], [`${cut} + ${left} = ${whole}`]],
          ],
          [`$${whole} - ${cut} = ${left}$, the piece left.`, `$${whole} - ${cut} = ${left}$，正是剩下的一段。`],
          [
            [Math.abs(left - cut), "That subtracts. The ribbon was longer before the cut.", "这是相减。剪之前丝带更长。"],
            [whole + 10, "That is 10 too many. Check the tens.", "多了 10，检查十位。"],
            [whole - 10, "That is 10 too few. Check the carry into the tens.", "少了 10，检查进位。"],
          ],
          partWholeBarFigure([cut, left], -1),
        );
      },
      captioned(
        partWholeBarFigure([15, 20], -1),
        "A ribbon of 15 and 20 centimeters before the cut: 35 in all.",
        "剪之前的丝带是 15 和 20 厘米：一共 35 厘米。",
      ),
    ),
  ],
  "sums-and-differences-on-a-number-line": [
    {
      ...skill(
        "the-size-of-the-jump",
        ["The size of the jump", "跳了多远"],
        [
          "A jump starts at 23 and lands on 35. Its size is the distance between them: $35 - 23 = 12$.\n\nCheck: count on from 23. 7 more is 30, and 5 more is 35. $7 + 5 = 12$.\n\n> **Watch out.** The size of the jump is how far it goes, not where it lands. 35 is the landing point.",
          "一次跳跃从 23 开始，落在 35。跳的距离就是两点之间的距离：$35 - 23 = 12$。\n\n检验：从 23 往上数。再 7 到 30，再 5 到 35。$7 + 5 = 12$。\n\n> **注意。** 跳了多远是跳的距离，不是落在哪里。35 是落点。",
        ],
        (rng) => {
          const a = rng.int(5, 60);
          const d = rng.int(5, 39);
          const right = rng.bool();
          const [x, y] = right ? [a, a + d] : [a + d, a];
          return solved(
            [
              `On a number line, a jump starts at ${x} and lands on ${y}. How long is the jump?`,
              `数轴上，一次跳跃从 ${x} 开始，落在 ${y}。这次跳了多远？`,
            ],
            d,
            [
              [
                ["Find the two points", "找到两点"],
                [`The jump goes between ${a} and ${a + d}.`, `这次跳跃在 ${a} 和 ${a + d} 之间。`],
              ],
              [
                ["Subtract", "相减"],
                ["Larger minus smaller, whichever way it goes:", "不论方向，都用大数减小数："],
                [`${a + d} - ${a} = ${d}`],
              ],
            ],
            [`$${a} + ${d} = ${a + d}$, so a jump of ${d} joins them.`, `$${a} + ${d} = ${a + d}$，所以跳 ${d} 正好连起两点。`],
            [
              [a + a + d, "That adds the two points instead of finding the distance.", "这把两点相加了，没有求距离。"],
              [y, "That is where the jump lands, not how long it is.", "这是落点，不是跳的距离。"],
              [d + 1, "That is one too many. Count again.", "多了 1，再数一遍。"],
            ],
            hopsFigure([x, y], false, 0),
          );
        },
      ),
      figure: gradeDrawings2["sums-and-differences-on-a-number-line#the-size-of-the-jump"],
    },
  ],
  "telling-time-to-five-minutes": [
    skill(
      "five-minute-steps-later",
      ["Five-minute steps later", "再过几个五分钟"],
      [
        "The clock shows 3:20. The long hand moves on 2 numbers. Each number is 5 minutes, so that is $5 + 5 = 10$ minutes, and $20 + 10 = 30$. It is now 3:30.\n\nCheck: count by 5s from 20: 25, 30.\n\n> **Watch out.** Each number on the clock is 5 minutes, not 1. Moving on 2 numbers is 10 minutes, not 2.",
        "钟面显示 3:20。长针又走过 2 个数。每个数是 5 分钟，所以是 $5 + 5 = 10$ 分钟，$20 + 10 = 30$。现在是 3:30。\n\n检验：从 20 开始 5 个 5 个地数：25、30。\n\n> **注意。** 钟面上每个数是 5 分钟，不是 1 分钟。走过 2 个数是 10 分钟，不是 2 分钟。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const m = rng.int(1, 7) * 5;
        const steps = rng.int(1, 4);
        const add = steps * 5;
        const fives = Array.from({ length: steps }, (_, k) => m + (k + 1) * 5);
        return solved(
          [
            `A clock shows ${h}:${String(m).padStart(2, "0")}. The long hand moves on ${steps} number${steps > 1 ? "s" : ""}. How many minutes past the hour is it now?`,
            `钟面显示 ${h}:${String(m).padStart(2, "0")}。长针又走过 ${steps} 个数。现在是这个小时过了多少分钟？`,
          ],
          m + add,
          [
            [
              ["Minutes moved", "走了几分钟"],
              [
                `Each number is 5 minutes, so ${steps} ${steps === 1 ? "number is" : "numbers are"} ${add} minutes.`,
                `每个数是 5 分钟，${steps} 个数是 ${add} 分钟。`,
              ],
            ],
            [["Add", "相加"], ["Add to the minutes shown:", "加上原来的分钟："], [`${m} + ${add} = ${m + add}`]],
          ],
          [`Count by 5s from ${m}: ${fives.join(", ")}.`, `从 ${m} 开始 5 个 5 个地数：${fives.join("、")}。`],
          [
            [m + steps, "That counts each number as 1 minute. Each is 5.", "这把每个数当成 1 分钟。每个数是 5 分钟。"],
            [m + steps * 10, "That counts each number as 10 minutes. Each is 5.", "这把每个数当成 10 分钟。每个数是 5 分钟。"],
            [m, "That is the time before the hand moved.", "这是长针走之前的时间。"],
          ],
          clockFigure(h, m),
        );
      },
      captioned(
        clockFigure(3, 20),
        "A clock at 3:20; 2 numbers on, the long hand points to 6, which is 3:30.",
        "钟面是 3:20；再走 2 个数，长针指向 6，是 3:30。",
      ),
    ),
  ],
  "a-m-and-p-m": [
    skill(
      "crossing-noon-or-midnight",
      ["Crossing noon or midnight", "跨过中午或午夜"],
      [
        "It is 10:00 a.m. Count 4 hours on: 11, 12, 1, 2. The count passed 12 noon, where a.m. turns into p.m., so it will be 2:00 p.m.\n\nCheck: count back 4 hours from 2:00 p.m.: 1, 12, 11, 10. That is 10:00 a.m.\n\n> **Watch out.** When the count passes 12, change the label: a.m. becomes p.m., and p.m. becomes a.m.",
        "现在是 10:00 a.m.。往后数 4 小时：11、12、1、2。数的时候经过了中午 12 点，a.m. 在这里变成 p.m.，所以是 2:00 p.m.。\n\n检验：从 2:00 p.m. 往回数 4 小时：1、12、11、10。是 10:00 a.m.。\n\n> **注意。** 数过 12 点时，要换标记：a.m. 变成 p.m.，p.m. 变成 a.m.。",
      ],
      (rng) => {
        const am = rng.bool();
        const start = rng.int(8, 11);
        const d = rng.int(13 - start, 6);
        const end = start + d - 12;
        const tag = (x: boolean) => (x ? "a.m." : "p.m.");
        const right = `${end}:00 ${tag(!am)}`;
        const hours = Array.from({ length: d }, (_, k) => ((start + k) % 12) + 1);
        const back = Array.from({ length: d }, (_, k) => ((end - k - 2 + 24) % 12) + 1);
        const option = (s: string): Pair => [s, s];
        return picked(
          rng,
          [
            `The clock says ${start}:00 ${tag(am)} What time will it be in ${d} hours?`,
            `现在是 ${start}:00 ${tag(am)}。${d} 小时后是几点？`,
          ],
          option(right),
          [
            [
              option(`${end}:00 ${tag(am)}`),
              `The count passes 12, so the label changes to ${tag(!am)}`,
              `数过了 12 点，标记要变成 ${tag(!am)}。`,
            ],
            [option(`${end + 1}:00 ${tag(!am)}`), "That is one hour too many.", "多数了 1 小时。"],
            [option(`${start}:00 ${tag(!am)}`), `That only changes the label. Count on ${d} hours.`, `这只换了标记。要往后数 ${d} 小时。`],
          ],
          [
            [["Count the hours", "数小时"], [`Count ${d} hours on from ${start}:`, `从 ${start} 点往后数 ${d} 小时：`], [hours.join(", ")]],
            [
              ["Change the label", "换标记"],
              [`The count passed 12, so ${tag(am)} becomes ${tag(!am)}: ${right}`, `经过了 12 点，${tag(am)} 变成 ${tag(!am)}：${right}。`],
            ],
          ],
          [
            `Count back ${d} hours from ${right}: ${back.join(", ")}. That is ${start}:00 ${tag(am)}`,
            `从 ${right} 往回数 ${d} 小时：${back.join("、")}。是 ${start}:00 ${tag(am)}。`,
          ],
        );
      },
      captioned(
        clockFigure(10, 0),
        "A clock at 10:00; 4 hours on, past 12 noon, it is 2:00 p.m.",
        "钟面是 10:00；过 4 小时，经过中午 12 点，是 2:00 p.m.。",
      ),
    ),
  ],
  "counting-coins": [
    skill(
      "coins-to-reach-a-dollar",
      ["Coins to reach a dollar", "凑够一美元"],
      [
        "Two quarters, a dime and a nickel are $25 + 25 + 10 + 5 = 65$ cents. A dollar is 100 cents, so $100 - 65 = 35$ cents more are needed.\n\nCheck: count up from 65. 5 more is 70, and 30 more is 100. $5 + 30 = 35$.\n\n> **Watch out.** The question asks for what is still needed, 35, not the 65 cents already there.",
        "两个 25 美分、一个 10 美分和一个 5 美分是 $25 + 25 + 10 + 5 = 65$ 美分。一美元是 100 美分，所以还差 $100 - 65 = 35$ 美分。\n\n检验：从 65 往上数。再 5 到 70，再 30 到 100。$5 + 30 = 35$。\n\n> **注意。** 问的是还差多少（35），不是已有的 65 美分。",
      ],
      (rng) => {
        const q = rng.int(1, 2);
        const d = rng.int(1, 3);
        const n = rng.int(1, 3);
        const have = q * 25 + d * 10 + n * 5;
        const need = 100 - have;
        const who = rng.pick(earlyNames);
        const coins = [...Array<number>(q).fill(25), ...Array<number>(d).fill(10), ...Array<number>(n).fill(5)];
        return solved(
          [
            `${who} has ${q} ${q === 1 ? "quarter" : "quarters"}, ${d} ${d === 1 ? "dime" : "dimes"} and ${n} ${n === 1 ? "nickel" : "nickels"}. How many more cents does ${who} need to have one dollar?`,
            `${who} 有 ${q} 个 25 美分硬币、${d} 个 10 美分硬币和 ${n} 个 5 美分硬币。还差多少美分才够一美元？`,
          ],
          need,
          [
            [["Count the coins", "数硬币"], ["Add their values:", "把面值加起来："], [`${coins.join(" + ")} = ${have}`]],
            [["Find what is missing", "求还差多少"], ["A dollar is 100 cents:", "一美元是 100 美分："], [`100 - ${have} = ${need}`]],
          ],
          [`$${have} + ${need} = 100$, one dollar.`, `$${have} + ${need} = 100$，正好一美元。`],
          [
            [have, `That is what ${who} has, not what is still needed.`, `这是 ${who} 已有的钱，不是还差的。`],
            [need + 5, "That is 5 too many. Count the nickels again.", "多了 5，再数一遍 5 美分硬币。"],
            [need + 10, "That is 10 too many. Count the dimes again.", "多了 10，再数一遍 10 美分硬币。"],
          ],
          coinsFigure(coins),
        );
      },
      captioned(
        coinsFigure([25, 25, 10, 5]),
        "Two quarters, a dime and a nickel: 65 cents, 35 short of a dollar.",
        "两个 25 美分、一个 10 美分和一个 5 美分：65 美分，离一美元还差 35 美分。",
      ),
    ),
  ],
  "dollars-and-cents": [
    skill(
      "change-from-a-bill",
      ["Change from a bill", "找零"],
      [
        "A toy costs 7 dollars and Mia pays with a 10-dollar bill. The change is $10 - 7 = 3$ dollars.\n\nCheck: count up from 7 to 10: 8, 9, 10. That is 3 dollars.\n\n> **Watch out.** The change is what comes back, 3, not the price, 7.",
        "一个玩具 7 美元，Mia 用一张 10 美元的钞票付款。找零是 $10 - 7 = 3$ 美元。\n\n检验：从 7 往上数到 10：8、9、10。是 3 美元。\n\n> **注意。** 找零是退回来的钱（3），不是价钱（7）。",
      ],
      (rng) => {
        const bill = rng.pick([5, 10, 20, 50]);
        const price = rng.int(1, bill - 1);
        const things: readonly Pair[] = [
          ["book", "书"],
          ["ball", "球"],
          ["hat", "帽子"],
          ["toy car", "玩具车"],
          ["puzzle", "拼图"],
        ];
        const thing = rng.pick(things);
        const who = rng.pick(earlyNames);
        const change = bill - price;
        return solved(
          [
            `A ${thing[0]} costs ${price} ${price === 1 ? "dollar" : "dollars"}. ${who} pays with a ${bill}-dollar bill. How many dollars of change does ${who} get?`,
            `一个${thing[1]}${price} 美元。${who} 用一张 ${bill} 美元的钞票付款。应找回多少美元？`,
          ],
          change,
          [
            [
              ["What was paid", "付了多少"],
              [`${who} pays ${bill} dollars for a ${price}-dollar ${thing[0]}.`, `${who} 付了 ${bill} 美元，${thing[1]}是 ${price} 美元。`],
            ],
            [["Take away the price", "减去价钱"], ["The change:", "找零："], [`${bill} - ${price} = ${change}`]],
          ],
          [`$${price} + ${change} = ${bill}$, the bill.`, `$${price} + ${change} = ${bill}$，正好是钞票的面额。`],
          [
            [price, "That is the price, not the change.", "这是价钱，不是找零。"],
            [bill + price, "That adds the price. Change means take it away.", "这把价钱加上了。找零要减去价钱。"],
            [change + 1, "That is one too many. Count up again.", "多了 1，再往上数一遍。"],
          ],
        );
      },
      captioned(
        partWholeBarFigure([7, 3], 1),
        "A 10-dollar bill split into the 7-dollar price and the change.",
        "10 美元分成 7 美元的价钱和找零。",
      ),
    ),
  ],
  "line-plots-of-lengths": [
    skill(
      "marks-in-all-from-a-description",
      ["How many marks in all", "一共有多少个标记"],
      [
        "A line plot has 3 marks above 4 inches, 2 marks above 7 inches and 1 mark above 10 inches. Each mark is one pencil, so $3 + 2 + 1 = 6$ pencils were measured.\n\nCheck: count every mark on the plot one by one: 6.\n\n> **Watch out.** Add the marks, not the lengths. $4 + 7 + 10$ adds the lengths.",
        "一张线图上，4 英寸上方有 3 个点，7 英寸上方有 2 个点，10 英寸上方有 1 个点。每个点是一支铅笔，所以一共量了 $3 + 2 + 1 = 6$ 支铅笔。\n\n检验：把图上的点一个一个数：6 个。\n\n> **注意。** 要加点的个数，不是加长度。$4 + 7 + 10$ 是把长度加起来了。",
      ],
      (rng) => {
        const lens = [rng.int(2, 5), rng.int(6, 8), rng.int(9, 12)] as const;
        const marks = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)] as const;
        const answer = marks[0] + marks[1] + marks[2];
        return solved(
          [
            `A line plot of pencil lengths has ${marks[0]} ${marks[0] === 1 ? "mark" : "marks"} above ${lens[0]} inches, ${marks[1]} above ${lens[1]} inches and ${marks[2]} above ${lens[2]} inches. How many pencils were measured?`,
            `一张铅笔长度线图上，${lens[0]} 英寸上方有 ${marks[0]} 个点，${lens[1]} 英寸上方有 ${marks[1]} 个，${lens[2]} 英寸上方有 ${marks[2]} 个。一共量了多少支铅笔？`,
          ],
          answer,
          [
            [
              ["One mark, one pencil", "一个点一支铅笔"],
              [
                `The stacks have ${marks[0]}, ${marks[1]} and ${marks[2]} marks.`,
                `三摞分别有 ${marks[0]}、${marks[1]}、${marks[2]} 个点。`,
              ],
            ],
            [["Add the marks", "把点加起来"], ["All the marks:", "所有的点："], [`${marks[0]} + ${marks[1]} + ${marks[2]} = ${answer}`]],
          ],
          [
            `Add in another order: $${marks[2]} + ${marks[1]} + ${marks[0]} = ${answer}$.`,
            `换个顺序加：$${marks[2]} + ${marks[1]} + ${marks[0]} = ${answer}$。`,
          ],
          [
            [lens[0] + lens[1] + lens[2], "That adds the lengths, not the marks.", "这把长度加起来了，不是点数。"],
            [marks[0] + marks[1], "That leaves out the last stack.", "这漏了最后一摞。"],
            [Math.max(...marks), "That is only the tallest stack.", "这只是最高的一摞。"],
          ],
        );
      },
      captioned(
        {
          svg: dotPlot([4, 4, 4, 7, 7, 10], { min: 2, max: 12, step: 1 }),
          alt: t("A line plot with marks at 4, 4, 4, 7, 7 and 10.", "线图上的点在 4、4、4、7、7、10。"),
        },
        "3 marks above 4, 2 above 7 and 1 above 10: 6 pencils.",
        "4 上方 3 个点，7 上方 2 个，10 上方 1 个：6 支铅笔。",
      ),
    ),
  ],
  "picture-graphs-of-single-units": [
    {
      ...skill(
        "the-missing-row",
        ["The missing row", "缺少的一行"],
        [
          "A graph shows 15 votes in all. Row A has 5 and row B has 3, so they hold $5 + 3 = 8$. Row C has the rest: $15 - 8 = 7$.\n\nCheck: $5 + 3 + 7 = 15$, the total.\n\n> **Watch out.** Take both rows you can see away from the total, not just one.",
          "一张图一共有 15 票。A 行有 5 票，B 行有 3 票，合起来 $5 + 3 = 8$。剩下的是 C 行：$15 - 8 = 7$。\n\n检验：$5 + 3 + 7 = 15$，正是总数。\n\n> **注意。** 要从总数中去掉看得见的两行，不能只去掉一行。",
        ],
        (rng) => {
          const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
          const total = a + b + c;
          return solved(
            [
              `A picture graph shows ${total} votes in all. Row A has ${a} dots and row B has ${b}. Each dot is one vote. How many dots does row C have?`,
              `一张象形统计图一共有 ${total} 票。A 行有 ${a} 个点，B 行有 ${b} 个点。每个点代表一票。C 行有多少个点？`,
            ],
            c,
            [
              [["Add the rows you see", "把看得见的行加起来"], ["Rows A and B:", "A 行和 B 行："], [`${a} + ${b} = ${a + b}`]],
              [["Take them from the total", "从总数中去掉"], ["The rest is row C:", "剩下的是 C 行："], [`${total} - ${a + b} = ${c}`]],
            ],
            [`$${a} + ${b} + ${c} = ${total}$, the total.`, `$${a} + ${b} + ${c} = ${total}$，正是总数。`],
            [
              [a + b, "That is rows A and B, not row C.", "这是 A 行和 B 行，不是 C 行。"],
              [total, "That is the total of all the rows.", "这是所有行的总数。"],
              [total - a, "That takes away only row A. Take away row B too.", "这只去掉了 A 行。B 行也要去掉。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["picture-graphs-of-single-units#the-missing-row"],
    },
  ],
  "reading-bar-graphs": [
    skill(
      "the-bar-from-a-comparison",
      ["A bar from a comparison", "由比较求条形的值"],
      [
        "Bar A stops at 20. Bar B is 6 more, so its top is 6 higher: $20 + 6 = 26$.\n\nCheck: $26 - 20 = 6$, the difference.\n\n> **Watch out.** More means add and fewer means subtract. $20 - 6 = 14$ would make bar B shorter.",
        "条 A 到 20。条 B 比它多 6，所以顶端高 6：$20 + 6 = 26$。\n\n检验：$26 - 20 = 6$，正是相差的数。\n\n> **注意。** 多要加，少要减。$20 - 6 = 14$ 会让条 B 变矮。",
      ],
      (rng) => {
        const a = rng.int(12, 40);
        const d = rng.int(2, 11);
        const more = rng.bool();
        const answer = more ? a + d : a - d;
        return solved(
          more
            ? [
                `Bar A on a graph stops at ${a}. Bar B is ${d} more than bar A. Where does bar B stop?`,
                `统计图上条 A 到 ${a}。条 B 比条 A 多 ${d}。条 B 到几？`,
              ]
            : [
                `Bar A on a graph stops at ${a}. Bar B is ${d} fewer than bar A. Where does bar B stop?`,
                `统计图上条 A 到 ${a}。条 B 比条 A 少 ${d}。条 B 到几？`,
              ],
          answer,
          [
            [["Choose the operation", "选运算"], more ? ["More means add.", "多要加。"] : ["Fewer means subtract.", "少要减。"]],
            [["Work it out", "计算"], ["Bar B:", "条 B："], [more ? `${a} + ${d} = ${answer}` : `${a} - ${d} = ${answer}`]],
          ],
          more
            ? [`$${answer} - ${a} = ${d}$, the difference.`, `$${answer} - ${a} = ${d}$，正是相差的数。`]
            : [`$${answer} + ${d} = ${a}$, bar A.`, `$${answer} + ${d} = ${a}$，正是条 A。`],
          [
            [
              more ? a - d : a + d,
              more ? "That subtracts, but bar B is more." : "That adds, but bar B is fewer.",
              more ? "这是相减，但条 B 更多。" : "这是相加，但条 B 更少。",
            ],
            [d, "That is only the difference.", "这只是相差的数。"],
            [answer + 1, "That is one too many.", "多了 1。"],
          ],
          compareBarsFigure(["A", "B"], [a, answer], "second"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [20, 26], "gap"),
        "Bar A at 20 and bar B at 26: B is 6 more.",
        "条 A 到 20，条 B 到 26：B 多 6。",
      ),
    ),
  ],
  "naming-polygons-by-their-sides": [
    {
      ...skill(
        "sides-from-the-name",
        ["Sides from the name", "由名称说边数"],
        [
          "A hexagon has 6 sides. So 3 hexagons have $6 + 6 + 6 = 18$ sides.\n\nCheck: count by 6s three times: 6, 12, 18.\n\n> **Watch out.** Add 6 once for each shape. $3 + 6 = 9$ adds the number of shapes to the sides.",
          "六边形有 6 条边。所以 3 个六边形有 $6 + 6 + 6 = 18$ 条边。\n\n检验：6 个 6 个地数三次：6、12、18。\n\n> **注意。** 每个图形加一次 6。$3 + 6 = 9$ 是把图形个数和边数相加了。",
        ],
        (rng) => {
          const kinds: readonly [Pair, number][] = [
            [["triangles", "三角形"], 3],
            [["quadrilaterals", "四边形"], 4],
            [["pentagons", "五边形"], 5],
            [["hexagons", "六边形"], 6],
            [["octagons", "八边形"], 8],
          ];
          const [name, sides] = rng.pick(kinds);
          const k = rng.int(2, 9);
          const counts = Array.from({ length: k }, (_, j) => (j + 1) * sides);
          return solved(
            [`How many sides do ${k} ${name[0]} have in all? They do not touch.`, `${k} 个${name[1]}一共有多少条边？它们互不接触。`],
            k * sides,
            [
              [
                ["Sides of one", "一个的边数"],
                [`Each of the ${name[0]} has ${sides} sides.`, `每个${name[1]}有 ${sides} 条边。`],
              ],
              [
                ["Count on for each shape", "每个图形数一次"],
                [`Count by ${sides}s, ${k} times:`, `${sides} 个 ${sides} 个地数 ${k} 次：`],
                [counts.join(", ")],
              ],
            ],
            [
              `$${Array<string>(k).fill(`${sides}`).join(" + ")} = ${k * sides}$.`,
              `$${Array<string>(k).fill(`${sides}`).join(" + ")} = ${k * sides}$。`,
            ],
            [
              [k + sides, "That adds the number of shapes to the sides of one.", "这把图形个数和一个的边数相加了。"],
              [sides, "That is the sides of only one shape.", "这只是一个图形的边数。"],
              [k * (sides + 1), "That gives each shape one side too many.", "这给每个图形都多算了一条边。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["naming-polygons-by-their-sides#sides-from-the-name"],
    },
  ],
  "counting-sides-and-angles": [
    {
      ...skill(
        "angles-match-sides",
        ["Angles match sides", "角数和边数相同"],
        [
          "A shape has 5 angles. Each corner joins two sides, so it has 5 sides too. 3 of these shapes have $5 + 5 + 5 = 15$ sides.\n\nCheck: count by 5s: 5, 10, 15.\n\n> **Watch out.** A shape has the same number of sides as angles. Do not add one more.",
          "一个图形有 5 个角。每个角连着两条边，所以它也有 5 条边。3 个这样的图形有 $5 + 5 + 5 = 15$ 条边。\n\n检验：5 个 5 个地数：5、10、15。\n\n> **注意。** 图形的边数和角数一样多。不要多加一条。",
        ],
        (rng) => {
          const a = rng.int(3, 12);
          const k = rng.int(2, 6);
          const who = rng.pick(earlyNames);
          const counts = Array.from({ length: k }, (_, j) => (j + 1) * a);
          return solved(
            [
              `A closed shape with straight sides has ${a} angles. ${who} draws ${k} of these shapes. How many sides do they have in all?`,
              `一个由直边围成的封闭图形有 ${a} 个角。${who} 画了 ${k} 个这样的图形。它们一共有多少条边？`,
            ],
            a * k,
            [
              [
                ["Sides of one", "一个的边数"],
                [`Angles and sides come in the same number, so each has ${a} sides.`, `角和边一样多，所以每个有 ${a} 条边。`],
              ],
              [
                ["Add for each shape", "每个图形加一次"],
                [`Count by ${a}s, ${k} times:`, `${a} 个 ${a} 个地数 ${k} 次：`],
                [counts.join(", ")],
              ],
            ],
            [`$${Array<string>(k).fill(`${a}`).join(" + ")} = ${a * k}$.`, `$${Array<string>(k).fill(`${a}`).join(" + ")} = ${a * k}$。`],
            [
              [a + k, "That adds the number of shapes to the angles of one.", "这把图形个数和一个的角数相加了。"],
              [a, "That is the sides of only one shape.", "这只是一个图形的边数。"],
              [a * k + k, "That gives each shape one side more than its angles.", "这给每个图形都比角数多算了一条边。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["counting-sides-and-angles#angles-match-sides"],
    },
  ],
  "faces-of-a-cube": [
    skill(
      "faces-seen-in-a-row-of-cubes",
      ["Faces hidden in a row of cubes", "一排方块中被遮住的面"],
      [
        "3 cubes have $6 + 6 + 6 = 18$ faces. Glued in a row, they have 2 joins, and each join hides 2 faces, one from each cube. So $2 + 2 = 4$ faces are hidden, and $18 - 4 = 14$ can be seen.\n\nCheck: each end cube shows 5 faces and the middle cube shows 4: $5 + 5 + 4 = 14$.\n\n> **Watch out.** Each join hides 2 faces, not 1: one face of each cube touching there.",
        "3 个正方体有 $6 + 6 + 6 = 18$ 个面。粘成一排后有 2 处接缝，每处遮住 2 个面，两个方块各一个。所以遮住 $2 + 2 = 4$ 个面，能看到 $18 - 4 = 14$ 个。\n\n检验：两端的方块各露出 5 个面，中间的露出 4 个：$5 + 5 + 4 = 14$。\n\n> **注意。** 每处接缝遮住 2 个面，不是 1 个：挨着的两个方块各遮住一个面。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const all = 6 * k;
        const hidden = 2 * (k - 1);
        const total = all - hidden;
        const kind: Pair = rng.pick([
          ["cubes", "正方体"],
          ["wooden cubes", "木制正方体"],
          ["gift boxes shaped like cubes", "正方体礼盒"],
        ] as const);
        return solved(
          [
            `${k} ${kind[0]} are glued face to face in a straight row. How many faces can still be seen from outside, including the bottom?`,
            `${k} 个${kind[1]}面对面粘成一条直排。从外面还能看到多少个面（包括底面）？`,
          ],
          total,
          [
            [
              ["All the faces", "所有的面"],
              [`Each cube has 6 faces, so ${k} cubes have ${all}.`, `每个方块有 6 个面，${k} 个方块有 ${all} 个面。`],
            ],
            [
              ["Hidden faces", "遮住的面"],
              [`There ${k === 2 ? "is 1 join" : `are ${k - 1} joins`}, and each hides 2 faces:`, `有 ${k - 1} 处接缝，每处遮住 2 个面：`],
              [
                `${Array<string>(k - 1)
                  .fill("2")
                  .join(" + ")} = ${hidden}`,
              ],
            ],
            [["Faces that show", "露出的面"], ["Take away the hidden ones:", "去掉遮住的面："], [`${all} - ${hidden} = ${total}`]],
          ],
          k === 2
            ? ["Each of the 2 cubes shows 5 faces: $5 + 5 = 10$.", "两个方块各露出 5 个面：$5 + 5 = 10$。"]
            : [
                `The 2 end cubes show 5 faces each and the ${k - 2} middle ${k === 3 ? "cube shows" : "cubes show"} 4 each: $10 + ${4 * (k - 2)} = ${total}$.`,
                `两端的方块各露出 5 个面，中间 ${k - 2} 个方块各露出 4 个：$10 + ${4 * (k - 2)} = ${total}$。`,
              ],
          [
            [all, "That forgets the faces hidden at the joins.", "这忘了接缝处遮住的面。"],
            [all - (k - 1), "That hides only 1 face at each join. Each join hides 2.", "这每处接缝只遮住 1 个面。每处遮住 2 个。"],
            [total + 2, "That is 2 too many. Count the joins again.", "多了 2，再数一遍接缝。"],
          ],
        );
      },
      captioned(
        gridFigure(1, 3),
        "3 cubes glued in a row: 2 joins, each hiding 2 faces.",
        "3 个正方体粘成一排：2 处接缝，每处遮住 2 个面。",
      ),
    ),
  ],
  "rows-and-columns-of-squares": [
    {
      ...skill(
        "the-missing-rows-from-the-total",
        ["Rows from the total", "由总数求行数"],
        [
          "A tray has 24 pieces, with 6 in each row. Count by 6s: 6, 12, 18, 24. That takes 4 counts, so there are 4 rows.\n\nCheck: $6 + 6 + 6 + 6 = 24$.\n\n> **Watch out.** The answer is how many counts you made, 4, not the last number you said, 24.",
          "一盘有 24 块，每行 6 块。6 个 6 个地数：6、12、18、24。数了 4 次，所以有 4 行。\n\n检验：$6 + 6 + 6 + 6 = 24$。\n\n> **注意。** 答案是数了几次（4），不是最后说出的数（24）。",
        ],
        (rng) => {
          const per = rng.int(2, 5);
          const rows = rng.int(2, 5);
          const total = per * rows;
          const who = rng.pick(earlyNames);
          const counts = Array.from({ length: rows }, (_, j) => (j + 1) * per);
          return solved(
            [
              `${who} cuts a tray of brownies into ${total} equal pieces, with ${per} pieces in each row. How many rows are there?`,
              `${who} 把一盘布朗尼切成 ${total} 块相同的，每行 ${per} 块。一共有几行？`,
            ],
            rows,
            [
              [
                ["Count by a row", "按一行数"],
                [`Count by ${per}s up to ${total}:`, `${per} 个 ${per} 个地数到 ${total}：`],
                [counts.join(", ")],
              ],
              [
                ["Count the counts", "数次数"],
                [`That is ${rows} counts, so ${rows} rows.`, `数了 ${rows} 次，所以有 ${rows} 行。`],
              ],
            ],
            [
              `$${Array<string>(rows).fill(`${per}`).join(" + ")} = ${total}$.`,
              `$${Array<string>(rows).fill(`${per}`).join(" + ")} = ${total}$。`,
            ],
            [
              [total, "That is the last number counted, not the number of rows.", "这是最后数到的数，不是行数。"],
              [per, "That is the pieces in one row.", "这是一行的块数。"],
              [rows + 1, "That is one row too many.", "多了一行。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["rows-and-columns-of-squares#the-missing-rows-from-the-total"],
    },
  ],
};
