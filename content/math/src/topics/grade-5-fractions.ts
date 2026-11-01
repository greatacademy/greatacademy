import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, lcm, Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem, steps } from "../problems.ts";
import { barFigure, coprimeTo, fr, mathText, mx, pickChoice, properFraction, twoBarsFigure } from "./grade-4-fractions.ts";

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
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
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
      `${w} equal bars, each cut into ${d} equal parts; ${a} part${a === 1 ? " is" : "s are"} crossed out and the rest are shaded.`,
      `${w} 个同样的长条，每个都平均分成 ${d} 份；划掉了 ${a} 份，其余的涂了颜色。`,
    ),
  };
}

/** groupedBarsFigure shows w wholes cut into d parts, with the parts colored in alternating groups of g. */
function groupedBarsFigure(w: number, d: number, g: number): Figure {
  return {
    svg: barsSvg(w, d, (i) => (Math.floor(i / g) % 2 === 0 ? "shade" : "light")),
    alt: t(
      `${w} equal bar${w === 1 ? "" : "s"}, each cut into ${d} equal parts; the parts are colored dark and light in turn, in groups of ${g}.`,
      `${w} 个同样的长条，每个都平均分成 ${d} 份；每 ${g} 份为一组，深浅颜色交替。`,
    ),
  };
}

