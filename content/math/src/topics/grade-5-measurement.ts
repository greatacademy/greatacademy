import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, type Mark, type PlaneMark, type Point, plane, Q, sketch, svgDocument } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem, pointLatex, pointProblem, yesNo } from "../problems.ts";
import { fractionPlot } from "./grade-4-measurement.ts";

// 5th Grade Math: converting to larger units, line plots, the first quadrant, numerical patterns, volume, and polygons.

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

/** pickChoice builds a choice problem from a correct option and distinct wrong ones, keeping at most three wrong ones. */
function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const others = wrong.filter((w, i) => w.en !== correct.en && wrong.findIndex((x) => x.en === w.en) === i).slice(0, 3);
  const options = rng.shuffle([correct, ...others]);
  const p = choiceProblem({ prompt, options, correct: options.indexOf(correct), solution });
  return figure ? { ...p, figure } : p;
}

/** fmt writes a whole number with thousands separators. */
const fmt = (n: number) => n.toLocaleString("en-US");

/** tex writes a whole number in LaTeX with thousands separators. */
const tex = (n: number) => fmt(n).replace(/,/g, "{,}");

// ---------------------------------------------------------------------------
// Converting to larger units

/** Unit is a unit of measure with its names. */
interface Unit {
  readonly one: Text;
  readonly many: Text;
}

const unit = (oneEn: string, manyEn: string, zh: string): Unit => ({ one: t(oneEn, zh), many: t(manyEn, zh) });

const km = unit("kilometer", "kilometers", "千米");
const m = unit("meter", "meters", "米");
const cm = unit("centimeter", "centimeters", "厘米");
const mm = unit("millimeter", "millimeters", "毫米");
const yd = unit("yard", "yards", "码");
const ft = unit("foot", "feet", "英尺");
const inch = unit("inch", "inches", "英寸");
const kg = unit("kilogram", "kilograms", "千克");
const g = unit("gram", "grams", "克");
const lb = unit("pound", "pounds", "磅");
const oz = unit("ounce", "ounces", "盎司");
const liter = unit("liter", "liters", "升");
const mL = unit("milliliter", "milliliters", "毫升");
const gal = unit("gallon", "gallons", "加仑");
const qt = unit("quart", "quarts", "夸脱");
const pt = unit("pint", "pints", "品脱");
const cup = unit("cup", "cups", "杯");
const week = unit("week", "weeks", "周");
const day = unit("day", "days", "天");
const hour = unit("hour", "hours", "小时");
const minute = unit("minute", "minutes", "分钟");
const second = unit("second", "seconds", "秒");

/** amountEn writes n of a unit in English, singular or plural. */
const amountEn = (n: number, u: Unit) => `${fmt(n)} ${n === 1 ? u.one.en : u.many.en}`;

/** amountZh writes n of a unit in Chinese. */
const amountZh = (n: number, u: Unit) => `${fmt(n)} ${u.one["zh-CN"]}`;

/** Conversion is a larger unit, a smaller unit and how many of the smaller make one of the larger. */
interface Conversion {
  readonly big: Unit;
  readonly small: Unit;
  readonly factor: number;
}

/** powerOfTenExponent is k when n = 10ᵏ, or undefined. */
function powerOfTenExponent(n: number): number | undefined {
  for (let k = 1; k <= 4; k++) if (n === 10 ** k) return k;
  return undefined;
}

