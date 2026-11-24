// 3rd Grade Math: fractions as numbers, time, mass and volume, scaled graphs and
// line plots, area, perimeter and the sorting of shapes.

import type { Figure, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dotPlot } from "@ga/subject-math";
import {
  barGraphFigure,
  clockFigure,
  earlyNames,
  earlyPoint,
  earlyTopic,
  gridFigure,
  labeledRectangleFigure,
  numberLineFigure,
  pictureGraphFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { captioned, compared, dialScaleFigure, type Pair, partWholeBarFigure, picked, solved } from "./early-grades-more-kit.ts";
import { barFigure, twoBarsFigure } from "./grade-4-fractions.ts";

/** plural writes a count with its noun, adding s unless the count is 1. */
const plural = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

/** timeText writes a time such as 3:07. */
const timeText = (hour: number, minute: number) => `${hour}:${String(minute).padStart(2, "0")}`;

const unitFractions = earlyTopic(
  "unit-fractions",
  ["Unit Fractions", "单位分数"],
  ["See one of several equal parts of a whole as a fraction with a top number of 1.", "把整体平均分后的一份看成分子为 1 的分数。"],
  ["halves-thirds-and-fourths-of-shapes"],
  ["3.NF.A.1"],
  [
    earlyPoint(
      "naming-one-equal-part",
      ["Naming one equal part", "说出一份"],
      [
        "A ribbon is cut into 5 equal parts, and one part is shaded. The bottom number counts the equal parts, so one part is $\\frac{1}{5}$ of the ribbon. A fraction with a top number of 1 is a unit fraction.\n\nCheck: 5 parts of $\\frac{1}{5}$ make the whole ribbon.\n\n> **Watch out.** Count every part, not only the unshaded ones. 4 unshaded parts do not make $\\frac{1}{4}$.",
        "一条丝带被平均分成 5 份，其中一份涂了颜色。分母数的是平均分成的份数，所以一份是丝带的 $\\frac{1}{5}$。分子是 1 的分数叫单位分数。\n\n检验：5 个 $\\frac{1}{5}$ 合起来是整条丝带。\n\n> **注意。** 要数所有的份数，不能只数没涂色的。没涂色的有 4 份，但一份不是 $\\frac{1}{4}$。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const thing = rng.pick([
          { en: "chocolate bar", zh: "巧克力" },
          { en: "strip of paper", zh: "纸条" },
          { en: "ribbon", zh: "丝带" },
          { en: "garden bed", zh: "花坛" },
        ]);
        return solved(
          [
            `This picture shows a ${thing.en} cut into equal parts, with one part shaded. The shaded part is $\\frac{1}{n}$ of the ${thing.en}. What is $n$?`,
            `这幅图表示一块${thing.zh}被平均分成几份，其中一份涂了颜色。涂色部分是这块${thing.zh}的 $\\frac{1}{n}$。$n$ 是多少？`,
          ],
          d,
          [
            [
              ["Count all the parts", "数出所有的份数"],
              [`There are ${d} equal parts, shaded or not.`, `一共有 ${d} 个相等的部分，涂色的和没涂色的都算。`],
            ],
            [
              ["Name one part", "说出一份"],
              [`One of ${d} equal parts is $\\frac{1}{${d}}$, so $n = ${d}$.`, `${d} 份中的一份是 $\\frac{1}{${d}}$，所以 $n = ${d}$。`],
            ],
          ],
          [`${d} copies of $\\frac{1}{${d}}$ make the whole ${thing.en}.`, `${d} 个 $\\frac{1}{${d}}$ 合起来是整块${thing.zh}。`],
          [
            [
              d - 1,
              "That counts only the unshaded parts. The bottom number counts all the parts.",
              "这只数了没涂色的。分母要数所有的份数。",
            ],
            [1, "That is the top number, the one shaded part.", "这是分子，也就是涂色的那一份。"],
            [d + 1, "That counts one part too many.", "多数了一份。"],
          ],
          barFigure(d, 1),
        );
      },
      captioned(
        barFigure(5, 1),
        "A ribbon cut into 5 equal parts with 1 shaded: one fifth.",
        "一条丝带平均分成 5 份，涂了 1 份：五分之一。",
      ),
    ),
    earlyPoint(
      "more-parts-means-smaller-parts",
      ["More parts means smaller parts", "份数越多每份越小"],
      [
        "Two equal pizzas: one is cut into 3 slices and the other into 6. The 6 slices share the same pizza, so each is smaller. So $\\frac{1}{3}$ is larger than $\\frac{1}{6}$.\n\nCheck: in the picture, one third covers two sixths.\n\n> **Watch out.** A bigger bottom number means a smaller piece, not a bigger one.",
        "两个一样大的比萨：一个切成 3 块，另一个切成 6 块。6 块分的是同一个比萨，所以每块更小。所以 $\\frac{1}{3}$ 比 $\\frac{1}{6}$ 大。\n\n检验：在图中，一个三分之一盖住了两个六分之一。\n\n> **注意。** 分母越大，每一份越小，而不是越大。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12].filter((v) => v !== a));
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return picked(
          rng,
          [
            `Two equal pizzas are cut, one into ${a} equal slices and one into ${b} equal slices. Which is the larger slice?`,
            `两个同样大的比萨，一个平均切成 ${a} 块，一个平均切成 ${b} 块。哪一块更大？`,
          ],
          [`$\\frac{1}{${lo}}$ of a pizza`, `比萨的 $\\frac{1}{${lo}}$`],
          [
            [
              [`$\\frac{1}{${hi}}$ of a pizza`, `比萨的 $\\frac{1}{${hi}}$`],
              `${hi} is the bigger number, but ${hi} slices share the pizza, so each is smaller.`,
              `${hi} 是较大的数，但 ${hi} 块分同一个比萨，每块更小。`,
            ],
            [
              ["They are the same size", "一样大"],
              "The pizzas are the same, but they are cut into different numbers of slices.",
              "比萨一样大，但切成的块数不同。",
            ],
            [
              ["It cannot be told", "无法判断"],
              "The pizzas are equal, so the number of slices decides it.",
              "比萨一样大，所以块数就能决定。",
            ],
          ],
          [
            [
              ["Compare the number of slices", "比较块数"],
              [`One pizza has ${lo} slices and the other ${hi}.`, `一个比萨切成 ${lo} 块，另一个切成 ${hi} 块。`],
            ],
            [
              ["Decide", "判断"],
              [
                `Fewer slices of the same pizza are larger, so $\\frac{1}{${lo}}$ is larger.`,
                `同一个比萨，块数越少每块越大，所以 $\\frac{1}{${lo}}$ 更大。`,
              ],
            ],
          ],
          [
            `${lo} slices of $\\frac{1}{${lo}}$ and ${hi} slices of $\\frac{1}{${hi}}$ each make one pizza, and fewer pieces must each be bigger.`,
            `${lo} 个 $\\frac{1}{${lo}}$ 和 ${hi} 个 $\\frac{1}{${hi}}$ 都组成一个比萨，块数少，每块就大。`,
          ],
          twoBarsFigure(lo, 1, hi, 1),
        );
      },
      captioned(
        twoBarsFigure(3, 1, 6, 1),
        "Two equal bars: one third on top is longer than one sixth below.",
        "两个一样长的长条：上面的三分之一比下面的六分之一长。",
      ),
    ),
  ],
  [
    "Mom cuts a cake into 4 equal pieces and gives you one. Your piece is one of 4 equal parts, so it is $\\frac{1}{4}$ of the cake.\n\nCheck: 4 pieces of $\\frac{1}{4}$ make the whole cake.\n\nIn this lesson we name one equal part of a whole as a unit fraction, and compare unit fractions.",
    "妈妈把一个蛋糕平均切成 4 块，给你一块。你的这块是 4 份中的一份，所以是蛋糕的 $\\frac{1}{4}$。\n\n检验：4 个 $\\frac{1}{4}$ 合起来是整个蛋糕。\n\n本课我们把整体平均分后的一份说成单位分数，并比较单位分数的大小。",
  ],
);

const fractionsOfAWhole = earlyTopic(
  "fractions-as-parts-of-a-whole",
  ["Fractions as Parts of a Whole", "分数表示整体的部分"],
  ["Build a fraction from unit fractions, and read a shaded part as a fraction.", "用单位分数组成分数，并把涂色部分读成分数。"],
  ["unit-fractions"],
  ["3.NF.A.1"],
  [
    earlyPoint(
      "reading-a-shaded-fraction",
      ["Reading a shaded fraction", "读涂色的分数"],
      [
        "A bar is cut into 4 equal parts, and 3 are shaded. The bottom number counts all the parts: 4. The top number counts the shaded parts: 3. So the shaded part is $\\frac{3}{4}$.\n\nCheck: 3 parts of $\\frac{1}{4}$ make $\\frac{3}{4}$.\n\n> **Watch out.** Do not compare shaded with unshaded. 3 shaded and 1 unshaded is not $\\frac{3}{1}$.",
        "一个长条被平均分成 4 份，涂了 3 份。分母数的是全部份数：4。分子数的是涂色的份数：3。所以涂色部分是 $\\frac{3}{4}$。\n\n检验：3 个 $\\frac{1}{4}$ 是 $\\frac{3}{4}$。\n\n> **注意。** 不要拿涂色的和没涂色的比。涂了 3 份、没涂 1 份，不是 $\\frac{3}{1}$。",
      ],
      (rng) => {
        const d = rng.int(3, 10);
        const n = rng.int(2, d - 1);
        const asksBottom = rng.bool();
        return solved(
          asksBottom
            ? [
                "The shaded part of this bar is a fraction of the whole bar. What is the bottom number of that fraction?",
                "涂色部分占整个长条的几分之几？这个分数的分母是多少？",
              ]
            : [
                "The shaded part of this bar is a fraction of the whole bar. What is the top number of that fraction?",
                "涂色部分占整个长条的几分之几？这个分数的分子是多少？",
              ],
          asksBottom ? d : n,
          [
            [
              ["Count all the parts", "数出全部份数"],
              [`There are ${d} equal parts, so the bottom number is ${d}.`, `一共有 ${d} 个相等的部分，所以分母是 ${d}。`],
            ],
            [
              ["Count the shaded parts", "数出涂色的份数"],
              [`${n} are shaded, so the fraction is $\\frac{${n}}{${d}}$.`, `涂了 ${n} 份，所以分数是 $\\frac{${n}}{${d}}$。`],
            ],
          ],
          [`${n} shaded and ${d - n} unshaded make ${d} parts in all.`, `涂色的 ${n} 份和没涂色的 ${d - n} 份，合起来是 ${d} 份。`],
          asksBottom
            ? [
                [d - n, "That counts only the unshaded parts. The bottom number counts them all.", "这只数了没涂色的。分母要数全部。"],
                [n, "That is the top number, the shaded parts.", "这是分子，是涂色的份数。"],
              ]
            : [
                [d - n, "That counts the unshaded parts. The top number counts the shaded ones.", "这数的是没涂色的。分子数的是涂色的。"],
                [d, "That is the bottom number, all the parts.", "这是分母，是全部份数。"],
              ],
          barFigure(d, n),
        );
      },
      captioned(
        barFigure(4, 3),
        "A bar cut into 4 equal parts with 3 shaded: three fourths.",
        "一个长条平均分成 4 份，涂了 3 份：四分之三。",
      ),
    ),
    earlyPoint(
      "how-many-unit-fractions",
      ["How many unit fractions", "有多少个单位分数"],
      [
        "$\\frac{5}{6}$ means 5 parts, each of size $\\frac{1}{6}$. So 5 copies of $\\frac{1}{6}$ make $\\frac{5}{6}$, just as 5 ones make 5.\n\nCheck: count the shaded sixths in the picture: 1, 2, 3, 4, 5.\n\n> **Watch out.** The top number counts the copies. 6 copies of $\\frac{1}{6}$ would make the whole.",
        "$\\frac{5}{6}$ 表示 5 份，每份是 $\\frac{1}{6}$。所以 5 个 $\\frac{1}{6}$ 是 $\\frac{5}{6}$，就像 5 个一是 5。\n\n检验：数一数图中涂色的六分之一：1、2、3、4、5。\n\n> **注意。** 分子数的是有几个。6 个 $\\frac{1}{6}$ 就是整体了。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(2, d);
        return solved(
          [`How many copies of $\\frac{1}{${d}}$ make $\\frac{${n}}{${d}}$?`, `多少个 $\\frac{1}{${d}}$ 组成 $\\frac{${n}}{${d}}$？`],
          n,
          [
            [
              ["Read the bottom number", "看分母"],
              [`Each part is $\\frac{1}{${d}}$.`, `每份是 $\\frac{1}{${d}}$。`],
            ],
            [
              ["Read the top number", "看分子"],
              [`The top number ${n} counts the parts, so ${n} copies.`, `分子 ${n} 数的是份数，所以是 ${n} 个。`],
            ],
          ],
          [
            `Counting ${n} jumps of $\\frac{1}{${d}}$ from 0 reaches $\\frac{${n}}{${d}}$.`,
            `从 0 开始跳 ${n} 次 $\\frac{1}{${d}}$，到达 $\\frac{${n}}{${d}}$。`,
          ],
          [
            [d, `That is the bottom number. ${d} copies make the whole.`, `这是分母。${d} 个才是整体。`],
            [d - n, "That counts the parts that are missing, not the copies.", "这数的是还差的份数，不是有几个。"],
            [n + 1, "That counts one copy too many.", "多数了一个。"],
          ],
          barFigure(d, n),
        );
      },
      captioned(
        barFigure(6, 5),
        "A bar cut into 6 equal parts with 5 shaded: five copies of one sixth.",
        "一个长条平均分成 6 份，涂了 5 份：5 个六分之一。",
      ),
    ),
  ],
  [
    "A chocolate bar has 4 equal pieces. Lily eats 3 of them. She ate 3 pieces of $\\frac{1}{4}$ each, which is $\\frac{3}{4}$ of the bar.\n\nCheck: 1 piece is left, and $\\frac{3}{4}$ and $\\frac{1}{4}$ make the whole bar.\n\nIn this lesson we build fractions from unit fractions and read a shaded part as a fraction.",
    "一块巧克力有 4 个相等的小块。Lily 吃了 3 块。她吃了 3 个 $\\frac{1}{4}$，也就是这块巧克力的 $\\frac{3}{4}$。\n\n检验：还剩 1 块，$\\frac{3}{4}$ 和 $\\frac{1}{4}$ 合起来是整块。\n\n本课我们用单位分数组成分数，并把涂色部分读成分数。",
  ],
);

