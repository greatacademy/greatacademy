// Added topics of 2nd Grade Math: counting and place value patterns, open number lines,
// mental strategies, bar models for stories, making amounts of money, quarter hours,
// distance around a shape, making graphs and equal shares.

import type { CourseDef, Figure, Rng, TopicDef } from "@ga/content";
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
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  blockRowsFigure,
  type CutKind,
  captioned,
  compareBarsFigure,
  hopsFigure,
  labeledSidesFigure,
  type MathWrong,
  many,
  type Pair,
  partWholeBarFigure,
  picked,
  pickedMath,
  rectangleCutsFigure,
  type Slip,
  solved,
  tableFigure,
  type Walk,
  type Wrong,
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
        "Count on from 197: 198, 199, and then 200. After 199 the ones and the tens are both full, so they go back to 0 and a new hundred begins.\n\nCheck: $199 + 1 = 200$.\n\n> **Watch out.** After 199 comes 200, not 1910 or 190.",
        "从 197 往后数：198、199，然后是 200。199 之后个位和十位都满了，都变回 0，开始新的一百。\n\n检验：$199 + 1 = 200$。\n\n> **注意。** 199 后面是 200，不是 1910，也不是 190。",
      ],
      (rng) => {
        const up = rng.bool();
        const h = 100 * rng.int(2, 9);
        const shift = rng.int(0, 2);
        const d = up ? 1 : -1;
        const start = up ? h - 2 + shift : h + 2 - shift;
        const shown = [0, 1, 2].map((i) => start + i * d);
        const last = shown[2] as number;
        const answer = start + 3 * d;
        return solved(
          [`What number comes next? $${shown.join(",\\ ")},\\ \\square$`, `方框里填几？$${shown.join(",\\ ")},\\ \\square$`],
          answer,
          [
            [
              ["Find the step", "找出每次变多少"],
              [`Each number is 1 ${up ? "more" : "less"} than the one before.`, `每个数都比前一个数${up ? "多" : "少"} 1。`],
            ],
            [
              ["Take one more step", "再数一步"],
              [up ? "Add 1:" : "Take away 1:", up ? "加 1：" : "减 1："],
              [`${last} ${up ? "+" : "-"} 1 = ${answer}`],
            ],
          ],
          [
            `$${answer} ${up ? "-" : "+"} 1 = ${last}$, the number before it.`,
            `$${answer} ${up ? "-" : "+"} 1 = ${last}$，正是它前面的数。`,
          ],
          [
            [answer + 10 * d, "That changes the tens. The list counts by ones.", "这改变的是十位。这列数是一个一个地数。"],
            [answer + 100 * d, "That changes the hundreds. The list counts by ones.", "这改变的是百位。这列数是一个一个地数。"],
            [
              answer - d,
              `That goes the wrong way. The list counts ${up ? "up" : "down"}.`,
              `方向反了。这列数是往${up ? "大" : "小"}数的。`,
            ],
          ],
        );
      },
      captioned(
        hopsFigure([197, 198, 199, 200]),
        "Counting on by ones from 197 crosses the hundred: 198, 199, 200.",
        "从 197 一个一个往后数，跨过整百：198、199、200。",
      ),
    ),
    earlyPoint(
      "skip-counting-from-any-number",
      ["Skip counting from any number", "从任意一个数开始跳着数"],
      [
        "Count by tens from 274: 284, 294, 304. Only the tens change, and after 9 tens they go past the hundred, so 294 is followed by 304.\n\nCheck: $294 + 10 = 304$.\n\n> **Watch out.** After 294 comes 304, not 2104. When the tens pass 9, the hundreds go up by 1.",
        "从 274 开始十个十个地数：284、294、304。只有十位在变，十位满了就进到百位，所以 294 后面是 304。\n\n检验：$294 + 10 = 304$。\n\n> **注意。** 294 后面是 304，不是 2104。十位超过 9 时，百位要加 1。",
      ],
      (rng) => {
        const step = rng.pick([5, 10, 100]);
        const start = step === 5 ? 5 * rng.int(20, 180) : step === 10 ? rng.int(101, 680) : rng.int(101, 590);
        const shown = [0, 1, 2].map((i) => start + i * step);
        const last = shown[2] as number;
        const answer = start + 3 * step;
        return solved(
          [`What number comes next? $${shown.join(",\\ ")},\\ \\square$`, `方框里填几？$${shown.join(",\\ ")},\\ \\square$`],
          answer,
          [
            [
              ["Find the step", "找出每次变多少"],
              [
                `${shown[1]} - ${shown[0]} = ${step}, so the list counts by ${step}s.`,
                `${shown[1]} - ${shown[0]} = ${step}，所以每次多 ${step}。`,
              ],
            ],
            [["Take one more step", "再数一步"], [`Add ${step}:`, `加 ${step}：`], [`${last} + ${step} = ${answer}`]],
          ],
          [`$${answer} - ${last} = ${step}$, the same step as the others.`, `$${answer} - ${last} = ${step}$，和其他的步长一样。`],
          [
            [answer + step, "That takes two steps instead of one.", "这多走了一步。"],
            [last + 1, `That counts by ones. The list counts by ${step}s.`, `这是一个一个地数。这列数每次多 ${step}。`],
            [step === 100 ? answer + 10 : answer + 100, "That changes the wrong place.", "这改错了数位。"],
          ],
        );
      },
      captioned(
        hopsFigure([274, 284, 294, 304]),
        "Hops of 10 from 274: 284, 294, 304, crossing 300.",
        "从 274 开始每次跳 10：284、294、304，跨过 300。",
      ),
    ),
    earlyPoint(
      "what-is-being-counted-by",
      ["How the list is counting", "这列数是怎样数的"],
      [
        "Look at 340, 350, 360, 370. Each number is $350 - 340 = 10$ more than the one before, so the list counts by tens.\n\nCheck: $360 - 350 = 10$ and $370 - 360 = 10$ too.\n\n> **Watch out.** Do not look only at the last digit. Here the ones stay at 0, but the list does not count by ones.",
        "看 340、350、360、370。每个数都比前一个数多 $350 - 340 = 10$，所以是十个十个地数。\n\n检验：$360 - 350 = 10$，$370 - 360 = 10$，也都是 10。\n\n> **注意。** 不要只看最后一位。这里个位都是 0，但不是一个一个地数。",
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
        const nums = [0, 1, 2, 3].map((i) => start + i * step.n);
        return picked(
          rng,
          [`How is this list counting? $${nums.join(",\\ ")}$`, `这列数是怎样数的？$${nums.join(",\\ ")}$`],
          step.say,
          steps
            .filter((_, i) => i !== at)
            .map(
              (s): Wrong => [
                s.say,
                `Then each number would be ${s.n} more, but here it is ${step.n} more.`,
                `那样每个数应该多 ${s.n}，但这里多 ${step.n}。`,
              ],
            ),
          [
            [
              ["Subtract neighbors", "相邻两数相减"],
              ["Take the first number from the second:", "用第二个数减第一个数："],
              [`${nums[1]} - ${nums[0]} = ${step.n}`],
            ],
            [
              ["Name the step", "说出步长"],
              [`Each number is ${step.n} more than the one before.`, `每个数都比前一个数多 ${step.n}。`],
            ],
          ],
          [`$${nums[3]} - ${nums[2]} = ${step.n}$ as well.`, `$${nums[3]} - ${nums[2]} = ${step.n}$，也一样。`],
        );
      },
      captioned(hopsFigure([340, 350, 360, 370]), "340, 350, 360, 370: each hop is 10.", "340、350、360、370：每次跳 10。"),
    ),
  ],
  [
    "A ticket machine prints 198, 199, and then 200. When the ones and tens are both full, the count moves on to a new hundred.\n\nCheck: the number just after 299 is 300 in the same way.\n\nIn this lesson we count by ones, fives, tens and hundreds from any number, across hundreds too.",
    "取号机打出 198、199，然后是 200。个位和十位都满了，就数到新的一百。\n\n检验：同样，299 后面是 300。\n\n本课我们从任意一个数开始，一个一个、五个五个、十个十个、一百一百地数，也要跨过整百。",
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
        "These blocks are 5 hundreds and 3 ones, with no tens. Write 5 in the hundreds place, 0 in the tens place and 3 in the ones place: 503.\n\nCheck: $500 + 3 = 503$.\n\n> **Watch out.** Do not leave out the 0. 53 is only 5 tens and 3 ones.",
        "这些积木是 5 个百和 3 个一，没有十。百位写 5，十位写 0，个位写 3：503。\n\n检验：$500 + 3 = 503$。\n\n> **注意。** 不要漏写 0。53 只是 5 个十和 3 个一。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const o = rng.int(1, 9);
        const n = 100 * h + o;
        return solved(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          n,
          [
            [
              ["Count each kind", "数每种积木"],
              [`${many(h, "hundred")}, no tens and ${many(o, "one")}.`, `${h} 个百，没有十，${o} 个一。`],
            ],
            [
              ["Write the digits", "写数字"],
              [`Hundreds ${h}, tens 0, ones ${o}: ${n}.`, `百位 ${h}，十位 0，个位 ${o}：${n}。`],
            ],
          ],
          [`$${100 * h} + ${o} = ${n}$.`, `$${100 * h} + ${o} = ${n}$。`],
          [
            [10 * h + o, "That leaves out the 0, so the hundreds become tens.", "这漏写了 0，百变成了十。"],
            [100 * h + 10 * o, "That puts the ones in the tens place.", "这把一放到了十位上。"],
            [h + o, "That adds the counts instead of writing the digits in their places.", "这把个数相加了，没有按数位写。"],
          ],
          blockRowsFigure([[h, 0, o]]),
        );
      },
      captioned(blockRowsFigure([[5, 0, 3]]), "5 hundreds, no tens and 3 ones: 503.", "5 个百，没有十，3 个一：503。"),
    ),
    earlyPoint(
      "what-the-zero-tells-you",
      ["What the zero tells you", "0 表示什么"],
      [
        "In 307 the 0 is in the tens place, so there are no tens: 3 hundreds and 7 ones.\n\nCheck: $300 + 7 = 307$, with nothing added for the tens.\n\n> **Watch out.** The 0 means only that one place is empty. 307 is not worth nothing.",
        "在 307 中，0 在十位上，所以没有十：3 个百和 7 个一。\n\n检验：$300 + 7 = 307$，十位上什么也没加。\n\n> **注意。** 0 只表示这一位是空的。307 并不是零。",
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
        return picked(
          rng,
          [`What does the 0 in ${n} tell you?`, `${n} 中的 0 表示什么？`],
          inTens ? noTens : noOnes,
          [
            [
              inTens ? noOnes : noTens,
              `The ${inTens ? "ones" : "tens"} digit is ${d}, not 0.`,
              `${inTens ? "个位" : "十位"}是 ${d}，不是 0。`,
            ],
            [noHundreds, `The hundreds digit is ${h}.`, `百位是 ${h}。`],
            [nothing, `${n} has ${many(h, "hundred")}, so it is not worth nothing.`, `${n} 有 ${h} 个百，不是零。`],
          ],
          [
            [
              ["Find the 0", "找到 0"],
              [`In ${n} the 0 is in the ${inTens ? "tens" : "ones"} place.`, `在 ${n} 中，0 在${inTens ? "十位" : "个位"}上。`],
            ],
            [
              ["Read it", "读懂它"],
              [`So there are no ${inTens ? "tens" : "ones"}.`, `所以没有${inTens ? "十" : "一"}。`],
            ],
          ],
          inTens
            ? [`$${100 * h} + ${d} = ${n}$, with no tens.`, `$${100 * h} + ${d} = ${n}$，没有十。`]
            : [`$${100 * h} + ${10 * d} = ${n}$, with no ones.`, `$${100 * h} + ${10 * d} = ${n}$，没有一。`],
        );
      },
      captioned(blockRowsFigure([[3, 0, 7]]), "307: 3 hundreds, no tens and 7 ones.", "307：3 个百，没有十，7 个一。"),
    ),
    earlyPoint(
      "expanded-form-with-a-zero",
      ["Expanded form with a zero", "有 0 的数的展开式"],
      [
        "730 is 7 hundreds and 3 tens, with no ones. In expanded form that is $700 + 30$; the empty ones place is left out.\n\nCheck: $700 + 30 = 730$.\n\n> **Watch out.** The 3 in 730 is 3 tens, worth 30, not 3.",
        "730 是 7 个百和 3 个十，没有一。写成展开式是 $700 + 30$；空着的个位可以不写。\n\n检验：$700 + 30 = 730$。\n\n> **注意。** 730 中的 3 是 3 个十，表示 30，不是 3。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const d = rng.int(1, 9);
        const inTens = rng.bool();
        const part = inTens ? d : 10 * d;
        const n = 100 * h + part;
        return rng.bool()
          ? solved(
              [`What number goes in the box? $${100 * h} + ${part} = \\square$`, `方框里填几？$${100 * h} + ${part} = \\square$`],
              n,
              [
                [
                  ["Read the parts", "读出各部分"],
                  [
                    `${100 * h} is ${many(h, "hundred")} and ${part} is ${inTens ? many(d, "one") : many(d, "ten")}.`,
                    `${100 * h} 是 ${h} 个百，${part} 是 ${d} 个${inTens ? "一" : "十"}。`,
                  ],
                ],
                [
                  ["Write the number", "写出这个数"],
                  [
                    inTens ? `No tens, so the tens digit is 0: ${n}.` : `No ones, so the ones digit is 0: ${n}.`,
                    inTens ? `没有十，十位写 0：${n}。` : `没有一，个位写 0：${n}。`,
                  ],
                ],
              ],
              [`$${n} - ${100 * h} = ${part}$.`, `$${n} - ${100 * h} = ${part}$。`],
              [
                [Number(`${h}${part}`), "That writes the parts side by side and leaves out a 0.", "这把两部分并排写，漏了 0。"],
                [inTens ? 100 * h + 10 * d : 100 * h + d, `That puts the ${d} in the wrong place.`, `这把 ${d} 放错了数位。`],
                [100 * h, `That leaves out the ${part}.`, `这漏了 ${part}。`],
              ],
            )
          : solved(
              [`What number goes in the box? $${n} = ${100 * h} + \\square$`, `方框里填几？$${n} = ${100 * h} + \\square$`],
              part,
              [
                [
                  ["Find the place", "看数位"],
                  [`In ${n}, the ${d} is in the ${inTens ? "ones" : "tens"} place.`, `在 ${n} 中，${d} 在${inTens ? "个位" : "十位"}上。`],
                ],
                [
                  ["Its value", "它表示多少"],
                  [`So it is worth ${part}.`, `所以它表示 ${part}。`],
                ],
              ],
              [`$${100 * h} + ${part} = ${n}$.`, `$${100 * h} + ${part} = ${n}$。`],
              [
                [
                  inTens ? 10 * d : d,
                  `The ${d} is in the ${inTens ? "ones" : "tens"} place, so it is worth ${part}.`,
                  `${d} 在${inTens ? "个位" : "十位"}上，所以表示 ${part}。`,
                ],
                [n, "That is the whole number. The box is only the part left.", "这是整个数。方框里只是剩下的部分。"],
                [100 * d, `That puts the ${d} in the hundreds place.`, `这把 ${d} 放到了百位。`],
              ],
            );
      },
      captioned(blockRowsFigure([[7, 3, 0]]), "730: 7 hundreds and 3 tens, so 700 + 30.", "730：7 个百和 3 个十，所以是 700 + 30。"),
    ),
  ],
  [
    "A house number reads 503. The 0 sits in the tens place and keeps the 5 among the hundreds.\n\nCheck: without the 0 it would read 53, a much smaller number.\n\nIn this lesson we read and write numbers with a zero in the tens or ones place.",
    "一个门牌号是 503。0 在十位上，让 5 留在百位上。\n\n检验：没有这个 0，就成了 53，小得多。\n\n本课我们读写十位或个位上有 0 的数。",
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
        "13 tens: bundle ten of them into 1 hundred, and 3 tens are left. 1 hundred and 3 tens make 130.\n\nCheck: count by tens 13 times: 10, 20, …, 130.\n\n> **Watch out.** 13 tens is 130, not 13. Each ten is worth 10.",
        "13 个十：把其中十个捆成 1 个百，还剩 3 个十。1 个百和 3 个十是 130。\n\n检验：十个十个地数 13 次：10、20……130。\n\n> **注意。** 13 个十是 130，不是 13。每个十表示 10。",
      ],
      (rng) => {
        const tens = rng.int(11, 39);
        const hh = Math.floor(tens / 10);
        const tt = tens % 10;
        return solved(
          [`What number is ${many(tens, "ten")}?`, `${tens} 个十是多少？`],
          10 * tens,
          [
            [
              ["Bundle ten tens", "十个十捆成百"],
              [`${tens} tens are ${many(hh, "hundred")} and ${many(tt, "ten")}.`, `${tens} 个十是 ${hh} 个百和 ${tt} 个十。`],
            ],
            [
              ["Write the number", "写出这个数"],
              ["Hundreds and tens together:", "百和十合起来："],
              [`${100 * hh} + ${10 * tt} = ${10 * tens}`],
            ],
          ],
          [`Count by tens: ${tens} tens reach ${10 * tens}.`, `十个十个地数，${tens} 个十数到 ${10 * tens}。`],
          [
            [tens, "That counts the tens as ones. Each ten is worth 10.", "这把十当成了一。每个十表示 10。"],
            [100 + tens, "That writes 100 and the tens side by side.", "这把 100 和十的个数凑在一起了。"],
            [100 * tens, "That treats each ten as a hundred.", "这把每个十当成了一百。"],
          ],
          tens < 20 ? blockRowsFigure([[0, tens, 0]]) : undefined,
        );
      },
      captioned(
        blockRowsFigure([[0, 13, 0]]),
        "13 tens: ten of them make 1 hundred, with 3 tens left, 130.",
        "13 个十：其中十个是 1 个百，还剩 3 个十，是 130。",
      ),
    ),
    earlyPoint(
      "hundreds-as-tens",
      ["Hundreds as tens", "把百看成十"],
      [
        "420 has 4 hundreds and 2 tens. Each hundred is 10 tens, so 4 hundreds are 40 tens. With the 2 extra tens that makes $40 + 2 = 42$ tens.\n\nCheck: 42 tens is $420$, counting by tens.\n\n> **Watch out.** The tens digit of 420 is 2, but there are 42 tens in all. Count the tens inside the hundreds too.",
        "420 有 4 个百和 2 个十。每个百是 10 个十，所以 4 个百是 40 个十。加上多出的 2 个十，一共 $40 + 2 = 42$ 个十。\n\n检验：十个十个地数，42 个十是 420。\n\n> **注意。** 420 的十位是 2，但一共有 42 个十。百里面的十也要数。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const extra = rng.bool() ? rng.int(1, 9) : 0;
        const n = 100 * h + 10 * extra;
        const answer = 10 * h + extra;
        return solved(
          [`How many tens are in ${n} altogether?`, `${n} 一共有多少个十？`],
          answer,
          [
            [
              ["Tens in the hundreds", "百里面的十"],
              [
                `Each hundred is 10 tens, so ${many(h, "hundred")} ${h === 1 ? "is" : "are"} ${10 * h} tens.`,
                `每个百是 10 个十，所以 ${h} 个百是 ${10 * h} 个十。`,
              ],
            ],
            [
              ["Add the extra tens", "加上多出的十"],
              [extra ? `${extra} more tens:` : "There are no extra tens:", extra ? `再加 ${extra} 个十：` : "没有多出的十："],
              [`${10 * h} + ${extra} = ${answer}`],
            ],
          ],
          [`${answer} tens make ${n}, counting by tens.`, `十个十个地数，${answer} 个十是 ${n}。`],
          [
            [h, "That counts hundreds, not tens.", "这数的是百，不是十。"],
            [
              extra === 0 ? 100 * h : extra,
              extra === 0
                ? "That is the number itself, not how many tens."
                : "That is only the tens digit. Count the tens in the hundreds too.",
              extra === 0 ? "这是这个数本身，不是十的个数。" : "这只是十位上的数。百里面的十也要数。",
            ],
            [n, "That is the number itself, not how many tens.", "这是这个数本身，不是十的个数。"],
          ],
          blockRowsFigure([[h, extra, 0]]),
        );
      },
      captioned(
        blockRowsFigure([[4, 2, 0]]),
        "420: 4 hundreds are 40 tens, and 2 more make 42 tens.",
        "420：4 个百是 40 个十，再加 2 个，是 42 个十。",
      ),
    ),
    earlyPoint(
      "tidying-up-extra-tens",
      ["Tidying up extra tens", "把多出来的十整理好"],
      [
        "2 hundreds, 14 tens and 3 ones: trade 10 of the tens for 1 more hundred. That leaves 3 hundreds, 4 tens and 3 ones, which is 343.\n\nCheck: $200 + 140 + 3 = 343$.\n\n> **Watch out.** Do not write the counts side by side. 2143 is far too large.",
        "2 个百、14 个十和 3 个一：用其中 10 个十换 1 个百。就是 3 个百、4 个十和 3 个一，也就是 343。\n\n检验：$200 + 140 + 3 = 343$。\n\n> **注意。** 不要把几个数并排写出来。2143 太大了。",
      ],
      (rng) => {
        const h = rng.int(1, 7);
        const tens = rng.int(11, 19);
        const o = rng.int(1, 9);
        const n = 100 * h + 10 * tens + o;
        return solved(
          [
            `What number has ${many(h, "hundred")}, ${many(tens, "ten")} and ${many(o, "one")}?`,
            `${h} 个百、${tens} 个十和 ${o} 个一是多少？`,
          ],
          n,
          [
            [
              ["Trade ten tens", "十个十换一个百"],
              [
                `10 of the ${tens} tens make 1 more hundred: ${many(h + 1, "hundred")} and ${many(tens - 10, "ten")}.`,
                `${tens} 个十中的 10 个换成 1 个百：${h + 1} 个百和 ${tens - 10} 个十。`,
              ],
            ],
            [
              ["Write the number", "写出这个数"],
              [`${h + 1} hundreds, ${tens - 10} tens, ${o} ones:`, `${h + 1} 个百、${tens - 10} 个十、${o} 个一：`],
              [`${100 * (h + 1)} + ${10 * (tens - 10)} + ${o} = ${n}`],
            ],
          ],
          [`$${100 * h} + ${10 * tens} + ${o} = ${n}$.`, `$${100 * h} + ${10 * tens} + ${o} = ${n}$。`],
          [
            [Number(`${h}${tens}${o}`), "That writes the counts side by side.", "这把几个数并排写了。"],
            [
              100 * h + 10 * (tens - 10) + o,
              "That drops the ten tens instead of trading them for a hundred.",
              "这把十个十丢了，没有换成一个百。",
            ],
            [h + tens + o, "That adds the counts instead of their values.", "这把个数相加了，没有按数值算。"],
          ],
          blockRowsFigure([[h, tens, o]]),
        );
      },
      captioned(
        blockRowsFigure([[2, 14, 3]]),
        "2 hundreds, 14 tens and 3 ones: ten tens make another hundred, so 343.",
        "2 个百、14 个十、3 个一：十个十换一个百，是 343。",
      ),
    ),
  ],
  [
    "A shop packs pencils in boxes of 10 and crates of 100. 10 boxes fill a crate, so 13 boxes are 1 crate and 3 boxes: 130 pencils.\n\nCheck: $100 + 30 = 130$.\n\nIn this lesson we trade ten tens for a hundred, and a hundred for ten tens.",
    "商店把铅笔 10 支装一盒，100 支装一箱。10 盒装满一箱，所以 13 盒是 1 箱和 3 盒：130 支铅笔。\n\n检验：$100 + 30 = 130$。\n\n本课我们用十个十换一个百，用一个百换十个十。",
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
        "On this line each space is worth 100. The dot is 3 spaces past 0, so count by hundreds: 100, 200, 300. The dot shows 300.\n\nCheck: $100 + 100 + 100 = 300$.\n\n> **Watch out.** Each space is 100, not 1. Reading 3 spaces as 3 is far too small.",
        "这条数轴每格是 100。点在 0 后面第 3 格，一百一百地数：100、200、300。这个点表示 300。\n\n检验：$100 + 100 + 100 = 300$。\n\n> **注意。** 每格是 100，不是 1。把 3 格读成 3 就太小了。",
      ],
      (rng) => {
        const lo = 100 * rng.int(0, 3);
        const hi = lo + 100 * rng.int(5, 7);
        const k = rng.int(1, (hi - lo) / 100 - 1);
        const mark = lo + 100 * k;
        const counts = Array.from({ length: k }, (_, j) => lo + 100 * (j + 1));
        return solved(
          ["Each space is worth 100. What number does the dot show?", "每格是 100。这个点表示什么数？"],
          mark,
          [
            [
              ["Count the spaces", "数格子"],
              [`The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}.`, `点在 ${lo} 后面第 ${k} 格。`],
            ],
            [["Count by hundreds", "一百一百地数"], [`From ${lo}:`, `从 ${lo} 开始：`], [counts.join(", ")]],
          ],
          [`$${mark} - ${lo} = ${100 * k}$, which is ${k} hundreds.`, `$${mark} - ${lo} = ${100 * k}$，正是 ${k} 个百。`],
          [
            [lo + k, "That counts each space as 1. Each is 100.", "这把每格当成 1。每格是 100。"],
            [lo + 10 * k, "That counts each space as 10. Each is 100.", "这把每格当成 10。每格是 100。"],
            [mark + 100, "That is one space too far.", "多数了一格。"],
          ],
          numberLineFigure(lo, hi, 100, mark, false),
        );
      },
      captioned(numberLineFigure(0, 600, 100, 300), "A line marked by hundreds with a dot at 300.", "按百标记的数轴，点在 300。"),
    ),
    earlyPoint(
      "lines-marked-by-tens",
      ["Lines marked by tens", "每格是十的数轴"],
      [
        "A line runs from 300 to 400 with 10 spaces, so each space is worth 10. The dot is 4 spaces past 300: 310, 320, 330, 340. It shows 340.\n\nCheck: count back from 400 by tens, 390, 380, …, and the dot is 6 spaces before 400: $400 - 60 = 340$.\n\n> **Watch out.** Each space is 10, not 1. 304 would be far too close to 300.",
        "数轴从 300 到 400，有 10 格，所以每格是 10。点在 300 后面第 4 格：310、320、330、340。它表示 340。\n\n检验：从 400 往回十个十个地数，点在 400 前面第 6 格：$400 - 60 = 340$。\n\n> **注意。** 每格是 10，不是 1。304 离 300 太近了。",
      ],
      (rng) => {
        const lo = 100 * rng.int(0, 9);
        const k = rng.int(1, 9);
        const mark = lo + 10 * k;
        const counts = Array.from({ length: k }, (_, j) => lo + 10 * (j + 1));
        return solved(
          ["What number does the dot show?", "这个点表示什么数？"],
          mark,
          [
            [
              ["What a space is worth", "每格是多少"],
              [`From ${lo} to ${lo + 100} there are 10 spaces, so each is worth 10.`, `从 ${lo} 到 ${lo + 100} 有 10 格，所以每格是 10。`],
            ],
            [
              ["Count by tens", "十个十个地数"],
              [`The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}:`, `点在 ${lo} 后面第 ${k} 格：`],
              [counts.join(", ")],
            ],
          ],
          [`From the other end: $${lo + 100} - ${10 * (10 - k)} = ${mark}$.`, `从另一端算：$${lo + 100} - ${10 * (10 - k)} = ${mark}$。`],
          [
            [lo + k, "That counts each space as 1. Each is 10.", "这把每格当成 1。每格是 10。"],
            [lo + 100 - 10 * k, "That counts the spaces from the wrong end.", "这是从另一端数的格子。"],
            [mark + 100, "That puts the dot in the next hundred.", "这把点放到了下一个百里。"],
          ],
          numberLineFigure(lo, lo + 100, 10, mark, false),
        );
      },
      captioned(
        numberLineFigure(300, 400, 10, 340, false),
        "A line from 300 to 400 marked by tens, with a dot at 340.",
        "从 300 到 400 按十标记的数轴，点在 340。",
      ),
    ),
    earlyPoint(
      "finding-what-a-space-is-worth",
      ["Finding what a space is worth", "先看每格是多少"],
      [
        "A line runs from 150 to 200 with 10 spaces. The ends are $200 - 150 = 50$ apart, and 50 shared among 10 spaces is 5 each. The dot is 3 spaces past 150: 155, 160, 165.\n\nCheck: $5 + 5 + 5 = 15$ and $150 + 15 = 165$.\n\n> **Watch out.** Work out what a space is worth first. Here it is 5, not 1 or 10.",
        "数轴从 150 到 200，有 10 格。两端相差 $200 - 150 = 50$，50 分给 10 格，每格是 5。点在 150 后面第 3 格：155、160、165。\n\n检验：$5 + 5 + 5 = 15$，$150 + 15 = 165$。\n\n> **注意。** 先算出每格是多少。这里是 5，不是 1，也不是 10。",
      ],
      (rng) => {
        const step = rng.pick([1, 5]);
        const lo = 50 * rng.int(0, 18);
        const k = rng.int(1, 9);
        const mark = lo + step * k;
        const counts = Array.from({ length: k }, (_, j) => lo + step * (j + 1));
        return solved(
          ["What number does the dot show?", "这个点表示什么数？"],
          mark,
          [
            [
              ["What a space is worth", "每格是多少"],
              [
                `The ends are ${10 * step} apart with 10 spaces, so each space is worth ${step}.`,
                `两端相差 ${10 * step}，有 10 格，所以每格是 ${step}。`,
              ],
            ],
            [
              ["Count along", "一格一格数"],
              [`The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}:`, `点在 ${lo} 后面第 ${k} 格：`],
              [counts.join(", ")],
            ],
          ],
          [
            `$${mark} - ${lo} = ${step * k}$, which is ${k} spaces of ${step}.`,
            `$${mark} - ${lo} = ${step * k}$，正是 ${k} 格，每格 ${step}。`,
          ],
          [
            [
              lo + (step === 1 ? 5 * k : k),
              step === 1 ? "That counts each space as 5. Each is 1." : "That counts each space as 1. Each is 5.",
              step === 1 ? "这把每格当成 5。每格是 1。" : "这把每格当成 1。每格是 5。",
            ],
            [lo + 10 * k, `That counts each space as 10. Each is ${step}.`, `这把每格当成 10。每格是 ${step}。`],
            [mark + step, "That is one space too far.", "多数了一格。"],
          ],
          numberLineFigure(lo, lo + 10 * step, step, mark, false),
        );
      },
      captioned(
        numberLineFigure(150, 200, 5, 165, false),
        "A line from 150 to 200 with spaces of 5, and a dot at 165.",
        "从 150 到 200 的数轴，每格是 5，点在 165。",
      ),
    ),
  ],
  [
    "A long road has a sign every 100 meters, from 0 to 1000. A bike stops at the third sign past 0, so it has gone 300 meters.\n\nCheck: $100 + 100 + 100 = 300$.\n\nIn this lesson we read points on number lines marked by hundreds, tens, fives and ones.",
    "一条长路每 100 米有一块牌子，从 0 到 1000。自行车停在 0 后面的第 3 块牌子，所以走了 300 米。\n\n检验：$100 + 100 + 100 = 300$。\n\n本课我们读出按百、十、五和一标记的数轴上的点。",
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
        "Order 524, 254 and 245. Compare the hundreds: 2, 2 and 5, so 524 is the greatest. 254 and 245 have the same hundreds, so compare the tens: 4 is less than 5. Least to greatest: 245, 254, 524.\n\nCheck: on a number line 245 comes first, then 254, then 524.\n\n> **Watch out.** Compare the hundreds first. Looking at the ones first would put 524 before 245.",
        "给 524、254、245 排序。先比百位：2、2、5，所以 524 最大。254 和 245 百位相同，再比十位：4 比 5 小。从小到大是：245、254、524。\n\n检验：在数轴上，245 在最前，然后是 254，再是 524。\n\n> **注意。** 先比百位。如果先比个位，就会把 524 排在 245 前面。",
      ],
      (rng) => {
        const [x, y, z] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3) as [number, number, number];
        const all = [100 * x + 10 * y + z, 100 * y + 10 * x + z, 100 * x + 10 * z + y];
        const [p, q, r] = [...all].sort((a, b) => a - b) as [number, number, number];
        const greatestFirst = rng.bool();
        const list = (a: number, b: number, c: number) => `${a},\\ ${b},\\ ${c}`;
        const wrongs: MathWrong[] = greatestFirst
          ? [
              [list(p, q, r), "That goes from least to greatest.", "这是从小到大排列的。"],
              [list(q, r, p), `${r} is the greatest, so it comes first.`, `${r} 最大，应该排在最前面。`],
              [list(r, p, q), `${q} is greater than ${p}.`, `${q} 比 ${p} 大。`],
            ]
          : [
              [list(r, q, p), "That goes from greatest to least.", "这是从大到小排列的。"],
              [list(q, p, r), `${p} is the least, so it comes first.`, `${p} 最小，应该排在最前面。`],
              [list(p, r, q), `${q} is less than ${r}.`, `${q} 比 ${r} 小。`],
            ];
        return pickedMath(
          rng,
          greatestFirst
            ? ["Which list goes from greatest to least?", "哪一组是从大到小排列的？"]
            : ["Which list goes from least to greatest?", "哪一组是从小到大排列的？"],
          greatestFirst ? list(r, q, p) : list(p, q, r),
          wrongs,
          [
            [
              ["Compare the hundreds", "比百位"],
              ["Look at the hundreds digits first, then the tens if they match.", "先比百位，百位相同再比十位。"],
            ],
            [
              ["Put them in order", "排顺序"],
              [`${p} is the least and ${r} is the greatest, with ${q} between.`, `${p} 最小，${r} 最大，${q} 在中间。`],
            ],
          ],
          [`$${p} < ${q}$ and $${q} < ${r}$.`, `$${p} < ${q}$，$${q} < ${r}$。`],
        );
      },
      captioned(
        numberLineFigure(200, 600, 100, 245, false),
        "245 and 254 sit just past 200; 524 is past 500.",
        "245 和 254 都在 200 后面不远；524 在 500 后面。",
      ),
    ),
    earlyPoint(
      "building-the-greatest-number",
      ["Building the greatest and least numbers", "组成最大和最小的数"],
      [
        "Use 3, 8 and 5 once each. For the greatest number, put the largest digit, 8, in the hundreds place, then 5, then 3: 853.\n\nCheck: every other order, such as 835 or 583, is less than 853.\n\n> **Watch out.** The hundreds place counts most, so the biggest digit goes there, not in the ones place.",
        "3、8、5 各用一次。要组成最大的数，就把最大的数字 8 放在百位，然后是 5，再是 3：853。\n\n检验：其他排法，比如 835、583，都比 853 小。\n\n> **注意。** 百位最重要，所以最大的数字放在百位，不是个位。",
      ],
      (rng) => {
        const digits = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
        const [a, b, c] = [...digits].sort((x, y) => y - x) as [number, number, number];
        const big = rng.bool();
        const answer = big ? 100 * a + 10 * b + c : 100 * c + 10 * b + a;
        return solved(
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
          [
            [
              ["Sort the digits", "给数字排序"],
              big
                ? [`Largest to smallest: ${a}, ${b}, ${c}.`, `从大到小：${a}、${b}、${c}。`]
                : [`Smallest to largest: ${c}, ${b}, ${a}.`, `从小到大：${c}、${b}、${a}。`],
            ],
            [
              ["Fill the places", "按数位放"],
              [`Hundreds, tens, ones in that order: ${answer}.`, `依次放在百位、十位、个位：${answer}。`],
            ],
          ],
          big
            ? [
                `Swapping any two digits gives less, such as ${100 * a + 10 * c + b}.`,
                `交换任意两个数字都会变小，比如 ${100 * a + 10 * c + b}。`,
              ]
            : [
                `Swapping any two digits gives more, such as ${100 * c + 10 * a + b}.`,
                `交换任意两个数字都会变大，比如 ${100 * c + 10 * a + b}。`,
              ],
          big
            ? [
                [100 * c + 10 * b + a, "That is the least number, not the greatest.", "这是最小的数，不是最大的。"],
                [100 * a + 10 * c + b, `${b} is larger than ${c}, so it goes in the tens place.`, `${b} 比 ${c} 大，应该放在十位。`],
                [100 * b + 10 * a + c, `${a} is the largest digit, so it goes in the hundreds place.`, `${a} 是最大的数字，应该放在百位。`],
              ]
            : [
                [100 * a + 10 * b + c, "That is the greatest number, not the least.", "这是最大的数，不是最小的。"],
                [100 * c + 10 * a + b, `${b} is smaller than ${a}, so it goes in the tens place.`, `${b} 比 ${a} 小，应该放在十位。`],
                [
                  100 * b + 10 * c + a,
                  `${c} is the smallest digit, so it goes in the hundreds place.`,
                  `${c} 是最小的数字，应该放在百位。`,
                ],
              ],
        );
      },
      captioned(blockRowsFigure([[8, 5, 3]]), "853: the largest digit, 8, in the hundreds place.", "853：最大的数字 8 放在百位。"),
    ),
    earlyPoint(
      "comparing-rows-with-hundreds",
      ["Comparing rows with hundreds", "比较有百的两排积木"],
      [
        "The top row is 2 hundreds, 9 tens and 8 ones, 298. The bottom row is 3 hundreds and 1 ten, 310. 3 hundreds is more than 2, so the bottom row is greater.\n\nCheck: $310 - 298 = 12$, so 310 is more.\n\n> **Watch out.** Compare the hundreds first. The top row has more rods and small squares, but fewer hundreds.",
        "上面一排是 2 个百、9 个十、8 个一，是 298。下面一排是 3 个百和 1 个十，是 310。3 个百比 2 个百多，所以下面一排更大。\n\n检验：$310 - 298 = 12$，所以 310 更大。\n\n> **注意。** 先比百。上面一排长条和小方块多，但百少。",
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
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        const decide: Pair = sameH
          ? [
              `The hundreds match, so compare the tens: ${Math.max(t1, t2)} is more than ${Math.min(t1, t2)}.`,
              `百一样多，再比十：${Math.max(t1, t2)} 比 ${Math.min(t1, t2)} 多。`,
            ]
          : [`${Math.max(h1, h2)} hundreds is more than ${Math.min(h1, h2)}.`, `${Math.max(h1, h2)} 个百比 ${Math.min(h1, h2)} 个百多。`];
        return picked(
          rng,
          ["Which row of blocks shows the greater number?", "哪一排积木表示的数更大？"],
          a > b ? top : bottom,
          [
            [a > b ? bottom : top, `That row shows ${small}, which is less than ${big}.`, `那一排表示 ${small}，比 ${big} 小。`],
            [both, `The rows show ${a} and ${b}, which are not the same.`, `两排分别表示 ${a} 和 ${b}，不一样大。`],
          ],
          [
            [
              ["Read each row", "读出每一排"],
              [`The top row shows ${a} and the bottom row shows ${b}.`, `上面一排表示 ${a}，下面一排表示 ${b}。`],
            ],
            [["Compare", "比较"], decide],
          ],
          [`$${big} - ${small} = ${big - small}$, so ${big} is more.`, `$${big} - ${small} = ${big - small}$，所以 ${big} 更大。`],
          blockRowsFigure([
            [h1, t1, o1],
            [h2, t2, o2],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [2, 9, 8],
          [3, 1, 0],
        ]),
        "Top row 298, bottom row 310: the bottom row has more hundreds.",
        "上面一排 298，下面一排 310：下面一排的百更多。",
      ),
    ),
  ],
  [
    "Three classes collect cans: 245, 254 and 524. To see who collected most, look at the hundreds first: 5 hundreds beats 2.\n\nCheck: 524 is more than 500, and the other two are less than 300.\n\nIn this lesson we put three-digit numbers in order and build the greatest and least numbers from digits.",
    "三个班收集易拉罐：245、254、524 个。要看哪个班最多，先看百位：5 个百比 2 个百多。\n\n检验：524 比 500 多，另外两个都不到 300。\n\n本课我们给三位数排序，并用数字组成最大和最小的数。",
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
        "Put 11 counters in pairs: 5 full pairs use 10 of them, and 1 counter has no partner. So 11 is odd.\n\nCheck: $5 + 5 + 1 = 11$.\n\n> **Watch out.** At most 1 can be left over. Two left over would make another pair.",
        "把 11 个圆片两个两个地配对：5 对用了 10 个，还有 1 个没有伙伴。所以 11 是奇数。\n\n检验：$5 + 5 + 1 = 11$。\n\n> **注意。** 最多只能剩 1 个。剩 2 个就又能配成一对。",
      ],
      (rng) => {
        const n = rng.int(5, 21);
        const pairs = Math.floor(n / 2);
        const left = n % 2;
        if (rng.bool())
          return solved(
            ["The counters are placed in pairs. How many full pairs are there?", "这些圆片两个两个地配对。可以配成多少对？"],
            pairs,
            [
              [
                ["Count in twos", "两个两个地数"],
                [`Each pair uses 2 counters, and there are ${n} counters.`, `每对用 2 个圆片，一共有 ${n} 个。`],
              ],
              [
                ["Count the pairs", "数对数"],
                [`${pairs} full pairs use ${2 * pairs}, with ${left} left over.`, `${pairs} 对用了 ${2 * pairs} 个，剩下 ${left} 个。`],
              ],
            ],
            [`$${pairs} + ${pairs}${left ? " + 1" : ""} = ${n}$.`, `$${pairs} + ${pairs}${left ? " + 1" : ""} = ${n}$。`],
            [
              [n, "That counts the counters, not the pairs.", "这数的是圆片，不是对数。"],
              [n - 2, "That counts counters, not pairs.", "这数的是圆片，不是对数。"],
              [
                pairs + 1,
                left ? "That counts the counter with no partner as a pair." : "That is one pair too many.",
                left ? "这把没有伙伴的那个也算成了一对。" : "多数了一对。",
              ],
            ],
            countersFigure(n, 2),
          );
        return solved(
          ["The counters are placed in pairs. How many have no partner?", "这些圆片两个两个地配对。有多少个没有伙伴？"],
          left,
          [
            [
              ["Make pairs", "配对"],
              [`${n} counters make ${pairs} pairs, using ${2 * pairs}.`, `${n} 个圆片配成 ${pairs} 对，用了 ${2 * pairs} 个。`],
            ],
            [
              ["Look for one alone", "找落单的"],
              [
                left ? `1 counter is left with no partner, so ${n} is odd.` : `Every counter has a partner, so ${n} is even.`,
                left ? `剩下 1 个没有伙伴，所以 ${n} 是奇数。` : `每个圆片都有伙伴，所以 ${n} 是偶数。`,
              ],
            ],
          ],
          [`$${pairs} + ${pairs}${left ? " + 1" : ""} = ${n}$.`, `$${pairs} + ${pairs}${left ? " + 1" : ""} = ${n}$。`],
          [
            [
              left ? 0 : 1,
              left ? `${n} is odd, so one counter is left.` : `${n} is even, so none are left.`,
              left ? `${n} 是奇数，所以剩 1 个。` : `${n} 是偶数，所以一个也不剩。`,
            ],
            [2, "Two left over would make another pair.", "剩 2 个就又能配成一对。"],
            [pairs, "That is the number of pairs, not the ones left alone.", "这是对数，不是落单的个数。"],
          ],
          countersFigure(n, 2),
        );
      },
      captioned(countersFigure(11, 2), "11 counters in pairs: 5 pairs and 1 left alone.", "11 个圆片配对：5 对，还剩 1 个。"),
    ),
    earlyPoint(
      "sharing-an-even-number-into-two",
      ["Sharing an even number into two", "把偶数平均分成两份"],
      [
        "Split 46 into two equal numbers. Half of 40 is 20 and half of 6 is 3, so each part is 23.\n\nCheck: $23 + 23 = 46$.\n\n> **Watch out.** The two numbers must be the same. $20 + 26$ makes 46 but the parts are not equal.",
        "把 46 分成两个相同的数。40 的一半是 20，6 的一半是 3，所以每份是 23。\n\n检验：$23 + 23 = 46$。\n\n> **注意。** 两个数必须相同。$20 + 26$ 也是 46，但两份不相等。",
      ],
      (rng) => {
        const half = rng.int(3, 48);
        const n = 2 * half;
        const t = Math.floor(n / 10) * 10;
        const o = n % 10;
        const even = t % 20 === 0 && o % 2 === 0;
        return solved(
          [
            `The same number goes in both boxes. What is it? $${n} = \\square + \\square$`,
            `两个方框里填相同的数。填几？$${n} = \\square + \\square$`,
          ],
          half,
          even
            ? [
                [
                  ["Split tens and ones", "分开十和一"],
                  [`${n} is ${t} and ${o}.`, `${n} 是 ${t} 和 ${o}。`],
                ],
                [
                  ["Halve each part", "每部分分一半"],
                  [`Half of ${t} is ${t / 2} and half of ${o} is ${o / 2}:`, `${t} 的一半是 ${t / 2}，${o} 的一半是 ${o / 2}：`],
                  [`${t / 2} + ${o / 2} = ${half}`],
                ],
              ]
            : [
                [
                  ["Think of a double", "想一个数加它自己"],
                  [`Which number added to itself makes ${n}?`, `哪个数加上它自己等于 ${n}？`],
                ],
                [["Try it", "试一试"], [`${half} and ${half}:`, `${half} 和 ${half}：`], [`${half} + ${half} = ${n}`]],
              ],
          [`$${half} + ${half} = ${n}$.`, `$${half} + ${half} = ${n}$。`],
          [
            [n, "That is the whole number. Each box holds half of it.", "这是整个数。每个方框里只是它的一半。"],
            [2 * n, "That doubles the number instead of halving it.", "这是把数翻倍了，不是分一半。"],
            [half + 1, `${half + 1} + ${half + 1} = ${n + 2}, which is too much.`, `${half + 1} + ${half + 1} = ${n + 2}，太多了。`],
          ],
        );
      },
      captioned(partWholeBarFigure([23, 23], -1), "46 split into two equal parts of 23.", "46 分成两个相同的部分，每份 23。"),
    ),
    earlyPoint(
      "the-equal-pair-for-an-even-number",
      ["The equal pair for an even number", "找出相同的两个加数"],
      [
        "$9 + 9 = 18$ uses two equal numbers, so it shows that 18 is even.\n\nCheck: 18 counters make 9 pairs, with none left.\n\n> **Watch out.** $8 + 10$ also makes 18, but its two numbers are not equal.",
        "$9 + 9 = 18$ 用了两个相同的数，所以说明 18 是偶数。\n\n检验：18 个圆片能配成 9 对，一个也不剩。\n\n> **注意。** $8 + 10$ 也是 18，但两个加数不相同。",
      ],
      (rng) => {
        const half = rng.int(3, 30);
        const n = 2 * half;
        return pickedMath(
          rng,
          [`Which sum uses two equal numbers to make ${n}?`, `哪个算式用两个相同的数得到 ${n}？`],
          `${half} + ${half}`,
          [
            [
              `${half - 1} + ${half + 1}`,
              `This makes ${n}, but ${half - 1} and ${half + 1} are not equal.`,
              `和是 ${n}，但 ${half - 1} 和 ${half + 1} 不相同。`,
            ],
            [
              `${half + 1} + ${half + 1}`,
              `The numbers are equal, but they make ${n + 2}, not ${n}.`,
              `两个数相同，但和是 ${n + 2}，不是 ${n}。`,
            ],
            [
              `${half - 1} + ${half - 1}`,
              `The numbers are equal, but they make ${n - 2}, not ${n}.`,
              `两个数相同，但和是 ${n - 2}，不是 ${n}。`,
            ],
            [`${n} + ${n}`, `This makes ${2 * n}, not ${n}.`, `和是 ${2 * n}，不是 ${n}。`],
          ],
          [
            [
              ["Halve the number", "取一半"],
              [`Half of ${n} is ${half}.`, `${n} 的一半是 ${half}。`],
            ],
            [["Write the double", "写出相同的两个数"], [`${half} added to itself:`, `${half} 加 ${half}：`], [`${half} + ${half} = ${n}`]],
          ],
          [`${n} counters make ${half} pairs, with none left.`, `${n} 个圆片能配成 ${half} 对，一个也不剩。`],
        );
      },
      captioned(countersFigure(18, 2), "18 counters make 9 pairs: 9 + 9 = 18.", "18 个圆片配成 9 对：9 + 9 = 18。"),
    ),
  ],
  [
    "Twelve children line up in pairs for a walk. Every child has a partner, so 12 is even.\n\nCheck: 6 pairs, and $6 + 6 = 12$.\n\nIn this lesson we pair up objects to tell even from odd, and write even numbers as doubles.",
    "十二个孩子两人一组排队去散步。每个孩子都有伙伴，所以 12 是偶数。\n\n检验：6 对，$6 + 6 = 12$。\n\n本课我们配对来分辨奇偶，并把偶数写成两个相同的数相加。",
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
        "This array has 3 rows, and each row has 5 dots. Adding the rows means adding 5 once for each row: $5 + 5 + 5 = 15$.\n\nCheck: count all the dots: 15.\n\n> **Watch out.** $3 + 3 + 3 + 3 + 3$ adds the columns, not the rows.",
        "这个阵列有 3 行，每行 5 个点。按行相加，就是有几行就加几次 5：$5 + 5 + 5 = 15$。\n\n检验：数所有的点：15 个。\n\n> **注意。** $3 + 3 + 3 + 3 + 3$ 是按列相加，不是按行。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const cols = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        return pickedMath(
          rng,
          ["Which addition adds the rows of this array?", "哪个加法是按行相加的？"],
          repeatSum(cols, rows),
          [
            [
              repeatSum(rows, cols),
              `This adds the columns, with ${rows} in each. Adding the rows uses the ${cols} dots in each row.`,
              `这是把列加起来，每列 ${rows} 个。把行加起来要用每行的 ${cols} 个点。`,
            ],
            [
              `${rows} + ${cols}`,
              "This adds the number of rows and the number in a row, not the dots in every row.",
              "这是把行数和每行的个数相加，不是把每一行的点加起来。",
            ],
            [repeatSum(cols, rows + 1), `This has one addend too many: there are ${rows} rows.`, `这里多了一个加数：只有 ${rows} 行。`],
            [repeatSum(cols + 1, rows), `Each row has ${cols} dots, not ${cols + 1}.`, `每行有 ${cols} 个点，不是 ${cols + 1} 个。`],
          ],
          [
            [
              ["Count one row", "数一行"],
              [`Each row has ${cols} dots.`, `每行有 ${cols} 个点。`],
            ],
            [
              ["One addend per row", "每行一个加数"],
              [`There are ${rows} rows, so add ${cols} ${rows} times:`, `有 ${rows} 行，就加 ${rows} 次 ${cols}：`],
              [`${repeatSum(cols, rows)} = ${rows * cols}`],
            ],
          ],
          [`Count all the dots: ${rows * cols}.`, `数所有的点：${rows * cols} 个。`],
          arrayFigure(rows, cols),
        );
      },
      captioned(arrayFigure(3, 5), "3 rows of 5: 5 + 5 + 5 = 15.", "3 行，每行 5 个：5 + 5 + 5 = 15。"),
    ),
    earlyPoint(
      "adding-the-columns",
      ["Adding the columns", "按列相加"],
      [
        "The same array of 3 rows of 5 has 5 columns, with 3 dots in each. Adding the columns: $3 + 3 + 3 + 3 + 3 = 15$.\n\nCheck: adding the rows, $5 + 5 + 5$, also gives 15.\n\n> **Watch out.** Columns go up and down. Each addend is the dots in one column, 3, not in one row.",
        "同样是 3 行、每行 5 个的阵列，有 5 列，每列 3 个点。按列相加：$3 + 3 + 3 + 3 + 3 = 15$。\n\n检验：按行相加，$5 + 5 + 5$，也是 15。\n\n> **注意。** 列是竖着的。每个加数是一列的点数 3，不是一行的点数。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const cols = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        return pickedMath(
          rng,
          ["Which addition adds the columns of this array?", "哪个加法是按列相加的？"],
          repeatSum(rows, cols),
          [
            [repeatSum(cols, rows), `This adds the rows, with ${cols} in each.`, `这是按行相加，每行 ${cols} 个。`],
            [`${rows} + ${cols}`, "This adds the number of rows and columns, not the dots.", "这是把行数和列数相加，不是把点加起来。"],
            [repeatSum(rows, cols + 1), `This has one addend too many: there are ${cols} columns.`, `这里多了一个加数：只有 ${cols} 列。`],
            [repeatSum(rows + 1, cols), `Each column has ${rows} dots, not ${rows + 1}.`, `每列有 ${rows} 个点，不是 ${rows + 1} 个。`],
          ],
          [
            [
              ["Count one column", "数一列"],
              [`Each column has ${rows} dots.`, `每列有 ${rows} 个点。`],
            ],
            [
              ["One addend per column", "每列一个加数"],
              [`There are ${cols} columns, so add ${rows} ${cols} times:`, `有 ${cols} 列，就加 ${cols} 次 ${rows}：`],
              [`${repeatSum(rows, cols)} = ${rows * cols}`],
            ],
          ],
          [
            `Adding the rows gives the same total: $${repeatSum(cols, rows)} = ${rows * cols}$.`,
            `按行相加，总数一样：$${repeatSum(cols, rows)} = ${rows * cols}$。`,
          ],
          arrayFigure(rows, cols),
        );
      },
      captioned(arrayFigure(3, 5), "5 columns of 3: 3 + 3 + 3 + 3 + 3 = 15.", "5 列，每列 3 个：3 + 3 + 3 + 3 + 3 = 15。"),
    ),
    earlyPoint(
      "the-total-of-an-array",
      ["The total of an array", "阵列的总数"],
      [
        "An array has 4 rows of 5. Count by fives along the rows: 5, 10, 15, 20. There are 20 in all.\n\nCheck: count by fours down the 5 columns: 4, 8, 12, 16, 20.\n\n> **Watch out.** Rows plus columns, $4 + 5 = 9$, is not the total.",
        "一个阵列有 4 行，每行 5 个。按行五个五个地数：5、10、15、20。一共 20 个。\n\n检验：按 5 列四个四个地数：4、8、12、16、20。\n\n> **注意。** 行数加列数，$4 + 5 = 9$，不是总数。",
      ],
      (rng) => {
        const rows = rng.int(2, 5);
        const cols = rng.int(2, 6);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const total = rows * cols;
        return solved(
          [
            `${name} lays out ${thing.en} in this array. How many ${thing.en} are there in all?`,
            `${name} 把${thing.zh}摆成这样的阵列。一共有多少${thing.unit}${thing.zh}？`,
          ],
          total,
          [
            [
              ["Rows and columns", "行和列"],
              [`${rows} rows with ${cols} in each row.`, `${rows} 行，每行 ${cols} ${thing.unit}。`],
            ],
            [
              ["Add the rows", "按行相加"],
              [`Add ${cols} once for each row:`, `有几行就加几次 ${cols}：`],
              [`${repeatSum(cols, rows)} = ${total}`],
            ],
          ],
          [`By columns: $${repeatSum(rows, cols)} = ${total}$.`, `按列：$${repeatSum(rows, cols)} = ${total}$。`],
          [
            [rows + cols, "That adds the rows and columns, not the objects.", "这是行数加列数，不是物品的个数。"],
            [total + cols, "That adds one row too many.", "这多加了一行。"],
            [total - rows, "That leaves out one column.", "这漏了一列。"],
          ],
          arrayFigure(rows, cols),
        );
      },
      captioned(arrayFigure(4, 5), "4 rows of 5: count by fives to 20.", "4 行，每行 5 个：五个五个地数到 20。"),
    ),
  ],
  [
    "Eggs in a box sit in 2 rows of 6. Count along the rows, $6 + 6$, or down the columns, $2 + 2 + 2 + 2 + 2 + 2$.\n\nCheck: both ways give 12 eggs.\n\nIn this lesson we write additions for arrays by rows and by columns, and see that the totals match.",
    "一盒鸡蛋摆成 2 行，每行 6 个。可以按行加，$6 + 6$；也可以按列加，$2 + 2 + 2 + 2 + 2 + 2$。\n\n检验：两种方法都是 12 个鸡蛋。\n\n本课我们按行或按列写出阵列的加法，并看出总数相同。",
  ],
);