/** largerKPs builds the two knowledge points of a conversion to a larger unit: whole results, and results with a part of a unit. */
function largerKPs(prefix: string, conversions: readonly Conversion[], example: Text, partExample: Text): KnowledgePointDef[] {
  return [
    {
      id: `${prefix}-to-larger-units`,
      title: t("Dividing by the conversion factor", "除以进率"),
      explanation: example,
      generate(rng) {
        const c = rng.pick(conversions);
        const n = rng.int(2, c.factor >= 100 ? 15 : 12);
        const total = n * c.factor;
        return numberProblem({
          prompt: t(
            `How many ${c.big.many.en} are in ${amountEn(total, c.small)}?`,
            `${amountZh(total, c.small)}是多少${c.big.one["zh-CN"]}？`,
          ),
          answer: n,
          form: "integer",
          wrong: [total * c.factor, total - c.factor, n + 1].filter((w) => w > 0 && w !== n),
          solution: t(
            `$${tex(c.factor)}$ ${c.small.many.en} make $1$ ${c.big.one.en}, so divide: $${tex(total)} \\div ${tex(c.factor)} = ${n}$ ${c.big.many.en}.`,
            `$${tex(c.factor)}$ ${c.small.one["zh-CN"]}是 $1$ ${c.big.one["zh-CN"]}，所以用除法：$${tex(total)} \\div ${tex(c.factor)} = ${n}$ ${c.big.one["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: `${prefix}-with-parts-to-larger-units`,
      title: t("Parts of a larger unit", "不满一个大单位"),
      explanation: partExample,
      generate(rng) {
        const c = rng.pick(conversions);
        let total: number;
        do total = rng.int(c.factor + 1, Math.min(9 * c.factor, c.factor * 9 + 9));
        while (total % c.factor === 0);
        const q = Math.floor(total / c.factor);
        const r = total % c.factor;
        const k = powerOfTenExponent(c.factor);
        if (k !== undefined) {
          const v = Q.of(total, c.factor);
          return numberProblem({
            prompt: t(
              `Write ${amountEn(total, c.small)} in ${c.big.many.en}, as a decimal.`,
              `把 ${amountZh(total, c.small)}写成以${c.big.one["zh-CN"]}为单位的小数。`,
            ),
            answer: v,
            form: "decimal",
            wrong: [v.mul(Q.of(10)), v.div(Q.of(10)), Q.of(q)],
            solution: t(
              `Divide by $${tex(c.factor)}$ by moving the decimal point ${k} place${k === 1 ? "" : "s"} to the left: $${tex(total)} \\div ${tex(c.factor)} = ${dec(v)}$ ${c.big.many.en}.`,
              `除以 $${tex(c.factor)}$，把小数点向左移动 ${k} 位：$${tex(total)} \\div ${tex(c.factor)} = ${dec(v)}$ ${c.big.one["zh-CN"]}。`,
            ),
          });
        }
        const v = Q.of(total, c.factor);
        return numberProblem({
          prompt: t(
            `Write ${amountEn(total, c.small)} in ${c.big.many.en}, as a mixed number.`,
            `把 ${amountZh(total, c.small)}写成以${c.big.one["zh-CN"]}为单位的带分数。`,
          ),
          answer: v,
          form: "mixed",
          wrong: [Q.of(q), r < 10 ? Q.of(q).add(Q.of(r, 10)) : Q.of(q, c.factor), Q.of(q).add(Q.of(1, r))],
          solution: t(
            `$${tex(total)} \\div ${c.factor} = ${q}$ R ${r}: that is ${amountEn(q, c.big)} and ${amountEn(r, c.small)}, and ${amountEn(r, c.small)} is $\\frac{${r}}{${c.factor}}$ of a ${c.big.one.en}. So it is $${mixedLatex(v)}$ ${c.big.many.en}.`,
            `$${tex(total)} \\div ${c.factor} = ${q}$ 余 ${r}：即 ${amountZh(q, c.big)} ${amountZh(r, c.small)}，而 ${amountZh(r, c.small)}是 $\\frac{${r}}{${c.factor}}$ ${c.big.one["zh-CN"]}。所以是 $${mixedLatex(v)}$ ${c.big.one["zh-CN"]}。`,
          ),
        });
      },
    },
  ];
}

export const convertingMetricUnitsOfLengthToLargerUnits = topic(
  "converting-metric-units-of-length-to-larger-units",
  t("Converting Metric Units of Length to Larger Units", "公制长度单位化成较大单位"),
  t(
    "To convert to a larger unit, divide by how many small units make one large unit. Metric factors are powers of ten, so dividing moves the decimal point: 4,000 m = 4 km, 2,350 m = 2.35 km and 45 cm = 0.45 m.",
    "化成较大的单位时，除以进率。公制的进率是 10、100、1000，所以除法就是移动小数点：4000 米 = 4 千米，2350 米 = 2.35 千米，45 厘米 = 0.45 米。",
  ),
  ["converting-metric-units-of-length-to-smaller-units", "dividing-decimals-by-powers-of-ten-using-decimal-point-placement"],
  ["5.MD.A.1"],
  largerKPs(
    "metric-lengths",
    [
      { big: km, small: m, factor: 1000 },
      { big: m, small: cm, factor: 100 },
      { big: cm, small: mm, factor: 10 },
      { big: m, small: mm, factor: 1000 },
    ],
    t(
      "A larger unit holds many smaller units, so the number of larger units is smaller: divide by how many small units make one large unit. $100$ cm make $1$ m and $1{,}000$ m make $1$ km.\n\n$600$ cm $= 600 \\div 100 = 6$ m.",
      "一个大单位包含许多小单位，所以换成大单位后数值变小：用小单位的数量除以进率。$100$ 厘米是 $1$ 米，$1000$ 米是 $1$ 千米。\n\n$600$ 厘米 $= 600 \\div 100 = 6$ 米。",
    ),
    t(
      "When the amount is not a whole number of larger units, the answer is a decimal. Dividing by $10$, $100$ or $1{,}000$ moves the decimal point left one, two or three places.\n\n$1{,}250$ m $= 1{,}250 \\div 1{,}000 = 1.25$ km.",
      "如果不是整数个大单位，结果就是小数。除以 $10$、$100$ 或 $1000$，小数点就向左移动一位、两位或三位。\n\n$1250$ 米 $= 1250 \\div 1000 = 1.25$ 千米。",
    ),
  ),
);

export const convertingCustomaryUnitsOfLengthToLargerUnits = topic(
  "converting-customary-units-of-length-to-larger-units",
  t("Converting Customary Units of Length to Larger Units", "英制长度单位化成较大单位"),
  t(
    "To convert inches to feet, divide by 12; feet to yards, divide by 3; inches to yards, divide by 36. A remainder is a fraction of the larger unit: 30 in = 2 ft 6 in = 2 6/12 ft = 2 1/2 ft.",
    "英寸化成英尺除以 12，英尺化成码除以 3，英寸化成码除以 36。余数是大单位的几分之几：30 英寸 = 2 英尺 6 英寸 = 2 6/12 英尺 = 2 1/2 英尺。",
  ),
  ["converting-customary-units-of-length-to-smaller-units", "converting-improper-fractions-to-mixed-numbers"],
  ["5.MD.A.1"],
  largerKPs(
    "customary-lengths",
    [
      { big: ft, small: inch, factor: 12 },
      { big: yd, small: ft, factor: 3 },
      { big: yd, small: inch, factor: 36 },
    ],
    t(
      "To change to a larger customary unit, divide by the number of smaller units in one larger unit: $12$ in $= 1$ ft, $3$ ft $= 1$ yd.\n\n$96$ in $= 96 \\div 12 = 8$ ft. Multiplying by $12$ would give more feet than inches, which cannot be right.",
      "换成较大的英制单位时，用较小单位的数量除以进率：$12$ 英寸 $= 1$ 英尺，$3$ 英尺 $= 1$ 码。\n\n$96$ 英寸 $= 96 \\div 12 = 8$ 英尺。如果乘 $12$，英尺数就比英寸数还多，这显然不对。",
    ),
    t(
      "When the division leaves a remainder, the remainder is a part of the larger unit: remainder over the conversion factor.\n\n$10$ ft $\\div 3 = 3$ with $1$ left, so $10$ ft $= 3$ yd $1$ ft $= 3\\frac{1}{3}$ yd.",
      "除法有余数时，余数是一个大单位的一部分：用余数比进率。\n\n$10$ 英尺 $\\div 3$ 得 $3$ 余 $1$，所以 $10$ 英尺 $= 3$ 码 $1$ 英尺 $= 3\\frac{1}{3}$ 码。",
    ),
  ),
);

export const convertingUnitsOfVolumeToLargerUnits = topic(
  "converting-units-of-volume-to-larger-units",
  t("Converting Units of Volume to Larger Units", "容积单位化成较大单位"),
  t(
    "Divide by the conversion factor: 5,000 mL = 5 L and 1,500 mL = 1.5 L; 12 qt = 3 gal, and 9 pt = 4 1/2 qt, since 2 pints make a quart.",
    "除以进率：5000 毫升 = 5 升，1500 毫升 = 1.5 升；12 夸脱 = 3 加仑，9 品脱 = 4 1/2 夸脱，因为 2 品脱是 1 夸脱。",
  ),
  [
    "converting-units-of-volume-to-smaller-units",
    "dividing-decimals-by-powers-of-ten-using-decimal-point-placement",
    "converting-improper-fractions-to-mixed-numbers",
  ],
  ["5.MD.A.1"],
  largerKPs(
    "volumes",
    [
      { big: liter, small: mL, factor: 1000 },
      { big: gal, small: qt, factor: 4 },
      { big: qt, small: pt, factor: 2 },
      { big: pt, small: cup, factor: 2 },
      { big: gal, small: pt, factor: 8 },
    ],
    t(
      "To change a volume to a larger unit, divide by the number of smaller units in one larger unit: $2$ pt $= 1$ qt, $4$ qt $= 1$ gal, $1{,}000$ mL $= 1$ L.\n\n$20$ qt $= 20 \\div 4 = 5$ gal.",
      "把容积换成较大的单位时，用较小单位的数量除以进率：$2$ 品脱 $= 1$ 夸脱，$4$ 夸脱 $= 1$ 加仑，$1000$ 毫升 $= 1$ 升。\n\n$20$ 夸脱 $= 20 \\div 4 = 5$ 加仑。",
    ),
    t(
      "If the amount is not a whole number of larger units, write the answer as a decimal for metric units, or as a mixed number for customary units.\n\n$2{,}750$ mL $= 2{,}750 \\div 1{,}000 = 2.75$ L.",
      "如果不是整数个大单位，公制单位的结果写成小数，英制单位的结果写成带分数。\n\n$2750$ 毫升 $= 2750 \\div 1000 = 2.75$ 升。",
    ),
  ),
);

export const convertingUnitsOfMassToLargerUnits = topic(
  "converting-units-of-mass-to-larger-units",
  t("Converting Units of Mass to Larger Units", "质量单位化成较大单位"),
  t(
    "Divide by the conversion factor: 3,000 g = 3 kg and 3,400 g = 3.4 kg; 48 oz = 3 lb, and 40 oz = 2 8/16 lb = 2 1/2 lb.",
    "除以进率：3000 克 = 3 千克，3400 克 = 3.4 千克；48 盎司 = 3 磅，40 盎司 = 2 8/16 磅 = 2 1/2 磅。",
  ),
  [
    "converting-units-of-mass-to-smaller-units",
    "dividing-decimals-by-powers-of-ten-using-decimal-point-placement",
    "converting-improper-fractions-to-mixed-numbers",
  ],
  ["5.MD.A.1"],
  largerKPs(
    "masses",
    [
      { big: kg, small: g, factor: 1000 },
      { big: lb, small: oz, factor: 16 },
    ],
    t(
      "To change a mass to a larger unit, divide by the conversion factor: $16$ oz $= 1$ lb, $1{,}000$ g $= 1$ kg.\n\n$80$ oz $= 80 \\div 16 = 5$ lb.",
      "把质量换成较大的单位时，除以进率：$16$ 盎司 $= 1$ 磅，$1000$ 克 $= 1$ 千克。\n\n$80$ 盎司 $= 80 \\div 16 = 5$ 磅。",
    ),
    t(
      "Divide by the conversion factor; a remainder is a fraction of the larger unit.\n\n$36$ oz $\\div 16 = 2$ with $4$ left, so $36$ oz $= 2$ lb $4$ oz $= 2\\frac{4}{16}$ lb $= 2\\frac{1}{4}$ lb.",
      "除以进率，余数是大单位的几分之几。\n\n$36$ 盎司 $\\div 16$ 得 $2$ 余 $4$，所以 $36$ 盎司 $= 2$ 磅 $4$ 盎司 $= 2\\frac{4}{16}$ 磅 $= 2\\frac{1}{4}$ 磅。",
    ),
  ),
);

export const convertingUnitsOfTimeToLargerUnits = topic(
  "converting-units-of-time-to-larger-units",
  t("Converting Units of Time to Larger Units", "时间单位化成较大单位"),
  t(
    "Divide by the conversion factor: 180 min = 3 h, 72 h = 3 days and 28 days = 4 weeks. A remainder is a fraction of the larger unit: 90 min = 1 30/60 h = 1 1/2 h.",
    "除以进率：180 分钟 = 3 小时，72 小时 = 3 天，28 天 = 4 周。余数是大单位的几分之几：90 分钟 = 1 30/60 小时 = 1 1/2 小时。",
  ),
  ["converting-units-of-time-to-smaller-units", "converting-improper-fractions-to-mixed-numbers"],
  ["5.MD.A.1"],
  largerKPs(
    "times",
    [
      { big: week, small: day, factor: 7 },
      { big: day, small: hour, factor: 24 },
      { big: hour, small: minute, factor: 60 },
      { big: minute, small: second, factor: 60 },
    ],
    t(
      "To change a time to a larger unit, divide by the conversion factor: $60$ s $= 1$ min, $60$ min $= 1$ h, $24$ h $= 1$ day.\n\n$300$ s $= 300 \\div 60 = 5$ min.",
      "把时间换成较大的单位时，除以进率：$60$ 秒 $= 1$ 分，$60$ 分 $= 1$ 小时，$24$ 小时 $= 1$ 天。\n\n$300$ 秒 $= 300 \\div 60 = 5$ 分钟。",
    ),
    t(
      "A remainder of minutes is a fraction of an hour: the minutes over $60$, simplified. Time units are not based on $10$, so $2$ h $15$ min is not $2.15$ h.\n\n$135$ min $\\div 60 = 2$ with $15$ left, and $\\frac{15}{60} = \\frac{1}{4}$, so $135$ min $= 2\\frac{1}{4}$ h.",
      "剩下的分钟数是一小时的几分之几：用分钟数比 $60$，再约分。时间单位不是十进制，所以 $2$ 小时 $15$ 分不是 $2.15$ 小时。\n\n$135$ 分钟 $\\div 60$ 得 $2$ 余 $15$，$\\frac{15}{60} = \\frac{1}{4}$，所以 $135$ 分钟 $= 2\\frac{1}{4}$ 小时。",
    ),
  ),
);

// ---------------------------------------------------------------------------
// Line plots

/** Measured is something measured in a fraction of a unit for a line plot. */
interface Measured {
  readonly things: Text;
  readonly unit: Text;
  readonly units: Text;
}

const measured: readonly Measured[] = [
  { things: t("beakers of water", "烧杯里的水"), unit: t("liter", "升"), units: t("liters", "升") },
  { things: t("bags of flour", "袋面粉"), unit: t("pound", "磅"), units: t("pounds", "磅") },
  { things: t("pieces of ribbon", "段丝带"), unit: t("yard", "码"), units: t("yards", "码") },
  { things: t("jars of honey", "罐蜂蜜"), unit: t("cup", "杯"), units: t("cups", "杯") },
];

/** plotValues draws 6 to 10 values in steps of 1/d between lo and hi steps, with at least three different values. */
function plotValues(rng: Rng, lo: number, hi: number): number[] {
  for (;;) {
    const values = Array.from({ length: rng.int(6, 10) }, () => rng.int(lo, hi));
    if (new Set(values).size >= 3) return values.sort((a, b) => a - b);
  }
}

/** sumSteps writes the values of a line plot as a sum of fractions. */
const sumSteps = (values: readonly number[], d: number) => values.map((v) => Q.of(v, d).toLatex()).join(" + ");

export const operationsOnFractionsWithLinePlots = topic(
  "operations-on-fractions-with-line-plots",
  t("Operations on Fractions With Line Plots", "用线图做分数运算"),
  t(
    "A line plot of measurements in fractions of a unit can answer questions with all four operations: the total of all the measurements is their sum, and sharing the total equally among all the items divides it by the number of items. If 4 beakers hold 1/4, 1/2, 1/2 and 3/4 liter, they hold 2 liters in all, and sharing it equally gives each 2 ÷ 4 = 1/2 liter.",
    "表示分数测量结果的线图可以用四则运算来回答问题：所有测量结果的总和是把它们相加，把总量平均分给每一件物品就是用总量除以物品的件数。如果 4 个烧杯分别装 1/4、1/2、1/2、3/4 升水，一共是 2 升，平均分后每个烧杯装 2 ÷ 4 = 1/2 升。",
  ),
  [
    "creating-and-interpreting-line-plots-with-fractions",
    "adding-fractions-with-unlike-denominators",
    "dividing-fractions-by-whole-numbers",
  ],
  ["5.MD.B.2"],
  [
    {
      id: "totals-from-fraction-line-plots",
      title: t("The total of all the data", "所有数据的总和"),
      explanation: t(
        "Each dot is one item. Add the value of every dot, counting each value as often as it has dots: $\\frac{1}{8} + \\frac{1}{4} + \\frac{1}{4} + \\frac{3}{8} = 1$.",
        "每个点表示一件物品。把每个点的值都加起来，一个值有几个点就加几次：$\\frac{1}{8} + \\frac{1}{4} + \\frac{1}{4} + \\frac{3}{8} = 1$。",
      ),
      generate(rng) {
        const d = rng.pick([4, 8]);
        const s = rng.pick(measured);
        const values = plotValues(rng, 1, d - 1);
        const total = Q.of(
          values.reduce((a, b) => a + b, 0),
          d,
        );
        return {
          ...numberProblem({
            prompt: t(
              `The line plot shows how many ${s.units.en} are in some ${s.things.en}. What is the total amount in all of them?`,
              `线图表示一些${s.things["zh-CN"]}的量（单位：${s.units["zh-CN"]}）。它们一共是多少${s.units["zh-CN"]}？`,
            ),
            answer: total,
            form: "mixed",
            wrong: [
              Q.of(values.length),
              Q.of(new Set(values).size > 0 ? [...new Set(values)].reduce((a, b) => a + b, 0) : 1, d),
              Q.of(Math.max(...values), d),
            ],
            solution: t(
              `Add the value of every dot: $${sumSteps(values, d)} = ${mixedLatex(total)}$ ${s.units.en}.`,
              `把每个点的值都加起来：$${sumSteps(values, d)} = ${mixedLatex(total)}$ ${s.units["zh-CN"]}。`,
            ),
          }),
          figure: {
            svg: fractionPlot(values, d, 0, d),
            alt: t(
              `A line plot of amounts in ${s.units.en}, marked in steps of 1/${d}.`,
              `以${s.units["zh-CN"]}为单位的线图，刻度间隔为 1/${d}。`,
            ),
          },
        };
      },
    },
    {
      id: "sharing-the-total-equally",
      title: t("Sharing the total equally", "平均分总量"),
      explanation: t(
        "If $3$ jars hold $\\frac{1}{2}$, $\\frac{3}{4}$ and $1$ cup of honey, the total is $2\\frac{1}{4}$ cups. Shared equally, each jar holds $2\\frac{1}{4} \\div 3 = \\frac{9}{4} \\times \\frac{1}{3} = \\frac{3}{4}$ cup.",
        "如果 $3$ 罐蜂蜜分别有 $\\frac{1}{2}$、$\\frac{3}{4}$、$1$ 杯，总量是 $2\\frac{1}{4}$ 杯。平均分后每罐有 $2\\frac{1}{4} \\div 3 = \\frac{9}{4} \\times \\frac{1}{3} = \\frac{3}{4}$ 杯。",
      ),
      generate(rng) {
        const d = rng.pick([4, 8]);
        const s = rng.pick(measured);
        const values = plotValues(rng, 1, d);
        const n = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        const total = Q.of(sum, d);
        const share = total.div(Q.of(n));
        return {
          ...numberProblem({
            prompt: t(
              `The line plot shows how many ${s.units.en} are in some ${s.things.en}. If the total were shared equally among all of them, how much would each have?`,
              `线图表示一些${s.things["zh-CN"]}的量（单位：${s.units["zh-CN"]}）。如果把总量平均分，每一份是多少${s.units["zh-CN"]}？`,
            ),
            answer: share,
            form: "mixed",
            wrong: [total, total.mul(Q.of(n)), Q.of(n).div(total)].filter((w) => !w.eq(share)),
            solution: t(
              `The total is $${sumSteps(values, d)} = ${mixedLatex(total)}$ ${s.units.en}. There are $${n}$ items, so each gets $${mixedLatex(total)} \\div ${n} = ${mixedLatex(share)}$ ${share.eq(Q.one) ? s.unit.en : s.units.en}.`,
              `总量是 $${sumSteps(values, d)} = ${mixedLatex(total)}$ ${s.units["zh-CN"]}。一共有 $${n}$ 份，所以每份是 $${mixedLatex(total)} \\div ${n} = ${mixedLatex(share)}$ ${s.units["zh-CN"]}。`,
            ),
          }),
          figure: {
            svg: fractionPlot(values, d, 0, d),
            alt: t(
              `A line plot of amounts in ${s.units.en}, marked in steps of 1/${d}.`,
              `以${s.units["zh-CN"]}为单位的线图，刻度间隔为 1/${d}。`,
            ),
          },
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// The coordinate plane

const firstQuadrant = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 };

/** grid draws marks on a first-quadrant grid from 0 to 10. */
const grid = (marks: readonly PlaneMark[], en: string, zh: string): Figure => ({ svg: plane(firstQuadrant, marks), alt: t(en, zh) });

/** walkText describes going from the origin to (x, y). */
const walkText = (x: number, y: number): Text =>
  t(
    `start at the origin, go ${x} unit${x === 1 ? "" : "s"} right along the $x$-axis, then ${y} unit${y === 1 ? "" : "s"} up`,
    `从原点出发，沿 $x$ 轴向右走 ${x} 格，再向上走 ${y} 格`,
  );

/** gridPoint draws a point with whole coordinates from 0 to 10, not on the diagonal. */
function gridPoint(rng: Rng, lo = 0): [number, number] {
  for (;;) {
    const x = rng.int(lo, 10);
    const y = rng.int(lo, 10);
    if (x !== y && x + y > 0) return [x, y];
  }
}

export const describingTheCoordinatePlane = topic(
  "describing-the-coordinate-plane",
  t("Describing the Coordinate Plane", "认识坐标平面"),
  t(
    "A coordinate plane is made of two perpendicular number lines, the horizontal x-axis and the vertical y-axis, that meet at the origin (0, 0). A point is named by an ordered pair (x, y): the x-coordinate says how far to go right from the origin and the y-coordinate how far to go up. The order matters: (2, 5) and (5, 2) are different points.",
    "坐标平面由两条互相垂直的数轴组成：水平的 x 轴和竖直的 y 轴，它们相交于原点 (0, 0)。平面上的点用有序数对 (x, y) 表示：x 坐标表示从原点向右走多远，y 坐标表示向上走多远。顺序很重要：(2, 5) 和 (5, 2) 是不同的点。",
  ),
  ["plotting-decimals-on-number-lines", "parallel-and-perpendicular-lines"],
  ["5.G.A.1"],
  [
    {
      id: "reading-coordinates-in-the-first-quadrant",
      title: t("Reading coordinates", "读出点的坐标"),
      explanation: t(
        "To read a point, go straight down to the $x$-axis to find $x$, and straight across to the $y$-axis to find $y$. A point $3$ right and $7$ up is $(3, 7)$.",
        "读点的坐标时，从点向下看到 $x$ 轴得到 $x$，向左看到 $y$ 轴得到 $y$。向右 $3$、向上 $7$ 的点是 $(3, 7)$。",
      ),
      generate(rng) {
        const [x, y] = gridPoint(rng);
        const name = rng.pick(["A", "B", "P", "Q", "R"]);
        const w = walkText(x, y);
        return {
          ...pointProblem({
            prompt: t(`Write the coordinates of point $${name}$.`, `写出点 $${name}$ 的坐标。`),
            answer: [x, y],
            wrong: [
              [y, x],
              [x + 1, y],
              [x, y + 1],
            ],
            solution: t(
              `To reach $${name}$, ${w.en}, so $${name} = ${pointLatex([x, y])}$.`,
              `要到达点 $${name}$，${w["zh-CN"]}，所以 $${name} = ${pointLatex([x, y])}$。`,
            ),
          }),
          figure: grid(
            [{ kind: "point", at: [x, y], label: name, accent: true }],
            `A point ${name} on a grid from 0 to 10.`,
            `0 到 10 的网格上的一个点 ${name}。`,
          ),
        };
      },
    },
    {
      id: "locating-points-in-the-first-quadrant",
      title: t("Locating a point", "找到给定坐标的点"),
      explanation: t(
        "An ordered pair $(x, y)$ gives directions from the origin $(0, 0)$: the first number says how far to go right, the second how far to go up. The order matters.\n\nThe point $(6, 2)$ is $6$ right and $2$ up. The point $(2, 6)$ is $2$ right and $6$ up, a different point.",
        "有序数对 $(x, y)$ 说明从原点 $(0, 0)$ 出发怎么走：第一个数表示向右走多远，第二个数表示向上走多远。顺序不能颠倒。\n\n点 $(6, 2)$ 在向右 $6$、向上 $2$ 的位置。点 $(2, 6)$ 在向右 $2$、向上 $6$ 的位置，是另一个点。",
      ),
      generate(rng) {
        const [a, b] = gridPoint(rng, 1);
        const candidates: [number, number][] = [
          [b, a],
          [a + (a < 10 ? 1 : -1), b],
          [a, b + (b < 10 ? 1 : -1)],
          [a - (a > 1 ? 1 : -1), b - (b > 1 ? 1 : -1)],
        ];
        const others = rng.sample(
          candidates.filter(([x, y], i) => !(x === a && y === b) && candidates.findIndex(([p, q]) => p === x && q === y) === i),
          3,
        );
        const points = rng.shuffle<readonly [number, number]>([[a, b], ...others]);
        const correct = points.findIndex(([x, y]) => x === a && y === b);
        const names = ["A", "B", "C", "D"];
        const w = walkText(a, b);
        return {
          ...choiceProblem({
            prompt: t(`Which point is at $${pointLatex([a, b])}$?`, `哪个点的坐标是 $${pointLatex([a, b])}$？`),
            options: names.slice(0, points.length).map((n) => same(n)),
            correct,
            solution: t(
              `${w.en[0]!.toUpperCase()}${w.en.slice(1)}: that is point $${names[correct]}$.`,
              `${w["zh-CN"]}，到达的是点 $${names[correct]}$。`,
            ),
          }),
          figure: grid(
            points.map((p, i): PlaneMark => ({ kind: "point", at: p, label: names[i]! })),
            "Four labeled points on a grid from 0 to 10.",
            "0 到 10 的网格上有四个带字母的点。",
          ),
        };
      },
    },
  ],
);

/** Context is a setting for grid problems: what a unit stands for. */
interface GridContext {
  readonly unit: Text;
  readonly units: Text;
  readonly mover: Text;
}

const gridContexts: readonly GridContext[] = [
  { unit: t("block", "个街区"), units: t("blocks", "个街区"), mover: t("Maya walks", "玛雅走路") },
  { unit: t("mile", "英里"), units: t("miles", "英里"), mover: t("a bus drives", "一辆公交车行驶") },
  { unit: t("meter", "米"), units: t("meters", "米"), mover: t("a robot rolls", "一个机器人移动") },
  { unit: t("kilometer", "千米"), units: t("kilometers", "千米"), mover: t("a cyclist rides", "一名骑手骑车") },
];

export const solvingRealWorldProblemsUsingCoordinates = topic(
  "solving-real-world-problems-using-coordinates",
  t("Solving Real-World Problems Using Coordinates", "用坐标解决实际问题"),
  t(
    "Moving right or left changes only the x-coordinate, and moving up or down changes only the y-coordinate. So going 3 right and 2 up from (4, 1) leads to (7, 3). Two points on the same horizontal line are as far apart as their x-coordinates: (2, 5) and (9, 5) are 9 − 2 = 7 units apart.",
    "向右或向左移动只改变 x 坐标，向上或向下移动只改变 y 坐标。所以从 (4, 1) 向右 3、向上 2 到达 (7, 3)。在同一条水平线上的两点相距的长度等于它们 x 坐标的差：(2, 5) 和 (9, 5) 相距 9 − 2 = 7 个单位。",
  ),
  ["describing-the-coordinate-plane"],
  ["5.G.A.2"],
  [
    {
      id: "moving-from-a-point",
      title: t("Moving from a point", "从一个点移动"),
      explanation: t(
        "Moving right or left changes only the $x$-coordinate; moving up or down changes only the $y$-coordinate. Add for right and up, subtract for left and down. On a map, east is right and north is up.\n\nFrom $(2, 6)$, going $5$ right and $3$ down leads to $(2 + 5, 6 - 3) = (7, 3)$.",
        "向左右移动只改变 $x$ 坐标，向上下移动只改变 $y$ 坐标。向右、向上用加法，向左、向下用减法。在地图上，东是右，北是上。\n\n从 $(2, 6)$ 向右走 $5$、向下走 $3$，到达 $(2 + 5, 6 - 3) = (7, 3)$。",
      ),
      generate(rng) {
        const c = rng.pick(gridContexts);
        const [x, y] = [rng.int(1, 8), rng.int(1, 8)];
        const dx = rng.int(-x, 10 - x);
        const dy = rng.int(-y, 10 - y);
        if (dx === 0 || dy === 0) return this.generate(rng);
        const h = t(
          `${Math.abs(dx)} ${Math.abs(dx) === 1 ? c.unit.en : c.units.en} ${dx > 0 ? "east" : "west"}`,
          `向${dx > 0 ? "东" : "西"} ${Math.abs(dx)} ${c.unit["zh-CN"]}`,
        );
        const v = t(
          `${Math.abs(dy)} ${Math.abs(dy) === 1 ? c.unit.en : c.units.en} ${dy > 0 ? "north" : "south"}`,
          `向${dy > 0 ? "北" : "南"} ${Math.abs(dy)} ${c.unit["zh-CN"]}`,
        );
        const [ex, ey] = [x + dx, y + dy];
        return pointProblem({
          prompt: t(
            `On a grid where each unit is 1 ${c.unit.en}, with east to the right and north up, ${c.mover.en} from $${pointLatex([x, y])}$ ${h.en}, then ${v.en}. Where does the trip end?`,
            `在一个每格表示 1 ${c.unit["zh-CN"]}、右为东、上为北的网格上，${c.mover["zh-CN"]}从 $${pointLatex([x, y])}$ 出发，先${h["zh-CN"]}，再${v["zh-CN"]}。终点在哪里？`,
          ),
          answer: [ex, ey],
          wrong: [
            [x - dx, y - dy],
            [y + dy, x + dx],
            [x + dy, y + dx],
          ],
          solution: t(
            `Moving ${dx > 0 ? "east adds to" : "west subtracts from"} $x$ and moving ${dy > 0 ? "north adds to" : "south subtracts from"} $y$: $(${x} ${dx > 0 ? "+" : "-"} ${Math.abs(dx)}, ${y} ${dy > 0 ? "+" : "-"} ${Math.abs(dy)}) = ${pointLatex([ex, ey])}$.`,
            `向${dx > 0 ? "东走 $x$ 增加" : "西走 $x$ 减少"}，向${dy > 0 ? "北走 $y$ 增加" : "南走 $y$ 减少"}：$(${x} ${dx > 0 ? "+" : "-"} ${Math.abs(dx)}, ${y} ${dy > 0 ? "+" : "-"} ${Math.abs(dy)}) = ${pointLatex([ex, ey])}$。`,
          ),
        });
      },
    },
    {
      id: "distances-along-grid-lines",
      title: t("Distances along a grid line", "沿网格线的距离"),
      explanation: t(
        "Two points with the same $x$-coordinate are on a vertical line, and their distance is the difference of the $y$-coordinates. With the same $y$-coordinate, subtract the $x$-coordinates. Subtract the smaller from the larger.\n\n$(3, 8)$ and $(3, 1)$ have the same $x$-coordinate, so they are $8 - 1 = 7$ units apart.",
        "$x$ 坐标相同的两个点在同一条竖直线上，距离是 $y$ 坐标之差；$y$ 坐标相同时，用 $x$ 坐标相减。都是用大数减小数。\n\n$(3, 8)$ 和 $(3, 1)$ 的 $x$ 坐标相同，所以相距 $8 - 1 = 7$ 个单位。",
      ),
      generate(rng) {
        const c = rng.pick(gridContexts);
        const across = rng.bool();
        const k = rng.int(0, 10);
        let a = rng.int(0, 10);
        let b = rng.int(0, 10);
        while (a === b) b = rng.int(0, 10);
        if (a < b && rng.bool()) [a, b] = [b, a];
        const p: [number, number] = across ? [a, k] : [k, a];
        const q: [number, number] = across ? [b, k] : [k, b];
        const dist = Math.abs(a - b);
        const [P, Qn] = rng.pick([
          [t("the school", "学校"), t("the library", "图书馆")],
          [t("the park", "公园"), t("the pool", "游泳池")],
          [t("the bakery", "面包店"), t("the bank", "银行")],
          [t("the museum", "博物馆"), t("the zoo", "动物园")],
        ] as const);
        return numberProblem({
          prompt: t(
            `On a map where each unit is 1 ${c.unit.en}, ${P.en} is at $${pointLatex(p)}$ and ${Qn.en} is at $${pointLatex(q)}$. How many ${c.units.en} apart are they?`,
            `在一张每格表示 1 ${c.unit["zh-CN"]}的地图上，${P["zh-CN"]}在 $${pointLatex(p)}$，${Qn["zh-CN"]}在 $${pointLatex(q)}$。它们相距多少${c.unit["zh-CN"]}？`,
          ),
          answer: dist,
          form: "integer",
          wrong: [a + b, k, dist + 1].filter((w) => w !== dist),
          solution: t(
            `The ${across ? "$y$" : "$x$"}-coordinates are the same, so the points are on a ${across ? "horizontal" : "vertical"} line. Subtract the other coordinates: $${Math.max(a, b)} - ${Math.min(a, b)} = ${dist}$ ${dist === 1 ? c.unit.en : c.units.en}.`,
            `两点的${across ? " $y$ " : " $x$ "}坐标相同，所以在同一条${across ? "水平" : "竖直"}线上。用另一个坐标相减：$${Math.max(a, b)} - ${Math.min(a, b)} = ${dist}$ ${c.unit["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

/** Place is a labeled spot on a map. */
interface Place {
  readonly name: Text;
  readonly letter: string;
}

const places: readonly Place[] = [
  { name: t("School", "学校"), letter: "S" },
  { name: t("Library", "图书馆"), letter: "L" },
  { name: t("Park", "公园"), letter: "P" },
  { name: t("Museum", "博物馆"), letter: "M" },
  { name: t("Hospital", "医院"), letter: "H" },
  { name: t("Bakery", "面包店"), letter: "B" },
  { name: t("Zoo", "动物园"), letter: "Z" },
];

/** mapOf places some of the places at distinct grid points. */
function mapOf(rng: Rng, count: number): { place: Place; at: [number, number] }[] {
  const chosen = rng.sample(places, count);
  const used = new Set<string>();
  return chosen.map((place) => {
    for (;;) {
      const at: [number, number] = [rng.int(1, 9), rng.int(1, 9)];
      const key = at.join(",");
      if (used.has(key) || used.has(`${at[1]},${at[0]}`) || at[0] === at[1]) continue;
      used.add(key);
      return { place, at };
    }
  });
}

/** mapFigure draws the places on a grid with their letters. */
const mapFigure = (spots: readonly { place: Place; at: [number, number] }[]): Figure =>
  grid(
    spots.map((s): PlaneMark => ({ kind: "point", at: s.at, label: s.place.letter })),
    `A map on a grid with ${spots.map((s) => `${s.place.name.en} (${s.place.letter})`).join(", ")}.`,
    `网格地图上有${spots.map((s) => `${s.place.name["zh-CN"]}（${s.place.letter}）`).join("、")}。`,
  );

/** mapKey lists the letters of the places on a map. */
const mapKey = (spots: readonly { place: Place }[]): Text =>
  t(
    spots.map((s) => `${s.place.letter} = ${s.place.name.en}`).join(", "),
    spots.map((s) => `${s.place.letter} = ${s.place.name["zh-CN"]}`).join("，"),
  );

export const coordinatePlanesAsMaps = topic(
  "coordinate-planes-as-maps",
  t("Coordinate Planes as Maps", "把坐标平面当作地图"),
  t(
    "A grid on a map gives every place an ordered pair. To travel between places along the streets of the grid, add the distance across and the distance up or down: from (2, 3) to (6, 8) is 4 blocks across and 5 blocks up, 9 blocks in all.",
    "地图上的网格给每个地点一个有序数对。沿着网格的街道从一个地点走到另一个地点，路程是横向距离与纵向距离之和：从 (2, 3) 到 (6, 8) 横向 4 个街区、向上 5 个街区，一共 9 个街区。",
  ),
  ["solving-real-world-problems-using-coordinates"],
  ["5.G.A.2"],
  [
    {
      id: "finding-a-place-on-a-map",
      title: t("Finding a place", "找到地点"),
      explanation: t(
        "If the library is drawn at $4$ right and $7$ up, it is at $(4, 7)$, and the place at $(7, 4)$ is somewhere else.",
        "如果图书馆在向右 $4$、向上 $7$ 的位置，它的坐标是 $(4, 7)$，而 $(7, 4)$ 是另一个地方。",
      ),
      generate(rng) {
        const spots = mapOf(rng, 4);
        const target = rng.pick(spots);
        const key = mapKey(spots);
        return {
          ...choiceProblem({
            prompt: t(
              `On the map, ${key.en}. Which place is at $${pointLatex(target.at)}$?`,
              `地图上，${key["zh-CN"]}。哪个地点的坐标是 $${pointLatex(target.at)}$？`,
            ),
            options: spots.map((s) => s.place.name),
            correct: spots.indexOf(target),
            solution: t(
              `Go ${target.at[0]} right and ${target.at[1]} up: that is the ${target.place.name.en.toLowerCase()}.`,
              `向右 ${target.at[0]}、向上 ${target.at[1]}，到达的是${target.place.name["zh-CN"]}。`,
            ),
          }),
          figure: mapFigure(spots),
        };
      },
    },
    {
      id: "walking-distances-on-a-map",
      title: t("Walking along the grid", "沿网格行走的路程"),
      explanation: t(
        "When you can walk only along grid lines, the shortest walk is the distance across plus the distance up or down. Find each by subtracting coordinates, then add.\n\nFrom $(1, 6)$ to $(5, 2)$: across $5 - 1 = 4$ blocks and down $6 - 2 = 4$ blocks, so $4 + 4 = 8$ blocks.",
        "只能沿网格线走时，最短路程是横向距离加上纵向距离。分别用坐标相减求出两段，再相加。\n\n从 $(1, 6)$ 走到 $(5, 2)$：横向 $5 - 1 = 4$ 个街区，向下 $6 - 2 = 4$ 个街区，共 $4 + 4 = 8$ 个街区。",
      ),
      generate(rng) {
        const spots = mapOf(rng, 3);
        const [a, b] = rng.sample(spots, 2) as [(typeof spots)[number], (typeof spots)[number]];
        const dx = Math.abs(a.at[0] - b.at[0]);
        const dy = Math.abs(a.at[1] - b.at[1]);
        const key = mapKey(spots);
        return {
          ...numberProblem({
            prompt: t(
              `On the map, each unit is 1 block and ${key.en}. How many blocks is it from the ${a.place.name.en.toLowerCase()} to the ${b.place.name.en.toLowerCase()}, walking only along the grid lines the shortest way?`,
              `地图上每格表示 1 个街区，${key["zh-CN"]}。只沿网格线走最短的路，从${a.place.name["zh-CN"]}到${b.place.name["zh-CN"]}要走几个街区？`,
            ),
            answer: dx + dy,
            form: "integer",
            wrong: [Math.max(dx, dy), Math.abs(dx - dy), a.at[0] + a.at[1] + b.at[0] + b.at[1]].filter((w) => w !== dx + dy),
            solution: t(
              `The ${a.place.name.en.toLowerCase()} is at $${pointLatex(a.at)}$ and the ${b.place.name.en.toLowerCase()} at $${pointLatex(b.at)}$: $${dx}$ blocks across and $${dy}$ blocks ${a.at[1] < b.at[1] ? "up" : "down"}, so $${dx} + ${dy} = ${dx + dy}$ blocks.`,
              `${a.place.name["zh-CN"]}在 $${pointLatex(a.at)}$，${b.place.name["zh-CN"]}在 $${pointLatex(b.at)}$：横向 $${dx}$ 个街区，纵向 $${dy}$ 个街区，共 $${dx} + ${dy} = ${dx + dy}$ 个街区。`,
            ),
          }),
          figure: mapFigure(spots),
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Numerical patterns

/** patternPair draws two "start at 0, add" rules where the second step is k times the first. */
function patternPair(rng: Rng): { a: number; b: number; k: number } {
  const a = rng.int(1, 9);
  const k = rng.int(2, 6);
  return { a, b: a * k, k };
}

/** terms lists the first n terms of the pattern that starts at 0 and adds step. */
const terms = (step: number, n: number) => Array.from({ length: n }, (_, i) => i * step);

/** rules describes the two patterns. */
const rules = (a: number, b: number): Text =>
  t(
    `Pattern A starts at $0$ and adds $${a}$ each time. Pattern B starts at $0$ and adds $${b}$ each time.`,
    `规律 A 从 $0$ 开始，每次加 $${a}$。规律 B 从 $0$ 开始，每次加 $${b}$。`,
  );

export const connectingPatterns = topic(
  "connecting-patterns",
  t("Connecting Patterns", "联系两个数的规律"),
  t(
    "Two patterns made by rules can be compared term by term. If pattern A starts at 0 and adds 3 (0, 3, 6, 9, …) and pattern B starts at 0 and adds 6 (0, 6, 12, 18, …), each term of B is 2 times the matching term of A, because B adds twice as much each time.",
    "按规则生成的两个数列可以逐项比较。如果规律 A 从 0 开始每次加 3（0, 3, 6, 9, …），规律 B 从 0 开始每次加 6（0, 6, 12, 18, …），那么 B 的每一项都是 A 中对应项的 2 倍，因为 B 每次加的数是 A 的 2 倍。",
  ),
  ["identifying-patterns"],
  ["5.OA.B.3"],
  [
    {
      id: "relating-corresponding-terms",
      title: t("How many times as large", "是几倍"),
      explanation: t(
        "To relate two patterns that both start at $0$, compare matching terms: divide a term of one pattern by the matching term of the other. If the answer is the same every time, that is the relationship.\n\nA: $0, 4, 8, 12$. B: $0, 12, 24, 36$. Each term of B is $3$ times the matching term of A, since $12 = 3 \\times 4$, $24 = 3 \\times 8$ and $36 = 3 \\times 12$.",
        "比较两个都从 $0$ 开始的数列时，看对应的项：用一个数列的项除以另一个数列中对应的项。如果每次结果都一样，这就是它们的关系。\n\nA：$0, 4, 8, 12$。B：$0, 12, 24, 36$。B 的每一项都是 A 中对应项的 $3$ 倍，因为 $12 = 3 \\times 4$，$24 = 3 \\times 8$，$36 = 3 \\times 12$。",
      ),
      generate(rng) {
        const { a, b, k } = patternPair(rng);
        const n = rng.int(4, 6);
        return numberProblem({
          prompt: t(
            `Pattern A: $${terms(a, n).join(", ")}, \\ldots$ Pattern B: $${terms(b, n).join(", ")}, \\ldots$ Each term of pattern B is how many times the matching term of pattern A?`,
            `规律 A：$${terms(a, n).join(", ")}, \\ldots$ 规律 B：$${terms(b, n).join(", ")}, \\ldots$ 规律 B 的每一项是规律 A 中对应项的几倍？`,
          ),
          answer: k,
          form: "integer",
          wrong: [b - a, b, k + 1],
          solution: t(
            `Compare matching terms: $${a} \\times ${k} = ${b}$, $${2 * a} \\times ${k} = ${2 * b}$, and so on. Each term of B is $${k}$ times the matching term of A.`,
            `比较对应项：$${a} \\times ${k} = ${b}$，$${2 * a} \\times ${k} = ${2 * b}$，依此类推。B 的每一项都是 A 中对应项的 $${k}$ 倍。`,
          ),
        });
      },
    },
    {
      id: "finding-a-matching-term",
      title: t("Finding the matching term", "求对应的项"),
      explanation: t(
        "When both patterns start at $0$, compare the amounts they add each step. The ratio of these amounts is the factor between every pair of matching terms. Use it to find a term without listing them all.\n\nA adds $2$ and B adds $10$, so each term of B is $10 \\div 2 = 5$ times A's. When A is $16$, B is $5 \\times 16 = 80$.",
        "两个数列都从 $0$ 开始时，比较它们每次加的数。这两个数的倍数关系，就是每对对应项之间的倍数关系。用它可以直接求出某一项，不必一项一项列出来。\n\nA 每次加 $2$，B 每次加 $10$，所以 B 的每一项是 A 中对应项的 $10 \\div 2 = 5$ 倍。当 A 是 $16$ 时，B 是 $5 \\times 16 = 80$。",
      ),
      generate(rng) {
        const { a, b, k } = patternPair(rng);
        const i = rng.int(5, 12);
        const r = rules(a, b);
        return numberProblem({
          prompt: t(
            `${r.en} When a term of pattern A is $${i * a}$, what is the matching term of pattern B?`,
            `${r["zh-CN"]}当规律 A 的某一项是 $${i * a}$ 时，规律 B 中对应的项是多少？`,
          ),
          answer: i * b,
          form: "integer",
          wrong: [i * a + b - a, i * a * b, (i + 1) * b],
          solution: t(
            `B adds $${b} = ${k} \\times ${a}$ each time, so each term of B is $${k}$ times the matching term of A: $${k} \\times ${i * a} = ${i * b}$.`,
            `B 每次加 $${b} = ${k} \\times ${a}$，所以 B 的每一项是 A 中对应项的 $${k}$ 倍：$${k} \\times ${i * a} = ${i * b}$。`,
          ),
        });
      },
    },
  ],
);

export const comparingPatterns = topic(
  "comparing-patterns",
  t("Comparing Patterns", "比较两个数的规律"),
  t(
    "Matching terms of two patterns form ordered pairs (term of A, term of B). For A: 0, 2, 4, 6 and B: 0, 6, 12, 18 the pairs are (0, 0), (2, 6), (4, 12), (6, 18). In each pair the second number is 3 times the first, and the difference grows by 4 each time.",
    "两个数列的对应项可以组成有序数对（A 的项，B 的项）。对于 A：0, 2, 4, 6 和 B：0, 6, 12, 18，数对是 (0, 0)、(2, 6)、(4, 12)、(6, 18)。每个数对中第二个数都是第一个数的 3 倍，两数之差每次增加 4。",
  ),
  ["connecting-patterns"],
  ["5.OA.B.3"],
  [
    {
      id: "forming-ordered-pairs-from-patterns",
      title: t("Forming ordered pairs", "组成有序数对"),
      explanation: t(
        "List both patterns side by side and pair the terms in the same position: the term from A comes first, the term from B second. Count positions from the first term, which is $0$ in both.\n\nA: $0, 3, 6, 9$ and B: $0, 4, 8, 12$. The fourth pair is $(9, 12)$.",
        "把两个数列并排列出，位置相同的项组成数对：A 的项写在前面，B 的项写在后面。从第一项（两者都是 $0$）开始数位置。\n\nA：$0, 3, 6, 9$，B：$0, 4, 8, 12$。第四个数对是 $(9, 12)$。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        let b = rng.int(1, 9);
        if (b === a) b = a + 1;
        const n = rng.int(4, 8);
        const r = rules(a, b);
        const ord = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"][n]!;
        return pointProblem({
          prompt: t(
            `${r.en} The first terms of both are $0$. Matching terms form ordered pairs (A, B). What is the ${ord} ordered pair?`,
            `${r["zh-CN"]}两个规律的第一项都是 $0$。对应项组成有序数对（A, B）。第 ${n} 个有序数对是什么？`,
          ),
          answer: [(n - 1) * a, (n - 1) * b],
          wrong: [
            [n * a, n * b],
            [(n - 1) * b, (n - 1) * a],
            [(n - 1) * a, (n - 1) * a + b],
          ],
          solution: t(
            `The ${ord} term adds the step $${n - 1}$ times: A gives $${n - 1} \\times ${a} = ${(n - 1) * a}$ and B gives $${n - 1} \\times ${b} = ${(n - 1) * b}$. The pair is $${pointLatex([(n - 1) * a, (n - 1) * b])}$.`,
            `第 ${n} 项是加了 $${n - 1}$ 次：A 是 $${n - 1} \\times ${a} = ${(n - 1) * a}$，B 是 $${n - 1} \\times ${b} = ${(n - 1) * b}$。数对是 $${pointLatex([(n - 1) * a, (n - 1) * b])}$。`,
          ),
        });
      },
    },
    {
      id: "describing-the-relationship",
      title: t("Describing the relationship", "描述两个规律的关系"),
      explanation: t(
        "If A adds $5$ and B adds $15$, every term of B is $3$ times the matching term of A. B is not always $10$ more than A: when A is $10$, B is $30$.",
        "如果 A 每次加 $5$，B 每次加 $15$，B 的每一项都是 A 中对应项的 $3$ 倍。B 并不总是比 A 多 $10$：当 A 是 $10$ 时，B 是 $30$。",
      ),
      generate(rng) {
        const { a, b, k } = patternPair(rng);
        const r = rules(a, b);
        const flip = rng.bool(0.3);
        const [nx, ny] = flip ? ["B", "A"] : ["A", "B"];
        const statement = (en: string, zh: string) => t(en, zh);
        const correct = flip
          ? statement(`Each term of A is $\\frac{1}{${k}}$ of the matching term of B.`, `A 的每一项是 B 中对应项的 $\\frac{1}{${k}}$。`)
          : statement(`Each term of B is $${k}$ times the matching term of A.`, `B 的每一项是 A 中对应项的 $${k}$ 倍。`);
        return pickChoice(
          rng,
          t(`${r.en} Which statement is true?`, `${r["zh-CN"]}哪个说法是正确的？`),
          correct,
          [
            statement(
              `Each term of ${ny} is $${b - a}$ more than the matching term of ${nx}.`,
              `${ny} 的每一项比 ${nx} 中对应项多 $${b - a}$。`,
            ),
            statement(`Each term of ${nx} is $${k}$ times the matching term of ${ny}.`, `${nx} 的每一项是 ${ny} 中对应项的 $${k}$ 倍。`),
            statement(`Each term of ${ny} is $${b}$ times the matching term of ${nx}.`, `${ny} 的每一项是 ${nx} 中对应项的 $${b}$ 倍。`),
          ],
          t(
            `B adds $${b}$, which is $${k} \\times ${a}$, so after the same number of steps B has $${k}$ times as much as A. The difference is not fixed: it is $${b - a}$ after one step and $${2 * (b - a)}$ after two.`,
            `B 每次加 $${b}$，是 $${k} \\times ${a}$，所以加同样多次后，B 是 A 的 $${k}$ 倍。两者的差不固定：加一次后差 $${b - a}$，加两次后差 $${2 * (b - a)}$。`,
          ),
        );
      },
    },
  ],
);

export const graphingPatterns = topic(
  "graphing-patterns",
  t("Graphing Patterns", "画出规律的图像"),
  t(
    "The ordered pairs formed from two patterns can be graphed in the coordinate plane. For A: 0, 1, 2, 3 and B: 0, 2, 4, 6 the points (0, 0), (1, 2), (2, 4), (3, 6) lie on a straight line, and each step goes 1 right and 2 up. The graph shows how to continue the patterns.",
    "由两个数列组成的有序数对可以画在坐标平面上。对于 A：0, 1, 2, 3 和 B：0, 2, 4, 6，点 (0, 0)、(1, 2)、(2, 4)、(3, 6) 在一条直线上，每一步都向右 1、向上 2。图像显示了数列怎样继续下去。",
  ),
  ["comparing-patterns", "describing-the-coordinate-plane"],
  ["5.OA.B.3"],
  [
    {
      id: "continuing-a-graphed-pattern",
      title: t("The next point", "下一个点"),
      explanation: t(
        "Find how the $x$-coordinate and the $y$-coordinate change from one point to the next. Apply the same changes to the last point to get the next one.\n\nPoints $(1, 0)$, $(3, 3)$, $(5, 6)$ go $2$ right and $3$ up each time, so the next point is $(5 + 2, 6 + 3) = (7, 9)$.",
        "找出相邻两点的 $x$ 坐标和 $y$ 坐标各变化了多少，再对最后一个点做同样的变化，就得到下一个点。\n\n点 $(1, 0)$、$(3, 3)$、$(5, 6)$ 每次向右 $2$、向上 $3$，所以下一个点是 $(5 + 2, 6 + 3) = (7, 9)$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do [a, b] = [rng.int(1, 3), rng.int(1, 3)];
        while (a === b && rng.bool(0.6));
        const shown = rng.int(3, 4);
        if (shown * Math.max(a, b) > 10) return this.generate(rng);
        const sx = rng.int(0, 10 - shown * a);
        const sy = rng.int(0, 10 - shown * b);
        const pts: [number, number][] = Array.from({ length: shown }, (_, i) => [sx + i * a, sy + i * b]);
        const last = pts[shown - 1]!;
        const next: [number, number] = [last[0] + a, last[1] + b];
        return {
          ...pointProblem({
            prompt: t(
              "The graph shows ordered pairs formed from the matching terms of two patterns. If the patterns continue, what is the next ordered pair?",
              "图中是由两个数列的对应项组成的有序数对。如果数列继续下去，下一个有序数对是什么？",
            ),
            answer: next,
            wrong: [
              [next[1], next[0]],
              [next[0] + a, next[1] + b],
              [next[0], next[1] + 1],
            ],
            solution: t(
              `Each point is $${a}$ right and $${b}$ up from the one before, so the next is $(${last[0]} + ${a}, ${last[1]} + ${b}) = ${pointLatex(next)}$.`,
              `每个点都在前一个点向右 $${a}$、向上 $${b}$ 的位置，所以下一个是 $(${last[0]} + ${a}, ${last[1]} + ${b}) = ${pointLatex(next)}$。`,
            ),
          }),
          figure: grid(
            pts.map((p): PlaneMark => ({ kind: "point", at: p, accent: true })),
            `Points ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")} on a grid.`,
            `网格上的点 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
          ),
        };
      },
    },
    {
      id: "extending-a-graphed-pattern",
      title: t("Extending beyond the graph", "延续到图像之外"),
      explanation: t(
        "If the points go $1$ right and $4$ up each time from $(0, 0)$, then at $x = 12$ the $y$-coordinate is $4 \\times 12 = 48$.",
        "如果点从 $(0, 0)$ 开始每次向右 $1$、向上 $4$，那么当 $x = 12$ 时，$y$ 坐标是 $4 \\times 12 = 48$。",
      ),
      generate(rng) {
        const a = rng.int(1, 2);
        const k = rng.int(2, a === 1 ? 4 : 2);
        const b = a * k;
        const shown = Math.floor(10 / b) + 1;
        const pts: [number, number][] = Array.from({ length: Math.min(shown, 4) }, (_, i) => [i * a, i * b]);
        const x = a * rng.int(6, 15);
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows ordered pairs formed from two patterns that both start at $0$. If the patterns continue, what is the $y$-coordinate of the point with $x$-coordinate $${x}$?`,
              `图中是由两个都从 $0$ 开始的数列组成的有序数对。如果数列继续下去，$x$ 坐标是 $${x}$ 的点的 $y$ 坐标是多少？`,
            ),
            answer: x * k,
            form: "integer",
            wrong: [x + b, x * b, (x / a + 1) * b].filter((w) => w !== x * k),
            solution: t(
              `Each $y$-coordinate is $${k}$ times its $x$-coordinate: ${pts
                .slice(1)
                .map((p) => `$${p[1]} = ${k} \\times ${p[0]}$`)
                .join(", ")}. So at $x = ${x}$, $y = ${k} \\times ${x} = ${x * k}$.`,
              `每个点的 $y$ 坐标都是 $x$ 坐标的 $${k}$ 倍：${pts
                .slice(1)
                .map((p) => `$${p[1]} = ${k} \\times ${p[0]}$`)
                .join("，")}。所以当 $x = ${x}$ 时，$y = ${k} \\times ${x} = ${x * k}$。`,
            ),
          }),
          figure: grid(
            pts.map((p): PlaneMark => ({ kind: "point", at: p, accent: true })),
            `Points ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")} on a grid.`,
            `网格上的点 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
          ),
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Volume

/** prismSvg draws a box l long, w deep and h tall in oblique projection, as unit cubes or with its edges labeled. */
export function prismSvg(l: number, w: number, h: number, labels?: { l: string; w: string; h: string }): string {
  const dx = 0.5;
  const dy = 0.35;
  const u = Math.min(30, 250 / (l + dx * w), 150 / (h + dy * w));
  const width = (l + dx * w) * u;
  const ox = (320 - width) / 2 - (labels ? 10 : 0);
  const oy = 12 + (h + dy * w) * u;
  const P = (x: number, y: number, z: number): string => `${round(ox + (x + dx * z) * u)},${round(oy - (y + dy * z) * u)}`;
  const poly = (pts: string[], extra = "") => `<polygon points="${pts.join(" ")}"${extra}/>`;
  let body = "";
  body += poly([P(0, 0, 0), P(l, 0, 0), P(l, h, 0), P(0, h, 0)]);
  body += poly([P(0, h, 0), P(l, h, 0), P(l, h, w), P(0, h, w)], ' fill="currentColor" fill-opacity="0.08"');
  body += poly([P(l, 0, 0), P(l, 0, w), P(l, h, w), P(l, h, 0)], ' fill="currentColor" fill-opacity="0.16"');
  if (!labels) {
    let lines = "";
    const seg = (a: string, b: string) =>
      `<line x1="${a.split(",")[0]}" y1="${a.split(",")[1]}" x2="${b.split(",")[0]}" y2="${b.split(",")[1]}"/>`;
    for (let i = 1; i < l; i++) lines += seg(P(i, 0, 0), P(i, h, 0)) + seg(P(i, h, 0), P(i, h, w));
    for (let j = 1; j < h; j++) lines += seg(P(0, j, 0), P(l, j, 0)) + seg(P(l, j, 0), P(l, j, w));
    for (let k = 1; k < w; k++) lines += seg(P(0, h, k), P(l, h, k)) + seg(P(l, 0, k), P(l, h, k));
    body += `<g stroke-width="1">${lines}</g>`;
  } else {
    const text = (at: string, s: string, ddx: number, ddy: number) => {
      const [x, y] = at.split(",").map(Number) as [number, number];
      return `<text x="${round(x + ddx)}" y="${round(y + ddy)}" stroke="none" fill="currentColor">${s}</text>`;
    };
    const mid = (a: [number, number, number], b: [number, number, number]) => P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
    body += text(mid([0, 0, 0], [l, 0, 0]), labels.l, 0, 16);
    body += text(mid([0, 0, 0], [0, h, 0]), labels.h, -6 - 3.4 * labels.h.length, 4);
    body += text(mid([l, 0, 0], [l, 0, w]), labels.w, 8 + 3.4 * labels.w.length, 10);
  }
  return svgDocument(round(oy + (labels ? 28 : 12)), body);
}

const round = (x: number) => Math.round(x * 100) / 100;

/** LengthUnit is a unit of length with the names of its square and cubic units. */
interface LengthUnit {
  readonly abbr: string;
  readonly name: Text;
}

const lengthUnits: readonly LengthUnit[] = [
  { abbr: "cm", name: t("centimeters", "厘米") },
  { abbr: "m", name: t("meters", "米") },
  { abbr: "in", name: t("inches", "英寸") },
  { abbr: "ft", name: t("feet", "英尺") },
];

export const understandingVolumeUsingUnitCubes = topic(
  "understanding-volume-using-unit-cubes",
  t("Understanding Volume Using Unit Cubes", "用单位立方体认识体积"),
  t(
    "Volume is the amount of space a solid takes up. A unit cube, with edges 1 unit long, has a volume of 1 cubic unit. The volume of a box is the number of unit cubes that fill it with no gaps or overlaps. A box 4 cubes long, 3 cubes wide and 2 cubes tall has 2 layers of 4 × 3 = 12 cubes, so its volume is 24 cubic units.",
    "体积是物体所占空间的大小。棱长为 1 个单位的单位立方体，体积是 1 立方单位。长方体的体积就是把它填满（没有空隙、没有重叠）所需的单位立方体的个数。一个长 4 个、宽 3 个、高 2 个立方体的长方体有 2 层，每层 4 × 3 = 12 个，所以体积是 24 立方单位。",
  ),
  ["area-of-rectangles-and-squares", "two-digit-by-one-digit-multiplication"],
  ["5.MD.C.3", "5.MD.C.4"],
  [
    {
      id: "counting-unit-cubes",
      title: t("Counting cubes in a box", "数长方体中的小立方体"),
      explanation: t(
        "Count the cubes along the front ($4$), along the side ($2$) and up ($3$). Each layer has $4 \\times 2 = 8$ cubes and there are $3$ layers, so there are $24$ cubes, including the hidden ones.",
        "数出正面一行的个数（$4$）、侧面的个数（$2$）和高的层数（$3$）。每层有 $4 \\times 2 = 8$ 个，共 $3$ 层，所以一共有 $24$ 个（包括看不见的）。",
      ),
      generate(rng) {
        const [l, w, h] = [rng.int(2, 6), rng.int(2, 4), rng.int(2, 5)];
        const v = l * w * h;
        return {
          ...numberProblem({
            prompt: t(
              "The box is filled with unit cubes. What is its volume, in cubic units?",
              "这个长方体由单位立方体填满。它的体积是多少立方单位？",
            ),
            answer: v,
            form: "integer",
            wrong: [l * h + w * h + l * w - l - w - h + 1, l + w + h, l * w].filter((x) => x !== v),
            solution: t(
              `Each layer is $${l} \\times ${w} = ${l * w}$ cubes and there are $${h}$ layers: $${l * w} \\times ${h} = ${v}$ cubic units.`,
              `每层有 $${l} \\times ${w} = ${l * w}$ 个立方体，共 $${h}$ 层：$${l * w} \\times ${h} = ${v}$ 立方单位。`,
            ),
          }),
          figure: {
            svg: prismSvg(l, w, h),
            alt: t(
              `A box made of unit cubes, ${l} long, ${w} deep and ${h} tall.`,
              `由单位立方体组成的长方体，长 ${l}、宽 ${w}、高 ${h}。`,
            ),
          },
        };
      },
    },
    {
      id: "layers-of-unit-cubes",
      title: t("Layers of cubes", "一层一层地数"),
      explanation: t(
        "A box packed with unit cubes is a stack of equal layers. The number of cubes is the number in one layer times the number of layers, and the cubes in one layer are length times width.\n\nA box holds $60$ unit cubes in $5$ equal layers, so each layer has $60 \\div 5 = 12$ cubes.",
        "用单位立方体填满的长方体，可以看作几层同样的立方体叠起来。立方体总数等于每层的个数乘层数，每层的个数等于长乘宽。\n\n一个长方体用 $5$ 层同样的单位立方体共 $60$ 个填满，所以每层有 $60 \\div 5 = 12$ 个。",
      ),
      generate(rng) {
        const [l, w, h] = [rng.int(2, 9), rng.int(2, 6), rng.int(2, 9)];
        const layer = l * w;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A box is packed with unit cubes with no gaps. The bottom layer is $${l}$ cubes long and $${w}$ cubes wide, and there are $${h}$ layers. How many cubes are in the box?`,
              `一个长方体里整齐地装满了单位立方体。底层长 $${l}$ 个、宽 $${w}$ 个，共有 $${h}$ 层。长方体里一共有多少个立方体？`,
            ),
            answer: layer * h,
            form: "integer",
            wrong: [layer + h, l + w + h, layer],
            solution: t(
              `The bottom layer has $${l} \\times ${w} = ${layer}$ cubes, and $${h}$ layers have $${layer} \\times ${h} = ${layer * h}$ cubes.`,
              `底层有 $${l} \\times ${w} = ${layer}$ 个，$${h}$ 层共有 $${layer} \\times ${h} = ${layer * h}$ 个。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A box holds $${layer * h}$ unit cubes, packed in $${h}$ equal layers with no gaps. How many cubes are in each layer?`,
            `一个长方体用 $${layer * h}$ 个单位立方体整齐地装满，分成同样的 $${h}$ 层。每层有多少个立方体？`,
          ),
          answer: layer,
          form: "integer",
          wrong: [layer * h - h, layer * h * h, h],
          solution: t(
            `The cubes are split into $${h}$ equal layers: $${layer * h} \\div ${h} = ${layer}$ cubes in each.`,
            `立方体平均分成 $${h}$ 层：每层 $${layer * h} \\div ${h} = ${layer}$ 个。`,
          ),
        });
      },
    },
  ],
);

/** Measure is something measured by length, area or volume. */
const measureContexts: readonly { what: Text; kind: 0 | 1 | 2; units: readonly LengthUnit[] }[] = [
  { what: t("the height of a door", "一扇门的高度"), kind: 0, units: lengthUnits },
  { what: t("the length of a pencil", "一支铅笔的长度"), kind: 0, units: [lengthUnits[0]!, lengthUnits[2]!] },
  { what: t("the distance around a garden", "一个花园的周长"), kind: 0, units: lengthUnits },
  { what: t("the width of a desk", "一张桌子的宽度"), kind: 0, units: lengthUnits },
  { what: t("the length of a swimming pool", "一个游泳池的长度"), kind: 0, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("the depth of a pond", "一个池塘的深度"), kind: 0, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("the floor of a bedroom", "一间卧室的地面面积"), kind: 1, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("the cover of a book", "一本书封面的面积"), kind: 1, units: [lengthUnits[0]!, lengthUnits[2]!] },
  { what: t("the surface of a tabletop", "一张桌面的面积"), kind: 1, units: lengthUnits },
  { what: t("a soccer field's grass", "足球场草地的面积"), kind: 1, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("a wall to be painted", "要粉刷的一面墙的面积"), kind: 1, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("a postage stamp", "一张邮票的面积"), kind: 1, units: [lengthUnits[0]!, lengthUnits[2]!] },
  { what: t("the space inside a shoebox", "一个鞋盒里的空间"), kind: 2, units: [lengthUnits[0]!, lengthUnits[2]!] },
  { what: t("the sand that fills a sandbox", "装满沙坑的沙子"), kind: 2, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("the water a fish tank holds", "鱼缸能装的水"), kind: 2, units: lengthUnits },
  { what: t("the space inside a moving truck", "一辆搬家卡车里的空间"), kind: 2, units: [lengthUnits[1]!, lengthUnits[3]!] },
  { what: t("the concrete in a block", "一块混凝土砖的体积"), kind: 2, units: lengthUnits },
  { what: t("the space a gift box takes up", "一个礼盒所占的空间"), kind: 2, units: [lengthUnits[0]!, lengthUnits[2]!] },
];

const kindNames: readonly Text[] = [t("length", "长度"), t("area", "面积"), t("volume", "体积")];

/** unitTex writes a length unit, square unit or cubic unit in LaTeX. */
const unitTex = (u: LengthUnit, kind: number) => `\\text{${u.abbr}}${kind === 0 ? "" : `^${kind + 1}`}`;

export const unitsOfAreaAndVolume = topic(
  "units-of-area-and-volume",
  t("Units of Area and Volume", "面积单位和体积单位"),
  t(
    "Length is measured in units such as cm, area in square units such as cm² (the area of a 1 cm by 1 cm square), and volume in cubic units such as cm³ (the volume of a cube with 1 cm edges). A length has one dimension, an area two and a volume three: the exponent in the unit tells which.",
    "长度用厘米等单位度量，面积用平方单位度量，例如 cm²（边长 1 厘米的正方形的面积），体积用立方单位度量，例如 cm³（棱长 1 厘米的正方体的体积）。长度是一维的，面积是二维的，体积是三维的：单位上的指数说明了这一点。",
  ),
  ["understanding-volume-using-unit-cubes", "units-of-length"],
  ["5.MD.C.3", "5.MD.C.4"],
  [
    {
      id: "choosing-length-area-or-volume-units",
      title: t("Choosing the kind of unit", "选择合适的单位"),
      explanation: t(
        "The floor of a room is measured in square units, such as m². The water in a tank is measured in cubic units, such as m³.",
        "房间地面的大小用平方单位度量，例如 m²。水箱里的水用立方单位度量，例如 m³。",
      ),
      generate(rng) {
        const c = rng.pick(measureContexts);
        const u = rng.pick(c.units);
        return choiceProblem({
          prompt: t(
            `Which unit would you use to measure ${c.what.en}, using ${u.name.en}?`,
            `用${u.name["zh-CN"]}系列的单位度量${c.what["zh-CN"]}，应该用哪个单位？`,
          ),
          options: [0, 1, 2].map((k) => same(`$${unitTex(u, k)}$`)),
          correct: c.kind,
          solution: t(
            `This is a ${kindNames[c.kind]!.en}, so it is measured in $${unitTex(u, c.kind)}$.`,
            `这是${kindNames[c.kind]!["zh-CN"]}，所以用 $${unitTex(u, c.kind)}$ 度量。`,
          ),
        });
      },
    },
    {
      id: "telling-what-a-measurement-measures",
      title: t("Length, area or volume", "长度、面积还是体积"),
      explanation: t(
        "The unit tells what is measured. A plain unit measures length, a unit squared ($^2$) measures area, and a unit cubed ($^3$) measures volume.\n\n$36 \\text{ ft}^3$ is a volume, $36 \\text{ ft}^2$ is an area and $36 \\text{ ft}$ is a length.",
        "看单位就知道量的是什么。普通的长度单位量长度，带平方（$^2$）的单位量面积，带立方（$^3$）的单位量体积。\n\n$36 \\text{ ft}^3$ 是体积，$36 \\text{ ft}^2$ 是面积，$36 \\text{ ft}$ 是长度。",
      ),
      generate(rng) {
        const u = rng.pick(lengthUnits);
        const kind = rng.int(0, 2);
        const n = rng.int(2, 500);
        return choiceProblem({
          prompt: t(
            `What does the measurement $${n} \\ ${unitTex(u, kind)}$ describe?`,
            `测量结果 $${n} \\ ${unitTex(u, kind)}$ 表示什么？`,
          ),
          options: kindNames,
          correct: kind,
          solution: t(
            kind === 0
              ? `The unit is a plain unit of length, so it is a length.`
              : `The unit is ${kind === 1 ? "squared" : "cubed"}, so it is ${kind === 1 ? "an area" : "a volume"}.`,
            kind === 0
              ? "单位是长度单位，所以表示长度。"
              : `单位是${kind === 1 ? "平方" : "立方"}单位，所以表示${kind === 1 ? "面积" : "体积"}。`,
          ),
        });
      },
    },
  ],
);

/** prismFigure draws a box with labeled edges. */
const prismFigure = (l: number, w: number, h: number, u: LengthUnit): Figure => ({
  svg: prismSvg(Math.min(l, 8), Math.min(w, 5), Math.min(h, 6), { l: `${l} ${u.abbr}`, w: `${w} ${u.abbr}`, h: `${h} ${u.abbr}` }),
  alt: t(
    `A box ${l} ${u.abbr} long, ${w} ${u.abbr} wide and ${h} ${u.abbr} tall.`,
    `长 ${l} ${u.abbr}、宽 ${w} ${u.abbr}、高 ${h} ${u.abbr} 的长方体。`,
  ),
});

export const volumesOfRightRectangularPrisms = topic(
  "volumes-of-right-rectangular-prisms",
  t("Volumes of Right Rectangular Prisms", "长方体的体积"),
  t(
    "The volume of a right rectangular prism (a box) is length × width × height: V = l × w × h. Since l × w is the area B of the base, V = B × h. A box 5 cm by 4 cm by 3 cm has volume 5 × 4 × 3 = 60 cm³. Knowing the volume and two edges gives the third: 60 ÷ (5 × 4) = 3 cm.",
    "长方体的体积等于长 × 宽 × 高：V = l × w × h。因为 l × w 是底面积 B，所以 V = B × h。长 5 厘米、宽 4 厘米、高 3 厘米的长方体，体积是 5 × 4 × 3 = 60 cm³。已知体积和两条棱长，可以求第三条：60 ÷ (5 × 4) = 3 厘米。",
  ),
  ["units-of-area-and-volume", "two-digit-by-two-digit-multiplication"],
  ["5.MD.C.5a", "5.MD.C.5b"],
  [
    {
      id: "volume-from-edge-lengths",
      title: t("Length × width × height", "长 × 宽 × 高"),
      explanation: t(
        "The volume of a box is length times width times height, because length times width counts the cubes in one layer and the height counts the layers. The answer is in cubic units.\n\nA box $6$ in by $2$ in by $5$ in has volume $6 \\times 2 \\times 5 = 60 \\text{ in}^3$. Adding the edges instead gives $13$, which is not a volume.",
        "长方体的体积等于长乘宽乘高：长乘宽是一层的立方体个数，高是层数。结果用立方单位表示。\n\n长 $6$ in、宽 $2$ in、高 $5$ in 的长方体，体积是 $6 \\times 2 \\times 5 = 60 \\text{ in}^3$。如果把三条棱相加得 $13$，那不是体积。",
      ),
      generate(rng) {
        const u = rng.pick(lengthUnits);
        const [l, w, h] = [rng.int(2, 12), rng.int(2, 8), rng.int(2, 10)];
        const v = l * w * h;
        return {
          ...numberProblem({
            prompt: t(`What is the volume of the box, in $${unitTex(u, 2)}$?`, `这个长方体的体积是多少 $${unitTex(u, 2)}$？`),
            answer: v,
            form: "integer",
            wrong: [l + w + h, l * w, 2 * (l * w + l * h + w * h)].filter((x) => x !== v),
            solution: t(
              `$V = l \\times w \\times h = ${l} \\times ${w} \\times ${h} = ${v} \\ ${unitTex(u, 2)}$.`,
              `$V = l \\times w \\times h = ${l} \\times ${w} \\times ${h} = ${v} \\ ${unitTex(u, 2)}$。`,
            ),
          }),
          figure: prismFigure(l, w, h, u),
        };
      },
    },
    {
      id: "volume-from-base-area-and-missing-edges",
      title: t("Base area and missing edges", "底面积与未知棱长"),
      explanation: t(
        "A box with base area $24 \\text{ cm}^2$ and height $5$ cm has volume $24 \\times 5 = 120 \\text{ cm}^3$. A box with volume $120 \\text{ cm}^3$, length $6$ cm and width $4$ cm has height $120 \\div 24 = 5$ cm.",
        "底面积 $24 \\text{ cm}^2$、高 $5$ 厘米的长方体，体积是 $24 \\times 5 = 120 \\text{ cm}^3$。体积 $120 \\text{ cm}^3$、长 $6$ 厘米、宽 $4$ 厘米的长方体，高是 $120 \\div 24 = 5$ 厘米。",
      ),
      generate(rng) {
        const u = rng.pick(lengthUnits);
        const [l, w, h] = [rng.int(2, 12), rng.int(2, 9), rng.int(2, 12)];
        const v = l * w * h;
        if (rng.bool()) {
          const B = l * w;
          return numberProblem({
            prompt: t(
              `A box has a base with area $${B} \\ ${unitTex(u, 1)}$ and a height of $${h} \\ ${unitTex(u, 0)}$. What is its volume, in $${unitTex(u, 2)}$?`,
              `一个长方体的底面积是 $${B} \\ ${unitTex(u, 1)}$，高是 $${h} \\ ${unitTex(u, 0)}$。它的体积是多少 $${unitTex(u, 2)}$？`,
            ),
            answer: v,
            form: "integer",
            wrong: [B + h, B * h * h, B],
            solution: t(
              `$V = B \\times h = ${B} \\times ${h} = ${v} \\ ${unitTex(u, 2)}$.`,
              `$V = B \\times h = ${B} \\times ${h} = ${v} \\ ${unitTex(u, 2)}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A box has a volume of $${v} \\ ${unitTex(u, 2)}$. It is $${l} \\ ${unitTex(u, 0)}$ long and $${w} \\ ${unitTex(u, 0)}$ wide. How tall is it, in ${u.name.en}?`,
            `一个长方体的体积是 $${v} \\ ${unitTex(u, 2)}$，长 $${l} \\ ${unitTex(u, 0)}$，宽 $${w} \\ ${unitTex(u, 0)}$。它高多少${u.name["zh-CN"]}？`,
          ),
          answer: h,
          form: "integer",
          wrong: [v - l - w, Math.floor(v / l), v - l * w].filter((x) => x > 0 && x !== h),
          solution: t(
            `The base has area $${l} \\times ${w} = ${l * w}$, so the height is $${v} \\div ${l * w} = ${h} \\ ${unitTex(u, 0)}$.`,
            `底面积是 $${l} \\times ${w} = ${l * w}$，所以高是 $${v} \\div ${l * w} = ${h} \\ ${unitTex(u, 0)}$。`,
          ),
        });
      },
    },
  ],
);

const containers: readonly { what: Text; units: readonly LengthUnit[]; holds: Text }[] = [
  { what: t("A fish tank", "一个鱼缸"), units: [lengthUnits[0]!, lengthUnits[2]!], holds: t("water", "水") },
  { what: t("A sandbox", "一个沙坑"), units: [lengthUnits[3]!, lengthUnits[1]!], holds: t("sand", "沙子") },
  { what: t("A storage bin", "一个储物箱"), units: [lengthUnits[0]!, lengthUnits[2]!], holds: t("toys", "玩具") },
  { what: t("A raised garden bed", "一个种植箱"), units: [lengthUnits[3]!, lengthUnits[1]!], holds: t("soil", "土") },
  { what: t("A shipping crate", "一个货箱"), units: [lengthUnits[3]!, lengthUnits[1]!], holds: t("boxes", "货物") },
];

export const volumesOfRightRectangularPrismsWordProblems = topic(
  "volumes-of-right-rectangular-prisms-word-problems",
  t("Volumes of Right Rectangular Prisms: Word Problems", "长方体的体积：应用题"),
  t(
    "Many containers are boxes, so their volume is length × width × height. A solid built from two boxes that do not overlap has the volume of both added together: an L-shaped step made of a 4 × 2 × 1 block and a 2 × 2 × 1 block on top has volume 8 + 4 = 12 cubic units.",
    "很多容器是长方体，它们的体积是长 × 宽 × 高。由两个不重叠的长方体拼成的物体，体积是两个长方体体积的和：由一个 4 × 2 × 1 的长方体和放在上面的 2 × 2 × 1 的长方体组成的台阶，体积是 8 + 4 = 12 立方单位。",
  ),
  ["volumes-of-right-rectangular-prisms"],
  ["5.MD.C.5b", "5.MD.C.5c"],
  [
    {
      id: "volumes-of-containers",
      title: t("Volumes of containers", "容器的体积"),
      explanation: t(
        "How much a box-shaped container holds is its volume: multiply length, width and depth (the height). Give the answer in cubic units.\n\nA sandbox $6$ ft long, $4$ ft wide and $2$ ft deep holds $6 \\times 4 \\times 2 = 48 \\text{ ft}^3$ of sand.",
        "长方体容器能装多少，就是它的容积：用长、宽、深（即高）相乘，结果用立方单位表示。\n\n长 $6$ 英尺、宽 $4$ 英尺、深 $2$ 英尺的沙坑能装 $6 \\times 4 \\times 2 = 48 \\text{ ft}^3$ 沙子。",
      ),
      generate(rng) {
        const c = rng.pick(containers);
        const u = rng.pick(c.units);
        const [l, w, h] = [rng.int(3, 20), rng.int(2, 12), rng.int(2, 10)];
        const v = l * w * h;
        return numberProblem({
          prompt: t(
            `${c.what.en} is shaped like a box $${l} \\ ${unitTex(u, 0)}$ long, $${w} \\ ${unitTex(u, 0)}$ wide and $${h} \\ ${unitTex(u, 0)}$ deep. How much ${c.holds.en} does it hold when full, in $${unitTex(u, 2)}$?`,
            `${c.what["zh-CN"]}是长 $${l} \\ ${unitTex(u, 0)}$、宽 $${w} \\ ${unitTex(u, 0)}$、深 $${h} \\ ${unitTex(u, 0)}$ 的长方体。装满时能装多少 $${unitTex(u, 2)}$ ${c.holds["zh-CN"]}？`,
          ),
          answer: v,
          form: "integer",
          wrong: [l * w, l + w + h, 2 * (l * w + l * h + w * h)],
          solution: t(
            `$${l} \\times ${w} \\times ${h} = ${v} \\ ${unitTex(u, 2)}$.`,
            `$${l} \\times ${w} \\times ${h} = ${v} \\ ${unitTex(u, 2)}$。`,
          ),
        });
      },
    },
    {
      id: "volumes-of-combined-boxes",
      title: t("Two boxes together", "两个长方体组合"),
      explanation: t(
        "When a solid is made of boxes that do not overlap, find each box's volume and add them.\n\nA solid made of a $5 \\times 3 \\times 2$ box and a $2 \\times 3 \\times 4$ box has volume $30 + 24 = 54$ cubic units.",
        "一个物体由几个不重叠的长方体组成时，分别求出每个长方体的体积，再相加。\n\n由 $5 \\times 3 \\times 2$ 和 $2 \\times 3 \\times 4$ 两个长方体组成的物体，体积是 $30 + 24 = 54$ 立方单位。",
      ),
      generate(rng) {
        const u = rng.pick(lengthUnits);
        const a = [rng.int(2, 10), rng.int(2, 8), rng.int(1, 6)] as const;
        const b = [rng.int(2, 10), rng.int(2, 8), rng.int(1, 6)] as const;
        const va = a[0] * a[1] * a[2];
        const vb = b[0] * b[1] * b[2];
        const what = rng.pick([
          t("A set of stairs is built from two concrete blocks", "一组台阶由两块混凝土砖砌成"),
          t("An L-shaped planter is made of two boxes", "一个 L 形花槽由两个长方体组成"),
          t("A desk is made of two wooden blocks", "一张桌子由两块长方体木块组成"),
        ]);
        const dims = (d: readonly number[]) => d.map((x) => `${x} \\ ${unitTex(u, 0)}`).join(" \\times ");
        return numberProblem({
          prompt: t(
            `${what.en} that do not overlap: one is $${dims(a)}$ and the other is $${dims(b)}$. What is the total volume, in $${unitTex(u, 2)}$?`,
            `${what["zh-CN"]}，两部分不重叠：一个是 $${dims(a)}$，另一个是 $${dims(b)}$。总体积是多少 $${unitTex(u, 2)}$？`,
          ),
          answer: va + vb,
          form: "integer",
          wrong: [va * vb, (a[0] + b[0]) * (a[1] + b[1]) * (a[2] + b[2]), Math.abs(va - vb)].filter((x) => x !== va + vb && x > 0),
          solution: t(
            `Find each volume and add: $${a.join(" \\times ")} = ${va}$ and $${b.join(" \\times ")} = ${vb}$, so the total is $${va} + ${vb} = ${va + vb} \\ ${unitTex(u, 2)}$.`,
            `分别求体积再相加：$${a.join(" \\times ")} = ${va}$，$${b.join(" \\times ")} = ${vb}$，所以总体积是 $${va} + ${vb} = ${va + vb} \\ ${unitTex(u, 2)}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Polygons and quadrilaterals

const polygonNames: Record<number, Text> = {
  3: t("triangle", "三角形"),
  4: t("quadrilateral", "四边形"),
  5: t("pentagon", "五边形"),
  6: t("hexagon", "六边形"),
  7: t("heptagon", "七边形"),
  8: t("octagon", "八边形"),
  9: t("nonagon", "九边形"),
  10: t("decagon", "十边形"),
};

/** capital writes a name with a capital first letter. */
const capital = (x: Text): Text => t(x.en[0]!.toUpperCase() + x.en.slice(1), x["zh-CN"]);

/** randomPolygon draws a convex polygon with n vertices around a circle, with uneven sides. */
function randomPolygon(rng: Rng, n: number): Point[] {
  const turn = rng.int(0, 359);
  const step = 360 / n;
  return Array.from({ length: n }, (_, i) => {
    const a = ((turn + i * step + rng.int(-Math.floor(step / 4), Math.floor(step / 4))) * Math.PI) / 180;
    return [5 * Math.cos(a), 5 * Math.sin(a)] as Point;
  });
}

const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

export const polygons = topic(
  "polygons",
  t("Polygons", "多边形"),
  t(
    "A polygon is a closed flat figure made of straight sides that meet only at their ends, the vertices. A polygon has as many vertices and angles as sides, and is named by its number of sides: triangle (3), quadrilateral (4), pentagon (5), hexagon (6), heptagon (7), octagon (8), nonagon (9) and decagon (10). A polygon with all sides equal and all angles equal is regular.",
    "多边形是由几条线段首尾顺次相接围成的封闭平面图形，线段只在端点（顶点）处相接。多边形的顶点数和角数都等于边数，并按边数命名：三角形（3）、四边形（4）、五边形（5）、六边形（6）、七边形（7）、八边形（8）、九边形（9）、十边形（10）。所有边都相等、所有角都相等的多边形叫正多边形。",
  ),
  ["classifying-figures-based-on-angles"],
  ["5.G.B.3"],
  [
    {
      id: "naming-polygons-from-figures",
      title: t("Naming a drawn polygon", "说出图中多边形的名称"),
      explanation: t(
        "A polygon is named by its number of straight sides: $3$ triangle, $4$ quadrilateral, $5$ pentagon, $6$ hexagon, $8$ octagon. Count the sides carefully, marking where you started.\n\nA figure with $6$ straight sides is a hexagon.",
        "多边形按边数命名：$3$ 条边是三角形，$4$ 条是四边形，$5$ 条是五边形，$6$ 条是六边形，$8$ 条是八边形。数边的时候要记住从哪里开始数。\n\n有 $6$ 条边的图形是六边形。",
      ),
      generate(rng) {
        const n = rng.int(3, 10);
        const others = [n - 1, n + 1, n + 2, n - 2].filter((k) => k >= 3 && k <= 10);
        return pickChoice(
          rng,
          t("What is the name of this polygon?", "这个多边形叫什么？"),
          capital(polygonNames[n]!),
          others.map((k) => capital(polygonNames[k]!)),
          t(
            `Count the sides: there are ${n}, so it is a${n === 8 ? "n" : ""} ${polygonNames[n]!.en}.`,
            `数一数边：有 ${n} 条，所以是${polygonNames[n]!["zh-CN"]}。`,
          ),
          fig(
            [{ kind: "polygon", points: randomPolygon(rng, n), accent: true }],
            `A polygon with ${n} sides.`,
            `一个有 ${n} 条边的多边形。`,
          ),
        );
      },
    },
    {
      id: "sides-vertices-and-names",
      title: t("Sides, vertices and names", "边数、顶点数与名称"),
      explanation: t(
        "An octagon has $8$ sides, $8$ vertices and $8$ angles. A polygon with one more side than a pentagon is a hexagon.",
        "八边形有 $8$ 条边、$8$ 个顶点、$8$ 个角。比五边形多一条边的多边形是六边形。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const n = rng.int(3, 10);
          const part = rng.pick([t("sides", "条边"), t("vertices", "个顶点"), t("angles", "个角")]);
          return numberProblem({
            prompt: t(
              `How many ${part.en} does a${n === 8 ? "n" : ""} ${polygonNames[n]!.en} have?`,
              `${polygonNames[n]!["zh-CN"]}有几${part["zh-CN"]}？`,
            ),
            answer: n,
            form: "integer",
            wrong: [n + 1, n - 1, 2 * n],
            solution: t(
              `A${n === 8 ? "n" : ""} ${polygonNames[n]!.en} has ${n} sides, and a polygon has as many vertices and angles as sides: ${n}.`,
              `${polygonNames[n]!["zh-CN"]}有 ${n} 条边，多边形的顶点数、角数都等于边数：${n}。`,
            ),
          });
        }
        if (kind === 1) {
          const n = rng.int(3, 10);
          const part = rng.pick([t("sides", "条边"), t("vertices", "个顶点"), t("angles", "个角")]);
          return pickChoice(
            rng,
            t(`What is a polygon with ${n} ${part.en} called?`, `有 ${n}${part["zh-CN"]}的多边形叫什么？`),
            capital(polygonNames[n]!),
            [n - 1, n + 1, n + 2, n - 2].filter((k) => k >= 3 && k <= 10).map((k) => capital(polygonNames[k]!)),
            t(
              `A polygon has as many sides as ${part.en}, so it has ${n} sides: a${n === 8 ? "n" : ""} ${polygonNames[n]!.en}.`,
              `多边形的边数等于它的${part["zh-CN"].slice(1)}数，所以有 ${n} 条边：${polygonNames[n]!["zh-CN"]}。`,
            ),
          );
        }
        const n = rng.int(4, 9);
        const more = rng.bool();
        const target = more ? n + 1 : n - 1;
        return pickChoice(
          rng,
          t(
            `Which polygon has one ${more ? "more" : "fewer"} side than a${n === 8 ? "n" : ""} ${polygonNames[n]!.en}?`,
            `哪种多边形比${polygonNames[n]!["zh-CN"]}${more ? "多" : "少"}一条边？`,
          ),
          capital(polygonNames[target]!),
          [more ? n - 1 : n + 1, n, target + (more ? 1 : -1)].filter((k) => k >= 3 && k <= 10).map((k) => capital(polygonNames[k]!)),
          t(
            `A${n === 8 ? "n" : ""} ${polygonNames[n]!.en} has ${n} sides, so ${target} sides make a${target === 8 ? "n" : ""} ${polygonNames[target]!.en}.`,
            `${polygonNames[n]!["zh-CN"]}有 ${n} 条边，${target} 条边的是${polygonNames[target]!["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
);

/** QuadKind is a kind of quadrilateral, from most to least specific. */
type QuadKind = "square" | "rectangle" | "rhombus" | "parallelogram" | "trapezoid";

const quadKinds: readonly QuadKind[] = ["square", "rectangle", "rhombus", "parallelogram", "trapezoid"];

const quadNames: Record<QuadKind | "quadrilateral", Text> = {
  square: t("square", "正方形"),
  rectangle: t("rectangle", "长方形"),
  rhombus: t("rhombus", "菱形"),
  parallelogram: t("parallelogram", "平行四边形"),
  trapezoid: t("trapezoid", "梯形"),
  quadrilateral: t("quadrilateral", "四边形"),
};

/** rotate turns the points by deg degrees about the origin. */
const rotate = (pts: readonly Point[], deg: number): Point[] => {
  const a = (deg * Math.PI) / 180;
  return pts.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)] as Point);
};

/** quadMarks draws a quadrilateral of a kind with marks for equal sides, right angles and parallel sides. */
function quadMarks(rng: Rng, kind: QuadKind): Mark[] {
  let pts: Point[];
  const s = rng.int(30, 50) / 10;
  switch (kind) {
    case "square":
      pts = [
        [0, 0],
        [s, 0],
        [s, s],
        [0, s],
      ];
      break;
    case "rectangle": {
      const h = s * (rng.int(45, 70) / 100);
      pts = [
        [0, 0],
        [s, 0],
        [s, h],
        [0, h],
      ];
      break;
    }
    case "rhombus": {
      const a = (rng.int(50, 70) * Math.PI) / 180;
      pts = [
        [0, 0],
        [s, 0],
        [s + s * Math.cos(a), s * Math.sin(a)],
        [s * Math.cos(a), s * Math.sin(a)],
      ];
      break;
    }
    case "parallelogram": {
      const h = s * (rng.int(45, 65) / 100);
      const off = s * (rng.int(25, 45) / 100);
      pts = [
        [0, 0],
        [s, 0],
        [s + off, h],
        [off, h],
      ];
      break;
    }
    case "trapezoid": {
      const h = s * (rng.int(45, 65) / 100);
      const a = s * (rng.int(10, 30) / 100);
      const b = s * (rng.int(60, 85) / 100);
      pts = [
        [0, 0],
        [s, 0],
        [b, h],
        [a, h],
      ];
      break;
    }
  }
  pts = rotate(pts, rng.pick([0, 0, 10, 20, -15, 90]));
  const [A, B, C, D] = pts as [Point, Point, Point, Point];
  const marks: Mark[] = [{ kind: "polygon", points: pts, accent: true }];
  if (kind === "square" || kind === "rhombus")
    for (const [p, q] of [
      [A, B],
      [B, C],
      [C, D],
      [D, A],
    ] as const)
      marks.push({ kind: "ticks", a: p, b: q, count: 1 });
  if (kind === "rectangle" || kind === "parallelogram") {
    marks.push(
      { kind: "ticks", a: A, b: B, count: 1 },
      { kind: "ticks", a: C, b: D, count: 1 },
      { kind: "ticks", a: B, b: C, count: 2 },
      { kind: "ticks", a: D, b: A, count: 2 },
    );
  }
  if (kind === "square" || kind === "rectangle")
    for (const [v, p, q] of [
      [A, B, D],
      [B, C, A],
      [C, D, B],
      [D, A, C],
    ] as const)
      marks.push({ kind: "right", vertex: v, from: p, to: q });
  if (kind === "parallelogram" || kind === "rhombus")
    marks.push(
      { kind: "arrows", a: A, b: B, count: 1 },
      { kind: "arrows", a: D, b: C, count: 1 },
      { kind: "arrows", a: A, b: D, count: 2 },
      { kind: "arrows", a: B, b: C, count: 2 },
    );
  if (kind === "trapezoid") marks.push({ kind: "arrows", a: A, b: B, count: 1 }, { kind: "arrows", a: D, b: C, count: 1 });
  return marks;
}

/** Property is something a quadrilateral may always have. */
const quadProperties: readonly { text: Text; has: readonly QuadKind[] }[] = [
  { text: t("four right angles", "四个直角"), has: ["square", "rectangle"] },
  { text: t("four sides of equal length", "四条边都相等"), has: ["square", "rhombus"] },
  { text: t("two pairs of parallel sides", "两组对边分别平行"), has: ["square", "rectangle", "rhombus", "parallelogram"] },
  { text: t("opposite sides of equal length", "两组对边分别相等"), has: ["square", "rectangle", "rhombus", "parallelogram"] },
  { text: t("at least one pair of parallel sides", "至少一组对边平行"), has: quadKinds },
  { text: t("opposite angles of equal measure", "两组对角分别相等"), has: ["square", "rectangle", "rhombus", "parallelogram"] },
];

export const quadrilaterals = topic(
  "quadrilaterals",
  t("Quadrilaterals", "四边形"),
  t(
    "Quadrilaterals are named by their sides and angles. A trapezoid has at least one pair of parallel sides. A parallelogram has two pairs of parallel sides, and its opposite sides and opposite angles are equal. A rectangle is a parallelogram with four right angles, a rhombus is a parallelogram with four equal sides, and a square has four equal sides and four right angles. In drawings, matching tick marks show equal sides, arrowheads show parallel sides and small squares show right angles.",
    "四边形按边和角来分类命名。梯形至少有一组对边平行。平行四边形两组对边分别平行，对边相等，对角相等。长方形是有四个直角的平行四边形，菱形是四条边都相等的平行四边形，正方形四条边都相等且四个角都是直角。图中相同的短线表示边相等，箭头表示边平行，小方块表示直角。",
  ),
  ["polygons", "parallel-and-perpendicular-lines"],
  ["5.G.B.3"],
  [
    {
      id: "identifying-quadrilaterals",
      title: t("The best name for a quadrilateral", "四边形最准确的名称"),
      explanation: t(
        "A parallelogram with four right angles but sides of two different lengths is best called a rectangle. If its sides were all equal too, it would be a square.",
        "有四个直角但边长有两种的平行四边形，最准确的名称是长方形。如果四条边也都相等，它就是正方形。",
      ),
      generate(rng) {
        const kind = rng.pick(quadKinds);
        const why: Record<QuadKind, Text> = {
          square: t("All four sides are marked equal and all four angles are right angles", "四条边都标为相等，四个角都是直角"),
          rectangle: t("All four angles are right angles, but only opposite sides are equal", "四个角都是直角，但只有对边相等"),
          rhombus: t("All four sides are marked equal, and there are no right angles", "四条边都标为相等，没有直角"),
          parallelogram: t(
            "Both pairs of opposite sides are parallel and equal, with no right angles and sides of two lengths",
            "两组对边分别平行且相等，没有直角，边长有两种",
          ),
          trapezoid: t("Only one pair of sides is marked parallel", "只有一组对边标为平行"),
        };
        return {
          ...choiceProblem({
            prompt: t("What is the most specific name for this quadrilateral?", "这个四边形最准确的名称是什么？"),
            options: quadKinds.map((k) => capital(quadNames[k])),
            correct: quadKinds.indexOf(kind),
            solution: t(
              `${why[kind].en}, so it is a ${quadNames[kind].en}.`,
              `${why[kind]["zh-CN"]}，所以它是${quadNames[kind]["zh-CN"]}。`,
            ),
          }),
          figure: fig(
            quadMarks(rng, kind),
            `A quadrilateral with marks for equal sides, parallel sides and right angles.`,
            "标有等边、平行边和直角记号的四边形。",
          ),
        };
      },
    },
    {
      id: "properties-of-quadrilaterals",
      title: t("Properties of quadrilaterals", "四边形的特征"),
      explanation: t(
        "Every rhombus has two pairs of parallel sides, but not every rhombus has four right angles.",
        "每个菱形都有两组平行的对边，但不是每个菱形都有四个直角。",
      ),
      generate(rng) {
        const kind = rng.pick(quadKinds);
        const p = rng.pick(quadProperties);
        const yes = p.has.includes(kind);
        return choiceProblem({
          prompt: t(
            `True or false: every ${quadNames[kind].en} has ${p.text.en}.`,
            `判断：每个${quadNames[kind]["zh-CN"]}都有${p.text["zh-CN"]}。`,
          ),
          options: [t("True", "正确"), t("False", "错误")],
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `True: having ${p.text.en} is part of what a ${quadNames[kind].en} is, or follows from it.`,
                `正确：${p.text["zh-CN"]}是${quadNames[kind]["zh-CN"]}的特征。`,
              )
            : t(
                `False: some ${quadNames[kind].en === "rhombus" ? "rhombuses" : `${quadNames[kind].en}s`} do not have ${p.text.en}.`,
                `错误：有些${quadNames[kind]["zh-CN"]}没有${p.text["zh-CN"]}。`,
              ),
        });
      },
    },
  ],
);

/** sideFigure draws a polygon with each listed side labeled. */
function sideFigure(pts: readonly Point[], labels: readonly (string | undefined)[], extra: readonly Mark[] = []): Figure {
  const marks: Mark[] = [{ kind: "polygon", points: pts, accent: true }, ...extra];
  pts.forEach((p, i) => {
    const text = labels[i];
    if (text) marks.push({ kind: "side", a: p, b: pts[(i + 1) % pts.length]!, text });
  });
  return fig(
    marks,
    `A polygon with side lengths ${labels.filter(Boolean).join(", ")}.`,
    `边长为 ${labels.filter(Boolean).join("、")} 的多边形。`,
  );
}

export const rectanglesRhombusesAndSquares = topic(
  "rectangles-rhombuses-and-squares",
  t("Rectangles, Rhombuses and Squares", "长方形、菱形和正方形"),
  t(
    "A rectangle has two pairs of equal opposite sides, so its perimeter is 2 × (length + width). A rhombus and a square have four equal sides, so the perimeter is 4 × side, and the side is the perimeter ÷ 4. A rectangle with perimeter 30 cm and length 9 cm has width 30 ÷ 2 − 9 = 6 cm.",
    "长方形的两组对边分别相等，所以周长是 2 ×（长 + 宽）。菱形和正方形的四条边都相等，周长是 4 × 边长，边长是周长 ÷ 4。周长 30 厘米、长 9 厘米的长方形，宽是 30 ÷ 2 − 9 = 6 厘米。",
  ),
  ["quadrilaterals", "perimeter"],
  ["5.G.B.3"],
  [
    {
      id: "perimeters-of-special-quadrilaterals",
      title: t("Perimeter from one or two sides", "由一两条边求周长"),
      explanation: t(
        "Perimeter is the total length around a shape. A rhombus and a square have four equal sides, so the perimeter is $4$ times one side. A rectangle has two pairs of equal sides, so it is $2 \\times$ (length $+$ width).\n\nA rhombus with one side $7$ cm has perimeter $4 \\times 7 = 28$ cm.",
        "周长是围成图形一周的总长度。菱形和正方形的四条边都相等，周长是边长的 $4$ 倍。长方形有两组相等的边，周长是 $2 \\times$（长 $+$ 宽）。\n\n一条边长 $7$ 厘米的菱形，周长是 $4 \\times 7 = 28$ 厘米。",
      ),
      generate(rng) {
        const kind = rng.pick<QuadKind>(["square", "rectangle", "rhombus"]);
        const u = rng.pick(lengthUnits);
        const marks = quadMarks(rng, kind);
        const pts = (marks[0] as Extract<Mark, { kind: "polygon" }>).points;
        const a = rng.int(3, 25);
        let b = rng.int(2, 20);
        if (b === a) b++;
        const p = kind === "rectangle" ? 2 * (a + b) : 4 * a;
        const labels = kind === "rectangle" ? [`${Math.max(a, b)} ${u.abbr}`, `${Math.min(a, b)} ${u.abbr}`] : [`${a} ${u.abbr}`];
        return {
          ...numberProblem({
            prompt: t(
              `What is the perimeter of the ${quadNames[kind].en}, in ${u.name.en}?`,
              `这个${quadNames[kind]["zh-CN"]}的周长是多少${u.name["zh-CN"]}？`,
            ),
            answer: p,
            form: "integer",
            wrong: kind === "rectangle" ? [a + b, a * b, 2 * a + b] : [a * a, 2 * a, a + 4],
            solution:
              kind === "rectangle"
                ? t(
                    `Opposite sides are equal: $2 \\times (${Math.max(a, b)} + ${Math.min(a, b)}) = ${p}$ ${u.name.en}.`,
                    `对边相等：$2 \\times (${Math.max(a, b)} + ${Math.min(a, b)}) = ${p}$ ${u.name["zh-CN"]}。`,
                  )
                : t(
                    `All four sides are equal: $4 \\times ${a} = ${p}$ ${u.name.en}.`,
                    `四条边都相等：$4 \\times ${a} = ${p}$ ${u.name["zh-CN"]}。`,
                  ),
          }),
          figure: sideFigure(pts, labels, marks.slice(1)),
        };
      },
    },
    {
      id: "sides-from-perimeters",
      title: t("A side from the perimeter", "由周长求边长"),
      explanation: t(
        "Work backward from the perimeter. For a square, divide it by $4$. For a rectangle, half the perimeter is length plus width, so subtract the known side from half the perimeter.\n\nA square with perimeter $36$ in has sides of $36 \\div 4 = 9$ in.",
        "根据周长倒推边长。正方形用周长除以 $4$。长方形周长的一半是长与宽的和，所以用周长的一半减去已知的边。\n\n周长 $36$ 英寸的正方形，边长是 $36 \\div 4 = 9$ 英寸。",
      ),
      generate(rng) {
        const kind = rng.pick<QuadKind>(["square", "rectangle", "rhombus"]);
        const u = rng.pick(lengthUnits);
        const a = rng.int(3, 30);
        if (kind !== "rectangle") {
          const p = 4 * a;
          return numberProblem({
            prompt: t(
              `A ${quadNames[kind].en} has a perimeter of ${p} ${u.name.en}. How long is each side?`,
              `一个${quadNames[kind]["zh-CN"]}的周长是 ${p} ${u.name["zh-CN"]}。每条边长多少？`,
            ),
            answer: a,
            form: "integer",
            wrong: [p / 2, p - 4, 2 * a + 1],
            solution: t(
              `Its four sides are equal: $${p} \\div 4 = ${a}$ ${u.name.en}.`,
              `四条边都相等：$${p} \\div 4 = ${a}$ ${u.name["zh-CN"]}。`,
            ),
          });
        }
        let b = rng.int(2, 25);
        if (b === a) b++;
        const p = 2 * (a + b);
        return numberProblem({
          prompt: t(
            `A rectangle has a perimeter of ${p} ${u.name.en} and a length of ${a} ${u.name.en}. What is its width?`,
            `一个长方形的周长是 ${p} ${u.name["zh-CN"]}，一条边长 ${a} ${u.name["zh-CN"]}。与它相邻的边长多少？`,
          ),
          answer: b,
          form: "integer",
          wrong: [p - a, p - 2 * a, p / 2].filter((x) => x !== b),
          solution: t(
            `Length plus width is half the perimeter: $${p} \\div 2 = ${a + b}$, so the width is $${a + b} - ${a} = ${b}$ ${u.name.en}.`,
            `相邻两边之和是周长的一半：$${p} \\div 2 = ${a + b}$，所以另一边长 $${a + b} - ${a} = ${b}$ ${u.name["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

export const perimetersOfShapes = topic(
  "perimeters-of-shapes",
  t("Perimeters of Shapes", "图形的周长"),
  t(
    "The perimeter of a polygon is the sum of the lengths of all its sides. Side lengths can be decimals or fractions: a triangle with sides 2.5 m, 3.4 m and 4 m has perimeter 9.9 m. If the perimeter and all but one side are known, subtract the known sides from the perimeter to find the missing one.",
    "多边形的周长是所有边长的和。边长可以是小数或分数：边长为 2.5 米、3.4 米、4 米的三角形，周长是 9.9 米。如果已知周长和除一条边以外的所有边，用周长减去已知各边就得到未知的边长。",
  ),
  ["polygons", "perimeter", "addition-with-unequal-numbers-of-decimals"],
  ["5.NBT.B.7"],
  [
    {
      id: "adding-decimal-side-lengths",
      title: t("Adding the sides", "把各边相加"),
      explanation: t(
        "Add all the side lengths. With decimals, line up the decimal points, writing zeros so every number has the same number of places.\n\nA quadrilateral with sides $3.2$, $4$, $2.75$ and $5.1$ cm: $3.20 + 4.00 + 2.75 + 5.10 = 15.05$ cm.",
        "把所有边长相加。小数相加时要把小数点对齐，添 $0$ 使小数位数相同。\n\n边长为 $3.2$、$4$、$2.75$、$5.1$ 厘米的四边形：$3.20 + 4.00 + 2.75 + 5.10 = 15.05$ 厘米。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const u = rng.pick(lengthUnits);
        const sides = Array.from({ length: n }, () => {
          const x = rng.int(300, 590);
          return rng.bool() ? x : Math.round(x / 10) * 10;
        });
        const total = sides.reduce((a, b) => a + b, 0);
        const v = Q.of(total, 100);
        const labels = sides.map((s) => `${dec(Q.of(s, 100))} ${u.abbr}`);
        return {
          ...numberProblem({
            prompt: t(
              `What is the perimeter of the ${polygonNames[n]!.en}, in ${u.name.en}?`,
              `这个${polygonNames[n]!["zh-CN"]}的周长是多少${u.name["zh-CN"]}？`,
            ),
            answer: v,
            form: "decimal",
            wrong: [
              Q.of(
                sides.reduce((a, b) => a + (b % 10 === 0 ? b / 10 : b), 0),
                100,
              ),
              v.sub(Q.of(sides[0]!, 100)),
              v.mul(Q.of(10)),
            ],
            solution: t(
              `Add all ${n} sides: $${sides.map((s) => dec(Q.of(s, 100))).join(" + ")} = ${dec(v)}$ ${u.name.en}.`,
              `把 ${n} 条边相加：$${sides.map((s) => dec(Q.of(s, 100))).join(" + ")} = ${dec(v)}$ ${u.name["zh-CN"]}。`,
            ),
          }),
          figure: sideFigure(randomPolygon(rng, n), labels),
        };
      },
    },
    {
      id: "missing-side-from-perimeter",
      title: t("A missing side", "求未知的边"),
      explanation: t(
        "A pentagon has perimeter $40$ ft and four sides of $8$, $9$, $6$ and $7$ ft, so the fifth side is $40 - 30 = 10$ ft.",
        "一个五边形的周长是 $40$ 英尺，其中四条边是 $8$、$9$、$6$、$7$ 英尺，所以第五条边是 $40 - 30 = 10$ 英尺。",
      ),
      generate(rng) {
        const n = rng.int(3, 6);
        const u = rng.pick(lengthUnits);
        const sides = Array.from({ length: n }, () => (n === 3 ? rng.int(12, 22) : rng.int(3, 30)));
        const p = sides.reduce((a, b) => a + b, 0);
        const miss = rng.int(0, n - 1);
        const known = sides.filter((_, i) => i !== miss);
        const labels = sides.map((s, i) => (i === miss ? "?" : `${s} ${u.abbr}`));
        return {
          ...numberProblem({
            prompt: t(
              `The ${polygonNames[n]!.en} has a perimeter of ${p} ${u.name.en}. What is the length of the side marked ?, in ${u.name.en}?`,
              `这个${polygonNames[n]!["zh-CN"]}的周长是 ${p} ${u.name["zh-CN"]}。标有 ? 的边长多少${u.name["zh-CN"]}？`,
            ),
            answer: sides[miss]!,
            form: "integer",
            wrong: [p + known.reduce((a, b) => a + b, 0), Math.round(p / n), p - known[0]!].filter((x) => x > 0 && x !== sides[miss]),
            solution: t(
              `The known sides add to $${known.join(" + ")} = ${p - sides[miss]!}$, so the missing side is $${p} - ${p - sides[miss]!} = ${sides[miss]}$ ${u.name.en}.`,
              `已知各边的和是 $${known.join(" + ")} = ${p - sides[miss]!}$，所以未知边长 $${p} - ${p - sides[miss]!} = ${sides[miss]}$ ${u.name["zh-CN"]}。`,
            ),
          }),
          figure: sideFigure(randomPolygon(rng, n), labels),
        };
      },
    },
  ],
);

/** isA tells whether every quadrilateral of kind x is also of kind y. */
function isA(x: QuadKind | "quadrilateral", y: QuadKind | "quadrilateral"): boolean {
  if (y === "quadrilateral") return true;
  const parents: Record<QuadKind | "quadrilateral", readonly string[]> = {
    square: ["rectangle", "rhombus", "parallelogram", "trapezoid"],
    rectangle: ["parallelogram", "trapezoid"],
    rhombus: ["parallelogram", "trapezoid"],
    parallelogram: ["trapezoid"],
    trapezoid: [],
    quadrilateral: [],
  };
  return parents[x].includes(y);
}

/** plural writes the plural of a quadrilateral name. */
const plural = (k: QuadKind | "quadrilateral"): Text => t(k === "rhombus" ? "rhombuses" : `${quadNames[k].en}s`, quadNames[k]["zh-CN"]);

export const classifyingQuadrilaterals = topic(
  "classifying-quadrilaterals",
  t("Classifying Quadrilaterals", "四边形的分类"),
  t(
    "Quadrilaterals form a hierarchy: every square is a rectangle and a rhombus, every rectangle and every rhombus is a parallelogram, every parallelogram is a trapezoid, and all of them are quadrilaterals. The reverse is not true: a rectangle is a square only when its sides are all equal. The most specific name of a quadrilateral is the lowest one in the hierarchy that fits.",
    '四边形之间有包含关系：正方形既是长方形也是菱形，长方形和菱形都是平行四边形，平行四边形都是梯形（按"至少一组对边平行"的定义），它们都是四边形。反过来不成立：只有四条边都相等的长方形才是正方形。一个四边形最准确的名称是包含关系中符合条件的最下面一层。',
  ),
  ["rectangles-rhombuses-and-squares"],
  ["5.G.B.3", "5.G.B.4"],
  [
    {
      id: "every-one-is-also",
      title: t("Is every one also…?", "是不是都是……？"),
      explanation: t(
        "Every square is a rhombus, since it has four equal sides. Not every rhombus is a square, since a rhombus need not have right angles.",
        "正方形都是菱形，因为它四条边都相等。菱形不都是正方形，因为菱形不一定有直角。",
      ),
      generate(rng) {
        const all: (QuadKind | "quadrilateral")[] = [...quadKinds, "quadrilateral"];
        const x = rng.pick(all);
        let y = rng.pick(all);
        while (y === x) y = rng.pick(all);
        const yes = isA(x, y);
        return choiceProblem({
          prompt: t(`Is every ${quadNames[x].en} a ${quadNames[y].en}?`, `每个${quadNames[x]["zh-CN"]}都是${quadNames[y]["zh-CN"]}吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: yes
            ? t(
                `Yes: every ${quadNames[x].en} has everything a ${quadNames[y].en} needs.`,
                `是：每个${quadNames[x]["zh-CN"]}都具备${quadNames[y]["zh-CN"]}的全部特征。`,
              )
            : t(`No: some ${plural(x).en} are not ${plural(y).en}.`, `不是：有些${quadNames[x]["zh-CN"]}不是${quadNames[y]["zh-CN"]}。`),
        });
      },
    },
    {
      id: "naming-from-a-description",
      title: t("Naming from a description", "根据描述命名"),
      explanation: t(
        "Use the sides and angles to find the most specific name. Four right angles make a rectangle; four equal sides make a rhombus; both together make a square. Two pairs of parallel sides without either property make a parallelogram.\n\nA quadrilateral with sides $6, 4, 6, 4$ and four right angles is a rectangle. It is not a square, since its sides are not all equal.",
        "根据边和角找出最准确的名称。四个角都是直角的是长方形；四条边都相等的是菱形；两者都满足的是正方形。两组对边分别平行、但不满足上面条件的是平行四边形。\n\n边长依次为 $6, 4, 6, 4$ 且有四个直角的四边形是长方形。它不是正方形，因为四条边不都相等。",
      ),
      generate(rng) {
        const kind = rng.pick(quadKinds);
        const a = rng.int(3, 15);
        let b = rng.int(2, 14);
        if (b === a) b++;
        const angle = rng.int(50, 80);
        const desc: Record<QuadKind, Text> = {
          square: t(`sides of ${a}, ${a}, ${a} and ${a} cm and four right angles`, `四条边都是 ${a} 厘米，四个角都是直角`),
          rectangle: t(
            `sides of ${a}, ${b}, ${a} and ${b} cm and four right angles`,
            `四条边依次是 ${a}、${b}、${a}、${b} 厘米，四个角都是直角`,
          ),
          rhombus: t(
            `sides of ${a}, ${a}, ${a} and ${a} cm and angles of ${angle}°, ${180 - angle}°, ${angle}° and ${180 - angle}°`,
            `四条边都是 ${a} 厘米，四个角依次是 ${angle}°、${180 - angle}°、${angle}°、${180 - angle}°`,
          ),
          parallelogram: t(
            `two pairs of parallel sides, sides of ${a}, ${b}, ${a} and ${b} cm, and angles of ${angle}°, ${180 - angle}°, ${angle}° and ${180 - angle}°`,
            `两组对边分别平行，四条边依次是 ${a}、${b}、${a}、${b} 厘米，四个角依次是 ${angle}°、${180 - angle}°、${angle}°、${180 - angle}°`,
          ),
          trapezoid: t(
            `exactly one pair of parallel sides, of ${Math.max(a, b)} cm and ${Math.min(a, b)} cm`,
            `只有一组对边平行，长分别是 ${Math.max(a, b)} 厘米和 ${Math.min(a, b)} 厘米`,
          ),
        };
        const why: Record<QuadKind, Text> = {
          square: t("Four equal sides and four right angles make a square.", "四条边相等且四个角都是直角，是正方形。"),
          rectangle: t(
            "Four right angles with sides of two lengths make a rectangle, not a square.",
            "四个直角，边长有两种，是长方形而不是正方形。",
          ),
          rhombus: t("Four equal sides without right angles make a rhombus, not a square.", "四条边相等但没有直角，是菱形而不是正方形。"),
          parallelogram: t(
            "Two pairs of parallel sides, sides of two lengths and no right angles make a parallelogram.",
            "两组对边分别平行，边长有两种，没有直角，是平行四边形。",
          ),
          trapezoid: t(
            "With only one pair of parallel sides it cannot be a parallelogram, so it is a trapezoid.",
            "只有一组对边平行，不是平行四边形，所以是梯形。",
          ),
        };
        return choiceProblem({
          prompt: t(
            `A quadrilateral has ${desc[kind].en}. What is its most specific name?`,
            `一个四边形${desc[kind]["zh-CN"]}。它最准确的名称是什么？`,
          ),
          options: quadKinds.map((k) => capital(quadNames[k])),
          correct: quadKinds.indexOf(kind),
          solution: why[kind],
        });
      },
    },
  ],
);

/** grade5MeasurementTopics lists the 5th grade topics on measurement, data, coordinates, patterns and geometry. */
export const grade5MeasurementTopics: readonly TopicDef[] = [
  convertingMetricUnitsOfLengthToLargerUnits,
  convertingCustomaryUnitsOfLengthToLargerUnits,
  convertingUnitsOfVolumeToLargerUnits,
  convertingUnitsOfMassToLargerUnits,
  convertingUnitsOfTimeToLargerUnits,
  operationsOnFractionsWithLinePlots,
  describingTheCoordinatePlane,
  solvingRealWorldProblemsUsingCoordinates,
  coordinatePlanesAsMaps,
  connectingPatterns,
  comparingPatterns,
  graphingPatterns,
  understandingVolumeUsingUnitCubes,
  unitsOfAreaAndVolume,
  volumesOfRightRectangularPrisms,
  volumesOfRightRectangularPrismsWordProblems,
  polygons,
  quadrilaterals,
  rectanglesRhombusesAndSquares,
  perimetersOfShapes,
  classifyingQuadrilaterals,
];
