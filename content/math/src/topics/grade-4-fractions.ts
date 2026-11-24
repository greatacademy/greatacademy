import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, lcm, Q, svgDocument } from "@ga/subject-math";
import { jumpArcs } from "../early-grades-kit.ts";
import { choiceProblem, mixedLatex } from "../problems.ts";
import { type Pair, picked, pickedMath, type Walk } from "./early-grades-more-kit.ts";
import { wordsEn, wordsZh } from "./grade-4-whole-numbers.ts";
import { answered, groupedTex, lineFigure, type Miss, point, stripsFigure, tapeFigure } from "./upper-grades-kit.ts";

// 4th Grade Math: fractions, mixed numbers, equivalent fractions, comparing, adding and multiplying fractions, and decimals.

/** fr writes n/d in LaTeX exactly as given, without reducing it. */
export const fr = (n: number | string, d: number | string) => `\\frac{${n}}{${d}}`;

/** mx writes a mixed number w r/d in LaTeX. */
export const mx = (w: number, r: number, d: number) => (r === 0 ? `${w}` : w === 0 ? fr(r, d) : `${w}${fr(r, d)}`);

/** qf is the rational number n/d. */
const qf = (n: number, d: number) => Q.of(n, d);

/** coprimeTo draws a numerator in [lo, hi] with no common factor with d. */
export function coprimeTo(rng: Rng, d: number, lo: number, hi: number): number {
  const options: number[] = [];
  for (let n = lo; n <= hi; n++) if (gcd(n, d) === 1) options.push(n);
  return rng.pick(options);
}

/** properFraction draws n/d in lowest terms with 0 < n < d and d in [2, maxDen]. */
export function properFraction(rng: Rng, maxDen = 12, minDen = 2): [number, number] {
  const d = rng.int(minDen, maxDen);
  return [coprimeTo(rng, d, 1, d - 1), d];
}

/** dec writes n/10ᵖ as a decimal: dec(45, 2) = "0.45", dec(307, 2) = "3.07". */
function dec(n: number, places: number): string {
  const s = String(n).padStart(places + 1, "0");
  return `${s.slice(0, s.length - places)}.${s.slice(s.length - places)}`;
}

const symbols = ["<", "=", ">"] as const;

/** relationOptions are the comparison symbols. */
const relationOptions: readonly Text[] = symbols.map((s) => same(`$${s}$`));

/** relation is the index of the symbol relating a to b. */
const relation = (a: Q, b: Q) => a.cmp(b) + 1;

/** compareProblem asks which symbol goes between two LaTeX expressions. */
export function compareProblem(a: string, b: string, rel: number, solution: Text, figure?: Figure): Problem {
  return {
    ...choiceProblem({
      prompt: t(`Which symbol makes this true? $$${a} \\ \\square \\ ${b}$$`, `方框中应填哪个符号？$$${a} \\ \\square \\ ${b}$$`),
      options: relationOptions,
      correct: rel,
      solution,
    }),
    ...(figure && { figure }),
  };
}

/** pickChoice builds a choice problem from a correct option and distinct wrong ones, keeping at most three wrong ones. */
export function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))).slice(0, 3);
  const options = rng.shuffle([correct, ...rest]);
  return { ...choiceProblem({ prompt, options, correct: options.indexOf(correct), solution }), ...(figure && { figure }) };
}

/** mathText is a choice option made of one LaTeX expression. */
export const mathText = (s: string): Text => same(`$${s}$`);

// ---------------------------------------------------------------------------
// Words for fractions

const ordinals: Record<number, [string, string]> = {
  2: ["half", "halves"],
  3: ["third", "thirds"],
  4: ["fourth", "fourths"],
  5: ["fifth", "fifths"],
  8: ["eighth", "eighths"],
  9: ["ninth", "ninths"],
  12: ["twelfth", "twelfths"],
  20: ["twentieth", "twentieths"],
  100: ["hundredth", "hundredths"],
};

/** ordinalEn names the parts of a whole cut into d equal parts, in the singular or plural. */
function ordinalEn(d: number, plural: boolean): string {
  const known = ordinals[d];
  if (known) return known[plural ? 1 : 0];
  const base = `${wordsEn(d)}th`;
  return plural ? `${base}s` : base;
}

/** fractionWords writes n/d in words in both languages: "three fifths", "五分之三". */
const fractionWords = (n: number, d: number): Text => t(`${wordsEn(n)} ${ordinalEn(d, n !== 1)}`, `${wordsZh(d)}分之${wordsZh(n)}`);

// ---------------------------------------------------------------------------
// Figures

const shade = 'class="accent" fill="currentColor" fill-opacity="0.35"';

/** barsSvg draws `count` bars of the same size, each cut into d equal parts, with the first `shaded` parts shaded in reading order. */
function barsSvg(d: number, shaded: number, count: number, rowsPerBar = 1): string {
  const w = 280;
  const h = 26;
  let body = "";
  for (let b = 0; b < count; b++) {
    const y = 8 + b * (h + 12);
    for (let i = 0; i < d; i++) {
      const x = 20 + (i * w) / d;
      const on = b * d + i < shaded;
      body += `<rect x="${round(x)}" y="${y}" width="${round(w / d)}" height="${h}"${on ? ` ${shade}` : ""}/>`;
    }
    for (let r = 1; r < rowsPerBar; r++)
      body += `<line x1="20" y1="${round(y + (r * h) / rowsPerBar)}" x2="300" y2="${round(y + (r * h) / rowsPerBar)}"/>`;
  }
  return svgDocument(count * (h + 12) + 6, body);
}

const round = (x: number) => Math.round(x * 100) / 100;

/** barFigure is a figure of bars with an alt text. */
export function barFigure(d: number, shaded: number, count = 1): Figure {
  return {
    svg: barsSvg(d, shaded, count),
    alt: t(
      `${count === 1 ? "A bar cut" : `${count} equal bars, each cut`} into ${d} equal parts, with ${shaded} parts shaded${count === 1 ? "" : " in all"}.`,
      `${count === 1 ? "一个长条，平均分成" : `${count} 个同样的长条，每个都平均分成`} ${d} 份，${count === 1 ? "" : "一共"}有 ${shaded} 份涂了颜色。`,
    ),
  };
}

/** twoBarsFigure stacks a bar cut into d1 parts with s1 shaded over a bar of the same size cut into d2 parts with s2 shaded. */
export function twoBarsFigure(d1: number, s1: number, d2: number, s2: number): Figure {
  const w = 280;
  const h = 26;
  let body = "";
  [
    [d1, s1],
    [d2, s2],
  ].forEach(([d, s], b) => {
    const y = 8 + b! * (h + 14);
    for (let i = 0; i < d!; i++)
      body += `<rect x="${round(20 + (i * w) / d!)}" y="${y}" width="${round(w / d!)}" height="${h}"${i < s! ? ` ${shade}` : ""}/>`;
  });
  return {
    svg: svgDocument(2 * (h + 14) + 4, body),
    alt: t(
      `Two bars of the same size: the first is cut into ${d1} equal parts with ${s1} shaded, the second into ${d2} equal parts with ${s2} shaded.`,
      `两个同样大的长条：第一个平均分成 ${d1} 份，涂了 ${s1} 份；第二个平均分成 ${d2} 份，涂了 ${s2} 份。`,
    ),
  };
}

/** gridFigure is a rectangle cut into d columns and k rows with the first n columns shaded. */
function gridFigure(n: number, d: number, k: number): Figure {
  const w = 240;
  const h = 120;
  let body = "";
  for (let i = 0; i < d; i++)
    body += `<rect x="${round(40 + (i * w) / d)}" y="8" width="${round(w / d)}" height="${h}"${i < n ? ` ${shade}` : ""}/>`;
  for (let r = 1; r < k; r++) body += `<line x1="40" y1="${round(8 + (r * h) / k)}" x2="280" y2="${round(8 + (r * h) / k)}"/>`;
  return {
    svg: svgDocument(h + 16, body),
    alt: t(
      `A rectangle cut into ${d} equal columns and ${k} equal rows; ${n} column${n === 1 ? " is" : "s are"} shaded.`,
      `一个长方形被平均分成 ${d} 列、${k} 行，其中 ${n} 列涂了颜色。`,
    ),
  };
}

/** LinePoint is a labeled point on a number line, at a value in units of 1/d. */
interface LinePoint {
  readonly at: number;
  readonly label: string;
}

/** steppedLine draws the number line of numberLineFigure with the steps from start to the point P, which is the result. */
function steppedLine(
  d: number,
  from: number,
  to: number,
  labels: ReadonlyMap<number, string>,
  start: number,
  at: number,
  value: string,
): Figure {
  const x = (k: number) => round(20 + ((k - from) / (to - from)) * 280);
  const line = numberLineFigure(d, from, to, labels, [{ at, label: "P" }]);
  const stops = Array.from({ length: at - start + 1 }, (_, i) => start + i);
  return {
    svg: line.svg.replaceAll('class="accent"', 'class="result"').replace("</svg>", `${jumpArcs(x, 40, stops)}</svg>`),
    alt: t(
      `Counting ${at - start} steps from ${labels.get(start)} reaches P, which is ${value}.`,
      `从 ${labels.get(start)} 往右数 ${at - start} 格到达 P，P 是 ${value}。`,
    ),
  };
}

/** numberLineFigure draws a number line from `from` to `to` (whole numbers of 1/d steps) with labels at the given ticks and labeled points. */
function numberLineFigure(_d: number, from: number, to: number, labels: ReadonlyMap<number, string>, points: readonly LinePoint[]): Figure {
  const x = (k: number) => round(20 + ((k - from) / (to - from)) * 280);
  const y = 40;
  let body = `<line x1="${x(from)}" y1="${y}" x2="${x(to)}" y2="${y}"/>`;
  for (let k = from; k <= to; k++) {
    const big = labels.has(k);
    body += `<line x1="${x(k)}" y1="${y - (big ? 7 : 4)}" x2="${x(k)}" y2="${y + (big ? 7 : 4)}"/>`;
    if (big) body += `<text x="${x(k)}" y="${y + 22}" stroke="none" fill="currentColor">${labels.get(k)}</text>`;
  }
  for (const p of points) {
    body += `<circle class="accent" cx="${x(p.at)}" cy="${y}" r="4.5" fill="currentColor" stroke="none"/>`;
    body += `<text class="accent" x="${x(p.at)}" y="${y - 12}" stroke="none" fill="currentColor" font-style="italic">${p.label}</text>`;
  }
  const names = points.map((p) => p.label).join(", ");
  return {
    svg: svgDocument(70, body),
    alt: t(
      `A number line with ${to - from} equal steps between the marked numbers ${[...labels.values()].join(", ")}, and point${points.length > 1 ? "s" : ""} ${names} on tick marks.`,
      `一条数轴，标有数 ${[...labels.values()].join("、")}，相邻刻度间距相等，共 ${to - from} 格；点 ${names} 在刻度上。`,
    ),
  };
}

/** wholeLabels labels every d-th tick from `from` to `to` with its whole number. */
function wholeLabels(d: number, from: number, to: number): Map<number, string> {
  const m = new Map<number, string>();
  for (let k = from; k <= to; k++) if (k % d === 0) m.set(k, String(k / d));
  return m;
}

// ---------------------------------------------------------------------------
// Contexts

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

/** Whole is a thing cut into equal parts, in both languages. */
interface Whole {
  readonly en: string;
  readonly zh: string;
  readonly part: Text;
}

const wholes: readonly Whole[] = [
  { en: "pizza", zh: "比萨", part: t("slices", "块") },
  { en: "cake", zh: "蛋糕", part: t("pieces", "块") },
  { en: "chocolate bar", zh: "巧克力", part: t("pieces", "块") },
  { en: "garden", zh: "菜园", part: t("plots", "块") },
  { en: "ribbon", zh: "丝带", part: t("pieces", "段") },
  { en: "pie", zh: "馅饼", part: t("slices", "块") },
];

/** Amount is a measured quantity used in word problems. */
interface Amount {
  readonly unit: Text;
  readonly first: (name: string, v: string) => Text;
  readonly second: (name: string, v: string) => Text;
  readonly together: Text;
  readonly difference: Text;
}

const amounts: readonly Amount[] = [
  {
    unit: t("miles", "英里"),
    first: (n, v) => t(`${n} walked ${v} mile in the morning`, `${n} 上午走了 ${v} 英里`),
    second: (_n, v) => t(`and ${v} mile in the afternoon.`, `下午走了 ${v} 英里。`),
    together: t("How many miles is that in all?", "一共走了多少英里？"),
    difference: t("How many more miles were walked in the morning than in the afternoon?", "上午比下午多走了多少英里？"),
  },
  {
    unit: t("cups", "杯"),
    first: (n, v) => t(`${n} used ${v} cup of flour for bread`, `${n} 做面包用了 ${v} 杯面粉`),
    second: (_n, v) => t(`and ${v} cup of flour for muffins.`, `做松饼用了 ${v} 杯面粉。`),
    together: t("How many cups of flour were used in all?", "一共用了多少杯面粉？"),
    difference: t("How many more cups were used for bread than for muffins?", "做面包比做松饼多用了多少杯？"),
  },
  {
    unit: t("hours", "小时"),
    first: (n, v) => t(`${n} read for ${v} hour on Saturday`, `${n} 星期六读了 ${v} 小时书`),
    second: (_n, v) => t(`and ${v} hour on Sunday.`, `星期日读了 ${v} 小时书。`),
    together: t("How many hours of reading is that in all?", "一共读了多少小时？"),
    difference: t("How many more hours of reading were there on Saturday than on Sunday?", "星期六比星期日多读了多少小时？"),
  },
  {
    unit: t("liters", "升"),
    first: (n, v) => t(`${n} poured ${v} liter of water into a tank`, `${n} 往水箱里倒了 ${v} 升水`),
    second: (_n, v) => t(`and then ${v} liter more.`, `然后又倒了 ${v} 升。`),
    together: t("How many liters were poured in all?", "一共倒了多少升？"),
    difference: t("How many more liters were poured the first time than the second?", "第一次比第二次多倒了多少升？"),
  },
];

/** standardsOf is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
  intro?: Text,
): TopicDef {
  return {
    id,
    title,
    summary,
    ...(intro && { intro }),
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss(...standards),
    knowledgePoints,
  };
}

// ---------------------------------------------------------------------------
// Fractions

/** fw writes n/d in words as a pair. */
const fw = (n: number, d: number): Pair => {
  const w = fractionWords(n, d);
  return [w.en, w["zh-CN"]];
};

/** shareBars draws a bars, each cut into b equal pieces, with one piece of each bar shaded: one person's share. */
const shareBars = (a: number, b: number): Figure =>
  tapeFigure(
    Array.from({ length: a }, () => ({
      pieces: Array.from({ length: b }, (_, i) => ({ size: 1, text: `1/${b}`, lit: i === 0 })),
    })),
    [
      `${a} equal bars, each cut into ${b} equal pieces, with one piece of each bar shaded.`,
      `${a} 个同样的长条，每个都平均分成 ${b} 份，每个长条涂了 1 份。`,
    ],
  );

/** fractionLine is a number line from 0 to 1 in d equal steps with the given points. */
const fractionLine = (d: number, points: readonly LinePoint[]): Figure => numberLineFigure(d, 0, d, wholeLabels(d, 0, d), points);

export const fractionModels = topic(
  "fraction-models",
  t("Fraction Models", "分数的模型"),
  t(
    "A fraction names equal parts of a whole. If a bar is cut into 5 equal parts and 3 are shaded, then 3/5 of the bar is shaded: the denominator 5 counts the parts in the whole, and the numerator 3 counts the shaded parts.",
    "分数表示把一个整体平均分成若干份中的几份。把一个长条平均分成 5 份，涂色 3 份，涂色部分就是这个长条的 3/5：分母 5 表示整体被分成的份数，分子 3 表示涂色的份数。",
  ),
  ["comparing-fractions-with-a-common-part"],
  ["3.NF.A.1"],
  [
    point(
      "naming-shaded-parts",
      ["The shaded part", "涂色部分"],
      [
        "This bar is cut into 8 equal parts, and 3 are shaded. The bottom number counts all the parts: 8. The top number counts the shaded parts: 3. So $\\frac{3}{8}$ of the bar is shaded.\n\nCheck: the 5 parts left are $\\frac{5}{8}$, and $\\frac{3}{8}$ and $\\frac{5}{8}$ make $\\frac{8}{8}$, the whole bar.\n\n> **Watch out.** The bottom number counts all the parts, not only the unshaded ones. It is $\\frac{3}{8}$, not $\\frac{3}{5}$.",
        "这个长条平均分成 8 份，涂了 3 份。分母是总份数：8。分子是涂色的份数：3。所以涂色部分是长条的 $\\frac{3}{8}$。\n\n检验：没涂色的 5 份是 $\\frac{5}{8}$，$\\frac{3}{8}$ 和 $\\frac{5}{8}$ 合起来是 $\\frac{8}{8}$，正好是整个长条。\n\n> **注意。** 分母是全部的份数，不是没涂色的份数。是 $\\frac{3}{8}$，不是 $\\frac{3}{5}$。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 12, 3);
        return answered(
          ["What fraction of the bar is shaded?", "长条的几分之几涂了颜色？"],
          qf(n, d),
          [
            [
              ["Count all the parts", "数总份数"],
              [`The bar has ${d} equal parts, so the bottom number is ${d}.`, `长条平均分成 ${d} 份，所以分母是 ${d}。`],
            ],
            [
              ["Count the shaded parts", "数涂色的份数"],
              [`${n} parts are shaded, so the top number is ${n}: $${fr(n, d)}$.`, `涂了 ${n} 份，所以分子是 ${n}：$${fr(n, d)}$。`],
            ],
          ],
          [
            `The ${d - n} unshaded parts are $${fr(d - n, d)}$. Together they make the whole bar: $${fr(n, d)} + ${fr(d - n, d)} = ${fr(d, d)}$.`,
            `没涂色的 ${d - n} 份是 $${fr(d - n, d)}$。合起来正好是整个长条：$${fr(n, d)} + ${fr(d - n, d)} = ${fr(d, d)}$。`,
          ],
          [
            [
              qf(n, d - n),
              "That puts only the unshaded parts on the bottom. The bottom number counts all the parts.",
              "这把没涂色的份数当成了分母。分母是全部的份数。",
            ],
            [qf(d - n, d), "That counts the parts that are not shaded.", "这数的是没涂色的部分。"],
            [qf(d, n), "That swaps the top and the bottom numbers.", "这把分子和分母弄反了。"],
          ],
          { form: "fraction", figure: barFigure(d, n) },
        );
      },
      barFigure(8, 3),
    ),
    point(
      "naming-unshaded-parts",
      ["The part that is not shaded", "未涂色部分"],
      [
        "This bar has 8 equal parts and 3 are shaded, so $8 - 3 = 5$ parts are not shaded. The unshaded part is $\\frac{5}{8}$ of the bar.\n\nCheck: $\\frac{5}{8}$ and the shaded $\\frac{3}{8}$ make $\\frac{8}{8}$, the whole bar.\n\n> **Watch out.** The question asks about the parts that are not shaded. Do not write the shaded fraction $\\frac{3}{8}$.",
        "这个长条平均分成 8 份，涂了 3 份，所以有 $8 - 3 = 5$ 份没涂色。没涂色的部分是长条的 $\\frac{5}{8}$。\n\n检验：$\\frac{5}{8}$ 和涂色的 $\\frac{3}{8}$ 合起来是 $\\frac{8}{8}$，正好是整个长条。\n\n> **注意。** 问的是没涂色的部分，不要写成涂色部分 $\\frac{3}{8}$。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 12, 3);
        return answered(
          ["What fraction of the bar is not shaded?", "长条的几分之几没有涂色？"],
          qf(d - n, d),
          [
            [
              ["Count all the parts", "数总份数"],
              [`The bar has ${d} equal parts, so the bottom number is ${d}.`, `长条平均分成 ${d} 份，所以分母是 ${d}。`],
            ],
            [
              ["Count the unshaded parts", "数没涂色的份数"],
              [
                `$${d} - ${n} = ${d - n}$ parts are not shaded: $${fr(d - n, d)}$.`,
                `有 $${d} - ${n} = ${d - n}$ 份没涂色：$${fr(d - n, d)}$。`,
              ],
            ],
          ],
          [
            `With the shaded part it makes the whole bar: $${fr(d - n, d)} + ${fr(n, d)} = ${fr(d, d)}$.`,
            `加上涂色部分正好是整个长条：$${fr(d - n, d)} + ${fr(n, d)} = ${fr(d, d)}$。`,
          ],
          [
            [qf(n, d), "That is the shaded part.", "这是涂色部分。"],
            [
              qf(d - n, n),
              "That puts the shaded parts on the bottom. The bottom number counts all the parts.",
              "这把涂色的份数当成了分母。分母是全部的份数。",
            ],
            [qf(1, d), "That is only one part.", "这只是其中一份。"],
          ],
          { form: "fraction", figure: barFigure(d, n) },
        );
      },
      barFigure(8, 3),
    ),
  ],
  t(
    "Mia cuts a sandwich into 4 equal parts and eats 1 of them. She ate $\\frac{1}{4}$ of the sandwich: 1 part out of 4 equal parts.\n\nCheck: 4 parts of $\\frac{1}{4}$ make the whole sandwich.\n\nIn this lesson we use fractions to name the shaded and the unshaded parts of a whole.",
    "米娅把一个三明治平均切成 4 份，吃了 1 份。她吃了这个三明治的 $\\frac{1}{4}$：平均分成 4 份中的 1 份。\n\n检验：4 个 $\\frac{1}{4}$ 合起来正好是整个三明治。\n\n本课我们用分数表示一个整体中涂色和没涂色的部分。",
  ),
);

export const modelingFractionsUsingNumberLines = topic(
  "modeling-fractions-using-number-lines",
  t("Modeling Fractions Using Number Lines", "用数轴表示分数"),
  t(
    "To place fractions with denominator d on a number line, cut the segment from 0 to 1 into d equal steps. The point n steps from 0 is n/d.",
    "要在数轴上表示分母为 d 的分数，把从 0 到 1 的线段平均分成 d 份。从 0 起数第 n 个刻度表示 n/d。",
  ),
  ["fraction-models"],
  ["3.NF.A.2"],
  [
    point(
      "reading-a-point-on-a-number-line",
      ["Reading a point", "读出点表示的分数"],
      [
        "The line from 0 to 1 is cut into 5 equal steps, so each step is $\\frac{1}{5}$. Point P is 2 steps from 0, so P is $\\frac{2}{5}$.\n\nCheck: P is 3 steps before 1, and $\\frac{2}{5} + \\frac{3}{5} = 1$.\n\n> **Watch out.** Count the steps between the marks, not the marks. From 0 to 1 there are 6 marks but only 5 steps.",
        "从 0 到 1 平均分成 5 格，每格是 $\\frac{1}{5}$。点 P 离 0 有 2 格，所以 P 是 $\\frac{2}{5}$。\n\n检验：P 离 1 还有 3 格，$\\frac{2}{5} + \\frac{3}{5} = 1$。\n\n> **注意。** 数的是刻度之间的格数，不是刻度线的条数。从 0 到 1 有 6 条刻度线，但只有 5 格。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 12, 3);
        const misses: Miss[] = [
          [qf(n, d + 1), "That counts the marks, not the steps between them.", "这数的是刻度线，不是格数。"],
          [qf(d - n, d), "That counts the steps back from 1, not from 0.", "这是从 1 往回数的格数，不是从 0 数。"],
          [qf(1, d), "That is one step. Count all the steps from 0 to P.", "这只是一格。要数从 0 到 P 的全部格数。"],
        ];
        return {
          ...answered(
            ["What fraction does point $P$ show?", "点 $P$ 表示什么分数？"],
            qf(n, d),
            [
              [
                ["Find the size of a step", "看每格多大"],
                [
                  `From 0 to 1 there are ${d} equal steps, so each step is $${fr(1, d)}$.`,
                  `从 0 到 1 平均分成 ${d} 格，每格是 $${fr(1, d)}$。`,
                ],
              ],
              [
                ["Count the steps to P", "数到 P 的格数"],
                [`P is ${n} steps from 0: $${fr(n, d)}$.`, `P 离 0 有 ${n} 格：$${fr(n, d)}$。`],
              ],
            ],
            [
              `P is ${d - n} steps before 1, and $${fr(n, d)} + ${fr(d - n, d)} = 1$.`,
              `P 离 1 还有 ${d - n} 格，$${fr(n, d)} + ${fr(d - n, d)} = 1$。`,
            ],
            misses,
            { form: "fraction", figure: fractionLine(d, [{ at: n, label: "P" }]) },
          ),
          solutionFigure: steppedLine(d, 0, d, wholeLabels(d, 0, d), 0, n, `${n}/${d}`),
        };
      },
      fractionLine(5, [{ at: 2, label: "P" }]),
    ),
    point(
      "choosing-the-point-for-a-fraction",
      ["Choosing the point", "找出表示分数的点"],
      [
        "To find $\\frac{4}{6}$, look at the line from 0 to 1. It is cut into 6 equal steps. Count 4 steps from 0. That is point B.\n\nCheck: B is 2 steps before 1, and $\\frac{4}{6} + \\frac{2}{6} = 1$.\n\n> **Watch out.** Start counting at 0, not at 1. Counting 4 steps back from 1 gives $\\frac{2}{6}$.",
        "要找 $\\frac{4}{6}$，看从 0 到 1 的线段，它平均分成 6 格。从 0 起数 4 格，就是点 B。\n\n检验：B 离 1 还有 2 格，$\\frac{4}{6} + \\frac{2}{6} = 1$。\n\n> **注意。** 要从 0 开始数，不是从 1 开始。从 1 往回数 4 格得到的是 $\\frac{2}{6}$。",
      ],
      (rng) => {
        const d = rng.int(4, 12);
        const spots = rng.sample(
          Array.from({ length: d - 1 }, (_, i) => i + 1),
          3,
        );
        const target = spots[0]!;
        const sorted = [...spots].sort((a, b) => a - b);
        const letters = ["A", "B", "C"];
        const name = (at: number) => letters[sorted.indexOf(at)]!;
        const others = sorted.filter((at) => at !== target);
        return picked(
          rng,
          [`Which point shows $${fr(target, d)}$?`, `哪个点表示 $${fr(target, d)}$？`],
          [`Point $${name(target)}$`, `点 $${name(target)}$`],
          others.map((at): [Pair, string, string] => [
            [`Point $${name(at)}$`, `点 $${name(at)}$`],
            `That point is ${at} steps from 0, so it shows $${fr(at, d)}$.`,
            `这个点离 0 有 ${at} 格，表示的是 $${fr(at, d)}$。`,
          ]),
          [
            [
              ["Find the size of a step", "看每格多大"],
              [
                `From 0 to 1 there are ${d} equal steps, so each step is $${fr(1, d)}$.`,
                `从 0 到 1 平均分成 ${d} 格，每格是 $${fr(1, d)}$。`,
              ],
            ],
            [
              ["Count from 0", "从 0 开始数"],
              [`Count ${target} steps from 0: that is point $${name(target)}$.`, `从 0 起数 ${target} 格，是点 $${name(target)}$。`],
            ],
          ],
          [
            `Point $${name(target)}$ is ${d - target} steps before 1, and $${fr(target, d)} + ${fr(d - target, d)} = 1$.`,
            `点 $${name(target)}$ 离 1 还有 ${d - target} 格，$${fr(target, d)} + ${fr(d - target, d)} = 1$。`,
          ],
          fractionLine(
            d,
            sorted.map((at, i) => ({ at, label: letters[i]! })),
          ),
        );
      },
      fractionLine(6, [
        { at: 1, label: "A" },
        { at: 4, label: "B" },
        { at: 5, label: "C" },
      ]),
    ),
  ],
  t(
    "The path from Leo's home to school has 5 equal parts. Leo stops after 2 of them, so he has gone $\\frac{2}{5}$ of the way.\n\nCheck: 3 more parts of $\\frac{1}{5}$ take him to $\\frac{5}{5}$, which is the school.\n\nIn this lesson we find fractions as points on a number line.",
    "从利奥家到学校的路平均分成 5 段。利奥走了 2 段停下来，他走了全程的 $\\frac{2}{5}$。\n\n检验：再走 3 段 $\\frac{1}{5}$ 就到了 $\\frac{5}{5}$，也就是学校。\n\n本课我们在数轴上找表示分数的点。",
  ),
);

/** unitDenominators are the denominators used for unit fractions in words. */
const unitDenominators = [...Array.from({ length: 19 }, (_, i) => i + 2), 100];

export const writingUnitFractionsInWords = topic(
  "writing-unit-fractions-in-words",
  t("Writing Unit Fractions in Words", "用文字表示单位分数"),
  t(
    "A unit fraction has numerator 1: one of d equal parts. It is read with the name of the part: 1/2 is one half, 1/3 one third, 1/4 one fourth (or one quarter), 1/5 one fifth, and so on.",
    "分子是 1 的分数叫单位分数：表示平均分成 d 份中的一份。1/2 读作二分之一，1/3 读作三分之一，1/5 读作五分之一，依此类推。",
  ),
  ["fraction-models"],
  ["3.NF.A.1"],
  [
    point(
      "reading-and-writing-unit-fractions",
      ["Reading and writing unit fractions", "读写几分之一"],
      [
        'A unit fraction has 1 on top. In words it is "one" and then the name of the parts, which comes from the bottom number. $\\frac{1}{6}$ is "one sixth", and "one ninth" is $\\frac{1}{9}$.\n\nCheck: 6 sixths make one whole, so one sixth is 1 of 6 equal parts.\n\n> **Watch out.** "One sixth" is $\\frac{1}{6}$, not the whole number 6.',
        '分子是 1 的分数，读作"几分之一"，"几"就是分母。$\\frac{1}{6}$ 读作"六分之一"，"九分之一"写作 $\\frac{1}{9}$。\n\n检验：6 个六分之一合起来是 1 个整体，所以六分之一是平均分成 6 份中的 1 份。\n\n> **注意。** "六分之一"是 $\\frac{1}{6}$，不是整数 6。',
      ],
      (rng) => {
        const d = rng.pick(unitDenominators);
        const walk: Walk[] = [
          [
            ["Read the bottom number", "看分母"],
            [`The bottom number ${d} names the parts: the whole is cut into ${d} equal parts.`, `分母 ${d} 表示把整体平均分成 ${d} 份。`],
          ],
          [
            ["Take one part", "取其中一份"],
            [`One of them is "${fw(1, d)[0]}", $${fr(1, d)}$.`, `其中一份是"${fw(1, d)[1]}"，即 $${fr(1, d)}$。`],
          ],
        ];
        const check: Pair = [`${d} parts of $${fr(1, d)}$ make one whole.`, `${d} 个 $${fr(1, d)}$ 合起来是 1 个整体。`];
        if (rng.bool()) {
          const near = rng.shuffle(unitDenominators.filter((x) => x !== d && Math.abs(x - d) <= 4)).slice(0, 2);
          return picked(
            rng,
            [`How is $${fr(1, d)}$ written in words?`, `$${fr(1, d)}$ 怎么读？`],
            fw(1, d),
            [
              [[wordsEn(d), wordsZh(d)], `That is the whole number ${d}, not one part.`, `这是整数 ${d}，不是其中的一份。`],
              ...near.map((x): [Pair, string, string] => [
                fw(1, x),
                `That is one of ${x} equal parts, but the bottom number is ${d}.`,
                `这是平均分成 ${x} 份中的一份，可是分母是 ${d}。`,
              ]),
            ],
            walk,
            check,
          );
        }
        return answered(
          [`Write "${fw(1, d)[0]}" as a fraction.`, `把"${fw(1, d)[1]}"写成分数。`],
          qf(1, d),
          walk,
          check,
          [
            [d, "That is the number of parts, not one part.", "这是份数，不是其中的一份。"],
            [qf(1, d + 1), `That cuts the whole into ${d + 1} parts, not ${d}.`, `这是平均分成 ${d + 1} 份，不是 ${d} 份。`],
          ],
          { form: "fraction" },
        );
      },
      barFigure(6, 1),
    ),
    point(
      "unit-fractions-in-context",
      ["Unit fractions in stories", "生活中的几分之一"],
      [
        "A cake is cut into 8 equal pieces. One piece is 1 of 8 equal parts, so it is $\\frac{1}{8}$ of the cake.\n\nCheck: 8 pieces of $\\frac{1}{8}$ make the whole cake.\n\n> **Watch out.** One piece is $\\frac{1}{8}$, not 8. The 8 tells how many pieces the cake has.",
        "一个蛋糕平均切成 8 块。一块是平均分成 8 份中的 1 份，所以是这个蛋糕的 $\\frac{1}{8}$。\n\n检验：8 个 $\\frac{1}{8}$ 合起来是整个蛋糕。\n\n> **注意。** 一块是 $\\frac{1}{8}$，不是 8。8 表示蛋糕一共分成几块。",
      ],
      (rng) => {
        const w = rng.pick(wholes);
        const d = rng.int(2, 20);
        const part = w.part["zh-CN"];
        return answered(
          [
            `A ${w.en} is cut into ${d} equal ${w.part.en}. What fraction of the ${w.en} is one of the ${w.part.en}?`,
            `把一个${w.zh}平均分成 ${d} ${part}。其中一${part}是这个${w.zh}的几分之几？`,
          ],
          qf(1, d),
          [
            [
              ["Count the parts", "数总份数"],
              [`The ${w.en} has ${d} equal parts, so the bottom number is ${d}.`, `${w.zh}平均分成 ${d} 份，所以分母是 ${d}。`],
            ],
            [
              ["Take one part", "取其中一份"],
              [`One part is $${fr(1, d)}$.`, `其中一份是 $${fr(1, d)}$。`],
            ],
          ],
          [`${d} parts of $${fr(1, d)}$ make the whole ${w.en}.`, `${d} 个 $${fr(1, d)}$ 合起来是整个${w.zh}。`],
          [
            [d, "That is the number of parts, not the size of one part.", "这是份数，不是一份的大小。"],
            [qf(d - 1, d), "That is all the other parts, not one part.", "这是其余所有的部分，不是一份。"],
          ],
          { form: "fraction" },
        );
      },
      barFigure(8, 1),
    ),
  ],
  t(
    "A pie is cut into 6 equal slices. One slice is one sixth of the pie, and we write it as $\\frac{1}{6}$.\n\nCheck: 6 slices of one sixth make the whole pie.\n\nIn this lesson we read and write unit fractions, fractions with 1 on top, in words.",
    "一个馅饼平均切成 6 块。一块是这个馅饼的六分之一，写作 $\\frac{1}{6}$。\n\n检验：6 个六分之一合起来是整个馅饼。\n\n本课我们学习读写分子是 1 的分数，也就是几分之一。",
  ),
);

export const writingFractionsInWords = topic(
  "writing-fractions-in-words",
  t("Writing Fractions in Words", "用文字表示分数"),
  t(
    "A fraction is read as its numerator followed by the name of the parts, in the plural when the numerator is more than 1: 3/5 is three fifths, 7/10 is seven tenths.",
    '分数读作"几分之几"：先读分母，再读"分之"，最后读分子。3/5 读作五分之三，7/10 读作十分之七。',
  ),
  ["writing-unit-fractions-in-words"],
  ["3.NF.A.1"],
  [
    point(
      "writing-fractions-as-words",
      ["Writing fractions in words", "分数的读法"],
      [
        'Say the top number first, then the name of the parts. Add an "s" when there is more than one part. $\\frac{4}{9}$ is "four ninths".\n\nCheck: four ninths is 4 parts of one ninth, which is $\\frac{4}{9}$.\n\n> **Watch out.** Do not swap the numbers. "Nine fourths" is $\\frac{9}{4}$, a different number.',
        '分数先读分母，再读"分之"，最后读分子。$\\frac{4}{9}$ 读作"九分之四"。\n\n检验：九分之四是 4 个九分之一，正是 $\\frac{4}{9}$。\n\n> **注意。** 不要把分子分母读反。"四分之九"是 $\\frac{9}{4}$，是另一个数。',
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = coprimeTo(rng, d, 2, d - 1);
        const other = n + 1 < d ? n + 1 : n - 1;
        return picked(
          rng,
          [`How is $${fr(n, d)}$ written in words?`, `$${fr(n, d)}$ 怎么读？`],
          fw(n, d),
          [
            [fw(d, n), "That swaps the top and the bottom numbers.", "这把分子和分母读反了。"],
            [fw(n, d + 1), `That names parts of ${d + 1}, but the bottom number is ${d}.`, `这是平均分成 ${d + 1} 份，可是分母是 ${d}。`],
            [fw(other, d), `That is ${other} parts, but the top number is ${n}.`, `这是 ${other} 份，可是分子是 ${n}。`],
          ],
          [
            [
              ["Name the parts", "看分母"],
              [`The bottom number ${d} gives the parts: ${ordinalEn(d, true)}.`, `分母是 ${d}，读作"${wordsZh(d)}分之"。`],
            ],
            [
              ["Count the parts", "看分子"],
              [`The top number ${n} comes first: "${fw(n, d)[0]}".`, `分子是 ${n}，放在最后读："${fw(n, d)[1]}"。`],
            ],
          ],
          [
            `"${fw(n, d)[0]}" is ${n} parts of one ${ordinalEn(d, false)}, which is $${fr(n, d)}$.`,
            `"${fw(n, d)[1]}"是 ${n} 个${fw(1, d)[1]}，正是 $${fr(n, d)}$。`,
          ],
        );
      },
      barFigure(9, 4),
    ),
    point(
      "writing-words-as-fractions",
      ["Writing words as fractions", "根据读法写分数"],
      [
        'The first number word is the top number. The name of the parts gives the bottom number: thirds are 3, eighths are 8. "Five eighths" is $\\frac{5}{8}$.\n\nCheck: $\\frac{5}{8}$ is 5 parts of $\\frac{1}{8}$, which is five eighths.\n\n> **Watch out.** "Five eighths" is $\\frac{5}{8}$, not $\\frac{8}{5}$.',
        '"分之"前面的数是分母，后面的数是分子。"八分之五"写作 $\\frac{5}{8}$。\n\n检验：$\\frac{5}{8}$ 是 5 个 $\\frac{1}{8}$，正是八分之五。\n\n> **注意。** "八分之五"是 $\\frac{5}{8}$，不是 $\\frac{8}{5}$。',
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 20, 3);
        return answered(
          [`Write "${fw(n, d)[0]}" as a fraction.`, `把"${fw(n, d)[1]}"写成分数。`],
          qf(n, d),
          [
            [
              ["Find the bottom number", "找分母"],
              [
                `"${ordinalEn(d, n !== 1)}" means the whole is cut into ${d} parts: the bottom number is ${d}.`,
                `"${wordsZh(d)}分之"表示平均分成 ${d} 份：分母是 ${d}。`,
              ],
            ],
            [
              ["Find the top number", "找分子"],
              [`"${wordsEn(n)}" is the top number: $${fr(n, d)}$.`, `"分之"后面的"${wordsZh(n)}"是分子：$${fr(n, d)}$。`],
            ],
          ],
          [`$${fr(n, d)}$ is ${n} parts of $${fr(1, d)}$: "${fw(n, d)[0]}".`, `$${fr(n, d)}$ 是 ${n} 个 $${fr(1, d)}$："${fw(n, d)[1]}"。`],
          [
            [qf(d, n), "That swaps the top and the bottom numbers.", "这把分子和分母写反了。"],
            [qf(1, d), "That is only one part.", "这只是其中一份。"],
          ],
          { form: "fraction" },
        );
      },
      barFigure(8, 5),
    ),
  ],
  t(
    "Sam eats 3 slices of a pizza cut into 8 equal slices. He ate three eighths of the pizza, written $\\frac{3}{8}$.\n\nCheck: 3 slices of one eighth each make three eighths.\n\nIn this lesson we write fractions in words and words as fractions.",
    "萨姆吃了一个比萨的 3 块，这个比萨平均切成 8 块。他吃了这个比萨的八分之三，写作 $\\frac{3}{8}$。\n\n检验：3 个八分之一就是八分之三。\n\n本课我们学习把分数写成文字，也把文字写成分数。",
  ),
);

export const interpretingFractionsAsDivision = topic(
  "interpreting-fractions-as-division",
  t("Interpreting Fractions as Division", "把分数理解为除法"),
  t(
    "Sharing a things equally among b people gives each person a/b of a thing, so a ÷ b = a/b. For example, 3 pizzas shared among 4 people give each 3/4 of a pizza.",
    "把 a 个东西平均分给 b 个人，每人得到 a/b 个，所以 a ÷ b = a/b。例如 3 个比萨平均分给 4 个人，每人得到 3/4 个比萨。",
  ),
  ["fraction-models", "relationship-between-multiplication-and-division"],
  ["5.NF.B.3"],
  [
    point(
      "writing-quotients-as-fractions",
      ["Writing quotients as fractions", "把除法写成分数"],
      [
        "Share 3 bars among 4 people: cut each bar into 4 parts, and each person gets one part of each bar. That is 3 parts of $\\frac{1}{4}$, so $3 \\div 4 = \\frac{3}{4}$. The number being shared goes on top.\n\nCheck: $4 \\times \\frac{3}{4} = \\frac{12}{4} = 3$.\n\n> **Watch out.** $3 \\div 4$ is $\\frac{3}{4}$, not $\\frac{4}{3}$.",
        "把 3 个长条平均分给 4 个人：把每个长条平均分成 4 份，每人从每个长条拿 1 份，共 3 个 $\\frac{1}{4}$，所以 $3 \\div 4 = \\frac{3}{4}$。被除数作分子，除数作分母。\n\n检验：$4 \\times \\frac{3}{4} = \\frac{12}{4} = 3$。\n\n> **注意。** $3 \\div 4$ 是 $\\frac{3}{4}$，不是 $\\frac{4}{3}$。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 15);
        return answered(
          [`Write $${a} \\div ${b}$ as a fraction.`, `把 $${a} \\div ${b}$ 写成分数。`],
          qf(a, b),
          [
            [
              ["Find the top number", "找分子"],
              [`The number being shared, ${a}, goes on top.`, `被除数 ${a} 作分子。`],
            ],
            [
              ["Find the bottom number", "找分母"],
              [
                `It is shared into ${b} parts, so ${b} goes on the bottom: $${fr(a, b)}$.`,
                `平均分成 ${b} 份，除数 ${b} 作分母：$${fr(a, b)}$。`,
              ],
            ],
          ],
          [`$${b} \\times ${fr(a, b)} = ${fr(a * b, b)} = ${a}$.`, `$${b} \\times ${fr(a, b)} = ${fr(a * b, b)} = ${a}$。`],
          [
            [qf(b, a), "That swaps them. The number being shared goes on top.", "这把分子分母弄反了。被除数要作分子。"],
            [
              qf(1, b),
              `That is one part of one thing. Each share has one part of each of the ${a}.`,
              `这只是一个东西的一份。每人从 ${a} 个东西里各得一份。`,
            ],
          ],
          { form: "fraction" },
        );
      },
      shareBars(3, 4),
    ),
    point(
      "fair-shares-as-fractions",
      ["Fair shares as fractions", "平均分得到分数"],
      [
        "2 cakes are shared equally by 5 children. Cut each cake into 5 equal pieces. Each child gets 1 piece of each cake: 2 pieces of $\\frac{1}{5}$. So each child gets $2 \\div 5 = \\frac{2}{5}$ of a cake.\n\nCheck: 5 children with $\\frac{2}{5}$ each have $\\frac{10}{5} = 2$ cakes.\n\n> **Watch out.** Each child gets less than one cake here, so the answer is not $\\frac{5}{2}$.",
        "把 2 个蛋糕平均分给 5 个小朋友。把每个蛋糕平均切成 5 块，每人从每个蛋糕拿 1 块：2 个 $\\frac{1}{5}$。所以每人得到 $2 \\div 5 = \\frac{2}{5}$ 个蛋糕。\n\n检验：5 个小朋友每人 $\\frac{2}{5}$ 个，合起来是 $\\frac{10}{5} = 2$ 个蛋糕。\n\n> **注意。** 这里每人得到的不到一个蛋糕，所以答案不是 $\\frac{5}{2}$。",
      ],
      (rng) => {
        const w = rng.pick(wholes.filter((x) => x.en !== "garden"));
        const [a, b] = properFraction(rng, 12);
        return answered(
          [
            `${a} ${w.en}${a > 1 ? "s are" : " is"} shared equally among ${b} friends. What fraction of a ${w.en} does each friend get?`,
            `把 ${a} 个${w.zh}平均分给 ${b} 个朋友。每人得到几分之几个${w.zh}？`,
          ],
          qf(a, b),
          [
            [
              ["Write the division", "列除法"],
              [`Share ${a} among ${b}: $${a} \\div ${b}$.`, `把 ${a} 平均分成 ${b} 份：$${a} \\div ${b}$。`],
            ],
            [
              ["Write it as a fraction", "写成分数"],
              [`$${a} \\div ${b} = ${fr(a, b)}$ of a ${w.en}.`, `$${a} \\div ${b} = ${fr(a, b)}$ 个${w.zh}。`],
            ],
          ],
          [
            `${b} friends with $${fr(a, b)}$ each have $${fr(a * b, b)} = ${a}$ ${w.en}${a > 1 ? "s" : ""}.`,
            `${b} 个朋友每人 $${fr(a, b)}$ 个，合起来是 $${fr(a * b, b)} = ${a}$ 个${w.zh}。`,
          ],
          [
            [qf(b, a), "That swaps them. Each friend gets less than one here.", "这把分子分母弄反了。这里每人得到的不到一个。"],
            [
              qf(1, b),
              `That is one piece of one ${w.en}. Each friend gets a piece of each of the ${a}.`,
              `这只是一个${w.zh}的一块。每人从 ${a} 个${w.zh}里各得一块。`,
            ],
          ],
          { form: "fraction" },
        );
      },
      shareBars(2, 5),
    ),
  ],
  t(
    "3 pizzas are shared equally by 4 friends. Cut each pizza into 4 equal slices. Each friend gets 1 slice of each pizza, so 3 slices of $\\frac{1}{4}$, which is $\\frac{3}{4}$ of a pizza.\n\nCheck: 4 friends with $\\frac{3}{4}$ each have $\\frac{12}{4} = 3$ pizzas.\n\nIn this lesson we write a division as a fraction: $3 \\div 4 = \\frac{3}{4}$.",
    "把 3 个比萨平均分给 4 个朋友。把每个比萨平均切成 4 块，每人从每个比萨拿 1 块，共 3 个 $\\frac{1}{4}$，也就是 $\\frac{3}{4}$ 个比萨。\n\n检验：4 个人每人 $\\frac{3}{4}$ 个，合起来是 $\\frac{12}{4} = 3$ 个比萨。\n\n本课我们把除法写成分数：$3 \\div 4 = \\frac{3}{4}$。",
  ),
);

// ---------------------------------------------------------------------------
// Improper fractions and mixed numbers

/** improperFraction draws n/d in lowest terms with d < n < maxWholes·d and d not dividing n. */
function improperFraction(rng: Rng, maxDen = 8, maxWholes = 3): [number, number] {
  const d = rng.int(2, maxDen);
  return [coprimeTo(rng, d, d + 1, maxWholes * d - 1), d];
}

export const improperFractions = topic(
  "improper-fractions",
  t("Improper Fractions", "假分数"),
  t(
    "A fraction whose numerator is greater than or equal to its denominator is an improper fraction; it is at least 1. Seven pieces of size 1/4 make 7/4, which is more than one whole.",
    "分子大于或等于分母的分数叫假分数，它大于或等于 1。7 个 1/4 是 7/4，比一个整体还多。",
  ),
  ["modeling-fractions-using-number-lines"],
  ["4.NF.B.3"],
  [
    point(
      "improper-fractions-from-models",
      ["Shaded parts of several wholes", "几个整体的涂色部分"],
      [
        "Each bar is one whole cut into 4 equal parts. 7 parts are shaded in all. Each part is $\\frac{1}{4}$, so the shaded amount is $\\frac{7}{4}$.\n\nCheck: one full bar is $\\frac{4}{4}$, and 3 more parts make $\\frac{7}{4}$.\n\n> **Watch out.** The bottom number is the parts in one bar, 4, not the 8 parts in both bars.",
        "每个长条是一个整体，平均分成 4 份。一共涂了 7 份。每份是 $\\frac{1}{4}$，所以涂色部分是 $\\frac{7}{4}$。\n\n检验：涂满的一个长条是 $\\frac{4}{4}$，再加 3 份是 $\\frac{7}{4}$。\n\n> **注意。** 分母是一个长条的份数 4，不是两个长条一共的 8 份。",
      ],
      (rng) => {
        const [n, d] = improperFraction(rng, 8, 3);
        const count = Math.ceil(n / d);
        return answered(
          ["Each bar is one whole. Write the shaded amount as an improper fraction.", "每个长条表示一个整体。用假分数表示涂色部分。"],
          qf(n, d),
          [
            [
              ["Find the size of a part", "看每份多大"],
              [`Each bar has ${d} equal parts, so each part is $${fr(1, d)}$.`, `每个长条平均分成 ${d} 份，每份是 $${fr(1, d)}$。`],
            ],
            [
              ["Count the shaded parts", "数涂色的份数"],
              [`${n} parts are shaded in all: $${fr(n, d)}$.`, `一共涂了 ${n} 份：$${fr(n, d)}$。`],
            ],
          ],
          [
            `${Math.floor(n / d)} full bars are $${fr(Math.floor(n / d) * d, d)}$, and ${n % d} more parts make $${fr(n, d)}$.`,
            `涂满的 ${Math.floor(n / d)} 个长条是 $${fr(Math.floor(n / d) * d, d)}$，再加 ${n % d} 份是 $${fr(n, d)}$。`,
          ],
          [
            [
              qf(n, count * d),
              "That counts the parts of all the bars as one whole. Each bar is one whole.",
              "这把所有长条当成了一个整体。每个长条才是一个整体。",
            ],
            [qf(d, n), "That swaps the top and the bottom numbers.", "这把分子和分母弄反了。"],
            [qf(n - d, d), "That leaves out one full bar.", "这少算了一个涂满的长条。"],
          ],
          { form: "fraction", figure: barFigure(d, n, count) },
        );
      },
      barFigure(4, 7, 2),
    ),
    point(
      "comparing-fractions-with-one-whole",
      ["Less than, equal to or more than 1", "小于、等于还是大于 1"],
      [
        "Compare the top number with the bottom number. $\\frac{5}{5}$ is all 5 parts, so it equals 1. $\\frac{4}{5}$ is less than 1. $\\frac{6}{5}$ is one part more than a whole, so it is more than 1.\n\nCheck: on the bars, $\\frac{6}{5}$ fills one bar and a part of the next.\n\n> **Watch out.** A fraction with equal top and bottom numbers is exactly 1, not more than 1.",
        "比较分子和分母。$\\frac{5}{5}$ 是全部 5 份，等于 1。$\\frac{4}{5}$ 小于 1。$\\frac{6}{5}$ 比一个整体多 1 份，所以大于 1。\n\n检验：在长条上，$\\frac{6}{5}$ 涂满一个长条，还涂了下一个长条的一份。\n\n> **注意。** 分子和分母相等的分数正好等于 1，不是大于 1。",
      ],
      (rng) => {
        const d = rng.int(2, 15);
        const n = rng.pick([rng.int(1, d - 1), d, rng.int(d + 1, 3 * d)]);
        const sign = n < d ? "<" : n === d ? "=" : ">";
        const reason: Record<string, Pair> = {
          "<": [`That says the top ${n} is less than the bottom ${d}, which is not true.`, `这表示分子 ${n} 小于分母 ${d}，但不是这样。`],
          "=": [`That needs the top to equal the bottom, but ${n} is not ${d}.`, `要分子等于分母才行，可 ${n} 不等于 ${d}。`],
          ">": [`That needs more than ${d} parts, but there are ${n}.`, `要超过 ${d} 份才行，可这里只有 ${n} 份。`],
        };
        return pickedMath(
          rng,
          [`Which symbol makes this true? $$${fr(n, d)} \\ \\square \\ 1$$`, `方框中应填哪个符号？$$${fr(n, d)} \\ \\square \\ 1$$`],
          sign,
          (["<", "=", ">"] as const).filter((s) => s !== sign).map((s): [string, string, string] => [s, reason[s]![0], reason[s]![1]]),
          [
            [
              ["Find one whole", "找出 1"],
              [`One whole is ${d} parts: $1 = ${fr(d, d)}$.`, `1 个整体是 ${d} 份：$1 = ${fr(d, d)}$。`],
            ],
            [
              ["Compare the parts", "比较份数"],
              [
                `${n} parts ${n < d ? "is fewer than" : n === d ? "is the same as" : "is more than"} ${d} parts, so $${fr(n, d)} ${sign} 1$.`,
                `${n} 份${n < d ? "比" : n === d ? "和" : "比"} ${d} 份${n < d ? "少" : n === d ? "同样多" : "多"}，所以 $${fr(n, d)} ${sign} 1$。`,
              ],
            ],
          ],
          n < d
            ? [`${d - n} more parts are needed to make a whole.`, `还差 ${d - n} 份才是一个整体。`]
            : n === d
              ? [`All ${d} parts make exactly one whole.`, `全部 ${d} 份正好是一个整体。`]
              : [
                  `It is one whole and $${fr(n - d, d)}$ more: $${fr(n, d)} = 1 + ${fr(n - d, d)}$.`,
                  `它是 1 个整体再多 $${fr(n - d, d)}$：$${fr(n, d)} = 1 + ${fr(n - d, d)}$。`,
                ],
          barFigure(d, n, Math.max(1, Math.ceil(n / d))),
        );
      },
      barFigure(5, 6, 2),
    ),
  ],
  t(
    "Each slice of a pizza is $\\frac{1}{4}$ of the pizza. Tom has 5 slices, so he has $\\frac{5}{4}$ of a pizza. That is more than one whole pizza.\n\nCheck: 4 of the slices make 1 pizza, and there is 1 slice more.\n\nIn this lesson we meet improper fractions, whose top number is not smaller than the bottom number.",
    "每块比萨是一个比萨的 $\\frac{1}{4}$。汤姆有 5 块，就是 $\\frac{5}{4}$ 个比萨，比一个整比萨还多。\n\n检验：其中 4 块拼成 1 个比萨，还多 1 块。\n\n本课我们认识假分数：分子大于或等于分母的分数。",
  ),
);

export const modelsForMixedNumbers = topic(
  "models-for-mixed-numbers",
  t("Models for Mixed Numbers", "带分数的模型"),
  t(
    "A mixed number such as 2 3/4 is a whole number and a proper fraction together: 2 wholes and 3/4 of another whole. In a model, 2 bars are fully shaded and 3 of the 4 parts of a third bar are shaded.",
    "像 2 3/4 这样的带分数由一个整数和一个真分数组成：2 个整体再加另一个整体的 3/4。在模型中，2 个长条全部涂色，第三个长条的 4 份中涂色 3 份。",
  ),
  ["improper-fractions"],
  ["4.NF.B.3"],
  [
    point(
      "mixed-numbers-from-models",
      ["Mixed numbers from bars", "根据长条写带分数"],
      [
        "Each bar is one whole cut into 4 parts. 2 bars are fully shaded, and 3 of the 4 parts of the next bar are shaded. The amount is 2 wholes and $\\frac{3}{4}$: $2\\frac{3}{4}$.\n\nCheck: count the parts: $4 + 4 + 3 = 11$ parts, which is $\\frac{11}{4} = 2\\frac{3}{4}$.\n\n> **Watch out.** The fraction part uses the parts of one bar. It is $\\frac{3}{4}$, not $\\frac{3}{12}$.",
        "每个长条是一个整体，平均分成 4 份。涂满了 2 个长条，下一个长条 4 份中涂了 3 份。一共是 2 个整体加 $\\frac{3}{4}$：$2\\frac{3}{4}$。\n\n检验：数份数：$4 + 4 + 3 = 11$ 份，是 $\\frac{11}{4} = 2\\frac{3}{4}$。\n\n> **注意。** 分数部分看的是一个长条的份数。是 $\\frac{3}{4}$，不是 $\\frac{3}{12}$。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const w = rng.int(1, 3);
        const r = coprimeTo(rng, d, 1, d - 1);
        return answered(
          ["Each bar is one whole. Write the shaded amount as a mixed number.", "每个长条表示一个整体。用带分数表示涂色部分。"],
          qf(w * d + r, d),
          [
            [
              ["Count the full bars", "数涂满的长条"],
              [
                `${w} ${w > 1 ? "bars are" : "bar is"} fully shaded: ${w} ${w > 1 ? "wholes" : "whole"}.`,
                `涂满了 ${w} 个长条：${w} 个整体。`,
              ],
            ],
            [
              ["Read the last bar", "看最后一个长条"],
              [
                `${r} of its ${d} parts are shaded: $${fr(r, d)}$. In all: $${mx(w, r, d)}$.`,
                `它的 ${d} 份中涂了 ${r} 份：$${fr(r, d)}$。合起来是 $${mx(w, r, d)}$。`,
              ],
            ],
          ],
          [
            `Count the parts: $${w} \\times ${d} + ${r} = ${w * d + r}$, and $${fr(w * d + r, d)} = ${mx(w, r, d)}$.`,
            `数份数：$${w} \\times ${d} + ${r} = ${w * d + r}$，$${fr(w * d + r, d)} = ${mx(w, r, d)}$。`,
          ],
          [
            [qf(w * d + r, (w + 1) * d), "That treats all the bars together as one whole.", "这把所有长条当成了一个整体。"],
            [qf(r, d), "That leaves out the full bars.", "这漏掉了涂满的长条。"],
            [w + 1, "That counts the last bar as full.", "这把最后一个长条也当成涂满了。"],
          ],
          { form: "mixed", figure: barFigure(d, w * d + r, w + 1) },
        );
      },
      barFigure(4, 11, 3),
    ),
    point(
      "mixed-numbers-from-wholes-and-parts",
      ["Wholes and a part", "整体和部分"],
      [
        "There are 3 whole cakes and $\\frac{1}{2}$ of another cake. Write the wholes first, then the fraction: $3\\frac{1}{2}$ cakes.\n\nCheck: $3\\frac{1}{2}$ is between 3 and 4, just like 3 cakes and a half.\n\n> **Watch out.** Do not add the whole number to the top. $3\\frac{1}{2}$ is not $\\frac{4}{2}$.",
        "有 3 个完整的蛋糕，还有另一个蛋糕的 $\\frac{1}{2}$。先写整数，再写分数：$3\\frac{1}{2}$ 个蛋糕。\n\n检验：$3\\frac{1}{2}$ 在 3 和 4 之间，正好是 3 个蛋糕再多半个。\n\n> **注意。** 不要把整数加到分子上。$3\\frac{1}{2}$ 不是 $\\frac{4}{2}$。",
      ],
      (rng) => {
        const wh = rng.pick(wholes.filter((x) => x.en !== "garden"));
        const d = rng.int(2, 12);
        const w = rng.int(1, 9);
        const r = coprimeTo(rng, d, 1, d - 1);
        return answered(
          [
            `There are ${w} whole ${wh.en}s and $${fr(r, d)}$ of another ${wh.en}. Write the amount as a mixed number.`,
            `有 ${w} 个完整的${wh.zh}，还有另一个${wh.zh}的 $${fr(r, d)}$。用带分数表示一共有多少个${wh.zh}。`,
          ],
          qf(w * d + r, d),
          [
            [
              ["Write the wholes", "写整数部分"],
              [`The whole number is ${w}.`, `整数部分是 ${w}。`],
            ],
            [
              ["Add the part", "写分数部分"],
              [`The part is $${fr(r, d)}$, so the amount is $${mx(w, r, d)}$.`, `分数部分是 $${fr(r, d)}$，所以是 $${mx(w, r, d)}$。`],
            ],
          ],
          [`$${mx(w, r, d)}$ is between ${w} and ${w + 1}, as it should be.`, `$${mx(w, r, d)}$ 在 ${w} 和 ${w + 1} 之间，没错。`],
          [
            [qf(w + r, d), "That adds the whole number to the top number.", "这把整数加到了分子上。"],
            [qf(w * r, d), "That multiplies the whole number by the top number.", "这把整数和分子乘了起来。"],
          ],
          { form: "mixed" },
        );
      },
      barFigure(2, 7, 4),
    ),
  ],
  t(
    "Ana has 2 full bottles of juice and $\\frac{3}{4}$ of another bottle. She has 2 and three fourths bottles, written $2\\frac{3}{4}$. This is a mixed number.\n\nCheck: 2 full bottles are $\\frac{8}{4}$, and 3 more fourths make $\\frac{11}{4}$, which is between 2 and 3.\n\nIn this lesson we read mixed numbers from pictures and stories.",
    "安娜有 2 瓶满满的果汁，还有另一瓶的 $\\frac{3}{4}$。她一共有二又四分之三瓶，写作 $2\\frac{3}{4}$，这是带分数。\n\n检验：2 满瓶是 $\\frac{8}{4}$，再加 3 个四分之一是 $\\frac{11}{4}$，在 2 和 3 之间。\n\n本课我们根据图和故事写出带分数。",
  ),
);

export const modelingMixedNumbersUsingNumberLines = topic(
  "modeling-mixed-numbers-using-number-lines",
  t("Modeling Mixed Numbers Using Number Lines", "用数轴表示带分数"),
  t(
    "On a number line with each whole cut into d equal steps, the mixed number w r/d is r steps past the whole number w.",
    "在数轴上把每个单位长度平均分成 d 格，带分数 w r/d 就在整数 w 右边第 r 格处。",
  ),
  ["models-for-mixed-numbers"],
  ["4.NF.B.3"],
  [
    point(
      "reading-mixed-numbers-on-number-lines",
      ["Reading mixed numbers on a line", "在数轴上读带分数"],
      [
        "Each whole on this line is cut into 4 equal steps. P is past 2 and 3 more steps on. So P is $2\\frac{3}{4}$.\n\nCheck: count all the steps from 0: 11 steps of $\\frac{1}{4}$ is $\\frac{11}{4} = 2\\frac{3}{4}$.\n\n> **Watch out.** Start at the whole number just before P, not the one after it.",
        "这条数轴上每个整数之间平均分成 4 格。P 过了 2，又往右 3 格，所以 P 是 $2\\frac{3}{4}$。\n\n检验：从 0 数起一共 11 格，11 个 $\\frac{1}{4}$ 是 $\\frac{11}{4} = 2\\frac{3}{4}$。\n\n> **注意。** 要从 P 前面的整数开始数，不是后面的整数。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const w = rng.int(1, 3);
        const r = coprimeTo(rng, d, 1, d - 1);
        const to = (w + 1) * d;
        return {
          ...answered(
            ["Write the number at point $P$ as a mixed number.", "用带分数表示点 $P$ 所表示的数。"],
            qf(w * d + r, d),
            [
              [
                ["Find the whole number before P", "找 P 前面的整数"],
                [`P is between ${w} and ${w + 1}, so the whole part is ${w}.`, `P 在 ${w} 和 ${w + 1} 之间，整数部分是 ${w}。`],
              ],
              [
                ["Count the steps past it", "数多出的格数"],
                [
                  `Each whole has ${d} steps, and P is ${r} past ${w}: $${mx(w, r, d)}$.`,
                  `每个整数之间有 ${d} 格，P 在 ${w} 右边 ${r} 格：$${mx(w, r, d)}$。`,
                ],
              ],
            ],
            [
              `From 0, P is ${w * d + r} steps of $${fr(1, d)}$, and $${fr(w * d + r, d)} = ${mx(w, r, d)}$.`,
              `从 0 数起 P 是 ${w * d + r} 个 $${fr(1, d)}$，$${fr(w * d + r, d)} = ${mx(w, r, d)}$。`,
            ],
            [
              [qf((w + 1) * d + r, d), `That starts from ${w + 1}, the whole number after P.`, `这是从 P 后面的 ${w + 1} 开始数的。`],
              [qf(r, d), "That leaves out the whole number.", "这漏掉了整数部分。"],
              [qf(w * (d + 1) + r, d + 1), "That counts the marks in a whole, not the steps.", "这数的是刻度线，不是格数。"],
            ],
            { form: "mixed", figure: numberLineFigure(d, 0, to, wholeLabels(d, 0, to), [{ at: w * d + r, label: "P" }]) },
          ),
          solutionFigure: steppedLine(d, 0, to, wholeLabels(d, 0, to), w * d, w * d + r, `${w} ${r}/${d}`),
        };
      },
      numberLineFigure(4, 0, 12, wholeLabels(4, 0, 12), [{ at: 11, label: "P" }]),
    ),
    point(
      "finding-mixed-numbers-on-number-lines",
      ["Finding the point", "找出表示带分数的点"],
      [
        "To find $1\\frac{2}{3}$, go to 1 first. Each whole has 3 steps, so count 2 more steps after 1. That is point B.\n\nCheck: B is 1 step before 2, and $1\\frac{2}{3} + \\frac{1}{3} = 2$.\n\n> **Watch out.** Count the steps from the whole number 1, not from 0.",
        "要找 $1\\frac{2}{3}$，先找到 1。每个整数之间有 3 格，从 1 再往右数 2 格，就是点 B。\n\n检验：B 离 2 还差 1 格，$1\\frac{2}{3} + \\frac{1}{3} = 2$。\n\n> **注意。** 要从整数 1 开始数格，不是从 0 开始。",
      ],
      (rng) => {
        const d = rng.int(3, 6);
        const to = 3 * d;
        const spots = rng.sample(
          Array.from({ length: to - 1 }, (_, i) => i + 1).filter((k) => k > d && k % d !== 0 && gcd(k % d, d) === 1),
          3,
        );
        const target = spots[0]!;
        const sorted = [...spots].sort((a, b) => a - b);
        const letters = ["A", "B", "C"];
        const name = (k: number) => letters[sorted.indexOf(k)]!;
        const mixedAt = (k: number) => mx(Math.floor(k / d), k % d, d);
        const w = Math.floor(target / d);
        const r = target % d;
        return picked(
          rng,
          [`Which point shows $${mx(w, r, d)}$?`, `哪个点表示 $${mx(w, r, d)}$？`],
          [`Point $${name(target)}$`, `点 $${name(target)}$`],
          sorted
            .filter((k) => k !== target)
            .map((k): [Pair, string, string] => [
              [`Point $${name(k)}$`, `点 $${name(k)}$`],
              `That point is ${k % d} ${k % d > 1 ? "steps" : "step"} past ${Math.floor(k / d)}, so it shows $${mixedAt(k)}$.`,
              `这个点在 ${Math.floor(k / d)} 右边 ${k % d} 格，表示 $${mixedAt(k)}$。`,
            ]),
          [
            [
              ["Go to the whole number", "先找整数"],
              [`The whole part is ${w}, so start at ${w}.`, `整数部分是 ${w}，从 ${w} 开始。`],
            ],
            [
              ["Count the steps", "再数格数"],
              [
                `Each whole has ${d} steps. Count ${r} past ${w}: point $${name(target)}$.`,
                `每个整数之间有 ${d} 格。从 ${w} 往右数 ${r} 格：点 $${name(target)}$。`,
              ],
            ],
          ],
          [
            `Point $${name(target)}$ is ${target} steps of $${fr(1, d)}$ from 0, and $${fr(target, d)} = ${mx(w, r, d)}$.`,
            `点 $${name(target)}$ 离 0 有 ${target} 个 $${fr(1, d)}$，$${fr(target, d)} = ${mx(w, r, d)}$。`,
          ],
          numberLineFigure(
            d,
            0,
            to,
            wholeLabels(d, 0, to),
            sorted.map((at, i) => ({ at, label: letters[i]! })),
          ),
        );
      },
      numberLineFigure(3, 0, 9, wholeLabels(3, 0, 9), [
        { at: 4, label: "A" },
        { at: 5, label: "B" },
        { at: 7, label: "C" },
      ]),
    ),
  ],
  t(
    "A frog hops along a ruler marked in thirds of a meter. It passes 1 and lands 2 small steps further on. It is at $1\\frac{2}{3}$ meters.\n\nCheck: one more third would take it to $1\\frac{3}{3} = 2$, so it is just before 2.\n\nIn this lesson we read and place mixed numbers on a number line.",
    "一只青蛙沿着一把按三分之一米分格的尺子跳。它过了 1，又往前跳了 2 小格，停在 $1\\frac{2}{3}$ 米处。\n\n检验：再跳一个三分之一就到 $1\\frac{3}{3} = 2$，所以它就在 2 的前面。\n\n本课我们在数轴上读出和找到带分数。",
  ),
);

export const interpretingDivisionProblemsAsMixedNumbers = topic(
  "interpreting-division-problems-as-mixed-numbers",
  t("Interpreting Division Problems as Mixed Numbers", "用带分数表示除法的结果"),
  t(
    "When a division leaves a remainder, the remainder can be shared too: 17 ÷ 5 = 3 R 2, and the 2 left over shared among 5 gives 2/5 more, so 17 ÷ 5 = 3 2/5.",
    "除法有余数时，余数也可以继续平均分：17 ÷ 5 = 3……2，剩下的 2 平均分成 5 份，每份再得 2/5，所以 17 ÷ 5 = 3 2/5。",
  ),
  ["models-for-mixed-numbers", "interpreting-fractions-as-division", "division-with-remainders"],
  ["5.NF.B.3"],
  [
    point(
      "quotients-as-mixed-numbers",
      ["Quotients as mixed numbers", "把商写成带分数"],
      [
        "Work out $17 \\div 5$. It is 3 with 2 left over. The 2 left over is shared by 5 too, which is $\\frac{2}{5}$. So $17 \\div 5 = 3\\frac{2}{5}$.\n\nCheck: $3\\frac{2}{5} = \\frac{17}{5}$, which is $17 \\div 5$.\n\n> **Watch out.** The remainder goes on top and the number you divide by goes on the bottom: $\\frac{2}{5}$, not $\\frac{5}{2}$.",
        "计算 $17 \\div 5$：商 3，余 2。余下的 2 也平均分成 5 份，是 $\\frac{2}{5}$。所以 $17 \\div 5 = 3\\frac{2}{5}$。\n\n检验：$3\\frac{2}{5} = \\frac{17}{5}$，正是 $17 \\div 5$。\n\n> **注意。** 余数作分子，除数作分母：是 $\\frac{2}{5}$，不是 $\\frac{5}{2}$。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const a = coprimeTo(rng, b, b + 1, 9 * b);
        const w = Math.floor(a / b);
        const r = a % b;
        return answered(
          [`Write $${a} \\div ${b}$ as a mixed number.`, `把 $${a} \\div ${b}$ 的结果写成带分数。`],
          qf(a, b),
          [
            [
              ["Divide", "做除法"],
              [
                `$${a} \\div ${b} = ${w}$ with ${r} left over, because $${b} \\times ${w} = ${b * w}$.`,
                `$${a} \\div ${b}$ 商 ${w} 余 ${r}，因为 $${b} \\times ${w} = ${b * w}$。`,
              ],
            ],
            [
              ["Share the remainder", "把余数也平均分"],
              [
                `The ${r} left over shared by ${b} is $${fr(r, b)}$, so the answer is $${mx(w, r, b)}$.`,
                `余下的 ${r} 平均分成 ${b} 份是 $${fr(r, b)}$，所以结果是 $${mx(w, r, b)}$。`,
              ],
            ],
          ],
          [`$${b} \\times ${w} + ${r} = ${a}$.`, `$${b} \\times ${w} + ${r} = ${a}$。`],
          [
            [w, "That leaves out the remainder.", "这漏掉了余数。"],
            [w + r, "That adds the remainder as whole ones. It must be shared too.", "这把余数当成了整数。余数也要平均分。"],
            [qf(w * b + b - r, b), "That uses what is missing to make the divisor, not the remainder.", "这用的是差几到除数，不是余数。"],
          ],
          { form: "mixed" },
        );
      },
      barFigure(5, 17, 4),
    ),
    point(
      "sharing-with-mixed-number-answers",
      ["Sharing with mixed-number answers", "平均分的结果是带分数"],
      [
        "A 7-foot rope is cut into 2 equal pieces. $7 \\div 2 = 3$ with 1 left over. The last foot is cut in half too. So each piece is $3\\frac{1}{2}$ feet long.\n\nCheck: $3\\frac{1}{2} + 3\\frac{1}{2} = 7$ feet.\n\n> **Watch out.** Do not drop the part left over. Each piece is $3\\frac{1}{2}$ feet, not 3.",
        "把一根 7 英尺长的绳子平均剪成 2 段。$7 \\div 2$ 商 3 余 1，剩下的 1 英尺也对半剪开。所以每段长 $3\\frac{1}{2}$ 英尺。\n\n检验：$3\\frac{1}{2} + 3\\frac{1}{2} = 7$ 英尺。\n\n> **注意。** 不要丢掉余下的部分。每段是 $3\\frac{1}{2}$ 英尺，不是 3 英尺。",
      ],
      (rng) => {
        const b = rng.int(2, 8);
        const a = coprimeTo(rng, b, b + 1, 8 * b);
        const w = Math.floor(a / b);
        const r = a % b;
        const rope = rng.bool();
        return answered(
          rope
            ? [
                `A ribbon ${a} feet long is cut into ${b} equal pieces. How many feet long is each piece? Write a mixed number.`,
                `一条 ${a} 英尺长的丝带被平均剪成 ${b} 段。每段长多少英尺？用带分数表示。`,
              ]
            : [
                `${a} pounds of rice are shared equally among ${b} bags. How many pounds go in each bag? Write a mixed number.`,
                `把 ${a} 磅大米平均装进 ${b} 个袋子。每袋装多少磅？用带分数表示。`,
              ],
          qf(a, b),
          [
            [
              ["Divide", "做除法"],
              [`$${a} \\div ${b} = ${w}$ with ${r} left over.`, `$${a} \\div ${b}$ 商 ${w} 余 ${r}。`],
            ],
            [
              ["Share what is left", "把剩下的也平均分"],
              [
                `The ${r} left over gives $${fr(r, b)}$ more each: $${mx(w, r, b)}$.`,
                `剩下的 ${r} 平均分，每份再多 $${fr(r, b)}$：$${mx(w, r, b)}$。`,
              ],
            ],
          ],
          [
            `${b} shares of $${mx(w, r, b)}$ are $${b} \\times ${w} + ${r} = ${a}$.`,
            `${b} 份 $${mx(w, r, b)}$ 合起来是 $${b} \\times ${w} + ${r} = ${a}$。`,
          ],
          [
            [w, "That drops the part left over.", "这丢掉了剩下的部分。"],
            [w + 1, "That rounds up. Each share is less than that.", "这是往上凑整了，每份没有这么多。"],
            [qf(r, b), "That is only the share of what was left over.", "这只是剩下部分平均分的结果。"],
          ],
          { form: "mixed" },
        );
      },
      barFigure(2, 7, 4),
    ),
  ],
  t(
    "17 cups of soup are shared by 5 friends. Each gets 3 cups, and 2 cups are left. Share those 2 cups too: each friend gets $\\frac{2}{5}$ of a cup more. So each gets $3\\frac{2}{5}$ cups.\n\nCheck: $5 \\times 3 = 15$ and $15 + 2 = 17$ cups.\n\nIn this lesson we write the answer of a division as a mixed number.",
    "把 17 杯汤平均分给 5 个朋友。每人先分 3 杯，还剩 2 杯。把这 2 杯也平均分，每人再得 $\\frac{2}{5}$ 杯。所以每人得到 $3\\frac{2}{5}$ 杯。\n\n检验：$5 \\times 3 = 15$，$15 + 2 = 17$ 杯。\n\n本课我们把除法的结果写成带分数。",
  ),
);

export const convertingImproperFractionsToMixedNumbers = topic(
  "converting-improper-fractions-to-mixed-numbers",
  t("Converting Improper Fractions to Mixed Numbers", "把假分数化成带分数"),
  t(
    "To write n/d as a mixed number, divide n by d: the quotient is the whole number and the remainder is the numerator. 17/5: 17 ÷ 5 = 3 R 2, so 17/5 = 3 2/5.",
    "把 n/d 化成带分数，就用 n 除以 d：商是整数部分，余数是分子。17/5：17 ÷ 5 = 3……2，所以 17/5 = 3 2/5。",
  ),
  ["interpreting-division-problems-as-mixed-numbers"],
  ["4.NF.B.3"],
  [
    point(
      "writing-improper-fractions-as-mixed-numbers",
      ["Improper fractions as mixed numbers", "假分数化成带分数"],
      [
        "To write $\\frac{17}{5}$ as a mixed number, divide the top by the bottom: $17 \\div 5 = 3$ with 2 left over. The 3 is the whole number and 2 is the new top: $3\\frac{2}{5}$.\n\nCheck: $3 \\times 5 + 2 = 17$.\n\n> **Watch out.** The bottom number stays 5. Only the top number changes.",
        "把 $\\frac{17}{5}$ 化成带分数，就用分子除以分母：$17 \\div 5$ 商 3 余 2。商 3 是整数部分，余数 2 是新的分子：$3\\frac{2}{5}$。\n\n检验：$3 \\times 5 + 2 = 17$。\n\n> **注意。** 分母还是 5，只有分子变了。",
      ],
      (rng) => {
        const [n, d] = improperFraction(rng, 12, 9);
        const w = Math.floor(n / d);
        const r = n % d;
        return answered(
          [`Write $${fr(n, d)}$ as a mixed number.`, `把 $${fr(n, d)}$ 化成带分数。`],
          qf(n, d),
          [
            [
              ["Divide the top by the bottom", "分子除以分母"],
              [`$${n} \\div ${d} = ${w}$ with ${r} left over.`, `$${n} \\div ${d}$ 商 ${w} 余 ${r}。`],
            ],
            [
              ["Write the mixed number", "写成带分数"],
              [
                `${w} is the whole part and ${r} is the new top: $${mx(w, r, d)}$.`,
                `商 ${w} 是整数部分，余数 ${r} 是分子：$${mx(w, r, d)}$。`,
              ],
            ],
          ],
          [`Multiply back: $${w} \\times ${d} + ${r} = ${n}$.`, `乘回去：$${w} \\times ${d} + ${r} = ${n}$。`],
          [
            [qf(w * d + d - r, d), "That uses what is missing to make a whole, not the remainder.", "这用的是差几份凑成整体，不是余数。"],
            [qf((w - 1) * d + r, d), "That has one whole too few.", "这少了一个整体。"],
            [qf(r * d + w, d), "That swaps the whole part and the remainder.", "这把整数部分和余数弄反了。"],
          ],
          { form: "mixed" },
        );
      },
      barFigure(5, 17, 4),
    ),
    point(
      "improper-fractions-equal-to-whole-numbers",
      ["Whole numbers and missing tops", "化成整数与求分子"],
      [
        "Every 4 fourths make one whole. $\\frac{12}{4}$ is 12 fourths, so it makes $12 \\div 4 = 3$ wholes: $\\frac{12}{4} = 3$.\n\nCheck: $3 \\times 4 = 12$ fourths.\n\n> **Watch out.** Divide the top by the bottom. Taking 4 away from 12 does not give the number of wholes.",
        "每 4 个四分之一组成一个整体。$\\frac{12}{4}$ 是 12 个四分之一，能组成 $12 \\div 4 = 3$ 个整体：$\\frac{12}{4} = 3$。\n\n检验：$3 \\times 4 = 12$ 个四分之一。\n\n> **注意。** 要用分子除以分母。用 12 减去 4 得不到整体的个数。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const w = rng.int(2, 9);
        if (rng.bool(0.4)) {
          return answered(
            [`Write $${fr(w * d, d)}$ as a whole number.`, `把 $${fr(w * d, d)}$ 化成整数。`],
            w,
            [
              [
                ["Find one whole", "找出一个整体"],
                [`Every ${d} parts of $${fr(1, d)}$ make one whole.`, `每 ${d} 个 $${fr(1, d)}$ 组成一个整体。`],
              ],
              [
                ["Divide", "做除法"],
                [`$${w * d} \\div ${d} = ${w}$ wholes.`, `$${w * d} \\div ${d} = ${w}$ 个整体。`],
              ],
            ],
            [`$${w} \\times ${d} = ${w * d}$ parts.`, `$${w} \\times ${d} = ${w * d}$ 份。`],
            [
              [w * d - d, "That takes away one whole's parts instead of dividing.", "这是减去了一个整体的份数，不是做除法。"],
              [w + 1, "That is one whole too many.", "这多了一个整体。"],
              [d, "That is the parts in one whole, not the number of wholes.", "这是一个整体的份数，不是整体的个数。"],
            ],
          );
        }
        const r = rng.int(1, d - 1);
        return answered(
          [
            `Find the missing numerator: $$${fr(w * d + r, d)} = ${w}\\frac{\\square}{${d}}$$`,
            `求缺少的分子：$$${fr(w * d + r, d)} = ${w}\\frac{\\square}{${d}}$$`,
          ],
          r,
          [
            [
              ["Find the parts in the wholes", "求整数部分的份数"],
              [`${w} wholes are $${w} \\times ${d} = ${w * d}$ parts.`, `${w} 个整体是 $${w} \\times ${d} = ${w * d}$ 份。`],
            ],
            [
              ["Find the parts left", "求剩下的份数"],
              [`$${w * d + r} - ${w * d} = ${r}$.`, `$${w * d + r} - ${w * d} = ${r}$。`],
            ],
          ],
          [`$${w} \\times ${d} + ${r} = ${w * d + r}$.`, `$${w} \\times ${d} + ${r} = ${w * d + r}$。`],
          [
            [w * d + r - w, "That takes away the whole number, not the parts in the wholes.", "这减去的是整数，不是整数部分的份数。"],
            [r + d, "That adds a whole's parts instead of taking them away.", "这是加上了一个整体的份数，应该减去。"],
            [d - r, "That is the parts still needed for another whole.", "这是再凑一个整体还差的份数。"],
          ],
        );
      },
      barFigure(4, 12, 3),
    ),
  ],
  t(
    "Lily has 11 quarter-sandwiches, so $\\frac{11}{4}$ sandwiches. Every 4 quarters make a whole sandwich. 8 quarters make 2 sandwiches, and 3 quarters are left: $2\\frac{3}{4}$ sandwiches.\n\nCheck: $2 \\times 4 + 3 = 11$ quarters.\n\nIn this lesson we change improper fractions into mixed numbers and whole numbers.",
    "莉莉有 11 个四分之一块三明治，也就是 $\\frac{11}{4}$ 个三明治。每 4 个四分之一拼成一个三明治。8 个四分之一拼成 2 个，还剩 3 个四分之一：$2\\frac{3}{4}$ 个三明治。\n\n检验：$2 \\times 4 + 3 = 11$ 个四分之一。\n\n本课我们把假分数化成带分数或整数。",
  ),
);

export const convertingMixedNumbersToImproperFractions = topic(
  "converting-mixed-numbers-to-improper-fractions",
  t("Converting Mixed Numbers to Improper Fractions", "把带分数化成假分数"),
  t(
    "To write w r/d as an improper fraction, turn the wholes into parts: w wholes are w × d parts, so w r/d = (w × d + r)/d. For example, 3 2/5 = (15 + 2)/5 = 17/5.",
    "把带分数 w r/d 化成假分数，就把整数部分化成份数：w 个整体是 w × d 份，所以 w r/d = (w × d + r)/d。例如 3 2/5 = (15 + 2)/5 = 17/5。",
  ),
  ["converting-improper-fractions-to-mixed-numbers"],
  ["4.NF.B.3"],
  [
    point(
      "writing-mixed-numbers-as-improper-fractions",
      ["Mixed numbers as improper fractions", "带分数化成假分数"],
      [
        "To write $3\\frac{2}{5}$ as an improper fraction, turn the wholes into fifths. 3 wholes are $3 \\times 5 = 15$ fifths. Add the 2 fifths: 17 fifths, $\\frac{17}{5}$.\n\nCheck: $17 \\div 5 = 3$ with 2 left over, which is $3\\frac{2}{5}$.\n\n> **Watch out.** Multiply the whole number by the bottom number first. $3 + 2$ is not the new top.",
        "把 $3\\frac{2}{5}$ 化成假分数，先把整数化成五分之几：3 个整体是 $3 \\times 5 = 15$ 个五分之一。再加 2 个：一共 17 个五分之一，$\\frac{17}{5}$。\n\n检验：$17 \\div 5$ 商 3 余 2，就是 $3\\frac{2}{5}$。\n\n> **注意。** 要先用整数乘分母。新分子不是 $3 + 2$。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const w = rng.int(1, 9);
        const r = coprimeTo(rng, d, 1, d - 1);
        return answered(
          [`Write $${mx(w, r, d)}$ as an improper fraction.`, `把 $${mx(w, r, d)}$ 化成假分数。`],
          qf(w * d + r, d),
          [
            [
              ["Turn the wholes into parts", "把整数化成份数"],
              [
                `${w} wholes are $${w} \\times ${d} = ${w * d}$ parts of $${fr(1, d)}$.`,
                `${w} 个整体是 $${w} \\times ${d} = ${w * d}$ 个 $${fr(1, d)}$。`,
              ],
            ],
            [
              ["Add the parts", "加上分数部分"],
              [
                `$${w * d} + ${r} = ${w * d + r}$ parts: $${fr(w * d + r, d)}$.`,
                `$${w * d} + ${r} = ${w * d + r}$ 个：$${fr(w * d + r, d)}$。`,
              ],
            ],
          ],
          [
            `$${w * d + r} \\div ${d} = ${w}$ with ${r} left over, which is $${mx(w, r, d)}$.`,
            `$${w * d + r} \\div ${d}$ 商 ${w} 余 ${r}，就是 $${mx(w, r, d)}$。`,
          ],
          [
            [
              qf(w + r, d),
              "That adds the whole number to the top. Each whole is many parts.",
              "这把整数直接加到分子上。每个整体有好几份。",
            ],
            [qf(w * r + d, d), "That multiplies the whole number by the top, not the bottom.", "这用整数乘了分子，应该乘分母。"],
            [qf(w * d * r, d), "That multiplies by the top instead of adding it.", "这把分子乘了进去，应该加上。"],
          ],
          { form: "fraction" },
        );
      },
      barFigure(5, 17, 4),
    ),
    point(
      "missing-numerators-of-improper-fractions",
      ["The missing top number", "求假分数的分子"],
      [
        "To fill the box in $2\\frac{3}{4} = \\frac{\\square}{4}$, count the fourths. 2 wholes are $2 \\times 4 = 8$ fourths, and 3 more make 11. The box is 11.\n\nCheck: $11 \\div 4 = 2$ with 3 left over.\n\n> **Watch out.** Do not forget the 3 fourths of the fraction part. The box is 11, not 8.",
        "求 $2\\frac{3}{4} = \\frac{\\square}{4}$ 中的方框，就数有几个四分之一。2 个整体是 $2 \\times 4 = 8$ 个，再加 3 个是 11 个。方框里填 11。\n\n检验：$11 \\div 4$ 商 2 余 3。\n\n> **注意。** 别忘了分数部分的 3 个四分之一。方框里是 11，不是 8。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const w = rng.int(1, 9);
        const r = rng.int(1, d - 1);
        return answered(
          [
            `Find the missing numerator: $$${mx(w, r, d)} = \\frac{\\square}{${d}}$$`,
            `求缺少的分子：$$${mx(w, r, d)} = \\frac{\\square}{${d}}$$`,
          ],
          w * d + r,
          [
            [
              ["Turn the wholes into parts", "把整数化成份数"],
              [`${w} wholes are $${w} \\times ${d} = ${w * d}$ parts.`, `${w} 个整体是 $${w} \\times ${d} = ${w * d}$ 份。`],
            ],
            [
              ["Add the parts", "加上分数部分"],
              [`$${w * d} + ${r} = ${w * d + r}$.`, `$${w * d} + ${r} = ${w * d + r}$。`],
            ],
          ],
          [`$${w * d + r} \\div ${d} = ${w}$ with ${r} left over.`, `$${w * d + r} \\div ${d}$ 商 ${w} 余 ${r}。`],
          [
            [w + r, "That adds the whole number to the top.", "这把整数直接加到了分子上。"],
            [w * r + d, "That multiplies the whole number by the top, not the bottom.", "这用整数乘了分子，应该乘分母。"],
            [w * d, "That leaves out the parts of the fraction part.", "这漏掉了分数部分的份数。"],
          ],
        );
      },
      barFigure(4, 11, 3),
    ),
  ],
  t(
    "Max has $2\\frac{1}{3}$ pies and cuts every pie into thirds. Each whole pie gives 3 pieces, so 2 pies give 6. With 1 more piece he has 7 thirds: $\\frac{7}{3}$.\n\nCheck: $7 \\div 3 = 2$ with 1 left over, which is $2\\frac{1}{3}$.\n\nIn this lesson we change mixed numbers into improper fractions.",
    "马克斯有 $2\\frac{1}{3}$ 个馅饼，把每个都切成三等份。每个整馅饼切成 3 块，2 个切成 6 块，再加 1 块，一共 7 个三分之一：$\\frac{7}{3}$。\n\n检验：$7 \\div 3$ 商 2 余 1，就是 $2\\frac{1}{3}$。\n\n本课我们把带分数化成假分数。",
  ),
);

// ---------------------------------------------------------------------------
// Equivalent fractions

export const findingEquivalentFractionsUsingAreaModels = topic(
  "finding-equivalent-fractions-using-area-models",
  t("Finding Equivalent Fractions Using Area Models", "用面积模型找等值分数"),
  t(
    "Cutting every part of a model into k smaller equal parts multiplies both the number of parts and the number of shaded parts by k, without changing the shaded amount: 2/3 = 8/12.",
    "把模型的每一份再平均分成 k 小份，总份数和涂色份数都乘 k，而涂色部分的大小不变：2/3 = 8/12。",
  ),
  ["fraction-models"],
  ["4.NF.A.1"],
  [
    point(
      "equivalent-fractions-from-two-bars",
      ["Two bars of the same size", "两个同样大的长条"],
      [
        "The first bar shows $\\frac{2}{3}$. The second bar is the same size, cut into 6 parts, so each third is 2 small parts. To shade the same amount, shade $2 \\times 2 = 4$ parts: $\\frac{2}{3} = \\frac{4}{6}$.\n\nCheck: the 4 shaded parts end exactly where the 2 shaded thirds end.\n\n> **Watch out.** Multiply, do not add. Shading $2 + 2$ only works here by chance. For $\\frac{2}{3}$ in ninths you need $2 \\times 3 = 6$ parts, not $2 + 3 = 5$.",
        "第一个长条表示 $\\frac{2}{3}$。第二个长条一样大，平均分成 6 份，所以每个三分之一是 2 小份。要涂同样多，就涂 $2 \\times 2 = 4$ 份：$\\frac{2}{3} = \\frac{4}{6}$。\n\n检验：涂色的 4 小份正好和涂色的 2 个三分之一一样长。\n\n> **注意。** 要用乘法，不是加法。这里 $2 + 2$ 只是碰巧对。$\\frac{2}{3}$ 用九分之几表示时要涂 $2 \\times 3 = 6$ 份，不是 $2 + 3 = 5$ 份。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 6);
        const k = rng.int(2, Math.floor(24 / d));
        return answered(
          [
            `The two bars are the same size. The first shows $${fr(n, d)}$. How many parts of the second bar must be shaded to show the same amount?`,
            `两个长条一样大。第一个表示 $${fr(n, d)}$。第二个长条要涂几份才能表示同样多？`,
          ],
          n * k,
          [
            [
              ["Match the parts", "对照每份"],
              [
                `The second bar has $${d * k} \\div ${d} = ${k}$ small parts under each part of the first.`,
                `第二个长条有 $${d * k} \\div ${d} = ${k}$ 小份对着第一个长条的每一份。`,
              ],
            ],
            [
              ["Multiply", "用乘法"],
              [
                `$${n} \\times ${k} = ${n * k}$ small parts: $${fr(n, d)} = ${fr(n * k, d * k)}$.`,
                `$${n} \\times ${k} = ${n * k}$ 小份：$${fr(n, d)} = ${fr(n * k, d * k)}$。`,
              ],
            ],
          ],
          [
            `Dividing both numbers by ${k} gives back $${fr(n, d)}$: $${n * k} \\div ${k} = ${n}$ and $${d * k} \\div ${k} = ${d}$.`,
            `分子分母都除以 ${k} 又得到 $${fr(n, d)}$：$${n * k} \\div ${k} = ${n}$，$${d * k} \\div ${k} = ${d}$。`,
          ],
          [
            [n + k, "That adds instead of multiplying.", "这用了加法，应该用乘法。"],
            [n * k + 1, "That shades one small part too many.", "这多涂了一小份。"],
            [d * k - n * k, "That counts the small parts that are not shaded.", "这数的是没涂色的小份。"],
          ],
          { figure: twoBarsFigure(d, n, d * k, 0) },
        );
      },
      twoBarsFigure(3, 2, 6, 4),
    ),
    point(
      "equivalent-fractions-from-grids",
      ["Cutting a rectangle into rows", "把长方形再分成几行"],
      [
        "This rectangle shows $\\frac{2}{3}$: 2 of 3 columns are shaded. Cut it into 4 rows. Now there are $3 \\times 4 = 12$ small rectangles, and $2 \\times 4 = 8$ are shaded. So $\\frac{2}{3} = \\frac{8}{12}$.\n\nCheck: the shaded part has not changed size, only the cuts.\n\n> **Watch out.** Both numbers are multiplied by the number of rows. Do not change only the bottom number.",
        "这个长方形表示 $\\frac{2}{3}$：3 列中涂了 2 列。再把它分成 4 行。现在一共有 $3 \\times 4 = 12$ 个小长方形，其中 $2 \\times 4 = 8$ 个涂色。所以 $\\frac{2}{3} = \\frac{8}{12}$。\n\n检验：涂色部分的大小没有变，只是多切了几刀。\n\n> **注意。** 分子和分母都要乘行数，不能只改分母。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 6);
        const k = rng.int(2, 5);
        const askNum = rng.bool();
        return answered(
          askNum
            ? [
                `The model shows $${fr(n, d)}$ cut into rows. Fill in the box: $$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`,
                `模型表示 $${fr(n, d)}$，并被分成了几行。填空：$$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`,
              ]
            : [
                `The model shows $${fr(n, d)}$ cut into rows. Fill in the box: $$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`,
                `模型表示 $${fr(n, d)}$，并被分成了几行。填空：$$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`,
              ],
          askNum ? n * k : d * k,
          [
            [
              ["Count the rows", "数行数"],
              [
                `The rectangle is cut into ${k} rows, so each column is ${k} small rectangles.`,
                `长方形分成了 ${k} 行，每列有 ${k} 个小长方形。`,
              ],
            ],
            [
              ["Multiply both numbers", "分子分母都乘"],
              [
                `$${n} \\times ${k} = ${n * k}$ shaded out of $${d} \\times ${k} = ${d * k}$: $${fr(n * k, d * k)}$.`,
                `涂色 $${n} \\times ${k} = ${n * k}$ 个，一共 $${d} \\times ${k} = ${d * k}$ 个：$${fr(n * k, d * k)}$。`,
              ],
            ],
          ],
          [
            `$${n * k} \\div ${k} = ${n}$ and $${d * k} \\div ${k} = ${d}$, which gives back $${fr(n, d)}$.`,
            `$${n * k} \\div ${k} = ${n}$，$${d * k} \\div ${k} = ${d}$，又得到 $${fr(n, d)}$。`,
          ],
          askNum
            ? [
                [n + k, "That adds the rows instead of multiplying.", "这把行数加上了，应该乘。"],
                [n * d, "That multiplies the top by the bottom.", "这把分子和分母乘了起来。"],
                [d * k - n * k, "That counts the small rectangles that are not shaded.", "这数的是没涂色的小长方形。"],
              ]
            : [
                [d + k, "That adds the rows instead of multiplying.", "这把行数加上了，应该乘。"],
                [d * k + n, "That adds the old top to the new bottom.", "这把原来的分子加到了新分母上。"],
                [n * k + d, "That adds the old bottom to the new top.", "这把原来的分母加到了新分子上。"],
              ],
          { figure: gridFigure(n, d, k) },
        );
      },
      gridFigure(2, 3, 4),
    ),
  ],
  t(
    "Ben and Ana have chocolate bars of the same size. Ben cuts his into 2 equal parts and eats 1. Ana cuts hers into 4 equal parts and eats 2. They ate the same amount: $\\frac{1}{2} = \\frac{2}{4}$.\n\nCheck: in the two bars, the shaded parts line up exactly.\n\nIn this lesson we use bars and rectangles to find equivalent fractions, fractions that name the same amount.",
    "本和安娜的巧克力一样大。本把他的平均分成 2 份，吃了 1 份；安娜把她的平均分成 4 份，吃了 2 份。他们吃得一样多：$\\frac{1}{2} = \\frac{2}{4}$。\n\n检验：两个长条中涂色的部分正好一样长。\n\n本课我们用长条和长方形找等值分数，也就是表示同样多的分数。",
  ),
);

export const equivalentFractionsByMultiplyingAndDividing = topic(
  "equivalent-fractions-by-multiplying-and-dividing",
  t("Equivalent Fractions by Multiplying and Dividing", "用乘除法求等值分数"),
  t(
    "Multiplying or dividing the numerator and the denominator by the same number (not 0) gives an equivalent fraction: 3/4 = (3 × 5)/(4 × 5) = 15/20, and 12/18 = (12 ÷ 6)/(18 ÷ 6) = 2/3.",
    "分子和分母同时乘或除以同一个数（0 除外），得到的分数与原分数相等：3/4 = (3 × 5)/(4 × 5) = 15/20，12/18 = (12 ÷ 6)/(18 ÷ 6) = 2/3。",
  ),
  ["finding-equivalent-fractions-using-area-models", "greatest-common-factor-by-listing"],
  ["4.NF.A.1"],
  [
    point(
      "scaling-up-numerator-and-denominator",
      ["Multiplying both parts", "分子分母同乘一个数"],
      [
        "To fill $\\frac{3}{4} = \\frac{\\square}{8}$, see how the bottom changed: $4 \\times 2 = 8$. Do the same to the top: $3 \\times 2 = 6$. So $\\frac{3}{4} = \\frac{6}{8}$.\n\nCheck: the strips show $\\frac{3}{4}$ and $\\frac{6}{8}$ are the same length.\n\n> **Watch out.** Multiply the top by the same number, 2. Adding 4 to the top, as the bottom went up by 4, gives $\\frac{7}{8}$, which is wrong.",
        "求 $\\frac{3}{4} = \\frac{\\square}{8}$，先看分母怎么变：$4 \\times 2 = 8$。分子也同样乘 2：$3 \\times 2 = 6$。所以 $\\frac{3}{4} = \\frac{6}{8}$。\n\n检验：分数条上 $\\frac{3}{4}$ 和 $\\frac{6}{8}$ 一样长。\n\n> **注意。** 分子要乘同一个数 2。分母加了 4，就给分子也加 4，得到 $\\frac{7}{8}$，这是错的。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 12);
        const k = rng.int(2, 10);
        const askNum = rng.bool(0.7);
        return answered(
          askNum
            ? [`Fill in the box: $$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`, `填空：$$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`]
            : [`Fill in the box: $$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`, `填空：$$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`],
          askNum ? n * k : d * k,
          [
            [
              ["Find the number used", "找出乘的数"],
              askNum
                ? [
                    `The bottom went from ${d} to ${d * k}: $${d} \\times ${k} = ${d * k}$.`,
                    `分母从 ${d} 变成 ${d * k}：$${d} \\times ${k} = ${d * k}$。`,
                  ]
                : [
                    `The top went from ${n} to ${n * k}: $${n} \\times ${k} = ${n * k}$.`,
                    `分子从 ${n} 变成 ${n * k}：$${n} \\times ${k} = ${n * k}$。`,
                  ],
            ],
            [
              ["Do the same to the other part", "另一个也乘这个数"],
              askNum
                ? [`$${n} \\times ${k} = ${n * k}$.`, `$${n} \\times ${k} = ${n * k}$。`]
                : [`$${d} \\times ${k} = ${d * k}$.`, `$${d} \\times ${k} = ${d * k}$。`],
            ],
          ],
          [
            `$${fr(n * k, d * k)}$ divided by ${k} on top and bottom gives back $${fr(n, d)}$.`,
            `$${fr(n * k, d * k)}$ 的分子分母同除以 ${k}，又得到 $${fr(n, d)}$。`,
          ],
          askNum
            ? [
                [
                  n + d * k - d,
                  "That adds to the top what was added to the bottom. Multiply instead.",
                  "这是分母加多少分子也加多少。应该用乘法。",
                ],
                [n * d, "That multiplies the top by the old bottom.", "这用分子乘了原来的分母。"],
                [d * k - n, "That takes the top away from the new bottom.", "这是用新分母减去分子。"],
              ]
            : [
                [
                  d + n * k - n,
                  "That adds to the bottom what was added to the top. Multiply instead.",
                  "这是分子加多少分母也加多少。应该用乘法。",
                ],
                [n * k * d, "That multiplies the new top by the old bottom.", "这用新分子乘了原来的分母。"],
                [n * k + d, "That adds the old bottom to the new top.", "这把原来的分母加到了新分子上。"],
              ],
        );
      },
      stripsFigure([
        { parts: 4, shaded: 3, text: "3/4" },
        { parts: 8, shaded: 6, text: "6/8" },
      ]),
    ),
    point(
      "scaling-down-numerator-and-denominator",
      ["Dividing both parts", "分子分母同除以一个数"],
      [
        "To fill $\\frac{6}{8} = \\frac{\\square}{4}$, see how the bottom changed: $8 \\div 2 = 4$. Do the same to the top: $6 \\div 2 = 3$. So $\\frac{6}{8} = \\frac{3}{4}$.\n\nCheck: $3 \\times 2 = 6$ and $4 \\times 2 = 8$.\n\n> **Watch out.** Divide the top by the same number. Taking 4 away from the top, as the bottom went down by 4, gives $\\frac{2}{4}$, which is wrong.",
        "求 $\\frac{6}{8} = \\frac{\\square}{4}$，先看分母怎么变：$8 \\div 2 = 4$。分子也同样除以 2：$6 \\div 2 = 3$。所以 $\\frac{6}{8} = \\frac{3}{4}$。\n\n检验：$3 \\times 2 = 6$，$4 \\times 2 = 8$。\n\n> **注意。** 分子要除以同一个数。分母减了 4，就给分子也减 4，得到 $\\frac{2}{4}$，这是错的。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 12);
        const k = rng.int(2, 9);
        return answered(
          [`Fill in the box: $$${fr(n * k, d * k)} = \\frac{\\square}{${d}}$$`, `填空：$$${fr(n * k, d * k)} = \\frac{\\square}{${d}}$$`],
          n,
          [
            [
              ["Find the number used", "找出除的数"],
              [
                `The bottom went from ${d * k} to ${d}: $${d * k} \\div ${k} = ${d}$.`,
                `分母从 ${d * k} 变成 ${d}：$${d * k} \\div ${k} = ${d}$。`,
              ],
            ],
            [
              ["Do the same to the top", "分子也除以这个数"],
              [`$${n * k} \\div ${k} = ${n}$.`, `$${n * k} \\div ${k} = ${n}$。`],
            ],
          ],
          [
            `$${n} \\times ${k} = ${n * k}$ and $${d} \\times ${k} = ${d * k}$.`,
            `$${n} \\times ${k} = ${n * k}$，$${d} \\times ${k} = ${d * k}$。`,
          ],
          [
            [
              n * k - (d * k - d),
              "That takes away from the top what was taken from the bottom. Divide instead.",
              "这是分母减多少分子也减多少。应该用除法。",
            ],
            [n * k, "That leaves the top as it was.", "这没有改分子。"],
            [d - n, "That is the parts not shaded.", "这是没涂色的份数。"],
          ],
        );
      },
      stripsFigure([
        { parts: 8, shaded: 6, text: "6/8" },
        { parts: 4, shaded: 3, text: "3/4" },
      ]),
    ),
  ],
  t(
    "A recipe needs $\\frac{3}{4}$ cup of milk, but the measuring cup is marked in eighths. Each fourth is 2 eighths, so $\\frac{3}{4} = \\frac{6}{8}$: fill it to the 6.\n\nCheck: $6 \\div 2 = 3$ and $8 \\div 2 = 4$, which gives back $\\frac{3}{4}$.\n\nIn this lesson we find equivalent fractions by multiplying or dividing the top and bottom by the same number.",
    "食谱要用 $\\frac{3}{4}$ 杯牛奶，可量杯上的刻度是八分之几。每个四分之一是 2 个八分之一，所以 $\\frac{3}{4} = \\frac{6}{8}$：倒到 6 的刻度。\n\n检验：$6 \\div 2 = 3$，$8 \\div 2 = 4$，又得到 $\\frac{3}{4}$。\n\n本课我们把分子和分母同时乘或除以同一个数，得到等值分数。",
  ),
);

export const leastCommonDenominators = topic(
  "least-common-denominators",
  t("Least Common Denominators", "最小公分母"),
  t(
    "The least common denominator of two fractions is the least common multiple of their denominators. For 3/4 and 5/6 it is 12, and the fractions become 9/12 and 10/12.",
    "两个分数的最小公分母是它们分母的最小公倍数。3/4 和 5/6 的最小公分母是 12，两个分数分别化为 9/12 和 10/12。",
  ),
  ["equivalent-fractions-by-multiplying-and-dividing", "least-common-multiple-by-listing"],
  ["4.NF.A.2"],
  [
    point(
      "finding-least-common-denominators",
      ["Finding the least common denominator", "求最小公分母"],
      [
        "For $\\frac{3}{4}$ and $\\frac{5}{6}$, list the multiples of the larger bottom number, 6: 6, 12, 18. The first one that 4 also goes into is 12. So the least common denominator is 12.\n\nCheck: in the bars, steps of 4 and steps of 6 first meet at 12.\n\n> **Watch out.** $4 \\times 6 = 24$ also works, but it is not the least.",
        "求 $\\frac{3}{4}$ 和 $\\frac{5}{6}$ 的最小公分母，先列出较大分母 6 的倍数：6、12、18。第一个也能被 4 整除的是 12。所以最小公分母是 12。\n\n检验：长条中每段 4 和每段 6 第一次对齐在 12。\n\n> **注意。** $4 \\times 6 = 24$ 也是公分母，但不是最小的。",
      ],
      (rng) => {
        let b: number;
        let d: number;
        do {
          b = rng.int(2, 12);
          d = rng.int(2, 12);
        } while (b === d || lcm(b, d) > 60);
        const [a, c] = [coprimeTo(rng, b, 1, b - 1), coprimeTo(rng, d, 1, d - 1)];
        const l = lcm(b, d);
        const big = Math.max(b, d);
        const small = Math.min(b, d);
        const list = Array.from({ length: l / big }, (_, i) => big * (i + 1));
        return answered(
          [`Find the least common denominator of $${fr(a, b)}$ and $${fr(c, d)}$.`, `求 $${fr(a, b)}$ 和 $${fr(c, d)}$ 的最小公分母。`],
          l,
          [
            [
              ["List the multiples", "列出倍数"],
              [`Multiples of ${big}: ${list.join(", ")}.`, `${big} 的倍数：${list.join("、")}。`],
            ],
            [
              ["Find the first shared one", "找第一个公倍数"],
              [`The first that ${small} also goes into is ${l}.`, `第一个也能被 ${small} 整除的是 ${l}。`],
            ],
          ],
          [
            `$${l} \\div ${b} = ${l / b}$ and $${l} \\div ${d} = ${l / d}$, with nothing left over.`,
            `$${l} \\div ${b} = ${l / b}$，$${l} \\div ${d} = ${l / d}$，都没有余数。`,
          ],
          [
            [
              b * d,
              "That multiplies the bottoms. It is a common denominator, but not the least.",
              "这是两个分母的积，是公分母，但不是最小的。",
            ],
            [big, `That is the larger bottom, but ${small} does not go into it.`, `这是较大的分母，可它不能被 ${small} 整除。`],
            [b + d, "That adds the bottoms.", "这是把两个分母相加。"],
          ],
        );
      },
      meetTapes([4, 6], 12),
    ),
    point(
      "rewriting-with-the-least-common-denominator",
      ["Rewriting with the LCD", "化成以最小公分母为分母的分数"],
      [
        "The least common denominator of $\\frac{3}{4}$ and $\\frac{5}{6}$ is 12. To write $\\frac{3}{4}$ in twelfths, see that $4 \\times 3 = 12$, so multiply the top by 3 too: $\\frac{3}{4} = \\frac{9}{12}$.\n\nCheck: $9 \\div 3 = 3$ and $12 \\div 3 = 4$.\n\n> **Watch out.** Multiply the top by $12 \\div 4 = 3$, not by the other bottom number 6.",
        "$\\frac{3}{4}$ 和 $\\frac{5}{6}$ 的最小公分母是 12。把 $\\frac{3}{4}$ 写成十二分之几：$4 \\times 3 = 12$，分子也乘 3：$\\frac{3}{4} = \\frac{9}{12}$。\n\n检验：$9 \\div 3 = 3$，$12 \\div 3 = 4$。\n\n> **注意。** 分子要乘 $12 \\div 4 = 3$，不是乘另一个分母 6。",
      ],
      (rng) => {
        let b: number;
        let d: number;
        do {
          b = rng.int(2, 12);
          d = rng.int(2, 12);
        } while (b === d || lcm(b, d) > 60 || lcm(b, d) === b);
        const [a, c] = [coprimeTo(rng, b, 1, b - 1), coprimeTo(rng, d, 1, d - 1)];
        const l = lcm(b, d);
        return answered(
          [
            `Rewrite $${fr(a, b)}$ with the least common denominator of $${fr(a, b)}$ and $${fr(c, d)}$: $$${fr(a, b)} = \\frac{\\square}{${l}}$$`,
            `用 $${fr(a, b)}$ 和 $${fr(c, d)}$ 的最小公分母改写 $${fr(a, b)}$：$$${fr(a, b)} = \\frac{\\square}{${l}}$$`,
          ],
          (a * l) / b,
          [
            [
              ["Find the number used", "找出乘的数"],
              [
                `$${l} \\div ${b} = ${l / b}$, so the bottom is multiplied by ${l / b}.`,
                `$${l} \\div ${b} = ${l / b}$，分母乘了 ${l / b}。`,
              ],
            ],
            [
              ["Multiply the top", "分子也乘"],
              [`$${a} \\times ${l / b} = ${(a * l) / b}$.`, `$${a} \\times ${l / b} = ${(a * l) / b}$。`],
            ],
          ],
          [
            `$${(a * l) / b} \\div ${l / b} = ${a}$ and $${l} \\div ${l / b} = ${b}$.`,
            `$${(a * l) / b} \\div ${l / b} = ${a}$，$${l} \\div ${l / b} = ${b}$。`,
          ],
          [
            [a + l - b, "That adds to the top instead of multiplying.", "这是给分子加了数，应该乘。"],
            [
              a * d,
              `That multiplies the top by the other bottom, ${d}, not by ${l / b}.`,
              `这用分子乘了另一个分母 ${d}，应该乘 ${l / b}。`,
            ],
            [(c * l) / d, "That rewrites the other fraction.", "这改写的是另一个分数。"],
          ],
        );
      },
      stripsFigure([
        { parts: 4, shaded: 3, text: "3/4" },
        { parts: 12, shaded: 9, text: "9/12" },
      ]),
    ),
  ],
  t(
    "Mia ran $\\frac{1}{4}$ of a mile and Leo ran $\\frac{1}{6}$ of a mile. To compare them, cut both into twelfths: $\\frac{1}{4} = \\frac{3}{12}$ and $\\frac{1}{6} = \\frac{2}{12}$. 12 is the smallest number that both 4 and 6 go into.\n\nCheck: $12 \\div 4 = 3$ and $12 \\div 6 = 2$, with nothing left over.\n\nIn this lesson we find the least common denominator of two fractions.",
    "米娅跑了 $\\frac{1}{4}$ 英里，利奥跑了 $\\frac{1}{6}$ 英里。要比较，就都化成十二分之几：$\\frac{1}{4} = \\frac{3}{12}$，$\\frac{1}{6} = \\frac{2}{12}$。12 是 4 和 6 都能整除的最小的数。\n\n检验：$12 \\div 4 = 3$，$12 \\div 6 = 2$，都没有余数。\n\n本课我们求两个分数的最小公分母。",
  ),
);

export const writingFractionsInLowestTerms = topic(
  "writing-fractions-in-lowest-terms",
  t("Writing Fractions in Lowest Terms", "把分数化成最简分数"),
  t(
    "A fraction is in lowest terms when its numerator and denominator have no common factor other than 1. To get there, divide both by their greatest common factor: 18/24 = (18 ÷ 6)/(24 ÷ 6) = 3/4.",
    "分子和分母除了 1 以外没有其他公因数的分数叫最简分数。把分子和分母同时除以它们的最大公因数就得到最简分数：18/24 = (18 ÷ 6)/(24 ÷ 6) = 3/4。",
  ),
  ["equivalent-fractions-by-multiplying-and-dividing"],
  ["4.NF.A.1"],
  [
    point(
      "simplifying-by-the-greatest-common-factor",
      ["Dividing by the greatest common factor", "除以最大公因数"],
      [
        "To write $\\frac{18}{24}$ in lowest terms, find the greatest common factor of 18 and 24. It is 6. Divide both by 6: $18 \\div 6 = 3$ and $24 \\div 6 = 4$, so $\\frac{18}{24} = \\frac{3}{4}$.\n\nCheck: 3 and 4 have no common factor but 1, so we are done.\n\n> **Watch out.** Divide the top and bottom by the same number. Dividing only the top changes the amount.",
        "把 $\\frac{18}{24}$ 化成最简分数，先找 18 和 24 的最大公因数，是 6。分子分母同时除以 6：$18 \\div 6 = 3$，$24 \\div 6 = 4$，所以 $\\frac{18}{24} = \\frac{3}{4}$。\n\n检验：3 和 4 除了 1 没有别的公因数，已经是最简分数。\n\n> **注意。** 分子分母要同时除以同一个数。只除分子会改变分数的大小。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 12);
        const k = rng.int(2, 9);
        const misses: Miss[] = [
          [qf(d, n), "That swaps the top and the bottom numbers.", "这把分子和分母弄反了。"],
          [qf(n, d * k), "That divides only the top.", "这只除了分子。"],
        ];
        if (n > 1)
          misses.push([
            qf(n - 1, d - 1),
            "That takes the same number away from top and bottom. That changes the amount.",
            "这是分子分母减去同一个数，分数大小就变了。",
          ]);
        return answered(
          [`Write $${fr(n * k, d * k)}$ in lowest terms.`, `把 $${fr(n * k, d * k)}$ 化成最简分数。`],
          qf(n, d),
          [
            [
              ["Find the greatest common factor", "找最大公因数"],
              [`The greatest common factor of ${n * k} and ${d * k} is ${k}.`, `${n * k} 和 ${d * k} 的最大公因数是 ${k}。`],
            ],
            [
              ["Divide both", "同时除以它"],
              [
                `$${n * k} \\div ${k} = ${n}$ and $${d * k} \\div ${k} = ${d}$: $${fr(n, d)}$.`,
                `$${n * k} \\div ${k} = ${n}$，$${d * k} \\div ${k} = ${d}$：$${fr(n, d)}$。`,
              ],
            ],
          ],
          [
            `${n} and ${d} have no common factor but 1, and $${n} \\times ${k} = ${n * k}$, $${d} \\times ${k} = ${d * k}$.`,
            `${n} 和 ${d} 除了 1 没有别的公因数，而且 $${n} \\times ${k} = ${n * k}$，$${d} \\times ${k} = ${d * k}$。`,
          ],
          misses,
          { form: "fraction" },
        );
      },
      stripsFigure([
        { parts: 8, shaded: 6, text: "6/8" },
        { parts: 4, shaded: 3, text: "3/4" },
      ]),
    ),
    point(
      "recognizing-lowest-terms",
      ["Which fraction is in lowest terms?", "哪个是最简分数"],
      [
        "A fraction is in lowest terms when the top and bottom have no common factor but 1. $\\frac{5}{8}$ is: 5 and 8 share only 1. $\\frac{6}{9}$ is not: 6 and 9 both divide by 3.\n\nCheck: $\\frac{6}{9} = \\frac{2}{3}$, a smaller pair of numbers, but $\\frac{5}{8}$ cannot get smaller.\n\n> **Watch out.** Look at the top and bottom together. An even bottom alone does not stop a fraction being in lowest terms.",
        "分子和分母除了 1 没有别的公因数，就是最简分数。$\\frac{5}{8}$ 是：5 和 8 的公因数只有 1。$\\frac{6}{9}$ 不是：6 和 9 都能被 3 整除。\n\n检验：$\\frac{6}{9} = \\frac{2}{3}$，还能约小；$\\frac{5}{8}$ 不能再约了。\n\n> **注意。** 要同时看分子和分母。分母是偶数不代表就不是最简分数。",
      ],
      (rng) => {
        const [n, d] = properFraction(rng, 20, 5);
        const wrong: [string, string, string][] = [];
        while (wrong.length < 3) {
          const [m, e] = properFraction(rng, 10, 2);
          const k = rng.int(2, 4);
          const cand = fr(m * k, e * k);
          if (!wrong.some((w) => w[0] === cand))
            wrong.push([
              cand,
              `${m * k} and ${e * k} both divide by ${k}: it is $${fr(m, e)}$.`,
              `${m * k} 和 ${e * k} 都能被 ${k} 整除：它等于 $${fr(m, e)}$。`,
            ]);
        }
        return pickedMath(
          rng,
          ["Which of these fractions is in lowest terms?", "下面哪个分数是最简分数？"],
          fr(n, d),
          wrong,
          [
            [
              ["Look for a common factor", "找公因数"],
              [`Every other choice has a top and bottom that share a factor greater than 1.`, `其他选项的分子分母都有大于 1 的公因数。`],
            ],
            [
              ["Test the answer", "检查答案"],
              [
                `${n} and ${d} share no factor but 1, so $${fr(n, d)}$ is in lowest terms.`,
                `${n} 和 ${d} 除了 1 没有别的公因数，所以 $${fr(n, d)}$ 是最简分数。`,
              ],
            ],
          ],
          [`The greatest common factor of ${n} and ${d} is ${gcd(n, d)}.`, `${n} 和 ${d} 的最大公因数是 ${gcd(n, d)}。`],
        );
      },
      stripsFigure([
        { parts: 9, shaded: 6, text: "6/9" },
        { parts: 3, shaded: 2, text: "2/3" },
      ]),
    ),
  ],
  t(
    "A pizza is cut into 8 slices and 6 are eaten: $\\frac{6}{8}$ of the pizza. With 4 bigger slices, 3 would be eaten: $\\frac{3}{4}$. It is the same amount with smaller numbers.\n\nCheck: $3 \\times 2 = 6$ and $4 \\times 2 = 8$.\n\nIn this lesson we write fractions in lowest terms.",
    "一个比萨切成 8 块，吃了 6 块：这个比萨的 $\\frac{6}{8}$。如果切成 4 大块，就是吃了 3 块：$\\frac{3}{4}$。吃的一样多，数却更小。\n\n检验：$3 \\times 2 = 6$，$4 \\times 2 = 8$。\n\n本课我们把分数化成最简分数。",
  ),
);

// ---------------------------------------------------------------------------
// Comparing fractions

/** compareSigns asks which of <, = and > goes between two expressions, with a reason for each wrong symbol. */
function compareSigns(rng: Rng, a: string, b: string, rel: number, walk: readonly Walk[], check: Pair, figure?: Figure): Problem {
  const sign = symbols[rel]!;
  const why = (s: string): Pair =>
    rel === 1
      ? s === "<"
        ? ["The two are equal, so the first is not smaller.", "两个数相等，第一个并不更小。"]
        : ["The two are equal, so the first is not larger.", "两个数相等，第一个并不更大。"]
      : s === "="
        ? ["The two are not equal.", "两个数不相等。"]
        : ["That has the order the wrong way round.", "这把大小关系弄反了。"];
  return pickedMath(
    rng,
    [`Which symbol makes this true? $$${a} \\ \\square \\ ${b}$$`, `方框中应填哪个符号？$$${a} \\ \\square \\ ${b}$$`],
    sign,
    symbols.filter((s) => s !== sign).map((s): [string, string, string] => [s, why(s)[0], why(s)[1]]),
    walk,
    check,
    figure,
  );
}

/** pointsLine is a number line from 0 to `hi` with whole numbers labelled and fractions marked above it. */
const pointsLine = (hi: number, marks: readonly [number, number][]): Figure =>
  lineFigure(
    {
      lo: 0,
      hi,
      step: 1,
      labels: Array.from({ length: hi + 1 }, (_, i) => i),
      marks: marks.map(([n, d]) => ({ at: n / d, text: `${n}/${d}` })),
    },
    [
      `A number line from 0 to ${hi} with ${marks.map(([n, d]) => `${n}/${d}`).join(" and ")} marked.`,
      `一条从 0 到 ${hi} 的数轴，标出了 ${marks.map(([n, d]) => `${n}/${d}`).join(" 和 ")}。`,
    ],
  );

export const comparingFractions = topic(
  "comparing-fractions",
  t("Comparing Fractions", "比较分数的大小"),
  t(
    "Fractions with the same denominator have parts of the same size, so the one with more parts is greater: 5/8 > 3/8. Fractions with the same numerator have the same number of parts, so the one with larger parts (the smaller denominator) is greater: 3/5 > 3/8.",
    "分母相同的分数，每份一样大，份数多的分数大：5/8 > 3/8。分子相同的分数，份数一样多，每份越大（分母越小）的分数越大：3/5 > 3/8。",
  ),
  ["fraction-models"],
  ["3.NF.A.3"],
  [
    point(
      "comparing-fractions-with-like-denominators",
      ["The same denominator", "分母相同"],
      [
        "$\\frac{5}{8}$ and $\\frac{3}{8}$ have the same bottom number, so their parts are the same size. 5 parts are more than 3 parts, so $\\frac{5}{8} > \\frac{3}{8}$.\n\nCheck: on the bars, the 5 shaded parts reach further than the 3.\n\n> **Watch out.** With the same bottom number, just compare the top numbers. The bottom 8 does not decide anything here.",
        "$\\frac{5}{8}$ 和 $\\frac{3}{8}$ 的分母相同，每份一样大。5 份比 3 份多，所以 $\\frac{5}{8} > \\frac{3}{8}$。\n\n检验：在长条上，涂色的 5 份比 3 份长。\n\n> **注意。** 分母相同时只比较分子。这里的分母 8 不起作用。",
      ],
      (rng) => {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 1);
        const b = rng.bool(0.15) ? a : rng.int(1, d - 1);
        const rel = relation(qf(a, d), qf(b, d));
        return compareSigns(
          rng,
          fr(a, d),
          fr(b, d),
          rel,
          [
            [
              ["Look at the bottoms", "看分母"],
              [`Both have bottom ${d}, so the parts are the same size, $${fr(1, d)}$.`, `分母都是 ${d}，每份一样大，都是 $${fr(1, d)}$。`],
            ],
            [
              ["Compare the tops", "比较分子"],
              [
                `$${a} ${symbols[rel]} ${b}$, so $${fr(a, d)} ${symbols[rel]} ${fr(b, d)}$.`,
                `$${a} ${symbols[rel]} ${b}$，所以 $${fr(a, d)} ${symbols[rel]} ${fr(b, d)}$。`,
              ],
            ],
          ],
          a === b
            ? [`On a number line in steps of $${fr(1, d)}$, both are the same point.`, `在每格是 $${fr(1, d)}$ 的数轴上，它们是同一个点。`]
            : [
                `On a number line in steps of $${fr(1, d)}$, ${Math.max(a, b)} steps from 0 is further right than ${Math.min(a, b)} steps.`,
                `在每格是 $${fr(1, d)}$ 的数轴上，从 0 走 ${Math.max(a, b)} 格比走 ${Math.min(a, b)} 格更靠右。`,
              ],
          twoBarsFigure(d, a, d, b),
        );
      },
      twoBarsFigure(8, 5, 8, 3),
    ),
    point(
      "comparing-fractions-with-like-numerators",
      ["The same numerator", "分子相同"],
      [
        "$\\frac{3}{5}$ and $\\frac{3}{8}$ both have 3 parts. A fifth is bigger than an eighth, because the whole is cut into fewer parts. So $\\frac{3}{5} > \\frac{3}{8}$.\n\nCheck: on the bars, 3 fifths reach further than 3 eighths.\n\n> **Watch out.** The bigger bottom number gives the smaller parts. $\\frac{3}{8}$ is not bigger just because 8 is bigger than 5.",
        "$\\frac{3}{5}$ 和 $\\frac{3}{8}$ 都是 3 份。五分之一比八分之一大，因为整体分的份数少。所以 $\\frac{3}{5} > \\frac{3}{8}$。\n\n检验：在长条上，3 个五分之一比 3 个八分之一长。\n\n> **注意。** 分母越大，每份越小。不能因为 8 比 5 大，就说 $\\frac{3}{8}$ 大。",
      ],
      (rng) => {
        const n = rng.int(1, 7);
        let b: number;
        let d: number;
        do {
          b = rng.int(n + 1, 15);
          d = rng.int(n + 1, 15);
        } while (b === d);
        const rel = relation(qf(n, b), qf(n, d));
        const lo = Math.min(b, d);
        const hi = Math.max(b, d);
        return compareSigns(
          rng,
          fr(n, b),
          fr(n, d),
          rel,
          [
            [
              ["Look at the tops", "看分子"],
              [`Both have ${n} ${n === 1 ? "part" : "parts"}.`, `分子都是 ${n}，份数一样多。`],
            ],
            [
              ["Compare the part sizes", "比较每份的大小"],
              [
                `$${fr(1, lo)}$ is bigger than $${fr(1, hi)}$, so $${fr(n, b)} ${symbols[rel]} ${fr(n, d)}$.`,
                `$${fr(1, lo)}$ 比 $${fr(1, hi)}$ 大，所以 $${fr(n, b)} ${symbols[rel]} ${fr(n, d)}$。`,
              ],
            ],
          ],
          [
            `On the bars, ${n} ${n === 1 ? "part" : "parts"} of $${fr(1, lo)}$ reach further than ${n} of $${fr(1, hi)}$.`,
            `在长条上，${n} 个 $${fr(1, lo)}$ 比 ${n} 个 $${fr(1, hi)}$ 长。`,
          ],
          twoBarsFigure(b, n, d, n),
        );
      },
      twoBarsFigure(5, 3, 8, 3),
    ),
  ],
  t(
    "Two friends share pizzas of the same size. Kai eats $\\frac{3}{8}$ and Zoe eats $\\frac{5}{8}$. The slices are the same size, and Zoe has more of them, so Zoe ate more: $\\frac{5}{8} > \\frac{3}{8}$.\n\nCheck: on the bars, the 5 shaded eighths reach further than the 3.\n\nIn this lesson we compare fractions with the same bottom number or the same top number.",
    "两个朋友吃同样大的比萨。凯吃了 $\\frac{3}{8}$，佐伊吃了 $\\frac{5}{8}$。每块一样大，佐伊吃的块数多，所以佐伊吃得多：$\\frac{5}{8} > \\frac{3}{8}$。\n\n检验：在长条上，涂色的 5 个八分之一比 3 个八分之一长。\n\n本课我们比较分母相同或分子相同的分数。",
  ),
);

export const comparingFractionsUsingUnitBenchmarks = topic(
  "comparing-fractions-using-unit-benchmarks",
  t("Comparing Fractions Using Unit Benchmarks", "以 1 为标准比较分数"),
  t(
    "To compare two fractions, it can help to compare each with 1. If one is less than 1 and the other is greater than 1, the second is greater: 7/8 < 1 < 9/7.",
    "比较两个分数时，可以先把它们分别与 1 比较。如果一个小于 1，另一个大于 1，后者就更大：7/8 < 1 < 9/7。",
  ),
  ["comparing-fractions", "improper-fractions"],
  ["4.NF.A.2"],
  [
    point(
      "comparing-across-one",
      ["One on each side of 1", "分别在 1 的两侧"],
      [
        "Compare $\\frac{7}{8}$ and $\\frac{9}{7}$. In $\\frac{7}{8}$ the top is smaller than the bottom, so it is less than 1. In $\\frac{9}{7}$ the top is bigger, so it is more than 1. So $\\frac{7}{8} < \\frac{9}{7}$.\n\nCheck: on the number line, $\\frac{7}{8}$ is left of 1 and $\\frac{9}{7}$ is right of 1.\n\n> **Watch out.** Do not just compare the bottom numbers. 8 is bigger than 7, but $\\frac{7}{8}$ is the smaller fraction.",
        "比较 $\\frac{7}{8}$ 和 $\\frac{9}{7}$。$\\frac{7}{8}$ 的分子比分母小，所以小于 1；$\\frac{9}{7}$ 的分子比分母大，所以大于 1。所以 $\\frac{7}{8} < \\frac{9}{7}$。\n\n检验：在数轴上，$\\frac{7}{8}$ 在 1 的左边，$\\frac{9}{7}$ 在 1 的右边。\n\n> **注意。** 不要只比较分母。8 比 7 大，但 $\\frac{7}{8}$ 是较小的分数。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 15, 3);
        const [c, d] = improperFraction(rng, 12, 2);
        const first = rng.bool();
        const [x, y] = first ? [fr(a, b), fr(c, d)] : [fr(c, d), fr(a, b)];
        return compareSigns(
          rng,
          x,
          y,
          first ? 0 : 2,
          [
            [
              ["Compare the first with 1", "第一个和 1 比"],
              [`$${a} < ${b}$, so $${fr(a, b)} < 1$.`, `$${a} < ${b}$，所以 $${fr(a, b)} < 1$。`],
            ],
            [
              ["Compare the second with 1", "第二个和 1 比"],
              [
                `$${c} > ${d}$, so $${fr(c, d)} > 1$. So $${x} ${first ? "<" : ">"} ${y}$.`,
                `$${c} > ${d}$，所以 $${fr(c, d)} > 1$。所以 $${x} ${first ? "<" : ">"} ${y}$。`,
              ],
            ],
          ],
          [
            `On a number line, $${fr(a, b)}$ is left of 1 and $${fr(c, d)}$ is right of 1.`,
            `在数轴上，$${fr(a, b)}$ 在 1 的左边，$${fr(c, d)}$ 在 1 的右边。`,
          ],
        );
      },
      pointsLine(2, [
        [7, 8],
        [9, 7],
      ]),
    ),
    point(
      "distance-from-one",
      ["Just below 1", "略小于 1"],
      [
        "Compare $\\frac{4}{5}$ and $\\frac{7}{8}$. $\\frac{4}{5}$ is $\\frac{1}{5}$ short of 1. $\\frac{7}{8}$ is $\\frac{1}{8}$ short of 1. An eighth is smaller than a fifth, so $\\frac{7}{8}$ is closer to 1: $\\frac{4}{5} < \\frac{7}{8}$.\n\nCheck: on the bars, the unshaded part of $\\frac{7}{8}$ is the smaller one.\n\n> **Watch out.** The fraction missing the smaller piece is the bigger fraction.",
        "比较 $\\frac{4}{5}$ 和 $\\frac{7}{8}$。$\\frac{4}{5}$ 比 1 少 $\\frac{1}{5}$，$\\frac{7}{8}$ 比 1 少 $\\frac{1}{8}$。八分之一比五分之一小，所以 $\\frac{7}{8}$ 更接近 1：$\\frac{4}{5} < \\frac{7}{8}$。\n\n检验：在长条上，$\\frac{7}{8}$ 没涂色的部分更短。\n\n> **注意。** 差得越少的分数越大。",
      ],
      (rng) => {
        let b: number;
        let d: number;
        do {
          b = rng.int(3, 15);
          d = rng.int(3, 15);
        } while (b === d);
        const s = b < d ? "<" : ">";
        return compareSigns(
          rng,
          fr(b - 1, b),
          fr(d - 1, d),
          b < d ? 0 : 2,
          [
            [
              ["Find what each is missing", "看各差多少到 1"],
              [
                `$${fr(b - 1, b)}$ is $${fr(1, b)}$ short of 1, and $${fr(d - 1, d)}$ is $${fr(1, d)}$ short.`,
                `$${fr(b - 1, b)}$ 比 1 少 $${fr(1, b)}$，$${fr(d - 1, d)}$ 比 1 少 $${fr(1, d)}$。`,
              ],
            ],
            [
              ["Compare the gaps", "比较差距"],
              [
                `$${fr(1, Math.max(b, d))}$ is the smaller gap, so $${fr(b - 1, b)} ${s} ${fr(d - 1, d)}$.`,
                `$${fr(1, Math.max(b, d))}$ 差得更少，所以 $${fr(b - 1, b)} ${s} ${fr(d - 1, d)}$。`,
              ],
            ],
          ],
          [
            `With the common denominator ${b * d}: $${fr((b - 1) * d, b * d)} ${s} ${fr((d - 1) * b, b * d)}$.`,
            `通分成以 ${b * d} 为分母：$${fr((b - 1) * d, b * d)} ${s} ${fr((d - 1) * b, b * d)}$。`,
          ],
          twoBarsFigure(b, b - 1, d, d - 1),
        );
      },
      twoBarsFigure(5, 4, 8, 7),
    ),
  ],
  t(
    "Sara drank $\\frac{7}{8}$ of a bottle of water and Tim drank $\\frac{9}{7}$ bottles. Sara drank less than 1 bottle, and Tim drank more than 1. So Tim drank more.\n\nCheck: 1 sits between them on the number line: $\\frac{7}{8} < 1 < \\frac{9}{7}$.\n\nIn this lesson we compare fractions by first comparing each with 1.",
    "萨拉喝了一瓶水的 $\\frac{7}{8}$，蒂姆喝了 $\\frac{9}{7}$ 瓶。萨拉喝的不到 1 瓶，蒂姆喝的超过 1 瓶。所以蒂姆喝得多。\n\n检验：在数轴上 1 在它们中间：$\\frac{7}{8} < 1 < \\frac{9}{7}$。\n\n本课我们先把分数和 1 比较，再比较分数的大小。",
  ),
);

export const comparingFractionsUsingOneHalfBenchmarks = topic(
  "comparing-fractions-using-one-half-benchmarks",
  t("Comparing Fractions Using One-Half Benchmarks", "以 1/2 为标准比较分数"),
  t(
    "A fraction is greater than 1/2 when its numerator is more than half its denominator: 5/8 > 1/2 because 5 > 4. Comparing two fractions with 1/2 can settle which is greater: 3/7 < 1/2 < 4/6.",
    "当分子大于分母的一半时，分数大于 1/2：5/8 > 1/2，因为 5 > 4。把两个分数分别与 1/2 比较，就能判断谁大：3/7 < 1/2 < 4/6。",
  ),
  ["comparing-fractions"],
  ["4.NF.A.2"],
  [
    point(
      "comparing-with-one-half",
      ["Compared with one half", "与二分之一比较"],
      [
        "Is $\\frac{5}{8}$ more than $\\frac{1}{2}$? Half of 8 is 4. The top, 5, is more than 4, so $\\frac{5}{8} > \\frac{1}{2}$.\n\nCheck: double the top: $5 \\times 2 = 10$, which is more than the bottom 8.\n\n> **Watch out.** Compare the top with half of the bottom, not with 1 or 2.",
        "$\\frac{5}{8}$ 比 $\\frac{1}{2}$ 大吗？8 的一半是 4。分子 5 比 4 大，所以 $\\frac{5}{8} > \\frac{1}{2}$。\n\n检验：把分子乘 2：$5 \\times 2 = 10$，比分母 8 大。\n\n> **注意。** 要把分子和分母的一半比较，不是和 1 或 2 比较。",
      ],
      (rng) => {
        const d = rng.int(3, 20);
        const n = rng.int(1, d - 1);
        const rel = relation(qf(n, d), qf(1, 2));
        const half = d % 2 === 0 ? `${d / 2}` : mx((d - 1) / 2, 1, 2);
        return compareSigns(
          rng,
          fr(n, d),
          fr(1, 2),
          rel,
          [
            [
              ["Find half of the bottom", "求分母的一半"],
              [`Half of ${d} is $${half}$.`, `${d} 的一半是 $${half}$。`],
            ],
            [
              ["Compare the top", "比较分子"],
              [
                `The top ${n} is ${["less than", "equal to", "more than"][rel]} $${half}$, so $${fr(n, d)} ${symbols[rel]} ${fr(1, 2)}$.`,
                `分子 ${n} ${["小于", "等于", "大于"][rel]} $${half}$，所以 $${fr(n, d)} ${symbols[rel]} ${fr(1, 2)}$。`,
              ],
            ],
          ],
          [
            `Double the top: $${n} \\times 2 = ${2 * n}$, which is ${["less than", "equal to", "more than"][rel]} the bottom ${d}.`,
            `把分子乘 2：$${n} \\times 2 = ${2 * n}$，${["小于", "等于", "大于"][rel]}分母 ${d}。`,
          ],
          barFigure(d, n),
        );
      },
      barFigure(8, 5),
    ),
    point(
      "comparing-two-fractions-across-one-half",
      ["One on each side of one half", "分别在 1/2 的两侧"],
      [
        "Compare $\\frac{3}{7}$ and $\\frac{4}{6}$. 3 is less than half of 7, so $\\frac{3}{7} < \\frac{1}{2}$. 4 is more than half of 6, so $\\frac{4}{6} > \\frac{1}{2}$. So $\\frac{3}{7} < \\frac{4}{6}$.\n\nCheck: with the common denominator 42, $\\frac{18}{42} < \\frac{28}{42}$.\n\n> **Watch out.** $\\frac{4}{6}$ has the smaller bottom, but that alone does not tell which is bigger. Use one half.",
        "比较 $\\frac{3}{7}$ 和 $\\frac{4}{6}$。3 比 7 的一半小，所以 $\\frac{3}{7} < \\frac{1}{2}$；4 比 6 的一半大，所以 $\\frac{4}{6} > \\frac{1}{2}$。所以 $\\frac{3}{7} < \\frac{4}{6}$。\n\n检验：通分成以 42 为分母：$\\frac{18}{42} < \\frac{28}{42}$。\n\n> **注意。** 不能只看分母谁小。要借助二分之一来比较。",
      ],
      (rng) => {
        let b: number;
        let d: number;
        do {
          b = rng.int(3, 15);
          d = rng.int(3, 15);
        } while (b === d);
        const a = rng.int(1, Math.ceil(b / 2) - 1);
        const c = rng.int(Math.floor(d / 2) + 1, d - 1);
        const first = rng.bool();
        const [x, y] = first ? [fr(a, b), fr(c, d)] : [fr(c, d), fr(a, b)];
        const s = first ? "<" : ">";
        const [xl, yl] = first ? [fr(a * d, b * d), fr(c * b, b * d)] : [fr(c * b, b * d), fr(a * d, b * d)];
        return compareSigns(
          rng,
          x,
          y,
          first ? 0 : 2,
          [
            [
              ["Compare one with one half", "一个和二分之一比"],
              [
                `${a} is less than half of ${b}, so $${fr(a, b)} < ${fr(1, 2)}$.`,
                `${a} 比 ${b} 的一半小，所以 $${fr(a, b)} < ${fr(1, 2)}$。`,
              ],
            ],
            [
              ["Compare the other", "另一个和二分之一比"],
              [
                `${c} is more than half of ${d}, so $${fr(c, d)} > ${fr(1, 2)}$. So $${x} ${s} ${y}$.`,
                `${c} 比 ${d} 的一半大，所以 $${fr(c, d)} > ${fr(1, 2)}$。所以 $${x} ${s} ${y}$。`,
              ],
            ],
          ],
          [`With the common denominator ${b * d}: $${xl} ${s} ${yl}$.`, `通分成以 ${b * d} 为分母：$${xl} ${s} ${yl}$。`],
        );
      },
      twoBarsFigure(7, 3, 6, 4),
    ),
  ],
  t(
    "Ella read $\\frac{3}{7}$ of her book and Sam read $\\frac{4}{6}$ of his. Half of 7 is $3\\frac{1}{2}$, and 3 is less, so Ella read less than half. Half of 6 is 3, and 4 is more, so Sam read more than half. Sam read the bigger part.\n\nCheck: $\\frac{3}{7} < \\frac{1}{2} < \\frac{4}{6}$.\n\nIn this lesson we compare fractions with one half.",
    "埃拉读了她那本书的 $\\frac{3}{7}$，萨姆读了他那本书的 $\\frac{4}{6}$。7 的一半是 $3\\frac{1}{2}$，3 比它小，所以埃拉读的不到一半。6 的一半是 3，4 比它大，所以萨姆读的超过一半。萨姆读的部分更大。\n\n检验：$\\frac{3}{7} < \\frac{1}{2} < \\frac{4}{6}$。\n\n本课我们把分数和二分之一比较。",
  ),
);

/** multiplePair draws denominators b and d = k·b with fractions a/b ≠ c/d. */
function multiplePair(rng: Rng): { a: number; b: number; c: number; d: number; k: number } {
  for (;;) {
    const b = rng.int(2, 6);
    const k = rng.int(2, Math.max(2, Math.floor(12 / b)));
    const d = b * k;
    const a = rng.int(1, b - 1);
    const c = rng.int(1, d - 1);
    if (a * k !== c) return { a, b, c, d, k };
  }
}

export const comparingFractionModelsUsingCommonDenominators = topic(
  "comparing-fraction-models-using-common-denominators",
  t("Comparing Fraction Models Using Common Denominators", "用同分母比较分数模型"),
  t(
    "To compare models cut into different numbers of parts, cut the coarser one further so both have parts of the same size. 2/3 and 5/9: cutting thirds into 3 gives 6/9, and 6/9 > 5/9.",
    "要比较分成不同份数的模型，可以把份数少的模型再细分，使两个模型的每份一样大。比较 2/3 和 5/9：把每个三分之一再分成 3 份得到 6/9，而 6/9 > 5/9。",
  ),
  ["finding-equivalent-fractions-using-area-models", "comparing-fractions"],
  ["4.NF.A.2"],
  [
    point(
      "comparing-two-bar-models",
      ["Comparing two bars", "比较两个长条"],
      [
        "The bars show $\\frac{2}{3}$ and $\\frac{5}{9}$. Each third is 3 ninths, so $\\frac{2}{3} = \\frac{6}{9}$. 6 ninths are more than 5 ninths, so $\\frac{2}{3} > \\frac{5}{9}$.\n\nCheck: the shaded part of the first bar ends further right.\n\n> **Watch out.** Do not compare 2 and 5 directly. The parts are different sizes until you cut them the same.",
        "两个长条表示 $\\frac{2}{3}$ 和 $\\frac{5}{9}$。每个三分之一是 3 个九分之一，所以 $\\frac{2}{3} = \\frac{6}{9}$。6 个九分之一比 5 个多，所以 $\\frac{2}{3} > \\frac{5}{9}$。\n\n检验：第一个长条涂色的部分更靠右。\n\n> **注意。** 不能直接比较 2 和 5。每份的大小不同，要先切成一样大。",
      ],
      (rng) => {
        const { a, b, c, d, k } = multiplePair(rng);
        const rel = relation(qf(a, b), qf(c, d));
        return compareSigns(
          rng,
          fr(a, b),
          fr(c, d),
          rel,
          [
            [
              ["Make the parts the same", "把每份变得一样大"],
              [
                `Cut each part of the first bar into ${k}: $${fr(a, b)} = ${fr(a * k, d)}$.`,
                `把第一个长条的每份再分成 ${k} 小份：$${fr(a, b)} = ${fr(a * k, d)}$。`,
              ],
            ],
            [
              ["Compare the tops", "比较分子"],
              [
                `$${a * k} ${symbols[rel]} ${c}$, so $${fr(a, b)} ${symbols[rel]} ${fr(c, d)}$.`,
                `$${a * k} ${symbols[rel]} ${c}$，所以 $${fr(a, b)} ${symbols[rel]} ${fr(c, d)}$。`,
              ],
            ],
          ],
          rel === 1
            ? ["In the bars, the two shaded parts end at the same place.", "在长条上，两个涂色部分在同一个地方结束。"]
            : [
                `In the bars, the shaded part of the ${rel === 2 ? "first" : "second"} bar ends further right.`,
                `在长条上，${rel === 2 ? "第一个" : "第二个"}长条涂色的部分更靠右。`,
              ],
          twoBarsFigure(b, a, d, c),
        );
      },
      twoBarsFigure(3, 2, 9, 5),
    ),
    point(
      "rewriting-a-model-with-smaller-parts",
      ["Making the parts the same size", "使每份一样大"],
      [
        "To write $\\frac{2}{3}$ in ninths, see that $3 \\times 3 = 9$: each third is 3 ninths. So 2 thirds are $2 \\times 3 = 6$ ninths: $\\frac{2}{3} = \\frac{6}{9}$.\n\nCheck: $6 \\div 3 = 2$ and $9 \\div 3 = 3$.\n\n> **Watch out.** Multiply the top by the same number as the bottom. Do not copy the top of the other fraction.",
        "把 $\\frac{2}{3}$ 写成九分之几：$3 \\times 3 = 9$，每个三分之一是 3 个九分之一。所以 2 个三分之一是 $2 \\times 3 = 6$ 个九分之一：$\\frac{2}{3} = \\frac{6}{9}$。\n\n检验：$6 \\div 3 = 2$，$9 \\div 3 = 3$。\n\n> **注意。** 分子要乘和分母相同的数，不能照抄另一个分数的分子。",
      ],
      (rng) => {
        const { a, b, c, d, k } = multiplePair(rng);
        return answered(
          [
            `The bars show $${fr(a, b)}$ and $${fr(c, d)}$. Rewrite the first with the bottom number of the second: $$${fr(a, b)} = \\frac{\\square}{${d}}$$`,
            `两个长条分别表示 $${fr(a, b)}$ 和 $${fr(c, d)}$。把第一个分数改写成与第二个同分母：$$${fr(a, b)} = \\frac{\\square}{${d}}$$`,
          ],
          a * k,
          [
            [
              ["Find the number used", "找出乘的数"],
              [`$${b} \\times ${k} = ${d}$, so each part becomes ${k} smaller parts.`, `$${b} \\times ${k} = ${d}$，每份变成 ${k} 小份。`],
            ],
            [
              ["Multiply the top", "分子也乘"],
              [`$${a} \\times ${k} = ${a * k}$.`, `$${a} \\times ${k} = ${a * k}$。`],
            ],
          ],
          [`$${a * k} \\div ${k} = ${a}$ and $${d} \\div ${k} = ${b}$.`, `$${a * k} \\div ${k} = ${a}$，$${d} \\div ${k} = ${b}$。`],
          [
            [a + d - b, "That adds to the top instead of multiplying.", "这是给分子加了数，应该乘。"],
            [c, "That is the top of the other fraction.", "这是另一个分数的分子。"],
            [a * d, "That multiplies the top by the new bottom.", "这用分子乘了新分母。"],
          ],
          { figure: twoBarsFigure(b, a, d, c) },
        );
      },
      twoBarsFigure(3, 2, 9, 6),
    ),
  ],
  t(
    "Two bars are the same size. One shows $\\frac{2}{3}$, the other $\\frac{5}{9}$. Cut each third into 3 smaller parts, and $\\frac{2}{3}$ becomes $\\frac{6}{9}$. Now both use ninths, and 6 ninths are more than 5 ninths.\n\nCheck: in the bars, the shaded part of $\\frac{2}{3}$ ends further right.\n\nIn this lesson we compare bar models by making their parts the same size.",
    "两个长条一样大，一个表示 $\\frac{2}{3}$，另一个表示 $\\frac{5}{9}$。把每个三分之一再平均分成 3 小份，$\\frac{2}{3}$ 就变成 $\\frac{6}{9}$。现在都是九分之几，6 个九分之一比 5 个多。\n\n检验：在长条上，$\\frac{2}{3}$ 涂色的部分更靠右。\n\n本课我们把两个长条的每份变得一样大，再比较。",
  ),
);

export const comparingFractionsUsingCommonDenominators = topic(
  "comparing-fractions-using-common-denominators",
  t("Comparing Fractions Using Common Denominators", "通分比较分数的大小"),
  t(
    "To compare any two fractions, rewrite them with a common denominator and compare the numerators. 3/4 and 5/6 with denominator 12 are 9/12 and 10/12, so 3/4 < 5/6.",
    "要比较任意两个分数，先把它们通分，再比较分子。3/4 和 5/6 通分成以 12 为分母是 9/12 和 10/12，所以 3/4 < 5/6。",
  ),
  ["comparing-fraction-models-using-common-denominators", "least-common-denominators"],
  ["4.NF.A.2"],
  [
    point(
      "comparing-two-fractions-with-unlike-denominators",
      ["Two fractions", "比较两个分数"],
      [
        "Compare $\\frac{3}{4}$ and $\\frac{5}{6}$. The least common denominator is 12. $\\frac{3}{4} = \\frac{9}{12}$ and $\\frac{5}{6} = \\frac{10}{12}$. 9 is less than 10, so $\\frac{3}{4} < \\frac{5}{6}$.\n\nCheck: the strips show $\\frac{9}{12}$ is shorter than $\\frac{10}{12}$.\n\n> **Watch out.** Change the top numbers too. Comparing 3 and 5 without rewriting can give the wrong answer.",
        "比较 $\\frac{3}{4}$ 和 $\\frac{5}{6}$。最小公分母是 12。$\\frac{3}{4} = \\frac{9}{12}$，$\\frac{5}{6} = \\frac{10}{12}$。9 比 10 小，所以 $\\frac{3}{4} < \\frac{5}{6}$。\n\n检验：分数条上 $\\frac{9}{12}$ 比 $\\frac{10}{12}$ 短。\n\n> **注意。** 分子也要跟着变。不通分就比较 3 和 5，可能会出错。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        do {
          [a, b] = properFraction(rng, 12, 3);
          [c, d] = properFraction(rng, 12, 3);
        } while (b === d || lcm(b, d) > 60 || lcm(b, d) === Math.max(b, d) || a * d === b * c);
        const l = lcm(b, d);
        const rel = relation(qf(a, b), qf(c, d));
        const s = symbols[rel]!;
        return compareSigns(
          rng,
          fr(a, b),
          fr(c, d),
          rel,
          [
            [
              ["Find a common denominator", "找公分母"],
              [`The least common denominator of ${b} and ${d} is ${l}.`, `${b} 和 ${d} 的最小公分母是 ${l}。`],
            ],
            [
              ["Rewrite and compare", "改写后比较"],
              [
                `With bottom ${l} they are $${fr((a * l) / b, l)}$ and $${fr((c * l) / d, l)}$. So $${fr(a, b)} ${s} ${fr(c, d)}$.`,
                `化成分母是 ${l} 的分数：$${fr((a * l) / b, l)}$ 和 $${fr((c * l) / d, l)}$。所以 $${fr(a, b)} ${s} ${fr(c, d)}$。`,
              ],
            ],
          ],
          [
            `With the denominator ${b * d} instead: $${fr(a * d, b * d)} ${s} ${fr(c * b, b * d)}$.`,
            `改用 ${b * d} 作分母：$${fr(a * d, b * d)} ${s} ${fr(c * b, b * d)}$。`,
          ],
        );
      },
      stripsFigure([
        { parts: 12, shaded: 9, text: "3/4" },
        { parts: 12, shaded: 10, text: "5/6" },
      ]),
    ),
    point(
      "ordering-three-fractions",
      ["The greatest of three fractions", "三个分数中最大的"],
      [
        "Which is greatest: $\\frac{1}{2}$, $\\frac{2}{3}$ or $\\frac{3}{4}$? Use twelfths: $\\frac{6}{12}$, $\\frac{8}{12}$ and $\\frac{9}{12}$. The biggest top is 9, so $\\frac{3}{4}$ is greatest.\n\nCheck: each is one part short of 1, and $\\frac{1}{4}$ is the smallest gap.\n\n> **Watch out.** Rewrite all three with the same bottom number before you compare the tops.",
        "$\\frac{1}{2}$、$\\frac{2}{3}$、$\\frac{3}{4}$ 中哪个最大？都化成十二分之几：$\\frac{6}{12}$、$\\frac{8}{12}$、$\\frac{9}{12}$。分子 9 最大，所以 $\\frac{3}{4}$ 最大。\n\n检验：它们都比 1 少一份，$\\frac{1}{4}$ 这一份最小。\n\n> **注意。** 三个分数都要化成同分母，再比较分子。",
      ],
      (rng) => {
        for (;;) {
          const dens = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 3);
          const l = dens.reduce(lcm);
          if (l > 60) continue;
          const fs = dens.map((d) => [coprimeTo(rng, d, 1, d - 1), d] as [number, number]);
          const vals = fs.map(([n, d]) => (n * l) / d);
          if (new Set(vals).size < 3) continue;
          const asc = rng.bool(0.4);
          const best = vals.indexOf(asc ? Math.min(...vals) : Math.max(...vals));
          const [bn, bd] = fs[best]!;
          const list = fs.map(([n, d]) => fr(n, d)).join(",\\ ");
          const order = [...fs.keys()].sort((i, j) => vals[i]! - vals[j]!).map((i) => fr(fs[i]![0], fs[i]![1]));
          return pickedMath(
            rng,
            asc
              ? [`Which is the least: $${list}$?`, `$${list}$ 中哪个最小？`]
              : [`Which is the greatest: $${list}$?`, `$${list}$ 中哪个最大？`],
            fr(bn, bd),
            fs
              .map((f, i): [string, string, string] => [
                fr(f[0], f[1]),
                `It is $${fr(vals[i]!, l)}$, which is ${asc ? "more" : "less"} than $${fr(vals[best]!, l)}$.`,
                `它是 $${fr(vals[i]!, l)}$，比 $${fr(vals[best]!, l)}$ ${asc ? "大" : "小"}。`,
              ])
              .filter((_, i) => i !== best),
            [
              [
                ["Find a common denominator", "找公分母"],
                [`${dens.join(", ")} all go into ${l}.`, `${dens.join("、")} 都能整除 ${l}。`],
              ],
              [
                ["Rewrite and compare", "改写后比较"],
                [
                  `They are $${vals.map((v) => fr(v, l)).join(",\\ ")}$, so the answer is $${fr(bn, bd)}$.`,
                  `它们是 $${vals.map((v) => fr(v, l)).join(",\\ ")}$，所以答案是 $${fr(bn, bd)}$。`,
                ],
              ],
            ],
            [`From least to greatest: $${order.join(" < ")}$.`, `从小到大：$${order.join(" < ")}$。`],
          );
        }
      },
      stripsFigure([
        { parts: 2, shaded: 1, text: "1/2" },
        { parts: 3, shaded: 2, text: "2/3" },
        { parts: 4, shaded: 3, text: "3/4" },
      ]),
    ),
  ],
  t(
    "Mom used $\\frac{3}{4}$ cup of sugar and Dad used $\\frac{5}{6}$ cup. Write both in twelfths: $\\frac{9}{12}$ and $\\frac{10}{12}$. 10 twelfths are more, so Dad used more sugar.\n\nCheck: $\\frac{3}{4}$ is $\\frac{1}{4}$ short of 1 and $\\frac{5}{6}$ is only $\\frac{1}{6}$ short, so $\\frac{5}{6}$ is bigger.\n\nIn this lesson we compare any two fractions by giving them a common denominator.",
    "妈妈用了 $\\frac{3}{4}$ 杯糖，爸爸用了 $\\frac{5}{6}$ 杯。都写成十二分之几：$\\frac{9}{12}$ 和 $\\frac{10}{12}$。10 个十二分之一更多，所以爸爸用的糖多。\n\n检验：$\\frac{3}{4}$ 比 1 少 $\\frac{1}{4}$，$\\frac{5}{6}$ 只比 1 少 $\\frac{1}{6}$，所以 $\\frac{5}{6}$ 大。\n\n本课我们先通分，再比较任意两个分数。",
  ),
);

// ---------------------------------------------------------------------------
// Adding and subtracting fractions with like denominators

/** likeSum draws a/d + b/d whose sum (a + b)/d is in lowest terms, with a + b ≤ maxSum·d. */
function likeSum(rng: Rng, maxSum: number, minDen = 3, maxDen = 12): [number, number, number] {
  for (;;) {
    const d = rng.int(minDen, maxDen);
    const a = rng.int(1, d - 1);
    const b = rng.int(1, d - 1);
    if (a + b <= maxSum * d && gcd(a + b, d) === 1 && a + b !== d) return [a, b, d];
  }
}

/** likeDifference draws a/d − b/d whose difference (a − b)/d is in lowest terms and positive. */
function likeDifference(rng: Rng, maxDen = 12): [number, number, number] {
  for (;;) {
    const d = rng.int(3, maxDen);
    const a = rng.int(2, d - 1);
    const b = rng.int(1, a - 1);
    if (gcd(a - b, d) === 1) return [a, b, d];
  }
}

/** sumStrips draws a/d and b/d as strips of one whole and, under them, what joining them or taking b/d away leaves; with `last` false the result strip is left out. */
const sumStrips = (a: number, b: number, d: number, subtract = false, last = true): Figure =>
  stripsFigure([
    { parts: d, shaded: a, text: `${a}/${d}` },
    { parts: d, shaded: b, text: `${b}/${d}` },
    ...(last ? [{ parts: d, shaded: subtract ? a - b : a + b, text: `${subtract ? a - b : a + b}/${d}` }] : []),
  ]);

/** jumpsLine is a number line in steps of 1/d from 0 to the next whole number, with jumps of the given tops one after another from 0. */
function jumpsLine(d: number, tops: readonly number[]): Figure {
  const ends = tops.map((_, i) => tops.slice(0, i + 1).reduce((s, x) => s + x, 0));
  const total = ends[ends.length - 1] ?? 0;
  const hi = Math.max(1, Math.ceil(total / d));
  const list = tops.map((x) => `${x}/${d}`);
  return lineFigure(
    {
      lo: 0,
      hi,
      step: 1 / d,
      labels: Array.from({ length: hi + 1 }, (_, i) => i),
      marks: [{ at: total / d, text: `${total}/${d}`, result: true }],
      jumps: ends.map((e, i): [number, number] => [i === 0 ? 0 : (ends[i - 1] ?? 0) / d, e / d]),
    },
    [
      `A number line from 0 to ${hi} in steps of 1/${d}, with jumps of ${list.join(", ")} from 0 that land on ${total}/${d}.`,
      `一条从 0 到 ${hi} 的数轴，每格是 1/${d}，从 0 起依次跳 ${list.join("、")}，落在 ${total}/${d}。`,
    ],
  );
}

/** fractionStory builds a word-problem knowledge point for adding or subtracting fractions with like denominators: k 0 is measured amounts, k 1 parts of one whole. */
function fractionStory(id: string, subtract: boolean, k: number): KnowledgePointDef {
  const explanation: Pair =
    k === 1
      ? subtract
        ? [
            "Ben had $\\frac{7}{9}$ of a pie and gave $\\frac{2}{9}$ of the pie to a friend. Both are ninths of the same pie, so take the tops away: $7 - 2 = 5$. Ben has $\\frac{5}{9}$ of the pie left.\n\nCheck: $\\frac{5}{9} + \\frac{2}{9} = \\frac{7}{9}$, what Ben had.\n\n> **Watch out.** The part given away is not the answer. The question asks what is left.",
            "本有一个馅饼的 $\\frac{7}{9}$，送给朋友这个馅饼的 $\\frac{2}{9}$。两个都是同一个馅饼的九分之几，所以分子相减：$7 - 2 = 5$。本还剩这个馅饼的 $\\frac{5}{9}$。\n\n检验：$\\frac{5}{9} + \\frac{2}{9} = \\frac{7}{9}$，正是本原来有的。\n\n> **注意。** 送掉的部分不是答案。问题问的是还剩多少。",
          ]
        : [
            "Ava painted $\\frac{2}{9}$ of a fence on Monday and $\\frac{5}{9}$ of it on Tuesday. Both are ninths of the same fence, so add the tops: $2 + 5 = 7$. She has painted $\\frac{7}{9}$ of the fence.\n\nCheck: $\\frac{2}{9}$ is still unpainted, and $\\frac{7}{9} + \\frac{2}{9} = \\frac{9}{9}$, the whole fence.\n\n> **Watch out.** The painted part cannot be more than the whole fence. If the top comes out bigger than 9, check your adding.",
            "阿娃星期一刷了栅栏的 $\\frac{2}{9}$，星期二刷了 $\\frac{5}{9}$。两个都是同一段栅栏的九分之几，所以分子相加：$2 + 5 = 7$。她一共刷了栅栏的 $\\frac{7}{9}$。\n\n检验：还有 $\\frac{2}{9}$ 没刷，$\\frac{7}{9} + \\frac{2}{9} = \\frac{9}{9}$，正好是整段栅栏。\n\n> **注意。** 刷了的部分不会比整段栅栏还多。如果分子比 9 大，就要检查加法。",
          ]
      : subtract
        ? [
            'Emma used $\\frac{7}{8}$ cup of flour for bread and $\\frac{2}{8}$ cup for muffins. "How many more" asks for a difference: $7 - 2 = 5$, so she used $\\frac{5}{8}$ cup more for bread.\n\nCheck: $\\frac{2}{8} + \\frac{5}{8} = \\frac{7}{8}$, the flour for bread.\n\n> **Watch out.** "How many more" says more, but it asks you to subtract. Do not add the two amounts.',
            "艾玛做面包用了 $\\frac{7}{8}$ 杯面粉，做松饼用了 $\\frac{2}{8}$ 杯。“多多少”求的是差：$7 - 2 = 5$，所以做面包多用了 $\\frac{5}{8}$ 杯。\n\n检验：$\\frac{2}{8} + \\frac{5}{8} = \\frac{7}{8}$，正是做面包用的面粉。\n\n> **注意。**“多多少”里有个“多”字，却要用减法。不要把两个量加起来。",
          ]
        : [
            'Ava walked $\\frac{3}{10}$ mile in the morning and $\\frac{4}{10}$ mile in the afternoon. "In all" asks for a sum: $3 + 4 = 7$, so she walked $\\frac{7}{10}$ mile.\n\nCheck: $\\frac{7}{10} - \\frac{4}{10} = \\frac{3}{10}$, the morning walk.\n\n> **Watch out.** Add only the tops. The parts are still tenths, so the answer is not $\\frac{7}{20}$.',
            "阿娃上午走了 $\\frac{3}{10}$ 英里，下午走了 $\\frac{4}{10}$ 英里。“一共”求的是和：$3 + 4 = 7$，所以她走了 $\\frac{7}{10}$ 英里。\n\n检验：$\\frac{7}{10} - \\frac{4}{10} = \\frac{3}{10}$，正是上午走的。\n\n> **注意。** 只把分子相加。每份仍是十分之一，所以答案不是 $\\frac{7}{20}$。",
          ];
  const example =
    k === 1 ? (subtract ? sumStrips(7, 2, 9, true) : sumStrips(2, 5, 9)) : subtract ? sumStrips(7, 2, 8, true) : sumStrips(3, 4, 10);
  return point(
    id,
    k === 0 ? ["Measured amounts", "度量的数量"] : ["Parts of a whole", "整体的一部分"],
    explanation,
    (rng) => {
      const name = rng.pick(names);
      const [a, b, d] = subtract ? likeDifference(rng, 12) : likeSum(rng, k === 0 ? 2 : 1);
      const v = subtract ? a - b : a + b;
      const op = subtract ? "-" : "+";
      let prompt: Pair;
      if (k === 0) {
        const am = rng.pick(amounts);
        const story = am.first(name, `$${fr(a, d)}$`);
        const more = am.second(name, `$${fr(b, d)}$`);
        const ask = subtract ? am.difference : am.together;
        prompt = [`${story.en} ${more.en} ${ask.en}`, `${story["zh-CN"]}，${more["zh-CN"]}${ask["zh-CN"]}`];
      } else {
        const w = rng.pick(wholes);
        prompt = subtract
          ? [
              `${name} had $${fr(a, d)}$ of a ${w.en} and gave $${fr(b, d)}$ of the ${w.en} to a friend. What fraction of the ${w.en} does ${name} have left?`,
              `${name} 有一个${w.zh}的 $${fr(a, d)}$，送给朋友这个${w.zh}的 $${fr(b, d)}$。${name} 还剩这个${w.zh}的几分之几？`,
            ]
          : [
              `${name} painted $${fr(a, d)}$ of a fence on Monday and $${fr(b, d)}$ of it on Tuesday. What fraction of the fence has been painted?`,
              `${name} 星期一刷了栅栏的 $${fr(a, d)}$，星期二刷了 $${fr(b, d)}$。一共刷了栅栏的几分之几？`,
            ];
      }
      const choose: Pair = subtract
        ? k === 0
          ? ["The question asks how much more, a difference, so subtract.", "问题问多多少，求的是差，所以用减法。"]
          : ["The question asks what is left, so take the part given away.", "问题问还剩多少，所以减去送掉的部分。"]
        : k === 0
          ? ["The question asks for the amount in all, a sum, so add.", "问题问一共多少，求的是和，所以用加法。"]
          : ["Both days painted parts of the same fence, so add them.", "两天刷的是同一段栅栏，所以把两部分相加。"];
      return answered(
        prompt,
        qf(v, d),
        [
          [["Choose the operation", "选运算"], choose],
          [
            [subtract ? "Subtract the tops" : "Add the tops", subtract ? "分子相减" : "分子相加"],
            [
              `Both are in parts of $${fr(1, d)}$, so keep the bottom: $${fr(a, d)} ${op} ${fr(b, d)} = ${fr(v, d)}$.`,
              `都是以 $${fr(1, d)}$ 为一份，分母不变：$${fr(a, d)} ${op} ${fr(b, d)} = ${fr(v, d)}$。`,
            ],
          ],
        ],
        subtract
          ? [`Add back: $${fr(v, d)} + ${fr(b, d)} = ${fr(a, d)}$.`, `加回去：$${fr(v, d)} + ${fr(b, d)} = ${fr(a, d)}$。`]
          : [
              `Take one part back: $${fr(v, d)} - ${fr(b, d)} = ${fr(a, d)}$.`,
              `减去其中一部分：$${fr(v, d)} - ${fr(b, d)} = ${fr(a, d)}$。`,
            ],
        subtract
          ? [
              [qf(a + b, d), "That adds, but the question asks for a difference.", "这是相加，可是问题求的是差。"],
              [qf(b, d), "That is the second amount, not the difference.", "这是第二个量，不是差。"],
              [qf(a, d), "That is the first amount, before anything is taken away.", "这是第一个量，还没有减。"],
            ]
          : [
              [qf(a + b, 2 * d), "That adds the bottoms too. The parts keep their size.", "这把分母也加了。每份的大小不变。"],
              [qf(Math.abs(a - b), d), "That subtracts, but the question asks for a sum.", "这是相减，可是问题求的是和。"],
              [qf(b, d), "That is only the second amount.", "这只是第二个量。"],
            ],
        { form: "fraction", ...((subtract || a + b <= d) && { figure: sumStrips(a, b, d, subtract, false) }) },
      );
    },
    example,
  );
}

export const addingFractionsWithLikeDenominatorsUsingModels = topic(
  "adding-fractions-with-like-denominators-using-models",
  t("Adding Fractions With Like Denominators Using Models", "用模型计算同分母分数加法"),
  t(
    "Adding fractions with the same denominator joins parts of the same size, so the parts are counted together: 2/7 + 3/7 = 5/7. The denominator stays the same because the size of the parts does not change.",
    "同分母分数相加是把同样大小的份数合在一起，所以把份数相加：2/7 + 3/7 = 5/7。每份的大小没有变，所以分母不变。",
  ),
  ["fraction-models"],
  ["4.NF.B.3"],
  [
    point(
      "adding-with-bar-models",
      ["Joining shaded parts", "合并涂色部分"],
      [
        "Shade $\\frac{2}{7}$ of a bar, then $\\frac{3}{7}$ more. Now 5 of the 7 parts are shaded, so $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$. The parts are still sevenths.\n\nCheck: 2 parts are unshaded, and $5 + 2 = 7$ parts in the whole bar.\n\n> **Watch out.** Do not add the bottoms. The bar still has 7 parts, so the answer is not $\\frac{5}{14}$.",
        "在长条上先涂 $\\frac{2}{7}$，再涂 $\\frac{3}{7}$。现在 7 份中涂了 5 份，所以 $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$。每份仍是七分之一。\n\n检验：没涂色的有 2 份，$5 + 2 = 7$，正是整个长条的份数。\n\n> **注意。** 分母不能相加。长条还是 7 份，所以答案不是 $\\frac{5}{14}$。",
      ],
      (rng) => {
        const [a, b, d] = likeSum(rng, 1);
        const s = a + b;
        return answered(
          [
            `The strips show $${fr(a, d)}$ and $${fr(b, d)}$. Find $${fr(a, d)} + ${fr(b, d)}$.`,
            `长条表示 $${fr(a, d)}$ 和 $${fr(b, d)}$。计算 $${fr(a, d)} + ${fr(b, d)}$。`,
          ],
          qf(s, d),
          [
            [
              ["Count the shaded parts", "数涂色的份数"],
              [`$${a} + ${b} = ${s}$ parts are shaded.`, `一共涂了 $${a} + ${b} = ${s}$ 份。`],
            ],
            [
              ["Keep the part size", "每份大小不变"],
              [`Each part is still $${fr(1, d)}$, so the sum is $${fr(s, d)}$.`, `每份仍是 $${fr(1, d)}$，所以和是 $${fr(s, d)}$。`],
            ],
          ],
          [
            `Count the unshaded parts: ${d - s}. Together $${s} + ${d - s} = ${d}$, the whole bar.`,
            `数没涂色的份：${d - s} 份。合起来 $${s} + ${d - s} = ${d}$，正是整个长条。`,
          ],
          [
            [qf(s, 2 * d), "That adds the bottoms too. The bar still has the same parts.", "这把分母也加了。长条的份数没有变。"],
            [qf(a * b, d), "That multiplies the tops instead of adding them.", "这把分子相乘了，应该相加。"],
            [qf(Math.abs(a - b), d), "That takes away instead of adding.", "这是相减，应该相加。"],
          ],
          { form: "fraction", figure: sumStrips(a, b, d, false, false) },
        );
      },
      sumStrips(2, 3, 7),
    ),
    point(
      "counting-unit-fractions-in-a-sum",
      ["Counting unit fractions", "数分数单位"],
      [
        "$\\frac{3}{8}$ is 3 eighths and $\\frac{4}{8}$ is 4 eighths. Together they are $3 + 4 = 7$ eighths, so $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$.\n\nCheck: on the number line, 3 steps of $\\frac{1}{8}$ and then 4 more land on $\\frac{7}{8}$.\n\n> **Watch out.** Count the eighths, do not multiply. $3 \\times 4$ eighths would be far too many.",
        "$\\frac{3}{8}$ 是 3 个八分之一，$\\frac{4}{8}$ 是 4 个八分之一。合起来是 $3 + 4 = 7$ 个八分之一，所以 $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$。\n\n检验：在数轴上，先走 3 格 $\\frac{1}{8}$，再走 4 格，落在 $\\frac{7}{8}$。\n\n> **注意。** 要数八分之一的个数，不是相乘。$3 \\times 4$ 个八分之一就太多了。",
      ],
      (rng) => {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 2);
        const b = rng.int(1, d - 1 - a);
        return answered(
          [
            `Fill in the box: $$${fr(a, d)} + ${fr(b, d)} = \\frac{\\square}{${d}}$$`,
            `填空：$$${fr(a, d)} + ${fr(b, d)} = \\frac{\\square}{${d}}$$`,
          ],
          a + b,
          [
            [
              ["Name the unit", "找分数单位"],
              [`Both fractions count parts of size $${fr(1, d)}$.`, `两个分数都是数 $${fr(1, d)}$ 的个数。`],
            ],
            [
              ["Count them together", "合起来数"],
              [`$${a} + ${b} = ${a + b}$ of them.`, `一共 $${a} + ${b} = ${a + b}$ 个。`],
            ],
          ],
          [
            `Take the second fraction back: $${a + b} - ${b} = ${a}$, the first top.`,
            `去掉第二个分数：$${a + b} - ${b} = ${a}$，正是第一个分子。`,
          ],
          [
            [a * b, "That multiplies the tops instead of adding them.", "这把分子相乘了，应该相加。"],
            [d, "That is the bottom number, the size of the parts, not how many.", "这是分母，表示每份的大小，不是份数。"],
            [Math.abs(a - b), "That takes away instead of adding.", "这是相减，应该相加。"],
          ],
          { form: "integer", figure: jumpsLine(d, [a, b]) },
        );
      },
      jumpsLine(8, [3, 4]),
    ),
  ],
  t(
    "Mia eats $\\frac{2}{7}$ of a chocolate bar, then $\\frac{3}{7}$ more. Each piece is one seventh. She ate 2 pieces and then 3 pieces: 5 pieces, or $\\frac{5}{7}$ of the bar.\n\nCheck: 2 of the 7 pieces are left, and $5 + 2 = 7$.\n\nIn this lesson we add fractions with the same bottom number by joining parts on a bar.",
    "米娅吃了一块巧克力的 $\\frac{2}{7}$，又吃了 $\\frac{3}{7}$。每小块是七分之一。她先吃 2 块，再吃 3 块，一共 5 块，也就是这块巧克力的 $\\frac{5}{7}$。\n\n检验：还剩 7 块中的 2 块，$5 + 2 = 7$。\n\n本课我们在长条上把同样大小的份合在一起，计算同分母分数的加法。",
  ),
);

export const addingFractionsWithLikeDenominators = topic(
  "adding-fractions-with-like-denominators",
  t("Adding Fractions With Like Denominators", "同分母分数加法"),
  t(
    "To add fractions with like denominators, add the numerators and keep the denominator: a/d + b/d = (a + b)/d. The sum may be greater than 1: 5/6 + 3/6 = 8/6.",
    "同分母分数相加，分母不变，分子相加：a/d + b/d = (a + b)/d。和可能大于 1：5/6 + 3/6 = 8/6。",
  ),
  ["adding-fractions-with-like-denominators-using-models"],
  ["4.NF.B.3"],
  [
    point(
      "adding-two-fractions-with-like-denominators",
      ["Two fractions", "两个分数相加"],
      [
        "$\\frac{4}{9} + \\frac{7}{9}$: both are ninths, so add the tops, $4 + 7 = 11$. The sum is $\\frac{11}{9}$, a little more than 1.\n\nCheck: on the number line, 4 steps of $\\frac{1}{9}$ and then 7 more land just past 1, on $\\frac{11}{9}$.\n\n> **Watch out.** Do not add the bottoms. $\\frac{4}{9} + \\frac{7}{9}$ is not $\\frac{11}{18}$.",
        "$\\frac{4}{9} + \\frac{7}{9}$：两个都是九分之几，所以分子相加，$4 + 7 = 11$。和是 $\\frac{11}{9}$，比 1 多一点。\n\n检验：在数轴上，先走 4 格 $\\frac{1}{9}$，再走 7 格，刚好过了 1，落在 $\\frac{11}{9}$。\n\n> **注意。** 分母不能相加。$\\frac{4}{9} + \\frac{7}{9}$ 不等于 $\\frac{11}{18}$。",
      ],
      (rng) => {
        const [a, b, d] = likeSum(rng, 2);
        const s = a + b;
        return answered(
          [`Find $${fr(a, d)} + ${fr(b, d)}$.`, `计算 $${fr(a, d)} + ${fr(b, d)}$。`],
          qf(s, d),
          [
            [
              ["Add the tops", "分子相加"],
              [`$${a} + ${b} = ${s}$.`, `$${a} + ${b} = ${s}$。`],
            ],
            [
              ["Keep the bottom", "分母不变"],
              [`The parts are still $${fr(1, d)}$, so the sum is $${fr(s, d)}$.`, `每份仍是 $${fr(1, d)}$，所以和是 $${fr(s, d)}$。`],
            ],
          ],
          [`Take one back: $${fr(s, d)} - ${fr(b, d)} = ${fr(a, d)}$.`, `减回去：$${fr(s, d)} - ${fr(b, d)} = ${fr(a, d)}$。`],
          [
            [qf(s, 2 * d), "That adds the bottoms too. The parts keep their size.", "这把分母也加了。每份的大小不变。"],
            [qf(a * b, d), "That multiplies the tops instead of adding them.", "这把分子相乘了，应该相加。"],
            [qf(Math.abs(a - b), d), "That takes away instead of adding.", "这是相减，应该相加。"],
          ],
          { form: "fraction" },
        );
      },
      jumpsLine(9, [4, 7]),
    ),
    point(
      "adding-three-fractions-with-like-denominators",
      ["Three fractions", "三个分数相加"],
      [
        "$\\frac{1}{8} + \\frac{2}{8} + \\frac{4}{8}$: all are eighths, so add all three tops, $1 + 2 + 4 = 7$. The sum is $\\frac{7}{8}$.\n\nCheck: add two first. $\\frac{1}{8} + \\frac{2}{8} = \\frac{3}{8}$, and $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$.\n\n> **Watch out.** Keep the bottom 8. Adding the three bottoms would give $\\frac{7}{24}$, which is wrong.",
        "$\\frac{1}{8} + \\frac{2}{8} + \\frac{4}{8}$：都是八分之几，所以三个分子相加，$1 + 2 + 4 = 7$。和是 $\\frac{7}{8}$。\n\n检验：先加两个。$\\frac{1}{8} + \\frac{2}{8} = \\frac{3}{8}$，$\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$。\n\n> **注意。** 分母 8 不变。把三个分母加起来得到 $\\frac{7}{24}$，这是错的。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(4, 15);
          const [a, b, c] = [rng.int(1, d - 1), rng.int(1, d - 1), rng.int(1, d - 1)];
          const s = a + b + c;
          if (s >= 2 * d || gcd(s, d) !== 1) continue;
          return answered(
            [`Find $${fr(a, d)} + ${fr(b, d)} + ${fr(c, d)}$.`, `计算 $${fr(a, d)} + ${fr(b, d)} + ${fr(c, d)}$。`],
            qf(s, d),
            [
              [
                ["Add all the tops", "把分子都加起来"],
                [`$${a} + ${b} + ${c} = ${s}$.`, `$${a} + ${b} + ${c} = ${s}$。`],
              ],
              [
                ["Keep the bottom", "分母不变"],
                [`The parts are still $${fr(1, d)}$, so the sum is $${fr(s, d)}$.`, `每份仍是 $${fr(1, d)}$，所以和是 $${fr(s, d)}$。`],
              ],
            ],
            [
              `Add two first: $${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}$. Then $${fr(a + b, d)} + ${fr(c, d)} = ${fr(s, d)}$.`,
              `先加两个：$${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}$。再算 $${fr(a + b, d)} + ${fr(c, d)} = ${fr(s, d)}$。`,
            ],
            [
              [qf(s, 3 * d), "That adds the bottoms too. The parts keep their size.", "这把分母也加了。每份的大小不变。"],
              [qf(a + b, d), "That leaves out the third fraction.", "这漏掉了第三个分数。"],
              [qf(b + c, d), "That leaves out the first fraction.", "这漏掉了第一个分数。"],
            ],
            { form: "fraction", figure: jumpsLine(d, [a, b, c]) },
          );
        }
      },
      jumpsLine(8, [1, 2, 4]),
    ),
  ],
  t(
    "Leo walks $\\frac{3}{8}$ mile to school and then $\\frac{4}{8}$ mile to the park. Both are eighths, so count the eighths: $3 + 4 = 7$. He walks $\\frac{7}{8}$ mile.\n\nCheck: $\\frac{7}{8} - \\frac{4}{8} = \\frac{3}{8}$, the walk to school.\n\nIn this lesson we add fractions with the same bottom number: add the tops and keep the bottom.",
    "利奥走 $\\frac{3}{8}$ 英里到学校，再走 $\\frac{4}{8}$ 英里到公园。两个都是八分之几，所以数八分之一：$3 + 4 = 7$。他一共走了 $\\frac{7}{8}$ 英里。\n\n检验：$\\frac{7}{8} - \\frac{4}{8} = \\frac{3}{8}$，正是到学校的路程。\n\n本课我们计算同分母分数加法：分子相加，分母不变。",
  ),
);

export const subtractingFractionsWithLikeDenominators = topic(
  "subtracting-fractions-with-like-denominators",
  t("Subtracting Fractions With Like Denominators", "同分母分数减法"),
  t(
    "To subtract fractions with like denominators, subtract the numerators and keep the denominator: 7/9 − 2/9 = 5/9. To subtract from 1, write 1 as d/d first: 1 − 3/8 = 8/8 − 3/8 = 5/8.",
    "同分母分数相减，分母不变，分子相减：7/9 − 2/9 = 5/9。用 1 减一个分数时，先把 1 写成 d/d：1 − 3/8 = 8/8 − 3/8 = 5/8。",
  ),
  ["adding-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [
    point(
      "subtracting-two-fractions-with-like-denominators",
      ["Two fractions", "两个分数相减"],
      [
        "$\\frac{11}{12} - \\frac{4}{12}$: both are twelfths, so take the tops away, $11 - 4 = 7$. The difference is $\\frac{7}{12}$.\n\nCheck: add back. $\\frac{7}{12} + \\frac{4}{12} = \\frac{11}{12}$.\n\n> **Watch out.** Do not subtract the bottoms. That would give $\\frac{7}{0}$, which makes no sense.",
        "$\\frac{11}{12} - \\frac{4}{12}$：两个都是十二分之几，所以分子相减，$11 - 4 = 7$。差是 $\\frac{7}{12}$。\n\n检验：加回去。$\\frac{7}{12} + \\frac{4}{12} = \\frac{11}{12}$。\n\n> **注意。** 分母不能相减。那样会得到 $\\frac{7}{0}$，没有意义。",
      ],
      (rng) => {
        const [a, b, d] = likeDifference(rng, 15);
        const r = a - b;
        return answered(
          [`Find $${fr(a, d)} - ${fr(b, d)}$.`, `计算 $${fr(a, d)} - ${fr(b, d)}$。`],
          qf(r, d),
          [
            [
              ["Subtract the tops", "分子相减"],
              [`$${a} - ${b} = ${r}$.`, `$${a} - ${b} = ${r}$。`],
            ],
            [
              ["Keep the bottom", "分母不变"],
              [
                `The parts are still $${fr(1, d)}$, so the difference is $${fr(r, d)}$.`,
                `每份仍是 $${fr(1, d)}$，所以差是 $${fr(r, d)}$。`,
              ],
            ],
          ],
          [`Add back: $${fr(r, d)} + ${fr(b, d)} = ${fr(a, d)}$.`, `加回去：$${fr(r, d)} + ${fr(b, d)} = ${fr(a, d)}$。`],
          [
            [qf(a + b, d), "That adds instead of taking away.", "这是相加，应该相减。"],
            [qf(b, d), "That is the part taken away, not the part left.", "这是拿走的部分，不是剩下的部分。"],
            [qf(r, 2 * d), "That doubles the bottom. The parts keep their size.", "这把分母变成了两倍。每份的大小不变。"],
          ],
          { form: "fraction", figure: sumStrips(a, b, d, true, false) },
        );
      },
      sumStrips(11, 4, 12, true),
    ),
    point(
      "subtracting-fractions-from-wholes",
      ["Subtracting from a whole number", "用整数减分数"],
      [
        "$2 - \\frac{3}{5}$: each whole is 5 fifths, so 2 wholes are $\\frac{10}{5}$. Now take the tops away: $10 - 3 = 7$. The answer is $\\frac{7}{5}$.\n\nCheck: add back. $\\frac{7}{5} + \\frac{3}{5} = \\frac{10}{5}$, which is 2.\n\n> **Watch out.** Write the whole number in fifths first. $2 - \\frac{3}{5}$ is not $\\frac{2 - 3}{5}$.",
        "$2 - \\frac{3}{5}$：每个整体是 5 个五分之一，所以 2 个整体是 $\\frac{10}{5}$。再把分子相减：$10 - 3 = 7$。答案是 $\\frac{7}{5}$。\n\n检验：加回去。$\\frac{7}{5} + \\frac{3}{5} = \\frac{10}{5}$，就是 2。\n\n> **注意。** 先把整数写成五分之几。$2 - \\frac{3}{5}$ 不是 $\\frac{2 - 3}{5}$。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const w = rng.int(1, 3);
        const b = coprimeTo(rng, d, 1, d - 1);
        const r = w * d - b;
        return answered(
          [`Find $${w} - ${fr(b, d)}$. Give the answer as a fraction.`, `计算 $${w} - ${fr(b, d)}$，答案写成分数。`],
          qf(r, d),
          [
            [
              ["Write the whole number in parts", "把整数写成分数"],
              [`Each whole is ${d} parts, so $${w} = ${fr(w * d, d)}$.`, `每个整体是 ${d} 份，所以 $${w} = ${fr(w * d, d)}$。`],
            ],
            [
              ["Subtract the tops", "分子相减"],
              [`$${w * d} - ${b} = ${r}$, so the answer is $${fr(r, d)}$.`, `$${w * d} - ${b} = ${r}$，所以答案是 $${fr(r, d)}$。`],
            ],
          ],
          [
            `Add back to get ${w}: $${fr(r, d)} + ${fr(b, d)} = ${fr(w * d, d)} = ${w}$.`,
            `加回去得到 ${w}：$${fr(r, d)} + ${fr(b, d)} = ${fr(w * d, d)} = ${w}$。`,
          ],
          [
            [qf(d - b, d), "That takes the fraction from 1 whole, not from all the wholes.", "这是从 1 个整体里减，没有用上所有的整体。"],
            [qf(w * d + b, d), "That adds instead of taking away.", "这是相加，应该相减。"],
            [
              qf(w - b, d),
              "That treats the whole number as a top, without writing it in parts first.",
              "这把整数直接当成了分子，没有先写成分数。",
            ],
          ],
          { form: "fraction", figure: barFigure(d, r, w) },
        );
      },
      barFigure(5, 7, 2),
    ),
  ],
  t(
    "There is $\\frac{7}{8}$ of a pie on the table. Sam eats $\\frac{3}{8}$ of the pie. Take 3 eighths away from 7 eighths: $\\frac{4}{8}$ of the pie is left.\n\nCheck: $\\frac{4}{8} + \\frac{3}{8} = \\frac{7}{8}$, the pie we started with.\n\nIn this lesson we subtract fractions with the same bottom number, and take fractions away from whole numbers.",
    "桌上有一个馅饼的 $\\frac{7}{8}$。山姆吃了这个馅饼的 $\\frac{3}{8}$。从 7 个八分之一里拿走 3 个：还剩这个馅饼的 $\\frac{4}{8}$。\n\n检验：$\\frac{4}{8} + \\frac{3}{8} = \\frac{7}{8}$，正是原来的馅饼。\n\n本课我们计算同分母分数减法，以及用整数减分数。",
  ),
);

export const addingFractionsWithLikeDenominatorsWordProblems = topic(
  "adding-fractions-with-like-denominators-word-problems",
  t("Adding Fractions With Like Denominators: Word Problems", "同分母分数加法应用题"),
  t(
    "Word problems that join two amounts measured in the same fractional parts are solved by adding the fractions: walking 3/10 mile and then 4/10 mile is 7/10 mile in all.",
    "把两个以同样分数单位度量的量合在一起的应用题，用分数加法解决：先走 3/10 英里，再走 4/10 英里，一共走了 7/10 英里。",
  ),
  ["adding-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [fractionStory("adding-measured-fractions", false, 0), fractionStory("adding-parts-of-a-whole", false, 1)],
  t(
    'Ava walks $\\frac{3}{10}$ mile in the morning and $\\frac{4}{10}$ mile in the afternoon. How far does she walk in all? "In all" means join the two walks: $\\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}$ mile.\n\nCheck: $\\frac{7}{10} - \\frac{4}{10} = \\frac{3}{10}$, the morning walk.\n\nIn this lesson we solve stories that join two fractions with the same bottom number.',
    "阿娃上午走了 $\\frac{3}{10}$ 英里，下午走了 $\\frac{4}{10}$ 英里。她一共走了多远？“一共”就是把两段路合起来：$\\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}$ 英里。\n\n检验：$\\frac{7}{10} - \\frac{4}{10} = \\frac{3}{10}$，正是上午走的。\n\n本课我们解决把两个同分母分数合起来的应用题。",
  ),
);

export const subtractingFractionsWithLikeDenominatorsWordProblems = topic(
  "subtracting-fractions-with-like-denominators-word-problems",
  t("Subtracting Fractions With Like Denominators: Word Problems", "同分母分数减法应用题"),
  t(
    "Word problems that take away part of an amount or compare two amounts are solved by subtracting fractions: 7/8 of a pie minus the 3/8 that was eaten leaves 4/8 = 1/2.",
    "从一个量中拿走一部分，或者比较两个量的应用题，用分数减法解决：7/8 个馅饼吃掉 3/8，还剩 4/8 = 1/2。",
  ),
  ["subtracting-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [fractionStory("subtracting-measured-fractions", true, 0), fractionStory("subtracting-parts-of-a-whole", true, 1)],
  t(
    "Emma uses $\\frac{7}{8}$ cup of flour for bread and $\\frac{2}{8}$ cup for muffins. How much more does the bread use? Compare the two: $\\frac{7}{8} - \\frac{2}{8} = \\frac{5}{8}$ cup.\n\nCheck: $\\frac{2}{8} + \\frac{5}{8} = \\frac{7}{8}$, the flour for bread.\n\nIn this lesson we solve stories that take away or compare fractions with the same bottom number.",
    "艾玛做面包用了 $\\frac{7}{8}$ 杯面粉，做松饼用了 $\\frac{2}{8}$ 杯。做面包多用了多少？把两个量比一比：$\\frac{7}{8} - \\frac{2}{8} = \\frac{5}{8}$ 杯。\n\n检验：$\\frac{2}{8} + \\frac{5}{8} = \\frac{7}{8}$，正是做面包用的面粉。\n\n本课我们解决拿走一部分或比较两个同分母分数的应用题。",
  ),
);

export const decomposingFractionsIntoSumsUsingModels = topic(
  "decomposing-fractions-into-sums-using-models",
  t("Decomposing Fractions Into Sums Using Models", "用模型把分数拆成和"),
  t(
    "A fraction can be split into a sum of fractions with the same denominator by splitting its shaded parts into groups: 5/8 = 1/8 + 1/8 + 1/8 + 1/8 + 1/8 = 2/8 + 3/8.",
    "把涂色部分分成几组，就能把一个分数拆成几个同分母分数的和：5/8 = 1/8 + 1/8 + 1/8 + 1/8 + 1/8 = 2/8 + 3/8。",
  ),
  ["adding-fractions-with-like-denominators-using-models"],
  ["4.NF.B.3"],
  [
    point(
      "fractions-as-sums-of-unit-fractions",
      ["Sums of unit fractions", "分数单位的和"],
      [
        "$\\frac{4}{7}$ is 4 parts, and each part is $\\frac{1}{7}$. So $\\frac{4}{7} = \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7}$.\n\nCheck: add the tops, $1 + 1 + 1 + 1 = 4$.\n\n> **Watch out.** Count only the shaded parts. The 7 parts of the whole bar are not the answer.",
        "$\\frac{4}{7}$ 是 4 份，每份是 $\\frac{1}{7}$。所以 $\\frac{4}{7} = \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7}$。\n\n检验：分子相加，$1 + 1 + 1 + 1 = 4$。\n\n> **注意。** 只数涂色的份。整个长条的 7 份不是答案。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(2, d - 1);
        return answered(
          [
            `The model shows $${fr(n, d)}$. How many copies of $${fr(1, d)}$ add up to $${fr(n, d)}$?`,
            `模型表示 $${fr(n, d)}$。几个 $${fr(1, d)}$ 相加等于 $${fr(n, d)}$？`,
          ],
          n,
          [
            [
              ["Find the unit", "找分数单位"],
              [`The bar is cut into ${d} parts, so each part is $${fr(1, d)}$.`, `长条平均分成 ${d} 份，每份是 $${fr(1, d)}$。`],
            ],
            [
              ["Count the shaded parts", "数涂色的份"],
              [`${n} parts are shaded, so ${n} copies.`, `涂了 ${n} 份，所以是 ${n} 个。`],
            ],
          ],
          [
            `Add ${n} copies of $${fr(1, d)}$: the tops make ${n}, so the sum is $${fr(n, d)}$.`,
            `把 ${n} 个 $${fr(1, d)}$ 相加：分子合起来是 ${n}，和是 $${fr(n, d)}$。`,
          ],
          [
            [d, "That counts all the parts, not only the shaded ones.", "这数的是全部的份，不只是涂色的。"],
            [d - n, "That counts the unshaded parts.", "这数的是没涂色的份。"],
            [n + 1, "That counts one part too many.", "这多数了一份。"],
          ],
          { form: "integer", figure: barFigure(d, n) },
        );
      },
      barFigure(7, 4),
    ),
    point(
      "splitting-a-model-into-two-parts",
      ["Two groups of parts", "分成两组"],
      [
        "$\\frac{5}{8}$ has 5 shaded parts. Put 2 in one group. The other group has $5 - 2 = 3$. So $\\frac{5}{8} = \\frac{2}{8} + \\frac{3}{8}$.\n\nCheck: $2 + 3 = 5$, all the shaded parts.\n\n> **Watch out.** Both groups keep the bottom 8. Only the shaded parts are split.",
        "$\\frac{5}{8}$ 有 5 份涂色。把 2 份分成一组，另一组是 $5 - 2 = 3$ 份。所以 $\\frac{5}{8} = \\frac{2}{8} + \\frac{3}{8}$。\n\n检验：$2 + 3 = 5$，正是全部涂色的份。\n\n> **注意。** 两组的分母都还是 8。拆开的只是涂色的份。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(2, d - 1);
        const a = rng.int(1, n - 1);
        return answered(
          [
            `Use the model to fill in the box: $$${fr(n, d)} = ${fr(a, d)} + \\frac{\\square}{${d}}$$`,
            `利用模型填空：$$${fr(n, d)} = ${fr(a, d)} + \\frac{\\square}{${d}}$$`,
          ],
          n - a,
          [
            [
              ["Count all the shaded parts", "数全部涂色的份"],
              [`$${fr(n, d)}$ has ${n} shaded parts.`, `$${fr(n, d)}$ 有 ${n} 份涂色。`],
            ],
            [
              ["Take away the first group", "去掉第一组"],
              [`$${n} - ${a} = ${n - a}$ parts are left for the second group.`, `第二组还剩 $${n} - ${a} = ${n - a}$ 份。`],
            ],
          ],
          [`Add the groups: $${a} + ${n - a} = ${n}$.`, `两组相加：$${a} + ${n - a} = ${n}$。`],
          [
            [n + a, "That adds instead of taking away.", "这是相加，应该相减。"],
            [d - a, "That uses all the parts of the bar, not only the shaded ones.", "这用了长条的全部份数，不只是涂色的。"],
            [n, "That is all the shaded parts, not the second group.", "这是全部涂色的份，不是第二组。"],
          ],
          { form: "integer", figure: barFigure(d, n) },
        );
      },
      barFigure(8, 5),
    ),
  ],
  t(
    "A bar is cut into 8 equal parts, and 5 are shaded: $\\frac{5}{8}$. Split the shaded parts into a group of 2 and a group of 3. Then $\\frac{5}{8} = \\frac{2}{8} + \\frac{3}{8}$.\n\nCheck: $2 + 3 = 5$ shaded parts.\n\nIn this lesson we split a fraction into a sum of fractions with the same bottom number.",
    "一个长条平均分成 8 份，涂了 5 份：$\\frac{5}{8}$。把涂色的份分成 2 份一组和 3 份一组。于是 $\\frac{5}{8} = \\frac{2}{8} + \\frac{3}{8}$。\n\n检验：$2 + 3 = 5$，正是涂色的份数。\n\n本课我们把一个分数拆成几个同分母分数的和。",
  ),
);

export const decomposingFractionsIntoSums = topic(
  "decomposing-fractions-into-sums",
  t("Decomposing Fractions Into Sums", "把分数拆成和"),
  t(
    "Any split of the numerator gives a sum with the same denominator: 7/10 = 2/10 + 5/10 = 1/10 + 2/10 + 4/10. The denominators are not split: 7/10 is not 3/5 + 4/5.",
    "把分子拆开，就得到同分母分数的和：7/10 = 2/10 + 5/10 = 1/10 + 2/10 + 4/10。分母不能拆：7/10 不等于 3/5 + 4/5。",
  ),
  ["decomposing-fractions-into-sums-using-models", "adding-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [
    point(
      "choosing-a-correct-decomposition",
      ["Which sum is equal?", "哪个和相等"],
      [
        "Is $\\frac{3}{10} + \\frac{4}{10}$ equal to $\\frac{7}{10}$? The bottoms are all 10, and the tops add to $3 + 4 = 7$. So yes.\n\nCheck: on a bar of 10 parts, shading 3 parts and then 4 more shades 7.\n\n> **Watch out.** The bottom must not be split. $\\frac{3}{5} + \\frac{4}{5}$ is $\\frac{7}{5}$, not $\\frac{7}{10}$.",
        "$\\frac{3}{10} + \\frac{4}{10}$ 等于 $\\frac{7}{10}$ 吗？分母都是 10，分子相加 $3 + 4 = 7$。所以相等。\n\n检验：在分成 10 份的长条上，先涂 3 份，再涂 4 份，一共涂了 7 份。\n\n> **注意。** 分母不能拆。$\\frac{3}{5} + \\frac{4}{5}$ 是 $\\frac{7}{5}$，不是 $\\frac{7}{10}$。",
      ],
      (rng) => {
        const d = rng.int(5, 15);
        const n = rng.int(3, d - 1);
        const a = rng.int(1, n - 1);
        const hd = Math.floor(d / 2);
        return pickedMath(
          rng,
          [`Which sum is equal to $${fr(n, d)}$?`, `哪个和等于 $${fr(n, d)}$？`],
          `${fr(a, d)} + ${fr(n - a, d)}`,
          [
            [`${fr(a, d)} + ${fr(n - a + 1, d)}`, `The tops add to ${n + 1}, not ${n}.`, `分子相加是 ${n + 1}，不是 ${n}。`],
            [
              `${fr(a, hd)} + ${fr(n - a, d - hd)}`,
              `The bottom ${d} was split too, so the parts changed size.`,
              `分母 ${d} 也被拆开了，每份的大小变了。`,
            ],
            [`${fr(n, d)} + ${fr(a, d)}`, `The tops add to ${n + a}, not ${n}.`, `分子相加是 ${n + a}，不是 ${n}。`],
          ],
          [
            [
              ["Check the bottoms", "看分母"],
              [`Every part must have bottom ${d}, the same as $${fr(n, d)}$.`, `每一部分的分母都要是 ${d}，和 $${fr(n, d)}$ 一样。`],
            ],
            [
              ["Check the tops", "看分子"],
              [`$${a} + ${n - a} = ${n}$, the top of $${fr(n, d)}$.`, `$${a} + ${n - a} = ${n}$，正是 $${fr(n, d)}$ 的分子。`],
            ],
          ],
          [
            `On a bar of ${d} parts, shading ${a} and then ${n - a} more shades ${n} parts.`,
            `在分成 ${d} 份的长条上，先涂 ${a} 份，再涂 ${n - a} 份，一共涂了 ${n} 份。`,
          ],
          barFigure(d, n),
        );
      },
      barFigure(10, 7),
    ),
    point(
      "completing-a-decomposition-into-three-fractions",
      ["Three parts", "拆成三个分数"],
      [
        "$\\frac{9}{11} = \\frac{2}{11} + \\frac{3}{11} + \\frac{\\square}{11}$. The tops must add to 9. The known tops give $2 + 3 = 5$, and $9 - 5 = 4$. So the missing part is $\\frac{4}{11}$.\n\nCheck: $2 + 3 + 4 = 9$.\n\n> **Watch out.** Take away both known tops. Taking away only the 2 gives 7, which is too many.",
        "$\\frac{9}{11} = \\frac{2}{11} + \\frac{3}{11} + \\frac{\\square}{11}$。分子相加要等于 9。已知的分子是 $2 + 3 = 5$，$9 - 5 = 4$。所以缺少的部分是 $\\frac{4}{11}$。\n\n检验：$2 + 3 + 4 = 9$。\n\n> **注意。** 两个已知的分子都要减去。只减去 2 会得到 7，太多了。",
      ],
      (rng) => {
        const d = rng.int(5, 15);
        const n = rng.int(3, d + 4);
        const a = rng.int(1, n - 2);
        const b = rng.int(1, n - 1 - a);
        const r = n - a - b;
        return answered(
          [
            `Fill in the box: $$${fr(n, d)} = ${fr(a, d)} + ${fr(b, d)} + \\frac{\\square}{${d}}$$`,
            `填空：$$${fr(n, d)} = ${fr(a, d)} + ${fr(b, d)} + \\frac{\\square}{${d}}$$`,
          ],
          r,
          [
            [
              ["Add the known tops", "把已知的分子相加"],
              [`$${a} + ${b} = ${a + b}$.`, `$${a} + ${b} = ${a + b}$。`],
            ],
            [
              ["Find what is missing", "求缺少的部分"],
              [`The tops must make ${n}: $${n} - ${a + b} = ${r}$.`, `分子要合成 ${n}：$${n} - ${a + b} = ${r}$。`],
            ],
          ],
          [`Add all three tops: $${a} + ${b} + ${r} = ${n}$.`, `三个分子相加：$${a} + ${b} + ${r} = ${n}$。`],
          [
            [n - a, "That takes away only the first top.", "这只减去了第一个分子。"],
            [n + a + b, "That adds instead of taking away.", "这是相加，应该相减。"],
            [d - a - b, `That starts from the bottom ${d} instead of the top ${n}.`, `这是从分母 ${d} 减起，应该从分子 ${n} 减起。`],
          ],
          { form: "integer" },
        );
      },
      tapeFigure(
        [
          {
            total: "9/11",
            pieces: [
              { size: 2, text: "2/11", lit: true },
              { size: 3, text: "3/11", lit: true },
              { size: 4, text: "?", dashed: true },
            ],
          },
        ],
        ["A bar for 9/11 split into 2/11, 3/11 and a missing part.", "一个表示 9/11 的长条，分成 2/11、3/11 和缺少的一部分。"],
      ),
    ),
  ],
  t(
    "A recipe needs $\\frac{7}{10}$ liter of milk, but the cup holds less. Pour $\\frac{3}{10}$ liter, then $\\frac{4}{10}$ liter. That works because $3 + 4 = 7$.\n\nCheck: $\\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}$.\n\nIn this lesson we split a fraction into a sum by splitting its top and keeping its bottom.",
    "做一道菜需要 $\\frac{7}{10}$ 升牛奶，可是杯子装不下。先倒 $\\frac{3}{10}$ 升，再倒 $\\frac{4}{10}$ 升。这样可以，因为 $3 + 4 = 7$。\n\n检验：$\\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}$。\n\n本课我们把分子拆开、分母不变，把一个分数拆成几个分数的和。",
  ),
);

// ---------------------------------------------------------------------------
// Adding and subtracting mixed numbers

/** MixedPair is w1 r1/d and w2 r2/d. */
interface MixedPair {
  readonly w1: number;
  readonly r1: number;
  readonly w2: number;
  readonly r2: number;
  readonly d: number;
}

/** mixedPair draws two mixed numbers with like denominators whose sum or difference has a fraction part in lowest terms. */
function mixedPair(rng: Rng, op: "add" | "addRegroup" | "sub" | "subBorrow"): MixedPair {
  for (;;) {
    const d = rng.int(3, 12);
    const r1 = rng.int(1, d - 1);
    const r2 = rng.int(1, d - 1);
    const w1 = rng.int(1, 9);
    const w2 = rng.int(1, 9);
    if (op === "add" && r1 + r2 < d && gcd(r1 + r2, d) === 1) return { w1, r1, w2, r2, d };
    if (op === "addRegroup" && r1 + r2 > d && gcd(r1 + r2 - d, d) === 1) return { w1, r1, w2, r2, d };
    if (op === "sub" && w1 > w2 && r1 > r2 && gcd(r1 - r2, d) === 1) return { w1, r1, w2, r2, d };
    if (op === "subBorrow" && w1 >= w2 + 2 && r1 < r2 && gcd(d + r1 - r2, d) === 1) return { w1, r1, w2, r2, d };
  }
}

/** mixedValue is the value of w r/d. */
const mixedValue = (w: number, r: number, d: number) => qf(w * d + r, d);

/** partsLine is a number line from lo to hi in steps of 1/d with the whole numbers labelled, points given in parts of 1/d, and jumps between such points. */
function partsLine(d: number, lo: number, hi: number, marks: readonly [number, string][], jumps: readonly [number, number][] = []): Figure {
  const shown = marks.map((m) => m[1]);
  return lineFigure(
    {
      lo,
      hi,
      step: 1 / d,
      labels: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
      marks: marks.map(([p, text]) => ({ at: p / d, text })),
      jumps: jumps.map(([a, b]): [number, number] => [a / d, b / d]),
    },
    [
      `A number line from ${lo} to ${hi} in steps of 1/${d}, with ${shown.join(" and ")} marked${jumps.length ? " and jumps between them" : ""}.`,
      `一条从 ${lo} 到 ${hi} 的数轴，每格是 1/${d}，标出了 ${shown.join(" 和 ")}${jumps.length ? "，并画出了跳跃" : ""}。`,
    ],
  );
}

/** mixedStory builds a word-problem knowledge point for adding or subtracting mixed numbers, with or without regrouping. */
function mixedStory(id: string, subtract: boolean, regroup: boolean): KnowledgePointDef {
  const explanation: Pair = !regroup
    ? subtract
      ? [
          "A rope is $4\\frac{5}{7}$ yards long. $1\\frac{1}{7}$ yards are cut off. How much is left? Wholes: $4 - 1 = 3$. Parts: $\\frac{5}{7} - \\frac{1}{7} = \\frac{4}{7}$. So $3\\frac{4}{7}$ yards are left.\n\nCheck: add back. $3\\frac{4}{7} + 1\\frac{1}{7} = 4\\frac{5}{7}$.\n\n> **Watch out.** The piece cut off is not the answer. The question asks how much is left.",
          "一根绳子长 $4\\frac{5}{7}$ 码，剪掉 $1\\frac{1}{7}$ 码。还剩多少？整数部分：$4 - 1 = 3$。分数部分：$\\frac{5}{7} - \\frac{1}{7} = \\frac{4}{7}$。所以还剩 $3\\frac{4}{7}$ 码。\n\n检验：加回去。$3\\frac{4}{7} + 1\\frac{1}{7} = 4\\frac{5}{7}$。\n\n> **注意。** 剪掉的那段不是答案。问题问的是还剩多少。",
        ]
      : [
          'Ava used $1\\frac{2}{8}$ cups of flour for bread and $2\\frac{3}{8}$ cups for muffins. "In all" asks for a sum. Wholes: $1 + 2 = 3$. Parts: $\\frac{2}{8} + \\frac{3}{8} = \\frac{5}{8}$. She used $3\\frac{5}{8}$ cups.\n\nCheck: $3\\frac{5}{8} - 2\\frac{3}{8} = 1\\frac{2}{8}$, the flour for bread.\n\n> **Watch out.** Add the wholes as well as the parts. $\\frac{5}{8}$ alone leaves out the 3 wholes.',
          "阿娃做面包用了 $1\\frac{2}{8}$ 杯面粉，做松饼用了 $2\\frac{3}{8}$ 杯。“一共”求的是和。整数部分：$1 + 2 = 3$。分数部分：$\\frac{2}{8} + \\frac{3}{8} = \\frac{5}{8}$。她一共用了 $3\\frac{5}{8}$ 杯。\n\n检验：$3\\frac{5}{8} - 2\\frac{3}{8} = 1\\frac{2}{8}$，正是做面包用的面粉。\n\n> **注意。** 整数部分和分数部分都要加。只写 $\\frac{5}{8}$ 就漏掉了 3 个整数。",
        ]
    : subtract
      ? [
          "A board is $5\\frac{1}{5}$ feet long. $1\\frac{3}{5}$ feet are cut off. $\\frac{1}{5}$ is less than $\\frac{3}{5}$, so write both in fifths: $\\frac{26}{5} - \\frac{8}{5} = \\frac{18}{5}$. That is $3\\frac{3}{5}$ feet left.\n\nCheck: add back. $3\\frac{3}{5} + 1\\frac{3}{5} = 4\\frac{6}{5} = 5\\frac{1}{5}$.\n\n> **Watch out.** Do not take $\\frac{1}{5}$ from $\\frac{3}{5}$ instead. That turns the subtraction around.",
          "一块木板长 $5\\frac{1}{5}$ 英尺，锯掉 $1\\frac{3}{5}$ 英尺。$\\frac{1}{5}$ 比 $\\frac{3}{5}$ 小，所以都写成五分之几：$\\frac{26}{5} - \\frac{8}{5} = \\frac{18}{5}$。还剩 $3\\frac{3}{5}$ 英尺。\n\n检验：加回去。$3\\frac{3}{5} + 1\\frac{3}{5} = 4\\frac{6}{5} = 5\\frac{1}{5}$。\n\n> **注意。** 不能反过来用 $\\frac{3}{5}$ 减 $\\frac{1}{5}$。那样就把减法弄反了。",
        ]
      : [
          "Ben walked $2\\frac{3}{8}$ miles in the morning and $1\\frac{6}{8}$ miles in the afternoon. Wholes: $2 + 1 = 3$. Parts: $\\frac{3}{8} + \\frac{6}{8} = \\frac{9}{8}$. That is 1 whole and $\\frac{1}{8}$ more, so he walked $4\\frac{1}{8}$ miles.\n\nCheck: in eighths, $\\frac{19}{8} + \\frac{14}{8} = \\frac{33}{8} = 4\\frac{1}{8}$.\n\n> **Watch out.** Do not drop the whole that the parts make. $3\\frac{1}{8}$ is one mile short.",
          "本上午走了 $2\\frac{3}{8}$ 英里，下午走了 $1\\frac{6}{8}$ 英里。整数部分：$2 + 1 = 3$。分数部分：$\\frac{3}{8} + \\frac{6}{8} = \\frac{9}{8}$。这是 1 个整数还多 $\\frac{1}{8}$，所以他一共走了 $4\\frac{1}{8}$ 英里。\n\n检验：化成八分之几，$\\frac{19}{8} + \\frac{14}{8} = \\frac{33}{8} = 4\\frac{1}{8}$。\n\n> **注意。** 分数部分凑成的整数不能丢。$3\\frac{1}{8}$ 少了 1 英里。",
        ];
  const example = !regroup
    ? subtract
      ? partsLine(
          7,
          3,
          5,
          [
            [33, "4 5/7"],
            [25, "3 4/7"],
          ],
          [
            [33, 26],
            [26, 25],
          ],
        )
      : partsLine(
          8,
          1,
          4,
          [
            [10, "1 2/8"],
            [29, "3 5/8"],
          ],
          [
            [10, 26],
            [26, 29],
          ],
        )
    : subtract
      ? partsLine(
          5,
          3,
          6,
          [
            [26, "5 1/5"],
            [18, "3 3/5"],
          ],
          [
            [26, 21],
            [21, 18],
          ],
        )
      : partsLine(
          8,
          2,
          5,
          [
            [19, "2 3/8"],
            [33, "4 1/8"],
          ],
          [
            [19, 27],
            [27, 33],
          ],
        );
  return point(
    id,
    regroup
      ? subtract
        ? ["Borrowing a whole", "借一个整数"]
        : ["Regrouping into a whole", "进位成整数"]
      : ["Without regrouping", "不需要进位或借位"],
    explanation,
    (rng) => {
      const name = rng.pick(names);
      const p = mixedPair(rng, subtract ? (regroup ? "subBorrow" : "sub") : regroup ? "addRegroup" : "add");
      const a = mixedValue(p.w1, p.r1, p.d);
      const b = mixedValue(p.w2, p.r2, p.d);
      const value = subtract ? a.sub(b) : a.add(b);
      const [x, y, z] = [mx(p.w1, p.r1, p.d), mx(p.w2, p.r2, p.d), mixedLatex(value)];
      const am = rng.pick(amounts);
      const plural = (s: string) =>
        s.replace(" mile", " miles").replace(" cup", " cups").replace(" hour", " hours").replace(" liter", " liters");
      const story = am.first(name, `$${x}$`);
      const more = am.second(name, `$${y}$`);
      const ask = subtract ? am.difference : am.together;
      const tops = [p.w1 * p.d + p.r1, p.w2 * p.d + p.r2];
      const work: Walk[] = subtract
        ? regroup
          ? [
              [
                ["Change to improper fractions", "化成假分数"],
                [
                  `$${fr(p.r1, p.d)}$ is less than $${fr(p.r2, p.d)}$, so write both in parts: $${fr(tops[0]!, p.d)} - ${fr(tops[1]!, p.d)} = ${fr(tops[0]! - tops[1]!, p.d)}$.`,
                  `$${fr(p.r1, p.d)}$ 比 $${fr(p.r2, p.d)}$ 小，所以都化成假分数：$${fr(tops[0]!, p.d)} - ${fr(tops[1]!, p.d)} = ${fr(tops[0]! - tops[1]!, p.d)}$。`,
                ],
              ],
              [
                ["Change back", "化回带分数"],
                [`$${fr(tops[0]! - tops[1]!, p.d)} = ${z}$.`, `$${fr(tops[0]! - tops[1]!, p.d)} = ${z}$。`],
              ],
            ]
          : [
              [
                ["Subtract wholes and parts", "整数和分数分别相减"],
                [
                  `Wholes: $${p.w1} - ${p.w2} = ${p.w1 - p.w2}$. Parts: $${fr(p.r1, p.d)} - ${fr(p.r2, p.d)} = ${fr(p.r1 - p.r2, p.d)}$.`,
                  `整数部分：$${p.w1} - ${p.w2} = ${p.w1 - p.w2}$。分数部分：$${fr(p.r1, p.d)} - ${fr(p.r2, p.d)} = ${fr(p.r1 - p.r2, p.d)}$。`,
                ],
              ],
            ]
        : [
            [
              ["Add wholes and parts", "整数和分数分别相加"],
              [
                `Wholes: $${p.w1} + ${p.w2} = ${p.w1 + p.w2}$. Parts: $${fr(p.r1, p.d)} + ${fr(p.r2, p.d)} = ${fr(p.r1 + p.r2, p.d)}$.`,
                `整数部分：$${p.w1} + ${p.w2} = ${p.w1 + p.w2}$。分数部分：$${fr(p.r1, p.d)} + ${fr(p.r2, p.d)} = ${fr(p.r1 + p.r2, p.d)}$。`,
              ],
            ],
            ...(regroup
              ? [
                  [
                    ["Carry the whole", "进一个整数"],
                    [
                      `The parts make $${fr(p.r1 + p.r2, p.d)} = ${mx(1, p.r1 + p.r2 - p.d, p.d)}$. So the total is $${z}$.`,
                      `分数部分是 $${fr(p.r1 + p.r2, p.d)} = ${mx(1, p.r1 + p.r2 - p.d, p.d)}$。所以一共是 $${z}$。`,
                    ],
                  ] as Walk,
                ]
              : []),
          ];
      return answered(
        [
          `${plural(story.en)} ${plural(more.en)} ${ask.en} Write a mixed number.`,
          `${story["zh-CN"]}，${more["zh-CN"]}${ask["zh-CN"]}用带分数表示。`,
        ],
        value,
        [
          [
            ["Choose the operation", "选运算"],
            subtract
              ? ["The question asks how much more, a difference, so subtract.", "问题问多多少，求的是差，所以用减法。"]
              : ["The question asks for the amount in all, a sum, so add.", "问题问一共多少，求的是和，所以用加法。"],
          ],
          ...work,
        ],
        subtract
          ? [`Add back: $${z} + ${y} = ${x}$.`, `加回去：$${z} + ${y} = ${x}$。`]
          : [`Take one amount back: $${z} - ${y} = ${x}$.`, `减去其中一个量：$${z} - ${y} = ${x}$。`],
        subtract
          ? [
              [a.add(b), "That adds, but the question asks for a difference.", "这是相加，可是问题求的是差。"],
              [
                mixedValue(p.w1 - p.w2, Math.abs(p.r1 - p.r2), p.d),
                "That takes the smaller fraction from the larger, so the subtraction is turned around.",
                "这是用大的分数减小的分数，把减法弄反了。",
              ],
              [
                mixedValue(p.w1 - p.w2, p.r1 + p.r2, p.d),
                "That adds the parts instead of taking them away.",
                "这把分数部分加起来了，应该相减。",
              ],
            ]
          : [
              [
                mixedValue(p.w1 + p.w2, p.r1 + p.r2 - p.d, p.d),
                "That drops the whole that the parts make.",
                "这丢掉了分数部分凑成的整数。",
              ],
              [a.sub(b).abs(), "That subtracts, but the question asks for a total.", "这是相减，可是问题求的是总数。"],
              [
                mixedValue(p.w1 + p.w2, p.r1 + p.r2, 2 * p.d),
                "That adds the bottoms too. The parts keep their size.",
                "这把分母也加了。每份的大小不变。",
              ],
            ],
        { form: "mixed" },
      );
    },
    example,
  );
}

export const addingMixedNumbersWithLikeDenominators = topic(
  "adding-mixed-numbers-with-like-denominators",
  t("Adding Mixed Numbers With Like Denominators", "同分母带分数加法"),
  t(
    "To add mixed numbers, add the whole numbers and add the fractions. If the fractions add up to 1 or more, regroup: 2 3/5 + 1 4/5 = 3 7/5 = 4 2/5.",
    "带分数相加，整数部分与整数部分相加，分数部分与分数部分相加。分数部分的和大于或等于 1 时要进位：2 3/5 + 1 4/5 = 3 7/5 = 4 2/5。",
  ),
  ["adding-fractions-with-like-denominators", "converting-improper-fractions-to-mixed-numbers"],
  ["4.NF.B.3"],
  [
    point(
      "adding-mixed-numbers-without-regrouping",
      ["Without regrouping", "不进位"],
      [
        "$3\\frac{1}{6} + 2\\frac{4}{6}$: add the wholes, $3 + 2 = 5$. Add the parts, $\\frac{1}{6} + \\frac{4}{6} = \\frac{5}{6}$. The sum is $5\\frac{5}{6}$.\n\nCheck: on the number line, jump 2 from $3\\frac{1}{6}$ and then 4 sixths more. You land on $5\\frac{5}{6}$.\n\n> **Watch out.** Do not add the bottoms. The parts are still sixths, so the sum is not $5\\frac{5}{12}$.",
        "$3\\frac{1}{6} + 2\\frac{4}{6}$：整数相加，$3 + 2 = 5$。分数相加，$\\frac{1}{6} + \\frac{4}{6} = \\frac{5}{6}$。和是 $5\\frac{5}{6}$。\n\n检验：在数轴上，从 $3\\frac{1}{6}$ 先跳 2，再跳 4 个六分之一，落在 $5\\frac{5}{6}$。\n\n> **注意。** 分母不能相加。每份仍是六分之一，所以和不是 $5\\frac{5}{12}$。",
      ],
      (rng) => {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "add");
        const sum = mx(w1 + w2, r1 + r2, d);
        const [a, b] = [w1 * d + r1, w2 * d + r2];
        return answered(
          [
            `Find $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$，答案写成带分数。`,
          ],
          mixedValue(w1 + w2, r1 + r2, d),
          [
            [
              ["Add the wholes", "整数相加"],
              [`$${w1} + ${w2} = ${w1 + w2}$.`, `$${w1} + ${w2} = ${w1 + w2}$。`],
            ],
            [
              ["Add the parts", "分数相加"],
              [
                `The parts make $${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)}$. That is less than 1, so the sum is $${sum}$.`,
                `分数部分是 $${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)}$。不满 1，所以和是 $${sum}$。`,
              ],
            ],
          ],
          [
            `Use improper fractions instead: $${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)} = ${sum}$.`,
            `改用假分数算：$${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)} = ${sum}$。`,
          ],
          [
            [
              mixedValue(w1 + w2, r1 + r2, 2 * d),
              "That adds the bottoms too. The parts keep their size.",
              "这把分母也加了。每份的大小不变。",
            ],
            [
              mixedValue(w1 + w2 + 1, r1 + r2, d),
              "That carries a whole, but the parts make less than 1.",
              "这进了一个整数，可是分数部分不满 1。",
            ],
            [qf(r1 + r2, d), "That leaves out the wholes.", "这漏掉了整数部分。"],
          ],
          { form: "mixed" },
        );
      },
      partsLine(
        6,
        3,
        6,
        [
          [19, "3 1/6"],
          [35, "5 5/6"],
        ],
        [
          [19, 31],
          [31, 35],
        ],
      ),
    ),
    point(
      "adding-mixed-numbers-with-regrouping",
      ["With regrouping", "要进位"],
      [
        "$2\\frac{3}{5} + 1\\frac{4}{5}$: the wholes make $2 + 1 = 3$. The parts make $\\frac{7}{5}$. That is 1 whole and $\\frac{2}{5}$ more, so carry the whole: $3 + 1\\frac{2}{5} = 4\\frac{2}{5}$.\n\nCheck: in fifths, $\\frac{13}{5} + \\frac{9}{5} = \\frac{22}{5} = 4\\frac{2}{5}$.\n\n> **Watch out.** Do not drop the whole that the parts make. $3\\frac{2}{5}$ is one short.",
        "$2\\frac{3}{5} + 1\\frac{4}{5}$：整数部分是 $2 + 1 = 3$。分数部分是 $\\frac{7}{5}$，也就是 1 个整数还多 $\\frac{2}{5}$，所以进一：$3 + 1\\frac{2}{5} = 4\\frac{2}{5}$。\n\n检验：化成五分之几，$\\frac{13}{5} + \\frac{9}{5} = \\frac{22}{5} = 4\\frac{2}{5}$。\n\n> **注意。** 分数部分凑成的整数不能丢。$3\\frac{2}{5}$ 少了 1。",
      ],
      (rng) => {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "addRegroup");
        const r = r1 + r2 - d;
        const [a, b] = [w1 * d + r1, w2 * d + r2];
        return answered(
          [
            `Find $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$，答案写成带分数。`,
          ],
          mixedValue(w1 + w2 + 1, r, d),
          [
            [
              ["Add the wholes", "整数相加"],
              [`$${w1} + ${w2} = ${w1 + w2}$.`, `$${w1} + ${w2} = ${w1 + w2}$。`],
            ],
            [
              ["Add the parts", "分数相加"],
              [
                `$${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)} = ${mx(1, r, d)}$.`,
                `$${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)} = ${mx(1, r, d)}$。`,
              ],
            ],
            [
              ["Carry the whole", "进一个整数"],
              [`$${w1 + w2} + ${mx(1, r, d)} = ${mx(w1 + w2 + 1, r, d)}$.`, `$${w1 + w2} + ${mx(1, r, d)} = ${mx(w1 + w2 + 1, r, d)}$。`],
            ],
          ],
          [
            `Use improper fractions instead: $${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)} = ${mx(w1 + w2 + 1, r, d)}$.`,
            `改用假分数算：$${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)} = ${mx(w1 + w2 + 1, r, d)}$。`,
          ],
          [
            [mixedValue(w1 + w2, r, d), "That drops the whole that the parts make.", "这丢掉了分数部分凑成的整数。"],
            [
              mixedValue(w1 + w2 + 2, r, d),
              "That carries two wholes, but the parts make only one.",
              "这进了两个整数，可是分数部分只凑成一个。",
            ],
            [
              mixedValue(w1 + w2, r1 + r2, 2 * d),
              "That adds the bottoms too. The parts keep their size.",
              "这把分母也加了。每份的大小不变。",
            ],
          ],
          { form: "mixed" },
        );
      },
      partsLine(
        5,
        2,
        5,
        [
          [13, "2 3/5"],
          [22, "4 2/5"],
        ],
        [
          [13, 18],
          [18, 22],
        ],
      ),
    ),
  ],
  t(
    "Ana walks $2\\frac{1}{4}$ miles on Monday and $1\\frac{2}{4}$ miles on Tuesday. Add the wholes: $2 + 1 = 3$. Add the fourths: $\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$. She walks $3\\frac{3}{4}$ miles.\n\nCheck: on the number line, jump 1 from $2\\frac{1}{4}$ to $3\\frac{1}{4}$, then 2 fourths more to $3\\frac{3}{4}$.\n\nIn this lesson we add mixed numbers: wholes with wholes and parts with parts.",
    "安娜星期一走了 $2\\frac{1}{4}$ 英里，星期二走了 $1\\frac{2}{4}$ 英里。整数相加：$2 + 1 = 3$。四分之几相加：$\\frac{1}{4} + \\frac{2}{4} = \\frac{3}{4}$。她一共走了 $3\\frac{3}{4}$ 英里。\n\n检验：在数轴上，从 $2\\frac{1}{4}$ 跳 1 到 $3\\frac{1}{4}$，再跳 2 个四分之一到 $3\\frac{3}{4}$。\n\n本课我们计算带分数加法：整数加整数，分数加分数。",
  ),
);

export const subtractingMixedNumbersWithLikeDenominators = topic(
  "subtracting-mixed-numbers-with-like-denominators",
  t("Subtracting Mixed Numbers With Like Denominators", "同分母带分数减法"),
  t(
    "When the first fraction is at least the second, subtract the whole numbers and subtract the fractions: 5 7/8 − 2 3/8 = 3 4/8 = 3 1/2.",
    "当被减数的分数部分不小于减数的分数部分时，整数部分相减，分数部分相减：5 7/8 − 2 3/8 = 3 4/8 = 3 1/2。",
  ),
  ["adding-mixed-numbers-with-like-denominators", "subtracting-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [
    point(
      "subtracting-mixed-numbers-without-borrowing",
      ["Two mixed numbers", "两个带分数相减"],
      [
        "$6\\frac{5}{7} - 2\\frac{1}{7}$: take away the wholes, $6 - 2 = 4$. Take away the parts, $\\frac{5}{7} - \\frac{1}{7} = \\frac{4}{7}$. The difference is $4\\frac{4}{7}$.\n\nCheck: add back. $4\\frac{4}{7} + 2\\frac{1}{7} = 6\\frac{5}{7}$.\n\n> **Watch out.** Take away the parts too. $4\\frac{5}{7}$ takes away only the 2 wholes.",
        "$6\\frac{5}{7} - 2\\frac{1}{7}$：整数相减，$6 - 2 = 4$。分数相减，$\\frac{5}{7} - \\frac{1}{7} = \\frac{4}{7}$。差是 $4\\frac{4}{7}$。\n\n检验：加回去。$4\\frac{4}{7} + 2\\frac{1}{7} = 6\\frac{5}{7}$。\n\n> **注意。** 分数部分也要减。$4\\frac{5}{7}$ 只减去了 2 个整数。",
      ],
      (rng) => {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "sub");
        const diff = mx(w1 - w2, r1 - r2, d);
        return answered(
          [
            `Find $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$，答案写成带分数。`,
          ],
          mixedValue(w1 - w2, r1 - r2, d),
          [
            [
              ["Subtract the wholes", "整数相减"],
              [`$${w1} - ${w2} = ${w1 - w2}$.`, `$${w1} - ${w2} = ${w1 - w2}$。`],
            ],
            [
              ["Subtract the parts", "分数相减"],
              [
                `The parts give $${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$. So the difference is $${diff}$.`,
                `分数部分是 $${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$。所以差是 $${diff}$。`,
              ],
            ],
          ],
          [`Add back: $${diff} + ${mx(w2, r2, d)} = ${mx(w1, r1, d)}$.`, `加回去：$${diff} + ${mx(w2, r2, d)} = ${mx(w1, r1, d)}$。`],
          [
            [mixedValue(w1 + w2, r1 - r2, d), "That adds the wholes instead of taking them away.", "这把整数部分加起来了，应该相减。"],
            [mixedValue(w1 - w2, r1 + r2, d), "That adds the parts instead of taking them away.", "这把分数部分加起来了，应该相减。"],
            [
              mixedValue(w1 - w2 - 1, r1 - r2, d),
              "That takes away an extra whole. The first fraction is big enough, so nothing needs borrowing.",
              "这多减了一个整数。第一个分数部分够减，不用借。",
            ],
          ],
          { form: "mixed" },
        );
      },
      partsLine(
        7,
        4,
        7,
        [
          [47, "6 5/7"],
          [32, "4 4/7"],
        ],
        [
          [47, 33],
          [33, 32],
        ],
      ),
    ),
    point(
      "subtracting-fractions-from-mixed-numbers",
      ["A fraction or a whole number from a mixed number", "带分数减分数或整数"],
      [
        "$4\\frac{5}{9} - \\frac{1}{9}$ takes away only a part, so the 4 wholes stay: $4\\frac{4}{9}$. $4\\frac{5}{9} - 3$ takes away only wholes, so the $\\frac{5}{9}$ stays: $1\\frac{5}{9}$.\n\nCheck: add back. $4\\frac{4}{9} + \\frac{1}{9} = 4\\frac{5}{9}$, and $1\\frac{5}{9} + 3 = 4\\frac{5}{9}$.\n\n> **Watch out.** Change only the part that is taken away. Taking $\\frac{1}{9}$ does not touch the wholes.",
        "$4\\frac{5}{9} - \\frac{1}{9}$ 只减去分数，4 个整数不变：$4\\frac{4}{9}$。$4\\frac{5}{9} - 3$ 只减去整数，$\\frac{5}{9}$ 不变：$1\\frac{5}{9}$。\n\n检验：加回去。$4\\frac{4}{9} + \\frac{1}{9} = 4\\frac{5}{9}$，$1\\frac{5}{9} + 3 = 4\\frac{5}{9}$。\n\n> **注意。** 只改变被减去的那部分。减去 $\\frac{1}{9}$ 不会动整数部分。",
      ],
      (rng) => {
        const { w1, r1, r2, d } = mixedPair(rng, "sub");
        if (rng.bool()) {
          const res = mx(w1, r1 - r2, d);
          return answered(
            [`Find $${mx(w1, r1, d)} - ${fr(r2, d)}$. Write a mixed number.`, `计算 $${mx(w1, r1, d)} - ${fr(r2, d)}$，答案写成带分数。`],
            mixedValue(w1, r1 - r2, d),
            [
              [
                ["See what is taken away", "看减去什么"],
                [`Only a fraction is taken away, so the ${w1} wholes stay.`, `只减去一个分数，${w1} 个整数不变。`],
              ],
              [
                ["Subtract the parts", "分数相减"],
                [
                  `The parts give $${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$. So the answer is $${res}$.`,
                  `分数部分是 $${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$。所以答案是 $${res}$。`,
                ],
              ],
            ],
            [`Add back: $${res} + ${fr(r2, d)} = ${mx(w1, r1, d)}$.`, `加回去：$${res} + ${fr(r2, d)} = ${mx(w1, r1, d)}$。`],
            [
              [
                mixedValue(w1 - 1, r1 - r2, d),
                "That takes away a whole too, but only a fraction is taken.",
                "这还减去了一个整数，可是只减去了一个分数。",
              ],
              [mixedValue(w1, r1 + r2, d), "That adds the parts instead of taking them away.", "这把分数部分加起来了，应该相减。"],
              [qf(r1 - r2, d), "That leaves out the wholes.", "这漏掉了整数部分。"],
            ],
            { form: "mixed" },
          );
        }
        const w2 = rng.int(1, w1 - 1);
        const r = coprimeTo(rng, d, 1, d - 1);
        const res = mx(w1 - w2, r, d);
        return answered(
          [`Find $${mx(w1, r, d)} - ${w2}$. Write a mixed number.`, `计算 $${mx(w1, r, d)} - ${w2}$，答案写成带分数。`],
          mixedValue(w1 - w2, r, d),
          [
            [
              ["See what is taken away", "看减去什么"],
              [`Only wholes are taken away, so the $${fr(r, d)}$ stays.`, `只减去整数，$${fr(r, d)}$ 不变。`],
            ],
            [
              ["Subtract the wholes", "整数相减"],
              [
                `The wholes give $${w1} - ${w2} = ${w1 - w2}$. So the answer is $${res}$.`,
                `整数部分是 $${w1} - ${w2} = ${w1 - w2}$。所以答案是 $${res}$。`,
              ],
            ],
          ],
          [`Add back: $${res} + ${w2} = ${mx(w1, r, d)}$.`, `加回去：$${res} + ${w2} = ${mx(w1, r, d)}$。`],
          [
            [
              mixedValue(w1 - w2, d - r, d),
              "That changes the fraction, but only wholes are taken away.",
              "这改变了分数部分，可是只减去了整数。",
            ],
            [mixedValue(w1, r, d), "That is the number you started with.", "这是原来的数。"],
            [w1 - w2, "That drops the fraction part.", "这丢掉了分数部分。"],
          ],
          { form: "mixed" },
        );
      },
      partsLine(
        9,
        4,
        5,
        [
          [41, "4 5/9"],
          [40, "4 4/9"],
        ],
        [[41, 40]],
      ),
    ),
  ],
  t(
    "A ribbon is $5\\frac{3}{5}$ meters long. Lily cuts off $2\\frac{1}{5}$ meters. Take away the wholes: $5 - 2 = 3$. Take away the fifths: $\\frac{3}{5} - \\frac{1}{5} = \\frac{2}{5}$. $3\\frac{2}{5}$ meters are left.\n\nCheck: add back. $3\\frac{2}{5} + 2\\frac{1}{5} = 5\\frac{3}{5}$.\n\nIn this lesson we subtract mixed numbers when the first fraction is big enough: wholes from wholes and parts from parts.",
    "一条丝带长 $5\\frac{3}{5}$ 米。莉莉剪掉 $2\\frac{1}{5}$ 米。整数相减：$5 - 2 = 3$。五分之几相减：$\\frac{3}{5} - \\frac{1}{5} = \\frac{2}{5}$。还剩 $3\\frac{2}{5}$ 米。\n\n检验：加回去。$3\\frac{2}{5} + 2\\frac{1}{5} = 5\\frac{3}{5}$。\n\n本课我们计算被减数的分数部分够减时的带分数减法：整数减整数，分数减分数。",
  ),
);

export const subtractingMixedNumbersWithLikeDenominatorsUsingImproperFractions = topic(
  "subtracting-mixed-numbers-with-like-denominators-using-improper-fractions",
  t("Subtracting Mixed Numbers With Like Denominators Using Improper Fractions", "化成假分数计算同分母带分数减法"),
  t(
    "When the first fraction is smaller than the second, write both mixed numbers as improper fractions, subtract, and convert back: 4 1/5 − 1 3/5 = 21/5 − 8/5 = 13/5 = 2 3/5.",
    "当被减数的分数部分小于减数的分数部分时，可以把两个带分数都化成假分数，相减后再化回带分数：4 1/5 − 1 3/5 = 21/5 − 8/5 = 13/5 = 2 3/5。",
  ),
  ["subtracting-mixed-numbers-with-like-denominators", "converting-mixed-numbers-to-improper-fractions"],
  ["4.NF.B.3"],
  [
    point(
      "subtracting-mixed-numbers-with-borrowing",
      ["A smaller first fraction", "被减数的分数部分较小"],
      [
        "$5\\frac{2}{7} - 2\\frac{5}{7}$: $\\frac{2}{7}$ is less than $\\frac{5}{7}$, so write both in sevenths. $\\frac{37}{7} - \\frac{19}{7} = \\frac{18}{7}$, and $\\frac{18}{7} = 2\\frac{4}{7}$.\n\nCheck: add back. $2\\frac{4}{7} + 2\\frac{5}{7} = 4\\frac{9}{7} = 5\\frac{2}{7}$.\n\n> **Watch out.** Do not take $\\frac{2}{7}$ from $\\frac{5}{7}$ instead. That turns the subtraction around and gives $3\\frac{3}{7}$.",
        "$5\\frac{2}{7} - 2\\frac{5}{7}$：$\\frac{2}{7}$ 比 $\\frac{5}{7}$ 小，所以都化成七分之几。$\\frac{37}{7} - \\frac{19}{7} = \\frac{18}{7}$，$\\frac{18}{7} = 2\\frac{4}{7}$。\n\n检验：加回去。$2\\frac{4}{7} + 2\\frac{5}{7} = 4\\frac{9}{7} = 5\\frac{2}{7}$。\n\n> **注意。** 不能反过来用 $\\frac{5}{7}$ 减 $\\frac{2}{7}$。那样就把减法弄反了，会得到 $3\\frac{3}{7}$。",
      ],
      (rng) => {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "subBorrow");
        const a = w1 * d + r1;
        const b = w2 * d + r2;
        const res = mixedLatex(qf(a - b, d));
        return answered(
          [
            `Find $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$，答案写成带分数。`,
          ],
          qf(a - b, d),
          [
            [
              ["Change to improper fractions", "化成假分数"],
              [
                `$${fr(r1, d)}$ is less than $${fr(r2, d)}$. So write $${mx(w1, r1, d)}$ as $${fr(a, d)}$ and $${mx(w2, r2, d)}$ as $${fr(b, d)}$.`,
                `$${fr(r1, d)}$ 比 $${fr(r2, d)}$ 小。所以把 $${mx(w1, r1, d)}$ 写成 $${fr(a, d)}$，把 $${mx(w2, r2, d)}$ 写成 $${fr(b, d)}$。`,
              ],
            ],
            [
              ["Subtract the tops", "分子相减"],
              [`$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)}$.`, `$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)}$。`],
            ],
            [
              ["Change back", "化回带分数"],
              [`$${fr(a - b, d)} = ${res}$.`, `$${fr(a - b, d)} = ${res}$。`],
            ],
          ],
          [`Add back: $${res} + ${mx(w2, r2, d)} = ${mx(w1, r1, d)}$.`, `加回去：$${res} + ${mx(w2, r2, d)} = ${mx(w1, r1, d)}$。`],
          [
            [
              mixedValue(w1 - w2, r2 - r1, d),
              "That takes the smaller fraction from the larger, so the subtraction is turned around.",
              "这是用大的分数减小的分数，把减法弄反了。",
            ],
            [
              mixedValue(w1 - w2, d + r1 - r2, d),
              "That borrows a whole for the parts but does not take it from the wholes.",
              "这给分数部分借了一个整数，却没有从整数部分减掉。",
            ],
            [qf(a + b, d), "That adds instead of taking away.", "这是相加，应该相减。"],
          ],
          { form: "mixed" },
        );
      },
      partsLine(
        7,
        2,
        6,
        [
          [37, "5 2/7"],
          [18, "2 4/7"],
        ],
        [
          [37, 23],
          [23, 18],
        ],
      ),
    ),
    point(
      "subtracting-mixed-numbers-from-whole-numbers",
      ["From a whole number", "从整数中减去带分数"],
      [
        "$6 - 2\\frac{3}{8}$: write both in eighths. $\\frac{48}{8} - \\frac{19}{8} = \\frac{29}{8}$, and $\\frac{29}{8} = 3\\frac{5}{8}$.\n\nCheck: add back. $3\\frac{5}{8} + 2\\frac{3}{8} = 5\\frac{8}{8} = 6$.\n\n> **Watch out.** The $\\frac{3}{8}$ is taken away, not kept. The answer is not $4\\frac{3}{8}$.",
        "$6 - 2\\frac{3}{8}$：都化成八分之几。$\\frac{48}{8} - \\frac{19}{8} = \\frac{29}{8}$，$\\frac{29}{8} = 3\\frac{5}{8}$。\n\n检验：加回去。$3\\frac{5}{8} + 2\\frac{3}{8} = 5\\frac{8}{8} = 6$。\n\n> **注意。** $\\frac{3}{8}$ 是要减去的，不是留下的。答案不是 $4\\frac{3}{8}$。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const w1 = rng.int(2, 10);
        const w2 = rng.int(1, w1 - 1);
        const r = coprimeTo(rng, d, 1, d - 1);
        const a = w1 * d;
        const b = w2 * d + r;
        const res = mixedLatex(qf(a - b, d));
        return answered(
          [`Find $${w1} - ${mx(w2, r, d)}$. Write a mixed number.`, `计算 $${w1} - ${mx(w2, r, d)}$，答案写成带分数。`],
          qf(a - b, d),
          [
            [
              ["Write both in parts", "都化成分数"],
              [`$${w1} = ${fr(a, d)}$ and $${mx(w2, r, d)} = ${fr(b, d)}$.`, `$${w1} = ${fr(a, d)}$，$${mx(w2, r, d)} = ${fr(b, d)}$。`],
            ],
            [
              ["Subtract the tops", "分子相减"],
              [`$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)}$.`, `$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)}$。`],
            ],
            [
              ["Change back", "化回带分数"],
              [`$${fr(a - b, d)} = ${res}$.`, `$${fr(a - b, d)} = ${res}$。`],
            ],
          ],
          [`Add back: $${res} + ${mx(w2, r, d)} = ${w1}$.`, `加回去：$${res} + ${mx(w2, r, d)} = ${w1}$。`],
          [
            [mixedValue(w1 - w2, r, d), "That keeps the fraction instead of taking it away.", "这把分数留下了，应该减去。"],
            [
              mixedValue(w1 - w2, d - r, d),
              "That takes the fraction from a whole but does not take that whole away.",
              "这从一个整数里减了分数，却没有把这个整数减掉。",
            ],
            [w1 - w2, "That takes away only the wholes.", "这只减去了整数部分。"],
          ],
          { form: "mixed" },
        );
      },
      partsLine(
        8,
        3,
        6,
        [
          [48, "6"],
          [29, "3 5/8"],
        ],
        [
          [48, 32],
          [32, 29],
        ],
      ),
    ),
  ],
  t(
    "Max has $4\\frac{1}{5}$ kilograms of clay and uses $1\\frac{3}{5}$ kilograms. $\\frac{1}{5}$ is less than $\\frac{3}{5}$, so write both in fifths: $\\frac{21}{5} - \\frac{8}{5} = \\frac{13}{5}$. That is $2\\frac{3}{5}$ kilograms left.\n\nCheck: add back. $2\\frac{3}{5} + 1\\frac{3}{5} = 3\\frac{6}{5} = 4\\frac{1}{5}$.\n\nIn this lesson we subtract mixed numbers when the first fraction is too small, by changing them to improper fractions.",
    "马克斯有 $4\\frac{1}{5}$ 千克黏土，用了 $1\\frac{3}{5}$ 千克。$\\frac{1}{5}$ 比 $\\frac{3}{5}$ 小，所以都化成五分之几：$\\frac{21}{5} - \\frac{8}{5} = \\frac{13}{5}$。还剩 $2\\frac{3}{5}$ 千克。\n\n检验：加回去。$2\\frac{3}{5} + 1\\frac{3}{5} = 3\\frac{6}{5} = 4\\frac{1}{5}$。\n\n本课我们在被减数的分数部分不够减时，把带分数化成假分数再相减。",
  ),
);

export const addingMixedNumbersWithLikeDenominatorsWordProblems = topic(
  "adding-mixed-numbers-with-like-denominators-word-problems",
  t("Adding Mixed Numbers With Like Denominators: Word Problems", "同分母带分数加法应用题"),
  t(
    "Joining two amounts given as mixed numbers is solved by adding them, regrouping fractions that make a whole: 2 3/8 miles and 1 7/8 miles make 4 1/4 miles.",
    "把两个用带分数表示的量合起来，就把它们相加，分数部分满一个整体时要进位：2 3/8 英里和 1 7/8 英里合起来是 4 1/4 英里。",
  ),
  ["adding-mixed-numbers-with-like-denominators"],
  ["4.NF.B.3"],
  [mixedStory("adding-mixed-amounts", false, false), mixedStory("adding-mixed-amounts-with-regrouping", false, true)],
  t(
    "Ben walks $2\\frac{3}{8}$ miles in the morning and $1\\frac{6}{8}$ miles in the afternoon. How far does he walk in all? Add the wholes and the parts: 3 wholes and $\\frac{9}{8}$. $\\frac{9}{8}$ makes one more whole, so he walks $4\\frac{1}{8}$ miles.\n\nCheck: in eighths, $\\frac{19}{8} + \\frac{14}{8} = \\frac{33}{8} = 4\\frac{1}{8}$.\n\nIn this lesson we solve stories that join two mixed numbers.",
    "本上午走了 $2\\frac{3}{8}$ 英里，下午走了 $1\\frac{6}{8}$ 英里。他一共走了多远？整数和分数分别相加：3 个整数和 $\\frac{9}{8}$。$\\frac{9}{8}$ 又凑成一个整数，所以他走了 $4\\frac{1}{8}$ 英里。\n\n检验：化成八分之几，$\\frac{19}{8} + \\frac{14}{8} = \\frac{33}{8} = 4\\frac{1}{8}$。\n\n本课我们解决把两个带分数合起来的应用题。",
  ),
);

export const subtractingMixedNumbersWithLikeDenominatorsWordProblems = topic(
  "subtracting-mixed-numbers-with-like-denominators-word-problems",
  t("Subtracting Mixed Numbers With Like Denominators: Word Problems", "同分母带分数减法应用题"),
  t(
    "Taking away or comparing amounts given as mixed numbers is solved by subtracting them, borrowing a whole when needed: 5 1/4 − 1 3/4 = 3 1/2.",
    "从用带分数表示的量中去掉一部分，或者比较两个这样的量，就用减法，必要时借一个整体：5 1/4 − 1 3/4 = 3 1/2。",
  ),
  ["subtracting-mixed-numbers-with-like-denominators-using-improper-fractions"],
  ["4.NF.B.3"],
  [mixedStory("subtracting-mixed-amounts", true, false), mixedStory("subtracting-mixed-amounts-with-borrowing", true, true)],
  t(
    "A board is $5\\frac{1}{5}$ feet long. Dad cuts off $1\\frac{3}{5}$ feet. How much is left? $\\frac{1}{5}$ is less than $\\frac{3}{5}$, so use fifths: $\\frac{26}{5} - \\frac{8}{5} = \\frac{18}{5}$. That is $3\\frac{3}{5}$ feet.\n\nCheck: add back. $3\\frac{3}{5} + 1\\frac{3}{5} = 5\\frac{1}{5}$.\n\nIn this lesson we solve stories that take away or compare mixed numbers.",
    "一块木板长 $5\\frac{1}{5}$ 英尺。爸爸锯掉 $1\\frac{3}{5}$ 英尺。还剩多少？$\\frac{1}{5}$ 比 $\\frac{3}{5}$ 小，所以化成五分之几：$\\frac{26}{5} - \\frac{8}{5} = \\frac{18}{5}$，也就是 $3\\frac{3}{5}$ 英尺。\n\n检验：加回去。$3\\frac{3}{5} + 1\\frac{3}{5} = 5\\frac{1}{5}$。\n\n本课我们解决从带分数中去掉一部分或比较两个带分数的应用题。",
  ),
);

// ---------------------------------------------------------------------------
// Multiplying fractions by whole numbers

/** copiesTape draws n copies of a/d end to end as one bar, each copy shaded and labelled. */
const copiesTape = (n: number, a: number, d: number): Figure =>
  tapeFigure(
    [{ total: `${n} × ${a}/${d}`, pieces: Array.from({ length: n }, () => ({ size: a, text: `${a}/${d}`, lit: true })) }],
    [`${n} copies of ${a}/${d} placed end to end.`, `${n} 个 ${a}/${d} 首尾相接。`],
  );

/** timesStory is the walk, check and wrong answers of n × a/d written as a mixed number, with the first step saying why it is a product. */
function timesStory(n: number, a: number, d: number, why: Pair): { walk: Walk[]; check: Pair; misses: Miss[] } {
  const p = n * a;
  const q = Math.floor(p / d);
  const m = mixedLatex(qf(p, d));
  return {
    walk: [
      [["Choose the operation", "选运算"], why],
      [
        ["Multiply the top", "用整数乘分子"],
        [`$${n} \\times ${fr(a, d)} = ${fr(p, d)}$.`, `$${n} \\times ${fr(a, d)} = ${fr(p, d)}$。`],
      ],
      [
        ["Write a mixed number", "化成带分数"],
        [`${d} parts make 1 whole. $${fr(p, d)} = ${m}$.`, `${d} 份是 1 个整数。$${fr(p, d)} = ${m}$。`],
      ],
    ],
    check: [
      `Change back: $${q} \\times ${d} + ${p - q * d} = ${p}$ parts of $${fr(1, d)}$.`,
      `化回去：$${q} \\times ${d} + ${p - q * d} = ${p}$ 个 $${fr(1, d)}$。`,
    ],
    misses: [
      [qf(n + a, d), "That adds the whole number to the top instead of multiplying.", "这把整数加到分子上了，应该相乘。"],
      [qf(p, n * d), "That multiplies the bottom too. The parts keep their size.", "这把分母也乘了。每份的大小不变。"],
      [mixedValue(n, a, d), "That puts the whole number in front instead of multiplying.", "这把整数直接写在前面，没有相乘。"],
    ],
  };
}

export const multiplyingUnitFractionsByWholeNumbersUsingModels = topic(
  "multiplying-unit-fractions-by-whole-numbers-using-models",
  t("Multiplying Unit Fractions by Whole Numbers Using Models", "用模型计算整数乘单位分数"),
  t(
    "n × 1/d means n copies of 1/d, which is n/d: 5 × 1/8 = 1/8 + 1/8 + 1/8 + 1/8 + 1/8 = 5/8.",
    "n × 1/d 表示 n 个 1/d，也就是 n/d：5 × 1/8 = 1/8 + 1/8 + 1/8 + 1/8 + 1/8 = 5/8。",
  ),
  ["adding-fractions-with-like-denominators-using-models", "products-and-factors"],
  ["4.NF.B.4"],
  [
    point(
      "copies-of-a-unit-fraction",
      ["Copies of a unit fraction", "几个分数单位"],
      [
        "$4 \\times \\frac{1}{6}$ means 4 copies of $\\frac{1}{6}$. Shade 4 sixths on the bar: $4 \\times \\frac{1}{6} = \\frac{4}{6}$.\n\nCheck: $\\frac{1}{6} + \\frac{1}{6} + \\frac{1}{6} + \\frac{1}{6} = \\frac{4}{6}$.\n\n> **Watch out.** Only the top changes. $4 \\times \\frac{1}{6}$ is $\\frac{4}{6}$, not $\\frac{4}{24}$.",
        "$4 \\times \\frac{1}{6}$ 表示 4 个 $\\frac{1}{6}$。在长条上涂 4 个六分之一：$4 \\times \\frac{1}{6} = \\frac{4}{6}$。\n\n检验：$\\frac{1}{6} + \\frac{1}{6} + \\frac{1}{6} + \\frac{1}{6} = \\frac{4}{6}$。\n\n> **注意。** 只有分子变。$4 \\times \\frac{1}{6}$ 是 $\\frac{4}{6}$，不是 $\\frac{4}{24}$。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(2, d + 4);
        return answered(
          [
            `The model shows $${n} \\times ${fr(1, d)}$. Fill in the box: $$${n} \\times ${fr(1, d)} = \\frac{\\square}{${d}}$$`,
            `模型表示 $${n} \\times ${fr(1, d)}$。填空：$$${n} \\times ${fr(1, d)} = \\frac{\\square}{${d}}$$`,
          ],
          n,
          [
            [
              ["Read the product", "读懂乘法"],
              [`$${n} \\times ${fr(1, d)}$ means ${n} copies of $${fr(1, d)}$.`, `$${n} \\times ${fr(1, d)}$ 表示 ${n} 个 $${fr(1, d)}$。`],
            ],
            [
              ["Count the parts", "数份数"],
              [`${n} parts of size $${fr(1, d)}$ are shaded, so the top is ${n}.`, `涂了 ${n} 个 $${fr(1, d)}$，所以分子是 ${n}。`],
            ],
          ],
          [
            `On a number line, ${n} jumps of $${fr(1, d)}$ from 0 land on $${fr(n, d)}$.`,
            `在数轴上，从 0 起跳 ${n} 次 $${fr(1, d)}$，落在 $${fr(n, d)}$。`,
          ],
          [
            [n + 1, "That counts one copy too many.", "这多数了一个。"],
            [d, "That is the bottom number, the size of the parts.", "这是分母，表示每份的大小。"],
            [n * d, "That multiplies by the bottom. The top just counts the copies.", "这乘了分母。分子只是数有几个。"],
          ],
          { form: "integer", figure: barFigure(d, n, Math.ceil(n / d)) },
        );
      },
      barFigure(6, 4),
    ),
    point(
      "products-of-whole-numbers-and-unit-fractions",
      ["The product as a fraction", "积写成分数"],
      [
        "$7 \\times \\frac{1}{10}$ is 7 copies of one tenth, so it is 7 tenths: $\\frac{7}{10}$.\n\nCheck: on the number line, 7 jumps of $\\frac{1}{10}$ from 0 land on $\\frac{7}{10}$.\n\n> **Watch out.** Do not multiply the bottom. $\\frac{7}{70}$ is far too small for 7 tenths.",
        "$7 \\times \\frac{1}{10}$ 是 7 个十分之一，也就是 $\\frac{7}{10}$。\n\n检验：在数轴上，从 0 起跳 7 次 $\\frac{1}{10}$，落在 $\\frac{7}{10}$。\n\n> **注意。** 分母不能乘。$\\frac{7}{70}$ 比 7 个十分之一小得多。",
      ],
      (rng) => {
        const d = rng.int(2, 15);
        const n = coprimeTo(rng, d, 2, 2 * d);
        return answered(
          [`Find $${n} \\times ${fr(1, d)}$.`, `计算 $${n} \\times ${fr(1, d)}$。`],
          qf(n, d),
          [
            [
              ["Count the copies", "数有几个"],
              [`$${n} \\times ${fr(1, d)}$ is ${n} copies of $${fr(1, d)}$.`, `$${n} \\times ${fr(1, d)}$ 是 ${n} 个 $${fr(1, d)}$。`],
            ],
            [
              ["Keep the bottom", "分母不变"],
              [`Each copy is still $${fr(1, d)}$, so the product is $${fr(n, d)}$.`, `每个仍是 $${fr(1, d)}$，所以积是 $${fr(n, d)}$。`],
            ],
          ],
          [
            `On a number line, ${n} jumps of $${fr(1, d)}$ from 0 land on $${fr(n, d)}$.`,
            `在数轴上，从 0 起跳 ${n} 次 $${fr(1, d)}$，落在 $${fr(n, d)}$。`,
          ],
          [
            [
              qf(1, n * d),
              "That multiplies the bottom, so the parts get smaller instead of more.",
              "这乘了分母，每份变小了，而不是份数变多。",
            ],
            [qf(n, n * d), "That multiplies the top and the bottom. Only the top counts copies.", "这把分子分母都乘了。只有分子数个数。"],
            [qf(d, n), "That swaps the top and the bottom.", "这把分子和分母弄反了。"],
          ],
          {
            form: "fraction",
            ...(n <= 12 && {
              figure: jumpsLine(
                d,
                Array.from({ length: n }, () => 1),
              ),
            }),
          },
        );
      },
      jumpsLine(10, [1, 1, 1, 1, 1, 1, 1]),
    ),
  ],
  t(
    "A pizza is cut into 8 equal slices. Five friends each take one slice, $\\frac{1}{8}$ of the pizza. Together they took 5 eighths: $5 \\times \\frac{1}{8} = \\frac{5}{8}$.\n\nCheck: add them up. Five slices of $\\frac{1}{8}$ make $\\frac{5}{8}$.\n\nIn this lesson we multiply a whole number by a unit fraction by counting copies.",
    "一个比萨平均切成 8 块。五个朋友每人拿一块，也就是这个比萨的 $\\frac{1}{8}$。他们一共拿了 5 个八分之一：$5 \\times \\frac{1}{8} = \\frac{5}{8}$。\n\n检验：加起来看。5 块 $\\frac{1}{8}$ 是 $\\frac{5}{8}$。\n\n本课我们通过数有几个分数单位，计算整数乘分数单位。",
  ),
);

export const multiplyingFractionsByWholeNumbersUsingModels = topic(
  "multiplying-fractions-by-whole-numbers-using-models",
  t("Multiplying Fractions by Whole Numbers Using Models", "用模型计算整数乘分数"),
  t(
    "n × a/d means n copies of a/d. Each copy has a parts of size 1/d, so there are n × a such parts: 3 × 2/5 = 6/5.",
    "n × a/d 表示 n 个 a/d。每个有 a 个 1/d，所以一共有 n × a 个 1/d：3 × 2/5 = 6/5。",
  ),
  ["multiplying-unit-fractions-by-whole-numbers-using-models"],
  ["4.NF.B.4"],
  [
    point(
      "groups-of-a-fraction-in-a-model",
      ["Groups of a fraction", "几组分数"],
      [
        "3 groups of $\\frac{2}{5}$: each group has 2 fifths, so there are $3 \\times 2 = 6$ fifths. $3 \\times \\frac{2}{5} = \\frac{6}{5}$.\n\nCheck: count the shaded fifths one by one. There are 6.\n\n> **Watch out.** Multiply the top only. The parts are still fifths, so the answer is not $\\frac{6}{15}$.",
        "3 组 $\\frac{2}{5}$：每组有 2 个五分之一，一共 $3 \\times 2 = 6$ 个五分之一。$3 \\times \\frac{2}{5} = \\frac{6}{5}$。\n\n检验：一个一个地数涂色的五分之一，正好 6 个。\n\n> **注意。** 只乘分子。每份仍是五分之一，所以答案不是 $\\frac{6}{15}$。",
      ],
      (rng) => {
        const d = rng.int(3, 8);
        const a = rng.int(2, d - 1);
        const n = rng.int(2, 4);
        const total = n * a;
        return answered(
          [
            `The model shows ${n} groups of $${fr(a, d)}$. Fill in the box: $$${n} \\times ${fr(a, d)} = \\frac{\\square}{${d}}$$`,
            `模型表示 ${n} 组 $${fr(a, d)}$。填空：$$${n} \\times ${fr(a, d)} = \\frac{\\square}{${d}}$$`,
          ],
          total,
          [
            [
              ["Parts in one group", "一组有几份"],
              [`Each group is $${fr(a, d)}$, ${a} parts of size $${fr(1, d)}$.`, `每组是 $${fr(a, d)}$，有 ${a} 个 $${fr(1, d)}$。`],
            ],
            [
              ["All the groups", "所有的组"],
              [`$${n} \\times ${a} = ${total}$.`, `$${n} \\times ${a} = ${total}$。`],
            ],
          ],
          [
            `Add the groups: $${Array.from({ length: n }, () => a).join(" + ")} = ${total}$.`,
            `把各组加起来：$${Array.from({ length: n }, () => a).join(" + ")} = ${total}$。`,
          ],
          [
            [n + a, "That adds the number of groups to the top.", "这把组数加到分子上了。"],
            [a, "That is one group only.", "这只是一组。"],
            [n, "That counts the groups, not the parts.", "这数的是组数，不是份数。"],
          ],
          { form: "integer", figure: copiesTape(n, a, d) },
        );
      },
      copiesTape(3, 2, 5),
    ),
    point(
      "writing-products-as-sums",
      ["Products as repeated addition", "乘法与连加"],
      [
        "$\\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7}$ adds 4 copies of $\\frac{3}{7}$. So it is $4 \\times \\frac{3}{7}$, and both make $\\frac{12}{7}$.\n\nCheck: $3 + 3 + 3 + 3 = 12$, and $4 \\times 3 = 12$.\n\n> **Watch out.** Do not write $4 + \\frac{3}{7}$. Adding the same fraction again and again is multiplying.",
        "$\\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7}$ 是 4 个 $\\frac{3}{7}$ 相加。所以它就是 $4 \\times \\frac{3}{7}$，结果都是 $\\frac{12}{7}$。\n\n检验：$3 + 3 + 3 + 3 = 12$，$4 \\times 3 = 12$。\n\n> **注意。** 不能写成 $4 + \\frac{3}{7}$。同一个分数连加，就是乘法。",
      ],
      (rng) => {
        const n = rng.int(2, 5);
        const d = rng.int(3, 12);
        const a = rng.int(2, d - 1);
        const sum = Array.from({ length: n }, () => fr(a, d)).join(" + ");
        return pickedMath(
          rng,
          [`Which product equals $${sum}$?`, `哪个乘法算式等于 $${sum}$？`],
          `${n} \\times ${fr(a, d)}`,
          [
            [`${n} + ${fr(a, d)}`, "That adds the count instead of multiplying.", "这是把个数加上去，应该相乘。"],
            [
              `${n} \\times ${fr(1, d)}`,
              `That is ${n} copies of $${fr(1, d)}$, not of $${fr(a, d)}$.`,
              `这是 ${n} 个 $${fr(1, d)}$，不是 ${n} 个 $${fr(a, d)}$。`,
            ],
            [`${n + 1} \\times ${fr(a, d)}`, `That counts one copy too many. There are ${n}.`, `这多数了一个。一共是 ${n} 个。`],
            [
              `${n} \\times ${fr(a, n * d)}`,
              `That changes the bottom. Every copy is $${fr(a, d)}$.`,
              `这改变了分母。每个都是 $${fr(a, d)}$。`,
            ],
          ],
          [
            [
              ["Count the copies", "数有几个"],
              [`$${fr(a, d)}$ is added ${n} times.`, `$${fr(a, d)}$ 加了 ${n} 次。`],
            ],
            [
              ["Write the product", "写成乘法"],
              [`${n} copies of $${fr(a, d)}$ is $${n} \\times ${fr(a, d)}$.`, `${n} 个 $${fr(a, d)}$ 就是 $${n} \\times ${fr(a, d)}$。`],
            ],
          ],
          [
            `Both give $${fr(n * a, d)}$: the tops add to ${n * a}, and $${n} \\times ${a} = ${n * a}$.`,
            `两种算法结果都是 $${fr(n * a, d)}$：分子相加是 ${n * a}，$${n} \\times ${a} = ${n * a}$。`,
          ],
          copiesTape(n, a, d),
        );
      },
      copiesTape(4, 3, 7),
    ),
  ],
  t(
    "One muffin needs $\\frac{2}{5}$ cup of milk. For 3 muffins, take 3 groups of $\\frac{2}{5}$. That is $3 \\times 2 = 6$ fifths: $\\frac{6}{5}$ cup.\n\nCheck: $\\frac{2}{5} + \\frac{2}{5} + \\frac{2}{5} = \\frac{6}{5}$.\n\nIn this lesson we multiply a whole number by a fraction with models of equal groups.",
    "做一个松饼要 $\\frac{2}{5}$ 杯牛奶。做 3 个，就是 3 组 $\\frac{2}{5}$。一共是 $3 \\times 2 = 6$ 个五分之一：$\\frac{6}{5}$ 杯。\n\n检验：$\\frac{2}{5} + \\frac{2}{5} + \\frac{2}{5} = \\frac{6}{5}$。\n\n本课我们用几组相同分数的模型，计算整数乘分数。",
  ),
);

export const multiplyingFractionsByWholeNumbers = topic(
  "multiplying-fractions-by-whole-numbers",
  t("Multiplying Fractions by Whole Numbers", "整数乘分数"),
  t(
    "To multiply a fraction by a whole number, multiply the numerator by the whole number and keep the denominator: n × a/d = (n × a)/d. Write the result in lowest terms or as a mixed number: 4 × 2/3 = 8/3 = 2 2/3.",
    "整数乘分数，用整数乘分子，分母不变：n × a/d = (n × a)/d。结果化成最简分数或带分数：4 × 2/3 = 8/3 = 2 2/3。",
  ),
  ["multiplying-fractions-by-whole-numbers-using-models", "converting-improper-fractions-to-mixed-numbers"],
  ["4.NF.B.4"],
  [
    point(
      "products-as-improper-fractions",
      ["The product as a fraction", "积写成分数"],
      [
        "$5 \\times \\frac{3}{4}$: multiply the top, $5 \\times 3 = 15$. Keep the bottom. The product is $\\frac{15}{4}$.\n\nCheck: add 5 copies of $\\frac{3}{4}$. The tops make $3 + 3 + 3 + 3 + 3 = 15$.\n\n> **Watch out.** Do not multiply the bottom too. $\\frac{15}{20}$ is less than 1, far too small for 5 copies of $\\frac{3}{4}$.",
        "$5 \\times \\frac{3}{4}$：用 5 乘分子，$5 \\times 3 = 15$。分母不变。积是 $\\frac{15}{4}$。\n\n检验：把 5 个 $\\frac{3}{4}$ 加起来，分子是 $3 + 3 + 3 + 3 + 3 = 15$。\n\n> **注意。** 分母不能也乘。$\\frac{15}{20}$ 比 1 还小，5 个 $\\frac{3}{4}$ 不会这么少。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(2, 12);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 9);
          if (gcd(n * a, d) !== 1) continue;
          return answered(
            [`Find $${n} \\times ${fr(a, d)}$. Give the answer as a fraction.`, `计算 $${n} \\times ${fr(a, d)}$，答案写成分数。`],
            qf(n * a, d),
            [
              [
                ["Multiply the top", "用整数乘分子"],
                [`$${n} \\times ${a} = ${n * a}$.`, `$${n} \\times ${a} = ${n * a}$。`],
              ],
              [
                ["Keep the bottom", "分母不变"],
                [
                  `The parts are still $${fr(1, d)}$, so the product is $${fr(n * a, d)}$.`,
                  `每份仍是 $${fr(1, d)}$，所以积是 $${fr(n * a, d)}$。`,
                ],
              ],
            ],
            [
              `Add ${n} copies of $${fr(a, d)}$: the tops make ${n * a}, so the sum is $${fr(n * a, d)}$ too.`,
              `把 ${n} 个 $${fr(a, d)}$ 相加：分子合起来是 ${n * a}，和也是 $${fr(n * a, d)}$。`,
            ],
            [
              [qf(n * a, n * d), "That multiplies the bottom too. The parts keep their size.", "这把分母也乘了。每份的大小不变。"],
              [qf(a, n * d), "That multiplies the bottom instead of the top.", "这乘的是分母，应该乘分子。"],
              [qf(n + a, d), "That adds the whole number to the top instead of multiplying.", "这把整数加到分子上了，应该相乘。"],
            ],
            { form: "fraction" },
          );
        }
      },
      copiesTape(5, 3, 4),
    ),
    point(
      "products-as-mixed-numbers",
      ["The product as a mixed number", "积写成带分数"],
      [
        "$4 \\times \\frac{2}{3} = \\frac{8}{3}$. Now share 8 thirds into wholes: $8 \\div 3 = 2$ R $2$. So the product is $2\\frac{2}{3}$.\n\nCheck: 2 wholes are 6 thirds, and $6 + 2 = 8$ thirds.\n\n> **Watch out.** $4 \\times \\frac{2}{3}$ is not $4\\frac{2}{3}$. Multiply; do not just put the 4 in front.",
        "$4 \\times \\frac{2}{3} = \\frac{8}{3}$。再把 8 个三分之一凑成整数：$8 \\div 3 = 2 \\cdots\\cdots 2$。所以积是 $2\\frac{2}{3}$。\n\n检验：2 个整数是 6 个三分之一，$6 + 2 = 8$ 个三分之一。\n\n> **注意。** $4 \\times \\frac{2}{3}$ 不是 $4\\frac{2}{3}$。要相乘，不能把 4 直接写在前面。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(2, 12);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 9);
          if (gcd(n * a, d) !== 1 || n * a < d) continue;
          const p = n * a;
          const q = Math.floor(p / d);
          const r = p - q * d;
          const m = mixedLatex(qf(p, d));
          return answered(
            [`Find $${n} \\times ${fr(a, d)}$. Write a mixed number.`, `计算 $${n} \\times ${fr(a, d)}$，答案写成带分数。`],
            qf(p, d),
            [
              [
                ["Multiply the top", "用整数乘分子"],
                [`$${n} \\times ${fr(a, d)} = ${fr(p, d)}$.`, `$${n} \\times ${fr(a, d)} = ${fr(p, d)}$。`],
              ],
              [
                ["Make wholes", "凑成整数"],
                [
                  `$${p} \\div ${d} = ${q} \\text{ R } ${r}$. So the product is $${m}$.`,
                  `$${p} \\div ${d} = ${q} \\cdots\\cdots ${r}$。所以积是 $${m}$。`,
                ],
              ],
            ],
            [`Change back: $${q} \\times ${d} + ${r} = ${p}$.`, `化回去：$${q} \\times ${d} + ${r} = ${p}$。`],
            [
              [qf(p, n * d), "That multiplies the bottom too. The parts keep their size.", "这把分母也乘了。每份的大小不变。"],
              [qf(n + a, d), "That adds the whole number to the top instead of multiplying.", "这把整数加到分子上了，应该相乘。"],
              [mixedValue(n, a, d), "That puts the whole number in front instead of multiplying.", "这把整数直接写在前面，没有相乘。"],
            ],
            { form: "mixed" },
          );
        }
      },
      copiesTape(4, 2, 3),
    ),
  ],
  t(
    "A snail crawls $\\frac{3}{4}$ meter each hour. In 5 hours it crawls $5 \\times \\frac{3}{4}$ meters. That is $5 \\times 3 = 15$ fourths: $\\frac{15}{4}$ meters, or $3\\frac{3}{4}$ meters.\n\nCheck: 4 fourths make 1, so 15 fourths are 3 wholes and 3 fourths.\n\nIn this lesson we multiply a fraction by a whole number: multiply the top and keep the bottom.",
    "一只蜗牛每小时爬 $\\frac{3}{4}$ 米。5 小时爬 $5 \\times \\frac{3}{4}$ 米。也就是 $5 \\times 3 = 15$ 个四分之一：$\\frac{15}{4}$ 米，即 $3\\frac{3}{4}$ 米。\n\n检验：4 个四分之一是 1，所以 15 个四分之一是 3 个整数还多 3 个四分之一。\n\n本课我们计算整数乘分数：用整数乘分子，分母不变。",
  ),
);

export const multiplyingFractionsByWholeNumbersWordProblems = topic(
  "multiplying-fractions-by-whole-numbers-word-problems",
  t("Multiplying Fractions by Whole Numbers: Word Problems", "整数乘分数应用题"),
  t(
    "When the same fractional amount is repeated several times, the total is a product: 6 glasses of 3/4 cup each hold 6 × 3/4 = 18/4 = 4 1/2 cups.",
    "同一个分数量重复若干次时，总量用乘法计算：6 杯，每杯 3/4 量杯，一共 6 × 3/4 = 18/4 = 4 1/2 量杯。",
  ),
  ["multiplying-fractions-by-whole-numbers"],
  ["4.NF.B.4"],
  [
    point(
      "repeated-fractional-amounts",
      ["Equal amounts", "相同的数量"],
      [
        "5 people each eat $\\frac{3}{8}$ of a pizza. The same amount 5 times is $5 \\times \\frac{3}{8} = \\frac{15}{8}$ pizzas. That is $1\\frac{7}{8}$ pizzas.\n\nCheck: 15 eighths. 8 of them make 1 whole, and 7 are left.\n\n> **Watch out.** Multiply, do not add. $5 + \\frac{3}{8}$ is not the total.",
        "5 个人每人吃 $\\frac{3}{8}$ 个比萨。同样的量吃了 5 份，一共是 $5 \\times \\frac{3}{8} = \\frac{15}{8}$ 个比萨，也就是 $1\\frac{7}{8}$ 个。\n\n检验：15 个八分之一。8 个凑成 1 个整数，还剩 7 个。\n\n> **注意。** 要乘，不是加。$5 + \\frac{3}{8}$ 不是总数。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(2, 12);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 12);
          if (gcd(n * a, d) !== 1 || n * a < d) continue;
          const kind = rng.int(0, 2);
          const prompts: Pair[] = [
            [
              `Each of ${n} students needs $${fr(a, d)}$ yard of string. How many yards of string do they need in all?`,
              `${n} 名学生每人需要 $${fr(a, d)}$ 码绳子。一共需要多少码？`,
            ],
            [
              `A runner runs $${fr(a, d)}$ mile every day for ${n} days. How many miles is that in all?`,
              `一名跑步者每天跑 $${fr(a, d)}$ 英里，连续跑了 ${n} 天。一共跑了多少英里？`,
            ],
            [
              `A recipe uses $${fr(a, d)}$ cup of sugar. How many cups of sugar are needed for ${n} batches?`,
              `一份食谱要用 $${fr(a, d)}$ 杯糖。做 ${n} 份需要多少杯糖？`,
            ],
          ];
          const pr = prompts[kind]!;
          const s = timesStory(n, a, d, [
            `The same $${fr(a, d)}$ is taken ${n} times, so multiply.`,
            `同样的 $${fr(a, d)}$ 取了 ${n} 次，所以用乘法。`,
          ]);
          return answered([`${pr[0]} Write a mixed number.`, `${pr[1]}用带分数表示。`], qf(n * a, d), s.walk, s.check, s.misses, {
            form: "mixed",
          });
        }
      },
      copiesTape(5, 3, 8),
    ),
    point(
      "comparing-with-a-fractional-multiple",
      ["Times as much", "几倍"],
      [
        "A puppy eats $\\frac{2}{3}$ cup of food. A big dog eats 4 times as much. Times as much means multiply: $4 \\times \\frac{2}{3} = \\frac{8}{3}$. That is $2\\frac{2}{3}$ cups.\n\nCheck: $\\frac{2}{3} + \\frac{2}{3} + \\frac{2}{3} + \\frac{2}{3} = \\frac{8}{3}$.\n\n> **Watch out.** Do not add $4 + \\frac{2}{3}$. Four times as much is four copies, not four more.",
        "小狗吃 $\\frac{2}{3}$ 杯狗粮。大狗吃的是它的 4 倍。几倍就用乘法：$4 \\times \\frac{2}{3} = \\frac{8}{3}$，也就是 $2\\frac{2}{3}$ 杯。\n\n检验：$\\frac{2}{3} + \\frac{2}{3} + \\frac{2}{3} + \\frac{2}{3} = \\frac{8}{3}$。\n\n> **注意。** 不能算成 $4 + \\frac{2}{3}$。4 倍是 4 个这么多，不是多 4。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(2, 10);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 9);
          if (gcd(n * a, d) !== 1 || n * a < d) continue;
          const [p, q] = rng.sample(names, 2);
          const s = timesStory(n, a, d, [
            `${n} times as much means ${n} copies of $${fr(a, d)}$, so multiply.`,
            `${n} 倍就是 ${n} 个 $${fr(a, d)}$，所以用乘法。`,
          ]);
          return answered(
            [
              `${p}'s plant grew $${fr(a, d)}$ inch this week. ${q}'s plant grew ${n} times as much. How many inches did ${q}'s plant grow? Write a mixed number.`,
              `${p} 的植物这周长高了 $${fr(a, d)}$ 英寸。${q} 的植物长高的高度是它的 ${n} 倍。${q} 的植物长高了多少英寸？用带分数表示。`,
            ],
            qf(n * a, d),
            s.walk,
            s.check,
            s.misses,
            { form: "mixed" },
          );
        }
      },
      copiesTape(4, 2, 3),
    ),
  ],
  t(
    "Six glasses each hold $\\frac{3}{4}$ cup of juice. All together they hold $6 \\times \\frac{3}{4} = \\frac{18}{4}$ cups. That is $4\\frac{2}{4}$ cups, or $4\\frac{1}{2}$ cups.\n\nCheck: 4 glasses hold 3 cups and 2 more hold $1\\frac{2}{4}$ cups. $3 + 1\\frac{2}{4} = 4\\frac{2}{4}$.\n\nIn this lesson we solve stories where the same fraction is repeated, or one amount is so many times another.",
    "六个杯子每个装 $\\frac{3}{4}$ 杯果汁。一共装 $6 \\times \\frac{3}{4} = \\frac{18}{4}$ 杯。也就是 $4\\frac{2}{4}$ 杯，即 $4\\frac{1}{2}$ 杯。\n\n检验：4 个杯子装 3 杯，另外 2 个装 $1\\frac{2}{4}$ 杯。$3 + 1\\frac{2}{4} = 4\\frac{2}{4}$。\n\n本课我们解决同一个分数重复几次，或者一个量是另一个量几倍的应用题。",
  ),
);

export const strategiesToSimplifyWholeNumberAndFractionMultiplication = topic(
  "strategies-to-simplify-whole-number-and-fraction-multiplication",
  t("Strategies to Simplify Whole Number and Fraction Multiplication", "简化整数乘分数的方法"),
  t(
    "When the whole number and the denominator share a factor, divide it out before multiplying: 12 × 5/8 = (12 ÷ 4) × 5/(8 ÷ 4) = 3 × 5/2 = 15/2. The numbers stay small and the result is already in lowest terms.",
    "当整数和分母有公因数时，先约分再相乘：12 × 5/8 = (12 ÷ 4) × 5/(8 ÷ 4) = 3 × 5/2 = 15/2。这样数更小，结果也已经是最简分数。",
  ),
  ["multiplying-fractions-by-whole-numbers", "writing-fractions-in-lowest-terms"],
  ["4.NF.B.4"],
  [
    point(
      "cancelling-before-multiplying",
      ["Cancelling a common factor", "先约分"],
      [
        "$10 \\times \\frac{3}{4}$: 10 and 4 share the factor 2. Divide both by 2 first: $5 \\times \\frac{3}{2} = \\frac{15}{2}$.\n\nCheck: the long way. $10 \\times \\frac{3}{4} = \\frac{30}{4} = \\frac{15}{2}$.\n\n> **Watch out.** Divide the whole number and the bottom by the same factor. Dividing only one of them changes the answer.",
        "$10 \\times \\frac{3}{4}$：10 和 4 有公因数 2。先都除以 2：$5 \\times \\frac{3}{2} = \\frac{15}{2}$。\n\n检验：按原来的方法算。$10 \\times \\frac{3}{4} = \\frac{30}{4} = \\frac{15}{2}$。\n\n> **注意。** 整数和分母要除以同一个公因数。只除一个，结果就变了。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(4, 12);
          const a = coprimeTo(rng, d, 1, d - 1);
          const n = rng.int(2, 30);
          const g = gcd(n, d);
          if (g === 1 || g === d) continue;
          const [n2, d2] = [n / g, d / g];
          return answered(
            [`Find $${n} \\times ${fr(a, d)}$ in lowest terms.`, `计算 $${n} \\times ${fr(a, d)}$，结果写成最简分数。`],
            qf(n * a, d),
            [
              [
                ["Find a common factor", "找公因数"],
                [`${n} and ${d} share the factor ${g}.`, `${n} 和 ${d} 有公因数 ${g}。`],
              ],
              [
                ["Divide it out first", "先约分"],
                [`$${n2} \\times ${fr(a, d2)} = ${fr(n2 * a, d2)}$.`, `$${n2} \\times ${fr(a, d2)} = ${fr(n2 * a, d2)}$。`],
              ],
            ],
            [
              `The long way: $${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${fr(n2 * a, d2)}$.`,
              `按原来的方法算：$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${fr(n2 * a, d2)}$。`,
            ],
            [
              [qf(n2 * a, d), "That divides the whole number but not the bottom.", "这只除了整数，没有除分母。"],
              [qf(n * a, d2), "That divides the bottom but not the whole number.", "这只除了分母，没有除整数。"],
              [qf(n + a, d), "That adds the whole number to the top instead of multiplying.", "这把整数加到分子上了，应该相乘。"],
            ],
            { form: "fraction" },
          );
        }
      },
      copiesTape(10, 3, 4),
    ),
    point(
      "products-that-are-whole-numbers",
      ["Whole-number products", "积是整数"],
      [
        "$12 \\times \\frac{3}{4}$: 4 goes into 12 exactly, $12 \\div 4 = 3$. Then $3 \\times 3 = 9$.\n\nCheck: the long way. $12 \\times \\frac{3}{4} = \\frac{36}{4} = 9$.\n\n> **Watch out.** Do not forget the bottom. $12 \\times 3 = 36$ is 36 fourths, not 36.",
        "$12 \\times \\frac{3}{4}$：12 能被 4 整除，$12 \\div 4 = 3$。再算 $3 \\times 3 = 9$。\n\n检验：按原来的方法算。$12 \\times \\frac{3}{4} = \\frac{36}{4} = 9$。\n\n> **注意。** 别忘了分母。$12 \\times 3 = 36$ 是 36 个四分之一，不是 36。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const a = coprimeTo(rng, d, 1, d - 1);
        const m = rng.int(2, 9);
        const n = d * m;
        return answered(
          [`Find $${n} \\times ${fr(a, d)}$.`, `计算 $${n} \\times ${fr(a, d)}$。`],
          m * a,
          [
            [
              ["Divide first", "先除"],
              [`$${n} \\div ${d} = ${m}$.`, `$${n} \\div ${d} = ${m}$。`],
            ],
            [
              ["Multiply by the top", "再乘分子"],
              [`$${m} \\times ${a} = ${m * a}$.`, `$${m} \\times ${a} = ${m * a}$。`],
            ],
          ],
          [
            `The long way: $${n} \\times ${fr(a, d)} = ${fr(groupedTex(n * a), d)} = ${m * a}$.`,
            `按原来的方法算：$${n} \\times ${fr(a, d)} = ${fr(groupedTex(n * a), d)} = ${m * a}$。`,
          ],
          [
            [n * a, "That forgets to divide by the bottom.", "这忘了除以分母。"],
            [m, "That divides but forgets to multiply by the top.", "这除了分母，却忘了乘分子。"],
            [m + a, "That adds the top instead of multiplying.", "这是加分子，应该乘分子。"],
          ],
          { form: "integer" },
        );
      },
      copiesTape(12, 3, 4),
    ),
  ],
  t(
    "A recipe uses $\\frac{5}{8}$ cup of oats per batch. For 12 batches you need $12 \\times \\frac{5}{8}$ cups. 12 and 8 share the factor 4, so divide both by 4 first: $3 \\times \\frac{5}{2} = \\frac{15}{2}$ cups.\n\nCheck: the long way. $12 \\times \\frac{5}{8} = \\frac{60}{8} = \\frac{15}{2}$.\n\nIn this lesson we divide out a common factor before multiplying, to keep the numbers small.",
    "一份食谱用 $\\frac{5}{8}$ 杯燕麦。做 12 份需要 $12 \\times \\frac{5}{8}$ 杯。12 和 8 有公因数 4，所以先都除以 4：$3 \\times \\frac{5}{2} = \\frac{15}{2}$ 杯。\n\n检验：按原来的方法算。$12 \\times \\frac{5}{8} = \\frac{60}{8} = \\frac{15}{2}$。\n\n本课我们在相乘之前先约去公因数，让数变小。",
  ),
);

// ---------------------------------------------------------------------------
// Decimals

/** num writes a value with at most two decimal places and no trailing zeros: 0.6, 0.63, 2. */
const num = (v: number) => String(Math.round(v * 100) / 100);

/** hundredGrid is one whole cut into 10 columns of 10 small squares, with the first n small squares shaded column by column. */
function hundredGrid(n: number): Figure {
  let body = "";
  for (let c = 0; c < 10; c++)
    for (let r = 0; r < 10; r++)
      body += `<rect x="${90 + c * 14}" y="${6 + r * 14}" width="14" height="14"${c * 10 + r < n ? ` ${shade}` : ""}/>`;
  return {
    svg: svgDocument(152, body),
    alt: t(
      `A square for one whole, cut into 10 columns of 10 small squares, with ${n} small squares shaded.`,
      `一个表示 1 的正方形，分成 10 列、每列 10 个小方格，其中 ${n} 个小方格涂了颜色。`,
    ),
  };
}

/** decimalLine is a number line from lo to hi with ticks every step, its ends labelled, points marked above it and jumps between values. */
function decimalLine(
  lo: number,
  hi: number,
  step: number,
  marks: readonly [number, string][],
  jumps: readonly [number, number][] = [],
): Figure {
  const shown = marks.map((m) => m[1]);
  return lineFigure({ lo, hi, step, label: num, marks: marks.map(([at, text]) => ({ at, text })), jumps }, [
    `A number line from ${num(lo)} to ${num(hi)} in steps of ${num(step)}, with ${shown.join(" and ")} marked${jumps.length ? " and jumps between them" : ""}.`,
    `一条从 ${num(lo)} 到 ${num(hi)} 的数轴，每格是 ${num(step)}，标出了 ${shown.join(" 和 ")}${jumps.length ? "，并画出了跳跃" : ""}。`,
  ]);
}

export const decimalFractions = topic(
  "decimal-fractions",
  t("Decimal Fractions", "十进分数"),
  t(
    "Fractions with denominator 10 or 100 are decimal fractions, written with a decimal point: 7/10 = 0.7 and 23/100 = 0.23. Since 1/10 = 10/100, tenths can be written as hundredths: 0.7 = 0.70.",
    "分母是 10 或 100 的分数叫十进分数，可以用小数点写成小数：7/10 = 0.7，23/100 = 0.23。因为 1/10 = 10/100，十分之几可以写成百分之几：0.7 = 0.70。",
  ),
  ["equivalent-fractions-by-multiplying-and-dividing", "place-value-with-numbers-up-to-four-digits"],
  ["4.NF.C.5", "4.NF.C.6"],
  [
    point(
      "tenths-as-hundredths",
      ["Tenths as hundredths", "十分之几化成百分之几"],
      [
        "$\\frac{3}{10} = \\frac{\\square}{100}$? One tenth is the same as 10 hundredths. So 3 tenths are 30 hundredths, because $3 \\times 10 = 30$. The box is 30.\n\nCheck: on a grid of 100 squares, 3 columns of 10 make 30 squares.\n\n> **Watch out.** Do not keep the 3. $\\frac{3}{100}$ is ten times smaller than $\\frac{3}{10}$.",
        "$\\frac{3}{10} = \\frac{\\square}{100}$？一个十分之一等于 10 个百分之一。所以 3 个十分之一是 30 个百分之一，因为 $3 \\times 10 = 30$。方框里填 30。\n\n检验：在 100 个小方格里，3 列、每列 10 格，一共 30 格。\n\n> **注意。** 不能照抄 3。$\\frac{3}{100}$ 比 $\\frac{3}{10}$ 小得多，只有它的十分之一。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        if (rng.bool()) {
          return answered(
            [`Fill in the box: $$${fr(a, 10)} = \\frac{\\square}{100}$$`, `填空：$$${fr(a, 10)} = \\frac{\\square}{100}$$`],
            10 * a,
            [
              [
                ["One tenth in hundredths", "一个十分之一是几个百分之一"],
                [
                  `One tenth is 10 hundredths. $${fr(1, 10)} = ${fr(10, 100)}$.`,
                  `一个十分之一是 10 个百分之一。$${fr(1, 10)} = ${fr(10, 100)}$。`,
                ],
              ],
              [
                ["Count the hundredths", "数百分之一"],
                [
                  `${a} tenths make ${a} groups of 10 hundredths. $${a} \\times 10 = ${10 * a}$.`,
                  `${a} 个十分之一是 ${a} 个 10 个百分之一。$${a} \\times 10 = ${10 * a}$。`,
                ],
              ],
            ],
            [
              `On a grid of 100 squares, ${a} ${a === 1 ? "column" : "columns"} of 10 make ${10 * a} squares.`,
              `在 100 个小方格里，${a} 列、每列 10 格，一共 ${10 * a} 格。`,
            ],
            [
              [a, "That keeps the top. Hundredths are smaller, so you need more of them.", "这照抄了分子。百分之一更小，需要的个数更多。"],
              [
                100 * a,
                "That makes each tenth 100 hundredths. One tenth is only 10.",
                "这把一个十分之一当成 100 个百分之一了。其实只有 10 个。",
              ],
              [a + 10, "That adds 10 to the top. Multiply by 10 instead.", "这是给分子加 10，应该乘 10。"],
            ],
            { form: "integer", figure: hundredGrid(10 * a) },
          );
        }
        const b = rng.int(1, 9);
        const s = 10 * a + b;
        return answered(
          [
            `Fill in the box: $$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
            `填空：$$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
          ],
          s,
          [
            [
              ["Change the tenths", "把十分之几化成百分之几"],
              [`$${fr(a, 10)} = ${fr(10 * a, 100)}$.`, `$${fr(a, 10)} = ${fr(10 * a, 100)}$。`],
            ],
            [
              ["Add the hundredths", "百分之几相加"],
              [`$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(s, 100)}$.`, `$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(s, 100)}$。`],
            ],
          ],
          [
            `On a grid of 100 squares, ${a} ${a === 1 ? "column" : "columns"} and ${b} more squares make ${s} squares.`,
            `在 100 个小方格里，${a} 列再加 ${b} 格，一共 ${s} 格。`,
          ],
          [
            [a + b, "That adds the tops without changing the tenths to hundredths.", "这没有把十分之几化成百分之几，就把分子相加了。"],
            [10 * b + a, "That changes the hundredths instead of the tenths.", "这把百分之几当成十分之几来变了，弄反了。"],
            [
              100 * a + b,
              "That makes each tenth 100 hundredths. One tenth is only 10.",
              "这把一个十分之一当成 100 个百分之一了。其实只有 10 个。",
            ],
          ],
          { form: "integer", figure: hundredGrid(s) },
        );
      },
      hundredGrid(30),
    ),
    point(
      "writing-decimal-fractions-as-decimals",
      ["Decimal notation", "写成小数"],
      [
        "How do we write $\\frac{7}{100}$ as a decimal? The first place after the point is tenths. The second place is hundredths. The 7 hundredths go in the second place. So we write $0.07$.\n\nCheck: $0.07$ reads as 7 hundredths. That is $\\frac{7}{100}$.\n\n> **Watch out.** $0.7$ means 7 tenths, not 7 hundredths. Keep the 0 in the tenths place.",
        "$\\frac{7}{100}$ 怎样写成小数？小数点后第一位是十分位，第二位是百分位。7 个百分之一写在第二位。所以写成 $0.07$。\n\n检验：$0.07$ 读作 7 个百分之一，就是 $\\frac{7}{100}$。\n\n> **注意。** $0.7$ 表示 7 个十分之一，不是 7 个百分之一。十分位上的 0 不能丢。",
      ],
      (rng) => {
        const tenths = rng.bool(0.35);
        const n = tenths ? rng.int(1, 9) : rng.int(1, 99);
        const den = tenths ? 10 : 100;
        const places = tenths ? 1 : 2;
        const s = dec(n, places);
        return answered(
          [`Write $${fr(n, den)}$ as a decimal.`, `把 $${fr(n, den)}$ 写成小数。`],
          qf(n, den),
          [
            [
              ["Find the place", "找数位"],
              tenths
                ? [
                    "The bottom is 10, so the digit goes in the tenths place, right after the point.",
                    "分母是 10，所以数字写在十分位，也就是小数点后第一位。",
                  ]
                : [
                    "The bottom is 100, so the last digit goes in the hundredths place, two places after the point.",
                    "分母是 100，所以最后一位数字写在百分位，也就是小数点后第二位。",
                  ],
            ],
            [
              ["Write the decimal", "写成小数"],
              [`$${fr(n, den)} = ${s}$.`, `$${fr(n, den)} = ${s}$。`],
            ],
          ],
          [
            `Read $${s}$ back. It is ${n} ${tenths ? (n === 1 ? "tenth" : "tenths") : n === 1 ? "hundredth" : "hundredths"}.`,
            `把 $${s}$ 读回去：它是 ${n} 个${tenths ? "十分之一" : "百分之一"}。`,
          ],
          [
            tenths
              ? [
                  qf(n, 100),
                  "That puts the digit in the hundredths place. Tenths come right after the point.",
                  "这把数字写在了百分位。十分之几紧挨着小数点。",
                ]
              : n < 10
                ? [qf(n, 10), "That leaves out the 0 in the tenths place, so it means tenths.", "这漏掉了十分位上的 0，变成了十分之几。"]
                : [
                    qf(n, 10),
                    "That puts only one digit after the point. Hundredths need two places.",
                    "这只在小数点后写了一位。百分之几要占两位。",
                  ],
            [qf(n, den * 10), "That moves the digits one place too far to the right.", "这把数字多往右移了一位。"],
            [n, "That leaves out the decimal point.", "这漏掉了小数点。"],
          ],
          { form: "decimal", figure: hundredGrid(tenths ? 10 * n : n) },
        );
      },
      hundredGrid(7),
    ),
  ],
  t(
    "Lily's chocolate bar has 10 equal pieces. She eats 7 of them. That is $\\frac{7}{10}$ of the bar, and we can also write $0.7$.\n\nCheck: 7 tenths is the same as 70 hundredths, so $0.7 = 0.70$.\n\nIn this lesson we write tenths and hundredths as fractions and as decimals.",
    "莉莉的巧克力有 10 块一样大的小块，她吃了 7 块。这是整块的 $\\frac{7}{10}$，也可以写成 $0.7$。\n\n检验：7 个十分之一就是 70 个百分之一，所以 $0.7 = 0.70$。\n\n本课我们把十分之几和百分之几写成分数，也写成小数。",
  ),
);

export const plottingDecimalsOnNumberLines = topic(
  "plotting-decimals-on-number-lines",
  t("Plotting Decimals on Number Lines", "在数轴上表示小数"),
  t(
    "Cutting the segment from 0 to 1 into 10 equal steps marks the tenths 0.1, 0.2, …, 0.9. Cutting a segment of length 0.1, such as from 0.3 to 0.4, into 10 steps marks hundredths: 0.31, 0.32, …, 0.39.",
    "把 0 到 1 的线段平均分成 10 格，就标出十分之几：0.1, 0.2, …, 0.9。把长 0.1 的线段（例如从 0.3 到 0.4）平均分成 10 格，就标出百分之几：0.31, 0.32, …, 0.39。",
  ),
  ["decimal-fractions", "modeling-fractions-using-number-lines"],
  ["4.NF.C.6"],
  [
    point(
      "reading-tenths-on-number-lines",
      ["Tenths", "十分位"],
      [
        "A line from 2 to 3 is cut into 10 equal steps. Each step is $0.1$. Point $P$ is 4 steps past 2. So $P$ is at $2.4$.\n\nCheck: $P$ is 6 steps before 3. $3 - 0.6 = 2.4$.\n\n> **Watch out.** Count the steps, not the tick marks. The tick at 2 is where you start, not step 1.",
        "从 2 到 3 平均分成 10 格，每格是 $0.1$。点 $P$ 在 2 右边第 4 格。所以 $P$ 表示 $2.4$。\n\n检验：$P$ 在 3 左边第 6 格。$3 - 0.6 = 2.4$。\n\n> **注意。** 数的是格子，不是刻度线。2 那条刻度线是起点，不算第 1 格。",
      ],
      (rng) => {
        const w = rng.int(0, 5);
        const k = rng.int(1, 9);
        const v = 10 * w + k;
        return answered(
          ["What decimal does point $P$ show?", "点 $P$ 表示什么小数？"],
          qf(v, 10),
          [
            [
              ["Find one step", "找一格的大小"],
              [
                `From ${w} to ${w + 1} is one whole cut into 10 steps. So each step is $0.1$.`,
                `从 ${w} 到 ${w + 1} 是 1 平均分成 10 格。所以每格是 $0.1$。`,
              ],
            ],
            [
              ["Count the steps", "数格子"],
              [
                `$P$ is ${k} ${k === 1 ? "step" : "steps"} past ${w}. That is ${w} and ${k} tenths, or $${num(v / 10)}$.`,
                `$P$ 在 ${w} 右边第 ${k} 格，是 ${w} 和 ${k} 个十分之一，也就是 $${num(v / 10)}$。`,
              ],
            ],
          ],
          [
            `$P$ is ${10 - k} ${10 - k === 1 ? "step" : "steps"} before ${w + 1}. $${w + 1} - ${num((10 - k) / 10)} = ${num(v / 10)}$.`,
            `$P$ 在 ${w + 1} 左边第 ${10 - k} 格。$${w + 1} - ${num((10 - k) / 10)} = ${num(v / 10)}$。`,
          ],
          [
            [
              qf(100 * w + k, 100),
              "That reads each step as a hundredth. Here each step is a tenth.",
              "这把每格当成百分之一了。这里每格是十分之一。",
            ],
            [qf(v + 1, 10), "That counts the tick at the start as a step.", "这把起点那条刻度线也算成一格了。"],
            [qf(10 * w + 10 - k, 10), `That counts from ${w + 1} instead of from ${w}.`, `这是从 ${w + 1} 往回数的，应该从 ${w} 往右数。`],
            [w + k, "That counts each step as a whole one.", "这把每格当成 1 了。"],
          ],
          { form: "decimal", figure: decimalLine(w, w + 1, 0.1, [[v / 10, "P"]]) },
        );
      },
      decimalLine(2, 3, 0.1, [[2.4, "P"]]),
    ),
    point(
      "reading-hundredths-on-number-lines",
      ["Hundredths", "百分位"],
      [
        "A line from $0.6$ to $0.7$ is cut into 10 equal steps. Each step is $0.01$. Point $P$ is 3 steps past $0.6$. So $P$ is at $0.63$.\n\nCheck: $0.6$ is 60 hundredths, and 3 more make 63 hundredths. That is $0.63$.\n\n> **Watch out.** Each step here is $0.01$, not $0.1$. So $P$ is not $0.9$.",
        "从 $0.6$ 到 $0.7$ 平均分成 10 格，每格是 $0.01$。点 $P$ 在 $0.6$ 右边第 3 格。所以 $P$ 表示 $0.63$。\n\n检验：$0.6$ 是 60 个百分之一，再加 3 个是 63 个百分之一，也就是 $0.63$。\n\n> **注意。** 这里每格是 $0.01$，不是 $0.1$。所以 $P$ 不是 $0.9$。",
      ],
      (rng) => {
        const start = rng.int(0, 29);
        const k = rng.int(1, 9);
        const v = 10 * start + k;
        const [a, b] = [num(start / 10), num((start + 1) / 10)];
        return answered(
          ["What decimal does point $P$ show?", "点 $P$ 表示什么小数？"],
          qf(v, 100),
          [
            [
              ["Find one step", "找一格的大小"],
              [
                `From ${a} to ${b} is one tenth cut into 10 steps. So each step is $0.01$.`,
                `从 ${a} 到 ${b} 是一个十分之一平均分成 10 格。所以每格是 $0.01$。`,
              ],
            ],
            [
              ["Count the steps", "数格子"],
              [
                `${a} is ${10 * start} hundredths. ${k} more ${k === 1 ? "step makes" : "steps make"} ${v} hundredths. That is $${num(v / 100)}$.`,
                `${a} 是 ${10 * start} 个百分之一，再走 ${k} 格是 ${v} 个百分之一，也就是 $${num(v / 100)}$。`,
              ],
            ],
          ],
          [
            `$P$ is ${10 - k} ${10 - k === 1 ? "step" : "steps"} before ${b}. $${b} - ${num((10 - k) / 100)} = ${num(v / 100)}$.`,
            `$P$ 在 ${b} 左边第 ${10 - k} 格。$${b} - ${num((10 - k) / 100)} = ${num(v / 100)}$。`,
          ],
          [
            [
              qf(start + k, 10),
              "That reads each step as a tenth. Here each step is a hundredth.",
              "这把每格当成十分之一了。这里每格是百分之一。",
            ],
            [qf(v + 1, 100), "That counts the tick at the start as a step.", "这把起点那条刻度线也算成一格了。"],
            [qf(10 * start + 10 - k, 100), `That counts from ${b} instead of from ${a}.`, `这是从 ${b} 往回数的，应该从 ${a} 往右数。`],
          ],
          { form: "decimal", figure: decimalLine(start / 10, (start + 1) / 10, 0.01, [[v / 100, "P"]]) },
        );
      },
      decimalLine(0.6, 0.7, 0.01, [[0.63, "P"]]),
    ),
  ],
  t(
    "A snail crawls along a ruler from 0 to 1 meter. The meter is cut into 10 equal steps, so each step is $0.1$ meter. The snail stops 6 steps past 0, at $0.6$ meter.\n\nCheck: 6 steps of one tenth make 6 tenths. That is $0.6$.\n\nIn this lesson we find tenths and hundredths on a number line.",
    "一只蜗牛沿着尺子从 0 爬向 1 米。1 米平均分成 10 格，每格是 $0.1$ 米。蜗牛停在 0 右边第 6 格，也就是 $0.6$ 米处。\n\n检验：6 格、每格十分之一，是 6 个十分之一，也就是 $0.6$。\n\n本课我们在数轴上找十分之几和百分之几。",
  ),
);

export const comparingDecimalsUpToHundredths = topic(
  "comparing-decimals-up-to-hundredths",
  t("Comparing Decimals Up to Hundredths", "比较两位小数的大小"),
  t(
    "Compare decimals place by place from the left, as with whole numbers: first the whole number part, then the tenths, then the hundredths. Writing both with two decimal places helps: 0.5 = 0.50 > 0.45.",
    "比较小数时，像比较整数那样从左往右逐位比较：先比整数部分，再比十分位，再比百分位。把两个数都写成两位小数会更清楚：0.5 = 0.50 > 0.45。",
  ),
  ["plotting-decimals-on-number-lines", "comparing-whole-numbers"],
  ["4.NF.C.7"],
  [
    point(
      "comparing-two-decimals",
      ["Two decimals", "比较两个小数"],
      [
        "$0.6$ or $0.58$? Give them the same number of places: $0.60$ and $0.58$. Look at the tenths first: 6 is more than 5. So $0.6 > 0.58$.\n\nCheck: 60 hundredths is more than 58 hundredths.\n\n> **Watch out.** More digits do not make a decimal bigger. 58 looks bigger than 6, but $0.58$ is smaller.",
        "$0.6$ 和 $0.58$ 哪个大？先写成同样的位数：$0.60$ 和 $0.58$。先比十分位：6 比 5 大。所以 $0.6 > 0.58$。\n\n检验：60 个百分之一比 58 个百分之一多。\n\n> **注意。** 小数位数多不代表数大。58 看起来比 6 大，可是 $0.58$ 更小。",
      ],
      (rng) => {
        const w = rng.int(0, 9);
        const tenthsOnly = rng.bool(0.5);
        const x = 100 * w + (tenthsOnly ? 10 * rng.int(1, 9) : rng.int(1, 99));
        let y: number;
        do y = 100 * w + rng.int(1, 99);
        while (y % 10 === 0 || y === x);
        const fx = (v: number) => num(v / 100);
        const [a, b] = rng.bool() ? [y, x] : [x, y];
        const rel = relation(qf(a, 100), qf(b, 100));
        const sign = symbols[rel]!;
        const word: Pair = rel === 2 ? ["more than", "大于"] : ["less than", "小于"];
        const [ta, tb, ha, hb] = [Math.floor(a / 10) % 10, Math.floor(b / 10) % 10, a % 10, b % 10];
        return compareSigns(
          rng,
          fx(a),
          fx(b),
          rel,
          [
            [
              ["Line up the places", "对齐数位"],
              [`Write both with two places: $${dec(a, 2)}$ and $${dec(b, 2)}$.`, `都写成两位小数：$${dec(a, 2)}$ 和 $${dec(b, 2)}$。`],
            ],
            [
              ["Compare from the left", "从左往右比"],
              ta !== tb
                ? [
                    `The wholes are the same. The tenths are ${ta} and ${tb}. So $${fx(a)} ${sign} ${fx(b)}$.`,
                    `整数部分相同。十分位是 ${ta} 和 ${tb}。所以 $${fx(a)} ${sign} ${fx(b)}$。`,
                  ]
                : [
                    `The wholes and the tenths are the same. The hundredths are ${ha} and ${hb}. So $${fx(a)} ${sign} ${fx(b)}$.`,
                    `整数部分和十分位都相同。百分位是 ${ha} 和 ${hb}。所以 $${fx(a)} ${sign} ${fx(b)}$。`,
                  ],
            ],
          ],
          [`Count hundredths: ${a} is ${word[0]} ${b}.`, `数百分之一：${a} 个${word[1]} ${b} 个。`],
          decimalLine(w, w + 1, 0.1, [
            [a / 100, fx(a)],
            [b / 100, fx(b)],
          ]),
        );
      },
      decimalLine(0.5, 0.7, 0.01, [
        [0.58, "0.58"],
        [0.6, "0.6"],
      ]),
    ),
    point(
      "finding-the-greatest-decimal",
      ["The greatest decimal", "最大的小数"],
      [
        "Which is the greatest: $0.4$, $0.38$, $0.42$ or $0.09$? Write them with two places: $0.40$, $0.38$, $0.42$, $0.09$. The biggest tenths digit is 4, in $0.40$ and $0.42$. Of those two, $0.42$ has more hundredths. So $0.42$ is the greatest.\n\nCheck: in hundredths they are 40, 38, 42 and 9. The most is 42.\n\n> **Watch out.** $0.38$ has the most digits, but it is not the greatest.",
        "$0.4$、$0.38$、$0.42$、$0.09$ 中哪个最大？都写成两位小数：$0.40$、$0.38$、$0.42$、$0.09$。十分位最大的是 4，有 $0.40$ 和 $0.42$。这两个里 $0.42$ 的百分位更大。所以 $0.42$ 最大。\n\n检验：写成百分之几是 40、38、42、9。最多的是 42。\n\n> **注意。** $0.38$ 的数字最多，可它不是最大的。",
      ],
      (rng) => {
        const w = rng.int(0, 5);
        const vals = new Set<number>();
        while (vals.size < 4) vals.add(100 * w + rng.pick([10 * rng.int(1, 9), rng.int(1, 99)]));
        const list = [...vals];
        const fx = (v: number) => num(v / 100);
        const asc = rng.bool(0.35);
        const best = asc ? Math.min(...list) : Math.max(...list);
        const sorted = [...list].sort((p, q) => p - q);
        const most: Pair = asc ? ["least", "最小"] : ["greatest", "最大"];
        return pickedMath(
          rng,
          [`Which is the ${most[0]}: $${list.map(fx).join("$, $")}$?`, `$${list.map(fx).join("$、$")}$ 中哪个${most[1]}？`],
          fx(best),
          list
            .filter((v) => v !== best)
            .map((v): [string, string, string] => [
              fx(v),
              `With two places it is $${dec(v, 2)}$. That is ${asc ? "more" : "less"} than $${dec(best, 2)}$.`,
              `写成两位小数是 $${dec(v, 2)}$，比 $${dec(best, 2)}$ ${asc ? "大" : "小"}。`,
            ]),
          [
            [
              ["Line up the places", "对齐数位"],
              [
                `Write them all with two places: $${list.map((v) => dec(v, 2)).join("$, $")}$.`,
                `都写成两位小数：$${list.map((v) => dec(v, 2)).join("$、$")}$。`,
              ],
            ],
            [
              ["Put them in order", "排顺序"],
              [
                `$${sorted.map((v) => dec(v, 2)).join(" < ")}$. So the ${most[0]} is $${fx(best)}$.`,
                `$${sorted.map((v) => dec(v, 2)).join(" < ")}$。所以${most[1]}的是 $${fx(best)}$。`,
              ],
            ],
          ],
          [
            `In hundredths they are ${list.join(", ")}. The ${asc ? "fewest" : "most"} is ${best}.`,
            `写成百分之几是 ${list.join("、")}。${asc ? "最少" : "最多"}的是 ${best}。`,
          ],
        );
      },
      decimalLine(0.3, 0.5, 0.01, [
        [0.38, "0.38"],
        [0.42, "0.42"],
      ]),
    ),
  ],
  t(
    "Tom's frog jumps $0.6$ meter. Sam's frog jumps $0.58$ meter. Whose frog jumps farther? Write both in hundredths: 60 and 58. Tom's frog jumps farther.\n\nCheck: on a number line, $0.6$ is to the right of $0.58$.\n\nIn this lesson we compare decimals place by place.",
    "汤姆的青蛙跳了 $0.6$ 米，萨姆的青蛙跳了 $0.58$ 米。谁的青蛙跳得远？都写成百分之几：60 和 58。汤姆的青蛙跳得远。\n\n检验：在数轴上，$0.6$ 在 $0.58$ 的右边。\n\n本课我们按数位一位一位地比较小数。",
  ),
);

/** decimalDenominators are denominators that divide 100. */
const decimalDenominators = [2, 4, 5, 20, 25, 50];

export const convertingFractionsToDecimals = topic(
  "converting-fractions-to-decimals",
  t("Converting Fractions to Decimals", "把分数化成小数"),
  t(
    "A fraction whose denominator divides 100 can be rewritten with denominator 10 or 100 and then written as a decimal: 3/4 = 75/100 = 0.75, and 2/5 = 4/10 = 0.4.",
    "分母是 100 的因数的分数，可以先化成分母是 10 或 100 的分数，再写成小数：3/4 = 75/100 = 0.75，2/5 = 4/10 = 0.4。",
  ),
  ["decimal-fractions"],
  ["4.NF.C.6"],
  [
    point(
      "fractions-with-denominators-ten-and-hundred",
      ["Tenths and hundredths", "十分之几和百分之几"],
      [
        "$\\frac{9}{100}$ is 9 hundredths. Hundredths take two places after the point. So we write $0.09$.\n\nCheck: $0.09$ reads as 9 hundredths.\n\n> **Watch out.** $0.9$ is 9 tenths, ten times too big. Keep the 0 in the tenths place.",
        "$\\frac{9}{100}$ 是 9 个百分之一。百分之几要占小数点后两位。所以写成 $0.09$。\n\n检验：$0.09$ 读作 9 个百分之一。\n\n> **注意。** $0.9$ 是 9 个十分之一，大了十倍。十分位上的 0 不能丢。",
      ],
      (rng) => {
        const den = rng.pick([10, 100]);
        let n: number;
        do n = den === 10 ? rng.int(1, 99) : rng.int(1, 999);
        while (n % 10 === 0);
        const places = den === 10 ? 1 : 2;
        const s = dec(n, places);
        return answered(
          [`Write $${fr(n, den)}$ as a decimal.`, `把 $${fr(n, den)}$ 写成小数。`],
          qf(n, den),
          [
            [
              ["Count the places", "数小数位数"],
              den === 10
                ? ["The bottom is 10, so there is one place after the point.", "分母是 10，所以小数点后有一位。"]
                : ["The bottom is 100, so there are two places after the point.", "分母是 100，所以小数点后有两位。"],
            ],
            [
              ["Write the decimal", "写成小数"],
              [`$${fr(n, den)} = ${s}$.`, `$${fr(n, den)} = ${s}$。`],
            ],
          ],
          [
            `Read $${s}$ back. It is ${n} ${den === 10 ? "tenths" : "hundredths"}.`,
            `把 $${s}$ 读回去：它是 ${n} 个${den === 10 ? "十分之一" : "百分之一"}。`,
          ],
          [
            den === 10
              ? [qf(n, 100), "That uses two places. Tenths need only one.", "这写成了两位小数。十分之几只要一位。"]
              : [qf(n, 10), "That uses one place. Hundredths need two.", "这只写了一位小数。百分之几要两位。"],
            [qf(n, den * 10), "That moves the point one place too far to the left.", "这把小数点多往左移了一位。"],
            [n, "That leaves out the decimal point.", "这漏掉了小数点。"],
          ],
          { form: "decimal", ...(n < den && { figure: hundredGrid(den === 10 ? 10 * n : n) }) },
        );
      },
      hundredGrid(9),
    ),
    point(
      "fractions-with-denominators-dividing-a-hundred",
      ["Other denominators", "其他分母"],
      [
        "$\\frac{7}{20}$ as a decimal? $20 \\times 5 = 100$. So multiply the top and the bottom by 5. That gives $\\frac{7}{20} = \\frac{35}{100}$. As a decimal it is $0.35$.\n\nCheck: divide 35 and 100 by 5. That gives back $\\frac{7}{20}$.\n\n> **Watch out.** Do not just write the top after the point. $\\frac{7}{20}$ is not $0.7$.",
        "$\\frac{7}{20}$ 化成小数是多少？$20 \\times 5 = 100$。所以分子和分母都乘 5，得到 $\\frac{7}{20} = \\frac{35}{100}$。写成小数是 $0.35$。\n\n检验：35 和 100 都除以 5，又得到 $\\frac{7}{20}$。\n\n> **注意。** 不能把分子直接写在小数点后面。$\\frac{7}{20}$ 不是 $0.7$。",
      ],
      (rng) => {
        const d = rng.pick(decimalDenominators);
        const n = coprimeTo(rng, d, 1, d - 1);
        const k = 100 / d;
        const s = num((n * k) / 100);
        return answered(
          [`Write $${fr(n, d)}$ as a decimal.`, `把 $${fr(n, d)}$ 写成小数。`],
          qf(n, d),
          [
            [
              ["Make the bottom 100", "把分母变成 100"],
              [
                `$${d} \\times ${k} = 100$. So $${fr(n, d)} = ${fr(n * k, 100)}$.`,
                `$${d} \\times ${k} = 100$。所以 $${fr(n, d)} = ${fr(n * k, 100)}$。`,
              ],
            ],
            [
              ["Write the decimal", "写成小数"],
              [`$${fr(n * k, 100)} = ${s}$.`, `$${fr(n * k, 100)} = ${s}$。`],
            ],
          ],
          [`Divide ${n * k} and 100 by ${k}. That gives back $${fr(n, d)}$.`, `把 ${n * k} 和 100 都除以 ${k}，又得到 $${fr(n, d)}$。`],
          [
            [
              n < 10 ? qf(n, 10) : qf(n, 100),
              "That writes the top after the point without changing the bottom.",
              "这没有先变分母，就把分子写在了小数点后面。",
            ],
            [qf(n, 100), `That puts the top over 100 without multiplying it by ${k}.`, `这把分母变成了 100，可分子没有乘 ${k}。`],
            [qf(n * k, 1000), `That uses three places. ${n * k} hundredths need two.`, `这写成了三位小数。${n * k} 个百分之一只要两位。`],
          ],
          { form: "decimal", figure: hundredGrid(n * k) },
        );
      },
      hundredGrid(35),
    ),
  ],
  t(
    "A juice box holds $\\frac{1}{4}$ liter. The label says $0.25$ liter. Both are right. A whole is 100 hundredths, and one quarter of 100 is 25.\n\nCheck: four quarters make a whole, and $25 + 25 + 25 + 25 = 100$.\n\nIn this lesson we turn fractions into decimals by making the bottom 10 or 100.",
    "一盒果汁装 $\\frac{1}{4}$ 升，标签上写着 $0.25$ 升。两个都对。1 是 100 个百分之一，100 的四分之一是 25。\n\n检验：四个四分之一合成 1，$25 + 25 + 25 + 25 = 100$。\n\n本课我们把分母变成 10 或 100，把分数化成小数。",
  ),
);

export const convertingMixedNumbersToDecimals = topic(
  "converting-mixed-numbers-to-decimals",
  t("Converting Mixed Numbers to Decimals", "把带分数化成小数"),
  t(
    "The whole number of a mixed number goes before the decimal point and the fraction after it: 3 7/10 = 3.7, 2 1/4 = 2 25/100 = 2.25.",
    "带分数的整数部分写在小数点左边，分数部分化成小数写在右边：3 7/10 = 3.7，2 1/4 = 2 25/100 = 2.25。",
  ),
  ["converting-fractions-to-decimals", "models-for-mixed-numbers"],
  ["4.NF.C.6"],
  [
    point(
      "mixed-numbers-with-tenths-and-hundredths",
      ["Tenths and hundredths", "十分之几和百分之几"],
      [
        "$5\\frac{3}{100}$ as a decimal? The 5 goes before the point. 3 hundredths take two places, so the tenths place gets a 0. We write $5.03$.\n\nCheck: $5.03$ reads as 5 and 3 hundredths.\n\n> **Watch out.** $5.3$ means 5 and 3 tenths. It leaves out the 0.",
        "$5\\frac{3}{100}$ 化成小数是多少？5 写在小数点前面。3 个百分之一要占两位，所以十分位写 0。写成 $5.03$。\n\n检验：$5.03$ 读作 5 和 3 个百分之一。\n\n> **注意。** $5.3$ 表示 5 和 3 个十分之一，漏掉了 0。",
      ],
      (rng) => {
        const w = rng.int(1, 20);
        const den = rng.pick([10, 100]);
        let r: number;
        do r = rng.int(1, den - 1);
        while (r % 10 === 0);
        const places = den === 10 ? 1 : 2;
        const v = w * den + r;
        const s = dec(v, places);
        return answered(
          [`Write $${mx(w, r, den)}$ as a decimal.`, `把 $${mx(w, r, den)}$ 写成小数。`],
          qf(v, den),
          [
            [
              ["The whole before the point", "整数写在小数点前"],
              [`The whole number ${w} goes before the point.`, `整数 ${w} 写在小数点前面。`],
            ],
            [
              ["The part after the point", "分数写在小数点后"],
              [`$${fr(r, den)} = ${dec(r, places)}$. So the answer is $${s}$.`, `$${fr(r, den)} = ${dec(r, places)}$。所以答案是 $${s}$。`],
            ],
          ],
          [
            `Read $${s}$ back. It is ${w} and ${r} ${den === 10 ? "tenths" : "hundredths"}.`,
            `把 $${s}$ 读回去：它是 ${w} 和 ${r} 个${den === 10 ? "十分之一" : "百分之一"}。`,
          ],
          [
            den === 10
              ? [qf(w * 100 + r, 100), "That puts the tenths in the hundredths place.", "这把十分之几写到百分位上了。"]
              : r < 10
                ? [qf(w * 10 + r, 10), "That leaves out the 0 in the tenths place.", "这漏掉了十分位上的 0。"]
                : [qf(w * 1000 + r, 1000), "That uses three places. Hundredths need two.", "这写成了三位小数。百分之几只要两位。"],
            [qf(r, den), "That leaves out the whole number.", "这漏掉了整数部分。"],
            [w + r, "That adds the whole number and the top.", "这把整数和分子加起来了。"],
          ],
          { form: "decimal", figure: decimalLine(w, w + 1, 0.1, [[v / den, s]]) },
        );
      },
      decimalLine(5, 5.1, 0.01, [[5.03, "5.03"]]),
    ),
    point(
      "mixed-numbers-with-other-denominators",
      ["Other denominators", "其他分母"],
      [
        "$4\\frac{3}{5}$ as a decimal? Keep the 4. Change the part to tenths: multiply 3 and 5 by 2 to get $\\frac{6}{10}$. So the decimal is $4.6$.\n\nCheck: $4.6 = 4\\frac{6}{10}$. Divide 6 and 10 by 2 to get back $4\\frac{3}{5}$.\n\n> **Watch out.** $4.3$ is wrong. It just copies the top 3 after the point.",
        "$4\\frac{3}{5}$ 化成小数是多少？4 不变。把分数部分化成十分之几：3 和 5 都乘 2，得到 $\\frac{6}{10}$。所以小数是 $4.6$。\n\n检验：$4.6 = 4\\frac{6}{10}$。6 和 10 都除以 2，又得到 $4\\frac{3}{5}$。\n\n> **注意。** $4.3$ 是错的。它只是把分子 3 抄到了小数点后面。",
      ],
      (rng) => {
        const w = rng.int(1, 20);
        const d = rng.pick(decimalDenominators);
        const n = coprimeTo(rng, d, 1, d - 1);
        const k = 100 / d;
        const s = num(w + (n * k) / 100);
        return answered(
          [`Write $${mx(w, n, d)}$ as a decimal.`, `把 $${mx(w, n, d)}$ 写成小数。`],
          qf(w * d + n, d),
          [
            [
              ["Make the bottom 100", "把分母变成 100"],
              [
                `$${d} \\times ${k} = 100$. So $${fr(n, d)} = ${fr(n * k, 100)}$.`,
                `$${d} \\times ${k} = 100$。所以 $${fr(n, d)} = ${fr(n * k, 100)}$。`,
              ],
            ],
            [
              ["Write the decimal", "写成小数"],
              [`Put ${w} before the point. The answer is $${s}$.`, `把 ${w} 写在小数点前面。答案是 $${s}$。`],
            ],
          ],
          [
            `$${s} = ${mx(w, n * k, 100)}$. Divide ${n * k} and 100 by ${k} to get back $${mx(w, n, d)}$.`,
            `$${s} = ${mx(w, n * k, 100)}$。${n * k} 和 100 都除以 ${k}，又得到 $${mx(w, n, d)}$。`,
          ],
          [
            [
              n < 10 ? qf(w * 10 + n, 10) : qf(w * 100 + n, 100),
              "That copies the top after the point without changing the bottom.",
              "这没有先变分母，就把分子抄到了小数点后面。",
            ],
            [qf(n * k, 100), "That leaves out the whole number.", "这漏掉了整数部分。"],
            [qf(w * 100 + d, 100), "That writes the bottom after the point.", "这把分母写到了小数点后面。"],
          ],
          { form: "decimal" },
        );
      },
      decimalLine(4, 5, 0.1, [[4.6, "4.6"]]),
    ),
  ],
  t(
    "A ribbon is $2\\frac{3}{10}$ meters long. The 2 whole meters go before the point. The 3 tenths go after it. So the ribbon is $2.3$ meters long.\n\nCheck: $2.3$ reads as 2 and 3 tenths.\n\nIn this lesson we write mixed numbers as decimals.",
    "一条丝带长 $2\\frac{3}{10}$ 米。2 个整米写在小数点前面，3 个十分之一写在后面。所以丝带长 $2.3$ 米。\n\n检验：$2.3$ 读作 2 和 3 个十分之一。\n\n本课我们把带分数写成小数。",
  ),
);

export const convertingDecimalsToFractions = topic(
  "converting-decimals-to-fractions",
  t("Converting Decimals to Fractions", "把小数化成分数"),
  t(
    "A decimal with one decimal place is a number of tenths and one with two decimal places a number of hundredths: 0.45 = 45/100, which in lowest terms is 9/20.",
    "一位小数表示十分之几，两位小数表示百分之几：0.45 = 45/100，化成最简分数是 9/20。",
  ),
  ["converting-fractions-to-decimals", "writing-fractions-in-lowest-terms"],
  ["4.NF.C.6"],
  [
    point(
      "decimals-as-tenths-and-hundredths",
      ["Tenths and hundredths", "十分之几和百分之几"],
      [
        "$0.07$ has two places after the point, so it is hundredths. The digits after the point make 7. So $0.07 = \\frac{7}{100}$.\n\nCheck: $\\frac{7}{100}$ is 7 squares on a grid of 100.\n\n> **Watch out.** Count the places, not the digits. $0.07$ is not $\\frac{7}{10}$.",
        "$0.07$ 小数点后有两位，所以是百分之几。小数点后的数字是 7。所以 $0.07 = \\frac{7}{100}$。\n\n检验：$\\frac{7}{100}$ 是 100 个小方格里的 7 格。\n\n> **注意。** 要看有几位小数，不是看数字。$0.07$ 不是 $\\frac{7}{10}$。",
      ],
      (rng) => {
        const tenths = rng.bool(0.3);
        const den = tenths ? 10 : 100;
        const n = coprimeTo(rng, den, 1, den - 1);
        const s = dec(n, tenths ? 1 : 2);
        return answered(
          [`Write $${s}$ as a fraction.`, `把 $${s}$ 写成分数。`],
          qf(n, den),
          [
            [
              ["Count the places", "数小数位数"],
              tenths
                ? ["One place after the point means tenths. The bottom is 10.", "小数点后有一位，是十分之几。分母是 10。"]
                : ["Two places after the point mean hundredths. The bottom is 100.", "小数点后有两位，是百分之几。分母是 100。"],
            ],
            [
              ["Write the fraction", "写成分数"],
              [`The digits after the point make ${n}. So $${s} = ${fr(n, den)}$.`, `小数点后的数字是 ${n}。所以 $${s} = ${fr(n, den)}$。`],
            ],
          ],
          [`Write $${fr(n, den)}$ back as a decimal. It is $${s}$.`, `把 $${fr(n, den)}$ 写回小数，就是 $${s}$。`],
          [
            tenths
              ? [qf(n, 100), "That uses hundredths. One place means tenths.", "这写成了百分之几。一位小数是十分之几。"]
              : [qf(n, 10), "That uses tenths. Two places mean hundredths.", "这写成了十分之几。两位小数是百分之几。"],
            [qf(n, 1000), "That uses thousandths. Count the places after the point.", "这写成了千分之几。要数一数小数点后有几位。"],
            [n, "That leaves out the bottom.", "这漏掉了分母。"],
          ],
          { form: "fraction", figure: hundredGrid(tenths ? 10 * n : n) },
        );
      },
      hundredGrid(7),
    ),
    point(
      "decimals-as-fractions-in-lowest-terms",
      ["In lowest terms", "化成最简分数"],
      [
        "$0.75$ is $\\frac{75}{100}$. Both 75 and 100 can be divided by 25. So $0.75 = \\frac{3}{4}$.\n\nCheck: 75 squares on a grid of 100 fill three quarters of it.\n\n> **Watch out.** Divide the top and the bottom by the same number. Dividing only one of them changes the value.",
        "$0.75$ 是 $\\frac{75}{100}$。75 和 100 都能被 25 整除。所以 $0.75 = \\frac{3}{4}$。\n\n检验：100 个小方格里涂 75 格，正好是四分之三。\n\n> **注意。** 分子和分母要除以同一个数。只除其中一个，大小就变了。",
      ],
      (rng) => {
        let p: number;
        let q: number;
        do {
          q = rng.bool(0.3) ? 10 : 100;
          p = rng.int(2, q - 2);
        } while (gcd(p, q) === 1 || p % 10 === 0);
        const g = gcd(p, q);
        const v = qf(p, q);
        const s = dec(p, q === 10 ? 1 : 2);
        return answered(
          [`Write $${s}$ as a fraction in lowest terms.`, `把 $${s}$ 写成最简分数。`],
          v,
          [
            [
              ["Write as a fraction", "写成分数"],
              [`$${s} = ${fr(p, q)}$.`, `$${s} = ${fr(p, q)}$。`],
            ],
            [
              ["Simplify", "约分"],
              [
                `${p} and ${q} can both be divided by ${g}. $${fr(p, q)} = ${v.toLatex()}$.`,
                `${p} 和 ${q} 都能被 ${g} 整除。$${fr(p, q)} = ${v.toLatex()}$。`,
              ],
            ],
          ],
          [
            `Multiply the top and the bottom of $${v.toLatex()}$ by ${g}. That gives back $${fr(p, q)}$.`,
            `把 $${v.toLatex()}$ 的分子和分母都乘 ${g}，又得到 $${fr(p, q)}$。`,
          ],
          [
            [qf(p / g, q), `That divides only the top by ${g}.`, `这只把分子除以 ${g}。`],
            [qf(p, q / g), `That divides only the bottom by ${g}.`, `这只把分母除以 ${g}。`],
            q === 10
              ? [qf(p, 100), "That reads one place as hundredths.", "这把一位小数当成百分之几了。"]
              : [qf(p, 10), "That reads two places as tenths.", "这把两位小数当成十分之几了。"],
          ],
          { form: "fraction", figure: hundredGrid(q === 10 ? 10 * p : p) },
        );
      },
      hundredGrid(75),
    ),
  ],
  t(
    "A glass is $0.3$ full. That is 3 tenths, so the glass is $\\frac{3}{10}$ full.\n\nCheck: $\\frac{3}{10}$ written as a decimal is $0.3$.\n\nIn this lesson we write decimals as fractions, and then in lowest terms.",
    "一个杯子装了 $0.3$ 杯水。这是 3 个十分之一，所以杯子装了 $\\frac{3}{10}$。\n\n检验：$\\frac{3}{10}$ 写成小数是 $0.3$。\n\n本课我们把小数写成分数，再化成最简分数。",
  ),
);

export const convertingDecimalsToMixedNumbers = topic(
  "converting-decimals-to-mixed-numbers",
  t("Converting Decimals to Mixed Numbers", "把小数化成带分数"),
  t(
    "The digits before the decimal point give the whole number of a mixed number and the digits after it give the fraction: 3.25 = 3 25/100 = 3 1/4.",
    "小数点左边的数是带分数的整数部分，右边的数化成分数作为分数部分：3.25 = 3 25/100 = 3 1/4。",
  ),
  ["converting-decimals-to-fractions", "converting-mixed-numbers-to-decimals"],
  ["4.NF.C.6"],
  [
    point(
      "decimals-as-mixed-numbers-with-tenths-and-hundredths",
      ["Tenths and hundredths", "十分之几和百分之几"],
      [
        "$6.07$: the 6 before the point is the whole number. The 07 after it is 7 hundredths. So $6.07 = 6\\frac{7}{100}$.\n\nCheck: $6\\frac{7}{100}$ written as a decimal is $6.07$.\n\n> **Watch out.** Two places mean hundredths. $6\\frac{7}{10}$ would be $6.7$.",
        "$6.07$：小数点前的 6 是整数部分。后面的 07 是 7 个百分之一。所以 $6.07 = 6\\frac{7}{100}$。\n\n检验：$6\\frac{7}{100}$ 写成小数是 $6.07$。\n\n> **注意。** 两位小数是百分之几。$6\\frac{7}{10}$ 是 $6.7$。",
      ],
      (rng) => {
        const w = rng.int(1, 20);
        const tenths = rng.bool(0.3);
        const den = tenths ? 10 : 100;
        const n = coprimeTo(rng, den, 1, den - 1);
        const s = dec(w * den + n, tenths ? 1 : 2);
        return answered(
          [`Write $${s}$ as a mixed number.`, `把 $${s}$ 写成带分数。`],
          qf(w * den + n, den),
          [
            [
              ["The whole", "整数部分"],
              [`The digits before the point give the whole number ${w}.`, `小数点前的数是整数部分 ${w}。`],
            ],
            [
              ["The part", "分数部分"],
              tenths
                ? [
                    `One place after the point means tenths. So $${s} = ${mx(w, n, den)}$.`,
                    `小数点后有一位，是十分之几。所以 $${s} = ${mx(w, n, den)}$。`,
                  ]
                : [
                    `Two places after the point mean hundredths. So $${s} = ${mx(w, n, den)}$.`,
                    `小数点后有两位，是百分之几。所以 $${s} = ${mx(w, n, den)}$。`,
                  ],
            ],
          ],
          [`Write $${mx(w, n, den)}$ back as a decimal. It is $${s}$.`, `把 $${mx(w, n, den)}$ 写回小数，就是 $${s}$。`],
          [
            [
              mixedValue(w, n, tenths ? 100 : 10),
              tenths ? "That uses hundredths. One place means tenths." : "That uses tenths. Two places mean hundredths.",
              tenths ? "这写成了百分之几。一位小数是十分之几。" : "这写成了十分之几。两位小数是百分之几。",
            ],
            [qf(n, den), "That leaves out the whole number.", "这漏掉了整数部分。"],
            [w, "That leaves out the part after the point.", "这漏掉了小数点后面的部分。"],
          ],
          { form: "mixed", figure: decimalLine(w, w + 1, 0.1, [[w + n / den, s]]) },
        );
      },
      decimalLine(6, 7, 0.1, [[6.07, "6.07"]]),
    ),
    point(
      "decimals-as-mixed-numbers-in-lowest-terms",
      ["In lowest terms", "化成最简形式"],
      [
        "$4.6$ is $4\\frac{6}{10}$. Both 6 and 10 can be divided by 2. So $4.6 = 4\\frac{3}{5}$.\n\nCheck: $4\\frac{3}{5} = 4\\frac{6}{10} = 4.6$.\n\n> **Watch out.** Simplify only the fraction part. The whole number 4 stays the same.",
        "$4.6$ 是 $4\\frac{6}{10}$。6 和 10 都能被 2 整除。所以 $4.6 = 4\\frac{3}{5}$。\n\n检验：$4\\frac{3}{5} = 4\\frac{6}{10} = 4.6$。\n\n> **注意。** 只约分数部分。整数 4 不变。",
      ],
      (rng) => {
        const w = rng.int(1, 20);
        let p: number;
        let q: number;
        do {
          q = rng.bool(0.3) ? 10 : 100;
          p = rng.int(2, q - 2);
        } while (gcd(p, q) === 1 || p % 10 === 0);
        const g = gcd(p, q);
        const value = mixedValue(w, p, q);
        const s = dec(w * q + p, q === 10 ? 1 : 2);
        return answered(
          [`Write $${s}$ as a mixed number in lowest terms.`, `把 $${s}$ 写成带分数，分数部分要最简。`],
          value,
          [
            [
              ["Write as a mixed number", "写成带分数"],
              [`$${s} = ${mx(w, p, q)}$.`, `$${s} = ${mx(w, p, q)}$。`],
            ],
            [
              ["Simplify the part", "约分分数部分"],
              [
                `${p} and ${q} can both be divided by ${g}. $${mx(w, p, q)} = ${mixedLatex(value)}$.`,
                `${p} 和 ${q} 都能被 ${g} 整除。$${mx(w, p, q)} = ${mixedLatex(value)}$。`,
              ],
            ],
          ],
          [
            `Multiply the top and the bottom of the part by ${g}. That gives back $${mx(w, p, q)}$.`,
            `把分数部分的分子和分母都乘 ${g}，又得到 $${mx(w, p, q)}$。`,
          ],
          [
            [mixedValue(w, p / g, q), `That divides only the top by ${g}.`, `这只把分子除以 ${g}。`],
            [qf(p, q), "That leaves out the whole number.", "这漏掉了整数部分。"],
            w % g === 0
              ? [mixedValue(w / g, p / g, q / g), `That divides the whole number by ${g} too.`, `这把整数也除以 ${g} 了。`]
              : [mixedValue(w, p, q / g), `That divides only the bottom by ${g}.`, `这只把分母除以 ${g}。`],
          ],
          { form: "mixed", figure: decimalLine(w, w + 1, 0.1, [[w + p / q, s]]) },
        );
      },
      decimalLine(4, 5, 0.1, [[4.6, "4.6"]]),
    ),
  ],
  t(
    "A pumpkin weighs $3.25$ kilograms. The 3 before the point is 3 whole kilograms. The 25 after it is $\\frac{25}{100}$, the same as $\\frac{1}{4}$. So it weighs $3\\frac{1}{4}$ kilograms.\n\nCheck: $3\\frac{1}{4} = 3\\frac{25}{100} = 3.25$.\n\nIn this lesson we write decimals as mixed numbers.",
    "一个南瓜重 $3.25$ 千克。小数点前的 3 是 3 个整千克。后面的 25 是 $\\frac{25}{100}$，等于 $\\frac{1}{4}$。所以南瓜重 $3\\frac{1}{4}$ 千克。\n\n检验：$3\\frac{1}{4} = 3\\frac{25}{100} = 3.25$。\n\n本课我们把小数写成带分数。",
  ),
);

export const addingDecimalFractions = topic(
  "adding-decimal-fractions",
  t("Adding Decimal Fractions", "十进分数的加法"),
  t(
    "To add tenths and hundredths, first write the tenths as hundredths: 3/10 + 45/100 = 30/100 + 45/100 = 75/100, which is 0.75.",
    "十分之几与百分之几相加，先把十分之几化成百分之几：3/10 + 45/100 = 30/100 + 45/100 = 75/100，即 0.75。",
  ),
  ["decimal-fractions", "adding-fractions-with-like-denominators"],
  ["4.NF.C.5"],
  [
    point(
      "adding-tenths-and-hundredths-as-fractions",
      ["As a fraction", "写成分数"],
      [
        "$\\frac{6}{10} + \\frac{23}{100}$: tenths and hundredths are different sizes. Change the tenths first: $\\frac{6}{10} = \\frac{60}{100}$. Then $\\frac{60}{100} + \\frac{23}{100} = \\frac{83}{100}$.\n\nCheck: on a grid of 100, 6 columns and 23 more squares make 83 squares.\n\n> **Watch out.** Do not add the tops and the bottoms. $\\frac{29}{110}$ is wrong.",
        "$\\frac{6}{10} + \\frac{23}{100}$：十分之一和百分之一大小不同。先把十分之几化成百分之几：$\\frac{6}{10} = \\frac{60}{100}$。再算 $\\frac{60}{100} + \\frac{23}{100} = \\frac{83}{100}$。\n\n检验：在 100 个小方格里，6 列再加 23 格，一共 83 格。\n\n> **注意。** 不能分子加分子、分母加分母。$\\frac{29}{110}$ 是错的。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 99 - 10 * a);
        const s = 10 * a + b;
        return answered(
          [
            `Fill in the box: $$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
            `填空：$$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
          ],
          s,
          [
            [
              ["Change the tenths", "把十分之几化成百分之几"],
              [`$${fr(a, 10)} = ${fr(10 * a, 100)}$.`, `$${fr(a, 10)} = ${fr(10 * a, 100)}$。`],
            ],
            [
              ["Add the hundredths", "百分之几相加"],
              [`$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(s, 100)}$.`, `$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(s, 100)}$。`],
            ],
          ],
          [
            `On a grid of 100, ${a} ${a === 1 ? "column" : "columns"} of 10 and ${b} more ${b === 1 ? "square" : "squares"} make ${s} squares.`,
            `在 100 个小方格里，${a} 列、每列 10 格，再加 ${b} 格，一共 ${s} 格。`,
          ],
          [
            [a + b, "That adds the tops without changing the tenths to hundredths.", "这没有把十分之几化成百分之几，就把分子相加了。"],
            [
              100 * a + b,
              "That makes each tenth 100 hundredths. One tenth is only 10.",
              "这把一个十分之一当成 100 个百分之一了。其实只有 10 个。",
            ],
            [10 * b + a, "That changes the hundredths instead of the tenths.", "这把百分之几当成十分之几来变了，弄反了。"],
          ],
          { form: "integer", figure: hundredGrid(s) },
        );
      },
      hundredGrid(83),
    ),
    point(
      "adding-tenths-and-hundredths-as-decimals",
      ["As a decimal", "写成小数"],
      [
        "$\\frac{4}{10} + \\frac{38}{100}$ as a decimal? Change $\\frac{4}{10}$ to $\\frac{40}{100}$. Then add the tops: $40 + 38 = 78$. So the sum is $0.78$.\n\nCheck: start at $0.38$ on a number line. 4 jumps of $0.1$ reach $0.78$.\n\n> **Watch out.** $0.42$ is wrong. It adds 4 and 38 as if both were hundredths.",
        "$\\frac{4}{10} + \\frac{38}{100}$ 写成小数是多少？把 $\\frac{4}{10}$ 化成 $\\frac{40}{100}$。再把分子相加：$40 + 38 = 78$。所以和是 $0.78$。\n\n检验：在数轴上从 $0.38$ 出发，跳 4 次、每次 $0.1$，到达 $0.78$。\n\n> **注意。** $0.42$ 是错的。它把 4 和 38 都当成百分之几相加了。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(1, 99);
        const s = 10 * a + b;
        const hi = s > 100 ? 2 : 1;
        return answered(
          [`Find $${fr(a, 10)} + ${fr(b, 100)}$. Give the answer as a decimal.`, `计算 $${fr(a, 10)} + ${fr(b, 100)}$，答案写成小数。`],
          qf(s, 100),
          [
            [
              ["Change the tenths", "把十分之几化成百分之几"],
              [`$${fr(a, 10)} = ${fr(10 * a, 100)}$.`, `$${fr(a, 10)} = ${fr(10 * a, 100)}$。`],
            ],
            [
              ["Add the hundredths", "百分之几相加"],
              [`$${10 * a} + ${b} = ${s}$. That is ${s} hundredths.`, `$${10 * a} + ${b} = ${s}$。一共 ${s} 个百分之一。`],
            ],
            [
              ["Write the decimal", "写成小数"],
              [`$${fr(s, 100)} = ${num(s / 100)}$.`, `$${fr(s, 100)} = ${num(s / 100)}$。`],
            ],
          ],
          [
            `Start at $${num(b / 100)}$. ${a} ${a === 1 ? "jump" : "jumps"} of $0.1$ ${a === 1 ? "reaches" : "reach"} $${num(s / 100)}$.`,
            `从 $${num(b / 100)}$ 出发，跳 ${a} 次、每次 $0.1$，到达 $${num(s / 100)}$。`,
          ],
          [
            [qf(a + b, 100), "That adds the tops as if both were hundredths.", "这把两个分子都当成百分之几相加了。"],
            [qf(a + b, 10), "That adds the tops as if both were tenths.", "这把两个分子都当成十分之几相加了。"],
            [
              qf(100 * a + b, 100),
              "That makes each tenth 100 hundredths. One tenth is only 10.",
              "这把一个十分之一当成 100 个百分之一了。其实只有 10 个。",
            ],
          ],
          {
            form: "decimal",
            figure: decimalLine(
              0,
              hi,
              0.1,
              [
                [b / 100, num(b / 100)],
                [s / 100, num(s / 100)],
              ],
              Array.from({ length: a }, (_, i): [number, number] => [(b + 10 * i) / 100, (b + 10 * i + 10) / 100]),
            ),
          },
        );
      },
      decimalLine(
        0,
        1,
        0.1,
        [
          [0.38, "0.38"],
          [0.78, "0.78"],
        ],
        [
          [0.38, 0.48],
          [0.48, 0.58],
          [0.58, 0.68],
          [0.68, 0.78],
        ],
      ),
    ),
  ],
  t(
    "Rosa pours $\\frac{3}{10}$ liter of water into a jug, then $\\frac{45}{100}$ liter more. 3 tenths is 30 hundredths. So the jug has $\\frac{75}{100}$ liter. As a decimal that is $0.75$ liter.\n\nCheck: on a grid of 100, 30 squares and 45 squares make 75 squares.\n\nIn this lesson we add tenths and hundredths by first writing the tenths as hundredths.",
    "罗莎往壶里倒了 $\\frac{3}{10}$ 升水，又倒了 $\\frac{45}{100}$ 升。3 个十分之一是 30 个百分之一。所以壶里有 $\\frac{75}{100}$ 升水，写成小数是 $0.75$ 升。\n\n检验：在 100 个小方格里，30 格和 45 格合起来是 75 格。\n\n本课我们先把十分之几化成百分之几，再把十分之几和百分之几相加。",
  ),
);

/** grade4FractionTopics are the 4th Grade Math topics on fractions, mixed numbers and decimals. */
export const grade4FractionTopics: readonly TopicDef[] = [
  fractionModels,
  modelingFractionsUsingNumberLines,
  writingUnitFractionsInWords,
  writingFractionsInWords,
  interpretingFractionsAsDivision,
  improperFractions,
  modelsForMixedNumbers,
  modelingMixedNumbersUsingNumberLines,
  interpretingDivisionProblemsAsMixedNumbers,
  convertingImproperFractionsToMixedNumbers,
  convertingMixedNumbersToImproperFractions,
  findingEquivalentFractionsUsingAreaModels,
  equivalentFractionsByMultiplyingAndDividing,
  leastCommonDenominators,
  writingFractionsInLowestTerms,
  comparingFractions,
  comparingFractionsUsingUnitBenchmarks,
  comparingFractionsUsingOneHalfBenchmarks,
  comparingFractionModelsUsingCommonDenominators,
  comparingFractionsUsingCommonDenominators,
  addingFractionsWithLikeDenominatorsUsingModels,
  addingFractionsWithLikeDenominators,
  subtractingFractionsWithLikeDenominators,
  addingFractionsWithLikeDenominatorsWordProblems,
  subtractingFractionsWithLikeDenominatorsWordProblems,
  decomposingFractionsIntoSumsUsingModels,
  decomposingFractionsIntoSums,
  addingMixedNumbersWithLikeDenominators,
  subtractingMixedNumbersWithLikeDenominators,
  subtractingMixedNumbersWithLikeDenominatorsUsingImproperFractions,
  addingMixedNumbersWithLikeDenominatorsWordProblems,
  subtractingMixedNumbersWithLikeDenominatorsWordProblems,
  multiplyingUnitFractionsByWholeNumbersUsingModels,
  multiplyingFractionsByWholeNumbersUsingModels,
  multiplyingFractionsByWholeNumbers,
  multiplyingFractionsByWholeNumbersWordProblems,
  strategiesToSimplifyWholeNumberAndFractionMultiplication,
  decimalFractions,
  plottingDecimalsOnNumberLines,
  comparingDecimalsUpToHundredths,
  convertingFractionsToDecimals,
  convertingMixedNumbersToDecimals,
  convertingDecimalsToFractions,
  convertingDecimalsToMixedNumbers,
  addingDecimalFractions,
];

// ---------------------------------------------------------------------------
// Third knowledge points of these topics, used by the deeper maps

/** stepsLine is a number line from 0 to 1 cut into `spaces` equal steps, with no points. */
const stepsLine = (spaces: number): Figure =>
  lineFigure({ lo: 0, hi: spaces, step: 1, labels: [0, spaces], label: (v) => (v === 0 ? "0" : "1") }, [
    `A number line from 0 to 1 cut into ${spaces} equal steps.`,
    `一条从 0 到 1 的数轴，平均分成 ${spaces} 格。`,
  ]);

/** shadingMoreToReach asks how many more parts to shade to reach a larger fraction with the same denominator. */
export const shadingMoreToReach = point(
  "shading-more-to-reach-a-fraction",
  ["Shading more to reach a fraction", "再涂多少到某个分数"],
  [
    "A bar of 8 equal parts has $\\frac{3}{8}$ shaded. To shade $\\frac{7}{8}$, we need 7 parts in all, so we shade $7 - 3 = 4$ more. The bottom number stays 8, because the parts are still the same size.\n\nCheck: $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$.\n\n> **Watch out.** The answer is the extra parts, 4, not the 7 parts of the new fraction.",
    "一个长条平均分成 8 份，已经涂了 $\\frac{3}{8}$。要涂到 $\\frac{7}{8}$，一共要涂 7 份，所以再涂 $7 - 3 = 4$ 份。分母还是 8，因为每份的大小没有变。\n\n检验：$\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$。\n\n> **注意。** 答案是再涂的份数 4，不是新分数的 7 份。",
  ],
  (rng) => {
    const d = rng.int(4, 12);
    const a = rng.int(1, d - 2);
    const b = rng.int(a + 1, d);
    return answered(
      [
        `A bar has ${d} equal parts, and $${fr(a, d)}$ is shaded. How many more parts must be shaded so that $${fr(b, d)}$ is shaded?`,
        `一个长条平均分成 ${d} 份，已经涂了 $${fr(a, d)}$。还要再涂几份，涂色部分才是 $${fr(b, d)}$？`,
      ],
      b - a,
      [
        [
          ["Read the parts", "看份数"],
          [`$${fr(a, d)}$ is ${a} parts and $${fr(b, d)}$ is ${b} parts.`, `$${fr(a, d)}$ 是 ${a} 份，$${fr(b, d)}$ 是 ${b} 份。`],
        ],
        [
          ["Find the difference", "求相差的份数"],
          [`$${b} - ${a} = ${b - a}$ more parts.`, `再涂 $${b} - ${a} = ${b - a}$ 份。`],
        ],
      ],
      [`$${fr(a, d)} + ${fr(b - a, d)} = ${fr(b, d)}$.`, `$${fr(a, d)} + ${fr(b - a, d)} = ${fr(b, d)}$。`],
      [
        [b, "That is all the parts of the new fraction, not the extra ones.", "这是新分数的全部份数，不是再涂的份数。"],
        [a, "That is what is already shaded.", "这是已经涂了的份数。"],
        [d - a, "That shades every part that is left.", "这是把剩下的全涂了。"],
      ],
      { figure: barFigure(d, a) },
    );
  },
  barFigure(8, 3),
);

/** partsBetweenZeroAndOne links the tick marks between 0 and 1 to the steps they make. */
export const partsBetweenZeroAndOne = point(
  "the-parts-between-zero-and-one",
  ["The parts between zero and one", "0 和 1 之间的份数"],
  [
    "This line from 0 to 1 has 6 tick marks, counting both ends. Between them there are 5 equal steps, so each step is $\\frac{1}{5}$. There is always one more mark than steps.\n\nCheck: count the gaps one by one: 1, 2, 3, 4, 5.\n\n> **Watch out.** The bottom number counts the steps, not the marks. It is $\\frac{1}{5}$, not $\\frac{1}{6}$.",
    "这条从 0 到 1 的数轴算上两端有 6 条刻度线，它们之间有 5 格，所以每格是 $\\frac{1}{5}$。刻度线总比格数多 1。\n\n检验：一格一格地数：1、2、3、4、5。\n\n> **注意。** 分母数的是格数，不是刻度线。是 $\\frac{1}{5}$，不是 $\\frac{1}{6}$。",
  ],
  (rng) => {
    const spaces = rng.int(2, 24);
    const ticks = spaces + 1;
    const check: Pair = [
      `${spaces} steps of $${fr(1, spaces)}$ make $${fr(spaces, spaces)} = 1$, and ${spaces} steps need ${ticks} marks.`,
      `${spaces} 格 $${fr(1, spaces)}$ 合起来是 $${fr(spaces, spaces)} = 1$，${spaces} 格要 ${ticks} 条刻度线。`,
    ];
    if (rng.bool()) {
      return answered(
        [
          `A number line from 0 to 1 has ${ticks} evenly spaced tick marks, counting both ends. Each step shows $\\frac{1}{n}$. What is $n$?`,
          `一条从 0 到 1 的数轴有 ${ticks} 条等距的刻度线（算上两端）。每格表示 $\\frac{1}{n}$。$n$ 是多少？`,
        ],
        spaces,
        [
          [
            ["Link marks and steps", "刻度线和格数"],
            ["There is one more mark than steps.", "刻度线比格数多 1。"],
          ],
          [
            ["Count the steps", "求格数"],
            [`$${ticks} - 1 = ${spaces}$ steps, so $n = ${spaces}$.`, `$${ticks} - 1 = ${spaces}$ 格，所以 $n = ${spaces}$。`],
          ],
        ],
        check,
        [
          [ticks, "That counts the marks, not the steps.", "这数的是刻度线，不是格数。"],
          [ticks + 1, "That adds a mark instead of taking one away.", "这里应该减 1，不是加 1。"],
          [spaces - 1, "That takes away one too many.", "这多减了 1。"],
        ],
      );
    }
    return answered(
      [
        `A number line from 0 to 1 is marked in steps of $${fr(1, spaces)}$. How many tick marks does it have, counting both ends?`,
        `一条从 0 到 1 的数轴每格是 $${fr(1, spaces)}$。算上两端，一共有多少条刻度线？`,
      ],
      ticks,
      [
        [
          ["Count the steps", "求格数"],
          [`Steps of $${fr(1, spaces)}$ cut 0 to 1 into ${spaces} steps.`, `每格 $${fr(1, spaces)}$，从 0 到 1 有 ${spaces} 格。`],
        ],
        [
          ["Add the first mark", "加上起点的刻度线"],
          [`There is one more mark than steps: $${spaces} + 1 = ${ticks}$.`, `刻度线比格数多 1：$${spaces} + 1 = ${ticks}$。`],
        ],
      ],
      check,
      [
        [spaces, "That counts the steps, not the marks.", "这数的是格数，不是刻度线。"],
        [ticks + 1, "That counts one end twice.", "这把一端多算了一次。"],
        [spaces - 1, "That leaves out both ends.", "这没有算两端的刻度线。"],
      ],
    );
  },
  stepsLine(5),
);

/** unitFractionsFromAShare picks the largest of four unit fractions of the same whole. */
export const unitFractionsFromAShare = point(
  "unit-fractions-from-a-share",
  ["Which unit fraction is larger, in words", "用文字比较单位分数"],
  [
    "Cut one pizza into 3 parts and another the same size into 8 parts. Each third is bigger than each eighth, because fewer parts share the same pizza. So one third is more than one eighth.\n\nCheck: the strips show $\\frac{1}{3}$ is longer than $\\frac{1}{8}$.\n\n> **Watch out.** A bigger bottom number means smaller parts. Eight is more than three, but one eighth is less than one third.",
    "把一个比萨平均分成 3 份，把同样大的另一个平均分成 8 份。三分之一比八分之一大，因为同样大的比萨分的份数少，每份就大。\n\n检验：分数条上 $\\frac{1}{3}$ 比 $\\frac{1}{8}$ 长。\n\n> **注意。** 分母越大，每份越小。8 比 3 大，但八分之一比三分之一小。",
  ],
  (rng) => {
    const names: readonly [Pair, number][] = [
      [["one half", "二分之一"], 2],
      [["one third", "三分之一"], 3],
      [["one fourth", "四分之一"], 4],
      [["one fifth", "五分之一"], 5],
      [["one sixth", "六分之一"], 6],
      [["one eighth", "八分之一"], 8],
      [["one tenth", "十分之一"], 10],
      [["one twelfth", "十二分之一"], 12],
    ];
    const four = rng.sample(names, 4) as [Pair, number][];
    const answer = four.reduce((a, b) => (b[1] < a[1] ? b : a));
    return picked(
      rng,
      ["Which of these is the largest amount of the same pizza?", "下面哪个是同一个比萨中最大的量？"],
      answer[0],
      four
        .filter((x) => x !== answer)
        .map(([name, k]): [Pair, string, string] => [
          name,
          `That cuts the pizza into ${k} parts, more than ${answer[1]}, so each part is smaller.`,
          `这是把比萨平均分成 ${k} 份，比 ${answer[1]} 份多，每份更小。`,
        ]),
      [
        [
          ["Look at the parts", "看份数"],
          [
            `Each choice is one part. ${answer[0][0]} cuts the pizza into the fewest parts, ${answer[1]}.`,
            `每个都是一份。${answer[0][1]}把比萨分成的份数最少，只有 ${answer[1]} 份。`,
          ],
        ],
        [
          ["Pick the biggest part", "选最大的一份"],
          [`Fewer parts means bigger parts: ${answer[0][0]}.`, `份数越少，每份越大：${answer[0][1]}。`],
        ],
      ],
      [
        `Every other choice cuts the same pizza into more than ${answer[1]} parts, so each of its parts is smaller than $${fr(1, answer[1])}$.`,
        `$${fr(1, answer[1])}$ 是整个比萨平均分成 ${answer[1]} 份中的一份，其他选项分的份数更多，每份都比它小。`,
      ],
    );
  },
  stripsFigure([
    { parts: 3, shaded: 1, text: "1/3" },
    { parts: 8, shaded: 1, text: "1/8" },
  ]),
);

/** wordsForLargerTops writes a fraction with a top number above 1 from its words. */
export const wordsForLargerTops = point(
  "words-for-fractions-with-larger-tops",
  ["Words for several parts", "用文字写几份"],
  [
    'The top number says how many parts, and the bottom number names their size. "Three fifths" is 3 parts that are each one fifth: $\\frac{3}{5}$.\n\nCheck: $\\frac{1}{5} + \\frac{1}{5} + \\frac{1}{5} = \\frac{3}{5}$.\n\n> **Watch out.** "Three fifths" is $\\frac{3}{5}$, not $\\frac{5}{3}$. The number of parts goes on top.',
    '分子说明有几份，分母说明每份的大小。"五分之三"是 3 个五分之一：$\\frac{3}{5}$。\n\n检验：$\\frac{1}{5} + \\frac{1}{5} + \\frac{1}{5} = \\frac{3}{5}$。\n\n> **注意。** "五分之三"是 $\\frac{3}{5}$，不是 $\\frac{5}{3}$。份数写在分子上。',
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const n = coprimeTo(rng, d, 2, Math.min(7, d - 1));
    return answered(
      [`Write "${fw(n, d)[0]}" as a fraction.`, `把"${fw(n, d)[1]}"写成分数。`],
      qf(n, d),
      [
        [
          ["Find the size of each part", "看每份多大"],
          [`Each part is one ${ordinalEn(d, false)}, so the bottom number is ${d}.`, `每份是${fw(1, d)[1]}，所以分母是 ${d}。`],
        ],
        [
          ["Count the parts", "数份数"],
          [`There are ${n} parts, so the top number is ${n}: $${fr(n, d)}$.`, `一共 ${n} 份，所以分子是 ${n}：$${fr(n, d)}$。`],
        ],
      ],
      [`${n} parts of $${fr(1, d)}$ make $${fr(n, d)}$.`, `${n} 个 $${fr(1, d)}$ 是 $${fr(n, d)}$。`],
      [
        [qf(d, n), "That swaps the top and the bottom numbers.", "这把分子和分母写反了。"],
        [qf(1, d), "That is only one part.", "这只是其中一份。"],
        [qf(n, d + 1), `That cuts the whole into ${d + 1} parts, not ${d}.`, `这是平均分成 ${d + 1} 份，不是 ${d} 份。`],
      ],
      { form: "fraction" },
    );
  },
  barFigure(5, 3),
);

/** fractionAsDivision picks the division that has the value of a fraction. */
export const fractionAsDivision = point(
  "a-fraction-as-a-division",
  ["A fraction as a division", "把分数写成除法"],
  [
    "The fraction bar means divide. $\\frac{3}{4}$ is 3 shared into 4 equal parts, so $\\frac{3}{4} = 3 \\div 4$. The top is the number shared and the bottom is the number of shares.\n\nCheck: $3 \\div 4$ gives each of 4 people $\\frac{3}{4}$, and $4 \\times \\frac{3}{4} = 3$.\n\n> **Watch out.** $\\frac{3}{4}$ is $3 \\div 4$, not $4 \\div 3$.",
    "分数线表示除以。$\\frac{3}{4}$ 是把 3 平均分成 4 份，所以 $\\frac{3}{4} = 3 \\div 4$。分子是被分的数，分母是份数。\n\n检验：$3 \\div 4$ 每份是 $\\frac{3}{4}$，$4 \\times \\frac{3}{4} = 3$。\n\n> **注意。** $\\frac{3}{4}$ 是 $3 \\div 4$，不是 $4 \\div 3$。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const n = rng.int(1, d - 1);
    return pickedMath(
      rng,
      [`Which division has the same value as $${fr(n, d)}$?`, `哪个除法与 $${fr(n, d)}$ 的值相同？`],
      `${n} \\div ${d}`,
      [
        [`${d} \\div ${n}`, "That swaps them. The top is divided by the bottom.", "这把两个数弄反了。要用分子除以分母。"],
        [`${n} \\times ${d}`, "The fraction bar means divide, not times.", "分数线表示除以，不是乘。"],
        [`${d} - ${n}`, "That is the parts left over, not a division.", "这是剩下的份数，不是除法。"],
      ],
      [
        [
          ["Read the bar", "看分数线"],
          ["The fraction bar means divide.", "分数线表示除以。"],
        ],
        [
          ["Put the top first", "分子在前"],
          [`The top ${n} is divided by the bottom ${d}: $${n} \\div ${d}$.`, `分子 ${n} 除以分母 ${d}：$${n} \\div ${d}$。`],
        ],
      ],
      [
        `Multiply back: $${d} \\times ${fr(n, d)} = ${fr(n * d, d)} = ${n}$.`,
        `乘回去：$${d} \\times ${fr(n, d)} = ${fr(n * d, d)} = ${n}$。`,
      ],
    );
  },
  shareBars(3, 4),
);

/** theWholeAsImproper writes a whole number as an improper fraction with a given denominator. */
export const theWholeAsImproper = point(
  "the-whole-as-an-improper-fraction",
  ["A whole number as an improper fraction", "把整数写成假分数"],
  [
    "Each whole can be cut into 4 equal parts. 3 wholes give $3 \\times 4 = 12$ parts, so $3 = \\frac{12}{4}$.\n\nCheck: $12 \\div 4 = 3$.\n\n> **Watch out.** Multiply, do not add: $3 + 4 = 7$ parts would be too few.",
    "每个整体都可以平均分成 4 份。3 个整体有 $3 \\times 4 = 12$ 份，所以 $3 = \\frac{12}{4}$。\n\n检验：$12 \\div 4 = 3$。\n\n> **注意。** 要用乘法，不是加法：$3 + 4 = 7$ 份就太少了。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const d = rng.int(2, 12);
    return answered(
      [`What number goes in the box? $$${k} = \\frac{\\square}{${d}}$$`, `方框里填几？$$${k} = \\frac{\\square}{${d}}$$`],
      k * d,
      [
        [
          ["Parts in one whole", "一个整体的份数"],
          [`Each whole is ${d} parts of $${fr(1, d)}$.`, `每个整体是 ${d} 个 $${fr(1, d)}$。`],
        ],
        [
          ["Parts in all the wholes", "所有整体的份数"],
          [`${k} wholes are $${k} \\times ${d} = ${k * d}$ parts.`, `${k} 个整体是 $${k} \\times ${d} = ${k * d}$ 份。`],
        ],
      ],
      [`$${k * d} \\div ${d} = ${k}$.`, `$${k * d} \\div ${d} = ${k}$。`],
      [
        [k + d, "That adds instead of multiplying.", "这用了加法，应该用乘法。"],
        [k, "That is the number of wholes, not the number of parts.", "这是整体的个数，不是份数。"],
        [d, "That is the parts in only one whole.", "这只是一个整体的份数。"],
      ],
    );
  },
  barFigure(4, 12, 3),
);

/** barsForMixed asks how many one-whole bars a mixed number needs. */
export const barsForMixed = point(
  "how-many-bars-a-mixed-number-needs",
  ["How many bars a mixed number needs", "带分数需要几个长条"],
  [
    "To shade $2\\frac{3}{4}$, fill 2 bars, one for each whole. The $\\frac{3}{4}$ needs one more bar, partly shaded. That is 3 bars in all.\n\nCheck: 2 full bars are only 2, and 3 full bars would be 3, so $2\\frac{3}{4}$ needs a third bar that is not full.\n\n> **Watch out.** Do not forget the bar for the fraction part.",
    "要涂出 $2\\frac{3}{4}$，先涂满 2 个长条，每个表示 1。$\\frac{3}{4}$ 还要再用一个长条，只涂一部分。一共要 3 个长条。\n\n检验：2 个满的长条只有 2，3 个满的长条是 3，所以 $2\\frac{3}{4}$ 要第 3 个长条，但不涂满。\n\n> **注意。** 别忘了分数部分也要一个长条。",
  ],
  (rng) => {
    const a = rng.int(1, 12);
    const d = rng.int(2, 9);
    const n = coprimeTo(rng, d, 1, d - 1);
    return answered(
      [
        `Each bar is one whole. How many bars are needed to shade $${mx(a, n, d)}$?`,
        `每个长条表示 1，要涂出 $${mx(a, n, d)}$ 需要几个长条？`,
      ],
      a + 1,
      [
        [
          ["Bars for the wholes", "整数部分的长条"],
          [`The whole part ${a} fills ${a} ${a === 1 ? "bar" : "bars"}.`, `整数部分 ${a} 涂满 ${a} 个长条。`],
        ],
        [
          ["A bar for the part", "分数部分的长条"],
          [`$${fr(n, d)}$ needs one more bar: $${a} + 1 = ${a + 1}$.`, `$${fr(n, d)}$ 还要 1 个长条：$${a} + 1 = ${a + 1}$。`],
        ],
      ],
      [
        `$${mx(a, n, d)}$ is between ${a} and ${a + 1}, so it needs more than ${a} bars but not more than ${a + 1}.`,
        `$${mx(a, n, d)}$ 在 ${a} 和 ${a + 1} 之间，所以要多于 ${a} 个长条，但不超过 ${a + 1} 个。`,
      ],
      [
        [a, "That leaves out the bar for the fraction part.", "这漏掉了分数部分的长条。"],
        [d, "That is the parts in a bar, not the number of bars.", "这是一个长条的份数，不是长条的个数。"],
        [a + n, "That adds the top number of the fraction.", "这把分子也加了进去。"],
      ],
    );
  },
  barFigure(4, 11, 3),
);

/** wholesAroundMixed asks for the whole numbers on either side of a mixed number. */
export const wholesAroundMixed = point(
  "the-whole-numbers-around-a-mixed-number",
  ["The whole numbers around a mixed number", "带分数两边的整数"],
  [
    "$2\\frac{3}{4}$ is 2 and a bit more, but the bit is less than a whole. So it lies between 2 and 3 on the number line.\n\nCheck: on the line, P at $2\\frac{3}{4}$ is after 2 and before 3.\n\n> **Watch out.** The larger whole number is 3, the next one after 2, not the denominator 4.",
    "$2\\frac{3}{4}$ 是 2 再多一点，多出的不到 1。所以在数轴上它在 2 和 3 之间。\n\n检验：数轴上表示 $2\\frac{3}{4}$ 的点 P 在 2 的后面、3 的前面。\n\n> **注意。** 较大的整数是 2 后面的 3，不是分母 4。",
  ],
  (rng) => {
    const a = rng.int(1, 20);
    const d = rng.int(2, 9);
    const n = coprimeTo(rng, d, 1, d - 1);
    const upper = rng.bool();
    return answered(
      upper
        ? [
            `$${mx(a, n, d)}$ lies between two whole numbers next to each other. What is the larger one?`,
            `$${mx(a, n, d)}$ 在两个相邻的整数之间。较大的是几？`,
          ]
        : [
            `$${mx(a, n, d)}$ lies between two whole numbers next to each other. What is the smaller one?`,
            `$${mx(a, n, d)}$ 在两个相邻的整数之间。较小的是几？`,
          ],
      upper ? a + 1 : a,
      [
        [
          ["Read the whole part", "看整数部分"],
          [`The whole part is ${a}, so the number is more than ${a}.`, `整数部分是 ${a}，所以这个数比 ${a} 大。`],
        ],
        [
          ["Read the fraction part", "看分数部分"],
          [`$${fr(n, d)}$ is less than 1, so the number is less than ${a + 1}.`, `$${fr(n, d)}$ 小于 1，所以这个数比 ${a + 1} 小。`],
        ],
      ],
      [`$${a} < ${mx(a, n, d)} < ${a + 1}$.`, `$${a} < ${mx(a, n, d)} < ${a + 1}$。`],
      upper
        ? [
            [a, "That is the smaller one.", "这是较小的那个。"],
            [a + 2, `That skips ${a + 1}.`, `这跳过了 ${a + 1}。`],
            [d, "That is the denominator, not a whole number around it.", "这是分母，不是它旁边的整数。"],
          ]
        : [
            [a + 1, "That is the larger one.", "这是较大的那个。"],
            [a - 1, `That is one less than ${a}; the number is past ${a}.`, `这比 ${a} 还小 1，可这个数已经过了 ${a}。`],
            [n, "That is the top number of the fraction.", "这是分数部分的分子。"],
          ],
    );
  },
  numberLineFigure(4, 0, 12, wholeLabels(4, 0, 12), [{ at: 11, label: "P" }]),
);

/** wholePartOfQuotient asks for the whole part or the top of a quotient written as a mixed number. */
export const wholePartOfQuotient = point(
  "the-whole-part-of-a-quotient",
  ["The whole part of a quotient", "商的整数部分"],
  [
    "$17 \\div 5$ is 3 with 2 left over. As a mixed number the quotient 3 is the whole part, and the remainder 2 is the top of the fraction: $3\\frac{2}{5}$.\n\nCheck: $5 \\times 3 + 2 = 17$.\n\n> **Watch out.** The divisor 5 goes on the bottom. It is not the top number.",
    "$17 \\div 5$ 商 3 余 2。写成带分数时，商 3 是整数部分，余数 2 是分子：$3\\frac{2}{5}$。\n\n检验：$5 \\times 3 + 2 = 17$。\n\n> **注意。** 除数 5 是分母，不是分子。",
  ],
  (rng) => {
    const d = rng.int(2, 9);
    const q = rng.int(2, 15);
    const r = rng.int(1, d - 1);
    const n = d * q + r;
    const askTop = rng.bool();
    return answered(
      askTop
        ? [
            `Write $${n} \\div ${d}$ as a mixed number with denominator ${d}. What is the top number of its fraction?`,
            `把 $${n} \\div ${d}$ 写成分母是 ${d} 的带分数。分数部分的分子是几？`,
          ]
        : [`Write $${n} \\div ${d}$ as a mixed number. What is its whole part?`, `把 $${n} \\div ${d}$ 写成带分数。整数部分是几？`],
      askTop ? r : q,
      [
        [
          ["Divide", "做除法"],
          [
            `$${d} \\times ${q} = ${d * q}$, so $${n} \\div ${d} = ${q}$ with ${r} left over.`,
            `$${d} \\times ${q} = ${d * q}$，所以 $${n} \\div ${d}$ 商 ${q} 余 ${r}。`,
          ],
        ],
        [
          ["Write the mixed number", "写成带分数"],
          [
            `The mixed number is $${q}\\frac{${r}}{${d}}$, so the answer is ${askTop ? r : q}.`,
            `带分数是 $${q}\\frac{${r}}{${d}}$，所以答案是 ${askTop ? r : q}。`,
          ],
        ],
      ],
      [`$${d} \\times ${q} + ${r} = ${n}$.`, `$${d} \\times ${q} + ${r} = ${n}$。`],
      askTop
        ? [
            [q, "That is the whole part, not the top of the fraction.", "这是整数部分，不是分子。"],
            [d, "That is the divisor; it goes on the bottom.", "这是除数，它是分母。"],
            [d - r, "That is what is missing to make another whole, not the remainder.", "这是再凑一个整体还差的数，不是余数。"],
          ]
        : [
            [r, "That is the remainder, the top of the fraction.", "这是余数，是分子。"],
            [d, "That is the divisor.", "这是除数。"],
            [
              q + 1,
              `That is one too many: $${d} \\times ${q + 1} = ${d * (q + 1)}$ is more than ${n}.`,
              `这多了 1：$${d} \\times ${q + 1} = ${d * (q + 1)}$ 比 ${n} 大。`,
            ],
          ],
    );
  },
  barFigure(5, 17, 4),
);

/** wholeThingsFromPieces asks how many whole things a number of equal pieces makes. */
export const wholeThingsFromPieces = point(
  "whole-things-from-equal-pieces",
  ["Whole things from equal pieces", "由等份拼成整体"],
  [
    "A baker has 11 slices of pie, each $\\frac{1}{4}$ of a pie. Every 4 slices make a pie. $11 \\div 4 = 2$ with 3 left over, so 2 whole pies and 3 slices more.\n\nCheck: $2 \\times 4 + 3 = 11$ slices.\n\n> **Watch out.** The 3 slices left over do not make a whole pie, so the answer is 2, not 3.",
    "面包师有 11 块馅饼，每块是一个馅饼的 $\\frac{1}{4}$。每 4 块拼成一个馅饼。$11 \\div 4$ 商 2 余 3，所以能拼成 2 个完整的馅饼，还剩 3 块。\n\n检验：$2 \\times 4 + 3 = 11$ 块。\n\n> **注意。** 剩下的 3 块拼不成一个完整的馅饼，所以答案是 2，不是 3。",
  ],
  (rng) => {
    const d = rng.pick([3, 4, 5, 6, 8]);
    const q = rng.int(2, 9);
    const r = rng.int(1, d - 1);
    const n = d * q + r;
    return answered(
      [
        `A baker has ${n} slices of pie, each $${fr(1, d)}$ of a pie. How many whole pies can the slices make?`,
        `面包师有 ${n} 块馅饼，每块是一个馅饼的 $${fr(1, d)}$。这些馅饼块能拼成几个完整的馅饼？`,
      ],
      q,
      [
        [
          ["Slices in one pie", "一个馅饼几块"],
          [`Every ${d} slices make one pie.`, `每 ${d} 块拼成一个馅饼。`],
        ],
        [
          ["Divide", "做除法"],
          [`$${n} \\div ${d} = ${q}$ with ${r} left over, so ${q} whole pies.`, `$${n} \\div ${d}$ 商 ${q} 余 ${r}，所以能拼成 ${q} 个。`],
        ],
      ],
      [
        `$${q} \\times ${d} + ${r} = ${n}$ slices, and the ${r} left over are fewer than ${d}.`,
        `$${q} \\times ${d} + ${r} = ${n}$ 块，剩下的 ${r} 块不到 ${d} 块。`,
      ],
      [
        [q + 1, "That counts the slices left over as a whole pie.", "这把剩下的几块也算成了一个馅饼。"],
        [r, "That is the slices left over.", "这是剩下的块数。"],
        [d, "That is the slices in one pie.", "这是一个馅饼的块数。"],
      ],
    );
  },
  barFigure(4, 11, 3),
);

/** countingEqualPieces counts the pieces a mixed number of things is cut into. */
export const countingEqualPieces = point(
  "counting-the-equal-pieces",
  ["Counting the equal pieces", "数等份的个数"],
  [
    "A cook has $2\\frac{3}{4}$ cakes and cuts them into fourths. Each whole cake gives 4 pieces, so 2 cakes give 8. With the 3 pieces of the last cake there are 11 pieces.\n\nCheck: 11 fourths is $\\frac{11}{4} = 2\\frac{3}{4}$.\n\n> **Watch out.** Count the pieces of the part cake too. The answer is 11, not 8.",
    "厨师有 $2\\frac{3}{4}$ 个蛋糕，都切成四等份。每个整蛋糕切成 4 块，2 个切成 8 块。再加上最后那块蛋糕的 3 块，一共 11 块。\n\n检验：11 个四分之一是 $\\frac{11}{4} = 2\\frac{3}{4}$。\n\n> **注意。** 不完整的蛋糕的块数也要算上。答案是 11，不是 8。",
  ],
  (rng) => {
    const d = rng.pick([2, 3, 4, 5, 6, 8]);
    const a = rng.int(2, 9);
    const n = rng.int(1, d - 1);
    return answered(
      [
        `A cook has $${mx(a, n, d)}$ cakes and cuts them into pieces of $${fr(1, d)}$ of a cake. How many pieces are there?`,
        `厨师有 $${mx(a, n, d)}$ 个蛋糕，切成每块是一个蛋糕的 $${fr(1, d)}$。一共有多少块？`,
      ],
      a * d + n,
      [
        [
          ["Pieces from the whole cakes", "整蛋糕的块数"],
          [`$${a} \\times ${d} = ${a * d}$ pieces.`, `$${a} \\times ${d} = ${a * d}$ 块。`],
        ],
        [
          ["Add the part cake", "加上不完整的蛋糕"],
          [`$${a * d} + ${n} = ${a * d + n}$ pieces.`, `$${a * d} + ${n} = ${a * d + n}$ 块。`],
        ],
      ],
      [
        `$${a * d + n} \\div ${d} = ${a}$ with ${n} left over, which is $${mx(a, n, d)}$.`,
        `$${a * d + n} \\div ${d}$ 商 ${a} 余 ${n}，就是 $${mx(a, n, d)}$。`,
      ],
      [
        [a * d, "That leaves out the pieces of the part cake.", "这漏掉了不完整蛋糕的块数。"],
        [a + n, "That adds the whole number to the top.", "这把整数和分子直接相加了。"],
        [a * n + d, "That multiplies the whole number by the top, not the bottom.", "这用整数乘了分子，应该乘分母。"],
      ],
    );
  },
  barFigure(4, 11, 3),
);

/** meetTapes draws bars of length `total`, each cut into pieces of one of `sizes`, so that the pieces first meet at the end. */
function meetTapes(sizes: readonly number[], total: number): Figure {
  return tapeFigure(
    sizes.map((s, i) => ({
      ...(i === 0 && { total: String(total) }),
      pieces: Array.from({ length: total / s }, () => ({ size: s, text: String(s) })),
    })),
    [
      `Bars of ${total}, cut into pieces of ${sizes.join(", ")}; the pieces all end together at ${total}.`,
      `几个长 ${total} 的长条，分别分成每段 ${sizes.join("、")}；各段在 ${total} 处一起结束。`,
    ],
  );
}

/** cuttingEveryPartAgain counts the parts after each part of a bar is cut again. */
export const cuttingEveryPartAgain = point(
  "cutting-every-part-again",
  ["Cutting every part again", "把每份再切开"],
  [
    "A bar shows $\\frac{2}{3}$. Cut every third into 2 equal smaller parts. Now there are $3 \\times 2 = 6$ parts, and $2 \\times 2 = 4$ are shaded: $\\frac{4}{6}$. The shaded amount has not changed.\n\nCheck: the strips show $\\frac{2}{3}$ and $\\frac{4}{6}$ are the same length.\n\n> **Watch out.** The shaded parts are cut too, so the shaded count is multiplied as well. It is not still 2.",
    "一个长条涂了 $\\frac{2}{3}$。把每个三分之一都再平均切成 2 小份。现在一共有 $3 \\times 2 = 6$ 份，涂色的有 $2 \\times 2 = 4$ 份：$\\frac{4}{6}$。涂色部分的大小没有变。\n\n检验：分数条上 $\\frac{2}{3}$ 和 $\\frac{4}{6}$ 一样长。\n\n> **注意。** 涂色的部分也被切开了，所以涂色的份数也要乘，不再是 2 份。",
  ],
  (rng) => {
    const d = rng.int(2, 8);
    const a = rng.int(1, d - 1);
    const k = rng.int(2, 6);
    const askShaded = rng.bool();
    return answered(
      askShaded
        ? [
            `A bar shows $${fr(a, d)}$ shaded. Every part is cut into ${k} equal smaller parts. How many small parts are shaded now?`,
            `一个长条涂了 $${fr(a, d)}$。每份再平均切成 ${k} 小份。现在涂了多少小份？`,
          ]
        : [
            `A bar shows $${fr(a, d)}$ shaded. Every part is cut into ${k} equal smaller parts. How many small parts does the bar have now?`,
            `一个长条涂了 $${fr(a, d)}$。每份再平均切成 ${k} 小份。现在长条一共有多少小份？`,
          ],
      askShaded ? a * k : d * k,
      [
        [
          ["Each part becomes more parts", "每份变成几小份"],
          [`Every part becomes ${k} small parts.`, `每一份都变成 ${k} 小份。`],
        ],
        [
          ["Multiply", "用乘法"],
          askShaded
            ? [`The ${a} shaded parts become $${a} \\times ${k} = ${a * k}$.`, `涂色的 ${a} 份变成 $${a} \\times ${k} = ${a * k}$ 小份。`]
            : [`The ${d} parts become $${d} \\times ${k} = ${d * k}$.`, `${d} 份变成 $${d} \\times ${k} = ${d * k}$ 小份。`],
        ],
      ],
      [
        `The bar now shows $${fr(a * k, d * k)}$, and dividing both by ${k} gives back $${fr(a, d)}$.`,
        `长条现在表示 $${fr(a * k, d * k)}$，分子分母同除以 ${k} 又得到 $${fr(a, d)}$。`,
      ],
      askShaded
        ? [
            [d * k, "That is all the small parts, not the shaded ones.", "这是全部的小份数，不是涂色的。"],
            [a + k, "That adds instead of multiplying.", "这用了加法，应该用乘法。"],
            [a, "That is the shaded parts before cutting.", "这是切开以前涂色的份数。"],
          ]
        : [
            [a * k, "That is only the shaded small parts.", "这只是涂色的小份。"],
            [d + k, "That adds instead of multiplying.", "这用了加法，应该用乘法。"],
            [d, "That is the parts before cutting.", "这是切开以前的份数。"],
          ],
    );
  },
  stripsFigure([
    { parts: 3, shaded: 2, text: "2/3" },
    { parts: 6, shaded: 4, text: "4/6" },
  ]),
);

/** equivalentWithSum finds the equivalent fraction whose top and bottom add up to a given number. */
export const equivalentWithSum = point(
  "the-equivalent-fraction-with-a-given-sum",
  ["The equivalent fraction with a given sum", "分子分母之和一定的等值分数"],
  [
    "Which fraction equal to $\\frac{2}{3}$ has a top and bottom that add up to 20? In $\\frac{2}{3}$ they add up to 5. $20 \\div 5 = 4$, so multiply both by 4: $\\frac{8}{12}$.\n\nCheck: $8 + 12 = 20$, and $\\frac{8}{12} = \\frac{2}{3}$.\n\n> **Watch out.** The 4 is the number we multiply by. The answer is $\\frac{8}{12}$, not 4.",
    "和 $\\frac{2}{3}$ 相等、分子分母之和是 20 的分数是哪个？$\\frac{2}{3}$ 的分子分母之和是 5。$20 \\div 5 = 4$，所以分子分母都乘 4：$\\frac{8}{12}$。\n\n检验：$8 + 12 = 20$，而且 $\\frac{8}{12} = \\frac{2}{3}$。\n\n> **注意。** 4 是乘的数。答案是 $\\frac{8}{12}$，不是 4。",
  ],
  (rng) => {
    const [n, d] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [3, 7],
      [5, 8],
    ]) as [number, number];
    const k = rng.int(2, 12);
    const top = rng.bool();
    const total = (n + d) * k;
    return answered(
      [
        `A fraction equal to $${fr(n, d)}$ has a top and bottom that add up to ${total}. What is its ${top ? "top number" : "bottom number"}?`,
        `一个与 $${fr(n, d)}$ 相等的分数，分子与分母之和是 ${total}。它的${top ? "分子" : "分母"}是多少？`,
      ],
      top ? n * k : d * k,
      [
        [
          ["Find the number used", "找出乘的数"],
          [
            `In $${fr(n, d)}$ the sum is ${n + d}, and $${total} \\div ${n + d} = ${k}$.`,
            `$${fr(n, d)}$ 的分子分母之和是 ${n + d}，$${total} \\div ${n + d} = ${k}$。`,
          ],
        ],
        [
          ["Multiply", "用乘法"],
          [`Multiply both by ${k}: $${fr(n * k, d * k)}$.`, `分子分母都乘 ${k}：$${fr(n * k, d * k)}$。`],
        ],
      ],
      [`$${n * k} + ${d * k} = ${total}$.`, `$${n * k} + ${d * k} = ${total}$。`],
      [
        [top ? d * k : n * k, `That is the ${top ? "bottom" : "top"} number.`, `这是${top ? "分母" : "分子"}。`],
        [k, "That is the number we multiply by.", "这是乘的数。"],
        [
          total - (top ? n : d),
          `That takes the old ${top ? "top" : "bottom"} away from the sum.`,
          `这是用和减去了原来的${top ? "分子" : "分母"}。`,
        ],
      ],
    );
  },
  tapeFigure(
    [{ total: "20", pieces: Array.from({ length: 5 }, (_, i) => ({ size: 1, text: "4", lit: i < 2 })) }],
    ["A bar of 20 cut into 5 equal pieces of 4, with 2 pieces shaded.", "一个长 20 的长条平均分成 5 段，每段 4，涂了 2 段。"],
  ),
);

/** lcdOfThree finds the least common denominator of three unit fractions. */
export const lcdOfThree = point(
  "the-least-common-denominator-of-three",
  ["The least common denominator of three fractions", "三个分数的最小公分母"],
  [
    "For $\\frac{1}{2}$, $\\frac{1}{3}$ and $\\frac{1}{4}$, list the multiples of the largest bottom number, 4: 4, 8, 12. Test each one with 2 and 3. 12 is the first that both go into. So the least common denominator is 12.\n\nCheck: steps of 2, 3 and 4 all meet at 12.\n\n> **Watch out.** $2 \\times 3 \\times 4 = 24$ also works, but it is not the least.",
    "求 $\\frac{1}{2}$、$\\frac{1}{3}$ 和 $\\frac{1}{4}$ 的最小公分母，先列出最大分母 4 的倍数：4、8、12，再逐个用 2 和 3 检验。12 是第一个都能整除的。所以最小公分母是 12。\n\n检验：每段 2、每段 3、每段 4 都在 12 对齐。\n\n> **注意。** $2 \\times 3 \\times 4 = 24$ 也是公分母，但不是最小的。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample([2, 3, 4, 5, 6, 8, 9, 10, 12], 3) as [number, number, number];
    const l = lcm(lcm(a, b), c);
    const big = Math.max(a, b, c);
    const misses: Miss[] = [
      [big, "That is the largest bottom, but not all three go into it.", "这是最大的分母，但不是三个分母都能整除它。"],
      [a + b + c, "That adds the bottoms.", "这是把分母相加。"],
    ];
    if (a * b * c !== l)
      misses.push([
        a * b * c,
        "That multiplies all three. It works, but it is not the least.",
        "这是三个分母的积，是公分母，但不是最小的。",
      ]);
    return answered(
      [
        `Find the least common denominator of $${fr(1, a)}$, $${fr(1, b)}$ and $${fr(1, c)}$.`,
        `求 $${fr(1, a)}$、$${fr(1, b)}$ 和 $${fr(1, c)}$ 的最小公分母。`,
      ],
      l,
      [
        [
          ["List the multiples", "列出倍数"],
          [
            `List the multiples of the largest bottom, ${big}: ${big}, ${2 * big}, ${3 * big}, and so on.`,
            `列出最大分母 ${big} 的倍数：${big}、${2 * big}、${3 * big}……`,
          ],
        ],
        [
          ["Test them", "逐个检验"],
          [`The first that ${a}, ${b} and ${c} all go into is ${l}.`, `第一个能同时被 ${a}、${b}、${c} 整除的是 ${l}。`],
        ],
      ],
      [
        `$${l} \\div ${a} = ${l / a}$, $${l} \\div ${b} = ${l / b}$ and $${l} \\div ${c} = ${l / c}$.`,
        `$${l} \\div ${a} = ${l / a}$，$${l} \\div ${b} = ${l / b}$，$${l} \\div ${c} = ${l / c}$。`,
      ],
      misses,
    );
  },
  meetTapes([2, 3, 4], 12),
);

/** fractionBeforeSimplifying finds the top or bottom of a fraction from its lowest terms and the factor divided out. */
export const fractionBeforeSimplifying = point(
  "the-fraction-before-simplifying",
  ["The fraction before simplifying", "约分之前的分数"],
  [
    "A fraction became $\\frac{2}{3}$ after its top and bottom were divided by 3. To undo that, multiply both by 3: $\\frac{6}{9}$. So the fraction was $\\frac{6}{9}$.\n\nCheck: $6 \\div 3 = 2$ and $9 \\div 3 = 3$.\n\n> **Watch out.** Undo a division by multiplying. Adding 3 gives $\\frac{5}{6}$, which is wrong.",
    "一个分数的分子分母同时除以 3 后变成 $\\frac{2}{3}$。要还原，就把分子分母都乘 3：$\\frac{6}{9}$。所以原来的分数是 $\\frac{6}{9}$。\n\n检验：$6 \\div 3 = 2$，$9 \\div 3 = 3$。\n\n> **注意。** 除法要用乘法还原。加 3 得到 $\\frac{5}{6}$，这是错的。",
  ],
  (rng) => {
    const [a, b] = properFraction(rng, 12, 3);
    const k = rng.int(2, 9);
    const top = rng.bool();
    return answered(
      [
        `A fraction simplifies to $${fr(a, b)}$ after its top and bottom are divided by ${k}. What was its ${top ? "top number" : "bottom number"}?`,
        `一个分数的分子分母同时除以 ${k} 后约成 $${fr(a, b)}$。原来的${top ? "分子" : "分母"}是多少？`,
      ],
      top ? a * k : b * k,
      [
        [
          ["Undo the division", "还原除法"],
          [`Dividing by ${k} is undone by multiplying by ${k}.`, `除以 ${k} 要用乘 ${k} 来还原。`],
        ],
        [
          ["Multiply", "用乘法"],
          [
            `The fraction was $${fr(a * k, b * k)}$, so the answer is ${top ? a * k : b * k}.`,
            `原来的分数是 $${fr(a * k, b * k)}$，所以答案是 ${top ? a * k : b * k}。`,
          ],
        ],
      ],
      [`$${a * k} \\div ${k} = ${a}$ and $${b * k} \\div ${k} = ${b}$.`, `$${a * k} \\div ${k} = ${a}$，$${b * k} \\div ${k} = ${b}$。`],
      top
        ? [
            [b * k, "That is the bottom number.", "这是分母。"],
            [a + k, "That adds instead of multiplying.", "这用了加法，应该用乘法。"],
            [a, "That is the top after simplifying.", "这是约分以后的分子。"],
          ]
        : [
            [a * k, "That is the top number.", "这是分子。"],
            [b + k, "That adds instead of multiplying.", "这用了加法，应该用乘法。"],
            [b, "That is the bottom after simplifying.", "这是约分以后的分母。"],
          ],
    );
  },
  stripsFigure([
    { parts: 3, shaded: 2, text: "2/3" },
    { parts: 9, shaded: 6, text: "6/9" },
  ]),
);

/** fractionsBetween counts the fractions with a given denominator strictly between two others. */
export const fractionsBetween = point(
  "counting-fractions-between-two-fractions",
  ["Counting fractions between two fractions", "数两个分数之间的分数"],
  [
    "How many ninths are between $\\frac{2}{9}$ and $\\frac{6}{9}$? The tops between 2 and 6 are 3, 4 and 5. So there are 3: $\\frac{3}{9}$, $\\frac{4}{9}$ and $\\frac{5}{9}$.\n\nCheck: $6 - 2 - 1 = 3$.\n\n> **Watch out.** Do not count the two end fractions. The answer is not $6 - 2 = 4$.",
    "$\\frac{2}{9}$ 和 $\\frac{6}{9}$ 之间有几个九分之几？2 和 6 之间的分子是 3、4、5。所以有 3 个：$\\frac{3}{9}$、$\\frac{4}{9}$、$\\frac{5}{9}$。\n\n检验：$6 - 2 - 1 = 3$。\n\n> **注意。** 两端的分数不算。答案不是 $6 - 2 = 4$。",
  ],
  (rng) => {
    const n = rng.int(7, 24);
    const a = rng.int(1, n - 4);
    const b = rng.int(a + 3, n - 1);
    const answer = b - a - 1;
    return answered(
      [
        `How many fractions with denominator ${n} are strictly between $${fr(a, n)}$ and $${fr(b, n)}$?`,
        `分母是 ${n} 且在 $${fr(a, n)}$ 和 $${fr(b, n)}$ 之间（不含两端）的分数有多少个？`,
      ],
      answer,
      [
        [
          ["List the tops between", "列出中间的分子"],
          [`The tops run from ${a + 1} to ${b - 1}.`, `分子从 ${a + 1} 到 ${b - 1}。`],
        ],
        [
          ["Count them", "数一数"],
          [
            `From ${a + 1} to ${b - 1} there are $${b - 1} - ${a + 1} + 1 = ${answer}$ numbers.`,
            `从 ${a + 1} 到 ${b - 1} 有 $${b - 1} - ${a + 1} + 1 = ${answer}$ 个数。`,
          ],
        ],
      ],
      [`$${b} - ${a} - 1 = ${answer}$.`, `$${b} - ${a} - 1 = ${answer}$。`],
      [
        [b - a, "That counts one of the end fractions.", "这把一端的分数算进去了。"],
        [b - a + 1, "That counts both end fractions.", "这把两端的分数都算进去了。"],
        [n - b, "That counts the fractions above the larger one.", "这数的是比大的那个还大的分数。"],
      ],
    );
  },
  fractionLine(9, [
    { at: 2, label: "A" },
    { at: 6, label: "B" },
  ]),
);

/** closestToOne picks the fraction one part short of 1 that is closest to 1. */
export const closestToOne = point(
  "the-fraction-closest-to-one",
  ["The fraction closest to one", "最接近 1 的分数"],
  [
    "$\\frac{4}{5}$, $\\frac{7}{8}$ and $\\frac{9}{10}$ are each one part short of 1. The parts are $\\frac{1}{5}$, $\\frac{1}{8}$ and $\\frac{1}{10}$, and $\\frac{1}{10}$ is the smallest. So $\\frac{9}{10}$ is closest to 1.\n\nCheck: on the bars, the unshaded part of $\\frac{9}{10}$ is the shortest.\n\n> **Watch out.** The biggest bottom number gives the smallest gap, so it is closest to 1, not furthest.",
    "$\\frac{4}{5}$、$\\frac{7}{8}$、$\\frac{9}{10}$ 都比 1 少一份。这一份分别是 $\\frac{1}{5}$、$\\frac{1}{8}$、$\\frac{1}{10}$，$\\frac{1}{10}$ 最小。所以 $\\frac{9}{10}$ 最接近 1。\n\n检验：在长条上，$\\frac{9}{10}$ 没涂色的部分最短。\n\n> **注意。** 分母最大的，差的一份最小，所以最接近 1，而不是离 1 最远。",
  ],
  (rng) => {
    const ds = (rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20], 4) as number[]).sort((a, b) => b - a);
    const [best, ...others] = ds as [number, ...number[]];
    return pickedMath(
      rng,
      ["Which fraction is closest to 1?", "哪个分数最接近 1？"],
      fr(best - 1, best),
      others.map((d): [string, string, string] => [
        fr(d - 1, d),
        `It is $${fr(1, d)}$ short of 1, a bigger gap than $${fr(1, best)}$.`,
        `它比 1 少 $${fr(1, d)}$，比 $${fr(1, best)}$ 差得多。`,
      ]),
      [
        [
          ["Find each gap", "看各差多少"],
          ["Each fraction is one part short of 1.", "每个分数都比 1 少一份。"],
        ],
        [
          ["Pick the smallest gap", "找差得最少的"],
          [
            `$${fr(1, best)}$ is the smallest part, so $${fr(best - 1, best)}$ is closest.`,
            `$${fr(1, best)}$ 这一份最小，所以 $${fr(best - 1, best)}$ 最接近 1。`,
          ],
        ],
      ],
      [
        `The bigger the bottom number, the smaller each part: ${best} is the biggest bottom here.`,
        `分母越大，每份越小：这里最大的分母是 ${best}。`,
      ],
    );
  },
  twoBarsFigure(5, 4, 10, 9),
);

/** halfOfDenominator finds the nearest top that puts a fraction above or below one half. */
export const halfOfDenominator = point(
  "half-of-the-denominator",
  ["Half of the denominator", "分母的一半"],
  [
    "$\\frac{n}{10}$ is exactly one half when $n = 5$, half of 10. So the smallest $n$ that makes $\\frac{n}{10}$ more than one half is 6.\n\nCheck: $6 \\times 2 = 12$, which is more than 10.\n\n> **Watch out.** $n = 5$ gives exactly one half, which is not more than one half.",
    "当 $n = 5$，也就是 10 的一半时，$\\frac{n}{10}$ 正好等于二分之一。所以使 $\\frac{n}{10}$ 大于二分之一的最小的 $n$ 是 6。\n\n检验：$6 \\times 2 = 12$，比 10 大。\n\n> **注意。** $n = 5$ 时正好等于二分之一，不是大于二分之一。",
  ],
  (rng) => {
    const half = rng.int(3, 30);
    const d = half * 2;
    const above = rng.bool();
    const n = above ? half + 1 : half - 1;
    return answered(
      above
        ? [
            `What is the smallest whole number $n$ that makes $\\frac{n}{${d}}$ greater than $${fr(1, 2)}$?`,
            `使 $\\frac{n}{${d}}$ 大于 $${fr(1, 2)}$ 的最小整数 $n$ 是多少？`,
          ]
        : [
            `What is the largest whole number $n$ that makes $\\frac{n}{${d}}$ less than $${fr(1, 2)}$?`,
            `使 $\\frac{n}{${d}}$ 小于 $${fr(1, 2)}$ 的最大整数 $n$ 是多少？`,
          ],
      n,
      [
        [
          ["Find one half", "找出二分之一"],
          [`Half of ${d} is ${half}, so $${fr(half, d)} = ${fr(1, 2)}$.`, `${d} 的一半是 ${half}，所以 $${fr(half, d)} = ${fr(1, 2)}$。`],
        ],
        [
          ["Take the next number", "取相邻的数"],
          [`The next number ${above ? "up" : "down"} is ${n}.`, `${above ? "比它大 1" : "比它小 1"}的数是 ${n}。`],
        ],
      ],
      [
        `Double the top: $${n} \\times 2 = ${2 * n}$, which is ${above ? "more" : "less"} than ${d}.`,
        `把分子乘 2：$${n} \\times 2 = ${2 * n}$，比 ${d} ${above ? "大" : "小"}。`,
      ],
      [
        [half, "That makes exactly one half.", "这正好等于二分之一。"],
        [above ? half - 1 : half + 1, "That is on the wrong side of one half.", "这在二分之一的另一边。"],
        [d, "That makes the fraction equal to 1.", "这使分数等于 1。"],
      ],
    );
  },
  barFigure(10, 5),
);

/** smallPartsApart counts how many small parts apart two bar models are. */
export const smallPartsApart = point(
  "how-many-small-parts-apart",
  ["How many small parts apart", "相差几小份"],
  [
    "Two equal bars show $\\frac{2}{3}$ and $\\frac{5}{9}$. Cut the thirds into ninths: $\\frac{2}{3} = \\frac{6}{9}$. Now $6 - 5 = 1$, so they are 1 ninth apart.\n\nCheck: $\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$.\n\n> **Watch out.** Make the parts the same size first. $5 - 2 = 3$ mixes thirds and ninths.",
    "两个一样大的长条表示 $\\frac{2}{3}$ 和 $\\frac{5}{9}$。把三分之一切成九分之一：$\\frac{2}{3} = \\frac{6}{9}$。$6 - 5 = 1$，所以相差 1 个九分之一。\n\n检验：$\\frac{5}{9} + \\frac{1}{9} = \\frac{6}{9} = \\frac{2}{3}$。\n\n> **注意。** 要先把每份变得一样大。$5 - 2 = 3$ 把三分之一和九分之一混在一起了。",
  ],
  (rng) => {
    const d = rng.int(2, 6);
    const k = rng.int(2, 4);
    const a = rng.int(1, d - 1);
    let c = rng.int(1, d * k - 1);
    if (c === a * k) c = c < d * k - 1 ? c + 1 : c - 1;
    const gap = Math.abs(a * k - c);
    const [lo, hi] = a * k < c ? [a * k, c] : [c, a * k];
    return answered(
      [
        `Two equal bars show $${fr(a, d)}$ and $${fr(c, d * k)}$. Using parts of size $${fr(1, d * k)}$, how many parts apart are they?`,
        `两个一样大的长条表示 $${fr(a, d)}$ 和 $${fr(c, d * k)}$。以 $${fr(1, d * k)}$ 为一份，它们相差多少份？`,
      ],
      gap,
      [
        [
          ["Make the parts the same", "把每份变得一样大"],
          [`$${fr(a, d)} = ${fr(a * k, d * k)}$.`, `$${fr(a, d)} = ${fr(a * k, d * k)}$。`],
        ],
        [
          ["Subtract the tops", "分子相减"],
          [`$${hi} - ${lo} = ${gap}$.`, `$${hi} - ${lo} = ${gap}$。`],
        ],
      ],
      [`$${fr(lo, d * k)} + ${fr(gap, d * k)} = ${fr(hi, d * k)}$.`, `$${fr(lo, d * k)} + ${fr(gap, d * k)} = ${fr(hi, d * k)}$。`],
      [
        [Math.abs(a - c), "That subtracts before making the parts the same size.", "这没有先把每份变得一样大就相减了。"],
        [a * k + c, "That adds them instead of finding the gap.", "这是把它们相加了，应该求相差多少。"],
        [d * k - c, "That is the unshaded parts of the second bar.", "这是第二个长条没涂色的份数。"],
      ],
      { figure: twoBarsFigure(d, a, d * k, c) },
    );
  },
  twoBarsFigure(3, 2, 9, 5),
);

/** largestTopBelow finds the largest top that keeps a fraction below another. */
export const largestTopBelow = point(
  "the-largest-top-that-stays-below",
  ["The largest top that stays below", "仍然较小的最大分子"],
  [
    "What is the largest $n$ with $\\frac{n}{12} < \\frac{3}{4}$? Write $\\frac{3}{4}$ in twelfths: $\\frac{9}{12}$. $n$ must be below 9, so the largest is 8.\n\nCheck: $\\frac{8}{12} < \\frac{9}{12}$, but $\\frac{9}{12}$ is equal, not less.\n\n> **Watch out.** $n = 9$ makes the fractions equal, so it is not less.",
    "满足 $\\frac{n}{12} < \\frac{3}{4}$ 的最大的 $n$ 是多少？把 $\\frac{3}{4}$ 写成十二分之几：$\\frac{9}{12}$。$n$ 要小于 9，所以最大是 8。\n\n检验：$\\frac{8}{12} < \\frac{9}{12}$，而 $\\frac{9}{12}$ 是相等，不是小于。\n\n> **注意。** $n = 9$ 时两个分数相等，不是小于。",
  ],
  (rng) => {
    const d = rng.int(2, 8);
    const k = rng.int(2, 5);
    const a = rng.int(1, d - 1);
    return answered(
      [
        `What is the largest whole number $n$ with $\\frac{n}{${d * k}} < ${fr(a, d)}$?`,
        `满足 $\\frac{n}{${d * k}} < ${fr(a, d)}$ 的最大整数 $n$ 是多少？`,
      ],
      a * k - 1,
      [
        [
          ["Rewrite with the same bottom", "化成同分母"],
          [`$${fr(a, d)} = ${fr(a * k, d * k)}$.`, `$${fr(a, d)} = ${fr(a * k, d * k)}$。`],
        ],
        [
          ["Stay below the top", "分子要更小"],
          [`$n$ must be less than ${a * k}, so the largest is ${a * k - 1}.`, `$n$ 要小于 ${a * k}，所以最大是 ${a * k - 1}。`],
        ],
      ],
      [
        `$${fr(a * k - 1, d * k)} < ${fr(a * k, d * k)}$, and one more would make them equal.`,
        `$${fr(a * k - 1, d * k)} < ${fr(a * k, d * k)}$，再大 1 就相等了。`,
      ],
      [
        [a * k, "That makes the fractions equal, not less.", "这使两个分数相等，不是小于。"],
        [a - 1, "That forgets to rewrite with the same bottom.", "这忘了先化成同分母。"],
        [a * k + 1, "That is bigger, not smaller.", "这更大了，不是更小。"],
      ],
    );
  },
  stripsFigure([
    { parts: 4, shaded: 3, text: "3/4" },
    { parts: 12, shaded: 8, text: "8/12" },
  ]),
);

/** partsToFillTheBar asks how many more parts fill the bar after a like-denominator sum. */
export const partsToFillTheBar = point(
  "parts-still-needed-for-a-whole",
  ["Parts still needed for a whole", "还差几份到整体"],
  [
    "A model shows $\\frac{2}{8} + \\frac{3}{8}$. That shades $2 + 3 = 5$ of the 8 parts. $8 - 5 = 3$ parts are still empty, so 3 more eighths fill the bar.\n\nCheck: $2 + 3 + 3 = 8$, the whole bar.\n\n> **Watch out.** The answer is the empty parts, not the shaded ones.",
    "一个模型表示 $\\frac{2}{8} + \\frac{3}{8}$。8 份中涂了 $2 + 3 = 5$ 份。还空着 $8 - 5 = 3$ 份，所以再涂 3 个八分之一就填满了。\n\n检验：$2 + 3 + 3 = 8$，正是整个长条。\n\n> **注意。** 答案是空着的份，不是涂色的份。",
  ],
  (rng) => {
    const d = rng.int(4, 15);
    const a = rng.int(1, d - 2);
    const b = rng.int(1, d - a - 1);
    const left = d - a - b;
    return answered(
      [
        `A model shows $${fr(a, d)} + ${fr(b, d)}$. How many more parts of size $${fr(1, d)}$ are needed to fill a whole bar?`,
        `一个模型表示 $${fr(a, d)} + ${fr(b, d)}$。还需要多少个 $${fr(1, d)}$ 才能填满一个长条？`,
      ],
      left,
      [
        [
          ["Count the shaded parts", "数涂色的份"],
          [`$${a} + ${b} = ${a + b}$ of the ${d} parts are shaded.`, `${d} 份中涂了 $${a} + ${b} = ${a + b}$ 份。`],
        ],
        [
          ["Count the empty parts", "数空着的份"],
          [`$${d} - ${a + b} = ${left}$.`, `$${d} - ${a + b} = ${left}$。`],
        ],
      ],
      [`Add everything: $${a} + ${b} + ${left} = ${d}$, the whole bar.`, `全部加起来：$${a} + ${b} + ${left} = ${d}$，正是整个长条。`],
      [
        [a + b, "That counts the shaded parts, not the empty ones.", "这数的是涂色的份，不是空着的份。"],
        [d - a, "That forgets the second fraction.", "这忘了第二个分数。"],
        [d, "That counts all the parts of the bar.", "这数的是长条的全部份数。"],
      ],
      {
        form: "integer",
        figure: tapeFigure(
          [
            {
              pieces: [
                { size: a, text: `${a}/${d}`, lit: true },
                { size: b, text: `${b}/${d}`, lit: true },
                { size: left, text: "?", dashed: true },
              ],
            },
          ],
          [
            `A bar of ${d} parts with ${a}/${d} and ${b}/${d} shaded and the rest empty.`,
            `一个 ${d} 份的长条，涂了 ${a}/${d} 和 ${b}/${d}，其余空着。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 2, text: "2/8", lit: true },
          { size: 3, text: "3/8", lit: true },
          { size: 3, text: "?", dashed: true },
        ],
      },
    ],
    ["A bar of 8 parts with 2/8 and 3/8 shaded and 3 parts empty.", "一个 8 份的长条，涂了 2/8 和 3/8，还空着 3 份。"],
  ),
);

/** missingAddendTop finds the missing top in a like-denominator sum. */
export const missingAddendTop = point(
  "a-missing-fraction-in-a-sum",
  ["A missing fraction in a sum", "加法中缺少的分数"],
  [
    "$\\frac{3}{8} + \\frac{\\square}{8} = \\frac{7}{8}$. The bottoms match, so only the tops count: 3 and how many make 7? $7 - 3 = 4$.\n\nCheck: $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$.\n\n> **Watch out.** The box is the missing part, not the total. Do not write 7.",
    "$\\frac{3}{8} + \\frac{\\square}{8} = \\frac{7}{8}$。分母相同，只看分子：3 加几等于 7？$7 - 3 = 4$。\n\n检验：$\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$。\n\n> **注意。** 方框里是缺少的部分，不是总数。不要填 7。",
  ],
  (rng) => {
    const d = rng.int(3, 20);
    const a = rng.int(1, d - 1);
    const b = rng.int(1, d);
    return answered(
      [
        `Fill in the box: $$${fr(a, d)} + \\frac{\\square}{${d}} = ${fr(a + b, d)}$$`,
        `填方框：$$${fr(a, d)} + \\frac{\\square}{${d}} = ${fr(a + b, d)}$$`,
      ],
      b,
      [
        [
          ["Look at the bottoms", "看分母"],
          [`All the bottoms are ${d}, so only the tops count.`, `分母都是 ${d}，只看分子。`],
        ],
        [
          ["Find the missing top", "求缺少的分子"],
          [`$${a + b} - ${a} = ${b}$.`, `$${a + b} - ${a} = ${b}$。`],
        ],
      ],
      [`Add: $${a} + ${b} = ${a + b}$, the top of the total.`, `相加：$${a} + ${b} = ${a + b}$，正是和的分子。`],
      [
        [a + b, "That is the top of the total, not the missing part.", "这是和的分子，不是缺少的部分。"],
        [2 * a + b, "That adds instead of taking away.", "这是相加，应该相减。"],
        [d, "That is the bottom number.", "这是分母。"],
      ],
      { form: "integer", figure: jumpsLine(d, [a, b]) },
    );
  },
  jumpsLine(8, [3, 4]),
);

/** missingSubtrahendTop finds the top of the fraction taken away in a like-denominator difference. */
export const missingSubtrahendTop = point(
  "a-missing-fraction-in-a-difference",
  ["A missing fraction in a difference", "减法中缺少的分数"],
  [
    "$\\frac{9}{10} - \\frac{\\square}{10} = \\frac{4}{10}$. Only the tops count: 9 take away how many leaves 4? $9 - 4 = 5$.\n\nCheck: $\\frac{9}{10} - \\frac{5}{10} = \\frac{4}{10}$.\n\n> **Watch out.** The box is the part taken away. The 4 is what is left, so it is not the answer.",
    "$\\frac{9}{10} - \\frac{\\square}{10} = \\frac{4}{10}$。只看分子：9 减几等于 4？$9 - 4 = 5$。\n\n检验：$\\frac{9}{10} - \\frac{5}{10} = \\frac{4}{10}$。\n\n> **注意。** 方框里是减去的部分。4 是剩下的，不是答案。",
  ],
  (rng) => {
    const d = rng.int(4, 20);
    const c = rng.int(3, d);
    const r = rng.int(1, c - 1);
    return answered(
      [
        `Fill in the box: $$${fr(c, d)} - \\frac{\\square}{${d}} = ${fr(r, d)}$$`,
        `填方框：$$${fr(c, d)} - \\frac{\\square}{${d}} = ${fr(r, d)}$$`,
      ],
      c - r,
      [
        [
          ["Look at the bottoms", "看分母"],
          [`All the bottoms are ${d}, so only the tops count.`, `分母都是 ${d}，只看分子。`],
        ],
        [
          ["Find the part taken away", "求减去的部分"],
          [`$${c} - ${r} = ${c - r}$.`, `$${c} - ${r} = ${c - r}$。`],
        ],
      ],
      [`Add back: $${r} + ${c - r} = ${c}$, the starting top.`, `加回去：$${r} + ${c - r} = ${c}$，正是被减数的分子。`],
      [
        [c + r, "That adds instead of taking away.", "这是相加，应该相减。"],
        [r, "That is the part left, not the part taken away.", "这是剩下的部分，不是减去的部分。"],
        [d - r, "That starts from the bottom number instead of the first top.", "这是从分母减起，应该从第一个分子减起。"],
      ],
      { form: "integer", figure: sumStrips(c, c - r, d, true, false) },
    );
  },
  sumStrips(9, 5, 10, true),
);

/** fencePartLeft asks what fraction of a fence is still unpainted after two days. */
export const fencePartLeft = point(
  "the-part-not-yet-done",
  ["The part not yet done", "还没完成的部分"],
  [
    "Ben paints $\\frac{2}{7}$ of a fence on Monday and $\\frac{3}{7}$ on Tuesday. He has painted $\\frac{5}{7}$. The whole fence is $\\frac{7}{7}$, so $\\frac{7}{7} - \\frac{5}{7} = \\frac{2}{7}$ is still unpainted.\n\nCheck: $\\frac{2}{7} + \\frac{3}{7} + \\frac{2}{7} = \\frac{7}{7}$.\n\n> **Watch out.** The question asks for the part not painted. $\\frac{5}{7}$ is the painted part.",
    "本星期一刷了栅栏的 $\\frac{2}{7}$，星期二刷了 $\\frac{3}{7}$。他刷了 $\\frac{5}{7}$。整段栅栏是 $\\frac{7}{7}$，所以还有 $\\frac{7}{7} - \\frac{5}{7} = \\frac{2}{7}$ 没刷。\n\n检验：$\\frac{2}{7} + \\frac{3}{7} + \\frac{2}{7} = \\frac{7}{7}$。\n\n> **注意。** 问题问的是没刷的部分。$\\frac{5}{7}$ 是刷了的部分。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const d = rng.pick([5, 6, 7, 8, 9, 10, 11, 12]);
    const a = rng.int(1, d - 2);
    const b = rng.int(1, d - a - 1);
    const left = d - a - b;
    return answered(
      [
        `${who} painted $${fr(a, d)}$ of a fence on Monday and $${fr(b, d)}$ of it on Tuesday. What fraction of the fence is still unpainted?`,
        `${who} 星期一刷了栅栏的 $${fr(a, d)}$，星期二刷了 $${fr(b, d)}$。栅栏还有几分之几没刷？`,
      ],
      qf(left, d),
      [
        [
          ["Add the painted parts", "把刷了的部分相加"],
          [`$${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}$.`, `$${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}$。`],
        ],
        [
          ["Take them from the whole", "从整体里减去"],
          [
            `The whole fence is $${fr(d, d)}$, and $${fr(d, d)} - ${fr(a + b, d)} = ${fr(left, d)}$.`,
            `整段栅栏是 $${fr(d, d)}$，$${fr(d, d)} - ${fr(a + b, d)} = ${fr(left, d)}$。`,
          ],
        ],
      ],
      [
        `Add all three parts: the tops make $${a} + ${b} + ${left} = ${d}$, the whole fence.`,
        `三部分相加：分子是 $${a} + ${b} + ${left} = ${d}$，正是整段栅栏。`,
      ],
      [
        [qf(a + b, d), "That is the part already painted.", "这是已经刷了的部分。"],
        [qf(left, 2 * d), "That doubles the bottom. The parts keep their size.", "这把分母变成了两倍。每份的大小不变。"],
        [qf(d - a, d), "That takes away only Monday's part.", "这只减去了星期一刷的部分。"],
      ],
      { form: "fraction" },
    );
  },
  tapeFigure(
    [
      {
        total: "1",
        pieces: [
          { size: 2, text: "2/7", lit: true },
          { size: 3, text: "3/7", lit: true },
          { size: 2, text: "?", dashed: true },
        ],
      },
    ],
    ["A bar for the whole fence: 2/7 and 3/7 painted and the rest unpainted.", "表示整段栅栏的长条：刷了 2/7 和 3/7，其余没刷。"],
  ),
);

/** flourAtFirst finds the starting amount from the part used and the part left. */
export const flourAtFirst = point(
  "how-much-there-was-at-first",
  ["How much there was at first", "原来有多少"],
  [
    "Chloe used $\\frac{3}{8}$ cup of flour and has $\\frac{4}{8}$ cup left. What she used and what is left make up what she had: $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$ cup.\n\nCheck: $\\frac{7}{8} - \\frac{3}{8} = \\frac{4}{8}$, the flour left.\n\n> **Watch out.** The story says used, but you add to find the start. Subtracting gives $\\frac{1}{8}$, which is less than what is left.",
    "克洛伊用了 $\\frac{3}{8}$ 杯面粉，还剩 $\\frac{4}{8}$ 杯。用掉的和剩下的合起来就是原来的：$\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$ 杯。\n\n检验：$\\frac{7}{8} - \\frac{3}{8} = \\frac{4}{8}$，正是剩下的面粉。\n\n> **注意。** 题目说“用了”，但求原来有多少要用加法。相减得到 $\\frac{1}{8}$，比剩下的还少。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const d = rng.pick([5, 6, 7, 8, 9, 10, 11, 12]);
    const used = rng.int(1, d - 2);
    const left = rng.int(1, d - used - 1);
    const s = used + left;
    return answered(
      [
        `${who} used $${fr(used, d)}$ cup of flour and has $${fr(left, d)}$ cup left. How many cups were there at first?`,
        `${who} 用了 $${fr(used, d)}$ 杯面粉，还剩 $${fr(left, d)}$ 杯。原来有多少杯？`,
      ],
      qf(s, d),
      [
        [
          ["Choose the operation", "选运算"],
          ["What was used and what is left make up the start, so add.", "用掉的和剩下的合起来就是原来的，所以用加法。"],
        ],
        [
          ["Add the tops", "分子相加"],
          [`$${fr(used, d)} + ${fr(left, d)} = ${fr(s, d)}$.`, `$${fr(used, d)} + ${fr(left, d)} = ${fr(s, d)}$。`],
        ],
      ],
      [
        `Take away what was used, and the flour left comes back: $${fr(s, d)} - ${fr(used, d)} = ${fr(left, d)}$.`,
        `减去用掉的，得到剩下的面粉：$${fr(s, d)} - ${fr(used, d)} = ${fr(left, d)}$。`,
      ],
      [
        [qf(s, 2 * d), "That adds the bottoms too. The parts keep their size.", "这把分母也加了。每份的大小不变。"],
        [
          qf(Math.abs(used - left), d),
          "That subtracts, but the start must be more than what is left.",
          "这是相减，可是原来的量应该比剩下的多。",
        ],
        [qf(left, d), "That is only what is left.", "这只是剩下的部分。"],
      ],
      { form: "fraction" },
    );
  },
  sumStrips(3, 4, 8),
);

/** copiesOfLargerPiece counts the copies of a non-unit fraction that make up a shaded amount. */
export const copiesOfLargerPiece = point(
  "copies-of-a-non-unit-fraction",
  ["Copies of a larger piece", "较大份的个数"],
  [
    "A model shows $\\frac{6}{10}$. How many copies of $\\frac{2}{10}$ make it? Each copy uses 2 shaded parts, and $6 \\div 2 = 3$. So $\\frac{6}{10} = \\frac{2}{10} + \\frac{2}{10} + \\frac{2}{10}$.\n\nCheck: $2 + 2 + 2 = 6$.\n\n> **Watch out.** Count pieces of 2 parts, not single parts. The answer is not 6.",
    "一个模型表示 $\\frac{6}{10}$。几个 $\\frac{2}{10}$ 相加等于它？每个用 2 份涂色，$6 \\div 2 = 3$。所以 $\\frac{6}{10} = \\frac{2}{10} + \\frac{2}{10} + \\frac{2}{10}$。\n\n检验：$2 + 2 + 2 = 6$。\n\n> **注意。** 要数 2 份一块的块数，不是一份一份地数。答案不是 6。",
  ],
  (rng) => {
    const size = rng.int(2, 4);
    const copies = rng.int(2, 6);
    const n = size * copies;
    const d = n + rng.int(1, 6);
    return answered(
      [
        `A model shows $${fr(n, d)}$. How many copies of $${fr(size, d)}$ add up to it?`,
        `一个模型表示 $${fr(n, d)}$。几个 $${fr(size, d)}$ 相加等于它？`,
      ],
      copies,
      [
        [
          ["Size of one copy", "一块有几份"],
          [`Each copy of $${fr(size, d)}$ uses ${size} parts.`, `每个 $${fr(size, d)}$ 用 ${size} 份。`],
        ],
        [
          ["Share out the shaded parts", "把涂色的份分一分"],
          [`$${n} \\div ${size} = ${copies}$.`, `$${n} \\div ${size} = ${copies}$。`],
        ],
      ],
      [
        `Add the copies: $${copies} \\times ${size} = ${n}$ parts, the top of $${fr(n, d)}$.`,
        `把各块加起来：$${copies} \\times ${size} = ${n}$ 份，正是 $${fr(n, d)}$ 的分子。`,
      ],
      [
        [n, "That counts single parts, not pieces.", "这是一份一份地数，不是数块。"],
        [n - size, "That leaves out one piece.", "这少算了一块。"],
        [d, "That counts all the parts of the bar.", "这数的是长条的全部份数。"],
      ],
      { form: "integer", figure: barFigure(d, n) },
    );
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 2, text: "2/10", lit: true },
          { size: 2, text: "2/10", lit: true },
          { size: 2, text: "2/10", lit: true },
          { size: 4, text: "", dashed: true },
        ],
      },
    ],
    ["A bar of 10 parts with three shaded pieces of 2/10 each.", "一个 10 份的长条，涂了三块，每块是 2/10。"],
  ),
);

/** unitCopiesInMixed counts the unit fractions in a mixed number. */
export const unitCopiesInMixed = point(
  "unit-fractions-in-a-mixed-number",
  ["Unit fractions in a mixed number", "带分数中的分数单位"],
  [
    "How many quarters make $2\\frac{3}{4}$? Each whole is 4 quarters, so 2 wholes are $2 \\times 4 = 8$. Add the 3 more: $8 + 3 = 11$ quarters.\n\nCheck: $\\frac{11}{4}$ is 2 wholes and 3 left over, which is $2\\frac{3}{4}$.\n\n> **Watch out.** A whole is not one quarter. Each whole gives 4 quarters, so the answer is not $2 + 3 = 5$.",
    "几个四分之一等于 $2\\frac{3}{4}$？每个整体是 4 个四分之一，2 个整体是 $2 \\times 4 = 8$ 个。再加 3 个：$8 + 3 = 11$ 个四分之一。\n\n检验：$\\frac{11}{4}$ 是 2 个整体还多 3 份，就是 $2\\frac{3}{4}$。\n\n> **注意。** 一个整体不是一个四分之一。每个整体有 4 个四分之一，所以答案不是 $2 + 3 = 5$。",
  ],
  (rng) => {
    const d = rng.int(2, 10);
    const a = rng.int(1, 6);
    const n = rng.int(1, d - 1);
    return answered(
      [`How many copies of $${fr(1, d)}$ add up to $${a}${fr(n, d)}$?`, `多少个 $${fr(1, d)}$ 相加等于 $${a}${fr(n, d)}$？`],
      a * d + n,
      [
        [
          ["Count the wholes", "数整体里的份"],
          [
            `Each whole is ${d} copies, so ${a} wholes are $${a} \\times ${d} = ${a * d}$.`,
            `每个整体是 ${d} 个，${a} 个整体是 $${a} \\times ${d} = ${a * d}$ 个。`,
          ],
        ],
        [
          ["Add the fraction part", "加上分数部分"],
          [`$${a * d} + ${n} = ${a * d + n}$.`, `$${a * d} + ${n} = ${a * d + n}$。`],
        ],
      ],
      [
        `Share them back into wholes: $${a * d + n} \\div ${d} = ${a}$ with ${n} left over.`,
        `再分回整体：$${a * d + n} \\div ${d} = ${a}$，余 ${n}。`,
      ],
      [
        [a + n, "That counts each whole as one copy.", "这把每个整体当成了一个。"],
        [a * d, "That leaves out the fraction part.", "这漏掉了分数部分。"],
        [d + n, "That counts only one whole.", "这只算了一个整体。"],
      ],
      { form: "integer" },
    );
  },
  barFigure(4, 11, 3),
);

/** wholePartOfMixedSum finds the whole-number part of a sum of two mixed numbers, carrying when the parts make a whole. */
export const wholePartOfMixedSum = point(
  "the-whole-part-of-a-mixed-sum",
  ["The whole part of a mixed sum", "带分数和的整数部分"],
  [
    "$3\\frac{4}{5} + 2\\frac{3}{5}$: the wholes make $3 + 2 = 5$. The parts make $\\frac{7}{5}$. That is one more whole, so the whole part of the sum is 6.\n\nCheck: $3\\frac{4}{5} + 2\\frac{3}{5} = 6\\frac{2}{5}$.\n\n> **Watch out.** Do not just add 3 and 2. Look at the parts first: they can make another whole.",
    "$3\\frac{4}{5} + 2\\frac{3}{5}$：整数部分是 $3 + 2 = 5$。分数部分是 $\\frac{7}{5}$，又凑成一个整数，所以和的整数部分是 6。\n\n检验：$3\\frac{4}{5} + 2\\frac{3}{5} = 6\\frac{2}{5}$。\n\n> **注意。** 不能只把 3 和 2 相加。先看分数部分：它们可能凑成一个整数。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const a = rng.int(1, 15);
    const b = rng.int(1, 15);
    const n = rng.int(1, d - 1);
    const m = rng.int(1, d - 1);
    const carry = n + m >= d ? 1 : 0;
    return answered(
      [
        `What is the whole-number part of $${a}${fr(n, d)} + ${b}${fr(m, d)}$, written as a mixed number?`,
        `$${a}${fr(n, d)} + ${b}${fr(m, d)}$ 写成带分数后，整数部分是多少？`,
      ],
      a + b + carry,
      [
        [
          ["Add the parts", "分数部分相加"],
          carry
            ? [
                `$${fr(n, d)} + ${fr(m, d)} = ${fr(n + m, d)}$. That makes 1 whole or more.`,
                `$${fr(n, d)} + ${fr(m, d)} = ${fr(n + m, d)}$，满了 1 个整数。`,
              ]
            : [
                `$${fr(n, d)} + ${fr(m, d)} = ${fr(n + m, d)}$. That is less than 1 whole.`,
                `$${fr(n, d)} + ${fr(m, d)} = ${fr(n + m, d)}$，不满 1 个整数。`,
              ],
        ],
        [
          ["Add the wholes", "整数部分相加"],
          carry
            ? [
                `$${a} + ${b} + 1 = ${a + b + 1}$, with 1 carried from the parts.`,
                `$${a} + ${b} + 1 = ${a + b + 1}$，其中 1 是分数部分进上来的。`,
              ]
            : [`$${a} + ${b} = ${a + b}$, with nothing carried.`, `$${a} + ${b} = ${a + b}$，没有进位。`],
        ],
      ],
      [
        `Each part is less than 1, so the sum is between ${a + b} and ${a + b + 2}. The parts ${carry ? "make a whole" : "make less than a whole"}, so it is ${a + b + carry} and some more.`,
        `每个分数部分都小于 1，所以和在 ${a + b} 和 ${a + b + 2} 之间。分数部分${carry ? "满了一个整数" : "不满一个整数"}，所以是 ${a + b + carry} 多一点。`,
      ],
      [
        [
          a + b + 1 - carry,
          carry ? "That forgets the whole that the parts make." : "That carries a whole, but the parts make less than 1.",
          carry ? "这忘了分数部分凑成的整数。" : "这进了一个整数，可是分数部分不满 1。",
        ],
        [a + b + 2, "That carries two wholes. Two parts less than 1 make less than 2.", "这进了两个整数。两个小于 1 的分数加起来不到 2。"],
        [a + b + n + m, "That adds the tops to the wholes.", "这把分子加到整数上了。"],
      ],
      { form: "integer" },
    );
  },
  barFigure(5, 7, 2),
);

/** gapToNextWhole finds what a mixed number lacks to reach the next whole number. */
export const gapToNextWhole = point(
  "up-to-the-next-whole",
  ["Up to the next whole", "到下一个整数"],
  [
    "What takes $3\\frac{5}{8}$ up to 4? The 3 wholes are done. $\\frac{5}{8}$ needs $\\frac{3}{8}$ more to make a whole, so the answer is $\\frac{3}{8}$.\n\nCheck: $3\\frac{5}{8} + \\frac{3}{8} = 3\\frac{8}{8} = 4$.\n\n> **Watch out.** The answer is what is missing, not the $\\frac{5}{8}$ that is already there.",
    "$3\\frac{5}{8}$ 加多少等于 4？3 个整数已经有了。$\\frac{5}{8}$ 还差 $\\frac{3}{8}$ 才满一个整数，所以答案是 $\\frac{3}{8}$。\n\n检验：$3\\frac{5}{8} + \\frac{3}{8} = 3\\frac{8}{8} = 4$。\n\n> **注意。** 答案是缺的部分，不是已经有的 $\\frac{5}{8}$。",
  ],
  (rng) => {
    const d = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
    const a = rng.int(1, 30);
    const n = coprimeTo(rng, d, 1, d - 1);
    return answered(
      [`What must be added to $${a}${fr(n, d)}$ to reach ${a + 1}?`, `$${a}${fr(n, d)}$ 加上多少等于 ${a + 1}？`],
      qf(d - n, d),
      [
        [
          ["Look at the parts", "看分数部分"],
          [`The ${a} wholes are done. Only $${fr(n, d)}$ is short of a whole.`, `${a} 个整数已经有了。只有 $${fr(n, d)}$ 还不满一个整数。`],
        ],
        [
          ["Find what is missing", "求缺的部分"],
          [`$${fr(d, d)} - ${fr(n, d)} = ${fr(d - n, d)}$.`, `$${fr(d, d)} - ${fr(n, d)} = ${fr(d - n, d)}$。`],
        ],
      ],
      [
        `Add it on: $${a}${fr(n, d)} + ${fr(d - n, d)} = ${a}${fr(d, d)} = ${a + 1}$.`,
        `加上去：$${a}${fr(n, d)} + ${fr(d - n, d)} = ${a}${fr(d, d)} = ${a + 1}$。`,
      ],
      [
        [qf(n, d), "That is the part already there, not what is missing.", "这是已经有的部分，不是缺的部分。"],
        [qf(d - n, d + 1), "That changes the bottom. The parts keep their size.", "这改变了分母。每份的大小不变。"],
        [qf(d - n + 1, d), "That is one part too many.", "这多了一份。"],
      ],
      { form: "fraction", figure: partsLine(d, a, a + 1, [[a * d + n, `${a} ${n}/${d}`]], [[a * d + n, (a + 1) * d]]) },
    );
  },
  partsLine(8, 3, 4, [[29, "3 5/8"]], [[29, 32]]),
);

/** tradingAWhole renames a mixed number with one fewer whole and more parts. */
export const tradingAWhole = point(
  "trading-a-whole-for-parts",
  ["Trading a whole for parts", "把一个整数换成份"],
  [
    "$3\\frac{1}{4} = 2\\frac{\\square}{4}$. Take one whole out of the 3 wholes. That whole is $\\frac{4}{4}$, so the parts become $1 + 4 = 5$: $3\\frac{1}{4} = 2\\frac{5}{4}$.\n\nCheck: both are $\\frac{13}{4}$. $3 \\times 4 + 1 = 13$ and $2 \\times 4 + 5 = 13$.\n\n> **Watch out.** A whole is 4 fourths, not 1 fourth. The top is not $1 + 1 = 2$.",
    "$3\\frac{1}{4} = 2\\frac{\\square}{4}$。从 3 个整数里拿出一个。这个整数是 $\\frac{4}{4}$，所以分子变成 $1 + 4 = 5$：$3\\frac{1}{4} = 2\\frac{5}{4}$。\n\n检验：两个都是 $\\frac{13}{4}$。$3 \\times 4 + 1 = 13$，$2 \\times 4 + 5 = 13$。\n\n> **注意。** 一个整数是 4 个四分之一，不是 1 个。分子不是 $1 + 1 = 2$。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const a = rng.int(2, 20);
    const n = rng.int(1, d - 1);
    return answered(
      [
        `Fill in the box: $$${a}${fr(n, d)} = ${a - 1}\\frac{\\square}{${d}}$$`,
        `填方框：$$${a}${fr(n, d)} = ${a - 1}\\frac{\\square}{${d}}$$`,
      ],
      n + d,
      [
        [
          ["Take out one whole", "拿出一个整数"],
          [
            `${a} wholes become ${a - 1}. The whole taken out is $${fr(d, d)}$.`,
            `${a} 个整数变成 ${a - 1} 个。拿出的整数是 $${fr(d, d)}$。`,
          ],
        ],
        [
          ["Add it to the parts", "加到分数部分"],
          [`$${n} + ${d} = ${n + d}$.`, `$${n} + ${d} = ${n + d}$。`],
        ],
      ],
      [
        `Count all the parts both ways: $${a} \\times ${d} + ${n} = ${a * d + n}$ and $${a - 1} \\times ${d} + ${n + d} = ${a * d + n}$.`,
        `两种写法都数一数总份数：$${a} \\times ${d} + ${n} = ${a * d + n}$，$${a - 1} \\times ${d} + ${n + d} = ${a * d + n}$。`,
      ],
      [
        [n, "That keeps the old top, but a whole was taken out.", "这还是原来的分子，可是拿出了一个整数。"],
        [n + 1, `That counts the whole as 1 part, not ${d}.`, `这把一个整数当成了 1 份，应该是 ${d} 份。`],
        [d, "That is the whole on its own, without the old parts.", "这只算了那个整数，漏掉了原来的份。"],
      ],
      { form: "integer" },
    );
  },
  barFigure(4, 13, 4),
);

/** roomInTank finds how much more fits in a tank after two mixed-number amounts are poured in. */
export const roomInTank = point(
  "room-left-in-the-tank",
  ["Room left in the tank", "水箱还能装多少"],
  [
    "A tank holds 4 liters. Pour in $1\\frac{1}{4}$ liters and then $2\\frac{2}{4}$ liters. Together that is $3\\frac{3}{4}$ liters. The room left is $4 - 3\\frac{3}{4} = \\frac{1}{4}$ liter.\n\nCheck: $3\\frac{3}{4} + \\frac{1}{4} = 4$, a full tank.\n\n> **Watch out.** The answer is the empty room, not the water poured in.",
    "一个水箱能装 4 升。先倒入 $1\\frac{1}{4}$ 升，再倒入 $2\\frac{2}{4}$ 升。合起来是 $3\\frac{3}{4}$ 升。还能装 $4 - 3\\frac{3}{4} = \\frac{1}{4}$ 升。\n\n检验：$3\\frac{3}{4} + \\frac{1}{4} = 4$，正好装满。\n\n> **注意。** 答案是空着的部分，不是倒进去的水。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const d = rng.pick([3, 4, 5, 6, 8, 10, 12]);
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const n = rng.int(1, d - 1);
    let m = rng.int(1, d - 1);
    if (n + m === d) m = m > 1 ? m - 1 : m + 1;
    if (n + m === d) m = 1;
    const tops = (a + b) * d + n + m;
    const capacity = Math.ceil(tops / d);
    const room = capacity * d - tops;
    return answered(
      [
        `A tank holds ${capacity} liters. ${who} pours in $${a}${fr(n, d)}$ liters and then $${b}${fr(m, d)}$ liters more. How many more liters will fit?`,
        `一个水箱能装 ${capacity} 升。${who} 先倒入 $${a}${fr(n, d)}$ 升，又倒入 $${b}${fr(m, d)}$ 升。还能装多少升？`,
      ],
      qf(room, d),
      [
        [
          ["Add what is poured in", "把倒入的水相加"],
          [
            `In parts of $${fr(1, d)}$: $${fr(a * d + n, d)} + ${fr(b * d + m, d)} = ${fr(tops, d)}$.`,
            `化成 $${fr(1, d)}$ 的个数：$${fr(a * d + n, d)} + ${fr(b * d + m, d)} = ${fr(tops, d)}$。`,
          ],
        ],
        [
          ["Take it from the tank", "从容量中减去"],
          [
            `$${capacity} = ${fr(capacity * d, d)}$, and $${fr(capacity * d, d)} - ${fr(tops, d)} = ${fr(room, d)}$.`,
            `$${capacity} = ${fr(capacity * d, d)}$，$${fr(capacity * d, d)} - ${fr(tops, d)} = ${fr(room, d)}$。`,
          ],
        ],
      ],
      [
        `Fill it up: $${fr(tops, d)} + ${fr(room, d)} = ${fr(capacity * d, d)} = ${capacity}$.`,
        `装满看看：$${fr(tops, d)} + ${fr(room, d)} = ${fr(capacity * d, d)} = ${capacity}$。`,
      ],
      [
        [qf(tops, d), "That is the water poured in, not the room left.", "这是倒入的水，不是还能装的。"],
        [qf((n + m) % d, d), "That is only the fraction part of the water poured in.", "这只是倒入的水的分数部分。"],
        [qf(room + 1, d), "That is one part too many.", "这多了一份。"],
      ],
      { form: "fraction" },
    );
  },
  tapeFigure(
    [
      {
        total: "4 L",
        pieces: [
          { size: 5, text: "1 1/4", lit: true },
          { size: 10, text: "2 2/4", lit: true },
          { size: 1, text: "?", dashed: true },
        ],
      },
    ],
    [
      "A bar for a 4-liter tank: 1 1/4 and 2 2/4 liters poured in and a small empty part.",
      "表示 4 升水箱的长条：倒入了 1 1/4 升和 2 2/4 升，还空着一小段。",
    ],
  ),
);

/** fullBottlesLeft counts the full bottles that the rest of a jug fills after some is poured out. */
export const fullBottlesLeft = point(
  "full-bottles-from-what-is-left",
  ["Full bottles from what is left", "剩下的能装满几瓶"],
  [
    "A jug holds $5\\frac{1}{3}$ liters. $1\\frac{2}{3}$ liters are poured out. What is left is $\\frac{16}{3} - \\frac{5}{3} = \\frac{11}{3} = 3\\frac{2}{3}$ liters. That fills 3 full 1-liter bottles.\n\nCheck: 3 bottles take 3 liters, and $\\frac{2}{3}$ liter is not enough for a fourth.\n\n> **Watch out.** Do not round up. $\\frac{2}{3}$ liter cannot fill a whole bottle, so the answer is not 4.",
    "一个罐子装有 $5\\frac{1}{3}$ 升。倒出 $1\\frac{2}{3}$ 升。剩下 $\\frac{16}{3} - \\frac{5}{3} = \\frac{11}{3} = 3\\frac{2}{3}$ 升，能装满 3 个 1 升的瓶子。\n\n检验：3 个瓶子用 3 升，剩下的 $\\frac{2}{3}$ 升不够装满第 4 个。\n\n> **注意。** 不能多算一瓶。$\\frac{2}{3}$ 升装不满一瓶，所以答案不是 4。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const d = rng.pick([3, 4, 5, 6, 8, 10]);
    const b = rng.int(1, 6);
    const m = rng.int(1, d - 1);
    const left = rng.int(2, 12) * d + rng.int(1, d - 1);
    const total = b * d + m + left;
    const a = Math.floor(total / d);
    const n = total - a * d;
    const full = Math.floor(left / d);
    const start = mx(a, n, d);
    const rest = mx(full, left % d, d);
    return answered(
      [
        `A jug holds $${start}$ liters of juice. ${who} pours out $${b}${fr(m, d)}$ liters. How many full 1-liter bottles can the rest fill?`,
        `一个罐子装有 $${start}$ 升果汁。${who} 倒出 $${b}${fr(m, d)}$ 升。剩下的能装满多少个 1 升的瓶子？`,
      ],
      full,
      [
        [
          ["Find what is left", "求剩下多少"],
          [
            `$${fr(total, d)} - ${fr(b * d + m, d)} = ${fr(left, d)} = ${rest}$.`,
            `$${fr(total, d)} - ${fr(b * d + m, d)} = ${fr(left, d)} = ${rest}$。`,
          ],
        ],
        [
          ["Count the full liters", "数整升"],
          [`Only whole liters fill a bottle: ${full}.`, `只有整升才能装满瓶子：${full} 瓶。`],
        ],
      ],
      [
        `${full} bottles take ${full} liters, and the $${fr(left % d, d)}$ liter left over is less than 1.`,
        `${full} 个瓶子用 ${full} 升，剩下的 $${fr(left % d, d)}$ 升不到 1 升。`,
      ],
      [
        [full + 1, "That counts the part left over as a full bottle.", "这把剩下的一点也算成了一整瓶。"],
        [a - b, "That takes away only the wholes.", "这只减去了整数部分。"],
        [a, "That is about what the jug held at first.", "这差不多是罐子原来装的量。"],
      ],
      { form: "integer" },
    );
  },
  partsLine(
    3,
    3,
    6,
    [
      [16, "5 1/3"],
      [11, "3 2/3"],
    ],
    [[16, 11]],
  ),
);

/** unitCopiesForWholes counts the copies of a unit fraction that make a whole number. */
export const unitCopiesForWholes = point(
  "copies-of-a-unit-fraction-that-make-wholes",
  ["Copies that make whole numbers", "凑成整数需要几个"],
  [
    "How many quarters make 3? 4 quarters make 1, so 3 wholes take $3 \\times 4 = 12$ quarters.\n\nCheck: $12 \\times \\frac{1}{4} = \\frac{12}{4} = 3$.\n\n> **Watch out.** Each whole needs 4 quarters, not 1. The answer is not 3.",
    "几个四分之一凑成 3？4 个四分之一是 1，所以 3 个整数需要 $3 \\times 4 = 12$ 个四分之一。\n\n检验：$12 \\times \\frac{1}{4} = \\frac{12}{4} = 3$。\n\n> **注意。** 每个整数要 4 个四分之一，不是 1 个。答案不是 3。",
  ],
  (rng) => {
    const d = rng.int(2, 12);
    const k = rng.int(2, 9);
    return answered(
      [`How many copies of $${fr(1, d)}$ are needed to make ${k}?`, `要凑成 ${k}，需要多少个 $${fr(1, d)}$？`],
      k * d,
      [
        [
          ["Copies in one whole", "一个整数要几个"],
          [`${d} copies of $${fr(1, d)}$ make 1.`, `${d} 个 $${fr(1, d)}$ 是 1。`],
        ],
        [
          ["Copies in all the wholes", "所有整数要几个"],
          [`$${k} \\times ${d} = ${k * d}$.`, `$${k} \\times ${d} = ${k * d}$。`],
        ],
      ],
      [
        `Multiply back: $${k * d} \\times ${fr(1, d)} = ${fr(k * d, d)} = ${k}$.`,
        `乘回去：$${k * d} \\times ${fr(1, d)} = ${fr(k * d, d)} = ${k}$。`,
      ],
      [
        [k + d, "That adds instead of multiplying.", "这是相加，应该相乘。"],
        [d, "That makes only 1 whole.", "这只凑成了 1 个整数。"],
        [k, "That counts each whole as one copy.", "这把每个整数当成了一个。"],
      ],
      { form: "integer" },
    );
  },
  barFigure(4, 12, 3),
);

/** groupsToReachOne counts the fewest groups of a fraction that reach one whole. */
export const groupsToReachOne = point(
  "groups-needed-to-reach-a-whole",
  ["Groups needed to reach a whole", "达到一个整体需要几组"],
  [
    "Groups of $\\frac{3}{10}$: the tops go 3, 6, 9, 12. A whole is 10 tenths, and 12 is the first to reach 10. So 4 groups are needed.\n\nCheck: $3 \\times \\frac{3}{10} = \\frac{9}{10}$ is short of 1, and $4 \\times \\frac{3}{10} = \\frac{12}{10}$ is more than 1.\n\n> **Watch out.** Three groups make only $\\frac{9}{10}$. Do not stop before you reach a whole.",
    "一组一组地加 $\\frac{3}{10}$：分子依次是 3、6、9、12。一个整体是 10 个十分之一，12 是第一个达到 10 的。所以需要 4 组。\n\n检验：$3 \\times \\frac{3}{10} = \\frac{9}{10}$，不到 1；$4 \\times \\frac{3}{10} = \\frac{12}{10}$，超过了 1。\n\n> **注意。** 3 组只有 $\\frac{9}{10}$。还没到一个整体，不能停。",
  ],
  (rng) => {
    const d = rng.int(5, 25);
    const a = rng.int(2, Math.min(d - 1, 9));
    const g = Math.ceil(d / a);
    return answered(
      [
        `What is the smallest number of groups of $${fr(a, d)}$ that make at least one whole?`,
        `至少多少组 $${fr(a, d)}$ 才能达到一个整体？`,
      ],
      g,
      [
        [
          ["Know the target", "找目标"],
          [`One whole is ${d} parts of $${fr(1, d)}$. Each group adds ${a} parts.`, `一个整体是 ${d} 个 $${fr(1, d)}$。每组加 ${a} 个。`],
        ],
        [
          ["Count the groups", "数组数"],
          [`$${g} \\times ${a} = ${g * a}$ reaches ${d}.`, `$${g} \\times ${a} = ${g * a}$ 达到了 ${d}。`],
        ],
      ],
      [
        `One group fewer gives only ${(g - 1) * a} parts: $${g - 1} \\times ${a} = ${(g - 1) * a}$.`,
        `少一组只有 ${(g - 1) * a} 个：$${g - 1} \\times ${a} = ${(g - 1) * a}$。`,
      ],
      [
        [g + 1, "That is one group more than needed.", "这比需要的多了一组。"],
        [g - 1, "That stops before reaching a whole.", "这还没到一个整体就停了。"],
        [d, "That is the bottom number.", "这是分母。"],
      ],
      { form: "integer" },
    );
  },
  jumpsLine(10, [3, 3, 3, 3]),
);

/** shareOfAGroup finds a fraction of a group of objects: one share, then that many shares. */
export const shareOfAGroup = point(
  "a-fraction-of-a-group-of-objects",
  ["A fraction of a group of objects", "一组物体的几分之几"],
  [
    "A class has 24 books, and $\\frac{3}{8}$ of them are about animals. Split 24 into 8 equal shares: $24 \\div 8 = 3$. Take 3 shares: $3 \\times 3 = 9$ books.\n\nCheck: the other 5 shares are 15 books, and $9 + 15 = 24$.\n\n> **Watch out.** Divide by the bottom first. $24 \\times 3 = 72$ is more books than the class has.",
    "班里有 24 本书，其中 $\\frac{3}{8}$ 是关于动物的。把 24 平均分成 8 份：$24 \\div 8 = 3$。取 3 份：$3 \\times 3 = 9$ 本。\n\n检验：另外 5 份是 15 本，$9 + 15 = 24$。\n\n> **注意。** 先除以分母。$24 \\times 3 = 72$ 比班里的书还多。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    let num = rng.int(2, d - 1);
    while (gcd(num, d) !== 1) num--;
    const s = rng.int(2, 12);
    const total = d * s;
    const answer = s * num;
    return answered(
      [
        `A class has ${total} books, and $${fr(num, d)}$ of them are about animals. How many books are about animals?`,
        `班里有 ${total} 本书，其中 $${fr(num, d)}$ 是关于动物的。关于动物的书有多少本？`,
      ],
      answer,
      [
        [
          ["Find one share", "求一份"],
          [
            `Split ${total} into ${d} equal shares: $${total} \\div ${d} = ${s}$.`,
            `把 ${total} 平均分成 ${d} 份：$${total} \\div ${d} = ${s}$。`,
          ],
        ],
        [
          ["Take the shares", "取几份"],
          [`$${num} \\times ${s} = ${answer}$.`, `$${num} \\times ${s} = ${answer}$。`],
        ],
      ],
      [
        `The other ${d - num} shares are ${(d - num) * s} books. Together $${answer} + ${(d - num) * s} = ${total}$.`,
        `另外 ${d - num} 份是 ${(d - num) * s} 本。合起来 $${answer} + ${(d - num) * s} = ${total}$。`,
      ],
      [
        [s, "That is one share only.", "这只是一份。"],
        [total - answer, "That is the books not about animals.", "这是不关于动物的书。"],
        [total * num, "That multiplies by the top without dividing by the bottom.", "这乘了分子，却没有除以分母。"],
      ],
      {
        form: "integer",
        figure: tapeFigure(
          [{ total: `${total}`, pieces: Array.from({ length: d }, (_, i) => ({ size: 1, text: "", lit: i < num })) }],
          [
            `A bar for ${total} books cut into ${d} equal shares, with ${num} shaded.`,
            `表示 ${total} 本书的长条，平均分成 ${d} 份，涂了 ${num} 份。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [{ total: "24", pieces: Array.from({ length: 8 }, (_, i) => ({ size: 1, text: "3", lit: i < 3 })) }],
    ["A bar for 24 books cut into 8 shares of 3, with 3 shares shaded.", "表示 24 本书的长条，分成 8 份，每份 3 本，涂了 3 份。"],
  ),
);

/** wholeFromPart finds the whole when a fraction of it is known: one share first, then all the shares. */
export const wholeFromPart = point(
  "the-whole-from-a-fractional-part",
  ["The whole from a fractional part", "由部分求整体"],
  [
    "A class read 12 pages, which is $\\frac{3}{4}$ of a book. The 12 pages fill 3 of 4 equal shares. One share is $12 \\div 3 = 4$ pages. The book is 4 shares: $4 \\times 4 = 16$ pages.\n\nCheck: $\\frac{3}{4}$ of 16 is $16 \\div 4 \\times 3 = 12$.\n\n> **Watch out.** The whole must be more than the part. $12 \\times \\frac{3}{4} = 9$ is smaller, so it cannot be the book.",
    "全班读了 12 页，占一本书的 $\\frac{3}{4}$。这 12 页占 4 等份中的 3 份。一份是 $12 \\div 3 = 4$ 页。整本书是 4 份：$4 \\times 4 = 16$ 页。\n\n检验：16 的 $\\frac{3}{4}$ 是 $16 \\div 4 \\times 3 = 12$。\n\n> **注意。** 整体一定比部分大。$12 \\times \\frac{3}{4} = 9$ 比 12 还小，不可能是整本书。",
  ],
  (rng) => {
    const [n, d] = rng.pick([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 6],
      [3, 8],
      [5, 8],
      [7, 8],
      [3, 10],
      [7, 10],
    ]) as [number, number];
    const share = rng.int(2, 15);
    const part = n * share;
    const answer = d * share;
    return answered(
      [
        `A class read ${part} pages, which is $${fr(n, d)}$ of a book. How many pages does the book have?`,
        `全班读了 ${part} 页，占一本书的 $${fr(n, d)}$。这本书有多少页？`,
      ],
      answer,
      [
        [
          ["Find one share", "求一份"],
          [
            `The ${part} pages fill ${n} of ${d} equal shares: $${part} \\div ${n} = ${share}$.`,
            `${part} 页占 ${d} 等份中的 ${n} 份：$${part} \\div ${n} = ${share}$。`,
          ],
        ],
        [
          ["Find the whole", "求整体"],
          [`The book is ${d} shares: $${d} \\times ${share} = ${answer}$.`, `整本书是 ${d} 份：$${d} \\times ${share} = ${answer}$。`],
        ],
      ],
      [
        `Take $${fr(n, d)}$ of ${answer}. $${answer} \\div ${d} = ${share}$, then $${share} \\times ${n} = ${part}$.`,
        `求 ${answer} 的 $${fr(n, d)}$。$${answer} \\div ${d} = ${share}$，再算 $${share} \\times ${n} = ${part}$。`,
      ],
      [
        [share, "That is one share only.", "这只是一份。"],
        [part * d, "That multiplies by the bottom without dividing by the top.", "这乘了分母，却没有先除以分子。"],
        [answer - part, "That is the pages not yet read.", "这是还没读的页数。"],
        [part * n, "That multiplies by the top.", "这乘了分子。"],
      ],
      { form: "integer" },
    );
  },
  tapeFigure(
    [{ total: "?", pieces: Array.from({ length: 4 }, (_, i) => ({ size: 1, text: "4", lit: i < 3, dashed: i >= 3 })) }],
    [
      "A bar for the whole book cut into 4 shares of 4 pages, with 3 shares shaded for the 12 pages read.",
      "表示整本书的长条，分成 4 份，每份 4 页，涂了 3 份，表示读了的 12 页。",
    ],
  ),
);

/** batchesOfWholeCups multiplies a fraction by a multiple of its denominator by dividing first. */
export const batchesOfWholeCups = point(
  "batches-that-use-whole-cups",
  ["Batches that use whole cups", "几批正好用整数杯"],
  [
    "One batch uses $\\frac{3}{4}$ cup of oil. 12 batches use $12 \\times \\frac{3}{4}$ cups. Divide first: $12 \\div 4 = 3$. Then $3 \\times 3 = 9$ cups.\n\nCheck: the long way. $12 \\times \\frac{3}{4} = \\frac{36}{4} = 9$.\n\n> **Watch out.** Divide the batches by the bottom, not by the top. $12 \\div 3 \\times 4 = 16$ is wrong.",
    "每批用 $\\frac{3}{4}$ 杯油。12 批要用 $12 \\times \\frac{3}{4}$ 杯。先除：$12 \\div 4 = 3$。再算 $3 \\times 3 = 9$ 杯。\n\n检验：按原来的方法算。$12 \\times \\frac{3}{4} = \\frac{36}{4} = 9$。\n\n> **注意。** 批数要除以分母，不是除以分子。$12 \\div 3 \\times 4 = 16$ 是错的。",
  ],
  (rng) => {
    const d = rng.int(2, 8);
    const n = rng.int(1, d + 2);
    const k = d * rng.int(2, 9);
    const ans = (k / d) * n;
    return answered(
      [
        `A recipe uses $${fr(n, d)}$ cup of oil per batch. How many cups of oil do ${k} batches use?`,
        `每批食谱用 $${fr(n, d)}$ 杯油。${k} 批要用多少杯油？`,
      ],
      ans,
      [
        [
          ["Divide first", "先除"],
          [`$${k} \\div ${d} = ${k / d}$.`, `$${k} \\div ${d} = ${k / d}$。`],
        ],
        [
          ["Multiply by the top", "再乘分子"],
          [`$${k / d} \\times ${n} = ${ans}$.`, `$${k / d} \\times ${n} = ${ans}$。`],
        ],
      ],
      [
        `The long way: $${k} \\times ${fr(n, d)} = ${fr(k * n, d)} = ${ans}$.`,
        `按原来的方法算：$${k} \\times ${fr(n, d)} = ${fr(k * n, d)} = ${ans}$。`,
      ],
      [
        [k * n, "That forgets to divide by the bottom.", "这忘了除以分母。"],
        [k + n, "That adds instead of multiplying.", "这是相加，应该相乘。"],
        [k / d, "That forgets to multiply by the top.", "这忘了乘分子。"],
      ],
      { form: "integer" },
    );
  },
  copiesTape(12, 3, 4),
);

/** hundredthsInADecimal counts the hundredths in a decimal with two places: the wholes give hundreds of them. */
export const hundredthsInADecimal = point(
  "counting-the-hundredths-in-a-decimal",
  ["Counting the hundredths in a decimal", "数一个小数含有多少个百分之一"],
  [
    "How many hundredths are in $3.45$? One whole is 100 hundredths, so 3 wholes are 300 hundredths. The $0.45$ is 45 more. There are 345 hundredths, because $300 + 45 = 345$.\n\nCheck: $\\frac{345}{100} = 3.45$.\n\n> **Watch out.** Count the wholes too. $0.45$ alone has only 45 hundredths.",
    "$3.45$ 里有多少个百分之一？1 是 100 个百分之一，所以 3 是 300 个百分之一。$0.45$ 又是 45 个。一共有 345 个百分之一，因为 $300 + 45 = 345$。\n\n检验：$\\frac{345}{100} = 3.45$。\n\n> **注意。** 整数部分也要数。只看 $0.45$ 就只有 45 个百分之一。",
  ],
  (rng) => {
    const w = rng.int(1, 24);
    const h = rng.int(1, 99);
    const answer = 100 * w + h;
    const s = dec(answer, 2);
    return answered(
      [`How many hundredths are in $${s}$?`, `$${s}$ 里有多少个百分之一？`],
      answer,
      [
        [
          ["Count the wholes", "数整数部分"],
          [
            `One whole is 100 hundredths. So ${w} ${w === 1 ? "whole is" : "wholes are"} ${100 * w} hundredths.`,
            `1 是 100 个百分之一。所以 ${w} 是 ${100 * w} 个百分之一。`,
          ],
        ],
        [
          ["Add the rest", "加上其余的"],
          [
            `The digits after the point are ${h} more. $${100 * w} + ${h} = ${answer}$.`,
            `小数点后面又是 ${h} 个。$${100 * w} + ${h} = ${answer}$。`,
          ],
        ],
      ],
      [`Write it as a fraction. $${fr(answer, 100)} = ${s}$.`, `写成分数：$${fr(answer, 100)} = ${s}$。`],
      [
        [h, "That counts only the digits after the point.", "这只数了小数点后面的部分。"],
        [10 * w + Math.floor(h / 10), "That counts tenths, not hundredths.", "这数的是十分之一，不是百分之一。"],
        [answer * 10, "That counts thousandths. A hundredth is bigger.", "这数的是千分之一。百分之一更大。"],
        [w, "That counts only the wholes.", "这只数了整数部分。"],
      ],
      { form: "integer" },
    );
  },
  hundredGrid(45),
);

/** hundredthSteps counts the steps of 0.01 between a number of tenths and a number of hundredths. */
export const hundredthSteps = point(
  "hundredth-steps-between-two-decimals",
  ["Hundredth steps between two decimals", "两个小数之间的百分之一步"],
  [
    "A point moves from $0.3$ to $0.45$ in steps of $0.01$. How many steps? $0.3$ is 30 hundredths. $0.45$ is 45 hundredths. It takes 15 steps, because $45 - 30 = 15$.\n\nCheck: count on from $0.30$. 10 steps reach $0.40$, and 5 more reach $0.45$.\n\n> **Watch out.** Read $0.3$ as 30 hundredths, not 3. Otherwise you get far too many steps.",
    "一个点从 $0.3$ 出发，每步走 $0.01$，走到 $0.45$。要走几步？$0.3$ 是 30 个百分之一，$0.45$ 是 45 个百分之一。要走 15 步，因为 $45 - 30 = 15$。\n\n检验：从 $0.30$ 往后数，10 步到 $0.40$，再走 5 步到 $0.45$。\n\n> **注意。** $0.3$ 是 30 个百分之一，不是 3 个。不然步数就多了很多。",
  ],
  (rng) => {
    const a = rng.int(1, 8);
    const b = rng.int(a * 10 + 1, 99);
    const bText = num(b / 100);
    const answer = b - 10 * a;
    return answered(
      [
        `A point starts at $0.${a}$ and moves in steps of $0.01$ up to $${bText}$. How many steps does it take?`,
        `一个点从 $0.${a}$ 出发，每步走 $0.01$，走到 $${bText}$。要走多少步？`,
      ],
      answer,
      [
        [
          ["Write both in hundredths", "都写成百分之几"],
          [
            `$0.${a}$ is ${10 * a} hundredths. $${bText}$ is ${b} hundredths.`,
            `$0.${a}$ 是 ${10 * a} 个百分之一，$${bText}$ 是 ${b} 个百分之一。`,
          ],
        ],
        [
          ["Subtract", "相减"],
          [`$${b} - ${10 * a} = ${answer}$.`, `$${b} - ${10 * a} = ${answer}$。`],
        ],
      ],
      [
        `Add back: $${10 * a} + ${answer} = ${b}$. That is ${b} hundredths, or $${bText}$.`,
        `加回去：$${10 * a} + ${answer} = ${b}$。这是 ${b} 个百分之一，也就是 $${bText}$。`,
      ],
      [
        [b - a, `That reads $0.${a}$ as ${a} hundredths. It is ${10 * a}.`, `这把 $0.${a}$ 当成 ${a} 个百分之一了。其实是 ${10 * a} 个。`],
        [b, `That counts from 0, not from $0.${a}$.`, `这是从 0 数起的，应该从 $0.${a}$ 数起。`],
        [answer + 1, "That counts the starting point as a step too.", "这把起点也算成一步了。"],
      ],
      { form: "integer" },
    );
  },
  decimalLine(0.3, 0.5, 0.01, [
    [0.3, "0.3"],
    [0.45, "0.45"],
  ]),
);

/** hundredthsApart finds how many hundredths apart two decimals are, one of them perhaps with only tenths. */
export const hundredthsApart = point(
  "the-hundredths-between-two-decimals",
  ["The hundredths between two decimals", "两个小数之间相差多少个百分之一"],
  [
    "How many hundredths apart are $0.5$ and $0.37$? $0.5$ is 50 hundredths, not 5. $0.37$ is 37 hundredths. They are 13 hundredths apart, because $50 - 37 = 13$.\n\nCheck: count on from $0.37$. 3 steps reach $0.40$, and 10 more reach $0.50$.\n\n> **Watch out.** Read $0.5$ as 50 hundredths. Taking 5 from 37 gives the wrong gap.",
    "$0.5$ 和 $0.37$ 相差多少个百分之一？$0.5$ 是 50 个百分之一，不是 5 个。$0.37$ 是 37 个百分之一。它们相差 13 个百分之一，因为 $50 - 37 = 13$。\n\n检验：从 $0.37$ 往后数，3 步到 $0.40$，再走 10 步到 $0.50$。\n\n> **注意。** $0.5$ 要读成 50 个百分之一。用 37 减 5 会得出错的差。",
  ],
  (rng) => {
    let a: number;
    do a = rng.int(5, 95);
    while (a % 10 === 0);
    const short = rng.bool();
    let b: number;
    do b = short ? 10 * rng.int(1, 9) : rng.int(1, 99);
    while (b === a || (!short && b % 10 === 0));
    const fmt = (v: number) => num(v / 100);
    const [hi, lo] = a > b ? [a, b] : [b, a];
    const answer = hi - lo;
    return answered(
      [`How many hundredths apart are $${fmt(a)}$ and $${fmt(b)}$?`, `$${fmt(a)}$ 和 $${fmt(b)}$ 相差多少个百分之一？`],
      answer,
      [
        [
          ["Write both in hundredths", "都写成百分之几"],
          [
            `$${fmt(a)}$ is ${a} hundredths. $${fmt(b)}$ is ${b} hundredths.`,
            `$${fmt(a)}$ 是 ${a} 个百分之一，$${fmt(b)}$ 是 ${b} 个百分之一。`,
          ],
        ],
        [
          ["Subtract", "相减"],
          [`$${hi} - ${lo} = ${answer}$.`, `$${hi} - ${lo} = ${answer}$。`],
        ],
      ],
      [`Add back: $${lo} + ${answer} = ${hi}$.`, `加回去：$${lo} + ${answer} = ${hi}$。`],
      [
        [a + b, "That adds the two numbers instead of finding the gap.", "这是把两个数加起来了，应该求它们的差。"],
        short
          ? [
              Math.abs(a - b / 10),
              `That reads $${fmt(b)}$ as ${b / 10} hundredths. It is ${b}.`,
              `这把 $${fmt(b)}$ 当成 ${b / 10} 个百分之一了。其实是 ${b} 个。`,
            ]
          : [answer + 10, "That is off by one tenth. Check the tenths digits again.", "这多算了一个十分之一。再看一看十分位。"],
        [answer + 1, "That counts the starting point as a step too.", "这把起点也算成一步了。"],
      ],
      { form: "integer" },
    );
  },
  decimalLine(
    0.3,
    0.5,
    0.01,
    [
      [0.37, "0.37"],
      [0.5, "0.5"],
    ],
    [
      [0.37, 0.4],
      [0.4, 0.5],
    ],
  ),
);

/** fractionsBesideDecimals finds the greatest of two fractions and two decimals by writing all of them as hundredths. */
export const fractionsBesideDecimals = point(
  "comparing-fractions-with-decimals",
  ["Comparing fractions with decimals", "比较分数和小数"],
  [
    "Which is the greatest: $\\frac{3}{4}$, $0.7$ or $0.72$? Write each as hundredths. $\\frac{3}{4}$ is 75 hundredths. $0.7$ is 70 and $0.72$ is 72. So $\\frac{3}{4}$ is the greatest.\n\nCheck: $\\frac{3}{4} = 0.75$, and $0.75$ is more than $0.72$.\n\n> **Watch out.** Do not compare the 3 in $\\frac{3}{4}$ with the digits of the decimals. Change everything to hundredths first.",
    "$\\frac{3}{4}$、$0.7$、$0.72$ 中哪个最大？都写成百分之几。$\\frac{3}{4}$ 是 75 个百分之一，$0.7$ 是 70 个，$0.72$ 是 72 个。所以 $\\frac{3}{4}$ 最大。\n\n检验：$\\frac{3}{4} = 0.75$，$0.75$ 比 $0.72$ 大。\n\n> **注意。** 不能拿 $\\frac{3}{4}$ 的分子 3 和小数的数字比。先都化成百分之几。",
  ],
  (rng) => {
    const f: readonly [string, number][] = [
      [fr(1, 2), 50],
      [fr(1, 4), 25],
      [fr(3, 4), 75],
      [fr(1, 5), 20],
      [fr(2, 5), 40],
      [fr(3, 5), 60],
      [fr(4, 5), 80],
      [fr(3, 10), 30],
      [fr(7, 10), 70],
      [fr(9, 10), 90],
    ];
    const picks = rng.sample(f, 2) as [string, number][];
    const used = new Set(picks.map((p) => p[1]));
    const pool = [8, 9, 15, 35, 45, 55, 65, 85, 95, 12, 28, 72].filter((v) => !used.has(v));
    const decs = (rng.sample(pool, 2) as number[]).map((v): [string, number] => [num(v / 100), v]);
    const all = [...picks, ...decs].sort((a, b) => b[1] - a[1]);
    const [best, ...rest] = all as [[string, number], ...[string, number][]];
    return pickedMath(
      rng,
      [
        `Which is the greatest: $${[...picks, ...decs].map((x) => x[0]).join("$, $")}$?`,
        `$${[...picks, ...decs].map((x) => x[0]).join("$、$")}$ 中哪个最大？`,
      ],
      best[0],
      rest.map((x): [string, string, string] => [
        x[0],
        `That is ${x[1]} hundredths, but $${best[0]}$ is ${best[1]}.`,
        `它是 ${x[1]} 个百分之一，而 $${best[0]}$ 是 ${best[1]} 个。`,
      ]),
      [
        [
          ["Write each as hundredths", "都写成百分之几"],
          [
            `Count the hundredths: ${all.map((x) => `$${x[0]}$ is ${x[1]}`).join(", ")}.`,
            `写成百分之几：${all.map((x) => `$${x[0]}$ 是 ${x[1]} 个`).join("，")}。`,
          ],
        ],
        [
          ["Compare", "比较"],
          [
            `The most hundredths is ${best[1]}. So $${best[0]}$ is the greatest.`,
            `最多的是 ${best[1]} 个百分之一。所以 $${best[0]}$ 最大。`,
          ],
        ],
      ],
      [`Put them in order. $${all.map((x) => x[0]).join(" > ")}$.`, `按大小排列：$${all.map((x) => x[0]).join(" > ")}$。`],
    );
  },
  decimalLine(0.6, 0.8, 0.01, [
    [0.72, "0.72"],
    [0.75, "3/4"],
  ]),
);

/** zeroAfterThePoint writes a mixed number with fewer than ten hundredths as a decimal, keeping the 0 in the tenths place. */
export const zeroAfterThePoint = point(
  "a-zero-after-the-point",
  ["A zero after the point", "小数点后的零"],
  [
    "$12\\frac{4}{100}$ as a decimal? The 4 hundredths sit in the second place. The tenths place is empty, so it holds a 0. The decimal is $12.04$.\n\nCheck: $12.04$ reads as 12 and 4 hundredths.\n\n> **Watch out.** $12.4$ has no 0, so it means 12 and 4 tenths. That is ten times too many parts.",
    "$12\\frac{4}{100}$ 化成小数是多少？4 个百分之一在第二位。十分位上没有数，要写 0。小数是 $12.04$。\n\n检验：$12.04$ 读作 12 和 4 个百分之一。\n\n> **注意。** $12.4$ 没有 0，表示 12 和 4 个十分之一。分数部分大了十倍。",
  ],
  (rng) => {
    const a = rng.int(10, 40);
    const n = rng.int(1, 9);
    return pickedMath(
      rng,
      [`Write $${a}${fr(n, 100)}$ as a decimal.`, `把 $${a}${fr(n, 100)}$ 写成小数。`],
      `${a}.0${n}`,
      [
        [`${a}.${n}`, `That leaves out the 0, so it means ${n} tenths.`, `这漏掉了 0，变成了 ${n} 个十分之一。`],
        [`${a}.00${n}`, `That puts the ${n} in the third place, which is thousandths.`, `这把 ${n} 写到了第三位，那是千分位。`],
        [`${n}.${a}`, "That swaps the whole number and the hundredths.", "这把整数和百分之几的位置弄反了。"],
      ],
      [
        [
          ["Find the place", "找数位"],
          [
            `Hundredths go in the second place after the point. So the ${n} goes there.`,
            `百分之几写在小数点后第二位。所以 ${n} 写在那里。`,
          ],
        ],
        [
          ["Fill the empty place", "空位补 0"],
          [
            `There are no tenths, so the tenths place gets a 0. The decimal is $${a}.0${n}$.`,
            `没有十分之几，所以十分位写 0。小数是 $${a}.0${n}$。`,
          ],
        ],
      ],
      [`Read $${a}.0${n}$ back. It is ${a} and ${n} hundredths.`, `把 $${a}.0${n}$ 读回去：它是 ${a} 和 ${n} 个百分之一。`],
    );
  },
  decimalLine(12, 12.1, 0.01, [[12.04, "12.04"]]),
);

/** tenthsOverHundred writes a decimal in tenths as a number of hundredths over 100. */
export const tenthsOverHundred = point(
  "tenths-as-hundredths",
  ["Tenths as hundredths", "把十分之几写成百分之几"],
  [
    "$2.4 = \\frac{\\square}{100}$? Put a 0 at the end: $2.4 = 2.40$. That is 2 wholes, or 200 hundredths, and 40 more. So the box is 240.\n\nCheck: divide 240 by 100 to get back $2.4$.\n\n> **Watch out.** $\\frac{24}{100}$ is only $0.24$. The 4 is tenths, so it is 40 hundredths.",
    "$2.4 = \\frac{\\square}{100}$？在末尾添 0：$2.4 = 2.40$。这是 2 个整数，也就是 200 个百分之一，再加 40 个。所以方框里填 240。\n\n检验：240 除以 100，又得到 $2.4$。\n\n> **注意。** $\\frac{24}{100}$ 只是 $0.24$。4 在十分位，是 40 个百分之一。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const w = rng.int(0, 3);
    const value = w * 100 + a * 10;
    return answered(
      [`Fill in the box: $$${w}.${a} = \\frac{\\square}{100}$$`, `填空：$$${w}.${a} = \\frac{\\square}{100}$$`],
      value,
      [
        [
          ["Add a zero", "末尾添 0"],
          [`$${w}.${a} = ${w}.${a}0$.`, `$${w}.${a} = ${w}.${a}0$。`],
        ],
        [
          ["Count the hundredths", "数百分之一"],
          w > 0
            ? [
                `${w} ${w === 1 ? "whole is" : "wholes are"} ${100 * w} hundredths, and $0.${a}0$ is ${10 * a} more. That makes ${value}.`,
                `${w} 是 ${100 * w} 个百分之一，$0.${a}0$ 又是 ${10 * a} 个，一共 ${value} 个。`,
              ]
            : [`$0.${a}0$ is ${value} hundredths.`, `$0.${a}0$ 是 ${value} 个百分之一。`],
        ],
      ],
      [`Divide ${value} by 100 to get back $${w}.${a}$.`, `${value} 除以 100，又得到 $${w}.${a}$。`],
      [
        [w * 10 + a, "That counts tenths, not hundredths.", "这数的是十分之一，不是百分之一。"],
        [w * 100 + a, "That puts the tenths digit in the hundredths place.", "这把十分位上的数当成百分位了。"],
        [value * 10, "That counts thousandths. A hundredth is bigger.", "这数的是千分之一。百分之一更大。"],
      ],
      { form: "integer", ...(w === 0 && { figure: hundredGrid(value) }) },
    );
  },
  hundredGrid(40),
);

/** centsBeyondDollars reads the cents of an amount written as a decimal number of dollars. */
export const centsBeyondDollars = point(
  "dollars-and-cents-from-a-decimal",
  ["Dollars and cents from a decimal", "由小数读出元和分"],
  [
    "A toy costs $8.35$ dollars. The 8 before the point is 8 whole dollars. The 35 after it is $\\frac{35}{100}$ of a dollar. One cent is a hundredth of a dollar, so that is 35 cents.\n\nCheck: 8 dollars and 35 cents is $8\\frac{35}{100}$ dollars. That is $8.35$.\n\n> **Watch out.** The cents are the two digits after the point. The 8 is dollars, not cents.",
    "一个玩具售价 $8.35$ 美元。小数点前的 8 是 8 个整美元。后面的 35 是 $\\frac{35}{100}$ 美元。1 美分是百分之一美元，所以是 35 美分。\n\n检验：8 美元 35 美分是 $8\\frac{35}{100}$ 美元，也就是 $8.35$。\n\n> **注意。** 美分是小数点后面的两位数字。8 是美元，不是美分。",
  ],
  (rng) => {
    const a = rng.int(1, 60);
    const c = rng.int(1, 99);
    const s = `${a}.${String(c).padStart(2, "0")}`;
    return answered(
      [
        `An item costs $${s}$ dollars. How many cents are there beyond the whole dollars?`,
        `一件商品售价 $${s}$ 美元。除整美元外还有多少美分？`,
      ],
      c,
      [
        [
          ["Split at the point", "从小数点分开"],
          [
            `$${s}$ is ${a} whole dollars and $${num(c / 100)}$ of a dollar more.`,
            `$${s}$ 是 ${a} 个整美元，再加 $${num(c / 100)}$ 美元。`,
          ],
        ],
        [
          ["Read the cents", "读出美分"],
          [
            `$${num(c / 100)} = ${fr(c, 100)}$. One cent is a hundredth of a dollar, so that is ${c} cents.`,
            `$${num(c / 100)} = ${fr(c, 100)}$。1 美分是百分之一美元，所以是 ${c} 美分。`,
          ],
        ],
      ],
      [`Put it back together. $${a} + ${fr(c, 100)} = ${s}$.`, `合起来：$${a} + ${fr(c, 100)} = ${s}$。`],
      [
        [
          c * 10,
          "That adds a zero. Two places after the point are hundredths, which are cents.",
          "这多添了一个 0。小数点后两位是百分之几，也就是美分。",
        ],
        [a, "That gives the dollars, not the cents.", "这是美元数，不是美分数。"],
        [100 - c, "That is the cents still needed to make the next dollar.", "这是凑成下一个整美元还差的美分。"],
      ],
      { form: "integer" },
    );
  },
  hundredGrid(35),
);

/** hundredthsToAWhole finds the hundredths that complete a whole after some tenths and hundredths. */
export const hundredthsToAWhole = point(
  "the-hundredths-that-complete-a-whole",
  ["The hundredths that complete a whole", "凑成整体所需的百分之几"],
  [
    "$\\frac{3}{10} + \\frac{15}{100} + \\frac{\\square}{100} = 1$. A whole is 100 hundredths. $\\frac{3}{10}$ is 30 hundredths, so we already have 45, because $30 + 15 = 45$. The box is 55, because $100 - 45 = 55$.\n\nCheck: $30 + 15 + 55 = 100$.\n\n> **Watch out.** Change the tenths first. Using 3 instead of 30 gives 82, which is too many.",
    "$\\frac{3}{10} + \\frac{15}{100} + \\frac{\\square}{100} = 1$。1 是 100 个百分之一。$\\frac{3}{10}$ 是 30 个百分之一，所以已经有 45 个，因为 $30 + 15 = 45$。方框里填 55，因为 $100 - 45 = 55$。\n\n检验：$30 + 15 + 55 = 100$。\n\n> **注意。** 先把十分之几化成百分之几。用 3 代替 30 会得到 82，太多了。",
  ],
  (rng) => {
    const tenths = rng.int(1, 7);
    const hundredths = rng.pick([...Array(19).keys()].map((i) => i + 1).filter((v) => v % 10 !== 0));
    const have = tenths * 10 + hundredths;
    const answer = 100 - have;
    return answered(
      [
        `Find the missing numerator: $$${fr(tenths, 10)} + ${fr(hundredths, 100)} + \\frac{\\square}{100} = 1$$`,
        `求未知的分子：$$${fr(tenths, 10)} + ${fr(hundredths, 100)} + \\frac{\\square}{100} = 1$$`,
      ],
      answer,
      [
        [
          ["Change the tenths", "把十分之几化成百分之几"],
          [`$${fr(tenths, 10)} = ${fr(10 * tenths, 100)}$.`, `$${fr(tenths, 10)} = ${fr(10 * tenths, 100)}$。`],
        ],
        [
          ["Count what we have", "算出已有的"],
          [`$${10 * tenths} + ${hundredths} = ${have}$.`, `$${10 * tenths} + ${hundredths} = ${have}$。`],
        ],
        [
          ["Find what is missing", "求还差多少"],
          [`A whole is 100 hundredths. $100 - ${have} = ${answer}$.`, `1 是 100 个百分之一。$100 - ${have} = ${answer}$。`],
        ],
      ],
      [
        `Add all three tops. $${10 * tenths} + ${hundredths} + ${answer} = 100$.`,
        `三个分子相加：$${10 * tenths} + ${hundredths} + ${answer} = 100$。`,
      ],
      [
        [100 - tenths - hundredths, "That uses the tenths top without changing it to hundredths.", "这没有把十分之几化成百分之几。"],
        [have, "That is what we already have, not what is missing.", "这是已有的部分，不是还差的部分。"],
        [answer + 10, "That is off by one tenth. Check the tenths again.", "这多算了一个十分之一。再看一看十分之几。"],
      ],
      { form: "integer", figure: hundredGrid(have) },
    );
  },
  hundredGrid(45),
);
