import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Axis, dec, dotPlot, Q } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { isTerminating, numberProblem, steps, why } from "../problems.ts";
import { type Pair, tableFigure, type Walk, type Wrong } from "./early-grades-more-kit.ts";
import { chart, intTicks, tenthTicks } from "./figure-charts.ts";
import { chosen, decided, drawn, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { boxPlotFigure } from "./statistics.ts";
import { lineFigure } from "./upper-grades-kit.ts";

// 6th Grade Math: statistical questions, measures of center and spread, outliers, frequency tables,
// and measures and shapes read from dot plots. Quartiles follow statistics.ts: they are the medians
// of the lower and upper halves, with the median itself left out when the count is odd.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

// ---------------------------------------------------------------------------
// Data helpers

/** list writes a data set: "12, 7, 9". */
const list = (xs: readonly (number | string)[]) => xs.join(", ");

/** sorted returns the values from least to greatest. */
const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);

/** sum adds the values. */
const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

/** mean is the sum of the values divided by their number. */
const mean = (xs: readonly number[]) => Q.of(sum(xs), xs.length);

/** median is the middle value of a data set, or the mean of the two middle values. */
function median(xs: readonly number[]): Q {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? Q.of(s[h]!) : Q.of(s[h - 1]! + s[h]!, 2);
}

/** halves are the lower and upper halves of the sorted data, the median left out when the count is odd. */
function halves(xs: readonly number[]): [number[], number[]] {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return [s.slice(0, h), s.slice(s.length - h)];
}

/** quartiles are the medians of the lower and upper halves. */
function quartiles(xs: readonly number[]): [Q, Q] {
  const [lower, upper] = halves(xs);
  return [median(lower), median(upper)];
}

/** inclusiveQuartiles are the quartiles found when the median is wrongly kept in both halves. */
function inclusiveQuartiles(xs: readonly number[]): [Q, Q] {
  const s = sorted(xs);
  const h = Math.ceil(s.length / 2);
  return [median(s.slice(0, h)), median(s.slice(s.length - h))];
}

/** isOutlier tells whether x lies outside the fences Q₁ − 1.5·IQR and Q₃ + 1.5·IQR of xs. */
function isOutlier(xs: readonly number[], x: number): boolean {
  const [q1, q3] = quartiles(xs);
  const k = q3.sub(q1).mul(Q.of(3, 2));
  return Q.of(x).cmp(q1.sub(k)) < 0 || Q.of(x).cmp(q3.add(k)) > 0;
}

/** unsortedMiddle is the middle of the data as listed, without sorting: a common mistake for the median. */
function unsortedMiddle(xs: readonly number[]): Q {
  const h = Math.floor(xs.length / 2);
  return xs.length % 2 === 1 ? Q.of(xs[h]!) : Q.of(xs[h - 1]! + xs[h]!, 2);
}

/** data draws n integers in [lo, hi]. */
const data = (rng: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => rng.int(lo, hi));

/** distinctData draws n different integers in [lo, hi]. */
const distinctData = (rng: Rng, n: number, lo: number, hi: number) =>
  rng.sample(
    Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
    n,
  );

/** clean tells whether a number has at most two decimal places. */
const clean = (q: Q) => q.mul(Q.of(100)).isInteger();

/** about writes "= 4.5" for a number with at most two decimal places, and "≈ 4.6" otherwise. */
function about(q: Q): string {
  if (clean(q)) return `= ${dec(q)}`;
  return `\\approx ${(Number(q.n) / Number(q.d)).toFixed(1)}`;
}

/** tenthsData draws n measurements in tenths in [lo, hi], none of them a whole number. */
const tenthsData = (rng: Rng, n: number, lo: number, hi: number) =>
  Array.from({ length: n }, () => {
    let x: number;
    do x = rng.int(lo, hi);
    while (x % 10 === 0);
    return x;
  });

/** tenthsList writes values given in tenths as decimals: [12, 5] is "1.2, 0.5". */
const tenthsList = (xs: readonly number[]) => list(xs.map((x) => dec(Q.of(x, 10))));

/** capitalize writes the first letter of an English word in upper case. */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** names are people in word problems. */
const names = ["Maya", "Leo", "Ana", "Sam", "Noah", "Mia", "Ken", "Lily"] as const;

// ---------------------------------------------------------------------------
// Introduction to statistics

/** QuestionMaker draws a survey question with its numbers: [English, Chinese]. */
type QuestionMaker = (rng: Rng) => readonly [string, string];

/** statisticalQuestions are questions whose answers are expected to vary. */
const statisticalQuestions: readonly QuestionMaker[] = [
  (rng) => {
    const r = rng.int(101, 130);
    return [`How many hours did each student in Room ${r} sleep last night?`, `${r} 教室的每个学生昨晚各睡了几个小时？`];
  },
  (rng) => {
    const n = rng.int(10, 15);
    return [`How tall is each of the ${n} players on the school basketball team?`, `学校篮球队的 ${n} 名队员各有多高？`];
  },
  (rng) => {
    const n = rng.int(5, 30);
    return [`How much rain fell in our town on each of the last ${n} days?`, `过去 ${n} 天里，我们镇每天的降雨量各是多少？`];
  },
  (rng) => {
    const g = rng.int(3, 8);
    return [`How many minutes does each student in grade ${g} take to get to school?`, `${g} 年级的每个学生上学路上各要花多少分钟？`];
  },
  (rng) => {
    const n = rng.int(12, 30);
    return [
      `What score did each of the ${n} students in a class get on yesterday's quiz?`,
      `班上 ${n} 名学生在昨天的小测验中各得了多少分？`,
    ];
  },
  (rng) => {
    const name = rng.pick(names);
    const n = rng.int(7, 30);
    return [`How many pages did ${name} read on each of the last ${n} days?`, `过去 ${n} 天里，${name} 每天各读了多少页书？`];
  },
];

/** nonStatisticalQuestions are questions with a single answer. */
const nonStatisticalQuestions: readonly QuestionMaker[] = [
  (rng) => {
    const name = rng.pick(names);
    return [`How many hours did ${name} sleep last night?`, `${name} 昨晚睡了几个小时？`];
  },
  (rng) => {
    const r = rng.int(101, 130);
    return [`How many students are in Room ${r}?`, `${r} 教室有多少个学生？`];
  },
  (rng) => {
    const name = rng.pick(names);
    return [`How tall is ${name}?`, `${name} 有多高？`];
  },
  (rng) => {
    const h = rng.int(2, 12);
    return [`How many minutes are there in ${h} hours?`, `${h} 小时是多少分钟？`];
  },
  (rng) => {
    const name = rng.pick(names);
    return [`What score did ${name} get on yesterday's quiz?`, `${name} 在昨天的小测验中得了多少分？`];
  },
  (rng) => {
    const d = rng.int(1, 31);
    return [`How much rain fell in our town on March ${d}?`, `3 月 ${d} 日我们镇的降雨量是多少？`];
  },
];

/** SurveyQuestion is a survey question, whether its answers are numbers, and two typical answers. */
interface SurveyQuestion {
  readonly question: Text;
  readonly numerical: boolean;
  readonly examples: Text;
}

/** surveyQuestions are questions a class survey might ask. */
const surveyQuestions: readonly SurveyQuestion[] = [
  {
    question: t("How many brothers and sisters do you have?", "你有几个兄弟姐妹？"),
    numerical: true,
    examples: t("$0$ or $2$", "$0$ 或 $2$"),
  },
  {
    question: t("How many minutes did you read yesterday?", "你昨天阅读了多少分钟？"),
    numerical: true,
    examples: t("$20$ or $45$", "$20$ 或 $45$"),
  },
  {
    question: t("What is your height in centimeters?", "你的身高是多少厘米？"),
    numerical: true,
    examples: t("$148$ or $155$", "$148$ 或 $155$"),
  },
  {
    question: t("How many hours did you sleep last night?", "你昨晚睡了几个小时？"),
    numerical: true,
    examples: t("$8$ or $9.5$", "$8$ 或 $9.5$"),
  },
  {
    question: t("How many books did you borrow from the library this month?", "你这个月从图书馆借了几本书？"),
    numerical: true,
    examples: t("$0$ or $4$", "$0$ 或 $4$"),
  },
  {
    question: t("How far do you live from school, in kilometers?", "你家离学校多少千米？"),
    numerical: true,
    examples: t("$1.5$ or $3$", "$1.5$ 或 $3$"),
  },
  { question: t("What is your favorite color?", "你最喜欢什么颜色？"), numerical: false, examples: t("blue or green", "蓝色或绿色") },
  { question: t("What kind of pet do you have?", "你养的是什么宠物？"), numerical: false, examples: t("a dog or a cat", "狗或猫") },
  {
    question: t("How do you usually get to school?", "你通常怎样上学？"),
    numerical: false,
    examples: t("by bus or on foot", "坐公交车或步行"),
  },
  { question: t("What is your favorite sport?", "你最喜欢什么运动？"), numerical: false, examples: t("soccer or swimming", "足球或游泳") },
  {
    question: t("Which language do you speak at home?", "你在家说什么语言？"),
    numerical: false,
    examples: t("English or Spanish", "英语或西班牙语"),
  },
  {
    question: t("Which flavor of ice cream do you like best?", "你最喜欢哪种口味的冰淇淋？"),
    numerical: false,
    examples: t("vanilla or mango", "香草或芒果"),
  },
];

/** Relation is a comparison in words: "more than", "at least", …. */
interface Relation {
  readonly en: string;
  readonly zh: string;
  readonly holds: (x: number, k: number) => boolean;
  /** opposite swaps strict and inclusive: the usual misreading. */
  readonly misread: (x: number, k: number) => boolean;
}

/** relations are the comparisons a count can ask about. */
const relations: readonly Relation[] = [
  { en: "more than", zh: "多于", holds: (x, k) => x > k, misread: (x, k) => x >= k },
  { en: "fewer than", zh: "少于", holds: (x, k) => x < k, misread: (x, k) => x <= k },
  { en: "at least", zh: "至少", holds: (x, k) => x >= k, misread: (x, k) => x > k },
  { en: "at most", zh: "至多", holds: (x, k) => x <= k, misread: (x, k) => x < k },
];

/** RawData is a data set in a story, with how to ask for a count of its values. */
interface RawData {
  readonly en: string;
  readonly zh: string;
  readonly draw: (rng: Rng, n: number) => number[];
  readonly ask: (r: Relation, k: number) => Text;
}

/** rawData are stories that give a data set as a list. */
const rawData: readonly RawData[] = [
  {
    en: "The students in a book club reported how many books they read this summer:",
    zh: "读书俱乐部的学生报告了各自这个暑假读的书的本数：",
    draw: (rng, n) => data(rng, n, 0, 12),
    ask: (r, k) => t(`How many students read ${r.en} $${k}$ books?`, `有多少名学生读了${r.zh} $${k}$ 本书？`),
  },
  {
    en: "A soccer team recorded the number of goals it scored in each game:",
    zh: "一支足球队记录了每场比赛的进球数：",
    draw: (rng, n) => data(rng, n, 0, 6),
    ask: (r, k) => t(`In how many games did the team score ${r.en} $${k}$ goals?`, `球队在多少场比赛中进球${r.zh} $${k}$ 个？`),
  },
  {
    en: "Each student in a class recorded how many minutes they spent on homework last night:",
    zh: "班上每个学生记录了自己昨晚做作业的分钟数：",
    draw: (rng, n) => data(rng, n, 2, 18).map((x) => 5 * x),
    ask: (r, k) => t(`How many students spent ${r.en} $${k}$ minutes on homework?`, `有多少名学生做作业的时间${r.zh} $${k}$ 分钟？`),
  },
];

