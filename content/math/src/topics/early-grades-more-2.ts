// Added topics of 2nd Grade Math: counting and place value patterns, open number lines,
// mental strategies, bar models for stories, making amounts of money, quarter hours,
// distance around a shape, making graphs and equal shares.

import type { CourseDef, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dotPlot } from "@ga/subject-math";

import {
  arrayFigure,
  barGraphFigure,
  clockFigure,
  coinsFigure,
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  labeledRectangleFigure,
  numberLineFigure,
  polygonFigure,
} from "../early-grades-kit.ts";
import {
  blockRowsFigure,
  type CutKind,
  choose,
  chooseMath,
  compareBarsFigure,
  hopsFigure,
  labeledSidesFigure,
  many,
  type Pair,
  partWholeBarFigure,
  rectangleCutsFigure,
  tableFigure,
  whole,
} from "./early-grades-more-kit.ts";

/** clockHour keeps an hour on the clock face. */
const clockHour = (hour: number) => ((hour - 1 + 12) % 12) + 1;

/** clockText writes a time as on a digital clock. */
const clockText = (hour: number, minute: number) => `${hour}:${String(minute).padStart(2, "0")}`;

/** repeatSum writes an addition of the same number the given number of times. */
const repeatSum = (n: number, times: number) => Array<number>(times).fill(n).join(" + ");

