// 3rd Grade Math: fractions as numbers, time, mass and volume, scaled graphs and
// line plots, area, perimeter and the sorting of shapes.

import type { Problem, TopicDef } from "@ga/content";
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
  nearbyWrong,
  numberLineFigure,
  pictureGraphFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { numberProblem } from "../problems.ts";
import { barFigure, compareProblem, pickChoice, twoBarsFigure } from "./grade-4-fractions.ts";

/** count builds a problem whose answer is a whole number. */
function count(prompt: readonly [string, string], answer: number, wrong: readonly number[], solution: readonly [string, string]): Problem {
  return numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: nearbyWrong(answer, ...wrong),
    solution: t(solution[0], solution[1]),
  });
}

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
        "When a whole is cut into equal parts, each part is a fraction of the whole. The bottom number, the denominator, tells how many equal parts make the whole. The top number tells how many parts we are talking about. So one of the parts has a top number of 1, and it is called a unit fraction.",
        "把一个整体平均分成几份时，每一份都是整体的几分之一。下面的数叫分母，说明整体被平均分成几份。上面的数说明说的是几份。所以其中的一份，分子是 1，叫作单位分数。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const thing = rng.pick([
          { en: "chocolate bar", zh: "巧克力" },
          { en: "strip of paper", zh: "纸条" },
          { en: "ribbon", zh: "丝带" },
          { en: "garden bed", zh: "花坛" },
        ]);
        return {
          ...numberProblem({
            prompt: t(
              `This picture shows a ${thing.en} cut into equal parts, with one part shaded. The shaded part is $\\frac{1}{n}$ of the ${thing.en}. What is $n$?`,
              `这幅图表示一块${thing.zh}被平均分成几份，其中一份涂了颜色。涂色部分是这块${thing.zh}的 $\\frac{1}{n}$。$n$ 是多少？`,
            ),
            answer: d,
            form: "integer",
            wrong: nearbyWrong(d, d - 1, 1),
            solution: t(
              `The picture has ${d} equal parts, so one part is $\\frac{1}{${d}}$ of the whole.`,
              `图中有 ${d} 个相等的部分，所以一份是整体的 $\\frac{1}{${d}}$。`,
            ),
          }),
          figure: barFigure(d, 1),
        };
      },
    ),
    earlyPoint(
      "more-parts-means-smaller-parts",
      ["More parts means smaller parts", "份数越多每份越小"],
      [
        "The same whole can be cut into a few parts or many parts. The more parts there are, the smaller each part must be, since they all share the same whole. So a unit fraction with a larger denominator is the smaller one. This surprises many learners at first, because a bigger number at the bottom means a smaller piece.",
        "同一个整体可以分成几份，也可以分成很多份。份数越多，每一份一定越小，因为它们共同分同一个整体。所以分母较大的单位分数反而较小。很多人一开始会觉得奇怪：下面的数越大，每一份却越小。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12].filter((v) => v !== a));
        return pickChoice(
          rng,
          t(
            `Two equal pizzas are cut, one into ${a} equal slices and one into ${b} equal slices. Which is the larger slice?`,
            `两个同样大的比萨，一个平均切成 ${a} 块，一个平均切成 ${b} 块。哪一块更大？`,
          ),
          t(`$\\frac{1}{${Math.min(a, b)}}$ of a pizza`, `比萨的 $\\frac{1}{${Math.min(a, b)}}$`),
          [
            t(`$\\frac{1}{${Math.max(a, b)}}$ of a pizza`, `比萨的 $\\frac{1}{${Math.max(a, b)}}$`),
            t("They are the same size", "一样大"),
            t("It cannot be told", "无法判断"),
          ],
          t(
            `Fewer slices means larger slices, so $\\frac{1}{${Math.min(a, b)}}$ is larger than $\\frac{1}{${Math.max(a, b)}}$.`,
            `份数越少每份越大，所以 $\\frac{1}{${Math.min(a, b)}}$ 比 $\\frac{1}{${Math.max(a, b)}}$ 大。`,
          ),
        );
      },
    ),
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
        "A fraction such as three fourths means three parts, each of size one fourth. The denominator counts the equal parts in the whole, so count all of them, shaded or not. The numerator counts the shaded parts. A frequent slip is to compare shaded with unshaded parts, but the bottom number always counts the whole.",
        "像四分之三这样的分数，表示 3 份，每份是四分之一。分母数的是整体被平均分成的份数，所以无论涂没涂色都要数。分子数的是涂色的份数。常见的差错是拿涂色的和没涂色的比，其实分母数的总是整体。",
      ],
      (rng) => {
        const d = rng.int(3, 10);
        const n = rng.int(2, d - 1);
        const asksBottom = rng.bool();
        const answer = asksBottom ? d : n;
        return {
          ...count(
            asksBottom
              ? [
                  `The shaded part of this bar is a fraction of the whole bar. What is the bottom number of that fraction?`,
                  `涂色部分占整个长条的几分之几？这个分数的分母是多少？`,
                ]
              : [
                  `The shaded part of this bar is a fraction of the whole bar. What is the top number of that fraction?`,
                  `涂色部分占整个长条的几分之几？这个分数的分子是多少？`,
                ],
            answer,
            [d - n, d, n],
            [
              `There are ${d} equal parts, and ${n} of them are shaded, so the fraction is $\\frac{${n}}{${d}}$.`,
              `一共有 ${d} 个相等的部分，其中 ${n} 个涂了颜色，所以这个分数是 $\\frac{${n}}{${d}}$。`,
            ],
          ),
          figure: barFigure(d, n),
        };
      },
    ),
    earlyPoint(
      "how-many-unit-fractions",
      ["How many unit fractions", "有多少个单位分数"],
      [
        "Every fraction is built from copies of a unit fraction, just as a whole number is built from ones. Five sixths is five copies of one sixth. So the top number counts the copies. Thinking this way makes adding fractions with the same denominator natural later on, because copies of the same size can simply be counted.",
        "每个分数都由若干个单位分数组成，就像整数由若干个一组成。六分之五是 5 个六分之一。所以分子数的是有几个。这样想，以后做同分母分数加法就很自然了，因为大小相同的份数只要数一数就行。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(2, d);
        return count(
          [`How many copies of $\\frac{1}{${d}}$ make $\\frac{${n}}{${d}}$?`, `多少个 $\\frac{1}{${d}}$ 组成 $\\frac{${n}}{${d}}$？`],
          n,
          [d, d - n],
          [
            `$\\frac{${n}}{${d}}$ means ${n} parts, each of size $\\frac{1}{${d}}$.`,
            `$\\frac{${n}}{${d}}$ 表示 ${n} 份，每份是 $\\frac{1}{${d}}$。`,
          ],
        );
      },
    ),
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
          "A fraction is a number, and so it has a place on the number line. Cut the space from 0 to 1 into as many equal parts as the denominator says. Starting at 0, each jump of one part moves one unit fraction along. The numerator tells how many of these jumps to make to reach the point.",
          "分数是数，所以它在数轴上有一个位置。按分母说的份数，把 0 到 1 之间平均分。从 0 开始，每跳一份就前进一个单位分数。分子说明要跳几次才能到达这个点。",
        ],
        (rng) => {
          const d = rng.int(3, 8);
          const n = rng.int(1, d - 1);
          return {
            ...count(
              [
                `The space from 0 to 1 on this line is cut into equal parts. The marked point shows $\\frac{a}{${d}}$. What is $a$?`,
                `这条数轴上 0 到 1 之间被平均分成几份。标出的点表示 $\\frac{a}{${d}}$。$a$ 是多少？`,
              ],
              n,
              [d, d - n],
              [
                `Each space is $\\frac{1}{${d}}$, and the point is ${n} ${n === 1 ? "space" : "spaces"} from 0, so it shows $\\frac{${n}}{${d}}$.`,
                `每一格是 $\\frac{1}{${d}}$，这个点离 0 有 ${n} 格，所以它表示 $\\frac{${n}}{${d}}$。`,
              ],
            ),
            figure: fractionLine(d, n),
          };
        },
      ),
      figure: gradeDrawings2["fractions-on-the-number-line#counting-jumps-to-a-point"],
    },
    {
      ...earlyPoint(
        "the-fraction-of-spaces-between-whole-numbers",
        ["The number of spaces between whole numbers", "整数之间的格数"],
        [
          "The size of each part on a number line depends on the number of parts between 0 and 1, and not on how many parts the whole line shows. So look at a single unit, from one whole number to the next, and count the spaces in it. Counting the tick marks instead gives one too many, which is a common mistake.",
          "数轴上每一份的大小取决于 0 到 1 之间分成几份，而不是整条线上有多少份。所以只看一个单位，也就是从一个整数到下一个整数，数其中的格数。数刻度线会多出一个，这是常见的差错。",
        ],
        (rng) => {
          const d = rng.int(2, 9);
          const ticks = d + 1;
          const whole = rng.int(0, 7);
          return count(
            [
              `Between ${whole} and ${whole + 1} on a number line there are ${ticks} tick marks, counting both ends, and they are evenly spaced. Each space is $\\frac{1}{n}$. What is $n$?`,
              `数轴上 ${whole} 和 ${whole + 1} 之间有 ${ticks} 条等距的刻度线（包括两端）。每一格是 $\\frac{1}{n}$。$n$ 是多少？`,
            ],
            d,
            [ticks, d - 1, d + 2],
            [
              `${ticks} tick marks make ${d} spaces between them, so each space is $\\frac{1}{${d}}$.`,
              `${ticks} 条刻度线之间有 ${d} 格，所以每一格是 $\\frac{1}{${d}}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["fractions-on-the-number-line#the-fraction-of-spaces-between-whole-numbers"],
    },
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
        "Two fractions are equal when they cover the same amount of the same whole. If each part of a bar is cut in two, there are twice as many parts, and twice as many are shaded, but the shaded amount is unchanged. So a picture can show that different-looking fractions name one number. Line the bars up to compare them.",
        "两个分数覆盖同一个整体的同样多时，它们就相等。如果把长条的每一份再切成两份，份数变成两倍，涂色的份数也变成两倍，但涂色的部分没变。所以图可以说明看起来不同的分数表示同一个数。把长条对齐来比较。",
      ],
      (rng) => {
        const d = rng.pick([2, 3, 4, 5, 6]);
        const n = rng.int(1, d - 1);
        const k = rng.int(2, d === 2 ? 6 : d === 3 ? 5 : d === 4 ? 3 : 2);
        const answer = n * k;
        return {
          ...count(
            [
              `The two bars are the same size, and their shaded parts are equal. So $\\frac{${n}}{${d}} = \\frac{a}{${d * k}}$. What is $a$?`,
              `两个长条同样大，涂色部分相等。所以 $\\frac{${n}}{${d}} = \\frac{a}{${d * k}}$。$a$ 是多少？`,
            ],
            answer,
            [n, n + k, d * k - answer],
            [
              `Each part of the top bar is cut into ${k}, so ${n} ${n === 1 ? "part becomes" : "parts become"} $${n} \\times ${k} = ${answer}$ parts.`,
              `上面长条的每一份都切成 ${k} 份，所以 ${n} 份变成 $${n} \\times ${k} = ${answer}$ 份。`,
            ],
          ),
          figure: twoBarsFigure(d, n, d * k, answer),
        };
      },
    ),
    earlyPoint(
      "whole-numbers-as-fractions",
      ["Whole numbers as fractions", "把整数写成分数"],
      [
        "A whole number can be written as a fraction. When the top number equals the bottom number, all the parts of the whole are there, so the fraction equals one. When the bottom number is one, each whole is a single part, so the fraction equals its top number. These forms become important when comparing or adding fractions with whole numbers.",
        "整数可以写成分数。分子等于分母时，整体的所有部分都在，所以分数等于 1。分母是 1 时，每个整体只有一份，所以分数等于它的分子。在比较分数和整数或把它们相加时，这些写法就很重要了。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const n = rng.int(2, 12);
        const m = rng.int(2, 6);
        if (kind === 0)
          return count(
            [`What whole number equals $\\frac{${n}}{1}$?`, `$\\frac{${n}}{1}$ 等于哪个整数？`],
            n,
            [1, n - 1],
            [
              `A bottom number of 1 means that each whole is one part, so ${n} parts make ${n} wholes.`,
              `分母是 1 表示每个整体就是一份，所以 ${n} 份是 ${n} 个整体。`,
            ],
          );
        if (kind === 1)
          return count(
            [`What whole number equals $\\frac{${n}}{${n}}$?`, `$\\frac{${n}}{${n}}$ 等于哪个整数？`],
            1,
            [n, 0, 2],
            [`All ${n} of the ${n} parts are there, so the fraction is one whole.`, `${n} 份全都在，所以这个分数是一个整体。`],
          );
        return count(
          [`What whole number equals $\\frac{${m * n}}{${n}}$?`, `$\\frac{${m * n}}{${n}}$ 等于哪个整数？`],
          m,
          [n, m * n, m + n],
          [`Every ${n} parts make one whole, and ${m * n} parts make ${m} wholes.`, `每 ${n} 份是一个整体，${m * n} 份就是 ${m} 个整体。`],
        );
      },
    ),
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
        "When two fractions have the same denominator, their parts are all the same size. So the comparison comes down to counting: the fraction with more parts is larger. This only works when both fractions describe the same whole, as a half of a small pizza may well be less than a third of a very large one.",
        "两个分数分母相同时，每一份都一样大。所以比较就变成了数数：份数多的分数较大。这只有在两个分数说的是同一个整体时才成立，因为小比萨的一半可能比大比萨的三分之一还少。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const a = rng.int(1, d - 1);
        const b = ((a + rng.int(0, d - 3)) % (d - 1)) + 1;
        return compareProblem(
          `\\frac{${a}}{${d}}`,
          `\\frac{${b}}{${d}}`,
          Math.sign(a - b) + 1,
          t(
            `The parts are the same size, and ${plural(Math.max(a, b), "part")} are more than ${plural(Math.min(a, b), "part")}.`,
            `每份一样大，${Math.max(a, b)} 份比 ${Math.min(a, b)} 份多。`,
          ),
        );
      },
    ),
    earlyPoint(
      "same-numerator",
      ["The same numerator", "分子相同"],
      [
        "When two fractions have the same numerator, each has the same number of parts, but the parts are not the same size. A larger denominator means smaller parts, so the fraction with the larger denominator is smaller. Be careful, since this is the reverse of what happens with whole numbers. A quick sketch of two bars will confirm the answer.",
        "两个分数分子相同时，份数一样，但每份大小不同。分母越大每份越小，所以分母较大的分数较小。要小心，这和整数的情况相反。画两个长条的草图就能确认答案。",
      ],
      (rng) => {
        const n = rng.int(1, 5);
        const a = rng.int(n + 1, 12);
        const b = rng.pick([6, 7, 8, 9, 10, 11, 12].filter((v) => v !== a && v > n));
        return compareProblem(
          `\\frac{${n}}{${a}}`,
          `\\frac{${n}}{${b}}`,
          Math.sign(b - a) + 1,
          t(
            `Each has ${n} ${n === 1 ? "part" : "parts"}, and parts of $\\frac{1}{${Math.min(a, b)}}$ are larger than parts of $\\frac{1}{${Math.max(a, b)}}$.`,
            `都是 ${n} 份，而 $\\frac{1}{${Math.min(a, b)}}$ 的每份比 $\\frac{1}{${Math.max(a, b)}}$ 的每份大。`,
          ),
        );
      },
    ),
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
        "The long hand counts minutes. It takes one minute to move from one small mark to the next, and there are five small marks between neighboring numbers. So count by fives up to the last number the hand has passed, and then count on by ones. The number beside the hand is not the number of minutes.",
        "长针数分钟。它从一个小刻度走到下一个要一分钟，相邻两个数字之间有五小格。所以五个五个地数到分针刚过的那个数字，再一个一个地往下数。分针旁边的数字并不是分钟数。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = rng.int(1, 59);
        const answer = minute;
        return {
          ...count(
            ["How many minutes past the hour does this clock show?", "这个钟面显示过了整点多少分钟？"],
            answer,
            [Math.floor(minute / 5), 60 - minute, hour],
            [
              `The long hand has passed ${plural(Math.floor(minute / 5), "number")}, which is ${5 * Math.floor(minute / 5)} minutes${minute % 5 === 0 ? "" : `, and ${minute % 5} more small ${minute % 5 === 1 ? "mark" : "marks"}`}, so it shows ${minute} minutes.`,
              `长针过了 ${Math.floor(minute / 5)} 个数字，是 ${5 * Math.floor(minute / 5)} 分钟${minute % 5 === 0 ? "" : `，又多 ${minute % 5} 小格`}，所以是 ${minute} 分。`,
            ],
          ),
          figure: clockFigure(hour, minute),
        };
      },
    ),
    earlyPoint(
      "the-hour-hand",
      ["Reading the hour hand", "读时针"],
      [
        "The short hand moves slowly from one number to the next during each hour. Between two numbers, the hour is the smaller one that it has already passed, and the hour changes only when it reaches the next number. So a short hand almost at 4 still means the hour is 3, until the long hand comes up to 12.",
        "短针在每个小时里从一个数字慢慢走到下一个数字。在两个数字之间时，小时是它已经走过的较小的那个，只有走到下一个数字时小时才变。所以短针快到 4 时，小时还是 3，直到长针走到 12。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = rng.int(5, 55);
        const next = hour === 12 ? 1 : hour + 1;
        return {
          ...count(
            [
              "What hour does the short hand on this clock show? Give the hour that it has already passed.",
              "这个钟面的短针显示几时？写出它已经走过的那个小时。",
            ],
            hour,
            [next, Math.floor(minute / 5)],
            [
              `The short hand is between ${hour} and ${next}, so the hour is ${hour}, and the time is ${timeText(hour, minute)}.`,
              `短针在 ${hour} 和 ${next} 之间，所以是 ${hour} 时，时间是 ${timeText(hour, minute)}。`,
            ],
          ),
          figure: clockFigure(hour, minute),
        };
      },
    ),
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
          "A number line of time helps to find how long something takes. Jump from the start time to the next hour, count those minutes, and then jump on to the end time. Adding the jumps gives the total. Subtracting the clock numbers directly works only within an hour, because an hour has sixty minutes and not one hundred.",
          "时间数轴可以帮助求经过的时间。从开始时刻跳到下一个整点，数出这段分钟，再跳到结束时刻。把各段相加就是总时间。直接把钟面上的数相减只在同一小时内可行，因为一小时是 60 分钟，不是 100 分钟。",
        ],
        (rng) => {
          const hour = rng.int(1, 10);
          const start = rng.int(10, 55);
          const answer = rng.int(61 - start, 59);
          const endMinute = start + answer - 60;
          const name = rng.pick(earlyNames);
          return count(
            [
              `${name} starts reading at ${timeText(hour, start)} and stops at ${timeText(hour + 1, endMinute)}, on the same afternoon. For how many minutes does ${name} read?`,
              `${name} 在同一个下午的 ${timeText(hour, start)} 开始看书，${timeText(hour + 1, endMinute)} 停止。${name} 看了多少分钟？`,
            ],
            answer,
            [Math.abs(endMinute - start), 100 + endMinute - start, answer + 60],
            [
              `From ${timeText(hour, start)} to ${timeText(hour + 1, 0)} is ${60 - start} minutes. Then ${endMinute} more minutes make $${60 - start} + ${endMinute} = ${answer}$ minutes.`,
              `从 ${timeText(hour, start)} 到 ${timeText(hour + 1, 0)} 是 ${60 - start} 分钟。再过 ${endMinute} 分钟，一共 $${60 - start} + ${endMinute} = ${answer}$ 分钟。`,
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
        "To find when something ends, add its length to the start time. If the minutes reach sixty, then a new hour begins, so take away sixty and move to the next hour. Thinking in two jumps helps: first go to the next hour, and then use the rest of the time. Say the result as a clock would show it.",
        "要求什么时候结束，就把经过的时间加到开始时刻上。如果分钟数满 60，就开始了新的一小时，所以减去 60，小时加 1。分两步跳会有帮助：先到下一个整点，再用掉剩下的时间。结果要说成钟面上显示的样子。",
      ],
      (rng) => {
        const hour = rng.int(1, 10);
        const start = rng.int(20, 55);
        const length = rng.int(61 - start, 55);
        const endMinute = start + length - 60;
        return count(
          [
            `A game starts at ${timeText(hour, start)} and lasts ${length} minutes. It ends at ${hour + 1}:$\\square$. What number of minutes goes in the box?`,
            `比赛 ${timeText(hour, start)} 开始，持续 ${length} 分钟。它在 ${hour + 1}:$\\square$ 结束。方框里的分钟数是多少？`,
          ],
          endMinute,
          [start + length, length, 60 - endMinute],
          [
            `$${start} + ${length} = ${start + length}$ minutes, which is one hour and ${endMinute} minutes. So the game ends at ${timeText(hour + 1, endMinute)}.`,
            `$${start} + ${length} = ${start + length}$ 分钟，就是 1 小时 ${endMinute} 分钟。所以比赛在 ${timeText(hour + 1, endMinute)} 结束。`,
          ],
        );
      },
    ),
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
        "Units help us talk about how heavy something is or how much it holds. A paper clip is about one gram and a large book about one kilogram, so light things are measured in grams and heavy ones in kilograms. A large water bottle holds about one liter, and a medicine dropper holds about one milliliter.",
        "单位帮助我们说明东西有多重或能装多少。一枚回形针大约 1 克，一本大书大约 1 千克，所以轻的东西用克，重的东西用千克。一个大水瓶大约能装 1 升，一个滴管大约能装 1 毫升。",
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
        const options = { g: t("grams", "克"), kg: t("kilograms", "千克"), L: t("liters", "升"), mL: t("milliliters", "毫升") };
        const measuresVolume = item.unit === "L" || item.unit === "mL";
        const right = options[item.unit as keyof typeof options];
        return pickChoice(
          rng,
          measuresVolume
            ? t(`Which unit is best for measuring ${item.en}?`, `测量${item.zh}，用哪个单位最合适？`)
            : t(`Which unit is best for measuring how heavy ${item.en} is?`, `测量${item.zh}有多重，用哪个单位最合适？`),
          right,
          [options.g, options.kg, options.L, options.mL].filter((o) => o !== right),
          t(
            measuresVolume
              ? `This is an amount of liquid, and ${right.en} suit its size.`
              : `This is how heavy something is, and ${right.en} suit its size.`,
            measuresVolume ? `这是液体的量，用${right["zh-CN"]}大小合适。` : `这是物体的轻重，用${right["zh-CN"]}大小合适。`,
          ),
        );
      },
    ),
    earlyPoint(
      "problems-with-mass-and-volume",
      ["Problems with mass and volume", "质量和容积的问题"],
      [
        "Masses and volumes are numbers with units, so they add, subtract, multiply and divide as usual, as long as the units match. Equal bags have a total mass found by multiplying, and a shared liquid divides. Keep the unit in the answer, because a number by itself would not tell how much there is of anything.",
        "质量和容积是带单位的数，只要单位相同，就可以照常加减乘除。相同的袋子，总质量用乘法求；平均分液体，用除法求。答案要带上单位，因为只有一个数说不清到底有多少。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const heavy = rng.bool();
        return heavy
          ? numberProblem({
              prompt: t(
                `Each bag of flour has a mass of ${each} kg. What is the total mass of ${groups} bags, in kilograms?`,
                `每袋面粉的质量是 ${each} 千克。${groups} 袋的总质量是多少千克？`,
              ),
              answer: groups * each,
              form: "integer",
              wrong: nearbyWrong(groups * each, groups + each),
              solution: t(
                `Equal groups multiply: $${groups} \\times ${each} = ${groups * each}$ kg.`,
                `相同的组用乘法：$${groups} \\times ${each} = ${groups * each}$ 千克。`,
              ),
            })
          : numberProblem({
              prompt: t(
                `${groups * each} liters of juice are poured equally into ${groups} jugs. How many liters are in each jug?`,
                `${groups * each} 升果汁平均倒进 ${groups} 个水壶。每个水壶里有多少升？`,
              ),
              answer: each,
              form: "integer",
              wrong: nearbyWrong(each, groups * each - groups, groups),
              solution: t(
                `Sharing equally divides: $${groups * each} \\div ${groups} = ${each}$ liters.`,
                `平均分用除法：$${groups * each} \\div ${groups} = ${each}$ 升。`,
              ),
            });
      },
    ),
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
          "In a scaled picture graph, one picture stands for more than one item, and a key tells how many. So to read a row, count the pictures, and multiply by the number in the key. Counting only the pictures gives the wrong size. Always read the key first, as different graphs use different scales for the same picture.",
          "在带比例的象形统计图中，一个图案代表不止一个物品，图例说明代表多少。所以读一行时，先数图案，再乘图例中的数。只数图案，大小就错了。一定要先读图例，因为不同的图用同样的图案，比例可能不同。",
        ],
        (rng) => {
          const per = rng.pick([2, 5, 10]);
          const values = ["A", "B", "C"].map(() => per * rng.int(1, 8));
          const row = rng.int(0, 2);
          const label = ["A", "B", "C"][row] as string;
          const answer = values[row] as number;
          return {
            ...count(
              [
                `In this picture graph, each dot stands for ${per} votes. How many votes did ${label} get?`,
                `在这个象形统计图中，每个点代表 ${per} 票。${label} 得到多少票？`,
              ],
              answer,
              [answer / per, answer + per, answer - per],
              [
                `Row ${label} has ${plural(answer / per, "dot")}, and $${answer / per} \\times ${per} = ${answer}$.`,
                `${label} 行有 ${answer / per} 个点，$${answer / per} \\times ${per} = ${answer}$。`,
              ],
            ),
            figure: pictureGraphFigure(["A", "B", "C"], values, per),
          };
        },
      ),
      figure: gradeDrawings2["scaled-picture-graphs#reading-a-row"],
    },
    {
      ...earlyPoint(
        "how-many-more-in-a-picture-graph",
        ["How many more in a picture graph", "象形统计图中多多少"],
        [
          "To compare two rows of a picture graph, you may find each value and then subtract. It is often quicker to count how many more pictures one row has, and to multiply that difference by the number in the key. Both ways give the same answer, and using one to check the other catches a misread key.",
          "比较象形统计图的两行时，可以求出各自的值再相减。常常更快的办法是数一行比另一行多几个图案，再把这个差乘图例中的数。两种方法答案相同，用一种检验另一种，可以发现读错图例的情况。",
        ],
        (rng) => {
          const per = rng.pick([2, 5, 10]);
          const low = rng.int(1, 4);
          const high = low + rng.int(1, 4);
          const values = rng.bool() ? [per * low, per * high] : [per * high, per * low];
          const answer = per * (high - low);
          const more = (values[0] as number) > (values[1] as number) ? "A" : "B";
          const less = more === "A" ? "B" : "A";
          return {
            ...count(
              [
                `Each dot stands for ${per} books. How many more books did ${more} read than ${less}?`,
                `每个点代表 ${per} 本书。${more} 比 ${less} 多读了多少本？`,
              ],
              answer,
              [high - low, per * high, per * (high + low)],
              [
                `${more} has $${high} - ${low} = ${high - low}$ more ${high - low === 1 ? "dot" : "dots"}, and each is worth ${per}, so the difference is ${answer}.`,
                `${more} 比 ${less} 多 $${high} - ${low} = ${high - low}$ 个点，每个点代表 ${per}，所以相差 ${answer}。`,
              ],
            ),
            figure: pictureGraphFigure(["A", "B"], values, per),
          };
        },
      ),
      figure: gradeDrawings2["scaled-picture-graphs#how-many-more-in-a-picture-graph"],
    },
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
          "A bar graph shows each amount as the height of a bar. To read a bar, look across from its top to the scale at the side. The scale may count by twos, fives or tens, so check how much each line is worth. If the top of a bar falls halfway between two lines, then its value is halfway as well.",
          "条形图用条的高度表示数量。读一个条时，从它的顶端横着看到旁边的刻度。刻度可能按 2、5 或 10 增加，所以要看清每条线代表多少。如果条的顶端在两条线的正中间，它的值也在正中间。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10]);
          const values = [0, 1, 2, 3].map(() => step * rng.int(1, 8));
          const i = rng.int(0, 3);
          const labels = ["A", "B", "C", "D"];
          return {
            ...count(
              [`What is the value of bar ${labels[i]} in this graph?`, `这个图中条 ${labels[i]} 的值是多少？`],
              values[i] as number,
              [(values[i] as number) / step, (values[i] as number) + step, (values[i] as number) - step],
              [`The top of bar ${labels[i]} lines up with ${values[i]} on the scale.`, `条 ${labels[i]} 的顶端对着刻度 ${values[i]}。`],
            ),
            figure: barGraphFigure(labels, values, step),
          };
        },
      ),
      figure: gradeDrawings2["scaled-bar-graphs#reading-a-bar"],
    },
    {
      ...earlyPoint(
        "total-and-difference-from-a-bar-graph",
        ["Totals and differences from a bar graph", "由条形图求总数和差"],
        [
          "A bar graph can answer questions that need more than one reading. For how many more, read two bars and subtract. For how many altogether, read the bars and add. Make sure you are using the values on the scale, and not the number of grid lines. Writing each reading down before calculating helps to avoid mistakes.",
          "条形图可以回答需要读多个数的问题。问多多少，就读两个条再相减。问一共多少，就读这些条再相加。要用刻度上的值，而不是格线的条数。先把每个读数写下来再计算，有助于避免差错。",
        ],
        (rng) => {
          const step = rng.pick([2, 5, 10]);
          const values = [0, 1, 2].map(() => step * rng.int(1, 8));
          const labels = ["A", "B", "C"];
          const [a, b, c] = values as [number, number, number];
          const sum = rng.bool();
          const answer = sum ? a + b + c : Math.max(a, b) - Math.min(a, b);
          const prompt: readonly [string, string] = sum
            ? ["What is the total of all three bars?", "三个条的总和是多少？"]
            : ["What is the difference between bars A and B?", "条 A 和条 B 相差多少？"];
          return {
            ...count(
              prompt,
              answer,
              [sum ? a + b : a + b, answer / step, answer + step],
              sum
                ? [
                    `The bars show ${a}, ${b} and ${c}, and $${a} + ${b} + ${c} = ${answer}$.`,
                    `三个条分别是 ${a}、${b} 和 ${c}，$${a} + ${b} + ${c} = ${answer}$。`,
                  ]
                : [`The bars show ${a} and ${b}, which differ by ${answer}.`, `这两个条分别是 ${a} 和 ${b}，相差 ${answer}。`],
            ),
            figure: barGraphFigure(labels, values, step),
          };
        },
      ),
      figure: gradeDrawings2["scaled-bar-graphs#total-and-difference-from-a-bar-graph"],
    },
  ],
);

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
          "A line plot puts a mark above a number line for each measurement. So the marks above one number show how many times that length was measured. The number line gives the lengths, and the height of a stack gives how often each one occurred. Be careful not to mix up these two when you read the plot.",
          "线图为每个测量值在数轴上方画一个点。所以一个数上方的点，说明这个长度出现了几次。数轴给出长度，一摞点的高度给出每个长度出现的次数。读图时小心不要把这两者弄混。",
        ],
        (rng) => {
          const values = [...Array(rng.int(7, 12)).keys()].map(() => rng.int(3, 8));
          const v = rng.pick(values);
          const answer = values.filter((x) => x === v).length;
          return {
            ...count(
              [
                `This line plot shows the lengths of some ribbons, in inches. How many ribbons are ${v} inches long?`,
                `这个线图表示一些丝带的长度（英寸）。长度为 ${v} 英寸的丝带有多少条？`,
              ],
              answer,
              [v, values.length, values.length - answer],
              [`Counting the marks above ${v} on the plot gives ${answer}.`, `数图上 ${v} 上方的点，一共有 ${answer} 个。`],
            ),
            figure: {
              svg: dotPlot(values, { min: 3, max: 8, step: 1 }),
              alt: t(
                `A line plot of ribbon lengths from 3 to 8 inches, with one dot at each of: ${values.join(", ")}.`,
                `丝带长度的线图，从 3 到 8 英寸，点分别在：${values.join("、")}。`,
              ),
            },
          };
        },
      ),
      figure: gradeDrawings2["line-plots-of-measurements#counting-the-marks-above-a-length"],
    },
    earlyPoint(
      "how-many-measured-in-all",
      ["How many were measured in all", "一共测量了多少个"],
      [
        "Each mark on a line plot is one thing that was measured. So adding the marks over every number tells how many things were measured in all. The numbers on the line are lengths, and they should not be added for this. A question about things longer than a length uses only the marks to the right of it.",
        "线图上每个点都是一个被测量的东西。所以把每个数上方的点加起来，就知道一共测量了多少个。数轴上的数是长度，这里不应该把它们相加。问比某个长度更长的东西，就只用它右边的点。",
      ],
      (rng) => {
        const values = [...Array(rng.int(7, 14)).keys()].map(() => rng.int(3, 8));
        const cut = rng.int(4, 6);
        const all = rng.bool();
        const answer = all ? values.length : values.filter((x) => x > cut).length;
        return {
          ...count(
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
            [values.filter((x) => x === cut).length, 8, 3],
            all
              ? [`Every mark is one ribbon, and there are ${answer} marks.`, `每个点代表一条丝带，一共有 ${answer} 个点。`]
              : [
                  `Only marks to the right of ${cut} count, and there ${answer === 1 ? "is 1" : `are ${answer}`} of them.`,
                  `只算 ${cut} 右边的点，一共有 ${answer} 个。`,
                ],
          ),
          figure: {
            svg: dotPlot(values, { min: 3, max: 8, step: 1 }),
            alt: t(
              `A line plot of ribbon lengths from 3 to 8 inches, with one dot at each of: ${values.join(", ")}.`,
              `丝带长度的线图，从 3 到 8 英寸，点分别在：${values.join("、")}。`,
            ),
          },
        };
      },
    ),
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
        "Area measures how much surface a shape covers. A unit square has sides of one unit, and its area is one square unit. To find the area of a shape, cover it with unit squares that leave no gaps and do not overlap, and count them. The answer is given in square units, such as square centimeters.",
        "面积表示一个图形覆盖了多大的面。单位正方形的边长是 1 个单位，面积是 1 平方单位。要求图形的面积，就用单位正方形把它铺满，不留空隙也不重叠，再数一数。答案用平方单位表示，比如平方厘米。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const columns = rng.int(2, 9);
        const shaded = rng.int(rows, rows * columns);
        return {
          ...count(
            [
              "Each small square is 1 square centimeter. What is the area of the shaded part, in square centimeters?",
              "每个小正方形是 1 平方厘米。涂色部分的面积是多少平方厘米？",
            ],
            shaded,
            [rows + columns, rows * columns, 2 * (rows + columns)],
            [
              `${shaded} unit squares are shaded, and each has an area of 1 square centimeter.`,
              `有 ${shaded} 个单位正方形涂了颜色，每个面积是 1 平方厘米。`,
            ],
          ),
          figure: gridFigure(rows, columns, shaded),
        };
      },
    ),
    {
      ...earlyPoint(
        "rows-of-unit-squares",
        ["Rows of unit squares", "成行的单位正方形"],
        [
          "A rectangle covered with unit squares is an array of squares. Every row has the same number of squares, so the area is the number of rows times the number in each row. This is why area connects to multiplication. It is much quicker than counting, and it works just as well when the grid is not fully drawn.",
          "铺满单位正方形的长方形，就是一个正方形组成的阵列。每行的个数相同，所以面积等于行数乘每行的个数。这就是面积和乘法的联系。这比数快得多，即使方格没有全部画出来也同样适用。",
        ],
        (rng) => {
          const rows = rng.int(2, 8);
          const columns = rng.int(2, 9);
          const answer = rows * columns;
          return {
            ...count(
              ["What is the area of this rectangle, in square units?", "这个长方形的面积是多少平方单位？"],
              answer,
              [rows + columns, 2 * (rows + columns)],
              [
                `There are ${rows} rows of ${columns} squares, so $${rows} \\times ${columns} = ${answer}$ square units.`,
                `有 ${rows} 行，每行 ${columns} 个正方形，所以 $${rows} \\times ${columns} = ${answer}$ 平方单位。`,
              ],
            ),
            figure: gridFigure(rows, columns),
          };
        },
      ),
      figure: gradeDrawings["rows-of-unit-squares"],
    },
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
          "The side lengths of a rectangle tell how many unit squares would fit along each side. So you can find the area without any grid: multiply the two side lengths. If the lengths are in meters, the area is in square meters. Adding the side lengths gives something different, which belongs to perimeter and not to area.",
          "长方形的边长说明每条边能放多少个单位正方形。所以不用方格也能求面积：把两条边长相乘。如果长度以米为单位，面积就以平方米为单位。把边长相加得到的是不同的东西，属于周长，而不是面积。",
        ],
        (rng) => {
          const width = rng.int(2, 12);
          const height = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => v !== width));
          const answer = width * height;
          return {
            ...count(
              ["What is the area of this rectangle, in square centimeters?", "这个长方形的面积是多少平方厘米？"],
              answer,
              [width + height, 2 * (width + height)],
              [
                `Area is length times width: $${width} \\times ${height} = ${answer}$ square centimeters.`,
                `面积等于长乘宽：$${width} \\times ${height} = ${answer}$ 平方厘米。`,
              ],
            ),
            figure: labeledRectangleFigure(width, height, "cm"),
          };
        },
      ),
      figure: gradeDrawings2["area-of-a-rectangle-by-multiplying#multiplying-the-side-lengths"],
    },
    {
      ...earlyPoint(
        "a-side-from-the-area",
        ["A side from the area", "由面积求边"],
        [
          "Knowing the area and one side of a rectangle gives the other side, as area is the product of the two sides. So this is a multiplication fact with a missing factor, and dividing the area by the known side gives the answer. Check by multiplying the two sides, which should bring you back to the area.",
          "知道长方形的面积和一条边，就能求出另一条边，因为面积是两条边的积。所以这是缺一个因数的乘法算式，用面积除以已知的边就得到答案。把两条边相乘来检验，应该回到面积。",
        ],
        (rng) => {
          const width = rng.int(2, 12);
          const height = rng.int(2, 10);
          const area = width * height;
          return count(
            [
              `A rectangle has an area of ${area} square meters. One side is ${width} meters long. How long is the other side, in meters?`,
              `一个长方形的面积是 ${area} 平方米。一条边长 ${width} 米。另一条边长多少米？`,
            ],
            height,
            [area - width, area + width, area],
            [
              `The two sides multiply to the area, so the other side is $${area} \\div ${width} = ${height}$ meters.`,
              `两条边的积是面积，所以另一条边是 $${area} \\div ${width} = ${height}$ 米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-a-rectangle-by-multiplying#a-side-from-the-area"],
    },
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
          "Area can be added. If a shape is made of two rectangles that do not overlap, its area is the sum of their areas. So split an L-shaped room into two rectangles, find the area of each by multiplying, and add. Any way of cutting the shape gives the same answer, so choose the way with the easiest numbers.",
          "面积可以相加。如果一个图形由两个不重叠的长方形组成，它的面积就是两个面积的和。所以把 L 形的房间分成两个长方形，用乘法分别求面积，再相加。不管怎样切，答案都一样，所以要选数字最简单的切法。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const c = rng.int(2, 9);
          const d = rng.int(2, 9);
          const answer = a * b + c * d;
          return count(
            [
              `A room is made of two rectangles that do not overlap. One is ${a} m by ${b} m, and the other is ${c} m by ${d} m. What is the total area, in square meters?`,
              `一个房间由两个不重叠的长方形组成。一个是 ${a} 米乘 ${b} 米，另一个是 ${c} 米乘 ${d} 米。总面积是多少平方米？`,
            ],
            answer,
            [a + b + c + d, a * b * c * d, (a + c) * (b + d)],
            [
              `The areas are $${a} \\times ${b} = ${a * b}$ and $${c} \\times ${d} = ${c * d}$, and they add up to ${answer} square meters.`,
              `面积分别是 $${a} \\times ${b} = ${a * b}$ 和 $${c} \\times ${d} = ${c * d}$，加起来是 ${answer} 平方米。`,
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
          "A shape with a piece missing can also be handled with rectangles. Find the area of the full rectangle, find the area of the missing piece, and subtract. This is often easier than cutting the remaining shape into several parts. A garden with a pond in it, or a wall with a door, works in just this way.",
          "缺了一块的图形也可以用长方形来处理。求出完整长方形的面积和缺的那块的面积，再相减。这常常比把剩下的图形切成几部分更容易。有池塘的花园、有门的墙，都可以这样算。",
        ],
        (rng) => {
          const a = rng.int(5, 12);
          const b = rng.int(5, 10);
          const c = rng.int(2, a - 2);
          const d = rng.int(2, b - 2);
          const answer = a * b - c * d;
          return count(
            [
              `A garden is ${a} m by ${b} m. A pond inside it is ${c} m by ${d} m. What area of the garden is left for planting, in square meters?`,
              `一个花园是 ${a} 米乘 ${b} 米，里面有一个 ${c} 米乘 ${d} 米的池塘。花园里可以种花的面积是多少平方米？`,
            ],
            answer,
            [a * b, c * d, (a - c) * (b - d)],
            [
              `The garden is $${a} \\times ${b} = ${a * b}$ and the pond is $${c} \\times ${d} = ${c * d}$, so $${a * b} - ${c * d} = ${answer}$ square meters are left.`,
              `花园是 $${a} \\times ${b} = ${a * b}$，池塘是 $${c} \\times ${d} = ${c * d}$，所以剩下 $${a * b} - ${c * d} = ${answer}$ 平方米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-combined-rectangles#the-area-left-after-a-cut-out"],
    },
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
          "The perimeter is the distance all the way around a shape. To find it, add the lengths of all its sides, and do not miss any. For a rectangle, opposite sides are equal, so only two lengths are given even though there are four sides. Perimeter is a length, and so it is measured in plain units.",
          "周长是沿图形走一圈的距离。要求周长，就把所有边的长度加起来，一条也不能漏。长方形的对边相等，所以虽然有四条边，只给出两个长度。周长是长度，所以用普通的长度单位。",
        ],
        (rng) => {
          const rectangle = rng.bool();
          const width = rng.int(2, 25);
          const height = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== width));
          const sides = [rng.int(3, 20), rng.int(3, 20), rng.int(3, 20), rng.int(3, 20), rng.int(3, 20)];
          const sum = sides.reduce((total, v) => total + v, 0);
          return rectangle
            ? {
                ...count(
                  ["What is the perimeter of this rectangle, in centimeters?", "这个长方形的周长是多少厘米？"],
                  2 * (width + height),
                  [width + height, width * height],
                  [
                    `The sides are ${width}, ${height}, ${width} and ${height}, which add up to ${2 * (width + height)} centimeters.`,
                    `四条边是 ${width}、${height}、${width} 和 ${height}，加起来是 ${2 * (width + height)} 厘米。`,
                  ],
                ),
                figure: labeledRectangleFigure(width, height, "cm"),
              }
            : count(
                [
                  `A park has five sides, of lengths ${sides.join(" m, ")} m. What is its perimeter, in meters?`,
                  `一个公园有五条边，长度分别是 ${sides.join(" 米、")} 米。它的周长是多少米？`,
                ],
                sum,
                [sum - (sides[0] as number), sum + (sides[0] as number)],
                [`Add all five sides: $${sides.join(" + ")} = ${sum}$ meters.`, `把五条边相加：$${sides.join(" + ")} = ${sum}$ 米。`],
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
          "If the perimeter and all the sides but one are known, then the missing side is what is left over. Add the sides you know, and subtract that sum from the perimeter. For a rectangle, half of the perimeter is one length plus one width, which gives a quicker path. Add all the sides again to check the answer.",
          "如果知道周长，以及除一条边外的所有边，未知的边就是剩下的部分。把已知的边相加，再用周长减去这个和。对长方形来说，周长的一半是一个长加一个宽，这样更快。再把所有边加一遍来检验。",
        ],
        (rng) => {
          const rectangle = rng.bool();
          if (rectangle) {
            const width = rng.int(3, 25);
            const height = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== width));
            const perimeter = 2 * (width + height);
            return count(
              [
                `A rectangle has a perimeter of ${perimeter} cm, and one side is ${width} cm long. How long is the side next to it, in centimeters?`,
                `一个长方形的周长是 ${perimeter} 厘米，一条边长 ${width} 厘米。与它相邻的边长多少厘米？`,
              ],
              height,
              [perimeter - width, perimeter - 2 * width, width],
              [
                `Half of the perimeter is ${width + height}, which is one side of each kind. So the other side is $${width + height} - ${width} = ${height}$ cm.`,
                `周长的一半是 ${width + height}，也就是相邻两条边的和。所以另一条边是 $${width + height} - ${width} = ${height}$ 厘米。`,
              ],
            );
          }
          const known = [rng.int(3, 20), rng.int(3, 20), rng.int(3, 20)];
          const answer = rng.int(3, 20);
          const knownSum = known.reduce((total, v) => total + v, 0);
          const perimeter = knownSum + answer;
          return count(
            [
              `A shape with four sides has a perimeter of ${perimeter} m. Three of its sides are ${known.join(" m, ")} m. How long is the fourth side, in meters?`,
              `一个四边形的周长是 ${perimeter} 米。其中三条边是 ${known.join(" 米、")} 米。第四条边长多少米？`,
            ],
            answer,
            [knownSum, perimeter, perimeter - (known[0] as number)],
            [
              `The three known sides add up to ${knownSum}, so the fourth is $${perimeter} - ${knownSum} = ${answer}$ m.`,
              `已知的三条边加起来是 ${knownSum}，所以第四条是 $${perimeter} - ${knownSum} = ${answer}$ 米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["perimeter-of-polygons#a-missing-side-from-the-perimeter"],
    },
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
          "Rectangles can share a perimeter and still have different areas. A long thin rectangle encloses little space, and one that is close to a square encloses more. List the whole-number sides that give the perimeter, with their areas. Looking through this list shows the pattern, and it answers questions about the largest or the smallest area.",
          "长方形可以周长相同，而面积不同。又细又长的长方形围住的空间少，接近正方形的围住的空间多。列出能得到这个周长的整数边长，以及它们的面积。看一看这张表就能发现规律，也能回答关于最大或最小面积的问题。",
        ],
        (rng) => {
          const half = rng.int(6, 20);
          const largest = rng.bool();
          const answer = largest ? Math.floor(half / 2) * Math.ceil(half / 2) : half - 1;
          return count(
            [
              `A rectangle with whole-number sides has a perimeter of ${2 * half} cm. What is the ${largest ? "largest" : "smallest"} area it can have, in square centimeters?`,
              `一个边长为整数的长方形，周长是 ${2 * half} 厘米。它的面积${largest ? "最大" : "最小"}是多少平方厘米？`,
            ],
            answer,
            [2 * half, half, largest ? (Math.floor(half / 2) - 1) * (Math.ceil(half / 2) + 1) : 2 * (half - 2)],
            largest
              ? [
                  `The two sides next to each other add up to ${half}. The closer together they are, the larger the area, so the best is $${Math.floor(half / 2)} \\times ${Math.ceil(half / 2)} = ${answer}$.`,
                  `相邻两条边的和是 ${half}。两条边越接近，面积越大，所以最大是 $${Math.floor(half / 2)} \\times ${Math.ceil(half / 2)} = ${answer}$。`,
                ]
              : [
                  `The two sides next to each other add up to ${half}. The further apart they are, the smaller the area, so the least is $1 \\times ${half - 1} = ${answer}$.`,
                  `相邻两条边的和是 ${half}。两条边相差越大，面积越小，所以最小是 $1 \\times ${half - 1} = ${answer}$。`,
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
          "Rectangles with the same area can have different perimeters too. Each factor pair of the area gives one rectangle. Spreading the squares out into a long row makes the perimeter large, and gathering them nearer to a square makes it small. So a farmer who wants the least fence for a given field would choose a shape close to a square.",
          "面积相同的长方形，周长也可以不同。面积的每一对因数都给出一个长方形。把正方形排成长长的一行，周长就大；聚拢成接近正方形，周长就小。所以农民要用最少的篱笆围一块一定面积的地，会选接近正方形的形状。",
        ],
        (rng) => {
          const width = rng.int(2, 9);
          const height = rng.int(width + 1, 12);
          const area = width * height;
          const answer = 2 * (width + height);
          return count(
            [
              `A rectangle has an area of ${area} square cm, and one of its sides is ${width} cm long. What is its perimeter, in centimeters?`,
              `一个长方形的面积是 ${area} 平方厘米，一条边长 ${width} 厘米。它的周长是多少厘米？`,
            ],
            answer,
            [width + height, area, 2 * area, 4 * width],
            [
              `The other side is $${area} \\div ${width} = ${height}$ cm. So the perimeter is $2 \\times (${width} + ${height}) = ${answer}$ cm.`,
              `另一条边是 $${area} \\div ${width} = ${height}$ 厘米。所以周长是 $2 \\times (${width} + ${height}) = ${answer}$ 厘米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["same-perimeter-or-same-area#the-perimeter-of-a-rectangle-with-a-given-area"],
    },
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
          "A quadrilateral is any shape with four straight sides. A rectangle has four square corners. A rhombus has four equal sides. A square has both of these features, so a square is also a rectangle and a rhombus. A trapezoid has exactly one pair of parallel sides, that is, two sides that stay the same distance apart and never meet. A shape that belongs to a smaller group always belongs to the larger group that contains it as well.",
          "四边形是有四条直边的图形。长方形有四个直角。菱形有四条相等的边。正方形这两点都有，所以正方形也是长方形和菱形。梯形恰好有一组平行的边，也就是两条距离处处相等、永远不会相交的边。属于小类的图形，也总是属于包含它的大类。",
        ],
        (rng) => {
          const a = rng.int(3, 20);
          const b = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((v) => v !== a));
          const long = Math.max(a, b);
          const short = Math.min(a, b);
          const facts = [
            {
              en: `four square corners and four sides of ${a} cm`,
              zh: `四个直角和四条 ${a} 厘米的边`,
              right: t("Square", "正方形"),
              why: t("Square corners and equal sides together make a square.", "直角和相等的边合起来就是正方形。"),
            },
            {
              en: `four square corners, with two sides of ${long} cm and two sides of ${short} cm`,
              zh: `四个直角，两条边 ${long} 厘米，另外两条边 ${short} 厘米`,
              right: t("Rectangle", "长方形"),
              why: t(
                "Four square corners make a rectangle, and the unequal sides rule out a square.",
                "四个直角是长方形，边不相等就不是正方形。",
              ),
            },
            {
              en: `four sides of ${a} cm, but corners that are not square`,
              zh: `四条 ${a} 厘米的边，但角不是直角`,
              right: t("Rhombus", "菱形"),
              why: t(
                "Four equal sides make a rhombus, and without square corners it is not a square.",
                "四条边相等是菱形，没有直角就不是正方形。",
              ),
            },
            {
              en: `exactly one pair of parallel sides, of ${long} cm and ${short} cm`,
              zh: `恰好一组对边平行，长度是 ${long} 厘米和 ${short} 厘米`,
              right: t("Trapezoid", "梯形"),
              why: t("Exactly one pair of parallel sides is what makes a trapezoid.", "恰好一组对边平行就是梯形。"),
            },
          ];
          const fact = rng.pick(facts);
          const all = [t("Square", "正方形"), t("Rectangle", "长方形"), t("Rhombus", "菱形"), t("Trapezoid", "梯形")];
          return pickChoice(
            rng,
            t(`A quadrilateral has ${fact.en}. What is the best name for it?`, `一个四边形有${fact.zh}。它最确切的名称是什么？`),
            fact.right,
            all.filter((o) => o.en !== fact.right.en),
            fact.why,
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
          "When sorting, check the feature itself, and not the name or how the shape happens to look. A square turned on its corner is still a square. Rectangles, rhombuses and squares all have opposite sides that are parallel. Going through each shape in a list one by one, and asking the question each time, avoids most mistakes.",
          "分类时要检查特征本身，而不是名称或图形碰巧的样子。转了个角度的正方形还是正方形。长方形、菱形和正方形的对边都平行。把列表中的图形逐个过一遍，每次都问一问，就能避免大多数差错。",
        ],
        (rng) => {
          const squares = rng.int(1, 6);
          const rectangles = rng.int(1, 6);
          const rhombuses = rng.int(1, 6);
          const trapezoids = rng.int(1, 6);
          const asksEqual = rng.bool();
          const answer = squares + (asksEqual ? rhombuses : rectangles);
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
          return count(
            [
              `A box holds ${listEn}. None of the trapezoids has equal sides or square corners. How many shapes in the box have ${asksEqual ? "four equal sides" : "four square corners"}?`,
              `盒子里有${listZh}。这些梯形的边都不相等，也没有直角。盒子里有多少个图形有${asksEqual ? "四条相等的边" : "四个直角"}？`,
            ],
            answer,
            [squares, answer + other, answer + trapezoids, squares + rectangles + rhombuses + trapezoids],
            asksEqual
              ? [
                  `Squares and rhombuses have four equal sides, so $${squares} + ${rhombuses} = ${answer}$ shapes do.`,
                  `正方形和菱形都有四条相等的边，所以有 $${squares} + ${rhombuses} = ${answer}$ 个。`,
                ]
              : [
                  `Squares and rectangles have four square corners, so $${squares} + ${rectangles} = ${answer}$ shapes do.`,
                  `正方形和长方形都有四个直角，所以有 $${squares} + ${rectangles} = ${answer}$ 个。`,
                ],
          );
        },
      ),
      figure: gradeDrawings2["sorting-quadrilaterals#counting-shapes-with-a-feature"],
    },
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
        "When a shape is cut into equal parts, each part has the same area, even if the parts do not look the same. So each part is the same unit fraction of the whole. To find the area of one part, divide the whole area by the number of parts. Knowing what fraction a part is tells you this division.",
        "把图形分成相等的几部分时，每部分面积相同，即使看起来不一样。所以每部分都是整体的同一个单位分数。要求一部分的面积，就用整个面积除以份数。知道这部分是几分之一，就知道要做什么除法。",
      ],
      (rng) => {
        const parts = rng.int(2, 8);
        const each = rng.int(2, 9);
        const area = parts * each;
        return count(
          [
            `A garden with an area of ${area} square meters is cut into ${parts} parts of equal area. What is the area of one part, in square meters?`,
            `面积是 ${area} 平方米的花园被分成 ${parts} 个面积相等的部分。一部分的面积是多少平方米？`,
          ],
          each,
          [area - parts, area, parts],
          [
            `Each part is $\\frac{1}{${parts}}$ of the garden, and $${area} \\div ${parts} = ${each}$ square meters.`,
            `每部分是花园的 $\\frac{1}{${parts}}$，$${area} \\div ${parts} = ${each}$ 平方米。`,
          ],
        );
      },
    ),
    {
      ...earlyPoint(
        "the-area-of-several-parts",
        ["The area of several parts", "几部分的面积"],
        [
          "A fraction of a shape with a known area can be found in two steps. The denominator says how many equal parts to cut, so dividing gives the area of one part. The numerator says how many of these parts to take, so multiplying gives the area wanted. Working in the order divide and then multiply keeps the numbers small.",
          "已知面积的图形，它的几分之几可以分两步求。分母说明要分成几份，所以用除法得到一份的面积。分子说明要取几份，所以用乘法得到要求的面积。先除后乘，数字就比较小。",
        ],
        (rng) => {
          const d = rng.int(3, 8);
          const n = rng.int(2, d - 1);
          const each = rng.int(2, 9);
          const area = d * each;
          const answer = n * each;
          return count(
            [
              `A wall has an area of ${area} square meters. What is the area of $\\frac{${n}}{${d}}$ of the wall, in square meters?`,
              `一面墙的面积是 ${area} 平方米。这面墙的 $\\frac{${n}}{${d}}$ 的面积是多少平方米？`,
            ],
            answer,
            [each, area - answer, area * n],
            [
              `One part is $${area} \\div ${d} = ${each}$ square meters, so ${n} parts are $${n} \\times ${each} = ${answer}$ square meters.`,
              `一份是 $${area} \\div ${d} = ${each}$ 平方米，所以 ${n} 份是 $${n} \\times ${each} = ${answer}$ 平方米。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["equal-parts-of-shapes#the-area-of-several-parts"],
    },
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