export const introductionToStatistics = withIntro(
  topic(
    "introduction-to-statistics",
    t("Introduction to Statistics", "统计初步"),
    t(
      "Statistics is the study of data: collecting it, describing it and drawing conclusions from it. A statistical question is one whose answers are expected to vary: “How many hours did each student in my class sleep last night?” is statistical, but “How many hours did I sleep last night?” has a single answer and is not. Data can be numerical, such as heights or counts, or categorical, such as favorite colors.",
      "统计学研究数据：收集数据、描述数据，并从数据中得出结论。统计问题是答案预计会有差异的问题：“我们班每个学生昨晚各睡了几个小时？”是统计问题，而“我昨晚睡了几个小时？”只有一个答案，不是统计问题。数据可以是数值数据，如身高或个数；也可以是分类数据，如最喜欢的颜色。",
    ),
    ["creating-and-interpreting-line-plots"],
    ["6.SP.A.1", "6.SP.A.2", "6.SP.B.5.A"],
    [
      lesson(
        "statistical-questions",
        ["Statistical questions", "统计问题"],
        [
          [
            "A **statistical question** anticipates **variability**: answering it means collecting several values that are expected to differ. “How old are the students at our school?” is statistical, because the ages differ. “How old is the principal?” is not: it has one answer. A question about one person can still be statistical if it asks about many occasions, such as “How many minutes did Leo practice piano on each day last month?”",
            "**统计问题**预计答案会有**差异**：回答它需要收集多个可能各不相同的数据。“我们学校的学生各多大年纪？”是统计问题，因为学生的年龄各不相同。“校长多大年纪？”不是统计问题：它只有一个答案。关于一个人的问题，如果问的是许多次的情况，仍然可以是统计问题，例如“上个月 Leo 每天各练了多少分钟钢琴？”",
          ],
          [
            "Ask the school question of two students and you may get $11$ and $12$; ask the principal's age twice and you get the same number.",
            "问两个学生的年龄，可能得到 $11$ 和 $12$；问两次校长的年龄，得到的是同一个数。",
          ],
          [
            "A question about one person is not automatically non-statistical. Ask whether it collects many values.",
            "关于一个人的问题不一定不是统计问题。要看它是否收集多个数据。",
          ],
        ],
        (rng) => {
          const yes = rng.bool();
          const [en, zh] = rng.pick(yes ? statisticalQuestions : nonStatisticalQuestions)(rng);
          return decided(
            rng,
            [`Is “${en}” a statistical question?`, `“${zh}”是统计问题吗？`],
            yes,
            yes
              ? [
                  [
                    ["Count the answers", "数答案"],
                    ["It asks for one value from each of many people or days.", "它要从许多人或许多天中各收集一个数据。"],
                  ],
                  [
                    ["Look for variability", "看有没有差异"],
                    ["Those values are expected to differ, so it is a statistical question.", "这些数据预计各不相同，所以它是统计问题。"],
                  ],
                ]
              : [
                  [
                    ["Count the answers", "数答案"],
                    ["It asks for a single value.", "它只问一个数据。"],
                  ],
                  [
                    ["Look for variability", "看有没有差异"],
                    ["One value cannot vary, so it is not a statistical question.", "一个数据谈不上差异，所以它不是统计问题。"],
                  ],
                ],
            yes
              ? [
                  "Asking it of two different people or on two different days could give two different answers.",
                  "向两个不同的人或在两个不同的日子问，可能得到两个不同的答案。",
                ]
              : ["Asking it twice gives the same single answer.", "问两次，得到的是同一个答案。"],
            yes
              ? ["It collects many values that vary, so it is statistical.", "它收集许多有差异的数据，所以是统计问题。"]
              : ["It has only one answer, so there is nothing to vary.", "它只有一个答案，没有差异可言。"],
          );
        },
        dotPlotFigure([7, 8, 8, 9, 9, 9, 10, 10, 11], { min: 6, max: 12, step: 1 }),
      ),
      lesson(
        "numerical-and-categorical-data",
        ["Numerical and categorical data", "数值数据与分类数据"],
        [
          [
            "**Numerical data** are numbers that count or measure something: the number of pets, a height, a time. **Categorical data** sort the answers into groups: a favorite color, a kind of pet, a way of getting to school. Asking “How many brothers and sisters do you have?” gives numbers such as $0$, $1$ or $2$, so its data are numerical.",
            "**数值数据**是计数或测量得到的数：宠物的只数、身高、时间。**分类数据**把答案分成若干类别：最喜欢的颜色、宠物的种类、上学的方式。问“你有几个兄弟姐妹？”得到的是 $0$、$1$、$2$ 这样的数，所以是数值数据。",
          ],
          [
            "The mean number of brothers and sisters makes sense; the mean of “blue” and “green” does not.",
            "兄弟姐妹人数的平均数有意义；“蓝色”和“绿色”的平均数没有意义。",
          ],
          [
            "A category can be written with a number, like a jersey number, and still be categorical. Ask whether the number counts or measures.",
            "类别有时也用数字表示，比如球衣号码，但仍是分类数据。要看这个数是否在计数或测量。",
          ],
        ],
        (rng) => {
          const q = rng.pick(surveyQuestions);
          const n = rng.int(20, 35);
          const right: Pair = q.numerical ? ["Numerical", "数值数据"] : ["Categorical", "分类数据"];
          const other: Pair = q.numerical ? ["Categorical", "分类数据"] : ["Numerical", "数值数据"];
          return chosen(
            rng,
            [
              `A survey asks each of the $${n}$ students in a class: “${q.question.en}” Are the answers numerical or categorical data?`,
              `一项调查问班上 $${n}$ 名学生中的每一位：“${q.question["zh-CN"]}”得到的答案是数值数据还是分类数据？`,
            ],
            right,
            [
              q.numerical
                ? [other, "The answers are amounts that count or measure, not groups.", "答案是计数或测量得到的量，不是类别。"]
                : [
                    other,
                    "The answers are groups, not amounts; they do not count or measure anything.",
                    "答案是类别，不是数量，它们不计数也不测量。",
                  ],
            ],
            [
              [
                ["Look at the answers", "看答案"],
                [`Typical answers are ${q.examples.en}.`, `典型的答案是${q.examples["zh-CN"]}。`],
              ],
              q.numerical
                ? [
                    ["Decide", "判断"],
                    ["They are numbers that count or measure, so the data are numerical.", "它们是计数或测量得到的数，所以是数值数据。"],
                  ]
                : [
                    ["Decide", "判断"],
                    ["They are categories, not quantities, so the data are categorical.", "它们是类别，不是数量，所以是分类数据。"],
                  ],
            ],
            q.numerical
              ? [
                  `A mean of ${q.examples.en} makes sense, as it should for numerical data.`,
                  `${q.examples["zh-CN"]}的平均数有意义，数值数据正是如此。`,
                ]
              : [
                  `A mean of ${q.examples.en} makes no sense, as for any categorical data.`,
                  `${q.examples["zh-CN"]}的平均数没有意义，分类数据都是这样。`,
                ],
          );
        },
        tableFigure(["0", "1", "2", "3"], [4, 9, 6, 2]),
      ),
      lesson(
        "counting-values-in-a-data-set",
        ["Counting values in a data set", "数出数据集中的数据"],
        [
          [
            "Each value in a data set is one **observation**. To count the values that meet a condition, sorting first helps. Read the condition carefully: “at least $5$” and “at most $5$” include $5$, while “more than $5$” and “fewer than $5$” do not. In $3, 7, 5, 9, 5, 2$, the values at least $5$ are $5, 5, 7, 9$: four of them.",
            "数据集中的每个值是一个**观测值**。要数出满足某个条件的数据，先排序会更方便。仔细读条件：“至少 $5$”和“至多 $5$”包括 $5$，而“多于 $5$”和“少于 $5$”不包括。在 $3, 7, 5, 9, 5, 2$ 中，至少为 $5$ 的数据是 $5, 5, 7, 9$，共四个。",
          ],
          [
            "The other two values, $3$ and $2$, are below $5$, and $4 + 2 = 6$ values in all.",
            "其余两个值 $3$ 和 $2$ 小于 $5$，$4 + 2 = 6$，正是全部数据。",
          ],
          [
            "Only two values are more than $5$. Mixing up “at least” and “more than” changes the count.",
            "多于 $5$ 的只有两个。把“至少”和“多于”弄混，个数就错了。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rawData);
          const r = rng.pick(relations);
          for (;;) {
            const n = rng.int(8, 12);
            const xs = ctx.draw(rng, n);
            const k = rng.pick(xs);
            const yes = sorted(xs.filter((x) => r.holds(x, k)));
            if (k === 1 || k === Math.min(...xs) || k === Math.max(...xs) || yes.length < 2 || yes.length === n) continue;
            const misread = xs.filter((x) => r.misread(x, k)).length;
            const q = ctx.ask(r, k);
            const inclusive = r.en === "at least" || r.en === "at most";
            return valued(
              [`${ctx.en} $${list(xs)}$. ${q.en}`, `${ctx.zh}$${list(xs)}$。${q["zh-CN"]}`],
              yes.length,
              [
                [["Sort", "排序"], ["From least to greatest:", "从小到大排列："], [list(sorted(xs))]],
                [
                  ["Pick the values", "挑出数据"],
                  [
                    `“${capitalize(r.en)} $${k}$” ${inclusive ? "includes" : "leaves out"} $${k}$ itself. The values are $${list(yes)}$:`,
                    `“${r.zh} $${k}$”${inclusive ? "包括" : "不包括"} $${k}$ 本身。符合的数据是 $${list(yes)}$：`,
                  ],
                  [`${yes.length} \\text{ values}`],
                ],
              ],
              [
                `The other $${n - yes.length}$ values fail the condition, and $${yes.length} + ${n - yes.length} = ${n}$.`,
                `其余 $${n - yes.length}$ 个数据不符合条件，而 $${yes.length} + ${n - yes.length} = ${n}$。`,
              ],
              [
                [
                  misread,
                  inclusive
                    ? `That leaves out the values equal to $${k}$; “${r.en}” includes them.`
                    : `That counts the values equal to $${k}$; “${r.en}” leaves them out.`,
                  inclusive ? `这漏掉了等于 $${k}$ 的数据；“${r.zh}”包括它们。` : `这把等于 $${k}$ 的数据也算进去了；“${r.zh}”不包括它们。`,
                ],
                [n - yes.length, "That counts the values that do not meet the condition.", "这数的是不符合条件的数据。"],
                [n, "That counts every value.", "这数了全部数据。"],
              ],
            );
          }
        },
        dotPlotFigure([3, 7, 5, 9, 5, 2], { min: 0, max: 10, step: 1 }),
      ),
    ],
  ),
  [
    "A class wants to know how long its students sleep. They ask all $25$ students and write down the answers: $8$, $9$, $7.5$, $9$, ….",
    "一个班想知道同学们睡多久。他们问了全部 $25$ 名学生，记下答案：$8$、$9$、$7.5$、$9$……",
  ],
  [
    "The answers differ from student to student; that variability is what makes it a statistical question.",
    "答案因人而异；正是这种差异让它成为统计问题。",
  ],
  [
    "tell statistical questions from others, sort data into numerical and categorical, and count the values that meet a condition.",
    "区分统计问题，把数据分为数值数据和分类数据，并数出满足条件的数据。",
  ],
);

// ---------------------------------------------------------------------------
// Measures of center

/** Measurements is a story whose data are measurements given in tenths. */
interface Measurements {
  readonly en: (n: number) => string;
  readonly zh: (n: number) => string;
  readonly lo: number;
  readonly hi: number;
}

/** measurements are stories with decimal data, drawn in tenths between lo and hi. */
const measurements: readonly Measurements[] = [
  { en: (n) => `The rainfall, in inches, in a town on ${n} days was`, zh: (n) => `某镇 ${n} 天的降雨量（英寸）分别是`, lo: 1, hi: 30 },
  {
    en: (n) => `The times, in seconds, of the ${n} runners in a 100-meter race were`,
    zh: (n) => `100 米赛跑中 ${n} 名选手的成绩（秒）分别是`,
    lo: 120,
    hi: 160,
  },
  { en: (n) => `The weights, in kilograms, of ${n} puppies were`, zh: (n) => `${n} 只小狗的体重（千克）分别是`, lo: 15, hi: 45 },
  {
    en: (n) => `The lengths, in centimeters, of ${n} leaves collected in a park were`,
    zh: (n) => `在公园里采集的 ${n} 片叶子的长度（厘米）分别是`,
    lo: 40,
    hi: 120,
  },
];

/** meanBars draws values as bars with a dashed line at their mean, the level every bar would reach if the total were shared out evenly. */
function meanBars(values: readonly number[], level: number, yTicks: readonly (readonly [number, string])[], alt: Text): Figure {
  const top = yTicks[yTicks.length - 1]?.[0] ?? Math.max(...values);
  const r = (v: number) => Math.round(v * 10) / 10;
  return {
    svg: chart(
      [0, values.length],
      [0, top],
      values.map((_, i) => [i + 0.5, String(i + 1)] as const),
      yTicks,
      (x, y) =>
        values
          .map(
            (v, i) =>
              `<rect class="accent" fill="currentColor" fill-opacity="0.35" x="${x(i + 0.2)}" y="${y(v)}" width="${r(x(i + 0.8) - x(i + 0.2))}" height="${r(y(0) - y(v))}"/>`,
          )
          .join("") +
        `<line x1="${x(0)}" y1="${y(level)}" x2="${x(values.length)}" y2="${y(level)}" stroke-width="2" stroke-dasharray="6 4"/>`,
    ),
    alt,
  };
}

export const theMeanOfADataSet: TopicDef = {
  ...topic(
    "the-mean-of-a-data-set",
    t("Finding the Mean", "求平均数"),
    t(
      "The mean of a data set is the sum of the values divided by the number of values. Since mean = sum ÷ count, the sum is mean × count: a team that scores a mean of $15$ points over $4$ games scores $60$ points in all. When a value is added, find the new sum and divide by the new count; averaging the old mean with the new value gives the wrong answer.",
      "一组数据的平均数等于各数据之和除以数据个数。由于平均数 = 总和 ÷ 个数，所以总和 = 平均数 × 个数：一支球队 $4$ 场比赛平均每场得 $15$ 分，一共得 $60$ 分。加入一个新数据时，先求新的总和，再除以新的个数；把原平均数和新数据再平均是错误的。",
    ),
    ["mean-of-a-data-set", "introduction-to-statistics"],
    ["6.SP.A.3", "6.SP.B.5.C"],
    [
      {
        id: "the-mean-of-measurements",
        title: t("The mean of measurements", "测量数据的平均数"),
        explanation: t(
          "Rain fell on four days: $1.2, 0.4, 2.0, 0.6$ inches. The **mean** is the level every bar would reach if the rain were shared out evenly.\n\nFirst add the values: $1.2 + 0.4 + 2.0 + 0.6 = 4.2$. Then divide by the number of days: $4.2 \\div 4 = 1.05$ inches.\n\nCheck: $4 \\times 1.05 = 4.2$, the sum again. Also, $1.05$ lies between the smallest value, $0.4$, and the largest, $2.0$.\n\n> **Watch out.** Divide by the number of values, $4$. Dividing by $3$ gives $1.4$, which is too big.",
          "某地四天的降雨量是 $1.2, 0.4, 2.0, 0.6$ 英寸。**平均数**就是把雨量平均分配后，每根条形都能达到的高度。\n\n先把各数相加：$1.2 + 0.4 + 2.0 + 0.6 = 4.2$。再除以天数：$4.2 \\div 4 = 1.05$ 英寸。\n\n检验：$4 \\times 1.05 = 4.2$，又得到了总和。而且 $1.05$ 在最小值 $0.4$ 和最大值 $2.0$ 之间。\n\n> **注意。** 要除以数据的个数 $4$。除以 $3$ 得 $1.4$，太大了。",
        ),
        figure: meanBars(
          [1.2, 0.4, 2.0, 0.6],
          1.05,
          tenthTicks(0, 20, 5),
          t(
            "Bar chart of the rainfall on days 1 to 4: 1.2, 0.4, 2.0 and 0.6 inches. A dashed line at 1.05 inches marks the mean.",
            "第 1 到 4 天降雨量的条形图：1.2、0.4、2.0 和 0.6 英寸。1.05 英寸处的虚线表示平均数。",
          ),
        ),
        generate(rng) {
          const ctx = rng.pick(measurements);
          for (;;) {
            const n = rng.int(4, 6);
            const xs = tenthsData(rng, n, ctx.lo, ctx.hi);
            const m = Q.of(sum(xs), 10 * n);
            if (!clean(m)) continue;
            const total = Q.of(sum(xs), 10);
            const med = median(xs).div(Q.of(10));
            const fewer = total.div(Q.of(n - 1));
            const added = tenthsList(xs).replaceAll(", ", " + ");
            const lo = dec(Q.of(Math.min(...xs), 10));
            const hi = dec(Q.of(Math.max(...xs), 10));
            return numberProblem({
              prompt: t(`${ctx.en(n)} $${tenthsList(xs)}$. Find the mean.`, `${ctx.zh(n)} $${tenthsList(xs)}$。求平均数。`),
              answer: m,
              form: "decimal",
              mistakes: [
                why(total, `This is the sum. Divide it by the number of values, $${n}$.`, `这是总和。还要除以数据的个数 $${n}$。`),
                ...(isTerminating(fewer)
                  ? [
                      why(
                        fewer,
                        `This divides by $${n - 1}$. There are $${n}$ values, so divide by $${n}$.`,
                        `这除以了 $${n - 1}$。一共有 $${n}$ 个数据，要除以 $${n}$。`,
                      ),
                    ]
                  : []),
                ...(isTerminating(med) && !med.eq(total) && !(isTerminating(fewer) && med.eq(fewer))
                  ? [
                      why(
                        med,
                        "This is the median, the middle value. The mean shares the sum out evenly.",
                        "这是中位数，即中间的数。平均数是把总和平均分。",
                      ),
                    ]
                  : []),
              ],
              solution: t(
                `**Step 1: Add the values.**${steps(`${added} = ${dec(total)}`)}**Step 2: Divide by the number of values, ${n}.**${steps(`${dec(total)} \\div ${n} = ${dec(m)}`)}**Check.** Multiply back. The mean times ${n} gives the sum again:${steps(`${n} \\times ${dec(m)} = ${dec(total)}`)}Also, $${dec(m)}$ lies between the smallest value, $${lo}$, and the largest, $${hi}$.`,
                `**第一步：把各数相加。**${steps(`${added} = ${dec(total)}`)}**第二步：除以数据的个数 ${n}。**${steps(`${dec(total)} \\div ${n} = ${dec(m)}`)}**检验。**反过来乘。平均数乘 ${n}，又得到总和：${steps(`${n} \\times ${dec(m)} = ${dec(total)}`)}而且 $${dec(m)}$ 在最小值 $${lo}$ 和最大值 $${hi}$ 之间。`,
              ),
            });
          }
        },
      },
      {
        id: "the-total-from-the-mean",
        title: t("The total from the mean", "由平均数求总和"),
        explanation: t(
          "Leo ran on $6$ days. He ran a mean of $3.5$ km a day. If the runs were shared out evenly, every bar would reach $3.5$. So the total is $6 \\times 3.5 = 21$ km.\n\nCheck: his runs were $3, 4, 2.5, 5, 3, 3.5$ km. They add up to $21$ km too.\n\n> **Watch out.** The mean, $3.5$, is not the total. Multiply it by the number of days, $6$.",
          "Leo 跑了 $6$ 天，平均每天跑 $3.5$ 千米。如果把每天跑的路程平均分配，每根条形都会达到 $3.5$。所以总路程是 $6 \\times 3.5 = 21$ 千米。\n\n检验：他每天跑的是 $3, 4, 2.5, 5, 3, 3.5$ 千米，加起来也是 $21$ 千米。\n\n> **注意。** 平均数 $3.5$ 不是总和。要乘天数 $6$。",
        ),
        figure: meanBars(
          [3, 4, 2.5, 5, 3, 3.5],
          3.5,
          intTicks(0, 5),
          t(
            "Bar chart of Leo's runs on days 1 to 6: 3, 4, 2.5, 5, 3 and 3.5 km. A dashed line at 3.5 km marks the mean.",
            "Leo 第 1 到 6 天跑步路程的条形图：3、4、2.5、5、3 和 3.5 千米。3.5 千米处的虚线表示平均数。",
          ),
        ),
        generate(rng) {
          const story = rng.pick([
            {
              lo: 300,
              hi: 1100,
              text: (n: number, m: string) =>
                t(
                  `A basketball team scored a mean of $${m}$ points per game over $${n}$ games. How many points did the team score in all?`,
                  `一支篮球队 $${n}$ 场比赛平均每场得 $${m}$ 分。这支球队一共得了多少分？`,
                ),
            },
            {
              lo: 15,
              hi: 120,
              text: (n: number, m: string) =>
                t(
                  `${names[n % names.length]} ran a mean of $${m}$ kilometers a day for $${n}$ days. How many kilometers is that in all?`,
                  `${names[n % names.length]} 连续 $${n}$ 天平均每天跑 $${m}$ 千米。一共跑了多少千米？`,
                ),
            },
            {
              lo: 15,
              hi: 400,
              text: (n: number, m: string) =>
                t(
                  `Over $${n}$ weeks, a class collected a mean of $${m}$ kilograms of paper per week for recycling. How many kilograms did the class collect in all?`,
                  `一个班 $${n}$ 周里平均每周收集 $${m}$ 千克废纸用于回收。这个班一共收集了多少千克？`,
                ),
            },
          ]);
          const decimal = rng.bool(0.6);
          for (;;) {
            const n = rng.int(3, 9);
            const m10 = rng.int(story.lo, story.hi);
            if ((m10 * n) % 10 !== 0 || (m10 % 10 !== 0) !== decimal) continue;
            const m = Q.of(m10, 10);
            const total = m.mul(Q.of(n));
            const split = m.div(Q.of(n));
            return numberProblem({
              prompt: story.text(n, dec(m)),
              answer: total,
              form: "decimal",
              mistakes: [
                why(
                  m,
                  `This is the mean, the amount for one. Multiply it by $${n}$ to get the total.`,
                  `这是平均数，即一份的量。乘 $${n}$ 才是总和。`,
                ),
                why(m.add(Q.of(n)), `This adds $${n}$. The total is the mean times $${n}$.`, `这是加了 $${n}$。总和是平均数乘 $${n}$。`),
                ...(clean(split)
                  ? [
                      why(
                        split,
                        `This divides by $${n}$. The mean is already the total divided by $${n}$, so multiply instead.`,
                        `这是除以了 $${n}$。平均数已经是总和除以 $${n}$ 的结果，所以要乘。`,
                      ),
                    ]
                  : []),
              ],
              solution: t(
                `**Step 1: Turn the mean around.** The mean is the total divided by ${n}, so the total is the mean times ${n}.\n\n**Step 2: Multiply.**${steps(`${n} \\times ${dec(m)} = ${dec(total)}`)}**Check.** Share the total out again. Dividing by ${n} gives back the mean:${steps(`${dec(total)} \\div ${n} = ${dec(m)}`)}`,
                `**第一步：把平均数的关系倒过来。**平均数等于总和除以 ${n}，所以总和等于平均数乘 ${n}。\n\n**第二步：相乘。**${steps(`${n} \\times ${dec(m)} = ${dec(total)}`)}**检验。**把总和重新平均分。除以 ${n}，又得到平均数：${steps(`${dec(total)} \\div ${n} = ${dec(m)}`)}`,
              ),
            });
          }
        },
      },
      {
        id: "adding-a-value",
        title: t("Adding a value", "加入一个数据"),
        explanation: t(
          "Mia's $4$ quiz scores have a mean of $80$. Then she scores $90$. What is the new mean?\n\nThe old scores add up to $4 \\times 80 = 320$. Add the new score: $320 + 90 = 410$. Now there are $5$ scores, so the new mean is $410 \\div 5 = 82$.\n\nCheck: the old scores, shared out at $80$ each, sit $82 - 80 = 2$ below the new mean. Together that is $4 \\times 2 = 8$ below. The new score is $90 - 82 = 8$ above. Above and below balance.\n\n> **Watch out.** Do not average $80$ and $90$ to get $85$. That counts one new score as much as all four old ones.",
          "Mia $4$ 次小测验成绩的平均数是 $80$。后来她又考了 $90$ 分。新的平均数是多少？\n\n原来的成绩之和是 $4 \\times 80 = 320$。加上新成绩：$320 + 90 = 410$。现在有 $5$ 个成绩，所以新的平均数是 $410 \\div 5 = 82$。\n\n检验：原来的成绩平均分后每个是 $80$，比新平均数低 $82 - 80 = 2$，四个一共低 $4 \\times 2 = 8$。新成绩比新平均数高 $90 - 82 = 8$。高出的和低出的正好抵消。\n\n> **注意。** 不要把 $80$ 和 $90$ 平均得到 $85$。那样等于把一个新成绩看得和原来四个成绩加起来一样重。",
        ),
        figure: meanBars(
          [75, 85, 70, 90, 90],
          82,
          intTicks(0, 100, 20),
          t(
            "Bar chart of Mia's five quiz scores: 75, 85, 70 and 90, then the new score 90. A dashed line at 82 marks the mean of all five.",
            "Mia 五次小测验成绩的条形图：75、85、70 和 90，然后是新成绩 90。82 处的虚线表示五个成绩的平均数。",
          ),
        ),
        generate(rng) {
          for (;;) {
            const n = rng.int(3, 7);
            const m = rng.int(60, 90);
            const d = rng.nonZero(-10, 10);
            if (((n + 1) * d) % 2 !== 0) continue;
            const m2 = Q.of(2 * m + d, 2);
            const x = m2.mul(Q.of(n + 1)).sub(Q.of(n * m));
            if (!x.isInteger() || x.cmp(Q.of(40)) < 0 || x.cmp(Q.of(100)) > 0) continue;
            const xs = Number(x.n);
            const total = n * m + xs;
            const wrongCount = Q.of(total, n);
            const up = d > 0;
            const gap = up ? m2.sub(Q.of(m)) : Q.of(m).sub(m2);
            const away = up ? x.sub(m2) : m2.sub(x);
            const balance = up
              ? t(
                  `The old scores, shared out at $${m}$ each, sit $${dec(gap)}$ below the new mean, so together they are $${n} \\times ${dec(gap)} = ${dec(gap.mul(Q.of(n)))}$ below. The new score is $${xs} - ${dec(m2)} = ${dec(away)}$ above. Above and below balance.`,
                  `原来的成绩平均分后每个是 $${m}$，比新平均数低 $${dec(gap)}$，一共低 $${n} \\times ${dec(gap)} = ${dec(gap.mul(Q.of(n)))}$。新成绩比新平均数高 $${xs} - ${dec(m2)} = ${dec(away)}$。高出的和低出的正好抵消。`,
                )
              : t(
                  `The old scores, shared out at $${m}$ each, sit $${dec(gap)}$ above the new mean, so together they are $${n} \\times ${dec(gap)} = ${dec(gap.mul(Q.of(n)))}$ above. The new score is $${dec(m2)} - ${xs} = ${dec(away)}$ below. Above and below balance.`,
                  `原来的成绩平均分后每个是 $${m}$，比新平均数高 $${dec(gap)}$，一共高 $${n} \\times ${dec(gap)} = ${dec(gap.mul(Q.of(n)))}$。新成绩比新平均数低 $${dec(m2)} - ${xs} = ${dec(away)}$。高出的和低出的正好抵消。`,
                );
            return numberProblem({
              prompt: t(
                `The mean of $${n}$ quiz scores is $${m}$. One more score, $${xs}$, is added. What is the mean of all $${n + 1}$ scores?`,
                `$${n}$ 次小测验成绩的平均数是 $${m}$。又加入一个成绩 $${xs}$。全部 $${n + 1}$ 个成绩的平均数是多少？`,
              ),
              answer: m2,
              form: "decimal",
              mistakes: [
                why(
                  Q.of(m + xs, 2),
                  `This averages the old mean with the new score. That counts one score as much as all $${n}$ old ones.`,
                  `这是把原平均数和新成绩再平均。那样等于把一个成绩看得和原来 $${n}$ 个成绩加起来一样重。`,
                ),
                ...(clean(wrongCount)
                  ? [
                      why(
                        wrongCount,
                        `This divides by $${n}$. With the new score there are $${n + 1}$ scores.`,
                        `这除以了 $${n}$。加上新成绩一共有 $${n + 1}$ 个成绩。`,
                      ),
                    ]
                  : []),
                why(Q.of(total), `This is the new total. Divide it by $${n + 1}$.`, `这是新的总和。还要除以 $${n + 1}$。`),
              ],
              solution: t(
                `**Step 1: Find the old total.**${steps(`${n} \\times ${m} = ${n * m}`)}**Step 2: Add the new score.**${steps(`${n * m} + ${xs} = ${total}`)}**Step 3: Divide by the new count, ${n + 1}.**${steps(`${total} \\div ${n + 1} = ${dec(m2)}`)}**Check.** ${balance.en}`,
                `**第一步：求原来的总和。**${steps(`${n} \\times ${m} = ${n * m}`)}**第二步：加上新成绩。**${steps(`${n * m} + ${xs} = ${total}`)}**第三步：除以新的个数 ${n + 1}。**${steps(`${total} \\div ${n + 1} = ${dec(m2)}`)}**检验。**${balance["zh-CN"]}`,
              ),
            });
          }
        },
      },
    ],
  ),
  intro: t(
    "Four friends picked apples. Maya picked $3$, Leo $5$, Ana $6$ and Sam $2$. They put all the apples in one basket and share them out evenly. There are $3 + 5 + 6 + 2 = 16$ apples, so each friend gets $16 \\div 4 = 4$. This even share is the **mean**.\n\nCheck: $4$ friends with $4$ apples each have $4 \\times 4 = 16$ apples, the same basket.\n\nIn this lesson we find the mean of measurements, find a total from the mean, and find the new mean when one more value is added.",
    "四个朋友去摘苹果。Maya 摘了 $3$ 个，Leo 摘了 $5$ 个，Ana 摘了 $6$ 个，Sam 摘了 $2$ 个。他们把苹果都放进一个篮子，再平均分。一共有 $3 + 5 + 6 + 2 = 16$ 个苹果，所以每人分到 $16 \\div 4 = 4$ 个。这个平均分得的数就是**平均数**。\n\n检验：$4$ 个朋友每人 $4$ 个，一共 $4 \\times 4 = 16$ 个，正好是那一篮。\n\n本课我们求测量数据的平均数，由平均数求总和，并求加入一个数据后的新平均数。",
  ),
  encompasses: [{ topic: "mean-of-a-data-set", weight: 1 }],
};

/** middleCheck says why m is the median of the sorted values s: as many values on each side. */
function middleCheck(s: readonly number[], show: (v: number) => string, m: string): Pair {
  const n = s.length;
  const h = Math.floor(n / 2);
  return n % 2 === 1
    ? [
        `$${h}$ values lie before $${m}$ in the sorted list and $${h}$ after it.`,
        `排序后 $${m}$ 前面有 $${h}$ 个数，后面也有 $${h}$ 个数。`,
      ]
    : [
        `$${h}$ values lie at or below $${show(s[h - 1] as number)}$ and $${h}$ at or above $${show(s[h] as number)}$, and $${m}$ is halfway between them.`,
        `$${show(s[h - 1] as number)}$ 及之前有 $${h}$ 个数，$${show(s[h] as number)}$ 及之后也有 $${h}$ 个数，而 $${m}$ 正在两者中间。`,
      ];
}

/** middleStep finds the middle of the sorted values s in one labelled step. */
function middleStep(s: readonly number[], show: (v: number) => string, m: string): Walk {
  const n = s.length;
  const h = Math.floor(n / 2);
  return n % 2 === 1
    ? [
        ["Find the middle", "找中间"],
        [`There are $${n}$ values, so take number $${h + 1}$:`, `共 $${n}$ 个数，取第 $${h + 1}$ 个：`],
        [`\\text{median} = ${m}`],
      ]
    : [
        ["Find the middle", "找中间"],
        [
          `There are $${n}$ values, so take the mean of numbers $${h}$ and $${h + 1}$:`,
          `共 $${n}$ 个数，取第 $${h}$ 个和第 $${h + 1}$ 个的平均数：`,
        ],
        [`\\frac{${show(s[h - 1] as number)} + ${show(s[h] as number)}}{2} = ${m}`],
      ];
}

export const theMedianOfADataSet = withIntro(
  topic(
    "the-median-of-a-data-set",
    t("The Median of a Data Set", "数据集的中位数"),
    t(
      "The median is the middle value of the sorted data, or the mean of the two middle values when the count is even. Always sort first. Because the median of an even count is the mean of the two middle values, those two values add up to twice the median. Adding a value shifts the middle, so sort again and find the new middle.",
      "中位数是排好序的数据中间的那个数；数据个数为偶数时，是中间两个数的平均数。一定要先排序。由于偶数个数据的中位数是中间两个数的平均数，这两个数之和等于中位数的两倍。加入一个数据会使中间位置移动，所以要重新排序，再找新的中间值。",
    ),
    ["median-and-mode", "introduction-to-statistics"],
    ["6.SP.A.3", "6.SP.B.5.C"],
    [
      lesson(
        "the-median-of-measurements",
        ["The median of measurements", "测量数据的中位数"],
        [
          [
            "Measurements with decimals are sorted the same way as whole numbers. Times of $14.2, 13.5, 15.1, 13.9, 14.8, 13.6$ seconds sorted are $13.5, 13.6, 13.9, 14.2, 14.8, 15.1$. There are six, so the median is the mean of the third and fourth: $\\frac{13.9 + 14.2}{2} = 14.05$ seconds.",
            "带小数的测量数据也同样排序。成绩 $14.2, 13.5, 15.1, 13.9, 14.8, 13.6$ 秒排序后是 $13.5, 13.6, 13.9, 14.2, 14.8, 15.1$。共六个，所以中位数是第三个与第四个的平均数：$\\frac{13.9 + 14.2}{2} = 14.05$ 秒。",
          ],
          ["$14.05$ is $0.15$ above $13.9$ and $0.15$ below $14.2$.", "$14.05$ 比 $13.9$ 大 $0.15$，比 $14.2$ 小 $0.15$。"],
          [
            "The median can have more decimal places than the data, as $14.05$ does here. Do not round it to $14.1$.",
            "中位数的小数位可能比数据多，比如这里的 $14.05$。不要把它约成 $14.1$。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(measurements);
          const n = rng.int(5, 8);
          const xs = tenthsData(rng, n, ctx.lo, ctx.hi);
          const s = sorted(xs);
          const h = Math.floor(n / 2);
          const m = median(xs).div(Q.of(10));
          const tenth = (v: number) => dec(Q.of(v, 10));
          const offs: Off[] = [
            [
              n % 2 === 1 ? Q.of(xs[h] as number, 10) : Q.of((xs[h - 1] as number) + (xs[h] as number), 20),
              "That is the middle of the list before sorting.",
              "这是排序前列表中间的数。",
            ],
          ];
          if (n % 2 === 0) {
            offs.push([
              Q.of(s[h - 1] as number, 10),
              "That is only the first of the two middle values; take their mean.",
              "这只是中间两个数中的前一个，要取它们的平均数。",
            ]);
            offs.push([
              Q.of(s[h] as number, 10),
              "That is only the second of the two middle values; take their mean.",
              "这只是中间两个数中的后一个，要取它们的平均数。",
            ]);
          } else {
            offs.push([Q.of(s[h + 1] as number, 10), "That is one place past the middle.", "这比中间多数了一个。"]);
            offs.push([Q.of(s[h - 1] as number, 10), "That is one place short of the middle.", "这比中间少数了一个。"]);
          }
          const avg = mean(xs).div(Q.of(10));
          offs.push([
            Q.of((s[0] as number) + (s[n - 1] as number), 20),
            "That is halfway between the smallest and largest values, not the middle value.",
            "这是最小值和最大值的中点，不是中间的数。",
          ]);
          if (isTerminating(avg)) offs.push([avg, "That is the mean, not the middle value.", "这是平均数，不是中间的数。"]);
          return valued(
            [`${ctx.en(n)} $${tenthsList(xs)}$. Find the median.`, `${ctx.zh(n)} $${tenthsList(xs)}$。求中位数。`],
            m,
            [[["Sort", "排序"], ["From least to greatest:", "从小到大排列："], [tenthsList(s)]], middleStep(s, tenth, dec(m))],
            middleCheck(s, tenth, dec(m)),
            offs,
            { form: "decimal" },
          );
        },
        tableFigure(["13.5", "13.6", "13.9", "14.2", "14.8", "15.1"], [1, 2, 3, 4, 5, 6]),
      ),
      lesson(
        "a-missing-value-from-the-median",
        ["A missing value from the median", "由中位数求缺失的数据"],
        [
          [
            "When the count is even, the median is the mean of the two middle values, so those two add up to twice the median. The six values $3, 8, \\square, 15, 19, 22$ are in order, and their median is $12$. The middle two add up to $2 \\times 12 = 24$, so the missing value is $24 - 15 = 9$.",
            "数据个数为偶数时，中位数是中间两个数的平均数，所以这两个数之和是中位数的两倍。六个数据 $3, 8, \\square, 15, 19, 22$ 已按从小到大排列，中位数是 $12$。中间两个数之和是 $2 \\times 12 = 24$，所以缺失的数是 $24 - 15 = 9$。",
          ],
          [
            "$\\frac{9 + 15}{2} = 12$, and $8 \\le 9 \\le 15$ keeps the list in order.",
            "$\\frac{9 + 15}{2} = 12$，而且 $8 \\le 9 \\le 15$，顺序没有乱。",
          ],
          [
            "The missing value is not the median itself. Double the median first, then subtract the other middle value.",
            "缺失的数不是中位数本身。先把中位数乘 $2$，再减去另一个中间的数。",
          ],
        ],
        (rng) => {
          const n = rng.pick([4, 6, 8]);
          const s = sorted(distinctData(rng, n, 1, 60));
          const h = n / 2;
          const hide = rng.pick([h - 1, h]);
          const other = s[hide === h ? h - 1 : h] as number;
          const x = s[hide] as number;
          const m = median(s);
          const shown = s.map((v, i) => (i === hide ? "\\square" : String(v)));
          return valued(
            [
              `The $${n}$ values $${list(shown)}$ are listed from least to greatest, and their median is $${dec(m)}$. What is the missing value?`,
              `$${n}$ 个数据 $${list(shown)}$ 已按从小到大排列，它们的中位数是 $${dec(m)}$。缺失的数是多少？`,
            ],
            x,
            [
              [
                ["Add the middle two", "求中间两数之和"],
                [
                  `With $${n}$ values the median is the mean of numbers $${h}$ and $${h + 1}$, so they add to`,
                  `$${n}$ 个数的中位数是第 $${h}$ 个和第 $${h + 1}$ 个的平均数，所以它们的和是`,
                ],
                [`2 \\times ${dec(m)} = ${x + other}`],
              ],
              [
                ["Subtract", "相减"],
                [`The other middle value is $${other}$:`, `另一个中间的数是 $${other}$：`],
                [`${x + other} - ${other} = ${x}`],
              ],
            ],
            [
              `$\\frac{${Math.min(x, other)} + ${Math.max(x, other)}}{2} = ${dec(m)}$.`,
              `$\\frac{${Math.min(x, other)} + ${Math.max(x, other)}}{2} = ${dec(m)}$。`,
            ],
            [
              [m, "That is the median, not the missing value.", "这是中位数，不是缺失的数。"],
              [other, "That is the other middle value.", "这是另一个中间的数。"],
              [m.mul(Q.of(2)), "That is the sum of the two middle values; subtract the other one.", "这是中间两个数之和，还要减去另一个。"],
            ],
          );
        },
        tableFigure(["1", "2", "3", "4", "5", "6"], [3, 8, null, 15, 19, 22]),
      ),
      lesson(
        "adding-a-value-to-the-data",
        ["Adding a value", "加入一个数据"],
        [
          [
            "Adding a value changes the count, so the middle moves. Put the new value in its place, sort, and find the new middle. The median of $4, 9, 6, 12, 2$ is $6$. With $10$ added, the sorted data are $2, 4, 6, 9, 10, 12$: six values, so the median is $\\frac{6 + 9}{2} = 7.5$.",
            "加入一个数据后个数变了，中间位置也会移动。把新数放到它的位置，排好序，再找新的中间值。$4, 9, 6, 12, 2$ 的中位数是 $6$。加入 $10$ 后，排序得 $2, 4, 6, 9, 10, 12$：共六个数，中位数是 $\\frac{6 + 9}{2} = 7.5$。",
          ],
          [
            "Three values, $2, 4, 6$, lie below $7.5$ and three, $9, 10, 12$, above it.",
            "比 $7.5$ 小的有 $2, 4, 6$ 三个，比它大的有 $9, 10, 12$ 三个。",
          ],
          [
            "Do not average the old median with the new value. $\\frac{6 + 10}{2} = 8$ is not the median.",
            "不要把原来的中位数和新数求平均。$\\frac{6 + 10}{2} = 8$ 不是中位数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(5, 9);
            const xs = data(rng, n, 1, 50);
            const v = rng.int(1, 60);
            const after = [...xs, v];
            const m0 = median(xs);
            const m1 = median(after);
            if (m0.eq(m1)) continue;
            const s = sorted(after);
            const k = Math.floor((n + 1) / 2);
            const unsorted = (n + 1) % 2 === 1 ? Q.of(after[k] as number) : Q.of((after[k - 1] as number) + (after[k] as number), 2);
            const show = (x: number) => String(x);
            return valued(
              [
                `The value $${v}$ is added to the data set $${list(xs)}$. What is the median of the new data set?`,
                `在数据 $${list(xs)}$ 中加入 $${v}$。新数据的中位数是多少？`,
              ],
              m1,
              [
                [
                  ["Add and sort", "加入并排序"],
                  [`The $${n + 1}$ values from least to greatest:`, `$${n + 1}$ 个数从小到大排列：`],
                  [list(s)],
                ],
                middleStep(s, show, dec(m1)),
              ],
              middleCheck(s, show, dec(m1)),
              [
                [m0, "That is the median before the value was added.", "这是加入数据之前的中位数。"],
                [unsorted, "That is the middle of the new list before sorting.", "这是新列表排序前中间的数。"],
                [m0.add(Q.of(v)).div(Q.of(2)), "That averages the old median with the new value.", "这是把原来的中位数和新数求平均。"],
              ],
              { form: "decimal" },
            );
          }
        },
        dotPlotFigure([2, 4, 6, 9, 10, 12], { min: 0, max: 14, step: 1 }),
      ),
    ],
  ),
  [
    "Six runners finish a race in $14.2, 13.5, 15.1, 13.9, 14.8$ and $13.6$ seconds. The coach wants one time that sits in the middle of them all.",
    "六名选手的成绩是 $14.2, 13.5, 15.1, 13.9, 14.8$ 和 $13.6$ 秒。教练想找一个正好在中间的成绩。",
  ],
  ["Three runners are faster than $14.05$ seconds and three are slower.", "比 $14.05$ 秒快的有三人，慢的也有三人。"],
  [
    "find the median of decimal data, find a missing value from the median, and find the median after a value is added.",
    "求小数数据的中位数，由中位数求缺失的数据，并求加入一个数据后的中位数。",
  ],
);

/** Categories is a categorical survey: what was asked, and the possible answers. */
interface Categories {
  readonly en: (n: number) => string;
  readonly zh: (n: number) => string;
  readonly values: readonly (readonly [string, string])[];
}

/** categories are surveys whose answers are categories. */
const categories: readonly Categories[] = [
  {
    en: (n) => `${n} students named their favorite fruit:`,
    zh: (n) => `${n} 名学生说出了自己最喜欢的水果：`,
    values: [
      ["apple", "苹果"],
      ["banana", "香蕉"],
      ["orange", "橙子"],
      ["grape", "葡萄"],
      ["peach", "桃子"],
    ],
  },
  {
    en: (n) => `${n} families named the kind of pet they have:`,
    zh: (n) => `${n} 个家庭说出了自己养的宠物种类：`,
    values: [
      ["dog", "狗"],
      ["cat", "猫"],
      ["fish", "鱼"],
      ["rabbit", "兔子"],
      ["bird", "鸟"],
    ],
  },
  {
    en: (n) => `${n} students named their favorite color:`,
    zh: (n) => `${n} 名学生说出了自己最喜欢的颜色：`,
    values: [
      ["red", "红色"],
      ["blue", "蓝色"],
      ["green", "绿色"],
      ["yellow", "黄色"],
      ["purple", "紫色"],
    ],
  },
  {
    en: (n) => `${n} students named their favorite sport:`,
    zh: (n) => `${n} 名学生说出了自己最喜欢的运动：`,
    values: [
      ["soccer", "足球"],
      ["basketball", "篮球"],
      ["swimming", "游泳"],
      ["tennis", "网球"],
      ["running", "跑步"],
    ],
  },
];

export const theModeOfADataSet = withIntro(
  topic(
    "the-mode-of-a-data-set",
    t("The Mode of a Data Set", "数据集的众数"),
    t(
      "The mode is the value that occurs most often. A data set can have one mode, several modes when values tie for most often, or no mode when every value occurs the same number of times. The mode is the only measure of center that also works for categorical data, such as favorite colors.",
      "众数是出现次数最多的值。一组数据可以有一个众数；几个值出现次数并列最多时，有几个众数；每个值出现次数都相同时，没有众数。众数是唯一也适用于分类数据（如最喜欢的颜色）的集中趋势量。",
    ),
    ["median-and-mode", "introduction-to-statistics"],
    ["6.SP.A.3", "6.SP.B.5.C"],
    [
      lesson(
        "one-several-or-no-modes",
        ["One mode, two modes or none", "一个众数、两个众数或没有众数"],
        [
          [
            "A data set can have one mode, several modes, or none. In $4, 7, 4, 9, 7, 2$, both $4$ and $7$ occur twice and every other value once, so there are two modes, $4$ and $7$. In $5, 8, 1, 6$, every value occurs once, so there is no mode.",
            "一组数据可以有一个众数、几个众数，或者没有众数。在 $4, 7, 4, 9, 7, 2$ 中，$4$ 和 $7$ 都出现了两次，其他值各出现一次，所以有两个众数：$4$ 和 $7$。在 $5, 8, 1, 6$ 中，每个值都只出现一次，所以没有众数。",
          ],
          ["The counts $2 + 2 + 1 + 1 = 6$ cover all six values of the first set.", "第一组的次数 $2 + 2 + 1 + 1 = 6$，正好是全部六个数。"],
          [
            "The mode is a value of the data, not the number of times it occurs. Here the modes are $4$ and $7$, not $2$.",
            "众数是数据中的值，不是它出现的次数。这里众数是 $4$ 和 $7$，不是 $2$。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(["none", "one", "two"] as const);
          const pool = distinctData(rng, 7, 1, 40);
          const [a, b, ...rest] = pool as [number, number, ...number[]];
          const singles = rest.slice(0, rng.int(2, 4));
          const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
          const both: Pair = [`$${lo}$ and $${hi}$`, `$${lo}$ 和 $${hi}$`];
          const one = (x: number): Pair => [`$${x}$`, `$${x}$`];
          const none: Pair = ["There is no mode", "没有众数"];
          const ask = (xs: readonly number[]): Pair => [
            `What is the mode of the data set $${list(xs)}$?`,
            `数据 $${list(xs)}$ 的众数是多少？`,
          ];
          const sortStep = (xs: readonly number[]): Walk => [
            ["Sort", "排序"],
            ["Equal values sit together:", "相同的值排在一起："],
            [list(sorted(xs))],
          ];
          if (kind === "none") {
            const xs = [a, b, ...rest.slice(0, rng.int(2, 5))];
            const s = sorted(xs);
            return chosen(
              rng,
              ask(xs),
              none,
              [
                [one(s[0] as number), "It occurs only once, like every other value.", "它只出现一次，和其他值一样。"],
                [one(s[s.length - 1] as number), "That is the largest value, and it occurs only once.", "这是最大的值，而且只出现一次。"],
                [
                  ["Every value is a mode", "每个值都是众数"],
                  "A mode must occur more often than other values; here they all tie.",
                  "众数必须比其他值出现得多；这里所有值次数相同。",
                ],
              ],
              [
                sortStep(xs),
                [
                  ["Count", "计数"],
                  [
                    "Every value occurs exactly once, so none occurs more often than the others.",
                    "每个值都只出现一次，没有哪个值出现得更多。",
                  ],
                ],
              ],
              [
                `$${xs.length}$ different values for $${xs.length}$ values in all: each occurs once.`,
                `一共 $${xs.length}$ 个数，有 $${xs.length}$ 个不同的值：每个只出现一次。`,
              ],
            );
          }
          if (kind === "one") {
            const xs = rng.shuffle([a, a, a, b, b, ...singles]);
            const wrong: Wrong[] = [
              [both, `$${b}$ occurs only twice, fewer than $${a}$.`, `$${b}$ 只出现两次，比 $${a}$ 少。`],
              [one(b), `$${b}$ occurs twice, but $${a}$ occurs three times.`, `$${b}$ 出现两次，可是 $${a}$ 出现三次。`],
              [none, `$${a}$ occurs more often than any other value, so there is a mode.`, `$${a}$ 比其他值出现得都多，所以有众数。`],
            ];
            if (a !== 3 && b !== 3 && !singles.includes(3))
              wrong.push([one(3), `That is how many times $${a}$ occurs, not the mode.`, `这是 $${a}$ 出现的次数，不是众数。`]);
            return chosen(
              rng,
              ask(xs),
              one(a),
              wrong,
              [
                sortStep(xs),
                [
                  ["Count", "计数"],
                  [
                    `$${a}$ occurs $3$ times, $${b}$ twice, the rest once. The only mode is $${a}$.`,
                    `$${a}$ 出现 $3$ 次，$${b}$ 出现 $2$ 次，其余各 $1$ 次。众数只有 $${a}$。`,
                  ],
                ],
              ],
              [
                `$3 + 2 + ${singles.length} = ${xs.length}$, so every value has been counted.`,
                `$3 + 2 + ${singles.length} = ${xs.length}$，每个数都数到了。`,
              ],
            );
          }
          const xs = rng.shuffle([a, a, b, b, ...singles]);
          return chosen(
            rng,
            ask(xs),
            both,
            [
              [one(a), `$${b}$ also occurs twice, so it is a mode too.`, `$${b}$ 也出现两次，所以它也是众数。`],
              [one(b), `$${a}$ also occurs twice, so it is a mode too.`, `$${a}$ 也出现两次，所以它也是众数。`],
              [none, "Two values occur more often than the rest, so there are modes.", "有两个值比其余的值出现得多，所以有众数。"],
            ],
            [
              sortStep(xs),
              [
                ["Count", "计数"],
                [
                  `$${lo}$ and $${hi}$ each occur twice, every other value once. Both are modes.`,
                  `$${lo}$ 和 $${hi}$ 各出现两次，其他值各出现一次。两个都是众数。`,
                ],
              ],
            ],
            [
              `$2 + 2 + ${singles.length} = ${xs.length}$, so every value has been counted.`,
              `$2 + 2 + ${singles.length} = ${xs.length}$，每个数都数到了。`,
            ],
          );
        },
        dotPlotFigure([4, 7, 4, 9, 7, 2], { min: 0, max: 10, step: 1 }),
      ),
      lesson(
        "the-mode-of-categorical-data",
        ["The mode of categorical data", "分类数据的众数"],
        [
          [
            "Answers such as “dog, cat, dog, fish, dog, cat” are not numbers, so they have no mean or median, but they do have a mode: the most common answer. Tally each category. In the table, A is dog with $3$, B is cat with $2$ and C is fish with $1$, so the mode is dog.",
            "像“狗、猫、狗、鱼、狗、猫”这样的答案不是数，没有平均数或中位数，但有众数：最常见的答案。给每个类别画记计数。表中 A 是狗，有 $3$ 个；B 是猫，有 $2$ 个；C 是鱼，有 $1$ 个。所以众数是狗。",
          ],
          ["$3 + 2 + 1 = 6$, all six answers.", "$3 + 2 + 1 = 6$，正是全部六个答案。"],
          ["The mode is the category, dog, not its count, $3$.", "众数是那个类别“狗”，不是它的个数 $3$。"],
        ],
        (rng) => {
          const c = rng.pick(categories);
          const picks = rng.sample(c.values, 4);
          const top = rng.int(3, 5);
          const counts = [top, top - 1, rng.int(1, top - 1), rng.int(1, top - 1)];
          const answers = rng.shuffle(picks.flatMap((v, i) => Array.from({ length: counts[i] as number }, () => v)));
          const n = answers.length;
          const [best, ...others] = picks as [readonly [string, string], ...(readonly [string, string])[]];
          const label = (v: readonly [string, string]): Pair => [capitalize(v[0]), v[1]];
          return chosen(
            rng,
            [
              `${c.en(n)} ${answers.map((v) => v[0]).join(", ")}. What is the mode?`,
              `${c.zh(n)}${answers.map((v) => v[1]).join("、")}。众数是什么？`,
            ],
            label(best),
            others.map(
              (v, i) =>
                [
                  label(v),
                  `It occurs $${counts[i + 1]}$ times, fewer than ${best[0]} with $${top}$.`,
                  `它出现 $${counts[i + 1]}$ 次，比${best[1]}的 $${top}$ 次少。`,
                ] as Wrong,
            ),
            [
              [
                ["Tally", "画记"],
                [
                  `Count each answer: ${picks.map((v, i) => `${v[0]} $${counts[i]}$`).join(", ")}.`,
                  `数出每种答案：${picks.map((v, i) => `${v[1]} $${counts[i]}$ 个`).join("，")}。`,
                ],
              ],
              [
                ["Pick the most", "找最多的"],
                [`The most common answer is ${best[0]}, so the mode is ${best[0]}.`, `最常见的答案是${best[1]}，所以众数是${best[1]}。`],
              ],
            ],
            [`$${counts.join(" + ")} = ${n}$, every answer counted once.`, `$${counts.join(" + ")} = ${n}$，每个答案都数到了一次。`],
          );
        },
        tableFigure(["A", "B", "C"], [3, 2, 1]),
      ),
    ],
  ),
  [
    "A shoe store sells sizes $34$ to $40$. The manager wants to know which size to order the most of.",
    "一家鞋店卖 $34$ 到 $40$ 码的鞋。店长想知道哪个码要进得最多。",
  ],
  [
    "The size sold most often, the mode, is the one to order; a mean such as $37.3$ is not even a size.",
    "卖得最多的码，也就是众数，才是要多进的；像 $37.3$ 这样的平均数根本不是一个码。",
  ],
  [
    "find one mode, several modes or none, and find the mode of categorical data.",
    "找出一个众数、几个众数或没有众数的情况，并求分类数据的众数。",
  ],
);

// ---------------------------------------------------------------------------
// Measures of spread

/** fiveNumbers writes a five-number summary as an option: "$2, 5, 8, 11, 15$". */
const fiveNumbers = (s: readonly Q[]): Pair => {
  const text = `$${list(s.map((q) => dec(q)))}$`;
  return [text, text];
};

export const rangeQuartilesAndIqr = withIntro(
  topic(
    "range-quartiles-and-iqr",
    t("Range, Quartiles, and IQR", "极差、四分位数与四分位距"),
    t(
      "The range is the greatest value minus the least. The median splits the sorted data into a lower and an upper half, leaving the median itself out when the count is odd; the first quartile Q₁ is the median of the lower half and the third quartile Q₃ the median of the upper half. The interquartile range is IQR = Q₃ − Q₁. The minimum, Q₁, the median, Q₃ and the maximum together form the five-number summary.",
      "极差是最大值减最小值。中位数把排好序的数据分成下半部分和上半部分，数据个数为奇数时中位数本身不计入任何一半；第一四分位数 Q₁ 是下半部分的中位数，第三四分位数 Q₃ 是上半部分的中位数。四分位距 IQR = Q₃ − Q₁。最小值、Q₁、中位数、Q₃ 和最大值合起来叫做五数概括。",
    ),
    ["range-and-interquartile-range", "the-median-of-a-data-set", "absolute-value"],
    ["6.SP.B.5.C"],
    [
      lesson(
        "the-range-with-negative-values",
        ["The range with negative values", "含负数的极差"],
        [
          [
            "The range is the greatest value minus the least, even when some values are negative. Low temperatures of $3, -5, 0, 6, -2$ °C have a greatest value of $6$ and a least value of $-5$, so the range is $6 - (-5) = 6 + 5 = 11$.",
            "即使有负数，极差也是最大值减最小值。最低气温 $3, -5, 0, 6, -2$ °C 中，最大值是 $6$，最小值是 $-5$，所以极差是 $6 - (-5) = 6 + 5 = 11$。",
          ],
          [
            "On the number line, $-5$ to $0$ is $5$ and $0$ to $6$ is $6$, and $5 + 6 = 11$.",
            "在数轴上，从 $-5$ 到 $0$ 是 $5$，从 $0$ 到 $6$ 是 $6$，$5 + 6 = 11$。",
          ],
          ["Subtracting a negative adds its size. The range is not $6 - 5 = 1$.", "减去一个负数等于加上它的绝对值。极差不是 $6 - 5 = 1$。"],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(5, 8);
            const xs = data(rng, n, -15, 20);
            const [lo, hi] = [Math.min(...xs), Math.max(...xs)];
            if (lo >= 0 || hi <= 0 || hi + lo === 0) continue;
            return valued(
              [
                `The low temperatures, in °C, in a town on $${n}$ winter days were $${list(xs)}$. What is the range of the temperatures?`,
                `某镇冬季 $${n}$ 天的最低气温（°C）分别是 $${list(xs)}$。这些气温的极差是多少？`,
              ],
              hi - lo,
              [
                [
                  ["Find the extremes", "找最大值和最小值"],
                  ["Scan the list:", "看一遍数据："],
                  [`\\text{greatest} = ${hi}, \\ \\text{least} = ${lo}`],
                ],
                [
                  ["Subtract", "相减"],
                  ["Subtracting a negative adds its size:", "减去负数等于加上它的绝对值："],
                  [`${hi} - (${lo}) = ${hi} + ${-lo} = ${hi - lo}`],
                ],
              ],
              [
                `From $${lo}$ up to $0$ is $${-lo}$, and from $0$ up to $${hi}$ is $${hi}$: $${-lo} + ${hi} = ${hi - lo}$.`,
                `从 $${lo}$ 到 $0$ 是 $${-lo}$，从 $0$ 到 $${hi}$ 是 $${hi}$：$${-lo} + ${hi} = ${hi - lo}$。`,
              ],
              [
                [Math.abs(hi + lo), "That drops the minus sign of the least value and subtracts.", "这是去掉了最小值的负号再相减。"],
                [hi + lo, "That adds the greatest and least values.", "这是把最大值和最小值相加。"],
                [hi, "That is the greatest value alone.", "这只是最大值。"],
              ],
            );
          }
        },
        lineFigure(
          {
            lo: -6,
            hi: 7,
            step: 1,
            labels: [-5, 0, 6],
            marks: [{ at: -5 }, { at: -2 }, { at: 0 }, { at: 3 }, { at: 6 }],
            jumps: [
              [-5, 0],
              [0, 6],
            ],
          },
          [
            "Temperatures from -5 to 6: a jump of 5 up to 0 and 6 more up to 6, a range of 11.",
            "气温从 -5 到 6：先到 0 走了 5，再到 6 走了 6，极差是 11。",
          ],
        ),
      ),
      lesson(
        "finding-a-quartile",
        ["Finding a quartile", "求四分位数"],
        [
          [
            "Sort the data and find the median. With an odd count the median belongs to neither half. For $5, 1, 9, 4, 12, 7, 3$, sorted $1, 3, 4, 5, 7, 9, 12$, the median is $5$; the lower half $1, 3, 4$ gives $Q_1 = 3$ and the upper half $7, 9, 12$ gives $Q_3 = 9$. With an even count the halves are simply the first and last halves of the list.",
            "先排序，求出中位数。数据个数为奇数时，中位数不属于任何一半。对 $5, 1, 9, 4, 12, 7, 3$，排序得 $1, 3, 4, 5, 7, 9, 12$，中位数是 $5$；下半部分 $1, 3, 4$ 得 $Q_1 = 3$，上半部分 $7, 9, 12$ 得 $Q_3 = 9$。数据个数为偶数时，两半就是列表的前一半和后一半。",
          ],
          [
            "Within the lower half $1, 3, 4$, one value lies below $3$ and one above it.",
            "在下半部分 $1, 3, 4$ 中，比 $3$ 小的有一个，比它大的也有一个。",
          ],
          [
            "Leave the median out of both halves when the count is odd. Keeping it gives $Q_1 = 3.5$, which is wrong.",
            "数据个数为奇数时，两半都不含中位数。如果把它算进去，会得到 $Q_1 = 3.5$，这是错的。",
          ],
        ],
        (rng) => {
          const n = rng.int(7, 12);
          const xs = data(rng, n, 1, 60);
          const s = sorted(xs);
          const [lower, upper] = halves(xs);
          const third = rng.bool();
          const [q1, q3] = quartiles(xs);
          const [i1, i3] = inclusiveQuartiles(xs);
          const name: Pair = third ? ["third quartile", "第三四分位数"] : ["first quartile", "第一四分位数"];
          const half = third ? upper : lower;
          const q = third ? q3 : q1;
          const mark = third ? "Q_3" : "Q_1";
          return valued(
            [`Find the ${name[0]} of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的${name[1]}。`],
            q,
            [
              [
                ["Sort", "排序"],
                [`From least to greatest; the median is $${dec(median(xs))}$:`, `从小到大排列，中位数是 $${dec(median(xs))}$：`],
                [list(s)],
              ],
              [
                ["Take the half", "取一半"],
                [
                  `The ${third ? "upper" : "lower"} half${n % 2 === 1 ? ", leaving the median out," : ""} is $${list(half)}$; its median is`,
                  `${third ? "上" : "下"}半部分${n % 2 === 1 ? "（不含中位数）" : ""}是 $${list(half)}$，它的中位数是`,
                ],
                [`${mark} = ${dec(q)}`],
              ],
            ],
            middleCheck(half, String, dec(q)),
            [
              [third ? i3 : i1, "That keeps the median in the half.", "这把中位数也放进了这一半。"],
              [median(xs), "That is the median of all the data.", "这是全部数据的中位数。"],
              [
                third ? q1 : q3,
                `That is the ${third ? "first" : "third"} quartile, from the other half.`,
                `这是另一半给出的${third ? "第一" : "第三"}四分位数。`,
              ],
              [
                median(third ? xs.slice(n - Math.floor(n / 2)) : xs.slice(0, Math.floor(n / 2))),
                "That takes the half from the list before sorting.",
                "这是从没排序的列表中取的一半。",
              ],
            ],
            { form: "decimal" },
          );
        },
        boxPlotFigure([1, 3, 5, 9, 12], { min: 0, max: 14, step: 1, labelEvery: 2 }),
      ),
      lesson(
        "the-five-number-summary",
        ["The five-number summary", "五数概括"],
        [
          [
            "The **five-number summary** lists the minimum, $Q_1$, the median, $Q_3$ and the maximum. Find all five from the sorted data. For $1, 3, 4, 5, 7, 9, 12$ it is $1, 3, 5, 9, 12$.",
            "**五数概括**依次列出最小值、$Q_1$、中位数、$Q_3$ 和最大值。五个数都要从排好序的数据中找。对 $1, 3, 4, 5, 7, 9, 12$，五数概括是 $1, 3, 5, 9, 12$。",
          ],
          [
            "The five numbers increase from left to right, and $5$ is the fourth of seven values.",
            "五个数从左到右递增，而 $5$ 是七个数中的第四个。",
          ],
          [
            "The middle number is the median, not the mean. Here the mean is about $5.9$.",
            "中间的那个数是中位数，不是平均数。这里平均数约是 $5.9$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.pick([7, 9, 11]);
            const xs = distinctData(rng, n, 1, 50);
            const s = sorted(xs);
            const [q1, q3] = quartiles(xs);
            const [i1, i3] = inclusiveQuartiles(xs);
            const lo = Q.of(s[0] as number);
            const hi = Q.of(s[n - 1] as number);
            const med = median(xs);
            const h = Math.floor(n / 2);
            const right = fiveNumbers([lo, q1, med, q3, hi]);
            const candidates: Wrong[] = [
              [
                fiveNumbers([lo, i1, med, i3, hi]),
                "That keeps the median in both halves for the quartiles.",
                "这在求四分位数时把中位数放进了两半。",
              ],
              [
                fiveNumbers([
                  Q.of(xs[0] as number),
                  median(xs.slice(0, h)),
                  Q.of(xs[h] as number),
                  median(xs.slice(n - h)),
                  Q.of(xs[n - 1] as number),
                ]),
                "That reads the values from the list before sorting.",
                "这是从没排序的列表中读的数。",
              ],
              [
                fiveNumbers([lo, Q.of(s[1] as number), med, Q.of(s[n - 2] as number), hi]),
                "That takes the second and second-to-last values as the quartiles.",
                "这把第二个和倒数第二个数当成了四分位数。",
              ],
            ];
            const m = mean(xs);
            if (clean(m) && !m.eq(med))
              candidates.push([
                fiveNumbers([lo, q1, m, q3, hi]),
                "That puts the mean in the middle instead of the median.",
                "这把平均数放在中间，而不是中位数。",
              ]);
            const seen = new Set([right[0]]);
            const wrong = candidates.filter(([o]) => !seen.has(o[0]) && seen.add(o[0]));
            if (wrong.length < 2) continue;
            return chosen(
              rng,
              [`What is the five-number summary of the data set $${list(xs)}$?`, `数据 $${list(xs)}$ 的五数概括是什么？`],
              right,
              wrong,
              [
                [
                  ["Sort", "排序"],
                  [
                    `The extremes are $${s[0]}$ and $${s[n - 1]}$, and the median is $${dec(med)}$:`,
                    `两端是 $${s[0]}$ 和 $${s[n - 1]}$，中位数是 $${dec(med)}$：`,
                  ],
                  [list(s)],
                ],
                [
                  ["Find the quartiles", "求四分位数"],
                  [
                    `The lower half $${list(s.slice(0, h))}$ and the upper half $${list(s.slice(n - h))}$ give`,
                    `下半部分 $${list(s.slice(0, h))}$ 和上半部分 $${list(s.slice(n - h))}$ 给出`,
                  ],
                  [`Q_1 = ${dec(q1)}, \\ Q_3 = ${dec(q3)}`],
                ],
              ],
              [
                `The five numbers increase, and $${dec(med)}$ is value $${h + 1}$ of $${n}$, with $${h}$ on each side.`,
                `五个数依次增大，$${dec(med)}$ 是 $${n}$ 个数中的第 $${h + 1}$ 个，两边各有 $${h}$ 个。`,
              ],
            );
          }
        },
        dotPlotFigure([1, 3, 4, 5, 7, 9, 12], { min: 0, max: 14, step: 1 }),
      ),
    ],
  ),
  [
    "Over five winter days a mountain town's low temperatures were $3, -5, 0, 6$ and $-2$ °C. How far apart are the coldest and the warmest?",
    "一个山城五个冬日的最低气温是 $3, -5, 0, 6$ 和 $-2$ °C。最冷和最暖相差多少？",
  ],
  [
    "From $-5$ up to $0$ is $5$ degrees and from $0$ up to $6$ is $6$ more, $11$ in all.",
    "从 $-5$ 到 $0$ 是 $5$ 度，从 $0$ 到 $6$ 又是 $6$ 度，一共 $11$ 度。",
  ],
  [
    "find the range when values are negative, find the quartiles, and write the five-number summary.",
    "求含负数数据的极差，求四分位数，并写出五数概括。",
  ],
);

// ---------------------------------------------------------------------------
// Outliers

/** withOutlier draws 7 to 9 values between 20 and 40 and one value far outside them, the only outlier. */
function withOutlier(rng: Rng): { base: number[]; extreme: number; xs: number[] } {
  for (;;) {
    const base = data(rng, rng.int(7, 9), 20, 40);
    const high = rng.bool();
    const extreme = high ? Math.max(...base) + rng.int(18, 40) : Math.min(...base) - rng.int(12, 19);
    const xs = rng.shuffle([...base, extreme]);
    const out = xs.filter((x) => isOutlier(xs, x));
    if (out.length === 1 && out[0] === extreme && !quartiles(xs)[0].eq(quartiles(xs)[1])) return { base, extreme, xs };
  }
}

/** outlierStep finds the outlier of xs by its fences in one labelled step. */
function outlierStep(xs: readonly number[], extreme: number): Walk {
  const [q1, q3] = quartiles(xs);
  const iqr = q3.sub(q1);
  const k = iqr.mul(Q.of(3, 2));
  return [
    ["Find the outlier", "找离群值"],
    [
      `Sorted: $${list(sorted(xs))}$, so $Q_1 = ${dec(q1)}$, $Q_3 = ${dec(q3)}$ and $\\text{IQR} = ${dec(iqr)}$. Only $${extreme}$ lies outside the fences:`,
      `排序后：$${list(sorted(xs))}$，$Q_1 = ${dec(q1)}$，$Q_3 = ${dec(q3)}$，$\\text{IQR} = ${dec(iqr)}$。只有 $${extreme}$ 落在界限之外：`,
    ],
    [`${dec(q1.sub(k))} \\ \\text{to} \\ ${dec(q3.add(k))}`],
  ];
}

export const removingOutliers = withIntro(
  topic(
    "removing-outliers",
    t("Removing Outliers", "去掉离群值"),
    t(
      "An outlier is a value more than 1.5 × IQR below Q₁ or above Q₃. An outlier caused by a mistake, or one that does not belong to the group being studied, is often removed before the data are summarized. Removing it changes the count, the mean and the range a lot, but the median and the IQR only a little.",
      "离群值是比 Q₁ 小 1.5 × IQR 以上，或比 Q₃ 大 1.5 × IQR 以上的值。由错误造成的离群值，或不属于所研究群体的离群值，常常在概括数据之前被去掉。去掉它会使数据个数、平均数和极差变化很大，而中位数和四分位距只稍有变化。",
    ),
    ["outliers", "range-quartiles-and-iqr", "the-mean-of-a-data-set"],
    ["6.SP.B.5.C", "6.SP.B.5.D"],
    [
      lesson(
        "the-mean-without-the-outlier",
        ["The mean without the outlier", "去掉离群值后的平均数"],
        [
          [
            "Find the outlier with the fences, remove it, and take the mean of the rest. $12, 15, 14, 60, 13, 14$ has the outlier $60$. Without it, the five values add up to $68$, and the mean is $68 \\div 5 = 13.6$.",
            "先用界限找出离群值，去掉它，再求其余数据的平均数。$12, 15, 14, 60, 13, 14$ 中有离群值 $60$。去掉它后，五个数之和是 $68$，平均数是 $68 \\div 5 = 13.6$。",
          ],
          ["$5 \\times 13.6 = 68$.", "$5 \\times 13.6 = 68$。"],
          ["Divide by the new count, $5$, not by the original $6$.", "要除以新的个数 $5$，不是原来的 $6$。"],
        ],
        (rng) => {
          for (;;) {
            const { base, extreme, xs } = withOutlier(rng);
            const m = mean(base);
            if (!clean(m)) continue;
            return valued(
              [
                `The data set $${list(xs)}$ has one outlier. What is the mean of the data once the outlier is removed?`,
                `数据 $${list(xs)}$ 中有一个离群值。去掉离群值后，数据的平均数是多少？`,
              ],
              m,
              [
                outlierStep(xs, extreme),
                [
                  ["Average the rest", "求其余的平均数"],
                  [`The other $${base.length}$ values add up to $${sum(base)}$:`, `其余 $${base.length}$ 个数之和是 $${sum(base)}$：`],
                  [`${sum(base)} \\div ${base.length} = ${dec(m)}`],
                ],
              ],
              [`$${base.length} \\times ${dec(m)} = ${sum(base)}$.`, `$${base.length} \\times ${dec(m)} = ${sum(base)}$。`],
              [
                [mean(xs), "That is the mean with the outlier still in.", "这是含离群值的平均数。"],
                [Q.of(sum(base), xs.length), `That divides by the old count, $${xs.length}$.`, `这是除以原来的个数 $${xs.length}$。`],
                [median(base), "That is the median of the rest, not the mean.", "这是其余数据的中位数，不是平均数。"],
              ],
              { form: "decimal" },
            );
          }
        },
        dotPlotFigure([12, 13, 14, 14, 15, 60], { min: 10, max: 62, step: 1, labelEvery: 10 }),
      ),
      lesson(
        "the-median-without-the-outlier",
        ["The median without the outlier", "去掉离群值后的中位数"],
        [
          [
            "The median depends only on the middle of the data, so removing an outlier barely moves it. $12, 15, 14, 60, 13, 14$ sorted is $12, 13, 14, 14, 15, 60$, with median $14$. Without the outlier $60$, the five values $12, 13, 14, 14, 15$ have median $14$ again.",
            "中位数只取决于中间的数据，所以去掉离群值几乎不会让它移动。$12, 15, 14, 60, 13, 14$ 排序后是 $12, 13, 14, 14, 15, 60$，中位数是 $14$。去掉离群值 $60$ 后，五个数 $12, 13, 14, 14, 15$ 的中位数仍是 $14$。",
          ],
          [
            "Two values, $12$ and $13$, lie before the middle $14$ and two, $14$ and $15$, after it.",
            "中间的 $14$ 前面有 $12$ 和 $13$ 两个数，后面有 $14$ 和 $15$ 两个数。",
          ],
          ["Sort the remaining values again before finding the middle.", "找中间之前，要把剩下的数重新排好序。"],
        ],
        (rng) => {
          const { base, extreme, xs } = withOutlier(rng);
          const m = median(base);
          const s = sorted(base);
          const n = base.length;
          return valued(
            [
              `The data set $${list(xs)}$ has one outlier. What is the median of the data once the outlier is removed?`,
              `数据 $${list(xs)}$ 中有一个离群值。去掉离群值后，数据的中位数是多少？`,
            ],
            m,
            [outlierStep(xs, extreme), middleStep(s, String, dec(m))],
            middleCheck(s, String, dec(m)),
            [
              [median(xs), "That is the median with the outlier still in.", "这是含离群值的中位数。"],
              [
                unsortedMiddle(xs.filter((x) => x !== extreme)),
                "That is the middle of the remaining list before sorting.",
                "这是剩下的列表排序前中间的数。",
              ],
              [mean(base), "That is the mean of the rest, not the median.", "这是其余数据的平均数，不是中位数。"],
              [
                Q.of((s[0] as number) + (s[n - 1] as number), 2),
                "That is halfway between the smallest and largest, not the middle value.",
                "这是最小值和最大值的中点，不是中间的数。",
              ],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["12", "13", "14", "14", "15"], [1, 2, 3, 4, 5]),
      ),
      lesson(
        "the-range-without-the-outlier",
        ["The range without the outlier", "去掉离群值后的极差"],
        [
          [
            "The range uses only the two extreme values, so a single outlier can make it very large. With the outlier $60$, the range of $12, 13, 14, 14, 15, 60$ is $60 - 12 = 48$. Without it, the range is $15 - 12 = 3$.",
            "极差只用到两个极端值，所以一个离群值就能使它变得很大。含离群值 $60$ 时，$12, 13, 14, 14, 15, 60$ 的极差是 $60 - 12 = 48$。去掉它后，极差是 $15 - 12 = 3$。",
          ],
          ["$12 + 3 = 15$, the new largest value.", "$12 + 3 = 15$，正是新的最大值。"],
          [
            "After removing the outlier, use the new largest or smallest value, not the outlier.",
            "去掉离群值后，要用新的最大值或最小值，不能再用离群值。",
          ],
        ],
        (rng) => {
          const { base, extreme, xs } = withOutlier(rng);
          const [lo, hi] = [Math.min(...base), Math.max(...base)];
          const r = hi - lo;
          const full = Math.max(...xs) - Math.min(...xs);
          return valued(
            [
              `The data set $${list(xs)}$ has one outlier. What is the range of the data once the outlier is removed?`,
              `数据 $${list(xs)}$ 中有一个离群值。去掉离群值后，数据的极差是多少？`,
            ],
            r,
            [
              outlierStep(xs, extreme),
              [
                ["Subtract", "相减"],
                [`Without it, the greatest value is $${hi}$ and the least $${lo}$:`, `去掉它后，最大值是 $${hi}$，最小值是 $${lo}$：`],
                [`${hi} - ${lo} = ${r}`],
              ],
            ],
            [`$${lo} + ${r} = ${hi}$.`, `$${lo} + ${r} = ${hi}$。`],
            [
              [full, "That is the range with the outlier still in.", "这是含离群值的极差。"],
              [full - r, "That is how much the outlier added to the range.", "这是离群值让极差增加的量。"],
              [hi, "That is the greatest value alone.", "这只是最大值。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 10,
            hi: 60,
            step: 5,
            labels: [10, 60],
            marks: [
              { at: 12, text: "12" },
              { at: 15, text: "15" },
              { at: 60, text: "60" },
            ],
            jumps: [[12, 15]],
          },
          ["Without the outlier 60, the values run from 12 to 15, a range of 3.", "去掉离群值 60 后，数据从 12 到 15，极差是 3。"],
        ),
      ),
    ],
  ),
  [
    "A class records how many minutes each student read: $12, 15, 14, 60, 13, 14$. The $60$ was a typing mistake for $16$.",
    "一个班记录了每个学生的阅读分钟数：$12, 15, 14, 60, 13, 14$。其中的 $60$ 是把 $16$ 打错了。",
  ],
  [
    "With the $60$, the mean is $128 \\div 6 \\approx 21.3$ minutes, more than every other value.",
    "算上 $60$，平均数是 $128 \\div 6 \\approx 21.3$ 分钟，比其他每个数都大。",
  ],
  ["remove an outlier and find the mean, the median and the range of what is left.", "去掉离群值，再求剩下数据的平均数、中位数和极差。"],
);

/** typicalData draws 7 to 9 values that are roughly symmetric and have no outlier, or the same with one outlier added. */
function typicalData(rng: Rng, outlier: boolean): { xs: number[]; extreme?: number } {
  for (;;) {
    const c = rng.int(25, 60);
    const base = data(rng, rng.int(7, 9), c - 8, c + 8);
    if (mean(base).sub(median(base)).abs().cmp(Q.one) > 0 || base.some((x) => isOutlier(base, x))) continue;
    if (!outlier) return { xs: base };
    const extreme = rng.bool() ? Math.max(...base) + rng.int(25, 50) : Math.max(1, Math.min(...base) - rng.int(20, 30));
    const xs = rng.shuffle([...base, extreme]);
    const out = xs.filter((x) => isOutlier(xs, x));
    if (out.length === 1 && out[0] === extreme) return { xs, extreme };
  }
}

/** fenceStep checks xs for an outlier by its fences in one labelled step. */
function fenceStep(xs: readonly number[], extreme: number | undefined): Walk {
  const [q1, q3] = quartiles(xs);
  const k = q3.sub(q1).mul(Q.of(3, 2));
  const fences = `${dec(q1.sub(k))} \\ \\text{to} \\ ${dec(q3.add(k))}`;
  return extreme === undefined
    ? [
        ["Look for outliers", "找离群值"],
        [
          `$Q_1 = ${dec(q1)}$ and $Q_3 = ${dec(q3)}$; every value lies inside the fences:`,
          `$Q_1 = ${dec(q1)}$，$Q_3 = ${dec(q3)}$；每个数据都在界限之内：`,
        ],
        [fences],
      ]
    : [
        ["Look for outliers", "找离群值"],
        [
          `$Q_1 = ${dec(q1)}$ and $Q_3 = ${dec(q3)}$; $${extreme}$ lies outside the fences:`,
          `$Q_1 = ${dec(q1)}$，$Q_3 = ${dec(q3)}$；$${extreme}$ 落在界限之外：`,
        ],
        [fences],
      ];
}

/** near writes a number to at most two decimal places, or rounded to one place when it does not end there. */
const near = (q: Q) => (clean(q) ? dec(q) : (Number(q.n) / Number(q.d)).toFixed(1));

/** centerPairs are the measures of center as options. */
const centerPairs: readonly [Pair, Pair] = [
  ["The mean", "平均数"],
  ["The median", "中位数"],
];

/** changePairs are what can happen to the mean and the median when one value changes. */
const changePairs: readonly [Pair, Pair, Pair, Pair] = [
  ["Only the mean changes", "只有平均数改变"],
  ["Only the median changes", "只有中位数改变"],
  ["Both change", "两者都改变"],
  ["Neither changes", "两者都不变"],
];

export const comparingMeasuresOfCenter = withIntro(
  topic(
    "comparing-measures-of-center",
    t("Comparing Measures of Center", "比较集中趋势量"),
    t(
      "The mean uses every value, so an outlier or a long tail pulls it toward the extreme values; the median depends only on the middle of the sorted data. When the data are roughly symmetric with no outliers, the mean is the usual measure of center. When the data have outliers or are strongly skewed, the median describes a typical value better.",
      "平均数用到每一个数据，所以离群值或长尾会把它拉向极端值；中位数只取决于排好序的数据的中间部分。数据大致对称、没有离群值时，通常用平均数表示中心。数据有离群值或明显偏斜时，中位数更能代表典型值。",
    ),
    ["removing-outliers"],
    ["6.SP.B.5.C", "6.SP.B.5.D"],
    [
      lesson(
        "the-mean-and-the-median",
        ["The mean and the median", "平均数与中位数"],
        [
          [
            "An outlier pulls the mean toward it, but hardly moves the median. For $4, 5, 5, 6, 7, 9, 34$ the median is $6$, but the mean is $70 \\div 7 = 10$: the outlier $34$ pulls the mean up by $4$, above six of the seven values. A low outlier pulls the mean below the median in the same way.",
            "离群值会把平均数拉向它，却几乎不影响中位数。对 $4, 5, 5, 6, 7, 9, 34$，中位数是 $6$，而平均数是 $70 \\div 7 = 10$：离群值 $34$ 把平均数拉高了 $4$，比七个数中的六个都大。同样，偏小的离群值会把平均数拉到中位数以下。",
          ],
          ["$6 + 4 = 10$.", "$6 + 4 = 10$。"],
          [
            "Sort before finding the median. The middle of the unsorted list is not the median.",
            "求中位数前要先排序。未排序列表中间的数不是中位数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const { xs } = typicalData(rng, true);
            const m = mean(xs);
            const med = median(xs);
            if (!clean(m) || m.eq(med)) continue;
            const meanBigger = m.cmp(med) > 0;
            const diff = m.sub(med).abs();
            const [big, small]: [Pair, Pair] = meanBigger
              ? [
                  ["mean", "平均数"],
                  ["median", "中位数"],
                ]
              : [
                  ["median", "中位数"],
                  ["mean", "平均数"],
                ];
            const [hi, lo] = meanBigger ? [m, med] : [med, m];
            return valued(
              [
                `For the data set $${list(xs)}$, how much greater is the ${big[0]} than the ${small[0]}?`,
                `对数据 $${list(xs)}$，${big[1]}比${small[1]}大多少？`,
              ],
              diff,
              [
                [
                  ["Find the mean", "求平均数"],
                  [`The $${xs.length}$ values add up to $${sum(xs)}$:`, `$${xs.length}$ 个数之和是 $${sum(xs)}$：`],
                  [`${sum(xs)} \\div ${xs.length} = ${dec(m)}`],
                ],
                [
                  ["Find the median", "求中位数"],
                  [`Sorted: $${list(sorted(xs))}$, so`, `排序后：$${list(sorted(xs))}$，所以`],
                  [`\\text{median} = ${dec(med)}`],
                ],
                [["Subtract", "相减"], ["The difference:", "两者之差："], [`${dec(hi)} - ${dec(lo)} = ${dec(diff)}`]],
              ],
              [`$${dec(lo)} + ${dec(diff)} = ${dec(hi)}$.`, `$${dec(lo)} + ${dec(diff)} = ${dec(hi)}$。`],
              [
                [m, "That is the mean itself, not the difference.", "这是平均数本身，不是差。"],
                [med, "That is the median itself, not the difference.", "这是中位数本身，不是差。"],
                [
                  m.sub(unsortedMiddle(xs)).abs(),
                  "That uses the middle of the unsorted list as the median.",
                  "这把未排序列表中间的数当成了中位数。",
                ],
              ],
              { form: "decimal" },
            );
          }
        },
        dotPlotFigure([4, 5, 5, 6, 7, 9, 34], { min: 0, max: 36, step: 1, labelEvery: 5 }),
      ),
      lesson(
        "choosing-a-measure-of-center",
        ["Choosing a measure of center", "选择集中趋势量"],
        [
          [
            "Check the data for outliers first. $21, 24, 25, 26, 28, 30$ has none and is roughly symmetric, so the mean, about $25.7$, is a good measure of center. $21, 24, 25, 26, 28, 30, 70$ has the outlier $70$, which pulls the mean up to $32$, above all but one value, so the median, $26$, is the better choice.",
            "先检查数据中有没有离群值。$21, 24, 25, 26, 28, 30$ 没有离群值且大致对称，所以平均数（约 $25.7$）是合适的中心量。$21, 24, 25, 26, 28, 30, 70$ 有离群值 $70$，它把平均数拉高到 $32$，比除它以外的所有数都大，所以中位数 $26$ 更合适。",
          ],
          ["$224 \\div 7 = 32$, and only $70$ is greater than $32$.", "$224 \\div 7 = 32$，只有 $70$ 比 $32$ 大。"],
          [
            "A large mean is not a reason to prefer it. Ask whether it still sits among the typical values.",
            "平均数大不是选它的理由。要看它是否仍在典型值之中。",
          ],
        ],
        (rng) => {
          const outlier = rng.bool();
          const { xs, extreme } = typicalData(rng, outlier);
          const m = mean(xs);
          const med = median(xs);
          const above = xs.filter((x) => Q.of(x).cmp(m) > 0).length;
          return chosen(
            rng,
            [
              `Which measure of center is more appropriate for the data set $${list(xs)}$: the mean or the median?`,
              `对数据 $${list(xs)}$，平均数和中位数哪个更适合描述它的中心？`,
            ],
            outlier ? centerPairs[1] : centerPairs[0],
            [
              outlier
                ? [
                    centerPairs[0],
                    `The outlier $${extreme}$ pulls the mean away from the typical values.`,
                    `离群值 $${extreme}$ 把平均数拉离了典型值。`,
                  ]
                : [
                    centerPairs[1],
                    "With no outlier, the mean uses every value and is not pulled away.",
                    "没有离群值时，平均数用到每个数据，也不会被拉偏。",
                  ],
            ],
            [
              fenceStep(xs, extreme),
              [
                ["Compare", "比较"],
                [
                  `The mean is $\\frac{${sum(xs)}}{${xs.length}} ${about(m)}$ and the median is $${dec(med)}$.`,
                  `平均数是 $\\frac{${sum(xs)}}{${xs.length}} ${about(m)}$，中位数是 $${dec(med)}$。`,
                ],
              ],
            ],
            outlier
              ? [
                  `Only $${above}$ of the $${xs.length}$ values are above the mean, so the mean is not a typical value.`,
                  `$${xs.length}$ 个数中只有 $${above}$ 个比平均数大，所以平均数不是典型值。`,
                ]
              : [
                  `The mean and the median are within $1$ of each other, as expected for symmetric data.`,
                  `平均数和中位数相差不到 $1$，对称的数据正是这样。`,
                ],
          );
        },
        dotPlotFigure([21, 24, 25, 26, 28, 30, 70], { min: 20, max: 72, step: 1, labelEvery: 10 }),
      ),
      lesson(
        "changing-a-value",
        ["Changing a value", "改变一个数据"],
        [
          [
            "Changing any value changes the sum, so it always changes the mean. The median changes only if the middle of the sorted data changes. In $3, 5, 8, 10, 12$, changing $12$ to $30$ leaves the median at $8$ but raises the mean. Changing $3$ to $11$ gives $5, 8, 10, 11, 12$, and the median becomes $10$.",
            "改变任何一个数据都会改变总和，所以平均数一定改变。只有排好序的数据的中间发生变化时，中位数才会改变。在 $3, 5, 8, 10, 12$ 中，把 $12$ 改成 $30$，中位数仍是 $8$，但平均数变大了。把 $3$ 改成 $11$ 得 $5, 8, 10, 11, 12$，中位数变成 $10$。",
          ],
          [
            "In $3, 5, 8, 10, 30$ two values are still below $8$ and two above it.",
            "在 $3, 5, 8, 10, 30$ 中，比 $8$ 小的仍有两个，比它大的也有两个。",
          ],
          ["The mean always changes when a value changes; only the median can stay put.", "数据改变时平均数一定改变，只有中位数可能不变。"],
        ],
        (rng) => {
          for (;;) {
            const n = rng.pick([5, 7, 9]);
            const xs = distinctData(rng, n, 2, 40);
            const s = sorted(xs);
            const h = Math.floor(n / 2);
            const kind = rng.pick(["largest", "smallest", "cross", "middle"] as const);
            const [first, last, mid] = [s[0] as number, s[n - 1] as number, s[h] as number];
            const [from, to] =
              kind === "largest"
                ? [last, last + rng.int(5, 40)]
                : kind === "smallest"
                  ? [first, Math.max(0, first - rng.int(1, 10))]
                  : kind === "cross"
                    ? rng.bool()
                      ? [first, mid + rng.int(1, 15)]
                      : [last, Math.max(0, mid - rng.int(1, 15))]
                    : [mid, mid + rng.pick([-1, 1]) * rng.int(1, 3)];
            if (to === from || xs.includes(to)) continue;
            const after = xs.map((x) => (x === from ? to : x));
            const old = median(xs);
            const changes = !median(after).eq(old);
            const below = after.filter((x) => Q.of(x).cmp(old) < 0).length;
            const over = after.filter((x) => Q.of(x).cmp(old) > 0).length;
            const [right, ...rest] = changes
              ? [changePairs[2], changePairs[0], changePairs[1], changePairs[3]]
              : [changePairs[0], changePairs[2], changePairs[1], changePairs[3]];
            return chosen(
              rng,
              [
                `In the data set $${list(xs)}$, the value $${from}$ is changed to $${to}$. What happens to the mean and the median?`,
                `在数据 $${list(xs)}$ 中，把 $${from}$ 改成 $${to}$。平均数和中位数会怎样？`,
              ],
              right,
              [
                [
                  rest[0] as Pair,
                  changes
                    ? "The middle of the sorted data moves, so the median changes too."
                    : "The middle of the sorted data stays the same, so the median does not change.",
                  changes ? "排好序的数据中间变了，所以中位数也变了。" : "排好序的数据中间没变，所以中位数不变。",
                ],
                [rest[1] as Pair, "The sum changes, so the mean must change.", "总和变了，所以平均数一定改变。"],
                [rest[2] as Pair, "The sum changes, so the mean must change.", "总和变了，所以平均数一定改变。"],
              ],
              [
                [
                  ["The mean", "平均数"],
                  [`The sum changes by $${to - from}$, so the mean changes by`, `总和变化了 $${to - from}$，所以平均数变化了`],
                  [`\\frac{${to - from}}{${n}} \\neq 0`],
                ],
                [
                  ["The median", "中位数"],
                  changes
                    ? [
                        `Sorted, the new data are $${list(sorted(after))}$; the median changes from $${dec(old)}$ to $${dec(median(after))}$.`,
                        `新数据排序为 $${list(sorted(after))}$，中位数从 $${dec(old)}$ 变成 $${dec(median(after))}$。`,
                      ]
                    : [
                        `Sorted, the new data are $${list(sorted(after))}$; the median is still $${dec(old)}$.`,
                        `新数据排序为 $${list(sorted(after))}$，中位数仍是 $${dec(old)}$。`,
                      ],
                ],
              ],
              [
                `In the new data, $${below}$ values are below the old median $${dec(old)}$ and $${over}$ above it, so it ${changes ? "is no longer" : "is still"} the middle.`,
                `新数据中，比原中位数 $${dec(old)}$ 小的有 $${below}$ 个，大的有 $${over}$ 个，所以它${changes ? "不再" : "仍然"}在中间。`,
              ],
            );
          }
        },
        dotPlotFigure([3, 5, 8, 10, 30], { min: 0, max: 32, step: 1, labelEvery: 4 }),
      ),
    ],
  ),
  [
    "Seven friends earn $4, 5, 5, 6, 7, 9$ and $34$ dollars a week from chores. Which number tells a newcomer what a typical friend earns?",
    "七个朋友每周做家务分别挣 $4, 5, 5, 6, 7, 9$ 和 $34$ 美元。哪个数能告诉新来的人一个朋友通常挣多少？",
  ],
  [
    "The mean is $70 \\div 7 = 10$, more than six of them earn; the median, $6$, sits among them.",
    "平均数是 $70 \\div 7 = 10$，比其中六人挣得都多；中位数 $6$ 才在他们中间。",
  ],
  [
    "compare the mean with the median, choose the better one for a data set, and see which one a change of value moves.",
    "比较平均数和中位数，为数据选出更合适的一个，并看看改变一个数据会影响哪一个。",
  ],
);

/** mad is the mean absolute deviation of a data set. */
function mad(xs: readonly number[]): Q {
  const m = mean(xs);
  return xs.reduce((s, x) => s.add(Q.of(x).sub(m).abs()), Q.zero).div(Q.of(xs.length));
}

/** integerMean draws n values in [lo, hi] whose mean is an integer. */
function integerMean(rng: Rng, n: number, lo: number, hi: number): number[] {
  for (;;) {
    const xs = data(rng, n, lo, hi);
    if (sum(xs) % n === 0) return xs;
  }
}

/** setPairs are the two data sets of a comparison as options. */
const setPairs: readonly [Pair, Pair] = [
  ["Data set A", "数据集 A"],
  ["Data set B", "数据集 B"],
];

/** spreadPairs are the measures of spread as options. */
const spreadPairs: readonly [Pair, Pair] = [
  ["The mean absolute deviation", "平均绝对偏差"],
  ["The interquartile range", "四分位距"],
];

export const comparingMeasuresOfSpread = withIntro(
  topic(
    "comparing-measures-of-spread",
    t("Comparing Measures of Spread", "比较离散程度量"),
    t(
      "The range, the interquartile range and the mean absolute deviation all measure how spread out data are. The MAD goes with the mean: it is the mean distance from the mean, so it uses every value. The IQR goes with the median: it is the spread of the middle half, so outliers barely affect it. Use the MAD for roughly symmetric data without outliers, and the IQR for data with outliers.",
      "极差、四分位距和平均绝对偏差都衡量数据的分散程度。平均绝对偏差与平均数搭配：它是各数据到平均数的平均距离，用到每一个数据。四分位距与中位数搭配：它是中间一半数据的分散程度，几乎不受离群值影响。数据大致对称、没有离群值时用平均绝对偏差，有离群值时用四分位距。",
    ),
    ["mean-absolute-deviation", "removing-outliers"],
    ["6.SP.A.3", "6.SP.B.5.C", "6.SP.B.5.D"],
    [
      lesson(
        "comparing-mads",
        ["Comparing mean absolute deviations", "比较平均绝对偏差"],
        [
          [
            "Two data sets can share a mean and still differ in spread. A: $4, 6, 8, 10$ has mean $7$ and distances $3, 1, 1, 3$, so its MAD is $2$. B: $1, 7, 7, 13$ also has mean $7$, with distances $6, 0, 0, 6$, so its MAD is $3$. B's values lie farther from the mean on average, so B is more spread out.",
            "两组数据可以平均数相同，而分散程度不同。A：$4, 6, 8, 10$ 的平均数是 $7$，各数到平均数的距离是 $3, 1, 1, 3$，所以 MAD 是 $2$。B：$1, 7, 7, 13$ 的平均数也是 $7$，距离是 $6, 0, 0, 6$，所以 MAD 是 $3$。平均来看 B 的数据离平均数更远，所以 B 更分散。",
          ],
          ["The total distances are $8$ for A and $12$ for B, over the same $4$ values.", "A 的距离之和是 $8$，B 是 $12$，个数都是 $4$。"],
          [
            "The same mean does not mean the same spread. Compare the distances, not the means.",
            "平均数相同不等于分散程度相同。要比较距离，而不是平均数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.pick([4, 5]);
            const c = rng.int(8, 30);
            const a = integerMean(rng, n, c - 7, c + 7);
            const b = integerMean(rng, n, c - 7, c + 7);
            const [ma, mb] = [mad(a), mad(b)];
            const cmp = ma.cmp(mb);
            if (cmp === 0) continue;
            const dist = (xs: number[]) => xs.map((x) => Math.abs(x - sum(xs) / n));
            const step = (xs: number[], m: Q, label: string): Walk => [
              [`Set ${label}`, `数据集 ${label}`],
              [`Mean $${sum(xs) / n}$, distances $${list(dist(xs))}$:`, `平均数 $${sum(xs) / n}$，距离 $${list(dist(xs))}$：`],
              [`\\text{MAD} = ${sum(dist(xs))} \\div ${n} = ${dec(m)}`],
            ];
            const [win, lose] = cmp > 0 ? [setPairs[0], setPairs[1]] : [setPairs[1], setPairs[0]];
            const [mw, ml] = cmp > 0 ? [ma, mb] : [mb, ma];
            return chosen(
              rng,
              [
                `Data set A is $${list(a)}$ and data set B is $${list(b)}$. Which data set has the greater mean absolute deviation?`,
                `数据集 A 为 $${list(a)}$，数据集 B 为 $${list(b)}$。哪组数据的平均绝对偏差更大？`,
              ],
              win,
              [[lose, `Its MAD is $${dec(ml)}$, smaller than $${dec(mw)}$.`, `它的平均绝对偏差是 $${dec(ml)}$，比 $${dec(mw)}$ 小。`]],
              [step(a, ma, "A"), step(b, mb, "B")],
              [
                `The total distances are $${sum(dist(a))}$ for A and $${sum(dist(b))}$ for B, over the same $${n}$ values, so the larger total wins.`,
                `A 的距离之和是 $${sum(dist(a))}$，B 是 $${sum(dist(b))}$，个数都是 $${n}$，所以和大的那组更大。`,
              ],
            );
          }
        },
        tableFigure(["4", "6", "8", "10"], [3, 1, 1, 3]),
      ),
      lesson(
        "choosing-a-measure-of-spread",
        ["Choosing a measure of spread", "选择离散程度量"],
        [
          [
            "An outlier is far from the mean, so its large distance raises the MAD, while it barely moves the quartiles. So for data with an outlier, the IQR describes the spread of the typical values better; for roughly symmetric data without outliers, the MAD uses all the information. In $21, 24, 25, 26, 28, 30, 70$ the IQR is $30 - 24 = 6$, and the outlier $70$ hardly affects it.",
            "离群值离平均数很远，它的大距离会使平均绝对偏差变大，却几乎不影响四分位数。所以对有离群值的数据，四分位距更能描述典型值的分散程度；对大致对称、没有离群值的数据，平均绝对偏差用到了全部信息。在 $21, 24, 25, 26, 28, 30, 70$ 中，四分位距是 $30 - 24 = 6$，离群值 $70$ 几乎不影响它。",
          ],
          [
            "Without $70$, the IQR of $21, 24, 25, 26, 28, 30$ is $28 - 24 = 4$, still small.",
            "去掉 $70$ 后，$21, 24, 25, 26, 28, 30$ 的四分位距是 $28 - 24 = 4$，仍然很小。",
          ],
          [
            "Pair the MAD with the mean and the IQR with the median; do not mix them.",
            "平均绝对偏差配平均数，四分位距配中位数，不要混用。",
          ],
        ],
        (rng) => {
          const outlier = rng.bool();
          const { xs, extreme } = typicalData(rng, outlier);
          const iqrOf = (ys: readonly number[]) => {
            const [a, b] = quartiles(ys);
            return b.sub(a);
          };
          const rest = extreme === undefined ? xs : xs.filter((x) => x !== extreme);
          return chosen(
            rng,
            [
              `Which measure of spread is more appropriate for the data set $${list(xs)}$: the mean absolute deviation or the interquartile range?`,
              `对数据 $${list(xs)}$，平均绝对偏差和四分位距哪个更适合描述它的离散程度？`,
            ],
            outlier ? spreadPairs[1] : spreadPairs[0],
            [
              outlier
                ? [
                    spreadPairs[0],
                    `The outlier $${extreme}$ is far from the mean, so it inflates the MAD.`,
                    `离群值 $${extreme}$ 离平均数很远，会使平均绝对偏差偏大。`,
                  ]
                : [
                    spreadPairs[1],
                    "With no outlier, the MAD uses every value and is not distorted.",
                    "没有离群值时，平均绝对偏差用到每个数据，也不会失真。",
                  ],
            ],
            [
              fenceStep(xs, extreme),
              outlier
                ? [
                    ["Decide", "判断"],
                    [
                      "The outlier changes the MAD a lot and the quartiles hardly at all, so use the IQR.",
                      "离群值对平均绝对偏差影响很大，对四分位数几乎没有影响，所以用四分位距。",
                    ],
                  ]
                : [
                    ["Decide", "判断"],
                    [
                      "The data are roughly symmetric with no outlier, so use the MAD, which uses every value.",
                      "数据大致对称、没有离群值，所以用平均绝对偏差，它用到每个数据。",
                    ],
                  ],
            ],
            outlier
              ? [
                  `Without $${extreme}$ the MAD goes from about $${near(mad(xs))}$ to about $${near(mad(rest))}$, while the IQR moves only from $${dec(iqrOf(xs))}$ to $${dec(iqrOf(rest))}$.`,
                  `去掉 $${extreme}$ 后，平均绝对偏差从约 $${near(mad(xs))}$ 变为约 $${near(mad(rest))}$，而四分位距只从 $${dec(iqrOf(xs))}$ 变到 $${dec(iqrOf(rest))}$。`,
                ]
              : [
                  `The mean $${about(mean(xs))}$ and the median $${dec(median(xs))}$ are close, as they are for symmetric data.`,
                  `平均数 $${about(mean(xs))}$ 与中位数 $${dec(median(xs))}$ 很接近，对称的数据正是这样。`,
                ],
          );
        },
        boxPlotFigure([21, 24, 26, 30, 70], { min: 20, max: 72, step: 2, labelEvery: 5 }),
      ),
    ],
  ),
  [
    "Two basketball players both average $12$ points. One scores between $10$ and $14$ every game; the other scores $2$ one night and $25$ the next.",
    "两名篮球运动员场均都得 $12$ 分。一个每场都在 $10$ 到 $14$ 分之间；另一个这场 $2$ 分，下场 $25$ 分。",
  ],
  [
    "Same mean, but the second player's scores lie much farther from $12$, so the spread is larger.",
    "平均分相同，但第二个人的分数离 $12$ 远得多，所以更分散。",
  ],
  [
    "compare spreads with the MAD, and choose between the MAD and the IQR for a data set.",
    "用平均绝对偏差比较分散程度，并为数据在平均绝对偏差和四分位距之间做出选择。",
  ],
);

// ---------------------------------------------------------------------------
// Frequency tables

/** tableLatex writes a two-row table with a label in front of each row. */
function tableLatex(labels: readonly [string, string], top: readonly number[], bottom: readonly number[]): string {
  const cols = top.map(() => "c").join("|");
  return `\\begin{array}{|l|${cols}|}\\hline \\text{${labels[0]}} & ${top.join(" & ")} \\\\ \\hline \\text{${labels[1]}} & ${bottom.join(" & ")} \\\\ \\hline\\end{array}`;
}

/** Tally is a frequency table's story: its labels and the questions it can answer. */
interface Tally {
  readonly en: string;
  readonly zh: string;
  readonly labels: { readonly en: readonly [string, string]; readonly zh: readonly [string, string] };
  readonly first: number;
  readonly total: Text;
  readonly atLeast: (k: number) => Text;
  readonly mean: Text;
  readonly mode: Text;
}

/** tallies are the stories of the frequency tables. */
const tallies: readonly Tally[] = [
  {
    en: "The table shows how many pets each student in a class has.",
    zh: "表格显示了某班每个学生养的宠物数。",
    labels: { en: ["Pets", "Students"], zh: ["宠物数", "学生人数"] },
    first: 0,
    total: t("How many students are in the class?", "这个班有多少名学生？"),
    atLeast: (k) => t(`How many students have at least $${k}$ pets?`, `有多少名学生至少养了 $${k}$ 只宠物？`),
    mean: t("What is the mean number of pets per student?", "平均每个学生养了多少只宠物？"),
    mode: t("What is the mode of the numbers of pets?", "宠物数的众数是多少？"),
  },
  {
    en: "The table shows how many goals a soccer team scored in each game of a season.",
    zh: "表格显示了一支足球队一个赛季每场比赛的进球数。",
    labels: { en: ["Goals", "Games"], zh: ["进球数", "场数"] },
    first: 0,
    total: t("How many games did the team play?", "这支球队一共踢了多少场比赛？"),
    atLeast: (k) => t(`In how many games did the team score at least $${k}$ goals?`, `球队在多少场比赛中进球至少 $${k}$ 个？`),
    mean: t("What is the mean number of goals per game?", "平均每场进球多少个？"),
    mode: t("What is the mode of the numbers of goals per game?", "每场进球数的众数是多少？"),
  },
  {
    en: "A survey counted the people in each car that passed a school.",
    zh: "一项调查统计了经过学校的每辆车里的人数。",
    labels: { en: ["People", "Cars"], zh: ["人数", "车辆数"] },
    first: 1,
    total: t("How many cars were counted?", "一共统计了多少辆车？"),
    atLeast: (k) => t(`How many cars had at least $${k}$ people in them?`, `有多少辆车里至少有 $${k}$ 个人？`),
    mean: t("What is the mean number of people per car?", "平均每辆车里有多少人？"),
    mode: t("What is the mode of the numbers of people per car?", "每辆车人数的众数是多少？"),
  },
];

/** frequencyTable draws a story, five values and their frequencies, and writes the prompt's table. */
function frequencyTable(rng: Rng): { tally: Tally; values: number[]; freqs: number[]; table: Text; xs: number[] } {
  const tally = rng.pick(tallies);
  const values = Array.from({ length: 5 }, (_, i) => tally.first + i);
  const freqs = values.map(() => rng.int(0, 9));
  if (freqs.filter((f) => f > 0).length < 4) return frequencyTable(rng);
  const xs = values.flatMap((v, i) => Array.from({ length: freqs[i]! }, () => v));
  const table = t(`$$${tableLatex(tally.labels.en, values, freqs)}$$`, `$$${tableLatex(tally.labels.zh, values, freqs)}$$`);
  return { tally, values, freqs, table, xs };
}

/** petTable is the frequency table of pets per student used in the lessons. */
const petTable = tableFigure(["0", "1", "2", "3", "4"], [3, 8, 5, 2, 1]);

export const frequencyTables = withIntro(
  topic(
    "frequency-tables",
    t("Frequency Tables", "频数表"),
    t(
      "A frequency table lists each value of a data set with its frequency: the number of times it occurs. The number of observations is the sum of the frequencies, not the number of columns. The mode is the value with the greatest frequency. To find the mean, multiply each value by its frequency, add the products, and divide by the number of observations.",
      "频数表列出数据中的每个值及其频数，即它出现的次数。观测值的个数是各频数之和，而不是表格的列数。众数是频数最大的值。求平均数时，把每个值乘它的频数，把这些积相加，再除以观测值的个数。",
    ),
    ["the-mean-of-a-data-set", "the-mode-of-a-data-set"],
    ["6.SP.B.4", "6.SP.B.5.A", "6.SP.B.5.C"],
    [
      lesson(
        "counting-from-a-frequency-table",
        ["Counting from a frequency table", "从频数表中计数"],
        [
          [
            "Each frequency counts the observations with that value. In the table of pets per student, the frequencies for $0, 1, 2, 3, 4$ pets are $3, 8, 5, 2, 1$, so $3 + 8 + 5 + 2 + 1 = 19$ students answered. The students with at least $2$ pets number $5 + 2 + 1 = 8$.",
            "每个频数是取该值的观测值个数。在“每个学生的宠物数”表格中，养 $0, 1, 2, 3, 4$ 只宠物的频数分别是 $3, 8, 5, 2, 1$，所以共有 $3 + 8 + 5 + 2 + 1 = 19$ 名学生作答。至少养 $2$ 只宠物的学生有 $5 + 2 + 1 = 8$ 名。",
          ],
          [
            "The students with fewer than $2$ pets number $3 + 8 = 11$, and $11 + 8 = 19$.",
            "养不到 $2$ 只的学生有 $3 + 8 = 11$ 名，$11 + 8 = 19$。",
          ],
          [
            "Add the frequencies, not the values themselves, and do not count the columns.",
            "要加的是频数，不是值本身，也不是数表格的列数。",
          ],
        ],
        (rng) => {
          const { tally, values, freqs, table } = frequencyTable(rng);
          const n = sum(freqs);
          if (rng.bool(0.4)) {
            const [front, back] = [sum(freqs.slice(0, 2)), sum(freqs.slice(2))];
            return valued(
              [`${tally.en} ${table.en} ${tally.total.en}`, `${tally.zh}${table["zh-CN"]}${tally.total["zh-CN"]}`],
              n,
              [
                [
                  ["Read the frequencies", "读频数"],
                  [`The ${tally.labels.en[1].toLowerCase()} row gives:`, `“${tally.labels.zh[1]}”一行是：`],
                  [list(freqs)],
                ],
                [["Add", "相加"], ["Each observation is counted once:", "每个观测值都数一次："], [`${freqs.join(" + ")} = ${n}`]],
              ],
              [
                `The first two columns hold $${front}$ and the last three $${back}$: $${front} + ${back} = ${n}$.`,
                `前两列有 $${front}$，后三列有 $${back}$：$${front} + ${back} = ${n}$。`,
              ],
              [
                [values.length, "That counts the columns, not the observations.", "这是列数，不是观测值的个数。"],
                [sum(values), "That adds the values in the top row, not the frequencies.", "这是把上面一行的值相加，不是频数。"],
                [
                  sum(values.map((v, i) => v * (freqs[i] as number))),
                  `That is the total of all the ${tally.labels.en[0].toLowerCase()}, not the count.`,
                  `这是全部${tally.labels.zh[0]}的总和，不是个数。`,
                ],
              ],
            );
          }
          const i = rng.int(1, 3);
          const k = values[i] as number;
          const counted = freqs.slice(i);
          const answer = sum(counted);
          const before = sum(freqs.slice(0, i));
          return valued(
            [`${tally.en} ${table.en} ${tally.atLeast(k).en}`, `${tally.zh}${table["zh-CN"]}${tally.atLeast(k)["zh-CN"]}`],
            answer,
            [
              [
                ["Pick the columns", "选列"],
                [`“At least $${k}$” includes $${k}$, so take the columns`, `“至少 $${k}$”包括 $${k}$，所以取这几列`],
                [list(values.slice(i))],
              ],
              [
                ["Add their frequencies", "把频数相加"],
                ["Add the counts below them:", "把它们下面的个数相加："],
                [`${counted.join(" + ")} = ${answer}`],
              ],
            ],
            [
              `All the frequencies add to $${n}$, and the columns below $${k}$ hold $${before}$: $${n} - ${before} = ${answer}$.`,
              `全部频数之和是 $${n}$，小于 $${k}$ 的几列有 $${before}$：$${n} - ${before} = ${answer}$。`,
            ],
            [
              [
                answer - (freqs[i] as number),
                `That leaves out the column for $${k}$; “at least” includes it.`,
                `这漏掉了 $${k}$ 那一列；“至少”包括它。`,
              ],
              [values.length - i, "That counts the columns, not the observations in them.", "这数的是列数，不是其中的观测值个数。"],
              [n - answer, `That counts the observations below $${k}$.`, `这数的是小于 $${k}$ 的观测值。`],
              [sum(values.slice(i)), "That adds the values, not their frequencies.", "这是把值相加，不是把频数相加。"],
            ],
          );
        },
        petTable,
      ),
      lesson(
        "the-mode-from-a-frequency-table",
        ["The mode from a frequency table", "从频数表求众数"],
        [
          [
            "The mode is the value with the greatest frequency. With frequencies $3, 8, 5, 2, 1$ for $0, 1, 2, 3, 4$ pets, the greatest frequency is $8$, for $1$ pet. So the mode is $1$.",
            "众数是频数最大的值。养 $0, 1, 2, 3, 4$ 只宠物的频数分别是 $3, 8, 5, 2, 1$，最大的频数 $8$ 对应 $1$ 只宠物。所以众数是 $1$。",
          ],
          ["In the dot plot of the same data, the tallest stack is over $1$.", "在同一组数据的点图中，最高的一摞点在 $1$ 的上方。"],
          ["The mode is the value, $1$, not its frequency, $8$.", "众数是那个值 $1$，不是它的频数 $8$。"],
        ],
        (rng) => {
          for (;;) {
            const { tally, values, freqs, table } = frequencyTable(rng);
            const top = Math.max(...freqs);
            if (freqs.filter((f) => f === top).length !== 1) continue;
            const mode = values[freqs.indexOf(top)] as number;
            if (top === mode) continue;
            const others = freqs.filter((f) => f !== top);
            return valued(
              [`${tally.en} ${table.en} ${tally.mode.en}`, `${tally.zh}${table["zh-CN"]}${tally.mode["zh-CN"]}`],
              mode,
              [
                [
                  ["Find the greatest frequency", "找最大的频数"],
                  ["The largest number in the bottom row:", "下面一行中最大的数："],
                  [`${top}`],
                ],
                [["Read its value", "读出对应的值"], ["Above it in the top row:", "它上面一行的值："], [`\\text{mode} = ${mode}`]],
              ],
              [`Every other frequency, $${list(others)}$, is less than $${top}$.`, `其他频数 $${list(others)}$ 都小于 $${top}$。`],
              [
                [top, "That is the greatest frequency, not the value that has it.", "这是最大的频数，不是对应的值。"],
                [
                  values[values.length - 1] as number,
                  "That is the largest value, not the most frequent one.",
                  "这是最大的值，不是出现最多的值。",
                ],
                [values[freqs.indexOf(Math.min(...freqs))] as number, "That value has the smallest frequency.", "这个值的频数最小。"],
              ],
            );
          }
        },
        dotPlotFigure([0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4], { min: 0, max: 5, step: 1 }),
      ),
      lesson(
        "the-mean-from-a-frequency-table",
        ["The mean from a frequency table", "从频数表求平均数"],
        [
          [
            "Each value counts as many times as it occurs. With frequencies $3, 8, 5, 2, 1$ for $0, 1, 2, 3, 4$ pets, the pets add up to $0 \\times 3 + 1 \\times 8 + 2 \\times 5 + 3 \\times 2 + 4 \\times 1 = 28$, and there are $19$ students, so the mean is $28 \\div 19 \\approx 1.5$ pets.",
            "每个值出现几次就要算几次。养 $0, 1, 2, 3, 4$ 只宠物的频数分别是 $3, 8, 5, 2, 1$，宠物总数是 $0 \\times 3 + 1 \\times 8 + 2 \\times 5 + 3 \\times 2 + 4 \\times 1 = 28$，共 $19$ 名学生，所以平均数是 $28 \\div 19 \\approx 1.5$ 只。",
          ],
          [
            "$19 < 28 < 38$, so the mean is between $1$ and $2$ pets, as most students have $1$ or $2$.",
            "$19 < 28 < 38$，所以平均数在 $1$ 和 $2$ 之间，正好大多数学生养 $1$ 或 $2$ 只。",
          ],
          [
            "Adding just $0 + 1 + 2 + 3 + 4$ and dividing by $5$ ignores the frequencies.",
            "只把 $0 + 1 + 2 + 3 + 4$ 相加再除以 $5$，就忽略了频数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const { tally, values, freqs, table, xs } = frequencyTable(rng);
            const m = mean(xs);
            if (!clean(m)) continue;
            const products = values.map((v, i) => `${v} \\times ${freqs[i]}`).join(" + ");
            return valued(
              [`${tally.en} ${table.en} ${tally.mean.en}`, `${tally.zh}${table["zh-CN"]}${tally.mean["zh-CN"]}`],
              m,
              [
                [
                  ["Find the total", "求总和"],
                  ["Multiply each value by its frequency and add:", "每个值乘它的频数再相加："],
                  [`${products} = ${sum(xs)}`],
                ],
                [["Count the observations", "数观测值"], ["Add the frequencies:", "把频数相加："], [`${freqs.join(" + ")} = ${xs.length}`]],
                [["Divide", "相除"], ["Total over count:", "总和除以个数："], [`${sum(xs)} \\div ${xs.length} = ${dec(m)}`]],
              ],
              [`$${xs.length} \\times ${dec(m)} = ${sum(xs)}$.`, `$${xs.length} \\times ${dec(m)} = ${sum(xs)}$。`],
              [
                [mean(values), "That averages the values and ignores the frequencies.", "这是对各个值求平均，忽略了频数。"],
                [
                  Q.of(sum(xs), values.length),
                  "That divides by the number of columns, not of observations.",
                  "这是除以列数，不是观测值的个数。",
                ],
                [Q.of(sum(freqs), values.length), "That is the mean of the frequencies.", "这是各频数的平均数。"],
              ],
              { form: "decimal" },
            );
          }
        },
        petTable,
      ),
    ],
  ),
  [
    "A teacher asks $19$ students how many pets they have. Instead of writing $19$ numbers, she writes how many said $0$, $1$, $2$, $3$ and $4$.",
    "老师问 $19$ 名学生各养了几只宠物。她没有写下 $19$ 个数，而是记下说 $0$、$1$、$2$、$3$、$4$ 只的各有几人。",
  ],
  ["The five counts $3, 8, 5, 2, 1$ add up to the $19$ students.", "五个人数 $3, 8, 5, 2, 1$ 加起来正是 $19$ 名学生。"],
  ["count observations from a frequency table, and find its mode and its mean.", "从频数表中数观测值，并求它的众数和平均数。"],
);

// ---------------------------------------------------------------------------
// Measures from dot plots

/** dotPlotFigure draws a data set as a dot plot, with alt text listing how many dots sit at each value. */
export function dotPlotFigure(xs: readonly number[], axis: Axis): Figure {
  const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
  return {
    svg: dotPlot(xs, axis),
    alt: t(
      `Dot plot: ${counts.map(([v, n]) => `${n} at ${v}`).join(", ")}.`,
      `点图：${counts.map(([v, n]) => `${v} 处 ${n} 个点`).join("，")}。`,
    ),
  };
}

/** dotContexts are what a dot plot counts: [English, Chinese, smallest value on the axis]. */
const dotContexts: readonly (readonly [string, string, number])[] = [
  ["the number of books each student in a class read last month", "某班每个学生上个月读的书的本数", 0],
  ["the number of goals a team scored in each game of a season", "一支球队一个赛季每场比赛的进球数", 0],
  ["the hours of sleep each camper got on the first night", "每个营员第一晚的睡眠小时数", 4],
  ["the shoe sizes of the players on a team", "一支球队队员的鞋码", 35],
  ["the number of pets each family on a street has", "一条街上每户人家养的宠物数", 0],
];

/** dotData draws n values over span + 1 consecutive integers from lo. */
function dotData(rng: Rng, lo: number, n: number, span: number): { xs: number[]; axis: Axis } {
  return { xs: data(rng, n, lo, lo + span), axis: { min: lo, max: lo + span, step: 1 } };
}

/** stacks writes how many dots sit at each value: "2 at 3, 4 at 5". */
function stacks(xs: readonly number[]): Text {
  const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
  return t(counts.map(([v, n]) => `${n} at $${v}$`).join(", "), counts.map(([v, n]) => `$${v}$ 处 ${n} 个`).join("，"));
}

export const measuringCentralityFromDotPlots = withIntro(
  topic(
    "measuring-centrality-from-dot-plots",
    t("Measuring Centrality From Dot Plots", "从点图求集中趋势量"),
    t(
      "A dot plot shows every value of a data set, so the measures of center can be read from it. The mode is the value with the tallest stack. For the mean, each stack counts as its value repeated once per dot: add value × number of dots over all the stacks, and divide by the total number of dots.",
      "点图显示了数据中的每一个值，所以可以从中求出集中趋势量。众数是点叠得最高的那个值。求平均数时，每一叠点相当于它的值重复了点数那么多次：把每个值乘它的点数后相加，再除以点的总数。",
    ),
    ["dot-plots", "frequency-tables"],
    ["6.SP.B.4", "6.SP.B.5.C"],
    [
      lesson(
        "the-mean-from-a-dot-plot",
        ["The mean from a dot plot", "从点图求平均数"],
        [
          [
            "Every dot is one value. A dot plot with $2$ dots at $1$, $3$ at $2$, $4$ at $3$ and $1$ at $6$ has $10$ dots. Their sum is $1 \\times 2 + 2 \\times 3 + 3 \\times 4 + 6 \\times 1 = 26$, so the mean is $26 \\div 10 = 2.6$.",
            "每个点都是一个数据。某点图在 $1$ 处有 $2$ 个点，$2$ 处 $3$ 个，$3$ 处 $4$ 个，$6$ 处 $1$ 个，共 $10$ 个点。它们的和是 $1 \\times 2 + 2 \\times 3 + 3 \\times 4 + 6 \\times 1 = 26$，所以平均数是 $26 \\div 10 = 2.6$。",
          ],
          ["$10 \\times 2.6 = 26$.", "$10 \\times 2.6 = 26$。"],
          [
            "Averaging only the numbers under the stacks, $1, 2, 3, 6$, ignores how many dots each has.",
            "只对各叠下方的数 $1, 2, 3, 6$ 求平均，就忽略了每叠有几个点。",
          ],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const { xs, axis } = dotData(rng, lo, rng.pick([8, 10, 12, 15, 16, 20]), rng.int(5, 7));
            const m = mean(xs);
            if (!clean(m)) continue;
            const distinct = [...new Set(xs)];
            const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
            const products = counts.map(([v, k]) => `${v} \\times ${k}`).join(" + ");
            return valued(
              [`The dot plot shows ${en}. What is the mean?`, `点图表示${zh}。平均数是多少？`],
              m,
              [
                [
                  ["Add the dots", "求所有点的和"],
                  [`Each value times its number of dots, over the $${xs.length}$ dots:`, `每个值乘它的点数，共 $${xs.length}$ 个点：`],
                  [`${products} = ${sum(xs)}`],
                ],
                [
                  ["Divide", "相除"],
                  ["Share the total among the dots:", "把总和平均分给每个点："],
                  [`${sum(xs)} \\div ${xs.length} = ${dec(m)}`],
                ],
              ],
              [`$${xs.length} \\times ${dec(m)} = ${sum(xs)}$.`, `$${xs.length} \\times ${dec(m)} = ${sum(xs)}$。`],
              [
                [median(xs), "That is the median, the middle dot.", "这是中位数，即中间的点。"],
                [
                  mean(distinct),
                  "That averages the values under the stacks and ignores the number of dots.",
                  "这是对各叠下方的值求平均，忽略了点数。",
                ],
                [Q.of(sum(xs), distinct.length), "That divides by the number of stacks, not of dots.", "这是除以叠数，不是点数。"],
                [sum(xs), "That is the total; divide it by the number of dots.", "这是总和，还要除以点数。"],
              ],
              { form: "decimal", figure: dotPlotFigure(xs, axis) },
            );
          }
        },
        dotPlotFigure([1, 1, 2, 2, 2, 3, 3, 3, 3, 6], { min: 0, max: 7, step: 1 }),
      ),
      lesson(
        "the-mode-from-a-dot-plot",
        ["The mode from a dot plot", "从点图求众数"],
        [
          [
            "In a dot plot the mode is the value under the tallest stack. In a dot plot with $2$ dots at $1$, $3$ at $2$, $4$ at $3$ and $1$ at $6$, the tallest stack has $4$ dots, at $3$, so the mode is $3$.",
            "在点图中，众数是点叠得最高的那一叠下方的值。某点图在 $1$ 处有 $2$ 个点，$2$ 处 $3$ 个，$3$ 处 $4$ 个，$6$ 处 $1$ 个，最高的一叠有 $4$ 个点，在 $3$ 处，所以众数是 $3$。",
          ],
          ["The other stacks, $2$, $3$ and $1$ dots, are all shorter than $4$.", "其他各叠的点数 $2$、$3$、$1$ 都少于 $4$。"],
          [
            "The mode is the value under the stack, $3$, not the height of the stack, $4$.",
            "众数是那叠点下方的值 $3$，不是那叠点的高度 $4$。",
          ],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const { xs, axis } = dotData(rng, lo, rng.int(10, 16), rng.int(6, 8));
            const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
            const top = Math.max(...counts.map(([, k]) => k));
            const tops = counts.filter(([, k]) => k === top);
            if (tops.length !== 1) continue;
            const mode = (tops[0] as readonly [number, number])[0];
            const second = Math.max(...counts.filter(([, k]) => k !== top).map(([, k]) => k));
            return valued(
              [`The dot plot shows ${en}. What is the mode?`, `点图表示${zh}。众数是多少？`],
              mode,
              [
                [
                  ["Find the tallest stack", "找最高的一叠"],
                  [`The stacks hold ${stacks(xs).en}; the tallest has`, `各叠点数：${stacks(xs)["zh-CN"]}；最高的一叠有`],
                  [`${top} \\text{ dots}`],
                ],
                [["Read its value", "读出它的值"], ["The value under it:", "它下方的值："], [`\\text{mode} = ${mode}`]],
              ],
              [
                `The next tallest stack has only $${second}$ dots, fewer than $${top}$.`,
                `第二高的一叠只有 $${second}$ 个点，少于 $${top}$。`,
              ],
              [
                [top, "That is the height of the tallest stack, not its value.", "这是最高一叠的点数，不是它的值。"],
                [median(xs), "That is the median, not the most frequent value.", "这是中位数，不是出现最多的值。"],
                [Math.max(...xs), "That is the largest value, not the most frequent.", "这是最大的值，不是出现最多的值。"],
              ],
              { figure: dotPlotFigure(xs, axis) },
            );
          }
        },
        drawn(gradeDrawings4["measuring-centrality-from-dot-plots#the-mode-from-a-dot-plot"]),
      ),
    ],
  ),
  [
    "A coach stacks a dot above the number line for each goal count in a season's games. The picture shows at a glance which count is most common and roughly where the middle is.",
    "教练在数轴上方为一个赛季每场比赛的进球数各画一个点。一眼就能看出哪个进球数最常见，中间大约在哪里。",
  ],
  ["Each dot is one game, so counting all the dots gives the number of games.", "每个点是一场比赛，所以数出所有的点就是比赛的场数。"],
  ["find the mean and the mode of the data in a dot plot.", "求点图中数据的平均数和众数。"],
);

export const measuringRangeAndMadFromDotPlots = withIntro(
  topic(
    "measuring-range-and-mad-from-dot-plots",
    t("Measuring Range and MAD From Dot Plots", "从点图求极差和平均绝对偏差"),
    t(
      "The range is the distance from the leftmost dot to the rightmost dot; the ends of the number line do not count unless dots sit there. For the mean absolute deviation, find the mean, then the distance of each stack's value from it; each distance counts once for every dot in the stack. The MAD is the total of these distances divided by the number of dots.",
      "极差是最左边的点到最右边的点的距离；数轴的两端除非有点，否则不算。求平均绝对偏差时，先求平均数，再求每一叠的值到平均数的距离；每个距离要按这一叠的点数重复计算。各距离的总和除以点的总数就是平均绝对偏差。",
    ),
    ["measuring-centrality-from-dot-plots", "mean-absolute-deviation", "range-quartiles-and-iqr"],
    ["6.SP.B.4", "6.SP.B.5.C"],
    [
      lesson(
        "the-range-from-a-dot-plot",
        ["The range from a dot plot", "从点图求极差"],
        [
          [
            "The range runs from the leftmost dot to the rightmost dot. If the leftmost dot is at $2$ and the rightmost at $9$, the range is $9 - 2 = 7$, even if the number line runs from $0$ to $10$.",
            "极差是从最左边的点到最右边的点。如果最左边的点在 $2$，最右边的点在$9$，极差就是 $9 - 2 = 7$，即使数轴是从 $0$ 画到 $10$。",
          ],
          ["$2 + 7 = 9$, the rightmost dot.", "$2 + 7 = 9$，正是最右边的点。"],
          [
            "Use the end dots, not the ends of the number line, and ignore how tall the stacks are.",
            "要用两端的点，不是数轴的两端，也与各叠点的高度无关。",
          ],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const span = rng.int(8, 10);
            const a = rng.int(0, 2);
            const b = rng.int(0, 2);
            const xs = data(rng, rng.int(9, 15), lo + a, lo + span - b);
            const axis = { min: lo, max: lo + span, step: 1 };
            const [min, max] = [Math.min(...xs), Math.max(...xs)];
            if (min === lo && max === lo + span) continue;
            const tallest = Math.max(...xs.map((v) => xs.filter((x) => x === v).length));
            return valued(
              [`The dot plot shows ${en}. What is the range?`, `点图表示${zh}。极差是多少？`],
              max - min,
              [
                [
                  ["Find the end dots", "找两端的点"],
                  ["Leftmost and rightmost dots:", "最左边和最右边的点："],
                  [`${min} \\text{ and } ${max}`],
                ],
                [["Subtract", "相减"], ["Rightmost minus leftmost:", "最右边减最左边："], [`${max} - ${min} = ${max - min}`]],
              ],
              [`$${min} + ${max - min} = ${max}$.`, `$${min} + ${max - min} = ${max}$。`],
              [
                [span, "That uses the ends of the number line, not the end dots.", "这用的是数轴的两端，不是两端的点。"],
                [max, "That is the rightmost dot alone.", "这只是最右边的点。"],
                [tallest, "That is the height of the tallest stack.", "这是最高一叠的点数。"],
                [new Set(xs).size, "That counts the stacks.", "这数的是叠数。"],
              ],
              { figure: dotPlotFigure(xs, axis) },
            );
          }
        },
        drawn(gradeDrawings3["measuring-range-and-mad-from-dot-plots#the-range-from-a-dot-plot"]),
      ),
      lesson(
        "the-mad-from-a-dot-plot",
        ["The mean absolute deviation from a dot plot", "从点图求平均绝对偏差"],
        [
          [
            "Find the mean, then each dot's distance from it; every dot in a stack has the same distance. A dot plot with $1$ dot at $2$, $3$ at $4$, $3$ at $6$ and $1$ at $8$ has $8$ dots with sum $40$, so the mean is $5$. The distances add up to $3 + 1 \\times 3 + 1 \\times 3 + 3 = 12$, and the MAD is $12 \\div 8 = 1.5$.",
            "先求平均数，再求每个点到它的距离；同一叠中的点距离相同。某点图在 $2$ 处有 $1$ 个点，$4$ 处 $3$ 个，$6$ 处 $3$ 个，$8$ 处 $1$ 个，共 $8$ 个点，和是 $40$，所以平均数是 $5$。距离之和是 $3 + 1 \\times 3 + 1 \\times 3 + 3 = 12$，平均绝对偏差是 $12 \\div 8 = 1.5$。",
          ],
          [
            "Below $5$ the distances add to $3 + 3 = 6$, and above it also to $3 + 3 = 6$.",
            "$5$ 以下的距离之和是 $3 + 3 = 6$，以上的也是 $3 + 3 = 6$。",
          ],
          ["Divide by the $8$ dots, not by the $4$ stacks.", "要除以点数 $8$，不是叠数 $4$。"],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const n = rng.pick([4, 5, 8, 10]);
            const span = rng.int(6, 8);
            const xs = integerMean(rng, n, lo, lo + span);
            const axis = { min: lo, max: lo + span, step: 1 };
            const m = sum(xs) / n;
            const d = mad(xs);
            if (d.isZero()) continue;
            const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
            const total = sum(xs.map((x) => Math.abs(x - m)));
            const terms = counts.map(([v, k]) => (k === 1 ? `${Math.abs(v - m)}` : `${Math.abs(v - m)} \\times ${k}`)).join(" + ");
            const below = sum(xs.filter((x) => x < m).map((x) => m - x));
            return valued(
              [`The dot plot shows ${en}. What is the mean absolute deviation?`, `点图表示${zh}。平均绝对偏差是多少？`],
              d,
              [
                [
                  ["Find the mean", "求平均数"],
                  [`$${n}$ dots with sum $${sum(xs)}$:`, `$${n}$ 个点，和是 $${sum(xs)}$：`],
                  [`${sum(xs)} \\div ${n} = ${m}`],
                ],
                [
                  ["Add the distances", "求距离之和"],
                  [`Stack by stack, each dot's distance from $${m}$:`, `逐叠计算每个点到 $${m}$ 的距离：`],
                  [`${terms} = ${total}`],
                ],
                [["Divide", "相除"], ["By the number of dots:", "除以点数："], [`${total} \\div ${n} = ${dec(d)}`]],
              ],
              [
                `The distances below the mean add to $${below}$ and those above to $${total - below}$, which balance.`,
                `平均数以下的距离之和是 $${below}$，以上的是 $${total - below}$，两边相等。`,
              ],
              [
                [total, "That is the total distance; divide it by the number of dots.", "这是距离之和，还要除以点数。"],
                [
                  Q.of(sum(counts.map(([v]) => Math.abs(v - m))), counts.length),
                  "That counts each stack once instead of each dot.",
                  "这是每叠只算一次，而不是每个点都算。",
                ],
                [m, "That is the mean, not the mean distance from it.", "这是平均数，不是到平均数的平均距离。"],
              ],
              { form: "decimal", figure: dotPlotFigure(xs, axis) },
            );
          }
        },
        dotPlotFigure([2, 4, 4, 4, 6, 6, 6, 8], { min: 0, max: 10, step: 1 }),
      ),
    ],
  ),
  [
    "Two dot plots of quiz scores both have their middle at $7$. In one the dots huddle between $6$ and $8$; in the other they spread from $2$ to $10$.",
    "两张小测验成绩的点图，中间都在 $7$。一张的点挤在 $6$ 到 $8$ 之间；另一张从 $2$ 散到 $10$。",
  ],
  [
    "The ranges are $8 - 6 = 2$ and $10 - 2 = 8$: the second is far more spread out.",
    "极差分别是 $8 - 6 = 2$ 和 $10 - 2 = 8$：第二张分散得多。",
  ],
  ["read the range and the mean absolute deviation from a dot plot.", "从点图中求极差和平均绝对偏差。"],
);

export const measuringQuartilesAndIqrFromDotPlots = withIntro(
  topic(
    "measuring-quartiles-and-iqr-from-dot-plots",
    t("Measuring Quartiles and IQR From Dot Plots", "从点图求四分位数和四分位距"),
    t(
      "A dot plot lists the data in order from left to right, so the quartiles can be found by counting dots. Count all the dots, locate the median, and split the dots into a lower and an upper half, leaving the median dot out when the count is odd. Q₁ and Q₃ are the medians of the two halves, and IQR = Q₃ − Q₁.",
      "点图从左到右按顺序列出了数据，所以可以通过数点来求四分位数。先数出点的总数，找到中位数，再把点分成下半部分和上半部分；点数为奇数时，中位数那个点不计入任何一半。Q₁ 和 Q₃ 分别是两半的中位数，IQR = Q₃ − Q₁。",
    ),
    ["measuring-centrality-from-dot-plots", "range-quartiles-and-iqr"],
    ["6.SP.B.4", "6.SP.B.5.C"],
    [
      lesson(
        "a-quartile-from-a-dot-plot",
        ["A quartile from a dot plot", "从点图求四分位数"],
        [
          [
            "Count the dots from left to right, and up each stack. A dot plot with $11$ dots has its median at the $6$th dot. The lower half is the first $5$ dots, so $Q_1$ is the $3$rd dot; the upper half is the last $5$ dots, so $Q_3$ is the $9$th dot.",
            "从左到右、每叠从下往上地数点。有 $11$ 个点的点图，中位数是第 $6$ 个点。下半部分是前 $5$ 个点，所以 $Q_1$ 是第 $3$ 个点；上半部分是后 $5$ 个点，所以 $Q_3$ 是第 $9$ 个点。",
          ],
          ["$5 + 1 + 5 = 11$: two halves and the median dot.", "$5 + 1 + 5 = 11$：两半加上中位数那个点。"],
          ["With an odd count, leave the median dot out of both halves.", "点数为奇数时，两半都不含中位数那个点。"],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          const { xs, axis } = dotData(rng, lo, rng.int(9, 16), rng.int(6, 8));
          const third = rng.bool();
          const [q1, q3] = quartiles(xs);
          const [i1, i3] = inclusiveQuartiles(xs);
          const [lower, upper] = halves(xs);
          const n = xs.length;
          const name: Pair = third ? ["third quartile", "第三四分位数"] : ["first quartile", "第一四分位数"];
          const q = third ? q3 : q1;
          const half = third ? upper : lower;
          return valued(
            [`The dot plot shows ${en}. What is the ${name[0]}?`, `点图表示${zh}。${name[1]}是多少？`],
            q,
            [
              [
                ["Count the dots", "数点"],
                [
                  `There are $${n}$ dots: ${stacks(xs).en}. The ${third ? "upper" : "lower"} half is the ${third ? "last" : "first"} $${half.length}$:`,
                  `共有 $${n}$ 个点：${stacks(xs)["zh-CN"]}。${third ? "上" : "下"}半部分是${third ? "后" : "前"} $${half.length}$ 个：`,
                ],
                [list(half)],
              ],
              middleStep(half, String, dec(q)),
            ],
            middleCheck(half, String, dec(q)),
            [
              [third ? i3 : i1, "That keeps the median dot in the half.", "这把中位数那个点也放进了这一半。"],
              [median(xs), "That is the median of all the dots.", "这是全部点的中位数。"],
              [
                third ? q1 : q3,
                `That is the ${third ? "first" : "third"} quartile, from the other half.`,
                `这是另一半给出的${third ? "第一" : "第三"}四分位数。`,
              ],
            ],
            { form: "decimal", figure: dotPlotFigure(xs, axis) },
          );
        },
        drawn(gradeDrawings3["measuring-quartiles-and-iqr-from-dot-plots#a-quartile-from-a-dot-plot"]),
      ),
      lesson(
        "the-iqr-from-a-dot-plot",
        ["The interquartile range from a dot plot", "从点图求四分位距"],
        [
          [
            "Find both quartiles by counting dots, then subtract. For a dot plot with $Q_1 = 3$ and $Q_3 = 7$, the IQR is $7 - 3 = 4$: the middle half of the dots lie within a stretch of $4$ units.",
            "先数点求出两个四分位数，再相减。如果点图的 $Q_1 = 3$，$Q_3 = 7$，那么四分位距是 $7 - 3 = 4$：中间一半的点落在长 $4$ 个单位的范围内。",
          ],
          ["$3 + 4 = 7$.", "$3 + 4 = 7$。"],
          ["The IQR uses the quartiles, not the end dots; that would be the range.", "四分位距用的是四分位数，不是两端的点；那是极差。"],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const { xs, axis } = dotData(rng, lo, rng.int(9, 16), rng.int(6, 8));
            const [q1, q3] = quartiles(xs);
            const iqr = q3.sub(q1);
            if (iqr.isZero()) continue;
            const [i1, i3] = inclusiveQuartiles(xs);
            const [lower, upper] = halves(xs);
            return valued(
              [`The dot plot shows ${en}. What is the interquartile range?`, `点图表示${zh}。四分位距是多少？`],
              iqr,
              [
                [
                  ["Find the quartiles", "求四分位数"],
                  [
                    `There are $${xs.length}$ dots. The lower half $${list(lower)}$ and the upper half $${list(upper)}$ give`,
                    `共有 $${xs.length}$ 个点。下半部分 $${list(lower)}$ 和上半部分 $${list(upper)}$ 给出`,
                  ],
                  [`Q_1 = ${dec(q1)}, \\ Q_3 = ${dec(q3)}`],
                ],
                [["Subtract", "相减"], ["$Q_3 - Q_1$:", "$Q_3 - Q_1$："], [`${dec(q3)} - ${dec(q1)} = ${dec(iqr)}`]],
              ],
              [`$${dec(q1)} + ${dec(iqr)} = ${dec(q3)}$.`, `$${dec(q1)} + ${dec(iqr)} = ${dec(q3)}$。`],
              [
                [Math.max(...xs) - Math.min(...xs), "That is the range, from end dot to end dot.", "这是极差，从一端的点到另一端的点。"],
                [i3.sub(i1), "That keeps the median dot in both halves.", "这把中位数那个点放进了两半。"],
                [q3, "That is $Q_3$ alone.", "这只是 $Q_3$。"],
                [Q.of(axis.max - axis.min, 2), "That is half the length of the number line.", "这是数轴长度的一半。"],
              ],
              { form: "decimal", figure: dotPlotFigure(xs, axis) },
            );
          }
        },
        drawn(gradeDrawings3["measuring-quartiles-and-iqr-from-dot-plots#the-iqr-from-a-dot-plot"]),
      ),
      lesson(
        "the-five-number-summary-from-a-dot-plot",
        ["The five-number summary from a dot plot", "从点图求五数概括"],
        [
          [
            "The five-number summary of a dot plot is the leftmost dot, $Q_1$, the median, $Q_3$ and the rightmost dot, all found by counting dots. It is what a box plot of the same data would show. For $1, 3, 4, 5, 7, 9, 12$ it is $1, 3, 5, 9, 12$.",
            "点图的五数概括是最左边的点、$Q_1$、中位数、$Q_3$ 和最右边的点，都靠数点求得。它正是同一组数据的箱线图所显示的内容。对 $1, 3, 4, 5, 7, 9, 12$，五数概括是 $1, 3, 5, 9, 12$。",
          ],
          ["The five numbers increase, and $5$ is the $4$th of the $7$ dots.", "五个数依次增大，$5$ 是 $7$ 个点中的第 $4$ 个。"],
          [
            "Use the end dots, not the ends of the number line, for the minimum and the maximum.",
            "最小值和最大值用两端的点，不是数轴的两端。",
          ],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const { xs, axis } = dotData(rng, lo, rng.pick([9, 11, 13, 15]), rng.int(7, 9));
            const s = sorted(xs);
            const n = s.length;
            const h = Math.floor(n / 2);
            const [q1, q3] = quartiles(xs);
            const [i1, i3] = inclusiveQuartiles(xs);
            const med = median(xs);
            const [min, max] = [Q.of(s[0] as number), Q.of(s[n - 1] as number)];
            const right = fiveNumbers([min, q1, med, q3, max]);
            const candidates: Wrong[] = [
              [
                fiveNumbers([min, i1, med, i3, max]),
                "That keeps the median dot in both halves for the quartiles.",
                "这在求四分位数时把中位数那个点放进了两半。",
              ],
              [
                fiveNumbers([Q.of(axis.min), q1, med, q3, Q.of(axis.max)]),
                "That uses the ends of the number line, not the end dots.",
                "这用的是数轴的两端，不是两端的点。",
              ],
              [
                fiveNumbers([min, q1, Q.of(axis.min + axis.max, 2), q3, max]),
                "That puts the middle of the number line in place of the median.",
                "这把数轴的中点当成了中位数。",
              ],
              [
                fiveNumbers([min, Q.of(s[1] as number), med, Q.of(s[n - 2] as number), max]),
                "That takes the second and second-to-last dots as the quartiles.",
                "这把第二个和倒数第二个点当成了四分位数。",
              ],
            ];
            const seen = new Set([right[0]]);
            const wrong = candidates.filter(([o]) => !seen.has(o[0]) && seen.add(o[0]));
            if (wrong.length < 2) continue;
            return chosen(
              rng,
              [`The dot plot shows ${en}. What is the five-number summary of the data?`, `点图表示${zh}。这组数据的五数概括是什么？`],
              right,
              wrong,
              [
                [
                  ["The ends and the middle", "两端与中间"],
                  [
                    `There are $${n}$ dots: ${stacks(xs).en}. The end dots are $${s[0]}$ and $${s[n - 1]}$, and the median is dot $${h + 1}$:`,
                    `共有 $${n}$ 个点：${stacks(xs)["zh-CN"]}。两端的点是 $${s[0]}$ 和 $${s[n - 1]}$，中位数是第 $${h + 1}$ 个点：`,
                  ],
                  [`\\text{median} = ${dec(med)}`],
                ],
                [
                  ["The quartiles", "四分位数"],
                  [
                    `The lower half $${list(s.slice(0, h))}$ and the upper half $${list(s.slice(n - h))}$ give`,
                    `下半部分 $${list(s.slice(0, h))}$ 和上半部分 $${list(s.slice(n - h))}$ 给出`,
                  ],
                  [`Q_1 = ${dec(q1)}, \\ Q_3 = ${dec(q3)}`],
                ],
              ],
              [`The five numbers increase, with $${h}$ dots on each side of the median.`, `五个数依次增大，中位数两边各有 $${h}$ 个点。`],
              dotPlotFigure(xs, axis),
            );
          }
        },
        drawn(gradeDrawings3["measuring-quartiles-and-iqr-from-dot-plots#the-five-number-summary-from-a-dot-plot"]),
      ),
    ],
  ),
  [
    "A dot plot of $11$ shoe sizes already has the sizes in order from left to right. Counting dots is enough to find the middle and the quarter marks.",
    "$11$ 个鞋码的点图已经从左到右排好了序。只要数点，就能找到中间和四分位的位置。",
  ],
  ["The $6$th dot has $5$ dots on each side, so it is the median.", "第 $6$ 个点两边各有 $5$ 个点，所以它是中位数。"],
  ["find the quartiles, the interquartile range and the five-number summary by counting dots.", "通过数点求四分位数、四分位距和五数概括。"],
);

