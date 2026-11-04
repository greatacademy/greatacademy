// 1st Grade Math: comparing and measuring lengths, telling time to the hour and
// half hour, tallies and first graphs, and the attributes, composition and equal
// shares of shapes.

import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
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
  nearbyWrong,
  pictureGraphFigure,
  polygonFigure,
  slicedCircleFigure,
  tallyFigure,
} from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { plural } from "./grade-2-numbers-operations.ts";
import { pickChoice } from "./grade-4-fractions.ts";

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

/** letter names a choice that reads the same in both languages. */
const letter = (label: string): Text => t(label, label);

/** barName names a lettered bar as an option, since a bare letter would clash with the A, B, C keys of the player. */
const barName = (label: string): Text => t(`Bar ${label}`, `长条 ${label}`);

/** groupName names a lettered row or bar of a graph as an option, for the same reason. */
const groupName = (label: string): Text => t(`Group ${label}`, `${label} 组`);

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
        "To compare lengths fairly, line things up so that they all start at the same place. Then look at where each one ends. The one that reaches farthest is the longest, and the one that stops soonest is the shortest. If the starts were not lined up, a short thing could look long just because it began farther along.",
        "要公平地比较长度，就把东西排齐，让它们从同一个地方开始。然后看每个东西的另一头到哪里。伸得最远的最长，最先停下的最短。如果开头没有对齐，短的东西可能只因为开始得靠前，看起来就长了。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const lengths = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 4);
        const asksLongest = rng.bool();
        const target = asksLongest ? Math.max(...lengths) : Math.min(...lengths);
        const correct = labels[lengths.indexOf(target)] as string;
        return pickChoice(
          rng,
          t(`Which bar is the ${asksLongest ? "longest" : "shortest"}?`, `哪个长条${asksLongest ? "最长" : "最短"}？`),
          barName(correct),
          labels.filter((label) => label !== correct).map(barName),
          t(
            `All the bars start at the same line, and bar ${correct} ${asksLongest ? "reaches the farthest" : "stops the soonest"}.`,
            `所有长条都从同一条线开始，长条 ${correct} ${asksLongest ? "伸得最远" : "最先停下"}。`,
          ),
          lengthBarsFigure(labels, lengths),
        );
      },
    ),
    earlyPoint(
      "comparing-through-a-third-object",
      ["Comparing through a third object", "借助第三个物体比较"],
      [
        "Sometimes two things cannot be set side by side, so we compare each of them with a third thing. If a rope is longer than a stick, and the stick is longer than a ribbon, then the rope must be longer than the ribbon too. The stick in the middle links the other two, so they never need to meet.",
        "有时两个东西不能放在一起比，我们就把它们分别和第三个东西比。如果绳子比木棍长，木棍又比丝带长，那么绳子一定也比丝带长。中间的木棍把另外两个联系起来，所以它们不用放在一起。",
      ],
      (rng) => {
        const [long, middle, short] = rng.sample(comparedObjects, 3) as [
          (typeof comparedObjects)[number],
          (typeof comparedObjects)[number],
          (typeof comparedObjects)[number],
        ];
        const asksLongest = rng.bool();
        const correct = asksLongest ? long : short;
        const option = (object: (typeof comparedObjects)[number]) => t(`The ${object.en}`, object.zh);
        return pickChoice(
          rng,
          t(
            `The ${long.en} is longer than the ${middle.en}. The ${middle.en} is longer than the ${short.en}. Which is the ${asksLongest ? "longest" : "shortest"}?`,
            `${long.zh}比${middle.zh}长。${middle.zh}比${short.zh}长。哪个${asksLongest ? "最长" : "最短"}？`,
          ),
          option(correct),
          [option(asksLongest ? short : long), option(middle), t("They are all the same length", "它们一样长")],
          t(
            `From longest to shortest, the order is ${long.en}, ${middle.en}, ${short.en}.`,
            `从长到短的顺序是${long.zh}、${middle.zh}、${short.zh}。`,
          ),
        );
      },
    ),
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
        "We can measure a length by laying same-size objects end to end and counting them. There must be no gaps between them and no overlaps, and they must start right at the beginning of the thing we measure. Then the count tells the length: a bar that takes 7 paper clips to cover is 7 paper clips long.",
        "可以把大小相同的物体首尾相接地排起来，再数一数，这样就能量出长度。它们之间不能有空隙，也不能重叠，而且要从被测物体的最开头开始。数出的个数就是长度：要 7 个回形针才能盖满的长条，长度就是 7 个回形针。",
      ],
      (rng) => {
        const unit = rng.pick(lengthUnits);
        const [a, b] = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
        const asksFirst = rng.bool();
        const label = asksFirst ? "A" : "B";
        const answer = asksFirst ? a : b;
        return whole(
          [
            `Each section of these bars is one ${unit.en} long. How long is bar ${label}, in ${unit.many}?`,
            `这些长条的每一格和一${unit.zh}一样长。长条 ${label} 有多长，是几${unit.zh}？`,
          ],
          answer,
          [asksFirst ? b : a, a + b, answer + 1],
          [
            `Bar ${label} has ${answer} sections, so it is ${answer} ${unit.many} long.`,
            `长条 ${label} 有 ${answer} 格，所以它长 ${answer} ${unit.zh}。`,
          ],
          lengthBarsFigure(["A", "B"], [a, b], true),
        );
      },
    ),
    earlyPoint(
      "how-many-units-longer",
      ["How many units longer", "长多少个单位"],
      [
        "Once two things are measured with the same unit, their lengths are just numbers, and you can compare them. The difference tells how many units longer one thing is than the other. This works only if both were measured with the same unit, since a count of paper clips and a count of craft sticks would not match.",
        "两个东西用同样的单位量过之后，它们的长度就只是两个数，可以比较了。两数的差说明一个东西比另一个长多少个单位。只有两个东西用同样的单位量才行，因为回形针的个数和小棒的根数对不上。",
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
        return whole(
          [
            `Each section is one ${unit.en} long. How many ${unit.many} longer is bar ${longLabel} than bar ${shortLabel}?`,
            `每一格和一${unit.zh}一样长。长条 ${longLabel} 比长条 ${shortLabel} 长几${unit.zh}？`,
          ],
          answer,
          [longer, shorter, longer + shorter],
          [
            `Bar ${longLabel} has ${longer} sections and bar ${shortLabel} has ${shorter}, and $${longer} - ${shorter} = ${answer}$.`,
            `长条 ${longLabel} 有 ${longer} 格，长条 ${shortLabel} 有 ${shorter} 格，$${longer} - ${shorter} = ${answer}$。`,
          ],
          lengthBarsFigure(["A", "B"], [a, b], true),
        );
      },
    ),
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
        "A clock has a short hand and a long hand. The short hand tells the hour, and the long hand tells the minutes. When the long hand points straight up at the 12, the time is exactly on the hour. Then you read the number under the short hand, and you can write the time with two zeros, as in 3:00.",
        "钟面上有一根短针和一根长针。短针表示几时，长针表示几分。长针正好指向上面的 12 时，就是整点。这时读出短针指的数，时间可以写成后面带两个零的样子，比如 3:00。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const option = (h: number) => letter(`${h}:00`);
        return pickChoice(
          rng,
          t("What time does this clock show?", "这个钟表示几时？"),
          option(hour),
          rng.sample(
            [
              option(clockHour(hour + 1)),
              option(clockHour(hour - 1)),
              option(clockHour(hour + 6)),
              letter(`${hour}:12`),
              letter(`${hour === 12 ? 6 : 12}:${hour === 12 ? "00" : `${hour * 5}`.padStart(2, "0")}`),
            ],
            3,
          ),
          t(
            `The long hand is at the 12 and the short hand is at the ${hour}, so the time is ${hour}:00.`,
            `长针指向 12，短针指向 ${hour}，所以时间是 ${hour}:00。`,
          ),
          clockFigure(hour, 0),
        );
      },
    ),
    earlyPoint(
      "where-the-hands-point-on-the-hour",
      ["Where the hands point on the hour", "整点时指针的位置"],
      [
        "You can also picture a clock from the time alone. On the hour, the long hand is always at the 12, whatever the hour may be. Only the short hand moves on to a new number for each new hour. So at 8 o'clock, the short hand is at the 8, while the long hand has gone all the way round to the 12.",
        "只知道时间，也能想象出钟面的样子。整点时，不管是几点，长针总是指向 12。每过一小时，只有短针走到一个新的数。所以 8 点时，短针指向 8，而长针已经转了一整圈，回到 12。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        if (rng.int(0, 2) === 0) {
          return whole(
            [
              `The short hand points to the ${hour} and the long hand points to the 12. What hour is it?`,
              `短针指向 ${hour}，长针指向 12。现在是几点？`,
            ],
            hour,
            [clockHour(hour + 1), clockHour(hour - 1), hour === 12 ? 6 : 12],
            [
              `The long hand at the 12 means exactly on the hour, and the short hand gives the hour: ${hour} o'clock.`,
              `长针指向 12 表示整点，短针说明是几点：${hour} 点。`,
            ],
          );
        }
        return rng.bool()
          ? whole(
              [`It is ${hour} o'clock. Which number does the short hand point to?`, `现在是 ${hour} 点。短针指向哪个数？`],
              hour,
              [clockHour(hour + 1), clockHour(hour + 6), 12],
              [
                `The short hand tells the hour, so at ${hour} o'clock it points to the ${hour}.`,
                `短针表示几时，所以 ${hour} 点时它指向 ${hour}。`,
              ],
            )
          : whole(
              [`It is ${hour} o'clock. Which number does the long hand point to?`, `现在是 ${hour} 点。长针指向哪个数？`],
              12,
              [hour, 6, 1, 3],
              ["On the hour, the long hand always points straight up at the 12.", "整点时，长针总是指向上面的 12。"],
            );
      },
    ),
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
        "When the long hand points straight down at the 6, it has gone half way around the clock, so half an hour has passed. Meanwhile the short hand has moved half way to the next number. The hour is the number it has just passed, not the one it is heading for. So half past 4 is written 4:30.",
        "长针正好指向下面的 6 时，它走了半圈，也就是过了半小时。这时短针也走到了去下一个数的半路上。几时要看它刚刚走过的那个数，而不是它正要去的那个数。所以 4 点半写作 4:30。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const next = clockHour(hour + 1);
        return pickChoice(
          rng,
          t("What time does this clock show?", "这个钟表示几时？"),
          letter(`${hour}:30`),
          rng.sample(
            [letter(`${next}:30`), letter(`${hour}:00`), letter(`${next}:00`), letter(`${clockHour(hour - 1)}:30`), letter(`${hour}:06`)],
            3,
          ),
          t(
            `The long hand is at the 6, which means 30 minutes. The short hand has just passed the ${hour}, so the time is ${hour}:30.`,
            `长针指向 6，表示 30 分。短针刚刚走过 ${hour}，所以时间是 ${hour}:30。`,
          ),
          clockFigure(hour, 30),
        );
      },
    ),
    earlyPoint(
      "half-past-in-words",
      ["Half past in words", "用文字说半点"],
      [
        "Half past 7 and 7:30 are two ways of saying the same time. It comes half an hour after 7:00 and half an hour before 8:00, and that is why the short hand sits between the 7 and the 8. Thinking about where the hands sit will help you read a clock, even without any digits to look at.",
        "7 点半和 7:30 是同一个时间的两种说法。它比 7:00 晚半小时，比 8:00 早半小时，所以短针在 7 和 8 中间。想一想指针的位置，就算没有数字可看，也能帮你读懂钟面。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const next = clockHour(hour + 1);
        const between = (a: number) => t(`Between the ${a} and the ${clockHour(a + 1)}`, `在 ${a} 和 ${clockHour(a + 1)} 之间`);
        if (rng.int(0, 2) === 0) {
          return whole(
            [`It is half past ${hour}. Which number does the long hand point to?`, `现在是 ${hour} 点半。长针指向哪个数？`],
            6,
            [12, hour === 6 ? 7 : hour, 3, 30],
            [
              `At half past, the long hand has gone half way around the clock, so it points straight down at the 6.`,
              `半点时，长针走了半圈，所以它指向下面的 6。`,
            ],
          );
        }
        return rng.bool()
          ? pickChoice(
              rng,
              t(`How do you write half past ${hour}?`, `${hour} 点半怎么写？`),
              letter(`${hour}:30`),
              [letter(`${clockHour(hour - 1)}:30`), letter(`${hour}:00`), letter(`${next}:30`)],
              t(
                `Half past means 30 minutes after the hour, so half past ${hour} is ${hour}:30.`,
                `半点就是整点过 30 分，所以 ${hour} 点半是 ${hour}:30。`,
              ),
            )
          : pickChoice(
              rng,
              t(`It is half past ${hour}. Where is the short hand?`, `现在是 ${hour} 点半。短针在哪里？`),
              between(hour),
              [between(clockHour(hour - 1)), between(next), between(clockHour(hour + 6))],
              t(
                `Half past ${hour} is half way from ${hour}:00 to ${next}:00, so the short hand is between the ${hour} and the ${next}.`,
                `${hour} 点半在 ${hour}:00 和 ${next}:00 的正中间，所以短针在 ${hour} 和 ${next} 之间。`,
              ),
            );
      },
    ),
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

