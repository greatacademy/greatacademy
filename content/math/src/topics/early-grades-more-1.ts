// Added topics of 1st Grade Math: ways to make a number, trading tens, the hundred
// chart, strategies and fact triangles, equations with the unknown anywhere, bar
// models, adding two-digit numbers, careful measuring, digital clocks, coins,
// sorting data and solid shapes.

import type { CourseDef, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import {
  barGraphFigure,
  clockFigure,
  coinsFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  numberLineFigure,
  pictureGraphFigure,
  tallyFigure,
  tenFramesFigure,
} from "../early-grades-kit.ts";
import {
  type BarMeasure,
  blockRowsFigure,
  chartPieceFigure,
  choose,
  chooseMath,
  compareBarsFigure,
  digitalClockFigure,
  factTriangleFigure,
  hopsFigure,
  type MixedShape,
  many,
  measuredBarsFigure,
  mixedShapesFigure,
  numberBondFigure,
  type Pair,
  partWholeBarFigure,
  type SolidKind,
  solidFigure,
  solidName,
  solidsRowFigure,
  tableFigure,
  whole,
} from "./early-grades-more-kit.ts";
import { compareProblem } from "./grade-4-fractions.ts";

/** rel is the index of the symbol that relates a to b. */
const rel = (a: number, b: number) => (a < b ? 0 : a === b ? 1 : 2);

/** clockHour keeps an hour on the clock face. */
const clockHour = (hour: number) => ((hour - 1 + 12) % 12) + 1;

/** clockText writes a time as on a digital clock. */
const clockText = (hour: number, minute: number) => `${hour}:${String(minute).padStart(2, "0")}`;

const waysToMakeANumber = earlyTopic(
  "ways-to-make-a-number",
  ["Ways to Make a Number", "数的分与合"],
  ["Split a number into two parts in different ways, and find a missing part.", "把一个数分成两部分，有不同的分法，并求出缺少的部分。"],
  ["counting-on-to-add"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "the-missing-part-of-a-bond",
      ["The missing part of a number bond", "分与合图中缺少的部分"],
      [
        "A number bond shows a whole on top and its two parts below. The two parts put together always make the whole. If one part is missing, ask yourself how many more the part you know needs to reach the whole. You can count on from that part, or use a fact you already remember.",
        "分与合图上面是整体，下面是它的两部分。两部分合起来总是等于整体。如果缺了一部分，就想一想：已知的部分还要多少才能到整体？可以从已知的部分往后数，也可以用你记得的算式。",
      ],
      (rng) => {
        const all = rng.int(6, 18);
        const known = rng.int(1, all - 1);
        const answer = all - known;
        const left = rng.bool();
        return whole(
          ["What number goes in the circle with the question mark?", "问号所在的圆里应该填几？"],
          answer,
          [all + known, all, known],
          [
            `The parts must make ${all}, and $${known} + ${answer} = ${all}$, so the missing part is ${answer}.`,
            `两部分要合成 ${all}，$${known} + ${answer} = ${all}$，所以缺少的部分是 ${answer}。`,
          ],
          numberBondFigure(all, left ? null : known, left ? known : null),
        );
      },
    ),
    earlyPoint(
      "pairs-that-make-a-number",
      ["Pairs that make a number", "能合成一个数的两个数"],
      [
        "Most numbers can be split in many ways. For example, 8 can be 7 and 1, or 6 and 2, or 5 and 3, or 4 and 4. When you check a pair, add the two numbers and see whether you land exactly on the number you want. Being off by just one means the pair does not work.",
        "大多数数都有好几种分法。比如 8 可以分成 7 和 1、6 和 2、5 和 3、4 和 4。检查一对数时，把它们加起来，看是不是正好得到要的数。差 1 也不行。",
      ],
      (rng) => {
        const all = rng.int(7, 16);
        const a = rng.int(2, all - 2);
        const b = all - a;
        const wrongs = rng.shuffle([
          `${a + 1} + ${b + 1}`,
          `${a} + ${b + 1}`,
          `${a + 1} + ${b + 2}`,
          `${Math.max(a - 2, 1)} + ${Math.max(b - 1, 1)}`,
          `${a + 2} + ${b}`,
        ]);
        return chooseMath(rng, [`Which pair makes ${all}?`, `哪一对数合起来是 ${all}？`], `${a} + ${b}`, wrongs, [
          `$${a} + ${b} = ${all}$. Each of the other pairs makes a different number.`,
          `$${a} + ${b} = ${all}$。其他几对合起来都不是 ${all}。`,
        ]);
      },
    ),
    earlyPoint(
      "filling-frames-to-make-a-number",
      ["Filling frames to make a number", "把十格框填到要的数"],
      [
        "A ten-frame helps you see how far a number is from the one you want. Count the counters already there, and then think about how many more you must put in. A full frame is ten, so going past ten means starting a second frame. The number you add is the missing part.",
        "十格框能帮你看出一个数离要的数还差多少。先数框里已有的圆片，再想还要放几个。一个满框是十，超过十就要用第二个框。要放进去的个数，就是缺少的部分。",
      ],
      (rng) => {
        const target = rng.int(7, 19);
        const have = rng.int(3, target - 2);
        const answer = target - have;
        return whole(
          [`How many more counters are needed to make ${target}?`, `还要放多少个圆片才能得到 ${target}？`],
          answer,
          [target, have, target + have],
          [
            `There are ${have} counters, and $${have} + ${answer} = ${target}$, so ${answer} more are needed.`,
            `已有 ${have} 个圆片，$${have} + ${answer} = ${target}$，所以还要放 ${answer} 个。`,
          ],
          tenFramesFigure(have),
        );
      },
    ),
  ],
);

const tenOnesMakeATen = earlyTopic(
  "ten-ones-make-a-ten",
  ["Ten Ones Make a Ten", "十个一是一个十"],
  [
    "Trade ten ones for one ten, and write a number with extra ones in its usual form.",
    "用十个一换一个十，把一超过十个的写法改写成平常的数。",
  ],
  ["tens-and-ones"],
  ["1.NBT.B.2.A"],
  [
    earlyPoint(
      "counting-blocks-with-extra-ones",
      ["Counting blocks with extra ones", "数小方块很多的积木"],
      [
        "Sometimes there are ten or more small squares beside the rods. Do not write the two counts next to each other, because that gives a number that is far too big. Count the rods by tens, and then keep counting on through the squares. Any ten squares could be swapped for one more rod.",
        "有时长条旁边有十个或更多的小方块。不要把两个数并排写下来，那样得到的数就太大了。先按十数长条，再接着一个一个地数小方块。任意十个小方块都可以换成一根长条。",
      ],
      (rng) => {
        const tens = rng.int(1, 6);
        const ones = rng.int(11, 18);
        const answer = 10 * tens + ones;
        return whole(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          answer,
          [Number(`${tens}${ones}`), tens + ones, 10 * tens + ones - 10],
          [
            `${many(tens, "ten")} make ${10 * tens}, and ${ones} more ones make ${answer}.`,
            `${tens} 个十是 ${10 * tens}，再加 ${ones} 个一，就是 ${answer}。`,
          ],
          blockRowsFigure([[0, tens, ones]]),
        );
      },
    ),
    earlyPoint(
      "trading-ones-for-a-ten",
      ["Trading ones for a ten", "用一换十"],
      [
        "Ten ones and one ten are worth the same. So if you have 3 tens and 14 ones, you can bundle ten of the ones into a new ten. That leaves 4 tens and 4 ones, which you can write as 44. The amount stays the same; it is only packed in a tidier way.",
        "十个一和一个十一样多。所以如果有 3 个十和 14 个一，就可以把其中十个一捆成一个新的十，得到 4 个十和 4 个一，写作 44。总数没有变，只是整理得更整齐了。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const ones = rng.int(10, 19);
        const newTens = tens + 1;
        const left = ones - 10;
        const say = (a: number, b: number): Pair => [`${many(a, "ten")} and ${many(b, "one")}`, `${a} 个十和 ${b} 个一`];
        return choose(
          rng,
          [`Which is the same as ${many(tens, "ten")} and ${many(ones, "one")}?`, `哪一个和 ${tens} 个十 ${ones} 个一一样多？`],
          say(newTens, left),
          [say(tens, left), say(newTens, ones), say(tens + 2, left), say(newTens, left + 1)],
          [
            `Ten of the ${many(ones, "one")} make one more ten, which gives ${many(newTens, "ten")}, and ${many(left, "one")} stay.`,
            `${ones} 个一里的十个一换成一个十，就有 ${newTens} 个十，还剩 ${left} 个一。`,
          ],
        );
      },
    ),
    earlyPoint(
      "opening-a-ten",
      ["Opening a ten", "把一个十拆开"],
      [
        "You can trade the other way too. Open one rod and it becomes ten small squares. So 5 tens and 2 ones are the same as 4 tens and 12 ones. There is one ten fewer and ten ones more. You will need this idea later, when you subtract and there are not enough ones to take away.",
        "也可以反过来换。把一根长条拆开，就变成十个小方块。所以 5 个十和 2 个一，和 4 个十 12 个一一样多：十少了一个，一多了十个。以后做减法，个位不够减的时候，就要用到这个办法。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const ones = rng.int(0, 9);
        const n = 10 * tens + ones;
        return whole(
          [`${n} is ${many(tens - 1, "ten")} and how many ones?`, `${n} 是 ${tens - 1} 个十和多少个一？`],
          ones + 10,
          [ones, n, tens, ones + 1],
          [
            `${many(tens - 1, "ten")} make ${10 * (tens - 1)}, and $${n} - ${10 * (tens - 1)} = ${ones + 10}$, so there are ${many(ones + 10, "one")}.`,
            `${tens - 1} 个十是 ${10 * (tens - 1)}，$${n} - ${10 * (tens - 1)} = ${ones + 10}$，所以有 ${ones + 10} 个一。`,
          ],
          blockRowsFigure([[0, tens, ones]]),
        );
      },
    ),
  ],
);

const countingOnByTens = earlyTopic(
  "counting-by-tens-from-any-number",
  ["Counting by Tens From Any Number", "从任意一个数开始十个十个地数"],
  ["Count forward and back by tens starting from a number that does not end in zero.", "从个位不是 0 的数开始，十个十个地往前或往后数。"],
  ["ten-more-and-ten-less"],
  ["1.NBT.C.5"],
  [
    earlyPoint(
      "the-next-number-counting-by-tens",
      ["The next number counting by tens", "十个十个地数的下一个数"],
      [
        "When you count by tens, only the tens digit changes, and the ones digit stays where it is. So 23 is followed by 33, then 43, then 53. Counting back works the same way: 53, 43, 33. Look at the numbers first to see if the tens are going up or going down.",
        "十个十个地数时，只有十位在变，个位不变。所以 23 后面是 33，然后是 43、53。往回数也一样：53、43、33。先看看十位是在变大还是变小。",
      ],
      (rng) => {
        const up = rng.bool();
        const ones = rng.int(1, 9);
        const start = 10 * rng.int(up ? 0 : 4, up ? 5 : 11) + ones;
        const d = up ? 10 : -10;
        const shown = [0, 1, 2].map((i) => start + i * d);
        const answer = start + 3 * d;
        return whole(
          [`What number comes next? $${shown.join(",\\ ")},\\ \\square$`, `方框里填几？$${shown.join(",\\ ")},\\ \\square$`],
          answer,
          [answer + 1, answer - 1, start + 4 * d, start + 2 * d + (up ? 1 : -1)],
          [
            `Each number is 10 ${up ? "more" : "less"} than the one before it, and ${shown[2]} ${up ? "+" : "-"} 10 is ${answer}.`,
            `每个数都比前一个数${up ? "多" : "少"} 10，$${shown[2]} ${up ? "+" : "-"} 10 = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "where-tens-jumps-land",
      ["Where jumps of ten land", "跳十跳到哪里"],
      [
        "Each jump on this number line is a jump of ten. Follow the jumps one at a time and say the number you land on. Starting at 17, the jumps land on 27, 37 and 47. Because each jump is the same, you can count the jumps and raise the tens digit by that many.",
        "这条数轴上每跳一次是 10。一跳一跳地跟着走，说出落到的数。从 17 开始，依次落在 27、37、47。因为每跳都一样，也可以数一数跳了几次，让十位增加这么多。",
      ],
      (rng) => {
        const jumps = rng.int(2, 4);
        const ones = rng.int(1, 9);
        const start = 10 * rng.int(0, 7) + ones;
        const up = rng.bool();
        const low = start;
        const stops = up
          ? [...Array(jumps + 1).keys()].map((i) => low + 10 * i)
          : [...Array(jumps + 1).keys()].map((i) => low + 10 * (jumps - i));
        const answer = stops[jumps] as number;
        return whole(
          ["The jumps start at the first number. Where do they end?", "从第一个数开始跳。最后跳到哪个数？"],
          answer,
          [up ? answer + 10 : answer - 10, up ? start + jumps : stops[0]! - jumps, up ? answer - 10 : answer + 10],
          [
            `Each jump changes the tens digit by 1. After ${jumps} jumps from ${stops[0]} you land on ${answer}.`,
            `每跳一次，十位变化 1。从 ${stops[0]} 跳 ${jumps} 次，落在 ${answer}。`,
          ],
          hopsFigure(stops, true),
        );
      },
    ),
    earlyPoint(
      "how-many-jumps-of-ten",
      ["How many jumps of ten", "跳了几次十"],
      [
        "To find how many tens are between two numbers with the same ones digit, compare only their tens digits. From 24 to 64, the tens digit goes from 2 to 6, which is 4 jumps of ten. Counting by tens aloud while raising a finger for each jump is a good way to check your answer.",
        "两个数的个位相同时，要知道它们之间相差几个十，只要比较十位。从 24 到 64，十位从 2 变到 6，是跳了 4 次十。一边十个十个地数，一边每跳伸一根手指，可以检查答案。",
      ],
      (rng) => {
        const ones = rng.int(1, 9);
        const low = 10 * rng.int(0, 5) + ones;
        const jumps = rng.int(2, 6);
        const high = low + 10 * jumps;
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} counts by tens from ${low} to ${high}. How many tens does ${name} count?`,
            `${name} 从 ${low} 开始十个十个地数，数到 ${high}。一共数了多少个十？`,
          ],
          jumps,
          [high - low, jumps * 10, high, jumps + 1],
          [
            `The tens digit goes up by ${jumps} and the ones digit stays the same, so ${many(jumps, "ten")} were counted.`,
            `十位增加了 ${jumps}，个位不变，所以数了 ${jumps} 个十。`,
          ],
        );
      },
    ),
  ],
);

/** chartStart picks the first square of a hundred-chart piece of the given size so that no row runs off the chart. */
function chartStart(rng: Rng, rows: number, columns: number): number {
  return 10 * rng.int(0, 11 - rows) + rng.int(1, 11 - columns);
}

