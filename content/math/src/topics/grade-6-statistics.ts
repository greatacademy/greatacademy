import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Axis, dec, dotPlot, Q } from "@ga/subject-math";

import { choiceProblem, isTerminating, numberProblem, steps, yesNo } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

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

export const introductionToStatistics = topic(
  "introduction-to-statistics",
  t("Introduction to Statistics", "统计初步"),
  t(
    "Statistics is the study of data: collecting it, describing it and drawing conclusions from it. A statistical question is one whose answers are expected to vary: “How many hours did each student in my class sleep last night?” is statistical, but “How many hours did I sleep last night?” has a single answer and is not. Data can be numerical, such as heights or counts, or categorical, such as favorite colors.",
    "统计学研究数据：收集数据、描述数据，并从数据中得出结论。统计问题是答案预计会有差异的问题：“我们班每个学生昨晚各睡了几个小时？”是统计问题，而“我昨晚睡了几个小时？”只有一个答案，不是统计问题。数据可以是数值数据，如身高或个数；也可以是分类数据，如最喜欢的颜色。",
  ),
  ["creating-and-interpreting-line-plots"],
  ["6.SP.A.1", "6.SP.A.2", "6.SP.B.5.A"],
  [
    {
      id: "statistical-questions",
      title: t("Statistical questions", "统计问题"),
      explanation: t(
        "A **statistical question** anticipates **variability**: answering it means collecting several values that are expected to differ.\n\n“How old are the students at our school?” is statistical, because the ages differ. “How old is the principal?” is not: it has one answer. A question about one person can still be statistical if it asks about many occasions, such as “How many minutes did Leo practice piano on each day last month?”",
        "**统计问题**预计答案会有**差异**：回答它需要收集多个可能各不相同的数据。\n\n“我们学校的学生各多大年纪？”是统计问题，因为学生的年龄各不相同。“校长多大年纪？”不是统计问题：它只有一个答案。关于一个人的问题，如果问的是许多次的情况，仍然可以是统计问题，例如“上个月 Leo 每天各练了多少分钟钢琴？”",
      ),
      generate(rng) {
        const yes = rng.bool();
        const [en, zh] = rng.pick(yes ? statisticalQuestions : nonStatisticalQuestions)(rng);
        return choiceProblem({
          prompt: t(`Is “${en}” a statistical question?`, `“${zh}”是统计问题吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                "Yes. Answering it means collecting several values, and they are expected to differ, so it is a statistical question.",
                "是。回答它需要收集多个数据，而且这些数据预计各不相同，所以它是统计问题。",
              )
            : t(
                "No. The question has a single answer, so there is no variability in the data it collects. It is not a statistical question.",
                "不是。这个问题只有一个答案，收集到的数据没有差异，所以它不是统计问题。",
              ),
        });
      },
    },
    {
      id: "numerical-and-categorical-data",
      title: t("Numerical and categorical data", "数值数据与分类数据"),
      explanation: t(
        "**Numerical data** are numbers that count or measure something: the number of pets, a height, a time. **Categorical data** sort the answers into groups: a favorite color, a kind of pet, a way of getting to school. It makes sense to find the mean of numerical data, but not of categorical data.",
        "**数值数据**是计数或测量得到的数：宠物的只数、身高、时间。**分类数据**把答案分成若干类别：最喜欢的颜色、宠物的种类、上学的方式。数值数据可以求平均数，分类数据则不能。",
      ),
      generate(rng) {
        const q = rng.pick(surveyQuestions);
        const n = rng.int(20, 35);
        return choiceProblem({
          prompt: t(
            `A survey asks each of the ${n} students in a class: “${q.question.en}” Are the answers numerical or categorical data?`,
            `一项调查问班上 ${n} 名学生中的每一位：“${q.question["zh-CN"]}”得到的答案是数值数据还是分类数据？`,
          ),
          options: [t("Numerical", "数值数据"), t("Categorical", "分类数据")],
          correct: q.numerical ? 0 : 1,
          solution: q.numerical
            ? t(
                `The answers are numbers that count or measure something, such as ${q.examples.en}, so the data are numerical.`,
                `答案是计数或测量得到的数，例如 ${q.examples["zh-CN"]}，所以是数值数据。`,
              )
            : t(
                `The answers are categories, such as ${q.examples.en}, not quantities, so the data are categorical.`,
                `答案是类别，例如${q.examples["zh-CN"]}，而不是数量，所以是分类数据。`,
              ),
        });
      },
    },
    {
      id: "counting-values-in-a-data-set",
      title: t("Counting values in a data set", "数出数据集中的数据"),
      explanation: t(
        "Each value in a data set is one **observation**. To count the values that meet a condition, sorting first helps. Read the condition carefully: “at least $5$” and “at most $5$” include $5$, while “more than $5$” and “fewer than $5$” do not.\n\nIn $3, 7, 5, 9, 5, 2$, the values at least $5$ are $5, 5, 7, 9$: four of them. Only two are more than $5$.",
        "数据集中的每个值是一个**观测值**。要数出满足某个条件的数据，先排序会更方便。仔细读条件：“至少 $5$”和“至多 $5$”包括 $5$，而“多于 $5$”和“少于 $5$”不包括。\n\n在 $3, 7, 5, 9, 5, 2$ 中，至少为 $5$ 的数据是 $5, 5, 7, 9$，共四个；多于 $5$ 的只有两个。",
      ),
      generate(rng) {
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
          return numberProblem({
            prompt: t(`${ctx.en} $${list(xs)}$. ${q.en}`, `${ctx.zh}$${list(xs)}$。${q["zh-CN"]}`),
            answer: yes.length,
            form: "integer",
            wrong: [misread, n - yes.length, n],
            solution: t(
              `Sorted, the values are $${list(sorted(xs))}$. Those ${r.en} $${k}$ are $${list(yes)}$: ${yes.length} values.`,
              `排序后是 $${list(sorted(xs))}$。${r.zh} $${k}$ 的数据是 $${list(yes)}$，共 ${yes.length} 个。`,
            ),
          });
        }
      },
    },
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

export const theMeanOfADataSet: TopicDef = {
  ...topic(
    "the-mean-of-a-data-set",
    t("The Mean of a Data Set", "数据集的平均数"),
    t(
      "The mean of a data set is the sum of the values divided by the number of values. Since mean = sum ÷ count, the sum is mean × count: a team that scores a mean of 15 points over 4 games scores 60 points in all. When a value is added, find the new sum and divide by the new count; averaging the old mean with the new value gives the wrong answer.",
      "一组数据的平均数等于各数据之和除以数据个数。由于平均数 = 总和 ÷ 个数，所以总和 = 平均数 × 个数：一支球队 4 场比赛平均每场得 15 分，一共得 60 分。加入一个新数据时，先求新的总和，再除以新的个数；把原平均数和新数据再平均是错误的。",
    ),
    ["mean-of-a-data-set", "introduction-to-statistics"],
    ["6.SP.A.3", "6.SP.B.5.C"],
    [
      {
        id: "the-mean-of-measurements",
        title: t("The mean of measurements", "测量数据的平均数"),
        explanation: t(
          "Rainfall of $1.2, 0.4, 2.0, 0.6$ inches on four days: the sum is $4.2$, so the mean is $4.2 \\div 4 = 1.05$ inches. Line up the decimal points when adding, and divide by the number of values, not by the number of nonzero ones or one less.",
          "四天的降雨量是 $1.2, 0.4, 2.0, 0.6$ 英寸：和是 $4.2$，所以平均数是 $4.2 \\div 4 = 1.05$ 英寸。相加时小数点要对齐，并且要除以数据的个数。",
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
            return numberProblem({
              prompt: t(`${ctx.en(n)} $${tenthsList(xs)}$. Find the mean.`, `${ctx.zh(n)} $${tenthsList(xs)}$。求平均数。`),
              answer: m,
              form: "decimal",
              wrong: [total, ...[total.div(Q.of(n - 1)), med].filter(isTerminating)],
              solution: t(
                `Add the ${n} values and divide by ${n}:${steps(`\\frac{${tenthsList(xs).replaceAll(", ", " + ")}}{${n}} = \\frac{${dec(total)}}{${n}} = ${dec(m)}`)}`,
                `把 ${n} 个数相加，再除以 ${n}：${steps(`\\frac{${tenthsList(xs).replaceAll(", ", " + ")}}{${n}} = \\frac{${dec(total)}}{${n}} = ${dec(m)}`)}`,
              ),
            });
          }
        },
      },
      {
        id: "the-total-from-the-mean",
        title: t("The total from the mean", "由平均数求总和"),
        explanation: t(
          "If the mean of $n$ values is $m$, the values add up to $n \\times m$: it is as if every value were equal to the mean. Leo ran a mean of $3.5$ km a day for $6$ days, so he ran $6 \\times 3.5 = 21$ km in all.",
          "如果 $n$ 个数据的平均数是 $m$，它们的和就是 $n \\times m$：相当于每个数据都等于平均数。Leo 连续 $6$ 天平均每天跑 $3.5$ 千米，所以他一共跑了 $6 \\times 3.5 = 21$ 千米。",
        ),
        generate(rng) {
          const story = rng.pick([
            (n: number, m: string) =>
              t(
                `A basketball team scored a mean of $${m}$ points per game over ${n} games. How many points did the team score in all?`,
                `一支篮球队 ${n} 场比赛平均每场得 $${m}$ 分。这支球队一共得了多少分？`,
              ),
            (n: number, m: string) =>
              t(
                `${names[n % names.length]} ran a mean of $${m}$ kilometers a day for ${n} days. How many kilometers is that in all?`,
                `${names[n % names.length]} 连续 ${n} 天平均每天跑 $${m}$ 千米。一共跑了多少千米？`,
              ),
            (n: number, m: string) =>
              t(
                `Over ${n} weeks, a class collected a mean of $${m}$ kilograms of paper per week for recycling. How many kilograms did the class collect in all?`,
                `一个班 ${n} 周里平均每周收集 $${m}$ 千克废纸用于回收。这个班一共收集了多少千克？`,
              ),
          ]);
          const decimal = rng.bool(0.6);
          for (;;) {
            const n = rng.int(3, 9);
            const m10 = rng.int(15, 400);
            if ((m10 * n) % 10 !== 0 || (m10 % 10 !== 0) !== decimal) continue;
            const m = Q.of(m10, 10);
            return numberProblem({
              prompt: story(n, dec(m)),
              answer: m.mul(Q.of(n)),
              form: "decimal",
              wrong: [m, m.add(Q.of(n)), ...[m.div(Q.of(n))].filter(clean)],
              solution: t(
                `The mean is the total divided by ${n}, so the total is the mean times ${n}:${steps(`${n} \\times ${dec(m)} = ${dec(m.mul(Q.of(n)))}`)}`,
                `平均数等于总和除以 ${n}，所以总和等于平均数乘 ${n}：${steps(`${n} \\times ${dec(m)} = ${dec(m.mul(Q.of(n)))}`)}`,
              ),
            });
          }
        },
      },
      {
        id: "adding-a-value",
        title: t("Adding a value", "加入一个数据"),
        explanation: t(
          "The mean of $4$ quiz scores is $80$, and a fifth score of $90$ is added. The four scores add up to $4 \\times 80 = 320$, so the five add up to $320 + 90 = 410$, and the new mean is $410 \\div 5 = 82$. It is not $\\frac{80 + 90}{2} = 85$: that would count the new score as much as the four old ones together.",
          "$4$ 次小测验成绩的平均数是 $80$，又加入第五个成绩 $90$。原来四个成绩之和是 $4 \\times 80 = 320$，五个成绩之和是 $320 + 90 = 410$，新的平均数是 $410 \\div 5 = 82$。不是 $\\frac{80 + 90}{2} = 85$：那样算等于把新成绩看得和原来四个成绩加起来一样重。",
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
            return numberProblem({
              prompt: t(
                `The mean of ${n} quiz scores is $${m}$. One more score, $${xs}$, is added. What is the mean of all ${n + 1} scores?`,
                `${n} 次小测验成绩的平均数是 $${m}$。又加入一个成绩 $${xs}$。全部 ${n + 1} 个成绩的平均数是多少？`,
              ),
              answer: m2,
              form: "decimal",
              wrong: [Q.of(m + xs, 2), ...[Q.of(n * m + xs, n)].filter(clean), n * m + xs],
              solution: t(
                `The ${n} scores add up to $${n} \\times ${m} = ${n * m}$, so all ${n + 1} add up to $${n * m} + ${xs} = ${n * m + xs}$:${steps(`\\frac{${n * m + xs}}{${n + 1}} = ${dec(m2)}`)}`,
                `原来 ${n} 个成绩之和是 $${n} \\times ${m} = ${n * m}$，所以全部 ${n + 1} 个成绩之和是 $${n * m} + ${xs} = ${n * m + xs}$：${steps(`\\frac{${n * m + xs}}{${n + 1}} = ${dec(m2)}`)}`,
              ),
            });
          }
        },
      },
    ],
  ),
  encompasses: [{ topic: "mean-of-a-data-set", weight: 1 }],
};

export const theMedianOfADataSet = topic(
  "the-median-of-a-data-set",
  t("The Median of a Data Set", "数据集的中位数"),
  t(
    "The median is the middle value of the sorted data, or the mean of the two middle values when the count is even. Always sort first. Because the median of an even count is the mean of the two middle values, those two values add up to twice the median. Adding a value shifts the middle, so sort again and find the new middle.",
    "中位数是排好序的数据中间的那个数；数据个数为偶数时，是中间两个数的平均数。一定要先排序。由于偶数个数据的中位数是中间两个数的平均数，这两个数之和等于中位数的两倍。加入一个数据会使中间位置移动，所以要重新排序，再找新的中间值。",
  ),
  ["median-and-mode", "introduction-to-statistics"],
  ["6.SP.A.3", "6.SP.B.5.C"],
  [
    {
      id: "the-median-of-measurements",
      title: t("The median of measurements", "测量数据的中位数"),
      explanation: t(
        "Times of $14.2, 13.5, 15.1, 13.9, 14.8, 13.6$ seconds sorted are $13.5, 13.6, 13.9, 14.2, 14.8, 15.1$. There are six, so the median is the mean of the third and fourth: $\\frac{13.9 + 14.2}{2} = 14.05$ seconds.",
        "成绩 $14.2, 13.5, 15.1, 13.9, 14.8, 13.6$ 秒排序后是 $13.5, 13.6, 13.9, 14.2, 14.8, 15.1$。共六个，所以中位数是第三个与第四个的平均数：$\\frac{13.9 + 14.2}{2} = 14.05$ 秒。",
      ),
      generate(rng) {
        const ctx = rng.pick(measurements);
        const n = rng.int(5, 8);
        const xs = tenthsData(rng, n, ctx.lo, ctx.hi);
        const s = sorted(xs);
        const h = Math.floor(n / 2);
        const m = median(xs).div(Q.of(10));
        const tenth = (v: number) => dec(Q.of(v, 10));
        const unsortedMiddle = n % 2 === 1 ? Q.of(xs[h]!, 10) : Q.of(xs[h - 1]! + xs[h]!, 20);
        const middle =
          n % 2 === 1
            ? t(`the value in position ${h + 1}: $${dec(m)}$.`, `第 ${h + 1} 个数：$${dec(m)}$。`)
            : t(
                `the mean of the values in positions ${h} and ${h + 1}:${steps(`\\frac{${tenth(s[h - 1]!)} + ${tenth(s[h]!)}}{2} = ${dec(m)}`)}`,
                `第 ${h} 个与第 ${h + 1} 个数的平均数：${steps(`\\frac{${tenth(s[h - 1]!)} + ${tenth(s[h]!)}}{2} = ${dec(m)}`)}`,
              );
        return numberProblem({
          prompt: t(`${ctx.en(n)} $${tenthsList(xs)}$. Find the median.`, `${ctx.zh(n)} $${tenthsList(xs)}$。求中位数。`),
          answer: m,
          form: "decimal",
          wrong: [
            unsortedMiddle,
            ...(n % 2 === 0 ? [Q.of(s[h - 1]!, 10), Q.of(s[h]!, 10)] : []),
            ...[mean(xs).div(Q.of(10))].filter(isTerminating),
          ],
          solution: t(
            `Sort the values: $${tenthsList(s)}$. There are ${n} values, so the median is ${middle.en}`,
            `先排序：$${tenthsList(s)}$。共 ${n} 个数，所以中位数是${middle["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "a-missing-value-from-the-median",
      title: t("A missing value from the median", "由中位数求缺失的数据"),
      explanation: t(
        "The six values $3, 8, \\square, 15, 19, 22$ are in order, and their median is $12$. The median is the mean of the third and fourth values, so they add up to $2 \\times 12 = 24$. The missing value is $24 - 15 = 9$.",
        "六个数据 $3, 8, \\square, 15, 19, 22$ 已按从小到大排列，中位数是 $12$。中位数是第三个与第四个数的平均数，所以这两个数之和是 $2 \\times 12 = 24$。缺失的数是 $24 - 15 = 9$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 6, 8]);
        const s = sorted(distinctData(rng, n, 1, 60));
        const h = n / 2;
        const hide = rng.pick([h - 1, h]);
        const other = s[hide === h ? h - 1 : h]!;
        const x = s[hide]!;
        const m = median(s);
        const shown = s.map((v, i) => (i === hide ? "\\square" : String(v)));
        return numberProblem({
          prompt: t(
            `The ${n} values $${list(shown)}$ are listed from least to greatest, and their median is $${dec(m)}$. What is the missing value?`,
            `${n} 个数据 $${list(shown)}$ 已按从小到大排列，它们的中位数是 $${dec(m)}$。缺失的数是多少？`,
          ),
          answer: x,
          form: "integer",
          wrong: [m, other, m.mul(Q.of(2))],
          solution: t(
            `With ${n} values, the median is the mean of the two middle values, so they add up to $2 \\times ${dec(m)} = ${x + other}$. The other middle value is $${other}$:${steps(`${x + other} - ${other} = ${x}`)}`,
            `${n} 个数据的中位数是中间两个数的平均数，所以这两个数之和是 $2 \\times ${dec(m)} = ${x + other}$。另一个中间的数是 $${other}$：${steps(`${x + other} - ${other} = ${x}`)}`,
          ),
        });
      },
    },
    {
      id: "adding-a-value-to-the-data",
      title: t("Adding a value", "加入一个数据"),
      explanation: t(
        "The median of $4, 9, 6, 12, 2$ is $6$. If $10$ is added, the sorted data are $2, 4, 6, 9, 10, 12$: now there are six values, and the median is $\\frac{6 + 9}{2} = 7.5$.",
        "$4, 9, 6, 12, 2$ 的中位数是 $6$。加入 $10$ 后，排序得 $2, 4, 6, 9, 10, 12$：现在有六个数，中位数是 $\\frac{6 + 9}{2} = 7.5$。",
      ),
      generate(rng) {
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
          const middle =
            (n + 1) % 2 === 1
              ? t(`the value in position ${k + 1}: $${dec(m1)}$.`, `第 ${k + 1} 个数：$${dec(m1)}$。`)
              : t(
                  `the mean of the values in positions ${k} and ${k + 1}:${steps(`\\frac{${s[k - 1]} + ${s[k]}}{2} = ${dec(m1)}`)}`,
                  `第 ${k} 个与第 ${k + 1} 个数的平均数：${steps(`\\frac{${s[k - 1]} + ${s[k]}}{2} = ${dec(m1)}`)}`,
                );
          const unsorted = (n + 1) % 2 === 1 ? Q.of(after[k]!) : Q.of(after[k - 1]! + after[k]!, 2);
          return numberProblem({
            prompt: t(
              `The value $${v}$ is added to the data set $${list(xs)}$. What is the median of the new data set?`,
              `在数据 $${list(xs)}$ 中加入 $${v}$。新数据的中位数是多少？`,
            ),
            answer: m1,
            form: "decimal",
            wrong: [m0, unsorted, m0.add(Q.of(v)).div(Q.of(2))],
            solution: t(
              `With $${v}$ added, the ${n + 1} values sorted are $${list(s)}$, so the median is ${middle.en}`,
              `加入 $${v}$ 后，${n + 1} 个数排序为 $${list(s)}$，所以中位数是${middle["zh-CN"]}`,
            ),
          });
        }
      },
    },
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

/** noMode is the option for a data set without a mode. */
const noMode = t("There is no mode", "没有众数");

export const theModeOfADataSet = topic(
  "the-mode-of-a-data-set",
  t("The Mode of a Data Set", "数据集的众数"),
  t(
    "The mode is the value that occurs most often. A data set can have one mode, several modes when values tie for most often, or no mode when every value occurs the same number of times. The mode is the only measure of center that also works for categorical data, such as favorite colors.",
    "众数是出现次数最多的值。一组数据可以有一个众数；几个值出现次数并列最多时，有几个众数；每个值出现次数都相同时，没有众数。众数是唯一也适用于分类数据（如最喜欢的颜色）的集中趋势量。",
  ),
  ["median-and-mode", "introduction-to-statistics"],
  ["6.SP.A.3", "6.SP.B.5.C"],
  [
    {
      id: "one-several-or-no-modes",
      title: t("One mode, two modes or none", "一个众数、两个众数或没有众数"),
      explanation: t(
        "In $4, 7, 4, 9, 7, 2$, both $4$ and $7$ occur twice and every other value once, so there are two modes, $4$ and $7$. In $5, 8, 1, 6$, every value occurs once, so there is no mode. The mode is a value of the data, not the number of times it occurs.",
        "在 $4, 7, 4, 9, 7, 2$ 中，$4$ 和 $7$ 都出现了两次，其他值各出现一次，所以有两个众数：$4$ 和 $7$。在 $5, 8, 1, 6$ 中，每个值都只出现一次，所以没有众数。众数是数据中的一个值，而不是它出现的次数。",
      ),
      generate(rng) {
        const kind = rng.pick(["none", "one", "two"] as const);
        const pool = distinctData(rng, 7, 1, 40);
        const [a, b, ...rest] = pool as [number, number, ...number[]];
        const singles = rest.slice(0, rng.int(2, 4));
        const pair = (x: number, y: number) =>
          t(`$${Math.min(x, y)}$ and $${Math.max(x, y)}$`, `$${Math.min(x, y)}$ 和 $${Math.max(x, y)}$`);
        const one = (x: number) => mathText(String(x));
        if (kind === "none") {
          const xs = [a, b, ...rest.slice(0, rng.int(2, 5))];
          const s = sorted(xs);
          return pickChoice(
            rng,
            t(`What is the mode of the data set $${list(xs)}$?`, `数据 $${list(xs)}$ 的众数是多少？`),
            noMode,
            [one(s[0]!), one(s[s.length - 1]!), one(xs[0]!)],
            t(
              `Sorted: $${list(s)}$. Every value occurs exactly once, so no value occurs more often than the others, and there is no mode.`,
              `排序后：$${list(s)}$。每个值都只出现一次，没有哪个值出现得更多，所以没有众数。`,
            ),
          );
        }
        if (kind === "one") {
          const xs = rng.shuffle([a, a, a, b, b, ...singles]);
          return pickChoice(
            rng,
            t(`What is the mode of the data set $${list(xs)}$?`, `数据 $${list(xs)}$ 的众数是多少？`),
            one(a),
            [pair(a, b), one(b), noMode, one(3)],
            t(
              `Sorted: $${list(sorted(xs))}$. The value $${a}$ occurs 3 times and $${b}$ twice, so the only mode is $${a}$.`,
              `排序后：$${list(sorted(xs))}$。$${a}$ 出现 3 次，$${b}$ 出现 2 次，所以众数只有 $${a}$。`,
            ),
          );
        }
        const xs = rng.shuffle([a, a, b, b, ...singles]);
        return pickChoice(
          rng,
          t(`What is the mode of the data set $${list(xs)}$?`, `数据 $${list(xs)}$ 的众数是多少？`),
          pair(a, b),
          [one(a), one(b), noMode],
          t(
            `Sorted: $${list(sorted(xs))}$. The values $${Math.min(a, b)}$ and $${Math.max(a, b)}$ each occur twice and every other value once, so both are modes.`,
            `排序后：$${list(sorted(xs))}$。$${Math.min(a, b)}$ 和 $${Math.max(a, b)}$ 各出现两次，其他值各出现一次，所以它们都是众数。`,
          ),
        );
      },
    },
    {
      id: "the-mode-of-categorical-data",
      title: t("The mode of categorical data", "分类数据的众数"),
      explanation: t(
        "Answers such as “dog, cat, dog, fish” are not numbers, so they have no mean or median, but they do have a mode: the most common answer. Here the mode is “dog”. Count each category with a tally to find it.",
        "像“狗、猫、狗、鱼”这样的答案不是数，没有平均数或中位数，但有众数：最常见的答案。这里的众数是“狗”。用画记的方法数出每个类别的个数，就能找到众数。",
      ),
      generate(rng) {
        const c = rng.pick(categories);
        const chosen = rng.sample(c.values, 4);
        const top = rng.int(3, 5);
        const counts = [top, top - 1, rng.int(1, top - 1), rng.int(1, top - 1)];
        const answers = rng.shuffle(chosen.flatMap((v, i) => Array.from({ length: counts[i]! }, () => v)));
        const n = answers.length;
        const tally = chosen.map((v, i) => [v, counts[i]!] as const);
        const shuffled = rng.shuffle(chosen);
        return choiceProblem({
          prompt: t(
            `${c.en(n)} ${answers.map((v) => v[0]).join(", ")}. What is the mode?`,
            `${c.zh(n)}${answers.map((v) => v[1]).join("、")}。众数是什么？`,
          ),
          options: shuffled.map(([en, zh]) => t(capitalize(en), zh)),
          correct: shuffled.indexOf(chosen[0]!),
          solution: t(
            `Count each answer: ${tally.map(([v, k]) => `${v[0]} ${k}`).join(", ")}. The most common answer is ${chosen[0]![0]}, so the mode is ${chosen[0]![0]}.`,
            `数出每种答案的个数：${tally.map(([v, k]) => `${v[1]} ${k} 个`).join("，")}。最常见的答案是${chosen[0]![1]}，所以众数是${chosen[0]![1]}。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Measures of spread

/** fiveNumbers writes a five-number summary: "2, 5, 8, 11, 15". */
const fiveNumbers = (s: readonly Q[]) => mathText(list(s.map((q) => dec(q))));

export const rangeQuartilesAndIqr = topic(
  "range-quartiles-and-iqr",
  t("Range, Quartiles, and IQR", "极差、四分位数与四分位距"),
  t(
    "The range is the greatest value minus the least. The median splits the sorted data into a lower and an upper half, leaving the median itself out when the count is odd; the first quartile Q₁ is the median of the lower half and the third quartile Q₃ the median of the upper half. The interquartile range is IQR = Q₃ − Q₁. The minimum, Q₁, the median, Q₃ and the maximum together form the five-number summary.",
    "极差是最大值减最小值。中位数把排好序的数据分成下半部分和上半部分，数据个数为奇数时中位数本身不计入任何一半；第一四分位数 Q₁ 是下半部分的中位数，第三四分位数 Q₃ 是上半部分的中位数。四分位距 IQR = Q₃ − Q₁。最小值、Q₁、中位数、Q₃ 和最大值合起来叫做五数概括。",
  ),
  ["range-and-interquartile-range", "the-median-of-a-data-set", "absolute-value"],
  ["6.SP.B.5.C"],
  [
    {
      id: "the-range-with-negative-values",
      title: t("The range with negative values", "含负数的极差"),
      explanation: t(
        "Low temperatures of $3, -5, 0, 6, -2$ °C have a greatest value of $6$ and a least value of $-5$. The range is $6 - (-5) = 11$: the distance from $-5$ up to $0$ is $5$, and from $0$ up to $6$ is $6$. It is not $6 - 5 = 1$.",
        "最低气温 $3, -5, 0, 6, -2$ °C 中，最大值是 $6$，最小值是 $-5$。极差是 $6 - (-5) = 11$：从 $-5$ 到 $0$ 相差 $5$，从 $0$ 到 $6$ 相差 $6$。不是 $6 - 5 = 1$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(5, 8);
          const xs = data(rng, n, -15, 20);
          const [lo, hi] = [Math.min(...xs), Math.max(...xs)];
          if (lo >= 0 || hi <= 0 || hi + lo === 0) continue;
          return numberProblem({
            prompt: t(
              `The low temperatures, in °C, in a town on ${n} winter days were $${list(xs)}$. What is the range of the temperatures?`,
              `某镇冬季 ${n} 天的最低气温（°C）分别是 $${list(xs)}$。这些气温的极差是多少？`,
            ),
            answer: hi - lo,
            form: "integer",
            wrong: [Math.abs(hi + lo), hi + lo, hi],
            solution: t(
              `The greatest value is $${hi}$ and the least is $${lo}$:${steps(`${hi} - (${lo}) = ${hi} + ${-lo} = ${hi - lo}`)}`,
              `最大值是 $${hi}$，最小值是 $${lo}$：${steps(`${hi} - (${lo}) = ${hi} + ${-lo} = ${hi - lo}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "finding-a-quartile",
      title: t("Finding a quartile", "求四分位数"),
      explanation: t(
        "For $5, 1, 9, 4, 12, 7, 3$: sorted, $1, 3, 4, 5, 7, 9, 12$, the median is $5$. With an odd count the median belongs to neither half, so the lower half is $1, 3, 4$ and $Q_1 = 3$, and the upper half is $7, 9, 12$ and $Q_3 = 9$.\n\nWith an even count, such as $1, 3, 4, 5, 7, 9$, the halves are simply the first three and the last three values: $Q_1 = 3$ and $Q_3 = 7$.",
        "对 $5, 1, 9, 4, 12, 7, 3$：排序得 $1, 3, 4, 5, 7, 9, 12$，中位数是 $5$。数据个数为奇数时，中位数不属于任何一半，所以下半部分是 $1, 3, 4$，$Q_1 = 3$；上半部分是 $7, 9, 12$，$Q_3 = 9$。\n\n数据个数为偶数时，如 $1, 3, 4, 5, 7, 9$，两半就是前三个数和后三个数：$Q_1 = 3$，$Q_3 = 7$。",
      ),
      generate(rng) {
        const n = rng.int(7, 12);
        const xs = data(rng, n, 1, 60);
        const s = sorted(xs);
        const [lower, upper] = halves(xs);
        const third = rng.bool();
        const [q1, q3] = quartiles(xs);
        const [i1, i3] = inclusiveQuartiles(xs);
        const name = third ? t("third quartile", "第三四分位数") : t("first quartile", "第一四分位数");
        const half = third ? upper : lower;
        const q = third ? q3 : q1;
        return numberProblem({
          prompt: t(`Find the ${name.en} of the data set $${list(xs)}$.`, `求数据 $${list(xs)}$ 的${name["zh-CN"]}。`),
          answer: q,
          form: "decimal",
          wrong: [
            third ? i3 : i1,
            median(xs),
            third ? q1 : q3,
            median(third ? xs.slice(n - Math.floor(n / 2)) : xs.slice(0, Math.floor(n / 2))),
          ],
          solution: t(
            `Sorted: $${list(s)}$. The ${third ? "upper" : "lower"} half is $${list(half)}$, and its median is $${third ? "Q_3" : "Q_1"} = ${dec(q)}$.`,
            `排序后：$${list(s)}$。${third ? "上" : "下"}半部分是 $${list(half)}$，它的中位数是 $${third ? "Q_3" : "Q_1"} = ${dec(q)}$。`,
          ),
        });
      },
    },
    {
      id: "the-five-number-summary",
      title: t("The five-number summary", "五数概括"),
      explanation: t(
        "The **five-number summary** lists the minimum, $Q_1$, the median, $Q_3$ and the maximum. For $1, 3, 4, 5, 7, 9, 12$ it is $1, 3, 5, 9, 12$. Find all five from the sorted data.",
        "**五数概括**依次列出最小值、$Q_1$、中位数、$Q_3$ 和最大值。对 $1, 3, 4, 5, 7, 9, 12$，五数概括是 $1, 3, 5, 9, 12$。五个数都要从排好序的数据中找。",
      ),
      generate(rng) {
        const n = rng.pick([7, 9, 11]);
        const xs = distinctData(rng, n, 1, 50);
        const s = sorted(xs);
        const [q1, q3] = quartiles(xs);
        const [i1, i3] = inclusiveQuartiles(xs);
        const lo = Q.of(s[0]!);
        const hi = Q.of(s[n - 1]!);
        const med = median(xs);
        const h = Math.floor(n / 2);
        const unsorted = [Q.of(xs[0]!), median(xs.slice(0, h)), Q.of(xs[h]!), median(xs.slice(n - h)), Q.of(xs[n - 1]!)];
        const m = mean(xs);
        return pickChoice(
          rng,
          t(`What is the five-number summary of the data set $${list(xs)}$?`, `数据 $${list(xs)}$ 的五数概括是什么？`),
          fiveNumbers([lo, q1, med, q3, hi]),
          [
            fiveNumbers([lo, i1, med, i3, hi]),
            fiveNumbers(unsorted),
            ...(clean(m) && !m.eq(med) ? [fiveNumbers([lo, q1, m, q3, hi])] : []),
            fiveNumbers([lo, Q.of(s[1]!), med, Q.of(s[n - 2]!), hi]),
          ],
          t(
            `Sorted: $${list(s)}$. The minimum is $${s[0]}$ and the maximum $${s[n - 1]}$. The median is $${dec(med)}$; the lower half $${list(s.slice(0, h))}$ gives $Q_1 = ${dec(q1)}$, and the upper half $${list(s.slice(n - h))}$ gives $Q_3 = ${dec(q3)}$.`,
            `排序后：$${list(s)}$。最小值是 $${s[0]}$，最大值是 $${s[n - 1]}$。中位数是 $${dec(med)}$；下半部分 $${list(s.slice(0, h))}$ 得 $Q_1 = ${dec(q1)}$，上半部分 $${list(s.slice(n - h))}$ 得 $Q_3 = ${dec(q3)}$。`,
          ),
        );
      },
    },
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

/** spotTheOutlier explains which value of a data set is its outlier. */
function spotTheOutlier(xs: readonly number[], extreme: number): Text {
  const [q1, q3] = quartiles(xs);
  const iqr = q3.sub(q1);
  const k = iqr.mul(Q.of(3, 2));
  return t(
    `Sorted: $${list(sorted(xs))}$, with $Q_1 = ${dec(q1)}$, $Q_3 = ${dec(q3)}$ and $\\text{IQR} = ${dec(iqr)}$. The fences are $${dec(q1.sub(k))}$ and $${dec(q3.add(k))}$, and only $${extreme}$ lies outside them.`,
    `排序后：$${list(sorted(xs))}$，$Q_1 = ${dec(q1)}$，$Q_3 = ${dec(q3)}$，$\\text{IQR} = ${dec(iqr)}$。两个界限是 $${dec(q1.sub(k))}$ 和 $${dec(q3.add(k))}$，只有 $${extreme}$ 落在界限之外。`,
  );
}

export const removingOutliers = topic(
  "removing-outliers",
  t("Removing Outliers", "去掉离群值"),
  t(
    "An outlier is a value more than 1.5 × IQR below Q₁ or above Q₃. An outlier caused by a mistake, or one that does not belong to the group being studied, is often removed before the data are summarized. Removing it changes the count, the mean and the range a lot, but the median and the IQR only a little.",
    "离群值是比 Q₁ 小 1.5 × IQR 以上，或比 Q₃ 大 1.5 × IQR 以上的值。由错误造成的离群值，或不属于所研究群体的离群值，常常在概括数据之前被去掉。去掉它会使数据个数、平均数和极差变化很大，而中位数和四分位距只稍有变化。",
  ),
  ["outliers", "range-quartiles-and-iqr", "the-mean-of-a-data-set"],
  ["6.SP.B.5.C", "6.SP.B.5.D"],
  [
    {
      id: "the-mean-without-the-outlier",
      title: t("The mean without the outlier", "去掉离群值后的平均数"),
      explanation: t(
        "$12, 15, 14, 60, 13, 14$ has the outlier $60$. Without it, the five values add up to $68$, and the mean is $68 \\div 5 = 13.6$. Divide by the new count, $5$, not by the original $6$.",
        "$12, 15, 14, 60, 13, 14$ 中有离群值 $60$。去掉它后，五个数之和是 $68$，平均数是 $68 \\div 5 = 13.6$。要除以新的个数 $5$，而不是原来的 $6$。",
      ),
      generate(rng) {
        for (;;) {
          const { base, extreme, xs } = withOutlier(rng);
          const m = mean(base);
          if (!clean(m)) continue;
          return numberProblem({
            prompt: t(
              `The data set $${list(xs)}$ has one outlier. What is the mean of the data once the outlier is removed?`,
              `数据 $${list(xs)}$ 中有一个离群值。去掉离群值后，数据的平均数是多少？`,
            ),
            answer: m,
            form: "decimal",
            wrong: [...[mean(xs), Q.of(sum(base), xs.length)].filter(clean), median(base)],
            solution: t(
              `${spotTheOutlier(xs, extreme).en} The other ${base.length} values add up to $${sum(base)}$:${steps(`\\frac{${sum(base)}}{${base.length}} = ${dec(m)}`)}`,
              `${spotTheOutlier(xs, extreme)["zh-CN"]}其余 ${base.length} 个数之和是 $${sum(base)}$：${steps(`\\frac{${sum(base)}}{${base.length}} = ${dec(m)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "the-median-without-the-outlier",
      title: t("The median without the outlier", "去掉离群值后的中位数"),
      explanation: t(
        "$12, 15, 14, 60, 13, 14$ sorted is $12, 13, 14, 14, 15, 60$, with median $14$. Without the outlier $60$, the five values $12, 13, 14, 14, 15$ have median $14$ again: the median barely moves, because it depends only on the middle of the data.",
        "$12, 15, 14, 60, 13, 14$ 排序后是 $12, 13, 14, 14, 15, 60$，中位数是 $14$。去掉离群值 $60$ 后，五个数 $12, 13, 14, 14, 15$ 的中位数仍是 $14$：中位数只取决于中间的数据，所以几乎不变。",
      ),
      generate(rng) {
        const { base, extreme, xs } = withOutlier(rng);
        const m = median(base);
        const s = sorted(base);
        const n = base.length;
        return numberProblem({
          prompt: t(
            `The data set $${list(xs)}$ has one outlier. What is the median of the data once the outlier is removed?`,
            `数据 $${list(xs)}$ 中有一个离群值。去掉离群值后，数据的中位数是多少？`,
          ),
          answer: m,
          form: "decimal",
          wrong: [median(xs), unsortedMiddle(xs.filter((x) => x !== extreme)), ...[mean(base)].filter(clean)],
          solution: t(
            `${spotTheOutlier(xs, extreme).en} The remaining ${n} values sorted are $${list(s)}$, so the median is $${dec(m)}$.`,
            `${spotTheOutlier(xs, extreme)["zh-CN"]}其余 ${n} 个数排序为 $${list(s)}$，所以中位数是 $${dec(m)}$。`,
          ),
        });
      },
    },
    {
      id: "the-range-without-the-outlier",
      title: t("The range without the outlier", "去掉离群值后的极差"),
      explanation: t(
        "With the outlier $60$, the range of $12, 13, 14, 14, 15, 60$ is $60 - 12 = 48$. Without it, the range is $15 - 12 = 3$. The range uses only the two extreme values, so a single outlier can make it very large.",
        "含离群值 $60$ 时，$12, 13, 14, 14, 15, 60$ 的极差是 $60 - 12 = 48$。去掉它后，极差是 $15 - 12 = 3$。极差只用到两个极端值，所以一个离群值就能使它变得很大。",
      ),
      generate(rng) {
        const { base, extreme, xs } = withOutlier(rng);
        const [lo, hi] = [Math.min(...base), Math.max(...base)];
        const r = hi - lo;
        const full = Math.max(...xs) - Math.min(...xs);
        return numberProblem({
          prompt: t(
            `The data set $${list(xs)}$ has one outlier. What is the range of the data once the outlier is removed?`,
            `数据 $${list(xs)}$ 中有一个离群值。去掉离群值后，数据的极差是多少？`,
          ),
          answer: r,
          form: "integer",
          wrong: [full, full - r, hi],
          solution: t(
            `${spotTheOutlier(xs, extreme).en} Without it, the greatest value is $${hi}$ and the least is $${lo}$:${steps(`${hi} - ${lo} = ${r}`)}`,
            `${spotTheOutlier(xs, extreme)["zh-CN"]}去掉它后，最大值是 $${hi}$，最小值是 $${lo}$：${steps(`${hi} - ${lo} = ${r}`)}`,
          ),
        });
      },
    },
  ],
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

/** centerOptions are the measures of center to choose from. */
const centerOptions: readonly Text[] = [t("The mean", "平均数"), t("The median", "中位数")];

/** changeOptions are what can happen to the mean and the median when one value changes. */
const changeOptions: readonly Text[] = [
  t("Only the mean changes", "只有平均数改变"),
  t("Only the median changes", "只有中位数改变"),
  t("Both change", "两者都改变"),
  t("Neither changes", "两者都不变"),
];

export const comparingMeasuresOfCenter = topic(
  "comparing-measures-of-center",
  t("Comparing Measures of Center", "比较集中趋势量"),
  t(
    "The mean uses every value, so an outlier or a long tail pulls it toward the extreme values; the median depends only on the middle of the sorted data. When the data are roughly symmetric with no outliers, the mean is the usual measure of center. When the data have outliers or are strongly skewed, the median describes a typical value better.",
    "平均数用到每一个数据，所以离群值或长尾会把它拉向极端值；中位数只取决于排好序的数据的中间部分。数据大致对称、没有离群值时，通常用平均数表示中心。数据有离群值或明显偏斜时，中位数更能代表典型值。",
  ),
  ["removing-outliers"],
  ["6.SP.B.5.C", "6.SP.B.5.D"],
  [
    {
      id: "the-mean-and-the-median",
      title: t("The mean and the median", "平均数与中位数"),
      explanation: t(
        "For $4, 5, 5, 6, 7, 9, 34$ the median is $6$, but the mean is $\\frac{70}{7} = 10$: the outlier $34$ pulls the mean up by $4$, above six of the seven values. A low outlier pulls the mean below the median in the same way.",
        "对 $4, 5, 5, 6, 7, 9, 34$，中位数是 $6$，而平均数是 $\\frac{70}{7} = 10$：离群值 $34$ 把平均数拉高了 $4$，比七个数中的六个都大。同样，偏小的离群值会把平均数拉到中位数以下。",
      ),
      generate(rng) {
        for (;;) {
          const { xs } = typicalData(rng, true);
          const m = mean(xs);
          const med = median(xs);
          if (!clean(m) || m.eq(med)) continue;
          const meanBigger = m.cmp(med) > 0;
          const diff = m.sub(med).abs();
          const [big, small] = meanBigger ? [t("mean", "平均数"), t("median", "中位数")] : [t("median", "中位数"), t("mean", "平均数")];
          return numberProblem({
            prompt: t(
              `For the data set $${list(xs)}$, how much greater is the ${big.en} than the ${small.en}?`,
              `对数据 $${list(xs)}$，${big["zh-CN"]}比${small["zh-CN"]}大多少？`,
            ),
            answer: diff,
            form: "decimal",
            wrong: [m, med, ...[m.sub(unsortedMiddle(xs)).abs()].filter(clean)],
            solution: t(
              `The mean is $\\frac{${sum(xs)}}{${xs.length}} = ${dec(m)}$. Sorted, the data are $${list(sorted(xs))}$, so the median is $${dec(med)}$:${steps(`${dec(meanBigger ? m : med)} - ${dec(meanBigger ? med : m)} = ${dec(diff)}`)}`,
              `平均数是 $\\frac{${sum(xs)}}{${xs.length}} = ${dec(m)}$。排序后是 $${list(sorted(xs))}$，所以中位数是 $${dec(med)}$：${steps(`${dec(meanBigger ? m : med)} - ${dec(meanBigger ? med : m)} = ${dec(diff)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "choosing-a-measure-of-center",
      title: t("Choosing a measure of center", "选择集中趋势量"),
      explanation: t(
        "Check the data for outliers first. $21, 24, 25, 26, 28, 30$ has none and is roughly symmetric, so the mean, about $25.7$, is a good measure of center. $21, 24, 25, 26, 28, 30, 70$ has the outlier $70$, which pulls the mean up to $32$, above all but one value, so the median, $26$, is the better choice.",
        "先检查数据中有没有离群值。$21, 24, 25, 26, 28, 30$ 没有离群值且大致对称，所以平均数（约 $25.7$）是合适的中心量。$21, 24, 25, 26, 28, 30, 70$ 有离群值 $70$，它把平均数拉高到 $32$，比除它以外的所有数都大，所以中位数 $26$ 更合适。",
      ),
      generate(rng) {
        const outlier = rng.bool();
        const { xs, extreme } = typicalData(rng, outlier);
        const m = mean(xs);
        const med = median(xs);
        return choiceProblem({
          prompt: t(
            `Which measure of center is more appropriate for the data set $${list(xs)}$: the mean or the median?`,
            `对数据 $${list(xs)}$，平均数和中位数哪个更适合描述它的中心？`,
          ),
          options: centerOptions,
          correct: outlier ? 1 : 0,
          solution: outlier
            ? t(
                `The value $${extreme}$ is an outlier. It pulls the mean ${Q.of(extreme!).cmp(med) > 0 ? "up" : "down"} to $\\frac{${sum(xs)}}{${xs.length}} ${about(m)}$, while the median, $${dec(med)}$, stays among the typical values, so the median is more appropriate.`,
                `$${extreme}$ 是离群值。它把平均数拉到 $\\frac{${sum(xs)}}{${xs.length}} ${about(m)}$，而中位数 $${dec(med)}$ 仍在典型值之中，所以中位数更合适。`,
              )
            : t(
                `No value is an outlier, and the data are roughly symmetric: the mean $${about(m)}$ is close to the median, $${dec(med)}$. The mean uses every value, so it is more appropriate here.`,
                `没有离群值，数据大致对称：平均数 $${about(m)}$，与中位数 $${dec(med)}$ 很接近。平均数用到每一个数据，所以这里用平均数更合适。`,
              ),
        });
      },
    },
    {
      id: "changing-a-value",
      title: t("Changing a value", "改变一个数据"),
      explanation: t(
        "Changing any value changes the sum, so it always changes the mean. The median changes only if the middle of the sorted data changes. In $3, 5, 8, 10, 12$, changing $12$ to $30$ leaves the median at $8$ but raises the mean. Changing $3$ to $11$ gives $5, 8, 10, 11, 12$, and the median becomes $10$.",
        "改变任何一个数据都会改变总和，所以平均数一定改变。只有排好序的数据的中间发生变化时，中位数才会改变。在 $3, 5, 8, 10, 12$ 中，把 $12$ 改成 $30$，中位数仍是 $8$，但平均数变大了。把 $3$ 改成 $11$ 得 $5, 8, 10, 11, 12$，中位数变成 $10$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([5, 7, 9]);
          const xs = distinctData(rng, n, 2, 40);
          const s = sorted(xs);
          const h = Math.floor(n / 2);
          const kind = rng.pick(["largest", "smallest", "cross", "middle"] as const);
          let from: number;
          let to: number;
          if (kind === "largest") [from, to] = [s[n - 1]!, s[n - 1]! + rng.int(5, 40)];
          else if (kind === "smallest") [from, to] = [s[0]!, Math.max(0, s[0]! - rng.int(1, 10))];
          else if (kind === "cross")
            [from, to] = rng.bool() ? [s[0]!, s[h]! + rng.int(1, 15)] : [s[n - 1]!, Math.max(0, s[h]! - rng.int(1, 15))];
          else [from, to] = [s[h]!, s[h]! + rng.pick([-1, 1]) * rng.int(1, 3)];
          if (to === from || xs.includes(to)) continue;
          const after = xs.map((x) => (x === from ? to : x));
          const medianChanges = !median(after).eq(median(xs));
          return choiceProblem({
            prompt: t(
              `In the data set $${list(xs)}$, the value $${from}$ is changed to $${to}$. What happens to the mean and the median?`,
              `在数据 $${list(xs)}$ 中，把 $${from}$ 改成 $${to}$。平均数和中位数会怎样？`,
            ),
            options: changeOptions,
            correct: medianChanges ? 2 : 0,
            solution: t(
              `The sum changes by $${to - from}$, so the mean changes. Sorted, the new data are $${list(sorted(after))}$, and the median ${medianChanges ? `changes from $${dec(median(xs))}$ to $${dec(median(after))}$. Both change.` : `is still $${dec(median(xs))}$. Only the mean changes.`}`,
              `总和变化了 $${to - from}$，所以平均数改变。新数据排序为 $${list(sorted(after))}$，中位数${medianChanges ? `从 $${dec(median(xs))}$ 变成 $${dec(median(after))}$。两者都改变。` : `仍是 $${dec(median(xs))}$。只有平均数改变。`}`,
            ),
          });
        }
      },
    },
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

/** setOptions are the two data sets of a comparison. */
const setOptions: readonly Text[] = [t("Data set A", "数据集 A"), t("Data set B", "数据集 B")];

/** spreadOptions are the measures of spread to choose from. */
const spreadOptions: readonly Text[] = [t("The mean absolute deviation", "平均绝对偏差"), t("The interquartile range", "四分位距")];

export const comparingMeasuresOfSpread = topic(
  "comparing-measures-of-spread",
  t("Comparing Measures of Spread", "比较离散程度量"),
  t(
    "The range, the interquartile range and the mean absolute deviation all measure how spread out data are. The MAD goes with the mean: it is the mean distance from the mean, so it uses every value. The IQR goes with the median: it is the spread of the middle half, so outliers barely affect it. Use the MAD for roughly symmetric data without outliers, and the IQR for data with outliers.",
    "极差、四分位距和平均绝对偏差都衡量数据的分散程度。平均绝对偏差与平均数搭配：它是各数据到平均数的平均距离，用到每一个数据。四分位距与中位数搭配：它是中间一半数据的分散程度，几乎不受离群值影响。数据大致对称、没有离群值时用平均绝对偏差，有离群值时用四分位距。",
  ),
  ["mean-absolute-deviation", "removing-outliers"],
  ["6.SP.A.3", "6.SP.B.5.C", "6.SP.B.5.D"],
  [
    {
      id: "comparing-mads",
      title: t("Comparing mean absolute deviations", "比较平均绝对偏差"),
      explanation: t(
        "A: $4, 6, 8, 10$ has mean $7$ and distances $3, 1, 1, 3$, so its MAD is $2$. B: $1, 7, 7, 13$ also has mean $7$, with distances $6, 0, 0, 6$, so its MAD is $3$. B's values lie farther from the mean on average, so B is more spread out, even though the two data sets have the same mean.",
        "A：$4, 6, 8, 10$ 的平均数是 $7$，各数到平均数的距离是 $3, 1, 1, 3$，所以 MAD 是 $2$。B：$1, 7, 7, 13$ 的平均数也是 $7$，距离是 $6, 0, 0, 6$，所以 MAD 是 $3$。平均来看 B 的数据离平均数更远，所以虽然两组平均数相同，B 更分散。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([4, 5]);
          const c = rng.int(8, 30);
          const a = integerMean(rng, n, c - 7, c + 7);
          const b = integerMean(rng, n, c - 7, c + 7);
          const [ma, mb] = [mad(a), mad(b)];
          const cmp = ma.cmp(mb);
          if (cmp === 0) continue;
          const show = (xs: number[], m: Q, label: string) =>
            `${label}: $${list(xs)}$, mean $${dec(mean(xs))}$, distances $${list(xs.map((x) => Math.abs(x - Number(mean(xs).n))))}$, $\\text{MAD} = ${dec(m)}$`;
          const showZh = (xs: number[], m: Q, label: string) =>
            `${label}：$${list(xs)}$，平均数 $${dec(mean(xs))}$，距离 $${list(xs.map((x) => Math.abs(x - Number(mean(xs).n))))}$，$\\text{MAD} = ${dec(m)}$`;
          return choiceProblem({
            prompt: t(
              `Data set A is $${list(a)}$ and data set B is $${list(b)}$. Which data set has the greater mean absolute deviation?`,
              `数据集 A 为 $${list(a)}$，数据集 B 为 $${list(b)}$。哪组数据的平均绝对偏差更大？`,
            ),
            options: setOptions,
            correct: cmp > 0 ? 0 : 1,
            solution: t(
              `${show(a, ma, "A")}. ${show(b, mb, "B")}. So data set ${cmp > 0 ? "A" : "B"} has the greater mean absolute deviation.`,
              `${showZh(a, ma, "A")}。${showZh(b, mb, "B")}。所以数据集 ${cmp > 0 ? "A" : "B"} 的平均绝对偏差更大。`,
            ),
          });
        }
      },
    },
    {
      id: "choosing-a-measure-of-spread",
      title: t("Choosing a measure of spread", "选择离散程度量"),
      explanation: t(
        "An outlier is far from the mean, so its large distance raises the MAD, and it is one of the two values the range uses. It barely moves the quartiles. So for data with an outlier, the IQR describes the spread of the typical values better; for roughly symmetric data without outliers, the MAD uses all the information.",
        "离群值离平均数很远，它的大距离会使平均绝对偏差变大，而且它是极差用到的两个值之一。它几乎不影响四分位数。所以对有离群值的数据，四分位距更能描述典型值的分散程度；对大致对称、没有离群值的数据，平均绝对偏差用到了全部信息。",
      ),
      generate(rng) {
        const outlier = rng.bool();
        const { xs, extreme } = typicalData(rng, outlier);
        const [q1, q3] = quartiles(xs);
        return choiceProblem({
          prompt: t(
            `Which measure of spread is more appropriate for the data set $${list(xs)}$: the mean absolute deviation or the interquartile range?`,
            `对数据 $${list(xs)}$，平均绝对偏差和四分位距哪个更适合描述它的离散程度？`,
          ),
          options: spreadOptions,
          correct: outlier ? 1 : 0,
          solution: outlier
            ? t(
                `The value $${extreme}$ is an outlier. Its distance from the mean inflates the mean absolute deviation, while the quartiles $Q_1 = ${dec(q1)}$ and $Q_3 = ${dec(q3)}$ hardly depend on it. The interquartile range is more appropriate.`,
                `$${extreme}$ 是离群值。它到平均数的距离会使平均绝对偏差偏大，而四分位数 $Q_1 = ${dec(q1)}$ 和 $Q_3 = ${dec(q3)}$ 几乎不受它影响。所以四分位距更合适。`,
              )
            : t(
                `Sorted, the data are $${list(sorted(xs))}$: roughly symmetric, with no outlier. The mean absolute deviation uses every value, so it is more appropriate here.`,
                `排序后是 $${list(sorted(xs))}$：大致对称，没有离群值。平均绝对偏差用到每一个数据，所以这里用它更合适。`,
              ),
        });
      },
    },
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

export const frequencyTables = topic(
  "frequency-tables",
  t("Frequency Tables", "频数表"),
  t(
    "A frequency table lists each value of a data set with its frequency: the number of times it occurs. The number of observations is the sum of the frequencies, not the number of columns. The mode is the value with the greatest frequency. To find the mean, multiply each value by its frequency, add the products, and divide by the number of observations.",
    "频数表列出数据中的每个值及其频数，即它出现的次数。观测值的个数是各频数之和，而不是表格的列数。众数是频数最大的值。求平均数时，把每个值乘它的频数，把这些积相加，再除以观测值的个数。",
  ),
  ["the-mean-of-a-data-set", "the-mode-of-a-data-set"],
  ["6.SP.B.4", "6.SP.B.5.A", "6.SP.B.5.C"],
  [
    {
      id: "counting-from-a-frequency-table",
      title: t("Counting from a frequency table", "从频数表中计数"),
      explanation: t(
        "In a table of pets per student with frequencies $3, 8, 5, 2, 1$ for $0, 1, 2, 3, 4$ pets, $3 + 8 + 5 + 2 + 1 = 19$ students answered. The students with at least $2$ pets number $5 + 2 + 1 = 8$. Add frequencies, not the values themselves.",
        "在“每个学生的宠物数”表格中，养 $0, 1, 2, 3, 4$ 只宠物的频数分别是 $3, 8, 5, 2, 1$，所以共有 $3 + 8 + 5 + 2 + 1 = 19$ 名学生作答。至少养 $2$ 只宠物的学生有 $5 + 2 + 1 = 8$ 名。要加的是频数，而不是值本身。",
      ),
      generate(rng) {
        const { tally, values, freqs, table } = frequencyTable(rng);
        const n = sum(freqs);
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(`${tally.en} ${table.en} ${tally.total.en}`, `${tally.zh}${table["zh-CN"]}${tally.total["zh-CN"]}`),
            answer: n,
            form: "integer",
            wrong: [values.length, sum(values), sum(values.map((v, i) => v * freqs[i]!))],
            solution: t(
              `Each frequency counts the observations with that value, so add them:${steps(`${freqs.join(" + ")} = ${n}`)}`,
              `每个频数是取该值的观测值个数，所以把它们相加：${steps(`${freqs.join(" + ")} = ${n}`)}`,
            ),
          });
        }
        const i = rng.int(1, 3);
        const k = values[i]!;
        const counted = freqs.slice(i);
        const answer = sum(counted);
        return numberProblem({
          prompt: t(`${tally.en} ${table.en} ${tally.atLeast(k).en}`, `${tally.zh}${table["zh-CN"]}${tally.atLeast(k)["zh-CN"]}`),
          answer,
          form: "integer",
          wrong: [answer - freqs[i]!, values.length - i, n - answer, sum(values.slice(i))],
          solution: t(
            `“At least $${k}$” includes $${k}$. Add the frequencies of $${list(values.slice(i))}$:${steps(`${counted.join(" + ")} = ${answer}`)}`,
            `“至少 $${k}$”包括 $${k}$。把 $${list(values.slice(i))}$ 的频数相加：${steps(`${counted.join(" + ")} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "the-mode-from-a-frequency-table",
      title: t("The mode from a frequency table", "从频数表求众数"),
      explanation: t(
        "With frequencies $3, 8, 5, 2, 1$ for $0, 1, 2, 3, 4$ pets, the greatest frequency is $8$, for $1$ pet. So the mode is $1$, the value, not $8$, its frequency.",
        "养 $0, 1, 2, 3, 4$ 只宠物的频数分别是 $3, 8, 5, 2, 1$，最大的频数 $8$ 对应 $1$ 只宠物。所以众数是这个值 $1$，而不是它的频数 $8$。",
      ),
      generate(rng) {
        for (;;) {
          const { tally, values, freqs, table } = frequencyTable(rng);
          const top = Math.max(...freqs);
          if (freqs.filter((f) => f === top).length !== 1) continue;
          const mode = values[freqs.indexOf(top)]!;
          if (top === mode) continue;
          return numberProblem({
            prompt: t(`${tally.en} ${table.en} ${tally.mode.en}`, `${tally.zh}${table["zh-CN"]}${tally.mode["zh-CN"]}`),
            answer: mode,
            form: "integer",
            wrong: [top, values[values.length - 1]!, values[freqs.indexOf(Math.min(...freqs))]!],
            solution: t(
              `The greatest frequency is $${top}$, for the value $${mode}$, so the mode is $${mode}$.`,
              `最大的频数是 $${top}$，对应的值是 $${mode}$，所以众数是 $${mode}$。`,
            ),
          });
        }
      },
    },
    {
      id: "the-mean-from-a-frequency-table",
      title: t("The mean from a frequency table", "从频数表求平均数"),
      explanation: t(
        "With frequencies $3, 8, 5, 2, 1$ for $0, 1, 2, 3, 4$ pets, the pets add up to $0 \\times 3 + 1 \\times 8 + 2 \\times 5 + 3 \\times 2 + 4 \\times 1 = 28$, and there are $19$ students, so the mean is $\\frac{28}{19}$. Each value counts as many times as it occurs; adding just $0 + 1 + 2 + 3 + 4$ and dividing by $5$ ignores the frequencies.",
        "养 $0, 1, 2, 3, 4$ 只宠物的频数分别是 $3, 8, 5, 2, 1$，宠物总数是 $0 \\times 3 + 1 \\times 8 + 2 \\times 5 + 3 \\times 2 + 4 \\times 1 = 28$，共 $19$ 名学生，所以平均数是 $\\frac{28}{19}$。每个值出现几次就要算几次；只把 $0 + 1 + 2 + 3 + 4$ 相加再除以 $5$，就忽略了频数。",
      ),
      generate(rng) {
        for (;;) {
          const { tally, values, freqs, table, xs } = frequencyTable(rng);
          const m = mean(xs);
          if (!clean(m)) continue;
          const products = values.map((v, i) => `${v} \\times ${freqs[i]}`).join(" + ");
          return numberProblem({
            prompt: t(`${tally.en} ${table.en} ${tally.mean.en}`, `${tally.zh}${table["zh-CN"]}${tally.mean["zh-CN"]}`),
            answer: m,
            form: "decimal",
            wrong: [mean(values), Q.of(sum(xs), values.length), Q.of(sum(freqs), values.length)].filter(isTerminating),
            solution: t(
              `Multiply each value by its frequency and add, then divide by the ${xs.length} observations:${steps(`\\frac{${products}}{${xs.length}} = \\frac{${sum(xs)}}{${xs.length}} = ${dec(m)}`)}`,
              `把每个值乘它的频数后相加，再除以观测值个数 ${xs.length}：${steps(`\\frac{${products}}{${xs.length}} = \\frac{${sum(xs)}}{${xs.length}} = ${dec(m)}`)}`,
            ),
          });
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Measures from dot plots

/** dotPlotFigure draws a data set as a dot plot, with alt text listing how many dots sit at each value. */
function dotPlotFigure(xs: readonly number[], axis: Axis): Figure {
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

export const measuringCentralityFromDotPlots = topic(
  "measuring-centrality-from-dot-plots",
  t("Measuring Centrality From Dot Plots", "从点图求集中趋势量"),
  t(
    "A dot plot shows every value of a data set, so the measures of center can be read from it. The mode is the value with the tallest stack. For the mean, each stack counts as its value repeated once per dot: add value × number of dots over all the stacks, and divide by the total number of dots.",
    "点图显示了数据中的每一个值，所以可以从中求出集中趋势量。众数是点叠得最高的那个值。求平均数时，每一叠点相当于它的值重复了点数那么多次：把每个值乘它的点数后相加，再除以点的总数。",
  ),
  ["dot-plots", "frequency-tables"],
  ["6.SP.B.4", "6.SP.B.5.C"],
  [
    {
      id: "the-mean-from-a-dot-plot",
      title: t("The mean from a dot plot", "从点图求平均数"),
      explanation: t(
        "A dot plot with $2$ dots at $1$, $3$ at $2$, $4$ at $3$ and $1$ at $6$ has $10$ dots. Their sum is $1 \\times 2 + 2 \\times 3 + 3 \\times 4 + 6 \\times 1 = 26$, so the mean is $26 \\div 10 = 2.6$. Every dot is a value: averaging only the numbers under the stacks, $1, 2, 3, 6$, would be wrong.",
        "某点图在 $1$ 处有 $2$ 个点，$2$ 处 $3$ 个，$3$ 处 $4$ 个，$6$ 处 $1$ 个，共 $10$ 个点。它们的和是 $1 \\times 2 + 2 \\times 3 + 3 \\times 4 + 6 \\times 1 = 26$，所以平均数是 $26 \\div 10 = 2.6$。每个点都是一个数据：只对各叠下方的数 $1, 2, 3, 6$ 求平均是错误的。",
      ),
      figure: dotPlotFigure([1, 1, 2, 2, 2, 3, 3, 3, 3, 6], { min: 0, max: 7, step: 1 }),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        for (;;) {
          const { xs, axis } = dotData(rng, lo, rng.pick([8, 10, 12, 15, 16, 20]), rng.int(5, 7));
          const m = mean(xs);
          if (!clean(m)) continue;
          const distinct = [...new Set(xs)];
          const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
          const products = counts.map(([v, k]) => `${v} \\times ${k}`).join(" + ");
          return {
            ...numberProblem({
              prompt: t(`The dot plot shows ${en}. What is the mean?`, `点图表示${zh}。平均数是多少？`),
              answer: m,
              form: "decimal",
              wrong: [median(xs), ...[mean(distinct), Q.of(sum(xs), distinct.length)].filter(isTerminating), Q.of(sum(xs))],
              solution: t(
                `There are ${xs.length} dots. Multiply each value by its number of dots and add, then divide by ${xs.length}:${steps(`\\frac{${products}}{${xs.length}} = \\frac{${sum(xs)}}{${xs.length}} = ${dec(m)}`)}`,
                `共有 ${xs.length} 个点。把每个值乘它的点数后相加，再除以 ${xs.length}：${steps(`\\frac{${products}}{${xs.length}} = \\frac{${sum(xs)}}{${xs.length}} = ${dec(m)}`)}`,
              ),
            }),
            figure: dotPlotFigure(xs, axis),
          };
        }
      },
    },
    {
      id: "the-mode-from-a-dot-plot",
      title: t("The mode from a dot plot", "从点图求众数"),
      explanation: t(
        "In a dot plot the mode is the value under the tallest stack. In the dot plot of the previous step the tallest stack has $4$ dots, at $3$, so the mode is $3$: the value, not the height of the stack.",
        "在点图中，众数是点叠得最高的那一叠下方的值。上一步的点图中最高的一叠有 $4$ 个点，在 $3$ 处，所以众数是 $3$：是那个值，而不是那叠点的个数。",
      ),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        for (;;) {
          const { xs, axis } = dotData(rng, lo, rng.int(10, 16), rng.int(6, 8));
          const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
          const top = Math.max(...counts.map(([, k]) => k));
          const tops = counts.filter(([, k]) => k === top);
          if (tops.length !== 1) continue;
          const mode = tops[0]![0];
          return {
            ...numberProblem({
              prompt: t(`The dot plot shows ${en}. What is the mode?`, `点图表示${zh}。众数是多少？`),
              answer: mode,
              form: "integer",
              wrong: [top, median(xs), Math.max(...xs)],
              solution: t(
                `The tallest stack has ${top} dots, above $${mode}$, so the mode is $${mode}$.`,
                `最高的一叠有 ${top} 个点，在 $${mode}$ 上方，所以众数是 $${mode}$。`,
              ),
            }),
            figure: dotPlotFigure(xs, axis),
          };
        }
      },
    },
  ],
);

export const measuringRangeAndMadFromDotPlots = topic(
  "measuring-range-and-mad-from-dot-plots",
  t("Measuring Range and MAD From Dot Plots", "从点图求极差和平均绝对偏差"),
  t(
    "The range is the distance from the leftmost dot to the rightmost dot; the ends of the number line do not count unless dots sit there. For the mean absolute deviation, find the mean, then the distance of each stack's value from it; each distance counts once for every dot in the stack. The MAD is the total of these distances divided by the number of dots.",
    "极差是最左边的点到最右边的点的距离；数轴的两端除非有点，否则不算。求平均绝对偏差时，先求平均数，再求每一叠的值到平均数的距离；每个距离要按这一叠的点数重复计算。各距离的总和除以点的总数就是平均绝对偏差。",
  ),
  ["measuring-centrality-from-dot-plots", "mean-absolute-deviation", "range-quartiles-and-iqr"],
  ["6.SP.B.4", "6.SP.B.5.C"],
  [
    {
      id: "the-range-from-a-dot-plot",
      title: t("The range from a dot plot", "从点图求极差"),
      explanation: t(
        "If the leftmost dot is at $2$ and the rightmost at $9$, the range is $9 - 2 = 7$, even if the number line runs from $0$ to $10$. The height of the stacks does not matter for the range.",
        "如果最左边的点在 $2$，最右边的点在 $9$，极差就是 $9 - 2 = 7$，即使数轴是从 $0$ 画到 $10$。各叠点的高度与极差无关。",
      ),
      generate(rng) {
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
          return {
            ...numberProblem({
              prompt: t(`The dot plot shows ${en}. What is the range?`, `点图表示${zh}。极差是多少？`),
              answer: max - min,
              form: "integer",
              wrong: [span, max, tallest, new Set(xs).size],
              solution: t(
                `The leftmost dot is at $${min}$ and the rightmost at $${max}$:${steps(`${max} - ${min} = ${max - min}`)}`,
                `最左边的点在 $${min}$，最右边的点在 $${max}$：${steps(`${max} - ${min} = ${max - min}`)}`,
              ),
            }),
            figure: dotPlotFigure(xs, axis),
          };
        }
      },
    },
    {
      id: "the-mad-from-a-dot-plot",
      title: t("The mean absolute deviation from a dot plot", "从点图求平均绝对偏差"),
      explanation: t(
        "A dot plot with $1$ dot at $2$, $3$ at $4$, $3$ at $6$ and $1$ at $8$ has $8$ dots with sum $40$, so the mean is $5$. The distances from $5$ are $3$ (once), $1$ (three times), $1$ (three times) and $3$ (once), adding up to $3 + 3 + 3 + 3 = 12$. The MAD is $12 \\div 8 = 1.5$. Dividing by the $4$ stacks instead of the $8$ dots would be wrong.",
        "某点图在 $2$ 处有 $1$ 个点，$4$ 处 $3$ 个，$6$ 处 $3$ 个，$8$ 处 $1$ 个，共 $8$ 个点，和是 $40$，所以平均数是 $5$。到 $5$ 的距离是 $3$（一次）、$1$（三次）、$1$（三次）和 $3$（一次），总和是 $3 + 3 + 3 + 3 = 12$。平均绝对偏差是 $12 \\div 8 = 1.5$。如果除以叠数 $4$ 而不是点数 $8$，就错了。",
      ),
      figure: dotPlotFigure([2, 4, 4, 4, 6, 6, 6, 8], { min: 0, max: 10, step: 1 }),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        for (;;) {
          const n = rng.pick([4, 5, 8, 10]);
          const span = rng.int(6, 8);
          const xs = integerMean(rng, n, lo, lo + span);
          const axis = { min: lo, max: lo + span, step: 1 };
          const m = Number(mean(xs).n);
          const d = mad(xs);
          if (d.isZero()) continue;
          const counts = [...new Set(sorted(xs))].map((v) => [v, xs.filter((x) => x === v).length] as const);
          const total = sum(xs.map((x) => Math.abs(x - m)));
          const terms = counts.map(([v, k]) => (k === 1 ? `${Math.abs(v - m)}` : `${Math.abs(v - m)} \\times ${k}`)).join(" + ");
          const unweighted = Q.of(sum(counts.map(([v]) => Math.abs(v - m))), counts.length);
          return {
            ...numberProblem({
              prompt: t(`The dot plot shows ${en}. What is the mean absolute deviation?`, `点图表示${zh}。平均绝对偏差是多少？`),
              answer: d,
              form: "decimal",
              wrong: [total, ...[unweighted].filter(isTerminating), m],
              solution: t(
                `There are ${n} dots with sum $${sum(xs)}$, so the mean is $${m}$. Adding the distance of every dot from $${m}$, stack by stack:${steps(`\\text{MAD} = \\frac{${terms}}{${n}} = \\frac{${total}}{${n}} = ${dec(d)}`)}`,
                `共有 ${n} 个点，和是 $${sum(xs)}$，所以平均数是 $${m}$。逐叠加上每个点到 $${m}$ 的距离：${steps(`\\text{MAD} = \\frac{${terms}}{${n}} = \\frac{${total}}{${n}} = ${dec(d)}`)}`,
              ),
            }),
            figure: dotPlotFigure(xs, axis),
          };
        }
      },
    },
  ],
);

export const measuringQuartilesAndIqrFromDotPlots = topic(
  "measuring-quartiles-and-iqr-from-dot-plots",
  t("Measuring Quartiles and IQR From Dot Plots", "从点图求四分位数和四分位距"),
  t(
    "A dot plot lists the data in order from left to right, so the quartiles can be found by counting dots. Count all the dots, locate the median, and split the dots into a lower and an upper half, leaving the median dot out when the count is odd. Q₁ and Q₃ are the medians of the two halves, and IQR = Q₃ − Q₁.",
    "点图从左到右按顺序列出了数据，所以可以通过数点来求四分位数。先数出点的总数，找到中位数，再把点分成下半部分和上半部分；点数为奇数时，中位数那个点不计入任何一半。Q₁ 和 Q₃ 分别是两半的中位数，IQR = Q₃ − Q₁。",
  ),
  ["measuring-centrality-from-dot-plots", "range-quartiles-and-iqr"],
  ["6.SP.B.4", "6.SP.B.5.C"],
  [
    {
      id: "a-quartile-from-a-dot-plot",
      title: t("A quartile from a dot plot", "从点图求四分位数"),
      explanation: t(
        "A dot plot with $11$ dots has its median at the $6$th dot from the left. The lower half is the first $5$ dots, so $Q_1$ is the $3$rd dot; the upper half is the last $5$ dots, so $Q_3$ is the $9$th dot. Count across the stacks from left to right, and from the bottom of each stack up.",
        "有 $11$ 个点的点图，中位数是从左数第 $6$ 个点。下半部分是前 $5$ 个点，所以 $Q_1$ 是第 $3$ 个点；上半部分是后 $5$ 个点，所以 $Q_3$ 是第 $9$ 个点。从左到右逐叠地数，每一叠从下往上数。",
      ),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        const { xs, axis } = dotData(rng, lo, rng.int(9, 16), rng.int(6, 8));
        const third = rng.bool();
        const [q1, q3] = quartiles(xs);
        const [i1, i3] = inclusiveQuartiles(xs);
        const [lower, upper] = halves(xs);
        const n = xs.length;
        const name = third ? t("third quartile", "第三四分位数") : t("first quartile", "第一四分位数");
        const q = third ? q3 : q1;
        return {
          ...numberProblem({
            prompt: t(`The dot plot shows ${en}. What is the ${name.en}?`, `点图表示${zh}。${name["zh-CN"]}是多少？`),
            answer: q,
            form: "decimal",
            wrong: [third ? i3 : i1, median(xs), third ? q1 : q3],
            solution: t(
              `There are ${n} dots: ${stacks(xs).en}. The ${third ? "upper" : "lower"} half is the ${third ? "last" : "first"} ${lower.length} dots, $${list(third ? upper : lower)}$, and its median is $${third ? "Q_3" : "Q_1"} = ${dec(q)}$.`,
              `共有 ${n} 个点：${stacks(xs)["zh-CN"]}。${third ? "上" : "下"}半部分是${third ? "后" : "前"} ${lower.length} 个点 $${list(third ? upper : lower)}$，它的中位数是 $${third ? "Q_3" : "Q_1"} = ${dec(q)}$。`,
            ),
          }),
          figure: dotPlotFigure(xs, axis),
        };
      },
    },
    {
      id: "the-iqr-from-a-dot-plot",
      title: t("The interquartile range from a dot plot", "从点图求四分位距"),
      explanation: t(
        "For a dot plot with $Q_1 = 3$ and $Q_3 = 7$, the IQR is $7 - 3 = 4$: the middle half of the dots lie within a stretch of $4$ units. Find both quartiles by counting, then subtract; do not confuse the IQR with the range, which uses the end dots.",
        "如果点图的 $Q_1 = 3$，$Q_3 = 7$，那么 IQR 是 $7 - 3 = 4$：中间一半的点落在长 $4$ 个单位的范围内。先数点求出两个四分位数，再相减；不要把四分位距和用两端点计算的极差混淆。",
      ),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        for (;;) {
          const { xs, axis } = dotData(rng, lo, rng.int(9, 16), rng.int(6, 8));
          const [q1, q3] = quartiles(xs);
          const iqr = q3.sub(q1);
          if (iqr.isZero()) continue;
          const [i1, i3] = inclusiveQuartiles(xs);
          const [lower, upper] = halves(xs);
          return {
            ...numberProblem({
              prompt: t(`The dot plot shows ${en}. What is the interquartile range?`, `点图表示${zh}。四分位距是多少？`),
              answer: iqr,
              form: "decimal",
              wrong: [Math.max(...xs) - Math.min(...xs), i3.sub(i1), q3, Q.of(axis.max - axis.min, 2)],
              solution: t(
                `There are ${xs.length} dots: ${stacks(xs).en}. The lower half $${list(lower)}$ gives $Q_1 = ${dec(q1)}$, and the upper half $${list(upper)}$ gives $Q_3 = ${dec(q3)}$:${steps(`\\text{IQR} = ${dec(q3)} - ${dec(q1)} = ${dec(iqr)}`)}`,
                `共有 ${xs.length} 个点：${stacks(xs)["zh-CN"]}。下半部分 $${list(lower)}$ 得 $Q_1 = ${dec(q1)}$，上半部分 $${list(upper)}$ 得 $Q_3 = ${dec(q3)}$：${steps(`\\text{IQR} = ${dec(q3)} - ${dec(q1)} = ${dec(iqr)}`)}`,
              ),
            }),
            figure: dotPlotFigure(xs, axis),
          };
        }
      },
    },
    {
      id: "the-five-number-summary-from-a-dot-plot",
      title: t("The five-number summary from a dot plot", "从点图求五数概括"),
      explanation: t(
        "The five-number summary of a dot plot is the leftmost dot, $Q_1$, the median, $Q_3$ and the rightmost dot. It is what a box plot of the same data would show.",
        "点图的五数概括是最左边的点、$Q_1$、中位数、$Q_3$ 和最右边的点。它正是同一组数据的箱线图所显示的内容。",
      ),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        for (;;) {
          const { xs, axis } = dotData(rng, lo, rng.pick([9, 11, 13, 15]), rng.int(7, 9));
          const s = sorted(xs);
          const [q1, q3] = quartiles(xs);
          const [i1, i3] = inclusiveQuartiles(xs);
          const med = median(xs);
          const [min, max] = [Q.of(s[0]!), Q.of(s[s.length - 1]!)];
          const correct = fiveNumbers([min, q1, med, q3, max]);
          const wrong = [
            fiveNumbers([min, i1, med, i3, max]),
            fiveNumbers([Q.of(axis.min), q1, med, q3, Q.of(axis.max)]),
            fiveNumbers([min, q1, Q.of(axis.min + axis.max, 2), q3, max]),
            fiveNumbers([min, Q.of(s[1]!), med, Q.of(s[s.length - 2]!), max]),
          ];
          if (new Set(wrong.map((w) => w.en).filter((w) => w !== correct.en)).size < 2) continue;
          return pickChoice(
            rng,
            t(`The dot plot shows ${en}. What is the five-number summary of the data?`, `点图表示${zh}。这组数据的五数概括是什么？`),
            correct,
            wrong,
            t(
              `There are ${xs.length} dots: ${stacks(xs).en}. The least value is $${s[0]}$, the greatest $${s[s.length - 1]}$, and the median $${dec(med)}$. The lower half gives $Q_1 = ${dec(q1)}$ and the upper half $Q_3 = ${dec(q3)}$.`,
              `共有 ${xs.length} 个点：${stacks(xs)["zh-CN"]}。最小值是 $${s[0]}$，最大值是 $${s[s.length - 1]}$，中位数是 $${dec(med)}$。下半部分得 $Q_1 = ${dec(q1)}$，上半部分得 $Q_3 = ${dec(q3)}$。`,
            ),
            dotPlotFigure(xs, axis),
          );
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Shape

/** Shape is the shape of a distribution. */
type Shape = "symmetric" | "left" | "right";

/** shapeOptions are the shapes to choose from, in the order of shapes. */
const shapeOptions: readonly Text[] = [t("Symmetric", "对称"), t("Skewed left", "左偏"), t("Skewed right", "右偏")];

/** shapes are the shapes in the order of shapeOptions. */
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

/** comparisonOptions are the answers to "which is greater, the mean or the median?". */
const comparisonOptions: readonly Text[] = [t("The mean", "平均数"), t("The median", "中位数"), t("They are equal", "两者相等")];

export const symmetrySkewAndOutliers = topic(
  "symmetry-skew-and-outliers",
  t("Symmetry, Skew, and Outliers", "对称、偏斜与离群值"),
  t(
    "The shape of a distribution is part of its description. Data are symmetric when the two sides of the plot are mirror images; skewed right when most values are at the left with a long tail to the right; skewed left when the tail stretches to the left. The tail pulls the mean toward it, so in right-skewed data the mean is greater than the median, and in left-skewed data it is less. An outlier is a value far from the rest, often separated by a gap.",
    "分布的形状是描述数据的一部分。图形两侧互为镜像时，数据是对称的；大多数数据在左侧、长尾拖向右边时，数据右偏；长尾拖向左边时，数据左偏。长尾会把平均数拉向它，所以右偏数据的平均数大于中位数，左偏数据的平均数小于中位数。离群值是远离其余数据的值，常常与其他数据隔着一段空白。",
  ),
  ["measuring-centrality-from-dot-plots", "comparing-measures-of-center"],
  ["6.SP.A.2", "6.SP.B.4", "6.SP.B.5.D"],
  [
    {
      id: "describing-the-shape",
      title: t("Describing the shape", "描述形状"),
      explanation: t(
        "A skew is named after its **tail**, not its peak. If most dots are piled at the left and a thin tail of dots runs off to the right, the data are skewed right. If the pile is at the right and the tail runs left, they are skewed left. If folding the plot at the middle would make the two sides match, the data are symmetric.",
        "偏斜是按**长尾**的方向命名的，而不是按峰的位置。如果大多数点堆在左边，一条稀疏的尾巴拖向右边，数据就是右偏；如果点堆在右边，尾巴拖向左边，就是左偏。如果沿中间对折后两侧重合，数据就是对称的。",
      ),
      figure: dotPlotFigure([1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7], { min: 0, max: 8, step: 1 }),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        const shape = rng.pick(shapes);
        const xs = shapedData(rng, lo, shape);
        return {
          ...choiceProblem({
            prompt: t(
              `The dot plot shows ${en}. Which best describes the shape of the data?`,
              `点图表示${zh}。哪一项最能描述这组数据的形状？`,
            ),
            options: shapeOptions,
            correct: shapes.indexOf(shape),
            solution: t(`${skewWords[shape].en}.`, `${skewWords[shape]["zh-CN"]}。`),
          }),
          figure: dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }),
        };
      },
    },
    {
      id: "skew-and-the-mean-and-median",
      title: t("Skew and the mean and median", "偏斜与平均数、中位数"),
      explanation: t(
        "The dot plot of the previous step is skewed right. Its median is $3$, but its mean is $\\frac{59}{18} \\approx 3.3$: the dots in the tail at $5$, $6$ and $7$ pull the mean to the right of the median. In left-skewed data the mean is to the left of the median, and in symmetric data the two are equal.",
        "上一步的点图是右偏的。它的中位数是 $3$，而平均数是 $\\frac{59}{18} \\approx 3.3$：尾部 $5$、$6$、$7$ 处的点把平均数拉到了中位数的右边。左偏数据的平均数在中位数左边，对称数据的平均数与中位数相等。",
      ),
      generate(rng) {
        const [en, zh, lo] = rng.pick(dotContexts);
        const shape = rng.pick(shapes);
        const xs = shapedData(rng, lo, shape);
        const m = mean(xs);
        const med = median(xs);
        const correct = shape === "right" ? 0 : shape === "left" ? 1 : 2;
        const verdict = [t("the mean is greater", "平均数更大"), t("the median is greater", "中位数更大"), t("they are equal", "两者相等")][
          correct
        ]!;
        return {
          ...choiceProblem({
            prompt: t(`The dot plot shows ${en}. Which is greater, the mean or the median?`, `点图表示${zh}。平均数和中位数哪个更大？`),
            options: comparisonOptions,
            correct,
            solution: t(
              `${skewWords[shape].en}. ${shape === "symmetric" ? "Matching values on the two sides balance, so" : "The tail pulls the mean toward it:"} the median is $${dec(med)}$ and the mean is $\\frac{${sum(xs)}}{${xs.length}} ${about(m)}$, so ${verdict.en}.`,
              `${skewWords[shape]["zh-CN"]}。${shape === "symmetric" ? "两侧对应的值相互平衡，" : "长尾把平均数拉向它："}中位数是 $${dec(med)}$，平均数是 $\\frac{${sum(xs)}}{${xs.length}} ${about(m)}$，所以${verdict["zh-CN"]}。`,
            ),
          }),
          figure: dotPlotFigure(xs, { min: lo, max: lo + 8, step: 1 }),
        };
      },
    },
    {
      id: "an-outlier-in-a-dot-plot",
      title: t("An outlier in a dot plot", "点图中的离群值"),
      explanation: t(
        "In a dot plot an outlier usually stands apart, with a gap between it and the other dots. Confirm it with the $1.5 \\times \\text{IQR}$ rule: find $Q_1$ and $Q_3$ by counting dots, and check whether the value lies beyond $Q_1 - 1.5 \\times \\text{IQR}$ or $Q_3 + 1.5 \\times \\text{IQR}$.",
        "在点图中，离群值通常孤立在一旁，与其他点之间隔着一段空白。用 $1.5 \\times \\text{IQR}$ 法则来确认：数点求出 $Q_1$ 和 $Q_3$，再看这个值是否小于 $Q_1 - 1.5 \\times \\text{IQR}$ 或大于 $Q_3 + 1.5 \\times \\text{IQR}$。",
      ),
      generate(rng) {
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
          const [q1, q3] = quartiles(xs);
          const iqr = q3.sub(q1);
          const k = iqr.mul(Q.of(3, 2));
          const counts = [...new Set(cluster)].map((v) => [v, cluster.filter((x) => x === v).length] as const);
          const mode = counts.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
          return {
            ...numberProblem({
              prompt: t(`The dot plot shows ${en}. Which value is an outlier?`, `点图表示${zh}。哪个值是离群值？`),
              answer: extreme,
              form: "integer",
              wrong: [high ? Math.max(...cluster) : Math.min(...cluster), mode, high ? Math.min(...cluster) : Math.max(...cluster)],
              solution: t(
                `The value $${extreme}$ stands apart from the other dots. Counting dots gives $Q_1 = ${dec(q1)}$, $Q_3 = ${dec(q3)}$ and $\\text{IQR} = ${dec(iqr)}$, so the fences are $${dec(q1.sub(k))}$ and $${dec(q3.add(k))}$. Only $${extreme}$ lies outside them.`,
                `$${extreme}$ 与其他点隔开。数点得 $Q_1 = ${dec(q1)}$，$Q_3 = ${dec(q3)}$，$\\text{IQR} = ${dec(iqr)}$，所以两个界限是 $${dec(q1.sub(k))}$ 和 $${dec(q3.add(k))}$。只有 $${extreme}$ 落在界限之外。`,
              ),
            }),
            figure: dotPlotFigure(xs, { min: lo, max: lo + 10, step: 1 }),
          };
        }
      },
    },
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
