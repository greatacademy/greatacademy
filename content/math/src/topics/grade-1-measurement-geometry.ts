// 1st Grade Math: comparing and measuring lengths, telling time to the hour and
// half hour, tallies and first graphs, and the attributes, composition and equal
// shares of shapes.

import type { Figure, Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { svgDocument } from "@ga/subject-math";
import {
  barGraphFigure,
  clockFigure,
  cutBarFigure,
  earlyPoint,
  earlyTopic,
  gridFigure,
  lengthBarsFigure,
  pictureGraphFigure,
  polygonFigure,
  slicedCircleFigure,
  tallyFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { captioned, type Pair, picked, type Slip, solved, type Walk, type Wrong } from "./early-grades-more-kit.ts";
import { plural } from "./grade-2-numbers-operations.ts";

/** clockHour wraps a number onto the hours of a clock face, from 1 to 12. */
const clockHour = (hour: number): number => ((hour - 1 + 12) % 12) + 1;

/** comparedObjects are things whose lengths a story can compare. */
const comparedObjects = [
  { en: "rope", zh: "绳子" },
  { en: "stick", zh: "木棍" },
  { en: "ribbon", zh: "丝带" },
  { en: "scarf", zh: "围巾" },
  { en: "belt", zh: "腰带" },
  { en: "hose", zh: "水管" },
];

const comparingLengths = earlyTopic(
  "comparing-lengths-directly",
  ["Comparing Lengths Directly", "直接比较长度"],
  ["Put objects in order by length, and compare two objects by using a third.", "按长度给物体排序，并借助第三个物体比较两个物体。"],
  [],
  ["1.MD.A.1"],
  [
    earlyPoint(
      "the-longest-and-the-shortest",
      ["The longest and the shortest", "最长和最短"],
      [
        "Line things up so they all start at the same place. Then look at the other ends. The one that reaches farthest is the longest. The one that stops first is the shortest. Here bar B is the longest and bar C is the shortest.\n\nCheck: count the squares. B has 8, the most. C has 3, the fewest.\n\n> **Watch out.** The starts must line up. A short bar can look long if it starts farther along.",
        "把东西排齐，让它们从同一个地方开始。再看另一头。伸得最远的最长，最先停下的最短。这里长条 B 最长，长条 C 最短。\n\n检验：数一数格子。B 有 8 格，最多；C 有 3 格，最少。\n\n> **注意。** 开头一定要对齐。短的长条如果开始得靠前，看起来也会很长。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const lengths = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 4);
        const asksLongest = rng.bool();
        const target = asksLongest ? Math.max(...lengths) : Math.min(...lengths);
        const correct = labels[lengths.indexOf(target)] as string;
        const bar = (label: string): Pair => [`Bar ${label}`, `长条 ${label}`];
        return picked(
          rng,
          [`Which bar is the ${asksLongest ? "longest" : "shortest"}?`, `哪个长条${asksLongest ? "最长" : "最短"}？`],
          bar(correct),
          labels
            .filter((label) => label !== correct)
            .map(
              (label): Wrong => [
                bar(label),
                `Bar ${label} ${asksLongest ? "stops before" : "goes past"} bar ${correct}.`,
                `长条 ${label} 比长条 ${correct} ${asksLongest ? "短" : "长"}。`,
              ],
            ),
          [
            [
              ["Line up the starts", "对齐开头"],
              ["All the bars start at the same line.", "所有长条都从同一条线开始。"],
            ],
            [
              ["Look at the ends", "看另一头"],
              [
                `Bar ${correct} ${asksLongest ? "reaches the farthest" : "stops first"}.`,
                `长条 ${correct} ${asksLongest ? "伸得最远" : "最先停下"}。`,
              ],
            ],
          ],
          [
            `Count the squares: bar ${correct} has ${target}, ${asksLongest ? "more" : "fewer"} than any other bar.`,
            `数一数格子：长条 ${correct} 有 ${target} 格，比其他长条都${asksLongest ? "多" : "少"}。`,
          ],
          lengthBarsFigure(labels, lengths, true),
        );
      },
      captioned(
        lengthBarsFigure(["A", "B", "C"], [5, 8, 3], true),
        "Bars A, B and C start at the same line. B reaches farthest.",
        "长条 A、B、C 从同一条线开始，B 伸得最远。",
      ),
    ),
    earlyPoint(
      "comparing-through-a-third-object",
      ["Comparing through a third object", "借助第三个物体比较"],
      [
        "A rope is longer than a stick. The stick is longer than a ribbon. So the rope is longer than the ribbon too. The stick links the other two.\n\nCheck: draw three bars in that order. The rope's bar reaches past both others.\n\n> **Watch out.** The thing in the middle is never the longest or the shortest.",
        "绳子比木棍长，木棍又比丝带长。所以绳子也比丝带长。木棍把另外两个联系起来了。\n\n检验：按这个顺序画三个长条。绳子的长条比另外两个都长。\n\n> **注意。** 中间的那个东西既不是最长的，也不是最短的。",
      ],
      (rng) => {
        const [long, middle, short] = rng.sample(comparedObjects, 3) as [
          (typeof comparedObjects)[number],
          (typeof comparedObjects)[number],
          (typeof comparedObjects)[number],
        ];
        const asksLongest = rng.bool();
        const correct = asksLongest ? long : short;
        const far = asksLongest ? short : long;
        const option = (object: (typeof comparedObjects)[number]): Pair => [`The ${object.en}`, object.zh];
        return picked(
          rng,
          [
            `The ${long.en} is longer than the ${middle.en}. The ${middle.en} is longer than the ${short.en}. Which is the ${asksLongest ? "longest" : "shortest"}?`,
            `${long.zh}比${middle.zh}长。${middle.zh}比${short.zh}长。哪个${asksLongest ? "最长" : "最短"}？`,
          ],
          option(correct),
          [
            [
              option(far),
              `The ${far.en} is the ${asksLongest ? "shortest" : "longest"} of the three.`,
              `${far.zh}是三个里${asksLongest ? "最短" : "最长"}的。`,
            ],
            [
              option(middle),
              `The ${middle.en} is in the middle: shorter than the ${long.en}, longer than the ${short.en}.`,
              `${middle.zh}在中间：比${long.zh}短，比${short.zh}长。`,
            ],
            [["They are all the same length", "它们一样长"], "The story says one is longer than another.", "题目说了一个比另一个长。"],
          ],
          [
            [
              ["Put them in order", "排好顺序"],
              [
                `The ${long.en} beats the ${middle.en}, and the ${middle.en} beats the ${short.en}.`,
                `${long.zh}比${middle.zh}长，${middle.zh}比${short.zh}长。`,
              ],
            ],
            [
              ["Read the end of the order", "看顺序的一头"],
              [`From longest to shortest: ${long.en}, ${middle.en}, ${short.en}.`, `从长到短：${long.zh}、${middle.zh}、${short.zh}。`],
            ],
          ],
          [
            `Draw a bar for each. The ${correct.en}'s bar is the ${asksLongest ? "longest" : "shortest"} one.`,
            `给每个东西画一个长条，${correct.zh}的长条${asksLongest ? "最长" : "最短"}。`,
          ],
        );
      },
      captioned(
        lengthBarsFigure(["A", "B", "C"], [9, 6, 3]),
        "Bar A is longer than bar B, and bar B is longer than bar C.",
        "长条 A 比长条 B 长，长条 B 比长条 C 长。",
      ),
    ),
  ],
  [
    "Ava and Ben each have a ribbon. They lay the ribbons side by side, with the ends lined up. Ava's ribbon reaches farther. So Ava's ribbon is longer.\n\nCheck: Ben's ribbon stops first, so it is the shorter one.\n\nIn this lesson we put things in order by length, and compare two things by using a third.",
    "艾娃和本各有一根丝带。他们把丝带并排放好，一头对齐。艾娃的丝带伸得更远，所以艾娃的丝带更长。\n\n检验：本的丝带先停下，所以它更短。\n\n本课我们按长度给东西排序，并借助第三个东西比较两个东西。",
  ],
);

/** lengthUnits are everyday objects used as units of length. */
const lengthUnits = [
  { en: "paper clip", many: "paper clips", zh: "个回形针", bare: "回形针" },
  { en: "cube", many: "cubes", zh: "块方块", bare: "方块" },
  { en: "craft stick", many: "craft sticks", zh: "根小棒", bare: "小棒" },
  { en: "eraser", many: "erasers", zh: "块橡皮", bare: "橡皮" },
];

const nonStandardUnits = earlyTopic(
  "measuring-with-non-standard-units",
  ["Measuring With Non-Standard Units", "用非标准单位测量"],
  ["Say how long something is by counting same-size units laid end to end.", "把大小相同的单位首尾相接，数一数，说出物体有多长。"],
  ["comparing-lengths-directly", "counting-to-120"],
  ["1.MD.A.2"],
  [
    earlyPoint(
      "counting-units-along-a-bar",
      ["Counting units along a bar", "沿着长条数单位"],
      [
        "Lay same-size things end to end, with no gaps and no overlaps. Then count them. A bar covered by 7 paper clips is 7 paper clips long.\n\nCheck: count again from the other end. You still get 7.\n\n> **Watch out.** Start right at the end of the bar. A gap at the start makes the count too small.",
        "把大小相同的东西首尾相接地排好，不留空隙，也不重叠，再数一数。要 7 个回形针才能盖满的长条，就是 7 个回形针长。\n\n检验：从另一头再数一遍，还是 7 个。\n\n> **注意。** 要从长条的最头上开始。开头留了空隙，数出来就会太少。",
      ],
      (rng) => {
        const unit = rng.pick(lengthUnits);
        const [a, b] = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
        const asksFirst = rng.bool();
        const label = asksFirst ? "A" : "B";
        const otherLabel = asksFirst ? "B" : "A";
        const answer = asksFirst ? a : b;
        return solved(
          [
            `Each section of these bars is one ${unit.en} long. How long is bar ${label}, in ${unit.many}?`,
            `这些长条的每一格和一${unit.zh}一样长。长条 ${label} 有多长，是几${unit.zh}？`,
          ],
          answer,
          [
            [
              ["Find the bar", "找到长条"],
              [`Bar ${label} is the ${asksFirst ? "top" : "bottom"} bar.`, `长条 ${label} 是${asksFirst ? "上面" : "下面"}那一条。`],
            ],
            [
              ["Count the sections", "数格子"],
              [`It has ${answer} sections, so it is ${answer} ${unit.many} long.`, `它有 ${answer} 格，所以长 ${answer} ${unit.zh}。`],
            ],
          ],
          [`Count again from the other end: still ${answer}.`, `从另一头再数一遍，还是 ${answer} 格。`],
          [
            [asksFirst ? b : a, `That is bar ${otherLabel}.`, `这是长条 ${otherLabel}。`],
            [a + b, "That counts both bars.", "这是把两个长条都数了。"],
          ],
          lengthBarsFigure(["A", "B"], [a, b], true),
        );
      },
      captioned(lengthBarsFigure(["A"], [7], true), "A bar with 7 equal sections.", "一个分成 7 个相等格子的长条。"),
    ),
    earlyPoint(
      "how-many-units-longer",
      ["How many units longer", "长多少个单位"],
      [
        "Bar A is 9 cubes long. Bar B is 6 cubes long. Line them up. 6 cubes match, and A has 3 extra. So A is 3 cubes longer.\n\nCheck: $9 - 6 = 3$.\n\n> **Watch out.** Both bars must use the same unit. You cannot compare a count of clips with a count of sticks.",
        "长条 A 有 9 个方块长，长条 B 有 6 个方块长。把它们对齐，6 个方块对得上，A 多出 3 个。所以 A 长 3 个方块。\n\n检验：$9 - 6 = 3$。\n\n> **注意。** 两个长条要用同样的单位。回形针的个数和小棒的根数不能直接比。",
      ],
      (rng) => {
        const unit = rng.pick(lengthUnits);
        const shorter = rng.int(2, 9);
        const answer = rng.int(1, 12 - shorter);
        const longer = shorter + answer;
        const firstLong = rng.bool();
        const [a, b] = firstLong ? [longer, shorter] : [shorter, longer];
        const longLabel = firstLong ? "A" : "B";
        const shortLabel = firstLong ? "B" : "A";
        return solved(
          [
            `Each section is one ${unit.en} long. How many ${unit.many} longer is bar ${longLabel} than bar ${shortLabel}?`,
            `每一格和一${unit.zh}一样长。长条 ${longLabel} 比长条 ${shortLabel} 长几${unit.zh}？`,
          ],
          answer,
          [
            [
              ["Count each bar", "数每个长条"],
              [
                `Bar ${longLabel} has ${longer} sections. Bar ${shortLabel} has ${shorter}.`,
                `长条 ${longLabel} 有 ${longer} 格，长条 ${shortLabel} 有 ${shorter} 格。`,
              ],
            ],
            [["Find the difference", "求相差多少"], ["", ""], [`${longer} - ${shorter} = ${answer}`]],
          ],
          [
            `Count the extra sections past the end of bar ${shortLabel}: ${answer}.`,
            `数一数长条 ${shortLabel} 末端以后多出的格子：${answer} 格。`,
          ],
          [
            [longer, `That is the length of bar ${longLabel}, not how much longer it is.`, `这是长条 ${longLabel} 的长度，不是长多少。`],
            [shorter, `That is the length of bar ${shortLabel}.`, `这是长条 ${shortLabel} 的长度。`],
            [longer + shorter, "This adds the two lengths. Compare them instead.", "这是把两个长度加起来了，应该比较它们。"],
          ],
          lengthBarsFigure(["A", "B"], [a, b], true),
        );
      },
      captioned(lengthBarsFigure(["A", "B"], [9, 6], true), "Bar A has 9 sections and bar B has 6.", "长条 A 有 9 格，长条 B 有 6 格。"),
    ),
  ],
  [
    "Leo lays paper clips along his pencil, end to end, with no gaps. The pencil is as long as 6 clips. So the pencil is 6 paper clips long.\n\nCheck: count the clips again from the other end. There are still 6.\n\nIn this lesson we measure lengths by counting same-size units.",
    "利奥把回形针一个接一个地排在铅笔旁边，不留空隙。铅笔和 6 个回形针一样长，所以铅笔长 6 个回形针。\n\n检验：从另一头再数一遍回形针，还是 6 个。\n\n本课我们数大小相同的单位来量长度。",
  ],
);

const timeToTheHour = earlyTopic(
  "telling-time-to-the-hour",
  ["Telling Time to the Hour", "认整点"],
  ["Read a clock when the time is exactly on the hour.", "在时间正好是整点时读出钟面上的时间。"],
  ["counting-to-120"],
  ["1.MD.B.3"],
  [
    earlyPoint(
      "reading-a-clock-on-the-hour",
      ["Reading a clock on the hour", "读整点的钟"],
      [
        "A clock has a short hand and a long hand. The short hand tells the hour. When the long hand points straight up at 12, it is exactly on the hour. Here the short hand points to 3, so the time is 3:00.\n\nCheck: the short hand sits right on the 3, not between two numbers.\n\n> **Watch out.** Do not mix up the hands. The short hand tells the hour.",
        "钟面上有一根短针和一根长针。短针表示几时。长针正好指向上面的 12 时，就是整点。这里短针指向 3，所以时间是 3:00。\n\n检验：短针正好指在 3 上，不在两个数之间。\n\n> **注意。** 不要把两根针弄混，短针表示几时。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const option = (h: number): Pair => [`${h}:00`, `${h}:00`];
        const swapped = `${hour === 12 ? 6 : 12}:${hour === 12 ? "00" : `${hour * 5}`.padStart(2, "0")}`;
        const all: Wrong[] = [
          [
            option(clockHour(hour + 1)),
            `The short hand points to the ${hour}, not the ${clockHour(hour + 1)}.`,
            `短针指向 ${hour}，不是 ${clockHour(hour + 1)}。`,
          ],
          [
            option(clockHour(hour - 1)),
            `The short hand points to the ${hour}, not the ${clockHour(hour - 1)}.`,
            `短针指向 ${hour}，不是 ${clockHour(hour - 1)}。`,
          ],
          [
            option(clockHour(hour + 6)),
            `The ${clockHour(hour + 6)} is on the other side of the clock from the short hand.`,
            `${clockHour(hour + 6)} 在钟面上和短针相对的另一边。`,
          ],
          [[`${hour}:12`, `${hour}:12`], "The long hand at the 12 means 00 minutes, not 12.", "长针指向 12 表示 00 分，不是 12 分。"],
          [[swapped, swapped], "This mixes up the hands. The short hand tells the hour.", "这把两根针弄混了，短针表示几时。"],
        ];
        const wrong = rng.sample(
          all.filter((w, i) => all.findIndex((v) => v[0][0] === w[0][0]) === i),
          3,
        );
        return picked(
          rng,
          ["What time does this clock show?", "这个钟表示几时？"],
          option(hour),
          wrong,
          [
            [
              ["Look at the long hand", "看长针"],
              ["It points to the 12, so it is exactly on the hour.", "它指向 12，所以是整点。"],
            ],
            [
              ["Look at the short hand", "看短针"],
              [`It points to the ${hour}, so the time is ${hour}:00.`, `它指向 ${hour}，所以时间是 ${hour}:00。`],
            ],
          ],
          [
            `The short hand sits right on the ${hour}, not between two numbers, as it should on the hour.`,
            `短针正好指在 ${hour} 上，不在两个数之间，整点时就是这样。`,
          ],
          clockFigure(hour, 0),
        );
      },
      captioned(clockFigure(3, 0), "A clock showing 3:00.", "表示 3:00 的钟面。"),
    ),
    earlyPoint(
      "where-the-hands-point-on-the-hour",
      ["Where the hands point on the hour", "整点时指针的位置"],
      [
        "You can picture a clock from the time. At 8 o'clock, the long hand is at 12, as it is on every hour. The short hand points to 8.\n\nCheck: 8 o'clock is written 8:00. The 00 matches the long hand at 12.\n\n> **Watch out.** On the hour, the long hand is at 12, not at the hour.",
        "知道时间，也能想出钟面的样子。8 点时，长针指向 12，每个整点都是这样。短针指向 8。\n\n检验：8 点写作 8:00，00 正好对应长针指着 12。\n\n> **注意。** 整点时长针指向 12，不是指向几点的那个数。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        if (rng.int(0, 2) === 0) {
          return solved(
            [
              `The short hand points to the ${hour} and the long hand points to the 12. What hour is it?`,
              `短针指向 ${hour}，长针指向 12。现在是几点？`,
            ],
            hour,
            [
              [
                ["Look at the long hand", "看长针"],
                ["It is at the 12, so it is exactly on the hour.", "它指向 12，所以是整点。"],
              ],
              [
                ["Look at the short hand", "看短针"],
                [`It points to the ${hour}, so it is ${hour} o'clock.`, `它指向 ${hour}，所以是 ${hour} 点。`],
              ],
            ],
            [
              `Written with digits, it is ${hour}:00, and the :00 matches the long hand at the 12.`,
              `用数字写是 ${hour}:00，:00 正好对应长针指着 12。`,
            ],
            [
              [12, "That is where the long hand points. The short hand tells the hour.", "这是长针指的数，短针才表示几时。"],
              [
                clockHour(hour + 1),
                `That is the next hour. The short hand is right on the ${hour}.`,
                `这是下一个钟点，短针正好指在 ${hour} 上。`,
              ],
              [
                clockHour(hour - 1),
                `That is the hour before. The short hand is right on the ${hour}.`,
                `这是前一个钟点，短针正好指在 ${hour} 上。`,
              ],
            ],
          );
        }
        return rng.bool()
          ? solved(
              [`It is ${hour} o'clock. Which number does the short hand point to?`, `现在是 ${hour} 点。短针指向哪个数？`],
              hour,
              [
                [
                  ["Pick the hand", "找对指针"],
                  ["The short hand tells the hour.", "短针表示几时。"],
                ],
                [
                  ["Point it", "指出位置"],
                  [`At ${hour} o'clock it points to the ${hour}.`, `${hour} 点时它指向 ${hour}。`],
                ],
              ],
              [
                `The long hand is at the 12, so the clock reads ${hour}:00, which matches.`,
                `长针指向 12，钟面读作 ${hour}:00，正好对得上。`,
              ],
              [
                [12, "That is where the long hand points.", "这是长针指的数。"],
                [clockHour(hour + 1), `That is where it points an hour later.`, `这是一小时以后短针指的数。`],
              ],
            )
          : solved(
              [`It is ${hour} o'clock. Which number does the long hand point to?`, `现在是 ${hour} 点。长针指向哪个数？`],
              12,
              [
                [
                  ["Pick the hand", "找对指针"],
                  ["The long hand tells the minutes.", "长针表示几分。"],
                ],
                [
                  ["On the hour", "整点"],
                  ["On the hour no minutes have passed, so it is straight up at the 12.", "整点时还没过一分钟，所以它指向上面的 12。"],
                ],
              ],
              [`${hour}:00 has 00 minutes, and 00 minutes is the long hand at the top.`, `${hour}:00 是 00 分，00 分就是长针指着最上面。`],
              [
                [hour, "That is where the short hand points.", "这是短针指的数。"],
                [6, "With the long hand at the 6, it would be half past.", "长针指向 6 时是半点。"],
              ],
            );
      },
      captioned(clockFigure(8, 0), "A clock showing 8:00.", "表示 8:00 的钟面。"),
    ),
  ],
  [
    "School starts at 8 o'clock. Mia looks at the clock. The long hand points up to 12. The short hand points to 8. It is 8:00, time for school.\n\nCheck: the short hand is right on the 8, not between two numbers.\n\nIn this lesson we read a clock when the time is on the hour.",
    "学校 8 点开始上课。米娅看了看钟：长针指向上面的 12，短针指向 8。现在是 8:00，该上学了。\n\n检验：短针正好指在 8 上，不在两个数之间。\n\n本课我们读整点的钟。",
  ],
);

const timeToTheHalfHour = earlyTopic(
  "telling-time-to-the-half-hour",
  ["Telling Time to the Half Hour", "认半点"],
  ["Read a clock at half past the hour, with the short hand between two numbers.", "读出半点的钟，这时短针在两个数之间。"],
  ["telling-time-to-the-hour"],
  ["1.MD.B.3"],
  [
    earlyPoint(
      "reading-a-clock-at-half-past",
      ["Reading a clock at half past", "读半点的钟"],
      [
        "When the long hand points down at 6, it has gone half way round. Half an hour has passed. The short hand is half way between two numbers. Read the one it has just passed. So this clock shows 4:30.\n\nCheck: 4:30 is half way from 4:00 to 5:00, and the short hand is half way from 4 to 5.\n\n> **Watch out.** Read the number the short hand has passed, not the one it is heading for. It is 4:30, not 5:30.",
        "长针指向下面的 6 时，它走了半圈，也就是过了半小时。短针在两个数的正中间，要读它刚刚走过的那个数。所以这个钟表示 4:30。\n\n检验：4:30 在 4:00 和 5:00 的正中间，短针也在 4 和 5 的正中间。\n\n> **注意。** 读短针刚走过的数，不是它正要去的数。是 4:30，不是 5:30。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const next = clockHour(hour + 1);
        const before = clockHour(hour - 1);
        const same = (s: string): Pair => [s, s];
        const wrong: readonly Wrong[] = rng.sample(
          [
            [
              same(`${next}:30`),
              `The short hand is heading for the ${next} but has not reached it. The hour is ${hour}.`,
              `短针正往 ${next} 走，还没到。几时是 ${hour}。`,
            ],
            [same(`${hour}:00`), "The long hand is at the 6, not the 12, so it is not on the hour.", "长针指向 6，不是 12，所以不是整点。"],
            [same(`${next}:00`), "The long hand is at the 6, so it is half past, not on the hour.", "长针指向 6，是半点，不是整点。"],
            [
              same(`${before}:30`),
              `The short hand has passed the ${hour} too, so the hour is ${hour}.`,
              `短针已经走过 ${hour} 了，所以几时是 ${hour}。`,
            ],
            [same(`${hour}:06`), "The long hand at the 6 means 30 minutes, not 6.", "长针指向 6 表示 30 分，不是 6 分。"],
          ] as Wrong[],
          3,
        );
        return picked(
          rng,
          ["What time does this clock show?", "这个钟表示几时？"],
          same(`${hour}:30`),
          wrong,
          [
            [
              ["Look at the long hand", "看长针"],
              ["It points to the 6, so 30 minutes have passed.", "它指向 6，所以过了 30 分。"],
            ],
            [
              ["Look at the short hand", "看短针"],
              [
                `It is between the ${hour} and the ${next}, and has just passed the ${hour}.`,
                `它在 ${hour} 和 ${next} 之间，刚刚走过 ${hour}。`,
              ],
            ],
          ],
          [
            `${hour}:30 is half way from ${hour}:00 to ${next}:00, and the short hand is half way from the ${hour} to the ${next}.`,
            `${hour}:30 在 ${hour}:00 和 ${next}:00 的正中间，短针也在 ${hour} 和 ${next} 的正中间。`,
          ],
          clockFigure(hour, 30),
        );
      },
      captioned(clockFigure(4, 30), "A clock showing 4:30.", "表示 4:30 的钟面。"),
    ),
    earlyPoint(
      "half-past-in-words",
      ["Half past in words", "用文字说半点"],
      [
        "Half past 7 and 7:30 are the same time. It is half an hour after 7:00. So the long hand is at 6, and the short hand is half way between 7 and 8.\n\nCheck: 30 minutes is half an hour, and the 6 is half way round the clock.\n\n> **Watch out.** Half past 7 comes after 7. The short hand is between 7 and 8, not between 6 and 7.",
        "7 点半和 7:30 是同一个时间，比 7:00 晚半小时。所以长针指向 6，短针在 7 和 8 的正中间。\n\n检验：30 分是半小时，6 正好在钟面的半圈处。\n\n> **注意。** 7 点半在 7 点以后，短针在 7 和 8 之间，不在 6 和 7 之间。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const next = clockHour(hour + 1);
        const before = clockHour(hour - 1);
        const same = (s: string): Pair => [s, s];
        if (rng.int(0, 2) === 0) {
          return solved(
            [`It is half past ${hour}. Which number does the long hand point to?`, `现在是 ${hour} 点半。长针指向哪个数？`],
            6,
            [
              [
                ["Count the minutes", "想想几分"],
                ["Half past is 30 minutes after the hour.", "半点就是整点过 30 分。"],
              ],
              [
                ["Place the long hand", "放好长针"],
                ["30 minutes is half way round, so the long hand points down at the 6.", "30 分是半圈，所以长针指向下面的 6。"],
              ],
            ],
            ["The 6 sits straight across from the 12, half way round the clock.", "6 正好在 12 的对面，是钟面的半圈处。"],
            [
              [12, "With the long hand at the 12, it would be on the hour.", "长针指向 12 是整点。"],
              [hour, "That is near the short hand. The long hand tells the minutes.", "这是短针附近的数，长针表示几分。"],
              [
                30,
                "30 is the minutes, but the long hand points to a number on the clock face: the 6.",
                "30 是分钟数，长针指的是钟面上的数：6。",
              ],
            ],
          );
        }
        return rng.bool()
          ? picked(
              rng,
              [`How do you write half past ${hour}?`, `${hour} 点半怎么写？`],
              same(`${hour}:30`),
              [
                [same(`${before}:30`), `That is half past ${before}, an hour earlier.`, `这是 ${before} 点半，早了一小时。`],
                [same(`${hour}:00`), `That is ${hour} o'clock. Half past is 30 minutes later.`, `这是 ${hour} 点整，半点要再过 30 分。`],
                [same(`${next}:30`), `That is half past ${next}, an hour later.`, `这是 ${next} 点半，晚了一小时。`],
              ],
              [
                [
                  ["Write the hour", "写出几时"],
                  [`The hour is ${hour}.`, `几时是 ${hour}。`],
                ],
                [
                  ["Write the minutes", "写出几分"],
                  ["Half past is 30 minutes, so write :30.", "半点是 30 分，所以写 :30。"],
                ],
              ],
              [`${hour}:30 is half way between ${hour}:00 and ${next}:00.`, `${hour}:30 在 ${hour}:00 和 ${next}:00 的正中间。`],
            )
          : picked(
              rng,
              [`It is half past ${hour}. Where is the short hand?`, `现在是 ${hour} 点半。短针在哪里？`],
              [`Between the ${hour} and the ${next}`, `在 ${hour} 和 ${next} 之间`],
              [
                [
                  [`Between the ${before} and the ${hour}`, `在 ${before} 和 ${hour} 之间`],
                  `That is where it is at half past ${before}.`,
                  `这是 ${before} 点半时短针的位置。`,
                ],
                [
                  [`Between the ${next} and the ${clockHour(hour + 2)}`, `在 ${next} 和 ${clockHour(hour + 2)} 之间`],
                  `That is where it is at half past ${next}.`,
                  `这是 ${next} 点半时短针的位置。`,
                ],
                [
                  [
                    `Between the ${clockHour(hour + 6)} and the ${clockHour(hour + 7)}`,
                    `在 ${clockHour(hour + 6)} 和 ${clockHour(hour + 7)} 之间`,
                  ],
                  `That is on the other side of the clock, at half past ${clockHour(hour + 6)}.`,
                  `这在钟面的另一边，是 ${clockHour(hour + 6)} 点半。`,
                ],
              ],
              [
                [
                  ["Start at the hour", "从整点开始"],
                  [`At ${hour}:00 the short hand is on the ${hour}.`, `${hour}:00 时短针指在 ${hour} 上。`],
                ],
                [
                  ["Move half way", "走一半"],
                  [`In half an hour it moves half way to the ${next}.`, `过了半小时，它走到去 ${next} 的半路上。`],
                ],
              ],
              [
                `At ${next}:00 it will reach the ${next}, so at ${hour}:30 it is between them.`,
                `到 ${next}:00 时它会走到 ${next}，所以 ${hour}:30 时它在两者之间。`,
              ],
            );
      },
      captioned(clockFigure(7, 30), "A clock showing 7:30.", "表示 7:30 的钟面。"),
    ),
  ],
  [
    "Lunch is at half past 12. At 12:30 the long hand points down to 6. The short hand is half way between 12 and 1.\n\nCheck: 12:30 is half way from 12:00 to 1:00.\n\nIn this lesson we read a clock at half past the hour.",
    "午饭在 12 点半。12:30 时，长针指向下面的 6，短针在 12 和 1 的正中间。\n\n检验：12:30 在 12:00 和 1:00 的正中间。\n\n本课我们读半点的钟。",
  ],
);

/** graphStories are the collections that the tallies and graphs of this course count. */
const graphStories = [
  {
    en: "A, B, C and D are classes that collected cans",
    zh: "A、B、C、D 是收集罐子的班级",
    one: "can",
    many: "cans",
    zhOne: "个罐子",
    zhMark: "罐子",
  },
  {
    en: "A, B, C and D are friends who picked apples",
    zh: "A、B、C、D 是摘苹果的朋友",
    one: "apple",
    many: "apples",
    zhOne: "个苹果",
    zhMark: "苹果",
  },
  {
    en: "A, B, C and D are pets that children voted for",
    zh: "A、B、C、D 是孩子们投票选的宠物",
    one: "vote",
    many: "votes",
    zhOne: "票",
    zhMark: "票数",
  },
  {
    en: "A, B, C and D are teams that scored goals",
    zh: "A、B、C、D 是进球的球队",
    one: "goal",
    many: "goals",
    zhOne: "个球",
    zhMark: "进球",
  },
];

/** GraphMark says how a tally or graph shows its items, what part of it holds one category's count, and how to count that part again. */
type GraphMark = {
  readonly en: (one: string, many: string) => string;
  readonly zh: (zhOne: string) => string;
  readonly place: readonly [string, string];
  readonly recount: readonly [string, string];
};

/** graphLabels are the four categories that a graph in this course shows. */
const graphLabels = ["A", "B", "C", "D"];

/** graphValues draws four different counts for a graph. */
const graphValues = (rng: Rng, lo: number, hi: number): number[] => {
  const pool: number[] = [];
  for (let v = lo; v <= hi; v++) pool.push(v);
  return rng.sample(pool, 4);
};

/** readingFromGraph asks how many one category has, or which category has the most or the fewest. */
function readingFromGraph(rng: Rng, mark: GraphMark, values: readonly number[], figure: Figure): Problem {
  const story = rng.pick(graphStories);
  const lead = [`${story.en}. ${mark.en(story.one, story.many)}.`, `${story.zh}。${mark.zh(story.zhOne)}。`] as const;
  const [place, placeZh] = mark.place;
  if (rng.bool()) {
    const i = rng.int(0, 3);
    const answer = values[i] as number;
    const label = graphLabels[i] as string;
    return solved(
      [`${lead[0]} How many ${story.many} does ${label} have?`, `${lead[1]}${label} 有多少${story.zhOne}？`],
      answer,
      [
        [
          [`Find the ${place}`, `找到那一${placeZh}`],
          [`Find the ${place} for ${label}.`, `找到 ${label} 的那一${placeZh}。`],
        ],
        [
          ["Read it", "读出来"],
          [`It shows ${plural(answer, story.one)}.`, `它表示 ${answer} ${story.zhOne}。`],
        ],
      ],
      [`${mark.recount[0]} You get ${answer} again.`, `${mark.recount[1]}还是 ${answer}。`],
      values
        .map((v, j): Slip => [v, `That is the ${place} for ${graphLabels[j]}.`, `这是 ${graphLabels[j]} 的那一${placeZh}。`])
        .filter((_, j) => j !== i),
      figure,
    );
  }
  const asksMost = rng.bool();
  const target = asksMost ? Math.max(...values) : Math.min(...values);
  const correct = graphLabels[values.indexOf(target)] as string;
  const group = (label: string): Pair => [`Group ${label}`, `${label} 组`];
  const others = graphLabels.filter((label) => label !== correct);
  return picked(
    rng,
    [
      `${lead[0]} Which has the ${asksMost ? "most" : "fewest"} ${story.many}?`,
      `${lead[1]}哪一组的${story.zhMark}${asksMost ? "最多" : "最少"}？`,
    ],
    group(correct),
    others.map((label): Wrong => {
      const v = values[graphLabels.indexOf(label)] as number;
      return [
        group(label),
        `${label} has ${v}, ${asksMost ? "fewer" : "more"} than ${correct}'s ${target}.`,
        `${label} 有 ${v}，比 ${correct} 的 ${target} ${asksMost ? "少" : "多"}。`,
      ];
    }),
    [
      [
        [`Read each ${place}`, `读出每一${placeZh}`],
        [
          `${graphLabels.map((label, j) => `${label}: ${values[j]}`).join(", ")}.`,
          `${graphLabels.map((label, j) => `${label}：${values[j]}`).join("，")}。`,
        ],
      ],
      [
        [`Find the ${asksMost ? "biggest" : "smallest"} number`, `找出${asksMost ? "最大" : "最小"}的数`],
        [
          `${target} is the ${asksMost ? "biggest" : "smallest"}, so it is ${correct}.`,
          `${target} ${asksMost ? "最大" : "最小"}，所以是 ${correct}。`,
        ],
      ],
    ],
    [
      `Compare ${correct} with each other group: ${target} is ${asksMost ? "more" : "less"} than ${others.map((label) => values[graphLabels.indexOf(label)]).join(", ")}.`,
      `把 ${correct} 和其他组比一比：${target} 比 ${others.map((label) => values[graphLabels.indexOf(label)]).join("、")} 都${asksMost ? "大" : "小"}。`,
    ],
    figure,
  );
}

/** comparingOnGraph asks how many more one category has than another, or how many two categories have together. */
function comparingOnGraph(rng: Rng, mark: GraphMark, values: readonly number[], figure: Figure): Problem {
  const story = rng.pick(graphStories);
  const lead = [`${story.en}. ${mark.en(story.one, story.many)}.`, `${story.zh}。${mark.zh(story.zhOne)}。`] as const;
  const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
  const a = values[i] as number;
  const b = values[j] as number;
  const la = graphLabels[i] as string;
  const lb = graphLabels[j] as string;
  const read: Walk = [
    ["Read the two groups", "读出两组"],
    [`${la} has ${a}. ${lb} has ${b}.`, `${la} 有 ${a}，${lb} 有 ${b}。`],
  ];
  if (rng.bool()) {
    return solved(
      [`${lead[0]} How many ${story.many} do ${la} and ${lb} have together?`, `${lead[1]}${la} 和 ${lb} 一共有多少${story.zhOne}？`],
      a + b,
      [read, [["Add", "相加"], ["", ""], [`${a} + ${b} = ${a + b}`]]],
      [`Count on ${b} from ${a}: you reach ${a + b}.`, `从 ${a} 往后数 ${b} 个，数到 ${a + b}。`],
      [
        [a, `That is only ${la}.`, `这只是 ${la}。`],
        [b, `That is only ${lb}.`, `这只是 ${lb}。`],
        [Math.abs(a - b), "This subtracts. Together means add.", "这是做了减法。“一共”要相加。"],
      ],
      figure,
    );
  }
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const bigLabel = a > b ? la : lb;
  const smallLabel = a > b ? lb : la;
  return solved(
    [
      `${lead[0]} How many more ${story.many} does ${bigLabel} have than ${smallLabel}?`,
      `${lead[1]}${bigLabel} 比 ${smallLabel} 多多少${story.zhOne}？`,
    ],
    big - small,
    [read, [["Find the difference", "求相差多少"], ["", ""], [`${big} - ${small} = ${big - small}`]]],
    [
      `Count up from ${small} to ${big}: that is ${big - small} ${big - small === 1 ? "count" : "counts"}.`,
      `从 ${small} 往上数到 ${big}，数了 ${big - small} 次。`,
    ],
    [
      [big, `That is how many ${bigLabel} has, not how many more.`, `这是 ${bigLabel} 有的个数，不是多出来的个数。`],
      [small, `That is how many ${smallLabel} has.`, `这是 ${smallLabel} 有的个数。`],
      [big + small, "This adds. How many more means find the difference.", "这是做了加法。“多多少”要求相差多少。"],
    ],
    figure,
  );
}

/** tallyMark says how a tally chart shows one item. */
const tallyMark: GraphMark = {
  en: (one) => `Each tally mark stands for one ${one}`,
  zh: (zhOne) => `每一笔代表一${zhOne}`,
  place: ["row", "行"],
  recount: ["Count the bundles by fives, then the single marks by ones.", "先按五数一捆一捆的，再一个一个地数单独的笔画，"],
};

/** dotMark says how a picture graph shows one item. */
const dotMark: GraphMark = {
  en: (one) => `Each dot stands for one ${one}`,
  zh: (zhOne) => `每个点代表一${zhOne}`,
  place: ["row", "行"],
  recount: ["Count the row again, touching each dot once.", "再数一遍这一行，每个点只碰一次，"],
};

/** barMark says how a bar graph shows its items. */
const barMark: GraphMark = {
  en: (_one, many) => `The height of each bar shows how many ${many}`,
  zh: (zhOne) => `条的高度表示有多少${zhOne}`,
  place: ["bar", "条"],
  recount: ["Count the steps from the bottom of the bar up to its top.", "从条的底部往上数到顶端有几格，"],
};

const tallyCharts = earlyTopic(
  "tally-charts",
  ["Tally Charts", "计数表"],
  ["Read a chart of tally marks, grouped in fives, and answer questions about it.", "读懂每五笔一组的计数表，并回答相关问题。"],
  ["counting-to-120"],
  ["1.MD.C.4"],
  [
    earlyPoint(
      "reading-tally-marks",
      ["Reading tally marks", "读计数符号"],
      [
        "A tally mark is one line for each thing you count. Every fifth line crosses the four before it. That makes a bundle of 5. Two bundles and 3 more lines: 5, 10, then 11, 12, 13.\n\nCheck: count every line one by one. There are 13.\n\n> **Watch out.** The line that crosses counts too. A bundle is 5, not 4.",
        "计数时每数一个东西就画一笔。第五笔横穿前面四笔，成为一捆，就是 5。两捆再加 3 笔：5、10，再数 11、12、13。\n\n检验：一笔一笔地数，一共 13 笔。\n\n> **注意。** 横穿的那一笔也要算。一捆是 5，不是 4。",
      ],
      (rng) => {
        const values = graphValues(rng, 2, 14);
        return readingFromGraph(rng, tallyMark, values, tallyFigure(graphLabels, values));
      },
      captioned(
        tallyFigure(["A"], [13]),
        "A tally of 13: two bundles of 5 and 3 more marks.",
        "表示 13 的计数符号：两捆各 5 笔，再加 3 笔。",
      ),
    ),
    earlyPoint(
      "comparing-with-tally-marks",
      ["Comparing with tally marks", "用计数符号比较"],
      [
        'Read each row first. A has 7 marks and B has 4. Together they have $7 + 4 = 11$. A has $7 - 4 = 3$ more than B.\n\nCheck: count on 4 from 7: 8, 9, 10, 11.\n\n> **Watch out.** Read the question. "Together" means add. "How many more" means find the difference.',
        "先读出每一行。A 有 7 笔，B 有 4 笔。它们一共有 $7 + 4 = 11$ 笔。A 比 B 多 $7 - 4 = 3$ 笔。\n\n检验：从 7 往后数 4 个：8、9、10、11。\n\n> **注意。** 看清楚问题。“一共”要相加，“多多少”要求相差多少。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 10);
        return comparingOnGraph(rng, tallyMark, values, tallyFigure(graphLabels, values));
      },
      captioned(tallyFigure(["A", "B"], [7, 4]), "A tally chart: row A has 7 marks and row B has 4.", "计数表：A 行有 7 笔，B 行有 4 笔。"),
    ),
  ],
  [
    "Our class votes for a pet. Each time a child picks a dog, Sam draws a line. The fifth line crosses the other four. At the end there are 2 bundles and 1 more line. That is 11 votes for dogs.\n\nCheck: count by fives, then by ones: 5, 10, 11.\n\nIn this lesson we read tally charts and answer questions about them.",
    "我们班投票选宠物。每有一个同学选小狗，萨姆就画一笔，第五笔横穿前面四笔。最后有 2 捆，再加 1 笔，小狗得了 11 票。\n\n检验：先五个五个地数，再一个一个地数：5、10、11。\n\n本课我们读计数表，并回答有关的问题。",
  ],
);

const firstPictureGraphs = earlyTopic(
  "first-picture-graphs",
  ["First Picture Graphs", "初识象形统计图"],
  ["Read a picture graph where each dot stands for one thing.", "读每个点代表一个东西的象形统计图。"],
  ["tally-charts"],
  ["1.MD.C.4"],
  [
    earlyPoint(
      "reading-a-first-picture-graph",
      ["Reading a picture graph", "读象形统计图"],
      [
        "In a picture graph, each dot is one thing. Each row is one group. Count the dots in a row to find how many are in that group. The longest row has the most.\n\nCheck: count the row again, touching each dot once.\n\n> **Watch out.** Count the dots in one row only. Do not run on into the next row.",
        "象形统计图里，每个点是一个东西，每一行是一组。数一行里的点，就知道这组有多少。最长的那一行最多。\n\n检验：再数一遍这一行，每个点只碰一次。\n\n> **注意。** 只数一行里的点，不要接着数到下一行去。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 9);
        return readingFromGraph(rng, dotMark, values, pictureGraphFigure(graphLabels, values, 1));
      },
      gradeDrawings2["first-picture-graphs#reading-a-first-picture-graph"],
    ),
    earlyPoint(
      "comparing-on-a-picture-graph",
      ["Comparing on a picture graph", "在象形统计图上比较"],
      [
        "Line up two rows dot by dot. The dots with no partner show how many more one row has. To find how many in all, add the two counts.\n\nCheck: count up from the shorter row's number to the longer row's number.\n\n> **Watch out.** \"How many more\" is only the dots with no partner, not the whole row.",
        "把两行的点一个对一个地排好，没有伙伴的点说明一行比另一行多多少。要知道一共有多少，就把两个数相加。\n\n检验：从短的那一行的数往上数到长的那一行的数。\n\n> **注意。** “多多少”只是没有伙伴的点，不是整行。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 9);
        return comparingOnGraph(rng, dotMark, values, pictureGraphFigure(graphLabels, values, 1));
      },
      gradeDrawings2["first-picture-graphs#comparing-on-a-picture-graph"],
    ),
  ],
  [
    "Kim's class counts pets at home. Each dot on the graph is one pet. The cat row has 6 dots, and the dog row has 4. More children have cats.\n\nCheck: line up the rows. 2 cat dots have no partner, so cats have 2 more.\n\nIn this lesson we read picture graphs, where each dot is one thing.",
    "金的班级数一数家里的宠物。图上每个点是一只宠物。猫那一行有 6 个点，狗那一行有 4 个点。养猫的多。\n\n检验：把两行对齐，猫那一行有 2 个点没有伙伴，所以猫多 2 只。\n\n本课我们读每个点代表一个东西的象形统计图。",
  ],
);

const firstBarGraphs = earlyTopic(
  "first-bar-graphs",
  ["First Bar Graphs", "初识条形统计图"],
  ["Read a bar graph with a scale that goes up by ones.", "读刻度每格为一的条形统计图。"],
  ["first-picture-graphs"],
  ["1.MD.C.4"],
  [
    earlyPoint(
      "reading-a-first-bar-graph",
      ["Reading a bar graph", "读条形统计图"],
      [
        "A bar graph uses the height of a bar. Look at the top of the bar. Follow it across to the numbers at the side. That number tells how many.\n\nCheck: count the steps from the bottom of the bar to its top.\n\n> **Watch out.** Read the number level with the top of the bar, not the number just above it.",
        "条形统计图用条的高度表示多少。看条的顶端，横着看到旁边的数，这个数就是有多少。\n\n检验：从条的底部往上数到顶端有几格。\n\n> **注意。** 读和条的顶端一样高的那个数，不要读它上面的数。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 10);
        return readingFromGraph(rng, barMark, values, barGraphFigure(graphLabels, values, 1));
      },
      gradeDrawings2["first-bar-graphs#reading-a-first-bar-graph"],
    ),
    earlyPoint(
      "comparing-on-a-bar-graph",
      ["Comparing on a bar graph", "在条形统计图上比较"],
      [
        "Read each bar first. If bar A shows 7 and bar B shows 4, A has $7 - 4 = 3$ more. Together they have $7 + 4 = 11$.\n\nCheck: the gap between the two tops is 3 steps.\n\n> **Watch out.** To find how many more, subtract. Do not add.",
        "先读出每个条。如果 A 条是 7，B 条是 4，A 比 B 多 $7 - 4 = 3$。它们一共有 $7 + 4 = 11$。\n\n检验：两个顶端相差 3 格。\n\n> **注意。** 求多多少要用减法，不要相加。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 10);
        return comparingOnGraph(rng, barMark, values, barGraphFigure(graphLabels, values, 1));
      },
      gradeDrawings2["first-bar-graphs#comparing-on-a-bar-graph"],
    ),
  ],
  [
    "The class counts rainy days. The bar for May reaches the line for 7. So there were 7 rainy days in May.\n\nCheck: count the steps up the bar: 1, 2, 3, 4, 5, 6, 7.\n\nIn this lesson we read bar graphs and compare their bars.",
    "全班数一数下雨的天数。五月那一条的顶端和 7 一样高，所以五月有 7 个雨天。\n\n检验：沿着条往上数格子：1、2、3、4、5、6、7。\n\n本课我们读条形统计图，并比较条的高低。",
  ],
);

/** shapeOutlines are drawings of closed shapes, by their number of sides. */
const shapeOutlines: readonly { readonly sides: number; readonly points: readonly (readonly [number, number])[] }[] = [
  {
    sides: 3,
    points: [
      [1, 1],
      [9, 1],
      [5, 9],
    ],
  },
  {
    sides: 3,
    points: [
      [1, 1],
      [9, 1],
      [1, 9],
    ],
  },
  {
    sides: 3,
    points: [
      [2, 9],
      [9, 6],
      [1, 1],
    ],
  },
  {
    sides: 4,
    points: [
      [2, 1],
      [8, 1],
      [8, 9],
      [2, 9],
    ],
  },
  {
    sides: 4,
    points: [
      [0, 3],
      [10, 3],
      [10, 7],
      [0, 7],
    ],
  },
  {
    sides: 4,
    points: [
      [0, 1],
      [10, 1],
      [7, 9],
      [3, 9],
    ],
  },
  {
    sides: 5,
    points: [
      [2, 1],
      [8, 1],
      [10, 6],
      [5, 10],
      [0, 6],
    ],
  },
  {
    sides: 5,
    points: [
      [1, 1],
      [9, 1],
      [9, 6],
      [5, 10],
      [1, 6],
    ],
  },
  {
    sides: 6,
    points: [
      [3, 1],
      [7, 1],
      [10, 5],
      [7, 9],
      [3, 9],
      [0, 5],
    ],
  },
  {
    sides: 6,
    points: [
      [1, 1],
      [9, 1],
      [9, 5],
      [5, 5],
      [5, 9],
      [1, 9],
    ],
  },
];

/** shapeFacts name the shapes of this course with what makes each one that shape. */
const shapeFacts = [
  { en: "triangle", zh: "三角形", rule: ["It has 3 straight sides and 3 corners.", "它有 3 条直边和 3 个角。"] },
  { en: "square", zh: "正方形", rule: ["It has 4 sides of the same length and 4 square corners.", "它有 4 条一样长的边和 4 个直角。"] },
  { en: "circle", zh: "圆", rule: ["It is round, with no straight sides and no corners.", "它是圆的，没有直边，也没有角。"] },
  { en: "pentagon", zh: "五边形", rule: ["It has 5 straight sides and 5 corners.", "它有 5 条直边和 5 个角。"] },
  { en: "hexagon", zh: "六边形", rule: ["It has 6 straight sides and 6 corners.", "它有 6 条直边和 6 个角。"] },
] as const;

const definingAttributes = earlyTopic(
  "defining-attributes-of-shapes",
  ["Attributes of Shapes", "图形的特征"],
  [
    "Tell what makes a shape what it is, such as its sides and corners, and what does not matter, such as its color or size.",
    "说出决定一个图形的特征，比如边和角，以及无关紧要的东西，比如颜色和大小。",
  ],
  [],
  ["1.G.A.1"],
  [
    earlyPoint(
      "counting-sides-and-corners",
      ["Counting sides and corners", "数边和角"],
      [
        "A side is a straight edge. A corner is where two sides meet. Start at one corner. Go around the shape until you are back. This shape has 5 sides and 5 corners.\n\nCheck: a shape with straight sides has as many corners as sides.\n\n> **Watch out.** Mark where you start. Then you will not count a side twice.",
        "边是一条直的边缘，角是两条边相遇的地方。从一个角开始，绕着图形走，直到回到开始的地方。这个图形有 5 条边和 5 个角。\n\n检验：由直边围成的图形，角的个数和边的条数一样多。\n\n> **注意。** 记住从哪里开始，这样就不会把一条边数两次。",
      ],
      (rng) => {
        const outline = rng.pick(shapeOutlines);
        const nudged = outline.points.map(
          ([x, y]) => [Math.min(10, x + rng.int(0, 1) * 0.5), Math.min(10, y + rng.int(0, 1) * 0.5)] as const,
        );
        const figure = polygonFigure(nudged, t("A closed shape with straight sides.", "一个由直边围成的封闭图形。"));
        const n = outline.sides;
        const counted = Array.from({ length: n }, (_, i) => i + 1);
        const sides = rng.bool();
        const [what, other, whatZh, otherZh] = sides ? ["sides", "corners", "条边", "个角"] : ["corners", "sides", "个角", "条边"];
        return solved(
          [`How many ${what} does this shape have?`, `这个图形有几${whatZh}？`],
          n,
          [
            [
              ["Start at a corner", "从一个角开始"],
              ["Put a finger on one corner and remember it.", "用手指按住一个角，记住它。"],
            ],
            [
              ["Go around once", "绕一圈"],
              [
                `Count each one you pass: ${counted.join(", ")}. Then you are back at the start.`,
                `每经过一${whatZh}就数一下：${counted.join("、")}，回到了开始的地方。`,
              ],
            ],
          ],
          [
            `Count the ${other} too. There are also ${n}, as many as the ${what}.`,
            `再数一数${otherZh.slice(1)}，也是 ${n} ${otherZh}，和${whatZh.slice(1)}一样多。`,
          ],
          [
            [
              n - 1,
              `This misses the last ${what === "sides" ? "side" : "corner"}, just before the start.`,
              `这漏掉了回到起点前的最后一${whatZh}。`,
            ],
            [
              n + 1,
              `This counts the first ${what === "sides" ? "side" : "corner"} again at the end.`,
              `这在最后又把第一${whatZh}数了一次。`,
            ],
            [2 * n, "This counts the sides and the corners together.", "这是把边和角合在一起数了。"],
          ],
          figure,
        );
      },
      captioned(
        polygonFigure(shapeOutlines[6]?.points ?? [], t("A closed shape with straight sides.", "一个由直边围成的封闭图形。")),
        "A shape with 5 straight sides and 5 corners.",
        "一个有 5 条直边和 5 个角的图形。",
      ),
    ),
    earlyPoint(
      "what-makes-a-shape-that-shape",
      ["What makes a shape that shape", "什么决定一个图形"],
      [
        "A shape gets its name from its sides and corners. A triangle has 3 straight sides. It is still a triangle if it is big or small, red or blue, or turned any way.\n\nCheck: a tiny green triangle and a huge red one both have 3 sides and 3 corners.\n\n> **Watch out.** Color and size never change a shape's name.",
        "图形的名字由它的边和角决定。三角形有 3 条直边。不管它是大是小、是红是蓝，怎么摆放，都还是三角形。\n\n检验：一个小小的绿三角形和一个大大的红三角形，都有 3 条边和 3 个角。\n\n> **注意。** 颜色和大小不会改变图形的名字。",
      ],
      (rng) => {
        const fact = rng.pick(shapeFacts);
        const others = shapeFacts.filter((other) => other !== fact);
        if (rng.bool()) {
          const other = rng.pick(others);
          const extras = rng.sample<Wrong>(
            [
              [
                ["It is red.", "它是红色的。"],
                "Color does not decide a shape. A blue one is the same shape.",
                "颜色不决定图形，蓝色的也是同样的图形。",
              ],
              [
                ["It is small enough to hold in your hand.", "它小得可以拿在手里。"],
                "Size does not decide a shape. A huge one is the same shape.",
                "大小不决定图形，很大的也是同样的图形。",
              ],
              [
                ["It has a dot in the middle.", "它中间有一个点。"],
                "A dot inside does not change the sides or corners.",
                "中间的点不会改变边和角。",
              ],
              [
                ["It is blue.", "它是蓝色的。"],
                "Color does not decide a shape. A red one is the same shape.",
                "颜色不决定图形，红色的也是同样的图形。",
              ],
              [
                ["It is bigger than a book.", "它比一本书大。"],
                "Size does not decide a shape. A tiny one is the same shape.",
                "大小不决定图形，很小的也是同样的图形。",
              ],
            ],
            2,
          );
          return picked(
            rng,
            [`Which of these is true of every ${fact.en}?`, `下面哪一句对所有的${fact.zh}都成立？`],
            [fact.rule[0], fact.rule[1]],
            [
              [
                [other.rule[0], other.rule[1]],
                `That is true of a ${other.en}, not a ${fact.en}.`,
                `这是${other.zh}的特征，不是${fact.zh}的。`,
              ],
              ...extras,
            ],
            [
              [
                ["Set aside color and size", "不看颜色和大小"],
                ["Color and size can change without changing the shape.", "颜色和大小变了，图形还是那个图形。"],
              ],
              [
                ["Look at sides and corners", "看边和角"],
                [fact.rule[0], fact.rule[1]],
              ],
            ],
            [
              `Picture a big blue ${fact.en} and a small red one. Both match: ${fact.rule[0]}`,
              `想一个大的蓝${fact.zh}和一个小的红${fact.zh}，两个都符合：${fact.rule[1]}`,
            ],
          );
        }
        const chosen = rng.sample(others, 3);
        const article = (name: string) => (name === "hexagon" ? "A hexagon" : `A ${name}`);
        return picked(
          rng,
          [`Which shape is this? ${fact.rule[0]}`, `这是什么图形？${fact.rule[1]}`],
          [article(fact.en), fact.zh],
          chosen.map(
            (other): Wrong => [
              [article(other.en), other.zh],
              `${article(other.en)} is different. ${other.rule[0]}`,
              `${other.zh}不一样。${other.rule[1]}`,
            ],
          ),
          [
            [
              ["Read the clue", "读线索"],
              [fact.rule[0], fact.rule[1]],
            ],
            [
              ["Match the shape", "找出图形"],
              [`Only a ${fact.en} fits that clue.`, `只有${fact.zh}符合这条线索。`],
            ],
          ],
          [
            `Try the others: ${chosen.map((other) => other.en).join(", ")}. None of them fits.`,
            `试一试其他的：${chosen.map((other) => other.zh).join("、")}，都不符合。`,
          ],
        );
      },
      gradeDrawings2["defining-attributes-of-shapes#what-makes-a-shape-that-shape"],
    ),
  ],
  [
    "Max has a big red triangle and a small blue one. They look different. But each has 3 straight sides and 3 corners. So both are triangles.\n\nCheck: count the corners on each: 3 and 3.\n\nIn this lesson we see that sides and corners make a shape, and color and size do not.",
    "马克斯有一个大的红三角形和一个小的蓝三角形。它们看起来不一样，但都有 3 条直边和 3 个角，所以都是三角形。\n\n检验：数一数每个的角：3 个和 3 个。\n\n本课我们知道边和角决定图形，颜色和大小不决定。",
  ],
);

/** piecesAlt describes a drawing of loose pieces without saying what they build. */
const piecesAlt = t("Pieces of a shape, drawn apart from each other.", "一个图形的几块，彼此分开画着。");

/** piecePolygon draws one filled piece from its points. */
const piecePolygon = (points: string): string =>
  `<polygon points="${points}" class="accent" fill="currentColor" fill-opacity="0.2"/><polygon points="${points}"/>`;

/** piecePath draws one filled piece from a path. */
const piecePath = (d: string): string => `<path d="${d}" class="accent" fill="currentColor" fill-opacity="0.2"/><path d="${d}"/>`;

/** compositions list loose pieces with the shape they build and shapes they cannot build. */
const compositions = [
  {
    body: piecePolygon("70,20 130,20 130,80 70,80") + piecePolygon("190,20 250,20 250,80 190,80"),
    pieces: ["two same-size squares", "两个一样大的正方形拼在一起"],
    answer: ["A rectangle", "长方形"],
    wrong: [
      ["A triangle", "三角形"],
      ["A circle", "圆"],
      ["An oval", "椭圆"],
      ["A hexagon", "六边形"],
    ],
    why: [
      "The two squares share one side, and the outline has 4 sides and 4 square corners, with two sides longer than the others.",
      "两个正方形共用一条边，外框有 4 条边和 4 个直角，其中两条边比另外两条长。",
    ],
  },
  {
    body: piecePolygon("60,20 60,80 120,80") + piecePolygon("200,20 260,20 260,80"),
    pieces: ["two same-size triangles, joined along their longest sides", "两个一样大的三角形沿最长的边拼在一起"],
    answer: ["A square", "正方形"],
    wrong: [
      ["A circle", "圆"],
      ["An oval", "椭圆"],
      ["A pentagon", "五边形"],
      ["A hexagon", "六边形"],
    ],
    why: [
      "The longest sides vanish inside, which leaves 4 sides of the same length and 4 square corners.",
      "最长的边拼到了里面，外框剩下 4 条一样长的边和 4 个直角。",
    ],
  },
  {
    body: piecePath("M 110 20 A 40 40 0 0 0 110 100 Z") + piecePath("M 190 20 A 40 40 0 0 1 190 100 Z"),
    pieces: ["two half circles, joined along their straight sides", "两个半圆沿直边拼在一起"],
    answer: ["A circle", "圆"],
    wrong: [
      ["A square", "正方形"],
      ["A triangle", "三角形"],
      ["A rectangle", "长方形"],
      ["A pentagon", "五边形"],
      ["A hexagon", "六边形"],
    ],
    why: [
      "Each half brings a round edge, and the straight sides vanish inside, which leaves a round shape.",
      "每一半都有一条弯的边，直边拼到了里面，外框就是圆的。",
    ],
  },
  {
    body: piecePolygon("30,70 60,20 110,20 140,70") + piecePolygon("180,20 290,20 260,70 210,70"),
    pieces: ["two same-size pieces, joined along their longest sides", "两个一样大的小块沿最长的边拼在一起"],
    answer: ["A hexagon", "六边形"],
    wrong: [
      ["A triangle", "三角形"],
      ["A circle", "圆"],
      ["An oval", "椭圆"],
      ["A square", "正方形"],
    ],
    why: [
      "Each piece adds 3 sides to the outline, since its longest side vanishes inside, so the outline has 6 sides.",
      "每一块的最长边拼到了里面，各给外框留下 3 条边，所以外框有 6 条边。",
    ],
  },
  {
    body: piecePolygon("60,50 120,50 120,110 60,110") + piecePolygon("190,70 250,70 220,20"),
    pieces: ["a triangle set on top of a square", "一个三角形放在一个正方形上面，拼在一起"],
    answer: ["A pentagon", "五边形"],
    wrong: [
      ["A circle", "圆"],
      ["An oval", "椭圆"],
      ["A hexagon", "六边形"],
      ["A rectangle", "长方形"],
      ["A triangle", "三角形"],
    ],
    why: [
      "The shared side vanishes inside, which leaves 3 sides from the square and 2 from the triangle, so there are 5 sides.",
      "共用的边拼到了里面，外框剩下正方形的 3 条边和三角形的 2 条边，一共 5 条边。",
    ],
  },
  {
    body:
      piecePolygon("40,30 80,30 80,70 40,70") +
      piecePolygon("110,30 150,30 150,70 110,70") +
      piecePolygon("180,30 220,30 220,70 180,70") +
      piecePolygon("250,30 290,30 290,70 250,70"),
    pieces: ["four same-size squares, in two rows of two", "四个一样大的正方形排成两行、每行两个，拼在一起"],
    answer: ["A square", "正方形"],
    wrong: [
      ["A triangle", "三角形"],
      ["A circle", "圆"],
      ["An oval", "椭圆"],
      ["A hexagon", "六边形"],
    ],
    why: [
      "Two rows of two make a shape that is just as wide as it is tall, with 4 square corners.",
      "两行、每行两个，拼成的图形长和宽相等，还有 4 个直角。",
    ],
  },
] as const;

/** shapeTraits say in a few words what each built shape looks like, keyed by its English option. */
const shapeTraits: Readonly<Record<string, readonly [string, string]>> = {
  "A triangle": ["has 3 sides", "有 3 条边"],
  "A square": ["has 4 equal sides", "有 4 条一样长的边"],
  "A rectangle": ["has 4 sides, two long and two short", "有 4 条边，两条长、两条短"],
  "A circle": ["is round, with no corners", "是圆的，没有角"],
  "An oval": ["is a stretched round shape, with no corners", "是拉长的圆形，没有角"],
  "A pentagon": ["has 5 sides", "有 5 条边"],
  "A hexagon": ["has 6 sides", "有 6 条边"],
};

/** trait looks up what a shape looks like, by its English option. */
const trait = (name: string): readonly [string, string] => shapeTraits[name] ?? ["", ""];

const composingShapes = earlyTopic(
  "composing-shapes",
  ["Putting Shapes Together", "拼图形"],
  ["Join shapes to build new shapes, and find how many more pieces will finish one.", "把图形拼成新的图形，并求出还要多少块才能拼好。"],
  ["defining-attributes-of-shapes"],
  ["1.G.A.2"],
  [
    earlyPoint(
      "the-shape-that-pieces-make",
      ["The shape that pieces make", "几块拼成的图形"],
      [
        "Join two pieces along a side. That side goes inside, so it no longer counts. Look only at the outer edge. Two squares side by side make an outline with 4 sides: two long and two short. That is a rectangle.\n\nCheck: count the corners of the outline. There are 4, all square corners.\n\n> **Watch out.** Do not count the side that is now inside.",
        "两块沿一条边拼在一起，这条边就到了里面，不再算了。只看外面的边框。两个正方形并排拼在一起，边框有 4 条边：两条长、两条短。这是长方形。\n\n检验：数一数边框的角，有 4 个，都是直角。\n\n> **注意。** 拼到里面的那条边不要数。",
      ],
      (rng) => {
        const item = rng.pick(compositions);
        const [answerEn, answerZh] = item.answer;
        const look = trait(answerEn);
        return picked(
          rng,
          [`Put together ${item.pieces[0]}, with no gaps. Which shape do you get?`, `把${item.pieces[1]}，不留空隙。得到什么图形？`],
          [answerEn, answerZh],
          rng.sample<readonly [string, string]>(item.wrong, 3).map(([en, zh]): Wrong => {
            const own = trait(en);
            return [[en, zh], `${en} ${own[0]}, but this outline ${look[0]}.`, `${zh}${own[1]}，可这个边框${look[1]}。`];
          }),
          [
            [
              ["Hide the shared sides", "藏起拼在一起的边"],
              ["Sides that touch end up inside and do not count.", "碰在一起的边到了里面，不算。"],
            ],
            [
              ["Look at the outline", "看边框"],
              [item.why[0], item.why[1]],
            ],
          ],
          [`${answerEn} ${look[0]}, and none of the other choices does.`, `${answerZh}${look[1]}，其他选项都不是这样。`],
          { svg: svgDocument(120, item.body), alt: piecesAlt },
        );
      },
      captioned(
        { svg: svgDocument(120, compositions[0].body), alt: piecesAlt },
        "Two same-size squares, drawn apart.",
        "两个一样大的正方形，分开画着。",
      ),
    ),
    earlyPoint(
      "pieces-to-finish-a-shape",
      ["Pieces to finish a shape", "还要几块才能拼好"],
      [
        "A rectangle can be covered with square tiles. Some are already in place. Each empty space needs one more tile. If the rectangle has 8 spaces and 5 hold tiles, $8 - 5 = 3$ more are needed.\n\nCheck: point to each empty space and count: 1, 2, 3.\n\n> **Watch out.** Count the empty spaces, not the shaded ones.",
        "一个长方形可以用正方形瓷砖铺满。有些已经铺好了，每个空位还要一块。如果长方形有 8 个位置，已经铺了 5 块，还要 $8 - 5 = 3$ 块。\n\n检验：指着每个空位数一数：1、2、3。\n\n> **注意。** 数空位，不是数涂色的格子。",
      ],
      (rng) => {
        const rows = rng.int(2, 4);
        const columns = rng.int(2, 6);
        const total = rows * columns;
        const placed = rng.int(1, total - 1);
        const answer = total - placed;
        return solved(
          [
            "The shaded squares are already in place. How many more squares will finish this rectangle?",
            "涂色的小正方形已经拼好了。还要多少个小正方形才能拼好这个长方形？",
          ],
          answer,
          [
            [
              ["Count all the squares", "数出全部的格子"],
              [
                `There are ${rows} rows of ${columns}, so ${total} squares in all.`,
                `有 ${rows} 行，每行 ${columns} 个，一共 ${total} 个格子。`,
              ],
            ],
            [["Take away the placed ones", "减去已经拼好的"], ["", ""], [`${total} - ${placed} = ${answer}`]],
          ],
          [`Count the empty squares one by one: ${answer}.`, `一个一个地数空格：${answer} 个。`],
          [
            [placed, "That counts the shaded squares. The question asks for the empty ones.", "这数的是涂色的格子，题目问的是空格。"],
            [total, "That is all the squares. Some are already in place.", "这是全部的格子，有些已经拼好了。"],
            [rows + columns, "This adds the rows and the columns. Count the squares instead.", "这是把行数和列数加起来了，应该数格子。"],
          ],
          gridFigure(rows, columns, placed),
        );
      },
      gradeDrawings2["composing-shapes#pieces-to-finish-a-shape"],
    ),
  ],
  [
    "Lily puts two same-size squares side by side. The side where they touch is now inside. The new outline has 4 sides: two long and two short. She has made a rectangle.\n\nCheck: count the corners of the outline: 4, all square.\n\nIn this lesson we join shapes to make new shapes.",
    "莉莉把两个一样大的正方形并排放在一起，碰在一起的那条边到了里面。新的边框有 4 条边：两条长、两条短。她拼成了一个长方形。\n\n检验：数一数边框的角：4 个，都是直角。\n\n本课我们把图形拼成新的图形。",
  ],
);

/** cutBarsFigure draws lettered bars, each cut into parts with the given widths. */
function cutBarsFigure(labels: readonly string[], rows: readonly (readonly number[])[]): Figure {
  let body = "";
  rows.forEach((widths, row) => {
    const y = 8 + row * 34;
    const total = widths.reduce((sum, w) => sum + w, 0);
    const scale = 260 / total;
    body += `<text x="16" y="${y + 18}" text-anchor="middle" stroke="none" fill="currentColor">${labels[row]}</text>`;
    let x = 36;
    for (const w of widths) {
      body += `<rect x="${x.toFixed(2)}" y="${y}" width="${(w * scale).toFixed(2)}" height="26"/>`;
      x += w * scale;
    }
  });
  return {
    svg: svgDocument(rows.length * 34 + 10, body),
    alt: t(`Bars ${labels.join(", ")} of the same length, each cut into parts.`, `一样长的长条 ${labels.join("、")}，每条都被分成几部分。`),
  };
}

/** sharedObjects are things that can be cut into equal shares, round or not. */
const sharedObjects = [
  { en: "pizza", zh: "披萨", round: true, measure: "个" },
  { en: "pie", zh: "馅饼", round: true, measure: "个" },
  { en: "round cake", zh: "圆蛋糕", round: true, measure: "个" },
  { en: "sandwich", zh: "三明治", round: false, measure: "个" },
  { en: "sheet of paper", zh: "纸", round: false, measure: "张" },
  { en: "brownie", zh: "布朗尼", round: false, measure: "块" },
  { en: "pancake", zh: "煎饼", round: true, measure: "张" },
  { en: "cookie", zh: "饼干", round: true, measure: "块" },
  { en: "chocolate bar", zh: "巧克力", round: false, measure: "块" },
  { en: "piece of toast", zh: "吐司", round: false, measure: "片" },
];

const halvesAndFourths = earlyTopic(
  "halves-and-fourths-of-shapes",
  ["Halves and Fourths of Shapes", "图形的二分之一和四分之一"],
  [
    "Cut circles and rectangles into two or four equal shares, and name the shares.",
    "把圆和长方形分成两个或四个相等的部分，并说出它们的名字。",
  ],
  ["composing-shapes"],
  ["1.G.A.3"],
  [
    earlyPoint(
      "spotting-equal-shares",
      ["Spotting equal shares", "找出相等的部分"],
      [
        "Fair shares are the same size. A bar cut into 2 same-size parts is cut into halves. A bar cut into 4 same-size parts is cut into fourths. Bar A here is in halves. Bar B is not.\n\nCheck: lay one part of bar A on the other. They match exactly.\n\n> **Watch out.** The right number of parts is not enough. Bar B has 2 parts, but they are different sizes.",
        "公平的每份要一样大。一个长条分成 2 个一样大的部分，就是分成了二等份；分成 4 个一样大的部分，就是四等份。这里长条 A 是二等份，长条 B 不是。\n\n检验：把长条 A 的一部分叠在另一部分上，正好重合。\n\n> **注意。** 只有份数对还不够。长条 B 也有 2 部分，可是不一样大。",
      ],
      (rng) => {
        const halves = rng.bool();
        const labels = ["A", "B", "C", "D"];
        const n = halves ? 2 : 4;
        const correctRow: readonly number[] = halves ? [1, 1] : [1, 1, 1, 1];
        const wrongRows: readonly (readonly number[])[] = rng.sample(
          halves
            ? [
                [1, 2],
                [2, 1],
                [1, 3],
                [3, 1],
                [3, 2],
                [2, 3],
                [1, 1, 1],
                [1, 1, 1, 1],
              ]
            : [
                [1, 1, 2],
                [2, 1, 1],
                [1, 2, 1, 2],
                [2, 1, 2, 1],
                [1, 1, 1, 3],
                [3, 1, 1, 1],
                [1, 1, 1],
                [1, 1],
              ],
          3,
        );
        const rows = rng.shuffle([correctRow, ...wrongRows]);
        const correct = labels[rows.indexOf(correctRow)] as string;
        const name = halves ? ["halves", "二等份"] : ["fourths", "四等份"];
        const bar = (label: string): Pair => [`Bar ${label}`, `长条 ${label}`];
        return picked(
          rng,
          [`Which bar is cut into ${name[0]}?`, `哪个长条被分成了${name[1]}？`],
          bar(correct),
          rows
            .map((row, i): Wrong | null => {
              const label = labels[i] as string;
              if (row === correctRow) return null;
              return row.length === n
                ? [bar(label), `Bar ${label} has ${n} parts, but they are not the same size.`, `长条 ${label} 有 ${n} 部分，可是不一样大。`]
                : [bar(label), `Bar ${label} has ${row.length} parts, not ${n}.`, `长条 ${label} 有 ${row.length} 部分，不是 ${n} 部分。`];
            })
            .filter((w): w is Wrong => w !== null),
          [
            [
              ["Count the parts", "数部分"],
              [`Look for bars with ${n} parts.`, `找出有 ${n} 部分的长条。`],
            ],
            [
              ["Check the sizes", "看大小"],
              [`Only bar ${correct} has ${n} parts that are all the same size.`, `只有长条 ${correct} 的 ${n} 部分都一样大。`],
            ],
          ],
          [
            `Fold bar ${correct} in your mind: each part fits exactly on the others.`,
            `想象把长条 ${correct} 折起来：每一部分都和其他部分正好重合。`,
          ],
          cutBarsFigure(labels, rows),
        );
      },
      captioned(
        cutBarsFigure(
          ["A", "B"],
          [
            [1, 1],
            [1, 2],
          ],
        ),
        "Bar A is cut into two equal parts. Bar B is cut into two parts of different sizes.",
        "长条 A 分成两个一样大的部分，长条 B 分成两个大小不同的部分。",
      ),
    ),
    earlyPoint(
      "naming-a-half-or-a-fourth",
      ["Naming a half or a fourth", "说出二分之一或四分之一"],
      [
        "Count how many equal shares make the whole. With 2 equal shares, each is a half. With 4 equal shares, each is a fourth, also called a quarter. This circle has 4 equal shares, so the shaded one is a fourth.\n\nCheck: 4 fourths make the whole circle.\n\n> **Watch out.** Count all the shares, not just the shaded one.",
        "先数整个东西被平均分成了几份。平均分成 2 份，每份是二分之一；平均分成 4 份，每份是四分之一。这个圆被平均分成 4 份，所以涂色的一份是四分之一。\n\n检验：4 个四分之一合成整个圆。\n\n> **注意。** 要数所有的份数，不要只看涂色的那一份。",
      ],
      (rng) => {
        const object = rng.pick(sharedObjects);
        const parts = rng.pick([2, 4]);
        const half = parts === 2;
        const figure = object.round
          ? slicedCircleFigure(parts, 1)
          : rng.bool() && !half
            ? cutBarFigure([1, 1, 1, 1], rng.int(0, 3))
            : {
                svg: gridFigure(half ? 1 : 2, 2, 1).svg,
                alt: t("A rectangle cut into equal shares, with one share shaded.", "一个长方形被平均分成几份，其中一份涂了颜色。"),
              };
        const options = {
          half: ["A half", "二分之一"] as Pair,
          fourth: ["A fourth", "四分之一"] as Pair,
          third: ["A third", "三分之一"] as Pair,
          whole: ["The whole thing", "整个"] as Pair,
        };
        return picked(
          rng,
          [`What part of the ${object.en} is shaded?`, `涂色部分是${object.zh}的多少？`],
          half ? options.half : options.fourth,
          [
            half
              ? [options.fourth, "A fourth is one of 4 equal shares. Here there are 2.", "四分之一是平均分成 4 份中的一份，这里只有 2 份。"]
              : [options.half, "A half is one of 2 equal shares. Here there are 4.", "二分之一是平均分成 2 份中的一份，这里有 4 份。"],
            [
              options.third,
              `A third is one of 3 equal shares. Here there are ${parts}.`,
              `三分之一是平均分成 3 份中的一份，这里有 ${parts} 份。`,
            ],
            [options.whole, "Only one share is shaded, not the whole thing.", "只涂了一份，不是整个。"],
          ],
          [
            [
              ["Count the shares", "数份数"],
              [`The ${object.en} is cut into ${parts} equal shares.`, `${object.zh}被平均分成 ${parts} 份。`],
            ],
            [
              ["Name one share", "说出一份的名字"],
              [
                `One of ${parts} equal shares is ${half ? "a half" : "a fourth"}.`,
                `${parts} 份中的一份是${half ? "二分之一" : "四分之一"}。`,
              ],
            ],
          ],
          [
            `${parts} of these shares together make the whole ${object.en}.`,
            `${parts} 个这样的一份合起来就是整${object.measure}${object.zh}。`,
          ],
          figure,
        );
      },
      captioned(
        slicedCircleFigure(4, 1),
        "A circle cut into 4 equal shares, with one shaded: a fourth.",
        "一个圆平均分成 4 份，涂了一份：四分之一。",
      ),
    ),
    earlyPoint(
      "more-shares-make-smaller-shares",
      ["More shares make smaller shares", "份数越多，每份越小"],
      [
        "Cut a pizza into 2 equal shares. Cut the same pizza into 4 instead. With 4 shares, each one is smaller. So a half is bigger than a fourth, even though 4 is bigger than 2.\n\nCheck: cut a half in two. Each piece is a fourth.\n\n> **Watch out.** More shares means smaller shares, not bigger ones.",
        "把一个披萨平均分成 2 份；再把同样的披萨平均分成 4 份。分成 4 份时，每份更小。所以二分之一比四分之一大，尽管 4 比 2 大。\n\n检验：把二分之一再分成两半，每一块就是四分之一。\n\n> **注意。** 份数越多，每份越小，不是越大。",
      ],
      (rng) => {
        const object = rng.pick(sharedObjects);
        if (rng.bool()) {
          const parts = rng.pick([2, 4]);
          const name = parts === 2 ? ["halves", "二分之一", "a half"] : ["fourths", "四分之一", "a fourth"];
          const pieces = Array.from({ length: parts }, () => name[2]);
          const piecesZh = Array.from({ length: parts }, () => name[1]);
          return solved(
            [`How many ${name[0]} make one whole ${object.en}?`, `多少个${name[1]}合成一整${object.measure}${object.zh}？`],
            parts,
            [
              [
                ["Count the shares", "数份数"],
                [`Cutting into ${name[0]} makes ${parts} equal shares.`, `分成${name[1]}就是平均分成 ${parts} 份。`],
              ],
              [
                ["Put them back", "合起来"],
                [`All ${parts} shares together make the whole ${object.en}.`, `${parts} 份合起来就是整${object.measure}${object.zh}。`],
              ],
            ],
            [
              `Picture the ${object.en}: ${pieces.join(" and ")} fill it with nothing left over.`,
              `想象这${object.measure}${object.zh}：${piecesZh.join("、")}正好把它填满。`,
            ],
            [
              [
                parts === 2 ? 4 : 2,
                parts === 2 ? "That is how many fourths make a whole." : "That is how many halves make a whole.",
                parts === 2 ? "这是合成整体需要的四分之一的个数。" : "这是合成整体需要的二分之一的个数。",
              ],
              [1, "One share is only part of the whole.", "一份只是整体的一部分。"],
            ],
          );
        }
        const asksBigger = rng.bool();
        const halfOption: Pair = [`A half of the ${object.en}`, `${object.zh}的二分之一`];
        const fourthOption: Pair = [`A fourth of the ${object.en}`, `${object.zh}的四分之一`];
        return picked(
          rng,
          [
            `Which share of the same ${object.en} is ${asksBigger ? "bigger" : "smaller"}?`,
            `同一${object.measure}${object.zh}，哪一份${asksBigger ? "更大" : "更小"}？`,
          ],
          asksBigger ? halfOption : fourthOption,
          [
            asksBigger
              ? [fourthOption, "A fourth is one of 4 shares, so it is smaller.", "四分之一是 4 份中的一份，所以更小。"]
              : [halfOption, "A half is one of 2 shares, so it is bigger.", "二分之一是 2 份中的一份，所以更大。"],
            [
              ["They are the same size", "它们一样大"],
              "More shares of the same thing are smaller shares.",
              "同样的东西分的份数多，每份就小。",
            ],
            [["It depends on the color", "要看颜色"], "Color does not change the size of a share.", "颜色不会改变一份的大小。"],
          ],
          [
            [
              ["Count the shares", "数份数"],
              ["Halves are 2 shares. Fourths are 4 shares.", "二分之一是分成 2 份，四分之一是分成 4 份。"],
            ],
            [
              ["Compare", "比较"],
              ["The same thing in more shares makes each share smaller.", "同样的东西分的份数越多，每份越小。"],
            ],
          ],
          [
            "Cut a half in two: each piece is a fourth. So a fourth is smaller than a half.",
            "把二分之一再分成两半，每块是四分之一。所以四分之一比二分之一小。",
          ],
        );
      },
      captioned(
        cutBarsFigure(
          ["A", "B"],
          [
            [1, 1],
            [1, 1, 1, 1],
          ],
        ),
        "Bar A is cut into halves and bar B into fourths. Each fourth is smaller than a half.",
        "长条 A 分成二等份，长条 B 分成四等份。每个四分之一都比二分之一小。",
      ),
    ),
  ],
  [
    "Two friends share a sandwich. Dad cuts it into 2 parts of the same size. Each friend gets a half.\n\nCheck: put one half on top of the other. They match exactly.\n\nIn this lesson we cut shapes into halves and fourths, and name the shares.",
    "两个朋友分一个三明治。爸爸把它切成一样大的 2 份，每人得到二分之一。\n\n检验：把一半叠在另一半上，正好重合。\n\n本课我们把图形分成二等份和四等份，并说出每份的名字。",
  ],
);

/** gradeOneMeasureTopics are the measurement, data and geometry topics of 1st Grade Math, in teaching order. */
export const gradeOneMeasureTopics: readonly TopicDef[] = [
  comparingLengths,
  nonStandardUnits,
  timeToTheHour,
  timeToTheHalfHour,
  tallyCharts,
  firstPictureGraphs,
  firstBarGraphs,
  definingAttributes,
  composingShapes,
  halvesAndFourths,
];
