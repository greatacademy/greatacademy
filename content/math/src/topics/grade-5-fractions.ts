import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, Q, svgDocument } from "@ga/subject-math";
import { mixedLatex } from "../problems.ts";
import { type Pair, picked, pickedMath, type Walk } from "./early-grades-more-kit.ts";
import { barFigure, coprimeTo, fr, mx, properFraction, twoBarsFigure } from "./grade-4-fractions.ts";
import { answered, areaGridFigure, equalTape, lineFigure, pieceText, point, tapeFigure } from "./upper-grades-kit.ts";

// 5th Grade Math: adding and subtracting fractions and mixed numbers with unlike denominators, and multiplying and dividing fractions.

/** qf is the rational number n/d. */
const qf = (n: number, d: number) => Q.of(n, d);

/** mq writes a rational number as an integer, a mixed number or a proper fraction. */
const mq = (q: Q) => mixedLatex(q);

/** mixedValue is the value of w r/d. */
const mixedValue = (w: number, r: number, d: number) => qf(w * d + r, d);

/** lowest is n/d in lowest terms, as LaTeX. */
const lowest = (n: number, d: number) => qf(n, d).toLatex();

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
  intro?: Text,
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: ccss(...standards),
    knowledgePoints,
    ...(intro && { intro }),
  };
}

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

// ---------------------------------------------------------------------------
// Figures

const round = (x: number) => Math.round(x * 100) / 100;

/** CellStyle is how a part of a bar is drawn: plain, shaded, lightly shaded, or crossed out. */
type CellStyle = "" | "shade" | "light" | "cross";

/** barsSvg draws `count` bars, each cut into d equal parts, styling part i (in reading order) by style(i). */
function barsSvg(count: number, d: number, style: (i: number) => CellStyle): string {
  const w = 280;
  const h = 26;
  let body = "";
  for (let b = 0; b < count; b++) {
    const y = 8 + b * (h + 12);
    for (let i = 0; i < d; i++) {
      const x = round(20 + (i * w) / d);
      const s = style(b * d + i);
      const fill =
        s === "shade"
          ? ' class="accent" fill="currentColor" fill-opacity="0.35"'
          : s === "light"
            ? ' class="accent" fill="currentColor" fill-opacity="0.12"'
            : "";
      body += `<rect x="${x}" y="${y}" width="${round(w / d)}" height="${h}"${fill}/>`;
      if (s === "cross")
        body += `<line x1="${x + 3}" y1="${y + 3}" x2="${round(x + w / d - 3)}" y2="${y + h - 3}"/><line x1="${x + 3}" y1="${y + h - 3}" x2="${round(x + w / d - 3)}" y2="${y + 3}"/>`;
    }
  }
  return svgDocument(count * (h + 12) + 6, body);
}

/** takeAwayFigure shows w wholes cut into d parts with the last a parts crossed out. */
function takeAwayFigure(w: number, a: number, d: number): Figure {
  return {
    svg: barsSvg(w, d, (i) => (i >= w * d - a ? "cross" : "shade")),
    alt: t(
      `${w === 1 ? "A bar cut" : "Equal bars, each cut"} into equal parts; some parts are crossed out and the rest are shaded.`,
      `${w === 1 ? "一个长条，平均分成" : "几个同样的长条，每个都平均分成"}几份；划掉了一些，其余的涂了颜色。`,
    ),
  };
}

/** groupedBarsFigure shows w wholes cut into d parts, with the parts colored in alternating groups of g. */
export function groupedBarsFigure(w: number, d: number, g: number): Figure {
  return {
    svg: barsSvg(w, d, (i) => (Math.floor(i / g) % 2 === 0 ? "shade" : "light")),
    alt: t(
      `${w === 1 ? "A bar" : `${w} equal bars`} cut into ${d} equal parts each; groups of ${g} parts are colored dark and light in turn.`,
      `${w === 1 ? "一个长条" : `${w} 个同样的长条`}，每个平均分成 ${d} 份；每 ${g} 份一组，深浅颜色交替。`,
    ),
  };
}

/** productGrid draws a unit square cut into d columns and b rows, with the first a columns and the top c rows shaded, so that the overlap is darker. */
export function productGrid(a: number, d: number, c: number, b: number): Figure {
  const W = 200;
  const H = 160;
  const x0 = 60;
  const y0 = 8;
  let body = `<rect class="accent" x="${x0}" y="${y0}" width="${round((a * W) / d)}" height="${H}" fill="currentColor" fill-opacity="0.2" stroke="none"/>`;
  body += `<rect class="accent" x="${x0}" y="${y0}" width="${W}" height="${round((c * H) / b)}" fill="currentColor" fill-opacity="0.2" stroke="none"/>`;
  body += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}"/>`;
  for (let i = 1; i < d; i++) body += `<line x1="${round(x0 + (i * W) / d)}" y1="${y0}" x2="${round(x0 + (i * W) / d)}" y2="${y0 + H}"/>`;
  for (let j = 1; j < b; j++) body += `<line x1="${x0}" y1="${round(y0 + (j * H) / b)}" x2="${x0 + W}" y2="${round(y0 + (j * H) / b)}"/>`;
  return {
    svg: svgDocument(H + 16, body),
    alt: t(
      `A unit square cut into ${d} equal columns and ${b} equal rows. ${a} column${a === 1 ? " is" : "s are"} shaded and ${c} row${c === 1 ? " is" : "s are"} shaded; ${a * c} small rectangle${a * c === 1 ? " is" : "s are"} shaded twice.`,
      `一个单位正方形被平均分成 ${d} 列、${b} 行。其中 ${a} 列涂了颜色，${c} 行也涂了颜色；有 ${a * c} 个小长方形被涂了两次。`,
    ),
  };
}

/** splitPartsFigure draws a bar cut into d columns with a columns shaded, every column cut into n rows, and the top row of the shaded columns darker. */
function splitPartsFigure(a: number, d: number, n: number): Figure {
  const W = 280;
  const H = 90;
  const x0 = 20;
  const y0 = 8;
  let body = `<rect class="accent" x="${x0}" y="${y0}" width="${round((a * W) / d)}" height="${H}" fill="currentColor" fill-opacity="0.15" stroke="none"/>`;
  body += `<rect class="accent" x="${x0}" y="${y0}" width="${round((a * W) / d)}" height="${round(H / n)}" fill="currentColor" fill-opacity="0.35" stroke="none"/>`;
  body += `<rect x="${x0}" y="${y0}" width="${W}" height="${H}"/>`;
  for (let i = 1; i < d; i++) body += `<line x1="${round(x0 + (i * W) / d)}" y1="${y0}" x2="${round(x0 + (i * W) / d)}" y2="${y0 + H}"/>`;
  for (let j = 1; j < n; j++)
    body += `<line x1="${x0}" y1="${round(y0 + (j * H) / n)}" x2="${x0 + W}" y2="${round(y0 + (j * H) / n)}" stroke-dasharray="4 3"/>`;
  return {
    svg: svgDocument(H + 16, body),
    alt: t(
      `A bar cut into ${d} equal columns with ${a} column${a === 1 ? "" : "s"} shaded. Dashed lines cut the bar into ${n} equal rows, and the top row of the shaded part is darker.`,
      `一个长条平均分成 ${d} 列，其中 ${a} 列涂了颜色。虚线把长条平均分成 ${n} 行，涂色部分最上面一行颜色更深。`,
    ),
  };
}

// ---------------------------------------------------------------------------
// Adding and subtracting fractions and whole numbers

/** stepLine draws a number line from lo to hi in steps of 1/d, with the whole numbers labeled, points marked with text and jumps between values. */
const stepLine = (d: number, lo: number, hi: number, marks: readonly [number, string][], jumps: readonly [number, number][] = []): Figure =>
  lineFigure(
    {
      lo,
      hi,
      step: 1 / d,
      labels: Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
      marks: marks.map(([at, text]) => ({ at, text })),
      jumps,
    },
    [
      `A number line from ${lo} to ${hi} in steps of 1/${d}, with ${marks.map((m) => m[1]).join(" and ")} marked.`,
      `一条从 ${lo} 到 ${hi} 的数轴，每格是 1/${d}，标出了 ${marks.map((m) => m[1]).join(" 和 ")}。`,
    ],
  );

/** sumTape draws a bar made of labeled pieces with the last piece lit and the total above. */
const sumTape = (pieces: readonly [number, string][], total: string): Figure =>
  tapeFigure(
    [{ total, pieces: pieces.map(([size, text], i) => ({ size, text, lit: i === pieces.length - 1 })) }],
    [
      `A bar for ${total} made of ${pieces.map((p) => p[1]).join(" and ")}.`,
      `表示 ${total} 的长条，由 ${pieces.map((p) => p[1]).join(" 和 ")} 组成。`,
    ],
  );

/** mixedText writes w r/d as plain text for a figure. */
const mixedText = (w: number, r: number, d: number) => (r === 0 ? `${w}` : w === 0 ? `${r}/${d}` : `${w} ${r}/${d}`);

/** reduced writes n/d and, when it can be simplified, its lowest terms after an equals sign. */
const reduced = (n: number, d: number) => (gcd(n, d) > 1 ? `${fr(n, d)} = ${lowest(n, d)}` : fr(n, d));

export const addingFractionsAndWholeNumbersUsingModels = topic(
  "adding-fractions-and-whole-numbers-using-models",
  t("Adding Fractions and Whole Numbers Using Models", "用模型做整数与分数的加法"),
  t(
    "In a model, a whole number is a number of full bars and a fraction is part of a bar. 2 full bars and 3/4 of a bar make 2 + 3/4 = 2 3/4. When the fraction is improper, it fills more bars: 2 + 5/4 = 2 + 1 + 1/4 = 3 1/4.",
    "在模型中，整数是若干个涂满的长条，分数是一个长条的一部分。2 个涂满的长条和 3/4 个长条合起来是 2 + 3/4 = 2 3/4。如果分数是假分数，它会再涂满一些长条：2 + 5/4 = 2 + 1 + 1/4 = 3 1/4。",
  ),
  ["models-for-mixed-numbers", "adding-fractions-with-like-denominators-using-models"],
  ["4.NF.B.3"],
  [
    point(
      "whole-number-plus-proper-fraction-models",
      ["A whole number plus a proper fraction", "整数加真分数"],
      [
        "3 bars are full and $\\frac{2}{5}$ of another bar is shaded. The model shows $3 + \\frac{2}{5} = 3\\frac{2}{5}$.\n\nCheck: count fifths. $15 + 2 = 17$ fifths, and $\\frac{17}{5} = 3\\frac{2}{5}$.\n\n> **Watch out.** Do not add the 3 to the top. $\\frac{5}{5}$ is only one bar.",
        "3 个长条涂满，另一个长条涂了 $\\frac{2}{5}$。模型表示 $3 + \\frac{2}{5} = 3\\frac{2}{5}$。\n\n检验：按五分之一来数，$15 + 2 = 17$ 个五分之一，$\\frac{17}{5} = 3\\frac{2}{5}$。\n\n> **注意。** 不要把 3 加到分子上。$\\frac{5}{5}$ 只是一个长条。",
      ],
      (rng) => {
        const w = rng.int(1, 4);
        const [a, d] = properFraction(rng, 10, 3);
        const total = w * d + a;
        return answered(
          [`The model shows $${w} + ${fr(a, d)}$. What is the sum?`, `模型表示 $${w} + ${fr(a, d)}$。和是多少？`],
          mixedValue(w, a, d),
          [
            [
              ["Count the full bars", "数满条"],
              [`${w} bar${w === 1 ? " is" : "s are"} full.`, `有 ${w} 个长条涂满了。`],
            ],
            [
              ["Read the last bar", "看最后一个长条"],
              [`$${fr(a, d)}$ of the last bar is shaded.`, `最后一个长条涂了 $${fr(a, d)}$。`],
              [`${w} + ${fr(a, d)} = ${mx(w, a, d)}`],
            ],
          ],
          [
            `Count the parts. $${w} \\times ${d} + ${a} = ${total}$ parts, and $${fr(total, d)} = ${mx(w, a, d)}$.`,
            `数份数：$${w} \\times ${d} + ${a} = ${total}$ 份，$${fr(total, d)} = ${mx(w, a, d)}$。`,
          ],
          [
            [qf(w + a, d), "That adds the whole number to the top.", "这是把整数加到分子上了。"],
            [qf(a, d + w), "That adds the whole number to the bottom.", "这是把整数加到分母上了。"],
            [qf(w * a, d), "That multiplies the whole number by the top.", "这是用整数乘分子了。"],
          ],
          { form: "mixed", figure: barFigure(d, total, w + 1) },
        );
      },
      barFigure(5, 17, 4),
    ),
    point(
      "whole-number-plus-improper-fraction-models",
      ["A whole number plus an improper fraction", "整数加假分数"],
      [
        "For $1 + \\frac{7}{3}$, the $\\frac{7}{3}$ fills 2 bars with $\\frac{1}{3}$ more. With the 1 full bar, that is 3 full bars and $\\frac{1}{3}$. The sum is $3\\frac{1}{3}$.\n\nCheck: count thirds. $3 + 7 = 10$ thirds, and $\\frac{10}{3} = 3\\frac{1}{3}$.\n\n> **Watch out.** $\\frac{7}{3}$ is more than one bar. Count the full bars it fills.",
        "计算 $1 + \\frac{7}{3}$：$\\frac{7}{3}$ 涂满 2 个长条，还多 $\\frac{1}{3}$。加上原来的 1 个满条，一共是 3 个满条和 $\\frac{1}{3}$。和是 $3\\frac{1}{3}$。\n\n检验：按三分之一来数，$3 + 7 = 10$ 个三分之一，$\\frac{10}{3} = 3\\frac{1}{3}$。\n\n> **注意。** $\\frac{7}{3}$ 比一个长条多，它涂满的长条也要数上。",
      ],
      (rng) => {
        const w = rng.int(1, 3);
        const d = rng.int(3, 8);
        const a = coprimeTo(rng, d, d + 1, 2 * d - 1);
        const total = w * d + a;
        return answered(
          [
            `The model shows $${w} + ${fr(a, d)}$. What is the sum, as a mixed number?`,
            `模型表示 $${w} + ${fr(a, d)}$。和是多少？用带分数表示。`,
          ],
          qf(total, d),
          [
            [
              ["Split the fraction", "拆开假分数"],
              [`$${fr(a, d)}$ fills 1 bar with $${fr(a - d, d)}$ more.`, `$${fr(a, d)}$ 涂满 1 个长条，还多 $${fr(a - d, d)}$。`],
              [`${fr(a, d)} = 1${fr(a - d, d)}`],
            ],
            [
              ["Add the full bars", "加满条"],
              [`Put that bar with the ${w} full bar${w === 1 ? "" : "s"}.`, `把这个满条和原来的 ${w} 个满条合起来。`],
              [`${w} + 1${fr(a - d, d)} = ${mx(w + 1, a - d, d)}`],
            ],
          ],
          [
            `Count the parts. $${w} \\times ${d} + ${a} = ${total}$ parts, and $${fr(total, d)} = ${mx(w + 1, a - d, d)}$.`,
            `数份数：$${w} \\times ${d} + ${a} = ${total}$ 份，$${fr(total, d)} = ${mx(w + 1, a - d, d)}$。`,
          ],
          [
            [mixedValue(w, a - d, d), "That forgets the full bar that the fraction fills.", "这里漏了假分数涂满的那个长条。"],
            [qf(w + a, d), "That adds the whole number to the top.", "这是把整数加到分子上了。"],
            [qf(a, d), "That leaves out the whole number.", "这里漏了整数。"],
          ],
          { form: "mixed", figure: barFigure(d, total, w + 2) },
        );
      },
      barFigure(3, 10, 4),
    ),
  ],
  t(
    "Ava has 2 full bottles of juice and $\\frac{3}{4}$ of another. Together that is $2 + \\frac{3}{4} = 2\\frac{3}{4}$ bottles.\n\nCheck: count fourths. $8 + 3 = 11$ fourths, and $\\frac{11}{4} = 2\\frac{3}{4}$.\n\nIn this lesson we add whole numbers and fractions with bar models.",
    "阿娃有 2 整瓶果汁，还有一瓶的 $\\frac{3}{4}$。合起来是 $2 + \\frac{3}{4} = 2\\frac{3}{4}$ 瓶。\n\n检验：按四分之一来数，$8 + 3 = 11$ 个四分之一，$\\frac{11}{4} = 2\\frac{3}{4}$。\n\n本课我们用长条模型做整数与分数的加法。",
  ),
);

export const addingFractionsAndWholeNumbers = topic(
  "adding-fractions-and-whole-numbers",
  t("Adding Fractions and Whole Numbers", "整数与分数的加法"),
  t(
    "A whole number plus a proper fraction is a mixed number: 5 + 2/7 = 5 2/7. To add a whole number and a mixed number, add the whole numbers and keep the fraction: 4 + 2 1/3 = 6 1/3. An improper fraction is first written as a mixed number: 3 + 9/4 = 3 + 2 1/4 = 5 1/4.",
    "整数加真分数就得到带分数：5 + 2/7 = 5 2/7。整数加带分数，整数部分相加，分数部分不变：4 + 2 1/3 = 6 1/3。加假分数时先把它化成带分数：3 + 9/4 = 3 + 2 1/4 = 5 1/4。",
  ),
  ["adding-fractions-and-whole-numbers-using-models", "converting-improper-fractions-to-mixed-numbers"],
  ["4.NF.B.3"],
  [
    point(
      "adding-whole-numbers-and-mixed-numbers",
      ["Whole numbers and mixed numbers", "整数加带分数"],
      [
        "$7 + 3\\frac{5}{8} = 10\\frac{5}{8}$, because $7 + 3 = 10$ and the $\\frac{5}{8}$ stays the same.\n\nCheck: $10\\frac{5}{8} - 7 = 3\\frac{5}{8}$.\n\n> **Watch out.** Add the whole number to the whole part, not to the top of the fraction.",
        "$7 + 3\\frac{5}{8} = 10\\frac{5}{8}$，因为 $7 + 3 = 10$，$\\frac{5}{8}$ 不变。\n\n检验：$10\\frac{5}{8} - 7 = 3\\frac{5}{8}$。\n\n> **注意。** 整数要加到整数部分，不能加到分子上。",
      ],
      (rng) => {
        const w = rng.int(1, 15);
        const v = rng.int(1, 9);
        const [a, d] = properFraction(rng, 12, 3);
        return answered(
          [`Find $${w} + ${mx(v, a, d)}$.`, `计算 $${w} + ${mx(v, a, d)}$。`],
          mixedValue(w + v, a, d),
          [
            [
              ["Add the whole numbers", "整数部分相加"],
              ["A mixed number is a whole number and a fraction.", "带分数由整数部分和分数部分组成。"],
              [`${w} + ${v} = ${w + v}`],
            ],
            [
              ["Keep the fraction", "分数部分不变"],
              ["Nothing is added to the fraction.", "分数部分没有加东西。"],
              [`${w} + ${mx(v, a, d)} = ${mx(w + v, a, d)}`],
            ],
          ],
          [`Subtract back: $${mx(w + v, a, d)} - ${w} = ${mx(v, a, d)}$.`, `减回去：$${mx(w + v, a, d)} - ${w} = ${mx(v, a, d)}$。`],
          [
            [mixedValue(v, a + w, d), "That adds the whole number to the top of the fraction.", "这是把整数加到分子上了。"],
            [mixedValue(w * v, a, d), "That multiplies the whole numbers.", "这是把整数相乘了。"],
            [mixedValue(w + v + 1, a, d), "That adds one whole too many.", "多加了一个整数。"],
          ],
          {
            form: "mixed",
            figure: sumTape(
              [
                [w, `${w}`],
                [v + a / d, mixedText(v, a, d)],
              ],
              "?",
            ),
          },
        );
      },
      sumTape(
        [
          [7, "7"],
          [3.625, "3 5/8"],
        ],
        "?",
      ),
    ),
    point(
      "adding-whole-numbers-and-improper-fractions",
      ["Whole numbers and improper fractions", "整数加假分数"],
      [
        "For $4 + \\frac{11}{3}$, first write $\\frac{11}{3}$ as a mixed number. $11 \\div 3 = 3$ R 2, so $\\frac{11}{3} = 3\\frac{2}{3}$. Then $4 + 3\\frac{2}{3} = 7\\frac{2}{3}$.\n\nCheck: in thirds, $\\frac{12}{3} + \\frac{11}{3} = \\frac{23}{3} = 7\\frac{2}{3}$.\n\n> **Watch out.** Do not leave the whole numbers inside the fraction. $4\\frac{11}{3}$ is not finished.",
        "计算 $4 + \\frac{11}{3}$，先把 $\\frac{11}{3}$ 化成带分数。$11 \\div 3 = 3$ 余 2，所以 $\\frac{11}{3} = 3\\frac{2}{3}$。再算 $4 + 3\\frac{2}{3} = 7\\frac{2}{3}$。\n\n检验：都化成三分之几，$\\frac{12}{3} + \\frac{11}{3} = \\frac{23}{3} = 7\\frac{2}{3}$。\n\n> **注意。** 假分数里的整数要拿出来。$4\\frac{11}{3}$ 还没有算完。",
      ],
      (rng) => {
        const w = rng.int(1, 12);
        const d = rng.int(2, 9);
        const a = coprimeTo(rng, d, d + 1, 4 * d - 1);
        const k = Math.floor(a / d);
        const r = a % d;
        return answered(
          [`Find $${w} + ${fr(a, d)}$. Write the answer as a mixed number.`, `计算 $${w} + ${fr(a, d)}$，结果写成带分数。`],
          qf(w * d + a, d),
          [
            [
              ["Write a mixed number", "化成带分数"],
              ["Divide the top by the bottom.", "用分子除以分母。"],
              [`${a} \\div ${d} = ${k} \\text{ R } ${r}`, `${fr(a, d)} = ${mx(k, r, d)}`],
            ],
            [
              ["Add the whole numbers", "整数部分相加"],
              ["Keep the fraction part.", "分数部分不变。"],
              [`${w} + ${mx(k, r, d)} = ${mx(w + k, r, d)}`],
            ],
          ],
          [
            `Write ${w} as $${fr(w * d, d)}$. Then $${fr(w * d, d)} + ${fr(a, d)} = ${fr(w * d + a, d)} = ${mx(w + k, r, d)}$.`,
            `都化成分母是 ${d} 的分数：$${fr(w * d, d)} + ${fr(a, d)} = ${fr(w * d + a, d)} = ${mx(w + k, r, d)}$。`,
          ],
          [
            [mixedValue(w, r, d), "That drops the wholes inside the fraction.", "这里丢掉了假分数里的整数。"],
            [qf(w + a, d), "That adds the whole number to the top.", "这是把整数加到分子上了。"],
            [mixedValue(w + k + 1, r, d), "That adds one whole too many.", "多加了一个整数。"],
          ],
          {
            form: "mixed",
            figure: sumTape(
              [
                [w, `${w}`],
                [a / d, `${a}/${d}`],
              ],
              "?",
            ),
          },
        );
      },
      sumTape(
        [
          [4, "4"],
          [11 / 3, "11/3"],
        ],
        "?",
      ),
    ),
  ],
  t(
    "A recipe needs 2 cups of flour, and Ben adds $1\\frac{1}{3}$ cups more. That is $2 + 1\\frac{1}{3} = 3\\frac{1}{3}$ cups.\n\nCheck: $3\\frac{1}{3} - 2 = 1\\frac{1}{3}$.\n\nIn this lesson we add whole numbers to mixed numbers and improper fractions.",
    "一份食谱要 2 杯面粉，本又加了 $1\\frac{1}{3}$ 杯。一共是 $2 + 1\\frac{1}{3} = 3\\frac{1}{3}$ 杯。\n\n检验：$3\\frac{1}{3} - 2 = 1\\frac{1}{3}$。\n\n本课我们做整数加带分数和整数加假分数。",
  ),
);

export const subtractingFractionsAndWholeNumbersUsingModels = topic(
  "subtracting-fractions-and-whole-numbers-using-models",
  t("Subtracting Fractions and Whole Numbers Using Models", "用模型做整数减分数"),
  t(
    "To take a fraction away from a whole number, cut one whole into parts. In a model of 3 − 1/4, three bars are shaded and one fourth of the last bar is crossed out: 2 bars and 3/4 of a bar are left, so 3 − 1/4 = 2 3/4.",
    "从整数中减去一个分数，要把其中一个整体分成若干份。在 3 − 1/4 的模型中，3 个长条涂满，划掉最后一个长条的 1/4：剩下 2 个长条和 3/4 个长条，所以 3 − 1/4 = 2 3/4。",
  ),
  ["adding-fractions-and-whole-numbers-using-models", "subtracting-fractions-with-like-denominators"],
  ["4.NF.B.3"],
  [
    point(
      "one-minus-a-fraction-model",
      ["Taking a fraction from 1", "从 1 中减去分数"],
      [
        "For $1 - \\frac{3}{8}$, cut one bar into 8 eighths and cross out 3. $8 - 3 = 5$ eighths are left, so $1 - \\frac{3}{8} = \\frac{5}{8}$.\n\nCheck: $\\frac{5}{8} + \\frac{3}{8} = \\frac{8}{8} = 1$.\n\n> **Watch out.** The answer is the part left, not the part crossed out.",
        "计算 $1 - \\frac{3}{8}$：把一个长条分成 8 份，划掉 3 份。还剩 $8 - 3 = 5$ 份，所以 $1 - \\frac{3}{8} = \\frac{5}{8}$。\n\n检验：$\\frac{5}{8} + \\frac{3}{8} = \\frac{8}{8} = 1$。\n\n> **注意。** 答案是剩下的部分，不是划掉的部分。",
      ],
      (rng) => {
        const [a, d] = properFraction(rng, 12, 3);
        return answered(
          [`The model shows $1 - ${fr(a, d)}$. What is left?`, `模型表示 $1 - ${fr(a, d)}$。剩下多少？`],
          qf(d - a, d),
          [
            [["Cut the bar", "分长条"], [`The bar is cut into ${d} equal parts.`, `长条平均分成 ${d} 份。`], [`1 = ${fr(d, d)}`]],
            [
              ["Cross out", "划掉"],
              [`${a} part${a === 1 ? " is" : "s are"} crossed out.`, `划掉 ${a} 份。`],
              [`${fr(d, d)} - ${fr(a, d)} = ${reduced(d - a, d)}`],
            ],
          ],
          [`Add back: $${fr(d - a, d)} + ${fr(a, d)} = ${fr(d, d)} = 1$.`, `加回去：$${fr(d - a, d)} + ${fr(a, d)} = ${fr(d, d)} = 1$。`],
          [
            [qf(a, d), "That is the part crossed out, not the part left.", "这是划掉的部分，不是剩下的部分。"],
            [qf(d + 1 - a, d), "That counts one part too many.", "多数了一份。"],
            [qf(d - a, d + 1), "That changes the size of the parts.", "这是改变了每份的大小。"],
          ],
          { form: "mixed", figure: takeAwayFigure(1, a, d) },
        );
      },
      takeAwayFigure(1, 3, 8),
    ),
    point(
      "whole-number-minus-a-fraction-model",
      ["Taking a fraction from a whole number", "从整数中减去分数"],
      [
        "For $3 - \\frac{2}{5}$, cut only the last bar into fifths and cross out 2. That bar has $\\frac{3}{5}$ left, and 2 bars are untouched. The answer is $2\\frac{3}{5}$.\n\nCheck: $2\\frac{3}{5} + \\frac{2}{5} = 2\\frac{5}{5} = 3$.\n\n> **Watch out.** The answer is not $3\\frac{3}{5}$. One whole bar was cut and used.",
        "计算 $3 - \\frac{2}{5}$：只把最后一个长条分成五份，划掉 2 份。这个长条剩下 $\\frac{3}{5}$，另外 2 个长条不动。答案是 $2\\frac{3}{5}$。\n\n检验：$2\\frac{3}{5} + \\frac{2}{5} = 2\\frac{5}{5} = 3$。\n\n> **注意。** 答案不是 $3\\frac{3}{5}$。有一个整条被分开用掉了。",
      ],
      (rng) => {
        const w = rng.int(2, 4);
        const [a, d] = properFraction(rng, 10, 3);
        return answered(
          [`The model shows $${w} - ${fr(a, d)}$. What is left?`, `模型表示 $${w} - ${fr(a, d)}$。剩下多少？`],
          mixedValue(w - 1, d - a, d),
          [
            [
              ["Cut one bar", "分一个长条"],
              ["Only the last bar is cut into parts.", "只把最后一个长条分开。"],
              [`${w} = ${w - 1} + ${fr(d, d)}`],
            ],
            [
              ["Cross out", "划掉"],
              [
                `$${fr(d - a, d)}$ of that bar is left, and ${w - 1} bar${w === 2 ? " is" : "s are"} untouched.`,
                `那个长条剩下 $${fr(d - a, d)}$，另外 ${w - 1} 个长条不动。`,
              ],
              [`${w - 1} + ${fr(d - a, d)} = ${mx(w - 1, d - a, d)}`],
            ],
          ],
          [
            `Add back: $${mx(w - 1, d - a, d)} + ${fr(a, d)} = ${mx(w - 1, d, d)} = ${w}$.`,
            `加回去：$${mx(w - 1, d - a, d)} + ${fr(a, d)} = ${mx(w - 1, d, d)} = ${w}$。`,
          ],
          [
            [mixedValue(w - 1, a, d), "That keeps the part crossed out instead of the part left.", "这是写了划掉的部分，不是剩下的部分。"],
            [mixedValue(w, d - a, d), "That forgets that one whole bar was cut and used.", "这里忘了有一个整条被分开用掉了。"],
            [qf(d - a, d), "That leaves out the bars that were not touched.", "这里漏了没有动的长条。"],
          ],
          { form: "mixed", figure: takeAwayFigure(w, a, d) },
        );
      },
      takeAwayFigure(3, 2, 5),
    ),
  ],
  t(
    "Mia has 3 sandwiches and eats $\\frac{1}{4}$ of one. She cuts one sandwich into fourths and eats one piece. So $2\\frac{3}{4}$ sandwiches are left.\n\nCheck: $2\\frac{3}{4} + \\frac{1}{4} = 3$.\n\nIn this lesson we take fractions away from whole numbers with bar models.",
    "米娅有 3 个三明治，吃了其中一个的 $\\frac{1}{4}$。她把一个三明治切成四份，吃了一份。所以还剩 $2\\frac{3}{4}$ 个三明治。\n\n检验：$2\\frac{3}{4} + \\frac{1}{4} = 3$。\n\n本课我们用长条模型做整数减分数。",
  ),
);

export const subtractingFractionsAndWholeNumbers = topic(
  "subtracting-fractions-and-whole-numbers",
  t("Subtracting Fractions and Whole Numbers", "整数与分数的减法"),
  t(
    "To subtract a fraction from a whole number, take one whole and write it as a fraction: 6 − 3/8 = 5 + 8/8 − 3/8 = 5 5/8. To subtract a whole number from a mixed number, subtract the whole numbers: 7 2/5 − 3 = 4 2/5. To subtract a mixed number from a whole number, do both: 5 − 1 3/4 = 4 4/4 − 1 3/4 = 3 1/4.",
    "整数减分数，从整数中拿出 1 写成分数：6 − 3/8 = 5 + 8/8 − 3/8 = 5 5/8。带分数减整数，整数部分相减：7 2/5 − 3 = 4 2/5。整数减带分数，两步都要做：5 − 1 3/4 = 4 4/4 − 1 3/4 = 3 1/4。",
  ),
  ["subtracting-fractions-and-whole-numbers-using-models"],
  ["4.NF.B.3"],
  [
    point(
      "whole-number-minus-a-fraction",
      ["A whole number minus a fraction", "整数减分数"],
      [
        "For $8 - \\frac{2}{9}$, take 1 from the 8 and write it as $\\frac{9}{9}$. So $8 = 7\\frac{9}{9}$, and $7\\frac{9}{9} - \\frac{2}{9} = 7\\frac{7}{9}$.\n\nCheck: $7\\frac{7}{9} + \\frac{2}{9} = 7\\frac{9}{9} = 8$.\n\n> **Watch out.** After you borrow 1, the whole part is 7, not 8.",
        "计算 $8 - \\frac{2}{9}$：从 8 里拿出 1，写成 $\\frac{9}{9}$。所以 $8 = 7\\frac{9}{9}$，$7\\frac{9}{9} - \\frac{2}{9} = 7\\frac{7}{9}$。\n\n检验：$7\\frac{7}{9} + \\frac{2}{9} = 7\\frac{9}{9} = 8$。\n\n> **注意。** 拿出 1 以后，整数部分是 7，不是 8。",
      ],
      (rng) => {
        const w = rng.int(2, 15);
        const [a, d] = properFraction(rng, 12, 3);
        return answered(
          [`Find $${w} - ${fr(a, d)}$.`, `计算 $${w} - ${fr(a, d)}$。`],
          mixedValue(w - 1, d - a, d),
          [
            [
              ["Borrow a whole", "拿出一个 1"],
              [`Write 1 of the ${w} as $${fr(d, d)}$.`, `把 ${w} 中的 1 写成 $${fr(d, d)}$。`],
              [`${w} = ${w - 1}${fr(d, d)}`],
            ],
            [
              ["Subtract the fractions", "分数相减"],
              ["The whole part stays the same.", "整数部分不变。"],
              [`${w - 1}${fr(d, d)} - ${fr(a, d)} = ${mx(w - 1, d - a, d)}`],
            ],
          ],
          [
            `Add back: $${mx(w - 1, d - a, d)} + ${fr(a, d)} = ${mx(w - 1, d, d)} = ${w}$.`,
            `加回去：$${mx(w - 1, d - a, d)} + ${fr(a, d)} = ${mx(w - 1, d, d)} = ${w}$。`,
          ],
          [
            [
              mixedValue(w - 1, a, d),
              "That writes the fraction taken away instead of what is left.",
              "这是写了减去的分数，不是剩下的部分。",
            ],
            [
              mixedValue(w, d - a, d),
              "That borrows a whole but does not take it from the whole number.",
              "这是拿出了 1，却没有从整数里减掉。",
            ],
            [qf(w - a, d), "That subtracts the top from the whole number.", "这是用整数减分子了。"],
          ],
          {
            form: "mixed",
            figure: stepLine(
              d,
              w - 1,
              w,
              [
                [w, `${w}`],
                [w - a / d, mixedText(w - 1, d - a, d)],
              ],
              [[w, w - a / d]],
            ),
          },
        );
      },
      stepLine(9, 7, 8, [[7 + 7 / 9, "7 7/9"]], [[8, 7 + 7 / 9]]),
    ),
    point(
      "subtracting-with-mixed-numbers-and-whole-numbers",
      ["Mixed numbers and whole numbers", "带分数与整数相减"],
      [
        "For $9\\frac{3}{4} - 5$, subtract the whole numbers and keep the fraction: $4\\frac{3}{4}$. For $6 - 2\\frac{1}{3}$, borrow first: $6 = 5\\frac{3}{3}$, and $5\\frac{3}{3} - 2\\frac{1}{3} = 3\\frac{2}{3}$.\n\nCheck: $3\\frac{2}{3} + 2\\frac{1}{3} = 5\\frac{3}{3} = 6$.\n\n> **Watch out.** Borrow 1 only when there is a fraction to take from a whole number.",
        "计算 $9\\frac{3}{4} - 5$：整数部分相减，分数部分不变，得 $4\\frac{3}{4}$。计算 $6 - 2\\frac{1}{3}$：先拿出 1，$6 = 5\\frac{3}{3}$，$5\\frac{3}{3} - 2\\frac{1}{3} = 3\\frac{2}{3}$。\n\n检验：$3\\frac{2}{3} + 2\\frac{1}{3} = 5\\frac{3}{3} = 6$。\n\n> **注意。** 只有从整数里减分数时，才需要拿出 1。",
      ],
      (rng) => {
        const [a, d] = properFraction(rng, 12, 3);
        const v = rng.int(1, 8);
        const w = v + rng.int(1, 8);
        if (rng.bool())
          return answered(
            [`Find $${mx(w, a, d)} - ${v}$.`, `计算 $${mx(w, a, d)} - ${v}$。`],
            mixedValue(w - v, a, d),
            [
              [
                ["Subtract the whole numbers", "整数部分相减"],
                ["Only whole numbers are taken away.", "减去的只是整数。"],
                [`${w} - ${v} = ${w - v}`],
              ],
              [
                ["Keep the fraction", "分数部分不变"],
                ["The fraction part stays the same.", "分数部分保持不变。"],
                [`${mx(w, a, d)} - ${v} = ${mx(w - v, a, d)}`],
              ],
            ],
            [`Add back: $${mx(w - v, a, d)} + ${v} = ${mx(w, a, d)}$.`, `加回去：$${mx(w - v, a, d)} + ${v} = ${mx(w, a, d)}$。`],
            [
              [
                mixedValue(w - v, d - a, d),
                "That changes the fraction. Only the whole numbers change.",
                "这是改变了分数部分。只有整数部分变。",
              ],
              [qf(w * d + a - v, d), "That takes the whole number from the top of the fraction.", "这是用分子减整数了。"],
              [mixedValue(w - v - 1, a, d), "That takes away one whole too many.", "多减了一个整数。"],
            ],
            {
              form: "mixed",
              figure: sumTape(
                [
                  [w - v + a / d, "?"],
                  [v, `${v}`],
                ],
                mixedText(w, a, d),
              ),
            },
          );
        return answered(
          [`Find $${w} - ${mx(v, a, d)}$.`, `计算 $${w} - ${mx(v, a, d)}$。`],
          mixedValue(w - v - 1, d - a, d),
          [
            [
              ["Borrow a whole", "拿出一个 1"],
              [`Write 1 of the ${w} as $${fr(d, d)}$.`, `把 ${w} 中的 1 写成 $${fr(d, d)}$。`],
              [`${w} = ${w - 1}${fr(d, d)}`],
            ],
            [
              ["Subtract", "相减"],
              ["Subtract the whole parts and the fractions.", "整数部分和分数部分分别相减。"],
              [`${w - 1}${fr(d, d)} - ${mx(v, a, d)} = ${mx(w - v - 1, d - a, d)}`],
            ],
          ],
          [
            `Add back: $${mx(w - v - 1, d - a, d)} + ${mx(v, a, d)} = ${mx(w - 1, d, d)} = ${w}$.`,
            `加回去：$${mx(w - v - 1, d - a, d)} + ${mx(v, a, d)} = ${mx(w - 1, d, d)} = ${w}$。`,
          ],
          [
            [mixedValue(w - v, a, d), "That keeps the fraction, but the fraction is taken away.", "这是保留了分数，可分数是要减去的。"],
            [mixedValue(w - v, d - a, d), "That forgets the whole that was borrowed.", "这里忘了拿出来的那个 1。"],
            [
              mixedValue(w - v - 1, a, d),
              "That writes the fraction taken away instead of what is left.",
              "这是写了减去的分数，不是剩下的部分。",
            ],
          ],
          {
            form: "mixed",
            figure: sumTape(
              [
                [w - v - a / d, "?"],
                [v + a / d, mixedText(v, a, d)],
              ],
              `${w}`,
            ),
          },
        );
      },
      sumTape(
        [
          [11 / 3, "?"],
          [7 / 3, "2 1/3"],
        ],
        "6",
      ),
    ),
  ],
  t(
    "A ribbon is 6 m long. Ana cuts off $\\frac{3}{8}$ m. Write 6 as $5\\frac{8}{8}$. Then $5\\frac{8}{8} - \\frac{3}{8} = 5\\frac{5}{8}$ m are left.\n\nCheck: $5\\frac{5}{8} + \\frac{3}{8} = 5\\frac{8}{8} = 6$.\n\nIn this lesson we subtract with fractions, mixed numbers and whole numbers.",
    "一条丝带长 6 米，安娜剪掉 $\\frac{3}{8}$ 米。把 6 写成 $5\\frac{8}{8}$，那么还剩 $5\\frac{8}{8} - \\frac{3}{8} = 5\\frac{5}{8}$ 米。\n\n检验：$5\\frac{5}{8} + \\frac{3}{8} = 5\\frac{8}{8} = 6$。\n\n本课我们做分数、带分数与整数的减法。",
  ),
);

// ---------------------------------------------------------------------------
// Adding and subtracting fractions with unlike denominators

/** Benchmark is 0, 1/2 or 1, the values fractions are rounded to when estimating. */
const benchmarks = [qf(0, 1), qf(1, 2), qf(1, 1)] as const;

/** nearBenchmark draws a fraction that is clearly close to the benchmark with index k (within 1/6 and closer to it than to the other benchmarks by a margin). */
function nearBenchmark(rng: Rng, k: number): [number, number] {
  for (;;) {
    const d = rng.int(5, 16);
    const n = rng.int(1, d - 1);
    const v = qf(n, d);
    const dist = (b: Q) => v.sub(b).abs();
    if (gcd(n, d) !== 1) continue;
    if (dist(benchmarks[k]!).cmp(qf(1, 6)) > 0) continue;
    if (benchmarks.some((b, j) => j !== k && dist(b).cmp(dist(benchmarks[k]!).add(qf(1, 8))) < 0)) continue;
    return [n, d];
  }
}

const benchmarkTex = ["0", "\\frac{1}{2}", "1"];

/** benchLine draws a number line from 0 to 1 with 0, 1/2 and 1 labeled and the given fractions [top, bottom] marked. */
function benchLine(marks: readonly (readonly [number, number])[]): Figure {
  return lineFigure(
    {
      lo: 0,
      hi: 1,
      step: 0.5,
      labels: [0, 0.5, 1],
      label: (v) => (v === 0.5 ? "1/2" : `${v}`),
      marks: marks.map(([n, d]) => ({ at: n / d, text: `${n}/${d}` })),
    },
    [
      `A number line from 0 to 1 with 1/2 in the middle, and ${marks.map(([n, d]) => `${n}/${d}`).join(" and ")} marked.`,
      `一条从 0 到 1 的数轴，中间是 1/2，标出了 ${marks.map(([n, d]) => `${n}/${d}`).join(" 和 ")}。`,
    ],
  );
}

/** unlikeWalk adds or subtracts a/b and c/d over their least common denominator in labelled steps; `cut` tells it in words about cutting bars. */
function unlikeWalk(p: FractionPair, sub: boolean, cut = false): Walk[] {
  const L = lcm(p.b, p.d);
  const [x, y] = [(p.a * L) / p.b, (p.c * L) / p.d];
  const r = sub ? x - y : x + y;
  const op = sub ? "-" : "+";
  const tail = gcd(r, L) !== 1 || r > L ? ` = ${mq(qf(r, L))}` : "";
  const rewrite = [
    [p.a, p.b, x],
    [p.c, p.d, y],
  ]
    .filter(([, d]) => d !== L)
    .map(([n, d, m]) => `${fr(n!, d!)} = ${fr(m!, L)}`);
  return [
    [
      cut ? ["Cut into equal parts", "切成同样大的份"] : ["Find a common denominator", "通分"],
      cut
        ? [`Cut both bars into ${L} equal parts.`, `把两个长条都平均分成 ${L} 份。`]
        : [`The least common multiple of ${p.b} and ${p.d} is ${L}.`, `${p.b} 和 ${p.d} 的最小公倍数是 ${L}。`],
      rewrite,
    ],
    [
      sub ? ["Subtract the tops", "分子相减"] : ["Add the tops", "分子相加"],
      [`Now the parts are the same size, so the bottom stays ${L}.`, `现在每份一样大，分母 ${L} 不变。`],
      [`${fr(x, L)} ${op} ${fr(y, L)} = ${fr(r, L)}${tail}`],
    ],
  ];
}

/** unlikeCheck undoes a/b ± c/d to get back to a/b. */
function unlikeCheck(p: FractionPair, sub: boolean): Pair {
  const v = mq(pairValue(p, sub));
  return sub
    ? [`Add back: $${v} + ${fr(p.c, p.d)} = ${fr(p.a, p.b)}$.`, `加回去：$${v} + ${fr(p.c, p.d)} = ${fr(p.a, p.b)}$。`]
    : [`Subtract back: $${v} - ${fr(p.c, p.d)} = ${fr(p.a, p.b)}$.`, `减回去：$${v} - ${fr(p.c, p.d)} = ${fr(p.a, p.b)}$。`];
}

/** unlikeMisses are the usual slips with a/b ± c/d, each with its reason. */
function unlikeMisses(p: FractionPair, sub: boolean): [Q, string, string][] {
  const L = lcm(p.b, p.d);
  const [x, y] = [(p.a * L) / p.b, (p.c * L) / p.d];
  const n = sub ? p.a - p.c : p.a + p.c;
  const out: [Q, string, string][] = [];
  if (n > 0) {
    out.push([
      qf(n, p.b + p.d),
      sub ? "That subtracts the tops but adds the bottoms." : "That adds the tops and adds the bottoms.",
      sub ? "这是分子相减，分母却相加了。" : "这是分子相加，分母也相加了。",
    ]);
    out.push([qf(n, Math.max(p.b, p.d)), "That changes the bottom but not the tops.", "这里只换了分母，分子没有跟着变。"]);
  }
  out.push([pairValue(p, sub).add(qf(1, L)), `That is one $${fr(1, L)}$ too many.`, `多算了一个 $${fr(1, L)}$。`]);
  if (sub) out.push([qf(x + y, L), "That adds instead of subtracting.", "这是做成加法了。"]);
  else if (x > y) out.push([qf(x - y, L), "That subtracts instead of adding.", "这是做成减法了。"]);
  return out;
}

/** unlikeProblem asks for a/b ± c/d and solves it over the least common denominator. */
function unlikeProblem(p: FractionPair, sub: boolean, figure?: Figure): Problem {
  const op = sub ? "-" : "+";
  const prompt: Pair = figure
    ? [
        `The model shows $${fr(p.a, p.b)}$ and $${fr(p.c, p.d)}$. Find $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$.`,
        `模型表示 $${fr(p.a, p.b)}$ 和 $${fr(p.c, p.d)}$。计算 $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$。`,
      ]
    : [`Find $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$.`, `计算 $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$。`];
  return answered(prompt, pairValue(p, sub), unlikeWalk(p, sub, figure !== undefined), unlikeCheck(p, sub), unlikeMisses(p, sub), {
    form: "mixed",
    ...(figure && { figure }),
  });
}

/** storyPrompt picks a word story that joins or compares the amounts x and y. */
function storyPrompt(rng: Rng, sub: boolean, x: string, y: string): Pair {
  const s = rng.pick(wordStories.filter((w) => w.sub === sub));
  const probe = s.en("", "", "", measures[0]!);
  const u = probe.includes("practiced")
    ? { en: "hours", zh: "小时" }
    : probe.includes("water")
      ? rng.pick([measures[1]!, measures[2]!])
      : probe.includes("rope")
        ? measures[5]!
        : rng.pick([measures[0]!, measures[5]!]);
  const n = rng.pick(names);
  return [s.en(n, x, y, u), s.zh(n, x, y, u)];
}

/** storyProblem asks a word problem that adds or subtracts a/b and c/d. */
function storyProblem(rng: Rng, p: FractionPair, sub: boolean): Problem {
  const v = pairValue(p, sub);
  const choose: Walk = sub
    ? [
        ["Choose the operation", "选择运算"],
        ["The question asks what is left or how much more, so subtract.", "问题问还剩多少或多多少，所以用减法。"],
      ]
    : [
        ["Choose the operation", "选择运算"],
        ["The two amounts are put together, so add.", "两个量合在一起，所以用加法。"],
      ];
  const figure = sub
    ? sumTape(
        [
          [p.c / p.d, `${p.c}/${p.d}`],
          [v.toNumber(), "?"],
        ],
        `${p.a}/${p.b}`,
      )
    : sumTape(
        [
          [p.a / p.b, `${p.a}/${p.b}`],
          [p.c / p.d, `${p.c}/${p.d}`],
        ],
        "?",
      );
  return answered(
    storyPrompt(rng, sub, fr(p.a, p.b), fr(p.c, p.d)),
    v,
    [choose, ...unlikeWalk(p, sub)],
    unlikeCheck(p, sub),
    unlikeMisses(p, sub),
    {
      form: "mixed",
      figure,
    },
  );
}

/** leftoverPairs are the denominators of the two known parts of a garden. */
const leftoverPairs: readonly (readonly [number, number])[] = [
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [3, 8],
  [4, 10],
  [5, 6],
  [6, 8],
];

export const estimatingSumsAndDifferencesOfFractions = topic(
  "estimating-sums-and-differences-of-fractions",
  t("Estimating Sums and Differences of Fractions", "估算分数的和与差"),
  t(
    "To estimate with fractions, round each fraction to the closest benchmark: 0, 1/2 or 1. A fraction is close to 1/2 when its numerator is about half its denominator, close to 0 when the numerator is small, and close to 1 when the numerator is almost the denominator. So 7/8 + 5/12 is about 1 + 1/2 = 1 1/2.",
    "用分数估算时，把每个分数近似成最接近的基准数：0、1/2 或 1。分子约为分母的一半时，分数接近 1/2；分子很小时接近 0；分子几乎等于分母时接近 1。所以 7/8 + 5/12 约等于 1 + 1/2 = 1 1/2。",
  ),
  ["comparing-fractions-using-one-half-benchmarks", "adding-fractions-with-like-denominators"],
  ["5.NF.A.2"],
  [
    point(
      "rounding-to-benchmark-fractions",
      ["Rounding to 0, 1/2 or 1", "近似成 0、1/2 或 1"],
      [
        "Half of 11 is $5\\frac{1}{2}$, and 6 is close to that. So $\\frac{6}{11}$ is close to $\\frac{1}{2}$.\n\nCheck: $\\frac{6}{11}$ is only $\\frac{1}{22}$ away from $\\frac{1}{2}$, but $\\frac{5}{11}$ away from 1.\n\n> **Watch out.** A big bottom does not make a fraction close to 1. $\\frac{2}{15}$ is close to 0.",
        "11 的一半是 $5\\frac{1}{2}$，6 和它很接近。所以 $\\frac{6}{11}$ 接近 $\\frac{1}{2}$。\n\n检验：$\\frac{6}{11}$ 和 $\\frac{1}{2}$ 只差 $\\frac{1}{22}$，和 1 却差 $\\frac{5}{11}$。\n\n> **注意。** 分母大并不说明分数接近 1。$\\frac{2}{15}$ 接近 0。",
      ],
      (rng) => {
        const k = rng.int(0, 2);
        const [n, d] = nearBenchmark(rng, k);
        const half = mq(qf(d, 2));
        const away = mq(qf(n, d).sub(benchmarks[k]!).abs());
        const said: Pair[] = [
          [
            `${n} is much less than $${half}$, so $${fr(n, d)}$ is close to $0$.`,
            `${n} 比 $${half}$ 小得多，所以 $${fr(n, d)}$ 接近 $0$。`,
          ],
          [
            `${n} is close to $${half}$, so $${fr(n, d)}$ is close to $\\frac{1}{2}$.`,
            `${n} 和 $${half}$ 很接近，所以 $${fr(n, d)}$ 接近 $\\frac{1}{2}$。`,
          ],
          [`${n} is almost ${d}, so $${fr(n, d)}$ is close to $1$.`, `${n} 几乎等于 ${d}，所以 $${fr(n, d)}$ 接近 $1$。`],
        ];
        const why: [string, string][][] = [
          [
            ["", ""],
            [`${n} is much less than half of ${d}.`, `${n} 比 ${d} 的一半小得多。`],
            [`${n} is far from ${d}.`, `${n} 离 ${d} 还差得远。`],
          ],
          [
            [`${n} is about half of ${d}, not a small part of it.`, `${n} 大约是 ${d} 的一半，并不算小。`],
            ["", ""],
            [`${n} is about half of ${d}, not almost all of it.`, `${n} 大约是 ${d} 的一半，不是几乎全部。`],
          ],
          [
            [`${n} is almost ${d}, so the fraction is not small.`, `${n} 几乎等于 ${d}，分数并不小。`],
            [`${n} is much more than half of ${d}.`, `${n} 比 ${d} 的一半大得多。`],
            ["", ""],
          ],
        ];
        return pickedMath(
          rng,
          [`Which benchmark is $${fr(n, d)}$ closest to?`, `$${fr(n, d)}$ 最接近哪个基准数？`],
          benchmarkTex[k]!,
          [0, 1, 2].filter((j) => j !== k).map((j) => [benchmarkTex[j]!, why[k]![j]![0], why[k]![j]![1]] as const),
          [
            [
              ["Find half of the bottom", "找分母的一半"],
              [`Half of ${d} is $${half}$.`, `${d} 的一半是 $${half}$。`],
            ],
            [["Compare the top", "比较分子"], said[k]!],
          ],
          [
            `$${fr(n, d)}$ is $${away}$ away from $${benchmarkTex[k]}$, closer than to the other two benchmarks.`,
            `$${fr(n, d)}$ 和 $${benchmarkTex[k]}$ 相差 $${away}$，比和另外两个基准数都近。`,
          ],
          benchLine([[n, d]]),
        );
      },
      benchLine([[6, 11]]),
    ),
    point(
      "estimating-with-benchmarks",
      ["Estimating a sum or difference", "估算和或差"],
      [
        "$\\frac{11}{12}$ is close to 1 and $\\frac{3}{7}$ is close to $\\frac{1}{2}$. So $\\frac{11}{12} - \\frac{3}{7}$ is about $1 - \\frac{1}{2} = \\frac{1}{2}$.\n\nCheck: exactly, $\\frac{77}{84} - \\frac{36}{84} = \\frac{41}{84}$, which is close to $\\frac{42}{84} = \\frac{1}{2}$.\n\n> **Watch out.** Round each fraction on its own. $\\frac{3}{7}$ is close to $\\frac{1}{2}$, not to 0.",
        "$\\frac{11}{12}$ 接近 1，$\\frac{3}{7}$ 接近 $\\frac{1}{2}$。所以 $\\frac{11}{12} - \\frac{3}{7}$ 约等于 $1 - \\frac{1}{2} = \\frac{1}{2}$。\n\n检验：准确计算，$\\frac{77}{84} - \\frac{36}{84} = \\frac{41}{84}$，和 $\\frac{42}{84} = \\frac{1}{2}$ 很接近。\n\n> **注意。** 每个分数要单独近似。$\\frac{3}{7}$ 接近 $\\frac{1}{2}$，不是接近 0。",
      ],
      (rng) => {
        const sub = rng.bool();
        let k1 = rng.int(0, 2);
        let k2 = rng.int(0, 2);
        if (sub && k1 < k2) [k1, k2] = [k2, k1];
        let [a, b] = nearBenchmark(rng, k1);
        let [c, d] = nearBenchmark(rng, k2);
        if (sub && qf(a, b).cmp(qf(c, d)) < 0) [a, b, c, d, k1, k2] = [c, d, a, b, k2, k1];
        const op = sub ? "-" : "+";
        const join = (x: Q, y: Q) => (sub ? x.sub(y) : x.add(y));
        const est = join(benchmarks[k1]!, benchmarks[k2]!);
        const exact = join(qf(a, b), qf(c, d));
        const wrong: [string, string, string][] = [];
        const seen = [est];
        const add = (v: Q, en: string, zh: string) => {
          if (v.sign() < 0 || v.cmp(qf(2, 1)) > 0 || seen.some((s) => s.eq(v))) return;
          seen.push(v);
          wrong.push([mq(v), en, zh]);
        };
        for (const j of [0, 1, 2]) {
          if (j !== k1)
            add(
              join(benchmarks[j]!, benchmarks[k2]!),
              `That rounds $${fr(a, b)}$ to $${benchmarkTex[j]}$, but it is closer to $${benchmarkTex[k1]}$.`,
              `这是把 $${fr(a, b)}$ 近似成 $${benchmarkTex[j]}$，但它更接近 $${benchmarkTex[k1]}$。`,
            );
          if (j !== k2)
            add(
              join(benchmarks[k1]!, benchmarks[j]!),
              `That rounds $${fr(c, d)}$ to $${benchmarkTex[j]}$, but it is closer to $${benchmarkTex[k2]}$.`,
              `这是把 $${fr(c, d)}$ 近似成 $${benchmarkTex[j]}$，但它更接近 $${benchmarkTex[k2]}$。`,
            );
        }
        const flip = sub ? benchmarks[k1]!.add(benchmarks[k2]!) : benchmarks[k1]!.sub(benchmarks[k2]!).abs();
        add(
          flip,
          sub ? "That adds instead of subtracting." : "That subtracts instead of adding.",
          sub ? "这是做成加法了。" : "这是做成减法了。",
        );
        for (const h of [0, 1, 2, 3, 4])
          add(
            qf(h, 2),
            `That is too far from both fractions put together: they are close to $${benchmarkTex[k1]}$ and $${benchmarkTex[k2]}$.`,
            `这和两个分数算出的结果相差太远：它们分别接近 $${benchmarkTex[k1]}$ 和 $${benchmarkTex[k2]}$。`,
          );
        return pickedMath(
          rng,
          [
            `Estimate $${fr(a, b)} ${op} ${fr(c, d)}$ using the benchmarks $0$, $\\frac{1}{2}$ and $1$.`,
            `用基准数 $0$、$\\frac{1}{2}$ 和 $1$ 估算 $${fr(a, b)} ${op} ${fr(c, d)}$。`,
          ],
          mq(est),
          wrong.slice(0, 3),
          [
            [
              ["Round each fraction", "把每个分数近似"],
              [
                `$${fr(a, b)}$ is close to $${benchmarkTex[k1]}$ and $${fr(c, d)}$ is close to $${benchmarkTex[k2]}$.`,
                `$${fr(a, b)}$ 接近 $${benchmarkTex[k1]}$，$${fr(c, d)}$ 接近 $${benchmarkTex[k2]}$。`,
              ],
            ],
            [
              sub ? ["Subtract the benchmarks", "基准数相减"] : ["Add the benchmarks", "基准数相加"],
              ["Work with the easy numbers.", "用好算的数来算。"],
              [`${benchmarkTex[k1]} ${op} ${benchmarkTex[k2]} = ${mq(est)}`],
            ],
          ],
          [`The exact answer is $${mq(exact)}$, which is close to $${mq(est)}$.`, `准确结果是 $${mq(exact)}$，和 $${mq(est)}$ 很接近。`],
          benchLine([
            [a, b],
            [c, d],
          ]),
        );
      },
      benchLine([
        [3, 7],
        [11, 12],
      ]),
    ),
  ],
  t(
    "Mia runs $\\frac{7}{8}$ mile and then walks $\\frac{5}{12}$ mile. $\\frac{7}{8}$ is close to 1 and $\\frac{5}{12}$ is close to $\\frac{1}{2}$, so she goes about $1 + \\frac{1}{2} = 1\\frac{1}{2}$ miles.\n\nCheck: exactly, $\\frac{21}{24} + \\frac{10}{24} = \\frac{31}{24} = 1\\frac{7}{24}$, which is close to $1\\frac{1}{2}$.\n\nIn this lesson we round fractions to 0, $\\frac{1}{2}$ or 1 to estimate.",
    "米娅跑了 $\\frac{7}{8}$ 英里，又走了 $\\frac{5}{12}$ 英里。$\\frac{7}{8}$ 接近 1，$\\frac{5}{12}$ 接近 $\\frac{1}{2}$，所以她大约走了 $1 + \\frac{1}{2} = 1\\frac{1}{2}$ 英里。\n\n检验：准确计算，$\\frac{21}{24} + \\frac{10}{24} = \\frac{31}{24} = 1\\frac{7}{24}$，和 $1\\frac{1}{2}$ 很接近。\n\n本课我们把分数近似成 0、$\\frac{1}{2}$ 或 1 来估算。",
  ),
);

/** FractionPair is a/b and c/d with unlike denominators. */
interface FractionPair {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
}

/** relatedPair draws two proper fractions in lowest terms where one denominator is a multiple of the other. */
function relatedPair(rng: Rng): FractionPair {
  const b = rng.int(2, 6);
  const d = b * rng.int(2, Math.min(4, Math.floor(24 / b)));
  const a = coprimeTo(rng, b, 1, b - 1);
  const c = coprimeTo(rng, d, 1, d - 1);
  return rng.bool() ? { a, b, c, d } : { a: c, b: d, c: a, d: b };
}

/** unrelatedPair draws two proper fractions in lowest terms whose denominators do not divide each other. */
function unrelatedPair(rng: Rng): FractionPair {
  for (;;) {
    const b = rng.int(2, 12);
    const d = rng.int(2, 12);
    if (b === d || b % d === 0 || d % b === 0 || lcm(b, d) > 60) continue;
    return { a: coprimeTo(rng, b, 1, b - 1), b, c: coprimeTo(rng, d, 1, d - 1), d };
  }
}

/** ordered returns the pair with a/b ≥ c/d (and unequal), for subtraction, or undefined. */
function ordered(p: FractionPair): FractionPair | undefined {
  const cmp = qf(p.a, p.b).cmp(qf(p.c, p.d));
  if (cmp === 0) return undefined;
  return cmp > 0 ? p : { a: p.c, b: p.d, c: p.a, d: p.b };
}

/** pairValue is a/b + c/d or a/b − c/d. */
const pairValue = (p: FractionPair, sub: boolean) => (sub ? qf(p.a, p.b).sub(qf(p.c, p.d)) : qf(p.a, p.b).add(qf(p.c, p.d)));

export const addingFractionsWithUnlikeDenominatorsUsingModels = topic(
  "adding-fractions-with-unlike-denominators-using-models",
  t("Adding Fractions With Unlike Denominators Using Models", "用模型做异分母分数加法"),
  t(
    "Parts of different sizes cannot be counted together. To add 1/2 and 1/3, cut both bars into sixths: 1/2 is 3 sixths and 1/3 is 2 sixths, so 1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
    "大小不同的份数不能直接合在一起数。计算 1/2 + 1/3，把两个长条都分成六份：1/2 是 3 个六分之一，1/3 是 2 个六分之一，所以 1/2 + 1/3 = 3/6 + 2/6 = 5/6。",
  ),
  ["adding-fractions-with-like-denominators-using-models", "comparing-fraction-models-using-common-denominators"],
  ["5.NF.A.1"],
  [
    point(
      "adding-related-denominators-with-models",
      ["One denominator divides the other", "一个分母是另一个的倍数"],
      [
        "For $\\frac{1}{4} + \\frac{3}{8}$, cut each fourth in half. $\\frac{1}{4}$ becomes $\\frac{2}{8}$, and $\\frac{2}{8} + \\frac{3}{8} = \\frac{5}{8}$.\n\nCheck: $\\frac{5}{8} - \\frac{3}{8} = \\frac{2}{8} = \\frac{1}{4}$.\n\n> **Watch out.** Cut the fourths, not the eighths. Each fourth becomes 2 eighths.",
        "计算 $\\frac{1}{4} + \\frac{3}{8}$，把每个四分之一再平分成两份。$\\frac{1}{4}$ 变成 $\\frac{2}{8}$，$\\frac{2}{8} + \\frac{3}{8} = \\frac{5}{8}$。\n\n检验：$\\frac{5}{8} - \\frac{3}{8} = \\frac{2}{8} = \\frac{1}{4}$。\n\n> **注意。** 要切的是四分之一，不是八分之一。每个四分之一变成 2 个八分之一。",
      ],
      (rng) => {
        const p = relatedPair(rng);
        return unlikeProblem(p, false, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
      twoBarsFigure(4, 1, 8, 3),
    ),
    point(
      "adding-unrelated-denominators-with-models",
      ["Unrelated denominators", "分母不成倍数关系"],
      [
        "For $\\frac{2}{3} + \\frac{1}{4}$, cut both bars into twelfths. $\\frac{2}{3} = \\frac{8}{12}$ and $\\frac{1}{4} = \\frac{3}{12}$, so the sum is $\\frac{11}{12}$.\n\nCheck: $\\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$.\n\n> **Watch out.** Do not add the tops and the bottoms. $\\frac{3}{7}$ is even less than $\\frac{2}{3}$ alone.",
        "计算 $\\frac{2}{3} + \\frac{1}{4}$，把两个长条都切成十二分之一。$\\frac{2}{3} = \\frac{8}{12}$，$\\frac{1}{4} = \\frac{3}{12}$，所以和是 $\\frac{11}{12}$。\n\n检验：$\\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$。\n\n> **注意。** 不能分子加分子、分母加分母。$\\frac{3}{7}$ 比 $\\frac{2}{3}$ 一个数还小。",
      ],
      (rng) => {
        const p = unrelatedPair(rng);
        return unlikeProblem(p, false, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
      twoBarsFigure(3, 2, 4, 1),
    ),
  ],
  t(
    "Leo pours $\\frac{1}{2}$ cup of milk and $\\frac{1}{3}$ cup of water into a bowl. Cut both into sixths: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$ cup.\n\nCheck: $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$.\n\nIn this lesson we cut bars into parts of the same size, then add.",
    "利奥往碗里倒了 $\\frac{1}{2}$ 杯牛奶和 $\\frac{1}{3}$ 杯水。都切成六分之一：$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$ 杯。\n\n检验：$\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$。\n\n本课我们把长条切成同样大的份，再相加。",
  ),
);

/** orderedPair draws a pair with a/b > c/d. */
function orderedPair(rng: Rng, related: boolean): FractionPair {
  for (;;) {
    const p = ordered(related ? relatedPair(rng) : unrelatedPair(rng));
    if (p) return p;
  }
}

export const subtractingFractionsWithUnlikeDenominatorsUsingModels = topic(
  "subtracting-fractions-with-unlike-denominators-using-models",
  t("Subtracting Fractions With Unlike Denominators Using Models", "用模型做异分母分数减法"),
  t(
    "To subtract fractions with unlike denominators, cut both bars into parts of the same size first: 3/4 − 1/3 = 9/12 − 4/12 = 5/12.",
    "异分母分数相减，先把两个长条分成同样大小的份：3/4 − 1/3 = 9/12 − 4/12 = 5/12。",
  ),
  ["adding-fractions-with-unlike-denominators-using-models", "subtracting-fractions-with-like-denominators"],
  ["5.NF.A.1"],
  [
    point(
      "subtracting-related-denominators-with-models",
      ["One denominator divides the other", "一个分母是另一个的倍数"],
      [
        "For $\\frac{5}{6} - \\frac{1}{3}$, cut each third in half. $\\frac{1}{3} = \\frac{2}{6}$, and $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$.\n\nCheck: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$.\n\n> **Watch out.** Take away 2 sixths, not 1. $\\frac{1}{3}$ is 2 sixths.",
        "计算 $\\frac{5}{6} - \\frac{1}{3}$，把每个三分之一再平分成两份。$\\frac{1}{3} = \\frac{2}{6}$，$\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$。\n\n检验：$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$。\n\n> **注意。** 要拿走 2 个六分之一，不是 1 个。$\\frac{1}{3}$ 是 2 个六分之一。",
      ],
      (rng) => {
        const p = orderedPair(rng, true);
        return unlikeProblem(p, true, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
      twoBarsFigure(6, 5, 3, 1),
    ),
    point(
      "subtracting-unrelated-denominators-with-models",
      ["Unrelated denominators", "分母不成倍数关系"],
      [
        "For $\\frac{4}{5} - \\frac{1}{2}$, cut both bars into tenths. $\\frac{4}{5} = \\frac{8}{10}$ and $\\frac{1}{2} = \\frac{5}{10}$, so $\\frac{3}{10}$ is left.\n\nCheck: $\\frac{3}{10} + \\frac{5}{10} = \\frac{8}{10} = \\frac{4}{5}$.\n\n> **Watch out.** Do not subtract the bottoms too. $\\frac{4 - 1}{5 - 2} = \\frac{3}{3}$ is a whole bar, far too much.",
        "计算 $\\frac{4}{5} - \\frac{1}{2}$，把两个长条都切成十分之一。$\\frac{4}{5} = \\frac{8}{10}$，$\\frac{1}{2} = \\frac{5}{10}$，所以还剩 $\\frac{3}{10}$。\n\n检验：$\\frac{3}{10} + \\frac{5}{10} = \\frac{8}{10} = \\frac{4}{5}$。\n\n> **注意。** 分母不能也相减。$\\frac{4 - 1}{5 - 2} = \\frac{3}{3}$ 是一整个长条，太多了。",
      ],
      (rng) => {
        const p = orderedPair(rng, false);
        return unlikeProblem(p, true, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
      twoBarsFigure(5, 4, 2, 1),
    ),
  ],
  t(
    "Zoe has a ribbon $\\frac{3}{4}$ meter long and cuts off $\\frac{1}{3}$ meter. Cut both into twelfths: $\\frac{9}{12} - \\frac{4}{12} = \\frac{5}{12}$ meter is left.\n\nCheck: $\\frac{5}{12} + \\frac{4}{12} = \\frac{9}{12} = \\frac{3}{4}$.\n\nIn this lesson we cut bars into parts of the same size, then take away.",
    "佐伊有一根 $\\frac{3}{4}$ 米长的丝带，剪掉了 $\\frac{1}{3}$ 米。都切成十二分之一：还剩 $\\frac{9}{12} - \\frac{4}{12} = \\frac{5}{12}$ 米。\n\n检验：$\\frac{5}{12} + \\frac{4}{12} = \\frac{9}{12} = \\frac{3}{4}$。\n\n本课我们把长条切成同样大的份，再相减。",
  ),
);

export const addingFractionsWithUnlikeDenominators = topic(
  "adding-fractions-with-unlike-denominators",
  t("Adding Fractions With Unlike Denominators", "异分母分数加法"),
  t(
    "To add fractions with unlike denominators, rewrite them with a common denominator, usually the least common denominator, and add the numerators: 5/6 + 3/4 = 10/12 + 9/12 = 19/12 = 1 7/12.",
    "异分母分数相加，先通分（通常化成最小公分母），再把分子相加：5/6 + 3/4 = 10/12 + 9/12 = 19/12 = 1 7/12。",
  ),
  ["adding-fractions-with-unlike-denominators-using-models", "least-common-denominators"],
  ["5.NF.A.1"],
  [
    point(
      "adding-with-related-denominators",
      ["One denominator divides the other", "一个分母是另一个的倍数"],
      [
        "For $\\frac{2}{5} + \\frac{7}{10}$, use 10 as the bottom. $\\frac{2}{5} = \\frac{4}{10}$, so the sum is $\\frac{4}{10} + \\frac{7}{10} = \\frac{11}{10} = 1\\frac{1}{10}$.\n\nCheck: $\\frac{11}{10} - \\frac{7}{10} = \\frac{4}{10} = \\frac{2}{5}$.\n\n> **Watch out.** Change the top too. $\\frac{2}{5}$ is $\\frac{4}{10}$, not $\\frac{2}{10}$.",
        "计算 $\\frac{2}{5} + \\frac{7}{10}$，用 10 作分母。$\\frac{2}{5} = \\frac{4}{10}$，所以和是 $\\frac{4}{10} + \\frac{7}{10} = \\frac{11}{10} = 1\\frac{1}{10}$。\n\n检验：$\\frac{11}{10} - \\frac{7}{10} = \\frac{4}{10} = \\frac{2}{5}$。\n\n> **注意。** 分子也要跟着变。$\\frac{2}{5}$ 是 $\\frac{4}{10}$，不是 $\\frac{2}{10}$。",
      ],
      (rng) => unlikeProblem(relatedPair(rng), false),
      stepLine(
        10,
        0,
        2,
        [
          [0.4, "4/10"],
          [1.1, "11/10"],
        ],
        [[0.4, 1.1]],
      ),
    ),
    point(
      "adding-with-the-least-common-denominator",
      ["Using the least common denominator", "用最小公分母"],
      [
        "For $\\frac{3}{8} + \\frac{5}{6}$, the least common multiple of 8 and 6 is 24. $\\frac{3}{8} = \\frac{9}{24}$ and $\\frac{5}{6} = \\frac{20}{24}$, so the sum is $\\frac{29}{24} = 1\\frac{5}{24}$.\n\nCheck: $\\frac{29}{24} - \\frac{20}{24} = \\frac{9}{24} = \\frac{3}{8}$.\n\n> **Watch out.** Do not add the bottoms. $8 + 6 = 14$ is not a common denominator.",
        "计算 $\\frac{3}{8} + \\frac{5}{6}$，8 和 6 的最小公倍数是 24。$\\frac{3}{8} = \\frac{9}{24}$，$\\frac{5}{6} = \\frac{20}{24}$，所以和是 $\\frac{29}{24} = 1\\frac{5}{24}$。\n\n检验：$\\frac{29}{24} - \\frac{20}{24} = \\frac{9}{24} = \\frac{3}{8}$。\n\n> **注意。** 分母不能相加。$8 + 6 = 14$ 不是公分母。",
      ],
      (rng) => unlikeProblem(unrelatedPair(rng), false),
      twoBarsFigure(8, 3, 6, 5),
    ),
  ],
  t(
    "A baker uses $\\frac{5}{6}$ kilogram of flour and $\\frac{3}{4}$ kilogram of sugar. Over twelfths: $\\frac{10}{12} + \\frac{9}{12} = \\frac{19}{12} = 1\\frac{7}{12}$ kilograms.\n\nCheck: $\\frac{19}{12} - \\frac{9}{12} = \\frac{10}{12} = \\frac{5}{6}$.\n\nIn this lesson we add fractions over a common denominator.",
    "面包师用了 $\\frac{5}{6}$ 千克面粉和 $\\frac{3}{4}$ 千克糖。化成十二分之几：$\\frac{10}{12} + \\frac{9}{12} = \\frac{19}{12} = 1\\frac{7}{12}$ 千克。\n\n检验：$\\frac{19}{12} - \\frac{9}{12} = \\frac{10}{12} = \\frac{5}{6}$。\n\n本课我们先通分，再做分数加法。",
  ),
);

export const subtractingFractionsWithUnlikeDenominators = topic(
  "subtracting-fractions-with-unlike-denominators",
  t("Subtracting Fractions With Unlike Denominators", "异分母分数减法"),
  t(
    "To subtract fractions with unlike denominators, rewrite them with a common denominator and subtract the numerators: 7/8 − 1/6 = 21/24 − 4/24 = 17/24. Write the result in lowest terms.",
    "异分母分数相减，先通分，再把分子相减：7/8 − 1/6 = 21/24 − 4/24 = 17/24。结果要化成最简分数。",
  ),
  ["subtracting-fractions-with-unlike-denominators-using-models", "adding-fractions-with-unlike-denominators"],
  ["5.NF.A.1"],
  [
    point(
      "subtracting-with-related-denominators",
      ["One denominator divides the other", "一个分母是另一个的倍数"],
      [
        "For $\\frac{11}{12} - \\frac{1}{4}$, use 12 as the bottom. $\\frac{1}{4} = \\frac{3}{12}$, so $\\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$.\n\nCheck: $\\frac{2}{3} + \\frac{1}{4} = \\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$.\n\n> **Watch out.** Do not stop at $\\frac{8}{12}$. Divide the top and bottom by 4 to get $\\frac{2}{3}$.",
        "计算 $\\frac{11}{12} - \\frac{1}{4}$，用 12 作分母。$\\frac{1}{4} = \\frac{3}{12}$，所以 $\\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$。\n\n检验：$\\frac{2}{3} + \\frac{1}{4} = \\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$。\n\n> **注意。** 不要停在 $\\frac{8}{12}$。分子分母同除以 4，得到 $\\frac{2}{3}$。",
      ],
      (rng) => unlikeProblem(orderedPair(rng, true), true),
      stepLine(
        12,
        0,
        1,
        [
          [8 / 12, "8/12"],
          [11 / 12, "11/12"],
        ],
        [[11 / 12, 8 / 12]],
      ),
    ),
    point(
      "subtracting-with-the-least-common-denominator",
      ["Using the least common denominator", "用最小公分母"],
      [
        "For $\\frac{7}{9} - \\frac{1}{6}$, the least common multiple of 9 and 6 is 18. $\\frac{7}{9} = \\frac{14}{18}$ and $\\frac{1}{6} = \\frac{3}{18}$, so the difference is $\\frac{11}{18}$.\n\nCheck: $\\frac{11}{18} + \\frac{3}{18} = \\frac{14}{18} = \\frac{7}{9}$.\n\n> **Watch out.** Do not subtract the bottoms. $\\frac{7 - 1}{9 - 6} = \\frac{6}{3} = 2$, which is more than $\\frac{7}{9}$.",
        "计算 $\\frac{7}{9} - \\frac{1}{6}$，9 和 6 的最小公倍数是 18。$\\frac{7}{9} = \\frac{14}{18}$，$\\frac{1}{6} = \\frac{3}{18}$，所以差是 $\\frac{11}{18}$。\n\n检验：$\\frac{11}{18} + \\frac{3}{18} = \\frac{14}{18} = \\frac{7}{9}$。\n\n> **注意。** 分母不能相减。$\\frac{7 - 1}{9 - 6} = \\frac{6}{3} = 2$，比 $\\frac{7}{9}$ 还大。",
      ],
      (rng) => unlikeProblem(orderedPair(rng, false), true),
      twoBarsFigure(9, 7, 6, 1),
    ),
  ],
  t(
    "Kai has $\\frac{7}{8}$ of a pizza and eats $\\frac{1}{6}$ of a pizza. Over 24ths: $\\frac{21}{24} - \\frac{4}{24} = \\frac{17}{24}$ of a pizza is left.\n\nCheck: $\\frac{17}{24} + \\frac{4}{24} = \\frac{21}{24} = \\frac{7}{8}$.\n\nIn this lesson we subtract fractions over a common denominator.",
    "凯有 $\\frac{7}{8}$ 个比萨，吃了 $\\frac{1}{6}$ 个。化成二十四分之几：还剩 $\\frac{21}{24} - \\frac{4}{24} = \\frac{17}{24}$ 个。\n\n检验：$\\frac{17}{24} + \\frac{4}{24} = \\frac{21}{24} = \\frac{7}{8}$。\n\n本课我们先通分，再做分数减法。",
  ),
);

/** Measure is a unit for fraction word problems. */
interface Measure {
  readonly en: string;
  readonly zh: string;
}

const measures: readonly Measure[] = [
  { en: "miles", zh: "英里" },
  { en: "cups", zh: "杯" },
  { en: "liters", zh: "升" },
  { en: "hours", zh: "小时" },
  { en: "pounds", zh: "磅" },
  { en: "meters", zh: "米" },
];

/** WordStory is a word problem about two amounts that are joined or compared. */
interface WordStory {
  readonly sub: boolean;
  readonly en: (n: string, x: string, y: string, u: Measure) => string;
  readonly zh: (n: string, x: string, y: string, u: Measure) => string;
}

const wordStories: readonly WordStory[] = [
  {
    sub: false,
    en: (n, x, y, u) =>
      `${n} walked $${x}$ ${u.en} in the morning and $${y}$ ${u.en} in the afternoon. How many ${u.en} did ${n} walk in all?`,
    zh: (n, x, y, u) => `${n} 上午走了 $${x}$ ${u.zh}，下午走了 $${y}$ ${u.zh}。一共走了多少${u.zh}？`,
  },
  {
    sub: false,
    en: (n, x, y, u) =>
      `${n} used $${x}$ ${u.en} of water for one plant and $${y}$ ${u.en} for another. How much water did ${n} use in all, in ${u.en}?`,
    zh: (n, x, y, u) => `${n} 给一盆花浇了 $${x}$ ${u.zh}水，给另一盆浇了 $${y}$ ${u.zh}。一共浇了多少${u.zh}水？`,
  },
  {
    sub: true,
    en: (n, x, y, u) => `${n} had $${x}$ ${u.en} of rope and used $${y}$ ${u.en}. How many ${u.en} are left?`,
    zh: (n, x, y, u) => `${n} 有 $${x}$ ${u.zh}绳子，用去了 $${y}$ ${u.zh}。还剩多少${u.zh}？`,
  },
  {
    sub: true,
    en: (n, x, y, u) =>
      `On Monday ${n} practiced for $${x}$ ${u.en}, and on Tuesday for $${y}$ ${u.en}. How much longer did ${n} practice on Monday, in ${u.en}?`,
    zh: (n, x, y, u) => `${n} 星期一练习了 $${x}$ ${u.zh}，星期二练习了 $${y}$ ${u.zh}。星期一比星期二多练习了多少${u.zh}？`,
  },
];

export const addingAndSubtractingFractionsWithUnlikeDenominatorsWordProblems = topic(
  "adding-and-subtracting-fractions-with-unlike-denominators-word-problems",
  t("Adding and Subtracting Fractions With Unlike Denominators: Word Problems", "异分母分数加减法应用题"),
  t(
    "Word problems that join two amounts are solved by adding, and those that ask how much is left or how much more by subtracting. With unlike denominators, rewrite the fractions with a common denominator first: walking 2/3 mile and then 1/4 mile is 8/12 + 3/12 = 11/12 mile.",
    "把两个量合起来的应用题用加法，问还剩多少或多多少的用减法。分母不同时，先通分：先走 2/3 英里再走 1/4 英里，一共走了 8/12 + 3/12 = 11/12 英里。",
  ),
  ["subtracting-fractions-with-unlike-denominators", "adding-fractions-with-like-denominators-word-problems"],
  ["5.NF.A.2"],
  [
    point(
      "adding-fractions-in-word-problems",
      ["Joining amounts", "合并两个量"],
      [
        '$\\frac{1}{2}$ cup of milk and $\\frac{2}{3}$ cup of water go into a pot. In all: $\\frac{3}{6} + \\frac{4}{6} = \\frac{7}{6} = 1\\frac{1}{6}$ cups.\n\nCheck: $\\frac{7}{6} - \\frac{4}{6} = \\frac{3}{6} = \\frac{1}{2}$.\n\n> **Watch out.** "In all" means add. Do not subtract the two amounts.',
        "锅里倒入 $\\frac{1}{2}$ 杯牛奶和 $\\frac{2}{3}$ 杯水。一共是 $\\frac{3}{6} + \\frac{4}{6} = \\frac{7}{6} = 1\\frac{1}{6}$ 杯。\n\n检验：$\\frac{7}{6} - \\frac{4}{6} = \\frac{3}{6} = \\frac{1}{2}$。\n\n> **注意。** “一共”要用加法，不能把两个量相减。",
      ],
      (rng) => storyProblem(rng, rng.bool() ? relatedPair(rng) : unrelatedPair(rng), false),
      sumTape(
        [
          [1 / 2, "1/2"],
          [2 / 3, "2/3"],
        ],
        "?",
      ),
    ),
    point(
      "subtracting-fractions-in-word-problems",
      ["What is left, or how much more", "还剩多少或多多少"],
      [
        'There is $\\frac{5}{6}$ liter of juice, and $\\frac{1}{4}$ liter is drunk. Left: $\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$ liter.\n\nCheck: $\\frac{7}{12} + \\frac{3}{12} = \\frac{10}{12} = \\frac{5}{6}$.\n\n> **Watch out.** "Left" means subtract. Adding gives more than you started with.',
        "有 $\\frac{5}{6}$ 升果汁，喝掉了 $\\frac{1}{4}$ 升。还剩 $\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$ 升。\n\n检验：$\\frac{7}{12} + \\frac{3}{12} = \\frac{10}{12} = \\frac{5}{6}$。\n\n> **注意。** “还剩”要用减法。相加得到的比原来还多。",
      ],
      (rng) => storyProblem(rng, orderedPair(rng, rng.bool()), true),
      sumTape(
        [
          [1 / 4, "1/4"],
          [7 / 12, "?"],
        ],
        "5/6",
      ),
    ),
  ],
  t(
    "Nora walks $\\frac{2}{3}$ mile to the park and then $\\frac{1}{4}$ mile to the shop. In all she walks $\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$ mile.\n\nCheck: $\\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$.\n\nIn this lesson we add and subtract fractions in stories.",
    "诺拉走 $\\frac{2}{3}$ 英里到公园，又走 $\\frac{1}{4}$ 英里到商店。她一共走了 $\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$ 英里。\n\n检验：$\\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$。\n\n本课我们在故事里做分数加减法。",
  ),
);

// ---------------------------------------------------------------------------
// Adding and subtracting mixed numbers

/** MixedPair is w1 a/b and w2 c/d with unlike denominators. */
interface MixedPair extends FractionPair {
  readonly w1: number;
  readonly w2: number;
}

/** mixedPair draws two mixed numbers with unlike denominators. regroup asks for fractions that add to more than 1 (adding) or a smaller first fraction (subtracting). */
function mixedPair(rng: Rng, sub: boolean, regroup: boolean): MixedPair {
  for (;;) {
    const p = rng.bool() ? relatedPair(rng) : unrelatedPair(rng);
    const f1 = qf(p.a, p.b);
    const f2 = qf(p.c, p.d);
    const w1 = rng.int(1, 9);
    const w2 = rng.int(1, 9);
    if (!sub && f1.add(f2).cmp(Q.one) > 0 !== regroup) continue;
    if (!sub && f1.add(f2).eq(Q.one)) continue;
    if (sub && (w1 <= w2 || f1.eq(f2) || f1.cmp(f2) < 0 !== regroup)) continue;
    return { ...p, w1, w2 };
  }
}

/** mixedPairValue is w1 a/b ± w2 c/d. */
const mixedPairValue = (m: MixedPair, sub: boolean) =>
  sub ? mixedValue(m.w1, m.a, m.b).sub(mixedValue(m.w2, m.c, m.d)) : mixedValue(m.w1, m.a, m.b).add(mixedValue(m.w2, m.c, m.d));

/** mixedWalk adds or subtracts two mixed numbers part by part over a common denominator, regrouping when needed, in labelled steps. */
function mixedWalk(m: MixedPair, sub: boolean): Walk[] {
  const L = lcm(m.b, m.d);
  const [x, y] = [(m.a * L) / m.b, (m.c * L) / m.d];
  const v = mixedPairValue(m, sub);
  const common: Walk = [
    ["Find a common denominator", "通分"],
    [`The least common multiple of ${m.b} and ${m.d} is ${L}.`, `${m.b} 和 ${m.d} 的最小公倍数是 ${L}。`],
    [
      [m.a, m.b, x],
      [m.c, m.d, y],
    ]
      .filter(([, d]) => d !== L)
      .map(([n, d, k]) => `${fr(n!, d!)} = ${fr(k!, L)}`),
  ];
  const finish = (w: number, n: number) => (mx(w, n, L) === mq(v) ? "" : ` = ${mq(v)}`);
  if (!sub) {
    const s = x + y;
    const added: Walk = [
      ["Add the parts", "分别相加"],
      ["Add the whole numbers, then the fractions.", "整数部分和分数部分分别相加。"],
      [`${mx(m.w1, x, L)} + ${mx(m.w2, y, L)} = ${m.w1 + m.w2}${fr(s, L)}`],
    ];
    if (s < L) return [common, [added[0], added[1], [`${added[2]![0]}${finish(m.w1 + m.w2, s)}`]]];
    return [
      common,
      added,
      [
        ["Regroup", "进位"],
        [`$${fr(s, L)}$ is more than 1, so move one whole to the whole-number part.`, `$${fr(s, L)}$ 大于 1，把一个整体移到整数部分。`],
        [`${m.w1 + m.w2}${fr(s, L)} = ${mx(m.w1 + m.w2 + 1, s - L, L)}${finish(m.w1 + m.w2 + 1, s - L)}`],
      ],
    ];
  }
  if (x > y)
    return [
      common,
      [
        ["Subtract the parts", "分别相减"],
        ["Subtract the whole numbers, then the fractions.", "整数部分和分数部分分别相减。"],
        [`${mx(m.w1, x, L)} - ${mx(m.w2, y, L)} = ${mx(m.w1 - m.w2, x - y, L)}${finish(m.w1 - m.w2, x - y)}`],
      ],
    ];
  return [
    common,
    [
      ["Regroup", "退位"],
      [
        `$${fr(x, L)}$ is less than $${fr(y, L)}$, so take one whole as $${fr(L, L)}$.`,
        `$${fr(x, L)}$ 比 $${fr(y, L)}$ 小，从整数部分退一作 $${fr(L, L)}$。`,
      ],
      [`${mx(m.w1, x, L)} = ${m.w1 - 1}${fr(x + L, L)}`],
    ],
    [
      ["Subtract the parts", "分别相减"],
      ["Subtract the whole numbers, then the fractions.", "整数部分和分数部分分别相减。"],
      [`${m.w1 - 1}${fr(x + L, L)} - ${mx(m.w2, y, L)} = ${mx(m.w1 - 1 - m.w2, x + L - y, L)}${finish(m.w1 - 1 - m.w2, x + L - y)}`],
    ],
  ];
}

/** mixedCheck undoes w1 a/b ± w2 c/d to get back to w1 a/b. */
function mixedCheck(m: MixedPair, sub: boolean): Pair {
  const v = mq(mixedPairValue(m, sub));
  const [first, second] = [mx(m.w1, m.a, m.b), mx(m.w2, m.c, m.d)];
  return sub
    ? [`Add back: $${v} + ${second} = ${first}$.`, `加回去：$${v} + ${second} = ${first}$。`]
    : [`Subtract back: $${v} - ${second} = ${first}$.`, `减回去：$${v} - ${second} = ${first}$。`];
}

/** mixedMisses are the usual slips with w1 a/b ± w2 c/d, each with its reason. */
function mixedMisses(m: MixedPair, sub: boolean): [Q, string, string][] {
  const L = lcm(m.b, m.d);
  const [x, y] = [(m.a * L) / m.b, (m.c * L) / m.d];
  const v = mixedPairValue(m, sub);
  const wholes = sub ? m.w1 - m.w2 : m.w1 + m.w2;
  const out: [Q, string, string][] = [];
  if (!sub && x + y > L)
    out.push([v.sub(Q.one), "That drops the whole made by the two fractions.", "这里漏掉了两个分数部分凑成的一个整体。"]);
  if (!sub && x + y < L) out.push([v.add(Q.one), "That adds one whole too many.", "多加了一个整体。"]);
  if (sub && x < y) {
    out.push([v.add(Q.one), "That regroups but does not take the whole from the whole number.", "退位时整数部分没有减去 1。"]);
    out.push([
      qf(wholes, 1).add(qf(y - x, L)),
      "That takes the smaller fraction from the larger one instead of regrouping.",
      "这是用大的分数减小的分数，没有退位。",
    ]);
  }
  if (sub && x > y) out.push([v.sub(Q.one), "That takes away one whole too many.", "多减了一个整体。"]);
  const n = sub ? m.a - m.c : m.a + m.c;
  if (n > 0)
    out.push([qf(wholes, 1).add(qf(n, m.b + m.d)), "That works the fractions by adding the bottoms.", "这是在分数部分把分母也加起来了。"]);
  out.push([v.add(qf(1, L)), `That is one $${fr(1, L)}$ too many.`, `多算了一个 $${fr(1, L)}$。`]);
  return out;
}

/** mixedFigure draws a bar for w1 a/b ± w2 c/d: the two parts of a sum, or the part taken away and the part left. */
function mixedFigure(m: MixedPair, sub: boolean): Figure {
  const [first, second] = [mixedValue(m.w1, m.a, m.b), mixedValue(m.w2, m.c, m.d)];
  return sub
    ? sumTape(
        [
          [second.toNumber(), mixedText(m.w2, m.c, m.d)],
          [first.sub(second).toNumber(), "?"],
        ],
        mixedText(m.w1, m.a, m.b),
      )
    : sumTape(
        [
          [first.toNumber(), mixedText(m.w1, m.a, m.b)],
          [second.toNumber(), mixedText(m.w2, m.c, m.d)],
        ],
        "?",
      );
}

/** mixedAnswered asks for w1 a/b ± w2 c/d and works it part by part. */
function mixedAnswered(m: MixedPair, sub: boolean): Problem {
  const op = sub ? "-" : "+";
  return answered(
    [`Find $${mx(m.w1, m.a, m.b)} ${op} ${mx(m.w2, m.c, m.d)}$.`, `计算 $${mx(m.w1, m.a, m.b)} ${op} ${mx(m.w2, m.c, m.d)}$。`],
    mixedPairValue(m, sub),
    mixedWalk(m, sub),
    mixedCheck(m, sub),
    mixedMisses(m, sub),
    { form: "mixed", figure: mixedFigure(m, sub) },
  );
}

/** improperWalk subtracts two mixed numbers by writing both as improper fractions over a common denominator. */
function improperWalk(m: MixedPair): Walk[] {
  const L = lcm(m.b, m.d);
  const [p, q] = [m.w1 * m.b + m.a, m.w2 * m.d + m.c];
  const [x, y] = [(p * L) / m.b, (q * L) / m.d];
  const v = mixedPairValue(m, true);
  const last = x - y < L && gcd(x - y, L) === 1 ? "" : ` = ${mq(v)}`;
  return [
    [
      ["Write improper fractions", "化成假分数"],
      ["Multiply the whole number by the bottom and add the top.", "整数部分乘分母，再加分子。"],
      [`${mx(m.w1, m.a, m.b)} = ${fr(p, m.b)}`, `${mx(m.w2, m.c, m.d)} = ${fr(q, m.d)}`],
    ],
    [
      ["Find a common denominator", "通分"],
      [`The least common multiple of ${m.b} and ${m.d} is ${L}.`, `${m.b} 和 ${m.d} 的最小公倍数是 ${L}。`],
      [
        [p, m.b, x],
        [q, m.d, y],
      ]
        .filter(([, d]) => d !== L)
        .map(([n, d, k]) => `${fr(n!, d!)} = ${fr(k!, L)}`),
    ],
    [
      ["Subtract the tops", "分子相减"],
      [`The bottom stays ${L}.`, `分母 ${L} 不变。`],
      [`${fr(x, L)} - ${fr(y, L)} = ${fr(x - y, L)}${last}`],
    ],
  ];
}

/** improperMisses are the usual slips when subtracting mixed numbers as improper fractions. */
function improperMisses(m: MixedPair): [Q, string, string][] {
  const L = lcm(m.b, m.d);
  const [x, y] = [(m.a * L) / m.b, (m.c * L) / m.d];
  const v = mixedPairValue(m, true);
  return [
    [
      qf(m.w1 + m.a, m.b).sub(qf(m.w2 + m.c, m.d)),
      "That adds the whole number to the top instead of multiplying it by the bottom first.",
      "这是把整数直接加到分子上，没有先乘分母。",
    ],
    [qf(m.w1 - m.w2, 1).add(qf(y - x, L)), "That takes the smaller fraction from the larger one.", "这是用大的分数减小的分数。"],
    [v.add(qf(1, L)), `That is one $${fr(1, L)}$ too many.`, `多算了一个 $${fr(1, L)}$。`],
    [v.add(Q.one), "That keeps one whole too many.", "多留了一个整体。"],
  ];
}

/** improperAnswered asks for w1 a/b − w2 c/d worked as improper fractions. */
function improperAnswered(m: MixedPair, prompt: Pair): Problem {
  return answered(prompt, mixedPairValue(m, true), improperWalk(m), mixedCheck(m, true), improperMisses(m), {
    form: "mixed",
    figure: mixedFigure(m, true),
  });
}

/** mixedStory asks a word problem that adds or subtracts two mixed numbers. */
function mixedStory(rng: Rng, m: MixedPair, sub: boolean): Problem {
  const choose: Walk = sub
    ? [
        ["Choose the operation", "选择运算"],
        ["The question asks what is left or how much more, so subtract.", "问题问还剩多少或多多少，所以用减法。"],
      ]
    : [
        ["Choose the operation", "选择运算"],
        ["The two amounts are put together, so add.", "两个量合在一起，所以用加法。"],
      ];
  return answered(
    storyPrompt(rng, sub, mx(m.w1, m.a, m.b), mx(m.w2, m.c, m.d)),
    mixedPairValue(m, sub),
    [choose, ...mixedWalk(m, sub)],
    mixedCheck(m, sub),
    mixedMisses(m, sub),
    { form: "mixed", figure: mixedFigure(m, sub) },
  );
}

export const addingMixedNumbersWithUnlikeDenominators = topic(
  "adding-mixed-numbers-with-unlike-denominators",
  t("Adding Mixed Numbers With Unlike Denominators", "异分母带分数加法"),
  t(
    "To add mixed numbers with unlike denominators, rewrite the fractions with a common denominator, then add the whole numbers and the fractions. If the fractions add up to more than 1, regroup: 2 3/4 + 1 2/3 = 2 9/12 + 1 8/12 = 3 17/12 = 4 5/12.",
    "异分母带分数相加，先把分数部分通分，再把整数部分、分数部分分别相加。分数部分的和超过 1 时要进位：2 3/4 + 1 2/3 = 2 9/12 + 1 8/12 = 3 17/12 = 4 5/12。",
  ),
  ["adding-fractions-with-unlike-denominators", "adding-mixed-numbers-with-like-denominators"],
  ["5.NF.A.1"],
  [
    point(
      "adding-unlike-mixed-numbers-without-regrouping",
      ["Without regrouping", "不需要进位"],
      [
        "For $3\\frac{1}{4} + 2\\frac{1}{3}$, use twelfths: $3\\frac{3}{12} + 2\\frac{4}{12} = 5\\frac{7}{12}$.\n\nCheck: $5\\frac{7}{12} - 2\\frac{4}{12} = 3\\frac{3}{12} = 3\\frac{1}{4}$.\n\n> **Watch out.** Add the whole numbers too. $\\frac{3}{12} + \\frac{4}{12}$ is only the fraction part.",
        "计算 $3\\frac{1}{4} + 2\\frac{1}{3}$，用十二分之几：$3\\frac{3}{12} + 2\\frac{4}{12} = 5\\frac{7}{12}$。\n\n检验：$5\\frac{7}{12} - 2\\frac{4}{12} = 3\\frac{3}{12} = 3\\frac{1}{4}$。\n\n> **注意。** 整数部分也要相加。$\\frac{3}{12} + \\frac{4}{12}$ 只是分数部分。",
      ],
      (rng) => mixedAnswered(mixedPair(rng, false, false), false),
      sumTape(
        [
          [3.25, "3 1/4"],
          [7 / 3, "2 1/3"],
        ],
        "?",
      ),
    ),
    point(
      "adding-unlike-mixed-numbers-with-regrouping",
      ["With regrouping", "需要进位"],
      [
        "For $1\\frac{5}{6} + 2\\frac{1}{2}$, use sixths: $1\\frac{5}{6} + 2\\frac{3}{6} = 3\\frac{8}{6}$. Since $\\frac{8}{6} = 1\\frac{2}{6}$, the sum is $4\\frac{2}{6} = 4\\frac{1}{3}$.\n\nCheck: $4\\frac{2}{6} - 2\\frac{3}{6} = 3\\frac{8}{6} - 2\\frac{3}{6} = 1\\frac{5}{6}$.\n\n> **Watch out.** $\\frac{8}{6}$ is more than 1. Move the whole into the whole-number part.",
        "计算 $1\\frac{5}{6} + 2\\frac{1}{2}$，用六分之几：$1\\frac{5}{6} + 2\\frac{3}{6} = 3\\frac{8}{6}$。因为 $\\frac{8}{6} = 1\\frac{2}{6}$，和是 $4\\frac{2}{6} = 4\\frac{1}{3}$。\n\n检验：$4\\frac{2}{6} - 2\\frac{3}{6} = 3\\frac{8}{6} - 2\\frac{3}{6} = 1\\frac{5}{6}$。\n\n> **注意。** $\\frac{8}{6}$ 大于 1，要把这个整体移到整数部分。",
      ],
      (rng) => mixedAnswered(mixedPair(rng, false, true), false),
      stepLine(
        6,
        1,
        5,
        [
          [11 / 6, "1 5/6"],
          [13 / 3, "4 1/3"],
        ],
        [[11 / 6, 13 / 3]],
      ),
    ),
  ],
  t(
    "Sam hikes $2\\frac{3}{4}$ miles before lunch and $1\\frac{2}{3}$ miles after. In twelfths: $2\\frac{9}{12} + 1\\frac{8}{12} = 3\\frac{17}{12} = 4\\frac{5}{12}$ miles.\n\nCheck: $4\\frac{5}{12} - 1\\frac{8}{12} = 3\\frac{17}{12} - 1\\frac{8}{12} = 2\\frac{9}{12} = 2\\frac{3}{4}$.\n\nIn this lesson we add mixed numbers whose fractions have different bottoms.",
    "萨姆午饭前走了 $2\\frac{3}{4}$ 英里，午饭后走了 $1\\frac{2}{3}$ 英里。化成十二分之几：$2\\frac{9}{12} + 1\\frac{8}{12} = 3\\frac{17}{12} = 4\\frac{5}{12}$ 英里。\n\n检验：$4\\frac{5}{12} - 1\\frac{8}{12} = 3\\frac{17}{12} - 1\\frac{8}{12} = 2\\frac{9}{12} = 2\\frac{3}{4}$。\n\n本课我们做分母不同的带分数加法。",
  ),
);

export const subtractingMixedNumbersWithUnlikeDenominators = topic(
  "subtracting-mixed-numbers-with-unlike-denominators",
  t("Subtracting Mixed Numbers With Unlike Denominators", "异分母带分数减法"),
  t(
    "To subtract mixed numbers with unlike denominators, rewrite the fractions with a common denominator and subtract the whole numbers and the fractions. If the first fraction is smaller, regroup one whole: 5 1/6 − 2 1/2 = 5 1/6 − 2 3/6 = 4 7/6 − 2 3/6 = 2 4/6 = 2 2/3.",
    "异分母带分数相减，先把分数部分通分，再把整数部分、分数部分分别相减。如果被减数的分数部分较小，就从整数部分退一：5 1/6 − 2 1/2 = 5 1/6 − 2 3/6 = 4 7/6 − 2 3/6 = 2 4/6 = 2 2/3。",
  ),
  ["adding-mixed-numbers-with-unlike-denominators", "subtracting-mixed-numbers-with-like-denominators"],
  ["5.NF.A.1"],
  [
    point(
      "subtracting-unlike-mixed-numbers-without-regrouping",
      ["Without regrouping", "不需要退位"],
      [
        "For $6\\frac{3}{4} - 2\\frac{1}{6}$, use twelfths: $6\\frac{9}{12} - 2\\frac{2}{12} = 4\\frac{7}{12}$.\n\nCheck: $4\\frac{7}{12} + 2\\frac{2}{12} = 6\\frac{9}{12} = 6\\frac{3}{4}$.\n\n> **Watch out.** Rewrite both fractions before you subtract. Do not subtract the bottoms.",
        "计算 $6\\frac{3}{4} - 2\\frac{1}{6}$，用十二分之几：$6\\frac{9}{12} - 2\\frac{2}{12} = 4\\frac{7}{12}$。\n\n检验：$4\\frac{7}{12} + 2\\frac{2}{12} = 6\\frac{9}{12} = 6\\frac{3}{4}$。\n\n> **注意。** 两个分数都要先改写再相减，分母不能相减。",
      ],
      (rng) => mixedAnswered(mixedPair(rng, true, false), true),
      sumTape(
        [
          [13 / 6, "2 1/6"],
          [55 / 12, "?"],
        ],
        "6 3/4",
      ),
    ),
    point(
      "subtracting-unlike-mixed-numbers-with-regrouping",
      ["With regrouping", "需要退位"],
      [
        "For $4\\frac{1}{3} - 1\\frac{3}{4}$, use twelfths: $4\\frac{4}{12} - 1\\frac{9}{12}$. Since 4 is less than 9, regroup: $3\\frac{16}{12} - 1\\frac{9}{12} = 2\\frac{7}{12}$.\n\nCheck: $2\\frac{7}{12} + 1\\frac{9}{12} = 3\\frac{16}{12} = 4\\frac{4}{12} = 4\\frac{1}{3}$.\n\n> **Watch out.** Do not take the smaller fraction from the larger one. $\\frac{9}{12} - \\frac{4}{12}$ gives the wrong answer $3\\frac{5}{12}$.",
        "计算 $4\\frac{1}{3} - 1\\frac{3}{4}$，用十二分之几：$4\\frac{4}{12} - 1\\frac{9}{12}$。4 比 9 小，所以退位：$3\\frac{16}{12} - 1\\frac{9}{12} = 2\\frac{7}{12}$。\n\n检验：$2\\frac{7}{12} + 1\\frac{9}{12} = 3\\frac{16}{12} = 4\\frac{4}{12} = 4\\frac{1}{3}$。\n\n> **注意。** 不能用大的分数减小的分数。$\\frac{9}{12} - \\frac{4}{12}$ 会得到错误答案 $3\\frac{5}{12}$。",
      ],
      (rng) => mixedAnswered(mixedPair(rng, true, true), true),
      sumTape(
        [
          [1.75, "1 3/4"],
          [31 / 12, "?"],
        ],
        "4 1/3",
      ),
    ),
  ],
  t(
    "A jug holds $5\\frac{1}{6}$ liters of water, and $2\\frac{1}{2}$ liters are poured out. In sixths: $5\\frac{1}{6} - 2\\frac{3}{6} = 4\\frac{7}{6} - 2\\frac{3}{6} = 2\\frac{4}{6} = 2\\frac{2}{3}$ liters are left.\n\nCheck: $2\\frac{4}{6} + 2\\frac{3}{6} = 4\\frac{7}{6} = 5\\frac{1}{6}$.\n\nIn this lesson we subtract mixed numbers whose fractions have different bottoms.",
    "一个水壶里有 $5\\frac{1}{6}$ 升水，倒出了 $2\\frac{1}{2}$ 升。化成六分之几：$5\\frac{1}{6} - 2\\frac{3}{6} = 4\\frac{7}{6} - 2\\frac{3}{6} = 2\\frac{4}{6} = 2\\frac{2}{3}$ 升，这是剩下的水。\n\n检验：$2\\frac{4}{6} + 2\\frac{3}{6} = 4\\frac{7}{6} = 5\\frac{1}{6}$。\n\n本课我们做分母不同的带分数减法。",
  ),
);

export const subtractingMixedNumbersWithUnlikeDenominatorsUsingImproperFractions = topic(
  "subtracting-mixed-numbers-with-unlike-denominators-using-improper-fractions",
  t("Subtracting Mixed Numbers With Unlike Denominators Using Improper Fractions", "化成假分数做异分母带分数减法"),
  t(
    "Instead of regrouping, both mixed numbers can be written as improper fractions with a common denominator: 3 1/4 − 1 2/3 = 13/4 − 5/3 = 39/12 − 20/12 = 19/12 = 1 7/12.",
    "也可以不退位，而是把两个带分数都化成假分数再通分：3 1/4 − 1 2/3 = 13/4 − 5/3 = 39/12 − 20/12 = 19/12 = 1 7/12。",
  ),
  ["subtracting-mixed-numbers-with-unlike-denominators", "subtracting-mixed-numbers-with-like-denominators-using-improper-fractions"],
  ["5.NF.A.1"],
  [
    point(
      "subtracting-unlike-mixed-numbers-as-improper-fractions",
      ["Subtracting as improper fractions", "化成假分数相减"],
      [
        "$2\\frac{1}{2} - 1\\frac{4}{5} = \\frac{5}{2} - \\frac{9}{5} = \\frac{25}{10} - \\frac{18}{10} = \\frac{7}{10}$.\n\nCheck: $\\frac{7}{10} + 1\\frac{8}{10} = 1\\frac{15}{10} = 2\\frac{5}{10} = 2\\frac{1}{2}$.\n\n> **Watch out.** Multiply the whole number by the bottom before adding the top. $2\\frac{1}{2}$ is $\\frac{5}{2}$, not $\\frac{3}{2}$.",
        "$2\\frac{1}{2} - 1\\frac{4}{5} = \\frac{5}{2} - \\frac{9}{5} = \\frac{25}{10} - \\frac{18}{10} = \\frac{7}{10}$。\n\n检验：$\\frac{7}{10} + 1\\frac{8}{10} = 1\\frac{15}{10} = 2\\frac{5}{10} = 2\\frac{1}{2}$。\n\n> **注意。** 先用整数部分乘分母，再加分子。$2\\frac{1}{2}$ 是 $\\frac{5}{2}$，不是 $\\frac{3}{2}$。",
      ],
      (rng) => {
        const m = mixedPair(rng, true, true);
        return improperAnswered(m, [
          `Find $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$ by writing both as improper fractions.`,
          `把两个数都化成假分数，计算 $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$。`,
        ]);
      },
      stepLine(
        10,
        0,
        3,
        [
          [0.7, "7/10"],
          [2.5, "2 1/2"],
        ],
        [[2.5, 0.7]],
      ),
    ),
    point(
      "differences-less-than-one",
      ["Differences less than 1", "差小于 1"],
      [
        "$4\\frac{1}{6} - 3\\frac{3}{4} = \\frac{25}{6} - \\frac{15}{4} = \\frac{50}{12} - \\frac{45}{12} = \\frac{5}{12}$.\n\nCheck: $\\frac{5}{12} + 3\\frac{9}{12} = 3\\frac{14}{12} = 4\\frac{2}{12} = 4\\frac{1}{6}$.\n\n> **Watch out.** The two numbers are less than 1 apart, so there is no whole-number part. Do not write $1\\frac{5}{12}$.",
        "$4\\frac{1}{6} - 3\\frac{3}{4} = \\frac{25}{6} - \\frac{15}{4} = \\frac{50}{12} - \\frac{45}{12} = \\frac{5}{12}$。\n\n检验：$\\frac{5}{12} + 3\\frac{9}{12} = 3\\frac{14}{12} = 4\\frac{2}{12} = 4\\frac{1}{6}$。\n\n> **注意。** 两个数相差不到 1，所以没有整数部分。不要写成 $1\\frac{5}{12}$。",
      ],
      (rng) => {
        const base = mixedPair(rng, true, true);
        const w2 = rng.int(1, 8);
        const m = { ...base, w1: w2 + 1, w2 };
        return improperAnswered(m, [
          `Find $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$.`,
          `计算 $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$。`,
        ]);
      },
      stepLine(
        12,
        3,
        5,
        [
          [3.75, "3 3/4"],
          [25 / 6, "4 1/6"],
        ],
        [[3.75, 25 / 6]],
      ),
    ),
  ],
  t(
    "A board is $3\\frac{1}{4}$ feet long, and Tom saws off $1\\frac{2}{3}$ feet. As improper fractions: $\\frac{13}{4} - \\frac{5}{3} = \\frac{39}{12} - \\frac{20}{12} = \\frac{19}{12} = 1\\frac{7}{12}$ feet are left.\n\nCheck: $1\\frac{7}{12} + 1\\frac{8}{12} = 2\\frac{15}{12} = 3\\frac{3}{12} = 3\\frac{1}{4}$.\n\nIn this lesson we subtract mixed numbers by writing them as improper fractions.",
    "一块木板长 $3\\frac{1}{4}$ 英尺，汤姆锯掉了 $1\\frac{2}{3}$ 英尺。化成假分数：$\\frac{13}{4} - \\frac{5}{3} = \\frac{39}{12} - \\frac{20}{12} = \\frac{19}{12} = 1\\frac{7}{12}$ 英尺，这是剩下的长度。\n\n检验：$1\\frac{7}{12} + 1\\frac{8}{12} = 2\\frac{15}{12} = 3\\frac{3}{12} = 3\\frac{1}{4}$。\n\n本课我们把带分数化成假分数再相减。",
  ),
);

export const addingAndSubtractingMixedNumbersWithUnlikeDenominatorsWordProblems = topic(
  "adding-and-subtracting-mixed-numbers-with-unlike-denominators-word-problems",
  t("Adding and Subtracting Mixed Numbers With Unlike Denominators: Word Problems", "异分母带分数加减法应用题"),
  t(
    "Word problems with mixed amounts are solved the same way as with fractions: add to join, subtract to find what is left or how much more, using a common denominator: 2 1/2 hours and 1 3/4 hours make 2 2/4 + 1 3/4 = 3 5/4 = 4 1/4 hours.",
    "带分数的应用题和分数的一样：合并用加法，求剩下或多多少用减法，计算时要通分：2 1/2 小时和 1 3/4 小时一共是 2 2/4 + 1 3/4 = 3 5/4 = 4 1/4 小时。",
  ),
  ["subtracting-mixed-numbers-with-unlike-denominators", "adding-and-subtracting-fractions-with-unlike-denominators-word-problems"],
  ["5.NF.A.2"],
  [
    point(
      "adding-mixed-numbers-in-word-problems",
      ["Joining amounts", "合并两个量"],
      [
        "Ben walks $1\\frac{1}{3}$ miles, then $2\\frac{1}{2}$ miles. In all: $1\\frac{2}{6} + 2\\frac{3}{6} = 3\\frac{5}{6}$ miles.\n\nCheck: $3\\frac{5}{6} - 2\\frac{3}{6} = 1\\frac{2}{6} = 1\\frac{1}{3}$.\n\n> **Watch out.** Do not add $\\frac{1}{3}$ and $\\frac{1}{2}$ as $\\frac{2}{5}$. Use sixths for both.",
        "本先走了 $1\\frac{1}{3}$ 英里，又走了 $2\\frac{1}{2}$ 英里。一共是 $1\\frac{2}{6} + 2\\frac{3}{6} = 3\\frac{5}{6}$ 英里。\n\n检验：$3\\frac{5}{6} - 2\\frac{3}{6} = 1\\frac{2}{6} = 1\\frac{1}{3}$。\n\n> **注意。** 不能把 $\\frac{1}{3}$ 和 $\\frac{1}{2}$ 加成 $\\frac{2}{5}$。两个都要化成六分之几。",
      ],
      (rng) => mixedStory(rng, mixedPair(rng, false, rng.bool()), false),
      sumTape(
        [
          [4 / 3, "1 1/3"],
          [2.5, "2 1/2"],
        ],
        "?",
      ),
    ),
    point(
      "subtracting-mixed-numbers-in-word-problems",
      ["What is left, or how much more", "还剩多少或多多少"],
      [
        "Grace has $5\\frac{1}{4}$ meters of rope and uses $2\\frac{1}{2}$ meters. In fourths: $5\\frac{1}{4} - 2\\frac{2}{4} = 4\\frac{5}{4} - 2\\frac{2}{4} = 2\\frac{3}{4}$ meters are left.\n\nCheck: $2\\frac{3}{4} + 2\\frac{2}{4} = 4\\frac{5}{4} = 5\\frac{1}{4}$.\n\n> **Watch out.** $\\frac{1}{4}$ is less than $\\frac{2}{4}$, so regroup $5\\frac{1}{4}$ as $4\\frac{5}{4}$ first.",
        "格蕾丝有 $5\\frac{1}{4}$ 米绳子，用了 $2\\frac{1}{2}$ 米。化成四分之几：$5\\frac{1}{4} - 2\\frac{2}{4} = 4\\frac{5}{4} - 2\\frac{2}{4} = 2\\frac{3}{4}$ 米，这是剩下的。\n\n检验：$2\\frac{3}{4} + 2\\frac{2}{4} = 4\\frac{5}{4} = 5\\frac{1}{4}$。\n\n> **注意。** $\\frac{1}{4}$ 比 $\\frac{2}{4}$ 小，要先把 $5\\frac{1}{4}$ 退位成 $4\\frac{5}{4}$。",
      ],
      (rng) => mixedStory(rng, mixedPair(rng, true, rng.bool()), true),
      sumTape(
        [
          [2.5, "2 1/2"],
          [2.75, "?"],
        ],
        "5 1/4",
      ),
    ),
  ],
  t(
    "Lily reads for $2\\frac{1}{2}$ hours on Saturday and $1\\frac{3}{4}$ hours on Sunday. In all: $2\\frac{2}{4} + 1\\frac{3}{4} = 3\\frac{5}{4} = 4\\frac{1}{4}$ hours.\n\nCheck: $4\\frac{1}{4} - 1\\frac{3}{4} = 3\\frac{5}{4} - 1\\frac{3}{4} = 2\\frac{2}{4} = 2\\frac{1}{2}$.\n\nIn this lesson we add and subtract mixed numbers in stories.",
    "莉莉星期六读了 $2\\frac{1}{2}$ 小时书，星期日读了 $1\\frac{3}{4}$ 小时。一共是 $2\\frac{2}{4} + 1\\frac{3}{4} = 3\\frac{5}{4} = 4\\frac{1}{4}$ 小时。\n\n检验：$4\\frac{1}{4} - 1\\frac{3}{4} = 3\\frac{5}{4} - 1\\frac{3}{4} = 2\\frac{2}{4} = 2\\frac{1}{2}$。\n\n本课我们在故事里做带分数加减法。",
  ),
);

// ---------------------------------------------------------------------------
// Multiplying fractions

/** partsTape draws a bar for `total` cut into b equal parts with the first a lit. */
export function partsTape(total: string, a: number, b: number): Figure {
  return tapeFigure(
    [{ total, pieces: Array.from({ length: b }, (_, i) => ({ size: 1, text: "", lit: i < a })) }],
    [
      `A bar for ${total} cut into ${b} equal parts, with ${a} of them shaded.`,
      `表示 ${total} 的长条，平均分成 ${b} 份，涂了其中 ${a} 份。`,
    ],
  );
}

/** simplified writes n/d and, when it can be simplified, its lowest terms after an equals sign. */
const simplified = (n: number, d: number) => (gcd(n, d) > 1 ? `${fr(n, d)} = ${lowest(n, d)}` : fr(n, d));

export const multiplyingFractionsByUnitFractionsUsingModels = topic(
  "multiplying-fractions-by-unit-fractions-using-models",
  t("Multiplying Fractions by Unit Fractions Using Models", "用模型做分数乘单位分数"),
  t(
    "1/3 × 2/5 means one third of 2/5. In a unit square, shade 2 of 5 columns for 2/5, then 1 of 3 rows for 1/3. The part shaded twice is 2 of the 15 small rectangles: 1/3 × 2/5 = 2/15.",
    "1/3 × 2/5 表示 2/5 的三分之一。在单位正方形中，把 5 列中的 2 列涂色表示 2/5，再把 3 行中的 1 行涂色表示 1/3。涂了两次的部分是 15 个小长方形中的 2 个：1/3 × 2/5 = 2/15。",
  ),
  ["multiplying-fractions-by-whole-numbers", "finding-equivalent-fractions-using-area-models"],
  ["5.NF.B.4"],
  [
    point(
      "unit-fraction-times-unit-fraction-models",
      ["A unit fraction of a unit fraction", "单位分数乘单位分数"],
      [
        "For $\\frac{1}{2} \\times \\frac{1}{4}$, shade 1 of 4 columns and 1 of 2 rows. The square has $2 \\times 4 = 8$ parts, and 1 is shaded twice. So $\\frac{1}{2} \\times \\frac{1}{4} = \\frac{1}{8}$.\n\nCheck: two eighths make a fourth, so half of a fourth is one eighth.\n\n> **Watch out.** Do not add the bottoms. The square has 8 parts, not 6.",
        "计算 $\\frac{1}{2} \\times \\frac{1}{4}$，在 4 列中涂 1 列，在 2 行中涂 1 行。正方形有 $2 \\times 4 = 8$ 份，其中 1 份涂了两次。所以 $\\frac{1}{2} \\times \\frac{1}{4} = \\frac{1}{8}$。\n\n检验：两个八分之一是一个四分之一，所以四分之一的一半是八分之一。\n\n> **注意。** 分母不能相加。正方形有 8 份，不是 6 份。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const b = rng.int(2, 6);
        return answered(
          [
            `The model shows $${fr(1, b)} \\times ${fr(1, d)}$. What is the product?`,
            `模型表示 $${fr(1, b)} \\times ${fr(1, d)}$。积是多少？`,
          ],
          qf(1, b * d),
          [
            [
              ["Count all the parts", "数总份数"],
              [`The square has ${d} columns and ${b} rows.`, `正方形有 ${d} 列、${b} 行。`],
              [`${b} \\times ${d} = ${b * d}`],
            ],
            [
              ["Count the overlap", "数重叠部分"],
              ["1 small part is shaded twice.", "有 1 小份涂了两次。"],
              [`${fr(1, b)} \\times ${fr(1, d)} = ${fr(1, b * d)}`],
            ],
          ],
          [
            `${b} parts of size $${fr(1, b * d)}$ make $${fr(b, b * d)}$, which is $${fr(1, d)}$.`,
            `${b} 个 $${fr(1, b * d)}$ 是 $${fr(b, b * d)}$，正是 $${fr(1, d)}$。`,
          ],
          [
            [qf(1, b + d), "That adds the bottoms.", "这是把分母相加了。"],
            [qf(2, b * d), "That counts 2 parts, but only 1 part is shaded twice.", "这里数了 2 份，但只有 1 份涂了两次。"],
            [qf(1, Math.max(b, d)), "That is one of the two fractions, not a part of a part.", "这只是其中一个分数，不是一部分的一部分。"],
          ],
          { form: "fraction", figure: productGrid(1, d, 1, b) },
        );
      },
      productGrid(1, 4, 1, 2),
    ),
    point(
      "unit-fraction-times-fraction-models",
      ["A unit fraction of a fraction", "分数乘单位分数"],
      [
        "For $\\frac{1}{3} \\times \\frac{3}{4}$, shade 3 of 4 columns and 1 of 3 rows. The square has 12 parts, and 3 are shaded twice. So the product is $\\frac{3}{12} = \\frac{1}{4}$.\n\nCheck: $\\frac{3}{4}$ is 3 fourths, and one third of 3 fourths is 1 fourth.\n\n> **Watch out.** Only 3 parts are shaded twice. Do not count all the shaded parts.",
        "计算 $\\frac{1}{3} \\times \\frac{3}{4}$，在 4 列中涂 3 列，在 3 行中涂 1 行。正方形有 12 份，其中 3 份涂了两次。所以积是 $\\frac{3}{12} = \\frac{1}{4}$。\n\n检验：$\\frac{3}{4}$ 是 3 个四分之一，它的三分之一是 1 个四分之一。\n\n> **注意。** 只有 3 份涂了两次，不要把所有涂色的份都数上。",
      ],
      (rng) => {
        const [a, d] = properFraction(rng, 8, 3);
        const b = rng.int(2, 6);
        return answered(
          [
            `The model shows $${fr(1, b)} \\times ${fr(a, d)}$. What is the product?`,
            `模型表示 $${fr(1, b)} \\times ${fr(a, d)}$。积是多少？`,
          ],
          qf(a, b * d),
          [
            [
              ["Count all the parts", "数总份数"],
              [`The square has ${d} columns and ${b} rows.`, `正方形有 ${d} 列、${b} 行。`],
              [`${b} \\times ${d} = ${b * d}`],
            ],
            [
              ["Count the overlap", "数重叠部分"],
              [`${a} small part${a === 1 ? " is" : "s are"} shaded twice.`, `有 ${a} 小份涂了两次。`],
              [`${fr(1, b)} \\times ${fr(a, d)} = ${simplified(a, b * d)}`],
            ],
          ],
          [
            `${b} parts of size $${fr(a, b * d)}$ make $${fr(a * b, b * d)}$, which is $${fr(a, d)}$.`,
            `${b} 个 $${fr(a, b * d)}$ 是 $${fr(a * b, b * d)}$，正是 $${fr(a, d)}$。`,
          ],
          [
            [qf(a, b + d), "That adds the bottoms.", "这是把分母相加了。"],
            [qf(a + 1, b * d), "That counts one part too many.", "多数了一份。"],
            [qf(1, b * d), `That counts 1 part, but ${a} parts are shaded twice.`, `这里只数了 1 份，但有 ${a} 份涂了两次。`],
          ],
          { form: "fraction", figure: productGrid(a, d, 1, b) },
        );
      },
      productGrid(3, 4, 1, 3),
    ),
  ],
  t(
    "A tray of brownies is $\\frac{2}{5}$ full, and Eli eats $\\frac{1}{3}$ of what is there. Cut the tray into 5 columns and 3 rows: Eli eats 2 of the 15 pieces, so $\\frac{1}{3} \\times \\frac{2}{5} = \\frac{2}{15}$ of the tray.\n\nCheck: 3 helpings like Eli's make $\\frac{6}{15}$, which is $\\frac{2}{5}$.\n\nIn this lesson we use area models to take a unit fraction of a fraction.",
    "一盘布朗尼还剩 $\\frac{2}{5}$，伊莱吃了剩下部分的 $\\frac{1}{3}$。把盘子分成 5 列 3 行：伊莱吃了 15 块中的 2 块，所以 $\\frac{1}{3} \\times \\frac{2}{5} = \\frac{2}{15}$ 盘。\n\n检验：像伊莱这样的 3 份是 $\\frac{6}{15}$，正是 $\\frac{2}{5}$。\n\n本课我们用面积模型求一个分数的几分之一。",
  ),
);

export const multiplyingFractionsUsingModels = topic(
  "multiplying-fractions-using-models",
  t("Multiplying Fractions Using Models", "用模型做分数乘法"),
  t(
    "To model 2/3 × 3/4, shade 3 of 4 columns and 2 of 3 rows of a unit square. The twice-shaded part is 2 × 3 = 6 of the 3 × 4 = 12 small rectangles, so 2/3 × 3/4 = 6/12 = 1/2: multiply the numerators and multiply the denominators.",
    "用模型表示 2/3 × 3/4：在单位正方形中涂 4 列中的 3 列，再涂 3 行中的 2 行。涂了两次的部分是 3 × 4 = 12 个小长方形中的 2 × 3 = 6 个，所以 2/3 × 3/4 = 6/12 = 1/2：分子乘分子，分母乘分母。",
  ),
  ["multiplying-fractions-by-unit-fractions-using-models"],
  ["5.NF.B.4"],
  [
    point(
      "fraction-times-fraction-models",
      ["Reading the product from the model", "从模型中读出积"],
      [
        "For $\\frac{2}{5} \\times \\frac{2}{3}$, the square has $5 \\times 3 = 15$ parts, and $2 \\times 2 = 4$ are shaded twice. So the product is $\\frac{4}{15}$.\n\nCheck: multiply the tops and the bottoms. $2 \\times 2 = 4$ and $5 \\times 3 = 15$.\n\n> **Watch out.** The bottom counts all the small parts, 15, not just the shaded ones.",
        "计算 $\\frac{2}{5} \\times \\frac{2}{3}$，正方形有 $5 \\times 3 = 15$ 份，其中 $2 \\times 2 = 4$ 份涂了两次。所以积是 $\\frac{4}{15}$。\n\n检验：分子乘分子，分母乘分母。$2 \\times 2 = 4$，$5 \\times 3 = 15$。\n\n> **注意。** 分母是所有小份的个数 15，不只是涂色的份数。",
      ],
      (rng) => {
        const [a, d] = properFraction(rng, 6, 2);
        const [c, b] = properFraction(rng, 6, 3);
        return answered(
          [
            `The model shows $${fr(c, b)} \\times ${fr(a, d)}$. What is the product?`,
            `模型表示 $${fr(c, b)} \\times ${fr(a, d)}$。积是多少？`,
          ],
          qf(a * c, b * d),
          [
            [
              ["Count all the parts", "数总份数"],
              [`The square has ${d} columns and ${b} rows.`, `正方形有 ${d} 列、${b} 行。`],
              [`${b} \\times ${d} = ${b * d}`],
            ],
            [
              ["Count the overlap", "数重叠部分"],
              [`${c} rows and ${a} columns are shaded.`, `涂了 ${c} 行和 ${a} 列。`],
              [`${c} \\times ${a} = ${a * c}`],
            ],
            [
              ["Write the product", "写出积"],
              ["Overlap parts over all parts.", "重叠的份数作分子，总份数作分母。"],
              [`${fr(c, b)} \\times ${fr(a, d)} = ${simplified(a * c, b * d)}`],
            ],
          ],
          [
            `Multiply the tops and the bottoms: $${c} \\times ${a} = ${a * c}$ and $${b} \\times ${d} = ${b * d}$.`,
            `分子乘分子、分母乘分母：$${c} \\times ${a} = ${a * c}$，$${b} \\times ${d} = ${b * d}$。`,
          ],
          [
            [qf(a + c, b + d), "That adds the tops and adds the bottoms.", "这是分子相加、分母也相加了。"],
            [qf(a * c, b + d), "That adds the bottoms.", "这是把分母相加了。"],
            [qf(a + c, b * d), "That adds the tops.", "这是把分子相加了。"],
          ],
          { form: "fraction", figure: productGrid(a, d, c, b) },
        );
      },
      productGrid(2, 3, 2, 5),
    ),
    point(
      "choosing-the-model-for-a-product",
      ["Which product the model shows", "模型表示哪个乘法"],
      [
        "A square has 3 of 5 columns and 1 of 2 rows shaded. It shows $\\frac{1}{2} \\times \\frac{3}{5}$, and 3 of the 10 parts are shaded twice, so the product is $\\frac{3}{10}$.\n\nCheck: $1 \\times 3 = 3$ and $2 \\times 5 = 10$.\n\n> **Watch out.** Read the bottoms from the grid. There are $2 \\times 5 = 10$ parts, not $2 + 5 = 7$.",
        "一个正方形 5 列中涂了 3 列，2 行中涂了 1 行。它表示 $\\frac{1}{2} \\times \\frac{3}{5}$，10 份中有 3 份涂了两次，所以积是 $\\frac{3}{10}$。\n\n检验：$1 \\times 3 = 3$，$2 \\times 5 = 10$。\n\n> **注意。** 分母要从格子里读。一共有 $2 \\times 5 = 10$ 份，不是 $2 + 5 = 7$ 份。",
      ],
      (rng) => {
        let a: number;
        let d: number;
        let c: number;
        let b: number;
        do {
          [a, d] = properFraction(rng, 6, 3);
          [c, b] = properFraction(rng, 5, 2);
        } while (b === d);
        const product = lowest(a * c, b * d);
        return pickedMath(
          rng,
          ["Which multiplication does the model show?", "模型表示哪个乘法算式？"],
          `${fr(c, b)} \\times ${fr(a, d)} = ${product}`,
          [
            [
              `${fr(c, d)} \\times ${fr(a, b)} = ${product}`,
              `That mixes up the bottoms: there are ${d} columns and ${b} rows.`,
              `这里分母弄混了：有 ${d} 列、${b} 行。`,
            ],
            [
              `${fr(c, b)} + ${fr(a, d)} = ${product}`,
              "The model shows a part of a part, which is a product, not a sum.",
              "模型表示的是一部分的一部分，是乘法，不是加法。",
            ],
            [
              `${fr(c, b)} \\times ${fr(a, d)} = ${lowest(a * c, b + d)}`,
              `The square has ${b * d} parts, not ${b + d}.`,
              `正方形有 ${b * d} 份，不是 ${b + d} 份。`,
            ],
          ],
          [
            [
              ["Read the columns", "看列"],
              [`The shaded columns are ${a} out of ${d}, so $${fr(a, d)}$.`, `${d} 列中涂了 ${a} 列：$${fr(a, d)}$。`],
            ],
            [
              ["Read the rows", "看行"],
              [`The shaded rows are ${c} out of ${b}, so $${fr(c, b)}$.`, `${b} 行中涂了 ${c} 行：$${fr(c, b)}$。`],
            ],
          ],
          [
            `Count: ${a * c} of the ${b * d} small parts are shaded twice, which is $${product}$.`,
            `数一数：${b * d} 小份中有 ${a * c} 份涂了两次，就是 $${product}$。`,
          ],
          productGrid(a, d, c, b),
        );
      },
      productGrid(3, 5, 1, 2),
    ),
  ],
  t(
    "A garden bed is $\\frac{3}{4}$ planted, and $\\frac{2}{3}$ of the planted part is flowers. Flowers cover $\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}$ of the bed.\n\nCheck: in the model, 2 rows and 3 columns overlap in 6 of the 12 parts, and 6 is half of 12.\n\nIn this lesson we read products of fractions from area models.",
    "一块花坛种了 $\\frac{3}{4}$，种了的部分中 $\\frac{2}{3}$ 是花。花占整块花坛的 $\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}$。\n\n检验：在模型中，2 行和 3 列重叠的是 12 份中的 6 份，6 是 12 的一半。\n\n本课我们从面积模型中读出分数的积。",
  ),
);

/** FractionStory is a word problem about a fraction of an amount. */
interface FractionStory {
  readonly en: (n: string, f: string, amount: string) => string;
  readonly zh: (n: string, f: string, amount: string) => string;
}

const fractionOfStories: readonly FractionStory[] = [
  {
    en: (n, f, x) => `${n} had $${x}$ of a pizza left and ate $${f}$ of it. What fraction of the whole pizza did ${n} eat?`,
    zh: (n, f, x) => `${n} 还剩 $${x}$ 个比萨饼，吃掉了其中的 $${f}$。${n} 吃掉了整个比萨饼的几分之几？`,
  },
  {
    en: (n, f, x) => `A garden is $${x}$ of a yard. ${n} planted tomatoes in $${f}$ of the garden. What fraction of the yard has tomatoes?`,
    zh: (n, f, x) => `菜园占院子的 $${x}$。${n} 在菜园的 $${f}$ 种了番茄。番茄地占院子的几分之几？`,
  },
  {
    en: (n, f, x) => `${n} has $${x}$ gallon of paint and uses $${f}$ of it. How many gallons does ${n} use?`,
    zh: (n, f, x) => `${n} 有 $${x}$ 加仑油漆，用了其中的 $${f}$。${n} 用了多少加仑？`,
  },
  {
    en: (n, f, x) => `A trail is $${x}$ mile long. ${n} has run $${f}$ of it. How many miles has ${n} run?`,
    zh: (n, f, x) => `一条小路长 $${x}$ 英里。${n} 已经跑了其中的 $${f}$。${n} 跑了多少英里？`,
  },
];

export const multiplyingFractionsWordProblems = topic(
  "multiplying-fractions-word-problems",
  t("Multiplying Fractions: Word Problems", "分数乘法应用题"),
  t(
    'A fraction of an amount is found by multiplying: 3/4 of 2/3 gallon is 3/4 × 2/3 = 6/12 = 1/2 gallon, and 2/3 of 15 students is 2/3 × 15 = 10 students. The word "of" after a fraction usually means multiply.',
    '求一个量的几分之几用乘法：2/3 加仑的 3/4 是 3/4 × 2/3 = 6/12 = 1/2 加仑，15 名学生的 2/3 是 2/3 × 15 = 10 名学生。分数后面的"的"通常表示乘。',
  ),
  ["multiplying-fractions", "multiplying-fractions-by-whole-numbers-word-problems"],
  ["5.NF.B.6"],
  [
    point(
      "fraction-of-a-fraction-in-context",
      ["A fraction of a fraction", "一个分数的几分之几"],
      [
        'Ben runs $\\frac{1}{2}$ of a $\\frac{3}{5}$ mile trail. That is $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$ mile.\n\nCheck: two halves make the trail, and $\\frac{3}{10} + \\frac{3}{10} = \\frac{6}{10} = \\frac{3}{5}$.\n\n> **Watch out.** "Of" means multiply here. Do not add $\\frac{1}{2}$ and $\\frac{3}{5}$.',
        "本跑了一条 $\\frac{3}{5}$ 英里小路的 $\\frac{1}{2}$。就是 $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$ 英里。\n\n检验：两个一半合成整条路，$\\frac{3}{10} + \\frac{3}{10} = \\frac{6}{10} = \\frac{3}{5}$。\n\n> **注意。** 这里“的”表示乘。不要把 $\\frac{1}{2}$ 和 $\\frac{3}{5}$ 相加。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 8, 2);
        const [c, d] = properFraction(rng, 8, 3);
        const s = rng.pick(fractionOfStories);
        const n = rng.pick(names);
        return answered(
          [s.en(n, fr(a, b), fr(c, d)), s.zh(n, fr(a, b), fr(c, d))],
          qf(a * c, b * d),
          [
            [
              ["Choose the operation", "选择运算"],
              ["A fraction of an amount means multiply.", "求一个量的几分之几用乘法。"],
            ],
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(a, b)} \\times ${fr(c, d)} = ${simplified(a * c, b * d)}`],
            ],
          ],
          [
            `Find $${fr(1, b)}$ of $${fr(c, d)}$ first: it is $${fr(c, b * d)}$. Then ${a} of those make $${fr(a * c, b * d)}$.`,
            `先求 $${fr(c, d)}$ 的 $${fr(1, b)}$：是 $${fr(c, b * d)}$。${a} 个这样的就是 $${fr(a * c, b * d)}$。`,
          ],
          [
            [qf(a * d, b * c), "That divides instead of multiplying.", "这是做成除法了。"],
            [qf(a + c, b + d), "That adds the tops and adds the bottoms.", "这是分子相加、分母也相加了。"],
            [qf(c, d).sub(qf(a * c, b * d)), "That is the part left over, not the part asked for.", "这是剩下的部分，不是所求的部分。"],
          ],
          { form: "fraction", figure: productGrid(c, d, a, b) },
        );
      },
      productGrid(3, 5, 1, 2),
    ),
    point(
      "fraction-of-a-whole-amount-in-context",
      ["A fraction of a whole amount", "一个整数的几分之几"],
      [
        "Mia uses $\\frac{3}{8}$ of 20 pounds of clay. That is $\\frac{3}{8} \\times 20 = \\frac{60}{8} = 7\\frac{1}{2}$ pounds.\n\nCheck: one eighth of 20 is $2\\frac{1}{2}$, and 3 of those make $7\\frac{1}{2}$.\n\n> **Watch out.** Multiply by the top and divide by the bottom. $20 \\times 8 \\div 3$ is upside down.",
        "米娅用了 20 磅黏土的 $\\frac{3}{8}$。就是 $\\frac{3}{8} \\times 20 = \\frac{60}{8} = 7\\frac{1}{2}$ 磅。\n\n检验：20 的八分之一是 $2\\frac{1}{2}$，3 个这样的是 $7\\frac{1}{2}$。\n\n> **注意。** 乘分子、除以分母。$20 \\times 8 \\div 3$ 就颠倒了。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 10, 3);
        const w = rng.int(4, 40);
        const n = rng.pick(names);
        const s = rng.pick([
          {
            en: `${n} has ${w} pounds of clay and uses $${fr(a, b)}$ of it. How many pounds of clay does ${n} use?`,
            zh: `${n} 有 ${w} 磅黏土，用了其中的 $${fr(a, b)}$。${n} 用了多少磅黏土？`,
          },
          {
            en: `A tank holds ${w} gallons. It is $${fr(a, b)}$ full. How many gallons are in the tank?`,
            zh: `一个水箱能装 ${w} 加仑水，现在装了 $${fr(a, b)}$。水箱里有多少加仑水？`,
          },
          {
            en: `${n} rode ${w} miles this week, $${fr(a, b)}$ of them on Saturday. How many miles did ${n} ride on Saturday?`,
            zh: `${n} 这周骑了 ${w} 英里，其中 $${fr(a, b)}$ 是星期六骑的。${n} 星期六骑了多少英里？`,
          },
        ]);
        const v = qf(a * w, b);
        return answered(
          [s.en, s.zh],
          v,
          [
            [
              ["Multiply by the top", "乘分子"],
              [
                `$${fr(a, b)}$ of ${w} is ${a} times ${w}, shared into ${b} parts.`,
                `${w} 的 $${fr(a, b)}$ 是 ${a} 个 ${w} 平均分成 ${b} 份。`,
              ],
              [`${a} \\times ${w} = ${a * w}`],
            ],
            [
              ["Divide by the bottom", "除以分母"],
              [`Share ${a * w} into ${b} equal parts.`, `把 ${a * w} 平均分成 ${b} 份。`],
              [`${fr(a * w, b)} = ${mq(v)}`],
            ],
          ],
          [
            `$${fr(1, b)}$ of ${w} is $${mq(qf(w, b))}$, and ${a} of those make $${mq(v)}$.`,
            `${w} 的 ${b} 等份中，每份是 $${mq(qf(w, b))}$，${a} 份就是 $${mq(v)}$。`,
          ],
          [
            [qf(w * b, a), "That multiplies by the bottom and divides by the top.", "这是乘了分母、除以了分子，颠倒了。"],
            [qf(w, b), `That is only one of the ${b} parts.`, `这只是 ${b} 份中的 1 份。`],
            [qf(w, 1).sub(v), "That is the part not used.", "这是没有用到的部分。"],
          ],
          { form: "mixed", figure: partsTape(`${w}`, a, b) },
        );
      },
      partsTape("20", 3, 8),
    ),
  ],
  t(
    "Ava has $\\frac{2}{3}$ gallon of paint and uses $\\frac{3}{4}$ of it. She uses $\\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}$ gallon.\n\nCheck: $\\frac{1}{4}$ of $\\frac{2}{3}$ is $\\frac{2}{12}$, and 3 of those make $\\frac{6}{12}$.\n\nIn this lesson we multiply to find a fraction of an amount.",
    "阿娃有 $\\frac{2}{3}$ 加仑油漆，用了其中的 $\\frac{3}{4}$。她用了 $\\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}$ 加仑。\n\n检验：$\\frac{2}{3}$ 的 $\\frac{1}{4}$ 是 $\\frac{2}{12}$，3 个这样的是 $\\frac{6}{12}$。\n\n本课我们用乘法求一个量的几分之几。",
  ),
);

export const multiplyingFractionsBySwappingDenominators = topic(
  "multiplying-fractions-by-swapping-denominators",
  t("Multiplying Fractions by Swapping Denominators", "交换分母简化分数乘法"),
  t(
    "In a product of fractions, the denominators can trade places, since a × c over b × d is the same either way: 4/9 × 3/8 = 4/8 × 3/9 = 1/2 × 1/3 = 1/6. Swapping can turn the factors into fractions that simplify, which keeps the numbers small.",
    "分数相乘时，两个分母可以交换位置，因为分子的积除以分母的积不变：4/9 × 3/8 = 4/8 × 3/9 = 1/2 × 1/3 = 1/6。交换后的分数如果能约分，计算时数就更小。",
  ),
  ["multiplying-fractions", "writing-fractions-in-lowest-terms"],
  ["5.NF.B.4"],
  [
    point(
      "swapping-denominators",
      ["Swapping the denominators", "交换分母"],
      [
        "$\\frac{5}{6} \\times \\frac{3}{10} = \\frac{5}{10} \\times \\frac{3}{6}$. Each new fraction is $\\frac{1}{2}$, so the product is $\\frac{1}{4}$.\n\nCheck: multiply straight across. $\\frac{15}{60}$ simplifies to $\\frac{1}{4}$.\n\n> **Watch out.** Swap only the bottoms. Moving a top to the bottom changes the product.",
        "$\\frac{5}{6} \\times \\frac{3}{10} = \\frac{5}{10} \\times \\frac{3}{6}$。两个新分数都是 $\\frac{1}{2}$，所以积是 $\\frac{1}{4}$。\n\n检验：直接相乘，$\\frac{15}{60}$ 约分后是 $\\frac{1}{4}$。\n\n> **注意。** 只交换分母。把分子移到分母会改变积。",
      ],
      (rng) => {
        const { a, b, c, d } = swapFriendly(rng);
        return pickedMath(
          rng,
          [`Which product is equal to $${fr(a, b)} \\times ${fr(c, d)}$?`, `哪个积等于 $${fr(a, b)} \\times ${fr(c, d)}$？`],
          `${fr(a, d)} \\times ${fr(c, b)}`,
          [
            [
              `${fr(b, a)} \\times ${fr(c, d)}`,
              "That turns the first fraction upside down, which changes its value.",
              "这是把第一个分数倒过来了，它的大小变了。",
            ],
            [
              `${fr(a, c)} \\times ${fr(b, d)}`,
              "That moves a bottom to the top, which changes the product.",
              "这是把分母移到了分子上，积变了。",
            ],
            [`${fr(a, b)} + ${fr(c, d)}`, "That is a sum, not a product.", "这是和，不是积。"],
          ],
          [
            [
              ["Keep the tops", "分子不动"],
              [`The tops stay ${a} and ${c}.`, `分子仍是 ${a} 和 ${c}。`],
            ],
            [
              ["Swap the bottoms", "交换分母"],
              [`${b} and ${d} change places.`, `${b} 和 ${d} 交换位置。`],
              [`${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times ${fr(c, b)}`],
            ],
          ],
          [
            `Both have the top $${a} \\times ${c} = ${a * c}$ and the bottom $${b} \\times ${d} = ${b * d}$.`,
            `两边的分子都是 $${a} \\times ${c} = ${a * c}$，分母都是 $${b} \\times ${d} = ${b * d}$。`,
          ],
        );
      },
      productGrid(3, 10, 5, 6),
    ),
    point(
      "multiplying-after-swapping",
      ["Multiplying after swapping", "交换后再相乘"],
      [
        "$\\frac{7}{12} \\times \\frac{4}{21} = \\frac{7}{21} \\times \\frac{4}{12} = \\frac{1}{3} \\times \\frac{1}{3} = \\frac{1}{9}$.\n\nCheck: multiply straight across. $\\frac{28}{252}$ simplifies to $\\frac{1}{9}$, because $28 \\times 9 = 252$.\n\n> **Watch out.** Simplify each new fraction before you multiply. Then the numbers stay small.",
        "$\\frac{7}{12} \\times \\frac{4}{21} = \\frac{7}{21} \\times \\frac{4}{12} = \\frac{1}{3} \\times \\frac{1}{3} = \\frac{1}{9}$。\n\n检验：直接相乘，$\\frac{28}{252}$ 约分后是 $\\frac{1}{9}$，因为 $28 \\times 9 = 252$。\n\n> **注意。** 每个新分数要先约分再相乘，这样数就很小。",
      ],
      (rng) => {
        const { a, b, c, d } = swapFriendly(rng);
        const v = qf(a * c, b * d);
        return answered(
          [`Find $${fr(a, b)} \\times ${fr(c, d)}$.`, `计算 $${fr(a, b)} \\times ${fr(c, d)}$。`],
          v,
          [
            [
              ["Swap the bottoms", "交换分母"],
              ["The product does not change.", "积不变。"],
              [`${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times ${fr(c, b)}`],
            ],
            [
              ["Simplify each", "分别约分"],
              ["Divide each top and bottom by a common factor.", "每个分数的分子分母同除以公因数。"],
              [`${fr(a, d)} = ${lowest(a, d)}`, `${fr(c, b)} = ${lowest(c, b)}`],
            ],
            [
              ["Multiply", "相乘"],
              ["The numbers are small now.", "现在数很小了。"],
              [`${lowest(a, d)} \\times ${lowest(c, b)} = ${v.toLatex()}`],
            ],
          ],
          [
            `Multiply straight across: $${fr(a * c, b * d)}$ simplifies to $${v.toLatex()}$.`,
            `直接相乘：$${fr(a * c, b * d)}$ 约分后是 $${v.toLatex()}$。`,
          ],
          [
            [qf(a + c, b + d), "That adds the tops and adds the bottoms.", "这是分子相加、分母也相加了。"],
            [qf(a * d, b * c), "That turns the second fraction upside down.", "这是把第二个分数倒过来了。"],
            [qf(a * c + 1, b * d), `That is one $${fr(1, b * d)}$ too many.`, `多算了一个 $${fr(1, b * d)}$。`],
          ],
          { form: "fraction" },
        );
      },
      productGrid(1, 3, 1, 3),
    ),
  ],
  t(
    "$\\frac{4}{9} \\times \\frac{3}{8}$ looks hard. Swap the bottoms: $\\frac{4}{8} \\times \\frac{3}{9} = \\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$.\n\nCheck: multiply straight across. $\\frac{12}{72}$ simplifies to $\\frac{1}{6}$.\n\nIn this lesson we swap denominators to keep the numbers small.",
    "$\\frac{4}{9} \\times \\frac{3}{8}$ 看起来不好算。交换分母：$\\frac{4}{8} \\times \\frac{3}{9} = \\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$。\n\n检验：直接相乘，$\\frac{12}{72}$ 约分后是 $\\frac{1}{6}$。\n\n本课我们交换分母，让计算的数变小。",
  ),
);

/** swapFriendly draws a/b × c/d in lowest terms where a/d and c/b both simplify. */
function swapFriendly(rng: Rng): FractionPair {
  for (;;) {
    const p = rng.int(1, 4);
    const q = rng.int(1, 4);
    const k = rng.int(2, 7);
    const m = rng.int(2, 7);
    const a = p * k;
    const d = rng.int(p + 1, 6) * k;
    const c = q * m;
    const b = rng.int(q + 1, 6) * m;
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || a >= b || c >= d || b === d) continue;
    return { a, b, c, d };
  }
}

/** partsArea draws k × (w + a/d) as an area model with a whole part and a fraction part. */
function partsArea(k: Q, w: number, a: number, d: number): Figure {
  const cols = [qf(w, 1), qf(a, d)];
  return areaGridFigure([pieceText(k)], cols.map(pieceText), [cols.map((c) => pieceText(k.mul(c)))], [1], [2, 1]);
}

/** mixedArea draws (w1 + a/b) × (w2 + c/d) as an area model with four parts. */
function mixedArea(w1: number, a: number, b: number, w2: number, c: number, d: number): Figure {
  const rows = [qf(w1, 1), qf(a, b)];
  const cols = [qf(w2, 1), qf(c, d)];
  return areaGridFigure(
    rows.map(pieceText),
    cols.map(pieceText),
    rows.map((r) => cols.map((c) => pieceText(r.mul(c)))),
    [2, 1],
    [2, 1],
  );
}

/** fourParts writes the four parts of (w1 + a/b) × (w2 + c/d) added up, as LaTeX. */
const fourParts = (w1: number, a: number, b: number, w2: number, c: number, d: number) =>
  [qf(w1 * w2, 1), qf(w1 * c, d), qf(a * w2, b), qf(a * c, b * d)].map(mq).join(" + ");

/** tidy is the last step that writes n/d in simplest form, or no step when it already is. */
function tidy(n: number, d: number): Walk[] {
  const v = mq(qf(n, d));
  return fr(n, d) === v
    ? []
    : [[["Simplify", "化简"], ["Write the answer in simplest form.", "把结果写成最简形式。"], [`${fr(n, d)} = ${v}`]]];
}

/** improperStep changes one or two mixed numbers to improper fractions. */
function improperStep(...ms: readonly (readonly [number, number, number])[]): Walk {
  return [
    ["Write improper fractions", "化成假分数"],
    ms.length === 1 ? ["Change the mixed number.", "把带分数化成假分数。"] : ["Change both mixed numbers.", "把两个带分数都化成假分数。"],
    ms.map(([w, a, d]) => `${mx(w, a, d)} = ${fr(w * d + a, d)}`),
  ];
}

/** mixedLine marks w a/d on a number line of whole numbers. */
function mixedLine(w: number, a: number, d: number): Figure {
  return lineFigure(
    { lo: 0, hi: w + 1, step: 1, marks: [{ at: w + a / d, text: mixedText(w, a, d) }], labels: Array.from({ length: w + 2 }, (_, i) => i) },
    [`A number line from 0 to ${w + 1} with ${mixedText(w, a, d)} marked.`, `一条从 0 到 ${w + 1} 的数轴，标出了 ${mixedText(w, a, d)}。`],
  );
}

/** scaleLine marks factors on a number line from 0 to 3, so they can be compared with 1. */
function scaleLine(marks: readonly (readonly [Q, string])[]): Figure {
  return lineFigure(
    { lo: 0, hi: 3, step: 0.5, labels: [0, 1, 2, 3], marks: marks.map(([v, text]) => ({ at: Math.min(3, v.toNumber()), text })) },
    [
      `A number line from 0 to 3 with ${marks.map((m) => m[1]).join(" and ")} marked.`,
      `一条从 0 到 3 的数轴，标出了 ${marks.map((m) => m[1]).join(" 和 ")}。`,
    ],
  );
}

/** eachPartCheck multiplies each part of a mixed number on its own line and adds the results. */
function eachPartCheck(parts: readonly string[], total: Q, en = "Multiply each part:", zh = "分别乘每一部分："): Pair {
  const lines = parts.map((p) => `$$${p}$$`).join("\n\n");
  return [`${en}\n\n${lines}\n\nTogether they make $${mq(total)}$.`, `${zh}\n\n${lines}\n\n合起来是 $${mq(total)}$。`];
}

/** multiplyingMixedNumbersByWholeNumbers multiplies a mixed number by a whole number. */
export const multiplyingMixedNumbersByWholeNumbers = topic(
  "multiplying-mixed-numbers-by-whole-numbers",
  t("Multiplying Mixed Numbers by Whole Numbers", "整数乘带分数"),
  t(
    "To multiply a mixed number by a whole number, write the mixed number as an improper fraction and multiply the numerator: 3 × 2 1/4 = 3 × 9/4 = 27/4 = 6 3/4. Or multiply the whole part and the fraction part separately and add: 3 × 2 + 3 × 1/4 = 6 + 3/4.",
    "整数乘带分数，可以先把带分数化成假分数，再用整数乘分子：3 × 2 1/4 = 3 × 9/4 = 27/4 = 6 3/4。也可以把整数部分和分数部分分别乘再相加：3 × 2 + 3 × 1/4 = 6 + 3/4。",
  ),
  ["multiplying-fractions-by-whole-numbers", "converting-mixed-numbers-to-improper-fractions"],
  ["5.NF.B.4"],
  [
    point(
      "multiplying-a-mixed-number-by-a-whole-number",
      ["Finding the product", "求积"],
      [
        "$4 \\times 1\\frac{2}{3} = 4 \\times \\frac{5}{3} = \\frac{20}{3} = 6\\frac{2}{3}$.\n\nCheck: multiply each part. $4 \\times 1 = 4$ and $4 \\times \\frac{2}{3} = 2\\frac{2}{3}$, which make $6\\frac{2}{3}$.\n\n> **Watch out.** Multiply the fraction part too. $4 \\times 1 = 4$ alone leaves out $4 \\times \\frac{2}{3}$.",
        "$4 \\times 1\\frac{2}{3} = 4 \\times \\frac{5}{3} = \\frac{20}{3} = 6\\frac{2}{3}$。\n\n检验：分别乘每一部分。$4 \\times 1 = 4$，$4 \\times \\frac{2}{3} = 2\\frac{2}{3}$，合起来是 $6\\frac{2}{3}$。\n\n> **注意。** 分数部分也要乘。只算 $4 \\times 1 = 4$，就漏掉了 $4 \\times \\frac{2}{3}$。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const w = rng.int(1, 6);
        const [a, d] = properFraction(rng, 10, 2);
        const top = w * d + a;
        const v = qf(n * top, d);
        return answered(
          [`Find $${n} \\times ${mx(w, a, d)}$.`, `计算 $${n} \\times ${mx(w, a, d)}$。`],
          v,
          [
            improperStep([w, a, d]),
            [
              ["Multiply the top", "乘分子"],
              [`Multiply the top by ${n}. The bottom stays.`, `用 ${n} 乘分子，分母不变。`],
              [`${n} \\times ${fr(top, d)} = ${fr(n * top, d)}`],
            ],
            ...tidy(n * top, d),
          ],
          eachPartCheck([`${n} \\times ${w} = ${n * w}`, `${n} \\times ${fr(a, d)} = ${mq(qf(n * a, d))}`], v),
          [
            [mixedValue(n * w, a, d), "That multiplies only the whole part.", "这里只乘了整数部分。"],
            [mixedValue(w, n * a, d), "That multiplies only the fraction part.", "这里只乘了分数部分。"],
            [mixedValue(w, a, d), "That multiplies the bottom too, so the number does not change.", "分母也乘了，所以数没有变。"],
          ],
          { form: "mixed", figure: partsArea(qf(n, 1), w, a, d) },
        );
      },
      partsArea(qf(4, 1), 1, 2, 3),
    ),
    point(
      "mixed-number-times-whole-number-word-problems",
      ["Word problems", "应用题"],
      [
        "5 boards are each $2\\frac{1}{2}$ feet long. Together they are $5 \\times 2\\frac{1}{2} = 5 \\times \\frac{5}{2} = \\frac{25}{2} = 12\\frac{1}{2}$ feet.\n\nCheck: $5 \\times 2 = 10$ and $5 \\times \\frac{1}{2} = 2\\frac{1}{2}$, which make $12\\frac{1}{2}$.\n\n> **Watch out.** Equal amounts mean multiply. Adding 5 to $2\\frac{1}{2}$ is not the same.",
        "5 块木板，每块长 $2\\frac{1}{2}$ 英尺。一共长 $5 \\times 2\\frac{1}{2} = 5 \\times \\frac{5}{2} = \\frac{25}{2} = 12\\frac{1}{2}$ 英尺。\n\n检验：$5 \\times 2 = 10$，$5 \\times \\frac{1}{2} = 2\\frac{1}{2}$，合起来是 $12\\frac{1}{2}$。\n\n> **注意。** 几个相同的量用乘法。把 5 和 $2\\frac{1}{2}$ 相加是不对的。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const w = rng.int(1, 6);
        const [a, d] = properFraction(rng, 8, 2);
        const top = w * d + a;
        const v = qf(n * top, d);
        const name = rng.pick(names);
        const s = rng.pick([
          {
            en: `${name} runs $${mx(w, a, d)}$ miles each day. How many miles does ${name} run in ${n} days?`,
            zh: `${name} 每天跑 $${mx(w, a, d)}$ 英里。${n} 天一共跑多少英里？`,
          },
          {
            en: `Each bag holds $${mx(w, a, d)}$ pounds of rice. How many pounds are in ${n} bags?`,
            zh: `每袋装 $${mx(w, a, d)}$ 磅大米。${n} 袋一共多少磅？`,
          },
          {
            en: `A recipe needs $${mx(w, a, d)}$ cups of flour. How many cups are needed for ${n} batches?`,
            zh: `做一份点心要用 $${mx(w, a, d)}$ 杯面粉。做 ${n} 份要用多少杯？`,
          },
        ]);
        return answered(
          [s.en, s.zh],
          v,
          [
            [
              ["Choose the operation", "选择运算"],
              [`There are ${n} equal amounts, so multiply.`, `有 ${n} 个相同的量，所以用乘法。`],
            ],
            improperStep([w, a, d]),
            [["Multiply", "相乘"], [`Multiply the top by ${n}.`, `用 ${n} 乘分子。`], [`${n} \\times ${fr(top, d)} = ${fr(n * top, d)}`]],
            ...tidy(n * top, d),
          ],
          eachPartCheck([`${n} \\times ${w} = ${n * w}`, `${n} \\times ${fr(a, d)} = ${mq(qf(n * a, d))}`], v),
          [
            [mixedValue(n * w, a, d), "That multiplies only the whole part.", "这里只乘了整数部分。"],
            [mixedValue(w + n, a, d), `That adds ${n} instead of multiplying by it.`, `这里加了 ${n}，没有乘 ${n}。`],
            [qf((n - 1) * top, d), `That is only ${n - 1} of the amounts.`, `这只是 ${n - 1} 个量。`],
          ],
          { form: "mixed", figure: equalTape(n, mixedText(w, a, d), "?") },
        );
      },
      equalTape(5, "2 1/2", "?"),
    ),
  ],
  t(
    "One lap around the park is $2\\frac{1}{4}$ miles. Lily rides 3 laps: $3 \\times 2 = 6$ miles and $3 \\times \\frac{1}{4} = \\frac{3}{4}$ mile, so $6\\frac{3}{4}$ miles.\n\nCheck: $3 \\times \\frac{9}{4} = \\frac{27}{4}$, which is $6\\frac{3}{4}$.\n\nIn this lesson we multiply a mixed number by a whole number.",
    "绕公园一圈是 $2\\frac{1}{4}$ 英里。莉莉骑了 3 圈：$3 \\times 2 = 6$ 英里，$3 \\times \\frac{1}{4} = \\frac{3}{4}$ 英里，一共 $6\\frac{3}{4}$ 英里。\n\n检验：$3 \\times \\frac{9}{4} = \\frac{27}{4}$，正是 $6\\frac{3}{4}$。\n\n本课我们学习整数乘带分数。",
  ),
);

export const multiplyingMixedNumbersByFractions = topic(
  "multiplying-mixed-numbers-by-fractions",
  t("Multiplying Mixed Numbers by Fractions", "分数乘带分数"),
  t(
    "To multiply a mixed number by a fraction, write the mixed number as an improper fraction, then multiply numerators and denominators: 2/3 × 1 1/2 = 2/3 × 3/2 = 6/6 = 1.",
    "分数乘带分数，先把带分数化成假分数，再把分子乘分子、分母乘分母：2/3 × 1 1/2 = 2/3 × 3/2 = 6/6 = 1。",
  ),
  ["multiplying-mixed-numbers-by-whole-numbers", "multiplying-fractions"],
  ["5.NF.B.4"],
  [
    point(
      "fraction-times-mixed-number",
      ["Finding the product", "求积"],
      [
        "$\\frac{3}{4} \\times 2\\frac{1}{5} = \\frac{3}{4} \\times \\frac{11}{5} = \\frac{33}{20} = 1\\frac{13}{20}$.\n\nCheck: multiply each part. $\\frac{3}{4} \\times 2 = \\frac{30}{20}$ and $\\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}$, which make $\\frac{33}{20}$.\n\n> **Watch out.** Change the mixed number first. Keeping the 2 and multiplying only $\\frac{1}{5}$ gives $2\\frac{3}{20}$, which is too big.",
        "$\\frac{3}{4} \\times 2\\frac{1}{5} = \\frac{3}{4} \\times \\frac{11}{5} = \\frac{33}{20} = 1\\frac{13}{20}$。\n\n检验：分别乘每一部分。$\\frac{3}{4} \\times 2 = \\frac{30}{20}$，$\\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}$，合起来是 $\\frac{33}{20}$。\n\n> **注意。** 先把带分数化成假分数。保留 2 只乘 $\\frac{1}{5}$，得到 $2\\frac{3}{20}$，太大了。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 9, 2);
        const w = rng.int(1, 5);
        const [c, d] = properFraction(rng, 9, 2);
        const top = w * d + c;
        const v = qf(a * top, b * d);
        return answered(
          [`Find $${fr(a, b)} \\times ${mx(w, c, d)}$.`, `计算 $${fr(a, b)} \\times ${mx(w, c, d)}$。`],
          v,
          [
            improperStep([w, c, d]),
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(a, b)} \\times ${fr(top, d)} = ${fr(a * top, b * d)}`],
            ],
            ...tidy(a * top, b * d),
          ],
          eachPartCheck([`${fr(a, b)} \\times ${w} = ${mq(qf(a * w, b))}`, `${fr(a, b)} \\times ${fr(c, d)} = ${mq(qf(a * c, b * d))}`], v),
          [
            [
              qf(w, 1).add(qf(a * c, b * d)),
              "That keeps the whole part and multiplies only the fraction part.",
              "这里保留了整数部分，只乘了分数部分。",
            ],
            [qf(a * w, b).add(qf(c, d)), "That multiplies only the whole part.", "这里只乘了整数部分。"],
            [qf(a * top, b + d), "That adds the bottoms.", "这是把分母相加了。"],
          ],
          { form: "mixed", figure: partsArea(qf(a, b), w, c, d) },
        );
      },
      partsArea(qf(3, 4), 2, 1, 5),
    ),
    point(
      "simplifying-before-multiplying-mixed-numbers",
      ["Simplifying before multiplying", "先约分再相乘"],
      [
        "$\\frac{5}{6} \\times 2\\frac{2}{5} = \\frac{5}{6} \\times \\frac{12}{5}$. Cancel the 5s, and divide 12 and 6 by 6. That leaves $\\frac{1}{1} \\times \\frac{2}{1} = 2$.\n\nCheck: multiply first. $\\frac{60}{30} = 2$.\n\n> **Watch out.** Cancel a top with a bottom. Two tops cannot cancel each other.",
        "$\\frac{5}{6} \\times 2\\frac{2}{5} = \\frac{5}{6} \\times \\frac{12}{5}$。约去两个 5，再把 12 和 6 同除以 6，剩下 $\\frac{1}{1} \\times \\frac{2}{1} = 2$。\n\n检验：先乘。$\\frac{60}{30} = 2$。\n\n> **注意。** 约分要一个分子配一个分母。两个分子之间不能约分。",
      ],
      (rng) => {
        for (;;) {
          const [a, b] = properFraction(rng, 12, 3);
          const w = rng.int(1, 4);
          const [c, d] = properFraction(rng, 9, 2);
          const top = w * d + c;
          const g1 = gcd(a, d);
          const g2 = gcd(top, b);
          if (g1 === 1 && g2 === 1) continue;
          const [p, q, r, s] = [a / g1, b / g2, top / g2, d / g1];
          const v = qf(a * top, b * d);
          return answered(
            [`Find $${fr(a, b)} \\times ${mx(w, c, d)}$.`, `计算 $${fr(a, b)} \\times ${mx(w, c, d)}$。`],
            v,
            [
              improperStep([w, c, d]),
              [
                ["Cancel first", "先约分"],
                ["Divide a top and a bottom by a common factor.", "把一个分子和一个分母同除以公因数。"],
                [`${fr(a, b)} \\times ${fr(top, d)} = ${fr(p, q)} \\times ${fr(r, s)}`],
              ],
              [
                ["Multiply", "相乘"],
                ["The numbers are small now.", "现在数很小了。"],
                [`${fr(p, q)} \\times ${fr(r, s)} = ${fr(p * r, q * s)}`],
              ],
              ...tidy(p * r, q * s),
            ],
            [`Multiply first: $${fr(a * top, b * d)}$ simplifies to $${mq(v)}$.`, `先乘：$${fr(a * top, b * d)}$ 化简后是 $${mq(v)}$。`],
            [
              [
                qf(w, 1).add(qf(a * c, b * d)),
                "That keeps the whole part and multiplies only the fraction part.",
                "这里保留了整数部分，只乘了分数部分。",
              ],
              [qf(a * w, b).add(qf(c, d)), "That multiplies only the whole part.", "这里只乘了整数部分。"],
              [qf(p * r, b * d), "That divides the tops but not the bottoms.", "这里只约了分子，没有约分母。"],
            ],
            { form: "mixed", figure: partsArea(qf(a, b), w, c, d) },
          );
        }
      },
      partsArea(qf(5, 6), 2, 2, 5),
    ),
  ],
  t(
    "A board is $2\\frac{1}{2}$ feet long, and Max uses $\\frac{2}{3}$ of it. $\\frac{2}{3} \\times \\frac{5}{2} = \\frac{10}{6} = 1\\frac{2}{3}$ feet.\n\nCheck: $\\frac{1}{3}$ of $2\\frac{1}{2}$ is $\\frac{5}{6}$, and 2 of those make $\\frac{10}{6}$.\n\nIn this lesson we multiply a mixed number by a fraction.",
    "一块木板长 $2\\frac{1}{2}$ 英尺，马克斯用了它的 $\\frac{2}{3}$。$\\frac{2}{3} \\times \\frac{5}{2} = \\frac{10}{6} = 1\\frac{2}{3}$ 英尺。\n\n检验：$2\\frac{1}{2}$ 的 $\\frac{1}{3}$ 是 $\\frac{5}{6}$，2 个这样的是 $\\frac{10}{6}$。\n\n本课我们学习分数乘带分数。",
  ),
);

export const multiplyingMixedNumbers = topic(
  "multiplying-mixed-numbers",
  t("Multiplying Mixed Numbers", "带分数乘带分数"),
  t(
    "To multiply two mixed numbers, write both as improper fractions and multiply: 1 1/2 × 2 2/3 = 3/2 × 8/3 = 24/6 = 4. Multiplying only the whole parts and the fraction parts gives the wrong answer, because it leaves out the cross terms.",
    "两个带分数相乘，先都化成假分数再相乘：1 1/2 × 2 2/3 = 3/2 × 8/3 = 24/6 = 4。只把整数部分相乘、分数部分相乘是错误的，因为漏掉了交叉相乘的部分。",
  ),
  ["multiplying-mixed-numbers-by-fractions"],
  ["5.NF.B.4"],
  [
    point(
      "multiplying-two-mixed-numbers",
      ["Finding the product", "求积"],
      [
        "$2\\frac{1}{3} \\times 1\\frac{1}{2} = \\frac{7}{3} \\times \\frac{3}{2} = \\frac{21}{6} = 3\\frac{1}{2}$.\n\nCheck: the four parts of the area model are $2 + 1 + \\frac{1}{3} + \\frac{1}{6} = 3\\frac{1}{2}$.\n\n> **Watch out.** $2 \\times 1 + \\frac{1}{3} \\times \\frac{1}{2}$ is not the product. It leaves out two parts of the model.",
        "$2\\frac{1}{3} \\times 1\\frac{1}{2} = \\frac{7}{3} \\times \\frac{3}{2} = \\frac{21}{6} = 3\\frac{1}{2}$。\n\n检验：面积模型的四块是 $2 + 1 + \\frac{1}{3} + \\frac{1}{6} = 3\\frac{1}{2}$。\n\n> **注意。** $2 \\times 1 + \\frac{1}{3} \\times \\frac{1}{2}$ 不是积，它漏掉了模型中的两块。",
      ],
      (rng) => {
        const w1 = rng.int(1, 4);
        const w2 = rng.int(1, 4);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const [n1, n2] = [w1 * b + a, w2 * d + c];
        const v = qf(n1 * n2, b * d);
        return answered(
          [`Find $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$.`, `计算 $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$。`],
          v,
          [
            improperStep([w1, a, b], [w2, c, d]),
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(n1, b)} \\times ${fr(n2, d)} = ${fr(n1 * n2, b * d)}`],
            ],
            ...tidy(n1 * n2, b * d),
          ],
          [
            `Add the four parts of the area model: $${fourParts(w1, a, b, w2, c, d)} = ${mq(v)}$.`,
            `把面积模型的四块加起来：$${fourParts(w1, a, b, w2, c, d)} = ${mq(v)}$。`,
          ],
          [
            [
              qf(w1 * w2, 1).add(qf(a * c, b * d)),
              "That multiplies only the wholes and the fractions, and leaves out two parts.",
              "这里只把整数乘整数、分数乘分数，漏掉了两块。",
            ],
            [mixedValue(w1, a, b).add(mixedValue(w2, c, d)), "That adds the two numbers.", "这是把两个数相加了。"],
            [
              mixedValue(w1, a, b).mul(qf(w2, 1)),
              "That multiplies by the whole part of the second number only.",
              "这里只乘了第二个数的整数部分。",
            ],
          ],
          { form: "mixed", figure: mixedArea(w1, a, b, w2, c, d) },
        );
      },
      mixedArea(2, 1, 3, 1, 1, 2),
    ),
    point(
      "squaring-and-larger-mixed-numbers",
      ["Larger mixed numbers", "较大的带分数"],
      [
        "$3\\frac{1}{4} \\times 2\\frac{2}{5} = \\frac{13}{4} \\times \\frac{12}{5}$. Divide 12 and 4 by 4 first: $\\frac{13}{1} \\times \\frac{3}{5} = \\frac{39}{5} = 7\\frac{4}{5}$.\n\nCheck: the product lies between $3 \\times 2 = 6$ and $4 \\times 3 = 12$, and $7\\frac{4}{5}$ does.\n\n> **Watch out.** The tops get big. Cancel before you multiply when you can.",
        "$3\\frac{1}{4} \\times 2\\frac{2}{5} = \\frac{13}{4} \\times \\frac{12}{5}$。先把 12 和 4 同除以 4：$\\frac{13}{1} \\times \\frac{3}{5} = \\frac{39}{5} = 7\\frac{4}{5}$。\n\n检验：积在 $3 \\times 2 = 6$ 和 $4 \\times 3 = 12$ 之间，$7\\frac{4}{5}$ 正是这样。\n\n> **注意。** 分子会变得很大。能约分时先约分再相乘。",
      ],
      (rng) => {
        const w1 = rng.int(2, 6);
        const w2 = rng.int(2, 6);
        const [a, b] = properFraction(rng, 8, 2);
        const [c, d] = properFraction(rng, 8, 2);
        const [n1, n2] = [w1 * b + a, w2 * d + c];
        const v = qf(n1 * n2, b * d);
        return answered(
          [`Find $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$.`, `计算 $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$。`],
          v,
          [
            improperStep([w1, a, b], [w2, c, d]),
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(n1, b)} \\times ${fr(n2, d)} = ${fr(n1 * n2, b * d)}`],
            ],
            ...tidy(n1 * n2, b * d),
          ],
          [
            `Estimate: the product lies between $${w1} \\times ${w2} = ${w1 * w2}$ and $${w1 + 1} \\times ${w2 + 1} = ${(w1 + 1) * (w2 + 1)}$, and $${mq(v)}$ does.`,
            `估一估：积在 $${w1} \\times ${w2} = ${w1 * w2}$ 和 $${w1 + 1} \\times ${w2 + 1} = ${(w1 + 1) * (w2 + 1)}$ 之间，$${mq(v)}$ 正是这样。`,
          ],
          [
            [
              qf(w1 * w2, 1).add(qf(a * c, b * d)),
              "That multiplies only the wholes and the fractions, and leaves out two parts.",
              "这里只把整数乘整数、分数乘分数，漏掉了两块。",
            ],
            [qf(w1 * w2, 1), "That multiplies only the whole parts.", "这里只乘了整数部分。"],
            [mixedValue(w1, a, b).add(mixedValue(w2, c, d)), "That adds the two numbers.", "这是把两个数相加了。"],
          ],
          { form: "mixed", figure: mixedArea(w1, a, b, w2, c, d) },
        );
      },
      mixedArea(3, 1, 4, 2, 2, 5),
    ),
  ],
  t(
    "A garden is $2\\frac{1}{2}$ meters by $1\\frac{1}{2}$ meters. Its area is $\\frac{5}{2} \\times \\frac{3}{2} = \\frac{15}{4} = 3\\frac{3}{4}$ square meters.\n\nCheck: the four parts of the area model are $2 + 1 + \\frac{1}{2} + \\frac{1}{4} = 3\\frac{3}{4}$.\n\nIn this lesson we multiply two mixed numbers.",
    "一块菜园长 $2\\frac{1}{2}$ 米，宽 $1\\frac{1}{2}$ 米。面积是 $\\frac{5}{2} \\times \\frac{3}{2} = \\frac{15}{4} = 3\\frac{3}{4}$ 平方米。\n\n检验：面积模型的四块是 $2 + 1 + \\frac{1}{2} + \\frac{1}{4} = 3\\frac{3}{4}$。\n\n本课我们学习带分数乘带分数。",
  ),
);

export const multiplyingMixedNumbersWordProblems = topic(
  "multiplying-mixed-numbers-word-problems",
  t("Multiplying Mixed Numbers: Word Problems", "带分数乘法应用题"),
  t(
    "Word problems that take a fraction or a multiple of a mixed amount are solved by multiplying: a car that uses 1 1/2 gallons each hour uses 1 1/2 × 2 1/3 = 3/2 × 7/3 = 7/2 = 3 1/2 gallons in 2 1/3 hours.",
    "求一个带分数量的几分之几或几倍，用乘法解答：一辆车每小时用 1 1/2 加仑油，2 1/3 小时用 1 1/2 × 2 1/3 = 3/2 × 7/3 = 7/2 = 3 1/2 加仑。",
  ),
  ["multiplying-mixed-numbers", "multiplying-fractions-word-problems"],
  ["5.NF.B.6"],
  [
    point(
      "rates-with-mixed-numbers",
      ["Amounts per unit", "每单位的量"],
      [
        "A pipe adds $2\\frac{1}{2}$ gallons each minute for $2\\frac{1}{5}$ minutes. That is $\\frac{5}{2} \\times \\frac{11}{5} = \\frac{55}{10} = 5\\frac{1}{2}$ gallons.\n\nCheck: 2 minutes give 5 gallons, and $\\frac{1}{5}$ minute gives $\\frac{1}{2}$ gallon.\n\n> **Watch out.** Use all of the time. Multiplying by 2 alone leaves out the $\\frac{1}{5}$ minute.",
        "一根水管每分钟注水 $2\\frac{1}{2}$ 加仑，注了 $2\\frac{1}{5}$ 分钟。一共是 $\\frac{5}{2} \\times \\frac{11}{5} = \\frac{55}{10} = 5\\frac{1}{2}$ 加仑。\n\n检验：2 分钟注 5 加仑，$\\frac{1}{5}$ 分钟注 $\\frac{1}{2}$ 加仑。\n\n> **注意。** 时间要全部用上。只乘 2 就漏掉了 $\\frac{1}{5}$ 分钟。",
      ],
      (rng) => {
        const w1 = rng.int(1, 6);
        const w2 = rng.int(1, 4);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const [n1, n2] = [w1 * b + a, w2 * d + c];
        const v = qf(n1 * n2, b * d);
        const name = rng.pick(names);
        const s = rng.pick([
          {
            en: `${name} walks $${mx(w1, a, b)}$ miles per hour. How far does ${name} walk in $${mx(w2, c, d)}$ hours?`,
            zh: `${name} 每小时走 $${mx(w1, a, b)}$ 英里。$${mx(w2, c, d)}$ 小时走多少英里？`,
          },
          {
            en: `A pipe fills a pool at $${mx(w1, a, b)}$ gallons per minute. How many gallons does it add in $${mx(w2, c, d)}$ minutes?`,
            zh: `一根水管每分钟往水池注水 $${mx(w1, a, b)}$ 加仑。$${mx(w2, c, d)}$ 分钟注水多少加仑？`,
          },
          {
            en: `Cheese costs $${mx(w1, a, b)}$ dollars per pound. How many dollars do $${mx(w2, c, d)}$ pounds cost?`,
            zh: `奶酪每磅 $${mx(w1, a, b)}$ 美元。$${mx(w2, c, d)}$ 磅要多少美元？`,
          },
        ]);
        const each = mixedValue(w1, a, b);
        return answered(
          [s.en, s.zh],
          v,
          [
            [
              ["Choose the operation", "选择运算"],
              ["The amount for one unit times the number of units gives the total.", "每单位的量乘单位数等于总量。"],
            ],
            improperStep([w1, a, b], [w2, c, d]),
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(n1, b)} \\times ${fr(n2, d)} = ${fr(n1 * n2, b * d)}`],
            ],
            ...tidy(n1 * n2, b * d),
          ],
          eachPartCheck(
            [
              `${mx(w1, a, b)} \\times ${w2} = ${mq(each.mul(qf(w2, 1)))}`,
              `${mx(w1, a, b)} \\times ${fr(c, d)} = ${mq(each.mul(qf(c, d)))}`,
            ],
            v,
            "Split the second number:",
            "把第二个数拆开：",
          ),
          [
            [
              qf(w1 * w2, 1).add(qf(a * c, b * d)),
              "That multiplies only the wholes and the fractions, and leaves out two parts.",
              "这里只把整数乘整数、分数乘分数，漏掉了两块。",
            ],
            [each.add(mixedValue(w2, c, d)), "That adds the two numbers instead of multiplying.", "这是把两个数相加了，没有相乘。"],
            [each.mul(qf(w2, 1)), "That uses only the whole part of the second number.", "这里只用了第二个数的整数部分。"],
          ],
          { form: "mixed", figure: mixedArea(w1, a, b, w2, c, d) },
        );
      },
      mixedArea(2, 1, 2, 2, 1, 5),
    ),
    point(
      "areas-and-scaling-with-mixed-numbers",
      ["Areas and scaling", "面积与放缩"],
      [
        "A rug is $2\\frac{1}{2}$ yards by $1\\frac{1}{3}$ yards. Its area is $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{20}{6} = 3\\frac{1}{3}$ square yards.\n\nCheck: the four parts are $2 + \\frac{2}{3} + \\frac{1}{2} + \\frac{1}{6} = 3\\frac{1}{3}$.\n\n> **Watch out.** Area is length times width. Adding the sides does not give the area.",
        "一块地毯长 $2\\frac{1}{2}$ 码，宽 $1\\frac{1}{3}$ 码。面积是 $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{20}{6} = 3\\frac{1}{3}$ 平方码。\n\n检验：四块是 $2 + \\frac{2}{3} + \\frac{1}{2} + \\frac{1}{6} = 3\\frac{1}{3}$。\n\n> **注意。** 面积是长乘宽。把边长相加得不到面积。",
      ],
      (rng) => {
        const w1 = rng.int(1, 6);
        const w2 = rng.int(1, 4);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const [n1, n2] = [w1 * b + a, w2 * d + c];
        const v = qf(n1 * n2, b * d);
        const name = rng.pick(names);
        const s = rng.pick([
          {
            en: `A rug is $${mx(w1, a, b)}$ yards long and $${mx(w2, c, d)}$ yards wide. What is its area, in square yards?`,
            zh: `一块地毯长 $${mx(w1, a, b)}$ 码，宽 $${mx(w2, c, d)}$ 码。它的面积是多少平方码？`,
          },
          {
            en: `${name}'s dog weighs $${mx(w1, a, b)}$ pounds. A larger dog weighs $${mx(w2, c, d)}$ times as much. How many pounds does the larger dog weigh?`,
            zh: `${name} 的狗重 $${mx(w1, a, b)}$ 磅。另一只大狗的体重是它的 $${mx(w2, c, d)}$ 倍。大狗重多少磅？`,
          },
        ]);
        return answered(
          [s.en, s.zh],
          v,
          [
            improperStep([w1, a, b], [w2, c, d]),
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(n1, b)} \\times ${fr(n2, d)} = ${fr(n1 * n2, b * d)}`],
            ],
            ...tidy(n1 * n2, b * d),
          ],
          [
            `Add the four parts of the area model: $${fourParts(w1, a, b, w2, c, d)} = ${mq(v)}$.`,
            `把面积模型的四块加起来：$${fourParts(w1, a, b, w2, c, d)} = ${mq(v)}$。`,
          ],
          [
            [
              qf(w1 * w2, 1).add(qf(a * c, b * d)),
              "That multiplies only the wholes and the fractions, and leaves out two parts.",
              "这里只把整数乘整数、分数乘分数，漏掉了两块。",
            ],
            [
              mixedValue(w1, a, b).add(mixedValue(w2, c, d)),
              "That adds the two numbers instead of multiplying.",
              "这是把两个数相加了，没有相乘。",
            ],
            [mixedValue(w1, a, b).mul(qf(w2, 1)), "That uses only the whole part of the second number.", "这里只用了第二个数的整数部分。"],
          ],
          { form: "mixed", figure: mixedArea(w1, a, b, w2, c, d) },
        );
      },
      mixedArea(2, 1, 2, 1, 1, 3),
    ),
  ],
  t(
    "Ella walks $3\\frac{1}{2}$ miles each hour for $1\\frac{1}{2}$ hours. She walks $\\frac{7}{2} \\times \\frac{3}{2} = \\frac{21}{4} = 5\\frac{1}{4}$ miles.\n\nCheck: 1 hour is $3\\frac{1}{2}$ miles and half an hour is $1\\frac{3}{4}$ miles, so $3\\frac{1}{2} + 1\\frac{3}{4} = 5\\frac{1}{4}$.\n\nIn this lesson we solve word problems by multiplying mixed numbers.",
    "埃拉每小时走 $3\\frac{1}{2}$ 英里，走了 $1\\frac{1}{2}$ 小时。她走了 $\\frac{7}{2} \\times \\frac{3}{2} = \\frac{21}{4} = 5\\frac{1}{4}$ 英里。\n\n检验：1 小时走 $3\\frac{1}{2}$ 英里，半小时走 $1\\frac{3}{4}$ 英里，$3\\frac{1}{2} + 1\\frac{3}{4} = 5\\frac{1}{4}$。\n\n本课我们用带分数乘法解决应用题。",
  ),
);

export const connectingFractionMultiplicationAndArea = topic(
  "connecting-fraction-multiplication-and-area",
  t("Connecting Fraction Multiplication and Area", "分数乘法与面积"),
  t(
    "Cut a unit square into b equal rows and d equal columns: each small rectangle is 1/b by 1/d and has area 1/(b × d). A rectangle that is a/b by c/d is covered by a × c of them, so its area is (a × c)/(b × d) = a/b × c/d.",
    "把单位正方形平均分成 b 行、d 列：每个小长方形的长和宽是 1/b 和 1/d，面积是 1/(b × d)。长和宽是 a/b 和 c/d 的长方形正好由 a × c 个这样的小长方形铺满，所以它的面积是 (a × c)/(b × d) = a/b × c/d。",
  ),
  ["multiplying-fractions-using-models", "area-of-a-rectangle-by-multiplying"],
  ["5.NF.B.4b"],
  [
    point(
      "area-of-a-unit-fraction-tile",
      ["The area of one small rectangle", "一个小长方形的面积"],
      [
        "Cut a unit square into 3 rows and 4 columns. That makes $3 \\times 4 = 12$ equal tiles, so each tile is $\\frac{1}{12}$ square unit.\n\nCheck: $\\frac{1}{3} \\times \\frac{1}{4} = \\frac{1}{12}$.\n\n> **Watch out.** 3 rows and 4 columns make 12 tiles, not 7.",
        "把单位正方形分成 3 行 4 列，得到 $3 \\times 4 = 12$ 个相同的小块，所以每块是 $\\frac{1}{12}$ 平方单位。\n\n检验：$\\frac{1}{3} \\times \\frac{1}{4} = \\frac{1}{12}$。\n\n> **注意。** 3 行 4 列是 12 块，不是 7 块。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const d = rng.int(2, 9);
        return answered(
          [
            `A rectangle measures $${fr(1, b)}$ unit by $${fr(1, d)}$ unit. What is its area, in square units?`,
            `一个长方形的两边分别是 $${fr(1, b)}$ 单位和 $${fr(1, d)}$ 单位。它的面积是多少平方单位？`,
          ],
          qf(1, b * d),
          [
            [
              ["Fill the unit square", "铺满单位正方形"],
              [`${b} rows and ${d} columns of these rectangles fill it.`, `这样的长方形摆 ${b} 行 ${d} 列正好铺满。`],
              [`${b} \\times ${d} = ${b * d}`],
            ],
            [
              ["Find one", "求一块"],
              [`One rectangle is 1 of the ${b * d} equal parts.`, `一块是 ${b * d} 等份中的 1 份。`],
              [`1 \\div ${b * d} = ${fr(1, b * d)}`],
            ],
          ],
          [
            `Multiply the sides: $${fr(1, b)} \\times ${fr(1, d)} = ${fr(1, b * d)}$.`,
            `两边相乘：$${fr(1, b)} \\times ${fr(1, d)} = ${fr(1, b * d)}$。`,
          ],
          [
            [qf(1, b + d), "That adds the rows and the columns.", "这是把行数和列数相加了。"],
            [qf(2, b * d), "That is 2 rectangles, not 1.", "这是 2 块，不是 1 块。"],
            [qf(1, Math.min(b, d)), "That is the length of one side, not an area.", "这是一条边的长，不是面积。"],
          ],
          { form: "fraction", figure: productGrid(1, d, 1, b) },
        );
      },
      productGrid(1, 4, 1, 3),
    ),
    point(
      "counting-tiles-in-a-fractional-rectangle",
      ["Counting tiles", "数小块"],
      [
        "A $\\frac{3}{4}$ by $\\frac{2}{3}$ rectangle holds tiles $\\frac{1}{4}$ by $\\frac{1}{3}$: 3 across and 2 up, so $3 \\times 2 = 6$ tiles. Each tile is $\\frac{1}{12}$, so the area is $\\frac{6}{12}$.\n\nCheck: $\\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12}$.\n\n> **Watch out.** Multiply across by up. $3 + 2 = 5$ counts only one row and one column.",
        "长 $\\frac{3}{4}$、宽 $\\frac{2}{3}$ 的长方形，用 $\\frac{1}{4}$ 乘 $\\frac{1}{3}$ 的小块铺：横着 3 块，竖着 2 块，共 $3 \\times 2 = 6$ 块。每块是 $\\frac{1}{12}$，所以面积是 $\\frac{6}{12}$。\n\n检验：$\\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12}$。\n\n> **注意。** 横着的块数乘竖着的块数。$3 + 2 = 5$ 只数了一行和一列。",
      ],
      (rng) => {
        const [c, b] = properFraction(rng, 6, 2);
        const [a, d] = properFraction(rng, 8, 3);
        return answered(
          [
            `The shaded rectangle is $${fr(a, d)}$ unit wide and $${fr(c, b)}$ unit tall. How many tiles of size $${fr(1, d)}$ by $${fr(1, b)}$ cover it?`,
            `涂色的长方形宽 $${fr(a, d)}$ 单位、高 $${fr(c, b)}$ 单位。需要多少个 $${fr(1, d)}$ 乘 $${fr(1, b)}$ 的小块才能铺满它？`,
          ],
          a * c,
          [
            [
              ["Count across", "数横向"],
              [`$${fr(a, d)}$ is ${a} tiles of $${fr(1, d)}$.`, `$${fr(a, d)}$ 是 ${a} 个 $${fr(1, d)}$。`],
            ],
            [
              ["Count up", "数竖向"],
              [`$${fr(c, b)}$ is ${c} tiles of $${fr(1, b)}$.`, `$${fr(c, b)}$ 是 ${c} 个 $${fr(1, b)}$。`],
            ],
            [["Multiply", "相乘"], ["Rows times columns.", "行数乘列数。"], [`${a} \\times ${c} = ${a * c}`]],
          ],
          [
            `Each tile is $${fr(1, b * d)}$ of the unit square, so ${a * c} tiles make $${fr(a * c, b * d)}$, the same as $${fr(a, d)} \\times ${fr(c, b)} = ${fr(a * c, b * d)}$.`,
            `每块是单位正方形的 $${fr(1, b * d)}$，所以 ${a * c} 块是 $${fr(a * c, b * d)}$，正好等于 $${fr(a, d)} \\times ${fr(c, b)} = ${fr(a * c, b * d)}$。`,
          ],
          [
            [a + c, "That adds across and up.", "这是把横向和竖向的块数相加了。"],
            [b * d, "That is all the tiles in the unit square.", "这是单位正方形里所有的小块。"],
            [b * d - a * c, "That counts the tiles outside the shaded rectangle.", "这是涂色长方形外面的小块。"],
          ],
          { figure: productGrid(a, d, c, b) },
        );
      },
      productGrid(3, 4, 2, 3),
    ),
  ],
  t(
    "A tile is $\\frac{1}{3}$ foot by $\\frac{1}{4}$ foot. 12 tiles fill a square foot, so each tile is $\\frac{1}{12}$ square foot. A rug $\\frac{2}{3}$ by $\\frac{3}{4}$ foot holds $2 \\times 3 = 6$ tiles, so its area is $\\frac{6}{12}$.\n\nCheck: $\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12}$.\n\nIn this lesson we see why the area of a rectangle with fraction sides is a product.",
    "一块小砖长 $\\frac{1}{4}$ 英尺、宽 $\\frac{1}{3}$ 英尺。12 块铺满 1 平方英尺，所以每块是 $\\frac{1}{12}$ 平方英尺。长 $\\frac{3}{4}$、宽 $\\frac{2}{3}$ 英尺的地垫能放 $2 \\times 3 = 6$ 块，所以面积是 $\\frac{6}{12}$。\n\n检验：$\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12}$。\n\n本课我们来看为什么分数边长的长方形面积是一个乘积。",
  ),
);

export const findingAreasUsingFractionMultiplication = topic(
  "finding-areas-using-fraction-multiplication",
  t("Finding Areas Using Fraction Multiplication", "用分数乘法求面积"),
  t(
    "The area of a rectangle is length × width, also when the sides are fractions or mixed numbers: a 3/4 m by 2/5 m rectangle has area 3/4 × 2/5 = 6/20 = 3/10 m², and a 2 1/2 ft by 1 1/3 ft rectangle has area 5/2 × 4/3 = 10/3 = 3 1/3 ft².",
    "长方形的面积等于长乘宽，边长是分数或带分数时也一样：长 3/4 米、宽 2/5 米的长方形面积是 3/4 × 2/5 = 6/20 = 3/10 平方米；长 2 1/2 英尺、宽 1 1/3 英尺的长方形面积是 5/2 × 4/3 = 10/3 = 3 1/3 平方英尺。",
  ),
  ["connecting-fraction-multiplication-and-area", "multiplying-mixed-numbers"],
  ["5.NF.B.4b"],
  [
    point(
      "areas-with-fraction-sides",
      ["Fraction side lengths", "边长是分数"],
      [
        "A rectangle $\\frac{5}{6}$ meter by $\\frac{3}{4}$ meter has area $\\frac{5}{6} \\times \\frac{3}{4} = \\frac{15}{24} = \\frac{5}{8}$ square meter.\n\nCheck: in the model, 15 of the 24 small parts are shaded twice.\n\n> **Watch out.** Area is length times width. Adding the sides gives part of the perimeter.",
        "长 $\\frac{5}{6}$ 米、宽 $\\frac{3}{4}$ 米的长方形，面积是 $\\frac{5}{6} \\times \\frac{3}{4} = \\frac{15}{24} = \\frac{5}{8}$ 平方米。\n\n检验：在模型中，24 小份里有 15 份涂了两次。\n\n> **注意。** 面积是长乘宽。把边长相加得到的是周长的一部分。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 10, 2);
        const [c, d] = properFraction(rng, 10, 2);
        const v = qf(a * c, b * d);
        return answered(
          [
            `A rectangle is $${fr(a, b)}$ meter long and $${fr(c, d)}$ meter wide. What is its area, in square meters?`,
            `一个长方形长 $${fr(a, b)}$ 米，宽 $${fr(c, d)}$ 米。它的面积是多少平方米？`,
          ],
          v,
          [
            [
              ["Multiply the sides", "两边相乘"],
              ["Area is length times width.", "面积等于长乘宽。"],
              [`${fr(a, b)} \\times ${fr(c, d)} = ${fr(a * c, b * d)}`],
            ],
            ...tidy(a * c, b * d),
          ],
          [
            `In the model, ${a * c} of the ${b * d} small parts are shaded twice, which is $${mq(v)}$.`,
            `在模型中，${b * d} 小份里有 ${a * c} 份涂了两次，就是 $${mq(v)}$。`,
          ],
          [
            [qf(a, b).add(qf(c, d)), "That adds the sides.", "这是把两条边相加了。"],
            [qf(a, b).add(qf(c, d)).mul(qf(2, 1)), "That is the perimeter, not the area.", "这是周长，不是面积。"],
            [qf(a * c, b + d), "That adds the bottoms.", "这是把分母相加了。"],
          ],
          { form: "fraction", figure: productGrid(a, b, c, d) },
        );
      },
      productGrid(5, 6, 3, 4),
    ),
    point(
      "areas-with-mixed-number-sides",
      ["Mixed number side lengths", "边长是带分数"],
      [
        "A rectangle $3\\frac{1}{2}$ feet by $2\\frac{1}{4}$ feet has area $\\frac{7}{2} \\times \\frac{9}{4} = \\frac{63}{8} = 7\\frac{7}{8}$ square feet.\n\nCheck: the four parts are $6 + \\frac{3}{4} + 1 + \\frac{1}{8} = 7\\frac{7}{8}$.\n\n> **Watch out.** $3 \\times 2 + \\frac{1}{2} \\times \\frac{1}{4}$ leaves out two parts of the area.",
        "长 $3\\frac{1}{2}$ 英尺、宽 $2\\frac{1}{4}$ 英尺的长方形，面积是 $\\frac{7}{2} \\times \\frac{9}{4} = \\frac{63}{8} = 7\\frac{7}{8}$ 平方英尺。\n\n检验：四块是 $6 + \\frac{3}{4} + 1 + \\frac{1}{8} = 7\\frac{7}{8}$。\n\n> **注意。** $3 \\times 2 + \\frac{1}{2} \\times \\frac{1}{4}$ 漏掉了面积中的两块。",
      ],
      (rng) => {
        const w1 = rng.int(1, 6);
        const w2 = rng.int(1, 5);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const [n1, n2] = [w1 * b + a, w2 * d + c];
        const v = qf(n1 * n2, b * d);
        return answered(
          [
            `A rectangle is $${mx(w1, a, b)}$ feet long and $${mx(w2, c, d)}$ feet wide. What is its area, in square feet?`,
            `一个长方形长 $${mx(w1, a, b)}$ 英尺，宽 $${mx(w2, c, d)}$ 英尺。它的面积是多少平方英尺？`,
          ],
          v,
          [
            improperStep([w1, a, b], [w2, c, d]),
            [
              ["Multiply the sides", "两边相乘"],
              ["Area is length times width.", "面积等于长乘宽。"],
              [`${fr(n1, b)} \\times ${fr(n2, d)} = ${fr(n1 * n2, b * d)}`],
            ],
            ...tidy(n1 * n2, b * d),
          ],
          [
            `Add the four parts of the area model: $${fourParts(w1, a, b, w2, c, d)} = ${mq(v)}$.`,
            `把面积模型的四块加起来：$${fourParts(w1, a, b, w2, c, d)} = ${mq(v)}$。`,
          ],
          [
            [
              qf(w1 * w2, 1).add(qf(a * c, b * d)),
              "That multiplies only the wholes and the fractions, and leaves out two parts.",
              "这里只把整数乘整数、分数乘分数，漏掉了两块。",
            ],
            [
              mixedValue(w1, a, b)
                .add(mixedValue(w2, c, d))
                .mul(qf(2, 1)),
              "That is the perimeter, not the area.",
              "这是周长，不是面积。",
            ],
            [mixedValue(w1, a, b).add(mixedValue(w2, c, d)), "That adds the sides.", "这是把两条边相加了。"],
          ],
          { form: "mixed", figure: mixedArea(w1, a, b, w2, c, d) },
        );
      },
      mixedArea(3, 1, 2, 2, 1, 4),
    ),
  ],
  t(
    "A poster is $\\frac{3}{4}$ meter by $\\frac{2}{5}$ meter. Its area is $\\frac{3}{4} \\times \\frac{2}{5} = \\frac{6}{20} = \\frac{3}{10}$ square meter.\n\nCheck: in the model, 6 of the 20 small parts are shaded twice.\n\nIn this lesson we multiply to find areas with fraction and mixed number sides.",
    "一张海报长 $\\frac{3}{4}$ 米，宽 $\\frac{2}{5}$ 米。面积是 $\\frac{3}{4} \\times \\frac{2}{5} = \\frac{6}{20} = \\frac{3}{10}$ 平方米。\n\n检验：在模型中，20 小份里有 6 份涂了两次。\n\n本课我们用乘法求边长是分数或带分数的长方形面积。",
  ),
);

export const fractionMultiplicationNumberSense = topic(
  "fraction-multiplication-number-sense",
  t("Fraction Multiplication Number Sense", "分数乘法的数感"),
  t(
    "Multiplying by a number greater than 1 makes a positive number larger, multiplying by 1 leaves it unchanged, and multiplying by a number less than 1 makes it smaller. So 3/4 × 18 < 18 and 1 1/2 × 18 > 18, without computing either.",
    "一个正数乘大于 1 的数，积比它大；乘 1，积不变；乘小于 1 的数，积比它小。所以不用计算就知道 3/4 × 18 < 18，1 1/2 × 18 > 18。",
  ),
  ["multiplying-fractions", "multiplying-mixed-numbers-by-whole-numbers"],
  ["5.NF.B.5"],
  [
    point(
      "comparing-a-product-with-a-factor",
      ["Comparing a product with a factor", "积与因数比较"],
      [
        "$\\frac{7}{8} \\times 250$ is less than 250, because $\\frac{7}{8}$ is less than 1.\n\nCheck: $\\frac{1}{8}$ of 250 is $31\\frac{1}{4}$, so the product is $250 - 31\\frac{1}{4} = 218\\frac{3}{4}$.\n\n> **Watch out.** Multiplying does not always make a number bigger. A factor less than 1 makes it smaller.",
        "$\\frac{7}{8} \\times 250$ 小于 250，因为 $\\frac{7}{8}$ 小于 1。\n\n检验：250 的 $\\frac{1}{8}$ 是 $31\\frac{1}{4}$，所以积是 $250 - 31\\frac{1}{4} = 218\\frac{3}{4}$。\n\n> **注意。** 乘法不一定使数变大。乘小于 1 的数，结果变小。",
      ],
      (rng) => {
        const n = rng.int(12, 900);
        const kind = rng.int(0, 2);
        let f: Q;
        let fTex: string;
        if (kind === 0) {
          const [a, b] = properFraction(rng, 12, 2);
          f = qf(a, b);
          fTex = fr(a, b);
        } else if (kind === 1) {
          const [a, b] = properFraction(rng, 9, 2);
          const w = rng.int(1, 3);
          f = mixedValue(w, a, b);
          fTex = rng.bool() ? mx(w, a, b) : fr(w * b + a, b);
        } else {
          const b = rng.int(2, 12);
          f = qf(1, 1);
          fTex = fr(b, b);
        }
        const answers: readonly Pair[] = [
          ["less than", "小于"],
          ["greater than", "大于"],
          ["equal to", "等于"],
        ];
        const side = kind === 0 ? ["less than", "小于"] : kind === 1 ? ["greater than", "大于"] : ["equal to", "等于"];
        const why: readonly (readonly [string, string])[] = [
          [
            `A factor less than 1 makes ${n} smaller, but $${fTex}$ is not less than 1.`,
            `乘小于 1 的数才使 ${n} 变小，但 $${fTex}$ 不小于 1。`,
          ],
          [
            `A factor greater than 1 makes ${n} larger, but $${fTex}$ is not greater than 1.`,
            `乘大于 1 的数才使 ${n} 变大，但 $${fTex}$ 不大于 1。`,
          ],
          [`Only a factor equal to 1 keeps ${n} the same, and $${fTex}$ is not 1.`, `只有乘 1 才使 ${n} 不变，而 $${fTex}$ 不等于 1。`],
        ];
        const rule: Pair = [
          `Multiplying by a number ${side[0]} 1 gives a product ${side[0]} ${n}.`,
          `乘一个${side[1]} 1 的数，积${side[1]} ${n}。`,
        ];
        return picked(
          rng,
          [
            `Without multiplying, is $${fTex} \\times ${n}$ greater than, less than, or equal to ${n}?`,
            `不计算，判断 $${fTex} \\times ${n}$ 大于、小于还是等于 ${n}？`,
          ],
          answers[kind]!,
          answers.flatMap((p, i) => (i === kind ? [] : [[p, why[i]![0], why[i]![1]] as const])),
          [
            [
              ["Compare the factor with 1", "把因数和 1 比较"],
              [`$${fTex}$ is ${side[0]} 1.`, `$${fTex}$ ${side[1]} 1。`],
            ],
            [["Decide", "判断"], rule],
          ],
          [`Work it out: $${fTex} \\times ${n} = ${mq(f.mul(qf(n, 1)))}$.`, `算一算：$${fTex} \\times ${n} = ${mq(f.mul(qf(n, 1)))}$。`],
          scaleLine([
            [qf(1, 1), "1"],
            [f, pieceText(f)],
          ]),
        );
      },
      scaleLine([
        [qf(1, 1), "1"],
        [qf(7, 8), "7/8"],
      ]),
    ),
    point(
      "choosing-the-greatest-product",
      ["The greatest or least product", "最大或最小的积"],
      [
        "Of $\\frac{2}{3} \\times 45$, $1 \\times 45$, $\\frac{5}{4} \\times 45$ and $2\\frac{1}{2} \\times 45$, the greatest is $2\\frac{1}{2} \\times 45$. Every product has 45, so the greatest other factor wins.\n\nCheck: $2\\frac{1}{2} \\times 45 = 112\\frac{1}{2}$, more than $\\frac{5}{4} \\times 45 = 56\\frac{1}{4}$.\n\n> **Watch out.** Compare the factors, not the products you guess. The same 45 is in each one.",
        "在 $\\frac{2}{3} \\times 45$、$1 \\times 45$、$\\frac{5}{4} \\times 45$ 和 $2\\frac{1}{2} \\times 45$ 中，$2\\frac{1}{2} \\times 45$ 最大。每个积都有 45，所以另一个因数最大的积最大。\n\n检验：$2\\frac{1}{2} \\times 45 = 112\\frac{1}{2}$，比 $\\frac{5}{4} \\times 45 = 56\\frac{1}{4}$ 大。\n\n> **注意。** 比较因数，不要凭感觉猜积。每个积里都是同一个 45。",
      ],
      (rng) => {
        const n = rng.int(12, 300);
        const [a, b] = properFraction(rng, 9, 2);
        const [c, d] = properFraction(rng, 9, 2);
        const fs = [qf(a, b), qf(1, 1), qf(d + c, d), mixedValue(2, c, d)];
        const texs = [fr(a, b), "1", fr(d + c, d), mx(2, c, d)];
        const greatest = rng.bool();
        const target = greatest ? 3 : 0;
        const product = (i: number) => `${texs[i]} \\times ${n}`;
        const why = (i: number): readonly [string, string] =>
          greatest
            ? [`$${texs[i]}$ is less than $${texs[3]}$, so this product is smaller.`, `$${texs[i]}$ 比 $${texs[3]}$ 小，所以这个积更小。`]
            : [`$${texs[i]}$ is more than $${texs[0]}$, so this product is larger.`, `$${texs[i]}$ 比 $${texs[0]}$ 大，所以这个积更大。`];
        return pickedMath(
          rng,
          greatest ? ["Which product is the greatest?", "哪个积最大？"] : ["Which product is the least?", "哪个积最小？"],
          product(target),
          [0, 1, 2, 3].filter((i) => i !== target).map((i) => [product(i), ...why(i)] as const),
          [
            [
              ["Look at what is the same", "找相同的数"],
              [`Every product multiplies ${n}.`, `每个积都是 ${n} 乘一个数。`],
            ],
            [
              ["Order the factors", "给因数排序"],
              [
                `From least to greatest: $${texs[0]} < 1 < ${texs[2]} < ${texs[3]}$.`,
                `从小到大：$${texs[0]} < 1 < ${texs[2]} < ${texs[3]}$。`,
              ],
            ],
          ],
          [
            `Work it out: $${product(target)} = ${mq(fs[target]!.mul(qf(n, 1)))}$.`,
            `算一算：$${product(target)} = ${mq(fs[target]!.mul(qf(n, 1)))}$。`,
          ],
          scaleLine(fs.map((f) => [f, pieceText(f)] as const)),
        );
      },
      scaleLine([
        [qf(2, 3), "2/3"],
        [qf(1, 1), "1"],
        [qf(5, 4), "5/4"],
        [qf(5, 2), "5/2"],
      ]),
    ),
  ],
  t(
    "A recipe makes 18 cookies. Making $\\frac{3}{4}$ of the recipe gives fewer than 18, and making $1\\frac{1}{2}$ times the recipe gives more.\n\nCheck: $\\frac{3}{4} \\times 18 = 13\\frac{1}{2}$ and $1\\frac{1}{2} \\times 18 = 27$.\n\nIn this lesson we tell how big a product is without multiplying.",
    "一份食谱能做 18 块饼干。做 $\\frac{3}{4}$ 份，饼干少于 18 块；做 $1\\frac{1}{2}$ 份，饼干多于 18 块。\n\n检验：$\\frac{3}{4} \\times 18 = 13\\frac{1}{2}$，$1\\frac{1}{2} \\times 18 = 27$。\n\n本课我们不用计算，判断积的大小。",
  ),
);

// ---------------------------------------------------------------------------
// Dividing fractions

/** countBack checks a count of 1/d parts by putting them back together into w wholes. */
const countBack = (count: number, d: number, w: number): Pair => [
  `Put the parts back together: ${count} parts of $${fr(1, d)}$ make $${fr(count, d)} = ${w}$.`,
  `把这些份合起来：${count} 个 $${fr(1, d)}$ 是 $${fr(count, d)} = ${w}$。`,
];

/** shareBack checks a share 1/(d n) by putting n shares back together into 1/d. */
const shareBack = (d: number, n: number): Pair => [
  `Put the shares back together: ${n} shares of $${fr(1, d * n)}$ make $${fr(n, d * n)} = ${fr(1, d)}$.`,
  `把这几份合起来：${n} 个 $${fr(1, d * n)}$ 是 $${fr(n, d * n)} = ${fr(1, d)}$。`,
];

export const interpretingFractionDivisionUsingAreaModels = topic(
  "interpreting-fraction-division-using-area-models",
  t("Interpreting Fraction Division Using Area Models", "用面积模型理解分数除法"),
  t(
    "A division like 3 ÷ 1/4 asks how many fourths are in 3: cut 3 bars into fourths and count 12 parts, so 3 ÷ 1/4 = 12. A division like 1/3 ÷ 4 asks for one of 4 equal shares of 1/3: cut 1/3 of a bar into 4 pieces, each 1/12 of the bar, so 1/3 ÷ 4 = 1/12.",
    "3 ÷ 1/4 问的是 3 里面有多少个 1/4：把 3 个长条都分成四份，一共 12 份，所以 3 ÷ 1/4 = 12。1/3 ÷ 4 问的是把 1/3 平均分成 4 份，每份是多少：把一个长条的 1/3 分成 4 小块，每块是整个长条的 1/12，所以 1/3 ÷ 4 = 1/12。",
  ),
  ["multiplying-fractions-using-models"],
  ["5.NF.B.7"],
  [
    point(
      "how-many-unit-fractions-in-wholes",
      ["How many parts are in the wholes", "整数里有多少个几分之一"],
      [
        "$2 \\div \\frac{1}{3}$ asks how many thirds are in 2. Each whole has 3 thirds, so 2 wholes have $2 \\times 3 = 6$. So $2 \\div \\frac{1}{3} = 6$.\n\nCheck: 6 thirds make $\\frac{6}{3} = 2$.\n\n> **Watch out.** The answer is bigger than 2. Small parts fit many times.",
        "$2 \\div \\frac{1}{3}$ 问的是 2 里面有几个三分之一。每个整体有 3 个三分之一，2 个整体有 $2 \\times 3 = 6$ 个。所以 $2 \\div \\frac{1}{3} = 6$。\n\n检验：6 个三分之一是 $\\frac{6}{3} = 2$。\n\n> **注意。** 结果比 2 大。份很小，所以能装下很多份。",
      ],
      (rng) => {
        const w = rng.int(1, 4);
        const d = rng.int(2, 10);
        return answered(
          [
            `The model shows ${w} whole${w === 1 ? "" : "s"} cut into parts of size $${fr(1, d)}$. Find $${w} \\div ${fr(1, d)}$.`,
            `模型表示 ${w} 个整体，都分成大小为 $${fr(1, d)}$ 的份。计算 $${w} \\div ${fr(1, d)}$。`,
          ],
          w * d,
          [
            [
              ["Count one whole", "数一个整体"],
              [`One whole has ${d} parts of size $${fr(1, d)}$.`, `一个整体有 ${d} 个 $${fr(1, d)}$。`],
            ],
            [
              ["Count all the wholes", "数所有整体"],
              [`There are ${w} whole${w === 1 ? "" : "s"}.`, `一共有 ${w} 个整体。`],
              [`${w} \\times ${d} = ${w * d}`],
            ],
          ],
          countBack(w * d, d, w),
          [
            [
              qf(w, d),
              `That divides ${w} by ${d}. Small parts fit many times, so the answer is bigger.`,
              `这是用 ${w} 除以 ${d}。份很小，能装下很多份，结果应该更大。`,
            ],
            [w + d, "That adds instead of counting all the parts.", "这是相加了，没有数所有的份。"],
            [d, "That counts the parts in one whole only.", "这只数了一个整体里的份数。"],
          ],
          { figure: groupedBarsFigure(w, d, 1) },
        );
      },
      groupedBarsFigure(2, 3, 1),
    ),
    point(
      "choosing-the-division-for-a-model",
      ["Which division the model shows", "模型表示哪个除法"],
      [
        "A bar has $\\frac{1}{2}$ shaded, and that half is cut into 3 equal shares. It shows $\\frac{1}{2} \\div 3$. The whole bar would hold 6 such shares, so one share is $\\frac{1}{6}$.\n\nCheck: 3 shares of $\\frac{1}{6}$ make $\\frac{3}{6}$, which is $\\frac{1}{2}$.\n\n> **Watch out.** Count the shares in the whole bar, not only in the shaded part.",
        "一个长条涂了 $\\frac{1}{2}$，这一半又平均分成 3 份。它表示 $\\frac{1}{2} \\div 3$。整个长条能分成 6 个这样的份，所以一份是 $\\frac{1}{6}$。\n\n检验：3 个 $\\frac{1}{6}$ 是 $\\frac{3}{6}$，也就是 $\\frac{1}{2}$。\n\n> **注意。** 要数整个长条里有几份，不能只数涂色的部分。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const n = rng.int(2, 6);
        return pickedMath(
          rng,
          ["The darker piece is one share. Which division does the model show?", "颜色最深的一块是其中一份。模型表示哪个除法算式？"],
          `${fr(1, d)} \\div ${n} = ${fr(1, d * n)}`,
          [
            [
              `${n} \\div ${fr(1, d)} = ${n * d}`,
              `That counts how many $${fr(1, d)}$ fit in ${n}, but the model shares $${fr(1, d)}$.`,
              `这是数 ${n} 里有几个 $${fr(1, d)}$，但模型是在平分 $${fr(1, d)}$。`,
            ],
            [
              `${fr(1, d)} \\div ${n} = ${fr(n, d)}`,
              `A share is smaller than $${fr(1, d)}$, not bigger.`,
              `每份比 $${fr(1, d)}$ 小，不会更大。`,
            ],
            [
              `${fr(1, n)} \\div ${d} = ${fr(1, d + n)}`,
              "That swaps the numbers and adds the bottoms.",
              "这里把两个数弄反了，还把分母相加了。",
            ],
          ],
          [
            [
              ["Find the shaded part", "找涂色部分"],
              [`$${fr(1, d)}$ of the bar is shaded.`, `长条涂了 $${fr(1, d)}$。`],
            ],
            [
              ["Count the shares", "数份数"],
              [`The shaded part is cut into ${n} equal shares.`, `涂色部分平均分成 ${n} 份。`],
            ],
            [
              ["Name one share", "说出一份的大小"],
              [`The whole bar would hold ${d * n} such shares.`, `整个长条能分成 ${d * n} 个这样的份。`],
              [`${d} \\times ${n} = ${d * n}`],
            ],
          ],
          shareBack(d, n),
          splitPartsFigure(1, d, n),
        );
      },
      splitPartsFigure(1, 2, 3),
    ),
  ],
  t(
    "Mom cuts 3 sandwiches into fourths. There are $3 \\times 4 = 12$ fourths, so $3 \\div \\frac{1}{4} = 12$.\n\nCheck: 12 fourths make $\\frac{12}{4} = 3$ sandwiches.\n\nIn this lesson we use models to see what dividing with fractions means.",
    "妈妈把 3 个三明治都切成四份。一共有 $3 \\times 4 = 12$ 个四分之一，所以 $3 \\div \\frac{1}{4} = 12$。\n\n检验：12 个四分之一是 $\\frac{12}{4} = 3$ 个三明治。\n\n本课我们用模型理解分数除法的意思。",
  ),
);

/** servingStory is a word problem asking how many servings of size 1/d are in w wholes. */
function servingStory(rng: Rng, w: number, sizeTex: string, partial = false): Pair {
  const name = rng.pick(names);
  if (partial) {
    return rng.pick<Pair>([
      [
        `${name} has ${w} cups of rice. Each serving is $${sizeTex}$ cup. How many servings are there, counting a partial serving as a fraction?`,
        `${name} 有 ${w} 杯米，每份是 $${sizeTex}$ 杯。不满一份的部分按几分之几份计，一共有多少份？`,
      ],
      [
        `A ${w}-meter ribbon is cut into pieces $${sizeTex}$ meter long. How many pieces does the ribbon make, counting the shorter leftover as a fraction of a piece?`,
        `一根 ${w} 米长的丝带剪成每段 $${sizeTex}$ 米长。剩下不够一段的部分按几分之几段计，这根丝带相当于多少段？`,
      ],
      [
        `${name} has ${w} pounds of nuts and fills bags with $${sizeTex}$ pound each. How many bags' worth of nuts is that, counting a partly filled bag as a fraction?`,
        `${name} 有 ${w} 磅坚果，每袋装 $${sizeTex}$ 磅。没装满的一袋按几分之几袋计，这些坚果相当于多少袋？`,
      ],
    ]);
  }
  return rng.pick<Pair>([
    [
      `${name} has ${w} cups of rice. Each serving is $${sizeTex}$ cup. How many servings are there?`,
      `${name} 有 ${w} 杯米，每份是 $${sizeTex}$ 杯。一共有多少份？`,
    ],
    [
      `A ${w}-meter ribbon is cut into pieces $${sizeTex}$ meter long. How many pieces are there?`,
      `一根 ${w} 米长的丝带剪成每段 $${sizeTex}$ 米长。一共能剪多少段？`,
    ],
    [
      `${name} has ${w} pounds of nuts and fills bags with $${sizeTex}$ pound each. How many bags can ${name} fill?`,
      `${name} 有 ${w} 磅坚果，每袋装 $${sizeTex}$ 磅。能装满多少袋？`,
    ],
  ]);
}

export const dividingWholeNumbersByUnitFractionsUsingModels = topic(
  "dividing-whole-numbers-by-unit-fractions-using-models",
  t("Dividing Whole Numbers by Unit Fractions Using Models", "用模型做整数除以单位分数"),
  t(
    "To find 4 ÷ 1/3, ask how many thirds fit in 4. Cut each of 4 bars into thirds: there are 4 × 3 = 12 thirds, so 4 ÷ 1/3 = 12.",
    "计算 4 ÷ 1/3，就是问 4 里面有几个 1/3。把 4 个长条都分成三份：一共有 4 × 3 = 12 个三分之一，所以 4 ÷ 1/3 = 12。",
  ),
  ["interpreting-fraction-division-using-area-models"],
  ["5.NF.B.7b"],
  [
    point(
      "counting-unit-fractions-in-a-model",
      ["Counting parts in the model", "数模型中的份数"],
      [
        "For $3 \\div \\frac{1}{5}$, cut each of 3 bars into fifths. Each bar holds 5, so 3 bars hold $3 \\times 5 = 15$. So $3 \\div \\frac{1}{5} = 15$.\n\nCheck: 15 fifths make $\\frac{15}{5} = 3$.\n\n> **Watch out.** Count the parts in every bar, not just in one.",
        "计算 $3 \\div \\frac{1}{5}$，把 3 个长条都分成五份。每个长条有 5 份，3 个长条有 $3 \\times 5 = 15$ 份。所以 $3 \\div \\frac{1}{5} = 15$。\n\n检验：15 个五分之一是 $\\frac{15}{5} = 3$。\n\n> **注意。** 每个长条里的份都要数，不能只数一个。",
      ],
      (rng) => {
        const w = rng.int(2, 5);
        const d = rng.int(2, 8);
        return answered(
          [`Use the model to find $${w} \\div ${fr(1, d)}$.`, `利用模型计算 $${w} \\div ${fr(1, d)}$。`],
          w * d,
          [
            [
              ["Count one bar", "数一个长条"],
              [`Each bar has ${d} parts of size $${fr(1, d)}$.`, `每个长条有 ${d} 个 $${fr(1, d)}$。`],
            ],
            [["Count all the bars", "数所有长条"], [`There are ${w} bars.`, `一共有 ${w} 个长条。`], [`${w} \\times ${d} = ${w * d}`]],
          ],
          countBack(w * d, d, w),
          [
            [
              qf(w, d),
              `That divides ${w} by ${d}. Small parts fit many times, so the answer is bigger.`,
              `这是用 ${w} 除以 ${d}。份很小，能装下很多份，结果应该更大。`,
            ],
            [w + d, "That adds instead of counting all the parts.", "这是相加了，没有数所有的份。"],
            [(w - 1) * d, "That misses one bar.", "这里少数了一个长条。"],
          ],
          { figure: groupedBarsFigure(w, d, 1) },
        );
      },
      groupedBarsFigure(3, 5, 1),
    ),
    point(
      "unit-fraction-servings-with-models",
      ["Servings and pieces", "分份问题"],
      [
        '2 cups of soup are served in $\\frac{1}{4}$ cup servings. Each cup makes 4 servings, so $2 \\div \\frac{1}{4} = 8$ servings.\n\nCheck: 8 servings of $\\frac{1}{4}$ cup make $\\frac{8}{4} = 2$ cups.\n\n> **Watch out.** "How many servings" means divide by the serving size. $2 \\div 4$ is far too small.',
        "2 杯汤，每份 $\\frac{1}{4}$ 杯。每杯能分 4 份，所以 $2 \\div \\frac{1}{4} = 8$ 份。\n\n检验：8 份 $\\frac{1}{4}$ 杯是 $\\frac{8}{4} = 2$ 杯。\n\n> **注意。** “能分几份”是用总量除以每份的量。$2 \\div 4$ 就太小了。",
      ],
      (rng) => {
        const w = rng.int(2, 5);
        const d = rng.int(2, 8);
        return answered(
          servingStory(rng, w, fr(1, d)),
          w * d,
          [
            [
              ["Choose the operation", "选择运算"],
              ["How many servings means divide the total by the size of one.", "求能分几份，用总量除以每份的量。"],
              [`${w} \\div ${fr(1, d)}`],
            ],
            [["Count", "数一数"], [`Each whole makes ${d} servings.`, `每个整体能分 ${d} 份。`], [`${w} \\times ${d} = ${w * d}`]],
          ],
          countBack(w * d, d, w),
          [
            [
              qf(w, d),
              `That divides ${w} by ${d}. Small servings fit many times, so the answer is bigger.`,
              `这是用 ${w} 除以 ${d}。每份很小，能分很多份，结果应该更大。`,
            ],
            [w + d, "That adds instead of dividing.", "这是相加了，没有做除法。"],
            [d, "That counts the servings in one whole only.", "这只数了一个整体能分的份数。"],
          ],
          { figure: groupedBarsFigure(w, d, 1) },
        );
      },
      groupedBarsFigure(2, 4, 1),
    ),
  ],
  t(
    "Zoe cuts 2 pizzas into fifths. That makes $2 \\times 5 = 10$ slices, so $2 \\div \\frac{1}{5} = 10$.\n\nCheck: 10 slices of $\\frac{1}{5}$ make $\\frac{10}{5} = 2$ pizzas.\n\nIn this lesson we divide whole numbers by unit fractions with bar models.",
    "佐伊把 2 个比萨饼都切成五份。一共 $2 \\times 5 = 10$ 块，所以 $2 \\div \\frac{1}{5} = 10$。\n\n检验：10 块 $\\frac{1}{5}$ 是 $\\frac{10}{5} = 2$ 个比萨饼。\n\n本课我们用长条模型做整数除以单位分数。",
  ),
);

export const dividingWholeNumbersByUnitFractions = topic(
  "dividing-whole-numbers-by-unit-fractions",
  t("Dividing Whole Numbers by Unit Fractions", "整数除以单位分数"),
  t(
    "Every whole contains d parts of size 1/d, so dividing a whole number by 1/d multiplies it by d: 7 ÷ 1/4 = 7 × 4 = 28. Check: 28 × 1/4 = 7.",
    "每个整体里有 d 个 1/d，所以整数除以 1/d 等于乘 d：7 ÷ 1/4 = 7 × 4 = 28。检验：28 × 1/4 = 7。",
  ),
  ["dividing-whole-numbers-by-unit-fractions-using-models"],
  ["5.NF.B.7b"],
  [
    point(
      "whole-number-divided-by-unit-fraction",
      ["Finding the quotient", "求商"],
      [
        "$3 \\div \\frac{1}{6} = 3 \\times 6 = 18$, because each of the 3 wholes holds 6 sixths.\n\nCheck: $18 \\times \\frac{1}{6} = \\frac{18}{6} = 3$.\n\n> **Watch out.** Do not divide 3 by 6. That gives $\\frac{1}{2}$, which is much too small.",
        "$3 \\div \\frac{1}{6} = 3 \\times 6 = 18$，因为 3 个整体中每个都有 6 个六分之一。\n\n检验：$18 \\times \\frac{1}{6} = \\frac{18}{6} = 3$。\n\n> **注意。** 不要用 3 除以 6。那样得到 $\\frac{1}{2}$，太小了。",
      ],
      (rng) => {
        const w = rng.int(2, 20);
        const d = rng.int(2, 12);
        return answered(
          [`Find $${w} \\div ${fr(1, d)}$.`, `计算 $${w} \\div ${fr(1, d)}$。`],
          w * d,
          [
            [
              ["Count in one whole", "数一个整体"],
              [`1 holds ${d} parts of $${fr(1, d)}$.`, `1 里面有 ${d} 个 $${fr(1, d)}$。`],
            ],
            [
              ["Multiply", "相乘"],
              [`${w} wholes hold ${w} times as many.`, `${w} 个整体就有 ${w} 倍那么多。`],
              [`${w} \\div ${fr(1, d)} = ${w} \\times ${d} = ${w * d}`],
            ],
          ],
          countBack(w * d, d, w),
          [
            [qf(w, d), `That divides ${w} by ${d}, which is far too small.`, `这是用 ${w} 除以 ${d}，太小了。`],
            [w + d, "That adds instead of multiplying.", "这是相加了，没有相乘。"],
            [qf(d, w), `That divides ${d} by ${w}.`, `这是用 ${d} 除以 ${w}。`],
          ],
        );
      },
      groupedBarsFigure(3, 6, 1),
    ),
    point(
      "unit-fraction-divisors-in-word-problems",
      ["Word problems", "应用题"],
      [
        "6 pounds of nuts go into bags of $\\frac{1}{3}$ pound. That fills $6 \\div \\frac{1}{3} = 6 \\times 3 = 18$ bags.\n\nCheck: 18 bags of $\\frac{1}{3}$ pound hold $\\frac{18}{3} = 6$ pounds.\n\n> **Watch out.** Divide by the size of one bag. Dividing by 3 gives 2 bags, which is far too few.",
        "6 磅坚果，每袋装 $\\frac{1}{3}$ 磅。能装 $6 \\div \\frac{1}{3} = 6 \\times 3 = 18$ 袋。\n\n检验：18 袋，每袋 $\\frac{1}{3}$ 磅，一共 $\\frac{18}{3} = 6$ 磅。\n\n> **注意。** 要除以每袋的量。除以 3 只得到 2 袋，太少了。",
      ],
      (rng) => {
        const w = rng.int(2, 15);
        const d = rng.int(2, 10);
        return answered(
          servingStory(rng, w, fr(1, d)),
          w * d,
          [
            [
              ["Choose the operation", "选择运算"],
              ["Divide the total by the size of one piece.", "用总量除以每份的量。"],
              [`${w} \\div ${fr(1, d)}`],
            ],
            [
              ["Multiply by the bottom", "乘分母"],
              [`Each whole gives ${d} pieces.`, `每个整体能分 ${d} 份。`],
              [`${w} \\times ${d} = ${w * d}`],
            ],
          ],
          countBack(w * d, d, w),
          [
            [qf(w, d), `That divides ${w} by ${d}, which is far too small.`, `这是用 ${w} 除以 ${d}，太小了。`],
            [w + d, "That adds instead of multiplying.", "这是相加了，没有相乘。"],
            [d, "That counts the pieces from one whole only.", "这只算了一个整体能分的份数。"],
          ],
        );
      },
      groupedBarsFigure(6, 3, 1),
    ),
  ],
  t(
    "A 7 foot board is cut into blocks $\\frac{1}{4}$ foot long. Each foot gives 4 blocks, so $7 \\div \\frac{1}{4} = 7 \\times 4 = 28$ blocks.\n\nCheck: $28 \\times \\frac{1}{4} = \\frac{28}{4} = 7$.\n\nIn this lesson we divide a whole number by a unit fraction without a model.",
    "一块 7 英尺长的木板切成每块 $\\frac{1}{4}$ 英尺长。每英尺能切 4 块，所以 $7 \\div \\frac{1}{4} = 7 \\times 4 = 28$ 块。\n\n检验：$28 \\times \\frac{1}{4} = \\frac{28}{4} = 7$。\n\n本课我们不用模型，直接计算整数除以单位分数。",
  ),
);

/** shareStory is a word problem sharing a/d of something among n people. */
function shareStory(rng: Rng, fTex: string, n: number): Pair {
  const name = rng.pick(names);
  return rng.pick<Pair>([
    [
      `${name} shares $${fTex}$ of a pan of brownies equally among ${n} friends. What fraction of the whole pan does each friend get?`,
      `${name} 把一盘布朗尼的 $${fTex}$ 平均分给 ${n} 个朋友。每个朋友分到整盘的几分之几？`,
    ],
    [
      `$${fTex}$ of a garden is split into ${n} equal beds. What fraction of the whole garden is each bed?`,
      `把菜园的 $${fTex}$ 平均分成 ${n} 块苗床。每块苗床占整个菜园的几分之几？`,
    ],
    [
      `${name} has $${fTex}$ pound of cheese and cuts it into ${n} equal pieces. How many pounds is each piece?`,
      `${name} 有 $${fTex}$ 磅奶酪，平均切成 ${n} 块。每块重多少磅？`,
    ],
  ]);
}

export const dividingUnitFractionsByWholeNumbersUsingModels = topic(
  "dividing-unit-fractions-by-whole-numbers-using-models",
  t("Dividing Unit Fractions by Whole Numbers Using Models", "用模型做单位分数除以整数"),
  t(
    "To find 1/3 ÷ 2, split 1/3 of a bar into 2 equal pieces. Cutting the whole bar the same way makes 3 × 2 = 6 pieces, so each piece is 1/6 of the bar: 1/3 ÷ 2 = 1/6.",
    "计算 1/3 ÷ 2，把长条的 1/3 平均分成 2 块。如果整个长条都这样切，会得到 3 × 2 = 6 块，所以每块是长条的 1/6：1/3 ÷ 2 = 1/6。",
  ),
  ["interpreting-fraction-division-using-area-models"],
  ["5.NF.B.7a"],
  [
    point(
      "reading-a-share-from-the-model",
      ["Reading a share from the model", "从模型中读出每份"],
      [
        "For $\\frac{1}{4} \\div 3$, one fourth of the bar is cut into 3 pieces. Cutting every fourth that way makes $4 \\times 3 = 12$ pieces, so the darker piece is $\\frac{1}{12}$.\n\nCheck: 3 pieces of $\\frac{1}{12}$ make $\\frac{3}{12} = \\frac{1}{4}$.\n\n> **Watch out.** The piece is part of the whole bar. It is $\\frac{1}{12}$, not $\\frac{1}{3}$.",
        "计算 $\\frac{1}{4} \\div 3$，把长条的四分之一切成 3 块。每个四分之一都这样切，就有 $4 \\times 3 = 12$ 块，所以颜色最深的一块是 $\\frac{1}{12}$。\n\n检验：3 块 $\\frac{1}{12}$ 是 $\\frac{3}{12} = \\frac{1}{4}$。\n\n> **注意。** 这一块是整个长条的一部分。它是 $\\frac{1}{12}$，不是 $\\frac{1}{3}$。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const n = rng.int(2, 6);
        return answered(
          [
            `The model shows $${fr(1, d)} \\div ${n}$. What fraction of the whole bar is the darker piece?`,
            `模型表示 $${fr(1, d)} \\div ${n}$。颜色最深的一块是整个长条的几分之几？`,
          ],
          qf(1, d * n),
          [
            [
              ["Find the shaded part", "找涂色部分"],
              [`$${fr(1, d)}$ of the bar is cut into ${n} pieces.`, `长条的 $${fr(1, d)}$ 被切成 ${n} 块。`],
            ],
            [
              ["Cut the whole bar", "切整个长条"],
              [`Every part cut the same way makes ${d * n} pieces.`, `每一份都这样切，一共有 ${d * n} 块。`],
              [`${d} \\times ${n} = ${d * n}`],
            ],
            [
              ["Name one piece", "说出一块"],
              ["One piece is 1 of all the pieces.", "一块是所有块中的 1 块。"],
              [`${fr(1, d)} \\div ${n} = ${fr(1, d * n)}`],
            ],
          ],
          shareBack(d, n),
          [
            [qf(n, d), "That multiplies. A share is smaller than the part, not bigger.", "这是做成乘法了。每份比原来那部分小，不会更大。"],
            [qf(1, d + n), "That adds the numbers.", "这是把两个数相加了。"],
            [
              qf(1, n),
              `That counts the pieces in the shaded part only, not in the whole bar.`,
              "这只数了涂色部分里的块数，没有数整个长条。",
            ],
          ],
          { form: "fraction", figure: splitPartsFigure(1, d, n) },
        );
      },
      splitPartsFigure(1, 4, 3),
    ),
    point(
      "sharing-a-unit-fraction-with-models",
      ["Sharing a part", "平均分一部分"],
      [
        "$\\frac{1}{2}$ of a pizza is shared by 4 people. Cutting the whole pizza the same way makes $2 \\times 4 = 8$ pieces, so each gets $\\frac{1}{8}$.\n\nCheck: 4 pieces of $\\frac{1}{8}$ make $\\frac{4}{8} = \\frac{1}{2}$.\n\n> **Watch out.** Each share is smaller than $\\frac{1}{2}$. An answer like 2 is far too big.",
        "$\\frac{1}{2}$ 个比萨饼平均分给 4 个人。整个比萨饼都这样切，就有 $2 \\times 4 = 8$ 块，所以每人分到 $\\frac{1}{8}$。\n\n检验：4 块 $\\frac{1}{8}$ 是 $\\frac{4}{8} = \\frac{1}{2}$。\n\n> **注意。** 每份都比 $\\frac{1}{2}$ 小。得到 2 这样的结果就太大了。",
      ],
      (rng) => {
        const d = rng.int(2, 6);
        const n = rng.int(2, 6);
        return answered(
          shareStory(rng, fr(1, d), n),
          qf(1, d * n),
          [
            [
              ["Choose the operation", "选择运算"],
              [`Sharing among ${n} means divide by ${n}.`, `平均分给 ${n} 份，用除以 ${n}。`],
              [`${fr(1, d)} \\div ${n}`],
            ],
            [
              ["Cut the whole", "切整体"],
              [`Cutting the whole the same way makes ${d * n} pieces.`, `整体都这样切，一共有 ${d * n} 块。`],
              [`${d} \\times ${n} = ${d * n}`],
            ],
          ],
          shareBack(d, n),
          [
            [qf(n, d), "That multiplies. A share is smaller than the part, not bigger.", "这是做成乘法了。每份比原来那部分小，不会更大。"],
            [qf(1, d + n), "That adds the numbers.", "这是把两个数相加了。"],
            [qf(d, n), `That divides ${d} by ${n}.`, `这是用 ${d} 除以 ${n}。`],
          ],
          { form: "fraction", figure: splitPartsFigure(1, d, n) },
        );
      },
      splitPartsFigure(1, 2, 4),
    ),
  ],
  t(
    "Half a pizza is left, and 3 friends share it. Cut the half into 3 pieces. The whole pizza would hold $2 \\times 3 = 6$ such pieces, so each friend gets $\\frac{1}{6}$.\n\nCheck: 3 pieces of $\\frac{1}{6}$ make $\\frac{3}{6} = \\frac{1}{2}$.\n\nIn this lesson we share a unit fraction among a whole number of people with models.",
    "剩下半个比萨饼，3 个朋友平分。把这一半切成 3 块。整个比萨饼能切成 $2 \\times 3 = 6$ 块这样的，所以每人分到 $\\frac{1}{6}$。\n\n检验：3 块 $\\frac{1}{6}$ 是 $\\frac{3}{6} = \\frac{1}{2}$。\n\n本课我们用模型把单位分数平均分成几份。",
  ),
);

export const dividingUnitFractionsByWholeNumbers = topic(
  "dividing-unit-fractions-by-whole-numbers",
  t("Dividing Unit Fractions by Whole Numbers", "单位分数除以整数"),
  t(
    "Dividing 1/d into n equal shares makes each share n times smaller, so 1/d ÷ n = 1/(d × n): 1/5 ÷ 3 = 1/15. Check: 3 × 1/15 = 3/15 = 1/5.",
    "把 1/d 平均分成 n 份，每份是它的 n 分之一，所以 1/d ÷ n = 1/(d × n)：1/5 ÷ 3 = 1/15。检验：3 × 1/15 = 3/15 = 1/5。",
  ),
  ["dividing-unit-fractions-by-whole-numbers-using-models"],
  ["5.NF.B.7a"],
  [
    point(
      "unit-fraction-divided-by-whole-number",
      ["Finding the quotient", "求商"],
      [
        "$\\frac{1}{8} \\div 4 = \\frac{1}{8 \\times 4} = \\frac{1}{32}$. Each eighth is cut into 4 smaller parts.\n\nCheck: $4 \\times \\frac{1}{32} = \\frac{4}{32} = \\frac{1}{8}$.\n\n> **Watch out.** The answer is smaller than $\\frac{1}{8}$. Dividing 8 by 4 to get $\\frac{1}{2}$ makes it bigger.",
        "$\\frac{1}{8} \\div 4 = \\frac{1}{8 \\times 4} = \\frac{1}{32}$。每个八分之一切成 4 个更小的份。\n\n检验：$4 \\times \\frac{1}{32} = \\frac{4}{32} = \\frac{1}{8}$。\n\n> **注意。** 结果比 $\\frac{1}{8}$ 小。用 8 除以 4 得到 $\\frac{1}{2}$，反而变大了。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const n = rng.int(2, 9);
        return answered(
          [`Find $${fr(1, d)} \\div ${n}$.`, `计算 $${fr(1, d)} \\div ${n}$。`],
          qf(1, d * n),
          [
            [
              ["Cut each part", "把每份再切"],
              [`Each $${fr(1, d)}$ is cut into ${n} smaller parts.`, `每个 $${fr(1, d)}$ 再切成 ${n} 小份。`],
            ],
            [
              ["Multiply the bottom", "分母相乘"],
              [`The whole now has ${d * n} parts.`, `整体现在有 ${d * n} 份。`],
              [`${fr(1, d)} \\div ${n} = ${fr(1, `${d} \\times ${n}`)} = ${fr(1, d * n)}`],
            ],
          ],
          [
            `Multiply back: $${n} \\times ${fr(1, d * n)} = ${fr(n, d * n)} = ${fr(1, d)}$.`,
            `乘回去：$${n} \\times ${fr(1, d * n)} = ${fr(n, d * n)} = ${fr(1, d)}$。`,
          ],
          [
            [
              qf(n, d),
              `That divides the bottom ${d} by ${n}, which makes the answer bigger.`,
              `这是用分母 ${d} 除以 ${n}，结果反而变大了。`,
            ],
            [qf(1, d + n), "That adds the numbers.", "这是把两个数相加了。"],
            [d * n, "That is the new bottom, not the fraction.", "这只是新的分母，不是分数。"],
          ],
          { form: "fraction", figure: splitPartsFigure(1, d, n) },
        );
      },
      splitPartsFigure(1, 8, 4),
    ),
    point(
      "missing-numbers-in-unit-fraction-division",
      ["Finding a missing number", "求未知数"],
      [
        "For $\\frac{1}{6} \\div \\square = \\frac{1}{42}$, ask what times 6 makes 42. $6 \\times 7 = 42$, so the box is 7.\n\nCheck: $\\frac{1}{6} \\div 7 = \\frac{1}{42}$.\n\n> **Watch out.** The box is not 42. 42 is the new bottom.",
        "对于 $\\frac{1}{6} \\div \\square = \\frac{1}{42}$，想一想：6 乘几等于 42？$6 \\times 7 = 42$，所以方框里是 7。\n\n检验：$\\frac{1}{6} \\div 7 = \\frac{1}{42}$。\n\n> **注意。** 方框里不是 42。42 是新的分母。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const n = rng.int(2, 9);
        return answered(
          [
            `Find the missing number: $$${fr(1, d)} \\div \\square = ${fr(1, d * n)}$$`,
            `求方框中的数：$$${fr(1, d)} \\div \\square = ${fr(1, d * n)}$$`,
          ],
          n,
          [
            [
              ["Compare the bottoms", "比较分母"],
              [`Dividing multiplies the bottom ${d} by the box.`, `除以方框里的数，就是用它乘分母 ${d}。`],
              [`${d} \\times \\square = ${d * n}`],
            ],
            [["Divide", "做除法"], [`Find what ${d} is multiplied by.`, `求 ${d} 乘几等于 ${d * n}。`], [`${d * n} \\div ${d} = ${n}`]],
          ],
          [`Put it back: $${fr(1, d)} \\div ${n} = ${fr(1, d * n)}$.`, `代回去：$${fr(1, d)} \\div ${n} = ${fr(1, d * n)}$。`],
          [
            [d * n, "That is the new bottom, not the number you divide by.", "这是新的分母，不是除数。"],
            [d, "That is the old bottom.", "这是原来的分母。"],
            [d * n - d, "That subtracts instead of dividing.", "这是做成减法了。"],
          ],
          { figure: splitPartsFigure(1, d, n) },
        );
      },
      splitPartsFigure(1, 6, 7),
    ),
  ],
  t(
    "$\\frac{1}{5}$ of a cake is shared by 3 kids. Each gets $\\frac{1}{5} \\div 3 = \\frac{1}{15}$ of the cake.\n\nCheck: $3 \\times \\frac{1}{15} = \\frac{3}{15} = \\frac{1}{5}$.\n\nIn this lesson we divide a unit fraction by a whole number without a model.",
    "把一个蛋糕的 $\\frac{1}{5}$ 平均分给 3 个孩子。每人分到 $\\frac{1}{5} \\div 3 = \\frac{1}{15}$ 个蛋糕。\n\n检验：$3 \\times \\frac{1}{15} = \\frac{3}{15} = \\frac{1}{5}$。\n\n本课我们不用模型，直接计算单位分数除以整数。",
  ),
);

/** multiplyBack checks a quotient by multiplying it by the divisor, as LaTeX after a label. */
const multiplyBack = (product: string): Pair => [`Multiply back: $${product}$.`, `乘回去：$${product}$。`];

export const reciprocals = topic(
  "reciprocals",
  t("Reciprocals", "倒数"),
  t(
    "Two numbers whose product is 1 are reciprocals. The reciprocal of a/b is b/a, since a/b × b/a = 1: the reciprocal of 3/5 is 5/3, the reciprocal of 7 is 1/7, and the reciprocal of 2 1/4 = 9/4 is 4/9. Zero has no reciprocal.",
    "乘积是 1 的两个数互为倒数。a/b 的倒数是 b/a，因为 a/b × b/a = 1：3/5 的倒数是 5/3，7 的倒数是 1/7，2 1/4 = 9/4 的倒数是 4/9。0 没有倒数。",
  ),
  ["multiplying-fractions", "converting-mixed-numbers-to-improper-fractions"],
  ["6.NS.A.1"],
  [
    point(
      "reciprocals-of-fractions",
      ["Reciprocals of fractions", "分数的倒数"],
      [
        "The reciprocal of $\\frac{3}{8}$ is $\\frac{8}{3}$. Swap the top and the bottom.\n\nCheck: $\\frac{3}{8} \\times \\frac{8}{3} = \\frac{24}{24} = 1$.\n\n> **Watch out.** Swap the top and the bottom. Writing $\\frac{1}{8}$ only changes the top.",
        "$\\frac{3}{8}$ 的倒数是 $\\frac{8}{3}$。把分子和分母交换位置。\n\n检验：$\\frac{3}{8} \\times \\frac{8}{3} = \\frac{24}{24} = 1$。\n\n> **注意。** 分子和分母要交换。写成 $\\frac{1}{8}$ 只改了分子。",
      ],
      (rng) => {
        let [a, b] = properFraction(rng, 15, 3);
        while (a < 2) [a, b] = properFraction(rng, 15, 3);
        const [n, d] = rng.bool() ? [b, a] : [a, b];
        return answered(
          [`What is the reciprocal of $${fr(n, d)}$?`, `$${fr(n, d)}$ 的倒数是多少？`],
          qf(d, n),
          [
            [
              ["Swap", "交换"],
              [`The top ${n} goes to the bottom, and the bottom ${d} goes to the top.`, `分子 ${n} 换到下面，分母 ${d} 换到上面。`],
              [`${fr(n, d)} \\to ${fr(d, n)}`],
            ],
          ],
          [
            `Multiply: $${fr(n, d)} \\times ${fr(d, n)} = ${fr(n * d, n * d)} = 1$.`,
            `相乘：$${fr(n, d)} \\times ${fr(d, n)} = ${fr(n * d, n * d)} = 1$。`,
          ],
          [
            [qf(n, d), "That is the same number. It is not flipped.", "这还是原来的数，没有倒过来。"],
            [qf(1, d), "That only changes the top to 1.", "这只是把分子改成了 1。"],
            [n * d, "That multiplies the top and the bottom.", "这是把分子和分母相乘了。"],
          ],
          { form: "fraction", ...(n < d && { figure: groupedBarsFigure(1, d, n) }) },
        );
      },
      groupedBarsFigure(1, 8, 3),
    ),
    point(
      "reciprocals-of-whole-and-mixed-numbers",
      ["Reciprocals of whole numbers and mixed numbers", "整数和带分数的倒数"],
      [
        "$1\\frac{2}{3} = \\frac{5}{3}$, so its reciprocal is $\\frac{3}{5}$. A whole number like 4 is $\\frac{4}{1}$, so its reciprocal is $\\frac{1}{4}$.\n\nCheck: $\\frac{5}{3} \\times \\frac{3}{5} = \\frac{15}{15} = 1$.\n\n> **Watch out.** Change the mixed number to a fraction first. $1\\frac{3}{2}$ is not the reciprocal.",
        "$1\\frac{2}{3} = \\frac{5}{3}$，所以它的倒数是 $\\frac{3}{5}$。整数 4 可以写成 $\\frac{4}{1}$，所以它的倒数是 $\\frac{1}{4}$。\n\n检验：$\\frac{5}{3} \\times \\frac{3}{5} = \\frac{15}{15} = 1$。\n\n> **注意。** 带分数要先化成假分数。$1\\frac{3}{2}$ 不是它的倒数。",
      ],
      (rng) => {
        if (rng.bool()) {
          const n = rng.int(2, 12);
          return answered(
            [`What is the reciprocal of ${n}?`, `${n} 的倒数是多少？`],
            qf(1, n),
            [
              [["Write a fraction", "写成分数"], [`${n} is ${n} wholes.`, `${n} 就是 ${n} 个整体。`], [`${n} = ${fr(n, 1)}`]],
              [["Swap", "交换"], ["Swap the top and the bottom.", "交换分子和分母。"], [`${fr(n, 1)} \\to ${fr(1, n)}`]],
            ],
            [`Multiply: $${n} \\times ${fr(1, n)} = ${fr(n, n)} = 1$.`, `相乘：$${n} \\times ${fr(1, n)} = ${fr(n, n)} = 1$。`],
            [
              [n, "That is the same number. It is not flipped.", "这还是原来的数，没有倒过来。"],
              [qf(n - 1, n), `That is what is left after taking $${fr(1, n)}$ from 1.`, `这是 1 减去 $${fr(1, n)}$ 剩下的部分。`],
              [1, `That writes ${n} on the top and the bottom, which is 1.`, `这是分子分母都写 ${n}，等于 1。`],
            ],
            { form: "fraction", figure: barFigure(n, 1) },
          );
        }
        const w = rng.int(1, 4);
        const [a, d] = properFraction(rng, 8, 2);
        const top = w * d + a;
        return answered(
          [`What is the reciprocal of $${mx(w, a, d)}$?`, `$${mx(w, a, d)}$ 的倒数是多少？`],
          qf(d, top),
          [
            improperStep([w, a, d]),
            [["Swap", "交换"], ["Swap the top and the bottom.", "交换分子和分母。"], [`${fr(top, d)} \\to ${fr(d, top)}`]],
          ],
          [
            `Multiply: $${fr(top, d)} \\times ${fr(d, top)} = ${fr(top * d, top * d)} = 1$.`,
            `相乘：$${fr(top, d)} \\times ${fr(d, top)} = ${fr(top * d, top * d)} = 1$。`,
          ],
          [
            [
              mixedValue(w, d, a),
              `That flips only the fraction part to get $${mx(w, d, a)}$.`,
              `这只把分数部分倒过来，得到 $${mx(w, d, a)}$。`,
            ],
            [qf(d, a), `That flips $${fr(a, d)}$ and drops the ${w}.`, `这只把 $${fr(a, d)}$ 倒过来，丢掉了 ${w}。`],
            [qf(top, d), "That is the same number written as a fraction.", "这只是把原来的数写成了假分数。"],
          ],
          { form: "fraction", figure: barFigure(d, top, w + 1) },
        );
      },
      barFigure(3, 5, 2),
    ),
  ],
  t(
    "Ana turns a fraction card upside down, and $\\frac{2}{5}$ becomes $\\frac{5}{2}$. These two numbers are reciprocals, because $\\frac{2}{5} \\times \\frac{5}{2} = \\frac{10}{10} = 1$.\n\nCheck: 1 whole is 5 fifths, and groups of 2 fifths make $\\frac{5}{2}$ groups.\n\nIn this lesson we find the reciprocals of fractions, whole numbers and mixed numbers.",
    "安娜把一张分数卡片倒过来，$\\frac{2}{5}$ 就变成了 $\\frac{5}{2}$。这两个数互为倒数，因为 $\\frac{2}{5} \\times \\frac{5}{2} = \\frac{10}{10} = 1$。\n\n检验：1 个整体是 5 个五分之一，每 2 个一组，有 $\\frac{5}{2}$ 组。\n\n本课我们求分数、整数和带分数的倒数。",
  ),
);

export const dividingWholeNumbersByFractionsUsingModelsWholeNumberResults = topic(
  "dividing-whole-numbers-by-fractions-using-models-whole-number-results",
  t("Dividing Whole Numbers by Fractions Using Models: Whole Number Results", "用模型做整数除以分数：商是整数"),
  t(
    "To find 4 ÷ 2/3, cut 4 bars into thirds (12 thirds) and group them in twos: there are 12 ÷ 2 = 6 groups, so 4 ÷ 2/3 = 6.",
    "计算 4 ÷ 2/3，把 4 个长条都分成三份（共 12 个三分之一），每 2 份分成一组：一共 12 ÷ 2 = 6 组，所以 4 ÷ 2/3 = 6。",
  ),
  ["dividing-whole-numbers-by-unit-fractions", "reciprocals"],
  ["6.NS.A.1"],
  [
    point(
      "counting-groups-in-a-model",
      ["Counting groups in the model", "数模型中的组数"],
      [
        "For $3 \\div \\frac{3}{4}$, cut 3 bars into fourths: $3 \\times 4 = 12$ fourths. Make groups of 3 fourths: $12 \\div 3 = 4$ groups.\n\nCheck: $4 \\times \\frac{3}{4} = \\frac{12}{4} = 3$.\n\n> **Watch out.** Count the groups, not the small parts. 12 is the number of fourths.",
        "计算 $3 \\div \\frac{3}{4}$，把 3 个长条都分成四份：$3 \\times 4 = 12$ 个四分之一。每 3 个四分之一一组：$12 \\div 3 = 4$ 组。\n\n检验：$4 \\times \\frac{3}{4} = \\frac{12}{4} = 3$。\n\n> **注意。** 要数组数，不是数小份。12 是四分之一的个数。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(3, 8);
          const a = rng.int(2, d - 1);
          const w = rng.int(1, 8);
          if (gcd(a, d) !== 1 || (w * d) % a !== 0) continue;
          const q = (w * d) / a;
          return answered(
            [
              `Each group of colored parts is $${fr(a, d)}$. Use the model to find $${w} \\div ${fr(a, d)}$.`,
              `每组同色的部分是 $${fr(a, d)}$。利用模型计算 $${w} \\div ${fr(a, d)}$。`,
            ],
            q,
            [
              [
                ["Count the small parts", "数小份"],
                [`Each bar has ${d} parts of $${fr(1, d)}$.`, `每个长条有 ${d} 个 $${fr(1, d)}$。`],
                [`${w} \\times ${d} = ${w * d}`],
              ],
              [["Make groups", "分组"], [`Each group is ${a} parts.`, `每 ${a} 份是一组。`], [`${w * d} \\div ${a} = ${q}`]],
            ],
            multiplyBack(`${q} \\times ${fr(a, d)} = ${fr(w * d, d)} = ${w}`),
            [
              [w * d, "That counts the small parts, not the groups.", "这是小份的个数，不是组数。"],
              [qf(w * a, d), `That multiplies ${w} by $${fr(a, d)}$ instead of dividing.`, `这是用 ${w} 乘 $${fr(a, d)}$，没有做除法。`],
              [w * a, `That multiplies ${w} by the top ${a}.`, `这是用 ${w} 乘分子 ${a}。`],
            ],
            { figure: groupedBarsFigure(w, d, a) },
          );
        }
      },
      groupedBarsFigure(3, 4, 3),
    ),
    point(
      "whole-number-groups-in-word-problems",
      ["Word problems", "应用题"],
      [
        "6 cups of flour, and each batch uses $\\frac{3}{4}$ cup. 6 cups are $6 \\times 4 = 24$ fourths, and each batch uses 3 of them: $24 \\div 3 = 8$ batches.\n\nCheck: $8 \\times \\frac{3}{4} = \\frac{24}{4} = 6$ cups.\n\n> **Watch out.** Divide by the size of one batch. $6 \\times \\frac{3}{4}$ is too small.",
        "6 杯面粉，每批用 $\\frac{3}{4}$ 杯。6 杯是 $6 \\times 4 = 24$ 个四分之一，每批用 3 个：$24 \\div 3 = 8$ 批。\n\n检验：$8 \\times \\frac{3}{4} = \\frac{24}{4} = 6$ 杯。\n\n> **注意。** 要除以每批的量。$6 \\times \\frac{3}{4}$ 就太小了。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(3, 8);
          const a = rng.int(2, d - 1);
          const w = rng.int(2, 6);
          if (gcd(a, d) !== 1 || (w * d) % a !== 0) continue;
          const q = (w * d) / a;
          return answered(
            servingStory(rng, w, fr(a, d)),
            q,
            [
              [
                ["Count the small parts", "数小份"],
                [`${w} is ${w * d} parts of $${fr(1, d)}$.`, `${w} 是 ${w * d} 个 $${fr(1, d)}$。`],
                [`${w} \\times ${d} = ${w * d}`],
              ],
              [["Make groups", "分组"], [`Each one uses ${a} parts.`, `每份用 ${a} 个。`], [`${w * d} \\div ${a} = ${q}`]],
            ],
            multiplyBack(`${q} \\times ${fr(a, d)} = ${fr(w * d, d)} = ${w}`),
            [
              [w * d, "That counts the small parts, not the groups.", "这是小份的个数，不是份数。"],
              [qf(w * a, d), `That multiplies ${w} by $${fr(a, d)}$ instead of dividing.`, `这是用 ${w} 乘 $${fr(a, d)}$，没有做除法。`],
              [q + 1, "That is one too many.", "多算了一份。"],
            ],
            { figure: groupedBarsFigure(w, d, a) },
          );
        }
      },
      groupedBarsFigure(6, 4, 3),
    ),
  ],
  t(
    "Sam has 4 pizzas. Each kid eats $\\frac{2}{3}$ of a pizza. The pizzas make $4 \\times 3 = 12$ thirds, and each kid eats 2 of them. So $4 \\div \\frac{2}{3} = 6$ kids can eat.\n\nCheck: $6 \\times \\frac{2}{3} = \\frac{12}{3} = 4$ pizzas.\n\nIn this lesson we use bar models to divide a whole number by a fraction when the answer is a whole number.",
    "萨姆有 4 个比萨饼，每个孩子吃 $\\frac{2}{3}$ 个。这些比萨饼一共是 $4 \\times 3 = 12$ 个三分之一，每个孩子吃 2 个。所以 $4 \\div \\frac{2}{3} = 6$，够 6 个孩子吃。\n\n检验：$6 \\times \\frac{2}{3} = \\frac{12}{3} = 4$ 个比萨饼。\n\n本课我们用长条模型做整数除以分数，商是整数。",
  ),
);

export const dividingWholeNumbersByFractionsUsingModelsFractionalResults = topic(
  "dividing-whole-numbers-by-fractions-using-models-fractional-results",
  t("Dividing Whole Numbers by Fractions Using Models: Fractional Results", "用模型做整数除以分数：商是分数"),
  t(
    "When the groups do not come out even, the last group is a fraction of a group. 2 ÷ 3/4: 2 bars hold 8 fourths, which make 2 full groups of 3 fourths and 2 fourths more. The 2 fourths are 2/3 of a group, so 2 ÷ 3/4 = 2 2/3.",
    "如果分组后不能正好分完，最后一组只是一组的几分之几。2 ÷ 3/4：2 个长条共有 8 个四分之一，可以分成 2 个整组（每组 3 个），还剩 2 个四分之一。这 2 个是一组的 2/3，所以 2 ÷ 3/4 = 2 2/3。",
  ),
  ["dividing-whole-numbers-by-fractions-using-models-whole-number-results"],
  ["6.NS.A.1"],
  [
    point(
      "partial-groups-in-a-model",
      ["Groups and a part of a group", "整组和不满一组的部分"],
      [
        "For $3 \\div \\frac{2}{5}$: 3 bars are 15 fifths. Groups of 2 make 7 groups, with 1 fifth left. That 1 is $\\frac{1}{2}$ of a group, so the answer is $7\\frac{1}{2}$.\n\nCheck: $\\frac{15}{2} \\times \\frac{2}{5} = \\frac{30}{10} = 3$.\n\n> **Watch out.** The leftover is part of a group. Write it over the group size 2, not over 5.",
        "计算 $3 \\div \\frac{2}{5}$：3 个长条是 15 个五分之一。每 2 个一组，分成 7 组，还剩 1 个。这 1 个是一组的 $\\frac{1}{2}$，所以结果是 $7\\frac{1}{2}$。\n\n检验：$\\frac{15}{2} \\times \\frac{2}{5} = \\frac{30}{10} = 3$。\n\n> **注意。** 剩下的是一组的一部分，要用每组的份数 2 作分母，不是 5。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(3, 8);
          const a = rng.int(2, d - 1);
          const w = rng.int(1, 4);
          if (gcd(a, d) !== 1 || (w * d) % a === 0) continue;
          const full = Math.floor((w * d) / a);
          const rest = (w * d) % a;
          const v = qf(w * d, a);
          return answered(
            [
              `Each group of colored parts is $${fr(a, d)}$. Use the model to find $${w} \\div ${fr(a, d)}$.`,
              `每组同色的部分是 $${fr(a, d)}$。利用模型计算 $${w} \\div ${fr(a, d)}$。`,
            ],
            v,
            [
              [
                ["Count the small parts", "数小份"],
                [`Each bar has ${d} parts of $${fr(1, d)}$.`, `每个长条有 ${d} 个 $${fr(1, d)}$。`],
                [`${w} \\times ${d} = ${w * d}`],
              ],
              [
                ["Make groups", "分组"],
                [`Groups of ${a} use up all but ${rest}.`, `每 ${a} 个一组，最后剩 ${rest} 个。`],
                [`${w * d} = ${full} \\times ${a} + ${rest}`],
              ],
              [
                ["Name the leftover", "说出剩下的部分"],
                [`${rest} out of a group of ${a} is $${fr(rest, a)}$ of a group.`, `${rest} 个是一组 ${a} 个的 $${fr(rest, a)}$。`],
                [`${w} \\div ${fr(a, d)} = ${mq(v)}`],
              ],
            ],
            multiplyBack(`${fr(w * d, a)} \\times ${fr(a, d)} = ${fr(w * d * a, a * d)} = ${w}`),
            [
              [full, "That drops the part of a group that is left.", "这里丢掉了剩下的不满一组的部分。"],
              [
                mixedValue(full, rest, d),
                `That writes the leftover over ${d}, not over the group size ${a}.`,
                `这是把剩下的部分写成了以 ${d} 为分母，应该以每组的份数 ${a} 为分母。`,
              ],
              [qf(w * a, d), `That multiplies ${w} by $${fr(a, d)}$ instead of dividing.`, `这是用 ${w} 乘 $${fr(a, d)}$，没有做除法。`],
            ],
            { form: "mixed", figure: groupedBarsFigure(w, d, a) },
          );
        }
      },
      groupedBarsFigure(3, 5, 2),
    ),
    point(
      "partial-groups-in-word-problems",
      ["Word problems", "应用题"],
      [
        "5 yards of fabric are cut into pieces $\\frac{2}{3}$ yard long. 5 yards are 15 thirds: 7 pieces of 2 thirds, and 1 third left. That is half a piece, so $5 \\div \\frac{2}{3} = 7\\frac{1}{2}$.\n\nCheck: $\\frac{15}{2} \\times \\frac{2}{3} = \\frac{30}{6} = 5$.\n\n> **Watch out.** The question counts the part of a piece too. Do not stop at 7.",
        "5 码布剪成每块 $\\frac{2}{3}$ 码长。5 码是 15 个三分之一：能剪 7 块（每块 2 个三分之一），还剩 1 个三分之一。这是半块，所以 $5 \\div \\frac{2}{3} = 7\\frac{1}{2}$。\n\n检验：$\\frac{15}{2} \\times \\frac{2}{3} = \\frac{30}{6} = 5$。\n\n> **注意。** 题目把不满一块的部分也算进去，不要只答 7。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(3, 8);
          const a = rng.int(2, d - 1);
          const w = rng.int(2, 6);
          if (gcd(a, d) !== 1 || (w * d) % a === 0) continue;
          const full = Math.floor((w * d) / a);
          const rest = (w * d) % a;
          const v = qf(w * d, a);
          return answered(
            servingStory(rng, w, fr(a, d), true),
            v,
            [
              [
                ["Count the small parts", "数小份"],
                [`${w} is ${w * d} parts of $${fr(1, d)}$.`, `${w} 是 ${w * d} 个 $${fr(1, d)}$。`],
                [`${w} \\times ${d} = ${w * d}`],
              ],
              [
                ["Make groups", "分组"],
                [`Groups of ${a} use up all but ${rest}.`, `每 ${a} 个一组，最后剩 ${rest} 个。`],
                [`${w * d} = ${full} \\times ${a} + ${rest}`],
              ],
              [
                ["Name the leftover", "说出剩下的部分"],
                [`${rest} out of ${a} is $${fr(rest, a)}$ of one more.`, `${rest} 个是 ${a} 个的 $${fr(rest, a)}$。`],
                [`${w} \\div ${fr(a, d)} = ${mq(v)}`],
              ],
            ],
            multiplyBack(`${fr(w * d, a)} \\times ${fr(a, d)} = ${fr(w * d * a, a * d)} = ${w}`),
            [
              [full, "That leaves out the part that is left over.", "这里漏掉了剩下的不满一份的部分。"],
              [full + 1, "That counts the last part as a full one.", "这是把最后不满的部分当成了完整的一份。"],
              [qf(w * a, d), `That multiplies ${w} by $${fr(a, d)}$ instead of dividing.`, `这是用 ${w} 乘 $${fr(a, d)}$，没有做除法。`],
            ],
            { form: "mixed", figure: groupedBarsFigure(w, d, a) },
          );
        }
      },
      groupedBarsFigure(5, 3, 2),
    ),
  ],
  t(
    "Lily makes bows. Each bow uses $\\frac{3}{4}$ meter of ribbon, and she has 2 meters. 2 meters are 8 fourths: 2 full bows use 6, and 2 fourths are left. That is $\\frac{2}{3}$ of a bow, so $2 \\div \\frac{3}{4} = 2\\frac{2}{3}$.\n\nCheck: $\\frac{8}{3} \\times \\frac{3}{4} = \\frac{24}{12} = 2$.\n\nIn this lesson we use models when the groups do not come out even.",
    "莉莉做蝴蝶结，每个用 $\\frac{3}{4}$ 米丝带，她有 2 米。2 米是 8 个四分之一：做 2 个完整的蝴蝶结用掉 6 个，还剩 2 个四分之一。这是一个蝴蝶结的 $\\frac{2}{3}$，所以 $2 \\div \\frac{3}{4} = 2\\frac{2}{3}$。\n\n检验：$\\frac{8}{3} \\times \\frac{3}{4} = \\frac{24}{12} = 2$。\n\n本课我们用模型解决分组后有剩余的除法。",
  ),
);

export const dividingWholeNumbersByFractions = topic(
  "dividing-whole-numbers-by-fractions",
  t("Dividing Whole Numbers by Fractions", "整数除以分数"),
  t(
    "To divide by a fraction, multiply by its reciprocal: n ÷ a/b = n × b/a. So 6 ÷ 4/5 = 6 × 5/4 = 30/4 = 7 1/2. This matches the models: 6 is 30 fifths, and 30 fifths make 30 ÷ 4 groups of 4 fifths.",
    "除以一个分数，等于乘它的倒数：n ÷ a/b = n × b/a。所以 6 ÷ 4/5 = 6 × 5/4 = 30/4 = 7 1/2。这与模型一致：6 是 30 个五分之一，每 4 个一组，共有 30 ÷ 4 组。",
  ),
  ["dividing-whole-numbers-by-fractions-using-models-fractional-results"],
  ["6.NS.A.1"],
  [
    point(
      "rewriting-division-as-multiplication",
      ["Rewriting as multiplication", "化成乘法"],
      [
        "$4 \\div \\frac{2}{5} = 4 \\times \\frac{5}{2}$. Keep 4, change $\\div$ to $\\times$, and flip $\\frac{2}{5}$.\n\nCheck: 4 is 20 fifths, and groups of 2 fifths make $20 \\div 2 = 10$. Also $4 \\times \\frac{5}{2} = \\frac{20}{2} = 10$.\n\n> **Watch out.** Flip only the number you divide by. Do not flip the 4.",
        "$4 \\div \\frac{2}{5} = 4 \\times \\frac{5}{2}$。4 不变，把 $\\div$ 改成 $\\times$，再把 $\\frac{2}{5}$ 倒过来。\n\n检验：4 是 20 个五分之一，每 2 个一组，有 $20 \\div 2 = 10$ 组。而 $4 \\times \\frac{5}{2} = \\frac{20}{2} = 10$。\n\n> **注意。** 只把除数倒过来，4 不要变。",
      ],
      (rng) => {
        const w = rng.int(2, 6);
        let [a, b] = properFraction(rng, 8, 3);
        while (a < 2) [a, b] = properFraction(rng, 8, 3);
        return pickedMath(
          rng,
          [`Which expression is equal to $${w} \\div ${fr(a, b)}$?`, `哪个算式等于 $${w} \\div ${fr(a, b)}$？`],
          `${w} \\times ${fr(b, a)}`,
          [
            [`${w} \\times ${fr(a, b)}`, "That forgets to flip the fraction.", "这里忘了把分数倒过来。"],
            [`${fr(1, w)} \\times ${fr(a, b)}`, `That flips ${w} instead of the fraction.`, `这是把 ${w} 倒过来了，应该倒过来的是分数。`],
            [
              `${fr(1, w)} \\times ${fr(b, a)}`,
              `That flips ${w} too. Only the number you divide by is flipped.`,
              `这把 ${w} 也倒过来了。只有除数要倒过来。`,
            ],
          ],
          [
            [
              ["Keep the first number", "被除数不变"],
              [`${w} stays as it is.`, `${w} 保持不变。`],
            ],
            [
              ["Flip the divisor", "除数变成倒数"],
              [`Change $\\div$ to $\\times$ and flip $${fr(a, b)}$.`, `把 $\\div$ 改成 $\\times$，再把 $${fr(a, b)}$ 倒过来。`],
              [`${w} \\div ${fr(a, b)} = ${w} \\times ${fr(b, a)}`],
            ],
          ],
          [
            `${w} is ${w * b} parts of $${fr(1, b)}$, and groups of ${a} make $${w * b} \\div ${a}$. That matches $${w} \\times ${fr(b, a)} = ${fr(w * b, a)}$.`,
            `${w} 是 ${w * b} 个 $${fr(1, b)}$，每 ${a} 个一组，有 $${w * b} \\div ${a}$ 组。这和 $${w} \\times ${fr(b, a)} = ${fr(w * b, a)}$ 一样。`,
          ],
          groupedBarsFigure(w, b, a),
        );
      },
      groupedBarsFigure(4, 5, 2),
    ),
    point(
      "whole-number-divided-by-fraction",
      ["Finding the quotient", "求商"],
      [
        "Ask how many $\\frac{3}{2}$ fit into 4. Flip the divisor and multiply: $4 \\div \\frac{3}{2} = 4 \\times \\frac{2}{3} = \\frac{8}{3} = 2\\frac{2}{3}$. So a little more than two of them fit.\n\nCheck: multiply back: $\\frac{8}{3} \\times \\frac{3}{2} = \\frac{24}{6} = 4$.\n\n> **Watch out.** Flip the fraction before you multiply. $4 \\times \\frac{3}{2} = 6$ is too big.",
        "问 4 里有几个 $\\frac{3}{2}$。把除数倒过来再乘：$4 \\div \\frac{3}{2} = 4 \\times \\frac{2}{3} = \\frac{8}{3} = 2\\frac{2}{3}$。所以 4 里有两个多一点。\n\n检验：乘回去：$\\frac{8}{3} \\times \\frac{3}{2} = \\frac{24}{6} = 4$。\n\n> **注意。** 先把分数倒过来再乘。$4 \\times \\frac{3}{2} = 6$ 太大了。",
      ],
      (rng) => {
        const w = rng.int(2, 20);
        const b = rng.int(2, 12);
        const a = coprimeTo(rng, b, 2, 2 * b);
        const v = qf(w * b, a);
        return answered(
          [`Find $${w} \\div ${fr(a, b)}$.`, `计算 $${w} \\div ${fr(a, b)}$。`],
          v,
          [
            [
              ["Flip the divisor", "除数变成倒数"],
              [`Dividing by $${fr(a, b)}$ is multiplying by $${fr(b, a)}$.`, `除以 $${fr(a, b)}$ 等于乘 $${fr(b, a)}$。`],
              [`${w} \\div ${fr(a, b)} = ${w} \\times ${fr(b, a)}`],
            ],
            [
              ["Multiply", "相乘"],
              [`${w} times ${b} is the top.`, `${w} 乘 ${b} 作分子。`],
              [`${w} \\times ${fr(b, a)} = ${fr(w * b, a)}`],
            ],
            ...tidy(w * b, a),
          ],
          multiplyBack(`${fr(w * b, a)} \\times ${fr(a, b)} = ${fr(w * b * a, a * b)} = ${w}`),
          [
            [qf(w * a, b), "That forgets to flip the fraction.", "这里忘了把分数倒过来。"],
            [qf(a, w * b), "That flips the answer upside down.", "这是把结果倒过来了。"],
            [w * b, `That multiplies by ${b} but forgets to divide by ${a}.`, `这里乘了 ${b}，但忘了除以 ${a}。`],
          ],
          { form: "mixed" },
        );
      },
      groupedBarsFigure(4, 2, 3),
    ),
  ],
  t(
    "Max has 6 meters of rope. He cuts pieces $\\frac{3}{4}$ meter long. $6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ pieces.\n\nCheck: $8 \\times \\frac{3}{4} = \\frac{24}{4} = 6$ meters.\n\nIn this lesson we divide a whole number by a fraction by multiplying by its reciprocal.",
    "马克斯有 6 米绳子，剪成每段 $\\frac{3}{4}$ 米。$6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ 段。\n\n检验：$8 \\times \\frac{3}{4} = \\frac{24}{4} = 6$ 米。\n\n本课我们用乘倒数的方法做整数除以分数。",
  ),
);

export const dividingFractionsByWholeNumbersUsingModels = topic(
  "dividing-fractions-by-whole-numbers-using-models",
  t("Dividing Fractions by Whole Numbers Using Models", "用模型做分数除以整数"),
  t(
    "To find 3/5 ÷ 2, split the shaded 3/5 of a bar into 2 equal rows. Cutting the whole bar the same way gives 5 × 2 = 10 pieces, and one share is 3 of them, so 3/5 ÷ 2 = 3/10.",
    "计算 3/5 ÷ 2，把长条中涂色的 3/5 平均分成 2 行。整个长条都这样切会得到 5 × 2 = 10 块，其中一份是 3 块，所以 3/5 ÷ 2 = 3/10。",
  ),
  ["dividing-unit-fractions-by-whole-numbers"],
  ["6.NS.A.1"],
  [
    point(
      "fraction-shares-from-models",
      ["Reading a share from the model", "从模型中读出每份"],
      [
        "For $\\frac{2}{3} \\div 4$, cut each third into 4 pieces. The bar has $3 \\times 4 = 12$ pieces, and one share is 2 of them: $\\frac{2}{12} = \\frac{1}{6}$.\n\nCheck: 4 shares of $\\frac{2}{12}$ make $\\frac{8}{12} = \\frac{2}{3}$.\n\n> **Watch out.** Count the pieces in the whole bar, not only in the shaded part.",
        "计算 $\\frac{2}{3} \\div 4$，把每个三分之一切成 4 块。整个长条有 $3 \\times 4 = 12$ 块，一份是其中 2 块：$\\frac{2}{12} = \\frac{1}{6}$。\n\n检验：4 份 $\\frac{2}{12}$ 是 $\\frac{8}{12} = \\frac{2}{3}$。\n\n> **注意。** 要数整个长条的块数，不能只数涂色部分。",
      ],
      (rng) => {
        let [a, d] = properFraction(rng, 8, 3);
        while (a < 2) [a, d] = properFraction(rng, 8, 3);
        const n = rng.int(2, d <= 6 ? 4 : 3);
        return answered(
          [
            `The model shows $${fr(a, d)} \\div ${n}$. What fraction of the whole bar is the darker part?`,
            `模型表示 $${fr(a, d)} \\div ${n}$。颜色最深的部分是整个长条的几分之几？`,
          ],
          qf(a, d * n),
          [
            [
              ["Count the pieces", "数块数"],
              [
                `Each $${fr(1, d)}$ is cut into ${n}, so the bar has ${d * n} pieces.`,
                `每个 $${fr(1, d)}$ 切成 ${n} 块，整个长条有 ${d * n} 块。`,
              ],
              [`${d} \\times ${n} = ${d * n}`],
            ],
            [
              ["Read one share", "读出一份"],
              [`One share is ${a} pieces.`, `一份是 ${a} 块。`],
              [`${fr(a, d)} \\div ${n} = ${simplified(a, d * n)}`],
            ],
          ],
          [
            `Put the shares back: ${n} shares of $${fr(a, d * n)}$ make $${fr(a * n, d * n)} = ${fr(a, d)}$.`,
            `把几份合起来：${n} 份 $${fr(a, d * n)}$ 是 $${fr(a * n, d * n)} = ${fr(a, d)}$。`,
          ],
          [
            [qf(a * n, d), "That multiplies instead of dividing.", "这是做成乘法了。"],
            [qf(1, d * n), `That is one piece, but a share has ${a} pieces.`, `这只是一块，一份有 ${a} 块。`],
            [qf(1, n), "That compares the share with the shaded part, not with the whole bar.", "这是和涂色部分比，不是和整个长条比。"],
          ],
          { form: "fraction", figure: splitPartsFigure(a, d, n) },
        );
      },
      splitPartsFigure(2, 3, 4),
    ),
    point(
      "sharing-fractions-evenly",
      ["When the top divides evenly", "分子能被整除时"],
      [
        "$\\frac{6}{7} \\div 3$: share 6 sevenths into 3 equal groups. Each group gets 2 sevenths, so the answer is $\\frac{2}{7}$.\n\nCheck: $3 \\times \\frac{2}{7} = \\frac{6}{7}$.\n\n> **Watch out.** Keep the bottom 7. The parts are still sevenths.",
        "$\\frac{6}{7} \\div 3$：把 6 个七分之一平均分成 3 组，每组 2 个七分之一，所以结果是 $\\frac{2}{7}$。\n\n检验：$3 \\times \\frac{2}{7} = \\frac{6}{7}$。\n\n> **注意。** 分母 7 不变，每份还是七分之一。",
      ],
      (rng) => {
        for (;;) {
          const d = rng.int(3, 12);
          const n = rng.int(2, Math.min(5, d - 1));
          const k = rng.int(1, Math.floor((d - 1) / n));
          if (k < 1 || gcd(k * n, d) !== 1) continue;
          const a = k * n;
          return answered(
            [`Use the model to find $${fr(a, d)} \\div ${n}$.`, `利用模型计算 $${fr(a, d)} \\div ${n}$。`],
            qf(k, d),
            [
              [
                ["Count the parts", "数份数"],
                [`There are ${a} parts of $${fr(1, d)}$.`, `一共有 ${a} 个 $${fr(1, d)}$。`],
              ],
              [
                ["Share them", "平均分"],
                [`Split them into ${n} equal groups.`, `把它们平均分成 ${n} 组。`],
                [`${a} \\div ${n} = ${k}`, `${fr(a, d)} \\div ${n} = ${fr(k, d)}`],
              ],
            ],
            multiplyBack(`${n} \\times ${fr(k, d)} = ${fr(a, d)}`),
            [
              [qf(a * n, d), "That multiplies the top instead of dividing.", "这是用分子乘，没有做除法。"],
              [
                qf(k, d * n),
                "That divides the top and also makes the parts smaller. That divides twice.",
                "这里分子除了，分母又乘了，等于除了两次。",
              ],
              [k, "That is the number of parts in each group, not the fraction.", "这只是每组的份数，不是分数。"],
            ],
            { form: "fraction", figure: barFigure(d, a) },
          );
        }
      },
      barFigure(7, 6),
    ),
  ],
  t(
    "Eva has $\\frac{3}{5}$ of a chocolate bar and shares it with her brother. Cut every fifth into 2: the bar has 10 pieces, and each child gets 3. So $\\frac{3}{5} \\div 2 = \\frac{3}{10}$.\n\nCheck: $\\frac{3}{10} + \\frac{3}{10} = \\frac{6}{10} = \\frac{3}{5}$.\n\nIn this lesson we use models to divide a fraction by a whole number.",
    "伊娃有 $\\frac{3}{5}$ 块巧克力，和弟弟平分。把每个五分之一都切成 2 块：整块巧克力有 10 小块，每人分到 3 小块。所以 $\\frac{3}{5} \\div 2 = \\frac{3}{10}$。\n\n检验：$\\frac{3}{10} + \\frac{3}{10} = \\frac{6}{10} = \\frac{3}{5}$。\n\n本课我们用模型做分数除以整数。",
  ),
);

export const dividingFractionsByWholeNumbers = topic(
  "dividing-fractions-by-whole-numbers",
  t("Dividing Fractions by Whole Numbers", "分数除以整数"),
  t(
    "Dividing by a whole number n is multiplying by its reciprocal 1/n: a/b ÷ n = a/b × 1/n = a/(b × n). So 4/9 ÷ 6 = 4/54 = 2/27.",
    "除以整数 n 等于乘它的倒数 1/n：a/b ÷ n = a/b × 1/n = a/(b × n)。所以 4/9 ÷ 6 = 4/54 = 2/27。",
  ),
  ["dividing-fractions-by-whole-numbers-using-models", "reciprocals"],
  ["6.NS.A.1"],
  [
    point(
      "fraction-divided-by-whole-number",
      ["Finding the quotient", "求商"],
      [
        "$\\frac{3}{4} \\div 5 = \\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}$.\n\nCheck: $5 \\times \\frac{3}{20} = \\frac{15}{20} = \\frac{3}{4}$.\n\n> **Watch out.** Multiply the bottom by 5, not the top. $\\frac{15}{4}$ is bigger, but sharing makes it smaller.",
        "$\\frac{3}{4} \\div 5 = \\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}$。\n\n检验：$5 \\times \\frac{3}{20} = \\frac{15}{20} = \\frac{3}{4}$。\n\n> **注意。** 是分母乘 5，不是分子乘 5。$\\frac{15}{4}$ 变大了，可平均分应该变小。",
      ],
      (rng) => {
        const [a, b] = properFraction(rng, 9, 2);
        const n = rng.int(2, 9);
        return answered(
          [`Find $${fr(a, b)} \\div ${n}$.`, `计算 $${fr(a, b)} \\div ${n}$。`],
          qf(a, b * n),
          [
            [
              ["Use the reciprocal", "乘倒数"],
              [`Dividing by ${n} is multiplying by $${fr(1, n)}$.`, `除以 ${n} 等于乘 $${fr(1, n)}$。`],
              [`${fr(a, b)} \\div ${n} = ${fr(a, b)} \\times ${fr(1, n)}`],
            ],
            [
              ["Multiply", "相乘"],
              ["Multiply the tops and the bottoms.", "分子乘分子，分母乘分母。"],
              [`${fr(a, b)} \\times ${fr(1, n)} = ${fr(a, b * n)}`],
            ],
            ...tidy(a, b * n),
          ],
          multiplyBack(`${n} \\times ${fr(a, b * n)} = ${fr(a * n, b * n)} = ${fr(a, b)}`),
          [
            [qf(a * n, b), "That multiplies the top instead of the bottom.", "这是乘了分子，应该乘分母。"],
            [qf(b * n, a), "That flips the answer upside down.", "这是把结果倒过来了。"],
            [qf(a, b + n), "That adds to the bottom instead of multiplying.", "这是把分母加上了这个数，应该相乘。"],
          ],
          { form: "fraction", figure: splitPartsFigure(a, b, n) },
        );
      },
      splitPartsFigure(3, 4, 5),
    ),
    point(
      "mixed-number-divided-by-whole-number",
      ["Dividing a mixed number", "带分数除以整数"],
      [
        "$2\\frac{1}{2} \\div 3$: first $2\\frac{1}{2} = \\frac{5}{2}$. Then $\\frac{5}{2} \\times \\frac{1}{3} = \\frac{5}{6}$.\n\nCheck: $3 \\times \\frac{5}{6} = \\frac{15}{6} = 2\\frac{1}{2}$.\n\n> **Watch out.** Change the mixed number first. Dividing only the 2 by 3 leaves out the $\\frac{1}{2}$.",
        "$2\\frac{1}{2} \\div 3$：先把 $2\\frac{1}{2}$ 化成 $\\frac{5}{2}$，再算 $\\frac{5}{2} \\times \\frac{1}{3} = \\frac{5}{6}$。\n\n检验：$3 \\times \\frac{5}{6} = \\frac{15}{6} = 2\\frac{1}{2}$。\n\n> **注意。** 要先化成假分数。只用 2 除以 3，就漏掉了 $\\frac{1}{2}$。",
      ],
      (rng) => {
        const w = rng.int(1, 5);
        const [a, b] = properFraction(rng, 8, 2);
        const n = rng.int(2, 9);
        const top = w * b + a;
        return answered(
          [`Find $${mx(w, a, b)} \\div ${n}$.`, `计算 $${mx(w, a, b)} \\div ${n}$。`],
          qf(top, b * n),
          [
            improperStep([w, a, b]),
            [
              ["Multiply by the reciprocal", "乘倒数"],
              [`Dividing by ${n} is multiplying by $${fr(1, n)}$.`, `除以 ${n} 等于乘 $${fr(1, n)}$。`],
              [`${fr(top, b)} \\times ${fr(1, n)} = ${fr(top, b * n)}`],
            ],
            ...tidy(top, b * n),
          ],
          multiplyBack(`${n} \\times ${fr(top, b * n)} = ${fr(top * n, b * n)} = ${mx(w, a, b)}`),
          [
            [qf(top * n, b), "That multiplies instead of dividing.", "这是做成乘法了。"],
            [mixedValue(w, a, b * n), `That divides only the fraction part by ${n}.`, `这只把分数部分除以了 ${n}。`],
            [qf(w, n).add(qf(a, b)), `That divides only the whole number ${w} by ${n}.`, `这只把整数部分 ${w} 除以了 ${n}。`],
          ],
          { form: "mixed", figure: equalTape(n, "?", mixedText(w, a, b), 1) },
        );
      },
      equalTape(3, "?", "2 1/2", 1),
    ),
  ],
  t(
    "Ben has $\\frac{4}{5}$ pound of clay. He makes 3 pots of the same size. Each pot uses $\\frac{4}{5} \\div 3 = \\frac{4}{5} \\times \\frac{1}{3} = \\frac{4}{15}$ pound.\n\nCheck: $3 \\times \\frac{4}{15} = \\frac{12}{15} = \\frac{4}{5}$.\n\nIn this lesson we divide a fraction by a whole number without a model.",
    "本有 $\\frac{4}{5}$ 磅黏土，做了 3 个一样大的罐子。每个罐子用 $\\frac{4}{5} \\div 3 = \\frac{4}{5} \\times \\frac{1}{3} = \\frac{4}{15}$ 磅。\n\n检验：$3 \\times \\frac{4}{15} = \\frac{12}{15} = \\frac{4}{5}$。\n\n本课我们不用模型，直接计算分数除以整数。",
  ),
);

export const dividingFractionsAndWholeNumbersWordProblems = topic(
  "dividing-fractions-and-whole-numbers-word-problems",
  t("Dividing Fractions and Whole Numbers: Word Problems", "分数与整数除法应用题"),
  t(
    "Sharing a fractional amount among n people divides the fraction by n: 3/4 pound shared by 3 people is 3/4 ÷ 3 = 1/4 pound each. Asking how many portions of a fractional size fit in a whole amount divides the whole number by the fraction: 6 cups in 3/4-cup portions is 6 ÷ 3/4 = 8 portions.",
    "把一个分数量平均分给 n 个人，用这个分数除以 n：3/4 磅平均分给 3 个人，每人 3/4 ÷ 3 = 1/4 磅。问一个整数量里能分出多少份分数大小的量，用整数除以分数：6 杯，每份 3/4 杯，可以分成 6 ÷ 3/4 = 8 份。",
  ),
  ["dividing-fractions-by-whole-numbers", "dividing-whole-numbers-by-fractions"],
  ["5.NF.B.7c"],
  [
    point(
      "sharing-a-fraction-in-word-problems",
      ["Sharing a fractional amount", "平均分一个分数量"],
      [
        "$\\frac{2}{3}$ of a cake is shared by 4 people. Each gets $\\frac{2}{3} \\div 4 = \\frac{2}{12} = \\frac{1}{6}$ of the cake.\n\nCheck: $4 \\times \\frac{1}{6} = \\frac{4}{6} = \\frac{2}{3}$.\n\n> **Watch out.** Sharing among people divides by the number of people. $4 \\div \\frac{2}{3}$ asks a different question.",
        "把 $\\frac{2}{3}$ 个蛋糕平均分给 4 个人。每人分到 $\\frac{2}{3} \\div 4 = \\frac{2}{12} = \\frac{1}{6}$ 个蛋糕。\n\n检验：$4 \\times \\frac{1}{6} = \\frac{4}{6} = \\frac{2}{3}$。\n\n> **注意。** 平均分给几个人，就除以人数。$4 \\div \\frac{2}{3}$ 问的是另一个问题。",
      ],
      (rng) => {
        const [a, d] = properFraction(rng, 10, 2);
        const n = rng.int(2, 8);
        return answered(
          shareStory(rng, fr(a, d), n),
          qf(a, d * n),
          [
            [
              ["Choose the operation", "选择运算"],
              ["Sharing equally divides the amount by the number of shares.", "平均分，就用这个量除以份数。"],
              [`${fr(a, d)} \\div ${n}`],
            ],
            [
              ["Multiply by the reciprocal", "乘倒数"],
              [`Dividing by ${n} is multiplying by $${fr(1, n)}$.`, `除以 ${n} 等于乘 $${fr(1, n)}$。`],
              [`${fr(a, d)} \\times ${fr(1, n)} = ${fr(a, d * n)}`],
            ],
            ...tidy(a, d * n),
          ],
          [
            `Put the shares back: ${n} shares of $${fr(a, d * n)}$ make $${fr(a * n, d * n)} = ${fr(a, d)}$.`,
            `把几份合起来：${n} 份 $${fr(a, d * n)}$ 是 $${fr(a * n, d * n)} = ${fr(a, d)}$。`,
          ],
          [
            [qf(d * n, a), `That divides ${n} by the fraction, the other way round.`, `这是用 ${n} 除以这个分数，除反了。`],
            [qf(a * n, d), "That multiplies instead of dividing.", "这是做成乘法了。"],
            [qf(a, d + n), "That adds to the bottom instead of multiplying.", "这是把分母加上了这个数，应该相乘。"],
          ],
          { form: "fraction", figure: splitPartsFigure(a, d, n) },
        );
      },
      splitPartsFigure(2, 3, 4),
    ),
    point(
      "portions-of-a-whole-amount",
      ["Counting portions", "求份数"],
      [
        "9 meters of rope are cut into pieces $\\frac{3}{4}$ meter long. $9 \\div \\frac{3}{4} = 9 \\times \\frac{4}{3} = \\frac{36}{3} = 12$ pieces.\n\nCheck: $12 \\times \\frac{3}{4} = \\frac{36}{4} = 9$ meters.\n\n> **Watch out.** Divide the total by the size of one piece. $\\frac{3}{4} \\div 9$ is far too small.",
        "9 米绳子剪成每段 $\\frac{3}{4}$ 米长。$9 \\div \\frac{3}{4} = 9 \\times \\frac{4}{3} = \\frac{36}{3} = 12$ 段。\n\n检验：$12 \\times \\frac{3}{4} = \\frac{36}{4} = 9$ 米。\n\n> **注意。** 用总长除以每段的长度。$\\frac{3}{4} \\div 9$ 就太小了。",
      ],
      (rng) => {
        const w = rng.int(2, 6);
        let [a, d] = properFraction(rng, 8, 3);
        while (a < 2) [a, d] = properFraction(rng, 8, 3);
        const v = qf(w * d, a);
        return answered(
          servingStory(rng, w, fr(a, d), (w * d) % a !== 0),
          v,
          [
            [
              ["Choose the operation", "选择运算"],
              ["How many pieces means divide the total by the size of one.", "求能分几份，用总量除以每份的量。"],
              [`${w} \\div ${fr(a, d)}`],
            ],
            [
              ["Multiply by the reciprocal", "乘倒数"],
              [`Dividing by $${fr(a, d)}$ is multiplying by $${fr(d, a)}$.`, `除以 $${fr(a, d)}$ 等于乘 $${fr(d, a)}$。`],
              [`${w} \\times ${fr(d, a)} = ${fr(w * d, a)}`],
            ],
            ...tidy(w * d, a),
          ],
          multiplyBack(`${fr(w * d, a)} \\times ${fr(a, d)} = ${fr(w * d * a, a * d)} = ${w}`),
          [
            [qf(a, w * d), `That divides the size of one piece by ${w}, the other way round.`, `这是用每份的量除以 ${w}，除反了。`],
            [qf(w * a, d), "That multiplies by the fraction instead of dividing.", "这是乘了这个分数，没有做除法。"],
            [w * d, `That multiplies by ${d} but forgets to divide by ${a}.`, `这里乘了 ${d}，但忘了除以 ${a}。`],
          ],
          { form: "mixed", figure: groupedBarsFigure(w, d, a) },
        );
      },
      groupedBarsFigure(9, 4, 3),
    ),
  ],
  t(
    "Mom shares $\\frac{3}{4}$ pound of grapes among 3 kids: each gets $\\frac{3}{4} \\div 3 = \\frac{1}{4}$ pound. Dad pours 6 cups of milk into glasses of $\\frac{3}{4}$ cup: that fills $6 \\div \\frac{3}{4} = 8$ glasses.\n\nCheck: $3 \\times \\frac{1}{4} = \\frac{3}{4}$, and $8 \\times \\frac{3}{4} = 6$.\n\nIn this lesson we decide what to divide by in word problems.",
    "妈妈把 $\\frac{3}{4}$ 磅葡萄平均分给 3 个孩子：每人 $\\frac{3}{4} \\div 3 = \\frac{1}{4}$ 磅。爸爸把 6 杯牛奶倒进玻璃杯，每杯 $\\frac{3}{4}$ 杯：能倒 $6 \\div \\frac{3}{4} = 8$ 杯。\n\n检验：$3 \\times \\frac{1}{4} = \\frac{3}{4}$，$8 \\times \\frac{3}{4} = 6$。\n\n本课我们学习在应用题中判断该除以哪个数。",
  ),
);

export const dividingFractionsUsingModels = topic(
  "dividing-fractions-using-models",
  t("Dividing Fractions Using Models", "用模型做分数除以分数"),
  t(
    "To divide fractions with a model, cut the bar into parts of a common size and count groups. 3/4 ÷ 1/8: 3/4 is 6 eighths, which make 6 groups of 1/8, so 3/4 ÷ 1/8 = 6. And 2/3 ÷ 3/4: 2/3 is 8 twelfths and 3/4 is 9 twelfths, so 2/3 ÷ 3/4 = 8/9 of a group.",
    "用模型做分数除法时，把长条分成同样大小的小份再数组数。3/4 ÷ 1/8：3/4 是 6 个八分之一，可以分成 6 组 1/8，所以 3/4 ÷ 1/8 = 6。2/3 ÷ 3/4：2/3 是 8 个十二分之一，3/4 是 9 个十二分之一，所以 2/3 ÷ 3/4 = 8/9 组。",
  ),
  ["dividing-whole-numbers-by-fractions", "comparing-fraction-models-using-common-denominators"],
  ["6.NS.A.1"],
  [
    point(
      "fraction-divided-by-unit-fraction-models",
      ["Dividing by a smaller unit fraction", "除以较小的单位分数"],
      [
        "For $\\frac{2}{3} \\div \\frac{1}{6}$, write $\\frac{2}{3}$ in sixths: $\\frac{2}{3} = \\frac{4}{6}$. It holds 4 sixths, so the answer is 4.\n\nCheck: $4 \\times \\frac{1}{6} = \\frac{4}{6} = \\frac{2}{3}$.\n\n> **Watch out.** Change to sixths before you count. There are 4 sixths, not 2.",
        "计算 $\\frac{2}{3} \\div \\frac{1}{6}$，先把 $\\frac{2}{3}$ 写成六分之几：$\\frac{2}{3} = \\frac{4}{6}$。里面有 4 个六分之一，所以结果是 4。\n\n检验：$4 \\times \\frac{1}{6} = \\frac{4}{6} = \\frac{2}{3}$。\n\n> **注意。** 先化成六分之几再数。有 4 个六分之一，不是 2 个。",
      ],
      (rng) => {
        const b = rng.int(2, 6);
        const k = rng.int(2, 4);
        const d = b * k;
        const a = coprimeTo(rng, b, 1, b - 1);
        return answered(
          [
            `The bar shows $${fr(a, b)}$ shaded. Find $${fr(a, b)} \\div ${fr(1, d)}$.`,
            `长条中涂色部分是 $${fr(a, b)}$。计算 $${fr(a, b)} \\div ${fr(1, d)}$。`,
          ],
          a * k,
          [
            [
              ["Use the small parts", "化成小份"],
              [`Each $${fr(1, b)}$ is ${k} parts of $${fr(1, d)}$.`, `每个 $${fr(1, b)}$ 是 ${k} 个 $${fr(1, d)}$。`],
              [`${fr(a, b)} = ${fr(a * k, d)}`],
            ],
            [
              ["Count", "数一数"],
              [`There are ${a * k} parts of $${fr(1, d)}$.`, `一共有 ${a * k} 个 $${fr(1, d)}$。`],
              [`${fr(a, b)} \\div ${fr(1, d)} = ${a * k}`],
            ],
          ],
          multiplyBack(`${a * k} \\times ${fr(1, d)} = ${fr(a * k, d)} = ${fr(a, b)}`),
          [
            [a, "That counts the old parts, not the small ones.", "这数的是原来的份，不是小份。"],
            [qf(a, b * d), "That multiplies instead of dividing.", "这是做成乘法了。"],
            [
              a * d,
              `That multiplies ${a} by ${d}, but only ${k} small parts fit in each $${fr(1, b)}$.`,
              `这是用 ${a} 乘 ${d}，可每个 $${fr(1, b)}$ 里只有 ${k} 个小份。`,
            ],
          ],
          { figure: barFigure(d, a * k) },
        );
      },
      barFigure(6, 4),
    ),
    point(
      "fraction-divided-by-fraction-models",
      ["Quotients that are fractions", "商是分数"],
      [
        "For $\\frac{1}{2} \\div \\frac{2}{3}$, use sixths: $\\frac{3}{6} \\div \\frac{4}{6}$. A group is 4 sixths, but there are only 3. So the answer is $\\frac{3}{4}$ of a group.\n\nCheck: $\\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}$.\n\n> **Watch out.** The second fraction is one group. Put the first count on top: $\\frac{3}{4}$, not $\\frac{4}{3}$.",
        "计算 $\\frac{1}{2} \\div \\frac{2}{3}$，都化成六分之几：$\\frac{3}{6} \\div \\frac{4}{6}$。一组是 4 个六分之一，可只有 3 个，所以结果是一组的 $\\frac{3}{4}$。\n\n检验：$\\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}$。\n\n> **注意。** 第二个分数是一组。第一个分数的份数作分子：是 $\\frac{3}{4}$，不是 $\\frac{4}{3}$。",
      ],
      (rng) => {
        for (;;) {
          const p = unrelatedPair(rng);
          const L = lcm(p.b, p.d);
          const [x, y] = [(p.a * L) / p.b, (p.c * L) / p.d];
          if (x === y || L > 24) continue;
          const v = qf(x, y);
          return answered(
            [
              `The bars show $${fr(p.a, p.b)}$ and $${fr(p.c, p.d)}$. Find $${fr(p.a, p.b)} \\div ${fr(p.c, p.d)}$.`,
              `两个长条分别表示 $${fr(p.a, p.b)}$ 和 $${fr(p.c, p.d)}$。计算 $${fr(p.a, p.b)} \\div ${fr(p.c, p.d)}$。`,
            ],
            v,
            [
              [
                ["Use a common bottom", "通分"],
                [`Count both in parts of $${fr(1, L)}$.`, `都用 $${fr(1, L)}$ 作单位来数。`],
                [`${fr(p.a, p.b)} = ${fr(x, L)}`, `${fr(p.c, p.d)} = ${fr(y, L)}`],
              ],
              [
                ["Compare the counts", "比较份数"],
                [`One group is ${y} parts, and there are ${x}.`, `一组是 ${y} 份，一共有 ${x} 份。`],
                [`${x} \\div ${y} = ${fr(x, y)}`],
              ],
              ...tidy(x, y),
            ],
            [
              `Multiply back: $${fr(y, L)}$ times $${fr(x, y)}$ is $${fr(x, L)} = ${fr(p.a, p.b)}$.`,
              `乘回去：$${fr(y, L)}$ 乘 $${fr(x, y)}$ 等于 $${fr(x, L)} = ${fr(p.a, p.b)}$。`,
            ],
            [
              [
                qf(y, x),
                "That flips the answer. It counts how many of the first fit in the second.",
                "这是把结果倒过来了，算的是第二个里有几个第一个。",
              ],
              [qf(p.a * p.c, p.b * p.d), "That multiplies instead of dividing.", "这是做成乘法了。"],
              [qf(x, L), "That is only the first fraction again.", "这只是第一个分数本身。"],
            ],
            { form: "mixed", figure: twoBarsFigure(p.b, p.a, p.d, p.c) },
          );
        }
      },
      twoBarsFigure(2, 1, 3, 2),
    ),
  ],
  t(
    "Kai has $\\frac{3}{4}$ of a pan of brownies. He cuts pieces that are each $\\frac{1}{8}$ of the pan. $\\frac{3}{4} = \\frac{6}{8}$, so he gets 6 pieces: $\\frac{3}{4} \\div \\frac{1}{8} = 6$.\n\nCheck: $6 \\times \\frac{1}{8} = \\frac{6}{8} = \\frac{3}{4}$.\n\nIn this lesson we use bar models to divide a fraction by a fraction.",
    "凯有 $\\frac{3}{4}$ 盘布朗尼，他切成每块是整盘的 $\\frac{1}{8}$。$\\frac{3}{4} = \\frac{6}{8}$，所以能切 6 块：$\\frac{3}{4} \\div \\frac{1}{8} = 6$。\n\n检验：$6 \\times \\frac{1}{8} = \\frac{6}{8} = \\frac{3}{4}$。\n\n本课我们用长条模型做分数除以分数。",
  ),
);

/** grade5FractionTopics lists the 5th grade topics on adding, subtracting, multiplying and dividing fractions. */
export const grade5FractionTopics: readonly TopicDef[] = [
  addingFractionsAndWholeNumbersUsingModels,
  addingFractionsAndWholeNumbers,
  subtractingFractionsAndWholeNumbersUsingModels,
  subtractingFractionsAndWholeNumbers,
  estimatingSumsAndDifferencesOfFractions,
  addingFractionsWithUnlikeDenominatorsUsingModels,
  subtractingFractionsWithUnlikeDenominatorsUsingModels,
  addingFractionsWithUnlikeDenominators,
  subtractingFractionsWithUnlikeDenominators,
  addingAndSubtractingFractionsWithUnlikeDenominatorsWordProblems,
  addingMixedNumbersWithUnlikeDenominators,
  subtractingMixedNumbersWithUnlikeDenominators,
  subtractingMixedNumbersWithUnlikeDenominatorsUsingImproperFractions,
  addingAndSubtractingMixedNumbersWithUnlikeDenominatorsWordProblems,
  multiplyingFractionsByUnitFractionsUsingModels,
  multiplyingFractionsUsingModels,
  multiplyingFractionsWordProblems,
  multiplyingFractionsBySwappingDenominators,
  multiplyingMixedNumbersByWholeNumbers,
  multiplyingMixedNumbersByFractions,
  multiplyingMixedNumbers,
  multiplyingMixedNumbersWordProblems,
  connectingFractionMultiplicationAndArea,
  findingAreasUsingFractionMultiplication,
  fractionMultiplicationNumberSense,
  interpretingFractionDivisionUsingAreaModels,
  dividingWholeNumbersByUnitFractionsUsingModels,
  dividingWholeNumbersByUnitFractions,
  dividingUnitFractionsByWholeNumbersUsingModels,
  dividingUnitFractionsByWholeNumbers,
  reciprocals,
  dividingWholeNumbersByFractionsUsingModelsWholeNumberResults,
  dividingWholeNumbersByFractionsUsingModelsFractionalResults,
  dividingWholeNumbersByFractions,
  dividingFractionsByWholeNumbersUsingModels,
  dividingFractionsByWholeNumbers,
  dividingFractionsAndWholeNumbersWordProblems,
  dividingFractionsUsingModels,
];

/** fullBarsInASum counts the full bars in a model of a whole number plus an improper fraction. */
export const fullBarsInASum = point(
  "full-bars-in-a-sum",
  ["Full bars in a sum", "和中有几个完整的长条"],
  [
    "A model of $2 + \\frac{7}{4}$ has 2 full bars. $7 \\div 4 = 1$ R 3, so $\\frac{7}{4}$ fills 1 more bar and $\\frac{3}{4}$ of another. That makes $2 + 1 = 3$ full bars.\n\nCheck: $3\\frac{3}{4} = \\frac{15}{4}$, and $8 + 7 = 15$ fourths.\n\n> **Watch out.** The last bar is only partly shaded. Do not count it as full.",
    "$2 + \\frac{7}{4}$ 的模型有 2 个满条。$7 \\div 4 = 1$ 余 3，所以 $\\frac{7}{4}$ 再涂满 1 个长条，还有一个长条的 $\\frac{3}{4}$。一共 $2 + 1 = 3$ 个满条。\n\n检验：$3\\frac{3}{4} = \\frac{15}{4}$，而 $8 + 7 = 15$ 个四分之一。\n\n> **注意。** 最后一个长条只涂了一部分，不能算满条。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const d = rng.int(2, 8);
    const n = rng.int(d + 1, 3 * d);
    const k = Math.floor(n / d);
    const r = n % d;
    const full = a + k;
    return answered(
      [
        `A model shows $${a} + ${fr(n, d)}$. How many bars in the model are completely full?`,
        `一个模型表示 $${a} + ${fr(n, d)}$。模型中有几个完全涂满的长条？`,
      ],
      full,
      [
        [
          ["Bars from the fraction", "假分数涂满的长条"],
          ["Divide the top by the bottom.", "用分子除以分母。"],
          [r ? `${n} \\div ${d} = ${k} \\text{ R } ${r}` : `${n} \\div ${d} = ${k}`],
        ],
        [
          ["Add the whole number", "加上整数"],
          [`The ${a} whole${a === 1 ? " is" : "s are"} full bars too.`, `${a} 个整数也是满条。`],
          [`${a} + ${k} = ${full}`],
        ],
      ],
      [
        `Count the parts. $${a} \\times ${d} + ${n} = ${a * d + n}$, and $${full} \\times ${d} = ${full * d}$ of them fill whole bars.`,
        `数份数：$${a} \\times ${d} + ${n} = ${a * d + n}$，其中 $${full} \\times ${d} = ${full * d}$ 份正好涂满整条。`,
      ],
      [
        [a, "That counts only the bars of the whole number.", "这只数了整数的长条。"],
        [k, "That counts only the bars the fraction fills.", "这只数了假分数涂满的长条。"],
        ...(r ? [[full + 1, "That counts the partly shaded bar as full.", "这是把只涂了一部分的长条也算成满条了。"] as const] : []),
      ],
      { figure: barFigure(d, a * d + n, full + (r ? 1 : 0)) },
    );
  },
  barFigure(4, 15, 4),
);

/** aMissingWholeNumber finds the whole number added to a mixed number. */
export const aMissingWholeNumber = point(
  "a-missing-whole-number",
  ["A missing whole number", "缺少的整数"],
  [
    "In $\\square + 2\\frac{1}{4} = 7\\frac{1}{4}$, the fractions match, so only the whole parts change. The box is $7 - 2 = 5$.\n\nCheck: $5 + 2\\frac{1}{4} = 7\\frac{1}{4}$.\n\n> **Watch out.** The box is not 7. That is the whole part of the sum.",
    "在 $\\square + 2\\frac{1}{4} = 7\\frac{1}{4}$ 中，分数部分相同，只有整数部分变了。方框里是 $7 - 2 = 5$。\n\n检验：$5 + 2\\frac{1}{4} = 7\\frac{1}{4}$。\n\n> **注意。** 方框里不是 7，7 是和的整数部分。",
  ],
  (rng) => {
    const d = rng.int(3, 12);
    const n = rng.int(1, d - 1);
    const a = rng.int(1, 20);
    const k = rng.int(2, 30);
    return answered(
      [`Fill in the box: $$\\square + ${mx(a, n, d)} = ${mx(a + k, n, d)}$$`, `填方框：$$\\square + ${mx(a, n, d)} = ${mx(a + k, n, d)}$$`],
      k,
      [
        [
          ["Compare the fractions", "比较分数部分"],
          [`Both have $${fr(n, d)}$, so only the whole parts change.`, `两边都有 $${fr(n, d)}$，所以只有整数部分变。`],
        ],
        [
          ["Subtract the whole parts", "整数部分相减"],
          ["The box is the gap between the whole parts.", "方框里是两个整数部分的差。"],
          [`${a + k} - ${a} = ${k}`],
        ],
      ],
      [`Add back: $${k} + ${mx(a, n, d)} = ${mx(a + k, n, d)}$.`, `加回去：$${k} + ${mx(a, n, d)} = ${mx(a + k, n, d)}$。`],
      [
        [a + k, "That is the whole part of the sum.", "这是和的整数部分。"],
        [a, "That is the whole part already there.", "这是原来就有的整数部分。"],
        [k + 1, "That is one more than the gap between the whole parts.", "这比两个整数部分的差多 1。"],
      ],
    );
  },
  sumTape(
    [
      [5, "?"],
      [2.25, "2 1/4"],
    ],
    "7 1/4",
  ),
);

/** partsLeftAfterCrossingOut counts the parts left when a fraction is taken from whole bars. */
export const partsLeftAfterCrossingOut = point(
  "parts-left-after-crossing-out",
  ["Parts left after crossing out", "划掉后剩下的份数"],
  [
    "To find $3 - \\frac{5}{4}$, cut 3 bars into fourths. That is $3 \\times 4 = 12$ parts. Cross out 5, and $12 - 5 = 7$ parts are left.\n\nCheck: $\\frac{7}{4} + \\frac{5}{4} = \\frac{12}{4} = 3$.\n\n> **Watch out.** Count the parts in every bar, not just the last one.",
    "求 $3 - \\frac{5}{4}$：把 3 个长条都分成四份，一共 $3 \\times 4 = 12$ 份。划掉 5 份，还剩 $12 - 5 = 7$ 份。\n\n检验：$\\frac{7}{4} + \\frac{5}{4} = \\frac{12}{4} = 3$。\n\n> **注意。** 每个长条的份数都要数，不能只数最后一个。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const d = rng.int(3, 8);
    const n = rng.int(1, d * k - 1);
    return answered(
      [
        `A model shows ${k} bars, each cut into ${d} equal parts, to find $${k} - ${fr(n, d)}$. How many parts are left after crossing out?`,
        `一个模型用 ${k} 个长条，每条分成 ${d} 等份，来求 $${k} - ${fr(n, d)}$。划掉后剩下多少份？`,
      ],
      k * d - n,
      [
        [
          ["Count all the parts", "数全部份数"],
          [`${k} bars of ${d} parts each.`, `${k} 个长条，每条 ${d} 份。`],
          [`${k} \\times ${d} = ${k * d}`],
        ],
        [["Cross out", "划掉"], [`$${fr(n, d)}$ is ${n} parts.`, `$${fr(n, d)}$ 是 ${n} 份。`], [`${k * d} - ${n} = ${k * d - n}`]],
      ],
      [`Add back: $${k * d - n} + ${n} = ${k * d}$ parts.`, `加回去：$${k * d - n} + ${n} = ${k * d}$ 份。`],
      [
        [k * d, "That is all the parts before crossing out.", "这是划掉之前的全部份数。"],
        [n, "That is the parts crossed out.", "这是划掉的份数。"],
        [k * d + n, "That adds the crossed-out parts instead of taking them away.", "这是加上了划掉的份数，应该减去。"],
        ...(n < d ? [[d - n, "That counts only the parts left in the last bar.", "这只数了最后一个长条剩下的份数。"] as const] : []),
      ],
      { figure: takeAwayFigure(k, n, d) },
    );
  },
  takeAwayFigure(3, 5, 4),
);

/** theFractionTakenFromAWhole finds the top of the fraction taken from a whole number. */
export const theFractionTakenFromAWhole = point(
  "the-fraction-taken-from-a-whole",
  ["The fraction taken from a whole", "从整数中减去的分数"],
  [
    "In $5 - \\frac{\\square}{6} = 4\\frac{1}{6}$, write 5 as $4\\frac{6}{6}$. To leave $\\frac{1}{6}$, take away $6 - 1 = 5$ sixths. The box is 5.\n\nCheck: $5 - \\frac{5}{6} = 4\\frac{1}{6}$.\n\n> **Watch out.** The box is not 1. That is the part left.",
    "在 $5 - \\frac{\\square}{6} = 4\\frac{1}{6}$ 中，把 5 写成 $4\\frac{6}{6}$。要剩下 $\\frac{1}{6}$，就要减去 $6 - 1 = 5$ 个六分之一。方框里是 5。\n\n检验：$5 - \\frac{5}{6} = 4\\frac{1}{6}$。\n\n> **注意。** 方框里不是 1，1 是剩下的部分。",
  ],
  (rng) => {
    const k = rng.int(2, 25);
    const d = rng.int(3, 12);
    const r = rng.int(1, d - 1);
    return answered(
      [
        `Fill in the box: $$${k} - \\frac{\\square}{${d}} = ${mx(k - 1, r, d)}$$`,
        `填方框：$$${k} - \\frac{\\square}{${d}} = ${mx(k - 1, r, d)}$$`,
      ],
      d - r,
      [
        [
          ["Borrow a whole", "拿出一个 1"],
          [`Write ${k} with $${fr(d, d)}$.`, `把 ${k} 写成带 $${fr(d, d)}$ 的形式。`],
          [`${k} = ${k - 1}${fr(d, d)}`],
        ],
        [
          ["Find the missing top", "求分子"],
          [`To leave $${fr(r, d)}$, take the rest away.`, `要剩下 $${fr(r, d)}$，就减去其余的部分。`],
          [`${d} - ${r} = ${d - r}`],
        ],
      ],
      [`Put it in: $${k} - ${fr(d - r, d)} = ${mx(k - 1, r, d)}$.`, `代入：$${k} - ${fr(d - r, d)} = ${mx(k - 1, r, d)}$。`],
      [
        [r, "That is the top of what is left.", "这是剩下部分的分子。"],
        [d, "That is the whole bar, all the parts.", "这是一整条，全部的份数。"],
        [d - r + 1, "That takes away one part too many.", "多减了一份。"],
      ],
      {
        figure: stepLine(
          d,
          k - 1,
          k,
          [
            [k, `${k}`],
            [k - 1 + r / d, mixedText(k - 1, r, d)],
          ],
          [[k, k - 1 + r / d]],
        ),
      },
    );
  },
  stepLine(
    6,
    4,
    5,
    [
      [5, "5"],
      [4 + 1 / 6, "4 1/6"],
    ],
    [[5, 4 + 1 / 6]],
  ),
);

/** catchingAnUnreasonableSum picks the sum of two fractions above one half by estimating it as more than 1. */
export const catchingAnUnreasonableSum = point(
  "catching-an-unreasonable-sum",
  ["Catching an unreasonable sum", "发现不合理的和"],
  [
    "$\\frac{3}{5}$ and $\\frac{5}{8}$ are both more than $\\frac{1}{2}$, so their sum is more than 1. The sum is $\\frac{24}{40} + \\frac{25}{40} = \\frac{49}{40}$.\n\nCheck: $\\frac{49}{40}$ is more than 1, because 49 is more than 40.\n\n> **Watch out.** Adding the tops and the bottoms gives $\\frac{8}{13}$, which is less than 1. It cannot be right.",
    "$\\frac{3}{5}$ 和 $\\frac{5}{8}$ 都大于 $\\frac{1}{2}$，所以它们的和大于 1。和是 $\\frac{24}{40} + \\frac{25}{40} = \\frac{49}{40}$。\n\n检验：$\\frac{49}{40}$ 大于 1，因为 49 比 40 大。\n\n> **注意。** 分子加分子、分母加分母得到 $\\frac{8}{13}$，比 1 小，不可能对。",
  ],
  (rng) => {
    const [b, d] = rng.sample([5, 6, 7, 8, 9, 10, 11, 12], 2) as [number, number];
    const a = coprimeTo(rng, b, Math.floor(b / 2) + 1, b - 1);
    const c = coprimeTo(rng, d, Math.floor(d / 2) + 1, d - 1);
    const top = a * d + c * b;
    const bottom = b * d;
    const sum = gcd(top, bottom) > 1 ? `${fr(top, bottom)} = ${lowest(top, bottom)}` : fr(top, bottom);
    return pickedMath(
      rng,
      [
        `Both fractions are more than one half. Which is the value of $${fr(a, b)} + ${fr(c, d)}$?`,
        `两个分数都大于二分之一。$${fr(a, b)} + ${fr(c, d)}$ 的值是哪个？`,
      ],
      lowest(top, bottom),
      [
        [lowest(a + c, b + d), "That adds the tops and the bottoms. It is less than 1.", "这是分子加分子、分母加分母，结果小于 1。"],
        [lowest(a * c, bottom), "That multiplies the fractions. It is less than 1.", "这是把两个分数相乘了，结果小于 1。"],
        [
          lowest(a + c, bottom),
          "That adds only the tops over the new bottom. It is less than 1.",
          "这是只把原来的分子相加，放在新分母上，结果小于 1。",
        ],
      ],
      [
        [
          ["Compare with one half", "和二分之一比"],
          [`$${fr(a, b)}$ and $${fr(c, d)}$ are both more than $\\frac{1}{2}$.`, `$${fr(a, b)}$ 和 $${fr(c, d)}$ 都大于 $\\frac{1}{2}$。`],
        ],
        [
          ["Estimate the sum", "估算和"],
          ["So the sum is more than 1.", "所以和大于 1。"],
          [`${fr(a, b)} + ${fr(c, d)} > \\frac{1}{2} + \\frac{1}{2} = 1`],
        ],
      ],
      [
        `Work it out. The top ${top} is more than the bottom ${bottom}, so the sum is more than 1: $${fr(a * d, bottom)} + ${fr(c * b, bottom)} = ${sum}$.`,
        `算一算。分子 ${top} 比分母 ${bottom} 大，所以和大于 1：$${fr(a * d, bottom)} + ${fr(c * b, bottom)} = ${sum}$。`,
      ],
      benchLine([
        [a, b],
        [c, d],
      ]),
    );
  },
  benchLine([
    [3, 5],
    [5, 8],
  ]),
);

/** partsOfACommonSizeInASum counts how many parts of the common size two fractions cover together. */
export const partsOfACommonSizeInASum = point(
  "parts-of-a-common-size-in-a-sum",
  ["Parts of a common size in a sum", "和中有几个相同大小的份"],
  [
    "Cut $\\frac{1}{2}$ and $\\frac{1}{3}$ into sixths. $\\frac{1}{2}$ covers 3 sixths and $\\frac{1}{3}$ covers 2 sixths, so together they cover 5 sixths.\n\nCheck: take away the 2 sixths of $\\frac{1}{3}$. The 3 sixths left are $\\frac{1}{2}$.\n\n> **Watch out.** Count the new small parts. The old parts make only $1 + 1 = 2$.",
    "把 $\\frac{1}{2}$ 和 $\\frac{1}{3}$ 都切成六分之一。$\\frac{1}{2}$ 占 3 份，$\\frac{1}{3}$ 占 2 份，合起来占 5 份。\n\n检验：去掉 $\\frac{1}{3}$ 的 2 份，剩下的 3 份正是 $\\frac{1}{2}$。\n\n> **注意。** 要数切好的小份。原来的份只有 $1 + 1 = 2$ 份。",
  ],
  (rng) => {
    const [b, d] = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
    const a = rng.int(1, b - 1);
    const c = rng.int(1, d - 1);
    const l = lcm(b, d);
    const [x, y] = [(a * l) / b, (c * l) / d];
    return answered(
      [
        `Models of $${fr(a, b)}$ and $${fr(c, d)}$ are cut into parts of size $${fr(1, l)}$. How many of these parts do they cover together?`,
        `把表示 $${fr(a, b)}$ 和 $${fr(c, d)}$ 的模型都切成每份 $${fr(1, l)}$。它们一共占多少份？`,
      ],
      x + y,
      [
        [
          ["Count each model", "数每个模型"],
          [`Rewrite each fraction with the bottom ${l}.`, `把每个分数改写成分母是 ${l} 的分数。`],
          [b === l ? "" : `${fr(a, b)} = ${fr(x, l)}`, d === l ? "" : `${fr(c, d)} = ${fr(y, l)}`].filter((line) => line !== ""),
        ],
        [["Put them together", "合起来"], [`${x} parts and ${y} parts.`, `${x} 份和 ${y} 份。`], [`${x} + ${y} = ${x + y}`]],
      ],
      [
        `Take away the ${y} parts of $${fr(c, d)}$: $${x + y} - ${y} = ${x}$ parts, which is $${fr(a, b)}$.`,
        `去掉 $${fr(c, d)}$ 的 ${y} 份：$${x + y} - ${y} = ${x}$ 份，正是 $${fr(a, b)}$。`,
      ],
      [
        [a + c, "That counts the old parts, not the new small ones.", "这是数了原来的份，不是切好的小份。"],
        [l, "That is the number of small parts in one whole bar.", "这是一整个长条里小份的个数。"],
        [x, "That counts only the first model.", "这里只数了第一个模型。"],
      ],
      { figure: twoBarsFigure(l, x, l, y) },
    );
  },
  twoBarsFigure(6, 3, 6, 2),
);

/** partsOfACommonSizeInADifference counts how many parts of the common size lie between two fractions. */
export const partsOfACommonSizeInADifference = point(
  "parts-of-a-common-size-in-a-difference",
  ["Parts of a common size in a difference", "差中有几个相同大小的份"],
  [
    "Cut $\\frac{3}{4}$ and $\\frac{1}{3}$ into twelfths. $\\frac{3}{4}$ covers 9 twelfths and $\\frac{1}{3}$ covers 4 twelfths, so they are $9 - 4 = 5$ parts apart.\n\nCheck: $4 + 5 = 9$ twelfths, which is $\\frac{3}{4}$.\n\n> **Watch out.** Subtract the new counts. $3 - 1 = 2$ counts the old parts.",
    "把 $\\frac{3}{4}$ 和 $\\frac{1}{3}$ 都切成十二分之一。$\\frac{3}{4}$ 占 9 份，$\\frac{1}{3}$ 占 4 份，所以相差 $9 - 4 = 5$ 份。\n\n检验：$4 + 5 = 9$ 个十二分之一，正是 $\\frac{3}{4}$。\n\n> **注意。** 要用切好后的份数相减。$3 - 1 = 2$ 是原来的份数。",
  ],
  (rng) => {
    for (;;) {
      const [b, d] = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
      const a = rng.int(1, b - 1);
      const c = rng.int(1, d - 1);
      const l = lcm(b, d);
      const [x, y] = [(a * l) / b, (c * l) / d];
      if (x <= y) continue;
      return answered(
        [
          `Models of $${fr(a, b)}$ and $${fr(c, d)}$ are cut into parts of size $${fr(1, l)}$. How many of these parts apart are they?`,
          `把表示 $${fr(a, b)}$ 和 $${fr(c, d)}$ 的模型都切成每份 $${fr(1, l)}$。它们相差多少份？`,
        ],
        x - y,
        [
          [
            ["Count each model", "数每个模型"],
            [`Rewrite each fraction with the bottom ${l}.`, `把每个分数改写成分母是 ${l} 的分数。`],
            [b === l ? "" : `${fr(a, b)} = ${fr(x, l)}`, d === l ? "" : `${fr(c, d)} = ${fr(y, l)}`].filter((line) => line !== ""),
          ],
          [["Find the gap", "求相差"], [`${x} parts take away ${y} parts.`, `${x} 份去掉 ${y} 份。`], [`${x} - ${y} = ${x - y}`]],
        ],
        [`Add back: $${y} + ${x - y} = ${x}$ parts, which is $${fr(a, b)}$.`, `加回去：$${y} + ${x - y} = ${x}$ 份，正是 $${fr(a, b)}$。`],
        [
          [x + y, "That adds the two counts.", "这是把两个份数相加了。"],
          [a - c, "That subtracts the old tops, not the new counts.", "这是用原来的分子相减，不是切好后的份数。"],
          [l, "That is the number of small parts in one whole bar.", "这是一整个长条里小份的个数。"],
        ],
        { figure: twoBarsFigure(l, x, l, y) },
      );
    }
  },
  twoBarsFigure(12, 9, 12, 4),
);

/** aMissingFractionInASum finds the missing part of a sum by subtracting the known part over a common denominator. */
export const aMissingFractionInASum = point(
  "a-missing-fraction-in-a-sum",
  ["A missing fraction in a sum", "和中缺失的分数"],
  [
    "For $\\frac{1}{3} + \\square = \\frac{5}{6}$, take the known part away. $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$.\n\nCheck: $\\frac{1}{3} + \\frac{1}{2} = \\frac{2}{6} + \\frac{3}{6} = \\frac{5}{6}$.\n\n> **Watch out.** Subtract to find the missing part. Adding $\\frac{1}{3}$ to $\\frac{5}{6}$ goes the wrong way.",
    "计算 $\\frac{1}{3} + \\square = \\frac{5}{6}$，用和减去已知部分。$\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$。\n\n检验：$\\frac{1}{3} + \\frac{1}{2} = \\frac{2}{6} + \\frac{3}{6} = \\frac{5}{6}$。\n\n> **注意。** 求缺失的部分要用减法。把 $\\frac{1}{3}$ 加到 $\\frac{5}{6}$ 上就反了。",
  ],
  (rng) => {
    const p = rng.bool() ? relatedPair(rng) : unrelatedPair(rng);
    const L = lcm(p.b, p.d);
    const [x, y] = [(p.a * L) / p.b, (p.c * L) / p.d];
    const known = qf(p.a, p.b);
    const answer = qf(p.c, p.d);
    const total = known.add(answer);
    const tail = gcd(y, L) !== 1 ? ` = ${fr(p.c, p.d)}` : "";
    const misses: [Q, string, string][] = [
      [total.add(known), "That adds the known part instead of taking it away.", "这是把已知部分加上了，应该减去。"],
      [answer.add(qf(1, L)), `That is one $${fr(1, L)}$ too many.`, `多算了一个 $${fr(1, L)}$。`],
      [known, "That is the part you already know, not the missing one.", "这是已知的部分，不是缺失的部分。"],
    ];
    const [tn, td] = [Number(total.n), Number(total.d)];
    if (tn > p.a && td > p.b)
      misses.push([qf(tn - p.a, td - p.b), "That subtracts the tops and the bottoms.", "这是分子减分子、分母减分母。"]);
    return answered(
      [
        `Find the missing fraction: $$${fr(p.a, p.b)} + \\square = ${total.toLatex()}$$`,
        `求缺失的分数：$$${fr(p.a, p.b)} + \\square = ${total.toLatex()}$$`,
      ],
      answer,
      [
        [
          ["Subtract the known part", "减去已知部分"],
          ["The missing part is the total take away the known part.", "缺失的部分 = 和 − 已知部分。"],
          [`\\square = ${total.toLatex()} - ${fr(p.a, p.b)}`],
        ],
        [
          ["Use a common denominator", "通分后相减"],
          [`The least common multiple of ${td} and ${p.b} is ${L}.`, `${td} 和 ${p.b} 的最小公倍数是 ${L}。`],
          [`${fr(x + y, L)} - ${fr(x, L)} = ${fr(y, L)}${tail}`],
        ],
      ],
      [
        `Add back: $${fr(p.a, p.b)} + ${fr(p.c, p.d)} = ${fr(x, L)} + ${fr(y, L)} = ${total.toLatex()}$.`,
        `加回去：$${fr(p.a, p.b)} + ${fr(p.c, p.d)} = ${fr(x, L)} + ${fr(y, L)} = ${total.toLatex()}$。`,
      ],
      misses,
      {
        form: "fraction",
        figure: sumTape(
          [
            [p.a / p.b, `${p.a}/${p.b}`],
            [p.c / p.d, "?"],
          ],
          `${tn}/${td}`,
        ),
      },
    );
  },
  sumTape(
    [
      [1 / 3, "1/3"],
      [1 / 2, "?"],
    ],
    "5/6",
  ),
);

/** thePartLeftOfAWhole subtracts the sum of two unit fractions from 1. */
export const thePartLeftOfAWhole = point(
  "the-part-left-of-a-whole",
  ["The part left of a whole", "整体中剩下的部分"],
  [
    "A garden is $\\frac{1}{4}$ beans and $\\frac{1}{3}$ peas. Together that is $\\frac{3}{12} + \\frac{4}{12} = \\frac{7}{12}$. The corn has $1 - \\frac{7}{12} = \\frac{5}{12}$.\n\nCheck: $\\frac{3}{12} + \\frac{4}{12} + \\frac{5}{12} = \\frac{12}{12} = 1$.\n\n> **Watch out.** Take the sum away from 1. $\\frac{7}{12}$ is the beans and peas, not the corn.",
    "一个菜园 $\\frac{1}{4}$ 种豆子，$\\frac{1}{3}$ 种豌豆。合起来是 $\\frac{3}{12} + \\frac{4}{12} = \\frac{7}{12}$。玉米占 $1 - \\frac{7}{12} = \\frac{5}{12}$。\n\n检验：$\\frac{3}{12} + \\frac{4}{12} + \\frac{5}{12} = \\frac{12}{12} = 1$。\n\n> **注意。** 要用 1 减去这个和。$\\frac{7}{12}$ 是豆子和豌豆，不是玉米。",
  ],
  (rng) => {
    const [a, b] = rng.sample([3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
    const L = lcm(a, b);
    const sum = qf(1, a).add(qf(1, b));
    const answer = qf(1, 1).sub(sum);
    const [x, y] = [L / a, L / b];
    return answered(
      [
        `A garden has $\\frac{1}{${a}}$ of its area in beans and $\\frac{1}{${b}}$ in peas. The rest is corn. What fraction of the garden is corn?`,
        `一个菜园的 $\\frac{1}{${a}}$ 种豆子，$\\frac{1}{${b}}$ 种豌豆，其余种玉米。玉米占菜园的几分之几？`,
      ],
      answer,
      [
        [
          ["Add the two parts", "两部分相加"],
          [`Use ${L} as the bottom.`, `用 ${L} 作分母。`],
          [`${fr(1, a)} + ${fr(1, b)} = ${fr(x, L)} + ${fr(y, L)} = ${fr(x + y, L)}`],
        ],
        [
          ["Take it from 1", "用 1 减"],
          [`The whole garden is $${fr(L, L)}$.`, `整个菜园是 $${fr(L, L)}$。`],
          [`${fr(L, L)} - ${fr(x + y, L)} = ${fr(L - x - y, L)}${gcd(L - x - y, L) !== 1 ? ` = ${answer.toLatex()}` : ""}`],
        ],
      ],
      [
        `All three parts make 1: $${fr(x, L)} + ${fr(y, L)} + ${fr(L - x - y, L)} = ${fr(L, L)}$.`,
        `三部分合起来是 1：$${fr(x, L)} + ${fr(y, L)} + ${fr(L - x - y, L)} = ${fr(L, L)}$。`,
      ],
      [
        [sum, "That is the beans and peas, not the corn.", "这是豆子和豌豆，不是玉米。"],
        [qf(a + b - 2, a + b), "That adds the tops and the bottoms before taking from 1.", "这是先把分子、分母分别相加，再用 1 减。"],
        [answer.add(qf(1, L)), `That is one $${fr(1, L)}$ too many.`, `多算了一个 $${fr(1, L)}$。`],
      ],
      {
        form: "fraction",
        figure: sumTape(
          [
            [1 / a, `1/${a}`],
            [1 / b, `1/${b}`],
            [answer.toNumber(), "?"],
          ],
          "1",
        ),
      },
    );
  },
  sumTape(
    [
      [1 / 4, "1/4"],
      [1 / 3, "1/3"],
      [5 / 12, "?"],
    ],
    "1",
  ),
);

/** whatIsLeftAfterTwoFractions finds the part of a garden left after two known parts, as a fraction or in square meters. */
export const whatIsLeftAfterTwoFractions = point(
  "what-is-left-after-two-fractions",
  ["What is left after two fractions", "去掉两个分数后还剩多少"],
  [
    "A garden of 30 square meters is $\\frac{1}{2}$ beans and $\\frac{1}{3}$ peas. The corn has $1 - \\frac{5}{6} = \\frac{1}{6}$ of it, and $\\frac{1}{6}$ of 30 is 5 square meters.\n\nCheck: beans 15, peas 10 and corn 5 make $15 + 10 + 5 = 30$.\n\n> **Watch out.** Multiply the area by the corn's fraction, not by the beans and peas fraction.",
    "一个 30 平方米的菜园，$\\frac{1}{2}$ 种豆角，$\\frac{1}{3}$ 种豌豆。玉米占 $1 - \\frac{5}{6} = \\frac{1}{6}$，30 的 $\\frac{1}{6}$ 是 5 平方米。\n\n检验：豆角 15、豌豆 10、玉米 5，$15 + 10 + 5 = 30$。\n\n> **注意。** 要用面积乘玉米所占的分数，不是乘豆角和豌豆所占的分数。",
  ],
  (rng) => {
    const [p, q] = rng.pick(leftoverPairs) as readonly [number, number];
    const a = qf(1, p);
    const b = qf(rng.int(1, Math.max(1, Math.floor(q / 3))), q);
    const both = a.add(b);
    const answer = qf(1, 1).sub(both);
    const L = lcm(p, q);
    const parts: Walk[] = [
      [
        ["Add the two parts", "两部分相加"],
        [`Use ${L} as the bottom.`, `用 ${L} 作分母。`],
        [`${a.toLatex()} + ${b.toLatex()} = ${both.toLatex()}`],
      ],
      [["Take it from 1", "用 1 减"], ["The whole garden is 1.", "整个菜园是 1。"], [`1 - ${both.toLatex()} = ${answer.toLatex()}`]],
    ];
    const figure = sumTape(
      [
        [a.toNumber(), `1/${p}`],
        [b.toNumber(), `${Number(b.n)}/${Number(b.d)}`],
        [answer.toNumber(), "?"],
      ],
      "1",
    );
    if (rng.bool()) {
      return answered(
        [
          `In a garden, $${a.toLatex()}$ of the land grows beans and $${b.toLatex()}$ grows peas. The rest grows corn. What fraction of the land grows corn?`,
          `一个菜园里，$${a.toLatex()}$ 的土地种豆角，$${b.toLatex()}$ 种豌豆，其余种玉米。种玉米的土地占几分之几？`,
        ],
        answer,
        parts,
        [
          `All three parts make 1: $${a.toLatex()} + ${b.toLatex()} + ${answer.toLatex()} = 1$.`,
          `三部分合起来是 1：$${a.toLatex()} + ${b.toLatex()} + ${answer.toLatex()} = 1$。`,
        ],
        [
          [both, "That is the beans and peas, not the corn.", "这是豆角和豌豆，不是玉米。"],
          [qf(1, 1).sub(a), "That takes away only the beans.", "这里只减去了豆角。"],
          [qf(1, 1).sub(b), "That takes away only the peas.", "这里只减去了豌豆。"],
        ],
        { form: "fraction", figure },
      );
    }
    const land = L * rng.int(2, 12);
    const area = answer.mul(Q.of(land));
    const [beans, peas] = [a.mul(Q.of(land)), b.mul(Q.of(land))];
    return answered(
      [
        `A garden has ${land} square meters. Of the land, $${a.toLatex()}$ grows beans and $${b.toLatex()}$ grows peas. The rest grows corn. How many square meters grow corn?`,
        `一个菜园有 ${land} 平方米，其中 $${a.toLatex()}$ 种豆角，$${b.toLatex()}$ 种豌豆，其余种玉米。种玉米的有多少平方米？`,
      ],
      area,
      [
        ...parts,
        [
          ["Find the area", "求面积"],
          [`Take $${answer.toLatex()}$ of ${land}.`, `求 ${land} 的 $${answer.toLatex()}$。`],
          [`${answer.toLatex()} \\times ${land} = ${area.toLatex()}`],
        ],
      ],
      [
        `Beans ${beans.toLatex()}, peas ${peas.toLatex()} and corn ${area.toLatex()} make $${beans.toLatex()} + ${peas.toLatex()} + ${area.toLatex()} = ${land}$.`,
        `豆角 ${beans.toLatex()}、豌豆 ${peas.toLatex()}、玉米 ${area.toLatex()}，$${beans.toLatex()} + ${peas.toLatex()} + ${area.toLatex()} = ${land}$。`,
      ],
      [
        [both.mul(Q.of(land)), "That is the area of the beans and peas, not the corn.", "这是豆角和豌豆的面积，不是玉米的。"],
        [beans, "That is the area of the beans.", "这是豆角的面积。"],
        [peas, "That is the area of the peas.", "这是豌豆的面积。"],
        [Q.of(land), "That is the whole garden.", "这是整个菜园的面积。"],
      ],
      { form: "integer", figure },
    );
  },
  sumTape(
    [
      [1 / 2, "1/2"],
      [1 / 3, "1/3"],
      [1 / 6, "?"],
    ],
    "1",
  ),
);

/** theWholePartWhenDenominatorsDiffer finds the whole-number part of a sum of mixed numbers by asking whether the fractions make a whole. */
export const theWholePartWhenDenominatorsDiffer = point(
  "the-whole-part-when-denominators-differ",
  ["The whole part when denominators differ", "分母不同时和的整数部分"],
  [
    "In $2\\frac{3}{4} + 1\\frac{2}{3}$, both fractions are more than $\\frac{1}{2}$, so together they make more than 1. The whole-number part is $2 + 1 + 1 = 4$.\n\nCheck: $2\\frac{9}{12} + 1\\frac{8}{12} = 3\\frac{17}{12} = 4\\frac{5}{12}$.\n\n> **Watch out.** Do not just add the whole numbers. The fractions can make one more whole.",
    "在 $2\\frac{3}{4} + 1\\frac{2}{3}$ 中，两个分数都大于 $\\frac{1}{2}$，合起来大于 1。所以整数部分是 $2 + 1 + 1 = 4$。\n\n检验：$2\\frac{9}{12} + 1\\frac{8}{12} = 3\\frac{17}{12} = 4\\frac{5}{12}$。\n\n> **注意。** 不能只把整数相加。两个分数合起来可能又凑成一个整体。",
  ],
  (rng) => {
    const [b, d] = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 2) as [number, number];
    const x = rng.int(1, 15);
    const y = rng.int(1, 15);
    const a = coprimeTo(rng, b, 1, b - 1);
    const c = coprimeTo(rng, d, 1, d - 1);
    const L = lcm(b, d);
    const s = (a * L) / b + (c * L) / d;
    const carry = s >= L ? 1 : 0;
    const total = mixedValue(x, a, b).add(mixedValue(y, c, d));
    return answered(
      [
        `What is the whole-number part of $${mx(x, a, b)} + ${mx(y, c, d)}$, written as a mixed number?`,
        `$${mx(x, a, b)} + ${mx(y, c, d)}$ 写成带分数后，整数部分是多少？`,
      ],
      x + y + carry,
      [
        [["Add the whole numbers", "整数部分相加"], ["Start with the whole parts.", "先算整数部分。"], [`${x} + ${y} = ${x + y}`]],
        [
          ["Look at the fractions", "看分数部分"],
          carry
            ? [
                `The fractions make $${fr(s, L)}$, which is at least 1, so one more whole.`,
                `分数部分合起来是 $${fr(s, L)}$，不小于 1，所以再进一。`,
              ]
            : [
                `The fractions make $${fr(s, L)}$, which is less than 1, so no more wholes.`,
                `分数部分合起来是 $${fr(s, L)}$，小于 1，所以不进位。`,
              ],
          [`${fr(a, b)} + ${fr(c, d)} = ${fr(s, L)}`],
        ],
      ],
      [
        `Work out the sum: it is $${mq(total)}$, and its whole-number part is ${x + y + carry}.`,
        `算出和：是 $${mq(total)}$，整数部分是 ${x + y + carry}。`,
      ],
      [
        carry
          ? [x + y, "That forgets the whole that the two fractions make.", "这里漏掉了两个分数凑成的一个整体。"]
          : [x + y + 1, "That carries a whole, but the two fractions make less than 1.", "这里进了一，但两个分数合起来不到 1。"],
        [x + y + 2, "Two fractions less than 1 make at most one more whole.", "两个小于 1 的分数最多只能再凑成一个整体。"],
        [x * y, "That multiplies the whole numbers.", "这是把整数相乘了。"],
      ],
      {
        figure: benchLine([
          [a, b],
          [c, d],
        ]),
      },
    );
  },
  benchLine([
    [2, 3],
    [3, 4],
  ]),
);

/** whichDifferenceNeedsRegrouping picks the mixed-number subtraction whose fraction taken away is the larger one. */
export const whichDifferenceNeedsRegrouping = point(
  "which-difference-needs-regrouping",
  ["Which difference needs regrouping", "哪个减法需要退位"],
  [
    "$5\\frac{1}{4} - 2\\frac{2}{3}$ needs regrouping, because $\\frac{2}{3}$ is more than $\\frac{1}{4}$. $\\frac{1}{4}$ is below one half and $\\frac{2}{3}$ is above it.\n\nCheck: in twelfths, $\\frac{1}{4} = \\frac{3}{12}$ and $\\frac{2}{3} = \\frac{8}{12}$, and 3 is less than 8.\n\n> **Watch out.** Compare the fractions, not the whole numbers. $5$ being bigger than $2$ does not settle it.",
    "$5\\frac{1}{4} - 2\\frac{2}{3}$ 需要退位，因为 $\\frac{2}{3}$ 比 $\\frac{1}{4}$ 大。$\\frac{1}{4}$ 小于二分之一，$\\frac{2}{3}$ 大于二分之一。\n\n检验：化成十二分之几，$\\frac{1}{4} = \\frac{3}{12}$，$\\frac{2}{3} = \\frac{8}{12}$，3 比 8 小。\n\n> **注意。** 要比较分数部分，不是比较整数部分。5 比 2 大并不能说明问题。",
  ],
  (rng) => {
    const x = rng.int(4, 20);
    const y = rng.int(1, 3);
    const small = rng.pick<[number, number]>([
      [1, 4],
      [1, 5],
      [1, 6],
      [1, 8],
      [1, 3],
      [2, 7],
      [3, 10],
    ]);
    const big = rng.pick<[number, number]>([
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [5, 8],
      [7, 9],
      [7, 10],
    ]);
    const [s, g] = [fr(small[0], small[1]), fr(big[0], big[1])];
    const L = lcm(small[1], big[1]);
    const [sx, gy] = [(small[0] * L) / small[1], (big[0] * L) / big[1]];
    return pickedMath(
      rng,
      ["Which subtraction needs regrouping?", "哪个减法需要退位？"],
      `${x}${s} - ${y}${g}`,
      [
        [
          `${x}${g} - ${y}${s}`,
          `Here $${g}$ is more than $${s}$, so the fraction can be taken away.`,
          `这里 $${g}$ 比 $${s}$ 大，分数部分够减。`,
        ],
        [
          `${x + 1}${g} - ${y + 1}${fr(1, 9)}`,
          `Here $${g}$ is more than $${fr(1, 9)}$, so the fraction can be taken away.`,
          `这里 $${g}$ 比 $${fr(1, 9)}$ 大，分数部分够减。`,
        ],
        [
          `${x + 2}${fr(4, 7)} - ${y}${s}`,
          `Here $${fr(4, 7)}$ is above one half and $${s}$ is below it, so no regrouping is needed.`,
          `这里 $${fr(4, 7)}$ 大于二分之一，$${s}$ 小于二分之一，不需要退位。`,
        ],
      ],
      [
        [
          ["Compare the fractions", "比较分数部分"],
          ["Regrouping is needed when the fraction taken away is the larger one.", "被减的分数比较大时，就需要退位。"],
        ],
        [
          ["Use one half", "用二分之一比"],
          [`$${s}$ is below one half and $${g}$ is above it.`, `$${s}$ 小于二分之一，$${g}$ 大于二分之一。`],
        ],
      ],
      [
        `With the bottom ${L}, $${s}$ is $${fr(sx, L)}$ and $${g}$ is $${fr(gy, L)}$, and ${sx} is less than ${gy}.`,
        `化成分母是 ${L} 的分数，$${s}$ 是 $${fr(sx, L)}$，$${g}$ 是 $${fr(gy, L)}$，${sx} 比 ${gy} 小。`,
      ],
      benchLine([small, big]),
    );
  },
  benchLine([
    [1, 4],
    [2, 3],
  ]),
);

/** theTopOverACommonDenominator finds the top of a mixed number written as an improper fraction over a larger denominator. */
export const theTopOverACommonDenominator = point(
  "the-top-over-a-common-denominator",
  ["The top over a common denominator", "通分后的分子"],
  [
    "For $3\\frac{1}{4} = \\frac{\\square}{12}$: each whole is 12 twelfths, so 3 wholes are 36. $\\frac{1}{4}$ is 3 twelfths. The top is $36 + 3 = 39$.\n\nCheck: $\\frac{39}{12}$ is 3 wholes and 3 twelfths left, which is $3\\frac{3}{12} = 3\\frac{1}{4}$.\n\n> **Watch out.** Multiply the whole number by the new bottom 12, not by 4.",
    "计算 $3\\frac{1}{4} = \\frac{\\square}{12}$：每个整体是 12 个十二分之一，3 个整体是 36 个。$\\frac{1}{4}$ 是 3 个十二分之一。分子是 $36 + 3 = 39$。\n\n检验：$\\frac{39}{12}$ 是 3 个整体还剩 3 个十二分之一，就是 $3\\frac{3}{12} = 3\\frac{1}{4}$。\n\n> **注意。** 整数部分要乘新分母 12，不是乘 4。",
  ],
  (rng) => {
    const b = rng.pick([2, 3, 4, 5, 6]);
    const k = rng.int(2, 4);
    const l = b * k;
    const a = coprimeTo(rng, b, 1, b - 1);
    const x = rng.int(2, 15);
    const top = x * l + a * k;
    return answered(
      [`Fill in the box: $$${mx(x, a, b)} = \\frac{\\square}{${l}}$$`, `填方框：$$${mx(x, a, b)} = \\frac{\\square}{${l}}$$`],
      top,
      [
        [["Rewrite the fraction part", "改写分数部分"], [`Use ${l} as the bottom.`, `用 ${l} 作分母。`], [`${fr(a, b)} = ${fr(a * k, l)}`]],
        [["Count the wholes", "算整数部分"], [`Each whole is ${l} parts.`, `每个整体是 ${l} 份。`], [`${x} \\times ${l} = ${x * l}`]],
        [["Add the tops", "分子相加"], ["Put the parts together.", "把份数合起来。"], [`${x * l} + ${a * k} = ${top}`]],
      ],
      [
        `$${fr(top, l)}$ is ${x} wholes and ${a * k} parts left, which is $${mx(x, a * k, l)}$, the same as $${mx(x, a, b)}$.`,
        `$${fr(top, l)}$ 是 ${x} 个整体还剩 ${a * k} 份，就是 $${mx(x, a * k, l)}$，和 $${mx(x, a, b)}$ 相等。`,
      ],
      [
        [x * l + a, `That forgets to rewrite the top ${a} for the bottom ${l}.`, `这里没有把分子 ${a} 按分母 ${l} 改写。`],
        [x * b + a, `That uses the old bottom ${b}, not ${l}.`, `这是用了原来的分母 ${b}，不是 ${l}。`],
        [x + a * k, `That adds the whole number instead of multiplying it by ${l}.`, `这是把整数直接加上了，没有乘 ${l}。`],
      ],
    );
  },
  barFigure(12, 39, 4),
);

/** whatMixedNumberCompletesATotal finds how much more is needed to reach a whole number after two mixed amounts. */
export const whatMixedNumberCompletesATotal = point(
  "what-mixed-number-completes-a-total",
  ["What mixed number completes a total", "凑成总数的带分数"],
  [
    "A baker needs 6 cups of flour and has used $1\\frac{1}{2}$ and $2\\frac{1}{4}$ cups. Used: $1\\frac{2}{4} + 2\\frac{1}{4} = 3\\frac{3}{4}$. Still needed: $6 - 3\\frac{3}{4} = 5\\frac{4}{4} - 3\\frac{3}{4} = 2\\frac{1}{4}$ cups.\n\nCheck: $3\\frac{3}{4} + 2\\frac{1}{4} = 5\\frac{4}{4} = 6$.\n\n> **Watch out.** Write 6 as $5\\frac{4}{4}$ before you subtract. Do not leave the 6 unchanged.",
    "面包师需要 6 杯面粉，已经用了 $1\\frac{1}{2}$ 杯和 $2\\frac{1}{4}$ 杯。已用：$1\\frac{2}{4} + 2\\frac{1}{4} = 3\\frac{3}{4}$。还需要：$6 - 3\\frac{3}{4} = 5\\frac{4}{4} - 3\\frac{3}{4} = 2\\frac{1}{4}$ 杯。\n\n检验：$3\\frac{3}{4} + 2\\frac{1}{4} = 5\\frac{4}{4} = 6$。\n\n> **注意。** 相减前先把 6 写成 $5\\frac{4}{4}$，不能让 6 保持不变。",
  ],
  (rng) => {
    const p = rng.bool() ? relatedPair(rng) : unrelatedPair(rng);
    const first = mixedValue(rng.int(1, 4), p.a, p.b);
    const second = mixedValue(rng.int(1, 4), p.c, p.d);
    const sum = first.add(second);
    const D = Number(sum.d);
    const whole = Math.floor(sum.toNumber()) + 1 + rng.int(0, 3);
    const answer = Q.of(whole).sub(sum);
    return answered(
      [
        `A baker needs ${whole} cups of flour in all and has used $${mq(first)}$ cups and $${mq(second)}$ cups so far. How many more cups does the baker need?`,
        `面包师一共需要 ${whole} 杯面粉，已经用了 $${mq(first)}$ 杯和 $${mq(second)}$ 杯。还需要多少杯？`,
      ],
      answer,
      [
        [
          ["Add what is used", "把已用的加起来"],
          [`Use ${lcm(p.b, p.d)} as the bottom for the fractions.`, `分数部分用 ${lcm(p.b, p.d)} 作分母。`],
          [`${mq(first)} + ${mq(second)} = ${mq(sum)}`],
        ],
        [
          ["Subtract from the total", "用总数减"],
          [`Write ${whole} as $${mx(whole - 1, D, D)}$ first.`, `先把 ${whole} 写成 $${mx(whole - 1, D, D)}$。`],
          [`${mx(whole - 1, D, D)} - ${mq(sum)} = ${mq(answer)}`],
        ],
      ],
      [`Add back: $${mq(sum)} + ${mq(answer)} = ${whole}$.`, `加回去：$${mq(sum)} + ${mq(answer)} = ${whole}$。`],
      [
        [sum, "That is the flour already used, not the flour still needed.", "这是已经用掉的面粉，不是还需要的。"],
        [Q.of(whole).sub(first), "That takes away only the first amount.", "这里只减去了第一次用的量。"],
        [Q.of(whole).sub(second), "That takes away only the second amount.", "这里只减去了第二次用的量。"],
        [answer.add(Q.one), `That does not lower ${whole} to ${whole - 1} when regrouping.`, `退位时没有把 ${whole} 变成 ${whole - 1}。`],
      ],
      {
        form: "mixed",
        figure: sumTape(
          [
            [first.toNumber(), mixedText(Math.floor(first.toNumber()), p.a, p.b)],
            [second.toNumber(), mixedText(Math.floor(second.toNumber()), p.c, p.d)],
            [answer.toNumber(), "?"],
          ],
          `${whole}`,
        ),
      },
    );
  },
  sumTape(
    [
      [1.5, "1 1/2"],
      [2.25, "2 1/4"],
      [2.25, "?"],
    ],
    "6",
  ),
);

/** theMissingUnitFraction finds the missing bottom in a product of two unit fractions. */
export const theMissingUnitFraction = point(
  "the-missing-unit-fraction",
  ["The missing unit fraction", "缺少的单位分数"],
  [
    "For $\\frac{1}{3} \\times \\frac{1}{\\square} = \\frac{1}{12}$, the bottoms multiply: $3 \\times \\square = 12$, so the box is 4.\n\nCheck: $\\frac{1}{3} \\times \\frac{1}{4} = \\frac{1}{12}$.\n\n> **Watch out.** The box is not 12. 12 is the bottom of the product.",
    "计算 $\\frac{1}{3} \\times \\frac{1}{\\square} = \\frac{1}{12}$，分母相乘：$3 \\times \\square = 12$，所以方框里是 4。\n\n检验：$\\frac{1}{3} \\times \\frac{1}{4} = \\frac{1}{12}$。\n\n> **注意。** 方框里不是 12。12 是积的分母。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    return answered(
      [
        `Fill in the box: $$${fr(1, a)} \\times \\frac{1}{\\square} = ${fr(1, a * b)}$$`,
        `填方框：$$${fr(1, a)} \\times \\frac{1}{\\square} = ${fr(1, a * b)}$$`,
      ],
      b,
      [
        [
          ["Multiply the bottoms", "分母相乘"],
          ["The bottom of the product is the bottoms multiplied.", "积的分母是两个分母的积。"],
          [`${a} \\times \\square = ${a * b}`],
        ],
        [
          ["Divide", "做除法"],
          [`Find the number that ${a} is multiplied by.`, `求 ${a} 乘几等于 ${a * b}。`],
          [`${a * b} \\div ${a} = ${b}`],
        ],
      ],
      [
        `Put it back: $${fr(1, a)} \\times ${fr(1, b)} = ${fr(1, a * b)}$.`,
        `代回去：$${fr(1, a)} \\times ${fr(1, b)} = ${fr(1, a * b)}$。`,
      ],
      [
        [a * b, "That is the bottom of the product, not the missing factor.", "这是积的分母，不是缺少的因数。"],
        [a * b - a, "That subtracts instead of dividing.", "这是做成减法了。"],
        [a, "That is the bottom you were given, not the missing one.", "这是题目里已有的分母，不是缺少的那个。"],
      ],
      { figure: productGrid(1, b, 1, a) },
    );
  },
  productGrid(1, 4, 1, 3),
);

/** doubleShadedCells counts the cells shaded twice in an area model of a product. */
export const doubleShadedCells = point(
  "double-shaded-cells",
  ["Double-shaded cells", "涂了两次的格子"],
  [
    "To show $\\frac{2}{3} \\times \\frac{3}{4}$, cut a square into 3 columns and 4 rows. Shade 2 columns and 3 rows. They overlap in $2 \\times 3 = 6$ cells.\n\nCheck: the product is $\\frac{6}{12}$, and 6 is the top.\n\n> **Watch out.** Count only the cells shaded twice, not every shaded cell.",
    "表示 $\\frac{2}{3} \\times \\frac{3}{4}$，把正方形分成 3 列 4 行。涂 2 列和 3 行，重叠的格子有 $2 \\times 3 = 6$ 个。\n\n检验：积是 $\\frac{6}{12}$，6 正是分子。\n\n> **注意。** 只数涂了两次的格子，不是所有涂色的格子。",
  ],
  (rng) => {
    const b = rng.int(2, 9);
    const d = rng.int(2, 9);
    const a = rng.int(1, b - 1);
    const c = rng.int(1, d - 1);
    return answered(
      [
        `A square is cut into ${b} columns and ${d} rows to show $${fr(a, b)} \\times ${fr(c, d)}$. How many cells are shaded twice?`,
        `一个正方形分成 ${b} 列 ${d} 行，表示 $${fr(a, b)} \\times ${fr(c, d)}$。有多少个格子涂了两次？`,
      ],
      a * c,
      [
        [
          ["Shade the columns", "涂列"],
          [`${a} of the ${b} columns are shaded.`, `${b} 列中涂 ${a} 列。`],
        ],
        [
          ["Shade the rows", "涂行"],
          [`${c} of the ${d} rows are shaded.`, `${d} 行中涂 ${c} 行。`],
        ],
        [
          ["Count the overlap", "数重叠部分"],
          ["Each shaded column meets each shaded row once.", "每个涂色的列和每个涂色的行各相交一次。"],
          [`${a} \\times ${c} = ${a * c}`],
        ],
      ],
      [
        `Multiply the tops: $${a} \\times ${c} = ${a * c}$, the top of $${fr(a, b)} \\times ${fr(c, d)}$.`,
        `分子相乘：$${a} \\times ${c} = ${a * c}$，正是 $${fr(a, b)} \\times ${fr(c, d)}$ 的分子。`,
      ],
      [
        [b * d, "That is all the cells.", "这是所有格子的个数。"],
        [a + c, "That adds the columns and the rows.", "这是把列数和行数相加了。"],
        [a * d + c * b - a * c, "That counts every shaded cell, not only those shaded twice.", "这是所有涂色的格子，不只是涂了两次的。"],
      ],
      { figure: productGrid(a, b, c, d) },
    );
  },
  productGrid(2, 3, 3, 4),
);

/** theNumberThatMakesTheSwapTrue fills in the top that stays put when two denominators swap. */
export const theNumberThatMakesTheSwapTrue = point(
  "the-number-that-makes-the-swap-true",
  ["The number that makes the swap true", "使交换成立的数"],
  [
    "In $\\frac{2}{7} \\times \\frac{5}{9} = \\frac{2}{9} \\times \\frac{\\square}{7}$, only the bottoms changed places, so the box is 5.\n\nCheck: both sides have the top $2 \\times 5 = 10$ and the bottom $7 \\times 9 = 63$.\n\n> **Watch out.** The box is a top, so it is not 7 or 9.",
    "在 $\\frac{2}{7} \\times \\frac{5}{9} = \\frac{2}{9} \\times \\frac{\\square}{7}$ 中，只有分母交换了位置，所以方框里是 5。\n\n检验：两边的分子都是 $2 \\times 5 = 10$，分母都是 $7 \\times 9 = 63$。\n\n> **注意。** 方框在分子上，所以不是 7 也不是 9。",
  ],
  (rng) => {
    const [a, c] = rng.sample([2, 3, 4, 5, 6, 7, 8, 9, 11], 2) as [number, number];
    const [b, d] = rng.sample([5, 6, 7, 8, 9, 10, 12, 14, 15, 16], 2) as [number, number];
    return answered(
      [
        `Fill in the box: $$${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times \\frac{\\square}{${b}}$$`,
        `填方框：$$${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times \\frac{\\square}{${b}}$$`,
      ],
      c,
      [
        [
          ["Compare the two sides", "比较两边"],
          [`On the right, ${a} sits over ${d}, so the bottoms changed places.`, `右边 ${a} 在 ${d} 上面，说明分母交换了位置。`],
        ],
        [
          ["Keep the tops", "分子不动"],
          [`The tops do not move, so the second top is still ${c}.`, `分子不动，所以第二个分子仍是 ${c}。`],
        ],
      ],
      [
        `Both sides have the top $${a} \\times ${c} = ${a * c}$ and the bottom $${b} \\times ${d} = ${b * d}$.`,
        `两边的分子都是 $${a} \\times ${c} = ${a * c}$，分母都是 $${b} \\times ${d} = ${b * d}$。`,
      ],
      [
        [a, `That is the first top, which is already on the right.`, `这是第一个分子，右边已经有了。`],
        [b, "That is a bottom, but the box is a top.", "这是分母，但方框在分子上。"],
        [d, "That is a bottom, but the box is a top.", "这是分母，但方框在分子上。"],
      ],
    );
  },
  productGrid(5, 9, 2, 7),
);

/** aFractionOfWhatIsLeft takes a second fraction of what is left after a first fraction is spent. */
export const aFractionOfWhatIsLeft = point(
  "a-fraction-of-what-is-left",
  ["A fraction of what is left", "剩余部分的几分之几"],
  [
    "Ana has 60 dollars and spends $\\frac{1}{3}$ on a book: 20 dollars, so 40 are left. Then she spends $\\frac{1}{4}$ of what is left on lunch: 10 dollars. Now she has 30 dollars.\n\nCheck: $20 + 10 + 30 = 60$.\n\n> **Watch out.** Take $\\frac{1}{4}$ of what is left, 40, not of all 60.",
    "安娜有 60 美元，用其中的 $\\frac{1}{3}$ 买书：20 美元，还剩 40 美元。她又用剩下的 $\\frac{1}{4}$ 吃午饭：10 美元。现在她还有 30 美元。\n\n检验：$20 + 10 + 30 = 60$。\n\n> **注意。** 要求剩下的 40 的 $\\frac{1}{4}$，不是 60 的。",
  ],
  (rng) => {
    const p = rng.pick([2, 3, 4, 5]);
    const q = rng.pick([2, 3, 4, 5, 6]);
    const money = p * q * rng.int(2, 12);
    const spent = money / p;
    const rest = money - spent;
    const second = rest / q;
    const answer = rest - second;
    return answered(
      [
        `Ana has ${money} dollars. Ana spends $\\frac{1}{${p}}$ of it on a book, and then $\\frac{1}{${q}}$ of what is left on lunch. How many dollars does Ana have now?`,
        `安娜有 ${money} 美元。安娜用其中的 $\\frac{1}{${p}}$ 买书，又用剩下的 $\\frac{1}{${q}}$ 吃午饭。安娜现在还有多少美元？`,
      ],
      answer,
      [
        [
          ["Pay for the book", "买书"],
          [`Take $\\frac{1}{${p}}$ of ${money}.`, `求 ${money} 的 $\\frac{1}{${p}}$。`],
          [`${money} \\div ${p} = ${spent}`, `${money} - ${spent} = ${rest}`],
        ],
        [
          ["Pay for lunch", "吃午饭"],
          [`Take $\\frac{1}{${q}}$ of what is left, ${rest}.`, `求剩下的 ${rest} 的 $\\frac{1}{${q}}$。`],
          [`${rest} \\div ${q} = ${second}`, `${rest} - ${second} = ${answer}`],
        ],
      ],
      [`Add it all up: $${spent} + ${second} + ${answer} = ${money}$.`, `全部加起来：$${spent} + ${second} + ${answer} = ${money}$。`],
      [
        [
          money - spent - money / q,
          "That takes the second fraction of all the money, not of what is left.",
          "这是求全部钱的几分之一，不是剩下的钱的。",
        ],
        [rest, "That stops after the book.", "这里只算到买书为止。"],
        [second, "That is the cost of lunch, not what is left.", "这是午饭的钱，不是剩下的钱。"],
        [money - second, "That forgets the book.", "这里漏了买书的钱。"],
      ],
      {
        figure: sumTape(
          [
            [spent, `${spent}`],
            [second, `${second}`],
            [answer, "?"],
          ],
          `${money}`,
        ),
      },
    );
  },
  sumTape(
    [
      [20, "20"],
      [10, "10"],
      [30, "?"],
    ],
    "60",
  ),
);

/** eachPartOfAMixedNumber fills in the fraction part of a whole number times a mixed number. */
export const eachPartOfAMixedNumber = point(
  "multiplying-each-part-of-a-mixed-number",
  ["Multiplying each part", "分别乘每一部分"],
  [
    "$3 \\times 2\\frac{1}{4} = 6 + \\frac{\\square}{4}$. The 3 multiplies both parts: $3 \\times 2 = 6$ and $3 \\times \\frac{1}{4} = \\frac{3}{4}$, so the box is 3.\n\nCheck: $3 \\times \\frac{9}{4} = \\frac{27}{4}$, which is $6\\frac{3}{4}$.\n\n> **Watch out.** The box is not 1. The 3 multiplies the fraction part too.",
    "$3 \\times 2\\frac{1}{4} = 6 + \\frac{\\square}{4}$。3 要乘两部分：$3 \\times 2 = 6$，$3 \\times \\frac{1}{4} = \\frac{3}{4}$，所以方框里是 3。\n\n检验：$3 \\times \\frac{9}{4} = \\frac{27}{4}$，正是 $6\\frac{3}{4}$。\n\n> **注意。** 方框里不是 1。3 也要乘分数部分。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const a = rng.int(1, 12);
    const d = rng.int(3, 12);
    const n = rng.int(1, d - 1);
    return answered(
      [
        `Fill in the box: $$${k} \\times ${mx(a, n, d)} = ${k * a} + \\frac{\\square}{${d}}$$`,
        `填方框：$$${k} \\times ${mx(a, n, d)} = ${k * a} + \\frac{\\square}{${d}}$$`,
      ],
      k * n,
      [
        [
          ["Split the mixed number", "拆开带分数"],
          [`$${mx(a, n, d)}$ is ${a} and $${fr(n, d)}$.`, `$${mx(a, n, d)}$ 是 ${a} 加 $${fr(n, d)}$。`],
        ],
        [
          ["Multiply each part", "分别乘"],
          [`${k} multiplies both parts.`, `${k} 要乘两部分。`],
          [`${k} \\times ${a} = ${k * a}`, `${k} \\times ${fr(n, d)} = ${fr(k * n, d)}`],
        ],
      ],
      [
        `Use the improper fraction:\n\n$$${k} \\times ${fr(a * d + n, d)} = ${fr(k * (a * d + n), d)}$$\n\nTaking away ${k * a}, which is $${fr(k * a * d, d)}$, leaves $${fr(k * n, d)}$.`,
        `用假分数算：\n\n$$${k} \\times ${fr(a * d + n, d)} = ${fr(k * (a * d + n), d)}$$\n\n减去 ${k * a}，也就是 $${fr(k * a * d, d)}$，剩下 $${fr(k * n, d)}$。`,
      ],
      [
        [n, `That leaves the fraction part as it was. ${k} multiplies it too.`, `这里分数部分没有变。${k} 也要乘它。`],
        [k + n, `That adds ${k} instead of multiplying.`, `这里加了 ${k}，没有乘。`],
        [k * d, "That multiplies the bottom, not the top.", "这是乘了分母，不是分子。"],
      ],
      { figure: partsArea(qf(k, 1), a, n, d) },
    );
  },
  partsArea(qf(3, 1), 2, 1, 4),
);

/** theFractionThatMakesOne finds the fraction whose product with a mixed number is 1. */
export const theFractionThatMakesOne = point(
  "the-number-that-makes-one",
  ["The fraction that makes 1", "使积为 1 的分数"],
  [
    "What times $1\\frac{2}{3}$ is 1? Write $1\\frac{2}{3} = \\frac{5}{3}$ and turn it over: $\\frac{3}{5}$.\n\nCheck: $\\frac{5}{3} \\times \\frac{3}{5} = \\frac{15}{15} = 1$.\n\n> **Watch out.** Change the mixed number first. Turning over only $\\frac{2}{3}$ gives $\\frac{3}{2}$, which is wrong.",
    "什么数乘 $1\\frac{2}{3}$ 等于 1？先写成 $1\\frac{2}{3} = \\frac{5}{3}$，再颠倒过来：$\\frac{3}{5}$。\n\n检验：$\\frac{5}{3} \\times \\frac{3}{5} = \\frac{15}{15} = 1$。\n\n> **注意。** 先把带分数化成假分数。只颠倒 $\\frac{2}{3}$ 得到 $\\frac{3}{2}$，是错的。",
  ],
  (rng) => {
    const d = rng.int(2, 12);
    const a = rng.int(1, 6);
    const n = coprimeTo(rng, d, 1, d - 1);
    const top = a * d + n;
    return answered(
      [`What fraction times $${mx(a, n, d)}$ equals 1?`, `什么分数乘 $${mx(a, n, d)}$ 等于 1？`],
      qf(d, top),
      [
        improperStep([a, n, d]),
        [["Turn it over", "颠倒过来"], ["Swap the top and the bottom.", "交换分子和分母。"], [`${fr(top, d)} \\to ${fr(d, top)}`]],
      ],
      [
        `Multiply them, and the product is 1: $${fr(top, d)} \\times ${fr(d, top)} = ${fr(top * d, d * top)} = 1$.`,
        `相乘，积是 1：$${fr(top, d)} \\times ${fr(d, top)} = ${fr(top * d, d * top)} = 1$。`,
      ],
      [
        [qf(d, n), "That turns over only the fraction part.", "这里只颠倒了分数部分。"],
        [qf(top, d), "That is the mixed number itself, not the number that makes 1.", "这是带分数本身，不是使积为 1 的数。"],
        [qf(1, top), `That puts 1 on top instead of ${d}.`, `分子应该是 ${d}，不是 1。`],
      ],
      { form: "fraction", figure: mixedLine(a, n, d) },
    );
  },
  mixedLine(1, 2, 3),
);

/** boundsForAMixedProduct finds the whole-number products that a product of two mixed numbers lies between. */
export const boundsForAMixedProduct = point(
  "bounds-for-a-mixed-product",
  ["Bounds for a mixed product", "带分数积的范围"],
  [
    "$2\\frac{1}{2} \\times 3\\frac{1}{3}$ lies between $2 \\times 3 = 6$ and $3 \\times 4 = 12$. Rounding both down gives too little, and rounding both up gives too much.\n\nCheck: $\\frac{5}{2} \\times \\frac{10}{3} = \\frac{50}{6} = 8\\frac{1}{3}$, which is between 6 and 12.\n\n> **Watch out.** Round both numbers the same way. Rounding one up and one down gives no bound.",
    "$2\\frac{1}{2} \\times 3\\frac{1}{3}$ 在 $2 \\times 3 = 6$ 和 $3 \\times 4 = 12$ 之间。两个数都向下取整得到的偏小，都向上取整得到的偏大。\n\n检验：$\\frac{5}{2} \\times \\frac{10}{3} = \\frac{50}{6} = 8\\frac{1}{3}$，在 6 和 12 之间。\n\n> **注意。** 两个数要朝同一个方向取整。一个向上、一个向下，得不到范围。",
  ],
  (rng) => {
    const a = rng.int(2, 15);
    const b = rng.int(2, 15);
    const [d, e] = rng.sample([2, 3, 4, 5, 6, 8], 2) as [number, number];
    const n = coprimeTo(rng, d, 1, d - 1);
    const m = coprimeTo(rng, e, 1, e - 1);
    const up = rng.bool();
    const [x, y] = up ? [a + 1, b + 1] : [a, b];
    return answered(
      up
        ? [
            `$${mx(a, n, d)} \\times ${mx(b, m, e)}$ is less than the product of the next whole numbers. What is that product?`,
            `$${mx(a, n, d)} \\times ${mx(b, m, e)}$ 小于两个数都向上取整后的积。这个积是多少？`,
          ]
        : [
            `$${mx(a, n, d)} \\times ${mx(b, m, e)}$ is greater than the product of the whole parts. What is that product?`,
            `$${mx(a, n, d)} \\times ${mx(b, m, e)}$ 大于两个整数部分的积。这个积是多少？`,
          ],
      x * y,
      [
        up
          ? [
              ["Round both up", "都向上取整"],
              [
                `$${mx(a, n, d)}$ becomes ${a + 1}, and $${mx(b, m, e)}$ becomes ${b + 1}.`,
                `$${mx(a, n, d)}$ 变成 ${a + 1}，$${mx(b, m, e)}$ 变成 ${b + 1}。`,
              ],
            ]
          : [
              ["Keep the whole parts", "取整数部分"],
              [
                `$${mx(a, n, d)}$ becomes ${a}, and $${mx(b, m, e)}$ becomes ${b}.`,
                `$${mx(a, n, d)}$ 变成 ${a}，$${mx(b, m, e)}$ 变成 ${b}。`,
              ],
            ],
        [["Multiply", "相乘"], ["Multiply the two whole numbers.", "把两个整数相乘。"], [`${x} \\times ${y} = ${x * y}`]],
      ],
      [
        `The product is $${mq(mixedValue(a, n, d).mul(mixedValue(b, m, e)))}$, which is between ${a * b} and ${(a + 1) * (b + 1)}.`,
        `积是 $${mq(mixedValue(a, n, d).mul(mixedValue(b, m, e)))}$，在 ${a * b} 和 ${(a + 1) * (b + 1)} 之间。`,
      ],
      up
        ? [
            [a * b, "That rounds both down.", "这是都向下取整了。"],
            [a * b + 1, "That adds 1 to the product instead of rounding each number up.", "这是给积加 1，不是把每个数向上取整。"],
            [(a + 1) * b, "That rounds up only the first number.", "这里只把第一个数向上取整了。"],
          ]
        : [
            [(a + 1) * (b + 1), "That rounds both up.", "这是都向上取整了。"],
            [a + b, "That adds the whole parts.", "这是把整数部分相加了。"],
            [a * (b + 1), "That rounds up the second number.", "这里把第二个数向上取整了。"],
          ],
      { figure: mixedArea(a, n, d, b, m, e) },
    );
  },
  mixedArea(2, 1, 2, 3, 1, 3),
);

/** halfABatchMore finds how much more half a batch adds to a whole number of batches. */
export const halfABatchMore = point(
  "half-a-batch-more",
  ["Half a batch more", "多半批"],
  [
    "One batch uses $2\\frac{1}{2}$ cups. $3\\frac{1}{2}$ batches use half a batch more than 3 batches: $\\frac{1}{2} \\times \\frac{5}{2} = \\frac{5}{4} = 1\\frac{1}{4}$ cups more.\n\nCheck: $3\\frac{1}{2} \\times 2\\frac{1}{2} = 8\\frac{3}{4}$ and $3 \\times 2\\frac{1}{2} = 7\\frac{1}{2}$, which differ by $1\\frac{1}{4}$.\n\n> **Watch out.** The extra is half of a batch, not half a cup.",
    "一批用 $2\\frac{1}{2}$ 杯。$3\\frac{1}{2}$ 批比 3 批多半批：多 $\\frac{1}{2} \\times \\frac{5}{2} = \\frac{5}{4} = 1\\frac{1}{4}$ 杯。\n\n检验：$3\\frac{1}{2} \\times 2\\frac{1}{2} = 8\\frac{3}{4}$，$3 \\times 2\\frac{1}{2} = 7\\frac{1}{2}$，相差 $1\\frac{1}{4}$。\n\n> **注意。** 多出的是半批的量，不是半杯。",
  ],
  (rng) => {
    const d = rng.pick([2, 3, 4, 5, 6, 8]);
    const a = rng.int(1, 6);
    const n = coprimeTo(rng, d, 1, d - 1);
    const k = rng.int(2, 6);
    const top = a * d + n;
    const amount = qf(top, d);
    const extra = qf(top, 2 * d);
    return answered(
      [
        `A recipe uses $${mx(a, n, d)}$ cups of flour per batch. How many more cups do $${mx(k, 1, 2)}$ batches use than ${k} batches?`,
        `每批食谱用 $${mx(a, n, d)}$ 杯面粉。$${mx(k, 1, 2)}$ 批比 ${k} 批多用多少杯？`,
      ],
      extra,
      [
        [
          ["Find the difference", "找出差别"],
          [`$${mx(k, 1, 2)}$ batches is ${k} batches and half a batch more.`, `$${mx(k, 1, 2)}$ 批就是 ${k} 批再加半批。`],
        ],
        [
          ["Take half a batch", "求半批"],
          ["Multiply one batch by one half.", "用一批的量乘二分之一。"],
          [`${fr(1, 2)} \\times ${fr(top, d)} = ${fr(top, 2 * d)}`],
        ],
        ...tidy(top, 2 * d),
      ],
      [
        `Work out both totals:\n\n$$${mx(k, 1, 2)} \\times ${mx(a, n, d)} = ${mq(amount.mul(qf(2 * k + 1, 2)))}$$\n\n$$${k} \\times ${mx(a, n, d)} = ${mq(amount.mul(qf(k, 1)))}$$\n\nThey differ by $${mq(extra)}$.`,
        `算出两个总量：\n\n$$${mx(k, 1, 2)} \\times ${mx(a, n, d)} = ${mq(amount.mul(qf(2 * k + 1, 2)))}$$\n\n$$${k} \\times ${mx(a, n, d)} = ${mq(amount.mul(qf(k, 1)))}$$\n\n相差 $${mq(extra)}$。`,
      ],
      [
        [amount, "That is a whole batch, not half a batch.", "这是一整批，不是半批。"],
        [amount.mul(qf(k, 1)), `That is ${k} batches.`, `这是 ${k} 批的量。`],
        [qf(1, 2), "That is half a cup, not half a batch.", "这是半杯，不是半批。"],
      ],
      {
        form: "mixed",
        figure: tapeFigure(
          [
            {
              pieces: [
                ...Array.from({ length: k }, () => ({ size: 2, text: mixedText(a, n, d), lit: false })),
                { size: 1, text: "?", lit: true },
              ],
            },
          ],
          [
            `A bar of ${k} batches of ${mixedText(a, n, d)} cups and half a batch more.`,
            `一个长条：${k} 批，每批 ${mixedText(a, n, d)} 杯，再加半批。`,
          ],
        ),
      },
    );
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 2, text: "2 1/2", lit: false },
          { size: 2, text: "2 1/2", lit: false },
          { size: 2, text: "2 1/2", lit: false },
          { size: 1, text: "?", lit: true },
        ],
      },
    ],
    ["A bar of 3 batches of 2 1/2 cups and half a batch more.", "一个长条：3 批，每批 2 1/2 杯，再加半批。"],
  ),
);

/** tilesThatFillTheUnitSquare counts the unit-fraction tiles that fill a unit square. */
export const tilesThatFillTheUnitSquare = point(
  "tiles-that-fill-the-unit-square",
  ["Tiles that fill the unit square", "铺满单位正方形的小块"],
  [
    "A tile $\\frac{1}{3}$ by $\\frac{1}{5}$ unit fits 3 times one way and 5 times the other, so $3 \\times 5 = 15$ tiles fill the unit square.\n\nCheck: each tile is $\\frac{1}{3} \\times \\frac{1}{5} = \\frac{1}{15}$, and 15 of them make 1.\n\n> **Watch out.** Multiply, do not add. $3 + 5 = 8$ tiles only make one row and one column.",
    "一块 $\\frac{1}{3}$ 乘 $\\frac{1}{5}$ 单位的小砖，一边能放 3 块，另一边能放 5 块，所以 $3 \\times 5 = 15$ 块铺满单位正方形。\n\n检验：每块是 $\\frac{1}{3} \\times \\frac{1}{5} = \\frac{1}{15}$，15 块就是 1。\n\n> **注意。** 要乘，不是加。$3 + 5 = 8$ 块只够一行和一列。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(2, 12);
    return answered(
      [
        `A tile measures $${fr(1, a)}$ unit by $${fr(1, b)}$ unit. How many of these tiles fill a square of side 1 unit?`,
        `一块小砖长 $${fr(1, a)}$ 单位、宽 $${fr(1, b)}$ 单位。铺满边长 1 单位的正方形需要多少块？`,
      ],
      a * b,
      [
        [
          ["Count each way", "数两个方向"],
          [`${a} tiles fit along one side and ${b} along the other.`, `一边能放 ${a} 块，另一边能放 ${b} 块。`],
        ],
        [["Multiply", "相乘"], ["Rows times columns.", "行数乘列数。"], [`${a} \\times ${b} = ${a * b}`]],
      ],
      [
        `${a * b} tiles of $${fr(1, a * b)}$ make 1, and each tile is $${fr(1, a)} \\times ${fr(1, b)} = ${fr(1, a * b)}$.`,
        `${a * b} 块 $${fr(1, a * b)}$ 就是 1，每块正是 $${fr(1, a)} \\times ${fr(1, b)} = ${fr(1, a * b)}$。`,
      ],
      [
        [a + b, "That adds the two sides.", "这是把两边的块数相加了。"],
        [2 * (a + b), "That adds the sides twice, like a perimeter.", "这是像求周长一样把两边加了两遍。"],
        [a, "That is only one row.", "这只是一行。"],
        [b, "That is only one column.", "这只是一列。"],
      ],
      { figure: productGrid(1, b, 1, a) },
    );
  },
  productGrid(1, 5, 1, 3),
);

/** theAreaOfAFractionalSquare finds the area of a square with a fraction side. */
export const theAreaOfAFractionalSquare = point(
  "the-area-of-a-fractional-square",
  ["The area of a fractional square", "分数边长正方形的面积"],
  [
    "A square with side $\\frac{2}{3}$ meter has area $\\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$ square meter.\n\nCheck: the model has $3 \\times 3 = 9$ small squares, and $2 \\times 2 = 4$ are shaded twice.\n\n> **Watch out.** Multiply the side by itself. $2 \\times \\frac{2}{3}$ doubles the side and is not the area.",
    "边长 $\\frac{2}{3}$ 米的正方形，面积是 $\\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$ 平方米。\n\n检验：模型里有 $3 \\times 3 = 9$ 个小正方形，其中 $2 \\times 2 = 4$ 个涂了两次。\n\n> **注意。** 边长要乘边长。$2 \\times \\frac{2}{3}$ 是把边长乘 2，不是面积。",
  ],
  (rng) => {
    const d = rng.int(2, 12);
    const n = rng.int(1, d - 1);
    const s = qf(n, d);
    return answered(
      [
        `A square has side $${fr(n, d)}$ meter. What is its area, in square meters?`,
        `一个正方形的边长是 $${fr(n, d)}$ 米。它的面积是多少平方米？`,
      ],
      s.mul(s),
      [
        [
          ["Multiply the side by itself", "边长乘边长"],
          ["Both the top and the bottom are squared.", "分子和分母都要自乘。"],
          [`${fr(n, d)} \\times ${fr(n, d)} = ${fr(n * n, d * d)}`],
        ],
        ...tidy(n * n, d * d),
      ],
      [
        `The model has $${d} \\times ${d} = ${d * d}$ small squares, and $${n} \\times ${n} = ${n * n}$ are shaded twice.`,
        `模型里有 $${d} \\times ${d} = ${d * d}$ 个小正方形，其中 $${n} \\times ${n} = ${n * n}$ 个涂了两次。`,
      ],
      [
        [s.mul(qf(2, 1)), "That doubles the side.", "这是把边长乘 2 了。"],
        [s.mul(qf(4, 1)), "That is the perimeter, not the area.", "这是周长，不是面积。"],
        [qf(n * n, d), "That squares only the top.", "这里只把分子自乘了。"],
      ],
      { form: "fraction", figure: productGrid(n, d, n, d) },
    );
  },
  productGrid(2, 3, 2, 3),
);

/** theProductClosestToTheNumber picks the factor closest to 1, which changes a number the least. */
export const theProductClosestToTheNumber = point(
  "the-product-closest-to-the-number",
  ["The product closest to the number", "最接近原数的积"],
  [
    "Of $\\frac{1}{2} \\times 80$, $\\frac{9}{10} \\times 80$, $\\frac{3}{2} \\times 80$ and $\\frac{7}{4} \\times 80$, the closest to 80 is $\\frac{9}{10} \\times 80$. Its factor is only $\\frac{1}{10}$ away from 1.\n\nCheck: $\\frac{9}{10} \\times 80 = 72$, just 8 less than 80.\n\n> **Watch out.** Look at how far each factor is from 1, on either side.",
    "在 $\\frac{1}{2} \\times 80$、$\\frac{9}{10} \\times 80$、$\\frac{3}{2} \\times 80$ 和 $\\frac{7}{4} \\times 80$ 中，最接近 80 的是 $\\frac{9}{10} \\times 80$。它的因数离 1 只差 $\\frac{1}{10}$。\n\n检验：$\\frac{9}{10} \\times 80 = 72$，只比 80 少 8。\n\n> **注意。** 看每个因数离 1 有多远，比 1 大或比 1 小都要看。",
  ],
  (rng) => {
    const n = rng.int(40, 400);
    const near = rng.pick<[number, number]>([
      [9, 10],
      [11, 10],
      [7, 8],
      [9, 8],
      [11, 12],
      [13, 12],
    ]);
    const others = rng.sample<[number, number]>(
      [
        [1, 2],
        [3, 2],
        [1, 3],
        [5, 2],
        [2, 3],
        [7, 4],
        [1, 4],
        [9, 4],
      ],
      3,
    );
    const gap = ([p, q]: readonly [number, number]) => mq(qf(Math.abs(p - q), q));
    const nearQ = qf(near[0], near[1]);
    return pickedMath(
      rng,
      [`Without multiplying, which product is closest to ${n}?`, `不用计算，哪个积最接近 ${n}？`],
      `${fr(near[0], near[1])} \\times ${n}`,
      others.map(
        (o) =>
          [
            `${fr(o[0], o[1])} \\times ${n}`,
            `$${fr(o[0], o[1])}$ is $${gap(o)}$ away from 1, farther than $${fr(near[0], near[1])}$.`,
            `$${fr(o[0], o[1])}$ 离 1 差 $${gap(o)}$，比 $${fr(near[0], near[1])}$ 远。`,
          ] as const,
      ),
      [
        [
          ["Compare each factor with 1", "把每个因数和 1 比较"],
          ["A factor close to 1 changes the number only a little.", "因数越接近 1，数变化越小。"],
        ],
        [
          ["Find the closest", "找最接近的"],
          [`$${fr(near[0], near[1])}$ is only $${gap(near)}$ away from 1.`, `$${fr(near[0], near[1])}$ 离 1 只差 $${gap(near)}$。`],
        ],
      ],
      [
        `Work it out, and the product is close to ${n}: $${fr(near[0], near[1])} \\times ${n} = ${mq(nearQ.mul(qf(n, 1)))}$.`,
        `算一算，积接近 ${n}：$${fr(near[0], near[1])} \\times ${n} = ${mq(nearQ.mul(qf(n, 1)))}$。`,
      ],
      scaleLine([
        [qf(1, 1), "1"],
        [nearQ, `${near[0]}/${near[1]}`],
      ]),
    );
  },
  scaleLine([
    [qf(1, 1), "1"],
    [qf(9, 10), "9/10"],
  ]),
);

/** checkingADivisionWithAProduct picks the multiplication that checks a division by a unit fraction. */
export const checkingADivisionWithAProduct = point(
  "checking-a-division-with-a-product",
  ["Checking a division with a product", "用乘法检验除法"],
  [
    "To check $3 \\div \\frac{1}{4} = 12$, multiply the answer by the divisor: $12 \\times \\frac{1}{4} = 3$. The result is the number you started with.\n\nCheck: 12 fourths make $\\frac{12}{4} = 3$.\n\n> **Watch out.** Multiply the answer, 12, by $\\frac{1}{4}$. Not $3 \\times \\frac{1}{4}$.",
    "检验 $3 \\div \\frac{1}{4} = 12$，用商乘除数：$12 \\times \\frac{1}{4} = 3$。结果正是原来的数。\n\n检验：12 个四分之一是 $\\frac{12}{4} = 3$。\n\n> **注意。** 要用商 12 乘 $\\frac{1}{4}$，不是 $3 \\times \\frac{1}{4}$。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const d = rng.int(2, 8);
    return pickedMath(
      rng,
      [`Which multiplication checks that $${k} \\div ${fr(1, d)} = ${k * d}$?`, `哪个乘法可以检验 $${k} \\div ${fr(1, d)} = ${k * d}$？`],
      `${k * d} \\times ${fr(1, d)} = ${k}`,
      [
        [
          `${k} \\times ${fr(1, d)} = ${k * d}`,
          `That multiplies ${k}, not the answer. It is also false: $${k} \\times ${fr(1, d)}$ is less than ${k}.`,
          `这里乘的是 ${k}，不是商，而且不成立：$${k} \\times ${fr(1, d)}$ 比 ${k} 小。`,
        ],
        [`${k * d} \\times ${k} = ${fr(1, d)}`, "That multiplies the wrong numbers, and it is false.", "这里乘错了数，而且不成立。"],
        [
          `${d} \\times ${fr(1, k)} = ${k * d}`,
          "That puts the numbers in the wrong places, and it is false.",
          "这里数的位置放错了，而且不成立。",
        ],
      ],
      [
        [
          ["Undo the division", "还原除法"],
          ["The answer times the divisor gives back the starting number.", "商乘除数等于被除数。"],
        ],
        [
          ["Fill in the numbers", "填入数"],
          [`The answer is ${k * d} and the divisor is $${fr(1, d)}$.`, `商是 ${k * d}，除数是 $${fr(1, d)}$。`],
          [`${k * d} \\times ${fr(1, d)} = ${k}`],
        ],
      ],
      countBack(k * d, d, k),
      groupedBarsFigure(k, d, 1),
    );
  },
  groupedBarsFigure(3, 4, 1),
);

/** servingsStillLeft divides to count all the bags, then takes away the bags already filled. */
export const servingsStillLeft = point(
  "servings-still-left",
  ["Servings still left", "还剩多少份"],
  [
    "3 pounds of nuts fill bags of $\\frac{1}{4}$ pound. That is $3 \\div \\frac{1}{4} = 12$ bags. After 5 bags, $12 - 5 = 7$ more can be filled.\n\nCheck: $5 + 7 = 12$ bags.\n\n> **Watch out.** Divide first to count all the bags. Then take away the bags already filled.",
    "3 磅坚果，每袋装 $\\frac{1}{4}$ 磅。一共能装 $3 \\div \\frac{1}{4} = 12$ 袋。装了 5 袋后，还能装 $12 - 5 = 7$ 袋。\n\n检验：$5 + 7 = 12$ 袋。\n\n> **注意。** 先做除法求出一共能装多少袋，再减去已经装好的袋数。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const k = rng.int(2, 6);
    const d = rng.int(2, 8);
    const used = rng.int(1, k * d - 1);
    return answered(
      [
        `${who} has ${k} pounds of nuts and fills bags of $${fr(1, d)}$ pound each. After filling ${used} bags, how many more bags can be filled?`,
        `${who} 有 ${k} 磅坚果，每袋装 $${fr(1, d)}$ 磅。装了 ${used} 袋后，还能再装多少袋？`,
      ],
      k * d - used,
      [
        [
          ["Count all the bags", "求一共的袋数"],
          ["Divide the nuts by the size of one bag.", "用坚果总量除以每袋的量。"],
          [`${k} \\div ${fr(1, d)} = ${k * d}`],
        ],
        [
          ["Take away the filled bags", "减去装好的袋数"],
          [`${used} bags are already filled.`, `已经装好 ${used} 袋。`],
          [`${k * d} - ${used} = ${k * d - used}`],
        ],
      ],
      [
        `The filled bags and the bags left make all the bags: $${used} + ${k * d - used} = ${k * d}$.`,
        `装好的袋数和剩下的袋数合起来是全部：$${used} + ${k * d - used} = ${k * d}$。`,
      ],
      [
        [k * d, "That forgets the bags already filled.", "这里忘了减去已经装好的袋数。"],
        [used, "That is the bags already filled.", "这是已经装好的袋数。"],
        [k * d - used + 1, "That is one bag too many.", "多算了一袋。"],
      ],
      { figure: groupedBarsFigure(k, d, 1) },
    );
  },
  groupedBarsFigure(3, 4, 1),
);

/** theMissingUnitFractionDivisor finds the missing denominator in a whole number divided by a unit fraction. */
export const theMissingUnitFractionDivisor = point(
  "the-missing-unit-fraction-divisor",
  ["The missing unit fraction divisor", "缺少的单位分数除数"],
  [
    "$5 \\div \\frac{1}{\\square} = 40$ means $5 \\times \\square = 40$, so the box is 8.\n\nCheck: $5 \\div \\frac{1}{8} = 5 \\times 8 = 40$.\n\n> **Watch out.** The box is not 40. 40 is the answer to the division.",
    "$5 \\div \\frac{1}{\\square} = 40$ 就是 $5 \\times \\square = 40$，所以方框里是 8。\n\n检验：$5 \\div \\frac{1}{8} = 5 \\times 8 = 40$。\n\n> **注意。** 方框里不是 40。40 是除法的商。",
  ],
  (rng) => {
    const k = rng.int(2, 15);
    const d = rng.int(2, 15);
    return answered(
      [`Fill in the box: $$${k} \\div \\frac{1}{\\square} = ${k * d}$$`, `填方框：$$${k} \\div \\frac{1}{\\square} = ${k * d}$$`],
      d,
      [
        [
          ["Write it as a product", "写成乘法"],
          ["Dividing by a unit fraction multiplies by its bottom.", "除以单位分数，就是乘它的分母。"],
          [`${k} \\times \\square = ${k * d}`],
        ],
        [["Divide", "做除法"], [`Find what ${k} is multiplied by.`, `求 ${k} 乘几等于 ${k * d}。`], [`${k * d} \\div ${k} = ${d}`]],
      ],
      [
        `Put it back: $${k} \\div ${fr(1, d)} = ${k} \\times ${d} = ${k * d}$.`,
        `代回去：$${k} \\div ${fr(1, d)} = ${k} \\times ${d} = ${k * d}$。`,
      ],
      [
        [k * d, "That is the answer to the division, not the missing bottom.", "这是除法的商，不是缺少的分母。"],
        [k, "That is the number being divided.", "这是被除数。"],
        [k * d - k, "That subtracts instead of dividing.", "这是做成减法了。"],
      ],
    );
  },
  groupedBarsFigure(2, 8, 1),
);

/** piecesThatFillTheWholeBar counts the pieces of a shared unit fraction that fill the whole bar. */
export const piecesThatFillTheWholeBar = point(
  "pieces-that-fill-the-whole-bar",
  ["Pieces that fill the whole bar", "铺满整个长条的块数"],
  [
    "A model shows $\\frac{1}{3} \\div 4$: one third is cut into 4 pieces. Cutting all 3 thirds that way makes $3 \\times 4 = 12$ pieces.\n\nCheck: each piece is $\\frac{1}{12}$, and 12 of them make 1.\n\n> **Watch out.** Multiply, do not add. $3 + 4 = 7$ pieces cannot fill the bar.",
    "一个模型表示 $\\frac{1}{3} \\div 4$：把三分之一切成 4 块。3 个三分之一都这样切，就有 $3 \\times 4 = 12$ 块。\n\n检验：每块是 $\\frac{1}{12}$，12 块就是 1。\n\n> **注意。** 要乘，不是加。$3 + 4 = 7$ 块铺不满长条。",
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const k = rng.int(2, 12);
    return answered(
      [
        `A model shows $${fr(1, a)} \\div ${k}$. How many of the small pieces would fill the whole bar?`,
        `一个模型表示 $${fr(1, a)} \\div ${k}$。多少个这样的小块能铺满整个长条？`,
      ],
      a * k,
      [
        [
          ["Count the parts", "数份数"],
          [`The bar has ${a} parts, and each is cut into ${k} pieces.`, `长条有 ${a} 份，每份切成 ${k} 块。`],
        ],
        [["Multiply", "相乘"], ["Parts times pieces in each part.", "份数乘每份的块数。"], [`${a} \\times ${k} = ${a * k}`]],
      ],
      [`Each piece is $${fr(1, a * k)}$ of the bar, and ${a * k} of them make 1.`, `每块是长条的 $${fr(1, a * k)}$，${a * k} 块就是 1。`],
      [
        [a + k, "That adds instead of multiplying.", "这是相加了，没有相乘。"],
        [a, "That counts the parts before cutting.", "这是切之前的份数。"],
        [k, "That counts the pieces in one part only.", "这只数了一份里的块数。"],
      ],
      { figure: splitPartsFigure(1, a, k) },
    );
  },
  splitPartsFigure(1, 3, 4),
);

/** theLargestShare picks the largest of four unit fractions shared among people. */
export const theLargestShare = point(
  "the-largest-share",
  ["The largest share", "最大的一份"],
  [
    "$\\frac{1}{2} \\div 3 = \\frac{1}{6}$ and $\\frac{1}{3} \\div 3 = \\frac{1}{9}$. The first is larger, because its bottom, 6, is smaller.\n\nCheck: sixths are bigger pieces than ninths.\n\n> **Watch out.** A larger bottom means a smaller share.",
    "$\\frac{1}{2} \\div 3 = \\frac{1}{6}$，$\\frac{1}{3} \\div 3 = \\frac{1}{9}$。前一个大，因为它的分母 6 比较小。\n\n检验：六分之一的块比九分之一的块大。\n\n> **注意。** 分母越大，每份越小。",
  ],
  (rng) => {
    const pairs = rng.sample<[number, number]>(
      [
        [2, 2],
        [2, 3],
        [2, 5],
        [3, 3],
        [3, 4],
        [2, 8],
        [4, 4],
        [3, 6],
        [5, 5],
        [4, 6],
        [3, 9],
        [6, 6],
      ],
      8,
    );
    const seen = new Set<number>();
    const distinct = pairs.filter((p) => {
      const v = p[0] * p[1];
      if (seen.has(v)) return false;
      seen.add(v);
      return true;
    });
    const four = distinct.slice(0, 4).sort((x, y) => x[0] * x[1] - y[0] * y[1]);
    const [best, ...rest] = four as [[number, number], ...[number, number][]];
    const b = best[0] * best[1];
    return pickedMath(
      rng,
      ["Which quotient is the largest?", "哪个商最大？"],
      `${fr(1, best[0])} \\div ${best[1]}`,
      rest.map(
        (p) =>
          [
            `${fr(1, p[0])} \\div ${p[1]}`,
            `That is $${fr(1, p[0] * p[1])}$, and its bottom ${p[0] * p[1]} is larger than ${b}, so the share is smaller.`,
            `它等于 $${fr(1, p[0] * p[1])}$，分母 ${p[0] * p[1]} 比 ${b} 大，所以每份更小。`,
          ] as const,
      ),
      [
        [
          ["Write each quotient", "写出每个商"],
          ["The bottoms multiply.", "分母相乘。"],
          four.map((p) => `${fr(1, p[0])} \\div ${p[1]} = ${fr(1, p[0] * p[1])}`),
        ],
        [
          ["Compare the bottoms", "比较分母"],
          [`The smallest bottom is ${b}, so that share is the largest.`, `最小的分母是 ${b}，所以这一份最大。`],
        ],
      ],
      [
        `Pieces of $${fr(1, b)}$ are the biggest, because ${b} of them fill the whole and the others need more.`,
        `$${fr(1, b)}$ 的块最大，因为 ${b} 块就铺满整体，其他的要更多块。`,
      ],
      splitPartsFigure(1, best[0], best[1]),
    );
  },
  splitPartsFigure(1, 2, 3),
);

/** theReciprocalOfASum adds two fractions with unlike bottoms first and then flips the sum. */
export const theReciprocalOfASum = point(
  "the-reciprocal-of-a-sum",
  ["The reciprocal of a sum", "和的倒数"],
  [
    "For $\\frac{1}{2} + \\frac{1}{3}$, add first: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$. Then flip it: the reciprocal is $\\frac{6}{5}$.\n\nCheck: $\\frac{5}{6} \\times \\frac{6}{5} = \\frac{30}{30} = 1$.\n\n> **Watch out.** Add first, then flip. Flipping each part gives $2 + 3 = 5$, which is wrong.",
    "对于 $\\frac{1}{2} + \\frac{1}{3}$，先相加：$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$。再倒过来：倒数是 $\\frac{6}{5}$。\n\n检验：$\\frac{5}{6} \\times \\frac{6}{5} = \\frac{30}{30} = 1$。\n\n> **注意。** 先加再倒过来。把每个加数分别倒过来得到 $2 + 3 = 5$，是错的。",
  ],
  (rng) => {
    const [p, q] = rng.pick<readonly [number, number]>([
      [2, 3],
      [2, 5],
      [3, 4],
      [2, 7],
      [3, 5],
      [4, 5],
      [4, 6],
      [3, 8],
      [5, 6],
    ]);
    const a = coprimeTo(rng, p, 1, p - 1);
    const b = coprimeTo(rng, q, 1, q - 1);
    const L = lcm(p, q);
    const sum = qf(a, p).add(qf(b, q));
    const answer = Q.one.div(sum);
    return answered(
      [`Find the reciprocal of $${fr(a, p)} + ${fr(b, q)}$.`, `求 $${fr(a, p)} + ${fr(b, q)}$ 的倒数。`],
      answer,
      [
        [
          ["Add", "先相加"],
          ["Use a common bottom.", "先通分。"],
          [`${fr(a, p)} + ${fr(b, q)} = ${fr((a * L) / p, L)} + ${fr((b * L) / q, L)} = ${sum.toLatex()}`],
        ],
        [
          ["Flip", "再倒过来"],
          ["Swap the top and the bottom of the sum.", "交换和的分子和分母。"],
          [`${sum.toLatex()} \\to ${answer.toLatex()}`],
        ],
      ],
      [`Multiply: $${sum.toLatex()} \\times ${answer.toLatex()} = 1$.`, `相乘：$${sum.toLatex()} \\times ${answer.toLatex()} = 1$。`],
      [
        [qf(p, a).add(qf(q, b)), "That flips each part and adds them.", "这是把每个加数分别倒过来再相加。"],
        [sum, "That is the sum. It is not flipped.", "这是和，还没有倒过来。"],
        [qf(1, p + q), "That adds the bottoms and puts 1 on top.", "这是把分母相加，再用 1 作分子。"],
      ],
      { form: "fraction", figure: twoBarsFigure(p, a, q, b) },
    );
  },
  twoBarsFigure(2, 1, 3, 1),
);

/** theTotalFromTheGroups multiplies the number of groups by the group size to find the wholes a model started with. */
export const theTotalFromTheGroups = point(
  "the-total-from-the-groups",
  ["The total from the groups", "由组数求总量"],
  [
    "A model has 6 groups of $\\frac{2}{3}$. Together they are $6 \\times \\frac{2}{3} = \\frac{12}{3} = 4$ wholes.\n\nCheck: 4 wholes are 12 thirds, and groups of 2 make $12 \\div 2 = 6$.\n\n> **Watch out.** Multiply the groups by the group size. 6 is the number of groups, not the wholes.",
    "一个模型有 6 组，每组 $\\frac{2}{3}$。合起来是 $6 \\times \\frac{2}{3} = \\frac{12}{3} = 4$ 个整体。\n\n检验：4 个整体是 12 个三分之一，每 2 个一组，有 $12 \\div 2 = 6$ 组。\n\n> **注意。** 要用组数乘每组的大小。6 是组数，不是整体的个数。",
  ],
  (rng) => {
    for (;;) {
      const d = rng.int(3, 8);
      const n = rng.int(2, d - 1);
      const k = rng.int(1, 4);
      if (gcd(n, d) !== 1 || n * k > 8) continue;
      const q = d * k;
      const total = n * k;
      return answered(
        [
          `A model is split into ${q} groups of $${fr(n, d)}$. How many wholes does the model show?`,
          `一个模型分成 ${q} 组，每组 $${fr(n, d)}$。这个模型表示几个整体？`,
        ],
        total,
        [
          [
            ["Multiply", "相乘"],
            ["Groups times the size of one group.", "组数乘每组的大小。"],
            [`${q} \\times ${fr(n, d)} = ${fr(q * n, d)}`],
          ],
          [
            ["Simplify", "化简"],
            [`${q * n} parts of $${fr(1, d)}$ make ${total} wholes.`, `${q * n} 个 $${fr(1, d)}$ 是 ${total} 个整体。`],
            [`${fr(q * n, d)} = ${total}`],
          ],
        ],
        [
          `Divide back: ${total} wholes are ${total * d} parts, and groups of ${n} make $${total * d} \\div ${n} = ${q}$.`,
          `除回去：${total} 个整体是 ${total * d} 份，每 ${n} 份一组，有 $${total * d} \\div ${n} = ${q}$ 组。`,
        ],
        [
          [q, "That is the number of groups, not the wholes.", "这是组数，不是整体的个数。"],
          [q * n, "That counts the small parts, not the wholes.", "这是小份的个数，不是整体的个数。"],
          [qf(q * d, n), "That divides by the group size instead of multiplying.", "这是除以了每组的大小，应该相乘。"],
        ],
        { figure: groupedBarsFigure(total, d, n) },
      );
    }
  },
  groupedBarsFigure(4, 3, 2),
);

/** fullGroupsInAFractionalResult keeps only the full bags when a division by a fraction does not come out even. */
export const fullGroupsInAFractionalResult = point(
  "full-groups-in-a-fractional-result",
  ["Full groups in a fractional result", "商是分数时的完整组数"],
  [
    "7 pounds of nuts fill bags of $\\frac{2}{3}$ pound. $7 \\div \\frac{2}{3} = \\frac{21}{2} = 10\\frac{1}{2}$, so only 10 bags are full.\n\nCheck: 10 bags hold $10 \\times \\frac{2}{3} = 6\\frac{2}{3}$ pounds, and the $\\frac{1}{3}$ pound left is less than a bag.\n\n> **Watch out.** The half bag is not full. Do not round up to 11.",
    "7 磅坚果，每袋装 $\\frac{2}{3}$ 磅。$7 \\div \\frac{2}{3} = \\frac{21}{2} = 10\\frac{1}{2}$，所以只能装满 10 袋。\n\n检验：10 袋装了 $10 \\times \\frac{2}{3} = 6\\frac{2}{3}$ 磅，剩下的 $\\frac{1}{3}$ 磅不够一袋。\n\n> **注意。** 半袋没有装满，不能凑成 11 袋。",
  ],
  (rng) => {
    const who = rng.pick(names);
    const [n, d] = rng.pick<readonly [number, number]>([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 6],
      [3, 8],
      [5, 8],
    ]);
    let k = rng.int(2, 6);
    if ((k * d) % n === 0) k += 1;
    const q = Math.floor((k * d) / n);
    return answered(
      [
        `${who} has ${k} pounds of nuts and fills bags of $${fr(n, d)}$ pound each. How many bags can be filled completely?`,
        `${who} 有 ${k} 磅坚果，每袋装 $${fr(n, d)}$ 磅。能装满多少袋？`,
      ],
      q,
      [
        [
          ["Divide", "做除法"],
          ["Divide the nuts by the size of one bag.", "用坚果总量除以每袋的量。"],
          [`${k} \\div ${fr(n, d)} = ${fr(k * d, n)} = ${mq(qf(k * d, n))}`],
        ],
        [
          ["Keep the full bags", "只数装满的袋"],
          ["The fraction part is a bag that is not full.", "分数部分是没装满的一袋。"],
        ],
      ],
      [
        `Less than one bag is left over: the ${q} full bags hold $${q} \\times ${fr(n, d)} = ${mq(qf(q * n, d))}$.`,
        `剩下的不够一袋：${q} 个满袋装了 $${q} \\times ${fr(n, d)} = ${mq(qf(q * n, d))}$。`,
      ],
      [
        [q + 1, "That rounds up, but the last bag is not full.", "这是往上凑整了，可最后一袋没有装满。"],
        [qf(k * d, n), "That counts the part-filled bag as a fraction.", "这把没装满的一袋也按分数算进去了。"],
        [k * d, `That counts parts of $${fr(1, d)}$, not bags.`, `这数的是 $${fr(1, d)}$ 的个数，不是袋数。`],
      ],
      { figure: groupedBarsFigure(k, d, n) },
    );
  },
  groupedBarsFigure(7, 3, 2),
);

/** fullPiecesCutFromALength counts only the complete pieces of a fractional length cut from a rope. */
export const fullPiecesCutFromALength = point(
  "full-pieces-cut-from-a-length",
  ["Full pieces cut from a length", "能剪出多少段完整的"],
  [
    "A rope is 5 m long. Each piece is $\\frac{3}{4}$ m. $5 \\div \\frac{3}{4} = 5 \\times \\frac{4}{3} = 6\\frac{2}{3}$, so 6 full pieces.\n\nCheck: 6 pieces use $6 \\times \\frac{3}{4} = 4\\frac{1}{2}$ m. The $\\frac{1}{2}$ m left is too short.\n\n> **Watch out.** Do not round up to 7. The last piece would be too short.",
    "一根绳子长 5 米，每段 $\\frac{3}{4}$ 米。$5 \\div \\frac{3}{4} = 5 \\times \\frac{4}{3} = 6\\frac{2}{3}$，所以能剪 6 段完整的。\n\n检验：6 段用了 $6 \\times \\frac{3}{4} = 4\\frac{1}{2}$ 米，剩下的 $\\frac{1}{2}$ 米不够一段。\n\n> **注意。** 不能凑成 7 段，最后一段太短了。",
  ],
  (rng) => {
    const [n, d] = rng.pick<readonly [number, number]>([
      [3, 4],
      [2, 3],
      [2, 5],
      [3, 5],
      [4, 5],
      [3, 8],
      [5, 8],
      [5, 6],
    ]);
    const length = rng.pick([2, 3, 4, 5, 6].filter((v) => (v * d) % n !== 0));
    const answer = Math.floor((length * d) / n);
    return answered(
      [
        `How many complete pieces, each $${fr(n, d)}$ m long, can be cut from a rope ${length} m long?`,
        `一根 ${length} 米长的绳子，能剪出多少段完整的、每段 $${fr(n, d)}$ 米的绳子？`,
      ],
      answer,
      [
        [
          ["Divide", "做除法"],
          [`Multiply by the reciprocal of $${fr(n, d)}$.`, `乘 $${fr(n, d)}$ 的倒数。`],
          [`${length} \\div ${fr(n, d)} = ${length} \\times ${fr(d, n)} = ${mq(qf(length * d, n))}`],
        ],
        [
          ["Keep the full pieces", "只数完整的段"],
          ["The fraction part is too short to be a piece.", "分数部分太短，不够一段。"],
        ],
      ],
      [
        `The rest is too short for one more piece: ${answer} pieces use $${answer} \\times ${fr(n, d)} = ${mq(qf(answer * n, d))}$.`,
        `剩下的不够再剪一段：${answer} 段用了 $${answer} \\times ${fr(n, d)} = ${mq(qf(answer * n, d))}$。`,
      ],
      [
        [answer + 1, "That rounds up, but the last piece would be too short.", "这是往上凑整了，可最后一段太短。"],
        [length * d, `That counts parts of $${fr(1, d)}$ m, not pieces.`, `这数的是 $${fr(1, d)}$ 米的个数，不是段数。`],
        [Math.floor((length * n) / d), "That multiplies by the fraction instead of dividing.", "这是乘了这个分数，没有做除法。"],
      ],
      { figure: groupedBarsFigure(length, d, n) },
    );
  },
  groupedBarsFigure(5, 4, 3),
);

/** theAmountFromItsShares puts equal shares back together to find the fraction that was divided. */
export const theAmountFromItsShares = point(
  "the-amount-from-its-shares",
  ["The amount from its shares", "由每份求总量"],
  [
    "A part of a bar is split into 3 equal shares, and each share is $\\frac{2}{9}$ of the bar. The part was $3 \\times \\frac{2}{9} = \\frac{6}{9} = \\frac{2}{3}$.\n\nCheck: $\\frac{6}{9} \\div 3 = \\frac{2}{9}$.\n\n> **Watch out.** Put the shares back together by multiplying. Dividing again makes it smaller.",
    "长条的一部分平均分成 3 份，每份是长条的 $\\frac{2}{9}$。这部分是 $3 \\times \\frac{2}{9} = \\frac{6}{9} = \\frac{2}{3}$。\n\n检验：$\\frac{6}{9} \\div 3 = \\frac{2}{9}$。\n\n> **注意。** 把几份合起来要用乘法。再除一次只会更小。",
  ],
  (rng) => {
    for (;;) {
      const d = rng.int(4, 15);
      const k = rng.int(2, 5);
      const n = rng.int(1, 4);
      if (n * k >= d) continue;
      return answered(
        [
          `Part of a bar is split into ${k} equal shares, and each share is $${fr(n, d)}$ of the bar. What fraction of the bar was split?`,
          `长条的一部分平均分成 ${k} 份，每份是长条的 $${fr(n, d)}$。被分的部分是长条的几分之几？`,
        ],
        qf(n * k, d),
        [
          [
            ["Put the shares together", "把几份合起来"],
            [`There are ${k} equal shares of $${fr(n, d)}$.`, `一共有 ${k} 份，每份 $${fr(n, d)}$。`],
            [`${k} \\times ${fr(n, d)} = ${fr(n * k, d)}`],
          ],
          ...tidy(n * k, d),
        ],
        [`Share it again: $${fr(n * k, d)} \\div ${k} = ${fr(n, d)}$.`, `再平均分一次：$${fr(n * k, d)} \\div ${k} = ${fr(n, d)}$。`],
        [
          [qf(n, d * k), "That divides again instead of putting the shares together.", "这是又除了一次，没有把几份合起来。"],
          [qf(n + k, d), `That adds ${k} to the top instead of multiplying.`, `这是给分子加上 ${k}，应该相乘。`],
          [qf(n, d), "That is only one share.", "这只是一份。"],
        ],
        { form: "fraction", figure: equalTape(k, pieceText(qf(n, d)), "?") },
      );
    }
  },
  equalTape(3, "2/9", "?"),
);

/** theMissingWholeDivisor finds the whole number a fraction was divided by from how much its bottom grew. */
export const theMissingWholeDivisor = point(
  "the-missing-whole-divisor",
  ["The missing whole divisor", "缺少的整数除数"],
  [
    "For $\\frac{2}{3} \\div \\square = \\frac{2}{15}$, the bottom grew from 3 to 15. $3 \\times 5 = 15$, so the box is 5.\n\nCheck: $\\frac{2}{3} \\times \\frac{1}{5} = \\frac{2}{15}$.\n\n> **Watch out.** The box is not 15. 15 is the new bottom.",
    "对于 $\\frac{2}{3} \\div \\square = \\frac{2}{15}$，分母从 3 变成了 15。$3 \\times 5 = 15$，所以方框里是 5。\n\n检验：$\\frac{2}{3} \\times \\frac{1}{5} = \\frac{2}{15}$。\n\n> **注意。** 方框里不是 15。15 是新的分母。",
  ],
  (rng) => {
    for (;;) {
      const [a, b] = properFraction(rng, 8, 2);
      const k = rng.int(2, 6);
      if (gcd(a, k) !== 1) continue;
      return answered(
        [`Fill in the box: $$${fr(a, b)} \\div \\square = ${fr(a, b * k)}$$`, `填方框：$$${fr(a, b)} \\div \\square = ${fr(a, b * k)}$$`],
        k,
        [
          [
            ["Compare the bottoms", "比较分母"],
            [`Dividing by the box multiplies the bottom ${b} by it.`, `除以方框里的数，就是用它乘分母 ${b}。`],
            [`${b} \\times \\square = ${b * k}`],
          ],
          [["Divide", "做除法"], [`Find what ${b} is multiplied by.`, `求 ${b} 乘几等于 ${b * k}。`], [`${b * k} \\div ${b} = ${k}`]],
        ],
        [`Put it back: $${fr(a, b)} \\div ${k} = ${fr(a, b * k)}$.`, `代回去：$${fr(a, b)} \\div ${k} = ${fr(a, b * k)}$。`],
        [
          [b * k, "That is the new bottom, not the number you divide by.", "这是新的分母，不是除数。"],
          [b, "That is the old bottom.", "这是原来的分母。"],
          [b * k - b, "That subtracts instead of dividing.", "这是做成减法了。"],
        ],
        { figure: splitPartsFigure(a, b, k) },
      );
    }
  },
  splitPartsFigure(2, 3, 5),
);

/** theWholeAmountFromAFractionOfIt finds a full amount from the part that fills a fraction of it. */
export const theWholeAmountFromAFractionOfIt = point(
  "the-whole-amount-from-a-fraction-of-it",
  ["The whole amount from a fraction of it", "由几分之几求总量"],
  [
    "A jug is $\\frac{2}{3}$ full and holds 4 liters. Each third holds $4 \\div 2 = 2$ liters, so the full jug holds $3 \\times 2 = 6$ liters.\n\nCheck: $4 \\div \\frac{2}{3} = 4 \\times \\frac{3}{2} = 6$.\n\n> **Watch out.** The full jug holds more than 4 liters. $\\frac{2}{3}$ of 4 is too small.",
    "一个水壶装到 $\\frac{2}{3}$ 满时有 4 升水。每个三分之一是 $4 \\div 2 = 2$ 升，所以装满时是 $3 \\times 2 = 6$ 升。\n\n检验：$4 \\div \\frac{2}{3} = 4 \\times \\frac{3}{2} = 6$。\n\n> **注意。** 装满时比 4 升多。求 4 的 $\\frac{2}{3}$ 就太小了。",
  ],
  (rng) => {
    const [n, d] = rng.pick<readonly [number, number]>([
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
    ]);
    const s = rng.int(1, 9);
    const part = s * n;
    return answered(
      [
        `A jug is $${fr(n, d)}$ full and holds ${part} liters of water. How many liters does the full jug hold?`,
        `一个水壶装到 $${fr(n, d)}$ 满时有 ${part} 升水。这个水壶装满时能装多少升？`,
      ],
      s * d,
      [
        [["Find one part", "求一份"], [`${n} parts hold ${part} liters.`, `${n} 份是 ${part} 升。`], [`${part} \\div ${n} = ${s}`]],
        [["Find the whole", "求整体"], [`The full jug has ${d} parts.`, `装满是 ${d} 份。`], [`${s} \\times ${d} = ${s * d}`]],
      ],
      [
        `Divide by the fraction: $${part} \\div ${fr(n, d)} = ${part} \\times ${fr(d, n)} = ${s * d}$.`,
        `除以这个分数：$${part} \\div ${fr(n, d)} = ${part} \\times ${fr(d, n)} = ${s * d}$。`,
      ],
      [
        [qf(part * n, d), `That finds $${fr(n, d)}$ of ${part}, which is too small.`, `这是求 ${part} 的 $${fr(n, d)}$，太小了。`],
        [s, "That is one part, not the full jug.", "这只是一份，不是整壶。"],
        [part * d, `That multiplies by ${d} but forgets to divide by ${n}.`, `这里乘了 ${d}，但忘了除以 ${n}。`],
      ],
      { figure: partsTape("?", n, d) },
    );
  },
  partsTape("?", 2, 3),
);

/** aQuotientBelowOne picks the division of two fractions whose quotient is less than 1. */
export const aQuotientBelowOne = point(
  "a-quotient-below-one",
  ["A quotient below one", "小于 1 的商"],
  [
    "$\\frac{1}{3} \\div \\frac{1}{2}$ is less than 1. $\\frac{1}{3}$ is smaller than $\\frac{1}{2}$, so not even one group fits.\n\nCheck: in sixths it is $\\frac{2}{6} \\div \\frac{3}{6} = \\frac{2}{3}$.\n\n> **Watch out.** Look at which fraction comes first. $\\frac{1}{2} \\div \\frac{1}{3}$ is more than 1.",
    "$\\frac{1}{3} \\div \\frac{1}{2}$ 小于 1。$\\frac{1}{3}$ 比 $\\frac{1}{2}$ 小，连一组都放不下。\n\n检验：化成六分之几是 $\\frac{2}{6} \\div \\frac{3}{6} = \\frac{2}{3}$。\n\n> **注意。** 看清哪个分数在前面。$\\frac{1}{2} \\div \\frac{1}{3}$ 大于 1。",
  ],
  (rng) => {
    const pool: readonly (readonly [number, number])[] = [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
    ];
    const [p, q, r, s] = rng.sample(pool, 4) as [
      readonly [number, number],
      readonly [number, number],
      readonly [number, number],
      readonly [number, number],
    ];
    const v = (x: readonly [number, number]) => x[0] / x[1];
    const [small, large] = v(p) < v(q) ? [p, q] : [q, p];
    const big = (x: readonly [number, number], y: readonly [number, number]) =>
      v(x) > v(y) ? `${fr(x[0], x[1])} \\div ${fr(y[0], y[1])}` : `${fr(y[0], y[1])} \\div ${fr(x[0], x[1])}`;
    const L = lcm(small[1], large[1]);
    const [xs, xl] = [(small[0] * L) / small[1], (large[0] * L) / large[1]];
    const larger = "The first fraction is larger, so at least one group fits.";
    const largerZh = "第一个分数较大，至少能放下一组。";
    return pickedMath(
      rng,
      ["Which quotient is less than 1?", "哪个商小于 1？"],
      `${fr(small[0], small[1])} \\div ${fr(large[0], large[1])}`,
      [
        [
          `${fr(large[0], large[1])} \\div ${fr(small[0], small[1])}`,
          "That puts the larger fraction first, so the quotient is more than 1.",
          "这里较大的分数在前，商大于 1。",
        ],
        [big(r, s), larger, largerZh],
        [big(p, r), larger, largerZh],
      ],
      [
        [
          ["Compare", "比较"],
          [
            `$${fr(small[0], small[1])}$ is less than $${fr(large[0], large[1])}$.`,
            `$${fr(small[0], small[1])}$ 小于 $${fr(large[0], large[1])}$。`,
          ],
        ],
        [
          ["Decide", "判断"],
          ["When the first fraction is smaller, less than one group fits.", "第一个分数较小时，连一组都放不下。"],
        ],
      ],
      [
        `In parts of $${fr(1, L)}$ it is $${xs} \\div ${xl} = ${fr(xs, xl)}$.`,
        `化成以 $${fr(1, L)}$ 为单位：$${xs} \\div ${xl} = ${fr(xs, xl)}$。`,
      ],
      twoBarsFigure(small[1], small[0], large[1], large[0]),
    );
  },
  twoBarsFigure(3, 1, 2, 1),
);
