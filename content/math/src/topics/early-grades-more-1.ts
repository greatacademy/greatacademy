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
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  type BarMeasure,
  blockRowsFigure,
  captioned,
  chartPieceFigure,
  compareBarsFigure,
  compared,
  digitalClockFigure,
  factTriangleFigure,
  hopsFigure,
  type MathWrong,
  type MixedShape,
  many,
  measuredBarsFigure,
  mixedShapesFigure,
  numberBondFigure,
  type Pair,
  partWholeBarFigure,
  picked,
  pickedMath,
  type SolidKind,
  solidFigure,
  solidName,
  solidsRowFigure,
  solved,
  tableFigure,
  type Walk,
  type Wrong,
} from "./early-grades-more-kit.ts";

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
        "A number bond shows a whole on top and two parts below. The parts make the whole. Here the whole is 9 and one part is 4. Count on from 4 to 9: 5, 6, 7, 8, 9. That is 5.\n\nCheck: $4 + 5 = 9$.\n\n> **Watch out.** The missing number is a part. It is smaller than the whole, so it cannot be 9.",
        "分与合图上面是整体，下面是两部分，两部分合起来就是整体。这里整体是 9，一部分是 4。从 4 往后数到 9：5、6、7、8、9，数了 5 个。\n\n检验：$4 + 5 = 9$。\n\n> **注意。** 缺少的数是一部分，比整体小，不可能是 9。",
      ],
      (rng) => {
        const all = rng.int(6, 18);
        const known = rng.int(1, all - 1);
        const answer = all - known;
        const left = rng.bool();
        return solved(
          ["What number goes in the circle with the question mark?", "问号所在的圆里应该填几？"],
          answer,
          [
            [
              ["Find the whole and a part", "找出整体和一部分"],
              [`The whole is ${all}. One part is ${known}.`, `整体是 ${all}，一部分是 ${known}。`],
            ],
            [
              ["Count up to the whole", "往上数到整体"],
              [`From ${known} to ${all} is ${answer} more:`, `从 ${known} 数到 ${all} 要数 ${answer} 个：`],
              [`${known} + ${answer} = ${all}`],
            ],
          ],
          [`Take the part from the whole: $${all} - ${known} = ${answer}$.`, `用整体减去这一部分：$${all} - ${known} = ${answer}$。`],
          [
            [
              all + known,
              "This adds the whole and the part. A part is smaller than the whole.",
              "这是把整体和部分加起来了，部分要比整体小。",
            ],
            [all, "That is the whole, not the missing part.", "这是整体，不是缺少的部分。"],
            [known, "That copies the part you know.", "这照抄了已知的部分。"],
          ],
          numberBondFigure(all, left ? null : known, left ? known : null),
        );
      },
      captioned(
        numberBondFigure(9, 4, null),
        "A number bond: the whole is 9, one part is 4, and the other part is unknown.",
        "分与合图：整体是 9，一部分是 4，另一部分未知。",
      ),
    ),
    earlyPoint(
      "pairs-that-make-a-number",
      ["Pairs that make a number", "能合成一个数的两个数"],
      [
        "Most numbers can be split in many ways. 8 can be 7 and 1, 6 and 2, 5 and 3, or 4 and 4. To test a pair, add it. It must land exactly on 8.\n\nCheck: $5 + 3 = 8$ and $6 + 2 = 8$.\n\n> **Watch out.** Off by one is still wrong. $5 + 4$ is 9, not 8.",
        "大多数数都有好几种分法。8 可以分成 7 和 1、6 和 2、5 和 3、4 和 4。要检查一对数，就把它们加起来，必须正好是 8。\n\n检验：$5 + 3 = 8$，$6 + 2 = 8$。\n\n> **注意。** 差 1 也不对。$5 + 4$ 是 9，不是 8。",
      ],
      (rng) => {
        const all = rng.int(7, 16);
        const a = rng.int(2, all - 2);
        const b = all - a;
        const pairs: readonly (readonly [number, number])[] = [
          [a + 1, b + 1],
          [a, b + 1],
          [a + 1, b + 2],
          [Math.max(a - 2, 1), Math.max(b - 1, 1)],
          [a + 2, b],
        ];
        const wrong = rng
          .sample(pairs, 3)
          .map(([x, y]): MathWrong => [`${x} + ${y}`, `$${x} + ${y} = ${x + y}$, not ${all}.`, `$${x} + ${y} = ${x + y}$，不是 ${all}。`]);
        return pickedMath(
          rng,
          [`Which pair makes ${all}?`, `哪一对数合起来是 ${all}？`],
          `${a} + ${b}`,
          wrong,
          [
            [
              ["Add each pair", "把每一对加起来"],
              [`Only one pair lands exactly on ${all}.`, `只有一对正好得到 ${all}。`],
            ],
            [["Find the pair", "找出这一对"], ["", ""], [`${a} + ${b} = ${all}`]],
          ],
          [`Count on ${b} from ${a}: you reach ${all}.`, `从 ${a} 往后数 ${b} 个，数到 ${all}。`],
        );
      },
      captioned(numberBondFigure(8, 5, 3), "A number bond: 8 split into 5 and 3.", "分与合图：8 分成 5 和 3。"),
    ),
    earlyPoint(
      "filling-frames-to-make-a-number",
      ["Filling frames to make a number", "把十格框填到要的数"],
      [
        "A ten-frame shows how far you are from a number. There are 7 counters, and we want 12. 3 more fill the frame to make 10. Then 2 more make 12. That is 5 more in all.\n\nCheck: $7 + 5 = 12$.\n\n> **Watch out.** The answer is how many more, not the number you want. It is 5, not 12.",
        "十格框能看出离要的数还差多少。框里有 7 个圆片，我们要 12 个。再放 3 个放满一框，是 10；再放 2 个就是 12。一共还要 5 个。\n\n检验：$7 + 5 = 12$。\n\n> **注意。** 答案是还要几个，不是要的那个数。是 5，不是 12。",
      ],
      (rng) => {
        const target = rng.int(7, 19);
        const have = rng.int(3, target - 2);
        const answer = target - have;
        return solved(
          [`How many more counters are needed to make ${target}?`, `还要放多少个圆片才能得到 ${target}？`],
          answer,
          [
            [
              ["Count the counters", "数圆片"],
              [`There are ${have} counters.`, `框里有 ${have} 个圆片。`],
            ],
            [
              ["Count up to the number", "往上数到要的数"],
              [`From ${have} to ${target} is ${answer} more:`, `从 ${have} 数到 ${target} 要再放 ${answer} 个：`],
              [`${have} + ${answer} = ${target}`],
            ],
          ],
          [`Subtract: $${target} - ${have} = ${answer}$.`, `用减法算：$${target} - ${have} = ${answer}$。`],
          [
            [target, "That is the number you want, not how many more.", "这是要的数，不是还要几个。"],
            [have, "That is how many counters are already there.", "这是框里已有的个数。"],
            [target + have, "This adds. Count up from what you have instead.", "这是做了加法，应该从已有的数往上数。"],
          ],
          tenFramesFigure(have),
        );
      },
      captioned(tenFramesFigure(7), "A ten-frame with 7 counters.", "放了 7 个圆片的十格框。"),
    ),
  ],
  [
    "Ten ducks swim in a pond. Some are in the sun and some are in the shade. It could be 6 and 4, or 7 and 3, or 5 and 5. Every way, the ducks make 10.\n\nCheck: $6 + 4 = 10$, $7 + 3 = 10$ and $5 + 5 = 10$.\n\nIn this lesson we split a number into two parts, and find a missing part.",
    "池塘里有 10 只鸭子，有的在太阳下，有的在树荫里。可能是 6 只和 4 只，也可能是 7 只和 3 只，或者 5 只和 5 只。不管怎么分，合起来都是 10 只。\n\n检验：$6 + 4 = 10$，$7 + 3 = 10$，$5 + 5 = 10$。\n\n本课我们把一个数分成两部分，并求出缺少的部分。",
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
        "Here are 3 rods and 14 small squares. Count the rods by tens: 10, 20, 30. Then count on through the squares: 31, 32, and so on up to 44.\n\nCheck: trade ten squares for a rod. Now there are 4 rods and 4 squares: 44.\n\n> **Watch out.** Do not write 3 and 14 side by side. 314 is far too big.",
        "这里有 3 根长条和 14 个小方块。先按十数长条：10、20、30。再接着数小方块：31、32……一直数到 44。\n\n检验：用十个小方块换一根长条，就有 4 根长条和 4 个小方块：44。\n\n> **注意。** 不要把 3 和 14 并排写，314 太大了。",
      ],
      (rng) => {
        const tens = rng.int(1, 6);
        const ones = rng.int(11, 18);
        const answer = 10 * tens + ones;
        return solved(
          ["What number do these blocks show?", "这些积木表示什么数？"],
          answer,
          [
            [
              ["Count the rods", "数长条"],
              [`${many(tens, "rod")} make ${10 * tens}.`, `${tens} 根长条是 ${10 * tens}。`],
            ],
            [
              ["Count on the squares", "接着数小方块"],
              [`Add the ${ones} squares:`, `加上 ${ones} 个小方块：`],
              [`${10 * tens} + ${ones} = ${answer}`],
            ],
          ],
          [
            `Trade ten squares for a rod: ${many(tens + 1, "ten")} and ${many(ones - 10, "one")} make ${answer}.`,
            `用十个小方块换一根长条：${tens + 1} 个十和 ${ones - 10} 个一，是 ${answer}。`,
          ],
          [
            [Number(`${tens}${ones}`), "This writes the two counts side by side.", "这是把两个数并排写在一起了。"],
            [tens + ones, "This counts each rod as one. Each rod is ten.", "这把每根长条当成了一，每根长条是十。"],
            [answer - 10, `This counts only ${ones - 10} of the ${ones} squares.`, `这只数了 ${ones} 个小方块中的 ${ones - 10} 个。`],
          ],
          blockRowsFigure([[0, tens, ones]]),
        );
      },
      captioned(blockRowsFigure([[0, 3, 14]]), "3 rods and 14 small squares.", "3 根长条和 14 个小方块。"),
    ),
    earlyPoint(
      "trading-ones-for-a-ten",
      ["Trading ones for a ten", "用一换十"],
      [
        "Ten ones are worth one ten. Take 3 tens and 14 ones. Bundle ten of the ones into a new ten. That gives 4 tens and 4 ones, or 44.\n\nCheck: $30 + 14 = 44$ and $40 + 4 = 44$.\n\n> **Watch out.** Once the new ten is made, those ten ones are gone. Only 4 ones stay, not 14.",
        "十个一和一个十一样多。有 3 个十和 14 个一，把其中十个一捆成一个新的十，就是 4 个十和 4 个一，也就是 44。\n\n检验：$30 + 14 = 44$，$40 + 4 = 44$。\n\n> **注意。** 捆成新的十以后，那十个一就没有了，只剩 4 个一，不是 14 个。",
      ],
      (rng) => {
        const tens = rng.int(1, 7);
        const ones = rng.int(10, 19);
        const newTens = tens + 1;
        const left = ones - 10;
        const say = (a: number, b: number): Pair => [`${many(a, "ten")} and ${many(b, "one")}`, `${a} 个十和 ${b} 个一`];
        return picked(
          rng,
          [`Which is the same as ${many(tens, "ten")} and ${many(ones, "one")}?`, `哪一个和 ${tens} 个十 ${ones} 个一一样多？`],
          say(newTens, left),
          rng.sample<Wrong>(
            [
              [say(tens, left), "This takes ten ones away but forgets the new ten.", "这拿走了十个一，却忘了加上新的十。"],
              [
                say(newTens, ones),
                "This adds a new ten but keeps all the ones. Ten of them were used.",
                "这加了一个新的十，却还留着所有的一，其中十个已经用掉了。",
              ],
              [say(tens + 2, left), "This adds two tens. Ten ones make just one ten.", "这加了两个十，十个一只能换一个十。"],
              [
                say(newTens, left + 1),
                `${ones} ones take away ten leaves ${left}, not ${left + 1}.`,
                `${ones} 个一去掉十个，剩 ${left} 个，不是 ${left + 1} 个。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Bundle ten ones", "捆十个一"],
              [`${ones} ones are 1 ten and ${many(left, "one")}.`, `${ones} 个一是 1 个十和 ${left} 个一。`],
            ],
            [
              ["Add the new ten", "加上新的十"],
              [`${many(tens, "ten")} and 1 more ten make ${many(newTens, "ten")}.`, `${tens} 个十再加 1 个十，是 ${newTens} 个十。`],
            ],
          ],
          [
            `Both are worth ${10 * tens + ones}: $${10 * tens} + ${ones} = ${10 * tens + ones}$ and $${10 * newTens} + ${left} = ${10 * tens + ones}$.`,
            `两个都是 ${10 * tens + ones}：$${10 * tens} + ${ones} = ${10 * tens + ones}$，$${10 * newTens} + ${left} = ${10 * tens + ones}$。`,
          ],
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 14],
          [0, 4, 4],
        ]),
        "Top: 3 rods and 14 squares. Bottom: 4 rods and 4 squares. Both show 44.",
        "上面：3 根长条和 14 个小方块；下面：4 根长条和 4 个小方块。两行都表示 44。",
      ),
    ),
    earlyPoint(
      "opening-a-ten",
      ["Opening a ten", "把一个十拆开"],
      [
        "Open one rod, and it becomes ten small squares. So 5 tens and 2 ones are the same as 4 tens and 12 ones. There is one ten fewer and ten ones more.\n\nCheck: $40 + 12 = 52$, and $50 + 2 = 52$.\n\n> **Watch out.** The opened ten gives 10 ones, not 1.",
        "把一根长条拆开，就变成十个小方块。所以 5 个十和 2 个一，和 4 个十 12 个一一样多：十少了一个，一多了十个。\n\n检验：$40 + 12 = 52$，$50 + 2 = 52$。\n\n> **注意。** 拆开一个十得到 10 个一，不是 1 个。",
      ],
      (rng) => {
        const tens = rng.int(2, 9);
        const ones = rng.int(0, 9);
        const n = 10 * tens + ones;
        return solved(
          [`${n} is ${many(tens - 1, "ten")} and how many ones?`, `${n} 是 ${tens - 1} 个十和多少个一？`],
          ones + 10,
          [
            [
              ["Open one ten", "拆开一个十"],
              [`${many(tens, "ten")} become ${many(tens - 1, "ten")} and 10 ones.`, `${tens} 个十变成 ${tens - 1} 个十和 10 个一。`],
            ],
            [
              ["Add the ones", "把一合起来"],
              [`Put them with the ${many(ones, "one")} already there:`, `和原来的 ${ones} 个一合在一起：`],
              [`${ones} + 10 = ${ones + 10}`],
            ],
          ],
          [
            `$${10 * (tens - 1)} + ${ones + 10} = ${n}$, the number we started with.`,
            `$${10 * (tens - 1)} + ${ones + 10} = ${n}$，正好是原来的数。`,
          ],
          [
            [ones, "That forgets the ten ones from the opened rod.", "这忘了拆开的长条变成的十个一。"],
            [n, "That is the whole number.", "这是整个数。"],
            [ones + 1, "The opened rod gives 10 ones, not 1.", "拆开的长条是 10 个一，不是 1 个。"],
            [tens, "That is the tens digit.", "这是十位上的数。"],
          ],
          blockRowsFigure([[0, tens, ones]]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 5, 2],
          [0, 4, 12],
        ]),
        "Top: 5 rods and 2 squares. Bottom: 4 rods and 12 squares. Both show 52.",
        "上面：5 根长条和 2 个小方块；下面：4 根长条和 12 个小方块。两行都表示 52。",
      ),
    ),
  ],
  [
    "Sam has 14 loose stickers. He puts ten of them on a strip. Now he has 1 strip of ten and 4 loose ones. It is still 14 stickers.\n\nCheck: $10 + 4 = 14$.\n\nIn this lesson we trade ten ones for one ten, and one ten for ten ones.",
    "萨姆有 14 张散的贴纸。他把其中 10 张贴在一条纸带上，现在有 1 条十张的和 4 张散的，还是 14 张。\n\n检验：$10 + 4 = 14$。\n\n本课我们用十个一换一个十，也把一个十换成十个一。",
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
        "When you count by tens, only the tens digit changes. The ones digit stays. So 23 is followed by 33, 43, 53. Counting back works the same way: 53, 43, 33.\n\nCheck: each step adds 10: $23 + 10 = 33$.\n\n> **Watch out.** Do not change the ones digit. After 43 comes 53, not 54.",
        "十个十个地数时，只有十位在变，个位不变。所以 23 后面是 33、43、53。往回数也一样：53、43、33。\n\n检验：每一步都加 10：$23 + 10 = 33$。\n\n> **注意。** 个位不要变。43 后面是 53，不是 54。",
      ],
      (rng) => {
        const up = rng.bool();
        const ones = rng.int(1, 9);
        const start = 10 * rng.int(up ? 0 : 4, up ? 5 : 11) + ones;
        const d = up ? 10 : -10;
        const shown = [0, 1, 2].map((i) => start + i * d);
        const last = start + 2 * d;
        const answer = start + 3 * d;
        return solved(
          [`What number comes next? $${shown.join(",\\ ")},\\ \\square$`, `方框里填几？$${shown.join(",\\ ")},\\ \\square$`],
          answer,
          [
            [
              ["Find the pattern", "找规律"],
              [`Each number is 10 ${up ? "more" : "less"} than the one before.`, `每个数都比前一个数${up ? "多" : "少"} 10。`],
            ],
            [["Take one more step", "再走一步"], ["", ""], [`${last} ${up ? "+" : "-"} 10 = ${answer}`]],
          ],
          [
            `The ones digit stays ${ones}, and the tens digit goes ${up ? "up" : "down"} by one: ${answer}.`,
            `个位还是 ${ones}，十位${up ? "加" : "减"} 1：${answer}。`,
          ],
          [
            [answer + 1, `Only the tens digit changes. The ones digit stays ${ones}.`, `只有十位变，个位还是 ${ones}。`],
            [answer - 1, `Only the tens digit changes. The ones digit stays ${ones}.`, `只有十位变，个位还是 ${ones}。`],
            [start + 4 * d, "This skips a step. Take just one more step of ten.", "这跳过了一步，只要再走一步十。"],
            [
              last + (up ? 1 : -1),
              `This ${up ? "adds" : "takes away"} 1. The pattern ${up ? "adds" : "takes away"} 10.`,
              `这是${up ? "加" : "减"} 1，规律是${up ? "加" : "减"} 10。`,
            ],
          ],
        );
      },
      captioned(
        hopsFigure([23, 33, 43, 53]),
        "A number line with hops of ten from 23 to 33, 43 and 53.",
        "数轴：从 23 每次跳 10，跳到 33、43、53。",
      ),
    ),
    earlyPoint(
      "where-tens-jumps-land",
      ["Where jumps of ten land", "跳十跳到哪里"],
      [
        "Each jump on this number line is ten. Start at 17. The jumps land on 27, 37 and 47.\n\nCheck: 3 jumps of ten is 30, and $17 + 30 = 47$.\n\n> **Watch out.** Each jump is 10, not 1. Three jumps from 17 land on 47, not 20.",
        "这条数轴上每跳一次是 10。从 17 开始，依次落在 27、37、47。\n\n检验：跳 3 次十是 30，$17 + 30 = 47$。\n\n> **注意。** 每跳一次是 10，不是 1。从 17 跳 3 次落在 47，不是 20。",
      ],
      (rng) => {
        const jumps = rng.int(2, 4);
        const ones = rng.int(1, 9);
        const start = 10 * rng.int(0, 7) + ones;
        const up = rng.bool();
        const stops = up
          ? [...Array(jumps + 1).keys()].map((i) => start + 10 * i)
          : [...Array(jumps + 1).keys()].map((i) => start + 10 * (jumps - i));
        const first = stops[0] as number;
        const answer = stops[jumps] as number;
        return solved(
          ["The jumps start at the first number. Where do they end?", "从第一个数开始跳。最后跳到哪个数？"],
          answer,
          [
            [
              ["Count the jumps", "数跳了几次"],
              [`There are ${jumps} jumps of ten from ${first}.`, `从 ${first} 跳了 ${jumps} 次十。`],
            ],
            [
              ["Change the tens", "改变十位"],
              [`${jumps} jumps of ten is ${10 * jumps}:`, `跳 ${jumps} 次十是 ${10 * jumps}：`],
              [`${first} ${up ? "+" : "-"} ${10 * jumps} = ${answer}`],
            ],
          ],
          [`Say each landing: ${stops.slice(1).join(", ")}.`, `说出每次落到的数：${stops.slice(1).join("、")}。`],
          [
            [up ? answer + 10 : answer - 10, "This makes one jump too many.", "这多跳了一次。"],
            [up ? start + jumps : first - jumps, `This moves 1 for each jump. Each jump is 10.`, `这每跳一次只走了 1，每跳一次是 10。`],
            [up ? answer - 10 : answer + 10, "This makes one jump too few.", "这少跳了一次。"],
          ],
          hopsFigure(stops, true),
        );
      },
      gradeDrawings["where-tens-jumps-land"],
    ),
    earlyPoint(
      "how-many-jumps-of-ten",
      ["How many jumps of ten", "跳了几次十"],
      [
        "From 24 to 64, the ones digit stays 4. The tens digit goes from 2 to 6. That is 4 jumps of ten.\n\nCheck: count by tens: 34, 44, 54, 64. That is four counts.\n\n> **Watch out.** Do not count the start. 24 is where you begin, not a jump.",
        "从 24 到 64，个位一直是 4，十位从 2 变到 6，所以跳了 4 次十。\n\n检验：十个十个地数：34、44、54、64，数了四次。\n\n> **注意。** 开始的数不算。24 是起点，不是跳了一次。",
      ],
      (rng) => {
        const ones = rng.int(1, 9);
        const low = 10 * rng.int(0, 5) + ones;
        const jumps = rng.int(2, 6);
        const high = low + 10 * jumps;
        const name = rng.pick(earlyNames);
        const lt = Math.floor(low / 10);
        const ht = Math.floor(high / 10);
        const counts = Array.from({ length: jumps }, (_, i) => low + 10 * (i + 1));
        return solved(
          [
            `${name} counts by tens from ${low} to ${high}. How many tens does ${name} count?`,
            `${name} 从 ${low} 开始十个十个地数，数到 ${high}。一共数了多少个十？`,
          ],
          jumps,
          [
            [
              ["Compare the tens digits", "比较十位"],
              [`${low} has ${many(lt, "ten")} and ${high} has ${many(ht, "ten")}.`, `${low} 有 ${lt} 个十，${high} 有 ${ht} 个十。`],
            ],
            [["Subtract", "相减"], ["", ""], [`${ht} - ${lt} = ${jumps}`]],
          ],
          [
            `Count by tens from ${low}: ${counts.join(", ")}. That is ${jumps} counts.`,
            `从 ${low} 起十个十个地数：${counts.join("、")}，数了 ${jumps} 次。`,
          ],
          [
            [
              high - low,
              `That is the distance, ${high - low}. The question asks how many tens.`,
              `这是相差的数 ${high - low}，题目问的是几个十。`,
            ],
            [high, "That is where the count stops.", "这是数到的那个数。"],
            [jumps + 1, `This counts ${low} as a ten too. The start is not a jump.`, `这把 ${low} 也算成了一个十，起点不算。`],
          ],
        );
      },
      captioned(hopsFigure([24, 34, 44, 54, 64]), "A number line with 4 hops of ten from 24 to 64.", "数轴：从 24 跳 4 次十到 64。"),
    ),
  ],
  [
    "Mia has 23 stickers. Each day she gets a pack of 10 more. Day by day she has 33, then 43, then 53.\n\nCheck: the ones digit stays 3, and the tens digit goes up by 1 each day.\n\nIn this lesson we count by tens from any number, forward and back.",
    "米娅有 23 张贴纸，每天再得到一包 10 张。一天一天地，她有 33 张、43 张、53 张。\n\n检验：个位一直是 3，十位每天加 1。\n\n本课我们从任意一个数开始，十个十个地往前数或往后数。",
  ],
);

/** chartStart picks the first square of a hundred-chart piece of the given size so that no row runs off the chart. */
function chartStart(rng: Rng, rows: number, columns: number): number {
  return 10 * rng.int(0, 11 - rows) + rng.int(1, 11 - columns);
}

/** squares says "1 square" or "3 squares" for a move of n squares either way. */
const squares = (n: number) => many(Math.abs(n), "square");

/** rowsOf says "1 row" or "2 rows". */
const rowsOf = (n: number) => many(Math.abs(n), "row");

const chartPrompt: Pair = [
  "This is a piece of a hundred chart. What number goes in the square with the question mark?",
  "这是百数表的一部分。问号所在的格子里应该填几？",
];

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
        "A hundred chart puts the numbers in rows of ten. One square to the right is 1 more. One square to the left is 1 less. Here we can see 33. The question mark is 2 squares to the right: 34, 35. So it is 35.\n\nCheck: count back from 35 two squares: 34, 33.\n\n> **Watch out.** Along a row the number changes by 1, not by 10. Two squares right of 33 is 35, not 53.",
        "百数表把数排成每行十个。向右一格多 1，向左一格少 1。这里能看到 33，问号在它右边第 2 格：34、35。所以是 35。\n\n检验：从 35 往回数两格：34、33。\n\n> **注意。** 沿着一行走，数每次变 1，不是变 10。33 右边第二格是 35，不是 53。",
      ],
      (rng) => {
        const first = chartStart(rng, 2, 5);
        const row = rng.int(0, 1);
        const c = rng.int(0, 4);
        let d = rng.int(-2, 2);
        while (d === 0 || c + d < 0 || c + d > 4) d = d >= 2 || d === 0 ? (c === 4 ? -1 : 1) : d + 1;
        const seen = first + row * 10 + c;
        const answer = seen + d;
        const right = d > 0;
        const steps = Array.from({ length: Math.abs(d) }, (_, i) => seen + (right ? i + 1 : -(i + 1)));
        return solved(
          chartPrompt,
          answer,
          [
            [
              ["Start at a number you can see", "从看得见的数开始"],
              [`The question mark is in the same row as ${seen}.`, `问号和 ${seen} 在同一行。`],
            ],
            [
              ["Count along the row", "沿着这一行数"],
              [
                `It is ${squares(d)} to the ${right ? "right" : "left"}, so count ${right ? "on" : "back"}: ${steps.join(", ")}.`,
                `它在${right ? "右" : "左"}边第 ${Math.abs(d)} 格，${right ? "往后" : "往回"}数：${steps.join("、")}。`,
              ],
              [`${seen} ${right ? "+" : "-"} ${Math.abs(d)} = ${answer}`],
            ],
          ],
          [
            `Go back the other way from ${answer}, ${squares(d)}: you reach ${seen}.`,
            `从 ${answer} 往反方向走 ${Math.abs(d)} 格，回到 ${seen}。`,
          ],
          [
            [seen + d * 10, "This moves by 10 for each square. Along a row each square is 1.", "这每走一格加减了 10，沿着一行每格只差 1。"],
            [
              seen - d,
              `This goes the wrong way. The question mark is to the ${right ? "right" : "left"}.`,
              `这走反了方向，问号在${right ? "右" : "左"}边。`,
            ],
            [seen, "That copies the number you can see.", "这照抄了看得见的数。"],
          ],
          chartPieceFigure(first, 2, 5, [seen], answer),
        );
      },
      captioned(
        chartPieceFigure(31, 2, 5, [33], 35),
        "A piece of a hundred chart showing 33, with a question mark two squares to its right.",
        "百数表的一部分：显示 33，它右边第二格是问号。",
      ),
    ),
    earlyPoint(
      "moving-up-and-down-a-column",
      ["Moving up and down a column", "沿着一列走"],
      [
        "One square down on a hundred chart is 10 more. One square up is 10 less. Here we can see 24. The question mark is 2 squares below it: 34, then 44.\n\nCheck: the ones digit stays 4 all the way down the column, and 44 ends in 4.\n\n> **Watch out.** Down one square is 10 more, not 1 more. Below 24 is 34, not 25.",
        "在百数表上，往下一格多 10，往上一格少 10。这里能看到 24，问号在它下面第 2 格：34，然后是 44。\n\n检验：同一列的个位都是 4，44 的个位也是 4。\n\n> **注意。** 往下一格多 10，不是多 1。24 下面是 34，不是 25。",
      ],
      (rng) => {
        const first = chartStart(rng, 4, 3);
        const c = rng.int(0, 2);
        const r1 = rng.int(0, 3);
        let r2 = rng.int(0, 3);
        if (r2 === r1) r2 = (r1 + 1 + rng.int(0, 2)) % 4;
        const seen = first + r1 * 10 + c;
        const answer = first + r2 * 10 + c;
        const k = r2 - r1;
        const down = k > 0;
        const steps = Array.from({ length: Math.abs(k) }, (_, i) => seen + (down ? 10 : -10) * (i + 1));
        return solved(
          chartPrompt,
          answer,
          [
            [
              ["Count the rows", "数行数"],
              [
                `The question mark is ${rowsOf(k)} ${down ? "below" : "above"} ${seen}.`,
                `问号在 ${seen} ${down ? "下" : "上"}面第 ${Math.abs(k)} 行。`,
              ],
            ],
            [
              [down ? "Add 10 for each row" : "Take 10 for each row", down ? "每行加 10" : "每行减 10"],
              [
                `${down ? "Count on" : "Count back"} by tens: ${steps.join(", ")}.`,
                `十个十个地${down ? "往后" : "往回"}数：${steps.join("、")}。`,
              ],
              [`${seen} ${down ? "+" : "-"} ${10 * Math.abs(k)} = ${answer}`],
            ],
          ],
          [
            `The ones digit stays the same down a column: ${seen} and ${answer} both end in ${seen % 10}.`,
            `同一列的个位不变：${seen} 和 ${answer} 的个位都是 ${seen % 10}。`,
          ],
          [
            [seen + k, "This moves 1 for each row. Each row is 10.", "这每行只走了 1，每行差 10。"],
            [
              seen - k * 10,
              `This goes the wrong way. The question mark is ${down ? "below" : "above"}.`,
              `这走反了方向，问号在${down ? "下" : "上"}面。`,
            ],
            [seen, "That copies the number you can see.", "这照抄了看得见的数。"],
          ],
          chartPieceFigure(first, 4, 3, [seen], answer),
        );
      },
      captioned(
        chartPieceFigure(13, 4, 3, [24], 44),
        "A piece of a hundred chart showing 24, with a question mark two squares below it.",
        "百数表的一部分：显示 24，它下面第二格是问号。",
      ),
    ),
    earlyPoint(
      "moving-in-both-directions",
      ["Moving in both directions", "两个方向都走"],
      [
        "Put the two moves together. Down a row is 10 more. Right one square is 1 more. From 13, go 2 rows down: 23, 33. Then 1 square right: 34.\n\nCheck: go right first, to 14. Then 2 rows down: 24, 34. It is the same square.\n\n> **Watch out.** Rows change the tens. Squares in a row change the ones. Do not swap them.",
        "把两种走法合起来：往下一行多 10，往右一格多 1。从 13 往下走 2 行：23、33；再往右走 1 格：34。\n\n检验：先往右走到 14，再往下走 2 行：24、34。还是同一个格子。\n\n> **注意。** 上下走变的是十位，左右走变的是个位，不要弄反。",
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
        const mid = seen + dr * 10;
        const other = seen + dc;
        const sign = (n: number) => (n > 0 ? "+" : "-");
        return solved(
          chartPrompt,
          answer,
          [
            [
              [dr > 0 ? "Go down" : "Go up", dr > 0 ? "往下走" : "往上走"],
              [
                `${rowsOf(dr)} ${dr > 0 ? "down" : "up"} changes the number by ${10 * Math.abs(dr)}:`,
                `往${dr > 0 ? "下" : "上"}走 ${Math.abs(dr)} 行，数变化 ${10 * Math.abs(dr)}：`,
              ],
              [`${seen} ${sign(dr)} ${10 * Math.abs(dr)} = ${mid}`],
            ],
            [
              [dc > 0 ? "Go right" : "Go left", dc > 0 ? "往右走" : "往左走"],
              [
                `${squares(dc)} to the ${dc > 0 ? "right" : "left"} changes it by ${Math.abs(dc)}:`,
                `往${dc > 0 ? "右" : "左"}走 ${Math.abs(dc)} 格，数变化 ${Math.abs(dc)}：`,
              ],
              [`${mid} ${sign(dc)} ${Math.abs(dc)} = ${answer}`],
            ],
          ],
          [
            `Go across first: ${seen} ${sign(dc)} ${Math.abs(dc)} = ${other}. Then ${dr > 0 ? "down" : "up"}: ${other} ${sign(dr)} ${10 * Math.abs(dr)} = ${answer}. Same square.`,
            `先左右走：${seen} ${sign(dc)} ${Math.abs(dc)} = ${other}；再${dr > 0 ? "往下" : "往上"}走：${other} ${sign(dr)} ${10 * Math.abs(dr)} = ${answer}。还是同一个格子。`,
          ],
          [
            [
              mid,
              `This stops after the ${dr > 0 ? "down" : "up"} move. It still has to go ${dc > 0 ? "right" : "left"}.`,
              `这只上下走了，还要往${dc > 0 ? "右" : "左"}走。`,
            ],
            [other, `This only goes ${dc > 0 ? "right" : "left"}. It forgets the rows.`, `这只左右走了，忘了上下走。`],
            [
              seen + dr + dc * 10,
              "This swaps the moves: rows change the tens, not the ones.",
              "这把两种走法弄反了：上下走变十位，不是变个位。",
            ],
          ],
          chartPieceFigure(first, 3, 4, [seen], answer),
        );
      },
      captioned(
        chartPieceFigure(12, 3, 4, [13], 34),
        "A piece of a hundred chart showing 13, with a question mark two rows down and one square right.",
        "百数表的一部分：显示 13，问号在它下面两行、右边一格。",
      ),
    ),
  ],
  [
    "Leo finds 34 on a hundred chart. His friend picks the number right above 34. One square up is 10 less, so that number is 24.\n\nCheck: one row up is 10 less: $34 - 10 = 24$.\n\nIn this lesson we move along the rows and columns of a hundred chart to find numbers.",
    "利奥在百数表上找到了 34，他的好朋友选了 34 正上方的那个数。往上一格少 10，那个数是 24。\n\n检验：$34 - 10 = 24$。\n\n本课我们沿着百数表的行和列走，找出要的数。",
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
        "On this line each small space is 1. Only the ends, 50 and 60, have numbers. The dot is 7 spaces past 50. Count on: 51, 52, and so on up to 57.\n\nCheck: count back from 60: the dot is 3 spaces before it, and $60 - 3 = 57$.\n\n> **Watch out.** The answer is where the dot is, not how many spaces. It is 57, not 7.",
        "这条数轴上每一小格是 1，只有两端写了数：50 和 60。这个点在 50 后面第 7 格。往后数：51、52……数到 57。\n\n检验：从 60 往回数，这个点在 60 前面 3 格，$60 - 3 = 57$。\n\n> **注意。** 答案是这个点表示的数，不是格数。是 57，不是 7。",
      ],
      (rng) => {
        const lo = 10 * rng.int(0, 11);
        const k = rng.int(1, 9);
        const mark = lo + k;
        return solved(
          ["What number does the dot show?", "这个点表示什么数？"],
          mark,
          [
            [
              ["Start at the left end", "从左端开始"],
              [`The left end is ${lo}. Each space is 1.`, `左端是 ${lo}，每格是 1。`],
            ],
            [
              ["Count the spaces", "数格子"],
              [`The dot is ${squares(k).replace("square", "space")} past ${lo}:`, `这个点在 ${lo} 后面第 ${k} 格：`],
              [`${lo} + ${k} = ${mark}`],
            ],
          ],
          [
            `Count back from ${lo + 10}: the dot is ${10 - k} ${10 - k === 1 ? "space" : "spaces"} before it, and $${lo + 10} - ${10 - k} = ${mark}$.`,
            `从 ${lo + 10} 往回数：这个点在它前面 ${10 - k} 格，$${lo + 10} - ${10 - k} = ${mark}$。`,
          ],
          [
            [k, "That is how many spaces, not the number at the dot.", "这是格数，不是这个点表示的数。"],
            [lo + 10 - k, "This counts from the wrong end.", "这是从另一端数的，数反了。"],
            [mark + 10, `This starts at ${lo + 10} instead of ${lo}.`, `这把起点当成了 ${lo + 10}，起点是 ${lo}。`],
          ],
          numberLineFigure(lo, lo + 10, 1, mark, false),
        );
      },
      gradeDrawings2["number-lines-to-120#reading-a-line-marked-by-ones"],
    ),
    earlyPoint(
      "reading-a-line-marked-by-tens",
      ["Reading a line marked by tens", "读每格是十的数轴"],
      [
        "On this line each space is 10. The marks go 0, 10, 20, 30 and so on. The dot is 7 spaces past 0. Count by tens: 10, 20, 30, 40, 50, 60, 70.\n\nCheck: 7 tens is 70.\n\n> **Watch out.** Look at what each space is worth first. Here it is 10, so the dot is 70, not 7.",
        "这条数轴上每格是 10，刻度是 0、10、20、30……这个点在 0 后面第 7 格。十个十个地数：10、20、30、40、50、60、70。\n\n检验：7 个十是 70。\n\n> **注意。** 先看每格是多少。这里每格是 10，所以这个点是 70，不是 7。",
      ],
      (rng) => {
        const hi = rng.pick([60, 70, 80, 90, 100, 110, 120]);
        const lo = rng.pick([0, 10, 20]);
        const spaces = (hi - lo) / 10;
        const k = rng.int(1, spaces - 1);
        const mark = lo + 10 * k;
        const counts = Array.from({ length: k }, (_, i) => lo + 10 * (i + 1));
        return solved(
          ["Each space is worth 10. What number does the dot show?", "每格是 10。这个点表示什么数？"],
          mark,
          [
            [
              ["Count the spaces", "数格子"],
              [`The dot is ${k} ${k === 1 ? "space" : "spaces"} past ${lo}.`, `这个点在 ${lo} 后面第 ${k} 格。`],
            ],
            [["Count by tens", "十个十个地数"], [`${counts.join(", ")}.`, `${counts.join("、")}。`], [`${lo} + ${10 * k} = ${mark}`]],
          ],
          [
            `Count back from ${hi}: the dot is ${(hi - mark) / 10} ${hi - mark === 10 ? "space" : "spaces"} before it, and $${hi} - ${hi - mark} = ${mark}$.`,
            `从 ${hi} 往回数：这个点在它前面 ${(hi - mark) / 10} 格，$${hi} - ${hi - mark} = ${mark}$。`,
          ],
          [
            [lo + k, "This reads each space as 1. Each space is 10.", "这把每格当成了 1，每格是 10。"],
            [k, "That is how many spaces, not the number at the dot.", "这是格数，不是这个点表示的数。"],
            [mark + 10, "This counts one space too many.", "这多数了一格。"],
            [mark - 10, "This counts one space too few.", "这少数了一格。"],
          ],
          numberLineFigure(lo, hi, 10, mark, false),
        );
      },
      gradeDrawings2["number-lines-to-120#reading-a-line-marked-by-tens"],
    ),
    earlyPoint(
      "which-number-lies-between",
      ["Which number lies between", "哪个数在中间"],
      [
        "On a number line, small numbers are on the left and big numbers on the right. 46 is between 40 and 50: it is bigger than 40 and smaller than 50.\n\nCheck: count from 40 to 50: 41, 42, 43, 44, 45, 46. We meet 46 on the way.\n\n> **Watch out.** Test both sides. 53 is bigger than 40, but it is not smaller than 50.",
        "在数轴上，小的数在左边，大的数在右边。46 在 40 和 50 之间：它比 40 大，又比 50 小。\n\n检验：从 40 数到 50：41、42、43、44、45、46，路上碰到了 46。\n\n> **注意。** 两边都要检查。53 比 40 大，可是不比 50 小。",
      ],
      (rng) => {
        const low = rng.int(15, 105);
        const gap = rng.int(3, 8);
        const high = low + gap;
        const answer = low + rng.int(1, gap - 1);
        const below = low - rng.int(1, 3);
        const above = high + rng.int(1, 3);
        const way = Array.from({ length: answer - low }, (_, i) => low + i + 1);
        return pickedMath(
          rng,
          [`Which number lies between ${low} and ${high}?`, `哪个数在 ${low} 和 ${high} 之间？`],
          `${answer}`,
          rng.sample<MathWrong>(
            [
              [`${below}`, `${below} is smaller than ${low}, so it lies to the left of both.`, `${below} 比 ${low} 小，在两个数的左边。`],
              [`${above}`, `${above} is bigger than ${high}, so it lies to the right of both.`, `${above} 比 ${high} 大，在两个数的右边。`],
              [
                `${low + 10 + gap}`,
                `${low + 10 + gap} is bigger than ${low} but also bigger than ${high}.`,
                `${low + 10 + gap} 比 ${low} 大，可是也比 ${high} 大。`,
              ],
              [`${low - 10}`, `${low - 10} is smaller than ${low}, so it is not between.`, `${low - 10} 比 ${low} 小，不在中间。`],
            ],
            3,
          ),
          [
            [
              ["Test the left side", "检查左边"],
              [`${answer} is bigger than ${low}.`, `${answer} 比 ${low} 大。`],
            ],
            [
              ["Test the right side", "检查右边"],
              [`${answer} is smaller than ${high}.`, `${answer} 比 ${high} 小。`],
              [`${low} < ${answer} < ${high}`],
            ],
          ],
          [
            `Count on from ${low}: ${way.join(", ")}. We reach ${answer} before ${high}.`,
            `从 ${low} 往后数：${way.join("、")}，在数到 ${high} 之前碰到了 ${answer}。`,
          ],
        );
      },
      gradeDrawings2["number-lines-to-120#which-number-lies-between"],
    ),
  ],
  [
    "A ruler on the classroom wall shows 50 and 60, with little marks in between. Ana's ribbon ends 7 marks past 50.\n\nCheck: $50 + 7 = 57$, so the ribbon is 57 long.\n\nIn this lesson we read points on number lines that count by ones or by tens.",
    "教室墙上的长尺标着 50 和 60，中间有小刻度。安娜的彩带停在 50 后面第 7 个刻度。\n\n检验：$50 + 7 = 57$，彩带长 57。\n\n本课我们读出按一或按十标记的数轴上的点。",
  ],
);

/** placeWords says how many hundreds, tens and ones a number up to 120 has. */
const placeWords = (n: number): Pair => {
  const h = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  return [
    `${h > 0 ? "1 hundred, " : ""}${many(tens, "ten")} and ${many(ones, "one")}`,
    `${h > 0 ? "1 个百、" : ""}${tens} 个十和 ${ones} 个一`,
  ];
};

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
        "Compare 104 and 112. Both have 1 hundred. Then look at the tens: 104 has 0 tens and 112 has 1 ten. So 104 is less: $104 < 112$.\n\nCheck: when you count, 104 comes before 112.\n\n> **Watch out.** The open side of the sign faces the bigger number. Write $104 < 112$, not $104 > 112$.",
        "比较 104 和 112。两个数都有 1 个百。再看十位：104 有 0 个十，112 有 1 个十。所以 104 小：$104 < 112$。\n\n检验：数数时，104 在 112 前面。\n\n> **注意。** 符号开口的一边朝着大的数。要写 $104 < 112$，不是 $104 > 112$。",
      ],
      (rng) => {
        const a = rng.int(95, 120);
        const b = rng.bool(0.1) ? a : rng.int(85, 120);
        const r = rel(a, b);
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        const sym = ["<", "=", ">"][r] as string;
        const pa = placeWords(a);
        const pb = placeWords(b);
        return compared(
          `${a}`,
          `${b}`,
          r,
          [
            [
              ["Break both numbers up", "把两个数拆开"],
              [`${a} is ${pa[0]}. ${b} is ${pb[0]}.`, `${a} 是 ${pa[1]}；${b} 是 ${pb[1]}。`],
            ],
            [
              ["Compare and choose the sign", "比较并选符号"],
              a === b ? ["They are the same number.", "两个数一样。"] : [`${lo} is less than ${hi}.`, `${lo} 比 ${hi} 小。`],
              [`${a} ${sym} ${b}`],
            ],
          ],
          a === b
            ? ["Counting up, they are the same spot.", "往上数时，它们在同一个位置。"]
            : [`When you count, ${lo} comes before ${hi}.`, `数数时，${lo} 在 ${hi} 前面。`],
          [
            a === b
              ? ["The numbers are equal, so neither is less.", "两个数相等，没有哪个更小。"]
              : [`${a} is bigger than ${b}. The open side must face ${a}.`, `${a} 比 ${b} 大，开口应该朝着 ${a}。`],
            [`${a} and ${b} are different numbers.`, `${a} 和 ${b} 是不同的数。`],
            a === b
              ? ["The numbers are equal, so neither is greater.", "两个数相等，没有哪个更大。"]
              : [`${a} is less than ${b}. The open side must face ${b}.`, `${a} 比 ${b} 小，开口应该朝着 ${b}。`],
          ],
        );
      },
      captioned(
        blockRowsFigure([
          [1, 0, 4],
          [1, 1, 2],
        ]),
        "Top: 1 hundred and 4 ones, which is 104. Bottom: 1 hundred, 1 ten and 2 ones, which is 112.",
        "上面：1 个百和 4 个一，是 104；下面：1 个百、1 个十和 2 个一，是 112。",
      ),
    ),
    earlyPoint(
      "putting-three-numbers-in-order",
      ["Putting three numbers in order", "把三个数排好顺序"],
      [
        "Put 53, 35 and 41 in order from least to greatest. Look at the tens first: 3 tens, then 4 tens, then 5 tens. So the order is 35, 41, 53.\n\nCheck: on a number line, 35 is left of 41, and 41 is left of 53.\n\n> **Watch out.** 35 and 53 use the same digits, but they are far apart. Look at which digit is in the tens place.",
        "把 53、35、41 从小到大排。先看十位：3 个十、4 个十、5 个十。所以顺序是 35、41、53。\n\n检验：在数轴上，35 在 41 左边，41 在 53 左边。\n\n> **注意。** 35 和 53 用的数字一样，可是差得很远。要看十位上是哪个数字。",
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
        const list = (x: number, y: number, z: number) => `${x},\\ ${y},\\ ${z}`;
        return pickedMath(
          rng,
          ["Which list goes from least to greatest?", "哪一组是从小到大排列的？"],
          list(p, q, r),
          rng.sample<MathWrong>(
            [
              [list(r, q, p), "This goes from greatest to least, the wrong way.", "这是从大到小排的，方向反了。"],
              [list(q, p, r), `${p} is less than ${q}, so ${p} must come first.`, `${p} 比 ${q} 小，应该排在前面。`],
              [list(p, r, q), `${q} is less than ${r}, so ${q} must come before ${r}.`, `${q} 比 ${r} 小，应该排在 ${r} 前面。`],
              [list(q, r, p), `${p} is the smallest, so it goes first, not last.`, `${p} 最小，应该排第一，不是最后。`],
            ],
            3,
          ),
          [
            [
              ["Find the smallest", "找出最小的"],
              [`Compare the hundreds and tens first. ${p} is the smallest.`, `先比百位和十位。${p} 最小。`],
            ],
            [["Order the other two", "排剩下的两个"], [`${q} is less than ${r}.`, `${q} 比 ${r} 小。`], [`${p} < ${q} < ${r}`]],
          ],
          [`Count up from ${p}: you reach ${q} before ${r}.`, `从 ${p} 往后数：先数到 ${q}，再数到 ${r}。`],
        );
      },
      captioned(hopsFigure([35, 41, 53]), "A number line with 35, 41 and 53, smallest on the left.", "数轴上的 35、41、53，最小的在左边。"),
    ),
    earlyPoint(
      "comparing-two-rows-of-blocks",
      ["Comparing two rows of blocks", "比较两排积木"],
      [
        "Compare the rods first. Each rod is ten. The top row has 3 rods and 8 squares: 38. The bottom row has 4 rods and 1 square: 41. 4 rods beat 3 rods, so the bottom row is greater.\n\nCheck: $38 < 41$.\n\n> **Watch out.** More small squares does not make a row greater. Compare the rods first.",
        "先比长条，每根长条是十。上面一排有 3 根长条、8 个小方块：38；下面一排有 4 根长条、1 个小方块：41。4 根长条比 3 根多，所以下面一排大。\n\n检验：$38 < 41$。\n\n> **注意。** 小方块多不代表大，要先比长条。",
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
        const wrongs: Wrong[] = [];
        if (correct !== top)
          wrongs.push(
            equal
              ? [top, `Both rows show ${a}.`, `两排都表示 ${a}。`]
              : [top, `The top row shows ${a}, less than ${b}.`, `上面一排表示 ${a}，比 ${b} 小。`],
          );
        if (correct !== bottom)
          wrongs.push(
            equal
              ? [bottom, `Both rows show ${a}.`, `两排都表示 ${a}。`]
              : [bottom, `The bottom row shows ${b}, less than ${a}.`, `下面一排表示 ${b}，比 ${a} 小。`],
          );
        if (correct !== both) wrongs.push([both, `The rows show ${a} and ${b}, which are different.`, `两排表示 ${a} 和 ${b}，不一样大。`]);
        const bigger = a > b ? ["top", "上面"] : ["bottom", "下面"];
        return picked(
          rng,
          ["Which row of blocks shows the greater number?", "哪一排积木表示的数更大？"],
          correct,
          wrongs,
          [
            [
              ["Compare the rods", "比长条"],
              [
                `The top row has ${many(t1, "rod")}. The bottom row has ${many(t2, "rod")}.`,
                `上面一排有 ${t1} 根长条，下面一排有 ${t2} 根长条。`,
              ],
            ],
            t1 !== t2
              ? [
                  ["The row with more rods wins", "长条多的大"],
                  [`So the ${bigger[0]} row is greater.`, `所以${bigger[1]}一排大。`],
                ]
              : [
                  ["Compare the small squares", "比小方块"],
                  equal
                    ? [`The rods match, and so do the squares: ${o1} and ${o2}.`, `长条一样多，小方块也一样多：${o1} 个和 ${o2} 个。`]
                    : [
                        `The rods match, so look at the squares: ${o1} and ${o2}. The ${bigger[0]} row is greater.`,
                        `长条一样多，就看小方块：${o1} 个和 ${o2} 个。${bigger[1]}一排大。`,
                      ],
                ],
          ],
          [`Read each row: the top row is ${a} and the bottom row is ${b}.`, `读出每一排：上面一排是 ${a}，下面一排是 ${b}。`],
          blockRowsFigure([
            [0, t1, o1],
            [0, t2, o2],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 8],
          [0, 4, 1],
        ]),
        "Top: 3 rods and 8 squares. Bottom: 4 rods and 1 square.",
        "上面：3 根长条和 8 个小方块；下面：4 根长条和 1 个小方块。",
      ),
    ),
  ],
  [
    "Two classes collect cans. Class A has 104 cans and Class B has 112 cans. Both passed 100. Class B has one more ten.\n\nCheck: counting up, 104 comes before 112, so Class B has more.\n\nIn this lesson we compare and order numbers up to 120.",
    "两个班收集易拉罐。A 班收了 104 个，B 班收了 112 个。两个班都超过了 100，B 班多一个十。\n\n检验：往上数，104 在 112 前面，所以 B 班多。\n\n本课我们比较 120 以内的数，并把它们排好顺序。",
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
        "This frame shows $4 + 3$. The 4 filled counters are one number. The 3 hollow ones are the other. The top row is full, so that is 5. There are 2 more below, so the sum is 7.\n\nCheck: count the hollow ones first: 3, then 4 more: 7.\n\n> **Watch out.** Count every counter, filled and hollow. The sum is 7, not 4.",
        "这个十格框表示 $4 + 3$。4 个实心圆片是一个数，3 个空心圆片是另一个数。第一行满了，是 5；下面还有 2 个，所以和是 7。\n\n检验：先数空心的 3 个，再数 4 个：7。\n\n> **注意。** 实心的和空心的都要数。和是 7，不是 4。",
      ],
      (rng) => {
        const a = rng.int(1, 8);
        const b = rng.int(1, 10 - a);
        const answer = a + b;
        return solved(
          [`The frame shows $${a} + ${b}$. What is the sum?`, `这个十格框表示 $${a} + ${b}$。和是多少？`],
          answer,
          [
            [
              ["Count the filled counters", "数实心圆片"],
              [`There are ${a} filled counters.`, `有 ${a} 个实心圆片。`],
            ],
            [
              ["Count on the hollow ones", "接着数空心圆片"],
              [`Add the ${b} hollow counters:`, `加上 ${b} 个空心圆片：`],
              [`${a} + ${b} = ${answer}`],
            ],
          ],
          [`Count the hollow ones first: ${b}, then ${a} more makes ${answer}.`, `先数空心的 ${b} 个，再数 ${a} 个，一共 ${answer} 个。`],
          [
            [
              Math.abs(a - b),
              "This subtracts. The sign is plus, so put the counters together.",
              "这是做了减法。符号是加号，要把圆片合起来。",
            ],
            [a, "This counts only the filled counters.", "这只数了实心圆片。"],
            [b, "This counts only the hollow counters.", "这只数了空心圆片。"],
            [10, "This counts the empty squares too. Count only the counters.", "这把空格也数进去了，只数圆片。"],
          ],
          tenFramesFigure(a, b),
        );
      },
      captioned(
        tenFramesFigure(4, 3),
        "A ten-frame with 4 filled counters and 3 hollow counters.",
        "十格框里有 4 个实心圆片和 3 个空心圆片。",
      ),
    ),
    earlyPoint(
      "seeing-a-difference-on-a-frame",
      ["Seeing a difference on a frame", "在十格框上看差"],
      [
        "This frame shows $9 - 4$. All 9 counters are the start. The 4 hollow ones are taken away. Cover them up. The 5 filled counters stay, so the difference is 5.\n\nCheck: $5 + 4 = 9$.\n\n> **Watch out.** The answer is what stays, not what is taken away. It is 5, not 4.",
        "这个十格框表示 $9 - 4$。9 个圆片是开始的数，4 个空心圆片是拿走的。把它们盖住，还剩 5 个实心圆片，所以差是 5。\n\n检验：$5 + 4 = 9$。\n\n> **注意。** 答案是留下的，不是拿走的。是 5，不是 4。",
      ],
      (rng) => {
        const all = rng.int(3, 10);
        const away = rng.int(1, all - 1);
        const answer = all - away;
        return solved(
          [
            `The frame shows $${all} - ${away}$, with the ${away} taken away shown as hollow counters. What is the difference?`,
            `这个十格框表示 $${all} - ${away}$，拿走的 ${away} 个画成空心圆片。差是多少？`,
          ],
          answer,
          [
            [
              ["Count all the counters", "数全部圆片"],
              [`There are ${all} counters at the start.`, `开始有 ${all} 个圆片。`],
            ],
            [
              ["Cover the hollow ones", "盖住空心的"],
              [`${away} are taken away. The filled ones stay:`, `拿走 ${away} 个，留下实心的：`],
              [`${all} - ${away} = ${answer}`],
            ],
          ],
          [`Add back what was taken: $${answer} + ${away} = ${all}$.`, `把拿走的加回去：$${answer} + ${away} = ${all}$。`],
          [
            [all + away, "This adds. The sign is minus, so take away.", "这是做了加法。符号是减号，要拿走。"],
            [all, "This forgets to take any away.", "这忘了拿走。"],
            [away, "That is how many are taken away, not how many stay.", "这是拿走的个数，不是留下的个数。"],
          ],
          tenFramesFigure(answer, away),
        );
      },
      captioned(
        tenFramesFigure(5, 4),
        "A ten-frame with 5 filled counters and 4 hollow counters that are taken away.",
        "十格框里有 5 个实心圆片和 4 个要拿走的空心圆片。",
      ),
    ),
    earlyPoint(
      "quick-facts-within-10",
      ["Quick facts within 10", "10 以内的口算"],
      [
        "Facts within 10 are worth knowing by heart. For $6 + 3$, picture a ten-frame: 6 counters, then 3 more. That fills 9 squares, so $6 + 3 = 9$.\n\nCheck: take the 3 back away: $9 - 3 = 6$.\n\n> **Watch out.** Read the sign first. $6 + 3$ is 9, but $6 - 3$ is 3.",
        "10 以内的算式最好能记住。算 $6 + 3$，就想一个十格框：6 个圆片，再放 3 个，一共占了 9 格，所以 $6 + 3 = 9$。\n\n检验：再拿走 3 个：$9 - 3 = 6$。\n\n> **注意。** 先看符号。$6 + 3$ 是 9，$6 - 3$ 是 3。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 10 - a);
        const c = a + b;
        const form = rng.int(0, 3);
        const think: Walk = [
          ["Picture a ten-frame", "想一个十格框"],
          [`${a} counters and ${b} more fill ${c} squares.`, `${a} 个圆片再放 ${b} 个，占了 ${c} 格。`],
        ];
        if (form === 0)
          return solved(
            [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
            c,
            [think, [["Add", "相加"], ["", ""], [`${a} + ${b} = ${c}`]]],
            [`Take ${b} back away: $${c} - ${b} = ${a}$.`, `再拿走 ${b}：$${c} - ${b} = ${a}$。`],
            [
              [a, `That is the first number. ${b} still has to be added.`, `这是第一个数，还要加上 ${b}。`],
              [b, `That is the second number. ${a} still has to be added.`, `这是第二个数，还要加上 ${a}。`],
              [Math.abs(a - b), "This subtracts. The sign is plus.", "这是做了减法，符号是加号。"],
            ],
          );
        if (form === 1)
          return solved(
            [`What is $${c} - ${a}$?`, `$${c} - ${a}$ 等于多少？`],
            b,
            [think, [["Take away", "拿走"], [`Take away the ${a} and ${b} stay:`, `拿走 ${a} 个，剩下 ${b} 个：`], [`${c} - ${a} = ${b}`]]],
            [`Add back: $${b} + ${a} = ${c}$.`, `加回去：$${b} + ${a} = ${c}$。`],
            [
              [c + a, "This adds. The sign is minus.", "这是做了加法，符号是减号。"],
              [c, "This takes nothing away.", "这什么也没拿走。"],
              [a, "That is the number taken away, not what is left.", "这是拿走的数，不是剩下的数。"],
            ],
          );
        if (form === 2)
          return solved(
            [`What number goes in the box? $${a} + \\square = ${c}$`, `方框里填几？$${a} + \\square = ${c}$`],
            b,
            [
              think,
              [
                ["Count up to the total", "往上数到总数"],
                [`From ${a} to ${c} is ${b} more:`, `从 ${a} 数到 ${c} 要数 ${b} 个：`],
                [`${a} + ${b} = ${c}`],
              ],
            ],
            [`Subtract: $${c} - ${a} = ${b}$.`, `用减法算：$${c} - ${a} = ${b}$。`],
            [
              [c, "That is the total. The box is a part.", "这是总数，方框里是一部分。"],
              [a, "That copies the number already there.", "这照抄了已有的数。"],
              [c + a, "This adds the two numbers. Count up from the part instead.", "这是把两个数加起来了，应该从这一部分往上数。"],
            ],
          );
        return solved(
          [`What number goes in the box? $${c} - \\square = ${b}$`, `方框里填几？$${c} - \\square = ${b}$`],
          a,
          [
            think,
            [
              ["Find what was taken", "找出拿走了几个"],
              [`To leave ${b} of ${c}, take away ${a}:`, `${c} 个要剩下 ${b} 个，就要拿走 ${a} 个：`],
              [`${c} - ${a} = ${b}`],
            ],
          ],
          [`Add: $${b} + ${a} = ${c}$.`, `用加法验：$${b} + ${a} = ${c}$。`],
          [
            [c, "That is the start. Taking it all leaves 0.", `这是开始的数，全部拿走就剩 0 了。`],
            [b, "That is what is left, not what was taken.", "这是剩下的数，不是拿走的数。"],
            [c + b, "This adds the two numbers.", "这是把两个数加起来了。"],
          ],
        );
      },
      captioned(
        tenFramesFigure(6, 3),
        "A ten-frame with 6 filled counters and 3 hollow counters.",
        "十格框里有 6 个实心圆片和 3 个空心圆片。",
      ),
    ),
  ],
  [
    "Zoe has 4 red beads and 3 blue beads on a string. She does not count them one by one. She sees 4 and 3, and knows it is 7.\n\nCheck: count them: 1, 2, 3, 4, 5, 6, 7.\n\nIn this lesson we add and subtract within 10 quickly, using ten-frames.",
    "佐伊的绳子上有 4 颗红珠子和 3 颗蓝珠子。她不用一颗一颗地数，一看 4 和 3，就知道是 7。\n\n检验：数一数：1、2、3、4、5、6、7。\n\n本课我们借助十格框，很快地算 10 以内的加减法。",
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
        "Zero means none. A frame has 6 counters. Add 0 counters, and there are still 6. So $6 + 0 = 6$, and $0 + 6 = 6$ too.\n\nCheck: count the counters again: still 6.\n\n> **Watch out.** Adding zero is not adding 1. $6 + 0$ is 6, not 7.",
        "0 表示一个也没有。框里有 6 个圆片，再加 0 个，还是 6 个。所以 $6 + 0 = 6$，$0 + 6 = 6$ 也一样。\n\n检验：再数一遍：还是 6 个。\n\n> **注意。** 加 0 不是加 1。$6 + 0$ 是 6，不是 7。",
      ],
      (rng) => {
        const n = rng.int(1, 120);
        const first = rng.bool();
        return solved(
          [first ? `What is $0 + ${n}$?` : `What is $${n} + 0$?`, first ? `$0 + ${n}$ 等于多少？` : `$${n} + 0$ 等于多少？`],
          n,
          [
            [
              ["Find the zero", "找出 0"],
              ["One of the numbers is 0, so nothing is added.", "其中一个数是 0，什么也没加上。"],
            ],
            [["Keep the other number", "另一个数不变"], ["", ""], [first ? `0 + ${n} = ${n}` : `${n} + 0 = ${n}`]],
          ],
          [`Take the 0 back away: $${n} - 0 = ${n}$.`, `再把 0 拿走：$${n} - 0 = ${n}$。`],
          [
            [n + 1, "This adds 1. Zero adds nothing.", "这是加了 1，加 0 什么也没加。"],
            [0, `The ${n} is still there. Adding nothing does not make it 0.`, `${n} 还在，加 0 不会变成 0。`],
            [n * 10, "This writes the 0 on the end. Zero adds nothing.", "这是在后面添了一个 0，加 0 什么也没加。"],
          ],
          n <= 20 ? tenFramesFigure(n) : undefined,
        );
      },
      captioned(tenFramesFigure(6), "A ten-frame with 6 counters, and none added.", "十格框里有 6 个圆片，没有再加。"),
    ),
    earlyPoint(
      "taking-away-zero-or-everything",
      ["Taking away zero or everything", "减 0 和减去全部"],
      [
        "Here are 7 counters. Take away 0, and all 7 stay: $7 - 0 = 7$. Take away all 7, and none stay: $7 - 7 = 0$.\n\nCheck: $7 + 0 = 7$ and $0 + 7 = 7$.\n\n> **Watch out.** $7 - 0$ and $7 - 7$ look alike, but the answers are opposite: 7 and 0.",
        "这里有 7 个圆片。拿走 0 个，7 个都在：$7 - 0 = 7$。拿走全部 7 个，一个也不剩：$7 - 7 = 0$。\n\n检验：$7 + 0 = 7$，$0 + 7 = 7$。\n\n> **注意。** $7 - 0$ 和 $7 - 7$ 看起来很像，答案却正好相反：一个是 7，一个是 0。",
      ],
      (rng) => {
        const n = rng.int(2, 120);
        const form = rng.int(0, 2);
        if (form === 0)
          return solved(
            [`What is $${n} - 0$?`, `$${n} - 0$ 等于多少？`],
            n,
            [
              [
                ["See what is taken", "看拿走几个"],
                ["0 are taken away: nothing at all.", "拿走 0 个，就是什么也没拿走。"],
              ],
              [["Keep the number", "数不变"], ["", ""], [`${n} - 0 = ${n}`]],
            ],
            [`Add the 0 back: $${n} + 0 = ${n}$.`, `把 0 加回去：$${n} + 0 = ${n}$。`],
            [
              [0, `This takes all ${n} away. Minus 0 takes nothing.`, `这是把 ${n} 全拿走了，减 0 什么也没拿。`],
              [n - 1, "This takes away 1. Minus 0 takes nothing.", "这是拿走了 1，减 0 什么也没拿。"],
            ],
          );
        if (form === 1)
          return solved(
            [`What is $${n} - ${n}$?`, `$${n} - ${n}$ 等于多少？`],
            0,
            [
              [
                ["See what is taken", "看拿走几个"],
                [`All ${n} are taken away.`, `${n} 个全部拿走。`],
              ],
              [["Nothing is left", "什么也不剩"], ["", ""], [`${n} - ${n} = 0`]],
            ],
            [`Add back: $0 + ${n} = ${n}$, the number we started with.`, `加回去：$0 + ${n} = ${n}$，正好是开始的数。`],
            [
              [n, "This takes nothing away. Here everything is taken.", "这什么也没拿走，可这里是全部拿走。"],
              [1, "When everything is taken, not even 1 is left.", "全部拿走，连 1 个也不剩。"],
              [n + n, "This adds. The sign is minus.", "这是做了加法，符号是减号。"],
            ],
          );
        return solved(
          [`What number goes in the box? $${n} - \\square = ${n}$`, `方框里填几？$${n} - \\square = ${n}$`],
          0,
          [
            [
              ["Compare start and end", "比较开始和结果"],
              [`It starts at ${n} and is still ${n}.`, `开始是 ${n}，结果还是 ${n}。`],
            ],
            [["Nothing was taken", "什么也没拿走"], ["So the box holds 0:", "所以方框里填 0："], [`${n} - 0 = ${n}`]],
          ],
          [`Any other number would leave less than ${n}: $${n} - 1 = ${n - 1}$.`, `填别的数，结果都会比 ${n} 小：$${n} - 1 = ${n - 1}$。`],
          [
            [n, `$${n} - ${n} = 0$, not ${n}.`, `$${n} - ${n} = 0$，不是 ${n}。`],
            [1, `$${n} - 1 = ${n - 1}$, not ${n}.`, `$${n} - 1 = ${n - 1}$，不是 ${n}。`],
          ],
        );
      },
      captioned(tenFramesFigure(7), "A ten-frame with 7 counters.", "十格框里有 7 个圆片。"),
    ),
    earlyPoint(
      "zero-in-a-story",
      ["Zero in a story", "故事里的 0"],
      [
        'A story can hide a zero. Tom has 5 shells and gives all of them away. None are left: $5 - 5 = 0$. Words such as none, no more and all tell you a zero is there.\n\nCheck: count the shells Tom still has: there are none.\n\n> **Watch out.** "Gives all away" leaves 0, not the number he started with.',
        "故事里可能藏着 0。汤姆有 5 个贝壳，全部送走了，一个也不剩：$5 - 5 = 0$。“没有”“不再”“全部”这样的词，说明故事里有 0。\n\n检验：数一数汤姆还有的贝壳：一个也没有。\n\n> **注意。** “全部送走”剩下的是 0，不是开始的数。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const n = rng.int(3, 20);
        const all = rng.bool();
        return all
          ? solved(
              [
                `${name} has ${n} ${thing.en} and gives all of them to a friend. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}，全部送给了朋友。${name} 现在还有多少${thing.unit}${thing.zh}？`,
              ],
              0,
              [
                [
                  ["Find the zero word", "找出藏着 0 的词"],
                  [`"All of them" means all ${n} go away.`, `“全部”说明 ${n} ${thing.unit}都送走了。`],
                ],
                [["Write the number sentence", "列算式"], ["", ""], [`${n} - ${n} = 0`]],
              ],
              [`Add back what was given: $0 + ${n} = ${n}$, what ${name} had.`, `把送走的加回去：$0 + ${n} = ${n}$，正好是原来的数。`],
              [
                [n, `That is how many ${name} had before giving them away.`, "这是送走以前的个数。"],
                [1, "All were given away, so not even 1 is left.", "全部送走了，连 1 个也不剩。"],
                [n + n, "This adds. Giving away is taking away.", "这是做了加法，送走是减少。"],
              ],
            )
          : solved(
              [
                `${name} has ${n} ${thing.en}. Today ${name} gets no more ${thing.en} and gives none away. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}。今天没有得到新的${thing.zh}，也没有送给别人。${name} 现在有多少${thing.unit}${thing.zh}？`,
              ],
              n,
              [
                [
                  ["Find the zero words", "找出藏着 0 的词"],
                  ['"No more" and "none" mean 0 added and 0 taken.', "“没有得到”“没有送”说明加了 0，减了 0。"],
                ],
                [["Write the number sentence", "列算式"], ["", ""], [`${n} + 0 = ${n}`]],
              ],
              [`Nothing changed, so ${name} still has the same ${n}.`, `什么也没变，所以还是那 ${n} ${thing.unit}。`],
              [
                [0, "Nothing was given away, so they are all still there.", "没有送走，所以都还在。"],
                [n + 1, `${name} got no more, so do not add 1.`, "没有得到新的，不要加 1。"],
                [n - 1, `${name} gave none away, so do not take 1.`, "没有送走，不要减 1。"],
              ],
            );
      },
      captioned(
        tenFramesFigure(0, 5),
        "A ten-frame with 5 hollow counters: all 5 are given away.",
        "十格框里有 5 个空心圆片：5 个都送走了。",
      ),
    ),
  ],
  [
    "Ben has 3 apples in his bag. His friend puts 0 more apples in. Ben still has 3 apples.\n\nCheck: $3 + 0 = 3$.\n\nIn this lesson we add zero, take away zero, and take a number away from itself.",
    "本的书包里有 3 个苹果。朋友又放进去 0 个，本还是有 3 个苹果。\n\n检验：$3 + 0 = 3$。\n\n本课我们学习加 0、减 0，以及一个数减去它自己。",
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
        "13 is a full ten-frame and 3 more. To take away 9, take all 9 from the full frame. That frame had 10, so 1 is left in it. The 3 in the other frame are not touched.\n\nCheck: $1 + 9 = 10$, the full frame.\n\n> **Watch out.** The question is about the full frame only. Do not count the other frame.",
        "13 是一个满框再加 3 个。要拿走 9 个，就全部从满框里拿。满框有 10 个，拿走 9 个还剩 1 个。另一个框里的 3 个没有动。\n\n检验：$1 + 9 = 10$，正好是满框。\n\n> **注意。** 问的只是满框里还剩几个，不要把另一个框也数进去。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const s = rng.int(4, 9);
        return solved(
          [
            `The frames show ${10 + k}. If you take ${s} counters from the full frame, how many are left in that frame?`,
            `这两个框表示 ${10 + k}。如果从满框里拿走 ${s} 个圆片，这个框里还剩多少个？`,
          ],
          10 - s,
          [
            [
              ["Look at the full frame", "看满框"],
              ["A full frame holds 10.", "满框里有 10 个。"],
            ],
            [["Take from it", "从里面拿"], [`Take ${s} from the 10:`, `从 10 个里拿走 ${s} 个：`], [`10 - ${s} = ${10 - s}`]],
          ],
          [`Put them back: $${10 - s} + ${s} = 10$, a full frame again.`, `再放回去：$${10 - s} + ${s} = 10$，又是满框。`],
          [
            [
              10 + k - s,
              "This counts the other frame too. The question asks about the full frame only.",
              "这把另一个框也数进去了，题目只问满框。",
            ],
            [s, "That is how many were taken, not how many are left.", "这是拿走的个数，不是剩下的个数。"],
            [k, "That is the other frame.", "这是另一个框里的个数。"],
          ],
          tenFramesFigure(10, k),
        );
      },
      captioned(
        tenFramesFigure(10, 3),
        "Two ten-frames: one full frame of 10 and 3 more counters.",
        "两个十格框：一个满框 10 个，另一个框 3 个。",
      ),
    ),
    earlyPoint(
      "the-two-steps-of-taking-from-ten",
      ["The two steps of taking from ten", "从十里减的两步"],
      [
        "To find $15 - 8$, split 15 into 10 and 5. First take 8 from the 10: $10 - 8 = 2$. Then add the 5 that were not touched: $2 + 5 = 7$.\n\nCheck: $7 + 8 = 15$.\n\n> **Watch out.** The 5 ones are still there. Add them back. Do not take them away.",
        "求 $15 - 8$，把 15 分成 10 和 5。先从 10 里减 8：$10 - 8 = 2$。再加上没有动过的 5：$2 + 5 = 7$。\n\n检验：$7 + 8 = 15$。\n\n> **注意。** 那 5 个一还在，要加上，不是减去。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const s = rng.int(5, 9);
        const n = 10 + k;
        return pickedMath(
          rng,
          [`Which shows how to find $${n} - ${s}$ by taking from ten?`, `要用从十里减的方法求 $${n} - ${s}$，下面哪个是对的？`],
          `(10 - ${s}) + ${k}`,
          rng.sample<MathWrong>(
            [
              [
                `(10 - ${s}) - ${k}`,
                `The ${k} ones are still there. Add them, do not take them away.`,
                `那 ${k} 个一还在，要加上，不是减去。`,
              ],
              [`(10 + ${s}) + ${k}`, `This adds ${s}. ${s} has to be taken away.`, `这是加上了 ${s}，${s} 应该减去。`],
              [
                `(10 - ${k}) + ${s}`,
                `This swaps the numbers. Take ${s} from the ten, not ${k}.`,
                `这把两个数弄反了，从十里减的是 ${s}，不是 ${k}。`,
              ],
              [
                `(10 + ${s}) - ${k}`,
                `This adds ${s} and takes away the ones. Both are the wrong way.`,
                `这加上了 ${s}，又减去了个位，两步都反了。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Split the number", "拆开这个数"],
              [`${n} is 10 and ${k}.`, `${n} 是 10 和 ${k}。`],
            ],
            [
              ["Take from ten, then add the ones", "先从十里减，再加个位"],
              [`Take ${s} from 10, then add the ${k}:`, `从 10 里减 ${s}，再加上 ${k}：`],
              [`(10 - ${s}) + ${k} = ${10 - s + k}`],
            ],
          ],
          [`Add back: $${10 - s + k} + ${s} = ${n}$.`, `加回去验算：$${10 - s + k} + ${s} = ${n}$。`],
        );
      },
      captioned(
        tenFramesFigure(10, 5),
        "Two ten-frames: a full frame of 10 and 5 more, which is 15.",
        "两个十格框：一个满框 10 个，另一个框 5 个，一共 15 个。",
      ),
    ),
    earlyPoint(
      "subtracting-by-taking-from-ten",
      ["Subtracting by taking from ten", "用从十里减的方法算减法"],
      [
        "Find $14 - 9$. 14 is 10 and 4. Take 9 from the 10: 1 is left. Add the 4: $1 + 4 = 5$.\n\nCheck: $5 + 9 = 14$.\n\n> **Watch out.** Do not stop at $10 - 9 = 1$. The 4 in the other frame still count.",
        "求 $14 - 9$。14 是 10 和 4。从 10 里减 9，剩 1；再加上 4：$1 + 4 = 5$。\n\n检验：$5 + 9 = 14$。\n\n> **注意。** 不要算到 $10 - 9 = 1$ 就停下，另一个框里的 4 个还要算上。",
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
        return solved(
          story
            ? [
                `${name} has ${n} ${thing.en} and gives away ${s}. How many ${thing.en} are left?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}，送出去 ${s} ${thing.unit}。还剩多少${thing.unit}？`,
              ]
            : [`What is $${n} - ${s}$?`, `$${n} - ${s}$ 等于多少？`],
          answer,
          [
            [
              ["Take from ten", "从十里减"],
              [`${n} is 10 and ${k}. Take ${s} from the 10:`, `${n} 是 10 和 ${k}。从 10 里减 ${s}：`],
              [`10 - ${s} = ${10 - s}`],
            ],
            [
              ["Add the ones", "加上个位"],
              [`Add the ${many(k, "one")} that were not touched:`, `加上没有动过的 ${k} 个一：`],
              [`${10 - s} + ${k} = ${answer}`],
            ],
          ],
          [`Add back: $${answer} + ${s} = ${n}$.`, `加回去验算：$${answer} + ${s} = ${n}$。`],
          [
            [n + s, "This adds. The question takes away.", "这是做了加法，题目要求减。"],
            [10 - s, `This stops after taking from ten. Add the ${k} too.`, `这从十里减完就停了，还要加上 ${k}。`],
            [20 - s, `This adds 10 instead of the ${k} ones.`, `这加上的是 10，应该加 ${k}。`],
            [k, "That is only the ones of the start number.", "这只是开始那个数的个位。"],
          ],
          tenFramesFigure(10, k),
        );
      },
      captioned(
        tenFramesFigure(10, 4),
        "Two ten-frames: a full frame of 10 and 4 more, which is 14.",
        "两个十格框：一个满框 10 个，另一个框 4 个，一共 14 个。",
      ),
    ),
  ],
  [
    "Ella has 12 grapes: a box of 10 and 2 loose ones. She eats 9 from the box. 1 is left in the box, and the 2 loose ones are still there. That is 3 grapes.\n\nCheck: $3 + 9 = 12$.\n\nIn this lesson we subtract from a teen number by taking away from the ten.",
    "艾拉有 12 颗葡萄：一盒 10 颗，还有 2 颗散的。她从盒子里吃了 9 颗，盒子里剩 1 颗，散的 2 颗还在，一共 3 颗。\n\n检验：$3 + 9 = 12$。\n\n本课我们减十几时，先从十里减。",
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
        "Every subtraction has an addition behind it. For $13 - 5$, the whole is 13 and one part is 5. Ask: 5 plus what makes 13? That is $5 + \\square = 13$. The box is 8.\n\nCheck: $13 - 5 = 8$.\n\n> **Watch out.** The whole goes after the equal sign. Do not write $13 + \\square = 5$.",
        "每个减法背后都有一个加法。$13 - 5$ 里，整体是 13，一部分是 5。问：5 加几等于 13？就是 $5 + \\square = 13$，方框里是 8。\n\n检验：$13 - 5 = 8$。\n\n> **注意。** 整体写在等号后面，不要写成 $13 + \\square = 5$。",
      ],
      (rng) => {
        const w = rng.int(9, 19);
        const s = rng.int(2, w - 2);
        return pickedMath(
          rng,
          [`Which addition helps you find $${w} - ${s}$?`, `哪个加法能帮你求出 $${w} - ${s}$？`],
          `${s} + \\square = ${w}`,
          [
            [`${w} + \\square = ${s}`, `${w} is the whole. It goes after the equal sign.`, `${w} 是整体，应该写在等号后面。`],
            [
              `${w} + ${s} = \\square`,
              `This adds the whole and the part, which is more than ${w}.`,
              `这把整体和部分加起来了，比 ${w} 还大。`,
            ],
            [
              `${s} + ${w - s + 1} = \\square`,
              `$${s} + ${w - s + 1} = ${w + 1}$, not ${w}.`,
              `$${s} + ${w - s + 1} = ${w + 1}$，不是 ${w}。`,
            ],
          ],
          [
            [
              ["Find the whole and the part", "找出整体和部分"],
              [`${w} is the whole. ${s} is one part.`, `${w} 是整体，${s} 是一部分。`],
            ],
            [
              ["Write the addition", "写出加法"],
              ["The part plus the missing part makes the whole:", "这一部分加上缺少的部分等于整体："],
              [`${s} + \\square = ${w}`],
            ],
          ],
          [`The box is ${w - s}, and $${w} - ${s} = ${w - s}$ too.`, `方框里是 ${w - s}，$${w} - ${s}$ 也等于 ${w - s}。`],
        );
      },
      captioned(
        partWholeBarFigure([5, 8], 1),
        "A bar of 13 split into a part of 5 and an unknown part.",
        "长度为 13 的条形分成 5 和一个未知的部分。",
      ),
    ),
    earlyPoint(
      "subtracting-with-a-known-sum",
      ["Subtracting with a known sum", "用知道的和算减法"],
      [
        "If you know $6 + 7 = 13$, you also know two subtractions. Take 6 from 13 and 7 is left. Take 7 from 13 and 6 is left.\n\nCheck: count back 6 from 13: 12, 11, 10, 9, 8, 7.\n\n> **Watch out.** Take away one part and the other part is left, not the whole. $13 - 6$ is 7, not 13.",
        "知道 $6 + 7 = 13$，也就知道了两个减法：13 减去 6 剩 7，13 减去 7 剩 6。\n\n检验：从 13 往回数 6 个：12、11、10、9、8、7。\n\n> **注意。** 去掉一部分，剩下的是另一部分，不是整体。$13 - 6$ 是 7，不是 13。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const c = a + b;
        const form = rng.bool();
        const away = form ? a : b;
        const left = form ? b : a;
        return solved(
          [`You know that $${a} + ${b} = ${c}$. What is $${c} - ${away}$?`, `已知 $${a} + ${b} = ${c}$。$${c} - ${away}$ 等于多少？`],
          left,
          [
            [
              ["Find the parts", "找出两部分"],
              [`${c} is the whole. ${a} and ${b} are the parts.`, `${c} 是整体，${a} 和 ${b} 是两部分。`],
            ],
            [
              ["Take one part away", "去掉一部分"],
              [`Take away ${away} and the other part is left:`, `去掉 ${away}，剩下另一部分：`],
              [`${c} - ${away} = ${left}`],
            ],
          ],
          [`Count back ${away} from ${c}: you land on ${left}.`, `从 ${c} 往回数 ${away} 个，落在 ${left}。`],
          [
            [c, "That is the whole, before anything is taken.", "这是整体，还没有拿走。"],
            [c + away, "This adds. The sign is minus.", "这是做了加法，符号是减号。"],
            [away, "That is the part taken away.", "这是拿走的那部分。"],
          ],
          partWholeBarFigure([a, b], 2),
        );
      },
      captioned(partWholeBarFigure([6, 7], 2), "A bar of 13 split into parts of 6 and 7.", "长度为 13 的条形分成 6 和 7 两部分。"),
    ),
    earlyPoint(
      "counting-up-through-ten",
      ["Counting up through ten", "经过十往上数"],
      [
        "Find $14 - 8$ by counting up from 8. Jump 2 to get to 10. Then jump 4 to get to 14. The jumps are 2 and 4, and $2 + 4 = 6$.\n\nCheck: $8 + 6 = 14$.\n\n> **Watch out.** Add both jumps. The answer is 6, not just 2 or 4.",
        "用从 8 往上数的方法求 $14 - 8$。先跳 2 到 10，再跳 4 到 14。两跳是 2 和 4，$2 + 4 = 6$。\n\n检验：$8 + 6 = 14$。\n\n> **注意。** 两跳都要加上。答案是 6，不只是 2 或 4。",
      ],
      (rng) => {
        const s = rng.int(4, 9);
        const n = rng.int(11, 19);
        const answer = n - s;
        return solved(
          [
            `The jumps show how to find $${n} - ${s}$ by counting up. What is the difference?`,
            `这些跳表示用往上数的方法求 $${n} - ${s}$。差是多少？`,
          ],
          answer,
          [
            [
              ["Jump to 10", "跳到 10"],
              [`From ${s} to 10 is a jump of ${10 - s}.`, `从 ${s} 到 10 跳了 ${10 - s}。`],
            ],
            [
              ["Jump to the end", "跳到终点"],
              [`From 10 to ${n} is a jump of ${n - 10}. Add the jumps:`, `从 10 到 ${n} 跳了 ${n - 10}。把两跳加起来：`],
              [`${10 - s} + ${n - 10} = ${answer}`],
            ],
          ],
          [`Add back: $${s} + ${answer} = ${n}$.`, `加回去验算：$${s} + ${answer} = ${n}$。`],
          [
            [10 - s, "That is only the first jump.", "这只是第一跳。"],
            [n - 10, "That is only the second jump.", "这只是第二跳。"],
            [n + s, "This adds the two numbers. Count up from the smaller one.", "这把两个数加起来了，应该从小的数往上数。"],
          ],
          hopsFigure([s, 10, n]),
        );
      },
      captioned(
        hopsFigure([8, 10, 14]),
        "A number line with a jump from 8 to 10 and a jump from 10 to 14.",
        "数轴：从 8 跳到 10，再从 10 跳到 14。",
      ),
    ),
  ],
  [
    "Kai has 8 stamps. He needs 13 to fill a page. He thinks: 8 and how many make 13? 2 more make 10, and 3 more make 13. So he needs 5.\n\nCheck: $13 - 8 = 5$.\n\nIn this lesson we use addition to solve subtraction.",
    "凯有 8 张邮票，要 13 张才能贴满一页。他想：8 加几等于 13？再 2 张是 10，再 3 张是 13，所以还要 5 张。\n\n检验：$13 - 8 = 5$。\n\n本课我们用加法来算减法。",
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
        "A fact triangle has the whole at the top and the two parts at the bottom. Here the parts are 5 and 8, and the whole is missing. So add: $5 + 8 = 13$.\n\nCheck: $13 - 5 = 8$.\n\n> **Watch out.** Look where the question mark is first. When the whole is missing, add. Do not subtract.",
        "算式三角形的顶上是整体，下面两个角是两部分。这里两部分是 5 和 8，缺的是整体，所以相加：$5 + 8 = 13$。\n\n检验：$13 - 5 = 8$。\n\n> **注意。** 先看问号在哪里。缺整体就用加法，不要减。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a + b;
        const where = rng.int(0, 2);
        const answer = where === 0 ? c : where === 1 ? a : b;
        const known = where === 1 ? b : a;
        const figure = factTriangleFigure(where === 0 ? null : c, where === 1 ? null : a, where === 2 ? null : b);
        if (where === 0)
          return solved(
            ["What number goes at the question mark?", "问号处应该填几？"],
            c,
            [
              [
                ["Find the question mark", "找问号"],
                ["It is at the top, so the whole is missing.", "问号在顶上，缺的是整体。"],
              ],
              [["Add the parts", "把两部分相加"], ["", ""], [`${a} + ${b} = ${c}`]],
            ],
            [`Take one part back off: $${c} - ${a} = ${b}$.`, `再减去一部分：$${c} - ${a} = ${b}$。`],
            [
              [Math.abs(a - b), "This subtracts. The whole is missing, so add.", "这是做了减法。缺的是整体，要相加。"],
              [a, "That is one part, not the whole.", "这是一部分，不是整体。"],
              [b, "That is one part, not the whole.", "这是一部分，不是整体。"],
            ],
            figure,
          );
        return solved(
          ["What number goes at the question mark?", "问号处应该填几？"],
          answer,
          [
            [
              ["Find the question mark", "找问号"],
              [`It is at a bottom corner, so a part is missing. The whole is ${c}.`, `问号在下面的角上，缺的是一部分。整体是 ${c}。`],
            ],
            [["Take the known part from the whole", "用整体减去知道的部分"], ["", ""], [`${c} - ${known} = ${answer}`]],
          ],
          [`Add the parts: $${known} + ${answer} = ${c}$.`, `把两部分加起来：$${known} + ${answer} = ${c}$。`],
          [
            [c + known, "This adds. A part is missing, so subtract from the whole.", "这是做了加法。缺的是一部分，要用整体减。"],
            [c, "That is the whole, not the missing part.", "这是整体，不是缺少的部分。"],
            [known, "That copies the part you know.", "这照抄了知道的部分。"],
          ],
          figure,
        );
      },
      gradeDrawings2["fact-triangles#the-missing-number-of-a-triangle"],
    ),
    earlyPoint(
      "facts-from-a-triangle",
      ["Facts from a triangle", "从三角形读算式"],
      [
        "The triangle 5, 8, 13 gives four facts: $5 + 8 = 13$, $8 + 5 = 13$, $13 - 5 = 8$ and $13 - 8 = 5$. In an addition the whole comes last. In a subtraction it comes first.\n\nCheck: each fact uses only 5, 8 and 13, and each is true.\n\n> **Watch out.** A subtraction starts with the whole. $5 - 8 = 13$ does not belong.",
        "三角形 5、8、13 可以写出四个算式：$5 + 8 = 13$，$8 + 5 = 13$，$13 - 5 = 8$，$13 - 8 = 5$。加法里整体写在最后，减法里整体写在最前面。\n\n检验：每个算式只用了 5、8、13，而且都是对的。\n\n> **注意。** 减法要从整体开始。$5 - 8 = 13$ 不属于这个三角形。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        const facts = [`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} - ${a} = ${b}`, `${c} - ${b} = ${a}`];
        const right = rng.pick(facts);
        return pickedMath(
          rng,
          ["Which number sentence belongs to this fact triangle?", "哪个算式属于这个算式三角形？"],
          right,
          rng.sample<MathWrong>(
            [
              [
                `${a} + ${c} = ${b}`,
                `${c} is the whole, so adding to it cannot make the smaller ${b}.`,
                `${c} 是整体，加上别的数不可能得到更小的 ${b}。`,
              ],
              [`${a} - ${b} = ${c}`, `A subtraction starts with the whole, ${c}.`, `减法要从整体 ${c} 开始。`],
              [
                `${b} - ${c} = ${a}`,
                `A subtraction starts with the whole, ${c}, not a part.`,
                `减法要从整体 ${c} 开始，不是从一部分开始。`,
              ],
              [`${a} + ${b} = ${c + 1}`, `$${a} + ${b}$ is ${c}, not ${c + 1}.`, `$${a} + ${b}$ 等于 ${c}，不是 ${c + 1}。`],
              [
                `${c} + ${a} = ${b}`,
                `${c} is the whole, so adding to it cannot make the smaller ${b}.`,
                `${c} 是整体，加上别的数不可能得到更小的 ${b}。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Find the whole", "找出整体"],
              [`${c} is at the top. ${a} and ${b} are the parts.`, `顶上是 ${c}，${a} 和 ${b} 是两部分。`],
            ],
            [["Find a true fact with the whole in place", "找出整体位置对、又正确的算式"], ["", ""], [right]],
          ],
          [
            `It is one of the four facts of the triangle: $${facts.join("$, $")}$.`,
            `它是这个三角形的四个算式之一：$${facts.join("$、$")}$。`,
          ],
          factTriangleFigure(c, a, b),
        );
      },
      gradeDrawings2["fact-triangles#facts-from-a-triangle"],
    ),
    earlyPoint(
      "the-fourth-fact-of-a-family",
      ["The fourth fact of a family", "一组算式中的第四个"],
      [
        "A fact family has four facts. Say we know $4 + 5 = 9$, $5 + 4 = 9$ and $9 - 4 = 5$. Both additions are there, and one subtraction. The missing one takes away the other part: $9 - 5 = 4$.\n\nCheck: it uses 4, 5 and 9, and $4 + 5 = 9$ shows it is true.\n\n> **Watch out.** The new fact must not repeat one you have. Swap which part is taken away.",
        "一组算式有四个。比如已经知道 $4 + 5 = 9$，$5 + 4 = 9$，$9 - 4 = 5$。两个加法都有了，减法只有一个。缺的那个减去另一部分：$9 - 5 = 4$。\n\n检验：它用的是 4、5、9，又因为 $4 + 5 = 9$，所以它是对的。\n\n> **注意。** 新的算式不能和已有的重复，要换一个部分来减。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const c = a + b;
        const facts = [`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} - ${a} = ${b}`, `${c} - ${b} = ${a}`];
        const missing = rng.int(0, 3);
        const given = facts.filter((_, i) => i !== missing);
        const list = `$${given.join("$, $")}$`;
        const fourth = facts[missing] as string;
        return pickedMath(
          rng,
          [
            `Three facts of a family are ${list}. Which is the fourth fact?`,
            `一组算式中的三个是 ${list.replaceAll("$, $", "$、$")}。第四个算式是哪个？`,
          ],
          fourth,
          rng.sample<MathWrong>(
            [
              [
                `${c} + ${a} = ${b}`,
                `${c} is the whole, so adding to it cannot make the smaller ${b}.`,
                `${c} 是整体，加上别的数不可能得到更小的 ${b}。`,
              ],
              [`${a} - ${b} = ${c}`, `A subtraction starts with the whole, ${c}.`, `减法要从整体 ${c} 开始。`],
              [`${c} - ${a} = ${a}`, `$${c} - ${a}$ is ${b}, not ${a}.`, `$${c} - ${a}$ 等于 ${b}，不是 ${a}。`],
              [`${b} - ${a} = ${c}`, `A subtraction starts with the whole, ${c}.`, `减法要从整体 ${c} 开始。`],
              [
                `${a} + ${c} = ${b}`,
                `${c} is the whole, so adding to it cannot make the smaller ${b}.`,
                `${c} 是整体，加上别的数不可能得到更小的 ${b}。`,
              ],
            ],
            3,
          ),
          [
            [["List the family", "列出这一组"], [`The four facts of ${a}, ${b} and ${c} are:`, `${a}、${b}、${c} 的四个算式是：`], facts],
            [["Find the one not given", "找出没给的那个"], ["", ""], [fourth]],
          ],
          [
            `It uses ${a}, ${b} and ${c}, and $${a} + ${b} = ${c}$ shows it is true.`,
            `它用的是 ${a}、${b}、${c}，又因为 $${a} + ${b} = ${c}$，所以它是对的。`,
          ],
        );
      },
      captioned(
        factTriangleFigure(9, 4, 5),
        "A fact triangle with 9 at the top and 4 and 5 at the bottom.",
        "算式三角形：顶上是 9，下面是 4 和 5。",
      ),
    ),
  ],
  [
    "Mom puts 5 red apples and 8 green apples in a bowl. That is 13 apples. If the 5 red ones are eaten, 8 are left.\n\nCheck: $5 + 8 = 13$ and $13 - 5 = 8$.\n\nIn this lesson we use three numbers in a triangle to find a missing number and four facts.",
    "妈妈在碗里放了 5 个红苹果和 8 个青苹果，一共 13 个。如果吃掉 5 个红的，还剩 8 个。\n\n检验：$5 + 8 = 13$，$13 - 5 = 8$。\n\n本课我们用三角形里的三个数，找出缺少的数和一组四个算式。",
  ],
);

/** sideValue works out one side of a number sentence written with + and - only. */
const sideValue = (side: string): number =>
  side
    .split(/(?=[+-])/)
    .map((piece) => Number(piece.replace(/\s/g, "")))
    .reduce((sum, v) => sum + v, 0);

/** checkLine writes both sides' values of a sentence with = or ≠ between them. */
const checkLine = (sentence: string): string => {
  const [l, r] = sentence.split("=").map((s) => sideValue(s.trim())) as [number, number];
  return `${l} ${l === r ? "=" : "\\ne"} ${r}`;
};

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
        "The equal sign says both sides are worth the same. Test $9 = 4 + 5$: the left side is 9, and the right side is 9. So it is true, even with the answer on the left.\n\nCheck: count the counters: 4 filled and 5 hollow make 9.\n\n> **Watch out.** Work out each side before you decide. Do not judge by how a sentence looks.",
        "等号表示两边一样多。判断 $9 = 4 + 5$：左边是 9，右边也是 9，所以它是对的，答案写在左边也没关系。\n\n检验：数一数圆片：4 个实心的和 5 个空心的，一共 9 个。\n\n> **注意。** 先算出每一边再判断，不要看样子就下结论。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = a + b;
        const trueOnes = [
          ...new Set([
            `${c} = ${a} + ${b}`,
            `${a} + ${b} = ${b} + ${a}`,
            `${c} = ${c}`,
            `${c} - ${a} = ${b}`,
            `${a} + ${b} = ${a + 1} + ${b - 1}`,
          ]),
        ];
        const bad = rng.pick([
          `${c} = ${a} + ${b + 1}`,
          `${a} + ${b} = ${a} + ${b + 1}`,
          `${c} - ${a} = ${a + b + 1}`,
          `${c} = ${c + 1}`,
          `${a} + ${b} = ${a + 2} + ${b + 1}`,
        ]);
        const [l, r] = bad.split("=").map((s) => sideValue(s.trim())) as [number, number];
        return pickedMath(
          rng,
          ["Three of these sentences are true and one is false. Which one is false?", "下面有三个算式是对的，一个是错的。错的是哪一个？"],
          bad,
          rng.sample(trueOnes, 3).map((s): MathWrong => {
            const v = sideValue(s.split("=")[0] ?? "");
            return [s, `Both sides are ${v}, so this one is true.`, `两边都是 ${v}，这个是对的。`];
          }),
          [
            [
              ["Work out each side", "算出每一边"],
              [`In $${bad}$ the left side is ${l} and the right side is ${r}.`, `$${bad}$ 的左边是 ${l}，右边是 ${r}。`],
            ],
            [
              ["Compare", "比较"],
              [`${l} and ${r} are not the same, so it is false.`, `${l} 和 ${r} 不一样，所以它是错的。`],
              [`${l} \\ne ${r}`],
            ],
          ],
          ["In each of the other three sentences, the two sides come out the same.", "其他三个算式，两边算出来都一样。"],
        );
      },
      captioned(
        tenFramesFigure(4, 5),
        "A ten-frame with 4 filled counters and 5 hollow counters, 9 in all.",
        "十格框里有 4 个实心圆片和 5 个空心圆片，一共 9 个。",
      ),
    ),
    earlyPoint(
      "sums-on-both-sides",
      ["Sums on both sides", "两边都是和"],
      [
        "Both sides of an equal sign can be sums. Solve $6 + 2 = 5 + \\square$. The left side is 8. 5 and 3 make 8, so the box is 3.\n\nCheck: the 6 gave 1 to the 2. Now they are 5 and 3, still 8 in all.\n\n> **Watch out.** The box is not 8. 8 is the value of the whole side.",
        "等号两边都可以是和。解 $6 + 2 = 5 + \\square$：左边是 8，5 和 3 合起来是 8，所以方框里是 3。\n\n检验：6 分了 1 给 2，变成 5 和 3，合起来还是 8。\n\n> **注意。** 方框里不是 8，8 是整个一边的值。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const b = rng.int(3, 9);
        const shift = rng.int(1, 2);
        const answer = b + shift;
        const left = a - shift;
        const sum = a + b;
        return solved(
          [`What number goes in the box? $${a} + ${b} = ${left} + \\square$`, `方框里填几？$${a} + ${b} = ${left} + \\square$`],
          answer,
          [
            [["Work out the left side", "算出左边"], ["", ""], [`${a} + ${b} = ${sum}`]],
            [
              ["Make the right side match", "让右边相等"],
              [`${left} and what make ${sum}?`, `${left} 加几等于 ${sum}？`],
              [`${sum} - ${left} = ${answer}`],
            ],
          ],
          [
            `${a} gave ${shift} to ${b}: $${a} - ${shift} = ${left}$ and $${b} + ${shift} = ${answer}$, so the sum stays ${sum}.`,
            `${a} 分了 ${shift} 给 ${b}：$${a} - ${shift} = ${left}$，$${b} + ${shift} = ${answer}$，和还是 ${sum}。`,
          ],
          [
            [
              sum,
              `That is the value of the left side. The box is only one part of the right side.`,
              "这是左边的值，方框只是右边的一部分。",
            ],
            [b, `That copies ${b}. The other number changed, so this one changes too.`, `这照抄了 ${b}。另一个数变了，这个数也要变。`],
            [
              b - shift,
              `This moves ${shift} the wrong way. ${a} got smaller, so the box must be bigger than ${b}.`,
              `这把 ${shift} 挪反了。${a} 变小了，方框里要比 ${b} 大。`,
            ],
            [
              sum + left,
              "This adds every number. The box only has to make the sides match.",
              "这是把所有数都加起来了，方框只要让两边相等。",
            ],
          ],
          tenFramesFigure(a, b),
        );
      },
      captioned(
        tenFramesFigure(6, 2),
        "A ten-frame with 6 filled counters and 2 hollow counters, 8 in all.",
        "十格框里有 6 个实心圆片和 2 个空心圆片，一共 8 个。",
      ),
    ),
    earlyPoint(
      "how-many-sentences-are-true",
      ["How many sentences are true", "有几个算式是对的"],
      [
        "Test the sentences one at a time. $9 = 4 + 5$: both sides are 9, true. $4 + 5 = 5 + 5$: 9 and 10, false. $9 - 4 = 5$: 5 and 5, true. So 2 are true.\n\nCheck: 1 is false, and $2 + 1 = 3$ sentences.\n\n> **Watch out.** Count the true ones only, not the false ones.",
        "一个一个地判断。$9 = 4 + 5$：两边都是 9，对。$4 + 5 = 5 + 5$：9 和 10，错。$9 - 4 = 5$：5 和 5，对。所以有 2 个是对的。\n\n检验：有 1 个错的，$2 + 1 = 3$，正好 3 个算式。\n\n> **注意。** 只数对的，不要数错的。",
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
        return solved(
          [`How many of these sentences are true? ${list}`, `下面的算式中，有几个是对的？${listZh}`],
          answer,
          [
            [["Work out both sides of each", "算出每个算式的两边"], ["", ""], lines.map((l) => checkLine(l.s))],
            [
              ["Count the true ones", "数对的"],
              [`${answer} of them have two sides that match.`, `其中 ${answer} 个两边相等。`],
            ],
          ],
          [
            `Count the false ones: ${3 - answer}. And $${answer} + ${3 - answer} = 3$ sentences.`,
            `数错的：${3 - answer} 个。$${answer} + ${3 - answer} = 3$，正好 3 个算式。`,
          ],
          [
            [3 - answer, "That counts the false sentences.", "这数的是错的算式。"],
            [3, "Not every sentence is true. Work out both sides of each.", "不是每个都对，要算出每个算式的两边。"],
            [0, "Some sentences are true. Work out both sides of each.", "有的算式是对的，要算出每个算式的两边。"],
          ],
        );
      },
      captioned(
        tenFramesFigure(4, 5),
        "A ten-frame with 4 filled counters and 5 hollow counters, 9 in all.",
        "十格框里有 4 个实心圆片和 5 个空心圆片，一共 9 个。",
      ),
    ),
  ],
  [
    "Lily says $3 + 4 = 7$. Sam says $7 = 3 + 4$. Who is right? Both are! Each side is worth 7 either way.\n\nCheck: work out each side: 7 and 7.\n\nIn this lesson we tell whether a number sentence is true or false.",
    "莉莉说 $3 + 4 = 7$，萨姆说 $7 = 3 + 4$。谁对？两个人都对！不管怎么写，两边都是 7。\n\n检验：算出每一边：7 和 7。\n\n本课我们判断算式是对还是错。",
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
        "In $\\square + 6 = 13$, the box is a part, 6 is a part, and 13 is the whole. Take the known part from the whole: $13 - 6 = 7$.\n\nCheck: $7 + 6 = 13$.\n\n> **Watch out.** The box is a part, so it is smaller than 13. It is not 13.",
        "在 $\\square + 6 = 13$ 中，方框是一部分，6 是一部分，13 是整体。用整体减去知道的部分：$13 - 6 = 7$。\n\n检验：$7 + 6 = 13$。\n\n> **注意。** 方框是一部分，比 13 小，不是 13。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 8);
        const c = a + b;
        return solved(
          [`What number goes in the box? $\\square + ${b} = ${c}$`, `方框里填几？$\\square + ${b} = ${c}$`],
          a,
          [
            [
              ["Find the whole and a part", "找出整体和一部分"],
              [`${c} is the whole. ${b} is a part.`, `${c} 是整体，${b} 是一部分。`],
            ],
            [["Take the part from the whole", "用整体减去这一部分"], ["", ""], [`${c} - ${b} = ${a}`]],
          ],
          [`Put it in the box: $${a} + ${b} = ${c}$.`, `填进方框：$${a} + ${b} = ${c}$。`],
          [
            [c, "That is the whole. The box is a part.", "这是整体，方框是一部分。"],
            [c + b, "This adds. The box is smaller than the whole.", "这是做了加法，方框比整体小。"],
            [b, "That copies the other part.", "这照抄了另一部分。"],
          ],
          partWholeBarFigure([a, b], 0),
        );
      },
      captioned(
        partWholeBarFigure([7, 6], 0),
        "A bar of 13 split into an unknown part and a part of 6.",
        "长度为 13 的条形分成一个未知部分和 6。",
      ),
    ),
    earlyPoint(
      "the-box-comes-first-in-subtraction",
      ["The box comes first in subtraction", "方框在减法的最前面"],
      [
        "In $\\square - 5 = 8$, the box is the start. 5 were taken away and 8 are left. Put them back together: $8 + 5 = 13$.\n\nCheck: $13 - 5 = 8$.\n\n> **Watch out.** The start is the biggest number here. Add to find it, even though the sentence shows minus.",
        "在 $\\square - 5 = 8$ 中，方框是开始的数。拿走了 5 个，还剩 8 个。把它们合起来：$8 + 5 = 13$。\n\n检验：$13 - 5 = 8$。\n\n> **注意。** 这里开始的数最大。虽然算式里是减号，求它却要用加法。",
      ],
      (rng) => {
        const s = rng.int(2, 9);
        const left = rng.int(2, 11);
        const c = s + left;
        return solved(
          [`What number goes in the box? $\\square - ${s} = ${left}$`, `方框里填几？$\\square - ${s} = ${left}$`],
          c,
          [
            [
              ["See what the box is", "看方框是什么"],
              [`The box is the start. ${s} were taken away and ${left} are left.`, `方框是开始的数。拿走了 ${s}，还剩 ${left}。`],
            ],
            [["Put them back together", "合起来"], ["", ""], [`${left} + ${s} = ${c}`]],
          ],
          [`Put it in the box: $${c} - ${s} = ${left}$.`, `填进方框：$${c} - ${s} = ${left}$。`],
          [
            [Math.abs(left - s), "This subtracts. The start must be more than what is left.", "这是做了减法，开始的数要比剩下的多。"],
            [s, "That is how many were taken away.", "这是拿走的个数。"],
            [left, "That is how many are left, not the start.", "这是剩下的个数，不是开始的数。"],
          ],
          partWholeBarFigure([left, s], -1),
        );
      },
      captioned(
        partWholeBarFigure([8, 5], -1),
        "A bar with an unknown whole, split into parts of 8 and 5.",
        "整体未知的条形，分成 8 和 5 两部分。",
      ),
    ),
    earlyPoint(
      "the-whole-on-the-left",
      ["The whole on the left", "整体写在左边"],
      [
        "An equal sign works both ways. $12 = 5 + \\square$ means the same as $5 + \\square = 12$. 5 and 7 make 12, so the box is 7.\n\nCheck: $12 - 5 = 7$.\n\n> **Watch out.** 12 is the whole, even on the left. The box is not 12.",
        "等号两边可以互换。$12 = 5 + \\square$ 和 $5 + \\square = 12$ 的意思一样。5 和 7 合起来是 12，所以方框里是 7。\n\n检验：$12 - 5 = 7$。\n\n> **注意。** 12 写在左边也还是整体，方框里不是 12。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.int(2, 9);
        const c = a + b;
        const plus = rng.bool();
        const prompt: Pair = plus
          ? [`What number goes in the box? $${c} = ${a} + \\square$`, `方框里填几？$${c} = ${a} + \\square$`]
          : [`What number goes in the box? $${a} = ${c} - \\square$`, `方框里填几？$${a} = ${c} - \\square$`];
        return solved(
          prompt,
          b,
          [
            [["Read it from right to left", "从右往左读"], ["", ""], [plus ? `${a} + \\square = ${c}` : `${c} - \\square = ${a}`]],
            [
              ["Find the missing part", "求缺少的部分"],
              [`${c} is the whole and ${a} is a part.`, `${c} 是整体，${a} 是一部分。`],
              [`${c} - ${a} = ${b}`],
            ],
          ],
          plus
            ? [`Put it in the box: $${a} + ${b} = ${c}$.`, `填进方框：$${a} + ${b} = ${c}$。`]
            : [`Put it in the box: $${c} - ${b} = ${a}$.`, `填进方框：$${c} - ${b} = ${a}$。`],
          [
            [c, `${c} is the whole. The box is a part.`, `${c} 是整体，方框是一部分。`],
            [c + a, "This adds the two numbers.", "这是把两个数加起来了。"],
            [a, `That copies ${a}.`, `这照抄了 ${a}。`],
          ],
          partWholeBarFigure([a, b], 1),
        );
      },
      captioned(
        partWholeBarFigure([5, 7], 1),
        "A bar of 12 split into a part of 5 and an unknown part.",
        "长度为 12 的条形分成 5 和一个未知部分。",
      ),
    ),
  ],
  [
    "A jar had some marbles. Nina took out 5, and 8 were left. How many were in the jar? Put the marbles back: 8 and 5 make 13.\n\nCheck: $13 - 5 = 8$.\n\nIn this lesson we find a missing number wherever the box is.",
    "罐子里有一些弹珠。妮娜拿出 5 颗，还剩 8 颗。罐子里原来有几颗？把弹珠放回去：8 和 5 合起来是 13。\n\n检验：$13 - 5 = 8$。\n\n本课我们无论方框在哪里，都能求出缺少的数。",
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
        "Ava has 6 shells and finds 4 more. Things are joined, so use plus. The total is unknown, so the box goes after the equal sign: $6 + 4 = \\square$.\n\nCheck: solve it: 10 shells, more than 6, as it should be.\n\n> **Watch out.** Joining uses plus, not minus.",
        "阿娃有 6 个贝壳，又找到 4 个。东西合起来，所以用加号。总数不知道，方框就写在等号后面：$6 + 4 = \\square$。\n\n检验：算一算：10 个，比 6 个多，说得通。\n\n> **注意。** 合起来用加号，不用减号。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const a = rng.int(3, 11);
        const b = rng.int(2, 8);
        const c = a + b;
        const plus: Walk = [
          ["Choose the sign", "选符号"],
          ["Something is added, so use plus.", "又得到了，所以用加号。"],
        ];
        if (rng.bool())
          return pickedMath(
            rng,
            [
              `${name} has ${a} ${thing.en} and gets ${b} more. Which number sentence shows how many ${name} has now?`,
              `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到 ${b} ${thing.unit}。哪个算式能表示 ${name} 现在有多少${thing.unit}？`,
            ],
            `${a} + ${b} = \\square`,
            [
              [`${a} - ${b} = \\square`, "Getting more joins, so use plus, not minus.", "又得到是合起来，用加号，不用减号。"],
              [
                `${a} + \\square = ${b}`,
                `The total is unknown, so the box goes after the equal sign. ${b} is the part that came.`,
                `总数不知道，方框应该在等号后面。${b} 是后来得到的部分。`,
              ],
              [`\\square - ${a} = ${b + 1}`, `This takes away, and ${b + 1} is not in the story.`, `这是减法，而且故事里没有 ${b + 1}。`],
            ],
            [
              plus,
              [
                ["Place the box", "放方框"],
                ["The total is unknown, so it goes after the equal sign.", "总数不知道，方框写在等号后面。"],
                [`${a} + ${b} = \\square`],
              ],
            ],
            [`Solve it: ${c}, which is more than ${a}, as it should be.`, `算一算：${c}，比 ${a} 多，说得通。`],
            partWholeBarFigure([a, b], -1),
          );
        return pickedMath(
          rng,
          [
            `${name} has ${a} ${thing.en} and gets some more. Now ${name} has ${c}. Which number sentence tells this story?`,
            `${name} 有 ${a} ${thing.unit}${thing.zh}，又得到一些，现在有 ${c} ${thing.unit}。哪个算式与这个故事相符？`,
          ],
          `${a} + \\square = ${c}`,
          [
            [
              `${a} + ${c} = \\square`,
              `${c} is already the total. The box is the part that came.`,
              `${c} 已经是总数了，方框是后来得到的部分。`,
            ],
            [`\\square + ${c} = ${a}`, `The total ${c} goes after the equal sign.`, `总数 ${c} 应该写在等号后面。`],
            [`${c} + \\square = ${a}`, `Adding to ${c} cannot make the smaller ${a}.`, `${c} 再加上别的数，不可能得到更小的 ${a}。`],
          ],
          [
            plus,
            [
              ["Place the box", "放方框"],
              ["The amount that came is unknown, so it goes after the plus sign.", "后来得到的数不知道，方框写在加号后面。"],
              [`${a} + \\square = ${c}`],
            ],
          ],
          [`Solve it: the box is ${b}, and $${a} + ${b} = ${c}$.`, `算一算：方框里是 ${b}，$${a} + ${b} = ${c}$。`],
          partWholeBarFigure([a, b], 1),
        );
      },
      captioned(partWholeBarFigure([6, 4], -1), "A bar with parts of 6 and 4 and an unknown whole.", "条形分成 6 和 4 两部分，整体未知。"),
    ),
    earlyPoint(
      "sentences-for-taking-away",
      ["Sentences for taking away", "表示拿走的算式"],
      [
        "Ben has 12 grapes and eats 5. Things go away, so use minus. Start with 12, take 5, and the box is what is left: $12 - 5 = \\square$.\n\nCheck: solve it: 7 left, fewer than 12, as it should be.\n\n> **Watch out.** Write the start first. $5 - 12$ does not tell this story.",
        "本有 12 颗葡萄，吃了 5 颗。东西少了，所以用减号。从 12 开始，减去 5，方框是剩下的：$12 - 5 = \\square$。\n\n检验：算一算：剩 7 颗，比 12 颗少，说得通。\n\n> **注意。** 开始的数写在最前面。$5 - 12$ 讲的不是这个故事。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const c = rng.int(9, 19);
        const b = rng.int(2, c - 3);
        const left = c - b;
        const form = rng.int(0, 2);
        const minus: Walk = [
          ["Choose the sign", "选符号"],
          ["Some are given away, so use minus.", "送出去了，所以用减号。"],
        ];
        if (form === 0)
          return pickedMath(
            rng,
            [
              `${name} has ${c} ${thing.en} and gives away ${b}. Which number sentence shows how many are left?`,
              `${name} 有 ${c} ${thing.unit}${thing.zh}，送出去 ${b} ${thing.unit}。哪个算式能表示还剩多少${thing.unit}？`,
            ],
            `${c} - ${b} = \\square`,
            [
              [`${c} + ${b} = \\square`, "Giving away takes away, so use minus.", "送出去是减少，要用减号。"],
              [`${b} - ${c} = \\square`, `Start with the ${c} that ${name} had, not ${b}.`, `要从原来的 ${c} 开始，不是从 ${b} 开始。`],
              [`\\square - ${c} = ${b}`, `The start, ${c}, is known. The box is what is left.`, `开始的数 ${c} 是知道的，方框是剩下的。`],
            ],
            [
              minus,
              [
                ["Place the box", "放方框"],
                ["What is left is unknown, so it goes after the equal sign.", "剩下的不知道，方框写在等号后面。"],
                [`${c} - ${b} = \\square`],
              ],
            ],
            [`Solve it: ${left} left, fewer than ${c}, as it should be.`, `算一算：剩 ${left}，比 ${c} 少，说得通。`],
            partWholeBarFigure([left, b], 0),
          );
        if (form === 1)
          return pickedMath(
            rng,
            [
              `${name} has ${c} ${thing.en} and gives some away. Now ${left} are left. Which number sentence tells this story?`,
              `${name} 有 ${c} ${thing.unit}${thing.zh}，送出去一些，还剩 ${left} ${thing.unit}。哪个算式与这个故事相符？`,
            ],
            `${c} - \\square = ${left}`,
            [
              [`${c} + ${left} = \\square`, "This adds. Some were given away.", "这是加法，可是有一些送出去了。"],
              [
                `${left} - \\square = ${c}`,
                `Start with the ${c} that ${name} had, not ${left}.`,
                `要从原来的 ${c} 开始，不是从 ${left} 开始。`,
              ],
              [
                `\\square - ${c} = ${left}`,
                `The start, ${c}, is known. The box is how many were given away.`,
                `开始的数 ${c} 是知道的，方框是送出去的个数。`,
              ],
            ],
            [
              minus,
              [
                ["Place the box", "放方框"],
                ["How many were given away is unknown, so it goes after the minus sign.", "送出去几个不知道，方框写在减号后面。"],
                [`${c} - \\square = ${left}`],
              ],
            ],
            [`Solve it: the box is ${b}, and $${c} - ${b} = ${left}$.`, `算一算：方框里是 ${b}，$${c} - ${b} = ${left}$。`],
            partWholeBarFigure([left, b], 1),
          );
        return pickedMath(
          rng,
          [
            `${name} had some ${thing.en} and gave away ${b}. Now ${left} are left. Which number sentence tells this story?`,
            `${name} 原来有一些${thing.zh}，送出去 ${b} ${thing.unit}，还剩 ${left} ${thing.unit}。哪个算式与这个故事相符？`,
          ],
          `\\square - ${b} = ${left}`,
          [
            [
              `${b} - ${left} = \\square`,
              "This starts with the ones given away. The start is unknown.",
              "这是从送出去的数开始的，可开始的数不知道。",
            ],
            [
              `${left} - ${b} = \\square`,
              "This starts with what is left. The start is unknown.",
              "这是从剩下的数开始的，可开始的数不知道。",
            ],
            [`\\square + ${b} = ${left}`, `This adds ${b}, but ${b} were given away.`, `这是加上 ${b}，可是 ${b} 个是送出去的。`],
          ],
          [
            minus,
            [
              ["Place the box", "放方框"],
              ["The start is unknown, so the box comes first.", "开始的数不知道，方框写在最前面。"],
              [`\\square - ${b} = ${left}`],
            ],
          ],
          [`Solve it: the box is ${c}, and $${c} - ${b} = ${left}$.`, `算一算：方框里是 ${c}，$${c} - ${b} = ${left}$。`],
          partWholeBarFigure([left, b], -1),
        );
      },
      captioned(
        partWholeBarFigure([7, 5], 0),
        "A bar of 12 split into an unknown part and a part of 5.",
        "长度为 12 的条形分成一个未知部分和 5。",
      ),
    ),
    earlyPoint(
      "sentences-for-comparing",
      ["Sentences for comparing", "表示比较的算式"],
      [
        "Max has 12 cards and Eve has 7. How many more does Max have? Find the difference: $12 - 7 = \\square$. Or ask what 7 needs to reach 12: $7 + \\square = 12$.\n\nCheck: both give 5, and $7 + 5 = 12$.\n\n> **Watch out.** In a subtraction, write the bigger number first. $7 - 12$ does not work.",
        "马克斯有 12 张卡片，伊芙有 7 张。马克斯多几张？求差：$12 - 7 = \\square$。也可以问 7 还要几个才到 12：$7 + \\square = 12$。\n\n检验：两种写法都得 5，$7 + 5 = 12$。\n\n> **注意。** 写减法时，大的数写在前面。$7 - 12$ 不行。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        const big = rng.int(8, 19);
        const small = rng.int(2, big - 2);
        const d = big - small;
        const right = rng.bool() ? `${big} - ${small} = \\square` : `${small} + \\square = ${big}`;
        return pickedMath(
          rng,
          [
            `${p} has ${big} ${thing.en} and ${q} has ${small}. Which number sentence shows how many more ${p} has than ${q}?`,
            `${p} 有 ${big} ${thing.unit}${thing.zh}，${q} 有 ${small} ${thing.unit}。哪个算式能表示 ${p} 比 ${q} 多多少${thing.unit}？`,
          ],
          right,
          [
            [
              `${big} + ${small} = \\square`,
              "This puts the two groups together. The question asks how many more.",
              "这是把两组合起来，题目问的是多多少。",
            ],
            [`${small} - ${big} = \\square`, "In a subtraction, start with the bigger number.", "减法要从大的数开始。"],
            [
              `${big} + \\square = ${small}`,
              `Adding to ${big} cannot make the smaller ${small}.`,
              `${big} 再加上别的数，不可能得到更小的 ${small}。`,
            ],
          ],
          [
            [
              ["Find what is asked", "看问的是什么"],
              ["How many more is the difference between the two groups.", "多多少，就是两组的差。"],
            ],
            [["Write the difference", "写出求差的算式"], ["", ""], [right]],
          ],
          [`Solve it: the box is ${d}, and $${small} + ${d} = ${big}$.`, `算一算：方框里是 ${d}，$${small} + ${d} = ${big}$。`],
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [12, 7], "gap"),
        "Bar A is 12 and bar B is 7. The extra piece of A is unknown.",
        "长条 A 是 12，长条 B 是 7，A 多出的部分未知。",
      ),
    ),
  ],
  [
    "Ava has 6 shells and finds 4 more. We can write the story as $6 + 4 = \\square$. The box stands for the number we do not know yet.\n\nCheck: solve it: $6 + 4 = 10$ shells.\n\nIn this lesson we write a story as a number sentence with a box.",
    "阿娃有 6 个贝壳，又找到 4 个。我们可以把这个故事写成 $6 + 4 = \\square$，方框代表还不知道的数。\n\n检验：算一算：$6 + 4 = 10$ 个贝壳。\n\n本课我们把故事写成带方框的算式。",
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
        "Jo has 6 stickers in a bag and 9 in a box. In the bar model, the top bar is the whole. The bottom bar is cut into the parts, 6 and 9. The question mark is on top, so add: $6 + 9 = 15$.\n\nCheck: $15 - 9 = 6$.\n\n> **Watch out.** The whole is longer than each part. It cannot be 3, which is smaller than 6.",
        "乔的袋子里有 6 张贴纸，盒子里有 9 张。线段图上面的长条是整体，下面的长条分成两部分：6 和 9。问号在上面，所以相加：$6 + 9 = 15$。\n\n检验：$15 - 9 = 6$。\n\n> **注意。** 整体比每一部分都长，不可能是比 6 还小的 3。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(2, 19 - a);
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `${name} has ${a} ${thing.en} in a bag and ${b} in a box. The bar model shows the story. How many ${thing.en} are there in all?`,
            `${name} 的袋子里有 ${a} ${thing.unit}${thing.zh}，盒子里有 ${b} ${thing.unit}。线段图表示这个故事。一共有多少${thing.unit}${thing.zh}？`,
          ],
          a + b,
          [
            [
              ["Find the question mark", "找问号"],
              ["It is on the top bar, so the whole is unknown.", "问号在上面的长条里，整体不知道。"],
            ],
            [["Add the parts", "把两部分相加"], ["", ""], [`${a} + ${b} = ${a + b}`]],
          ],
          [`Take one part back off: $${a + b} - ${b} = ${a}$.`, `再减去一部分：$${a + b} - ${b} = ${a}$。`],
          [
            [Math.abs(a - b), "This subtracts. The whole is the parts put together.", "这是做了减法，整体是两部分合起来。"],
            [a, "That is only the bag.", "这只是袋子里的。"],
            [b, "That is only the box.", "这只是盒子里的。"],
          ],
          partWholeBarFigure([a, b], -1),
        );
      },
      gradeDrawings2["part-and-whole-bar-models#the-whole-from-its-parts"],
    ),
    earlyPoint(
      "a-part-from-the-whole",
      ["A part from the whole", "由整体求部分"],
      [
        "Here the whole is 14 and one part is 9. The question mark is in the bottom bar. The bars are the same length, so take the known part away: $14 - 9 = 5$.\n\nCheck: count up from 9 to 14: 10, 11, 12, 13, 14. That is 5.\n\n> **Watch out.** A part is smaller than the whole. Do not add 14 and 9.",
        "这里整体是 14，一部分是 9，问号在下面的长条里。两个长条一样长，所以用整体减去已知的部分：$14 - 9 = 5$。\n\n检验：从 9 往上数到 14：10、11、12、13、14，数了 5 个。\n\n> **注意。** 部分比整体小，不要把 14 和 9 加起来。",
      ],
      (rng) => {
        const all = rng.int(8, 20);
        const a = rng.int(2, all - 2);
        const b = all - a;
        const hideFirst = rng.bool();
        const known = hideFirst ? b : a;
        const answer = hideFirst ? a : b;
        return solved(
          ["What number goes at the question mark?", "问号处应该填几？"],
          answer,
          [
            [
              ["Find the whole and a part", "找出整体和一部分"],
              [`The whole is ${all}. One part is ${known}.`, `整体是 ${all}，一部分是 ${known}。`],
            ],
            [["Take the part away", "减去这一部分"], ["", ""], [`${all} - ${known} = ${answer}`]],
          ],
          [`Add the parts: $${known} + ${answer} = ${all}$.`, `把两部分加起来：$${known} + ${answer} = ${all}$。`],
          [
            [all + known, "This adds. A part is smaller than the whole.", "这是做了加法，部分比整体小。"],
            [all, "That is the whole, not the missing part.", "这是整体，不是缺少的部分。"],
            [known, "That copies the part you know.", "这照抄了已知的部分。"],
          ],
          partWholeBarFigure([a, b], hideFirst ? 0 : 1),
        );
      },
      captioned(
        partWholeBarFigure([9, 5], 1),
        "A bar model: the whole is 14, one part is 9, and the other part is unknown.",
        "线段图：整体是 14，一部分是 9，另一部分未知。",
      ),
    ),
    earlyPoint(
      "bars-with-three-parts",
      ["Bars with three parts", "有三部分的线段图"],
      [
        "A whole can have three parts. Here the whole is 13, and two parts are 4 and 3. Add the known parts: $4 + 3 = 7$. Take that from the whole: $13 - 7 = 6$.\n\nCheck: $4 + 6 + 3 = 13$.\n\n> **Watch out.** Take away both known parts, not just one. $13 - 4 = 9$ is too big.",
        "整体可以有三部分。这里整体是 13，两部分是 4 和 3。先把知道的部分加起来：$4 + 3 = 7$；再用整体减去它：$13 - 7 = 6$。\n\n检验：$4 + 6 + 3 = 13$。\n\n> **注意。** 两个已知部分都要减去，不能只减一个。$13 - 4 = 9$ 太大了。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const c = rng.int(2, 6);
        const all = a + b + c;
        const hidden = rng.int(-1, 2);
        const figure = partWholeBarFigure([a, b, c], hidden);
        if (hidden === -1)
          return solved(
            ["What number goes at the question mark?", "问号处应该填几？"],
            all,
            [
              [["Add two parts", "先加两部分"], ["", ""], [`${a} + ${b} = ${a + b}`]],
              [["Add the third part", "再加第三部分"], ["", ""], [`${a + b} + ${c} = ${all}`]],
            ],
            [
              `Add in another order: $${b} + ${c} = ${b + c}$ and $${b + c} + ${a} = ${all}$.`,
              `换个顺序加：$${b} + ${c} = ${b + c}$，$${b + c} + ${a} = ${all}$。`,
            ],
            [
              [a + b, `This leaves out the ${c}.`, `这漏掉了 ${c}。`],
              [b + c, `This leaves out the ${a}.`, `这漏掉了 ${a}。`],
              [a + c, `This leaves out the ${b}.`, `这漏掉了 ${b}。`],
            ],
            figure,
          );
        const parts = [a, b, c];
        const answer = parts[hidden] as number;
        const [k0, k1] = parts.filter((_, i) => i !== hidden) as [number, number];
        return solved(
          ["What number goes at the question mark?", "问号处应该填几？"],
          answer,
          [
            [["Add the known parts", "把已知部分加起来"], ["", ""], [`${k0} + ${k1} = ${k0 + k1}`]],
            [["Take them from the whole", "用整体减去它们"], ["", ""], [`${all} - ${k0 + k1} = ${answer}`]],
          ],
          [`Add all three parts: $${a} + ${b} + ${c} = ${all}$.`, `把三部分都加起来：$${a} + ${b} + ${c} = ${all}$。`],
          [
            [all, "That is the whole, not the missing part.", "这是整体，不是缺少的部分。"],
            [k0 + k1, "That is the two known parts. Take them from the whole.", "这是两个已知部分的和，还要用整体减去它。"],
            [all - k0, `This takes away only ${k0}. Take away ${k1} too.`, `这只减去了 ${k0}，还要减去 ${k1}。`],
          ],
          figure,
        );
      },
      captioned(
        partWholeBarFigure([4, 6, 3], 1),
        "A bar model: the whole is 13, cut into 4, an unknown part, and 3.",
        "线段图：整体是 13，分成 4、一个未知部分和 3。",
      ),
    ),
  ],
  [
    "Jo has 6 stickers in a bag and 9 in a box. Draw one long bar for all the stickers. Cut it into a piece for 6 and a piece for 9.\n\nCheck: $6 + 9 = 15$, so the long bar is 15.\n\nIn this lesson we use bar models to find a whole or a missing part.",
    "乔的袋子里有 6 张贴纸，盒子里有 9 张。画一个长条表示所有的贴纸，再把它分成 6 和 9 两段。\n\n检验：$6 + 9 = 15$，长条是 15。\n\n本课我们用线段图求整体或缺少的部分。",
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
        "Bar A is 12 and bar B is 7. Line them up at the left. A sticks out past B. That piece is $12 - 7 = 5$. So A has 5 more, and B has 5 fewer.\n\nCheck: $7 + 5 = 12$.\n\n> **Watch out.** The answer is the piece that sticks out, not the long bar. It is 5, not 12.",
        "长条 A 是 12，长条 B 是 7。把它们的左端对齐，A 比 B 多出一段：$12 - 7 = 5$。所以 A 多 5，B 少 5。\n\n检验：$7 + 5 = 12$。\n\n> **注意。** 答案是多出的那段，不是长的长条。是 5，不是 12。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const big = rng.int(7, 20);
        const small = rng.int(2, big - 2);
        const swap = rng.bool();
        const fewer = rng.bool();
        const thing = rng.pick(earlyThings);
        const answer = big - small;
        return solved(
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
          [
            [
              ["Line up the bars", "对齐长条"],
              [`${p}'s bar is ${big}. ${q}'s bar is ${small}.`, `${p} 的长条是 ${big}，${q} 的长条是 ${small}。`],
            ],
            [["Find the piece that sticks out", "求多出的那段"], ["", ""], [`${big} - ${small} = ${answer}`]],
          ],
          [`Add it to the short bar: $${small} + ${answer} = ${big}$.`, `把它加到短的长条上：$${small} + ${answer} = ${big}$。`],
          [
            [big + small, "This puts both bars together. The question asks for the difference.", "这是把两个长条合起来了，题目问的是差。"],
            [big, `That is ${p}'s whole bar, not the piece that sticks out.`, `这是 ${p} 的整个长条，不是多出的那段。`],
            [small, `That is ${q}'s bar, not the difference.`, `这是 ${q} 的长条，不是差。`],
          ],
          compareBarsFigure(swap ? [q, p] : [p, q], swap ? [small, big] : [big, small], "gap"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [12, 7], "gap"),
        "Bar A is 12 and bar B is 7. The piece of A that sticks out is unknown.",
        "长条 A 是 12，长条 B 是 7，A 多出的那段未知。",
      ),
    ),
    earlyPoint(
      "the-longer-bar",
      ["Finding the longer bar", "求长的长条"],
      [
        "Bar B is 7. Bar A is 3 more than B. So A's bar is B's bar and the extra piece: $7 + 3 = 10$.\n\nCheck: $10 - 7 = 3$, the extra piece.\n\n> **Watch out.** \"B has 3 fewer than A\" also means A is the longer bar. The word fewer does not always mean subtract.",
        "长条 B 是 7，长条 A 比 B 多 3。所以 A 的长条是 B 的长条再加上多出的一段：$7 + 3 = 10$。\n\n检验：$10 - 7 = 3$，正好是多出的一段。\n\n> **注意。** “B 比 A 少 3”也说明 A 是长的长条。“少”不一定就用减法。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const small = rng.int(3, 13);
        const gap = rng.int(2, 7);
        const big = small + gap;
        const thing = rng.pick(earlyThings);
        const fewer = rng.bool();
        return solved(
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
          [
            [
              ["Find the longer bar", "找出长的长条"],
              [`${p} has more, so ${p}'s bar is the longer one.`, `${p} 的多，所以 ${p} 的长条长。`],
            ],
            [["Add the extra piece", "加上多出的一段"], ["", ""], [`${small} + ${gap} = ${big}`]],
          ],
          [
            `Take ${q}'s bar away: $${big} - ${small} = ${gap}$, the extra piece.`,
            `减去 ${q} 的长条：$${big} - ${small} = ${gap}$，正好是多出的一段。`,
          ],
          [
            [small - gap, `This subtracts. ${p}'s bar is the longer one.`, `这是做了减法，${p} 的长条才是长的。`],
            [gap, "That is only the extra piece.", "这只是多出的一段。"],
            [small, `That is ${q}'s bar.`, `这是 ${q} 的长条。`],
          ],
          compareBarsFigure([p, q], [big, small], "first"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [10, 7], "first"),
        "Bar B is 7, bar A is unknown, and A sticks out by 3.",
        "长条 B 是 7，长条 A 未知，A 多出 3。",
      ),
    ),
    earlyPoint(
      "the-shorter-bar",
      ["Finding the shorter bar", "求短的长条"],
      [
        "Bar A is 12. That is 4 more than bar B. B's bar is A's bar without the extra piece: $12 - 4 = 8$.\n\nCheck: $8 + 4 = 12$.\n\n> **Watch out.** The word more does not always mean add. Here we want the shorter bar, so subtract.",
        "长条 A 是 12，比长条 B 多 4。B 的长条就是 A 的长条去掉多出的一段：$12 - 4 = 8$。\n\n检验：$8 + 4 = 12$。\n\n> **注意。** “多”不一定就用加法。这里求的是短的长条，所以要减。",
      ],
      (rng) => {
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const big = rng.int(8, 20);
        const gap = rng.int(2, big - 3);
        const small = big - gap;
        const thing = rng.pick(earlyThings);
        const more = rng.bool();
        return solved(
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
          [
            [
              ["Find the shorter bar", "找出短的长条"],
              [`${q} has fewer, so ${q}'s bar is the shorter one.`, `${q} 的少，所以 ${q} 的长条短。`],
            ],
            [["Take off the extra piece", "去掉多出的一段"], ["", ""], [`${big} - ${gap} = ${small}`]],
          ],
          [`Put the extra piece back: $${small} + ${gap} = ${big}$.`, `把多出的一段加回去：$${small} + ${gap} = ${big}$。`],
          [
            [big + gap, `This adds. ${q}'s bar is the shorter one.`, `这是做了加法，${q} 的长条是短的。`],
            [gap, "That is only the extra piece.", "这只是多出的一段。"],
            [big, `That is ${p}'s bar.`, `这是 ${p} 的长条。`],
          ],
          compareBarsFigure([p, q], [big, small], "second"),
        );
      },
      captioned(
        compareBarsFigure(["A", "B"], [12, 8], "second"),
        "Bar A is 12, bar B is unknown, and A sticks out by 4.",
        "长条 A 是 12，长条 B 未知，A 多出 4。",
      ),
    ),
  ],
  [
    "Mia has 12 crayons and Leo has 7. Lay two bars side by side, lined up at the left. Mia's bar sticks out past Leo's.\n\nCheck: the extra piece is $12 - 7 = 5$, so Mia has 5 more.\n\nIn this lesson we use two bars to solve stories about how many more or fewer.",
    "米娅有 12 支蜡笔，利奥有 7 支。把两个长条左端对齐并排放，米娅的长条比利奥的多出一段。\n\n检验：多出的一段是 $12 - 7 = 5$，米娅多 5 支。\n\n本课我们用两个长条解决多多少、少多少的故事。",
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
        "Find $34 + 3$. The top row has 3 rods and 4 squares. Add the 3 new squares to the 4 squares: 7. The 3 rods stay. So the sum is 37.\n\nCheck: count on 3 from 34: 35, 36, 37.\n\n> **Watch out.** Add ones to ones. Adding the 3 to the rods gives 64, which is far too big.",
        "求 $34 + 3$。上面一排有 3 根长条和 4 个小方块。把新的 3 个小方块和 4 个小方块合起来：7 个。3 根长条不变，所以和是 37。\n\n检验：从 34 往后数 3 个：35、36、37。\n\n> **注意。** 一要和一相加。把 3 加到长条上会得到 64，太大了。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(1, 7);
        const add = rng.int(1, 9 - ones);
        const n = 10 * tens + ones;
        const counts = Array.from({ length: add }, (_, i) => n + i + 1);
        return solved(
          [
            `The top row shows ${n} and the bottom row shows ${add}. What is $${n} + ${add}$?`,
            `上面一排表示 ${n}，下面一排表示 ${add}。$${n} + ${add}$ 等于多少？`,
          ],
          n + add,
          [
            [["Add the ones", "一和一相加"], ["", ""], [`${ones} + ${add} = ${ones + add}`]],
            [
              ["Keep the tens", "十不变"],
              [`The ${many(tens, "rod")} stay, so the sum is:`, `${tens} 根长条不变，所以和是：`],
              [`${n} + ${add} = ${n + add}`],
            ],
          ],
          [`Count on ${add} from ${n}: ${counts.join(", ")}.`, `从 ${n} 往后数 ${add} 个：${counts.join("、")}。`],
          [
            [n + 10 * add, `This adds the ${add} to the tens. Add it to the ones.`, `这是把 ${add} 加到十位上了，应该加到个位。`],
            [tens + ones + add, "This counts each rod as one. Each rod is ten.", "这把每根长条当成了一，每根长条是十。"],
            [n - add, "This subtracts. The sign is plus.", "这是做了减法，符号是加号。"],
          ],
          blockRowsFigure([
            [0, tens, ones],
            [0, 0, add],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 4],
          [0, 0, 3],
        ]),
        "Top: 3 rods and 4 squares. Bottom: 3 squares.",
        "上面：3 根长条和 4 个小方块；下面：3 个小方块。",
      ),
    ),
    earlyPoint(
      "jumping-to-the-next-ten",
      ["Jumping to the next ten", "先跳到下一个十"],
      [
        "Find $27 + 5$ with two jumps. First jump 3 to reach 30. That uses 3 of the 5, so 2 are left. Jump 2 more to reach 32.\n\nCheck: the ones make $7 + 5 = 12$, which is 1 ten and 2. So 2 tens and 1 more ten and 2: 32.\n\n> **Watch out.** The second jump is only what is left of the 5. Jumping all 5 from 30 gives 35, which is wrong.",
        "用两跳求 $27 + 5$。先跳 3 到 30，5 用掉了 3，还剩 2，再跳 2 到 32。\n\n检验：个位 $7 + 5 = 12$，是 1 个十和 2。2 个十再加 1 个十和 2，是 32。\n\n> **注意。** 第二跳只跳 5 剩下的部分。从 30 再跳整整 5 会得到 35，是错的。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(4, 9);
        const add = rng.int(11 - ones, 9);
        const n = 10 * tens + ones;
        const next = 10 * (tens + 1);
        const answer = n + add;
        return solved(
          [`The jumps show $${n} + ${add}$. Where do they end?`, `这些跳表示 $${n} + ${add}$。最后跳到哪个数？`],
          answer,
          [
            [
              ["Jump to the next ten", "跳到下一个十"],
              [`${n} needs ${next - n} to reach ${next}:`, `${n} 再加 ${next - n} 就到 ${next}：`],
              [`${n} + ${next - n} = ${next}`],
            ],
            [
              ["Jump the rest", "跳剩下的"],
              [`${add} take away ${next - n} leaves ${answer - next}:`, `${add} 去掉 ${next - n} 还剩 ${answer - next}：`],
              [`${next} + ${answer - next} = ${answer}`],
            ],
          ],
          [
            `Add the ones: $${ones} + ${add} = ${ones + add}$, which is 1 ten and ${ones + add - 10}. So ${many(tens + 1, "ten")} and ${many(ones + add - 10, "one")}: ${answer}.`,
            `个位相加：$${ones} + ${add} = ${ones + add}$，是 1 个十和 ${ones + add - 10}。所以是 ${tens + 1} 个十和 ${ones + add - 10} 个一：${answer}。`,
          ],
          [
            [answer - 10, "This forgets that the jumps pass a ten.", "这忘了跳的时候经过了一个十。"],
            [next, "That is where the first jump lands. There is a second jump.", "这是第一跳落到的数，还有第二跳。"],
            [answer + 10, "This adds an extra ten.", "这多加了一个十。"],
            [
              next + add,
              `This jumps all ${add} from ${next}. Only ${answer - next} are left after the first jump.`,
              `这从 ${next} 又跳了整整 ${add}，第一跳以后只剩 ${answer - next}。`,
            ],
          ],
          hopsFigure([n, next, answer], true),
        );
      },
      captioned(
        hopsFigure([27, 30, 32]),
        "A number line with a jump from 27 to 30 and a jump from 30 to 32.",
        "数轴：从 27 跳到 30，再从 30 跳到 32。",
      ),
    ),
    earlyPoint(
      "adding-past-a-ten-in-your-head",
      ["Adding past a ten in your head", "心算跨过整十"],
      [
        "Find $38 + 7$ in your head. 38 needs 2 to make 40. Take 2 from the 7, and 5 are left. $40 + 5 = 45$.\n\nCheck: $45 - 7 = 38$.\n\n> **Watch out.** Passing a ten makes the tens digit go up. The answer is 45, not 35.",
        "心算 $38 + 7$。38 再加 2 就是 40。从 7 里拿出 2，还剩 5。$40 + 5 = 45$。\n\n检验：$45 - 7 = 38$。\n\n> **注意。** 跨过整十，十位要加 1。答案是 45，不是 35。",
      ],
      (rng) => {
        const tens = rng.int(1, 8);
        const ones = rng.int(3, 9);
        const add = rng.int(11 - ones, 9);
        const n = 10 * tens + ones;
        const answer = n + add;
        const round = n + 10 - ones;
        const rest = add - 10 + ones;
        const name = rng.pick(earlyNames);
        const thing = rng.pick(earlyThings);
        const story = rng.bool();
        return solved(
          story
            ? [
                `${name} has ${n} ${thing.en} and gets ${add} more. How many ${thing.en} does ${name} have now?`,
                `${name} 有 ${n} ${thing.unit}${thing.zh}，又得到 ${add} ${thing.unit}。现在有多少${thing.unit}${thing.zh}？`,
              ]
            : [`What is $${n} + ${add}$?`, `$${n} + ${add}$ 等于多少？`],
          answer,
          [
            [
              ["Make a ten", "凑成整十"],
              [`${n} needs ${10 - ones} to make ${round}:`, `${n} 再加 ${10 - ones} 就是 ${round}：`],
              [`${n} + ${10 - ones} = ${round}`],
            ],
            [
              ["Add the rest", "加上剩下的"],
              [`${add} take away ${10 - ones} leaves ${rest}:`, `${add} 去掉 ${10 - ones} 还剩 ${rest}：`],
              [`${round} + ${rest} = ${answer}`],
            ],
          ],
          [`Take it back off: $${answer} - ${add} = ${n}$.`, `再减回去：$${answer} - ${add} = ${n}$。`],
          [
            [answer - 10, "This forgets that the tens digit goes up when you pass a ten.", "这忘了跨过整十时十位要加 1。"],
            [n + 10 * add, `This adds ${add} to the tens. Add it to the ones.`, `这是把 ${add} 加到十位上了，应该加到个位。`],
            [round, `This stops at ${round}. There are still ${rest} to add.`, `这算到 ${round} 就停了，还要加 ${rest}。`],
          ],
        );
      },
      captioned(
        hopsFigure([38, 40, 45]),
        "A number line with a jump from 38 to 40 and a jump from 40 to 45.",
        "数轴：从 38 跳到 40，再从 40 跳到 45。",
      ),
    ),
  ],
  [
    "Sam has 27 marbles. He wins 5 more. 3 of them bring him to 30, and 2 more bring him to 32.\n\nCheck: $27 + 5 = 32$, and $32 - 5 = 27$.\n\nIn this lesson we add a one-digit number to a two-digit number.",
    "萨姆有 27 颗弹珠，又赢了 5 颗。其中 3 颗让他凑到 30，再加 2 颗就是 32。\n\n检验：$27 + 5 = 32$，$32 - 5 = 27$。\n\n本课我们学习两位数加一位数。",
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
        "Find $34 + 25$. Push the two rows together. Rods: $3 + 2 = 5$, which is 50. Squares: $4 + 5 = 9$. So the sum is 59.\n\nCheck: $34 + 20 = 54$, and $54 + 5 = 59$.\n\n> **Watch out.** Rods go with rods and squares with squares. Do not count a rod as one.",
        "求 $34 + 25$。把两排积木合在一起。长条：$3 + 2 = 5$，是 50；小方块：$4 + 5 = 9$。所以和是 59。\n\n检验：$34 + 20 = 54$，$54 + 5 = 59$。\n\n> **注意。** 长条和长条相加，小方块和小方块相加。不要把一根长条当成一。",
      ],
      (rng) => {
        const t1 = rng.int(1, 5);
        const t2 = rng.int(1, 4);
        const o1 = rng.int(0, 6);
        const o2 = rng.int(1, 9 - o1);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        return solved(
          [`The blocks show ${a} and ${b}. What is $${a} + ${b}$?`, `这些积木表示 ${a} 和 ${b}。$${a} + ${b}$ 等于多少？`],
          a + b,
          [
            [
              ["Count the rods", "数长条"],
              [`${t1} + ${t2} rods make ${10 * (t1 + t2)}.`, `${t1} + ${t2} 根长条是 ${10 * (t1 + t2)}。`],
            ],
            [
              ["Count the squares", "数小方块"],
              [`${o1} + ${o2} squares make ${o1 + o2}. Put them together:`, `${o1} + ${o2} 个小方块是 ${o1 + o2}。合起来：`],
              [`${10 * (t1 + t2)} + ${o1 + o2} = ${a + b}`],
            ],
          ],
          [
            `Add in two jumps: $${a} + ${10 * t2} = ${a + 10 * t2}$, and $${a + 10 * t2} + ${o2} = ${a + b}$.`,
            `分两跳加：$${a} + ${10 * t2} = ${a + 10 * t2}$，$${a + 10 * t2} + ${o2} = ${a + b}$。`,
          ],
          [
            [t1 + t2 + o1 + o2, "This counts each rod as one. Each rod is ten.", "这把每根长条当成了一，每根长条是十。"],
            [a + o2, `This forgets the rods of ${b}.`, `这忘了加上 ${b} 的长条。`],
            [a + 10 * t2, `This forgets the squares of ${b}.`, `这忘了加上 ${b} 的小方块。`],
          ],
          blockRowsFigure([
            [0, t1, o1],
            [0, t2, o2],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 4],
          [0, 2, 5],
        ]),
        "Top: 3 rods and 4 squares. Bottom: 2 rods and 5 squares.",
        "上面：3 根长条和 4 个小方块；下面：2 根长条和 5 个小方块。",
      ),
    ),
    earlyPoint(
      "tens-first-and-then-ones",
      ["Tens first and then ones", "先加十，再加一"],
      [
        "Find $34 + 25$ in your head. Tens: $30 + 20 = 50$. Ones: $4 + 5 = 9$. Put them together: 59.\n\nCheck: jump 20 from 34 to 54, then 5 more to 59.\n\n> **Watch out.** Put the two results together at the end. The answer is 59, not 50 or 9.",
        "心算 $34 + 25$。十：$30 + 20 = 50$；一：$4 + 5 = 9$。合起来：59。\n\n检验：从 34 跳 20 到 54，再跳 5 到 59。\n\n> **注意。** 最后要把两个结果合起来。答案是 59，不是 50，也不是 9。",
      ],
      (rng) => {
        const t1 = rng.int(1, 6);
        const t2 = rng.int(1, 8 - t1);
        const o1 = rng.int(1, 7);
        const o2 = rng.int(1, 9 - o1);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        const tens = 10 * (t1 + t2);
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          a + b,
          [
            [["Add the tens", "十和十相加"], ["", ""], [`${10 * t1} + ${10 * t2} = ${tens}`]],
            [
              ["Add the ones and put them together", "一和一相加，再合起来"],
              ["", ""],
              [`${o1} + ${o2} = ${o1 + o2}`, `${tens} + ${o1 + o2} = ${a + b}`],
            ],
          ],
          [
            `Jump ${10 * t2} from ${a} to ${a + 10 * t2}, then ${o2} more to ${a + b}.`,
            `从 ${a} 跳 ${10 * t2} 到 ${a + 10 * t2}，再跳 ${o2} 到 ${a + b}。`,
          ],
          [
            [tens, "That is only the tens. Add the ones too.", "这只是十的和，还要加上一。"],
            [o1 + o2, "That is only the ones. Add the tens too.", "这只是一的和，还要加上十。"],
            [a + b + 10, "This adds an extra ten.", "这多加了一个十。"],
            [Math.abs(a - b), "This subtracts. The sign is plus.", "这是做了减法，符号是加号。"],
          ],
        );
      },
      captioned(
        hopsFigure([34, 54, 59]),
        "A number line with a jump from 34 to 54 and a jump from 54 to 59.",
        "数轴：从 34 跳到 54，再从 54 跳到 59。",
      ),
    ),
    earlyPoint(
      "making-a-new-ten-from-the-squares",
      ["Making a new ten from the squares", "用小方块凑成新的十"],
      [
        "Find $27 + 15$. Push the blocks together: 3 rods and 12 squares. Ten squares make a new rod. Now there are 4 rods and 2 squares: 42.\n\nCheck: $27 + 3 = 30$, and $30 + 12 = 42$.\n\n> **Watch out.** Do not forget the new rod. The answer is 42, not 32.",
        "求 $27 + 15$。把积木合在一起：3 根长条和 12 个小方块。十个小方块换成一根新的长条，现在有 4 根长条和 2 个小方块：42。\n\n检验：$27 + 3 = 30$，$30 + 12 = 42$。\n\n> **注意。** 别忘了新的长条。答案是 42，不是 32。",
      ],
      (rng) => {
        const t1 = rng.int(1, 4);
        const t2 = rng.int(1, 4);
        const o1 = rng.int(3, 9);
        const o2 = rng.int(10 - o1, 9);
        const a = 10 * t1 + o1;
        const b = 10 * t2 + o2;
        const answer = a + b;
        const rods = t1 + t2;
        const squares = o1 + o2;
        return solved(
          [`The blocks show ${a} and ${b}. What is $${a} + ${b}$?`, `这些积木表示 ${a} 和 ${b}。$${a} + ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Push the blocks together", "把积木合在一起"],
              [`There are ${many(rods, "rod")} and ${squares} squares.`, `有 ${rods} 根长条和 ${squares} 个小方块。`],
            ],
            [
              ["Trade ten squares for a rod", "十个小方块换一根长条"],
              [
                `That makes ${many(rods + 1, "rod")} and ${many(squares - 10, "square")}:`,
                `变成 ${rods + 1} 根长条和 ${squares - 10} 个小方块：`,
              ],
              [`${10 * (rods + 1)} + ${squares - 10} = ${answer}`],
            ],
          ],
          [
            `Add in two jumps: $${a} + ${10 * t2} = ${a + 10 * t2}$, and $${a + 10 * t2} + ${o2} = ${answer}$.`,
            `分两跳加：$${a} + ${10 * t2} = ${a + 10 * t2}$，$${a + 10 * t2} + ${o2} = ${answer}$。`,
          ],
          [
            [answer - 10, "This forgets the new rod made from ten squares.", "这忘了十个小方块换成的新长条。"],
            [
              Number(`${rods}${squares}`),
              `This writes ${rods} and ${squares} side by side.`,
              `这是把 ${rods} 和 ${squares} 并排写在一起了。`,
            ],
            [rods + squares, "This counts each rod as one. Each rod is ten.", "这把每根长条当成了一，每根长条是十。"],
          ],
          blockRowsFigure([
            [0, t1, o1],
            [0, t2, o2],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 2, 7],
          [0, 1, 5],
        ]),
        "Top: 2 rods and 7 squares. Bottom: 1 rod and 5 squares.",
        "上面：2 根长条和 7 个小方块；下面：1 根长条和 5 个小方块。",
      ),
    ),
  ],
  [
    "Two classes pick apples. One class picks 34 and the other picks 25. Put the tens together: 50. Put the ones together: 9.\n\nCheck: $34 + 25 = 59$, and $59 - 25 = 34$.\n\nIn this lesson we add two-digit numbers, tens with tens and ones with ones.",
    "两个班摘苹果，一个班摘了 34 个，另一个班摘了 25 个。十和十合起来是 50，一和一合起来是 9。\n\n检验：$34 + 25 = 59$，$59 - 25 = 34$。\n\n本课我们做两位数加法：十和十相加，一和一相加。",
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

/** layingFaults say, for each wrong way of laying blocks, what is wrong with a row, given its label. */
const layingFaults: Readonly<Record<Exclude<BarMeasure, "good">, (row: string) => Pair>> = {
  gaps: (row) => [`Row ${row} has gaps between the blocks.`, `${row} 行的方块之间有空隙。`],
  overlap: (row) => [`In row ${row} the blocks lie on top of each other.`, `${row} 行的方块叠在一起了。`],
  late: (row) => [`Row ${row} does not start at the end of the bar.`, `${row} 行没有从长条的一端开始。`],
};

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
        "Row A starts right at the end of the bar. Its blocks touch edge to edge, all the way to the other end. Row B has gaps. Only row A measures the bar: 6 blocks.\n\nCheck: row A ends exactly where the bar ends.\n\n> **Watch out.** Gaps leave parts of the bar with no block under them. Then the count is too small.",
        "A 行从长条的一端开始，方块一个挨一个，一直摆到另一端。B 行有空隙。只有 A 行量对了：6 个方块。\n\n检验：A 行正好在长条结束的地方结束。\n\n> **注意。** 有空隙，长条就有一些地方下面没有方块，数出来就太少了。",
      ],
      (rng) => {
        const length = rng.int(5, 8);
        const labels = ["A", "B", "C", "D"];
        const ways = rng.shuffle<BarMeasure>(["good", "gaps", "overlap", "late"]);
        const at = ways.indexOf("good");
        const good = labels[at] as string;
        const name = (i: number): Pair => [`Row ${labels[i]}`, `${labels[i]} 行`];
        return picked(
          rng,
          ["In which row are the blocks laid correctly to measure the bar?", "哪一行的方块摆得对，可以用来测量长条？"],
          name(at),
          ways.flatMap((way, i): Wrong[] => (way === "good" ? [] : [[name(i), ...layingFaults[way](labels[i] as string)]])),
          [
            [
              ["Check the start", "看开头"],
              [`Row ${good} starts right at the end of the bar.`, `${good} 行从长条的一端开始。`],
            ],
            [
              ["Check between the blocks", "看方块之间"],
              [
                `Its blocks touch edge to edge, with no gaps and none on top of each other.`,
                `它的方块一个挨一个，没有空隙，也没有叠在一起。`,
              ],
            ],
          ],
          [
            `Row ${good} also ends exactly where the bar ends, after ${length} blocks.`,
            `${good} 行摆了 ${length} 个方块，也正好在长条结束的地方结束。`,
          ],
          measuredBarsFigure(labels, ways, length),
        );
      },
      captioned(
        measuredBarsFigure(["A", "B"], ["good", "gaps"], 6),
        "Two rows of blocks under a bar. Row A has no gaps. Row B has gaps.",
        "长条下面的两行方块：A 行没有空隙，B 行有空隙。",
      ),
    ),
    earlyPoint(
      "what-went-wrong",
      ["What went wrong", "哪里错了"],
      [
        "These blocks lie on top of each other. Where they overlap, the same bit of the bar is counted twice. So the count is too big.\n\nCheck: lay the blocks edge to edge, and fewer blocks fill the bar.\n\n> **Watch out.** Each block must touch the next one, not cover part of it.",
        "这些方块叠在一起了。重叠的地方，长条的同一段被算了两次，所以数出来太多了。\n\n检验：把方块一个挨一个地摆，填满长条用的方块更少。\n\n> **注意。** 每个方块要挨着下一个，不能盖住它的一部分。",
      ],
      (rng) => {
        const length = rng.int(4, 9);
        const way = rng.pick<Exclude<BarMeasure, "good">>(["gaps", "overlap", "late"]);
        const answers: Record<Exclude<BarMeasure, "good">, Pair> = {
          gaps: ["There are gaps between the blocks", "方块之间有空隙"],
          overlap: ["The blocks lie on top of each other", "方块叠在一起了"],
          late: ["The blocks do not start at the end of the bar", "方块没有从长条的一端开始"],
        };
        const notIt: Record<Exclude<BarMeasure, "good">, Pair> = {
          gaps: ["The blocks touch. There are no spaces between them.", "方块是挨着的，中间没有空隙。"],
          overlap: ["No block lies on top of another.", "没有方块叠在别的方块上。"],
          late: ["The first block starts right at the end of the bar.", "第一个方块是从长条的一端开始的。"],
        };
        const thing = rng.pick(measuredThings);
        const wrong: Wrong[] = (["gaps", "overlap", "late"] as const).filter((w) => w !== way).map((w): Wrong => [answers[w], ...notIt[w]]);
        wrong.push([
          ["The blocks are all the same size", "方块都一样大"],
          "Using blocks of the same size is right, not a mistake.",
          "用一样大的方块是对的，不是错误。",
        ]);
        const why: Pair =
          way === "gaps"
            ? ["The spaces have no block, so they are not counted. The count is too small.", "空隙下面没有方块，没有算进去，数出来太少。"]
            : way === "overlap"
              ? ["Where blocks overlap, the same bit is counted twice. The count is too big.", "重叠的地方被算了两次，数出来太多。"]
              : ["The first bit of the bar has no block under it, so it is not counted.", "长条开头的一段下面没有方块，没有算进去。"];
        return picked(
          rng,
          [
            `Someone used these blocks to measure a ${thing[0]}, shown as the bar. What went wrong?`,
            `有人用这些方块测量${thing[1]}，长条代表它。哪里错了？`,
          ],
          answers[way],
          wrong,
          [
            [
              ["Look at the start", "看开头"],
              way === "late"
                ? ["The first block starts past the end of the bar.", "第一个方块没有从长条的一端开始。"]
                : ["The blocks start at the end of the bar.", "方块是从长条的一端开始的。"],
            ],
            [
              ["Look between the blocks", "看方块之间"],
              way === "gaps"
                ? ["There are spaces between the blocks.", "方块之间有空隙。"]
                : way === "overlap"
                  ? ["Some blocks lie on top of each other.", "有的方块叠在一起。"]
                  : ["The blocks touch edge to edge.", "方块一个挨一个。"],
            ],
          ],
          why,
          measuredBarsFigure(["A"], [way], length),
        );
      },
      captioned(
        measuredBarsFigure(["A"], ["overlap"], 6),
        "A row of blocks under a bar, with blocks lying on top of each other.",
        "长条下面的一行方块，有的方块叠在一起。",
      ),
    ),
    earlyPoint(
      "the-length-in-blocks",
      ["The length in blocks", "用方块表示长度"],
      [
        "These blocks start at the end of the bar and touch all the way along. Count them: 1, 2, 3, 4, 5. The bar is 5 blocks long.\n\nCheck: count from the other end. It is still 5.\n\n> **Watch out.** Say the unit too. 5 paper clips and 5 erasers are not the same length.",
        "这些方块从长条的一端开始，一个挨一个地一直摆到另一端。数一数：1、2、3、4、5。长条有 5 个方块长。\n\n检验：从另一端数，还是 5 个。\n\n> **注意。** 要说出单位。5 个回形针和 5 块橡皮不一样长。",
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
        const counts = Array.from({ length }, (_, i) => i + 1);
        return solved(
          [
            `The bar is a ${thing[0]}. Each block under it is one of the ${unit[0]} laid end to end. How many ${unit[0]} long is it?`,
            `长条代表${thing[1]}。下面的每个方块代表一个单位（${unit[1].slice(1)}），首尾相接地摆放。它有多少${unit[1]}长？`,
          ],
          length,
          [
            [
              ["Check the blocks", "检查方块"],
              ["They start at the end of the bar and touch, with no gaps.", "它们从长条的一端开始，一个挨一个，没有空隙。"],
            ],
            [
              ["Count them", "数一数"],
              [`${counts.join(", ")}.`, `${counts.join("、")}。`],
            ],
          ],
          [`Count from the other end: still ${length} ${unit[0]}.`, `从另一端数，还是 ${length} ${unit[1]}。`],
          [
            [length + 1, "This counts the first block twice.", "这把第一个方块数了两次。"],
            [length - 1, "This misses the last block.", "这漏数了最后一个方块。"],
            [length * 2, "This counts every block twice.", "这把每个方块都数了两次。"],
          ],
          measuredBarsFigure([""], ["good"], length),
        );
      },
      captioned(
        measuredBarsFigure([""], ["good"], 5),
        "A bar with 5 blocks laid end to end under it.",
        "长条下面首尾相接地摆了 5 个方块。",
      ),
    ),
  ],
  [
    "Rosa measures her pencil with paper clips. She starts at the tip and lays the clips end to end, with no gaps. The pencil is 6 clips long.\n\nCheck: count the clips again from the other end: 6.\n\nIn this lesson we lay units end to end, with no gaps or overlaps, to measure.",
    "罗莎用回形针量铅笔。她从笔尖开始，把回形针首尾相接地摆好，不留空隙。铅笔有 6 个回形针长。\n\n检验：从另一端再数一遍回形针：6 个。\n\n本课我们把单位首尾相接地摆放来测量，不留空隙，也不重叠。",
  ],
);

/** sayTime says a time on the hour or half hour in words. */
const sayTime = (hour: number, half: boolean): Pair => (half ? [`half past ${hour}`, `${hour} 点半`] : [`${hour} o'clock`, `${hour} 点`]);

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
        "This clock shows 4:30. The number before the two dots is the hour: 4. The number after them is the minutes: 30. Thirty minutes is half an hour, so it is half past 4.\n\nCheck: on a clock with hands, the long hand would point to the 6.\n\n> **Watch out.** :30 means half past. It does not mean 3 o'clock.",
        "这个钟显示 4:30。两点前面的数是小时：4；后面的数是分钟：30。30 分钟是半小时，所以是 4 点半。\n\n检验：在带指针的钟上，长针会指着 6。\n\n> **注意。** :30 表示半点，不是 3 点。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const next = clockHour(h + 1);
        const prev = clockHour(h - 1);
        const minutes = half ? "30" : "00";
        return picked(
          rng,
          ["What time does this clock show?", "这个钟显示的是什么时间？"],
          sayTime(h, half),
          rng.sample<Wrong>(
            [
              [
                sayTime(h, !half),
                `The hour is right, but ${half ? "30 minutes means half past" : "00 minutes means on the hour"}.`,
                `小时对了，但${half ? "30 分表示半点" : "00 分表示整点"}。`,
              ],
              [sayTime(next, half), `The number before the dots is the hour, and it is ${h}.`, `两点前面的数是小时，它是 ${h}。`],
              [
                sayTime(next, !half),
                `The hour is ${h}, and ${half ? "30 minutes means half past" : "00 minutes means on the hour"}.`,
                `小时是 ${h}，而且${half ? "30 分表示半点" : "00 分表示整点"}。`,
              ],
              [sayTime(prev, half), `The number before the dots is the hour, and it is ${h}.`, `两点前面的数是小时，它是 ${h}。`],
            ],
            3,
          ),
          [
            [
              ["Read the hour", "读小时"],
              [`Before the dots is ${h}.`, `两点前面是 ${h}。`],
            ],
            [
              ["Read the minutes", "读分钟"],
              [`After the dots is ${minutes}, so it is ${sayTime(h, half)[0]}.`, `两点后面是 ${minutes}，所以是${sayTime(h, half)[1]}。`],
            ],
          ],
          [
            `On a clock with hands, the long hand would point to the ${half ? 6 : 12} and the short hand ${half ? `halfway past the ${h}` : `at the ${h}`}.`,
            `在带指针的钟上，长针会指着 ${half ? 6 : 12}，短针${half ? `走过 ${h} 一半` : `指着 ${h}`}。`,
          ],
          digitalClockFigure(h, half ? 30 : 0),
        );
      },
      captioned(digitalClockFigure(4, 30), "A digital clock showing 4:30.", "显示 4:30 的电子钟。"),
    ),
    earlyPoint(
      "from-hands-to-digits",
      ["From hands to digits", "从指针到数字"],
      [
        "On this clock the long hand is on the 6, so the minutes are 30. The short hand is between the 4 and the 5. It has passed the 4, so the hour is 4. We write 4:30.\n\nCheck: half past 4 is 4:30.\n\n> **Watch out.** Use the number the short hand has passed, not the one it is coming to. It is 4:30, not 5:30.",
        "这个钟的长针指着 6，所以分钟是 30。短针在 4 和 5 之间，已经走过了 4，所以小时是 4。写作 4:30。\n\n检验：4 点半就是 4:30。\n\n> **注意。** 要用短针已经走过的数，不是快要走到的数。是 4:30，不是 5:30。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const m = half ? 30 : 0;
        const next = clockHour(h + 1);
        const prev = clockHour(h - 1);
        const time = clockText(h, m);
        const as = (s: string): Pair => [s, s];
        return picked(
          rng,
          ["Which digital time matches this clock?", "哪个电子钟时间和这个钟相同？"],
          as(time),
          rng.sample<Wrong>(
            [
              [
                as(clockText(next, m)),
                half ? `The short hand has not reached the ${next} yet.` : `The short hand points at the ${h}, not the ${next}.`,
                half ? `短针还没有走到 ${next}。` : `短针指着 ${h}，不是 ${next}。`,
              ],
              [
                as(clockText(h, half ? 0 : 30)),
                `The long hand is on the ${half ? 6 : 12}, which means ${half ? 30 : "00"} minutes.`,
                `长针指着 ${half ? 6 : 12}，表示 ${half ? 30 : "00"} 分。`,
              ],
              [
                as(clockText(prev, m)),
                `The short hand ${half ? "has passed" : "points at"} the ${h}, not the ${prev}.`,
                `短针${half ? "已经走过了" : "指着"} ${h}，不是 ${prev}。`,
              ],
              [
                as(half ? clockText(h, 6) : clockText(h, 12)),
                `The long hand on the ${half ? 6 : 12} means ${half ? 30 : "00"} minutes, not ${half ? 6 : 12}.`,
                `长针指着 ${half ? 6 : 12} 表示 ${half ? 30 : "00"} 分，不是 ${half ? 6 : 12} 分。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Read the long hand", "读长针"],
              [
                `It is on the ${half ? 6 : 12}, so the minutes are ${half ? 30 : "00"}.`,
                `长针指着 ${half ? 6 : 12}，分钟是 ${half ? 30 : "00"}。`,
              ],
            ],
            [
              ["Read the short hand", "读短针"],
              half
                ? [`It has passed the ${h}, so the hour is ${h}: ${time}.`, `短针走过了 ${h}，小时是 ${h}：${time}。`]
                : [`It points at the ${h}, so the hour is ${h}: ${time}.`, `短针指着 ${h}，小时是 ${h}：${time}。`],
            ],
          ],
          [`Say it in words: ${sayTime(h, half)[0]}, which is ${time}.`, `用话说出来：${sayTime(h, half)[1]}，就是 ${time}。`],
          clockFigure(h, m),
        );
      },
      captioned(
        clockFigure(4, 30),
        "A clock with the long hand on the 6 and the short hand between the 4 and the 5.",
        "钟面：长针指着 6，短针在 4 和 5 之间。",
      ),
    ),
    earlyPoint(
      "where-the-hands-are-at-a-digital-time",
      ["Where the hands are at a digital time", "电子钟的时间对应的指针位置"],
      [
        "At 7:30 the long hand points to the 6. The short hand has moved halfway from the 7 to the 8.\n\nCheck: in one hour the short hand moves from the 7 to the 8. Half an hour moves it halfway.\n\n> **Watch out.** At 7:30 the short hand is not exactly on the 7. It keeps moving.",
        "7:30 时，长针指着 6，短针从 7 走到了 7 和 8 的正中间。\n\n检验：一小时里，短针从 7 走到 8；半小时就走一半。\n\n> **注意。** 7:30 时短针不是正好指着 7，它一直在走。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const next = clockHour(h + 1);
        const prev = clockHour(h - 1);
        const time = clockText(h, half ? 30 : 0);
        const minutesStep: Walk = [
          ["Read the minutes", "读分钟"],
          [`${time} has ${half ? 30 : "00"} minutes.`, `${time} 是 ${half ? 30 : "00"} 分。`],
        ];
        if (rng.bool()) {
          const on = (n: number): Pair => [`Exactly on the ${n}`, `正好指着 ${n}`];
          const between = (a: number, b: number): Pair => [`Halfway between the ${a} and the ${b}`, `在 ${a} 和 ${b} 的正中间`];
          return picked(
            rng,
            [`At ${time}, where does the short hand point?`, `${time} 时，短针指在哪里？`],
            half ? between(h, next) : on(h),
            half
              ? [
                  [on(h), `At half past, the short hand has moved on past the ${h}.`, `半点时，短针已经走过了 ${h}。`],
                  [on(next), `It reaches the ${next} only at ${next} o'clock.`, `要到 ${next} 点它才指着 ${next}。`],
                  [between(prev, h), `That is where it is at half past ${prev}.`, `这是 ${prev} 点半时短针的位置。`],
                ]
              : [
                  [between(h, next), `That is where it is at half past ${h}.`, `这是 ${h} 点半时短针的位置。`],
                  [on(next), `That is ${next} o'clock.`, `这是 ${next} 点。`],
                  [between(prev, h), `That is where it is at half past ${prev}.`, `这是 ${prev} 点半时短针的位置。`],
                ],
            [
              minutesStep,
              [
                ["Place the short hand", "放短针"],
                half
                  ? [`Half past ${h}: halfway from the ${h} to the ${next}.`, `${h} 点半：在 ${h} 和 ${next} 的正中间。`]
                  : [`Exactly ${h} o'clock: right on the ${h}.`, `正好 ${h} 点：正好指着 ${h}。`],
              ],
            ],
            half
              ? [
                  `In one hour the short hand moves from the ${h} to the ${next}, so half an hour moves it halfway.`,
                  `一小时里短针从 ${h} 走到 ${next}，半小时就走一半。`,
                ]
              : [`At 00 minutes a new hour begins, and the short hand points right at it.`, `00 分是一个新的小时开始，短针正好指着它。`],
          );
        }
        const pointTo = (n: number): Pair => [`It points to the ${n}`, `指着 ${n}`];
        const hand = half ? 6 : 12;
        const odd = [h === 6 || h === 12 ? 3 : h, next === 6 || next === 12 ? 9 : next];
        return picked(
          rng,
          [`At ${time}, where does the long hand point?`, `${time} 时，长针指在哪里？`],
          pointTo(hand),
          [
            half
              ? [pointTo(12), "Pointing to the 12 means 00 minutes.", "指着 12 表示 00 分。"]
              : [pointTo(6), "Pointing to the 6 means 30 minutes.", "指着 6 表示 30 分。"],
            ...odd.map(
              (n): Wrong => [
                pointTo(n),
                `The long hand shows the minutes. On the ${n} it does not show ${half ? 30 : "00"} minutes.`,
                `长针表示分钟，指着 ${n} 不是 ${half ? 30 : "00"} 分。`,
              ],
            ),
          ],
          [
            minutesStep,
            [
              ["Place the long hand", "放长针"],
              half
                ? ["30 minutes is halfway around, at the 6.", "30 分是走了半圈，指着 6。"]
                : ["00 minutes is at the top, on the 12.", "00 分在最上面，指着 12。"],
            ],
          ],
          half
            ? [
                "The long hand goes once around in an hour. Half an hour takes it from the 12 to the 6.",
                "长针一小时走一圈，半小时从 12 走到 6。",
              ]
            : ["A new hour starts when the long hand is back at the top.", "长针回到最上面时，新的一小时开始。"],
        );
      },
      captioned(
        clockFigure(7, 30),
        "A clock showing 7:30: the long hand on the 6 and the short hand halfway between the 7 and the 8.",
        "显示 7:30 的钟：长针指着 6，短针在 7 和 8 的正中间。",
      ),
    ),
  ],
  [
    "The oven clock shows 4:30. Grandma's clock with hands shows the same time. Its long hand is on the 6, and its short hand is just past the 4.\n\nCheck: both say half past 4.\n\nIn this lesson we read digital clocks and match them to clocks with hands.",
    "烤箱上的电子钟显示 4:30。奶奶的指针钟也是同一时间：长针指着 6，短针刚过 4。\n\n检验：两个钟都表示 4 点半。\n\n本课我们读电子钟，并把它和带指针的钟对应起来。",
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
        "The clock shows 3:30. In one hour, the long hand goes all the way around and comes back to the 6. The short hand moves on to the next number. So one hour later is 4:30.\n\nCheck: go one hour back from 4:30 and you are at 3:30 again.\n\n> **Watch out.** Only the hour changes. The minutes stay the same: 4:30, not 4:00.",
        "钟上是 3:30。过一小时，长针正好走一圈，又回到 6；短针走到下一个数。所以过一小时是 4:30。\n\n检验：从 4:30 往回推一小时，又回到 3:30。\n\n> **注意。** 只有小时变，分钟不变：是 4:30，不是 4:00。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const m = rng.pick([0, 30]);
        const later = rng.bool();
        const target = clockHour(later ? h + 1 : h - 1);
        const opposite = clockHour(later ? h - 1 : h + 1);
        const as = (s: string): Pair => [s, s];
        return picked(
          rng,
          [
            `What time is ${later ? "one hour after" : "one hour before"} the time on this clock?`,
            later ? "这个钟上的时间过一小时是几点？" : "比这个钟上的时间早一小时是几点？",
          ],
          as(clockText(target, m)),
          [
            [
              as(clockText(opposite, m)),
              `This goes the wrong way. The hour ${later ? "goes on" : "goes back"} by one.`,
              `方向反了，小时应该${later ? "加" : "减"} 1。`,
            ],
            [
              as(clockText(h, m === 0 ? 30 : 0)),
              "This keeps the hour and changes the minutes. One hour changes the hour.",
              "这里小时没变、分钟变了，过一小时变的是小时。",
            ],
            [
              as(clockText(target, m === 0 ? 30 : 0)),
              "The hour is right, but the minutes stay the same after one hour.",
              "小时对了，但过一小时分钟不变。",
            ],
          ],
          [
            [
              ["Read the clock", "读钟"],
              [`It shows ${clockText(h, m)}.`, `钟上是 ${clockText(h, m)}。`],
            ],
            [
              [later ? "Move the hour on" : "Move the hour back", later ? "小时加 1" : "小时减 1"],
              [
                `The minutes stay ${m === 0 ? "00" : 30}. The hour becomes ${target}: ${clockText(target, m)}.`,
                `分钟还是 ${m === 0 ? "00" : 30}，小时变成 ${target}：${clockText(target, m)}。`,
              ],
            ],
          ],
          [
            `Go one hour the other way from ${clockText(target, m)}: you are back at ${clockText(h, m)}.`,
            `从 ${clockText(target, m)} 反方向推一小时，又回到 ${clockText(h, m)}。`,
          ],
          clockFigure(h, m),
        );
      },
      captioned(clockFigure(3, 30), "A clock showing 3:30.", "显示 3:30 的钟。"),
    ),
    earlyPoint(
      "half-an-hour-later",
      ["Half an hour later", "过半小时"],
      [
        "The clock shows 5:30. In half an hour, the long hand goes halfway around, from the 6 up to the 12. The short hand reaches the 6. So it is 6:00.\n\nCheck: go back half an hour from 6:00: 5:30.\n\n> **Watch out.** From :30, half an hour later is a new hour. It is 6:00, not 5:00.",
        "钟上是 5:30。过半小时，长针走半圈，从 6 走到 12，短针走到 6。所以是 6:00。\n\n检验：从 6:00 往回推半小时：5:30。\n\n> **注意。** 从半点再过半小时，就到了下一个整点。是 6:00，不是 5:00。",
      ],
      (rng) => {
        const h = rng.int(1, 12);
        const half = rng.bool();
        const next = clockHour(h + 1);
        const prev = clockHour(h - 1);
        const now = clockText(h, half ? 30 : 0);
        const target = half ? clockText(next, 0) : clockText(h, 30);
        const as = (s: string): Pair => [s, s];
        const wrong: Wrong[] = half
          ? [
              [as(clockText(h, 0)), "That is half an hour earlier.", "这是早半小时的时间。"],
              [as(clockText(next, 30)), "That is one hour later.", "这是过一小时的时间。"],
              [as(clockText(prev, 30)), "That is one hour earlier.", "这是早一小时的时间。"],
              [as(clockText(h, 30)), "That is the time now.", "这是现在的时间。"],
            ]
          : [
              [as(clockText(next, 0)), "That is one hour later.", "这是过一小时的时间。"],
              [as(clockText(next, 30)), "That is an hour and a half later.", "这是过一个半小时的时间。"],
              [as(clockText(prev, 30)), "That is half an hour earlier.", "这是早半小时的时间。"],
              [as(clockText(h, 0)), "That is the time now.", "这是现在的时间。"],
            ];
        return picked(
          rng,
          ["What time is half an hour after the time on this clock?", "这个钟上的时间过半小时是几点？"],
          as(target),
          rng.sample(wrong, 3),
          [
            [
              ["Move the long hand halfway around", "长针走半圈"],
              half ? ["From the 6 it goes up to the 12.", "从 6 走到 12。"] : ["From the 12 it goes down to the 6.", "从 12 走到 6。"],
            ],
            [
              ["Check the hour", "看小时"],
              half
                ? [`The long hand reached the 12, so a new hour starts: ${target}.`, `长针走到 12，新的一小时开始：${target}。`]
                : [`The hour stays ${h}: ${target}.`, `小时还是 ${h}：${target}。`],
            ],
          ],
          [`Go back half an hour from ${target}: ${now}.`, `从 ${target} 往回推半小时：${now}。`],
          clockFigure(h, half ? 30 : 0),
        );
      },
      captioned(clockFigure(5, 30), "A clock showing 5:30.", "显示 5:30 的钟。"),
    ),
    earlyPoint(
      "how-long-something-takes",
      ["How long something takes", "用了多长时间"],
      [
        "A movie starts at 3:00 and lasts 2 hours. Move on one hour at a time: 4:00, then 5:00. So it ends at 5:00.\n\nCheck: count the hours from 3:00 to 5:00: two.\n\n> **Watch out.** Whole hours do not change the minutes. It ends at 5:00, not 5:30.",
        "电影 3:00 开始，演 2 小时。一小时一小时地往后推：4:00，再到 5:00。所以 5:00 结束。\n\n检验：从 3:00 到 5:00 数一数小时：两个小时。\n\n> **注意。** 整小时不会改变分钟。是 5:00 结束，不是 5:30。",
      ],
      (rng) => {
        const h = rng.int(1, 9);
        const m = rng.pick([0, 30]);
        const other = m === 0 ? 30 : 0;
        const name = rng.pick(earlyNames);
        const job = rng.pick<Pair>([
          ["soccer practice", "踢足球"],
          ["a movie", "看电影"],
          ["a piano lesson", "上钢琴课"],
          ["a birthday party", "参加生日聚会"],
          ["a swimming class", "上游泳课"],
        ]);
        const hours = rng.int(1, 2);
        const start = clockText(h, m);
        const target = clockText(h + hours, m);
        const steps = Array.from({ length: hours }, (_, i) => clockText(h + i + 1, m));
        const as = (s: string): Pair => [s, s];
        return picked(
          rng,
          [
            `${name} starts ${job[0]} at ${start}. It lasts ${hours} ${hours === 1 ? "hour" : "hours"}. When does it end?`,
            `${name} ${start} 开始${job[1]}，一共 ${hours} 小时。什么时候结束？`,
          ],
          as(target),
          rng.sample<Wrong>(
            [
              [as(clockText(h + hours + 1, m)), "This adds one hour too many.", "这多加了一小时。"],
              [
                as(clockText(h, other)),
                "This keeps the hour and changes the minutes. Whole hours change the hour.",
                "这里小时没变、分钟变了，整小时变的是小时。",
              ],
              [
                as(clockText(h + hours, other)),
                "The hour is right, but whole hours do not change the minutes.",
                "小时对了，但整小时不会改变分钟。",
              ],
              [
                as(clockText(h + 1, other)),
                `That is ${m === 0 ? "an hour and a half" : "half an hour"} after the start.`,
                `这是开始后${m === 0 ? "一个半小时" : "半小时"}的时间。`,
              ],
            ],
            3,
          ),
          [
            [
              ["Start at the beginning", "从开始的时间起"],
              [`It starts at ${start}.`, `${start} 开始。`],
            ],
            [
              ["Move on one hour at a time", "一小时一小时地往后推"],
              [`${steps.join(", ")}.`, `${steps.join("、")}。`],
            ],
          ],
          [`Count the hours from ${start} to ${target}: ${hours}.`, `从 ${start} 到 ${target} 数一数：${hours} 小时。`],
        );
      },
      captioned(clockFigure(3, 0), "A clock showing 3:00.", "显示 3:00 的钟。"),
    ),
  ],
  [
    "Soccer practice starts at 3:00 and lasts one hour. The long hand goes once around the clock. Then it is 4:00, and practice is over.\n\nCheck: from 3:00 to 4:00 is one hour.\n\nIn this lesson we find the time one hour or half an hour before or after.",
    "足球训练 3:00 开始，练一小时。长针绕钟面走一圈，就到了 4:00，训练结束。\n\n检验：从 3:00 到 4:00 是一小时。\n\n本课我们求过一小时或半小时后的时间，以及早一小时或半小时的时间。",
  ],
);