// ---------------------------------------------------------------------------
// Shape

/** Shape is the shape of a distribution. */
type Shape = "symmetric" | "left" | "right";

/** shapePairs name the shapes, in the order of shapes. */
const shapePairs: Record<Shape, Pair> = {
  symmetric: ["Symmetric", "对称"],
  left: ["Skewed left", "左偏"],
  right: ["Skewed right", "右偏"],
};

/** shapes are the three shapes a generator can draw. */
const shapes: readonly Shape[] = ["symmetric", "left", "right"];

/** shapedData draws a data set on 9 consecutive integers from lo with the given shape: a mirror image for symmetric data, a peak near one end and a long tail toward the other for skewed data. */
function shapedData(rng: Rng, lo: number, shape: Shape): number[] {
  for (;;) {
    const counts = Array.from({ length: 9 }, () => 0);
    if (shape === "symmetric") {
      let h = rng.int(4, 6);
      counts[4] = h;
      for (let i = 1; i <= 4; i++) {
        h = Math.max(i < 3 ? 1 : 0, h - rng.int(0, 2));
        counts[4 - i] = h;
        counts[4 + i] = h;
      }
    } else {
      const peak = rng.int(1, 2);
      let h = rng.int(5, 7);
      counts[peak] = h;
      for (let i = 0; i < peak; i++) counts[i] = rng.int(0, 2);
      const end = rng.int(7, 8);
      for (let i = peak + 1; i <= end; i++) {
        h = Math.max(1, h - rng.int(0, 2));
        counts[i] = h;
      }
      if (shape === "left") counts.reverse();
    }
    const xs = counts.flatMap((k, i) => Array.from({ length: k }, () => lo + i));
    const gap = mean(xs).sub(median(xs));
    if (shape === "symmetric") return xs;
    const right = shape === "right";
    if (gap.cmp(Q.of(right ? 1 : -1, 2)) * (right ? 1 : -1) >= 0) return xs;
  }
}

