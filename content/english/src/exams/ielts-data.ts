// IELTS Writing Task 1, rule-checked: choosing the sentence that reports a table accurately. The items are computed
// from small tables, so that every right sentence is true of its figures and every wrong one clearly false; a figure
// that sits between two descriptions, such as a rise of 25 per cent, is never asked about.

import { type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Series is a quantity measured over several years: what it is, how its figures are written, and the figures. */
interface Series {
  readonly subject: string;
  readonly title: string;
  readonly unit: (v: number) => string;
  readonly points: readonly (readonly [year: number, value: number])[];
}

const thousands = (v: number) => `${v.toLocaleString("en-US")},000`;
const millions = (v: number) => `${v} million`;
const percent = (v: number) => `${v}%`;
const plain = (v: number) => v.toLocaleString("en-US");
const dollars = (v: number) => `${v.toLocaleString("en-US")} dollars`;

const series: readonly Series[] = [
  {
    subject: "the number of visitors to the city museum",
    title: "Visitors to the city museum",
    unit: thousands,
    points: [
      [2012, 40],
      [2014, 42],
      [2016, 65],
      [2018, 30],
    ],
  },
  {
    subject: "the price of a cinema ticket",
    title: "Average price of a cinema ticket",
    unit: dollars,
    points: [
      [2000, 6],
      [2005, 9],
      [2010, 10],
      [2015, 10],
    ],
  },
  {
    subject: "the percentage of homes with internet access",
    title: "Homes with internet access",
    unit: percent,
    points: [
      [2000, 20],
      [2005, 45],
      [2010, 72],
      [2015, 80],
    ],
  },
  {
    subject: "the number of students studying abroad",
    title: "Students studying abroad",
    unit: thousands,
    points: [
      [2010, 120],
      [2013, 132],
      [2016, 131],
      [2019, 210],
    ],
  },
  {
    subject: "the amount of rice exported",
    title: "Rice exports",
    unit: (v) => `${v} million tonnes`,
    points: [
      [2016, 8],
      [2018, 12],
      [2020, 6],
      [2022, 6.5],
    ],
  },
  {
    subject: "the number of cars sold",
    title: "New cars sold",
    unit: millions,
    points: [
      [2015, 2.4],
      [2017, 2.6],
      [2019, 1.4],
      [2021, 1.3],
    ],
  },
  {
    subject: "the percentage of adults who smoke",
    title: "Adults who smoke",
    unit: percent,
    points: [
      [1990, 34],
      [2000, 31],
      [2010, 20],
      [2020, 12],
    ],
  },
  {
    subject: "the number of passengers using the airport",
    title: "Passengers using the airport",
    unit: millions,
    points: [
      [2014, 12],
      [2016, 13],
      [2018, 20],
      [2020, 7],
    ],
  },
  {
    subject: "average rainfall in July",
    title: "Average July rainfall (mm)",
    unit: (v) => `${v} mm`,
    points: [
      [1990, 80],
      [2000, 81],
      [2010, 60],
      [2020, 54],
    ],
  },
  {
    subject: "the number of books borrowed from the library",
    title: "Library books borrowed",
    unit: thousands,
    points: [
      [2004, 300],
      [2008, 330],
      [2012, 200],
      [2016, 205],
    ],
  },
  {
    subject: "the average monthly rent",
    title: "Average monthly rent",
    unit: dollars,
    points: [
      [2010, 800],
      [2013, 900],
      [2016, 1300],
      [2019, 1310],
    ],
  },
  {
    subject: "the number of tigers in the wild",
    title: "Wild tigers",
    unit: plain,
    points: [
      [2000, 5000],
      [2005, 4000],
      [2010, 3200],
      [2015, 3500],
    ],
  },
];

/** Trend is how a quantity changed between two years. */
type Trend = "sharp-rise" | "slight-rise" | "sharp-fall" | "slight-fall" | "stable";

/** trendOf classifies a change, or returns undefined for one that sits between two descriptions. */
function trendOf(from: number, to: number): Trend | undefined {
  const r = (to - from) / from;
  if (Math.abs(r) <= 0.03) return "stable";
  if (r >= 0.07 && r <= 0.15) return "slight-rise";
  if (r <= -0.07 && r >= -0.15) return "slight-fall";
  if (r >= 0.4) return "sharp-rise";
  if (r <= -0.3) return "sharp-fall";
  return undefined;
}

const phrases: Record<Trend, readonly [string, string]> = {
  "sharp-rise": ["rose sharply", "increased dramatically"],
  "slight-rise": ["rose slightly", "increased a little"],
  "sharp-fall": ["fell sharply", "dropped dramatically"],
  "slight-fall": ["fell slightly", "decreased a little"],
  stable: ["remained stable", "stayed roughly the same"],
};

const meaning: Record<Trend, Text> = {
  "sharp-rise": t("a large rise", "大幅上升"),
  "slight-rise": t("a small rise", "小幅上升"),
  "sharp-fall": t("a large fall", "大幅下降"),
  "slight-fall": t("a small fall", "小幅下降"),
  stable: t("almost no change", "几乎没有变化"),
};

/** misreadings are the wrong trends offered for each right one: the other direction, the other size, and no change. */
const misreadings: Record<Trend, readonly [Trend, Trend, Trend]> = {
  "sharp-rise": ["sharp-fall", "slight-rise", "stable"],
  "slight-rise": ["slight-fall", "sharp-rise", "sharp-fall"],
  "sharp-fall": ["sharp-rise", "slight-fall", "stable"],
  "slight-fall": ["slight-rise", "sharp-fall", "sharp-rise"],
  stable: ["sharp-rise", "sharp-fall", "slight-rise"],
};

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table = (s: Series) => `**${s.title}**\n\n${s.points.map(([year, v]) => `${year}: ${s.unit(v)}`).join(" · ")}`;

function trendItems(): readonly SolvedChoice[] {
  const out: SolvedChoice[] = [];
  for (const [k, s] of series.entries()) {
    for (let i = 0; i + 1 < s.points.length; i++) {
      const [y1, a] = s.points[i] as readonly [number, number];
      const [y2, b] = s.points[i + 1] as readonly [number, number];
      const trend = trendOf(a, b);
      if (trend === undefined) continue;
      const variant = (k + i) % 2;
      const sentence = (tr: Trend) => `Between ${y1} and ${y2}, ${s.subject} ${phrases[tr][variant]}.`;
      const change = Math.round(((b - a) / a) * 100);
      out.push({
        shown: `${table(s)}\n\n**Period:** ${y1} to ${y2}`,
        right: sentence(trend),
        wrong: misreadings[trend].map(sentence),
        solution: t(
          `From ${s.unit(a)} to ${s.unit(b)} is a change of about ${change}%: ${meaning[trend].en}. ${capital(phrases[trend][0])} fits it; a change of only a few per cent is stable, and a rise or fall of a third or more is sharp.`,
          `从 ${s.unit(a)} 到 ${s.unit(b)}，变化约为 ${change}%，属于${meaning[trend]["zh-CN"]}，所以用 *${phrases[trend][0]}*。变化只有百分之几算 stable，升降三分之一以上才算 sharp。`,
        ),
      });
    }
  }
  return out;
}

/** Shares is how a whole divides among categories, in per cent. */
interface Shares {
  readonly title: string;
  readonly shares: readonly (readonly [label: string, value: number])[];
}

const shareTables: readonly Shares[] = [
  {
    title: "How employees travel to work (%)",
    shares: [
      ["car", 38],
      ["bus", 19],
      ["train", 12],
      ["bicycle", 6],
      ["walking", 25],
    ],
  },
  {
    title: "How households heat their homes (%)",
    shares: [
      ["gas", 51],
      ["electricity", 26],
      ["oil", 9],
      ["wood", 4],
      ["heat pumps", 10],
    ],
  },
  {
    title: "Where the town council spends its budget (%)",
    shares: [
      ["schools", 33],
      ["roads", 16],
      ["parks", 8],
      ["housing", 24],
      ["libraries", 4],
      ["other", 15],
    ],
  },
  {
    title: "Electricity produced by source (%)",
    shares: [
      ["coal", 40],
      ["gas", 20],
      ["wind", 13],
      ["solar", 7],
      ["water", 20],
    ],
  },
  {
    title: "Students' main reason for choosing a university (%)",
    shares: [
      ["course", 48],
      ["location", 21],
      ["cost", 7],
      ["reputation", 16],
      ["friends", 8],
    ],
  },
  {
    title: "How people spend their free time on weekdays (%)",
    shares: [
      ["television", 34],
      ["sport", 11],
      ["reading", 10],
      ["online games", 22],
      ["meeting friends", 23],
    ],
  },
  {
    title: "Household waste by type (%)",
    shares: [
      ["food", 32],
      ["paper", 25],
      ["plastic", 16],
      ["glass", 8],
      ["metal", 5],
      ["other", 14],
    ],
  },
  {
    title: "Visitors to the national park by country of origin (%)",
    shares: [
      ["home country", 54],
      ["neighbouring countries", 27],
      ["Europe", 9],
      ["Asia", 6],
      ["other", 4],
    ],
  },
  {
    title: "Water use in the region (%)",
    shares: [
      ["farming", 66],
      ["industry", 20],
      ["homes", 11],
      ["other", 3],
    ],
  },
  {
    title: "How a family spends its monthly income (%)",
    shares: [
      ["housing", 30],
      ["food", 20],
      ["transport", 15],
      ["savings", 10],
      ["leisure", 9],
      ["other", 16],
    ],
  },
];

/** Claim is a sentence about a table that is clearly true or clearly false, with the figures that decide it. */
interface Claim {
  readonly sentence: string;
  readonly true: boolean;
  readonly reason: Text;
}

const fractions: readonly (readonly [words: string, zh: string, value: number])[] = [
  ["half", "一半", 50],
  ["a third", "三分之一", 100 / 3],
  ["a quarter", "四分之一", 25],
  ["a fifth", "五分之一", 20],
  ["a tenth", "十分之一", 10],
];

const ratios: readonly (readonly [words: string, zh: string, value: number])[] = [
  ["twice", "两倍", 2],
  ["three times", "三倍", 3],
  ["half", "一半", 0.5],
];

function claims(table: Shares): readonly Claim[] {
  const out: Claim[] = [];
  const top = Math.max(...table.shares.map(([, v]) => v));
  for (const [label, v] of table.shares) {
    if (label === "other") continue;
    out.push({
      sentence: `The figure for ${label} was the highest, at ${v}%.`,
      true: v === top,
      reason: t(`The highest figure is ${top}%.`, `最高的数字是 ${top}%。`),
    });
    for (const [words, zh, f] of fractions) {
      const gap = Math.abs(v - f);
      if (gap > 1.5 && gap < 7) continue;
      out.push({
        sentence: `The figure for ${label} represented about ${words} of the total.`,
        true: gap <= 1.5,
        reason: t(
          `${capital(label)} is ${v}%, and ${words} would be about ${Math.round(f)}%.`,
          `${label} 是 ${v}%，而${zh}约为 ${Math.round(f)}%。`,
        ),
      });
    }
    for (const [other, w] of table.shares) {
      if (other === label || other === "other") continue;
      for (const [words, zh, k] of ratios) {
        const r = v / w;
        const gap = Math.abs(r - k) / k;
        if (gap > 0.06 && gap < 0.3) continue;
        out.push({
          sentence: `The figure for ${label} was roughly ${words} that for ${other}.`,
          true: gap <= 0.06,
          reason: t(
            `${v}% compared with ${w}% is about ${r.toFixed(1)} times.`,
            `${v}% 与 ${w}% 相比约为 ${r.toFixed(1)} 倍（${zh}应约为 ${k} 倍）。`,
          ),
        });
      }
    }
  }
  return out;
}

function shareItems(): readonly SolvedChoice[] {
  return interleave(shareTables.map(tableItems));
}

function tableItems(table: Shares): readonly SolvedChoice[] {
  const out: SolvedChoice[] = [];
  {
    const all = claims(table);
    const right = all.filter((c) => c.true);
    const wrong = all.filter((c) => !c.true);
    // Take up to four true sentences of a table, spread across its kinds, each with three false ones of the same table.
    const picked = [0, 1, 2, 3]
      .map((i) => right[Math.floor((i * right.length) / 4)])
      .filter((c, i, a): c is Claim => c !== undefined && a.indexOf(c) === i);
    picked.forEach((claim, i) => {
      const wrongs = [0, 1, 2].map((j) => wrong[(i * 7 + j * 5) % wrong.length] as Claim);
      if (new Set(wrongs.map((w) => w.sentence)).size < 3) return;
      out.push({
        shown: `**${table.title}**\n\n${table.shares.map(([label, v]) => `${capital(label)}: ${v}%`).join(" · ")}`,
        right: claim.sentence,
        wrong: wrongs.map((w) => w.sentence),
        solution: t(
          `${claim.sentence} ${claim.reason.en} Each of the other sentences misreads a figure: check every number, every comparison and every fraction against the table.`,
          `${claim.sentence} ${claim.reason["zh-CN"]} 其他句子都读错了某个数字：要把每个数字、每个比较和每个分数都与表格核对。`,
        ),
      });
    });
  }
  return out;
}

/** trendBank and shareBank are the items of the two knowledge points, exported for a check of their size. */
export const trendBank = trendItems();
export const shareBank = shareItems();

const trendQuestion = t(
  "Which sentence describes the change in the period below the table accurately?",
  "哪个句子准确描述了表格下方所给时期内的变化？",
);

const shareQuestion = t("Which sentence about the table is accurate?", "关于这个表格，哪个句子是准确的？");

/** describingData is the IELTS topic of reporting the figures of a table accurately. */
export const describingData: TopicDef = examTopic({
  id: "ielts-describing-data",
  title: t("Describing Data", "描述数据"),
  summary: t(
    "IELTS Task 1 language: choose the sentence that reports a table accurately, for trends over time and for proportions and comparisons.",
    "雅思 Task 1 的语言：选出准确报告表格的句子，包括随时间的趋势，以及比例和比较。",
  ),
  strand: "writing",
  prerequisites: ["b2-words-trends", "comparatives-and-superlatives"],
  encompasses: [
    { topic: "b2-words-trends", weight: 0.2 },
    { topic: "comparatives-and-superlatives", weight: 0.2 },
  ],
  xp: 10,
  points: [
    point(
      "describing-trends",
      t("Trends over Time", "随时间变化的趋势"),
      t(
        "Work out how big a change is before you choose its words. Divide the change by the starting figure:\n\n- a change of only a few per cent: *remained stable, stayed roughly the same*;\n- a change of about a tenth: *rose slightly, fell slightly, increased a little*;\n- a change of a third or more: *rose sharply, fell sharply, increased dramatically*.\n\nAn examiner checks that your words match the figures. A rise from 40 to 42 is not *sharp*, however exciting it looks on a graph.",
        "先算出变化有多大，再选词。用变化量除以起始数字：\n\n- 只变化百分之几：*remained stable, stayed roughly the same*；\n- 变化约十分之一：*rose slightly, fell slightly, increased a little*；\n- 变化三分之一或更多：*rose sharply, fell sharply, increased dramatically*。\n\n考官会检查你的用词是否与数字相符。从 40 到 42 的上升不是 *sharp*，不管它在图上看起来多显眼。",
      ),
      solvedChoiceGenerator(trendQuestion, trendBank),
    ),
    point(
      "describing-proportions",
      t("Proportions and Comparisons", "比例与比较"),
      t(
        "For a table of percentages, report proportions and comparisons rather than every number.\n\n- Fractions: *about half* (50%), *a third* (33%), *a quarter* (25%), *a fifth* (20%), *a tenth* (10%). Use them only when the figure is close.\n- Comparisons: *roughly twice / three times / half that for ...*: divide one figure by the other.\n- The largest category: *the highest, at 38%*.\n\nCheck every sentence against the table: a wrong fraction or a reversed comparison is an error of accuracy, however good the English.",
        "对于百分比表格，要报告比例和比较，而不是罗列每个数字。\n\n- 分数：*about half*（50%）、*a third*（33%）、*a quarter*（25%）、*a fifth*（20%）、*a tenth*（10%）。只有数字接近时才用。\n- 比较：*roughly twice / three times / half that for ...*：用一个数字除以另一个。\n- 最大的类别：*the highest, at 38%*。\n\n每句话都要与表格核对：分数用错或比较说反都是准确性错误，英语再好也没用。",
      ),
      solvedChoiceGenerator(shareQuestion, shareBank),
    ),
  ],
});
