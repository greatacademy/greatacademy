import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q, sketch, svgDocument } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem, pointLatex, pointProblem } from "../problems.ts";
import { compareProblem, fr, mathText, pickChoice, properFraction } from "./grade-4-fractions.ts";

// 6th Grade Math: dividing fractions and mixed numbers, estimating decimal quotients, rational numbers, and the four-quadrant coordinate plane.

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

const qf = (n: number, d: number) => Q.of(n, d);

/** mq writes a number as a whole or mixed number. */
const mq = (q: Q) => mixedLatex(q);

/** improper writes a positive rational number as a fraction n/d even when it is greater than 1. */
const improper = (q: Q) => (q.isInteger() ? q.toString() : fr(q.n.toString(), q.d.toString()));

/** form is the answer form that fits a positive quotient: whole, proper fraction or mixed number. */
const form = (q: Q): "integer" | "fraction" | "mixed" => (q.isInteger() ? "integer" : q.cmp(Q.one) < 0 ? "fraction" : "mixed");

/** mixedNumber draws a mixed number w r/d with 1 ≤ w ≤ maxWhole and r/d in lowest terms. */
function mixedNumber(rng: Rng, maxWhole = 5, maxDen = 8): Q {
  const [r, d] = properFraction(rng, maxDen, 2);
  return qf(rng.int(1, maxWhole) * d + r, d);
}

/** sloppyImproper is the common mistake of writing w r/d as (w + r)/d instead of (w·d + r)/d. */
function sloppyImproper(q: Q): Q {
  if (q.isInteger() || q.cmp(Q.one) < 0) return q;
  const w = q.n / q.d;
  return Q.of(w + (q.n % q.d), q.d);
}

/** divisionSteps writes a ÷ b = a × 1/b = result, with both operands as improper fractions. */
function divisionSteps(a: Q, b: Q): string {
  const v = a.div(b);
  const recip = Q.one.div(b);
  const product = `${improper(a)} \\times ${improper(recip)}`;
  const raw = fr((a.n * recip.n).toString(), (a.d * recip.d).toString());
  const simplified = a.n * recip.n === v.n && a.d * recip.d === v.d;
  return `${mq(a)} \\div ${mq(b)} = ${improper(a)} \\div ${improper(b)} = ${product} = ${raw}${simplified && v.isInteger() === false && v.cmp(Q.one) < 0 ? "" : ` = ${mq(v)}`}`;
}

/** divisionProblem asks for a quotient of two positive rational numbers written as given. */
function divisionProblem(a: Q, b: Q, intro: Text): Problem {
  const v = a.div(b);
  const steps = divisionSteps(a, b);
  return numberProblem({
    prompt: t(`${intro.en} $$${mq(a)} \\div ${mq(b)}$$`, `${intro["zh-CN"]}$$${mq(a)} \\div ${mq(b)}$$`),
    answer: v,
    form: form(v),
    wrong: [a.mul(b), b.div(a), sloppyImproper(a).div(sloppyImproper(b))],
    solution: t(
      `Write the mixed numbers as improper fractions and multiply by the reciprocal of the divisor: $${steps}$.`,
      `把带分数化成假分数，再乘除数的倒数：$${steps}$。`,
    ),
  });
}

const divideIntro = t("Divide. Write the answer in simplest form.", "计算，结果写成最简形式。");

// ---------------------------------------------------------------------------
// Dividing fractions

/** Portion is a story where a total is split into portions of a given size. */
interface Portion {
  readonly total: (x: string) => Text;
  readonly each: (x: string) => Text;
  readonly ask: Text;
}

const portionStories: readonly Portion[] = [
  {
    total: (x) => t(`A baker has $${x}$ cup of flour.`, `面包师有 $${x}$ 杯面粉。`),
    each: (x) => t(`Each batch of rolls uses $${x}$ cup of flour.`, `每炉面包卷用 $${x}$ 杯面粉。`),
    ask: t("How many batches can the baker make?", "面包师可以做多少炉？"),
  },
  {
    total: (x) => t(`A ribbon is $${x}$ yard long.`, `一条丝带长 $${x}$ 码。`),
    each: (x) => t(`It is cut into pieces $${x}$ yard long.`, `把它剪成每段 $${x}$ 码。`),
    ask: t("How many pieces are there?", "可以剪成多少段？"),
  },
  {
    total: (x) => t(`A jug holds $${x}$ liter of juice.`, `一个壶里有 $${x}$ 升果汁。`),
    each: (x) => t(`Each glass holds $${x}$ liter.`, `每个杯子装 $${x}$ 升。`),
    ask: t("How many glasses can be filled?", "可以装满多少杯？"),
  },
];

export const dividingFractionsWordProblems = topic(
  "dividing-fractions-word-problems",
  t("Dividing Fractions: Word Problems", "分数除法应用题"),
  t(
    "Division answers “how many groups?” and “how much in one group?”. How many 3/8-cup servings are in 3/4 cup? 3/4 ÷ 3/8 = 2. If 3/4 of a mile takes 1/2 hour, the speed is 3/4 ÷ 1/2 = 1 1/2 miles per hour.",
    "除法回答“有几份”和“每份是多少”。3/4 杯里有几个 3/8 杯？3/4 ÷ 3/8 = 2。如果走 3/4 英里用 1/2 小时，速度是 3/4 ÷ 1/2 = 1 1/2 英里/小时。",
  ),
  ["dividing-fractions"],
  ["6.NS.A.1"],
  [
    {
      id: "how-many-portions-of-a-fraction",
      title: t("How many portions?", "有几份？"),
      explanation: t(
        '"How many portions" means divide the total by the size of one portion. To divide by a fraction, multiply by its reciprocal.\n\n$\\frac{3}{4}$ cup in $\\frac{3}{8}$-cup servings: $\\frac{3}{4} \\div \\frac{3}{8} = \\frac{3}{4} \\times \\frac{8}{3} = 2$ servings.',
        '"能分成几份"就是用总量除以每份的量。除以一个分数，等于乘它的倒数。\n\n$\\frac{3}{4}$ 杯，每份 $\\frac{3}{8}$ 杯：$\\frac{3}{4} \\div \\frac{3}{8} = \\frac{3}{4} \\times \\frac{8}{3} = 2$ 份。',
      ),
      generate(rng) {
        const s = rng.pick(portionStories);
        const [p, q] = properFraction(rng, 12, 3);
        let k = rng.int(2, 6);
        while (p * k >= q * 2 && k > 2) k--;
        const each = qf(p, q);
        const total = each.mul(Q.of(k));
        if (total.cmp(Q.one) >= 0) return this.generate(rng);
        return numberProblem({
          prompt: t(
            `${s.total(total.toLatex()).en} ${s.each(each.toLatex()).en} ${s.ask.en}`,
            `${s.total(total.toLatex())["zh-CN"]}${s.each(each.toLatex())["zh-CN"]}${s.ask["zh-CN"]}`,
          ),
          answer: k,
          form: "integer",
          wrong: [total.mul(each), each.div(total), Q.of(k + 1)],
          solution: t(
            `$${total.toLatex()} \\div ${each.toLatex()} = ${total.toLatex()} \\times ${improper(Q.of(q, p))} = ${k}$.`,
            `$${total.toLatex()} \\div ${each.toLatex()} = ${total.toLatex()} \\times ${improper(Q.of(q, p))} = ${k}$。`,
          ),
        });
      },
    },
    {
      id: "how-much-in-one-unit",
      title: t("How much for one unit?", "每个单位是多少？"),
      explanation: t(
        '"How much for one unit" is a unit rate: divide the amount by the number of units, even when that number is a fraction. Dividing by a fraction less than $1$ gives a larger number.\n\n$\\frac{3}{4}$ mile in $\\frac{1}{2}$ hour: $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = 1\\frac{1}{2}$ miles per hour.',
        '"每一个单位是多少"是求单位量：用总量除以单位数，即使单位数是分数也一样。除以小于 $1$ 的分数，结果会变大。\n\n$\\frac{1}{2}$ 小时走 $\\frac{3}{4}$ 英里：$\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = 1\\frac{1}{2}$ 英里/小时。',
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 10, 2);
        const [c, d] = properFraction(rng, 6, 2);
        const dist = qf(a, b);
        const time = qf(c, d);
        const v = dist.div(time);
        const kind = rng.pick([
          {
            en: `Maya walks $${dist.toLatex()}$ mile in $${time.toLatex()}$ hour. At this rate, how many miles does she walk in one hour?`,
            zh: `Maya $${time.toLatex()}$ 小时走 $${dist.toLatex()}$ 英里。照这样的速度，她 1 小时走多少英里？`,
          },
          {
            en: `A painter uses $${dist.toLatex()}$ gallon of paint to cover $${time.toLatex()}$ of a wall. How many gallons does the whole wall need?`,
            zh: `油漆工用 $${dist.toLatex()}$ 加仑油漆刷了一面墙的 $${time.toLatex()}$。刷整面墙需要多少加仑？`,
          },
        ]);
        return numberProblem({
          prompt: t(kind.en, kind.zh),
          answer: v,
          form: form(v),
          wrong: [dist.mul(time), time.div(dist)],
          solution: t(
            `Divide the amount by the part it covers: $${dist.toLatex()} \\div ${time.toLatex()} = ${dist.toLatex()} \\times ${improper(Q.one.div(time))} = ${mq(v)}$.`,
            `用数量除以它对应的部分：$${dist.toLatex()} \\div ${time.toLatex()} = ${dist.toLatex()} \\times ${improper(Q.one.div(time))} = ${mq(v)}$。`,
          ),
        });
      },
    },
  ],
);

/** rectangleFigure draws a rectangle with its width labeled and its height marked unknown. */
function rectangleFigure(width: string, area: string): Figure {
  const w = 6;
  const h = 3.5;
  return {
    svg: sketch([
      {
        kind: "polygon",
        points: [
          [0, 0],
          [w, 0],
          [w, h],
          [0, h],
        ],
        accent: true,
      },
      { kind: "side", a: [w, h], b: [0, h], text: width },
      { kind: "side", a: [0, h], b: [0, 0], text: "?" },
      { kind: "label", at: [w / 2, h / 2], text: area, dir: "n" },
    ]),
    alt: t(
      `A rectangle with one side ${width} long, an unknown side, and area ${area}.`,
      `一个长方形，一边长 ${width}，另一边未知，面积为 ${area}。`,
    ),
  };
}

