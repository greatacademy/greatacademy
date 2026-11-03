import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { Axis, FiveNumberSummary } from "@ga/subject-math";
import { boxPlot, dec, dotPlot, Q, svgDocument } from "@ga/subject-math";

import { isTerminating, numberProblem, steps, yesNo } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 7th Grade Math, statistics: estimating from samples, bias, survey results and margins of error,
// joint and cumulative frequency tables, the mean, median and mode of tabulated and grouped data,
// and comparing two data sets by their centers, spreads and overlap.

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
export const list = (xs: readonly (number | string)[]) => xs.join(", ");

/** sorted returns the values from least to greatest. */
export const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);

/** sum adds the values. */
export const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

/** mean is the sum of the values divided by their number. */
export const mean = (xs: readonly number[]) => Q.of(sum(xs), xs.length);

/** median is the middle value of a data set, or the mean of the two middle values. */
export function median(xs: readonly number[]): Q {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? Q.of(s[h]!) : Q.of(s[h - 1]! + s[h]!, 2);
}

/** clean tells whether a number has at most two decimal places. */
export const clean = (q: Q) => q.mul(Q.of(100)).isInteger();

/** expand lists every value as many times as its frequency. */
export const expand = (values: readonly number[], freqs: readonly number[]) =>
  values.flatMap((v, i) => Array.from({ length: freqs[i]! }, () => v));

/** mdTable writes a Markdown table from a header row and body rows. */
export function mdTable(header: readonly string[], rows: readonly (readonly string[])[]): string {
  const line = (cells: readonly string[]) => `| ${cells.join(" | ")} |`;
  return `\n\n${line(header)}\n|${header.map(() => " :--- |").join("")}\n${rows.map(line).join("\n")}\n\n`;
}

/** m writes a number as inline math: "$12$". */
export const m = (v: number | string) => `$${v}$`;

// ---------------------------------------------------------------------------
// Grouped data

/** Grouping is a kind of measurement collected in classes of equal width. */
interface Grouping {
  /** what is what was measured, for the prompt: "the times, in minutes, that 30 students took to get to school". */
  readonly what: (n: number) => Text;
  /** variable is the letter for a measurement, and unit its unit. */
  readonly variable: string;
  readonly unit: string;
  readonly header: Text;
  /** total names the sum of all the measurements. */
  readonly total: Text;
  readonly starts: readonly number[];
  readonly widths: readonly number[];
}

const groupings: readonly Grouping[] = [
  {
    what: (n) => t(`the times, in minutes, that ${n} students took to get to school`, `${n} 名学生上学路上所用的时间（分钟）`),
    variable: "t",
    unit: "min",
    header: t("Time $t$ (min)", "时间 $t$（分钟）"),
    total: t("the total of all the times", "所有时间的总和"),
    starts: [0, 5, 10],
    widths: [5, 10],
  },
  {
    what: (n) => t(`the heights, in centimeters, of ${n} bean plants`, `${n} 株豆苗的高度（厘米）`),
    variable: "h",
    unit: "cm",
    header: t("Height $h$ (cm)", "高度 $h$（厘米）"),
    total: t("the total of all the heights", "所有高度的总和"),
    starts: [10, 20, 30],
    widths: [5, 10],
  },
  {
    what: (n) => t(`the masses, in grams, of ${n} apples`, `${n} 个苹果的质量（克）`),
    variable: "m",
    unit: "g",
    header: t("Mass $m$ (g)", "质量 $m$（克）"),
    total: t("the total mass of all the apples", "所有苹果的总质量"),
    starts: [100, 120, 150],
    widths: [10, 20],
  },
  {
    what: (n) => t(`the distances, in meters, that ${n} students threw a ball`, `${n} 名学生掷球的距离（米）`),
    variable: "d",
    unit: "m",
    header: t("Distance $d$ (m)", "距离 $d$（米）"),
    total: t("the total of all the distances", "所有距离的总和"),
    starts: [5, 10, 20],
    widths: [5, 10],
  },
];

/** Grouped is a grouped frequency distribution: the edges of its classes and their frequencies. */
interface Grouped {
  readonly g: Grouping;
  readonly edges: number[];
  readonly freqs: number[];
  readonly n: number;
}

/** grouped draws a story, four or five classes of equal width, and their frequencies. */
function grouped(rng: Rng, classes = rng.int(4, 5)): Grouped {
  const g = rng.pick(groupings);
  const start = rng.pick(g.starts);
  const w = rng.pick(g.widths);
  const edges = Array.from({ length: classes + 1 }, (_, i) => start + i * w);
  // A hump in the middle, as real measurements tend to have.
  const peak = rng.int(1, classes - 2);
  const freqs = Array.from({ length: classes }, (_, i) => Math.max(1, rng.int(8, 14) - 3 * Math.abs(i - peak) + rng.int(-2, 2)));
  return { g, edges, freqs, n: sum(freqs) };
}

/** classTex writes a class of grouped data: "10 \le t < 20". */
const classTex = (g: Grouping, a: number, b: number) => `${a} \\le ${g.variable} < ${b}`;

/** groupedTable writes a grouped frequency table. */
function groupedTable(d: Grouped): Text {
  const rows = (lang: "en" | "zh-CN") =>
    mdTable(
      [d.g.header[lang], lang === "en" ? "Frequency" : "频数"],
      d.freqs.map((f, i) => [m(classTex(d.g, d.edges[i]!, d.edges[i + 1]!)), m(f)]),
    );
  return t(rows("en"), rows("zh-CN"));
}

/** midpoints are the middles of the classes. */
const midpoints = (d: Grouped) => d.freqs.map((_, i) => Q.of(d.edges[i]! + d.edges[i + 1]!, 2));

/** classOf is the index of the class that holds the k-th value, counting from 1. */
function classOf(freqs: readonly number[], k: number): number {
  let seen = 0;
  for (const [i, f] of freqs.entries()) {
    seen += f;
    if (k <= seen) return i;
  }
  return freqs.length - 1;
}

/** histogramSvg draws bars over consecutive classes of equal width, with the class edges below and a frequency scale on the left. */
export function histogramSvg(edges: readonly number[], freqs: readonly number[]): string {
  const top = Math.max(...freqs);
  // A gridline at every whole number, so each bar height can be read exactly; labels every step.
  const step = top <= 12 ? 2 : 5;
  const max = Math.ceil(top / step) * step;
  const [x0, x1, y0, y1] = [44, 304, 170, 14];
  const r = (v: number) => Math.round(v * 10) / 10;
  const x = (i: number) => r(x0 + (i / freqs.length) * (x1 - x0));
  const y = (f: number) => r(y0 - (f / max) * (y0 - y1));
  let out = "";
  for (const [i, f] of freqs.entries())
    out += `<rect class="accent" x="${x(i)}" y="${y(f)}" width="${x(i + 1) - x(i)}" height="${r(y0 - y(f))}" fill="currentColor" fill-opacity="0.25"/>`;
  for (let k = 1; k <= max; k++)
    out += `<line x1="${x0}" y1="${y(k)}" x2="${x1}" y2="${y(k)}" stroke-width="${k % step === 0 ? 0.6 : 0.3}" stroke-dasharray="2 2"/>`;
  for (let k = 0; k <= max; k += step)
    out += `<line x1="${x0 - 4}" y1="${y(k)}" x2="${x0}" y2="${y(k)}"/><text x="${x0 - 8}" y="${y(k) + 4}" text-anchor="end">${k}</text>`;
  out += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1 - 6}"/>`;
  for (const [i, e] of edges.entries()) out += `<text x="${x(i)}" y="${y0 + 18}">${e}</text>`;
  return svgDocument(y0 + 26, out);
}

/** histogramFigure draws grouped data as a histogram, with alt text giving each bar. */
function histogramFigure(d: Grouped): Figure {
  const bars = d.freqs.map((f, i) => [d.edges[i]!, d.edges[i + 1]!, f] as const);
  return {
    svg: histogramSvg(d.edges, d.freqs),
    alt: t(
      `Histogram: ${bars.map(([a, b, f]) => `${f} from ${a} to ${b}`).join(", ")}.`,
      `直方图：${bars.map(([a, b, f]) => `${a} 到 ${b} 有 ${f} 个`).join("，")}。`,
    ),
  };
}

// ---------------------------------------------------------------------------
// Sampling

/** Sampled is a survey of a population: who is asked, where, the question, and the range of answers. */
interface Sampled {
  readonly units: Text;
  readonly population: Text;
  /** all names the whole population: "all the students at the school". */
  readonly all: Text;
  readonly question: Text;
  /** total names the sum of the answers of a population of N: "the total number of books read by all 300 students". */
  readonly total: (n: number) => Text;
  readonly lo: number;
  readonly hi: number;
}

const sampled: readonly Sampled[] = [
  {
    units: t("students", "名学生"),
    population: t("at a school", "某校"),
    all: t("all the students at the school", "该校全体学生"),
    question: t("how many books they read over the summer", "暑假读了几本书"),
    total: (n) => t(`the total number of books read by all ${n} students`, `全部 ${n} 名学生读书的总本数`),
    lo: 0,
    hi: 9,
  },
  {
    units: t("households", "户人家"),
    population: t("in a town", "某镇"),
    all: t("all the households in the town", "该镇所有人家"),
    question: t("how many people live in their home", "家里住了几个人"),
    total: (n) => t(`the total number of people living in all ${n} households`, `全部 ${n} 户人家的总人数`),
    lo: 1,
    hi: 7,
  },
  {
    units: t("members", "名会员"),
    population: t("of a gym", "某健身房"),
    all: t("all the members of the gym", "该健身房全体会员"),
    question: t("how many times they exercised last week", "上周锻炼了几次"),
    total: (n) => t(`the total number of times all ${n} members exercised last week`, `全部 ${n} 名会员上周锻炼的总次数`),
    lo: 0,
    hi: 7,
  },
  {
    units: t("employees", "名员工"),
    population: t("of a company", "某公司"),
    all: t("all the employees of the company", "该公司全体员工"),
    question: t("how many cups of coffee they drink a day", "每天喝几杯咖啡"),
    total: (n) => t(`the total number of cups of coffee all ${n} employees drink a day`, `全部 ${n} 名员工每天喝咖啡的总杯数`),
    lo: 0,
    hi: 5,
  },
];