const addingOnALine = earlyTopic(
  "adding-on-an-open-number-line",
  ["Adding on an Open Number Line", "在空白数轴上做加法"],
  ["Add by making jumps of tens and ones on a number line drawn by hand.", "在自己画的数轴上，用跳十和跳一的方法做加法。"],
  ["adding-within-100"],
  ["2.NBT.B.5"],
  [
    {
      ...earlyPoint(
        "jumping-by-tens-then-ones",
        ["Jumping by tens and then ones", "先跳十，再跳一"],
        [
          "To add $47 + 25$, start at 47. Jump 20 to reach 67, then jump 5 to reach 72.\n\nCheck: $72 - 25 = 47$, the start.\n\n> **Watch out.** Jump the tens of 25 as 20, not 2. A jump of 2 would land on 49.",
          "求 $47 + 25$，从 47 开始。先跳 20 到 67，再跳 5 到 72。\n\n检验：$72 - 25 = 47$，正是起点。\n\n> **注意。** 25 的十要跳 20，不是 2。跳 2 会落在 49。",
        ],
        (rng) => {
          const a = rng.int(12, 60);
          const tens = rng.int(1, 3);
          const ones = rng.int(1, 9);
          const b = 10 * tens + ones;
          const mid = a + 10 * tens;
          return solved(
            [`The jumps show $${a} + ${b}$. Where do they end?`, `图中的跳跃表示 $${a} + ${b}$。最后跳到哪个数？`],
            a + b,
            [
              [["Jump the tens", "跳十"], [`From ${a}, jump ${10 * tens}:`, `从 ${a} 跳 ${10 * tens}：`], [`${a} + ${10 * tens} = ${mid}`]],
              [["Jump the ones", "跳一"], [`Then jump ${ones}:`, `再跳 ${ones}：`], [`${mid} + ${ones} = ${a + b}`]],
            ],
            [`$${a + b} - ${b} = ${a}$, the start.`, `$${a + b} - ${b} = ${a}$，正是起点。`],
            [
              [mid, "That stops after the tens. Jump the ones too.", "这只跳了十。还要跳一。"],
              [a + ones, "That leaves out the jump of tens.", "这漏了跳十。"],
              [a + b + 10, "That jumps one ten too many.", "这多跳了一个十。"],
            ],
            hopsFigure([a, mid, a + b], true),
          );
        },
      ),
      figure: gradeDrawings["jumping-by-tens-then-ones"],
    },
    {
      ...earlyPoint(
        "the-missing-jump",
        ["The missing jump", "缺少的一跳"],
        [
          "A jump starts at 47 and lands on 67. Its size is $67 - 47 = 20$.\n\nCheck: $47 + 20 = 67$.\n\n> **Watch out.** The size of the jump is the gap, 20, not where it lands, 67.",
          "一跳从 47 开始，落在 67。这一跳的大小是 $67 - 47 = 20$。\n\n检验：$47 + 20 = 67$。\n\n> **注意。** 这一跳的大小是差 20，不是落点 67。",
        ],
        (rng) => {
          const a = rng.int(12, 60);
          const tens = rng.int(1, 3);
          const ones = rng.int(1, 9);
          const big = rng.bool();
          const answer = big ? 10 * tens : ones;
          const from = big ? a : a + 10 * tens;
          const to = from + answer;
          return solved(
            ["What number goes at the question mark above the jump?", "这一跳上方的问号处应该填几？"],
            answer,
            [
              [
                ["Read the ends", "读两端"],
                [`That jump goes from ${from} to ${to}.`, `这一跳从 ${from} 到 ${to}。`],
              ],
              [["Subtract", "相减"], ["Its size:", "它的大小："], [`${to} - ${from} = ${answer}`]],
            ],
            [`$${from} + ${answer} = ${to}$.`, `$${from} + ${answer} = ${to}$。`],
            big
              ? [
                  [
                    tens,
                    `The jump crosses ${tens} ${tens === 1 ? "ten" : "tens"}, which is ${answer}, not ${tens}.`,
                    `这一跳跨过 ${tens} 个十，是 ${answer}，不是 ${tens}。`,
                  ],
                  [to, "That is where the jump lands, not its size.", "这是落点，不是这一跳的大小。"],
                  [ones, "That is the other jump.", "这是另一跳。"],
                ]
              : [
                  [10 * ones, `The jump is ${ones} ones, not ${ones} tens.`, `这一跳是 ${ones} 个一，不是 ${ones} 个十。`],
                  [to, "That is where the jump lands, not its size.", "这是落点，不是这一跳的大小。"],
                  [10 * tens, "That is the other jump.", "这是另一跳。"],
                ],
            hopsFigure([a, a + 10 * tens, a + 10 * tens + ones], false, big ? 0 : 1),
          );
        },
      ),
      figure: gradeDrawings2["adding-on-an-open-number-line#the-missing-jump"],
    },
    earlyPoint(
      "choosing-the-jumps",
      ["Choosing the jumps", "选择怎样跳"],
      [
        "To add 36, split it into tens and ones: 30 and 6. So jump 30, then 6.\n\nCheck: $30 + 6 = 36$, the number being added.\n\n> **Watch out.** The 3 in 36 means 30. Jumps of 3 and 60 mix up the tens and ones.",
        "要加 36，先把它分成十和一：30 和 6。所以先跳 30，再跳 6。\n\n检验：$30 + 6 = 36$，正是要加的数。\n\n> **注意。** 36 中的 3 表示 30。跳 3 和跳 60 是把十和一弄混了。",
      ],
      (rng) => {
        const a = rng.int(12, 60);
        const tens = rng.int(1, 4);
        let ones = rng.int(1, 9);
        if (ones === tens) ones = ones === 9 ? 8 : ones + 1;
        const b = 10 * tens + ones;
        return pickedMath(
          rng,
          [`To find $${a} + ${b}$ starting at ${a}, which pair of jumps is right?`, `从 ${a} 开始求 $${a} + ${b}$，哪两跳是对的？`],
          `+${10 * tens},\\ +${ones}`,
          [
            [
              `+${tens},\\ +${10 * ones}`,
              `The tens and ones are mixed up: the ${tens} in ${b} means ${10 * tens}, and the ${ones} means ${ones}.`,
              `十和一弄混了：${b} 中的 ${tens} 表示 ${10 * tens}，${ones} 表示 ${ones}。`,
            ],
            [
              `+${tens},\\ +${ones}`,
              `The ${tens} in ${b} is in the tens place, so it means ${10 * tens}, not ${tens}.`,
              `${b} 中的 ${tens} 在十位上，所以表示 ${10 * tens}，不是 ${tens}。`,
            ],
            [
              `+${10 * tens},\\ +${10 * ones}`,
              `The ${ones} in ${b} is in the ones place, so it means ${ones}, not ${10 * ones}.`,
              `${b} 中的 ${ones} 在个位上，所以表示 ${ones}，不是 ${10 * ones}。`,
            ],
          ],
          [
            [
              ["Split the number", "拆数"],
              [`${b} is ${10 * tens} and ${ones}.`, `${b} 是 ${10 * tens} 和 ${ones}。`],
            ],
            [
              ["Choose the jumps", "选跳法"],
              [`Jump ${10 * tens}, then ${ones}.`, `先跳 ${10 * tens}，再跳 ${ones}。`],
            ],
          ],
          [`$${10 * tens} + ${ones} = ${b}$, the number being added.`, `$${10 * tens} + ${ones} = ${b}$，正是要加的数。`],
        );
      },
      captioned(hopsFigure([20, 50, 56]), "Adding 36 to 20: a jump of 30, then a jump of 6.", "20 加 36：先跳 30，再跳 6。"),
    ),
  ],
  [
    "A frog hops along a path of stones numbered up to 100. From stone 47 it takes a long hop of 20 to stone 67, then a short hop of 5 to stone 72.\n\nCheck: $47 + 25 = 72$.\n\nIn this lesson we add on an open number line by jumping tens and then ones.",
    "一只青蛙在编了号的石头上跳，号码一直到 100。它从 47 号石头跳一大步 20，到 67 号；再跳一小步 5，到 72 号。\n\n检验：$47 + 25 = 72$。\n\n本课我们在空白数轴上先跳十、再跳一来做加法。",
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
        "To find $72 - 25$, start at 72. Jump back 20 to 52, then jump back 5 to 47.\n\nCheck: $47 + 25 = 72$.\n\n> **Watch out.** Subtracting means jumping back, to the left. Jumping forward would give $72 + 25 = 97$.",
        "求 $72 - 25$，从 72 开始。先往回跳 20 到 52，再往回跳 5 到 47。\n\n检验：$47 + 25 = 72$。\n\n> **注意。** 减法是往回跳，往左跳。往前跳就成了 $72 + 25 = 97$。",
      ],
      (rng) => {
        const a = rng.int(50, 99);
        const tens = rng.int(1, 3);
        const ones = rng.int(1, 9);
        const b = 10 * tens + ones;
        const mid = a - 10 * tens;
        return solved(
          [`The jumps show $${a} - ${b}$. Where do they end?`, `图中的跳跃表示 $${a} - ${b}$。最后跳到哪个数？`],
          a - b,
          [
            [
              ["Jump back the tens", "往回跳十"],
              [`From ${a}, jump back ${10 * tens}:`, `从 ${a} 往回跳 ${10 * tens}：`],
              [`${a} - ${10 * tens} = ${mid}`],
            ],
            [["Jump back the ones", "往回跳一"], [`Then jump back ${ones}:`, `再往回跳 ${ones}：`], [`${mid} - ${ones} = ${a - b}`]],
          ],
          [`$${a - b} + ${b} = ${a}$, the start.`, `$${a - b} + ${b} = ${a}$，正是起点。`],
          [
            [mid, "That stops after the tens. Jump back the ones too.", "这只跳了十。还要往回跳一。"],
            [a - b + 10, "That jumps back one ten too few.", "这少往回跳了一个十。"],
            [a + b, "That jumps forward. Subtracting jumps back.", "这是往前跳。减法要往回跳。"],
          ],
          hopsFigure([a, mid, a - b], true),
        );
      },
      captioned(hopsFigure([72, 52, 47]), "72 − 25: back 20 to 52, then back 5 to 47.", "72 − 25：往回跳 20 到 52，再往回跳 5 到 47。"),
    ),
    earlyPoint(
      "the-size-of-a-jump-back",
      ["The size of a jump back", "往回跳了多少"],
      [
        "A jump goes back from 72 to 52. Its size is $72 - 52 = 20$.\n\nCheck: $52 + 20 = 72$.\n\n> **Watch out.** The size is the gap, 20, not the number where the jump lands, 52.",
        "一跳从 72 往回跳到 52。这一跳的大小是 $72 - 52 = 20$。\n\n检验：$52 + 20 = 72$。\n\n> **注意。** 大小是两数的差 20，不是落点 52。",
      ],
      (rng) => {
        const a = rng.int(50, 99);
        const tens = rng.int(1, 3);
        const ones = rng.int(1, 9);
        const big = rng.bool();
        const answer = big ? 10 * tens : ones;
        const from = big ? a : a - 10 * tens;
        const to = from - answer;
        return solved(
          ["What number goes at the question mark above the jump?", "这一跳上方的问号处应该填几？"],
          answer,
          [
            [
              ["Read the ends", "读两端"],
              [`That jump goes back from ${from} to ${to}.`, `这一跳从 ${from} 往回跳到 ${to}。`],
            ],
            [["Subtract", "相减"], ["Its size:", "它的大小："], [`${from} - ${to} = ${answer}`]],
          ],
          [`$${to} + ${answer} = ${from}$.`, `$${to} + ${answer} = ${from}$。`],
          big
            ? [
                [
                  tens,
                  `The jump crosses ${tens} ${tens === 1 ? "ten" : "tens"}, which is ${answer}, not ${tens}.`,
                  `这一跳跨过 ${tens} 个十，是 ${answer}，不是 ${tens}。`,
                ],
                [to, "That is where the jump lands, not its size.", "这是落点，不是这一跳的大小。"],
                [ones, "That is the other jump.", "这是另一跳。"],
              ]
            : [
                [10 * ones, `The jump is ${ones} ones, not ${ones} tens.`, `这一跳是 ${ones} 个一，不是 ${ones} 个十。`],
                [to, "That is where the jump lands, not its size.", "这是落点，不是这一跳的大小。"],
                [10 * tens, "That is the other jump.", "这是另一跳。"],
              ],
          hopsFigure([a, a - 10 * tens, a - 10 * tens - ones], false, big ? 0 : 1),
        );
      },
      captioned(hopsFigure([72, 52]), "A jump back from 72 to 52 is 20.", "从 72 往回跳到 52，跳了 20。"),
    ),
    earlyPoint(
      "jumping-back-to-a-ten",
      ["Jumping back to a ten", "先往回跳到整十"],
      [
        "To find $63 - 8$, first jump back 3 to reach 60. 8 is 3 and 5, so jump back 5 more to reach 55.\n\nCheck: $55 + 8 = 63$.\n\n> **Watch out.** After stopping at 60, jump back only the rest of the 8, which is 5, not 8 again.",
        "求 $63 - 8$，先往回跳 3 到 60。8 是 3 和 5，所以再往回跳 5 到 55。\n\n检验：$55 + 8 = 63$。\n\n> **注意。** 停在 60 后，只要再跳 8 剩下的 5，不是再跳 8。",
      ],
      (rng) => {
        const tens = rng.int(3, 9);
        const ones = rng.int(1, 6);
        const take = rng.int(ones + 1, 9);
        const a = 10 * tens + ones;
        const stop = 10 * tens;
        const rest = take - ones;
        return solved(
          [`The jumps show $${a} - ${take}$. Where do they end?`, `图中的跳跃表示 $${a} - ${take}$。最后跳到哪个数？`],
          a - take,
          [
            [
              ["Back to a ten", "先跳到整十"],
              [`Jump back ${ones} to reach ${stop}.`, `往回跳 ${ones} 到 ${stop}。`],
            ],
            [
              ["Jump the rest", "跳剩下的"],
              [`${take} is ${ones} and ${rest}, so jump back ${rest}:`, `${take} 是 ${ones} 和 ${rest}，所以再往回跳 ${rest}：`],
              [`${stop} - ${rest} = ${a - take}`],
            ],
          ],
          [`$${a - take} + ${take} = ${a}$.`, `$${a - take} + ${take} = ${a}$。`],
          [
            [a - take + 10, "That forgets to cross into the ten below.", "这忘了退到下一个十。"],
            [stop, "That stops at the ten. Jump back the rest too.", "这停在整十了。还要跳剩下的。"],
            [stop - take, `That jumps back all ${take} again after reaching ${stop}.`, `到 ${stop} 后又往回跳了 ${take}。`],
          ],
          hopsFigure([a, stop, a - take], true),
        );
      },
      captioned(hopsFigure([63, 60, 55]), "63 − 8: back 3 to 60, then back 5 to 55.", "63 − 8：往回跳 3 到 60，再往回跳 5 到 55。"),
    ),
  ],
  [
    "A frog sits on stone 72 and hops back home. It hops back 20 to stone 52, then 5 more to stone 47.\n\nCheck: $72 - 25 = 47$.\n\nIn this lesson we subtract by jumping back tens and then ones on an open number line.",
    "一只青蛙在 72 号石头上，往回跳回家。它先往回跳 20 到 52 号，再跳 5 到 47 号。\n\n检验：$72 - 25 = 47$。\n\n本课我们在空白数轴上先往回跳十、再往回跳一来做减法。",
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
        "For $38 + 25$, 38 needs 2 more to make 40. Move 2 from the 25 to the 38: $38 + 25 = 40 + 23 = 63$.\n\nCheck: add the usual way, $38 + 25 = 63$.\n\n> **Watch out.** What one number gains, the other must lose. $40 + 25$ would be 2 too many.",
        "求 $38 + 25$，38 还要 2 才到 40。把 25 的 2 挪给 38：$38 + 25 = 40 + 23 = 63$。\n\n检验：用平常的方法算，$38 + 25 = 63$。\n\n> **注意。** 一个数多了多少，另一个数就要少多少。$40 + 25$ 会多 2。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const gap = rng.int(1, 3);
        const a = 10 * tens + 10 - gap;
        const b = rng.int(gap + 11, 49);
        const round = a + gap;
        return solved(
          [`What number goes in the box? $${a} + ${b} = ${round} + \\square$`, `方框里填几？$${a} + ${b} = ${round} + \\square$`],
          b - gap,
          [
            [
              ["What was moved", "挪了多少"],
              [`${a} became ${round}, so ${gap} was moved across.`, `${a} 变成了 ${round}，所以挪过去了 ${gap}。`],
            ],
            [["Take it from the other", "从另一个数里拿走"], [`${b} gives up ${gap}:`, `${b} 少 ${gap}：`], [`${b} - ${gap} = ${b - gap}`]],
          ],
          [
            `Both sides make ${a + b}: $${a} + ${b} = ${a + b}$ and $${round} + ${b - gap} = ${a + b}$.`,
            `两边都是 ${a + b}：$${a} + ${b} = ${a + b}$，$${round} + ${b - gap} = ${a + b}$。`,
          ],
          [
            [b + gap, `That gives ${gap} to both numbers. ${b} must lose ${gap}.`, `这让两个数都多了 ${gap}。${b} 应该少 ${gap}。`],
            [b, `${a} gained ${gap}, so ${b} must lose ${gap}.`, `${a} 多了 ${gap}，${b} 就要少 ${gap}。`],
            [gap, "That is the amount moved, not what is left.", "这是挪过去的数，不是剩下的。"],
          ],
        );
      },
      captioned(
        partWholeBarFigure([38, 25], -1),
        "38 + 25: move 2 across to make 40 + 23 = 63.",
        "38 + 25：挪 2 过去，变成 40 + 23 = 63。",
      ),
    ),
    earlyPoint(
      "which-sum-is-the-same",
      ["Which sum is the same", "哪个算式的和相同"],
      [
        "$29 + 34$ is the same as $30 + 33$: 29 went up by 1, and 34 went down by 1.\n\nCheck: $29 + 34 = 63$ and $30 + 33 = 63$.\n\n> **Watch out.** If only one number changes, as in $30 + 34$, the sum changes too.",
        "$29 + 34$ 和 $30 + 33$ 相同：29 多了 1，34 少了 1。\n\n检验：$29 + 34 = 63$，$30 + 33 = 63$。\n\n> **注意。** 如果只变一个数，比如 $30 + 34$，和也会变。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const gap = rng.int(1, 3);
        const a = 10 * tens + 10 - gap;
        const b = rng.int(gap + 11, 49);
        const round = a + gap;
        return pickedMath(
          rng,
          [`Which sum is the same as $${a} + ${b}$?`, `哪个算式的和与 $${a} + ${b}$ 相同？`],
          `${round} + ${b - gap}`,
          [
            [
              `${round} + ${b}`,
              `Only ${a} went up, so this sum is ${gap} too big. Take ${gap} from ${b} as well.`,
              `只有 ${a} 变大了，所以这个和多了 ${gap}。还要从 ${b} 里减去 ${gap}。`,
            ],
            [
              `${round} + ${b + gap}`,
              "Both numbers went up, so the sum changes. When one goes up, the other must go down.",
              "两个数都变大了，和也就变了。一个数变大，另一个就要变小。",
            ],
            [`${round - 10} + ${b}`, `This sum is ${round - 10 + b}, not ${a + b}.`, `这个和是 ${round - 10 + b}，不是 ${a + b}。`],
            [
              `${a} + ${b - gap}`,
              `Here ${b} went down but ${a} stayed the same, so this sum is ${gap} too small.`,
              `这里 ${b} 变小了，${a} 却没变，所以这个和少了 ${gap}。`,
            ],
          ],
          [
            [
              ["Look for a round number", "找整数"],
              [`${a} + ${gap} = ${round}, a round number.`, `${a} + ${gap} = ${round}，是整十数。`],
            ],
            [
              ["Balance it", "保持平衡"],
              [`So ${b} must go down by ${gap} to ${b - gap}.`, `所以 ${b} 要少 ${gap}，变成 ${b - gap}。`],
            ],
          ],
          [
            `$${a} + ${b} = ${a + b}$ and $${round} + ${b - gap} = ${a + b}$.`,
            `$${a} + ${b} = ${a + b}$，$${round} + ${b - gap} = ${a + b}$。`,
          ],
        );
      },
      captioned(partWholeBarFigure([30, 33], -1), "29 + 34 and 30 + 33 fill the same bar: 63.", "29 + 34 和 30 + 33 是同样长的条：63。"),
    ),
    earlyPoint(
      "making-a-round-hundred",
      ["Making a round hundred", "凑成整百"],
      [
        "298 is only 2 away from 300. For $298 + 45$, move 2 across: $300 + 43 = 343$.\n\nCheck: $343 - 45 = 298$.\n\n> **Watch out.** Take the 2 from the 45. $300 + 45 = 345$ is 2 too many.",
        "298 只差 2 就到 300。求 $298 + 45$，挪 2 过去：$300 + 43 = 343$。\n\n检验：$343 - 45 = 298$。\n\n> **注意。** 这 2 要从 45 里拿。$300 + 45 = 345$ 多了 2。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const gap = rng.int(1, 3);
        const a = 100 * h - gap;
        const b = rng.int(gap + 5, 95);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const story = rng.bool();
        return solved(
          story
            ? [
                `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          a + b,
          [
            [
              ["Make a hundred", "凑成整百"],
              [`${a} needs ${gap} to make ${100 * h}, so take ${gap} from ${b}:`, `${a} 还差 ${gap} 到 ${100 * h}，从 ${b} 里拿 ${gap}：`],
              [`${b} - ${gap} = ${b - gap}`],
            ],
            [["Add", "相加"], ["Now add the round number:", "再加整百数："], [`${100 * h} + ${b - gap} = ${a + b}`]],
          ],
          [`$${a + b} - ${b} = ${a}$.`, `$${a + b} - ${b} = ${a}$。`],
          [
            [100 * h + b, `That rounds ${a} up but keeps all of ${b}.`, `这把 ${a} 凑成了整百，却没从 ${b} 里拿走。`],
            [a + b - 100, "That loses a hundred.", "这少了一个百。"],
            [a + b + 10, "That is 10 too many.", "多了 10。"],
          ],
        );
      },
      captioned(hopsFigure([298, 300, 343]), "298 + 45: up 2 to 300, then 43 more to 343.", "298 + 45：先加 2 到 300，再加 43 到 343。"),
    ),
  ],
  [
    "A bag holds 39 marbles and another holds 24. Move 1 marble across and the bags hold 40 and 23, which is easy: 63.\n\nCheck: no marble was added or lost, so $39 + 24 = 63$ too.\n\nIn this lesson we add by moving a little from one number to make the other round.",
    "一袋有 39 颗弹珠，另一袋有 24 颗。挪 1 颗过去，就变成 40 和 23，很好算：63。\n\n检验：弹珠没有多也没有少，所以 $39 + 24 = 63$。\n\n本课我们把一个数的一点点挪给另一个数，凑成整数来做加法。",
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
        "To find $52 - 27$, start at 27. Jump 3 to reach 30, then jump 22 to reach 52. The difference is the jumps together: $3 + 22 = 25$.\n\nCheck: $27 + 25 = 52$.\n\n> **Watch out.** The answer is the total of the jumps, 25, not the number you land on, 52.",
        "求 $52 - 27$，从 27 开始。先跳 3 到 30，再跳 22 到 52。差就是这几跳合起来：$3 + 22 = 25$。\n\n检验：$27 + 25 = 52$。\n\n> **注意。** 答案是几跳的和 25，不是落到的数 52。",
      ],
      (rng) => {
        const tens = rng.int(1, 5);
        const ones = rng.int(1, 8);
        const a = 10 * tens + ones;
        const next = a + 10 - ones;
        const n = next + rng.int(3, 30);
        const answer = n - a;
        return solved(
          [
            `The jumps show how to find $${n} - ${a}$ by adding up. What is the difference?`,
            `图中的跳跃表示用往上加的方法求 $${n} - ${a}$。差是多少？`,
          ],
          answer,
          [
            [
              ["Up to a ten", "跳到整十"],
              [`From ${a}, jump ${next - a} to ${next}.`, `从 ${a} 跳 ${next - a} 到 ${next}。`],
            ],
            [
              ["Up to the number", "跳到大数"],
              [`Then jump ${n - next} to ${n}.`, `再跳 ${n - next} 到 ${n}。`],
            ],
            [["Add the jumps", "把几跳加起来"], ["The difference:", "差："], [`${next - a} + ${n - next} = ${answer}`]],
          ],
          [`$${a} + ${answer} = ${n}$.`, `$${a} + ${answer} = ${n}$。`],
          [
            [n, "That is where you land, not the total of the jumps.", "这是落到的数，不是几跳的和。"],
            [n - next, "That leaves out the first jump.", "这漏了第一跳。"],
            [next - a, "That leaves out the second jump.", "这漏了第二跳。"],
          ],
          hopsFigure([a, next, n]),
        );
      },
      captioned(
        hopsFigure([27, 30, 52]),
        "52 − 27 by adding up: 3 to 30, then 22 to 52; 25 in all.",
        "往上加求 52 − 27：跳 3 到 30，再跳 22 到 52；一共 25。",
      ),
    ),
    earlyPoint(
      "adding-up-through-a-hundred",
      ["Adding up through a hundred", "经过整百往上加"],
      [
        "To find $403 - 198$, add up from 198: 2 to reach 200, 200 to reach 400, and 3 to reach 403. The jumps make $2 + 200 + 3 = 205$.\n\nCheck: $198 + 205 = 403$.\n\n> **Watch out.** Add every jump. Leaving out the small first jump of 2 gives 203.",
        "求 $403 - 198$，从 198 往上加：跳 2 到 200，跳 200 到 400，跳 3 到 403。几跳合起来是 $2 + 200 + 3 = 205$。\n\n检验：$198 + 205 = 403$。\n\n> **注意。** 每一跳都要加。漏了开头那一小跳 2，就得到 203。",
      ],
      (rng) => {
        const h = rng.int(1, 6);
        const gap = rng.int(1, 9);
        const a = 100 * h - gap;
        const hundreds = rng.int(1, 3);
        const over = rng.int(1, 9);
        const n = 100 * (h + hundreds) + over;
        const answer = n - a;
        return solved(
          [
            `The jumps show how to find $${n} - ${a}$ by adding up. What is the difference?`,
            `图中的跳跃表示用往上加的方法求 $${n} - ${a}$。差是多少？`,
          ],
          answer,
          [
            [
              ["Read the jumps", "读出每一跳"],
              [
                `${gap} to ${100 * h}, ${100 * hundreds} to ${100 * (h + hundreds)}, and ${over} to ${n}.`,
                `跳 ${gap} 到 ${100 * h}，跳 ${100 * hundreds} 到 ${100 * (h + hundreds)}，跳 ${over} 到 ${n}。`,
              ],
            ],
            [["Add the jumps", "把几跳加起来"], ["The difference:", "差："], [`${gap} + ${100 * hundreds} + ${over} = ${answer}`]],
          ],
          [`$${a} + ${answer} = ${n}$.`, `$${a} + ${answer} = ${n}$。`],
          [
            [100 * hundreds + over, `That leaves out the first jump of ${gap}.`, `这漏了第一跳 ${gap}。`],
            [n, "That is where you land, not the total of the jumps.", "这是落到的数，不是几跳的和。"],
            [answer + 100, "That adds one hundred too many.", "这多加了一个百。"],
          ],
          hopsFigure([a, 100 * h, 100 * (h + hundreds), n]),
        );
      },
      captioned(
        hopsFigure([198, 200, 400, 403]),
        "403 − 198 by adding up: 2, then 200, then 3; 205 in all.",
        "往上加求 403 − 198：2，再 200，再 3；一共 205。",
      ),
    ),
    earlyPoint(
      "when-the-numbers-are-close",
      ["When the numbers are close", "两个数很接近时"],
      [
        "For $72 - 68$, count up from 68: 69, 70, 71, 72. That is 4 steps, so $72 - 68 = 4$.\n\nCheck: $68 + 4 = 72$.\n\n> **Watch out.** Do not subtract the ones digits the wrong way round. $8 - 2 = 6$ gives a wrong answer.",
        "求 $72 - 68$，从 68 往上数：69、70、71、72。数了 4 步，所以 $72 - 68 = 4$。\n\n检验：$68 + 4 = 72$。\n\n> **注意。** 不要把个位倒过来减。$8 - 2 = 6$ 是错的。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const ones = rng.int(1, 5);
        const n = 10 * tens + ones;
        const gap = rng.int(ones + 1, ones + 6);
        const a = n - gap;
        const hundreds = rng.bool() ? 100 * rng.int(1, 8) : 0;
        const big = hundreds + n;
        const small = hundreds + a;
        const steps = Array.from({ length: gap }, (_, k) => small + k + 1);
        return solved(
          [`What is $${big} - ${small}$?`, `$${big} - ${small}$ 等于多少？`],
          gap,
          [
            [["Count up", "往上数"], [`From ${small}:`, `从 ${small} 开始：`], [steps.join(", ")]],
            [
              ["Count the steps", "数步数"],
              [`That is ${gap} steps.`, `一共 ${gap} 步。`],
            ],
          ],
          [`$${small} + ${gap} = ${big}$.`, `$${small} + ${gap} = ${big}$。`],
          [
            [Math.abs((n % 10) - (a % 10)), "That subtracts the ones digits the wrong way round.", "这把个位倒过来减了。"],
            [gap + 10, "That is 10 too many. Count again.", "多了 10，再数一遍。"],
            [gap + 1, "That counts the starting number as a step.", "这把开始的数也算成了一步。"],
          ],
        );
      },
      captioned(hopsFigure([68, 69, 70, 71, 72]), "From 68 to 72 is 4 steps of 1.", "从 68 到 72 是 4 步，每步 1。"),
    ),
  ],
  [
    "A book has 52 pages and Ben has read 27. To find the pages left, he counts up from 27: 3 pages to 30, then 22 more to 52.\n\nCheck: $3 + 22 = 25$ pages left, and $27 + 25 = 52$.\n\nIn this lesson we find a difference by adding up from the smaller number through round numbers.",
    "一本书有 52 页，Ben 读了 27 页。要知道还剩几页，他从 27 往上数：3 页到 30，再 22 页到 52。\n\n检验：还剩 $3 + 22 = 25$ 页，$27 + 25 = 52$。\n\n本课我们从小的数开始，经过整数往上加，求出差。",
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
        "To check $500 - 180 = 320$, add the answer to the number taken away: $320 + 180 = 500$. That is the number we started with, so the answer is right.\n\nCheck: the three numbers 180, 320 and 500 fit both sentences.\n\n> **Watch out.** Doing $500 - 180$ again may repeat the same mistake. Use the opposite operation.",
        "要检查 $500 - 180 = 320$，就把得数和减去的数相加：$320 + 180 = 500$。正好是开始的数，所以答案是对的。\n\n检验：180、320、500 三个数在两个算式里都对得上。\n\n> **注意。** 再算一遍 $500 - 180$ 可能会重复同样的错误。要用相反的运算。",
      ],
      (rng) => {
        const a = rng.int(120, 480);
        const b = rng.int(110, 460);
        const c = a + b;
        const sub = rng.bool();
        return sub
          ? pickedMath(
              rng,
              [`Which sentence can check that $${c} - ${a} = ${b}$?`, `哪个算式可以检查 $${c} - ${a} = ${b}$ 对不对？`],
              `${b} + ${a} = ${c}`,
              [
                [`${c} + ${a} = ${b}`, `${c} + ${a} is ${c + a}, not ${b}.`, `${c} + ${a} 是 ${c + a}，不是 ${b}。`],
                [`${c} + ${b} = ${a}`, `${c} + ${b} is ${c + b}, not ${a}.`, `${c} + ${b} 是 ${c + b}，不是 ${a}。`],
                [
                  `${b} - ${a} = ${c}`,
                  `A subtraction of ${a} cannot give ${c}, which is larger than ${b}.`,
                  `减去 ${a} 不可能得到比 ${b} 还大的 ${c}。`,
                ],
              ],
              [
                [
                  ["Undo the subtraction", "用加法还原"],
                  ["Add the answer to the number taken away.", "把得数和减去的数相加。"],
                ],
                [["Compare", "比较"], ["It should give the starting number:", "应该得到开始的数："], [`${b} + ${a} = ${c}`]],
              ],
              [`$${c} - ${b} = ${a}$ fits the same three numbers.`, `$${c} - ${b} = ${a}$ 也用这三个数。`],
            )
          : pickedMath(
              rng,
              [`Which sentence can check that $${a} + ${b} = ${c}$?`, `哪个算式可以检查 $${a} + ${b} = ${c}$ 对不对？`],
              `${c} - ${b} = ${a}`,
              [
                [
                  `${b} - ${c} = ${a}`,
                  `${b} is less than ${c}, so take ${b} from ${c}, not the other way.`,
                  `${b} 比 ${c} 小，要用 ${c} 减 ${b}，不能反过来。`,
                ],
                [`${c} + ${b} = ${a}`, `${c} + ${b} is ${c + b}, not ${a}.`, `${c} + ${b} 是 ${c + b}，不是 ${a}。`],
                [`${a} - ${b} = ${c}`, `A subtraction cannot make ${c}, which is larger than ${a}.`, `减法不可能得到比 ${a} 还大的 ${c}。`],
              ],
              [
                [
                  ["Undo the addition", "用减法还原"],
                  ["Take one addend away from the sum.", "用和减去一个加数。"],
                ],
                [["Compare", "比较"], ["It should leave the other addend:", "应该剩下另一个加数："], [`${c} - ${b} = ${a}`]],
              ],
              [`$${c} - ${a} = ${b}$ works too.`, `$${c} - ${a} = ${b}$ 也成立。`],
            );
      },
      captioned(
        partWholeBarFigure([320, 180], -1),
        "500 is 320 and 180, so 500 − 180 = 320 and 320 + 180 = 500.",
        "500 是 320 和 180，所以 500 − 180 = 320，320 + 180 = 500。",
      ),
    ),
    earlyPoint(
      "what-the-check-gives",
      ["What the check gives", "验算得到什么"],
      [
        "Sam says $523 - 168 = 365$. To check, add: $365 + 168 = 533$. That is not 523, so Sam made a mistake. The right answer is 355.\n\nCheck: $355 + 168 = 523$.\n\n> **Watch out.** A check that is off by exactly 10 or 100 often means a trade was forgotten.",
        "Sam 说 $523 - 168 = 365$。验算一下：$365 + 168 = 533$。不是 523，所以 Sam 算错了。正确答案是 355。\n\n检验：$355 + 168 = 523$。\n\n> **注意。** 验算正好差 10 或 100，常常是忘了换算。",
      ],
      (rng) => {
        const n = rng.int(421, 899);
        const take = rng.int(115, 298);
        const off = rng.pick([10, 100, 0]);
        const said = n - take - off;
        const name = rng.pick(earlyNames);
        const sum = said + take;
        return solved(
          [
            `${name} says that $${n} - ${take} = ${said}$. To check, what is $${said} + ${take}$?`,
            `${name} 说 $${n} - ${take} = ${said}$。要验算，$${said} + ${take}$ 等于多少？`,
          ],
          sum,
          [
            [["Add", "相加"], ["Add the answer and the number taken away:", "把得数和减去的数相加："], [`${said} + ${take} = ${sum}`]],
            [
              ["Compare", "比较"],
              off === 0
                ? [`That is ${n}, the starting number, so ${name} is right.`, `正好是开始的数 ${n}，所以 ${name} 算对了。`]
                : [`That is not ${n}, so ${name} made a mistake.`, `不是 ${n}，所以 ${name} 算错了。`],
            ],
          ],
          [`$${sum} - ${take} = ${said}$.`, `$${sum} - ${take} = ${said}$。`],
          [
            [sum + 10, "That is 10 too many. Check the tens.", "多了 10，检查十位。"],
            [sum - 10, "That is 10 too few. Check the carry into the tens.", "少了 10，检查进位。"],
            [sum + 100, "That is 100 too many. Check the hundreds.", "多了 100，检查百位。"],
          ],
        );
      },
      captioned(
        partWholeBarFigure([365, 168], -1),
        "365 and 168 make 533, not 523: the subtraction was wrong.",
        "365 和 168 合起来是 533，不是 523：减法算错了。",
      ),
    ),
    earlyPoint(
      "spotting-the-wrong-answer",
      ["Spotting the wrong answer", "找出算错的算式"],
      [
        "Which is wrong: $450 - 120 = 330$ or $612 - 245 = 377$? Check each by adding. $330 + 120 = 450$, which is right. $377 + 245 = 622$, not 612, so the second one is wrong.\n\nCheck: $612 - 245 = 367$, which is 10 less than 377.\n\n> **Watch out.** Add the answer to the number taken away, not to the starting number.",
        "哪个算错了：$450 - 120 = 330$ 还是 $612 - 245 = 377$？用加法逐个验算。$330 + 120 = 450$，对。$377 + 245 = 622$，不是 612，所以第二个错了。\n\n检验：$612 - 245 = 367$，比 377 少 10。\n\n> **注意。** 要把得数和减去的数相加，不是和开始的数相加。",
      ],
      (rng) => {
        const make = () => {
          const b = rng.int(115, 349);
          const c = rng.int(112, 349);
          return { a: b + c, b, c };
        };
        const goods = [make(), make(), make()];
        const bad = make();
        const off = rng.pick([10, -10, 100]);
        const sentence = `${bad.a} - ${bad.b} = ${bad.c + off}`;
        return pickedMath(
          rng,
          ["Exactly one of these subtractions is wrong. Which one?", "下面的减法中，有一个算错了。是哪一个？"],
          sentence,
          goods.map(
            (f): MathWrong => [
              `${f.a} - ${f.b} = ${f.c}`,
              `$${f.c} + ${f.b} = ${f.a}$, so this one is right.`,
              `$${f.c} + ${f.b} = ${f.a}$，这个是对的。`,
            ],
          ),
          [
            [
              ["Check each by adding", "逐个用加法验算"],
              ["Add each answer to the number taken away.", "把每个得数和减去的数相加。"],
            ],
            [
              ["Find the one that fails", "找出对不上的"],
              [`For ${sentence}:`, `看 ${sentence}：`],
              [`${bad.c + off} + ${bad.b} = ${bad.a + off}`],
            ],
          ],
          [
            `$${bad.a + off}$ is not ${bad.a}; the right answer is $${bad.a} - ${bad.b} = ${bad.c}$.`,
            `$${bad.a + off}$ 不是 ${bad.a}；正确的是 $${bad.a} - ${bad.b} = ${bad.c}$。`,
          ],
        );
      },
      captioned(partWholeBarFigure([377, 245], -1), "377 and 245 make 622, not 612.", "377 和 245 合起来是 622，不是 612。"),
    ),
  ],
  [
    "A shop has 500 stickers and sells 180. The clerk works out 320 left, then adds $320 + 180$ to be sure. It makes 500, so the count is right.\n\nCheck: adding undoes subtracting.\n\nIn this lesson we check an addition with a subtraction and a subtraction with an addition.",
    "商店有 500 张贴纸，卖出 180 张。店员算出还剩 320 张，再算 $320 + 180$ 来确认。结果是 500，所以算对了。\n\n检验：加法能还原减法。\n\n本课我们用减法检查加法，用加法检查减法。",
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
        "In $243 + 135$, add the hundreds: $200 + 100 = 300$. Add the tens: $40 + 30 = 70$. Add the ones: $3 + 5 = 8$.\n\nCheck: count the blocks: 3 flats, 7 rods and 8 small squares.\n\n> **Watch out.** Use what each digit is worth. The hundreds part is $200 + 100 = 300$, not $2 + 1 = 3$.",
        "在 $243 + 135$ 中，百相加：$200 + 100 = 300$。十相加：$40 + 30 = 70$。一相加：$3 + 5 = 8$。\n\n检验：数积木：3 个大方块、7 根长条、8 个小方块。\n\n> **注意。** 要用每个数字代表的大小。百这部分是 $200 + 100 = 300$，不是 $2 + 1 = 3$。",
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
        const [x, y, size] = where === 0 ? [h1, h2, 100] : where === 1 ? [t1, t2, 10] : [o1, o2, 1];
        const answer = size * (x + y);
        const label: Pair = where === 0 ? ["hundreds", "百位"] : where === 1 ? ["tens", "十位"] : ["ones", "个位"];
        return solved(
          [
            `The blocks show ${a} and ${b}. When you add the ${label[0]} parts, what do you get?`,
            `这些积木表示 ${a} 和 ${b}。把${label[1]}这部分相加，得多少？`,
          ],
          answer,
          [
            [
              ["Find the parts", "找出这部分"],
              [`The ${label[0]} parts are ${size * x} and ${size * y}.`, `${label[1]}这部分是 ${size * x} 和 ${size * y}。`],
            ],
            [["Add them", "相加"], ["Together:", "合起来："], [`${size * x} + ${size * y} = ${answer}`]],
          ],
          [`Count the blocks of that kind: ${x + y} of them, each worth ${size}.`, `数这种积木：${x + y} 个，每个是 ${size}。`],
          where === 0
            ? [
                [h1 + h2, "That adds the digits, not what they are worth.", "这是把数字相加，没有按它们代表的大小算。"],
                [10 * (h1 + h2), "Each flat is worth 100, not 10.", "每个大方块是 100，不是 10。"],
                [a + b, "That is the whole sum, not just the hundreds.", "这是整个和，不只是百这部分。"],
              ]
            : where === 1
              ? [
                  [t1 + t2, "That adds the digits, not what they are worth.", "这是把数字相加，没有按它们代表的大小算。"],
                  [100 * (t1 + t2), "Each rod is worth 10, not 100.", "每根长条是 10，不是 100。"],
                  [a + b, "That is the whole sum, not just the tens.", "这是整个和，不只是十这部分。"],
                ]
              : [
                  [10 * (o1 + o2), "Each small square is worth 1, not 10.", "每个小方块是 1，不是 10。"],
                  [100 + o1 + o2, "That adds a hundred that is not there.", "这多加了一个百。"],
                  [a + b, "That is the whole sum, not just the ones.", "这是整个和，不只是一这部分。"],
                ],
          blockRowsFigure([
            [h1, t1, o1],
            [h2, t2, o2],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [2, 4, 3],
          [1, 3, 5],
        ]),
        "243 and 135 in blocks: 300 from the flats, 70 from the rods, 8 from the small squares.",
        "积木表示 243 和 135：大方块 300，长条 70，小方块 8。",
      ),
    ),
    earlyPoint(
      "putting-the-parts-together",
      ["Putting the parts together", "把各部分合起来"],
      [
        "For $243 + 135$ the parts are 300, 70 and 8. Put them together: $300 + 70 + 8 = 378$.\n\nCheck: $378 - 135 = 243$.\n\n> **Watch out.** Put the parts together by their places. Adding the digits $3 + 7 + 8$ is not the sum.",
        "$243 + 135$ 的三部分是 300、70 和 8。合起来：$300 + 70 + 8 = 378$。\n\n检验：$378 - 135 = 243$。\n\n> **注意。** 要按数位把三部分合起来。把数字 $3 + 7 + 8$ 相加不是和。",
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
        const [hh, tt, oo] = [100 * (h1 + h2), 10 * (t1 + t2), o1 + o2];
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          a + b,
          [
            [
              ["Add each place", "每一位分别相加"],
              ["Hundreds, tens and ones:", "百、十、一："],
              [`${100 * h1} + ${100 * h2} = ${hh}`, `${10 * t1} + ${10 * t2} = ${tt}`, `${o1} + ${o2} = ${oo}`],
            ],
            [["Put them together", "合起来"], ["The sum:", "和："], [`${hh} + ${tt} + ${oo} = ${a + b}`]],
          ],
          [`$${a + b} - ${b} = ${a}$.`, `$${a + b} - ${b} = ${a}$。`],
          [
            [hh, "That is only the hundreds part.", "这只是百这部分。"],
            [a + b + 100, "That adds one hundred too many.", "这多加了一个百。"],
            [a + b + 10, "That adds one ten too many.", "这多加了一个十。"],
          ],
        );
      },
      captioned(partWholeBarFigure([300, 70, 8], -1), "300, 70 and 8 make 378.", "300、70、8 合起来是 378。"),
    ),
    earlyPoint(
      "when-a-part-is-too-big",
      ["When a part is too big", "某一部分满十或满百时"],
      [
        "In $256 + 188$ the parts are $200 + 100 = 300$, $50 + 80 = 130$ and $6 + 8 = 14$. Add them as ordinary numbers: $300 + 130 + 14 = 444$.\n\nCheck: $444 - 188 = 256$.\n\n> **Watch out.** 130 is 1 hundred and 3 tens. Writing only the 3 tens loses 100.",
        "在 $256 + 188$ 中，三部分是 $200 + 100 = 300$，$50 + 80 = 130$，$6 + 8 = 14$。把它们当作普通的数相加：$300 + 130 + 14 = 444$。\n\n检验：$444 - 188 = 256$。\n\n> **注意。** 130 是 1 个百和 3 个十。只写 3 个十就丢了 100。",
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
        const [hh, tt, oo] = [100 * (h1 + h2), 10 * (t1 + t2), o1 + o2];
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          sum,
          [
            [
              ["Add each place", "每一位分别相加"],
              ["Hundreds, tens and ones:", "百、十、一："],
              [`${100 * h1} + ${100 * h2} = ${hh}`, `${10 * t1} + ${10 * t2} = ${tt}`, `${o1} + ${o2} = ${oo}`],
            ],
            [["Put them together", "合起来"], ["Add them as ordinary numbers:", "当作普通的数相加："], [`${hh} + ${tt} + ${oo} = ${sum}`]],
          ],
          [`$${sum} - ${b} = ${a}$.`, `$${sum} - ${b} = ${a}$。`],
          [
            [sum - 100, `That loses the hundred inside ${tt}.`, `这丢了 ${tt} 里面的那个百。`],
            [
              sum - 10,
              oo >= 10 ? `That loses the ten inside ${oo}.` : "That is 10 too few.",
              oo >= 10 ? `这丢了 ${oo} 里面的那个十。` : "少了 10。",
            ],
            [sum + 100, "That adds one hundred too many.", "这多加了一个百。"],
          ],
        );
      },
      captioned(partWholeBarFigure([300, 130, 14], -1), "300, 130 and 14 make 444.", "300、130、14 合起来是 444。"),
    ),
  ],
  [
    "Two classes collect 243 and 135 bottle caps. They count the bags of 100 together, then the strips of 10, then the single caps: 300, 70 and 8.\n\nCheck: $300 + 70 + 8 = 378$ caps.\n\nIn this lesson we add three-digit numbers by adding hundreds, tens and ones apart and then putting them together.",
    "两个班收集了 243 和 135 个瓶盖。他们先一起数 100 个一袋的，再数 10 个一串的，最后数单个的：300、70、8。\n\n检验：$300 + 70 + 8 = 378$ 个瓶盖。\n\n本课我们把百、十、一分开相加，再合起来，做三位数加法。",
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
    {
      ...earlyPoint(
        "three-jumps-back",
        ["Three jumps back", "往回跳三次"],
        [
          "For $586 - 243$, take away 200 to reach 386, then 40 to reach 346, then 3 to reach 343.\n\nCheck: $343 + 243 = 586$.\n\n> **Watch out.** Each step starts from the last result. Going back to 586 for the tens loses the 200.",
          "求 $586 - 243$，先减 200 到 386，再减 40 到 346，再减 3 到 343。\n\n检验：$343 + 243 = 586$。\n\n> **注意。** 每一步都从上一步的结果开始。减十时回到 586，就丢了前面减的 200。",
        ],
        (rng) => {
          const h = rng.int(1, 3);
          const tens = rng.int(1, 4);
          const ones = rng.int(1, 5);
          const n = 100 * rng.int(4, 9) + 10 * rng.int(5, 9) + rng.int(6, 9);
          const b = 100 * h + 10 * tens + ones;
          const s1 = n - 100 * h;
          const s2 = s1 - 10 * tens;
          return solved(
            [`The jumps show $${n} - ${b}$. Where do they end?`, `图中的跳跃表示 $${n} - ${b}$。最后跳到哪个数？`],
            n - b,
            [
              [["Back the hundreds", "减百"], [`Take away ${100 * h}:`, `减去 ${100 * h}：`], [`${n} - ${100 * h} = ${s1}`]],
              [["Back the tens", "减十"], [`Take away ${10 * tens}:`, `减去 ${10 * tens}：`], [`${s1} - ${10 * tens} = ${s2}`]],
              [["Back the ones", "减一"], [`Take away ${ones}:`, `减去 ${ones}：`], [`${s2} - ${ones} = ${n - b}`]],
            ],
            [`$${n - b} + ${b} = ${n}$.`, `$${n - b} + ${b} = ${n}$。`],
            [
              [s1, "That stops after the hundreds.", "这只减了百。"],
              [s2, "That stops before the ones.", "这还没减一。"],
              [n - b + 100, "That takes away one hundred too few.", "这少减了一个百。"],
            ],
            hopsFigure([n, s1, s2, n - b], true),
          );
        },
      ),
      figure: gradeDrawings["three-jumps-back"],
    },
    earlyPoint(
      "the-next-step",
      ["The next step", "下一步"],
      [
        "For $586 - 243$, after $586 - 200 = 386$ the next step takes the tens of 243 away from 386: $386 - 40 = 346$.\n\nCheck: 200 and 40 and 3 make 243, so the last step will be $346 - 3$.\n\n> **Watch out.** Go on from 386, not from 586. And the 4 in 243 means 40, not 4.",
        "求 $586 - 243$，算完 $586 - 200 = 386$ 后，下一步从 386 里减去 243 的十：$386 - 40 = 346$。\n\n检验：200、40、3 合起来是 243，所以最后一步是 $346 - 3$。\n\n> **注意。** 要接着 386 算，不是回到 586。而且 243 中的 4 表示 40，不是 4。",
      ],
      (rng) => {
        const h = rng.int(1, 3);
        const tens = rng.int(1, 4);
        const ones = rng.int(1, 5);
        const n = 100 * rng.int(4, 9) + 10 * rng.int(5, 9) + rng.int(6, 9);
        const b = 100 * h + 10 * tens + ones;
        const after = n - 100 * h;
        return pickedMath(
          rng,
          [
            `To find $${n} - ${b}$, you have done $${n} - ${100 * h} = ${after}$. What should you do next?`,
            `求 $${n} - ${b}$ 时，已经算出 $${n} - ${100 * h} = ${after}$。下一步应该算什么？`,
          ],
          `${after} - ${10 * tens}`,
          [
            [
              `${n} - ${10 * tens}`,
              `That goes back to ${n} and loses the ${100 * h} already taken away.`,
              `这回到了 ${n}，丢了已经减去的 ${100 * h}。`,
            ],
            [
              `${after} - ${tens}`,
              `The ${tens} in ${b} is in the tens place, so it means ${10 * tens}.`,
              `${b} 中的 ${tens} 在十位上，表示 ${10 * tens}。`,
            ],
            [`${after} + ${10 * tens}`, "The tens are taken away, not added.", "十要减去，不是加上。"],
            [`${after} - ${100 * h}`, "The hundreds are already done.", "百已经减过了。"],
          ],
          [
            [
              ["What is done", "已经做了什么"],
              [`The ${100 * h} of ${b} is taken away, leaving ${after}.`, `${b} 的 ${100 * h} 已经减去，剩下 ${after}。`],
            ],
            [
              ["What comes next", "下一步"],
              [`Take the ${10 * tens} of ${b} from ${after}.`, `从 ${after} 里减去 ${b} 的 ${10 * tens}。`],
            ],
          ],
          [
            `$${100 * h} + ${10 * tens} + ${ones} = ${b}$, so the tens step uses ${10 * tens}.`,
            `$${100 * h} + ${10 * tens} + ${ones} = ${b}$，所以减十这一步用 ${10 * tens}。`,
          ],
        );
      },
      captioned(
        hopsFigure([586, 386, 346]),
        "586 − 243: back 200 to 386, then back 40 to 346.",
        "586 − 243：往回跳 200 到 386，再往回跳 40 到 346。",
      ),
    ),
    earlyPoint(
      "subtracting-when-ones-run-short",
      ["Subtracting when the ones run short", "个位不够减时"],
      [
        "For $532 - 147$: $532 - 100 = 432$, then $432 - 40 = 392$, then $392 - 7 = 385$.\n\nCheck: $385 + 147 = 532$.\n\n> **Watch out.** Do not swap digits to subtract the smaller from the larger. That gives 415, which is wrong.",
        "求 $532 - 147$：$532 - 100 = 432$，$432 - 40 = 392$，$392 - 7 = 385$。\n\n检验：$385 + 147 = 532$。\n\n> **注意。** 不要把数字调过来用大的减小的。那样得 415，是错的。",
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
        const s1 = a - 100 * h2;
        const s2 = s1 - 10 * t2;
        const swapped = 100 * (h1 - h2) + 10 * Math.abs(t1 - t2) + Math.abs(o1 - o2);
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          a - b,
          [
            [["Take away the hundreds", "减百"], [`Take away ${100 * h2}:`, `减去 ${100 * h2}：`], [`${a} - ${100 * h2} = ${s1}`]],
            [
              ["Take away the tens", "减十"],
              [`Take away ${10 * t2}, passing a hundred:`, `减去 ${10 * t2}，跨过整百：`],
              [`${s1} - ${10 * t2} = ${s2}`],
            ],
            [["Take away the ones", "减一"], [`Take away ${o2}, passing a ten:`, `减去 ${o2}，跨过整十：`], [`${s2} - ${o2} = ${a - b}`]],
          ],
          [`$${a - b} + ${b} = ${a}$.`, `$${a - b} + ${b} = ${a}$。`],
          [
            [swapped, "That swaps digits to subtract the smaller from the larger.", "这把数字调过来，用大的减小的。"],
            [a - b + 10, "That forgets to pass a ten.", "这忘了跨过整十。"],
            [a - b + 100, "That forgets to pass a hundred.", "这忘了跨过整百。"],
          ],
        );
      },
      captioned(
        hopsFigure([532, 432, 392, 385]),
        "532 − 147: back 100 to 432, 40 to 392, 7 to 385.",
        "532 − 147：往回 100 到 432，40 到 392，7 到 385。",
      ),
    ),
  ],
  [
    "A shop has 586 apples and sells 243. The owner takes away the full boxes of 100 first, then the bags of 10, then single apples: 386, 346, 343.\n\nCheck: $343 + 243 = 586$.\n\nIn this lesson we subtract by taking away hundreds, tens and ones one after another.",
    "商店有 586 个苹果，卖了 243 个。店主先拿走 100 个一箱的，再拿走 10 个一袋的，最后拿走单个的：386、346、343。\n\n检验：$343 + 243 = 586$。\n\n本课我们依次减去百、十、一来做减法。",
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
        "A shelf has 34 books and another has 27. In the bar model the two parts are 34 and 27, and the question mark is the whole: $34 + 27 = 61$.\n\nCheck: $61 - 27 = 34$.\n\n> **Watch out.** When the question mark is the whole, add the parts. $34 - 27$ would be the gap between them.",
        "一层架子上有 34 本书，另一层有 27 本。线段图上两部分是 34 和 27，问号在整体上：$34 + 27 = 61$。\n\n检验：$61 - 27 = 34$。\n\n> **注意。** 问号在整体上时，要把各部分相加。$34 - 27$ 是两部分相差多少。",
      ],
      (rng) => {
        const a = rng.int(18, 54);
        const b = rng.int(14, 45);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `${name} has ${a} ${thing.en} on one shelf and ${b} on another. The bar model shows the story. How many ${thing.en} are there in all?`,
            `${name} 的一层架子上有 ${a} ${thing.unit}${thing.zh}，另一层有 ${b} ${thing.unit}。线段图表示这个故事。一共有多少${thing.unit}${thing.zh}？`,
          ],
          a + b,
          [
            [
              ["Read the bar", "看线段图"],
              [`The parts are ${a} and ${b}; the whole is unknown.`, `两部分是 ${a} 和 ${b}，整体不知道。`],
            ],
            [["Add the parts", "把两部分相加"], ["The whole:", "整体："], [`${a} + ${b} = ${a + b}`]],
          ],
          [`$${a + b} - ${b} = ${a}$.`, `$${a + b} - ${b} = ${a}$。`],
          [
            [Math.abs(a - b), "That subtracts the parts. The whole is the parts added.", "这是两部分相减。整体要把两部分相加。"],
            [a + b - 10, "That is 10 too few. Check the carry into the tens.", "少了 10，检查进位。"],
            [a + b + 10, "That is 10 too many. Check the tens.", "多了 10，检查十位。"],
          ],
          partWholeBarFigure([a, b], -1),
        );
      },
      captioned(partWholeBarFigure([34, 27], -1), "Parts of 34 and 27, with the whole unknown: 61.", "两部分是 34 和 27，整体不知道：61。"),
    ),
    {
      ...earlyPoint(
        "a-part-in-a-bar",
        ["A part in a bar", "线段图中的一部分"],
        [
          "The whole is 42 and one part is 15. The question mark is the other part, so subtract: $42 - 15 = 27$.\n\nCheck: $15 + 27 = 42$.\n\n> **Watch out.** Even if the story says some more came, the bar shows a missing part, so subtract.",
          "整体是 42，一部分是 15。问号在另一部分上，所以要减：$42 - 15 = 27$。\n\n检验：$15 + 27 = 42$。\n\n> **注意。** 即使故事里说又来了一些，线段图上缺的是一部分，所以要减。",
        ],
        (rng) => {
          const all = rng.int(44, 99);
          const a = rng.int(15, all - 12);
          const name = rng.pick(earlyNames);
          const thing = rng.pick(earlyThings);
          return solved(
            [
              `${name} had ${a} ${thing.en} and then got some more. Now there are ${all}. How many did ${name} get? Use the bar model.`,
              `${name} 原来有 ${a} ${thing.unit}${thing.zh}，后来又得到一些，现在有 ${all} ${thing.unit}。${name} 得到了多少${thing.unit}？请看线段图。`,
            ],
            all - a,
            [
              [
                ["Read the bar", "看线段图"],
                [`The whole is ${all} and one part is ${a}.`, `整体是 ${all}，一部分是 ${a}。`],
              ],
              [["Find the missing part", "求缺的部分"], ["Whole minus the part:", "整体减部分："], [`${all} - ${a} = ${all - a}`]],
            ],
            [`$${a} + ${all - a} = ${all}$.`, `$${a} + ${all - a} = ${all}$。`],
            [
              [all + a, "That adds, but the whole is already known.", "这是相加，但整体已经知道了。"],
              [all, "That is the whole, not the part that was added.", "这是整体，不是得到的部分。"],
              [a, "That is the part that was there at the start.", "这是开始就有的部分。"],
            ],
            partWholeBarFigure([a, all - a], 1),
          );
        },
      ),
      figure: gradeDrawings2["stories-with-bar-models#a-part-in-a-bar"],
    },
    earlyPoint(
      "comparing-with-two-bars",
      ["Comparing with two bars", "用两个长条比较"],
      [
        "Mia has 52 shells and Leo has 35. Their bars start together, and Mia's sticks out past Leo's by $52 - 35 = 17$.\n\nCheck: $35 + 17 = 52$.\n\n> **Watch out.** How many more is the piece that sticks out, not either bar.",
        "Mia 有 52 个贝壳，Leo 有 35 个。两个长条从同一端开始，Mia 的比 Leo 的多出 $52 - 35 = 17$。\n\n检验：$35 + 17 = 52$。\n\n> **注意。** 多多少是多出来的那一段，不是哪个长条。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const big = rng.int(36, 95);
        const small = rng.int(14, big - 11);
        const thing = rng.pick(earlyThings);
        const gap = big - small;
        return rng.bool()
          ? solved(
              [
                `${p} has ${big} ${thing.en} and ${q} has ${small}. How many more does ${p} have than ${q}?`,
                `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 有 ${small} ${thing.unit}。${p} 比 ${q} 多多少${thing.unit}？`,
              ],
              gap,
              [
                [
                  ["Read the bars", "看两个长条"],
                  [`${p}'s bar is ${big} and ${q}'s is ${small}.`, `${p} 的长条是 ${big}，${q} 的是 ${small}。`],
                ],
                [["Find the piece", "求多出的一段"], ["Longer minus shorter:", "长的减短的："], [`${big} - ${small} = ${gap}`]],
              ],
              [`$${small} + ${gap} = ${big}$.`, `$${small} + ${gap} = ${big}$。`],
              [
                [big + small, "That adds the bars instead of comparing them.", "这把两个长条加起来了，没有比较。"],
                [big, `That is ${p}'s bar, not the difference.`, `这是 ${p} 的长条，不是差。`],
                [small, `That is ${q}'s bar, not the difference.`, `这是 ${q} 的长条，不是差。`],
              ],
              compareBarsFigure([p, q], [big, small], "gap"),
            )
          : solved(
              [
                `${q} has ${small} ${thing.en}, and ${p} has ${gap} more than ${q}. How many ${thing.en} does ${p} have?`,
                `${q} 有 ${small} ${thing.unit}${thing.zh}，${p} 比 ${q} 多 ${gap} ${thing.unit}。${p} 有多少${thing.unit}${thing.zh}？`,
              ],
              big,
              [
                [
                  ["Read the bars", "看两个长条"],
                  [`${p}'s bar is ${q}'s bar, ${small}, and ${gap} more.`, `${p} 的长条是 ${q} 的长条 ${small} 再多 ${gap}。`],
                ],
                [["Add", "相加"], [`${p} has:`, `${p} 有：`], [`${small} + ${gap} = ${big}`]],
              ],
              [`$${big} - ${small} = ${gap}$, the extra piece.`, `$${big} - ${small} = ${gap}$，正是多出的一段。`],
              [
                [Math.abs(small - gap), "That subtracts. More than means add.", "这是相减。比……多要相加。"],
                [small, `That is ${q}'s amount.`, `这是 ${q} 的数量。`],
                [gap, "That is only the extra piece.", "这只是多出的一段。"],
              ],
              compareBarsFigure([p, q], [big, small], "first"),
            );
      },
      captioned(
        compareBarsFigure(["A", "B"], [52, 35], "gap"),
        "Bar A is 52 and bar B is 35: the piece sticking out is 17.",
        "长条 A 是 52，长条 B 是 35：多出的一段是 17。",
      ),
    ),
  ],
  [
    "Ava has 34 stickers and gets 27 more. She draws a long bar cut into a 34 piece and a 27 piece, and puts a question mark over the whole bar.\n\nCheck: the whole bar is the two pieces together.\n\nIn this lesson we draw bar models for stories and use them to choose the right operation.",
    "Ava 有 34 张贴纸，又得到 27 张。她画一个长条，分成 34 和 27 两段，在整个长条上写一个问号。\n\n检验：整个长条就是两段合起来。\n\n本课我们为故事画线段图，用它来选对运算。",
  ],
);