/** productGrid draws a unit square cut into d columns and b rows, with the first a columns and the top c rows shaded, so that the overlap is darker. */
function productGrid(a: number, d: number, c: number, b: number): Figure {
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
    {
      id: "whole-number-plus-proper-fraction-models",
      title: t("A whole number plus a proper fraction", "整数加真分数"),
      explanation: t(
        "$3$ shaded bars and $\\frac{2}{5}$ of another bar show $3 + \\frac{2}{5} = 3\\frac{2}{5}$.",
        "涂满的 $3$ 个长条再加另一个长条的 $\\frac{2}{5}$，表示 $3 + \\frac{2}{5} = 3\\frac{2}{5}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 4);
        const [a, d] = properFraction(rng, 10, 3);
        return {
          ...numberProblem({
            prompt: t(`The model shows $${w} + ${fr(a, d)}$. What is the sum?`, `模型表示 $${w} + ${fr(a, d)}$。和是多少？`),
            answer: mixedValue(w, a, d),
            form: "mixed",
            wrong: [qf(w + a, d), qf(a, d + w), qf(w * a, d)],
            solution: t(
              `$${w}$ whole bars and $${fr(a, d)}$ of a bar make $${mx(w, a, d)}$.`,
              `$${w}$ 个整长条和 $${fr(a, d)}$ 个长条合起来是 $${mx(w, a, d)}$。`,
            ),
          }),
          figure: barFigure(d, w * d + a, w + 1),
        };
      },
    },
    {
      id: "whole-number-plus-improper-fraction-models",
      title: t("A whole number plus an improper fraction", "整数加假分数"),
      explanation: t(
        "$1 + \\frac{7}{3}$: the $\\frac{7}{3}$ fills $2$ more bars with $\\frac{1}{3}$ left, so the sum is $3\\frac{1}{3}$.",
        "$1 + \\frac{7}{3}$：$\\frac{7}{3}$ 又涂满 $2$ 个长条，还剩 $\\frac{1}{3}$，所以和是 $3\\frac{1}{3}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 3);
        const d = rng.int(3, 8);
        const a = coprimeTo(rng, d, d + 1, 2 * d - 1);
        const total = w * d + a;
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${w} + ${fr(a, d)}$. What is the sum, as a mixed number?`,
              `模型表示 $${w} + ${fr(a, d)}$。和是多少？用带分数表示。`,
            ),
            answer: qf(total, d),
            form: "mixed",
            wrong: [mixedValue(w, a - d, d), qf(w + a, d), qf(a, d)],
            solution: t(
              `$${fr(a, d)} = 1${fr(a - d, d)}$, so $${w} + ${fr(a, d)} = ${w} + 1 + ${fr(a - d, d)} = ${mx(w + 1, a - d, d)}$.`,
              `$${fr(a, d)} = 1${fr(a - d, d)}$，所以 $${w} + ${fr(a, d)} = ${w} + 1 + ${fr(a - d, d)} = ${mx(w + 1, a - d, d)}$。`,
            ),
          }),
          figure: barFigure(d, total, w + 2),
        };
      },
    },
  ],
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
    {
      id: "adding-whole-numbers-and-mixed-numbers",
      title: t("Whole numbers and mixed numbers", "整数加带分数"),
      explanation: t(
        "$7 + 3\\frac{5}{8} = 10\\frac{5}{8}$: add the whole numbers $7 + 3 = 10$.",
        "$7 + 3\\frac{5}{8} = 10\\frac{5}{8}$：整数部分相加，$7 + 3 = 10$。",
      ),
      generate(rng) {
        const w = rng.int(1, 15);
        const v = rng.int(1, 9);
        const [a, d] = properFraction(rng, 12, 3);
        return numberProblem({
          prompt: t(`Find $${w} + ${mx(v, a, d)}$.`, `计算 $${w} + ${mx(v, a, d)}$。`),
          answer: mixedValue(w + v, a, d),
          form: "mixed",
          wrong: [mixedValue(v, a + w, d), mixedValue(w * v, a, d), mixedValue(w + v + 1, a, d)],
          solution: t(
            `Add the whole numbers and keep the fraction: $${w} + ${mx(v, a, d)} = ${mx(w + v, a, d)}$.`,
            `整数部分相加，分数部分不变：$${w} + ${mx(v, a, d)} = ${mx(w + v, a, d)}$。`,
          ),
        });
      },
    },
    {
      id: "adding-whole-numbers-and-improper-fractions",
      title: t("Whole numbers and improper fractions", "整数加假分数"),
      explanation: t(
        "$4 + \\frac{11}{3} = 4 + 3\\frac{2}{3} = 7\\frac{2}{3}$.",
        "$4 + \\frac{11}{3} = 4 + 3\\frac{2}{3} = 7\\frac{2}{3}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 12);
        const d = rng.int(2, 9);
        const a = coprimeTo(rng, d, d + 1, 4 * d - 1);
        const k = Math.floor(a / d);
        return numberProblem({
          prompt: t(`Find $${w} + ${fr(a, d)}$. Write the answer as a mixed number.`, `计算 $${w} + ${fr(a, d)}$，结果写成带分数。`),
          answer: qf(w * d + a, d),
          form: "mixed",
          wrong: [mixedValue(w, a % d, d), qf(w + a, d), mixedValue(w + k + 1, a % d, d)],
          solution: t(
            `$${fr(a, d)} = ${mx(k, a % d, d)}$, so $${w} + ${fr(a, d)} = ${w} + ${mx(k, a % d, d)} = ${mx(w + k, a % d, d)}$.`,
            `$${fr(a, d)} = ${mx(k, a % d, d)}$，所以 $${w} + ${fr(a, d)} = ${w} + ${mx(k, a % d, d)} = ${mx(w + k, a % d, d)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "one-minus-a-fraction-model",
      title: t("Taking a fraction from 1", "从 1 中减去分数"),
      explanation: t(
        "$1 - \\frac{3}{8}$: one bar cut into $8$ parts with $3$ crossed out leaves $\\frac{5}{8}$.",
        "$1 - \\frac{3}{8}$：一个长条平均分成 $8$ 份，划掉 $3$ 份，剩下 $\\frac{5}{8}$。",
      ),
      generate(rng) {
        const [a, d] = properFraction(rng, 12, 3);
        return {
          ...numberProblem({
            prompt: t(`The model shows $1 - ${fr(a, d)}$. What is left?`, `模型表示 $1 - ${fr(a, d)}$。剩下多少？`),
            answer: qf(d - a, d),
            form: "mixed",
            wrong: [qf(a, d), qf(1 - a + d, d), qf(d - a, d + 1)],
            solution: t(
              `$1 = ${fr(d, d)}$, and $${fr(d, d)} - ${fr(a, d)} = ${lowest(d - a, d)}$.`,
              `$1 = ${fr(d, d)}$，$${fr(d, d)} - ${fr(a, d)} = ${lowest(d - a, d)}$。`,
            ),
          }),
          figure: takeAwayFigure(1, a, d),
        };
      },
    },
    {
      id: "whole-number-minus-a-fraction-model",
      title: t("Taking a fraction from a whole number", "从整数中减去分数"),
      explanation: t(
        "$3 - \\frac{2}{5}$: $2$ bars stay whole and $\\frac{3}{5}$ of the last bar is left, so the answer is $2\\frac{3}{5}$.",
        "$3 - \\frac{2}{5}$：$2$ 个长条完整，最后一个长条剩下 $\\frac{3}{5}$，所以结果是 $2\\frac{3}{5}$。",
      ),
      generate(rng) {
        const w = rng.int(2, 4);
        const [a, d] = properFraction(rng, 10, 3);
        return {
          ...numberProblem({
            prompt: t(`The model shows $${w} - ${fr(a, d)}$. What is left?`, `模型表示 $${w} - ${fr(a, d)}$。剩下多少？`),
            answer: mixedValue(w - 1, d - a, d),
            form: "mixed",
            wrong: [mixedValue(w - 1, a, d), mixedValue(w, d - a, d), qf(d - a, d)],
            solution: t(
              `$${w - 1}$ bar${w === 2 ? " is" : "s are"} untouched and $${fr(d - a, d)}$ of the last bar is left: $${w} - ${fr(a, d)} = ${mx(w - 1, d - a, d)}$.`,
              `$${w - 1}$ 个长条没有动，最后一个长条剩下 $${fr(d - a, d)}$：$${w} - ${fr(a, d)} = ${mx(w - 1, d - a, d)}$。`,
            ),
          }),
          figure: takeAwayFigure(w, a, d),
        };
      },
    },
  ],
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
    {
      id: "whole-number-minus-a-fraction",
      title: t("A whole number minus a fraction", "整数减分数"),
      explanation: t(
        "$8 - \\frac{2}{9} = 7\\frac{9}{9} - \\frac{2}{9} = 7\\frac{7}{9}$.",
        "$8 - \\frac{2}{9} = 7\\frac{9}{9} - \\frac{2}{9} = 7\\frac{7}{9}$。",
      ),
      generate(rng) {
        const w = rng.int(2, 15);
        const [a, d] = properFraction(rng, 12, 3);
        return numberProblem({
          prompt: t(`Find $${w} - ${fr(a, d)}$.`, `计算 $${w} - ${fr(a, d)}$。`),
          answer: mixedValue(w - 1, d - a, d),
          form: "mixed",
          wrong: [mixedValue(w - 1, a, d), mixedValue(w, d - a, d), qf(w - a, d)].filter((q) => q.sign() > 0),
          solution: t(
            `$${w} = ${mx(w - 1, d, d)}$, so $${w} - ${fr(a, d)} = ${mx(w - 1, d - a, d)}$.`,
            `$${w} = ${w - 1}${fr(d, d)}$，所以 $${w} - ${fr(a, d)} = ${mx(w - 1, d - a, d)}$。`,
          ),
        });
      },
    },
    {
      id: "subtracting-with-mixed-numbers-and-whole-numbers",
      title: t("Mixed numbers and whole numbers", "带分数与整数相减"),
      explanation: t(
        "$9\\frac{3}{4} - 5 = 4\\frac{3}{4}$, and $6 - 2\\frac{1}{3} = 5\\frac{3}{3} - 2\\frac{1}{3} = 3\\frac{2}{3}$.",
        "$9\\frac{3}{4} - 5 = 4\\frac{3}{4}$；$6 - 2\\frac{1}{3} = 5\\frac{3}{3} - 2\\frac{1}{3} = 3\\frac{2}{3}$。",
      ),
      generate(rng) {
        const [a, d] = properFraction(rng, 12, 3);
        const v = rng.int(1, 8);
        const w = v + rng.int(1, 8);
        if (rng.bool())
          return numberProblem({
            prompt: t(`Find $${mx(w, a, d)} - ${v}$.`, `计算 $${mx(w, a, d)} - ${v}$。`),
            answer: mixedValue(w - v, a, d),
            form: "mixed",
            wrong: [mixedValue(w - v, d - a, d), qf(w * d + a - v, d), mixedValue(w - v - 1, a, d)].filter((q) => q.sign() > 0),
            solution: t(
              `Subtract the whole numbers and keep the fraction: $${mx(w - v, a, d)}$.`,
              `整数部分相减，分数部分不变：$${mx(w - v, a, d)}$。`,
            ),
          });
        return numberProblem({
          prompt: t(`Find $${w} - ${mx(v, a, d)}$.`, `计算 $${w} - ${mx(v, a, d)}$。`),
          answer: mixedValue(w - v - 1, d - a, d),
          form: "mixed",
          wrong: [mixedValue(w - v, a, d), mixedValue(w - v, d - a, d), mixedValue(w - v - 1, a, d)].filter((q) => q.sign() > 0),
          solution: t(
            `$${w} = ${w - 1}${fr(d, d)}$, so $${w} - ${mx(v, a, d)} = ${mx(w - v - 1, d - a, d)}$.`,
            `$${w} = ${w - 1}${fr(d, d)}$，所以 $${w} - ${mx(v, a, d)} = ${mx(w - v - 1, d - a, d)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "rounding-to-benchmark-fractions",
      title: t("Rounding to 0, 1/2 or 1", "近似成 0、1/2 或 1"),
      explanation: t(
        "$\\frac{6}{11}$ is close to $\\frac{1}{2}$, since $6$ is about half of $11$. $\\frac{1}{9}$ is close to $0$ and $\\frac{9}{10}$ is close to $1$.",
        "$\\frac{6}{11}$ 接近 $\\frac{1}{2}$，因为 $6$ 大约是 $11$ 的一半。$\\frac{1}{9}$ 接近 $0$，$\\frac{9}{10}$ 接近 $1$。",
      ),
      generate(rng) {
        const k = rng.int(0, 2);
        const [n, d] = nearBenchmark(rng, k);
        return choiceProblem({
          prompt: t(`Which benchmark is $${fr(n, d)}$ closest to?`, `$${fr(n, d)}$ 最接近哪个基准数？`),
          options: benchmarkTex.map(mathText),
          correct: k,
          solution: t(
            `$${fr(n, d)}$ is closest to $${benchmarkTex[k]}$${k === 1 ? `: ${n} is about half of ${d}` : k === 0 ? `: ${n} is small compared with ${d}` : `: ${n} is almost ${d}`}.`,
            `$${fr(n, d)}$ 最接近 $${benchmarkTex[k]}$${k === 1 ? `：${n} 大约是 ${d} 的一半` : k === 0 ? `：${n} 比 ${d} 小得多` : `：${n} 几乎等于 ${d}`}。`,
          ),
        });
      },
    },
    {
      id: "estimating-with-benchmarks",
      title: t("Estimating a sum or difference", "估算和或差"),
      explanation: t(
        "$\\frac{11}{12} - \\frac{3}{7}$ is about $1 - \\frac{1}{2} = \\frac{1}{2}$.",
        "$\\frac{11}{12} - \\frac{3}{7}$ 约等于 $1 - \\frac{1}{2} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const sub = rng.bool();
        let k1 = rng.int(0, 2);
        let k2 = rng.int(0, 2);
        if (sub && k1 < k2) [k1, k2] = [k2, k1];
        const [a, b] = nearBenchmark(rng, k1);
        const [c, d] = nearBenchmark(rng, k2);
        const est = sub ? benchmarks[k1]!.sub(benchmarks[k2]!) : benchmarks[k1]!.add(benchmarks[k2]!);
        const options = [0, 1, 2, 3, 4].map((h) => qf(h, 2));
        return choiceProblem({
          prompt: t(
            `Estimate $${fr(a, b)} ${sub ? "-" : "+"} ${fr(c, d)}$ using the benchmarks $0$, $\\frac{1}{2}$ and $1$.`,
            `用基准数 $0$、$\\frac{1}{2}$、$1$ 估算 $${fr(a, b)} ${sub ? "-" : "+"} ${fr(c, d)}$。`,
          ),
          options: options.map((q) => mathText(mq(q))),
          correct: options.findIndex((q) => q.eq(est)),
          solution: t(
            `$${fr(a, b)}$ is about $${benchmarkTex[k1]}$ and $${fr(c, d)}$ is about $${benchmarkTex[k2]}$, so the result is about $${benchmarkTex[k1]} ${sub ? "-" : "+"} ${benchmarkTex[k2]} = ${mq(est)}$.`,
            `$${fr(a, b)}$ 约为 $${benchmarkTex[k1]}$，$${fr(c, d)}$ 约为 $${benchmarkTex[k2]}$，所以结果约为 $${benchmarkTex[k1]} ${sub ? "-" : "+"} ${benchmarkTex[k2]} = ${mq(est)}$。`,
          ),
        });
      },
    },
  ],
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

/** commonSteps rewrites a/b and c/d over their least common denominator and adds or subtracts them. */
function commonSteps(p: FractionPair, sub: boolean): string {
  const L = lcm(p.b, p.d);
  const [x, y] = [(p.a * L) / p.b, (p.c * L) / p.d];
  const op = sub ? "-" : "+";
  const result = sub ? x - y : x + y;
  const v = qf(result, L);
  const lines = [`${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)} = ${fr(x, L)} ${op} ${fr(y, L)} = ${fr(result, L)}`];
  if (!v.eq(qf(result, L)) || gcd(result, L) !== 1 || result > L) lines.push(`${fr(result, L)} = ${mq(v)}`);
  return steps(...lines);
}

/** pairValue is a/b + c/d or a/b − c/d. */
const pairValue = (p: FractionPair, sub: boolean) => (sub ? qf(p.a, p.b).sub(qf(p.c, p.d)) : qf(p.a, p.b).add(qf(p.c, p.d)));

/** pairSlips are the values of typical slips: adding or subtracting numerators and denominators, and ignoring the second denominator. */
function pairSlips(p: FractionPair, sub: boolean): Q[] {
  const out: Q[] = [];
  const n = sub ? p.a - p.c : p.a + p.c;
  if (n > 0 && p.b + p.d > 0) out.push(qf(n, p.b + p.d));
  if (n > 0) out.push(qf(n, Math.max(p.b, p.d)));
  out.push(pairValue(p, sub).add(qf(1, lcm(p.b, p.d))));
  return out;
}

/** pairProblem asks for a/b ± c/d, with or without a figure. */
function pairProblem(p: FractionPair, sub: boolean, figure?: Figure): Problem {
  const op = sub ? "-" : "+";
  const L = lcm(p.b, p.d);
  return {
    ...numberProblem({
      prompt: figure
        ? t(
            `The model shows $${fr(p.a, p.b)}$ and $${fr(p.c, p.d)}$. Find $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$.`,
            `模型表示 $${fr(p.a, p.b)}$ 和 $${fr(p.c, p.d)}$。计算 $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$。`,
          )
        : t(`Find $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$.`, `计算 $${fr(p.a, p.b)} ${op} ${fr(p.c, p.d)}$。`),
      answer: pairValue(p, sub),
      form: "mixed",
      wrong: pairSlips(p, sub),
      solution: t(
        `${figure ? `Cut every part of both bars into parts of size $${fr(1, L)}$. ` : ""}Rewrite both fractions with the common denominator ${L}:${commonSteps(p, sub)}`,
        `${figure ? `把两个长条的每一份都再分成大小为 $${fr(1, L)}$ 的小份。` : ""}把两个分数都化成分母是 ${L} 的分数：${commonSteps(p, sub)}`,
      ),
    }),
    ...(figure && { figure }),
  };
}

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
    {
      id: "adding-related-denominators-with-models",
      title: t("One denominator divides the other", "一个分母是另一个的倍数"),
      explanation: t(
        "$\\frac{1}{4} + \\frac{3}{8}$: cut each fourth in half, so $\\frac{1}{4} = \\frac{2}{8}$ and the sum is $\\frac{5}{8}$.",
        "$\\frac{1}{4} + \\frac{3}{8}$：把每个四分之一再平分，$\\frac{1}{4} = \\frac{2}{8}$，和是 $\\frac{5}{8}$。",
      ),
      generate(rng) {
        const p = relatedPair(rng);
        return pairProblem(p, false, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
    },
    {
      id: "adding-unrelated-denominators-with-models",
      title: t("Unrelated denominators", "分母不成倍数关系"),
      explanation: t(
        "$\\frac{2}{3} + \\frac{1}{4}$: cut both bars into twelfths: $\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$.",
        "$\\frac{2}{3} + \\frac{1}{4}$：把两个长条都分成十二份：$\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$。",
      ),
      generate(rng) {
        const p = unrelatedPair(rng);
        return pairProblem(p, false, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
    },
  ],
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
    {
      id: "subtracting-related-denominators-with-models",
      title: t("One denominator divides the other", "一个分母是另一个的倍数"),
      explanation: t(
        "$\\frac{5}{6} - \\frac{1}{3} = \\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$.",
        "$\\frac{5}{6} - \\frac{1}{3} = \\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const p = orderedPair(rng, true);
        return pairProblem(p, true, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
    },
    {
      id: "subtracting-unrelated-denominators-with-models",
      title: t("Unrelated denominators", "分母不成倍数关系"),
      explanation: t(
        "$\\frac{4}{5} - \\frac{1}{2} = \\frac{8}{10} - \\frac{5}{10} = \\frac{3}{10}$.",
        "$\\frac{4}{5} - \\frac{1}{2} = \\frac{8}{10} - \\frac{5}{10} = \\frac{3}{10}$。",
      ),
      generate(rng) {
        const p = orderedPair(rng, false);
        return pairProblem(p, true, twoBarsFigure(p.b, p.a, p.d, p.c));
      },
    },
  ],
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
    {
      id: "adding-with-related-denominators",
      title: t("One denominator divides the other", "一个分母是另一个的倍数"),
      explanation: t(
        "$\\frac{2}{5} + \\frac{7}{10} = \\frac{4}{10} + \\frac{7}{10} = \\frac{11}{10} = 1\\frac{1}{10}$.",
        "$\\frac{2}{5} + \\frac{7}{10} = \\frac{4}{10} + \\frac{7}{10} = \\frac{11}{10} = 1\\frac{1}{10}$。",
      ),
      generate: (rng) => pairProblem(relatedPair(rng), false),
    },
    {
      id: "adding-with-the-least-common-denominator",
      title: t("Using the least common denominator", "用最小公分母"),
      explanation: t(
        "$\\frac{3}{8} + \\frac{5}{6}$: the least common denominator is $24$, so the sum is $\\frac{9}{24} + \\frac{20}{24} = \\frac{29}{24} = 1\\frac{5}{24}$.",
        "$\\frac{3}{8} + \\frac{5}{6}$：最小公分母是 $24$，所以和是 $\\frac{9}{24} + \\frac{20}{24} = \\frac{29}{24} = 1\\frac{5}{24}$。",
      ),
      generate: (rng) => pairProblem(unrelatedPair(rng), false),
    },
  ],
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
    {
      id: "subtracting-with-related-denominators",
      title: t("One denominator divides the other", "一个分母是另一个的倍数"),
      explanation: t(
        "$\\frac{11}{12} - \\frac{1}{4} = \\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$.",
        "$\\frac{11}{12} - \\frac{1}{4} = \\frac{11}{12} - \\frac{3}{12} = \\frac{8}{12} = \\frac{2}{3}$。",
      ),
      generate: (rng) => pairProblem(orderedPair(rng, true), true),
    },
    {
      id: "subtracting-with-the-least-common-denominator",
      title: t("Using the least common denominator", "用最小公分母"),
      explanation: t(
        "$\\frac{7}{9} - \\frac{1}{6} = \\frac{14}{18} - \\frac{3}{18} = \\frac{11}{18}$.",
        "$\\frac{7}{9} - \\frac{1}{6} = \\frac{14}{18} - \\frac{3}{18} = \\frac{11}{18}$。",
      ),
      generate: (rng) => pairProblem(orderedPair(rng, false), true),
    },
  ],
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
      `${n} walked $${x}$ ${u.en} in the morning and $${y}$ ${u.en} in the afternoon. How many ${u.en} did they walk in all?`,
    zh: (n, x, y, u) => `${n} 上午走了 $${x}$ ${u.zh}，下午走了 $${y}$ ${u.zh}。一共走了多少${u.zh}？`,
  },
  {
    sub: false,
    en: (n, x, y, u) =>
      `${n} used $${x}$ ${u.en} of water for one plant and $${y}$ ${u.en} for another. How much water did they use in all, in ${u.en}?`,
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
      `On Monday ${n} practiced for $${x}$ ${u.en}, and on Tuesday for $${y}$ ${u.en}. How much longer did they practice on Monday, in ${u.en}?`,
    zh: (n, x, y, u) => `${n} 星期一练习了 $${x}$ ${u.zh}，星期二练习了 $${y}$ ${u.zh}。星期一比星期二多练习了多少${u.zh}？`,
  },
];

/** wordProblem builds a fraction word problem whose amounts are x and y and whose answer is value. */
function wordProblem(rng: Rng, sub: boolean, x: string, y: string, value: Q, wrong: readonly Q[], solution: Text): Problem {
  const s = rng.pick(wordStories.filter((w) => w.sub === sub));
  const u = s.en("", "", "", measures[0]!).includes("practiced")
    ? { en: "hours", zh: "小时" }
    : s.en("", "", "", measures[0]!).includes("water")
      ? rng.pick([measures[1]!, measures[2]!])
      : rng.pick([measures[0]!, measures[5]!]);
  const n = rng.pick(names);
  return numberProblem({ prompt: t(s.en(n, x, y, u), s.zh(n, x, y, u)), answer: value, form: "mixed", wrong, solution });
}

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
    {
      id: "adding-fractions-in-word-problems",
      title: t("Joining amounts", "合并两个量"),
      explanation: t(
        "$\\frac{1}{2}$ cup of milk and $\\frac{2}{3}$ cup of water make $\\frac{3}{6} + \\frac{4}{6} = \\frac{7}{6} = 1\\frac{1}{6}$ cups.",
        "$\\frac{1}{2}$ 杯牛奶和 $\\frac{2}{3}$ 杯水合起来是 $\\frac{3}{6} + \\frac{4}{6} = \\frac{7}{6} = 1\\frac{1}{6}$ 杯。",
      ),
      generate(rng) {
        const p = rng.bool() ? relatedPair(rng) : unrelatedPair(rng);
        return wordProblem(
          rng,
          false,
          fr(p.a, p.b),
          fr(p.c, p.d),
          pairValue(p, false),
          pairSlips(p, false),
          t(`Add the amounts:${commonSteps(p, false)}`, `把两个量相加：${commonSteps(p, false)}`),
        );
      },
    },
    {
      id: "subtracting-fractions-in-word-problems",
      title: t("What is left, or how much more", "还剩多少或多多少"),
      explanation: t(
        "$\\frac{5}{6}$ liter minus $\\frac{1}{4}$ liter leaves $\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$ liter.",
        "$\\frac{5}{6}$ 升减去 $\\frac{1}{4}$ 升，还剩 $\\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$ 升。",
      ),
      generate(rng) {
        const p = orderedPair(rng, rng.bool());
        return wordProblem(
          rng,
          true,
          fr(p.a, p.b),
          fr(p.c, p.d),
          pairValue(p, true),
          pairSlips(p, true),
          t(`Subtract the amounts:${commonSteps(p, true)}`, `把两个量相减：${commonSteps(p, true)}`),
        );
      },
    },
  ],
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

/** mixedSteps explains adding or subtracting two mixed numbers part by part, over a common denominator. */
function mixedSteps(m: MixedPair, sub: boolean): Text {
  const L = lcm(m.b, m.d);
  const [x, y] = [(m.a * L) / m.b, (m.c * L) / m.d];
  const op = sub ? "-" : "+";
  const v = mixedPairValue(m, sub);
  const first = `${mx(m.w1, m.a, m.b)} ${op} ${mx(m.w2, m.c, m.d)} = ${mx(m.w1, x, L)} ${op} ${mx(m.w2, y, L)}`;
  if (!sub) {
    const s = x + y;
    const line2 = `= ${m.w1 + m.w2}${fr(s, L)}`;
    return t(
      `Rewrite the fractions with the common denominator ${L}, then add the whole numbers and the fractions${s > L ? ", regrouping a whole" : ""}:${steps(first, line2, `= ${mq(v)}`)}`,
      `把分数部分通分成分母 ${L}，再把整数部分和分数部分分别相加${s > L ? "，满一进一" : ""}：${steps(first, line2, `= ${mq(v)}`)}`,
    );
  }
  if (x >= y)
    return t(
      `Rewrite the fractions with the common denominator ${L}, then subtract the whole numbers and the fractions:${steps(first, `= ${mq(v)}`)}`,
      `把分数部分通分成分母 ${L}，再把整数部分和分数部分分别相减：${steps(first, `= ${mq(v)}`)}`,
    );
  const borrowed = `= ${mx(m.w1 - 1, x + L, L)} - ${mx(m.w2, y, L)}`;
  return t(
    `Rewrite the fractions with the common denominator ${L}. Since $${fr(x, L)}$ is less than $${fr(y, L)}$, regroup one whole as $${fr(L, L)}$:${steps(first, borrowed, `= ${mq(v)}`)}`,
    `把分数部分通分成分母 ${L}。因为 $${fr(x, L)}$ 比 $${fr(y, L)}$ 小，从整数部分退一作 $${fr(L, L)}$：${steps(first, borrowed, `= ${mq(v)}`)}`,
  );
}

/** mixedSlips are values typical slips give: forgetting to regroup, or combining denominators. */
function mixedSlips(m: MixedPair, sub: boolean): Q[] {
  const v = mixedPairValue(m, sub);
  const out = [v.add(Q.one), v.sub(Q.one)].filter((q) => q.sign() > 0);
  const frac = pairSlips(m, sub)[0];
  if (frac) out.push(qf(sub ? m.w1 - m.w2 : m.w1 + m.w2, 1).add(frac));
  return out;
}

/** mixedProblem asks for w1 a/b ± w2 c/d. */
function mixedProblem(m: MixedPair, sub: boolean): Problem {
  const op = sub ? "-" : "+";
  return numberProblem({
    prompt: t(`Find $${mx(m.w1, m.a, m.b)} ${op} ${mx(m.w2, m.c, m.d)}$.`, `计算 $${mx(m.w1, m.a, m.b)} ${op} ${mx(m.w2, m.c, m.d)}$。`),
    answer: mixedPairValue(m, sub),
    form: "mixed",
    wrong: mixedSlips(m, sub),
    solution: mixedSteps(m, sub),
  });
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
    {
      id: "adding-unlike-mixed-numbers-without-regrouping",
      title: t("Without regrouping", "不需要进位"),
      explanation: t(
        "$3\\frac{1}{4} + 2\\frac{1}{3} = 3\\frac{3}{12} + 2\\frac{4}{12} = 5\\frac{7}{12}$.",
        "$3\\frac{1}{4} + 2\\frac{1}{3} = 3\\frac{3}{12} + 2\\frac{4}{12} = 5\\frac{7}{12}$。",
      ),
      generate: (rng) => mixedProblem(mixedPair(rng, false, false), false),
    },
    {
      id: "adding-unlike-mixed-numbers-with-regrouping",
      title: t("With regrouping", "需要进位"),
      explanation: t(
        "$1\\frac{5}{6} + 2\\frac{1}{2} = 1\\frac{5}{6} + 2\\frac{3}{6} = 3\\frac{8}{6} = 4\\frac{1}{3}$.",
        "$1\\frac{5}{6} + 2\\frac{1}{2} = 1\\frac{5}{6} + 2\\frac{3}{6} = 3\\frac{8}{6} = 4\\frac{1}{3}$。",
      ),
      generate: (rng) => mixedProblem(mixedPair(rng, false, true), false),
    },
  ],
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
    {
      id: "subtracting-unlike-mixed-numbers-without-regrouping",
      title: t("Without regrouping", "不需要退位"),
      explanation: t(
        "$6\\frac{3}{4} - 2\\frac{1}{6} = 6\\frac{9}{12} - 2\\frac{2}{12} = 4\\frac{7}{12}$.",
        "$6\\frac{3}{4} - 2\\frac{1}{6} = 6\\frac{9}{12} - 2\\frac{2}{12} = 4\\frac{7}{12}$。",
      ),
      generate: (rng) => mixedProblem(mixedPair(rng, true, false), true),
    },
    {
      id: "subtracting-unlike-mixed-numbers-with-regrouping",
      title: t("With regrouping", "需要退位"),
      explanation: t(
        "$4\\frac{1}{3} - 1\\frac{3}{4} = 4\\frac{4}{12} - 1\\frac{9}{12} = 3\\frac{16}{12} - 1\\frac{9}{12} = 2\\frac{7}{12}$.",
        "$4\\frac{1}{3} - 1\\frac{3}{4} = 4\\frac{4}{12} - 1\\frac{9}{12} = 3\\frac{16}{12} - 1\\frac{9}{12} = 2\\frac{7}{12}$。",
      ),
      generate: (rng) => mixedProblem(mixedPair(rng, true, true), true),
    },
  ],
);

/** improperSteps explains subtracting mixed numbers by writing both as improper fractions over a common denominator. */
function improperSteps(m: MixedPair): Text {
  const L = lcm(m.b, m.d);
  const x = ((m.w1 * m.b + m.a) * L) / m.b;
  const y = ((m.w2 * m.d + m.c) * L) / m.d;
  const v = mixedPairValue(m, true);
  const lines = steps(
    `${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)} = ${fr(m.w1 * m.b + m.a, m.b)} - ${fr(m.w2 * m.d + m.c, m.d)}`,
    `= ${fr(x, L)} - ${fr(y, L)} = ${fr(x - y, L)}`,
    `= ${mq(v)}`,
  );
  return t(
    `Write both as improper fractions, rewrite them with the common denominator ${L}, and subtract:${lines}`,
    `把两个带分数都化成假分数，通分成分母 ${L}，再相减：${lines}`,
  );
}

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
    {
      id: "subtracting-unlike-mixed-numbers-as-improper-fractions",
      title: t("Subtracting as improper fractions", "化成假分数相减"),
      explanation: t(
        "$2\\frac{1}{2} - 1\\frac{4}{5} = \\frac{5}{2} - \\frac{9}{5} = \\frac{25}{10} - \\frac{18}{10} = \\frac{7}{10}$.",
        "$2\\frac{1}{2} - 1\\frac{4}{5} = \\frac{5}{2} - \\frac{9}{5} = \\frac{25}{10} - \\frac{18}{10} = \\frac{7}{10}$。",
      ),
      generate(rng) {
        const m = mixedPair(rng, true, true);
        return numberProblem({
          prompt: t(
            `Find $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$ by writing both as improper fractions.`,
            `把两个数都化成假分数，计算 $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$。`,
          ),
          answer: mixedPairValue(m, true),
          form: "mixed",
          wrong: mixedSlips(m, true),
          solution: improperSteps(m),
        });
      },
    },
    {
      id: "differences-less-than-one",
      title: t("Differences less than 1", "差小于 1"),
      explanation: t(
        "$4\\frac{1}{6} - 3\\frac{3}{4} = \\frac{25}{6} - \\frac{15}{4} = \\frac{50}{12} - \\frac{45}{12} = \\frac{5}{12}$.",
        "$4\\frac{1}{6} - 3\\frac{3}{4} = \\frac{25}{6} - \\frac{15}{4} = \\frac{50}{12} - \\frac{45}{12} = \\frac{5}{12}$。",
      ),
      generate(rng) {
        const base = mixedPair(rng, true, true);
        const w2 = rng.int(1, 8);
        const m = { ...base, w1: w2 + 1, w2 };
        return numberProblem({
          prompt: t(`Find $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$.`, `计算 $${mx(m.w1, m.a, m.b)} - ${mx(m.w2, m.c, m.d)}$。`),
          answer: mixedPairValue(m, true),
          form: "mixed",
          wrong: [...pairSlips(ordered(m) ?? m, true).slice(0, 1), mixedPairValue(m, true).add(Q.one), qf(m.c, m.d).sub(qf(m.a, m.b))],
          solution: improperSteps(m),
        });
      },
    },
  ],
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
    {
      id: "adding-mixed-numbers-in-word-problems",
      title: t("Joining amounts", "合并两个量"),
      explanation: t(
        "$1\\frac{1}{3}$ miles and $2\\frac{1}{2}$ miles make $1\\frac{2}{6} + 2\\frac{3}{6} = 3\\frac{5}{6}$ miles.",
        "$1\\frac{1}{3}$ 英里和 $2\\frac{1}{2}$ 英里一共是 $1\\frac{2}{6} + 2\\frac{3}{6} = 3\\frac{5}{6}$ 英里。",
      ),
      generate(rng) {
        const m = mixedPair(rng, false, rng.bool());
        return wordProblem(
          rng,
          false,
          mx(m.w1, m.a, m.b),
          mx(m.w2, m.c, m.d),
          mixedPairValue(m, false),
          mixedSlips(m, false),
          mixedSteps(m, false),
        );
      },
    },
    {
      id: "subtracting-mixed-numbers-in-word-problems",
      title: t("What is left, or how much more", "还剩多少或多多少"),
      explanation: t(
        "$5\\frac{1}{4}$ meters minus $2\\frac{1}{2}$ meters leaves $4\\frac{5}{4} - 2\\frac{2}{4} = 2\\frac{3}{4}$ meters.",
        "$5\\frac{1}{4}$ 米减去 $2\\frac{1}{2}$ 米，还剩 $4\\frac{5}{4} - 2\\frac{2}{4} = 2\\frac{3}{4}$ 米。",
      ),
      generate(rng) {
        const m = mixedPair(rng, true, rng.bool());
        return wordProblem(
          rng,
          true,
          mx(m.w1, m.a, m.b),
          mx(m.w2, m.c, m.d),
          mixedPairValue(m, true),
          mixedSlips(m, true),
          mixedSteps(m, true),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Multiplying fractions

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
    {
      id: "unit-fraction-times-unit-fraction-models",
      title: t("A unit fraction of a unit fraction", "单位分数乘单位分数"),
      explanation: t(
        "$\\frac{1}{2} \\times \\frac{1}{4}$: the twice-shaded part is $1$ of $8$ small rectangles, so the product is $\\frac{1}{8}$.",
        "$\\frac{1}{2} \\times \\frac{1}{4}$：涂了两次的部分是 $8$ 个小长方形中的 $1$ 个，所以积是 $\\frac{1}{8}$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const b = rng.int(2, 6);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${fr(1, b)} \\times ${fr(1, d)}$. What is the product?`,
              `模型表示 $${fr(1, b)} \\times ${fr(1, d)}$。积是多少？`,
            ),
            answer: qf(1, b * d),
            form: "fraction",
            wrong: [qf(1, b + d), qf(2, b * d), qf(1, Math.max(b, d))],
            solution: t(
              `The square is cut into $${b} \\times ${d} = ${b * d}$ small rectangles, and $1$ is shaded twice: $${fr(1, b * d)}$.`,
              `正方形被分成 $${b} \\times ${d} = ${b * d}$ 个小长方形，其中 $1$ 个涂了两次：$${fr(1, b * d)}$。`,
            ),
          }),
          figure: productGrid(1, d, 1, b),
        };
      },
    },
    {
      id: "unit-fraction-times-fraction-models",
      title: t("A unit fraction of a fraction", "分数乘单位分数"),
      explanation: t(
        "$\\frac{1}{3} \\times \\frac{3}{4}$: $3$ of the $12$ small rectangles are shaded twice, so the product is $\\frac{3}{12} = \\frac{1}{4}$.",
        "$\\frac{1}{3} \\times \\frac{3}{4}$：$12$ 个小长方形中有 $3$ 个涂了两次，所以积是 $\\frac{3}{12} = \\frac{1}{4}$。",
      ),
      generate(rng) {
        const [a, d] = properFraction(rng, 8, 3);
        const b = rng.int(2, 6);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${fr(1, b)} \\times ${fr(a, d)}$. What is the product?`,
              `模型表示 $${fr(1, b)} \\times ${fr(a, d)}$。积是多少？`,
            ),
            answer: qf(a, b * d),
            form: "fraction",
            wrong: [qf(a, b + d), qf(a + 1, b * d), qf(1, b * d)],
            solution: t(
              `There are $${b} \\times ${d} = ${b * d}$ small rectangles, and $${a}$ are shaded twice: $${fr(a, b * d)}${gcd(a, b * d) > 1 ? ` = ${lowest(a, b * d)}` : ""}$.`,
              `共有 $${b} \\times ${d} = ${b * d}$ 个小长方形，其中 $${a}$ 个涂了两次：$${fr(a, b * d)}${gcd(a, b * d) > 1 ? ` = ${lowest(a, b * d)}` : ""}$。`,
            ),
          }),
          figure: productGrid(a, d, 1, b),
        };
      },
    },
  ],
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
    {
      id: "fraction-times-fraction-models",
      title: t("Reading the product from the model", "从模型中读出积"),
      explanation: t(
        "$\\frac{2}{5} \\times \\frac{2}{3}$: $4$ of the $15$ small rectangles are shaded twice, so the product is $\\frac{4}{15}$.",
        "$\\frac{2}{5} \\times \\frac{2}{3}$：$15$ 个小长方形中有 $4$ 个涂了两次，所以积是 $\\frac{4}{15}$。",
      ),
      generate(rng) {
        const [a, d] = properFraction(rng, 6, 2);
        const [c, b] = properFraction(rng, 6, 3);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${fr(c, b)} \\times ${fr(a, d)}$. What is the product?`,
              `模型表示 $${fr(c, b)} \\times ${fr(a, d)}$。积是多少？`,
            ),
            answer: qf(a * c, b * d),
            form: "fraction",
            wrong: [qf(a + c, b + d), qf(a * c, b + d), qf(a + c, b * d)],
            solution: t(
              `$${c} \\times ${a} = ${a * c}$ of the $${b} \\times ${d} = ${b * d}$ small rectangles are shaded twice: $${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${lowest(a * c, b * d)}` : ""}$.`,
              `$${b} \\times ${d} = ${b * d}$ 个小长方形中有 $${c} \\times ${a} = ${a * c}$ 个涂了两次：$${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${lowest(a * c, b * d)}` : ""}$。`,
            ),
          }),
          figure: productGrid(a, d, c, b),
        };
      },
    },
    {
      id: "choosing-the-model-for-a-product",
      title: t("Which product the model shows", "模型表示哪个乘法"),
      explanation: t(
        "A square with $3$ of $5$ columns and $1$ of $2$ rows shaded shows $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$.",
        "一个正方形 $5$ 列中涂了 $3$ 列、$2$ 行中涂了 $1$ 行，表示 $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$。",
      ),
      generate(rng) {
        let a: number;
        let d: number;
        let c: number;
        let b: number;
        do {
          [a, d] = properFraction(rng, 6, 3);
          [c, b] = properFraction(rng, 5, 2);
        } while (b === d);
        return pickChoice(
          rng,
          t("Which multiplication does the model show?", "模型表示哪个乘法算式？"),
          mathText(`${fr(c, b)} \\times ${fr(a, d)} = ${lowest(a * c, b * d)}`),
          [
            mathText(`${fr(c, d)} \\times ${fr(a, b)} = ${lowest(a * c, b * d)}`),
            mathText(`${fr(c, b)} + ${fr(a, d)} = ${lowest(a * c, b * d)}`),
            mathText(`${fr(c, b)} \\times ${fr(a, d)} = ${lowest(a * c, b + d)}`),
          ],
          t(
            `${a} of ${d} columns show $${fr(a, d)}$, ${c} of ${b} rows show $${fr(c, b)}$ of it, and ${a * c} of ${b * d} rectangles are shaded twice.`,
            `${d} 列中的 ${a} 列表示 $${fr(a, d)}$，${b} 行中的 ${c} 行表示取它的 $${fr(c, b)}$，${b * d} 个小长方形中有 ${a * c} 个涂了两次。`,
          ),
          productGrid(a, d, c, b),
        );
      },
    },
  ],
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
    {
      id: "fraction-of-a-fraction-in-context",
      title: t("A fraction of a fraction", "一个分数的几分之几"),
      explanation: t(
        "$\\frac{1}{2}$ of $\\frac{3}{5}$ mile is $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$ mile.",
        "$\\frac{3}{5}$ 英里的 $\\frac{1}{2}$ 是 $\\frac{1}{2} \\times \\frac{3}{5} = \\frac{3}{10}$ 英里。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 8, 2);
        const [c, d] = properFraction(rng, 8, 3);
        const s = rng.pick(fractionOfStories);
        const n = rng.pick(names);
        return numberProblem({
          prompt: t(s.en(n, fr(a, b), fr(c, d)), s.zh(n, fr(a, b), fr(c, d))),
          answer: qf(a * c, b * d),
          form: "fraction",
          wrong: [qf(a * d, b * c), qf(a + c, b + d), qf(c, d).sub(qf(a * c, b * d))],
          solution: t(
            `$${fr(a, b)}$ of $${fr(c, d)}$ is $${fr(a, b)} \\times ${fr(c, d)} = ${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${lowest(a * c, b * d)}` : ""}$.`,
            `$${fr(c, d)}$ 的 $${fr(a, b)}$ 是 $${fr(a, b)} \\times ${fr(c, d)} = ${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${lowest(a * c, b * d)}` : ""}$。`,
          ),
        });
      },
    },
    {
      id: "fraction-of-a-whole-amount-in-context",
      title: t("A fraction of a whole amount", "一个整数的几分之几"),
      explanation: t(
        "$\\frac{3}{8}$ of $20$ pounds is $\\frac{3}{8} \\times 20 = \\frac{60}{8} = 7\\frac{1}{2}$ pounds.",
        "$20$ 磅的 $\\frac{3}{8}$ 是 $\\frac{3}{8} \\times 20 = \\frac{60}{8} = 7\\frac{1}{2}$ 磅。",
      ),
      generate(rng) {
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
        return numberProblem({
          prompt: t(s.en, s.zh),
          answer: qf(a * w, b),
          form: "mixed",
          wrong: [qf(w * b, a), qf(w, b), qf(w - a, b)],
          solution: t(
            `$${fr(a, b)} \\times ${w} = ${fr(a * w, b)} = ${mq(qf(a * w, b))}$.`,
            `$${fr(a, b)} \\times ${w} = ${fr(a * w, b)} = ${mq(qf(a * w, b))}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "swapping-denominators",
      title: t("Swapping the denominators", "交换分母"),
      explanation: t(
        "$\\frac{5}{6} \\times \\frac{3}{10} = \\frac{5}{10} \\times \\frac{3}{6}$, which simplifies to $\\frac{1}{2} \\times \\frac{1}{2}$.",
        "$\\frac{5}{6} \\times \\frac{3}{10} = \\frac{5}{10} \\times \\frac{3}{6}$，约分后是 $\\frac{1}{2} \\times \\frac{1}{2}$。",
      ),
      generate(rng) {
        const { a, b, c, d } = swapFriendly(rng);
        return pickChoice(
          rng,
          t(`Which product is equal to $${fr(a, b)} \\times ${fr(c, d)}$?`, `哪个积等于 $${fr(a, b)} \\times ${fr(c, d)}$？`),
          mathText(`${fr(a, d)} \\times ${fr(c, b)}`),
          [mathText(`${fr(b, a)} \\times ${fr(c, d)}`), mathText(`${fr(a, c)} \\times ${fr(b, d)}`), mathText(`${fr(a, b)} + ${fr(c, d)}`)],
          t(
            `Swapping the denominators keeps the numerator product $${a} \\times ${c}$ and the denominator product $${b} \\times ${d}$, so $${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times ${fr(c, b)}$.`,
            `交换分母后，分子的积 $${a} \\times ${c}$ 和分母的积 $${b} \\times ${d}$ 都不变，所以 $${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times ${fr(c, b)}$。`,
          ),
        );
      },
    },
    {
      id: "multiplying-after-swapping",
      title: t("Multiplying after swapping", "交换后再相乘"),
      explanation: t(
        "$\\frac{7}{12} \\times \\frac{4}{21} = \\frac{7}{21} \\times \\frac{4}{12} = \\frac{1}{3} \\times \\frac{1}{3} = \\frac{1}{9}$.",
        "$\\frac{7}{12} \\times \\frac{4}{21} = \\frac{7}{21} \\times \\frac{4}{12} = \\frac{1}{3} \\times \\frac{1}{3} = \\frac{1}{9}$。",
      ),
      generate(rng) {
        const { a, b, c, d } = swapFriendly(rng);
        const v = qf(a * c, b * d);
        return numberProblem({
          prompt: t(`Find $${fr(a, b)} \\times ${fr(c, d)}$.`, `计算 $${fr(a, b)} \\times ${fr(c, d)}$。`),
          answer: v,
          form: "fraction",
          wrong: [qf(a + c, b + d), qf(a * d, b * c), qf(a * c + 1, b * d)],
          solution: t(
            `Swap the denominators and simplify:${steps(`${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times ${fr(c, b)} = ${lowest(a, d)} \\times ${lowest(c, b)} = ${v.toLatex()}`)}`,
            `交换分母后约分：${steps(`${fr(a, b)} \\times ${fr(c, d)} = ${fr(a, d)} \\times ${fr(c, b)} = ${lowest(a, d)} \\times ${lowest(c, b)} = ${v.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
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
    {
      id: "multiplying-a-mixed-number-by-a-whole-number",
      title: t("Finding the product", "求积"),
      explanation: t(
        "$4 \\times 1\\frac{2}{3} = 4 \\times \\frac{5}{3} = \\frac{20}{3} = 6\\frac{2}{3}$.",
        "$4 \\times 1\\frac{2}{3} = 4 \\times \\frac{5}{3} = \\frac{20}{3} = 6\\frac{2}{3}$。",
      ),
      generate(rng) {
        const n = rng.int(2, 9);
        const w = rng.int(1, 6);
        const [a, d] = properFraction(rng, 10, 2);
        const v = mixedValue(w, a, d).mul(qf(n, 1));
        return numberProblem({
          prompt: t(`Find $${n} \\times ${mx(w, a, d)}$.`, `计算 $${n} \\times ${mx(w, a, d)}$。`),
          answer: v,
          form: "mixed",
          wrong: [mixedValue(n * w, a, d), mixedValue(w, n * a, d * n), qf(n * (w * d + a), d * n)],
          solution: t(
            `$${n} \\times ${mx(w, a, d)} = ${n} \\times ${fr(w * d + a, d)} = ${fr(n * (w * d + a), d)} = ${mq(v)}$.`,
            `$${n} \\times ${mx(w, a, d)} = ${n} \\times ${fr(w * d + a, d)} = ${fr(n * (w * d + a), d)} = ${mq(v)}$。`,
          ),
        });
      },
    },
    {
      id: "mixed-number-times-whole-number-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "$5$ boards, each $2\\frac{1}{2}$ feet long, measure $5 \\times 2\\frac{1}{2} = 12\\frac{1}{2}$ feet in all.",
        "$5$ 块木板，每块长 $2\\frac{1}{2}$ 英尺，一共长 $5 \\times 2\\frac{1}{2} = 12\\frac{1}{2}$ 英尺。",
      ),
      generate(rng) {
        const n = rng.int(2, 9);
        const w = rng.int(1, 6);
        const [a, d] = properFraction(rng, 8, 2);
        const v = mixedValue(w, a, d).mul(qf(n, 1));
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
        return numberProblem({
          prompt: t(s.en, s.zh),
          answer: v,
          form: "mixed",
          wrong: [mixedValue(n * w, a, d), mixedValue(w + n, a, d), v.add(Q.one)],
          solution: t(
            `$${n} \\times ${mx(w, a, d)} = ${n} \\times ${fr(w * d + a, d)} = ${fr(n * (w * d + a), d)} = ${mq(v)}$.`,
            `$${n} \\times ${mx(w, a, d)} = ${n} \\times ${fr(w * d + a, d)} = ${fr(n * (w * d + a), d)} = ${mq(v)}$。`,
          ),
        });
      },
    },
  ],
);

/** productSteps explains a product of two numbers written as fractions (improper or proper). */
function productSteps(xTex: string, yTex: string, x: [number, number], y: [number, number]): string {
  const v = qf(x[0] * y[0], x[1] * y[1]);
  return steps(`${xTex} \\times ${yTex} = ${fr(x[0], x[1])} \\times ${fr(y[0], y[1])} = ${fr(x[0] * y[0], x[1] * y[1])}`, `= ${mq(v)}`);
}

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
    {
      id: "fraction-times-mixed-number",
      title: t("Finding the product", "求积"),
      explanation: t(
        "$\\frac{3}{4} \\times 2\\frac{1}{5} = \\frac{3}{4} \\times \\frac{11}{5} = \\frac{33}{20} = 1\\frac{13}{20}$.",
        "$\\frac{3}{4} \\times 2\\frac{1}{5} = \\frac{3}{4} \\times \\frac{11}{5} = \\frac{33}{20} = 1\\frac{13}{20}$。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 9, 2);
        const w = rng.int(1, 5);
        const [c, d] = properFraction(rng, 9, 2);
        const v = qf(a, b).mul(mixedValue(w, c, d));
        return numberProblem({
          prompt: t(`Find $${fr(a, b)} \\times ${mx(w, c, d)}$.`, `计算 $${fr(a, b)} \\times ${mx(w, c, d)}$。`),
          answer: v,
          form: "mixed",
          wrong: [mixedValue(w, a * c, b * d), qf(a * w, b).add(qf(c, d)), v.add(qf(1, b * d))],
          solution: t(
            `Write the mixed number as an improper fraction:${productSteps(fr(a, b), mx(w, c, d), [a, b], [w * d + c, d])}`,
            `把带分数化成假分数：${productSteps(fr(a, b), mx(w, c, d), [a, b], [w * d + c, d])}`,
          ),
        });
      },
    },
    {
      id: "simplifying-before-multiplying-mixed-numbers",
      title: t("Simplifying before multiplying", "先约分再相乘"),
      explanation: t(
        "$\\frac{5}{6} \\times 2\\frac{2}{5} = \\frac{5}{6} \\times \\frac{12}{5}$: the $5$s cancel and $12 \\div 6 = 2$, so the product is $2$.",
        "$\\frac{5}{6} \\times 2\\frac{2}{5} = \\frac{5}{6} \\times \\frac{12}{5}$：两个 $5$ 约去，$12 \\div 6 = 2$，所以积是 $2$。",
      ),
      generate(rng) {
        for (;;) {
          const [a, b] = properFraction(rng, 12, 3);
          const w = rng.int(1, 4);
          const [c, d] = properFraction(rng, 9, 2);
          const n = w * d + c;
          if (gcd(a, d) === 1 && gcd(n, b) === 1) continue;
          const v = qf(a * n, b * d);
          return numberProblem({
            prompt: t(`Find $${fr(a, b)} \\times ${mx(w, c, d)}$.`, `计算 $${fr(a, b)} \\times ${mx(w, c, d)}$。`),
            answer: v,
            form: "mixed",
            wrong: [mixedValue(w, a * c, b * d), qf(a * n, b * d + 1), v.add(Q.one)],
            solution: t(
              `Write the mixed number as an improper fraction, cancel common factors, and multiply:${productSteps(fr(a, b), mx(w, c, d), [a, b], [n, d])}`,
              `把带分数化成假分数，约去公因数后相乘：${productSteps(fr(a, b), mx(w, c, d), [a, b], [n, d])}`,
            ),
          });
        }
      },
    },
  ],
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
    {
      id: "multiplying-two-mixed-numbers",
      title: t("Finding the product", "求积"),
      explanation: t(
        "$2\\frac{1}{3} \\times 1\\frac{1}{2} = \\frac{7}{3} \\times \\frac{3}{2} = \\frac{21}{6} = 3\\frac{1}{2}$.",
        "$2\\frac{1}{3} \\times 1\\frac{1}{2} = \\frac{7}{3} \\times \\frac{3}{2} = \\frac{21}{6} = 3\\frac{1}{2}$。",
      ),
      generate(rng) {
        const w1 = rng.int(1, 4);
        const w2 = rng.int(1, 4);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const v = mixedValue(w1, a, b).mul(mixedValue(w2, c, d));
        return numberProblem({
          prompt: t(`Find $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$.`, `计算 $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$。`),
          answer: v,
          form: "mixed",
          wrong: [qf(w1 * w2, 1).add(qf(a * c, b * d)), v.add(Q.one), mixedValue(w1 + w2, a * c, b * d)],
          solution: t(
            `Write both as improper fractions:${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
            `把两个带分数都化成假分数：${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
          ),
        });
      },
    },
    {
      id: "squaring-and-larger-mixed-numbers",
      title: t("Larger mixed numbers", "较大的带分数"),
      explanation: t(
        "$3\\frac{1}{4} \\times 2\\frac{2}{5} = \\frac{13}{4} \\times \\frac{12}{5} = \\frac{156}{20} = 7\\frac{4}{5}$.",
        "$3\\frac{1}{4} \\times 2\\frac{2}{5} = \\frac{13}{4} \\times \\frac{12}{5} = \\frac{156}{20} = 7\\frac{4}{5}$。",
      ),
      generate(rng) {
        const w1 = rng.int(2, 6);
        const w2 = rng.int(2, 6);
        const [a, b] = properFraction(rng, 8, 2);
        const [c, d] = properFraction(rng, 8, 2);
        const v = mixedValue(w1, a, b).mul(mixedValue(w2, c, d));
        return numberProblem({
          prompt: t(`Find $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$.`, `计算 $${mx(w1, a, b)} \\times ${mx(w2, c, d)}$。`),
          answer: v,
          form: "mixed",
          wrong: [qf(w1 * w2, 1).add(qf(a * c, b * d)), v.sub(Q.one), qf(w1 * w2, 1)],
          solution: t(
            `Write both as improper fractions:${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
            `把两个带分数都化成假分数：${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
          ),
        });
      },
    },
  ],
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
    {
      id: "rates-with-mixed-numbers",
      title: t("Amounts per unit", "每单位的量"),
      explanation: t(
        "Walking $3\\frac{1}{2}$ miles per hour for $1\\frac{1}{2}$ hours covers $\\frac{7}{2} \\times \\frac{3}{2} = \\frac{21}{4} = 5\\frac{1}{4}$ miles.",
        "每小时走 $3\\frac{1}{2}$ 英里，走 $1\\frac{1}{2}$ 小时，一共走 $\\frac{7}{2} \\times \\frac{3}{2} = \\frac{21}{4} = 5\\frac{1}{4}$ 英里。",
      ),
      generate(rng) {
        const w1 = rng.int(1, 6);
        const w2 = rng.int(1, 4);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const v = mixedValue(w1, a, b).mul(mixedValue(w2, c, d));
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
            zh: `奶酪每磅 $${mx(w1, a, b)}$ 元。$${mx(w2, c, d)}$ 磅要多少元？`,
          },
        ]);
        return numberProblem({
          prompt: t(s.en, s.zh),
          answer: v,
          form: "mixed",
          wrong: [qf(w1 * w2, 1).add(qf(a * c, b * d)), mixedValue(w1, a, b).add(mixedValue(w2, c, d)), v.add(Q.one)],
          solution: t(
            `Multiply:${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
            `相乘：${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
          ),
        });
      },
    },
    {
      id: "areas-and-scaling-with-mixed-numbers",
      title: t("Areas and scaling", "面积与放缩"),
      explanation: t(
        "A rug $2\\frac{1}{2}$ yards by $1\\frac{1}{3}$ yards has area $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{20}{6} = 3\\frac{1}{3}$ square yards.",
        "长 $2\\frac{1}{2}$ 码、宽 $1\\frac{1}{3}$ 码的地毯，面积是 $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{20}{6} = 3\\frac{1}{3}$ 平方码。",
      ),
      generate(rng) {
        const w1 = rng.int(1, 6);
        const w2 = rng.int(1, 4);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const v = mixedValue(w1, a, b).mul(mixedValue(w2, c, d));
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
        return numberProblem({
          prompt: t(s.en, s.zh),
          answer: v,
          form: "mixed",
          wrong: [
            qf(w1 * w2, 1).add(qf(a * c, b * d)),
            mixedValue(w1, a, b)
              .add(mixedValue(w2, c, d))
              .mul(qf(2, 1)),
            v.sub(Q.one),
          ],
          solution: t(
            `Multiply:${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
            `相乘：${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
          ),
        });
      },
    },
  ],
);

export const connectingFractionMultiplicationAndArea = topic(
  "connecting-fraction-multiplication-and-area",
  t("Connecting Fraction Multiplication and Area", "分数乘法与面积"),
  t(
    "Cut a unit square into b equal rows and d equal columns: each small rectangle is 1/b by 1/d and has area 1/(b × d). A rectangle that is a/b by c/d is covered by a × c of them, so its area is (a × c)/(b × d) = a/b × c/d.",
    "把单位正方形平均分成 b 行、d 列：每个小长方形的长和宽是 1/b 和 1/d，面积是 1/(b × d)。长和宽是 a/b 和 c/d 的长方形正好由 a × c 个这样的小长方形铺满，所以它的面积是 (a × c)/(b × d) = a/b × c/d。",
  ),
  ["multiplying-fractions-using-models", "area-of-rectangles-and-squares"],
  ["5.NF.B.4b"],
  [
    {
      id: "area-of-a-unit-fraction-tile",
      title: t("The area of one small rectangle", "一个小长方形的面积"),
      explanation: t(
        "A unit square cut into $3$ rows and $4$ columns has $12$ equal tiles, each $\\frac{1}{3}$ by $\\frac{1}{4}$ unit, with area $\\frac{1}{12}$ square unit.",
        "把单位正方形分成 $3$ 行、$4$ 列，得到 $12$ 个相同的小块，每块长 $\\frac{1}{4}$、宽 $\\frac{1}{3}$，面积是 $\\frac{1}{12}$ 平方单位。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const d = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `A rectangle measures $${fr(1, b)}$ unit by $${fr(1, d)}$ unit. What is its area, in square units?`,
            `一个长方形的两边分别是 $${fr(1, b)}$ 单位和 $${fr(1, d)}$ 单位。它的面积是多少平方单位？`,
          ),
          answer: qf(1, b * d),
          form: "fraction",
          wrong: [qf(1, b + d), qf(2, b + d), qf(2, b * d)],
          solution: t(
            `$${b} \\times ${d} = ${b * d}$ such rectangles fill a unit square, so each has area $${fr(1, b * d)}$.`,
            `$${b} \\times ${d} = ${b * d}$ 个这样的长方形正好铺满单位正方形，所以每个的面积是 $${fr(1, b * d)}$。`,
          ),
        });
      },
    },
    {
      id: "counting-tiles-in-a-fractional-rectangle",
      title: t("Counting tiles", "数小块"),
      explanation: t(
        "A $\\frac{2}{3}$ by $\\frac{3}{4}$ rectangle is covered by $2 \\times 3 = 6$ tiles of size $\\frac{1}{3}$ by $\\frac{1}{4}$, so its area is $\\frac{6}{12} = \\frac{1}{2}$.",
        "长 $\\frac{3}{4}$、宽 $\\frac{2}{3}$ 的长方形由 $2 \\times 3 = 6$ 个 $\\frac{1}{3}$ 乘 $\\frac{1}{4}$ 的小块铺满，所以面积是 $\\frac{6}{12} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const [c, b] = properFraction(rng, 6, 2);
        const [a, d] = properFraction(rng, 8, 3);
        return {
          ...numberProblem({
            prompt: t(
              `The shaded rectangle is $${fr(a, d)}$ unit wide and $${fr(c, b)}$ unit tall. How many tiles of size $${fr(1, d)}$ by $${fr(1, b)}$ cover it?`,
              `涂色的长方形宽 $${fr(a, d)}$ 单位、高 $${fr(c, b)}$ 单位。需要多少个 $${fr(1, d)}$ 乘 $${fr(1, b)}$ 的小块才能铺满它？`,
            ),
            answer: a * c,
            form: "integer",
            wrong: [a + c, b * d, a * c + 1],
            solution: t(
              `It is ${a} tiles wide and ${c} tiles tall: $${a} \\times ${c} = ${a * c}$ tiles, so its area is $${fr(a * c, b * d)}$.`,
              `它宽 ${a} 块、高 ${c} 块：$${a} \\times ${c} = ${a * c}$ 块，所以面积是 $${fr(a * c, b * d)}$。`,
            ),
          }),
          figure: productGrid(a, d, c, b),
        };
      },
    },
  ],
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
    {
      id: "areas-with-fraction-sides",
      title: t("Fraction side lengths", "边长是分数"),
      explanation: t(
        "A $\\frac{5}{6}$ m by $\\frac{3}{4}$ m rectangle has area $\\frac{15}{24} = \\frac{5}{8}$ m².",
        "长 $\\frac{5}{6}$ 米、宽 $\\frac{3}{4}$ 米的长方形面积是 $\\frac{15}{24} = \\frac{5}{8}$ 平方米。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 10, 2);
        const [c, d] = properFraction(rng, 10, 2);
        return numberProblem({
          prompt: t(
            `A rectangle is $${fr(a, b)}$ meter long and $${fr(c, d)}$ meter wide. What is its area, in square meters?`,
            `一个长方形长 $${fr(a, b)}$ 米，宽 $${fr(c, d)}$ 米。它的面积是多少平方米？`,
          ),
          answer: qf(a * c, b * d),
          form: "fraction",
          wrong: [qf(a, b).add(qf(c, d)), qf(a, b).add(qf(c, d)).mul(qf(2, 1)), qf(a * c, b + d)],
          solution: t(
            `Area $= ${fr(a, b)} \\times ${fr(c, d)} = ${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${lowest(a * c, b * d)}` : ""}$ square meter.`,
            `面积 $= ${fr(a, b)} \\times ${fr(c, d)} = ${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${lowest(a * c, b * d)}` : ""}$ 平方米。`,
          ),
        });
      },
    },
    {
      id: "areas-with-mixed-number-sides",
      title: t("Mixed number side lengths", "边长是带分数"),
      explanation: t(
        "A $3\\frac{1}{2}$ ft by $2\\frac{1}{4}$ ft rectangle has area $\\frac{7}{2} \\times \\frac{9}{4} = \\frac{63}{8} = 7\\frac{7}{8}$ ft².",
        "长 $3\\frac{1}{2}$ 英尺、宽 $2\\frac{1}{4}$ 英尺的长方形面积是 $\\frac{7}{2} \\times \\frac{9}{4} = \\frac{63}{8} = 7\\frac{7}{8}$ 平方英尺。",
      ),
      generate(rng) {
        const w1 = rng.int(1, 6);
        const w2 = rng.int(1, 5);
        const [a, b] = properFraction(rng, 6, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const v = mixedValue(w1, a, b).mul(mixedValue(w2, c, d));
        return numberProblem({
          prompt: t(
            `A rectangle is $${mx(w1, a, b)}$ feet long and $${mx(w2, c, d)}$ feet wide. What is its area, in square feet?`,
            `一个长方形长 $${mx(w1, a, b)}$ 英尺，宽 $${mx(w2, c, d)}$ 英尺。它的面积是多少平方英尺？`,
          ),
          answer: v,
          form: "mixed",
          wrong: [
            qf(w1 * w2, 1).add(qf(a * c, b * d)),
            mixedValue(w1, a, b)
              .add(mixedValue(w2, c, d))
              .mul(qf(2, 1)),
            v.add(Q.one),
          ],
          solution: t(
            `Area $= ${mx(w1, a, b)} \\times ${mx(w2, c, d)}$:${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
            `面积 $= ${mx(w1, a, b)} \\times ${mx(w2, c, d)}$：${productSteps(mx(w1, a, b), mx(w2, c, d), [w1 * b + a, b], [w2 * d + c, d])}`,
          ),
        });
      },
    },
  ],
);

const scaleOptions: readonly Text[] = [t("greater than", "大于"), t("less than", "小于"), t("equal to", "等于")];

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
    {
      id: "comparing-a-product-with-a-factor",
      title: t("Comparing a product with a factor", "积与因数比较"),
      explanation: t(
        "$\\frac{7}{8} \\times 250$ is less than $250$, because $\\frac{7}{8}$ is less than $1$.",
        "$\\frac{7}{8} \\times 250$ 小于 $250$，因为 $\\frac{7}{8}$ 小于 $1$。",
      ),
      generate(rng) {
        const n = rng.int(12, 900);
        const kind = rng.int(0, 2);
        let fTex: string;
        if (kind === 0) {
          const [a, b] = properFraction(rng, 12, 2);
          fTex = fr(a, b);
        } else if (kind === 1) {
          const [a, b] = properFraction(rng, 9, 2);
          fTex = rng.bool() ? mx(rng.int(1, 3), a, b) : fr(b + a, b);
        } else {
          const b = rng.int(2, 12);
          fTex = fr(b, b);
        }
        const correct = kind === 0 ? 1 : kind === 1 ? 0 : 2;
        return choiceProblem({
          prompt: t(
            `Without multiplying, is $${fTex} \\times ${n}$ greater than, less than, or equal to $${n}$?`,
            `不计算，判断 $${fTex} \\times ${n}$ 大于、小于还是等于 $${n}$？`,
          ),
          options: scaleOptions,
          correct,
          solution: [
            t(`$${fTex}$ is greater than $1$, so the product is greater than $${n}$.`, `$${fTex}$ 大于 $1$，所以积大于 $${n}$。`),
            t(`$${fTex}$ is less than $1$, so the product is less than $${n}$.`, `$${fTex}$ 小于 $1$，所以积小于 $${n}$。`),
            t(`$${fTex} = 1$, so the product equals $${n}$.`, `$${fTex} = 1$，所以积等于 $${n}$。`),
          ][correct]!,
        });
      },
    },
    {
      id: "choosing-the-greatest-product",
      title: t("The greatest or least product", "最大或最小的积"),
      explanation: t(
        "Of $\\frac{2}{3} \\times 45$, $\\frac{5}{4} \\times 45$ and $1 \\times 45$, the greatest is $\\frac{5}{4} \\times 45$, since $\\frac{5}{4}$ is the greatest factor.",
        "在 $\\frac{2}{3} \\times 45$、$\\frac{5}{4} \\times 45$、$1 \\times 45$ 中，$\\frac{5}{4} \\times 45$ 最大，因为 $\\frac{5}{4}$ 是最大的因数。",
      ),
      generate(rng) {
        const n = rng.int(12, 300);
        const [a, b] = properFraction(rng, 9, 2);
        const [c, d] = properFraction(rng, 9, 2);
        const fs = [qf(a, b), qf(1, 1), qf(d + c, d)];
        if (fs[0]!.eq(fs[2]!)) fs[0] = qf(1, 2);
        const greatest = rng.bool();
        const r = rng.int(0, 2);
        const shown = [0, 1, 2].map((i) => fs[(i + r) % 3]!);
        const extreme = fs[greatest ? 2 : 0]!;
        const target = shown.indexOf(extreme);
        const options = shown.map((f) => mathText(`${f.toLatex()} \\times ${n}`));
        const list = shown.map((f) => `$${f.toLatex()} \\times ${n}$`).join(", ");
        return choiceProblem({
          prompt: greatest
            ? t(`Which product is the greatest: ${list}?`, `哪个积最大：${list}？`)
            : t(`Which product is the least: ${list}?`, `哪个积最小：${list}？`),
          options,
          correct: target,
          solution: t(
            `All three multiply $${n}$; the one with the ${greatest ? "greatest" : "least"} factor, $${extreme.toLatex()}$, is the ${greatest ? "greatest" : "least"}.`,
            `三个积都是 $${n}$ 乘一个数；因数 $${extreme.toLatex()}$ ${greatest ? "最大" : "最小"}，所以这个积${greatest ? "最大" : "最小"}。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Dividing fractions

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
    {
      id: "how-many-unit-fractions-in-wholes",
      title: t("How many parts are in the wholes", "整数里有多少个几分之一"),
      explanation: t(
        "$2 \\div \\frac{1}{3}$: $2$ bars cut into thirds make $6$ thirds, so $2 \\div \\frac{1}{3} = 6$.",
        "$2 \\div \\frac{1}{3}$：$2$ 个长条都分成三份，共 $6$ 个三分之一，所以 $2 \\div \\frac{1}{3} = 6$。",
      ),
      generate(rng) {
        const w = rng.int(1, 4);
        const d = rng.int(2, 10);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows ${w} whole${w === 1 ? "" : "s"} cut into parts of size $${fr(1, d)}$. Find $${w} \\div ${fr(1, d)}$.`,
              `模型表示 ${w} 个整体，都分成大小为 $${fr(1, d)}$ 的份。计算 $${w} \\div ${fr(1, d)}$。`,
            ),
            answer: w * d,
            form: "integer",
            wrong: [qf(w, d), w + d, d],
            solution: t(
              `Each whole has ${d} parts of size $${fr(1, d)}$, so ${w} whole${w === 1 ? " has" : "s have"} $${w} \\times ${d} = ${w * d}$.`,
              `每个整体有 ${d} 个 $${fr(1, d)}$，所以 ${w} 个整体有 $${w} \\times ${d} = ${w * d}$ 个。`,
            ),
          }),
          figure: groupedBarsFigure(w, d, 1),
        };
      },
    },
    {
      id: "choosing-the-division-for-a-model",
      title: t("Which division the model shows", "模型表示哪个除法"),
      explanation: t(
        "A bar with $\\frac{1}{2}$ shaded and the shaded part cut into $3$ equal rows shows $\\frac{1}{2} \\div 3 = \\frac{1}{6}$.",
        "一个长条涂色 $\\frac{1}{2}$，涂色部分又平均分成 $3$ 行，表示 $\\frac{1}{2} \\div 3 = \\frac{1}{6}$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const n = rng.int(2, 6);
        return pickChoice(
          rng,
          t("The darker piece is one share. Which division does the model show?", "颜色最深的一块是其中一份。模型表示哪个除法算式？"),
          mathText(`${fr(1, d)} \\div ${n} = ${fr(1, d * n)}`),
          [
            mathText(`${n} \\div ${fr(1, d)} = ${n * d}`),
            mathText(`${fr(1, d)} \\div ${n} = ${fr(n, d)}`),
            mathText(`${fr(1, n)} \\div ${d} = ${fr(1, d + n)}`),
          ],
          t(
            `$${fr(1, d)}$ of the bar is split into ${n} equal shares, and each is $${fr(1, d * n)}$ of the whole bar.`,
            `把长条的 $${fr(1, d)}$ 平均分成 ${n} 份，每份是整个长条的 $${fr(1, d * n)}$。`,
          ),
          splitPartsFigure(1, d, n),
        );
      },
    },
  ],
);

/** servingStory is a word problem asking how many servings of size 1/d are in w wholes. */
function servingStory(rng: Rng, w: number, sizeTex: string): Text {
  const name = rng.pick(names);
  return rng.pick([
    t(
      `${name} has ${w} cups of rice. Each serving is $${sizeTex}$ cup. How many servings are there?`,
      `${name} 有 ${w} 杯米，每份是 $${sizeTex}$ 杯。一共有多少份？`,
    ),
    t(
      `A ${w}-meter ribbon is cut into pieces $${sizeTex}$ meter long. How many pieces are there?`,
      `一根 ${w} 米长的丝带剪成每段 $${sizeTex}$ 米长。一共能剪多少段？`,
    ),
    t(
      `${name} has ${w} pounds of nuts and fills bags with $${sizeTex}$ pound each. How many bags can ${name} fill?`,
      `${name} 有 ${w} 磅坚果，每袋装 $${sizeTex}$ 磅。能装满多少袋？`,
    ),
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
    {
      id: "counting-unit-fractions-in-a-model",
      title: t("Counting parts in the model", "数模型中的份数"),
      explanation: t(
        "$3 \\div \\frac{1}{5}$: $3$ bars, each with $5$ fifths, hold $15$ fifths.",
        "$3 \\div \\frac{1}{5}$：$3$ 个长条，每个有 $5$ 个五分之一，共 $15$ 个五分之一。",
      ),
      generate(rng) {
        const w = rng.int(2, 5);
        const d = rng.int(2, 8);
        return {
          ...numberProblem({
            prompt: t(`Use the model to find $${w} \\div ${fr(1, d)}$.`, `利用模型计算 $${w} \\div ${fr(1, d)}$。`),
            answer: w * d,
            form: "integer",
            wrong: [qf(w, d), w + d, (w - 1) * d],
            solution: t(
              `There are ${d} parts in each of the ${w} bars: $${w} \\times ${d} = ${w * d}$.`,
              `${w} 个长条，每个有 ${d} 份：$${w} \\times ${d} = ${w * d}$。`,
            ),
          }),
          figure: groupedBarsFigure(w, d, 1),
        };
      },
    },
    {
      id: "unit-fraction-servings-with-models",
      title: t("Servings and pieces", "分份问题"),
      explanation: t(
        "$2$ cups of soup in $\\frac{1}{4}$-cup servings make $2 \\div \\frac{1}{4} = 8$ servings.",
        "$2$ 杯汤，每份 $\\frac{1}{4}$ 杯，可以分成 $2 \\div \\frac{1}{4} = 8$ 份。",
      ),
      generate(rng) {
        const w = rng.int(2, 5);
        const d = rng.int(2, 8);
        return {
          ...numberProblem({
            prompt: servingStory(rng, w, fr(1, d)),
            answer: w * d,
            form: "integer",
            wrong: [qf(w, d), w + d, d],
            solution: t(
              `Each whole holds ${d} parts of size $${fr(1, d)}$, so $${w} \\div ${fr(1, d)} = ${w * d}$.`,
              `每个整体有 ${d} 个 $${fr(1, d)}$，所以 $${w} \\div ${fr(1, d)} = ${w * d}$。`,
            ),
          }),
          figure: groupedBarsFigure(w, d, 1),
        };
      },
    },
  ],
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
    {
      id: "whole-number-divided-by-unit-fraction",
      title: t("Finding the quotient", "求商"),
      explanation: t("$9 \\div \\frac{1}{6} = 9 \\times 6 = 54$.", "$9 \\div \\frac{1}{6} = 9 \\times 6 = 54$。"),
      generate(rng) {
        const w = rng.int(2, 20);
        const d = rng.int(2, 12);
        return numberProblem({
          prompt: t(`Find $${w} \\div ${fr(1, d)}$.`, `计算 $${w} \\div ${fr(1, d)}$。`),
          answer: w * d,
          form: "integer",
          wrong: [qf(w, d), w + d, qf(d, w)],
          solution: t(
            `Each whole holds ${d} parts of size $${fr(1, d)}$: $${w} \\div ${fr(1, d)} = ${w} \\times ${d} = ${w * d}$.`,
            `每个整体有 ${d} 个 $${fr(1, d)}$：$${w} \\div ${fr(1, d)} = ${w} \\times ${d} = ${w * d}$。`,
          ),
        });
      },
    },
    {
      id: "unit-fraction-divisors-in-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "$6$ pounds of nuts in $\\frac{1}{3}$-pound bags fill $6 \\div \\frac{1}{3} = 18$ bags.",
        "$6$ 磅坚果，每袋装 $\\frac{1}{3}$ 磅，能装 $6 \\div \\frac{1}{3} = 18$ 袋。",
      ),
      generate(rng) {
        const w = rng.int(2, 15);
        const d = rng.int(2, 10);
        return numberProblem({
          prompt: servingStory(rng, w, fr(1, d)),
          answer: w * d,
          form: "integer",
          wrong: [qf(w, d), w + d, d],
          solution: t(
            `$${w} \\div ${fr(1, d)} = ${w} \\times ${d} = ${w * d}$.`,
            `$${w} \\div ${fr(1, d)} = ${w} \\times ${d} = ${w * d}$。`,
          ),
        });
      },
    },
  ],
);

/** shareStory is a word problem sharing a/d of something among n people. */
function shareStory(rng: Rng, fTex: string, n: number): Text {
  const name = rng.pick(names);
  return rng.pick([
    t(
      `${name} shares $${fTex}$ of a pan of brownies equally among ${n} friends. What fraction of the whole pan does each friend get?`,
      `${name} 把一盘布朗尼的 $${fTex}$ 平均分给 ${n} 个朋友。每个朋友分到整盘的几分之几？`,
    ),
    t(
      `$${fTex}$ of a garden is split into ${n} equal beds. What fraction of the whole garden is each bed?`,
      `把菜园的 $${fTex}$ 平均分成 ${n} 块苗床。每块苗床占整个菜园的几分之几？`,
    ),
    t(
      `${name} has $${fTex}$ pound of cheese and cuts it into ${n} equal pieces. How many pounds is each piece?`,
      `${name} 有 $${fTex}$ 磅奶酪，平均切成 ${n} 块。每块重多少磅？`,
    ),
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
    {
      id: "reading-a-share-from-the-model",
      title: t("Reading a share from the model", "从模型中读出每份"),
      explanation: t(
        "$\\frac{1}{4} \\div 3$: the whole bar is cut into $4 \\times 3 = 12$ pieces, so the darker piece is $\\frac{1}{12}$.",
        "$\\frac{1}{4} \\div 3$：整个长条被分成 $4 \\times 3 = 12$ 块，所以颜色最深的一块是 $\\frac{1}{12}$。",
      ),
      generate(rng) {
        const d = rng.int(2, 8);
        const n = rng.int(2, 6);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${fr(1, d)} \\div ${n}$. What fraction of the whole bar is the darker piece?`,
              `模型表示 $${fr(1, d)} \\div ${n}$。颜色最深的一块是整个长条的几分之几？`,
            ),
            answer: qf(1, d * n),
            form: "fraction",
            wrong: [qf(n, d), qf(1, d + n), qf(1, n)],
            solution: t(
              `The whole bar is cut into $${d} \\times ${n} = ${d * n}$ equal pieces, so one piece is $${fr(1, d * n)}$.`,
              `整个长条被分成 $${d} \\times ${n} = ${d * n}$ 块，所以一块是 $${fr(1, d * n)}$。`,
            ),
          }),
          figure: splitPartsFigure(1, d, n),
        };
      },
    },
    {
      id: "sharing-a-unit-fraction-with-models",
      title: t("Sharing a part", "平均分一部分"),
      explanation: t(
        "$\\frac{1}{2}$ of a pizza shared among $4$ people gives each $\\frac{1}{8}$ of the pizza.",
        "把 $\\frac{1}{2}$ 个比萨饼平均分给 $4$ 个人，每人分得 $\\frac{1}{8}$ 个。",
      ),
      generate(rng) {
        const d = rng.int(2, 6);
        const n = rng.int(2, 6);
        return {
          ...numberProblem({
            prompt: shareStory(rng, fr(1, d), n),
            answer: qf(1, d * n),
            form: "fraction",
            wrong: [qf(n, d), qf(1, d + n), qf(d, n)],
            solution: t(
              `$${fr(1, d)} \\div ${n} = ${fr(1, d * n)}$: cutting every part of the whole the same way gives ${d * n} pieces.`,
              `$${fr(1, d)} \\div ${n} = ${fr(1, d * n)}$：把整体的每一份都这样切，共得到 ${d * n} 块。`,
            ),
          }),
          figure: splitPartsFigure(1, d, n),
        };
      },
    },
  ],
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
    {
      id: "unit-fraction-divided-by-whole-number",
      title: t("Finding the quotient", "求商"),
      explanation: t("$\\frac{1}{8} \\div 4 = \\frac{1}{32}$.", "$\\frac{1}{8} \\div 4 = \\frac{1}{32}$。"),
      generate(rng) {
        const d = rng.int(2, 12);
        const n = rng.int(2, 9);
        return numberProblem({
          prompt: t(`Find $${fr(1, d)} \\div ${n}$.`, `计算 $${fr(1, d)} \\div ${n}$。`),
          answer: qf(1, d * n),
          form: "fraction",
          wrong: [qf(n, d), d * n, qf(1, d + n)],
          solution: t(
            `$${fr(1, d)} \\div ${n} = ${fr(1, `${d} \\times ${n}`)} = ${fr(1, d * n)}$.`,
            `$${fr(1, d)} \\div ${n} = ${fr(1, `${d} \\times ${n}`)} = ${fr(1, d * n)}$。`,
          ),
        });
      },
    },
    {
      id: "missing-numbers-in-unit-fraction-division",
      title: t("Finding a missing number", "求未知数"),
      explanation: t(
        "$\\frac{1}{6} \\div \\square = \\frac{1}{42}$: since $6 \\times 7 = 42$, the missing number is $7$.",
        "$\\frac{1}{6} \\div \\square = \\frac{1}{42}$：因为 $6 \\times 7 = 42$，所以方框中是 $7$。",
      ),
      generate(rng) {
        const d = rng.int(2, 12);
        const n = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `Find the missing number: $${fr(1, d)} \\div \\square = ${fr(1, d * n)}$.`,
            `求方框中的数：$${fr(1, d)} \\div \\square = ${fr(1, d * n)}$。`,
          ),
          answer: n,
          form: "integer",
          wrong: [d * n, d, qf(1, n)],
          solution: t(
            `$${fr(1, d)} \\div n = ${fr(1, `${d} n`)}$, and $${d} \\times ${n} = ${d * n}$, so the missing number is $${n}$.`,
            `$${fr(1, d)} \\div n = ${fr(1, `${d} n`)}$，而 $${d} \\times ${n} = ${d * n}$，所以方框中是 $${n}$。`,
          ),
        });
      },
    },
  ],
);

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
    {
      id: "reciprocals-of-fractions",
      title: t("Reciprocals of fractions", "分数的倒数"),
      explanation: t(
        "The reciprocal of $\\frac{4}{9}$ is $\\frac{9}{4}$, since $\\frac{4}{9} \\times \\frac{9}{4} = 1$.",
        "$\\frac{4}{9}$ 的倒数是 $\\frac{9}{4}$，因为 $\\frac{4}{9} \\times \\frac{9}{4} = 1$。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 15, 2);
        const flip = rng.bool();
        const [n, d] = flip ? [b, a] : [a, b];
        return numberProblem({
          prompt: t(`What is the reciprocal of $${fr(n, d)}$?`, `$${fr(n, d)}$ 的倒数是多少？`),
          answer: qf(d, n),
          form: "fraction",
          wrong: [qf(n, d), qf(d - n > 0 ? d - n : n - d, d), qf(1, n * d)],
          solution: t(
            `Swap the numerator and the denominator: $${fr(d, n)}$${n === 1 ? ` $= ${d}$` : ""}, since $${fr(n, d)} \\times ${fr(d, n)} = 1$.`,
            `交换分子和分母：$${fr(d, n)}$${n === 1 ? ` $= ${d}$` : ""}，因为 $${fr(n, d)} \\times ${fr(d, n)} = 1$。`,
          ),
        });
      },
    },
    {
      id: "reciprocals-of-whole-and-mixed-numbers",
      title: t("Reciprocals of whole numbers and mixed numbers", "整数和带分数的倒数"),
      explanation: t(
        "The reciprocal of $5$ is $\\frac{1}{5}$. For $1\\frac{2}{3} = \\frac{5}{3}$, the reciprocal is $\\frac{3}{5}$.",
        "$5$ 的倒数是 $\\frac{1}{5}$。$1\\frac{2}{3} = \\frac{5}{3}$，它的倒数是 $\\frac{3}{5}$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const n = rng.int(2, 25);
          return numberProblem({
            prompt: t(`What is the reciprocal of $${n}$?`, `$${n}$ 的倒数是多少？`),
            answer: qf(1, n),
            form: "fraction",
            wrong: [n, -n, qf(n - 1, n)],
            solution: t(
              `$${n} = ${fr(n, 1)}$, so its reciprocal is $${fr(1, n)}$.`,
              `$${n} = ${fr(n, 1)}$，所以它的倒数是 $${fr(1, n)}$。`,
            ),
          });
        }
        const w = rng.int(1, 5);
        const [a, d] = properFraction(rng, 9, 2);
        const n = w * d + a;
        return numberProblem({
          prompt: t(`What is the reciprocal of $${mx(w, a, d)}$?`, `$${mx(w, a, d)}$ 的倒数是多少？`),
          answer: qf(d, n),
          form: "fraction",
          wrong: [mixedValue(w, d, a), qf(d, a), qf(1, w).add(qf(d, a))],
          solution: t(
            `$${mx(w, a, d)} = ${fr(n, d)}$, so its reciprocal is $${fr(d, n)}$.`,
            `$${mx(w, a, d)} = ${fr(n, d)}$，所以它的倒数是 $${fr(d, n)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "counting-groups-in-a-model",
      title: t("Counting groups in the model", "数模型中的组数"),
      explanation: t(
        "$3 \\div \\frac{3}{4}$: $3$ bars hold $12$ fourths, which make $12 \\div 3 = 4$ groups of $\\frac{3}{4}$.",
        "$3 \\div \\frac{3}{4}$：$3$ 个长条共有 $12$ 个四分之一，每 $3$ 个一组，共 $12 \\div 3 = 4$ 组。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 12);
          const a = rng.int(2, d - 1);
          const w = rng.int(1, 6);
          if (gcd(a, d) !== 1 || (w * d) % a !== 0) continue;
          return {
            ...numberProblem({
              prompt: t(
                `Each group of colored parts is $${fr(a, d)}$. Use the model to find $${w} \\div ${fr(a, d)}$.`,
                `每组同色的部分是 $${fr(a, d)}$。利用模型计算 $${w} \\div ${fr(a, d)}$。`,
              ),
              answer: (w * d) / a,
              form: "integer",
              wrong: [w * d, qf(w * a, d), w * a],
              solution: t(
                `${w} whole${w === 1 ? " has" : "s have"} $${w * d}$ parts of size $${fr(1, d)}$, which make $${w * d} \\div ${a} = ${(w * d) / a}$ groups of $${fr(a, d)}$.`,
                `${w} 个整体共有 $${w * d}$ 个 $${fr(1, d)}$，每 ${a} 个一组，共 $${w * d} \\div ${a} = ${(w * d) / a}$ 组。`,
              ),
            }),
            figure: groupedBarsFigure(w, d, a),
          };
        }
      },
    },
    {
      id: "whole-number-groups-in-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "$6$ cups of flour in batches of $\\frac{3}{4}$ cup make $6 \\div \\frac{3}{4} = 24 \\div 3 = 8$ batches.",
        "$6$ 杯面粉，每份用 $\\frac{3}{4}$ 杯，可以做 $6 \\div \\frac{3}{4} = 24 \\div 3 = 8$ 份。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 10);
          const a = rng.int(2, d - 1);
          const w = rng.int(2, 12);
          if (gcd(a, d) !== 1 || (w * d) % a !== 0) continue;
          return numberProblem({
            prompt: servingStory(rng, w, fr(a, d)),
            answer: (w * d) / a,
            form: "integer",
            wrong: [w * d, qf(w * a, d), (w * d) / a + 1],
            solution: t(
              `$${w}$ is $${w * d}$ parts of size $${fr(1, d)}$, and every serving uses ${a} of them: $${w * d} \\div ${a} = ${(w * d) / a}$.`,
              `$${w}$ 是 $${w * d}$ 个 $${fr(1, d)}$，每份用 ${a} 个：$${w * d} \\div ${a} = ${(w * d) / a}$。`,
            ),
          });
        }
      },
    },
  ],
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
    {
      id: "partial-groups-in-a-model",
      title: t("Groups and a part of a group", "整组和不满一组的部分"),
      explanation: t(
        "$3 \\div \\frac{2}{5}$: $15$ fifths make $7$ groups of $2$ and $1$ fifth more, which is $\\frac{1}{2}$ of a group. So $3 \\div \\frac{2}{5} = 7\\frac{1}{2}$.",
        "$3 \\div \\frac{2}{5}$：$15$ 个五分之一分成 $7$ 组（每组 $2$ 个），还剩 $1$ 个，是一组的 $\\frac{1}{2}$。所以 $3 \\div \\frac{2}{5} = 7\\frac{1}{2}$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 8);
          const a = rng.int(2, d - 1);
          const w = rng.int(1, 4);
          if (gcd(a, d) !== 1 || (w * d) % a === 0) continue;
          const v = qf(w * d, a);
          return {
            ...numberProblem({
              prompt: t(
                `Each group of colored parts is $${fr(a, d)}$. Use the model to find $${w} \\div ${fr(a, d)}$.`,
                `每组同色的部分是 $${fr(a, d)}$。利用模型计算 $${w} \\div ${fr(a, d)}$。`,
              ),
              answer: v,
              form: "mixed",
              wrong: [Math.floor((w * d) / a), qf(Math.floor((w * d) / a) * d + ((w * d) % a), d), qf(w * a, d)],
              solution: t(
                `$${w * d}$ parts of size $${fr(1, d)}$ make ${Math.floor((w * d) / a)} full groups of ${a} with ${(w * d) % a} left over, which is $${fr((w * d) % a, a)}$ of a group. So $${w} \\div ${fr(a, d)} = ${mq(v)}$.`,
                `$${w * d}$ 个 $${fr(1, d)}$ 可以分成 ${Math.floor((w * d) / a)} 个整组（每组 ${a} 个），还剩 ${(w * d) % a} 个，是一组的 $${fr((w * d) % a, a)}$。所以 $${w} \\div ${fr(a, d)} = ${mq(v)}$。`,
              ),
            }),
            figure: groupedBarsFigure(w, d, a),
          };
        }
      },
    },
    {
      id: "partial-groups-in-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "$5$ yards of fabric in $\\frac{2}{3}$-yard pieces: $15$ thirds make $7\\frac{1}{2}$ pieces.",
        "$5$ 码布，每块 $\\frac{2}{3}$ 码：$15$ 个三分之一可以做 $7\\frac{1}{2}$ 块。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 9);
          const a = rng.int(2, d - 1);
          const w = rng.int(2, 9);
          if (gcd(a, d) !== 1 || (w * d) % a === 0) continue;
          const v = qf(w * d, a);
          return numberProblem({
            prompt: servingStory(rng, w, fr(a, d)),
            answer: v,
            form: "mixed",
            wrong: [Math.floor((w * d) / a), qf(w * a, d), Math.ceil((w * d) / a)],
            solution: t(
              `$${w} \\div ${fr(a, d)} = ${fr(w * d, a)} = ${mq(v)}$: ${Math.floor((w * d) / a)} full servings and part of another.`,
              `$${w} \\div ${fr(a, d)} = ${fr(w * d, a)} = ${mq(v)}$：${Math.floor((w * d) / a)} 个整份，还有不满一份的部分。`,
            ),
          });
        }
      },
    },
  ],
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
    {
      id: "rewriting-division-as-multiplication",
      title: t("Rewriting as multiplication", "化成乘法"),
      explanation: t("$8 \\div \\frac{3}{7} = 8 \\times \\frac{7}{3}$.", "$8 \\div \\frac{3}{7} = 8 \\times \\frac{7}{3}$。"),
      generate(rng) {
        const w = rng.int(2, 15);
        const [a, b] = properFraction(rng, 12, 3);
        if (a === 1) return this.generate(rng);
        return pickChoice(
          rng,
          t(`Which expression is equal to $${w} \\div ${fr(a, b)}$?`, `哪个算式等于 $${w} \\div ${fr(a, b)}$？`),
          mathText(`${w} \\times ${fr(b, a)}`),
          [mathText(`${w} \\times ${fr(a, b)}`), mathText(`${fr(1, w)} \\times ${fr(a, b)}`), mathText(`${fr(1, w)} \\times ${fr(b, a)}`)],
          t(
            `Dividing by $${fr(a, b)}$ is multiplying by its reciprocal $${fr(b, a)}$.`,
            `除以 $${fr(a, b)}$ 等于乘它的倒数 $${fr(b, a)}$。`,
          ),
        );
      },
    },
    {
      id: "whole-number-divided-by-fraction",
      title: t("Finding the quotient", "求商"),
      explanation: t(
        "$10 \\div \\frac{4}{3} = 10 \\times \\frac{3}{4} = \\frac{30}{4} = 7\\frac{1}{2}$.",
        "$10 \\div \\frac{4}{3} = 10 \\times \\frac{3}{4} = \\frac{30}{4} = 7\\frac{1}{2}$。",
      ),
      generate(rng) {
        const w = rng.int(2, 20);
        const b = rng.int(2, 12);
        const a = coprimeTo(rng, b, 2, 2 * b);
        const v = qf(w * b, a);
        return numberProblem({
          prompt: t(`Find $${w} \\div ${fr(a, b)}$.`, `计算 $${w} \\div ${fr(a, b)}$。`),
          answer: v,
          form: "mixed",
          wrong: [qf(w * a, b), qf(a, w * b), v.add(Q.one)],
          solution: t(
            `$${w} \\div ${fr(a, b)} = ${w} \\times ${fr(b, a)} = ${fr(w * b, a)} = ${mq(v)}$.`,
            `$${w} \\div ${fr(a, b)} = ${w} \\times ${fr(b, a)} = ${fr(w * b, a)} = ${mq(v)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "fraction-shares-from-models",
      title: t("Reading a share from the model", "从模型中读出每份"),
      explanation: t(
        "$\\frac{2}{3} \\div 4$: the bar is cut into $12$ pieces, and one share is the $2$ darker pieces: $\\frac{2}{12} = \\frac{1}{6}$.",
        "$\\frac{2}{3} \\div 4$：长条被分成 $12$ 块，一份是颜色最深的 $2$ 块：$\\frac{2}{12} = \\frac{1}{6}$。",
      ),
      generate(rng) {
        const [a, d] = properFraction(rng, 6, 3);
        const n = rng.int(2, 4);
        return {
          ...numberProblem({
            prompt: t(
              `The model shows $${fr(a, d)} \\div ${n}$. What fraction of the whole bar is the darker part?`,
              `模型表示 $${fr(a, d)} \\div ${n}$。颜色最深的部分是整个长条的几分之几？`,
            ),
            answer: qf(a, d * n),
            form: "fraction",
            wrong: [qf(a * n, d), qf(1, d * n), qf(a, d + n)],
            solution: t(
              `The bar is cut into $${d} \\times ${n} = ${d * n}$ pieces, and the darker part is ${a} of them: $${fr(a, d * n)}${gcd(a, d * n) > 1 ? ` = ${lowest(a, d * n)}` : ""}$.`,
              `长条被分成 $${d} \\times ${n} = ${d * n}$ 块，颜色最深的是其中 ${a} 块：$${fr(a, d * n)}${gcd(a, d * n) > 1 ? ` = ${lowest(a, d * n)}` : ""}$。`,
            ),
          }),
          figure: splitPartsFigure(a, d, n),
        };
      },
    },
    {
      id: "sharing-fractions-evenly",
      title: t("When the numerator divides evenly", "分子能被整除时"),
      explanation: t(
        "$\\frac{6}{7} \\div 3$: $6$ sevenths in $3$ equal shares is $2$ sevenths each, so the answer is $\\frac{2}{7}$.",
        "$\\frac{6}{7} \\div 3$：把 $6$ 个七分之一平均分成 $3$ 份，每份 $2$ 个七分之一，所以结果是 $\\frac{2}{7}$。",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(3, 12);
          const n = rng.int(2, Math.min(5, d - 1));
          const k = rng.int(1, Math.floor((d - 1) / n));
          if (k < 1 || gcd(k * n, d) !== 1) continue;
          const a = k * n;
          return {
            ...numberProblem({
              prompt: t(`Use the model to find $${fr(a, d)} \\div ${n}$.`, `利用模型计算 $${fr(a, d)} \\div ${n}$。`),
              answer: qf(k, d),
              form: "fraction",
              wrong: [qf(a * n, d), qf(k, d * n), qf(a, d * n + 1)],
              solution: t(
                `$${a}$ parts of size $${fr(1, d)}$ split into ${n} equal shares give ${k} part${k === 1 ? "" : "s"} each: $${fr(k, d)}$.`,
                `把 $${a}$ 个 $${fr(1, d)}$ 平均分成 ${n} 份，每份 ${k} 个：$${fr(k, d)}$。`,
              ),
            }),
            figure: barFigure(d, a),
          };
        }
      },
    },
  ],
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
    {
      id: "fraction-divided-by-whole-number",
      title: t("Finding the quotient", "求商"),
      explanation: t(
        "$\\frac{3}{4} \\div 5 = \\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}$.",
        "$\\frac{3}{4} \\div 5 = \\frac{3}{4} \\times \\frac{1}{5} = \\frac{3}{20}$。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 12, 2);
        const n = rng.int(2, 9);
        const v = qf(a, b * n);
        return numberProblem({
          prompt: t(`Find $${fr(a, b)} \\div ${n}$.`, `计算 $${fr(a, b)} \\div ${n}$。`),
          answer: v,
          form: "fraction",
          wrong: [qf(a * n, b), qf(b * n, a), qf(a, b + n)],
          solution: t(
            `$${fr(a, b)} \\div ${n} = ${fr(a, b)} \\times ${fr(1, n)} = ${fr(a, b * n)}${gcd(a, b * n) > 1 ? ` = ${v.toLatex()}` : ""}$.`,
            `$${fr(a, b)} \\div ${n} = ${fr(a, b)} \\times ${fr(1, n)} = ${fr(a, b * n)}${gcd(a, b * n) > 1 ? ` = ${v.toLatex()}` : ""}$。`,
          ),
        });
      },
    },
    {
      id: "mixed-number-divided-by-whole-number",
      title: t("Dividing a mixed number", "带分数除以整数"),
      explanation: t(
        "$2\\frac{1}{2} \\div 3 = \\frac{5}{2} \\times \\frac{1}{3} = \\frac{5}{6}$.",
        "$2\\frac{1}{2} \\div 3 = \\frac{5}{2} \\times \\frac{1}{3} = \\frac{5}{6}$。",
      ),
      generate(rng) {
        const w = rng.int(1, 5);
        const [a, b] = properFraction(rng, 8, 2);
        const n = rng.int(2, 9);
        const top = w * b + a;
        const v = qf(top, b * n);
        return numberProblem({
          prompt: t(`Find $${mx(w, a, b)} \\div ${n}$.`, `计算 $${mx(w, a, b)} \\div ${n}$。`),
          answer: v,
          form: "mixed",
          wrong: [qf(top * n, b), mixedValue(w, a, b * n), qf(w, n).add(qf(a, b))],
          solution: t(
            `$${mx(w, a, b)} \\div ${n} = ${fr(top, b)} \\times ${fr(1, n)} = ${fr(top, b * n)} = ${mq(v)}$.`,
            `$${mx(w, a, b)} \\div ${n} = ${fr(top, b)} \\times ${fr(1, n)} = ${fr(top, b * n)} = ${mq(v)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "sharing-a-fraction-in-word-problems",
      title: t("Sharing a fractional amount", "平均分一个分数量"),
      explanation: t(
        "$\\frac{2}{3}$ of a cake shared by $4$ people gives each $\\frac{2}{3} \\div 4 = \\frac{2}{12} = \\frac{1}{6}$ of the cake.",
        "把 $\\frac{2}{3}$ 个蛋糕平均分给 $4$ 个人，每人分得 $\\frac{2}{3} \\div 4 = \\frac{2}{12} = \\frac{1}{6}$ 个。",
      ),
      generate(rng) {
        const [a, d] = properFraction(rng, 10, 2);
        const n = rng.int(2, 8);
        const v = qf(a, d * n);
        return numberProblem({
          prompt: shareStory(rng, fr(a, d), n),
          answer: v,
          form: "fraction",
          wrong: [qf(a * n, d), qf(d * n, a), qf(a, d + n)],
          solution: t(
            `$${fr(a, d)} \\div ${n} = ${fr(a, d)} \\times ${fr(1, n)} = ${fr(a, d * n)}${gcd(a, d * n) > 1 ? ` = ${v.toLatex()}` : ""}$.`,
            `$${fr(a, d)} \\div ${n} = ${fr(a, d)} \\times ${fr(1, n)} = ${fr(a, d * n)}${gcd(a, d * n) > 1 ? ` = ${v.toLatex()}` : ""}$。`,
          ),
        });
      },
    },
    {
      id: "portions-of-a-whole-amount",
      title: t("Counting portions", "求份数"),
      explanation: t(
        "$9$ meters of rope in $\\frac{3}{4}$-meter pieces makes $9 \\div \\frac{3}{4} = 9 \\times \\frac{4}{3} = 12$ pieces.",
        "$9$ 米绳子，每段 $\\frac{3}{4}$ 米，可以剪成 $9 \\div \\frac{3}{4} = 9 \\times \\frac{4}{3} = 12$ 段。",
      ),
      generate(rng) {
        const w = rng.int(2, 15);
        const [a, d] = properFraction(rng, 10, 2);
        const v = qf(w * d, a);
        return numberProblem({
          prompt: servingStory(rng, w, fr(a, d)),
          answer: v,
          form: "mixed",
          wrong: [qf(w * a, d), qf(a, w * d), v.add(Q.one)],
          solution: t(
            `$${w} \\div ${fr(a, d)} = ${w} \\times ${fr(d, a)} = ${fr(w * d, a)} = ${mq(v)}$.`,
            `$${w} \\div ${fr(a, d)} = ${w} \\times ${fr(d, a)} = ${fr(w * d, a)} = ${mq(v)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "fraction-divided-by-unit-fraction-models",
      title: t("Dividing by a smaller unit fraction", "除以较小的单位分数"),
      explanation: t(
        "$\\frac{2}{3} \\div \\frac{1}{6}$: $\\frac{2}{3} = \\frac{4}{6}$, which holds $4$ sixths, so the quotient is $4$.",
        "$\\frac{2}{3} \\div \\frac{1}{6}$：$\\frac{2}{3} = \\frac{4}{6}$，里面有 $4$ 个六分之一，所以商是 $4$。",
      ),
      generate(rng) {
        const b = rng.int(2, 6);
        const k = rng.int(2, 4);
        const d = b * k;
        const a = coprimeTo(rng, b, 1, b - 1);
        return {
          ...numberProblem({
            prompt: t(
              `The bar shows $${fr(a, b)}$ shaded. Find $${fr(a, b)} \\div ${fr(1, d)}$.`,
              `长条中涂色部分是 $${fr(a, b)}$。计算 $${fr(a, b)} \\div ${fr(1, d)}$。`,
            ),
            answer: a * k,
            form: "integer",
            wrong: [qf(a, b * d), a * d, a + k],
            solution: t(
              `$${fr(a, b)} = ${fr(a * k, d)}$, which holds ${a * k} parts of size $${fr(1, d)}$.`,
              `$${fr(a, b)} = ${fr(a * k, d)}$，里面有 ${a * k} 个 $${fr(1, d)}$。`,
            ),
          }),
          figure: barFigure(d, a * k),
        };
      },
    },
    {
      id: "fraction-divided-by-fraction-models",
      title: t("Quotients that are fractions", "商是分数"),
      explanation: t(
        "$\\frac{1}{2} \\div \\frac{2}{3}$: in sixths, $\\frac{3}{6} \\div \\frac{4}{6}$ is $3$ of the $4$ parts of a group, so the quotient is $\\frac{3}{4}$.",
        "$\\frac{1}{2} \\div \\frac{2}{3}$：化成六分之几，$\\frac{3}{6} \\div \\frac{4}{6}$ 是一组 $4$ 份中的 $3$ 份，所以商是 $\\frac{3}{4}$。",
      ),
      generate(rng) {
        for (;;) {
          const p = unrelatedPair(rng);
          const L = lcm(p.b, p.d);
          const [x, y] = [(p.a * L) / p.b, (p.c * L) / p.d];
          if (x === y || L > 24) continue;
          const v = qf(x, y);
          return {
            ...numberProblem({
              prompt: t(
                `The bars show $${fr(p.a, p.b)}$ and $${fr(p.c, p.d)}$. Find $${fr(p.a, p.b)} \\div ${fr(p.c, p.d)}$.`,
                `两个长条分别表示 $${fr(p.a, p.b)}$ 和 $${fr(p.c, p.d)}$。计算 $${fr(p.a, p.b)} \\div ${fr(p.c, p.d)}$。`,
              ),
              answer: v,
              form: "mixed",
              wrong: [qf(y, x), qf(p.a * p.c, p.b * p.d), qf(x, L)],
              solution: t(
                `In parts of size $${fr(1, L)}$, $${fr(p.a, p.b)} = ${fr(x, L)}$ and $${fr(p.c, p.d)} = ${fr(y, L)}$, so the quotient is $${x} \\div ${y} = ${fr(x, y)}${gcd(x, y) > 1 || x > y ? ` = ${mq(v)}` : ""}$.`,
                `化成 $${fr(1, L)}$ 为单位：$${fr(p.a, p.b)} = ${fr(x, L)}$，$${fr(p.c, p.d)} = ${fr(y, L)}$，所以商是 $${x} \\div ${y} = ${fr(x, y)}${gcd(x, y) > 1 || x > y ? ` = ${mq(v)}` : ""}$。`,
              ),
            }),
            figure: twoBarsFigure(p.b, p.a, p.d, p.c),
          };
        }
      },
    },
  ],
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
