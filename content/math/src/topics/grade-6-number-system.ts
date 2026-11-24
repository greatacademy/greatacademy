import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q, sketch, svgDocument } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";

import { mixedLatex, pointLatex } from "../problems.ts";
import type { MathWrong, Pair, Walk, Wrong } from "./early-grades-more-kit.ts";
import { fr, properFraction } from "./grade-4-fractions.ts";
import { chosen, chosenMath, drawn, lesson, located, type Off, placed, valued, withIntro } from "./grade-6-kit.ts";
import { equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

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

/** plain writes a positive rational number as figure text, like "2 1/4". */
function plain(q: Q): string {
  if (q.isInteger()) return `${q.n}`;
  const whole = q.n / q.d;
  return whole === 0n ? `${q.n}/${q.d}` : `${whole} ${q.n % q.d}/${q.d}`;
}

/** divisionWalk works a ÷ b in two labelled steps: write the numbers as fractions, then multiply by the reciprocal of the divisor. */
function divisionWalk(a: Q, b: Q): Walk[] {
  const v = a.div(b);
  const recip = Q.one.div(b);
  const raw = fr((a.n * recip.n).toString(), (a.d * recip.d).toString());
  const simplified = a.n * recip.n === v.n && a.d * recip.d === v.d;
  const tail = simplified && !v.isInteger() && v.cmp(Q.one) < 0 ? "" : ` = ${mq(v)}`;
  return [
    [
      ["Write as fractions", "化成分数"],
      ["Write mixed and whole numbers as fractions:", "把带分数和整数写成分数："],
      [`${mq(a)} \\div ${mq(b)} = ${improper(a)} \\div ${improper(b)}`],
    ],
    [
      ["Multiply by the reciprocal", "乘倒数"],
      [`Dividing by $${improper(b)}$ is multiplying by $${improper(recip)}$:`, `除以 $${improper(b)}$ 等于乘 $${improper(recip)}$：`],
      [`${improper(a)} \\times ${improper(recip)} = ${raw}${tail}`],
    ],
  ];
}

/** multiplyBack checks a quotient by multiplying it by the divisor to get the dividend back. */
function multiplyBack(a: Q, b: Q): Pair {
  const v = a.div(b);
  const line = `${mq(v)} \\times ${mq(b)} = ${improper(v)} \\times ${improper(b)} = ${mq(a)}`;
  return [`Multiply back: $${line}$, the number divided.`, `乘回去：$${line}$，正是被除数。`];
}

/** divisionOffs are the usual wrong quotients of a ÷ b, each with its reason. */
function divisionOffs(a: Q, b: Q): Off[] {
  const offs: Off[] = [
    [a.mul(b), "That multiplies by the divisor instead of by its reciprocal.", "这是乘除数，而不是乘它的倒数。"],
    [b.div(a), "That divides the other way round: the divisor became the number divided.", "这是反过来除了：把除数当成了被除数。"],
    [
      sloppyImproper(a).div(sloppyImproper(b)),
      "That adds the whole part to the numerator; to write a mixed number as a fraction, multiply the whole part by the denominator first.",
      "这是把整数部分直接加到分子上；带分数化成假分数时，要先用整数部分乘分母。",
    ],
  ];
  if (!a.isInteger() && a.cmp(Q.one) > 0) {
    const whole = Q.of(a.n / a.d);
    offs.push([
      whole.div(b).add(a.sub(whole)),
      "That divides only the whole part and keeps the fraction part as it is.",
      "这只除了整数部分，分数部分原样保留了。",
    ]);
  }
  if (!b.isInteger() && b.cmp(Q.one) > 0) {
    const whole = Q.of(b.n / b.d);
    const part = b.sub(whole);
    offs.push([
      a.mul(whole.add(Q.one.div(part))),
      "That flips only the fraction part of the divisor; write it as one fraction first, then flip it.",
      "这只把除数的分数部分颠倒了；要先化成一个假分数，再颠倒。",
    ]);
  }
  return offs;
}

/** divisionFigure draws a ÷ b as two bars of the same length: a, and a cut into pieces of size b, a part piece dashed. */
function divisionFigure(a: Q, b: Q): Figure {
  const v = a.div(b);
  const full = Number(v.n / v.d);
  const rest = a.sub(b.mul(Q.of(full)));
  const pieces =
    full === 0
      ? [
          { size: a.toNumber(), text: plain(a), lit: true },
          { size: b.sub(a).toNumber(), text: "", dashed: true },
        ]
      : [
          ...Array.from({ length: full }, () => ({ size: b.toNumber(), text: full <= 8 ? plain(b) : "", lit: true })),
          ...(rest.isZero() ? [] : [{ size: rest.toNumber(), text: "", dashed: true }]),
        ];
  return tapeFigure(
    [
      { total: plain(a), pieces: [{ size: a.toNumber(), text: "" }] },
      { ...(full === 0 && { total: plain(b) }), pieces },
    ],
    full === 0
      ? [
          `A bar of ${plain(a)} above a bar of ${plain(b)}: ${plain(a)} fills only part of one ${plain(b)}.`,
          `长条 ${plain(a)} 在上，长条 ${plain(b)} 在下：${plain(a)} 只占一个 ${plain(b)} 的一部分。`,
        ]
      : [
          `A bar of ${plain(a)} above the same length cut into pieces of ${plain(b)}${rest.isZero() ? "" : ", with a part piece dashed"}.`,
          `长条 ${plain(a)} 在上，下面同样长的长条切成每段 ${plain(b)}${rest.isZero() ? "" : "，不满一段的部分画成虚线"}。`,
        ],
  );
}

/** divided asks for a ÷ b in simplest form, works it with the reciprocal, checks by multiplying back, and answers the usual errors. */
function divided(a: Q, b: Q): Problem {
  const v = a.div(b);
  return valued(
    [`${divideIntro.en} $$${mq(a)} \\div ${mq(b)}$$`, `${divideIntro["zh-CN"]}$$${mq(a)} \\div ${mq(b)}$$`],
    v,
    divisionWalk(a, b),
    multiplyBack(a, b),
    divisionOffs(a, b),
    { form: form(v), figure: divisionFigure(a, b) },
  );
}

/** rateFigure draws an amount over a part of one unit, and the unknown amount over one whole unit. */
function rateFigure(amount: Q, part: Q): Figure {
  return tapeFigure(
    [
      { total: plain(amount), pieces: [{ size: part.toNumber(), text: plain(part), lit: true }] },
      { total: "?", pieces: [{ size: 1, text: "1", dashed: true }] },
    ],
    [
      `A bar for ${plain(part)} of a unit holding ${plain(amount)}, above a bar for one whole unit holding an unknown amount.`,
      `表示 ${plain(part)} 个单位的长条对应 ${plain(amount)}，下面表示 1 个整单位的长条对应的量未知。`,
    ],
  );
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

export const dividingFractionsWordProblems = withIntro(
  topic(
    "dividing-fractions-word-problems",
    t("Dividing Fractions: Word Problems", "分数除法应用题"),
    t(
      "Division answers “how many groups?” and “how much in one group?”. How many 3/8-cup servings are in 3/4 cup? 3/4 ÷ 3/8 = 2. If 3/4 of a mile takes 1/2 hour, the speed is 3/4 ÷ 1/2 = 1 1/2 miles per hour.",
      "除法回答“有几份”和“每份是多少”。3/4 杯里有几个 3/8 杯？3/4 ÷ 3/8 = 2。如果走 3/4 英里用 1/2 小时，速度是 3/4 ÷ 1/2 = 1 1/2 英里/小时。",
    ),
    ["dividing-fractions"],
    ["6.NS.A.1"],
    [
      lesson(
        "how-many-portions-of-a-fraction",
        ["How many portions?", "有几份？"],
        [
          [
            "“How many portions” means divide the total by the size of one portion; to divide by a fraction, multiply by its reciprocal. $\\frac{3}{4}$ cup in $\\frac{3}{8}$-cup servings: $\\frac{3}{4} \\div \\frac{3}{8} = \\frac{3}{4} \\times \\frac{8}{3} = 2$ servings.",
            "“能分成几份”就是用总量除以每份的量；除以一个分数，等于乘它的倒数。$\\frac{3}{4}$ 杯，每份 $\\frac{3}{8}$ 杯：$\\frac{3}{4} \\div \\frac{3}{8} = \\frac{3}{4} \\times \\frac{8}{3} = 2$ 份。",
          ],
          [
            "Two servings of $\\frac{3}{8}$ make $\\frac{6}{8} = \\frac{3}{4}$, the whole amount.",
            "两份 $\\frac{3}{8}$ 是 $\\frac{6}{8} = \\frac{3}{4}$，正是总量。",
          ],
          [
            "Multiplying $\\frac{3}{4} \\times \\frac{3}{8}$ makes the amount smaller; a count of portions needs division.",
            "$\\frac{3}{4} \\times \\frac{3}{8}$ 会让数变小；求份数要用除法。",
          ],
        ],
        (rng) => {
          for (;;) {
            const s = rng.pick(portionStories);
            const [p, q] = properFraction(rng, 12, 3);
            let k = rng.int(2, 6);
            while (p * k >= q * 2 && k > 2) k--;
            const each = qf(p, q);
            const total = each.mul(Q.of(k));
            if (total.cmp(Q.one) >= 0) continue;
            const [, times] = divisionWalk(total, each) as [Walk, Walk];
            return valued(
              [
                `${s.total(total.toLatex()).en} ${s.each(each.toLatex()).en} ${s.ask.en}`,
                `${s.total(total.toLatex())["zh-CN"]}${s.each(each.toLatex())["zh-CN"]}${s.ask["zh-CN"]}`,
              ],
              k,
              [
                [
                  ["Choose the operation", "列式"],
                  ["How many portions fit: divide the total by one portion:", "能分成几份：用总量除以每份的量："],
                  [`${total.toLatex()} \\div ${each.toLatex()}`],
                ],
                times,
              ],
              [
                `$${k}$ portions of $${each.toLatex()}$: $${k} \\times ${each.toLatex()} = ${total.toLatex()}$, the total.`,
                `$${k}$ 份 $${each.toLatex()}$：$${k} \\times ${each.toLatex()} = ${total.toLatex()}$，正是总量。`,
              ],
              [
                [total.mul(each), "That multiplies the amounts; a count of portions needs division.", "这是把两个量相乘；求份数要用除法。"],
                [each.div(total), "That divides one portion by the total, the wrong way round.", "这是用每份除以总量，除反了。"],
                [k + 1, "One portion too many: they would need more than the total.", "多算了一份：那样需要的量超过总量。"],
              ],
              { form: "integer", figure: divisionFigure(total, each) },
            );
          }
        },
        divisionFigure(Q.of(3, 4), Q.of(3, 8)),
      ),
      lesson(
        "how-much-in-one-unit",
        ["How much for one unit?", "每个单位是多少？"],
        [
          [
            "“How much for one unit” is a unit rate: divide the amount by the number of units, even when that number is a fraction. Dividing by a fraction less than $1$ gives a larger number. $\\frac{3}{4}$ mile in $\\frac{1}{2}$ hour: $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = 1\\frac{1}{2}$ miles per hour.",
            "“每一个单位是多少”是求单位量：用总量除以单位数，即使单位数是分数也一样。除以小于 $1$ 的分数，结果会变大。$\\frac{1}{2}$ 小时走 $\\frac{3}{4}$ 英里：$\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = 1\\frac{1}{2}$ 英里/小时。",
          ],
          [
            "Two half hours make one hour, so the distance doubles: $\\frac{3}{4} + \\frac{3}{4} = 1\\frac{1}{2}$.",
            "两个半小时是一小时，路程也翻倍：$\\frac{3}{4} + \\frac{3}{4} = 1\\frac{1}{2}$。",
          ],
          [
            "A whole hour covers more than half an hour, so the answer must be larger than $\\frac{3}{4}$, not smaller.",
            "一整小时比半小时走得多，所以答案一定比 $\\frac{3}{4}$ 大，而不是更小。",
          ],
        ],
        (rng) => {
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
          const [, times] = divisionWalk(dist, time) as [Walk, Walk];
          return valued(
            [kind.en, kind.zh],
            v,
            [
              [
                ["Choose the operation", "列式"],
                ["For one whole unit, divide the amount by the part it covers:", "求一整个单位的量，用数量除以它对应的部分："],
                [`${dist.toLatex()} \\div ${time.toLatex()}`],
              ],
              times,
            ],
            [
              `$${time.toLatex()}$ of $${mq(v)}$ is $${time.toLatex()} \\times ${improper(v)} = ${dist.toLatex()}$, the amount given.`,
              `$${mq(v)}$ 的 $${time.toLatex()}$ 是 $${time.toLatex()} \\times ${improper(v)} = ${dist.toLatex()}$，正是已知的量。`,
            ],
            [
              [
                dist.mul(time),
                "That multiplies, which gives an amount for even less than the part.",
                "这是相乘，得到的是比这部分还少的量。",
              ],
              [time.div(dist), "That divides the part by the amount, the wrong way round.", "这是用部分除以数量，除反了。"],
            ],
            { form: form(v), figure: rateFigure(dist, time) },
          );
        },
        rateFigure(Q.of(3, 4), Q.of(1, 2)),
      ),
    ],
  ),
  [
    "A baker has $\\frac{3}{4}$ cup of sugar, and each batch of cookies needs $\\frac{3}{8}$ cup. Before she starts, she wants to know how many batches she can bake.",
    "面包师有 $\\frac{3}{4}$ 杯糖，每炉饼干要用 $\\frac{3}{8}$ 杯。开始之前，她想知道能烤几炉。",
  ],
  [
    "Two batches use $\\frac{3}{8} + \\frac{3}{8} = \\frac{6}{8} = \\frac{3}{4}$ cup, so she can bake $2$.",
    "两炉要用 $\\frac{3}{8} + \\frac{3}{8} = \\frac{6}{8} = \\frac{3}{4}$ 杯，所以能烤 $2$ 炉。",
  ],
  [
    "use fraction division to find how many portions fit and how much goes with one whole unit.",
    "用分数除法求能分成几份，以及一整个单位对应多少。",
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

export const findingSideLengthsUsingFractionDivision = withIntro(
  topic(
    "finding-side-lengths-using-fraction-division",
    t("Finding Side Lengths Using Fraction Division", "用分数除法求边长"),
    t(
      "The area of a rectangle is length × width, so a missing side is the area divided by the known side. A rectangle with area 3/4 square foot and width 1/2 foot has length 3/4 ÷ 1/2 = 1 1/2 feet.",
      "长方形的面积 = 长 × 宽，所以未知边长 = 面积 ÷ 已知边长。面积为 3/4 平方英尺、宽为 1/2 英尺的长方形，长是 3/4 ÷ 1/2 = 1 1/2 英尺。",
    ),
    ["dividing-fractions", "finding-areas-using-fraction-multiplication"],
    ["6.NS.A.1"],
    [
      lesson(
        "side-from-a-fractional-area",
        ["Fractional area and side", "面积和边长都是分数"],
        [
          [
            "The area of a rectangle is length times width, so a missing side is the area divided by the known side. Area $\\frac{3}{4}$ square foot, width $\\frac{1}{2}$ foot: length $= \\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = 1\\frac{1}{2}$ feet.",
            "长方形的面积等于长乘宽，所以未知的边长等于面积除以已知的边长。面积 $\\frac{3}{4}$ 平方英尺，宽 $\\frac{1}{2}$ 英尺：长 $= \\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = 1\\frac{1}{2}$ 英尺。",
          ],
          [
            "$1\\frac{1}{2} \\times \\frac{1}{2} = \\frac{3}{2} \\times \\frac{1}{2} = \\frac{3}{4}$, the area.",
            "$1\\frac{1}{2} \\times \\frac{1}{2} = \\frac{3}{2} \\times \\frac{1}{2} = \\frac{3}{4}$，正是面积。",
          ],
          ["Multiplying the area by the width gives a smaller number, not the length.", "用面积乘宽得到的是更小的数，不是长。"],
        ],
        (rng) => {
          const [a, b] = properFraction(rng, 8, 2);
          const [c, d] = properFraction(rng, 8, 2);
          const width = qf(a, b);
          const side = qf(c, d);
          const area = width.mul(side);
          const [, times] = divisionWalk(area, width) as [Walk, Walk];
          return valued(
            [
              `A rectangle has an area of $${area.toLatex()}$ square foot and a width of $${width.toLatex()}$ foot. What is its length, in feet?`,
              `一个长方形的面积是 $${area.toLatex()}$ 平方英尺，宽是 $${width.toLatex()}$ 英尺。它的长是多少英尺？`,
            ],
            side,
            [
              [
                ["Choose the operation", "列式"],
                ["Length is the area divided by the width:", "长等于面积除以宽："],
                [`${area.toLatex()} \\div ${width.toLatex()}`],
              ],
              times,
            ],
            [
              `Length times width: $${side.toLatex()} \\times ${width.toLatex()} = ${area.toLatex()}$, the area.`,
              `长乘宽：$${side.toLatex()} \\times ${width.toLatex()} = ${area.toLatex()}$，正是面积。`,
            ],
            [
              [area.mul(width), "That multiplies the area by the width instead of dividing.", "这是用面积乘宽，而不是除以宽。"],
              [width.div(area), "That divides the width by the area, the wrong way round.", "这是用宽除以面积，除反了。"],
              [area.sub(width).abs(), "That subtracts; a missing side of a rectangle needs division.", "这是相减；求长方形的边要用除法。"],
            ],
            { form: form(side), figure: rectangleFigure(`${a}/${b} ft`, `${area.n}/${area.d} ft²`) },
          );
        },
        drawn(gradeDrawings3["finding-side-lengths-using-fraction-division#side-from-a-fractional-area"]),
      ),
      lesson(
        "side-from-a-whole-area",
        ["Whole-number area", "面积是整数"],
        [
          [
            "Divide the area by the known side, multiplying by its reciprocal. When the known side is less than $1$, the other side is longer than the area's number. Area $6$ square feet, width $\\frac{3}{4}$ foot: length $= 6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ feet.",
            "用面积除以已知的边长，即乘它的倒数。已知边长小于 $1$ 时，求出的边长比面积的数值还大。面积 $6$ 平方英尺，宽 $\\frac{3}{4}$ 英尺：长 $= 6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ 英尺。",
          ],
          ["$8 \\times \\frac{3}{4} = 6$, the area.", "$8 \\times \\frac{3}{4} = 6$，正是面积。"],
          [
            "A side less than $1$ makes the other side longer than $6$: $6 \\times \\frac{3}{4} = 4\\frac{1}{2}$ is too short.",
            "一边小于 $1$，另一边就比 $6$ 长：$6 \\times \\frac{3}{4} = 4\\frac{1}{2}$ 太短了。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [a, b] = properFraction(rng, 8, 2);
            const width = qf(a, b);
            const length = rng.int(2, 12) * a;
            const area = width.mul(Q.of(length));
            if (!area.isInteger()) continue;
            return valued(
              [
                `A rectangular garden has an area of $${area.toString()}$ square meters and a width of $${width.toLatex()}$ meter. What is its length, in meters?`,
                `一块长方形花园的面积是 $${area.toString()}$ 平方米，宽是 $${width.toLatex()}$ 米。它的长是多少米？`,
              ],
              length,
              [
                [
                  ["Choose the operation", "列式"],
                  ["Length is the area divided by the width:", "长等于面积除以宽："],
                  [`${area.toString()} \\div ${width.toLatex()}`],
                ],
                [
                  ["Multiply by the reciprocal", "乘倒数"],
                  [`Dividing by $${width.toLatex()}$ is multiplying by $${fr(b, a)}$:`, `除以 $${width.toLatex()}$ 等于乘 $${fr(b, a)}$：`],
                  [`${area.toString()} \\times ${fr(b, a)} = ${length}`],
                ],
              ],
              [
                `$${length} \\times ${width.toLatex()} = ${area.toString()}$, the area.`,
                `$${length} \\times ${width.toLatex()} = ${area.toString()}$，正是面积。`,
              ],
              [
                [area.mul(width), "That multiplies the area by the width instead of dividing.", "这是用面积乘宽，而不是除以宽。"],
                [width.div(area), "That divides the width by the area, the wrong way round.", "这是用宽除以面积，除反了。"],
                [area.sub(width), "That subtracts; a missing side of a rectangle needs division.", "这是相减；求长方形的边要用除法。"],
              ],
              { form: "integer", figure: rectangleFigure(`${a}/${b} m`, `${area.toString()} m²`) },
            );
          }
        },
        rectangleFigure("3/4 ft", "6 ft²"),
      ),
    ],
  ),
  [
    "A garden bed must cover $\\frac{3}{4}$ square foot, and the space beside the fence lets it be only $\\frac{1}{2}$ foot wide. How long must the bed be?",
    "一块花坛的面积要有 $\\frac{3}{4}$ 平方英尺，篱笆边的空地只能让它宽 $\\frac{1}{2}$ 英尺。花坛要多长？",
  ],
  [
    "$1\\frac{1}{2} \\times \\frac{1}{2} = \\frac{3}{4}$, so a bed $1\\frac{1}{2}$ feet long works.",
    "$1\\frac{1}{2} \\times \\frac{1}{2} = \\frac{3}{4}$，所以花坛长 $1\\frac{1}{2}$ 英尺正好。",
  ],
  ["find a missing side of a rectangle by dividing its area by the known side.", "用面积除以已知的边，求长方形未知的边。"],
);

// ---------------------------------------------------------------------------
// Dividing mixed numbers

export const dividingMixedNumbersByWholeNumbers = withIntro(
  topic(
    "dividing-mixed-numbers-by-whole-numbers",
    t("Dividing Mixed Numbers by Whole Numbers", "带分数除以整数"),
    t(
      "Write the mixed number as an improper fraction, then multiply by the reciprocal of the whole number: 2 1/4 ÷ 3 = 9/4 × 1/3 = 3/4.",
      "先把带分数化成假分数，再乘整数的倒数：2 1/4 ÷ 3 = 9/4 × 1/3 = 3/4。",
    ),
    ["dividing-fractions-by-whole-numbers"],
    ["6.NS.A.1"],
    [
      lesson(
        "mixed-by-whole-fraction-result",
        ["Results less than 1", "结果小于 1"],
        [
          [
            "Write the mixed number as an improper fraction, then multiply by the reciprocal of the whole number, which is $1$ over it, and simplify. $2\\frac{1}{4} \\div 3 = \\frac{9}{4} \\times \\frac{1}{3} = \\frac{9}{12} = \\frac{3}{4}$.",
            "先把带分数化成假分数，再乘整数的倒数，即 $1$ 分之这个整数，最后约分。$2\\frac{1}{4} \\div 3 = \\frac{9}{4} \\times \\frac{1}{3} = \\frac{9}{12} = \\frac{3}{4}$。",
          ],
          [
            "$3 \\times \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$, the number divided.",
            "$3 \\times \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$，正是被除数。",
          ],
          [
            "$2\\frac{1}{4}$ is $\\frac{9}{4}$, not $\\frac{3}{4}$: multiply the whole part by the denominator before adding.",
            "$2\\frac{1}{4}$ 是 $\\frac{9}{4}$，不是 $\\frac{3}{4}$：先用整数部分乘分母，再加分子。",
          ],
        ],
        (rng) => {
          const a = mixedNumber(rng, 3, 6);
          const n = rng.int(Math.floor(a.toNumber()) + 1, 9);
          return divided(a, Q.of(n));
        },
        divisionFigure(Q.of(9, 4), Q.of(3)),
      ),
      lesson(
        "mixed-by-whole-mixed-result",
        ["Results greater than 1", "结果大于 1"],
        [
          [
            "Change the mixed number to an improper fraction, multiply by the reciprocal of the whole number, and write an improper result as a mixed number. $7\\frac{1}{2} \\div 2 = \\frac{15}{2} \\times \\frac{1}{2} = \\frac{15}{4} = 3\\frac{3}{4}$.",
            "把带分数化成假分数，乘整数的倒数，结果是假分数时化成带分数。$7\\frac{1}{2} \\div 2 = \\frac{15}{2} \\times \\frac{1}{2} = \\frac{15}{4} = 3\\frac{3}{4}$。",
          ],
          [
            "$3\\frac{3}{4} + 3\\frac{3}{4} = 6\\frac{6}{4} = 7\\frac{1}{2}$.",
            "$3\\frac{3}{4} + 3\\frac{3}{4} = 6\\frac{6}{4} = 7\\frac{1}{2}$。",
          ],
          [
            "Dividing only the whole part, $7 \\div 2 = 3\\frac{1}{2}$, and keeping the $\\frac{1}{2}$ gives $4$, which is too big.",
            "只用整数部分除以 $2$ 得 $3\\frac{1}{2}$，再保留 $\\frac{1}{2}$ 得 $4$，太大了。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(2, 4);
            const a = qf(rng.int(n + 1, 9) * 4 + rng.pick([1, 3]), 4);
            if (a.div(Q.of(n)).isInteger()) continue;
            return divided(rng.bool() ? a : mixedNumber(rng, 9, 6).add(Q.of(n)), Q.of(n));
          }
        },
        divisionFigure(Q.of(15, 2), Q.of(2)),
      ),
    ],
  ),
  [
    "Three friends share $2\\frac{1}{4}$ pizzas equally. Each gets less than one whole pizza, but how much exactly?",
    "三个好朋友平分 $2\\frac{1}{4}$ 个比萨。每人分到的不到一整个，到底是多少呢？",
  ],
  [
    "$3 \\times \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$, so each gets $\\frac{3}{4}$ of a pizza.",
    "$3 \\times \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$，所以每人分到 $\\frac{3}{4}$ 个比萨。",
  ],
  [
    "divide a mixed number by a whole number, with results less than and greater than $1$.",
    "带分数除以整数，结果有小于 $1$ 的，也有大于 $1$ 的。",
  ],
);

export const dividingMixedNumbersByFractions = withIntro(
  topic(
    "dividing-mixed-numbers-by-fractions",
    t("Dividing Mixed Numbers by Fractions", "带分数除以分数"),
    t(
      "Write the mixed number as an improper fraction and multiply by the reciprocal of the fraction: 2 1/4 ÷ 3/4 = 9/4 × 4/3 = 3.",
      "把带分数化成假分数，再乘分数的倒数：2 1/4 ÷ 3/4 = 9/4 × 4/3 = 3。",
    ),
    ["dividing-fractions", "converting-mixed-numbers-to-improper-fractions"],
    ["6.NS.A.1"],
    [
      lesson(
        "mixed-by-fraction-whole-result",
        ["Whole-number results", "结果是整数"],
        [
          [
            "Write the mixed number as an improper fraction, then multiply by the reciprocal of the fraction; the answer counts how many of the fraction fit into the mixed number. $2\\frac{1}{4} \\div \\frac{3}{4} = \\frac{9}{4} \\times \\frac{4}{3} = 3$: there are $3$ three-quarters in $2\\frac{1}{4}$.",
            "先把带分数化成假分数，再乘除数的倒数；结果表示带分数里有几个这样的分数。$2\\frac{1}{4} \\div \\frac{3}{4} = \\frac{9}{4} \\times \\frac{4}{3} = 3$：$2\\frac{1}{4}$ 里有 $3$ 个 $\\frac{3}{4}$。",
          ],
          [
            "$\\frac{3}{4} + \\frac{3}{4} + \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$.",
            "$\\frac{3}{4} + \\frac{3}{4} + \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$。",
          ],
          [
            "Flip the divisor $\\frac{3}{4}$, not the mixed number: $\\frac{4}{9} \\times \\frac{3}{4}$ gives $\\frac{1}{3}$.",
            "要颠倒除数 $\\frac{3}{4}$，不是带分数：$\\frac{4}{9} \\times \\frac{3}{4}$ 得 $\\frac{1}{3}$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [p, q] = properFraction(rng, 8, 2);
            const k = rng.int(2, 9);
            const a = qf(p * k, q);
            if (a.isInteger() || a.cmp(Q.one) < 0) continue;
            return divided(a, qf(p, q));
          }
        },
        divisionFigure(Q.of(9, 4), Q.of(3, 4)),
      ),
      lesson(
        "mixed-by-fraction-any-result",
        ["Any result", "一般情况"],
        [
          [
            "Change the mixed number to an improper fraction, multiply by the reciprocal of the divisor, then simplify and write the answer as a mixed number. $3\\frac{1}{3} \\div \\frac{4}{5} = \\frac{10}{3} \\times \\frac{5}{4} = \\frac{50}{12} = 4\\frac{1}{6}$.",
            "把带分数化成假分数，乘除数的倒数，再约分并写成带分数。$3\\frac{1}{3} \\div \\frac{4}{5} = \\frac{10}{3} \\times \\frac{5}{4} = \\frac{50}{12} = 4\\frac{1}{6}$。",
          ],
          [
            "$4\\frac{1}{6} \\times \\frac{4}{5} = \\frac{25}{6} \\times \\frac{4}{5} = \\frac{100}{30} = 3\\frac{1}{3}$.",
            "$4\\frac{1}{6} \\times \\frac{4}{5} = \\frac{25}{6} \\times \\frac{4}{5} = \\frac{100}{30} = 3\\frac{1}{3}$。",
          ],
          [
            "$\\frac{50}{12}$ is not finished: simplify it to $\\frac{25}{6} = 4\\frac{1}{6}$.",
            "$\\frac{50}{12}$ 还没化简完：要化成 $\\frac{25}{6} = 4\\frac{1}{6}$。",
          ],
        ],
        (rng) => {
          const a = mixedNumber(rng, 5, 8);
          const [p, q] = properFraction(rng, 9, 2);
          return divided(a, qf(p, q));
        },
        divisionFigure(Q.of(10, 3), Q.of(4, 5)),
      ),
    ],
  ),
  [
    "A bag holds $2\\frac{1}{4}$ pounds of rice, and a scoop holds $\\frac{3}{4}$ pound. How many full scoops are in the bag?",
    "一袋米有 $2\\frac{1}{4}$ 磅，一勺能舀 $\\frac{3}{4}$ 磅。这袋米能舀几满勺？",
  ],
  [
    "$\\frac{3}{4} + \\frac{3}{4} + \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$, so exactly $3$ scoops.",
    "$\\frac{3}{4} + \\frac{3}{4} + \\frac{3}{4} = \\frac{9}{4} = 2\\frac{1}{4}$，所以正好 $3$ 勺。",
  ],
  ["divide a mixed number by a fraction, with whole and mixed results.", "带分数除以分数，结果有整数，也有带分数。"],
);

export const dividingWholeNumbersByMixedNumbers = withIntro(
  topic(
    "dividing-whole-numbers-by-mixed-numbers",
    t("Dividing Whole Numbers by Mixed Numbers", "整数除以带分数"),
    t(
      "Write the mixed number as an improper fraction and multiply the whole number by its reciprocal: 10 ÷ 2 1/2 = 10 × 2/5 = 4.",
      "把带分数化成假分数，用整数乘它的倒数：10 ÷ 2 1/2 = 10 × 2/5 = 4。",
    ),
    ["dividing-whole-numbers-by-fractions"],
    ["6.NS.A.1"],
    [
      lesson(
        "whole-by-mixed-whole-result",
        ["Whole-number results", "结果是整数"],
        [
          [
            "To divide by a mixed number, first write it as an improper fraction, then multiply by its reciprocal. $10 \\div 2\\frac{1}{2} = 10 \\div \\frac{5}{2} = 10 \\times \\frac{2}{5} = 4$.",
            "除以带分数时，先把带分数化成假分数，再乘它的倒数。$10 \\div 2\\frac{1}{2} = 10 \\div \\frac{5}{2} = 10 \\times \\frac{2}{5} = 4$。",
          ],
          ["$4 \\times 2\\frac{1}{2} = 8 + 2 = 10$.", "$4 \\times 2\\frac{1}{2} = 8 + 2 = 10$。"],
          [
            "Flipping only the fraction part, $2\\frac{2}{1}$, is not the reciprocal: write $\\frac{5}{2}$ first, then flip it to $\\frac{2}{5}$.",
            "只颠倒分数部分得 $2\\frac{2}{1}$，这不是倒数：要先写成 $\\frac{5}{2}$，再颠倒成 $\\frac{2}{5}$。",
          ],
        ],
        (rng) => {
          const b = mixedNumber(rng, 3, 5);
          const k = rng.int(2, 8);
          const a = b.mul(Q.of(k));
          return divided(a.isInteger() ? a : b.mul(Q.of(k * Number(b.d))), b);
        },
        divisionFigure(Q.of(10), Q.of(5, 2)),
      ),
      lesson(
        "whole-by-mixed-any-result",
        ["Any result", "一般情况"],
        [
          [
            "Write the mixed number as an improper fraction, multiply by its reciprocal, and change an improper answer to a mixed number. $5 \\div 1\\frac{1}{3} = 5 \\div \\frac{4}{3} = 5 \\times \\frac{3}{4} = \\frac{15}{4} = 3\\frac{3}{4}$.",
            "把带分数化成假分数，乘它的倒数，结果是假分数时化成带分数。$5 \\div 1\\frac{1}{3} = 5 \\div \\frac{4}{3} = 5 \\times \\frac{3}{4} = \\frac{15}{4} = 3\\frac{3}{4}$。",
          ],
          [
            "$3\\frac{3}{4} \\times 1\\frac{1}{3} = \\frac{15}{4} \\times \\frac{4}{3} = 5$.",
            "$3\\frac{3}{4} \\times 1\\frac{1}{3} = \\frac{15}{4} \\times \\frac{4}{3} = 5$。",
          ],
          [
            "The divisor is more than $1$, so the answer is less than $5$; a bigger answer means the division went the wrong way.",
            "除数大于 $1$，所以结果小于 $5$；如果结果更大，说明除反了。",
          ],
        ],
        (rng) => divided(Q.of(rng.int(2, 15)), mixedNumber(rng, 3, 8)),
        divisionFigure(Q.of(5), Q.of(4, 3)),
      ),
    ],
  ),
  [
    "A rope $10$ meters long is cut into pieces $2\\frac{1}{2}$ meters long for a class game. How many pieces will there be?",
    "一根 $10$ 米长的绳子剪成每段 $2\\frac{1}{2}$ 米，用来做班级游戏。能剪成几段？",
  ],
  ["$2\\frac{1}{2}$ four times is $5 + 5 = 10$, so there are $4$ pieces.", "$4$ 个 $2\\frac{1}{2}$ 是 $5 + 5 = 10$，所以能剪 $4$ 段。"],
  ["divide a whole number by a mixed number, with whole and mixed results.", "整数除以带分数，结果有整数，也有带分数。"],
);

export const dividingFractionsByMixedNumbers = withIntro(
  topic(
    "dividing-fractions-by-mixed-numbers",
    t("Dividing Fractions by Mixed Numbers", "分数除以带分数"),
    t(
      "Write the mixed number as an improper fraction and multiply by its reciprocal. Dividing by a number greater than 1 gives a smaller result: 3/4 ÷ 1 1/2 = 3/4 × 2/3 = 1/2.",
      "把带分数化成假分数，再乘它的倒数。除以一个大于 1 的数，结果变小：3/4 ÷ 1 1/2 = 3/4 × 2/3 = 1/2。",
    ),
    ["dividing-fractions", "converting-mixed-numbers-to-improper-fractions"],
    ["6.NS.A.1"],
    [
      lesson(
        "fraction-by-mixed",
        ["Dividing a fraction by a mixed number", "分数除以带分数"],
        [
          [
            "Change the mixed-number divisor to an improper fraction, then multiply by its reciprocal and simplify; since the divisor is greater than $1$, the answer is smaller than the fraction you started with. $\\frac{3}{4} \\div 1\\frac{1}{2} = \\frac{3}{4} \\div \\frac{3}{2} = \\frac{3}{4} \\times \\frac{2}{3} = \\frac{1}{2}$.",
            "先把作除数的带分数化成假分数，再乘它的倒数并约分；因为除数大于 $1$，结果比原来的分数小。$\\frac{3}{4} \\div 1\\frac{1}{2} = \\frac{3}{4} \\div \\frac{3}{2} = \\frac{3}{4} \\times \\frac{2}{3} = \\frac{1}{2}$。",
          ],
          [
            "$\\frac{1}{2} \\times 1\\frac{1}{2} = \\frac{1}{2} \\times \\frac{3}{2} = \\frac{3}{4}$.",
            "$\\frac{1}{2} \\times 1\\frac{1}{2} = \\frac{1}{2} \\times \\frac{3}{2} = \\frac{3}{4}$。",
          ],
          [
            "The reciprocal of $1\\frac{1}{2}$ is $\\frac{2}{3}$, not $1\\frac{2}{1}$: write it as $\\frac{3}{2}$ before flipping.",
            "$1\\frac{1}{2}$ 的倒数是 $\\frac{2}{3}$，不是 $1\\frac{2}{1}$：先写成 $\\frac{3}{2}$ 再颠倒。",
          ],
        ],
        (rng) => {
          const [p, q] = properFraction(rng, 10, 2);
          return divided(qf(p, q), mixedNumber(rng, 4, 6));
        },
        divisionFigure(Q.of(3, 4), Q.of(3, 2)),
      ),
      lesson(
        "estimating-the-size-of-the-quotient",
        ["Is the quotient less than the dividend?", "商比被除数小吗？"],
        [
          [
            "Dividing by a number greater than $1$ makes the result smaller, and dividing by a number less than $1$ makes it larger. So $\\frac{5}{6} \\div 2\\frac{1}{3} < \\frac{5}{6}$, while $\\frac{5}{6} \\div \\frac{1}{3} > \\frac{5}{6}$.",
            "除以大于 $1$ 的数，结果变小；除以小于 $1$ 的数，结果变大。所以 $\\frac{5}{6} \\div 2\\frac{1}{3} < \\frac{5}{6}$，而 $\\frac{5}{6} \\div \\frac{1}{3} > \\frac{5}{6}$。",
          ],
          [
            "$\\frac{5}{6} \\div \\frac{1}{3} = \\frac{5}{6} \\times 3 = 2\\frac{1}{2}$, which is indeed larger than $\\frac{5}{6}$.",
            "$\\frac{5}{6} \\div \\frac{1}{3} = \\frac{5}{6} \\times 3 = 2\\frac{1}{2}$，确实比 $\\frac{5}{6}$ 大。",
          ],
          [
            "Division does not always make a number smaller: dividing by a number less than $1$ makes it larger.",
            "除法不一定让数变小：除以小于 $1$ 的数会让它变大。",
          ],
        ],
        (rng) => {
          const [p, q] = properFraction(rng, 10, 2);
          const a = qf(p, q);
          const bigger = rng.bool();
          const divisor = bigger ? mixedNumber(rng, 3, 6) : (([r, s]) => qf(r, s))(properFraction(rng, 9, 2));
          const v = a.div(divisor);
          const sym = bigger ? "<" : ">";
          const flip = bigger ? ">" : "<";
          return chosenMath(
            rng,
            [
              `Which symbol makes this true? $$${a.toLatex()} \\div ${mq(divisor)} \\ \\square \\ ${a.toLatex()}$$`,
              `方框中应填哪个符号？$$${a.toLatex()} \\div ${mq(divisor)} \\ \\square \\ ${a.toLatex()}$$`,
            ],
            sym,
            [
              [
                flip,
                `That treats the divisor as ${bigger ? "less" : "greater"} than $1$; it is ${bigger ? "greater" : "less"}.`,
                `这把除数当成了${bigger ? "小" : "大"}于 $1$ 的数；它其实${bigger ? "大" : "小"}于 $1$。`,
              ],
              ["=", "Only dividing by $1$ leaves a number unchanged.", "只有除以 $1$ 才不改变一个数。"],
            ],
            [
              [
                ["Compare the divisor with 1", "把除数和 1 比较"],
                [`$${mq(divisor)}$ is ${bigger ? "greater" : "less"} than $1$.`, `$${mq(divisor)}$ ${bigger ? "大" : "小"}于 $1$。`],
              ],
              [
                ["Decide", "判断"],
                bigger
                  ? ["Dividing by a number greater than $1$ makes the result smaller:", "除以大于 $1$ 的数，结果变小："]
                  : ["Dividing by a number less than $1$ makes the result larger:", "除以小于 $1$ 的数，结果变大："],
                [`${a.toLatex()} \\div ${mq(divisor)} ${sym} ${a.toLatex()}`],
              ],
            ],
            [
              `Work it out: $${a.toLatex()} \\div ${mq(divisor)} = ${mq(v)} ${sym} ${a.toLatex()}$.`,
              `算一算：$${a.toLatex()} \\div ${mq(divisor)} = ${mq(v)} ${sym} ${a.toLatex()}$。`,
            ],
            divisionFigure(a, divisor),
          );
        },
        divisionFigure(Q.of(5, 6), Q.of(7, 3)),
      ),
    ],
  ),
  [
    "A jug holds $\\frac{3}{4}$ liter of water, and a bottle holds $1\\frac{1}{2}$ liters. Pouring the jug into the bottle fills only part of it. Which part?",
    "一个壶装 $\\frac{3}{4}$ 升水，一个瓶子能装 $1\\frac{1}{2}$ 升。把壶里的水倒进瓶子，只能装满一部分。是几分之几？",
  ],
  [
    "Half of $1\\frac{1}{2}$ is $\\frac{3}{4}$, so the jug fills $\\frac{1}{2}$ of the bottle.",
    "$1\\frac{1}{2}$ 的一半是 $\\frac{3}{4}$，所以壶里的水能装满瓶子的 $\\frac{1}{2}$。",
  ],
  [
    "divide a fraction by a mixed number, and tell whether a quotient is smaller or larger than the number divided.",
    "分数除以带分数，并判断商比被除数大还是小。",
  ],
);

export const dividingMixedNumbers = withIntro(
  topic(
    "dividing-mixed-numbers",
    t("Dividing Mixed Numbers", "带分数除以带分数"),
    t(
      "Write both mixed numbers as improper fractions, then multiply the first by the reciprocal of the second: 3 3/4 ÷ 1 1/4 = 15/4 × 4/5 = 3.",
      "把两个带分数都化成假分数，再用第一个乘第二个的倒数：3 3/4 ÷ 1 1/4 = 15/4 × 4/5 = 3。",
    ),
    ["dividing-mixed-numbers-by-fractions"],
    ["6.NS.A.1"],
    [
      lesson(
        "mixed-by-mixed-whole-result",
        ["Whole-number results", "结果是整数"],
        [
          [
            "To divide two mixed numbers, write both as improper fractions, then multiply the first by the reciprocal of the second. $3\\frac{3}{4} \\div 1\\frac{1}{4} = \\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$.",
            "两个带分数相除，先都化成假分数，再用第一个数乘第二个数的倒数。$3\\frac{3}{4} \\div 1\\frac{1}{4} = \\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$。",
          ],
          [
            "$3 \\times 1\\frac{1}{4} = 3 + \\frac{3}{4} = 3\\frac{3}{4}$.",
            "$3 \\times 1\\frac{1}{4} = 3 + \\frac{3}{4} = 3\\frac{3}{4}$。",
          ],
          [
            "Dividing whole parts and fraction parts separately, $3 \\div 1$ and $\\frac{3}{4} \\div \\frac{1}{4}$, gives $6$, which is wrong.",
            "整数部分和分数部分分别相除，$3 \\div 1$ 和 $\\frac{3}{4} \\div \\frac{1}{4}$，得 $6$，这是错的。",
          ],
        ],
        (rng) => {
          for (;;) {
            const b = mixedNumber(rng, 2, 6);
            const k = rng.int(2, 6);
            const a = b.mul(Q.of(k));
            if (a.isInteger()) continue;
            return divided(a, b);
          }
        },
        divisionFigure(Q.of(15, 4), Q.of(5, 4)),
      ),
      lesson(
        "mixed-by-mixed-any-result",
        ["Any result", "一般情况"],
        [
          [
            "Write both as improper fractions, multiply by the reciprocal of the divisor, and write the result as a mixed number in simplest form. $2\\frac{1}{2} \\div 1\\frac{1}{3} = \\frac{5}{2} \\times \\frac{3}{4} = \\frac{15}{8} = 1\\frac{7}{8}$.",
            "两个都化成假分数，乘除数的倒数，结果写成最简带分数。$2\\frac{1}{2} \\div 1\\frac{1}{3} = \\frac{5}{2} \\times \\frac{3}{4} = \\frac{15}{8} = 1\\frac{7}{8}$。",
          ],
          [
            "$1\\frac{7}{8} \\times 1\\frac{1}{3} = \\frac{15}{8} \\times \\frac{4}{3} = \\frac{60}{24} = 2\\frac{1}{2}$.",
            "$1\\frac{7}{8} \\times 1\\frac{1}{3} = \\frac{15}{8} \\times \\frac{4}{3} = \\frac{60}{24} = 2\\frac{1}{2}$。",
          ],
          [
            "Do not divide the whole parts and the fraction parts separately: change both to improper fractions first.",
            "不能把整数部分和分数部分分别相除：要先都化成假分数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = mixedNumber(rng, 6, 6);
            const b = mixedNumber(rng, 3, 6);
            if (a.eq(b)) continue;
            return divided(a, b);
          }
        },
        divisionFigure(Q.of(5, 2), Q.of(4, 3)),
      ),
    ],
  ),
  [
    "A board $3\\frac{3}{4}$ meters long is cut into shelves $1\\frac{1}{4}$ meters long. How many shelves does it make?",
    "一块 $3\\frac{3}{4}$ 米长的木板，锯成每块 $1\\frac{1}{4}$ 米长的搁板。能锯成几块？",
  ],
  ["$1\\frac{1}{4}$ three times is $3\\frac{3}{4}$, so $3$ shelves.", "$3$ 个 $1\\frac{1}{4}$ 是 $3\\frac{3}{4}$，所以能锯 $3$ 块。"],
  ["divide a mixed number by a mixed number, with whole and mixed results.", "带分数除以带分数，结果有整数，也有带分数。"],
);

export const dividingMixedNumbersWordProblems = withIntro(
  topic(
    "dividing-mixed-numbers-word-problems",
    t("Dividing Mixed Numbers: Word Problems", "带分数除法应用题"),
    t(
      "Mixed-number division answers the same questions as any division: how many 1 1/2-cup servings are in 7 1/2 cups (7 1/2 ÷ 1 1/2 = 5), or how far someone walks in one hour if 3 3/4 miles take 1 1/4 hours (3 3/4 ÷ 1 1/4 = 3 miles per hour).",
      "带分数除法解决的问题和一般除法一样：7 1/2 杯里有几份 1 1/2 杯（7 1/2 ÷ 1 1/2 = 5），或者 1 1/4 小时走了 3 3/4 英里，每小时走多远（3 3/4 ÷ 1 1/4 = 3 英里/小时）。",
    ),
    ["dividing-mixed-numbers", "dividing-fractions-word-problems"],
    ["6.NS.A.1"],
    [
      lesson(
        "servings-of-a-mixed-size",
        ["How many servings?", "有几份？"],
        [
          [
            "To find how many servings fit, divide the total by the size of one serving: change both mixed numbers to improper fractions and multiply by the reciprocal. $7\\frac{1}{2}$ cups in $1\\frac{1}{2}$-cup servings: $\\frac{15}{2} \\div \\frac{3}{2} = \\frac{15}{2} \\times \\frac{2}{3} = 5$ servings.",
            "求能分成几份，用总量除以每份的量：把两个带分数都化成假分数，再乘除数的倒数。$7\\frac{1}{2}$ 杯，每份 $1\\frac{1}{2}$ 杯：$\\frac{15}{2} \\div \\frac{3}{2} = \\frac{15}{2} \\times \\frac{2}{3} = 5$ 份。",
          ],
          [
            "$5 \\times 1\\frac{1}{2} = 5 + 2\\frac{1}{2} = 7\\frac{1}{2}$.",
            "$5 \\times 1\\frac{1}{2} = 5 + 2\\frac{1}{2} = 7\\frac{1}{2}$。",
          ],
          [
            "The total goes first: $1\\frac{1}{2} \\div 7\\frac{1}{2}$ asks what part of the total one serving is.",
            "总量在前：$1\\frac{1}{2} \\div 7\\frac{1}{2}$ 求的是一份占总量的几分之几。",
          ],
        ],
        (rng) => {
          const each = mixedNumber(rng, 2, 4);
          const k = rng.int(2, 8);
          const total = each.mul(Q.of(k));
          const story = rng.pick([
            {
              en: `A pot holds $${mq(total)}$ liters of soup. Each jar holds $${mq(each)}$ liters. How many jars can be filled?`,
              zh: `一锅汤有 $${mq(total)}$ 升，每个罐子装 $${mq(each)}$ 升。可以装满多少个罐子？`,
            },
            {
              en: `A board is $${mq(total)}$ feet long. It is cut into shelves $${mq(each)}$ feet long each. How many shelves are there?`,
              zh: `一块木板长 $${mq(total)}$ 英尺，锯成每块 $${mq(each)}$ 英尺长的搁板。可以锯成多少块？`,
            },
          ]);
          return valued(
            [story.en, story.zh],
            k,
            divisionWalk(total, each),
            [
              `$${k}$ of them: $${k} \\times ${mq(each)} = ${mq(total)}$, the total.`,
              `$${k}$ 份：$${k} \\times ${mq(each)} = ${mq(total)}$，正是总量。`,
            ],
            [
              [total.mul(each), "That multiplies the amounts; a count of servings needs division.", "这是把两个量相乘；求份数要用除法。"],
              [each.div(total), "That divides one serving by the total, the wrong way round.", "这是用每份除以总量，除反了。"],
              [k + 1, "One too many: that would need more than the total.", "多算了一份：那样需要的量超过总量。"],
              [
                sloppyImproper(total).div(sloppyImproper(each)),
                "That adds the whole part to the numerator; multiply it by the denominator first.",
                "这是把整数部分直接加到分子上；要先乘分母。",
              ],
            ],
            { form: "integer", figure: divisionFigure(total, each) },
          );
        },
        divisionFigure(Q.of(15, 2), Q.of(3, 2)),
      ),
      lesson(
        "rate-from-mixed-numbers",
        ["Finding a rate", "求速度"],
        [
          [
            "A rate such as miles per hour is the distance divided by the time; with mixed numbers, change both to improper fractions, then multiply by the reciprocal of the time. $3\\frac{3}{4}$ miles in $1\\frac{1}{4}$ hours: $\\frac{15}{4} \\times \\frac{4}{5} = 3$ miles per hour.",
            "每小时走多少英里这样的速度，等于路程除以时间；是带分数时，先都化成假分数，再乘时间的倒数。$1\\frac{1}{4}$ 小时走 $3\\frac{3}{4}$ 英里：$\\frac{15}{4} \\times \\frac{4}{5} = 3$ 英里/小时。",
          ],
          [
            "$3$ miles each hour for $1\\frac{1}{4}$ hours: $3 + \\frac{3}{4} = 3\\frac{3}{4}$ miles.",
            "每小时 $3$ 英里，走 $1\\frac{1}{4}$ 小时：$3 + \\frac{3}{4} = 3\\frac{3}{4}$ 英里。",
          ],
          [
            "Divide distance by time, not time by distance: $1\\frac{1}{4} \\div 3\\frac{3}{4} = \\frac{1}{3}$ is hours per mile.",
            "要用路程除以时间，不是时间除以路程：$1\\frac{1}{4} \\div 3\\frac{3}{4} = \\frac{1}{3}$ 是每英里的小时数。",
          ],
        ],
        (rng) => {
          const time = mixedNumber(rng, 2, 4);
          const drawnDist = mixedNumber(rng, 9, 4);
          // Equal numbers would make the speed 1 and the division empty.
          const dist = drawnDist.eq(time) ? drawnDist.add(Q.of(1)) : drawnDist;
          const v = dist.div(time);
          return valued(
            [
              `A hiker walks $${mq(dist)}$ miles in $${mq(time)}$ hours at a steady pace. How many miles does the hiker walk per hour?`,
              `一名徒步者匀速行走，$${mq(time)}$ 小时走了 $${mq(dist)}$ 英里。他每小时走多少英里？`,
            ],
            v,
            divisionWalk(dist, time),
            [
              `$${mq(v)}$ miles each hour for $${mq(time)}$ hours: $${improper(v)} \\times ${improper(time)} = ${mq(dist)}$ miles.`,
              `每小时 $${mq(v)}$ 英里，走 $${mq(time)}$ 小时：$${improper(v)} \\times ${improper(time)} = ${mq(dist)}$ 英里。`,
            ],
            [
              [
                dist.mul(time),
                "That multiplies distance by time; a speed is distance divided by time.",
                "这是路程乘时间；速度是路程除以时间。",
              ],
              [time.div(dist), "That divides time by distance, which is hours per mile.", "这是时间除以路程，是每英里的小时数。"],
              [dist.sub(time).abs(), "That subtracts; a rate needs division.", "这是相减；求速度要用除法。"],
            ],
            { form: form(v), figure: rateFigure(dist, time) },
          );
        },
        rateFigure(Q.of(15, 4), Q.of(5, 4)),
      ),
    ],
  ),
  [
    "A hiker walks $3\\frac{3}{4}$ miles along a trail in $1\\frac{1}{4}$ hours at a steady pace. How far does the hiker go in one hour?",
    "一名徒步者沿小路匀速走了 $1\\frac{1}{4}$ 小时，共 $3\\frac{3}{4}$ 英里。他一小时走多远？",
  ],
  [
    "$3$ miles an hour for $1\\frac{1}{4}$ hours is $3 + \\frac{3}{4} = 3\\frac{3}{4}$ miles.",
    "每小时 $3$ 英里，走 $1\\frac{1}{4}$ 小时是 $3 + \\frac{3}{4} = 3\\frac{3}{4}$ 英里。",
  ],
  ["solve problems about servings and rates by dividing mixed numbers.", "用带分数除法解决分份和速度的问题。"],
);

// ---------------------------------------------------------------------------
// Estimating decimal quotients

/** near draws a decimal with one decimal place within 0.4 of x, but not equal to it. */
function near(rng: Rng, x: number): Q {
  return Q.of(x * 10 + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), 10);
}

/** estimateLine marks an estimate and the exact quotient near it on a number line from 0 to 10. */
function estimateLine(estimate: number, exact: Q): Figure {
  return lineFigure(
    {
      lo: 0,
      hi: 10,
      step: 1,
      labels: [0, 5, 10],
      marks: [
        { at: estimate, text: String(estimate) },
        { at: exact.toNumber(), text: dec(exact), result: true },
      ],
    },
    [
      `A number line from 0 to 10 with the estimate ${estimate} and the quotient ${dec(exact)} close together.`,
      `从 0 到 10 的数轴，估算值 ${estimate} 和商 ${dec(exact)} 挨得很近。`,
    ],
  );
}

export const estimatingMultiDigitDivisionWithDecimals = withIntro(
  topic(
    "estimating-multi-digit-division-with-decimals",
    t("Estimating Multi-Digit Division With Decimals", "估算多位小数除法"),
    t(
      "Round the dividend and divisor to compatible numbers, whole numbers that divide easily, then divide: 362.4 ÷ 8.9 ≈ 360 ÷ 9 = 40. An estimate tells you where the decimal point of the exact answer goes.",
      "把被除数和除数取成相容数（便于相除的整数），再相除：362.4 ÷ 8.9 ≈ 360 ÷ 9 = 40。估算可以帮你确定准确答案的小数点位置。",
    ),
    ["estimating-decimal-division"],
    ["6.NS.B.3"],
    [
      lesson(
        "compatible-numbers-for-decimal-division",
        ["Estimating with compatible numbers", "用相容数估算"],
        [
          [
            "To estimate a decimal division, round the divisor to a nearby whole number, then change the dividend to a nearby number that it divides evenly. $362.4 \\div 8.9$: $8.9$ is close to $9$, and $362.4$ is close to $360$, which $9$ divides, so the quotient is about $360 \\div 9 = 40$.",
            "估算小数除法时，先把除数取成相近的整数，再把被除数换成一个相近的、能被它整除的数。$362.4 \\div 8.9$：$8.9$ 接近 $9$，$362.4$ 接近能被 $9$ 整除的 $360$，所以商大约是 $360 \\div 9 = 40$。",
          ],
          [
            "$40 \\times 9 = 360$, close to $362.4$, so $40$ is a sensible size.",
            "$40 \\times 9 = 360$，接近 $362.4$，所以 $40$ 的大小合理。",
          ],
          [
            "Rounding $362.4$ to $362$ does not help: $362 \\div 9$ is still hard. Pick a number $9$ divides.",
            "把 $362.4$ 取成 $362$ 没有帮助：$362 \\div 9$ 还是不好算。要取能被 $9$ 整除的数。",
          ],
        ],
        (rng) => {
          const d = rng.int(3, 9);
          const q = rng.pick([rng.int(2, 9), rng.int(2, 9) * 10]);
          const a = near(rng, d * q);
          const b = near(rng, d);
          const others: MathWrong[] = [
            [
              String(q * 10),
              "That puts the decimal point one place too far right: the estimate is ten times too big.",
              "小数点往右多移了一位：估算值大了十倍。",
            ],
            [String(q + d), "That adds the divisor instead of dividing by it.", "这是加上除数，而不是除以它。"],
          ];
          if (q % 10 === 0)
            others.push([
              String(q / 10),
              "That puts the decimal point one place too far left: the estimate is ten times too small.",
              "小数点往左多移了一位：估算值小了十倍。",
            ]);
          return chosenMath(
            rng,
            [`Which is the best estimate of $${dec(a)} \\div ${dec(b)}$?`, `$${dec(a)} \\div ${dec(b)}$ 的最佳估计值是哪个？`],
            String(q),
            others,
            [
              [
                ["Compatible numbers", "取相容数"],
                ["Round the divisor, then pick a nearby number it divides:", "先取整除数，再取一个它能整除的相近的数："],
                [`${dec(b)} \\approx ${d}`, `${dec(a)} \\approx ${d * q}`],
              ],
              [["Divide", "相除"], ["Divide the compatible numbers:", "用相容数相除："], [`${d * q} \\div ${d} = ${q}`]],
            ],
            [
              `$${q} \\times ${dec(b)}$ is close to $${q} \\times ${d} = ${d * q}$, near $${dec(a)}$.`,
              `$${q} \\times ${dec(b)}$ 接近 $${q} \\times ${d} = ${d * q}$，和 $${dec(a)}$ 很接近。`,
            ],
            equalTape(d, String(q), String(d * q)),
          );
        },
        equalTape(9, "40", "360"),
      ),
      lesson(
        "placing-the-decimal-point-by-estimating",
        ["Checking an answer with an estimate", "用估算检验答案"],
        [
          [
            "An estimate tells you how big the quotient should be, so you can tell where its decimal point goes: pick the answer closest to the estimate. $47.25 \\div 6.3 \\approx 48 \\div 6 = 8$, so of $0.75$, $7.5$ and $75$, the quotient must be $7.5$.",
            "估算可以告诉你商大约有多大，从而判断小数点的位置：选择最接近估算结果的答案。$47.25 \\div 6.3 \\approx 48 \\div 6 = 8$，所以在 $0.75$、$7.5$、$75$ 中，商一定是 $7.5$。",
          ],
          ["$7.5 \\times 6.3 = 47.25$ exactly.", "$7.5 \\times 6.3 = 47.25$，正好。"],
          [
            "The digits $75$ are the same in every choice; only the estimate tells which place value is right.",
            "每个选项的数字都是 $75$；只有估算能判断哪个数位对。",
          ],
        ],
        (rng) => {
          for (;;) {
            const b = Q.of(rng.int(21, 89), 10);
            const v = Q.of(rng.int(21, 99), 10);
            if (Number(b.n) % 10 === 0 || Number(v.n) % 10 === 0) continue;
            const a = b.mul(v);
            const est = Math.round(b.toNumber());
            const guess = Math.round(a.toNumber() / est);
            return chosenMath(
              rng,
              [`Use an estimate to decide: what is $${dec(a)} \\div ${dec(b)}$?`, `用估算判断：$${dec(a)} \\div ${dec(b)}$ 等于多少？`],
              dec(v),
              [
                [dec(v.mul(Q.of(10))), "That is ten times too big for the estimate.", "这比估算值大了十倍。"],
                [dec(v.div(Q.of(10))), "That is ten times too small for the estimate.", "这比估算值小了十倍。"],
                [dec(v.mul(Q.of(100))), "That is a hundred times too big for the estimate.", "这比估算值大了一百倍。"],
              ],
              [
                [
                  ["Estimate", "估算"],
                  ["Round the divisor and divide:", "把除数取整再相除："],
                  [`${dec(b)} \\approx ${est}`, `${dec(a)} \\div ${est} \\approx ${guess}`],
                ],
                [["Choose", "选择"], [`Only one choice is close to $${guess}$:`, `只有一个选项接近 $${guess}$：`], [dec(v)]],
              ],
              [`Multiply back: $${dec(v)} \\times ${dec(b)} = ${dec(a)}$.`, `乘回去：$${dec(v)} \\times ${dec(b)} = ${dec(a)}$。`],
              estimateLine(Math.min(10, Math.max(0, guess)), v),
            );
          }
        },
        estimateLine(8, Q.of(15, 2)),
      ),
    ],
  ),
  [
    "A class has $362.40$ dollars for a trip, and each ticket costs $8.90$ dollars. Before working it out exactly, the teacher wants a quick idea of how many tickets that buys.",
    "全班有 $362.40$ 美元的出游经费，每张门票 $8.90$ 美元。算出准确结果之前，老师想先大概知道能买多少张。",
  ],
  [
    "$360 \\div 9 = 40$, and $40 \\times 8.90 = 356$ is just under $362.40$.",
    "$360 \\div 9 = 40$，而 $40 \\times 8.90 = 356$ 略少于 $362.40$。",
  ],
  [
    "estimate decimal quotients with compatible numbers, and use an estimate to place the decimal point.",
    "用相容数估算小数除法的商，并用估算确定小数点的位置。",
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

/** spanLine draws a number line through zero and the given values, with a tick step that keeps about ten ticks, marking the values; results are drawn as answers. */
function spanLine(values: readonly number[], results: readonly number[], alt: Pair): Figure {
  const all = [0, ...values, ...results];
  const [lo0, hi0] = [Math.min(...all), Math.max(...all)];
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500].find((s) => (hi0 - lo0) / s <= 10) ?? 1000;
  const [lo, hi] = [Math.floor(lo0 / step) * step, Math.ceil(hi0 / step) * step];
  return lineFigure(
    {
      lo,
      hi,
      step,
      labels: [...new Set([lo, 0, hi])],
      marks: [...values.map((at) => ({ at, text: String(at) })), ...results.map((at) => ({ at, text: String(at), result: true }))],
    },
    alt,
  );
}

export const interpretingNegativeNumbers = withIntro(
  topic(
    "interpreting-negative-numbers",
    t("Interpreting Negative Numbers", "理解负数的意义"),
    t(
      "Positive and negative numbers describe quantities in opposite directions from zero: 8 degrees below zero is −8, a deposit of 50 dollars is +50 and a withdrawal of 50 dollars is −50. Zero is the reference point, such as sea level or no change.",
      "正数和负数表示从 0 出发方向相反的量：零下 8 摄氏度记作 −8，存入 50 美元记作 +50，取出 50 美元记作 −50。0 是基准，例如海平面或没有变化。",
    ),
    ["negative-numbers", "integers-and-opposites"],
    ["6.NS.C.5"],
    [
      lesson(
        "writing-a-situation-as-an-integer",
        ["Writing a situation as a number", "用数表示情境"],
        [
          [
            "Positive and negative numbers describe amounts in opposite directions from zero: choose which direction is positive, and the other is negative. Above sea level, gains and deposits are usually positive; below sea level, losses and withdrawals are negative. $200$ meters below sea level is $-200$, and $35$ meters above sea level is $35$.",
            "正数和负数表示从 $0$ 出发方向相反的量：规定一个方向为正，相反的方向就为负。通常海平面以上、收入、存入记作正数；海平面以下、支出、取出记作负数。海平面以下 $200$ 米记作 $-200$，海拔 $35$ 米记作 $35$。",
          ],
          [
            "$-200$ and $35$ lie on opposite sides of $0$, just as the two places lie on opposite sides of sea level.",
            "$-200$ 和 $35$ 在 $0$ 的两侧，正如这两个地方在海平面的两侧。",
          ],
          ["The size, $200$, stays the same; only the sign shows the direction.", "大小 $200$ 不变；只有符号表示方向。"],
        ],
        (rng) => {
          const c = rng.pick(contexts);
          const n = rng.int(2, c.max);
          const neg = rng.bool();
          const v = neg ? -n : n;
          const desc = neg ? c.down(n) : c.up(n);
          const other = neg ? c.up(n) : c.down(n);
          return valued(
            [`Write a number to represent ${desc.en}.`, `写出表示“${desc["zh-CN"]}”的数。`],
            v,
            [
              [
                ["Find the direction", "看方向"],
                [
                  `Zero stands for ${c.zero.en}; this is in the ${neg ? "negative" : "positive"} direction.`,
                  `$0$ 表示${c.zero["zh-CN"]}；这是${neg ? "负" : "正"}方向。`,
                ],
              ],
              [
                ["Write the number", "写出这个数"],
                [`The size is $${n}$, with the sign for the direction:`, `大小是 $${n}$，再加上表示方向的符号：`],
                [`${v}`],
              ],
            ],
            [`The opposite situation, ${other.en}, would be $${-v}$.`, `相反的情况“${other["zh-CN"]}”记作 $${-v}$。`],
            [[-v, `That is the opposite direction: $${-v}$ would mean ${other.en}.`, `这是相反的方向：$${-v}$ 表示“${other["zh-CN"]}”。`]],
            {
              form: "integer",
              figure: spanLine([], [v], [`A number line through 0 with ${v} marked.`, `一条经过 0 的数轴，标出了 ${v}。`]),
            },
          );
        },
        spanLine([35], [-200], ["A number line with −200 and 35 marked on opposite sides of 0.", "数轴上 −200 和 35 分别标在 0 的两侧。"]),
      ),
      lesson(
        "meaning-of-the-opposite",
        ["The meaning of the opposite", "相反意义的量"],
        [
          [
            "A number and its opposite are the same distance from zero in opposite directions, so they describe the same amount with the opposite meaning. If $+15$ means $15$ meters above sea level, then $-15$ means $15$ meters below sea level.",
            "一个数和它的相反数离 $0$ 的距离相同、方向相反，所以它们表示同样多的量，但意义相反。如果 $+15$ 表示海拔 $15$ 米，那么 $-15$ 表示海平面以下 $15$ 米。",
          ],
          [
            "$15 + (-15) = 0$: going up $15$ and then down $15$ brings you back to sea level.",
            "$15 + (-15) = 0$：先上升 $15$ 再下降 $15$，又回到海平面。",
          ],
          ["The opposite keeps the amount $15$; only the direction changes.", "相反数保留了大小 $15$；只有方向变了。"],
        ],
        (rng) => {
          const c = rng.pick(contexts);
          const n = rng.int(2, Math.min(c.max, 99));
          const startPositive = rng.bool();
          const given = startPositive ? c.up(n) : c.down(n);
          const correct = startPositive ? c.down(n) : c.up(n);
          const near1 = startPositive ? c.down(n + 1) : c.up(n + 1);
          const first = startPositive ? n : -n;
          const shown = -first;
          return chosen(
            rng,
            [
              `If $${first}$ represents ${given.en}, what does $${shown}$ represent?`,
              `如果 $${first}$ 表示${given["zh-CN"]}，那么 $${shown}$ 表示什么？`,
            ],
            [correct.en, correct["zh-CN"]],
            [
              [
                [given.en, given["zh-CN"]],
                "That is what the first number means, not its opposite.",
                "这是第一个数的意义，不是它的相反数的意义。",
              ],
              [[near1.en, near1["zh-CN"]], "That changes the amount; an opposite keeps the same size.", "这改变了大小；相反数的大小不变。"],
              [
                [c.zero.en, c.zero["zh-CN"]],
                "That is zero, the reference point; an opposite of a nonzero number is not zero.",
                "这是基准 $0$；不为零的数的相反数不是零。",
              ],
            ],
            [
              [
                ["The opposite", "相反数"],
                [
                  `$${shown}$ is the opposite of $${first}$: the same distance from $0$, on the other side.`,
                  `$${shown}$ 是 $${first}$ 的相反数：离 $0$ 一样远，在另一侧。`,
                ],
              ],
              [
                ["The meaning", "意义"],
                [
                  `So it means the same amount in the other direction: ${correct.en}.`,
                  `所以它表示方向相反、大小相同的量：${correct["zh-CN"]}。`,
                ],
              ],
            ],
            [
              `$${first} + (${shown}) = 0$: the two together bring you back to ${c.zero.en}.`,
              `$${first} + (${shown}) = 0$：两者合起来回到${c.zero["zh-CN"]}。`,
            ],
            spanLine(
              [first],
              [shown],
              [
                `A number line with ${first} and its opposite ${shown} the same distance from 0.`,
                `数轴上 ${first} 和它的相反数 ${shown} 离 0 一样远。`,
              ],
            ),
          );
        },
        spanLine([15], [-15], ["A number line with 15 and −15 the same distance from 0.", "数轴上 15 和 −15 离 0 一样远。"]),
      ),
    ],
  ),
  [
    "A weather report says it is $8$ degrees below zero in one city and $8$ degrees above zero in another. Both use the number $8$, but they mean very different weather.",
    "天气预报说，一个城市零下 $8$ 摄氏度，另一个城市零上 $8$ 摄氏度。两个都用到数 $8$，天气却大不一样。",
  ],
  ["$-8$ and $8$ are each $8$ degrees from $0$, on opposite sides.", "$-8$ 和 $8$ 离 $0$ 都是 $8$ 度，分在两侧。"],
  [
    "write situations as positive and negative numbers, and say what the opposite of a number means.",
    "用正数和负数表示情境，并说出一个数的相反数的意义。",
  ],
);

export const interpretingAbsoluteValue = withIntro(
  topic(
    "interpreting-absolute-value",
    t("Interpreting Absolute Value", "理解绝对值的意义"),
    t(
      "The absolute value of a number is its distance from zero, so it gives the size of a quantity without its direction. An account balance of −30 dollars is a debt of |−30| = 30 dollars, and a debt of 40 dollars (−40) is greater than a debt of 25 dollars (−25) even though −40 < −25.",
      "一个数的绝对值是它到 0 的距离，表示一个量的大小而不管方向。账户余额 −30 美元表示欠款 |−30| = 30 美元；欠 40 美元（−40）比欠 25 美元（−25）欠得多，尽管 −40 < −25。",
    ),
    ["absolute-value", "interpreting-negative-numbers"],
    ["6.NS.C.7c", "6.NS.C.7d"],
    [
      lesson(
        "distance-from-zero-in-context",
        ["Size of a quantity", "量的大小"],
        [
          [
            "The absolute value of a number is its distance from zero, so it tells how far something is from the reference point, whichever side it is on. A diver at $-12$ m is $|-12| = 12$ m from sea level, and a bird at $9$ m is $9$ m from it, so the diver is farther.",
            "一个数的绝对值是它到 $0$ 的距离，所以它表示离基准有多远，不管在哪一侧。潜水员在 $-12$ 米处，离海平面 $|-12| = 12$ 米；鸟在 $9$ 米处，离海平面 $9$ 米，所以潜水员离得更远。",
          ],
          [
            "On a vertical number line, count from $0$: $12$ steps down to the diver, $9$ steps up to the bird.",
            "在竖直的数轴上从 $0$ 数起：向下 $12$ 格到潜水员，向上 $9$ 格到鸟。",
          ],
          [
            "$9 > -12$ says the bird is higher, not farther: distance from sea level uses absolute values.",
            "$9 > -12$ 说明鸟更高，不是更远：离海平面的距离要看绝对值。",
          ],
        ],
        (rng) => {
          const d = rng.int(3, 60);
          let b = rng.int(3, 60);
          while (b === d) b = rng.int(3, 60);
          const diver = d > b;
          const [right, wrong]: [Pair, Pair] = diver
            ? [
                ["The diver", "潜水员"],
                ["The bird", "鸟"],
              ]
            : [
                ["The bird", "鸟"],
                ["The diver", "潜水员"],
              ];
          return chosen(
            rng,
            [
              `A diver is at an elevation of $${-d}$ meters and a bird is at an elevation of $${b}$ meters. Which one is farther from sea level?`,
              `潜水员位于海拔 $${-d}$ 米处，一只鸟位于海拔 $${b}$ 米处。谁离海平面更远？`,
            ],
            right,
            [
              [
                wrong,
                diver
                  ? `The bird is higher, but it is only $${b}$ m from sea level, and the diver is $${d}$ m away.`
                  : `The diver is $|${-d}| = ${d}$ m from sea level, less than the bird's $${b}$ m.`,
                diver
                  ? `鸟更高，但它离海平面只有 $${b}$ 米，潜水员却有 $${d}$ 米。`
                  : `潜水员离海平面 $|${-d}| = ${d}$ 米，比鸟的 $${b}$ 米少。`,
              ],
            ],
            [
              [
                ["Distances", "求距离"],
                ["Distance from sea level is the absolute value:", "离海平面的距离是绝对值："],
                [`|${-d}| = ${d}`, `|${b}| = ${b}`],
              ],
              [
                ["Compare", "比较"],
                [
                  `$${Math.max(d, b)} > ${Math.min(d, b)}$, so ${right[0].toLowerCase()} is farther.`,
                  `$${Math.max(d, b)} > ${Math.min(d, b)}$，所以${right[1]}离得更远。`,
                ],
              ],
            ],
            [
              `Counting from $0$: $${d}$ steps down to the diver and $${b}$ steps up to the bird.`,
              `从 $0$ 数起：向下 $${d}$ 格到潜水员，向上 $${b}$ 格到鸟。`,
            ],
            spanLine([b], [-d], [`A number line with the diver at ${-d} and the bird at ${b}.`, `数轴上潜水员在 ${-d}，鸟在 ${b}。`]),
          );
        },
        spanLine([9], [-12], ["A number line with the diver at −12 and the bird at 9.", "数轴上潜水员在 −12，鸟在 9。"]),
      ),
      lesson(
        "comparing-debts",
        ["Absolute value and order", "绝对值与大小"],
        [
          [
            "A negative balance is a debt, and its absolute value is the size of the debt, so the smaller balance is the larger debt: order balances by value, but compare debts by absolute value. Balances $-40$ and $-25$: $-40 < -25$, but $|-40| = 40 > 25 = |-25|$, so $-40$ is the greater debt.",
            "余额为负表示欠债，它的绝对值就是欠债的多少，所以余额越小，欠得越多：比较余额看数的大小，比较欠债看绝对值。余额 $-40$ 与 $-25$：$-40 < -25$，但 $|-40| = 40 > 25 = |-25|$，所以 $-40$ 欠得更多。",
          ],
          [
            "On the number line, $-40$ is farther left than $-25$, so it is smaller but farther from $0$.",
            "在数轴上 $-40$ 在 $-25$ 的左边更远处，所以它更小，但离 $0$ 更远。",
          ],
          [
            "The greater balance is not the greater debt: $-25 > -40$, yet $25$ dollars owed is less than $40$.",
            "余额更大不等于欠款更多：$-25 > -40$，但欠 $25$ 美元比欠 $40$ 美元少。",
          ],
        ],
        (rng) => {
          const [x, y] = rng.sample([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75], 2) as [number, number];
          const askDebt = rng.bool();
          const bigger = Math.max(x, y);
          const smaller = Math.min(x, y);
          const aWins = askDebt ? x > y : x < y;
          const [right, wrong]: [Pair, Pair] = aWins
            ? [
                ["Account A", "账户 A"],
                ["Account B", "账户 B"],
              ]
            : [
                ["Account B", "账户 B"],
                ["Account A", "账户 A"],
              ];
          return chosen(
            rng,
            askDebt
              ? [
                  `Account A has a balance of $${-x}$ dollars and account B has a balance of $${-y}$ dollars. Which account shows the greater debt?`,
                  `账户 A 的余额是 $${-x}$ 美元，账户 B 的余额是 $${-y}$ 美元。哪个账户欠款更多？`,
                ]
              : [
                  `Account A has a balance of $${-x}$ dollars and account B has a balance of $${-y}$ dollars. Which account has the greater balance?`,
                  `账户 A 的余额是 $${-x}$ 美元，账户 B 的余额是 $${-y}$ 美元。哪个账户的余额更大？`,
                ],
            right,
            [
              [
                wrong,
                askDebt
                  ? `Its balance is greater, but it owes only $${smaller}$ dollars, less than $${bigger}$.`
                  : `It owes more, $${bigger}$ dollars, so its balance $${-bigger}$ is the smaller one.`,
                askDebt
                  ? `它的余额更大，但只欠 $${smaller}$ 美元，比 $${bigger}$ 少。`
                  : `它欠得更多（$${bigger}$ 美元），所以余额 $${-bigger}$ 更小。`,
              ],
            ],
            askDebt
              ? [
                  [
                    ["The debts", "欠款"],
                    ["The size of each debt is the absolute value of the balance:", "欠款多少是余额的绝对值："],
                    [`|${-x}| = ${x}`, `|${-y}| = ${y}`],
                  ],
                  [
                    ["Compare", "比较"],
                    [
                      `$${bigger} > ${smaller}$, so the balance of $${-bigger}$ is the greater debt.`,
                      `$${bigger} > ${smaller}$，所以余额 $${-bigger}$ 的账户欠款更多。`,
                    ],
                  ],
                ]
              : [
                  [
                    ["Place them", "在数轴上找位置"],
                    [
                      `$${-smaller}$ is to the right of $${-bigger}$ on the number line.`,
                      `在数轴上 $${-smaller}$ 在 $${-bigger}$ 的右边。`,
                    ],
                  ],
                  [["Compare", "比较"], ["Farther right is greater:", "越往右越大："], [`${-smaller} > ${-bigger}`]],
                ],
            askDebt
              ? [
                  `On the number line, $${-bigger}$ is farther from $0$ than $${-smaller}$.`,
                  `在数轴上，$${-bigger}$ 比 $${-smaller}$ 离 $0$ 更远。`,
                ]
              : [
                  `Owing less leaves more: $${smaller} < ${bigger}$ owed, so $${-smaller}$ is the greater balance.`,
                  `欠得少，剩得多：欠 $${smaller}$ 比欠 $${bigger}$ 少，所以 $${-smaller}$ 是更大的余额。`,
                ],
            spanLine(
              [],
              [-x, -y],
              [`A number line with the balances ${-x} and ${-y} marked left of 0.`, `数轴上在 0 的左边标出余额 ${-x} 和 ${-y}。`],
            ),
          );
        },
        spanLine([], [-40, -25], ["A number line with −40 and −25 marked left of 0.", "数轴上在 0 的左边标出 −40 和 −25。"]),
      ),
    ],
  ),
  [
    "Sam's bank balance is $-30$ dollars, and Lee's is $-45$ dollars. Lee's number is smaller, but who owes more?",
    "Sam 的银行余额是 $-30$ 美元，Lee 的是 $-45$ 美元。Lee 的数更小，那谁欠得更多呢？",
  ],
  ["$|-45| = 45$ and $|-30| = 30$, so Lee owes $15$ dollars more.", "$|-45| = 45$，$|-30| = 30$，所以 Lee 多欠 $15$ 美元。"],
  ["use absolute value as the size of a quantity, and tell it apart from order.", "用绝对值表示量的大小，并把它和数的大小顺序区分开。"],
);

// ---------------------------------------------------------------------------
// Rational numbers

/** setOptions are the ways to classify a number among the natural numbers, integers and rational numbers. */
const setOptions: readonly Pair[] = [
  ["A natural number, an integer and a rational number", "自然数、整数，也是有理数"],
  ["An integer and a rational number, but not a natural number", "整数和有理数，但不是自然数"],
  ["A rational number, but not an integer", "有理数，但不是整数"],
];

/** setReasons says why each classification is wrong for a number of each kind: natural, other integer, or not an integer. */
const setReasons: readonly (readonly (readonly [string, string])[])[] = [
  [
    ["", ""],
    ["It is a counting number, so it is a natural number too.", "它是数数时用的数，所以也是自然数。"],
    ["It is a whole number, so it is an integer.", "它是整数，不是夹在两个整数之间的数。"],
  ],
  [
    [
      "The natural numbers are $1, 2, 3, \\ldots$; zero and negative numbers are not natural.",
      "自然数是 $1, 2, 3, \\ldots$；零和负数不是自然数。",
    ],
    ["", ""],
    ["It is a whole number or the opposite of one, so it is an integer.", "它是整数或整数的相反数，所以是整数。"],
  ],
  [
    ["It is not even an integer, so it cannot be a natural number.", "它连整数都不是，更不可能是自然数。"],
    ["It lies between two integers, so it is not an integer.", "它在两个整数之间，所以不是整数。"],
    ["", ""],
  ],
];

/** nestedSets draws the natural numbers inside the integers inside the rational numbers, each with examples. */
function nestedSets(): Figure {
  const text = (x: number, y: number, s: string) => `<text x="${x}" y="${y}" fill="currentColor" stroke="none">${s}</text>`;
  const body =
    `<rect x="10" y="6" width="300" height="118" rx="10"/>` +
    `<rect x="30" y="30" width="200" height="86" rx="10"/>` +
    `<rect class="accent" x="50" y="56" width="110" height="52" rx="10"/>` +
    text(290, 22, "Q") +
    text(212, 46, "Z") +
    text(144, 72, "N") +
    text(270, 80, "1/2") +
    text(270, 100, "−0.3") +
    text(196, 80, "0") +
    text(196, 100, "−4") +
    text(105, 90, "1, 2, 3");
  return {
    svg: svgDocument(130, body),
    alt: t(
      "Three nested regions: the natural numbers N (1, 2, 3) inside the integers Z (with 0 and −4), inside the rational numbers Q (with 1/2 and −0.3).",
      "三个套在一起的区域：自然数 N（1, 2, 3）在整数 Z（还有 0 和 −4）里面，整数又在有理数 Q（还有 1/2 和 −0.3）里面。",
    ),
  };
}

export const naturalNumbersIntegersAndRationalNumbers = withIntro(
  topic(
    "natural-numbers-integers-and-rational-numbers",
    t("Natural Numbers, Integers, and Rational Numbers", "自然数、整数与有理数"),
    t(
      "The natural numbers are 1, 2, 3, …. The integers are the natural numbers, their opposites and 0: …, −2, −1, 0, 1, 2, …. A rational number is any number that can be written as a fraction a/b of integers with b ≠ 0, such as 3/4, −2.5 = −5/2 and 7 = 7/1. Every natural number is an integer, and every integer is a rational number.",
      "自然数是 1, 2, 3, …（本课程中自然数从 1 开始）。整数包括自然数、它们的相反数和 0：…, −2, −1, 0, 1, 2, …。能写成整数之比 a/b（b ≠ 0）的数叫有理数，例如 3/4、−2.5 = −5/2、7 = 7/1。每个自然数都是整数，每个整数都是有理数。",
    ),
    ["integers-and-opposites", "converting-decimals-to-fractions"],
    ["6.NS.C.6"],
    [
      lesson(
        "classifying-a-number",
        ["Classifying a number", "给数分类"],
        [
          [
            "Ask two questions: is it a whole number or the opposite of one (an integer)? If so, is it one of $1, 2, 3, \\ldots$ (natural)? Every number here is rational. $5$ is natural, an integer and rational; $-5$ and $0$ are integers but not natural; $-\\frac{1}{2}$ and $0.3$ are rational but not integers.",
            "问两个问题：它是整数或整数的相反数吗（是不是整数）？如果是，它是 $1, 2, 3, \\ldots$ 中的一个吗（是不是自然数）？这里的数都是有理数。$5$ 是自然数，也是整数和有理数；$-5$ 和 $0$ 是整数，但不是自然数；$-\\frac{1}{2}$ 和 $0.3$ 是有理数，但不是整数。",
          ],
          [
            "Each can be written as a fraction of integers: $5 = \\frac{5}{1}$, $-5 = \\frac{-5}{1}$, $0.3 = \\frac{3}{10}$, so all are rational.",
            "每个数都能写成整数之比：$5 = \\frac{5}{1}$，$-5 = \\frac{-5}{1}$，$0.3 = \\frac{3}{10}$，所以都是有理数。",
          ],
          [
            "$0$ is an integer but not a natural number: the natural numbers start at $1$.",
            "$0$ 是整数，但不是自然数：自然数从 $1$ 开始。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          let latex: string;
          let asFraction: string;
          if (kind === 0) {
            const n = rng.int(1, 99);
            latex = String(n);
            asFraction = fr(n, 1);
          } else if (kind === 1) {
            const n = rng.bool(0.2) ? 0 : -rng.int(1, 99);
            latex = String(n);
            asFraction = fr(n, 1);
          } else {
            const [a, b] = properFraction(rng, 9, 2);
            const negative = rng.bool();
            const v = rng.bool() ? Q.of(a, b) : Q.of(rng.int(11, 99), 10);
            const signed = negative ? v.neg() : v;
            latex = v.d === 10n ? dec(signed) : `${negative ? "-" : ""}${fr(a, b)}`;
            asFraction = fr(String(signed.n), String(signed.d));
          }
          const integer = kind < 2;
          return chosen(
            rng,
            [`Which best describes the number $${latex}$?`, `下面哪一项最准确地描述了数 $${latex}$？`],
            setOptions[kind] as Pair,
            [0, 1, 2]
              .filter((k) => k !== kind)
              .map((k): Wrong => {
                const [en, zh] = (setReasons[kind] as readonly (readonly [string, string])[])[k] as readonly [string, string];
                return [setOptions[k] as Pair, en, zh];
              }),
            [
              [
                ["An integer?", "是整数吗？"],
                integer
                  ? [
                      `$${latex}$ is a whole number or the opposite of one, so it is an integer.`,
                      `$${latex}$ 是整数或整数的相反数，所以是整数。`,
                    ]
                  : [`$${latex}$ lies between two integers, so it is not an integer.`, `$${latex}$ 在两个整数之间，所以不是整数。`],
              ],
              [
                ["A natural number?", "是自然数吗？"],
                kind === 0
                  ? [
                      `$${latex}$ is one of $1, 2, 3, \\ldots$, so it is natural.`,
                      `$${latex}$ 是 $1, 2, 3, \\ldots$ 中的一个，所以是自然数。`,
                    ]
                  : ["It is not one of $1, 2, 3, \\ldots$, so it is not natural.", "它不是 $1, 2, 3, \\ldots$ 中的一个，所以不是自然数。"],
              ],
            ],
            [
              `It is a fraction of integers, $${latex} = ${asFraction}$, so it is rational in every case.`,
              `它能写成整数之比 $${latex} = ${asFraction}$，所以总是有理数。`,
            ],
            nestedSets(),
          );
        },
        nestedSets(),
      ),
      lesson(
        "finding-the-non-integer",
        ["Which is not an integer?", "哪个不是整数？"],
        [
          [
            "A fraction is an integer only if it simplifies to a whole number or the opposite of one, so divide the numerator by the denominator to check. $\\frac{12}{4} = 3$ and $-\\frac{6}{3} = -2$ are integers in disguise; $\\frac{7}{2} = 3\\frac{1}{2}$ is not an integer.",
            "一个分数只有化简后是整数或整数的相反数时才是整数，所以用分子除以分母来检验。$\\frac{12}{4} = 3$、$-\\frac{6}{3} = -2$ 实际上是整数；$\\frac{7}{2} = 3\\frac{1}{2}$ 不是整数。",
          ],
          [
            "$3\\frac{1}{2}$ lies between $3$ and $4$ on the number line, so it cannot be an integer.",
            "$3\\frac{1}{2}$ 在数轴上位于 $3$ 和 $4$ 之间，所以不可能是整数。",
          ],
          [
            "A fraction bar does not make a number a non-integer: $\\frac{12}{4}$ is just $3$.",
            "有分数线不代表不是整数：$\\frac{12}{4}$ 就是 $3$。",
          ],
        ],
        (rng) => {
          const d = rng.int(2, 6);
          let n = rng.int(d + 1, 6 * d);
          while (n % d === 0) n = rng.int(d + 1, 6 * d);
          const k = rng.int(2, 6);
          const m = rng.int(2, 5);
          const negative = rng.bool();
          const target = `${negative ? "-" : ""}${fr(n, d)}`;
          const whole = -rng.int(1, 30);
          const value = Q.of(negative ? -n : n, d);
          return chosenMath(
            rng,
            [`Which of these numbers is not an integer?`, `下面哪个数不是整数？`],
            target,
            [
              [fr(k * m, m), `That simplifies to $${k}$, an integer.`, `它化简后是 $${k}$，是整数。`],
              [`-${fr(k * d, d)}`, `That simplifies to $-${k}$, an integer.`, `它化简后是 $-${k}$，是整数。`],
              [String(whole), "A negative whole number is an integer.", "负整数也是整数。"],
            ],
            [
              [
                ["Divide", "相除"],
                ["Divide each numerator by its denominator:", "用每个分子除以分母："],
                [`${fr(k * m, m)} = ${k}`, `-${fr(k * d, d)} = -${k}`, `${target} = ${mq(value)}`],
              ],
              [
                ["Choose", "选择"],
                [`Only $${target}$ does not come out whole.`, `只有 $${target}$ 除不尽。`],
              ],
            ],
            [
              `$${mq(value)}$ lies between $${Math.floor(value.toNumber())}$ and $${Math.ceil(value.toNumber())}$ on the number line.`,
              `$${mq(value)}$ 在数轴上位于 $${Math.floor(value.toNumber())}$ 和 $${Math.ceil(value.toNumber())}$ 之间。`,
            ],
            nestedSets(),
          );
        },
        nestedSets(),
      ),
    ],
  ),
  [
    "A thermometer shows $-3$ degrees, a recipe needs $\\frac{3}{4}$ cup of milk, and a class has $28$ students. All three are numbers, but they belong to different families.",
    "温度计显示 $-3$ 度，食谱要 $\\frac{3}{4}$ 杯牛奶，一个班有 $28$ 名学生。三个都是数，却属于不同的家族。",
  ],
  [
    "$28$ is natural, $-3$ is an integer but not natural, and $\\frac{3}{4}$ is rational but not an integer.",
    "$28$ 是自然数；$-3$ 是整数但不是自然数；$\\frac{3}{4}$ 是有理数但不是整数。",
  ],
  ["sort numbers into natural numbers, integers and rational numbers.", "把数分成自然数、整数和有理数。"],
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

export const identifyingRationalNumbersOnANumberLine = withIntro(
  topic(
    "identifying-rational-numbers-on-a-number-line",
    t("Identifying Rational Numbers on a Number Line", "在数轴上表示有理数"),
    t(
      "Every rational number has a place on the number line. To read a point, count the equal parts between integers: on a line with 4 parts per unit, the point 3 parts to the left of −1 is −1 3/4 = −1.75. Negative numbers lie to the left of 0.",
      "每个有理数都能在数轴上找到对应的点。读点时，数一数相邻整数间的等份：每个单位分成 4 份，−1 左边 3 份的点是 −1 3/4 = −1.75。负数在 0 的左边。",
    ),
    ["natural-numbers-integers-and-rational-numbers", "modeling-fractions-using-number-lines", "negative-numbers"],
    ["6.NS.C.6", "6.NS.C.6c"],
    [
      lesson(
        "reading-a-rational-number",
        ["Reading a point", "读出点表示的数"],
        [
          [
            "Count how many equal parts each unit is split into; that is the denominator. Then count parts from the nearest integer; to the left of a negative integer, the number becomes more negative. With $4$ parts per unit, a point $1$ part to the left of $-2$ is $-2\\frac{1}{4}$.",
            "先数每个单位被平均分成几份，这就是分母。再从最近的整数开始数份数；在负整数的左边，数会变得更小。每个单位分成 $4$ 份，$-2$ 左边 $1$ 份的点是 $-2\\frac{1}{4}$。",
          ],
          [
            "From $-3$, count $3$ parts right: $-3 + \\frac{3}{4} = -2\\frac{1}{4}$.",
            "从 $-3$ 向右数 $3$ 份：$-3 + \\frac{3}{4} = -2\\frac{1}{4}$。",
          ],
          [
            "$1$ part left of $-2$ is $-2\\frac{1}{4}$, not $-1\\frac{3}{4}$, which is to the right of $-2$.",
            "$-2$ 左边 $1$ 份是 $-2\\frac{1}{4}$，不是 $-1\\frac{3}{4}$，后者在 $-2$ 的右边。",
          ],
        ],
        (rng) => {
          const d = rng.pick([2, 3, 4, 5]);
          const lo = rng.int(-4, -1);
          const hi = lo + 4;
          let k = rng.int(1, 4 * d - 1);
          while (k % d === 0 || lo + k / d > 0) k = rng.int(1, 4 * d - 1);
          const v = Q.of(lo * d + k, d);
          const ceil = Math.ceil(v.toNumber());
          const floor = Math.floor(v.toNumber());
          const left = d - (k % d);
          return valued(
            ["What number does point $P$ represent?", "点 $P$ 表示什么数？"],
            v,
            [
              [
                ["The size of a part", "每份的大小"],
                [
                  `Each unit is split into $${d}$ equal parts, so each part is $${fr(1, d)}$.`,
                  `每个单位平均分成 $${d}$ 份，每份是 $${fr(1, d)}$。`,
                ],
              ],
              [
                ["Count", "数格"],
                [`$P$ is $${left}$ part${left === 1 ? "" : "s"} to the left of $${ceil}$:`, `$P$ 在 $${ceil}$ 左边 $${left}$ 格处：`],
                [`${ceil} - ${fr(left, d)} = ${mq(v)}`],
              ],
            ],
            [
              `From $${floor}$, count $${k % d}$ part${k % d === 1 ? "" : "s"} right: $${floor} + ${fr(k % d, d)} = ${mq(v)}$.`,
              `从 $${floor}$ 向右数 $${k % d}$ 格：$${floor} + ${fr(k % d, d)} = ${mq(v)}$。`,
            ],
            [
              [
                v.neg(),
                "That is on the wrong side of $0$: $P$ is to the left of $0$, so it is negative.",
                "这在 $0$ 的另一侧：$P$ 在 $0$ 的左边，是负数。",
              ],
              [Q.of(lo * d + k + 1, d), "That is one part too far right.", "这往右多数了一格。"],
              [Q.of(lo * d + k - 1, d), "That is one part too far left.", "这往左多数了一格。"],
              [Q.of(ceil).sub(Q.of(k % d, d)), "That counts the parts from the wrong integer.", "这是从另一个整数开始数格了。"],
            ],
            { figure: numberLine(lo, hi, d, [{ at: v.toNumber(), label: "P" }]) },
          );
        },
        numberLine(-3, 1, 4, [{ at: -2.25, label: "P" }]),
      ),
      lesson(
        "locating-a-rational-number",
        ["Locating a number", "找到数对应的点"],
        [
          [
            "A negative number is to the left of $0$: find the two integers it lies between, then count parts from one of them. $-1.5$ is halfway between $-2$ and $-1$, while $1.5$ is halfway between $1$ and $2$.",
            "负数在 $0$ 的左边：先找出它在哪两个整数之间，再从其中一个整数数格。$-1.5$ 在 $-2$ 和 $-1$ 的正中间，而 $1.5$ 在 $1$ 和 $2$ 的正中间。",
          ],
          ["$-1.5$ and $1.5$ are the same distance from $0$, on opposite sides.", "$-1.5$ 和 $1.5$ 离 $0$ 一样远，分在两侧。"],
          [
            "$-1.5$ is less than $-1$, so it lies to the left of $-1$, not to its right.",
            "$-1.5$ 比 $-1$ 小，所以在 $-1$ 的左边，不是右边。",
          ],
        ],
        (rng) => {
          for (;;) {
            const d = rng.pick([2, 4]);
            const target = Q.of(-rng.int(d + 1, 3 * d - 1), d);
            if (target.isInteger()) continue;
            const t0 = target.toNumber();
            const [fl, ce] = [Math.floor(t0), Math.ceil(t0)];
            const decoys: [number, string, string][] = [
              [-t0, "That is the positive number the same distance from $0$, on the wrong side.", "这是离 $0$ 一样远的正数，在另一侧。"],
              [t0 + 1 / d, "That is one part too far right.", "这往右多了一格。"],
              [ce - (t0 - fl), "That counts the parts from the wrong integer.", "这是从另一个整数开始数格了。"],
            ];
            const kept = decoys.filter(([v], i) => v !== t0 && decoys.findIndex(([w]) => w === v) === i && v >= -4 && v <= 4);
            const all = rng.shuffle([t0, ...kept.map(([v]) => v)]);
            const labels = ["A", "B", "C", "D"];
            const name = (v: number) => labels[all.indexOf(v)] as string;
            const shown = rng.bool() ? dec(target) : mq(target);
            return chosen(
              rng,
              [`Which point represents $${shown}$?`, `哪个点表示 $${shown}$？`],
              [`Point ${name(t0)}`, `点 ${name(t0)}`],
              kept.map(([v, en, zh]): Wrong => [[`Point ${name(v)}`, `点 ${name(v)}`], en, zh]),
              [
                [
                  ["Find the integers", "找出两边的整数"],
                  [
                    `$${shown}$ is negative, so it is left of $0$, between $${fl}$ and $${ce}$.`,
                    `$${shown}$ 是负数，在 $0$ 的左边，位于 $${fl}$ 和 $${ce}$ 之间。`,
                  ],
                ],
                [
                  ["Count", "数格"],
                  [
                    `It is $${(ce - t0) * d}$ part${(ce - t0) * d === 1 ? "" : "s"} left of $${ce}$: point ${name(t0)}.`,
                    `它在 $${ce}$ 左边 $${(ce - t0) * d}$ 格处：点 ${name(t0)}。`,
                  ],
                ],
              ],
              [
                `From $${fl}$, point ${name(t0)} is $${(t0 - fl) * d}$ part${(t0 - fl) * d === 1 ? "" : "s"} to the right, and $${fl} + ${fr((t0 - fl) * d, d)} = ${mq(target)}$.`,
                `从 $${fl}$ 向右数 $${(t0 - fl) * d}$ 格是点 ${name(t0)}，$${fl} + ${fr((t0 - fl) * d, d)} = ${mq(target)}$。`,
              ],
              numberLine(
                -4,
                4,
                d,
                all.map((v) => ({ at: v, label: name(v) })),
              ),
            );
          }
        },
        numberLine(-2, 2, 2, [
          { at: -1.5, label: "A" },
          { at: 1.5, label: "B" },
        ]),
      ),
    ],
  ),
  [
    "A dive computer shows depths like $-1.75$ meters, and a thermometer shows $-2\\frac{1}{2}$ degrees. Every such number has its own exact spot on the number line.",
    "潜水电脑显示的深度有 $-1.75$ 米，温度计显示 $-2\\frac{1}{2}$ 度。这样的每个数在数轴上都有自己确定的位置。",
  ],
  [
    "$-1.75 = -1\\frac{3}{4}$ lies $3$ quarters to the left of $-1$, between $-2$ and $-1$.",
    "$-1.75 = -1\\frac{3}{4}$ 在 $-1$ 左边 $3$ 个四分之一处，位于 $-2$ 和 $-1$ 之间。",
  ],
  ["read and locate fractions and decimals, positive and negative, on a number line.", "在数轴上读出和找到正负分数和小数。"],
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

/** sameForm writes the numbers not already decimals as decimals, or says they already are. */
function sameForm(xs: readonly RationalForm[]): Walk {
  const lines = xs.filter((r) => r.latex !== dec(r.v)).map((r) => `${r.latex} = ${dec(r.v)}`);
  return lines.length > 0
    ? [["Same form", "化成同一种形式"], ["Write them as decimals:", "都化成小数："], lines]
    : [
        ["Same form", "化成同一种形式"],
        ["They are already decimals or integers.", "它们已经是小数或整数。"],
      ];
}

export const comparingRationalNumbers = withIntro(
  topic(
    "comparing-rational-numbers",
    t("Comparing Rational Numbers", "比较有理数的大小"),
    t(
      "Of two numbers, the one farther right on the number line is greater. Any positive number is greater than any negative number, and of two negative numbers the one with the smaller absolute value is greater: −1.2 > −1 3/4 because 1.2 < 1.75.",
      "数轴上右边的数比左边的大。正数都大于负数；两个负数比较，绝对值小的反而大：−1.2 > −1 3/4，因为 1.2 < 1.75。",
    ),
    ["identifying-rational-numbers-on-a-number-line", "comparing-negative-numbers"],
    ["6.NS.C.7a", "6.NS.C.7b"],
    [
      lesson(
        "comparing-two-rational-numbers",
        ["Comparing two numbers", "比较两个数"],
        [
          [
            "On a number line, a number to the left is smaller. To compare a fraction and a decimal, write both as decimals first; with negative numbers, the one farther from zero is smaller. $-\\frac{3}{4} = -0.75$, which is left of $-0.7$, so $-\\frac{3}{4} < -0.7$.",
            "在数轴上，左边的数小。比较分数和小数时，先都化成小数；负数离 $0$ 越远，数越小。$-\\frac{3}{4} = -0.75$，在 $-0.7$ 的左边，所以 $-\\frac{3}{4} < -0.7$。",
          ],
          ["$-0.7 - (-0.75) = 0.05$ is positive, so $-0.7$ is the greater one.", "$-0.7 - (-0.75) = 0.05$ 是正数，所以 $-0.7$ 更大。"],
          ["$0.75 > 0.7$, but for negatives the order flips: $-0.75 < -0.7$.", "$0.75 > 0.7$，但对负数来说顺序反过来：$-0.75 < -0.7$。"],
        ],
        (rng) => {
          const a = randomRational(rng);
          let b = randomRational(rng);
          while (b.latex === a.latex || (a.v.sign() >= 0 && b.v.sign() >= 0 && rng.bool(0.7))) b = randomRational(rng);
          const rel = a.v.cmp(b.v) + 1;
          const sym = ["<", "=", ">"][rel] as string;
          const wrongs: MathWrong[] =
            rel === 1
              ? [
                  ["<", "They are the same number written two ways.", "它们是同一个数的两种写法。"],
                  [">", "They are the same number written two ways.", "它们是同一个数的两种写法。"],
                ]
              : [
                  [
                    rel === 0 ? ">" : "<",
                    `That flips the order: $${a.latex}$ is farther ${rel === 0 ? "left" : "right"} on the number line.`,
                    `顺序反了：$${a.latex}$ 在数轴上更靠${rel === 0 ? "左" : "右"}。`,
                  ],
                  ["=", "They are different numbers, at different points.", "它们是不同的数，在不同的点上。"],
                ];
          const diff = a.v.sub(b.v);
          return chosenMath(
            rng,
            [
              `Which symbol makes this true? $$${a.latex} \\ \\square \\ ${b.latex}$$`,
              `方框中应填哪个符号？$$${a.latex} \\ \\square \\ ${b.latex}$$`,
            ],
            sym,
            wrongs,
            [
              sameForm([a, b]),
              [
                ["Compare", "比较"],
                rel === 1
                  ? ["They are the same point on the number line:", "它们是数轴上的同一个点："]
                  : [
                      `$${dec(a.v)}$ is farther ${rel === 0 ? "left" : "right"} on the number line:`,
                      `数轴上 $${dec(a.v)}$ 更靠${rel === 0 ? "左" : "右"}：`,
                    ],
                [`${a.latex} ${sym} ${b.latex}`],
              ],
            ],
            [
              `Subtract: $${dec(a.v)} - (${dec(b.v)}) = ${dec(diff)}$, which is ${diff.sign() > 0 ? "positive" : diff.sign() < 0 ? "negative" : "zero"}.`,
              `相减：$${dec(a.v)} - (${dec(b.v)}) = ${dec(diff)}$，${diff.sign() > 0 ? "是正数" : diff.sign() < 0 ? "是负数" : "是零"}。`,
            ],
            numberLine(-5, 5, 1, [
              { at: a.v.toNumber(), label: "A" },
              { at: b.v.toNumber(), label: "B" },
            ]),
          );
        },
        drawn(gradeDrawings3["comparing-rational-numbers#comparing-two-rational-numbers"]),
      ),
      lesson(
        "comparing-rational-numbers-in-context",
        ["Comparing in context", "在情境中比较"],
        [
          [
            "For temperatures, a lower number means colder: write both temperatures in the same form, and the smaller number is the colder one. At $-4.5^\\circ$C and $-4\\frac{1}{4}^\\circ$C, write $-4\\frac{1}{4} = -4.25$; the colder is the smaller number, $-4.5 < -4.25$.",
            "对于气温，数越小越冷：先把两个温度写成同一种形式，较小的那个更冷。$-4.5^\\circ$C 与 $-4\\frac{1}{4}^\\circ$C：$-4\\frac{1}{4} = -4.25$；更冷的是较小的数，$-4.5 < -4.25$。",
          ],
          [
            "$-4.5$ is $4.5$ degrees below zero and $-4.25$ only $4.25$, so $-4.5$ is colder.",
            "$-4.5$ 是零下 $4.5$ 度，$-4.25$ 只是零下 $4.25$ 度，所以 $-4.5$ 更冷。",
          ],
          ["$4.5 > 4.25$, but below zero the bigger size means colder, not warmer.", "$4.5 > 4.25$，但在零下，大小越大越冷，不是越暖。"],
        ],
        (rng) => {
          const a = Q.of(-rng.int(11, 99), 10);
          let b = Q.of(-rng.int(5, 40), 4);
          while (b.eq(a) || b.isInteger()) b = Q.of(-rng.int(5, 40), 4);
          const osloColder = a.cmp(b) < 0;
          const [cold, warm] = osloColder ? [a, b] : [b, a];
          const [right, wrong]: [Pair, Pair] = osloColder
            ? [
                ["Oslo", "奥斯陆"],
                ["Helsinki", "赫尔辛基"],
              ]
            : [
                ["Helsinki", "赫尔辛基"],
                ["Oslo", "奥斯陆"],
              ];
          return chosen(
            rng,
            [
              `At noon the temperature in Oslo was $${dec(a)}^\\circ$C and in Helsinki it was $${mq(b)}^\\circ$C. Which city was colder?`,
              `中午奥斯陆的气温是 $${dec(a)}^\\circ$C，赫尔辛基的气温是 $${mq(b)}^\\circ$C。哪个城市更冷？`,
            ],
            right,
            [
              [
                wrong,
                `Its temperature, $${dec(warm)}$, is closer to zero, so it is warmer.`,
                `它的气温 $${dec(warm)}$ 离零更近，所以更暖。`,
              ],
            ],
            [
              [
                ["Same form", "化成同一种形式"],
                ["Write Helsinki's temperature as a decimal:", "把赫尔辛基的气温化成小数："],
                [`${mq(b)} = ${dec(b)}`],
              ],
              [
                ["Compare", "比较"],
                ["The colder temperature is the smaller number:", "更冷的气温是较小的数："],
                [`${dec(cold)} < ${dec(warm)}`],
              ],
            ],
            [
              `$${dec(cold)}$ is $${dec(cold.neg())}$ degrees below zero, more than $${dec(warm.neg())}$.`,
              `$${dec(cold)}$ 是零下 $${dec(cold.neg())}$ 度，比零下 $${dec(warm.neg())}$ 度更冷。`,
            ],
            numberLine(-10, 0, 1, [
              { at: a.toNumber(), label: "O" },
              { at: b.toNumber(), label: "H" },
            ]),
          );
        },
        numberLine(-5, -3, 4, [
          { at: -4.5, label: "O" },
          { at: -4.25, label: "H" },
        ]),
      ),
    ],
  ),
  [
    "Two divers report their depths: one at $-1.2$ meters, the other at $-1\\frac{3}{4}$ meters. Which one is higher in the water?",
    "两名潜水员报告深度：一人在 $-1.2$ 米，另一人在 $-1\\frac{3}{4}$ 米。谁在水里的位置更高？",
  ],
  [
    "$-1\\frac{3}{4} = -1.75$, and $-1.2$ is to its right, so the diver at $-1.2$ is higher.",
    "$-1\\frac{3}{4} = -1.75$，$-1.2$ 在它的右边，所以 $-1.2$ 米的潜水员更高。",
  ],
  ["compare fractions and decimals, positive and negative, using the number line.", "借助数轴比较正负分数和小数的大小。"],
);

/** distinctRationals draws n rational numbers with distinct values. */
function distinctRationals(rng: Rng, n: number): RationalForm[] {
  const out: RationalForm[] = [];
  while (out.length < n) {
    const r = randomRational(rng);
    if (out.every((o) => !o.v.eq(r.v))) out.push(r);
  }
  return out;
}

/** listLatex writes numbers in order, separated by commas. */
const listLatex = (rs: readonly RationalForm[]) => rs.map((r) => r.latex).join(",\\ ");

export const orderingRationalNumbers = withIntro(
  topic(
    "ordering-rational-numbers",
    t("Ordering Rational Numbers", "有理数排序"),
    t(
      "To order rational numbers, write them in the same form (decimals are easiest) and place them on a number line: from least to greatest, −2 1/2, −1.8, 0.4, 3/4.",
      "给有理数排序，先把它们化成同一种形式（小数最方便），再在数轴上找位置：从小到大是 −2 1/2、−1.8、0.4、3/4。",
    ),
    ["comparing-rational-numbers"],
    ["6.NS.C.7a"],
    [
      lesson(
        "ordering-least-to-greatest",
        ["Least to greatest", "从小到大排列"],
        [
          [
            "Write every number as a decimal, then order them as on a number line: negatives first, the one farthest from zero first, then the positives. $0.4$, $-1.8$, $\\frac{3}{4}$, $-2\\frac{1}{2}$ are $0.4$, $-1.8$, $0.75$, $-2.5$, so the order is $-2\\frac{1}{2}, -1.8, 0.4, \\frac{3}{4}$.",
            "把每个数都化成小数，再像在数轴上一样排序：先排负数，离 $0$ 最远的最小，然后是正数。$0.4$、$-1.8$、$\\frac{3}{4}$、$-2\\frac{1}{2}$ 分别是 $0.4$、$-1.8$、$0.75$、$-2.5$，所以从小到大是 $-2\\frac{1}{2}, -1.8, 0.4, \\frac{3}{4}$。",
          ],
          [
            "Each step to the right gets bigger: $-2.5 < -1.8$, $-1.8 < 0.4$ and $0.4 < 0.75$.",
            "每往右一步都更大：$-2.5 < -1.8$，$-1.8 < 0.4$，$0.4 < 0.75$。",
          ],
          ["Ordering by size alone puts $0.4$ before $-1.8$; the signs come first.", "只看大小会把 $0.4$ 排在 $-1.8$ 前面；要先看符号。"],
        ],
        (rng) => {
          const xs = distinctRationals(rng, 4);
          const sorted = [...xs].sort((a, b) => a.v.cmp(b.v));
          const byAbs = [...xs].sort((a, b) => a.v.abs().cmp(b.v.abs()));
          const [s0, s1, s2, s3] = sorted as [RationalForm, RationalForm, RationalForm, RationalForm];
          const right = listLatex(sorted);
          const candidates: MathWrong[] = [
            [listLatex(byAbs), "That orders by distance from zero and ignores the signs.", "这是按离零的距离排的，忽略了符号。"],
            [listLatex([...sorted].reverse()), "That is from greatest to least.", "这是从大到小。"],
            [
              listLatex([s1, s0, s2, s3]),
              `The first two are swapped: $${s0.latex}$ is less than $${s1.latex}$.`,
              `前两个顺序反了：$${s0.latex}$ 比 $${s1.latex}$ 小。`,
            ],
          ];
          const wrongs = candidates.filter(([w], i) => w !== right && candidates.findIndex(([v]) => v === w) === i);
          return chosenMath(
            rng,
            [
              `Which list orders these numbers from least to greatest? $$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
              `哪一组把这些数按从小到大的顺序排列？$$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
            ],
            right,
            wrongs,
            [
              sameForm(xs),
              [
                ["Order", "排序"],
                ["Place them from left to right on the number line:", "在数轴上从左到右排列："],
                [sorted.map((r) => dec(r.v)).join(" < ")],
              ],
            ],
            [
              `Each neighbor is bigger: ${[0, 1, 2].map((i) => `$${dec((sorted[i] as RationalForm).v)} < ${dec((sorted[i + 1] as RationalForm).v)}$`).join(", ")}.`,
              `每个都比前一个大：${[0, 1, 2].map((i) => `$${dec((sorted[i] as RationalForm).v)} < ${dec((sorted[i + 1] as RationalForm).v)}$`).join("，")}。`,
            ],
          );
        },
        drawn(gradeDrawings3["ordering-rational-numbers#ordering-least-to-greatest"]),
      ),
      lesson(
        "finding-the-least",
        ["Finding the least", "找出最小的数"],
        [
          [
            "To find the least number, write them all as decimals, rounding long ones, and look for the one farthest left on the number line; among negatives, the one with the largest absolute value is the least. $-1.6$, $-1\\frac{2}{3}$, $-\\frac{3}{2}$ are about $-1.6$, $-1.67$ and $-1.5$, so $-1\\frac{2}{3}$ is the least.",
            "找最小的数时，把它们都化成小数（除不尽的取近似值），看哪个在数轴上最靠左；负数中，绝对值最大的那个最小。$-1.6$、$-1\\frac{2}{3}$、$-\\frac{3}{2}$ 约为 $-1.6$、$-1.67$、$-1.5$，所以 $-1\\frac{2}{3}$ 最小。",
          ],
          [
            "$-1\\frac{2}{3}$ is $1\\frac{2}{3}$ below zero, farther than $1.6$ and $1\\frac{1}{2}$.",
            "$-1\\frac{2}{3}$ 在零下 $1\\frac{2}{3}$，比 $1.6$ 和 $1\\frac{1}{2}$ 都远。",
          ],
          [
            "The least is not the one closest to zero: for negatives, farther from zero is smaller.",
            "最小的不是离零最近的：负数离零越远越小。",
          ],
        ],
        (rng) => {
          const xs = distinctRationals(rng, 4);
          const least = xs.reduce((m, r) => (r.v.cmp(m.v) < 0 ? r : m));
          const greatest = xs.reduce((m, r) => (r.v.cmp(m.v) > 0 ? r : m));
          return chosenMath(
            rng,
            [
              `Which number is the least? $$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
              `哪个数最小？$$${xs.map((r) => r.latex).join(",\\quad ")}$$`,
            ],
            least.latex,
            xs
              .filter((r) => r !== least)
              .map(
                (r): MathWrong =>
                  r === greatest
                    ? [r.latex, "That is the greatest, farthest right on the number line.", "这是最大的数，在数轴最右边。"]
                    : r.v.sign() < 0 && r.v.abs().cmp(least.v.abs()) < 0
                      ? [r.latex, `It is negative, but closer to zero than $${least.latex}$.`, `它是负数，但比 $${least.latex}$ 离零更近。`]
                      : [
                          r.latex,
                          `It is greater than $${least.latex}$, to its right on the number line.`,
                          `它比 $${least.latex}$ 大，在数轴上它的右边。`,
                        ],
              ),
            [
              sameForm(xs),
              [
                ["Find the leftmost", "找最左边的数"],
                ["The least is farthest left on the number line:", "最小的数在数轴最左边："],
                [`${dec(least.v)}`],
              ],
            ],
            [
              `Every other number minus $${dec(least.v)}$ is positive: it is below all the others.`,
              `其他每个数减去 $${dec(least.v)}$ 都是正数：它比其他数都小。`,
            ],
          );
        },
        drawn(gradeDrawings3["ordering-rational-numbers#finding-the-least"]),
      ),
    ],
  ),
  [
    "Four friends record the lowest winter temperature in their towns: $0.4$, $-1.8$, $\\frac{3}{4}$ and $-2\\frac{1}{2}$ degrees. They want to line the towns up from coldest to warmest.",
    "四个朋友记下各自城镇冬天的最低气温：$0.4$、$-1.8$、$\\frac{3}{4}$ 和 $-2\\frac{1}{2}$ 度。他们想把城镇从最冷到最暖排成一排。",
  ],
  [
    "As decimals they are $0.4$, $-1.8$, $0.75$, $-2.5$, so coldest to warmest is $-2.5, -1.8, 0.4, 0.75$.",
    "化成小数是 $0.4$、$-1.8$、$0.75$、$-2.5$，所以从最冷到最暖是 $-2.5, -1.8, 0.4, 0.75$。",
  ],
  ["order rational numbers and find the least by writing them in the same form.", "把有理数化成同一种形式，再排序并找出最小的数。"],
);

// ---------------------------------------------------------------------------
// The coordinate plane

/** grid draws the plane from −n to n with the marks. */
function grid(n: number, marks: readonly PlaneMark[], step = 1, alt: Text): Figure {
  return { svg: plane({ xMin: -n, xMax: n, yMin: -n, yMax: n, step, labelEvery: 2 }, marks), alt };
}

/** quadrantOf numbers the quadrant a point lies in from 0 (I) to 3 (IV), or 4 on an axis. */
function quadrantOf(x: number, y: number): number {
  if (x === 0 || y === 0) return 4;
  if (x > 0) return y > 0 ? 0 : 3;
  return y > 0 ? 1 : 2;
}

/** quadrantOptions are the places a point can be: the four quadrants or an axis. */
const quadrantOptions: readonly Pair[] = [
  ["Quadrant I", "第一象限"],
  ["Quadrant II", "第二象限"],
  ["Quadrant III", "第三象限"],
  ["Quadrant IV", "第四象限"],
  ["On an axis", "在坐标轴上"],
];

/** quadrantSigns are the signs of the coordinates in each quadrant. */
const quadrantSigns = ["(+, +)", "(-, +)", "(-, -)", "(+, -)"] as const;

/** nonZero draws a whole number in [−n, n] other than 0. */
const nonZero = (rng: Rng, n: number) => rng.nonZero(-n, n);

/** sideWords says how far right or left and up or down a point is from the origin. */
function sideWords(x: number | string, y: number | string, xs: number, ys: number): Pair {
  return [
    `${xs > 0 ? "right" : "left"} $${x}$ and ${ys > 0 ? "up" : "down"} $${y}$`,
    `向${xs > 0 ? "右" : "左"} $${x}$、向${ys > 0 ? "上" : "下"} $${y}$`,
  ];
}

/** quadrantsFigure shows one point in each quadrant, A to D counterclockwise from the upper right. */
const quadrantsFigure = grid(
  6,
  [
    { kind: "point", at: [3, 4], label: "A", accent: true },
    { kind: "point", at: [-3, 4], label: "B", accent: true },
    { kind: "point", at: [-3, -4], label: "C", accent: true },
    { kind: "point", at: [3, -4], label: "D", accent: true },
  ],
  1,
  t(
    "A coordinate grid from −6 to 6 with A(3, 4) in Quadrant I, B(−3, 4) in II, C(−3, −4) in III and D(3, −4) in IV.",
    "坐标网格（−6 到 6）：A(3, 4) 在第一象限，B(−3, 4) 在第二象限，C(−3, −4) 在第三象限，D(3, −4) 在第四象限。",
  ),
);

export const theCartesianCoordinateSystem = withIntro(
  topic(
    "the-cartesian-coordinate-system",
    t("The Cartesian Coordinate System", "平面直角坐标系"),
    t(
      "Extending both axes past 0 splits the plane into four quadrants, numbered I to IV counterclockwise from the upper right. The signs of the coordinates tell the quadrant: (+, +) is in I, (−, +) in II, (−, −) in III and (+, −) in IV. A point with a zero coordinate lies on an axis.",
      "把两条坐标轴向 0 的另一侧延长，平面被分成四个象限，从右上开始按逆时针方向依次为第一到第四象限。坐标的符号决定象限：(+, +) 在第一象限，(−, +) 在第二象限，(−, −) 在第三象限，(+, −) 在第四象限。有一个坐标为 0 的点在坐标轴上。",
    ),
    ["the-coordinate-plane", "describing-the-coordinate-plane"],
    ["6.NS.C.6b", "6.NS.C.6c"],
    [
      lesson(
        "naming-the-quadrant",
        ["Naming the quadrant", "判断所在象限"],
        [
          [
            "The axes split the plane into four quadrants, numbered counterclockwise from the upper right. The signs tell the quadrant: I is $(+, +)$, II is $(-, +)$, III is $(-, -)$, IV is $(+, -)$. $(-3, 5)$ has a negative $x$ and a positive $y$, so it is in Quadrant II.",
            "坐标轴把平面分成四个象限，从右上方开始按逆时针方向编号。坐标的正负决定象限：第一象限 $(+, +)$，第二象限 $(-, +)$，第三象限 $(-, -)$，第四象限 $(+, -)$。$(-3, 5)$ 的 $x$ 为负、$y$ 为正，所以在第二象限。",
          ],
          [
            "Plot it: $3$ left of the origin and $5$ up lands in the upper left part, which is Quadrant II.",
            "描出来：从原点向左 $3$、向上 $5$，落在左上部分，就是第二象限。",
          ],
          [
            "A point with a $0$ coordinate, like $(4, 0)$, lies on an axis and is in no quadrant.",
            "有一个坐标是 $0$ 的点，例如 $(4, 0)$，在坐标轴上，不属于任何象限。",
          ],
        ],
        (rng) => {
          const onAxis = rng.bool(0.15);
          const x = onAxis && rng.bool() ? 0 : nonZero(rng, 12);
          const y = onAxis && x !== 0 ? 0 : nonZero(rng, 12);
          const q = quadrantOf(x, y);
          const sign = (v: number) => (v > 0 ? "+" : v < 0 ? "-" : "0");
          const signs = `(${sign(x)}, ${sign(y)})`;
          const wrongs = [0, 1, 2, 3, 4]
            .filter((k) => k !== q)
            .map((k): Wrong => {
              const option = quadrantOptions[k] as Pair;
              if (k === 4)
                return [
                  option,
                  "Neither coordinate is $0$, so the point is not on an axis.",
                  "两个坐标都不是 $0$，所以这个点不在坐标轴上。",
                ];
              if (q === 4)
                return [
                  option,
                  "One coordinate is $0$, so the point lies on an axis, not inside a quadrant.",
                  "有一个坐标是 $0$，点在坐标轴上，不在任何象限里。",
                ];
              return [
                option,
                `${option[0]} has signs $${quadrantSigns[k]}$, but here they are $${signs}$.`,
                `${option[1]}的符号是 $${quadrantSigns[k]}$，而这里是 $${signs}$。`,
              ];
            });
          const [right, left] = [x > 0 ? "right" : x < 0 ? "left" : "", x > 0 ? "右" : x < 0 ? "左" : ""];
          const [up, down] = [y > 0 ? "up" : y < 0 ? "down" : "", y > 0 ? "上" : y < 0 ? "下" : ""];
          return chosen(
            rng,
            [`Where is the point $(${x}, ${y})$?`, `点 $(${x}, ${y})$ 在哪里？`],
            quadrantOptions[q] as Pair,
            wrongs,
            [
              [
                ["Signs", "看符号"],
                [`The signs of the coordinates are $${signs}$.`, `坐标的符号是 $${signs}$。`],
              ],
              [
                ["Quadrant", "判断象限"],
                q === 4
                  ? ["A coordinate is $0$, so the point is on an axis.", "有一个坐标是 $0$，所以点在坐标轴上。"]
                  : [
                      `$${quadrantSigns[q]}$ is ${(quadrantOptions[q] as Pair)[0]}.`,
                      `$${quadrantSigns[q]}$ 是${(quadrantOptions[q] as Pair)[1]}。`,
                    ],
              ],
            ],
            q === 4
              ? [
                  `Plot it: moving from the origin along only one axis keeps the point on that axis.`,
                  `描出来：从原点只沿一条坐标轴移动，点就一直在这条轴上。`,
                ]
              : [
                  `Plot it: ${right} $${Math.abs(x)}$ and ${up} $${Math.abs(y)}$ from the origin lands in ${(quadrantOptions[q] as Pair)[0]}.`,
                  `描出来：从原点向${left} $${Math.abs(x)}$、向${down} $${Math.abs(y)}$，落在${(quadrantOptions[q] as Pair)[1]}。`,
                ],
            quadrantsFigure,
          );
        },
        quadrantsFigure,
      ),
      lesson(
        "reading-coordinates-in-four-quadrants",
        ["Reading coordinates", "读出点的坐标"],
        [
          [
            "Start at the origin. The $x$-coordinate says how far right ($+$) or left ($-$) to go; the $y$-coordinate says how far up ($+$) or down ($-$). A point $3$ units left of the origin and $2$ units down is $(-3, -2)$.",
            "从原点出发。$x$ 坐标表示向右（$+$）或向左（$-$）走多远；$y$ 坐标表示向上（$+$）或向下（$-$）走多远。在原点左边 $3$ 个单位、下面 $2$ 个单位的点是 $(-3, -2)$。",
          ],
          [
            "Drop straight up to the $x$-axis: you land at $-3$. Go straight across to the $y$-axis: you land at $-2$.",
            "竖直走到 $x$ 轴，落在 $-3$；水平走到 $y$ 轴，落在 $-2$。",
          ],
          ["The $x$-coordinate comes first: $(-2, -3)$ is a different point.", "$x$ 坐标写在前面：$(-2, -3)$ 是另一个点。"],
        ],
        (rng) => {
          let x = nonZero(rng, 5);
          let y = nonZero(rng, 5);
          while ((x > 0 && y > 0) || x === y) [x, y] = [nonZero(rng, 5), nonZero(rng, 5)];
          const name = rng.pick(["A", "B", "P", "Q"]);
          const [en, zh] = sideWords(Math.abs(x), Math.abs(y), x, y);
          return located(
            [`Write the coordinates of point $${name}$.`, `写出点 $${name}$ 的坐标。`],
            [x, y],
            [
              [
                ["Across", "横向"],
                [
                  `From the origin, $${name}$ is ${x > 0 ? "right" : "left"} $${Math.abs(x)}$:`,
                  `从原点看，$${name}$ 在向${x > 0 ? "右" : "左"} $${Math.abs(x)}$ 处：`,
                ],
                [`x = ${x}`],
              ],
              [
                ["Up or down", "纵向"],
                [`Then it is ${y > 0 ? "up" : "down"} $${Math.abs(y)}$:`, `再向${y > 0 ? "上" : "下"} $${Math.abs(y)}$：`],
                [`y = ${y}`, `${name} = ${pointLatex([x, y])}`],
              ],
            ],
            [
              `Plot $${pointLatex([x, y])}$: ${en} from the origin lands on $${name}$.`,
              `描出 $${pointLatex([x, y])}$：从原点${zh}，正好落在 $${name}$ 上。`,
            ],
            [
              [[y, x], "That swaps the coordinates: the $x$-coordinate comes first.", "这把两个坐标写反了：$x$ 坐标写在前面。"],
              [
                [-x, y],
                `That gets the sign of $x$ wrong: $${name}$ is ${x > 0 ? "right" : "left"} of the $y$-axis.`,
                `$x$ 的符号错了：$${name}$ 在 $y$ 轴${x > 0 ? "右" : "左"}边。`,
              ],
              [
                [x, -y],
                `That gets the sign of $y$ wrong: $${name}$ is ${y > 0 ? "above" : "below"} the $x$-axis.`,
                `$y$ 的符号错了：$${name}$ 在 $x$ 轴${y > 0 ? "上方" : "下方"}。`,
              ],
              [
                [Math.abs(x), Math.abs(y)],
                "That drops the negative signs; left and down are negative.",
                "这丢了负号；向左和向下是负方向。",
              ],
            ],
            grid(
              6,
              [{ kind: "point", at: [x, y], label: name, accent: true }],
              1,
              t(`Point ${name} on a coordinate grid from −6 to 6.`, `坐标网格（−6 到 6）上的点 ${name}。`),
            ),
          );
        },
        grid(
          6,
          [{ kind: "point", at: [-3, -2], label: "P", accent: true }],
          1,
          t("Point P at (−3, −2) on a coordinate grid from −6 to 6.", "坐标网格（−6 到 6）上的点 P(−3, −2)。"),
        ),
      ),
    ],
  ),
  [
    "A treasure map puts the camp at the origin. The note says: walk $4$ steps west and then $2$ steps south. Where is the treasure?",
    "藏宝图把营地放在原点。纸条上写着：向西走 $4$ 步，再向南走 $2$ 步。宝藏在哪里？",
  ],
  [
    "West is left and south is down, so the treasure is at $(-4, -2)$, in Quadrant III.",
    "向西是向左，向南是向下，所以宝藏在 $(-4, -2)$，位于第三象限。",
  ],
  ["read and name points in all four quadrants of the coordinate plane.", "在坐标平面的四个象限中读出和描述点。"],
);

/** halvesFigure draws points on a grid from −4 to 4 with lines every half unit. */
const halvesFigure = (marks: readonly PlaneMark[], alt: Pair) => grid(4, marks, 0.5, t(alt[0], alt[1]));

export const rationalNumbersInTheCoordinatePlane = withIntro(
  topic(
    "rational-numbers-in-the-coordinate-plane",
    t("Rational Numbers in the Coordinate Plane", "坐标平面中的有理数"),
    t(
      "Coordinates need not be integers. On a grid with lines every half unit, a point halfway between $-3$ and $-2$ on the x-axis and between $1$ and $2$ on the y-axis is $(-2.5, 1.5)$, which is also written $\\left(-2\\frac{1}{2},\\ 1\\frac{1}{2}\\right)$.",
      "坐标不一定是整数。在每半个单位画一条线的网格上，横向在 $-3$ 与 $-2$ 正中间、纵向在 $1$ 与 $2$ 正中间的点是 $(-2.5, 1.5)$，也可写作 $\\left(-2\\frac{1}{2},\\ 1\\frac{1}{2}\\right)$。",
    ),
    ["the-cartesian-coordinate-system", "identifying-rational-numbers-on-a-number-line"],
    ["6.NS.C.6c"],
    [
      lesson(
        "reading-rational-coordinates",
        ["Reading rational coordinates", "读出有理数坐标"],
        [
          [
            "Read the scale first: with grid lines every $0.5$, each line is half a unit. Count half units and halve the count: $5$ half units left and $3$ half units up is $(-2.5, 1.5)$.",
            "先看刻度：网格线间隔 $0.5$，每格是半个单位。数出半单位的个数再除以 $2$：向左 $5$ 个半单位、向上 $3$ 个半单位是 $(-2.5, 1.5)$。",
          ],
          [
            "$-2.5$ is halfway between $-3$ and $-2$, and $1.5$ is halfway between $1$ and $2$, which is where the point sits.",
            "$-2.5$ 在 $-3$ 和 $-2$ 正中间，$1.5$ 在 $1$ 和 $2$ 正中间，点正好在那里。",
          ],
          ["$5$ lines is not $5$ units here: each line is only $0.5$.", "这里数了 $5$ 格不是 $5$ 个单位：每格只有 $0.5$。"],
        ],
        (rng) => {
          let hx = rng.nonZero(-7, 7);
          let hy = rng.nonZero(-7, 7);
          while ((hx % 2 === 0 && hy % 2 === 0) || hx === hy) [hx, hy] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
          const [x, y] = [Q.of(hx, 2), Q.of(hy, 2)];
          return placed(
            ["The grid lines are $0.5$ unit apart. Write the coordinates of point $P$.", "网格线间隔 $0.5$ 个单位。写出点 $P$ 的坐标。"],
            [x, y],
            [
              [
                ["Count", "数格"],
                [
                  `$P$ is $${Math.abs(hx)}$ half units ${hx > 0 ? "right" : "left"} and $${Math.abs(hy)}$ half units ${hy > 0 ? "up" : "down"}.`,
                  `$P$ 在向${hx > 0 ? "右" : "左"} $${Math.abs(hx)}$ 个半单位、向${hy > 0 ? "上" : "下"} $${Math.abs(hy)}$ 个半单位处。`,
                ],
              ],
              [
                ["Halve", "除以 2"],
                ["Each line is half a unit:", "每格是半个单位："],
                [`${hx} \\div 2 = ${dec(x)}`, `${hy} \\div 2 = ${dec(y)}`, `P = (${dec(x)}, ${dec(y)})`],
              ],
            ],
            [
              `$${dec(x)}$ lies between $${Math.floor(x.toNumber())}$ and $${Math.ceil(x.toNumber())}$ on the $x$-axis${y.isInteger() ? "" : `, and $${dec(y)}$ between $${Math.floor(y.toNumber())}$ and $${Math.ceil(y.toNumber())}$ on the $y$-axis`}, just where $P$ is.`,
              `$${dec(x)}$ 在 $x$ 轴上 $${Math.floor(x.toNumber())}$ 和 $${Math.ceil(x.toNumber())}$ 之间${y.isInteger() ? "" : `，$${dec(y)}$ 在 $y$ 轴上 $${Math.floor(y.toNumber())}$ 和 $${Math.ceil(y.toNumber())}$ 之间`}，正是 $P$ 的位置。`,
            ],
            [
              [
                [hx, hy],
                "That counts each line as a whole unit; the lines are $0.5$ apart.",
                "这把每格当成了 1 个单位；网格线间隔是 $0.5$。",
              ],
              [[y, x], "That swaps the coordinates: the $x$-coordinate comes first.", "这把两个坐标写反了：$x$ 坐标写在前面。"],
              [
                [x.neg(), y],
                `That gets the sign of $x$ wrong: $P$ is ${hx > 0 ? "right" : "left"} of the $y$-axis.`,
                `$x$ 的符号错了：$P$ 在 $y$ 轴${hx > 0 ? "右" : "左"}边。`,
              ],
              [
                [x, y.neg()],
                `That gets the sign of $y$ wrong: $P$ is ${hy > 0 ? "above" : "below"} the $x$-axis.`,
                `$y$ 的符号错了：$P$ 在 $x$ 轴${hy > 0 ? "上方" : "下方"}。`,
              ],
            ],
            halvesFigure(
              [{ kind: "point", at: [x.toNumber(), y.toNumber()], label: "P", accent: true }],
              ["Point P on a coordinate grid from −4 to 4 with lines every half unit.", "坐标网格（−4 到 4，每半个单位一条线）上的点 P。"],
            ),
          );
        },
        halvesFigure(
          [{ kind: "point", at: [-2.5, 1.5], label: "P", accent: true }],
          [
            "Point P at (−2.5, 1.5) on a grid from −4 to 4 with lines every half unit.",
            "坐标网格（−4 到 4，每半个单位一条线）上的点 P(−2.5, 1.5)。",
          ],
        ),
      ),
      lesson(
        "choosing-the-point-with-given-coordinates",
        ["Finding a point", "找出给定坐标的点"],
        [
          [
            "The $x$-coordinate tells how far right ($+$) or left ($-$) of the $y$-axis to go; the $y$-coordinate tells how far up or down from the $x$-axis. Read the scale before counting lines: $(-1.5, 2)$ is $1.5$ units left of the $y$-axis and $2$ units above the $x$-axis.",
            "$x$ 坐标表示在 $y$ 轴右边（$+$）或左边（$-$）多远；$y$ 坐标表示在 $x$ 轴上方或下方多远。数格之前先看刻度：$(-1.5, 2)$ 在 $y$ 轴左边 $1.5$ 个单位、$x$ 轴上方 $2$ 个单位处。",
          ],
          [
            "From the point, go straight up or down to the $x$-axis and read $-1.5$; go straight across to the $y$-axis and read $2$.",
            "从这个点竖直走到 $x$ 轴，读出 $-1.5$；水平走到 $y$ 轴，读出 $2$。",
          ],
          ["$(2, -1.5)$ is a different point: the order of the coordinates matters.", "$(2, -1.5)$ 是另一个点：坐标的顺序很重要。"],
        ],
        (rng) => {
          let hx = rng.nonZero(-7, 7);
          let hy = rng.nonZero(-7, 7);
          while (hx % 2 === 0 || hx === hy || hx === -hy) [hx, hy] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7)];
          const pts: [number, number][] = [
            [hx / 2, hy / 2],
            [hy / 2, hx / 2],
            [-hx / 2, hy / 2],
            [hx / 2, -hy / 2],
          ];
          const why: Pair[] = [
            ["", ""],
            ["That point swaps the coordinates: go across by $x$ first.", "那个点把坐标顺序弄反了：先按 $x$ 横向走。"],
            [
              `That point is on the wrong side of the $y$-axis: $x$ is ${hx > 0 ? "positive" : "negative"}.`,
              `那个点在 $y$ 轴的另一侧：$x$ 是${hx > 0 ? "正" : "负"}数。`,
            ],
            [
              `That point is on the wrong side of the $x$-axis: $y$ is ${hy > 0 ? "positive" : "negative"}.`,
              `那个点在 $x$ 轴的另一侧：$y$ 是${hy > 0 ? "正" : "负"}数。`,
            ],
          ];
          const order = rng.shuffle([0, 1, 2, 3]);
          const labels = ["A", "B", "C", "D"];
          const label = (p: number) => labels[order.indexOf(p)] as string;
          const target = `(${dec(Q.of(hx, 2))}, ${dec(Q.of(hy, 2))})`;
          return chosen(
            rng,
            [
              `The grid lines are $0.5$ unit apart. Which point is at $${target}$?`,
              `网格线间隔 $0.5$ 个单位。哪个点的坐标是 $${target}$？`,
            ],
            [`Point ${label(0)}`, `点 ${label(0)}`],
            [1, 2, 3].map((p): Wrong => [[`Point ${label(p)}`, `点 ${label(p)}`], (why[p] as Pair)[0], (why[p] as Pair)[1]]),
            [
              [
                ["Across", "横向"],
                [
                  `Go ${hx > 0 ? "right" : "left"} $${Math.abs(hx / 2)}$, which is $${Math.abs(hx)}$ lines.`,
                  `向${hx > 0 ? "右" : "左"}走 $${Math.abs(hx / 2)}$，也就是 $${Math.abs(hx)}$ 格。`,
                ],
              ],
              [
                ["Up or down", "纵向"],
                [
                  `Then ${hy > 0 ? "up" : "down"} $${Math.abs(hy / 2)}$, which is $${Math.abs(hy)}$ lines: point ${label(0)}.`,
                  `再向${hy > 0 ? "上" : "下"}走 $${Math.abs(hy / 2)}$，也就是 $${Math.abs(hy)}$ 格：是点 ${label(0)}。`,
                ],
              ],
            ],
            [
              `From point ${label(0)}, go straight to the $x$-axis and read $${dec(Q.of(hx, 2))}$, then across to the $y$-axis and read $${dec(Q.of(hy, 2))}$.`,
              `从点 ${label(0)} 竖直走到 $x$ 轴读出 $${dec(Q.of(hx, 2))}$，再水平走到 $y$ 轴读出 $${dec(Q.of(hy, 2))}$。`,
            ],
            halvesFigure(
              [0, 1, 2, 3].map((p): PlaneMark => ({ kind: "point", at: pts[p] as [number, number], label: label(p), accent: true })),
              [
                "Four labeled points A, B, C and D on a grid from −4 to 4 with lines every half unit.",
                "坐标网格（−4 到 4，每半个单位一条线）上的四个点 A、B、C、D。",
              ],
            ),
          );
        },
        halvesFigure(
          [
            { kind: "point", at: [-1.5, 2], label: "A", accent: true },
            { kind: "point", at: [2, -1.5], label: "B", accent: true },
          ],
          [
            "Points A(−1.5, 2) and B(2, −1.5) on a grid from −4 to 4 with lines every half unit.",
            "坐标网格（−4 到 4，每半个单位一条线）上的点 A(−1.5, 2) 和 B(2, −1.5)。",
          ],
        ),
      ),
    ],
  ),
  [
    "On a school garden plan each unit is one meter, with the gate at the origin. A sprinkler sits $2\\frac{1}{2}$ meters to the left of the gate and $1\\frac{1}{2}$ meters up.",
    "学校花园的平面图上每个单位是 1 米，大门在原点。一个洒水器在大门左边 $2\\frac{1}{2}$ 米、上方 $1\\frac{1}{2}$ 米处。",
  ],
  ["Left is negative and up is positive, so the sprinkler is at $(-2.5, 1.5)$.", "向左是负，向上是正，所以洒水器在 $(-2.5, 1.5)$。"],
  ["read and find points whose coordinates are fractions or decimals.", "读出和找到坐标是分数或小数的点。"],
);

/** mirrorFigure is the drawing of a point and its reflection across an axis. */
const mirrorFigure = drawn(gradeDrawings3["reflections-of-points-in-the-coordinate-plane#reflecting-across-an-axis"]);

export const reflectionsOfPointsInTheCoordinatePlane = withIntro(
  topic(
    "reflections-of-points-in-the-coordinate-plane",
    t("Reflections of Points in the Coordinate Plane", "坐标平面中点的对称"),
    t(
      "Reflecting a point across the x-axis changes the sign of its y-coordinate: (3, 4) → (3, −4). Reflecting across the y-axis changes the sign of its x-coordinate: (3, 4) → (−3, 4). Reflecting across both axes changes both signs: (3, 4) → (−3, −4).",
      "点关于 x 轴对称时，y 坐标变号：(3, 4) → (3, −4)。关于 y 轴对称时，x 坐标变号：(3, 4) → (−3, 4)。先后关于两条坐标轴对称，两个坐标都变号：(3, 4) → (−3, −4)。",
    ),
    ["the-cartesian-coordinate-system"],
    ["6.NS.C.6b"],
    [
      lesson(
        "reflecting-across-an-axis",
        ["Reflecting across one axis", "关于一条坐标轴对称"],
        [
          [
            "Reflecting across the $x$-axis flips a point up or down, so the $y$-coordinate changes sign and $x$ stays. Reflecting across the $y$-axis flips it left or right, so the $x$-coordinate changes sign and $y$ stays. Across the $x$-axis, $(-2, 5)$ goes to $(-2, -5)$.",
            "关于 $x$ 轴对称，点上下翻转，$y$ 坐标变成相反数，$x$ 坐标不变。关于 $y$ 轴对称，点左右翻转，$x$ 坐标变成相反数，$y$ 坐标不变。$(-2, 5)$ 关于 $x$ 轴的对称点是 $(-2, -5)$。",
          ],
          [
            "$(-2, 5)$ is $5$ above the $x$-axis and $(-2, -5)$ is $5$ below it, straight underneath: the axis is halfway.",
            "$(-2, 5)$ 在 $x$ 轴上方 $5$，$(-2, -5)$ 在它正下方、$x$ 轴下方 $5$：坐标轴正好在中间。",
          ],
          [
            "Across the $x$-axis it is $y$ that changes, not $x$: the point moves up or down.",
            "关于 $x$ 轴对称，变的是 $y$ 而不是 $x$：点是上下移动的。",
          ],
        ],
        (rng) => {
          let x = nonZero(rng, 9);
          let y = nonZero(rng, 9);
          while (Math.abs(x) === Math.abs(y)) [x, y] = [nonZero(rng, 9), nonZero(rng, 9)];
          const acrossX = rng.bool();
          const image: [number, number] = acrossX ? [x, -y] : [-x, y];
          const axis = acrossX ? "$x$" : "$y$";
          const kept = acrossX ? "$x$" : "$y$";
          const flipped = acrossX ? "$y$" : "$x$";
          const dist = Math.abs(acrossX ? y : x);
          return located(
            [
              `The point $(${x}, ${y})$ is reflected across the ${axis}-axis. What are the coordinates of its image?`,
              `点 $(${x}, ${y})$ 关于 ${axis} 轴对称，对称点的坐标是什么？`,
            ],
            image,
            [
              [
                ["Keep", "不变的坐标"],
                [
                  `The point flips ${acrossX ? "up or down" : "left or right"}, so the ${kept}-coordinate stays.`,
                  `点${acrossX ? "上下" : "左右"}翻转，所以 ${kept} 坐标不变。`,
                ],
              ],
              [
                ["Change the sign", "变号"],
                [`The ${flipped}-coordinate becomes its opposite:`, `${flipped} 坐标变成相反数：`],
                [`${acrossX ? y : x} \\to ${acrossX ? -y : -x}`, `${pointLatex([x, y])} \\to ${pointLatex(image)}`],
              ],
            ],
            [
              `Both points are $${dist}$ units from the ${axis}-axis, on opposite sides of it, and in line with each other.`,
              `两个点到 ${axis} 轴的距离都是 $${dist}$，分在轴的两侧，并且正对着。`,
            ],
            [
              [
                acrossX ? [-x, y] : [x, -y],
                `That reflects across the other axis; across the ${axis}-axis the ${kept}-coordinate stays.`,
                `这是关于另一条坐标轴对称；关于 ${axis} 轴对称时 ${kept} 坐标不变。`,
              ],
              [
                [-x, -y],
                "That changes both signs, which is reflecting across both axes.",
                "这把两个坐标都变了号，是先后关于两条坐标轴对称。",
              ],
              [[y, x], "That swaps the coordinates instead of changing a sign.", "这是交换了两个坐标，而不是改变符号。"],
            ],
            mirrorFigure,
          );
        },
        mirrorFigure,
      ),
      lesson(
        "identifying-the-reflection",
        ["Which reflection?", "是哪种对称？"],
        [
          [
            "Compare the two points coordinate by coordinate. If only $y$ changed sign, it is a reflection across the $x$-axis; if only $x$ changed sign, across the $y$-axis; if both changed, across both axes. $(4, -1)$ and $(-4, -1)$ differ only in the sign of $x$, so they are reflections across the $y$-axis.",
            "逐个坐标比较两个点。只有 $y$ 变号，是关于 $x$ 轴对称；只有 $x$ 变号，是关于 $y$ 轴对称；两个都变号，是先后关于两条坐标轴对称。$(4, -1)$ 与 $(-4, -1)$ 只有 $x$ 的符号不同，所以关于 $y$ 轴对称。",
          ],
          [
            "$(4, -1)$ and $(-4, -1)$ are at the same height, $4$ units on each side of the $y$-axis.",
            "$(4, -1)$ 和 $(-4, -1)$ 一样高，分别在 $y$ 轴两侧 $4$ 个单位处。",
          ],
          [
            "The axis you reflect across is the one whose coordinate stays the same, not the one that changes.",
            "对称轴对应的是不变的那个坐标，不是变化的那个。",
          ],
        ],
        (rng) => {
          const x = nonZero(rng, 9);
          let y = nonZero(rng, 9);
          while (Math.abs(y) === Math.abs(x)) y = nonZero(rng, 9);
          const kind = rng.int(0, 2);
          const image = kind === 0 ? [x, -y] : kind === 1 ? [-x, y] : [-x, -y];
          const options: Pair[] = [
            ["Across the $x$-axis", "关于 $x$ 轴"],
            ["Across the $y$-axis", "关于 $y$ 轴"],
            ["Across both axes", "先后关于两条坐标轴"],
          ];
          const changed: Pair =
            kind === 0
              ? ["only $y$ changed sign", "只有 $y$ 变号"]
              : kind === 1
                ? ["only $x$ changed sign", "只有 $x$ 变号"]
                : ["both signs changed", "两个坐标都变号"];
          const reasons: Pair[] = [
            ["Across the $x$-axis only $y$ would change sign.", "关于 $x$ 轴对称只会改变 $y$ 的符号。"],
            ["Across the $y$-axis only $x$ would change sign.", "关于 $y$ 轴对称只会改变 $x$ 的符号。"],
            ["Across both axes both signs would change.", "先后关于两条坐标轴对称，两个坐标都会变号。"],
          ];
          return chosen(
            rng,
            [
              `Point $(${x}, ${y})$ is reflected to $${pointLatex(image)}$. Which reflection was used?`,
              `点 $(${x}, ${y})$ 经过对称变成 $${pointLatex(image)}$。用的是哪种对称？`,
            ],
            options[kind] as Pair,
            [0, 1, 2]
              .filter((k) => k !== kind)
              .map(
                (k): Wrong => [
                  options[k] as Pair,
                  `${(reasons[k] as Pair)[0]} Here ${changed[0]}.`,
                  `${(reasons[k] as Pair)[1]}这里${changed[1]}。`,
                ],
              ),
            [
              [
                ["Compare", "比较"],
                ["Line up the coordinates:", "对齐两个点的坐标："],
                [`x: ${x} \\to ${image[0]}`, `y: ${y} \\to ${image[1]}`],
              ],
              [
                ["Name it", "判断"],
                [
                  `Here ${changed[0]}, so it is ${(options[kind] as Pair)[0].toLowerCase()}.`,
                  `这里${changed[1]}，所以是${(options[kind] as Pair)[1]}对称。`,
                ],
              ],
            ],
            [
              `Reflect $(${x}, ${y})$ that way and you get $${pointLatex(image)}$ again.`,
              `把 $(${x}, ${y})$ 这样对称一次，确实得到 $${pointLatex(image)}$。`,
            ],
            drawn(gradeDrawings3["reflections-of-points-in-the-coordinate-plane#identifying-the-reflection"]),
          );
        },
        drawn(gradeDrawings3["reflections-of-points-in-the-coordinate-plane#identifying-the-reflection"]),
      ),
    ],
  ),
  [
    "A butterfly's wings are mirror images. Draw the body along the $y$-axis: a spot on one wing at $(3, 2)$ has a matching spot on the other wing.",
    "蝴蝶的两只翅膀互为镜像。把身体画在 $y$ 轴上：一只翅膀上 $(3, 2)$ 处的斑点，在另一只翅膀上有一个对应的斑点。",
  ],
  [
    "The matching spot is the same height and the same distance on the other side: $(-3, 2)$.",
    "对应的斑点一样高，在另一侧同样远：$(-3, 2)$。",
  ],
  ["reflect points across the axes and recognize which reflection was used.", "把点关于坐标轴对称，并判断用的是哪种对称。"],
);

/** mapFigure shows two places on the same horizontal line, on opposite sides of the y-axis. */
const mapFigure = (a: readonly [number, number], b: readonly [number, number], n: number, alt: Pair) =>
  grid(
    n,
    [
      { kind: "segment", a: [a[0], a[1]], b: [b[0], b[1]], accent: true },
      { kind: "point", at: [a[0], a[1]], label: "S", accent: true },
      { kind: "point", at: [b[0], b[1]], label: "P", accent: true },
    ],
    1,
    t(alt[0], alt[1]),
  );

export const solvingProblemsInTheCoordinatePlane = withIntro(
  topic(
    "solving-problems-in-the-coordinate-plane",
    t("Solving Problems in the Coordinate Plane", "解决坐标平面中的问题"),
    t(
      "Two points with the same y-coordinate are |x₁ − x₂| apart, and when they are on opposite sides of the y-axis the distance is the sum of their absolute values: (−3, 2) and (4, 2) are 3 + 4 = 7 units apart. Opposite corners of a rectangle with sides parallel to the axes share coordinates with the other corners.",
      "纵坐标相同的两点之间的距离是 |x₁ − x₂|；当它们在 y 轴两侧时，距离是两个横坐标绝对值之和：(−3, 2) 与 (4, 2) 相距 3 + 4 = 7 个单位。边与坐标轴平行的长方形，各顶点之间共用横坐标或纵坐标。",
    ),
    ["reflections-of-points-in-the-coordinate-plane", "interpreting-absolute-value"],
    ["6.NS.C.8"],
    [
      lesson(
        "distance-on-a-coordinate-map",
        ["Distances on a map", "地图上的距离"],
        [
          [
            "When two places share a coordinate, they are on one straight line. If they are on opposite sides of an axis, add their distances to it: the library at $(-3, 2)$ and the park at $(4, 2)$ are $3 + 4 = 7$ units apart. Then multiply by the map scale.",
            "两个地点有一个坐标相同时，它们在同一条直线上。如果分在坐标轴两侧，就把它们到轴的距离相加：图书馆 $(-3, 2)$ 和公园 $(4, 2)$ 相距 $3 + 4 = 7$ 个单位。再乘地图的比例。",
          ],
          ["Subtract the different coordinates: $4 - (-3) = 7$, the same distance.", "用不同的那个坐标相减：$4 - (-3) = 7$，距离相同。"],
          [
            "$4 - 3 = 1$ is wrong: the two places are on opposite sides of the axis, so the distances add.",
            "$4 - 3 = 1$ 是错的：两个地点在坐标轴两侧，距离要相加。",
          ],
        ],
        (rng) => {
          const a = -rng.int(1, 9);
          let b = rng.int(1, 9);
          while (b === -a) b = rng.int(1, 9);
          const c = nonZero(rng, 9);
          const horizontal = rng.bool();
          const p: [number, number] = horizontal ? [a, c] : [c, a];
          const q: [number, number] = horizontal ? [b, c] : [c, b];
          const scale = rng.int(1, 3) * 100;
          const units = b - a;
          const shared = horizontal ? "$y$" : "$x$";
          const axis = horizontal ? "$y$" : "$x$";
          return valued(
            [
              `On a town map, the school is at $${pointLatex(p)}$ and the pool is at $${pointLatex(q)}$. Each unit on the map is $${scale}$ meters. How many meters apart are the school and the pool?`,
              `在城镇地图上，学校在 $${pointLatex(p)}$，游泳池在 $${pointLatex(q)}$。地图上每个单位代表 $${scale}$ 米。学校和游泳池相距多少米？`,
            ],
            units * scale,
            [
              [
                ["Units", "求单位数"],
                [
                  `They share the ${shared}-coordinate $${c}$ and are on opposite sides of the ${axis}-axis, so add the distances:`,
                  `它们的 ${shared} 坐标都是 $${c}$，分在 ${axis} 轴两侧，所以把距离相加：`,
                ],
                [`${-a} + ${b} = ${units}`],
              ],
              [["Meters", "换成米"], ["Multiply by the map scale:", "乘地图比例："], [`${units} \\times ${scale} = ${units * scale}`]],
            ],
            [
              `Subtract the coordinates that differ: $${b} - (${a}) = ${units}$ units, and $${units * scale} \\div ${scale} = ${units}$.`,
              `用不同的坐标相减：$${b} - (${a}) = ${units}$ 个单位，而 $${units * scale} \\div ${scale} = ${units}$。`,
            ],
            [
              [
                Math.abs(b + a) * scale,
                "That subtracts the distances; on opposite sides of the axis they add.",
                "这把距离相减了；在坐标轴两侧时距离要相加。",
              ],
              [units, "That is the distance in map units; multiply by the scale for meters.", "这是地图上的单位数；还要乘比例换成米。"],
              [
                (units + 1) * scale,
                "That counts the grid lines, one more than the units between them.",
                "这数的是网格线，比中间的单位数多 1。",
              ],
            ],
            { form: "integer", unit: "m" },
          );
        },
        mapFigure([-3, 2], [4, 2], 5, [
          "Points S(−3, 2) and P(4, 2) joined by a segment 7 units long.",
          "点 S(−3, 2) 与 P(4, 2) 用一条长 7 个单位的线段连接。",
        ]),
      ),
      lesson(
        "the-fourth-vertex-of-a-rectangle",
        ["Completing a rectangle", "补全长方形"],
        [
          [
            "In a rectangle with sides parallel to the axes, each $x$-coordinate and each $y$-coordinate is used by exactly two vertices. The fourth vertex takes the $x$ and the $y$ that appear only once: from $(-2, 3)$, $(4, 3)$, $(4, -1)$, the fourth vertex is $(-2, -1)$.",
            "边与坐标轴平行的长方形中，每个 $x$ 坐标和每个 $y$ 坐标都恰好用在两个顶点上。第四个顶点取只出现一次的 $x$ 和 $y$：由 $(-2, 3)$、$(4, 3)$、$(4, -1)$，得第四个顶点是 $(-2, -1)$。",
          ],
          [
            "$(-2, -1)$ is straight below $(-2, 3)$ and straight left of $(4, -1)$, so all four sides are horizontal or vertical.",
            "$(-2, -1)$ 在 $(-2, 3)$ 正下方、$(4, -1)$ 正左方，四条边都是横的或竖的。",
          ],
          ["Do not change signs: the fourth vertex reuses coordinates already given.", "不要变号：第四个顶点用的是已经给出的坐标。"],
        ],
        (rng) => {
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
          const [mx, my] = missing;
          const opposite = given.find(([gx, gy]) => gx !== mx && gy !== my) as [number, number];
          return located(
            [
              `Three vertices of a rectangle with sides parallel to the axes are $${given.map((g) => pointLatex(g)).join("$, $")}$. What is the fourth vertex?`,
              `一个边与坐标轴平行的长方形有三个顶点 $${given.map((g) => pointLatex(g)).join("$、$")}$。第四个顶点是什么？`,
            ],
            missing,
            [
              [
                ["The $x$-coordinate", "求 $x$ 坐标"],
                [
                  `Among the given vertices, $x = ${mx}$ appears only once, so the fourth vertex needs it.`,
                  `已知顶点中 $x = ${mx}$ 只出现一次，所以第四个顶点要用它。`,
                ],
              ],
              [
                ["The $y$-coordinate", "求 $y$ 坐标"],
                [`Likewise $y = ${my}$ appears only once:`, `同样 $y = ${my}$ 只出现一次：`],
                [`${pointLatex(missing)}`],
              ],
            ],
            [
              `$${pointLatex(missing)}$ and the opposite corner $${pointLatex(opposite)}$ share no coordinate, while each other vertex shares one with it.`,
              `$${pointLatex(missing)}$ 和对角的顶点 $${pointLatex(opposite)}$ 没有相同的坐标，而和另外两个顶点各有一个坐标相同。`,
            ],
            [
              [
                [-mx, my],
                "That changes the sign of $x$; the fourth vertex reuses a given $x$.",
                "这把 $x$ 变了号；第四个顶点用的是已经给出的 $x$。",
              ],
              [
                [mx, -my],
                "That changes the sign of $y$; the fourth vertex reuses a given $y$.",
                "这把 $y$ 变了号；第四个顶点用的是已经给出的 $y$。",
              ],
              [[my, mx], "That swaps the coordinates: the $x$-coordinate comes first.", "这把两个坐标写反了：$x$ 坐标写在前面。"],
              [
                opposite.map((v) => -v),
                "That reflects the opposite corner through the origin, which is not a vertex.",
                "这是把对角顶点关于原点对称，不是长方形的顶点。",
              ],
            ],
            drawn(gradeDrawings3["solving-problems-in-the-coordinate-plane#the-fourth-vertex-of-a-rectangle"]),
          );
        },
        drawn(gradeDrawings3["solving-problems-in-the-coordinate-plane#the-fourth-vertex-of-a-rectangle"]),
      ),
    ],
  ),
  [
    "A park ranger's map has the visitor center at the origin. The lake is at $(-3, 2)$ and the campsite at $(4, 2)$, and each unit is $100$ meters.",
    "护林员的地图把游客中心放在原点。湖在 $(-3, 2)$，营地在 $(4, 2)$，每个单位是 $100$ 米。",
  ],
  [
    "They share $y = 2$ and lie on opposite sides of the $y$-axis: $3 + 4 = 7$ units, or $700$ meters.",
    "它们的 $y$ 都是 $2$，在 $y$ 轴两侧：$3 + 4 = 7$ 个单位，即 $700$ 米。",
  ],
  ["find distances between points and complete rectangles in all four quadrants.", "在四个象限中求两点间的距离、补全长方形。"],
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