/** GraphMark says how a tally or graph shows its items, and what part of it holds one category's count. */
type GraphMark = {
  readonly en: (one: string, many: string) => string;
  readonly zh: (zhOne: string) => string;
  readonly place: readonly [string, string];
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
  if (rng.bool()) {
    const i = rng.int(0, 3);
    const answer = values[i] as number;
    const label = graphLabels[i] as string;
    const others = values.filter((v) => v !== answer);
    return whole(
      [`${lead[0]} How many ${story.many} does ${label} have?`, `${lead[1]}${label} 有多少${story.zhOne}？`],
      answer,
      [...others, answer + 1],
      [
        `The ${mark.place[0]} for ${label} shows ${plural(answer, story.one)}.`,
        `${label} 的那一${mark.place[1]}表示 ${answer} ${story.zhOne}。`,
      ],
      figure,
    );
  }
  const asksMost = rng.bool();
  const target = asksMost ? Math.max(...values) : Math.min(...values);
  const correct = graphLabels[values.indexOf(target)] as string;
  return pickChoice(
    rng,
    t(
      `${lead[0]} Which has the ${asksMost ? "most" : "fewest"} ${story.many}?`,
      `${lead[1]}哪一组的${story.zhMark}${asksMost ? "最多" : "最少"}？`,
    ),
    groupName(correct),
    graphLabels.filter((label) => label !== correct).map(groupName),
    t(
      `${correct} has ${plural(target, story.one)}, and that is ${asksMost ? "more" : "fewer"} than each of the others.`,
      `${correct} 有 ${target} ${story.zhOne}，${asksMost ? "比其他的都多" : "比其他的都少"}。`,
    ),
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
  if (rng.bool()) {
    return whole(
      [`${lead[0]} How many ${story.many} do ${la} and ${lb} have together?`, `${lead[1]}${la} 和 ${lb} 一共有多少${story.zhOne}？`],
      a + b,
      [a, b, Math.abs(a - b)],
      [`${la} has ${a} and ${lb} has ${b}, and $${a} + ${b} = ${a + b}$.`, `${la} 有 ${a}，${lb} 有 ${b}，$${a} + ${b} = ${a + b}$。`],
      figure,
    );
  }
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const bigLabel = a > b ? la : lb;
  const smallLabel = a > b ? lb : la;
  return whole(
    [
      `${lead[0]} How many more ${story.many} does ${bigLabel} have than ${smallLabel}?`,
      `${lead[1]}${bigLabel} 比 ${smallLabel} 多多少${story.zhOne}？`,
    ],
    big - small,
    [big, small, big + small],
    [
      `${bigLabel} has ${big} and ${smallLabel} has ${small}, and $${big} - ${small} = ${big - small}$.`,
      `${bigLabel} 有 ${big}，${smallLabel} 有 ${small}，$${big} - ${small} = ${big - small}$。`,
    ],
    figure,
  );
}

/** tallyMark says how a tally chart shows one item. */
const tallyMark: GraphMark = {
  en: (one) => `Each tally mark stands for one ${one}`,
  zh: (zhOne) => `每一笔代表一${zhOne}`,
  place: ["row", "行"],
};

/** dotMark says how a picture graph shows one item. */
const dotMark: GraphMark = { en: (one) => `Each dot stands for one ${one}`, zh: (zhOne) => `每个点代表一${zhOne}`, place: ["row", "行"] };

/** barMark says how a bar graph shows its items. */
const barMark: GraphMark = {
  en: (_one, many) => `The height of each bar shows how many ${many}`,
  zh: (zhOne) => `条的高度表示有多少${zhOne}`,
  place: ["bar", "条"],
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
        "A tally mark is a quick line drawn for each thing as you count it. Every fifth mark crosses the four before it, and this makes a bundle of five. To read a tally, count the bundles by fives and then count on by ones for the marks left over. So two bundles and three more marks make 13.",
        "计数符号就是每数一个东西就很快地画一笔。每五笔中的第五笔横穿前面四笔，这样就成了一捆五个。读的时候，先按五数一捆一捆的，再一个一个地数剩下的笔画。所以两捆再加三笔是 13。",
      ],
      (rng) => {
        const values = graphValues(rng, 2, 14);
        return readingFromGraph(rng, tallyMark, values, tallyFigure(graphLabels, values));
      },
    ),
    earlyPoint(
      "comparing-with-tally-marks",
      ["Comparing with tally marks", "用计数符号比较"],
      [
        "Once you have read the rows of a tally, you can use the numbers to ask new questions. Add two rows to find how many they have together. Take the smaller number from the larger to find how many more one row has. A chart gives you these answers without having to go and count everything all over again.",
        "读出计数表的每一行以后，就可以用这些数回答新的问题。把两行相加，就知道它们一共有多少。用较大的数减较小的数，就知道一行比另一行多多少。有了这张表，就不用再把所有东西重新数一遍了。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 10);
        return comparingOnGraph(rng, tallyMark, values, tallyFigure(graphLabels, values));
      },
    ),
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
        "A picture graph shows how many there are in each group by giving each thing its own dot. Each row belongs to one group, and its label is at the start of the row. Count the dots in a row to find how many are in that group. The row that stretches farthest has the most, if the dots are all the same size.",
        "象形统计图给每个东西画一个点，用来表示每组有多少。每一行属于一组，开头写着这组的标记。数一数一行里的点，就知道这组有多少。点的大小都一样时，伸得最远的那一行最多。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 9);
        return readingFromGraph(rng, dotMark, values, pictureGraphFigure(graphLabels, values, 1));
      },
    ),
    earlyPoint(
      "comparing-on-a-picture-graph",
      ["Comparing on a picture graph", "在象形统计图上比较"],
      [
        "A picture graph makes it easy to compare groups. The dots in two rows line up one above the other, so you can match them in pairs. The dots with no partner show how many more one row has. To find how many two rows have together, count all the dots in both rows, or add up the two counts.",
        "象形统计图很方便比较。两行的点上下对齐，可以一对一对地配起来。没有伙伴的点，就说明一行比另一行多多少。要知道两行一共有多少，就数两行所有的点，或者把两个数相加。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 9);
        return comparingOnGraph(rng, dotMark, values, pictureGraphFigure(graphLabels, values, 1));
      },
    ),
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
        "A bar graph uses the height of a bar in place of a row of dots. To read a bar, look at where its top lies, then follow that level across to the numbers at the side. That number tells you how many are in that group. The tallest bar has the most, and the shortest bar has the fewest.",
        "条形统计图用条的高度代替一行点。读一个条时，先看它的顶端在哪里，再沿着这个高度横着看到旁边的数。这个数就说明这组有多少。最高的条最多，最矮的条最少。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 10);
        return readingFromGraph(rng, barMark, values, barGraphFigure(graphLabels, values, 1));
      },
    ),
    earlyPoint(
      "comparing-on-a-bar-graph",
      ["Comparing on a bar graph", "在条形统计图上比较"],
      [
        "To compare two bars, read each one against the numbers at the side. The gap between their tops shows how many more one bar has, and you can count the steps of that gap or subtract the numbers. To find how many two bars have together, read them both and add. Reading each bar with care comes first in either case.",
        "比较两个条时，先对着旁边的数读出每个条。两个顶端之间的差距说明一个条比另一个多多少，可以数差距有几格，也可以用减法。要知道两个条一共有多少，就把它们都读出来再相加。无论哪种，都要先仔细读好每个条。",
      ],
      (rng) => {
        const values = graphValues(rng, 1, 10);
        return comparingOnGraph(rng, barMark, values, barGraphFigure(graphLabels, values, 1));
      },
    ),
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
        "A side is a straight edge of a shape, and a corner is where two sides meet. To count them without losing your place, begin at one corner and go around the shape in one direction until you get back to where you began. A closed shape with straight sides has just as many corners as it has sides.",
        "边是图形的一条直的边缘，角是两条边相遇的地方。要想数的时候不乱，就从一个角开始，沿着一个方向绕图形走一圈，回到开始的地方。由直边围成的封闭图形，角的个数和边的条数一样多。",
      ],
      (rng) => {
        const outline = rng.pick(shapeOutlines);
        const nudged = outline.points.map(
          ([x, y]) => [Math.min(10, x + rng.int(0, 1) * 0.5), Math.min(10, y + rng.int(0, 1) * 0.5)] as const,
        );
        const figure = polygonFigure(nudged, t("A closed shape with straight sides.", "一个由直边围成的封闭图形。"));
        const n = outline.sides;
        return rng.bool()
          ? whole(
              ["How many sides does this shape have?", "这个图形有几条边？"],
              n,
              [n - 1, n + 1, 2 * n],
              [`Going around the shape, you count ${n} straight sides.`, `绕图形一圈，数出 ${n} 条直边。`],
              figure,
            )
          : whole(
              ["How many corners does this shape have?", "这个图形有几个角？"],
              n,
              [n - 1, n + 1, 2 * n],
              [`Going around the shape, you count ${n} corners.`, `绕图形一圈，数出 ${n} 个角。`],
              figure,
            );
      },
    ),
    earlyPoint(
      "what-makes-a-shape-that-shape",
      ["What makes a shape that shape", "什么决定一个图形"],
      [
        "A shape gets its name from its sides and corners, and nothing else. A triangle is a triangle because it has 3 straight sides, whether it is big or small, red or blue, and however it is turned. So when you decide what a shape is, count its sides and corners, and pay no attention to its color or size.",
        "图形的名字只由它的边和角决定。三角形之所以是三角形，是因为它有 3 条直边，不管它是大是小、是红是蓝，也不管它怎么摆放。所以判断一个图形时，要数它的边和角，不用管它的颜色和大小。",
      ],
      (rng) => {
        const fact = rng.pick(shapeFacts);
        if (rng.bool()) {
          const other = rng.pick(shapeFacts.filter((candidate) => candidate !== fact));
          const wrongRule = t(other.rule[0], other.rule[1]);
          return pickChoice(
            rng,
            t(`Which of these is true of every ${fact.en}?`, `下面哪一句对所有的${fact.zh}都成立？`),
            t(fact.rule[0], fact.rule[1]),
            [
              wrongRule,
              ...rng.sample(
                [
                  t("It is red.", "它是红色的。"),
                  t("It is small enough to hold in your hand.", "它小得可以拿在手里。"),
                  t("It has a dot in the middle.", "它中间有一个点。"),
                  t("It is blue.", "它是蓝色的。"),
                  t("It is bigger than a book.", "它比一本书大。"),
                ],
                2,
              ),
            ],
            t(
              `Sides and corners decide what a ${fact.en} is, and color and size do not matter. ${fact.rule[0]}`,
              `边和角决定${fact.zh}是什么，颜色和大小无关紧要。${fact.rule[1]}`,
            ),
          );
        }
        const others = rng.sample(
          shapeFacts.filter((other) => other !== fact),
          3,
        );
        const article = (name: string) => (name === "hexagon" ? "A hexagon" : `A ${name}`);
        return pickChoice(
          rng,
          t(`Which shape is this? ${fact.rule[0]}`, `这是什么图形？${fact.rule[1]}`),
          t(article(fact.en), fact.zh),
          others.map((other) => t(article(other.en), other.zh)),
          t(`That is what makes a shape a ${fact.en}.`, `这正是${fact.zh}的特征。`),
        );
      },
    ),
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
        "Shapes can be joined to build new shapes. When two pieces touch along a side, that side ends up inside and no longer counts. To name what you have built, look only at the outer edge. Count its sides and corners, or see that it is round, and then ask which shape has exactly that kind of outline.",
        "图形可以拼成新的图形。两块沿一条边拼在一起时，这条边到了里面，就不算了。要说出拼成的是什么，只看外面的边框。数一数它的边和角，或者看它是不是圆的，再想一想哪种图形的边框是这样的。",
      ],
      (rng) => {
        const item = rng.pick(compositions);
        return pickChoice(
          rng,
          t(`Put together ${item.pieces[0]}, with no gaps. Which shape do you get?`, `把${item.pieces[1]}，不留空隙。得到什么图形？`),
          t(item.answer[0], item.answer[1]),
          rng.sample<readonly [string, string]>(item.wrong, 3).map(([en, zh]) => t(en, zh)),
          t(item.why[0], item.why[1]),
          { svg: svgDocument(120, item.body), alt: piecesAlt },
        );
      },
    ),
    earlyPoint(
      "pieces-to-finish-a-shape",
      ["Pieces to finish a shape", "还要几块才能拼好"],
      [
        "A big shape can be built from many small pieces of the same shape. Think of a rectangle being covered with square tiles, some of them already in place. To finish it, you need one tile for each empty space. Count the empty spaces, or count them all and take away the ones already filled, and you know how many are needed.",
        "一个大图形可以由许多相同的小块拼成。想象用正方形瓷砖铺一个长方形，有些已经铺好了。要铺完，每个空位需要一块瓷砖。数一数空位，或者数出总数再减去已经铺好的，就知道还需要多少块。",
      ],
      (rng) => {
        const rows = rng.int(2, 4);
        const columns = rng.int(2, 6);
        const total = rows * columns;
        const placed = rng.int(1, total - 1);
        const answer = total - placed;
        return whole(
          [
            "The shaded squares are already in place. How many more squares will finish this rectangle?",
            "涂色的小正方形已经拼好了。还要多少个小正方形才能拼好这个长方形？",
          ],
          answer,
          [placed, total, rows + columns],
          [
            `The rectangle holds ${total} squares and ${placed} are placed, and $${total} - ${placed} = ${answer}$.`,
            `这个长方形一共有 ${total} 个小正方形，已经拼好 ${placed} 个，$${total} - ${placed} = ${answer}$。`,
          ],
          gridFigure(rows, columns, placed),
        );
      },
    ),
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
        "To be fair, shares must be the same size. If you cut a bar into two parts of the same size, each part is a half. If you cut it into four parts of the same size, each part is a fourth. Having the right number of parts is not enough, as a bar cut into two unequal parts has not been cut in half.",
        "要公平，每一份就必须一样大。把一个长条分成同样大的两部分，每部分就是它的二分之一。分成同样大的四部分，每部分就是它的四分之一。只有份数对还不够，分成不一样大的两部分，就不算平均分成两半。",
      ],
      (rng) => {
        const halves = rng.bool();
        const labels = ["A", "B", "C", "D"];
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
        const name = halves ? ["halves", "二等份", "2"] : ["fourths", "四等份", "4"];
        return pickChoice(
          rng,
          t(`Which bar is cut into ${name[0]}?`, `哪个长条被分成了${name[1]}？`),
          t(`Bar ${correct}`, `长条 ${correct}`),
          labels.filter((label) => label !== correct).map((label) => t(`Bar ${label}`, `长条 ${label}`)),
          t(
            `Only bar ${correct} has exactly ${name[2]} parts that are all the same size.`,
            `只有长条 ${correct} 正好分成 ${name[2]} 个一样大的部分。`,
          ),
          cutBarsFigure(labels, rows),
        );
      },
    ),
    earlyPoint(
      "naming-a-half-or-a-fourth",
      ["Naming a half or a fourth", "说出二分之一或四分之一"],
      [
        "The name of a share tells how many equal shares make up the whole thing. When there are two equal shares, each is a half, and when there are four, each is a fourth, which some people call a quarter. So look at how many equal shares the whole thing has been cut into, not only at the part that is shaded.",
        "一份的名字说明整个东西被平均分成了几份。平均分成两份，每份是二分之一，也就是一半；平均分成四份，每份是四分之一。所以要看整个东西被分成了几份，不要只看涂色的那一部分。",
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
                alt: t(
                  `A rectangle cut into ${parts} equal shares, one of them shaded.`,
                  `一个长方形被平均分成 ${parts} 份，其中一份涂了颜色。`,
                ),
              };
        const options = {
          half: t("A half", "二分之一"),
          fourth: t("A fourth", "四分之一"),
          third: t("A third", "三分之一"),
          whole: t("The whole thing", "整个"),
        };
        return pickChoice(
          rng,
          t(`What part of the ${object.en} is shaded?`, `涂色部分是${object.zh}的多少？`),
          half ? options.half : options.fourth,
          [half ? options.fourth : options.half, options.third, options.whole],
          t(
            `The ${object.en} is cut into ${parts} equal shares, and one of them is shaded, so that is ${half ? "a half" : "a fourth"}.`,
            `${object.zh}被平均分成 ${parts} 份，其中一份涂了颜色，所以是${half ? "二分之一" : "四分之一"}。`,
          ),
          figure,
        );
      },
    ),
    earlyPoint(
      "more-shares-make-smaller-shares",
      ["More shares make smaller shares", "份数越多，每份越小"],
      [
        "Two halves make a whole, and so do four fourths. If the same thing is cut into more equal shares, then each share has to be smaller, since the same amount is being spread around more people. So a half of a pizza is bigger than a fourth of that same pizza, even though four is a bigger number than two.",
        "两个二分之一合成一个整体，四个四分之一也是。同样的东西分的份数越多，每一份就越小，因为同样多的东西要分给更多的人。所以同一个披萨的二分之一比四分之一大，尽管四比二大。",
      ],
      (rng) => {
        const object = rng.pick(sharedObjects);
        if (rng.bool()) {
          const parts = rng.pick([2, 4]);
          const name = parts === 2 ? ["halves", "二分之一"] : ["fourths", "四分之一"];
          return whole(
            [`How many ${name[0]} make one whole ${object.en}?`, `多少个${name[1]}合成一整${object.measure}${object.zh}？`],
            parts,
            [parts === 2 ? 4 : 2, parts + 1, 1],
            [
              `Cutting into ${name[0]} makes ${parts} equal shares, and together they make the whole ${object.en}.`,
              `分成${name[1]}就是平均分成 ${parts} 份，合起来就是整${object.measure}${object.zh}。`,
            ],
          );
        }
        const asksBigger = rng.bool();
        const halfOption = t(`A half of the ${object.en}`, `${object.zh}的二分之一`);
        const fourthOption = t(`A fourth of the ${object.en}`, `${object.zh}的四分之一`);
        return pickChoice(
          rng,
          t(
            `Which share of the same ${object.en} is ${asksBigger ? "bigger" : "smaller"}?`,
            `同一${object.measure}${object.zh}，哪一份${asksBigger ? "更大" : "更小"}？`,
          ),
          asksBigger ? halfOption : fourthOption,
          [asksBigger ? fourthOption : halfOption, t("They are the same size", "它们一样大"), t("It depends on the color", "要看颜色")],
          t(
            `Cutting into four shares makes smaller shares than cutting into two, so ${asksBigger ? "a half is bigger" : "a fourth is smaller"}.`,
            `分成四份比分成两份每份更小，所以${asksBigger ? "二分之一更大" : "四分之一更小"}。`,
          ),
        );
      },
    ),
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