const numbersOnAHundredChart = earlyTopic(
  "numbers-on-a-hundred-chart",
  ["Numbers on a Hundred Chart", "百数表上的数"],
  ["Use the rows and columns of a hundred chart to find numbers.", "用百数表的行和列找数。"],
  ["ten-more-and-ten-less"],
  ["1.NBT.C.5"],
  [
    earlyPoint(
      "moving-along-a-row",
      ["Moving along a row", "沿着一行走"],
      [
        "A hundred chart lists the numbers in rows of ten. As you move one square to the right, the number goes up by 1. As you move one square to the left, it goes down by 1. So to fill in a blank square in a row, start from a number you can see and count along the row.",
        "百数表把数排成每行十个。向右走一格，数多 1。向左走一格，数少 1。所以要填一行里的空格，就从看得见的数开始，沿着这一行数过去。",
      ],
      (rng) => {
        const first = chartStart(rng, 2, 5);
        const row = rng.int(0, 1);
        const c = rng.int(0, 4);
        let d = rng.int(-2, 2);
        while (d === 0 || c + d < 0 || c + d > 4) d = d >= 2 || d === 0 ? (c === 4 ? -1 : 1) : d + 1;
        const seen = first + row * 10 + c;
        const answer = seen + d;
        return whole(
          [
            "This is a piece of a hundred chart. What number goes in the square with the question mark?",
            "这是百数表的一部分。问号所在的格子里应该填几？",
          ],
          answer,
          [seen + d * 10, seen - d, seen],
          [
            `The question mark is ${Math.abs(d)} ${Math.abs(d) === 1 ? "square" : "squares"} to the ${d > 0 ? "right" : "left"} of ${seen}, so the number is ${d > 0 ? `$${seen} + ${d}$` : `$${seen} - ${-d}$`}, which is ${answer}.`,
            `问号在 ${seen} ${d > 0 ? "右" : "左"}边第 ${Math.abs(d)} 格，所以这个数是 ${d > 0 ? `$${seen} + ${d}$` : `$${seen} - ${-d}$`}，也就是 ${answer}。`,
          ],
          chartPieceFigure(first, 2, 5, [seen], answer),
        );
      },
    ),
    earlyPoint(
      "moving-up-and-down-a-column",
      ["Moving up and down a column", "沿着一列走"],
      [
        "Moving straight down one square on a hundred chart adds 10, and moving straight up takes away 10. The ones digit stays the same in the whole column. So below 34 is 44, and above 34 is 24. Use this to jump quickly around the chart without counting every square on the way.",
        "在百数表上，往下走一格多 10，往上走一格少 10。同一列的个位都一样。所以 34 下面是 44，上面是 24。这样就能在表上很快地跳，不用一格一格地数。",
      ],
      (rng) => {
        const first = chartStart(rng, 4, 3);
        const c = rng.int(0, 2);
        const r1 = rng.int(0, 3);
        let r2 = rng.int(0, 3);
        if (r2 === r1) r2 = (r1 + 1 + rng.int(0, 2)) % 4;
        const seen = first + r1 * 10 + c;
        const answer = first + r2 * 10 + c;
        return whole(
          [
            "This is a piece of a hundred chart. What number goes in the square with the question mark?",
            "这是百数表的一部分。问号所在的格子里应该填几？",
          ],
          answer,
          [seen + (r2 - r1), seen - (r2 - r1) * 10, seen],
          [
            `The question mark is ${Math.abs(r2 - r1)} ${Math.abs(r2 - r1) === 1 ? "row" : "rows"} ${r2 > r1 ? "below" : "above"} ${seen}. Each row changes the number by 10, so it is ${answer}.`,
            `问号在 ${seen} ${r2 > r1 ? "下" : "上"}面第 ${Math.abs(r2 - r1)} 行。每隔一行差 10，所以这个数是 ${answer}。`,
          ],
          chartPieceFigure(first, 4, 3, [seen], answer),
        );
      },
    ),
    earlyPoint(
      "moving-in-both-directions",
      ["Moving in both directions", "两个方向都走"],
      [
        "Now put the two moves together. Going down a row adds 10, and going to the right adds 1. So to get from one square to another, first change the tens by moving up or down, and then change the ones by moving left or right. The order does not matter, as you will land on the same square.",
        "现在把两种走法合起来。往下一行多 10，往右一格多 1。从一个格子到另一个格子，先上下走改变十位，再左右走改变个位。先走哪一步都行，最后落在同一个格子。",
      ],
      (rng) => {
        const first = chartStart(rng, 3, 4);
        const r1 = rng.int(0, 2);
        const c1 = rng.int(0, 3);
        let r2 = rng.int(0, 2);
        let c2 = rng.int(0, 3);
        if (r2 === r1) r2 = (r1 + 1) % 3;
        if (c2 === c1) c2 = (c1 + 1) % 4;
        const seen = first + r1 * 10 + c1;
        const answer = first + r2 * 10 + c2;
        const dr = r2 - r1;
        const dc = c2 - c1;
        return whole(
          [
            "This is a piece of a hundred chart. What number goes in the square with the question mark?",
            "这是百数表的一部分。问号所在的格子里应该填几？",
          ],
          answer,
          [seen + dr * 10, seen + dc, seen + dr + dc * 10],
          [
            `Going ${Math.abs(dr)} ${dr > 0 ? "down" : "up"} from ${seen} gives ${seen + dr * 10}. Going ${Math.abs(dc)} to the ${dc > 0 ? "right" : "left"} then gives ${answer}.`,
            `从 ${seen} 往${dr > 0 ? "下" : "上"}走 ${Math.abs(dr)} 行，得到 ${seen + dr * 10}。再往${dc > 0 ? "右" : "左"}走 ${Math.abs(dc)} 格，得到 ${answer}。`,
          ],
          chartPieceFigure(first, 3, 4, [seen], answer),
        );
      },
    ),
  ],
);

const numberLinesTo120 = earlyTopic(
  "number-lines-to-120",
  ["Number Lines to 120", "120 以内的数轴"],
  [
    "Read points on number lines marked by ones or by tens, and tell which numbers lie between others.",
    "读出数轴上按一或按十标记的点，并说出哪些数在两个数之间。",
  ],
  ["counting-to-120"],
  ["1.NBT.A.1"],
  [
    earlyPoint(
      "reading-a-line-marked-by-ones",
      ["Reading a line marked by ones", "读每格是一的数轴"],
      [
        "On this number line each small space is worth 1. Only the two ends have numbers written on them. To read a point, start at the nearer end and count the spaces to the point. Count forward from the left end, or count back from the right end. Both ways reach the same number.",
        "这条数轴上每一小格是 1，只有两端写了数。读一个点时，从近的一端开始，数到这个点有几格。可以从左端往后数，也可以从右端往回数，得到的数是一样的。",
      ],
      (rng) => {
        const lo = 10 * rng.int(0, 11);
        const mark = lo + rng.int(1, 9);
        return whole(
          ["What number does the dot show?", "这个点表示什么数？"],
          mark,
          [mark - lo, lo + 10 - (mark - lo), mark + 10],
          [
            `The dot is ${mark - lo} ${mark - lo === 1 ? "space" : "spaces"} past ${lo}, so it shows ${mark}.`,
            `这个点在 ${lo} 后面第 ${mark - lo} 格，所以表示 ${mark}。`,
          ],
          numberLineFigure(lo, lo + 10, 1, mark, false),
        );
      },
    ),
    earlyPoint(
      "reading-a-line-marked-by-tens",
      ["Reading a line marked by tens", "读每格是十的数轴"],
      [
        "A number line does not always count by ones. Here each space is worth 10, so the marks go 10, 20, 30 and so on. Before you read a point, look at how much each space is worth. Then count by tens from the start to the point. Reading each space as 1 will give an answer that is far too small.",
        "数轴不一定按一来数。这里每格是 10，所以刻度是 10、20、30 等。读点之前，先看每格是多少。再从起点开始十个十个地数到这个点。如果把每格当成 1，答案就太小了。",
      ],
      (rng) => {
        const hi = rng.pick([60, 70, 80, 90, 100, 110, 120]);
        const lo = rng.pick([0, 10, 20]);
        const spaces = (hi - lo) / 10;
        const k = rng.int(1, spaces - 1);
        const mark = lo + 10 * k;
        return whole(
          ["Each space is worth 10. What number does the dot show?", "每格是 10。这个点表示什么数？"],
          mark,
          [lo + k, k, mark + 10, mark - 10],
          [
            `The dot is ${k} spaces past ${lo}. Counting by tens from ${lo} reaches ${mark}.`,
            `这个点在 ${lo} 后面第 ${k} 格。从 ${lo} 开始十个十个地数，数到 ${mark}。`,
          ],
          numberLineFigure(lo, hi, 10, mark, false),
        );
      },
    ),
    earlyPoint(
      "which-number-lies-between",
      ["Which number lies between", "哪个数在中间"],
      [
        "On a number line, smaller numbers are on the left and larger numbers are on the right. A number lies between two others when it is larger than the left one and smaller than the right one. Check both sides, as a number can pass one test and fail the other. Take special care around 100.",
        "在数轴上，小的数在左边，大的数在右边。一个数比左边的数大、比右边的数小，它就在这两个数之间。两边都要检查，因为一个数可能只满足一边。100 附近要特别小心。",
      ],
      (rng) => {
        const low = rng.int(15, 105);
        const gap = rng.int(3, 8);
        const high = low + gap;
        const answer = low + rng.int(1, gap - 1);
        return chooseMath(
          rng,
          [`Which number lies between ${low} and ${high}?`, `哪个数在 ${low} 和 ${high} 之间？`],
          `${answer}`,
          [`${low - rng.int(1, 3)}`, `${high + rng.int(1, 3)}`, `${low + 10 + gap}`, `${Math.max(low - 10, 1)}`],
          [
            `${answer} is larger than ${low} and smaller than ${high}, so it lies between them.`,
            `${answer} 比 ${low} 大，比 ${high} 小，所以在它们之间。`,
          ],
        );
      },
    ),
  ],
);

const orderingNumbersTo120 = earlyTopic(
  "ordering-numbers-to-120",
  ["Ordering Numbers to 120", "120 以内数的排序"],
  ["Compare and order numbers up to 120, including those with three digits.", "比较 120 以内的数并排序，包括三位数。"],
  ["comparing-two-digit-numbers"],
  ["1.NBT.B.3"],
  [
    earlyPoint(
      "comparing-past-one-hundred",
      ["Comparing past one hundred", "比较超过一百的数"],
      [
        "A number with three digits is always larger than one with two digits, since it has passed 100. If both numbers have three digits, as 104 and 112 do, compare their tens digits and then their ones digits. Remember that the small end of the symbol points to the smaller number, and the wide end opens toward the larger.",
        "三位数总比两位数大，因为它已经超过 100 了。如果两个数都是三位数，比如 104 和 112，就先比十位，再比个位。记住，符号尖的一头对着小的数，开口的一头朝着大的数。",
      ],
      (rng) => {
        const a = rng.int(95, 120);
        const b = rng.bool(0.1) ? a : rng.int(85, 120);
        return compareProblem(
          `${a}`,
          `${b}`,
          rel(a, b),
          a === b
            ? t(`Both numbers are the same, so the equal sign goes between them.`, `两个数相同，所以中间填等号。`)
            : t(
                `${Math.min(a, b)} comes before ${Math.max(a, b)} when counting, so ${Math.min(a, b)} is the smaller number.`,
                `数数时 ${Math.min(a, b)} 在 ${Math.max(a, b)} 前面，所以 ${Math.min(a, b)} 更小。`,
              ),
        );
      },
    ),
    earlyPoint(
      "putting-three-numbers-in-order",
      ["Putting three numbers in order", "把三个数排好顺序"],
      [
        "To put numbers in order from least to greatest, find the smallest one first and write it down. Then find the smallest of the numbers that are left, and so on. Compare the tens first, because tens are worth more than ones. Numbers such as 35 and 53 look alike, but they are far apart.",
        "要把数从小到大排，先找出最小的写下来。再从剩下的数里找最小的，这样继续下去。先比十位，因为十比一大。35 和 53 看起来很像，其实差得很远。",
      ],
      (rng) => {
        const tens = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2);
        const ones = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2);
        const a = 10 * (tens[0] as number) + (ones[0] as number);
        const b = 10 * (ones[0] as number) + (tens[0] as number);
        const c = rng.bool() ? 100 + rng.int(1, 20) : 10 * (tens[1] as number) + (ones[1] as number);
        const set = [...new Set([a, b, c])];
        while (set.length < 3) set.push((set[set.length - 1] as number) + 7);
        const [p, q, r] = [...set].sort((x, y) => x - y) as [number, number, number];
        return chooseMath(
          rng,
          ["Which list goes from least to greatest?", "哪一组是从小到大排列的？"],
          `${p},\\ ${q},\\ ${r}`,
          [`${r},\\ ${q},\\ ${p}`, `${q},\\ ${p},\\ ${r}`, `${p},\\ ${r},\\ ${q}`, `${q},\\ ${r},\\ ${p}`],
          [`${p} is the smallest and ${r} is the greatest, with ${q} between them.`, `${p} 最小，${r} 最大，${q} 在它们中间。`],
        );
      },
    ),
    earlyPoint(
      "comparing-two-rows-of-blocks",
      ["Comparing two rows of blocks", "比较两排积木"],
      [
        "Blocks let you compare numbers at a glance. First compare the rods, because each rod is worth ten small squares. The row with more rods is larger, no matter how many small squares it has. Only when both rows have the same number of rods do you need to look at the small squares.",
        "用积木一眼就能比较两个数。先比长条，因为一根长条抵得上十个小方块。长条多的那一排就大，不管小方块有多少。只有两排长条一样多时，才需要看小方块。",
      ],
      (rng) => {
        const t1 = rng.int(1, 8);
        const same = rng.bool(0.35);
        const t2 = same ? t1 : rng.int(1, 8);
        const o1 = rng.int(0, 9);
        const o2 = same ? rng.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== o1)) : rng.int(0, 9);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        const equal = a === b;
        const top: Pair = ["The top row", "上面一排"];
        const bottom: Pair = ["The bottom row", "下面一排"];
        const both: Pair = ["They show the same number", "两排表示的数一样大"];
        const correct = equal ? both : a > b ? top : bottom;
        return choose(
          rng,
          ["Which row of blocks shows the greater number?", "哪一排积木表示的数更大？"],
          correct,
          [top, bottom, both].filter((o) => o !== correct),
          equal
            ? [`Both rows show ${a}.`, `两排都表示 ${a}。`]
            : [`The top row shows ${a} and the bottom row shows ${b}.`, `上面一排表示 ${a}，下面一排表示 ${b}。`],
          blockRowsFigure([
            [0, t1, o1],
            [0, t2, o2],
          ]),
        );
      },
    ),
  ],
);

const factsWithin10 = earlyTopic(
  "adding-and-subtracting-within-10",
  ["Adding and Subtracting Within 10", "10 以内的加减法"],
  ["Know the sums and differences within 10 quickly, seeing them on ten-frames.", "很快说出 10 以内的和与差，并能在十格框上看出来。"],
  ["counting-back-to-subtract"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "seeing-a-sum-on-a-frame",
      ["Seeing a sum on a frame", "在十格框上看和"],
      [
        "The filled counters show one number and the empty ones show the other. Together they show the sum. A ten-frame has two rows of five, so you can often read the total without counting one by one. For example, a full top row and two more below make 7.",
        "实心圆片表示一个数，空心圆片表示另一个数，合起来就是它们的和。十格框有两行，每行五格，所以常常不用一个一个地数就能读出总数。比如第一行满了，下面还有两个，就是 7。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(1, 10 - a);
        const answer = a + b;
        return whole(
          [`The frame shows $${a} + ${b}$. What is the sum?`, `这个十格框表示 $${a} + ${b}$。和是多少？`],
          answer,
          [Math.abs(a - b), a, b, 10],
          [
            `${a} filled counters and ${b} empty counters make ${answer} counters in all.`,
            `${a} 个实心圆片和 ${b} 个空心圆片，一共是 ${answer} 个。`,
          ],
          tenFramesFigure(a, b),
        );
      },
    ),
    earlyPoint(
      "seeing-a-difference-on-a-frame",
      ["Seeing a difference on a frame", "在十格框上看差"],
      [
        "Think of the empty counters as the ones you are taking away. All the counters together show the number you start with, and the filled ones are what stays behind. So to subtract, cover up the ones you take away and read what is left. Each difference is part of an addition fact you know.",
        "把空心圆片想成要拿走的。所有圆片合起来是开始的数，实心的是留下的。所以做减法时，把要拿走的盖住，看还剩多少。每个差都对应一个你已经知道的加法算式。",
      ],
      (rng) => {
        const all = rng.int(3, 10);
        const away = rng.int(1, all - 1);
        const answer = all - away;
        return whole(
          [
            `The frame shows $${all} - ${away}$, with the ${away} taken away shown as empty counters. What is the difference?`,
            `这个十格框表示 $${all} - ${away}$，拿走的 ${away} 个画成空心圆片。差是多少？`,
          ],
          answer,
          [all + away, all, away],
          [
            `Of the ${all} counters, ${away} are taken away, and ${answer} filled counters stay.`,
            `${all} 个圆片拿走 ${away} 个，还剩 ${answer} 个实心圆片。`,
          ],
          tenFramesFigure(answer, away),
        );
      },
    ),
    earlyPoint(
      "quick-facts-within-10",
      ["Quick facts within 10", "10 以内的口算"],
      [
        "Facts within 10 are worth knowing without counting, because every larger sum is built from them. Practice pairs that make 10, doubles, and adding or taking away 1 and 2. If a fact does not come quickly, picture a ten-frame in your head. Soon the answer will come as soon as you see the numbers.",
        "10 以内的算式最好不用数就能说出，因为更大的和都是由它们组成的。多练合起来是 10 的数对、相同的两个数相加，以及加减 1 和 2。如果一时想不出来，就在脑子里想一个十格框。很快你一看到数，答案就出来了。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 10 - a);
        const c = a + b;
        const form = rng.int(0, 3);
        if (form === 0)
          return whole(
            [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
            c,
            [a, b, Math.abs(a - b)],
            [`Starting at ${a} and counting on ${b} gives ${c}.`, `从 ${a} 开始往后数 ${b} 个，得到 ${c}。`],
          );
        if (form === 1)
          return whole(
            [`What is $${c} - ${a}$?`, `$${c} - ${a}$ 等于多少？`],
            b,
            [c + a, c, a],
            [`$${a} + ${b} = ${c}$, so $${c} - ${a} = ${b}$.`, `$${a} + ${b} = ${c}$，所以 $${c} - ${a} = ${b}$。`],
          );
        if (form === 2)
          return whole(
            [`What number goes in the box? $${a} + \\square = ${c}$`, `方框里填几？$${a} + \\square = ${c}$`],
            b,
            [c, a, c + a],
            [`$${a} + ${b} = ${c}$, so the box holds ${b}.`, `$${a} + ${b} = ${c}$，所以方框里填 ${b}。`],
          );
        return whole(
          [`What number goes in the box? $${c} - \\square = ${b}$`, `方框里填几？$${c} - \\square = ${b}$`],
          a,
          [c, b, c + b],
          [`$${c} - ${a} = ${b}$, so the box holds ${a}.`, `$${c} - ${a} = ${b}$，所以方框里填 ${a}。`],
        );
      },
    ),
  ],
);