const coinsEn = { 1: ["penny", "pennies"], 5: ["nickel", "nickels"], 10: ["dime", "dimes"], 25: ["quarter", "quarters"] } as const;

/** coinZh names a coin by its value in Chinese. */
const coinZh = (v: number) => `${v} 美分硬币`;

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
        "A penny is 1 cent, a nickel is 5 cents and a dime is 10 cents. Here are 4 nickels. Count by fives: 5, 10, 15, 20. That is 20 cents.\n\nCheck: $5 + 5 + 5 + 5 = 20$.\n\n> **Watch out.** 4 coins is not 4 cents. Count by what each coin is worth.",
        "1 美分硬币值 1 美分，5 美分硬币值 5 美分，10 美分硬币值 10 美分。这里有 4 枚 5 美分硬币，五个五个地数：5、10、15、20，是 20 美分。\n\n检验：$5 + 5 + 5 + 5 = 20$。\n\n> **注意。** 4 枚硬币不是 4 美分，要按每枚的面值来数。",
      ],
      (rng) => {
        const v = rng.pick<1 | 5 | 10>([1, 5, 10]);
        const n = rng.int(2, 9);
        const name = rng.pick(earlyNames);
        const counts = Array.from({ length: n }, (_, i) => v * (i + 1));
        const by = v === 1 ? ["ones", "一个一个"] : v === 5 ? ["fives", "五个五个"] : ["tens", "十个十个"];
        const other = v === 10 ? 5 : 10;
        return solved(
          [`${name} has these coins. How many cents is that?`, `${name} 有这些硬币。一共是多少美分？`],
          n * v,
          [
            [
              ["Find what each coin is worth", "看每枚值多少"],
              [`Each coin is a ${coinsEn[v][0]}, worth ${v} ${v === 1 ? "cent" : "cents"}.`, `每枚都是${coinZh(v)}，值 ${v} 美分。`],
            ],
            [
              [`Count by ${by[0]}`, `${by[1]}地数`],
              [`${counts.join(", ")}.`, `${counts.join("、")}。`],
            ],
          ],
          [
            `Add the coins: $${Array<number>(n).fill(v).join(" + ")} = ${n * v}$.`,
            `把硬币加起来：$${Array<number>(n).fill(v).join(" + ")} = ${n * v}$。`,
          ],
          [
            [n, "That counts the coins, not the cents.", "这数的是硬币的枚数，不是美分数。"],
            [n * other, `This counts each coin as ${other} cents. Each one is ${v}.`, `这把每枚当成了 ${other} 美分，每枚是 ${v} 美分。`],
            [n + v, "This adds one coin's value to the number of coins.", "这是把一枚的面值加到了枚数上。"],
          ],
          coinsFigure(Array<number>(n).fill(v)),
        );
      },
      captioned(coinsFigure([5, 5, 5, 5]), "Four coins, each worth 5 cents.", "四枚硬币，每枚值 5 美分。"),
    ),
    earlyPoint(
      "which-coins-are-worth-more",
      ["Which coins are worth more", "哪些硬币更值钱"],
      [
        "3 dimes are 10, 20, 30 cents. 10 pennies are only 10 cents. So the 3 dimes are worth more, even though there are fewer coins.\n\nCheck: $30 - 10 = 20$, so the dimes are worth 20 cents more.\n\n> **Watch out.** More coins do not always mean more money. Count the cents.",
        "3 枚 10 美分硬币是 10、20、30 美分；10 枚 1 美分硬币只有 10 美分。所以 3 枚 10 美分硬币更值钱，虽然硬币少。\n\n检验：$30 - 10 = 20$，10 美分硬币那组多 20 美分。\n\n> **注意。** 硬币多不一定钱多，要数美分。",
      ],
      (rng) => {
        const pick = () => ({ v: rng.pick<1 | 5 | 10>([1, 5, 10]), n: rng.int(2, 9) });
        const a = pick();
        let b = pick();
        while (a.v * a.n === b.v * b.n || a.v === b.v) b = { v: rng.pick<1 | 5 | 10>(a.v === 10 ? [1, 5] : [10]), n: rng.int(2, 9) };
        const say = (c: { v: 1 | 5 | 10; n: number }): Pair => [`${c.n} ${coinsEn[c.v][1]}`, `${c.n} 枚${coinZh(c.v)}`];
        const big = a.v * a.n > b.v * b.n ? a : b;
        const small = big === a ? b : a;
        const bc = big.v * big.n;
        const sc = small.v * small.n;
        return picked(
          rng,
          ["Which group of coins is worth more?", "哪一组硬币更值钱？"],
          say(big),
          [
            [say(small), `They are worth ${sc} cents, less than ${bc}.`, `它们值 ${sc} 美分，比 ${bc} 美分少。`],
            [["They are worth the same", "两组一样值钱"], `${bc} cents and ${sc} cents are different.`, `${bc} 美分和 ${sc} 美分不一样。`],
          ],
          [
            [
              ["Count the first group", "数第一组"],
              [
                `${say(a)[0]}: ${a.n} times ${a.v} cents is ${a.v * a.n} cents.`,
                `${say(a)[1]}：${a.n} 个 ${a.v} 美分，是 ${a.v * a.n} 美分。`,
              ],
            ],
            [
              ["Count the second group", "数第二组"],
              [
                `${say(b)[0]}: ${b.n} times ${b.v} cents is ${b.v * b.n} cents.`,
                `${say(b)[1]}：${b.n} 个 ${b.v} 美分，是 ${b.v * b.n} 美分。`,
              ],
            ],
          ],
          [
            `Subtract: $${bc} - ${sc} = ${bc - sc}$, so ${say(big)[0]} are worth ${bc - sc} cents more.`,
            `相减：$${bc} - ${sc} = ${bc - sc}$，${say(big)[1]}多 ${bc - sc} 美分。`,
          ],
        );
      },
      captioned(
        coinsFigure([10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
        "Three coins worth 10 cents each and ten coins worth 1 cent each.",
        "三枚 10 美分硬币和十枚 1 美分硬币。",
      ),
    ),
    earlyPoint(
      "the-same-value-in-other-coins",
      ["The same value in other coins", "用别的硬币表示同样的钱"],
      [
        "Trade 3 nickels for pennies. 3 nickels are 5, 10, 15 cents. Each penny is 1 cent, so you get 15 pennies.\n\nCheck: put the pennies in groups of 5. There are 3 groups, one for each nickel.\n\n> **Watch out.** You get more pennies than nickels. It is 15 pennies, not 3.",
        "用 3 枚 5 美分硬币换 1 美分硬币。3 枚 5 美分硬币是 5、10、15 美分。每枚 1 美分硬币值 1 美分，所以换到 15 枚。\n\n检验：把 1 美分硬币每 5 枚放一堆，正好 3 堆，一堆对应一枚 5 美分硬币。\n\n> **注意。** 换到的 1 美分硬币比 5 美分硬币多。是 15 枚，不是 3 枚。",
      ],
      (rng) => {
        const form = rng.int(0, 2);
        const n = rng.int(2, 9);
        const name = rng.pick(earlyNames);
        if (form < 2) {
          const v = form === 0 ? 5 : 10;
          const w = form === 0 ? 10 : 5;
          return solved(
            [
              `${name} trades ${n} ${coinsEn[v][1]} for pennies. How many pennies does ${name} get?`,
              `${name} 用 ${n} 枚${coinZh(v)}换 1 美分硬币。能换多少枚？`,
            ],
            v * n,
            [
              [
                ["Find the cents", "算出美分数"],
                [`${n} ${coinsEn[v][1]} are worth ${v * n} cents.`, `${n} 枚${coinZh(v)}值 ${v * n} 美分。`],
                [`${n} \\times ${v} = ${v * n}`],
              ],
              [
                ["Count the pennies", "数 1 美分硬币"],
                [`Each penny is 1 cent, so it takes ${v * n} pennies.`, `每枚 1 美分硬币值 1 美分，所以要 ${v * n} 枚。`],
              ],
            ],
            [
              `Put the pennies in groups of ${v}: there are ${n} groups, one for each ${coinsEn[v][0]}.`,
              `把 1 美分硬币每 ${v} 枚放一堆：正好 ${n} 堆，一堆对应一枚${coinZh(v)}。`,
            ],
            [
              [n, "That keeps the number of coins. Each one trades for more pennies.", "这还是原来的枚数，每枚能换好几枚 1 美分硬币。"],
              [w * n, `This counts each ${coinsEn[v][0]} as ${w} cents. It is ${v}.`, `这把每枚当成了 ${w} 美分，其实是 ${v} 美分。`],
              [n + v, `This adds ${v} to the number of coins.`, `这是把 ${v} 加到了枚数上。`],
            ],
          );
        }
        return solved(
          [
            `${name} trades ${n} dimes for nickels. How many nickels does ${name} get?`,
            `${name} 用 ${n} 枚 10 美分硬币换 5 美分硬币。能换多少枚？`,
          ],
          2 * n,
          [
            [
              ["Trade one dime", "先换一枚"],
              ["A dime is 10 cents, which is 2 nickels.", "1 枚 10 美分硬币是 10 美分，能换 2 枚 5 美分硬币。"],
            ],
            [
              ["Trade them all", "全部换掉"],
              [`Each of the ${n} dimes gives 2 nickels:`, `${n} 枚每枚换 2 枚：`],
              [`${n} \\times 2 = ${2 * n}`],
            ],
          ],
          [
            `Count the cents: ${n} dimes are ${10 * n} cents, and ${2 * n} nickels are ${10 * n} cents too.`,
            `算美分：${n} 枚 10 美分硬币是 ${10 * n} 美分，${2 * n} 枚 5 美分硬币也是 ${10 * n} 美分。`,
          ],
          [
            [
              n,
              "That keeps the number of coins. Each dime trades for 2 nickels.",
              "这还是原来的枚数，每枚 10 美分硬币能换 2 枚 5 美分硬币。",
            ],
            [
              10 * n,
              "That is the number of cents, which is the count in pennies, not nickels.",
              "这是美分数，也就是能换的 1 美分硬币枚数，不是 5 美分硬币。",
            ],
            [5 * n, "This gives 5 nickels for each dime. Each dime is only 2 nickels.", "这每枚 10 美分硬币换了 5 枚，其实只能换 2 枚。"],
          ],
        );
      },
      captioned(coinsFigure([5, 5, 5]), "Three coins worth 5 cents each.", "三枚 5 美分硬币。"),
    ),
  ],
  [
    "Lena has 4 coins. Each one is a nickel, worth 5 cents. She counts by fives: 5, 10, 15, 20. She has 20 cents.\n\nCheck: $5 + 5 + 5 + 5 = 20$.\n\nIn this lesson we learn what pennies, nickels and dimes are worth.",
    "莉娜有 4 枚硬币，每枚都是 5 美分。她五个五个地数：5、10、15、20，一共 20 美分。\n\n检验：$5 + 5 + 5 + 5 = 20$。\n\n本课我们认识 1 美分、5 美分和 10 美分硬币的面值。",
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
        "Dimes are like tens and pennies are like ones. Here are 3 dimes and 4 pennies. Count the dimes by tens: 10, 20, 30. Then count on the pennies: 31, 32, 33, 34. That is 34 cents.\n\nCheck: 3 tens and 4 ones make 34.\n\n> **Watch out.** A dime is 10 cents, not 1. Do not count every coin as 1.",
        "10 美分硬币就像十，1 美分硬币就像一。这里有 3 枚 10 美分和 4 枚 1 美分。先十个十个地数 10 美分硬币：10、20、30；再接着数 1 美分硬币：31、32、33、34。一共 34 美分。\n\n检验：3 个十和 4 个一是 34。\n\n> **注意。** 10 美分硬币值 10 美分，不是 1 美分。不要把每枚都当成 1。",
      ],
      (rng) => {
        const d = rng.int(1, 6);
        const p = rng.int(1, 7);
        const total = 10 * d + p;
        const tens = Array.from({ length: d }, (_, i) => 10 * (i + 1));
        const ones = Array.from({ length: p }, (_, i) => 10 * d + i + 1);
        return solved(
          ["How many cents are these coins worth?", "这些硬币一共值多少美分？"],
          total,
          [
            [
              ["Count the dimes by tens", "十个十个地数 10 美分硬币"],
              [`${tens.join(", ")}.`, `${tens.join("、")}。`],
            ],
            [
              ["Count on the pennies", "接着数 1 美分硬币"],
              [`${ones.join(", ")}.`, `${ones.join("、")}。`],
            ],
          ],
          [`${many(d, "ten")} and ${many(p, "one")} make ${total}.`, `${d} 个十和 ${p} 个一是 ${total}。`],
          [
            [d + p, "This counts every coin as 1 cent. A dime is 10 cents.", "这把每枚硬币都当成了 1 美分，10 美分硬币值 10 美分。"],
            [10 * p + d, "This swaps the dimes and the pennies.", "这把 10 美分和 1 美分硬币弄反了。"],
            [10 * d, "This forgets the pennies.", "这忘了数 1 美分硬币。"],
          ],
          coinsFigure(rng.shuffle([...Array<number>(d).fill(10), ...Array<number>(p).fill(1)])),
        );
      },
      captioned(
        coinsFigure([10, 10, 10, 1, 1, 1, 1]),
        "Three coins worth 10 cents and four coins worth 1 cent.",
        "三枚 10 美分硬币和四枚 1 美分硬币。",
      ),
    ),
    earlyPoint(
      "making-an-amount-with-the-fewest-coins",
      ["Making an amount with the fewest coins", "用最少的硬币凑钱"],
      [
        "Make 47 cents with the fewest dimes and pennies. 47 is 4 tens and 7 ones. So use 4 dimes and 7 pennies.\n\nCheck: $40 + 7 = 47$.\n\n> **Watch out.** Use as many dimes as you can. 3 dimes and 17 pennies also make 47, but that is many more coins.",
        "用最少的 10 美分和 1 美分硬币凑出 47 美分。47 是 4 个十和 7 个一，所以用 4 枚 10 美分硬币和 7 枚 1 美分硬币。\n\n检验：$40 + 7 = 47$。\n\n> **注意。** 尽量多用 10 美分硬币。3 枚 10 美分和 17 枚 1 美分也是 47 美分，但硬币多得多。",
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const p = rng.int(1, 9);
        const n = 10 * d + p;
        const askDimes = rng.bool();
        return solved(
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
          [
            [
              ["Split into tens and ones", "分成十和一"],
              [`${n} is ${many(d, "ten")} and ${many(p, "one")}.`, `${n} 是 ${d} 个十和 ${p} 个一。`],
            ],
            [
              ["Match the coins", "对应硬币"],
              [
                `Each ten is a dime and each one is a penny: ${d} dimes and ${p} pennies.`,
                `一个十是一枚 10 美分硬币，一个一是一枚 1 美分硬币：${d} 枚 10 美分和 ${p} 枚 1 美分。`,
              ],
            ],
          ],
          [`Count them: $${10 * d} + ${p} = ${n}$ cents.`, `数一数：$${10 * d} + ${p} = ${n}$ 美分。`],
          askDimes
            ? [
                [p, "That is the number of pennies.", "这是 1 美分硬币的枚数。"],
                [n, "That is the number of cents, as if all the coins were pennies.", "这是美分数，好像全用 1 美分硬币。"],
                [d + p, "That is all the coins together.", "这是所有硬币的枚数。"],
              ]
            : [
                [d, "That is the number of dimes.", "这是 10 美分硬币的枚数。"],
                [n, "That uses only pennies. Use dimes for the tens.", "这全用了 1 美分硬币，十要用 10 美分硬币。"],
                [d + p, "That is all the coins together.", "这是所有硬币的枚数。"],
              ],
        );
      },
      captioned(
        coinsFigure([10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1]),
        "Four coins worth 10 cents and seven coins worth 1 cent.",
        "四枚 10 美分硬币和七枚 1 美分硬币。",
      ),
    ),
    earlyPoint(
      "trading-pennies-for-a-dime",
      ["Trading pennies for a dime", "用 1 美分硬币换 10 美分硬币"],
      [
        "Ten pennies are worth one dime. Here are 2 dimes and 13 pennies. Trade 10 of the pennies for a dime. Now there are 3 dimes and 3 pennies. It is still 33 cents.\n\nCheck: $20 + 13 = 33$ and $30 + 3 = 33$.\n\n> **Watch out.** After the trade, only 3 pennies are left, not 13.",
        "10 枚 1 美分硬币和 1 枚 10 美分硬币一样值钱。这里有 2 枚 10 美分和 13 枚 1 美分。用其中 10 枚 1 美分换 1 枚 10 美分，现在有 3 枚 10 美分和 3 枚 1 美分，还是 33 美分。\n\n检验：$20 + 13 = 33$，$30 + 3 = 33$。\n\n> **注意。** 换过以后，1 美分硬币只剩 3 枚，不是 13 枚。",
      ],
      (rng) => {
        const d = rng.int(1, 4);
        const p = rng.int(11, 16);
        const total = 10 * d + p;
        const figure = coinsFigure([...Array<number>(d).fill(10), ...Array<number>(p).fill(1)]);
        if (rng.bool())
          return solved(
            [
              "Trade ten of the pennies for a dime. How many dimes are there now?",
              "用其中 10 枚 1 美分硬币换 1 枚 10 美分硬币。现在有几枚 10 美分硬币？",
            ],
            d + 1,
            [
              [
                ["Take ten pennies", "拿出 10 枚 1 美分硬币"],
                [`They become one new dime. ${p - 10} pennies stay.`, `它们换成 1 枚新的 10 美分硬币，还剩 ${p - 10} 枚 1 美分硬币。`],
              ],
              [["Add the new dime", "加上新的 10 美分硬币"], ["", ""], [`${d} + 1 = ${d + 1}`]],
            ],
            [
              `The value stays the same: $${10 * (d + 1)} + ${p - 10} = ${total}$ cents, as before.`,
              `钱数不变：$${10 * (d + 1)} + ${p - 10} = ${total}$ 美分，和原来一样。`,
            ],
            [
              [d, "This forgets the new dime.", "这忘了新换来的 10 美分硬币。"],
              [d + 2, "Ten pennies make just one dime.", "10 枚 1 美分硬币只能换 1 枚 10 美分硬币。"],
              [p, "That is the number of pennies.", "这是 1 美分硬币的枚数。"],
            ],
            figure,
          );
        return solved(
          ["How many cents are these coins worth?", "这些硬币一共值多少美分？"],
          total,
          [
            [
              ["Count the dimes", "数 10 美分硬币"],
              [`${d} ${d === 1 ? "dime is" : "dimes are"} ${10 * d} cents.`, `${d} 枚 10 美分硬币是 ${10 * d} 美分。`],
            ],
            [["Add the pennies", "加上 1 美分硬币"], ["", ""], [`${10 * d} + ${p} = ${total}`]],
          ],
          [
            `Trade ten pennies for a dime: ${d + 1} dimes and ${p - 10} pennies, and $${10 * (d + 1)} + ${p - 10} = ${total}$.`,
            `用 10 枚 1 美分换 1 枚 10 美分：${d + 1} 枚 10 美分和 ${p - 10} 枚 1 美分，$${10 * (d + 1)} + ${p - 10} = ${total}$。`,
          ],
          [
            [d + p, "This counts every coin as 1 cent.", "这把每枚硬币都当成了 1 美分。"],
            [Number(`${d}${p}`), `This writes ${d} and ${p} side by side.`, `这是把 ${d} 和 ${p} 并排写在一起了。`],
            [10 * d, "This forgets the pennies.", "这忘了数 1 美分硬币。"],
          ],
          figure,
        );
      },
      captioned(
        coinsFigure([10, 10, ...Array<number>(13).fill(1)]),
        "Two coins worth 10 cents and thirteen coins worth 1 cent.",
        "两枚 10 美分硬币和十三枚 1 美分硬币。",
      ),
    ),
  ],
  [
    "Omar has 3 dimes and 4 pennies in his pocket. The dimes are like tens and the pennies are like ones. So he has 34 cents.\n\nCheck: $30 + 4 = 34$.\n\nIn this lesson we count and make amounts with dimes and pennies.",
    "奥马尔口袋里有 3 枚 10 美分硬币和 4 枚 1 美分硬币。10 美分硬币就像十，1 美分硬币就像一，所以他有 34 美分。\n\n检验：$30 + 4 = 34$。\n\n本课我们用 10 美分和 1 美分硬币数钱和凑钱。",
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
        "Here circles, squares, triangles and stars are all mixed up. To count the stars, go row by row from left to right and touch each star once: 1, 2, 3, 4. There are 4 stars.\n\nCheck: count the stars again from right to left. You get 4 again.\n\n> **Watch out.** Count only the stars. Do not count every shape in the picture.",
        "圆、正方形、三角形和星形都混在一起。要数星形，就一行一行从左往右看，每个星形指一下：1、2、3、4。一共有 4 个星形。\n\n检验：再从右往左数一遍星形，还是 4 个。\n\n> **注意。** 只数星形，不要把图里所有的图形都数进去。",
      ],
      (rng) => {
        const kinds: MixedShape[] = ["circle", "square", "triangle", "star"];
        const { counts, items } = shapeMix(rng, kinds);
        const i = rng.int(0, 3);
        const kind = kinds[i] as MixedShape;
        const answer = counts[i] as number;
        const rest = counts.filter((_, k) => k !== i);
        const [en, zh] = shapeWords[kind];
        return solved(
          [`How many ${en} are in the picture?`, `图中有多少个${zh}？`],
          answer,
          [
            [
              ["Pick out one kind", "认准一类"],
              [`Look only for the ${en}.`, `只找${zh}。`],
            ],
            [
              ["Count row by row", "一行一行地数"],
              [`Touch each one once as you go: there are ${answer}.`, `每个指一下，不重复：一共有 ${answer} 个。`],
            ],
          ],
          [
            `Count the other kinds too: $${rest.join(" + ")} + ${answer} = ${items.length}$, which is every shape in the picture.`,
            `把别的几类也数出来：$${rest.join(" + ")} + ${answer} = ${items.length}$，正好是图中所有的图形。`,
          ],
          [
            [items.length, `That counts every shape, not only the ${en}.`, `这把所有图形都数进去了，不只是${zh}。`],
            [items.length - answer, `That counts the shapes that are not ${en}.`, `这数的是不是${zh}的图形。`],
            [answer + 1, "One was counted twice. Touch each one only once.", "有一个数了两次。每个只能数一次。"],
            [answer - 1, "One was missed. Go along every row to the end.", "漏数了一个。每一行都要看到头。"],
          ],
          mixedShapesFigure(items),
        );
      },
      captioned(
        mixedShapesFigure(["circle", "star", "square", "circle", "star", "triangle", "star", "square", "circle", "star"]),
        "Ten shapes mixed together; four of them are stars.",
        "十个图形混在一起，其中四个是星形。",
      ),
    ),
    earlyPoint(
      "how-many-more-of-one-kind",
      ["How many more of one kind", "一类比另一类多多少"],
      [
        'There are 6 circles and 4 squares. Match them in pairs: each square gets a circle, and 2 circles are left over. So there are 2 more circles.\n\nCheck: $6 - 4 = 2$.\n\n> **Watch out.** "How many more" is not "how many in all". Do not add 6 and 4.',
        "有 6 个圆和 4 个正方形。一个配一个：每个正方形配一个圆，还剩 2 个圆。所以圆多 2 个。\n\n检验：$6 - 4 = 2$。\n\n> **注意。** “多多少”不是“一共有多少”，不要把 6 和 4 加起来。",
      ],
      (rng) => {
        const kinds: MixedShape[] = ["circle", "square", "triangle"];
        const { counts } = shapeMix(rng, kinds);
        let i = rng.int(0, 2);
        let j = (i + 1 + rng.int(0, 1)) % 3;
        if ((counts[i] as number) === (counts[j] as number)) counts[j] = (counts[j] as number) + 1;
        if ((counts[i] as number) < (counts[j] as number)) [i, j] = [j, i];
        const [bigEn, bigZh] = shapeWords[kinds[i] as MixedShape];
        const [smallEn, smallZh] = shapeWords[kinds[j] as MixedShape];
        const big = counts[i] as number;
        const small = counts[j] as number;
        const redrawn = rng.shuffle(kinds.flatMap((kind, k) => Array<MixedShape>(counts[k] as number).fill(kind)));
        return solved(
          [`How many more ${bigEn} are there than ${smallEn}?`, `${bigZh}比${smallZh}多多少个？`],
          big - small,
          [
            [
              ["Count both kinds", "两类都数出来"],
              [`There are ${big} ${bigEn} and ${small} ${smallEn}.`, `${bigZh}有 ${big} 个，${smallZh}有 ${small} 个。`],
            ],
            [["Take the smaller from the larger", "大数减小数"], ["Subtract:", "相减："], [`${big} - ${small} = ${big - small}`]],
          ],
          [
            `Add back: $${small} + ${big - small} = ${big}$, the number of ${bigEn}.`,
            `加回去验算：$${small} + ${big - small} = ${big}$，正好是${bigZh}的个数。`,
          ],
          [
            [big + small, "That adds the two kinds. The question asks how many more.", "这是把两类加起来了，题目问的是多多少。"],
            [big, `That is just the number of ${bigEn}.`, `这只是${bigZh}的个数。`],
            [small, `That is just the number of ${smallEn}.`, `这只是${smallZh}的个数。`],
          ],
          mixedShapesFigure(redrawn),
        );
      },
      captioned(
        mixedShapesFigure(["circle", "square", "circle", "circle", "square", "circle", "square", "circle", "square", "circle"]),
        "Six circles and four squares, mixed together.",
        "六个圆和四个正方形混在一起。",
      ),
    ),
    earlyPoint(
      "the-missing-count-in-a-table",
      ["The missing count in a table", "表中缺少的数"],
      [
        "A table shows 5 circles, 3 squares and a question mark for the triangles. There are 12 shapes in all. The counts we can see make $5 + 3 = 8$, so the triangles are $12 - 8 = 4$.\n\nCheck: $5 + 3 + 4 = 12$.\n\n> **Watch out.** The total is not one of the counts. Take the counts you see away from it.",
        "表中圆有 5 个，正方形有 3 个，三角形的格子是问号。一共有 12 个图形。看得见的两个数合起来是 $5 + 3 = 8$，所以三角形有 $12 - 8 = 4$ 个。\n\n检验：$5 + 3 + 4 = 12$。\n\n> **注意。** 总数不是表里的某一个数，要用总数减去看得见的数。",
      ],
      (rng) => {
        const symbols = ["●", "■", "▲"];
        const counts = [rng.int(2, 8), rng.int(2, 8), rng.int(2, 8)] as [number, number, number];
        const total = counts[0] + counts[1] + counts[2];
        const hidden = rng.int(0, 2);
        const known = counts.filter((_, i) => i !== hidden) as [number, number];
        const seen = known[0] + known[1];
        const answer = counts[hidden] as number;
        return solved(
          [
            `Some shapes were sorted and counted. There are ${total} shapes in all. What number goes at the question mark in the table?`,
            `把一些图形分类并数好。一共有 ${total} 个图形。表中问号处应该填几？`,
          ],
          answer,
          [
            [
              ["Add the counts you see", "把看得见的数加起来"],
              ["The other two rows make", "另外两行合起来是"],
              [`${known[0]} + ${known[1]} = ${seen}`],
            ],
            [
              ["Take that from the total", "用总数去减"],
              ["The rest are the missing ones:", "剩下的就是缺少的："],
              [`${total} - ${seen} = ${answer}`],
            ],
          ],
          [
            `All three counts must make the total: $${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}$.`,
            `三个数合起来必须等于总数：$${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}$。`,
          ],
          [
            [total, "That is the total, not the missing count.", "这是总数，不是缺少的数。"],
            [seen, "That is the sum of the other two counts.", "这是另外两个数的和。"],
            [
              total - known[0],
              `This takes away only ${known[0]}. Take away ${known[1]} as well.`,
              `这只减去了 ${known[0]}，还要再减去 ${known[1]}。`,
            ],
            [total + seen, "This adds instead of taking away.", "这里应该减，却加了。"],
          ],
          tableFigure(
            symbols,
            counts.map((c, i) => (i === hidden ? null : c)),
          ),
        );
      },
      captioned(
        tableFigure(["●", "■", "▲"], [5, 3, null]),
        "A table with 5 circles, 3 squares and a missing count of triangles.",
        "表中圆 5 个，正方形 3 个，三角形的数缺了。",
      ),
    ),
  ],
  [
    "Mia empties her toy box. Cars, balls and blocks are all mixed up. She makes three piles and counts each one: 4 cars, 3 balls and 5 blocks.\n\nCheck: $4 + 3 + 5 = 12$, and there were 12 toys in the box.\n\nIn this lesson we sort things into kinds, count each kind and fill in a table.",
    "米娅把玩具箱倒空了。小汽车、球和积木混在一起。她分成三堆，每堆数一数：4 辆小汽车、3 个球、5 块积木。\n\n检验：$4 + 3 + 5 = 12$，箱子里正好有 12 个玩具。\n\n本课我们把东西分类，数出每一类，再填进表格。",
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
        "Row A has 6 marks, row B has 3 and row C has 5. Each mark is one child. Add the rows: $6 + 3 + 5 = 14$ children voted.\n\nCheck: add in another order, $5 + 6 + 3 = 14$.\n\n> **Watch out.** The longest row is not the total. Add every row.",
        "A 行有 6 条记号，B 行有 3 条，C 行有 5 条。每条记号是一个孩子。把各行加起来：$6 + 3 + 5 = 14$，一共 14 个孩子投票。\n\n检验：换个顺序加，$5 + 6 + 3 = 14$。\n\n> **注意。** 最长的一行不是总数，每一行都要加上。",
      ],
      (rng) => {
        const [a, b, c] = graphValues(rng, 2, 9);
        const total = a + b + c;
        return solved(
          [
            "Children voted for a favorite snack, shown by this tally chart. How many children voted in all?",
            "孩子们投票选最喜欢的零食，结果如这张计数表所示。一共有多少个孩子投票？",
          ],
          total,
          [
            [
              ["Read each row", "读出每一行"],
              [`The rows show ${a}, ${b} and ${c}.`, `各行分别是 ${a}、${b} 和 ${c}。`],
            ],
            [["Add the rows", "把各行加起来"], ["Every vote counts once:", "每一票都算一次："], [`${a} + ${b} + ${c} = ${total}`]],
          ],
          [`Add in another order: $${c} + ${a} + ${b} = ${total}$.`, `换个顺序加：$${c} + ${a} + ${b} = ${total}$。`],
          [
            [Math.max(a, b, c), "That is only the longest row.", "这只是最长的那一行。"],
            [a + b, "That leaves out row C.", "这漏掉了 C 行。"],
            [3, "That counts the rows, not the marks.", "这数的是行数，不是记号数。"],
          ],
          tallyFigure(["A", "B", "C"], [a, b, c]),
        );
      },
      captioned(
        tallyFigure(["A", "B", "C"], [6, 3, 5]),
        "A tally chart: row A has 6 marks, row B has 3 and row C has 5.",
        "计数表：A 行 6 条，B 行 3 条，C 行 5 条。",
      ),
    ),
    {
      ...earlyPoint(
        "two-rows-of-a-picture-graph",
        ["Two rows of a picture graph", "象形统计图的两行"],
        [
          "Each dot stands for one thing. Row A has 4 dots, row B has 6 and row C has 3. The question asks for rows A and B together: $4 + 6 = 10$.\n\nCheck: count the dots in rows A and B one by one. There are 10.\n\n> **Watch out.** Leave out row C. Add only the rows the question names.",
          "每个点代表一个东西。A 行有 4 个点，B 行有 6 个，C 行有 3 个。题目问 A 行和 B 行一共有多少：$4 + 6 = 10$。\n\n检验：把 A 行和 B 行的点一个一个数，是 10 个。\n\n> **注意。** C 行不要加。题目问到哪几行，就只加哪几行。",
        ],
        (rng) => {
          const values = graphValues(rng, 2, 9);
          const labels = ["A", "B", "C"];
          const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
          const other = 3 - i - j;
          const vi = values[i] as number;
          const vj = values[j] as number;
          const vo = values[other] as number;
          const all = vi + vj + vo;
          const answer = vi + vj;
          const [li, lj, lo] = [labels[i], labels[j], labels[other]];
          return solved(
            [`How many are in rows ${li} and ${lj} together?`, `${li} 行和 ${lj} 行一共有多少个？`],
            answer,
            [
              [
                ["Find the two rows", "找到这两行"],
                [`Row ${li} has ${vi} and row ${lj} has ${vj}.`, `${li} 行有 ${vi} 个，${lj} 行有 ${vj} 个。`],
              ],
              [["Add them", "加起来"], ["Together:", "合起来："], [`${vi} + ${vj} = ${answer}`]],
            ],
            [
              `All three rows make $${all}$; take away row ${lo}: $${all} - ${vo} = ${answer}$.`,
              `三行一共 $${all}$ 个，减去 ${lo} 行：$${all} - ${vo} = ${answer}$。`,
            ],
            [
              [all, `That adds all three rows. Row ${lo} is not asked about.`, `这把三行都加了，题目没问 ${lo} 行。`],
              [Math.abs(vi - vj), "That is the difference. The question asks how many together.", "这是相差的数，题目问的是一共多少。"],
              [vo + vi, `That uses row ${lo} instead of row ${lj}.`, `这用了 ${lo} 行，应该用 ${lj} 行。`],
              [vo + vj, `That uses row ${lo} instead of row ${li}.`, `这用了 ${lo} 行，应该用 ${li} 行。`],
            ],
            pictureGraphFigure(labels, values, 1),
          );
        },
      ),
      figure: gradeDrawings2["how-many-in-all-on-a-graph#two-rows-of-a-picture-graph"],
    },
    {
      ...earlyPoint(
        "how-many-more-than-the-other-two",
        ["The difference from the other two", "和另外两条比较"],
        [
          "Bar A shows 9, bar B shows 2 and bar C shows 4. First put B and C together: $2 + 4 = 6$. Then $9 - 6 = 3$, so bar A shows 3 more.\n\nCheck: $6 + 3 = 9$.\n\n> **Watch out.** Compare bar A with both short bars together, not with just one of them.",
          "A 条是 9，B 条是 2，C 条是 4。先把 B 和 C 合起来：$2 + 4 = 6$。再算 $9 - 6 = 3$，A 条多 3。\n\n检验：$6 + 3 = 9$。\n\n> **注意。** 要拿 A 条和两条短的合起来比，不是只和其中一条比。",
        ],
        (rng) => {
          const a = rng.int(2, 4);
          const b = rng.int(2, 4);
          const c = a + b + rng.int(1, 4);
          const order = rng.shuffle([a, b, c]);
          const labels = ["A", "B", "C"];
          const tall = labels[order.indexOf(c)] as string;
          const diff = c - a - b;
          return solved(
            [`How many more does bar ${tall} show than the other two bars together?`, `长条 ${tall} 比另外两条合起来多多少？`],
            diff,
            [
              [
                ["Put the other two together", "先把另外两条合起来"],
                [`They show ${a} and ${b}:`, `它们是 ${a} 和 ${b}：`],
                [`${a} + ${b} = ${a + b}`],
              ],
              [
                ["Compare with the tall bar", "再和最高的比"],
                [`Bar ${tall} shows ${c}:`, `${tall} 条是 ${c}：`],
                [`${c} - ${a + b} = ${diff}`],
              ],
            ],
            [
              `Add back: $${a + b} + ${diff} = ${c}$, the height of bar ${tall}.`,
              `加回去验算：$${a + b} + ${diff} = ${c}$，正好是 ${tall} 条的高度。`,
            ],
            [
              [c - a, `That compares with the bar showing ${a} only.`, `这只和 ${a} 那一条比了。`],
              [c - b, `That compares with the bar showing ${b} only.`, `这只和 ${b} 那一条比了。`],
              [c + a + b, "That adds all three bars.", "这把三条都加起来了。"],
              [a + b, "That stops after adding the two short bars.", "这只把两条短的加起来，还没有比。"],
            ],
            barGraphFigure(labels, order, 1),
          );
        },
      ),
      figure: gradeDrawings2["how-many-in-all-on-a-graph#how-many-more-than-the-other-two"],
    },
  ],
  [
    "Our class votes for a pet. The tally chart shows 6 for dogs, 4 for cats and 2 for fish. To find how many voted, add the rows: $6 + 4 + 2 = 12$.\n\nCheck: there are 12 children in the class, and each voted once.\n\nIn this lesson we read graphs to find how many in all and how many more.",
    "我们班投票选宠物。计数表上狗 6 票，猫 4 票，鱼 2 票。要知道一共多少人投票，把各行加起来：$6 + 4 + 2 = 12$。\n\n检验：班上有 12 个孩子，每人投一票。\n\n本课我们看统计图，求一共有多少、多多少。",
  ],
);