const fractionsOnNumberLine = earlyTopic(
  "fractions-on-the-number-line",
  ["Fractions on the Number Line", "数轴上的分数"],
  ["Place a fraction on a number line by cutting the space from 0 to 1 into equal parts.", "把数轴上 0 到 1 之间平均分，在上面表示分数。"],
  ["fractions-as-parts-of-a-whole"],
  ["3.NF.A.2"],
  [
    {
      ...earlyPoint(
        "counting-jumps-to-a-point",
        ["Counting jumps to a point", "数跳到某点的次数"],
        [
          "The line from 0 to 1 is cut into 4 equal parts, so each jump is $\\frac{1}{4}$. Three jumps from 0 reach the point, so it shows $\\frac{3}{4}$.\n\nCheck: one more jump would reach 1, which is $\\frac{4}{4}$.\n\n> **Watch out.** Count the jumps, not the tick marks. Counting the tick at 0 gives one too many.",
          "从 0 到 1 的线段被平均分成 4 份，每跳一次是 $\\frac{1}{4}$。从 0 跳 3 次到达这个点，所以它表示 $\\frac{3}{4}$。\n\n检验：再跳一次就到 1，也就是 $\\frac{4}{4}$。\n\n> **注意。** 要数跳了几次，不是数刻度。把 0 处的刻度也数上就多了一个。",
        ],
        (rng) => {
          const d = rng.int(3, 8);
          const n = rng.int(1, d - 1);
          return solved(
            [
              `The space from 0 to 1 on this line is cut into equal parts. The marked point shows $\\frac{a}{${d}}$. What is $a$?`,
              `这条数轴上 0 到 1 之间被平均分成几份。标出的点表示 $\\frac{a}{${d}}$。$a$ 是多少？`,
            ],
            n,
            [
              [
                ["Size of a jump", "每跳一次多大"],
                [`${d} equal parts, so each jump is $\\frac{1}{${d}}$.`, `平均分成 ${d} 份，每跳一次是 $\\frac{1}{${d}}$。`],
              ],
              [
                ["Count the jumps", "数跳了几次"],
                [
                  `From 0 to the point is ${n} ${n === 1 ? "jump" : "jumps"}, so $a = ${n}$.`,
                  `从 0 到这个点跳了 ${n} 次，所以 $a = ${n}$。`,
                ],
              ],
            ],
            [
              `${d - n} more ${d - n === 1 ? "jump reaches" : "jumps reach"} 1, and $${n} + ${d - n} = ${d}$.`,
              `再跳 ${d - n} 次到 1，$${n} + ${d - n} = ${d}$。`,
            ],
            [
              [n + 1, "That counts the tick at 0 as well.", "这把 0 处的刻度也数上了。"],
              [d, "That is the bottom number, the jumps to reach 1.", "这是分母，是跳到 1 的次数。"],
              [d - n, "That counts the jumps from the point to 1.", "这数的是从这个点到 1 的次数。"],
            ],
            fractionLine(d, n),
          );
        },
      ),
      figure: gradeDrawings2["fractions-on-the-number-line#counting-jumps-to-a-point"],
    },
    {
      ...earlyPoint(
        "the-fraction-of-spaces-between-whole-numbers",
        ["The number of spaces between whole numbers", "整数之间的格数"],
        [
          "On this line each unit, such as 0 to 1, has 4 tick marks and 3 spaces. The spaces are the parts, so each space is $\\frac{1}{3}$, however long the line is.\n\nCheck: 3 spaces of $\\frac{1}{3}$ make $\\frac{3}{3} = 1$, one whole unit.\n\n> **Watch out.** Count the spaces, not the tick marks. 4 ticks make only 3 spaces.",
          "这条数轴上每个单位，比如 0 到 1，有 4 条刻度线、3 格。格才是份数，所以每格是 $\\frac{1}{3}$，不管整条线有多长。\n\n检验：3 个 $\\frac{1}{3}$ 是 $\\frac{3}{3} = 1$，正好一个单位。\n\n> **注意。** 要数格，不是数刻度线。4 条刻度线只有 3 格。",
        ],
        (rng) => {
          const d = rng.int(2, 9);
          const ticks = d + 1;
          const whole = rng.int(0, 7);
          return solved(
            [
              `Between ${whole} and ${whole + 1} on a number line there are ${ticks} tick marks, counting both ends, and they are evenly spaced. Each space is $\\frac{1}{n}$. What is $n$?`,
              `数轴上 ${whole} 和 ${whole + 1} 之间有 ${ticks} 条等距的刻度线（包括两端）。每一格是 $\\frac{1}{n}$。$n$ 是多少？`,
            ],
            d,
            [
              [
                ["Ticks to spaces", "由刻度数格"],
                ["The spaces are one fewer than the ticks:", "格数比刻度线少 1："],
                [`${ticks} - 1 = ${d}`],
              ],
              [
                ["Name a space", "说出每一格"],
                [`One unit has ${d} equal spaces, so each is $\\frac{1}{${d}}$.`, `一个单位有 ${d} 格，所以每格是 $\\frac{1}{${d}}$。`],
              ],
            ],
            [
              `${d} spaces of $\\frac{1}{${d}}$ make $\\frac{${d}}{${d}} = 1$, from ${whole} to ${whole + 1}.`,
              `${d} 个 $\\frac{1}{${d}}$ 是 $\\frac{${d}}{${d}} = 1$，正好从 ${whole} 到 ${whole + 1}。`,
            ],
            [
              [ticks, "That counts the tick marks, not the spaces.", "这数的是刻度线，不是格。"],
              [d - 1, "That takes away 2. There is just one fewer space than tick marks.", "这减了 2。格数只比刻度线少 1。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["fractions-on-the-number-line#the-fraction-of-spaces-between-whole-numbers"],
    },
  ],
  [
    "A path from home to school is 1 kilometer, with 4 equal stretches marked by trees. After 3 stretches, Tom is $\\frac{3}{4}$ of the way, so $\\frac{3}{4}$ is a point on the number line.\n\nCheck: one more stretch reaches school, $\\frac{4}{4} = 1$.\n\nIn this lesson we place fractions on a number line by cutting the space from 0 to 1 into equal parts.",
    "从家到学校的路是 1 千米，用树分成 4 段相等的路。走了 3 段，Tom 走了全程的 $\\frac{3}{4}$，所以 $\\frac{3}{4}$ 是数轴上的一个点。\n\n检验：再走一段就到学校，$\\frac{4}{4} = 1$。\n\n本课我们把 0 到 1 之间平均分，在数轴上表示分数。",
  ],
);

/** fractionLine draws the number line from 0 to 1 with d spaces and a point at n/d. */
function fractionLine(d: number, n: number) {
  const figure = numberLineFigure(0, d, 1, n, false);
  return {
    svg: figure.svg.replace(`>${d}</text>`, ">1</text>"),
    alt: t(
      "A number line from 0 to 1, cut into equal spaces, with one marked point.",
      "一条从 0 到 1 的数轴，平均分成若干格，上面有一个点。",
    ),
  };
}

const equivalentFractionsEarly = earlyTopic(
  "equal-fractions-with-pictures",
  ["Equal Fractions With Pictures", "用图形看相等的分数"],
  [
    "Use bars to see that two fractions can name the same amount, and find a matching fraction.",
    "用长条看出两个分数可以表示同样多，并求出相等的分数。",
  ],
  ["fractions-on-the-number-line"],
  ["3.NF.A.3"],
  [
    earlyPoint(
      "matching-shaded-bars",
      ["Matching shaded bars", "比较涂色的长条"],
      [
        "The top bar shows $\\frac{1}{2}$. Cut each half of the bottom bar into 2, and it has 4 parts with 2 shaded. The shaded amount is the same, so $\\frac{1}{2} = \\frac{2}{4}$.\n\nCheck: line up the bars: the shaded parts end at the same place.\n\n> **Watch out.** Multiply the top number too. $\\frac{1}{4}$ has the new bottom but covers less.",
        "上面的长条表示 $\\frac{1}{2}$。把下面长条的每一半再切成 2 份，就有 4 份，涂了 2 份。涂色部分一样多，所以 $\\frac{1}{2} = \\frac{2}{4}$。\n\n检验：把长条对齐，涂色部分在同一个地方结束。\n\n> **注意。** 分子也要乘。$\\frac{1}{4}$ 的分母对了，但涂色部分少了。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 6]);
        const n = rng.int(1, d - 1);
        const k = rng.int(2, d === 2 ? 6 : d === 3 ? 5 : d === 4 ? 3 : 2);
        const answer = n * k;
        return solved(
          [
            `The two bars are the same size, and their shaded parts are equal. So $\\frac{${n}}{${d}} = \\frac{a}{${d * k}}$. What is $a$?`,
            `两个长条同样大，涂色部分相等。所以 $\\frac{${n}}{${d}} = \\frac{a}{${d * k}}$。$a$ 是多少？`,
          ],
          answer,
          [
            [
              ["Find the cut", "看怎样切"],
              [`${d} parts became ${d * k}, so each part was cut into ${k}:`, `${d} 份变成 ${d * k} 份，每份切成了 ${k} 份：`],
              [`${d} \\times ${k} = ${d * k}`],
            ],
            [
              ["Cut the shaded parts too", "涂色的也一样切"],
              [`The ${n} shaded ${n === 1 ? "part becomes" : "parts become"}:`, `涂色的 ${n} 份变成：`],
              [`${n} \\times ${k} = ${answer}`],
            ],
          ],
          [
            `$\\frac{${answer}}{${d * k}}$ and $\\frac{${n}}{${d}}$ leave the same ${d * k - answer} small parts unshaded: $${d * k} - ${answer} = ${(d - n) * k}$ and $(${d} - ${n}) \\times ${k} = ${(d - n) * k}$.`,
            `$\\frac{${answer}}{${d * k}}$ 和 $\\frac{${n}}{${d}}$ 没涂色的小份一样多：$${d * k} - ${answer} = ${(d - n) * k}$，$(${d} - ${n}) \\times ${k} = ${(d - n) * k}$。`,
          ],
          [
            [
              n,
              "That keeps the old top number. The parts are cut, so there are more shaded parts.",
              "这保留了原来的分子。每份都切开了，涂色的份数也变多了。",
            ],
            [
              n + k,
              `That adds ${k}. Each shaded part is cut into ${k}, so multiply.`,
              `这是加 ${k}。每个涂色的份都切成 ${k} 份，要用乘法。`,
            ],
            [d * k - answer, "That counts the unshaded parts.", "这数的是没涂色的份数。"],
          ],
          twoBarsFigure(d, n, d * k, answer),
        );
      },
      captioned(
        twoBarsFigure(2, 1, 4, 2),
        "One half on top and two fourths below cover the same amount.",
        "上面的二分之一和下面的四分之二一样多。",
      ),
    ),
    earlyPoint(
      "whole-numbers-as-fractions",
      ["Whole numbers as fractions", "把整数写成分数"],
      [
        "Three pizzas are each cut into 4 slices, so there are 12 slices of $\\frac{1}{4}$. Every 4 slices make 1 pizza, so $\\frac{12}{4} = 12 \\div 4 = 3$. Likewise $\\frac{4}{4} = 1$, and $\\frac{3}{1} = 3$.\n\nCheck: $3 \\times 4 = 12$ slices.\n\n> **Watch out.** $\\frac{4}{4}$ is 1 whole, not 4. The top and bottom are the same, so all the parts are there.",
        "3 个比萨，每个切成 4 块，一共 12 个 $\\frac{1}{4}$。每 4 块是 1 个比萨，所以 $\\frac{12}{4} = 12 \\div 4 = 3$。同样，$\\frac{4}{4} = 1$，$\\frac{3}{1} = 3$。\n\n检验：$3 \\times 4 = 12$ 块。\n\n> **注意。** $\\frac{4}{4}$ 是 1 个整体，不是 4。分子分母相同，表示所有的份都在。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const n = rng.int(2, 12);
        const m = rng.int(2, 6);
        if (kind === 0)
          return solved(
            [`What whole number equals $\\frac{${n}}{1}$?`, `$\\frac{${n}}{1}$ 等于哪个整数？`],
            n,
            [
              [
                ["Read the bottom number", "看分母"],
                ["A bottom number of 1 means each whole is a single part.", "分母是 1，表示每个整体只有一份。"],
              ],
              [["Count the wholes", "数整体"], [`${n} parts make ${n} wholes:`, `${n} 份就是 ${n} 个整体：`], [`${n} \\div 1 = ${n}`]],
            ],
            [`$${n} \\times 1 = ${n}$.`, `$${n} \\times 1 = ${n}$。`],
            [
              [1, "That reads the bottom number. Each part is a whole one.", "这读的是分母。每一份就是一个整体。"],
              [n - 1, "That is one whole too few.", "少了一个整体。"],
            ],
          );
        if (kind === 1)
          return solved(
            [`What whole number equals $\\frac{${n}}{${n}}$?`, `$\\frac{${n}}{${n}}$ 等于哪个整数？`],
            1,
            [
              [
                ["Compare top and bottom", "比较分子和分母"],
                [`The whole has ${n} parts, and ${n} of them are there.`, `整体有 ${n} 份，${n} 份都在。`],
              ],
              [["Name it", "说出结果"], ["All the parts make one whole:", "所有的份合起来是一个整体："], [`${n} \\div ${n} = 1`]],
            ],
            [`$1 \\times ${n} = ${n}$ parts.`, `$1 \\times ${n} = ${n}$ 份。`],
            [
              [n, "That is the number of parts, not the number of wholes.", "这是份数，不是整体的个数。"],
              [0, "That subtracts. All the parts are there, so it is one whole.", "这是相减。所有的份都在，所以是一个整体。"],
              [
                2,
                "That adds the 1 on top and the 1 on the bottom. The parts make only one whole.",
                "这把两个 1 加起来了。这些份只组成一个整体。",
              ],
            ],
          );
        return solved(
          [`What whole number equals $\\frac{${m * n}}{${n}}$?`, `$\\frac{${m * n}}{${n}}$ 等于哪个整数？`],
          m,
          [
            [
              ["One whole", "一个整体"],
              [`Every ${n} parts make one whole.`, `每 ${n} 份是一个整体。`],
            ],
            [
              ["Count the wholes", "数整体"],
              [`How many groups of ${n} are in ${m * n}:`, `${m * n} 里有几个 ${n}：`],
              [`${m * n} \\div ${n} = ${m}`],
            ],
          ],
          [`$${m} \\times ${n} = ${m * n}$ parts.`, `$${m} \\times ${n} = ${m * n}$ 份。`],
          [
            [n, "That is the size of one whole, not the number of wholes.", "这是一个整体的份数，不是整体的个数。"],
            [m * n, "That is the number of parts, not the number of wholes.", "这是份数，不是整体的个数。"],
            [m * n - n, "That subtracts. Divide to find the wholes.", "这是相减。要用除法求整体的个数。"],
          ],
          barFigure(n, m * n, m),
        );
      },
      captioned(
        barFigure(4, 12, 3),
        "3 bars of 4 fourths each, all shaded: twelve fourths are 3 wholes.",
        "3 个长条，每个 4 份，全涂色：十二个四分之一是 3 个整体。",
      ),
    ),
  ],
  [
    "Ann eats half a pizza, and Bo eats two of the four quarters of the same size pizza. They ate the same amount, so $\\frac{1}{2} = \\frac{2}{4}$.\n\nCheck: two quarters put together cover one half.\n\nIn this lesson we use bars to see that two fractions can name the same amount.",
    "Ann 吃了半个比萨，Bo 吃了同样大的比萨四块中的两块。他们吃得一样多，所以 $\\frac{1}{2} = \\frac{2}{4}$。\n\n检验：两个四分之一拼起来正好盖住一半。\n\n本课我们用长条看出两个分数可以表示同样多。",
  ],
);

const comparingFractionsEarly = earlyTopic(
  "comparing-fractions-with-a-common-part",
  ["Comparing Fractions With the Same Top or Bottom", "比较分子或分母相同的分数"],
  [
    "Compare two fractions of the same whole when their denominators or numerators match.",
    "比较同一整体的两个分数，它们的分母或分子相同。",
  ],
  ["equal-fractions-with-pictures"],
  ["3.NF.A.3"],
  [
    earlyPoint(
      "same-denominator",
      ["The same denominator", "分母相同"],
      [
        "Compare $\\frac{3}{5}$ and $\\frac{4}{5}$. Both are fifths, so the parts are the same size. 3 parts are fewer than 4 parts, so $\\frac{3}{5} < \\frac{4}{5}$.\n\nCheck: in the picture the bar with 4 shaded fifths is longer.\n\n> **Watch out.** This works only for the same whole. Half a small pizza can be less than a third of a big one.",
        "比较 $\\frac{3}{5}$ 和 $\\frac{4}{5}$。都是五分之几，每份一样大。3 份比 4 份少，所以 $\\frac{3}{5} < \\frac{4}{5}$。\n\n检验：图中涂了 4 份的长条更长。\n\n> **注意。** 只有整体相同才能这样比。小比萨的一半可能比大比萨的三分之一还少。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const a = rng.int(1, d - 1);
        const b = ((a + rng.int(0, d - 3)) % (d - 1)) + 1;
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        return compared(
          `\\frac{${a}}{${d}}`,
          `\\frac{${b}}{${d}}`,
          Math.sign(a - b) + 1,
          [
            [
              ["Check the parts", "看每份"],
              [`Both are in parts of $\\frac{1}{${d}}$, so the parts are the same size.`, `都是 $\\frac{1}{${d}}$ 的份，每份一样大。`],
            ],
            [
              ["Count the parts", "数份数"],
              [
                `${plural(big, "part")} are more than ${plural(small, "part")}, so $\\frac{${big}}{${d}}$ is larger.`,
                `${big} 份比 ${small} 份多，所以 $\\frac{${big}}{${d}}$ 较大。`,
              ],
            ],
          ],
          [
            `$\\frac{${big}}{${d}}$ is $\\frac{${small}}{${d}}$ and ${big - small} more ${big - small === 1 ? "part" : "parts"}.`,
            `$\\frac{${big}}{${d}}$ 是 $\\frac{${small}}{${d}}$ 再加 ${big - small} 份。`,
          ],
          [
            [
              `That says $\\frac{${a}}{${d}}$ is smaller, but it has more parts of the same size.`,
              `这是认为 $\\frac{${a}}{${d}}$ 较小，但它同样大的份数更多。`,
            ],
            ["The parts are the same size, but the numbers of parts differ.", "每份一样大，但份数不同。"],
            [
              `That says $\\frac{${a}}{${d}}$ is larger, but it has fewer parts of the same size.`,
              `这是认为 $\\frac{${a}}{${d}}$ 较大，但它同样大的份数更少。`,
            ],
          ],
          twoBarsFigure(d, a, d, b),
        );
      },
      captioned(
        twoBarsFigure(5, 3, 5, 4),
        "Two equal bars in fifths: 3 shaded on top, 4 shaded below.",
        "两个一样长的长条，都分成 5 份：上面涂 3 份，下面涂 4 份。",
      ),
    ),
    earlyPoint(
      "same-numerator",
      ["The same numerator", "分子相同"],
      [
        "Compare $\\frac{2}{3}$ and $\\frac{2}{6}$. Both have 2 parts. A third is bigger than a sixth, so 2 thirds are more than 2 sixths: $\\frac{2}{3} > \\frac{2}{6}$.\n\nCheck: in the picture, 2 thirds shade more of the bar than 2 sixths.\n\n> **Watch out.** The bigger bottom number gives the smaller fraction here, the reverse of whole numbers.",
        "比较 $\\frac{2}{3}$ 和 $\\frac{2}{6}$。都是 2 份。三分之一比六分之一大，所以 2 个三分之一比 2 个六分之一多：$\\frac{2}{3} > \\frac{2}{6}$。\n\n检验：图中 2 个三分之一涂的部分比 2 个六分之一多。\n\n> **注意。** 这里分母大的分数反而小，和整数正好相反。",
      ],
      (rng) => {
        const n = rng.int(1, 5);
        const a = rng.int(n + 1, 12);
        const b = rng.pick([6, 7, 8, 9, 10, 11, 12].filter((v) => v !== a && v > n));
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return compared(
          `\\frac{${n}}{${a}}`,
          `\\frac{${n}}{${b}}`,
          Math.sign(b - a) + 1,
          [
            [
              ["Count the parts", "数份数"],
              [`Both have ${plural(n, "part")}.`, `都是 ${n} 份。`],
            ],
            [
              ["Compare the size of a part", "比较每份的大小"],
              [
                `$\\frac{1}{${lo}}$ is larger than $\\frac{1}{${hi}}$, so $\\frac{${n}}{${lo}}$ is larger.`,
                `$\\frac{1}{${lo}}$ 比 $\\frac{1}{${hi}}$ 大，所以 $\\frac{${n}}{${lo}}$ 较大。`,
              ],
            ],
          ],
          [
            `${lo} parts make a whole and ${hi} parts make the same whole, so each of the ${lo} parts must be bigger.`,
            `${lo} 份是一个整体，${hi} 份也是同一个整体，所以分成 ${lo} 份时每份更大。`,
          ],
          [
            [
              `That says $\\frac{${n}}{${a}}$ is smaller, but its parts are larger.`,
              `这是认为 $\\frac{${n}}{${a}}$ 较小，但它的每份更大。`,
            ],
            ["The numbers of parts match, but the parts are not the same size.", "份数一样，但每份大小不同。"],
            [
              `That says $\\frac{${n}}{${a}}$ is larger because ${a} is the bigger number, but a bigger bottom number means smaller parts.`,
              `这是因为 ${a} 较大，就认为 $\\frac{${n}}{${a}}$ 较大，但分母越大每份越小。`,
            ],
          ],
          twoBarsFigure(a, n, b, n),
        );
      },
      captioned(
        twoBarsFigure(3, 2, 6, 2),
        "Two equal bars: 2 thirds on top shade more than 2 sixths below.",
        "两个一样长的长条：上面的 2 个三分之一比下面的 2 个六分之一涂得多。",
      ),
    ),
  ],
  [
    "Two equal chocolate bars are cut into 5 pieces each. Mia eats 3 pieces and Leo eats 4. The pieces are the same size, so Leo ate more: $\\frac{4}{5} > \\frac{3}{5}$.\n\nCheck: Leo ate 1 more piece of the same size.\n\nIn this lesson we compare fractions of the same whole when their bottom numbers or top numbers match.",
    "两块一样大的巧克力都切成 5 块。Mia 吃了 3 块，Leo 吃了 4 块。每块一样大，所以 Leo 吃得多：$\\frac{4}{5} > \\frac{3}{5}$。\n\n检验：Leo 多吃了同样大的 1 块。\n\n本课我们比较同一整体中分母相同或分子相同的分数。",
  ],
);

const tellingTimeToTheMinute = earlyTopic(
  "telling-time-to-the-minute",
  ["Telling Time to the Minute", "看钟表到分钟"],
  ["Read an analog clock to the nearest minute.", "读指针式钟表，读到分钟。"],
  ["telling-time-to-five-minutes"],
  ["3.MD.A.1"],
  [
    earlyPoint(
      "the-minute-hand",
      ["Reading the minute hand", "读分针"],
      [
        "The long hand is 2 small marks past the 4. Count by fives to the 4: 5, 10, 15, 20. Then count on by ones: 21, 22. It shows 22 minutes.\n\nCheck: $4 \\times 5 + 2 = 22$.\n\n> **Watch out.** The number beside the long hand is not the minutes. The 4 means 20 minutes.",
        "长针过了 4 又走了 2 小格。五个五个地数到 4：5、10、15、20。再一个一个地数：21、22。是 22 分。\n\n检验：$4 \\times 5 + 2 = 22$。\n\n> **注意。** 长针旁边的数字不是分钟数。4 表示 20 分。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = rng.int(1, 59);
        const fives = Math.floor(minute / 5);
        const extra = minute % 5;
        return solved(
          ["How many minutes past the hour does this clock show?", "这个钟面显示过了整点多少分钟？"],
          minute,
          [
            [
              ["Count by fives", "五个五个地数"],
              [`The long hand has passed ${plural(fives, "number")} on the clock:`, `长针过了 ${fives} 个数字：`],
              [`${fives} \\times 5 = ${5 * fives}`],
            ],
            extra === 0
              ? [
                  ["Count on by ones", "一个一个地数"],
                  ["It points right at a number, so nothing more to add.", "它正指着数字，不用再加。"],
                ]
              : [
                  ["Count on by ones", "一个一个地数"],
                  [`${plural(extra, "small mark")} more:`, `再加 ${extra} 小格：`],
                  [`${5 * fives} + ${extra} = ${minute}`],
                ],
          ],
          [`${60 - minute} more minutes would bring the long hand to 12.`, `再过 ${60 - minute} 分钟，长针就走到 12。`],
          [
            [fives, "That reads the number beside the hand. Each number is 5 minutes.", "这读的是长针旁边的数字。每个数字代表 5 分钟。"],
            [60 - minute, "That counts the minutes still to go until the next hour.", "这数的是到下一个整点还差的分钟。"],
            [hour, "That reads the short hand, the hour.", "这读的是短针，是小时。"],
          ],
          clockFigure(hour, minute),
        );
      },
      captioned(
        clockFigure(3, 22),
        "A clock showing 3:22: the long hand is 2 marks past the 4.",
        "钟面显示 3:22：长针过了 4 又走了 2 小格。",
      ),
    ),
    earlyPoint(
      "the-hour-hand",
      ["Reading the hour hand", "读时针"],
      [
        "The short hand is between 3 and 4, nearly at 4. It has passed 3 but not reached 4, so the hour is still 3. With the long hand at 50 minutes, the time is 3:50.\n\nCheck: in 10 more minutes the long hand reaches 12 and the short hand reaches 4, at 4:00.\n\n> **Watch out.** Do not read the number the short hand is closest to. Read the one it has passed.",
        "短针在 3 和 4 之间，快到 4 了。它过了 3，还没到 4，所以还是 3 时。长针指着 50 分，时间是 3:50。\n\n检验：再过 10 分钟，长针到 12，短针到 4，就是 4:00。\n\n> **注意。** 不要读短针最靠近的数字，要读它已经走过的数字。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = rng.int(5, 55);
        const next = hour === 12 ? 1 : hour + 1;
        return solved(
          [
            "What hour does the short hand on this clock show? Give the hour that it has already passed.",
            "这个钟面的短针显示几时？写出它已经走过的那个小时。",
          ],
          hour,
          [
            [
              ["Find the short hand", "找短针"],
              [`It is between ${hour} and ${next}.`, `它在 ${hour} 和 ${next} 之间。`],
            ],
            [
              ["Take the number passed", "取已经走过的数"],
              [
                `It has passed ${hour} but not reached ${next}, so the hour is ${hour}.`,
                `它过了 ${hour}，还没到 ${next}，所以是 ${hour} 时。`,
              ],
            ],
          ],
          [
            `The long hand shows ${minute} minutes, so the time is ${timeText(hour, minute)}, before ${timeText(next, 0)}.`,
            `长针表示 ${minute} 分，时间是 ${timeText(hour, minute)}，还没到 ${timeText(next, 0)}。`,
          ],
          [
            [next, "That is the number the hand is moving toward, which it has not reached.", "这是短针正走向的数字，它还没到。"],
            [Math.floor(minute / 5), "That reads the long hand.", "这读的是长针。"],
          ],
          clockFigure(hour, minute),
        );
      },
      captioned(clockFigure(3, 50), "A clock showing 3:50: the short hand is between 3 and 4.", "钟面显示 3:50：短针在 3 和 4 之间。"),
    ),
  ],
  [
    "The bus comes at the time on the clock. The short hand has passed 7, and the long hand is 3 marks past the 2. That is 7:13.\n\nCheck: $2 \\times 5 + 3 = 13$ minutes.\n\nIn this lesson we read a clock to the nearest minute.",
    "公交车在钟面上的时刻到。短针过了 7，长针过了 2 又走了 3 小格。是 7:13。\n\n检验：$2 \\times 5 + 3 = 13$ 分。\n\n本课我们读钟表，读到分钟。",
  ],
);

const elapsedTime = earlyTopic(
  "elapsed-time-in-minutes",
  ["Elapsed Time in Minutes", "经过的时间（分钟）"],
  [
    "Find how many minutes pass between two times, and the time at the end of an activity.",
    "求两个时刻之间经过多少分钟，以及活动结束的时刻。",
  ],
  ["telling-time-to-the-minute"],
  ["3.MD.A.1"],
  [
    {
      ...earlyPoint(
        "minutes-between-two-times",
        ["Minutes between two times", "两个时刻之间的分钟数"],
        [
          "From 2:40 to 3:25: jump 20 minutes to 3:00, then 25 more to 3:25. In all, $20 + 25 = 45$ minutes.\n\nCheck: 2:40 and 45 minutes: $40 + 45 = 85$ minutes, which is 1 hour and 25 minutes, so 3:25.\n\n> **Watch out.** An hour has 60 minutes, not 100. Do not subtract the clock numbers across the hour.",
          "从 2:40 到 3:25：先跳 20 分钟到 3:00，再跳 25 分钟到 3:25。一共 $20 + 25 = 45$ 分钟。\n\n检验：2:40 过 45 分钟：$40 + 45 = 85$ 分钟，就是 1 小时 25 分钟，所以是 3:25。\n\n> **注意。** 1 小时是 60 分钟，不是 100 分钟。跨过整点时不能直接把钟面上的数相减。",
        ],
        (rng) => {
          const hour = rng.int(1, 10);
          const start = rng.int(10, 55);
          const answer = rng.int(61 - start, 59);
          const endMinute = start + answer - 60;
          const name = rng.pick(earlyNames);
          return solved(
            [
              `${name} starts reading at ${timeText(hour, start)} and stops at ${timeText(hour + 1, endMinute)}, on the same afternoon. For how many minutes does ${name} read?`,
              `${name} 在同一个下午的 ${timeText(hour, start)} 开始看书，${timeText(hour + 1, endMinute)} 停止。${name} 看了多少分钟？`,
            ],
            answer,
            [
              [
                ["Jump to the hour", "跳到整点"],
                [`From ${timeText(hour, start)} to ${timeText(hour + 1, 0)}:`, `从 ${timeText(hour, start)} 到 ${timeText(hour + 1, 0)}：`],
                [`60 - ${start} = ${60 - start}`],
              ],
              [
                ["Add the rest", "加上剩下的"],
                [`Then ${endMinute} more minutes:`, `再过 ${endMinute} 分钟：`],
                [`${60 - start} + ${endMinute} = ${answer}`],
              ],
            ],
            [
              `$${start} + ${answer} = ${start + answer}$ minutes, which is 1 hour and ${endMinute} minutes, so it ends at ${timeText(hour + 1, endMinute)}.`,
              `$${start} + ${answer} = ${start + answer}$ 分钟，就是 1 小时 ${endMinute} 分钟，所以在 ${timeText(hour + 1, endMinute)} 结束。`,
            ],
            [
              [
                Math.abs(endMinute - start),
                "That subtracts the minute numbers and forgets the hour in between.",
                "这只把分钟数相减，忘了中间跨过了整点。",
              ],
              [
                100 + endMinute - start,
                "That treats an hour as 100 minutes. An hour is 60 minutes.",
                "这把 1 小时当成了 100 分钟。1 小时是 60 分钟。",
              ],
              [answer + 60, "That adds an extra hour.", "多加了 1 小时。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["elapsed-time-in-minutes#minutes-between-two-times"],
    },
    earlyPoint(
      "the-minutes-at-the-end",
      ["The minutes at the end of an activity", "结束时的分钟数"],
      [
        "A game starts at 2:45 and lasts 25 minutes. Jump 15 minutes to 3:00, and 10 minutes are left. So it ends at 3:10.\n\nCheck: $45 + 25 = 70$ minutes, which is 1 hour and 10 minutes after 2:00.\n\n> **Watch out.** 2:70 is not a time. When the minutes reach 60, start a new hour.",
        "比赛 2:45 开始，持续 25 分钟。先跳 15 分钟到 3:00，还剩 10 分钟。所以在 3:10 结束。\n\n检验：$45 + 25 = 70$ 分钟，就是 2:00 之后 1 小时 10 分钟。\n\n> **注意。** 2:70 不是一个时刻。分钟满 60 就要进到下一个小时。",
      ],
      (rng) => {
        const hour = rng.int(1, 10);
        const start = rng.int(20, 55);
        const length = rng.int(61 - start, 55);
        const endMinute = start + length - 60;
        return solved(
          [
            `A game starts at ${timeText(hour, start)} and lasts ${length} minutes. It ends at ${hour + 1}:$\\square$. What number of minutes goes in the box?`,
            `比赛 ${timeText(hour, start)} 开始，持续 ${length} 分钟。它在 ${hour + 1}:$\\square$ 结束。方框里的分钟数是多少？`,
          ],
          endMinute,
          [
            [
              ["Jump to the hour", "跳到整点"],
              [`From ${timeText(hour, start)} to ${timeText(hour + 1, 0)}:`, `从 ${timeText(hour, start)} 到 ${timeText(hour + 1, 0)}：`],
              [`60 - ${start} = ${60 - start}`],
            ],
            [
              ["Use the rest", "用掉剩下的"],
              ["The minutes left after the hour:", "过了整点还剩的分钟："],
              [`${length} - ${60 - start} = ${endMinute}`],
            ],
          ],
          [
            `$${start} + ${length} = ${start + length}$ minutes, which is 1 hour and ${endMinute} minutes.`,
            `$${start} + ${length} = ${start + length}$ 分钟，就是 1 小时 ${endMinute} 分钟。`,
          ],
          [
            [start + length, "That adds but forgets that 60 minutes make a new hour.", "这只相加，忘了满 60 分钟要进 1 小时。"],
            [length, "That is how long the game lasts, not when it ends.", "这是比赛持续的时间，不是结束的时刻。"],
            [60 - endMinute, "That counts the minutes still left in the hour.", "这数的是这个小时还剩下的分钟。"],
          ],
          clockFigure(hour, start),
        );
      },
      captioned(clockFigure(3, 10), "The clock at the end of the game: 3:10.", "比赛结束时的钟面：3:10。"),
    ),
  ],
  [
    "Lunch starts at 11:40 and ends at 12:15. Jump 20 minutes to 12:00, then 15 more. Lunch takes $20 + 15 = 35$ minutes.\n\nCheck: $40 + 35 = 75$ minutes, which is 1 hour and 15 minutes after 11:00.\n\nIn this lesson we find how many minutes pass between two times, and the time when something ends.",
    "午饭 11:40 开始，12:15 结束。先跳 20 分钟到 12:00，再跳 15 分钟。午饭用了 $20 + 15 = 35$ 分钟。\n\n检验：$40 + 35 = 75$ 分钟，就是 11:00 之后 1 小时 15 分钟。\n\n本课我们求两个时刻之间经过多少分钟，以及活动结束的时刻。",
  ],
);

const massAndVolume = earlyTopic(
  "grams-kilograms-and-liters",
  ["Grams, Kilograms and Liters", "克、千克和升"],
  ["Choose sensible units of mass and liquid volume, and solve problems with them.", "选择合适的质量和容积单位，并解决相关问题。"],
  [],
  ["3.MD.A.2"],
  [
    earlyPoint(
      "choosing-a-unit",
      ["Choosing a unit", "选择单位"],
      [
        "A big book weighs about 1 kilogram, so a dog is measured in kilograms. A paper clip weighs about 1 gram, so a grape is measured in grams. A big bottle holds about 1 liter, and a dropper about 1 milliliter.\n\nCheck: a dog weighs many big books, so kilograms suit it.\n\n> **Watch out.** Liters and milliliters measure how much liquid, not how heavy something is.",
        "一本大书大约重 1 千克，所以狗用千克来称。一枚回形针大约重 1 克，所以葡萄用克来称。一个大瓶子大约装 1 升，一个滴管大约装 1 毫升。\n\n检验：一只狗有好多本大书那么重，所以用千克合适。\n\n> **注意。** 升和毫升量的是液体有多少，不是东西有多重。",
      ],
      (rng) => {
        const item = rng.pick([
          { en: "a paper clip", zh: "一枚回形针", unit: "g" },
          { en: "a grape", zh: "一颗葡萄", unit: "g" },
          { en: "a pencil", zh: "一支铅笔", unit: "g" },
          { en: "a dog", zh: "一只狗", unit: "kg" },
          { en: "a bicycle", zh: "一辆自行车", unit: "kg" },
          { en: "a bag of rice", zh: "一大袋大米", unit: "kg" },
          { en: "a bathtub of water", zh: "一浴缸水", unit: "L" },
          { en: "a bucket of water", zh: "一桶水", unit: "L" },
          { en: "a spoonful of medicine", zh: "一小勺药水", unit: "mL" },
          { en: "a drop of water", zh: "一滴水", unit: "mL" },
          { en: "a coin", zh: "一枚硬币", unit: "g" },
          { en: "a feather", zh: "一根羽毛", unit: "g" },
          { en: "a slice of bread", zh: "一片面包", unit: "g" },
          { en: "an eraser", zh: "一块橡皮", unit: "g" },
          { en: "a sheet of paper", zh: "一张纸", unit: "g" },
          { en: "a grown person", zh: "一个成年人", unit: "kg" },
          { en: "a sofa", zh: "一张沙发", unit: "kg" },
          { en: "a sack of potatoes", zh: "一大袋土豆", unit: "kg" },
          { en: "a big pumpkin", zh: "一个大南瓜", unit: "kg" },
          { en: "a washing machine", zh: "一台洗衣机", unit: "kg" },
          { en: "a swimming pool of water", zh: "一游泳池水", unit: "L" },
          { en: "a fish tank of water", zh: "一鱼缸水", unit: "L" },
          { en: "a car's fuel tank", zh: "汽车油箱里的汽油", unit: "L" },
          { en: "a watering can of water", zh: "一喷壶水", unit: "L" },
          { en: "a teaspoon of vanilla", zh: "一茶匙香草精", unit: "mL" },
          { en: "a sip of juice", zh: "一小口果汁", unit: "mL" },
          { en: "the ink in a pen", zh: "一支笔里的墨水", unit: "mL" },
          { en: "a few eye drops", zh: "几滴眼药水", unit: "mL" },
        ]);
        type Unit = "g" | "kg" | "L" | "mL";
        const names: Record<Unit, Pair> = {
          g: ["grams", "克"],
          kg: ["kilograms", "千克"],
          L: ["liters", "升"],
          mL: ["milliliters", "毫升"],
        };
        const why: Record<Unit, Pair> = {
          g: ["Grams are for light things, about as heavy as a paper clip.", "克用来称轻的东西，大约一枚回形针那么重。"],
          kg: ["Kilograms are for heavy things, about as heavy as a big book or more.", "千克用来称重的东西，大约一本大书那么重或更重。"],
          L: ["Liters measure liquid, about a big bottle full.", "升量的是液体，大约一大瓶那么多。"],
          mL: ["Milliliters measure tiny amounts of liquid, about a dropper full.", "毫升量的是很少的液体，大约一滴管那么多。"],
        };
        const unit = item.unit as Unit;
        const volume = unit === "L" || unit === "mL";
        const wrongReason = (u: Unit): Pair => {
          if (!volume && (u === "L" || u === "mL"))
            return [`That measures liquid, but this asks how heavy ${item.en} is.`, `这是量液体的单位，但这里问的是${item.zh}有多重。`];
          if (volume && (u === "g" || u === "kg"))
            return ["That measures how heavy something is, but this asks how much liquid.", "这是称轻重的单位，但这里问的是液体有多少。"];
          return u === "g" || u === "mL"
            ? ["That unit is too small for this.", "这个单位太小了。"]
            : ["That unit is too big for this.", "这个单位太大了。"];
        };
        const others = (["g", "kg", "L", "mL"] as const).filter((u) => u !== unit);
        return picked(
          rng,
          volume
            ? [`Which unit is best for measuring ${item.en}?`, `测量${item.zh}，用哪个单位最合适？`]
            : [`Which unit is best for measuring how heavy ${item.en} is?`, `测量${item.zh}有多重，用哪个单位最合适？`],
          names[unit],
          others.map((u) => [names[u], ...wrongReason(u)] as const),
          [
            [
              ["Weight or liquid", "轻重还是液体"],
              volume
                ? ["This is an amount of liquid, so liters or milliliters.", "这是液体的量，所以用升或毫升。"]
                : ["This is how heavy something is, so grams or kilograms.", "这是东西的轻重，所以用克或千克。"],
            ],
            [["Big or small", "大还是小"], why[unit]],
          ],
          [
            `Compare with the helper: ${unit === "g" ? "a paper clip" : unit === "kg" ? "a big book" : unit === "L" ? "a big bottle" : "a dropper"}. ${item.en.replace(/^./, (c) => c.toUpperCase())} is measured well in ${names[unit][0]}.`,
            `和参照物比一比：${unit === "g" ? "回形针" : unit === "kg" ? "大书" : unit === "L" ? "大瓶子" : "滴管"}。${item.zh}用${names[unit][1]}合适。`,
          ],
        );
      },
      captioned(dialScaleFigure(1, 5, 1, "kg"), "A big book on a scale: the needle points to 1 kg.", "秤上放一本大书：指针指着 1 千克。"),
    ),
    earlyPoint(
      "problems-with-mass-and-volume",
      ["Problems with mass and volume", "质量和容积的问题"],
      [
        "3 bags of flour weigh 4 kg each. Equal groups multiply: $3 \\times 4 = 12$ kg. If 12 liters of juice are shared among 3 jugs, divide: $12 \\div 3 = 4$ liters each.\n\nCheck: $4 + 4 + 4 = 12$.\n\n> **Watch out.** Keep the unit. 12 alone does not say 12 kilograms.",
        "3 袋面粉，每袋 4 千克。相同的组用乘法：$3 \\times 4 = 12$ 千克。如果 12 升果汁平均倒进 3 个水壶，就用除法：$12 \\div 3 = 4$，每壶 4 升。\n\n检验：$4 + 4 + 4 = 12$。\n\n> **注意。** 答案要带单位。只写 12，说不清是 12 千克。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const heavy = rng.bool();
        return heavy
          ? solved(
              [
                `Each bag of flour has a mass of ${each} kg. What is the total mass of ${groups} bags, in kilograms?`,
                `每袋面粉的质量是 ${each} 千克。${groups} 袋的总质量是多少千克？`,
              ],
              groups * each,
              [
                [
                  ["See equal groups", "看出相同的组"],
                  [`${groups} bags of ${each} kg each.`, `${groups} 袋，每袋 ${each} 千克。`],
                ],
                [["Multiply", "相乘"], ["The total mass:", "总质量："], [`${groups} \\times ${each} = ${groups * each} \\text{ kg}`]],
              ],
              [
                `$${groups * each} \\div ${groups} = ${each}$ kg in each bag.`,
                `$${groups * each} \\div ${groups} = ${each}$，每袋 ${each} 千克。`,
              ],
              [
                [groups + each, "That adds. Equal bags multiply.", "这是相加。相同的袋要用乘法。"],
                [groups * each - each, "That is one bag too few.", "少算了一袋。"],
                [groups * each + each, "That is one bag too many.", "多算了一袋。"],
              ],
              partWholeBarFigure(Array<number>(groups).fill(each), -1),
            )
          : solved(
              [
                `${groups * each} liters of juice are poured equally into ${groups} jugs. How many liters are in each jug?`,
                `${groups * each} 升果汁平均倒进 ${groups} 个水壶。每个水壶里有多少升？`,
              ],
              each,
              [
                [
                  ["See sharing", "看出平均分"],
                  [`${groups * each} liters shared equally by ${groups} jugs.`, `${groups * each} 升平均分到 ${groups} 个水壶。`],
                ],
                [["Divide", "相除"], ["Each jug:", "每壶："], [`${groups * each} \\div ${groups} = ${each} \\text{ L}`]],
              ],
              [`$${groups} \\times ${each} = ${groups * each}$ liters.`, `$${groups} \\times ${each} = ${groups * each}$ 升。`],
              [
                [groups * each - groups, "That subtracts. Sharing equally divides.", "这是相减。平均分要用除法。"],
                [groups, "That is the number of jugs, not the liters in each.", "这是水壶的个数，不是每壶的升数。"],
                [each + 1, "That is 1 liter too many. Check by multiplying back.", "多了 1 升。乘回去检验一下。"],
              ],
            );
      },
      captioned(partWholeBarFigure([4, 4, 4], -1), "Three bags of 4 kg: 12 kg in all.", "三袋，每袋 4 千克：一共 12 千克。"),
    ),
  ],
  [
    "At the shop, Dad buys a 2 kg bag of rice and a 1 L bottle of milk. Kilograms tell how heavy the rice is, and liters tell how much milk there is.\n\nCheck: 2 kg is about as heavy as 2 big books.\n\nIn this lesson we choose units of mass and liquid volume, and solve problems with them.",
    "在商店里，爸爸买了一袋 2 千克的大米和一瓶 1 升的牛奶。千克说明大米有多重，升说明牛奶有多少。\n\n检验：2 千克大约和 2 本大书一样重。\n\n本课我们选择质量和容积的单位，并用它们解决问题。",
  ],
);

const scaledPictureGraphs = earlyTopic(
  "scaled-picture-graphs",
  ["Scaled Picture Graphs", "带比例的象形统计图"],
  ["Read a picture graph in which each picture stands for several items.", "读每个图案代表多个物品的象形统计图。"],
  ["picture-graphs-of-single-units"],
  ["3.MD.B.3"],
  [
    {
      ...earlyPoint(
        "reading-a-row",
        ["Reading a row of pictures", "读一行图案"],
        [
          "The key says each picture stands for 5. The row has 4 pictures, so it shows $4 \\times 5 = 20$.\n\nCheck: count by fives along the row: 5, 10, 15, 20.\n\n> **Watch out.** Read the key first. Counting only the pictures gives 4, not 20.",
          "图例说每个图案代表 5。这一行有 4 个图案，所以表示 $4 \\times 5 = 20$。\n\n检验：沿着这一行五个五个地数：5、10、15、20。\n\n> **注意。** 先读图例。只数图案得到 4，不是 20。",
        ],
        (rng) => {
          const per = rng.pick([2, 5, 10]);
          const values = ["A", "B", "C"].map(() => per * rng.int(1, 8));
          const row = rng.int(0, 2);
          const label = ["A", "B", "C"][row] as string;
          const answer = values[row] as number;
          const dots = answer / per;
          return solved(
            [
              `In this picture graph, each dot stands for ${per} votes. How many votes did ${label} get?`,
              `在这个象形统计图中，每个点代表 ${per} 票。${label} 得到多少票？`,
            ],
            answer,
            [
              [
                ["Count the dots", "数点"],
                [`Row ${label} has ${plural(dots, "dot")}.`, `${label} 行有 ${dots} 个点。`],
              ],
              [["Use the key", "用图例"], [`Each dot is ${per}:`, `每个点代表 ${per}：`], [`${dots} \\times ${per} = ${answer}`]],
            ],
            [`Counting by ${per}s ${dots} times reaches ${answer}.`, `${per} 个 ${per} 个地数 ${dots} 次，到 ${answer}。`],
            [
              [dots, "That counts the dots but forgets the key.", "这只数了点，忘了图例。"],
              [answer + per, "That counts one dot too many.", "多数了一个点。"],
              [answer - per, "That counts one dot too few.", "少数了一个点。"],
            ],
            pictureGraphFigure(["A", "B", "C"], values, per),
          );
        },
      ),
      figure: gradeDrawings2["scaled-picture-graphs#reading-a-row"],
    },
    {
      ...earlyPoint(
        "how-many-more-in-a-picture-graph",
        ["How many more in a picture graph", "象形统计图中多多少"],
        [
          "One row has 7 pictures and another has 4, with a key of 2. The first row has $7 - 4 = 3$ more pictures, so $3 \\times 2 = 6$ more items.\n\nCheck: $7 \\times 2 = 14$, $4 \\times 2 = 8$, and $14 - 8 = 6$.\n\n> **Watch out.** 3 is the number of extra pictures. Multiply by the key to get the items.",
          "一行有 7 个图案，另一行有 4 个，图例是 2。第一行多 $7 - 4 = 3$ 个图案，所以多 $3 \\times 2 = 6$ 个。\n\n检验：$7 \\times 2 = 14$，$4 \\times 2 = 8$，$14 - 8 = 6$。\n\n> **注意。** 3 是多出的图案个数。要乘图例中的数才是物品的个数。",
        ],
        (rng) => {
          const per = rng.pick([2, 5, 10]);
          const low = rng.int(1, 4);
          const high = low + rng.int(1, 4);
          const values = rng.bool() ? [per * low, per * high] : [per * high, per * low];
          const answer = per * (high - low);
          const more = (values[0] as number) > (values[1] as number) ? "A" : "B";
          const less = more === "A" ? "B" : "A";
          return solved(
            [
              `Each dot stands for ${per} books. How many more books did ${more} read than ${less}?`,
              `每个点代表 ${per} 本书。${more} 比 ${less} 多读了多少本？`,
            ],
            answer,
            [
              [
                ["Compare the dots", "比较点数"],
                [`${more} has ${high} dots and ${less} has ${low}:`, `${more} 有 ${high} 个点，${less} 有 ${low} 个：`],
                [`${high} - ${low} = ${high - low}`],
              ],
              [
                ["Use the key", "用图例"],
                [`Each extra dot is ${per} books:`, `每多一个点就多 ${per} 本：`],
                [`${high - low} \\times ${per} = ${answer}`],
              ],
            ],
            [
              `$${high} \\times ${per} = ${high * per}$, $${low} \\times ${per} = ${low * per}$, and $${high * per} - ${low * per} = ${answer}$.`,
              `$${high} \\times ${per} = ${high * per}$，$${low} \\times ${per} = ${low * per}$，$${high * per} - ${low * per} = ${answer}$。`,
            ],
            [
              [high - low, "That is the number of extra dots. Multiply by the key.", "这是多出的点数。要乘图例中的数。"],
              [per * high, `That is all of ${more}'s books, not how many more.`, `这是 ${more} 读的全部书，不是多的。`],
              [per * (high + low), "That adds the two rows instead of comparing them.", "这把两行加起来了，没有比较。"],
            ],
            pictureGraphFigure(["A", "B"], values, per),
          );
        },
      ),
      figure: gradeDrawings2["scaled-picture-graphs#how-many-more-in-a-picture-graph"],
    },
  ],
  [
    "The class votes for a pet. To save space, each dot on the graph stands for 2 votes. Cats have 6 dots, so cats got $6 \\times 2 = 12$ votes.\n\nCheck: count by twos: 2, 4, 6, 8, 10, 12.\n\nIn this lesson we read picture graphs where each picture stands for several items.",
    "全班投票选宠物。为了节省地方，图上每个点代表 2 票。猫有 6 个点，所以猫得了 $6 \\times 2 = 12$ 票。\n\n检验：两个两个地数：2、4、6、8、10、12。\n\n本课我们读每个图案代表多个物品的象形统计图。",
  ],
);

const scaledBarGraphs = earlyTopic(
  "scaled-bar-graphs",
  ["Scaled Bar Graphs", "带比例的条形图"],
  ["Read a bar graph whose scale counts by 2, 5 or 10, and answer questions from it.", "读刻度按 2、5 或 10 增加的条形图，并回答问题。"],
  ["scaled-picture-graphs"],
  ["3.MD.B.3"],
  [
    {
      ...earlyPoint(
        "reading-a-bar",
        ["Reading a bar", "读一个条"],
        [
          "The scale counts by fives. The first bar's top lines up with 25, so it shows 25. The second reaches 40 and the third 15.\n\nCheck: the first bar is 5 lines tall, and $5 \\times 5 = 25$.\n\n> **Watch out.** Read the number on the scale, not the number of lines. 5 lines here mean 25.",
          "刻度按 5 增加。第一个条的顶端对着 25，所以表示 25。第二个到 40，第三个到 15。\n\n检验：第一个条有 5 格高，$5 \\times 5 = 25$。\n\n> **注意。** 要读刻度上的数，不是格数。这里 5 格表示 25。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10]);
          const values = [0, 1, 2, 3].map(() => step * rng.int(1, 8));
          const i = rng.int(0, 3);
          const labels = ["A", "B", "C", "D"];
          const value = values[i] as number;
          return solved(
            [`What is the value of bar ${labels[i]} in this graph?`, `这个图中条 ${labels[i]} 的值是多少？`],
            value,
            [
              [
                ["Read the scale", "看刻度"],
                [`Each line is worth ${step}.`, `每格代表 ${step}。`],
              ],
              [
                ["Look across", "横着看"],
                [`The top of bar ${labels[i]} lines up with ${value}.`, `条 ${labels[i]} 的顶端对着 ${value}。`],
              ],
            ],
            [
              `Bar ${labels[i]} is ${value / step} lines tall, and $${value / step} \\times ${step} = ${value}$.`,
              `条 ${labels[i]} 有 ${value / step} 格高，$${value / step} \\times ${step} = ${value}$。`,
            ],
            [
              [value / step, "That counts the lines, not the value on the scale.", "这数的是格数，不是刻度上的值。"],
              [value + step, "That reads one line too high.", "读高了一格。"],
              [value - step, "That reads one line too low.", "读低了一格。"],
            ],
            barGraphFigure(labels, values, step),
          );
        },
      ),
      figure: gradeDrawings2["scaled-bar-graphs#reading-a-bar"],
    },
    {
      ...earlyPoint(
        "total-and-difference-from-a-bar-graph",
        ["Totals and differences from a bar graph", "由条形图求总数和差"],
        [
          "Two bars show 30 and 50 on a scale by tens. How many more? $50 - 30 = 20$. How many altogether? $30 + 50 = 80$.\n\nCheck: $30 + 20 = 50$.\n\n> **Watch out.** Write down each reading first, then add or subtract the readings, not the numbers of lines.",
          "两个条在按 10 增加的刻度上，分别是 30 和 50。多多少？$50 - 30 = 20$。一共多少？$30 + 50 = 80$。\n\n检验：$30 + 20 = 50$。\n\n> **注意。** 先写下每个读数，再把读数相加或相减，不要用格数来算。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10]);
          const values = [0, 1, 2].map(() => step * rng.int(1, 8));
          const labels = ["A", "B", "C"];
          const [a, b, c] = values as [number, number, number];
          const sum = rng.bool() || a === b;
          const answer = sum ? a + b + c : Math.max(a, b) - Math.min(a, b);
          return solved(
            sum
              ? ["What is the total of all three bars?", "三个条的总和是多少？"]
              : ["What is the difference between bars A and B?", "条 A 和条 B 相差多少？"],
            answer,
            sum
              ? [
                  [
                    ["Read the bars", "读每个条"],
                    [`A is ${a}, B is ${b} and C is ${c}.`, `A 是 ${a}，B 是 ${b}，C 是 ${c}。`],
                  ],
                  [["Add", "相加"], ["The total:", "总和："], [`${a} + ${b} + ${c} = ${answer}`]],
                ]
              : [
                  [
                    ["Read the bars", "读每个条"],
                    [`A is ${a} and B is ${b}.`, `A 是 ${a}，B 是 ${b}。`],
                  ],
                  [
                    ["Subtract", "相减"],
                    ["The larger minus the smaller:", "大的减小的："],
                    [`${Math.max(a, b)} - ${Math.min(a, b)} = ${answer}`],
                  ],
                ],
            sum
              ? [`$${answer} - ${c} = ${a + b}$, which is $${a} + ${b}$.`, `$${answer} - ${c} = ${a + b}$，正是 $${a} + ${b}$。`]
              : [`$${Math.min(a, b)} + ${answer} = ${Math.max(a, b)}$.`, `$${Math.min(a, b)} + ${answer} = ${Math.max(a, b)}$。`],
            sum
              ? [
                  [a + b, "That leaves out bar C.", "这漏掉了条 C。"],
                  [answer / step, "That adds the numbers of lines, not the values.", "这把格数加起来了，不是值。"],
                  [answer + step, "That misreads one bar by a line.", "有一个条读错了一格。"],
                ]
              : [
                  [a + b, "That adds the bars instead of finding the difference.", "这是把两个条相加，不是求差。"],
                  [answer / step, "That counts the lines between the tops, not the values.", "这数的是两个顶端之间的格数，不是值。"],
                  [answer + step, "That misreads one bar by a line.", "有一个条读错了一格。"],
                ],
            barGraphFigure(labels, values, step),
          );
        },
      ),
      figure: gradeDrawings2["scaled-bar-graphs#total-and-difference-from-a-bar-graph"],
    },
  ],
  [
    "A bar graph shows the books read by three classes. The scale counts by tens, so a bar reaching the fifth line means 50 books.\n\nCheck: $5 \\times 10 = 50$.\n\nIn this lesson we read bar graphs whose scale counts by 2, 5 or 10, and answer questions from them.",
    "一个条形图表示三个班读的书。刻度按 10 增加，所以到第 5 条线的条表示 50 本。\n\n检验：$5 \\times 10 = 50$。\n\n本课我们读刻度按 2、5 或 10 增加的条形图，并回答问题。",
  ],
);

/** ribbonPlot draws a line plot of ribbon lengths from 3 to 8 inches. */
function ribbonPlot(values: readonly number[]): Figure {
  return {
    svg: dotPlot(values, { min: 3, max: 8, step: 1 }),
    alt: t(
      `A line plot of ribbon lengths from 3 to 8 inches, with one dot at each of: ${values.join(", ")}.`,
      `丝带长度的线图，从 3 到 8 英寸，点分别在：${values.join("、")}。`,
    ),
  };
}

const linePlotsEarly = earlyTopic(
  "line-plots-of-measurements",
  ["Line Plots of Measurements", "测量数据的线图"],
  ["Read a line plot showing lengths measured to the nearest whole unit.", "读表示测量长度（取到整数单位）的线图。"],
  ["scaled-bar-graphs"],
  ["3.MD.B.4"],
  [
    {
      ...earlyPoint(
        "counting-the-marks-above-a-length",
        ["Counting the marks above a length", "数某个长度上方的点"],
        [
          "This line plot shows lengths from 5 to 8. Above 6 there is a stack of 4 marks, so 4 things were 6 units long.\n\nCheck: the stacks are 2, 4, 1 and 3, and $2 + 4 + 1 + 3 = 10$ things in all.\n\n> **Watch out.** The number under a stack is the length. The marks above it are how many.",
          "这个线图表示从 5 到 8 的长度。6 上方有一摞 4 个点，所以有 4 个东西长 6 个单位。\n\n检验：每摞分别是 2、4、1、3 个点，$2 + 4 + 1 + 3 = 10$，一共 10 个。\n\n> **注意。** 一摞点下面的数是长度。上面的点数才是有几个。",
        ],
        (rng) => {
          const values = [...Array(rng.int(7, 12)).keys()].map(() => rng.int(3, 8));
          const v = rng.pick(values);
          const answer = values.filter((x) => x === v).length;
          return solved(
            [
              `This line plot shows the lengths of some ribbons, in inches. How many ribbons are ${v} inches long?`,
              `这个线图表示一些丝带的长度（英寸）。长度为 ${v} 英寸的丝带有多少条？`,
            ],
            answer,
            [
              [
                ["Find the length", "找到长度"],
                [`Find ${v} on the number line.`, `在数轴上找到 ${v}。`],
              ],
              [
                ["Count the marks", "数点"],
                [
                  `There ${answer === 1 ? "is 1 mark" : `are ${answer} marks`} above ${v}, one for each ribbon.`,
                  `${v} 上方有 ${answer} 个点，每个点是一条丝带。`,
                ],
              ],
            ],
            [
              `All the stacks add up to ${values.length} ribbons, and ${values.length - answer} of them are not ${v} inches.`,
              `所有的点加起来是 ${values.length} 条丝带，其中 ${values.length - answer} 条不是 ${v} 英寸。`,
            ],
            [
              [v, "That is the length, not the number of ribbons.", "这是长度，不是丝带的条数。"],
              [values.length, "That counts every ribbon, not only those of this length.", "这数了所有的丝带，不只是这个长度的。"],
              [values.length - answer, "That counts the ribbons of other lengths.", "这数的是其他长度的丝带。"],
            ],
            ribbonPlot(values),
          );
        },
      ),
      figure: gradeDrawings2["line-plots-of-measurements#counting-the-marks-above-a-length"],
    },
    earlyPoint(
      "how-many-measured-in-all",
      ["How many were measured in all", "一共测量了多少个"],
      [
        "This plot has 1 mark at 4, 3 at 5, 2 at 6 and 2 at 7. Each mark is one ribbon, so $1 + 3 + 2 + 2 = 8$ ribbons were measured. Longer than 5 inches means the marks at 6 and 7: $2 + 2 = 4$.\n\nCheck: count every mark one by one: 8.\n\n> **Watch out.** Add the marks, not the lengths under them.",
        "这个线图在 4 上有 1 个点，5 上有 3 个，6 上有 2 个，7 上有 2 个。每个点是一条丝带，所以一共测量了 $1 + 3 + 2 + 2 = 8$ 条。超过 5 英寸的是 6 和 7 上的点：$2 + 2 = 4$ 条。\n\n检验：一个一个地数所有的点：8 个。\n\n> **注意。** 要把点数加起来，不是把下面的长度加起来。",
      ],
      (rng) => {
        const values = [...Array(rng.int(7, 14)).keys()].map(() => rng.int(3, 8));
        const cut = rng.int(4, 6);
        const all = rng.bool();
        const counts = [3, 4, 5, 6, 7, 8].map((v) => values.filter((x) => x === v).length);
        const above = [3, 4, 5, 6, 7, 8].filter((v) => v > cut);
        const aboveCounts = above.map((v) => values.filter((x) => x === v).length);
        const answer = all ? values.length : values.filter((x) => x > cut).length;
        return solved(
          all
            ? [
                "This line plot shows the lengths of some ribbons, in inches. How many ribbons were measured?",
                "这个线图表示一些丝带的长度（英寸）。一共测量了多少条丝带？",
              ]
            : [
                `This line plot shows the lengths of some ribbons, in inches. How many ribbons are longer than ${cut} inches?`,
                `这个线图表示一些丝带的长度（英寸）。长度超过 ${cut} 英寸的丝带有多少条？`,
              ],
          answer,
          all
            ? [
                [
                  ["Count each stack", "数每一摞"],
                  ["From 3 to 8 inches, the stacks have:", "从 3 到 8 英寸，每摞的点数："],
                  [counts.join(",\\ ")],
                ],
                [
                  ["Add the stacks", "把各摞相加"],
                  ["Each mark is one ribbon:", "每个点是一条丝带："],
                  [`${counts.join(" + ")} = ${answer}`],
                ],
              ]
            : [
                [
                  ["Find the stacks", "找到要数的摞"],
                  [`Longer than ${cut} means ${above.join(", ")} inches.`, `超过 ${cut} 英寸是 ${above.join("、")} 英寸。`],
                ],
                [
                  ["Add those stacks", "把这几摞相加"],
                  ["Each mark is one ribbon:", "每个点是一条丝带："],
                  [`${aboveCounts.join(" + ")} = ${answer}`],
                ],
              ],
          all
            ? [`Counting the marks one by one also gives ${answer}.`, `一个一个地数点，也是 ${answer} 个。`]
            : [
                `The other ${values.length - answer} ribbons are ${cut} inches or shorter, and $${answer} + ${values.length - answer} = ${values.length}$.`,
                `另外 ${values.length - answer} 条是 ${cut} 英寸或更短，$${answer} + ${values.length - answer} = ${values.length}$。`,
              ],
          all
            ? [
                [values.length - 1, "That misses one mark.", "漏数了一个点。"],
                [values.length + 1, "That counts one mark twice.", "有一个点数了两次。"],
                [6, "That counts the lengths on the line, not the marks.", "这数的是数轴上的长度，不是点。"],
              ]
            : [
                [
                  values.filter((x) => x === cut).length,
                  `That counts the ribbons exactly ${cut} inches long.`,
                  `这数的是正好 ${cut} 英寸的丝带。`,
                ],
                [
                  values.filter((x) => x >= cut).length,
                  `That also counts the ribbons exactly ${cut} inches, which are not longer.`,
                  `这把正好 ${cut} 英寸的也算进去了，它们并不更长。`,
                ],
                [values.filter((x) => x < cut).length, "That counts the shorter ribbons.", "这数的是较短的丝带。"],
              ],
          ribbonPlot(values),
        );
      },
      captioned(
        ribbonPlot([4, 5, 5, 5, 6, 6, 7, 7]),
        "A line plot with 1 mark at 4, 3 at 5, 2 at 6 and 2 at 7: 8 ribbons.",
        "一个线图：4 上 1 个点，5 上 3 个，6 上 2 个，7 上 2 个：8 条丝带。",
      ),
    ),
  ],
  [
    "The class measures their pencils to the nearest inch and puts one mark above the length on a number line for each pencil. The tallest stack shows the most common length.\n\nCheck: the number of marks equals the number of pencils.\n\nIn this lesson we read line plots of lengths measured to the nearest whole unit.",
    "全班把铅笔量到整英寸，每支铅笔就在数轴上相应长度的上方画一个点。最高的一摞就是最常见的长度。\n\n检验：点的个数等于铅笔的支数。\n\n本课我们读测量长度（取到整数单位）的线图。",
  ],
);

const areaWithUnitSquares = earlyTopic(
  "area-with-unit-squares",
  ["Area With Unit Squares", "用单位正方形表示面积"],
  [
    "Measure area by counting unit squares that cover a shape without gaps or overlaps.",
    "用单位正方形不留空隙、不重叠地铺满图形，数出面积。",
  ],
  ["rows-and-columns-of-squares"],
  ["3.MD.C.5", "3.MD.C.6"],
  [
    earlyPoint(
      "counting-square-units",
      ["Counting square units", "数平方单位"],
      [
        "Each small square is 1 square centimeter. The shaded part covers 7 of them, with no gaps and no overlaps, so its area is 7 square centimeters.\n\nCheck: the grid has 12 squares, and 5 are not shaded: $12 - 5 = 7$.\n\n> **Watch out.** Count the squares inside, not the sides around the edge. That would be perimeter.",
        "每个小正方形是 1 平方厘米。涂色部分盖住了其中 7 个，不留空隙也不重叠，所以面积是 7 平方厘米。\n\n检验：方格一共 12 个，没涂色的有 5 个：$12 - 5 = 7$。\n\n> **注意。** 要数里面的方格，不是数边上的线段。那是周长。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const columns = rng.int(2, 9);
        const shaded = rng.int(rows, rows * columns);
        const all = rows * columns;
        return solved(
          [
            "Each small square is 1 square centimeter. What is the area of the shaded part, in square centimeters?",
            "每个小正方形是 1 平方厘米。涂色部分的面积是多少平方厘米？",
          ],
          shaded,
          [
            [
              ["Know the unit", "认识单位"],
              ["Each small square is 1 square centimeter.", "每个小正方形是 1 平方厘米。"],
            ],
            [
              ["Count the shaded squares", "数涂色的方格"],
              [
                `${shaded} squares are shaded, so the area is ${shaded} square centimeters.`,
                `涂色的有 ${shaded} 个，所以面积是 ${shaded} 平方厘米。`,
              ],
            ],
          ],
          shaded === all
            ? [
                `All ${rows} rows of ${columns} are shaded: $${rows} \\times ${columns} = ${all}$.`,
                `${rows} 行、每行 ${columns} 个全涂了：$${rows} \\times ${columns} = ${all}$。`,
              ]
            : [
                `The grid has $${rows} \\times ${columns} = ${all}$ squares, and ${all - shaded} are not shaded: $${all} - ${all - shaded} = ${shaded}$.`,
                `方格一共 $${rows} \\times ${columns} = ${all}$ 个，没涂色的 ${all - shaded} 个：$${all} - ${all - shaded} = ${shaded}$。`,
              ],
          [
            [rows + columns, "That adds a row and a column instead of counting the squares.", "这把行数和列数加起来了，没有数方格。"],
            [all, "That counts every square, shaded or not.", "这把所有的方格都数了，不管涂没涂色。"],
            [2 * (rows + columns), "That is the distance around the grid, its perimeter.", "这是绕方格一周的长度，是周长。"],
          ],
          gridFigure(rows, columns, shaded),
        );
      },
      captioned(
        gridFigure(3, 4, 7),
        "A grid of 12 unit squares with 7 shaded: 7 square centimeters.",
        "12 个单位正方形的方格，涂了 7 个：7 平方厘米。",
      ),
    ),
    {
      ...earlyPoint(
        "rows-of-unit-squares",
        ["Rows of unit squares", "成行的单位正方形"],
        [
          "This rectangle is covered by 4 rows of 6 unit squares. Each row has the same number, so the area is $4 \\times 6 = 24$ square units.\n\nCheck: count by sixes row by row: 6, 12, 18, 24.\n\n> **Watch out.** Multiply the rows by the squares in a row. $4 + 6 = 10$ adds them instead.",
          "这个长方形铺了 4 行单位正方形，每行 6 个。每行一样多，所以面积是 $4 \\times 6 = 24$ 平方单位。\n\n检验：一行一行地六个六个数：6、12、18、24。\n\n> **注意。** 要用行数乘每行的个数。$4 + 6 = 10$ 是相加，不对。",
        ],
        (rng) => {
          const rows = rng.int(2, 8);
          const columns = rng.int(2, 9);
          const answer = rows * columns;
          return solved(
            ["What is the area of this rectangle, in square units?", "这个长方形的面积是多少平方单位？"],
            answer,
            [
              [
                ["Count rows and columns", "数行和列"],
                [`There are ${rows} rows of ${columns} squares.`, `有 ${rows} 行，每行 ${columns} 个。`],
              ],
              [["Multiply", "相乘"], ["Rows times squares in a row:", "行数乘每行的个数："], [`${rows} \\times ${columns} = ${answer}`]],
            ],
            [
              `Count by ${columns}s, row by row, ${rows} times: ${Array.from({ length: rows }, (_, i) => columns * (i + 1)).join(", ")}.`,
              `一行一行地数 ${rows} 次，每次 ${columns} 个：${Array.from({ length: rows }, (_, i) => columns * (i + 1)).join("、")}。`,
            ],
            [
              [rows + columns, "That adds the rows and the columns. Multiply them.", "这把行数和列数加起来了。要相乘。"],
              [2 * (rows + columns), "That is the perimeter, the distance around.", "这是周长，是绕一圈的长度。"],
              [answer - columns, "That misses one row.", "漏了一行。"],
            ],
            gridFigure(rows, columns),
          );
        },
      ),
      figure: gradeDrawings["rows-of-unit-squares"],
    },
  ],
  [
    "Mia covers her desk with sticky notes, all the same square size, leaving no gaps. She uses 24 notes, so the desk's area is 24 notes.\n\nCheck: 4 rows of 6 notes make $4 \\times 6 = 24$.\n\nIn this lesson we measure area by counting unit squares that cover a shape.",
    "Mia 用同样大的正方形便利贴铺满书桌，不留空隙。她用了 24 张，所以书桌的面积是 24 张便利贴那么大。\n\n检验：4 行，每行 6 张，$4 \\times 6 = 24$。\n\n本课我们用单位正方形铺满图形，数出面积。",
  ],
);

const areaOfRectangles = earlyTopic(
  "area-of-a-rectangle-by-multiplying",
  ["Area of a Rectangle by Multiplying", "用乘法求长方形的面积"],
  [
    "Multiply side lengths to find the area of a rectangle, and find a missing side from the area.",
    "用边长相乘求长方形面积，并由面积求未知的边。",
  ],
  ["area-with-unit-squares"],
  ["3.MD.C.7"],
  [
    {
      ...earlyPoint(
        "multiplying-the-side-lengths",
        ["Multiplying the side lengths", "边长相乘"],
        [
          "A rectangle is 6 meters by 4 meters. 4 rows of 6 square meters would fit, so the area is $6 \\times 4 = 24$ square meters.\n\nCheck: $4 \\times 6 = 24$ too, in either order.\n\n> **Watch out.** Adding the sides gives perimeter, not area. Area multiplies.",
          "一个长方形长 6 米、宽 4 米。可以放 4 行、每行 6 个 1 平方米的正方形，所以面积是 $6 \\times 4 = 24$ 平方米。\n\n检验：换个顺序 $4 \\times 6 = 24$ 也一样。\n\n> **注意。** 把边相加得到的是周长，不是面积。面积要相乘。",
        ],
        (rng) => {
          const width = rng.int(2, 12);
          const height = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => v !== width));
          const answer = width * height;
          return solved(
            ["What is the area of this rectangle, in square centimeters?", "这个长方形的面积是多少平方厘米？"],
            answer,
            [
              [
                ["Read the sides", "读边长"],
                [`The sides are ${width} cm and ${height} cm.`, `两条边是 ${width} 厘米和 ${height} 厘米。`],
              ],
              [["Multiply", "相乘"], ["Length times width:", "长乘宽："], [`${width} \\times ${height} = ${answer}`]],
            ],
            [
              `${height} rows of ${width} unit squares: $${height} \\times ${width} = ${answer}$.`,
              `${height} 行，每行 ${width} 个单位正方形：$${height} \\times ${width} = ${answer}$。`,
            ],
            [
              [width + height, "That adds two sides instead of multiplying.", "这把两条边相加了，应该相乘。"],
              [2 * (width + height), "That is the perimeter, not the area.", "这是周长，不是面积。"],
              [answer + width, "That counts one row of squares too many.", "多算了一行正方形。"],
            ],
            labeledRectangleFigure(width, height, "cm"),
          );
        },
      ),
      figure: gradeDrawings2["area-of-a-rectangle-by-multiplying#multiplying-the-side-lengths"],
    },
    {
      ...earlyPoint(
        "a-side-from-the-area",
        ["A side from the area", "由面积求边"],
        [
          "A rectangle has area 28 square centimeters and one side 7 centimeters. $7 \\times \\square = 28$, so divide: $28 \\div 7 = 4$ centimeters.\n\nCheck: $7 \\times 4 = 28$.\n\n> **Watch out.** Do not subtract the side from the area. $28 - 7 = 21$ mixes area and length.",
          "一个长方形的面积是 28 平方厘米，一条边是 7 厘米。$7 \\times \\square = 28$，所以用除法：$28 \\div 7 = 4$ 厘米。\n\n检验：$7 \\times 4 = 28$。\n\n> **注意。** 不能用面积减边长。$28 - 7 = 21$ 把面积和长度混在一起了。",
        ],
        (rng) => {
          const width = rng.int(2, 12);
          const height = rng.int(2, 10);
          const area = width * height;
          return solved(
            [
              `A rectangle has an area of ${area} square meters. One side is ${width} meters long. How long is the other side, in meters?`,
              `一个长方形的面积是 ${area} 平方米。一条边长 ${width} 米。另一条边长多少米？`,
            ],
            height,
            [
              [
                ["Write the fact", "写出算式"],
                ["The two sides multiply to the area:", "两条边的积是面积："],
                [`${width} \\times \\square = ${area}`],
              ],
              [["Divide", "相除"], ["The missing factor:", "求缺的因数："], [`${area} \\div ${width} = ${height}`]],
            ],
            [`$${width} \\times ${height} = ${area}$ square meters.`, `$${width} \\times ${height} = ${area}$ 平方米。`],
            [
              [area - width, "That subtracts a length from an area. Divide instead.", "这是用面积减长度。应该用除法。"],
              [area + width, "That adds a length to an area. Divide instead.", "这是把长度加到面积上。应该用除法。"],
              [area, "That is the area, not a side.", "这是面积，不是边长。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-a-rectangle-by-multiplying#a-side-from-the-area"],
    },
  ],
  [
    "A rug is 3 meters long and 2 meters wide. Instead of laying out square-meter tiles to count, we see 2 rows of 3 and multiply: $3 \\times 2 = 6$ square meters.\n\nCheck: count the tiles: 1, 2, 3, 4, 5, 6.\n\nIn this lesson we multiply side lengths to find the area of a rectangle, and find a missing side from the area.",
    "一块地毯长 3 米、宽 2 米。不用铺 1 平方米的方块来数，看出 2 行、每行 3 个，相乘：$3 \\times 2 = 6$ 平方米。\n\n检验：数一数方块：1、2、3、4、5、6。\n\n本课我们用边长相乘求长方形的面积，并由面积求未知的边。",
  ],
);

const areaOfCombinedShapes = earlyTopic(
  "area-of-combined-rectangles",
  ["Area of Combined Rectangles", "组合长方形的面积"],
  ["Split a shape into rectangles, find each area, and add them.", "把图形分成几个长方形，分别求面积再相加。"],
  ["area-of-a-rectangle-by-multiplying", "splitting-a-factor-to-multiply"],
  ["3.MD.C.7"],
  [
    {
      ...earlyPoint(
        "adding-two-rectangles",
        ["Adding two rectangles", "两个长方形相加"],
        [
          "An L-shaped room splits into a 3 by 6 rectangle and a 5 by 3 rectangle. Their areas are $3 \\times 6 = 18$ and $5 \\times 3 = 15$, so the room is $18 + 15 = 33$ square meters.\n\nCheck: $33 - 15 = 18$, the first part.\n\n> **Watch out.** Find each area first, then add. Adding all the side lengths does not give area.",
          "一个 L 形的房间可以分成 3 乘 6 和 5 乘 3 两个长方形。面积分别是 $3 \\times 6 = 18$ 和 $5 \\times 3 = 15$，所以房间是 $18 + 15 = 33$ 平方米。\n\n检验：$33 - 15 = 18$，正是第一部分。\n\n> **注意。** 先分别求面积，再相加。把所有边长加起来得不到面积。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const c = rng.int(2, 9);
          const d = rng.int(2, 9);
          const answer = a * b + c * d;
          return solved(
            [
              `A room is made of two rectangles that do not overlap. One is ${a} m by ${b} m, and the other is ${c} m by ${d} m. What is the total area, in square meters?`,
              `一个房间由两个不重叠的长方形组成。一个是 ${a} 米乘 ${b} 米，另一个是 ${c} 米乘 ${d} 米。总面积是多少平方米？`,
            ],
            answer,
            [
              [
                ["Find each area", "分别求面积"],
                ["Multiply the sides of each rectangle:", "每个长方形的边相乘："],
                [`${a} \\times ${b} = ${a * b}`, `${c} \\times ${d} = ${c * d}`],
              ],
              [["Add", "相加"], ["The two parts make the room:", "两部分合起来是整个房间："], [`${a * b} + ${c * d} = ${answer}`]],
            ],
            [`$${answer} - ${c * d} = ${a * b}$, the first part.`, `$${answer} - ${c * d} = ${a * b}$，正是第一部分。`],
            [
              [a + b + c + d, "That adds the side lengths. Multiply each pair, then add.", "这把边长加起来了。要每组相乘再相加。"],
              [a * b * c * d, "That multiplies the two areas. Add them.", "这把两个面积相乘了。要相加。"],
              [(a + c) * (b + d), "That makes one big rectangle, which covers more than the room.", "这当成了一个大长方形，比房间大。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-combined-rectangles#adding-two-rectangles"],
    },
    {
      ...earlyPoint(
        "the-area-left-after-a-cut-out",
        ["The area left after a cut-out", "挖去后剩下的面积"],
        [
          "A rectangle is 8 by 6, with a 3 by 2 piece missing. The full rectangle is $8 \\times 6 = 48$, and the missing piece is $3 \\times 2 = 6$. So $48 - 6 = 42$ is left.\n\nCheck: $42 + 6 = 48$.\n\n> **Watch out.** Subtract the missing area, not its sides. $48 - 3 - 2$ is wrong.",
          "一个 8 乘 6 的长方形缺了一块 3 乘 2 的。完整的长方形是 $8 \\times 6 = 48$，缺的一块是 $3 \\times 2 = 6$。所以剩下 $48 - 6 = 42$。\n\n检验：$42 + 6 = 48$。\n\n> **注意。** 要减去缺的那块的面积，不是它的边长。$48 - 3 - 2$ 是错的。",
        ],
        (rng) => {
          const a = rng.int(5, 12);
          const b = rng.int(5, 10);
          const c = rng.int(2, a - 2);
          const d = rng.int(2, b - 2);
          const answer = a * b - c * d;
          return solved(
            [
              `A garden is ${a} m by ${b} m. A pond inside it is ${c} m by ${d} m. What area of the garden is left for planting, in square meters?`,
              `一个花园是 ${a} 米乘 ${b} 米，里面有一个 ${c} 米乘 ${d} 米的池塘。花园里可以种花的面积是多少平方米？`,
            ],
            answer,
            [
              [
                ["Find both areas", "求两个面积"],
                ["The garden and the pond:", "花园和池塘："],
                [`${a} \\times ${b} = ${a * b}`, `${c} \\times ${d} = ${c * d}`],
              ],
              [["Subtract", "相减"], ["Take the pond away:", "减去池塘："], [`${a * b} - ${c * d} = ${answer}`]],
            ],
            [`$${answer} + ${c * d} = ${a * b}$, the whole garden.`, `$${answer} + ${c * d} = ${a * b}$，正是整个花园。`],
            [
              [a * b, "That forgets to take the pond away.", "这忘了减去池塘。"],
              [c * d, "That is the area of the pond, not what is left.", "这是池塘的面积，不是剩下的。"],
              [(a - c) * (b - d), "That cuts off whole strips, which takes away too much.", "这切掉了整条，减得太多了。"],
              [a * b - c - d, "That subtracts the pond's sides, not its area.", "这减的是池塘的边长，不是面积。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-combined-rectangles#the-area-left-after-a-cut-out"],
    },
  ],
  [
    "Grandma's kitchen is shaped like an L. We cut it into two rectangles, find each area, and add: 18 and 15 square meters make 33.\n\nCheck: $33 - 15 = 18$.\n\nIn this lesson we split a shape into rectangles, find each area, and add or subtract them.",
    "奶奶家的厨房是 L 形的。我们把它切成两个长方形，分别求面积再相加：18 平方米和 15 平方米，合起来是 33 平方米。\n\n检验：$33 - 15 = 18$。\n\n本课我们把图形分成几个长方形，分别求面积，再相加或相减。",
  ],
);

const perimeterOfPolygons = earlyTopic(
  "perimeter-of-polygons",
  ["Perimeter of Polygons", "多边形的周长"],
  ["Add the side lengths to find a perimeter, and find a missing side from the perimeter.", "把各边长相加求周长，并由周长求未知的边。"],
  ["adding-within-1000"],
  ["3.MD.D.8"],
  [
    {
      ...earlyPoint(
        "adding-the-sides",
        ["Adding the sides", "把各边相加"],
        [
          "A rectangle has sides 7, 3, 7 and 3 centimeters. Walk all the way around and add: $7 + 3 + 7 + 3 = 20$ centimeters.\n\nCheck: two lengths and two widths: $2 \\times 7 + 2 \\times 3 = 14 + 6 = 20$.\n\n> **Watch out.** A rectangle has four sides even when only two lengths are written. $7 + 3 = 10$ is only half the way.",
          "一个长方形的四条边是 7、3、7、3 厘米。沿着走一圈，把它们加起来：$7 + 3 + 7 + 3 = 20$ 厘米。\n\n检验：两个长加两个宽：$2 \\times 7 + 2 \\times 3 = 14 + 6 = 20$。\n\n> **注意。** 长方形有四条边，即使只写了两个长度。$7 + 3 = 10$ 只走了一半。",
        ],
        (rng) => {
          const rectangle = rng.bool();
          const width = rng.int(2, 25);
          const height = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== width));
          const sides = [rng.int(3, 20), rng.int(3, 20), rng.int(3, 20), rng.int(3, 20), rng.int(3, 20)];
          const sum = sides.reduce((total, v) => total + v, 0);
          const first = sides[0] as number;
          const perimeter = 2 * (width + height);
          return rectangle
            ? solved(
                ["What is the perimeter of this rectangle, in centimeters?", "这个长方形的周长是多少厘米？"],
                perimeter,
                [
                  [
                    ["List all four sides", "列出四条边"],
                    [
                      `Opposite sides are equal: ${width}, ${height}, ${width} and ${height}.`,
                      `对边相等：${width}、${height}、${width} 和 ${height}。`,
                    ],
                  ],
                  [
                    ["Add them", "相加"],
                    ["All the way around:", "绕一圈："],
                    [`${width} + ${height} + ${width} + ${height} = ${perimeter}`],
                  ],
                ],
                [
                  `$2 \\times ${width} + 2 \\times ${height} = ${2 * width} + ${2 * height} = ${perimeter}$.`,
                  `$2 \\times ${width} + 2 \\times ${height} = ${2 * width} + ${2 * height} = ${perimeter}$。`,
                ],
                [
                  [width + height, "That adds only two sides, half the way around.", "这只加了两条边，只走了半圈。"],
                  [width * height, "That multiplies, which gives the area.", "这是相乘，得到的是面积。"],
                  [2 * width + height, "That misses one side.", "漏了一条边。"],
                ],
                labeledRectangleFigure(width, height, "cm"),
              )
            : solved(
                [
                  `A park has five sides, of lengths ${sides.join(" m, ")} m. What is its perimeter, in meters?`,
                  `一个公园有五条边，长度分别是 ${sides.join(" 米、")} 米。它的周长是多少米？`,
                ],
                sum,
                [
                  [
                    ["Count the sides", "数边"],
                    ["There are five sides, and every one is used once.", "有五条边，每条都要算一次。"],
                  ],
                  [["Add them", "相加"], ["All the way around:", "绕一圈："], [`${sides.join(" + ")} = ${sum}`]],
                ],
                [
                  `Add in another order: $${[...sides].reverse().join(" + ")} = ${sum}$.`,
                  `换个顺序加：$${[...sides].reverse().join(" + ")} = ${sum}$。`,
                ],
                [
                  [sum - first, "That misses one side.", "漏了一条边。"],
                  [sum + first, "That counts one side twice.", "有一条边算了两次。"],
                ],
              );
        },
      ),
      figure: gradeDrawings2["perimeter-of-polygons#adding-the-sides"],
    },
    {
      ...earlyPoint(
        "a-missing-side-from-the-perimeter",
        ["A missing side from the perimeter", "由周长求未知的边"],
        [
          "A shape with four sides has perimeter 19, and three sides are 6, 3 and 6. The known sides add up to $6 + 3 + 6 = 15$, so the missing side is $19 - 15 = 4$.\n\nCheck: $6 + 3 + 6 + 4 = 19$.\n\n> **Watch out.** Subtract the sum of all the known sides, not just one of them.",
          "一个四边形的周长是 19，其中三条边是 6、3、6。已知的边加起来是 $6 + 3 + 6 = 15$，所以未知的边是 $19 - 15 = 4$。\n\n检验：$6 + 3 + 6 + 4 = 19$。\n\n> **注意。** 要减去所有已知边的和，不是只减一条。",
        ],
        (rng) => {
          const rectangle = rng.bool();
          if (rectangle) {
            const width = rng.int(3, 25);
            const height = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== width));
            const perimeter = 2 * (width + height);
            const half = width + height;
            return solved(
              [
                `A rectangle has a perimeter of ${perimeter} cm, and one side is ${width} cm long. How long is the side next to it, in centimeters?`,
                `一个长方形的周长是 ${perimeter} 厘米，一条边长 ${width} 厘米。与它相邻的边长多少厘米？`,
              ],
              height,
              [
                [
                  ["Take half", "取一半"],
                  ["Half the perimeter is one length and one width:", "周长的一半是一个长加一个宽："],
                  [`${perimeter} \\div 2 = ${half}`],
                ],
                [["Subtract the known side", "减去已知的边"], ["The other side:", "另一条边："], [`${half} - ${width} = ${height}`]],
              ],
              [
                `$${width} + ${height} + ${width} + ${height} = ${perimeter}$.`,
                `$${width} + ${height} + ${width} + ${height} = ${perimeter}$。`,
              ],
              [
                [perimeter - width, "That takes away only one side. There are two of each.", "这只减了一条边。长和宽各有两条。"],
                [perimeter - 2 * width, "That is both of the other sides together. Halve it.", "这是另外两条边的和，还要除以 2。"],
                [width, "That is the side already given.", "这是已经给出的边。"],
              ],
            );
          }
          const known = [rng.int(3, 20), rng.int(3, 20), rng.int(3, 20)];
          const answer = rng.int(3, 20);
          const knownSum = known.reduce((total, v) => total + v, 0);
          const perimeter = knownSum + answer;
          return solved(
            [
              `A shape with four sides has a perimeter of ${perimeter} m. Three of its sides are ${known.join(" m, ")} m. How long is the fourth side, in meters?`,
              `一个四边形的周长是 ${perimeter} 米。其中三条边是 ${known.join(" 米、")} 米。第四条边长多少米？`,
            ],
            answer,
            [
              [["Add the known sides", "把已知的边相加"], ["The three sides:", "三条边："], [`${known.join(" + ")} = ${knownSum}`]],
              [["Subtract", "相减"], ["What is left of the perimeter:", "周长剩下的部分："], [`${perimeter} - ${knownSum} = ${answer}`]],
            ],
            [`$${known.join(" + ")} + ${answer} = ${perimeter}$.`, `$${known.join(" + ")} + ${answer} = ${perimeter}$。`],
            [
              [knownSum, "That is the three known sides together, not the fourth.", "这是三条已知边的和，不是第四条边。"],
              [perimeter, "That is the whole perimeter.", "这是整个周长。"],
              [perimeter - (known[0] as number), "That takes away only one of the known sides.", "这只减了一条已知的边。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["perimeter-of-polygons#a-missing-side-from-the-perimeter"],
    },
  ],
  [
    "Ben walks around the edge of a rectangular yard: 7 meters, 3 meters, 7 meters and 3 meters. He walks $7 + 3 + 7 + 3 = 20$ meters, the perimeter of the yard.\n\nCheck: $2 \\times 7 + 2 \\times 3 = 20$.\n\nIn this lesson we add side lengths to find a perimeter, and find a missing side from the perimeter.",
    "Ben 沿着长方形院子的边走了一圈：7 米、3 米、7 米、3 米。他走了 $7 + 3 + 7 + 3 = 20$ 米，这就是院子的周长。\n\n检验：$2 \\times 7 + 2 \\times 3 = 20$。\n\n本课我们把各边长相加求周长，并由周长求未知的边。",
  ],
);

const perimeterAndArea = earlyTopic(
  "same-perimeter-or-same-area",
  ["Same Perimeter or Same Area", "周长相同或面积相同"],
  ["See that rectangles with equal perimeters can differ in area, and the reverse.", "明白周长相同的长方形面积可以不同，反过来也一样。"],
  ["area-of-a-rectangle-by-multiplying", "perimeter-of-polygons"],
  ["3.MD.D.8"],
  [
    {
      ...earlyPoint(
        "the-largest-area-for-a-perimeter",
        ["The largest area for a perimeter", "周长一定时的最大面积"],
        [
          "Three rectangles all have perimeter 12, so two sides next to each other add up to 6. 5 by 1 has area 5, 4 by 2 has area 8, and 3 by 3 has area 9. The one closest to a square has the largest area: 9.\n\nCheck: $3 + 3 + 3 + 3 = 12$, the same perimeter.\n\n> **Watch out.** The same perimeter does not mean the same area.",
          "三个长方形的周长都是 12，所以相邻两条边的和是 6。5 乘 1 面积是 5，4 乘 2 面积是 8，3 乘 3 面积是 9。最接近正方形的面积最大：9。\n\n检验：$3 + 3 + 3 + 3 = 12$，周长一样。\n\n> **注意。** 周长相同，面积不一定相同。",
        ],
        (rng) => {
          const half = rng.int(6, 20);
          const largest = rng.bool();
          const p = Math.floor(half / 2);
          const q = Math.ceil(half / 2);
          const answer = largest ? p * q : half - 1;
          return solved(
            [
              `A rectangle with whole-number sides has a perimeter of ${2 * half} cm. What is the ${largest ? "largest" : "smallest"} area it can have, in square centimeters?`,
              `一个边长为整数的长方形，周长是 ${2 * half} 厘米。它的面积${largest ? "最大" : "最小"}是多少平方厘米？`,
            ],
            answer,
            [
              [
                ["Halve the perimeter", "周长除以 2"],
                ["Two sides next to each other add up to:", "相邻两条边的和："],
                [`${2 * half} \\div 2 = ${half}`],
              ],
              largest
                ? [
                    ["Choose the sides", "选边长"],
                    ["Sides closest together give the largest area:", "两条边越接近，面积越大："],
                    [`${p} \\times ${q} = ${answer}`],
                  ]
                : [
                    ["Choose the sides", "选边长"],
                    ["Sides furthest apart give the smallest area:", "两条边相差越大，面积越小："],
                    [`1 \\times ${half - 1} = ${answer}`],
                  ],
            ],
            largest
              ? [
                  `$2 \\times (${p} + ${q}) = ${2 * half}$, and the next pair, ${p - 1} and ${q + 1}, gives only $${(p - 1) * (q + 1)}$.`,
                  `$2 \\times (${p} + ${q}) = ${2 * half}$，下一对 ${p - 1} 和 ${q + 1} 只有 $${(p - 1) * (q + 1)}$。`,
                ]
              : [
                  `$2 \\times (1 + ${half - 1}) = ${2 * half}$, and the next pair, 2 and ${half - 2}, gives $${2 * (half - 2)}$, which is more.`,
                  `$2 \\times (1 + ${half - 1}) = ${2 * half}$，下一对 2 和 ${half - 2} 的面积是 $${2 * (half - 2)}$，更大。`,
                ],
            [
              [2 * half, "That is the perimeter, not an area.", "这是周长，不是面积。"],
              [half, "That is half the perimeter, the sum of two sides.", "这是周长的一半，是两条边的和。"],
              largest
                ? [(p - 1) * (q + 1), "That rectangle is not the closest to a square.", "这个长方形不是最接近正方形的。"]
                : [2 * (half - 2), "That rectangle is not the longest and thinnest.", "这个长方形不是最细长的。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["same-perimeter-or-same-area#the-largest-area-for-a-perimeter"],
    },
    {
      ...earlyPoint(
        "the-perimeter-of-a-rectangle-with-a-given-area",
        ["The perimeter for a given area", "面积一定时的周长"],
        [
          "Three rectangles all have area 12: 12 by 1, 6 by 2 and 4 by 3. Their perimeters are 26, 16 and 14. The long thin one has the largest perimeter.\n\nCheck: $2 \\times (4 + 3) = 14$, and $4 \\times 3 = 12$.\n\n> **Watch out.** To find a perimeter, add the sides. Do not double the area.",
          "三个长方形的面积都是 12：12 乘 1、6 乘 2 和 4 乘 3。它们的周长分别是 26、16 和 14。细长的那个周长最大。\n\n检验：$2 \\times (4 + 3) = 14$，$4 \\times 3 = 12$。\n\n> **注意。** 求周长要把边相加。不要把面积乘 2。",
        ],
        (rng) => {
          const width = rng.int(2, 9);
          const height = rng.int(width + 1, 12);
          const area = width * height;
          const answer = 2 * (width + height);
          return solved(
            [
              `A rectangle has an area of ${area} square cm, and one of its sides is ${width} cm long. What is its perimeter, in centimeters?`,
              `一个长方形的面积是 ${area} 平方厘米，一条边长 ${width} 厘米。它的周长是多少厘米？`,
            ],
            answer,
            [
              [
                ["Find the other side", "求另一条边"],
                ["Divide the area by the known side:", "面积除以已知的边："],
                [`${area} \\div ${width} = ${height}`],
              ],
              [
                ["Add all four sides", "四条边相加"],
                ["Two of each:", "长和宽各两条："],
                [`${width} + ${height} + ${width} + ${height} = ${answer}`],
              ],
            ],
            [`$${width} \\times ${height} = ${area}$, the area given.`, `$${width} \\times ${height} = ${area}$，正是给出的面积。`],
            [
              [width + height, "That adds only two sides, half the way around.", "这只加了两条边，只走了半圈。"],
              [area, "That is the area, not the perimeter.", "这是面积，不是周长。"],
              [2 * area, "That doubles the area. The perimeter adds the sides.", "这是把面积乘 2。周长要把边相加。"],
              [4 * width, "That treats the rectangle as a square.", "这把长方形当成了正方形。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["same-perimeter-or-same-area#the-perimeter-of-a-rectangle-with-a-given-area"],
    },
  ],
  [
    "Two children each make a pen with 12 meters of fence. One pen is long and thin, 5 by 1, and the other is 3 by 3. The same fence holds 5 square meters in one and 9 in the other.\n\nCheck: $5 + 1 + 5 + 1 = 12$ and $3 + 3 + 3 + 3 = 12$.\n\nIn this lesson we see that rectangles with the same perimeter can have different areas, and the reverse.",
    "两个孩子各用 12 米篱笆围一个圈。一个又细又长，5 乘 1；另一个是 3 乘 3。同样的篱笆，一个围住 5 平方米，另一个围住 9 平方米。\n\n检验：$5 + 1 + 5 + 1 = 12$，$3 + 3 + 3 + 3 = 12$。\n\n本课我们看到周长相同的长方形面积可以不同，反过来也一样。",
  ],
);

const sortingQuadrilaterals = earlyTopic(
  "sorting-quadrilaterals",
  ["Sorting Quadrilaterals", "四边形的分类"],
  [
    "Sort four-sided shapes by their sides and angles, seeing that a shape can belong to several groups.",
    "按边和角给四边形分类，明白一个图形可以属于几类。",
  ],
  ["naming-polygons-by-their-sides"],
  ["3.G.A.1"],
  [
    {
      ...earlyPoint(
        "naming-a-quadrilateral",
        ["Naming a quadrilateral", "说出四边形的名称"],
        [
          "A rectangle has four square corners. A rhombus has four equal sides. A square has both, so a square is also a rectangle and a rhombus, and square is its best name. A trapezoid has exactly one pair of parallel sides.\n\nCheck: the square in the picture has square corners like the rectangle and equal sides like the rhombus.\n\n> **Watch out.** Choose the most exact name. A square is a rectangle, but square says more.",
          "长方形有四个直角。菱形有四条相等的边。正方形两样都有，所以正方形也是长方形和菱形，而“正方形”是它最确切的名称。梯形恰好有一组对边平行。\n\n检验：图中的正方形像长方形一样有直角，又像菱形一样边都相等。\n\n> **注意。** 要选最确切的名称。正方形是长方形，但说“正方形”更确切。",
        ],
        (rng) => {
          const a = rng.int(3, 20);
          const b = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== a));
          const long = Math.max(a, b);
          const short = Math.min(a, b);
          type Name = "square" | "rectangle" | "rhombus" | "trapezoid";
          const names: Record<Name, Pair> = {
            square: ["Square", "正方形"],
            rectangle: ["Rectangle", "长方形"],
            rhombus: ["Rhombus", "菱形"],
            trapezoid: ["Trapezoid", "梯形"],
          };
          const twoPairs: Pair = [
            "That has two pairs of parallel sides, but a trapezoid has exactly one.",
            "这个图形有两组对边平行，而梯形恰好只有一组。",
          ];
          const facts: readonly { en: string; zh: string; right: Name; steps: [Pair, Pair]; why: Record<Name, Pair> }[] = [
            {
              en: `four square corners and four sides of ${a} cm`,
              zh: `四个直角和四条 ${a} 厘米的边`,
              right: "square",
              steps: [
                ["Four square corners, so it is a rectangle.", "有四个直角，所以是长方形。"],
                ["The sides are also all equal, so it is a square.", "四条边又都相等，所以是正方形。"],
              ],
              why: {
                square: ["", ""],
                rectangle: [
                  "It is a rectangle, but its equal sides make square the more exact name.",
                  "它是长方形，但边都相等，说正方形更确切。",
                ],
                rhombus: [
                  "It is a rhombus, but its square corners make square the more exact name.",
                  "它是菱形，但有直角，说正方形更确切。",
                ],
                trapezoid: twoPairs,
              },
            },
            {
              en: `four square corners, with two sides of ${long} cm and two sides of ${short} cm`,
              zh: `四个直角，两条边 ${long} 厘米，另外两条边 ${short} 厘米`,
              right: "rectangle",
              steps: [
                ["Four square corners, so it is a rectangle.", "有四个直角，所以是长方形。"],
                [
                  `The sides ${long} and ${short} are not equal, so it is not a square.`,
                  `边长 ${long} 和 ${short} 不相等，所以不是正方形。`,
                ],
              ],
              why: {
                square: ["A square needs four equal sides, but these are not equal.", "正方形要四条边都相等，这里不相等。"],
                rectangle: ["", ""],
                rhombus: ["A rhombus needs four equal sides, but these are not equal.", "菱形要四条边都相等，这里不相等。"],
                trapezoid: twoPairs,
              },
            },
            {
              en: `four sides of ${a} cm, but corners that are not square`,
              zh: `四条 ${a} 厘米的边，但角不是直角`,
              right: "rhombus",
              steps: [
                ["Four equal sides, so it is a rhombus.", "四条边相等，所以是菱形。"],
                ["The corners are not square, so it is not a square.", "角不是直角，所以不是正方形。"],
              ],
              why: {
                square: ["A square needs square corners, and these are not.", "正方形要有直角，这里没有。"],
                rectangle: ["A rectangle needs square corners, and these are not.", "长方形要有直角，这里没有。"],
                rhombus: ["", ""],
                trapezoid: twoPairs,
              },
            },
            {
              en: `exactly one pair of parallel sides, of ${long} cm and ${short} cm`,
              zh: `恰好一组对边平行，长度是 ${long} 厘米和 ${short} 厘米`,
              right: "trapezoid",
              steps: [
                ["Count the parallel pairs: exactly one.", "数平行的对边：恰好一组。"],
                ["Exactly one pair of parallel sides makes a trapezoid.", "恰好一组对边平行就是梯形。"],
              ],
              why: {
                square: ["A square has two pairs of parallel sides, but this has one.", "正方形有两组对边平行，这里只有一组。"],
                rectangle: ["A rectangle has two pairs of parallel sides, but this has one.", "长方形有两组对边平行，这里只有一组。"],
                rhombus: ["A rhombus has two pairs of parallel sides, but this has one.", "菱形有两组对边平行，这里只有一组。"],
                trapezoid: ["", ""],
              },
            },
          ];
          const fact = rng.pick(facts);
          const others = (["square", "rectangle", "rhombus", "trapezoid"] as const).filter((n) => n !== fact.right);
          return picked(
            rng,
            [`A quadrilateral has ${fact.en}. What is the best name for it?`, `一个四边形有${fact.zh}。它最确切的名称是什么？`],
            names[fact.right],
            others.map((n) => [names[n], ...fact.why[n]] as const),
            [
              [["Look at the corners and sides", "看角和边"], fact.steps[0]],
              [["Choose the most exact name", "选最确切的名称"], fact.steps[1]],
            ],
            [
              `A ${names[fact.right][0].toLowerCase()} fits every fact given, and no more exact name does.`,
              `${names[fact.right][1]}符合所有条件，没有更确切的名称了。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["sorting-quadrilaterals#naming-a-quadrilateral"],
    },
    {
      ...earlyPoint(
        "counting-shapes-with-a-feature",
        ["Counting shapes with a feature", "数具有某个特征的图形"],
        [
          "A square turned on its corner is still a square, because its sides and corners have not changed. Squares, rectangles and rhombuses all have opposite sides parallel. So to count shapes with four square corners, count the squares and the rectangles.\n\nCheck: ask the question of each shape one by one.\n\n> **Watch out.** Do not forget the squares. They have square corners and equal sides too.",
          "转了个角度的正方形还是正方形，因为它的边和角都没变。正方形、长方形和菱形的对边都平行。所以数有四个直角的图形，要数正方形和长方形。\n\n检验：对每个图形逐个问一问。\n\n> **注意。** 别忘了正方形。它也有直角，边也相等。",
        ],
        (rng) => {
          const squares = rng.int(1, 6);
          const rectangles = rng.int(1, 6);
          const rhombuses = rng.int(1, 6);
          const trapezoids = rng.int(1, 6);
          const asksEqual = rng.bool();
          const partner = asksEqual ? rhombuses : rectangles;
          const answer = squares + partner;
          const other = asksEqual ? rectangles : rhombuses;
          const noun = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
          const list = [
            noun(squares, "square", "squares"),
            noun(rectangles, "rectangle that is not a square", "rectangles that are not squares"),
            noun(rhombuses, "rhombus that is not a square", "rhombuses that are not squares"),
            noun(trapezoids, "trapezoid", "trapezoids"),
          ];
          const listEn = `${list.slice(0, 3).join(", ")} and ${list[3]}`;
          const listZh = `${squares} 个正方形、${rectangles} 个不是正方形的长方形、${rhombuses} 个不是正方形的菱形、${trapezoids} 个梯形`;
          return solved(
            [
              `A box holds ${listEn}. None of the trapezoids has equal sides or square corners. How many shapes in the box have ${asksEqual ? "four equal sides" : "four square corners"}?`,
              `盒子里有${listZh}。这些梯形的边都不相等，也没有直角。盒子里有多少个图形有${asksEqual ? "四条相等的边" : "四个直角"}？`,
            ],
            answer,
            [
              [
                ["Find the shapes", "找出图形"],
                asksEqual
                  ? ["Squares and rhombuses have four equal sides.", "正方形和菱形都有四条相等的边。"]
                  : ["Squares and rectangles have four square corners.", "正方形和长方形都有四个直角。"],
              ],
              [["Add them", "相加"], ["Count both kinds:", "两种都数上："], [`${squares} + ${partner} = ${answer}`]],
            ],
            asksEqual
              ? [
                  `The ${rectangles} other rectangles and the ${trapezoids} trapezoids do not have equal sides, and $${answer} + ${rectangles} + ${trapezoids}$ is all the shapes.`,
                  `另外 ${rectangles} 个长方形和 ${trapezoids} 个梯形的边不都相等，$${answer} + ${rectangles} + ${trapezoids}$ 正是全部图形。`,
                ]
              : [
                  `The ${rhombuses} other rhombuses and the ${trapezoids} trapezoids have no square corners, and $${answer} + ${rhombuses} + ${trapezoids}$ is all the shapes.`,
                  `另外 ${rhombuses} 个菱形和 ${trapezoids} 个梯形没有直角，$${answer} + ${rhombuses} + ${trapezoids}$ 正是全部图形。`,
                ],
            [
              [
                squares,
                `That counts only the squares and forgets the ${asksEqual ? "rhombuses" : "rectangles"}.`,
                `这只数了正方形，忘了${asksEqual ? "菱形" : "长方形"}。`,
              ],
              [
                partner,
                `That forgets the squares, which have ${asksEqual ? "equal sides" : "square corners"} too.`,
                `这忘了正方形，它也有${asksEqual ? "相等的边" : "直角"}。`,
              ],
              [
                answer + other,
                `That also counts the ${asksEqual ? "rectangles, whose sides are not all equal" : "rhombuses, whose corners are not square"}.`,
                `这把${asksEqual ? "边不都相等的长方形" : "没有直角的菱形"}也算进去了。`,
              ],
              [squares + rectangles + rhombuses + trapezoids, "That counts every shape in the box.", "这把盒子里所有的图形都数了。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["sorting-quadrilaterals#counting-shapes-with-a-feature"],
    },
  ],
  [
    "Look at a window, a kite and a slice of a road sign. They all have four sides, but some have square corners and some have equal sides. A shape can belong to more than one group: a square is also a rectangle.\n\nCheck: a square has four square corners, just as a rectangle needs.\n\nIn this lesson we sort four-sided shapes by their sides and corners.",
    "看看窗户、风筝和一块路牌。它们都有四条边，但有的有直角，有的边相等。一个图形可以属于不止一类：正方形也是长方形。\n\n检验：正方形有四个直角，正是长方形需要的。\n\n本课我们按边和角给四边形分类。",
  ],
);

const equalPartsOfShapes = earlyTopic(
  "equal-parts-of-shapes",
  ["Equal Parts of Shapes", "图形的相等部分"],
  [
    "Cut a shape into parts of equal area, and describe each part as a fraction of the whole.",
    "把图形分成面积相等的几部分，并用分数表示每部分。",
  ],
  ["unit-fractions", "area-with-unit-squares"],
  ["3.G.A.2"],
  [
    earlyPoint(
      "the-area-of-one-part",
      ["The area of one part", "一部分的面积"],
      [
        "A garden of 24 square meters is cut into 4 parts of equal area. Each part is $\\frac{1}{4}$ of the garden, so its area is $24 \\div 4 = 6$ square meters.\n\nCheck: $4 \\times 6 = 24$.\n\n> **Watch out.** Equal parts have equal area even when they look different. Divide; do not subtract.",
        "一个 24 平方米的花园被分成 4 个面积相等的部分。每部分是花园的 $\\frac{1}{4}$，所以面积是 $24 \\div 4 = 6$ 平方米。\n\n检验：$4 \\times 6 = 24$。\n\n> **注意。** 相等的部分即使形状不同，面积也相等。要用除法，不是减法。",
      ],
      (rng) => {
        const parts = rng.int(2, 8);
        const each = rng.int(2, 9);
        const area = parts * each;
        return solved(
          [
            `A garden with an area of ${area} square meters is cut into ${parts} parts of equal area. What is the area of one part, in square meters?`,
            `面积是 ${area} 平方米的花园被分成 ${parts} 个面积相等的部分。一部分的面积是多少平方米？`,
          ],
          each,
          [
            [
              ["Name the part", "说出一部分"],
              [`Each part is $\\frac{1}{${parts}}$ of the garden.`, `每部分是花园的 $\\frac{1}{${parts}}$。`],
            ],
            [["Divide", "相除"], ["Share the area equally:", "把面积平均分："], [`${area} \\div ${parts} = ${each}`]],
          ],
          [`$${parts} \\times ${each} = ${area}$ square meters.`, `$${parts} \\times ${each} = ${area}$ 平方米。`],
          [
            [area - parts, "That subtracts the number of parts. Divide instead.", "这是减去份数。应该用除法。"],
            [area, "That is the whole garden, not one part.", "这是整个花园，不是一部分。"],
            [parts, "That is the number of parts, not the area of one.", "这是份数，不是一部分的面积。"],
          ],
          gridFigure(parts, each, each),
        );
      },
      captioned(
        gridFigure(4, 6, 6),
        "24 unit squares in 4 equal rows, one row shaded: one fourth is 6.",
        "24 个单位正方形分成相等的 4 行，涂了一行：四分之一是 6。",
      ),
    ),
    {
      ...earlyPoint(
        "the-area-of-several-parts",
        ["The area of several parts", "几部分的面积"],
        [
          "A rectangle of 24 square centimeters is cut into 4 equal parts, and 3 are shaded. One part is $24 \\div 4 = 6$, so 3 parts are $3 \\times 6 = 18$ square centimeters.\n\nCheck: the unshaded part is 6, and $18 + 6 = 24$.\n\n> **Watch out.** Do not stop at one part. The top number says to take 3 of them.",
          "一个 24 平方厘米的长方形被分成 4 个相等的部分，涂了 3 份。一份是 $24 \\div 4 = 6$，所以 3 份是 $3 \\times 6 = 18$ 平方厘米。\n\n检验：没涂色的是 6，$18 + 6 = 24$。\n\n> **注意。** 不要只算一份就停。分子说要取 3 份。",
        ],
        (rng) => {
          const d = rng.int(3, 8);
          const n = rng.int(2, d - 1);
          const each = rng.int(2, 9);
          const area = d * each;
          const answer = n * each;
          return solved(
            [
              `A wall has an area of ${area} square meters. What is the area of $\\frac{${n}}{${d}}$ of the wall, in square meters?`,
              `一面墙的面积是 ${area} 平方米。这面墙的 $\\frac{${n}}{${d}}$ 的面积是多少平方米？`,
            ],
            answer,
            [
              [
                ["One part", "一份"],
                [`The bottom number ${d} says to cut into ${d} equal parts:`, `分母 ${d} 表示平均分成 ${d} 份：`],
                [`${area} \\div ${d} = ${each}`],
              ],
              [
                ["Several parts", "几份"],
                [`The top number ${n} says to take ${n} of them:`, `分子 ${n} 表示取 ${n} 份：`],
                [`${n} \\times ${each} = ${answer}`],
              ],
            ],
            [
              `The other ${d - n} ${d - n === 1 ? "part is" : "parts are"} ${(d - n) * each}, and $${answer} + ${(d - n) * each} = ${area}$.`,
              `其余 ${d - n} 份是 ${(d - n) * each}，$${answer} + ${(d - n) * each} = ${area}$。`,
            ],
            [
              [each, "That is only one part. Take as many as the top number says.", "这只是一份。要按分子取几份。"],
              [area - answer, "That is the part that is left, not the part asked for.", "这是剩下的部分，不是要求的部分。"],
              [area * n, "That multiplies the whole wall. Divide first to find one part.", "这是用整面墙去乘。要先除，求出一份。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["equal-parts-of-shapes#the-area-of-several-parts"],
    },
  ],
  [
    "Four friends share a square garden. They cut it into 4 parts of equal area, so each friend gets $\\frac{1}{4}$ of it, even though the parts are not all the same shape.\n\nCheck: 4 parts of $\\frac{1}{4}$ make the whole garden.\n\nIn this lesson we cut shapes into parts of equal area and describe each part as a fraction.",
    "四个朋友分一块正方形菜地。他们把它分成面积相等的 4 份，每人得到 $\\frac{1}{4}$，虽然每份的形状不都一样。\n\n检验：4 个 $\\frac{1}{4}$ 合起来是整块菜地。\n\n本课我们把图形分成面积相等的几部分，并用分数表示每部分。",
  ],
);

/** gradeThreeMeasureTopics are the fraction, measurement, data and geometry topics of 3rd Grade Math, in teaching order. */
export const gradeThreeMeasureTopics: readonly TopicDef[] = [
  unitFractions,
  fractionsOfAWhole,
  fractionsOnNumberLine,
  equivalentFractionsEarly,
  comparingFractionsEarly,
  tellingTimeToTheMinute,
  elapsedTime,
  massAndVolume,
  scaledPictureGraphs,
  scaledBarGraphs,
  linePlotsEarly,
  areaWithUnitSquares,
  areaOfRectangles,
  areaOfCombinedShapes,
  perimeterOfPolygons,
  perimeterAndArea,
  sortingQuadrilaterals,
  equalPartsOfShapes,
];