/** estimationFromSamples estimates means, totals and proportions of a population from random samples. */
export const estimationFromSamples = topic(
  "estimation-from-samples",
  t("Estimation From Samples", "用样本估计"),
  t(
    "A random sample tends to look like its population, so a measure of the sample estimates the same measure of the population: the sample mean estimates the population mean, and a proportion in the sample estimates the proportion in the population. Different samples give somewhat different estimates; averaging several of them gives a better one.",
    "随机样本往往与总体相似，所以样本的统计量可以估计总体的同一个量：样本平均数估计总体平均数，样本中的比例估计总体中的比例。不同的样本给出的估计会有所不同；把几个样本的估计取平均，估计会更好。",
  ),
  ["sampling", "the-mean-of-a-data-set"],
  ["7.SP.A.2"],
  [
    {
      id: "estimating-a-population-mean",
      title: t("Estimating a population mean", "估计总体平均数"),
      explanation: t(
        "To estimate the mean of a population, find the mean of a random sample. If $8$ randomly chosen students read $3, 5, 0, 2, 4, 6, 1, 3$ books over the summer, the sample mean is\n\n$$\\frac{3 + 5 + 0 + 2 + 4 + 6 + 1 + 3}{8} = \\frac{24}{8} = 3,$$\n\nso students at the school read about $3$ books each. Divide by the number of values in the sample, counting the zeros.",
        "要估计总体的平均数，就求随机样本的平均数。随机选出的 $8$ 名学生暑假分别读了 $3, 5, 0, 2, 4, 6, 1, 3$ 本书，样本平均数是\n\n$$\\frac{3 + 5 + 0 + 2 + 4 + 6 + 1 + 3}{8} = \\frac{24}{8} = 3,$$\n\n所以该校学生平均每人约读 $3$ 本书。要除以样本中数据的个数，$0$ 也要算在内。",
      ),
      generate(rng) {
        const s = rng.pick(sampled);
        for (;;) {
          const n = rng.pick([8, 10, 12, 16, 20]);
          const xs = Array.from({ length: n }, () => rng.int(s.lo, s.hi));
          const mu = mean(xs);
          if (!clean(mu)) continue;
          const nonzero = xs.filter((x) => x !== 0).length;
          return numberProblem({
            prompt: t(
              `A random sample of ${n} ${s.units.en} ${s.population.en} were asked ${s.question.en}. Their answers were $${list(xs)}$. Estimate the mean answer of ${s.all.en}.`,
              `从${s.population["zh-CN"]}随机抽取 ${n} ${s.units["zh-CN"]}，询问他们${s.question["zh-CN"]}。回答分别是 $${list(xs)}$。估计${s.all["zh-CN"]}的平均回答。`,
            ),
            answer: mu,
            form: "decimal",
            wrong: [median(xs), ...(nonzero < n ? [Q.of(sum(xs), nonzero)] : []), Q.of(sum(xs), n - 1)].filter(isTerminating),
            solution: t(
              `The sample mean estimates the population mean:${steps(`\\frac{${xs.join(" + ")}}{${n}} = \\frac{${sum(xs)}}{${n}} = ${dec(mu)}`)}`,
              `用样本平均数估计总体平均数：${steps(`\\frac{${xs.join(" + ")}}{${n}} = \\frac{${sum(xs)}}{${n}} = ${dec(mu)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "estimating-a-population-total",
      title: t("Estimating a population total", "估计总体的总量"),
      explanation: t(
        "A sample mean also estimates a total. If a random sample of $10$ households has $28$ people in all, the mean is $2.8$ people per household, so the $1500$ households of the town have about\n\n$$2.8 \\times 1500 = 4200 \\text{ people}.$$\n\nMultiply the population size by the sample mean, not by the sample total.",
        "样本平均数也可以用来估计总量。随机抽取 $10$ 户人家，共有 $28$ 人，平均每户 $2.8$ 人，所以全镇 $1500$ 户人家大约有\n\n$$2.8 \\times 1500 = 4200 \\text{ 人}.$$\n\n要用总体数量乘样本平均数，而不是乘样本总和。",
      ),
      generate(rng) {
        const s = rng.pick(sampled);
        for (;;) {
          const n = rng.pick([8, 10, 12, 15, 20, 25]);
          const xs = Array.from({ length: n }, () => rng.int(s.lo, s.hi));
          const mu = mean(xs);
          const pop = rng.pick([200, 300, 400, 600, 800, 1200, 1500, 2000]);
          const total = mu.mul(Q.of(pop));
          if (!total.isInteger() || !clean(mu)) continue;
          return numberProblem({
            prompt: t(
              `A random sample of ${n} of the ${pop} ${s.units.en} ${s.population.en} were asked ${s.question.en}. Their answers were $${list(xs)}$. Estimate ${s.total(pop).en}.`,
              `从${s.population["zh-CN"]}的 ${pop} ${s.units["zh-CN"]}中随机抽取 ${n} ${s.units["zh-CN"]}，询问他们${s.question["zh-CN"]}。回答分别是 $${list(xs)}$。估计${s.total(pop)["zh-CN"]}。`,
            ),
            answer: total,
            form: "integer",
            wrong: [sum(xs) * pop, mu, Q.of(sum(xs) + pop)],
            solution: t(
              `The sample mean is $\\frac{${sum(xs)}}{${n}} = ${dec(mu)}$. Each of the ${pop} ${s.units.en} counts for about that much:${steps(`${dec(mu)} \\times ${pop} = ${total.toLatex()}`)}`,
              `样本平均数是 $\\frac{${sum(xs)}}{${n}} = ${dec(mu)}$。${pop} ${s.units["zh-CN"]}中每一个大约都按这么多计算：${steps(`${dec(mu)} \\times ${pop} = ${total.toLatex()}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "combining-several-samples",
      title: t("Combining several samples", "综合几个样本"),
      explanation: t(
        "Four random samples of $50$ students were asked whether they ride the bus, and $12, 15, 9, 14$ said yes. The samples vary, so average them: the mean count is $\\frac{12 + 15 + 9 + 14}{4} = 12.5$ out of $50$, or $\\frac{12.5}{50} = 25\\%$. Of the $1200$ students in the school, about $0.25 \\times 1200 = 300$ ride the bus.",
        "随机抽取 $4$ 个各有 $50$ 名学生的样本，询问是否坐校车，回答“是”的分别有 $12, 15, 9, 14$ 人。样本之间有差异，所以取平均：平均人数是 $\\frac{12 + 15 + 9 + 14}{4} = 12.5$，占 $50$ 人的 $\\frac{12.5}{50} = 25\\%$。全校 $1200$ 名学生中，约有 $0.25 \\times 1200 = 300$ 人坐校车。",
      ),
      generate(rng) {
        const [en, zh] = rng.pick([
          ["ride the bus to school", "坐校车上学"],
          ["play a musical instrument", "会演奏乐器"],
          ["have a pet", "养宠物"],
          ["bring lunch from home", "从家里带午饭"],
        ] as const);
        for (;;) {
          const k = rng.int(3, 5);
          const n = rng.pick([20, 25, 40, 50]);
          const counts = Array.from({ length: k }, () => rng.int(Math.floor(n * 0.15), Math.floor(n * 0.6)));
          const pop = rng.pick([400, 500, 600, 800, 1000, 1200, 1500, 2000]);
          const answer = Q.of(sum(counts) * pop, k * n);
          const avg = Q.of(sum(counts), k);
          if (!answer.isInteger() || !clean(avg)) continue;
          return numberProblem({
            prompt: t(
              `The students in each of ${k} random samples of ${n} students were asked whether they ${en}. The numbers who said yes in the samples were $${list(counts)}$. Use the mean of the samples to estimate how many of the ${pop} students in the school ${en}.`,
              `随机抽取 ${k} 个样本，每个样本 ${n} 名学生，询问他们是否${zh}。回答“是”的人数分别是 $${list(counts)}$。用这些样本的平均数估计全校 ${pop} 名学生中有多少人${zh}。`,
            ),
            answer,
            form: "integer",
            // One sample only, the counts added without averaging, and the average used as the estimate.
            wrong: [Q.of(counts[0]! * pop, n), Q.of(sum(counts) * pop, n), avg],
            solution: t(
              `The mean number of yes answers per sample is $\\frac{${counts.join(" + ")}}{${k}} = ${dec(avg)}$ out of ${n}. Scale up to the school:${steps(`\\frac{${dec(avg)}}{${n}} \\times ${pop} = ${answer.toLatex()}`)}`,
              `每个样本中回答“是”的平均人数是 $\\frac{${counts.join(" + ")}}{${k}} = ${dec(avg)}$（共 ${n} 人）。按比例推广到全校：${steps(`\\frac{${dec(avg)}}{${n}} \\times ${pop} = ${answer.toLatex()}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** Bias is a reason a sample does not represent its population. */
type Bias = "excluded" | "volunteer" | "leading" | "none";

const biasReasons: Record<Bias, Text> = {
  excluded: t("Part of the population has no chance of being chosen.", "总体中有一部分人根本不可能被选中。"),
  volunteer: t("The people in the sample chose themselves.", "样本中的人是自己选择参与的。"),
  leading: t("The question pushes people toward one answer.", "问题的问法会引导人们给出某种回答。"),
  none: t("The sample is not biased.", "这个样本没有偏差。"),
};

/** commas writes a whole number in English with thousands separators: "1,200". */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ",");

/** Study is a survey question about a population of N, with ways to choose a sample of n of its members. */
interface Study {
  readonly goal: (N: number) => Text;
  readonly methods: (n: number) => readonly (readonly [Bias, Text])[];
}

const studies: readonly Study[] = [
  {
    goal: (N) =>
      t(
        `A school of ${commas(N)} students wants to know how its students feel about a later start time.`,
        `一所有 ${N} 名学生的学校想了解学生对推迟上学时间的看法。`,
      ),
    methods: (n) => [
      ["none", t(`Survey ${n} students picked at random from the list of all students.`, `从全体学生名单中随机抽取 ${n} 名学生调查。`)],
      ["excluded", t(`Survey ${n} students as they arrive for the early-morning math club.`, `在早晨数学兴趣小组到校时调查 ${n} 名学生。`)],
      ["volunteer", t("Put a link on the school website and count the replies.", "在学校网站上放一个链接，统计回复。")],
      [
        "leading",
        t(
          `Ask ${n} random students: “Don’t you agree that waking up early is bad for your health?”`,
          `随机问 ${n} 名学生：“你难道不同意早起有害健康吗？”`,
        ),
      ],
    ],
  },
  {
    goal: (N) =>
      t(
        `A town of ${commas(N)} households wants to know how many of its residents would use a new library.`,
        `一个有 ${N} 户人家的镇想了解有多少居民会使用新图书馆。`,
      ),
    methods: (n) => [
      ["none", t(`Call ${n} households chosen at random from all addresses in the town.`, `从镇上所有地址中随机选 ${n} 户打电话询问。`)],
      ["excluded", t(`Ask ${n} people leaving the old library.`, `询问 ${n} 名从旧图书馆出来的人。`)],
      ["volunteer", t("Print a form in the newspaper for readers to mail back.", "在报纸上刊登一张表格，请读者寄回。")],
      [
        "leading",
        t(
          `Ask ${n} random residents: “Wouldn’t a beautiful new library make our town better?”`,
          `随机问 ${n} 名居民：“一座漂亮的新图书馆难道不会让我们的镇更好吗？”`,
        ),
      ],
    ],
  },
  {
    goal: (N) =>
      t(`A gym with ${commas(N)} members wants to know how satisfied its members are.`, `一家有 ${N} 名会员的健身房想了解会员的满意程度。`),
    methods: (n) => [
      ["none", t(`Email a survey to ${n} members chosen at random from the member list.`, `从会员名单中随机选 ${n} 名会员发邮件调查。`)],
      ["excluded", t(`Survey the first ${n} members who come in on Monday at 6 a.m.`, `调查周一早上 6 点最先来健身的 ${n} 名会员。`)],
      ["volunteer", t("Leave a box at the front desk for anyone who wants to comment.", "在前台放一个意见箱，谁想提意见都可以投。")],
      [
        "leading",
        t(`Ask ${n} random members: “How much do you love our new equipment?”`, `随机问 ${n} 名会员：“你有多喜欢我们的新器材？”`),
      ],
    ],
  },
  {
    goal: (N) =>
      t(
        `A city with ${commas(N)} licensed drivers wants to know what share of them support a new toll road.`,
        `一座有 ${N} 名持证司机的城市想了解其中有多少比例支持修建新的收费公路。`,
      ),
    methods: (n) => [
      [
        "none",
        t(`Survey ${n} people chosen at random from the city’s list of licensed drivers.`, `从全市持证司机名单中随机抽取 ${n} 人调查。`),
      ],
      ["excluded", t(`Survey ${n} people waiting at a bus stop.`, `调查在公交车站等车的 ${n} 人。`)],
      ["volunteer", t("Run an online poll on a radio station’s website.", "在一家电台的网站上发起网络投票。")],
      [
        "leading",
        t(
          `Ask ${n} random drivers: “Should drivers be forced to pay for yet another road?”`,
          `随机问 ${n} 名司机：“司机难道还要被迫为又一条路掏钱吗？”`,
        ),
      ],
    ],
  },
  {
    goal: (N) =>
      t(
        `The cafeteria of a school of ${commas(N)} students wants to know which new lunch dish students would order most.`,
        `一所有 ${N} 名学生的学校，食堂想了解学生最想点哪道新午餐菜品。`,
      ),
    methods: (n) => [
      ["none", t(`Ask ${n} students chosen at random from the school roll.`, `从全校学生名册中随机抽取 ${n} 名学生询问。`)],
      ["excluded", t(`Ask ${n} students on the school’s vegetarian club list.`, `询问学校素食社团名单上的 ${n} 名学生。`)],
      ["volunteer", t("Put a suggestion box by the lunch line.", "在打饭的队伍旁放一个建议箱。")],
      [
        "leading",
        t(
          `Ask ${n} random students: “Wouldn’t you rather have tasty pizza than plain soup?”`,
          `随机问 ${n} 名学生：“比起清淡的汤，你难道不更想吃美味的比萨吗？”`,
        ),
      ],
    ],
  },
  {
    goal: (N) =>
      t(
        `A park service wants to know how often the ${commas(N)} households of a county visit its parks.`,
        `公园管理处想了解某县 ${N} 户人家去公园的频率。`,
      ),
    methods: (n) => [
      [
        "none",
        t(
          `Mail a survey to ${n} addresses chosen at random from the county’s list of all homes.`,
          `从全县住户名单中随机选 ${n} 个地址寄出调查问卷。`,
        ),
      ],
      ["excluded", t(`Ask ${n} people on the walking trails one Saturday.`, `某个星期六询问步道上的 ${n} 个人。`)],
      ["volunteer", t("Post the survey on the park service’s social media page.", "把调查问卷发在公园管理处的社交媒体主页上。")],
      [
        "leading",
        t(
          `Ask ${n} random residents: “How often do you enjoy our wonderful, award-winning parks?”`,
          `随机问 ${n} 名居民：“你多久去享受一次我们获奖的美丽公园？”`,
        ),
      ],
    ],
  },
];

/** biasedAndUnbiasedSamples tells representative samples from biased ones and names the bias. */
export const biasedAndUnbiasedSamples = topic(
  "biased-and-unbiased-samples",
  t("Biased and Unbiased Samples", "有偏样本与无偏样本"),
  t(
    "A sample is unbiased when every member of the population has the same chance of being in it and the question is asked neutrally; only then does it represent the population. A sample is biased when part of the population cannot be chosen, when people choose themselves, or when the question pushes toward an answer.",
    "如果总体中每个成员被选入样本的机会都相同，而且问题的问法是中立的，样本就是无偏的；只有这样，它才能代表总体。如果总体中有一部分人不可能被选中，或者样本中的人是自己选择参与的，或者问题引导人们给出某种回答，样本就是有偏的。",
  ),
  ["sampling"],
  ["7.SP.A.1"],
  [
    {
      id: "choosing-a-representative-sample",
      title: t("Choosing a representative sample", "选出有代表性的样本"),
      explanation: t(
        "To learn how all students feel about a later start time, choose students at random from the list of all students. Surveying only the early-morning club leaves out everyone else, and those members may well like early starts. A link on the website collects only the students who care enough to answer.",
        "要了解全体学生对推迟上学时间的看法，应该从全体学生名单中随机抽取。只调查早晨兴趣小组会遗漏其他所有学生，而这些成员很可能本来就喜欢早到校。网站上的链接只能收集到那些足够在意、愿意回复的学生的意见。",
      ),
      generate(rng) {
        const s = rng.pick(studies);
        const goal = s.goal(rng.pick([800, 1200, 1500, 2400, 3000, 5000]));
        const methods = s.methods(rng.pick([40, 50, 60, 80, 100, 120, 150, 200]));
        const correct = methods.find(([b]) => b === "none")![1];
        return pickChoice(
          rng,
          t(`${goal.en} Which method gives a sample that represents the population?`, `${goal["zh-CN"]}哪种方法得到的样本能代表总体？`),
          correct,
          methods.filter(([b]) => b !== "none").map(([, m]) => m),
          t(
            "Only choosing at random from the whole population gives every member the same chance of being in the sample, with a neutral question. The other methods leave people out, let people choose themselves, or push toward an answer.",
            "只有从整个总体中随机抽取，才能让每个成员被选中的机会相同，而且问题是中立的。其他方法要么遗漏了一部分人，要么让人们自己选择是否参与，要么引导回答。",
          ),
        );
      },
    },
    {
      id: "naming-the-bias",
      title: t("Naming the bias", "说出偏差的原因"),
      explanation: t(
        "A sample can be biased in three common ways:\n\n- **part of the population is left out**, as when a survey about a new library asks only people leaving the old one;\n- **people choose themselves**, as with a form readers can mail back, which collects the strongest opinions;\n- **the question is leading**, as in “Wouldn’t a new library make our town better?”\n\nA random sample from the whole population with a neutral question has none of these.",
        "样本常见的偏差有三种：\n\n- **遗漏了总体的一部分**，比如调查新图书馆时只问从旧图书馆出来的人；\n- **人们自己选择参与**，比如请读者寄回表格，收集到的多是意见最强烈的人；\n- **问题有引导性**，比如“新图书馆难道不会让我们的镇更好吗？”\n\n从整个总体中随机抽取并用中立的问题提问，就不存在这些偏差。",
      ),
      generate(rng) {
        const s = rng.pick(studies);
        const goal = s.goal(rng.pick([800, 1200, 1500, 2400, 3000, 5000]));
        const [bias, method] = rng.pick(s.methods(rng.pick([40, 50, 60, 80, 100, 120, 150, 200])));
        return pickChoice(
          rng,
          t(
            `${goal.en} It decides to do this: ${method.en} Which statement describes the sample?`,
            `${goal["zh-CN"]}它决定这样做：${method["zh-CN"]}哪种说法描述了这个样本？`,
          ),
          biasReasons[bias],
          (Object.keys(biasReasons) as Bias[]).filter((b) => b !== bias).map((b) => biasReasons[b]),
          bias === "none"
            ? t(
                "Everyone in the population has the same chance of being chosen, and the question is neutral, so the sample is not biased.",
                "总体中每个人被选中的机会都相同，而且问题是中立的，所以样本没有偏差。",
              )
            : bias === "excluded"
              ? t(
                  "Only one part of the population can be reached this way, and that part may answer differently from the rest.",
                  "这种方法只能接触到总体的一部分，而这部分人的回答可能与其他人不同。",
                )
              : bias === "volunteer"
                ? t(
                    "Only the people who decide to answer are counted, and they tend to be those with the strongest opinions.",
                    "只统计了自己决定回答的人，而他们往往是意见最强烈的人。",
                  )
                : t(
                    "The people are chosen at random, but the wording suggests which answer is expected.",
                    "人是随机选的，但问题的措辞暗示了期望的回答。",
                  ),
        );
      },
    },
  ],
);

/** Option is a survey answer: [English, Chinese]. */
type Option = readonly [string, string];

/** Poll is a survey question with its answer options. */
interface Poll {
  readonly question: Text;
  readonly options: readonly Option[];
}

const polls: readonly Poll[] = [
  {
    question: t("What is your favorite season?", "你最喜欢哪个季节？"),
    options: [
      ["spring", "春季"],
      ["summer", "夏季"],
      ["fall", "秋季"],
      ["winter", "冬季"],
    ],
  },
  {
    question: t("How do you usually get to school?", "你通常怎样上学？"),
    options: [
      ["walk", "步行"],
      ["bus", "坐公交"],
      ["car", "坐车"],
      ["bike", "骑车"],
    ],
  },
  {
    question: t("Which club would you join?", "你会参加哪个社团？"),
    options: [
      ["art", "美术"],
      ["robotics", "机器人"],
      ["drama", "戏剧"],
      ["chess", "国际象棋"],
    ],
  },
];

/** interpretingSurveyResults reads counts and percentages from surveys and draws only the conclusions they support. */
export const interpretingSurveyResults = topic(
  "interpreting-survey-results",
  t("Interpreting Survey Results", "解读调查结果"),
  t(
    "Survey results are often given as percentages of the people who answered. Turn a percentage back into a count by multiplying by the number surveyed, and compare groups of different sizes by their percentages, not their counts. A random sample supports conclusions about the population only as estimates: about, not exactly.",
    "调查结果常以占回答人数的百分比给出。用百分比乘调查人数，就能还原出人数；比较人数不同的几组时，要比较百分比，而不是人数。随机样本对总体的结论只是估计：是“大约”，而不是“恰好”。",
  ),
  ["sampling"],
  ["7.SP.A.1", "7.SP.A.2"],
  [
    {
      id: "counts-from-survey-percentages",
      title: t("Counts from survey percentages", "由调查百分比求人数"),
      explanation: t(
        "In a survey of $250$ students, $36\\%$ chose summer and $20\\%$ chose winter. Summer got $0.36 \\times 250 = 90$ answers and winter $0.20 \\times 250 = 50$, so $40$ more students chose summer. The difference of the percentages, $16$, is in percentage points, not students; $0.16 \\times 250 = 40$ gives the same count.",
        "在一次对 $250$ 名学生的调查中，$36\\%$ 选夏季，$20\\%$ 选冬季。夏季有 $0.36 \\times 250 = 90$ 人，冬季有 $0.20 \\times 250 = 50$ 人，所以选夏季的多 $40$ 人。百分比之差 $16$ 的单位是百分点，不是人数；$0.16 \\times 250 = 40$ 也得到同样的人数。",
      ),
      generate(rng) {
        const p = rng.pick(polls);
        const n = rng.pick([50, 100, 200, 250, 300, 400, 500, 800]);
        for (;;) {
          const pcts = [rng.int(5, 40), rng.int(5, 40), rng.int(5, 40)];
          const last = 100 - sum(pcts);
          if (last < 5) continue;
          const all = [...pcts, last];
          if (all.some((x) => (x * n) % 100 !== 0)) continue;
          const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
          if (all[i] === all[j]) continue;
          const [a, b] = all[i]! > all[j]! ? [i, j] : [j, i];
          const diff = ((all[a]! - all[b]!) * n) / 100;
          const table = (lang: 0 | 1) =>
            mdTable(
              [lang === 0 ? "Answer" : "回答", lang === 0 ? "Percent" : "百分比"],
              p.options.map((o, k) => [o[lang], m(`${all[k]}\\%`)]),
            );
          return numberProblem({
            prompt: t(
              `${n} students were asked, “${p.question.en}” The results were:${table(0)}How many more students answered ${p.options[a]![0]} than ${p.options[b]![0]}?`,
              `向 ${n} 名学生提问：“${p.question["zh-CN"]}”结果如下：${table(1)}回答“${p.options[a]![1]}”的比回答“${p.options[b]![1]}”的多多少人？`,
            ),
            answer: diff,
            form: "integer",
            // The difference in percentage points, and one of the counts.
            wrong: [all[a]! - all[b]!, (all[a]! * n) / 100],
            solution: t(
              `Turn each percentage into a count, then subtract:${steps(`${dec(Q.of(all[a]!, 100))} \\times ${n} = ${(all[a]! * n) / 100}`, `${dec(Q.of(all[b]!, 100))} \\times ${n} = ${(all[b]! * n) / 100}`, `${(all[a]! * n) / 100} - ${(all[b]! * n) / 100} = ${diff}`)}`,
              `把每个百分比换成人数，再相减：${steps(`${dec(Q.of(all[a]!, 100))} \\times ${n} = ${(all[a]! * n) / 100}`, `${dec(Q.of(all[b]!, 100))} \\times ${n} = ${(all[b]! * n) / 100}`, `${(all[a]! * n) / 100} - ${(all[b]! * n) / 100} = ${diff}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "comparing-groups-of-different-sizes",
      title: t("Comparing groups of different sizes", "比较人数不同的组"),
      explanation: t(
        "In a survey, $18$ of $40$ seventh graders and $21$ of $60$ eighth graders said they play an instrument. More eighth graders said yes, but the groups differ in size, so compare percentages: $\\frac{18}{40} = 45\\%$ and $\\frac{21}{60} = 35\\%$. The seventh-grade share is $10$ percentage points higher.",
        "在一次调查中，$40$ 名七年级学生中有 $18$ 人、$60$ 名八年级学生中有 $21$ 人说自己会演奏乐器。八年级说“会”的人更多，但两组人数不同，所以要比较百分比：$\\frac{18}{40} = 45\\%$，$\\frac{21}{60} = 35\\%$。七年级的比例高 $10$ 个百分点。",
      ),
      generate(rng) {
        const [en, zh] = rng.pick([
          ["play an instrument", "会演奏乐器"],
          ["have read the book", "读过这本书"],
          ["walk to school", "步行上学"],
          ["want a longer lunch break", "希望延长午休时间"],
        ] as const);
        for (;;) {
          const [n1, n2] = rng.sample([20, 25, 40, 50, 60, 75, 80], 2) as [number, number];
          const [p1, p2] = [rng.int(2, 18) * 5, rng.int(2, 18) * 5];
          if (p1 === p2 || (p1 * n1) % 100 !== 0 || (p2 * n2) % 100 !== 0) continue;
          const [k1, k2] = [(p1 * n1) / 100, (p2 * n2) / 100];
          // Make the larger count belong to the smaller percentage, so counting alone misleads.
          if ((k1 - k2) * (p1 - p2) >= 0) continue;
          const diff = Math.abs(p1 - p2);
          return numberProblem({
            prompt: t(
              `In a survey, ${k1} of ${n1} seventh graders and ${k2} of ${n2} eighth graders said they ${en}. By how many percentage points is the larger percentage greater than the smaller one?`,
              `在一次调查中，${n1} 名七年级学生中有 ${k1} 人、${n2} 名八年级学生中有 ${k2} 人说自己${zh}。较大的百分比比较小的百分比高多少个百分点？`,
            ),
            answer: diff,
            form: "integer",
            wrong: [Math.abs(k1 - k2), Math.abs(Math.round((100 * (k1 - k2)) / (n1 + n2)))],
            solution: t(
              `Compare the percentages, since the groups differ in size:${steps(`\\frac{${k1}}{${n1}} = ${p1}\\%`, `\\frac{${k2}}{${n2}} = ${p2}\\%`, `${Math.max(p1, p2)} - ${Math.min(p1, p2)} = ${diff}`)}The ${p1 > p2 ? "seventh" : "eighth"}-grade percentage is greater by $${diff}$ percentage points, even though fewer ${p1 > p2 ? "seventh" : "eighth"} graders said yes.`,
              `两组人数不同，所以比较百分比：${steps(`\\frac{${k1}}{${n1}} = ${p1}\\%`, `\\frac{${k2}}{${n2}} = ${p2}\\%`, `${Math.max(p1, p2)} - ${Math.min(p1, p2)} = ${diff}`)}虽然${p1 > p2 ? "七" : "八"}年级说“是”的人更少，但${p1 > p2 ? "七" : "八"}年级的百分比高 $${diff}$ 个百分点。`,
            ),
          });
        }
      },
    },
    {
      id: "supported-conclusions",
      title: t("Supported conclusions", "有依据的结论"),
      explanation: t(
        "In a random sample of $80$ of the $2000$ students in a district, $24$ want a later start. The sample supports “about $\\frac{24}{80} \\times 2000 = 600$ students in the district want a later start.” It does not support “exactly $600$” (other samples would differ a little), or “$24$ students in the district” (that counts only the sample).",
        "某区 $2000$ 名学生中随机抽取 $80$ 人，其中 $24$ 人希望推迟上学时间。这个样本支持“全区大约有 $\\frac{24}{80} \\times 2000 = 600$ 名学生希望推迟”。它不支持“恰好 $600$ 人”（换一个样本结果会略有不同），也不支持“全区有 $24$ 名学生”（那只是样本中的人数）。",
      ),
      generate(rng) {
        const [en, zh] = rng.pick([
          ["want a later start time", "希望推迟上学时间"],
          ["would join a coding club", "愿意参加编程社团"],
          ["eat breakfast every day", "每天吃早饭"],
        ] as const);
        for (;;) {
          const n = rng.pick([40, 50, 60, 80, 100]);
          const k = rng.int(Math.floor(n * 0.1), Math.floor(n * 0.45));
          const pop = rng.pick([1000, 1200, 1500, 2000, 2400, 3000]);
          const est = Q.of(k * pop, n);
          const rest = Q.of((n - k) * pop, n);
          if (!est.isInteger()) continue;
          const e = est.toLatex();
          return pickChoice(
            rng,
            t(
              `In a random sample of ${n} of the ${pop} students in a district, ${k} said they ${en}. Which conclusion does the sample support?`,
              `从某区 ${pop} 名学生中随机抽取 ${n} 人，其中 ${k} 人说自己${zh}。这个样本支持哪个结论？`,
            ),
            t(`About $${e}$ students in the district ${en}.`, `全区大约有 $${e}$ 名学生${zh}。`),
            [
              t(`Exactly $${e}$ students in the district ${en}.`, `全区恰好有 $${e}$ 名学生${zh}。`),
              t(`About $${k}$ students in the district ${en}.`, `全区大约有 $${k}$ 名学生${zh}。`),
              t(`About $${rest.toLatex()}$ students in the district ${en}.`, `全区大约有 $${rest.toLatex()}$ 名学生${zh}。`),
              t(`Most students in the district ${en}.`, `全区大多数学生${zh}。`),
            ],
            t(
              `The sample proportion $\\frac{${k}}{${n}}$ estimates the population proportion, so about $\\frac{${k}}{${n}} \\times ${pop} = ${e}$ students ${en}. It is an estimate, not an exact count, and since $\\frac{${k}}{${n}}$ is less than half it does not show that most do.`,
              `样本比例 $\\frac{${k}}{${n}}$ 估计总体比例，所以大约有 $\\frac{${k}}{${n}} \\times ${pop} = ${e}$ 名学生${zh}。这是估计值，不是确切人数；而且 $\\frac{${k}}{${n}}$ 不到一半，不能说明大多数学生${zh}。`,
            ),
          );
        }
      },
    },
  ],
);

/** samplingAndMarginOfError turns an estimate and its margin of error into an interval of plausible values. */
export const samplingAndMarginOfError = topic(
  "sampling-and-margin-of-error",
  t("Sampling and Margin of Error", "抽样与误差范围"),
  t(
    "An estimate from a random sample is rarely exact. Its margin of error says how far the true value is likely to be from the estimate: an estimate of 42% with a margin of error of 3 percentage points means the true percentage is plausibly anywhere from 39% to 45%. Larger random samples give smaller margins of error.",
    "随机样本给出的估计很少完全准确。误差范围说明真实值可能离估计值多远：估计值为 42%、误差范围为 3 个百分点，意味着真实的百分比可能在 39% 到 45% 之间的任何位置。随机样本越大，误差范围越小。",
  ),
  ["interpreting-survey-results"],
  ["7.SP.A.2"],
  [
    {
      id: "intervals-from-a-margin-of-error",
      title: t("Intervals from a margin of error", "由误差范围求区间"),
      explanation: t(
        "A poll finds that $42\\%$ of voters support a plan, with a margin of error of $3$ percentage points. The plausible values run from $42 - 3 = 39\\%$ to $42 + 3 = 45\\%$. The margin is added to and subtracted from the estimate itself: it is not $3\\%$ of $42$.",
        "一项民意调查发现 $42\\%$ 的选民支持某项计划，误差范围为 $3$ 个百分点。合理的取值从 $42 - 3 = 39\\%$ 到 $42 + 3 = 45\\%$。误差范围是直接加到估计值上或从估计值中减去的，而不是 $42$ 的 $3\\%$。",
      ),
      generate(rng) {
        const p = rng.int(15, 85);
        const e = rng.int(2, 6);
        const upper = rng.bool();
        const [en, zh] = rng.pick([
          ["voters support a new park", "选民支持新建公园"],
          ["adults read the news every day", "成年人每天看新闻"],
          ["students would buy a school hoodie", "学生愿意买校服卫衣"],
          ["shoppers use reusable bags", "顾客使用环保袋"],
        ] as const);
        return numberProblem({
          prompt: t(
            `A survey of a random sample estimates that $${p}\\%$ of ${en}, with a margin of error of $${e}$ percentage points. What is the ${upper ? "greatest" : "least"} plausible percentage?`,
            `一项随机抽样调查估计 $${p}\\%$ 的${zh}，误差范围为 $${e}$ 个百分点。合理的百分比${upper ? "最大" : "最小"}是多少？`,
          ),
          answer: upper ? p + e : p - e,
          percent: true,
          wrong: [upper ? p - e : p + e, p, 2 * e],
          solution: t(
            `The plausible values are the estimate plus or minus the margin of error:${steps(`${p} ${upper ? "+" : "-"} ${e} = ${upper ? p + e : p - e}`)}So the ${upper ? "greatest" : "least"} plausible percentage is $${upper ? p + e : p - e}\\%$.`,
            `合理的取值是估计值加上或减去误差范围：${steps(`${p} ${upper ? "+" : "-"} ${e} = ${upper ? p + e : p - e}`)}所以合理的百分比${upper ? "最大" : "最小"}是 $${upper ? p + e : p - e}\\%$。`,
          ),
        });
      },
    },
    {
      id: "plausible-values",
      title: t("Plausible values", "合理的取值"),
      explanation: t(
        "With an estimate of $48\\%$ and a margin of error of $4$ percentage points, the plausible values are $44\\%$ to $52\\%$. So the true percentage could be above $50\\%$ or below it: the poll cannot say whether a majority supports the plan. A value such as $55\\%$ lies outside the interval and is not plausible.",
        "估计值为 $48\\%$、误差范围为 $4$ 个百分点时，合理的取值是 $44\\%$ 到 $52\\%$。所以真实的百分比可能高于 $50\\%$，也可能低于 $50\\%$：这次调查无法判断是否过半数支持。像 $55\\%$ 这样的值在区间之外，不合理。",
      ),
      generate(rng) {
        const p = rng.int(20, 80);
        const e = rng.int(2, 6);
        const v = rng.bool() ? p + rng.int(-e, e) : p + (rng.bool() ? 1 : -1) * rng.int(e + 1, e + 5);
        const ok = Math.abs(v - p) <= e;
        return pickChoice(
          rng,
          t(
            `A random-sample survey estimates that $${p}\\%$ of a town’s residents want a new pool, with a margin of error of $${e}$ percentage points. Is it plausible that $${v}\\%$ of the residents want a new pool?`,
            `一项随机抽样调查估计某镇 $${p}\\%$ 的居民希望建新游泳池，误差范围为 $${e}$ 个百分点。$${v}\\%$ 的居民希望建新游泳池，这个说法合理吗？`,
          ),
          yesNo[ok ? 0 : 1]!,
          [yesNo[ok ? 1 : 0]!],
          t(
            `The plausible values run from $${p} - ${e} = ${p - e}\\%$ to $${p} + ${e} = ${p + e}\\%$. $${v}\\%$ is ${ok ? "inside" : "outside"} this interval, so it is ${ok ? "" : "not "}plausible.`,
            `合理的取值从 $${p} - ${e} = ${p - e}\\%$ 到 $${p} + ${e} = ${p + e}\\%$。$${v}\\%$ 在这个区间${ok ? "内" : "外"}，所以${ok ? "合理" : "不合理"}。`,
          ),
        );
      },
    },
    {
      id: "counts-from-a-margin-of-error",
      title: t("Counts from a margin of error", "由误差范围求人数"),
      explanation: t(
        "A random sample estimates that $30\\%$ of a school’s $1200$ students bike to school, with a margin of error of $5$ percentage points. The plausible percentages are $25\\%$ to $35\\%$, so the plausible numbers of students are $0.25 \\times 1200 = 300$ to $0.35 \\times 1200 = 420$.",
        "一个随机样本估计某校 $1200$ 名学生中有 $30\\%$ 骑车上学，误差范围为 $5$ 个百分点。合理的百分比是 $25\\%$ 到 $35\\%$，所以合理的人数是 $0.25 \\times 1200 = 300$ 到 $0.35 \\times 1200 = 420$。",
      ),
      generate(rng) {
        const pop = rng.pick([400, 500, 800, 1000, 1200, 1500, 2000, 2500]);
        const p = rng.int(10, 70);
        const e = rng.int(2, 6);
        const upper = rng.bool();
        const pct = upper ? p + e : p - e;
        const answer = Q.of(pct * pop, 100);
        return numberProblem({
          prompt: t(
            `A random sample estimates that $${p}\\%$ of the ${pop} students at a school bike to school, with a margin of error of $${e}$ percentage points. What is the ${upper ? "greatest" : "least"} plausible number of students who bike to school?`,
            `一个随机样本估计某校 ${pop} 名学生中有 $${p}\\%$ 骑车上学，误差范围为 $${e}$ 个百分点。骑车上学的学生人数合理的${upper ? "最大" : "最小"}值是多少？`,
          ),
          answer,
          form: "integer",
          // The estimate itself, and the margin of error turned into a count on its own.
          wrong: [Q.of(p * pop, 100), Q.of(e * pop, 100), Q.of((upper ? p - e : p + e) * pop, 100)],
          solution: t(
            `The ${upper ? "greatest" : "least"} plausible percentage is $${p} ${upper ? "+" : "-"} ${e} = ${pct}\\%$. Take that percentage of ${pop}:${steps(`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`)}`,
            `合理的百分比${upper ? "最大" : "最小"}是 $${p} ${upper ? "+" : "-"} ${e} = ${pct}\\%$。求 ${pop} 的这个百分比：${steps(`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Joint and cumulative frequency

/** TwoWay is a two-way table's story: the groups in its rows and the answers in its columns. */
export interface TwoWay {
  readonly intro: Text;
  readonly rows: readonly Option[];
  readonly cols: readonly Option[];
  /** cell asks for a joint frequency: how many in row r gave answer c. */
  readonly cell: (r: Option, c: Option) => Text;
  /** who names the people in row r who gave answer c. */
  readonly who: (r: Option, c: Option) => Text;
  /** ofRow asks what percent of the people in row r gave answer c. */
  readonly ofRow: (r: Option, c: Option) => Text;
  /** ofCol asks what percent of the people who gave answer c are in row r. */
  readonly ofCol: (r: Option, c: Option) => Text;
}

/** twoWays are the stories of the two-way tables. */
export const twoWays: readonly TwoWay[] = [
  {
    intro: t("Students were asked which pet they prefer.", "调查了学生喜欢哪种宠物。"),
    rows: [
      ["7th graders", "七年级学生"],
      ["8th graders", "八年级学生"],
    ],
    cols: [
      ["dogs", "狗"],
      ["cats", "猫"],
      ["fish", "鱼"],
    ],
    cell: (r, c) => t(`How many ${r[0]} prefer ${c[0]}?`, `有多少名${r[1]}喜欢${c[1]}？`),
    who: (r, c) => t(`${r[0]} who prefer ${c[0]}`, `喜欢${c[1]}的${r[1]}`),
    ofRow: (r, c) => t(`What percent of the ${r[0]} prefer ${c[0]}?`, `${r[1]}中，喜欢${c[1]}的占百分之几？`),
    ofCol: (r, c) => t(`Of the students who prefer ${c[0]}, what percent are ${r[0]}?`, `喜欢${c[1]}的学生中，${r[1]}占百分之几？`),
  },
  {
    intro: t("Visitors to a museum were asked how they got there.", "调查了博物馆的参观者是怎样来的。"),
    rows: [
      ["adults", "成人"],
      ["children", "儿童"],
    ],
    cols: [
      ["by car", "开车"],
      ["by bus", "坐公交"],
      ["on foot", "步行"],
    ],
    cell: (r, c) => t(`How many ${r[0]} came ${c[0]}?`, `有多少名${r[1]}是${c[1]}来的？`),
    who: (r, c) => t(`${r[0]} who came ${c[0]}`, `${c[1]}来的${r[1]}`),
    ofRow: (r, c) => t(`What percent of the ${r[0]} came ${c[0]}?`, `${r[1]}中，${c[1]}来的占百分之几？`),
    ofCol: (r, c) => t(`Of the visitors who came ${c[0]}, what percent are ${r[0]}?`, `${c[1]}来的参观者中，${r[1]}占百分之几？`),
  },
  {
    intro: t(
      "The junior members (under 18) and adult members of a sports club were asked which sport they play most.",
      "调查了体育俱乐部的青少年会员（18 岁以下）和成年会员最常进行哪项运动。",
    ),
    rows: [
      ["juniors", "青少年会员"],
      ["adults", "成年会员"],
    ],
    cols: [
      ["soccer", "足球"],
      ["tennis", "网球"],
      ["swimming", "游泳"],
    ],
    cell: (r, c) => t(`How many ${r[0]} chose ${c[0]}?`, `有多少名${r[1]}选择${c[1]}？`),
    who: (r, c) => t(`${r[0]} who chose ${c[0]}`, `选择${c[1]}的${r[1]}`),
    ofRow: (r, c) => t(`What percent of the ${r[0]} chose ${c[0]}?`, `${r[1]}中，选择${c[1]}的占百分之几？`),
    ofCol: (r, c) => t(`Of the members who chose ${c[0]}, what percent are ${r[0]}?`, `选择${c[1]}的会员中，${r[1]}占百分之几？`),
  },
];

/** jointTable writes a two-way table with totals; cells listed in hide show as blanks, and the cell at ask as "?". */
export function jointTable(w: TwoWay, c: readonly (readonly number[])[], hide: readonly string[], ask: string, lang: 0 | 1): string {
  const rowTotals = c.map((r) => sum(r));
  const colTotals = w.cols.map((_, j) => sum(c.map((r) => r[j]!)));
  const show = (key: string, v: number) => (key === ask ? "?" : hide.includes(key) ? " " : m(v));
  const total = lang === 0 ? "Total" : "合计";
  return mdTable(
    ["", ...w.cols.map((col) => col[lang]), total],
    [
      ...w.rows.map((row, i) => [row[lang], ...c[i]!.map((v, j) => show(`${i}${j}`, v)), show(`${i}T`, rowTotals[i]!)]),
      [total, ...colTotals.map((v, j) => show(`T${j}`, v)), show("TT", sum(rowTotals))],
    ],
  );
}

/** jointCounts draws the counts of a 2 by 3 two-way table. */
const jointCounts = (rng: Rng) => [0, 1].map(() => [0, 1, 2].map(() => rng.int(3, 40)));

/** jointFrequencyTables reads, completes and turns into relative frequencies the entries of two-way tables. */
export const jointFrequencyTables = topic(
  "joint-frequency-tables",
  t("Joint Frequency Tables", "联合频数表"),
  t(
    "A joint frequency table (a two-way table) counts the data by two categories at once: each cell is a joint frequency, such as the number of 7th graders who prefer dogs. The totals at the ends of the rows and columns are the marginal frequencies, and every row and column adds up to its total. Dividing a joint frequency by the grand total gives a joint relative frequency.",
    "联合频数表（双向表）同时按两个类别统计数据：每个单元格是一个联合频数，比如喜欢狗的七年级学生人数。行末和列末的合计是边缘频数，每一行、每一列加起来都等于它的合计。用联合频数除以总计，得到联合频率。",
  ),
  ["frequency-tables"],
  ["8.SP.A.4"],
  [
    {
      id: "reading-joint-frequencies",
      title: t("Reading joint frequencies", "读联合频数"),
      explanation: t(
        "In a two-way table, find the row of one category and the column of the other: the cell where they meet is the joint frequency. A total at the end of a row counts the whole row, whatever the answer, and the grand total in the corner counts everyone.",
        "在双向表中，找到一个类别所在的行和另一个类别所在的列，它们相交的单元格就是联合频数。行末的合计统计整行（不论回答是什么），右下角的总计统计所有人。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        const c = jointCounts(rng);
        const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
        const v = c[i]![j]!;
        return numberProblem({
          prompt: t(
            `${w.intro.en}${jointTable(w, c, [], "", 0)}${w.cell(w.rows[i]!, w.cols[j]!).en}`,
            `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.cell(w.rows[i]!, w.cols[j]!)["zh-CN"]}`,
          ),
          answer: v,
          form: "integer",
          // The other row, the column total, and the row total.
          wrong: [c[1 - i]![j]!, c[0]![j]! + c[1]![j]!, sum(c[i]!)],
          solution: t(
            `Read the cell in the row “${w.rows[i]![0]}” and the column “${w.cols[j]![0]}”: it is $${v}$.`,
            `读“${w.rows[i]![1]}”这一行与“${w.cols[j]![1]}”这一列相交的单元格：是 $${v}$。`,
          ),
        });
      },
    },
    {
      id: "completing-a-joint-frequency-table",
      title: t("Completing a joint frequency table", "补全联合频数表"),
      explanation: t(
        "Every row and every column adds up to its total, so a missing entry is a total minus the other entries. If a row total is missing too, find it first from the grand total. With a grand total of $120$ and one row total of $70$, the other row has $120 - 70 = 50$; if that row’s other cells are $18$ and $12$, the missing cell is $50 - 18 - 12 = 20$.",
        "每一行、每一列加起来都等于它的合计，所以缺少的数等于合计减去其他各数。如果行合计也缺少，先用总计求出它。总计为 $120$、一行的合计为 $70$ 时，另一行合计为 $120 - 70 = 50$；如果这一行的另两个单元格是 $18$ 和 $12$，缺少的单元格就是 $50 - 18 - 12 = 20$。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        const c = jointCounts(rng);
        const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
        const v = c[i]![j]!;
        // Hide the asked cell's row total and the cell below or above it, so two steps are needed.
        const hide = [`${i}T`, `${1 - i}${j}`, `T${j}`];
        const others = c[i]!.filter((_, k) => k !== j);
        const rowTotal = sum(c[i]!);
        const grand = sum(c.flat());
        const otherTotal = sum(c[1 - i]!);
        return numberProblem({
          prompt: t(
            `${w.intro.en} Some entries of the table are missing.${jointTable(w, c, hide, `${i}${j}`, 0)}${w.cell(w.rows[i]!, w.cols[j]!).en}`,
            `${w.intro["zh-CN"]}表格中有些数缺失了。${jointTable(w, c, hide, `${i}${j}`, 1)}${w.cell(w.rows[i]!, w.cols[j]!)["zh-CN"]}`,
          ),
          answer: v,
          form: "integer",
          // Subtracting the known cells from the grand total, or stopping at the row total.
          wrong: [grand - sum(others), rowTotal, otherTotal - sum(others)].filter((x) => x > 0),
          solution: t(
            `First find the row total for “${w.rows[i]![0]}” from the grand total and the other row’s total:${steps(`${grand} - ${otherTotal} = ${rowTotal}`)}Then subtract the other entries of the row:${steps(`${rowTotal} - ${others.join(" - ")} = ${v}`)}`,
            `先用总计和另一行的合计求出“${w.rows[i]![1]}”这一行的合计：${steps(`${grand} - ${otherTotal} = ${rowTotal}`)}再减去这一行的其他各数：${steps(`${rowTotal} - ${others.join(" - ")} = ${v}`)}`,
          ),
        });
      },
    },
    {
      id: "joint-relative-frequencies",
      title: t("Joint relative frequencies", "联合频率"),
      explanation: t(
        "A joint relative frequency is a joint frequency divided by the grand total: the fraction of everyone surveyed who are in both categories. If $24$ of $160$ students are 8th graders who prefer cats, the joint relative frequency is $\\frac{24}{160} = 0.15 = 15\\%$. Divide by the grand total, not by a row or column total.",
        "联合频率等于联合频数除以总计：同时属于两个类别的人占全部受访者的比例。如果 $160$ 名学生中有 $24$ 名是喜欢猫的八年级学生，联合频率就是 $\\frac{24}{160} = 0.15 = 15\\%$。要除以总计，而不是行合计或列合计。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        for (;;) {
          const c = jointCounts(rng);
          const grand = sum(c.flat());
          const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
          const v = c[i]![j]!;
          const pct = Q.of(100 * v, grand);
          if (!pct.isInteger()) continue;
          const rowTotal = sum(c[i]!);
          const colTotal = c[0]![j]! + c[1]![j]!;
          return numberProblem({
            prompt: t(
              `${w.intro.en}${jointTable(w, c, [], "", 0)}What percent of everyone surveyed are ${w.who(w.rows[i]!, w.cols[j]!).en}?`,
              `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.who(w.rows[i]!, w.cols[j]!)["zh-CN"]}占全部受访者的百分之几？`,
            ),
            answer: pct,
            percent: true,
            // Dividing by the row total or the column total.
            wrong: [Q.of(100 * v, rowTotal), Q.of(100 * v, colTotal)].filter(clean),
            solution: t(
              `Divide the joint frequency by the grand total of $${grand}$:${steps(`\\frac{${v}}{${grand}} = ${dec(Q.of(v, grand))} = ${pct.toLatex()}\\%`)}`,
              `用联合频数除以总计 $${grand}$：${steps(`\\frac{${v}}{${grand}} = ${dec(Q.of(v, grand))} = ${pct.toLatex()}\\%`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** Tally is a frequency table of whole-number values: its story and labels. */
interface Tally {
  readonly intro: Text;
  readonly label: Text;
  readonly first: number;
  readonly noun: Text;
}

const tallies: readonly Tally[] = [
  {
    intro: t("The table shows how many siblings each student in a grade has.", "表格显示了某年级每个学生的兄弟姐妹人数。"),
    label: t("Siblings", "兄弟姐妹人数"),
    first: 0,
    noun: t("students", "名学生"),
  },
  {
    intro: t("The table shows the scores, out of 10, on a quiz.", "表格显示了一次满分 10 分的小测成绩。"),
    label: t("Score", "成绩"),
    first: 4,
    noun: t("students", "名学生"),
  },
  {
    intro: t(
      "The table shows how many goals a hockey team scored in each game of a season.",
      "表格显示了一支冰球队一个赛季每场比赛的进球数。",
    ),
    label: t("Goals", "进球数"),
    first: 0,
    noun: t("games", "场比赛"),
  },
  {
    intro: t("The table shows the number of people in each car that crossed a bridge.", "表格显示了驶过一座桥的每辆车里的人数。"),
    label: t("People", "人数"),
    first: 1,
    noun: t("cars", "辆车"),
  },
];

/** tallyTable writes a frequency table, with a cumulative frequency column when cumulative is true. */
function tallyTable(ty: Tally, values: readonly number[], freqs: readonly number[], columns: "f" | "c" | "fc"): Text {
  const cum = freqs.map((_, i) => sum(freqs.slice(0, i + 1)));
  const rows = (lang: "en" | "zh-CN") =>
    mdTable(
      [
        ty.label[lang],
        ...(columns.includes("f") ? [lang === "en" ? "Frequency" : "频数"] : []),
        ...(columns.includes("c") ? [lang === "en" ? "Cumulative frequency" : "累积频数"] : []),
      ],
      values.map((v, i) => [m(v), ...(columns.includes("f") ? [m(freqs[i]!)] : []), ...(columns.includes("c") ? [m(cum[i]!)] : [])]),
    );
  return t(rows("en"), rows("zh-CN"));
}

/** tally draws a story, five to seven consecutive values and their frequencies. */
function tally(rng: Rng): { ty: Tally; values: number[]; freqs: number[] } {
  const ty = rng.pick(tallies);
  const k = rng.int(5, 7);
  const values = Array.from({ length: k }, (_, i) => ty.first + i);
  const peak = rng.int(1, k - 2);
  const freqs = values.map((_, i) => Math.max(1, rng.int(6, 12) - 2 * Math.abs(i - peak) + rng.int(-2, 2)));
  return { ty, values, freqs };
}

/** cumulativeFrequency builds and reads cumulative frequency tables. */
export const cumulativeFrequency = topic(
  "cumulative-frequency",
  t("Cumulative Frequency", "累积频数"),
  t(
    "The cumulative frequency of a value is the number of data values less than or equal to it: the running total of the frequencies down the table. The last cumulative frequency is the number of values. Going back, the frequency of a value is the difference between its cumulative frequency and the one before.",
    "某个值的累积频数是小于或等于它的数据个数，也就是沿表格往下各频数的累计和。最后一个累积频数就是数据的总个数。反过来，某个值的频数等于它的累积频数减去前一个累积频数。",
  ),
  ["frequency-tables"],
  ["6.SP.B.4", "6.SP.B.5.A"],
  [
    {
      id: "finding-cumulative-frequencies",
      title: t("Finding cumulative frequencies", "求累积频数"),
      explanation: t(
        "For frequencies $3, 8, 5, 2$ of the values $0, 1, 2, 3$, the cumulative frequencies are $3$, $3 + 8 = 11$, $11 + 5 = 16$ and $16 + 2 = 18$. The cumulative frequency of $2$ is $16$: that many values are $2$ or less. It includes the frequency of $2$ itself.",
        "值 $0, 1, 2, 3$ 的频数分别是 $3, 8, 5, 2$，它们的累积频数依次是 $3$、$3 + 8 = 11$、$11 + 5 = 16$、$16 + 2 = 18$。$2$ 的累积频数是 $16$：有这么多个数据小于或等于 $2$。它包括 $2$ 本身的频数。",
      ),
      generate(rng) {
        const { ty, values, freqs } = tally(rng);
        const i = rng.int(1, values.length - 2);
        const cf = sum(freqs.slice(0, i + 1));
        return numberProblem({
          prompt: t(
            `${ty.intro.en}${tallyTable(ty, values, freqs, "f").en}What is the cumulative frequency of $${values[i]}$?`,
            `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "f")["zh-CN"]}$${values[i]}$ 的累积频数是多少？`,
          ),
          answer: cf,
          form: "integer",
          // The frequency alone, the total before the value, and the count from the value up.
          wrong: [freqs[i]!, cf - freqs[i]!, sum(freqs.slice(i))],
          solution: t(
            `Add the frequencies of all values up to and including $${values[i]}$:${steps(`${freqs.slice(0, i + 1).join(" + ")} = ${cf}`)}`,
            `把不超过 $${values[i]}$ 的所有值的频数相加（包括 $${values[i]}$）：${steps(`${freqs.slice(0, i + 1).join(" + ")} = ${cf}`)}`,
          ),
        });
      },
    },
    {
      id: "reading-cumulative-frequency-tables",
      title: t("Reading cumulative frequency tables", "读累积频数表"),
      explanation: t(
        "With cumulative frequencies $3, 11, 16, 18$ for $0, 1, 2, 3$:\n\n- exactly $2$: $16 - 11 = 5$ values;\n- more than $1$: $18 - 11 = 7$ values;\n- at least $1$: $18 - 3 = 15$ values.\n\nSubtract cumulative frequencies; do not add them.",
        "$0, 1, 2, 3$ 的累积频数分别是 $3, 11, 16, 18$：\n\n- 恰好为 $2$：$16 - 11 = 5$ 个；\n- 大于 $1$：$18 - 11 = 7$ 个；\n- 至少为 $1$：$18 - 3 = 15$ 个。\n\n要把累积频数相减，而不是相加。",
      ),
      generate(rng) {
        const { ty, values, freqs } = tally(rng);
        const cum = freqs.map((_, i) => sum(freqs.slice(0, i + 1)));
        const n = cum[cum.length - 1]!;
        const i = rng.int(1, values.length - 2);
        const v = values[i]!;
        const kind = rng.pick(["exactly", "more", "atLeast"] as const);
        const answer = kind === "exactly" ? freqs[i]! : kind === "more" ? n - cum[i]! : n - cum[i - 1]!;
        const ask =
          kind === "exactly"
            ? t(`How many ${ty.noun.en} had exactly $${v}$?`, `恰好为 $${v}$ 的有多少${ty.noun["zh-CN"]}？`)
            : kind === "more"
              ? t(`How many ${ty.noun.en} had more than $${v}$?`, `大于 $${v}$ 的有多少${ty.noun["zh-CN"]}？`)
              : t(`How many ${ty.noun.en} had at least $${v}$?`, `至少为 $${v}$ 的有多少${ty.noun["zh-CN"]}？`);
        const work =
          kind === "exactly"
            ? `${cum[i]} - ${cum[i - 1]} = ${answer}`
            : kind === "more"
              ? `${n} - ${cum[i]} = ${answer}`
              : `${n} - ${cum[i - 1]} = ${answer}`;
        return numberProblem({
          prompt: t(
            `${ty.intro.en}${tallyTable(ty, values, freqs, "c").en}${ask.en}`,
            `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "c")["zh-CN"]}${ask["zh-CN"]}`,
          ),
          answer,
          form: "integer",
          wrong: [cum[i]!, kind === "more" ? n - cum[i - 1]! : n - cum[i]!, kind === "exactly" ? cum[i]! + cum[i - 1]! : cum[i - 1]!],
          solution:
            kind === "exactly"
              ? t(
                  `$${cum[i]}$ values are $${v}$ or less and $${cum[i - 1]}$ are $${values[i - 1]}$ or less, so${steps(work)}`,
                  `小于或等于 $${v}$ 的有 $${cum[i]}$ 个，小于或等于 $${values[i - 1]}$ 的有 $${cum[i - 1]}$ 个，所以${steps(work)}`,
                )
              : kind === "more"
                ? t(
                    `There are $${n}$ values in all, and $${cum[i]}$ of them are $${v}$ or less, so${steps(work)}`,
                    `共有 $${n}$ 个数据，其中 $${cum[i]}$ 个小于或等于 $${v}$，所以${steps(work)}`,
                  )
                : t(
                    `“At least $${v}$” leaves out the $${cum[i - 1]}$ values that are $${values[i - 1]}$ or less:${steps(work)}`,
                    `“至少为 $${v}$”要去掉小于或等于 $${values[i - 1]}$ 的 $${cum[i - 1]}$ 个数据：${steps(work)}`,
                  ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Means, medians and modes of tables and histograms

/** calculatingMeansFromFrequencyTables estimates means of grouped data and finds missing frequencies from a mean. */
export const calculatingMeansFromFrequencyTables = topic(
  "calculating-means-from-frequency-tables",
  t("Calculating Means From Frequency Tables", "由频数表计算平均数"),
  t(
    "The mean of a frequency table is the sum of value × frequency divided by the sum of the frequencies. When the data are grouped into classes, the exact values are lost, so each class is represented by its midpoint and the result is an estimate of the mean. If the mean is known, the same formula gives an equation for a missing frequency.",
    "频数表的平均数等于各“值 × 频数”之和除以频数之和。数据分组后，确切的数值就看不到了，所以每一组用它的组中值代表，得到的是平均数的估计值。如果已知平均数，同一个公式就给出了求未知频数的方程。",
  ),
  ["frequency-tables"],
  ["6.SP.B.5.C", "7.SP.B.4"],
  [
    {
      id: "estimating-the-mean-of-grouped-data",
      title: t("Estimating the mean of grouped data", "估计分组数据的平均数"),
      explanation: t(
        "For travel times with frequencies $4, 9, 7$ in the classes $0 \\le t < 10$, $10 \\le t < 20$ and $20 \\le t < 30$, use the midpoints $5, 15, 25$:\n\n$$\\frac{5 \\times 4 + 15 \\times 9 + 25 \\times 7}{4 + 9 + 7} = \\frac{330}{20} = 16.5 \\text{ min}.$$\n\nThis is an estimate, since the times inside each class are not known.",
        "上学时间在 $0 \\le t < 10$、$10 \\le t < 20$、$20 \\le t < 30$ 三组中的频数分别是 $4, 9, 7$，用组中值 $5, 15, 25$：\n\n$$\\frac{5 \\times 4 + 15 \\times 9 + 25 \\times 7}{4 + 9 + 7} = \\frac{330}{20} = 16.5 \\text{ 分钟}.$$\n\n这是估计值，因为每组里面的具体时间并不知道。",
      ),
      generate(rng) {
        for (;;) {
          const d = grouped(rng);
          const mids = midpoints(d);
          const total = mids.reduce((s, x, i) => s.add(x.mul(Q.of(d.freqs[i]!))), Q.of(0));
          const est = total.div(Q.of(d.n));
          if (!clean(est)) continue;
          const lowers = d.freqs.reduce((s, f, i) => s + f * d.edges[i]!, 0);
          return numberProblem({
            prompt: t(
              `The table shows ${d.g.what(d.n).en}.${groupedTable(d).en}Use the midpoints of the classes to estimate the mean.`,
              `表格显示了 ${d.g.what(d.n)["zh-CN"]}。${groupedTable(d)["zh-CN"]}用各组的组中值估计平均数。`,
            ),
            answer: est,
            form: "decimal",
            unit: d.g.unit,
            // The class lower bounds used instead of midpoints, the mean of the midpoints alone, and dividing by the number of classes.
            wrong: [
              Q.of(lowers, d.n),
              mids.reduce((s, x) => s.add(x), Q.of(0)).div(Q.of(mids.length)),
              total.div(Q.of(mids.length)),
            ].filter(clean),
            solution: t(
              `The midpoints are $${list(mids.map(dec))}$. Multiply each by its frequency, add, and divide by the $${d.n}$ values:${steps(`\\frac{${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")}}{${d.n}} = \\frac{${dec(total)}}{${d.n}} = ${dec(est)}`)}`,
              `组中值是 $${list(mids.map(dec))}$。把每个组中值乘它的频数后相加，再除以数据个数 $${d.n}$：${steps(`\\frac{${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")}}{${d.n}} = \\frac{${dec(total)}}{${d.n}} = ${dec(est)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "a-missing-frequency-from-the-mean",
      title: t("A missing frequency from the mean", "由平均数求未知频数"),
      explanation: t(
        "Quiz scores $6, 7, 8$ have frequencies $4, k, 2$, and the mean is $6.8$. The total of the scores is $6 \\times 4 + 7k + 8 \\times 2 = 40 + 7k$ and the number of scores is $6 + k$, so\n\n$$\\frac{40 + 7k}{6 + k} = 6.8 \\quad\\Rightarrow\\quad 40 + 7k = 40.8 + 6.8k \\quad\\Rightarrow\\quad 0.2k = 0.8 \\quad\\Rightarrow\\quad k = 4.$$",
        "小测成绩 $6, 7, 8$ 的频数分别是 $4, k, 2$，平均数是 $6.8$。成绩总和是 $6 \\times 4 + 7k + 8 \\times 2 = 40 + 7k$，成绩个数是 $6 + k$，所以\n\n$$\\frac{40 + 7k}{6 + k} = 6.8 \\quad\\Rightarrow\\quad 40 + 7k = 40.8 + 6.8k \\quad\\Rightarrow\\quad 0.2k = 0.8 \\quad\\Rightarrow\\quad k = 4.$$",
      ),
      generate(rng) {
        for (;;) {
          const ty = rng.pick(tallies);
          const values = [0, 1, 2, 3].map((i) => ty.first + i);
          const freqs = values.map(() => rng.int(1, 9));
          const j = rng.int(values[0] === 0 ? 1 : 0, 3);
          const k = freqs[j]!;
          const mu = Q.of(sum(values.map((v, i) => v * freqs[i]!)), sum(freqs));
          if (!clean(mu) || mu.isInteger() || mu.eq(Q.of(values[j]!))) continue;
          const known = sum(values.map((v, i) => (i === j ? 0 : v * freqs[i]!)));
          const count = sum(freqs) - k;
          const shown = freqs.map((f, i) => (i === j ? "k" : String(f)));
          const table = (lang: "en" | "zh-CN") =>
            mdTable(
              [ty.label[lang], lang === "en" ? "Frequency" : "频数"],
              values.map((v, i) => [m(v), m(shown[i]!)]),
            );
          const left = mu.mul(Q.of(count)).sub(Q.of(known));
          const coef = Q.of(values[j]!).sub(mu);
          const vk = values[j] === 1 ? "k" : `${values[j]}k`;
          // Keep the coefficient of k positive in the last steps.
          const last = coef.sign() > 0 ? `${dec(coef)}k = ${dec(left)}` : `${dec(coef.neg())}k = ${dec(left.neg())}`;
          return numberProblem({
            prompt: t(
              `${ty.intro.en}${table("en")}The mean is $${dec(mu)}$. What is $k$?`,
              `${ty.intro["zh-CN"]}${table("zh-CN")}平均数是 $${dec(mu)}$。$k$ 是多少？`,
            ),
            answer: k,
            form: "integer",
            solveFor: "k",
            // Leaving k out of the number of values, and the total frequency.
            wrong: [...(values[j] === 0 ? [] : [left.div(Q.of(values[j]!))]), Q.of(sum(freqs))].filter(
              (w) => w.isInteger() && w.sign() > 0,
            ),
            solution: t(
              `The total is $${known} + ${vk}$ and the number of values is $${count} + k$:${steps(`\\frac{${known} + ${vk}}{${count} + k} = ${dec(mu)}`, `${known} + ${vk} = ${dec(mu.mul(Q.of(count)))} + ${dec(mu)}k`, last, `k = ${k}`)}`,
              `总和是 $${known} + ${vk}$，数据个数是 $${count} + k$：${steps(`\\frac{${known} + ${vk}}{${count} + k} = ${dec(mu)}`, `${known} + ${vk} = ${dec(mu.mul(Q.of(count)))} + ${dec(mu)}k`, last, `k = ${k}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** calculatingMediansFromFrequencyTables locates the median of tabulated data and the class that holds it. */
export const calculatingMediansFromFrequencyTables = topic(
  "calculating-medians-from-frequency-tables",
  t("Calculating Medians From Frequency Tables", "由频数表计算中位数"),
  t(
    "In a frequency table the values are already in order, so the median is found by counting: with n values, the median is the value in position (n + 1)/2, or the mean of the two middle values when n is even. Running totals of the frequencies show which row holds that position. For grouped data, this finds the class that contains the median.",
    "频数表中的值已经排好了顺序，所以通过计数就能求中位数：共有 n 个数据时，中位数是第 (n + 1)/2 个数据；n 为偶数时，是中间两个数据的平均数。各频数的累计和可以显示这个位置落在哪一行。对于分组数据，这样可以找出中位数所在的组。",
  ),
  ["cumulative-frequency", "the-median-of-a-data-set"],
  ["6.SP.B.5.C"],
  [
    {
      id: "the-median-from-a-frequency-table",
      title: t("The median from a frequency table", "从频数表求中位数"),
      explanation: t(
        "Sibling counts $0, 1, 2, 3$ have frequencies $3, 8, 5, 2$, so there are $18$ values and the median is the mean of the $9$th and $10$th. The running totals are $3, 11, 16, 18$: values $4$ to $11$ are all $1$, so both middle values are $1$ and the median is $1$. With $19$ values the median would be the $10$th.",
        "兄弟姐妹人数 $0, 1, 2, 3$ 的频数分别是 $3, 8, 5, 2$，共 $18$ 个数据，中位数是第 $9$ 个和第 $10$ 个数据的平均数。累计和依次是 $3, 11, 16, 18$：第 $4$ 到第 $11$ 个数据都是 $1$，所以中间两个数据都是 $1$，中位数是 $1$。如果有 $19$ 个数据，中位数就是第 $10$ 个。",
      ),
      generate(rng) {
        const { ty, values, freqs } = tally(rng);
        const xs = expand(values, freqs);
        const n = xs.length;
        const med = median(xs);
        const cum = freqs.map((_, i) => sum(freqs.slice(0, i + 1)));
        const where =
          n % 2 === 1
            ? t(`the $${(n + 1) / 2}$th`, `第 $${(n + 1) / 2}$ 个`)
            : t(`the mean of the $${n / 2}$th and $${n / 2 + 1}$th`, `第 $${n / 2}$ 个和第 $${n / 2 + 1}$ 个数据的平均数`);
        const a = xs[Math.ceil(n / 2) - 1]!;
        const b = xs[Math.floor(n / 2)]!;
        return numberProblem({
          prompt: t(
            `${ty.intro.en}${tallyTable(ty, values, freqs, "f").en}What is the median?`,
            `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "f")["zh-CN"]}中位数是多少？`,
          ),
          answer: med,
          form: "decimal",
          // The middle row of the table, the value with the greatest frequency, the median of the frequencies, and the position of the median.
          wrong: [
            Q.of(n + 1, 2),
            Q.of(values[Math.floor(values.length / 2)]!),
            Q.of(values[freqs.indexOf(Math.max(...freqs))]!),
            median(freqs),
          ],
          solution: t(
            `There are $${freqs.join(" + ")} = ${n}$ values, so the median is ${where.en}. The running totals are $${list(cum)}$, so${n % 2 === 1 ? ` the $${(n + 1) / 2}$th value is $${a}$.` : ` the middle values are $${a}$ and $${b}$, and the median is $${dec(med)}$.`}`,
            `共有 $${freqs.join(" + ")} = ${n}$ 个数据，所以中位数是${where["zh-CN"]}。累计和依次是 $${list(cum)}$，所以${n % 2 === 1 ? `第 $${(n + 1) / 2}$ 个数据是 $${a}$。` : `中间两个数据是 $${a}$ 和 $${b}$，中位数是 $${dec(med)}$。`}`,
          ),
        });
      },
    },
    {
      id: "the-class-containing-the-median",
      title: t("The class containing the median", "中位数所在的组"),
      explanation: t(
        "Times in the classes $0 \\le t < 10$, $10 \\le t < 20$, $20 \\le t < 30$, $30 \\le t < 40$ have frequencies $6, 11, 9, 4$: $30$ values, so the median lies between the $15$th and $16$th. The running totals are $6, 17, 26, 30$, so both are in the second class, and the median is in $10 \\le t < 20$, though its exact value is unknown. It is not the class with the middle position in the table.",
        "时间在 $0 \\le t < 10$、$10 \\le t < 20$、$20 \\le t < 30$、$30 \\le t < 40$ 各组的频数分别是 $6, 11, 9, 4$：共 $30$ 个数据，中位数在第 $15$ 个和第 $16$ 个之间。累计和依次是 $6, 17, 26, 30$，所以这两个数据都在第二组，中位数在 $10 \\le t < 20$ 中，但它的确切值并不知道。中位数所在的组不是表格中间那一行。",
      ),
      generate(rng) {
        for (;;) {
          const d = grouped(rng);
          const lo = classOf(d.freqs, Math.ceil(d.n / 2));
          const hi = classOf(d.freqs, Math.floor(d.n / 2) + 1);
          if (lo !== hi) continue;
          const cum = d.freqs.map((_, i) => sum(d.freqs.slice(0, i + 1)));
          const cls = (i: number) => mathText(classTex(d.g, d.edges[i]!, d.edges[i + 1]!));
          return pickChoice(
            rng,
            t(
              `The table shows ${d.g.what(d.n).en}.${groupedTable(d).en}Which class contains the median?`,
              `表格显示了 ${d.g.what(d.n)["zh-CN"]}。${groupedTable(d)["zh-CN"]}中位数在哪一组？`,
            ),
            cls(lo),
            [d.freqs.indexOf(Math.max(...d.freqs)), Math.floor(d.freqs.length / 2), lo + 1, lo - 1]
              .filter((i) => i >= 0 && i < d.freqs.length && i !== lo)
              .map(cls),
            t(
              `There are $${d.n}$ values, so the median is ${d.n % 2 === 1 ? `the $${(d.n + 1) / 2}$th` : `between the $${d.n / 2}$th and the $${d.n / 2 + 1}$th`}. The running totals are $${list(cum)}$, so it lies in $${classTex(d.g, d.edges[lo]!, d.edges[lo + 1]!)}$.`,
              `共有 $${d.n}$ 个数据，所以中位数${d.n % 2 === 1 ? `是第 $${(d.n + 1) / 2}$ 个` : `在第 $${d.n / 2}$ 个和第 $${d.n / 2 + 1}$ 个之间`}。累计和依次是 $${list(cum)}$，所以它在 $${classTex(d.g, d.edges[lo]!, d.edges[lo + 1]!)}$ 中。`,
            ),
          );
        }
      },
    },
  ],
);

/** calculatingModesFromFrequencyTables finds modes, modal classes and the frequencies that make a mode. */
export const calculatingModesFromFrequencyTables = topic(
  "calculating-modes-from-frequency-tables",
  t("Calculating Modes From Frequency Tables", "由频数表计算众数"),
  t(
    "The mode of a frequency table is the value with the greatest frequency; when two values tie for the greatest frequency, both are modes. For grouped data the class with the greatest frequency is the modal class. The mode is always a value of the data, never a frequency.",
    "频数表的众数是频数最大的值；如果两个值的频数并列最大，它们都是众数。对于分组数据，频数最大的组叫众数组。众数一定是数据中的值，而不是频数。",
  ),
  ["frequency-tables"],
  ["6.SP.B.5.C"],
  [
    {
      id: "one-or-two-modes",
      title: t("One mode or two", "一个众数还是两个"),
      explanation: t(
        "If scores $5, 6, 7, 8, 9$ have frequencies $2, 6, 4, 6, 1$, the greatest frequency $6$ belongs to both $6$ and $8$, so the data have two modes, $6$ and $8$. Look at every frequency before choosing; picking only the first $6$ in the table misses a mode.",
        "如果成绩 $5, 6, 7, 8, 9$ 的频数分别是 $2, 6, 4, 6, 1$，最大频数 $6$ 同时属于 $6$ 和 $8$，所以数据有两个众数：$6$ 和 $8$。要看完所有频数再判断；只选表中第一个频数为 $6$ 的值，就会漏掉一个众数。",
      ),
      generate(rng) {
        for (;;) {
          const { ty, values, freqs } = tally(rng);
          const two = rng.bool();
          const top = Math.max(...freqs);
          const tops = values.filter((_, i) => freqs[i] === top);
          if (two) {
            if (tops.length !== 1) continue;
            const i = values.indexOf(tops[0]!);
            const candidates = values.map((_, k) => k).filter((k) => Math.abs(k - i) >= 2);
            if (candidates.length === 0) continue;
            freqs[rng.pick(candidates)] = top;
          } else if (tops.length !== 1) continue;
          const modes = values.filter((_, i) => freqs[i] === top);
          const tex = (vs: readonly number[]) =>
            vs.length === 1 ? t(`$${vs[0]}$ only`, `只有 $${vs[0]}$`) : t(`$${vs[0]}$ and $${vs[1]}$`, `$${vs[0]}$ 和 $${vs[1]}$`);
          const second = Math.max(...freqs.filter((f) => f !== top));
          const runnerUp = values.filter((_, i) => freqs[i] === second);
          return pickChoice(
            rng,
            t(
              `${ty.intro.en}${tallyTable(ty, values, freqs, "f").en}What is the mode, or what are the modes?`,
              `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "f")["zh-CN"]}众数是多少？`,
            ),
            tex(modes),
            [
              ...(modes.length === 2 ? [tex([modes[0]!]), tex([modes[1]!])] : [tex([modes[0]!, runnerUp[0]!].sort((a, b) => a - b))]),
              tex([top]),
              t("There is no mode.", "没有众数。"),
            ],
            modes.length === 2
              ? t(
                  `The greatest frequency is $${top}$, and it belongs to both $${modes[0]}$ and $${modes[1]}$, so both are modes.`,
                  `最大频数是 $${top}$，它同时属于 $${modes[0]}$ 和 $${modes[1]}$，所以两个都是众数。`,
                )
              : t(
                  `The greatest frequency is $${top}$, and only $${modes[0]}$ has it, so the mode is $${modes[0]}$.`,
                  `最大频数是 $${top}$，只有 $${modes[0]}$ 的频数是它，所以众数是 $${modes[0]}$。`,
                ),
          );
        }
      },
    },
    {
      id: "the-modal-class",
      title: t("The modal class", "众数组"),
      explanation: t(
        "In grouped data the exact values are hidden, so instead of a mode there is a modal class: the class with the greatest frequency. For frequencies $6, 11, 9, 4$ in the classes $0 \\le t < 10$, $10 \\le t < 20$, $20 \\le t < 30$, $30 \\le t < 40$, the modal class is $10 \\le t < 20$.",
        "分组数据看不到确切的数值，所以不说众数，而说众数组：频数最大的那一组。$0 \\le t < 10$、$10 \\le t < 20$、$20 \\le t < 30$、$30 \\le t < 40$ 各组的频数分别是 $6, 11, 9, 4$，众数组是 $10 \\le t < 20$。",
      ),
      generate(rng) {
        for (;;) {
          const d = grouped(rng);
          const top = Math.max(...d.freqs);
          if (d.freqs.filter((f) => f === top).length !== 1) continue;
          const i = d.freqs.indexOf(top);
          const cls = (k: number) => mathText(classTex(d.g, d.edges[k]!, d.edges[k + 1]!));
          return pickChoice(
            rng,
            t(
              `The table shows ${d.g.what(d.n).en}.${groupedTable(d).en}What is the modal class?`,
              `表格显示了 ${d.g.what(d.n)["zh-CN"]}。${groupedTable(d)["zh-CN"]}众数组是哪一组？`,
            ),
            cls(i),
            d.freqs
              .map((_, k) => k)
              .filter((k) => k !== i)
              .map(cls),
            t(
              `The greatest frequency is $${top}$, in the class $${classTex(d.g, d.edges[i]!, d.edges[i + 1]!)}$.`,
              `最大频数是 $${top}$，在 $${classTex(d.g, d.edges[i]!, d.edges[i + 1]!)}$ 这一组。`,
            ),
          );
        }
      },
    },
    {
      id: "frequencies-that-make-a-mode",
      title: t("Frequencies that make a mode", "使某值成为众数的频数"),
      explanation: t(
        "Scores $6, 7, 8, 9$ have frequencies $5, 3, k, 7$. For $8$ to be the only mode, its frequency must beat every other one, including $7$, so $k$ must be at least $8$. With $k = 7$, the values $8$ and $9$ would tie, giving two modes.",
        "成绩 $6, 7, 8, 9$ 的频数分别是 $5, 3, k, 7$。要使 $8$ 成为唯一的众数，它的频数必须大于其他所有频数，包括 $7$，所以 $k$ 至少是 $8$。若 $k = 7$，$8$ 和 $9$ 频数相同，就有两个众数。",
      ),
      generate(rng) {
        const ty = rng.pick(tallies);
        const values = [0, 1, 2, 3, 4].map((i) => ty.first + i);
        const freqs = values.map(() => rng.int(1, 12));
        const j = rng.int(0, 4);
        const top = Math.max(...freqs.filter((_, i) => i !== j));
        const shown = freqs.map((f, i) => (i === j ? "k" : String(f)));
        const table = (lang: "en" | "zh-CN") =>
          mdTable(
            [ty.label[lang], lang === "en" ? "Frequency" : "频数"],
            values.map((v, i) => [m(v), m(shown[i]!)]),
          );
        return numberProblem({
          prompt: t(
            `${ty.intro.en}${table("en")}What is the least whole number $k$ for which $${values[j]}$ is the only mode?`,
            `${ty.intro["zh-CN"]}${table("zh-CN")}要使 $${values[j]}$ 成为唯一的众数，整数 $k$ 最小是多少？`,
          ),
          answer: top + 1,
          form: "integer",
          solveFor: "k",
          // A tie, which gives two modes, and the value itself.
          wrong: [top, values[j]!, top + 2],
          solution: t(
            `The greatest of the other frequencies is $${top}$. For $${values[j]}$ to be the only mode, $k$ must be greater than $${top}$, so the least whole number is $${top + 1}$. With $k = ${top}$ there would be a tie.`,
            `其他频数中最大的是 $${top}$。要使 $${values[j]}$ 成为唯一的众数，$k$ 必须大于 $${top}$，所以最小的整数是 $${top + 1}$。若 $k = ${top}$，就会出现并列。`,
          ),
        });
      },
    },
  ],
);

/** calculatingModesAndMediansFromHistograms reads the modal class and the class of the median from histograms. */
export const calculatingModesAndMediansFromHistograms = topic(
  "calculating-modes-and-medians-from-histograms",
  t("Calculating Modes and Medians From Histograms", "由直方图求众数和中位数"),
  t(
    "A histogram is a grouped frequency table drawn as bars: each bar covers a class, and its height is the class frequency. The tallest bar is the modal class. Adding the bar heights from the left gives running totals, which show the class that holds the middle value: the class of the median.",
    "直方图是用矩形条画出来的分组频数表：每个矩形条覆盖一组，高度是这一组的频数。最高的矩形条就是众数组。从左往右把各矩形条的高度累加，就能看出中间那个数据落在哪一组，也就是中位数所在的组。",
  ),
  ["histograms", "calculating-medians-from-frequency-tables", "calculating-modes-from-frequency-tables"],
  ["6.SP.B.4", "6.SP.B.5.C"],
  [
    {
      id: "the-modal-class-from-a-histogram",
      title: t("The modal class from a histogram", "从直方图求众数组"),
      explanation: t(
        "Read the class under the tallest bar. If the bars over $10$–$20$, $20$–$30$, $30$–$40$ and $40$–$50$ have heights $4, 9, 12, 5$, the modal class is $30$ to $40$. The answer is the class, read on the horizontal axis, not the height $12$ read on the vertical axis.",
        "读出最高矩形条下面的组。如果 $10$–$20$、$20$–$30$、$30$–$40$、$40$–$50$ 上方矩形条的高度分别是 $4, 9, 12, 5$，众数组就是 $30$ 到 $40$。答案是在横轴上读出的组，而不是在纵轴上读出的高度 $12$。",
      ),
      generate(rng) {
        for (;;) {
          const d = grouped(rng);
          const top = Math.max(...d.freqs);
          if (d.freqs.filter((f) => f === top).length !== 1) continue;
          const i = d.freqs.indexOf(top);
          const cls = (k: number) => mathText(classTex(d.g, d.edges[k]!, d.edges[k + 1]!));
          return pickChoice(
            rng,
            t(
              `The histogram shows ${d.g.what(d.n).en}. What is the modal class?`,
              `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。众数组是哪一组？`,
            ),
            cls(i),
            d.freqs
              .map((_, k) => k)
              .filter((k) => k !== i)
              .map(cls),
            t(
              `The tallest bar has height $${top}$ and stands over $${d.edges[i]}$ to $${d.edges[i + 1]}$, so the modal class is $${classTex(d.g, d.edges[i]!, d.edges[i + 1]!)}$.`,
              `最高的矩形条高度为 $${top}$，位于 $${d.edges[i]}$ 到 $${d.edges[i + 1]}$ 上方，所以众数组是 $${classTex(d.g, d.edges[i]!, d.edges[i + 1]!)}$。`,
            ),
            histogramFigure(d),
          );
        }
      },
    },
    {
      id: "the-class-of-the-median-from-a-histogram",
      title: t("The class of the median from a histogram", "从直方图求中位数所在的组"),
      explanation: t(
        "First add all the bar heights to get the number of values. With heights $4, 9, 12, 5$ there are $30$ values, so the median is between the $15$th and $16$th. The running totals are $4, 13, 25, 30$, so both lie in the third bar: the median is between $30$ and $40$.",
        "先把各矩形条的高度相加，得到数据个数。高度为 $4, 9, 12, 5$ 时共有 $30$ 个数据，中位数在第 $15$ 个和第 $16$ 个之间。累计和依次是 $4, 13, 25, 30$，所以这两个数据都在第三个矩形条中：中位数在 $30$ 到 $40$ 之间。",
      ),
      generate(rng) {
        for (;;) {
          const d = grouped(rng);
          const lo = classOf(d.freqs, Math.ceil(d.n / 2));
          if (lo !== classOf(d.freqs, Math.floor(d.n / 2) + 1)) continue;
          const top = d.freqs.indexOf(Math.max(...d.freqs));
          if (top === lo && rng.bool(0.7)) continue;
          const cum = d.freqs.map((_, i) => sum(d.freqs.slice(0, i + 1)));
          const cls = (k: number) => mathText(classTex(d.g, d.edges[k]!, d.edges[k + 1]!));
          return pickChoice(
            rng,
            t(
              `The histogram shows ${d.g.what(d.n).en}. Which class contains the median?`,
              `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。中位数在哪一组？`,
            ),
            cls(lo),
            [top, Math.floor(d.freqs.length / 2), lo + 1, lo - 1].filter((k) => k >= 0 && k < d.freqs.length && k !== lo).map(cls),
            t(
              `The bar heights add up to $${d.freqs.join(" + ")} = ${d.n}$, so the median is ${d.n % 2 === 1 ? `the $${(d.n + 1) / 2}$th value` : `between the $${d.n / 2}$th and $${d.n / 2 + 1}$th values`}. The running totals are $${list(cum)}$, so it lies in $${classTex(d.g, d.edges[lo]!, d.edges[lo + 1]!)}$.`,
              `各矩形条高度之和是 $${d.freqs.join(" + ")} = ${d.n}$，所以中位数${d.n % 2 === 1 ? `是第 $${(d.n + 1) / 2}$ 个数据` : `在第 $${d.n / 2}$ 个和第 $${d.n / 2 + 1}$ 个数据之间`}。累计和依次是 $${list(cum)}$，所以它在 $${classTex(d.g, d.edges[lo]!, d.edges[lo + 1]!)}$ 中。`,
            ),
            histogramFigure(d),
          );
        }
      },
    },
  ],
);

/** calculatingMeansFromHistograms estimates totals and means from the bars of histograms. */
export const calculatingMeansFromHistograms = topic(
  "calculating-means-from-histograms",
  t("Calculating Means From Histograms", "由直方图计算平均数"),
  t(
    "A histogram does not show the individual values, but each bar can stand for its class: as many values as its height, all at the class midpoint. Adding midpoint × height over the bars estimates the total of the data, and dividing by the sum of the heights estimates the mean.",
    "直方图不显示每一个数据，但每个矩形条可以代表它的那一组：数据个数等于矩形条的高度，而且都看作组中值。把各矩形条的“组中值 × 高度”相加，就估计出数据的总和；再除以各高度之和，就估计出平均数。",
  ),
  ["histograms", "calculating-means-from-frequency-tables"],
  ["6.SP.B.4", "6.SP.B.5.C"],
  [
    {
      id: "estimating-a-total-from-a-histogram",
      title: t("Estimating a total from a histogram", "由直方图估计总和"),
      explanation: t(
        "A histogram of travel times has bars of heights $4, 9, 7$ over $0$–$10$, $10$–$20$ and $20$–$30$ minutes. Treat the $4$ times in the first bar as $5$ minutes each, and so on:\n\n$$5 \\times 4 + 15 \\times 9 + 25 \\times 7 = 20 + 135 + 175 = 330 \\text{ min}.$$\n\nUse the midpoints, not the left edges of the bars.",
        "一张上学时间的直方图中，$0$–$10$、$10$–$20$、$20$–$30$ 分钟上方的矩形条高度分别是 $4, 9, 7$。把第一个矩形条中的 $4$ 个时间都看作 $5$ 分钟，依此类推：\n\n$$5 \\times 4 + 15 \\times 9 + 25 \\times 7 = 20 + 135 + 175 = 330 \\text{ 分钟}.$$\n\n要用组中值，而不是矩形条的左端点。",
      ),
      generate(rng) {
        const d = grouped(rng);
        const mids = midpoints(d);
        const total = mids.reduce((s, x, i) => s.add(x.mul(Q.of(d.freqs[i]!))), Q.of(0));
        const lowers = d.freqs.reduce((s, f, i) => s + f * d.edges[i]!, 0);
        const uppers = d.freqs.reduce((s, f, i) => s + f * d.edges[i + 1]!, 0);
        return {
          ...numberProblem({
            prompt: t(
              `The histogram shows ${d.g.what(d.n).en}. Use the midpoints of the classes to estimate ${d.g.total.en}.`,
              `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。用各组的组中值估计${d.g.total["zh-CN"]}。`,
            ),
            answer: total,
            form: "decimal",
            unit: d.g.unit,
            wrong: [lowers, uppers, mids.reduce((s, x) => s.add(x), Q.of(0))],
            solution: t(
              `The bar heights are $${list(d.freqs)}$ and the midpoints are $${list(mids.map(dec))}$:${steps(`${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")} = ${dec(total)}`)}`,
              `各矩形条高度是 $${list(d.freqs)}$，组中值是 $${list(mids.map(dec))}$：${steps(`${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")} = ${dec(total)}`)}`,
            ),
          }),
          figure: histogramFigure(d),
        };
      },
    },
    {
      id: "estimating-a-mean-from-a-histogram",
      title: t("Estimating a mean from a histogram", "由直方图估计平均数"),
      explanation: t(
        "With bar heights $4, 9, 7$ over $0$–$10$, $10$–$20$, $20$–$30$, the estimated total is $330$ minutes and there are $4 + 9 + 7 = 20$ values, so the estimated mean is $330 \\div 20 = 16.5$ minutes. Divide by the number of values, the sum of the heights, not by the number of bars.",
        "$0$–$10$、$10$–$20$、$20$–$30$ 上方矩形条高度为 $4, 9, 7$ 时，估计总和是 $330$ 分钟，共有 $4 + 9 + 7 = 20$ 个数据，所以估计平均数是 $330 \\div 20 = 16.5$ 分钟。要除以数据个数（各高度之和），而不是矩形条的个数。",
      ),
      generate(rng) {
        for (;;) {
          const d = grouped(rng);
          const mids = midpoints(d);
          const total = mids.reduce((s, x, i) => s.add(x.mul(Q.of(d.freqs[i]!))), Q.of(0));
          const est = total.div(Q.of(d.n));
          if (!clean(est)) continue;
          return {
            ...numberProblem({
              prompt: t(
                `The histogram shows ${d.g.what(d.n).en}. Use the midpoints of the classes to estimate the mean.`,
                `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。用各组的组中值估计平均数。`,
              ),
              answer: est,
              form: "decimal",
              unit: d.g.unit,
              wrong: [
                total.div(Q.of(d.freqs.length)),
                Q.of(
                  d.freqs.reduce((s, f, i) => s + f * d.edges[i]!, 0),
                  d.n,
                ),
                mids[Math.floor(mids.length / 2)]!,
              ].filter(clean),
              solution: t(
                `Estimate the total with the midpoints $${list(mids.map(dec))}$, then divide by the $${d.freqs.join(" + ")} = ${d.n}$ values:${steps(`\\frac{${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")}}{${d.n}} = \\frac{${dec(total)}}{${d.n}} = ${dec(est)}`)}`,
                `用组中值 $${list(mids.map(dec))}$ 估计总和，再除以数据个数 $${d.freqs.join(" + ")} = ${d.n}$：${steps(`\\frac{${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")}}{${d.n}} = \\frac{${dec(total)}}{${d.n}} = ${dec(est)}`)}`,
              ),
            }),
            figure: histogramFigure(d),
          };
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Comparing data sets

/** Groups is a comparison of two groups, A and B: what was measured and the range of the values. */
interface Groups {
  readonly what: Text;
  readonly lo: number;
  readonly hi: number;
}

const comparisons: readonly Groups[] = [
  {
    what: t(
      "the scores of the students in two classes, A and B, on a 20-point quiz",
      "两个班（A 班和 B 班）的学生在一次满分 20 分的小测中的成绩",
    ),
    lo: 4,
    hi: 20,
  },
  {
    what: t("the points that two basketball players, A and B, scored in their recent games", "篮球运动员 A 和 B 最近几场比赛的得分"),
    lo: 4,
    hi: 30,
  },
  {
    what: t(
      "the heights, in centimeters, of bean plants grown with two fertilizers, A and B",
      "使用 A、B 两种肥料种出的豆苗的高度（厘米）",
    ),
    lo: 10,
    hi: 40,
  },
  {
    what: t("the numbers of minutes that two buses, A and B, were late on several days", "公交车 A 和 B 若干天的晚点时间（分钟）"),
    lo: 0,
    hi: 20,
  },
];

/** data draws n whole numbers from lo to hi. */
const data = (rng: Rng, n: number, lo: number, hi: number) => Array.from({ length: n }, () => rng.int(lo, hi));

/** quartiles are the medians of the lower and upper halves of the sorted data, the median left out when the count is odd. */
function quartiles(xs: readonly number[]): [Q, Q] {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return [median(s.slice(0, h)), median(s.slice(s.length - h))];
}

/** fiveNumbers is the minimum, first quartile, median, third quartile and maximum, for data whose quartiles are whole numbers. */
function fiveNumbers(xs: readonly number[]): FiveNumberSummary {
  const s = sorted(xs);
  const [q1, q3] = quartiles(xs);
  return [s[0]!, Number(q1.n), Number(median(xs).n), Number(q3.n), s[s.length - 1]!];
}

/** mad is the mean absolute deviation: the mean distance of the values from their mean. */
function mad(xs: readonly number[]): Q {
  const mu = mean(xs);
  return xs.reduce((s, x) => s.add(Q.of(x).sub(mu).abs()), Q.zero).div(Q.of(xs.length));
}

/** variance is the mean squared distance from the mean; it orders data sets the same way as the standard deviation. */
function variance(xs: readonly number[]): Q {
  const mu = mean(xs);
  return xs.reduce((s, x) => s.add(Q.of(x).sub(mu).mul(Q.of(x).sub(mu))), Q.zero).div(Q.of(xs.length));
}

/** modes are the values with the greatest frequency. */
function modes(xs: readonly number[]): number[] {
  const counts = new Map<number, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  const top = Math.max(...counts.values());
  return [...counts].filter(([, c]) => c === top).map(([v]) => v);
}

/** count is how many times x occurs in xs. */
const count = (xs: readonly number[], x: number) => xs.filter((v) => v === x).length;

/** axisFor is an axis from lo to hi in steps of 1, rounded out to multiples of 5 and numbered every 5. */
const axisFor = (lo: number, hi: number): Axis => ({ min: Math.floor(lo / 5) * 5, max: Math.ceil(hi / 5) * 5, step: 1, labelEvery: 5 });

/** stack draws two plots one above the other, labeled A and B. */
function stack(a: string, b: string): string {
  const parse = (svg: string) => ({
    h: Number(/viewBox="0 0 \d+ ([\d.]+)"/.exec(svg)![1]),
    body: svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""),
  });
  const [p, q] = [parse(a), parse(b)];
  return svgDocument(
    p.h + q.h + 8,
    `<text x="8" y="14">A</text>${p.body}<g transform="translate(0 ${p.h + 8})"><text x="8" y="14">B</text>${q.body}</g>`,
  );
}

/** dotsAlt describes a dot plot: "2 at 5, 3 at 6". */
const dotsAlt = (xs: readonly number[], at: string, dot: string, sep: string) =>
  [...new Set(sorted(xs))].map((v) => (at === "at" ? `${count(xs, v)} at ${v}` : `${v} 处 ${count(xs, v)} ${dot}`)).join(sep);

/** dotPairFigure draws data sets A and B as dot plots on the same axis. */
function dotPairFigure(a: readonly number[], b: readonly number[]): Figure {
  const axis = axisFor(Math.min(...a, ...b), Math.max(...a, ...b));
  return {
    svg: stack(dotPlot(a, axis), dotPlot(b, axis)),
    alt: t(
      `Two dot plots on the same scale. A: ${dotsAlt(a, "at", "", ", ")}. B: ${dotsAlt(b, "at", "", ", ")}.`,
      `同一刻度上的两个点图。A：${dotsAlt(a, "处", "个点", "，")}。B：${dotsAlt(b, "处", "个点", "，")}。`,
    ),
  };
}

/** boxPairFigure draws data sets A and B as box plots on the same axis. */
function boxPairFigure(a: readonly number[], b: readonly number[]): Figure {
  const axis = axisFor(Math.min(...a, ...b), Math.max(...a, ...b));
  const [sa, sb] = [fiveNumbers(a), fiveNumbers(b)];
  const en = (s: FiveNumberSummary) => `minimum ${s[0]}, first quartile ${s[1]}, median ${s[2]}, third quartile ${s[3]}, maximum ${s[4]}`;
  const zh = (s: FiveNumberSummary) => `最小值 ${s[0]}，第一四分位数 ${s[1]}，中位数 ${s[2]}，第三四分位数 ${s[3]}，最大值 ${s[4]}`;
  return {
    svg: stack(boxPlot(sa, axis), boxPlot(sb, axis)),
    alt: t(`Two box plots on the same scale. A: ${en(sa)}. B: ${en(sb)}.`, `同一刻度上的两个箱线图。A：${zh(sa)}。B：${zh(sb)}。`),
  };
}

/** setsText writes data sets A and B on lines of their own. */
const setsText = (a: readonly number[], b: readonly number[]) => `\n\nA: $${list(a)}$\n\nB: $${list(b)}$\n\n`;

/** setsTextZh writes data sets A and B on lines of their own, with Chinese punctuation. */
const setsTextZh = (a: readonly number[], b: readonly number[]) => `\n\nA：$${list(a)}$\n\nB：$${list(b)}$\n\n`;

/** meanLine works out the mean of one data set: "A: $\frac{60}{5} = 12$". */
const meanLine = (label: string, xs: readonly number[], colon = ": ") =>
  `${label}${colon}$\\frac{${sum(xs)}}{${xs.length}} = ${dec(mean(xs))}$`;

/** comparingMeans compares two data sets by the difference of their means and says what that difference means. */
export const comparingMeans = topic(
  "comparing-means",
  t("Comparing Means", "比较平均数"),
  t(
    "Two groups can be compared by their means: the difference of the means says how much greater the values of one group are than those of the other, on average. It does not say that every value of one group is greater, and when the groups differ in size it is not the difference of their totals.",
    "可以用平均数比较两组数据：平均数之差说明一组的数据平均比另一组大多少。它并不说明一组的每个数据都更大；两组数据个数不同时，它也不是两组总和之差。",
  ),
  ["the-mean-of-a-data-set"],
  ["7.SP.B.4"],
  [
    {
      id: "the-difference-of-two-means",
      title: t("The difference of two means", "两个平均数之差"),
      explanation: t(
        "Player A scored $12, 15, 9, 20, 14$ and player B scored $10, 8, 13, 11, 6, 12$. The means are $\\frac{70}{5} = 14$ and $\\frac{60}{6} = 10$, so A’s mean is $14 - 10 = 4$ points greater. Find each mean first: the difference of the totals, $70 - 60 = 10$, mixes up the number of games with the scores.",
        "运动员 A 的得分是 $12, 15, 9, 20, 14$，运动员 B 的得分是 $10, 8, 13, 11, 6, 12$。平均数分别是 $\\frac{70}{5} = 14$ 和 $\\frac{60}{6} = 10$，所以 A 的平均数比 B 大 $14 - 10 = 4$ 分。要先分别求平均数：总和之差 $70 - 60 = 10$ 把比赛场数和得分混在了一起。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const a = data(rng, rng.int(5, 8), g.lo, g.hi);
          const b = data(rng, rng.int(5, 8), g.lo, g.hi);
          const d = mean(a).sub(mean(b));
          if (d.sign() <= 0 || !clean(mean(a)) || !clean(mean(b)) || a.length === b.length) continue;
          return numberProblem({
            prompt: t(
              `The data show ${g.what.en}.${setsText(a, b)}How much greater is the mean of A than the mean of B?`,
              `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的平均数比 B 的平均数大多少？`,
            ),
            answer: d,
            form: "decimal",
            // The difference of the totals, and the difference of the medians.
            wrong: [Q.of(sum(a) - sum(b)), median(a).sub(median(b))],
            solution: t(
              `Find each mean, then subtract:${steps(meanLine("A", a), meanLine("B", b), `${dec(mean(a))} - ${dec(mean(b))} = ${dec(d)}`)}`,
              `先分别求平均数，再相减：${steps(meanLine("A", a, "："), meanLine("B", b, "："), `${dec(mean(a))} - ${dec(mean(b))} = ${dec(d)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "what-a-difference-of-means-says",
      title: t("What a difference of means says", "平均数之差的含义"),
      explanation: t(
        "If the mean of A is $14$ and the mean of B is $10$, then on average the values of A are $4$ greater. Some values of B can still be greater than some values of A, the totals can differ by any amount when the groups have different sizes, and the greatest values need not differ by $4$.",
        "如果 A 的平均数是 $14$，B 的平均数是 $10$，那么 A 的数据平均比 B 大 $4$。但 B 的某些数据仍可能比 A 的某些数据大；两组数据个数不同时，总和之差可以是任何数；两组的最大值之差也不一定是 $4$。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const a = data(rng, rng.int(5, 7), g.lo, g.hi);
          const b = data(rng, rng.int(5, 7), g.lo, g.hi);
          const d = mean(a).sub(mean(b));
          if (d.sign() <= 0 || !mean(a).isInteger() || !mean(b).isInteger()) continue;
          if (Math.min(...a) > Math.max(...b) || d.eq(Q.of(sum(a) - sum(b))) || d.eq(Q.of(Math.max(...a) - Math.max(...b)))) continue;
          const dd = d.toLatex();
          return pickChoice(
            rng,
            t(
              `The data show ${g.what.en}.${setsText(a, b)}The mean of A is $${mean(a).toLatex()}$ and the mean of B is $${mean(b).toLatex()}$. Which statement is true?`,
              `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的平均数是 $${mean(a).toLatex()}$，B 的平均数是 $${mean(b).toLatex()}$。哪种说法正确？`,
            ),
            t(`On average, the values of A are $${dd}$ greater than the values of B.`, `平均来看，A 的数据比 B 的数据大 $${dd}$。`),
            [
              t("Every value of A is greater than every value of B.", "A 的每个数据都比 B 的每个数据大。"),
              t(`The values of A add up to $${dd}$ more than the values of B.`, `A 的数据之和比 B 的数据之和大 $${dd}$。`),
              t(`The greatest value of A is $${dd}$ greater than the greatest value of B.`, `A 的最大值比 B 的最大值大 $${dd}$。`),
            ],
            t(
              `The difference of the means, $${mean(a).toLatex()} - ${mean(b).toLatex()} = ${dd}$, compares the groups on average. The other statements are false: B’s greatest value $${Math.max(...b)}$ is greater than A’s least value $${Math.min(...a)}$, the totals are $${sum(a)}$ and $${sum(b)}$, and the greatest values are $${Math.max(...a)}$ and $${Math.max(...b)}$.`,
              `平均数之差 $${mean(a).toLatex()} - ${mean(b).toLatex()} = ${dd}$ 是从平均的角度比较两组。其他说法都不对：B 的最大值 $${Math.max(...b)}$ 比 A 的最小值 $${Math.min(...a)}$ 大；两组总和分别是 $${sum(a)}$ 和 $${sum(b)}$；两组最大值分别是 $${Math.max(...a)}$ 和 $${Math.max(...b)}$。`,
            ),
          );
        }
      },
    },
  ],
);

/** comparingMedians compares two data sets by their medians, from lists and from box plots. */
export const comparingMedians = topic(
  "comparing-medians",
  t("Comparing Medians", "比较中位数"),
  t(
    "Two groups can also be compared by their medians, which are not pulled by extreme values. Sort each data set before finding its middle value. On box plots drawn on the same scale, the medians are the lines inside the boxes, so they can be compared directly.",
    "也可以用中位数比较两组数据，中位数不受极端值的牵引。求中间值之前要先把每组数据排序。在同一刻度上画出的箱线图中，中位数就是箱子里的竖线，可以直接比较。",
  ),
  ["the-median-of-a-data-set", "box-plots"],
  ["7.SP.B.4"],
  [
    {
      id: "the-difference-of-two-medians",
      title: t("The difference of two medians", "两个中位数之差"),
      explanation: t(
        "For A: $9, 15, 12, 20, 14$, sorted $9, 12, 14, 15, 20$, the median is $14$. For B: $10, 6, 13, 8, 11, 12$, sorted $6, 8, 10, 11, 12, 13$, the median is $\\frac{10 + 11}{2} = 10.5$. So A’s median is $14 - 10.5 = 3.5$ greater. Taking the middle of the unsorted lists would give $12$ and the wrong difference.",
        "A：$9, 15, 12, 20, 14$，排序后为 $9, 12, 14, 15, 20$，中位数是 $14$。B：$10, 6, 13, 8, 11, 12$，排序后为 $6, 8, 10, 11, 12, 13$，中位数是 $\\frac{10 + 11}{2} = 10.5$。所以 A 的中位数比 B 大 $14 - 10.5 = 3.5$。如果直接取未排序数据的中间值，A 会得到 $12$，差也就错了。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const a = data(rng, rng.int(5, 8), g.lo, g.hi);
          const b = data(rng, rng.int(5, 8), g.lo, g.hi);
          const d = median(a).sub(median(b));
          if (d.sign() <= 0 || a.length % 2 === b.length % 2) continue;
          const middle = (xs: readonly number[]) => {
            const h = Math.floor(xs.length / 2);
            return xs.length % 2 === 1 ? Q.of(xs[h]!) : Q.of(xs[h - 1]! + xs[h]!, 2);
          };
          const line = (label: string, xs: readonly number[], colon: string, word: string) =>
            `${label}${colon}$${list(sorted(xs))}$${word}$${dec(median(xs))}$`;
          return numberProblem({
            prompt: t(
              `The data show ${g.what.en}.${setsText(a, b)}How much greater is the median of A than the median of B?`,
              `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的中位数比 B 的中位数大多少？`,
            ),
            answer: d,
            form: "decimal",
            // The middles of the unsorted lists, and the difference of the means.
            wrong: [middle(a).sub(middle(b)), mean(a).sub(mean(b))].filter(clean),
            solution: t(
              `Sort each data set and find its middle:${steps(line("A", a, ": ", ", median "), line("B", b, ": ", ", median "), `${dec(median(a))} - ${dec(median(b))} = ${dec(d)}`)}`,
              `把每组数据排序，再找中间值：${steps(line("A", a, "：", "，中位数 "), line("B", b, "：", "，中位数 "), `${dec(median(a))} - ${dec(median(b))} = ${dec(d)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "medians-on-box-plots",
      title: t("Medians on box plots", "箱线图中的中位数"),
      explanation: t(
        "On two box plots drawn on the same scale, the median is the line inside each box. If A’s line is at $16$ and B’s at $11$, A’s median is $5$ greater. The edges of the box are the quartiles and the ends of the whiskers are the least and greatest values; neither is the median.",
        "在同一刻度上的两个箱线图中，中位数是每个箱子里的竖线。如果 A 的竖线在 $16$，B 的在 $11$，A 的中位数就比 B 大 $5$。箱子的两边是四分位数，须线的两端是最小值和最大值，它们都不是中位数。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const a = data(rng, rng.pick([11, 15]), g.lo, g.hi);
          const b = data(rng, rng.pick([11, 15]), g.lo, g.hi);
          const [sa, sb] = [fiveNumbers(a), fiveNumbers(b)];
          const d = sa[2] - sb[2];
          if (d <= 0) continue;
          return {
            ...numberProblem({
              prompt: t(
                `The box plots show ${g.what.en}. How much greater is the median of A than the median of B?`,
                `箱线图显示了${g.what["zh-CN"]}。A 的中位数比 B 的中位数大多少？`,
              ),
              answer: d,
              form: "integer",
              // The left edges of the boxes, the right edges, and the middles of the whole ranges.
              wrong: [sa[1] - sb[1], sa[3] - sb[3], Q.of(sa[0] + sa[4] - sb[0] - sb[4], 2)],
              solution: t(
                `The medians are the lines inside the boxes: $${sa[2]}$ for A and $${sb[2]}$ for B.${steps(`${sa[2]} - ${sb[2]} = ${d}`)}`,
                `中位数是箱子里的竖线：A 是 $${sa[2]}$，B 是 $${sb[2]}$。${steps(`${sa[2]} - ${sb[2]} = ${d}`)}`,
              ),
            }),
            figure: boxPairFigure(a, b),
          };
        }
      },
    },
  ],
);

/** Choices is a categorical survey of two groups: the groups and the answers they chose from. */
interface Choices {
  readonly intro: Text;
  readonly rows: readonly [Option, Option];
  readonly cols: readonly Option[];
}

const choiceSurveys: readonly Choices[] = [
  {
    intro: t("Students in two grades chose their favorite sport.", "两个年级的学生选出了自己最喜欢的运动。"),
    rows: [
      ["7th graders", "七年级学生"],
      ["8th graders", "八年级学生"],
    ],
    cols: [
      ["soccer", "足球"],
      ["basketball", "篮球"],
      ["tennis", "网球"],
      ["swimming", "游泳"],
    ],
  },
  {
    intro: t("Customers at two stores were asked which fruit they buy most often.", "调查了两家商店的顾客最常买哪种水果。"),
    rows: [
      ["store A customers", "A 店顾客"],
      ["store B customers", "B 店顾客"],
    ],
    cols: [
      ["apples", "苹果"],
      ["bananas", "香蕉"],
      ["grapes", "葡萄"],
      ["oranges", "橙子"],
    ],
  },
  {
    intro: t("Children and adults at a library chose the kind of book they like best.", "图书馆里的儿童和成人选出了自己最喜欢的图书类型。"),
    rows: [
      ["children", "儿童"],
      ["adults", "成人"],
    ],
    cols: [
      ["mystery", "悬疑"],
      ["science", "科普"],
      ["history", "历史"],
      ["comics", "漫画"],
    ],
  },
];

/** comparingModes compares two data sets by their modes, for numbers and for categories. */
export const comparingModes = topic(
  "comparing-modes",
  t("Comparing Modes", "比较众数"),
  t(
    "The mode is the most common value, so comparing modes compares the most typical answers of two groups. It is the only measure of center for categories such as favorite sports. Each group has its own mode: the most common answer of the two groups together can differ from the mode of either group.",
    "众数是出现次数最多的值，所以比较众数就是比较两组最常见的回答。对于“最喜欢的运动”这类类别数据，众数是唯一能用的集中趋势量。每组有自己的众数：两组合在一起最常见的回答，可能与其中任何一组的众数都不同。",
  ),
  ["the-mode-of-a-data-set"],
  ["7.SP.B.4"],
  [
    {
      id: "the-difference-of-two-modes",
      title: t("The difference of two modes", "两个众数之差"),
      explanation: t(
        "In A: $12, 15, 12, 18, 12, 15, 20$ the value $12$ occurs three times, so the mode is $12$. In B: $9, 10, 9, 14, 10, 10$ the mode is $10$. A’s mode is $12 - 10 = 2$ greater. The answer compares values, not how often they occur: subtracting the frequencies $3 - 3 = 0$ answers a different question.",
        "在 A：$12, 15, 12, 18, 12, 15, 20$ 中，$12$ 出现三次，所以众数是 $12$。在 B：$9, 10, 9, 14, 10, 10$ 中，众数是 $10$。A 的众数比 B 大 $12 - 10 = 2$。比较的是数值，而不是出现的次数：频数相减 $3 - 3 = 0$ 回答的是另一个问题。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const cA = rng.int(g.lo + 3, g.hi - 3);
          const cB = rng.int(g.lo + 3, g.hi - 3);
          const a = data(rng, rng.int(7, 10), cA - 3, cA + 3);
          const b = data(rng, rng.int(7, 10), cB - 3, cB + 3);
          const [ma, mb] = [modes(a), modes(b)];
          if (ma.length !== 1 || mb.length !== 1 || ma[0]! <= mb[0]!) continue;
          const [x, y] = [ma[0]!, mb[0]!];
          return numberProblem({
            prompt: t(
              `The data show ${g.what.en}.${setsText(a, b)}How much greater is the mode of A than the mode of B?`,
              `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的众数比 B 的众数大多少？`,
            ),
            answer: x - y,
            form: "integer",
            // The difference of the frequencies, and of the medians.
            wrong: [Q.of(count(a, x) - count(b, y)), median(a).sub(median(b))].filter(clean),
            solution: t(
              `In A, $${x}$ occurs $${count(a, x)}$ times, more than any other value; in B, $${y}$ occurs $${count(b, y)}$ times. So the modes are $${x}$ and $${y}$:${steps(`${x} - ${y} = ${x - y}`)}`,
              `在 A 中，$${x}$ 出现 $${count(a, x)}$ 次，比其他值都多；在 B 中，$${y}$ 出现 $${count(b, y)}$ 次。所以两组的众数分别是 $${x}$ 和 $${y}$：${steps(`${x} - ${y} = ${x - y}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "modes-of-categories",
      title: t("Modes of categories", "类别数据的众数"),
      explanation: t(
        "If $14$ seventh graders and $9$ eighth graders chose soccer, and $8$ seventh graders and $12$ eighth graders chose tennis, the mode for the 7th graders is soccer and the mode for the 8th graders is tennis, even though soccer is more popular overall ($23$ against $20$). Find each group’s mode in its own row.",
        "如果选足球的七年级学生有 $14$ 人、八年级学生有 $9$ 人，选网球的七年级学生有 $8$ 人、八年级学生有 $12$ 人，那么七年级的众数是足球，八年级的众数是网球，尽管从总体看足球更受欢迎（$23$ 对 $20$）。要在每组自己的那一行里找众数。",
      ),
      generate(rng) {
        const s = rng.pick(choiceSurveys);
        for (;;) {
          const c = [0, 1].map(() => s.cols.map(() => rng.int(3, 20)));
          const top = (xs: readonly number[]) => {
            const best = Math.max(...xs);
            return xs.filter((x) => x === best).length === 1 ? xs.indexOf(best) : -1;
          };
          const [i, j] = [top(c[0]!), top(c[1]!)];
          const totals = s.cols.map((_, k) => c[0]![k]! + c[1]![k]!);
          const k = top(totals);
          if (i < 0 || j < 0 || k < 0 || i === j) continue;
          const name = (col: number, lang: 0 | 1) => s.cols[col]![lang];
          const [r0, r1] = s.rows;
          const statement = (x: number, y: number) =>
            t(
              `The mode for ${r0[0]} is ${name(x, 0)}, and the mode for ${r1[0]} is ${name(y, 0)}.`,
              `${r0[1]}的众数是${name(x, 1)}，${r1[1]}的众数是${name(y, 1)}。`,
            );
          const table = (lang: 0 | 1) =>
            mdTable(
              ["", ...s.cols.map((col) => col[lang])],
              s.rows.map((row, r) => [row[lang], ...c[r]!.map((v) => m(v))]),
            );
          return pickChoice(
            rng,
            t(`${s.intro.en}${table(0)}Which statement is true?`, `${s.intro["zh-CN"]}${table(1)}哪种说法正确？`),
            statement(i, j),
            [
              statement(j, i),
              statement(k, k),
              t(
                `The mode for both groups is ${name(k, 0)}, because it was chosen most often in all.`,
                `两组的众数都是${name(k, 1)}，因为总共选它的人最多。`,
              ),
              statement(i, i),
            ],
            t(
              `In the row for ${r0[0]} the greatest count is $${c[0]![i]}$, for ${name(i, 0)}; in the row for ${r1[0]} it is $${c[1]![j]}$, for ${name(j, 0)}. Each group has its own mode, whatever is most common in all.`,
              `在“${r0[1]}”这一行，最大的数是 $${c[0]![i]}$，对应${name(i, 1)}；在“${r1[1]}”这一行，最大的数是 $${c[1]![j]}$，对应${name(j, 1)}。每组有自己的众数，与两组合起来最常见的回答无关。`,
            ),
          );
        }
      },
    },
  ],
);

/** comparingDataSetsUsingRangeAndQuartiles compares the spreads of two data sets by their ranges and interquartile ranges. */
export const comparingDataSetsUsingRangeAndQuartiles = topic(
  "comparing-data-sets-using-range-and-quartiles",
  t("Comparing Data Sets Using Range and Quartiles", "用极差和四分位数比较数据集"),
  t(
    "The range and the interquartile range compare how spread out two data sets are: on box plots, the range is the length from whisker end to whisker end, and the IQR is the length of the box. A single extreme value stretches the range but barely moves the quartiles, so the IQR says better how consistent the typical values are.",
    "极差和四分位距可以比较两组数据的分散程度：在箱线图中，极差是从一端须线到另一端须线的长度，四分位距是箱子的长度。一个极端值会拉长极差，却几乎不影响四分位数，所以四分位距更能说明典型数据是否稳定。",
  ),
  ["range-quartiles-and-iqr", "box-plots"],
  ["7.SP.B.3", "7.SP.B.4"],
  [
    {
      id: "ranges-and-iqrs-on-box-plots",
      title: t("Ranges and IQRs on box plots", "箱线图中的极差和四分位距"),
      explanation: t(
        "For box plots with A: $4, 9, 12, 14, 20$ and B: $6, 10, 11, 15, 17$ (minimum, quartiles, median, maximum), the ranges are $20 - 4 = 16$ and $17 - 6 = 11$, and the IQRs are $14 - 9 = 5$ and $15 - 10 = 5$. A has the greater range, but the middle halves are equally spread.",
        "两个箱线图中，A 的五数概括为 $4, 9, 12, 14, 20$，B 的为 $6, 10, 11, 15, 17$。极差分别是 $20 - 4 = 16$ 和 $17 - 6 = 11$，四分位距分别是 $14 - 9 = 5$ 和 $15 - 10 = 5$。A 的极差更大，但两组中间一半数据的分散程度相同。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        const iqr = rng.bool();
        for (;;) {
          const a = data(rng, rng.pick([11, 15]), g.lo, g.hi);
          const b = data(rng, rng.pick([11, 15]), g.lo, g.hi);
          const [sa, sb] = [fiveNumbers(a), fiveNumbers(b)];
          const [ra, rb, ia, ib] = [sa[4] - sa[0], sb[4] - sb[0], sa[3] - sa[1], sb[3] - sb[1]];
          const d = iqr ? ia - ib : ra - rb;
          if (d <= 0 || ia - ib === ra - rb) continue;
          const name = iqr ? t("interquartile range", "四分位距") : t("range", "极差");
          return {
            ...numberProblem({
              prompt: t(
                `The box plots show ${g.what.en}. How much greater is the ${name.en} of A than the ${name.en} of B?`,
                `箱线图显示了${g.what["zh-CN"]}。A 的${name["zh-CN"]}比 B 的${name["zh-CN"]}大多少？`,
              ),
              answer: d,
              form: "integer",
              // The other measure of spread, and the difference of the medians.
              wrong: [iqr ? ra - rb : ia - ib, sa[2] - sb[2], iqr ? sa[3] - sb[3] : sa[4] - sb[4]],
              solution: iqr
                ? t(
                    `The IQR is the length of the box, $Q_3 - Q_1$:${steps(`\\text{A}: ${sa[3]} - ${sa[1]} = ${ia}`, `\\text{B}: ${sb[3]} - ${sb[1]} = ${ib}`, `${ia} - ${ib} = ${d}`)}`,
                    `四分位距是箱子的长度 $Q_3 - Q_1$：${steps(`\\text{A}: ${sa[3]} - ${sa[1]} = ${ia}`, `\\text{B}: ${sb[3]} - ${sb[1]} = ${ib}`, `${ia} - ${ib} = ${d}`)}`,
                  )
                : t(
                    `The range is the greatest value minus the least, from one end of the whiskers to the other:${steps(`\\text{A}: ${sa[4]} - ${sa[0]} = ${ra}`, `\\text{B}: ${sb[4]} - ${sb[0]} = ${rb}`, `${ra} - ${rb} = ${d}`)}`,
                    `极差是最大值减最小值，即从一端须线到另一端须线：${steps(`\\text{A}: ${sa[4]} - ${sa[0]} = ${ra}`, `\\text{B}: ${sb[4]} - ${sb[0]} = ${rb}`, `${ra} - ${rb} = ${d}`)}`,
                  ),
            }),
            figure: boxPairFigure(a, b),
          };
        }
      },
    },
    {
      id: "consistency-and-the-iqr",
      title: t("Consistency and the IQR", "稳定性与四分位距"),
      explanation: t(
        "Player A scored $14, 15, 15, 16, 16, 17, 30$ and player B scored $8, 11, 13, 16, 19, 21, 23$. A’s range, $30 - 14 = 16$, is greater than B’s, $23 - 8 = 15$, but A’s IQR is $17 - 15 = 2$ and B’s is $21 - 11 = 10$. Apart from one unusual game, A’s scores are much more consistent; A’s range is large only because of that single value.",
        "运动员 A 的得分是 $14, 15, 15, 16, 16, 17, 30$，运动员 B 的得分是 $8, 11, 13, 16, 19, 21, 23$。A 的极差 $30 - 14 = 16$ 比 B 的极差 $23 - 8 = 15$ 大，但 A 的四分位距是 $17 - 15 = 2$，B 的是 $21 - 11 = 10$。除了一场反常的比赛，A 的得分稳定得多；A 的极差大，只是因为那一个值。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const n = rng.pick([7, 11]);
          const c = rng.int(g.lo + 8, g.hi - 8);
          const tight = [...data(rng, n - 1, c - 2, c + 2), c + (rng.bool() ? 1 : -1) * rng.int(7, 8)];
          const wide = data(rng, n, c - 6, c + 6);
          const iqr = (xs: readonly number[]) => quartiles(xs)[1].sub(quartiles(xs)[0]);
          const range = (xs: readonly number[]) => Math.max(...xs) - Math.min(...xs);
          if (iqr(tight).cmp(iqr(wide)) >= 0 || range(tight) <= range(wide)) continue;
          if (Math.min(...tight) < g.lo || Math.max(...tight) > g.hi) continue;
          const tightIsA = rng.bool();
          const [a, b] = tightIsA ? [rng.shuffle(tight), wide] : [wide, rng.shuffle(tight)];
          const [qa, qb] = [quartiles(a), quartiles(b)];
          const line = (label: string, xs: readonly number[], q: [Q, Q]) =>
            `\\text{${label}}: \\quad \\text{IQR} = ${dec(q[1])} - ${dec(q[0])} = ${dec(iqr(xs))}, \\quad \\text{range} = ${Math.max(...xs)} - ${Math.min(...xs)} = ${range(xs)}`;
          const lineZh = (label: string, xs: readonly number[], q: [Q, Q]) =>
            `\\text{${label}}: \\quad \\text{四分位距} = ${dec(q[1])} - ${dec(q[0])} = ${dec(iqr(xs))}, \\quad \\text{极差} = ${Math.max(...xs)} - ${Math.min(...xs)} = ${range(xs)}`;
          const [x, y] = tightIsA ? ["A", "B"] : ["B", "A"];
          const extreme = tight[tight.length - 1]!;
          return pickChoice(
            rng,
            t(
              `The data show ${g.what.en}.${setsText(a, b)}Use the interquartile range to decide which data set is more consistent.`,
              `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}用四分位距判断哪组数据更稳定。`,
            ),
            t(`Data set ${x}`, `数据集 ${x}`),
            [t(`Data set ${y}`, `数据集 ${y}`), t("Both are equally consistent.", "两组同样稳定。")],
            t(
              `${steps(line("A", a, qa), line("B", b, qb))}Data set ${x} has the smaller IQR, so its typical values are more consistent. Its range is greater only because of the single value $${extreme}$.`,
              `${steps(lineZh("A", a, qa), lineZh("B", b, qb))}数据集 ${x} 的四分位距更小，所以它的典型数据更稳定。它的极差更大，只是因为有 $${extreme}$ 这一个值。`,
            ),
          );
        }
      },
    },
  ],
);

/** approx writes a number exactly when it has at most two decimal places, and otherwise rounded with ≈. */
const approx = (q: Q) => (clean(q) ? `= ${dec(q)}` : `\\approx ${dec(Q.of(Math.round((Number(q.n) * 100) / Number(q.d)), 100))}`);

/** madLine works out the mean and the MAD of one data set. */
const madLine = (label: string, xs: readonly number[]) =>
  `\\text{${label}}: \\quad \\text{mean} ${approx(mean(xs))}, \\quad \\text{MAD} ${approx(mad(xs))}`;

/** madLineZh works out the mean and the MAD of one data set, in Chinese. */
const madLineZh = (label: string, xs: readonly number[]) =>
  `\\text{${label}}: \\quad \\text{平均数} ${approx(mean(xs))}, \\quad \\text{MAD} ${approx(mad(xs))}`;

/** comparingDataSetVisualizationsUsingStandardDeviationAndMad compares spreads of dot plots by eye, as the MAD and standard deviation measure them. */
export const comparingDataSetVisualizationsUsingStandardDeviationAndMad = topic(
  "comparing-data-set-visualizations-using-standard-deviation-and-mad",
  t("Comparing Data Set Visualizations Using Standard Deviation and MAD", "用标准差和平均绝对偏差比较数据图"),
  t(
    "The mean absolute deviation and the standard deviation both measure how far the values typically lie from the mean; the standard deviation is found from squared distances, but it is large and small for the same kinds of data. On a dot plot, dots bunched near the center mean a small spread, and dots far out on both sides a large one, however tall the stacks. Sliding every dot the same distance changes the mean but not the spread.",
    "平均绝对偏差和标准差都衡量数据通常离平均数有多远；标准差是用距离的平方算出来的，但它的大小规律与平均绝对偏差相同。在点图中，点聚集在中心附近说明分散程度小，点向两侧散开说明分散程度大，与点堆的高矮无关。把每个点都平移同样的距离，平均数会变，分散程度不变。",
  ),
  ["comparing-measures-of-spread", "measuring-range-and-mad-from-dot-plots"],
  ["7.SP.B.3"],
  [
    {
      id: "the-greater-spread-on-dot-plots",
      title: t("The greater spread on dot plots", "从点图看哪组更分散"),
      explanation: t(
        "If A’s dots stand in tall stacks at $9$, $10$ and $11$ and B’s few dots lie from $4$ to $16$, B has the greater MAD and standard deviation: its values lie farther from the mean. Tall stacks show many values close together, which means a small spread, not a large one.",
        "如果 A 的点在 $9$、$10$、$11$ 处堆得很高，而 B 的少数几个点分布在 $4$ 到 $16$ 之间，那么 B 的平均绝对偏差和标准差更大：它的数据离平均数更远。高高的点堆表示许多数据挨在一起，说明分散程度小，而不是大。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const c = rng.int(g.lo + 6, g.hi - 6);
          const tight = data(rng, rng.int(10, 14), c - 2, c + 2);
          const wide = data(rng, rng.int(6, 9), c - 6, c + 6);
          // Make the difference plain to the eye: the wide data reach well out on both sides.
          if (Math.min(...wide) > c - 4 || Math.max(...wide) < c + 4) continue;
          if (mad(tight).mul(Q.of(2)).cmp(mad(wide)) > 0 || variance(tight).cmp(variance(wide)) >= 0) continue;
          const tightIsA = rng.bool();
          const [a, b] = tightIsA ? [tight, wide] : [wide, tight];
          const [x, y] = tightIsA ? ["B", "A"] : ["A", "B"];
          return pickChoice(
            rng,
            t(
              `The dot plots show ${g.what.en}. Which data set has the greater mean absolute deviation and standard deviation?`,
              `点图显示了${g.what["zh-CN"]}。哪组数据的平均绝对偏差和标准差更大？`,
            ),
            t(`Data set ${x}`, `数据集 ${x}`),
            [t(`Data set ${y}`, `数据集 ${y}`), t("They are about the same.", "两者差不多。")],
            t(
              `The dots of ${x} lie far from the center on both sides, while those of ${y} are bunched near it, however tall the stacks:${steps(madLine("A", a), madLine("B", b))}So ${x} has the greater MAD, and its standard deviation is greater too.`,
              `${x} 的点向两侧散开，离中心较远；${y} 的点虽然堆得高，却聚集在中心附近：${steps(madLineZh("A", a), madLineZh("B", b))}所以 ${x} 的平均绝对偏差更大，标准差也更大。`,
            ),
            dotPairFigure(a, b),
          );
        }
      },
    },
    {
      id: "shifted-data-keeps-its-spread",
      title: t("Shifted data keeps its spread", "平移后分散程度不变"),
      explanation: t(
        "If B’s dot plot is A’s moved $5$ to the right, every value of B is $5$ more than a value of A. The mean goes up by $5$, but every distance from the mean stays the same, so the MAD and the standard deviation do not change.",
        "如果 B 的点图是把 A 的点图向右平移 $5$ 得到的，那么 B 的每个数据都比 A 的某个数据大 $5$。平均数增加 $5$，但每个数据到平均数的距离都不变，所以平均绝对偏差和标准差都不变。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const k = (rng.bool() ? 1 : -1) * rng.int(2, 6);
          const c = rng.int(g.lo + 3 + Math.max(0, -k), g.hi - 3 - Math.max(0, k));
          const a = data(rng, rng.int(7, 10), c - 3, c + 3);
          const b = a.map((x) => x + k);
          if (mad(a).isZero()) continue;
          const kk = Math.abs(k);
          const more = k > 0;
          return pickChoice(
            rng,
            t(`The dot plots show ${g.what.en}. Which statement is true?`, `点图显示了${g.what["zh-CN"]}。哪种说法正确？`),
            t(
              `They have the same MAD, and the mean of B is $${kk}$ ${more ? "greater" : "less"} than the mean of A.`,
              `两组的平均绝对偏差相同，B 的平均数比 A 的${more ? "大" : "小"} $${kk}$。`,
            ),
            [
              t(
                `The MAD of B is $${kk}$ ${more ? "greater" : "less"} than the MAD of A.`,
                `B 的平均绝对偏差比 A 的${more ? "大" : "小"} $${kk}$。`,
              ),
              t("They have the same mean and the same MAD.", "两组的平均数相同，平均绝对偏差也相同。"),
              t(
                `They have the same mean, and B has the ${more ? "greater" : "smaller"} MAD.`,
                `两组的平均数相同，B 的平均绝对偏差更${more ? "大" : "小"}。`,
              ),
            ],
            t(
              `Each dot of B is a dot of A moved $${kk}$ to the ${more ? "right" : "left"}, so the mean moves by $${kk}$ while every distance from the mean stays the same:${steps(madLine("A", a), madLine("B", b))}`,
              `B 的每个点都是 A 的点向${more ? "右" : "左"}平移 $${kk}$ 得到的，所以平均数移动 $${kk}$，而每个数据到平均数的距离都不变：${steps(madLineZh("A", a), madLineZh("B", b))}`,
            ),
            dotPairFigure(a, b),
          );
        }
      },
    },
  ],
);

/** Process is something measured repeatedly by two sources, with typical means and standard deviations. */
interface Process {
  readonly intro: Text;
  readonly sources: readonly [Option, Option];
  readonly unit: Option;
  readonly mean: readonly [number, number];
  readonly sd: readonly [number, number];
  /** places is the number of decimal places of the means and standard deviations. */
  readonly places: number;
}

const processes: readonly Process[] = [
  {
    intro: t(
      "Two machines fill bags of rice. A sample of bags from each was weighed.",
      "两台机器灌装大米。从每台机器灌装的袋子中各抽取一些称重。",
    ),
    sources: [
      ["Machine A", "机器 A"],
      ["Machine B", "机器 B"],
    ],
    unit: ["g", "克"],
    mean: [995, 1005],
    sd: [2, 12],
    places: 1,
  },
  {
    intro: t("Two runners timed their 100-meter sprints over a month.", "两名跑步运动员记录了一个月里每次 100 米跑的成绩。"),
    sources: [
      ["Runner A", "运动员 A"],
      ["Runner B", "运动员 B"],
    ],
    unit: ["s", "秒"],
    mean: [12, 14],
    sd: [0.1, 0.8],
    places: 2,
  },
  {
    intro: t("Two archers measured how far their arrows landed from the center of the target.", "两名射箭运动员测量了箭落点到靶心的距离。"),
    sources: [
      ["Archer A", "运动员 A"],
      ["Archer B", "运动员 B"],
    ],
    unit: ["cm", "厘米"],
    mean: [4, 15],
    sd: [1, 6],
    places: 1,
  },
  {
    intro: t("Two bakeries weighed the loaves of bread they baked in a week.", "两家面包店称了一周里烤出的面包的质量。"),
    sources: [
      ["Bakery A", "面包店 A"],
      ["Bakery B", "面包店 B"],
    ],
    unit: ["g", "克"],
    mean: [490, 510],
    sd: [3, 15],
    places: 1,
  },
];

/** comparingDataSetsUsingStandardDeviationAndMad judges consistency by spread and measures a difference of means in units of spread. */
export const comparingDataSetsUsingStandardDeviationAndMad = topic(
  "comparing-data-sets-using-standard-deviation-and-mad",
  t("Comparing Data Sets Using Standard Deviation and MAD", "用标准差和平均绝对偏差比较数据集"),
  t(
    "A smaller standard deviation or MAD means more consistent values, whatever the means are. To judge whether two means are far apart, compare their difference with the spread: dividing the difference of the means by the MAD (or the standard deviation) says how many typical distances apart the centers are.",
    "标准差或平均绝对偏差越小，数据越稳定，与平均数大小无关。要判断两个平均数相差得远不远，要把它们的差与分散程度比较：用平均数之差除以平均绝对偏差（或标准差），就知道两组的中心相差几个“典型距离”。",
  ),
  ["mean-absolute-deviation", "comparing-means"],
  ["7.SP.B.3", "7.SP.B.4"],
  [
    {
      id: "consistency-from-the-standard-deviation",
      title: t("Consistency from the standard deviation", "由标准差判断稳定性"),
      explanation: t(
        "Machine A fills bags with a mean of $1002$ g and a standard deviation of $3.1$ g; machine B with a mean of $998$ g and a standard deviation of $6.4$ g. A is more consistent, because its bags vary less from their mean. Which mean is greater says nothing about consistency.",
        "机器 A 灌装的袋子平均 $1002$ 克，标准差 $3.1$ 克；机器 B 平均 $998$ 克，标准差 $6.4$ 克。A 更稳定，因为它灌装的袋子偏离平均数较少。哪个平均数更大，与稳定性无关。",
      ),
      generate(rng) {
        const p = rng.pick(processes);
        const f = 10 ** p.places;
        const value = (lo: number, hi: number) => Q.of(rng.int(lo * f, hi * f), f);
        for (;;) {
          const means = [value(p.mean[0], p.mean[1]), value(p.mean[0], p.mean[1])] as const;
          const sds = [value(p.sd[0], p.sd[1]), value(p.sd[0], p.sd[1])] as const;
          if (means[0].eq(means[1]) || sds[0].cmp(sds[1]) === 0) continue;
          if (sds[0].cmp(sds[1].mul(Q.of(3, 4))) > 0 && sds[1].cmp(sds[0].mul(Q.of(3, 4))) > 0) continue;
          const x = sds[0].cmp(sds[1]) < 0 ? 0 : 1;
          const y = 1 - x;
          const [ux, uz] = p.unit;
          const greaterMean = means[y]!.cmp(means[x]!) > 0;
          const describe = (i: number, lang: 0 | 1) =>
            lang === 0
              ? `${p.sources[i]![0]}: mean $${dec(means[i]!)}$ ${ux}, standard deviation $${dec(sds[i]!)}$ ${ux}`
              : `${p.sources[i]![1]}：平均数 $${dec(means[i]!)}$ ${uz}，标准差 $${dec(sds[i]!)}$ ${uz}`;
          return pickChoice(
            rng,
            t(
              `${p.intro.en}\n\n${describe(0, 0)}\n\n${describe(1, 0)}\n\nWhich is more consistent, and why?`,
              `${p.intro["zh-CN"]}\n\n${describe(0, 1)}\n\n${describe(1, 1)}\n\n哪个更稳定？为什么？`,
            ),
            t(`${p.sources[x]![0]}, because its standard deviation is smaller.`, `${p.sources[x]![1]}，因为它的标准差更小。`),
            [
              t(`${p.sources[y]![0]}, because its standard deviation is greater.`, `${p.sources[y]![1]}，因为它的标准差更大。`),
              t(
                `${p.sources[y]![0]}, because its mean is ${greaterMean ? "greater" : "smaller"}.`,
                `${p.sources[y]![1]}，因为它的平均数更${greaterMean ? "大" : "小"}。`,
              ),
              t("Neither, because data sets with different means cannot be compared.", "无法判断，因为平均数不同的数据集不能比较。"),
            ],
            t(
              `A smaller standard deviation means the values lie closer to their mean. $${dec(sds[x]!)}$ is less than $${dec(sds[y]!)}$, so ${p.sources[x]![0]} is more consistent; the means do not decide it.`,
              `标准差越小，数据越靠近平均数。$${dec(sds[x]!)}$ 小于 $${dec(sds[y]!)}$，所以${p.sources[x]![1]} 更稳定；这与平均数无关。`,
            ),
          );
        }
      },
    },
    {
      id: "differences-of-means-in-units-of-spread",
      title: t("Differences of means in units of spread", "以分散程度为单位的平均数之差"),
      explanation: t(
        "The mean of A is $24$, the mean of B is $18$, and both have a MAD of $2$. The difference of the means is $24 - 18 = 6$, which is $\\frac{6}{2} = 3$ MADs. A difference of several MADs is large compared with the variation inside each group.",
        "A 的平均数是 $24$，B 的平均数是 $18$，两组的平均绝对偏差都是 $2$。平均数之差是 $24 - 18 = 6$，相当于 $\\frac{6}{2} = 3$ 个平均绝对偏差。相差好几个平均绝对偏差，说明与每组内部的波动相比，这个差距很大。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        const sd = rng.bool();
        const name = sd ? t("standard deviation", "标准差") : t("mean absolute deviation", "平均绝对偏差");
        for (;;) {
          const spread = Q.of(rng.pick([3, 4, 5, 6, 8]), 2);
          const r = Q.of(rng.int(1, 8), 2);
          const d = spread.mul(r);
          const mb = Q.of(rng.int(g.lo + 2, g.hi - 8));
          const ma = mb.add(d);
          if (!clean(d) || ma.cmp(Q.of(g.hi)) > 0) continue;
          return numberProblem({
            prompt: t(
              `The data show ${g.what.en}. The mean of A is $${dec(ma)}$ and the mean of B is $${dec(mb)}$, and both data sets have a ${name.en} of $${dec(spread)}$. How many ${name.en}s apart are the means?`,
              `数据显示了${g.what["zh-CN"]}。A 的平均数是 $${dec(ma)}$，B 的平均数是 $${dec(mb)}$，两组的${name["zh-CN"]}都是 $${dec(spread)}$。两个平均数相差几个${name["zh-CN"]}？`,
            ),
            answer: r,
            form: "decimal",
            // The difference itself, the ratio upside down, and half the difference.
            wrong: [d, spread.div(d), d.div(spread.mul(Q.of(2)))].filter(clean),
            solution: t(
              `Divide the difference of the means by the ${name.en}:${steps(`\\frac{${dec(ma)} - ${dec(mb)}}{${dec(spread)}} = \\frac{${dec(d)}}{${dec(spread)}} = ${dec(r)}`)}`,
              `用平均数之差除以${name["zh-CN"]}：${steps(`\\frac{${dec(ma)} - ${dec(mb)}}{${dec(spread)}} = \\frac{${dec(d)}}{${dec(spread)}} = ${dec(r)}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** overlapping draws data set A, with a whole-number mean and a nonzero MAD, and B as A shifted up by k. */
function overlapping(rng: Rng, g: Groups, k: number): { a: number[]; b: number[] } {
  for (;;) {
    const c = rng.int(g.lo + 3, g.hi - 3 - k);
    const a = data(rng, rng.int(8, 10), c - 3, c + 3);
    if (mean(a).isInteger() && !mad(a).isZero()) return { a, b: a.map((x) => x + k) };
  }
}

const overlapStatements: readonly Text[] = [
  t(
    "The distributions overlap a lot: the difference between the groups is small compared with the variation within each group.",
    "两个分布重叠很多：与每组内部的波动相比，两组之间的差距很小。",
  ),
  t(
    "The distributions barely overlap: the difference between the groups is large compared with the variation within each group.",
    "两个分布几乎不重叠：与每组内部的波动相比，两组之间的差距很大。",
  ),
  t(
    "The distributions overlap a lot: the difference between the groups is large compared with the variation within each group.",
    "两个分布重叠很多：与每组内部的波动相比，两组之间的差距很大。",
  ),
  t(
    "The distributions barely overlap: the difference between the groups is small compared with the variation within each group.",
    "两个分布几乎不重叠：与每组内部的波动相比，两组之间的差距很小。",
  ),
];

/** assessingVisualOverlapOfDataDistributions judges and measures how much two distributions overlap, by the difference of means in MADs. */
export const assessingVisualOverlapOfDataDistributions = topic(
  "assessing-visual-overlap-of-data-distributions",
  t("Assessing Visual Overlap of Data Distributions", "评估数据分布的重叠程度"),
  t(
    "When two distributions have similar spreads, the difference of their means divided by the MAD measures how much they overlap. A ratio below about 1 means the dot plots overlap a lot and the groups are hard to tell apart; a ratio of 3 or more means they barely overlap and the difference between the groups stands out against the variation within them.",
    "两个分布的分散程度相近时，用平均数之差除以平均绝对偏差，可以衡量它们的重叠程度。这个比值小于 1 左右时，点图重叠很多，两组很难区分；比值达到 3 或更大时，点图几乎不重叠，两组之间的差距相对组内波动非常明显。",
  ),
  ["comparing-data-set-visualizations-using-standard-deviation-and-mad", "comparing-data-sets-using-standard-deviation-and-mad"],
  ["7.SP.B.3"],
  [
    {
      id: "judging-overlap",
      title: t("Judging overlap", "判断重叠程度"),
      explanation: t(
        "If A and B both have a MAD of about $1.5$ and their means are $10$ and $11$, the means differ by less than one MAD: most dots of the two plots sit over the same numbers, and the groups are hard to tell apart. If the means are $10$ and $16$, they differ by $4$ MADs and the plots barely overlap.",
        "如果 A 和 B 的平均绝对偏差都约为 $1.5$，平均数分别是 $10$ 和 $11$，那么两个平均数相差不到一个平均绝对偏差：两个点图的大部分点落在相同的数上，两组很难区分。如果平均数是 $10$ 和 $16$，就相差 $4$ 个平均绝对偏差，两个点图几乎不重叠。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        const apart = rng.bool();
        for (;;) {
          const k = apart ? rng.int(6, 9) : rng.int(1, 2);
          const { a, b } = overlapping(rng, g, k);
          const ratio = Q.of(k).div(mad(a));
          if (apart ? ratio.cmp(Q.of(3)) < 0 : ratio.cmp(Q.of(1)) > 0) continue;
          return pickChoice(
            rng,
            t(`The dot plots show ${g.what.en}. Which statement describes them?`, `点图显示了${g.what["zh-CN"]}。哪种说法描述了它们？`),
            overlapStatements[apart ? 1 : 0]!,
            overlapStatements.filter((_, i) => i !== (apart ? 1 : 0)),
            t(
              `${steps(madLine("A", a), madLine("B", b))}The means differ by $${k}$, which is $\\frac{${k}}{\\text{MAD}} ${approx(ratio)}$ MADs: ${apart ? "large compared with the spread, so the plots barely overlap" : "no more than one MAD, so the plots overlap a lot"}.`,
              `${steps(madLineZh("A", a), madLineZh("B", b))}两个平均数相差 $${k}$，相当于 $\\frac{${k}}{\\text{MAD}} ${approx(ratio)}$ 个平均绝对偏差：${apart ? "相对分散程度很大，所以两个点图几乎不重叠" : "不超过一个平均绝对偏差，所以两个点图重叠很多"}。`,
            ),
            dotPairFigure(a, b),
          );
        }
      },
    },
    {
      id: "measuring-overlap",
      title: t("Measuring overlap", "衡量重叠程度"),
      explanation: t(
        "A: $8, 9, 10, 10, 11, 12$ has mean $10$ and distances $2, 1, 0, 0, 1, 2$, so its MAD is $1$. B is A moved up by $3$, so its mean is $13$ and its MAD is also $1$. The means differ by $\\frac{13 - 10}{1} = 3$ MADs, so the plots barely overlap.",
        "A：$8, 9, 10, 10, 11, 12$ 的平均数是 $10$，各数到平均数的距离是 $2, 1, 0, 0, 1, 2$，所以平均绝对偏差是 $1$。B 是 A 整体加 $3$，所以平均数是 $13$，平均绝对偏差也是 $1$。两个平均数相差 $\\frac{13 - 10}{1} = 3$ 个平均绝对偏差，所以两个点图几乎不重叠。",
      ),
      generate(rng) {
        const g = rng.pick(comparisons);
        for (;;) {
          const k = rng.int(1, 8);
          const { a, b } = overlapping(rng, g, k);
          const ratio = Q.of(k).div(mad(a));
          if (!clean(ratio) || !clean(mad(a))) continue;
          const mu = mean(a);
          const distances = a.map((x) => Math.abs(x - Number(mu.n)));
          return {
            ...numberProblem({
              prompt: t(
                `The dot plots show ${g.what.en}. Both data sets have the same MAD. How many MADs apart are their means?`,
                `点图显示了${g.what["zh-CN"]}。两组数据的平均绝对偏差相同。两个平均数相差几个平均绝对偏差？`,
              ),
              answer: ratio,
              form: "decimal",
              // The difference of the means itself, the ratio upside down, and the MAD.
              wrong: [Q.of(k), mad(a).div(Q.of(k)), mad(a)].filter(clean),
              solution: t(
                `A has mean $\\frac{${sum(a)}}{${a.length}} = ${dec(mu)}$, distances $${list(distances)}$ from it, and MAD $\\frac{${sum(distances)}}{${a.length}} = ${dec(mad(a))}$. B has mean $${dec(mean(b))}$. So${steps(`\\frac{${dec(mean(b))} - ${dec(mu)}}{${dec(mad(a))}} = ${dec(ratio)}`)}`,
                `A 的平均数是 $\\frac{${sum(a)}}{${a.length}} = ${dec(mu)}$，各数到它的距离是 $${list(distances)}$，平均绝对偏差是 $\\frac{${sum(distances)}}{${a.length}} = ${dec(mad(a))}$。B 的平均数是 $${dec(mean(b))}$。所以${steps(`\\frac{${dec(mean(b))} - ${dec(mu)}}{${dec(mad(a))}} = ${dec(ratio)}`)}`,
              ),
            }),
            figure: dotPairFigure(a, b),
          };
        }
      },
    },
  ],
);

/** grade7StatisticsTopics lists the 7th grade topics on sampling, representing data and comparing data sets. */
export const grade7StatisticsTopics: readonly TopicDef[] = [
  estimationFromSamples,
  biasedAndUnbiasedSamples,
  interpretingSurveyResults,
  samplingAndMarginOfError,
  jointFrequencyTables,
  cumulativeFrequency,
  calculatingMeansFromFrequencyTables,
  calculatingMediansFromFrequencyTables,
  calculatingModesFromFrequencyTables,
  calculatingModesAndMediansFromHistograms,
  calculatingMeansFromHistograms,
  comparingMeans,
  comparingMedians,
  comparingModes,
  comparingDataSetsUsingRangeAndQuartiles,
  comparingDataSetVisualizationsUsingStandardDeviationAndMad,
  comparingDataSetsUsingStandardDeviationAndMad,
  assessingVisualOverlapOfDataDistributions,
];
