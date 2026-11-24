import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { Axis, FiveNumberSummary } from "@ga/subject-math";
import { boxPlot, dec, dotPlot, Q, svgDocument } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { isTerminating, yesNo } from "../problems.ts";
import { type MathWrong, type Pair, tableFigure as rowFigure, type Wrong } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, drawn, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { tableFigure } from "./grade-8-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

// 7th Grade Math, statistics: estimating from samples, bias, survey results and margins of error,
// joint and cumulative frequency tables, the mean, median and mode of tabulated and grouped data,
// and comparing two data sets by their centers, spreads and overlap.

/** ordinal writes a position with its English suffix, as in "$22$nd" and "$13$th". */
function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `$${n}$${suffix}`;
}

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

/** dotsFigure draws whole-number data as a dot plot on an axis from lo to hi. */
function dotsFigure(xs: readonly number[], lo: number, hi: number, en: string, zh: string): Figure {
  return { svg: dotPlot(xs, { min: lo, max: hi, step: 1 }), alt: t(en, zh) };
}

/** sampleFigure draws a sample's answers as a dot plot, one dot for each answer. */
const sampleFigure = (xs: readonly number[], lo: number, hi: number) =>
  dotsFigure(xs, lo, hi, `A dot plot of the ${xs.length} answers in the sample.`, `样本中 ${xs.length} 个回答的点图。`);

/** estimationFromSamples estimates means, totals and proportions of a population from random samples. */
export const estimationFromSamples = withIntro(
  topic(
    "estimation-from-samples",
    t("Estimation From Samples", "用样本估计"),
    t(
      "A random sample tends to look like its population, so a measure of the sample estimates the same measure of the population: the sample mean estimates the population mean, and a proportion in the sample estimates the proportion in the population. Different samples give somewhat different estimates; averaging several of them gives a better one.",
      "随机样本往往与总体相似，所以样本的统计量可以估计总体的同一个量：样本平均数估计总体平均数，样本中的比例估计总体中的比例。不同的样本给出的估计会有所不同；把几个样本的估计取平均，估计会更好。",
    ),
    ["sampling", "the-mean-of-a-data-set"],
    ["7.SP.A.2"],
    [
      lesson(
        "estimating-a-population-mean",
        ["Estimating a population mean", "估计总体平均数"],
        [
          [
            "To estimate the mean of a population, find the mean of a random sample. If $8$ randomly chosen students read $3, 5, 0, 2, 4, 6, 1, 3$ books over the summer, the sample mean is $\\frac{24}{8} = 3$, so students at the school read about $3$ books each.",
            "要估计总体的平均数，就求随机样本的平均数。随机选出的 $8$ 名学生暑假分别读了 $3, 5, 0, 2, 4, 6, 1, 3$ 本书，样本平均数是 $\\frac{24}{8} = 3$，所以该校学生平均每人约读 $3$ 本书。",
          ],
          [
            "The mean is the balance point: the distances below $3$ are $3 + 1 + 2 = 6$ and above it $2 + 1 + 3 = 6$, so they balance.",
            "平均数是平衡点：低于 $3$ 的距离是 $3 + 1 + 2 = 6$，高于 $3$ 的是 $2 + 1 + 3 = 6$，两边平衡。",
          ],
          ["Divide by the number of values in the sample, counting the zeros.", "要除以样本中数据的个数，$0$ 也要算在内。"],
        ],
        (rng) => {
          const s = rng.pick(sampled);
          for (;;) {
            const n = rng.pick([8, 10, 12, 16, 20]);
            const xs = Array.from({ length: n }, () => rng.int(s.lo, s.hi));
            const mu = mean(xs);
            if (!clean(mu)) continue;
            const nonzero = xs.filter((x) => x !== 0).length;
            const offs: Off[] = [
              [median(xs), "That is the median of the sample; the question asks for the mean.", "这是样本的中位数；题目要的是平均数。"],
              ...(nonzero < n
                ? [[Q.of(sum(xs), nonzero), "That leaves out the zeros, but they are answers too.", "这是漏掉了 0，但 0 也是回答。"] as Off]
                : []),
              [Q.of(sum(xs), n - 1), "That divides by one less than the number of answers.", "这是除以了比回答个数少 1 的数。"],
            ];
            return valued(
              [
                `A random sample of ${n} ${s.units.en} ${s.population.en} were asked ${s.question.en}. Their answers were $${list(xs)}$. Estimate the mean answer of ${s.all.en}.`,
                `从${s.population["zh-CN"]}随机抽取 ${n} ${s.units["zh-CN"]}，询问他们${s.question["zh-CN"]}。回答分别是 $${list(xs)}$。估计${s.all["zh-CN"]}的平均回答。`,
              ],
              mu,
              [
                [
                  ["Add the answers", "把回答相加"],
                  [`All ${n} answers together:`, `${n} 个回答的和：`],
                  [`${xs.join(" + ")} = ${sum(xs)}`],
                ],
                [
                  ["Divide by the sample size", "除以样本容量"],
                  ["The sample mean estimates the population mean:", "用样本平均数估计总体平均数："],
                  [`\\frac{${sum(xs)}}{${n}} = ${dec(mu)}`],
                ],
              ],
              [
                `Multiply back: $${dec(mu)} \\times ${n} = ${sum(xs)}$, the sum of the answers.`,
                `乘回去：$${dec(mu)} \\times ${n} = ${sum(xs)}$，正是回答的总和。`,
              ],
              offs.filter(([v]) => isTerminating(v)),
              { form: "decimal", figure: sampleFigure(xs, s.lo, s.hi) },
            );
          }
        },
        sampleFigure([3, 5, 0, 2, 4, 6, 1, 3], 0, 9),
      ),
      lesson(
        "estimating-a-population-total",
        ["Estimating a population total", "估计总体的总量"],
        [
          [
            "A sample mean also estimates a total. If a random sample of $10$ households has $28$ people in all, the mean is $2.8$ people per household, so the $1500$ households of the town have about $2.8 \\times 1500 = 4200$ people.",
            "样本平均数也可以用来估计总量。随机抽取 $10$ 户人家，共有 $28$ 人，平均每户 $2.8$ 人，所以全镇 $1500$ 户人家大约有 $2.8 \\times 1500 = 4200$ 人。",
          ],
          [
            "Scale the sample total instead: the town is $1500 \\div 10 = 150$ times the sample, and $28 \\times 150 = 4200$.",
            "也可以把样本总和放大：全镇是样本的 $1500 \\div 10 = 150$ 倍，$28 \\times 150 = 4200$。",
          ],
          ["Multiply the population size by the sample mean, not by the sample total.", "要用总体数量乘样本平均数，而不是乘样本总和。"],
        ],
        (rng) => {
          const s = rng.pick(sampled);
          for (;;) {
            const n = rng.pick([8, 10, 12, 15, 20, 25]);
            const xs = Array.from({ length: n }, () => rng.int(s.lo, s.hi));
            const mu = mean(xs);
            const pop = rng.pick([200, 300, 400, 600, 800, 1200, 1500, 2000]);
            const total = mu.mul(Q.of(pop));
            if (!total.isInteger() || !clean(mu)) continue;
            return valued(
              [
                `A random sample of ${n} of the ${pop} ${s.units.en} ${s.population.en} were asked ${s.question.en}. Their answers were $${list(xs)}$. Estimate ${s.total(pop).en}.`,
                `从${s.population["zh-CN"]}的 ${pop} ${s.units["zh-CN"]}中随机抽取 ${n} ${s.units["zh-CN"]}，询问他们${s.question["zh-CN"]}。回答分别是 $${list(xs)}$。估计${s.total(pop)["zh-CN"]}。`,
              ],
              total,
              [
                [
                  ["Find the sample mean", "求样本平均数"],
                  [`The answers add up to $${sum(xs)}$:`, `回答的总和是 $${sum(xs)}$：`],
                  [`\\frac{${sum(xs)}}{${n}} = ${dec(mu)}`],
                ],
                [
                  ["Multiply by the population", "乘总体数量"],
                  [`Each of the ${pop} counts for about that much:`, `${pop} 个中每一个大约都按这么多计算：`],
                  [`${dec(mu)} \\times ${pop} = ${total.toLatex()}`],
                ],
              ],
              [
                `Scale the sample total: the population is $\\frac{${pop}}{${n}}$ times the sample, and $${sum(xs)} \\times \\frac{${pop}}{${n}} = \\frac{${sum(xs) * pop}}{${n}} = ${total.toLatex()}$.`,
                `放大样本总和：总体是样本的 $\\frac{${pop}}{${n}}$ 倍，$${sum(xs)} \\times \\frac{${pop}}{${n}} = \\frac{${sum(xs) * pop}}{${n}} = ${total.toLatex()}$。`,
              ],
              [
                [
                  sum(xs) * pop,
                  "That multiplies the sample total, not the sample mean, by the population.",
                  "这是用样本总和而不是样本平均数乘总体数量。",
                ],
                [
                  mu,
                  "That is the mean for one member; the question asks for the total of all of them.",
                  "这是每一个的平均数；题目要的是全体的总量。",
                ],
                [sum(xs) + pop, "That adds the population size instead of multiplying by it.", "这是加上了总体数量，而不是乘它。"],
              ],
              { form: "integer", figure: sampleFigure(xs, s.lo, s.hi) },
            );
          }
        },
        dotsFigure([2, 3, 1, 4, 3, 2, 5, 3, 2, 3], 1, 7, "A dot plot of 10 households, 28 people in all.", "10 户人家的点图，共 28 人。"),
      ),
      lesson(
        "combining-several-samples",
        ["Combining several samples", "综合几个样本"],
        [
          [
            "Four random samples of $50$ students were asked whether they ride the bus, and $12, 15, 9, 14$ said yes. The samples vary, so average them: $\\frac{12 + 15 + 9 + 14}{4} = 12.5$ out of $50$, which is $25\\%$. Of the $1200$ students, about $0.25 \\times 1200 = 300$ ride the bus.",
            "随机抽取 $4$ 个各有 $50$ 名学生的样本，询问是否坐校车，回答“是”的分别有 $12, 15, 9, 14$ 人。样本之间有差异，所以取平均：$\\frac{12 + 15 + 9 + 14}{4} = 12.5$，占 $50$ 人的 $25\\%$。全校 $1200$ 名学生中，约有 $0.25 \\times 1200 = 300$ 人坐校车。",
          ],
          [
            "Pool the samples instead: $50$ yes answers out of $200$ students is $25\\%$ too, and $\\frac{50}{200} \\times 1200 = 300$.",
            "也可以把样本合在一起：$200$ 名学生中有 $50$ 人回答“是”，也是 $25\\%$，$\\frac{50}{200} \\times 1200 = 300$。",
          ],
          [
            "Average the counts before scaling up; adding them counts the students of several samples as if they were one.",
            "先求平均再放大；直接相加是把几个样本的人数当成了一个样本。",
          ],
        ],
        (rng) => {
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
            return valued(
              [
                `The students in each of ${k} random samples of ${n} students were asked whether they ${en}. The numbers who said yes in the samples were $${list(counts)}$. Use the mean of the samples to estimate how many of the ${pop} students in the school ${en}.`,
                `随机抽取 ${k} 个样本，每个样本 ${n} 名学生，询问他们是否${zh}。回答“是”的人数分别是 $${list(counts)}$。用这些样本的平均数估计全校 ${pop} 名学生中有多少人${zh}。`,
              ],
              answer,
              [
                [
                  ["Average the samples", "求样本的平均数"],
                  [`The mean number of yes answers out of ${n}:`, `每 ${n} 人中回答“是”的平均人数：`],
                  [`\\frac{${counts.join(" + ")}}{${k}} = ${dec(avg)}`],
                ],
                [
                  ["Scale up to the school", "推广到全校"],
                  ["The same fraction of all the students:", "全校学生中的同样比例："],
                  [`\\frac{${dec(avg)}}{${n}} \\times ${pop} = ${answer.toLatex()}`],
                ],
              ],
              [
                `Pool the samples: $${sum(counts)}$ yes answers out of $${k * n}$ students, and $\\frac{${sum(counts)}}{${k * n}} \\times ${pop} = ${answer.toLatex()}$.`,
                `把样本合在一起：$${k * n}$ 名学生中有 $${sum(counts)}$ 人回答“是”，$\\frac{${sum(counts)}}{${k * n}} \\times ${pop} = ${answer.toLatex()}$。`,
              ],
              [
                [Q.of(counts[0]! * pop, n), "That uses only the first sample.", "这只用了第一个样本。"],
                [
                  Q.of(sum(counts) * pop, n),
                  "That adds the counts without averaging them, as if they came from one sample.",
                  "这是把人数相加而没有取平均，好像它们来自同一个样本。",
                ],
                [avg, "That is the mean count in one sample; scale it up to the school.", "这是一个样本中的平均人数；还要推广到全校。"],
              ],
              {
                form: "integer",
                figure: rowFigure(
                  counts.map((_, i) => `${i + 1}`),
                  counts,
                ),
              },
            );
          }
        },
        rowFigure(["1", "2", "3", "4"], [12, 15, 9, 14]),
      ),
    ],
  ),
  [
    "A cook tastes one spoonful of soup to know how the whole pot tastes. A spoonful from a well-stirred pot is like a random sample.",
    "厨师尝一勺汤，就知道整锅汤的味道。从搅匀的锅里舀一勺，就像随机样本。",
  ],
  [
    "If the pot is stirred, every spoonful tastes about the same; several spoonfuls give an even better idea.",
    "汤搅匀了，每一勺的味道都差不多；多尝几勺，判断更准。",
  ],
  ["estimate the mean, the total and the share of a population from random samples.", "学习用随机样本估计总体的平均数、总量和比例。"],
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

/** whoCanBeChosen says, for each kind of sample, who has a chance of being in it. */
const whoCanBeChosen: Record<Bias, Pair> = {
  excluded: ["Only one part of the population can be reached this way.", "这种方法只能接触到总体的一部分。"],
  volunteer: ["The people decide for themselves whether to answer.", "是否回答由人们自己决定。"],
  leading: ["The people are chosen at random, so everyone has the same chance.", "人是随机选的，所以每个人的机会都相同。"],
  none: ["The people are chosen at random, so everyone has the same chance.", "人是随机选的，所以每个人的机会都相同。"],
};

/** howAsked says, for each kind of sample, whether the question is neutral. */
const howAsked: Record<Bias, Pair> = {
  excluded: [
    "The question is neutral, but the people asked may answer differently from the rest.",
    "问题是中立的，但被问到的人的回答可能与其他人不同。",
  ],
  volunteer: [
    "The question is neutral, but those who answer tend to have the strongest opinions.",
    "问题是中立的，但回答的人往往意见最强烈。",
  ],
  leading: ["The wording suggests which answer is expected.", "问题的措辞暗示了期望的回答。"],
  none: ["The question is neutral and does not push toward an answer.", "问题是中立的，没有引导回答。"],
};

/** notThisBias explains why a sample of one kind does not have the bias of another. */
function notThisBias(actual: Bias, said: Bias): Pair {
  if (said === "none")
    return [
      `The sample is biased: ${whoCanBeChosen[actual][0]} ${howAsked[actual][0]}`,
      `这个样本有偏差：${whoCanBeChosen[actual][1]}${howAsked[actual][1]}`,
    ];
  if (said === "excluded") return ["Nobody in the population is shut out by this method.", "这种方法没有把总体中的任何人排除在外。"];
  if (said === "volunteer")
    return ["The people are picked by the surveyors; they do not choose themselves.", "人是调查者挑的，不是自己选择参与的。"];
  return ["The question does not push toward an answer.", "问题没有引导回答。"];
}

/** populationTape draws a population as a bar of ten parts, with the parts a sample can come from shaded. */
function populationTape(lit: readonly number[], en: string, zh: string): Figure {
  return tapeFigure(
    [{ total: "N", pieces: Array.from({ length: 10 }, (_, i) => ({ size: 1, text: "", lit: lit.includes(i) })) }],
    [en, zh],
  );
}