const solidClues: Readonly<Record<SolidKind, Pair>> = {
  cube: ["has six flat square faces, all the same size", "有六个大小相同的正方形平面"],
  box: ["has six flat faces that are not all squares", "有六个平面，但不都是正方形"],
  cylinder: ["has two flat circles and a curved side", "有两个圆形平面和一个弯曲的侧面"],
  cone: ["has one flat circle and comes to a point", "有一个圆形平面，顶上是一个尖"],
  sphere: ["is round all over, with no flat faces", "处处都是圆的，没有平面"],
  pyramid: ["has flat triangle faces that meet at a point, and no curved part", "有三角形的平面在顶上交于一点，没有弯曲的部分"],
};

const solidRolls: Readonly<Record<SolidKind, Pair>> = {
  cube: ["does not roll, because every face is flat", "不会滚，因为每个面都是平的"],
  box: ["does not roll, because every face is flat", "不会滚，因为每个面都是平的"],
  cylinder: ["rolls on its side but stands still on a flat circle", "躺倒能滚，立在圆形平面上就不动"],
  cone: ["rolls around in a circle on its side", "躺倒时会绕着圈滚"],
  sphere: ["rolls in every direction", "朝哪个方向都能滚"],
  pyramid: ["does not roll, because every face is flat", "不会滚，因为每个面都是平的"],
};