const addingAndSubtractingZero = earlyTopic(
  "adding-and-subtracting-zero",
  ["Adding and Subtracting Zero", "加 0 和减 0"],
  ["Add and take away zero, and take a number away from itself.", "加 0、减 0，以及一个数减去它自己。"],
  ["adding-and-subtracting-within-10"],
  ["1.OA.B.3"],
  [
    earlyPoint(
      "adding-zero-changes-nothing",
      ["Adding zero changes nothing", "加 0 不改变大小"],
      [
        "Zero means none at all. If you add none to a group, the group stays just as it was, so any number plus zero is that same number. It works in either order, and it works for large numbers just as well as for small ones. Do not add 1 by mistake, because nothing is being added here.",
        "0 表示一个也没有。给一组东西加上 0 个，这组东西还是原来那么多，所以任何数加 0 都等于它本身。换个顺序也一样，大的数和小的数都是这样。不要误以为加了 1，这里什么也没有加上。",
      ],
      (rng) => {
        const n = rng.int(1, 120);
        const first = rng.bool();
        return whole(
          [first ? `What is $0 + ${n}$?` : `What is $${n} + 0$?`, first ? `$0 + ${n}$ 等于多少？` : `$${n} + 0$ 等于多少？`],
          n,
          [n + 1, 0, n * 10],
          [`Adding zero changes nothing, so the answer is ${n}.`, `加 0 不改变大小，所以答案是 ${n}。`],
        );
      },
    ),
    earlyPoint(
      "taking-away-zero-or-everything",
      ["Taking away zero or everything", "减 0 和减去全部"],
      [
        "Taking away zero means taking nothing away, so the number stays the same. Taking away a number from itself means taking everything away, so nothing is left and the answer is zero. These two look alike, but they are opposites. Read the number being taken away carefully before you answer the question.",
        "减 0 就是什么也没拿走，所以这个数不变。一个数减去它自己，就是全部拿走，什么也不剩，答案是 0。这两种算式看起来很像，结果却正好相反。回答之前要看清减去的是多少。",
      ],
      (rng) => {
        const n = rng.int(2, 120);
        const form = rng.int(0, 2);
        if (form === 0)
          return whole(
            [`What is $${n} - 0$?`, `$${n} - 0$ 等于多少？`],
            n,
            [0, n - 1],
            [`Nothing is taken away, so ${n} stay.`, `什么也没有拿走，所以还是 ${n}。`],
          );
        if (form === 1)
          return whole(
            [`What is $${n} - ${n}$?`, `$${n} - ${n}$ 等于多少？`],
            0,
            [n, 1, n + n],
            [`Everything is taken away, so nothing stays.`, `全部都拿走了，什么也不剩。`],
          );
        return whole(
          [`What number goes in the box? $${n} - \\square = ${n}$`, `方框里填几？$${n} - \\square = ${n}$`],
          0,
          [n, 1],
          [
            `The number stays ${n}, so nothing was taken away, and the box holds 0.`,
            `这个数还是 ${n}，说明什么也没有拿走，所以方框里填 0。`,
          ],
        );
      },
    ),
    earlyPoint(
      "zero-in-a-story",
      ["Zero in a story", "故事里的 0"],
      [
        "Stories can have a zero hiding in them. If someone gets no more of something, the amount is unchanged. If someone gives all of it away, nothing is left. Look for words such as none, no more, and all. They tell you that zero is in the story, even though it may not be written as a number.",
        "故事里可能藏着 0。如果谁没有再得到东西，数量就不变。如果谁把东西全部送走了，就什么也不剩了。留意“没有”“一个也没”“全部”这样的词，它们说明故事里有 0，虽然没有写出这个数字。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const n = rng.int(3, 20);
        const all = rng.bool();
        return all
          ? whole(
              [
                `${name} has ${n} ${thing.en} and gives all of them to a friend. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}，全部送给了朋友。${name} 现在还有多少${thing.unit}${thing.zh}？`,
              ],
              0,
              [n, 1, n + n],
              [`All ${n} are given away, and $${n} - ${n} = 0$.`, `${n} ${thing.unit}全部送走了，$${n} - ${n} = 0$。`],
            )
          : whole(
              [
                `${name} has ${n} ${thing.en}. Today ${name} gets no more ${thing.en} and gives none away. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}。今天没有得到新的${thing.zh}，也没有送给别人。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ],
              n,
              [0, n + 1, n - 1],
              [`Nothing was added or taken away, and $${n} + 0 = ${n}$.`, `没有增加，也没有减少，$${n} + 0 = ${n}$。`],
            );
      },
    ),
  ],
);

const takingFromTen = earlyTopic(
  "taking-from-ten-to-subtract",
  ["Taking From Ten to Subtract", "从十里减"],
  ["Subtract from a teen number by taking away from the ten and adding the ones.", "减十几时，从十里减，再加上剩下的个位。"],
  ["subtracting-through-ten"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "taking-from-a-full-frame",
      ["Taking from a full frame", "从满框里拿"],
      [
        "A teen number is a full ten-frame and some extra counters. When you need to take away a lot, take them all from the full frame. If you take 9 from the full frame, 1 is left there. The extra counters in the second frame have not been touched, and you still have those too.",
        "十几是一个满框再加一些圆片。要拿走很多时，全部从满框里拿。从满框里拿走 9 个，框里还剩 1 个。第二个框里的圆片没有动，它们还在。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const s = rng.int(4, 9);
        return whole(
          [
            `The frames show ${10 + k}. If you take ${s} counters from the full frame, how many are left in that frame?`,
            `这两个框表示 ${10 + k}。如果从满框里拿走 ${s} 个圆片，这个框里还剩多少个？`,
          ],
          10 - s,
          [10 + k - s, s, k],
          [`A full frame has 10, and $10 - ${s} = ${10 - s}$.`, `满框有 10 个，$10 - ${s} = ${10 - s}$。`],
          tenFramesFigure(10, k),
        );
      },
    ),
    earlyPoint(
      "the-two-steps-of-taking-from-ten",
      ["The two steps of taking from ten", "从十里减的两步"],
      [
        "Taking from ten has two steps. To find $15 - 8$, first find $10 - 8$, which is 2. Then add the 5 ones that were not touched, which gives 7. This turns a hard fact into two easy ones. You already know how to subtract from ten and how to add small numbers.",
        "从十里减有两步。求 $15 - 8$，先算 $10 - 8$，得 2。再加上没有动过的 5 个一，得 7。这样一道难题就变成了两道简单的题。从十里减和小的数相加，你都已经会了。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const s = rng.int(5, 9);
        const n = 10 + k;
        return chooseMath(
          rng,
          [`Which shows how to find $${n} - ${s}$ by taking from ten?`, `要用从十里减的方法求 $${n} - ${s}$，下面哪个是对的？`],
          `(10 - ${s}) + ${k}`,
          [`(10 - ${s}) - ${k}`, `(10 + ${s}) + ${k}`, `(10 - ${k}) + ${s}`, `(10 + ${s}) - ${k}`],
          [
            `${n} is 10 and ${k}. Take ${s} from the 10, and then add back the ${k} that stayed. The answer is ${10 - s + k}.`,
            `${n} 是 10 和 ${k}。先从 10 里减去 ${s}，再加上留下的 ${k}，得 ${10 - s + k}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-by-taking-from-ten",
      ["Subtracting by taking from ten", "用从十里减的方法算减法"],
      [
        "Now use the whole method. Split the teen number into ten and ones in your head. Take the number away from the ten, and then add the ones back on. Taking from ten works best when you take away a large number, such as 7, 8 or 9. These are the facts that are hard to count back.",
        "现在把整个方法用起来。在脑子里把十几分成十和几。从十里减去要减的数，再加上几个一。要减的数比较大的时候，比如 7、8、9，这个方法最好用，因为这些算式往回数很麻烦。",
      ],
      (rng) => {
        let s = rng.int(6, 9);
        const k = rng.int(1, 8);
        if (s <= k) s = k + 1;
        const n = 10 + k;
        const answer = n - s;
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const story = rng.bool();
        return whole(
          story
            ? [
                `${name} has ${n} ${thing.en} and gives away ${s}. How many ${thing.en} are left?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}，送出去 ${s} ${thing.unit}。还剩多少${thing.unit}？`,
              ]
            : [`What is $${n} - ${s}$?`, `$${n} - ${s}$ 等于多少？`],
          answer,
          [n + s, 10 - s, 10 - s + 10, k],
          [
            `$10 - ${s} = ${10 - s}$, and adding the ${many(k, "one")} gives $${10 - s} + ${k} = ${answer}$.`,
            `$10 - ${s} = ${10 - s}$，再加上 ${k} 个一，$${10 - s} + ${k} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

const thinkingAdditionToSubtract = earlyTopic(
  "thinking-addition-to-subtract",
  ["Thinking Addition to Subtract", "想加算减"],
  ["Solve a subtraction by finding the missing addend, and count up on a number line.", "把减法看成求缺少的加数来解，并在数轴上往上数。"],
  ["related-addition-and-subtraction-facts"],
  ["1.OA.B.4"],
  [
    earlyPoint(
      "the-addition-behind-a-subtraction",
      ["The addition behind a subtraction", "减法背后的加法"],
      [
        "Every subtraction has an addition hiding behind it. To find $13 - 5$, ask what number you add to 5 to get 13. The number you take away and the answer are the two parts, and the number you start with is the whole. So the whole always goes after the equal sign in the addition.",
        "每个减法背后都藏着一个加法。求 $13 - 5$，就问：5 加几等于 13？减去的数和差是两部分，开始的数是整体。所以在加法算式里，整体总是写在等号后面。",
      ],
      (rng) => {
        const whole1 = rng.int(9, 19);
        const s = rng.int(2, whole1 - 2);
        return chooseMath(
          rng,
          [`Which addition helps you find $${whole1} - ${s}$?`, `哪个加法能帮你求出 $${whole1} - ${s}$？`],
          `${s} + \\square = ${whole1}`,
          [`${whole1} + \\square = ${s}`, `${whole1} + ${s} = \\square`, `${s} + ${whole1 - s + 1} = \\square`],
          [
            `${whole1} is the whole and ${s} is one part, so the box in $${s} + \\square = ${whole1}$ is the other part.`,
            `${whole1} 是整体，${s} 是一部分，所以 $${s} + \\square = ${whole1}$ 的方框就是另一部分。`,
          ],
        );
      },
    ),
    earlyPoint(
      "subtracting-with-a-known-sum",
      ["Subtracting with a known sum", "用知道的和算减法"],
      [
        "If you know an addition fact, you also know two subtraction facts. Since $6 + 7 = 13$, you know $13 - 6 = 7$ and $13 - 7 = 6$. So when a subtraction seems hard, look for an addition you remember with those numbers. This is usually much faster than counting back one at a time.",
        "知道一个加法算式，也就知道了两个减法算式。因为 $6 + 7 = 13$，所以 $13 - 6 = 7$，$13 - 7 = 6$。遇到觉得难的减法，就找一个你记得的、用这些数的加法。这通常比一个一个往回数快得多。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const c = a + b;
        const form = rng.bool();
        return whole(
          [
            `You know that $${a} + ${b} = ${c}$. What is $${c} - ${form ? a : b}$?`,
            `已知 $${a} + ${b} = ${c}$。$${c} - ${form ? a : b}$ 等于多少？`,
          ],
          form ? b : a,
          [c, c + (form ? a : b), form ? a : b],
          [
            `${c} is the whole, and taking away the part ${form ? a : b} leaves the other part, ${form ? b : a}.`,
            `${c} 是整体，减去一部分 ${form ? a : b}，剩下另一部分 ${form ? b : a}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "counting-up-through-ten",
      ["Counting up through ten", "经过十往上数"],
      [
        "You can find a difference by counting up from the smaller number. Make a first jump up to 10, and then a second jump to the larger number. The two jumps together make the answer. To find $14 - 8$, jump 2 from 8 to 10, jump 4 from 10 to 14, and add the jumps to get 6.",
        "可以从小的数往上数来求差。第一跳先跳到 10，第二跳再跳到大的数。两跳合起来就是答案。求 $14 - 8$，从 8 跳 2 到 10，从 10 跳 4 到 14，把两跳加起来得 6。",
      ],
      (rng) => {
        const s = rng.int(4, 9);
        const n = rng.int(11, 19);
        const answer = n - s;
        return whole(
          [
            `The jumps show how to find $${n} - ${s}$ by counting up. What is the difference?`,
            `这些跳表示用往上数的方法求 $${n} - ${s}$。差是多少？`,
          ],
          answer,
          [10 - s, n - 10, n + s],
          [
            `The jumps are ${10 - s} and ${n - 10}, and $${10 - s} + ${n - 10} = ${answer}$.`,
            `两跳分别是 ${10 - s} 和 ${n - 10}，$${10 - s} + ${n - 10} = ${answer}$。`,
          ],
          hopsFigure([s, 10, n]),
        );
      },
    ),
  ],
);

const factTriangles = earlyTopic(
  "fact-triangles",
  ["Fact Triangles", "算式三角形"],
  [
    "Use a triangle of three numbers to find a missing number and the four facts of a family.",
    "用三个数组成的三角形找缺少的数，并写出一组四个算式。",
  ],
  ["related-addition-and-subtraction-facts"],
  ["1.OA.C.6"],
  [
    earlyPoint(
      "the-missing-number-of-a-triangle",
      ["The missing number of a triangle", "三角形中缺少的数"],
      [
        "A fact triangle has the whole at the top and the two parts at the bottom corners. If the whole is missing, add the two parts. If a part is missing, subtract the part you know from the whole. Look at where the question mark is before you decide whether to add or subtract.",
        "算式三角形的顶上是整体，下面两个角是两部分。如果缺整体，就把两部分相加。如果缺一部分，就用整体减去知道的那部分。决定加还是减之前，先看问号在哪里。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a + b;
        const where = rng.int(0, 2);
        const answer = where === 0 ? c : where === 1 ? a : b;
        const known = where === 1 ? b : a;
        return whole(
          ["What number goes at the question mark?", "问号处应该填几？"],
          answer,
          where === 0 ? [Math.abs(a - b), a, b] : [c + known, c, known],
          where === 0
            ? [`The whole is missing, so add the parts: $${a} + ${b} = ${c}$.`, `缺的是整体，所以把两部分相加：$${a} + ${b} = ${c}$。`]
            : [
                `A part is missing, so subtract from the whole: $${c} - ${known} = ${answer}$.`,
                `缺的是一部分，所以用整体减：$${c} - ${known} = ${answer}$。`,
              ],
          factTriangleFigure(where === 0 ? null : c, where === 1 ? null : a, where === 2 ? null : b),
        );
      },
    ),
    earlyPoint(
      "facts-from-a-triangle",
      ["Facts from a triangle", "从三角形读算式"],
      [
        "The three numbers in a triangle make four number sentences: two additions and two subtractions. In the additions, the whole comes after the equal sign. In the subtractions, the whole comes first. A sentence that puts the whole in the wrong place, or that brings in another number, does not belong to this triangle.",
        "三角形里的三个数可以写成四个算式：两个加法，两个减法。加法里，整体写在等号后面。减法里，整体写在最前面。把整体放错位置，或者用了别的数的算式，都不属于这个三角形。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        const right = rng.pick([`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} - ${a} = ${b}`, `${c} - ${b} = ${a}`]);
        return chooseMath(
          rng,
          ["Which number sentence belongs to this fact triangle?", "哪个算式属于这个算式三角形？"],
          right,
          [`${a} + ${c} = ${b}`, `${a} - ${b} = ${c}`, `${b} - ${c} = ${a}`, `${a} + ${b} = ${c + 1}`, `${c} + ${a} = ${b}`],
          [`It uses ${a}, ${b} and ${c} with ${c} as the whole, and it is true.`, `它用了 ${a}、${b} 和 ${c}，${c} 是整体，算式也是对的。`],
          factTriangleFigure(c, a, b),
        );
      },
    ),
    earlyPoint(
      "the-fourth-fact-of-a-family",
      ["The fourth fact of a family", "一组算式中的第四个"],
      [
        "A family usually has four facts. Swapping the two parts in an addition gives the second addition. Taking each part away from the whole gives the two subtractions. When you know three of the facts, look at which one is missing. Check that the new fact uses the same three numbers and is true.",
        "一组算式通常有四个。把加法里的两部分交换，得到第二个加法。用整体分别减去两部分，得到两个减法。知道了三个算式，就看缺的是哪一个。再检查新的算式是否用了同样的三个数，是否正确。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        const facts = [`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} - ${a} = ${b}`, `${c} - ${b} = ${a}`];
        const missing = rng.int(0, 3);
        const given = facts.filter((_, i) => i !== missing);
        const list = `$${given.join("$, $")}$`;
        return chooseMath(
          rng,
          [
            `Three facts of a family are ${list}. Which is the fourth fact?`,
            `一组算式中的三个是 ${list.replaceAll("$, $", "$、$")}。第四个算式是哪个？`,
          ],
          facts[missing] as string,
          [`${c} + ${a} = ${b}`, `${a} - ${b} = ${c}`, `${c} - ${a} = ${a}`, `${b} - ${a} = ${c}`, `${a} + ${c} = ${b}`],
          [
            `A family holds both additions and both subtractions of ${a}, ${b} and ${c}, and $${facts[missing]}$ is the one not yet listed.`,
            `一组算式包括 ${a}、${b}、${c} 的两个加法和两个减法，$${facts[missing]}$ 是还没列出的那个。`,
          ],
        );
      },
    ),
  ],
);

const trueOrFalseSentences = earlyTopic(
  "true-or-false-number-sentences",
  ["True or False Number Sentences", "判断算式的对错"],
  ["Judge number sentences with sums or differences on both sides of the equal sign.", "判断等号两边都有加减算式的等式是否正确。"],
  ["the-equal-sign"],
  ["1.OA.D.7"],
  [
    earlyPoint(
      "finding-the-false-sentence",
      ["Finding the false sentence", "找出不对的算式"],
      [
        "The equal sign says that the two sides have the same value. To test a sentence, work out each side on its own, and then compare the two results. A sentence with no operation, such as $7 = 7$, is true. So is a sentence with the answer on the left, such as $9 = 4 + 5$.",
        "等号表示两边的值相同。要判断一个算式，就分别算出两边，再比较结果。没有运算的算式也可以是对的，比如 $7 = 7$。答案写在左边的算式也可以是对的，比如 $9 = 4 + 5$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a + b;
        const trueOnes = rng.shuffle([
          `${c} = ${a} + ${b}`,
          `${a} + ${b} = ${b} + ${a}`,
          `${c} = ${c}`,
          `${c} - ${a} = ${b}`,
          `${a} + ${b} = ${a + 1} + ${b - 1}`,
        ]);
        const bad = rng.pick([
          `${c} = ${a} + ${b + 1}`,
          `${a} + ${b} = ${a} + ${b + 1}`,
          `${c} - ${a} = ${a + b + 1}`,
          `${c} = ${c + 1}`,
          `${a} + ${b} = ${a + 2} + ${b + 1}`,
        ]);
        return chooseMath(
          rng,
          ["Three of these sentences are true and one is false. Which one is false?", "下面有三个算式是对的，一个是错的。错的是哪一个？"],
          bad,
          trueOnes,
          [
            `The two sides of $${bad}$ have different values, so it is false. In the others, the two sides have the same value.`,
            `$${bad}$ 两边的值不同，所以是错的。其他算式两边的值都相同。`,
          ],
        );
      },
    ),
    earlyPoint(
      "sums-on-both-sides",
      ["Sums on both sides", "两边都是和"],
      [
        "Both sides of an equal sign can be sums. For the sentence to be true, the two sums must be the same number, even if they use different addends. For example, $6 + 2 = 5 + 3$ is true, because both sides make 8. Move 1 from one addend to the other, and the sum does not change.",
        "等号两边都可以是和。要让算式正确，两个和必须相等，即使用的加数不同。比如 $6 + 2 = 5 + 3$ 是对的，因为两边都是 8。把一个加数的 1 挪给另一个加数，和不变。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const shift = rng.int(1, 2);
        const answer = b + shift;
        const left = a - shift;
        return whole(
          [`What number goes in the box? $${a} + ${b} = ${left} + \\square$`, `方框里填几？$${a} + ${b} = ${left} + \\square$`],
          answer,
          [a + b, b, b - shift, a + b + left],
          [`The left side makes ${a + b}, and $${left} + ${answer} = ${a + b}$.`, `左边等于 ${a + b}，$${left} + ${answer} = ${a + b}$。`],
        );
      },
    ),
    earlyPoint(
      "how-many-sentences-are-true",
      ["How many sentences are true", "有几个算式是对的"],
      [
        "Go through the sentences one at a time. For each one, work out the left side and the right side, and mark whether they match. Do not guess from the way a sentence looks. Sentences with the answer on the left, and sentences with nothing to work out at all, can be true as well.",
        "一个一个地看。每个算式都算出左边和右边，再看它们是否相同。不要看样子就猜。答案写在左边的算式，以及根本不用计算的算式，也可能是对的。",
      ],
      (rng) => {
        const line = () => {
          const a = rng.int(1, 9);
          const b = rng.int(1, 9);
          const c = a + b;
          const good = rng.bool();
          const form = rng.int(0, 3);
          if (form === 0) return { s: good ? `${c} = ${a} + ${b}` : `${c + 1} = ${a} + ${b}`, good };
          if (form === 1) return { s: good ? `${a} + ${b} = ${b} + ${a}` : `${a} + ${b} = ${b} + ${a + 1}`, good };
          if (form === 2) return { s: good ? `${c} - ${b} = ${a}` : `${c} - ${b} = ${a + 1}`, good };
          return { s: good ? `${a} + 1 = ${a + 1} + 0` : `${a} + 1 = ${a} + 2`, good };
        };
        const lines = [line(), line(), line()];
        const answer = lines.filter((l) => l.good).length;
        const list = lines.map((l) => `$${l.s}$`).join(", ");
        const listZh = lines.map((l) => `$${l.s}$`).join("、");
        const trueList = lines.filter((l) => l.good).map((l) => `$${l.s}$`);
        return whole(
          [`How many of these sentences are true? ${list}`, `下面的算式中，有几个是对的？${listZh}`],
          answer,
          [3 - answer, 3, 0],
          answer === 0
            ? ["In each sentence the two sides have different values, so none is true.", "每个算式两边的值都不同，所以一个也不对。"]
            : [
                `Only the sentences whose two sides match are true: ${trueList.join(", ")}. That makes ${answer}.`,
                `只有两边相同的算式才是对的：${trueList.join("、")}。一共 ${answer} 个。`,
              ],
        );
      },
    ),
  ],
);

const theUnknownInAnyPlace = earlyTopic(
  "the-unknown-in-any-place",
  ["The Unknown in Any Place", "未知数可以在任何位置"],
  ["Find the unknown number in an equation, wherever it stands.", "无论未知数在什么位置，都能求出它。"],
  ["missing-addends-within-20"],
  ["1.OA.D.8"],
  [
    earlyPoint(
      "the-box-comes-first-in-addition",
      ["The box comes first in addition", "方框在加法的最前面"],
      [
        "The box does not need to be at the end of a sentence. In $\\square + 6 = 13$, the box is the first part, 6 is the second part, and 13 is the whole. You could start from 13 and take away 6, or count up from 6 to 13. Addition can go in any order, so both work.",
        "方框不一定在算式的最后。在 $\\square + 6 = 13$ 中，方框是第一部分，6 是第二部分，13 是整体。可以用 13 减 6，也可以从 6 往上数到 13。加法可以交换顺序，所以两种办法都行。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 8);
        const c = a + b;
        return whole(
          [`What number goes in the box? $\\square + ${b} = ${c}$`, `方框里填几？$\\square + ${b} = ${c}$`],
          a,
          [c, c + b, b],
          [`$${c} - ${b} = ${a}$, and $${a} + ${b} = ${c}$ checks out.`, `$${c} - ${b} = ${a}$，再验算：$${a} + ${b} = ${c}$。`],
        );
      },
    ),
    earlyPoint(
      "the-box-comes-first-in-subtraction",
      ["The box comes first in subtraction", "方框在减法的最前面"],
      [
        "In $\\square - 5 = 8$, the box is the number you start with. After 5 are taken away, 8 are left. So the start must be the 8 that stay and the 5 that went away, put back together. That means you add to find the start, even though the sentence shows a subtraction. Check by subtracting.",
        "在 $\\square - 5 = 8$ 中，方框是开始的数。拿走 5 个以后还剩 8 个。所以开始的数就是剩下的 8 和拿走的 5 合起来。也就是说，虽然算式是减法，求开始的数却要用加法。最后用减法验算一下。",
      ],
      (rng) => {
        const s = rng.int(2, 9);
        const left = rng.int(2, 11);
        const c = s + left;
        return whole(
          [`What number goes in the box? $\\square - ${s} = ${left}$`, `方框里填几？$\\square - ${s} = ${left}$`],
          c,
          [Math.abs(left - s), s, left],
          [
            `Put back what was taken: $${left} + ${s} = ${c}$. Then $${c} - ${s} = ${left}$.`,
            `把拿走的放回去：$${left} + ${s} = ${c}$。验算：$${c} - ${s} = ${left}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "the-whole-on-the-left",
      ["The whole on the left", "整体写在左边"],
      [
        "An equal sign works in both directions, so an equation can begin with the answer. $12 = 5 + \\square$ means the same thing as $5 + \\square = 12$. And $4 = 11 - \\square$ means the same as $11 - \\square = 4$. If a sentence looks strange, read it from right to left, and then solve it the way you always do.",
        "等号两边可以互换，所以算式可以先写答案。$12 = 5 + \\square$ 和 $5 + \\square = 12$ 的意思一样。$4 = 11 - \\square$ 和 $11 - \\square = 4$ 的意思也一样。如果觉得算式看着奇怪，就从右往左读，再像平常一样去解。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.int(2, 9);
        const c = a + b;
        return rng.bool()
          ? whole(
              [`What number goes in the box? $${c} = ${a} + \\square$`, `方框里填几？$${c} = ${a} + \\square$`],
              b,
              [c, c + a, a],
              [`$${c} = ${a} + ${b}$, since $${c} - ${a} = ${b}$.`, `因为 $${c} - ${a} = ${b}$，所以 $${c} = ${a} + ${b}$。`],
            )
          : whole(
              [`What number goes in the box? $${a} = ${c} - \\square$`, `方框里填几？$${a} = ${c} - \\square$`],
              b,
              [c, c + a, a],
              [`Taking ${b} from ${c} leaves ${a}, so the box holds ${b}.`, `${c} 减去 ${b} 剩 ${a}，所以方框里填 ${b}。`],
            );
      },
    ),
  ],
);

const storiesAsNumberSentences = earlyTopic(
  "stories-as-number-sentences",
  ["Stories as Number Sentences", "用算式表示故事"],
  ["Choose the number sentence with a box that tells a story.", "选出用方框表示未知数、能表示故事的算式。"],
  ["word-problems-with-a-missing-part"],
  ["1.OA.A.1"],
  [
    earlyPoint(
      "sentences-for-joining",
      ["Sentences for joining stories", "表示合起来的算式"],
      [
        "A number sentence can tell a story, with a box in place of the number you do not know. If some things are joined to others, use a plus sign. The box goes wherever the unknown amount belongs in the story. It may be at the end, or it may be the number that came along in the middle.",
        "算式可以讲故事，用方框代替不知道的数。如果是把一些东西合起来，就用加号。不知道的数在故事里是什么，方框就写在什么位置。它可能在最后，也可能是中间加进来的数。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(3, 11);
        const b = rng.int(2, 8);
        const c = a + b;
        return rng.bool()
          ? chooseMath(
              rng,
              [
                `${name} has ${a} ${thing.en} and gets ${b} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ],
              `${a} + ${b} = \\square`,
              [`${a} - ${b} = \\square`, `${a} + \\square = ${b}`, `\\square - ${a} = ${b + 1}`],
              [`The ${a} and the ${b} are joined, and the box is the total.`, `${a} 和 ${b} 合起来，方框是总数。`],
            )
          : chooseMath(
              rng,
              [
                `${name} has ${a} ${thing.en} and gets some more. Now ${name} has ${c}. How many did ${name} get?`,
                `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到一些，现在有 ${c} ${thing.unit}。${name} 得到了多少${thing.unit}？`,
              ],
              `${a} + \\square = ${c}`,
              [`${a} + ${c} = \\square`, `\\square + ${c} = ${a}`, `${c} + \\square = ${a}`],
              [
                `The story starts with ${a}, adds an unknown amount, and ends at ${c}.`,
                `故事从 ${a} 开始，加上一个不知道的数，最后是 ${c}。`,
              ],
            );
      },
    ),
    earlyPoint(
      "sentences-for-taking-away",
      ["Sentences for taking away", "表示拿走的算式"],
      [
        "If some things leave a group, the story is a subtraction. The number you start with comes first, then the minus sign and the number taken away, and then the number left. Think about which of these three you do not know, because the box goes there. Sometimes it is even the number at the start.",
        "如果有些东西从一组里离开了，故事就是减法。开始的数写在最前面，然后是减号和拿走的数，最后是剩下的数。想一想这三个数中哪一个不知道，方框就写在那里。有时候连开始的数都不知道。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const c = rng.int(9, 19);
        const b = rng.int(2, c - 3);
        const left = c - b;
        const form = rng.int(0, 2);
        if (form === 0)
          return chooseMath(
            rng,
            [
              `${name} has ${c} ${thing.en} and gives away ${b}. How many are left?`,
              `${name} 有 ${c} ${thing.unit}${thing.zh}，送出去 ${b} ${thing.unit}。还剩多少${thing.unit}？`,
            ],
            `${c} - ${b} = \\square`,
            [`${c} + ${b} = \\square`, `${b} - ${c} = \\square`, `\\square - ${c} = ${b}`],
            [`Start with ${c}, take away ${b}, and the box is what is left.`, `从 ${c} 开始，拿走 ${b}，方框是剩下的数。`],
          );
        if (form === 1)
          return chooseMath(
            rng,
            [
              `${name} has ${c} ${thing.en} and gives some away. Now ${left} are left. How many did ${name} give away?`,
              `${name} 有 ${c} ${thing.unit}${thing.zh}，送出去一些，还剩 ${left} ${thing.unit}。送出去多少${thing.unit}？`,
            ],
            `${c} - \\square = ${left}`,
            [`${c} + ${left} = \\square`, `${left} - \\square = ${c}`, `\\square - ${c} = ${left}`],
            [`Start with ${c}, take away an unknown amount, and ${left} are left.`, `从 ${c} 开始，拿走一个不知道的数，还剩 ${left}。`],
          );
        return chooseMath(
          rng,
          [
            `${name} had some ${thing.en} and gave away ${b}. Now ${left} are left. How many did ${name} have at first?`,
            `${name} 原来有一些${thing.zh}，送出去 ${b} ${thing.unit}，还剩 ${left} ${thing.unit}。原来有多少${thing.unit}？`,
          ],
          `\\square - ${b} = ${left}`,
          [`${b} - ${left} = \\square`, `${left} - ${b} = \\square`, `\\square + ${b} = ${left}`],
          [`The start is unknown. Taking ${b} from it leaves ${left}.`, `开始的数不知道。减去 ${b} 以后剩 ${left}。`],
        );
      },
    ),
    earlyPoint(
      "sentences-for-comparing",
      ["Sentences for comparing", "表示比较的算式"],
      [
        "A story that compares two groups asks how many more or how many fewer. The answer is the difference between them. You can write the larger number take away the smaller number, or the smaller number plus a box that makes the larger one. Writing the smaller number first in a subtraction does not work.",
        "比较两组的故事问的是多多少或少多少，答案是它们的差。可以写成大的数减小的数，也可以写成小的数加方框等于大的数。把小的数写在减法的前面是不对的。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const big = rng.int(8, 19);
        const small = rng.int(2, big - 2);
        const right = rng.bool() ? `${big} - ${small} = \\square` : `${small} + \\square = ${big}`;
        return chooseMath(
          rng,
          [
            `${p} has ${big} ${thing.en} and ${q} has ${small}. How many more does ${p} have than ${q}?`,
            `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 有 ${small} ${thing.unit}。${p} 比 ${q} 多多少${thing.unit}？`,
          ],
          right,
          [`${big} + ${small} = \\square`, `${small} - ${big} = \\square`, `${big} + \\square = ${small}`],
          [
            `The box is the difference between ${big} and ${small}, so it is what the smaller number needs to reach the larger one.`,
            `方框是 ${big} 和 ${small} 的差，也就是小的数还要多少才能到大的数。`,
          ],
        );
      },
    ),
  ],
);

const partAndWholeBars = earlyTopic(
  "part-and-whole-bar-models",
  ["Part and Whole Bar Models", "部分与整体的线段图"],
  ["Read a bar model of a whole and its parts, and find the missing number.", "读表示整体和部分的线段图，求出缺少的数。"],
  ["word-problems-with-a-missing-part", "three-addend-word-problems"],
  ["1.OA.A.1", "1.OA.A.2"],
  [
    earlyPoint(
      "the-whole-from-its-parts",
      ["The whole from its parts", "由部分求整体"],
      [
        "A bar model is a picture of a story. The long bar on top is the whole, and the bar below is the same length, cut into parts. The numbers are written inside. If the long bar has the question mark, the parts are known. Add the parts together to find out what the whole is.",
        "线段图是故事的图画。上面的长条是整体，下面的长条一样长，但被切成了几部分。数写在长条里。如果问号在上面的长条里，说明两部分都知道，把它们加起来就得到整体。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 19 - a);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${name} has ${a} ${thing.en} in a bag and ${b} in a box. The bar model shows the story. How many ${thing.en} are there in all?`,
            `${name} 的袋子里有 ${a} ${thing.unit}${thing.zh}，盒子里有 ${b} ${thing.unit}。线段图表示这个故事。一共有多少${thing.unit}${thing.zh}？`,
          ],
          a + b,
          [Math.abs(a - b), a, b],
          [`The whole is made of the two parts, and $${a} + ${b} = ${a + b}$.`, `整体由两部分组成，$${a} + ${b} = ${a + b}$。`],
          partWholeBarFigure([a, b], -1),
        );
      },
    ),
    earlyPoint(
      "a-part-from-the-whole",
      ["A part from the whole", "由整体求部分"],
      [
        "When the question mark is in the cut bar, the whole and one part are known. Since the bars are the same length, the part you do not know is what is left after you take away the known part. So subtract. You can also count up from the part you know until you reach the whole.",
        "如果问号在切开的长条里，就是知道整体和一部分。因为两个长条一样长，不知道的部分就是从整体里去掉已知部分后剩下的。所以用减法。也可以从已知的部分往上数，一直数到整体。",
      ],
      (rng) => {
        const all = rng.int(8, 20);
        const a = rng.int(2, all - 2);
        const b = all - a;
        const hideFirst = rng.bool();
        const known = hideFirst ? b : a;
        const answer = hideFirst ? a : b;
        return whole(
          ["What number goes at the question mark?", "问号处应该填几？"],
          answer,
          [all + known, all, known],
          [
            `The whole is ${all} and one part is ${known}, and $${all} - ${known} = ${answer}$.`,
            `整体是 ${all}，一部分是 ${known}，$${all} - ${known} = ${answer}$。`,
          ],
          partWholeBarFigure([a, b], hideFirst ? 0 : 1),
        );
      },
    ),
    earlyPoint(
      "bars-with-three-parts",
      ["Bars with three parts", "有三部分的线段图"],
      [
        "A whole can have more than two parts. If all the parts are known, add them, and look for a pair that makes ten to help you. If one part is missing, add the parts you know, and then take that sum away from the whole. The bars still have the same length, so the numbers must balance.",
        "整体可以有不止两部分。如果每部分都知道，就把它们加起来，可以先找合起来是十的两个数。如果缺一部分，先把知道的部分加起来，再用整体减去这个和。两个长条还是一样长，所以数要对得上。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const c = rng.int(2, 6);
        const all = a + b + c;
        const hidden = rng.int(-1, 2);
        const answer = hidden === -1 ? all : ([a, b, c][hidden] as number);
        const known = [a, b, c].filter((_, i) => i !== hidden);
        return whole(
          ["What number goes at the question mark?", "问号处应该填几？"],
          answer,
          hidden === -1 ? [a + b, b + c, a + c] : [all, known[0]! + known[1]!, all - known[0]!],
          hidden === -1
            ? [`Add the three parts: $${a} + ${b} + ${c} = ${all}$.`, `把三部分加起来：$${a} + ${b} + ${c} = ${all}$。`]
            : [
                `The known parts make $${known[0]} + ${known[1]} = ${known[0]! + known[1]!}$, and $${all} - ${known[0]! + known[1]!} = ${answer}$.`,
                `已知的部分合起来是 $${known[0]} + ${known[1]} = ${known[0]! + known[1]!}$，$${all} - ${known[0]! + known[1]!} = ${answer}$。`,
              ],
          partWholeBarFigure([a, b, c], hidden),
        );
      },
    ),
  ],
);

const comparingBars = earlyTopic(
  "comparing-bars-in-stories",
  ["Comparing Bars in Stories", "用长条比较故事里的数"],
  ["Use two bars to solve stories about how many more or how many fewer.", "用两个长条解决多多少、少多少的故事。"],
  ["comparing-word-problems-within-20"],
  ["1.OA.A.1"],
  [
    earlyPoint(
      "the-gap-between-two-bars",
      ["The gap between two bars", "两个长条的差"],
      [
        "Line up two bars at the left, and the longer one sticks out past the shorter one. The part that sticks out is the difference. It tells how many more the longer bar has, and also how many fewer the shorter bar has. Those are two ways of asking about the same dashed piece, and the answer is the same.",
        "把两个长条的左端对齐，长的那个就会比短的多出一段。多出的这段就是差。它说明长条多多少，也说明短条少多少。这是用两种说法问同一段虚线，答案是一样的。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const big = rng.int(7, 20);
        const small = rng.int(2, big - 2);
        const swap = rng.bool();
        const fewer = rng.bool();
        const thing = rng.pick(earlyThings);
        const answer = big - small;
        return whole(
          fewer
            ? [
                `${p} has ${big} ${thing.en} and ${q} has ${small}. How many fewer does ${q} have than ${p}?`,
                `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 有 ${small} ${thing.unit}。${q} 比 ${p} 少多少${thing.unit}？`,
              ]
            : [
                `${p} has ${big} ${thing.en} and ${q} has ${small}. How many more does ${p} have than ${q}?`,
                `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 有 ${small} ${thing.unit}。${p} 比 ${q} 多多少${thing.unit}？`,
              ],
          answer,
          [big + small, big, small],
          [`The dashed piece is the difference, and $${big} - ${small} = ${answer}$.`, `虚线部分就是差，$${big} - ${small} = ${answer}$。`],
          compareBarsFigure(swap ? [q, p] : [p, q], swap ? [small, big] : [big, small], "gap"),
        );
      },
    ),
    earlyPoint(
      "the-longer-bar",
      ["Finding the longer bar", "求长的长条"],
      [
        "Sometimes you know the shorter bar and the piece that sticks out. The longer bar is the shorter bar plus that piece, so add them. The words more and fewer can trick you here, so look at the picture. If Ava has 3 more than Ben, then Ava's bar is the longer one.",
        "有时知道短的长条和多出的那段。长的长条就是短条加上这一段，所以要相加。“多”和“少”这两个字容易让人弄错，所以要看图。如果 Ava 比 Ben 多 3 个，Ava 的长条就是长的那个。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const small = rng.int(3, 13);
        const gap = rng.int(2, 7);
        const big = small + gap;
        const thing = rng.pick(earlyThings);
        const fewer = rng.bool();
        return whole(
          fewer
            ? [
                `${q} has ${small} ${thing.en}. That is ${gap} fewer than ${p}. How many ${thing.en} does ${p} have?`,
                `${q} 有 ${small} ${thing.unit}${thing.zh}，比 ${p} 少 ${gap} ${thing.unit}。${p} 有多少${thing.unit}${thing.zh}？`,
              ]
            : [
                `${q} has ${small} ${thing.en}. ${p} has ${gap} more than ${q}. How many ${thing.en} does ${p} have?`,
                `${q} 有 ${small} ${thing.unit}${thing.zh}，${p} 比 ${q} 多 ${gap} ${thing.unit}。${p} 有多少${thing.unit}${thing.zh}？`,
              ],
          big,
          [small - gap, gap, small],
          [
            `${p}'s bar is ${q}'s bar and ${gap} more, and $${small} + ${gap} = ${big}$.`,
            `${p} 的长条是 ${q} 的长条再多 ${gap}，$${small} + ${gap} = ${big}$。`,
          ],
          compareBarsFigure([p, q], [big, small], "first"),
        );
      },
    ),
    earlyPoint(
      "the-shorter-bar",
      ["Finding the shorter bar", "求短的长条"],
      [
        "If you know the longer bar and the piece that sticks out, you can find the shorter bar. Remove that piece from the longer bar, and what remains is the shorter bar. So subtract. Even if the story says more, you may still need to subtract, because you are looking for the smaller amount.",
        "知道长的长条和多出的那段，就能求短的长条。从长条上去掉多出的那段，剩下的就是短条。所以用减法。即使故事里说的是“多”，也可能要做减法，因为要求的是小的那个数。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const big = rng.int(8, 20);
        const gap = rng.int(2, big - 3);
        const small = big - gap;
        const thing = rng.pick(earlyThings);
        const more = rng.bool();
        return whole(
          more
            ? [
                `${p} has ${big} ${thing.en}. That is ${gap} more than ${q}. How many ${thing.en} does ${q} have?`,
                `${p} 有 ${big} ${thing.unit}${thing.zh}，比 ${q} 多 ${gap} ${thing.unit}。${q} 有多少${thing.unit}${thing.zh}？`,
              ]
            : [
                `${p} has ${big} ${thing.en}. ${q} has ${gap} fewer than ${p}. How many ${thing.en} does ${q} have?`,
                `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 比 ${p} 少 ${gap} ${thing.unit}。${q} 有多少${thing.unit}${thing.zh}？`,
              ],
          small,
          [big + gap, gap, big],
          [
            `${q}'s bar is ${p}'s bar without the extra ${gap}, and $${big} - ${gap} = ${small}$.`,
            `${q} 的长条是 ${p} 的长条去掉多出的 ${gap}，$${big} - ${gap} = ${small}$。`,
          ],
          compareBarsFigure([p, q], [big, small], "second"),
        );
      },
    ),
  ],
);

const addingOnesToTwoDigits = earlyTopic(
  "adding-ones-to-two-digit-numbers",
  ["Adding Ones to Two-Digit Numbers", "两位数加一位数"],
  ["Add a one-digit number to a two-digit number, with and without making a new ten.", "两位数加一位数，包括不进位和要凑成新十的情况。"],
  ["adding-tens-to-two-digit-numbers", "making-ten-to-add"],
  ["1.NBT.C.4"],
  [
    earlyPoint(
      "adding-squares-to-blocks",
      ["Adding squares to blocks", "给积木添上小方块"],
      [
        "When you add a one-digit number to a two-digit number, the tens stay put as long as the ones do not reach ten. Add the ones to the ones, and then read the rods and squares together. Do not add the small number to the tens, because a small square is not worth as much as a rod.",
        "两位数加一位数时，只要个位加起来不满十，十就不变。把一和一相加，再把长条和小方块一起读出来。不要把一位数加到十上，因为小方块不如长条值钱。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(1, 7);
        const add = rng.int(1, 9 - ones);
        const n = 10 * tens + ones;
        return whole(
          [
            `The top row shows ${n} and the bottom row shows ${add}. What is $${n} + ${add}$?`,
            `上面一排表示 ${n}，下面一排表示 ${add}。$${n} + ${add}$ 等于多少？`,
          ],
          n + add,
          [n + 10 * add, tens + ones + add, n - add],
          [
            `The ones make $${ones} + ${add} = ${ones + add}$, and the ${many(tens, "ten")} stay, so the sum is ${n + add}.`,
            `个位是 $${ones} + ${add} = ${ones + add}$，${tens} 个十不变，所以和是 ${n + add}。`,
          ],
          blockRowsFigure([
            [0, tens, ones],
            [0, 0, add],
          ]),
        );
      },
    ),
    earlyPoint(
      "jumping-to-the-next-ten",
      ["Jumping to the next ten", "先跳到下一个十"],
      [
        "If the ones go past ten, make two jumps. The first jump lands on the next round number, and the second jump adds the rest. To find $27 + 5$, jump 3 to reach 30. There are 2 left of the 5, so jump 2 more to reach 32. Splitting the small number this way makes the adding easy.",
        "如果个位超过十，就跳两次。第一跳落在下一个整十数上，第二跳加上剩下的数。求 $27 + 5$，先跳 3 到 30。5 还剩 2，再跳 2 到 32。这样把小的数分开，加起来就容易了。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(4, 9);
        const add = rng.int(11 - ones, 9);
        const n = 10 * tens + ones;
        const next = 10 * (tens + 1);
        const answer = n + add;
        return whole(
          [`The jumps show $${n} + ${add}$. Where do they end?`, `这些跳表示 $${n} + ${add}$。最后跳到哪个数？`],
          answer,
          [answer - 10, next, answer + 10, next + add],
          [
            `The first jump of ${next - n} reaches ${next}, and the rest of the ${add} is ${answer - next}, which reaches ${answer}.`,
            `第一跳 ${next - n} 到 ${next}，${add} 还剩 ${answer - next}，再跳就到 ${answer}。`,
          ],
          hopsFigure([n, next, answer], true),
        );
      },
    ),
    earlyPoint(
      "adding-past-a-ten-in-your-head",
      ["Adding past a ten in your head", "心算跨过整十"],
      [
        "Now try it without a picture. Look at the ones digit and think of what makes ten with it. Take that much from the number you are adding, so the two-digit number becomes a round one. Then add what is left. A common mistake is forgetting that the tens digit goes up by one.",
        "现在不看图试一试。看看个位，想一想它和几合起来是十。从要加的数里拿出这么多，两位数就变成整十数了。再加上剩下的。常见的错误是忘了十位要增加 1。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(3, 9);
        const add = rng.int(11 - ones, 9);
        const n = 10 * tens + ones;
        const answer = n + add;
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const story = rng.bool();
        return whole(
          story
            ? [
                `${name} has ${n} ${thing.en} and gets ${add} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}，又得到 ${add} ${thing.unit}。现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [`What is $${n} + ${add}$?`, `$${n} + ${add}$ 等于多少？`],
          answer,
          [answer - 10, n + 10 * add, 10 * tens + ((ones + add) % 10)],
          [
            `$${n} + ${10 - ones} = ${n + 10 - ones}$, and adding the other ${add - 10 + ones} gives ${answer}.`,
            `$${n} + ${10 - ones} = ${n + 10 - ones}$，再加上剩下的 ${add - 10 + ones}，得 ${answer}。`,
          ],
        );
      },
    ),
  ],
);

const addingTwoDigitsWithBlocks = earlyTopic(
  "adding-two-digit-numbers-with-blocks",
  ["Adding Two-Digit Numbers With Blocks", "用积木做两位数加法"],
  ["Add two two-digit numbers by adding tens to tens and ones to ones.", "两位数相加，十和十相加，一和一相加。"],
  ["adding-ones-to-two-digit-numbers"],
  ["1.NBT.C.4"],
  [
    earlyPoint(
      "putting-blocks-together",
      ["Putting blocks together", "把积木合起来"],
      [
        "To add two numbers shown in blocks, push the two rows together. Count all the rods to find the tens, and all the small squares to find the ones. Then read the number. Rods go with rods and squares go with squares, as you can only add things of the same kind in this simple way.",
        "两排积木相加，就把它们合在一起。数所有的长条得到十，数所有的小方块得到一。然后读出这个数。长条和长条相加，小方块和小方块相加，因为相同的东西才能这样直接相加。",
      ],
      (rng) => {
        const t1 = rng.int(1, 5);
        const t2 = rng.int(1, 4);
        const o1 = rng.int(0, 6);
        const o2 = rng.int(1, 9 - o1);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        return whole(
          [`The blocks show ${a} and ${b}. What is $${a} + ${b}$?`, `这些积木表示 ${a} 和 ${b}。$${a} + ${b}$ 等于多少？`],
          a + b,
          [t1 + t2 + o1 + o2, a + o2, a + 10 * t2],
          [
            `There are $${t1} + ${t2} = ${t1 + t2}$ tens and $${o1} + ${o2} = ${o1 + o2}$ ones, which is ${a + b}.`,
            `十有 $${t1} + ${t2} = ${t1 + t2}$ 个，一有 $${o1} + ${o2} = ${o1 + o2}$ 个，合起来是 ${a + b}。`,
          ],
          blockRowsFigure([
            [0, t1, o1],
            [0, t2, o2],
          ]),
        );
      },
    ),
    earlyPoint(
      "tens-first-and-then-ones",
      ["Tens first and then ones", "先加十，再加一"],
      [
        "You can add two-digit numbers in your head by splitting them. Add the tens to get a round number. Then add the ones to get a small number. Finally, put the two results together. For example, $34 + 25$ is 50 and 9, which makes 59. Writing the tens and ones apart can help you keep them straight.",
        "两位数相加可以拆开来心算。先把十加起来，得到一个整十数。再把一加起来，得到一个小的数。最后把两个结果合起来。比如 $34 + 25$，是 50 和 9，合起来是 59。把十和一分开写，就不容易弄混。",
      ],
      (rng) => {
        const t1 = rng.int(1, 6);
        const t2 = rng.int(1, 8 - t1);
        const o1 = rng.int(1, 7);
        const o2 = rng.int(1, 9 - o1);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        return whole(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          a + b,
          [10 * (t1 + t2), o1 + o2, a + b + 10, Math.abs(a - b)],
          [
            `The tens make ${10 * (t1 + t2)} and the ones make ${o1 + o2}, and together they are ${a + b}.`,
            `十加起来是 ${10 * (t1 + t2)}，一加起来是 ${o1 + o2}，合起来是 ${a + b}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "making-a-new-ten-from-the-squares",
      ["Making a new ten from the squares", "用小方块凑成新的十"],
      [
        "Sometimes the small squares add up to ten or more. Then you can bundle ten of them into a new rod. So you get one more ten than the rods alone show, and fewer ones. For example, $27 + 15$ has 3 rods and 12 squares, which is 4 tens and 2 ones, or 42.",
        "有时小方块加起来满了十。这时可以把十个小方块捆成一根新的长条。所以十会比原来的长条多一个，一会变少。比如 $27 + 15$，有 3 根长条和 12 个小方块，也就是 4 个十和 2 个一，等于 42。",
      ],
      (rng) => {
        const t1 = rng.int(1, 4);
        const t2 = rng.int(1, 4);
        const o1 = rng.int(3, 9);
        const o2 = rng.int(10 - o1, 9);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        const answer = a + b;
        const noTrade = 10 * (t1 + t2) + ((o1 + o2) % 10);
        return whole(
          [`The blocks show ${a} and ${b}. What is $${a} + ${b}$?`, `这些积木表示 ${a} 和 ${b}。$${a} + ${b}$ 等于多少？`],
          answer,
          [noTrade, Number(`${t1 + t2}${o1 + o2}`), t1 + t2 + o1 + o2],
          [
            `There are ${t1 + t2} rods and ${o1 + o2} squares. Ten squares make a new rod, so the sum is ${many(t1 + t2 + 1, "ten")} and ${many(o1 + o2 - 10, "one")}, which is ${answer}.`,
            `有 ${t1 + t2} 根长条和 ${o1 + o2} 个小方块。十个小方块换成一根新的长条，所以是 ${t1 + t2 + 1} 个十和 ${o1 + o2 - 10} 个一，等于 ${answer}。`,
          ],
          blockRowsFigure([
            [0, t1, o1],
            [0, t2, o2],
          ]),
        );
      },
    ),
  ],
);

/** measuredThings are objects to measure with small units, each with a Chinese measure word. */
const measuredThings: readonly Pair[] = [
  ["pencil", "这支铅笔"],
  ["ribbon", "这条丝带"],
  ["crayon box", "这个蜡笔盒"],
  ["paintbrush", "这支画笔"],
  ["ruler case", "这个尺子盒"],
  ["jump rope", "这根跳绳"],
];

const measuringWithNoGaps = earlyTopic(
  "measuring-with-no-gaps",
  ["Measuring With No Gaps", "没有空隙地测量"],
  ["Lay equal units end to end, with no gaps or overlaps, to measure a length.", "把相同的单位首尾相接地摆放来测量，不留空隙，也不重叠。"],
  ["measuring-with-non-standard-units"],
  ["1.MD.A.2"],
  [
    earlyPoint(
      "which-row-is-measured-right",
      ["Which row is measured right", "哪一行量得对"],
      [
        "Measuring with small blocks only works when you follow the rules. Start exactly at the end of the thing you are measuring. Put the blocks edge to edge, so there are no gaps between them and none on top of each other. Keep going until you reach the other end. Then the number of blocks is the length.",
        "用小方块测量要遵守规则。从要量的东西的一端开始。方块要一个挨一个地摆，中间不留空隙，也不要叠在一起。一直摆到另一端。这时方块的个数才是长度。",
      ],
      (rng) => {
        const length = rng.int(5, 8);
        const labels = ["A", "B", "C", "D"];
        const ways = rng.shuffle<BarMeasure>(["good", "gaps", "overlap", "late"]);
        const at = ways.indexOf("good");
        const name = (i: number): Pair => [`Row ${labels[i]}`, `${labels[i]} 行`];
        return choose(
          rng,
          ["In which row are the blocks laid correctly to measure the bar?", "哪一行的方块摆得对，可以用来测量长条？"],
          name(at),
          [0, 1, 2, 3].filter((i) => i !== at).map(name),
          [
            `In Row ${labels[at]} the blocks start at the end of the bar and touch edge to edge. The others have gaps, overlaps or a late start.`,
            `${labels[at]} 行的方块从长条的一端开始，一个挨一个。其他几行有空隙、有重叠，或者没有从一端开始。`,
          ],
          measuredBarsFigure(labels, ways, length),
        );
      },
    ),
    earlyPoint(
      "what-went-wrong",
      ["What went wrong", "哪里错了"],
      [
        "When a measurement looks wrong, find out what happened. Gaps between blocks make the count too small. Blocks on top of each other make the count too big. Starting away from the end of the bar leaves part of it unmeasured. Knowing these mistakes helps you to avoid them when you measure things yourself.",
        "测量看起来不对时，要找出哪里错了。方块之间有空隙，数出来就太少。方块叠在一起，数出来就太多。没有从长条的一端开始，就有一段没有量到。知道这些错误，自己测量时就能避免。",
      ],
      (rng) => {
        const length = rng.int(4, 9);
        const way = rng.pick<BarMeasure>(["gaps", "overlap", "late"]);
        const answers: Record<string, Pair> = {
          gaps: ["There are gaps between the blocks", "方块之间有空隙"],
          overlap: ["The blocks lie on top of each other", "方块叠在一起了"],
          late: ["The blocks do not start at the end of the bar", "方块没有从长条的一端开始"],
        };
        const correct = answers[way] as Pair;
        const thing = rng.pick(measuredThings);
        const sameSize: Pair = ["The blocks are all the same size", "方块都一样大"];
        const wrong = [answers.gaps as Pair, answers.overlap as Pair, answers.late as Pair, sameSize].filter((o) => o !== correct);
        return choose(
          rng,
          [
            `Someone used these blocks to measure a ${thing[0]}, shown as the bar. What went wrong?`,
            `有人用这些方块测量${thing[1]}，长条代表它。哪里错了？`,
          ],
          correct,
          wrong,
          way === "gaps"
            ? ["The picture shows spaces between the blocks, and those spaces are not counted.", "图上方块之间有空隙，这些空隙没有算进去。"]
            : way === "overlap"
              ? [
                  "The picture shows blocks lying on top of each other, so some length is counted twice.",
                  "图上方块叠在一起，有的长度被算了两次。",
                ]
              : [
                  "The first block starts past the end of the bar, so the first part is not measured.",
                  "第一个方块没有从长条的一端开始，所以前面一段没有量到。",
                ],
          measuredBarsFigure(["A"], [way], length),
        );
      },
    ),
    earlyPoint(
      "the-length-in-blocks",
      ["The length in blocks", "用方块表示长度"],
      [
        "Once the blocks are laid out correctly, count them. The count, along with the name of the unit, is the length. You must say which unit you used, since 6 paper clips and 6 erasers are not the same length. A longer bar needs more blocks of the same size to go all the way along it.",
        "方块摆对了，就数一数。数出的个数，加上单位的名称，就是长度。一定要说明用的是什么单位，因为 6 个回形针和 6 块橡皮并不一样长。长条越长，需要的相同方块就越多。",
      ],
      (rng) => {
        const length = rng.int(4, 9);
        const thing = rng.pick(measuredThings);
        const unit = rng.pick<Pair>([
          ["paper clips", "个回形针"],
          ["erasers", "块橡皮"],
          ["cubes", "个小方块"],
          ["sticks", "根小棒"],
        ]);
        return whole(
          [
            `The bar is a ${thing[0]}. Each block under it is one of the ${unit[0]} laid end to end. How many ${unit[0]} long is it?`,
            `长条代表${thing[1]}。下面的每个方块代表一个单位（${unit[1].slice(1)}），首尾相接地摆放。它有多少${unit[1]}长？`,
          ],
          length,
          [length * 2, length - 2],
          [
            `Counting the blocks from one end of the bar to the other gives ${length} ${unit[0]}.`,
            `从长条的一端数到另一端，一共是 ${length} ${unit[1]}。`,
          ],
          measuredBarsFigure([""], ["good"], length),
        );
      },
    ),
  ],
);

const digitalClocks = earlyTopic(
  "digital-clocks",
  ["Digital Clocks", "电子钟"],
  ["Read digital clocks to the hour and half hour, and match them to clocks with hands.", "读电子钟的整点和半点，并和带指针的钟对应起来。"],
  ["telling-time-to-the-half-hour"],
  ["1.MD.B.3"],
  [
    earlyPoint(
      "reading-a-digital-clock",
      ["Reading a digital clock", "读电子钟"],
      [
        "A digital clock writes the time in numbers. The number before the two dots is the hour, and the number after them is the minutes. When it shows :00, it is exactly that hour, so 4:00 is 4 o'clock. When it shows :30, the hour is half over, so 4:30 is half past 4.",
        "电子钟用数字写出时间。两点前面的数是小时，后面的数是分钟。显示 :00 时正好是整点，所以 4:00 是 4 点。显示 :30 时，这个小时过了一半，所以 4:30 是 4 点半。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const next = clockHour(h + 1);
        const say = (a: number, b: boolean): Pair => (b ? [`half past ${a}`, `${a} 点半`] : [`${a} o'clock`, `${a} 点`]);
        const correct = say(h, half);
        return choose(
          rng,
          ["What time does this clock show?", "这个钟显示的是什么时间？"],
          correct,
          rng.shuffle([say(h, !half), say(next, half), say(next, !half), say(clockHour(h - 1), half)]),
          [
            `The hour is ${h} and the minutes are ${half ? "30, which is half past" : "00, which means exactly on the hour"}.`,
            `小时是 ${h}，分钟是 ${half ? "30，也就是半点" : "00，也就是整点"}。`,
          ],
          digitalClockFigure(h, half ? 30 : 0),
        );
      },
    ),
    earlyPoint(
      "from-hands-to-digits",
      ["From hands to digits", "从指针到数字"],
      [
        "To write the time on a clock with hands, read the short hand and then the long hand. If the long hand is on the 12, write :00. If it is on the 6, write :30. At half past, the short hand sits between two numbers. Use the number it has already passed, not the one it is coming to.",
        "要写出带指针的钟表示的时间，先读短针，再读长针。长针指着 12，就写 :00。长针指着 6，就写 :30。半点时，短针在两个数中间。要用它已经走过的那个数，而不是快要走到的那个数。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const m = half ? 30 : 0;
        const next = clockHour(h + 1);
        const prev = clockHour(h - 1);
        return choose(
          rng,
          ["Which digital time matches this clock?", "哪个电子钟时间和这个钟相同？"],
          [clockText(h, m), clockText(h, m)],
          rng
            .shuffle([
              clockText(next, m),
              clockText(h, half ? 0 : 30),
              clockText(prev, m),
              clockText(next, half ? 0 : 30),
              half ? clockText(h, 6) : clockText(h, 12),
            ])
            .map((s): Pair => [s, s]),
          half
            ? [
                `The long hand is on the 6, which means 30 minutes, and the short hand has passed the ${h}.`,
                `长针指着 6，表示 30 分，短针已经走过了 ${h}。`,
              ]
            : [
                `The long hand is on the 12, which means 00 minutes, and the short hand is on the ${h}.`,
                `长针指着 12，表示 00 分，短针指着 ${h}。`,
              ],
          clockFigure(h, m),
        );
      },
    ),
    earlyPoint(
      "where-the-hands-are-at-a-digital-time",
      ["Where the hands are at a digital time", "电子钟的时间对应的指针位置"],
      [
        "You can picture the hands from a digital time. At 7:00, the long hand points to 12 and the short hand points exactly at 7. At 7:30, the long hand points to 6, and the short hand has moved halfway from 7 to 8. Both hands move all the time, so it does not stay on the number.",
        "看电子钟的时间，可以想出指针的位置。7:00 时，长针指着 12，短针正好指着 7。7:30 时，长针指着 6，短针走到 7 和 8 的中间。两根针一直在走，所以短针不会停在数字上。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const next = clockHour(h + 1);
        const time = clockText(h, half ? 30 : 0);
        const askShort = rng.bool();
        if (askShort) {
          const on = (n: number): Pair => [`Exactly on the ${n}`, `正好指着 ${n}`];
          const between = (a: number, b: number): Pair => [`Halfway between the ${a} and the ${b}`, `在 ${a} 和 ${b} 的正中间`];
          return choose(
            rng,
            [`At ${time}, where does the short hand point?`, `${time} 时，短针指在哪里？`],
            half ? between(h, next) : on(h),
            half ? [on(h), on(next), between(clockHour(h - 1), h)] : [between(h, next), on(next), between(clockHour(h - 1), h)],
            half
              ? [`At half past, the short hand is halfway to the next number.`, `半点时，短针走到下一个数的半路上。`]
              : [`Exactly on the hour, the short hand points at the hour.`, `整点时，短针正好指着这个小时数。`],
          );
        }
        const pointTo = (n: number): Pair => [`It points to the ${n}`, `指着 ${n}`];
        const hand = half ? 6 : 12;
        return choose(
          rng,
          [`At ${time}, where does the long hand point?`, `${time} 时，长针指在哪里？`],
          pointTo(hand),
          [half ? pointTo(12) : pointTo(6), pointTo(h === 6 || h === 12 ? 3 : h), pointTo(next === 6 || next === 12 ? 9 : next)],
          half
            ? [`30 minutes is half way around the clock, so the long hand is on the 6.`, `30 分是走了半圈，所以长针指着 6。`]
            : [`00 minutes means the long hand is at the top, on the 12.`, `00 分表示长针在最上面，指着 12。`],
        );
      },
    ),
  ],
);

const hourAndHalfHourLater = earlyTopic(
  "an-hour-or-half-hour-later",
  ["An Hour or Half Hour Later", "过一小时或半小时"],
  [
    "Tell the time one hour or half an hour before or after a time shown on a clock.",
    "说出钟面上的时间过一小时或半小时后，以及早一小时或半小时的时间。",
  ],
  ["digital-clocks"],
  ["1.MD.B.3"],
  [
    earlyPoint(
      "one-hour-later",
      ["One hour later or earlier", "过一小时和早一小时"],
      [
        "In one hour, the long hand goes all the way around and comes back to where it started. The short hand moves on to the next number. So one hour after 3:30 is 4:30: the hour changes and the minutes stay. One hour earlier, the hour goes back by one. After 12 comes 1.",
        "过一小时，长针正好走一圈，回到原来的位置。短针走到下一个数。所以 3:30 过一小时是 4:30：小时变了，分钟不变。早一小时，小时就少 1。12 点之后是 1 点。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const m = rng.pick([0, 30]);
        const later = rng.bool();
        const target = clockHour(later ? h + 1 : h - 1);
        const opposite = clockHour(later ? h - 1 : h + 1);
        return choose(
          rng,
          [
            `What time is ${later ? "one hour after" : "one hour before"} the time on this clock?`,
            `${later ? "这个钟上的时间过一小时是几点？" : "比这个钟上的时间早一小时是几点？"}`,
          ],
          [clockText(target, m), clockText(target, m)],
          [clockText(opposite, m), clockText(h, m === 0 ? 30 : 0), clockText(target, m === 0 ? 30 : 0)].map((s): Pair => [s, s]),
          [
            `The clock shows ${clockText(h, m)}. The minutes stay the same and the hour ${later ? "goes on" : "goes back"} by one, which gives ${clockText(target, m)}.`,
            `钟上是 ${clockText(h, m)}。分钟不变，小时${later ? "多" : "少"} 1，所以是 ${clockText(target, m)}。`,
          ],
          clockFigure(h, m),
        );
      },
    ),
    earlyPoint(
      "half-an-hour-later",
      ["Half an hour later", "过半小时"],
      [
        "In half an hour, the long hand goes halfway around. From the 12 it moves to the 6, and from the 6 it moves back up to the 12. So half an hour after 5:00 is 5:30, and half an hour after 5:30 is 6:00. Watch out, because in that second case the hour changes too.",
        "过半小时，长针走半圈。它从 12 走到 6，又从 6 走回到 12。所以 5:00 过半小时是 5:30，5:30 过半小时是 6:00。要注意，第二种情况下小时也变了。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const target = half ? clockText(clockHour(h + 1), 0) : clockText(h, 30);
        const wrong = half
          ? [clockText(h, 0), clockText(clockHour(h + 1), 30), clockText(clockHour(h - 1), 30), clockText(h, 30)]
          : [clockText(clockHour(h + 1), 0), clockText(clockHour(h + 1), 30), clockText(clockHour(h - 1), 30), clockText(h, 0)];
        return choose(
          rng,
          ["What time is half an hour after the time on this clock?", "这个钟上的时间过半小时是几点？"],
          [target, target],
          rng.shuffle(wrong).map((s): Pair => [s, s]),
          half
            ? [
                `From ${clockText(h, 30)}, the long hand goes on from the 6 to the 12, and the hour changes to the next one: ${target}.`,
                `从 ${clockText(h, 30)} 开始，长针从 6 走到 12，小时变成下一个：${target}。`,
              ]
            : [
                `From ${clockText(h, 0)}, the long hand goes from the 12 to the 6: ${target}.`,
                `从 ${clockText(h, 0)} 开始，长针从 12 走到 6：${target}。`,
              ],
          clockFigure(h, half ? 30 : 0),
        );
      },
    ),
    earlyPoint(
      "how-long-something-takes",
      ["How long something takes", "用了多长时间"],
      [
        "To find when something ends, start with the time it begins and move forward by how long it lasts. One hour moves the short hand on by a number. Half an hour moves the long hand halfway around. If something lasts for two hours, just add one hour twice. The minutes stay the same each time.",
        "要知道一件事什么时候结束，就从开始的时间往后推，推的时间就是它用的时间。过一小时，短针走一个数。过半小时，长针走半圈。如果用了两小时，就过两次一小时，每次分钟都不变。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const m = rng.pick([0, 30]);
        const name = rng.pick(earlyNames);
        const job = rng.pick<Pair>([
          ["soccer practice", "踢足球"],
          ["a movie", "看电影"],
          ["a piano lesson", "上钢琴课"],
          ["a birthday party", "参加生日聚会"],
          ["a swimming class", "上游泳课"],
        ]);
        const hours = rng.int(1, 2);
        const target = clockText(h + hours, m);
        return choose(
          rng,
          [
            `${name} starts ${job[0]} at ${clockText(h, m)}. It lasts ${hours} ${hours === 1 ? "hour" : "hours"}. When does it end?`,
            `${name} ${clockText(h, m)} 开始${job[1]}，一共 ${hours} 小时。什么时候结束？`,
          ],
          [target, target],
          [
            clockText(h + hours + 1, m),
            clockText(h, m === 0 ? 30 : 0),
            clockText(h + hours, m === 0 ? 30 : 0),
            clockText(h + 1, m === 0 ? 30 : 0),
          ]
            .filter((s) => s !== target)
            .map((s): Pair => [s, s]),
          [
            `${hours} ${hours === 1 ? "hour" : "hours"} after ${clockText(h, m)} is ${target}. The minutes stay the same.`,
            `${clockText(h, m)} 过 ${hours} 小时是 ${target}，分钟不变。`,
          ],
        );
      },
    ),
  ],
);

const coinsEn = { 1: ["penny", "pennies"], 5: ["nickel", "nickels"], 10: ["dime", "dimes"], 25: ["quarter", "quarters"] } as const;

const firstCoins = earlyTopic(
  "first-coins",
  ["First Coins", "认识硬币"],
  [
    "Know what pennies, nickels and dimes are worth, and count coins of one kind.",
    "知道 1 美分、5 美分和 10 美分硬币的面值，并能数同一种硬币。",
  ],
  ["counting-groups-of-ten"],
  [],
  [
    earlyPoint(
      "counting-coins-of-one-kind",
      ["Counting coins of one kind", "数同一种硬币"],
      [
        "A penny is worth 1 cent, a nickel is worth 5 cents, and a dime is worth 10 cents. To count coins of one kind, count by what each coin is worth. Count pennies by ones, nickels by fives, and dimes by tens. The number of coins is not the same as the number of cents.",
        "1 美分硬币值 1 美分，5 美分硬币值 5 美分，10 美分硬币值 10 美分。数同一种硬币，就按每枚的面值来数：1 美分硬币一个一个地数，5 美分硬币五个五个地数，10 美分硬币十个十个地数。硬币的枚数不等于美分数。",
      ],
      (rng) => {
        const v = rng.pick<1 | 5 | 10>([1, 5, 10]);
        const n = rng.int(2, 9);
        const name = rng.pick(earlyNames);
        return whole(
          [`${name} has these coins. How many cents is that?`, `${name} 有这些硬币。一共是多少美分？`],
          n * v,
          [n, n * (v === 10 ? 5 : 10), n + v],
          [
            `Counting ${n} coins by ${v === 1 ? "ones" : v === 5 ? "fives" : "tens"} reaches ${n * v} cents.`,
            `${n} 枚硬币，每枚 ${v} 美分，${v === 1 ? "一个一个" : v === 5 ? "五个五个" : "十个十个"}地数，数到 ${n * v} 美分。`,
          ],
          coinsFigure(Array<number>(n).fill(v)),
        );
      },
    ),
    earlyPoint(
      "which-coins-are-worth-more",
      ["Which coins are worth more", "哪些硬币更值钱"],
      [
        "More coins do not always mean more money. Three dimes are worth 30 cents, but ten pennies are worth only 10 cents. To compare two groups of coins, find out how many cents each group is worth. Then compare those two numbers, just as you would compare any other two numbers you meet.",
        "硬币多不一定钱多。3 枚 10 美分硬币值 30 美分，10 枚 1 美分硬币只值 10 美分。要比较两组硬币，先算出每组值多少美分，再比较这两个数，就像比较别的数一样。",
      ],
      (rng) => {
        const pick = () => ({ v: rng.pick<1 | 5 | 10>([1, 5, 10]), n: rng.int(2, 9) });
        const a = pick();
        let b = pick();
        while (a.v * a.n === b.v * b.n || a.v === b.v) b = { v: rng.pick<1 | 5 | 10>(a.v === 10 ? [1, 5] : [10]), n: rng.int(2, 9) };
        const say = (c: { v: 1 | 5 | 10; n: number }): Pair => [`${c.n} ${coinsEn[c.v][1]}`, `${c.n} 枚 ${c.v} 美分硬币`];
        const big = a.v * a.n > b.v * b.n ? a : b;
        const small = big === a ? b : a;
        const correct = say(big);
        return choose(
          rng,
          ["Which group of coins is worth more?", "哪一组硬币更值钱？"],
          correct,
          [say(small), ["They are worth the same", "两组一样值钱"]],
          [
            `${correct[0]} make ${big.v * big.n} cents, and ${say(small)[0]} make ${small.v * small.n} cents.`,
            `${correct[1]}值 ${big.v * big.n} 美分，${say(small)[1]}值 ${small.v * small.n} 美分。`,
          ],
        );
      },
    ),
    earlyPoint(
      "the-same-value-in-other-coins",
      ["The same value in other coins", "用别的硬币表示同样的钱"],
      [
        "Coins can be traded for others of the same value. A nickel is the same as 5 pennies, a dime is the same as 10 pennies, and a dime is also the same as 2 nickels. To trade, find how many cents you have, and count how many of the new coins it takes to reach that many cents.",
        "硬币可以换成同样面值的别的硬币。1 枚 5 美分硬币等于 5 枚 1 美分硬币，1 枚 10 美分硬币等于 10 枚 1 美分硬币，也等于 2 枚 5 美分硬币。要换硬币，先算出有多少美分，再数一数要多少枚新硬币才能到这么多美分。",
      ],
      (rng) => {
        const form = rng.int(0, 2);
        const n = rng.int(2, 9);
        const name = rng.pick(earlyNames);
        if (form === 0)
          return whole(
            [
              `${name} trades ${n} nickels for pennies. How many pennies does ${name} get?`,
              `${name} 用 ${n} 枚 5 美分硬币换 1 美分硬币。能换多少枚？`,
            ],
            5 * n,
            [n, 10 * n, n + 5],
            [
              `${n} nickels are worth ${5 * n} cents, which is ${5 * n} pennies.`,
              `${n} 枚 5 美分硬币值 ${5 * n} 美分，也就是 ${5 * n} 枚 1 美分硬币。`,
            ],
          );
        if (form === 1)
          return whole(
            [
              `${name} trades ${n} dimes for pennies. How many pennies does ${name} get?`,
              `${name} 用 ${n} 枚 10 美分硬币换 1 美分硬币。能换多少枚？`,
            ],
            10 * n,
            [n, 5 * n, n + 10],
            [
              `${n} dimes are worth ${10 * n} cents, which is ${10 * n} pennies.`,
              `${n} 枚 10 美分硬币值 ${10 * n} 美分，也就是 ${10 * n} 枚 1 美分硬币。`,
            ],
          );
        return whole(
          [
            `${name} trades ${n} dimes for nickels. How many nickels does ${name} get?`,
            `${name} 用 ${n} 枚 10 美分硬币换 5 美分硬币。能换多少枚？`,
          ],
          2 * n,
          [n, 10 * n, 5 * n],
          [`Each dime is worth 2 nickels, and ${n} twos make ${2 * n}.`, `每枚 10 美分硬币能换 2 枚 5 美分硬币，${n} 个 2 是 ${2 * n}。`],
        );
      },
    ),
  ],
);

const dimesAndPennies = earlyTopic(
  "dimes-and-pennies",
  ["Dimes and Pennies", "10 美分和 1 美分硬币"],
  ["Use dimes and pennies as tens and ones to count and make amounts of money.", "把 10 美分和 1 美分硬币看成十和一，来数钱和凑钱。"],
  ["first-coins", "ten-ones-make-a-ten"],
  ["1.NBT.B.2"],
  [
    earlyPoint(
      "counting-dimes-and-pennies",
      ["Counting dimes and pennies", "数 10 美分和 1 美分硬币"],
      [
        "Dimes work like tens and pennies work like ones. To count a mix of them, count the dimes by tens first, and then count on by ones for the pennies. So 3 dimes and 4 pennies are 10, 20, 30, 31, 32, 33, 34 cents. The digits tell you how many of each coin you have.",
        "10 美分硬币就像十，1 美分硬币就像一。数混在一起的这两种硬币，先把 10 美分硬币十个十个地数，再把 1 美分硬币一个一个地接着数。所以 3 枚 10 美分和 4 枚 1 美分是 10、20、30、31、32、33、34 美分。这个数的数字告诉你每种硬币有几枚。",
      ],
      (rng) => {
        const d = rng.int(1, 6);
        const p = rng.int(1, 7);
        return whole(
          ["How many cents are these coins worth?", "这些硬币一共值多少美分？"],
          10 * d + p,
          [d + p, 10 * p + d, 10 * d],
          [
            `${d} ${d === 1 ? "dime makes" : "dimes make"} ${10 * d} cents, and ${p} pennies more make ${10 * d + p} cents.`,
            `${d} 枚 10 美分硬币是 ${10 * d} 美分，再加 ${p} 枚 1 美分硬币，是 ${10 * d + p} 美分。`,
          ],
          coinsFigure(rng.shuffle([...Array<number>(d).fill(10), ...Array<number>(p).fill(1)])),
        );
      },
    ),
    earlyPoint(
      "making-an-amount-with-the-fewest-coins",
      ["Making an amount with the fewest coins", "用最少的硬币凑钱"],
      [
        "To make an amount with the fewest dimes and pennies, use as many dimes as you can. The tens digit tells how many dimes you need, and the ones digit tells how many pennies you need. So 47 cents is 4 dimes and 7 pennies. Using more pennies also works, but it takes many more coins.",
        "要用最少的 10 美分和 1 美分硬币凑钱，就尽量多用 10 美分硬币。十位告诉你要几枚 10 美分硬币，个位告诉你要几枚 1 美分硬币。所以 47 美分是 4 枚 10 美分和 7 枚 1 美分。多用 1 美分硬币也可以，只是硬币要多得多。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const p = rng.int(1, 9);
        const n = 10 * d + p;
        const askDimes = rng.bool();
        return whole(
          askDimes
            ? [
                `You make ${n} cents with the fewest dimes and pennies. How many dimes do you use?`,
                `用最少的 10 美分和 1 美分硬币凑出 ${n} 美分。要用几枚 10 美分硬币？`,
              ]
            : [
                `You make ${n} cents with the fewest dimes and pennies. How many pennies do you use?`,
                `用最少的 10 美分和 1 美分硬币凑出 ${n} 美分。要用几枚 1 美分硬币？`,
              ],
          askDimes ? d : p,
          [askDimes ? p : d, n, d + p],
          [
            `${n} is ${many(d, "ten")} and ${many(p, "one")}, so use ${d} dimes and ${p} pennies.`,
            `${n} 是 ${d} 个十和 ${p} 个一，所以用 ${d} 枚 10 美分硬币和 ${p} 枚 1 美分硬币。`,
          ],
        );
      },
    ),
    earlyPoint(
      "trading-pennies-for-a-dime",
      ["Trading pennies for a dime", "用 1 美分硬币换 10 美分硬币"],
      [
        "Ten pennies are worth the same as one dime. So a pile with many pennies can be tidied up by trading each ten pennies for a dime. The value stays the same. If you have 2 dimes and 13 pennies, trade 10 of the pennies, and you have 3 dimes and 3 pennies, which is still 33 cents.",
        "10 枚 1 美分硬币和 1 枚 10 美分硬币一样值钱。所以一堆 1 美分硬币很多时，可以每 10 枚换 1 枚 10 美分硬币，钱数不变。如果有 2 枚 10 美分和 13 枚 1 美分，把其中 10 枚换掉，就有 3 枚 10 美分和 3 枚 1 美分，还是 33 美分。",
      ],
      (rng) => {
        const d = rng.int(1, 4);
        const p = rng.int(11, 16);
        const total = 10 * d + p;
        const askDimes = rng.bool();
        return whole(
          askDimes
            ? [
                "Trade ten of the pennies for a dime. How many dimes are there now?",
                "用其中 10 枚 1 美分硬币换 1 枚 10 美分硬币。现在有几枚 10 美分硬币？",
              ]
            : ["How many cents are these coins worth?", "这些硬币一共值多少美分？"],
          askDimes ? d + 1 : total,
          askDimes ? [d, d + 2, p] : [d + p, Number(`${d}${p}`), 10 * d],
          askDimes
            ? [
                `One more dime joins the ${d} there were, which makes ${d + 1} dimes.`,
                `原来有 ${d} 枚，又多了 1 枚，现在有 ${d + 1} 枚 10 美分硬币。`,
              ]
            : [
                `The dimes make ${10 * d} cents, and the ${p} pennies bring it to ${total} cents.`,
                `10 美分硬币共 ${10 * d} 美分，再加 ${p} 枚 1 美分硬币，是 ${total} 美分。`,
              ],
          coinsFigure([...Array<number>(d).fill(10), ...Array<number>(p).fill(1)]),
        );
      },
    ),
  ],
);

const shapeWords: Readonly<Record<MixedShape, Pair>> = {
  circle: ["circles", "圆"],
  square: ["squares", "正方形"],
  triangle: ["triangles", "三角形"],
  star: ["stars", "星形"],
};

/** shapeMix draws counts of three or four kinds of shape and shuffles them into one group. */
function shapeMix(rng: Rng, kinds: readonly MixedShape[]) {
  const counts = kinds.map(() => rng.int(2, 7));
  const items = rng.shuffle(kinds.flatMap((kind, i) => Array<MixedShape>(counts[i] as number).fill(kind)));
  return { counts, items };
}

const sortingAndCountingData = earlyTopic(
  "sorting-and-counting-data",
  ["Sorting and Counting Data", "分类和计数"],
  ["Sort a mixed group into kinds, count each kind, and fill in a table.", "把混在一起的东西分类，数出每一类，并填写表格。"],
  ["tally-charts"],
  ["1.MD.C.4"],
  [
    earlyPoint(
      "counting-one-kind-in-a-mix",
      ["Counting one kind in a mix", "在混合的一组里数一类"],
      [
        "When things are all mixed together, it is easy to miss one or to count one twice. Choose one kind and go through the picture in rows, from left to right, touching each one of that kind as you count it. Sorting like this is the first step in making any table or graph.",
        "东西都混在一起时，很容易漏数或重复数。选好一类，一行一行地从左到右看，数到一个就指一下。这样分类，是做表格或统计图的第一步。",
      ],
      (rng) => {
        const kinds: MixedShape[] = ["circle", "square", "triangle", "star"];
        const { counts, items } = shapeMix(rng, kinds);
        const i = rng.int(0, 3);
        const kind = kinds[i] as MixedShape;
        const answer = counts[i] as number;
        return whole(
          [`How many ${shapeWords[kind][0]} are in the picture?`, `图中有多少个${shapeWords[kind][1]}？`],
          answer,
          [items.length, items.length - answer],
          [
            `Going through the picture row by row and touching each one gives ${answer} ${shapeWords[kind][0]}.`,
            `一行一行地数，一共有 ${answer} 个${shapeWords[kind][1]}。`,
          ],
          mixedShapesFigure(items),
        );
      },
    ),
    earlyPoint(
      "how-many-more-of-one-kind",
      ["How many more of one kind", "一类比另一类多多少"],
      [
        "After you sort and count, the numbers can answer questions. To find how many more of one kind there are than of another, count both kinds and then subtract the smaller count from the larger. You could also find how many kinds have the most, or how many there are altogether.",
        "分类数好以后，这些数就能回答问题。要知道一类比另一类多多少，就把两类都数出来，用大的数减小的数。还可以找出哪一类最多，或者一共有多少个。",
      ],
      (rng) => {
        const kinds: MixedShape[] = ["circle", "square", "triangle"];
        const { counts } = shapeMix(rng, kinds);
        let i = rng.int(0, 2);
        let j = (i + 1 + rng.int(0, 1)) % 3;
        if ((counts[i] as number) === (counts[j] as number)) counts[j] = (counts[j] as number) + 1;
        if ((counts[i] as number) < (counts[j] as number)) [i, j] = [j, i];
        const kindI = kinds[i] as MixedShape;
        const kindJ = kinds[j] as MixedShape;
        const big = counts[i] as number;
        const small = counts[j] as number;
        const redrawn = rng.shuffle(kinds.flatMap((kind, k) => Array<MixedShape>(counts[k] as number).fill(kind)));
        return whole(
          [
            `How many more ${shapeWords[kindI][0]} are there than ${shapeWords[kindJ][0]}?`,
            `${shapeWords[kindI][1]}比${shapeWords[kindJ][1]}多多少个？`,
          ],
          big - small,
          [big + small, big, small],
          [
            `There are ${big} ${shapeWords[kindI][0]} and ${small} ${shapeWords[kindJ][0]}, and $${big} - ${small} = ${big - small}$.`,
            `${shapeWords[kindI][1]}有 ${big} 个，${shapeWords[kindJ][1]}有 ${small} 个，$${big} - ${small} = ${big - small}$。`,
          ],
          mixedShapesFigure(redrawn),
        );
      },
    ),
    earlyPoint(
      "the-missing-count-in-a-table",
      ["The missing count in a table", "表中缺少的数"],
      [
        "A table lists the count for each kind. If you know how many there are in all, you can find a missing count. Add the counts you can see, and then subtract that sum from the total. Checking is easy, because all of the counts together must add up to the total you were given.",
        "表格列出每一类的数量。如果知道一共有多少，就能求出缺少的数。先把看得见的数加起来，再用总数减去这个和。验算也很容易，所有的数加起来，必须等于给出的总数。",
      ],
      (rng) => {
        const symbols = ["●", "■", "▲"];
        const counts = [rng.int(2, 8), rng.int(2, 8), rng.int(2, 8)] as [number, number, number];
        const total = counts[0] + counts[1] + counts[2];
        const hidden = rng.int(0, 2);
        const known = counts.filter((_, i) => i !== hidden) as [number, number];
        return whole(
          [
            `Some shapes were sorted and counted. There are ${total} shapes in all. What number goes at the question mark in the table?`,
            `把一些图形分类并数好。一共有 ${total} 个图形。表中问号处应该填几？`,
          ],
          counts[hidden] as number,
          [total, known[0] + known[1], total - known[0]],
          [
            `The other counts make $${known[0]} + ${known[1]} = ${known[0] + known[1]}$, and $${total} - ${known[0] + known[1]} = ${counts[hidden]}$.`,
            `其他两个数合起来是 $${known[0]} + ${known[1]} = ${known[0] + known[1]}$，$${total} - ${known[0] + known[1]} = ${counts[hidden]}$。`,
          ],
          tableFigure(
            symbols,
            counts.map((c, i) => (i === hidden ? null : c)),
          ),
        );
      },
    ),
  ],
);

/** graphValues draws three different values for a graph with rows or bars A, B and C. */
function graphValues(rng: Rng, lo: number, hi: number): [number, number, number] {
  const [a, b, c] = rng.sample(
    [...Array(hi - lo + 1).keys()].map((v) => v + lo),
    3,
  ) as [number, number, number];
  return [a, b, c];
}

const howManyInAllOnAGraph = earlyTopic(
  "how-many-in-all-on-a-graph",
  ["How Many in All on a Graph", "统计图上一共有多少"],
  [
    "Answer questions about totals and differences from tally charts, picture graphs and bar graphs.",
    "根据计数表、象形统计图和条形图，回答总数和相差多少的问题。",
  ],
  ["first-bar-graphs"],
  ["1.MD.C.4"],
  [
    earlyPoint(
      "the-total-from-tally-marks",
      ["The total from tally marks", "由计数符号求总数"],
      [
        "Each row of a tally chart is the count for one choice. To find how many children answered in all, read each row and add the numbers. Remember that four marks with a line through them make a group of five. Adding the rows tells you the total, and not any one row by itself.",
        "计数表的每一行是一种选择的数量。要知道一共有多少人回答，就读出每一行，把这些数加起来。记住，四条竖线再加一条斜线是一组五。把各行加起来才是总数，单看一行不行。",
      ],
      (rng) => {
        const [a, b, c] = graphValues(rng, 2, 9);
        const total = a + b + c;
        return whole(
          [
            "Children voted for a favorite snack, shown by this tally chart. How many children voted in all?",
            "孩子们投票选最喜欢的零食，结果如这张计数表所示。一共有多少个孩子投票？",
          ],
          total,
          [Math.max(a, b, c), a + b, 3],
          [
            `The rows show ${a}, ${b} and ${c}, and $${a} + ${b} + ${c} = ${total}$.`,
            `各行分别是 ${a}、${b} 和 ${c}，$${a} + ${b} + ${c} = ${total}$。`,
          ],
          tallyFigure(["A", "B", "C"], [a, b, c]),
        );
      },
    ),
    earlyPoint(
      "two-rows-of-a-picture-graph",
      ["Two rows of a picture graph", "象形统计图的两行"],
      [
        "In this picture graph each dot stands for one thing. A question may ask about only some of the rows, so read it carefully. If it asks how many are in two rows together, count the dots in those two rows and add them. Leave out the other rows, since they are not part of the question.",
        "这张象形统计图中，每个点代表一个东西。问题可能只问其中几行，所以要看清楚。如果问两行一共有多少，就数这两行的点再相加。其他的行不算，因为问题里没有问到它们。",
      ],
      (rng) => {
        const values = graphValues(rng, 2, 9);
        const labels = ["A", "B", "C"];
        const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
        const other = 3 - i - j;
        const answer = values[i]! + values[j]!;
        return whole(
          [`How many are in rows ${labels[i]} and ${labels[j]} together?`, `${labels[i]} 行和 ${labels[j]} 行一共有多少个？`],
          answer,
          [values[0] + values[1] + values[2], Math.abs(values[i]! - values[j]!), values[other]! + values[i]!],
          [
            `Row ${labels[i]} has ${values[i]} and row ${labels[j]} has ${values[j]}, and $${values[i]} + ${values[j]} = ${answer}$.`,
            `${labels[i]} 行有 ${values[i]} 个，${labels[j]} 行有 ${values[j]} 个，$${values[i]} + ${values[j]} = ${answer}$。`,
          ],
          pictureGraphFigure(labels, values, 1),
        );
      },
    ),
    earlyPoint(
      "how-many-more-than-the-other-two",
      ["The difference from the other two", "和另外两条比较"],
      [
        "A bar graph can answer a question in two steps. To compare the tallest bar with the other two together, first add the other two. Then subtract to find the difference between that sum and the tallest bar. Read each value from where the top of the bar meets the scale on the left.",
        "条形图可以回答要两步的问题。要把最高的一条和另外两条合起来比较，先把另外两条相加。再用减法求这个和与最高的一条相差多少。每个数都要从条的顶端对着左边的刻度来读。",
      ],
      (rng) => {
        const a = rng.int(2, 4);
        const b = rng.int(2, 4);
        const c = a + b + rng.int(1, 4);
        const order = rng.shuffle([a, b, c]);
        const labels = ["A", "B", "C"];
        const tall = labels[order.indexOf(c)] as string;
        return whole(
          [`How many more does bar ${tall} show than the other two bars together?`, `长条 ${tall} 比另外两条合起来多多少？`],
          c - a - b,
          [c - a, c - b, c + a + b, a + b],
          [
            `The other two make $${a} + ${b} = ${a + b}$, and $${c} - ${a + b} = ${c - a - b}$.`,
            `另外两条合起来是 $${a} + ${b} = ${a + b}$，$${c} - ${a + b} = ${c - a - b}$。`,
          ],
          barGraphFigure(labels, order, 1),
        );
      },
    ),
  ],
);

/** solidReason says what identifies a solid shape. */
function solidReason(kind: SolidKind): Pair {
  const name = solidName(kind);
  const clue: Readonly<Record<SolidKind, Pair>> = {
    cube: ["it has six flat square faces, all the same size", "它有六个大小相同的正方形平面"],
    box: ["it has six flat rectangle faces", "它有六个长方形平面"],
    cylinder: ["it has two flat circles and a curved side", "它有两个圆形平面和一个弯曲的侧面"],
    cone: ["it has one flat circle and comes to a point", "它有一个圆形平面，顶上是一个尖"],
    sphere: ["it is round all over, with no flat faces", "它处处都是圆的，没有平面"],
    pyramid: ["its flat triangle faces meet at a point", "它的三角形平面在顶上交于一点"],
  } as Readonly<Record<SolidKind, Pair>>;
  return [`This shape is a ${name[0]}: ${clue[kind][0]}.`, `这个图形是${name[1]}：${clue[kind][1]}。`];
}

const allSolids: readonly SolidKind[] = ["cube", "box", "cylinder", "cone", "sphere", "pyramid"];

const namingSolidShapes = earlyTopic(
  "naming-solid-shapes",
  ["Naming Solid Shapes", "认识立体图形"],
  [
    "Name cubes, rectangular prisms, cylinders, cones, spheres and pyramids, and tell what they can do.",
    "认识正方体、长方体、圆柱、圆锥、球和棱锥，并知道它们的特点。",
  ],
  ["defining-attributes-of-shapes"],
  ["1.G.A.1", "1.G.A.2"],
  [
    earlyPoint(
      "the-name-of-a-solid",
      ["The name of a solid", "立体图形的名称"],
      [
        "Solid shapes are not flat, so you can hold them in your hand. A box of cereal is a rectangular prism, and a number cube is a cube. A can of soup is a cylinder, and a party hat is a cone. A ball is a sphere, and a pyramid has a pointed top with sides shaped like triangles.",
        "立体图形不是扁平的，可以拿在手里。一盒麦片是长方体，一个数字方块是正方体。一个汤罐头是圆柱，一顶派对帽是圆锥。一个球就是球体，棱锥有一个尖顶，侧面是三角形。",
      ],
      (rng) => {
        const kind = rng.pick(allSolids);
        const others = rng.sample(
          allSolids.filter((k) => k !== kind),
          3,
        );
        const name = solidName(kind);
        return choose(
          rng,
          ["What is the name of this solid shape?", "这个立体图形叫什么？"],
          [name[0], name[1]],
          others.map((k) => solidName(k)),
          [solidReason(kind)[0], solidReason(kind)[1]],
          solidFigure(kind, rng.pick([0.9, 1, 1.1, 1.2, 1.3])),
        );
      },
    ),
    earlyPoint(
      "what-a-solid-can-do",
      ["What a solid can do", "立体图形的特点"],
      [
        "Curved surfaces roll, and flat surfaces stack. A sphere has no flat faces and rolls in every direction. A cylinder has two flat circles and rolls on its side. A cone has one flat circle and a point. A cube and a rectangular prism have six flat faces, so they stack well and do not roll at all.",
        "曲面能滚，平面能叠。球没有平面，朝哪个方向都能滚。圆柱有两个圆形的平面，躺倒就能滚。圆锥有一个圆形的平面和一个尖顶。正方体和长方体有六个平面，能叠得很稳，根本不会滚。",
      ],
      (rng) => {
        const clue = rng.pick<{ en: string; zh: string; kind: SolidKind }>([
          { en: "has no flat faces and rolls in every direction", zh: "没有平面，朝哪个方向都能滚", kind: "sphere" },
          { en: "has two flat circles and rolls on its side", zh: "有两个圆形的平面，躺倒能滚", kind: "cylinder" },
          { en: "has one flat circle and a point on top", zh: "有一个圆形的平面和一个尖顶", kind: "cone" },
          { en: "has six square faces that are all the same size", zh: "有六个大小相同的正方形面", kind: "cube" },
          { en: "has six flat faces, and not all of them are squares", zh: "有六个平面，但不都是正方形", kind: "box" },
          {
            en: "has a flat bottom and faces shaped like triangles that meet at a point",
            zh: "底面是平的，三角形的面在顶上交于一点",
            kind: "pyramid",
          },
        ]);
        const others = rng.sample(
          allSolids.filter((k) => k !== clue.kind),
          3,
        );
        const name = solidName(clue.kind);
        return choose(
          rng,
          [`Which shape ${clue.en}?`, `哪个图形${clue.zh}？`],
          [name[0], name[1]],
          others.map((k) => solidName(k)),
          [`A ${name[0]} ${clue.en}.`, `${name[1]}${clue.zh}。`],
        );
      },
    ),
    earlyPoint(
      "counting-solids-in-a-row",
      ["Counting solids in a row", "数一排立体图形"],
      [
        "Shapes keep their names however big they are or whichever way they sit. Look at each solid in the row and decide what it is, using the flat faces, the curved surfaces and the points that you can see. Go from left to right so that you do not miss any. Then count just the kind you were asked about.",
        "图形不管多大、怎么摆放，名称都不变。看看这一排里的每个图形是什么，用你看到的平面、曲面和尖顶来判断。从左到右看，不要漏掉。然后只数问到的那一类。",
      ],
      (rng) => {
        const kind = rng.pick(allSolids);
        const n = rng.int(1, 4);
        const others = rng.sample(
          allSolids.filter((k) => k !== kind),
          3,
        );
        const fill = [...Array(rng.int(3, 6)).keys()].map(() => rng.pick(others));
        const row = rng.shuffle([...Array<SolidKind>(n).fill(kind), ...fill]);
        const name = solidName(kind);
        return whole(
          [`How many of these solids are the shape called a ${name[0]}?`, `这些立体图形中，有几个是${name[1]}？`],
          n,
          [row.length, row.length - n],
          [`Looking at each one in turn, ${n} of them are the ${name[0]} shape.`, `一个一个地看，其中有 ${n} 个是${name[1]}。`],
          solidsRowFigure(row),
        );
      },
    ),
  ],
);

/** gradeOneMoreTopics are the added topics of 1st Grade Math. */
export const gradeOneMoreTopics: readonly TopicDef[] = [
  waysToMakeANumber,
  tenOnesMakeATen,
  countingOnByTens,
  numbersOnAHundredChart,
  numberLinesTo120,
  orderingNumbersTo120,
  factsWithin10,
  addingAndSubtractingZero,
  takingFromTen,
  thinkingAdditionToSubtract,
  factTriangles,
  trueOrFalseSentences,
  theUnknownInAnyPlace,
  storiesAsNumberSentences,
  partAndWholeBars,
  comparingBars,
  addingOnesToTwoDigits,
  addingTwoDigitsWithBlocks,
  measuringWithNoGaps,
  digitalClocks,
  hourAndHalfHourLater,
  firstCoins,
  dimesAndPennies,
  sortingAndCountingData,
  howManyInAllOnAGraph,
  namingSolidShapes,
];

/** gradeOneMoreUnits are the units that place the added topics in 1st Grade Math. */
export const gradeOneMoreUnits: CourseDef["units"] = [
  {
    title: t("Seeing Numbers in Many Ways", "用多种方式看数"),
    modules: [
      { title: t("Parts and Trades", "分与合、换一换"), topics: ["ways-to-make-a-number", "ten-ones-make-a-ten"] },
      {
        title: t("Finding Your Way Among Numbers", "在数中找路"),
        topics: ["counting-by-tens-from-any-number", "numbers-on-a-hundred-chart", "number-lines-to-120", "ordering-numbers-to-120"],
      },
    ],
  },
  {
    title: t("Strategies for Adding and Subtracting", "加减法的策略"),
    modules: [
      {
        title: t("Quick Facts", "口算"),
        topics: [
          "adding-and-subtracting-within-10",
          "adding-and-subtracting-zero",
          "taking-from-ten-to-subtract",
          "thinking-addition-to-subtract",
        ],
      },
      {
        title: t("Families and Equations", "成组的算式和等式"),
        topics: ["fact-triangles", "true-or-false-number-sentences", "the-unknown-in-any-place"],
      },
    ],
  },
  {
    title: t("Stories and Bar Models", "故事和线段图"),
    modules: [
      {
        title: t("Picturing a Story", "把故事画出来"),
        topics: ["stories-as-number-sentences", "part-and-whole-bar-models", "comparing-bars-in-stories"],
      },
    ],
  },
  {
    title: t("Adding Two-Digit Numbers", "两位数加法"),
    modules: [
      {
        title: t("With Blocks and Jumps", "用积木和跳跃"),
        topics: ["adding-ones-to-two-digit-numbers", "adding-two-digit-numbers-with-blocks"],
      },
    ],
  },
  {
    title: t("Measuring, Clocks and Coins", "测量、钟表和硬币"),
    modules: [
      { title: t("Measuring Carefully", "仔细测量"), topics: ["measuring-with-no-gaps"] },
      { title: t("More About Clocks", "钟表的更多知识"), topics: ["digital-clocks", "an-hour-or-half-hour-later"] },
      { title: t("Coins", "硬币"), topics: ["first-coins", "dimes-and-pennies"] },
    ],
  },
  {
    title: t("Sorting, Graphs and Solids", "分类、统计图和立体图形"),
    modules: [
      { title: t("Using Data", "使用数据"), topics: ["sorting-and-counting-data", "how-many-in-all-on-a-graph"] },
      { title: t("Solid Shapes", "立体图形"), topics: ["naming-solid-shapes"] },
    ],
  },
];