const countingWithin1000 = earlyTopic(
  "counting-within-1000",
  ["Counting Within 1000", "1000 以内的数数"],
  [
    "Count by ones, fives, tens and hundreds from any number, including across a hundred.",
    "从任意一个数开始，一个一个、五个五个、十个十个、一百一百地数，包括跨过整百。",
  ],
  ["place-value-up-to-1000"],
  ["2.NBT.A.2"],
  [
    earlyPoint(
      "counting-across-a-hundred",
      ["Counting across a hundred", "跨过整百数数"],
      [
        "Counting by ones is easy until you reach a hundred. After 199 comes 200, because the ones and tens are both full, so a new hundred begins and they go back to zero. Counting back, the number before 300 is 299. Say the numbers aloud slowly, and look carefully at each digit.",
        "一个一个地数，到整百时要小心。199 后面是 200，因为个位和十位都满了，所以要进到新的一百，个位和十位都变回 0。往回数时，300 前面是 299。慢慢地读出来，仔细看每一位数字。",
      ],
      (rng) => {
        const up = rng.bool();
        const h = 100 * rng.int(2, 9);
        const shift = rng.int(0, 2);
        const d = up ? 1 : -1;
        const start = up ? h - 2 + shift : h + 2 - shift;
        const shown = [0, 1, 2].map((i) => start + i * d);
        const answer = start + 3 * d;
        return whole(
          [`What number comes next? $${shown.join(",\\ ")},\\ \\square$`, `方框里填几？$${shown.join(",\\ ")},\\ \\square$`],
          answer,
          [answer + 10 * d, answer + 100 * d, answer - d],
          [
            `Each number is 1 ${up ? "more" : "less"} than the one before it, so the next number is ${answer}.`,
            `每个数都比前一个数${up ? "多" : "少"} 1，所以下一个数是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "skip-counting-from-any-number",
      ["Skip counting from any number", "从任意一个数开始跳着数"],
      [
        "You can skip count from any number, not only from round ones. To count by tens from 274, change only the tens digit: 284, 294, and then the tens go past nine to reach 304. Counting by hundreds changes the hundreds digit. Counting by fives makes the ones digit switch between 5 and 0.",
        "不只从整数，从任意一个数都可以跳着数。从 274 开始十个十个地数，只改变十位：284、294，十位满了再往前进，就到 304。一百一百地数，改变的是百位。五个五个地数，个位在 5 和 0 之间交替。",
      ],
      (rng) => {
        const step = rng.pick([5, 10, 100]);
        const start = step === 5 ? 5 * rng.int(20, 180) : step === 10 ? rng.int(101, 680) : rng.int(101, 590);
        const shown = [0, 1, 2].map((i) => start + i * step);
        const answer = start + 3 * step;
        return whole(
          [`What number comes next? $${shown.join(",\\ ")},\\ \\square$`, `方框里填几？$${shown.join(",\\ ")},\\ \\square$`],
          answer,
          [answer + step, answer - 1, answer + 1, step === 100 ? answer + 10 : answer + 100],
          [
            `The numbers go up by ${step} each time, and $${shown[2]} + ${step} = ${answer}$.`,
            `每次都多 ${step}，$${shown[2]} + ${step} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "what-is-being-counted-by",
      ["How the list is counting", "这列数是怎样数的"],
      [
        "To find out how a list is counting, subtract one number from the next. If the gap is the same each time, that gap is the step. Do not look only at the last digit. In 340, 350, 360, the ones stay at zero and the tens change, so the list is counting by tens.",
        "要知道一列数是怎样数的，就用后一个数减前一个数。如果每次相差的数都一样，这个差就是每次数的大小。不要只看最后一位。在 340、350、360 中，个位不变，十位在变，所以是十个十个地数。",
      ],
      (rng) => {
        const steps: readonly { n: number; say: Pair }[] = [
          { n: 1, say: ["By ones", "一个一个地数"] },
          { n: 5, say: ["By fives", "五个五个地数"] },
          { n: 10, say: ["By tens", "十个十个地数"] },
          { n: 100, say: ["By hundreds", "一百一百地数"] },
        ];
        const at = rng.int(0, 3);
        const step = steps[at] as (typeof steps)[number];
        const start = step.n === 5 ? 5 * rng.int(20, 150) : rng.int(101, 590);
        const list = [0, 1, 2, 3].map((i) => start + i * step.n).join(",\\ ");
        return choose(
          rng,
          [`How is this list counting? $${list}$`, `这列数是怎样数的？$${list}$`],
          step.say,
          steps.filter((_, i) => i !== at).map((s) => s.say),
          [`Each number is ${step.n} more than the one before it.`, `每个数都比前一个数多 ${step.n}。`],
        );
      },
    ),
  ],
);

const zeroAsAPlaceHolder = earlyTopic(
  "zero-as-a-place-holder",
  ["Zero as a Place Holder", "数中间和末尾的 0"],
  [
    "Read and write numbers with a zero in the tens or ones place, and tell what that zero means.",
    "读写十位或个位上有 0 的数，并说出这个 0 的意思。",
  ],
  ["expanded-form-up-to-1000"],
  ["2.NBT.A.3"],
  [
    earlyPoint(
      "writing-a-number-with-no-tens",
      ["Writing a number with no tens", "写十位是 0 的数"],
      [
        "When a number has no tens, you still have to save a place for them. So 5 hundreds and 3 ones is 503, with a zero in the middle. If you leave the zero out, you write 53, which is a much smaller number. The zero holds the other digits in their proper places.",
        "一个数没有十时，也要给十位留出位置。所以 5 个百和 3 个一写作 503，中间有一个 0。如果漏了这个 0，写成 53，这个数就小得多了。0 让其他数字都待在该待的位置上。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const o = rng.int(1, 9);
        const n = 100 * h + o;
        return whole(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          n,
          [10 * h + o, 100 * h + 10 * o, h + o],
          [
            `There are ${many(h, "hundred")}, no tens and ${many(o, "one")}, so the number is ${n}.`,
            `有 ${h} 个百，没有十，有 ${o} 个一，所以这个数是 ${n}。`,
          ],
          blockRowsFigure([[h, 0, o]]),
        );
      },
    ),
    earlyPoint(
      "what-the-zero-tells-you",
      ["What the zero tells you", "0 表示什么"],
      [
        "A zero in a number tells you that a place is empty. In 307, the zero is in the tens place, so there are no tens. In 370, the zero is in the ones place, so there are no ones. A zero does not mean that the whole number is zero, and it never comes first in a number.",
        "数里的 0 表示这一位是空的。在 307 中，0 在十位上，说明没有十。在 370 中，0 在个位上，说明没有一。0 并不表示整个数是零，而且不写在一个数的最前面。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const d = rng.int(1, 9);
        const inTens = rng.bool();
        const n = inTens ? 100 * h + d : 100 * h + 10 * d;
        const noTens: Pair = ["There are no tens", "没有十"];
        const noOnes: Pair = ["There are no ones", "没有一"];
        const noHundreds: Pair = ["There are no hundreds", "没有百"];
        const nothing: Pair = ["The number is worth nothing", "这个数是零"];
        return choose(
          rng,
          [`What does the 0 in ${n} tell you?`, `${n} 中的 0 表示什么？`],
          inTens ? noTens : noOnes,
          [inTens ? noOnes : noTens, noHundreds, nothing],
          [`The 0 is in the ${inTens ? "tens" : "ones"} place of ${n}.`, `0 在 ${n} 的${inTens ? "十位" : "个位"}上。`],
        );
      },
    ),
    earlyPoint(
      "expanded-form-with-a-zero",
      ["Expanded form with a zero", "有 0 的数的展开式"],
      [
        "Expanded form shows what each digit is worth. In the expanded form of a number with a zero, you can leave that place out. So 406 is $400 + 6$, and 730 is $700 + 30$. Be careful with the size of each part, because the 6 in 406 is 6 ones, while the 3 in 730 is 3 tens.",
        "展开式表示每一位数字代表多少。有 0 的数写成展开式时，可以不写 0 这一位。所以 406 是 $400 + 6$，730 是 $700 + 30$。要注意每部分的大小：406 中的 6 是 6 个一，而 730 中的 3 是 3 个十。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const d = rng.int(1, 9);
        const inTens = rng.bool();
        const part = inTens ? d : 10 * d;
        const n = 100 * h + part;
        return rng.bool()
          ? whole(
              [`What number goes in the box? $${100 * h} + ${part} = \\square$`, `方框里填几？$${100 * h} + ${part} = \\square$`],
              n,
              [Number(`${h}${part}`), inTens ? 100 * h + 10 * d : 100 * h + d, 100 * h],
              [`${100 * h} and ${part} together make ${n}.`, `${100 * h} 和 ${part} 合起来是 ${n}。`],
            )
          : whole(
              [`What number goes in the box? $${n} = ${100 * h} + \\square$`, `方框里填几？$${n} = ${100 * h} + \\square$`],
              part,
              [inTens ? 10 * d : d, n, 100 * d],
              [`Taking ${100 * h} from ${n} leaves ${part}.`, `${n} 去掉 ${100 * h}，还剩 ${part}。`],
            );
      },
    ),
  ],
);

const tradingPlaces = earlyTopic(
  "trading-among-hundreds-tens-and-ones",
  ["Trading Among Hundreds, Tens and Ones", "百、十、一之间的换算"],
  [
    "Trade ten tens for a hundred and a hundred for ten tens, and read numbers with extra tens.",
    "用十个十换一个百，用一个百换十个十，并读出十特别多的数。",
  ],
  ["place-value-up-to-1000"],
  ["2.NBT.A.1"],
  [
    earlyPoint(
      "many-tens-make-hundreds",
      ["Many tens make hundreds", "很多个十合成百"],
      [
        "Ten tens make one hundred. So when there are more than ten rods, bundle ten of them into a flat. With 13 tens, ten rods become 1 hundred and 3 rods remain, so the number is 130. Another way is to multiply in your head by counting by tens: 10, 20, 30, and so on, up to 130.",
        "十个十是一百。所以长条超过十根时，就把其中十根捆成一块大方块。13 个十中，十根长条换成 1 个百，还剩 3 根，所以这个数是 130。也可以十个十个地数：10、20、30……一直数到 130。",
      ],
      (rng) => {
        const tens = rng.int(11, 39);
        return whole(
          [`What number is ${many(tens, "ten")}?`, `${tens} 个十是多少？`],
          10 * tens,
          [tens, 100 + tens, 100 * tens],
          [
            `${many(Math.floor(tens / 10), "hundred")} and ${many(tens % 10, "ten")} make ${10 * tens}.`,
            `${Math.floor(tens / 10)} 个百和 ${tens % 10} 个十，合起来是 ${10 * tens}。`,
          ],
          tens < 20 ? blockRowsFigure([[0, tens, 0]]) : undefined,
        );
      },
    ),
    earlyPoint(
      "hundreds-as-tens",
      ["Hundreds as tens", "把百看成十"],
      [
        "Each hundred can be opened into ten tens. So 4 hundreds are the same as 40 tens, and 7 hundreds are the same as 70 tens. Knowing this helps you to subtract when a number has no tens. If a number has both hundreds and tens, count the tens inside the hundreds as well as the extra tens.",
        "每个百都可以拆成十个十。所以 4 个百就是 40 个十，7 个百就是 70 个十。知道了这一点，一个数没有十时，也能方便地做减法。如果一个数既有百又有十，就要把百里面的十和多出来的十合起来数。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const extra = rng.bool() ? rng.int(1, 9) : 0;
        const n = 100 * h + 10 * extra;
        return whole(
          [`How many tens are in ${n} altogether?`, `${n} 一共有多少个十？`],
          10 * h + extra,
          [h, extra === 0 ? 100 * h : extra, n],
          [
            `Each hundred is 10 tens, so ${many(h, "hundred")} ${h === 1 ? "is" : "are"} ${many(10 * h, "ten")}${extra ? `, and ${extra} more tens make ${10 * h + extra}` : ""}.`,
            `每个百是 10 个十，所以 ${h} 个百是 ${10 * h} 个十${extra ? `，再加 ${extra} 个十，是 ${10 * h + extra} 个十` : ""}。`,
          ],
          blockRowsFigure([[h, extra, 0]]),
        );
      },
    ),
    earlyPoint(
      "tidying-up-extra-tens",
      ["Tidying up extra tens", "把多出来的十整理好"],
      [
        "Sometimes a number is shown with too many tens, such as 2 hundreds, 14 tens and 3 ones. Trade ten of the tens for one more hundred, which gives 3 hundreds, 4 tens and 3 ones, or 343. Do not simply write the three counts in a row. That gives a number that is far too large.",
        "有时一个数的十特别多，比如 2 个百、14 个十和 3 个一。用其中十个十换一个百，就得到 3 个百、4 个十和 3 个一，也就是 343。不要把三个数直接并排写出来，那样得到的数就太大了。",
      ],
      (rng) => {
        const h = rng.int(1, 7);
        const tens = rng.int(11, 19);
        const o = rng.int(1, 9);
        const n = 100 * h + 10 * tens + o;
        return whole(
          [
            `What number has ${many(h, "hundred")}, ${many(tens, "ten")} and ${many(o, "one")}?`,
            `${h} 个百、${tens} 个十和 ${o} 个一是多少？`,
          ],
          n,
          [Number(`${h}${tens}${o}`), 100 * h + 10 * (tens - 10) + o, h + tens + o],
          [
            `Ten of the tens make one more hundred, so there are ${many(h + 1, "hundred")}, ${many(tens - 10, "ten")} and ${many(o, "one")}: ${n}.`,
            `十个十换一个百，所以有 ${h + 1} 个百、${tens - 10} 个十和 ${o} 个一，也就是 ${n}。`,
          ],
          blockRowsFigure([[h, tens, o]]),
        );
      },
    ),
  ],
);

const numberLinesTo1000 = earlyTopic(
  "number-lines-to-1000",
  ["Number Lines to 1000", "1000 以内的数轴"],
  ["Read points on number lines marked by hundreds, tens, fives and ones.", "读出数轴上按百、十、五和一标记的点。"],
  ["place-value-up-to-1000"],
  ["2.NBT.A.2", "2.MD.B.6"],
  [
    earlyPoint(
      "lines-marked-by-hundreds",
      ["Lines marked by hundreds", "每格是一百的数轴"],
      [
        "A line up to 1000 has no room for every number, so its marks are spaced apart. Here each space is worth 100. Start at the labeled end, and count by hundreds until you reach the dot. Counting spaces as ones is a common mistake, and it gives an answer that is much too small.",
        "到 1000 的数轴没有地方写下所有的数，所以刻度隔得比较开。这里每格是 100。从标了数的一端开始，一百一百地数到这个点。常见的错误是把每格当成 1，那样答案就太小了。",
      ],
      (rng) => {
        const lo = 100 * rng.int(0, 3);
        const hi = lo + 100 * rng.int(5, 7);
        const k = rng.int(1, (hi - lo) / 100 - 1);
        const mark = lo + 100 * k;
        return whole(
          ["Each space is worth 100. What number does the dot show?", "每格是 100。这个点表示什么数？"],
          mark,
          [lo + k, lo + 10 * k, mark + 100],
          [
            `The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}, and counting by hundreds reaches ${mark}.`,
            `这个点在 ${lo} 后面第 ${k} 格，一百一百地数，数到 ${mark}。`,
          ],
          numberLineFigure(lo, hi, 100, mark, false),
        );
      },
    ),
    earlyPoint(
      "lines-marked-by-tens",
      ["Lines marked by tens", "每格是十的数轴"],
      [
        "When the two ends of a line are next-door hundreds, such as 300 and 400, the ten spaces between them are worth 10 each. So the marks go 310, 320, 330, and so on. Count by tens from the left end, or back from the right end if the dot is nearer to that end.",
        "如果数轴的两端是相邻的整百数，比如 300 和 400，它们之间的十格每格就是 10。所以刻度是 310、320、330 等。从左端开始十个十个地数；如果点离右端更近，也可以从右端往回数。",
      ],
      (rng) => {
        const lo = 100 * rng.int(0, 9);
        const k = rng.int(1, 9);
        const mark = lo + 10 * k;
        return whole(
          ["What number does the dot show?", "这个点表示什么数？"],
          mark,
          [lo + k, lo + 100 - 10 * k, mark + 100],
          [
            `There are 10 spaces between ${lo} and ${lo + 100}, so each is worth 10. The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}, which is ${mark}.`,
            `${lo} 和 ${lo + 100} 之间有 10 格，所以每格是 10。这个点在 ${lo} 后面第 ${k} 格，表示 ${mark}。`,
          ],
          numberLineFigure(lo, lo + 100, 10, mark, false),
        );
      },
    ),
    earlyPoint(
      "finding-what-a-space-is-worth",
      ["Finding what a space is worth", "先看每格是多少"],
      [
        "Before you read a dot, work out what one space is worth. Find the difference between the two labeled numbers, and share it among the spaces. If the ends are 10 apart with ten spaces, each one is worth 1. If they are 50 apart with ten spaces, each one is worth 5. Now count along by that amount.",
        "读点之前，先算出每格是多少。求出两个标了数的刻度相差多少，再分给这些格子。如果两端差 10，有十格，每格就是 1。如果两端差 50，有十格，每格就是 5。然后按这个数一格一格地数。",
      ],
      (rng) => {
        const step = rng.pick([1, 5]);
        const lo = 50 * rng.int(0, 18);
        const k = rng.int(1, 9);
        const mark = lo + step * k;
        return whole(
          ["What number does the dot show?", "这个点表示什么数？"],
          mark,
          [lo + (step === 1 ? 5 * k : k), lo + 10 * k, mark + step],
          [
            `The ends are ${10 * step} apart with 10 spaces, so each space is worth ${step}. The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}, which is ${mark}.`,
            `两端相差 ${10 * step}，有 10 格，所以每格是 ${step}。这个点在 ${lo} 后面第 ${k} 格，表示 ${mark}。`,
          ],
          numberLineFigure(lo, lo + 10 * step, step, mark, false),
        );
      },
    ),
  ],
);

const orderingThreeDigits = earlyTopic(
  "ordering-three-digit-numbers",
  ["Ordering Three-Digit Numbers", "三位数的排序"],
  [
    "Put three-digit numbers in order, and build the greatest and least numbers from given digits.",
    "给三位数排序，并用给定的数字组成最大和最小的数。",
  ],
  ["comparing-numbers-up-to-1000"],
  ["2.NBT.A.4"],
  [
    earlyPoint(
      "from-least-to-greatest",
      ["From least to greatest", "从小到大"],
      [
        "To order three-digit numbers, compare the hundreds first. If those are the same, look at the tens. Only if the tens are the same as well do you need to look at the ones. Numbers made from the same digits can be far apart, such as 254 and 524, so read every number with care.",
        "给三位数排序，先比百位。百位相同，再比十位。十位也相同，才需要比个位。用相同数字组成的数可能差得很远，比如 254 和 524，所以每个数都要仔细读。",
      ],
      (rng) => {
        const [x, y, z] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
        const all = [100 * x + 10 * y + z, 100 * y + 10 * x + z, 100 * x + 10 * z + y];
        const [p, q, r] = [...all].sort((a, b) => a - b) as [number, number, number];
        const greatestFirst = rng.bool();
        const correct = greatestFirst ? `${r},\\ ${q},\\ ${p}` : `${p},\\ ${q},\\ ${r}`;
        const others = greatestFirst
          ? [`${p},\\ ${q},\\ ${r}`, `${q},\\ ${r},\\ ${p}`, `${r},\\ ${p},\\ ${q}`, `${q},\\ ${p},\\ ${r}`]
          : [`${r},\\ ${q},\\ ${p}`, `${q},\\ ${p},\\ ${r}`, `${p},\\ ${r},\\ ${q}`, `${q},\\ ${r},\\ ${p}`];
        return chooseMath(
          rng,
          greatestFirst
            ? ["Which list goes from greatest to least?", "哪一组是从大到小排列的？"]
            : ["Which list goes from least to greatest?", "哪一组是从小到大排列的？"],
          correct,
          rng.shuffle(others),
          [`${p} is the least and ${r} is the greatest, with ${q} between them.`, `${p} 最小，${r} 最大，${q} 在它们中间。`],
        );
      },
    ),
    earlyPoint(
      "building-the-greatest-number",
      ["Building the greatest and least numbers", "组成最大和最小的数"],
      [
        "The hundreds place is worth the most, so it decides how large a number is. To build the greatest number from some digits, put the largest digit in the hundreds place, the next largest in the tens place, and the smallest in the ones place. To build the least number, do it the other way around.",
        "百位最重要，它决定这个数有多大。要用几个数字组成最大的数，就把最大的数字放在百位，第二大的放在十位，最小的放在个位。要组成最小的数，就反过来放。",
      ],
      (rng) => {
        const digits = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        const [a, b, c] = [...digits].sort((x, y) => y - x) as [number, number, number];
        const big = rng.bool();
        const answer = big ? 100 * a + 10 * b + c : 100 * c + 10 * b + a;
        return whole(
          big
            ? [
                `Use each of the digits ${digits.join(", ")} once. What is the greatest number you can make?`,
                `${digits.join("、")} 这三个数字各用一次。能组成的最大的数是多少？`,
              ]
            : [
                `Use each of the digits ${digits.join(", ")} once. What is the least number you can make?`,
                `${digits.join("、")} 这三个数字各用一次。能组成的最小的数是多少？`,
              ],
          answer,
          big
            ? [100 * c + 10 * b + a, 100 * a + 10 * c + b, 100 * b + 10 * a + c]
            : [100 * a + 10 * b + c, 100 * c + 10 * a + b, 100 * b + 10 * c + a],
          [
            `Put the ${big ? "largest" : "smallest"} digit in the hundreds place, the middle digit in the tens place, and the last in the ones place: ${answer}.`,
            `把${big ? "最大" : "最小"}的数字放在百位，中间的放在十位，剩下的放在个位：${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "comparing-rows-with-hundreds",
      ["Comparing rows with hundreds", "比较有百的两排积木"],
      [
        "With blocks that include hundreds, look at the large flats first. The row with more flats is greater, even if the other row has more rods or more small squares. If the flats are the same, compare the rods. If those are the same too, compare the small squares. Then you know which is greater.",
        "积木里有百时，先看大方块。大方块多的那一排更大，即使另一排的长条或小方块更多。大方块一样多，就比长条。长条也一样多，再比小方块。这样就知道哪一排大了。",
      ],
      (rng) => {
        const h1 = rng.int(1, 5);
        const sameH = rng.bool(0.3);
        const h2 = sameH ? h1 : rng.pick([1, 2, 3, 4, 5].filter((v) => v !== h1));
        const t1 = rng.int(0, 9);
        const t2 = sameH ? rng.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== t1)) : rng.int(0, 9);
        const o1 = rng.int(0, 9);
        const o2 = rng.int(0, 9);
        const a = 100 * h1 + 10 * t1 + o1;
        const b = 100 * h2 + 10 * t2 + o2;
        const top: Pair = ["The top row", "上面一排"];
        const bottom: Pair = ["The bottom row", "下面一排"];
        const both: Pair = ["They show the same number", "两排表示的数一样大"];
        return choose(
          rng,
          ["Which row of blocks shows the greater number?", "哪一排积木表示的数更大？"],
          a > b ? top : bottom,
          [a > b ? bottom : top, both],
          [`The top row shows ${a} and the bottom row shows ${b}.`, `上面一排表示 ${a}，下面一排表示 ${b}。`],
          blockRowsFigure([
            [h1, t1, o1],
            [h2, t2, o2],
          ]),
        );
      },
    ),
  ],
);

const evenAndOddSums = earlyTopic(
  "even-numbers-as-doubles",
  ["Even Numbers as Doubles", "偶数是两个相同的数相加"],
  [
    "Pair up objects to see even and odd, and write an even number as a sum of two equal numbers.",
    "两个两个地配对来判断奇偶，并把偶数写成两个相同的数相加。",
  ],
  ["even-and-odd-numbers"],
  ["2.OA.C.3"],
  [
    earlyPoint(
      "pairing-up-counters",
      ["Pairing up counters", "两个两个地配对"],
      [
        "To test whether a group is even or odd, pair up the objects two by two. If every object has a partner, the group is even, and none are left over. If one object has no partner, the group is odd. You can never have more than one left over, as two left over would make another pair.",
        "要判断一组东西是偶数还是奇数，就两个两个地配对。如果每个都有伙伴，一个也不剩，就是偶数。如果有一个没有伙伴，就是奇数。不可能剩下两个，因为两个又能配成一对。",
      ],
      (rng) => {
        const n = rng.int(5, 21);
        if (rng.bool())
          return whole(
            ["The counters are placed in pairs. How many full pairs are there?", "这些圆片两个两个地配对。可以配成多少对？"],
            Math.floor(n / 2),
            [n, n - 2, Math.floor(n / 2) + 1],
            [
              `Each full pair uses 2 counters, and ${n} counters make ${Math.floor(n / 2)} full pairs.`,
              `每对用 2 个圆片，${n} 个圆片可以配成 ${Math.floor(n / 2)} 对。`,
            ],
            countersFigure(n, 2),
          );
        return whole(
          ["The counters are placed in pairs. How many have no partner?", "这些圆片两个两个地配对。有多少个没有伙伴？"],
          n % 2,
          [n % 2 === 0 ? 1 : 0, 2, n],
          n % 2 === 0
            ? [`${n} is even, so every counter has a partner, and 0 are left over.`, `${n} 是偶数，每个圆片都有伙伴，剩下 0 个。`]
            : [`${n} is odd, so after pairing, 1 counter is left over.`, `${n} 是奇数，配对后剩下 1 个。`],
          countersFigure(n, 2),
        );
      },
    ),
    earlyPoint(
      "sharing-an-even-number-into-two",
      ["Sharing an even number into two", "把偶数平均分成两份"],
      [
        "An even number can always be split into two equal parts. To find the two parts of 14, think about which number added to itself gives 14. The answer is 7, since $7 + 7 = 14$. For larger numbers, split the tens and ones first. Half of 40 is 20, and half of 6 is 3, so half of 46 is 23.",
        "偶数总能分成两个相同的数。要把 14 分成这样的两份，就想：哪个数加上它自己等于 14？答案是 7，因为 $7 + 7 = 14$。大一点的数，可以先把十和一分开。40 的一半是 20，6 的一半是 3，所以 46 的一半是 23。",
      ],
      (rng) => {
        const half = rng.int(3, 48);
        const n = 2 * half;
        return whole(
          [
            `The same number goes in both boxes. What is it? $${n} = \\square + \\square$`,
            `两个方框里填相同的数。填几？$${n} = \\square + \\square$`,
          ],
          half,
          [n, 2 * n, half + 1],
          [`$${half} + ${half} = ${n}$, so the number is ${half}.`, `$${half} + ${half} = ${n}$，所以填 ${half}。`],
        );
      },
    ),
    earlyPoint(
      "the-equal-pair-for-an-even-number",
      ["The equal pair for an even number", "找出相同的两个加数"],
      [
        "A sum of two equal numbers shows that a number is even. So $9 + 9$ shows that 18 is even. A sum such as $8 + 10$ also makes 18, but its two addends are different, so it does not show this. Check that the two numbers match, and that they add up to the number you want.",
        "两个相同的数相加，能说明这个和是偶数。所以 $9 + 9$ 说明 18 是偶数。$8 + 10$ 的和也是 18，但两个加数不同，所以不能这样说明。要检查两个加数是否相同，还要检查它们的和对不对。",
      ],
      (rng) => {
        const half = rng.int(3, 30);
        const n = 2 * half;
        return chooseMath(
          rng,
          [`Which sum uses two equal numbers to make ${n}?`, `哪个算式用两个相同的数得到 ${n}？`],
          `${half} + ${half}`,
          rng.shuffle([`${half - 1} + ${half + 1}`, `${half + 1} + ${half + 1}`, `${half - 1} + ${half - 1}`, `${n} + ${n}`]),
          [`${half} and ${half} are equal, and they add up to ${n}.`, `两个加数都是 ${half}，和是 ${n}。`],
        );
      },
    ),
  ],
);

const arraysByRowsAndColumns = earlyTopic(
  "arrays-by-rows-and-by-columns",
  ["Arrays by Rows and by Columns", "按行和按列看阵列"],
  [
    "Write an addition for an array by its rows or by its columns, and see that the totals match.",
    "按行或按列写出阵列的加法算式，看出总数相同。",
  ],
  ["arrays-and-repeated-addition"],
  ["2.OA.C.4"],
  [
    earlyPoint(
      "adding-the-rows",
      ["Adding the rows", "按行相加"],
      [
        "Rows go across, like the lines of words on a page. To add the rows of an array, count how many are in one row, and add that number once for each row. So 3 rows of 5 gives $5 + 5 + 5$. Be careful, as adding the rows is different from adding the columns, even though they give the same total.",
        "行是横着的，就像书上的一行字。按行相加时，先数一行有几个，有几行就加几次。所以 3 行、每行 5 个，就是 $5 + 5 + 5$。要注意，按行加和按列加的算式不一样，虽然总数相同。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const cols = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        return chooseMath(
          rng,
          ["Which addition adds the rows of this array?", "哪个加法是按行相加的？"],
          repeatSum(cols, rows),
          rng.shuffle([repeatSum(rows, cols), `${rows} + ${cols}`, repeatSum(cols, rows + 1), repeatSum(cols + 1, rows)]),
          [`There are ${rows} rows with ${cols} in each row.`, `有 ${rows} 行，每行 ${cols} 个。`],
          arrayFigure(rows, cols),
        );
      },
    ),
    earlyPoint(
      "adding-the-columns",
      ["Adding the columns", "按列相加"],
      [
        "Columns go up and down, like the columns of a building. To add the columns of an array, count how many are in one column, and add that number once for each column. So 3 rows of 5 also has 5 columns of 3, which gives $3 + 3 + 3 + 3 + 3$. It is the same array seen another way.",
        "列是竖着的，就像房子的柱子。按列相加时，先数一列有几个，有几列就加几次。所以 3 行、每行 5 个，也是 5 列、每列 3 个，就是 $3 + 3 + 3 + 3 + 3$。这是换个角度看同一个阵列。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const cols = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        return chooseMath(
          rng,
          ["Which addition adds the columns of this array?", "哪个加法是按列相加的？"],
          repeatSum(rows, cols),
          rng.shuffle([repeatSum(cols, rows), `${rows} + ${cols}`, repeatSum(rows, cols + 1), repeatSum(rows + 1, cols)]),
          [`There are ${cols} columns with ${rows} in each column.`, `有 ${cols} 列，每列 ${rows} 个。`],
          arrayFigure(rows, cols),
        );
      },
    ),
    earlyPoint(
      "the-total-of-an-array",
      ["The total of an array", "阵列的总数"],
      [
        "You can find the total of an array by skip counting along its rows or along its columns. Both ways reach the same number, so choose whichever is easier. An array with 2 columns can be counted by twos, and one with 5 in each row can be counted by fives. Adding the rows to the columns does not give the total.",
        "求阵列的总数，可以按行跳着数，也可以按列跳着数。两种方法得到的数一样，选容易的那种就行。有 2 列的阵列可以两个两个地数，每行 5 个的可以五个五个地数。把行数和列数相加，得不到总数。",
      ],
      (rng) => {
        const rows = rng.int(2, 5);
        const cols = rng.int(2, 6);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} lays out ${thing.en} in this array. How many ${thing.en} are there in all?`,
            `${name} 把${thing.zh}摆成这样的阵列。一共有多少${thing.unit}${thing.zh}？`,
          ],
          rows * cols,
          [rows + cols, rows * cols + cols, rows * cols - rows],
          [
            `${rows} rows of ${cols} make $${repeatSum(cols, rows)} = ${rows * cols}$.`,
            `${rows} 行、每行 ${cols} ${thing.unit}，$${repeatSum(cols, rows)} = ${rows * cols}$。`,
          ],
          arrayFigure(rows, cols),
        );
      },
    ),
  ],
);

const addingOnALine = earlyTopic(
  "adding-on-an-open-number-line",
  ["Adding on an Open Number Line", "在空白数轴上做加法"],
  ["Add by making jumps of tens and ones on a number line drawn by hand.", "在自己画的数轴上，用跳十和跳一的方法做加法。"],
  ["adding-within-100"],
  ["2.NBT.B.5"],
  [
    earlyPoint(
      "jumping-by-tens-then-ones",
      ["Jumping by tens and then ones", "先跳十，再跳一"],
      [
        "An open number line has no marks except the ones you draw. Start at the first number. Make one big jump for the tens of the second number, and one small jump for its ones. For example, to add 25 to 47, jump 20 to reach 67, and then jump 5 more to reach 72.",
        "空白数轴上没有刻度，只有你自己画的点。从第一个数开始，先跳一大步，跳第二个数的十，再跳一小步，跳它的一。比如 47 加 25，先跳 20 到 67，再跳 5 到 72。",
      ],
      (rng) => {
        const a = rng.int(12, 60);
        const tens = rng.int(1, 3);
        const ones = rng.int(1, 9);
        const b = 10 * tens + ones;
        return whole(
          [`The jumps show $${a} + ${b}$. Where do they end?`, `图中的跳跃表示 $${a} + ${b}$。最后跳到哪个数？`],
          a + b,
          [a + 10 * tens, a + ones, a + b + 10],
          [
            `$${a} + ${10 * tens} = ${a + 10 * tens}$, and $${a + 10 * tens} + ${ones} = ${a + b}$.`,
            `$${a} + ${10 * tens} = ${a + 10 * tens}$，$${a + 10 * tens} + ${ones} = ${a + b}$。`,
          ],
          hopsFigure([a, a + 10 * tens, a + b], true),
        );
      },
    ),
    earlyPoint(
      "the-missing-jump",
      ["The missing jump", "缺少的一跳"],
      [
        "If you know where a jump starts and where it lands, you can find its size by subtracting. A jump from 47 to 67 is a jump of 20, because $67 - 47 = 20$. A jump over tens and ones will always look bigger on the line. Look at the numbers, and not only at the size of the arc.",
        "知道一跳从哪里开始、落到哪里，就能用减法求出这一跳有多大。从 47 跳到 67 是跳了 20，因为 $67 - 47 = 20$。跳十的那一步在图上总是更长。但还是要看数，不能只看弧线有多大。",
      ],
      (rng) => {
        const a = rng.int(12, 60);
        const tens = rng.int(1, 3);
        const ones = rng.int(1, 9);
        const big = rng.bool();
        const answer = big ? 10 * tens : ones;
        return whole(
          ["What number goes at the question mark above the jump?", "这一跳上方的问号处应该填几？"],
          answer,
          big ? [tens, a + 10 * tens, ones] : [10 * ones, a + 10 * tens + ones, 10 * tens],
          [
            `That jump goes from ${big ? a : a + 10 * tens} to ${big ? a + 10 * tens : a + 10 * tens + ones}, which is a jump of ${answer}.`,
            `这一跳从 ${big ? a : a + 10 * tens} 到 ${big ? a + 10 * tens : a + 10 * tens + ones}，跳了 ${answer}。`,
          ],
          hopsFigure([a, a + 10 * tens, a + 10 * tens + ones], false, big ? 0 : 1),
        );
      },
    ),
    earlyPoint(
      "choosing-the-jumps",
      ["Choosing the jumps", "选择怎样跳"],
      [
        "Before you draw any jumps, split the number you are adding into its tens and ones. So 36 becomes a jump of 30 and a jump of 6. The two jumps together must equal the whole number. Mixing up the digits, as in jumps of 3 and 60, takes you to the wrong place on the line.",
        "画跳之前，先把要加的数分成十和一。所以 36 变成跳 30 和跳 6。两跳合起来必须等于这个数。如果把数字弄混了，比如跳 3 和跳 60，就会落到错误的地方。",
      ],
      (rng) => {
        const a = rng.int(12, 60);
        const tens = rng.int(1, 4);
        let ones = rng.int(1, 9);
        if (ones === tens) ones = ones === 9 ? 8 : ones + 1;
        const b = 10 * tens + ones;
        return chooseMath(
          rng,
          [`To find $${a} + ${b}$ starting at ${a}, which pair of jumps is right?`, `从 ${a} 开始求 $${a} + ${b}$，哪两跳是对的？`],
          `+${10 * tens},\\ +${ones}`,
          [`+${tens},\\ +${10 * ones}`, `+${tens},\\ +${ones}`, `+${10 * tens},\\ +${10 * ones}`],
          [
            `${b} is ${10 * tens} and ${ones}, so jump ${10 * tens} and then ${ones}.`,
            `${b} 是 ${10 * tens} 和 ${ones}，所以先跳 ${10 * tens}，再跳 ${ones}。`,
          ],
        );
      },
    ),
  ],
);

const subtractingOnALine = earlyTopic(
  "subtracting-on-an-open-number-line",
  ["Subtracting on an Open Number Line", "在空白数轴上做减法"],
  ["Subtract by jumping back by tens and ones on a number line.", "在数轴上往回跳十和跳一，来做减法。"],
  ["subtracting-within-100"],
  ["2.NBT.B.5"],
  [
    earlyPoint(
      "jumping-back-by-tens-then-ones",
      ["Jumping back by tens and then ones", "先往回跳十，再往回跳一"],
      [
        "Subtracting on a line means jumping back to the left. Start at the larger number. Make one big jump back for the tens of the number you take away, and one small jump back for its ones. To find $72 - 25$, jump back 20 to 52, and then jump back 5 more to 47.",
        "在数轴上做减法，就是往左跳。从大的数开始，先往回跳一大步，跳要减的数的十，再往回跳一小步，跳它的一。求 $72 - 25$，先往回跳 20 到 52，再往回跳 5 到 47。",
      ],
      (rng) => {
        const a = rng.int(50, 99);
        const tens = rng.int(1, 3);
        const ones = rng.int(1, 9);
        const b = 10 * tens + ones;
        return whole(
          [`The jumps show $${a} - ${b}$. Where do they end?`, `图中的跳跃表示 $${a} - ${b}$。最后跳到哪个数？`],
          a - b,
          [a - 10 * tens, a - b + 10, a + b],
          [
            `$${a} - ${10 * tens} = ${a - 10 * tens}$, and $${a - 10 * tens} - ${ones} = ${a - b}$.`,
            `$${a} - ${10 * tens} = ${a - 10 * tens}$，$${a - 10 * tens} - ${ones} = ${a - b}$。`,
          ],
          hopsFigure([a, a - 10 * tens, a - b], true),
        );
      },
    ),
    earlyPoint(
      "the-size-of-a-jump-back",
      ["The size of a jump back", "往回跳了多少"],
      [
        "To find the size of a jump back, subtract the smaller number from the larger, which means the number where it lands from the number where it starts. The jump from 72 back to 52 is 20. A subtraction can have several jumps, and together they must add up to the number being taken away.",
        "要求往回跳了多少，就用大的数减小的数，也就是用开始的数减落到的数。从 72 往回跳到 52，是跳了 20。减法可以跳好几次，这几次跳的数合起来，必须等于要减的数。",
      ],
      (rng) => {
        const a = rng.int(50, 99);
        const tens = rng.int(1, 3);
        const ones = rng.int(1, 9);
        const big = rng.bool();
        const answer = big ? 10 * tens : ones;
        return whole(
          ["What number goes at the question mark above the jump?", "这一跳上方的问号处应该填几？"],
          answer,
          big ? [tens, a - 10 * tens, ones] : [10 * ones, a - 10 * tens - ones, 10 * tens],
          [
            `That jump goes back from ${big ? a : a - 10 * tens} to ${big ? a - 10 * tens : a - 10 * tens - ones}, which is ${answer}.`,
            `这一跳从 ${big ? a : a - 10 * tens} 往回跳到 ${big ? a - 10 * tens : a - 10 * tens - ones}，跳了 ${answer}。`,
          ],
          hopsFigure([a, a - 10 * tens, a - 10 * tens - ones], false, big ? 0 : 1),
        );
      },
    ),
    earlyPoint(
      "jumping-back-to-a-ten",
      ["Jumping back to a ten", "先往回跳到整十"],
      [
        "When the ones you take away are more than the ones you have, stop at a ten on the way. To find $63 - 8$, jump back 3 to reach 60. There are 5 left of the 8, so jump back 5 more to reach 55. It is much easier to subtract from a round number than from one with ones.",
        "要减的一比已有的一多时，先在整十数停一下。求 $63 - 8$，先往回跳 3 到 60。8 还剩 5，再往回跳 5 到 55。从整十数减比从不是整十的数减容易得多。",
      ],
      (rng) => {
        const tens = rng.int(3, 9);
        const ones = rng.int(1, 6);
        const take = rng.int(ones + 1, 9);
        const a = 10 * tens + ones;
        const stop = 10 * tens;
        return whole(
          [`The jumps show $${a} - ${take}$. Where do they end?`, `图中的跳跃表示 $${a} - ${take}$。最后跳到哪个数？`],
          a - take,
          [a - take + 10, stop, stop + (take - ones)],
          [
            `The first jump of ${ones} reaches ${stop}, and the rest of the ${take} is ${take - ones}, which lands on ${a - take}.`,
            `第一跳 ${ones} 到 ${stop}，${take} 还剩 ${take - ones}，再跳就落在 ${a - take}。`,
          ],
          hopsFigure([a, stop, a - take], true),
        );
      },
    ),
  ],
);

const makingARoundNumber = earlyTopic(
  "adding-by-making-a-round-number",
  ["Adding by Making a Round Number", "凑整法做加法"],
  [
    "Move a little from one addend to the other to make a round number that is easy to add.",
    "把一个加数的一点点挪给另一个加数，凑成好加的整数。",
  ],
  ["adding-within-100"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "moving-a-little-across",
      ["Moving a little across", "挪一点过去"],
      [
        "If a number is close to a round number, move a little from the other number to make it round. For $38 + 25$, move 2 from the 25 to the 38. That gives $40 + 23$, which is easy to add. The total stays the same because nothing has been added or taken away. It has only been moved.",
        "如果一个数接近整数，就从另一个数挪一点过来凑整。求 $38 + 25$，把 25 的 2 挪给 38，就变成 $40 + 23$，很好算。总数不变，因为没有多加，也没有少算，只是挪了一下。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const gap = rng.int(1, 3);
        const a = 10 * tens + 10 - gap;
        const b = rng.int(gap + 11, 49);
        const round = a + gap;
        return whole(
          [`What number goes in the box? $${a} + ${b} = ${round} + \\square$`, `方框里填几？$${a} + ${b} = ${round} + \\square$`],
          b - gap,
          [b + gap, b, gap],
          [
            `${a} needs ${gap} more to make ${round}. Taking ${gap} from ${b} leaves ${b - gap}.`,
            `${a} 还要 ${gap} 才到 ${round}。${b} 去掉 ${gap}，还剩 ${b - gap}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "which-sum-is-the-same",
      ["Which sum is the same", "哪个算式的和相同"],
      [
        "When you move some amount from one addend to the other, what one gains the other loses. So check that one number goes up by exactly as much as the other goes down. If both numbers go up, the sum is too large. If only one number changes, the sum is not the same as it was.",
        "把一个加数的一部分挪给另一个加数时，一个多多少，另一个就要少多少。所以要检查：一个数增加的，是否正好等于另一个数减少的。如果两个数都变大，和就太大了。如果只变一个数，和也不一样了。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const gap = rng.int(1, 3);
        const a = 10 * tens + 10 - gap;
        const b = rng.int(gap + 11, 49);
        const round = a + gap;
        return chooseMath(
          rng,
          [`Which sum is the same as $${a} + ${b}$?`, `哪个算式的和与 $${a} + ${b}$ 相同？`],
          `${round} + ${b - gap}`,
          rng.shuffle([`${round} + ${b}`, `${round} + ${b + gap}`, `${round - 10} + ${b}`, `${a} + ${b - gap}`]),
          [
            `${a} went up by ${gap} and ${b} went down by ${gap}, so the sum stays at ${a + b}.`,
            `${a} 增加了 ${gap}，${b} 减少了 ${gap}，所以和还是 ${a + b}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "making-a-round-hundred",
      ["Making a round hundred", "凑成整百"],
      [
        "The same idea works with hundreds. A number such as 298 is only 2 away from 300. So to find $298 + 45$, move 2 across to get $300 + 43$, which is 343. Look for numbers that end in 8 or 9, or in 98 or 99. They are the ones most worth rounding this way.",
        "同样的办法也能用在百上。298 只差 2 就到 300。所以求 $298 + 45$，挪 2 过去，变成 $300 + 43$，等于 343。看到个位是 8、9，或者末尾是 98、99 的数，就最值得这样凑整。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const gap = rng.int(1, 3);
        const a = 100 * h - gap;
        const b = rng.int(gap + 5, 95);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const story = rng.bool();
        return whole(
          story
            ? [
                `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          a + b,
          [100 * h + b, a + b - 100, a + b + 10],
          [
            `$${a} + ${gap} = ${100 * h}$, and $${b} - ${gap} = ${b - gap}$. Then $${100 * h} + ${b - gap} = ${a + b}$.`,
            `$${a} + ${gap} = ${100 * h}$，$${b} - ${gap} = ${b - gap}$。所以 $${100 * h} + ${b - gap} = ${a + b}$。`,
          ],
        );
      },
    ),
  ],
);

const subtractingByAddingUp = earlyTopic(
  "subtracting-by-adding-up",
  ["Subtracting by Adding Up", "用往上加的方法做减法"],
  ["Find a difference by adding up from the smaller number through round numbers.", "从小的数开始，经过整数往上加，求出差。"],
  ["subtracting-within-100"],
  ["2.NBT.B.5", "2.NBT.B.7"],
  [
    earlyPoint(
      "adding-up-to-the-next-ten",
      ["Adding up through a ten", "经过整十往上加"],
      [
        "A difference is the distance between two numbers. So you can also find it by starting at the smaller number and adding up. Jump to the next round number first, and then jump to the larger number. The answer is the sum of all the jumps, and not the number where you land.",
        "差就是两个数之间的距离。所以也可以从小的数开始往上加。先跳到下一个整十数，再跳到大的数。答案是所有跳的数的和，而不是最后落到的数。",
      ],
      (rng) => {
        const tens = rng.int(1, 5);
        const ones = rng.int(1, 8);
        const a = 10 * tens + ones;
        const next = a + 10 - ones;
        const n = next + rng.int(3, 30);
        const answer = n - a;
        return whole(
          [
            `The jumps show how to find $${n} - ${a}$ by adding up. What is the difference?`,
            `图中的跳跃表示用往上加的方法求 $${n} - ${a}$。差是多少？`,
          ],
          answer,
          [n, n - next, next - a, n + a],
          [
            `The jumps are ${next - a} and ${n - next}, and $${next - a} + ${n - next} = ${answer}$.`,
            `两跳分别是 ${next - a} 和 ${n - next}，$${next - a} + ${n - next} = ${answer}$。`,
          ],
          hopsFigure([a, next, n]),
        );
      },
    ),
    earlyPoint(
      "adding-up-through-a-hundred",
      ["Adding up through a hundred", "经过整百往上加"],
      [
        "Adding up is very handy when the two numbers lie on either side of a hundred. To find $403 - 198$, jump 2 from 198 to 200, then jump 200 to reach 400, and then jump 3 to reach 403. Adding the jumps gives 205. Trying to subtract the usual way would mean a lot of trading.",
        "两个数在整百数的两边时，往上加特别方便。求 $403 - 198$，从 198 跳 2 到 200，再跳 200 到 400，再跳 3 到 403。把这几跳加起来得 205。如果用平常的方法减，就要换好多次。",
      ],
      (rng) => {
        const h = rng.int(1, 6);
        const gap = rng.int(1, 9);
        const a = 100 * h - gap;
        const hundreds = rng.int(1, 3);
        const over = rng.int(1, 9);
        const n = 100 * (h + hundreds) + over;
        const answer = n - a;
        return whole(
          [
            `The jumps show how to find $${n} - ${a}$ by adding up. What is the difference?`,
            `图中的跳跃表示用往上加的方法求 $${n} - ${a}$。差是多少？`,
          ],
          answer,
          [100 * hundreds, n, 100 * hundreds + over, answer + 100],
          [
            `The jumps are ${gap}, ${100 * hundreds} and ${over}, which add up to ${answer}.`,
            `这几跳分别是 ${gap}、${100 * hundreds} 和 ${over}，合起来是 ${answer}。`,
          ],
          hopsFigure([a, 100 * h, 100 * (h + hundreds), n]),
        );
      },
    ),
    earlyPoint(
      "when-the-numbers-are-close",
      ["When the numbers are close", "两个数很接近时"],
      [
        "When two numbers are close together, adding up is the fastest way to subtract. To find $72 - 68$, you do not need to take away 68. Just count up from 68: 69, 70, 71, 72. That is 4 steps. Taking away digit by digit gives the same answer, but it takes much longer, and mistakes are easier to make.",
        "两个数很接近时，往上加是做减法最快的办法。求 $72 - 68$，不用真的减去 68，只要从 68 往上数：69、70、71、72，数了 4 步。按数位一位一位地减，答案也一样，但慢得多，也更容易出错。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const ones = rng.int(1, 5);
        const n = 10 * tens + ones;
        const gap = rng.int(ones + 1, ones + 6);
        const a = n - gap;
        const hundreds = rng.bool() ? 100 * rng.int(1, 8) : 0;
        return whole(
          [`What is $${hundreds + n} - ${hundreds + a}$?`, `$${hundreds + n} - ${hundreds + a}$ 等于多少？`],
          gap,
          [Math.abs((n % 10) - (a % 10)), gap + 10, hundreds + n + hundreds + a],
          [
            `Counting up from ${hundreds + a} to ${hundreds + n} takes ${gap} steps.`,
            `从 ${hundreds + a} 往上数到 ${hundreds + n}，一共 ${gap} 步。`,
          ],
        );
      },
    ),
  ],
);

const checkingWithOpposite = earlyTopic(
  "checking-with-the-opposite-operation",
  ["Checking With the Opposite Operation", "用相反的运算来验算"],
  ["Check an addition with a subtraction, and a subtraction with an addition.", "用减法检查加法，用加法检查减法。"],
  ["subtracting-within-1000-with-models"],
  ["2.NBT.B.9"],
  [
    earlyPoint(
      "which-sentence-checks-it",
      ["Which sentence checks it", "用哪个算式来验算"],
      [
        "Adding and subtracting undo each other. To check a subtraction, add the answer to the number you took away, and you should get back to where you started. To check an addition, take one addend away from the sum, and you should get the other addend. Doing the same sum again often repeats a mistake.",
        "加法和减法互相抵消。要检查减法，就把得数和减去的数相加，应该回到开始的数。要检查加法，就用和减去一个加数，应该得到另一个加数。把原来的题再算一遍，常常会重复同样的错误。",
      ],
      (rng) => {
        const a = rng.int(120, 480);
        const b = rng.int(110, 460);
        const c = a + b;
        return rng.bool()
          ? chooseMath(
              rng,
              [`Which sentence can check that $${c} - ${a} = ${b}$?`, `哪个算式可以检查 $${c} - ${a} = ${b}$ 对不对？`],
              `${b} + ${a} = ${c}`,
              rng.shuffle([`${c} + ${a} = ${b}`, `${c} + ${b} = ${a}`, `${b} - ${a} = ${c}`, `${a} - ${b} = ${c}`]),
              [`The answer ${b} and the number taken away, ${a}, should add up to ${c}.`, `得数 ${b} 和减去的数 ${a}，加起来应该是 ${c}。`],
            )
          : chooseMath(
              rng,
              [`Which sentence can check that $${a} + ${b} = ${c}$?`, `哪个算式可以检查 $${a} + ${b} = ${c}$ 对不对？`],
              `${c} - ${b} = ${a}`,
              rng.shuffle([`${b} - ${c} = ${a}`, `${c} + ${b} = ${a}`, `${a} - ${b} = ${c}`, `${a} - ${c} = ${b}`]),
              [`Taking ${b} away from the sum ${c} should leave the other addend, ${a}.`, `和 ${c} 减去 ${b}，应该剩下另一个加数 ${a}。`],
            );
      },
    ),
    earlyPoint(
      "what-the-check-gives",
      ["What the check gives", "验算得到什么"],
      [
        "To use a check, work it out, and then compare the result with the number you began with. If they are the same, you can trust your answer. If they do not match, something went wrong, and you should look again. A check that is out by exactly 10 or 100 usually means a trade was forgotten.",
        "验算时，先算出结果，再和开始的数比较。如果相同，就可以相信答案。如果不同，说明哪里错了，要再看一遍。如果正好差 10 或 100，通常是忘了换算。",
      ],
      (rng) => {
        const n = rng.int(421, 899);
        const take = rng.int(115, 298);
        const off = rng.pick([10, 100, 0]);
        const said = n - take - off;
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} says that $${n} - ${take} = ${said}$. To check, what is $${said} + ${take}$?`,
            `${name} 说 $${n} - ${take} = ${said}$。要验算，$${said} + ${take}$ 等于多少？`,
          ],
          said + take,
          [said + take + 10, said + take - 10, said + take + 100],
          off === 0
            ? [
                `The check gives ${n}, which is the starting number, so ${name} is right.`,
                `验算得到 ${n}，正好是开始的数，所以 ${name} 算对了。`,
              ]
            : [
                `The check gives ${said + take}, not ${n}, so ${name} made a mistake.`,
                `验算得到 ${said + take}，不是 ${n}，所以 ${name} 算错了。`,
              ],
        );
      },
    ),
    earlyPoint(
      "spotting-the-wrong-answer",
      ["Spotting the wrong answer", "找出算错的算式"],
      [
        "A check lets you find a wrong answer without doing the whole sum again. For each subtraction, add the answer to the number taken away, and see whether you reach the first number. The sentence that does not get back there is the wrong one. Look out for answers that are out by exactly ten.",
        "验算不用把整道题重算一遍，就能找出错误的答案。每个减法，都把得数和减去的数相加，看能不能回到第一个数。回不去的那个算式就是错的。要特别留意正好差十的答案。",
      ],
      (rng) => {
        const make = () => {
          const b = rng.int(115, 349);
          const c = rng.int(112, 349);
          return { a: b + c, b, c };
        };
        const good = [make(), make(), make()].map((f) => `${f.a} - ${f.b} = ${f.c}`);
        const bad = make();
        const off = rng.pick([10, -10, 100]);
        const sentence = `${bad.a} - ${bad.b} = ${bad.c + off}`;
        return chooseMath(
          rng,
          ["Exactly one of these subtractions is wrong. Which one?", "下面的减法中，有一个算错了。是哪一个？"],
          sentence,
          good,
          [
            `$${bad.c + off} + ${bad.b} = ${bad.a + off}$, which is not ${bad.a}. The other three all check out.`,
            `$${bad.c + off} + ${bad.b} = ${bad.a + off}$，不是 ${bad.a}。另外三个算式都对。`,
          ],
        );
      },
    ),
  ],
);

const partialSums = earlyTopic(
  "partial-sums-within-1000",
  ["Partial Sums Within 1000", "1000 以内的分步加"],
  [
    "Add three-digit numbers by adding hundreds, tens and ones apart, and then putting them together.",
    "把百、十、一分开相加，再合起来，做三位数加法。",
  ],
  ["adding-within-1000-with-models"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "adding-each-place",
      ["Adding each place", "每一位分别相加"],
      [
        "To add three-digit numbers, take them apart. Add the hundreds to the hundreds, the tens to the tens, and the ones to the ones. Be sure to use what each digit is worth. In $243 + 135$, the hundreds part is $200 + 100$, or 300, and not $2 + 1$. The blocks show why this works.",
        "三位数相加，可以先拆开：百和百相加，十和十相加，一和一相加。一定要用每个数字代表的大小。在 $243 + 135$ 中，百这部分是 $200 + 100$，等于 300，而不是 $2 + 1$。积木能说明为什么这样做是对的。",
      ],
      (rng) => {
        const h1 = rng.int(1, 4);
        const h2 = rng.int(1, 4);
        const t1 = rng.int(1, 5);
        const t2 = rng.int(1, 4);
        const o1 = rng.int(1, 5);
        const o2 = rng.int(1, 4);
        const a = 100 * h1 + 10 * t1 + o1;
        const b = 100 * h2 + 10 * t2 + o2;
        const where = rng.int(0, 2);
        const answer = where === 0 ? 100 * (h1 + h2) : where === 1 ? 10 * (t1 + t2) : o1 + o2;
        const label: Pair = where === 0 ? ["hundreds", "百位"] : where === 1 ? ["tens", "十位"] : ["ones", "个位"];
        return whole(
          [
            `The blocks show ${a} and ${b}. When you add the ${label[0]} parts, what do you get?`,
            `这些积木表示 ${a} 和 ${b}。把${label[1]}这部分相加，得多少？`,
          ],
          answer,
          where === 0
            ? [h1 + h2, 10 * (h1 + h2), a + b]
            : where === 1
              ? [t1 + t2, 100 * (t1 + t2), a + b]
              : [10 * (o1 + o2), 100 + o1 + o2, a + b],
          [`Together the ${label[0]} parts make ${answer}.`, `${label[1]}这部分合起来是 ${answer}。`],
          blockRowsFigure([
            [h1, t1, o1],
            [h2, t2, o2],
          ]),
        );
      },
    ),
    earlyPoint(
      "putting-the-parts-together",
      ["Putting the parts together", "把各部分合起来"],
      [
        "After you add each place, you have three numbers, such as 300, 70 and 8. Put them together to get the sum, which here is 378. When there are no new tens or hundreds to make, each part fills its own place. This is the same as writing a number from its expanded form.",
        "每一位分别相加后，得到三个数，比如 300、70 和 8。把它们合起来，这里是 378。如果没有满十或满百，每一部分就正好占自己的位置。这和把展开式写成一个数是一样的。",
      ],
      (rng) => {
        const h1 = rng.int(1, 5);
        const h2 = rng.int(1, 3);
        const t1 = rng.int(1, 5);
        const t2 = rng.int(1, 4);
        const o1 = rng.int(1, 5);
        const o2 = rng.int(1, 4);
        const a = 100 * h1 + 10 * t1 + o1;
        const b = 100 * h2 + 10 * t2 + o2;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          a + b,
          [100 * (h1 + h2), a + b + 100, a + b + 10, h1 + h2 + t1 + t2 + o1 + o2],
          [
            `The parts are ${100 * (h1 + h2)}, ${10 * (t1 + t2)} and ${o1 + o2}, which make ${a + b}.`,
            `三部分是 ${100 * (h1 + h2)}、${10 * (t1 + t2)} 和 ${o1 + o2}，合起来是 ${a + b}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "when-a-part-is-too-big",
      ["When a part is too big", "某一部分满十或满百时"],
      [
        "Sometimes a part is too large for its place. If the tens make 130, that is really 100 and 30. If the ones make 14, that is 10 and 4. It does not matter. Add the three parts as ordinary numbers, and the extra will go where it belongs. So $300 + 130 + 14$ is 444.",
        "有时某一部分太大，一位放不下。十这部分是 130，其实就是 100 和 30。一这部分是 14，就是 10 和 4。这没关系，把三部分当作普通的数相加，多出来的就会到该去的位上。所以 $300 + 130 + 14$ 等于 444。",
      ],
      (rng) => {
        const h1 = rng.int(1, 4);
        const h2 = rng.int(1, 3);
        const t1 = rng.int(3, 9);
        const t2 = rng.int(10 - t1, 9);
        const o1 = rng.int(0, 9);
        const o2 = rng.int(0, 9);
        const a = 100 * h1 + 10 * t1 + o1;
        const b = 100 * h2 + 10 * t2 + o2;
        const sum = a + b;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          sum,
          [sum - 100, sum - 10, sum + 100],
          [
            `The parts are ${100 * (h1 + h2)}, ${10 * (t1 + t2)} and ${o1 + o2}, which together make ${sum}.`,
            `三部分是 ${100 * (h1 + h2)}、${10 * (t1 + t2)} 和 ${o1 + o2}，合起来是 ${sum}。`,
          ],
        );
      },
    ),
  ],
);

const subtractingInSteps = earlyTopic(
  "subtracting-hundreds-tens-ones-in-steps",
  ["Subtracting in Steps", "分步做减法"],
  [
    "Subtract a three-digit number by taking away its hundreds, tens and ones one after another.",
    "把三位数的百、十、一依次减去，来做减法。",
  ],
  ["subtracting-within-1000-with-models"],
  ["2.NBT.B.7"],
  [
    earlyPoint(
      "three-jumps-back",
      ["Three jumps back", "往回跳三次"],
      [
        "You can take a three-digit number away in three steps. To find $586 - 243$, first take away 200 to reach 386. Then take away 40 to reach 346. Then take away 3 to reach 343. Each step is easy on its own. The jumps on a number line help you to keep track of where you are.",
        "三位数可以分三步减去。求 $586 - 243$，先减 200 得 386，再减 40 得 346，再减 3 得 343。每一步都很简单。数轴上的跳能帮你记住走到了哪里。",
      ],
      (rng) => {
        const h = rng.int(1, 3);
        const tens = rng.int(1, 4);
        const ones = rng.int(1, 5);
        const n = 100 * rng.int(4, 9) + 10 * rng.int(5, 9) + rng.int(6, 9);
        const b = 100 * h + 10 * tens + ones;
        return whole(
          [`The jumps show $${n} - ${b}$. Where do they end?`, `图中的跳跃表示 $${n} - ${b}$。最后跳到哪个数？`],
          n - b,
          [n - 100 * h, n - 100 * h - 10 * tens, n - b + 100],
          [
            `$${n} - ${100 * h} = ${n - 100 * h}$, then $${n - 100 * h} - ${10 * tens} = ${n - 100 * h - 10 * tens}$, then $${n - 100 * h - 10 * tens} - ${ones} = ${n - b}$.`,
            `$${n} - ${100 * h} = ${n - 100 * h}$，$${n - 100 * h} - ${10 * tens} = ${n - 100 * h - 10 * tens}$，$${n - 100 * h - 10 * tens} - ${ones} = ${n - b}$。`,
          ],
          hopsFigure([n, n - 100 * h, n - 100 * h - 10 * tens, n - b], true),
        );
      },
    ),
    earlyPoint(
      "the-next-step",
      ["The next step", "下一步"],
      [
        "When you subtract in steps, keep the three parts of the number you are taking away in mind. After you take away the hundreds, the next step uses the tens of that same number. After that come the ones. Always go on from the last result, and not from the number you started with, or the earlier steps will be lost.",
        "分步减时，要记住要减的数的三部分。减去百以后，下一步减同一个数的十，然后减一。每一步都要接着上一步的结果来算，不能回到开始的数，否则前面的步骤就白做了。",
      ],
      (rng) => {
        const h = rng.int(1, 3);
        const tens = rng.int(1, 4);
        const ones = rng.int(1, 5);
        const n = 100 * rng.int(4, 9) + 10 * rng.int(5, 9) + rng.int(6, 9);
        const b = 100 * h + 10 * tens + ones;
        const after = n - 100 * h;
        return chooseMath(
          rng,
          [
            `To find $${n} - ${b}$, you have done $${n} - ${100 * h} = ${after}$. What should you do next?`,
            `求 $${n} - ${b}$ 时，已经算出 $${n} - ${100 * h} = ${after}$。下一步应该算什么？`,
          ],
          `${after} - ${10 * tens}`,
          rng.shuffle([`${n} - ${10 * tens}`, `${after} - ${tens}`, `${after} + ${10 * tens}`, `${after} - ${100 * h}`]),
          [
            `The hundreds of ${b} are done, so take away its ${10 * tens} from ${after}.`,
            `${b} 的百已经减完了，接下来从 ${after} 里减去 ${10 * tens}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-when-ones-run-short",
      ["Subtracting when the ones run short", "个位不够减时"],
      [
        "If there are not enough ones, you cannot just swap the digits round and subtract the smaller from the larger. In $532 - 147$, the steps are 532 minus 100, then minus 40, then minus 7, and two of these steps pass a round number. Go slowly. The answer is 385, not 415, which is what you get by swapping digits.",
        "个位不够减时，不能把数字调过来，用大的减小的。在 $532 - 147$ 中，步骤是 532 减 100，再减 40，再减 7，其中有两步要跨过整数。慢慢算，答案是 385，而不是调换数字得到的 415。",
      ],
      (rng) => {
        const h1 = rng.int(3, 9);
        const t1 = rng.int(2, 8);
        const o1 = rng.int(0, 5);
        const h2 = rng.int(1, h1 - 1);
        const t2 = rng.int(t1 + 1, 9);
        const o2 = rng.int(o1 + 1, 9);
        const a = 100 * h1 + 10 * t1 + o1;
        const b = 100 * h2 + 10 * t2 + o2;
        const swapped = 100 * (h1 - h2) + 10 * Math.abs(t1 - t2) + Math.abs(o1 - o2);
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          a - b,
          [swapped, a - b + 10, a - b + 100],
          [
            `$${a} - ${100 * h2} = ${a - 100 * h2}$, $${a - 100 * h2} - ${10 * t2} = ${a - 100 * h2 - 10 * t2}$, and $${a - 100 * h2 - 10 * t2} - ${o2} = ${a - b}$.`,
            `$${a} - ${100 * h2} = ${a - 100 * h2}$，$${a - 100 * h2} - ${10 * t2} = ${a - 100 * h2 - 10 * t2}$，$${a - 100 * h2 - 10 * t2} - ${o2} = ${a - b}$。`,
          ],
        );
      },
    ),
  ],
);

const storiesWithBars = earlyTopic(
  "stories-with-bar-models",
  ["Stories With Bar Models", "用线段图解决问题"],
  ["Use bar models to solve one-step stories within 100.", "用线段图解决 100 以内的一步问题。"],
  ["word-problems-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "the-total-in-a-bar",
      ["The total in a bar", "线段图中的总数"],
      [
        "Draw a bar for the whole and cut a matching bar into parts. If the question asks for the total, the question mark sits in the long bar, and you add the parts. The picture does not need to be perfectly exact. What matters is that it shows clearly which numbers are the parts, and which is the whole.",
        "画一个长条表示整体，再画一个一样长的长条，分成几部分。如果问题问的是总数，问号就在长条里，要把各部分相加。图不用画得很精确，重要的是能清楚地看出哪些数是部分，哪个数是整体。",
      ],
      (rng) => {
        const a = rng.int(18, 54);
        const b = rng.int(14, 45);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${name} has ${a} ${thing.en} on one shelf and ${b} on another. The bar model shows the story. How many ${thing.en} are there in all?`,
            `${name} 的一层架子上有 ${a} ${thing.unit}${thing.zh}，另一层有 ${b} ${thing.unit}。线段图表示这个故事。一共有多少${thing.unit}${thing.zh}？`,
          ],
          a + b,
          [Math.abs(a - b), a + b - 10, a + b + 10],
          [`The whole is the two parts together, and $${a} + ${b} = ${a + b}$.`, `整体是两部分合起来，$${a} + ${b} = ${a + b}$。`],
          partWholeBarFigure([a, b], -1),
        );
      },
    ),
    earlyPoint(
      "a-part-in-a-bar",
      ["A part in a bar", "线段图中的一部分"],
      [
        "If the question mark is in the cut bar, you know the whole and one part. You must find what is left, so subtract the part from the whole. It does not matter if the words in the story say that something was added. The bar model shows you the sum to do, whatever the words might suggest.",
        "如果问号在切开的长条里，就是知道整体和一部分。要求剩下的部分，就用整体减去这部分。即使故事里说的是又来了一些，也一样。不管字面上看起来像什么，线段图都会告诉你该怎么算。",
      ],
      (rng) => {
        const all = rng.int(44, 99);
        const a = rng.int(15, all - 12);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${name} had ${a} ${thing.en} and then got some more. Now there are ${all}. How many did ${name} get? Use the bar model.`,
            `${name} 原来有 ${a} ${thing.unit}${thing.zh}，后来又得到一些，现在有 ${all} ${thing.unit}。${name} 得到了多少${thing.unit}？请看线段图。`,
          ],
          all - a,
          [all + a, all, a],
          [
            `The whole is ${all} and one part is ${a}, and $${all} - ${a} = ${all - a}$.`,
            `整体是 ${all}，一部分是 ${a}，$${all} - ${a} = ${all - a}$。`,
          ],
          partWholeBarFigure([a, all - a], 1),
        );
      },
    ),
    earlyPoint(
      "comparing-with-two-bars",
      ["Comparing with two bars", "用两个长条比较"],
      [
        "Stories that compare two amounts use two bars of different lengths. The piece that sticks out is the difference. The dashed part marks that piece. To find the difference, subtract the shorter bar from the longer one. To find the longer bar, add the piece to the shorter one. Look at the picture to see which case you have.",
        "比较两个数的故事，用两个长短不同的长条表示。多出来的一段就是差，用虚线画出来。求差，就用长的减短的。求长的长条，就用短的加上多出的一段。看图就知道是哪一种情况。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const big = rng.int(36, 95);
        const small = rng.int(14, big - 11);
        const thing = rng.pick(earlyThings);
        return rng.bool()
          ? whole(
              [
                `${p} has ${big} ${thing.en} and ${q} has ${small}. How many more does ${p} have than ${q}?`,
                `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 有 ${small} ${thing.unit}。${p} 比 ${q} 多多少${thing.unit}？`,
              ],
              big - small,
              [big + small, big, small],
              [
                `The dashed piece is the difference, and $${big} - ${small} = ${big - small}$.`,
                `虚线部分就是差，$${big} - ${small} = ${big - small}$。`,
              ],
              compareBarsFigure([p, q], [big, small], "gap"),
            )
          : whole(
              [
                `${q} has ${small} ${thing.en}, and ${p} has ${big - small} more than ${q}. How many ${thing.en} does ${p} have?`,
                `${q} 有 ${small} ${thing.unit}${thing.zh}，${p} 比 ${q} 多 ${big - small} ${thing.unit}。${p} 有多少${thing.unit}${thing.zh}？`,
              ],
              big,
              [Math.abs(small - (big - small)), small, big - small],
              [
                `${p}'s bar is ${q}'s bar plus the dashed piece, and $${small} + ${big - small} = ${big}$.`,
                `${p} 的长条是 ${q} 的长条加上虚线部分，$${small} + ${big - small} = ${big}$。`,
              ],
              compareBarsFigure([p, q], [big, small], "first"),
            );
      },
    ),
  ],
);

const twoStepBars = earlyTopic(
  "two-step-stories-with-bar-models",
  ["Two-Step Stories With Bar Models", "用线段图解决两步问题"],
  ["Use bar models to plan and solve stories that take two steps.", "用线段图分析并解决要两步的问题。"],
  ["two-step-word-problems-within-100", "stories-with-bar-models"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "a-whole-with-three-parts",
      ["A whole with three parts", "有三部分的整体"],
      [
        "Some stories have three amounts to put together. In the bar model, the bar is cut into three parts. If the whole is the question, add two of the parts first, and then add the third. Choose two that are easy to put together, as the order you use will not change the answer in any way.",
        "有些故事有三个数要合起来。线段图上，长条被切成三部分。如果要求整体，就先把其中两部分加起来，再加第三部分。选两个好加的数先加，加的顺序不会改变答案。",
      ],
      (rng) => {
        const a = rng.int(12, 28);
        const b = rng.int(12, 28);
        const c = rng.int(11, 26);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${name} collects ${a} ${thing.en} on Monday, ${b} on Tuesday and ${c} on Wednesday. How many ${thing.en} is that in all?`,
            `${name} 星期一收集了 ${a} ${thing.unit}${thing.zh}，星期二收集了 ${b} ${thing.unit}，星期三收集了 ${c} ${thing.unit}。一共收集了多少${thing.unit}${thing.zh}？`,
          ],
          a + b + c,
          [a + b, b + c, a + b + c - 10],
          [
            `$${a} + ${b} = ${a + b}$, and $${a + b} + ${c} = ${a + b + c}$.`,
            `$${a} + ${b} = ${a + b}$，$${a + b} + ${c} = ${a + b + c}$。`,
          ],
          partWholeBarFigure([a, b, c], -1),
        );
      },
    ),
    earlyPoint(
      "taking-away-two-amounts",
      ["Taking away two amounts", "减去两部分"],
      [
        "If a whole has a part missing and two parts known, there are two good plans. You can take the two known parts away from the whole, one after the other. Or you can add the two known parts first, and then take that sum away. Both plans lead to the same answer, so choose the easier one.",
        "如果整体缺一部分，另外两部分知道，有两种好办法。可以用整体依次减去这两部分。也可以先把这两部分加起来，再用整体减去它们的和。两种办法答案相同，选容易的那种。",
      ],
      (rng) => {
        const a = rng.int(12, 28);
        const b = rng.int(11, 26);
        const left = rng.int(11, 40);
        const all = a + b + left;
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${name} has ${all} ${thing.en}, and gives ${a} to one friend and ${b} to another. How many are left?`,
            `${name} 有 ${all} ${thing.unit}${thing.zh}，送给一个朋友 ${a} ${thing.unit}，又送给另一个朋友 ${b} ${thing.unit}。还剩多少${thing.unit}？`,
          ],
          left,
          [a + b, all - a, all - b],
          [
            `The two gifts make $${a} + ${b} = ${a + b}$, and $${all} - ${a + b} = ${left}$.`,
            `送出去的合起来是 $${a} + ${b} = ${a + b}$，$${all} - ${a + b} = ${left}$。`,
          ],
          partWholeBarFigure([a, b, left], 2),
        );
      },
    ),
    earlyPoint(
      "comparing-and-then-adding",
      ["Comparing and then adding", "先比较，再相加"],
      [
        "Some stories hide a number in a comparison. If you know that Ben has 12 more than Ava, you must first find how many Ben has. Only then can you find how many they have together. The two bars show this clearly. Find the unknown bar first, and then add the two bars together.",
        "有些故事把一个数藏在比较里。知道 Ben 比 Ava 多 12 个，就要先算出 Ben 有多少，才能算出两人一共有多少。两个长条能把这一点看得很清楚。先求出不知道的长条，再把两个长条相加。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const small = rng.int(12, 34);
        const gap = rng.int(5, 19);
        const big = small + gap;
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${q} has ${small} ${thing.en}, and ${p} has ${gap} more than ${q}. How many ${thing.en} do they have together?`,
            `${q} 有 ${small} ${thing.unit}${thing.zh}，${p} 比 ${q} 多 ${gap} ${thing.unit}。两人一共有多少${thing.unit}${thing.zh}？`,
          ],
          small + big,
          [big, small + gap, 2 * small, big + gap],
          [
            `${p} has $${small} + ${gap} = ${big}$, and together they have $${small} + ${big} = ${small + big}$.`,
            `${p} 有 $${small} + ${gap} = ${big}$ ${thing.unit}，两人一共有 $${small} + ${big} = ${small + big}$ ${thing.unit}。`,
          ],
          compareBarsFigure([p, q], [big, small], "first"),
        );
      },
    ),
  ],
);

const writingSentences = earlyTopic(
  "writing-number-sentences-for-stories",
  ["Writing Number Sentences for Stories", "为故事列算式"],
  ["Choose the sentence with a box that matches a story of one or two steps.", "选出用方框表示未知数、与一步或两步故事相符的算式。"],
  ["word-problems-within-100"],
  ["2.OA.A.1"],
  [
    earlyPoint(
      "unknown-in-the-middle",
      ["The unknown in the middle", "未知数在中间"],
      [
        "The box in a number sentence goes where the story's unknown number belongs. If you start with some, and some more arrive, and you know the end, then the box stands for the number that arrived. Read the story in order and write the numbers in the same order, using a box for the one you do not know.",
        "算式中的方框，写在故事里不知道的数所在的位置。如果开始有一些，又来了一些，知道最后有多少，方框就代表来的数。按顺序读故事，按同样的顺序写数，不知道的数用方框代替。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(16, 58);
        const b = rng.int(12, 35);
        const c = a + b;
        return chooseMath(
          rng,
          [
            `${name} had ${a} ${thing.en} and got some more. Now ${name} has ${c}. Which sentence tells this story?`,
            `${name} 原来有 ${a} ${thing.unit}${thing.zh}，后来又得到一些，现在有 ${c} ${thing.unit}。哪个算式能表示这个故事？`,
          ],
          `${a} + \\square = ${c}`,
          rng.shuffle([`${a} + ${c} = \\square`, `${c} + \\square = ${a}`, `\\square - ${a} = ${c}`]),
          [`Start with ${a}, add the unknown number, and end with ${c}.`, `从 ${a} 开始，加上不知道的数，最后是 ${c}。`],
        );
      },
    ),
    earlyPoint(
      "unknown-at-the-start",
      ["The unknown at the start", "未知数在开头"],
      [
        "Sometimes the story does not tell you the first number. Then the box comes at the very start of the sentence. If some are taken away and some are left, the sentence is a box minus one number, equal to the other number. To solve it, you add the two known numbers, as you are putting back what left.",
        "有时故事没有告诉你开始的数，这时方框就写在算式的最前面。如果拿走了一些，还剩一些，算式就是方框减一个数等于另一个数。解这种题要把两个知道的数相加，也就是把拿走的放回去。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const b = rng.int(14, 35);
        const left = rng.int(15, 58);
        return chooseMath(
          rng,
          [
            `${name} had some ${thing.en} and gave away ${b}. Now ${left} are left. Which sentence tells this story?`,
            `${name} 原来有一些${thing.zh}，送出去 ${b} ${thing.unit}，还剩 ${left} ${thing.unit}。哪个算式能表示这个故事？`,
          ],
          `\\square - ${b} = ${left}`,
          rng.shuffle([`${b} - \\square = ${left}`, `${left} - ${b} = \\square`, `\\square + ${b} = ${left}`]),
          [`The first number is unknown. Taking ${b} away from it leaves ${left}.`, `开始的数不知道。减去 ${b} 以后剩 ${left}。`],
        );
      },
    ),
    earlyPoint(
      "one-sentence-for-two-steps",
      ["One sentence for two steps", "用一个算式表示两步"],
      [
        "A story with two steps can be written as one long sentence. Follow the story from start to end, and write what happens in order. If you have 40, get 15 more, and then give away 12, the sentence is $40 + 15 - 12 = \\square$. Using the signs in the wrong order or with the wrong numbers changes the story.",
        "两步的故事可以写成一个长算式。按故事的顺序，从头到尾写下发生的事。如果有 40 个，又得到 15 个，再送出去 12 个，算式就是 $40 + 15 - 12 = \\square$。符号或数的顺序写错了，故事就变了。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(25, 55);
        const b = rng.int(11, 30);
        const c = rng.int(10, 24);
        return chooseMath(
          rng,
          [
            `${name} has ${a} ${thing.en}, gets ${b} more, and then gives away ${c}. Which sentence tells this story?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}，然后送出去 ${c} ${thing.unit}。哪个算式能表示这个故事？`,
          ],
          `${a} + ${b} - ${c} = \\square`,
          rng.shuffle([`${a} - ${b} + ${c} = \\square`, `${a} + ${b} + ${c} = \\square`, `${a} - ${b} - ${c} = \\square`]),
          [`Getting more is adding ${b}, and giving away is taking away ${c}.`, `又得到是加 ${b}，送出去是减 ${c}。`],
        );
      },
    ),
  ],
);

/** coinGroup describes some coins of a mix of kinds, largest first. */
function coinGroup(q: number, d: number, n: number, p: number): Pair {
  const en: string[] = [];
  const zh: string[] = [];
  const add = (count: number, one: string, many: string, value: number) => {
    if (count === 0) return;
    en.push(`${count} ${count === 1 ? one : many}`);
    zh.push(`${count} 枚 ${value} 美分硬币`);
  };
  add(q, "quarter", "quarters", 25);
  add(d, "dime", "dimes", 10);
  add(n, "nickel", "nickels", 5);
  add(p, "penny", "pennies", 1);
  return [en.join(", "), zh.join("、")];
}

const makingAmounts = earlyTopic(
  "making-amounts-with-coins",
  ["Making Amounts With Coins", "用硬币凑钱"],
  [
    "Choose coins that make an amount, find how much more is needed, and use the fewest coins.",
    "选出能凑成一个钱数的硬币，求出还差多少，并用最少的硬币凑钱。",
  ],
  ["counting-coins"],
  ["2.MD.C.8"],
  [
    earlyPoint(
      "which-coins-make-the-amount",
      ["Which coins make the amount", "哪些硬币能凑成这个钱数"],
      [
        "The same amount can be made from different coins. To test a group of coins, count it up starting with the coins worth the most. A quarter is 25 cents, a dime is 10, a nickel is 5, and a penny is 1. If your count lands exactly on the amount, the group works. A nearby amount does not.",
        "同一个钱数可以用不同的硬币凑成。要检查一组硬币，就从面值最大的开始数。25 美分硬币值 25 美分，10 美分硬币值 10 美分，5 美分硬币值 5 美分，1 美分硬币值 1 美分。数到的正好是这个钱数，这组硬币才行。差一点也不行。",
      ],
      (rng) => {
        const q = rng.int(0, 3);
        const d = rng.int(1, 3);
        const n = rng.int(0, 2);
        const p = rng.int(0, 4);
        const total = 25 * q + 10 * d + 5 * n + p;
        return choose(
          rng,
          [`Which coins make ${total} cents?`, `哪一组硬币正好是 ${total} 美分？`],
          coinGroup(q, d, n, p),
          [coinGroup(q, d + 1, n, p), coinGroup(q + 1, d, n, p), coinGroup(q, d - 1, n, p + 1), coinGroup(q, d, n + 1, p)],
          [
            `Counting the coins gives $${[25 * q, 10 * d, 5 * n, p].filter((v) => v > 0).join(" + ")} = ${total}$ cents.`,
            `数一数这些硬币：$${[25 * q, 10 * d, 5 * n, p].filter((v) => v > 0).join(" + ")} = ${total}$ 美分。`,
          ],
        );
      },
    ),
    earlyPoint(
      "how-much-more-is-needed",
      ["How much more is needed", "还差多少"],
      [
        "To find how much more you need, first count the coins you already have. Then count up from that amount to the price. For example, if you have 35 cents and the price is 50 cents, you still need 15 cents. Counting up from what you have is often easier than subtracting in your head.",
        "要知道还差多少，先数一数已有的硬币。再从这个钱数往上数到价钱。比如有 35 美分，价钱是 50 美分，还差 15 美分。从已有的钱数往上数，常常比心算减法容易。",
      ],
      (rng) => {
        const coins = [
          ...Array<number>(rng.int(0, 2)).fill(25),
          ...Array<number>(rng.int(1, 3)).fill(10),
          ...Array<number>(rng.int(0, 2)).fill(5),
        ];
        const have = coins.reduce((sum, v) => sum + v, 0);
        const price = have + 5 * rng.int(1, 8);
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} has these coins and wants to buy a toy for ${price} cents. How many more cents does ${name} need?`,
            `${name} 有这些硬币，想买一个 ${price} 美分的玩具。还差多少美分？`,
          ],
          price - have,
          [price, have, price + have],
          [
            `The coins make ${have} cents, and $${price} - ${have} = ${price - have}$.`,
            `这些硬币共 ${have} 美分，$${price} - ${have} = ${price - have}$。`,
          ],
          coinsFigure(coins),
        );
      },
    ),
    earlyPoint(
      "using-the-fewest-coins",
      ["Using the fewest coins", "用最少的硬币"],
      [
        "To use as few coins as you can, start with the coin worth the most that still fits. Use as many quarters as you can, then dimes, then nickels, and finish with pennies. So 41 cents is 1 quarter, 1 dime, 1 nickel and 1 penny, which is 4 coins. Any other way of making 41 cents will take more coins.",
        "要用最少的硬币，就从面值最大、还用得上的硬币开始。尽量多用 25 美分硬币，然后是 10 美分、5 美分，最后是 1 美分。所以 41 美分是 1 枚 25 美分、1 枚 10 美分、1 枚 5 美分和 1 枚 1 美分，一共 4 枚。别的凑法都要更多枚。",
      ],
      (rng) => {
        const amount = rng.int(16, 99);
        const q = Math.floor(amount / 25);
        const afterQ = amount - 25 * q;
        const d = Math.floor(afterQ / 10);
        const afterD = afterQ - 10 * d;
        const n = Math.floor(afterD / 5);
        const p = afterD - 5 * n;
        const count = q + d + n + p;
        return whole(
          [`What is the fewest number of coins that make ${amount} cents?`, `凑成 ${amount} 美分，最少要用多少枚硬币？`],
          count,
          [amount, count + 1, count + 2],
          [`Use ${coinGroup(q, d, n, p)[0]}, which is ${count} coins.`, `用 ${coinGroup(q, d, n, p)[1]}，一共 ${count} 枚。`],
        );
      },
    ),
  ],
);

