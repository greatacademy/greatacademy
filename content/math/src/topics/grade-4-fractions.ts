import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, lcm, Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem } from "../problems.ts";
import { wordsEn, wordsZh } from "./grade-4-whole-numbers.ts";

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
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

// ---------------------------------------------------------------------------
// Fractions

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
    {
      id: "naming-shaded-parts",
      title: t("The shaded part", "涂色部分"),
      explanation: t(
        "Count the equal parts in the whole for the denominator and the shaded parts for the numerator. A bar of $8$ equal parts with $3$ shaded shows $\\frac{3}{8}$.",
        "整体平均分成的份数是分母，涂色的份数是分子。平均分成 $8$ 份、涂色 $3$ 份的长条表示 $\\frac{3}{8}$。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12);
        return {
          ...numberProblem({
            prompt: t("What fraction of the bar is shaded?", "长条的几分之几涂了颜色？"),
            answer: qf(n, d),
            form: "fraction",
            wrong: [qf(n, d - n), qf(d - n, d), qf(d, n)],
            solution: t(
              `The bar has $${d}$ equal parts and $${n}$ are shaded, so $${fr(n, d)}$ is shaded.`,
              `长条平均分成 $${d}$ 份，涂色 $${n}$ 份，所以涂色部分是 $${fr(n, d)}$。`,
            ),
          }),
          figure: barFigure(d, n),
        };
      },
    },
    {
      id: "naming-unshaded-parts",
      title: t("The part that is not shaded", "未涂色部分"),
      explanation: t(
        "The parts that are not shaded form a fraction too. A bar of $8$ equal parts with $3$ shaded has $8 - 3 = 5$ parts unshaded: $\\frac{5}{8}$.",
        "没有涂色的部分也可以用分数表示。平均分成 $8$ 份、涂色 $3$ 份的长条有 $8 - 3 = 5$ 份没有涂色：$\\frac{5}{8}$。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12);
        return {
          ...numberProblem({
            prompt: t("What fraction of the bar is not shaded?", "长条的几分之几没有涂色？"),
            answer: qf(d - n, d),
            form: "fraction",
            wrong: [qf(n, d), qf(d - n, n), qf(1, d)],
            solution: t(
              `$${d - n}$ of the $${d}$ equal parts are not shaded, so the answer is $${fr(d - n, d)}$.`,
              `$${d}$ 份中有 $${d - n}$ 份没有涂色，所以答案是 $${fr(d - n, d)}$。`,
            ),
          }),
          figure: barFigure(d, n),
        };
      },
    },
  ],
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
    {
      id: "reading-a-point-on-a-number-line",
      title: t("Reading a point", "读出点表示的分数"),
      explanation: t(
        "Count the steps between $0$ and $1$ for the denominator, then count the steps from $0$ to the point for the numerator. Count the steps, not the tick marks.",
        "数出 $0$ 到 $1$ 之间有几格，作为分母；再数出从 $0$ 到这个点有几格，作为分子。要数格数，而不是刻度线的条数。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12, 3);
        return {
          ...numberProblem({
            prompt: t("What fraction does point $P$ show?", "点 $P$ 表示什么分数？"),
            answer: qf(n, d),
            form: "fraction",
            wrong: [qf(n, d + 1), qf(n + 1, d + 1), qf(d - n, d)],
            solution: t(
              `The segment from $0$ to $1$ has $${d}$ equal steps, and $P$ is $${n}$ steps from $0$: $${fr(n, d)}$.`,
              `从 $0$ 到 $1$ 平均分成 $${d}$ 格，$P$ 离 $0$ 有 $${n}$ 格：$${fr(n, d)}$。`,
            ),
          }),
          figure: numberLineFigure(d, 0, d, wholeLabels(d, 0, d), [{ at: n, label: "P" }]),
        };
      },
    },
    {
      id: "choosing-the-point-for-a-fraction",
      title: t("Finding the point", "找出表示分数的点"),
      explanation: t(
        "On a number line, the denominator tells how many equal steps the space from $0$ to $1$ is cut into, and the numerator tells how many steps to count from $0$.\n\nTo find $\\frac{3}{5}$, cut $0$ to $1$ into $5$ equal steps and go $3$ steps from $0$. Count the spaces, not the tick marks.",
        "在数轴上，分母表示把 $0$ 到 $1$ 平均分成几格，分子表示从 $0$ 起数几格。\n\n要找 $\\frac{3}{5}$，把 $0$ 到 $1$ 平均分成 $5$ 格，从 $0$ 起走 $3$ 格。要数格子，而不是数刻度线。",
      ),
      generate(rng) {
        const d = rng.int(4, 12);
        const spots = rng.sample(
          Array.from({ length: d - 1 }, (_, i) => i + 1),
          3,
        );
        const target = spots[0]!;
        const sorted = [...spots].sort((a, b) => a - b);
        const letters = ["A", "B", "C"];
        const points = sorted.map((at, i) => ({ at, label: letters[i]! }));
        const correct = letters[sorted.indexOf(target)]!;
        return {
          ...choiceProblem({
            prompt: t(`Which point shows $${fr(target, d)}$?`, `哪个点表示 $${fr(target, d)}$？`),
            options: letters.map((l) => same(`$${l}$`)),
            correct: sorted.indexOf(target),
            solution: t(
              `$${fr(target, d)}$ is $${target}$ steps of $${fr(1, d)}$ from $0$: point $${correct}$.`,
              `$${fr(target, d)}$ 在离 $0$ 有 $${target}$ 个 $${fr(1, d)}$ 的位置：点 $${correct}$。`,
            ),
          }),
          figure: numberLineFigure(d, 0, d, wholeLabels(d, 0, d), points),
        };
      },
    },
  ],
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
    {
      id: "reading-and-writing-unit-fractions",
      title: t("Unit fractions and their names", "单位分数的读法"),
      explanation: t(
        'A unit fraction has numerator $1$. In words it is "one" followed by the name of the parts, which comes from the denominator: halves, thirds, fourths, fifths, sixths and so on.\n\n$\\frac{1}{6}$ is "one sixth", and "one ninth" is $\\frac{1}{9}$.',
        '分子是 $1$ 的分数叫分数单位。读的时候先读分母，再读"分之一"：几分之一的"几"就是分母。\n\n$\\frac{1}{6}$ 读作"六分之一"，"九分之一"写作 $\\frac{1}{9}$。',
      ),
      generate(rng) {
        const d = rng.pick(unitDenominators);
        if (rng.bool()) {
          const others = rng.shuffle(unitDenominators.filter((x) => x !== d && Math.abs(x - d) <= 4));
          return pickChoice(
            rng,
            t(`How is $${fr(1, d)}$ written in words?`, `$${fr(1, d)}$ 怎么读？`),
            fractionWords(1, d),
            [t(`${wordsEn(d)}`, `${wordsZh(d)}`), ...others.map((x) => fractionWords(1, x))],
            t(
              `$${fr(1, d)}$ is one of $${d}$ equal parts: "${fractionWords(1, d).en}".`,
              `$${fr(1, d)}$ 表示平均分成 $${d}$ 份中的一份："${fractionWords(1, d)["zh-CN"]}"。`,
            ),
          );
        }
        return numberProblem({
          prompt: t(`Write "${fractionWords(1, d).en}" as a fraction.`, `把"${fractionWords(1, d)["zh-CN"]}"写成分数。`),
          answer: qf(1, d),
          form: "fraction",
          wrong: [d, qf(1, d + 1)],
          solution: t(`One of $${d}$ equal parts is $${fr(1, d)}$.`, `平均分成 $${d}$ 份中的一份是 $${fr(1, d)}$。`),
        });
      },
    },
    {
      id: "unit-fractions-in-context",
      title: t("One equal part", "其中一份"),
      explanation: t(
        "When a whole is cut into equal parts, one part is a unit fraction: $1$ over the number of parts. The parts must be equal.\n\nIf a pizza is cut into $8$ equal slices, one slice is $\\frac{1}{8}$ of the pizza.",
        "把一个整体平均分成几份，其中一份就是一个分数单位：分母是份数，分子是 $1$。必须是平均分。\n\n把一个比萨平均切成 $8$ 块，一块就是这个比萨的 $\\frac{1}{8}$。",
      ),
      generate(rng) {
        const w = rng.pick(wholes);
        const d = rng.int(2, 20);
        return numberProblem({
          prompt: t(
            `A ${w.en} is cut into ${d} equal ${w.part.en}. What fraction of the ${w.en} is one of the ${w.part.en}?`,
            `把一个${w.zh}平均分成 ${d} ${w.part["zh-CN"]}。其中一${w.part["zh-CN"]}是这个${w.zh}的几分之几？`,
          ),
          answer: qf(1, d),
          form: "fraction",
          wrong: [d, qf(d - 1, d)],
          solution: t(`One of $${d}$ equal parts is $${fr(1, d)}$.`, `平均分成 $${d}$ 份中的一份是 $${fr(1, d)}$。`),
        });
      },
    },
  ],
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
    {
      id: "writing-fractions-as-words",
      title: t("From fraction to words", "从分数到文字"),
      explanation: t(
        'To write a fraction in words, say the numerator as a number, then the name of the parts from the denominator, made plural when the numerator is more than $1$.\n\n$\\frac{4}{9}$ is "four ninths": the numerator first, then the plural name of the parts.',
        '分数的读法是先读分母，再读"分之"，最后读分子。分母表示平均分成几份，分子表示取了几份。\n\n$\\frac{4}{9}$ 读作"九分之四"：先读分母 $9$，再读分子 $4$。',
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12, 3);
        const wrong = [
          fractionWords(d, n),
          t(`${wordsEn(n)} ${ordinalEn(d, false)}`, `${wordsZh(n)}分之${wordsZh(d)}`),
          fractionWords(n, d + 1),
          fractionWords(n + 1 < d ? n + 1 : n - 1 || 1, d),
        ];
        return pickChoice(
          rng,
          t(`How is $${fr(n, d)}$ written in words?`, `$${fr(n, d)}$ 怎么读？`),
          fractionWords(n, d),
          wrong.filter((w) => w.en !== fractionWords(n, d).en && w["zh-CN"] !== fractionWords(n, d)["zh-CN"]),
          t(
            `$${n}$ parts of size $${fr(1, d)}$: "${fractionWords(n, d).en}".`,
            `平均分成 $${d}$ 份，取其中 $${n}$ 份："${fractionWords(n, d)["zh-CN"]}"。`,
          ),
        );
      },
    },
    {
      id: "writing-words-as-fractions",
      title: t("From words to fraction", "从文字到分数"),
      explanation: t(
        'To write a fraction from words, the first number word is the numerator and the name of the parts gives the denominator: thirds are $3$, eighths are $8$, tenths are $10$.\n\n"Five eighths" is $\\frac{5}{8}$, not $\\frac{8}{5}$.',
        '根据读法写分数时，"分之"前面的数是分母，后面的数是分子。\n\n"八分之五"写作 $\\frac{5}{8}$，而不是 $\\frac{8}{5}$。',
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 20, 3);
        return numberProblem({
          prompt: t(`Write "${fractionWords(n, d).en}" as a fraction.`, `把"${fractionWords(n, d)["zh-CN"]}"写成分数。`),
          answer: qf(n, d),
          form: "fraction",
          wrong: [qf(d, n), qf(1, d)],
          solution: t(
            `"${fractionWords(n, d).en}" means $${n}$ parts of size $${fr(1, d)}$: $${fr(n, d)}$.`,
            `"${fractionWords(n, d)["zh-CN"]}"表示平均分成 $${d}$ 份中的 $${n}$ 份：$${fr(n, d)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "writing-quotients-as-fractions",
      title: t("Division as a fraction", "把除法写成分数"),
      explanation: t(
        "A fraction is a division: $\\frac{a}{b}$ means $a \\div b$. So any division can be written as a fraction, with the number being divided on top.\n\n$5 \\div 7 = \\frac{5}{7}$: the dividend is the numerator and the divisor is the denominator.",
        "分数也表示除法：$\\frac{a}{b}$ 就是 $a \\div b$。所以任何除法都可以写成分数，被除数作分子。\n\n$5 \\div 7 = \\frac{5}{7}$：被除数作分子，除数作分母。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 15);
        return numberProblem({
          prompt: t(`Write $${a} \\div ${b}$ as a fraction.`, `把 $${a} \\div ${b}$ 写成分数。`),
          answer: qf(a, b),
          form: "fraction",
          wrong: [qf(b, a), qf(1, b)],
          solution: t(`$${a} \\div ${b} = ${fr(a, b)}$.`, `$${a} \\div ${b} = ${fr(a, b)}$。`),
        });
      },
    },
    {
      id: "fair-shares-as-fractions",
      title: t("Fair shares", "平均分"),
      explanation: t(
        "When some wholes are shared equally, each share is the number of wholes divided by the number of people, which is the fraction wholes over people.\n\n$2$ cakes shared equally among $5$ friends: each friend gets $2 \\div 5 = \\frac{2}{5}$ of a cake. Writing $\\frac{5}{2}$ would give each friend more than two cakes.",
        "把几个整体平均分给几个人，每人分到的是整体数除以人数，也就是以整体数为分子、人数为分母的分数。\n\n$2$ 个蛋糕平均分给 $5$ 个朋友：每人得到 $2 \\div 5 = \\frac{2}{5}$ 个蛋糕。如果写成 $\\frac{5}{2}$，每人就分到两个多蛋糕，这显然不对。",
      ),
      generate(rng) {
        const w = rng.pick(wholes.filter((x) => x.en !== "garden"));
        const [a, b] = properFraction(rng, 12);
        return numberProblem({
          prompt: t(
            `${a} ${w.en}${a > 1 ? "s are" : " is"} shared equally among ${b} friends. What fraction of a ${w.en} does each friend get?`,
            `把 ${a} 个${w.zh}平均分给 ${b} 个朋友。每人得到几分之几个${w.zh}？`,
          ),
          answer: qf(a, b),
          form: "fraction",
          wrong: [qf(b, a), qf(1, b)],
          solution: t(
            `Each friend gets $${a} \\div ${b} = ${fr(a, b)}$ of a ${w.en}.`,
            `每人得到 $${a} \\div ${b} = ${fr(a, b)}$ 个${w.zh}。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "improper-fractions-from-models",
      title: t("Shaded parts of several wholes", "几个整体的涂色部分"),
      explanation: t(
        "Each bar is one whole cut into $4$ parts. If $7$ parts are shaded in all, the shaded amount is $\\frac{7}{4}$.",
        "每个长条是一个整体，平均分成 $4$ 份。一共涂色 $7$ 份，涂色部分就是 $\\frac{7}{4}$。",
      ),
      generate(rng) {
        const [n, d] = improperFraction(rng, 8, 3);
        const count = Math.ceil(n / d);
        return {
          ...numberProblem({
            prompt: t(
              "Each bar is one whole. Write the shaded amount as an improper fraction.",
              "每个长条表示一个整体。用假分数表示涂色部分。",
            ),
            answer: qf(n, d),
            form: "fraction",
            wrong: [qf(n, count * d), qf(d, n), qf(n - d, d)],
            solution: t(
              `Each whole has $${d}$ parts, and $${n}$ parts are shaded: $${fr(n, d)}$.`,
              `每个整体有 $${d}$ 份，一共涂色 $${n}$ 份：$${fr(n, d)}$。`,
            ),
          }),
          figure: barFigure(d, n, count),
        };
      },
    },
    {
      id: "comparing-fractions-with-one-whole",
      title: t("Less than, equal to or more than 1", "小于、等于还是大于 1"),
      explanation: t(
        "Compare the numerator with the denominator. If they are equal, the fraction is one whole; if the numerator is smaller, it is less than $1$; if the numerator is larger, it is more than $1$ and is called an improper fraction.\n\n$\\frac{5}{5} = 1$, $\\frac{4}{5} < 1$ and $\\frac{6}{5} > 1$.",
        "比较分子和分母：相等时分数等于 $1$；分子小于分母时，分数小于 $1$；分子大于分母时，分数大于 $1$，叫作假分数。\n\n$\\frac{5}{5} = 1$，$\\frac{4}{5} < 1$，$\\frac{6}{5} > 1$。",
      ),
      generate(rng) {
        const d = rng.int(2, 15);
        const n = rng.pick([rng.int(1, d - 1), d, rng.int(d + 1, 3 * d)]);
        return compareProblem(
          fr(n, d),
          "1",
          n < d ? 0 : n === d ? 1 : 2,
          n < d
            ? t(
                `The numerator $${n}$ is less than the denominator $${d}$, so $${fr(n, d)} < 1$.`,
                `分子 $${n}$ 小于分母 $${d}$，所以 $${fr(n, d)} < 1$。`,
              )
            : n === d
              ? t(`The numerator equals the denominator, so $${fr(n, d)} = 1$.`, `分子等于分母，所以 $${fr(n, d)} = 1$。`)
              : t(
                  `The numerator $${n}$ is greater than the denominator $${d}$, so $${fr(n, d)} > 1$.`,
                  `分子 $${n}$ 大于分母 $${d}$，所以 $${fr(n, d)} > 1$。`,
                ),
        );
      },
    },
  ],
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
    {
      id: "mixed-numbers-from-models",
      title: t("Reading a model", "看模型写带分数"),
      explanation: t(
        "A mixed number is a whole number and a fraction together. Count the full wholes in the model for the whole-number part, then write the partly shaded whole as a fraction.\n\n$2$ full bars and $3$ of $5$ parts of the next bar show $2\\frac{3}{5}$.",
        "带分数由一个整数和一个分数组成。数出模型中涂满的整体个数作为整数部分，再把没涂满的那个整体写成分数。\n\n$2$ 个涂满的长条，加上下一个长条 $5$ 份中的 $3$ 份，表示 $2\\frac{3}{5}$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const w = rng.int(1, 3);
        const r = coprimeTo(rng, d, 1, d - 1);
        return {
          ...numberProblem({
            prompt: t("Each bar is one whole. Write the shaded amount as a mixed number.", "每个长条表示一个整体。用带分数表示涂色部分。"),
            answer: qf(w * d + r, d),
            form: "mixed",
            wrong: [qf(w * d + r, (w + 1) * d), qf(r, d), w + 1],
            solution: t(
              `$${w}$ whole bar${w > 1 ? "s are" : " is"} shaded, and $${r}$ of the $${d}$ parts of the next: $${mx(w, r, d)}$.`,
              `涂满了 $${w}$ 个长条，下一个长条 $${d}$ 份中涂了 $${r}$ 份：$${mx(w, r, d)}$。`,
            ),
          }),
          figure: barFigure(d, w * d + r, w + 1),
        };
      },
    },
    {
      id: "mixed-numbers-from-wholes-and-parts",
      title: t("Wholes and parts", "整体和部分"),
      explanation: t(
        "To write wholes and a part as a mixed number, write the number of wholes, then the fraction right after it. A mixed number means the whole number plus the fraction.\n\n$3$ whole pies and $\\frac{1}{4}$ of a pie make $3\\frac{1}{4}$ pies.",
        "把几个整体和一部分写成带分数，先写整体的个数，紧接着写分数。带分数表示整数加上分数。\n\n$3$ 个完整的馅饼和 $\\frac{1}{4}$ 个馅饼合起来是 $3\\frac{1}{4}$ 个馅饼。",
      ),
      generate(rng) {
        const wh = rng.pick(wholes.filter((x) => x.en !== "garden"));
        const d = rng.int(2, 12);
        const w = rng.int(1, 9);
        const r = coprimeTo(rng, d, 1, d - 1);
        return numberProblem({
          prompt: t(
            `There are ${w} whole ${wh.en}s and $${fr(r, d)}$ of another ${wh.en}. Write the amount as a mixed number.`,
            `有 ${w} 个完整的${wh.zh}，还有另一个${wh.zh}的 $${fr(r, d)}$。用带分数表示一共有多少个${wh.zh}。`,
          ),
          answer: qf(w * d + r, d),
          form: "mixed",
          wrong: [qf(w + r, d), qf(w * r, d)],
          solution: t(`$${w}$ wholes and $${fr(r, d)}$ make $${mx(w, r, d)}$.`, `$${w}$ 个整体加 $${fr(r, d)}$ 是 $${mx(w, r, d)}$。`),
        });
      },
    },
  ],
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
    {
      id: "reading-mixed-numbers-on-number-lines",
      title: t("Reading a point", "读出点表示的带分数"),
      explanation: t(
        "A point $2$ steps past $3$ on a line with fourths is at $3\\frac{2}{4}$, which is $3\\frac{1}{2}$ in lowest terms. Count the steps after the last whole number.",
        "以四分之一为一格的数轴上，$3$ 右边第 $1$ 格是 $3\\frac{1}{4}$。数出最后一个整数之后有几格。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const w = rng.int(1, 3);
        const r = coprimeTo(rng, d, 1, d - 1);
        const to = (w + 1) * d;
        return {
          ...numberProblem({
            prompt: t("Write the number at point $P$ as a mixed number.", "用带分数表示点 $P$ 所表示的数。"),
            answer: qf(w * d + r, d),
            form: "mixed",
            wrong: [qf((w + 1) * d + r, d), qf(r, d), qf(w * (d + 1) + r, d + 1)],
            solution: t(
              `Each whole has $${d}$ steps. $P$ is $${r}$ step${r > 1 ? "s" : ""} past $${w}$: $${mx(w, r, d)}$.`,
              `每个单位长度有 $${d}$ 格。$P$ 在 $${w}$ 右边第 $${r}$ 格：$${mx(w, r, d)}$。`,
            ),
          }),
          figure: numberLineFigure(d, 0, to, wholeLabels(d, 0, to), [{ at: w * d + r, label: "P" }]),
        };
      },
    },
    {
      id: "finding-mixed-numbers-on-number-lines",
      title: t("Finding the point", "找出表示带分数的点"),
      explanation: t(
        "To place a mixed number on a number line, first go to its whole-number part, then count steps of the unit fraction from there.\n\nTo find $1\\frac{2}{3}$, go to $1$ and then $2$ steps of $\\frac{1}{3}$ further. The point lies between $1$ and $2$.",
        "在数轴上找带分数，先找到它的整数部分，再从那里按分数单位往右数。\n\n要找 $1\\frac{2}{3}$，先找到 $1$，再往右走 $2$ 个 $\\frac{1}{3}$。这个点在 $1$ 和 $2$ 之间。",
      ),
      generate(rng) {
        const d = rng.int(3, 6);
        const to = 3 * d;
        const spots = rng.sample(
          Array.from({ length: to - 1 }, (_, i) => i + 1).filter((k) => k > d && k % d !== 0 && gcd(k % d, d) === 1),
          3,
        );
        const target = spots[0]!;
        const sorted = [...spots].sort((a, b) => a - b);
        const letters = ["A", "B", "C"];
        const w = Math.floor(target / d);
        const r = target % d;
        return {
          ...choiceProblem({
            prompt: t(`Which point shows $${mx(w, r, d)}$?`, `哪个点表示 $${mx(w, r, d)}$？`),
            options: letters.map((l) => same(`$${l}$`)),
            correct: sorted.indexOf(target),
            solution: t(
              `$${mx(w, r, d)}$ is $${r}$ step${r > 1 ? "s" : ""} of $${fr(1, d)}$ past $${w}$: point $${letters[sorted.indexOf(target)]}$.`,
              `$${mx(w, r, d)}$ 在 $${w}$ 右边 $${r}$ 个 $${fr(1, d)}$ 处：点 $${letters[sorted.indexOf(target)]}$。`,
            ),
          }),
          figure: numberLineFigure(
            d,
            0,
            to,
            wholeLabels(d, 0, to),
            sorted.map((at, i) => ({ at, label: letters[i]! })),
          ),
        };
      },
    },
  ],
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
    {
      id: "quotients-as-mixed-numbers",
      title: t("Quotients as mixed numbers", "商写成带分数"),
      explanation: t(
        "A division with a remainder can be written as a mixed number. The quotient is the whole-number part, and the remainder over the divisor is the fraction, since the remainder is still to be divided.\n\n$23 \\div 4 = 5 \\text{ R } 3$, so $23 \\div 4 = 5\\frac{3}{4}$.",
        "有余数的除法可以写成带分数。商是整数部分，余数还要继续平均分，所以余数作分子、除数作分母，就是分数部分。\n\n$23 \\div 4 = 5 \\cdots\\cdots 3$，所以 $23 \\div 4 = 5\\frac{3}{4}$。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const a = coprimeTo(rng, b, b + 1, 9 * b);
        const w = Math.floor(a / b);
        const r = a % b;
        return numberProblem({
          prompt: t(`Write $${a} \\div ${b}$ as a mixed number.`, `把 $${a} \\div ${b}$ 的结果写成带分数。`),
          answer: qf(a, b),
          form: "mixed",
          wrong: [qf(w * r + 1, r), w, qf(w * b + b - r, b)],
          solution: t(
            `$${a} \\div ${b} = ${w} \\text{ R } ${r}$, so $${a} \\div ${b} = ${mx(w, r, b)}$.`,
            `$${a} \\div ${b} = ${w} \\cdots\\cdots ${r}$，所以 $${a} \\div ${b} = ${mx(w, r, b)}$。`,
          ),
        });
      },
    },
    {
      id: "sharing-with-mixed-number-answers",
      title: t("Sharing with a remainder", "有余数的平均分"),
      explanation: t(
        "When an amount like rope or rice is shared equally, the remainder can be split too, so the answer is a mixed number: quotient and remainder over divisor, simplified.\n\n$14$ feet of rope cut into $4$ equal pieces: $14 \\div 4 = 3 \\text{ R } 2$, so each piece is $3\\frac{2}{4} = 3\\frac{1}{2}$ feet long.",
        "把绳子、大米这样可以再分的量平均分时，余数也可以继续分，所以结果是带分数：商作整数部分，余数比除数作分数部分，再约分。\n\n$14$ 英尺长的绳子平均剪成 $4$ 段：$14 \\div 4 = 3 \\cdots\\cdots 2$，所以每段长 $3\\frac{2}{4} = 3\\frac{1}{2}$ 英尺。",
      ),
      generate(rng) {
        const b = rng.int(2, 8);
        const a = coprimeTo(rng, b, b + 1, 8 * b);
        const w = Math.floor(a / b);
        const r = a % b;
        const kind = rng.int(0, 1);
        return numberProblem({
          prompt:
            kind === 0
              ? t(
                  `A ribbon ${a} feet long is cut into ${b} equal pieces. How many feet long is each piece? Write a mixed number.`,
                  `一条 ${a} 英尺长的丝带被平均剪成 ${b} 段。每段长多少英尺？用带分数表示。`,
                )
              : t(
                  `${a} pounds of rice are shared equally among ${b} bags. How many pounds go in each bag? Write a mixed number.`,
                  `把 ${a} 磅大米平均装进 ${b} 个袋子。每袋装多少磅？用带分数表示。`,
                ),
          answer: qf(a, b),
          form: "mixed",
          wrong: [w, w + 1, qf(r, b)],
          solution: t(
            `$${a} \\div ${b} = ${w} \\text{ R } ${r} = ${mx(w, r, b)}$.`,
            `$${a} \\div ${b} = ${w} \\cdots\\cdots ${r}$，即 $${mx(w, r, b)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "writing-improper-fractions-as-mixed-numbers",
      title: t("Improper to mixed", "假分数化带分数"),
      explanation: t(
        "To change an improper fraction to a mixed number, divide the numerator by the denominator. The quotient is the whole number, and the remainder over the same denominator is the fraction.\n\n$\\frac{29}{6}$: $29 \\div 6 = 4 \\text{ R } 5$, so $\\frac{29}{6} = 4\\frac{5}{6}$.",
        "把假分数化成带分数，用分子除以分母。商是整数部分，余数作分子、分母不变，就是分数部分。\n\n$\\frac{29}{6}$：$29 \\div 6 = 4 \\cdots\\cdots 5$，所以 $\\frac{29}{6} = 4\\frac{5}{6}$。",
      ),
      generate(rng) {
        const [n, d] = improperFraction(rng, 12, 9);
        const w = Math.floor(n / d);
        const r = n % d;
        return numberProblem({
          prompt: t(`Write $${fr(n, d)}$ as a mixed number.`, `把 $${fr(n, d)}$ 化成带分数。`),
          answer: qf(n, d),
          form: "mixed",
          wrong: [qf(w * d + d - r, d), qf((w - 1) * d + r, d), qf(r * d + w, d)],
          solution: t(
            `$${n} \\div ${d} = ${w} \\text{ R } ${r}$, so $${fr(n, d)} = ${mx(w, r, d)}$.`,
            `$${n} \\div ${d} = ${w} \\cdots\\cdots ${r}$，所以 $${fr(n, d)} = ${mx(w, r, d)}$。`,
          ),
        });
      },
    },
    {
      id: "improper-fractions-equal-to-whole-numbers",
      title: t("Whole numbers and missing parts", "整数与缺少的部分"),
      explanation: t(
        "If the numerator divides evenly by the denominator, the improper fraction is a whole number. Otherwise, the remainder is the numerator of the fraction part.\n\n$\\frac{24}{6} = 4$, since $24 \\div 6 = 4$ with no remainder. And $\\frac{26}{6} = 4\\frac{2}{6}$, so the missing numerator in $4\\frac{\\square}{6}$ is $2$.",
        "如果分子能被分母整除，假分数就等于整数；否则余数就是分数部分的分子。\n\n$\\frac{24}{6} = 4$，因为 $24 \\div 6 = 4$ 没有余数。$\\frac{26}{6} = 4\\frac{2}{6}$，所以 $4\\frac{\\square}{6}$ 中缺少的分子是 $2$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const w = rng.int(2, 9);
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(`Write $${fr(w * d, d)}$ as a whole number.`, `把 $${fr(w * d, d)}$ 化成整数。`),
            answer: w,
            form: "integer",
            wrong: [w * d - d, w + 1, d],
            solution: t(
              `Every $${d}$ parts of size $${fr(1, d)}$ make one whole, so $${w * d}$ parts make $${w * d} \\div ${d} = ${w}$ wholes.`,
              `每 $${d}$ 个 $${fr(1, d)}$ 组成一个整体，所以 $${w * d}$ 个组成 $${w * d} \\div ${d} = ${w}$ 个整体。`,
            ),
          });
        }
        const r = rng.int(1, d - 1);
        return numberProblem({
          prompt: t(
            `Find the missing numerator: $$${fr(w * d + r, d)} = ${w}\\frac{\\square}{${d}}$$`,
            `求缺少的分子：$$${fr(w * d + r, d)} = ${w}\\frac{\\square}{${d}}$$`,
          ),
          answer: r,
          form: "integer",
          wrong: [w * d + r - w, r + d, d - r],
          solution: t(
            `$${w}$ wholes are $${w * d}$ parts of size $${fr(1, d)}$, and $${w * d + r} - ${w * d} = ${r}$.`,
            `$${w}$ 个整体是 $${w * d}$ 个 $${fr(1, d)}$，$${w * d + r} - ${w * d} = ${r}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "writing-mixed-numbers-as-improper-fractions",
      title: t("Mixed to improper", "带分数化假分数"),
      explanation: t(
        "To change a mixed number to an improper fraction, find how many parts the wholes make by multiplying the whole number by the denominator, then add the numerator. The denominator stays the same.\n\n$4\\frac{3}{7} = \\frac{4 \\times 7 + 3}{7} = \\frac{31}{7}$.",
        "把带分数化成假分数，先用整数乘分母，求出整数部分有多少份，再加上分子。分母不变。\n\n$4\\frac{3}{7} = \\frac{4 \\times 7 + 3}{7} = \\frac{31}{7}$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const w = rng.int(1, 9);
        const r = coprimeTo(rng, d, 1, d - 1);
        return numberProblem({
          prompt: t(`Write $${mx(w, r, d)}$ as an improper fraction.`, `把 $${mx(w, r, d)}$ 化成假分数。`),
          answer: qf(w * d + r, d),
          form: "fraction",
          wrong: [qf(w + r, d), qf(w * r + d, d), qf(w * d * r, d)],
          solution: t(
            `$${mx(w, r, d)} = ${fr(`${w} \\times ${d} + ${r}`, d)} = ${fr(w * d + r, d)}$.`,
            `$${mx(w, r, d)} = ${fr(`${w} \\times ${d} + ${r}`, d)} = ${fr(w * d + r, d)}$。`,
          ),
        });
      },
    },
    {
      id: "missing-numerators-of-improper-fractions",
      title: t("A missing numerator", "缺少的分子"),
      explanation: t(
        "Each whole holds as many parts as the denominator. Multiply to count the parts in the wholes, then add the parts in the fraction.\n\n$2\\frac{5}{8} = \\frac{\\square}{8}$: $2$ wholes are $16$ eighths, and $16 + 5 = 21$. Adding $2 + 5$ forgets that each whole is $8$ eighths.",
        "每个整体里的份数等于分母。先用乘法求出整数部分有几份，再加上分数部分的份数。\n\n$2\\frac{5}{8} = \\frac{\\square}{8}$：$2$ 个整体是 $16$ 个八分之一，$16 + 5 = 21$。如果算成 $2 + 5$，就忘了每个整体是 $8$ 个八分之一。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const w = rng.int(1, 9);
        const r = rng.int(1, d - 1);
        return numberProblem({
          prompt: t(
            `Find the missing numerator: $$${mx(w, r, d)} = \\frac{\\square}{${d}}$$`,
            `求缺少的分子：$$${mx(w, r, d)} = \\frac{\\square}{${d}}$$`,
          ),
          answer: w * d + r,
          form: "integer",
          wrong: [w + r, w * r + d, w * d],
          solution: t(
            `Each whole is $${d}$ parts of size $${fr(1, d)}$, so $${w}$ wholes are $${w} \\times ${d} = ${w * d}$ parts. Add the $${r}$ more parts: $${w * d} + ${r} = ${w * d + r}$.`,
            `每个整体是 $${d}$ 个 $${fr(1, d)}$，所以 $${w}$ 个整体是 $${w} \\times ${d} = ${w * d}$ 个。再加上另外 $${r}$ 个：$${w * d} + ${r} = ${w * d + r}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "equivalent-fractions-from-two-bars",
      title: t("Two bars of the same size", "两个同样大的长条"),
      explanation: t(
        "A bar with $\\frac{3}{4}$ shaded and a bar of the same size cut into $8$ parts: $6$ of the $8$ parts cover the same amount, so $\\frac{3}{4} = \\frac{6}{8}$.",
        "一个长条涂色 $\\frac{3}{4}$，另一个同样大的长条平均分成 $8$ 份：涂 $6$ 份才一样多，所以 $\\frac{3}{4} = \\frac{6}{8}$。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 6);
        const k = rng.int(2, Math.floor(24 / d));
        return {
          ...numberProblem({
            prompt: t(
              `The two bars are the same size. The first shows $${fr(n, d)}$. How many parts of the second bar must be shaded to show the same amount?`,
              `两个长条一样大。第一个表示 $${fr(n, d)}$。第二个长条要涂几份才能表示同样多？`,
            ),
            answer: n * k,
            form: "integer",
            wrong: [n + k, n * k + 1, d * k - n * k],
            solution: t(
              `Each part of the first bar matches $${k}$ parts of the second, so $${n} \\times ${k} = ${n * k}$ parts: $${fr(n, d)} = ${fr(n * k, d * k)}$.`,
              `第一个长条的每一份对应第二个长条的 $${k}$ 份，所以要涂 $${n} \\times ${k} = ${n * k}$ 份：$${fr(n, d)} = ${fr(n * k, d * k)}$。`,
            ),
          }),
          figure: twoBarsFigure(d, n, d * k, 0),
        };
      },
    },
    {
      id: "equivalent-fractions-from-grids",
      title: t("Cutting a rectangle into rows", "把长方形再分成几行"),
      explanation: t(
        "A rectangle with $2$ of $3$ columns shaded, cut into $4$ rows: $8$ of the $12$ small rectangles are shaded, so $\\frac{2}{3} = \\frac{8}{12}$.",
        "长方形 $3$ 列中涂色 $2$ 列，再分成 $4$ 行：$12$ 个小长方形中有 $8$ 个涂色，所以 $\\frac{2}{3} = \\frac{8}{12}$。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 6);
        const k = rng.int(2, 5);
        const askNum = rng.bool();
        return {
          ...numberProblem({
            prompt: askNum
              ? t(
                  `The model shows $${fr(n, d)}$ cut into rows. Fill in the box: $$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`,
                  `模型表示 $${fr(n, d)}$，并被分成了几行。填空：$$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`,
                )
              : t(
                  `The model shows $${fr(n, d)}$ cut into rows. Fill in the box: $$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`,
                  `模型表示 $${fr(n, d)}$，并被分成了几行。填空：$$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`,
                ),
            answer: askNum ? n * k : d * k,
            form: "integer",
            wrong: askNum ? [n + k, n * d, d * k - n * k] : [d + k, d * k + n, n * k + d],
            solution: t(
              `There are $${d} \\times ${k} = ${d * k}$ small rectangles, and $${n} \\times ${k} = ${n * k}$ are shaded: $${fr(n, d)} = ${fr(n * k, d * k)}$.`,
              `一共有 $${d} \\times ${k} = ${d * k}$ 个小长方形，其中 $${n} \\times ${k} = ${n * k}$ 个涂色：$${fr(n, d)} = ${fr(n * k, d * k)}$。`,
            ),
          }),
          figure: gridFigure(n, d, k),
        };
      },
    },
  ],
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
    {
      id: "scaling-up-numerator-and-denominator",
      title: t("Multiplying both parts", "分子分母同乘一个数"),
      explanation: t(
        "Multiplying the numerator and the denominator by the same number gives an equal fraction: each part is cut into that many smaller parts. First find what the old denominator was multiplied by, then multiply the numerator by the same number.\n\n$\\frac{2}{7} = \\frac{\\square}{35}$: $35 = 7 \\times 5$, so multiply the numerator by $5$ too: $\\frac{10}{35}$.",
        "分子和分母同时乘同一个数，分数的大小不变：相当于把每一份再平均分成几份。先看分母乘了几，再把分子也乘同一个数。\n\n$\\frac{2}{7} = \\frac{\\square}{35}$：$35 = 7 \\times 5$，所以分子也乘 $5$：$\\frac{10}{35}$。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12);
        const k = rng.int(2, 10);
        const askNum = rng.bool(0.7);
        return numberProblem({
          prompt: askNum
            ? t(`Fill in the box: $$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`, `填空：$$${fr(n, d)} = \\frac{\\square}{${d * k}}$$`)
            : t(`Fill in the box: $$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`, `填空：$$${fr(n, d)} = \\frac{${n * k}}{\\square}$$`),
          answer: askNum ? n * k : d * k,
          form: "integer",
          wrong: askNum ? [n + d * k - d, n * d, d * k - n] : [d + n * k - n, n * k * d, n * k + d],
          solution: t(
            `Both parts are multiplied by $${k}$: $${fr(n, d)} = ${fr(`${n} \\times ${k}`, `${d} \\times ${k}`)} = ${fr(n * k, d * k)}$.`,
            `分子分母同乘 $${k}$：$${fr(n, d)} = ${fr(`${n} \\times ${k}`, `${d} \\times ${k}`)} = ${fr(n * k, d * k)}$。`,
          ),
        });
      },
    },
    {
      id: "scaling-down-numerator-and-denominator",
      title: t("Dividing both parts", "分子分母同除以一个数"),
      explanation: t(
        "Dividing the numerator and the denominator by the same number also gives an equal fraction. Find what the denominator was divided by, then divide the numerator by the same number, not subtract.\n\n$\\frac{24}{30} = \\frac{\\square}{5}$: $30 \\div 6 = 5$, so divide the numerator by $6$ too: $\\frac{4}{5}$.",
        "分子和分母同时除以同一个数，分数的大小也不变。先看分母除以了几，再把分子也除以同一个数，不能用减法。\n\n$\\frac{24}{30} = \\frac{\\square}{5}$：$30 \\div 6 = 5$，所以分子也除以 $6$：$\\frac{4}{5}$。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12);
        const k = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `Fill in the box: $$${fr(n * k, d * k)} = \\frac{\\square}{${d}}$$`,
            `填空：$$${fr(n * k, d * k)} = \\frac{\\square}{${d}}$$`,
          ),
          answer: n,
          form: "integer",
          wrong: [n * k - d * k + d, n * k, n + 1].filter((w) => w > 0 && w !== n),
          solution: t(
            `$${d * k} \\div ${k} = ${d}$, so $${n * k} \\div ${k} = ${n}$: $${fr(n * k, d * k)} = ${fr(n, d)}$.`,
            `$${d * k} \\div ${k} = ${d}$，所以 $${n * k} \\div ${k} = ${n}$：$${fr(n * k, d * k)} = ${fr(n, d)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "finding-least-common-denominators",
      title: t("Finding the least common denominator", "求最小公分母"),
      explanation: t(
        "For $\\frac{1}{6}$ and $\\frac{3}{8}$: multiples of $8$ are $8, 16, 24, \\dots$, and $24$ is the first that $6$ divides. So the LCD is $24$.",
        "对于 $\\frac{1}{6}$ 和 $\\frac{3}{8}$：$8$ 的倍数有 $8, 16, 24, \\dots$，第一个能被 $6$ 整除的是 $24$。所以最小公分母是 $24$。",
      ),
      generate(rng) {
        let b: number;
        let d: number;
        do {
          b = rng.int(2, 12);
          d = rng.int(2, 12);
        } while (b === d || lcm(b, d) > 60);
        const [a, c] = [coprimeTo(rng, b, 1, b - 1), coprimeTo(rng, d, 1, d - 1)];
        const l = lcm(b, d);
        return numberProblem({
          prompt: t(
            `Find the least common denominator of $${fr(a, b)}$ and $${fr(c, d)}$.`,
            `求 $${fr(a, b)}$ 和 $${fr(c, d)}$ 的最小公分母。`,
          ),
          answer: l,
          form: "integer",
          wrong: [b * d, Math.max(b, d), b + d],
          solution: t(`The least common multiple of $${b}$ and $${d}$ is $${l}$.`, `$${b}$ 和 $${d}$ 的最小公倍数是 $${l}$。`),
        });
      },
    },
    {
      id: "rewriting-with-the-least-common-denominator",
      title: t("Rewriting with the LCD", "化成以最小公分母为分母的分数"),
      explanation: t(
        "To rewrite a fraction with the least common denominator, find what its denominator must be multiplied by to reach the LCD, and multiply the numerator by the same number.\n\nWith the LCD $24$: $8 \\times 3 = 24$, so $\\frac{3}{8} = \\frac{3 \\times 3}{8 \\times 3} = \\frac{9}{24}$.",
        "把一个分数改写成以最小公分母为分母的分数，先看它的分母乘几得到最小公分母，再把分子乘同一个数。\n\n以最小公分母 $24$ 为分母：$8 \\times 3 = 24$，所以 $\\frac{3}{8} = \\frac{3 \\times 3}{8 \\times 3} = \\frac{9}{24}$。",
      ),
      generate(rng) {
        let b: number;
        let d: number;
        do {
          b = rng.int(2, 12);
          d = rng.int(2, 12);
        } while (b === d || lcm(b, d) > 60 || lcm(b, d) === b);
        const [a, c] = [coprimeTo(rng, b, 1, b - 1), coprimeTo(rng, d, 1, d - 1)];
        const l = lcm(b, d);
        return numberProblem({
          prompt: t(
            `Rewrite $${fr(a, b)}$ with the least common denominator of $${fr(a, b)}$ and $${fr(c, d)}$: $$${fr(a, b)} = \\frac{\\square}{${l}}$$`,
            `用 $${fr(a, b)}$ 和 $${fr(c, d)}$ 的最小公分母改写 $${fr(a, b)}$：$$${fr(a, b)} = \\frac{\\square}{${l}}$$`,
          ),
          answer: (a * l) / b,
          form: "integer",
          wrong: [a + l - b, a * d, (c * l) / d],
          solution: t(
            `$${l} = ${b} \\times ${l / b}$, so $${fr(a, b)} = ${fr(a * (l / b), l)}$.`,
            `$${l} = ${b} \\times ${l / b}$，所以 $${fr(a, b)} = ${fr(a * (l / b), l)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "simplifying-by-the-greatest-common-factor",
      title: t("Dividing by the greatest common factor", "除以最大公因数"),
      explanation: t(
        "A fraction is in lowest terms when the numerator and the denominator have no common factor other than $1$. Divide both by their greatest common factor to get there in one step.\n\n$\\frac{20}{30}$: the GCF of $20$ and $30$ is $10$, so $\\frac{20}{30} = \\frac{20 \\div 10}{30 \\div 10} = \\frac{2}{3}$. Dividing by a smaller common factor, such as $2$, leaves a fraction that can still be simplified.",
        "分子和分母除了 $1$ 以外没有公因数时，分数就是最简分数。用它们的最大公因数同时去除，一步就能化成最简分数。\n\n$\\frac{20}{30}$：$20$ 和 $30$ 的最大公因数是 $10$，所以 $\\frac{20}{30} = \\frac{20 \\div 10}{30 \\div 10} = \\frac{2}{3}$。如果只除以较小的公因数，比如 $2$，得到的分数还能继续约分。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 12);
        const k = rng.int(2, 9);
        const small = [2, 3, 5].find((p) => k % p === 0 && k !== p);
        return numberProblem({
          prompt: t(`Write $${fr(n * k, d * k)}$ in lowest terms.`, `把 $${fr(n * k, d * k)}$ 化成最简分数。`),
          answer: qf(n, d),
          form: "fraction",
          wrong: [qf(n * (small ? k / small : 1) + 1, d * (small ? k / small : 1)), qf(n + 1, d), qf(d, n)],
          solution: t(
            `The greatest common factor of $${n * k}$ and $${d * k}$ is $${k}$: $$${fr(n * k, d * k)} = ${fr(`${n * k} \\div ${k}`, `${d * k} \\div ${k}`)} = ${fr(n, d)}$$`,
            `$${n * k}$ 和 $${d * k}$ 的最大公因数是 $${k}$：$$${fr(n * k, d * k)} = ${fr(`${n * k} \\div ${k}`, `${d * k} \\div ${k}`)} = ${fr(n, d)}$$`,
          ),
        });
      },
    },
    {
      id: "recognizing-lowest-terms",
      title: t("Which fraction is in lowest terms?", "哪个是最简分数"),
      explanation: t(
        "To check whether a fraction is in lowest terms, look for a number other than $1$ that divides both the numerator and the denominator. If there is none, the fraction is in lowest terms.\n\n$\\frac{9}{14}$ is in lowest terms: $9 = 3 \\times 3$ and $14 = 2 \\times 7$ share no factor. $\\frac{9}{15}$ is not: both are multiples of $3$.",
        "判断一个分数是不是最简分数，就看有没有除 $1$ 以外的数能同时整除分子和分母。如果没有，就是最简分数。\n\n$\\frac{9}{14}$ 是最简分数：$9 = 3 \\times 3$，$14 = 2 \\times 7$，没有公因数。$\\frac{9}{15}$ 不是：两个数都是 $3$ 的倍数。",
      ),
      generate(rng) {
        const [n, d] = properFraction(rng, 20, 5);
        const wrong: Text[] = [];
        while (wrong.length < 3) {
          const [m, e] = properFraction(rng, 10, 2);
          const k = rng.int(2, 4);
          const cand = mathText(fr(m * k, e * k));
          if (!wrong.some((w) => w.en === cand.en)) wrong.push(cand);
        }
        const all = [mathText(fr(n, d)), ...wrong]
          .map((w) => w.en)
          .sort()
          .join(", ");
        return pickChoice(
          rng,
          t(`Which of these fractions is in lowest terms: ${all}?`, `下列分数中哪个是最简分数：${all.replaceAll(", ", "、")}？`),
          mathText(fr(n, d)),
          wrong,
          t(
            `$${n}$ and $${d}$ have no common factor other than $1$, so $${fr(n, d)}$ is in lowest terms. Each of the others can be simplified.`,
            `$${n}$ 和 $${d}$ 除了 $1$ 没有其他公因数，所以 $${fr(n, d)}$ 是最简分数。其他几个都还能约分。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Comparing fractions

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
    {
      id: "comparing-fractions-with-like-denominators",
      title: t("The same denominator", "分母相同"),
      explanation: t(
        "When two fractions have the same denominator, their parts are the same size, so the fraction with more parts, the larger numerator, is greater.\n\n$\\frac{4}{9} < \\frac{7}{9}$: ninths of the same size, and $4 < 7$.",
        "两个分数的分母相同时，每一份一样大，所以份数多的，也就是分子大的分数大。\n\n$\\frac{4}{9} < \\frac{7}{9}$：每份都是九分之一，而 $4 < 7$。",
      ),
      generate(rng) {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 1);
        const b = rng.bool(0.15) ? a : rng.int(1, d - 1);
        return compareProblem(
          fr(a, d),
          fr(b, d),
          relation(qf(a, d), qf(b, d)),
          a === b
            ? t("The fractions are the same.", "两个分数相同。")
            : t(
                `Both count parts of size $${fr(1, d)}$, and $${a} ${a < b ? "<" : ">"} ${b}$.`,
                `每份都是 $${fr(1, d)}$，而 $${a} ${a < b ? "<" : ">"} ${b}$。`,
              ),
        );
      },
    },
    {
      id: "comparing-fractions-with-like-numerators",
      title: t("The same numerator", "分子相同"),
      explanation: t(
        "When two fractions have the same numerator, they have the same number of parts. Cutting a whole into more parts makes each part smaller, so the fraction with the smaller denominator is greater.\n\n$\\frac{2}{3} > \\frac{2}{7}$: both have $2$ parts, but a third is larger than a seventh. Do not choose the larger denominator.",
        "两个分数的分子相同时，份数一样多。一个整体分的份数越多，每一份就越小，所以分母小的分数反而大。\n\n$\\frac{2}{3} > \\frac{2}{7}$：都是 $2$ 份，但三分之一比七分之一大。不要以为分母大的分数就大。",
      ),
      generate(rng) {
        const n = rng.int(1, 7);
        let b: number;
        let d: number;
        do {
          b = rng.int(n + 1, 15);
          d = rng.int(n + 1, 15);
        } while (b === d);
        return compareProblem(
          fr(n, b),
          fr(n, d),
          relation(qf(n, b), qf(n, d)),
          t(
            `Both have $${n}$ parts. Parts of size $${fr(1, Math.min(b, d))}$ are larger than parts of size $${fr(1, Math.max(b, d))}$, so $${fr(n, b)} ${b < d ? ">" : "<"} ${fr(n, d)}$.`,
            `份数都是 $${n}$。$${fr(1, Math.min(b, d))}$ 比 $${fr(1, Math.max(b, d))}$ 大，所以 $${fr(n, b)} ${b < d ? ">" : "<"} ${fr(n, d)}$。`,
          ),
        );
      },
    },
  ],
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
    {
      id: "comparing-across-one",
      title: t("One on each side of 1", "分别在 1 的两侧"),
      explanation: t(
        "A fraction is less than $1$ when its numerator is less than its denominator, and greater than $1$ when its numerator is greater. If one fraction is below $1$ and the other above, the comparison is done without any more work.\n\n$\\frac{11}{12} < 1$ and $\\frac{5}{4} > 1$, so $\\frac{11}{12} < \\frac{5}{4}$.",
        "分子小于分母的分数小于 $1$，分子大于分母的分数大于 $1$。如果一个分数小于 $1$，另一个大于 $1$，不用再算就能比出大小。\n\n$\\frac{11}{12} < 1$，$\\frac{5}{4} > 1$，所以 $\\frac{11}{12} < \\frac{5}{4}$。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 15, 3);
        const [c, d] = improperFraction(rng, 12, 2);
        const first = rng.bool();
        const [x, y] = first ? [fr(a, b), fr(c, d)] : [fr(c, d), fr(a, b)];
        return compareProblem(
          x,
          y,
          first ? 0 : 2,
          t(
            `$${fr(a, b)} < 1$ because $${a} < ${b}$, and $${fr(c, d)} > 1$ because $${c} > ${d}$. So $${x} ${first ? "<" : ">"} ${y}$.`,
            `$${fr(a, b)} < 1$，因为 $${a} < ${b}$；$${fr(c, d)} > 1$，因为 $${c} > ${d}$。所以 $${x} ${first ? "<" : ">"} ${y}$。`,
          ),
        );
      },
    },
    {
      id: "distance-from-one",
      title: t("Just below 1", "略小于 1"),
      explanation: t(
        "When both fractions are just below $1$, compare how much each is missing from $1$. The fraction that is missing less is closer to $1$, so it is greater.\n\n$\\frac{7}{8}$ is $\\frac{1}{8}$ below $1$ and $\\frac{5}{6}$ is $\\frac{1}{6}$ below $1$. Since $\\frac{1}{8} < \\frac{1}{6}$, $\\frac{7}{8}$ is closer to $1$: $\\frac{7}{8} > \\frac{5}{6}$.",
        "两个分数都略小于 $1$ 时，比较它们各自比 $1$ 少多少。少得越少，就越接近 $1$，这个分数就越大。\n\n$\\frac{7}{8}$ 比 $1$ 少 $\\frac{1}{8}$，$\\frac{5}{6}$ 比 $1$ 少 $\\frac{1}{6}$。因为 $\\frac{1}{8} < \\frac{1}{6}$，$\\frac{7}{8}$ 更接近 $1$：$\\frac{7}{8} > \\frac{5}{6}$。",
      ),
      generate(rng) {
        let b: number;
        let d: number;
        do {
          b = rng.int(3, 15);
          d = rng.int(3, 15);
        } while (b === d);
        return compareProblem(
          fr(b - 1, b),
          fr(d - 1, d),
          b < d ? 0 : 2,
          t(
            `$${fr(b - 1, b)}$ is $${fr(1, b)}$ less than $1$ and $${fr(d - 1, d)}$ is $${fr(1, d)}$ less than $1$. The one missing the smaller piece is greater: $${fr(b - 1, b)} ${b < d ? "<" : ">"} ${fr(d - 1, d)}$.`,
            `$${fr(b - 1, b)}$ 比 $1$ 少 $${fr(1, b)}$，$${fr(d - 1, d)}$ 比 $1$ 少 $${fr(1, d)}$。少得越少的越大：$${fr(b - 1, b)} ${b < d ? "<" : ">"} ${fr(d - 1, d)}$。`,
          ),
        );
      },
    },
  ],
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
    {
      id: "comparing-with-one-half",
      title: t("Compared with one half", "与二分之一比较"),
      explanation: t(
        "To compare a fraction with $\\frac{1}{2}$, find half of the denominator. If the numerator is less than that, the fraction is less than one half; if it is more, the fraction is greater.\n\n$\\frac{4}{9}$: half of $9$ is $4\\frac{1}{2}$, and $4$ is less, so $\\frac{4}{9} < \\frac{1}{2}$.",
        "把一个分数和 $\\frac{1}{2}$ 比较，先求出分母的一半。分子比它小，分数就小于二分之一；分子比它大，分数就大于二分之一。\n\n$\\frac{4}{9}$：$9$ 的一半是 $4\\frac{1}{2}$，$4$ 比它小，所以 $\\frac{4}{9} < \\frac{1}{2}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 20);
        const n = rng.int(1, d - 1);
        const rel = relation(qf(n, d), qf(1, 2));
        return compareProblem(
          fr(n, d),
          fr(1, 2),
          rel,
          t(
            `Half of $${d}$ is $${d % 2 === 0 ? d / 2 : mx((d - 1) / 2, 1, 2)}$, and the numerator $${n}$ is ${["less", "equal to it", "more"][rel]}: $${fr(n, d)} ${symbols[rel]} ${fr(1, 2)}$.`,
            `$${d}$ 的一半是 $${d % 2 === 0 ? d / 2 : mx((d - 1) / 2, 1, 2)}$，分子 $${n}$ ${["比它小", "与它相等", "比它大"][rel]}：$${fr(n, d)} ${symbols[rel]} ${fr(1, 2)}$。`,
          ),
        );
      },
    },
    {
      id: "comparing-two-fractions-across-one-half",
      title: t("One on each side of one half", "分别在 1/2 的两侧"),
      explanation: t(
        "Compare each fraction with $\\frac{1}{2}$ by checking whether its numerator is less or more than half its denominator. If one fraction is below one half and the other above, the one above is greater.\n\n$\\frac{3}{8} < \\frac{1}{2}$ and $\\frac{4}{7} > \\frac{1}{2}$, so $\\frac{3}{8} < \\frac{4}{7}$.",
        "看每个分数的分子比分母的一半小还是大，把它和 $\\frac{1}{2}$ 比较。如果一个小于二分之一，另一个大于二分之一，大于二分之一的那个就大。\n\n$\\frac{3}{8} < \\frac{1}{2}$，$\\frac{4}{7} > \\frac{1}{2}$，所以 $\\frac{3}{8} < \\frac{4}{7}$。",
      ),
      generate(rng) {
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
        return compareProblem(
          x,
          y,
          first ? 0 : 2,
          t(
            `$${fr(a, b)} < ${fr(1, 2)}$ and $${fr(c, d)} > ${fr(1, 2)}$, so $${x} ${first ? "<" : ">"} ${y}$.`,
            `$${fr(a, b)} < ${fr(1, 2)}$，$${fr(c, d)} > ${fr(1, 2)}$，所以 $${x} ${first ? "<" : ">"} ${y}$。`,
          ),
        );
      },
    },
  ],
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
    {
      id: "comparing-two-bar-models",
      title: t("Comparing two bars", "比较两个长条"),
      explanation: t(
        "Two bar models are easy to compare once their parts are the same size. Cut the larger parts of one bar into smaller pieces until they match the other bar, then compare the numbers of shaded parts.\n\nThe bars show $\\frac{3}{4}$ and $\\frac{5}{8}$. Cutting each fourth in two gives $\\frac{6}{8}$, so $\\frac{3}{4} > \\frac{5}{8}$.",
        "两个长条模型的每份大小相同时，比较起来就很容易。把一个长条中较大的份再分成小份，使它与另一个长条的份一样大，再比较涂色的份数。\n\n两个长条分别表示 $\\frac{3}{4}$ 和 $\\frac{5}{8}$。把每个四分之一再分成两份得到 $\\frac{6}{8}$，所以 $\\frac{3}{4} > \\frac{5}{8}$。",
      ),
      generate(rng) {
        const { a, b, c, d, k } = multiplePair(rng);
        const rel = relation(qf(a, b), qf(c, d));
        return compareProblem(
          fr(a, b),
          fr(c, d),
          rel,
          t(
            `$${fr(a, b)} = ${fr(a * k, d)}$, and $${a * k} ${symbols[rel]} ${c}$, so $${fr(a, b)} ${symbols[rel]} ${fr(c, d)}$.`,
            `$${fr(a, b)} = ${fr(a * k, d)}$，而 $${a * k} ${symbols[rel]} ${c}$，所以 $${fr(a, b)} ${symbols[rel]} ${fr(c, d)}$。`,
          ),
          twoBarsFigure(b, a, d, c),
        );
      },
    },
    {
      id: "rewriting-a-model-with-smaller-parts",
      title: t("Making the parts the same size", "使每份一样大"),
      explanation: t(
        "To rewrite a model with smaller parts, find how many small parts fit in one large part. Multiply both the numerator and the denominator by that number.\n\nTo compare $\\frac{2}{5}$ with tenths: each fifth is $2$ tenths, so $\\frac{2}{5} = \\frac{4}{10}$.",
        "要把模型改成更小的份，先看一个大份里有几个小份，再把分子和分母都乘这个数。\n\n要把 $\\frac{2}{5}$ 与十分之几比较：每个五分之一是 $2$ 个十分之一，所以 $\\frac{2}{5} = \\frac{4}{10}$。",
      ),
      generate(rng) {
        const { a, b, c, d, k } = multiplePair(rng);
        return {
          ...numberProblem({
            prompt: t(
              `The bars show $${fr(a, b)}$ and $${fr(c, d)}$. Rewrite the first with the denominator of the second: $$${fr(a, b)} = \\frac{\\square}{${d}}$$`,
              `两个长条分别表示 $${fr(a, b)}$ 和 $${fr(c, d)}$。把第一个分数改写成与第二个同分母：$$${fr(a, b)} = \\frac{\\square}{${d}}$$`,
            ),
            answer: a * k,
            form: "integer",
            wrong: [a + d - b, c, a * d],
            solution: t(
              `$${d} = ${b} \\times ${k}$, so $${fr(a, b)} = ${fr(a * k, d)}$.`,
              `$${d} = ${b} \\times ${k}$，所以 $${fr(a, b)} = ${fr(a * k, d)}$。`,
            ),
          }),
          figure: twoBarsFigure(b, a, d, c),
        };
      },
    },
  ],
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
    {
      id: "comparing-two-fractions-with-unlike-denominators",
      title: t("Two fractions", "比较两个分数"),
      explanation: t(
        "To compare fractions with different denominators, rewrite them with a common denominator, a common multiple of both. Then the parts are the same size and you compare the numerators.\n\n$\\frac{5}{6}$ and $\\frac{7}{9}$: with denominator $18$ they are $\\frac{15}{18}$ and $\\frac{14}{18}$, so $\\frac{5}{6} > \\frac{7}{9}$.",
        "比较分母不同的分数，先通分，把它们化成分母相同的分数，公分母是两个分母的公倍数。这样每份一样大，再比较分子。\n\n$\\frac{5}{6}$ 和 $\\frac{7}{9}$：通分为 $\\frac{15}{18}$ 和 $\\frac{14}{18}$，所以 $\\frac{5}{6} > \\frac{7}{9}$。",
      ),
      generate(rng) {
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
        return compareProblem(
          fr(a, b),
          fr(c, d),
          rel,
          t(
            `With the common denominator $${l}$: $${fr(a, b)} = ${fr((a * l) / b, l)}$ and $${fr(c, d)} = ${fr((c * l) / d, l)}$. So $${fr(a, b)} ${symbols[rel]} ${fr(c, d)}$.`,
            `通分为以 $${l}$ 为分母：$${fr(a, b)} = ${fr((a * l) / b, l)}$，$${fr(c, d)} = ${fr((c * l) / d, l)}$。所以 $${fr(a, b)} ${symbols[rel]} ${fr(c, d)}$。`,
          ),
        );
      },
    },
    {
      id: "ordering-three-fractions",
      title: t("The greatest of three fractions", "三个分数中最大的"),
      explanation: t(
        "With three fractions, choose a denominator that all three denominators divide into, rewrite every fraction with it, and compare the numerators.\n\n$\\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}$ with denominator $12$ are $\\frac{6}{12}, \\frac{8}{12}, \\frac{9}{12}$; the greatest is $\\frac{3}{4}$.",
        "比较三个分数，选一个三个分母都能整除的数作公分母，把每个分数都化成这个分母，再比较分子。\n\n$\\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}$ 通分为 $\\frac{6}{12}, \\frac{8}{12}, \\frac{9}{12}$；最大的是 $\\frac{3}{4}$。",
      ),
      generate(rng) {
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
          const list = fs.map(([n, d]) => `${fr(n, d)}`).join(",\\ ");
          return pickChoice(
            rng,
            asc
              ? t(`Which is the least: $${list}$?`, `$${list}$ 中哪个最小？`)
              : t(`Which is the greatest: $${list}$?`, `$${list}$ 中哪个最大？`),
            mathText(fr(bn, bd)),
            fs.filter((_, i) => i !== best).map(([n, d]) => mathText(fr(n, d))),
            t(
              `With the common denominator $${l}$ they are $${vals.map((v) => fr(v, l)).join(",\\ ")}$, so the answer is $${fr(bn, bd)}$.`,
              `通分为以 $${l}$ 为分母：$${vals.map((v) => fr(v, l)).join(",\\ ")}$，所以答案是 $${fr(bn, bd)}$。`,
            ),
          );
        }
      },
    },
  ],
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
    {
      id: "adding-with-bar-models",
      title: t("Joining shaded parts", "合并涂色部分"),
      explanation: t(
        "Adding fractions with the same denominator joins parts of the same size. Count all the shaded parts; the size of each part, the denominator, does not change.\n\nThe bar shows $\\frac{2}{7}$ and then $\\frac{3}{7}$ more: $5$ parts of $7$ are shaded, so $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$, not $\\frac{5}{14}$.",
        "同分母分数相加，是把同样大小的份合在一起。数出所有涂色的份数；每份的大小，也就是分母，不变。\n\n长条先涂 $\\frac{2}{7}$，再涂 $\\frac{3}{7}$：$7$ 份中共涂了 $5$ 份，所以 $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$，而不是 $\\frac{5}{14}$。",
      ),
      generate(rng) {
        const [a, b, d] = likeSum(rng, 1);
        return {
          ...numberProblem({
            prompt: t(`The model shows $${fr(a, d)} + ${fr(b, d)}$. Find the sum.`, `模型表示 $${fr(a, d)} + ${fr(b, d)}$。求和。`),
            answer: qf(a + b, d),
            form: "fraction",
            wrong: [qf(a + b, 2 * d), qf(a * b, d), qf(a + b, d + d)],
            solution: t(
              `$${a} + ${b} = ${a + b}$ parts of size $${fr(1, d)}$: $${fr(a + b, d)}$.`,
              `一共 $${a} + ${b} = ${a + b}$ 个 $${fr(1, d)}$：$${fr(a + b, d)}$。`,
            ),
          }),
          figure: barFigure(d, a + b),
        };
      },
    },
    {
      id: "counting-unit-fractions-in-a-sum",
      title: t("Counting unit fractions", "数单位分数"),
      explanation: t(
        "Think of each fraction as a count of unit fractions. Adding fractions with the same denominator adds the counts, and the unit stays the same.\n\n$\\frac{3}{8} + \\frac{4}{8}$ is $3$ eighths and $4$ eighths: $7$ eighths, or $\\frac{7}{8}$.",
        "把每个分数看作几个分数单位。同分母分数相加，就是把分数单位的个数相加，分数单位不变。\n\n$\\frac{3}{8} + \\frac{4}{8}$ 是 $3$ 个八分之一加 $4$ 个八分之一：$7$ 个八分之一，即 $\\frac{7}{8}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 2);
        const b = rng.int(1, d - 1 - a);
        return numberProblem({
          prompt: t(
            `Fill in the box: $$${fr(a, d)} + ${fr(b, d)} = \\frac{\\square}{${d}}$$`,
            `填空：$$${fr(a, d)} + ${fr(b, d)} = \\frac{\\square}{${d}}$$`,
          ),
          answer: a + b,
          form: "integer",
          wrong: [a * b, a + b + 1, 2 * d - a - b],
          solution: t(
            `$${a}$ parts of size $${fr(1, d)}$ and $${b}$ more make $${a + b}$.`,
            `$${a}$ 个 $${fr(1, d)}$ 加 $${b}$ 个 $${fr(1, d)}$ 是 $${a + b}$ 个。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "adding-two-fractions-with-like-denominators",
      title: t("Two fractions", "两个分数相加"),
      explanation: t(
        "$\\frac{5}{9} + \\frac{7}{9} = \\frac{12}{9}$, which simplifies to $\\frac{4}{3}$. Add the numerators and keep the denominator, then write the result in lowest terms.",
        "$\\frac{5}{9} + \\frac{7}{9} = \\frac{12}{9} = \\frac{4}{3}$。分子相加、分母不变，再化成最简分数。",
      ),
      generate(rng) {
        const [a, b, d] = likeSum(rng, 2);
        return numberProblem({
          prompt: t(`Find $${fr(a, d)} + ${fr(b, d)}$.`, `计算 $${fr(a, d)} + ${fr(b, d)}$。`),
          answer: qf(a + b, d),
          form: "fraction",
          wrong: [qf(a + b, 2 * d), qf(a * b, d), qf(a + b + 1, d)],
          solution: t(
            `$${fr(a, d)} + ${fr(b, d)} = ${fr(`${a} + ${b}`, d)} = ${fr(a + b, d)}$.`,
            `$${fr(a, d)} + ${fr(b, d)} = ${fr(`${a} + ${b}`, d)} = ${fr(a + b, d)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-three-fractions-with-like-denominators",
      title: t("Three fractions", "三个分数相加"),
      explanation: t(
        "To add fractions with the same denominator, add the numerators and keep the denominator. This works for any number of fractions. Simplify or write a mixed number if the answer allows it.\n\n$\\frac{1}{8} + \\frac{2}{8} + \\frac{4}{8} = \\frac{1 + 2 + 4}{8} = \\frac{7}{8}$.",
        "同分母分数相加，分母不变，分子相加。几个分数相加也是这样。如果结果能约分或化成带分数，就继续化简。\n\n$\\frac{1}{8} + \\frac{2}{8} + \\frac{4}{8} = \\frac{1 + 2 + 4}{8} = \\frac{7}{8}$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(4, 15);
          const [a, b, c] = [rng.int(1, d - 1), rng.int(1, d - 1), rng.int(1, d - 1)];
          const s = a + b + c;
          if (s >= 2 * d || gcd(s, d) !== 1) continue;
          return numberProblem({
            prompt: t(`Find $${fr(a, d)} + ${fr(b, d)} + ${fr(c, d)}$.`, `计算 $${fr(a, d)} + ${fr(b, d)} + ${fr(c, d)}$。`),
            answer: qf(s, d),
            form: "fraction",
            wrong: [qf(s, 3 * d), qf(a + b, d), qf(s + 1, d)],
            solution: t(
              `Add the numerators: $${a} + ${b} + ${c} = ${s}$, so the sum is $${fr(s, d)}$.`,
              `分子相加：$${a} + ${b} + ${c} = ${s}$，所以和是 $${fr(s, d)}$。`,
            ),
          });
        }
      },
    },
  ],
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
    {
      id: "subtracting-two-fractions-with-like-denominators",
      title: t("Two fractions", "两个分数相减"),
      explanation: t(
        "To subtract fractions with the same denominator, subtract the numerators and keep the denominator: you are taking away parts of the same size.\n\n$\\frac{11}{12} - \\frac{4}{12} = \\frac{11 - 4}{12} = \\frac{7}{12}$. Subtracting the denominators too would give $\\frac{7}{0}$, which makes no sense.",
        "同分母分数相减，分母不变，分子相减：拿走的是同样大小的份。\n\n$\\frac{11}{12} - \\frac{4}{12} = \\frac{11 - 4}{12} = \\frac{7}{12}$。如果分母也相减，会得到 $\\frac{7}{0}$，这是没有意义的。",
      ),
      generate(rng) {
        const [a, b, d] = likeDifference(rng, 15);
        return numberProblem({
          prompt: t(`Find $${fr(a, d)} - ${fr(b, d)}$.`, `计算 $${fr(a, d)} - ${fr(b, d)}$。`),
          answer: qf(a - b, d),
          form: "fraction",
          wrong: [qf(a + b, d), qf(a - b + 1, d), qf(a - b, 2 * d)],
          solution: t(
            `$${fr(a, d)} - ${fr(b, d)} = ${fr(`${a} - ${b}`, d)} = ${fr(a - b, d)}$.`,
            `$${fr(a, d)} - ${fr(b, d)} = ${fr(`${a} - ${b}`, d)} = ${fr(a - b, d)}$。`,
          ),
        });
      },
    },
    {
      id: "subtracting-fractions-from-wholes",
      title: t("Subtracting from a whole number", "从整数中减去分数"),
      explanation: t(
        "To subtract a fraction from a whole number, first write the whole number as a fraction with the same denominator: each whole is that many parts. Then subtract the numerators.\n\n$2 - \\frac{3}{5} = \\frac{10}{5} - \\frac{3}{5} = \\frac{7}{5}$, since $2$ wholes are $10$ fifths.",
        "用整数减分数，先把整数写成分母相同的分数：每个整体就是那么多份。再把分子相减。\n\n$2 - \\frac{3}{5} = \\frac{10}{5} - \\frac{3}{5} = \\frac{7}{5}$，因为 $2$ 个整体是 $10$ 个五分之一。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const w = rng.int(1, 3);
        const b = coprimeTo(rng, d, 1, d - 1);
        return numberProblem({
          prompt: t(`Find $${w} - ${fr(b, d)}$. Give the answer as a fraction.`, `计算 $${w} - ${fr(b, d)}$，答案写成分数。`),
          answer: qf(w * d - b, d),
          form: "fraction",
          wrong: [qf(Math.abs(w * d - b - d) || 1, d), qf(d - b, d), qf(w * d + b, d)],
          solution: t(
            `$${w} = ${fr(w * d, d)}$, so $${w} - ${fr(b, d)} = ${fr(w * d - b, d)}$.`,
            `$${w} = ${fr(w * d, d)}$，所以 $${w} - ${fr(b, d)} = ${fr(w * d - b, d)}$。`,
          ),
        });
      },
    },
  ],
);

/** fractionWordKP builds a word-problem knowledge point for adding or subtracting fractions with like denominators. */
function fractionWordKP(id: string, subtract: boolean, k: number): KnowledgePointDef {
  return {
    id,
    title: k === 0 ? t("Measured amounts", "度量的数量") : t("Parts of a whole", "整体的一部分"),
    explanation:
      k === 1
        ? subtract
          ? t(
              'When a story starts with part of one whole, such as a pan or a fence, and some of it is given away or used, the question "what fraction is left" asks for a difference. Both fractions name parts of the same whole, so subtract the numerators and keep the denominator.\n\n$\\frac{5}{6}$ of a pan of brownies, $\\frac{2}{6}$ of the pan given away: $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$ of the pan is left.',
              '故事从同一个整体（比如一盘点心、一段栅栏）的一部分开始，送掉或用掉其中一些，问"还剩几分之几"，求的是差。两个分数都是同一个整体的几分之几，所以分母不变，分子相减。\n\n一盘布朗尼还剩 $\\frac{5}{6}$，送掉这盘的 $\\frac{2}{6}$：还剩这盘的 $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$。',
            )
          : t(
              "When two parts of the same whole, such as a fence or a garden, are finished at different times, the fraction of the whole that is done is their sum. Add the numerators, keep the denominator, and check that the answer is not more than one whole.\n\n$\\frac{2}{9}$ of a fence on Monday and $\\frac{4}{9}$ on Tuesday: $\\frac{2}{9} + \\frac{4}{9} = \\frac{6}{9} = \\frac{2}{3}$ of the fence is painted.",
              "同一个整体（比如一段栅栏、一块菜地）的两部分分两次完成，完成的总量是两部分的和。分母不变，分子相加，并检查结果不超过一个整体。\n\n星期一刷了栅栏的 $\\frac{2}{9}$，星期二刷了 $\\frac{4}{9}$：一共刷了 $\\frac{2}{9} + \\frac{4}{9} = \\frac{6}{9} = \\frac{2}{3}$。",
            )
        : subtract
          ? t(
              'Questions like "how much more" or "how much is left" ask for a difference. Subtract the smaller amount from the larger, keep the denominator, and simplify the answer.\n\n"How much more" asks for a difference: $\\frac{7}{8} - \\frac{3}{8} = \\frac{4}{8} = \\frac{1}{2}$.',
              '"多多少""还剩多少"这样的问题求的是差。用较大的量减去较小的量，分母不变，再把结果化简。\n\n"多多少"求的是差：$\\frac{7}{8} - \\frac{3}{8} = \\frac{4}{8} = \\frac{1}{2}$。',
            )
          : t(
              'In a word problem, decide first which operation the question asks for. Words like "in all" or "altogether" ask for a sum, so add the fractions: add the numerators and keep the denominator.\n\n"In all" asks for a sum: $\\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}$.',
              '解应用题，先判断问题要求用哪种运算。"一共""总共"求的是和，所以把分数相加：分母不变，分子相加。\n\n"一共"求的是和：$\\frac{3}{10} + \\frac{4}{10} = \\frac{7}{10}$。',
            ),
    generate(rng) {
      const name = rng.pick(names);
      const [a, b, d] = subtract ? likeDifference(rng, 12) : likeSum(rng, k === 0 ? 2 : 1);
      const value = subtract ? qf(a - b, d) : qf(a + b, d);
      const wrong = subtract ? [qf(a + b, d), qf(a - b, 2 * d)] : [qf(a + b, 2 * d), qf(Math.abs(a - b) || 1, d)];
      const op = subtract ? "-" : "+";
      const solution = t(`$${fr(a, d)} ${op} ${fr(b, d)} = ${value.toLatex()}$.`, `$${fr(a, d)} ${op} ${fr(b, d)} = ${value.toLatex()}$。`);
      if (k === 0) {
        const am = rng.pick(amounts);
        const story = am.first(name, `$${fr(a, d)}$`);
        const more = am.second(name, `$${fr(b, d)}$`);
        return numberProblem({
          prompt: t(
            `${story.en} ${more.en} ${(subtract ? am.difference : am.together).en}`,
            `${story["zh-CN"]}，${more["zh-CN"]}${(subtract ? am.difference : am.together)["zh-CN"]}`,
          ),
          answer: value,
          form: "fraction",
          wrong,
          solution,
        });
      }
      const w = rng.pick(wholes);
      return numberProblem({
        prompt: subtract
          ? t(
              `${name} had $${fr(a, d)}$ of a ${w.en} and gave $${fr(b, d)}$ of the ${w.en} to a friend. What fraction of the ${w.en} does ${name} have left?`,
              `${name} 有一个${w.zh}的 $${fr(a, d)}$，送给朋友这个${w.zh}的 $${fr(b, d)}$。${name} 还剩这个${w.zh}的几分之几？`,
            )
          : t(
              `${name} painted $${fr(a, d)}$ of a fence on Monday and $${fr(b, d)}$ of it on Tuesday. What fraction of the fence has been painted?`,
              `${name} 星期一刷了栅栏的 $${fr(a, d)}$，星期二刷了 $${fr(b, d)}$。一共刷了栅栏的几分之几？`,
            ),
        answer: value,
        form: "fraction",
        wrong,
        solution,
      });
    },
  };
}

export const addingFractionsWithLikeDenominatorsWordProblems = topic(
  "adding-fractions-with-like-denominators-word-problems",
  t("Adding Fractions With Like Denominators: Word Problems", "同分母分数加法应用题"),
  t(
    "Word problems that join two amounts measured in the same fractional parts are solved by adding the fractions: walking 3/10 mile and then 4/10 mile is 7/10 mile in all.",
    "把两个以同样分数单位度量的量合在一起的应用题，用分数加法解决：先走 3/10 英里，再走 4/10 英里，一共走了 7/10 英里。",
  ),
  ["adding-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [fractionWordKP("adding-measured-fractions", false, 0), fractionWordKP("adding-parts-of-a-whole", false, 1)],
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
  [fractionWordKP("subtracting-measured-fractions", true, 0), fractionWordKP("subtracting-parts-of-a-whole", true, 1)],
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
    {
      id: "fractions-as-sums-of-unit-fractions",
      title: t("Sums of unit fractions", "单位分数的和"),
      explanation: t(
        "Any fraction is a sum of unit fractions: the numerator says how many copies of $1$ over the denominator to add.\n\n$\\frac{4}{7}$ is $4$ parts of size $\\frac{1}{7}$: $\\frac{4}{7} = \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7}$.",
        "任何分数都可以写成几个分数单位的和：分子表示有几个分数单位相加。\n\n$\\frac{4}{7}$ 是 $4$ 个 $\\frac{1}{7}$：$\\frac{4}{7} = \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7} + \\frac{1}{7}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.int(2, d - 1);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${fr(n, d)}$. How many copies of $${fr(1, d)}$ add up to $${fr(n, d)}$?`,
              `模型表示 $${fr(n, d)}$。几个 $${fr(1, d)}$ 相加等于 $${fr(n, d)}$？`,
            ),
            answer: n,
            form: "integer",
            wrong: [d, d - n, n + 1],
            solution: t(
              `$${n}$ parts are shaded, each $${fr(1, d)}$: $${n}$ copies.`,
              `涂色 $${n}$ 份，每份是 $${fr(1, d)}$：共 $${n}$ 个。`,
            ),
          }),
          figure: barFigure(d, n),
        };
      },
    },
    {
      id: "splitting-a-model-into-two-parts",
      title: t("Two groups of parts", "分成两组"),
      explanation: t(
        "The shaded parts of a model can be split into two groups. Both groups keep the same denominator, and their numerators add up to the original numerator.\n\n$\\frac{5}{8}$ split into $2$ parts and the rest: $5 - 2 = 3$, so $\\frac{5}{8} = \\frac{2}{8} + \\frac{3}{8}$.",
        "模型中涂色的份可以分成两组。两组的分母都不变，分子加起来等于原来的分子。\n\n把 $\\frac{5}{8}$ 分成 $2$ 份和剩下的部分：$5 - 2 = 3$，所以 $\\frac{5}{8} = \\frac{2}{8} + \\frac{3}{8}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.int(2, d - 1);
        const a = rng.int(1, n - 1);
        return {
          ...numberProblem({
            prompt: t(
              `Use the model to fill in the box: $$${fr(n, d)} = ${fr(a, d)} + \\frac{\\square}{${d}}$$`,
              `利用模型填空：$$${fr(n, d)} = ${fr(a, d)} + \\frac{\\square}{${d}}$$`,
            ),
            answer: n - a,
            form: "integer",
            wrong: [n + a, d - a, n],
            solution: t(
              `$${n} - ${a} = ${n - a}$ shaded parts remain: $${fr(n, d)} = ${fr(a, d)} + ${fr(n - a, d)}$.`,
              `还剩 $${n} - ${a} = ${n - a}$ 份涂色部分：$${fr(n, d)} = ${fr(a, d)} + ${fr(n - a, d)}$。`,
            ),
          }),
          figure: barFigure(d, n),
        };
      },
    },
  ],
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
    {
      id: "choosing-a-correct-decomposition",
      title: t("Which sum is equal?", "哪个和相等"),
      explanation: t(
        "A sum equals the fraction only if every part has the same denominator as the fraction and the numerators add up to its numerator. Check both conditions.\n\n$\\frac{7}{10} = \\frac{3}{10} + \\frac{4}{10}$ because $3 + 4 = 7$, while $\\frac{3}{5} + \\frac{4}{5} = \\frac{7}{5}$ is not equal to it.",
        "只有每一部分的分母都和原分数相同，而且分子加起来等于原分数的分子，这个和才等于原分数。两个条件都要检查。\n\n$\\frac{7}{10} = \\frac{3}{10} + \\frac{4}{10}$，因为 $3 + 4 = 7$；而 $\\frac{3}{5} + \\frac{4}{5} = \\frac{7}{5}$ 不等于它。",
      ),
      generate(rng) {
        const d = rng.int(5, 15);
        const n = rng.int(3, d - 1);
        const a = rng.int(1, n - 1);
        const hd = Math.floor(d / 2);
        return pickChoice(
          rng,
          t(`Which sum is equal to $${fr(n, d)}$?`, `哪个和等于 $${fr(n, d)}$？`),
          mathText(`${fr(a, d)} + ${fr(n - a, d)}`),
          [
            mathText(`${fr(a, d)} + ${fr(n - a + 1, d)}`),
            mathText(`${fr(a, hd)} + ${fr(n - a, d - hd)}`),
            mathText(`${fr(a, d)} + ${fr(n - a, d)} + ${fr(1, d)}`),
            mathText(`${fr(a, d)} + ${fr(n, d)}`),
          ],
          t(
            `$${a} + ${n - a} = ${n}$, so $${fr(a, d)} + ${fr(n - a, d)} = ${fr(n, d)}$.`,
            `$${a} + ${n - a} = ${n}$，所以 $${fr(a, d)} + ${fr(n - a, d)} = ${fr(n, d)}$。`,
          ),
        );
      },
    },
    {
      id: "completing-a-decomposition-into-three-fractions",
      title: t("Three parts", "拆成三个分数"),
      explanation: t(
        "To find the missing part, subtract the known numerators from the whole numerator. The denominator stays the same.\n\n$\\frac{9}{11} = \\frac{2}{11} + \\frac{3}{11} + \\frac{\\square}{11}$: $9 - 2 - 3 = 4$, so the missing part is $\\frac{4}{11}$.",
        "求缺少的部分，用原分数的分子减去已知的各个分子。分母不变。\n\n$\\frac{9}{11} = \\frac{2}{11} + \\frac{3}{11} + \\frac{\\square}{11}$：$9 - 2 - 3 = 4$，所以缺少的部分是 $\\frac{4}{11}$。",
      ),
      generate(rng) {
        const d = rng.int(5, 15);
        const n = rng.int(3, d + 4);
        const a = rng.int(1, n - 2);
        const b = rng.int(1, n - 1 - a);
        return numberProblem({
          prompt: t(
            `Fill in the box: $$${fr(n, d)} = ${fr(a, d)} + ${fr(b, d)} + \\frac{\\square}{${d}}$$`,
            `填空：$$${fr(n, d)} = ${fr(a, d)} + ${fr(b, d)} + \\frac{\\square}{${d}}$$`,
          ),
          answer: n - a - b,
          form: "integer",
          wrong: [n - a, n + a + b, d - a - b],
          solution: t(
            `The numerators must add up to $${n}$: $${n} - ${a} - ${b} = ${n - a - b}$.`,
            `分子之和要等于 $${n}$：$${n} - ${a} - ${b} = ${n - a - b}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "adding-mixed-numbers-without-regrouping",
      title: t("Without regrouping", "不进位"),
      explanation: t(
        "To add mixed numbers with the same denominator, add the whole numbers and add the fractions separately, then put them together.\n\n$3\\frac{1}{6} + 2\\frac{4}{6}$: $3 + 2 = 5$ and $\\frac{1}{6} + \\frac{4}{6} = \\frac{5}{6}$, so the sum is $5\\frac{5}{6}$.",
        "同分母带分数相加，整数部分和分数部分分别相加，再合起来。\n\n$3\\frac{1}{6} + 2\\frac{4}{6}$：$3 + 2 = 5$，$\\frac{1}{6} + \\frac{4}{6} = \\frac{5}{6}$，所以和是 $5\\frac{5}{6}$。",
      ),
      generate(rng) {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "add");
        return numberProblem({
          prompt: t(
            `Find $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$，答案写成带分数。`,
          ),
          answer: mixedValue(w1 + w2, r1 + r2, d),
          form: "mixed",
          wrong: [mixedValue(w1 + w2, r1 + r2, 2 * d), mixedValue(w1 + w2 + 1, r1 + r2, d), qf(r1 + r2, d)],
          solution: t(
            `Wholes: $${w1} + ${w2} = ${w1 + w2}$. Fractions: $${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)}$. Sum: $${mx(w1 + w2, r1 + r2, d)}$.`,
            `整数部分：$${w1} + ${w2} = ${w1 + w2}$。分数部分：$${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)}$。和：$${mx(w1 + w2, r1 + r2, d)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-mixed-numbers-with-regrouping",
      title: t("With regrouping", "要进位"),
      explanation: t(
        "If the fractions add to $1$ or more, the fraction part is improper. Change it to a mixed number and add its whole to the whole-number part.\n\n$2\\frac{3}{5} + 1\\frac{4}{5} = 3\\frac{7}{5}$, and $\\frac{7}{5} = 1\\frac{2}{5}$, so the sum is $4\\frac{2}{5}$. Leaving the answer as $3\\frac{7}{5}$ is not finished.",
        "如果分数部分相加满 $1$ 或超过 $1$，分数部分就是假分数。把它化成带分数，再把整数部分加到原来的整数上。\n\n$2\\frac{3}{5} + 1\\frac{4}{5} = 3\\frac{7}{5}$，而 $\\frac{7}{5} = 1\\frac{2}{5}$，所以和是 $4\\frac{2}{5}$。结果写成 $3\\frac{7}{5}$ 还没有化简完。",
      ),
      generate(rng) {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "addRegroup");
        const r = r1 + r2 - d;
        return numberProblem({
          prompt: t(
            `Find $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} + ${mx(w2, r2, d)}$，答案写成带分数。`,
          ),
          answer: mixedValue(w1 + w2 + 1, r, d),
          form: "mixed",
          wrong: [mixedValue(w1 + w2, r, d), mixedValue(w1 + w2 + 2, r, d), mixedValue(w1 + w2, r1 + r2, 2 * d)],
          solution: t(
            `Wholes: $${w1 + w2}$. Fractions: $${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)} = ${mx(1, r, d)}$. Sum: $${w1 + w2} + ${mx(1, r, d)} = ${mx(w1 + w2 + 1, r, d)}$.`,
            `整数部分：$${w1 + w2}$。分数部分：$${fr(r1, d)} + ${fr(r2, d)} = ${fr(r1 + r2, d)} = ${mx(1, r, d)}$。和：$${w1 + w2} + ${mx(1, r, d)} = ${mx(w1 + w2 + 1, r, d)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "subtracting-mixed-numbers-without-borrowing",
      title: t("Two mixed numbers", "两个带分数相减"),
      explanation: t(
        "When the first fraction is at least as large as the second, subtract the whole numbers and subtract the fractions separately.\n\n$6\\frac{5}{7} - 2\\frac{1}{7}$: $6 - 2 = 4$ and $\\frac{5}{7} - \\frac{1}{7} = \\frac{4}{7}$, so the difference is $4\\frac{4}{7}$.",
        "第一个分数部分不小于第二个时，整数部分和分数部分分别相减。\n\n$6\\frac{5}{7} - 2\\frac{1}{7}$：$6 - 2 = 4$，$\\frac{5}{7} - \\frac{1}{7} = \\frac{4}{7}$，所以差是 $4\\frac{4}{7}$。",
      ),
      generate(rng) {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "sub");
        return numberProblem({
          prompt: t(
            `Find $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$，答案写成带分数。`,
          ),
          answer: mixedValue(w1 - w2, r1 - r2, d),
          form: "mixed",
          wrong: [mixedValue(w1 + w2, r1 - r2, d), mixedValue(w1 - w2, r1 + r2, d), mixedValue(w1 - w2 - 1, r1 - r2, d)],
          solution: t(
            `Wholes: $${w1} - ${w2} = ${w1 - w2}$. Fractions: $${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$. Difference: $${mx(w1 - w2, r1 - r2, d)}$.`,
            `整数部分：$${w1} - ${w2} = ${w1 - w2}$。分数部分：$${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$。差：$${mx(w1 - w2, r1 - r2, d)}$。`,
          ),
        });
      },
    },
    {
      id: "subtracting-fractions-from-mixed-numbers",
      title: t("A fraction or a whole number from a mixed number", "带分数减分数或整数"),
      explanation: t(
        "Subtracting a fraction changes only the fraction part, and subtracting a whole number changes only the whole-number part. Simplify the result if you can.\n\n$4\\frac{5}{9} - \\frac{2}{9} = 4\\frac{3}{9} = 4\\frac{1}{3}$, and $4\\frac{5}{9} - 3 = 1\\frac{5}{9}$.",
        "减去一个分数，只有分数部分变化；减去一个整数，只有整数部分变化。结果能约分的要约分。\n\n$4\\frac{5}{9} - \\frac{2}{9} = 4\\frac{3}{9} = 4\\frac{1}{3}$，$4\\frac{5}{9} - 3 = 1\\frac{5}{9}$。",
      ),
      generate(rng) {
        const { w1, r1, r2, d } = mixedPair(rng, "sub");
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `Find $${mx(w1, r1, d)} - ${fr(r2, d)}$. Write a mixed number.`,
              `计算 $${mx(w1, r1, d)} - ${fr(r2, d)}$，答案写成带分数。`,
            ),
            answer: mixedValue(w1, r1 - r2, d),
            form: "mixed",
            wrong: [mixedValue(w1 - 1, r1 - r2, d), mixedValue(w1, r1 + r2, d)],
            solution: t(
              `Only the fractions change: $${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$, so the answer is $${mx(w1, r1 - r2, d)}$.`,
              `只有分数部分变化：$${fr(r1, d)} - ${fr(r2, d)} = ${fr(r1 - r2, d)}$，所以答案是 $${mx(w1, r1 - r2, d)}$。`,
            ),
          });
        }
        const w2 = rng.int(1, w1 - 1);
        const r = coprimeTo(rng, d, 1, d - 1);
        return numberProblem({
          prompt: t(`Find $${mx(w1, r, d)} - ${w2}$. Write a mixed number.`, `计算 $${mx(w1, r, d)} - ${w2}$，答案写成带分数。`),
          answer: mixedValue(w1 - w2, r, d),
          form: "mixed",
          wrong: [mixedValue(w1 - w2, d - r, d), mixedValue(w1, r - 0, d), w1 - w2],
          solution: t(
            `Only the wholes change: $${w1} - ${w2} = ${w1 - w2}$, so the answer is $${mx(w1 - w2, r, d)}$.`,
            `只有整数部分变化：$${w1} - ${w2} = ${w1 - w2}$，所以答案是 $${mx(w1 - w2, r, d)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "subtracting-mixed-numbers-with-borrowing",
      title: t("A smaller first fraction", "被减数的分数部分较小"),
      explanation: t(
        "When the first fraction is smaller than the second, the fractions cannot be subtracted directly. Change both mixed numbers to improper fractions, subtract the numerators, and change the answer back to a mixed number.\n\n$5\\frac{2}{7} - 2\\frac{5}{7} = \\frac{37}{7} - \\frac{19}{7} = \\frac{18}{7} = 2\\frac{4}{7}$. Subtracting $\\frac{2}{7}$ from $\\frac{5}{7}$ instead is a common mistake.",
        "第一个分数部分比第二个小时，分数部分不够减。把两个带分数都化成假分数，分子相减，再把结果化成带分数。\n\n$5\\frac{2}{7} - 2\\frac{5}{7} = \\frac{37}{7} - \\frac{19}{7} = \\frac{18}{7} = 2\\frac{4}{7}$。反过来用 $\\frac{5}{7}$ 减 $\\frac{2}{7}$ 是常见的错误。",
      ),
      generate(rng) {
        const { w1, r1, w2, r2, d } = mixedPair(rng, "subBorrow");
        const a = w1 * d + r1;
        const b = w2 * d + r2;
        return numberProblem({
          prompt: t(
            `Find $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$. Write a mixed number.`,
            `计算 $${mx(w1, r1, d)} - ${mx(w2, r2, d)}$，答案写成带分数。`,
          ),
          answer: qf(a - b, d),
          form: "mixed",
          wrong: [mixedValue(w1 - w2, r2 - r1, d), mixedValue(w1 - w2, d + r1 - r2, d), qf(a - b + d, d)],
          solution: t(
            `$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)} = ${mixedLatex(qf(a - b, d))}$.`,
            `$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)} = ${mixedLatex(qf(a - b, d))}$。`,
          ),
        });
      },
    },
    {
      id: "subtracting-mixed-numbers-from-whole-numbers",
      title: t("From a whole number", "从整数中减去带分数"),
      explanation: t(
        "To subtract a mixed number from a whole number, write both as improper fractions with the same denominator, subtract, and change back.\n\n$6 - 2\\frac{3}{8} = \\frac{48}{8} - \\frac{19}{8} = \\frac{29}{8} = 3\\frac{5}{8}$. The answer is not $4\\frac{3}{8}$: the $\\frac{3}{8}$ is taken away, not kept.",
        "用整数减带分数，把两个数都化成分母相同的假分数，相减后再化回带分数。\n\n$6 - 2\\frac{3}{8} = \\frac{48}{8} - \\frac{19}{8} = \\frac{29}{8} = 3\\frac{5}{8}$。答案不是 $4\\frac{3}{8}$：$\\frac{3}{8}$ 是要减去的，不是留下的。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const w1 = rng.int(2, 10);
        const w2 = rng.int(1, w1 - 1);
        const r = coprimeTo(rng, d, 1, d - 1);
        const a = w1 * d;
        const b = w2 * d + r;
        return numberProblem({
          prompt: t(`Find $${w1} - ${mx(w2, r, d)}$. Write a mixed number.`, `计算 $${w1} - ${mx(w2, r, d)}$，答案写成带分数。`),
          answer: qf(a - b, d),
          form: "mixed",
          wrong: [mixedValue(w1 - w2, r, d), mixedValue(w1 - w2, d - r, d), qf(a - b + d, d)],
          solution: t(
            `$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)} = ${mixedLatex(qf(a - b, d))}$.`,
            `$${fr(a, d)} - ${fr(b, d)} = ${fr(a - b, d)} = ${mixedLatex(qf(a - b, d))}$。`,
          ),
        });
      },
    },
  ],
);

/** mixedWordKP builds a word-problem knowledge point for adding or subtracting mixed numbers. */
function mixedWordKP(id: string, subtract: boolean, regroup: boolean): KnowledgePointDef {
  return {
    id,
    title: regroup
      ? subtract
        ? t("Borrowing a whole", "借一个整体")
        : t("Regrouping into a whole", "进位成整体")
      : t("Without regrouping", "不需要进位或借位"),
    explanation: !regroup
      ? subtract
        ? t(
            "When an amount is taken away and the first fraction is at least as large as the second, subtract the whole numbers and subtract the fractions separately; no borrowing is needed.\n\nA rope $4\\frac{5}{6}$ yards long has $1\\frac{1}{6}$ yards cut off: $4\\frac{5}{6} - 1\\frac{1}{6} = 3\\frac{4}{6} = 3\\frac{2}{3}$ yards are left.",
            "拿走一部分时，如果第一个分数部分不小于第二个，就整数部分减整数部分、分数部分减分数部分，不需要借位。\n\n一根 $4\\frac{5}{6}$ 码长的绳子剪掉 $1\\frac{1}{6}$ 码：还剩 $4\\frac{5}{6} - 1\\frac{1}{6} = 3\\frac{4}{6} = 3\\frac{2}{3}$ 码。",
          )
        : t(
            "When two amounts are put together and their fractions add to less than one whole, add the whole numbers and add the fractions separately; nothing needs to be carried.\n\n$1\\frac{2}{8}$ cups and then $2\\frac{3}{8}$ cups of flour: $1\\frac{2}{8} + 2\\frac{3}{8} = 3\\frac{5}{8}$ cups in all.",
            "两个量合在一起，如果分数部分相加不满一个整体，就整数部分加整数部分、分数部分加分数部分，不需要进位。\n\n先放 $1\\frac{2}{8}$ 杯面粉，再放 $2\\frac{3}{8}$ 杯：一共 $1\\frac{2}{8} + 2\\frac{3}{8} = 3\\frac{5}{8}$ 杯。",
          )
      : subtract
        ? t(
            "When an amount is taken away or two amounts are compared, subtract the mixed numbers. If the first fraction is too small, borrow one whole or use improper fractions.\n\nA board $5\\frac{1}{4}$ feet long has $1\\frac{3}{4}$ feet cut off: $5\\frac{1}{4} - 1\\frac{3}{4} = 3\\frac{2}{4} = 3\\frac{1}{2}$ feet are left.",
            "拿走一部分或比较两个量时，把带分数相减。如果第一个分数部分不够减，就借一个整体，或者化成假分数再算。\n\n一块 $5\\frac{1}{4}$ 英尺长的木板锯掉 $1\\frac{3}{4}$ 英尺：还剩 $5\\frac{1}{4} - 1\\frac{3}{4} = 3\\frac{1}{2}$ 英尺。",
          )
        : t(
            "When two amounts are put together, add the mixed numbers: add the whole numbers and the fractions. If the fractions make $1$ or more, carry the whole into the whole-number part.\n\n$2\\frac{3}{8}$ miles and then $1\\frac{7}{8}$ miles: $3\\frac{10}{8} = 4\\frac{2}{8} = 4\\frac{1}{4}$ miles in all.",
            "两个量合在一起，就把带分数相加：整数部分相加，分数部分相加。分数部分满 $1$ 时，向整数部分进一。\n\n先走 $2\\frac{3}{8}$ 英里，再走 $1\\frac{7}{8}$ 英里：一共 $3\\frac{10}{8} = 4\\frac{1}{4}$ 英里。",
          ),
    generate(rng) {
      const name = rng.pick(names);
      const p = mixedPair(rng, subtract ? (regroup ? "subBorrow" : "sub") : regroup ? "addRegroup" : "add");
      const a = mixedValue(p.w1, p.r1, p.d);
      const b = mixedValue(p.w2, p.r2, p.d);
      const value = subtract ? a.sub(b) : a.add(b);
      const [x, y] = [mx(p.w1, p.r1, p.d), mx(p.w2, p.r2, p.d)];
      const am = rng.pick(amounts);
      const story = am.first(name, `$${x}$`);
      const more = am.second(name, `$${y}$`);
      return numberProblem({
        prompt: t(
          `${story.en.replace(" mile", " miles").replace(" cup", " cups").replace(" hour", " hours").replace(" liter", " liters")} ${more.en.replace(" mile", " miles").replace(" cup", " cups").replace(" hour", " hours").replace(" liter", " liters")} ${(subtract ? am.difference : am.together).en} Write a mixed number.`,
          `${story["zh-CN"]}，${more["zh-CN"]}${(subtract ? am.difference : am.together)["zh-CN"]}用带分数表示。`,
        ),
        answer: value,
        form: "mixed",
        wrong: subtract
          ? [a.add(b), mixedValue(p.w1 - p.w2, Math.abs(p.r1 - p.r2), p.d)]
          : [mixedValue(p.w1 + p.w2, p.r1 + p.r2 - (regroup ? p.d : 0), p.d), a.sub(b).abs()],
        solution: t(
          `$${x} ${subtract ? "-" : "+"} ${y} = ${mixedLatex(value)}$.`,
          `$${x} ${subtract ? "-" : "+"} ${y} = ${mixedLatex(value)}$。`,
        ),
      });
    },
  };
}

export const addingMixedNumbersWithLikeDenominatorsWordProblems = topic(
  "adding-mixed-numbers-with-like-denominators-word-problems",
  t("Adding Mixed Numbers With Like Denominators: Word Problems", "同分母带分数加法应用题"),
  t(
    "Joining two amounts given as mixed numbers is solved by adding them, regrouping fractions that make a whole: 2 3/8 miles and 1 7/8 miles make 4 1/4 miles.",
    "把两个用带分数表示的量合起来，就把它们相加，分数部分满一个整体时要进位：2 3/8 英里和 1 7/8 英里合起来是 4 1/4 英里。",
  ),
  ["adding-mixed-numbers-with-like-denominators"],
  ["4.NF.B.3"],
  [mixedWordKP("adding-mixed-amounts", false, false), mixedWordKP("adding-mixed-amounts-with-regrouping", false, true)],
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
  [mixedWordKP("subtracting-mixed-amounts", true, false), mixedWordKP("subtracting-mixed-amounts-with-borrowing", true, true)],
);

// ---------------------------------------------------------------------------
// Multiplying fractions by whole numbers

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
    {
      id: "copies-of-a-unit-fraction",
      title: t("Copies of a unit fraction", "几个单位分数"),
      explanation: t(
        "A whole number times a unit fraction counts copies of that unit fraction. The whole number becomes the numerator, and the denominator stays the same.\n\nThe model shows $4$ parts of size $\\frac{1}{6}$ shaded: $4 \\times \\frac{1}{6} = \\frac{4}{6}$, not $\\frac{4}{24}$.",
        "整数乘分数单位，就是求几个这样的分数单位。整数变成分子，分母不变。\n\n模型中涂色了 $4$ 个 $\\frac{1}{6}$：$4 \\times \\frac{1}{6} = \\frac{4}{6}$，而不是 $\\frac{4}{24}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 12);
        const n = rng.int(2, d + 4);
        const count = Math.ceil(n / d);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${n} \\times ${fr(1, d)}$. Fill in the box: $$${n} \\times ${fr(1, d)} = \\frac{\\square}{${d}}$$`,
              `模型表示 $${n} \\times ${fr(1, d)}$。填空：$$${n} \\times ${fr(1, d)} = \\frac{\\square}{${d}}$$`,
            ),
            answer: n,
            form: "integer",
            wrong: [n + 1, d, n * d],
            solution: t(`$${n}$ copies of $${fr(1, d)}$ are $${fr(n, d)}$.`, `$${n}$ 个 $${fr(1, d)}$ 是 $${fr(n, d)}$。`),
          }),
          figure: barFigure(d, n, count),
        };
      },
    },
    {
      id: "products-of-whole-numbers-and-unit-fractions",
      title: t("The product as a fraction", "积写成分数"),
      explanation: t(
        "Multiplying a unit fraction by a whole number gives that many copies of it, so the product has the whole number as numerator and the same denominator. Multiply only the numerator.\n\n$7 \\times \\frac{1}{10} = \\frac{7 \\times 1}{10} = \\frac{7}{10}$.",
        "分数单位乘整数，得到的是几个这样的分数单位，所以积的分子是这个整数，分母不变。只乘分子。\n\n$7 \\times \\frac{1}{10} = \\frac{7 \\times 1}{10} = \\frac{7}{10}$。",
      ),
      generate(rng) {
        const d = rng.int(2, 15);
        const n = coprimeTo(rng, d, 2, 2 * d);
        return numberProblem({
          prompt: t(`Find $${n} \\times ${fr(1, d)}$.`, `计算 $${n} \\times ${fr(1, d)}$。`),
          answer: qf(n, d),
          form: "fraction",
          wrong: [qf(1, n * d), qf(n, n * d), qf(d, n)],
          solution: t(`$${n}$ copies of $${fr(1, d)}$ make $${fr(n, d)}$.`, `$${n}$ 个 $${fr(1, d)}$ 是 $${fr(n, d)}$。`),
        });
      },
    },
  ],
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
    {
      id: "groups-of-a-fraction-in-a-model",
      title: t("Groups of a fraction", "几组分数"),
      explanation: t(
        "Equal groups of a fraction can be counted part by part. Each group has as many parts as the numerator, so multiply the number of groups by the numerator; the size of the parts does not change.\n\n$3$ groups of $\\frac{2}{5}$ shade $3 \\times 2 = 6$ fifths: $3 \\times \\frac{2}{5} = \\frac{6}{5}$.",
        "几组同样的分数可以一份一份地数。每组的份数等于分子，所以用组数乘分子；每份的大小不变。\n\n$3$ 组 $\\frac{2}{5}$ 共涂色 $3 \\times 2 = 6$ 个五分之一：$3 \\times \\frac{2}{5} = \\frac{6}{5}$。",
      ),
      generate(rng) {
        const d = rng.int(3, 8);
        const a = rng.int(2, d - 1);
        const n = rng.int(2, 4);
        const total = n * a;
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${n}$ groups of $${fr(a, d)}$. Fill in the box: $$${n} \\times ${fr(a, d)} = \\frac{\\square}{${d}}$$`,
              `模型表示 $${n}$ 组 $${fr(a, d)}$。填空：$$${n} \\times ${fr(a, d)} = \\frac{\\square}{${d}}$$`,
            ),
            answer: total,
            form: "integer",
            wrong: [n + a, a, total + 1],
            solution: t(
              `Each group has $${a}$ parts of size $${fr(1, d)}$, so there are $${n} \\times ${a} = ${total}$: $${fr(total, d)}$.`,
              `每组有 $${a}$ 个 $${fr(1, d)}$，一共 $${n} \\times ${a} = ${total}$ 个：$${fr(total, d)}$。`,
            ),
          }),
          figure: barFigure(d, total, Math.ceil(total / d)),
        };
      },
    },
    {
      id: "writing-products-as-sums",
      title: t("Products as repeated addition", "乘法与连加"),
      explanation: t(
        "Multiplying by a whole number is repeated addition, just as with whole numbers: $n \\times \\frac{a}{b}$ is $\\frac{a}{b}$ added $n$ times.\n\n$4 \\times \\frac{3}{7} = \\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7} = \\frac{12}{7}$.",
        "和整数一样，乘整数就是求几个相同加数的和：$n \\times \\frac{a}{b}$ 就是 $n$ 个 $\\frac{a}{b}$ 相加。\n\n$4 \\times \\frac{3}{7} = \\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7} + \\frac{3}{7} = \\frac{12}{7}$。",
      ),
      generate(rng) {
        const n = rng.int(2, 5);
        const d = rng.int(3, 12);
        const a = rng.int(2, d - 1);
        const sum = Array.from({ length: n }, () => fr(a, d)).join(" + ");
        return pickChoice(
          rng,
          t(`Which product equals $${sum}$?`, `哪个乘法算式等于 $${sum}$？`),
          mathText(`${n} \\times ${fr(a, d)}`),
          [
            mathText(`${a} \\times ${fr(n, d)}`).en === mathText(`${n} \\times ${fr(a, d)}`).en
              ? mathText(`${n + 1} \\times ${fr(a, d)}`)
              : mathText(`${n} \\times ${fr(a, n * d)}`),
            mathText(`${n} + ${fr(a, d)}`),
            mathText(`${n} \\times ${fr(1, d)}`),
            mathText(`${a} \\times ${fr(n, n * d)}`),
          ],
          t(
            `$${n}$ copies of $${fr(a, d)}$ are added, which is $${n} \\times ${fr(a, d)}$.`,
            `把 $${n}$ 个 $${fr(a, d)}$ 相加，就是 $${n} \\times ${fr(a, d)}$。`,
          ),
        );
      },
    },
  ],
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
    {
      id: "products-as-improper-fractions",
      title: t("The product as a fraction", "积写成分数"),
      explanation: t(
        "To multiply a fraction by a whole number, multiply the numerator by the whole number and keep the denominator. Do not multiply the denominator as well.\n\n$5 \\times \\frac{3}{4} = \\frac{5 \\times 3}{4} = \\frac{15}{4}$.",
        "分数乘整数，用分子乘整数，分母不变。分母不能也乘这个整数。\n\n$5 \\times \\frac{3}{4} = \\frac{5 \\times 3}{4} = \\frac{15}{4}$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(2, 12);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 9);
          if (gcd(n * a, d) !== 1) continue;
          return numberProblem({
            prompt: t(`Find $${n} \\times ${fr(a, d)}$. Give the answer as a fraction.`, `计算 $${n} \\times ${fr(a, d)}$，答案写成分数。`),
            answer: qf(n * a, d),
            form: "fraction",
            wrong: [qf(n * a, n * d), qf(a, n * d), qf(n + a, d)],
            solution: t(
              `$${n} \\times ${fr(a, d)} = ${fr(`${n} \\times ${a}`, d)} = ${fr(n * a, d)}$.`,
              `$${n} \\times ${fr(a, d)} = ${fr(`${n} \\times ${a}`, d)} = ${fr(n * a, d)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "products-as-mixed-numbers",
      title: t("The product as a mixed number", "积写成带分数"),
      explanation: t(
        "Multiply the numerator by the whole number to get an improper fraction, then divide the numerator by the denominator to write it as a mixed number.\n\n$4 \\times \\frac{2}{3} = \\frac{8}{3}$, and $8 \\div 3 = 2 \\text{ R } 2$, so the product is $2\\frac{2}{3}$.",
        "先用分子乘整数，得到假分数，再用分子除以分母，把它写成带分数。\n\n$4 \\times \\frac{2}{3} = \\frac{8}{3}$，$8 \\div 3 = 2 \\cdots\\cdots 2$，所以积是 $2\\frac{2}{3}$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(2, 12);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 9);
          if (gcd(n * a, d) !== 1 || n * a < d) continue;
          return numberProblem({
            prompt: t(`Find $${n} \\times ${fr(a, d)}$. Write a mixed number.`, `计算 $${n} \\times ${fr(a, d)}$，答案写成带分数。`),
            answer: qf(n * a, d),
            form: "mixed",
            wrong: [qf(n * a, n * d), qf(n + a, d), mixedValue(n, a, d)],
            solution: t(
              `$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${mixedLatex(qf(n * a, d))}$.`,
              `$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${mixedLatex(qf(n * a, d))}$。`,
            ),
          });
        }
      },
    },
  ],
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
    {
      id: "repeated-fractional-amounts",
      title: t("Equal amounts", "相同的数量"),
      explanation: t(
        "When the same fractional amount is repeated several times, the total is the number of times multiplied by the fraction. Write an improper result as a mixed number.\n\n$5$ people each eat $\\frac{3}{8}$ of a pizza: $5 \\times \\frac{3}{8} = \\frac{15}{8} = 1\\frac{7}{8}$ pizzas.",
        "同一个分数量重复几次，总数就是次数乘这个分数。结果是假分数时化成带分数。\n\n$5$ 个人每人吃 $\\frac{3}{8}$ 个比萨：一共 $5 \\times \\frac{3}{8} = \\frac{15}{8} = 1\\frac{7}{8}$ 个比萨。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(2, 12);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 12);
          if (gcd(n * a, d) !== 1 || n * a < d) continue;
          const kind = rng.int(0, 2);
          const prompts = [
            t(
              `Each of ${n} students needs $${fr(a, d)}$ yard of string. How many yards of string do they need in all?`,
              `${n} 名学生每人需要 $${fr(a, d)}$ 码绳子。一共需要多少码？`,
            ),
            t(
              `A runner runs $${fr(a, d)}$ mile every day for ${n} days. How many miles is that in all?`,
              `一名跑步者每天跑 $${fr(a, d)}$ 英里，连续跑了 ${n} 天。一共跑了多少英里？`,
            ),
            t(
              `A recipe uses $${fr(a, d)}$ cup of sugar. How many cups of sugar are needed for ${n} batches?`,
              `一份食谱要用 $${fr(a, d)}$ 杯糖。做 ${n} 份需要多少杯糖？`,
            ),
          ];
          return numberProblem({
            prompt: t(`${prompts[kind]!.en} Write a mixed number.`, `${prompts[kind]!["zh-CN"]}用带分数表示。`),
            answer: qf(n * a, d),
            form: "mixed",
            wrong: [qf(n + a, d), qf(n * a, n * d), mixedValue(n, a, d)],
            solution: t(
              `$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${mixedLatex(qf(n * a, d))}$.`,
              `$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${mixedLatex(qf(n * a, d))}$。`,
            ),
          });
        }
      },
    },
    {
      id: "comparing-with-a-fractional-multiple",
      title: t("Times as much", "几倍"),
      explanation: t(
        '"Times as much" means multiply: the larger amount is the number of times multiplied by the smaller amount, even when that amount is a fraction.\n\nA puppy eats $\\frac{2}{3}$ cup of food and a big dog eats $4$ times as much: $4 \\times \\frac{2}{3} = \\frac{8}{3} = 2\\frac{2}{3}$ cups. Adding $4 + \\frac{2}{3}$ would be a mistake.',
        '"是……的几倍"用乘法：较大的量等于倍数乘较小的量，即使较小的量是分数也一样。\n\n小狗吃 $\\frac{2}{3}$ 杯狗粮，大狗吃的是它的 $4$ 倍：$4 \\times \\frac{2}{3} = \\frac{8}{3} = 2\\frac{2}{3}$ 杯。算成 $4 + \\frac{2}{3}$ 是错误的。',
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(2, 10);
          const a = rng.int(1, d - 1);
          const n = rng.int(2, 9);
          if (gcd(n * a, d) !== 1 || n * a < d) continue;
          const [p, q] = rng.sample(names, 2);
          return numberProblem({
            prompt: t(
              `${p}'s plant grew $${fr(a, d)}$ inch this week. ${q}'s plant grew ${n} times as much. How many inches did ${q}'s plant grow? Write a mixed number.`,
              `${p} 的植物这周长高了 $${fr(a, d)}$ 英寸。${q} 的植物长高的高度是它的 ${n} 倍。${q} 的植物长高了多少英寸？用带分数表示。`,
            ),
            answer: qf(n * a, d),
            form: "mixed",
            wrong: [qf(n + a, d), mixedValue(n, a, d), qf(a, n * d)],
            solution: t(
              `$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${mixedLatex(qf(n * a, d))}$.`,
              `$${n} \\times ${fr(a, d)} = ${fr(n * a, d)} = ${mixedLatex(qf(n * a, d))}$。`,
            ),
          });
        }
      },
    },
  ],
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
    {
      id: "cancelling-before-multiplying",
      title: t("Cancelling a common factor", "先约分"),
      explanation: t(
        "Before multiplying, look for a common factor of the whole number and the denominator. Dividing both by it first keeps the numbers small and gives an answer already in lowest terms.\n\n$10 \\times \\frac{3}{4}$: $10$ and $4$ share the factor $2$, so $10 \\times \\frac{3}{4} = 5 \\times \\frac{3}{2} = \\frac{15}{2}$.",
        "相乘之前，先看整数和分母有没有公因数。先把两者同时除以公因数，数就变小了，结果也直接是最简分数。\n\n$10 \\times \\frac{3}{4}$：$10$ 和 $4$ 有公因数 $2$，所以 $10 \\times \\frac{3}{4} = 5 \\times \\frac{3}{2} = \\frac{15}{2}$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(4, 12);
          const a = coprimeTo(rng, d, 1, d - 1);
          const n = rng.int(2, 30);
          const g = gcd(n, d);
          if (g === 1 || g === d) continue;
          const v = qf(n * a, d);
          return numberProblem({
            prompt: t(`Find $${n} \\times ${fr(a, d)}$ in lowest terms.`, `计算 $${n} \\times ${fr(a, d)}$，结果写成最简分数。`),
            answer: v,
            form: "fraction",
            wrong: [qf(n * a + 1, d), qf((n / g) * a, d), qf(n + a, d)],
            solution: t(
              `$${n}$ and $${d}$ share the factor $${g}$: $$${n} \\times ${fr(a, d)} = ${n / g} \\times ${fr(a, d / g)} = ${v.toLatex()}$$`,
              `$${n}$ 和 $${d}$ 有公因数 $${g}$：$$${n} \\times ${fr(a, d)} = ${n / g} \\times ${fr(a, d / g)} = ${v.toLatex()}$$`,
            ),
          });
        }
      },
    },
    {
      id: "products-that-are-whole-numbers",
      title: t("Whole-number products", "积是整数"),
      explanation: t(
        "If the denominator divides the whole number exactly, divide first: the denominator cancels completely and the product is a whole number.\n\n$12 \\times \\frac{3}{4}$: $12 \\div 4 = 3$, so the product is $3 \\times 3 = 9$.",
        "如果整数能被分母整除，就先除：分母完全约掉，积是整数。\n\n$12 \\times \\frac{3}{4}$：$12 \\div 4 = 3$，所以积是 $3 \\times 3 = 9$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const a = coprimeTo(rng, d, 1, d - 1);
        const m = rng.int(2, 9);
        const n = d * m;
        return numberProblem({
          prompt: t(`Find $${n} \\times ${fr(a, d)}$.`, `计算 $${n} \\times ${fr(a, d)}$。`),
          answer: m * a,
          form: "integer",
          wrong: [n * a, m, m + a],
          solution: t(
            `$${n} \\div ${d} = ${m}$, so $${n} \\times ${fr(a, d)} = ${m} \\times ${a} = ${m * a}$.`,
            `$${n} \\div ${d} = ${m}$，所以 $${n} \\times ${fr(a, d)} = ${m} \\times ${a} = ${m * a}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Decimals

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
    {
      id: "tenths-as-hundredths",
      title: t("Tenths as hundredths", "十分之几化成百分之几"),
      explanation: t(
        "One tenth is ten hundredths, so a number of tenths becomes hundredths by multiplying the numerator and the denominator by $10$. This lets you add tenths and hundredths.\n\n$\\frac{3}{10} = \\frac{30}{100}$: each tenth is ten hundredths.",
        "一个十分之一是十个百分之一，所以把分子和分母同时乘 $10$，十分之几就化成百分之几。这样十分之几和百分之几就能相加。\n\n$\\frac{3}{10} = \\frac{30}{100}$：一个十分之一是十个百分之一。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`Fill in the box: $$${fr(a, 10)} = \\frac{\\square}{100}$$`, `填空：$$${fr(a, 10)} = \\frac{\\square}{100}$$`),
            answer: 10 * a,
            form: "integer",
            wrong: [a, 100 * a, a + 90],
            solution: t(
              `$${fr(a, 10)} = ${fr(`${a} \\times 10`, "10 \\times 10")} = ${fr(10 * a, 100)}$.`,
              `$${fr(a, 10)} = ${fr(`${a} \\times 10`, "10 \\times 10")} = ${fr(10 * a, 100)}$。`,
            ),
          });
        }
        const b = rng.int(1, 9);
        return numberProblem({
          prompt: t(
            `Fill in the box: $$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
            `填空：$$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
          ),
          answer: 10 * a + b,
          form: "integer",
          wrong: [a + b, 10 * b + a, 100 * a + b],
          solution: t(
            `$${fr(a, 10)} = ${fr(10 * a, 100)}$, and $${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(10 * a + b, 100)}$.`,
            `$${fr(a, 10)} = ${fr(10 * a, 100)}$，$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(10 * a + b, 100)}$。`,
          ),
        });
      },
    },
    {
      id: "writing-decimal-fractions-as-decimals",
      title: t("Decimal notation", "写成小数"),
      explanation: t(
        "$\\frac{7}{10} = 0.7$ and $\\frac{7}{100} = 0.07$: the tenths digit is right after the decimal point, and the hundredths digit after that.",
        "$\\frac{7}{10} = 0.7$，$\\frac{7}{100} = 0.07$：小数点右边第一位是十分位，第二位是百分位。",
      ),
      generate(rng) {
        const tenths = rng.bool(0.35);
        const n = tenths ? rng.int(1, 9) : rng.int(1, 99);
        const den = tenths ? 10 : 100;
        const places = tenths ? 1 : 2;
        return numberProblem({
          prompt: t(`Write $${fr(n, den)}$ as a decimal.`, `把 $${fr(n, den)}$ 写成小数。`),
          answer: qf(n, den),
          form: "decimal",
          wrong: [qf(n, tenths ? 100 : 10), qf(n, tenths ? 1 : 1000), n],
          solution: t(
            `$${fr(n, den)}$ is $${n}$ ${tenths ? "tenths" : "hundredths"}, so the last digit goes ${places} ${places === 1 ? "place" : "places"} after the decimal point: $${fr(n, den)} = ${dec(n, places)}$.`,
            `$${fr(n, den)}$ 是 $${n}$ 个${tenths ? "十分之一" : "百分之一"}，所以最后一位数字写在小数点后第 ${places} 位：$${fr(n, den)} = ${dec(n, places)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "reading-tenths-on-number-lines",
      title: t("Tenths", "十分位"),
      explanation: t(
        "When the space between two whole numbers is cut into $10$ equal steps, each step is one tenth. Start at the whole number on the left and count steps of $0.1$.\n\nOn a line from $2$ to $3$ cut into $10$ steps, a point $4$ steps past $2$ is at $2.4$.",
        "两个相邻整数之间平均分成 $10$ 格时，每格是十分之一。从左边的整数开始，按 $0.1$ 一格往右数。\n\n在从 $2$ 到 $3$ 平均分成 $10$ 格的数轴上，$2$ 右边第 $4$ 格的点表示 $2.4$。",
      ),
      generate(rng) {
        const w = rng.int(0, 5);
        const k = rng.int(1, 9);
        const labels = new Map([
          [0, String(w)],
          [10, String(w + 1)],
        ]);
        return {
          ...numberProblem({
            prompt: t("What decimal does point $P$ show?", "点 $P$ 表示什么小数？"),
            answer: qf(10 * w + k, 10),
            form: "decimal",
            wrong: [qf(100 * w + k, 100), qf(10 * w + k + 1, 10), qf(10 * w + 10 - k, 10)],
            solution: t(
              `Each step is $0.1$, and $P$ is $${k}$ steps past $${w}$: $${dec(10 * w + k, 1)}$.`,
              `每格是 $0.1$，$P$ 在 $${w}$ 右边第 $${k}$ 格：$${dec(10 * w + k, 1)}$。`,
            ),
          }),
          figure: numberLineFigure(10, 0, 10, labels, [{ at: k, label: "P" }]),
        };
      },
    },
    {
      id: "reading-hundredths-on-number-lines",
      title: t("Hundredths", "百分位"),
      explanation: t(
        "When the space between two tenths is cut into $10$ equal steps, each step is one hundredth. Start at the tenth on the left and count steps of $0.01$.\n\nOn a line from $0.6$ to $0.7$ cut into $10$ steps, each step is $0.01$; $3$ steps past $0.6$ is $0.63$.",
        "两个相邻的十分之几之间平均分成 $10$ 格时，每格是百分之一。从左边的数开始，按 $0.01$ 一格往右数。\n\n在从 $0.6$ 到 $0.7$ 平均分成 $10$ 格的数轴上，每格是 $0.01$；$0.6$ 右边第 $3$ 格是 $0.63$。",
      ),
      generate(rng) {
        const start = rng.int(0, 29);
        const k = rng.int(1, 9);
        const labels = new Map([
          [0, dec(start, 1)],
          [10, dec(start + 1, 1)],
        ]);
        return {
          ...numberProblem({
            prompt: t("What decimal does point $P$ show?", "点 $P$ 表示什么小数？"),
            answer: qf(10 * start + k, 100),
            form: "decimal",
            wrong: [qf(start + k, 10), qf(10 * start + k * 10, 100), qf(10 * start + 10 - k, 100)],
            solution: t(
              `The steps are $0.01$ each, and $P$ is $${k}$ steps past $${dec(start, 1)}$: $${dec(10 * start + k, 2)}$.`,
              `每格是 $0.01$，$P$ 在 $${dec(start, 1)}$ 右边第 $${k}$ 格：$${dec(10 * start + k, 2)}$。`,
            ),
          }),
          figure: numberLineFigure(10, 0, 10, labels, [{ at: k, label: "P" }]),
        };
      },
    },
  ],
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
    {
      id: "comparing-two-decimals",
      title: t("Two decimals", "比较两个小数"),
      explanation: t(
        "Compare decimals place by place from the left, as with whole numbers. If they have different numbers of decimal places, write zeros at the end so they line up; this does not change their values.\n\n$0.6$ and $0.58$: as hundredths they are $0.60$ and $0.58$, so $0.6 > 0.58$. More digits do not make a decimal greater.",
        "和整数一样，小数也从左往右逐位比较。如果小数位数不同，在末尾添 $0$ 使它们对齐；这不改变小数的大小。\n\n$0.6$ 与 $0.58$：写成两位小数是 $0.60$ 与 $0.58$，所以 $0.6 > 0.58$。小数位数多并不代表小数大。",
      ),
      generate(rng) {
        const w = rng.int(0, 9);
        const tenthsOnly = rng.bool(0.5);
        const x = 100 * w + (tenthsOnly ? 10 * rng.int(1, 9) : rng.int(1, 99));
        let y: number;
        do y = 100 * w + rng.int(1, 99);
        while (y % 10 === 0 || y === x);
        const fx = (v: number) => (v % 10 === 0 ? dec(v / 10, 1) : dec(v, 2));
        const swap = rng.bool();
        const [a, b] = swap ? [y, x] : [x, y];
        const rel = relation(qf(a, 100), qf(b, 100));
        return compareProblem(
          fx(a),
          fx(b),
          rel,
          t(
            `With two decimal places: $${dec(a, 2)}$ and $${dec(b, 2)}$. So $${fx(a)} ${symbols[rel]} ${fx(b)}$.`,
            `写成两位小数：$${dec(a, 2)}$ 与 $${dec(b, 2)}$。所以 $${fx(a)} ${symbols[rel]} ${fx(b)}$。`,
          ),
        );
      },
    },
    {
      id: "finding-the-greatest-decimal",
      title: t("The greatest decimal", "最大的小数"),
      explanation: t(
        "To find the greatest decimal, give them all the same number of decimal places, then compare the tenths first and the hundredths only if the tenths are equal.\n\nOf $0.4$, $0.38$, $0.42$ and $0.09$, written $0.40$, $0.38$, $0.42$ and $0.09$, the greatest is $0.42$.",
        "在几个小数中找最大的，先把它们都写成相同的小数位数，再先比十分位，十分位相同时才比百分位。\n\n$0.4$、$0.38$、$0.42$、$0.09$ 写成 $0.40$、$0.38$、$0.42$、$0.09$，最大的是 $0.42$。",
      ),
      generate(rng) {
        const w = rng.int(0, 5);
        const vals = new Set<number>();
        while (vals.size < 4) vals.add(100 * w + rng.pick([10 * rng.int(1, 9), rng.int(1, 99)]));
        const list = [...vals];
        const fx = (v: number) => (v % 10 === 0 ? dec(v / 10, 1) : dec(v, 2));
        const asc = rng.bool(0.35);
        const best = asc ? Math.min(...list) : Math.max(...list);
        return pickChoice(
          rng,
          asc
            ? t(`Which is the least: $${list.map(fx).join("$, $")}$?`, `$${list.map(fx).join("$、$")}$ 中哪个最小？`)
            : t(`Which is the greatest: $${list.map(fx).join("$, $")}$?`, `$${list.map(fx).join("$、$")}$ 中哪个最大？`),
          mathText(fx(best)),
          list.filter((v) => v !== best).map((v) => mathText(fx(v))),
          t(
            `With two decimal places: $${[...list]
              .sort((p, q) => p - q)
              .map((v) => dec(v, 2))
              .join(" < ")}$.`,
            `写成两位小数：$${[...list]
              .sort((p, q) => p - q)
              .map((v) => dec(v, 2))
              .join(" < ")}$。`,
          ),
        );
      },
    },
  ],
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
    {
      id: "fractions-with-denominators-ten-and-hundred",
      title: t("Tenths and hundredths", "十分之几和百分之几"),
      explanation: t(
        "A fraction with denominator $10$ has one decimal place, and one with denominator $100$ has two. Write the numerator so that its last digit lands in the tenths or hundredths place, adding zeros if needed.\n\n$\\frac{9}{100} = 0.09$, not $0.9$: nine hundredths has a $0$ in the tenths place.",
        "分母是 $10$ 的分数写成一位小数，分母是 $100$ 的写成两位小数。写分子时，让它的最后一位落在十分位或百分位上，位数不够就补 $0$。\n\n$\\frac{9}{100} = 0.09$，而不是 $0.9$：百分之九的十分位上是 $0$。",
      ),
      generate(rng) {
        const den = rng.pick([10, 100]);
        let n: number;
        do n = den === 10 ? rng.int(1, 99) : rng.int(1, 999);
        while (n % 10 === 0);
        return numberProblem({
          prompt: t(`Write $${fr(n, den)}$ as a decimal.`, `把 $${fr(n, den)}$ 写成小数。`),
          answer: qf(n, den),
          form: "decimal",
          wrong: [qf(n, den === 10 ? 100 : 10), qf(n, den * 10)],
          solution: t(
            `Dividing by $${den}$ moves the decimal point of $${n}$ ${den === 10 ? "one place" : "two places"} to the left: $${fr(n, den)} = ${dec(n, den === 10 ? 1 : 2)}$.`,
            `除以 $${den}$ 就是把 $${n}$ 的小数点向左移动${den === 10 ? "一" : "两"}位：$${fr(n, den)} = ${dec(n, den === 10 ? 1 : 2)}$。`,
          ),
        });
      },
    },
    {
      id: "fractions-with-denominators-dividing-a-hundred",
      title: t("Other denominators", "其他分母"),
      explanation: t(
        "If the denominator divides $10$ or $100$, first write an equal fraction with denominator $10$ or $100$ by multiplying the numerator and the denominator by the same number. Then write it as a decimal.\n\n$\\frac{7}{20} = \\frac{7 \\times 5}{20 \\times 5} = \\frac{35}{100} = 0.35$.",
        "如果分母能整除 $10$ 或 $100$，先把分子分母同时乘同一个数，化成分母是 $10$ 或 $100$ 的分数，再写成小数。\n\n$\\frac{7}{20} = \\frac{7 \\times 5}{20 \\times 5} = \\frac{35}{100} = 0.35$。",
      ),
      generate(rng) {
        const d = rng.pick(decimalDenominators);
        const n = coprimeTo(rng, d, 1, d - 1);
        const k = 100 / d;
        return numberProblem({
          prompt: t(`Write $${fr(n, d)}$ as a decimal.`, `把 $${fr(n, d)}$ 写成小数。`),
          answer: qf(n, d),
          form: "decimal",
          wrong: [qf(n, 10), qf(d, 100), qf(n, 100)],
          solution: t(
            `$${fr(n, d)} = ${fr(n * k, 100)} = ${dec(n * k, 2).replace(/0$/, "")}$.`,
            `$${fr(n, d)} = ${fr(n * k, 100)} = ${dec(n * k, 2).replace(/0$/, "")}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "mixed-numbers-with-tenths-and-hundredths",
      title: t("Tenths and hundredths", "十分之几和百分之几"),
      explanation: t(
        "The whole-number part of a mixed number goes to the left of the decimal point, and the fraction part becomes the digits to the right. Hundredths need two places, so a fraction under ten hundredths needs a $0$ in the tenths place.\n\n$5\\frac{3}{100} = 5.03$, not $5.3$.",
        "带分数的整数部分写在小数点左边，分数部分写成小数点右边的数字。百分之几要占两位，所以不足十个百分之一时，十分位上要写 $0$。\n\n$5\\frac{3}{100} = 5.03$，而不是 $5.3$。",
      ),
      generate(rng) {
        const w = rng.int(1, 20);
        const den = rng.pick([10, 100]);
        let r: number;
        do r = rng.int(1, den - 1);
        while (r % 10 === 0);
        return numberProblem({
          prompt: t(`Write $${mx(w, r, den)}$ as a decimal.`, `把 $${mx(w, r, den)}$ 写成小数。`),
          answer: qf(w * den + r, den),
          form: "decimal",
          wrong: [
            qf(w * 100 + r, den === 10 ? 100 : 1000),
            qf(w * 10 + r, 10 * (den === 10 ? 10 : 1)).eq(qf(w * den + r, den)) ? w + 1 : qf(w * 10 + r, 10),
            w + r,
          ],
          solution: t(
            `$${w}$ wholes and $${fr(r, den)} = ${dec(r, den === 10 ? 1 : 2)}$ make $${dec(w * den + r, den === 10 ? 1 : 2)}$.`,
            `$${w}$ 加上 $${fr(r, den)} = ${dec(r, den === 10 ? 1 : 2)}$ 是 $${dec(w * den + r, den === 10 ? 1 : 2)}$。`,
          ),
        });
      },
    },
    {
      id: "mixed-numbers-with-other-denominators",
      title: t("Other denominators", "其他分母"),
      explanation: t(
        "Keep the whole number, and rewrite the fraction part with denominator $10$ or $100$ first. Then write the decimal.\n\n$4\\frac{3}{5} = 4\\frac{6}{10} = 4.6$, since $\\frac{3}{5} = \\frac{6}{10}$.",
        "整数部分不变，先把分数部分化成分母是 $10$ 或 $100$ 的分数，再写成小数。\n\n$4\\frac{3}{5} = 4\\frac{6}{10} = 4.6$，因为 $\\frac{3}{5} = \\frac{6}{10}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 20);
        const d = rng.pick(decimalDenominators);
        const n = coprimeTo(rng, d, 1, d - 1);
        const k = 100 / d;
        const s = dec(w * 100 + n * k, 2).replace(/0$/, "");
        return numberProblem({
          prompt: t(`Write $${mx(w, n, d)}$ as a decimal.`, `把 $${mx(w, n, d)}$ 写成小数。`),
          answer: qf(w * d + n, d),
          form: "decimal",
          wrong: [qf(w * 10 + n, 10), qf(w * 100 + d, 100), qf(n * k, 100)],
          solution: t(
            `$${fr(n, d)} = ${fr(n * k, 100)}$, so $${mx(w, n, d)} = ${s}$.`,
            `$${fr(n, d)} = ${fr(n * k, 100)}$，所以 $${mx(w, n, d)} = ${s}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "decimals-as-tenths-and-hundredths",
      title: t("Tenths and hundredths", "十分之几和百分之几"),
      explanation: t(
        "The number of decimal places tells the denominator: one place means tenths, two places mean hundredths. The digits after the point, read as a whole number, give the numerator.\n\n$0.07 = \\frac{7}{100}$ and $0.3 = \\frac{3}{10}$.",
        "小数的位数决定分母：一位小数是十分之几，两位小数是百分之几。小数点后面的数字作为一个整数读，就是分子。\n\n$0.07 = \\frac{7}{100}$，$0.3 = \\frac{3}{10}$。",
      ),
      generate(rng) {
        const tenths = rng.bool(0.3);
        const den = tenths ? 10 : 100;
        const n = coprimeTo(rng, den, 1, den - 1);
        return numberProblem({
          prompt: t(`Write $${dec(n, tenths ? 1 : 2)}$ as a fraction.`, `把 $${dec(n, tenths ? 1 : 2)}$ 写成分数。`),
          answer: qf(n, den),
          form: "fraction",
          wrong: [qf(n, tenths ? 100 : 10), qf(n, 1000)],
          solution: t(
            `$${dec(n, tenths ? 1 : 2)}$ is $${n}$ ${tenths ? "tenths" : "hundredths"}: $${fr(n, den)}$.`,
            `$${dec(n, tenths ? 1 : 2)}$ 表示${tenths ? "十" : "百"}分之 $${n}$：$${fr(n, den)}$。`,
          ),
        });
      },
    },
    {
      id: "decimals-as-fractions-in-lowest-terms",
      title: t("In lowest terms", "化成最简分数"),
      explanation: t(
        "Write the decimal as tenths or hundredths, then divide the numerator and the denominator by their greatest common factor.\n\n$0.75 = \\frac{75}{100} = \\frac{3}{4}$, dividing both by $25$.",
        "先把小数写成十分之几或百分之几，再用分子和分母的最大公因数同时去除。\n\n$0.75 = \\frac{75}{100} = \\frac{3}{4}$，分子分母同时除以 $25$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(2, 98);
        while (gcd(n, 100) === 1);
        const v = qf(n, 100);
        const s = n % 10 === 0 ? dec(n / 10, 1) : dec(n, 2);
        return numberProblem({
          prompt: t(`Write $${s}$ as a fraction in lowest terms.`, `把 $${s}$ 写成最简分数。`),
          answer: v,
          form: "fraction",
          wrong: [
            qf(n, 10).eq(v) ? qf(n + 1, 100) : qf(n % 10 === 0 ? n / 10 : n, 100).eq(v) ? qf(1, n) : qf(n, 1000),
            qf(Number(v.n) + 1, Number(v.d)),
          ],
          solution: t(
            `$${s} = ${fr(n, 100)} = ${v.toLatex()}$, dividing by $${gcd(n, 100)}$.`,
            `$${s} = ${fr(n, 100)} = ${v.toLatex()}$，分子分母同时除以 $${gcd(n, 100)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "decimals-as-mixed-numbers-with-tenths-and-hundredths",
      title: t("Tenths and hundredths", "十分之几和百分之几"),
      explanation: t(
        "The digits before the decimal point are the whole-number part. The digits after it become a fraction over $10$ or $100$, depending on how many decimal places there are.\n\n$6.07 = 6\\frac{7}{100}$ and $2.9 = 2\\frac{9}{10}$.",
        "小数点前面的数是整数部分。小数点后面的数字写成分母是 $10$ 或 $100$ 的分数，看有几位小数而定。\n\n$6.07 = 6\\frac{7}{100}$，$2.9 = 2\\frac{9}{10}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 20);
        const tenths = rng.bool(0.3);
        const den = tenths ? 10 : 100;
        const n = coprimeTo(rng, den, 1, den - 1);
        const s = dec(w * den + n, tenths ? 1 : 2);
        return numberProblem({
          prompt: t(`Write $${s}$ as a mixed number.`, `把 $${s}$ 写成带分数。`),
          answer: qf(w * den + n, den),
          form: "mixed",
          wrong: [mixedValue(w, n, tenths ? 100 : 10), qf(n, den), w],
          solution: t(
            `The whole-number part is $${w}$, and the digits after the point are $${n}$ ${tenths ? "tenths" : "hundredths"}: $${s} = ${w} + ${fr(n, den)} = ${mx(w, n, den)}$.`,
            `整数部分是 $${w}$，小数点后的数字表示 $${n}$ 个${tenths ? "十分之一" : "百分之一"}：$${s} = ${w} + ${fr(n, den)} = ${mx(w, n, den)}$。`,
          ),
        });
      },
    },
    {
      id: "decimals-as-mixed-numbers-in-lowest-terms",
      title: t("In lowest terms", "化成最简形式"),
      explanation: t(
        "Write the whole-number part, turn the decimal part into tenths or hundredths, and then simplify the fraction part. The whole number does not change.\n\n$4.6 = 4\\frac{6}{10} = 4\\frac{3}{5}$.",
        "先写出整数部分，把小数部分化成十分之几或百分之几，再把分数部分约分。整数部分不变。\n\n$4.6 = 4\\frac{6}{10} = 4\\frac{3}{5}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 20);
        let n: number;
        do n = rng.int(2, 98);
        while (gcd(n, 100) === 1);
        const v = qf(n, 100);
        const s = n % 10 === 0 ? dec(w * 10 + n / 10, 1) : dec(w * 100 + n, 2);
        return numberProblem({
          prompt: t(`Write $${s}$ as a mixed number in lowest terms.`, `把 $${s}$ 写成带分数，分数部分要最简。`),
          answer: qf(w * 100 + n, 100),
          form: "mixed",
          wrong: [mixedValue(w, Number(v.n) + 1, Number(v.d)), v, w + 1],
          solution: t(
            `$${s} = ${mx(w, n, 100)} = ${mixedLatex(qf(w * 100 + n, 100))}$.`,
            `$${s} = ${mx(w, n, 100)} = ${mixedLatex(qf(w * 100 + n, 100))}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "adding-tenths-and-hundredths-as-fractions",
      title: t("As a fraction", "写成分数"),
      explanation: t(
        "Tenths and hundredths are different sizes, so they cannot be added directly. Rewrite the tenths as hundredths, then add the numerators.\n\n$\\frac{6}{10} + \\frac{23}{100} = \\frac{60}{100} + \\frac{23}{100} = \\frac{83}{100}$, not $\\frac{29}{110}$.",
        "十分之几和百分之几每份的大小不同，不能直接相加。先把十分之几化成百分之几，再把分子相加。\n\n$\\frac{6}{10} + \\frac{23}{100} = \\frac{60}{100} + \\frac{23}{100} = \\frac{83}{100}$，而不是 $\\frac{29}{110}$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 99 - 10 * a);
        return numberProblem({
          prompt: t(
            `Fill in the box: $$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
            `填空：$$${fr(a, 10)} + ${fr(b, 100)} = \\frac{\\square}{100}$$`,
          ),
          answer: 10 * a + b,
          form: "integer",
          wrong: [a + b, 100 * a + b, 10 * b + a],
          solution: t(
            `$${fr(a, 10)} = ${fr(10 * a, 100)}$, so the sum is $${fr(10 * a + b, 100)}$.`,
            `$${fr(a, 10)} = ${fr(10 * a, 100)}$，所以和是 $${fr(10 * a + b, 100)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-tenths-and-hundredths-as-decimals",
      title: t("As a decimal", "写成小数"),
      explanation: t(
        "Rewrite the tenths as hundredths, add the numerators, and then write the hundredths as a decimal with two decimal places.\n\n$\\frac{4}{10} + \\frac{38}{100} = \\frac{40}{100} + \\frac{38}{100} = \\frac{78}{100} = 0.78$.",
        "先把十分之几化成百分之几，分子相加，再把百分之几写成两位小数。\n\n$\\frac{4}{10} + \\frac{38}{100} = \\frac{40}{100} + \\frac{38}{100} = \\frac{78}{100} = 0.78$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 99);
        const s = 10 * a + b;
        return numberProblem({
          prompt: t(
            `Find $${fr(a, 10)} + ${fr(b, 100)}$. Give the answer as a decimal.`,
            `计算 $${fr(a, 10)} + ${fr(b, 100)}$，答案写成小数。`,
          ),
          answer: qf(s, 100),
          form: "decimal",
          wrong: [qf(a + b, 100), qf(a + b, 10), qf(100 * a + b, 100)],
          solution: t(
            `$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(s, 100)} = ${dec(s, 2).replace(/0$/, "")}$.`,
            `$${fr(10 * a, 100)} + ${fr(b, 100)} = ${fr(s, 100)} = ${dec(s, 2).replace(/0$/, "")}$。`,
          ),
        });
      },
    },
  ],
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