const twoStepBars = earlyTopic(
  "two-step-stories-with-bar-models",
  ["Two-Step Stories With Bar Models", "用线段图解决两步问题"],
  ["Use bar models to plan and solve stories that take two steps.", "用线段图分析并解决要两步的问题。"],
  ["two-step-word-problems-within-100", "stories-with-bar-models"],
  ["2.OA.A.1"],
  [
    {
      ...earlyPoint(
        "a-whole-with-three-parts",
        ["A whole with three parts", "有三部分的整体"],
        [
          "A bar is cut into three parts, 18, 12 and 25, and the whole is missing. Add two parts first: $18 + 12 = 30$. Then add the third: $30 + 25 = 55$.\n\nCheck: add in another order, $25 + 18 = 43$ and $43 + 12 = 55$.\n\n> **Watch out.** Use all three parts. $18 + 12 = 30$ is only the first step.",
          "一个长条分成三部分：18、12、25，整体不知道。先把两部分相加：$18 + 12 = 30$。再加第三部分：$30 + 25 = 55$。\n\n检验：换个顺序加，$25 + 18 = 43$，$43 + 12 = 55$。\n\n> **注意。** 三部分都要用。$18 + 12 = 30$ 只是第一步。",
        ],
        (rng) => {
          const a = rng.int(12, 28);
          const b = rng.int(12, 28);
          const c = rng.int(11, 26);
          const name = rng.pick(earlyNames);
          const thing = rng.pick(earlyThings);
          const all = a + b + c;
          return solved(
            [
              `${name} collects ${a} ${thing.en} on Monday, ${b} on Tuesday and ${c} on Wednesday. How many ${thing.en} is that in all?`,
              `${name} 星期一收集了 ${a} ${thing.unit}${thing.zh}，星期二收集了 ${b} ${thing.unit}，星期三收集了 ${c} ${thing.unit}。一共收集了多少${thing.unit}${thing.zh}？`,
            ],
            all,
            [
              [["Add two parts", "先加两部分"], ["Monday and Tuesday:", "星期一和星期二："], [`${a} + ${b} = ${a + b}`]],
              [["Add the third", "再加第三部分"], ["Then Wednesday:", "再加星期三："], [`${a + b} + ${c} = ${all}`]],
            ],
            [
              `Add in another order: $${b} + ${c} = ${b + c}$ and $${b + c} + ${a} = ${all}$.`,
              `换个顺序加：$${b} + ${c} = ${b + c}$，$${b + c} + ${a} = ${all}$。`,
            ],
            [
              [a + b, "That stops after two days. Add Wednesday too.", "这只加了两天。还要加星期三。"],
              [b + c, "That leaves out Monday.", "这漏了星期一。"],
              [all - 10, "That is 10 too few. Check the carry into the tens.", "少了 10，检查进位。"],
            ],
            partWholeBarFigure([a, b, c], -1),
          );
        },
      ),
      figure: gradeDrawings2["two-step-stories-with-bar-models#a-whole-with-three-parts"],
    },
    earlyPoint(
      "taking-away-two-amounts",
      ["Taking away two amounts", "减去两部分"],
      [
        "Sara has 60 cards and gives away 18 and then 22. The two gifts are $18 + 22 = 40$, so $60 - 40 = 20$ are left.\n\nCheck: take them away one at a time: $60 - 18 = 42$ and $42 - 22 = 20$.\n\n> **Watch out.** Take away both gifts. $60 - 18 = 42$ is only part of the way.",
        "Sara 有 60 张卡片，先送出 18 张，又送出 22 张。送出的合起来是 $18 + 22 = 40$，所以还剩 $60 - 40 = 20$ 张。\n\n检验：一次减一个：$60 - 18 = 42$，$42 - 22 = 20$。\n\n> **注意。** 两次送出的都要减。$60 - 18 = 42$ 只算了一半。",
      ],
      (rng) => {
        const a = rng.int(12, 28);
        const b = rng.int(11, 26);
        const left = rng.int(11, 40);
        const all = a + b + left;
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `${name} has ${all} ${thing.en}, and gives ${a} to one friend and ${b} to another. How many are left?`,
            `${name} 有 ${all} ${thing.unit}${thing.zh}，送给一个朋友 ${a} ${thing.unit}，又送给另一个朋友 ${b} ${thing.unit}。还剩多少${thing.unit}？`,
          ],
          left,
          [
            [["Add the gifts", "把送出的加起来"], ["The two gifts:", "两次送出的："], [`${a} + ${b} = ${a + b}`]],
            [["Take them away", "减去"], ["From the whole:", "从总数中减去："], [`${all} - ${a + b} = ${left}`]],
          ],
          [
            `One at a time: $${all} - ${a} = ${all - a}$ and $${all - a} - ${b} = ${left}$.`,
            `一次减一个：$${all} - ${a} = ${all - a}$，$${all - a} - ${b} = ${left}$。`,
          ],
          [
            [a + b, "That is what was given away, not what is left.", "这是送出去的，不是剩下的。"],
            [all - a, "That takes away only the first gift.", "这只减了第一次送出的。"],
            [all - b, "That takes away only the second gift.", "这只减了第二次送出的。"],
          ],
          partWholeBarFigure([a, b, left], 2),
        );
      },
      captioned(
        partWholeBarFigure([18, 22, 20], 2),
        "60 cut into 18, 22 and the part left, which is 20.",
        "60 分成 18、22 和剩下的部分，剩下的是 20。",
      ),
    ),
    earlyPoint(
      "comparing-and-then-adding",
      ["Comparing and then adding", "先比较，再相加"],
      [
        "Ava has 20 beads and Ben has 12 more than Ava. First find Ben's: $20 + 12 = 32$. Then add both: $20 + 32 = 52$.\n\nCheck: $52 - 32 = 20$, Ava's beads.\n\n> **Watch out.** 12 is how many more, not how many Ben has. Find Ben's amount first.",
        "Ava 有 20 颗珠子，Ben 比 Ava 多 12 颗。先求 Ben 的：$20 + 12 = 32$。再把两人的加起来：$20 + 32 = 52$。\n\n检验：$52 - 32 = 20$，正是 Ava 的珠子。\n\n> **注意。** 12 是多出的数，不是 Ben 有的数。要先求出 Ben 有多少。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const small = rng.int(12, 34);
        const gap = rng.int(5, 19);
        const big = small + gap;
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `${q} has ${small} ${thing.en}, and ${p} has ${gap} more than ${q}. How many ${thing.en} do they have together?`,
            `${q} 有 ${small} ${thing.unit}${thing.zh}，${p} 比 ${q} 多 ${gap} ${thing.unit}。两人一共有多少${thing.unit}${thing.zh}？`,
          ],
          small + big,
          [
            [
              [`Find ${p}'s amount`, `求 ${p} 的数量`],
              [`${gap} more than ${small}:`, `比 ${small} 多 ${gap}：`],
              [`${small} + ${gap} = ${big}`],
            ],
            [["Add both", "两人相加"], ["Together:", "一共："], [`${small} + ${big} = ${small + big}`]],
          ],
          [`$${small + big} - ${big} = ${small}$, ${q}'s amount.`, `$${small + big} - ${big} = ${small}$，正是 ${q} 的数量。`],
          [
            [big, `That is ${p}'s amount alone. Add ${q}'s too.`, `这只是 ${p} 的数量。还要加上 ${q} 的。`],
            [small + gap, `That is ${p}'s amount alone. Add ${q}'s too.`, `这只是 ${p} 的数量。还要加上 ${q} 的。`],
            [2 * small, `That gives ${p} the same as ${q}. ${p} has ${gap} more.`, `这让 ${p} 和 ${q} 一样多。${p} 多 ${gap}。`],
            [big + gap, `That adds the ${gap} twice.`, `这把 ${gap} 加了两次。`],
          ],
          compareBarsFigure([p, q], [big, small], "first"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [32, 20], "none"),
        "Bar B is 20 and bar A is 12 longer, 32: together 52.",
        "长条 B 是 20，长条 A 比它长 12，是 32：一共 52。",
      ),
    ),
  ],
  [
    "A class picks up 18 cans on Monday, 12 on Tuesday and 25 on Wednesday. One bar with three pieces shows all of it, and the whole bar is the total.\n\nCheck: $18 + 12 + 25 = 55$ cans.\n\nIn this lesson we use bar models to plan stories that take two steps.",
    "一个班星期一捡了 18 个易拉罐，星期二 12 个，星期三 25 个。一个分成三段的长条能表示全部，整个长条就是总数。\n\n检验：$18 + 12 + 25 = 55$ 个易拉罐。\n\n本课我们用线段图分析要两步的故事。",
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
        "Tom had 25 marbles, got some more, and now has 40. Write it in order: start 25, add the unknown, end 40: $25 + \\square = 40$.\n\nCheck: the box is 15, and $25 + 15 = 40$.\n\n> **Watch out.** The box goes where the unknown number is in the story. $25 + 40 = \\square$ would add the end to the start.",
        "Tom 原来有 25 颗弹珠，又得到一些，现在有 40 颗。按顺序写：开始 25，加上不知道的数，最后 40：$25 + \\square = 40$。\n\n检验：方框是 15，$25 + 15 = 40$。\n\n> **注意。** 方框写在故事里不知道的数的位置。$25 + 40 = \\square$ 是把最后的数加到了开始的数上。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(16, 58);
        const b = rng.int(12, 35);
        const c = a + b;
        return pickedMath(
          rng,
          [
            `${name} had ${a} ${thing.en} and got some more. Now ${name} has ${c}. Which sentence tells this story?`,
            `${name} 原来有 ${a} ${thing.unit}${thing.zh}，后来又得到一些，现在有 ${c} ${thing.unit}。哪个算式能表示这个故事？`,
          ],
          `${a} + \\square = ${c}`,
          [
            [`${a} + ${c} = \\square`, `${c} is the end, not a number that was added.`, `${c} 是最后的数，不是加上的数。`],
            [`${c} + \\square = ${a}`, `The story starts with ${a}, not ${c}.`, `故事是从 ${a} 开始的，不是 ${c}。`],
            [`\\square - ${a} = ${c}`, "Nothing was taken away in the story.", "故事里没有拿走东西。"],
          ],
          [
            [
              ["Follow the story", "按故事顺序"],
              [`Start with ${a}, add some, end with ${c}.`, `从 ${a} 开始，加上一些，最后是 ${c}。`],
            ],
            [["Box the unknown", "未知数用方框"], ["The amount added is unknown:", "加上的数不知道："], [`${a} + \\square = ${c}`]],
          ],
          [`The box is ${b}, and $${a} + ${b} = ${c}$.`, `方框是 ${b}，$${a} + ${b} = ${c}$。`],
        );
      },
      captioned(
        partWholeBarFigure([25, 15], 1),
        "Start 25, the unknown part, end 40: 25 + ? = 40.",
        "开始 25，未知的部分，最后 40：25 + ? = 40。",
      ),
    ),
    earlyPoint(
      "unknown-at-the-start",
      ["The unknown at the start", "未知数在开头"],
      [
        "Jo had some stickers, gave away 14, and has 30 left. The first number is unknown, so the box goes first: $\\square - 14 = 30$.\n\nCheck: the box is $30 + 14 = 44$, and $44 - 14 = 30$.\n\n> **Watch out.** The box is the start, not the end. $30 - 14 = \\square$ starts with what is left.",
        "Jo 原来有一些贴纸，送出 14 张，还剩 30 张。开始的数不知道，所以方框写在最前面：$\\square - 14 = 30$。\n\n检验：方框是 $30 + 14 = 44$，$44 - 14 = 30$。\n\n> **注意。** 方框是开始的数，不是最后的数。$30 - 14 = \\square$ 是从剩下的数开始的。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const b = rng.int(14, 35);
        const left = rng.int(15, 58);
        return pickedMath(
          rng,
          [
            `${name} had some ${thing.en} and gave away ${b}. Now ${left} are left. Which sentence tells this story?`,
            `${name} 原来有一些${thing.zh}，送出去 ${b} ${thing.unit}，还剩 ${left} ${thing.unit}。哪个算式能表示这个故事？`,
          ],
          `\\square - ${b} = ${left}`,
          [
            [`${b} - \\square = ${left}`, `The story starts with the unknown, not with ${b}.`, `故事是从不知道的数开始的，不是 ${b}。`],
            [`${left} - ${b} = \\square`, `${left} is what is left at the end, not the start.`, `${left} 是最后剩下的，不是开始的数。`],
            [
              `\\square + ${b} = ${left}`,
              `${b} were given away, so they are taken away, not added.`,
              `${b} 是送出去的，要减去，不是加上。`,
            ],
          ],
          [
            [
              ["Follow the story", "按故事顺序"],
              [`Some at the start, take away ${b}, ${left} left.`, `开始有一些，减去 ${b}，剩 ${left}。`],
            ],
            [["Box the unknown", "未知数用方框"], ["The start is unknown:", "开始的数不知道："], [`\\square - ${b} = ${left}`]],
          ],
          [
            `The box is $${left} + ${b} = ${left + b}$, and $${left + b} - ${b} = ${left}$.`,
            `方框是 $${left} + ${b} = ${left + b}$，$${left + b} - ${b} = ${left}$。`,
          ],
        );
      },
      captioned(
        partWholeBarFigure([14, 30], -1),
        "The unknown start is cut into 14 given away and 30 left.",
        "未知的开始数分成送出的 14 和剩下的 30。",
      ),
    ),
    earlyPoint(
      "one-sentence-for-two-steps",
      ["One sentence for two steps", "用一个算式表示两步"],
      [
        "Kim has 40 cards, gets 15 more, and gives away 12. In order: $40 + 15 - 12 = \\square$.\n\nCheck: $40 + 15 = 55$ and $55 - 12 = 43$, which is a sensible number of cards.\n\n> **Watch out.** Getting more is $+$ and giving away is $-$. Swapping the signs tells a different story.",
        "Kim 有 40 张卡片，又得到 15 张，再送出 12 张。按顺序写：$40 + 15 - 12 = \\square$。\n\n检验：$40 + 15 = 55$，$55 - 12 = 43$，卡片数量合理。\n\n> **注意。** 得到是 $+$，送出是 $-$。符号调换了，故事就变了。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(25, 55);
        const b = rng.int(11, 30);
        const c = rng.int(10, 24);
        return pickedMath(
          rng,
          [
            `${name} has ${a} ${thing.en}, gets ${b} more, and then gives away ${c}. Which sentence tells this story?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}，然后送出去 ${c} ${thing.unit}。哪个算式能表示这个故事？`,
          ],
          `${a} + ${b} - ${c} = \\square`,
          [
            [
              `${a} - ${b} + ${c} = \\square`,
              "The signs are swapped: getting more adds and giving away takes away.",
              "符号调换了：得到要加，送出要减。",
            ],
            [
              `${a} + ${b} + ${c} = \\square`,
              `Giving away ${c} takes them away, so it needs a minus sign.`,
              `送出 ${c} 要减去，应该用减号。`,
            ],
            [`${a} - ${b} - ${c} = \\square`, `Getting ${b} more adds them, so it needs a plus sign.`, `又得到 ${b} 要加上，应该用加号。`],
          ],
          [
            [
              ["First step", "第一步"],
              [`Gets ${b} more: add ${b}.`, `又得到 ${b}：加 ${b}。`],
            ],
            [
              ["Second step", "第二步"],
              [`Gives away ${c}: take away ${c}.`, `送出 ${c}：减 ${c}。`],
            ],
          ],
          [
            `$${a} + ${b} = ${a + b}$ and $${a + b} - ${c} = ${a + b - c}$.`,
            `$${a} + ${b} = ${a + b}$，$${a + b} - ${c} = ${a + b - c}$。`,
          ],
        );
      },
      captioned(hopsFigure([40, 55, 43]), "From 40, up 15 to 55, then back 12 to 43.", "从 40 往前 15 到 55，再往回 12 到 43。"),
    ),
  ],
  [
    "Leo had 25 marbles, won some, and now has 40. A number sentence tells the story in order, with a box for the number we do not know: $25 + \\square = 40$.\n\nCheck: the box is 15, since $25 + 15 = 40$.\n\nIn this lesson we choose the number sentence with a box that matches a story.",
    "Leo 原来有 25 颗弹珠，赢了一些，现在有 40 颗。算式按故事的顺序写，不知道的数用方框：$25 + \\square = 40$。\n\n检验：方框是 15，因为 $25 + 15 = 40$。\n\n本课我们选出与故事相符的、带方框的算式。",
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
        "Do 1 quarter, 2 dimes and 3 pennies make 48 cents? Count from the biggest coin: 25, 35, 45, then 46, 47, 48. Yes, they do.\n\nCheck: $25 + 20 + 3 = 48$.\n\n> **Watch out.** A dime is smaller than a nickel but worth more: a dime is 10 cents and a nickel is 5.",
        "1 枚 25 美分、2 枚 10 美分和 3 枚 1 美分硬币是 48 美分吗？从面值最大的数起：25、35、45，再 46、47、48。是的。\n\n检验：$25 + 20 + 3 = 48$。\n\n> **注意。** 10 美分硬币比 5 美分硬币小，却更值钱：10 美分硬币是 10 美分，5 美分硬币是 5 美分。",
      ],
      (rng) => {
        const q = rng.int(0, 3);
        const d = rng.int(1, 3);
        const n = rng.int(0, 2);
        const p = rng.int(0, 4);
        const total = 25 * q + 10 * d + 5 * n + p;
        const big = [25 * q, 10 * d].filter((v) => v > 0);
        const small = [5 * n, p].filter((v) => v > 0);
        const wrongBy = (q2: number, d2: number, n2: number, p2: number): Wrong => {
          const v = 25 * q2 + 10 * d2 + 5 * n2 + p2;
          return [coinGroup(q2, d2, n2, p2), `These coins make ${v} cents, not ${total}.`, `这些硬币是 ${v} 美分，不是 ${total} 美分。`];
        };
        return picked(
          rng,
          [`Which coins make ${total} cents?`, `哪一组硬币正好是 ${total} 美分？`],
          coinGroup(q, d, n, p),
          [wrongBy(q, d + 1, n, p), wrongBy(q + 1, d, n, p), wrongBy(q, d - 1, n, p + 1), wrongBy(q, d, n + 1, p)],
          [
            [
              ["Count the big coins", "先数大面值的"],
              ["Quarters and dimes first:", "先数 25 美分和 10 美分："],
              [`${big.join(" + ")} = ${25 * q + 10 * d}`],
            ],
            [
              ["Count on the rest", "再接着数"],
              small.length > 0
                ? ["Then the nickels and pennies:", "再数 5 美分和 1 美分："]
                : ["There are no nickels or pennies, so that is all.", "没有 5 美分和 1 美分硬币，就这么多。"],
              small.length > 0 ? [`${25 * q + 10 * d} + ${small.join(" + ")} = ${total}`] : [],
            ],
          ],
          [
            `Count the smallest coins first: $${[p, 5 * n, 10 * d, 25 * q].filter((v) => v > 0).join(" + ")} = ${total}$.`,
            `从面值最小的数起：$${[p, 5 * n, 10 * d, 25 * q].filter((v) => v > 0).join(" + ")} = ${total}$。`,
          ],
        );
      },
      captioned(
        coinsFigure([25, 10, 10, 1, 1, 1]),
        "A quarter, 2 dimes and 3 pennies: 48 cents.",
        "1 枚 25 美分、2 枚 10 美分和 3 枚 1 美分：48 美分。",
      ),
    ),
    earlyPoint(
      "how-much-more-is-needed",
      ["How much more is needed", "还差多少"],
      [
        "Sam has a quarter and a dime, which is 35 cents. The toy costs 50 cents. Count up from 35: 40, 45, 50. That is 3 nickels, so Sam needs 15 cents more.\n\nCheck: $35 + 15 = 50$.\n\n> **Watch out.** The answer is the cents still needed, not the price of the toy.",
        "Sam 有 1 枚 25 美分和 1 枚 10 美分，共 35 美分。玩具要 50 美分。从 35 往上数：40、45、50，是 3 个 5 美分，所以还差 15 美分。\n\n检验：$35 + 15 = 50$。\n\n> **注意。** 要求的是还差多少，不是玩具的价钱。",
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
        return solved(
          [
            `${name} has these coins and wants to buy a toy for ${price} cents. How many more cents does ${name} need?`,
            `${name} 有这些硬币，想买一个 ${price} 美分的玩具。还差多少美分？`,
          ],
          price - have,
          [
            [["Count the coins", "数硬币"], ["From the biggest coin:", "从面值最大的数起："], [`${coins.join(" + ")} = ${have}`]],
            [
              ["Count up to the price", "往上数到价钱"],
              [`From ${have} up to ${price}:`, `从 ${have} 数到 ${price}：`],
              [`${price} - ${have} = ${price - have}`],
            ],
          ],
          [`$${have} + ${price - have} = ${price}$.`, `$${have} + ${price - have} = ${price}$。`],
          [
            [price, "That is the price, not the cents still needed.", "这是价钱，不是还差的钱。"],
            [have, `That is what ${name} has already.`, `这是 ${name} 已经有的钱。`],
            [
              price + have,
              "That adds the coins to the price. Count up from the coins instead.",
              "这把硬币和价钱加起来了。应该从已有的钱往上数。",
            ],
          ],
          coinsFigure(coins),
        );
      },
      captioned(
        coinsFigure([25, 10]),
        "A quarter and a dime: 35 cents, 15 short of 50.",
        "1 枚 25 美分和 1 枚 10 美分：35 美分，离 50 还差 15。",
      ),
    ),
    earlyPoint(
      "using-the-fewest-coins",
      ["Using the fewest coins", "用最少的硬币"],
      [
        "Make 41 cents with as few coins as you can. Take the biggest coin that fits: a quarter leaves 16, a dime leaves 6, a nickel leaves 1, and a penny leaves 0. That is 4 coins.\n\nCheck: $25 + 10 + 5 + 1 = 41$.\n\n> **Watch out.** Do not skip the quarter. 41 cents made from dimes and pennies takes 5 coins.",
        "用最少的硬币凑 41 美分。每次拿用得上的最大硬币：25 美分后剩 16，10 美分后剩 6，5 美分后剩 1，1 美分后剩 0。一共 4 枚。\n\n检验：$25 + 10 + 5 + 1 = 41$。\n\n> **注意。** 不要跳过 25 美分硬币。只用 10 美分和 1 美分凑 41 美分，要 5 枚。",
      ],
      (rng) => {
        const amount = rng.int(26, 99);
        const q = Math.floor(amount / 25);
        const afterQ = amount - 25 * q;
        const d = Math.floor(afterQ / 10);
        const afterD = afterQ - 10 * d;
        const n = Math.floor(afterD / 5);
        const p = afterD - 5 * n;
        const count = q + d + n + p;
        const noQuarters = Math.floor(amount / 10) + Math.floor((amount % 10) / 5) + (amount % 5);
        const parts = [
          ...Array<number>(q).fill(25),
          ...Array<number>(d).fill(10),
          ...Array<number>(n).fill(5),
          ...Array<number>(p).fill(1),
        ];
        return solved(
          [`What is the fewest number of coins that make ${amount} cents?`, `凑成 ${amount} 美分，最少要用多少枚硬币？`],
          count,
          [
            [
              ["Biggest coins first", "先用大面值"],
              [`${q} ${q === 1 ? "quarter" : "quarters"} leave ${afterQ} cents.`, `${q} 枚 25 美分硬币后剩 ${afterQ} 美分。`],
            ],
            [
              ["Then the smaller coins", "再用小面值"],
              [`${coinGroup(q, d, n, p)[0]}:`, `${coinGroup(q, d, n, p)[1]}：`],
              [`${parts.join(" + ")} = ${amount}`],
            ],
          ],
          [`That is ${count} coins, and they add up to ${amount} cents.`, `一共 ${count} 枚，加起来是 ${amount} 美分。`],
          [
            [amount, "That is the number of cents, not the number of coins.", "这是美分数，不是硬币的枚数。"],
            [noQuarters, "That leaves out the quarters, so it needs more coins.", "这没有用 25 美分硬币，所以要更多枚。"],
            [
              n === 1 ? count + 4 : count + 1,
              n === 1 ? "That uses 5 pennies where one nickel would do." : "That is one coin too many. Use the biggest coin that fits.",
              n === 1 ? "这用 5 枚 1 美分代替了 1 枚 5 美分。" : "多了一枚。每次要用最大的、用得上的硬币。",
            ],
          ],
        );
      },
      captioned(
        coinsFigure([25, 10, 5, 1]),
        "41 cents with the fewest coins: a quarter, a dime, a nickel and a penny.",
        "用最少的硬币凑 41 美分：25 美分、10 美分、5 美分和 1 美分各 1 枚。",
      ),
    ),
  ],
  [
    "Lily wants a 48 cent pencil. She has a quarter, 2 dimes and 3 pennies. She counts 25, 35, 45, 46, 47, 48, so she can buy it.\n\nCheck: $25 + 20 + 3 = 48$.\n\nIn this lesson we pick coins that make an amount, find how much more is needed, and use the fewest coins.",
    "Lily 想买一支 48 美分的铅笔。她有 1 枚 25 美分、2 枚 10 美分和 3 枚 1 美分硬币。她数：25、35、45、46、47、48，正好够买。\n\n检验：$25 + 20 + 3 = 48$。\n\n本课我们选出能凑成一个钱数的硬币，求出还差多少，并用最少的硬币凑钱。",
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
        "A toy costs 65 cents and you pay with a dollar, which is 100 cents. Count up: 5 more makes 70, and 30 more makes 100. The change is $5 + 30 = 35$ cents.\n\nCheck: $65 + 35 = 100$.\n\n> **Watch out.** Add both jumps. The jump of 30 alone is not the change.",
        "一个玩具 65 美分，你付 1 美元，也就是 100 美分。往上数：再 5 到 70，再 30 到 100。找零是 $5 + 30 = 35$ 美分。\n\n检验：$65 + 35 = 100$。\n\n> **注意。** 两跳都要加上。只有 30 那一跳不是找零。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(1, 9);
        const price = 10 * tens + ones;
        const next = 10 * (tens + 1);
        return solved(
          [
            `A toy costs ${price} cents and you pay with \\$1. The jumps count up from the price. How many cents of change do you get?`,
            `一个玩具 ${price} 美分，你付了 1 美元。图中的跳跃从价钱往上数。应该找回多少美分？`,
          ],
          100 - price,
          [
            [
              ["Jump to a ten", "跳到整十"],
              [`From ${price} to ${next}:`, `从 ${price} 到 ${next}：`],
              [`${price} + ${next - price} = ${next}`],
            ],
            [["Jump to 100", "跳到 100"], [`From ${next} to 100:`, `从 ${next} 到 100：`], [`${next} + ${100 - next} = 100`]],
            [["Add the jumps", "把两跳相加"], ["The change:", "找零："], [`${next - price} + ${100 - next} = ${100 - price}`]],
          ],
          [`$${price} + ${100 - price} = 100$.`, `$${price} + ${100 - price} = 100$。`],
          [
            [100 - next, "That is only the second jump. Add the first jump too.", "这只是第二跳，还要加上第一跳。"],
            [110 - price, "That is 10 too many. The first jump only goes to the next ten.", "多了 10。第一跳只到下一个整十。"],
            [price, "That is the price, not the change.", "这是价钱，不是找零。"],
          ],
          hopsFigure([price, next, 100]),
        );
      },
      captioned(
        hopsFigure([65, 70, 100]),
        "From 65, a jump of 5 to 70, then 30 to 100: 35 in all.",
        "从 65 跳 5 到 70，再跳 30 到 100：一共 35。",
      ),
    ),
    earlyPoint(
      "the-change-in-cents",
      ["The change in cents", "找回多少美分"],
      [
        "A pencil costs 37 cents and you pay \\$1. The ones need $3$ to make ten. That ten joins the 3 tens, so the tens need 6 more to make 10 tens. The change is 6 tens and 3 ones, 63 cents.\n\nCheck: $37 + 63 = 100$.\n\n> **Watch out.** The tens only need to reach 9, because the ones make the last ten. 73 would be 10 too many.",
        "一支铅笔 37 美分，你付 1 美元。个位要 3 才凑成十。这个十加到 3 个十里，十位再要 6 个十就是 10 个十。所以找零是 6 个十和 3 个一，63 美分。\n\n检验：$37 + 63 = 100$。\n\n> **注意。** 十位只要凑到 9，因为个位凑成了最后一个十。73 就多了 10。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const ones = rng.int(1, 9);
        const price = 10 * tens + ones;
        const name = rng.pick(earlyNames);
        const item = rng.pick<Pair>([
          ["a pencil", "一支铅笔"],
          ["a sticker", "一张贴纸"],
          ["an eraser", "一块橡皮"],
          ["a notebook", "一个笔记本"],
          ["a bag of chips", "一袋薯片"],
        ]);
        return solved(
          [
            `${name} buys ${item[0]} for ${price} cents and pays with \\$1. How many cents of change does ${name} get?`,
            `${name} 买${item[1]}，花了 ${price} 美分，付了 1 美元。应该找回多少美分？`,
          ],
          100 - price,
          [
            [
              ["Make the ones a ten", "个位凑成十"],
              [`${ones} needs ${10 - ones}:`, `${ones} 要 ${10 - ones}：`],
              [`${ones} + ${10 - ones} = 10`],
            ],
            [
              ["Make the tens up to 9", "十位凑到 9"],
              [`${tens} tens need ${9 - tens} more tens:`, `${tens} 个十还要 ${9 - tens} 个十：`],
              [`${tens} + ${9 - tens} = 9`],
            ],
            [
              ["Put them together", "合起来"],
              [`${9 - tens} tens and ${10 - ones} ones:`, `${9 - tens} 个十和 ${10 - ones} 个一：`],
              [`100 - ${price} = ${100 - price}`],
            ],
          ],
          [`Add back: $${price} + ${100 - price} = 100$.`, `加回去：$${price} + ${100 - price} = 100$。`],
          [
            [
              110 - price,
              "That makes the tens up to 10, but the ones already made one ten.",
              "这把十位凑到了 10，但个位已经凑成一个十了。",
            ],
            [price, "That is the price, not the change.", "这是价钱，不是找零。"],
            [
              100 + price,
              "That adds the price to the dollar. Change is what is left, so subtract.",
              "这把价钱和一美元加起来了。找零是剩下的钱，要减。",
            ],
          ],
        );
      },
      captioned(
        hopsFigure([37, 40, 100]),
        "From 37, 3 to 40 and 60 to 100: the change is 63.",
        "从 37 数 3 到 40，再数 60 到 100：找零是 63。",
      ),
    ),
    earlyPoint(
      "which-coins-are-the-change",
      ["Which coins are the change", "哪些硬币是找零"],
      [
        "A snack costs 65 cents and you pay \\$1. The change is $100 - 65 = 35$ cents. A quarter and a dime make $25 + 10 = 35$, so they are right.\n\nCheck: $65 + 35 = 100$.\n\n> **Watch out.** Count every coin. A group that comes close, like 40 cents, is not the right change.",
        "一份零食 65 美分，你付 1 美元。找零是 $100 - 65 = 35$ 美分。1 枚 25 美分和 1 枚 10 美分是 $25 + 10 = 35$，所以是对的。\n\n检验：$65 + 35 = 100$。\n\n> **注意。** 每枚硬币都要数。差一点的，比如 40 美分，也不是正确的找零。",
      ],
      (rng) => {
        const q = rng.int(0, 2);
        const d = rng.int(0, 2);
        const n = rng.int(q + d === 0 ? 1 : 0, 1);
        const p = rng.int(0, 4);
        const change = 25 * q + 10 * d + 5 * n + p;
        const price = 100 - change;
        const off = (q2: number, d2: number, n2: number, p2: number, extra: number): Wrong => [
          coinGroup(q2, d2, n2, p2),
          `These coins make ${change + extra} cents, but the change is ${change} cents.`,
          `这些硬币是 ${change + extra} 美分，但应找 ${change} 美分。`,
        ];
        const values = [25 * q, 10 * d, 5 * n, p].filter((v) => v > 0);
        return picked(
          rng,
          [
            `A snack costs ${price} cents and you pay with \\$1. Which coins are the right change?`,
            `一份零食 ${price} 美分，你付了 1 美元。哪一组硬币是正确的找零？`,
          ],
          coinGroup(q, d, n, p),
          [off(q, d + 1, n, p, 10), off(q + 1, d, n, p, 25), off(q, d, n + 1, p, 5), off(q, d, n, p + 1, 1)],
          [
            [["Find the change", "求找零"], ["Subtract the price from 100:", "用 100 减去价钱："], [`100 - ${price} = ${change}`]],
            [
              ["Count the coins", "数硬币"],
              ["The right coins add up to the change:", "正确的硬币加起来等于找零："],
              [`${values.join(" + ")} = ${change}`],
            ],
          ],
          [`$${price} + ${change} = 100$.`, `$${price} + ${change} = 100$。`],
        );
      },
      captioned(
        coinsFigure([25, 10]),
        "A quarter and a dime: 35 cents, the change from 65 cents.",
        "1 枚 25 美分和 1 枚 10 美分：35 美分，是 65 美分的找零。",
      ),
    ),
  ],
  [
    "Max buys a 65 cent apple and pays with a dollar. The shopkeeper counts up: 5 cents makes 70, and 30 cents makes 100. Max gets 35 cents back.\n\nCheck: $65 + 35 = 100$.\n\nIn this lesson we find the change from a dollar by counting up or by subtracting from 100.",
    "Max 买一个 65 美分的苹果，付了 1 美元。店员往上数：5 美分到 70，30 美分到 100。Max 找回 35 美分。\n\n检验：$65 + 35 = 100$。\n\n本课我们用往上数或用 100 减的方法，求一美元的找零。",
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
        "The clock shows 7:15. The long hand is on the 3, one quarter of the way round, and the short hand is just past the 7. So it is a quarter past 7.\n\nCheck: four quarters of 15 minutes make $15 + 15 + 15 + 15 = 60$ minutes, one hour.\n\n> **Watch out.** A quarter past uses the hour just gone, 7, not the next hour.",
        "钟上是 7:15。长针指着 3，走了四分之一圈，短针刚过 7。所以是 7 点一刻。\n\n检验：四个一刻是 $15 + 15 + 15 + 15 = 60$ 分钟，正好一小时。\n\n> **注意。** 几点一刻用的是刚过去的整点 7，不是下一个整点。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const next = clockHour(h + 1);
        return picked(
          rng,
          ["What time does this clock show?", "这个钟显示的是什么时间？"],
          [`A quarter past ${h}`, `${h} 点一刻`],
          rng.sample<Wrong>(
            [
              [[`A quarter to ${h}`, `差一刻 ${h} 点`], "For a quarter to, the long hand would be on the 9.", "差一刻时，长针应指着 9。"],
              [
                [`A quarter past ${next}`, `${next} 点一刻`],
                `The short hand has just passed the ${h}, not the ${next}.`,
                `短针刚过 ${h}，不是 ${next}。`,
              ],
              [[`Half past ${h}`, `${h} 点半`], "For half past, the long hand would be on the 6.", "几点半时，长针应指着 6。"],
              [
                [`A quarter to ${next}`, `差一刻 ${next} 点`],
                "For a quarter to, the long hand would be on the 9.",
                "差一刻时，长针应指着 9。",
              ],
            ],
            3,
          ),
          [
            [
              ["Read the long hand", "看长针"],
              ["It is on the 3: 15 minutes, one quarter of the hour.", "长针指着 3：15 分，一刻钟。"],
            ],
            [
              ["Read the short hand", "看短针"],
              [`It has just passed the ${h}, so the time is ${clockText(h, 15)}.`, `短针刚过 ${h}，所以是 ${clockText(h, 15)}。`],
            ],
          ],
          [
            `${clockText(h, 15)} is 15 minutes after ${h}:00, a quarter past ${h}.`,
            `${clockText(h, 15)} 是 ${h}:00 过 15 分，也就是 ${h} 点一刻。`,
          ],
          clockFigure(h, 15),
        );
      },
      captioned(clockFigure(7, 15), "A clock at 7:15: the long hand on the 3.", "7:15 的钟：长针指着 3。"),
    ),
    earlyPoint(
      "a-quarter-to",
      ["A quarter to", "差一刻几点"],
      [
        "The clock shows 7:45. The long hand is on the 9, so 15 minutes are left before 8:00. We say it is a quarter to 8.\n\nCheck: $7{:}45$ and 15 more minutes is $8{:}00$.\n\n> **Watch out.** A quarter to uses the next hour. 7:45 is a quarter to 8, not a quarter to 7.",
        "钟上是 7:45。长针指着 9，离 8:00 还差 15 分。我们说是差一刻 8 点。\n\n检验：$7{:}45$ 再过 15 分钟是 $8{:}00$。\n\n> **注意。** 差一刻说的是下一个整点。7:45 是差一刻 8 点，不是差一刻 7 点。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const next = clockHour(h + 1);
        return picked(
          rng,
          ["What time does this clock show?", "这个钟显示的是什么时间？"],
          [`A quarter to ${next}`, `差一刻 ${next} 点`],
          rng.sample<Wrong>(
            [
              [
                [`A quarter to ${h}`, `差一刻 ${h} 点`],
                `The ${h} o'clock hour has already started. A quarter to names the next hour, ${next}.`,
                `${h} 点已经过了。差一刻说的是下一个整点 ${next}。`,
              ],
              [
                [`A quarter past ${next}`, `${next} 点一刻`],
                `It is not yet ${next}:00, and the long hand is on the 9, not the 3.`,
                `还没到 ${next}:00，长针指着 9，不是 3。`,
              ],
              [
                [`A quarter past ${h}`, `${h} 点一刻`],
                "For a quarter past, the long hand would be on the 3.",
                "几点一刻时，长针应指着 3。",
              ],
              [[`Half past ${h}`, `${h} 点半`], "For half past, the long hand would be on the 6.", "几点半时，长针应指着 6。"],
            ],
            3,
          ),
          [
            [
              ["Read the long hand", "看长针"],
              ["It is on the 9: 45 minutes, so 15 minutes are left in the hour.", "长针指着 9：45 分，这个小时还剩 15 分。"],
            ],
            [
              ["Name the next hour", "说出下一个整点"],
              [`The short hand is near the ${next}, so it is a quarter to ${next}.`, `短针快到 ${next} 了，所以是差一刻 ${next} 点。`],
            ],
          ],
          [`${clockText(h, 45)} and 15 more minutes is ${next}:00.`, `${clockText(h, 45)} 再过 15 分钟是 ${next}:00。`],
          clockFigure(h, 45),
        );
      },
      captioned(clockFigure(7, 45), "A clock at 7:45: the long hand on the 9, a quarter to 8.", "7:45 的钟：长针指着 9，差一刻 8 点。"),
    ),
    earlyPoint(
      "words-and-digits-for-quarters",
      ["Words and digits for quarters", "一刻钟的说法和数字"],
      [
        "A quarter to 5 is 15 minutes before 5:00. We are still in the hour after 4, so it is 4:45.\n\nCheck: $4{:}45$ and 15 more minutes is $5{:}00$.\n\n> **Watch out.** Do not write 5:45 for a quarter to 5. The digits show the hour you are in.",
        "差一刻 5 点就是 5:00 前 15 分钟。这时还在 4 点这一小时里，所以是 4:45。\n\n检验：$4{:}45$ 再过 15 分钟是 $5{:}00$。\n\n> **注意。** 差一刻 5 点不要写成 5:45。数字写的是现在这个小时。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const next = clockHour(h + 1);
        const before = rng.bool();
        const words: Pair = before ? [`a quarter to ${next}`, `差一刻 ${next} 点`] : [`a quarter past ${h}`, `${h} 点一刻`];
        const answer = clockText(h, before ? 45 : 15);
        const as = (s: string, en: string, zh: string): Wrong => [[s, s], en, zh];
        const wrong: Wrong[] = before
          ? [
              as(
                clockText(next, 45),
                `That is a quarter to ${clockHour(next + 1)}. The digits show the hour you are in, ${h}.`,
                `这是差一刻 ${clockHour(next + 1)} 点。数字写的是现在这个小时 ${h}。`,
              ),
              as(clockText(next, 15), `That is a quarter past ${next}.`, `这是 ${next} 点一刻。`),
              as(clockText(h, 15), `That is a quarter past ${h}.`, `这是 ${h} 点一刻。`),
              as(clockText(h, 30), `That is half past ${h}.`, `这是 ${h} 点半。`),
            ]
          : [
              as(clockText(h, 45), `That is a quarter to ${next}.`, `这是差一刻 ${next} 点。`),
              as(clockText(next, 15), `That is a quarter past ${next}.`, `这是 ${next} 点一刻。`),
              as(clockText(h, 25), "A quarter of an hour is 15 minutes, not 25.", "一刻钟是 15 分钟，不是 25 分钟。"),
              as(clockText(h, 30), `That is half past ${h}.`, `这是 ${h} 点半。`),
            ];
        return picked(
          rng,
          [`How do you write ${words[0]} in digits?`, `${words[1]}用数字怎么写？`],
          [answer, answer],
          rng.sample(wrong, 3),
          before
            ? [
                [
                  ["Find the hour you are in", "找出现在这个小时"],
                  [`A quarter to ${next} is still in the hour after ${h}.`, `差一刻 ${next} 点还在 ${h} 点这一小时里。`],
                ],
                [
                  ["Find the minutes", "求分钟"],
                  ["15 minutes before the hour is 45 minutes past:", "整点前 15 分钟就是过了 45 分："],
                  [`60 - 15 = 45`],
                ],
              ]
            : [
                [
                  ["Find the hour you are in", "找出现在这个小时"],
                  [`A quarter past ${h} is in the hour after ${h}.`, `${h} 点一刻在 ${h} 点这一小时里。`],
                ],
                [
                  ["Find the minutes", "求分钟"],
                  ["A quarter of an hour is 15 minutes.", "一刻钟是 15 分钟。"],
                ],
              ],
          before
            ? [`${answer} and 15 more minutes is ${next}:00.`, `${answer} 再过 15 分钟是 ${next}:00。`]
            : [`${answer} is 15 minutes after ${h}:00.`, `${answer} 是 ${h}:00 过 15 分。`],
        );
      },
      captioned(clockFigure(4, 45), "A clock at 4:45, a quarter to 5.", "4:45 的钟，差一刻 5 点。"),
    ),
  ],
  [
    "Mom says lunch is at a quarter past 12. A clock face cut into four equal parts has 15 minutes in each part, so a quarter past 12 is 12:15.\n\nCheck: four parts of 15 minutes make 60 minutes.\n\nIn this lesson we read and say times with a quarter past and a quarter to.",
    "妈妈说 12 点一刻吃午饭。把钟面平均分成四份，每份 15 分钟，所以 12 点一刻就是 12:15。\n\n检验：四份 15 分钟是 60 分钟。\n\n本课我们用几点一刻和差一刻几点来读时间、说时间。",
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
        "The clock shows 3:10, with the long hand on the 2. What time is it 15 minutes later? Count on by fives: 15, 20, 25. The long hand ends on the 5, so it is 3:25.\n\nCheck: count back by fives from 3:25: 3:20, 3:15, 3:10.\n\n> **Watch out.** Each number on the clock is 5 minutes, not 1 minute.",
        "钟上是 3:10，长针指着 2。过 15 分钟是几点？五分五分地往后数：15、20、25。长针停在 5，所以是 3:25。\n\n检验：从 3:25 五分五分往回数：3:20、3:15、3:10。\n\n> **注意。** 钟面上每个数之间是 5 分钟，不是 1 分钟。",
      ],
      (rng) => {
        const h = rng.int(1, 11);
        const m = 5 * rng.int(0, 6);
        const add = 5 * rng.int(1, 4);
        const answer = clockText(h, m + add);
        const fives = Array.from({ length: add / 5 }, (_, i) => m + 5 * (i + 1));
        const as = (s: string, en: string, zh: string): Wrong => [[s, s], en, zh];
        return picked(
          rng,
          [`What time is it ${add} minutes after the time on this clock?`, `这个钟上的时间过 ${add} 分钟是几点几分？`],
          [answer, answer],
          [
            as(clockText(h, m), "That is the time on the clock now.", "这是钟上现在的时间。"),
            as(clockText(h + 1, m), "That is an hour later, not a few minutes later.", "这是过了一小时，不是过了几分钟。"),
            as(clockText(h, m + add + 5), "That counts one five too many.", "多数了一个 5 分钟。"),
          ],
          [
            [
              ["Read the clock", "读钟"],
              [`The long hand shows ${m} minutes, so it is ${clockText(h, m)}.`, `长针表示 ${m} 分，所以是 ${clockText(h, m)}。`],
            ],
            [
              ["Count on by fives", "五分五分往后数"],
              [`${add / 5} fives: ${fives.join(", ")}.`, `数 ${add / 5} 个 5：${fives.join("、")}。`],
              [`${m} + ${add} = ${m + add}`],
            ],
          ],
          [
            `Count back ${add} minutes from ${answer} and you reach ${clockText(h, m)}.`,
            `从 ${answer} 往回数 ${add} 分钟，回到 ${clockText(h, m)}。`,
          ],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(3, 10), "A clock at 3:10; 15 minutes later is 3:25.", "3:10 的钟；过 15 分钟是 3:25。"),
    ),
    earlyPoint(
      "a-few-minutes-earlier-on-a-clock",
      ["A few minutes earlier on a clock", "在钟面上往前数几分钟"],
      [
        "The clock shows 6:40, with the long hand on the 8. What time was it 10 minutes earlier? Count back by fives: 35, 30. The long hand was on the 6, so it was 6:30.\n\nCheck: $6{:}30$ and 10 more minutes is $6{:}40$.\n\n> **Watch out.** The hour stays the same while you count back inside the hour.",
        "钟上是 6:40，长针指着 8。10 分钟以前是几点？五分五分地往回数：35、30。长针原来指着 6，所以是 6:30。\n\n检验：$6{:}30$ 再过 10 分钟是 $6{:}40$。\n\n> **注意。** 在同一个小时里往回数，小时数不变。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const m = 5 * rng.int(5, 11);
        const take = 5 * rng.int(1, 4);
        const answer = clockText(h, m - take);
        const fives = Array.from({ length: take / 5 }, (_, i) => m - 5 * (i + 1));
        const as = (s: string, en: string, zh: string): Wrong => [[s, s], en, zh];
        const wrong: Wrong[] = [
          as(clockText(h, m), "That is the time on the clock now.", "这是钟上现在的时间。"),
          as(
            clockText(clockHour(h - 1), m - take),
            "That changes the hour, but counting back stayed inside this hour.",
            "这改了小时数，但往回数没有离开这个小时。",
          ),
          as(clockText(h, m - take - 5), "That counts back one five too many.", "往回多数了一个 5 分钟。"),
        ];
        if (m + take <= 55) wrong.push(as(clockText(h, m + take), "That counts on instead of back.", "这是往后数，应该往回数。"));
        return picked(
          rng,
          [`What time was it ${take} minutes before the time on this clock?`, `比这个钟上的时间早 ${take} 分钟是几点几分？`],
          [answer, answer],
          wrong,
          [
            [
              ["Read the clock", "读钟"],
              [`The long hand shows ${m} minutes, so it is ${clockText(h, m)}.`, `长针表示 ${m} 分，所以是 ${clockText(h, m)}。`],
            ],
            [
              ["Count back by fives", "五分五分往回数"],
              [`${take / 5} fives back: ${fives.join(", ")}.`, `往回数 ${take / 5} 个 5：${fives.join("、")}。`],
              [`${m} - ${take} = ${m - take}`],
            ],
          ],
          [`${answer} and ${take} more minutes is ${clockText(h, m)}.`, `${answer} 再过 ${take} 分钟是 ${clockText(h, m)}。`],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(6, 40), "A clock at 6:40; 10 minutes earlier was 6:30.", "6:40 的钟；10 分钟以前是 6:30。"),
    ),
    earlyPoint(
      "going-past-the-hour",
      ["Going past the hour", "跨过整点"],
      [
        "What time is 20 minutes after 3:50? Stop at the hour first: 10 minutes takes you to 4:00. The other 10 minutes take you to 4:10.\n\nCheck: from 3:50 to 4:10 is $10 + 10 = 20$ minutes.\n\n> **Watch out.** After the 12 a new hour begins. 3:70 is not a time; it is 4:10.",
        "3:50 过 20 分钟是几点？先在整点停一下：10 分钟到 4:00。剩下的 10 分钟到 4:10。\n\n检验：从 3:50 到 4:10 是 $10 + 10 = 20$ 分钟。\n\n> **注意。** 过了 12 就是新的一个小时。没有 3:70 这个时间，应该是 4:10。",
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
        const as = (s: string, en: string, zh: string): Wrong => [[s, s], en, zh];
        return picked(
          rng,
          [
            `${name} starts ${job[0]} at ${clockText(h, m)} and stops ${add} minutes later. What time does ${name} stop?`,
            `${name} ${clockText(h, m)} 开始${job[1]}，${add} 分钟后停下来。${name} 几点几分停下来？`,
          ],
          [answer, answer],
          [
            as(
              clockText(h, beyond),
              `The minutes went past the hour, so the hour is now ${h + 1}, not ${h}.`,
              `分钟跨过了整点，所以现在是 ${h + 1} 点，不是 ${h} 点。`,
            ),
            as(
              clockText(h + 1, m),
              "That keeps the old minutes. Count the minutes on from the hour.",
              "这还是原来的分钟数。要从整点往后数分钟。",
            ),
            as(clockText(h + 2, beyond), "That goes one hour too far.", "这多走了一小时。"),
            as(
              clockText(h + 1, add),
              `That counts all ${add} minutes from ${h + 1}:00. Only ${beyond} are left after the hour.`,
              `这从 ${h + 1}:00 数了全部 ${add} 分钟。过了整点只剩 ${beyond} 分钟。`,
            ),
          ],
          [
            [
              ["Stop at the hour", "先到整点"],
              [`${clockText(h, m)} to ${h + 1}:00:`, `${clockText(h, m)} 到 ${h + 1}:00：`],
              [`60 - ${m} = ${toHour}`],
            ],
            [
              ["Count on the rest", "再数剩下的"],
              [
                `$${add} - ${toHour} = ${beyond}$ minutes are left, so it is ${answer}.`,
                `还剩 $${add} - ${toHour} = ${beyond}$ 分钟，所以是 ${answer}。`,
              ],
            ],
          ],
          [
            `From ${clockText(h, m)} to ${answer} is $${toHour} + ${beyond} = ${add}$ minutes.`,
            `从 ${clockText(h, m)} 到 ${answer} 是 $${toHour} + ${beyond} = ${add}$ 分钟。`,
          ],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(3, 50), "A clock at 3:50; 20 minutes later is 4:10.", "3:50 的钟；过 20 分钟是 4:10。"),
    ),
  ],
  [
    "It is 3:10, and Ben's bus comes in 15 minutes. He counts round the clock by fives: 3:15, 3:20, 3:25.\n\nCheck: three jumps of 5 minutes make 15 minutes.\n\nIn this lesson we count by fives on a clock to find the time a few minutes later or earlier.",
    "现在是 3:10，Ben 的校车 15 分钟后到。他在钟面上五分五分地数：3:15、3:20、3:25。\n\n检验：三次 5 分钟是 15 分钟。\n\n本课我们在钟面上五分五分地数，求几分钟后或几分钟前的时间。",
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
        "A triangle garden has sides of 6, 5 and 4 meters. Walk all the way around and add each side once: $6 + 5 + 4 = 15$ meters.\n\nCheck: add in another order, $4 + 5 + 6 = 15$.\n\n> **Watch out.** Touch each side as you add it, so you do not miss a side or count one twice.",
        "一块三角形菜地的三条边是 6 米、5 米和 4 米。绕着走一圈，每条边加一次：$6 + 5 + 4 = 15$ 米。\n\n检验：换个顺序加，$4 + 5 + 6 = 15$。\n\n> **注意。** 加一条边就指一条边，不要漏掉，也不要重复。",
      ],
      (rng) => {
        const sides = rng.int(3, 5);
        const lengths = [...Array(sides).keys()].map(() => rng.int(3, 15));
        const total = lengths.reduce((sum, v) => sum + v, 0);
        const [a, b] = lengths as [number, number];
        return solved(
          ["The sides are measured in meters. How many meters is it around this shape?", "各边的单位是米。绕这个图形一周是多少米？"],
          total,
          [
            [
              ["List the sides", "列出各边"],
              [`The shape has ${sides} sides: ${lengths.join(", ")}.`, `这个图形有 ${sides} 条边：${lengths.join("、")}。`],
            ],
            [["Add every side", "把每条边加起来"], ["Each side once:", "每条边加一次："], [`${lengths.join(" + ")} = ${total}`]],
          ],
          [
            `Add in the other direction: $${[...lengths].reverse().join(" + ")} = ${total}$.`,
            `倒过来加：$${[...lengths].reverse().join(" + ")} = ${total}$。`,
          ],
          [
            [a + b, "That adds only two sides. Add every side.", "这只加了两条边。每条边都要加。"],
            [total - a, "That misses one side.", "这漏了一条边。"],
            [sides, "That is the number of sides, not their lengths.", "这是边的条数，不是长度。"],
          ],
          labeledSidesFigure(
            shapeOutline(rng, sides),
            lengths.map((v) => `${v}`),
          ),
        );
      },
      captioned(
        labeledSidesFigure(
          [
            [1.5, 1.5],
            [8.5, 1.5],
            [5, 8.5],
          ],
          ["6", "5", "4"],
        ),
        "A triangle with sides 6, 5 and 4: 15 around.",
        "三条边是 6、5、4 的三角形：一周是 15。",
      ),
    ),
    earlyPoint(
      "the-missing-side",
      ["The missing side", "缺少的一条边"],
      [
        "It is 20 inches around a shape with four sides. Three sides are 5, 4 and 6 inches. They add to $5 + 4 + 6 = 15$, so the missing side is $20 - 15 = 5$ inches.\n\nCheck: $5 + 4 + 5 + 6 = 20$.\n\n> **Watch out.** 15 is the sides you know. Subtract it from the distance around to get the missing side.",
        "一个四边形绕一周是 20 英寸。三条边是 5、4、6 英寸，加起来是 $5 + 4 + 6 = 15$，所以缺少的边是 $20 - 15 = 5$ 英寸。\n\n检验：$5 + 4 + 5 + 6 = 20$。\n\n> **注意。** 15 是知道的边的和。要用一周的长度减去它，才是缺少的边。",
      ],
      (rng) => {
        const sides = rng.int(3, 5);
        const lengths = [...Array(sides).keys()].map(() => rng.int(3, 15));
        const hidden = rng.int(0, sides - 1);
        const total = lengths.reduce((sum, v) => sum + v, 0);
        const answer = lengths[hidden] as number;
        const known = total - answer;
        const knownSides = lengths.filter((_, i) => i !== hidden);
        return solved(
          [
            `It is ${total} inches around this shape. How long is the side with the question mark, in inches?`,
            `绕这个图形一周是 ${total} 英寸。问号所在的这条边长多少英寸？`,
          ],
          answer,
          [
            [
              ["Add the known sides", "把知道的边加起来"],
              ["The sides without a question mark:", "没有问号的边："],
              [`${knownSides.join(" + ")} = ${known}`],
            ],
            [
              ["Take them from the distance around", "用一周的长度减"],
              ["What is left is the missing side:", "剩下的就是缺少的边："],
              [`${total} - ${known} = ${answer}`],
            ],
          ],
          [`All the sides together: $${lengths.join(" + ")} = ${total}$.`, `所有的边加起来：$${lengths.join(" + ")} = ${total}$。`],
          [
            [known, "That is the known sides added up, not the missing side.", "这是知道的边的和，不是缺少的边。"],
            [total, "That is the distance around, not one side.", "这是一周的长度，不是一条边。"],
            [total + known, "That adds. Take the known sides away from the distance around.", "这是相加。要用一周的长度减去知道的边。"],
          ],
          labeledSidesFigure(
            shapeOutline(rng, sides),
            lengths.map((v, i) => (i === hidden ? "?" : `${v}`)),
          ),
        );
      },
      captioned(
        labeledSidesFigure(
          [
            [1.5, 1.5],
            [8.5, 1.5],
            [8.5, 8.5],
            [1.5, 8.5],
          ],
          ["5", "4", "?", "6"],
        ),
        "A shape 20 around with sides 5, 4, 6 and one missing: 5.",
        "一周 20、三条边是 5、4、6 的图形：缺少的边是 5。",
      ),
    ),
    {
      ...earlyPoint(
        "around-a-rectangle",
        ["Around a rectangle", "绕长方形一周"],
        [
          "A rectangle is 5 long and 3 wide. Opposite sides match, so there are two sides of 5 and two sides of 3: $5 + 3 + 5 + 3 = 16$.\n\nCheck: $5 + 3 = 8$, and two 8s make 16.\n\n> **Watch out.** The picture shows only two numbers, but there are four sides. $5 + 3 = 8$ is only half way round.",
          "一个长方形长 5、宽 3。相对的边一样长，所以有两条 5 和两条 3：$5 + 3 + 5 + 3 = 16$。\n\n检验：$5 + 3 = 8$，两个 8 是 16。\n\n> **注意。** 图上只标了两个数，但有四条边。$5 + 3 = 8$ 只是半圈。",
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
          return solved(
            [`How long is the distance around this rectangle, in ${unit[0]}?`, `绕这个长方形一周是多少${unit[1]}？`],
            total,
            [
              [
                ["Find all four sides", "找出四条边"],
                [`Opposite sides match: two sides of ${w} and two of ${h}.`, `相对的边一样长：两条 ${w}，两条 ${h}。`],
              ],
              [["Add the four sides", "四条边相加"], ["Go all the way round:", "绕一整圈："], [`${w} + ${h} + ${w} + ${h} = ${total}`]],
            ],
            [
              `Half way round is $${w} + ${h} = ${w + h}$, and $${w + h} + ${w + h} = ${total}$.`,
              `半圈是 $${w} + ${h} = ${w + h}$，$${w + h} + ${w + h} = ${total}$。`,
            ],
            [
              [w + h, "That is only two sides, half way round.", "这只有两条边，是半圈。"],
              [w * h, "That multiplies. The distance around adds the four sides.", "这是相乘。一周的长度要把四条边加起来。"],
              [2 * w + h, `That misses one side of ${h}.`, `这漏了一条 ${h}。`],
            ],
            labeledRectangleFigure(w, h, unit[0]),
          );
        },
      ),
      figure: gradeDrawings["around-a-rectangle"],
    },
  ],
  [
    "Ella walks along the edge of a triangle garden. The sides are 6, 5 and 4 meters, and she ends where she started. She walks $6 + 5 + 4 = 15$ meters.\n\nCheck: $4 + 5 + 6 = 15$ too.\n\nIn this lesson we add side lengths to find the distance around a shape, and find a missing side.",
    "Ella 沿着一块三角形菜地的边走一圈。三条边是 6 米、5 米和 4 米，她回到了起点。她走了 $6 + 5 + 4 = 15$ 米。\n\n检验：$4 + 5 + 6 = 15$，也一样。\n\n本课我们把各边的长度加起来求绕图形一周的长度，并求出缺少的一边。",
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

/** samplePlot is the line plot of 4, 5, 5, 6, 6, 6, 7 that the explanations of line plots use. */
const samplePlot = (en: string, zh: string): Figure => ({
  svg: dotPlot([4, 5, 5, 6, 6, 6, 7], { min: 3, max: 8, step: 1 }),
  alt: t(en, zh),
});

const makingLinePlots = earlyTopic(
  "making-line-plots",
  ["Making Line Plots", "画线图"],
  ["Turn a list of measurements into a line plot, and answer questions from one.", "把一组测量数据画成线图，并根据线图回答问题。"],
  ["line-plots-of-lengths"],
  ["2.MD.D.9"],
  [
    {
      ...earlyPoint(
        "dots-from-a-list",
        ["Dots from a list", "根据数据画点"],
        [
          "Some sticks are 4, 5, 5, 6, 6, 6 and 7 inches long. Put one dot above a number each time it is in the list. 6 is in the list three times, so 6 gets three dots.\n\nCheck: the dots are $1 + 2 + 3 + 1 = 7$, one for each of the 7 sticks.\n\n> **Watch out.** Cross off each number as you plot it, so none is counted twice.",
          "一些小棒长 4、5、5、6、6、6、7 英寸。一个数在数据里出现一次，就在它上面画一个点。6 出现三次，所以 6 上面有三个点。\n\n检验：点一共有 $1 + 2 + 3 + 1 = 7$ 个，正好每根小棒一个。\n\n> **注意。** 画一个就划掉一个，就不会重复。",
        ],
        (rng) => {
          const low = rng.int(2, 9);
          const values = [...Array(rng.int(7, 10)).keys()].map(() => low + rng.int(0, 3));
          const target = rng.pick(values);
          const answer = values.filter((v) => v === target).length;
          const marked = values.map((v) => (v === target ? `**${v}**` : `${v}`));
          return solved(
            [
              `The lengths of some sticks are ${values.join(", ")} inches. On a line plot, how many dots go above ${target}?`,
              `一些小棒的长度是 ${values.join("、")} 英寸。在线图上，${target} 的上面要画几个点？`,
            ],
            answer,
            [
              [
                [`Find each ${target}`, `找出每个 ${target}`],
                [`In the list: ${marked.join(", ")}.`, `在数据中：${marked.join("、")}。`],
              ],
              [
                ["Count them", "数一数"],
                [
                  `${target} is there ${answer} ${answer === 1 ? "time" : "times"}, so it gets ${answer} ${answer === 1 ? "dot" : "dots"}.`,
                  `${target} 出现了 ${answer} 次，所以画 ${answer} 个点。`,
                ],
              ],
            ],
            [
              `Count from the end of the list back to the start: ${target} is still there ${answer} ${answer === 1 ? "time" : "times"}.`,
              `从数据的末尾往前数：${target} 还是出现 ${answer} 次。`,
            ],
            [
              [target, "That is the length, not how many times it is in the list.", "这是长度，不是它出现的次数。"],
              [values.length, "That is all the sticks. Count only the ones of this length.", "这是所有的小棒。只数这个长度的。"],
              [answer + 1, "That is one too many. Cross off each one as you count it.", "多了一个。数一个划掉一个。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["making-line-plots#dots-from-a-list"],
    },
    earlyPoint(
      "how-many-were-measured",
      ["How many were measured", "一共量了多少个"],
      [
        "This line plot has 1 dot above 4, 2 above 5, 3 above 6 and 1 above 7. Each dot is one thing measured, so $1 + 2 + 3 + 1 = 7$ things were measured.\n\nCheck: the list 4, 5, 5, 6, 6, 6, 7 has 7 numbers.\n\n> **Watch out.** Count the dots, not the numbers on the line. The numbers are lengths.",
        "这张线图上，4 上面 1 个点，5 上面 2 个，6 上面 3 个，7 上面 1 个。每个点是量过的一个东西，所以量了 $1 + 2 + 3 + 1 = 7$ 个。\n\n检验：数据 4、5、5、6、6、6、7 有 7 个数。\n\n> **注意。** 数点，不要数数轴上的数。那些数是长度。",
      ],
      (rng) => {
        const { min, span, counts, values } = plotData(rng);
        return solved(
          [
            "Each dot stands for one pencil that was measured, in inches. How many pencils were measured?",
            "每个点代表量过的一支铅笔，单位是英寸。一共量了多少支铅笔？",
          ],
          values.length,
          [
            [
              ["Count the dots above each number", "数每个数上面的点"],
              [`From ${min} to ${min + span}: ${counts.join(", ")}.`, `从 ${min} 到 ${min + span}：${counts.join("、")}。`],
            ],
            [["Add them", "加起来"], ["Each dot is one pencil:", "每个点是一支铅笔："], [`${counts.join(" + ")} = ${values.length}`]],
          ],
          [
            `The lengths ${values.join(", ")} are ${values.length} numbers, one for each pencil.`,
            `长度 ${values.join("、")} 一共 ${values.length} 个数，每支铅笔一个。`,
          ],
          [
            [span + 1, "That counts the numbers on the line, not the dots.", "这数的是数轴上的数，不是点。"],
            [min + span, "That is the longest length, not how many pencils.", "这是最长的长度，不是铅笔的支数。"],
            [values.length + 1, "That is one too many. Count each dot once.", "多了一个。每个点只数一次。"],
          ],
          {
            svg: dotPlot(values, { min, max: min + span, step: 1 }),
            alt: t(
              `A line plot of pencil lengths, with one dot at each of: ${values.join(", ")}.`,
              `铅笔长度的线图，点分别在：${values.join("、")}。`,
            ),
          },
        );
      },
      samplePlot(
        "A line plot with 1, 2, 3 and 1 dots above 4, 5, 6 and 7: 7 dots in all.",
        "4、5、6、7 上面分别有 1、2、3、1 个点的线图：一共 7 个点。",
      ),
    ),
    earlyPoint(
      "the-longest-and-the-shortest",
      ["The longest and the shortest", "最长和最短"],
      [
        "On this line plot the dot farthest right is above 7 and the dot farthest left is above 4. So the longest is $7 - 4 = 3$ longer than the shortest.\n\nCheck: count up from 4 to 7: 5, 6, 7 is 3 steps.\n\n> **Watch out.** Use the dots, not the ends of the line. The line goes from 3 to 8, but no leaf is 3 or 8 long.",
        "这张线图上，最右边的点在 7 上面，最左边的点在 4 上面。所以最长的比最短的长 $7 - 4 = 3$。\n\n检验：从 4 数到 7：5、6、7，是 3 步。\n\n> **注意。** 要看点，不要看数轴的两端。数轴从 3 到 8，但没有长 3 或 8 的树叶。",
      ],
      (rng) => {
        const { min, span, values } = plotData(rng);
        const start = min - rng.int(0, 1);
        const stop = min + span + rng.int(0, 1);
        return solved(
          [
            "This line plot shows lengths of leaves in centimeters. How many centimeters longer is the longest leaf than the shortest leaf?",
            "这张线图表示树叶的长度，单位是厘米。最长的树叶比最短的长多少厘米？",
          ],
          span,
          [
            [
              ["Find the two ends of the dots", "找出点的两端"],
              [
                `The dot farthest right is above ${min + span}, and the dot farthest left is above ${min}.`,
                `最右边的点在 ${min + span} 上面，最左边的点在 ${min} 上面。`,
              ],
            ],
            [["Subtract", "相减"], ["Longest minus shortest:", "最长减最短："], [`${min + span} - ${min} = ${span}`]],
          ],
          [
            `Count up from ${min} to ${min + span}: that is ${span} steps of 1 cm.`,
            `从 ${min} 数到 ${min + span}，是 ${span} 步，每步 1 厘米。`,
          ],
          [
            [stop - start, "That uses the ends of the line, not the dots.", "这用的是数轴的两端，不是点。"],
            [min + span, "That is the longest leaf, not how much longer it is.", "这是最长的树叶，不是长多少。"],
            [values.length, "That is the number of leaves.", "这是树叶的片数。"],
          ],
          {
            svg: dotPlot(values, { min: start, max: stop, step: 1 }),
            alt: t(
              `A line plot of leaf lengths, with one dot at each of: ${values.join(", ")}.`,
              `树叶长度的线图，点分别在：${values.join("、")}。`,
            ),
          },
        );
      },
      samplePlot(
        "A line plot from 3 to 8 with dots from 4 to 7: the longest is 3 longer than the shortest.",
        "从 3 到 8 的线图，点在 4 到 7 之间：最长的比最短的长 3。",
      ),
    ),
  ],
  [
    "Zoe measures her crayons: 4, 5, 5, 6, 6, 6 and 7 centimeters. She draws a number line and puts one dot above a number for each crayon. Now she can see at once that 6 cm is the most common length.\n\nCheck: 7 crayons, 7 dots.\n\nIn this lesson we turn a list of measurements into a line plot and answer questions from it.",
    "Zoe 量了她的蜡笔：4、5、5、6、6、6、7 厘米。她画一条数轴，每支蜡笔在对应的数上面画一个点。这样一眼就能看出 6 厘米的最多。\n\n检验：7 支蜡笔，7 个点。\n\n本课我们把一组测量数据画成线图，并根据线图回答问题。",
  ],
);

const graphsFromTables = earlyTopic(
  "graphs-from-tables",
  ["Graphs From Tables", "把表格变成统计图"],
  ["Move between a table and a bar graph, and use either to compare amounts.", "在表格和条形图之间互相转换，并用它们来比较数量。"],
  ["reading-bar-graphs"],
  ["2.MD.D.10"],
  [
    {
      ...earlyPoint(
        "how-tall-should-the-bar-be",
        ["How tall the bar should be", "长条应该画多高"],
        [
          "The table says A 3, B 7 and C 5. Each number tells how tall to draw one bar, so the bar for B reaches 7 on the scale.\n\nCheck: read the graph back: the bar for B stops at 7, the same as the table.\n\n> **Watch out.** B is second in the table, but its bar is 7 tall, not 2. Use the number under the label.",
          "表中 A 是 3，B 是 7，C 是 5。每个数说明一个长条画多高，所以 B 的长条画到刻度 7。\n\n检验：再看图：B 的长条停在 7，和表格一样。\n\n> **注意。** B 在表里排第二，但它的长条高 7，不是 2。要用标签下面的数。",
        ],
        (rng) => {
          const labels = ["A", "B", "C", "D"];
          const values = labels.map(() => rng.int(1, 12));
          const i = rng.int(0, 3);
          const v = values[i] as number;
          const other = values[(i + 1) % 4] as number;
          return solved(
            [
              `You are making a bar graph from this table. What number should the bar for ${labels[i]} reach?`,
              `要根据这张表画条形图。${labels[i]} 的长条应该画到几？`,
            ],
            v,
            [
              [
                ["Find the label", "找到标签"],
                [`Find ${labels[i]} in the top row.`, `在第一行找到 ${labels[i]}。`],
              ],
              [
                ["Read the number below it", "读出下面的数"],
                [`Under ${labels[i]} is ${v}, so the bar reaches ${v}.`, `${labels[i]} 下面是 ${v}，所以长条画到 ${v}。`],
              ],
            ],
            [
              `On the finished graph, the bar for ${labels[i]} stops at ${v}, the same number as in the table.`,
              `画好的图上，${labels[i]} 的长条停在 ${v}，和表中的数一样。`,
            ],
            [
              [other, `That is the number for ${labels[(i + 1) % 4]}.`, `这是 ${labels[(i + 1) % 4]} 的数。`],
              [
                values.reduce((sum, x) => sum + x, 0),
                "That adds all the numbers. One bar shows one number.",
                "这把所有的数都加起来了。一个长条只表示一个数。",
              ],
              [i + 1, `That is where ${labels[i]} sits in the table, not its number.`, `这是 ${labels[i]} 在表中的位置，不是它的数。`],
            ],
            tableFigure(labels, values),
          );
        },
      ),
      figure: gradeDrawings2["graphs-from-tables#how-tall-should-the-bar-be"],
    },
    {
      ...earlyPoint(
        "filling-a-table-from-a-graph",
        ["Filling a table from a graph", "根据统计图填表"],
        [
          "This bar graph counts by twos. The bar for C stops halfway between 6 and 8, so it is 7, and 7 goes in the table under C.\n\nCheck: half of a step of 2 is 1, and $6 + 1 = 7$.\n\n> **Watch out.** Each mark is worth 2 here, not 1. Read the scale, do not just count marks.",
          "这张条形图的刻度是两个两个数的。C 的长条停在 6 和 8 的中间，所以是 7，表中 C 的下面填 7。\n\n检验：一格 2 的一半是 1，$6 + 1 = 7$。\n\n> **注意。** 这里每格是 2，不是 1。要读刻度，不能只数格子。",
        ],
        (rng) => {
          const labels = ["A", "B", "C"];
          const step = rng.pick([2, 5, 1]);
          const values = labels.map(() => step * rng.int(1, step === 1 ? 10 : 8));
          const i = rng.int(0, 2);
          const v = values[i] as number;
          return solved(
            [
              `The table should match this graph. What number goes under ${labels[i]}?`,
              `这张表要和统计图一致。${labels[i]} 的下面应该填几？`,
            ],
            v,
            [
              [
                ["Read the scale", "看刻度"],
                [`The scale counts by ${step === 1 ? "ones" : `${step}s`}.`, `刻度每格是 ${step}。`],
              ],
              [
                ["Read the top of the bar", "读长条的顶端"],
                [`The bar for ${labels[i]} stops at ${v}.`, `${labels[i]} 的长条停在 ${v}。`],
              ],
            ],
            [
              `Count up the scale: ${v / step} ${v === step ? "mark" : "marks"} of ${step} make ${v}.`,
              `沿刻度数：${v / step} 格，每格 ${step}，是 ${v}。`,
            ],
            [
              [v / step, `That counts the marks, but each mark is worth ${step}.`, `这数的是格数，但每格是 ${step}。`],
              [v + step, "That is one mark too high.", "多读了一格。"],
              [
                values.reduce((sum, x) => sum + x, 0),
                "That adds all the bars. Read only this bar.",
                "这把所有的长条加起来了。只读这一个长条。",
              ],
            ],
            barGraphFigure(labels, values, step),
          );
        },
      ),
      figure: gradeDrawings2["graphs-from-tables#filling-a-table-from-a-graph"],
    },
    earlyPoint(
      "comparing-amounts-in-a-table",
      ["Comparing amounts in a table", "比较表中的数"],
      [
        "Team A has 9 stickers and Team C has 12. How many more does Team C have? Subtract: $12 - 9 = 3$.\n\nCheck: $9 + 3 = 12$.\n\n> **Watch out.** How many more means subtract. $12 + 9 = 21$ is both teams together.",
        "A 队有 9 张贴纸，C 队有 12 张。C 队多多少张？相减：$12 - 9 = 3$。\n\n检验：$9 + 3 = 12$。\n\n> **注意。** 多多少要用减法。$12 + 9 = 21$ 是两队一共的张数。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const values = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 4);
        const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
        const big = Math.max(values[i] as number, values[j] as number);
        const small = Math.min(values[i] as number, values[j] as number);
        const bigLabel = (values[i] as number) > (values[j] as number) ? labels[i] : labels[j];
        const smallLabel = bigLabel === labels[i] ? labels[j] : labels[i];
        return solved(
          [
            `The table shows how many stickers each team has. How many more stickers does Team ${bigLabel} have than Team ${smallLabel}?`,
            `这张表表示每个小队有多少张贴纸。${bigLabel} 队比 ${smallLabel} 队多多少张贴纸？`,
          ],
          big - small,
          [
            [
              ["Read the table", "读表"],
              [
                `Team ${bigLabel} has ${big} and Team ${smallLabel} has ${small}.`,
                `${bigLabel} 队有 ${big} 张，${smallLabel} 队有 ${small} 张。`,
              ],
            ],
            [["Subtract", "相减"], ["How many more:", "多多少："], [`${big} - ${small} = ${big - small}`]],
          ],
          [`$${small} + ${big - small} = ${big}$.`, `$${small} + ${big - small} = ${big}$。`],
          [
            [big + small, "That adds the two teams. How many more means subtract.", "这把两队加起来了。多多少要用减法。"],
            [big, `That is Team ${bigLabel}'s stickers, not how many more.`, `这是 ${bigLabel} 队的张数，不是多多少。`],
            [small, `That is Team ${smallLabel}'s stickers, not how many more.`, `这是 ${smallLabel} 队的张数，不是多多少。`],
          ],
          tableFigure(labels, values),
        );
      },
      captioned(
        tableFigure(["A", "B", "C", "D"], [9, 4, 12, 7]),
        "A table: A 9, B 4, C 12, D 7. C has 3 more than A.",
        "表格：A 9、B 4、C 12、D 7。C 比 A 多 3。",
      ),
    ),
  ],
  [
    "The class counts pets: 3 cats, 7 dogs and 5 fish. They write the numbers in a table, then draw a bar for each pet, 3, 7 and 5 tall.\n\nCheck: the tallest bar is the dogs, the biggest number in the table.\n\nIn this lesson we move between a table and a bar graph, and use either to compare amounts.",
    "全班统计宠物：3 只猫、7 只狗、5 条鱼。他们把数写进表格，再为每种宠物画一个长条，分别高 3、7、5。\n\n检验：最高的长条是狗，正是表中最大的数。\n\n本课我们在表格和条形图之间互相转换，并用它们比较数量。",
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
    {
      ...earlyPoint(
        "which-rectangle-is-cut-fairly",
        ["Which rectangle is cut fairly", "哪个长方形分得公平"],
        [
          "One rectangle is cut down the middle into 2 parts of the same size: those are halves. Another is cut into a big piece and a small piece: those are not halves.\n\nCheck: fold along the cut. Halves fit exactly on top of each other.\n\n> **Watch out.** Two parts are not enough. The two parts must be the same size.",
          "一个长方形从中间分成大小相同的 2 份：这是两半。另一个分成一大一小两块：这不是两半。\n\n检验：沿着分线对折。两半能完全重合。\n\n> **注意。** 只有两份还不够，两份必须一样大。",
        ],
        (rng) => {
          const fair = rng.pick<CutKind>(["tall", "wide", "diagonal"]);
          const labels = ["A", "B", "C"];
          const cuts = rng.shuffle<CutKind>([fair, "uneven", rng.pick<CutKind>(["uneven", "tallThree", "wideThree"])]);
          const at = cuts.indexOf(fair);
          const say = (i: number): Pair => [`Rectangle ${labels[i]}`, `长方形 ${labels[i]}`];
          const why = (i: number): Wrong =>
            cuts[i] === "uneven"
              ? [say(i), "Its two parts are different sizes.", "它的两部分大小不一样。"]
              : [say(i), "Its parts are equal, but there are three of them, not two.", "它的几份一样大，但有三份，不是两份。"];
          return picked(
            rng,
            ["Which rectangle is cut into two equal shares?", "哪个长方形被分成了相等的两份？"],
            say(at),
            [0, 1, 2].filter((i) => i !== at).map(why),
            [
              [
                ["Count the parts", "数份数"],
                ["Look for a rectangle cut into exactly two parts.", "找出正好分成两份的长方形。"],
              ],
              [
                ["Compare the sizes", "比大小"],
                [`Rectangle ${labels[at]} has two parts of the same size.`, `长方形 ${labels[at]} 的两份一样大。`],
              ],
            ],
            [
              `Fold Rectangle ${labels[at]} along its cut: the two parts fit exactly on top of each other.`,
              `把长方形 ${labels[at]} 沿分线对折，两份能完全重合。`,
            ],
            rectangleCutsFigure(
              labels,
              cuts.map((kind) => ({ kind, shaded: rng.int(0, 1) })),
            ),
          );
        },
      ),
      figure: gradeDrawings2["equal-shares-can-look-different#which-rectangle-is-cut-fairly"],
    },
    {
      ...earlyPoint(
        "same-size-different-shape",
        ["Same size but different shape", "大小相同，形状不同"],
        [
          "Cut one rectangle across, one down the middle and one from corner to corner, and shade half of each. The halves look different, but each is 1 of 2 equal shares of the same rectangle, so they are the same size.\n\nCheck: two of any of these halves cover the whole rectangle.\n\n> **Watch out.** A different shape does not mean a different size.",
          "把一个长方形横着分、竖着分、沿对角线分，各涂一半。这些一半看起来不一样，但都是同一个长方形平均分成 2 份中的 1 份，所以一样大。\n\n检验：任何一种一半，两个合起来都正好是整个长方形。\n\n> **注意。** 形状不同不等于大小不同。",
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
          const same = `${shaded} of ${family.parts} equal shares of the same whole`;
          const sameZh = `同一个整体平均分成 ${family.parts} 份中的 ${shaded} 份`;
          return picked(
            rng,
            ["Both rectangles are the same size. How do the shaded parts compare?", "两个长方形一样大。涂色部分比较起来怎么样？"],
            ["They are the same size", "一样大"],
            [
              [
                ["The shaded part of A is larger", "A 的涂色部分更大"],
                `Both are ${same}, so A's is not larger.`,
                `两个都是${sameZh}，A 的并不更大。`,
              ],
              [
                ["The shaded part of B is larger", "B 的涂色部分更大"],
                `Both are ${same}, so B's is not larger.`,
                `两个都是${sameZh}，B 的并不更大。`,
              ],
              [["They cannot be compared", "无法比较"], `They can: each is ${same}.`, `可以比较：两个都是${sameZh}。`],
            ],
            [
              [
                ["Count the shares", "数份数"],
                [`Each rectangle is cut into ${family.parts} equal shares.`, `每个长方形都平均分成 ${family.parts} 份。`],
              ],
              [
                ["Count the shaded shares", "数涂色的份数"],
                [`Each has ${shaded} shaded, and the wholes are the same size.`, `每个都涂了 ${shaded} 份，整体又一样大。`],
              ],
            ],
            [
              `The parts left unshaded are ${family.parts - shaded} of ${family.parts} shares in both, so those match too.`,
              `两个长方形没涂色的都是 ${family.parts} 份中的 ${family.parts - shaded} 份，也一样大。`,
            ],
            rectangleCutsFigure(
              labels,
              cuts.map((kind) => ({ kind, shaded })),
            ),
          );
        },
      ),
      figure: gradeDrawings2["equal-shares-can-look-different#same-size-different-shape"],
    },
    earlyPoint(
      "how-many-shares-make-the-whole",
      ["How many shares make the whole", "几份合成一个整体"],
      [
        "A rectangle is cut into 4 equal shares, fourths, and 1 is shaded. Four fourths make the whole, so $4 - 1 = 3$ more shares must be shaded.\n\nCheck: $1 + 3 = 4$ shares, the whole rectangle.\n\n> **Watch out.** The answer is the shares still to shade, not all 4 shares.",
        "一个长方形平均分成 4 份，也就是四等份，涂了 1 份。四个四分之一合成整体，所以还要再涂 $4 - 1 = 3$ 份。\n\n检验：$1 + 3 = 4$ 份，正好是整个长方形。\n\n> **注意。** 要求的是还要涂几份，不是一共 4 份。",
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
        const left = pick.parts - shaded;
        return solved(
          [
            "Look at the rectangle labeled A. How many more shares must be shaded to shade the whole rectangle?",
            "看标着 A 的长方形。还要再涂几份，才能把整个长方形涂满？",
          ],
          left,
          [
            [
              ["Count the shares", "数份数"],
              [
                `A is cut into ${pick.parts} equal shares, and ${shaded} ${shaded === 1 ? "is" : "are"} shaded.`,
                `A 平均分成 ${pick.parts} 份，涂了 ${shaded} 份。`,
              ],
            ],
            [
              ["Find the rest", "求剩下的"],
              ["All the shares minus the shaded ones:", "总份数减去涂了的份数："],
              [`${pick.parts} - ${shaded} = ${left}`],
            ],
          ],
          [
            `$${shaded} + ${left} = ${pick.parts}$ shares, the whole rectangle.`,
            `$${shaded} + ${left} = ${pick.parts}$ 份，正好是整个长方形。`,
          ],
          [
            [shaded, "That counts the shares already shaded.", "这数的是已经涂了的份数。"],
            [pick.parts, "That is all the shares, but some are already shaded.", "这是全部的份数，但有些已经涂了。"],
            [pick.parts + shaded, "That adds. Take the shaded shares away from all the shares.", "这是相加。要用总份数减去涂了的份数。"],
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
      captioned(
        rectangleCutsFigure(["A"], [{ kind: "grid", shaded: 1 }]),
        "A rectangle cut into 4 equal shares with 1 shaded: 3 more to shade.",
        "平均分成 4 份、涂了 1 份的长方形：还要涂 3 份。",
      ),
    ),
  ],
  [
    "Two friends share a rectangle of toast. One cuts it down the middle, the other cuts it from corner to corner. The pieces look different, but each way gives two equal halves.\n\nCheck: in both ways, the two pieces fit exactly on top of each other.\n\nIn this lesson we see that equal shares can look different, and spot cuts that are not equal.",
    "两个朋友分一片长方形吐司。一个从中间竖着切，一个沿对角线切。切出来的形状不一样，但两种切法都分成了相等的两半。\n\n检验：两种切法，两块都能完全重合。\n\n本课我们知道相等的份可以看起来不一样，并找出不相等的分法。",
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
    {
      ...earlyPoint(
        "guess-the-shape",
        ["Guess the shape", "猜一猜是什么图形"],
        [
          "Riddle: I have 5 corners. What am I? A polygon has as many corners as sides, so I have 5 sides. I am a pentagon.\n\nCheck: go round the pentagon in the picture: 5 sides and 5 corners.\n\n> **Watch out.** A clue about corners is also a clue about sides. Do not pick a shape with one side more or one side less.",
          "谜语：我有 5 个角，我是什么？多边形有几条边就有几个角，所以我有 5 条边，我是五边形。\n\n检验：在图中绕五边形数一圈：5 条边，5 个角。\n\n> **注意。** 关于角的线索也是关于边的线索。不要选多一条边或少一条边的图形。",
        ],
        (rng) => {
          const shape = rng.pick(polygonNames);
          const corners = rng.bool();
          const others = rng.sample(
            polygonNames.filter((p) => p !== shape),
            3,
          );
          return picked(
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
            others.map(
              (p): Wrong => [
                p.name,
                `${withArticle(p.name[0])} has ${p.sides} sides and ${p.sides} corners, not ${shape.sides}.`.replace(/^a/, "A"),
                `${p.name[1]}有 ${p.sides} 条边、${p.sides} 个角，不是 ${shape.sides}。`,
              ],
            ),
            [
              [
                ["Turn the clue into sides", "把线索变成边数"],
                corners
                  ? [`${shape.sides} corners means ${shape.sides} sides.`, `${shape.sides} 个角就是 ${shape.sides} 条边。`]
                  : [`The shape has ${shape.sides} sides.`, `这个图形有 ${shape.sides} 条边。`],
              ],
              [
                ["Name the shape", "说出名称"],
                [`A shape with ${shape.sides} sides is ${withArticle(shape.name[0])}.`, `有 ${shape.sides} 条边的图形是${shape.name[1]}。`],
              ],
            ],
            [
              `Draw ${withArticle(shape.name[0])} and count round it: ${shape.sides} sides and ${shape.sides} corners.`,
              `画一个${shape.name[1]}，绕着数一圈：${shape.sides} 条边，${shape.sides} 个角。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["shape-riddles#guess-the-shape"],
    },
    earlyPoint(
      "naming-an-unusual-shape",
      ["Naming an unusual shape", "说出不常见图形的名称"],
      [
        "This shape has long and short sides and is tipped over. Start at one corner and count the sides all the way round: 1, 2, 3, 4, 5, 6. It has 6 sides, so it is a hexagon.\n\nCheck: count the corners too: there are 6.\n\n> **Watch out.** The name depends only on the number of sides, not on how neat the shape looks.",
        "这个图形有长边也有短边，还是歪着的。从一个角开始，绕一圈数边：1、2、3、4、5、6。它有 6 条边，所以是六边形。\n\n检验：再数角：也是 6 个。\n\n> **注意。** 名称只看边数，不看图形是否整齐。",
      ],
      (rng) => {
        const shape = rng.pick(polygonNames);
        const others = rng.sample(
          polygonNames.filter((p) => p !== shape),
          3,
        );
        return picked(
          rng,
          ["What is the name of this shape?", "这个图形叫什么？"],
          shape.name,
          others.map(
            (p): Wrong => [
              p.name,
              `That shape has ${p.sides} sides, but this one has ${shape.sides}.`,
              `${p.name[1]}有 ${p.sides} 条边，但这个图形有 ${shape.sides} 条。`,
            ],
          ),
          [
            [
              ["Count the sides", "数边"],
              [`Start at one corner and go all the way round: ${shape.sides} sides.`, `从一个角开始绕一圈：${shape.sides} 条边。`],
            ],
            [
              ["Name it", "说出名称"],
              [`${shape.sides} sides make it ${withArticle(shape.name[0])}.`, `有 ${shape.sides} 条边，所以是${shape.name[1]}。`],
            ],
          ],
          [`Count the corners as well: there are ${shape.sides}, the same as the sides.`, `再数角：有 ${shape.sides} 个，和边数相同。`],
          polygonFigure(shapeOutline(rng, shape.sides), t("A closed shape with straight sides.", "一个由直边围成的封闭图形。")),
        );
      },
      captioned(
        polygonFigure(
          [
            [1, 2],
            [4, 1],
            [9, 3],
            [8, 7],
            [5, 9],
            [2, 6],
          ],
          t("", ""),
        ),
        "An uneven shape with 6 sides of different lengths: a hexagon.",
        "边长不同的 6 条边围成的图形：六边形。",
      ),
    ),
    {
      ...earlyPoint(
        "comparing-numbers-of-sides",
        ["Comparing numbers of sides", "比较边数"],
        [
          "How many more sides does a hexagon have than a triangle? Turn each name into a number first: a hexagon has 6 sides and a triangle has 3. Then subtract: $6 - 3 = 3$.\n\nCheck: $3 + 3 = 6$.\n\n> **Watch out.** How many more means subtract. $6 + 3 = 9$ is the sides of both shapes together.",
          "六边形比三角形多几条边？先把名称换成数：六边形有 6 条边，三角形有 3 条。再相减：$6 - 3 = 3$。\n\n检验：$3 + 3 = 6$。\n\n> **注意。** 多几条要用减法。$6 + 3 = 9$ 是两个图形一共的边数。",
        ],
        (rng) => {
          const [x, y] = rng.sample(polygonNames, 2) as [(typeof polygonNames)[number], (typeof polygonNames)[number]];
          const big = x.sides > y.sides ? x : y;
          const small = big === x ? y : x;
          const form = rng.int(0, 2);
          const names: Walk = [
            ["Turn names into numbers", "把名称换成数"],
            [
              `${withArticle(big.name[0])} has ${big.sides} sides and ${withArticle(small.name[0])} has ${small.sides}.`.replace(/^a/, "A"),
              `${big.name[1]}有 ${big.sides} 条边，${small.name[1]}有 ${small.sides} 条。`,
            ],
          ];
          const gap = big.sides - small.sides;
          const differenceSlips: Slip[] = [
            [big.sides + small.sides, "That adds. How many more or fewer means subtract.", "这是相加。多几或少几要用减法。"],
            [big.sides, `That is the sides of the ${big.name[0]} alone.`, `这只是${big.name[1]}的边数。`],
            [small.sides, `That is the sides of the ${small.name[0]} alone.`, `这只是${small.name[1]}的边数。`],
          ];
          if (form === 0)
            return solved(
              [
                `How many more sides does ${withArticle(big.name[0])} have than ${withArticle(small.name[0])}?`,
                `${big.name[1]}比${small.name[1]}多几条边？`,
              ],
              gap,
              [names, [["Subtract", "相减"], ["How many more:", "多几条："], [`${big.sides} - ${small.sides} = ${gap}`]]],
              [`$${small.sides} + ${gap} = ${big.sides}$.`, `$${small.sides} + ${gap} = ${big.sides}$。`],
              differenceSlips,
            );
          if (form === 1)
            return solved(
              [
                `How many fewer corners does ${withArticle(small.name[0])} have than ${withArticle(big.name[0])}?`,
                `${small.name[1]}比${big.name[1]}少几个角？`,
              ],
              gap,
              [
                names,
                [["Subtract", "相减"], ["Corners match sides, so:", "角数和边数相同，所以："], [`${big.sides} - ${small.sides} = ${gap}`]],
              ],
              [`$${small.sides} + ${gap} = ${big.sides}$.`, `$${small.sides} + ${gap} = ${big.sides}$。`],
              differenceSlips,
            );
          return solved(
            [
              `How many sides do ${withArticle(big.name[0])} and ${withArticle(small.name[0])} have in all?`,
              `一个${big.name[1]}和一个${small.name[1]}一共有几条边？`,
            ],
            big.sides + small.sides,
            [names, [["Add", "相加"], ["In all:", "一共："], [`${big.sides} + ${small.sides} = ${big.sides + small.sides}`]]],
            [
              `Add the other way round: $${small.sides} + ${big.sides} = ${big.sides + small.sides}$.`,
              `换个顺序加：$${small.sides} + ${big.sides} = ${big.sides + small.sides}$。`,
            ],
            [
              [gap, "That subtracts. In all means add.", "这是相减。一共要用加法。"],
              [big.sides, `That is the sides of the ${big.name[0]} alone.`, `这只是${big.name[1]}的边数。`],
              [big.sides * small.sides, "That multiplies. Add the sides of the two shapes.", "这是相乘。要把两个图形的边数相加。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["shape-riddles#guess-the-shape"],
    },
  ],
  [
    'Riddle time! "I have 4 corners, and my sides are not all the same." Tom counts: 4 corners means 4 sides, so the answer is a quadrilateral.\n\nCheck: a quadrilateral has 4 sides and 4 corners.\n\nIn this lesson we use clues about sides and corners to name shapes, even shapes that look unusual.',
    "猜谜时间！“我有 4 个角，我的边不都一样长。”Tom 数了数：4 个角就是 4 条边，所以答案是四边形。\n\n检验：四边形有 4 条边、4 个角。\n\n本课我们根据边和角的线索说出图形的名称，即使图形看起来不常见。",
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