/** solidWrongs gives a reason for each wrong solid: what that solid has instead. */
function solidWrongs(kinds: readonly SolidKind[]): Wrong[] {
  return kinds.map((k) => {
    const name = solidName(k);
    return [name, `A ${name[0]} ${solidClues[k][0]}. This shape does not.`, `${name[1]}${solidClues[k][1]}，这个图形不是这样。`];
  });
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
    {
      ...earlyPoint(
        "the-name-of-a-solid",
        ["The name of a solid", "立体图形的名称"],
        [
          "A can of soup has two flat circles and a curved side. A shape like that is a cylinder.\n\nCheck: lay the can on its side and it rolls; stand it up and it stays still. A cylinder does just that.\n\n> **Watch out.** A cylinder is not a circle. A circle is flat; a cylinder is a solid you can hold.",
          "汤罐头有两个圆形的平面和一个弯曲的侧面。这样的图形叫圆柱。\n\n检验：把罐头放倒，它会滚；把它立起来，它就不动。圆柱正是这样。\n\n> **注意。** 圆柱不是圆。圆是平的，圆柱是能拿在手里的立体图形。",
        ],
        (rng) => {
          const kind = rng.pick(allSolids);
          const others = rng.sample(
            allSolids.filter((k) => k !== kind),
            3,
          );
          const name = solidName(kind);
          return picked(
            rng,
            ["What is the name of this solid shape?", "这个立体图形叫什么？"],
            name,
            solidWrongs(others),
            [
              [
                ["Look at the faces", "看它的面"],
                [`This shape ${solidClues[kind][0]}.`, `这个图形${solidClues[kind][1]}。`],
              ],
              [
                ["Name it", "说出名称"],
                [`A shape like that is a ${name[0]}.`, `这样的图形叫${name[1]}。`],
              ],
            ],
            [
              `Think about rolling it: it ${solidRolls[kind][0]}, just as a ${name[0]} does.`,
              `想想它能不能滚：它${solidRolls[kind][1]}，${name[1]}正是这样。`,
            ],
            solidFigure(kind, rng.pick([0.9, 1, 1.1, 1.2, 1.3])),
          );
        },
      ),
      figure: gradeDrawings2["naming-solid-shapes#the-name-of-a-solid"],
    },
    {
      ...earlyPoint(
        "what-a-solid-can-do",
        ["What a solid can do", "立体图形的特点"],
        [
          "A ball is curved all over, so it rolls every way. A cube has only flat faces, so it does not roll, but cubes stack well.\n\nCheck: try to stack two balls. They slide off, because they have no flat face to sit on.\n\n> **Watch out.** Size does not matter. A big ball rolls just like a small one, so look at the faces, not the size.",
          "球处处都是弯的，所以朝哪个方向都能滚。正方体只有平面，所以不会滚，但能叠得很稳。\n\n检验：试着把两个球叠起来。它们会滑下来，因为没有平面可以放稳。\n\n> **注意。** 和大小没有关系。大球和小球一样会滚，要看面，不要看大小。",
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
          return picked(
            rng,
            [`Which shape ${clue.en}?`, `哪个图形${clue.zh}？`],
            name,
            solidWrongs(others),
            [
              [
                ["Read the clue", "读线索"],
                [`The shape ${clue.en}.`, `这个图形${clue.zh}。`],
              ],
              [
                ["Match a solid", "找到对应的图形"],
                [`A ${name[0]} ${solidClues[clue.kind][0]}, so it fits.`, `${name[1]}${solidClues[clue.kind][1]}，正好符合。`],
              ],
            ],
            [
              `Think about rolling it: a ${name[0]} ${solidRolls[clue.kind][0]}, which fits the clue.`,
              `想想它能不能滚：${name[1]}${solidRolls[clue.kind][1]}，和线索相符。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["naming-solid-shapes#what-a-solid-can-do"],
    },
    earlyPoint(
      "counting-solids-in-a-row",
      ["Counting solids in a row", "数一排立体图形"],
      [
        "This row has a ball, a can, a box, another can and a cone. Look at each one from left to right. The cans are cylinders, so there are 2 cylinders.\n\nCheck: the other shapes are 3, and $2 + 3 = 5$ shapes in the row.\n\n> **Watch out.** A big one and a small one have the same name. Count every cylinder, whatever its size.",
        "这一排有一个球、一个罐头、一个盒子、又一个罐头和一个圆锥。从左往右一个一个看。罐头是圆柱，所以有 2 个圆柱。\n\n检验：其他图形有 3 个，$2 + 3 = 5$，正好是这一排的个数。\n\n> **注意。** 大的小的名称都一样。不管大小，每个圆柱都要数。",
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
        return solved(
          [`How many of these solids are the shape called a ${name[0]}?`, `这些立体图形中，有几个是${name[1]}？`],
          n,
          [
            [
              ["Know the shape", "认准这个图形"],
              [`A ${name[0]} ${solidClues[kind][0]}.`, `${name[1]}${solidClues[kind][1]}。`],
            ],
            [
              ["Go from left to right", "从左往右看"],
              [`Checking each one in turn, ${n} of them are the ${name[0]} shape.`, `一个一个地看，有 ${n} 个是${name[1]}。`],
            ],
          ],
          [
            `Count the others: there are ${fill.length}, and $${n} + ${fill.length} = ${row.length}$ solids in all.`,
            `数其他的：有 ${fill.length} 个，$${n} + ${fill.length} = ${row.length}$，正好是全部的个数。`,
          ],
          [
            [row.length, "That counts every solid in the row.", "这把一排里所有的图形都数了。"],
            [row.length - n, `That counts the solids that are not ${name[0]}s.`, `这数的是不是${name[1]}的图形。`],
            [n + 1, "One other solid was counted too. Check each one's faces.", "多数了一个别的图形。要看清每个图形的面。"],
          ],
          solidsRowFigure(row),
        );
      },
      captioned(
        solidsRowFigure(["sphere", "cylinder", "box", "cylinder", "cone"]),
        "A row of five solids: a sphere, a cylinder, a box, a cylinder and a cone.",
        "一排五个立体图形：球、圆柱、长方体、圆柱、圆锥。",
      ),
    ),
  ],
  [
    "Sam finds a ball, a can and a box at home. The ball rolls every way. The can rolls only on its side. The box does not roll at all.\n\nCheck: the box has flat faces all around, so it has no curved side to roll on.\n\nIn this lesson we name solid shapes and tell what they can do.",
    "山姆在家里找到一个球、一个罐头和一个盒子。球朝哪个方向都能滚，罐头只能躺倒滚，盒子根本不会滚。\n\n检验：盒子四周都是平面，没有弯曲的侧面可以滚。\n\n本课我们认识立体图形，知道它们能做什么。",
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