const changeFromADollar = earlyTopic(
  "change-from-a-dollar",
  ["Change From a Dollar", "一美元的找零"],
  ["Find the change from a dollar by subtracting from 100 or counting up.", "用 100 减，或往上数，求出一美元的找零。"],
  ["dollars-and-cents", "making-amounts-with-coins"],
  ["2.MD.C.8"],
  [
    earlyPoint(
      "counting-up-to-a-dollar",
      ["Counting up to a dollar", "往上数到一美元"],
      [
        "A dollar is worth 100 cents. To find your change, count up from the price to 100. Go to the next multiple of ten first, and then on to 100. If the price is 65 cents, 5 more makes 70, and 30 more makes 100. So the change is 35 cents. These jumps match the coins a shopkeeper gives.",
        "一美元是 100 美分。要求找零，就从价钱往上数到 100。先数到下一个整十数，再数到 100。如果价钱是 65 美分，再数 5 到 70，再数 30 到 100，所以找零是 35 美分。这些跳正好和店员找给你的硬币对应。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(1, 9);
        const price = 10 * tens + ones;
        const next = 10 * (tens + 1);
        return whole(
          [
            `A toy costs ${price} cents and you pay with \\$1. The jumps count up from the price. How many cents of change do you get?`,
            `一个玩具 ${price} 美分，你付了 1 美元。图中的跳跃从价钱往上数。应该找回多少美分？`,
          ],
          100 - price,
          [100 - next, 100 - 10 * tens - ones + 10, price],
          [
            `The jumps are ${next - price} and ${100 - next}, and $${next - price} + ${100 - next} = ${100 - price}$.`,
            `两跳分别是 ${next - price} 和 ${100 - next}，$${next - price} + ${100 - next} = ${100 - price}$。`,
          ],
          hopsFigure([price, next, 100]),
        );
      },
    ),
    earlyPoint(
      "the-change-in-cents",
      ["The change in cents", "找回多少美分"],
      [
        "You can also find change by subtracting from 100. A short way to do this is to find what makes the ones up to ten, and then what makes the tens up to nine tens. For 37 cents, the ones need 3 and the tens need 6, so the change is 63 cents. Check by adding: $37 + 63 = 100$.",
        "也可以用 100 减来求找零。简便的办法是：个位和几合起来是十？十位和几合起来是九？37 美分，个位要 3，十位要 6，所以找零是 63 美分。再用加法检查：$37 + 63 = 100$。",
      ],
      (rng) => {
        const price = rng.int(11, 95);
        const name = rng.pick(earlyNames);
        const item = rng.pick<Pair>([
          ["a pencil", "一支铅笔"],
          ["a sticker", "一张贴纸"],
          ["an eraser", "一块橡皮"],
          ["a notebook", "一个笔记本"],
          ["a bag of chips", "一袋薯片"],
        ]);
        const noCarry = price % 10 === 0 ? 100 - price : 100 - price - 10;
        return whole(
          [
            `${name} buys ${item[0]} for ${price} cents and pays with \\$1. How many cents of change does ${name} get?`,
            `${name} 买${item[1]}，花了 ${price} 美分，付了 1 美元。应该找回多少美分？`,
          ],
          100 - price,
          [noCarry === 100 - price ? 100 - price + 10 : noCarry, price, 100 + price],
          [
            `$100 - ${price} = ${100 - price}$, so the change is ${100 - price} cents.`,
            `$100 - ${price} = ${100 - price}$，所以找回 ${100 - price} 美分。`,
          ],
        );
      },
    ),
    earlyPoint(
      "which-coins-are-the-change",
      ["Which coins are the change", "哪些硬币是找零"],
      [
        "Once you know the change, you need coins that make that amount. Count each choice and see which one matches. A shopkeeper usually starts with the small coins, up to the next round number, and then gives the larger coins. There may be many right ways to give change, but only the correct total will do.",
        "知道找零是多少以后，还要找出正好等于这个钱数的硬币。数一数每个选项，看哪一个对得上。店员通常先给小面值的硬币，凑到下一个整数，再给大面值的。找零的方式可能有很多种，但总数必须正确。",
      ],
      (rng) => {
        const q = rng.int(0, 2);
        const d = rng.int(0, 2);
        const n = rng.int(q + d === 0 ? 1 : 0, 1);
        const p = rng.int(0, 4);
        const change = 25 * q + 10 * d + 5 * n + p;
        const price = 100 - change;
        return choose(
          rng,
          [
            `A snack costs ${price} cents and you pay with \\$1. Which coins are the right change?`,
            `一份零食 ${price} 美分，你付了 1 美元。哪一组硬币是正确的找零？`,
          ],
          coinGroup(q, d, n, p),
          rng.shuffle([coinGroup(q, d + 1, n, p), coinGroup(q + 1, d, n, p), coinGroup(q, d, n + 1, p), coinGroup(q, d, n, p + 1)]),
          [
            `The change is $100 - ${price} = ${change}$ cents, which those coins make.`,
            `找零是 $100 - ${price} = ${change}$ 美分，这组硬币正好是这么多。`,
          ],
        );
      },
    ),
  ],
);