/** skewWords describes a shape in a sentence. */
const skewWords: Record<Shape, Text> = {
  symmetric: t(
    "The dots form mirror images on either side of the middle, so the data are symmetric",
    "点在中间两侧左右对称，所以数据是对称的",
  ),
  left: t(
    "Most dots sit at the right, with a long tail stretching to the left, so the data are skewed left",
    "大多数点在右侧，长尾拖向左边，所以数据左偏",
  ),
  right: t(
    "Most dots sit at the left, with a long tail stretching to the right, so the data are skewed right",
    "大多数点在左侧，长尾拖向右边，所以数据右偏",
  ),
};

/** pileStep finds the tallest stack of a dot plot and the side its tail runs to. */
function pileStep(xs: readonly number[], shape: Shape): Walk {
  const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
  const top = Math.max(...counts.map(([, k]) => k));
  const peaks = counts.filter(([, k]) => k === top).map(([v]) => v);
  const [min, max] = [Math.min(...xs), Math.max(...xs)];
  const at = peaks.length === 1 ? `$${peaks[0]}$` : `$${list(peaks)}$`;
  const tail: Pair =
    shape === "symmetric"
      ? [
          `the stacks shrink the same way on both sides, down to $${min}$ and $${max}$`,
          `两侧的点叠以同样的方式变矮，一直到 $${min}$ 和 $${max}$`,
        ]
      : shape === "right"
        ? [`a thin tail of dots runs to the right, up to $${max}$`, `一条稀疏的尾巴拖向右边，一直到 $${max}$`]
        : [`a thin tail of dots runs to the left, down to $${min}$`, `一条稀疏的尾巴拖向左边，一直到 $${min}$`];
  return [
    ["Find the pile and the tail", "找点堆和尾巴"],
    [`The tallest stack, $${top}$ dots, is at ${at}, and ${tail[0]}:`, `最高的一叠有 $${top}$ 个点，在 ${at} 处，${tail[1]}：`],
    [`\\text{${shapePairs[shape][0].toLowerCase()}}`],
  ];
}