/** biasedAndUnbiasedSamples tells representative samples from biased ones and names the bias. */
export const biasedAndUnbiasedSamples = withIntro(
  topic(
    "biased-and-unbiased-samples",
    t("Biased and Unbiased Samples", "有偏样本与无偏样本"),
    t(
      "A sample is unbiased when every member of the population has the same chance of being in it and the question is asked neutrally; only then does it represent the population. A sample is biased when part of the population cannot be chosen, when people choose themselves, or when the question pushes toward an answer.",
      "如果总体中每个成员被选入样本的机会都相同，而且问题的问法是中立的，样本就是无偏的；只有这样，它才能代表总体。如果总体中有一部分人不可能被选中，或者样本中的人是自己选择参与的，或者问题引导人们给出某种回答，样本就是有偏的。",
    ),
    ["sampling"],
    ["7.SP.A.1"],
    [
      lesson(
        "choosing-a-representative-sample",
        ["Choosing a representative sample", "选出有代表性的样本"],
        [
          [
            "To learn how all students feel about a later start time, choose students at random from the list of all students. Surveying only the early-morning club leaves out everyone else, and a link on the website collects only the students who care enough to answer.",
            "要了解全体学生对推迟上学时间的看法，应该从全体学生名单中随机抽取。只调查早晨兴趣小组会遗漏其他所有学生；网站上的链接只能收集到那些足够在意、愿意回复的学生的意见。",
          ],
          [
            "Rule out the others one by one: each leaves people out, lets people choose themselves, or leads the answer. The one left is the random sample.",
            "把其他方法逐个排除：它们要么遗漏了一部分人，要么让人自己选择参与，要么引导回答。剩下的就是随机样本。",
          ],
          [
            "A big sample is not enough: a thousand volunteers still speak only for people who volunteer.",
            "样本大还不够：一千个自愿者仍然只代表愿意参与的人。",
          ],
        ],
        (rng) => {
          const s = rng.pick(studies);
          const goal = s.goal(rng.pick([800, 1200, 1500, 2400, 3000, 5000]));
          const methods = s.methods(rng.pick([40, 50, 60, 80, 100, 120, 150, 200]));
          const correct = methods.find(([b]) => b === "none")![1];
          const wrong = methods
            .filter(([b]) => b !== "none")
            .map(
              ([b, m]): Wrong => [
                [m.en, m["zh-CN"]],
                `${biasReasons[b].en} So the sample is biased.`,
                `${biasReasons[b]["zh-CN"]}所以样本有偏差。`,
              ],
            );
          return chosen(
            rng,
            [`${goal.en} Which method gives a sample that represents the population?`, `${goal["zh-CN"]}哪种方法得到的样本能代表总体？`],
            [correct.en, correct["zh-CN"]],
            wrong,
            [
              [
                ["Ask who can be chosen", "看谁能被选中"],
                [
                  "Choosing at random from the whole population gives every member the same chance.",
                  "从整个总体中随机抽取，每个成员的机会都相同。",
                ],
              ],
              [
                ["Ask how the question is put", "看问题怎么问"],
                [
                  "The question in that method is neutral, so it does not push toward an answer.",
                  "这种方法中的问题是中立的，没有引导回答。",
                ],
              ],
            ],
            [
              "Rule out the others: each one leaves people out, lets people choose themselves, or pushes toward an answer.",
              "排除其他方法：它们要么遗漏了一部分人，要么让人自己选择参与，要么引导回答。",
            ],
            populationTape(
              [1, 4, 8],
              "A population as a bar of ten parts, with a random sample spread across it.",
              "把总体画成十段的长条，随机样本分散在各处。",
            ),
          );
        },
        populationTape(
          [1, 4, 8],
          "A population as a bar of ten parts, with a random sample spread across it.",
          "把总体画成十段的长条，随机样本分散在各处。",
        ),
      ),
      lesson(
        "naming-the-bias",
        ["Naming the bias", "说出偏差的原因"],
        [
          [
            "A sample can be biased in three common ways: **part of the population is left out**, as when a survey about a new library asks only people leaving the old one; **people choose themselves**, as with a form readers can mail back; **the question is leading**, as in “Wouldn’t a new library make our town better?”",
            "样本常见的偏差有三种：**遗漏了总体的一部分**，比如调查新图书馆时只问从旧图书馆出来的人；**人们自己选择参与**，比如请读者寄回表格；**问题有引导性**，比如“新图书馆难道不会让我们的镇更好吗？”",
          ],
          [
            "Test the sample with two questions: could everyone be chosen, and is the question neutral? A random sample with a neutral question passes both.",
            "用两个问题检验样本：每个人都可能被选中吗？问题是中立的吗？随机抽取并用中立问题提问的样本两条都满足。",
          ],
          [
            "People chosen at random can still be asked a leading question; check the wording too.",
            "随机选出的人也可能被问一个引导性的问题；措辞也要检查。",
          ],
        ],
        (rng) => {
          const s = rng.pick(studies);
          const goal = s.goal(rng.pick([800, 1200, 1500, 2400, 3000, 5000]));
          const [bias, method] = rng.pick(s.methods(rng.pick([40, 50, 60, 80, 100, 120, 150, 200])));
          const wrong = (Object.keys(biasReasons) as Bias[])
            .filter((b) => b !== bias)
            .map((b): Wrong => {
              const [en, zh] = notThisBias(bias, b);
              return [[biasReasons[b].en, biasReasons[b]["zh-CN"]], en, zh];
            });
          return chosen(
            rng,
            [
              `${goal.en} It decides to do this: ${method.en} Which statement describes the sample?`,
              `${goal["zh-CN"]}它决定这样做：${method["zh-CN"]}哪种说法描述了这个样本？`,
            ],
            [biasReasons[bias].en, biasReasons[bias]["zh-CN"]],
            wrong,
            [
              [["Ask who can be chosen", "看谁能被选中"], whoCanBeChosen[bias]],
              [["Ask how the question is put", "看问题怎么问"], howAsked[bias]],
            ],
            bias === "none"
              ? [
                  "Neither test fails: everyone could be chosen and the question is neutral, so nothing makes the sample lean one way.",
                  "两项检验都通过：每个人都可能被选中，问题也是中立的，所以没有什么让样本偏向一边。",
                ]
              : [
                  "Exactly one of the two tests fails, and that failure is the bias named.",
                  "两项检验中恰好有一项不通过，这一项就是所说的偏差。",
                ],
            populationTape(
              bias === "excluded" ? [0, 1, 2] : [1, 4, 8],
              "A population as a bar of ten parts, with the parts the sample comes from shaded.",
              "把总体画成十段的长条，样本来自涂色的部分。",
            ),
          );
        },
        populationTape(
          [0, 1, 2],
          "A population as a bar of ten parts; a sample from the first three parts leaves the rest out.",
          "把总体画成十段的长条；只从前三段抽样，其余部分被遗漏了。",
        ),
      ),
    ],
  ),
  [
    "To find the favorite sport of a whole school, a reporter asks only the players leaving the soccer field. Soccer wins by a mile.",
    "为了了解全校最喜欢的运动，一名小记者只问了刚从足球场出来的球员。结果足球遥遥领先。",
  ],
  [
    "The soccer players were not chosen at random from the whole school, so their answers lean toward soccer.",
    "这些足球队员不是从全校随机选出的，所以他们的回答偏向足球。",
  ],
  ["tell fair samples from biased ones and name what makes a sample biased.", "学习分辨公平样本和有偏样本，并说出样本有偏差的原因。"],
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

/** shareTape draws parts of a whole as one bar, each part as long as its share and labeled with it. */
function shareTape(parts: readonly number[], lit: number, en: string, zh: string): Figure {
  return tapeFigure([{ total: "100%", pieces: parts.map((p, i) => ({ size: p, text: `${p}%`, lit: i === lit })) }], [en, zh]);
}

/** marginFigure draws an estimate on a percent line with its margin of error on each side, and a value v to test when given. */
function marginFigure(p: number, e: number, v?: number): Figure {
  const lo = Math.floor((Math.min(p - e, v ?? p) - 1) / 5) * 5;
  const hi = Math.ceil((Math.max(p + e, v ?? p) + 1) / 5) * 5;
  return lineFigure(
    {
      lo,
      hi,
      step: 1,
      labels: [lo, hi],
      label: (x) => `${x}%`,
      marks: [{ at: p, text: `${p}%` }, ...(v === undefined ? [] : [{ at: v, text: `${v}%`, result: true }])],
      jumps: [
        [p, p - e],
        [p, p + e],
      ],
    },
    [
      `A percent line with the estimate ${p}% and arrows ${e} points to each side${v === undefined ? "" : `, and the value ${v}% marked`}.`,
      `百分数轴上标出估计值 ${p}%，向两边各画 ${e} 个百分点的箭头${v === undefined ? "" : `，并标出 ${v}%`}。`,
    ],
  );
}

/** interpretingSurveyResults reads counts and percentages from surveys and draws only the conclusions they support. */
export const interpretingSurveyResults = withIntro(
  topic(
    "interpreting-survey-results",
    t("Interpreting Survey Results", "解读调查结果"),
    t(
      "Survey results are often given as percentages of the people who answered. Turn a percentage back into a count by multiplying by the number surveyed, and compare groups of different sizes by their percentages, not their counts. A random sample supports conclusions about the population only as estimates: about, not exactly.",
      "调查结果常以占回答人数的百分比给出。用百分比乘调查人数，就能还原出人数；比较人数不同的几组时，要比较百分比，而不是人数。随机样本对总体的结论只是估计：是“大约”，而不是“恰好”。",
    ),
    ["sampling"],
    ["7.SP.A.1", "7.SP.A.2"],
    [
      lesson(
        "counts-from-survey-percentages",
        ["Counts from survey percentages", "由调查百分比求人数"],
        [
          [
            "In a survey of $250$ students, $36\\%$ chose summer and $20\\%$ chose winter. Summer got $0.36 \\times 250 = 90$ answers and winter $0.20 \\times 250 = 50$, so $40$ more students chose summer.",
            "在一次对 $250$ 名学生的调查中，$36\\%$ 选夏季，$20\\%$ 选冬季。夏季有 $0.36 \\times 250 = 90$ 人，冬季有 $0.20 \\times 250 = 50$ 人，所以选夏季的多 $40$ 人。",
          ],
          [
            "Subtract the percentages first: $36 - 20 = 16$ points, and $0.16 \\times 250 = 40$ students.",
            "先把百分比相减：$36 - 20 = 16$ 个百分点，$0.16 \\times 250 = 40$ 人。",
          ],
          [
            "A difference of $16$ percentage points is not $16$ students; turn it into a count.",
            "相差 $16$ 个百分点不等于相差 $16$ 人；要换算成人数。",
          ],
        ],
        (rng) => {
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
            const [ca, cb] = [(all[a]! * n) / 100, (all[b]! * n) / 100];
            const diff = ca - cb;
            const points = all[a]! - all[b]!;
            const table = (lang: 0 | 1) =>
              mdTable(
                [lang === 0 ? "Answer" : "回答", lang === 0 ? "Percent" : "百分比"],
                p.options.map((o, k) => [o[lang], m(`${all[k]}\\%`)]),
              );
            return valued(
              [
                `${n} students were asked, “${p.question.en}” The results were:${table(0)}How many more students answered ${p.options[a]![0]} than ${p.options[b]![0]}?`,
                `向 ${n} 名学生提问：“${p.question["zh-CN"]}”结果如下：${table(1)}回答“${p.options[a]![1]}”的比回答“${p.options[b]![1]}”的多多少人？`,
              ],
              diff,
              [
                [
                  ["Turn the percentages into counts", "把百分比换成人数"],
                  [`Take each percentage of the ${n} students:`, `求 ${n} 名学生的各个百分比：`],
                  [`${dec(Q.of(all[a]!, 100))} \\times ${n} = ${ca}`, `${dec(Q.of(all[b]!, 100))} \\times ${n} = ${cb}`],
                ],
                [["Subtract", "相减"], ["The difference of the counts:", "人数之差："], [`${ca} - ${cb} = ${diff}`]],
              ],
              [
                `Subtract the percentages first: $${all[a]} - ${all[b]} = ${points}$ points, and $${dec(Q.of(points, 100))} \\times ${n} = ${diff}$.`,
                `先把百分比相减：$${all[a]} - ${all[b]} = ${points}$ 个百分点，$${dec(Q.of(points, 100))} \\times ${n} = ${diff}$。`,
              ],
              [
                [points, "That is the difference in percentage points, not in students.", "这是百分点之差，不是人数之差。"],
                [
                  ca,
                  `That is how many answered ${p.options[a]![0]}, not how many more.`,
                  `这是回答“${p.options[a]![1]}”的人数，不是多出的人数。`,
                ],
                [cb, `That is how many answered ${p.options[b]![0]}.`, `这是回答“${p.options[b]![1]}”的人数。`],
              ],
              {
                form: "integer",
                figure: shareTape(
                  all,
                  a,
                  "The four answers as parts of one bar, each as long as its percentage.",
                  "四种回答画成一个长条的四段，每段长度等于它的百分比。",
                ),
              },
            );
          }
        },
        shareTape(
          [36, 24, 20, 20],
          0,
          "Four answers as parts of one bar: 36%, 24%, 20% and 20%.",
          "四种回答画成一个长条：36%、24%、20% 和 20%。",
        ),
      ),
      lesson(
        "comparing-groups-of-different-sizes",
        ["Comparing groups of different sizes", "比较人数不同的组"],
        [
          [
            "In a survey, $18$ of $40$ seventh graders and $21$ of $60$ eighth graders play an instrument. More eighth graders said yes, but the groups differ in size, so compare percentages: $\\frac{18}{40} = 45\\%$ and $\\frac{21}{60} = 35\\%$, $10$ percentage points apart.",
            "在一次调查中，$40$ 名七年级学生中有 $18$ 人、$60$ 名八年级学生中有 $21$ 人会演奏乐器。八年级说“会”的人更多，但两组人数不同，所以要比较百分比：$\\frac{18}{40} = 45\\%$，$\\frac{21}{60} = 35\\%$，相差 $10$ 个百分点。",
          ],
          [
            "Turn each percent back into its count: $45\\%$ of $40$ is $18$ and $35\\%$ of $60$ is $21$.",
            "把百分比换回人数：$40$ 的 $45\\%$ 是 $18$，$60$ 的 $35\\%$ 是 $21$。",
          ],
          [
            "The larger count can belong to the smaller share when the groups differ in size.",
            "两组人数不同时，人数多的一组比例可能反而小。",
          ],
        ],
        (rng) => {
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
            return valued(
              [
                `In a survey, ${k1} of ${n1} seventh graders and ${k2} of ${n2} eighth graders said they ${en}. By how many percentage points is the larger percentage greater than the smaller one?`,
                `在一次调查中，${n1} 名七年级学生中有 ${k1} 人、${n2} 名八年级学生中有 ${k2} 人说自己${zh}。较大的百分比比较小的百分比高多少个百分点？`,
              ],
              diff,
              [
                [
                  ["Find each percentage", "求各组的百分比"],
                  ["The groups differ in size, so divide each count by its group:", "两组人数不同，所以用各组人数去除："],
                  [`\\frac{${k1}}{${n1}} = ${p1}\\%`, `\\frac{${k2}}{${n2}} = ${p2}\\%`],
                ],
                [
                  ["Subtract", "相减"],
                  ["The larger minus the smaller:", "大的减小的："],
                  [`${Math.max(p1, p2)} - ${Math.min(p1, p2)} = ${diff}`],
                ],
              ],
              [
                `Turn each percent back into its count: $${p1}\\%$ of $${n1}$ is $${k1}$ and $${p2}\\%$ of $${n2}$ is $${k2}$.`,
                `把百分比换回人数：$${n1}$ 的 $${p1}\\%$ 是 $${k1}$，$${n2}$ 的 $${p2}\\%$ 是 $${k2}$。`,
              ],
              [
                [
                  Math.abs(k1 - k2),
                  "That is the difference of the counts, but the groups differ in size.",
                  "这是人数之差，但两组人数不同。",
                ],
                [
                  Math.abs(Math.round((100 * (k1 - k2)) / (n1 + n2))),
                  "That divides the difference of the counts by both groups together.",
                  "这是用人数之差除以两组的总人数。",
                ],
              ],
              {
                form: "integer",
                figure: tapeFigure(
                  [
                    {
                      total: "7",
                      pieces: [
                        { size: p1, text: `${p1}%`, lit: true },
                        { size: 100 - p1, text: "" },
                      ],
                    },
                    {
                      total: "8",
                      pieces: [
                        { size: p2, text: `${p2}%`, lit: true },
                        { size: 100 - p2, text: "" },
                      ],
                    },
                  ],
                  [
                    "Two bars of equal length for the two grades, each shaded to its percentage.",
                    "两个年级各画一个等长的长条，按百分比涂色。",
                  ],
                ),
              },
            );
          }
        },
        tapeFigure(
          [
            {
              total: "7",
              pieces: [
                { size: 45, text: "45%", lit: true },
                { size: 55, text: "" },
              ],
            },
            {
              total: "8",
              pieces: [
                { size: 35, text: "35%", lit: true },
                { size: 65, text: "" },
              ],
            },
          ],
          ["Two bars of equal length: 45% shaded for grade 7 and 35% for grade 8.", "两个等长的长条：七年级涂 45%，八年级涂 35%。"],
        ),
      ),
      lesson(
        "supported-conclusions",
        ["Supported conclusions", "有依据的结论"],
        [
          [
            "In a random sample of $80$ of the $2000$ students in a district, $24$ want a later start. The sample supports “about $\\frac{24}{80} \\times 2000 = 600$ students want a later start”, but not “exactly $600$”, and not “$24$ students in the district”.",
            "某区 $2000$ 名学生中随机抽取 $80$ 人，其中 $24$ 人希望推迟上学时间。这个样本支持“全区大约有 $\\frac{24}{80} \\times 2000 = 600$ 名学生希望推迟”，但不支持“恰好 $600$ 人”，也不支持“全区有 $24$ 名学生”。",
          ],
          [
            "The district is $2000 \\div 80 = 25$ times the sample, and $24 \\times 25 = 600$.",
            "全区是样本的 $2000 \\div 80 = 25$ 倍，$24 \\times 25 = 600$。",
          ],
          ["A sample gives an estimate: say “about”, never “exactly”.", "样本给出的是估计：要说“大约”，不能说“恰好”。"],
        ],
        (rng) => {
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
            const wrong: Wrong[] = [
              [
                [`Exactly $${e}$ students in the district ${en}.`, `全区恰好有 $${e}$ 名学生${zh}。`],
                "A sample gives an estimate; another sample would give a slightly different count.",
                "样本给出的是估计；换一个样本，人数会略有不同。",
              ],
              [
                [`About $${k}$ students in the district ${en}.`, `全区大约有 $${k}$ 名学生${zh}。`],
                `$${k}$ is the count in the sample, not in the whole district.`,
                `$${k}$ 是样本中的人数，不是全区的人数。`,
              ],
              [
                [`About $${rest.toLatex()}$ students in the district ${en}.`, `全区大约有 $${rest.toLatex()}$ 名学生${zh}。`],
                "That is about how many do not.",
                "这大约是不这样的人数。",
              ],
              [
                [`Most students in the district ${en}.`, `全区大多数学生${zh}。`],
                `$\\frac{${k}}{${n}}$ is less than half, so the sample does not show that most do.`,
                `$\\frac{${k}}{${n}}$ 不到一半，所以样本不能说明大多数学生这样。`,
              ],
            ];
            return chosen(
              rng,
              [
                `In a random sample of ${n} of the ${pop} students in a district, ${k} said they ${en}. Which conclusion does the sample support?`,
                `从某区 ${pop} 名学生中随机抽取 ${n} 人，其中 ${k} 人说自己${zh}。这个样本支持哪个结论？`,
              ],
              [`About $${e}$ students in the district ${en}.`, `全区大约有 $${e}$ 名学生${zh}。`],
              wrong,
              [
                [
                  ["Find the fraction in the sample", "求样本中的比例"],
                  [
                    `$${k}$ of the $${n}$ students in the sample, or $\\frac{${k}}{${n}}$.`,
                    `样本 $${n}$ 人中有 $${k}$ 人，即 $\\frac{${k}}{${n}}$。`,
                  ],
                ],
                [
                  ["Scale it up as an estimate", "按比例推算出估计值"],
                  [
                    `About $\\frac{${k}}{${n}} \\times ${pop} = ${e}$ students, an estimate and not an exact count.`,
                    `大约 $\\frac{${k}}{${n}} \\times ${pop} = ${e}$ 名学生，这是估计，不是确切人数。`,
                  ],
                ],
              ],
              [
                `The district is $\\frac{${pop}}{${n}}$ times the sample, and $${k} \\times \\frac{${pop}}{${n}} = ${e}$.`,
                `全区是样本的 $\\frac{${pop}}{${n}}$ 倍，$${k} \\times \\frac{${pop}}{${n}} = ${e}$。`,
              ],
              tapeFigure(
                [
                  {
                    total: `${n}`,
                    pieces: [
                      { size: k, text: `${k}`, lit: true },
                      { size: n - k, text: `${n - k}` },
                    ],
                  },
                ],
                [`A bar of the ${n} students in the sample, ${k} of them shaded.`, `样本中 ${n} 名学生的长条，其中 ${k} 人涂色。`],
              ),
            );
          }
        },
        tapeFigure(
          [
            {
              total: "80",
              pieces: [
                { size: 24, text: "24", lit: true },
                { size: 56, text: "56" },
              ],
            },
          ],
          ["A bar of the 80 students in the sample, 24 of them shaded.", "样本中 80 名学生的长条，其中 24 人涂色。"],
        ),
      ),
    ],
  ),
  [
    "A newspaper says “$60\\%$ of students want longer breaks”. Before believing it, ask: $60\\%$ of how many students, and who was asked?",
    "报纸上说“$60\\%$ 的学生希望延长课间休息”。在相信之前先问一问：是多少名学生的 $60\\%$？问的是谁？",
  ],
  ["A percent turns back into a count only when you know how many were asked.", "只有知道问了多少人，百分比才能换回人数。"],
  [
    "turn survey percentages into counts, compare groups of different sizes, and say what a sample supports.",
    "学习把调查的百分比换成人数，比较人数不同的组，并判断样本支持什么结论。",
  ],
);