const quarterHours = earlyTopic(
  "quarter-past-and-quarter-to",
  ["Quarter Past and Quarter To", "几点一刻和差一刻几点"],
  [
    "Read and say times at 15 and 45 minutes past the hour, using quarters of an hour.",
    "读出整点后 15 分和 45 分的时间，并用一刻钟的说法表示。",
  ],
  ["telling-time-to-five-minutes"],
  ["2.MD.C.7"],
  [
    earlyPoint(
      "a-quarter-past",
      ["A quarter past", "几点一刻"],
      [
        "If you cut the clock face into four equal parts, each part is a quarter of an hour, or 15 minutes. When the long hand points to the 3, it has gone one quarter of the way around. We call that a quarter past the hour. So 7:15 can be read as a quarter past 7, and the short hand is just past the 7.",
        "把钟面平均分成四份，每份是一刻钟，也就是 15 分钟。长针指着 3 时，正好走了四分之一圈，我们就说是几点一刻。所以 7:15 可以读作 7 点一刻，这时短针刚过 7。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const next = clockHour(h + 1);
        return choose(
          rng,
          ["What time does this clock show?", "这个钟显示的是什么时间？"],
          [`A quarter past ${h}`, `${h} 点一刻`],
          rng.shuffle<Pair>([
            [`A quarter to ${h}`, `差一刻 ${h} 点`],
            [`A quarter past ${next}`, `${next} 点一刻`],
            [`Half past ${h}`, `${h} 点半`],
            [`A quarter to ${next}`, `差一刻 ${next} 点`],
          ]),
          [
            `The long hand is on the 3, which is 15 minutes, and the short hand has just passed the ${h}.`,
            `长针指着 3，是 15 分，短针刚过 ${h}。`,
          ],
          clockFigure(h, 15),
        );
      },
    ),
    earlyPoint(
      "a-quarter-to",
      ["A quarter to", "差一刻几点"],
      [
        "When the long hand points to the 9, there are 45 minutes gone and only 15 minutes left before the next hour. So we say it is a quarter to the next hour. At 7:45 it is a quarter to 8, and not a quarter to 7. The short hand is already close to the 8, which is a good reminder.",
        "长针指着 9 时，已经过了 45 分，离下一个整点只差 15 分，所以我们说差一刻到下一个整点。7:45 就是差一刻 8 点，而不是差一刻 7 点。这时短针已经快到 8 了，这是一个很好的提醒。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const next = clockHour(h + 1);
        return choose(
          rng,
          ["What time does this clock show?", "这个钟显示的是什么时间？"],
          [`A quarter to ${next}`, `差一刻 ${next} 点`],
          rng.shuffle<Pair>([
            [`A quarter to ${h}`, `差一刻 ${h} 点`],
            [`A quarter past ${next}`, `${next} 点一刻`],
            [`A quarter past ${h}`, `${h} 点一刻`],
            [`Half past ${h}`, `${h} 点半`],
          ]),
          [`The long hand is on the 9, which is 15 minutes before ${next} o'clock.`, `长针指着 9，离 ${next} 点还差 15 分。`],
          clockFigure(h, 45),
        );
      },
    ),
    earlyPoint(
      "words-and-digits-for-quarters",
      ["Words and digits for quarters", "一刻钟的说法和数字"],
      [
        "You should be able to go between the words and the digits. A quarter past 4 is 4:15. Half past 4 is 4:30. A quarter to 5 is 4:45, because it is still in the hour after 4. Remember that a quarter to always uses the hour that comes next, while the digits show the hour you are in.",
        "说法和数字要能互相转换。4 点一刻是 4:15。4 点半是 4:30。差一刻 5 点是 4:45，因为这时还在 4 点这一小时里。记住，“差一刻”说的是下一个整点，而数字写的是现在这个小时。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const next = clockHour(h + 1);
        const before = rng.bool();
        const words: Pair = before ? [`a quarter to ${next}`, `差一刻 ${next} 点`] : [`a quarter past ${h}`, `${h} 点一刻`];
        const answer = clockText(h, before ? 45 : 15);
        const wrong = before
          ? [clockText(next, 45), clockText(next, 15), clockText(h, 15), clockText(h, 30)]
          : [clockText(h, 45), clockText(next, 15), clockText(h, 25), clockText(h, 30)];
        return choose(
          rng,
          [`How do you write ${words[0]} in digits?`, `${words[1]}用数字怎么写？`],
          [answer, answer],
          rng.shuffle(wrong).map((s): Pair => [s, s]),
          before
            ? [`It is 15 minutes before ${next}:00, so it is ${answer}.`, `离 ${next}:00 还差 15 分，所以是 ${answer}。`]
            : [`It is 15 minutes after ${h}:00, so it is ${answer}.`, `${h}:00 过 15 分，所以是 ${answer}。`],
        );
      },
    ),
  ],
);