/** balanceCheck compares the total distance of the values above the median with that of the values below it. */
function balanceCheck(xs: readonly number[]): Pair {
  const med = median(xs);
  const above = xs.filter((x) => med.cmp(Q.of(x)) < 0).reduce((a, x) => a.add(Q.of(x).sub(med)), Q.zero);
  const below = xs.filter((x) => med.cmp(Q.of(x)) > 0).reduce((a, x) => a.add(med.sub(Q.of(x))), Q.zero);
  const c = above.cmp(below);
  const [en, zh] =
    c > 0
      ? ["so the values above outweigh those below and pull the mean above the median", "上方更重，把平均数拉到中位数上方"]
      : c < 0
        ? ["so the values below outweigh those above and pull the mean below the median", "下方更重，把平均数拉到中位数下方"]
        : ["so the two sides balance and the mean sits at the median", "两侧平衡，平均数正好落在中位数上"];
  return [
    `The values above the median $${dec(med)}$ lie $${dec(above)}$ from it in total and those below lie $${dec(below)}$, ${en}.`,
    `中位数 $${dec(med)}$ 上方的值到它的距离之和是 $${dec(above)}$，下方的是 $${dec(below)}$，${zh}。`,
  ];
}

/** comparisonPairs answer "which is greater, the mean or the median?" for right-skewed, left-skewed and symmetric data. */
const comparisonPairs: Record<Shape, Pair> = {
  right: ["The mean", "平均数"],
  left: ["The median", "中位数"],
  symmetric: ["They are equal", "两者相等"],
};