/** samplingAndMarginOfError turns an estimate and its margin of error into an interval of plausible values. */
export const samplingAndMarginOfError = withIntro(
  topic(
    "sampling-and-margin-of-error",
    t("Sampling and Margin of Error", "抽样与误差范围"),
    t(
      "An estimate from a random sample is rarely exact. Its margin of error says how far the true value is likely to be from the estimate: an estimate of 42% with a margin of error of 3 percentage points means the true percentage is plausibly anywhere from 39% to 45%. Larger random samples give smaller margins of error.",
      "随机样本给出的估计很少完全准确。误差范围说明真实值可能离估计值多远：估计值为 42%、误差范围为 3 个百分点，意味着真实的百分比可能在 39% 到 45% 之间的任何位置。随机样本越大，误差范围越小。",
    ),
    ["interpreting-survey-results"],
    ["7.SP.A.2"],
    [
      lesson(
        "intervals-from-a-margin-of-error",
        ["Intervals from a margin of error", "由误差范围求区间"],
        [
          [
            "A poll finds that $42\\%$ of voters support a plan, with a margin of error of $3$ percentage points. The plausible values run from $42 - 3 = 39\\%$ to $42 + 3 = 45\\%$.",
            "一项民意调查发现 $42\\%$ 的选民支持某项计划，误差范围为 $3$ 个百分点。合理的取值从 $42 - 3 = 39\\%$ 到 $42 + 3 = 45\\%$。",
          ],
          [
            "The estimate sits in the middle of the interval: $\\frac{39 + 45}{2} = 42$.",
            "估计值在区间的正中间：$\\frac{39 + 45}{2} = 42$。",
          ],
          [
            "The margin is added to and subtracted from the estimate itself: it is not $3\\%$ of $42$.",
            "误差范围是直接加到估计值上或从估计值中减去的，而不是 $42$ 的 $3\\%$。",
          ],
        ],
        (rng) => {
          const p = rng.int(15, 85);
          const e = rng.int(2, 6);
          const upper = rng.bool();
          const [en, zh] = rng.pick([
            ["voters support a new park", "选民支持新建公园"],
            ["adults read the news every day", "成年人每天看新闻"],
            ["students would buy a school hoodie", "学生愿意买校服卫衣"],
            ["shoppers use reusable bags", "顾客使用环保袋"],
          ] as const);
          const answer = upper ? p + e : p - e;
          return valued(
            [
              `A survey of a random sample estimates that $${p}\\%$ of ${en}, with a margin of error of $${e}$ percentage points. What is the ${upper ? "greatest" : "least"} plausible percentage?`,
              `一项随机抽样调查估计 $${p}\\%$ 的${zh}，误差范围为 $${e}$ 个百分点。合理的百分比${upper ? "最大" : "最小"}是多少？`,
            ],
            answer,
            [
              [
                ["Write the interval", "写出区间"],
                ["The plausible values are the estimate minus and plus the margin:", "合理的取值是估计值减去和加上误差范围："],
                [`${p} - ${e} = ${p - e}`, `${p} + ${e} = ${p + e}`],
              ],
              [
                ["Choose the end asked for", "选出所问的一端"],
                [
                  upper ? `The greatest is the upper end, $${p + e}\\%$.` : `The least is the lower end, $${p - e}\\%$.`,
                  upper ? `最大值是上端 $${p + e}\\%$。` : `最小值是下端 $${p - e}\\%$。`,
                ],
              ],
            ],
            [
              `The estimate sits in the middle: $\\frac{${p - e} + ${p + e}}{2} = ${p}$.`,
              `估计值在区间正中间：$\\frac{${p - e} + ${p + e}}{2} = ${p}$。`,
            ],
            [
              [upper ? p - e : p + e, "That is the other end of the interval.", "这是区间的另一端。"],
              [p, "That is the estimate itself, not an end of the interval.", "这是估计值本身，不是区间的端点。"],
              [2 * e, "That is the width of the interval.", "这是区间的宽度。"],
            ],
            { percent: true, figure: marginFigure(p, e) },
          );
        },
        marginFigure(42, 3),
      ),
      lesson(
        "plausible-values",
        ["Plausible values", "合理的取值"],
        [
          [
            "With an estimate of $48\\%$ and a margin of error of $4$ percentage points, the plausible values are $44\\%$ to $52\\%$. The true percentage could be above $50\\%$ or below it, so the poll cannot say whether a majority agrees. A value such as $55\\%$ lies outside the interval and is not plausible.",
            "估计值为 $48\\%$、误差范围为 $4$ 个百分点时，合理的取值是 $44\\%$ 到 $52\\%$。真实的百分比可能高于 $50\\%$，也可能低于 $50\\%$，所以这次调查无法判断是否过半数。像 $55\\%$ 这样的值在区间之外，不合理。",
          ],
          [
            "Measure the distance instead: $55$ is $7$ points from $48$, more than the margin of $4$.",
            "也可以量距离：$55$ 离 $48$ 有 $7$ 个百分点，超过了误差范围 $4$。",
          ],
          [
            "A value just past the end of the interval is outside it, however close it looks.",
            "刚好超出区间端点的值也在区间外，不管看起来多接近。",
          ],
        ],
        (rng) => {
          const p = rng.int(20, 80);
          const e = rng.int(2, 6);
          const v = rng.bool() ? p + rng.int(-e, e) : p + (rng.bool() ? 1 : -1) * rng.int(e + 1, e + 5);
          const ok = Math.abs(v - p) <= e;
          const yes: Pair = [yesNo[0]!.en, yesNo[0]!["zh-CN"]];
          const no: Pair = [yesNo[1]!.en, yesNo[1]!["zh-CN"]];
          return chosen(
            rng,
            [
              `A random-sample survey estimates that $${p}\\%$ of a town’s residents want a new pool, with a margin of error of $${e}$ percentage points. Is it plausible that $${v}\\%$ of the residents want a new pool?`,
              `一项随机抽样调查估计某镇 $${p}\\%$ 的居民希望建新游泳池，误差范围为 $${e}$ 个百分点。$${v}\\%$ 的居民希望建新游泳池，这个说法合理吗？`,
            ],
            ok ? yes : no,
            [
              ok
                ? [
                    no,
                    `$${v}\\%$ is inside the interval from $${p - e}\\%$ to $${p + e}\\%$.`,
                    `$${v}\\%$ 在 $${p - e}\\%$ 到 $${p + e}\\%$ 的区间内。`,
                  ]
                : [
                    yes,
                    `$${v}\\%$ is outside the interval from $${p - e}\\%$ to $${p + e}\\%$.`,
                    `$${v}\\%$ 在 $${p - e}\\%$ 到 $${p + e}\\%$ 的区间外。`,
                  ],
            ],
            [
              [
                ["Write the interval", "写出区间"],
                [
                  `The plausible values run from $${p} - ${e} = ${p - e}\\%$ to $${p} + ${e} = ${p + e}\\%$.`,
                  `合理的取值从 $${p} - ${e} = ${p - e}\\%$ 到 $${p} + ${e} = ${p + e}\\%$。`,
                ],
              ],
              [
                ["Place the value", "看这个值的位置"],
                [
                  `$${v}\\%$ is ${ok ? "inside" : "outside"} the interval, so it is ${ok ? "" : "not "}plausible.`,
                  `$${v}\\%$ 在区间${ok ? "内" : "外"}，所以${ok ? "合理" : "不合理"}。`,
                ],
              ],
            ],
            [
              `Measure the distance: $${v}$ is $${Math.abs(v - p)}$ points from $${p}$, which is ${ok ? "within" : "more than"} the margin of $${e}$.`,
              `量距离：$${v}$ 离 $${p}$ 有 $${Math.abs(v - p)}$ 个百分点，${ok ? "没有超过" : "超过了"}误差范围 $${e}$。`,
            ],
            marginFigure(p, e, v),
          );
        },
        marginFigure(48, 4, 55),
      ),
      lesson(
        "counts-from-a-margin-of-error",
        ["Counts from a margin of error", "由误差范围求人数"],
        [
          [
            "A random sample estimates that $30\\%$ of a school’s $1200$ students bike to school, with a margin of error of $5$ percentage points. The plausible percentages are $25\\%$ to $35\\%$, so the plausible numbers of students are $0.25 \\times 1200 = 300$ to $0.35 \\times 1200 = 420$.",
            "一个随机样本估计某校 $1200$ 名学生中有 $30\\%$ 骑车上学，误差范围为 $5$ 个百分点。合理的百分比是 $25\\%$ 到 $35\\%$，所以合理的人数是 $0.25 \\times 1200 = 300$ 到 $0.35 \\times 1200 = 420$。",
          ],
          [
            "Count the estimate and the margin separately: $0.30 \\times 1200 = 360$ and $0.05 \\times 1200 = 60$, so $360 - 60 = 300$ and $360 + 60 = 420$.",
            "分别把估计值和误差范围换成人数：$0.30 \\times 1200 = 360$，$0.05 \\times 1200 = 60$，所以 $360 - 60 = 300$，$360 + 60 = 420$。",
          ],
          ["Move the percentage first, then take it of the whole school.", "先移动百分比，再求全校的这个百分比。"],
        ],
        (rng) => {
          const pop = rng.pick([400, 500, 800, 1000, 1200, 1500, 2000, 2500]);
          const p = rng.int(10, 70);
          const e = rng.int(2, 6);
          const upper = rng.bool();
          const pct = upper ? p + e : p - e;
          const answer = Q.of(pct * pop, 100);
          const [est, margin] = [Q.of(p * pop, 100), Q.of(e * pop, 100)];
          return valued(
            [
              `A random sample estimates that $${p}\\%$ of the ${pop} students at a school bike to school, with a margin of error of $${e}$ percentage points. What is the ${upper ? "greatest" : "least"} plausible number of students who bike to school?`,
              `一个随机样本估计某校 ${pop} 名学生中有 $${p}\\%$ 骑车上学，误差范围为 $${e}$ 个百分点。骑车上学的学生人数合理的${upper ? "最大" : "最小"}值是多少？`,
            ],
            answer,
            [
              [
                ["Move the percentage", "移动百分比"],
                [`The ${upper ? "greatest" : "least"} plausible percentage:`, `合理的百分比${upper ? "最大" : "最小"}是：`],
                [`${p} ${upper ? "+" : "-"} ${e} = ${pct}`],
              ],
              [
                ["Take it of the school", "求全校的这个百分比"],
                [`$${pct}\\%$ of $${pop}$:`, `$${pop}$ 的 $${pct}\\%$：`],
                [`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`],
              ],
            ],
            [
              `Count the estimate and the margin separately: $${est.toLatex()}$ and $${margin.toLatex()}$ students, and $${est.toLatex()} ${upper ? "+" : "-"} ${margin.toLatex()} = ${answer.toLatex()}$.`,
              `分别换成人数：估计值 $${est.toLatex()}$ 人，误差范围 $${margin.toLatex()}$ 人，$${est.toLatex()} ${upper ? "+" : "-"} ${margin.toLatex()} = ${answer.toLatex()}$。`,
            ],
            [
              [est, "That uses the estimate and leaves out the margin of error.", "这只用了估计值，没有考虑误差范围。"],
              [margin, "That is the margin of error alone, as a count.", "这只是误差范围换成的人数。"],
              [Q.of((upper ? p - e : p + e) * pop, 100), "That is the other end of the interval.", "这是区间的另一端。"],
            ],
            { form: "integer", figure: marginFigure(p, e) },
          );
        },
        marginFigure(30, 5),
      ),
    ],
  ),
  [
    "A weather app says a $70\\%$ chance of rain, give or take a little. A survey works the same way: its answer comes with a margin of error.",
    "天气软件说下雨的概率是 $70\\%$，上下差一点。调查也是这样：它的结果带着一个误差范围。",
  ],
  [
    "The true value is likely within the margin on either side of the estimate, not exactly on it.",
    "真实值很可能在估计值两侧的误差范围以内，而不一定正好等于估计值。",
  ],
  [
    "turn an estimate and its margin of error into an interval, and use it to judge values and counts.",
    "学习由估计值和误差范围写出区间，并用它判断取值和人数。",
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

/** jointFigure draws a two-way table with rows A and B, columns X, Y and Z, and the totals under Σ; a cell named in hide shows as a blank and the one at ask as "?". */
function jointFigure(c: readonly (readonly number[])[], hide: readonly string[], ask: string): Figure {
  const show = (key: string, v: number) => (key === ask ? "?" : hide.includes(key) ? "" : String(v));
  const colTotals = [0, 1, 2].map((j) => c[0]![j]! + c[1]![j]!);
  const inside = [
    ...c.map((r, i) => [...r.map((v, j) => show(`${i}${j}`, v)), show(`${i}T`, sum(r))]),
    [...colTotals.map((v, j) => show(`T${j}`, v)), show("TT", sum(colTotals))],
  ];
  return tableFigure(["A", "B", "Σ"], ["X", "Y", "Z", "Σ"], inside, [
    "A two-way table: rows A and B, columns X, Y and Z, with the totals of each row and column under Σ.",
    "一张双向表：行是 A 和 B，列是 X、Y、Z，Σ 下面是每行、每列的合计。",
  ]);
}

/** jointFrequencyTables reads, completes and turns into relative frequencies the entries of two-way tables. */
export const jointFrequencyTables = withIntro(
  topic(
    "joint-frequency-tables",
    t("Joint Frequency Tables", "联合频数表"),
    t(
      "A joint frequency table (a two-way table) counts the data by two categories at once: each cell is a joint frequency, such as the number of 7th graders who prefer dogs. The totals at the ends of the rows and columns are the marginal frequencies, and every row and column adds up to its total. Dividing a joint frequency by the grand total gives a joint relative frequency.",
      "联合频数表（双向表）同时按两个类别统计数据：每个单元格是一个联合频数，比如喜欢狗的七年级学生人数。行末和列末的合计是边缘频数，每一行、每一列加起来都等于它的合计。用联合频数除以总计，得到联合频率。",
    ),
    ["frequency-tables"],
    ["8.SP.A.4"],
    [
      lesson(
        "reading-joint-frequencies",
        ["Reading joint frequencies", "读联合频数"],
        [
          [
            "In a two-way table, find the row of one category and the column of the other: the cell where they meet is the joint frequency. A total at the end of a row counts the whole row, whatever the answer, and the grand total in the corner counts everyone.",
            "在双向表中，找到一个类别所在的行和另一个类别所在的列，它们相交的单元格就是联合频数。行末的合计统计整行（不论回答是什么），右下角的总计统计所有人。",
          ],
          [
            "The row adds up to its total, so the cell is also the row total minus the other cells of the row: in row A, $26 - 9 - 5 = 12$.",
            "每一行加起来等于它的合计，所以这个单元格也等于行合计减去这一行的其他单元格：在 A 行，$26 - 9 - 5 = 12$。",
          ],
          [
            "The totals sit at the ends; the joint frequency is the cell inside where the row and the column meet.",
            "合计在表的边上；联合频数是行与列在表内相交的那个单元格。",
          ],
        ],
        (rng) => {
          const w = rng.pick(twoWays);
          const c = jointCounts(rng);
          const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
          const v = c[i]![j]!;
          const others = c[i]!.filter((_, k) => k !== j);
          const row = w.rows[i]!;
          const col = w.cols[j]!;
          return valued(
            [
              `${w.intro.en}${jointTable(w, c, [], "", 0)}${w.cell(row, col).en}`,
              `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.cell(row, col)["zh-CN"]}`,
            ],
            v,
            [
              [
                ["Find the row", "找到行"],
                [`The row is “${row[0]}”.`, `行是“${row[1]}”。`],
              ],
              [
                ["Find the column and read the cell", "找到列并读出单元格"],
                [`The column is “${col[0]}”; where they meet the cell says $${v}$.`, `列是“${col[1]}”；两者相交的单元格是 $${v}$。`],
              ],
            ],
            [
              `The row adds up to its total: $${sum(c[i]!)} - ${others.join(" - ")} = ${v}$.`,
              `这一行加起来等于它的合计：$${sum(c[i]!)} - ${others.join(" - ")} = ${v}$。`,
            ],
            [
              [c[1 - i]![j]!, "That is the cell of the other row in the same column.", "这是同一列中另一行的单元格。"],
              [c[0]![j]! + c[1]![j]!, "That is the column total, both rows together.", "这是列合计，两行加在一起。"],
              [sum(c[i]!), "That is the row total, whatever the answer.", "这是行合计，包括了所有回答。"],
            ],
            { form: "integer" },
          );
        },
        jointFigure(
          [
            [12, 9, 5],
            [8, 15, 7],
          ],
          [],
          "",
        ),
      ),
      lesson(
        "completing-a-joint-frequency-table",
        ["Completing a joint frequency table", "补全联合频数表"],
        [
          [
            "Every row and every column adds up to its total, so a missing entry is a total minus the other entries. If a row total is missing too, find it first from the grand total. With a grand total of $120$ and one row total of $70$, the other row has $120 - 70 = 50$; if that row’s other cells are $18$ and $12$, the missing cell is $50 - 18 - 12 = 20$.",
            "每一行、每一列加起来都等于它的合计，所以缺少的数等于合计减去其他各数。如果行合计也缺少，先用总计求出它。总计为 $120$、一行的合计为 $70$ 时，另一行合计为 $120 - 70 = 50$；如果这一行的另两个单元格是 $18$ 和 $12$，缺少的单元格就是 $50 - 18 - 12 = 20$。",
          ],
          [
            "Put the answer back: $18 + 12 + 20 = 50$, and the two rows give $50 + 70 = 120$, the grand total.",
            "把答案放回去：$18 + 12 + 20 = 50$，两行合起来 $50 + 70 = 120$，正是总计。",
          ],
          [
            "Take the other cells away from the row’s own total, not from the grand total.",
            "要从这一行自己的合计中减去其他单元格，不是从总计中减。",
          ],
        ],
        (rng) => {
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
          const offs: [number, string, string][] = [
            [
              grand - sum(others),
              "That takes the other cells away from the grand total, which counts both rows.",
              "这是从总计中减去其他单元格，但总计包括了两行。",
            ],
            [
              rowTotal,
              "That is the row total; the other cells of the row still have to be taken away.",
              "这是行合计；还要减去这一行的其他单元格。",
            ],
            [otherTotal - sum(others), "That uses the other row’s total.", "这是用了另一行的合计。"],
          ];
          return valued(
            [
              `${w.intro.en} Some entries of the table are missing.${jointTable(w, c, hide, `${i}${j}`, 0)}${w.cell(w.rows[i]!, w.cols[j]!).en}`,
              `${w.intro["zh-CN"]}表格中有些数缺失了。${jointTable(w, c, hide, `${i}${j}`, 1)}${w.cell(w.rows[i]!, w.cols[j]!)["zh-CN"]}`,
            ],
            v,
            [
              [
                ["Find the row total", "求行合计"],
                [
                  `The grand total minus the other row’s total gives the total for “${w.rows[i]![0]}”:`,
                  `总计减去另一行的合计，得到“${w.rows[i]![1]}”这一行的合计：`,
                ],
                [`${grand} - ${otherTotal} = ${rowTotal}`],
              ],
              [
                ["Take away the other cells", "减去其他单元格"],
                ["Subtract the other entries of the row:", "减去这一行的其他各数："],
                [`${rowTotal} - ${others.join(" - ")} = ${v}`],
              ],
            ],
            [
              `Put $${v}$ back: $${[...others, v].join(" + ")} = ${rowTotal}$, and $${rowTotal} + ${otherTotal} = ${grand}$, the grand total.`,
              `把 $${v}$ 放回去：$${[...others, v].join(" + ")} = ${rowTotal}$，$${rowTotal} + ${otherTotal} = ${grand}$，正是总计。`,
            ],
            offs.filter(([x]) => x > 0),
            { form: "integer" },
          );
        },
        jointFigure(
          [
            [18, 12, 20],
            [25, 30, 15],
          ],
          ["0T", "10", "T2"],
          "02",
        ),
      ),
      lesson(
        "joint-relative-frequencies",
        ["Joint relative frequencies", "联合频率"],
        [
          [
            "A joint relative frequency is a joint frequency divided by the grand total: the fraction of everyone surveyed who are in both categories. If $24$ of $160$ students are 8th graders who prefer cats, the joint relative frequency is $\\frac{24}{160} = 0.15 = 15\\%$.",
            "联合频率等于联合频数除以总计：同时属于两个类别的人占全部受访者的比例。如果 $160$ 名学生中有 $24$ 名是喜欢猫的八年级学生，联合频率就是 $\\frac{24}{160} = 0.15 = 15\\%$。",
          ],
          [
            "Go back from the percent: $15\\%$ of $160$ is $0.15 \\cdot 160 = 24$, the count in the cell.",
            "从百分数倒推：$160$ 的 $15\\%$ 是 $0.15 \\cdot 160 = 24$，正是单元格中的数。",
          ],
          ["Divide by the grand total, not by a row or column total.", "要除以总计，而不是行合计或列合计。"],
        ],
        (rng) => {
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
            const offs: [Q, string, string][] = [
              [
                Q.of(100 * v, rowTotal),
                "That divides by the row total; a joint relative frequency divides by the grand total.",
                "这是除以行合计；联合频率要除以总计。",
              ],
              [
                Q.of(100 * v, colTotal),
                "That divides by the column total; a joint relative frequency divides by the grand total.",
                "这是除以列合计；联合频率要除以总计。",
              ],
              [Q.of(v), "That is the count in the cell, not a percent of everyone.", "这是单元格中的人数，不是占全部人数的百分比。"],
            ];
            return valued(
              [
                `${w.intro.en}${jointTable(w, c, [], "", 0)}What percent of everyone surveyed are ${w.who(w.rows[i]!, w.cols[j]!).en}?`,
                `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.who(w.rows[i]!, w.cols[j]!)["zh-CN"]}占全部受访者的百分之几？`,
              ],
              pct,
              [
                [
                  ["Read the cell and the grand total", "读出单元格和总计"],
                  [`The cell is $${v}$ and the grand total is $${grand}$.`, `单元格是 $${v}$，总计是 $${grand}$。`],
                ],
                [
                  ["Divide and write as a percent", "相除并写成百分数"],
                  ["The joint frequency over the grand total:", "联合频数除以总计："],
                  [`\\frac{${v}}{${grand}} = ${dec(Q.of(v, grand))} = ${pct.toLatex()}\\%`],
                ],
              ],
              [
                `Go back from the percent: $${pct.toLatex()}\\%$ of $${grand}$ is $${dec(Q.of(v, grand))} \\cdot ${grand} = ${v}$, the count in the cell.`,
                `从百分数倒推：$${grand}$ 的 $${pct.toLatex()}\\%$ 是 $${dec(Q.of(v, grand))} \\cdot ${grand} = ${v}$，正是单元格中的数。`,
              ],
              offs.filter(([x]) => clean(x)),
              { percent: true },
            );
          }
        },
        jointFigure(
          [
            [30, 24, 26],
            [20, 24, 36],
          ],
          [],
          "",
        ),
      ),
    ],
  ),
  [
    "A class votes on a trip: the zoo, the museum or the beach. The teacher writes the votes of boys and of girls in a table, so she can see both at once.",
    "全班投票决定去哪里郊游：动物园、博物馆还是海边。老师把男生和女生的票分别填进一张表，两样一眼就能看清。",
  ],
  [
    "Each row adds up to its total, each column too, and both ways give the same grand total.",
    "每一行加起来等于行合计，每一列也一样，两种方法得到同一个总计。",
  ],
  ["read, complete and turn into percents the counts in two-way tables.", "学习读双向表中的数，补全双向表，并把其中的数化成百分数。"],
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

/** running is the list of running totals of the frequencies. */
const running = (freqs: readonly number[]) => freqs.map((_, i) => sum(freqs.slice(0, i + 1)));

/** freqTape draws frequencies as one bar cut into pieces as long as the frequencies, with the pieces in lit shaded. */
function freqTape(
  labels: readonly (number | string)[],
  freqs: readonly number[],
  lit: (i: number) => boolean,
  en: string,
  zh: string,
): Figure {
  return tapeFigure([{ pieces: freqs.map((f, i) => ({ size: f, text: `${labels[i]}`, lit: lit(i) })) }], [en, zh]);
}

/** exampleHistogram draws the histogram of an explanation's example. */
const exampleHistogram = (edges: number[], freqs: number[]) => histogramFigure({ g: groupings[0]!, edges, freqs, n: sum(freqs) });

/** classWrongs lists other classes as wrong options with their reasons, skipping the right class, repeats and classes that do not exist. */
function classWrongs(d: Grouped, right: number, reasons: readonly (readonly [number, string, string])[]): MathWrong[] {
  const seen = new Set([right]);
  const out: MathWrong[] = [];
  for (const [k, en, zh] of reasons) {
    if (k < 0 || k >= d.freqs.length || seen.has(k)) continue;
    seen.add(k);
    out.push([classTex(d.g, d.edges[k]!, d.edges[k + 1]!), en, zh]);
  }
  return out;
}

/** shiftCheck estimates a grouped mean another way: the first midpoint plus a number of class widths. */
function shiftCheck(d: Grouped, est: Q): Pair {
  const first = Q.of(d.edges[0]! + d.edges[1]!, 2);
  const w = d.edges[1]! - d.edges[0]!;
  const count = sum(d.freqs.map((f, i) => f * i));
  return [
    `Count in class widths from the first midpoint: each class is $${w}$ above the one before, so the mean is $${dec(first)} + ${w} \\times \\frac{${d.freqs.map((f, i) => `${i} \\times ${f}`).join(" + ")}}{${d.n}} = ${dec(first)} + ${w} \\times \\frac{${count}}{${d.n}} = ${dec(est)}$.`,
    `从第一个组中值起按组距来数：每组比前一组大 $${w}$，所以平均数是 $${dec(first)} + ${w} \\times \\frac{${d.freqs.map((f, i) => `${i} \\times ${f}`).join(" + ")}}{${d.n}} = ${dec(first)} + ${w} \\times \\frac{${count}}{${d.n}} = ${dec(est)}$。`,
  ];
}

/** groupedMean asks for the mean of grouped data from its table or its histogram. */
function groupedMean(rng: Rng, histogram: boolean): Problem {
  for (;;) {
    const d = grouped(rng);
    const mids = midpoints(d);
    const total = mids.reduce((s, x, i) => s.add(x.mul(Q.of(d.freqs[i]!))), Q.of(0));
    const est = total.div(Q.of(d.n));
    if (!clean(est)) continue;
    const lowers = d.freqs.reduce((s, f, i) => s + f * d.edges[i]!, 0);
    const offs: Off[] = [
      [
        total.div(Q.of(d.freqs.length)),
        `That divides by the $${d.freqs.length}$ classes instead of the $${d.n}$ values.`,
        `这是除以组数 $${d.freqs.length}$，而不是数据个数 $${d.n}$。`,
      ],
      [Q.of(lowers, d.n), "That uses the lower edges of the classes instead of their midpoints.", "这是用各组的下限代替了组中值。"],
      [
        mids.reduce((s, x) => s.add(x), Q.of(0)).div(Q.of(mids.length)),
        "That is the mean of the midpoints, which ignores how many values each class holds.",
        "这是各组中值的平均数，没有考虑每组有多少个数据。",
      ],
    ];
    const shown: Pair = histogram
      ? [
          `The histogram shows ${d.g.what(d.n).en}. Use the midpoints of the classes to estimate the mean.`,
          `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。用各组的组中值估计平均数。`,
        ]
      : [
          `The table shows ${d.g.what(d.n).en}.${groupedTable(d).en}Use the midpoints of the classes to estimate the mean.`,
          `表格显示了 ${d.g.what(d.n)["zh-CN"]}。${groupedTable(d)["zh-CN"]}用各组的组中值估计平均数。`,
        ];
    return valued(
      shown,
      est,
      [
        [
          ["Estimate the total", "估计总和"],
          [
            `Treat each value as its class midpoint, $${list(mids.map(dec))}$, and multiply by the ${histogram ? "bar heights" : "frequencies"}:`,
            `把每个数据看作所在组的组中值 $${list(mids.map(dec))}$，乘${histogram ? "矩形条的高度" : "频数"}：`,
          ],
          [`${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")} = ${dec(total)}`],
        ],
        [
          ["Divide by the number of values", "除以数据个数"],
          [`There are $${d.freqs.join(" + ")} = ${d.n}$ values:`, `共有 $${d.freqs.join(" + ")} = ${d.n}$ 个数据：`],
          [`\\frac{${dec(total)}}{${d.n}} = ${dec(est)}`],
        ],
      ],
      shiftCheck(d, est),
      offs.filter(([v]) => clean(v instanceof Q ? v : Q.of(v))),
      { form: "decimal", unit: d.g.unit, figure: histogramFigure(d) },
    );
  }
}

/** medianClass asks which class of grouped data holds the median, from its table or its histogram. */
function medianClass(rng: Rng, histogram: boolean): Problem {
  for (;;) {
    const d = grouped(rng);
    const lo = classOf(d.freqs, Math.ceil(d.n / 2));
    if (lo !== classOf(d.freqs, Math.floor(d.n / 2) + 1)) continue;
    const top = d.freqs.indexOf(Math.max(...d.freqs));
    if (top === lo && rng.bool(0.7)) continue;
    const cum = running(d.freqs);
    const before = lo === 0 ? 0 : cum[lo - 1]!;
    const c = (k: number) => classTex(d.g, d.edges[k]!, d.edges[k + 1]!);
    const odd = d.n % 2 === 1;
    const pos: Pair = odd
      ? [`the ${ordinal((d.n + 1) / 2)} value`, `是第 $${(d.n + 1) / 2}$ 个数据`]
      : [`between the ${ordinal(d.n / 2)} and ${ordinal(d.n / 2 + 1)} values`, `在第 $${d.n / 2}$ 个和第 $${d.n / 2 + 1}$ 个数据之间`];
    const wrong = classWrongs(d, lo, [
      [
        top,
        histogram
          ? "That class has the tallest bar: it is the modal class, not the class of the middle value."
          : "That class has the greatest frequency: it is the modal class, not the class of the middle value.",
        histogram ? "这一组的矩形条最高：它是众数组，不是中间那个数据所在的组。" : "这一组频数最大：它是众数组，不是中间那个数据所在的组。",
      ],
      [
        Math.floor(d.freqs.length / 2),
        "That is the middle class, but the classes hold different numbers of values.",
        "这是位置居中的一组，但各组的数据个数不同。",
      ],
      [
        lo + 1,
        `The running total is already $${cum[lo]}$ at the end of $${c(lo)}$, past the middle.`,
        `到 $${c(lo)}$ 结束时累计已有 $${cum[lo]}$ 个，已经越过了中间。`,
      ],
      [
        lo - 1,
        `The running total at the end of that class is only $${before}$, short of the middle.`,
        `到那一组结束时累计只有 $${before}$ 个，还没到中间。`,
      ],
      ...d.freqs.map((_, k) =>
        k > lo
          ? ([
              k,
              `The running total passes the middle at $${cum[lo]}$, before that class begins.`,
              `累计到 $${cum[lo]}$ 时就越过了中间，那一组还没开始。`,
            ] as const)
          : ([
              k,
              `The running total at the end of that class is only $${cum[k]}$, short of the middle.`,
              `到那一组结束时累计只有 $${cum[k]}$ 个，还没到中间。`,
            ] as const),
      ),
    ]);
    return chosenMath(
      rng,
      histogram
        ? [
            `The histogram shows ${d.g.what(d.n).en}. Which class contains the median?`,
            `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。中位数在哪一组？`,
          ]
        : [
            `The table shows ${d.g.what(d.n).en}.${groupedTable(d).en}Which class contains the median?`,
            `表格显示了 ${d.g.what(d.n)["zh-CN"]}。${groupedTable(d)["zh-CN"]}中位数在哪一组？`,
          ],
      c(lo),
      wrong,
      [
        [
          ["Find the middle position", "找出中间的位置"],
          [
            `There are $${d.freqs.join(" + ")} = ${d.n}$ values, so the median is ${pos[0]}.`,
            `共有 $${d.freqs.join(" + ")} = ${d.n}$ 个数据，所以中位数${pos[1]}。`,
          ],
        ],
        [
          ["Run the totals", "累加频数"],
          [
            `The running totals are $${list(cum)}$, so the middle falls in $${c(lo)}$.`,
            `累计依次是 $${list(cum)}$，所以中间落在 $${c(lo)}$ 中。`,
          ],
        ],
      ],
      [
        `Count from both ends: $${before}$ values lie below $${c(lo)}$ and $${d.n - cum[lo]!}$ above it, each fewer than half of $${d.n}$.`,
        `从两端数：$${c(lo)}$ 以下有 $${before}$ 个数据，以上有 $${d.n - cum[lo]!}$ 个，都不到 $${d.n}$ 的一半。`,
      ],
      histogramFigure(d),
    );
  }
}

/** modalClass asks for the modal class of grouped data, from its table or its histogram. */
function modalClass(rng: Rng, histogram: boolean): Problem {
  for (;;) {
    const d = grouped(rng);
    const top = Math.max(...d.freqs);
    if (d.freqs.filter((f) => f === top).length !== 1) continue;
    const i = d.freqs.indexOf(top);
    const second = Math.max(...d.freqs.filter((_, k) => k !== i));
    const c = (k: number) => classTex(d.g, d.edges[k]!, d.edges[k + 1]!);
    const what = histogram ? ["bar", "矩形条"] : ["frequency", "频数"];
    return chosenMath(
      rng,
      histogram
        ? [`The histogram shows ${d.g.what(d.n).en}. What is the modal class?`, `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。众数组是哪一组？`]
        : [
            `The table shows ${d.g.what(d.n).en}.${groupedTable(d).en}What is the modal class?`,
            `表格显示了 ${d.g.what(d.n)["zh-CN"]}。${groupedTable(d)["zh-CN"]}众数组是哪一组？`,
          ],
      c(i),
      classWrongs(
        d,
        i,
        d.freqs.map(
          (f, k) =>
            [
              k,
              histogram ? `Its bar is only $${f}$ high, shorter than $${top}$.` : `Its frequency is only $${f}$, less than $${top}$.`,
              histogram ? `它的矩形条只有 $${f}$ 高，比 $${top}$ 矮。` : `它的频数只有 $${f}$，小于 $${top}$。`,
            ] as const,
        ),
      ),
      [
        [
          [histogram ? "Find the tallest bar" : "Find the greatest frequency", histogram ? "找出最高的矩形条" : "找出最大的频数"],
          [
            `The ${what[0]}s are $${list(d.freqs)}$; the greatest is $${top}$.`,
            `各${what[1]}依次是 $${list(d.freqs)}$，最大的是 $${top}$。`,
          ],
        ],
        [
          ["Read its class", "读出它所在的组"],
          [
            `The $${top}$ belongs to $${c(i)}$${histogram ? ", read on the horizontal axis" : ""}.`,
            `$${top}$ 属于 $${c(i)}$${histogram ? "，在横轴上读出" : ""}。`,
          ],
        ],
      ],
      [
        `No other class comes close enough to tie: the next greatest is $${second}$, less than $${top}$.`,
        `没有别的组与它并列：第二大的是 $${second}$，小于 $${top}$。`,
      ],
      histogramFigure(d),
    );
  }
}

/** cumulativeFrequency builds and reads cumulative frequency tables. */
export const cumulativeFrequency = withIntro(
  topic(
    "cumulative-frequency",
    t("Cumulative Frequency", "累积频数"),
    t(
      "The cumulative frequency of a value is the number of data values less than or equal to it: the running total of the frequencies down the table. The last cumulative frequency is the number of values. Going back, the frequency of a value is the difference between its cumulative frequency and the one before.",
      "某个值的累积频数是小于或等于它的数据个数，也就是沿表格往下各频数的累计和。最后一个累积频数就是数据的总个数。反过来，某个值的频数等于它的累积频数减去前一个累积频数。",
    ),
    ["frequency-tables"],
    ["6.SP.B.4", "6.SP.B.5.A"],
    [
      lesson(
        "finding-cumulative-frequencies",
        ["Finding cumulative frequencies", "求累积频数"],
        [
          [
            "For frequencies $3, 8, 5, 2$ of the values $0, 1, 2, 3$, the cumulative frequencies are $3$, $3 + 8 = 11$, $11 + 5 = 16$ and $16 + 2 = 18$. The cumulative frequency of $2$ is $16$: that many values are $2$ or less.",
            "值 $0, 1, 2, 3$ 的频数分别是 $3, 8, 5, 2$，它们的累积频数依次是 $3$、$3 + 8 = 11$、$11 + 5 = 16$、$16 + 2 = 18$。$2$ 的累积频数是 $16$：有这么多个数据小于或等于 $2$。",
          ],
          [
            "Count from the other end: $18$ values in all, minus the $2$ above $2$, leaves $16$.",
            "从另一端数：一共 $18$ 个数据，减去大于 $2$ 的 $2$ 个，剩下 $16$ 个。",
          ],
          ["The cumulative frequency of a value includes the frequency of that value itself.", "某个值的累积频数包括这个值本身的频数。"],
        ],
        (rng) => {
          const { ty, values, freqs } = tally(rng);
          const i = rng.int(1, values.length - 2);
          const cf = sum(freqs.slice(0, i + 1));
          const n = sum(freqs);
          const above = sum(freqs.slice(i + 1));
          return valued(
            [
              `${ty.intro.en}${tallyTable(ty, values, freqs, "f").en}What is the cumulative frequency of $${values[i]}$?`,
              `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "f")["zh-CN"]}$${values[i]}$ 的累积频数是多少？`,
            ],
            cf,
            [
              [
                ["Take the values up to it", "取出不超过它的值"],
                [
                  `The values $${list(values.slice(0, i + 1))}$ are $${values[i]}$ or less, $${values[i]}$ itself included.`,
                  `$${list(values.slice(0, i + 1))}$ 都小于或等于 $${values[i]}$，包括 $${values[i]}$ 本身。`,
                ],
              ],
              [
                ["Add their frequencies", "把它们的频数相加"],
                ["The running total:", "累计："],
                [`${freqs.slice(0, i + 1).join(" + ")} = ${cf}`],
              ],
            ],
            [
              `Count from the other end: $${n}$ values in all, minus the $${above}$ above $${values[i]}$, leaves $${n} - ${above} = ${cf}$.`,
              `从另一端数：一共 $${n}$ 个数据，减去大于 $${values[i]}$ 的 $${above}$ 个，剩下 $${n} - ${above} = ${cf}$ 个。`,
            ],
            [
              [
                freqs[i]!,
                `That is the frequency of $${values[i]}$ alone, without the values below it.`,
                `这只是 $${values[i]}$ 本身的频数，没有加上比它小的值。`,
              ],
              [
                cf - freqs[i]!,
                `That stops before $${values[i]}$; the cumulative frequency includes $${values[i]}$ itself.`,
                `这在 $${values[i]}$ 之前就停了；累积频数要包括 $${values[i]}$ 本身。`,
              ],
              [
                sum(freqs.slice(i)),
                `That counts from $${values[i]}$ up instead of from the smallest value up.`,
                `这是从 $${values[i]}$ 往上数，而不是从最小的值往上数。`,
              ],
            ],
            {
              form: "integer",
              figure: freqTape(
                values,
                freqs,
                (k) => k <= i,
                "The frequencies as one bar, the pieces up to the value asked for shaded.",
                "把各频数画成一个长条，不超过所问值的各段涂色。",
              ),
            },
          );
        },
        freqTape(
          [0, 1, 2, 3],
          [3, 8, 5, 2],
          (k) => k <= 2,
          "Frequencies 3, 8, 5 and 2 of the values 0 to 3 as one bar, the first three pieces shaded: 16 in all.",
          "值 0 到 3 的频数 3、8、5、2 画成一个长条，前三段涂色，共 16 个。",
        ),
      ),
      lesson(
        "reading-cumulative-frequency-tables",
        ["Reading cumulative frequency tables", "读累积频数表"],
        [
          [
            "With cumulative frequencies $3, 11, 16, 18$ for $0, 1, 2, 3$:\n\n- exactly $2$: $16 - 11 = 5$ values;\n- more than $1$: $18 - 11 = 7$ values;\n- at least $1$: $18 - 3 = 15$ values.",
            "$0, 1, 2, 3$ 的累积频数分别是 $3, 11, 16, 18$：\n\n- 恰好为 $2$：$16 - 11 = 5$ 个；\n- 大于 $1$：$18 - 11 = 7$ 个；\n- 至少为 $1$：$18 - 3 = 15$ 个。",
          ],
          [
            "Add back: the $11$ values that are $1$ or less and the $7$ more than $1$ make all $18$.",
            "加回去验证：小于或等于 $1$ 的 $11$ 个，加上大于 $1$ 的 $7$ 个，正好是全部 $18$ 个。",
          ],
          ["Subtract cumulative frequencies; adding them counts values twice.", "要把累积频数相减；把它们相加会重复计数。"],
        ],
        (rng) => {
          const { ty, values, freqs } = tally(rng);
          const cum = running(freqs);
          const n = cum[cum.length - 1]!;
          const i = rng.int(1, values.length - 2);
          const v = values[i]!;
          const u = values[i - 1]!;
          const kind = rng.pick(["exactly", "more", "atLeast"] as const);
          const answer = kind === "exactly" ? freqs[i]! : kind === "more" ? n - cum[i]! : n - cum[i - 1]!;
          const ask: Pair =
            kind === "exactly"
              ? [`How many ${ty.noun.en} had exactly $${v}$?`, `恰好为 $${v}$ 的有多少${ty.noun["zh-CN"]}？`]
              : kind === "more"
                ? [`How many ${ty.noun.en} had more than $${v}$?`, `大于 $${v}$ 的有多少${ty.noun["zh-CN"]}？`]
                : [`How many ${ty.noun.en} had at least $${v}$?`, `至少为 $${v}$ 的有多少${ty.noun["zh-CN"]}？`];
          const [big, small, bigSaid, smallSaid]: [number, number, Pair, Pair] =
            kind === "exactly"
              ? [
                  cum[i]!,
                  cum[i - 1]!,
                  [`$${cum[i]}$ values are $${v}$ or less`, `小于或等于 $${v}$ 的有 $${cum[i]}$ 个`],
                  [`$${cum[i - 1]}$ are $${u}$ or less`, `小于或等于 $${u}$ 的有 $${cum[i - 1]}$ 个`],
                ]
              : kind === "more"
                ? [
                    n,
                    cum[i]!,
                    [`$${n}$ values in all`, `一共 $${n}$ 个数据`],
                    [`$${cum[i]}$ are $${v}$ or less`, `小于或等于 $${v}$ 的有 $${cum[i]}$ 个`],
                  ]
                : [
                    n,
                    cum[i - 1]!,
                    [`$${n}$ values in all`, `一共 $${n}$ 个数据`],
                    [`$${cum[i - 1]}$ are $${u}$ or less, below $${v}$`, `小于或等于 $${u}$（即小于 $${v}$）的有 $${cum[i - 1]}$ 个`],
                  ];
          const offs: Off[] =
            kind === "exactly"
              ? [
                  [cum[i]!, `That counts every value up to $${v}$, not just $${v}$.`, `这是不超过 $${v}$ 的所有数据，不只是 $${v}$。`],
                  [n - cum[i]!, `That counts the values more than $${v}$.`, `这是大于 $${v}$ 的数据个数。`],
                  [
                    cum[i]! + cum[i - 1]!,
                    "That adds the cumulative frequencies instead of subtracting them.",
                    "这是把累积频数相加，而不是相减。",
                  ],
                ]
              : kind === "more"
                ? [
                    [cum[i]!, `That counts the values $${v}$ or less.`, `这是小于或等于 $${v}$ 的数据个数。`],
                    [
                      n - cum[i - 1]!,
                      `That includes $${v}$ itself; “more than $${v}$” leaves it out.`,
                      `这包括了 $${v}$ 本身；“大于 $${v}$”不包括它。`,
                    ],
                    [cum[i - 1]!, `That counts the values less than $${v}$.`, `这是小于 $${v}$ 的数据个数。`],
                  ]
                : [
                    [
                      n - cum[i]!,
                      `That leaves out $${v}$ itself; “at least $${v}$” includes it.`,
                      `这去掉了 $${v}$ 本身；“至少为 $${v}$”包括它。`,
                    ],
                    [cum[i - 1]!, `That counts the values less than $${v}$.`, `这是小于 $${v}$ 的数据个数。`],
                    [cum[i]!, `That counts the values $${v}$ or less.`, `这是小于或等于 $${v}$ 的数据个数。`],
                  ];
          return valued(
            [
              `${ty.intro.en}${tallyTable(ty, values, freqs, "c").en}${ask[0]}`,
              `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "c")["zh-CN"]}${ask[1]}`,
            ],
            answer,
            [
              [
                ["Pick the two totals", "选出两个累计数"],
                [`${bigSaid[0]}, and ${smallSaid[0]}.`, `${bigSaid[1]}，${smallSaid[1]}。`],
              ],
              [["Subtract", "相减"], ["The difference is the count asked for:", "差就是所求的个数："], [`${big} - ${small} = ${answer}`]],
            ],
            [`Add back: $${small} + ${answer} = ${big}$.`, `加回去验证：$${small} + ${answer} = ${big}$。`],
            offs,
            { form: "integer", figure: rowFigure(values.map(String), cum) },
          );
        },
        rowFigure(["0", "1", "2", "3"], [3, 11, 16, 18]),
      ),
    ],
  ),
  [
    "A ticket booth counts people as they arrive: $3$ in the first minute, $8$ in the second, $5$ in the third. The counter on the gate shows $3$, then $11$, then $16$.",
    "售票处统计入场人数：第一分钟来了 $3$ 人，第二分钟 $8$ 人，第三分钟 $5$ 人。门口的计数器依次显示 $3$、$11$、$16$。",
  ],
  [
    "The counter shows running totals; the people in the third minute are $16 - 11 = 5$.",
    "计数器显示的是累计数；第三分钟来的人数是 $16 - 11 = 5$。",
  ],
  [
    "build cumulative frequencies by running totals and read counts from them by subtracting.",
    "学习用累计求累积频数，并用相减的方法从中读出个数。",
  ],
);

// ---------------------------------------------------------------------------
// Means, medians and modes of tables and histograms

/** calculatingMeansFromFrequencyTables estimates means of grouped data and finds missing frequencies from a mean. */
export const calculatingMeansFromFrequencyTables = withIntro(
  topic(
    "calculating-means-from-frequency-tables",
    t("Calculating Means From Frequency Tables", "由频数表计算平均数"),
    t(
      "The mean of a frequency table is the sum of value × frequency divided by the sum of the frequencies. When the data are grouped into classes, the exact values are lost, so each class is represented by its midpoint and the result is an estimate of the mean. If the mean is known, the same formula gives an equation for a missing frequency.",
      "频数表的平均数等于各“值 × 频数”之和除以频数之和。数据分组后，确切的数值就看不到了，所以每一组用它的组中值代表，得到的是平均数的估计值。如果已知平均数，同一个公式就给出了求未知频数的方程。",
    ),
    ["frequency-tables"],
    ["6.SP.B.5.C", "7.SP.B.4"],
    [
      lesson(
        "estimating-the-mean-of-grouped-data",
        ["Estimating the mean of grouped data", "估计分组数据的平均数"],
        [
          [
            "For travel times with frequencies $4, 9, 7$ in the classes $0 \\le t < 10$, $10 \\le t < 20$ and $20 \\le t < 30$, use the midpoints $5, 15, 25$:\n\n$$\\frac{5 \\times 4 + 15 \\times 9 + 25 \\times 7}{4 + 9 + 7} = \\frac{330}{20} = 16.5 \\text{ min}.$$\n\nThis is an estimate, since the times inside each class are not known.",
            "上学时间在 $0 \\le t < 10$、$10 \\le t < 20$、$20 \\le t < 30$ 三组中的频数分别是 $4, 9, 7$，用组中值 $5, 15, 25$：\n\n$$\\frac{5 \\times 4 + 15 \\times 9 + 25 \\times 7}{4 + 9 + 7} = \\frac{330}{20} = 16.5 \\text{ 分钟}.$$\n\n这是估计值，因为每组里面的具体时间并不知道。",
          ],
          [
            "Count in class widths from the first midpoint: $5 + 10 \\times \\frac{0 \\times 4 + 1 \\times 9 + 2 \\times 7}{20} = 5 + 10 \\times \\frac{23}{20} = 16.5$.",
            "从第一个组中值起按组距来数：$5 + 10 \\times \\frac{0 \\times 4 + 1 \\times 9 + 2 \\times 7}{20} = 5 + 10 \\times \\frac{23}{20} = 16.5$。",
          ],
          ["Divide by the number of values, $20$, not by the number of classes, $3$.", "要除以数据个数 $20$，而不是组数 $3$。"],
        ],
        (rng) => groupedMean(rng, false),
        exampleHistogram([0, 10, 20, 30], [4, 9, 7]),
      ),
      lesson(
        "a-missing-frequency-from-the-mean",
        ["A missing frequency from the mean", "由平均数求未知频数"],
        [
          [
            "Quiz scores $6, 7, 8$ have frequencies $4, k, 2$, and the mean is $6.8$. The total of the scores is $6 \\times 4 + 7k + 8 \\times 2 = 40 + 7k$ and the number of scores is $6 + k$, so\n\n$$\\frac{40 + 7k}{6 + k} = 6.8 \\quad\\Rightarrow\\quad 40 + 7k = 40.8 + 6.8k \\quad\\Rightarrow\\quad 0.2k = 0.8 \\quad\\Rightarrow\\quad k = 4.$$",
            "小测成绩 $6, 7, 8$ 的频数分别是 $4, k, 2$，平均数是 $6.8$。成绩总和是 $6 \\times 4 + 7k + 8 \\times 2 = 40 + 7k$，成绩个数是 $6 + k$，所以\n\n$$\\frac{40 + 7k}{6 + k} = 6.8 \\quad\\Rightarrow\\quad 40 + 7k = 40.8 + 6.8k \\quad\\Rightarrow\\quad 0.2k = 0.8 \\quad\\Rightarrow\\quad k = 4.$$",
          ],
          [
            "Put $k = 4$ back: $\\frac{40 + 28}{6 + 4} = \\frac{68}{10} = 6.8$.",
            "把 $k = 4$ 代回去：$\\frac{40 + 28}{6 + 4} = \\frac{68}{10} = 6.8$。",
          ],
          [
            "The unknown frequency is in the number of values too: divide by $6 + k$, not by $6$.",
            "未知频数也在数据个数里：要除以 $6 + k$，而不是 $6$。",
          ],
        ],
        (rng) => {
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
            const last = coef.sign() > 0 ? `${dec(coef)}k = ${dec(left)}` : `${dec(coef.neg())}k = ${dec(left.neg())}`;
            const offs: Off[] = [
              ...(values[j] === 0
                ? []
                : [[left.div(Q.of(values[j]!)), "That leaves $k$ out of the number of values.", "这是在数据个数中漏掉了 $k$。"] as const]),
              [sum(freqs), "That is the total frequency, not $k$.", "这是频数的总和，不是 $k$。"],
            ];
            return valued(
              [
                `${ty.intro.en}${table("en")}The mean is $${dec(mu)}$. What is $k$?`,
                `${ty.intro["zh-CN"]}${table("zh-CN")}平均数是 $${dec(mu)}$。$k$ 是多少？`,
              ],
              k,
              [
                [
                  ["Write the total and the count", "写出总和与个数"],
                  [
                    `The total is $${known} + ${vk}$ and the number of values is $${count} + k$, so`,
                    `总和是 $${known} + ${vk}$，数据个数是 $${count} + k$，所以`,
                  ],
                  [`\\frac{${known} + ${vk}}{${count} + k} = ${dec(mu)}`],
                ],
                [
                  ["Solve for k", "解出 k"],
                  ["Multiply out and collect the $k$ terms:", "去分母，再合并含 $k$ 的项："],
                  [`${known} + ${vk} = ${dec(mu.mul(Q.of(count)))} + ${dec(mu)}k`, last, `k = ${k}`],
                ],
              ],
              [
                `Put $k = ${k}$ back: $\\frac{${known} + ${values[j]! * k}}{${count} + ${k}} = \\frac{${known + values[j]! * k}}{${count + k}} = ${dec(mu)}$.`,
                `把 $k = ${k}$ 代回去：$\\frac{${known} + ${values[j]! * k}}{${count} + ${k}} = \\frac{${known + values[j]! * k}}{${count + k}} = ${dec(mu)}$。`,
              ],
              offs.filter(([w]) => (w instanceof Q ? w.isInteger() && w.sign() > 0 : w > 0)),
              {
                form: "integer",
                solveFor: "k",
                figure: rowFigure(
                  values.map(String),
                  freqs.map((f, i) => (i === j ? null : f)),
                ),
              },
            );
          }
        },
        rowFigure(["6", "7", "8"], [4, null, 2]),
      ),
    ],
  ),
  [
    "A coach writes down how many laps each runner finished, but in groups: $0$ to $10$ laps, $10$ to $20$, $20$ to $30$. Can she still find the mean?",
    "教练记录了每名队员跑的圈数，但只记了分组：$0$ 到 $10$ 圈、$10$ 到 $20$ 圈、$20$ 到 $30$ 圈。她还能求出平均数吗？",
  ],
  [
    "Not exactly, but treating every runner in a group as the midpoint gives a close estimate.",
    "不能精确求出，但把每组的队员都看作组中值，就能得到一个接近的估计。",
  ],
  [
    "estimate the mean of grouped data from midpoints, and find a missing frequency from a known mean.",
    "学习用组中值估计分组数据的平均数，并由已知平均数求未知频数。",
  ],
);

/** calculatingMediansFromFrequencyTables locates the median of tabulated data and the class that holds it. */
export const calculatingMediansFromFrequencyTables = withIntro(
  topic(
    "calculating-medians-from-frequency-tables",
    t("Calculating Medians From Frequency Tables", "由频数表计算中位数"),
    t(
      "In a frequency table the values are already in order, so the median is found by counting: with n values, the median is the value in position (n + 1)/2, or the mean of the two middle values when n is even. Running totals of the frequencies show which row holds that position. For grouped data, this finds the class that contains the median.",
      "频数表中的值已经排好了顺序，所以通过计数就能求中位数：共有 n 个数据时，中位数是第 (n + 1)/2 个数据；n 为偶数时，是中间两个数据的平均数。各频数的累计和可以显示这个位置落在哪一行。对于分组数据，这样可以找出中位数所在的组。",
    ),
    ["cumulative-frequency", "the-median-of-a-data-set"],
    ["6.SP.B.5.C"],
    [
      lesson(
        "the-median-from-a-frequency-table",
        ["The median from a frequency table", "从频数表求中位数"],
        [
          [
            "Sibling counts $0, 1, 2, 3$ have frequencies $3, 8, 5, 2$, so there are $18$ values and the median is the mean of the $9$th and $10$th. The running totals are $3, 11, 16, 18$: values $4$ to $11$ are all $1$, so both middle values are $1$ and the median is $1$.",
            "兄弟姐妹人数 $0, 1, 2, 3$ 的频数分别是 $3, 8, 5, 2$，共 $18$ 个数据，中位数是第 $9$ 个和第 $10$ 个数据的平均数。累计和依次是 $3, 11, 16, 18$：第 $4$ 到第 $11$ 个数据都是 $1$，所以中间两个数据都是 $1$，中位数是 $1$。",
          ],
          [
            "Count down from the largest value: the running totals are $2, 7, 15, 18$, and the $9$th and $10$th from the top are also $1$.",
            "从最大的值往下数：累计依次是 $2, 7, 15, 18$，从上往下数第 $9$ 个和第 $10$ 个也都是 $1$。",
          ],
          [
            "The median is a value of the data, not its position $9.5$ and not the middle row of the table.",
            "中位数是数据中的值，不是它的位置 $9.5$，也不是表格中间那一行。",
          ],
        ],
        (rng) => {
          const { ty, values, freqs } = tally(rng);
          const xs = expand(values, freqs);
          const n = xs.length;
          const med = median(xs);
          const cum = running(freqs);
          const down = running([...freqs].reverse());
          const a = xs[Math.ceil(n / 2) - 1]!;
          const b = xs[Math.floor(n / 2)]!;
          const odd = n % 2 === 1;
          return valued(
            [
              `${ty.intro.en}${tallyTable(ty, values, freqs, "f").en}What is the median?`,
              `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "f")["zh-CN"]}中位数是多少？`,
            ],
            med,
            [
              [
                ["Find the middle position", "找出中间的位置"],
                odd
                  ? [
                      `There are $${freqs.join(" + ")} = ${n}$ values, so the median is the ${ordinal((n + 1) / 2)}.`,
                      `共有 $${freqs.join(" + ")} = ${n}$ 个数据，所以中位数是第 $${(n + 1) / 2}$ 个。`,
                    ]
                  : [
                      `There are $${freqs.join(" + ")} = ${n}$ values, so the median is the mean of the ${ordinal(n / 2)} and ${ordinal(n / 2 + 1)}.`,
                      `共有 $${freqs.join(" + ")} = ${n}$ 个数据，所以中位数是第 $${n / 2}$ 个和第 $${n / 2 + 1}$ 个的平均数。`,
                    ],
              ],
              [
                ["Run the totals", "累加频数"],
                odd || a === b
                  ? [
                      `The running totals are $${list(cum)}$, so the middle ${odd ? "value is" : "values are both"} $${a}$.`,
                      `累计依次是 $${list(cum)}$，所以中间的${odd ? "数据是" : "两个数据都是"} $${a}$。`,
                    ]
                  : [
                      `The running totals are $${list(cum)}$, so the middle values are $${a}$ and $${b}$, and their mean is $${dec(med)}$.`,
                      `累计依次是 $${list(cum)}$，所以中间两个数据是 $${a}$ 和 $${b}$，平均数是 $${dec(med)}$。`,
                    ],
              ],
            ],
            [
              `Count down from the largest value: the running totals are $${list(down)}$, and the middle positions land on the same ${odd || a === b ? "value" : "values"} from the top.`,
              `从最大的值往下数：累计依次是 $${list(down)}$，从上往下数，中间的位置落在同样的值上。`,
            ],
            [
              [Q.of(n + 1, 2), "That is the position of the median, not its value.", "这是中位数的位置，不是它的值。"],
              [
                Q.of(values[Math.floor(values.length / 2)]!),
                "That is the middle row of the table, but the rows hold different numbers of values.",
                "这是表格中间那一行，但各行的数据个数不同。",
              ],
              [
                Q.of(values[freqs.indexOf(Math.max(...freqs))]!),
                "That has the greatest frequency: it is the mode.",
                "它的频数最大：它是众数。",
              ],
              [median(freqs), "That is the median of the frequencies, not of the values.", "这是频数的中位数，不是数据的中位数。"],
            ],
            {
              form: "decimal",
              figure: freqTape(
                values,
                freqs,
                (k) => values[k] === a || values[k] === b,
                "The values as one bar, each piece as long as its frequency, the piece holding the middle shaded.",
                "把各值画成一个长条，每段长度等于频数，中间位置所在的段涂色。",
              ),
            },
          );
        },
        freqTape(
          [0, 1, 2, 3],
          [3, 8, 5, 2],
          (k) => k === 1,
          "Frequencies 3, 8, 5 and 2 of the values 0 to 3 as one bar; the 9th and 10th values fall in the piece for 1.",
          "值 0 到 3 的频数 3、8、5、2 画成一个长条；第 9 和第 10 个数据落在 1 那一段。",
        ),
      ),
      lesson(
        "the-class-containing-the-median",
        ["The class containing the median", "中位数所在的组"],
        [
          [
            "Times in the classes $0 \\le t < 10$, $10 \\le t < 20$, $20 \\le t < 30$, $30 \\le t < 40$ have frequencies $6, 11, 9, 4$: $30$ values, so the median lies between the $15$th and $16$th. The running totals are $6, 17, 26, 30$, so both are in the second class, and the median is in $10 \\le t < 20$, though its exact value is unknown.",
            "时间在 $0 \\le t < 10$、$10 \\le t < 20$、$20 \\le t < 30$、$30 \\le t < 40$ 各组的频数分别是 $6, 11, 9, 4$：共 $30$ 个数据，中位数在第 $15$ 个和第 $16$ 个之间。累计和依次是 $6, 17, 26, 30$，所以这两个数据都在第二组，中位数在 $10 \\le t < 20$ 中，但它的确切值并不知道。",
          ],
          [
            "Count from both ends: $6$ values lie below that class and $13$ above it, each fewer than half of $30$.",
            "从两端数：这一组以下有 $6$ 个数据，以上有 $13$ 个，都不到 $30$ 的一半。",
          ],
          [
            "The class of the median is not the middle row of the table; the rows hold different numbers of values.",
            "中位数所在的组不一定是表格中间那一行；各行的数据个数不同。",
          ],
        ],
        (rng) => medianClass(rng, false),
        exampleHistogram([0, 10, 20, 30, 40], [6, 11, 9, 4]),
      ),
    ],
  ),
  [
    "Eighteen friends line up by how many siblings they have. Who stands in the middle of the line?",
    "十八个朋友按兄弟姐妹的人数排成一队。谁站在队伍的正中间？",
  ],
  [
    "A frequency table is that line already sorted: count down the rows to reach the middle.",
    "频数表就是已经排好的队伍：沿着各行往下数，就能数到中间。",
  ],
  [
    "find the median of a frequency table by running totals, and the class that holds the median of grouped data.",
    "学习用累计的方法求频数表的中位数，并找出分组数据的中位数所在的组。",
  ],
);

/** calculatingModesFromFrequencyTables finds modes, modal classes and the frequencies that make a mode. */
export const calculatingModesFromFrequencyTables = withIntro(
  topic(
    "calculating-modes-from-frequency-tables",
    t("Calculating Modes From Frequency Tables", "由频数表计算众数"),
    t(
      "The mode of a frequency table is the value with the greatest frequency; when two values tie for the greatest frequency, both are modes. For grouped data the class with the greatest frequency is the modal class. The mode is always a value of the data, never a frequency.",
      "频数表的众数是频数最大的值；如果两个值的频数并列最大，它们都是众数。对于分组数据，频数最大的组叫众数组。众数一定是数据中的值，而不是频数。",
    ),
    ["frequency-tables"],
    ["6.SP.B.5.C"],
    [
      lesson(
        "one-or-two-modes",
        ["One mode or two", "一个众数还是两个"],
        [
          [
            "If scores $5, 6, 7, 8, 9$ have frequencies $2, 6, 4, 6, 1$, the greatest frequency $6$ belongs to both $6$ and $8$, so the data have two modes, $6$ and $8$.",
            "如果成绩 $5, 6, 7, 8, 9$ 的频数分别是 $2, 6, 4, 6, 1$，最大频数 $6$ 同时属于 $6$ 和 $8$，所以数据有两个众数：$6$ 和 $8$。",
          ],
          [
            "Every other frequency, $2, 4, 1$, is less than $6$, so no third value joins them.",
            "其他频数 $2, 4, 1$ 都小于 $6$，所以没有第三个众数。",
          ],
          [
            "Look at every frequency before choosing; stopping at the first $6$ misses a mode.",
            "要看完所有频数再判断；看到第一个 $6$ 就停下，会漏掉一个众数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const { ty, values, freqs } = tally(rng);
            const two = rng.bool();
            const top = Math.max(...freqs);
            const tops = values.filter((_, i) => freqs[i] === top);
            if (tops.length !== 1) continue;
            if (two) {
              const i = values.indexOf(tops[0]!);
              const candidates = values.map((_, k) => k).filter((k) => Math.abs(k - i) >= 2);
              if (candidates.length === 0) continue;
              freqs[rng.pick(candidates)] = top;
            }
            const modes = values.filter((_, i) => freqs[i] === top);
            const rest = freqs.filter((f) => f !== top);
            const second = Math.max(...rest);
            const runnerUp = values.find((_, i) => freqs[i] === second)!;
            const tex = (vs: readonly number[]): Pair =>
              vs.length === 1 ? [`$${vs[0]}$ only`, `只有 $${vs[0]}$`] : [`$${vs[0]}$ and $${vs[1]}$`, `$${vs[0]}$ 和 $${vs[1]}$`];
            const right = tex(modes);
            const candidates: Wrong[] = [
              ...(modes.length === 2
                ? [
                    [
                      tex([modes[0]!]),
                      `$${modes[1]}$ has the same frequency, $${top}$, so it is a mode too.`,
                      `$${modes[1]}$ 的频数也是 $${top}$，所以它也是众数。`,
                    ] as const,
                    [
                      tex([modes[1]!]),
                      `$${modes[0]}$ has the same frequency, $${top}$, so it is a mode too.`,
                      `$${modes[0]}$ 的频数也是 $${top}$，所以它也是众数。`,
                    ] as const,
                  ]
                : [
                    [
                      tex([modes[0]!, runnerUp].sort((x, y) => x - y)),
                      `$${runnerUp}$ has frequency $${second}$, less than $${top}$.`,
                      `$${runnerUp}$ 的频数是 $${second}$，小于 $${top}$。`,
                    ] as const,
                  ]),
              [tex([top]), `$${top}$ is the greatest frequency, not a value of the data.`, `$${top}$ 是最大的频数，不是数据中的值。`],
              [
                ["There is no mode.", "没有众数。"],
                `A value with the greatest frequency, $${top}$, exists, so there is a mode.`,
                `存在频数最大（$${top}$）的值，所以有众数。`,
              ],
            ];
            const wrong = candidates.filter(([o], k) => o[0] !== right[0] && candidates.findIndex(([p]) => p[0] === o[0]) === k);
            return chosen(
              rng,
              [
                `${ty.intro.en}${tallyTable(ty, values, freqs, "f").en}What is the mode, or what are the modes?`,
                `${ty.intro["zh-CN"]}${tallyTable(ty, values, freqs, "f")["zh-CN"]}众数是多少？`,
              ],
              right,
              wrong,
              [
                [
                  ["Find the greatest frequency", "找出最大的频数"],
                  [`The frequencies are $${list(freqs)}$; the greatest is $${top}$.`, `各频数依次是 $${list(freqs)}$，最大的是 $${top}$。`],
                ],
                [
                  ["Read every value with it", "读出所有频数为它的值"],
                  modes.length === 2
                    ? [
                        `Both $${modes[0]}$ and $${modes[1]}$ have frequency $${top}$, so both are modes.`,
                        `$${modes[0]}$ 和 $${modes[1]}$ 的频数都是 $${top}$，所以两个都是众数。`,
                      ]
                    : [
                        `Only $${modes[0]}$ has frequency $${top}$, so it is the mode.`,
                        `只有 $${modes[0]}$ 的频数是 $${top}$，所以它是众数。`,
                      ],
                ],
              ],
              [
                `Every other frequency, $${list(rest)}$, is less than $${top}$, so no other value ties.`,
                `其他频数 $${list(rest)}$ 都小于 $${top}$，所以没有别的值与之并列。`,
              ],
              rowFigure(values.map(String), freqs),
            );
          }
        },
        rowFigure(["5", "6", "7", "8", "9"], [2, 6, 4, 6, 1]),
      ),
      lesson(
        "the-modal-class",
        ["The modal class", "众数组"],
        [
          [
            "In grouped data the exact values are hidden, so instead of a mode there is a modal class: the class with the greatest frequency. For frequencies $6, 11, 9, 4$ in the classes $0 \\le t < 10$, $10 \\le t < 20$, $20 \\le t < 30$, $30 \\le t < 40$, the modal class is $10 \\le t < 20$.",
            "分组数据看不到确切的数值，所以不说众数，而说众数组：频数最大的那一组。$0 \\le t < 10$、$10 \\le t < 20$、$20 \\le t < 30$、$30 \\le t < 40$ 各组的频数分别是 $6, 11, 9, 4$，众数组是 $10 \\le t < 20$。",
          ],
          [
            "No other class ties: the next greatest frequency is $9$, less than $11$.",
            "没有别的组与它并列：第二大的频数是 $9$，小于 $11$。",
          ],
          ["The answer is a class, not the frequency $11$.", "答案是一个组，而不是频数 $11$。"],
        ],
        (rng) => modalClass(rng, false),
        exampleHistogram([0, 10, 20, 30, 40], [6, 11, 9, 4]),
      ),
      lesson(
        "frequencies-that-make-a-mode",
        ["Frequencies that make a mode", "使某值成为众数的频数"],
        [
          [
            "Scores $6, 7, 8, 9$ have frequencies $5, 3, k, 7$. For $8$ to be the only mode, its frequency must beat every other one, including $7$, so $k$ must be at least $8$.",
            "成绩 $6, 7, 8, 9$ 的频数分别是 $5, 3, k, 7$。要使 $8$ 成为唯一的众数，它的频数必须大于其他所有频数，包括 $7$，所以 $k$ 至少是 $8$。",
          ],
          [
            "Try both sides: with $k = 8$ only $8$ has the greatest frequency; with $k = 7$ the values $8$ and $9$ tie.",
            "两边都试一试：$k = 8$ 时只有 $8$ 的频数最大；$k = 7$ 时 $8$ 和 $9$ 并列。",
          ],
          ["Equal is not enough: a tie gives two modes, not one.", "相等还不够：并列会有两个众数，而不是一个。"],
        ],
        (rng) => {
          const ty = rng.pick(tallies);
          const values = [0, 1, 2, 3, 4].map((i) => ty.first + i);
          const freqs = values.map(() => rng.int(1, 12));
          const j = rng.int(0, 4);
          const top = Math.max(...freqs.filter((_, i) => i !== j));
          const holder = values.find((_, i) => i !== j && freqs[i] === top)!;
          const shown = freqs.map((f, i) => (i === j ? "k" : String(f)));
          const table = (lang: "en" | "zh-CN") =>
            mdTable(
              [ty.label[lang], lang === "en" ? "Frequency" : "频数"],
              values.map((v, i) => [m(v), m(shown[i]!)]),
            );
          return valued(
            [
              `${ty.intro.en}${table("en")}What is the least whole number $k$ for which $${values[j]}$ is the only mode?`,
              `${ty.intro["zh-CN"]}${table("zh-CN")}要使 $${values[j]}$ 成为唯一的众数，整数 $k$ 最小是多少？`,
            ],
            top + 1,
            [
              [
                ["Find the greatest other frequency", "找出其他频数中最大的"],
                [
                  `Apart from $k$, the greatest frequency is $${top}$, for $${holder}$.`,
                  `除 $k$ 外，最大的频数是 $${top}$（属于 $${holder}$）。`,
                ],
              ],
              [
                ["Beat it", "超过它"],
                [
                  `$k$ must be greater than $${top}$, so the least whole number is $${top + 1}$.`,
                  `$k$ 必须大于 $${top}$，所以最小的整数是 $${top + 1}$。`,
                ],
              ],
            ],
            [
              `Try both sides: with $k = ${top + 1}$ only $${values[j]}$ has the greatest frequency; with $k = ${top}$ it ties with $${holder}$.`,
              `两边都试一试：$k = ${top + 1}$ 时只有 $${values[j]}$ 的频数最大；$k = ${top}$ 时它与 $${holder}$ 并列。`,
            ],
            [
              [top, `That ties with $${holder}$, giving two modes.`, `这会与 $${holder}$ 并列，有两个众数。`],
              [values[j]!, "That is the value itself, not its frequency.", "这是这个值本身，不是它的频数。"],
              [top + 2, `That works, but $${top + 1}$ already beats $${top}$.`, `这样也可以，但 $${top + 1}$ 已经大于 $${top}$ 了。`],
            ],
            {
              form: "integer",
              solveFor: "k",
              figure: rowFigure(
                values.map(String),
                freqs.map((f, i) => (i === j ? null : f)),
              ),
            },
          );
        },
        rowFigure(["6", "7", "8", "9"], [5, 3, null, 7]),
      ),
    ],
  ),
  [
    "A shoe shop sells sizes $5$ to $9$ and counts the pairs sold of each. Which size should it order most of?",
    "一家鞋店卖 $5$ 到 $9$ 码的鞋，统计了每个码卖出的双数。它应该多进哪个码？",
  ],
  ["The size sold most often, the mode, is read from the greatest frequency in the table.", "卖得最多的码就是众数，从表中最大的频数读出。"],
  [
    "read the mode or modes from a frequency table, the modal class of grouped data, and the frequency that makes a mode.",
    "学习从频数表读出众数，找出分组数据的众数组，并求使某值成为众数的频数。",
  ],
);

/** calculatingModesAndMediansFromHistograms reads the modal class and the class of the median from histograms. */
export const calculatingModesAndMediansFromHistograms = withIntro(
  topic(
    "calculating-modes-and-medians-from-histograms",
    t("Calculating Modes and Medians From Histograms", "由直方图求众数和中位数"),
    t(
      "A histogram is a grouped frequency table drawn as bars: each bar covers a class, and its height is the class frequency. The tallest bar is the modal class. Adding the bar heights from the left gives running totals, which show the class that holds the middle value: the class of the median.",
      "直方图是用矩形条画出来的分组频数表：每个矩形条覆盖一组，高度是这一组的频数。最高的矩形条就是众数组。从左往右把各矩形条的高度累加，就能看出中间那个数据落在哪一组，也就是中位数所在的组。",
    ),
    ["histograms", "calculating-medians-from-frequency-tables", "calculating-modes-from-frequency-tables"],
    ["6.SP.B.4", "6.SP.B.5.C"],
    [
      lesson(
        "the-modal-class-from-a-histogram",
        ["The modal class from a histogram", "从直方图求众数组"],
        [
          [
            "Read the class under the tallest bar. If the bars over $10$–$20$, $20$–$30$, $30$–$40$ and $40$–$50$ have heights $4, 9, 12, 5$, the modal class is $30$ to $40$.",
            "读出最高矩形条下面的组。如果 $10$–$20$、$20$–$30$、$30$–$40$、$40$–$50$ 上方矩形条的高度分别是 $4, 9, 12, 5$，众数组就是 $30$ 到 $40$。",
          ],
          ["No other bar ties: the next tallest is $9$, shorter than $12$.", "没有别的矩形条与它一样高：第二高的是 $9$，比 $12$ 矮。"],
          [
            "The answer is the class read on the horizontal axis, not the height $12$ read on the vertical axis.",
            "答案是在横轴上读出的组，而不是在纵轴上读出的高度 $12$。",
          ],
        ],
        (rng) => modalClass(rng, true),
        drawn(gradeDrawings3["calculating-modes-and-medians-from-histograms#the-modal-class-from-a-histogram"]),
      ),
      lesson(
        "the-class-of-the-median-from-a-histogram",
        ["The class of the median from a histogram", "从直方图求中位数所在的组"],
        [
          [
            "First add all the bar heights to get the number of values. With heights $4, 9, 12, 5$ there are $30$ values, so the median is between the $15$th and $16$th. The running totals are $4, 13, 25, 30$, so both lie in the third bar: the median is between $30$ and $40$.",
            "先把各矩形条的高度相加，得到数据个数。高度为 $4, 9, 12, 5$ 时共有 $30$ 个数据，中位数在第 $15$ 个和第 $16$ 个之间。累计和依次是 $4, 13, 25, 30$，所以这两个数据都在第三个矩形条中：中位数在 $30$ 到 $40$ 之间。",
          ],
          [
            "Count from both ends: $13$ values lie below that bar and $5$ above it, each fewer than half of $30$.",
            "从两端数：这个矩形条以左有 $13$ 个数据，以右有 $5$ 个，都不到 $30$ 的一半。",
          ],
          [
            "The middle bar of the picture is not always the bar of the median; count the heights.",
            "图中间的矩形条不一定是中位数所在的；要数高度。",
          ],
        ],
        (rng) => medianClass(rng, true),
        drawn(gradeDrawings3["calculating-modes-and-medians-from-histograms#the-class-of-the-median-from-a-histogram"]),
      ),
    ],
  ),
  [
    "A histogram of jump distances has a tall bar over $3$ to $4$ meters. Is that where the middle jumper landed?",
    "一张跳远距离的直方图中，$3$ 到 $4$ 米上方的矩形条最高。中间那名选手就落在这一段吗？",
  ],
  [
    "Not necessarily: the tallest bar is the modal class, while the middle jumper is found by adding the heights.",
    "不一定：最高的矩形条是众数组，而中间那名选手要靠累加高度来找。",
  ],
  [
    "read the modal class from the tallest bar and the class of the median from running totals of the heights.",
    "学习从最高的矩形条读出众数组，并用高度的累计找出中位数所在的组。",
  ],
);

/** calculatingMeansFromHistograms estimates totals and means from the bars of histograms. */
export const calculatingMeansFromHistograms = withIntro(
  topic(
    "calculating-means-from-histograms",
    t("Calculating Means From Histograms", "由直方图计算平均数"),
    t(
      "A histogram does not show the individual values, but each bar can stand for its class: as many values as its height, all at the class midpoint. Adding midpoint × height over the bars estimates the total of the data, and dividing by the sum of the heights estimates the mean.",
      "直方图不显示每一个数据，但每个矩形条可以代表它的那一组：数据个数等于矩形条的高度，而且都看作组中值。把各矩形条的“组中值 × 高度”相加，就估计出数据的总和；再除以各高度之和，就估计出平均数。",
    ),
    ["histograms", "calculating-means-from-frequency-tables"],
    ["6.SP.B.4", "6.SP.B.5.C"],
    [
      lesson(
        "estimating-a-total-from-a-histogram",
        ["Estimating a total from a histogram", "由直方图估计总和"],
        [
          [
            "A histogram of travel times has bars of heights $4, 9, 7$ over $0$–$10$, $10$–$20$ and $20$–$30$ minutes. Treat the $4$ times in the first bar as $5$ minutes each, and so on:\n\n$$5 \\times 4 + 15 \\times 9 + 25 \\times 7 = 20 + 135 + 175 = 330 \\text{ min}.$$",
            "一张上学时间的直方图中，$0$–$10$、$10$–$20$、$20$–$30$ 分钟上方的矩形条高度分别是 $4, 9, 7$。把第一个矩形条中的 $4$ 个时间都看作 $5$ 分钟，依此类推：\n\n$$5 \\times 4 + 15 \\times 9 + 25 \\times 7 = 20 + 135 + 175 = 330 \\text{ 分钟}.$$",
          ],
          [
            "Start from the left edges and add half a width for each value: $0 \\times 4 + 10 \\times 9 + 20 \\times 7 = 230$, and $230 + 5 \\times 20 = 330$.",
            "从左端点算起，再给每个数据加半个组距：$0 \\times 4 + 10 \\times 9 + 20 \\times 7 = 230$，$230 + 5 \\times 20 = 330$。",
          ],
          ["Use the midpoints, not the left edges of the bars.", "要用组中值，而不是矩形条的左端点。"],
        ],
        (rng) => {
          const d = grouped(rng);
          const mids = midpoints(d);
          const total = mids.reduce((s, x, i) => s.add(x.mul(Q.of(d.freqs[i]!))), Q.of(0));
          const lowers = d.freqs.reduce((s, f, i) => s + f * d.edges[i]!, 0);
          const uppers = d.freqs.reduce((s, f, i) => s + f * d.edges[i + 1]!, 0);
          const half = Q.of(d.edges[1]! - d.edges[0]!, 2);
          return valued(
            [
              `The histogram shows ${d.g.what(d.n).en}. Use the midpoints of the classes to estimate ${d.g.total.en}.`,
              `直方图显示了 ${d.g.what(d.n)["zh-CN"]}。用各组的组中值估计${d.g.total["zh-CN"]}。`,
            ],
            total,
            [
              [
                ["Read the bars", "读出各矩形条"],
                [
                  `The bar heights are $${list(d.freqs)}$ and the midpoints of their classes are $${list(mids.map(dec))}$.`,
                  `各矩形条高度是 $${list(d.freqs)}$，对应各组的组中值是 $${list(mids.map(dec))}$。`,
                ],
              ],
              [
                ["Multiply and add", "相乘再相加"],
                ["Each midpoint times its height:", "每个组中值乘它的高度："],
                [`${mids.map((x, i) => `${dec(x)} \\times ${d.freqs[i]}`).join(" + ")} = ${dec(total)}`],
              ],
            ],
            [
              `Start from the left edges and add half a width for each value: $${lowers} + ${dec(half)} \\times ${d.n} = ${dec(total)}$.`,
              `从左端点算起，再给每个数据加半个组距：$${lowers} + ${dec(half)} \\times ${d.n} = ${dec(total)}$。`,
            ],
            [
              [lowers, "That uses the left edges of the bars instead of their midpoints.", "这是用矩形条的左端点代替了组中值。"],
              [uppers, "That uses the right edges of the bars instead of their midpoints.", "这是用矩形条的右端点代替了组中值。"],
              [
                mids.reduce((s, x) => s.add(x), Q.of(0)),
                "That adds the midpoints without multiplying by the bar heights.",
                "这是只把组中值相加，没有乘矩形条的高度。",
              ],
            ],
            { form: "decimal", unit: d.g.unit, figure: histogramFigure(d) },
          );
        },
        drawn(gradeDrawings3["calculating-means-from-histograms#estimating-a-total-from-a-histogram"]),
      ),
      lesson(
        "estimating-a-mean-from-a-histogram",
        ["Estimating a mean from a histogram", "由直方图估计平均数"],
        [
          [
            "With bar heights $4, 9, 7$ over $0$–$10$, $10$–$20$, $20$–$30$, the estimated total is $330$ minutes and there are $4 + 9 + 7 = 20$ values, so the estimated mean is $330 \\div 20 = 16.5$ minutes.",
            "$0$–$10$、$10$–$20$、$20$–$30$ 上方矩形条高度为 $4, 9, 7$ 时，估计总和是 $330$ 分钟，共有 $4 + 9 + 7 = 20$ 个数据，所以估计平均数是 $330 \\div 20 = 16.5$ 分钟。",
          ],
          [
            "Count in class widths from the first midpoint: $5 + 10 \\times \\frac{0 \\times 4 + 1 \\times 9 + 2 \\times 7}{20} = 16.5$.",
            "从第一个组中值起按组距来数：$5 + 10 \\times \\frac{0 \\times 4 + 1 \\times 9 + 2 \\times 7}{20} = 16.5$。",
          ],
          [
            "Divide by the number of values, the sum of the heights, not by the number of bars.",
            "要除以数据个数（各高度之和），而不是矩形条的个数。",
          ],
        ],
        (rng) => groupedMean(rng, true),
        drawn(gradeDrawings3["calculating-means-from-histograms#estimating-a-mean-from-a-histogram"]),
      ),
    ],
  ),
  [
    "A histogram shows how long $20$ students took to get to school, but not any one student’s time. Can we still say how long the trip takes on average?",
    "一张直方图显示了 $20$ 名学生上学所用的时间，但看不到任何一个人的具体时间。我们还能说出平均要用多长时间吗？",
  ],
  [
    "Yes, as an estimate: let each bar stand for its height many values at its midpoint.",
    "能，作为估计：让每个矩形条代表“高度”个数据，都取组中值。",
  ],
  [
    "estimate the total and the mean of the data behind a histogram from the midpoints and heights of its bars.",
    "学习用直方图中各矩形条的组中值和高度，估计数据的总和与平均数。",
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

/** comparingMeans compares two data sets by the difference of their means and says what that difference means. */
export const comparingMeans = withIntro(
  topic(
    "comparing-means",
    t("Comparing Means", "比较平均数"),
    t(
      "Two groups can be compared by their means: the difference of the means says how much greater the values of one group are than those of the other, on average. It does not say that every value of one group is greater, and when the groups differ in size it is not the difference of their totals.",
      "可以用平均数比较两组数据：平均数之差说明一组的数据平均比另一组大多少。它并不说明一组的每个数据都更大；两组数据个数不同时，它也不是两组总和之差。",
    ),
    ["the-mean-of-a-data-set"],
    ["7.SP.B.4"],
    [
      lesson(
        "the-difference-of-two-means",
        ["The difference of two means", "两个平均数之差"],
        [
          [
            "Player A scored $12, 15, 9, 20, 14$ and player B scored $10, 8, 13, 11, 6, 12$. The means are $\\frac{70}{5} = 14$ and $\\frac{60}{6} = 10$, so A’s mean is $14 - 10 = 4$ points greater.",
            "运动员 A 的得分是 $12, 15, 9, 20, 14$，运动员 B 的得分是 $10, 8, 13, 11, 6, 12$。平均数分别是 $\\frac{70}{5} = 14$ 和 $\\frac{60}{6} = 10$，所以 A 的平均数比 B 大 $14 - 10 = 4$ 分。",
          ],
          [
            "Measure every score from $10$: A’s distances $2, 5, -1, 10, 4$ average $4$, and B’s $0, -2, 3, 1, -4, 2$ average $0$, again $4$ apart.",
            "把每个得分都从 $10$ 量起：A 的距离 $2, 5, -1, 10, 4$ 平均为 $4$，B 的 $0, -2, 3, 1, -4, 2$ 平均为 $0$，仍相差 $4$。",
          ],
          [
            "Find each mean first: the difference of the totals, $70 - 60 = 10$, mixes up the number of games with the scores.",
            "要先分别求平均数：总和之差 $70 - 60 = 10$ 把比赛场数和得分混在了一起。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const a = data(rng, rng.int(5, 8), g.lo, g.hi);
            const b = data(rng, rng.int(5, 8), g.lo, g.hi);
            const d = mean(a).sub(mean(b));
            if (d.sign() <= 0 || !clean(mean(a)) || !clean(mean(b)) || a.length === b.length) continue;
            const base = Math.min(...a, ...b);
            const [ra, rb] = [mean(a).sub(Q.of(base)), mean(b).sub(Q.of(base))];
            return valued(
              [
                `The data show ${g.what.en}.${setsText(a, b)}How much greater is the mean of A than the mean of B?`,
                `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的平均数比 B 的平均数大多少？`,
              ],
              d,
              [
                [
                  ["Find each mean", "分别求平均数"],
                  ["Divide each total by its own number of values:", "用各自的总和除以各自的数据个数："],
                  [
                    `\\text{A: } \\frac{${sum(a)}}{${a.length}} = ${dec(mean(a))}`,
                    `\\text{B: } \\frac{${sum(b)}}{${b.length}} = ${dec(mean(b))}`,
                  ],
                ],
                [
                  ["Subtract", "相减"],
                  ["The mean of A minus the mean of B:", "A 的平均数减 B 的平均数："],
                  [`${dec(mean(a))} - ${dec(mean(b))} = ${dec(d)}`],
                ],
              ],
              [
                `Measure every value from the least, $${base}$: A’s values are on average $${dec(ra)}$ above it and B’s $${dec(rb)}$, and $${dec(ra)} - ${dec(rb)} = ${dec(d)}$.`,
                `把每个数据都从最小值 $${base}$ 量起：A 平均高出 $${dec(ra)}$，B 平均高出 $${dec(rb)}$，$${dec(ra)} - ${dec(rb)} = ${dec(d)}$。`,
              ],
              [
                [
                  sum(a) - sum(b),
                  "That is the difference of the totals, but the groups have different numbers of values.",
                  "这是总和之差，但两组的数据个数不同。",
                ],
                [median(a).sub(median(b)), "That is the difference of the medians, not of the means.", "这是中位数之差，不是平均数之差。"],
              ],
              { form: "decimal", figure: dotPairFigure(a, b) },
            );
          }
        },
        dotPairFigure([12, 15, 9, 20, 14], [10, 8, 13, 11, 6, 12]),
      ),
      lesson(
        "what-a-difference-of-means-says",
        ["What a difference of means says", "平均数之差的含义"],
        [
          [
            "If the mean of A is $14$ and the mean of B is $10$, then on average the values of A are $4$ greater. Some values of B can still be greater than some values of A, the totals can differ by any amount when the groups have different sizes, and the greatest values need not differ by $4$.",
            "如果 A 的平均数是 $14$，B 的平均数是 $10$，那么 A 的数据平均比 B 大 $4$。但 B 的某些数据仍可能比 A 的某些数据大；两组数据个数不同时，总和之差可以是任何数；两组的最大值之差也不一定是 $4$。",
          ],
          [
            "Test a claim against the data: with A $12, 15, 9, 20, 14$ and B $10, 8, 13, 11, 6, 12$, B’s $13$ beats A’s $9$, so not every value of A is greater.",
            "用数据检验说法：A 为 $12, 15, 9, 20, 14$，B 为 $10, 8, 13, 11, 6, 12$，B 的 $13$ 比 A 的 $9$ 大，所以并不是 A 的每个数据都更大。",
          ],
          [
            "A difference of means describes the groups on average, not any single value or the totals.",
            "平均数之差描述的是两组的平均情况，而不是某个数据或总和。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const a = data(rng, rng.int(5, 7), g.lo, g.hi);
            const b = data(rng, rng.int(5, 7), g.lo, g.hi);
            const d = mean(a).sub(mean(b));
            if (d.sign() <= 0 || !mean(a).isInteger() || !mean(b).isInteger()) continue;
            if (Math.min(...a) > Math.max(...b) || d.eq(Q.of(sum(a) - sum(b))) || d.eq(Q.of(Math.max(...a) - Math.max(...b)))) continue;
            const dd = d.toLatex();
            const [ma, mb] = [mean(a).toLatex(), mean(b).toLatex()];
            return chosen(
              rng,
              [
                `The data show ${g.what.en}.${setsText(a, b)}The mean of A is $${ma}$ and the mean of B is $${mb}$. Which statement is true?`,
                `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的平均数是 $${ma}$，B 的平均数是 $${mb}$。哪种说法正确？`,
              ],
              [`On average, the values of A are $${dd}$ greater than the values of B.`, `平均来看，A 的数据比 B 的数据大 $${dd}$。`],
              [
                [
                  ["Every value of A is greater than every value of B.", "A 的每个数据都比 B 的每个数据大。"],
                  `B’s greatest value, $${Math.max(...b)}$, is greater than A’s least value, $${Math.min(...a)}$.`,
                  `B 的最大值 $${Math.max(...b)}$ 比 A 的最小值 $${Math.min(...a)}$ 大。`,
                ],
                [
                  [`The values of A add up to $${dd}$ more than the values of B.`, `A 的数据之和比 B 的数据之和大 $${dd}$。`],
                  `The totals are $${sum(a)}$ and $${sum(b)}$, which differ by $${sum(a) - sum(b)}$.`,
                  `两组总和分别是 $${sum(a)}$ 和 $${sum(b)}$，相差 $${sum(a) - sum(b)}$。`,
                ],
                [
                  [`The greatest value of A is $${dd}$ greater than the greatest value of B.`, `A 的最大值比 B 的最大值大 $${dd}$。`],
                  `The greatest values are $${Math.max(...a)}$ and $${Math.max(...b)}$, which differ by $${Math.max(...a) - Math.max(...b)}$.`,
                  `两组最大值分别是 $${Math.max(...a)}$ 和 $${Math.max(...b)}$，相差 $${Math.max(...a) - Math.max(...b)}$。`,
                ],
              ],
              [
                [
                  ["Subtract the means", "平均数相减"],
                  [`$${ma} - ${mb} = ${dd}$.`, `$${ma} - ${mb} = ${dd}$。`],
                ],
                [
                  ["Say what it measures", "说出它的含义"],
                  [
                    `The difference of the means compares the groups on average: A’s values are $${dd}$ greater on average.`,
                    `平均数之差是从平均的角度比较两组：A 的数据平均大 $${dd}$。`,
                  ],
                ],
              ],
              [
                `Test the other statements against the data: B’s $${Math.max(...b)}$ beats A’s $${Math.min(...a)}$, the totals differ by $${sum(a) - sum(b)}$, and the greatest values by $${Math.max(...a) - Math.max(...b)}$.`,
                `用数据检验其他说法：B 的 $${Math.max(...b)}$ 比 A 的 $${Math.min(...a)}$ 大，总和相差 $${sum(a) - sum(b)}$，最大值相差 $${Math.max(...a) - Math.max(...b)}$。`,
              ],
              dotPairFigure(a, b),
            );
          }
        },
        dotPairFigure([12, 15, 9, 20, 14], [10, 8, 13, 11, 6, 12]),
      ),
    ],
  ),
  [
    "Two basketball players argue about who scores more. One played $5$ games and the other $6$. Comparing their total points is not fair.",
    "两名篮球运动员争论谁得分更多。一个打了 $5$ 场，另一个打了 $6$ 场。比较总分并不公平。",
  ],
  ["Points per game, the mean, puts both players on the same footing.", "每场平均得分（平均数）让两人站在同一起跑线上。"],
  [
    "compare two groups by the difference of their means and say what that difference does and does not tell.",
    "学习用平均数之差比较两组数据，并说清它能说明什么、不能说明什么。",
  ],
);

/** core is what is left of sorted data after crossing off the least and greatest values in pairs: the one or two middle values. */
function core(xs: readonly number[]): string {
  const s = sorted(xs);
  const h = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? `${s[h]}` : `${s[h - 1]}, ${s[h]}`;
}

/** comparingMedians compares two data sets by their medians, from lists and from box plots. */
export const comparingMedians = withIntro(
  topic(
    "comparing-medians",
    t("Comparing Medians", "比较中位数"),
    t(
      "Two groups can also be compared by their medians, which are not pulled by extreme values. Sort each data set before finding its middle value. On box plots drawn on the same scale, the medians are the lines inside the boxes, so they can be compared directly.",
      "也可以用中位数比较两组数据，中位数不受极端值的牵引。求中间值之前要先把每组数据排序。在同一刻度上画出的箱线图中，中位数就是箱子里的竖线，可以直接比较。",
    ),
    ["the-median-of-a-data-set", "box-plots"],
    ["7.SP.B.4"],
    [
      lesson(
        "the-difference-of-two-medians",
        ["The difference of two medians", "两个中位数之差"],
        [
          [
            "For A: $9, 15, 12, 20, 14$, sorted $9, 12, 14, 15, 20$, the median is $14$. For B: $10, 6, 13, 8, 11, 12$, sorted $6, 8, 10, 11, 12, 13$, the median is $\\frac{10 + 11}{2} = 10.5$. So A’s median is $14 - 10.5 = 3.5$ greater.",
            "A：$9, 15, 12, 20, 14$，排序后为 $9, 12, 14, 15, 20$，中位数是 $14$。B：$10, 6, 13, 8, 11, 12$，排序后为 $6, 8, 10, 11, 12, 13$，中位数是 $\\frac{10 + 11}{2} = 10.5$。所以 A 的中位数比 B 大 $14 - 10.5 = 3.5$。",
          ],
          [
            "Cross off the least and greatest values in pairs: A is left with $14$, B with $10, 11$.",
            "成对划掉最小值和最大值：A 剩下 $14$，B 剩下 $10, 11$。",
          ],
          [
            "Sort first: the middle of the unsorted list of A is $12$, which gives the wrong difference.",
            "要先排序：A 未排序时中间的数是 $12$，会得到错误的差。",
          ],
        ],
        (rng) => {
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
            return valued(
              [
                `The data show ${g.what.en}.${setsText(a, b)}How much greater is the median of A than the median of B?`,
                `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的中位数比 B 的中位数大多少？`,
              ],
              d,
              [
                [
                  ["Sort each set and take its middle", "把每组排序，取中间值"],
                  ["The medians of the sorted lists:", "排序后的中位数："],
                  [
                    `\\text{A: } ${list(sorted(a))} \\;\\to\\; ${dec(median(a))}`,
                    `\\text{B: } ${list(sorted(b))} \\;\\to\\; ${dec(median(b))}`,
                  ],
                ],
                [
                  ["Subtract", "相减"],
                  ["The median of A minus the median of B:", "A 的中位数减 B 的中位数："],
                  [`${dec(median(a))} - ${dec(median(b))} = ${dec(d)}`],
                ],
              ],
              [
                `Cross off the least and greatest values in pairs: A is left with $${core(a)}$ and B with $${core(b)}$, so the medians are $${dec(median(a))}$ and $${dec(median(b))}$.`,
                `成对划掉最小值和最大值：A 剩下 $${core(a)}$，B 剩下 $${core(b)}$，所以中位数是 $${dec(median(a))}$ 和 $${dec(median(b))}$。`,
              ],
              (
                [
                  [middle(a).sub(middle(b)), "That takes the middles of the unsorted lists.", "这是取了未排序数据的中间值。"],
                  [mean(a).sub(mean(b)), "That is the difference of the means, not of the medians.", "这是平均数之差，不是中位数之差。"],
                ] as const
              ).filter(([v]) => clean(v)),
              { form: "decimal", figure: dotPairFigure(a, b) },
            );
          }
        },
        dotPairFigure([9, 15, 12, 20, 14], [10, 6, 13, 8, 11, 12]),
      ),
      lesson(
        "medians-on-box-plots",
        ["Medians on box plots", "箱线图中的中位数"],
        [
          [
            "On two box plots drawn on the same scale, the median is the line inside each box. If A’s line is at $16$ and B’s at $11$, A’s median is $16 - 11 = 5$ greater.",
            "在同一刻度上的两个箱线图中，中位数是每个箱子里的竖线。如果 A 的竖线在 $16$，B 的在 $11$，A 的中位数就比 B 大 $16 - 11 = 5$。",
          ],
          [
            "Count along the scale from B’s line at $11$ up to A’s line at $16$: $5$ units.",
            "沿刻度从 B 的竖线 $11$ 数到 A 的竖线 $16$：$5$ 个单位。",
          ],
          [
            "The edges of a box are the quartiles and the ends of the whiskers are the least and greatest values; neither is the median.",
            "箱子的两边是四分位数，须线的两端是最小值和最大值，它们都不是中位数。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const a = data(rng, rng.pick([11, 15]), g.lo, g.hi);
            const b = data(rng, rng.pick([11, 15]), g.lo, g.hi);
            const [sa, sb] = [fiveNumbers(a), fiveNumbers(b)];
            const d = sa[2] - sb[2];
            if (d <= 0) continue;
            return valued(
              [
                `The box plots show ${g.what.en}. How much greater is the median of A than the median of B?`,
                `箱线图显示了${g.what["zh-CN"]}。A 的中位数比 B 的中位数大多少？`,
              ],
              d,
              [
                [
                  ["Read the medians", "读出中位数"],
                  [
                    `The medians are the lines inside the boxes: $${sa[2]}$ for A and $${sb[2]}$ for B.`,
                    `中位数是箱子里的竖线：A 是 $${sa[2]}$，B 是 $${sb[2]}$。`,
                  ],
                ],
                [["Subtract", "相减"], ["A’s median minus B’s:", "A 的中位数减 B 的："], [`${sa[2]} - ${sb[2]} = ${d}`]],
              ],
              [
                `Count along the scale from B’s line at $${sb[2]}$ up to A’s line at $${sa[2]}$: $${d}$ units.`,
                `沿刻度从 B 的竖线 $${sb[2]}$ 数到 A 的竖线 $${sa[2]}$：$${d}$ 个单位。`,
              ],
              [
                [sa[1] - sb[1], "That compares the left edges of the boxes, the first quartiles.", "这是比较箱子的左边，即第一四分位数。"],
                [sa[3] - sb[3], "That compares the right edges of the boxes, the third quartiles.", "这是比较箱子的右边，即第三四分位数。"],
                [
                  Q.of(sa[0] + sa[4] - sb[0] - sb[4], 2),
                  "That compares the middles of the whiskers’ ends, not the lines inside the boxes.",
                  "这是比较须线两端的中点，而不是箱子里的竖线。",
                ],
              ],
              { form: "number", figure: boxPairFigure(a, b) },
            );
          }
        },
        drawn(gradeDrawings3["comparing-medians#medians-on-box-plots"]),
      ),
    ],
  ),
  [
    "One bean plant in group A shot up to twice the height of the others. Should that one plant decide which fertilizer looks better?",
    "A 组有一株豆苗长到了其他豆苗的两倍高。应该让这一株决定哪种肥料看起来更好吗？",
  ],
  [
    "The median is the middle plant, so one unusually tall plant hardly moves it.",
    "中位数取的是中间那株，所以一株特别高的豆苗几乎不影响它。",
  ],
  [
    "compare two groups by their medians, from lists of data and from box plots on the same scale.",
    "学习用中位数比较两组数据，既从数据列表求，也从同一刻度的箱线图读。",
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

/** categoryTapes draws the counts of two groups as two bars, each count a piece, the greatest of each bar shaded. */
function categoryTapes(c: readonly (readonly number[])[], en: string, zh: string): Figure {
  return tapeFigure(
    c.map((row, r) => ({ total: r === 0 ? "1" : "2", pieces: row.map((v) => ({ size: v, text: `${v}`, lit: v === Math.max(...row) })) })),
    [en, zh],
  );
}

/** comparingModes compares two data sets by their modes, for numbers and for categories. */
export const comparingModes = withIntro(
  topic(
    "comparing-modes",
    t("Comparing Modes", "比较众数"),
    t(
      "The mode is the most common value, so comparing modes compares the most typical answers of two groups. It is the only measure of center for categories such as favorite sports. Each group has its own mode: the most common answer of the two groups together can differ from the mode of either group.",
      "众数是出现次数最多的值，所以比较众数就是比较两组最常见的回答。对于“最喜欢的运动”这类类别数据，众数是唯一能用的集中趋势量。每组有自己的众数：两组合在一起最常见的回答，可能与其中任何一组的众数都不同。",
    ),
    ["the-mode-of-a-data-set"],
    ["7.SP.B.4"],
    [
      lesson(
        "the-difference-of-two-modes",
        ["The difference of two modes", "两个众数之差"],
        [
          [
            "In A: $12, 15, 12, 18, 12, 15, 20$ the value $12$ occurs three times, so the mode is $12$. In B: $9, 10, 9, 14, 10, 10$ the mode is $10$. A’s mode is $12 - 10 = 2$ greater.",
            "在 A：$12, 15, 12, 18, 12, 15, 20$ 中，$12$ 出现三次，所以众数是 $12$。在 B：$9, 10, 9, 14, 10, 10$ 中，众数是 $10$。A 的众数比 B 大 $12 - 10 = 2$。",
          ],
          [
            "No other value ties: in A the next most common value, $15$, occurs twice, and in B $9$ occurs twice.",
            "没有别的值与之并列：A 中次多的 $15$ 出现两次，B 中 $9$ 出现两次。",
          ],
          [
            "Compare the values, not how often they occur: $3 - 3 = 0$ answers a different question.",
            "比较的是数值，而不是出现的次数：$3 - 3 = 0$ 回答的是另一个问题。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const cA = rng.int(g.lo + 3, g.hi - 3);
            const cB = rng.int(g.lo + 3, g.hi - 3);
            const a = data(rng, rng.int(7, 10), cA - 3, cA + 3);
            const b = data(rng, rng.int(7, 10), cB - 3, cB + 3);
            const [ma, mb] = [modes(a), modes(b)];
            if (ma.length !== 1 || mb.length !== 1 || ma[0]! <= mb[0]!) continue;
            const [x, y] = [ma[0]!, mb[0]!];
            const next = (xs: readonly number[], top: number) => Math.max(...xs.filter((v) => v !== top).map((v) => count(xs, v)));
            return valued(
              [
                `The data show ${g.what.en}.${setsText(a, b)}How much greater is the mode of A than the mode of B?`,
                `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}A 的众数比 B 的众数大多少？`,
              ],
              x - y,
              [
                [
                  ["Find each mode", "分别找众数"],
                  [
                    `In A, $${x}$ occurs $${count(a, x)}$ times, more than any other value; in B, $${y}$ occurs $${count(b, y)}$ times.`,
                    `在 A 中，$${x}$ 出现 $${count(a, x)}$ 次，比其他值都多；在 B 中，$${y}$ 出现 $${count(b, y)}$ 次。`,
                  ],
                ],
                [["Subtract", "相减"], ["The mode of A minus the mode of B:", "A 的众数减 B 的众数："], [`${x} - ${y} = ${x - y}`]],
              ],
              [
                `No other value ties: in A the next most common value occurs $${next(a, x)}$ times, and in B $${next(b, y)}$ times.`,
                `没有别的值与之并列：A 中次多的值出现 $${next(a, x)}$ 次，B 中出现 $${next(b, y)}$ 次。`,
              ],
              [
                [
                  count(a, x) - count(b, y),
                  "That subtracts how often the modes occur, not the modes themselves.",
                  "这是众数出现次数之差，不是众数之差。",
                ],
                [median(a).sub(median(b)), "That is the difference of the medians, not of the modes.", "这是中位数之差，不是众数之差。"],
              ],
              { form: "number", figure: dotPairFigure(a, b) },
            );
          }
        },
        dotPairFigure([12, 15, 12, 18, 12, 15, 20], [9, 10, 9, 14, 10, 10]),
      ),
      lesson(
        "modes-of-categories",
        ["Modes of categories", "类别数据的众数"],
        [
          [
            "If $14$ seventh graders and $9$ eighth graders chose soccer, and $8$ seventh graders and $12$ eighth graders chose tennis, the mode for the 7th graders is soccer and the mode for the 8th graders is tennis, even though soccer is more popular overall ($23$ against $20$).",
            "如果选足球的七年级学生有 $14$ 人、八年级学生有 $9$ 人，选网球的七年级学生有 $8$ 人、八年级学生有 $12$ 人，那么七年级的众数是足球，八年级的众数是网球，尽管从总体看足球更受欢迎（$23$ 对 $20$）。",
          ],
          [
            "Compare within each row only: $14 > 8$ for the 7th graders and $12 > 9$ for the 8th graders.",
            "只在每一行内比较：七年级 $14 > 8$，八年级 $12 > 9$。",
          ],
          [
            "Find each group’s mode in its own row; the totals over both groups answer a different question.",
            "要在每组自己的那一行里找众数；两组合计回答的是另一个问题。",
          ],
        ],
        (rng) => {
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
            const statement = (x: number, y: number): Pair => [
              `The mode for ${r0[0]} is ${name(x, 0)}, and the mode for ${r1[0]} is ${name(y, 0)}.`,
              `${r0[1]}的众数是${name(x, 1)}，${r1[1]}的众数是${name(y, 1)}。`,
            ];
            const because = (x: number, _y: number): [string, string] =>
              x !== i
                ? [
                    `In the row for ${r0[0]} the greatest count is $${c[0]![i]}$, for ${name(i, 0)}.`,
                    `在“${r0[1]}”这一行，最大的数是 $${c[0]![i]}$，对应${name(i, 1)}。`,
                  ]
                : [
                    `In the row for ${r1[0]} the greatest count is $${c[1]![j]}$, for ${name(j, 0)}.`,
                    `在“${r1[1]}”这一行，最大的数是 $${c[1]![j]}$，对应${name(j, 1)}。`,
                  ];
            const right = statement(i, j);
            const options: Wrong[] = [
              [statement(j, i), ...because(j, i)],
              [statement(k, k), ...because(k, k)],
              [
                [
                  `The mode for both groups is ${name(k, 0)}, because it was chosen most often in all.`,
                  `两组的众数都是${name(k, 1)}，因为总共选它的人最多。`,
                ],
                "The total over both groups does not give each group’s own mode.",
                "两组合计的结果不能代替每组自己的众数。",
              ],
              [statement(i, i), ...because(i, i)],
            ];
            const wrong = options.filter(([o], n) => o[0] !== right[0] && options.findIndex(([p]) => p[0] === o[0]) === n);
            const table = (lang: 0 | 1) =>
              mdTable(
                ["", ...s.cols.map((col) => col[lang])],
                s.rows.map((row, r) => [row[lang], ...c[r]!.map((v) => m(v))]),
              );
            const second = (row: readonly number[], at: number) => Math.max(...row.filter((_, n) => n !== at));
            return chosen(
              rng,
              [`${s.intro.en}${table(0)}Which statement is true?`, `${s.intro["zh-CN"]}${table(1)}哪种说法正确？`],
              right,
              wrong,
              [
                [
                  [`Read the row for ${r0[0]}`, `读“${r0[1]}”这一行`],
                  [`The greatest count is $${c[0]![i]}$, for ${name(i, 0)}.`, `最大的数是 $${c[0]![i]}$，对应${name(i, 1)}。`],
                ],
                [
                  [`Read the row for ${r1[0]}`, `读“${r1[1]}”这一行`],
                  [`The greatest count is $${c[1]![j]}$, for ${name(j, 0)}.`, `最大的数是 $${c[1]![j]}$，对应${name(j, 1)}。`],
                ],
              ],
              [
                `Compare within each row only: $${c[0]![i]}$ beats the next count, $${second(c[0]!, i)}$, and $${c[1]![j]}$ beats $${second(c[1]!, j)}$.`,
                `只在每一行内比较：$${c[0]![i]}$ 大于次大的 $${second(c[0]!, i)}$，$${c[1]![j]}$ 大于 $${second(c[1]!, j)}$。`,
              ],
              categoryTapes(
                c,
                "Each group’s counts as one bar, the greatest count of each bar shaded.",
                "每组的人数画成一个长条，每个长条中最大的一段涂色。",
              ),
            );
          }
        },
        categoryTapes(
          [
            [14, 8],
            [9, 12],
          ],
          "Two bars: the 7th graders 14 soccer and 8 tennis, the 8th graders 9 soccer and 12 tennis, the greatest of each shaded.",
          "两个长条：七年级足球 14、网球 8，八年级足球 9、网球 12，每条中最大的一段涂色。",
        ),
      ),
    ],
  ),
  [
    "A shop asks customers at two branches which fruit they buy most. At one it is apples, at the other bananas.",
    "一家商店问两个分店的顾客最常买哪种水果。一家是苹果，另一家是香蕉。",
  ],
  [
    "Each branch has its own most common answer, its mode, read from its own counts.",
    "每个分店有自己最常见的回答，也就是众数，要从它自己的数据中读出。",
  ],
  ["compare two groups by their modes, for numbers and for categories.", "学习用众数比较两组数据，包括数值数据和类别数据。"],
);

/** comparingDataSetsUsingRangeAndQuartiles compares the spreads of two data sets by their ranges and interquartile ranges. */
export const comparingDataSetsUsingRangeAndQuartiles = withIntro(
  topic(
    "comparing-data-sets-using-range-and-quartiles",
    t("Comparing Data Sets Using Range and Quartiles", "用极差和四分位数比较数据集"),
    t(
      "The range and the interquartile range compare how spread out two data sets are: on box plots, the range is the length from whisker end to whisker end, and the IQR is the length of the box. A single extreme value stretches the range but barely moves the quartiles, so the IQR says better how consistent the typical values are.",
      "极差和四分位距可以比较两组数据的分散程度：在箱线图中，极差是从一端须线到另一端须线的长度，四分位距是箱子的长度。一个极端值会拉长极差，却几乎不影响四分位数，所以四分位距更能说明典型数据是否稳定。",
    ),
    ["range-quartiles-and-iqr", "box-plots"],
    ["7.SP.B.3", "7.SP.B.4"],
    [
      lesson(
        "ranges-and-iqrs-on-box-plots",
        ["Ranges and IQRs on box plots", "箱线图中的极差和四分位距"],
        [
          [
            "For box plots with A: $4, 9, 12, 14, 20$ and B: $6, 10, 11, 15, 17$ (minimum, quartiles, median, maximum), the ranges are $20 - 4 = 16$ and $17 - 6 = 11$, and the IQRs are $14 - 9 = 5$ and $15 - 10 = 5$. A has the greater range, but the middle halves are equally spread.",
            "两个箱线图中，A 的五数概括为 $4, 9, 12, 14, 20$，B 的为 $6, 10, 11, 15, 17$。极差分别是 $20 - 4 = 16$ 和 $17 - 6 = 11$，四分位距分别是 $14 - 9 = 5$ 和 $15 - 10 = 5$。A 的极差更大，但两组中间一半数据的分散程度相同。",
          ],
          [
            "Compare end by end: A’s maximum is $3$ higher and its minimum $2$ lower, so its range is $3 + 2 = 5$ greater.",
            "逐端比较：A 的最大值高 $3$，最小值低 $2$，所以极差大 $3 + 2 = 5$。",
          ],
          [
            "The range runs from whisker end to whisker end; the IQR is only the box.",
            "极差是从一端须线到另一端须线；四分位距只是箱子的长度。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          const iqr = rng.bool();
          for (;;) {
            const a = data(rng, rng.pick([11, 15]), g.lo, g.hi);
            const b = data(rng, rng.pick([11, 15]), g.lo, g.hi);
            const [sa, sb] = [fiveNumbers(a), fiveNumbers(b)];
            const [ra, rb, ia, ib] = [sa[4] - sa[0], sb[4] - sb[0], sa[3] - sa[1], sb[3] - sb[1]];
            const d = iqr ? ia - ib : ra - rb;
            if (d <= 0 || ia - ib === ra - rb) continue;
            const [hiI, loI] = iqr ? [3, 1] : [4, 0];
            const [up, down] = [sa[hiI]! - sb[hiI]!, sa[loI]! - sb[loI]!];
            const name: Pair = iqr ? ["interquartile range", "四分位距"] : ["range", "极差"];
            return valued(
              [
                `The box plots show ${g.what.en}. How much greater is the ${name[0]} of A than the ${name[0]} of B?`,
                `箱线图显示了${g.what["zh-CN"]}。A 的${name[1]}比 B 的${name[1]}大多少？`,
              ],
              d,
              [
                iqr
                  ? [
                      ["Find each IQR", "分别求四分位距"],
                      ["The IQR is the length of the box, $Q_3 - Q_1$:", "四分位距是箱子的长度 $Q_3 - Q_1$："],
                      [`\\text{A: } ${sa[3]} - ${sa[1]} = ${ia}`, `\\text{B: } ${sb[3]} - ${sb[1]} = ${ib}`],
                    ]
                  : [
                      ["Find each range", "分别求极差"],
                      ["The range runs from one whisker end to the other:", "极差是从一端须线到另一端须线："],
                      [`\\text{A: } ${sa[4]} - ${sa[0]} = ${ra}`, `\\text{B: } ${sb[4]} - ${sb[0]} = ${rb}`],
                    ],
                [
                  ["Subtract", "相减"],
                  [`A’s ${name[0]} minus B’s:`, `A 的${name[1]}减 B 的：`],
                  [`${iqr ? ia : ra} - ${iqr ? ib : rb} = ${d}`],
                ],
              ],
              [
                `Compare end by end: A’s ${iqr ? "upper quartile" : "maximum"} is $${up}$ above B’s and its ${iqr ? "lower quartile" : "minimum"} $${down}$ above B’s, and $${up} - ${down < 0 ? `(${down})` : down} = ${d}$.`,
                `逐端比较：A 的${iqr ? "第三四分位数" : "最大值"}比 B 的高 $${up}$，${iqr ? "第一四分位数" : "最小值"}比 B 的高 $${down}$，$${up} - ${down < 0 ? `(${down})` : down} = ${d}$。`,
              ],
              [
                [
                  iqr ? ra - rb : ia - ib,
                  iqr ? "That compares the ranges, not the boxes." : "That compares the boxes, the IQRs, not the whole ranges.",
                  iqr ? "这是比较极差，而不是箱子的长度。" : "这是比较箱子的长度（四分位距），而不是整个极差。",
                ],
                [
                  sa[2] - sb[2],
                  "That compares the medians, which are centers, not spreads.",
                  "这是比较中位数，中位数是中心，不是分散程度。",
                ],
                [up, `That compares only the ${iqr ? "upper quartiles" : "maximums"}.`, `这只比较了${iqr ? "第三四分位数" : "最大值"}。`],
              ],
              { form: "number", figure: boxPairFigure(a, b) },
            );
          }
        },
        drawn(gradeDrawings3["comparing-data-sets-using-range-and-quartiles#ranges-and-iqrs-on-box-plots"]),
      ),
      lesson(
        "consistency-and-the-iqr",
        ["Consistency and the IQR", "稳定性与四分位距"],
        [
          [
            "Player A scored $14, 15, 15, 16, 16, 17, 30$ and player B scored $8, 11, 13, 16, 19, 21, 23$. A’s range, $30 - 14 = 16$, is greater than B’s, $23 - 8 = 15$, but A’s IQR is $17 - 15 = 2$ and B’s is $21 - 11 = 10$. Apart from one unusual game, A’s scores are much more consistent.",
            "运动员 A 的得分是 $14, 15, 15, 16, 16, 17, 30$，运动员 B 的得分是 $8, 11, 13, 16, 19, 21, 23$。A 的极差 $30 - 14 = 16$ 比 B 的极差 $23 - 8 = 15$ 大，但 A 的四分位距是 $17 - 15 = 2$，B 的是 $21 - 11 = 10$。除了一场反常的比赛，A 的得分稳定得多。",
          ],
          [
            "Leave out the single $30$: A’s other scores span only $17 - 14 = 3$, far less than B’s $15$.",
            "去掉那一个 $30$：A 其余的得分只跨越 $17 - 14 = 3$，远小于 B 的 $15$。",
          ],
          [
            "A large range can come from one unusual value; judge consistency by the IQR.",
            "极差大可能只是因为一个反常的值；要用四分位距判断稳定性。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const n = rng.pick([7, 11]);
            const c = rng.int(g.lo + 8, g.hi - 8);
            const tight = [...data(rng, n - 1, c - 2, c + 2), c + (rng.bool() ? 1 : -1) * rng.int(7, 8)];
            const wide = data(rng, n, c - 6, c + 6);
            const iqrOf = (xs: readonly number[]) => quartiles(xs)[1].sub(quartiles(xs)[0]);
            const range = (xs: readonly number[]) => Math.max(...xs) - Math.min(...xs);
            const rest = tight.slice(0, -1);
            if (iqrOf(tight).cmp(iqrOf(wide)) >= 0 || range(tight) <= range(wide) || range(rest) >= range(wide)) continue;
            if (Math.min(...tight) < g.lo || Math.max(...tight) > g.hi) continue;
            const tightIsA = rng.bool();
            const [a, b] = tightIsA ? [rng.shuffle(tight), wide] : [wide, rng.shuffle(tight)];
            const [x, y] = tightIsA ? ["A", "B"] : ["B", "A"];
            const extreme = tight[tight.length - 1]!;
            const iqrLine = (label: string, xs: readonly number[]) => {
              const [q1, q3] = quartiles(xs);
              return `\\text{${label}: } ${dec(q3)} - ${dec(q1)} = ${dec(iqrOf(xs))}`;
            };
            return chosen(
              rng,
              [
                `The data show ${g.what.en}.${setsText(a, b)}Use the interquartile range to decide which data set is more consistent.`,
                `数据显示了${g.what["zh-CN"]}。${setsTextZh(a, b)}用四分位距判断哪组数据更稳定。`,
              ],
              [`Data set ${x}`, `数据集 ${x}`],
              [
                [
                  [`Data set ${y}`, `数据集 ${y}`],
                  `Its range is smaller, but its IQR, $${dec(iqrOf(wide))}$, is greater than $${dec(iqrOf(tight))}$.`,
                  `它的极差更小，但四分位距 $${dec(iqrOf(wide))}$ 大于 $${dec(iqrOf(tight))}$。`,
                ],
                [
                  ["Both are equally consistent.", "两组同样稳定。"],
                  `The IQRs differ: $${dec(iqrOf(tight))}$ and $${dec(iqrOf(wide))}$.`,
                  `两组的四分位距不同：$${dec(iqrOf(tight))}$ 和 $${dec(iqrOf(wide))}$。`,
                ],
              ],
              [
                [
                  ["Find each IQR", "分别求四分位距"],
                  ["The upper quartile minus the lower quartile:", "第三四分位数减第一四分位数："],
                  [iqrLine("A", a), iqrLine("B", b)],
                ],
                [
                  ["Compare", "比较"],
                  [
                    `${x} has the smaller IQR, so its typical values are more consistent; its range is greater only because of the single value $${extreme}$.`,
                    `${x} 的四分位距更小，所以它的典型数据更稳定；它的极差更大，只是因为有 $${extreme}$ 这一个值。`,
                  ],
                ],
              ],
              [
                `Leave out the single $${extreme}$: ${x}’s other values span only $${range(rest)}$, less than ${y}’s $${range(wide)}$.`,
                `去掉那一个 $${extreme}$：${x} 其余的数据只跨越 $${range(rest)}$，小于 ${y} 的 $${range(wide)}$。`,
              ],
              dotPairFigure(a, b),
            );
          }
        },
        dotPairFigure([14, 15, 15, 16, 16, 17, 30], [8, 11, 13, 16, 19, 21, 23]),
      ),
    ],
  ),
  [
    "One player scores about the same every game, except for one amazing night. Another player’s scores jump around all season. Whose scores are more consistent?",
    "一名运动员每场得分都差不多，只有一晚表现惊人。另一名运动员整个赛季得分忽高忽低。谁的得分更稳定？",
  ],
  [
    "The one amazing night stretches the range, but the box of the middle half stays narrow.",
    "那一晚惊人的表现拉长了极差，但中间一半数据的箱子仍然很窄。",
  ],
  [
    "compare spreads by ranges and IQRs, on box plots and from data, and judge consistency by the IQR.",
    "学习用极差和四分位距比较分散程度，既从箱线图读，也从数据求，并用四分位距判断稳定性。",
  ],
);

/** approx writes a number exactly when it has at most two decimal places, and otherwise rounded with ≈. */
const approx = (q: Q) => (clean(q) ? `= ${dec(q)}` : `\\approx ${dec(Q.of(Math.round((Number(q.n) * 100) / Number(q.d)), 100))}`);

/** madLines works out the MAD of each data set, rounded when it has more than two decimal places. */
const madLines = (a: readonly number[], b: readonly number[]) => [`\\text{A: MAD} ${approx(mad(a))}`, `\\text{B: MAD} ${approx(mad(b))}`];

/** comparingDataSetVisualizationsUsingStandardDeviationAndMad compares spreads of dot plots by eye, as the MAD and standard deviation measure them. */
export const comparingDataSetVisualizationsUsingStandardDeviationAndMad = withIntro(
  topic(
    "comparing-data-set-visualizations-using-standard-deviation-and-mad",
    t("Comparing Data Set Visualizations Using Standard Deviation and MAD", "用标准差和平均绝对偏差比较数据图"),
    t(
      "The mean absolute deviation and the standard deviation both measure how far the values typically lie from the mean; the standard deviation is found from squared distances, but it is large and small for the same kinds of data. On a dot plot, dots bunched near the center mean a small spread, and dots far out on both sides a large one, however tall the stacks. Sliding every dot the same distance changes the mean but not the spread.",
      "平均绝对偏差和标准差都衡量数据通常离平均数有多远；标准差是用距离的平方算出来的，但它的大小规律与平均绝对偏差相同。在点图中，点聚集在中心附近说明分散程度小，点向两侧散开说明分散程度大，与点堆的高矮无关。把每个点都平移同样的距离，平均数会变，分散程度不变。",
    ),
    ["comparing-measures-of-spread", "measuring-range-and-mad-from-dot-plots"],
    ["7.SP.B.3"],
    [
      lesson(
        "the-greater-spread-on-dot-plots",
        ["The greater spread on dot plots", "从点图看哪组更分散"],
        [
          [
            "If A’s dots stand in tall stacks at $9$, $10$ and $11$ and B’s few dots lie from $4$ to $16$, B has the greater MAD and standard deviation: its values lie farther from the mean.",
            "如果 A 的点在 $9$、$10$、$11$ 处堆得很高，而 B 的少数几个点分布在 $4$ 到 $16$ 之间，那么 B 的平均绝对偏差和标准差更大：它的数据离平均数更远。",
          ],
          [
            "Compare the ranges too: A spans $11 - 9 = 2$ and B spans $16 - 4 = 12$.",
            "也可以比较极差：A 跨越 $11 - 9 = 2$，B 跨越 $16 - 4 = 12$。",
          ],
          [
            "Tall stacks show many values close together, which means a small spread, not a large one.",
            "高高的点堆表示许多数据挨在一起，说明分散程度小，而不是大。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const c = rng.int(g.lo + 6, g.hi - 6);
            const tight = data(rng, rng.int(10, 14), c - 2, c + 2);
            const wide = data(rng, rng.int(6, 9), c - 6, c + 6);
            if (Math.min(...wide) > c - 4 || Math.max(...wide) < c + 4) continue;
            if (mad(tight).mul(Q.of(2)).cmp(mad(wide)) > 0 || variance(tight).cmp(variance(wide)) >= 0) continue;
            const tightIsA = rng.bool();
            const [a, b] = tightIsA ? [tight, wide] : [wide, tight];
            const [x, y] = tightIsA ? ["B", "A"] : ["A", "B"];
            const span = (xs: readonly number[]) => `${Math.max(...xs)} - ${Math.min(...xs)} = ${Math.max(...xs) - Math.min(...xs)}`;
            return chosen(
              rng,
              [
                `The dot plots show ${g.what.en}. Which data set has the greater mean absolute deviation and standard deviation?`,
                `点图显示了${g.what["zh-CN"]}。哪组数据的平均绝对偏差和标准差更大？`,
              ],
              [`Data set ${x}`, `数据集 ${x}`],
              [
                [
                  [`Data set ${y}`, `数据集 ${y}`],
                  "Its dots stand in tall stacks bunched near the center, which is a small spread.",
                  "它的点虽然堆得高，却聚集在中心附近，分散程度小。",
                ],
                [
                  ["They are about the same.", "两者差不多。"],
                  "One set is bunched near the center and the other spread out, so their MADs are far apart.",
                  "一组聚集在中心附近，另一组向外散开，所以两组的平均绝对偏差相差很大。",
                ],
              ],
              [
                [
                  ["Look at the distances from the center", "看离中心的距离"],
                  [
                    `The dots of ${x} reach far out on both sides, while those of ${y} are bunched near the center, however tall the stacks.`,
                    `${x} 的点向两侧散开，离中心较远；${y} 的点虽然堆得高，却聚集在中心附近。`,
                  ],
                ],
                [
                  ["Compare the MADs", "比较平均绝对偏差"],
                  [
                    `So ${x} has the greater MAD, and its standard deviation is greater too:`,
                    `所以 ${x} 的平均绝对偏差更大，标准差也更大：`,
                  ],
                  madLines(a, b),
                ],
              ],
              [
                `Compare the ranges too: A spans $${span(a)}$ and B spans $${span(b)}$.`,
                `也可以比较极差：A 跨越 $${span(a)}$，B 跨越 $${span(b)}$。`,
              ],
              dotPairFigure(a, b),
            );
          }
        },
        drawn(gradeDrawings4["comparing-data-set-visualizations-using-standard-deviation-and-mad#the-greater-spread-on-dot-plots"]),
      ),
      lesson(
        "shifted-data-keeps-its-spread",
        ["Shifted data keeps its spread", "平移后分散程度不变"],
        [
          [
            "If B’s dot plot is A’s moved $5$ to the right, every value of B is $5$ more than a value of A. The mean goes up by $5$, but every distance from the mean stays the same, so the MAD and the standard deviation do not change.",
            "如果 B 的点图是把 A 的点图向右平移 $5$ 得到的，那么 B 的每个数据都比 A 的某个数据大 $5$。平均数增加 $5$，但每个数据到平均数的距离都不变，所以平均绝对偏差和标准差都不变。",
          ],
          [
            "Pair each dot of A with the dot of B $5$ to its right: each pair sits the same distance from its own mean.",
            "把 A 的每个点与它右边 $5$ 处的 B 的点配对：每一对到各自平均数的距离都相同。",
          ],
          ["Moving the data moves the center, not the spread.", "平移数据只移动中心，不改变分散程度。"],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const k = (rng.bool() ? 1 : -1) * rng.int(2, 6);
            const c = rng.int(g.lo + 3 + Math.max(0, -k), g.hi - 3 - Math.max(0, k));
            const a = data(rng, rng.int(7, 10), c - 3, c + 3);
            const b = a.map((x) => x + k);
            if (mad(a).isZero()) continue;
            const kk = Math.abs(k);
            const more = k > 0;
            return chosen(
              rng,
              [`The dot plots show ${g.what.en}. Which statement is true?`, `点图显示了${g.what["zh-CN"]}。哪种说法正确？`],
              [
                `They have the same MAD, and the mean of B is $${kk}$ ${more ? "greater" : "less"} than the mean of A.`,
                `两组的平均绝对偏差相同，B 的平均数比 A 的${more ? "大" : "小"} $${kk}$。`,
              ],
              [
                [
                  [
                    `The MAD of B is $${kk}$ ${more ? "greater" : "less"} than the MAD of A.`,
                    `B 的平均绝对偏差比 A 的${more ? "大" : "小"} $${kk}$。`,
                  ],
                  "The mean moves with the data, so every distance from the mean stays the same.",
                  "平均数随数据一起移动，所以每个数据到平均数的距离都不变。",
                ],
                [
                  ["They have the same mean and the same MAD.", "两组的平均数相同，平均绝对偏差也相同。"],
                  `Every value moved by $${kk}$, so the mean moved by $${kk}$ too.`,
                  `每个数据都移动了 $${kk}$，所以平均数也移动了 $${kk}$。`,
                ],
                [
                  [
                    `They have the same mean, and B has the ${more ? "greater" : "smaller"} MAD.`,
                    `两组的平均数相同，B 的平均绝对偏差更${more ? "大" : "小"}。`,
                  ],
                  `The mean moved by $${kk}$, and the spread did not change.`,
                  `平均数移动了 $${kk}$，分散程度没有变。`,
                ],
              ],
              [
                [
                  ["Compare the means", "比较平均数"],
                  [
                    `Each dot of B is a dot of A moved $${kk}$ to the ${more ? "right" : "left"}, so the mean moves by $${kk}$:`,
                    `B 的每个点都是 A 的点向${more ? "右" : "左"}平移 $${kk}$ 得到的，所以平均数移动 $${kk}$：`,
                  ],
                  [`\\text{A: mean} ${approx(mean(a))}`, `\\text{B: mean} ${approx(mean(b))}`],
                ],
                [
                  ["Compare the MADs", "比较平均绝对偏差"],
                  [
                    "Every distance from the mean stays the same, so the MADs are equal:",
                    "每个数据到平均数的距离都不变，所以平均绝对偏差相等：",
                  ],
                  madLines(a, b),
                ],
              ],
              [
                `Pair each dot of A with the dot of B $${kk}$ to its ${more ? "right" : "left"}: each pair sits the same distance from its own mean.`,
                `把 A 的每个点与它${more ? "右" : "左"}边 $${kk}$ 处的 B 的点配对：每一对到各自平均数的距离都相同。`,
              ],
              dotPairFigure(a, b),
            );
          }
        },
        drawn(gradeDrawings3["comparing-data-set-visualizations-using-standard-deviation-and-mad#shifted-data-keeps-its-spread"]),
      ),
    ],
  ),
  [
    "Two dot plots: one has tall towers of dots right in the middle, the other has a few dots scattered from end to end. Which one is more spread out?",
    "两个点图：一个在正中间堆着高高的点塔，另一个只有几个点从一端散到另一端。哪一个更分散？",
  ],
  [
    "The scattered one: spread is about how far the dots lie from the center, not how tall the stacks are.",
    "是分散开的那个：分散程度看的是点离中心有多远，而不是点堆有多高。",
  ],
  [
    "compare the MAD and standard deviation of dot plots by eye, and see why sliding data keeps its spread.",
    "学习从点图直观比较平均绝对偏差和标准差，并理解平移数据为什么不改变分散程度。",
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

/** sdTapes draws two standard deviations as bars, the smaller one shaded. */
function sdTapes(sds: readonly [number, number]): Figure {
  return tapeFigure(
    sds.map((s, i) => ({ total: i === 0 ? "A" : "B", pieces: [{ size: s, text: `${s}`, lit: s === Math.min(...sds) }] })),
    [
      `Two bars as long as the standard deviations, ${sds[0]} for A and ${sds[1]} for B.`,
      `两个长条，长度分别是标准差：A 为 ${sds[0]}，B 为 ${sds[1]}。`,
    ],
  );
}

/** comparingDataSetsUsingStandardDeviationAndMad judges consistency by spread and measures a difference of means in units of spread. */
export const comparingDataSetsUsingStandardDeviationAndMad = withIntro(
  topic(
    "comparing-data-sets-using-standard-deviation-and-mad",
    t("Comparing Data Sets Using Standard Deviation and MAD", "用标准差和平均绝对偏差比较数据集"),
    t(
      "A smaller standard deviation or MAD means more consistent values, whatever the means are. To judge whether two means are far apart, compare their difference with the spread: dividing the difference of the means by the MAD (or the standard deviation) says how many typical distances apart the centers are.",
      "标准差或平均绝对偏差越小，数据越稳定，与平均数大小无关。要判断两个平均数相差得远不远，要把它们的差与分散程度比较：用平均数之差除以平均绝对偏差（或标准差），就知道两组的中心相差几个“典型距离”。",
    ),
    ["mean-absolute-deviation", "comparing-means"],
    ["7.SP.B.3", "7.SP.B.4"],
    [
      lesson(
        "consistency-from-the-standard-deviation",
        ["Consistency from the standard deviation", "由标准差判断稳定性"],
        [
          [
            "Machine A fills bags with a mean of $1002$ g and a standard deviation of $3.1$ g; machine B with a mean of $998$ g and a standard deviation of $6.4$ g. A is more consistent, because its bags vary less from their mean.",
            "机器 A 灌装的袋子平均 $1002$ 克，标准差 $3.1$ 克；机器 B 平均 $998$ 克，标准差 $6.4$ 克。A 更稳定，因为它灌装的袋子偏离平均数较少。",
          ],
          [
            "Picture a typical bag: A’s are usually within about $3$ g of $1002$, B’s within about $6$ g of $998$.",
            "想象一袋典型的米：A 的通常在 $1002$ 克上下约 $3$ 克以内，B 的在 $998$ 克上下约 $6$ 克以内。",
          ],
          ["Which mean is greater says nothing about consistency.", "哪个平均数更大，与稳定性无关。"],
        ],
        (rng) => {
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
            return chosen(
              rng,
              [
                `${p.intro.en}\n\n${describe(0, 0)}\n\n${describe(1, 0)}\n\nWhich is more consistent, and why?`,
                `${p.intro["zh-CN"]}\n\n${describe(0, 1)}\n\n${describe(1, 1)}\n\n哪个更稳定？为什么？`,
              ],
              [`${p.sources[x]![0]}, because its standard deviation is smaller.`, `${p.sources[x]![1]}，因为它的标准差更小。`],
              [
                [
                  [`${p.sources[y]![0]}, because its standard deviation is greater.`, `${p.sources[y]![1]}，因为它的标准差更大。`],
                  "A greater standard deviation means the values vary more, which is less consistent.",
                  "标准差越大，数据波动越大，越不稳定。",
                ],
                [
                  [
                    `${p.sources[y]![0]}, because its mean is ${greaterMean ? "greater" : "smaller"}.`,
                    `${p.sources[y]![1]}，因为它的平均数更${greaterMean ? "大" : "小"}。`,
                  ],
                  "The mean says where the values center, not how much they vary.",
                  "平均数说明数据的中心在哪里，不说明它们波动多大。",
                ],
                [
                  ["Neither, because data sets with different means cannot be compared.", "无法判断，因为平均数不同的数据集不能比较。"],
                  "Spreads can be compared whatever the means are.",
                  "不管平均数是多少，分散程度都可以比较。",
                ],
              ],
              [
                [
                  ["Compare the standard deviations", "比较标准差"],
                  [
                    `$${dec(sds[x]!)}$ is less than $${dec(sds[y]!)}$, so the values of ${p.sources[x]![0]} lie closer to their mean.`,
                    `$${dec(sds[x]!)}$ 小于 $${dec(sds[y]!)}$，所以${p.sources[x]![1]}的数据更靠近它的平均数。`,
                  ],
                ],
                [
                  ["Set the means aside", "不看平均数"],
                  [
                    `So ${p.sources[x]![0]} is more consistent; the means do not decide it.`,
                    `所以${p.sources[x]![1]}更稳定；这与平均数无关。`,
                  ],
                ],
              ],
              [
                `Picture a typical result: ${p.sources[x]![0]} is usually within about $${dec(sds[x]!)}$ ${ux} of its mean, ${p.sources[y]![0]} within about $${dec(sds[y]!)}$ ${ux}.`,
                `想象一个典型的结果：${p.sources[x]![1]}通常在平均数上下约 $${dec(sds[x]!)}$ ${uz} 以内，${p.sources[y]![1]}在约 $${dec(sds[y]!)}$ ${uz} 以内。`,
              ],
              sdTapes([Number(dec(sds[0])), Number(dec(sds[1]))]),
            );
          }
        },
        sdTapes([3.1, 6.4]),
      ),
      lesson(
        "differences-of-means-in-units-of-spread",
        ["Differences of means in units of spread", "以分散程度为单位的平均数之差"],
        [
          [
            "The mean of A is $24$, the mean of B is $18$, and both have a MAD of $2$. The difference of the means is $24 - 18 = 6$, which is $\\frac{6}{2} = 3$ MADs. A difference of several MADs is large compared with the variation inside each group.",
            "A 的平均数是 $24$，B 的平均数是 $18$，两组的平均绝对偏差都是 $2$。平均数之差是 $24 - 18 = 6$，相当于 $\\frac{6}{2} = 3$ 个平均绝对偏差。相差好几个平均绝对偏差，说明与每组内部的波动相比，这个差距很大。",
          ],
          [
            "Step up from B’s mean by MADs: $18, 20, 22, 24$ reaches A’s mean in $3$ steps.",
            "从 B 的平均数起每次加一个平均绝对偏差：$18, 20, 22, 24$，$3$ 步到达 A 的平均数。",
          ],
          [
            "The answer counts MADs, so divide; the difference $6$ itself is in the units of the data.",
            "答案数的是平均绝对偏差的个数，所以要相除；差 $6$ 本身用的是数据的单位。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          const sd = rng.bool();
          const name: Pair = sd ? ["standard deviation", "标准差"] : ["mean absolute deviation", "平均绝对偏差"];
          for (;;) {
            const spread = Q.of(rng.pick([3, 4, 5, 6, 8]), 2);
            const r = Q.of(rng.int(1, 8), 2);
            const d = spread.mul(r);
            const mb = Q.of(rng.int(g.lo + 2, g.hi - 8));
            const ma = mb.add(d);
            if (!clean(d) || ma.cmp(Q.of(g.hi)) > 0) continue;
            const offs: Off[] = [
              [
                d,
                `That is the difference of the means in the units of the data, not in ${name[0]}s.`,
                `这是以数据单位表示的平均数之差，不是以${name[1]}为单位。`,
              ],
              [spread.div(d), "That divides the spread by the difference, upside down.", "这是用分散程度除以差，除反了。"],
              [d.div(spread.mul(Q.of(2))), `That divides by twice the ${name[0]}.`, `这是除以了 ${name[1]}的两倍。`],
            ];
            const [lo, hi] = [Math.floor(Number(dec(mb))) - 1, Math.ceil(Number(dec(ma))) + 1];
            return valued(
              [
                `The data show ${g.what.en}. The mean of A is $${dec(ma)}$ and the mean of B is $${dec(mb)}$, and both data sets have a ${name[0]} of $${dec(spread)}$. How many ${name[0]}s apart are the means?`,
                `数据显示了${g.what["zh-CN"]}。A 的平均数是 $${dec(ma)}$，B 的平均数是 $${dec(mb)}$，两组的${name[1]}都是 $${dec(spread)}$。两个平均数相差几个${name[1]}？`,
              ],
              r,
              [
                [
                  ["Subtract the means", "平均数相减"],
                  ["The difference of the means:", "平均数之差："],
                  [`${dec(ma)} - ${dec(mb)} = ${dec(d)}`],
                ],
                [
                  [`Divide by the ${name[0]}`, `除以${name[1]}`],
                  ["Measure the difference in units of spread:", "以分散程度为单位来量这个差："],
                  [`\\frac{${dec(d)}}{${dec(spread)}} = ${dec(r)}`],
                ],
              ],
              [
                `Step up from B’s mean: $${dec(mb)} + ${dec(r)} \\times ${dec(spread)} = ${dec(mb)} + ${dec(d)} = ${dec(ma)}$, A’s mean.`,
                `从 B 的平均数往上走：$${dec(mb)} + ${dec(r)} \\times ${dec(spread)} = ${dec(mb)} + ${dec(d)} = ${dec(ma)}$，正是 A 的平均数。`,
              ],
              offs.filter(([v]) => clean(v instanceof Q ? v : Q.of(v))),
              {
                form: "decimal",
                figure: lineFigure(
                  {
                    lo,
                    hi,
                    step: 1,
                    labels: [lo, hi],
                    marks: [
                      { at: Number(dec(mb)), text: "B" },
                      { at: Number(dec(ma)), text: "A", result: true },
                    ],
                  },
                  [
                    `A number line with the mean of B at ${dec(mb)} and the mean of A at ${dec(ma)}.`,
                    `数轴上标出 B 的平均数 ${dec(mb)} 和 A 的平均数 ${dec(ma)}。`,
                  ],
                ),
              },
            );
          }
        },
        lineFigure(
          {
            lo: 16,
            hi: 26,
            step: 1,
            labels: [16, 26],
            marks: [
              { at: 18, text: "B" },
              { at: 24, text: "A", result: true },
            ],
            jumps: [
              [18, 20],
              [20, 22],
              [22, 24],
            ],
          },
          [
            "A number line with the means 18 and 24 and three jumps of 2 between them.",
            "数轴上标出平均数 18 和 24，两者之间跳了三次，每次 2。",
          ],
        ),
      ),
    ],
  ),
  [
    "Two machines fill rice bags. One’s bags weigh a little more on average; the other’s weigh almost exactly the same every time. Which machine would a shop rather have?",
    "两台机器灌装大米。一台灌的袋子平均略重；另一台每次灌的几乎一样重。商店更想要哪一台？",
  ],
  ["The steady one: its small standard deviation means bags you can count on.", "稳定的那台：它的标准差小，每袋都靠得住。"],
  [
    "judge consistency by the standard deviation or MAD, and measure a difference of means in units of spread.",
    "学习用标准差或平均绝对偏差判断稳定性，并以分散程度为单位衡量平均数之差。",
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
export const assessingVisualOverlapOfDataDistributions = withIntro(
  topic(
    "assessing-visual-overlap-of-data-distributions",
    t("Assessing Visual Overlap of Data Distributions", "评估数据分布的重叠程度"),
    t(
      "When two distributions have similar spreads, the difference of their means divided by the MAD measures how much they overlap. A ratio below about 1 means the dot plots overlap a lot and the groups are hard to tell apart; a ratio of 3 or more means they barely overlap and the difference between the groups stands out against the variation within them.",
      "两个分布的分散程度相近时，用平均数之差除以平均绝对偏差，可以衡量它们的重叠程度。这个比值小于 1 左右时，点图重叠很多，两组很难区分；比值达到 3 或更大时，点图几乎不重叠，两组之间的差距相对组内波动非常明显。",
    ),
    ["comparing-data-set-visualizations-using-standard-deviation-and-mad", "comparing-data-sets-using-standard-deviation-and-mad"],
    ["7.SP.B.3"],
    [
      lesson(
        "judging-overlap",
        ["Judging overlap", "判断重叠程度"],
        [
          [
            "If A and B both have a MAD of about $1.5$ and their means are $10$ and $11$, the means differ by less than one MAD: most dots of the two plots sit over the same numbers, and the groups are hard to tell apart. If the means are $10$ and $16$, they differ by $4$ MADs and the plots barely overlap.",
            "如果 A 和 B 的平均绝对偏差都约为 $1.5$，平均数分别是 $10$ 和 $11$，那么两个平均数相差不到一个平均绝对偏差：两个点图的大部分点落在相同的数上，两组很难区分。如果平均数是 $10$ 和 $16$，就相差 $4$ 个平均绝对偏差，两个点图几乎不重叠。",
          ],
          [
            "Look at the ends: A from $8$ to $12$ and B from $14$ to $18$ share no numbers at all.",
            "看两端：A 从 $8$ 到 $12$，B 从 $14$ 到 $18$，没有任何共同的数。",
          ],
          [
            "Lots of overlap goes with a small difference compared with the spread, never with a large one.",
            "重叠多对应的是相对分散程度很小的差距，绝不会是很大的差距。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          const apart = rng.bool();
          for (;;) {
            const k = apart ? rng.int(6, 9) : rng.int(1, 2);
            const { a, b } = overlapping(rng, g, k);
            const ratio = Q.of(k).div(mad(a));
            if (apart ? ratio.cmp(Q.of(3)) < 0 : ratio.cmp(Q.of(1)) > 0) continue;
            const r = approx(ratio);
            const why: readonly Pair[] = [
              [
                `The means are $${r.replace("= ", "")}$ MADs apart, a large difference, so the plots barely overlap.`,
                `两个平均数相差 $${r.replace("= ", "")}$ 个平均绝对偏差，差距很大，所以点图几乎不重叠。`,
              ],
              [
                "The means are within one MAD of each other, so the plots overlap a lot.",
                "两个平均数相差不到一个平均绝对偏差，所以点图重叠很多。",
              ],
              [
                "Plots that overlap a lot have a small difference compared with the spread, not a large one.",
                "重叠很多的点图，相对分散程度的差距很小，而不是很大。",
              ],
              [
                "Plots that barely overlap have a large difference compared with the spread, not a small one.",
                "几乎不重叠的点图，相对分散程度的差距很大，而不是很小。",
              ],
            ];
            const right = apart ? 1 : 0;
            const pair = (s: Text): Pair => [s.en, s["zh-CN"]];
            const [lo, hi] = [Math.max(Math.min(...a), Math.min(...b)), Math.min(Math.max(...a), Math.max(...b))];
            return chosen(
              rng,
              [`The dot plots show ${g.what.en}. Which statement describes them?`, `点图显示了${g.what["zh-CN"]}。哪种说法描述了它们？`],
              pair(overlapStatements[right]!),
              overlapStatements.map((s, i) => [pair(s), ...why[i]!] as const).filter((_, i) => i !== right),
              [
                [
                  ["Find the means and MADs", "求平均数和平均绝对偏差"],
                  ["B is A moved up, so both have the same MAD:", "B 是 A 整体上移得到的，所以两组的平均绝对偏差相同："],
                  madLines(a, b),
                ],
                [
                  ["Compare the gap with the spread", "把差距与分散程度比较"],
                  [
                    `The means differ by $${k}$, which is $\\frac{${k}}{\\text{MAD}} ${r}$ MADs: ${apart ? "large compared with the spread, so the plots barely overlap" : "no more than one MAD, so the plots overlap a lot"}.`,
                    `两个平均数相差 $${k}$，相当于 $\\frac{${k}}{\\text{MAD}} ${r}$ 个平均绝对偏差：${apart ? "相对分散程度很大，所以两个点图几乎不重叠" : "不超过一个平均绝对偏差，所以两个点图重叠很多"}。`,
                  ],
                ],
              ],
              lo <= hi
                ? [
                    `Look at the ends: A runs from $${Math.min(...a)}$ to $${Math.max(...a)}$ and B from $${Math.min(...b)}$ to $${Math.max(...b)}$, sharing the stretch from $${lo}$ to $${hi}$.`,
                    `看两端：A 从 $${Math.min(...a)}$ 到 $${Math.max(...a)}$，B 从 $${Math.min(...b)}$ 到 $${Math.max(...b)}$，共同的部分是 $${lo}$ 到 $${hi}$。`,
                  ]
                : [
                    `Look at the ends: A runs from $${Math.min(...a)}$ to $${Math.max(...a)}$ and B from $${Math.min(...b)}$ to $${Math.max(...b)}$, sharing no numbers at all.`,
                    `看两端：A 从 $${Math.min(...a)}$ 到 $${Math.max(...a)}$，B 从 $${Math.min(...b)}$ 到 $${Math.max(...b)}$，没有任何共同的数。`,
                  ],
              dotPairFigure(a, b),
            );
          }
        },
        dotPairFigure([8, 9, 10, 10, 11, 12], [14, 15, 16, 16, 17, 18]),
      ),
      lesson(
        "measuring-overlap",
        ["Measuring overlap", "衡量重叠程度"],
        [
          [
            "A: $8, 9, 10, 10, 11, 12$ has mean $10$ and distances $2, 1, 0, 0, 1, 2$, so its MAD is $1$. B is A moved up by $3$, so its mean is $13$ and its MAD is also $1$. The means differ by $\\frac{13 - 10}{1} = 3$ MADs, so the plots barely overlap.",
            "A：$8, 9, 10, 10, 11, 12$ 的平均数是 $10$，各数到平均数的距离是 $2, 1, 0, 0, 1, 2$，所以平均绝对偏差是 $1$。B 是 A 整体加 $3$，所以平均数是 $13$，平均绝对偏差也是 $1$。两个平均数相差 $\\frac{13 - 10}{1} = 3$ 个平均绝对偏差，所以两个点图几乎不重叠。",
          ],
          [
            "Step up from A’s mean by MADs: $10, 11, 12, 13$ reaches B’s mean in $3$ steps.",
            "从 A 的平均数起每次加一个平均绝对偏差：$10, 11, 12, 13$，$3$ 步到达 B 的平均数。",
          ],
          [
            "Divide the difference of the means by the MAD, not the MAD by the difference.",
            "要用平均数之差除以平均绝对偏差，而不是反过来。",
          ],
        ],
        (rng) => {
          const g = rng.pick(comparisons);
          for (;;) {
            const k = rng.int(1, 8);
            const { a, b } = overlapping(rng, g, k);
            const ratio = Q.of(k).div(mad(a));
            if (!clean(ratio) || !clean(mad(a))) continue;
            const mu = mean(a);
            const distances = a.map((x) => Math.abs(x - Number(mu.n)));
            const offs: Off[] = [
              [
                k,
                "That is the difference of the means in the units of the data, not in MADs.",
                "这是以数据单位表示的平均数之差，不是以平均绝对偏差为单位。",
              ],
              [mad(a).div(Q.of(k)), "That divides the MAD by the difference, upside down.", "这是用平均绝对偏差除以差，除反了。"],
              [mad(a), "That is the MAD itself.", "这是平均绝对偏差本身。"],
            ];
            return valued(
              [
                `The dot plots show ${g.what.en}. Both data sets have the same MAD. How many MADs apart are their means?`,
                `点图显示了${g.what["zh-CN"]}。两组数据的平均绝对偏差相同。两个平均数相差几个平均绝对偏差？`,
              ],
              ratio,
              [
                [
                  ["Find the MAD", "求平均绝对偏差"],
                  [
                    `A has mean $\\frac{${sum(a)}}{${a.length}} = ${dec(mu)}$ and distances $${list(distances)}$ from it:`,
                    `A 的平均数是 $\\frac{${sum(a)}}{${a.length}} = ${dec(mu)}$，各数到它的距离是 $${list(distances)}$：`,
                  ],
                  [`\\text{MAD} = \\frac{${sum(distances)}}{${a.length}} = ${dec(mad(a))}`],
                ],
                [
                  ["Divide the difference of the means", "用平均数之差去除"],
                  [`B has mean $${dec(mean(b))}$, so`, `B 的平均数是 $${dec(mean(b))}$，所以`],
                  [`\\frac{${dec(mean(b))} - ${dec(mu)}}{${dec(mad(a))}} = ${dec(ratio)}`],
                ],
              ],
              [
                `Step up from A’s mean: $${dec(mu)} + ${dec(ratio)} \\times ${dec(mad(a))} = ${dec(mean(b))}$, B’s mean.`,
                `从 A 的平均数往上走：$${dec(mu)} + ${dec(ratio)} \\times ${dec(mad(a))} = ${dec(mean(b))}$，正是 B 的平均数。`,
              ],
              offs.filter(([v]) => clean(v instanceof Q ? v : Q.of(v))),
              { form: "decimal", figure: dotPairFigure(a, b) },
            );
          }
        },
        dotPairFigure([8, 9, 10, 10, 11, 12], [11, 12, 13, 13, 14, 15]),
      ),
    ],
  ),
  [
    "Two classes take the same test. Their average scores differ by $2$ points. Is that a big difference?",
    "两个班参加同一次测验，平均分相差 $2$ 分。这个差距大吗？",
  ],
  [
    "It depends on the spread: if scores within each class vary by $10$ points, $2$ is small; if by $0.5$, it is huge.",
    "要看分散程度：如果每个班内的分数上下波动 $10$ 分，$2$ 分很小；如果只波动 $0.5$ 分，$2$ 分就很大。",
  ],
  [
    "judge by eye how much two distributions overlap, and measure it by the difference of the means in MADs.",
    "学习用眼睛判断两个分布的重叠程度，并用平均数之差相当于几个平均绝对偏差来衡量它。",
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