const minutesLater = earlyTopic(
  "time-a-few-minutes-later",
  ["Time a Few Minutes Later", "过几分钟是几点"],
  ["Count by fives on a clock to tell the time a few minutes before or after.", "在钟面上五分五分地数，说出几分钟前或几分钟后的时间。"],
  ["telling-time-to-five-minutes"],
  ["2.MD.C.7"],
  [
    earlyPoint(
      "a-few-minutes-later-on-a-clock",
      ["A few minutes later on a clock", "在钟面上往后数几分钟"],
      [
        "Each number on the clock is 5 minutes from the next. To find a time a little later, count on by fives from where the long hand is pointing. If it points to the 2, that is 10 minutes past the hour, and 15 minutes later it points to the 5, or 25 minutes past the hour.",
        "钟面上相邻的两个数相差 5 分钟。要求过一会儿的时间，就从长针指的地方开始，五分五分地往后数。长针指着 2 是 10 分，过 15 分钟，就指着 5，也就是 25 分。",
      ],
      (rng) => {
        const h = rng.int(1, 11);
        const m = 5 * rng.int(0, 6);
        const add = 5 * rng.int(1, 4);
        const answer = clockText(h, m + add);
        return choose(
          rng,
          [`What time is it ${add} minutes after the time on this clock?`, `这个钟上的时间过 ${add} 分钟是几点几分？`],
          [answer, answer],
          rng
            .shuffle([
              clockText(h, m),
              clockText(h + 1, m),
              clockText(h, Math.abs(m - add)),
              clockText(h + 1, m + add),
              clockText(h, m + add + 5),
            ])
            .filter((s) => s !== answer)
            .slice(0, 3)
            .map((s): Pair => [s, s]),
          [
            `Counting ${add} minutes on by fives from ${clockText(h, m)} reaches ${answer}.`,
            `从 ${clockText(h, m)} 开始，五分五分地往后数 ${add} 分钟，数到 ${answer}。`,
          ],
          clockFigure(h, m),
        );
      },
    ),
    earlyPoint(
      "a-few-minutes-earlier-on-a-clock",
      ["A few minutes earlier on a clock", "在钟面上往前数几分钟"],
      [
        "To find a time a little earlier, count back by fives. The long hand moves backward around the clock. If it now points to the 8, it is 40 minutes past the hour. Ten minutes earlier, it pointed to the 6, or 30 minutes past. If you stay within one hour, the hour does not change at all.",
        "要求早一点的时间，就五分五分地往回数，长针倒着走。长针现在指着 8，是 40 分。10 分钟以前，它指着 6，也就是 30 分。如果还在同一个小时里，小时数不变。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const m = 5 * rng.int(5, 11);
        const take = 5 * rng.int(1, 4);
        const answer = clockText(h, m - take);
        return choose(
          rng,
          [`What time was it ${take} minutes before the time on this clock?`, `比这个钟上的时间早 ${take} 分钟是几点几分？`],
          [answer, answer],
          rng
            .shuffle([
              clockText(h, m),
              clockText(clockHour(h - 1), m - take),
              clockText(h, Math.min(m + take, 55)),
              clockText(h, m - take - 5),
              clockText(clockHour(h + 1), m - take),
            ])
            .filter((s) => s !== answer)
            .slice(0, 3)
            .map((s): Pair => [s, s]),
          [
            `Counting back ${take} minutes by fives from ${clockText(h, m)} reaches ${answer}.`,
            `从 ${clockText(h, m)} 开始，五分五分地往回数 ${take} 分钟，数到 ${answer}。`,
          ],
          clockFigure(h, m),
        );
      },
    ),
    earlyPoint(
      "going-past-the-hour",
      ["Going past the hour", "跨过整点"],
      [
        "When you count on past the 12, a new hour begins and the minutes start again from zero. For example, 20 minutes after 3:50 passes 4:00 on the way. 10 minutes takes you to 4:00, and the other 10 minutes takes you to 4:10. Stopping at the hour makes this type of question much easier to do.",
        "往后数过了 12，就是新的一个小时，分钟又从 0 开始。比如 3:50 过 20 分钟，中间要经过 4:00。10 分钟到 4:00，再过 10 分钟到 4:10。先在整点停一下，这类题就容易多了。",
      ],
      (rng) => {
        const h = rng.int(1, 10);
        const m = 5 * rng.int(9, 11);
        const toHour = 60 - m;
        const beyond = 5 * rng.int(1, 4);
        const add = toHour + beyond;
        const name = rng.pick(earlyNames);
        const job = rng.pick<Pair>([
          ["reading", "看书"],
          ["drawing", "画画"],
          ["cleaning up", "打扫"],
          ["playing outside", "在外面玩"],
          ["doing homework", "做作业"],
        ]);
        const answer = clockText(h + 1, beyond);
        return choose(
          rng,
          [
            `${name} starts ${job[0]} at ${clockText(h, m)} and stops ${add} minutes later. What time does ${name} stop?`,
            `${name} ${clockText(h, m)} 开始${job[1]}，${add} 分钟后停下来。${name} 几点几分停下来？`,
          ],
          [answer, answer],
          rng
            .shuffle([clockText(h, beyond), clockText(h + 1, m), clockText(h + 2, beyond), clockText(h + 1, add)])
            .map((s): Pair => [s, s]),
          [
            `${toHour} minutes reaches ${h + 1}:00, and the other ${beyond} minutes reach ${answer}.`,
            `${toHour} 分钟到 ${h + 1}:00，再过 ${beyond} 分钟到 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

/** shapeOutline gives the corners of an uneven closed shape with the given number of sides, around the middle of the 0 to 10 grid. */
function shapeOutline(rng: Rng, sides: number): (readonly [number, number])[] {
  const turn = rng.int(0, 359);
  return [...Array(sides).keys()].map((i) => {
    const angle = ((turn + (360 * i) / sides + rng.int(-10, 10)) * Math.PI) / 180;
    const radius = 3.6 + rng.int(0, 10) / 10;
    return [5 + radius * Math.cos(angle) * 1.4, 5 + radius * Math.sin(angle)] as const;
  });
}

const distanceAround = earlyTopic(
  "distance-around-a-shape",
  ["Distance Around a Shape", "绕图形一周的长度"],
  [
    "Add side lengths to find the distance around a shape, and solve for a missing side.",
    "把各边的长度加起来，求出绕图形一周的长度，并求出缺少的一边。",
  ],
  ["length-word-problems", "naming-polygons-by-their-sides"],
  ["2.MD.B.5"],
  [
    earlyPoint(
      "walking-around-a-shape",
      ["Walking around a shape", "绕着图形走一圈"],
      [
        "Imagine walking along every side of a shape and returning to where you started. The distance you walk is all of the side lengths added together. Touch each side as you add it, so that you do not count a side twice or miss one. Adding only the two longest sides does not give the distance around.",
        "想象沿着图形的每条边走一圈，回到起点。走过的距离就是所有边的长度加起来。加的时候指着每条边，不要重复，也不要漏掉。只加最长的两条边，得不到绕一周的长度。",
      ],
      (rng) => {
        const sides = rng.int(3, 5);
        const lengths = [...Array(sides).keys()].map(() => rng.int(3, 15));
        const total = lengths.reduce((sum, v) => sum + v, 0);
        const labels = lengths.map((v) => `${v}`);
        const [a, b] = lengths as [number, number];
        return whole(
          ["The sides are measured in meters. How many meters is it around this shape?", "各边的单位是米。绕这个图形一周是多少米？"],
          total,
          [a + b, total - a, sides],
          [
            `Adding all the sides gives $${lengths.join(" + ")} = ${total}$ meters.`,
            `把各边加起来：$${lengths.join(" + ")} = ${total}$ 米。`,
          ],
          labeledSidesFigure(shapeOutline(rng, sides), labels),
        );
      },
    ),
    earlyPoint(
      "the-missing-side",
      ["The missing side", "缺少的一条边"],
      [
        "If you know the distance around a shape and all of the sides but one, you can find the missing side. Add the sides you know. Then subtract that sum from the distance around. The result is what the missing side must be, so that all of the sides add up to the distance around.",
        "如果知道绕图形一周的长度，也知道除了一条边以外的其他边，就能求出这条边。先把知道的边加起来，再用一周的长度减去这个和。结果就是缺少的那条边，这样所有的边加起来才等于一周的长度。",
      ],
      (rng) => {
        const sides = rng.int(3, 5);
        const lengths = [...Array(sides).keys()].map(() => rng.int(3, 15));
        const hidden = rng.int(0, sides - 1);
        const total = lengths.reduce((sum, v) => sum + v, 0);
        const answer = lengths[hidden] as number;
        const known = total - answer;
        return whole(
          [
            `It is ${total} inches around this shape. How long is the side with the question mark, in inches?`,
            `绕这个图形一周是 ${total} 英寸。问号所在的这条边长多少英寸？`,
          ],
          answer,
          [known, total, total + answer],
          [
            `The known sides add up to ${known}, and $${total} - ${known} = ${answer}$.`,
            `知道的边加起来是 ${known}，$${total} - ${known} = ${answer}$。`,
          ],
          labeledSidesFigure(
            shapeOutline(rng, sides),
            lengths.map((v, i) => (i === hidden ? "?" : `${v}`)),
          ),
        );
      },
    ),
    earlyPoint(
      "around-a-rectangle",
      ["Around a rectangle", "绕长方形一周"],
      [
        "Opposite sides of a rectangle are the same length. So when a picture shows only two lengths, there are really four sides to add. You add each length twice. A rectangle with sides of 5 and 3 has a distance around of $5 + 3 + 5 + 3$, which is 16. Adding only the two numbers shown gives half of that.",
        "长方形相对的两条边一样长。所以图上只标了两个长度时，其实有四条边要加，每个长度要加两次。长和宽分别是 5 和 3 的长方形，绕一周的长度是 $5 + 3 + 5 + 3$，等于 16。只加图上的两个数，只得到它的一半。",
      ],
      (rng) => {
        const w = rng.int(3, 14);
        const h = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== w));
        const unit = rng.pick<Pair>([
          ["cm", "厘米"],
          ["m", "米"],
          ["in", "英寸"],
          ["ft", "英尺"],
        ]);
        const total = 2 * (w + h);
        return whole(
          [`How long is the distance around this rectangle, in ${unit[0]}?`, `绕这个长方形一周是多少${unit[1]}？`],
          total,
          [w + h, w * h, 2 * w + h, total + 2],
          [
            `Each length counts twice: $${w} + ${h} + ${w} + ${h} = ${total}$.`,
            `每个长度都要算两次：$${w} + ${h} + ${w} + ${h} = ${total}$。`,
          ],
          labeledRectangleFigure(w, h, unit[0]),
        );
      },
    ),
  ],
);

/** plotData draws measurements for a line plot and the figure that shows them. */
function plotData(rng: Rng) {
  const min = rng.int(2, 7);
  const span = rng.int(3, 5);
  const counts = [...Array(span + 1).keys()].map(() => rng.int(0, 5));
  counts[0] = rng.int(1, 5);
  counts[span] = rng.int(1, 5);
  const values = counts.flatMap((c, i) => Array<number>(c).fill(min + i));
  return { min, span, counts, values };
}

const makingLinePlots = earlyTopic(
  "making-line-plots",
  ["Making Line Plots", "画线图"],
  ["Turn a list of measurements into a line plot, and answer questions from one.", "把一组测量数据画成线图，并根据线图回答问题。"],
  ["line-plots-of-lengths"],
  ["2.MD.D.9"],
  [
    earlyPoint(
      "dots-from-a-list",
      ["Dots from a list", "根据数据画点"],
      [
        "To make a line plot, draw a number line that covers all of your measurements, and put one dot above a number each time it appears on your list. So if the length 6 shows up three times, there will be three dots above the 6. Cross off each measurement as you plot it, so that none gets counted twice.",
        "画线图时，先画一条能包括所有数据的数轴。一个数在数据里出现几次，就在它上面画几个点。所以长度 6 出现三次，6 上面就有三个点。画一个划掉一个，就不会重复了。",
      ],
      (rng) => {
        const low = rng.int(2, 9);
        const values = [...Array(rng.int(7, 10)).keys()].map(() => low + rng.int(0, 3));
        const target = rng.pick(values);
        const answer = values.filter((v) => v === target).length;
        return whole(
          [
            `The lengths of some sticks are ${values.join(", ")} inches. On a line plot, how many dots go above ${target}?`,
            `一些小棒的长度是 ${values.join("、")} 英寸。在线图上，${target} 的上面要画几个点？`,
          ],
          answer,
          [target, values.length, answer + 1],
          [
            `${target} appears ${answer} ${answer === 1 ? "time" : "times"} in the list, so it gets ${answer} ${answer === 1 ? "dot" : "dots"}.`,
            `${target} 在数据中出现了 ${answer} 次，所以画 ${answer} 个点。`,
          ],
        );
      },
    ),
    earlyPoint(
      "how-many-were-measured",
      ["How many were measured", "一共量了多少个"],
      [
        "Each dot on a line plot stands for one thing that was measured. So to find how many things were measured, count all of the dots, whichever number they sit above. Be careful not to read the numbers on the line. They are the lengths, and do not tell you how many things there are.",
        "线图上的每个点代表量过的一个东西。所以要知道量了多少个，就把所有的点都数一遍，不管它们在哪个数上面。不要去读数轴上的数，它们表示长度，不表示有多少个。",
      ],
      (rng) => {
        const { min, span, values } = plotData(rng);
        return whole(
          [
            "Each dot stands for one pencil that was measured, in inches. How many pencils were measured?",
            "每个点代表量过的一支铅笔，单位是英寸。一共量了多少支铅笔？",
          ],
          values.length,
          [span + 1, min + span, values.length + 1],
          [`There are ${values.length} dots in all, and each dot is one pencil.`, `一共有 ${values.length} 个点，每个点是一支铅笔。`],
          { svg: dotPlot(values, { min, max: min + span, step: 1 }), alt: t("A line plot of pencil lengths.", "铅笔长度的线图。") },
        );
      },
    ),
    earlyPoint(
      "the-longest-and-the-shortest",
      ["The longest and the shortest", "最长和最短"],
      [
        "The dots farthest to the right are the longest things measured, and the dots farthest to the left are the shortest. To find how much longer the longest is than the shortest, subtract the numbers below those dots. Numbers with no dots above them do not count, because no objects were that long.",
        "最右边的点代表量到的最长的东西，最左边的点代表最短的东西。要求最长的比最短的长多少，就用这两个点下面的数相减。上面没有点的数不算，因为没有东西是这么长。",
      ],
      (rng) => {
        const { min, span, values } = plotData(rng);
        const start = min - rng.int(0, 1);
        const stop = min + span + rng.int(0, 1);
        return whole(
          [
            "This line plot shows lengths of leaves in centimeters. How many centimeters longer is the longest leaf than the shortest leaf?",
            "这张线图表示树叶的长度，单位是厘米。最长的树叶比最短的长多少厘米？",
          ],
          span,
          [stop - start === span ? span + 1 : stop - start, min + span, values.length],
          [
            `The longest leaf is ${min + span} cm and the shortest is ${min} cm, and $${min + span} - ${min} = ${span}$.`,
            `最长的树叶是 ${min + span} 厘米，最短的是 ${min} 厘米，$${min + span} - ${min} = ${span}$。`,
          ],
          { svg: dotPlot(values, { min: start, max: stop, step: 1 }), alt: t("A line plot of leaf lengths.", "树叶长度的线图。") },
        );
      },
    ),
  ],
);

const graphsFromTables = earlyTopic(
  "graphs-from-tables",
  ["Graphs From Tables", "把表格变成统计图"],
  ["Move between a table and a bar graph, and use either to compare amounts.", "在表格和条形图之间互相转换，并用它们来比较数量。"],
  ["reading-bar-graphs"],
  ["2.MD.D.10"],
  [
    earlyPoint(
      "how-tall-should-the-bar-be",
      ["How tall the bar should be", "长条应该画多高"],
      [
        "A table and a bar graph can show the same information. Each number in the table tells you how tall to draw one bar. Find the label in the top row of the table, and read the number below it. Then the bar for that label must reach exactly that number on the scale of the graph.",
        "表格和条形图可以表示同样的信息。表格里的每个数，告诉你一个长条要画多高。在表格第一行找到标签，读出下面的数。这个标签的长条就要正好画到刻度上的这个数。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const values = labels.map(() => rng.int(1, 12));
        const i = rng.int(0, 3);
        const other = values[(i + 1) % 4] as number;
        return whole(
          [
            `You are making a bar graph from this table. What number should the bar for ${labels[i]} reach?`,
            `要根据这张表画条形图。${labels[i]} 的长条应该画到几？`,
          ],
          values[i] as number,
          [other === values[i] ? (values[i] as number) + 1 : other, values.reduce((sum, v) => sum + v, 0), i + 1],
          [
            `The table shows ${values[i]} under ${labels[i]}, so the bar reaches ${values[i]}.`,
            `表中 ${labels[i]} 下面是 ${values[i]}，所以长条画到 ${values[i]}。`,
          ],
          tableFigure(labels, values),
        );
      },
    ),
    earlyPoint(
      "filling-a-table-from-a-graph",
      ["Filling a table from a graph", "根据统计图填表"],
      [
        "You can also go from a graph back to a table. Look at the top of a bar, and read across to the scale on the left. That number goes in the table under the label for that bar. If a bar stops between two labeled marks, count the small marks to see what they are worth.",
        "也可以根据统计图填表。看长条的顶端，横着对到左边的刻度，读出的数就填在表中这个标签的下面。如果长条停在两个标了数的刻度之间，就要看小格代表多少。",
      ],
      (rng) => {
        const labels = ["A", "B", "C"];
        const step = rng.pick([1, 2, 5]);
        const values = labels.map(() => step * rng.int(1, step === 1 ? 10 : 8));
        const i = rng.int(0, 2);
        return whole(
          [
            `The table should match this graph. What number goes under ${labels[i]}?`,
            `这张表要和统计图一致。${labels[i]} 的下面应该填几？`,
          ],
          values[i] as number,
          [(values[i] as number) / step, (values[i] as number) + step, values.reduce((sum, v) => sum + v, 0)],
          [`The bar for ${labels[i]} reaches ${values[i]} on the scale.`, `${labels[i]} 的长条画到刻度 ${values[i]}。`],
          barGraphFigure(labels, values, step),
        );
      },
    ),
    earlyPoint(
      "comparing-amounts-in-a-table",
      ["Comparing amounts in a table", "比较表中的数"],
      [
        "A table makes it easy to compare amounts without measuring anything. To find how many more one label has than another, subtract the two numbers in the table. To find how many there are in all, add up every number. Read the question carefully to see which labels it is asking about before you begin.",
        "用表格比较数量很方便，不用测量。要求一个标签比另一个多多少，就用表中这两个数相减。要求一共有多少，就把所有的数都加起来。开始之前，要看清问题问的是哪些标签。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const values = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 4);
        const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
        const big = Math.max(values[i] as number, values[j] as number);
        const small = Math.min(values[i] as number, values[j] as number);
        const bigLabel = (values[i] as number) > (values[j] as number) ? labels[i] : labels[j];
        const smallLabel = bigLabel === labels[i] ? labels[j] : labels[i];
        return whole(
          [
            `The table shows how many stickers each team has. How many more stickers does Team ${bigLabel} have than Team ${smallLabel}?`,
            `这张表表示每个小队有多少张贴纸。${bigLabel} 队比 ${smallLabel} 队多多少张贴纸？`,
          ],
          big - small,
          [big + small, big, small],
          [
            `Read ${big} for Team ${bigLabel} and ${small} for Team ${smallLabel}, then subtract to compare: $${big} - ${small} = ${big - small}$.`,
            `从表中读出 ${bigLabel} 队是 ${big}，${smallLabel} 队是 ${small}，再相减比较：$${big} - ${small} = ${big - small}$。`,
          ],
          tableFigure(labels, values),
        );
      },
    ),
  ],
);

const equalShares = earlyTopic(
  "equal-shares-can-look-different",
  ["Equal Shares Can Look Different", "相等的份可以看起来不一样"],
  [
    "See that the same rectangle can be cut into equal shares in different ways, and spot cuts that are not equal.",
    "知道同一个长方形可以用不同的方法分成相等的几份，并找出不相等的分法。",
  ],
  ["halves-thirds-and-fourths-of-shapes"],
  ["2.G.A.3"],
  [
    earlyPoint(
      "which-rectangle-is-cut-fairly",
      ["Which rectangle is cut fairly", "哪个长方形分得公平"],
      [
        "Shares are only equal when every part is exactly the same size. Having the right number of parts is not enough. A rectangle cut into two pieces, one large and one small, is not cut into halves. To test a cut, imagine fitting one part on top of another, and see whether they would match.",
        "只有每一份都一样大，才算相等的份。只有份数对还不够。一个长方形分成一大一小两块，就不是平均分成两半。要检查分得对不对，可以想象把一份放到另一份上面，看它们能不能完全重合。",
      ],
      (rng) => {
        const fair = rng.pick<CutKind>(["tall", "wide", "diagonal"]);
        const labels = ["A", "B", "C"];
        const uneven = rng.shuffle<CutKind>([fair, "uneven", rng.pick<CutKind>(["uneven", "tallThree", "wideThree"])]);
        const at = uneven.indexOf(fair);
        const say = (i: number): Pair => [`Rectangle ${labels[i]}`, `长方形 ${labels[i]}`];
        return choose(
          rng,
          ["Which rectangle is cut into two equal shares?", "哪个长方形被分成了相等的两份？"],
          say(at),
          [0, 1, 2].filter((i) => i !== at).map(say),
          [
            `Rectangle ${labels[at]} has exactly two parts of the same size. The others do not.`,
            `长方形 ${labels[at]} 正好分成大小相同的两份，其他长方形不是这样。`,
          ],
          rectangleCutsFigure(
            labels,
            uneven.map((kind) => ({ kind, shaded: rng.int(0, 1) })),
          ),
        );
      },
    ),
    earlyPoint(
      "same-size-different-shape",
      ["Same size but different shape", "大小相同，形状不同"],
      [
        "A half is always half of the whole, however you make the cut. Half of a rectangle cut across, half cut down the middle, and half cut from corner to corner can all look different, but they each cover exactly the same amount. So equal shares of the same whole do not need to have the same shape.",
        "不管怎样分，一半总是整体的一半。一个长方形横着分、竖着分或沿对角线分，得到的一半看起来都不一样，但大小完全相同。所以同一个整体的相等的份，不一定形状相同。",
      ],
      (rng) => {
        const family = rng.pick<{ kinds: CutKind[]; parts: number }>([
          { kinds: ["tall", "wide", "diagonal"], parts: 2 },
          { kinds: ["tallThree", "wideThree"], parts: 3 },
          { kinds: ["grid", "cross", "tallFour", "wideFour"], parts: 4 },
        ]);
        const cuts = rng.sample(family.kinds, 2);
        const shaded = rng.int(1, family.parts - 1);
        const labels = ["A", "B"];
        const same: Pair = ["They are the same size", "一样大"];
        const a: Pair = ["The shaded part of A is larger", "A 的涂色部分更大"];
        const b: Pair = ["The shaded part of B is larger", "B 的涂色部分更大"];
        const c: Pair = ["They cannot be compared", "无法比较"];
        return choose(
          rng,
          ["Both rectangles are the same size. How do the shaded parts compare?", "两个长方形一样大。涂色部分比较起来怎么样？"],
          same,
          rng.shuffle([a, b, c]),
          [
            `In each rectangle, ${shaded} of ${family.parts} equal shares of the same whole ${shaded === 1 ? "is" : "are"} shaded, so the shaded parts are the same size.`,
            `两个长方形都平均分成 ${family.parts} 份，涂了其中的 ${shaded} 份，整体又一样大，所以涂色部分一样大。`,
          ],
          rectangleCutsFigure(
            labels,
            cuts.map((kind) => ({ kind, shaded })),
          ),
        );
      },
    ),
    earlyPoint(
      "how-many-shares-make-the-whole",
      ["How many shares make the whole", "几份合成一个整体"],
      [
        "A whole cut into equal shares has as many shares as its name says. Two halves make a whole, three thirds make a whole, and four fourths make a whole. So if one share of a shape is shaded and you want to shade the rest, count how many shares still need to be shaded to finish the whole shape.",
        "一个整体分成几份，就有几个这样的一份。两个二分之一合成一个整体，三个三分之一合成一个整体，四个四分之一合成一个整体。所以如果涂了一些，还要涂完，就数一数还差几份。",
      ],
      (rng) => {
        const options: readonly { kind: CutKind; parts: number }[] = [
          { kind: "tall", parts: 2 },
          { kind: "wide", parts: 2 },
          { kind: "diagonal", parts: 2 },
          { kind: "tallThree", parts: 3 },
          { kind: "wideThree", parts: 3 },
          { kind: "grid", parts: 4 },
          { kind: "cross", parts: 4 },
          { kind: "tallFour", parts: 4 },
          { kind: "wideFour", parts: 4 },
        ];
        const pick = rng.pick(options);
        const shaded = rng.int(0, pick.parts - 1);
        const extra = rng.pick(options);
        return whole(
          [
            "Look at the rectangle labeled A. How many more shares must be shaded to shade the whole rectangle?",
            "看标着 A 的长方形。还要再涂几份，才能把整个长方形涂满？",
          ],
          pick.parts - shaded,
          [shaded === 0 ? pick.parts + 1 : shaded, pick.parts, pick.parts + shaded],
          [
            `It has ${pick.parts} equal shares and ${shaded} ${shaded === 1 ? "is" : "are"} shaded, so ${pick.parts - shaded} more ${pick.parts - shaded === 1 ? "is" : "are"} needed.`,
            `它有 ${pick.parts} 个相等的份，已经涂了 ${shaded} 份，还要再涂 ${pick.parts - shaded} 份。`,
          ],
          rectangleCutsFigure(
            ["A", "B"],
            [
              { kind: pick.kind, shaded },
              { kind: extra.kind, shaded: rng.int(0, 1) },
            ],
          ),
        );
      },
    ),
  ],
);

/** withArticle puts a or an before a shape name. */
const withArticle = (name: string) => `${/^[aeiou]/.test(name) ? "an" : "a"} ${name}`;

const polygonNames: readonly { sides: number; name: Pair }[] = [
  { sides: 3, name: ["triangle", "三角形"] },
  { sides: 4, name: ["quadrilateral", "四边形"] },
  { sides: 5, name: ["pentagon", "五边形"] },
  { sides: 6, name: ["hexagon", "六边形"] },
  { sides: 8, name: ["octagon", "八边形"] },
];

const shapeRiddles = earlyTopic(
  "shape-riddles",
  ["Shape Riddles", "图形谜语"],
  [
    "Use clues about sides and corners to name polygons, even when they look unusual.",
    "根据边和角的线索说出多边形的名称，即使它们看起来不常见。",
  ],
  ["counting-sides-and-angles"],
  ["2.G.A.1"],
  [
    earlyPoint(
      "guess-the-shape",
      ["Guess the shape", "猜一猜是什么图形"],
      [
        "A shape riddle tells you about its sides or corners, and you have to name it. Remember that a polygon has as many corners as it has sides. A triangle has 3, a quadrilateral has 4, a pentagon has 5, a hexagon has 6, and an octagon has 8. So a clue about corners is really a clue about sides.",
        "图形谜语会告诉你边或角的情况，你要说出它的名称。记住，多边形有几条边，就有几个角。三角形有 3 条边，四边形有 4 条，五边形有 5 条，六边形有 6 条，八边形有 8 条。所以关于角的线索，其实也是关于边的线索。",
      ],
      (rng) => {
        const shape = rng.pick(polygonNames);
        const corners = rng.bool();
        const others = rng.sample(
          polygonNames.filter((p) => p !== shape),
          3,
        );
        return choose(
          rng,
          corners
            ? [
                `I am a closed shape with straight sides and ${shape.sides} corners. What am I?`,
                `我是由直边围成的封闭图形，有 ${shape.sides} 个角。我是什么图形？`,
              ]
            : [
                `I am a closed shape with ${shape.sides} straight sides. What am I?`,
                `我是由 ${shape.sides} 条直边围成的封闭图形。我是什么图形？`,
              ],
          shape.name,
          others.map((p) => p.name),
          [
            `Every ${shape.name[0]} has ${shape.sides} sides and ${shape.sides} corners.`,
            `${shape.name[1]}有 ${shape.sides} 条边和 ${shape.sides} 个角。`,
          ],
        );
      },
    ),
    earlyPoint(
      "naming-an-unusual-shape",
      ["Naming an unusual shape", "说出不常见图形的名称"],
      [
        "A shape does not have to look neat to have a name. A hexagon can have long sides and short sides, and it can be turned in any direction. The name depends only on the number of sides. So count the sides carefully, starting from one corner and going all the way around the shape until you are back at that corner.",
        "图形不一定要很整齐才有名称。六边形可以有长边和短边，也可以转到任何方向。名称只和边数有关。所以要仔细数边，从一个角开始，绕图形一圈，再回到这个角。",
      ],
      (rng) => {
        const shape = rng.pick(polygonNames);
        const others = rng.sample(
          polygonNames.filter((p) => p !== shape),
          3,
        );
        return choose(
          rng,
          ["What is the name of this shape?", "这个图形叫什么？"],
          shape.name,
          others.map((p) => p.name),
          [`It has ${shape.sides} sides, so it is ${withArticle(shape.name[0])}.`, `它有 ${shape.sides} 条边，所以是${shape.name[1]}。`],
          polygonFigure(shapeOutline(rng, shape.sides), t("A closed shape with straight sides.", "一个由直边围成的封闭图形。")),
        );
      },
    ),
    earlyPoint(
      "comparing-numbers-of-sides",
      ["Comparing numbers of sides", "比较边数"],
      [
        "You can use what you know about shapes to answer number questions. First turn each shape's name into its number of sides, and then work with those numbers. To find how many more sides an octagon has than a pentagon, subtract: $8 - 5 = 3$. To find how many sides several shapes have in all, add.",
        "可以用图形的知识来回答数的问题。先把每个图形的名称换成它的边数，再用这些数来算。要求八边形比五边形多几条边，就用减法：$8 - 5 = 3$。要求几个图形一共有多少条边，就用加法。",
      ],
      (rng) => {
        const [x, y] = rng.sample(polygonNames, 2) as [(typeof polygonNames)[number], (typeof polygonNames)[number]];
        const big = x.sides > y.sides ? x : y;
        const small = big === x ? y : x;
        const form = rng.int(0, 2);
        if (form === 0)
          return whole(
            [
              `How many more sides does ${withArticle(big.name[0])} have than ${withArticle(small.name[0])}?`,
              `${big.name[1]}比${small.name[1]}多几条边？`,
            ],
            big.sides - small.sides,
            [big.sides + small.sides, big.sides, small.sides],
            [
              `The ${big.name[0]} has ${big.sides} and the ${small.name[0]} has ${small.sides}, so subtract: $${big.sides} - ${small.sides} = ${big.sides - small.sides}$.`,
              `${big.name[1]}有 ${big.sides} 条，${small.name[1]}有 ${small.sides} 条，所以相减：$${big.sides} - ${small.sides} = ${big.sides - small.sides}$。`,
            ],
          );
        if (form === 1)
          return whole(
            [
              `How many fewer corners does ${withArticle(small.name[0])} have than ${withArticle(big.name[0])}?`,
              `${small.name[1]}比${big.name[1]}少几个角？`,
            ],
            big.sides - small.sides,
            [big.sides + small.sides, big.sides, small.sides],
            [
              `Corners match sides, and $${big.sides} - ${small.sides} = ${big.sides - small.sides}$.`,
              `角数和边数相同，$${big.sides} - ${small.sides} = ${big.sides - small.sides}$。`,
            ],
          );
        return whole(
          [
            `How many sides do ${withArticle(big.name[0])} and ${withArticle(small.name[0])} have in all?`,
            `一个${big.name[1]}和一个${small.name[1]}一共有几条边？`,
          ],
          big.sides + small.sides,
          [big.sides - small.sides, big.sides, big.sides * small.sides],
          [
            `The ${big.name[0]} has ${big.sides} sides and the ${small.name[0]} has ${small.sides}, so add: $${big.sides} + ${small.sides} = ${big.sides + small.sides}$.`,
            `${big.name[1]}有 ${big.sides} 条边，${small.name[1]}有 ${small.sides} 条边，所以相加：$${big.sides} + ${small.sides} = ${big.sides + small.sides}$。`,
          ],
        );
      },
    ),
  ],
);

/** gradeTwoMoreTopics are the added topics of 2nd Grade Math. */
export const gradeTwoMoreTopics: readonly TopicDef[] = [
  countingWithin1000,
  zeroAsAPlaceHolder,
  tradingPlaces,
  numberLinesTo1000,
  orderingThreeDigits,
  evenAndOddSums,
  arraysByRowsAndColumns,
  addingOnALine,
  subtractingOnALine,
  makingARoundNumber,
  subtractingByAddingUp,
  checkingWithOpposite,
  partialSums,
  subtractingInSteps,
  storiesWithBars,
  twoStepBars,
  writingSentences,
  makingAmounts,
  changeFromADollar,
  quarterHours,
  minutesLater,
  distanceAround,
  makingLinePlots,
  graphsFromTables,
  equalShares,
  shapeRiddles,
];

/** gradeTwoMoreUnits are the units that place the added topics in 2nd Grade Math. */
export const gradeTwoMoreUnits: CourseDef["units"] = [
  {
    title: t("Counting and Place Value Patterns", "数数和位值的规律"),
    modules: [
      {
        title: t("Reading the Places", "读懂各个数位"),
        topics: [
          "counting-within-1000",
          "zero-as-a-place-holder",
          "trading-among-hundreds-tens-and-ones",
          "number-lines-to-1000",
          "ordering-three-digit-numbers",
        ],
      },
      { title: t("Patterns in Groups", "成组的规律"), topics: ["even-numbers-as-doubles", "arrays-by-rows-and-by-columns"] },
    ],
  },
  {
    title: t("Mental Strategies", "心算策略"),
    modules: [
      {
        title: t("Jumping on a Number Line", "在数轴上跳"),
        topics: [
          "adding-on-an-open-number-line",
          "subtracting-on-an-open-number-line",
          "adding-by-making-a-round-number",
          "subtracting-by-adding-up",
        ],
      },
      {
        title: t("Working Within 1000", "1000 以内的计算"),
        topics: ["checking-with-the-opposite-operation", "partial-sums-within-1000", "subtracting-hundreds-tens-ones-in-steps"],
      },
    ],
  },
  {
    title: t("Stories With Models", "用图解决问题"),
    modules: [
      {
        title: t("Bar Models and Sentences", "线段图和算式"),
        topics: ["stories-with-bar-models", "two-step-stories-with-bar-models", "writing-number-sentences-for-stories"],
      },
    ],
  },
  {
    title: t("Money and Time", "钱和时间"),
    modules: [
      { title: t("Using Coins", "使用硬币"), topics: ["making-amounts-with-coins", "change-from-a-dollar"] },
      { title: t("Reading Clocks Further", "进一步读钟表"), topics: ["quarter-past-and-quarter-to", "time-a-few-minutes-later"] },
    ],
  },
  {
    title: t("Measuring and Data", "测量和数据"),
    modules: [
      { title: t("Measuring Around", "绕图形一周"), topics: ["distance-around-a-shape"] },
      { title: t("Making Graphs", "画统计图"), topics: ["making-line-plots", "graphs-from-tables"] },
    ],
  },
  {
    title: t("Thinking About Shapes", "思考图形"),
    modules: [{ title: t("Shares and Riddles", "平均分和图形谜语"), topics: ["equal-shares-can-look-different", "shape-riddles"] }],
  },
];