export const symmetrySkewAndOutliers = withIntro(
  topic(
    "symmetry-skew-and-outliers",
    t("Symmetry, Skew, and Outliers", "对称、偏斜与离群值"),
    t(
      "The shape of a distribution is part of its description. Data are symmetric when the two sides of the plot are mirror images; skewed right when most values are at the left with a long tail to the right; skewed left when the tail stretches to the left. The tail pulls the mean toward it, so in right-skewed data the mean is greater than the median, and in left-skewed data it is less. An outlier is a value far from the rest, often separated by a gap.",
      "分布的形状是描述数据的一部分。图形两侧互为镜像时，数据是对称的；大多数数据在左侧、长尾拖向右边时，数据右偏；长尾拖向左边时，数据左偏。长尾会把平均数拉向它，所以右偏数据的平均数大于中位数，左偏数据的平均数小于中位数。离群值是远离其余数据的值，常常与其他数据隔着一段空白。",
    ),
    ["measuring-centrality-from-dot-plots", "comparing-measures-of-center"],
    ["6.SP.A.2", "6.SP.B.4", "6.SP.B.5.D"],
    [
      lesson(
        "describing-the-shape",
        ["Describing the shape", "描述形状"],
        [
          [
            "A skew is named after its **tail**, not its pile. If most dots are piled at the left and a thin tail of dots runs off to the right, the data are skewed right; if the pile is at the right and the tail runs left, they are skewed left. If folding the plot at the middle makes the two sides match, the data are symmetric. In the plot shown, most dots pile up at $2$ and $3$ and a tail runs out to $7$, so it is skewed right.",
            "偏斜是按**尾巴**的方向命名的，而不是按点堆的位置。如果大多数点堆在左边，一条稀疏的尾巴拖向右边，数据就是右偏；如果点堆在右边，尾巴拖向左边，就是左偏。如果沿中间对折后两侧重合，数据就是对称的。图中大多数点堆在 $2$ 和 $3$，一条尾巴拖到 $7$，所以是右偏。",
          ],
          [
            "Its mean, $\\frac{59}{18} \\approx 3.3$, is greater than its median, $3$, just as a tail to the right pulls the mean up.",
            "它的平均数 $\\frac{59}{18} \\approx 3.3$ 大于中位数 $3$，正如右边的尾巴会把平均数往上拉。",
          ],
          [
            "A pile on the left means skewed right: name the side of the tail, not the side of the pile.",
            "点堆在左边是右偏：要说尾巴在哪一边，不是点堆在哪一边。",
          ],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          const shape = rng.pick(shapes);
          const xs = shapedData(rng, lo, shape);
          const reasons: Record<Shape, Pair> =
            shape === "symmetric"
              ? {
                  symmetric: ["", ""],
                  right: [
                    "Neither side has a longer tail: folding at the middle makes the two sides match.",
                    "两边都没有更长的尾巴：沿中间对折，两侧重合。",
                  ],
                  left: [
                    "Neither side has a longer tail: folding at the middle makes the two sides match.",
                    "两边都没有更长的尾巴：沿中间对折，两侧重合。",
                  ],
                }
              : {
                  symmetric: [
                    "The two sides are not mirror images: one side has a long, thin tail.",
                    "两侧不是镜像：一侧有一条细长的尾巴。",
                  ],
                  right: [
                    "That names the side where the dots pile up; a skew is named after its tail.",
                    "这说的是点堆所在的一边；偏斜要按尾巴命名。",
                  ],
                  left: [
                    "That names the side where the dots pile up; a skew is named after its tail.",
                    "这说的是点堆所在的一边；偏斜要按尾巴命名。",
                  ],
                };
          return chosen(
            rng,
            [`The dot plot shows ${en}. Which best describes the shape of the data?`, `点图表示${zh}。哪一项最能描述这组数据的形状？`],
            shapePairs[shape],
            shapes.filter((s) => s !== shape).map((s): Wrong => [shapePairs[s], reasons[s][0], reasons[s][1]]),
            [
              pileStep(xs, shape),
              [
                ["Name the shape", "说出形状"],
                [`${skewWords[shape].en}:`, `${skewWords[shape]["zh-CN"]}：`],
                [`\\text{${shapePairs[shape][0].toLowerCase()}}`],
              ],
            ],
            balanceCheck(xs),
            dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }),
          );
        },
        dotPlotFigure([1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7], { min: 0, max: 8, step: 1 }),
      ),
      lesson(
        "skew-and-the-mean-and-median",
        ["Skew and the mean and median", "偏斜与平均数、中位数"],
        [
          [
            "The tail pulls the mean toward it, while the median stays with the pile. The dot plot with a tail to the right has median $3$, but its mean is $\\frac{59}{18} \\approx 3.3$: the dots at $5$, $6$ and $7$ pull the mean past the median. In left-skewed data the mean lies to the left of the median, and in symmetric data the two are equal.",
            "尾巴会把平均数拉向它，而中位数留在点堆那里。尾巴在右边的那张点图，中位数是 $3$，平均数却是 $\\frac{59}{18} \\approx 3.3$：$5$、$6$、$7$ 处的点把平均数拉过了中位数。左偏数据的平均数在中位数左边，对称数据的两者相等。",
          ],
          [
            "$18 \\times 3 = 54$, less than the total $59$, so the mean is above $3$.",
            "$18 \\times 3 = 54$，小于总和 $59$，所以平均数大于 $3$。",
          ],
          ["The median sits with the pile; it is the mean that the tail drags along.", "中位数待在点堆那里；被尾巴拖走的是平均数。"],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          const shape = rng.pick(shapes);
          const xs = shapedData(rng, lo, shape);
          const m = mean(xs);
          const med = median(xs);
          const reasons: Record<Shape, Pair> =
            shape === "symmetric"
              ? {
                  symmetric: ["", ""],
                  right: ["There is no long tail to pull the mean up: the two sides balance.", "没有长尾把平均数往上拉：两侧平衡。"],
                  left: ["There is no long tail to pull the mean down: the two sides balance.", "没有长尾把平均数往下拉：两侧平衡。"],
                }
              : {
                  symmetric: [
                    "Only symmetric data have them equal; here the tail pulls the mean away.",
                    "只有对称数据两者才相等；这里尾巴把平均数拉开了。",
                  ],
                  right: [
                    "That would need a tail to the right; here the tail runs left and pulls the mean down.",
                    "那需要尾巴在右边；这里尾巴在左边，把平均数往下拉。",
                  ],
                  left: [
                    "That would need a tail to the left; here the tail runs right and pulls the mean up.",
                    "那需要尾巴在左边；这里尾巴在右边，把平均数往上拉。",
                  ],
                };
          return chosen(
            rng,
            [`The dot plot shows ${en}. Which is greater, the mean or the median?`, `点图表示${zh}。平均数和中位数哪个更大？`],
            comparisonPairs[shape],
            shapes.filter((s) => s !== shape).map((s): Wrong => [comparisonPairs[s], reasons[s][0], reasons[s][1]]),
            [
              pileStep(xs, shape),
              [
                ["Find both measures", "求出两个量"],
                [`There are $${xs.length}$ dots with total $${sum(xs)}$:`, `共 $${xs.length}$ 个点，总和是 $${sum(xs)}$：`],
                [`\\text{median} = ${dec(med)}, \\ \\text{mean} = \\frac{${sum(xs)}}{${xs.length}} ${about(m)}`],
              ],
            ],
            balanceCheck(xs),
            dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }),
          );
        },
        drawn(gradeDrawings4["symmetry-skew-and-outliers#skew-and-the-mean-and-median"]),
      ),
      lesson(
        "an-outlier-in-a-dot-plot",
        ["An outlier in a dot plot", "点图中的离群值"],
        [
          [
            "In a dot plot an outlier usually stands apart, with a gap between it and the other dots. Confirm it with the $1.5 \\times \\text{IQR}$ rule: find $Q_1$ and $Q_3$ by counting dots, and check whether the value lies beyond $Q_1 - 1.5 \\times \\text{IQR}$ or $Q_3 + 1.5 \\times \\text{IQR}$. For dots at $3, 3, 4, 4, 4, 5, 5, 6, 6, 14$, $Q_1 = 4$ and $Q_3 = 6$, so the upper fence is $6 + 1.5 \\times 2 = 9$ and $14$ is an outlier.",
            "在点图中，离群值通常孤立在一旁，与其他点之间隔着一段空白。用 $1.5 \\times \\text{IQR}$ 法则来确认：数点求出 $Q_1$ 和 $Q_3$，再看这个值是否小于 $Q_1 - 1.5 \\times \\text{IQR}$ 或大于 $Q_3 + 1.5 \\times \\text{IQR}$。对 $3, 3, 4, 4, 4, 5, 5, 6, 6, 14$ 处的点，$Q_1 = 4$，$Q_3 = 6$，上界是 $6 + 1.5 \\times 2 = 9$，所以 $14$ 是离群值。",
          ],
          [
            "$14$ is $8$ away from the next dot, $6$, while the other nine dots all fit between $3$ and $6$.",
            "$14$ 离旁边的点 $6$ 有 $8$，而另外九个点都挤在 $3$ 到 $6$ 之间。",
          ],
          ["A gap alone is not proof: always test the value against the fences.", "光有空白还不能断定：一定要用界限检验这个值。"],
        ],
        (rng) => {
          const [en, zh, lo] = rng.pick(dotContexts);
          for (;;) {
            const high = rng.bool();
            const start = high ? lo + rng.int(0, 1) : lo + rng.int(5, 6);
            const cluster = data(rng, rng.int(9, 14), start, start + 4);
            const extreme = high ? start + rng.int(8, 10 - (start - lo)) : lo + rng.int(0, start - lo - 5);
            if (extreme < lo || extreme > lo + 10) continue;
            const xs = [...cluster, extreme];
            const out = xs.filter((x) => isOutlier(xs, x));
            if (out.length !== 1 || out[0] !== extreme) continue;
            const counts = [...new Set(cluster)].map((v) => [v, cluster.filter((x) => x === v).length] as const);
            const mode = counts.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
            const [cmin, cmax] = [Math.min(...cluster), Math.max(...cluster)];
            const next = high ? cmax : cmin;
            return valued(
              [`The dot plot shows ${en}. Which value is an outlier?`, `点图表示${zh}。哪个值是离群值？`],
              extreme,
              [
                [
                  ["Spot the gap", "找空白"],
                  [
                    `The dots crowd between $${cmin}$ and $${cmax}$, and one dot stands apart at`,
                    `点挤在 $${cmin}$ 到 $${cmax}$ 之间，只有一个点孤立在`,
                  ],
                  [`${extreme}`],
                ],
                outlierStep(xs, extreme),
              ],
              [
                `$${extreme}$ is $${Math.abs(extreme - next)}$ away from the next dot, $${next}$, while the other $${cluster.length}$ dots all fit within $${cmax - cmin}$.`,
                `$${extreme}$ 离旁边的点 $${next}$ 有 $${Math.abs(extreme - next)}$，而另外 $${cluster.length}$ 个点都在 $${cmax - cmin}$ 的范围之内。`,
              ],
              [
                [
                  next,
                  "That is the end of the main group: it sits next to other dots, inside the fences.",
                  "这是主体一端的点：它挨着其他点，在界限之内。",
                ],
                [
                  mode,
                  "That is the tallest stack, the most common value, not a value far from the rest.",
                  "这是最高的一叠，即最常见的值，不是远离其余数据的值。",
                ],
                [high ? cmin : cmax, "That is the other end of the main group, inside the fences.", "这是主体另一端的点，在界限之内。"],
              ],
              { figure: dotPlotFigure(xs, { min: lo, max: lo + 10, step: 1 }) },
            );
          }
        },
        drawn(gradeDrawings4["symmetry-skew-and-outliers#an-outlier-in-a-dot-plot"]),
      ),
    ],
  ),
  [
    "Two dot plots show the ages of people at a playground. In one, most dots pile up at the small ages, with a few parents trailing far to the right; in the other, the dots rise and fall evenly around the middle.",
    "两张点图表示游乐场上人们的年龄。一张中大多数点堆在小年龄处，几位家长远远拖在右边；另一张的点在中间两侧均匀地升高又降低。",
  ],
  [
    "The few parents far to the right form the tail, and they raise the mean much more than the median.",
    "远在右边的几位家长就是尾巴，他们把平均数拉高的程度远大于中位数。",
  ],
  [
    "describe the shape of a dot plot, tell how skew moves the mean away from the median, and pick out an outlier.",
    "描述点图的形状，说明偏斜如何让平均数偏离中位数，并找出离群值。",
  ],
);

/** grade6StatisticsTopics lists the 6th grade topics on summarizing and displaying data. */
export const grade6StatisticsTopics: readonly TopicDef[] = [
  introductionToStatistics,
  theMeanOfADataSet,
  theMedianOfADataSet,
  theModeOfADataSet,
  rangeQuartilesAndIqr,
  removingOutliers,
  comparingMeasuresOfCenter,
  comparingMeasuresOfSpread,
  frequencyTables,
  measuringCentralityFromDotPlots,
  measuringRangeAndMadFromDotPlots,
  measuringQuartilesAndIqrFromDotPlots,
  symmetrySkewAndOutliers,
];
