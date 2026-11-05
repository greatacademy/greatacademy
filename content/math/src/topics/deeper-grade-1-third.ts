// A third knowledge point for the 1st Grade Math topics that had two: the same idea
// run backwards, carried past a decade, or matched to a number sentence.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { earlyNames, earlyThings } from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { reasoned } from "../wrong-reasons.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** storyThing picks a name and a thing for a word problem. */
const storyThing = (rng: Rng) => ({ who: rng.pick(earlyNames), thing: rng.pick(earlyThings) });

/** clockHours are the hours a clock can show. */
const clockHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** deeperGrade1ThirdPoints holds the third knowledge points of 1st Grade Math, by topic. */
export const deeperGrade1ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "counting-to-120": [
    skill(
      "the-number-that-comes-before",
      ["The number that comes before", "前一个数"],
      [
        "Counting backward says the numbers in reverse order, so the number just before another is one less. At a round number the tens drop: the number before 70 is 69.",
        "倒着数就是把数的顺序反过来，所以紧挨在一个数前面的数比它少 1。遇到整十数时十位要减少：70 前面的数是 69。",
      ],
      (rng) => {
        const n = rng.bool() ? rng.int(2, 12) * 10 : rng.int(21, 120);
        return whole(
          [`What number comes right before ${n}?`, `紧挨在 ${n} 前面的数是几？`],
          n - 1,
          [n + 1, n - 10, n - 2],
          [
            `Counting back one from ${n} lands on ${n - 1}, and counting on from ${n - 1} comes straight back to ${n}.`,
            `从 ${n} 倒数一个得到 ${n - 1}，从 ${n - 1} 再数一个又回到 ${n}。`,
          ],
        );
      },
    ),
  ],
  "reading-and-writing-numbers-to-120": [
    skill(
      "numbers-past-one-hundred",
      ["Numbers past one hundred", "一百多的数"],
      [
        "A number past 100 is written with three digits: a 1 for the hundred, then the tens, then the ones. When there are no tens, a 0 holds their place, so one hundred seven is 107.",
        "超过 100 的数写成三位：百位写 1，然后是十位和个位。没有十时要用 0 占位，所以一百零七写成 107。",
      ],
      (rng) => {
        const n = rng.int(101, 120);
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
          n - 100 < 10
            ? `一百零${"一二三四五六七八九".charAt(n - 101)}`
            : n === 110
              ? "一百一十"
              : n === 120
                ? "一百二十"
                : `一百一十${"一二三四五六七八九".charAt(n - 111)}`;
        if (rng.bool())
          return whole(
            [`What number has 1 hundred and ${n - 100} more?`, `1 个百再加 ${n - 100} 是多少？`],
            n,
            [n - 100 + 1000, n + 10, n + 1],
            [
              `One hundred and ${n - 100} more is ${n}: the 1 stands for the hundred.`,
              `1 个百再加 ${n - 100} 是 ${n}：最前面的 1 表示一百。`,
            ],
          );
        return whole(
          [`Write this number with digits: one hundred ${ones[n - 100]}.`, `用数字写出这个数：${zh}。`],
          n,
          [n - 100 + 1000, n - 100 < 10 ? 100 + (n - 100) * 10 : n - 1, n + 1],
          [
            `One hundred is the 1 in front, and ${n - 100} fills the tens and ones, so the number is ${n}.`,
            `一百写在最前面的 1，后面两位写 ${n - 100}，所以这个数是 ${n}。`,
          ],
        );
      },
    ),
  ],
  "ten-and-some-ones": [
    skill(
      "teen-numbers-from-ones-and-a-ten",
      ["Teen numbers told out of order", "打乱顺序说出的十几"],
      [
        "The order of the words does not change the number. Six ones and one ten is still one ten and six ones, so the digit for the ten is written first and the number is 16.",
        "说的顺序不会改变这个数。6 个一和 1 个十仍然是 1 个十和 6 个一，要把十写在前面，所以这个数是 16。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} has ${a} loose ${thing.en} and one full box of ten ${thing.en}. How many ${thing.en} is that?`,
            `${who} 有 ${a} 个散装的${thing.zh}和满满一盒 10 个${thing.zh}。一共有多少个${thing.zh}？`,
          ],
          10 + a,
          [a, a * 10 + 1, 10 + a + 1],
          [
            `One ten and ${a} ones make ${10 + a}. The ten is written first, whichever was said first.`,
            `1 个十和 ${a} 个一合起来是 ${10 + a}。不管先说哪个，十都写在前面。`,
          ],
        );
      },
    ),
  ],
  "tens-and-ones": [
    skill(
      "more-than-nine-ones",
      ["More than nine ones", "超过九个一"],
      [
        "Ten ones can be traded for one ten. So 2 tens and 13 ones is the same as 3 tens and 3 ones, which is 33. Trade first, then read off the number.",
        "10 个一可以换成 1 个十。所以 2 个十和 13 个一等于 3 个十和 3 个一，也就是 33。先换，再读出这个数。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const ones = rng.int(10, 19);
        const n = tens * 10 + ones;
        return whole(
          [`What number is ${tens} tens and ${ones} ones?`, `${tens} 个十和 ${ones} 个一是多少？`],
          n,
          [tens * 100 + ones, tens + ones, tens * 10 + ones - 10],
          [
            `Trade 10 of the ones for a ten: that is ${tens + 1} tens and ${ones - 10} ones, which is ${n}.`,
            `把 10 个一换成 1 个十：就是 ${tens + 1} 个十和 ${ones - 10} 个一，也就是 ${n}。`,
          ],
        );
      },
    ),
  ],
  "counting-groups-of-ten": [
    skill(
      "more-bags-to-reach-a-number",
      ["More bags to reach a number", "还需要几袋"],
      [
        "Each bag holds ten, so going from one round number to another takes one bag for each ten between them. From 30 to 70 is 4 tens, so 4 more bags are needed.",
        "每袋有 10 个，所以从一个整十数到另一个整十数，相差几个十就需要几袋。从 30 到 70 相差 4 个十，所以还需要 4 袋。",
      ],
      (rng) => {
        const have = rng.int(1, 6);
        const more = rng.int(1, 12 - have);
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} has ${have * 10} ${thing.en} and wants ${(have + more) * 10}. They come in bags of 10. How many more bags does ${who} need?`,
            `${who} 有 ${have * 10} 个${thing.zh}，想要 ${(have + more) * 10} 个。${thing.zh}每袋 10 个。${who} 还需要几袋？`,
          ],
          more,
          [more * 10, have + more, more + 1],
          [
            `From ${have * 10} to ${(have + more) * 10} is ${more} tens, and each bag is one ten, so ${more} more bags.`,
            `从 ${have * 10} 到 ${(have + more) * 10} 相差 ${more} 个十，每袋是 1 个十，所以还需要 ${more} 袋。`,
          ],
        );
      },
    ),
  ],
  "comparing-two-digit-numbers": [
    skill(
      "the-number-in-the-middle",
      ["The number in the middle", "中间的数"],
      [
        "To put numbers in order, compare the tens first, and look at the ones only when the tens match. The number in the middle is greater than one of the others and less than the other.",
        "给数排序时先比十位，十位相同才看个位。中间的数比其中一个大，又比另一个小。",
      ],
      (rng) => {
        const [lo, mid, hi] = [...new Set(Array.from({ length: 9 }, () => rng.int(11, 99)))].sort((a, b) => a - b).slice(0, 3) as [
          number,
          number,
          number,
        ];
        const shown = rng.shuffle([lo, mid, hi]);
        return whole(
          [
            `Put ${shown[0]}, ${shown[1]} and ${shown[2]} in order. Which number is in the middle?`,
            `把 ${shown[0]}、${shown[1]}、${shown[2]} 排好顺序。中间的数是几？`,
          ],
          mid,
          [lo, hi, mid + 1],
          [
            `In order they are ${lo}, ${mid}, ${hi}, so ${mid} is in the middle: it is greater than ${lo} and less than ${hi}.`,
            `按顺序是 ${lo}、${mid}、${hi}，所以中间的是 ${mid}：它比 ${lo} 大，比 ${hi} 小。`,
          ],
        );
      },
    ),
  ],
  "counting-on-to-add": [
    skill(
      "how-many-were-counted-on",
      ["How many were counted on", "往后数了几个"],
      [
        "Counting on can also find a missing amount. Start at the first number and count until you reach the last one; the number of counts is how much was added.",
        "往后数也能求出缺少的数。从第一个数开始数，数到最后一个数为止，数了几下就是加了多少。",
      ],
      (rng) => {
        const a = rng.int(3, 14);
        const b = rng.int(2, 6);
        return whole(
          [
            `Start at ${a} and count on until you say ${a + b}. How many numbers did you count on?`,
            `从 ${a} 开始往后数，一直数到 ${a + b}。往后数了几个数？`,
          ],
          b,
          [a + b, b + 1, a],
          [
            `After ${a} you say ${Array.from({ length: b }, (_, i) => a + i + 1).join(", ")}: that is ${b} numbers.`,
            `${a} 后面依次数 ${Array.from({ length: b }, (_, i) => a + i + 1).join("、")}，一共 ${b} 个数。`,
          ],
        );
      },
    ),
  ],
  "counting-back-to-subtract": [
    skill(
      "where-the-count-started",
      ["Where the count started", "从哪里开始数的"],
      [
        "If counting back lands on a number, the start is found by going the other way. To undo counting back 3, count forward 3 from where you landed.",
        "如果倒着数后落在某个数上，往相反方向数就能找到起点。要还原倒数 3 个，就从落点往后数 3 个。",
      ],
      (rng) => {
        const end = rng.int(2, 14);
        const b = rng.int(2, 5);
        return whole(
          [
            `Mia counted back ${b} and landed on ${end}. Which number did Mia start from?`,
            `Mia 倒着数了 ${b} 个，落在 ${end} 上。Mia 是从几开始数的？`,
          ],
          end + b,
          [end - b, end + b + 1, end],
          [
            `Going back ${b} ended at ${end}, so counting forward ${b} from ${end} returns to the start: ${end + b}.`,
            `倒数 ${b} 个落在 ${end}，所以从 ${end} 往后数 ${b} 个就回到起点：${end + b}。`,
          ],
        );
      },
    ),
  ],
  "making-ten-to-add": [
    skill(
      "the-same-sum-as-ten-and-some",
      ["The same sum as ten and some", "改写成十加几"],
      [
        "Moving some from one addend to the other keeps the sum the same. In $8 + 5$, move 2 from the 5 to the 8: that gives $10 + 3$, which is easy to read as 13.",
        "把一个加数的一部分移给另一个加数，和不变。在 $8 + 5$ 中，把 5 里的 2 移给 8，就得到 $10 + 3$，一眼就能读出是 13。",
      ],
      (rng) => {
        const a = rng.int(6, 9);
        const b = rng.int(11 - a, 9);
        return whole(
          [`What number goes in the box? $$${a} + ${b} = 10 + \\square$$`, `方框里填几？$$${a} + ${b} = 10 + \\square$$`],
          a + b - 10,
          [a + b, 10 - a, b],
          [
            `${a} needs ${10 - a} to make ten, and that leaves ${a + b - 10} of the ${b}, so $${a} + ${b} = 10 + ${a + b - 10}$.`,
            `${a} 还差 ${10 - a} 凑成 10，${b} 拿走 ${10 - a} 后还剩 ${a + b - 10}，所以 $${a} + ${b} = 10 + ${a + b - 10}$。`,
          ],
        );
      },
    ),
  ],
  "doubles-and-near-doubles": [
    skill(
      "the-double-in-the-middle",
      ["The double in the middle", "中间的双倍"],
      [
        "When two addends differ by 2, take one from the larger and give it to the smaller. Then $6 + 8$ becomes $7 + 7$, a double with the number in the middle.",
        "两个加数相差 2 时，把大的数拿 1 给小的数。于是 $6 + 8$ 变成 $7 + 7$，这是以中间的数为加数的双倍。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const [x, y] = rng.bool() ? [a, a + 2] : [a + 2, a];
        if (rng.bool())
          return whole(
            [
              `What number goes in the box? $$${x} + ${y} = \\square + \\square$$ Both boxes hold the same number.`,
              `方框里填几？$$${x} + ${y} = \\square + \\square$$ 两个方框里的数相同。`,
            ],
            a + 1,
            [a, a + 2, 2 * a + 2],
            [
              `Move 1 from ${a + 2} to ${a}: both become ${a + 1}, and the sum stays ${2 * a + 2}.`,
              `把 ${a + 2} 中的 1 移给 ${a}：两个数都变成 ${a + 1}，和仍是 ${2 * a + 2}。`,
            ],
          );
        return whole(
          [`Think of the double in the middle. What is $${x} + ${y}$?`, `想想中间的双倍。$${x} + ${y}$ 是多少？`],
          2 * a + 2,
          [2 * a, 2 * a + 4, 2 * a + 1],
          [
            `Take 1 from the larger and give it to the smaller: $${x} + ${y} = ${a + 1} + ${a + 1}$, and that double is ${2 * a + 2}.`,
            `从大的数拿 1 给小的数：$${x} + ${y} = ${a + 1} + ${a + 1}$，这个双倍是 ${2 * a + 2}。`,
          ],
        );
      },
    ),
  ],
  "adding-in-any-order": [
    skill(
      "three-addends-in-any-order",
      ["Three addends in any order", "三个加数换顺序"],
      [
        "Three numbers can be added in any order and the sum stays the same. If both sides use the same sum, the missing number is whichever addend the other side does not show yet.",
        "三个数以任意顺序相加，和都不变。如果两边的和相同，缺的数就是另一边还没有出现的那个加数。",
      ],
      (rng) => {
        const [a, b, c] = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3) as [number, number, number];
        return whole(
          [
            `What number goes in the box? $$${a} + ${b} + ${c} = ${c} + ${a} + \\square$$`,
            `方框里填几？$$${a} + ${b} + ${c} = ${c} + ${a} + \\square$$`,
          ],
          b,
          [a, c, a + b + c],
          [
            `The right side has ${c} and ${a} already, so the addend still missing is ${b}.`,
            `右边已经有 ${c} 和 ${a}，还缺的加数是 ${b}。`,
          ],
        );
      },
    ),
  ],
  "adding-three-numbers-within-20": [
    skill(
      "the-missing-third-number",
      ["The missing third number", "缺少的第三个数"],
      [
        "If two of three addends are known, add them first. The missing addend is what is still needed to reach the total: in $4 + 3 + \\square = 12$, $4 + 3 = 7$ and 5 more reach 12.",
        "如果三个加数中有两个已知，先把它们相加。缺少的加数就是到总和还差的部分：在 $4 + 3 + \\square = 12$ 中，$4 + 3 = 7$，再加 5 就是 12。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const c = rng.int(2, 6);
        const total = a + b + c;
        return whole(
          [`What number goes in the box? $$${a} + ${b} + \\square = ${total}$$`, `方框里填几？$$${a} + ${b} + \\square = ${total}$$`],
          c,
          [a + b, total - a, c + 1],
          [`$${a} + ${b} = ${a + b}$, and ${c} more makes ${total}.`, `$${a} + ${b} = ${a + b}$，再加 ${c} 就是 ${total}。`],
        );
      },
    ),
  ],
  "subtracting-through-ten": [
    skill(
      "counting-up-to-subtract",
      ["Counting up to subtract", "往上数做减法"],
      [
        "A subtraction can be done by counting up. For $13 - 8$, go from 8 up to 10, which is 2, and from 10 up to 13, which is 3. Together that is 5, the difference.",
        "减法可以用往上数来做。算 $13 - 8$ 时，从 8 到 10 是 2，从 10 到 13 是 3。合起来是 5，就是差。",
      ],
      (rng) => {
        const b = rng.int(6, 9);
        const a = rng.int(11, 10 + b - 1);
        return whole(
          [
            `Count up from ${b} through 10 to ${a}. How far is it from ${b} to ${a}?`,
            `从 ${b} 经过 10 往上数到 ${a}。从 ${b} 到 ${a} 相差多少？`,
          ],
          a - b,
          [10 - b, a - 10, a + b],
          [
            `From ${b} to 10 is ${10 - b} and from 10 to ${a} is ${a - 10}. Together that is ${a - b}, so $${a} - ${b} = ${a - b}$.`,
            `从 ${b} 到 10 是 ${10 - b}，从 10 到 ${a} 是 ${a - 10}。合起来是 ${a - b}，所以 $${a} - ${b} = ${a - b}$。`,
          ],
        );
      },
    ),
  ],
  "related-addition-and-subtraction-facts": [
    skill(
      "completing-a-fact-family",
      ["Completing a fact family", "补全算式家族"],
      [
        "A fact family uses the same three numbers. The largest is the whole and the other two are its parts, so taking one part away from the whole leaves the other part.",
        "一个算式家族用同样的三个数。最大的数是整体，另外两个是部分，所以从整体中去掉一个部分，剩下的就是另一个部分。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        return whole(
          [
            `These facts are in one family: $${a} + ${b} = ${a + b}$ and $${a + b} - \\square = ${a}$. What number goes in the box?`,
            `这些算式属于同一个家族：$${a} + ${b} = ${a + b}$ 和 $${a + b} - \\square = ${a}$。方框里填几？`,
          ],
          b,
          [a, a + b, b + 1],
          [
            `${a + b} is the whole, with parts ${a} and ${b}. Taking ${b} away leaves ${a}.`,
            `${a + b} 是整体，两个部分是 ${a} 和 ${b}。去掉 ${b} 剩下 ${a}。`,
          ],
        );
      },
    ),
  ],
  "missing-addends-within-20": [
    skill(
      "the-box-at-the-start-of-a-subtraction",
      ["The box at the start of a subtraction", "减法开头的方框"],
      [
        "In $\\square - 4 = 9$ the box is the whole: taking 4 away left 9. Putting the parts back together gives the whole, so add: $9 + 4 = 13$.",
        "在 $\\square - 4 = 9$ 中，方框是整体：去掉 4 后剩下 9。把两部分合起来就是整体，所以用加法：$9 + 4 = 13$。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const c = rng.int(2, 10);
        return whole(
          [`What number goes in the box? $$\\square - ${b} = ${c}$$`, `方框里填几？$$\\square - ${b} = ${c}$$`],
          b + c,
          [Math.abs(c - b), c, b + c + 1],
          [
            `The box is the whole, and ${b} and ${c} are its parts, so it is $${b} + ${c} = ${b + c}$. Check: $${b + c} - ${b} = ${c}$.`,
            `方框是整体，${b} 和 ${c} 是它的两部分，所以是 $${b} + ${c} = ${b + c}$。验算：$${b + c} - ${b} = ${c}$。`,
          ],
        );
      },
    ),
  ],
  "the-equal-sign": [
    skill(
      "subtraction-on-one-side",
      ["Subtraction on one side", "一边是减法"],
      [
        "The equal sign says both sides have the same value, whichever side the working is on. Find the value of the complete side first, then make the other side match it.",
        "等号表示两边的值相同，不管算式写在哪一边。先算出完整那一边的值，再让另一边与它相等。",
      ],
      (rng) => {
        const a = rng.int(9, 18);
        const b = rng.int(2, 7);
        const c = rng.int(1, a - b - 1);
        return whole(
          [`What number goes in the box? $$${a} - ${b} = \\square + ${c}$$`, `方框里填几？$$${a} - ${b} = \\square + ${c}$$`],
          a - b - c,
          [a - b, a - b + c, a - b - c + 1],
          [
            `The left side is ${a - b}. To make the right side ${a - b} too, the box must be ${a - b - c}, since $${a - b - c} + ${c} = ${a - b}$.`,
            `左边等于 ${a - b}。要让右边也等于 ${a - b}，方框应填 ${a - b - c}，因为 $${a - b - c} + ${c} = ${a - b}$。`,
          ],
        );
      },
    ),
  ],
  "adding-to-word-problems": [
    skill(
      "the-sentence-that-tells-the-story",
      ["The sentence that tells the story", "与故事相符的算式"],
      [
        "A story that says more came or two groups joined is told by an addition, with the two amounts from the story as addends and the unknown total after the equal sign.",
        "说“又来了一些”或两组合在一起的故事，都用加法表示：故事中的两个数是加数，等号后面是未知的总数。",
      ],
      (rng) => {
        const a = rng.int(4, 12);
        const b = rng.int(2, 8);
        const { who, thing } = storyThing(rng);
        return reasoned(
          chooseMath(
            rng,
            [
              `${who} has ${a} ${thing.en} and gets ${b} more. Which number sentence tells this story?`,
              `${who} 有 ${a} 个${thing.zh}，又得到 ${b} 个。哪个算式与这个故事相符？`,
            ],
            `${a} + ${b} = \\square`,
            [`${a} - ${b} = \\square`, `${a} + \\square = ${b}`, `\\square - ${b} = ${a}`],
            [
              `Getting more joins ${b} to the ${a} already there, so the total is $${a} + ${b}$.`,
              `又得到一些，就是把 ${b} 和原有的 ${a} 合起来，所以总数是 $${a} + ${b}$。`,
            ],
          ),
          [
            [`$${a} - ${b} = \\square$`, "This takes away, but the story gets more.", "这是减，但故事里是又得到了一些。"],
            [
              `$${a} + \\square = ${b}$`,
              `This makes $${b}$ the total, but $${b}$ is how many more were added.`,
              `这把 $${b}$ 当成了总数，但 $${b}$ 是又得到的数量。`,
            ],
            [
              `$\\square - ${b} = ${a}$`,
              "This starts from the total and takes away, but the story starts with what is there and adds.",
              "这是从总数开始减，但故事是从原有的数量开始加。",
            ],
          ],
        );
      },
    ),
  ],
  "taking-away-word-problems": [
    skill(
      "the-sentence-for-taking-away",
      ["The sentence for taking away", "表示拿走的算式"],
      [
        "A story that starts with a whole and takes some away is told by a subtraction. The whole comes first, then the part taken, and what is left comes after the equal sign.",
        "从整体中拿走一部分的故事用减法表示。先写整体，再写拿走的部分，等号后面是剩下的数。",
      ],
      (rng) => {
        const a = rng.int(9, 20);
        const b = rng.int(2, a - 2);
        const { who, thing } = storyThing(rng);
        return chooseMath(
          rng,
          [
            `${who} has ${a} ${thing.en} and gives away ${b}. Which number sentence tells this story?`,
            `${who} 有 ${a} 个${thing.zh}，送出 ${b} 个。哪个算式与这个故事相符？`,
          ],
          `${a} - ${b} = \\square`,
          [`${a} + ${b} = \\square`, `${b} - ${a} = \\square`, `\\square + ${a} = ${b}`],
          [
            `${who} starts with the whole, ${a}, and ${b} leave, so what remains is $${a} - ${b}$.`,
            `${who} 先有全部 ${a} 个，送出 ${b} 个，所以剩下的是 $${a} - ${b}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-word-problems-within-20": [
    skill(
      "how-many-more-to-have-the-same",
      ["How many more to have the same", "再要多少才一样多"],
      [
        "To have as many as someone else, a person needs exactly the difference between the two amounts. Finding how many more to match is the same subtraction as finding how many more one has.",
        "要和别人一样多，需要的正好是两人数量的差。求“再要多少才一样多”和求“多多少”是同一个减法。",
      ],
      (rng) => {
        const a = rng.int(3, 12);
        const b = a + rng.int(2, 8);
        const [p, q] = rng.shuffle(earlyNames).slice(0, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${p} has ${a} ${thing.en} and ${q} has ${b}. How many more ${thing.en} does ${p} need to have as many as ${q}?`,
            `${p} 有 ${a} 个${thing.zh}，${q} 有 ${b} 个。${p} 还需要多少个${thing.zh}才能和 ${q} 一样多？`,
          ],
          b - a,
          [a + b, b, b - a + 1],
          [`${p} has to go from ${a} up to ${b}, and $${b} - ${a} = ${b - a}$.`, `${p} 要从 ${a} 增加到 ${b}，$${b} - ${a} = ${b - a}$。`],
        );
      },
    ),
  ],
  "word-problems-with-a-missing-part": [
    skill(
      "how-many-went-away",
      ["How many went away", "去掉了多少"],
      [
        "When the start and what is left are both known, the amount that went away is the difference. Subtract what is left from the start, or count up from what is left to the start.",
        "如果知道开始的数和剩下的数，去掉的就是两者的差。用开始的数减去剩下的数，或者从剩下的数往上数到开始的数。",
      ],
      (rng) => {
        const a = rng.int(9, 20);
        const left = rng.int(2, a - 2);
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} had ${a} ${thing.en} and gave some away. Now ${who} has ${left} left. How many did ${who} give away?`,
            `${who} 原来有 ${a} 个${thing.zh}，送出了一些，现在还剩 ${left} 个。${who} 送出了多少个？`,
          ],
          a - left,
          [a + left, left, a - left + 1],
          [
            `From ${left} left back up to the ${a} at the start is ${a - left}, so ${a - left} were given away.`,
            `从剩下的 ${left} 个到开始的 ${a} 个相差 ${a - left}，所以送出了 ${a - left} 个。`,
          ],
        );
      },
    ),
  ],
  "three-addend-word-problems": [
    skill(
      "the-third-amount-in-a-story",
      ["The third amount in a story", "故事中的第三个数"],
      [
        "If a total and two of three amounts are given, add the two known amounts and subtract from the total. What remains is the third amount.",
        "如果知道总数和三个数中的两个，就把已知的两个数相加，再从总数中减去。剩下的就是第三个数。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const c = rng.int(2, 6);
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} has ${a + b + c} ${thing.en} in three boxes. One box holds ${a} and another holds ${b}. How many are in the third box?`,
            `${who} 的三个盒子里一共有 ${a + b + c} 个${thing.zh}。一个盒子有 ${a} 个，另一个有 ${b} 个。第三个盒子里有多少个？`,
          ],
          c,
          [a + b, a + b + c, c + 1],
          [
            `The two boxes hold $${a} + ${b} = ${a + b}$, and $${a + b + c} - ${a + b} = ${c}$ remain for the third.`,
            `这两个盒子共有 $${a} + ${b} = ${a + b}$ 个，$${a + b + c} - ${a + b} = ${c}$，第三个盒子里有 ${c} 个。`,
          ],
        );
      },
    ),
  ],
  "adding-multiples-of-ten": [
    skill(
      "the-missing-round-number",
      ["The missing round number", "缺少的整十数"],
      [
        "Round numbers add just as ones do, only in tens. Since $3 + 4 = 7$, we know $30 + 40 = 70$, so the box in $30 + \\square = 70$ holds 40.",
        "整十数相加和个位数相加一样，只是单位是十。因为 $3 + 4 = 7$，所以 $30 + 40 = 70$，因此 $30 + \\square = 70$ 的方框里填 40。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(1, 9 - a);
        return whole(
          [
            `What number goes in the box? $$${a * 10} + \\square = ${(a + b) * 10}$$`,
            `方框里填几？$$${a * 10} + \\square = ${(a + b) * 10}$$`,
          ],
          b * 10,
          [b, (a + b) * 10, (b + 1) * 10],
          [
            `${(a + b) * 10} is ${a + b} tens and ${a * 10} is ${a} tens, so ${b} tens are missing, which is ${b * 10}.`,
            `${(a + b) * 10} 是 ${a + b} 个十，${a * 10} 是 ${a} 个十，所以还差 ${b} 个十，也就是 ${b * 10}。`,
          ],
        );
      },
    ),
  ],
  "adding-tens-to-two-digit-numbers": [
    skill(
      "adding-tens-and-then-ones",
      ["Adding tens and then ones", "先加整十再加一"],
      [
        "Tens change only the tens digit and ones change only the ones digit, as long as the ones do not pass nine. So the tens and the ones can be added one after the other.",
        "只要个位不超过 9，加整十只改变十位，加一只改变个位。所以可以先后分别加上十和一。",
      ],
      (rng) => {
        const tens = rng.int(1, 5);
        const ones = rng.int(1, 5);
        const addTens = rng.int(1, 4) * 10;
        const addOnes = rng.int(1, 9 - ones);
        const n = tens * 10 + ones;
        return whole(
          [`What is $${n} + ${addTens} + ${addOnes}$?`, `$${n} + ${addTens} + ${addOnes}$ 是多少？`],
          n + addTens + addOnes,
          [n + addTens, n + addOnes, n + addTens + addOnes + 10],
          [
            `First $${n} + ${addTens} = ${n + addTens}$, which changes the tens. Then adding ${addOnes} changes the ones and gives ${n + addTens + addOnes}.`,
            `先算 $${n} + ${addTens} = ${n + addTens}$，十位改变。再加 ${addOnes}，个位改变，得到 ${n + addTens + addOnes}。`,
          ],
        );
      },
    ),
  ],
  "ten-more-and-ten-less": [
    skill(
      "the-number-from-ten-more",
      ["The number from ten more", "由多十求原数"],
      [
        "If 10 more than a number is known, the number itself is 10 less than that. Only the tens digit changes, going down by one, and the ones stay the same.",
        "如果知道比一个数多 10 的数，那么原数就比它少 10。只有十位减少 1，个位不变。",
      ],
      (rng) => {
        const n = rng.int(11, 89);
        const up = rng.bool();
        const seen = up ? n + 10 : n - 10;
        return whole(
          up
            ? [`10 more than a number is ${seen}. What is the number?`, `比一个数多 10 的数是 ${seen}。这个数是几？`]
            : [`10 less than a number is ${seen}. What is the number?`, `比一个数少 10 的数是 ${seen}。这个数是几？`],
          n,
          [up ? seen + 10 : seen - 10, seen, n + 1],
          up
            ? [
                `${seen} is 10 more than the number, so the number is 10 less than ${seen}: ${n}.`,
                `${seen} 比这个数多 10，所以这个数比 ${seen} 少 10：${n}。`,
              ]
            : [
                `${seen} is 10 less than the number, so the number is 10 more than ${seen}: ${n}.`,
                `${seen} 比这个数少 10，所以这个数比 ${seen} 多 10：${n}。`,
              ],
        );
      },
    ),
  ],
  "subtracting-multiples-of-ten": [
    skill(
      "how-many-tens-were-taken",
      ["How many tens were taken", "减去了几个十"],
      [
        "Round numbers subtract as ones do, only in tens. Since $8 - 3 = 5$, we know $80 - 30 = 50$, so the box in $80 - \\square = 50$ holds 30.",
        "整十数相减和个位数相减一样，只是单位是十。因为 $8 - 3 = 5$，所以 $80 - 30 = 50$，因此 $80 - \\square = 50$ 的方框里填 30。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(1, a - 1);
        return whole(
          [
            `What number goes in the box? $$${a * 10} - \\square = ${(a - b) * 10}$$`,
            `方框里填几？$$${a * 10} - \\square = ${(a - b) * 10}$$`,
          ],
          b * 10,
          [b, (a - b) * 10 + 10, (a + a - b) * 10],
          [
            `${a} tens went down to ${a - b} tens, so ${b} tens were taken: ${b * 10}.`,
            `${a} 个十变成 ${a - b} 个十，所以减去了 ${b} 个十：${b * 10}。`,
          ],
        );
      },
    ),
  ],
  "comparing-lengths-directly": [
    skill(
      "shortest-to-longest",
      ["From shortest to longest", "从最短到最长"],
      [
        "Two comparisons can put three things in order. If A is longer than B and B is longer than C, then C is the shortest and A is the longest, with B in between.",
        "两次比较就能把三样东西排好顺序。如果 A 比 B 长，B 比 C 长，那么 C 最短，A 最长，B 在中间。",
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
        return choose(
          rng,
          [
            `The ${a[0]} is longer than the ${b[0]}. The ${b[0]} is longer than the ${c[0]}. Which list goes from shortest to longest?`,
            `${a[1]}比${b[1]}长，${b[1]}比${c[1]}长。哪个顺序是从最短到最长？`,
          ],
          [`${c[0]}, ${b[0]}, ${a[0]}`, `${c[1]}、${b[1]}、${a[1]}`],
          [
            [`${a[0]}, ${b[0]}, ${c[0]}`, `${a[1]}、${b[1]}、${c[1]}`],
            [`${b[0]}, ${c[0]}, ${a[0]}`, `${b[1]}、${c[1]}、${a[1]}`],
            [`${c[0]}, ${a[0]}, ${b[0]}`, `${c[1]}、${a[1]}、${b[1]}`],
          ],
          [
            `The ${c[0]} is shorter than the ${b[0]}, and the ${b[0]} is shorter than the ${a[0]}.`,
            `${c[1]}比${b[1]}短，${b[1]}比${a[1]}短。`,
          ],
        );
      },
    ),
  ],
  "measuring-with-non-standard-units": [
    skill(
      "smaller-units-take-more",
      ["Smaller units take more", "单位越小，数量越多"],
      [
        "The same length can be measured with different units. A small unit fits more times than a large one, so the smaller the unit, the bigger the count.",
        "同一个长度可以用不同的单位来量。小单位比大单位能放下更多次，所以单位越小，数出的数越大。",
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
        const [small, large] = [units[i]!, units[j]!];
        return choose(
          rng,
          [
            `Leo measures a ${object[0]} with ${small[0]} and again with ${large[0]}. ${large[0][0]!.toUpperCase()}${large[0].slice(1)} are longer. Which count is bigger?`,
            `Leo 用${small[1]}量${object[1]}，又用${large[1]}量了一次。${large[1]}更长。哪次数出的数更大？`,
          ],
          [`the count of ${small[0]}`, `${small[1]}的数量`],
          [
            [`the count of ${large[0]}`, `${large[1]}的数量`],
            ["both counts are the same", "两次数量相同"],
            [`the ${object[0]} decides, not the unit`, `由${object[1]}决定，与单位无关`],
          ],
          [
            `Each of the ${small[0]} covers less of the ${object[0]}, so more of them are needed.`,
            `每个${small[1]}盖住的长度更短，所以需要更多个。`,
          ],
        );
      },
    ),
  ],
  "telling-time-to-the-hour": [
    skill(
      "hours-later-and-earlier",
      ["Hours later and earlier", "几小时之后和之前"],
      [
        "Each hour moves the short hand to the next number. Count forward for later and back for earlier, remembering that after 12 the clock starts again at 1.",
        "每过一小时，短针走到下一个数。之后就往前数，之前就往回数，要记住 12 之后又从 1 开始。",
      ],
      (rng) => {
        const h = rng.pick(clockHours);
        const d = rng.int(1, 4);
        const later = rng.bool();
        const ans = ((h - 1 + (later ? d : -d) + 12) % 12) + 1;
        const other = ((h - 1 + (later ? -d : d) + 12) % 12) + 1;
        return whole(
          later
            ? [`It is ${h} o'clock. What hour will it be in ${d} hour${d > 1 ? "s" : ""}?`, `现在是 ${h} 点。${d} 小时后是几点？`]
            : [`It is ${h} o'clock. What hour was it ${d} hour${d > 1 ? "s" : ""} ago?`, `现在是 ${h} 点。${d} 小时前是几点？`],
          ans,
          [other, h, ans === 12 ? 1 : ans + 1],
          [
            `Counting ${d} hour${d > 1 ? "s" : ""} ${later ? "forward" : "back"} from ${h} around the clock lands on ${ans}.`,
            `从 ${h} 沿钟面${later ? "往前" : "往回"}数 ${d} 小时，落在 ${ans}。`,
          ],
        );
      },
    ),
  ],
  "telling-time-to-the-half-hour": [
    skill(
      "half-an-hour-later",
      ["Half an hour later", "半小时之后"],
      [
        "Half an hour after an o'clock time is half past that hour. Half an hour after half past is the next o'clock, because the two half hours make a full hour.",
        "整点过半小时是这个小时的半点。半点再过半小时就是下一个整点，因为两个半小时合起来是一小时。",
      ],
      (rng) => {
        const h = rng.int(2, 10);
        const fromHalf = rng.bool();
        const later = rng.bool();
        const word = (x: number, half: boolean): Pair => (half ? [`half past ${x}`, `${x} 点半`] : [`${x} o'clock`, `${x} 点`]);
        const start = word(h, fromHalf);
        const answer = later ? (fromHalf ? word(h + 1, false) : word(h, true)) : fromHalf ? word(h, false) : word(h - 1, true);
        const wrong = [
          word(h + 1, !fromHalf),
          word(h - 1, fromHalf),
          word(h + 1, true),
          word(h, false),
          word(h + 1, false),
          word(h, true),
        ].filter((w) => w[0] !== answer[0] && w[0] !== start[0]);
        return choose(
          rng,
          later
            ? [`It is ${start[0]}. What time is it half an hour later?`, `现在是 ${start[1]}。半小时后是几点？`]
            : [`It is ${start[0]}. What time was it half an hour ago?`, `现在是 ${start[1]}。半小时前是几点？`],
          answer,
          wrong,
          [
            `A half hour moves the long hand halfway around the clock, so ${start[0]} goes ${later ? "forward" : "back"} to ${answer[0]}.`,
            `半小时让长针走半圈，所以 ${start[1]}${later ? "往后" : "往前"}是 ${answer[1]}。`,
          ],
        );
      },
    ),
  ],
  "tally-charts": [
    skill(
      "counting-bundles-of-tallies",
      ["Counting bundles of tallies", "数成捆的计数符号"],
      [
        "Tally marks are bundled in fives: four strokes and a line across them. To read a long tally, count the bundles by fives and then count on the single strokes.",
        "计数符号五个一捆：四竖加一条斜线。读较长的计数时，先五个五个地数成捆的符号，再接着数单独的竖线。",
      ],
      (rng) => {
        const bundles = rng.int(2, 9);
        const single = rng.int(1, 4);
        const n = bundles * 5 + single;
        return whole(
          [
            `A tally chart shows ${bundles} full bundles of five and ${single} more stroke${single > 1 ? "s" : ""}. What number is that?`,
            `一个计数表上有 ${bundles} 捆（每捆 5 个）和另外 ${single} 条竖线。这是多少？`,
          ],
          n,
          [bundles + single, bundles * 10 + single, bundles * 5],
          [
            `Counting by fives over ${bundles} bundles reaches ${bundles * 5}, and ${single} more makes ${n}.`,
            `${bundles} 捆五个五个地数到 ${bundles * 5}，再加 ${single} 就是 ${n}。`,
          ],
        );
      },
    ),
  ],
  "first-picture-graphs": [
    {
      ...skill(
        "votes-in-all-on-a-picture-graph",
        ["Votes in all on a picture graph", "图画统计图上的总票数"],
        [
          "Each dot on a picture graph stands for one vote, so the number of votes in all is the sum over every row. Add the rows one at a time and leave none out.",
          "图画统计图上的每个点代表一票，所以总票数是所有行的和。一行一行地相加，不要漏掉任何一行。",
        ],
        (rng) => {
          const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
          return whole(
            [
              `On a picture graph the cats row has ${a} dots, the dogs row has ${b} and the fish row has ${c}. Each dot is one vote. How many votes are there in all?`,
              `一张图画统计图上，猫这一行有 ${a} 个点，狗这一行有 ${b} 个点，鱼这一行有 ${c} 个点。每个点代表一票。一共有多少票？`,
            ],
            a + b + c,
            [a + b, Math.max(a, b, c), a + b + c + 1],
            [`Add all three rows: $${a} + ${b} + ${c} = ${a + b + c}$.`, `把三行相加：$${a} + ${b} + ${c} = ${a + b + c}$。`],
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
          "The top of a bar shows its value, so the difference between two bars is how far apart their tops are. Read both values and subtract the smaller from the larger.",
          "条形的顶端表示它的数值，所以两个条形的差就是它们顶端相隔的距离。读出两个数，用大数减小数。",
        ],
        (rng) => {
          const a = rng.int(2, 8);
          const b = a + rng.int(1, 9);
          const [p, q] = rng.shuffle(["A", "B", "C", "D", "E", "F"]).slice(0, 2) as [string, string];
          return whole(
            [
              `On a bar graph, the bar for class ${p} stops at ${b} and the bar for class ${q} stops at ${a}. How many more cans did class ${p} collect than class ${q}?`,
              `在一张条形统计图上，${p} 班的条形到 ${b}，${q} 班的条形到 ${a}。${p} 班比 ${q} 班多收集了多少个罐子？`,
            ],
            b - a,
            [a + b, b, b - a + 1],
            [
              `Read the tops, ${b} and ${a}, and subtract: $${b} - ${a} = ${b - a}$.`,
              `读出顶端的数 ${b} 和 ${a}，相减：$${b} - ${a} = ${b - a}$。`,
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
        "A shape's name comes from its sides and corners. Coloring it, turning it or making it bigger leaves those alone, so it stays the same shape; cutting off a corner adds a side and changes it.",
        "形状的名称由边和角决定。涂色、转动或放大都不改变边和角，所以还是原来的形状；切掉一个角会多出一条边，形状就变了。",
      ],
      (rng) => {
        const shapes: readonly Pair[] = [
          ["triangle", "三角形"],
          ["square", "正方形"],
          ["rectangle", "长方形"],
          ["pentagon", "五边形"],
          ["hexagon", "六边形"],
        ];
        const colors: readonly Pair[] = [
          ["red", "红色"],
          ["blue", "蓝色"],
          ["green", "绿色"],
          ["yellow", "黄色"],
          ["purple", "紫色"],
          ["orange", "橙色"],
        ];
        const shape = rng.pick(shapes);
        const color = rng.pick(colors);
        return choose(
          rng,
          [
            `Grace has a ${color[0]} ${shape[0]}. Which change makes it a different shape?`,
            `Grace 有一个${color[1]}的${shape[1]}。哪种变化会使它变成另一种形状？`,
          ],
          ["cutting off one corner", "切掉一个角"],
          [
            ["painting it another color", "涂成另一种颜色"],
            ["turning it upside down", "把它倒过来"],
            ["drawing it twice as big", "画成两倍大"],
          ],
          [
            `Cutting off a corner adds a side, so it is no longer a ${shape[0]}. The other changes keep the same sides and corners.`,
            `切掉一个角会多出一条边，所以它不再是${shape[1]}。其他变化都不改变边和角的数量。`,
          ],
        );
      },
    ),
  ],
  "composing-shapes": [
    {
      ...skill(
        "how-many-pieces-for-several-shapes",
        ["How many pieces for several shapes", "拼几个图形要多少块"],
        [
          "If one larger shape takes a set number of pieces, several of them take that number of pieces again and again. Two triangles make one square, so three squares take six triangles.",
          "如果拼一个大图形需要固定数量的小块，拼几个就重复几次。两个三角形拼成一个正方形，所以三个正方形需要六个三角形。",
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
          return whole(
            [
              `Each of the ${big[0]} takes 2 ${piece[0]}. How many ${piece[0]} do ${k} ${big[0]} take?`,
              `2 个${piece[1]}能拼成 1 个${big[1]}。拼 ${k} 个${big[1]}需要多少个${piece[1]}？`,
            ],
            2 * k,
            [k, k + 2, 2 * k + 1],
            [
              `Each of the ${k} needs 2 pieces, and counting by 2s ${k} times reaches ${2 * k}.`,
              `${k} 个中每个都需要 2 块，两个两个地数 ${k} 次，得到 ${2 * k}。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["composing-shapes#how-many-pieces-for-several-shapes"],
    },
  ],
};
