// 1st Grade Math: counting and numbers to 120, tens and ones, comparing, adding
// and subtracting within 20, the equal sign, word problems, and adding and
// subtracting tens.

import type { Figure, Problem, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import {
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  nearbyWrong,
  numberLineFigure,
  tenFramesFigure,
} from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { blocksFigure, numberWordsEn, numberWordsZh, plural } from "./grade-2-numbers-operations.ts";
import { compareProblem, mathText, pickChoice } from "./grade-4-fractions.ts";

/** whole builds a problem whose answer is a whole number, with a figure when one is given. */
function whole(
  prompt: readonly [string, string],
  answer: number,
  wrong: readonly number[],
  solution: readonly [string, string],
  figure?: Figure,
): Problem {
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: nearbyWrong(answer, ...wrong),
    solution: t(solution[0], solution[1]),
  });
  return figure ? { ...problem, figure } : problem;
}

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
        "Numbers come in a fixed order, and each one is one more than the number before it. The ones digit goes up by one each time. When it reaches 9, the next number starts a new ten, so 39 is followed by 40. After 99 comes 100, and after that the counting goes on just as before.",
        "数有固定的顺序，每个数都比前一个数多 1。个位每次加 1。个位到 9 之后，下一个数就开始新的一个十，所以 39 的后面是 40。99 的后面是 100，然后像之前一样接着数。",
      ],
      (rng) => {
        const crossing = rng.bool();
        const n = crossing ? 10 * rng.int(1, 11) + 9 : rng.int(5, 119);
        const answer = n + 1;
        return whole(
          [`What number comes right after ${n}?`, `${n} 后面紧接着的数是多少？`],
          answer,
          [n - 1, n + 10, n + 2],
          [`Counting on by one from ${n} gives ${answer}.`, `从 ${n} 往后数一个，得到 ${answer}。`],
        );
      },
    ),
    earlyPoint(
      "the-missing-number-when-counting",
      ["The missing number when counting", "数数时缺少的数"],
      [
        "When a number is missing from a count, look at the numbers on both sides. The one before tells you where you are, and the one after tells you where you need to get to. Say them aloud in order, and the missing number will fill itself in. Take care where the tens change, as in 58, 59, 60.",
        "数列中缺一个数时，看看它两边的数。前面的数说明你到了哪里，后面的数说明要到哪里去。按顺序大声数，缺少的数就出来了。十位变化的地方要小心，比如 58、59、60。",
      ],
      (rng) => {
        const start = rng.int(4, 115);
        const gap = rng.int(1, 3);
        const answer = start + gap;
        const shown = [0, 1, 2, 3, 4].map((i) => (i === gap ? "\\square" : `${start + i}`)).join(", ");
        return whole(
          [`What number goes in the box? $${shown}$`, `方框里填几？$${shown}$`],
          answer,
          [answer + 10, answer - 10, start],
          [
            `Counting on from ${start} one at a time, the box comes at ${answer}.`,
            `从 ${start} 开始一个一个地往后数，方框里是 ${answer}。`,
          ],
        );
      },
    ),
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
        "A big pile is easier to count when it is set out in rows of ten. Count the full rows by tens: 10, 20, 30. Then count on by ones for the counters in the last row. Saying the tens first saves you from losing your place, and it also shows you what the digits of the number will be.",
        "一大堆东西排成每行十个，就容易数了。整行按十数：10、20、30。再一个一个地数最后一行。先数十，就不容易数乱，也能看出这个数的数字是什么。",
      ],
      (rng) => {
        const n = rng.int(11, 58);
        const fullRows = Math.floor(n / 10);
        const left = n % 10;
        return whole(
          ["How many counters are there?", "一共有多少个圆片？"],
          n,
          [10 * left + fullRows, fullRows + left, n + 10],
          [
            `There ${fullRows === 1 ? "is 1 full row" : `are ${fullRows} full rows`} of ten${left === 0 ? "" : ` and ${plural(left, "more counter")}`}, which makes ${n}.`,
            `有 ${fullRows} 个整行，每行十个${left === 0 ? "" : `，还有 ${left} 个`}，一共是 ${n}。`,
          ],
          countersFigure(n, 10),
        );
      },
    ),
    earlyPoint(
      "writing-a-named-number",
      ["Writing a named number", "写出说到的数"],
      [
        "A number's name tells you how to write it. Twenty-seven means 2 tens and 7 ones, so you write 27, with the tens on the left. A name such as sixty has no ones, so a zero goes in the ones place. For numbers past 100, you write the 1 first and then the rest of the number.",
        "数的读法告诉你怎么写。二十七是 2 个十和 7 个一，所以写作 27，十在左边。像六十这样的数没有一，所以个位写 0。超过 100 的数，先写 1，再写后面的部分。",
      ],
      (rng) => {
        const n = rng.bool() ? rng.int(11, 99) : rng.int(100, 120);
        const reversed = n < 100 ? 10 * (n % 10) + Math.floor(n / 10) : n - 100;
        return whole(
          [`Write this number with digits: ${numberWordsEn(n)}.`, `用数字写出这个数：${numberWordsZh(n)}。`],
          n,
          [reversed, n + 10, n - 10],
          n < 100
            ? [
                `The name means ${plural(Math.floor(n / 10), "ten")} and ${plural(n % 10, "one")}, which is written ${n}.`,
                `这个读法表示 ${Math.floor(n / 10)} 个十和 ${n % 10} 个一，写作 ${n}。`,
              ]
            : [`The name means 100 and ${n - 100} more, which is written ${n}.`, `这个读法表示 100 再加 ${n - 100}，写作 ${n}。`],
        );
      },
    ),
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
        "A ten-frame has room for exactly ten counters, five on top and five below. If a frame is full, you know it holds ten without counting. Start from ten and count on the counters in the next frame. Teen numbers are all like this: one full frame and some more, whichever color the counters happen to be.",
        "十格框正好能放十个圆片，上面五个，下面五个。框满了，不用数就知道是十个。从十开始，接着数下一个框里的圆片。十几的数都是这样：一个满框，再加一些，圆片是什么颜色都一样。",
      ],
      (rng) => {
        const total = rng.int(11, 19);
        const filled = rng.int(3, total - 1);
        return whole(
          ["How many counters are in the frames altogether?", "这些框里一共有多少个圆片？"],
          total,
          [filled, total - filled, total - 10],
          [
            `One frame is full, which is ten, and there ${total === 11 ? "is 1 more" : `are ${total - 10} more`}. That makes ${total}.`,
            `一个框满了，是十个，另一个框里还有 ${total - 10} 个，一共是 ${total}。`,
          ],
          tenFramesFigure(filled, total - filled),
        );
      },
    ),
    earlyPoint(
      "teen-numbers-as-ten-plus-ones",
      ["Teen numbers as ten plus ones", "十几等于十加几"],
      [
        "The numbers from 11 to 19 are each made of one ten and some ones. The 1 on the left of 16 is not one thing, it is one whole ten. The 6 on the right tells how many extra ones there are. So 16 is the same as ten and six more, and it can be written as $10 + 6$.",
        "11 到 19 都由一个十和几个一组成。16 左边的 1 不是一个东西，而是一个完整的十。右边的 6 说明多出几个一。所以 16 就是十再加六，可以写成 $10 + 6$。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const n = 10 + k;
        const form = rng.int(0, 3);
        const wrong = [k, 1 + k, 10, 10 * k + 1];
        const solution: readonly [string, string] = [
          `${n} is one ten and ${plural(k, "one")}, and $10 + ${k} = ${n}$.`,
          `${n} 是一个十和 ${k} 个一，$10 + ${k} = ${n}$。`,
        ];
        if (form === 0) return whole([`What is $10 + ${k}$?`, `$10 + ${k}$ 等于多少？`], n, wrong, solution);
        if (form === 1)
          return whole(
            [`What number goes in the box? $10 + \\square = ${n}$`, `方框里填几？$10 + \\square = ${n}$`],
            k,
            [n, 1, n - 1],
            solution,
          );
        if (form === 2) return whole([`What number is 1 ten and ${plural(k, "one")}?`, `1 个十和 ${k} 个一是多少？`], n, wrong, solution);
        return whole(
          [`How many ones are left over after making one ten from ${n}?`, `从 ${n} 里拿出一个十，还剩几个一？`],
          k,
          [n, 1, 10],
          solution,
        );
      },
    ),
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
        "A rod is a ten, and a small square is a one. Count the rods first and write how many on the left. Then count the small squares and write how many on the right. So 4 rods and 3 squares show 43. Mixing up the two places would give you 34, a very different number from the one shown.",
        "一根长条是一个十，一个小方块是一个一。先数长条，把个数写在左边。再数小方块，把个数写在右边。所以 4 根长条和 3 个小方块表示 43。如果把两位弄反，就成了 34，那是另一个完全不同的数。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const single = rng.int(0, 9);
        const answer = 10 * tens + single;
        return whole(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          answer,
          [10 * single + tens, tens + single],
          [
            `There ${tens === 1 ? "is 1 ten" : `are ${tens} tens`} and ${plural(single, "one")}, and that is ${answer}.`,
            `有 ${tens} 个十和 ${single} 个一，这个数是 ${answer}。`,
          ],
          blocksFigure(0, tens, single),
        );
      },
    ),
    earlyPoint(
      "the-tens-and-ones-in-a-number",
      ["The tens and ones in a number", "一个数里的十和一"],
      [
        "Each digit of a two-digit number has a job. The digit on the left counts tens, and the digit on the right counts ones. In 58, the 5 means five tens, or fifty, and the 8 means eight ones. Knowing which digit counts what will help whenever you compare, add or subtract these numbers later on.",
        "两位数的每个数字都有自己的任务。左边的数字数十，右边的数字数一。在 58 中，5 表示五个十，也就是五十，8 表示八个一。知道每个数字数的是什么，以后比较、加减这些数时都用得上。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const single = rng.int(1, 9);
        const n = 10 * tens + single;
        return rng.bool()
          ? whole(
              [`How many tens are in ${n}?`, `${n} 里有几个十？`],
              tens,
              [single, n, tens * 10],
              [`The digit on the left of ${n} counts tens, and it is ${tens}.`, `${n} 左边的数字数的是十，它是 ${tens}。`],
            )
          : whole(
              [`After taking out all the tens of ${n}, how many ones are left?`, `把 ${n} 里所有的十拿走，还剩几个一？`],
              single,
              [tens, n, single * 10],
              [`The digit on the right of ${n} counts ones, and it is ${single}.`, `${n} 右边的数字数的是一，它是 ${single}。`],
            );
      },
    ),
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
        "If things are packed in groups of ten, you can count them by tens. Two bags of ten are twenty, three bags are thirty, and so on. Count the bags as you say each ten aloud. Thirty looks like a 3 with a zero: the 3 tells you how many tens there are, and the 0 means there are no extra ones.",
        "东西每十个一组，就可以按十来数。两袋是二十，三袋是三十，以此类推。一边数袋子，一边大声说出每个十。30 看起来是 3 后面加一个 0：3 说明有几个十，0 说明没有多余的一。",
      ],
      (rng) => {
        const bags = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const answer = 10 * bags;
        return whole(
          [
            `${name} has ${bags} bags with 10 ${thing.en} in each bag. How many ${thing.en} is that?`,
            `${name} 有 ${bags} 个袋子，每袋 10 ${thing.unit}${thing.zh}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [bags, bags + 10, answer + 1],
          [
            `Counting by tens ${bags} times reaches ${answer}, since ${bags} tens are ${answer}.`,
            `按十数 ${bags} 次，数到 ${answer}，因为 ${bags} 个十是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "how-many-tens-in-a-round-number",
      ["How many tens in a round number", "整十数里有几个十"],
      [
        "You can also go the other way, starting with a round number such as 70 and asking how many tens it holds. The digit on the left tells you. So 70 is 7 tens, and you could fill exactly 7 bags of ten with no ones left over. This is the same fact as before, read from the other direction.",
        "也可以倒过来，从 70 这样的整十数出发，问它里面有几个十。左边的数字就告诉你了。所以 70 是 7 个十，正好能装满 7 袋，每袋十个，没有剩余。这和前面是同一个事实，只是从另一个方向来读。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const n = 10 * tens;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} puts ${n} ${thing.en} into bags of 10. How many bags can ${name} fill?`,
            `${name} 把 ${n} ${thing.unit}${thing.zh}装进袋子，每袋 10 ${thing.unit}。能装满多少袋？`,
          ],
          tens,
          [n, n - 10, 10],
          [
            `${n} is ${tens} tens, so ${tens} bags are filled, with none left over.`,
            `${n} 是 ${tens} 个十，所以能装满 ${tens} 袋，没有剩余。`,
          ],
        );
      },
    ),
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
        "Look at the tens first, since a ten is worth more than any number of ones. The number with more tens is the greater one, even if its ones digit is small: 41 is greater than 39. Only if the tens match do you need to look at the ones. The open side of the symbol faces the greater number.",
        "先看十位，因为一个十比任何几个一都大。十位大的数就大，即使它的个位很小：41 大于 39。只有十位相同时，才需要看个位。符号开口的一边对着较大的数。",
      ],
      (rng) => {
        const a = rng.int(10, 99);
        const kind = rng.int(0, 7);
        const sameTens = 10 * Math.floor(a / 10) + rng.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a % 10));
        const b = kind === 0 ? a : kind <= 3 ? sameTens : rng.pick([...Array(90).keys()].map((v) => v + 10).filter((v) => v !== a));
        const rel = a < b ? 0 : a === b ? 1 : 2;
        return compareProblem(
          `${a}`,
          `${b}`,
          rel,
          rel === 1
            ? t("Both numbers have the same tens and the same ones, so they are equal.", "两个数的十位和个位都相同，所以它们相等。")
            : Math.floor(a / 10) === Math.floor(b / 10)
              ? t(
                  `The tens match, so compare the ones: ${Math.max(a, b)} is greater than ${Math.min(a, b)}.`,
                  `十位相同，所以比个位：${Math.max(a, b)} 大于 ${Math.min(a, b)}。`,
                )
              : t(
                  `Compare the tens: ${Math.max(a, b)} has more tens, so it is greater than ${Math.min(a, b)}.`,
                  `比十位：${Math.max(a, b)} 的十更多，所以它大于 ${Math.min(a, b)}。`,
                ),
        );
      },
    ),
    earlyPoint(
      "greatest-and-least-two-digit-numbers",
      ["Greatest and least", "最大和最小"],
      [
        "To find the greatest of several numbers, look along the tens digits and pick out the largest. If two numbers share it, the larger ones digit decides. To find the least, do the same with the smallest tens digit. You compare just one digit at a time, so the task stays small even when there are many numbers to look at.",
        "要找几个数中最大的，就看十位，挑出最大的。如果有两个数十位相同，就由个位决定。要找最小的，就用同样的办法看最小的十位。每次只比一个数字，所以数再多，这件事也不难。",
      ],
      (rng) => {
        const pool = rng.sample(
          [...Array(90).keys()].map((v) => v + 10),
          4,
        );
        const asksGreatest = rng.bool();
        const sorted = [...pool].sort((x, y) => x - y);
        const correct = (asksGreatest ? sorted[3] : sorted[0]) as number;
        return pickChoice(
          rng,
          t(`Which of these numbers is the ${asksGreatest ? "greatest" : "least"}?`, `下面哪个数${asksGreatest ? "最大" : "最小"}？`),
          mathText(`${correct}`),
          pool.filter((v) => v !== correct).map((v) => mathText(`${v}`)),
          t(
            `In order, the numbers are ${sorted.join(", ")}, so the ${asksGreatest ? "greatest" : "least"} is ${correct}.`,
            `按顺序排列是 ${sorted.join("、")}，所以${asksGreatest ? "最大" : "最小"}的是 ${correct}。`,
          ),
        );
      },
    ),
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
        "Adding means moving forward along the numbers. Put your finger on the marked number and make one hop to the right for every one you are adding. Say the next number at each hop, and do not count the place where you began. The number you stop on is the total, and there was no need to count from one.",
        "加法就是沿着数往前走。把手指放在标出的数上，加几就向右跳几下。每跳一下，就说出下一个数，开始的地方不算。停在哪个数上，总数就是几，不需要从一开始数。",
      ],
      (rng) => {
        const a = rng.int(3, 15);
        const b = rng.int(2, Math.min(5, 20 - a));
        const lo = Math.max(0, a - rng.int(0, 2));
        const answer = a + b;
        return whole(
          [`The marked point is at ${a}. Count on ${b} more. What number do you reach?`, `标出的点在 ${a}。再往后数 ${b} 个。到了哪个数？`],
          answer,
          [answer - 1, a, b],
          [
            `Starting after ${a}, count ${b} hops to the right, and you land on ${answer}.`,
            `从 ${a} 开始向右跳 ${b} 下，落在 ${answer} 上。`,
          ],
          numberLineFigure(lo, lo + 10, 1, a),
        );
      },
    ),
    earlyPoint(
      "starting-from-the-bigger-number",
      ["Starting from the bigger number", "从较大的数开始"],
      [
        "You can add two numbers in either order, so begin with the bigger one. That way you have fewer numbers to count on. For $2 + 9$, begin at 9 and count on two: 10, 11. This is far less work than starting at 2 and counting on nine, where you could easily lose track of the hops.",
        "两个数相加，顺序可以换，所以从较大的数开始。这样要往后数的次数就少了。算 $2 + 9$ 时，从 9 开始往后数两个：10、11。这比从 2 开始往后数九个省事得多，数九个很容易数乱。",
      ],
      (rng) => {
        const big = rng.int(4, 17);
        const small = rng.int(1, Math.min(3, 20 - big));
        const [a, b] = rng.bool() ? [big, small] : [small, big];
        const answer = big + small;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [big, answer + 10],
          [
            `Start at the bigger number, ${big}, and count on ${small} to reach ${answer}.`,
            `从较大的数 ${big} 开始，往后数 ${small} 个，得到 ${answer}。`,
          ],
        );
      },
    ),
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
        "Taking away means moving backward along the numbers. Put your finger on the marked number and make one hop to the left for each one you are taking away. Say each number as you land on it, without counting where you began. The number you stop on is what is left, and it must be less than the start.",
        "减法就是沿着数往回走。把手指放在标出的数上，减几就向左跳几下。每落在一个数上，就说出这个数，开始的地方不算。停在哪个数上，剩下的就是几，它一定比开始的数小。",
      ],
      (rng) => {
        const a = rng.int(6, 20);
        const b = rng.int(2, 5);
        const hi = Math.min(20, a + rng.int(0, 2));
        const lo = Math.max(0, hi - 10);
        const answer = a - b;
        return whole(
          [`The marked point is at ${a}. Count back ${b}. What number do you reach?`, `标出的点在 ${a}。往前数 ${b} 个。到了哪个数？`],
          answer,
          [a + b, a, answer + 1],
          [`Starting at ${a}, count ${b} hops to the left, and you land on ${answer}.`, `从 ${a} 开始向左跳 ${b} 下，落在 ${answer} 上。`],
          numberLineFigure(lo, lo + 10, 1, a),
        );
      },
    ),
    earlyPoint(
      "counting-back-in-your-head",
      ["Counting back in your head", "在心里往前数"],
      [
        "When you take away just one, two or three, you can count back in your head. Keep the first number in mind and say the numbers below it, holding up a finger for each one. Stop when the fingers match what you are taking away. The last number you said is the answer, so the first number is not counted.",
        "只减一、二、三时，可以在心里往前数。记住第一个数，往下说它前面的数，每说一个就伸出一根手指。手指的个数和要减的数一样时就停下。最后说的数就是答案，所以第一个数不算。",
      ],
      (rng) => {
        const a = rng.int(5, 20);
        const b = rng.int(1, 3);
        const answer = a - b;
        const steps = Array.from({ length: b }, (_, i) => a - i - 1).join(", ");
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [a + b, a, answer + 1],
          [`Count back from ${a}: ${steps}. So the answer is ${answer}.`, `从 ${a} 往前数：${steps}。所以答案是 ${answer}。`],
        );
      },
    ),
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
        "Ten is a special number, as our counting is built on it, so it pays to know the pairs that make it. Look at a ten-frame with some counters in it. The empty boxes show how many more you need to fill it. So seven counters leave three empty boxes, which tells you that seven and three make ten.",
        "十是一个特别的数，因为我们就是按十来数的，所以记住能凑成十的数对很有用。看一个放了一些圆片的十格框。空格说明还差几个才满。所以七个圆片留下三个空格，说明七和三凑成十。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const answer = 10 - a;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return rng.bool()
          ? whole(
              [`How many more counters would fill this frame?`, `还要多少个圆片才能放满这个框？`],
              answer,
              [a, 10, a + 1],
              [
                `There are 10 boxes and ${a} ${a === 1 ? "is" : "are"} filled, and $${a} + ${answer} = 10$.`,
                `一共有 10 个格子，已经放了 ${a} 个，$${a} + ${answer} = 10$。`,
              ],
              tenFramesFigure(a),
            )
          : whole(
              [
                `${name} has ${a} ${thing.en} and wants 10. How many more ${thing.en} does ${name} need?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，想要 10 ${thing.unit}。还需要多少${thing.unit}？`,
              ],
              answer,
              [a, 10, a + 10],
              [
                `$${a} + ${answer} = 10$, so ${name} needs ${answer} more.`,
                `$${a} + ${answer} = 10$，所以 ${name} 还需要 ${answer} ${thing.unit}。`,
              ],
            );
      },
    ),
    earlyPoint(
      "adding-past-ten-by-making-ten",
      ["Adding past ten by making ten", "用凑十法加过十"],
      [
        "To add past ten, first fill up to ten and then add what is left. For $8 + 5$, the 8 needs 2 to reach ten, so split the 5 into 2 and 3. Now $8 + 2$ is ten, and ten and 3 more is 13. Sums with ten are easy to read, and that is why this trick works so well.",
        "加过十时，先凑满十，再加上剩下的。算 $8 + 5$ 时，8 还差 2 就是十，所以把 5 分成 2 和 3。$8 + 2$ 是十，十再加 3 是 13。和十相加很容易读出结果，所以这个办法特别好用。",
      ],
      (rng) => {
        const a = rng.int(6, 9);
        const b = rng.int(11 - a, 9);
        const rest = a + b - 10;
        const answer = a + b;
        const figure = tenFramesFigure(a, b);
        return rng.bool()
          ? whole(
              [
                `Fill the first frame to make ten. What number goes in the box? $${a} + ${b} = 10 + \\square$`,
                `先把第一个框放满，凑成十。方框里填几？$${a} + ${b} = 10 + \\square$`,
              ],
              rest,
              [b, 10 - a, answer],
              [
                `${a} needs ${10 - a} to make ten, and that leaves $${b} - ${10 - a} = ${rest}$.`,
                `${a} 差 ${10 - a} 就是十，$${b} - ${10 - a} = ${rest}$，还剩 ${rest}。`,
              ],
              figure,
            )
          : whole(
              [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
              answer,
              [answer - 10, a * b],
              [
                `Move ${10 - a} to make ten, which leaves ${rest}, and $10 + ${rest} = ${answer}$.`,
                `挪 ${10 - a} 凑成十，还剩 ${rest}，$10 + ${rest} = ${answer}$。`,
              ],
              figure,
            );
      },
    ),
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
        "A double is a number added to itself, as with the eggs in two matching rows or the wheels on two bikes. Doubles are worth knowing by heart, because they come up everywhere and they are easy to picture. A double always gives an even number, so there is a matching partner for each counter on one side of the picture.",
        "两个相同的数相加，就像两排一样多的鸡蛋，或者两辆自行车的轮子。这样的算式值得记熟，因为到处都用得上，也很容易想象。两个相同的数相加，结果总是偶数，所以一边的每个圆片都有一个伙伴。",
      ],
      (rng) => {
        const n = rng.int(2, 10);
        const answer = 2 * n;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return rng.bool()
          ? whole(
              [`What is $${n} + ${n}$?`, `$${n} + ${n}$ 等于多少？`],
              answer,
              [n, n + 1],
              [`Two groups of ${n} make ${answer}: $${n} + ${n} = ${answer}$.`, `两组 ${n} 是 ${answer}：$${n} + ${n} = ${answer}$。`],
            )
          : whole(
              [
                `${name} has ${n} ${thing.en} in each of two boxes. How many ${thing.en} is that?`,
                `${name} 有两个盒子，每个盒子里有 ${n} ${thing.unit}${thing.zh}。一共有多少${thing.unit}${thing.zh}？`,
              ],
              answer,
              [n, n + 2],
              [`Two groups of ${n} make ${answer}: $${n} + ${n} = ${answer}$.`, `两组 ${n} 是 ${answer}：$${n} + ${n} = ${answer}$。`],
            );
      },
    ),
    earlyPoint(
      "using-a-double-you-know",
      ["Using a double you know", "用记住的算式"],
      [
        "When two numbers are next to each other, such as 6 and 7, you can use a double. You know that $6 + 6$ is 12, and 7 is one more than 6, so $6 + 7$ is one more than 12. You could also use $7 + 7$ and take one away. Both ways land on the same answer, 13.",
        "两个数相邻时，比如 6 和 7，就可以用两个相同的数相加。你知道 $6 + 6$ 是 12，7 比 6 多 1，所以 $6 + 7$ 比 12 多 1。也可以用 $7 + 7$，再减去 1。两种办法都得到同样的答案：13。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const up = rng.bool();
        const [a, b] = up ? [n, n + 1] : [n + 1, n];
        const answer = 2 * n + 1;
        return rng.bool()
          ? whole(
              [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
              answer,
              [2 * n, 2 * n + 2],
              [`$${n} + ${n} = ${2 * n}$, and one more makes ${answer}.`, `$${n} + ${n} = ${2 * n}$，再多 1 是 ${answer}。`],
            )
          : whole(
              [`Given that $${n} + ${n} = ${2 * n}$, what is $${a} + ${b}$?`, `已知 $${n} + ${n} = ${2 * n}$，$${a} + ${b}$ 等于多少？`],
              answer,
              [2 * n, 2 * n + 2],
              [
                `One of the addends is one more than ${n}, so the sum is one more than ${2 * n}: ${answer}.`,
                `其中一个加数比 ${n} 多 1，所以和比 ${2 * n} 多 1：${answer}。`,
              ],
            );
      },
    ),
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
        "Picture two groups of counters side by side. If you walk around to the other side, the groups have swapped places, but there are still just as many counters. So two addends can change places without changing the sum. That means you can learn half as many facts, as knowing one sum tells you about its partner too.",
        "想象两组圆片并排放着。如果走到另一边去看，这两组就换了位置，但圆片还是那么多。所以两个加数可以交换位置，和不变。这样要记的算式就少了一半，知道一个算式，也就知道了和它相对的那一个。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a && v + a <= 20));
        return whole(
          [`What number goes in the box? $${a} + ${b} = ${b} + \\square$`, `方框里填几？$${a} + ${b} = ${b} + \\square$`],
          a,
          [b, a + b, a + 2 * b],
          [`Both sides have the same two addends, so the box holds ${a}.`, `两边的两个加数相同，所以方框里是 ${a}。`],
        );
      },
    ),
    earlyPoint(
      "using-a-known-sum",
      ["Using a sum you know", "用知道的和"],
      [
        "When you are given one sum, its partner comes free. If the addends are swapped, you do not need to work out anything new, as the total is the same. It is worth stopping to look at the numbers before you start to count, because the answer may already be written down in front of you on the page.",
        "知道一个和，与它相对的和也就知道了。如果两个加数只是交换了位置，就不用再算了，因为总数一样。开始数之前，先停下来看看这些数，答案可能已经写在你面前了。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.pick([3, 4, 5, 6, 7, 8].filter((v) => v !== a));
        const answer = a + b;
        return whole(
          [`You know that $${a} + ${b} = ${answer}$. What is $${b} + ${a}$?`, `你知道 $${a} + ${b} = ${answer}$。$${b} + ${a}$ 等于多少？`],
          answer,
          [a, b, Math.abs(a - b)],
          [`The addends only swapped places, so the sum is still ${answer}.`, `加数只是交换了位置，所以和还是 ${answer}。`],
        );
      },
    ),
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
        "To add three numbers, add two of them first. Then add the third to what you got. You may do this in any order, and the sum will come out the same. Choosing a good pair makes it easier, so look for two numbers you can add quickly, such as a double or a pair that makes ten.",
        "三个数相加，先加其中两个，再把第三个加到结果上。可以按任意顺序，和都一样。选一对好加的数会更容易，比如两个相同的数，或者能凑成十的一对。",
      ],
      (rng) => {
        const a = rng.int(2, 8);
        const b = rng.int(2, 7);
        const c = rng.int(2, Math.min(9, 20 - a - b));
        const answer = a + b + c;
        return whole(
          [`What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c}$ 等于多少？`],
          answer,
          [a + b, b + c],
          [
            `First, $${a} + ${b} = ${a + b}$. Then $${a + b} + ${c} = ${answer}$.`,
            `先算 $${a} + ${b} = ${a + b}$。再算 $${a + b} + ${c} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "finding-the-pair-that-makes-ten",
      ["Finding the pair that makes ten", "找出凑成十的一对"],
      [
        "When three numbers are to be added, check whether two of them make ten. If so, add those first, even if they are not next to each other. Ten and one more number is very easy to add, as you just read it off: ten and 4 is 14. This saves you from a harder step along the way.",
        "三个数相加时，先看看有没有两个数能凑成十。如果有，就先加它们，即使它们不挨着。十再加一个数很容易，直接读出来就行：十和 4 是 14。这样中间就少了一步难算的。",
      ],
      (rng) => {
        const k = rng.int(1, 4);
        const other = rng.pick([2, 3, 4, 5, 6, 7, 8].filter((v) => v !== k && v !== 10 - k && v + k !== 10 && v + (10 - k) !== 10));
        const nums = rng.shuffle([k, 10 - k, other]);
        const shown = nums.join(" + ");
        return pickChoice(
          rng,
          t(`To work out $${shown}$, which two numbers should you add first to make ten?`, `要算 $${shown}$，应该先加哪两个数来凑成十？`),
          mathText(`${k} + ${10 - k}`),
          [mathText(`${k} + ${other}`), mathText(`${10 - k} + ${other}`), mathText(`${other} + ${other}`)],
          t(
            `$${k} + ${10 - k} = 10$, and then $10 + ${other} = ${10 + other}$.`,
            `$${k} + ${10 - k} = 10$，然后 $10 + ${other} = ${10 + other}$。`,
          ),
        );
      },
    ),
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
        "To take a number away from a teen number, stop at ten along the way. Split the number you are taking away into two parts, the first part taking you back to ten and the second part taking you down from there. For $14 - 6$, take 4 to reach ten, and then 2 more, which leaves you at 8.",
        "从十几减去一个数时，中间在十停一下。把要减的数分成两部分，第一部分让你退到十，第二部分从十再往下减。算 $14 - 6$ 时，先减 4 到十，再减 2，结果是 8。",
      ],
      (rng) => {
        const a = rng.int(11, 18);
        const first = a - 10;
        const b = rng.int(first + 1, 9);
        const more = b - first;
        return whole(
          [
            `To work out $${a} - ${b}$, first take away ${first} to reach 10. How much more do you need to take away?`,
            `要算 $${a} - ${b}$，先减 ${first} 到 10。还要再减多少？`,
          ],
          more,
          [b, first, a - b],
          [
            `${b} is split into ${first} and ${more}, since $${first} + ${more} = ${b}$.`,
            `${b} 被分成 ${first} 和 ${more}，因为 $${first} + ${more} = ${b}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-from-teen-numbers",
      ["Subtracting from teen numbers", "十几减几"],
      [
        "Put the whole method together now. Look at the ones of the teen number to see how far back ten is. Take that much away to land on ten, and then subtract the rest from ten. Knowing your pairs that make ten is what makes this last step fast, and you can check the answer by adding back.",
        "现在把整个方法合起来。看十几的个位，就知道退到十要减多少。减去这么多，落在十上，再用十减去剩下的。记住凑成十的数对，最后这一步就快了，还可以把答案加回去来检验。",
      ],
      (rng) => {
        const a = rng.int(11, 18);
        const first = a - 10;
        const b = rng.int(first + 1, 9);
        const answer = a - b;
        return whole(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [a + b, answer + 10, b],
          [
            `Take ${first} to reach 10, then ${b - first} more: $10 - ${b - first} = ${answer}$.`,
            `先减 ${first} 到 10，再减 ${b - first}：$10 - ${b - first} = ${answer}$。`,
          ],
        );
      },
    ),
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
        "Addition and subtraction undo each other. If two parts make a whole, then taking one part from the whole leaves the other part. So when you know that $8 + 5 = 13$, you also know that $13 - 5 = 8$ and $13 - 8 = 5$. The three numbers belong together, and they make a little family of facts.",
        "加法和减法互相抵消。如果两部分合成一个整体，从整体里拿走一部分，就剩下另一部分。所以知道 $8 + 5 = 13$，也就知道 $13 - 5 = 8$ 和 $13 - 8 = 5$。这三个数是一起的，组成一个小小的算式家庭。",
      ],
      (rng) => {
        const a = rng.int(3, 11);
        const b = rng.int(2, 9);
        const c = a + b;
        return whole(
          [`You know that $${a} + ${b} = ${c}$. What is $${c} - ${b}$?`, `你知道 $${a} + ${b} = ${c}$。$${c} - ${b}$ 等于多少？`],
          a,
          [b, c, c + b],
          [`${c} is made of ${a} and ${b}, so taking away ${b} leaves ${a}.`, `${c} 由 ${a} 和 ${b} 组成，所以减去 ${b} 剩下 ${a}。`],
        );
      },
    ),
    earlyPoint(
      "facts-in-the-same-family",
      ["Facts in the same family", "同一家的算式"],
      [
        "A family of facts uses the same three numbers, a whole and its two parts. The whole comes first in a subtraction and last in an addition. Any sentence that puts the whole in a part's place is not true, even if it uses the right numbers. Read each choice aloud, and ask if the parts really do make the whole.",
        "一家算式用的是同样的三个数：一个整体和它的两部分。在减法里整体在最前面，在加法里整体在最后面。把整体放到部分的位置上，即使用的数对，算式也不对。把每个选项读出来，想一想这两部分是否真能组成整体。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.pick([3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        return pickChoice(
          rng,
          t(
            `Which of these is true and uses the same three numbers as $${a} + ${b} = ${c}$?`,
            `下面哪个算式是对的，并且和 $${a} + ${b} = ${c}$ 用同样的三个数？`,
          ),
          mathText(`${c} - ${a} = ${b}`),
          [
            mathText(`${c} - ${a} = ${a}`),
            mathText(`${a} - ${b} = ${c}`),
            mathText(`${c} + ${a} = ${b}`),
            mathText(`${b} - ${a} = ${c}`),
          ].filter((_, i) => i < 3),
          t(`The whole is ${c}, and taking the part ${a} from it leaves the part ${b}.`, `整体是 ${c}，减去部分 ${a}，剩下部分 ${b}。`),
        );
      },
    ),
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
        "A box in a number sentence stands for a number we do not know yet. To find it, you can count up from the part you know to the total, keeping track of how many you count. Or you can take the part you know away from the total. Then read the sentence with your number to check it is true.",
        "算式里的方框表示一个还不知道的数。可以从知道的部分往上数到总数，记住数了多少。也可以用总数减去知道的部分。然后把这个数放进算式读一遍，检查对不对。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const answer = rng.int(2, 8);
        const c = a + answer;
        const first = rng.bool();
        const shown = first ? `${a} + \\square = ${c}` : `\\square + ${a} = ${c}`;
        return whole(
          [`What number goes in the box? $${shown}$`, `方框里填几？$${shown}$`],
          answer,
          [c, a + c, a],
          [
            `Counting up from ${a} to ${c} takes ${answer} steps, so $${a} + ${answer} = ${c}$.`,
            `从 ${a} 往上数到 ${c} 要数 ${answer} 步，所以 $${a} + ${answer} = ${c}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "the-box-in-a-subtraction",
      ["The box in a subtraction", "减法里的方框"],
      [
        "Subtraction can hide a number too. In $13 - \\square = 8$, some amount was taken from 13, and that left 8. Think of it as a missing part: what do you add to 8 to get back up to 13? Counting up from 8 gives you the answer, and that is often easier than trying numbers one by one.",
        "减法也可以藏起一个数。在 $13 - \\square = 8$ 中，从 13 里减去一些，还剩 8。把它看成未知的部分：8 加几回到 13？从 8 往上数就能得到答案，这常常比一个一个地试更容易。",
      ],
      (rng) => {
        const answer = rng.int(2, 9);
        const left = rng.int(2, 11);
        const c = answer + left;
        return whole(
          [`What number goes in the box? $${c} - \\square = ${left}$`, `方框里填几？$${c} - \\square = ${left}$`],
          answer,
          [left, c, c + left],
          [
            `Counting up from ${left} to ${c} takes ${answer} steps, so $${c} - ${answer} = ${left}$.`,
            `从 ${left} 往上数到 ${c} 要数 ${answer} 步，所以 $${c} - ${answer} = ${left}$。`,
          ],
        );
      },
    ),
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
        "The equal sign does not mean that the answer comes next. It means the two sides are worth the same, like a balance that stays level. So $6 = 6$ is true, $9 = 4 + 5$ is true, and so is $3 + 4 = 5 + 2$. To test a sentence, work out each side on its own and see whether they match.",
        "等号并不是说后面就是答案，它表示两边的值相同，就像一架保持平衡的天平。所以 $6 = 6$ 是对的，$9 = 4 + 5$ 是对的，$3 + 4 = 5 + 2$ 也是对的。要判断一个算式，就把两边分别算出来，看是否相同。",
      ],
      (rng) => {
        const s = rng.int(6, 15);
        const p = rng.int(1, s - 1);
        const q = rng.pick([...Array(s - 1).keys()].map((v) => v + 1).filter((v) => v !== p && v !== s - p));
        const form = rng.int(0, 2);
        const correct = form === 0 ? `${p} + ${s - p} = ${q} + ${s - q}` : form === 1 ? `${s} = ${p} + ${s - p}` : `${s} = ${s}`;
        return pickChoice(
          rng,
          t("Which of these is true?", "下面哪个算式是对的？"),
          mathText(correct),
          [
            mathText(`${p} + ${s - p} = ${q} + ${s - q + 1}`),
            mathText(`${s} = ${p} + ${s - p + 1}`),
            mathText(`${s} = ${s + 1}`),
            mathText(`${p} + ${s - p} = ${s - 1}`),
          ].slice(0, 3),
          t(
            `Each side of $${correct}$ has the same value, ${s}, so the sentence is true. In each of the others, the two sides differ.`,
            `$${correct}$ 两边的值都是 ${s}，所以这个算式是对的。其他算式两边的值都不同。`,
          ),
        );
      },
    ),
    earlyPoint(
      "balancing-both-sides",
      ["Balancing both sides", "让两边相等"],
      [
        "Sometimes a box sits on the side of the equal sign that also has another number. Work out the side you can finish first, and then ask what the box must be so that the other side has the same value. A common slip is to write down the sum of the first side, which leaves the two sides out of balance.",
        "有时方框所在的那一边还有另一个数。先算出能算完的那一边，再想一想方框里是几，才能让另一边的值相同。常见的差错是直接写上第一边的和，这样两边就不相等了。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const s = a + b;
        const c = rng.pick([...Array(s - 1).keys()].map((v) => v + 1).filter((v) => v !== a && v !== b));
        const answer = s - c;
        return whole(
          [`What number goes in the box? $${a} + ${b} = \\square + ${c}$`, `方框里填几？$${a} + ${b} = \\square + ${c}$`],
          answer,
          [s, s + c, c],
          [
            `The left side is ${s}, so the right side must also be ${s}, and $${answer} + ${c} = ${s}$.`,
            `左边是 ${s}，所以右边也必须是 ${s}，$${answer} + ${c} = ${s}$。`,
          ],
        );
      },
    ),
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
        "In this kind of story you start with some things and then more arrive. The amount grows, so you add. It may help to act it out with counters or to draw a quick picture. Put out the first amount, then the second, and count them together. Your drawing need not be pretty, as long as you can count it.",
        "这种故事里，开始有一些东西，后来又来了一些。数量变多了，所以用加法。可以用圆片摆一摆，或者快速画个图。先摆出第一个数量，再摆第二个，然后一起数。图不用画得好看，能数就行。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(3, 12);
        const b = rng.int(2, Math.min(8, 20 - a));
        const answer = a + b;
        return whole(
          [
            `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [a, b, Math.abs(a - b)],
          [`More arrive, so add: $${a} + ${b} = ${answer}$.`, `又来了一些，所以相加：$${a} + ${b} = ${answer}$。`],
        );
      },
    ),
    earlyPoint(
      "two-groups-together",
      ["Two groups together", "两组合起来"],
      [
        "Here nothing arrives, as both groups are already there. You are asked how many there are when they are thought of as one group. Red apples and green apples are still apples, so you add them. Look out for the words in all, altogether or both, but read the whole story, as such words can sometimes be missing.",
        "这里没有新来的东西，两组都已经在那里了。问的是把它们看成一组时有多少。红苹果和绿苹果都是苹果，所以相加。留意“一共”“总共”这样的词，但要读完整个故事，因为有时候这些词不会出现。",
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
        return whole(
          [
            `There are ${a} ${thing.en} ${place.en} ${b} ${place.where}. How many ${thing.en} are there in all?`,
            `${place.zh1}有 ${a} ${thing.unit}${thing.zh}，${place.zh2}有 ${b} ${thing.unit}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [a, b, Math.abs(a - b)],
          [`Together the two groups make $${a} + ${b} = ${answer}$.`, `两组合起来是 $${a} + ${b} = ${answer}$。`],
        );
      },
    ),
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
        "In this kind of story you start with some things and then a few are eaten, lost or given away. The amount shrinks, so you subtract. Act it out by putting out the first number of counters and taking some of them away. Whatever is still on the table when you stop is the answer to the question.",
        "这种故事里，开始有一些东西，后来吃掉了、丢了或送走了几个。数量变少了，所以用减法。摆出第一个数量的圆片，再拿走一些。停下来时桌上还剩多少，就是答案。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(6, 20);
        const b = rng.int(2, a - 2);
        const answer = a - b;
        return whole(
          [
            `${name} has ${a} ${thing.en} and gives away ${b}. How many ${thing.en} does ${name} have left?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，送出 ${b} ${thing.unit}。${name} 还剩多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [a + b, a, b],
          [`Some go away, so subtract: $${a} - ${b} = ${answer}$.`, `少了一些，所以相减：$${a} - ${b} = ${answer}$。`],
        );
      },
    ),
    earlyPoint(
      "the-rest-of-a-group",
      ["The rest of a group", "一组中其余的"],
      [
        "Sometimes nothing goes away, but a group is made of two kinds of things. If you know how many there are in all and how many are of one kind, then the rest must be of the other kind. This is still a subtraction: take the part you know from the whole group, and the part you want is left.",
        "有时没有东西离开，只是一组里有两种东西。知道一共有多少，又知道其中一种有多少，其余的就是另一种。这还是减法：从整组中减去知道的部分，剩下的就是要求的部分。",
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
        return whole(
          [
            `There are ${a} ${thing.en}. ${b} are ${color.one}, and the rest are ${color.other}. How many are ${color.other}?`,
            `有 ${a} ${thing.unit}${thing.zh}。其中 ${b} ${thing.unit}是${color.zh1}的，其余的是${color.zh2}的。${color.zh2}的有多少${thing.unit}？`,
          ],
          answer,
          [a + b, a, b],
          [
            `The ${color.other} ones are what remains: $${a} - ${b} = ${answer}$.`,
            `${color.zh2}的就是剩下的部分：$${a} - ${b} = ${answer}$。`,
          ],
        );
      },
    ),
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
        "To compare two amounts, line them up in two rows and match them one to one. Those that have no partner are the extras, and they show how many more one row has. You do not take anything away in the story, but you can still find the answer by subtracting the smaller amount from the larger.",
        "比较两个数量时，把它们排成两行，一一对应。没有伙伴的就是多出来的，它们说明一行比另一行多多少。故事里并没有拿走什么，但还是可以用较大的数减较小的数来求答案。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const small = rng.int(2, 12);
        const answer = rng.int(1, Math.min(8, 20 - small));
        const big = small + answer;
        return whole(
          [
            `${n1} has ${small} ${thing.en} and ${n2} has ${big} ${thing.en}. How many more ${thing.en} does ${n2} have than ${n1}?`,
            `${n1} 有 ${small} ${thing.unit}${thing.zh}，${n2} 有 ${big} ${thing.unit}${thing.zh}。${n2} 比 ${n1} 多多少${thing.unit}？`,
          ],
          answer,
          [big, small, big + small],
          [`Matching them leaves extras, and $${big} - ${small} = ${answer}$.`, `一一对应后，多出来的是 $${big} - ${small} = ${answer}$。`],
        );
      },
    ),
    earlyPoint(
      "finding-the-other-amount",
      ["Finding the other amount", "求另一个数量"],
      [
        "Some stories tell you one amount and how much more or fewer the other one has. Picture two rows, with the longer row sticking out. If the row you want is longer, you add the extra. If the row you want is shorter, you take the extra away. Decide which row is longer before you do any adding or subtracting.",
        "有些故事告诉你一个数量，还告诉你另一个多多少或少多少。想象两行，长的那一行多出一截。要求的那一行长，就加上多出来的；要求的那一行短，就减去多出来的。先想清楚哪一行长，再去加或减。",
      ],
      (rng) => {
        const [n1, n2] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const known = rng.int(6, 14);
        const diff = rng.int(2, 5);
        const more = rng.bool();
        const answer = more ? known + diff : known - diff;
        return whole(
          [
            `${n1} has ${known} ${thing.en}. ${n2} has ${diff} ${more ? "more" : "fewer"} than ${n1}. How many ${thing.en} does ${n2} have?`,
            `${n1} 有 ${known} ${thing.unit}${thing.zh}。${n2} 比 ${n1} ${more ? "多" : "少"} ${diff} ${thing.unit}。${n2} 有多少${thing.unit}？`,
          ],
          answer,
          [more ? known - diff : known + diff, known, diff],
          [
            `${n2} has ${more ? "more" : "fewer"} than ${n1}, so ${more ? `add: $${known} + ${diff}` : `subtract: $${known} - ${diff}`} = ${answer}$.`,
            `${n2} 比 ${n1} ${more ? "多" : "少"}，所以${more ? `相加：$${known} + ${diff}` : `相减：$${known} - ${diff}`} = ${answer}$。`,
          ],
        );
      },
    ),
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
        "Sometimes you know how a story begins and ends, but not what happened in the middle. Write it as a number sentence with a box for the part you do not know. So having 6 and then having 13 gives $6 + \\square = 13$. You can count up from the start to the end to find how many came along.",
        "有时知道故事的开头和结尾，却不知道中间发生了什么。写成算式，用方框表示不知道的部分。开始有 6 个，后来有 13 个，就是 $6 + \\square = 13$。从开始的数往上数到结尾的数，就知道来了多少。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const start = rng.int(3, 12);
        const answer = rng.int(2, Math.min(8, 20 - start));
        const end = start + answer;
        return whole(
          [
            `${name} had ${start} ${thing.en} and then found some more. Now ${name} has ${end}. How many ${thing.en} did ${name} find?`,
            `${name} 原来有 ${start} ${thing.unit}${thing.zh}，后来又找到一些，现在有 ${end} ${thing.unit}。${name} 找到多少${thing.unit}？`,
          ],
          answer,
          [end, start, end + start],
          [
            `$${start} + \\square = ${end}$, and counting up from ${start} to ${end} takes ${answer} steps.`,
            `$${start} + \\square = ${end}$，从 ${start} 往上数到 ${end} 要数 ${answer} 步。`,
          ],
        );
      },
    ),
    earlyPoint(
      "how-many-at-the-start",
      ["How many at the start", "开始有多少"],
      [
        "Other stories hide the very start. To find it, go backward through the story. If someone gave away some and has a few left, then both of those amounts were there at the start, so you add them. If someone got some more, then the start is what you have after you take those extra ones away again.",
        "还有些故事把开头藏起来了。要求它，就把故事倒过来想。如果有人送走了一些，还剩几个，那么这两部分开始时都在，所以相加。如果有人又得到一些，那么开始的数量就是把这些多出来的去掉以后剩下的。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const change = rng.int(2, 8);
        const other = rng.int(3, 11);
        return rng.bool()
          ? whole(
              [
                `${name} gave away ${change} ${thing.en} and has ${other} left. How many ${thing.en} did ${name} have at the start?`,
                `${name} 送出 ${change} ${thing.unit}${thing.zh}，还剩 ${other} ${thing.unit}。${name} 原来有多少${thing.unit}？`,
              ],
              change + other,
              [Math.abs(other - change), change, other],
              [
                `Put back what was given away: $${other} + ${change} = ${change + other}$.`,
                `把送出去的加回来：$${other} + ${change} = ${change + other}$。`,
              ],
            )
          : whole(
              [
                `${name} got ${change} more ${thing.en} and now has ${change + other}. How many ${thing.en} did ${name} have at the start?`,
                `${name} 又得到 ${change} ${thing.unit}${thing.zh}，现在有 ${change + other} ${thing.unit}。${name} 原来有多少${thing.unit}？`,
              ],
              other,
              [2 * change + other, change, change + other],
              [
                `Take away what was added: $${change + other} - ${change} = ${other}$.`,
                `减去后来得到的：$${change + other} - ${change} = ${other}$。`,
              ],
            );
      },
    ),
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
        "When a story has three groups, you add them all, but you can still only do two at a time. Write the three numbers with plus signs and add them in whichever order is easy. Check that you used each number once, since it is easy to leave one out when a story is longer than the ones you are used to.",
        "故事里有三组时，要把它们都加起来，但每次只能加两个。把三个数用加号写出来，按容易的顺序相加。检查每个数都只用了一次，因为故事比平时长的时候，很容易漏掉一个。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(2, 8);
        const b = rng.int(2, 7);
        const c = rng.int(2, Math.min(9, 20 - a - b));
        const answer = a + b + c;
        return whole(
          [
            `${name} has ${a} ${thing.en} in one box, ${b} in a second box and ${c} in a third box. How many ${thing.en} is that in all?`,
            `${name} 的第一个盒子里有 ${a} ${thing.unit}${thing.zh}，第二个盒子里有 ${b} ${thing.unit}，第三个盒子里有 ${c} ${thing.unit}。一共有多少${thing.unit}？`,
          ],
          answer,
          [a + b, b + c, a + c],
          [`All three groups add up: $${a} + ${b} + ${c} = ${answer}$.`, `三组都要相加：$${a} + ${b} + ${c} = ${answer}$。`],
        );
      },
    ),
    earlyPoint(
      "three-friends-together",
      ["Three friends together", "三个朋友合起来"],
      [
        "When three people each have some things, the total is all of their things put together. Look for two amounts that are easy to add first, perhaps two that make ten. Then add the third to the result. Say a little number sentence to yourself for each step, so that you can see which friend you have already counted.",
        "三个人各有一些东西时，总数就是他们所有的东西合在一起。先找两个容易相加的数，比如能凑成十的。再把第三个加到结果上。每一步都在心里说一个小算式，这样就知道哪个朋友已经算过了。",
      ],
      (rng) => {
        const [n1, n2, n3] = rng.sample(earlyNames, 3) as [string, string, string];
        const thing = rng.pick(earlyThings);
        const k = rng.int(2, 8);
        const c = rng.int(2, 9);
        const answer = 10 + c;
        return whole(
          [
            `${n1} has ${k} ${thing.en}, ${n2} has ${c} ${thing.en} and ${n3} has ${10 - k} ${thing.en}. How many ${thing.en} do they have together?`,
            `${n1} 有 ${k} ${thing.unit}${thing.zh}，${n2} 有 ${c} ${thing.unit}，${n3} 有 ${10 - k} ${thing.unit}。三个人一共有多少${thing.unit}？`,
          ],
          answer,
          [k + c, c + 10 - k, 10],
          [
            `Add the pair that makes ten first: $${k} + ${10 - k} = 10$. Then $10 + ${c} = ${answer}$.`,
            `先加凑成十的一对：$${k} + ${10 - k} = 10$。再算 $10 + ${c} = ${answer}$。`,
          ],
        );
      },
    ),
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
        "A round number such as 30 is 3 tens, and 40 is 4 tens. So $30 + 40$ is just 3 tens and 4 tens, which makes 7 tens, or 70. You already know $3 + 4$, so all you need is to remember that you are counting tens. Your answer should still end in a zero.",
        "30 这样的整十数是 3 个十，40 是 4 个十。所以 $30 + 40$ 就是 3 个十和 4 个十，一共 7 个十，也就是 70。$3 + 4$ 你已经会了，只要记住现在数的是十。答案的末尾还是 0。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(1, 9 - a);
        const answer = 10 * (a + b);
        return whole(
          [`What is $${a * 10} + ${b * 10}$?`, `$${a * 10} + ${b * 10}$ 等于多少？`],
          answer,
          [a + b, answer + 10, answer - 10],
          [
            `${plural(a, "ten")} and ${plural(b, "ten")} make ${a + b} tens, which is ${answer}.`,
            `${a} 个十和 ${b} 个十是 ${a + b} 个十，也就是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "adding-rods-to-rods",
      ["Adding rods to rods", "长条加长条"],
      [
        "Each rod in a picture is a ten, so you can count the rods just as you would count small squares, and then say the answer in tens. When some more rods are added, count on from the rods you have. You never need to count each single unit inside the rods, as you know that each one holds ten.",
        "图中每根长条是一个十，所以可以像数小方块一样数长条，再按十说出答案。又加上一些长条时，就从已有的长条往后数。不用数长条里的每一小格，因为你知道每根都是十。",
      ],
      (rng) => {
        const a = rng.int(1, 7);
        const b = rng.int(1, 8 - a);
        const answer = 10 * (a + b);
        return whole(
          [`Add ${b * 10} to the number these blocks show. What is the total?`, `把这些积木表示的数加上 ${b * 10}。总数是多少？`],
          answer,
          [a + b, 10 * a, answer + 10],
          [
            `The blocks show ${10 * a}, and $${10 * a} + ${b * 10} = ${answer}$.`,
            `积木表示 ${10 * a}，$${10 * a} + ${b * 10} = ${answer}$。`,
          ],
          blocksFigure(0, a, 0),
        );
      },
    ),
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
        "When you add a round number to a two-digit number, only the tens change. The ones have nothing to add to, so they stay as they are. For $34 + 20$, the 3 tens and 2 tens make 5 tens, and the 4 ones stay put, which gives 54. Blocks make this easy to see, as only the rods change.",
        "两位数加整十数，只有十位变。个位没有东西可加，所以保持不变。算 $34 + 20$ 时，3 个十和 2 个十是 5 个十，4 个一不变，得到 54。用积木很容易看出，只有长条变了。",
      ],
      (rng) => {
        const at = rng.int(1, 7);
        const single = rng.int(1, 9);
        const bt = rng.int(1, 9 - at);
        const a = 10 * at + single;
        const answer = a + 10 * bt;
        return whole(
          [`What is $${a} + ${10 * bt}$?`, `$${a} + ${10 * bt}$ 等于多少？`],
          answer,
          [a + bt, a, answer + 10],
          [
            `The tens add up to ${at + bt} tens, and the ${plural(single, "one")} stay${single === 1 ? "s" : ""} the same, which gives ${answer}.`,
            `十相加是 ${at + bt} 个十，${single} 个一不变，得到 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "adding-some-ones",
      ["Adding some ones", "加几个一"],
      [
        "Adding a small number to a two-digit number changes the ones. The tens stay the same, unless the ones go past nine. For now we will keep to sums where that does not happen. For $42 + 5$, the 2 ones and 5 ones make 7 ones, and the 4 tens are not touched, which gives 47.",
        "两位数加一个小的数，变的是个位。十位不变，除非个位超过九。现在我们先只做不超过九的。算 $42 + 5$ 时，2 个一和 5 个一是 7 个一，4 个十不动，得到 47。",
      ],
      (rng) => {
        const tens = rng.int(1, 9);
        const ao = rng.int(0, 7);
        const b = rng.int(1, 9 - ao);
        const a = 10 * tens + ao;
        const answer = a + b;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [a + 10 * b, a - b, tens + ao + b],
          [
            `The ones add up to ${ao + b}, and the ${plural(tens, "ten")} stay${tens === 1 ? "s" : ""} the same, which gives ${answer}.`,
            `个位相加是 ${ao + b}，${tens} 个十不变，得到 ${answer}。`,
          ],
          blocksFigure(0, tens, ao),
        );
      },
    ),
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
        "Ten more is one more rod. The tens digit goes up by one, and the ones digit does not change at all. So ten more than 47 is 57. You can see the pattern on a hundred chart, where ten more is the number straight below. There is no need to count on ten times, as one look at the tens will do.",
        "多 10 就是多一根长条。十位加 1，个位完全不变。所以比 47 多 10 的数是 57。在百数表上也能看出规律，多 10 的数就在正下方。不需要往后数十次，只要看一下十位就行。",
      ],
      (rng) => {
        const n = rng.int(11, 89);
        const answer = n + 10;
        return whole(
          [`What number is 10 more than ${n}?`, `比 ${n} 多 10 的数是多少？`],
          answer,
          [n + 1, n - 10, n + 100],
          [
            `The tens digit goes up by one and the ones digit stays the same, which gives ${answer}.`,
            `十位加 1，个位不变，得到 ${answer}。`,
          ],
          blocksFigure(0, Math.floor(n / 10), n % 10),
        );
      },
    ),
    earlyPoint(
      "ten-less",
      ["Ten less", "少 10"],
      [
        "Ten less is one rod fewer. The tens digit goes down by one, and the ones digit does not change. So ten less than 47 is 37. On a hundred chart, this is the number straight above. A common mix-up is to change the ones digit, which would give one less rather than ten less, a much smaller change.",
        "少 10 就是少一根长条。十位减 1，个位不变。所以比 47 少 10 的数是 37。在百数表上，就是正上方的数。常见的混淆是去改个位，那样是少 1，不是少 10，变化小得多。",
      ],
      (rng) => {
        const n = rng.int(20, 99);
        const answer = n - 10;
        return whole(
          [`What number is 10 less than ${n}?`, `比 ${n} 少 10 的数是多少？`],
          answer,
          [n - 1, n + 10, n + 1],
          [
            `The tens digit goes down by one and the ones digit stays the same, which gives ${answer}.`,
            `十位减 1，个位不变，得到 ${answer}。`,
          ],
          blocksFigure(0, Math.floor(n / 10), n % 10),
        );
      },
    ),
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
        "Just as with adding, think of each round number as a bundle of tens. So $70 - 40$ is 7 tens take away 4 tens, which leaves 3 tens, or 30. You already know the fact $7 - 4$, and all you need to do here is say the answer in tens. Your answer will end in a zero, as tens always do.",
        "和加法一样，把整十数看成一捆一捆的十。所以 $70 - 40$ 就是 7 个十减 4 个十，剩下 3 个十，也就是 30。$7 - 4$ 你已经会了，这里只要把答案说成几个十。答案末尾是 0，因为整十数都是这样。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, a - 1);
        const answer = 10 * (a - b);
        return whole(
          [`What is $${a * 10} - ${b * 10}$?`, `$${a * 10} - ${b * 10}$ 等于多少？`],
          answer,
          [a - b, 10 * (a + b), answer + 10],
          [
            `${a} tens take away ${plural(b, "ten")} leave ${plural(a - b, "ten")}, which is ${answer}.`,
            `${a} 个十减 ${b} 个十，剩下 ${a - b} 个十，也就是 ${answer}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "taking-away-rods",
      ["Taking away rods", "拿走长条"],
      [
        "Look at a picture of rods and imagine crossing some of them out. What you have left is still a number of tens, so count the rods that remain and say that many tens. Adding back the rods you took away should bring you to where you started, and this is a good way to check that your answer is right.",
        "看图中的长条，想象划掉其中几根。剩下的还是几个十，所以数一数剩下的长条，说出是几个十。把拿走的长条加回去，应该回到开始的数，这是检查答案的好办法。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, a - 1);
        const answer = 10 * (a - b);
        return whole(
          [`These blocks show a number. Take away ${b * 10}. How much is left?`, `这些积木表示一个数。减去 ${b * 10}。还剩多少？`],
          answer,
          [a - b, 10 * a, 10 * (a + b)],
          [
            `The blocks show ${10 * a}, and $${10 * a} - ${b * 10} = ${answer}$.`,
            `积木表示 ${10 * a}，$${10 * a} - ${b * 10} = ${answer}$。`,
          ],
          blocksFigure(0, a, 0),
        );
      },
    ),
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