export const findingSideLengthsUsingFractionDivision = topic(
  "finding-side-lengths-using-fraction-division",
  t("Finding Side Lengths Using Fraction Division", "用分数除法求边长"),
  t(
    "The area of a rectangle is length × width, so a missing side is the area divided by the known side. A rectangle with area 3/4 square foot and width 1/2 foot has length 3/4 ÷ 1/2 = 1 1/2 feet.",
    "长方形的面积 = 长 × 宽，所以未知边长 = 面积 ÷ 已知边长。面积为 3/4 平方英尺、宽为 1/2 英尺的长方形，长是 3/4 ÷ 1/2 = 1 1/2 英尺。",
  ),
  ["dividing-fractions", "finding-areas-using-fraction-multiplication"],
  ["6.NS.A.1"],
  [
    {
      id: "side-from-a-fractional-area",
      title: t("Fractional area and side", "面积和边长都是分数"),
      explanation: t(
        "The area of a rectangle is length times width, so a missing side is the area divided by the known side. Divide by multiplying by the reciprocal.\n\nArea $\\frac{3}{4}$ square foot, width $\\frac{1}{2}$ foot: length $= \\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = \\frac{3}{2} = 1\\frac{1}{2}$ feet.",
        "长方形的面积等于长乘宽，所以未知的边长等于面积除以已知的边长。除以分数就乘它的倒数。\n\n面积 $\\frac{3}{4}$ 平方英尺，宽 $\\frac{1}{2}$ 英尺：长 $= \\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = \\frac{3}{2} = 1\\frac{1}{2}$ 英尺。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 8, 2);
        const [c, d] = properFraction(rng, 8, 2);
        const width = qf(a, b);
        const side = qf(c, d);
        const area = width.mul(side);
        return {
          ...numberProblem({
            prompt: t(
              `A rectangle has an area of $${area.toLatex()}$ square foot and a width of $${width.toLatex()}$ foot. What is its length, in feet?`,
              `一个长方形的面积是 $${area.toLatex()}$ 平方英尺，宽是 $${width.toLatex()}$ 英尺。它的长是多少英尺？`,
            ),
            answer: side,
            form: form(side),
            wrong: [area.mul(width), width.div(area), area.sub(width).abs()],
            solution: t(
              `Length $=$ area $\\div$ width $= ${area.toLatex()} \\div ${width.toLatex()} = ${area.toLatex()} \\times ${improper(Q.one.div(width))} = ${side.toLatex()}$ foot.`,
              `长 $=$ 面积 $\\div$ 宽 $= ${area.toLatex()} \\div ${width.toLatex()} = ${area.toLatex()} \\times ${improper(Q.one.div(width))} = ${side.toLatex()}$ 英尺。`,
            ),
          }),
          figure: rectangleFigure(`${a}/${b} ft`, `${area.n}/${area.d} ft²`),
        };
      },
    },
    {
      id: "side-from-a-whole-area",
      title: t("Whole-number area", "面积是整数"),
      explanation: t(
        "Divide the area by the known side, multiplying by its reciprocal. When the known side is less than $1$, the other side is longer than the area's number.\n\nArea $6$ square feet, width $\\frac{3}{4}$ foot: length $= 6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ feet.",
        "用面积除以已知的边长，即乘它的倒数。已知边长小于 $1$ 时，求出的边长比面积的数值还大。\n\n面积 $6$ 平方英尺，宽 $\\frac{3}{4}$ 英尺：长 $= 6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ 英尺。",
      ),
      generate(rng) {
        const [a, b] = properFraction(rng, 8, 2);
        const width = qf(a, b);
        const length = rng.int(2, 12) * a;
        const area = width.mul(Q.of(length));
        if (!area.isInteger()) return this.generate(rng);
        return {
          ...numberProblem({
            prompt: t(
              `A rectangular garden has an area of $${area.toString()}$ square meters and a width of $${width.toLatex()}$ meter. What is its length, in meters?`,
              `一块长方形花园的面积是 $${area.toString()}$ 平方米，宽是 $${width.toLatex()}$ 米。它的长是多少米？`,
            ),
            answer: length,
            form: "integer",
            wrong: [area.mul(width), width.div(area), area.sub(width)],
            solution: t(
              `Length $=$ area $\\div$ width $= ${area.toString()} \\div ${width.toLatex()} = ${area.toString()} \\times ${fr(b, a)} = ${length}$ meters.`,
              `长 $=$ 面积 $\\div$ 宽 $= ${area.toString()} \\div ${width.toLatex()} = ${area.toString()} \\times ${fr(b, a)} = ${length}$ 米。`,
            ),
          }),
          figure: rectangleFigure(`${a}/${b} m`, `${area.toString()} m²`),
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Dividing mixed numbers

export const dividingMixedNumbersByWholeNumbers = topic(
  "dividing-mixed-numbers-by-whole-numbers",
  t("Dividing Mixed Numbers by Whole Numbers", "带分数除以整数"),
  t(
    "Write the mixed number as an improper fraction, then multiply by the reciprocal of the whole number: 2 1/4 ÷ 3 = 9/4 × 1/3 = 3/4.",
    "先把带分数化成假分数，再乘整数的倒数：2 1/4 ÷ 3 = 9/4 × 1/3 = 3/4。",
  ),
  ["dividing-fractions-by-whole-numbers"],
  ["6.NS.A.1"],
  [
    {
      id: "mixed-by-whole-fraction-result",
      title: t("Results less than 1", "结果小于 1"),
      explanation: t(
        "Write the mixed number as an improper fraction, then multiply by the reciprocal of the whole number, which is $1$ over it. Simplify the result.\n\n$2\\frac{1}{4} \\div 3 = \\frac{9}{4} \\times \\frac{1}{3} = \\frac{9}{12} = \\frac{3}{4}$.",
        "先把带分数化成假分数，再乘整数的倒数，即 $1$ 分之这个整数，最后约分。\n\n$2\\frac{1}{4} \\div 3 = \\frac{9}{4} \\times \\frac{1}{3} = \\frac{9}{12} = \\frac{3}{4}$。",
      ),
      generate(rng) {
        const a = mixedNumber(rng, 3, 6);
        const n = rng.int(Math.floor(a.toNumber()) + 1, 9);
        return divisionProblem(a, Q.of(n), divideIntro);
      },
    },
    {
      id: "mixed-by-whole-mixed-result",
      title: t("Results greater than 1", "结果大于 1"),
      explanation: t(
        "Change the mixed number to an improper fraction, multiply by the reciprocal of the whole number, and write an improper result as a mixed number.\n\n$7\\frac{1}{2} \\div 2 = \\frac{15}{2} \\times \\frac{1}{2} = \\frac{15}{4} = 3\\frac{3}{4}$. Dividing only the whole part, $7 \\div 2$, and keeping $\\frac{1}{2}$ is a common mistake.",
        "把带分数化成假分数，乘整数的倒数，结果是假分数时化成带分数。\n\n$7\\frac{1}{2} \\div 2 = \\frac{15}{2} \\times \\frac{1}{2} = \\frac{15}{4} = 3\\frac{3}{4}$。只用整数部分除以 $2$ 而保留 $\\frac{1}{2}$ 是常见的错误。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const a = qf(rng.int(n + 1, 9) * 4 + rng.pick([1, 3]), 4);
        if (a.div(Q.of(n)).isInteger()) return this.generate(rng);
        return divisionProblem(rng.bool() ? a : mixedNumber(rng, 9, 6).add(Q.of(n)), Q.of(n), divideIntro);
      },
    },
  ],
);

export const dividingMixedNumbersByFractions = topic(
  "dividing-mixed-numbers-by-fractions",
  t("Dividing Mixed Numbers by Fractions", "带分数除以分数"),
  t(
    "Write the mixed number as an improper fraction and multiply by the reciprocal of the fraction: 2 1/4 ÷ 3/4 = 9/4 × 4/3 = 3.",
    "把带分数化成假分数，再乘分数的倒数：2 1/4 ÷ 3/4 = 9/4 × 4/3 = 3。",
  ),
  ["dividing-fractions", "converting-mixed-numbers-to-improper-fractions"],
  ["6.NS.A.1"],
  [
    {
      id: "mixed-by-fraction-whole-result",
      title: t("Whole-number results", "结果是整数"),
      explanation: t(
        "Write the mixed number as an improper fraction, then multiply by the reciprocal of the fraction. The answer counts how many of the fraction fit into the mixed number.\n\n$2\\frac{1}{4} \\div \\frac{3}{4} = \\frac{9}{4} \\times \\frac{4}{3} = 3$: there are $3$ three-quarters in $2\\frac{1}{4}$.",
        "先把带分数化成假分数，再乘除数的倒数。结果表示带分数里有几个这样的分数。\n\n$2\\frac{1}{4} \\div \\frac{3}{4} = \\frac{9}{4} \\times \\frac{4}{3} = 3$：$2\\frac{1}{4}$ 里有 $3$ 个 $\\frac{3}{4}$。",
      ),
      generate(rng) {
        const [p, q] = properFraction(rng, 8, 2);
        const k = rng.int(2, 9);
        const a = qf(p * k, q);
        if (a.isInteger() || a.cmp(Q.one) < 0) return this.generate(rng);
        return divisionProblem(a, qf(p, q), divideIntro);
      },
    },
    {
      id: "mixed-by-fraction-any-result",
      title: t("Any result", "一般情况"),
      explanation: t(
        "Change the mixed number to an improper fraction, multiply by the reciprocal of the divisor, then simplify and write the answer as a mixed number.\n\n$3\\frac{1}{3} \\div \\frac{4}{5} = \\frac{10}{3} \\times \\frac{5}{4} = \\frac{50}{12} = 4\\frac{2}{12} = 4\\frac{1}{6}$.",
        "把带分数化成假分数，乘除数的倒数，再约分并写成带分数。\n\n$3\\frac{1}{3} \\div \\frac{4}{5} = \\frac{10}{3} \\times \\frac{5}{4} = \\frac{50}{12} = 4\\frac{2}{12} = 4\\frac{1}{6}$。",
      ),
      generate(rng) {
        const a = mixedNumber(rng, 5, 8);
        const [p, q] = properFraction(rng, 9, 2);
        return divisionProblem(a, qf(p, q), divideIntro);
      },
    },
  ],
);

export const dividingWholeNumbersByMixedNumbers = topic(
  "dividing-whole-numbers-by-mixed-numbers",
  t("Dividing Whole Numbers by Mixed Numbers", "整数除以带分数"),
  t(
    "Write the mixed number as an improper fraction and multiply the whole number by its reciprocal: 10 ÷ 2 1/2 = 10 × 2/5 = 4.",
    "把带分数化成假分数，用整数乘它的倒数：10 ÷ 2 1/2 = 10 × 2/5 = 4。",
  ),
  ["dividing-whole-numbers-by-fractions"],
  ["6.NS.A.1"],
  [
    {
      id: "whole-by-mixed-whole-result",
      title: t("Whole-number results", "结果是整数"),
      explanation: t(
        "To divide by a mixed number, first write it as an improper fraction. Then multiply by its reciprocal.\n\n$10 \\div 2\\frac{1}{2} = 10 \\div \\frac{5}{2} = 10 \\times \\frac{2}{5} = 4$. Flipping the mixed number without changing it to an improper fraction first gives a wrong reciprocal.",
        "除以带分数时，先把带分数化成假分数，再乘它的倒数。\n\n$10 \\div 2\\frac{1}{2} = 10 \\div \\frac{5}{2} = 10 \\times \\frac{2}{5} = 4$。不先化成假分数就直接颠倒，得到的倒数是错的。",
      ),
      generate(rng) {
        const b = mixedNumber(rng, 3, 5);
        const k = rng.int(2, 8);
        const a = b.mul(Q.of(k));
        if (!a.isInteger()) {
          const m = b.mul(Q.of(k * Number(b.d)));
          return divisionProblem(m, b, divideIntro);
        }
        return divisionProblem(a, b, divideIntro);
      },
    },
    {
      id: "whole-by-mixed-any-result",
      title: t("Any result", "一般情况"),
      explanation: t(
        "Write the mixed number as an improper fraction, multiply by its reciprocal, and change an improper answer to a mixed number.\n\n$7 \\div 1\\frac{3}{4} = 7 \\times \\frac{4}{7} = 4$, and $5 \\div 1\\frac{1}{3} = 5 \\times \\frac{3}{4} = \\frac{15}{4} = 3\\frac{3}{4}$.",
        "把带分数化成假分数，乘它的倒数，结果是假分数时化成带分数。\n\n$7 \\div 1\\frac{3}{4} = 7 \\times \\frac{4}{7} = 4$；$5 \\div 1\\frac{1}{3} = 5 \\times \\frac{3}{4} = \\frac{15}{4} = 3\\frac{3}{4}$。",
      ),
      generate(rng) {
        const b = mixedNumber(rng, 3, 8);
        const a = Q.of(rng.int(2, 15));
        return divisionProblem(a, b, divideIntro);
      },
    },
  ],
);

export const dividingFractionsByMixedNumbers = topic(
  "dividing-fractions-by-mixed-numbers",
  t("Dividing Fractions by Mixed Numbers", "分数除以带分数"),
  t(
    "Write the mixed number as an improper fraction and multiply by its reciprocal. Dividing by a number greater than 1 gives a smaller result: 3/4 ÷ 1 1/2 = 3/4 × 2/3 = 1/2.",
    "把带分数化成假分数，再乘它的倒数。除以一个大于 1 的数，结果变小：3/4 ÷ 1 1/2 = 3/4 × 2/3 = 1/2。",
  ),
  ["dividing-fractions", "converting-mixed-numbers-to-improper-fractions"],
  ["6.NS.A.1"],
  [
    {
      id: "fraction-by-mixed",
      title: t("Dividing a fraction by a mixed number", "分数除以带分数"),
      explanation: t(
        "Change the mixed-number divisor to an improper fraction, then multiply by its reciprocal and simplify. Since the divisor is greater than $1$, the answer is smaller than the fraction you started with.\n\n$\\frac{3}{4} \\div 1\\frac{1}{2} = \\frac{3}{4} \\div \\frac{3}{2} = \\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}$.",
        "先把作除数的带分数化成假分数，再乘它的倒数并约分。因为除数大于 $1$，结果比原来的分数小。\n\n$\\frac{3}{4} \\div 1\\frac{1}{2} = \\frac{3}{4} \\div \\frac{3}{2} = \\frac{3}{4} \\times \\frac{2}{3} = \\frac{6}{12} = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const [p, q] = properFraction(rng, 10, 2);
        return divisionProblem(qf(p, q), mixedNumber(rng, 4, 6), divideIntro);
      },
    },
    {
      id: "estimating-the-size-of-the-quotient",
      title: t("Is the quotient less than the dividend?", "商比被除数小吗？"),
      explanation: t(
        "Dividing by a number greater than $1$ makes the result smaller, so $\\frac{5}{6} \\div 2\\frac{1}{3} < \\frac{5}{6}$. Dividing by a number less than $1$ makes it larger: $\\frac{5}{6} \\div \\frac{1}{3} > \\frac{5}{6}$.",
        "除以大于 $1$ 的数，结果变小，所以 $\\frac{5}{6} \\div 2\\frac{1}{3} < \\frac{5}{6}$。除以小于 $1$ 的数，结果变大：$\\frac{5}{6} \\div \\frac{1}{3} > \\frac{5}{6}$。",
      ),
      generate(rng) {
        const [p, q] = properFraction(rng, 10, 2);
        const a = qf(p, q);
        const bigger = rng.bool();
        const divisor = bigger ? mixedNumber(rng, 3, 6) : (([r, s]) => qf(r, s))(properFraction(rng, 9, 2));
        const v = a.div(divisor);
        const rel = v.cmp(a) + 1;
        const sym = ["<", "=", ">"][rel]!;
        return compareProblem(
          `${a.toLatex()} \\div ${mq(divisor)}`,
          a.toLatex(),
          rel,
          t(
            `The divisor $${mq(divisor)}$ is ${bigger ? "greater" : "less"} than $1$, so the quotient is ${bigger ? "less" : "greater"} than $${a.toLatex()}$: indeed $${a.toLatex()} \\div ${mq(divisor)} = ${mq(v)} ${sym} ${a.toLatex()}$.`,
            `除数 $${mq(divisor)}$ ${bigger ? "大" : "小"}于 $1$，所以商${bigger ? "小" : "大"}于 $${a.toLatex()}$：$${a.toLatex()} \\div ${mq(divisor)} = ${mq(v)} ${sym} ${a.toLatex()}$。`,
          ),
        );
      },
    },
  ],
);

export const dividingMixedNumbers = topic(
  "dividing-mixed-numbers",
  t("Dividing Mixed Numbers", "带分数除以带分数"),
  t(
    "Write both mixed numbers as improper fractions, then multiply the first by the reciprocal of the second: 3 3/4 ÷ 1 1/4 = 15/4 × 4/5 = 3.",
    "把两个带分数都化成假分数，再用第一个乘第二个的倒数：3 3/4 ÷ 1 1/4 = 15/4 × 4/5 = 3。",
  ),
  ["dividing-mixed-numbers-by-fractions"],
  ["6.NS.A.1"],
  [
    {
      id: "mixed-by-mixed-whole-result",
      title: t("Whole-number results", "结果是整数"),
      explanation: t(
        "To divide two mixed numbers, write both as improper fractions, then multiply the first by the reciprocal of the second.\n\n$3\\frac{3}{4} \\div 1\\frac{1}{4} = \\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$.",
        "两个带分数相除，先都化成假分数，再用第一个数乘第二个数的倒数。\n\n$3\\frac{3}{4} \\div 1\\frac{1}{4} = \\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$。",
      ),
      generate(rng) {
        const b = mixedNumber(rng, 2, 6);
        const k = rng.int(2, 6);
        const a = b.mul(Q.of(k));
        if (a.isInteger()) return this.generate(rng);
        return divisionProblem(a, b, divideIntro);
      },
    },
    {
      id: "mixed-by-mixed-any-result",
      title: t("Any result", "一般情况"),
      explanation: t(
        "Write both as improper fractions, multiply by the reciprocal of the divisor, and write the result as a mixed number in simplest form. Do not divide the whole parts and the fraction parts separately.\n\n$2\\frac{1}{2} \\div 1\\frac{1}{3} = \\frac{5}{2} \\times \\frac{3}{4} = \\frac{15}{8} = 1\\frac{7}{8}$.",
        "两个都化成假分数，乘除数的倒数，结果写成最简带分数。不能把整数部分和分数部分分别相除。\n\n$2\\frac{1}{2} \\div 1\\frac{1}{3} = \\frac{5}{2} \\times \\frac{3}{4} = \\frac{15}{8} = 1\\frac{7}{8}$。",
      ),
      generate(rng) {
        const a = mixedNumber(rng, 6, 6);
        const b = mixedNumber(rng, 3, 6);
        if (a.eq(b)) return this.generate(rng);
        return divisionProblem(a, b, divideIntro);
      },
    },
  ],
);

export const dividingMixedNumbersWordProblems = topic(
  "dividing-mixed-numbers-word-problems",
  t("Dividing Mixed Numbers: Word Problems", "带分数除法应用题"),
  t(
    "Mixed-number division answers the same questions as any division: how many 1 1/2-cup servings are in 7 1/2 cups (7 1/2 ÷ 1 1/2 = 5), or how far someone walks in one hour if 3 3/4 miles take 1 1/4 hours (3 3/4 ÷ 1 1/4 = 3 miles per hour).",
    "带分数除法解决的问题和一般除法一样：7 1/2 杯里有几份 1 1/2 杯（7 1/2 ÷ 1 1/2 = 5），或者 1 1/4 小时走了 3 3/4 英里，每小时走多远（3 3/4 ÷ 1 1/4 = 3 英里/小时）。",
  ),
  ["dividing-mixed-numbers", "dividing-fractions-word-problems"],
  ["6.NS.A.1"],
  [
    {
      id: "servings-of-a-mixed-size",
      title: t("How many servings?", "有几份？"),
      explanation: t(
        "To find how many servings fit, divide the total by the size of one serving. Change both mixed numbers to improper fractions and multiply by the reciprocal.\n\n$7\\frac{1}{2}$ cups in $1\\frac{1}{2}$-cup servings: $\\frac{15}{2} \\div \\frac{3}{2} = \\frac{15}{2} \\times \\frac{2}{3} = 5$ servings.",
        "求能分成几份，用总量除以每份的量。把两个带分数都化成假分数，再乘除数的倒数。\n\n$7\\frac{1}{2}$ 杯，每份 $1\\frac{1}{2}$ 杯：$\\frac{15}{2} \\div \\frac{3}{2} = \\frac{15}{2} \\times \\frac{2}{3} = 5$ 份。",
      ),
      generate(rng) {
        const each = mixedNumber(rng, 2, 4);
        const k = rng.int(2, 8);
        const total = each.mul(Q.of(k));
        const story = rng.pick([
          {
            en: `A pot holds $${mq(total)}$ liters of soup. Each bowl holds $${mq(each)}$ liters. How many bowls can be filled?`,
            zh: `一锅汤有 $${mq(total)}$ 升，每碗装 $${mq(each)}$ 升。可以装满多少碗？`,
          },
          {
            en: `A board is $${mq(total)}$ feet long. It is cut into shelves $${mq(each)}$ feet long each. How many shelves are there?`,
            zh: `一块木板长 $${mq(total)}$ 英尺，锯成每块 $${mq(each)}$ 英尺长的搁板。可以锯成多少块？`,
          },
        ]);
        return numberProblem({
          prompt: t(story.en, story.zh),
          answer: k,
          form: "integer",
          wrong: [total.mul(each), each.div(total), Q.of(k + 1)],
          solution: t(`$${divisionSteps(total, each)}$.`, `$${divisionSteps(total, each)}$。`),
        });
      },
    },
    {
      id: "rate-from-mixed-numbers",
      title: t("Finding a rate", "求速度"),
      explanation: t(
        "A rate such as miles per hour is the distance divided by the time. With mixed numbers, change both to improper fractions first, then multiply by the reciprocal of the time.\n\n$3\\frac{3}{4}$ miles in $1\\frac{1}{4}$ hours: $\\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$ miles per hour.",
        "每小时走多少英里这样的速度，等于路程除以时间。是带分数时，先都化成假分数，再乘时间的倒数。\n\n$1\\frac{1}{4}$ 小时走 $3\\frac{3}{4}$ 英里：$\\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$ 英里/小时。",
      ),
      generate(rng) {
        const time = mixedNumber(rng, 2, 4);
        const dist = mixedNumber(rng, 9, 4);
        const v = dist.div(time);
        return numberProblem({
          prompt: t(
            `A hiker walks $${mq(dist)}$ miles in $${mq(time)}$ hours at a steady pace. How many miles does the hiker walk per hour?`,
            `一名徒步者匀速行走，$${mq(time)}$ 小时走了 $${mq(dist)}$ 英里。他每小时走多少英里？`,
          ),
          answer: v,
          form: form(v),
          wrong: [dist.mul(time), time.div(dist), dist.sub(time).abs()],
          solution: t(
            `Speed $=$ distance $\\div$ time: $${divisionSteps(dist, time)}$ miles per hour.`,
            `速度 $=$ 路程 $\\div$ 时间：$${divisionSteps(dist, time)}$ 英里/小时。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Estimating decimal quotients

/** near draws a decimal with one decimal place within 0.4 of x, but not equal to it. */
function near(rng: Rng, x: number): Q {
  return Q.of(x * 10 + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), 10);
}

export const estimatingMultiDigitDivisionWithDecimals = topic(
  "estimating-multi-digit-division-with-decimals",
  t("Estimating Multi-Digit Division With Decimals", "估算多位小数除法"),
  t(
    "Round the dividend and divisor to compatible numbers, whole numbers that divide easily, then divide: 362.4 ÷ 8.9 ≈ 360 ÷ 9 = 40. An estimate tells you where the decimal point of the exact answer goes.",
    "把被除数和除数取成相容数（便于相除的整数），再相除：362.4 ÷ 8.9 ≈ 360 ÷ 9 = 40。估算可以帮你确定准确答案的小数点位置。",
  ),
  ["estimating-decimal-division"],
  ["6.NS.B.3"],
  [
    {
      id: "compatible-numbers-for-decimal-division",
      title: t("Estimating with compatible numbers", "用相容数估算"),
      explanation: t(
        "To estimate a decimal division, round the divisor to a nearby whole number, then change the dividend to a nearby number that it divides evenly.\n\n$362.4 \\div 8.9$: $8.9$ is close to $9$, and $362.4$ is close to $360$, which $9$ divides. So the quotient is about $360 \\div 9 = 40$.",
        "估算小数除法时，先把除数取成相近的整数，再把被除数换成一个相近的、能被它整除的数。\n\n$362.4 \\div 8.9$：$8.9$ 接近 $9$，$362.4$ 接近能被 $9$ 整除的 $360$。所以商大约是 $360 \\div 9 = 40$。",
      ),
      generate(rng) {
        const d = rng.int(3, 9);
        const q = rng.pick([rng.int(2, 9), rng.int(2, 9) * 10]);
        const a = near(rng, d * q);
        const b = near(rng, d);
        const options = [q, q * 10, Math.max(1, q / 10), q + d].filter((v, i, xs) => Number.isInteger(v) && xs.indexOf(v) === i);
        return pickChoice(
          rng,
          t(`Which is the best estimate of $${dec(a)} \\div ${dec(b)}$?`, `$${dec(a)} \\div ${dec(b)}$ 的最佳估计值是哪个？`),
          mathText(String(q)),
          options.slice(1).map((v) => mathText(String(v))),
          t(
            `Use compatible numbers: $${dec(b)} \\approx ${d}$ and $${dec(a)} \\approx ${d * q}$. So $${dec(a)} \\div ${dec(b)} \\approx ${d * q} \\div ${d} = ${q}$.`,
            `取相容数：$${dec(b)} \\approx ${d}$，$${dec(a)} \\approx ${d * q}$。所以 $${dec(a)} \\div ${dec(b)} \\approx ${d * q} \\div ${d} = ${q}$。`,
          ),
        );
      },
    },
    {
      id: "placing-the-decimal-point-by-estimating",
      title: t("Checking an answer with an estimate", "用估算检验答案"),
      explanation: t(
        "An estimate tells you how big the quotient should be, so you can tell where its decimal point goes. Pick the answer closest to the estimate.\n\n$47.25 \\div 6.3 \\approx 48 \\div 6 = 8$, so of $0.75$, $7.5$ and $75$, the quotient must be $7.5$.",
        "估算可以告诉你商大约有多大，从而判断小数点的位置。选择最接近估算结果的答案。\n\n$47.25 \\div 6.3 \\approx 48 \\div 6 = 8$，所以在 $0.75$、$7.5$、$75$ 中，商一定是 $7.5$。",
      ),
      generate(rng) {
        const b = Q.of(rng.int(21, 89), 10);
        const v = Q.of(rng.int(21, 99), 10);
        if (Number(b.n) % 10 === 0 || Number(v.n) % 10 === 0) return this.generate(rng);
        const a = b.mul(v);
        const est = Math.round(b.toNumber());
        const options = [v, v.mul(Q.of(10)), v.div(Q.of(10)), v.mul(Q.of(100))];
        return pickChoice(
          rng,
          t(`Use an estimate to decide: what is $${dec(a)} \\div ${dec(b)}$?`, `用估算判断：$${dec(a)} \\div ${dec(b)}$ 等于多少？`),
          mathText(dec(v)),
          options.slice(1).map((o) => mathText(dec(o))),
          t(
            `$${dec(b)} \\approx ${est}$ and $${dec(a)} \\div ${est} \\approx ${Math.round(a.toNumber() / est)}$, so the quotient is close to $${Math.round(a.toNumber() / est)}$. Only $${dec(v)}$ fits.`,
            `$${dec(b)} \\approx ${est}$，$${dec(a)} \\div ${est} \\approx ${Math.round(a.toNumber() / est)}$，所以商接近 $${Math.round(a.toNumber() / est)}$。只有 $${dec(v)}$ 符合。`,
          ),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Negative numbers and absolute value

/** Context is a quantity measured from a zero point, with words for the two directions. */
interface Context {
  readonly max: number;
  readonly up: (n: number) => Text;
  readonly down: (n: number) => Text;
  readonly zero: Text;
}

const contexts: readonly Context[] = [
  {
    max: 45,
    up: (n) => t(`${n} degrees above zero`, `零上 ${n} 摄氏度`),
    down: (n) => t(`${n} degrees below zero`, `零下 ${n} 摄氏度`),
    zero: t("a temperature of 0 degrees", "零摄氏度"),
  },
  {
    max: 900,
    up: (n) => t(`${n} meters above sea level`, `海拔 ${n} 米`),
    down: (n) => t(`${n} meters below sea level`, `海平面以下 ${n} 米`),
    zero: t("sea level", "海平面"),
  },
  {
    max: 500,
    up: (n) => t(`a deposit of ${n} dollars`, `存入 ${n} 美元`),
    down: (n) => t(`a withdrawal of ${n} dollars`, `取出 ${n} 美元`),
    zero: t("no change in the account", "账户没有变化"),
  },
  {
    max: 30,
    up: (n) => t(`a gain of ${n} yards`, `前进 ${n} 码`),
    down: (n) => t(`a loss of ${n} yards`, `后退 ${n} 码`),
    zero: t("no gain or loss", "既不前进也不后退"),
  },
];

export const interpretingNegativeNumbers = topic(
  "interpreting-negative-numbers",
  t("Interpreting Negative Numbers", "理解负数的意义"),
  t(
    "Positive and negative numbers describe quantities in opposite directions from zero: 8 degrees below zero is −8, a deposit of 50 dollars is +50 and a withdrawal of 50 dollars is −50. Zero is the reference point, such as sea level or no change.",
    "正数和负数表示从 0 出发方向相反的量：零下 8 摄氏度记作 −8，存入 50 美元记作 +50，取出 50 美元记作 −50。0 是基准，例如海平面或没有变化。",
  ),
  ["negative-numbers", "integers-and-opposites"],
  ["6.NS.C.5"],
  [
    {
      id: "writing-a-situation-as-an-integer",
      title: t("Writing a situation as a number", "用数表示情境"),
      explanation: t(
        "Positive and negative numbers describe amounts in opposite directions from zero. Choose which direction is positive, and the other is negative. Above sea level, gains and deposits are usually positive; below sea level, losses and withdrawals are negative.\n\n$200$ meters below sea level is $-200$; $35$ meters above sea level is $35$.",
        "正数和负数表示从 $0$ 出发方向相反的量。规定一个方向为正，相反的方向就为负。通常海平面以上、收入、存入记作正数；海平面以下、支出、取出记作负数。\n\n海平面以下 $200$ 米记作 $-200$；海拔 $35$ 米记作 $35$。",
      ),
      generate(rng) {
        const c = rng.pick(contexts);
        const n = rng.int(2, c.max);
        const neg = rng.bool();
        const v = neg ? -n : n;
        const desc = neg ? c.down(n) : c.up(n);
        return numberProblem({
          prompt: t(`Write a number to represent ${desc.en}.`, `写出表示“${desc["zh-CN"]}”的数。`),
          answer: v,
          form: "integer",
          wrong: [-v],
          solution: t(
            `${neg ? "This is in the negative direction from" : "This is in the positive direction from"} ${c.zero.en}, so it is $${v}$.`,
            `这是从${c.zero["zh-CN"]}出发向${neg ? "负" : "正"}方向的量，所以记作 $${v}$。`,
          ),
        });
      },
    },
    {
      id: "meaning-of-the-opposite",
      title: t("The meaning of the opposite", "相反意义的量"),
      explanation: t(
        "A number and its opposite are the same distance from zero in opposite directions, so they describe the same amount with the opposite meaning.\n\nIf $+15$ means $15$ meters above sea level, then $-15$ means $15$ meters below sea level.",
        "一个数和它的相反数离 $0$ 的距离相同、方向相反，所以它们表示同样多的量，但意义相反。\n\n如果 $+15$ 表示海拔 $15$ 米，那么 $-15$ 表示海平面以下 $15$ 米。",
      ),
      generate(rng) {
        const c = rng.pick(contexts);
        const n = rng.int(2, Math.min(c.max, 99));
        const startPositive = rng.bool();
        const given = startPositive ? c.up(n) : c.down(n);
        const correct = startPositive ? c.down(n) : c.up(n);
        const shown = startPositive ? -n : n;
        return pickChoice(
          rng,
          t(
            `If $${startPositive ? n : -n}$ represents ${given.en}, what does $${shown}$ represent?`,
            `如果 $${startPositive ? n : -n}$ 表示${given["zh-CN"]}，那么 $${shown}$ 表示什么？`,
          ),
          correct,
          [given, startPositive ? c.down(n + 1) : c.up(n + 1), c.zero],
          t(
            `$${shown}$ is the opposite of $${startPositive ? n : -n}$, so it represents the same amount in the opposite direction: ${correct.en}.`,
            `$${shown}$ 是 $${startPositive ? n : -n}$ 的相反数，表示方向相反、大小相同的量：${correct["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
);

export const interpretingAbsoluteValue = topic(
  "interpreting-absolute-value",
  t("Interpreting Absolute Value", "理解绝对值的意义"),
  t(
    "The absolute value of a number is its distance from zero, so it gives the size of a quantity without its direction. An account balance of −30 dollars is a debt of |−30| = 30 dollars, and a debt of 40 dollars (−40) is greater than a debt of 25 dollars (−25) even though −40 < −25.",
    "一个数的绝对值是它到 0 的距离，表示一个量的大小而不管方向。账户余额 −30 美元表示欠款 |−30| = 30 美元；欠 40 美元（−40）比欠 25 美元（−25）欠得多，尽管 −40 < −25。",
  ),
  ["absolute-value", "interpreting-negative-numbers"],
  ["6.NS.C.7c", "6.NS.C.7d"],
  [
    {
      id: "distance-from-zero-in-context",
      title: t("Size of a quantity", "量的大小"),
      explanation: t(
        "A diver at $-12$ m is $|-12| = 12$ m from sea level; a bird at $9$ m is $9$ m from it. The diver is farther.",
        "潜水员在 $-12$ 米处，离海平面 $|-12| = 12$ 米；鸟在 $9$ 米处，离海平面 $9$ 米。潜水员离得更远。",
      ),
      generate(rng) {
        const d = rng.int(3, 60);
        let b: number;
        do b = rng.int(3, 60);
        while (b === d);
        return choiceProblem({
          prompt: t(
            `A diver is at an elevation of $${-d}$ meters and a bird is at an elevation of $${b}$ meters. Which one is farther from sea level?`,
            `潜水员位于海拔 $${-d}$ 米处，一只鸟位于海拔 $${b}$ 米处。谁离海平面更远？`,
          ),
          options: [t("The diver", "潜水员"), t("The bird", "鸟")],
          correct: d > b ? 0 : 1,
          solution: t(
            `Distances from sea level are absolute values: $|${-d}| = ${d}$ and $|${b}| = ${b}$. ${d > b ? "The diver" : "The bird"} is farther.`,
            `离海平面的距离是绝对值：$|${-d}| = ${d}$，$|${b}| = ${b}$。${d > b ? "潜水员" : "鸟"}离得更远。`,
          ),
        });
      },
    },
    {
      id: "comparing-debts",
      title: t("Absolute value and order", "绝对值与大小"),
      explanation: t(
        "A negative balance is a debt, and its absolute value is the size of the debt. So the smaller balance is the larger debt: order the numbers by value, but compare debts by absolute value.\n\nBalances $-40$ and $-25$: $-40 < -25$, but $|-40| = 40 > 25 = |-25|$, so the balance of $-40$ is the greater debt.",
        "余额为负表示欠债，它的绝对值就是欠债的多少。所以余额越小，欠得越多：比较余额看数的大小，比较欠债看绝对值。\n\n余额 $-40$ 与 $-25$：$-40 < -25$，但 $|-40| = 40 > 25 = |-25|$，所以余额 $-40$ 欠得更多。",
      ),
      generate(rng) {
        const [x, y] = rng.sample([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75], 2) as [number, number];
        const askDebt = rng.bool();
        const bigger = Math.max(x, y);
        const smaller = Math.min(x, y);
        return choiceProblem({
          prompt: askDebt
            ? t(
                `Account A has a balance of $${-x}$ dollars and account B has a balance of $${-y}$ dollars. Which account shows the greater debt?`,
                `账户 A 的余额是 $${-x}$ 美元，账户 B 的余额是 $${-y}$ 美元。哪个账户欠款更多？`,
              )
            : t(
                `Account A has a balance of $${-x}$ dollars and account B has a balance of $${-y}$ dollars. Which account has the greater balance?`,
                `账户 A 的余额是 $${-x}$ 美元，账户 B 的余额是 $${-y}$ 美元。哪个账户的余额更大？`,
              ),
          options: [t("Account A", "账户 A"), t("Account B", "账户 B")],
          correct: askDebt ? (x > y ? 0 : 1) : x < y ? 0 : 1,
          solution: askDebt
            ? t(
                `The debts are $|${-x}| = ${x}$ and $|${-y}| = ${y}$ dollars, so the balance of $${-bigger}$ is the greater debt.`,
                `欠款分别是 $|${-x}| = ${x}$ 和 $|${-y}| = ${y}$ 美元，所以余额 $${-bigger}$ 的账户欠款更多。`,
              )
            : t(
                `$${-smaller} > ${-bigger}$ because $${-smaller}$ is to the right of $${-bigger}$ on the number line, so the balance of $${-smaller}$ is greater, even though it is the smaller debt.`,
                `在数轴上 $${-smaller}$ 在 $${-bigger}$ 的右边，所以 $${-smaller} > ${-bigger}$：余额 $${-smaller}$ 更大，尽管它的欠款更少。`,
              ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Rational numbers

/** setOptions are the ways to classify a number among the natural numbers, integers and rational numbers. */
const setOptions: readonly Text[] = [
  t("A natural number, an integer and a rational number", "自然数、整数，也是有理数"),
  t("An integer and a rational number, but not a natural number", "整数和有理数，但不是自然数"),
  t("A rational number, but not an integer", "有理数，但不是整数"),
];

export const naturalNumbersIntegersAndRationalNumbers = topic(
  "natural-numbers-integers-and-rational-numbers",
  t("Natural Numbers, Integers, and Rational Numbers", "自然数、整数与有理数"),
  t(
    "The natural numbers are 1, 2, 3, …. The integers are the natural numbers, their opposites and 0: …, −2, −1, 0, 1, 2, …. A rational number is any number that can be written as a fraction a/b of integers with b ≠ 0, such as 3/4, −2.5 = −5/2 and 7 = 7/1. Every natural number is an integer, and every integer is a rational number.",
    "自然数是 1, 2, 3, …（本课程中自然数从 1 开始）。整数包括自然数、它们的相反数和 0：…, −2, −1, 0, 1, 2, …。能写成整数之比 a/b（b ≠ 0）的数叫有理数，例如 3/4、−2.5 = −5/2、7 = 7/1。每个自然数都是整数，每个整数都是有理数。",
  ),
  ["integers-and-opposites", "converting-decimals-to-fractions"],
  ["6.NS.C.6"],
  [
    {
      id: "classifying-a-number",
      title: t("Classifying a number", "给数分类"),
      explanation: t(
        "$5$ is natural, an integer and rational. $-5$ and $0$ are integers and rational but not natural. $-\\frac{1}{2}$ and $0.3$ are rational but not integers.",
        "$5$ 是自然数，也是整数和有理数。$-5$ 和 $0$ 是整数和有理数，但不是自然数。$-\\frac{1}{2}$ 和 $0.3$ 是有理数，但不是整数。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let latex: string;
        let why: Text;
        if (kind === 0) {
          const n = rng.int(1, 99);
          latex = String(n);
          why = t(
            `$${n}$ is a counting number, so it is natural, an integer and rational ($${n} = ${fr(n, 1)}$).`,
            `$${n}$ 是自然数，所以也是整数和有理数（$${n} = ${fr(n, 1)}$）。`,
          );
        } else if (kind === 1) {
          const n = rng.bool(0.2) ? 0 : -rng.int(1, 99);
          latex = String(n);
          why = t(
            `$${n}$ is ${n === 0 ? "zero" : "the opposite of a natural number"}, so it is an integer and rational ($${n} = ${fr(n, 1)}$), but not natural.`,
            `$${n}$ ${n === 0 ? "是 0" : "是自然数的相反数"}，所以是整数和有理数（$${n} = ${fr(n, 1)}$），但不是自然数。`,
          );
        } else {
          const [a, b] = properFraction(rng, 9, 2);
          const sign = rng.bool() ? "-" : "";
          latex = rng.bool() ? `${sign}${fr(a, b)}` : `${sign}${dec(Q.of(rng.int(11, 99), 10))}`;
          why = t(
            `$${latex}$ lies between two integers, so it is not an integer, but it is a quotient of integers, so it is rational.`,
            `$${latex}$ 在两个整数之间，所以不是整数；但它能写成整数之比，所以是有理数。`,
          );
        }
        return choiceProblem({
          prompt: t(`Which best describes the number $${latex}$?`, `下面哪一项最准确地描述了数 $${latex}$？`),
          options: setOptions,
          correct: kind,
          solution: why,
        });
      },
    },
    {
      id: "finding-the-non-integer",
      title: t("Which is not an integer?", "哪个不是整数？"),
      explanation: t(
        "An integer is a whole number or its opposite. A fraction is an integer only if it simplifies to a whole number, so divide the numerator by the denominator to check.\n\n$\\frac{12}{4} = 3$ and $-\\frac{6}{3} = -2$ are integers in disguise; $\\frac{7}{2} = 3.5$ is not an integer.",
        "整数包括正整数、$0$ 和负整数。一个分数只有化简后是整数时才是整数，所以用分子除以分母来检验。\n\n$\\frac{12}{4} = 3$、$-\\frac{6}{3} = -2$ 实际上是整数；$\\frac{7}{2} = 3.5$ 不是整数。",
      ),
      generate(rng) {
        const d = rng.int(2, 6);
        let n: number;
        do n = rng.int(d + 1, 6 * d);
        while (n % d === 0);
        const k = rng.int(2, 6);
        const m = rng.int(2, 5);
        const sign = rng.bool() ? "-" : "";
        const target = `${sign}${fr(n, d)}`;
        const numbers = rng.shuffle([target, fr(k * m, m), `-${fr(k * d, d)}`, String(-rng.int(1, 30))]);
        return choiceProblem({
          prompt: t(
            `Which of these numbers is not an integer? $$${numbers.join(",\\quad ")}$$`,
            `下面哪个数不是整数？$$${numbers.join(",\\quad ")}$$`,
          ),
          options: numbers.map(mathText),
          correct: numbers.indexOf(target),
          solution: t(
            `$${d}$ does not divide $${n}$, so $${target} = ${sign}${mq(Q.of(n, d))}$ lies between two integers. The others simplify to integers: $${fr(k * m, m)} = ${k}$ and $-${fr(k * d, d)} = -${k}$.`,
            `$${d}$ 不能整除 $${n}$，所以 $${target} = ${sign}${mq(Q.of(n, d))}$ 在两个整数之间，不是整数。其他各数都能化成整数：$${fr(k * m, m)} = ${k}$，$-${fr(k * d, d)} = -${k}$。`,
          ),
        });
      },
    },
  ],
);

/** numberLine draws a number line from lo to hi with d ticks per unit, numbers at the integers, and labeled points. */
function numberLine(lo: number, hi: number, d: number, points: readonly { at: number; label: string }[]): Figure {
  const x = (v: number) => Math.round((20 + ((v - lo) / (hi - lo)) * 280) * 100) / 100;
  let body = `<line x1="${x(lo)}" y1="40" x2="${x(hi)}" y2="40"/>`;
  for (let i = 0; i <= (hi - lo) * d; i++) {
    const v = lo + i / d;
    const whole = i % d === 0;
    body += `<line x1="${x(v)}" y1="${whole ? 33 : 36}" x2="${x(v)}" y2="${whole ? 47 : 44}"/>`;
    if (whole) body += `<text x="${x(v)}" y="62">${Math.round(v)}</text>`;
  }
  for (const p of points)
    body += `<circle class="accent" cx="${x(p.at)}" cy="40" r="4" fill="currentColor" stroke="none"/><text x="${x(p.at)}" y="24" font-style="italic">${p.label}</text>`;
  return {
    svg: svgDocument(72, body),
    alt: t(
      `A number line from ${lo} to ${hi} with ${d} equal parts between consecutive integers and points ${points.map((p) => p.label).join(", ")}.`,
      `从 ${lo} 到 ${hi} 的数轴，相邻整数之间分成 ${d} 等份，标有点 ${points.map((p) => p.label).join("、")}。`,
    ),
  };
}

export const identifyingRationalNumbersOnANumberLine = topic(
  "identifying-rational-numbers-on-a-number-line",
  t("Identifying Rational Numbers on a Number Line", "在数轴上表示有理数"),
  t(
    "Every rational number has a place on the number line. To read a point, count the equal parts between integers: on a line with 4 parts per unit, the point 3 parts to the left of −1 is −1 3/4 = −1.75. Negative numbers lie to the left of 0.",
    "每个有理数都能在数轴上找到对应的点。读点时，数一数相邻整数间的等份：每个单位分成 4 份，−1 左边 3 份的点是 −1 3/4 = −1.75。负数在 0 的左边。",
  ),
  ["natural-numbers-integers-and-rational-numbers", "modeling-fractions-using-number-lines", "negative-numbers"],
  ["6.NS.C.6", "6.NS.C.6c"],
  [
    {
      id: "reading-a-rational-number",
      title: t("Reading a point", "读出点表示的数"),
      explanation: t(
        "Count how many equal parts each unit is split into; that is the denominator. Then count parts from the nearest labeled integer. To the left of a negative integer, the number becomes more negative.\n\nWith $4$ parts per unit, a point $1$ part to the left of $-2$ is $-2\\frac{1}{4}$, not $-1\\frac{3}{4}$.",
        "先数每个单位被平均分成几份，这就是分母。再从最近的整数开始数份数。在负整数的左边，数会变得更小。\n\n每个单位分成 $4$ 份，$-2$ 左边 $1$ 份的点是 $-2\\frac{1}{4}$，而不是 $-1\\frac{3}{4}$。",
      ),
      generate(rng) {
        const d = rng.pick([2, 3, 4, 5]);
        const lo = rng.int(-4, -1);
        const hi = lo + 4;
        let k: number;
        do k = rng.int(1, 4 * d - 1);
        while (k % d === 0 || lo + k / d > 0);
        const v = Q.of(lo * d + k, d);
        return {
          ...numberProblem({
            prompt: t("What number does point $P$ represent?", "点 $P$ 表示什么数？"),
            answer: v,
            wrong: [v.neg(), Q.of(lo * d + k + 1, d), Q.of(lo * d + k - 1, d), Q.of(Math.ceil(v.toNumber())).sub(Q.of(k % d, d))],
            solution: t(
              `Each unit is split into $${d}$ equal parts, so each tick is $${fr(1, d)}$. $P$ is $${(k % d) === 0 ? 0 : d - (k % d)}$ part${d - (k % d) === 1 ? "" : "s"} to the left of $${Math.ceil(v.toNumber())}$, so $P = ${mq(v)}$.`,
              `每个单位平均分成 $${d}$ 份，每格是 $${fr(1, d)}$。$P$ 在 $${Math.ceil(v.toNumber())}$ 左边 $${d - (k % d)}$ 格处，所以 $P = ${mq(v)}$。`,
            ),
          }),
          figure: numberLine(lo, hi, d, [{ at: v.toNumber(), label: "P" }]),
        };
      },
    },
    {
      id: "locating-a-rational-number",
      title: t("Locating a number", "找到数对应的点"),
      explanation: t(
        "$-1.5$ is halfway between $-2$ and $-1$; $1.5$ is halfway between $1$ and $2$. Be careful not to mix them up.",
        "$-1.5$ 在 $-2$ 和 $-1$ 的正中间；$1.5$ 在 $1$ 和 $2$ 的正中间。注意不要混淆。",
      ),
      generate(rng) {
        const d = rng.pick([2, 4]);
        const target = Q.of(-rng.int(d + 1, 3 * d - 1), d);
        if (target.isInteger()) return this.generate(rng);
        const t0 = target.toNumber();
        const decoys = [-t0, t0 + 1 / d, Math.ceil(t0) - (t0 - Math.floor(t0))].filter(
          (v, i, xs) => v !== t0 && xs.indexOf(v) === i && v >= -4 && v <= 4,
        );
        const all = rng.shuffle([t0, ...decoys.slice(0, 3)]);
        const labels = ["A", "B", "C", "D"];
        const pts = all.map((v, i) => ({ at: v, label: labels[i]! }));
        const correct = all.indexOf(t0);
        const shown = rng.bool() ? dec(target) : mq(target);
        return {
          ...choiceProblem({
            prompt: t(`Which point represents $${shown}$?`, `哪个点表示 $${shown}$？`),
            options: pts.map((p) => t(`Point ${p.label}`, `点 ${p.label}`)),
            correct,
            solution: t(
              `$${shown}$ is negative, so it is left of $0$, between $${Math.floor(t0)}$ and $${Math.ceil(t0)}$. That is point ${labels[correct]}.`,
              `$${shown}$ 是负数，在 $0$ 的左边，位于 $${Math.floor(t0)}$ 和 $${Math.ceil(t0)}$ 之间，是点 ${labels[correct]}。`,
            ),
          }),
          figure: numberLine(-4, 4, d, pts),
        };
      },
    },
  ],
);

/** RationalForm is a rational number with how it is written. */
interface RationalForm {
  readonly v: Q;
  readonly latex: string;
}

/** randomRational draws a rational number between −5 and 5 written as a fraction, mixed number or decimal. */
function randomRational(rng: Rng): RationalForm {
  const d = rng.pick([2, 4, 5, 10]);
  const n = rng.int(-5 * d, 5 * d);
  const v = Q.of(n, d);
  if (v.isInteger()) return { v, latex: v.toString() };
  return { v, latex: rng.bool() ? dec(v) : mq(v) };
}

export const comparingRationalNumbers = topic(
  "comparing-rational-numbers",
  t("Comparing Rational Numbers", "比较有理数的大小"),
  t(
    "Of two numbers, the one farther right on the number line is greater. Any positive number is greater than any negative number, and of two negative numbers the one with the smaller absolute value is greater: −1.2 > −1 3/4 because 1.2 < 1.75.",
    "数轴上右边的数比左边的大。正数都大于负数；两个负数比较，绝对值小的反而大：−1.2 > −1 3/4，因为 1.2 < 1.75。",
  ),
  ["identifying-rational-numbers-on-a-number-line", "comparing-negative-numbers"],
  ["6.NS.C.7a", "6.NS.C.7b"],
  [
    {
      id: "comparing-two-rational-numbers",
      title: t("Comparing two numbers", "比较两个数"),
      explanation: t(
        "On a number line, a number to the left is smaller. To compare a fraction and a decimal, write both as decimals first. With negative numbers, the one farther from zero is smaller.\n\n$-\\frac{3}{4}$ or $-0.7$? $-\\frac{3}{4} = -0.75$, which is left of $-0.7$, so $-\\frac{3}{4} < -0.7$.",
        "在数轴上，左边的数小。比较分数和小数时，先都化成小数。负数离 $0$ 越远，数越小。\n\n$-\\frac{3}{4}$ 与 $-0.7$：$-\\frac{3}{4} = -0.75$，在 $-0.7$ 的左边，所以 $-\\frac{3}{4} < -0.7$。",
      ),
      generate(rng) {
        const a = randomRational(rng);
        let b: RationalForm;
        do b = randomRational(rng);
        while (b.latex === a.latex || (a.v.sign() >= 0 && b.v.sign() >= 0 && rng.bool(0.7)));
        const rel = a.v.cmp(b.v) + 1;
        const sym = ["<", "=", ">"][rel]!;
        return compareProblem(
          a.latex,
          b.latex,
          rel,
          t(
            `${asDecimals([a, b], ", ") ? `As decimals: ${asDecimals([a, b], ", ")}. ` : ""}${rel === 0 ? `$${a.latex}$ is farther left on the number line` : rel === 2 ? `$${a.latex}$ is farther right on the number line` : "They are the same point"}, so $${a.latex} ${sym} ${b.latex}$.`,
            `${asDecimals([a, b], "，") ? `化成小数：${asDecimals([a, b], "，")}。` : ""}${rel === 0 ? `数轴上 $${a.latex}$ 在左边` : rel === 2 ? `数轴上 $${a.latex}$ 在右边` : "它们是同一个点"}，所以 $${a.latex} ${sym} ${b.latex}$。`,
          ),
        );
      },
    },
    {
      id: "comparing-rational-numbers-in-context",
      title: t("Comparing in context", "在情境中比较"),
      explanation: t(
        "For temperatures, a lower number means colder. Write both temperatures in the same form, then the smaller number is the colder one.\n\nAt $-4.5^\\circ$C and $-4\\frac{1}{4}^\\circ$C, write $-4\\frac{1}{4} = -4.25$. The colder temperature is the smaller number: $-4.5 < -4.25$.",
        "对于气温，数越小越冷。先把两个温度写成同一种形式，较小的那个更冷。\n\n$-4.5^\\circ$C 与 $-4\\frac{1}{4}^\\circ$C：$-4\\frac{1}{4} = -4.25$。更冷的是较小的数：$-4.5 < -4.25$。",
      ),
      generate(rng) {
        const a = Q.of(-rng.int(11, 99), 10);
        let b: Q;
        do b = Q.of(-rng.int(5, 40), 4);
        while (b.eq(a) || b.isInteger());
        const colder = a.cmp(b) < 0 ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `At noon the temperature in Oslo was $${dec(a)}^\\circ$C and in Helsinki it was $${mq(b)}^\\circ$C. Which city was colder?`,
            `中午奥斯陆的气温是 $${dec(a)}^\\circ$C，赫尔辛基的气温是 $${mq(b)}^\\circ$C。哪个城市更冷？`,
          ),
          options: [t("Oslo", "奥斯陆"), t("Helsinki", "赫尔辛基")],
          correct: colder,
          solution: t(
            `$${mq(b)} = ${dec(b)}$. The colder temperature is the smaller number: $${dec(colder === 0 ? a : b)} < ${dec(colder === 0 ? b : a)}$, so ${colder === 0 ? "Oslo" : "Helsinki"} was colder.`,
            `$${mq(b)} = ${dec(b)}$。更冷的气温是较小的数：$${dec(colder === 0 ? a : b)} < ${dec(colder === 0 ? b : a)}$，所以${colder === 0 ? "奥斯陆" : "赫尔辛基"}更冷。`,
          ),
        });
      },
    },
  ],
);

/** asDecimals lists the numbers not already written as decimals or integers with their decimal values. */
function asDecimals(xs: readonly RationalForm[], sep: string): string {
  return xs
    .filter((r) => r.latex !== dec(r.v))
    .map((r) => `$${r.latex} = ${dec(r.v)}$`)
    .join(sep);
}

/** distinctRationals draws n rational numbers with distinct values. */
function distinctRationals(rng: Rng, n: number): RationalForm[] {
  const out: RationalForm[] = [];
  while (out.length < n) {
    const r = randomRational(rng);
    if (out.every((o) => !o.v.eq(r.v))) out.push(r);
  }
  return out;
}

export const orderingRationalNumbers = topic(
  "ordering-rational-numbers",
  t("Ordering Rational Numbers", "有理数排序"),
  t(
    "To order rational numbers, write them in the same form (decimals are easiest) and place them on a number line: from least to greatest, −2 1/2, −1.8, 0.4, 3/4.",
    "给有理数排序，先把它们化成同一种形式（小数最方便），再在数轴上找位置：从小到大是 −2 1/2、−1.8、0.4、3/4。",
  ),
  ["comparing-rational-numbers"],
  ["6.NS.C.7a"],
  [
    {
      id: "ordering-least-to-greatest",
      title: t("Least to greatest", "从小到大排列"),
      explanation: t(
        "Write every number as a decimal, then place them in order as on a number line: negatives first, the one farthest from zero first, then the positives.\n\n$0.4$, $-1.8$, $\\frac{3}{4}$, $-2\\frac{1}{2}$ are $0.4$, $-1.8$, $0.75$, $-2.5$, so the order is $-2\\frac{1}{2}, -1.8, 0.4, \\frac{3}{4}$.",
        "把每个数都化成小数，再像在数轴上一样排序：先排负数，离 $0$ 最远的最小，然后是正数。\n\n$0.4$、$-1.8$、$\\frac{3}{4}$、$-2\\frac{1}{2}$ 分别是 $0.4$、$-1.8$、$0.75$、$-2.5$，所以从小到大是 $-2\\frac{1}{2}, -1.8, 0.4, \\frac{3}{4}$。",
      ),
      generate(rng) {
        const xs = distinctRationals(rng, 4);
        const sorted = [...xs].sort((a, b) => a.v.cmp(b.v));
        const list = (rs: readonly RationalForm[]) => mathText(rs.map((r) => r.latex).join(",\\ "));
        const byAbs = [...xs].sort((a, b) => a.v.abs().cmp(b.v.abs()));
        const swapped = [sorted[1]!, sorted[0]!, sorted[2]!, sorted[3]!];
        return pickChoice(
          rng,
          t(
            `Which list orders these numbers from least to greatest? $$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
            `哪一组把这些数按从小到大的顺序排列？$$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
          ),
          list(sorted),
          [list(byAbs), list([...sorted].reverse()), list(swapped)],
          t(
            `${asDecimals(xs, ", ") ? `As decimals: ${asDecimals(xs, ", ")}. ` : ""}From least to greatest: $${sorted.map((r) => r.latex).join(", ")}$.`,
            `${asDecimals(xs, "，") ? `化成小数：${asDecimals(xs, "，")}。` : ""}从小到大：$${sorted.map((r) => r.latex).join(", ")}$。`,
          ),
        );
      },
    },
    {
      id: "finding-the-least",
      title: t("Finding the least", "找出最小的数"),
      explanation: t(
        "To find the least number, write them all as decimals, rounding long ones, and look for the one farthest left on the number line. Among negatives, the one with the largest absolute value is the least.\n\nAmong $-1.6$, $-1\\frac{2}{3}$, $-\\frac{3}{2}$: they are about $-1.6$, $-1.67$ and $-1.5$, so $-1\\frac{2}{3}$ is the least.",
        "找最小的数时，把它们都化成小数（除不尽的取近似值），看哪个在数轴上最靠左。负数中，绝对值最大的那个最小。\n\n$-1.6$、$-1\\frac{2}{3}$、$-\\frac{3}{2}$ 约为 $-1.6$、$-1.67$、$-1.5$，所以 $-1\\frac{2}{3}$ 最小。",
      ),
      generate(rng) {
        const xs = distinctRationals(rng, 4);
        const least = xs.reduce((m, r) => (r.v.cmp(m.v) < 0 ? r : m));
        return choiceProblem({
          prompt: t(
            `Which number is the least? $$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
            `哪个数最小？$$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
          ),
          options: xs.map((r) => mathText(r.latex)),
          correct: xs.indexOf(least),
          solution: t(
            `${asDecimals(xs, ", ") ? `As decimals: ${asDecimals(xs, ", ")}. ` : ""}The least, farthest left on the number line, is $${least.latex}$.`,
            `${asDecimals(xs, "，") ? `化成小数：${asDecimals(xs, "，")}。` : ""}最小的数（数轴上最左边）是 $${least.latex}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// The coordinate plane

/** grid draws the plane from −n to n with the marks. */
function grid(n: number, marks: readonly PlaneMark[], step = 1, alt: Text): Figure {
  return { svg: plane({ xMin: -n, xMax: n, yMin: -n, yMax: n, step, labelEvery: step < 1 ? 2 : 2 }, marks), alt };
}

/** quadrantName names the quadrant or axis a point lies in. */
function quadrantOf(x: number, y: number): number {
  if (x === 0 || y === 0) return 4;
  if (x > 0) return y > 0 ? 0 : 3;
  return y > 0 ? 1 : 2;
}

const quadrantOptions: readonly Text[] = [
  t("Quadrant I", "第一象限"),
  t("Quadrant II", "第二象限"),
  t("Quadrant III", "第三象限"),
  t("Quadrant IV", "第四象限"),
  t("On an axis", "在坐标轴上"),
];

/** nonZero draws a whole number in [−n, n] other than 0. */
const nonZero = (rng: Rng, n: number) => rng.nonZero(-n, n);

export const theCartesianCoordinateSystem = topic(
  "the-cartesian-coordinate-system",
  t("The Cartesian Coordinate System", "平面直角坐标系"),
  t(
    "Extending both axes past 0 splits the plane into four quadrants, numbered I to IV counterclockwise from the upper right. The signs of the coordinates tell the quadrant: (+, +) is in I, (−, +) in II, (−, −) in III and (+, −) in IV. A point with a zero coordinate lies on an axis.",
    "把两条坐标轴向 0 的另一侧延长，平面被分成四个象限，从右上开始按逆时针方向依次为第一到第四象限。坐标的符号决定象限：(+, +) 在第一象限，(−, +) 在第二象限，(−, −) 在第三象限，(+, −) 在第四象限。有一个坐标为 0 的点在坐标轴上。",
  ),
  ["the-coordinate-plane", "describing-the-coordinate-plane"],
  ["6.NS.C.6b", "6.NS.C.6c"],
  [
    {
      id: "naming-the-quadrant",
      title: t("Naming the quadrant", "判断所在象限"),
      explanation: t(
        "The axes split the plane into four quadrants, numbered counterclockwise from the upper right. The signs tell the quadrant: I is $(+, +)$, II is $(-, +)$, III is $(-, -)$, IV is $(+, -)$. A point with a $0$ coordinate lies on an axis, not in a quadrant.\n\n$(-3, 5)$ has a negative $x$ and positive $y$, so it is in Quadrant II. $(4, 0)$ is on the $x$-axis.",
        "坐标轴把平面分成四个象限，从右上方开始按逆时针方向编号。坐标的正负决定象限：第一象限 $(+, +)$，第二象限 $(-, +)$，第三象限 $(-, -)$，第四象限 $(+, -)$。有一个坐标是 $0$ 的点在坐标轴上，不属于任何象限。\n\n$(-3, 5)$ 的 $x$ 为负、$y$ 为正，在第二象限。$(4, 0)$ 在 $x$ 轴上。",
      ),
      generate(rng) {
        const onAxis = rng.bool(0.15);
        const x = onAxis && rng.bool() ? 0 : nonZero(rng, 12);
        const y = onAxis && x !== 0 ? 0 : nonZero(rng, 12);
        const q = quadrantOf(x, y);
        const sign = (v: number) => (v > 0 ? "+" : v < 0 ? "-" : "0");
        return choiceProblem({
          prompt: t(`Where is the point $(${x}, ${y})$?`, `点 $(${x}, ${y})$ 在哪里？`),
          options: quadrantOptions,
          correct: q,
          solution:
            q === 4
              ? t(`One coordinate is $0$, so the point lies on an axis.`, `有一个坐标是 $0$，所以这个点在坐标轴上。`)
              : t(
                  `The signs are $(${sign(x)}, ${sign(y)})$, which is ${quadrantOptions[q]!.en}.`,
                  `坐标的符号是 $(${sign(x)}, ${sign(y)})$，所以在${quadrantOptions[q]!["zh-CN"]}。`,
                ),
        });
      },
    },
    {
      id: "reading-coordinates-in-four-quadrants",
      title: t("Reading coordinates", "读出点的坐标"),
      explanation: t(
        "A point $3$ units left of the origin and $2$ units down is $(-3, -2)$: left and down are negative.",
        "在原点左边 $3$ 个单位、下面 $2$ 个单位的点是 $(-3, -2)$：向左和向下是负方向。",
      ),
      generate(rng) {
        const x = nonZero(rng, 5);
        const y = nonZero(rng, 5);
        if (x > 0 && y > 0) return this.generate(rng);
        const name = rng.pick(["A", "B", "P", "Q"]);
        const dirEn = `${Math.abs(x)} unit${Math.abs(x) === 1 ? "" : "s"} ${x > 0 ? "right" : "left"} and ${Math.abs(y)} unit${Math.abs(y) === 1 ? "" : "s"} ${y > 0 ? "up" : "down"}`;
        const dirZh = `向${x > 0 ? "右" : "左"} ${Math.abs(x)} 个单位、向${y > 0 ? "上" : "下"} ${Math.abs(y)} 个单位`;
        return {
          ...pointProblem({
            prompt: t(`Write the coordinates of point $${name}$.`, `写出点 $${name}$ 的坐标。`),
            answer: [x, y],
            wrong: [
              [y, x],
              [-x, y],
              [x, -y],
              [Math.abs(x), Math.abs(y)],
            ],
            solution: t(
              `From the origin, $${name}$ is $${dirEn}$, so $${name} = ${pointLatex([x, y])}$.`,
              `从原点出发，$${name}$ 在$${dirZh}$处，所以 $${name} = ${pointLatex([x, y])}$。`,
            ),
          }),
          figure: grid(
            6,
            [{ kind: "point", at: [x, y], label: name, accent: true }],
            1,
            t(`Point ${name} on a coordinate grid from −6 to 6.`, `坐标网格（−6 到 6）上的点 ${name}。`),
          ),
        };
      },
    },
  ],
);

export const rationalNumbersInTheCoordinatePlane = topic(
  "rational-numbers-in-the-coordinate-plane",
  t("Rational Numbers in the Coordinate Plane", "坐标平面中的有理数"),
  t(
    "Coordinates need not be integers. On a grid with lines every half unit, a point halfway between $-3$ and $-2$ on the x-axis and between $1$ and $2$ on the y-axis is $(-2.5, 1.5)$ = ($-2$ $\\frac{1}{2}$, $1$ $\\frac{1}{2}$).",
    "坐标不一定是整数。在每半个单位画一条线的网格上，横向在 $-3$ 与 $-2$ 正中间、纵向在 $1$ 与 $2$ 正中间的点是 $(-2.5, 1.5)$ = ($-2$ $\\frac{1}{2}$, $1$ $\\frac{1}{2}$)。",
  ),
  ["the-cartesian-coordinate-system", "identifying-rational-numbers-on-a-number-line"],
  ["6.NS.C.6c"],
  [
    {
      id: "reading-rational-coordinates",
      title: t("Reading rational coordinates", "读出有理数坐标"),
      explanation: t(
        "With grid lines every $0.5$, count half units: $5$ half units left and $3$ half units up is $(-2.5, 1.5)$.",
        "网格线间隔 $0.5$，按半个单位数：向左 $5$ 个半单位、向上 $3$ 个半单位是 $(-2.5, 1.5)$。",
      ),
      generate(rng) {
        const hx = rng.nonZero(-7, 7);
        const hy = rng.nonZero(-7, 7);
        if (hx % 2 === 0 && hy % 2 === 0) return this.generate(rng);
        const [x, y] = [Q.of(hx, 2), Q.of(hy, 2)];
        return {
          ...pointProblem({
            prompt: t(
              "The grid lines are $0.5$ unit apart. Write the coordinates of point $P$.",
              "网格线间隔 $0.5$ 个单位。写出点 $P$ 的坐标。",
            ),
            answer: [x, y],
            wrong: [
              [hx, hy],
              [y, x],
              [x.neg(), y],
            ],
            solution: t(
              `$P$ is $${Math.abs(hx)}$ half units ${hx > 0 ? "right" : "left"} and $${Math.abs(hy)}$ half units ${hy > 0 ? "up" : "down"}, so $P = (${dec(x)}, ${dec(y)})$.`,
              `$P$ 在向${hx > 0 ? "右" : "左"} $${Math.abs(hx)}$ 个半单位、向${hy > 0 ? "上" : "下"} $${Math.abs(hy)}$ 个半单位处，所以 $P = (${dec(x)}, ${dec(y)})$。`,
            ),
          }),
          figure: grid(
            4,
            [{ kind: "point", at: [x.toNumber(), y.toNumber()], label: "P", accent: true }],
            0.5,
            t("Point P on a coordinate grid from −4 to 4 with lines every half unit.", "坐标网格（−4 到 4，每半个单位一条线）上的点 P。"),
          ),
        };
      },
    },
    {
      id: "choosing-the-point-with-given-coordinates",
      title: t("Finding a point", "找出给定坐标的点"),
      explanation: t(
        "The $x$-coordinate tells how far right (positive) or left (negative) of the $y$-axis the point is; the $y$-coordinate tells how far up or down from the $x$-axis. Read the scale on the grid before counting lines.\n\n$(-1\\frac{1}{2}, 2)$ is $1\\frac{1}{2}$ units left of the $y$-axis and $2$ units above the $x$-axis.",
        "$x$ 坐标表示点在 $y$ 轴右边（正）或左边（负）多远；$y$ 坐标表示点在 $x$ 轴上方或下方多远。数网格线之前，先看清每格代表多少。\n\n$(-1\\frac{1}{2}, 2)$ 在 $y$ 轴左边 $1\\frac{1}{2}$ 个单位、$x$ 轴上方 $2$ 个单位处。",
      ),
      generate(rng) {
        const hx = rng.nonZero(-7, 7);
        const hy = rng.nonZero(-7, 7);
        if (hx % 2 === 0 || hx === hy || hx === -hy) return this.generate(rng);
        const pts: [number, number][] = [
          [hx / 2, hy / 2],
          [hy / 2, hx / 2],
          [-hx / 2, hy / 2],
          [hx / 2, -hy / 2],
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const labels = ["A", "B", "C", "D"];
        const marks: PlaneMark[] = order.map((p, i) => ({ kind: "point", at: pts[p]!, label: labels[i], accent: true }));
        const correct = order.indexOf(0);
        const target = pointLatex([Q.of(hx, 2), Q.of(hy, 2)].map((v) => v));
        return {
          ...choiceProblem({
            prompt: t(
              `The grid lines are $0.5$ unit apart. Which point is at $${target.replace(/\\frac\{(-?\d+)\}\{2\}/g, (_, n) => dec(Q.of(Number(n), 2)))}$?`,
              `网格线间隔 $0.5$ 个单位。哪个点的坐标是 $${target.replace(/\\frac\{(-?\d+)\}\{2\}/g, (_, n) => dec(Q.of(Number(n), 2)))}$？`,
            ),
            options: labels.map((l) => t(`Point ${l}`, `点 ${l}`)),
            correct,
            solution: t(
              `Go ${hx > 0 ? "right" : "left"} $${Math.abs(hx / 2)}$ along the $x$-axis, then ${hy > 0 ? "up" : "down"} $${Math.abs(hy / 2)}$: that is point ${labels[correct]}.`,
              `沿 $x$ 轴向${hx > 0 ? "右" : "左"}走 $${Math.abs(hx / 2)}$，再向${hy > 0 ? "上" : "下"}走 $${Math.abs(hy / 2)}$：是点 ${labels[correct]}。`,
            ),
          }),
          figure: grid(
            4,
            marks,
            0.5,
            t(
              "Four labeled points A, B, C and D on a grid from −4 to 4 with lines every half unit.",
              "坐标网格（−4 到 4，每半个单位一条线）上的四个点 A、B、C、D。",
            ),
          ),
        };
      },
    },
  ],
);

export const reflectionsOfPointsInTheCoordinatePlane = topic(
  "reflections-of-points-in-the-coordinate-plane",
  t("Reflections of Points in the Coordinate Plane", "坐标平面中点的对称"),
  t(
    "Reflecting a point across the x-axis changes the sign of its y-coordinate: (3, 4) → (3, −4). Reflecting across the y-axis changes the sign of its x-coordinate: (3, 4) → (−3, 4). Reflecting across both axes changes both signs: (3, 4) → (−3, −4).",
    "点关于 x 轴对称时，y 坐标变号：(3, 4) → (3, −4)。关于 y 轴对称时，x 坐标变号：(3, 4) → (−3, 4)。先后关于两条坐标轴对称，两个坐标都变号：(3, 4) → (−3, −4)。",
  ),
  ["the-cartesian-coordinate-system"],
  ["6.NS.C.6b"],
  [
    {
      id: "reflecting-across-an-axis",
      title: t("Reflecting across one axis", "关于一条坐标轴对称"),
      explanation: t(
        "Reflecting across the $x$-axis flips a point up or down, so the $y$-coordinate changes sign and $x$ stays. Reflecting across the $y$-axis flips it left or right, so the $x$-coordinate changes sign and $y$ stays.\n\nAcross the $x$-axis, $(-2, 5)$ goes to $(-2, -5)$; across the $y$-axis it goes to $(2, 5)$.",
        "关于 $x$ 轴对称，点上下翻转，$y$ 坐标变成相反数，$x$ 坐标不变。关于 $y$ 轴对称，点左右翻转，$x$ 坐标变成相反数，$y$ 坐标不变。\n\n$(-2, 5)$ 关于 $x$ 轴的对称点是 $(-2, -5)$；关于 $y$ 轴的对称点是 $(2, 5)$。",
      ),
      generate(rng) {
        const x = nonZero(rng, 9);
        const y = nonZero(rng, 9);
        const acrossX = rng.bool();
        const image: [number, number] = acrossX ? [x, -y] : [-x, y];
        return pointProblem({
          prompt: t(
            `The point $(${x}, ${y})$ is reflected across the ${acrossX ? "$x$" : "$y$"}-axis. What are the coordinates of its image?`,
            `点 $(${x}, ${y})$ 关于 ${acrossX ? "$x$" : "$y$"} 轴对称，对称点的坐标是什么？`,
          ),
          answer: image,
          wrong: [acrossX ? [-x, y] : [x, -y], [-x, -y], [y, x]],
          solution: t(
            `Reflecting across the ${acrossX ? "$x$" : "$y$"}-axis keeps the ${acrossX ? "$x$" : "$y$"}-coordinate and changes the sign of the other: $${pointLatex(image)}$.`,
            `关于 ${acrossX ? "$x$" : "$y$"} 轴对称，${acrossX ? "$x$" : "$y$"} 坐标不变，另一个坐标变号：$${pointLatex(image)}$。`,
          ),
        });
      },
    },
    {
      id: "identifying-the-reflection",
      title: t("Which reflection?", "是哪种对称？"),
      explanation: t(
        "$(4, -1)$ and $(-4, -1)$ differ only in the sign of $x$, so they are reflections of each other across the $y$-axis.",
        "$(4, -1)$ 与 $(-4, -1)$ 只有 $x$ 坐标的符号不同，所以它们关于 $y$ 轴对称。",
      ),
      generate(rng) {
        const x = nonZero(rng, 9);
        let y: number;
        do y = nonZero(rng, 9);
        while (Math.abs(y) === Math.abs(x));
        const kind = rng.int(0, 2);
        const image = kind === 0 ? [x, -y] : kind === 1 ? [-x, y] : [-x, -y];
        const options = [
          t("Across the $x$-axis", "关于 $x$ 轴"),
          t("Across the $y$-axis", "关于 $y$ 轴"),
          t("Across both axes", "先后关于两条坐标轴"),
        ];
        const why = [
          t("Only the sign of $y$ changed, so it is a reflection across the $x$-axis.", "只有 $y$ 坐标变号，所以是关于 $x$ 轴对称。"),
          t("Only the sign of $x$ changed, so it is a reflection across the $y$-axis.", "只有 $x$ 坐标变号，所以是关于 $y$ 轴对称。"),
          t("Both signs changed, so it is a reflection across both axes.", "两个坐标都变号，所以是先后关于两条坐标轴对称。"),
        ];
        return choiceProblem({
          prompt: t(
            `Point $(${x}, ${y})$ is reflected to $${pointLatex(image)}$. Which reflection was used?`,
            `点 $(${x}, ${y})$ 经过对称变成 $${pointLatex(image)}$。用的是哪种对称？`,
          ),
          options,
          correct: kind,
          solution: why[kind]!,
        });
      },
    },
  ],
);

export const solvingProblemsInTheCoordinatePlane = topic(
  "solving-problems-in-the-coordinate-plane",
  t("Solving Problems in the Coordinate Plane", "解决坐标平面中的问题"),
  t(
    "Two points with the same y-coordinate are |x₁ − x₂| apart, and when they are on opposite sides of the y-axis the distance is the sum of their absolute values: (−3, 2) and (4, 2) are 3 + 4 = 7 units apart. Opposite corners of a rectangle with sides parallel to the axes share coordinates with the other corners.",
    "纵坐标相同的两点之间的距离是 |x₁ − x₂|；当它们在 y 轴两侧时，距离是两个横坐标绝对值之和：(−3, 2) 与 (4, 2) 相距 3 + 4 = 7 个单位。边与坐标轴平行的长方形，各顶点之间共用横坐标或纵坐标。",
  ),
  ["reflections-of-points-in-the-coordinate-plane", "interpreting-absolute-value"],
  ["6.NS.C.8"],
  [
    {
      id: "distance-on-a-coordinate-map",
      title: t("Distances on a map", "地图上的距离"),
      explanation: t(
        "The library is at $(-3, 2)$ and the park at $(4, 2)$. They are on the same horizontal line, $3$ units left and $4$ units right of the $y$-axis: $3 + 4 = 7$ units apart.",
        "图书馆在 $(-3, 2)$，公园在 $(4, 2)$。它们在同一条水平线上，分别在 $y$ 轴左边 $3$ 个单位和右边 $4$ 个单位：相距 $3 + 4 = 7$ 个单位。",
      ),
      generate(rng) {
        const a = -rng.int(1, 9);
        const b = rng.int(1, 9);
        const c = nonZero(rng, 9);
        const horizontal = rng.bool();
        const p = horizontal ? [a, c] : [c, a];
        const q = horizontal ? [b, c] : [c, b];
        const blocks = rng.int(1, 3) * 100;
        return numberProblem({
          prompt: t(
            `On a town map, the school is at $${pointLatex(p)}$ and the pool is at $${pointLatex(q)}$. Each unit on the map is ${blocks} meters. How many meters apart are the school and the pool?`,
            `在城镇地图上，学校在 $${pointLatex(p)}$，游泳池在 $${pointLatex(q)}$。地图上每个单位代表 ${blocks} 米。学校和游泳池相距多少米？`,
          ),
          answer: (b - a) * blocks,
          form: "integer",
          wrong: [Math.abs(b + a) * blocks, b - a, (b - a + 1) * blocks],
          solution: t(
            `The points share the ${horizontal ? "$y$" : "$x$"}-coordinate $${c}$, so the distance is $|${b} - (${a})| = ${Math.abs(a)} + ${b} = ${b - a}$ units, or $${b - a} \\times ${blocks} = ${(b - a) * blocks}$ meters.`,
            `两点的 ${horizontal ? "$y$" : "$x$"} 坐标都是 $${c}$，所以距离是 $|${b} - (${a})| = ${Math.abs(a)} + ${b} = ${b - a}$ 个单位，即 $${b - a} \\times ${blocks} = ${(b - a) * blocks}$ 米。`,
          ),
        });
      },
    },
    {
      id: "the-fourth-vertex-of-a-rectangle",
      title: t("Completing a rectangle", "补全长方形"),
      explanation: t(
        "A rectangle has vertices $(-2, 3)$, $(4, 3)$ and $(4, -1)$. The fourth vertex shares its $x$-coordinate with $(-2, 3)$ and its $y$-coordinate with $(4, -1)$: $(-2, -1)$.",
        "一个长方形的三个顶点是 $(-2, 3)$、$(4, 3)$、$(4, -1)$。第四个顶点的 $x$ 坐标与 $(-2, 3)$ 相同，$y$ 坐标与 $(4, -1)$ 相同：$(-2, -1)$。",
      ),
      generate(rng) {
        const x1 = -rng.int(1, 8);
        const x2 = rng.int(1, 8);
        const y1 = rng.int(1, 8);
        const y2 = -rng.int(1, 8);
        const corners: [number, number][] = rng.shuffle([
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
        ]);
        const [missing, ...given] = corners as [[number, number], ...[number, number][]];
        return pointProblem({
          prompt: t(
            `Three vertices of a rectangle with sides parallel to the axes are $${given.map((g) => pointLatex(g)).join("$, $")}$. What is the fourth vertex?`,
            `一个边与坐标轴平行的长方形有三个顶点 $${given.map((g) => pointLatex(g)).join("$、$")}$。第四个顶点是什么？`,
          ),
          answer: missing,
          wrong: [
            [-missing[0], missing[1]],
            [missing[0], -missing[1]],
            [missing[1], missing[0]],
          ],
          solution: t(
            `Each $x$-coordinate and each $y$-coordinate is used by exactly two vertices. Among the given vertices, $x = ${missing[0]}$ and $y = ${missing[1]}$ appear only once, so the fourth vertex is $${pointLatex(missing)}$.`,
            `每个 $x$ 坐标和每个 $y$ 坐标都恰好被两个顶点使用。已知顶点中 $x = ${missing[0]}$ 和 $y = ${missing[1]}$ 各只出现一次，所以第四个顶点是 $${pointLatex(missing)}$。`,
          ),
        });
      },
    },
  ],
);

/** grade6NumberSystemTopics lists the 6th grade topics on dividing fractions, decimal estimation and rational numbers. */
export const grade6NumberSystemTopics: readonly TopicDef[] = [
  dividingFractionsWordProblems,
  findingSideLengthsUsingFractionDivision,
  dividingMixedNumbersByWholeNumbers,
  dividingMixedNumbersByFractions,
  dividingWholeNumbersByMixedNumbers,
  dividingFractionsByMixedNumbers,
  dividingMixedNumbers,
  dividingMixedNumbersWordProblems,
  estimatingMultiDigitDivisionWithDecimals,
  interpretingNegativeNumbers,
  interpretingAbsoluteValue,
  naturalNumbersIntegersAndRationalNumbers,
  identifyingRationalNumbersOnANumberLine,
  comparingRationalNumbers,
  orderingRationalNumbers,
  theCartesianCoordinateSystem,
  rationalNumbersInTheCoordinatePlane,
  reflectionsOfPointsInTheCoordinatePlane,
  solvingProblemsInTheCoordinatePlane,
];
