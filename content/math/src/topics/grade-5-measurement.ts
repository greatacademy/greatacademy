import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { createRng, t } from "@ga/content";
import { dec, type Mark, type PlaneMark, type Point, plane, Q, sketch, svgDocument } from "@ga/subject-math";
import { mixedLatex, pointLatex, pointProblem, withMistakes } from "../problems.ts";
import { captioned, type Pair, picked, pickedMath, type Walk, walkThrough } from "./early-grades-more-kit.ts";
import { fractionPlot } from "./grade-4-measurement.ts";
import { answered, areaGridFigure, equalTape, lineFigure, point, tapeFigure } from "./upper-grades-kit.ts";

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

/** fmt writes a whole number with thousands separators. */
const fmt = (n: number) => n.toLocaleString("en-US");

/** tex writes a whole number in LaTeX with thousands separators. */
const tex = (n: number) => fmt(n).replace(/,/g, "{,}");

/** gcd is the greatest common divisor of two whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** fracTex writes a fraction in LaTeX. */
const fracTex = (a: number, b: number): string => `\\frac{${a}}{${b}}`;

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

/** Taught is the explanation and the figure of one knowledge point. */
interface Taught {
  readonly explanation: Pair;
  readonly figure: Figure;
}

/** powerOfTenExponent is k when n = 10ᵏ, or undefined. */
function powerOfTenExponent(n: number): number | undefined {
  for (let k = 1; k <= 4; k++) if (n === 10 ** k) return k;
  return undefined;
}

/** factorStep says how many smaller units make one larger unit, as the first step of a conversion. */
const factorStep = (c: Conversion): Walk => [
  ["Find the conversion factor", "找进率"],
  [`${amountEn(c.factor, c.small)} make 1 ${c.big.one.en}.`, `${amountZh(c.factor, c.small)}是 1 ${c.big.one["zh-CN"]}。`],
];

/** largerKPs builds the two knowledge points of a conversion to a larger unit: whole results, and results with a part of a unit. */
function largerKPs(prefix: string, conversions: readonly Conversion[], whole: Taught, part: Taught): KnowledgePointDef[] {
  return [
    point(
      `${prefix}-to-larger-units`,
      ["Dividing by the conversion factor", "除以进率"],
      whole.explanation,
      (rng) => {
        const c = rng.pick(conversions);
        const n = rng.int(2, c.factor >= 100 ? 15 : 12);
        const total = n * c.factor;
        return answered(
          [`How many ${c.big.many.en} are in ${amountEn(total, c.small)}?`, `${amountZh(total, c.small)}是多少${c.big.one["zh-CN"]}？`],
          n,
          [
            factorStep(c),
            [
              ["Divide", "做除法"],
              [
                `A ${c.big.one.en} holds many ${c.small.many.en}, so there are fewer ${c.big.many.en}. Divide.`,
                `1 ${c.big.one["zh-CN"]}里有许多${c.small.one["zh-CN"]}，换成${c.big.one["zh-CN"]}个数变少，所以用除法。`,
              ],
              [`${tex(total)} \\div ${tex(c.factor)} = ${n}`],
            ],
          ],
          [
            `Change back: $${n} \\times ${tex(c.factor)} = ${tex(total)}$ ${c.small.many.en}.`,
            `换回去：$${n} \\times ${tex(c.factor)} = ${tex(total)}$ ${c.small.one["zh-CN"]}。`,
          ],
          [
            [
              total * c.factor,
              `That multiplies. A ${c.big.one.en} is bigger, so the number should get smaller.`,
              `这是用了乘法。${c.big.one["zh-CN"]}比较大，个数应该变少。`,
            ],
            [total - c.factor, "That subtracts the conversion factor instead of dividing by it.", "这是减去了进率，应该除以进率。"],
            [
              n + 1,
              `Check it: $${n + 1} \\times ${tex(c.factor)} = ${tex((n + 1) * c.factor)}$, not ${fmt(total)}.`,
              `验算：$${n + 1} \\times ${tex(c.factor)} = ${tex((n + 1) * c.factor)}$，不是 ${fmt(total)}。`,
            ],
          ],
          { figure: equalTape(n, fmt(c.factor), fmt(total)) },
        );
      },
      whole.figure,
    ),
    point(
      `${prefix}-with-parts-to-larger-units`,
      ["Parts of a larger unit", "不满一个大单位"],
      part.explanation,
      (rng) => {
        const c = rng.pick(conversions);
        let total: number;
        do total = rng.int(c.factor + 1, 9 * c.factor + 9);
        while (total % c.factor === 0);
        const q = Math.floor(total / c.factor);
        const r = total % c.factor;
        const v = Q.of(total, c.factor);
        const back: Pair = [
          `Change back: $${q} \\times ${tex(c.factor)} + ${tex(r)} = ${tex(total)}$ ${c.small.many.en}.`,
          `换回去：$${q} \\times ${tex(c.factor)} + ${tex(r)} = ${tex(total)}$ ${c.small.one["zh-CN"]}。`,
        ];
        const k = powerOfTenExponent(c.factor);
        if (k !== undefined)
          return answered(
            [
              `Write ${amountEn(total, c.small)} in ${c.big.many.en}, as a decimal.`,
              `把 ${amountZh(total, c.small)}写成以${c.big.one["zh-CN"]}为单位的小数。`,
            ],
            v,
            [
              factorStep(c),
              [
                ["Move the decimal point", "移动小数点"],
                [
                  `Dividing by ${fmt(c.factor)} moves the decimal point ${k} place${k === 1 ? "" : "s"} to the left.`,
                  `除以 ${fmt(c.factor)}，小数点向左移动 ${k} 位。`,
                ],
                [`${tex(total)} \\div ${tex(c.factor)} = ${dec(v)}`],
              ],
            ],
            back,
            [
              [v.mul(Q.of(10)), "That moves the decimal point one place too few.", "这是小数点少移了一位。"],
              [v.div(Q.of(10)), "That moves the decimal point one place too many.", "这是小数点多移了一位。"],
              [Q.of(q), `That drops the ${amountEn(r, c.small)} left over.`, `这是丢掉了剩下的 ${amountZh(r, c.small)}。`],
            ],
            { form: "decimal" },
          );
        return answered(
          [
            `Write ${amountEn(total, c.small)} in ${c.big.many.en}, as a mixed number.`,
            `把 ${amountZh(total, c.small)}写成以${c.big.one["zh-CN"]}为单位的带分数。`,
          ],
          v,
          [
            factorStep(c),
            [
              ["Divide", "做除法"],
              [
                `Dividing ${fmt(total)} by ${c.factor} gives ${q} with ${r} left over.`,
                `${fmt(total)} 除以 ${c.factor}，商 ${q} 余 ${r}。`,
              ],
              [`${c.factor} \\times ${q} = ${tex(c.factor * q)}`],
            ],
            [
              ["Write the part left as a fraction", "把剩下的写成分数"],
              [
                `The ${amountEn(r, c.small)} left is ${r} out of the ${c.factor} in one ${c.big.one.en}.`,
                `剩下的 ${amountZh(r, c.small)}是 1 ${c.big.one["zh-CN"]}的 ${c.factor} 份中的 ${r} 份。`,
              ],
              [gcd(r, c.factor) === 1 ? `${q}${fracTex(r, c.factor)}` : `${q}${fracTex(r, c.factor)} = ${mixedLatex(v)}`],
            ],
          ],
          back,
          [
            [Q.of(q), `That drops the ${amountEn(r, c.small)} left over.`, `这是丢掉了剩下的 ${amountZh(r, c.small)}。`],
            ...(r < 10
              ? ([
                  [
                    Q.of(q * 10 + r, 10),
                    `That writes the ${r} left as tenths, but one ${c.big.one.en} is ${c.factor} ${c.small.many.en}, not 10.`,
                    `这是把剩下的 ${r} 当成了十分之几，可是 1 ${c.big.one["zh-CN"]}是 ${c.factor} ${c.small.one["zh-CN"]}，不是 10。`,
                  ],
                ] as const)
              : []),
            [
              Q.of(q + 1),
              `That counts the ${amountEn(r, c.small)} left as one more whole ${c.big.one.en}.`,
              `这是把剩下的 ${amountZh(r, c.small)}算成了一整个${c.big.one["zh-CN"]}。`,
            ],
          ],
          { form: "mixed" },
        );
      },
      part.figure,
    ),
  ];
}

/** leftTape draws a bar of `total` cut into whole pieces of `factor` and a shaded piece for what is left. */
function leftTape(total: number, factor: number): Figure {
  const q = Math.floor(total / factor);
  const r = total % factor;
  return tapeFigure(
    [
      {
        total: fmt(total),
        pieces: [
          ...Array.from({ length: q }, () => ({ size: factor, text: fmt(factor) })),
          ...(r ? [{ size: r, text: fmt(r), lit: true }] : []),
        ],
      },
    ],
    [
      `A bar of ${fmt(total)} cut into ${q} pieces of ${fmt(factor)}${r ? ` and a shaded piece of ${fmt(r)}` : ""}.`,
      `一个长 ${fmt(total)} 的长条，分成 ${q} 段 ${fmt(factor)}${r ? `，还有涂色的一段 ${fmt(r)}` : ""}。`,
    ],
  );
}

/** decimalLine draws a number line from 0 to `hi` in steps of `step` with a point at `at`. */
const decimalLine = (hi: number, step: number, at: number): Figure =>
  lineFigure({ lo: 0, hi, step, labels: Array.from({ length: hi + 1 }, (_, i) => i), marks: [{ at, text: String(at), result: true }] }, [
    `A number line from 0 to ${hi} with a point at ${at}.`,
    `一条从 0 到 ${hi} 的数轴，在 ${at} 处画点。`,
  ]);

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
    {
      explanation: [
        "A rope is 600 cm long. 100 cm make 1 m, so divide: $600 \\div 100 = 6$ m.\n\nCheck: $6 \\times 100 = 600$ cm.\n\n> **Watch out.** A larger unit gives a smaller number. Multiplying by 100 would give 60,000, far too many meters.",
        "一根绳子长 600 厘米。100 厘米是 1 米，所以用除法：$600 \\div 100 = 6$ 米。\n\n检验：$6 \\times 100 = 600$ 厘米。\n\n> **注意。** 换成大单位，数会变小。乘 100 得 60,000，米数就太多了。",
      ],
      figure: equalTape(6, "100", "600"),
    },
    {
      explanation: [
        "Write 1,250 m in kilometers. Dividing by 1,000 moves the decimal point 3 places to the left: $1{,}250 \\div 1{,}000 = 1.25$ km.\n\nCheck: 1 km is 1,000 m, and the other 250 m is $\\frac{250}{1{,}000} = 0.25$ km.\n\n> **Watch out.** Count the zeros in 1,000. Moving the point only 2 places gives 12.5, which is too big.",
        "把 1,250 米写成千米。除以 1,000，小数点向左移动 3 位：$1{,}250 \\div 1{,}000 = 1.25$ 千米。\n\n检验：1 千米是 1,000 米，另外 250 米是 $\\frac{250}{1{,}000} = 0.25$ 千米。\n\n> **注意。** 数清 1,000 有几个 0。小数点只移 2 位会得 12.5，太大了。",
      ],
      figure: decimalLine(2, 0.25, 1.25),
    },
  ),
  t(
    "A school race is 2,000 meters. Every 1,000 meters is 1 kilometer, so the race is $2{,}000 \\div 1{,}000 = 2$ kilometers.\n\nCheck: 2 kilometers is $2 \\times 1{,}000 = 2{,}000$ meters.\n\nIn this lesson we change metric lengths to larger units by dividing.",
    "学校赛跑全程 2,000 米。每 1,000 米是 1 千米，所以全程是 $2{,}000 \\div 1{,}000 = 2$ 千米。\n\n检验：2 千米是 $2 \\times 1{,}000 = 2{,}000$ 米。\n\n本课我们用除法把公制长度化成较大的单位。",
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
    {
      explanation: [
        "A shelf is 96 inches long. 12 inches make 1 foot, so divide: $96 \\div 12 = 8$ feet.\n\nCheck: $8 \\times 12 = 80 + 16 = 96$ inches.\n\n> **Watch out.** Divide, do not multiply. A foot is longer than an inch, so there are fewer feet than inches.",
        "一块搁板长 96 英寸。12 英寸是 1 英尺，所以用除法：$96 \\div 12 = 8$ 英尺。\n\n检验：$8 \\times 12 = 80 + 16 = 96$ 英寸。\n\n> **注意。** 要用除法，不是乘法。1 英尺比 1 英寸长，所以英尺数比英寸数少。",
      ],
      figure: equalTape(8, "12", "96"),
    },
    {
      explanation: [
        "Write 10 feet in yards. 3 feet make 1 yard, and $10 \\div 3$ is 3 with 1 left. The 1 foot left is $\\frac{1}{3}$ of a yard, so 10 feet is $3\\frac{1}{3}$ yards.\n\nCheck: $3 \\times 3 + 1 = 10$ feet.\n\n> **Watch out.** The 1 foot left is not 0.1 yard. A yard has 3 feet, not 10.",
        "把 10 英尺写成码。3 英尺是 1 码，$10 \\div 3$ 商 3 余 1。剩下的 1 英尺是 $\\frac{1}{3}$ 码，所以 10 英尺是 $3\\frac{1}{3}$ 码。\n\n检验：$3 \\times 3 + 1 = 10$ 英尺。\n\n> **注意。** 剩下的 1 英尺不是 0.1 码。1 码是 3 英尺，不是 10 英尺。",
      ],
      figure: leftTape(10, 3),
    },
  ),
  t(
    "A ribbon is 48 inches long. Every 12 inches make 1 foot, so the ribbon is $48 \\div 12 = 4$ feet.\n\nCheck: $4 \\times 12 = 48$ inches.\n\nIn this lesson we change inches and feet to larger units.",
    "一根丝带长 48 英寸。每 12 英寸是 1 英尺，所以丝带长 $48 \\div 12 = 4$ 英尺。\n\n检验：$4 \\times 12 = 48$ 英寸。\n\n本课我们把英寸和英尺化成较大的单位。",
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
    {
      explanation: [
        "A cooler holds 20 quarts. 4 quarts make 1 gallon, so divide: $20 \\div 4 = 5$ gallons.\n\nCheck: $5 \\times 4 = 20$ quarts.\n\n> **Watch out.** Use the right factor. 2 pints make a quart, but 4 quarts make a gallon.",
        "一个保温箱能装 20 夸脱。4 夸脱是 1 加仑，所以用除法：$20 \\div 4 = 5$ 加仑。\n\n检验：$5 \\times 4 = 20$ 夸脱。\n\n> **注意。** 要用对进率。2 品脱是 1 夸脱，而 4 夸脱才是 1 加仑。",
      ],
      figure: equalTape(5, "4", "20"),
    },
    {
      explanation: [
        "Write 2,750 mL in liters: $2{,}750 \\div 1{,}000 = 2.75$ L. Customary units give a mixed number instead: 9 pints is $4\\frac{1}{2}$ quarts.\n\nCheck: 2.75 L is 2 L and 750 mL, and $2{,}000 + 750 = 2{,}750$ mL.\n\n> **Watch out.** 750 mL is 0.75 L, not 0.075 L. Move the point exactly 3 places.",
        "把 2,750 毫升写成升：$2{,}750 \\div 1{,}000 = 2.75$ 升。英制单位则写成带分数：9 品脱是 $4\\frac{1}{2}$ 夸脱。\n\n检验：2.75 升是 2 升 750 毫升，$2{,}000 + 750 = 2{,}750$ 毫升。\n\n> **注意。** 750 毫升是 0.75 升，不是 0.075 升。小数点正好移 3 位。",
      ],
      figure: decimalLine(3, 0.25, 2.75),
    },
  ),
  t(
    "A pitcher holds 2,000 mL of juice. Every 1,000 mL make 1 liter, so it holds $2{,}000 \\div 1{,}000 = 2$ liters.\n\nCheck: $2 \\times 1{,}000 = 2{,}000$ mL.\n\nIn this lesson we change units of liquid volume to larger units.",
    "一个水壶装了 2,000 毫升果汁。每 1,000 毫升是 1 升，所以壶里有 $2{,}000 \\div 1{,}000 = 2$ 升。\n\n检验：$2 \\times 1{,}000 = 2{,}000$ 毫升。\n\n本课我们把容积单位化成较大的单位。",
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
    {
      explanation: [
        "A box of oranges is 80 ounces. 16 ounces make 1 pound, so divide: $80 \\div 16 = 5$ pounds.\n\nCheck: $5 \\times 16 = 50 + 30 = 80$ ounces.\n\n> **Watch out.** A pound is 16 ounces, not 10 or 12.",
        "一箱橙子重 80 盎司。16 盎司是 1 磅，所以用除法：$80 \\div 16 = 5$ 磅。\n\n检验：$5 \\times 16 = 50 + 30 = 80$ 盎司。\n\n> **注意。** 1 磅是 16 盎司，不是 10 盎司，也不是 12 盎司。",
      ],
      figure: equalTape(5, "16", "80"),
    },
    {
      explanation: [
        "Write 36 ounces in pounds. $36 \\div 16$ is 2 with 4 left. The 4 ounces left is $\\frac{4}{16} = \\frac{1}{4}$ of a pound, so 36 ounces is $2\\frac{1}{4}$ pounds.\n\nCheck: $2 \\times 16 + 4 = 36$ ounces.\n\n> **Watch out.** The 4 ounces left is $\\frac{4}{16}$ of a pound, not $\\frac{4}{10}$.",
        "把 36 盎司写成磅。$36 \\div 16$ 商 2 余 4。剩下的 4 盎司是 $\\frac{4}{16} = \\frac{1}{4}$ 磅，所以 36 盎司是 $2\\frac{1}{4}$ 磅。\n\n检验：$2 \\times 16 + 4 = 36$ 盎司。\n\n> **注意。** 剩下的 4 盎司是 $\\frac{4}{16}$ 磅，不是 $\\frac{4}{10}$ 磅。",
      ],
      figure: leftTape(36, 16),
    },
  ),
  t(
    "A bag of flour is 3,000 grams. Every 1,000 grams make 1 kilogram, so the bag is $3{,}000 \\div 1{,}000 = 3$ kilograms.\n\nCheck: $3 \\times 1{,}000 = 3{,}000$ grams.\n\nIn this lesson we change units of mass to larger units.",
    "一袋面粉重 3,000 克。每 1,000 克是 1 千克，所以这袋面粉重 $3{,}000 \\div 1{,}000 = 3$ 千克。\n\n检验：$3 \\times 1{,}000 = 3{,}000$ 克。\n\n本课我们把质量单位化成较大的单位。",
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
    {
      explanation: [
        "A song plays for 300 seconds. 60 seconds make 1 minute, so divide: $300 \\div 60 = 5$ minutes.\n\nCheck: $5 \\times 60 = 300$ seconds.\n\n> **Watch out.** A minute is 60 seconds, not 100.",
        "一首歌播放 300 秒。60 秒是 1 分钟，所以用除法：$300 \\div 60 = 5$ 分钟。\n\n检验：$5 \\times 60 = 300$ 秒。\n\n> **注意。** 1 分钟是 60 秒，不是 100 秒。",
      ],
      figure: equalTape(5, "60", "300"),
    },
    {
      explanation: [
        "Write 135 minutes in hours. $135 \\div 60$ is 2 with 15 left. The 15 minutes left is $\\frac{15}{60} = \\frac{1}{4}$ of an hour, so 135 minutes is $2\\frac{1}{4}$ hours.\n\nCheck: $2 \\times 60 + 15 = 135$ minutes.\n\n> **Watch out.** 2 hours 15 minutes is not 2.15 hours. Time is not counted in tens.",
        "把 135 分钟写成小时。$135 \\div 60$ 商 2 余 15。剩下的 15 分钟是 $\\frac{15}{60} = \\frac{1}{4}$ 小时，所以 135 分钟是 $2\\frac{1}{4}$ 小时。\n\n检验：$2 \\times 60 + 15 = 135$ 分钟。\n\n> **注意。** 2 小时 15 分不是 2.15 小时。时间不是十进制。",
      ],
      figure: leftTape(135, 60),
    },
  ),
  t(
    "A movie is 120 minutes long. Every 60 minutes make 1 hour, so it is $120 \\div 60 = 2$ hours long.\n\nCheck: $2 \\times 60 = 120$ minutes.\n\nIn this lesson we change units of time to larger units.",
    "一部电影长 120 分钟。每 60 分钟是 1 小时，所以这部电影长 $120 \\div 60 = 2$ 小时。\n\n检验：$2 \\times 60 = 120$ 分钟。\n\n本课我们把时间单位化成较大的单位。",
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

/** PointMiss is a wrong point with the reason a learner reaches it. */
type PointMiss = readonly [at: readonly [number, number], en: string, zh: string];

/** pointed asks for a point, works it in labelled steps with a check, and answers each distinct wrong point with its reason. */
function pointed(
  prompt: Pair,
  answer: readonly [number, number],
  walk: readonly Walk[],
  check: Pair,
  misses: readonly PointMiss[],
  figure?: Figure,
): Problem {
  const key = (p: readonly number[]) => p.join(",");
  const kept = misses.filter(([p], i) => key(p) !== key(answer) && misses.findIndex(([q]) => key(q) === key(p)) === i);
  const problem = withMistakes(
    pointProblem({ prompt: t(prompt[0], prompt[1]), answer, wrong: kept.map(([p]) => p), solution: walkThrough(walk, check) }),
    kept.map(([p, en, zh]) => ({ response: pointLatex(p), why: t(en, zh) })),
  );
  return figure ? { ...problem, figure } : problem;
}

/** plotFigure draws a line plot of values in steps of 1/d from 0 to 1. */
const plotFigure = (values: readonly number[], d: number, units: Text): Figure => ({
  svg: fractionPlot(values, d, 0, d),
  alt: t(`A line plot of amounts in ${units.en}, marked in steps of 1/${d}.`, `以${units["zh-CN"]}为单位的线图，刻度间隔为 1/${d}。`),
});

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
    point(
      "totals-from-fraction-line-plots",
      ["The total of all the data", "所有数据的总和"],
      [
        "Each dot is one item. The plot has dots at $\\frac{1}{8}$, $\\frac{1}{4}$, $\\frac{1}{4}$ and $\\frac{3}{8}$. Add every dot: $\\frac{1}{8} + \\frac{2}{8} + \\frac{2}{8} + \\frac{3}{8} = \\frac{8}{8} = 1$.\n\nCheck: count in eighths. $1 + 2 + 2 + 3 = 8$ eighths, which is 1.\n\n> **Watch out.** Add a value once for every dot above it. Two dots at $\\frac{1}{4}$ mean $\\frac{1}{4}$ twice.",
        "每个点表示一件物品。线图上的点在 $\\frac{1}{8}$、$\\frac{1}{4}$、$\\frac{1}{4}$ 和 $\\frac{3}{8}$。把每个点都加起来：$\\frac{1}{8} + \\frac{2}{8} + \\frac{2}{8} + \\frac{3}{8} = \\frac{8}{8} = 1$。\n\n检验：按八分之一来数。$1 + 2 + 2 + 3 = 8$ 个八分之一，就是 1。\n\n> **注意。** 一个值上面有几个点，就要加几次。$\\frac{1}{4}$ 上有两个点，就加两次 $\\frac{1}{4}$。",
      ],
      (rng) => {
        const d = rng.pick([4, 8]);
        const s = rng.pick(measured);
        const values = plotValues(rng, 1, d - 1);
        const count = values.reduce((a, b) => a + b, 0);
        const total = Q.of(count, d);
        const distinct = [...new Set(values)];
        return answered(
          [
            `The line plot shows how many ${s.units.en} are in some ${s.things.en}. What is the total amount in all of them?`,
            `线图表示一些${s.things["zh-CN"]}的量（单位：${s.units["zh-CN"]}）。它们一共是多少${s.units["zh-CN"]}？`,
          ],
          total,
          [
            [
              ["Read the dots", "读点"],
              [`Each dot is one item. There are ${values.length} dots.`, `每个点表示一件物品，一共有 ${values.length} 个点。`],
            ],
            [
              ["Add every dot", "把每个点相加"],
              ["Add each value once for every dot above it.", "一个值上面有几个点，就加几次。"],
              [`${sumSteps(values, d)} = ${mixedLatex(total)}`],
            ],
          ],
          [
            `Count steps of $\\frac{1}{${d}}$ instead. A dot at $\\frac{k}{${d}}$ is $k$ steps, and all the dots make ${count} steps. That is $\\frac{${count}}{${d}} = ${mixedLatex(total)}$.`,
            `换成数 $\\frac{1}{${d}}$ 的个数。$\\frac{k}{${d}}$ 处的一个点是 $k$ 个 $\\frac{1}{${d}}$，所有的点一共是 ${count} 个，也就是 $\\frac{${count}}{${d}} = ${mixedLatex(total)}$。`,
          ],
          [
            [values.length, "That counts the dots, not their values.", "这是数了点的个数，不是把值相加。"],
            [
              Q.of(
                distinct.reduce((a, b) => a + b, 0),
                d,
              ),
              "That adds each value only once, but some values have more than one dot.",
              "这是每个值只加了一次，可有的值上面不止一个点。",
            ],
            [Q.of(Math.max(...values), d), "That is only the largest value.", "这只是最大的那个值。"],
          ],
          { form: "mixed", figure: plotFigure(values, d, s.units) },
        );
      },
      plotFigure([1, 2, 2, 3], 8, t("inches", "英寸")),
    ),
    point(
      "sharing-the-total-equally",
      ["Sharing the total equally", "平均分总量"],
      [
        "Three jars hold $\\frac{1}{2}$, $\\frac{3}{4}$ and 1 cup of honey. The total is $\\frac{2}{4} + \\frac{3}{4} + \\frac{4}{4} = \\frac{9}{4}$ cups. Shared equally, each jar gets $\\frac{9}{4} \\div 3 = \\frac{3}{4}$ cup.\n\nCheck: $3 \\times \\frac{3}{4} = \\frac{9}{4}$, the total.\n\n> **Watch out.** The total is not the answer. Divide it by the number of jars.",
        "三罐蜂蜜分别有 $\\frac{1}{2}$、$\\frac{3}{4}$ 和 1 杯。总量是 $\\frac{2}{4} + \\frac{3}{4} + \\frac{4}{4} = \\frac{9}{4}$ 杯。平均分后，每罐是 $\\frac{9}{4} \\div 3 = \\frac{3}{4}$ 杯。\n\n检验：$3 \\times \\frac{3}{4} = \\frac{9}{4}$，正好是总量。\n\n> **注意。** 总量不是答案，还要除以罐数。",
      ],
      (rng) => {
        const d = rng.pick([4, 8]);
        const s = rng.pick(measured);
        const values = plotValues(rng, 1, d);
        const n = values.length;
        const total = Q.of(
          values.reduce((a, b) => a + b, 0),
          d,
        );
        const share = total.div(Q.of(n));
        return answered(
          [
            `The line plot shows how many ${s.units.en} are in some ${s.things.en}. If the total were shared equally among all of them, how much would each have?`,
            `线图表示一些${s.things["zh-CN"]}的量（单位：${s.units["zh-CN"]}）。如果把总量平均分，每一份是多少${s.units["zh-CN"]}？`,
          ],
          share,
          [
            [["Find the total", "求总量"], ["Add every dot.", "把每个点都加起来。"], [`${sumSteps(values, d)} = ${mixedLatex(total)}`]],
            [
              ["Share it", "平均分"],
              [`There are ${n} items, so divide by ${n}.`, `一共有 ${n} 份，所以除以 ${n}。`],
              [`${mixedLatex(total)} \\div ${n} = ${mixedLatex(share)}`],
            ],
          ],
          [
            `The ${n} shares together give back the total. $${n} \\times ${mixedLatex(share)} = ${mixedLatex(total)}$.`,
            `${n} 份合起来正好是总量。$${n} \\times ${mixedLatex(share)} = ${mixedLatex(total)}$。`,
          ],
          [
            [total, `That is the total. It still has to be shared among the ${n} items.`, `这是总量，还要平均分给 ${n} 份。`],
            [total.mul(Q.of(n)), `That multiplies by ${n} instead of dividing.`, `这是乘了 ${n}，应该除以 ${n}。`],
            [Q.of(n).div(total), `That divides ${n} by the total, the wrong way round.`, `这是用 ${n} 除以总量，顺序反了。`],
          ],
          { form: "mixed", figure: plotFigure(values, d, s.units) },
        );
      },
      plotFigure([2, 3, 4], 4, t("cups", "杯")),
    ),
  ],
  t(
    "Four friends measure their bean plants: $\\frac{1}{4}$, $\\frac{1}{2}$, $\\frac{1}{2}$ and $\\frac{3}{4}$ inch. Together the plants grew $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{2} + \\frac{3}{4} = 2$ inches.\n\nCheck: count in fourths. $1 + 2 + 2 + 3 = 8$ fourths, and 8 fourths is 2.\n\nIn this lesson we add and share the data on a line plot.",
    "四个朋友量了自己种的豆苗：$\\frac{1}{4}$、$\\frac{1}{2}$、$\\frac{1}{2}$ 和 $\\frac{3}{4}$ 英寸。豆苗一共长了 $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{2} + \\frac{3}{4} = 2$ 英寸。\n\n检验：按四分之一来数。$1 + 2 + 2 + 3 = 8$ 个四分之一，8 个四分之一就是 2。\n\n本课我们把线图上的数据相加，再平均分。",
  ),
);

// ---------------------------------------------------------------------------
// The coordinate plane

const firstQuadrant = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 };

/** grid draws marks on a first-quadrant grid from 0 to 10. */
const grid = (marks: readonly PlaneMark[], en: string, zh: string): Figure => ({ svg: plane(firstQuadrant, marks), alt: t(en, zh) });

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
    point(
      "reading-coordinates-in-the-first-quadrant",
      ["Reading coordinates", "读出点的坐标"],
      [
        "Point $A$ is 3 squares to the right of the origin and 7 squares up. So $A$ is at $(3, 7)$: across first, then up.\n\nCheck: look straight down from $A$ to the $x$-axis and you reach 3. Look straight across to the $y$-axis and you reach 7.\n\n> **Watch out.** Do not swap the numbers. $(7, 3)$ is a different point.",
        "点 $A$ 在原点向右 3 格、向上 7 格的地方，所以 $A$ 是 $(3, 7)$：先横着数，再往上数。\n\n检验：从 $A$ 往下看到 $x$ 轴，是 3；往左看到 $y$ 轴，是 7。\n\n> **注意。** 两个数不能交换。$(7, 3)$ 是另一个点。",
      ],
      (rng) => {
        const [x, y] = gridPoint(rng);
        const name = rng.pick(["A", "B", "P", "Q", "R"]);
        return pointed(
          [`Write the coordinates of point $${name}$.`, `写出点 $${name}$ 的坐标。`],
          [x, y],
          [
            [["Go across", "横着数"], ["Look straight down to the $x$-axis.", "从点往下看到 $x$ 轴。"], [`x = ${x}`]],
            [["Go up", "往上数"], ["Look straight across to the $y$-axis.", "从点往左看到 $y$ 轴。"], [`y = ${y}`]],
            [["Write the pair", "写出数对"], ["Write $x$ first, then $y$.", "先写 $x$，再写 $y$。"], [`${name} = ${pointLatex([x, y])}`]],
          ],
          [
            `Start at the origin, go ${x} right and ${y} up. You land on $${name}$.`,
            `从原点出发，向右 ${x} 格，再向上 ${y} 格，正好到达点 $${name}$。`,
          ],
          [
            [[y, x], "That swaps the numbers. Write the distance across first.", "这是把两个数交换了。要先写横着的距离。"],
            [[x + 1, y], "That counts one square too many across.", "这是横着多数了 1 格。"],
            [[x, y + 1], "That counts one square too many up.", "这是往上多数了 1 格。"],
          ],
          grid(
            [{ kind: "point", at: [x, y], label: name, accent: true }],
            `A point ${name} on a grid from 0 to 10.`,
            `0 到 10 的网格上的一个点 ${name}。`,
          ),
        );
      },
      grid([{ kind: "point", at: [3, 7], label: "A", accent: true }], "Point A on a grid from 0 to 10.", "0 到 10 的网格上的点 A。"),
    ),
    point(
      "locating-points-in-the-first-quadrant",
      ["Locating a point", "找到给定坐标的点"],
      [
        "To find $(6, 2)$, start at the origin, go 6 to the right and then 2 up.\n\nCheck: from the point, look down to the $x$-axis to read 6 and across to the $y$-axis to read 2.\n\n> **Watch out.** $(2, 6)$ is 2 to the right and 6 up. It is not the same point as $(6, 2)$.",
        "要找 $(6, 2)$，从原点出发，先向右走 6 格，再向上走 2 格。\n\n检验：从这个点往下看到 $x$ 轴是 6，往左看到 $y$ 轴是 2。\n\n> **注意。** $(2, 6)$ 是向右 2、向上 6，和 $(6, 2)$ 不是同一个点。",
      ],
      (rng) => {
        const [a, b] = gridPoint(rng, 1);
        const candidates: (readonly [readonly [number, number], string, string])[] = [
          [[b, a], "That point swaps the two numbers.", "这个点把两个数交换了。"],
          [[a + (a < 10 ? 1 : -1), b], "That point is one square off across.", "这个点横着差了 1 格。"],
          [[a, b + (b < 10 ? 1 : -1)], "That point is one square off up and down.", "这个点上下差了 1 格。"],
          [[a - (a > 1 ? 1 : -1), b - (b > 1 ? 1 : -1)], "That point is one square off both ways.", "这个点横竖都差了 1 格。"],
        ];
        const others = rng.sample(
          candidates.filter(([[x, y]], i) => !(x === a && y === b) && candidates.findIndex(([[p, q]]) => p === x && q === y) === i),
          3,
        );
        const points = rng.shuffle<readonly [number, number]>([[a, b], ...others.map(([p]) => p)]);
        const names = ["A", "B", "C", "D"];
        const nameOf = (p: readonly [number, number]) => names[points.indexOf(p)]!;
        return picked(
          rng,
          [`Which point is at $${pointLatex([a, b])}$?`, `哪个点的坐标是 $${pointLatex([a, b])}$？`],
          [nameOf(points.find(([x, y]) => x === a && y === b)!), nameOf(points.find(([x, y]) => x === a && y === b)!)],
          others.map(
            ([p, en, zh]) => [[nameOf(p), nameOf(p)], `${en} It is at $${pointLatex(p)}$.`, `${zh}它在 $${pointLatex(p)}$。`] as const,
          ),
          [
            [
              ["Go across", "横着走"],
              [`Start at the origin and go ${a} to the right.`, `从原点出发，向右走 ${a} 格。`],
            ],
            [
              ["Go up", "往上走"],
              [
                `Then go ${b} up. You reach point ${nameOf(points.find(([x, y]) => x === a && y === b)!)}.`,
                `再向上走 ${b} 格，到达点 ${nameOf(points.find(([x, y]) => x === a && y === b)!)}。`,
              ],
            ],
          ],
          [
            `Read the point found: down to the $x$-axis is ${a} and across to the $y$-axis is ${b}.`,
            `读出找到的点：往下到 $x$ 轴是 ${a}，往左到 $y$ 轴是 ${b}。`,
          ],
          grid(
            points.map((p, i): PlaneMark => ({ kind: "point", at: p, label: names[i]! })),
            "Four labeled points on a grid from 0 to 10.",
            "0 到 10 的网格上有四个带字母的点。",
          ),
        );
      },
      grid(
        [
          { kind: "point", at: [6, 2], label: "A", accent: true },
          { kind: "point", at: [2, 6], label: "B" },
        ],
        "Points A and B on a grid from 0 to 10.",
        "0 到 10 的网格上的点 A 和点 B。",
      ),
    ),
  ],
  t(
    "On a classroom map the door is at $(0, 0)$. Lily's desk is 3 squares to the right and 5 squares up, so it is at $(3, 5)$.\n\nCheck: from $(3, 5)$ go 5 down and 3 left. You are back at the door.\n\nIn this lesson we name points on a grid with ordered pairs.",
    "教室地图上，门在 $(0, 0)$。莉莉的课桌在向右 3 格、向上 5 格的地方，所以在 $(3, 5)$。\n\n检验：从 $(3, 5)$ 向下走 5 格、向左走 3 格，就回到了门口。\n\n本课我们用有序数对表示网格上的点。",
  ),
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
    point(
      "moving-from-a-point",
      ["Moving from a point", "从一个点移动"],
      [
        "From $(2, 6)$, go 5 east and 3 south. East adds to $x$ and south takes away from $y$: $(2 + 5, 6 - 3) = (7, 3)$.\n\nCheck: go back 5 west and 3 north from $(7, 3)$. You reach $(2, 6)$.\n\n> **Watch out.** East and west change only $x$. North and south change only $y$.",
        "从 $(2, 6)$ 出发，向东走 5，再向南走 3。向东 $x$ 加，向南 $y$ 减：$(2 + 5, 6 - 3) = (7, 3)$。\n\n检验：从 $(7, 3)$ 向西退 5、向北退 3，回到 $(2, 6)$。\n\n> **注意。** 向东、向西只改变 $x$；向南、向北只改变 $y$。",
      ],
      (rng) => {
        const c = rng.pick(gridContexts);
        const [x, y] = [rng.int(1, 8), rng.int(1, 8)];
        let dx = 0;
        let dy = 0;
        while (dx === 0 || dy === 0) [dx, dy] = [rng.int(-x, 10 - x), rng.int(-y, 10 - y)];
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        const h: Pair = [
          `${ax} ${ax === 1 ? c.unit.en : c.units.en} ${dx > 0 ? "east" : "west"}`,
          `向${dx > 0 ? "东" : "西"} ${ax} ${c.unit["zh-CN"]}`,
        ];
        const v: Pair = [
          `${ay} ${ay === 1 ? c.unit.en : c.units.en} ${dy > 0 ? "north" : "south"}`,
          `向${dy > 0 ? "北" : "南"} ${ay} ${c.unit["zh-CN"]}`,
        ];
        const [ex, ey] = [x + dx, y + dy];
        const sx = dx > 0 ? "+" : "-";
        const sy = dy > 0 ? "+" : "-";
        return pointed(
          [
            `On a grid where each unit is 1 ${c.unit.en}, with east to the right and north up, ${c.mover.en} from $${pointLatex([x, y])}$ ${h[0]}, then ${v[0]}. Where does the trip end?`,
            `在一个每格表示 1 ${c.unit["zh-CN"]}、右为东、上为北的网格上，${c.mover["zh-CN"]}从 $${pointLatex([x, y])}$ 出发，先${h[1]}，再${v[1]}。终点在哪里？`,
          ],
          [ex, ey],
          [
            [
              ["Change x", "改变 x"],
              [`Going ${dx > 0 ? "east adds to" : "west takes away from"} $x$.`, `向${dx > 0 ? "东走，$x$ 加" : "西走，$x$ 减"} ${ax}。`],
              [`${x} ${sx} ${ax} = ${ex}`],
            ],
            [
              ["Change y", "改变 y"],
              [`Going ${dy > 0 ? "north adds to" : "south takes away from"} $y$.`, `向${dy > 0 ? "北走，$y$ 加" : "南走，$y$ 减"} ${ay}。`],
              [`${y} ${sy} ${ay} = ${ey}`],
            ],
          ],
          [
            `Go back from $${pointLatex([ex, ey])}$: ${ax} ${dx > 0 ? "west" : "east"} and ${ay} ${dy > 0 ? "south" : "north"} lead to $${pointLatex([x, y])}$, the start.`,
            `从 $${pointLatex([ex, ey])}$ 往回走：向${dx > 0 ? "西" : "东"} ${ax}、向${dy > 0 ? "南" : "北"} ${ay}，回到起点 $${pointLatex([x, y])}$。`,
          ],
          [
            [[x - dx, y - dy], "That moves the opposite way on both.", "这是两个方向都走反了。"],
            [[ey, ex], "That swaps the coordinates. Write $x$ first.", "这是把两个坐标交换了。要先写 $x$。"],
            [
              [x + dy, y + dx],
              "That adds the east or west move to $y$ and the north or south move to $x$.",
              "这是把东西方向的移动加到了 $y$ 上，把南北方向的移动加到了 $x$ 上。",
            ],
          ],
        );
      },
      grid(
        [
          { kind: "point", at: [2, 6], label: "A" },
          { kind: "point", at: [7, 3], label: "B", accent: true },
        ],
        "A trip from A at (2, 6) to B at (7, 3) on a grid.",
        "网格上从 A (2, 6) 到 B (7, 3) 的行程。",
      ),
    ),
    point(
      "distances-along-grid-lines",
      ["Distances along a grid line", "沿网格线的距离"],
      [
        "The pool is at $(3, 8)$ and the park is at $(3, 1)$. Both have $x = 3$, so they are on one up-and-down line. The distance is $8 - 1 = 7$ units.\n\nCheck: count up from $(3, 1)$: 2, 3, 4, 5, 6, 7, 8. That is 7 steps.\n\n> **Watch out.** Subtract the coordinates that are different. Adding them gives 9, which is too far.",
        "游泳池在 $(3, 8)$，公园在 $(3, 1)$。两点的 $x$ 都是 3，所以在同一条竖直线上。距离是 $8 - 1 = 7$ 个单位。\n\n检验：从 $(3, 1)$ 往上数：2、3、4、5、6、7、8，一共 7 步。\n\n> **注意。** 要把不同的那个坐标相减。相加得 9，就太远了。",
      ],
      (rng) => {
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
        const [P, R] = rng.pick([
          [t("the school", "学校"), t("the library", "图书馆")],
          [t("the park", "公园"), t("the pool", "游泳池")],
          [t("the bakery", "面包店"), t("the bank", "银行")],
          [t("the museum", "博物馆"), t("the zoo", "动物园")],
        ] as const);
        const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
        return answered(
          [
            `On a map where each unit is 1 ${c.unit.en}, ${P.en} is at $${pointLatex(p)}$ and ${R.en} is at $${pointLatex(q)}$. How many ${c.units.en} apart are they?`,
            `在一张每格表示 1 ${c.unit["zh-CN"]}的地图上，${P["zh-CN"]}在 $${pointLatex(p)}$，${R["zh-CN"]}在 $${pointLatex(q)}$。它们相距多少${c.unit["zh-CN"]}？`,
          ],
          dist,
          [
            [
              ["Find the matching coordinate", "找相同的坐标"],
              [
                `Both points have ${across ? "$y$" : "$x$"} $= ${k}$, so they are on one ${across ? "left-to-right" : "up-and-down"} line.`,
                `两点的 ${across ? "$y$" : "$x$"} 都是 ${k}，所以在同一条${across ? "水平" : "竖直"}线上。`,
              ],
            ],
            [
              ["Subtract the other coordinates", "另一个坐标相减"],
              ["Take the smaller from the larger.", "用大数减小数。"],
              [`${hi} - ${lo} = ${dist}`],
            ],
          ],
          [`Count on from ${lo} to ${hi}: that is ${dist} step${dist === 1 ? "" : "s"}.`, `从 ${lo} 数到 ${hi}，一共 ${dist} 步。`],
          [
            [a + b, "That adds the coordinates. Subtract them to find the gap.", "这是把坐标相加了。求距离要相减。"],
            [k, "That is the coordinate the two points share, not the distance.", "这是两点相同的那个坐标，不是距离。"],
            [dist + 1, "That counts the grid lines, not the spaces between them.", "这是数了网格线的条数，不是格子之间的距离。"],
          ],
        );
      },
      grid(
        [
          { kind: "point", at: [3, 8], label: "P", accent: true },
          { kind: "point", at: [3, 1], label: "Q", accent: true },
        ],
        "Points P at (3, 8) and Q at (3, 1) on one vertical line.",
        "同一条竖直线上的点 P (3, 8) 和点 Q (3, 1)。",
      ),
    ),
  ],
  t(
    "A robot starts at $(2, 1)$. It rolls 4 squares east and 3 squares north. Going east adds to $x$ and going north adds to $y$, so it stops at $(2 + 4, 1 + 3) = (6, 4)$.\n\nCheck: roll back 4 west and 3 south from $(6, 4)$. That gives $(2, 1)$ again.\n\nIn this lesson we use coordinates to describe trips and distances.",
    "一个机器人从 $(2, 1)$ 出发，向东走 4 格，再向北走 3 格。向东 $x$ 增加，向北 $y$ 增加，所以它停在 $(2 + 4, 1 + 3) = (6, 4)$。\n\n检验：从 $(6, 4)$ 向西退 4 格、向南退 3 格，又回到 $(2, 1)$。\n\n本课我们用坐标描述行程和距离。",
  ),
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
    point(
      "finding-a-place-on-a-map",
      ["Finding a place", "找到地点"],
      [
        "The library is 4 to the right and 7 up, so it is at $(4, 7)$. To find the place at $(4, 7)$, go 4 right and then 7 up.\n\nCheck: from the library, look down to the $x$-axis to read 4 and across to the $y$-axis to read 7.\n\n> **Watch out.** $(7, 4)$ is 7 right and 4 up, a different place.",
        "图书馆在向右 4、向上 7 的地方，所以它在 $(4, 7)$。要找 $(4, 7)$ 处的地点，先向右走 4，再向上走 7。\n\n检验：从图书馆往下看到 $x$ 轴是 4，往左看到 $y$ 轴是 7。\n\n> **注意。** $(7, 4)$ 是向右 7、向上 4，是另一个地方。",
      ],
      (rng) => {
        const spots = mapOf(rng, 4);
        const target = rng.pick(spots);
        const key = mapKey(spots);
        const [x, y] = target.at;
        return picked(
          rng,
          [
            `On the map, ${key.en}. Which place is at $${pointLatex(target.at)}$?`,
            `地图上，${key["zh-CN"]}。哪个地点的坐标是 $${pointLatex(target.at)}$？`,
          ],
          [target.place.name.en, target.place.name["zh-CN"]],
          spots
            .filter((s) => s !== target)
            .map(
              (s) =>
                [
                  [s.place.name.en, s.place.name["zh-CN"]],
                  `That place is at $${pointLatex(s.at)}$.`,
                  `这个地点在 $${pointLatex(s.at)}$。`,
                ] as const,
            ),
          [
            [
              ["Go across", "横着走"],
              [`Start at the origin and go ${x} to the right.`, `从原点出发，向右走 ${x}。`],
            ],
            [
              ["Go up", "往上走"],
              [`Then go ${y} up. The letter there is ${target.place.letter}.`, `再向上走 ${y}，那里的字母是 ${target.place.letter}。`],
            ],
          ],
          [
            `From ${target.place.letter}, look down to the $x$-axis to read ${x} and across to the $y$-axis to read ${y}.`,
            `从 ${target.place.letter} 往下看到 $x$ 轴是 ${x}，往左看到 $y$ 轴是 ${y}。`,
          ],
          mapFigure(spots),
        );
      },
      grid(
        [
          { kind: "point", at: [4, 7], label: "L", accent: true },
          { kind: "point", at: [7, 4], label: "P" },
        ],
        "A map with the library L at (4, 7) and the park P at (7, 4).",
        "地图上图书馆 L 在 (4, 7)，公园 P 在 (7, 4)。",
      ),
    ),
    point(
      "walking-distances-on-a-map",
      ["Walking along the grid", "沿网格行走的路程"],
      [
        "From $(1, 6)$ to $(5, 2)$ along the streets: across $5 - 1 = 4$ blocks and down $6 - 2 = 4$ blocks. So the walk is $4 + 4 = 8$ blocks.\n\nCheck: walk down first, then across. It is still $4 + 4 = 8$ blocks.\n\n> **Watch out.** Add both parts of the walk. The across part alone is too short.",
        "沿街道从 $(1, 6)$ 走到 $(5, 2)$：横着走 $5 - 1 = 4$ 个街区，往下走 $6 - 2 = 4$ 个街区。所以一共走 $4 + 4 = 8$ 个街区。\n\n检验：先往下走再横着走，还是 $4 + 4 = 8$ 个街区。\n\n> **注意。** 两段路都要加上。只算横着的一段就太短了。",
      ],
      (rng) => {
        const spots = mapOf(rng, 3);
        const [a, b] = rng.sample(spots, 2) as [(typeof spots)[number], (typeof spots)[number]];
        const dx = Math.abs(a.at[0] - b.at[0]);
        const dy = Math.abs(a.at[1] - b.at[1]);
        const key = mapKey(spots);
        const [an, bn] = [a.place.name.en.toLowerCase(), b.place.name.en.toLowerCase()];
        return answered(
          [
            `On the map, each unit is 1 block and ${key.en}. How many blocks is it from the ${an} to the ${bn}, walking only along the grid lines the shortest way?`,
            `地图上每格表示 1 个街区，${key["zh-CN"]}。只沿网格线走最短的路，从${a.place.name["zh-CN"]}到${b.place.name["zh-CN"]}要走几个街区？`,
          ],
          dx + dy,
          [
            [
              ["Find the places", "找到两个地点"],
              [
                `The ${an} is at $${pointLatex(a.at)}$ and the ${bn} is at $${pointLatex(b.at)}$.`,
                `${a.place.name["zh-CN"]}在 $${pointLatex(a.at)}$，${b.place.name["zh-CN"]}在 $${pointLatex(b.at)}$。`,
              ],
            ],
            [
              ["Find each part", "求两段路"],
              [
                "Subtract the $x$-coordinates for across and the $y$-coordinates for up or down.",
                "$x$ 坐标相减得横着的路，$y$ 坐标相减得上下的路。",
              ],
              [
                `${Math.max(a.at[0], b.at[0])} - ${Math.min(a.at[0], b.at[0])} = ${dx}`,
                `${Math.max(a.at[1], b.at[1])} - ${Math.min(a.at[1], b.at[1])} = ${dy}`,
              ],
            ],
            [["Add", "相加"], ["The walk is both parts together.", "全程是两段路的和。"], [`${dx} + ${dy} = ${dx + dy}`]],
          ],
          [
            `Walk the other way round: first ${dy} up or down, then ${dx} across. That is ${dy + dx} blocks again.`,
            `换个顺序走：先上下走 ${dy}，再横着走 ${dx}，还是 ${dy + dx} 个街区。`,
          ],
          [
            [Math.max(dx, dy), "That is only one part of the walk. Add the other part.", "这只是其中一段路，还要加上另一段。"],
            [Math.abs(dx - dy), "That subtracts the two parts. The walk adds them.", "这是把两段路相减了。全程要相加。"],
            [
              a.at[0] + a.at[1] + b.at[0] + b.at[1],
              "That adds all four coordinates. Subtract the coordinates first.",
              "这是把四个坐标都加起来了。要先把坐标相减。",
            ],
          ],
          { figure: mapFigure(spots) },
        );
      },
      grid(
        [
          { kind: "point", at: [1, 6], label: "A" },
          { kind: "point", at: [5, 2], label: "B", accent: true },
        ],
        "A walk from A at (1, 6) to B at (5, 2) on a map.",
        "地图上从 A (1, 6) 到 B (5, 2) 的路线。",
      ),
    ),
  ],
  t(
    "On a town map the school is at $(2, 3)$ and the park is at $(6, 8)$. Walking along the streets, Sam goes $6 - 2 = 4$ blocks east and $8 - 3 = 5$ blocks north. That is $4 + 5 = 9$ blocks.\n\nCheck: walk north first and then east. It is still $5 + 4 = 9$ blocks.\n\nIn this lesson we read maps drawn on a coordinate grid.",
    "在一张小镇地图上，学校在 $(2, 3)$，公园在 $(6, 8)$。山姆沿着街道走，向东走 $6 - 2 = 4$ 个街区，向北走 $8 - 3 = 5$ 个街区，一共 $4 + 5 = 9$ 个街区。\n\n检验：先向北再向东走，还是 $5 + 4 = 9$ 个街区。\n\n本课我们读画在坐标网格上的地图。",
  ),
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

/** stepTapes draws the step of pattern A as one piece and the step of pattern B as k such pieces. */
const stepTapes = (a: number, k: number): Figure =>
  tapeFigure(
    [
      { pieces: [{ size: a, text: String(a) }] },
      { pieces: Array.from({ length: k }, (_, i) => ({ size: a, text: String(a), lit: i === 0 })) },
    ],
    [
      `Two bars: the step of pattern A is ${a}, and the step of pattern B is ${k} pieces of ${a}.`,
      `两个长条：规律 A 每次加 ${a}，规律 B 每次加 ${k} 个 ${a}。`,
    ],
  );

/** pointsGrid draws points on the first-quadrant grid. */
const pointsGrid = (pts: readonly (readonly [number, number])[]): Figure =>
  grid(
    pts.map((p): PlaneMark => ({ kind: "point", at: [p[0], p[1]], accent: true })),
    `Points ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")} on a grid.`,
    `网格上的点 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
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
    point(
      "relating-corresponding-terms",
      ["How many times as large", "是几倍"],
      [
        "A: 0, 4, 8, 12. B: 0, 12, 24, 36. Compare the terms in the same place: $12 \\div 4 = 3$. Each term of B is 3 times the matching term of A.\n\nCheck: $3 \\times 8 = 24$ and $3 \\times 12 = 36$.\n\n> **Watch out.** Divide, do not subtract. $12 - 4 = 8$ is a difference, and it changes from pair to pair.",
        "A：0、4、8、12。B：0、12、24、36。比较位置相同的项：$12 \\div 4 = 3$。B 的每一项都是 A 中对应项的 3 倍。\n\n检验：$3 \\times 8 = 24$，$3 \\times 12 = 36$。\n\n> **注意。** 要用除法，不是减法。$12 - 4 = 8$ 是差，而且每对的差都不一样。",
      ],
      (rng) => {
        const { a, b, k } = patternPair(rng);
        const n = rng.int(4, 6);
        return answered(
          [
            `Pattern A: $${terms(a, n).join(", ")}, \\ldots$ Pattern B: $${terms(b, n).join(", ")}, \\ldots$ Each term of pattern B is how many times the matching term of pattern A?`,
            `规律 A：$${terms(a, n).join(", ")}, \\ldots$ 规律 B：$${terms(b, n).join(", ")}, \\ldots$ 规律 B 的每一项是规律 A 中对应项的几倍？`,
          ],
          k,
          [
            [
              ["Pick matching terms", "取一对对应项"],
              [`The second terms are ${a} and ${b}. Divide.`, `第二项分别是 ${a} 和 ${b}，用除法。`],
              [`${b} \\div ${a} = ${k}`],
            ],
            [
              ["Test another pair", "再试一对"],
              ["The third terms must give the same answer.", "第三项也要得到同样的结果。"],
              [`${k} \\times ${2 * a} = ${2 * b}`],
            ],
          ],
          [
            `B adds ${b} each time and A adds ${a}, and $${b} \\div ${a} = ${k}$.`,
            `B 每次加 ${b}，A 每次加 ${a}，$${b} \\div ${a} = ${k}$。`,
          ],
          [
            [b - a, "That is the difference of two terms. It is not the same for every pair.", "这是两项的差，而且每对的差都不一样。"],
            [b, "That is a term of B, not how many times as large.", "这是 B 的一项，不是倍数。"],
            [
              k + 1,
              `Check it: $${k + 1} \\times ${a} = ${(k + 1) * a}$, not ${b}.`,
              `验算：$${k + 1} \\times ${a} = ${(k + 1) * a}$，不是 ${b}。`,
            ],
          ],
          { figure: stepTapes(a, k) },
        );
      },
      stepTapes(4, 3),
    ),
    point(
      "finding-a-matching-term",
      ["Finding the matching term", "求对应的项"],
      [
        "A adds 2 and B adds 10, so each term of B is $10 \\div 2 = 5$ times A's. When A is 16, B is $5 \\times 16 = 80$.\n\nCheck: A reaches 16 after $16 \\div 2 = 8$ steps, and B after 8 steps is $8 \\times 10 = 80$.\n\n> **Watch out.** Multiply by the factor 5, not by B's step 10.",
        "A 每次加 2，B 每次加 10，所以 B 的每一项是 A 的 $10 \\div 2 = 5$ 倍。当 A 是 16 时，B 是 $5 \\times 16 = 80$。\n\n检验：A 加了 $16 \\div 2 = 8$ 次才到 16，B 加 8 次是 $8 \\times 10 = 80$。\n\n> **注意。** 要乘倍数 5，不是乘 B 每次加的 10。",
      ],
      (rng) => {
        const { a, b, k } = patternPair(rng);
        const i = rng.int(5, 12);
        const r = rules(a, b);
        return answered(
          [
            `${r.en} When a term of pattern A is $${i * a}$, what is the matching term of pattern B?`,
            `${r["zh-CN"]}当规律 A 的某一项是 $${i * a}$ 时，规律 B 中对应的项是多少？`,
          ],
          i * b,
          [
            [["Find the factor", "求倍数"], ["Compare the steps.", "比较每次加的数。"], [`${b} \\div ${a} = ${k}`]],
            [
              ["Multiply", "相乘"],
              [`Each term of B is ${k} times the matching term of A.`, `B 的每一项是 A 中对应项的 ${k} 倍。`],
              [`${k} \\times ${i * a} = ${i * b}`],
            ],
          ],
          [
            `Count the steps: A reaches ${i * a} after $${i * a} \\div ${a} = ${i}$ steps, and B after ${i} steps is $${i} \\times ${b} = ${i * b}$.`,
            `数次数：A 加了 $${i * a} \\div ${a} = ${i}$ 次到 ${i * a}，B 加 ${i} 次是 $${i} \\times ${b} = ${i * b}$。`,
          ],
          [
            [
              i * a + b - a,
              "That adds the same amount to A's term. B grows faster, so multiply.",
              "这是给 A 的项加了一个固定的数。B 长得更快，要用乘法。",
            ],
            [i * a * b, `That multiplies by B's step ${b}, not by the factor ${k}.`, `这是乘了 B 每次加的 ${b}，不是倍数 ${k}。`],
            [(i + 1) * b, "That takes one step too many.", "这是多加了一次。"],
          ],
          { figure: stepTapes(a, k) },
        );
      },
      stepTapes(2, 5),
    ),
  ],
  t(
    "Ben saves 2 dollars a week and Ana saves 6 dollars a week. After 1, 2 and 3 weeks Ben has 2, 4 and 6 dollars, and Ana has 6, 12 and 18. Ana always has 3 times as much as Ben.\n\nCheck: $6 \\div 2 = 3$, $12 \\div 4 = 3$ and $18 \\div 6 = 3$.\n\nIn this lesson we compare two patterns term by term.",
    "本每周存 2 元，安娜每周存 6 元。1 周、2 周、3 周后，本有 2、4、6 元，安娜有 6、12、18 元。安娜的钱总是本的 3 倍。\n\n检验：$6 \\div 2 = 3$，$12 \\div 4 = 3$，$18 \\div 6 = 3$。\n\n本课我们逐项比较两个数的规律。",
  ),
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
    point(
      "forming-ordered-pairs-from-patterns",
      ["Forming ordered pairs", "组成有序数对"],
      [
        "A: 0, 2, 4, 6 and B: 0, 3, 6, 9. The fourth terms are 6 and 9, so the fourth pair is $(6, 9)$. Write A's term first.\n\nCheck: the fourth term has 3 steps after 0. $3 \\times 2 = 6$ and $3 \\times 3 = 9$.\n\n> **Watch out.** The first term is 0, so the fourth term has only 3 steps, not 4.",
        "A：0、2、4、6，B：0、3、6、9。第四项分别是 6 和 9，所以第四个数对是 $(6, 9)$。A 的项写在前面。\n\n检验：第四项是在 0 后面加了 3 次。$3 \\times 2 = 6$，$3 \\times 3 = 9$。\n\n> **注意。** 第一项是 0，所以第四项只加了 3 次，不是 4 次。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        let b = rng.int(1, 9);
        if (b === a) b = a + 1;
        const n = rng.int(4, 8);
        const r = rules(a, b);
        const ord = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"][n]!;
        const [x, y] = [(n - 1) * a, (n - 1) * b];
        return pointed(
          [
            `${r.en} The first terms of both are $0$. Matching terms form ordered pairs (A, B). What is the ${ord} ordered pair?`,
            `${r["zh-CN"]}两个规律的第一项都是 $0$。对应项组成有序数对（A, B）。第 ${n} 个有序数对是什么？`,
          ],
          [x, y],
          [
            [
              ["Count the steps", "数加了几次"],
              [`The first term is 0, so the ${ord} term comes after ${n - 1} steps.`, `第一项是 0，所以第 ${n} 项是加了 ${n - 1} 次。`],
            ],
            [
              ["Find both terms", "求两项"],
              ["Multiply each step by the number of steps.", "用每次加的数乘次数。"],
              [`${n - 1} \\times ${a} = ${x}`, `${n - 1} \\times ${b} = ${y}`],
            ],
            [["Write the pair", "写出数对"], ["A's term comes first.", "A 的项写在前面。"], [pointLatex([x, y])]],
          ],
          [
            `List the terms. A: ${terms(a, n).join(", ")}. B: ${terms(b, n).join(", ")}. The last ones are ${x} and ${y}.`,
            `列出各项。A：${terms(a, n).join("、")}。B：${terms(b, n).join("、")}。最后一项分别是 ${x} 和 ${y}。`,
          ],
          [
            [
              [n * a, n * b],
              `That takes ${n} steps, but the first term is 0, so there are only ${n - 1}.`,
              `这是加了 ${n} 次。第一项是 0，所以只加了 ${n - 1} 次。`,
            ],
            [[y, x], "That puts B's term first. A's term comes first.", "这是把 B 的项写在前面了。A 的项要在前面。"],
            [
              [x, x + b],
              "That adds B's step to A's term instead of finding B's own term.",
              "这是在 A 的项上加了 B 每次加的数，不是 B 自己的项。",
            ],
          ],
        );
      },
      pointsGrid([
        [0, 0],
        [2, 3],
        [4, 6],
        [6, 9],
      ]),
    ),
    point(
      "describing-the-relationship",
      ["Describing the relationship", "描述两个规律的关系"],
      [
        "A adds 5 and B adds 15. Since $15 = 3 \\times 5$, each term of B is 3 times the matching term of A.\n\nCheck: after two steps A is 10 and B is 30, and $3 \\times 10 = 30$.\n\n> **Watch out.** B is not always 10 more than A. After two steps it is 20 more.",
        "A 每次加 5，B 每次加 15。因为 $15 = 3 \\times 5$，所以 B 的每一项都是 A 中对应项的 3 倍。\n\n检验：加两次后 A 是 10，B 是 30，$3 \\times 10 = 30$。\n\n> **注意。** B 不是总比 A 多 10。加两次后就多 20 了。",
      ],
      (rng) => {
        const { a, b, k } = patternPair(rng);
        const r = rules(a, b);
        return picked(
          rng,
          [`${r.en} Which statement is true?`, `${r["zh-CN"]}哪个说法是正确的？`],
          [`Each term of B is ${k} times the matching term of A.`, `B 的每一项是 A 中对应项的 ${k} 倍。`],
          [
            [
              [`Each term of B is ${b - a} more than the matching term of A.`, `B 的每一项比 A 中对应项多 ${b - a}。`],
              `The difference is not fixed. It is ${b - a} after one step and ${2 * (b - a)} after two.`,
              `差不是固定的。加一次后差 ${b - a}，加两次后差 ${2 * (b - a)}。`,
            ],
            [
              [`Each term of A is ${k} times the matching term of B.`, `A 的每一项是 B 中对应项的 ${k} 倍。`],
              "That turns it around. A's terms are the smaller ones.",
              "这是说反了。A 的项比较小。",
            ],
            [
              [`Each term of B is ${b} times the matching term of A.`, `B 的每一项是 A 中对应项的 ${b} 倍。`],
              `${b} is B's step, not the factor between the terms.`,
              `${b} 是 B 每次加的数，不是两项之间的倍数。`,
            ],
          ],
          [
            [
              ["Compare the steps", "比较每次加的数"],
              [`B adds ${b} and A adds ${a}.`, `B 每次加 ${b}，A 每次加 ${a}。`],
              [`${b} \\div ${a} = ${k}`],
            ],
            [
              ["State the rule", "说出关系"],
              [`After the same number of steps, B has ${k} times as much as A.`, `加同样多次后，B 是 A 的 ${k} 倍。`],
            ],
          ],
          [
            `After two steps A is ${2 * a} and B is ${2 * b}, and $${k} \\times ${2 * a} = ${2 * b}$.`,
            `加两次后 A 是 ${2 * a}，B 是 ${2 * b}，$${k} \\times ${2 * a} = ${2 * b}$。`,
          ],
          stepTapes(a, k),
        );
      },
      stepTapes(5, 3),
    ),
  ],
  t(
    "Two rows of tiles grow. Row A: 0, 2, 4, 6. Row B: 0, 6, 12, 18. Put matching terms together as pairs: $(0, 0)$, $(2, 6)$, $(4, 12)$, $(6, 18)$. In each pair the second number is 3 times the first.\n\nCheck: $3 \\times 2 = 6$, $3 \\times 4 = 12$ and $3 \\times 6 = 18$.\n\nIn this lesson we make ordered pairs from two patterns and describe how they are related.",
    "两排瓷砖在增加。A 排：0、2、4、6。B 排：0、6、12、18。把对应的项组成数对：$(0, 0)$、$(2, 6)$、$(4, 12)$、$(6, 18)$。每个数对中，第二个数都是第一个数的 3 倍。\n\n检验：$3 \\times 2 = 6$，$3 \\times 4 = 12$，$3 \\times 6 = 18$。\n\n本课我们用两个数的规律组成有序数对，并说出它们的关系。",
  ),
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
    point(
      "continuing-a-graphed-pattern",
      ["The next point", "下一个点"],
      [
        "The points $(1, 0)$, $(3, 3)$ and $(5, 6)$ each go 2 right and 3 up. So the next point is $(5 + 2, 6 + 3) = (7, 9)$.\n\nCheck: from $(1, 0)$ take 3 such moves: $(1 + 6, 0 + 9) = (7, 9)$.\n\n> **Watch out.** Use the across change for $x$ and the up change for $y$. Do not swap them.",
        "点 $(1, 0)$、$(3, 3)$、$(5, 6)$ 每次向右 2、向上 3。所以下一个点是 $(5 + 2, 6 + 3) = (7, 9)$。\n\n检验：从 $(1, 0)$ 出发走 3 次这样的移动：$(1 + 6, 0 + 9) = (7, 9)$。\n\n> **注意。** 横着的变化加到 $x$ 上，向上的变化加到 $y$ 上，不要弄反。",
      ],
      (rng) => {
        let a = 1;
        let b = 1;
        let shown = 3;
        do {
          [a, b] = [rng.int(1, 3), rng.int(1, 3)];
          shown = rng.int(3, 4);
        } while ((a === b && rng.bool(0.6)) || shown * Math.max(a, b) > 10);
        const sx = rng.int(0, 10 - shown * a);
        const sy = rng.int(0, 10 - shown * b);
        const pts: [number, number][] = Array.from({ length: shown }, (_, i) => [sx + i * a, sy + i * b]);
        const last = pts[shown - 1]!;
        const next: [number, number] = [last[0] + a, last[1] + b];
        return pointed(
          [
            "The graph shows ordered pairs formed from the matching terms of two patterns. If the patterns continue, what is the next ordered pair?",
            "图中是由两个数列的对应项组成的有序数对。如果数列继续下去，下一个有序数对是什么？",
          ],
          next,
          [
            [
              ["Find the move", "找出每次的移动"],
              [`Each point is ${a} right and ${b} up from the one before.`, `每个点都在前一个点向右 ${a}、向上 ${b} 的地方。`],
            ],
            [
              ["Move from the last point", "从最后一个点移动"],
              ["Add the same changes.", "加上同样的变化。"],
              [`(${last[0]} + ${a}, ${last[1]} + ${b}) = ${pointLatex(next)}`],
            ],
          ],
          [
            `From the first point $${pointLatex(pts[0]!)}$, ${shown} moves give $(${sx} + ${shown * a}, ${sy} + ${shown * b}) = ${pointLatex(next)}$.`,
            `从第一个点 $${pointLatex(pts[0]!)}$ 出发，移动 ${shown} 次得到 $(${sx} + ${shown * a}, ${sy} + ${shown * b}) = ${pointLatex(next)}$。`,
          ],
          [
            [[next[1], next[0]], "That swaps the coordinates. Write $x$ first.", "这是把两个坐标交换了。要先写 $x$。"],
            [[next[0] + a, next[1] + b], "That makes two moves and skips a point.", "这是移动了两次，跳过了一个点。"],
            [
              [last[0] + b, last[1] + a],
              "That adds the up change to $x$ and the across change to $y$.",
              "这是把向上的变化加到了 $x$ 上，把横着的变化加到了 $y$ 上。",
            ],
          ],
          pointsGrid(pts),
        );
      },
      pointsGrid([
        [1, 0],
        [3, 3],
        [5, 6],
      ]),
    ),
    point(
      "extending-a-graphed-pattern",
      ["Extending beyond the graph", "延续到图像之外"],
      [
        "The points $(0, 0)$, $(1, 4)$ and $(2, 8)$ go 1 right and 4 up each time. Every $y$ is 4 times its $x$, so at $x = 12$ the point is $(12, 48)$.\n\nCheck: 12 moves of 4 up is $12 \\times 4 = 48$.\n\n> **Watch out.** Do not just add 4 to 12. The rule multiplies by 4.",
        "点 $(0, 0)$、$(1, 4)$、$(2, 8)$ 每次向右 1、向上 4。每个 $y$ 都是 $x$ 的 4 倍，所以当 $x = 12$ 时，点是 $(12, 48)$。\n\n检验：12 次向上 4，就是 $12 \\times 4 = 48$。\n\n> **注意。** 不能只是 12 加 4。规则是乘 4。",
      ],
      (rng) => {
        const a = rng.int(1, 2);
        const k = rng.int(2, a === 1 ? 4 : 2);
        const b = a * k;
        const shown = Math.floor(10 / b) + 1;
        const pts: [number, number][] = Array.from({ length: Math.min(shown, 4) }, (_, i) => [i * a, i * b]);
        const x = a * rng.int(6, 15);
        return answered(
          [
            `The graph shows ordered pairs formed from two patterns that both start at $0$. If the patterns continue, what is the $y$-coordinate of the point with $x$-coordinate $${x}$?`,
            `图中是由两个都从 $0$ 开始的数列组成的有序数对。如果数列继续下去，$x$ 坐标是 $${x}$ 的点的 $y$ 坐标是多少？`,
          ],
          x * k,
          [
            [
              ["Find the rule", "找出规则"],
              [
                `The point $${pointLatex([a, b])}$ shows that $y$ is ${k} times $x$.`,
                `点 $${pointLatex([a, b])}$ 说明 $y$ 是 $x$ 的 ${k} 倍。`,
              ],
              [`${b} \\div ${a} = ${k}`],
            ],
            [["Use the rule", "用规则计算"], [`Multiply ${x} by ${k}.`, `用 ${x} 乘 ${k}。`], [`${k} \\times ${x} = ${x * k}`]],
          ],
          [
            `Count the moves: reaching $x = ${x}$ takes $${x} \\div ${a} = ${x / a}$ moves of ${b} up, and $${x / a} \\times ${b} = ${x * k}$.`,
            `数移动次数：到 $x = ${x}$ 要移动 $${x} \\div ${a} = ${x / a}$ 次，每次向上 ${b}，$${x / a} \\times ${b} = ${x * k}$。`,
          ],
          [
            [x + b, `That adds ${b} once. The rule multiplies.`, `这是只加了一次 ${b}。规则是乘。`],
            [
              x * b,
              `That multiplies by the up move ${b}, but ${x} is not the number of moves.`,
              `这是乘了向上的 ${b}，可是 ${x} 不是移动次数。`,
            ],
            [(x / a + 1) * b, "That takes one move too many.", "这是多移动了一次。"],
          ],
          { figure: pointsGrid(pts) },
        );
      },
      pointsGrid([
        [0, 0],
        [1, 4],
        [2, 8],
      ]),
    ),
  ],
  t(
    "A plant grows 2 cm a day. Day 0, 1, 2, 3 gives heights 0, 2, 4, 6. Graph the pairs $(0, 0)$, $(1, 2)$, $(2, 4)$, $(3, 6)$. Each point is 1 right and 2 up from the one before.\n\nCheck: every height is 2 times its day. $2 \\times 3 = 6$.\n\nIn this lesson we graph the pairs from two patterns and use the graph to go on.",
    "一棵植物每天长高 2 厘米。第 0、1、2、3 天的高度是 0、2、4、6。把数对 $(0, 0)$、$(1, 2)$、$(2, 4)$、$(3, 6)$ 画在图上。每个点都在前一个点向右 1、向上 2 的地方。\n\n检验：每天的高度都是天数的 2 倍。$2 \\times 3 = 6$。\n\n本课我们把两个数的规律组成的数对画成图，再用图往下推。",
  ),
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

/** cubesFigure draws a box made of unit cubes. */
const cubesFigure = (l: number, w: number, h: number): Figure => ({
  svg: prismSvg(l, w, h),
  alt: t(`A box made of unit cubes, ${l} long, ${w} deep and ${h} tall.`, `由单位立方体组成的长方体，长 ${l}、宽 ${w}、高 ${h}。`),
});

/** kindReasons says what each kind of unit measures, as reasons for a wrong choice. */
const kindReasons: readonly Pair[] = [
  ["That unit measures length, along one direction only.", "这个单位量的是长度，只有一个方向。"],
  ["That unit measures area, a flat surface.", "这个单位量的是面积，是一个平面。"],
  ["That unit measures volume, the space inside a solid.", "这个单位量的是体积，是物体所占的空间。"],
];

/** kindWays says how many directions each kind of measurement goes. */
const kindWays: readonly Pair[] = [
  ["A length goes in one direction, so its unit has no small number.", "长度只有一个方向，所以单位上没有小数字。"],
  ["An area covers a flat surface in two directions, so its unit is squared.", "面积在平面上有两个方向，所以单位是平方。"],
  ["A volume fills space in three directions, so its unit is cubed.", "体积占据三个方向的空间，所以单位是立方。"],
];

export const understandingVolumeUsingUnitCubes = topic(
  "understanding-volume-using-unit-cubes",
  t("Understanding Volume Using Unit Cubes", "用单位立方体认识体积"),
  t(
    "Volume is the amount of space a solid takes up. A unit cube, with edges 1 unit long, has a volume of 1 cubic unit. The volume of a box is the number of unit cubes that fill it with no gaps or overlaps. A box 4 cubes long, 3 cubes wide and 2 cubes tall has 2 layers of 4 × 3 = 12 cubes, so its volume is 24 cubic units.",
    "体积是物体所占空间的大小。棱长为 1 个单位的单位立方体，体积是 1 立方单位。长方体的体积就是把它填满（没有空隙、没有重叠）所需的单位立方体的个数。一个长 4 个、宽 3 个、高 2 个立方体的长方体有 2 层，每层 4 × 3 = 12 个，所以体积是 24 立方单位。",
  ),
  ["area-of-a-rectangle-by-multiplying", "two-digit-by-one-digit-multiplication"],
  ["5.MD.C.3", "5.MD.C.4"],
  [
    point(
      "counting-unit-cubes",
      ["Counting cubes in a box", "数长方体中的小立方体"],
      [
        "A box is 4 cubes long, 2 cubes deep and 3 cubes tall. Each layer has $4 \\times 2 = 8$ cubes, and there are 3 layers. So it has $8 \\times 3 = 24$ cubes.\n\nCheck: the front face has $4 \\times 3 = 12$ cubes, and there are 2 such slices. $12 \\times 2 = 24$.\n\n> **Watch out.** Count the hidden cubes too, not just the ones you can see.",
        "一个长方体长 4 个、宽 2 个、高 3 个立方体。每层有 $4 \\times 2 = 8$ 个，共 3 层，所以有 $8 \\times 3 = 24$ 个。\n\n检验：正面有 $4 \\times 3 = 12$ 个，这样的一片有 2 片。$12 \\times 2 = 24$。\n\n> **注意。** 看不见的立方体也要算上，不能只数看得见的。",
      ],
      (rng) => {
        const [l, w, h] = [rng.int(2, 6), rng.int(2, 4), rng.int(2, 5)];
        const v = l * w * h;
        return answered(
          [
            "The box is filled with unit cubes. What is its volume, in cubic units?",
            "这个长方体由单位立方体填满。它的体积是多少立方单位？",
          ],
          v,
          [
            [
              ["Count one layer", "数一层"],
              [`The bottom layer is ${l} cubes by ${w} cubes.`, `底层是 ${l} 个乘 ${w} 个。`],
              [`${l} \\times ${w} = ${l * w}`],
            ],
            [["Count the layers", "数层数"], [`There are ${h} layers.`, `一共 ${h} 层。`], [`${l * w} \\times ${h} = ${v}`]],
          ],
          [
            `Count by front slices: the front face has $${l} \\times ${h} = ${l * h}$ cubes, and $${l * h} \\times ${w} = ${v}$.`,
            `按正面的片数：正面有 $${l} \\times ${h} = ${l * h}$ 个，$${l * h} \\times ${w} = ${v}$。`,
          ],
          [
            [
              l * h + w * h + l * w - l - w - h + 1,
              "That counts only the cubes you can see. Count the hidden ones too.",
              "这只数了看得见的立方体，看不见的也要算。",
            ],
            [l + w + h, "That adds the three edges. Volume multiplies them.", "这是把三条棱相加了。体积要相乘。"],
            [l * w, "That is only one layer.", "这只是一层。"],
          ],
          { figure: cubesFigure(l, w, h) },
        );
      },
      cubesFigure(4, 2, 3),
    ),
    point(
      "layers-of-unit-cubes",
      ["Layers of cubes", "一层一层地数"],
      [
        "A box holds 60 cubes in 5 equal layers. Each layer has $60 \\div 5 = 12$ cubes.\n\nCheck: 5 layers of 12 make $5 \\times 12 = 60$ cubes.\n\n> **Watch out.** A layer is length times width. Do not add the length and the width.",
        "一个长方体用 60 个立方体装满，分成同样的 5 层。每层有 $60 \\div 5 = 12$ 个。\n\n检验：5 层，每层 12 个，$5 \\times 12 = 60$ 个。\n\n> **注意。** 一层的个数是长乘宽，不是长加宽。",
      ],
      (rng) => {
        const [l, w, h] = [rng.int(2, 9), rng.int(2, 6), rng.int(2, 9)];
        const layer = l * w;
        if (rng.bool())
          return answered(
            [
              `A box is packed with unit cubes with no gaps. The bottom layer is $${l}$ cubes long and $${w}$ cubes wide, and there are $${h}$ layers. How many cubes are in the box?`,
              `一个长方体里整齐地装满了单位立方体。底层长 $${l}$ 个、宽 $${w}$ 个，共有 $${h}$ 层。长方体里一共有多少个立方体？`,
            ],
            layer * h,
            [
              [["Count one layer", "数一层"], ["A layer is length times width.", "一层的个数是长乘宽。"], [`${l} \\times ${w} = ${layer}`]],
              [
                ["Stack the layers", "叠起各层"],
                [`There are ${h} equal layers.`, `一共有 ${h} 层同样的。`],
                [`${layer} \\times ${h} = ${layer * h}`],
              ],
            ],
            [
              `Divide back: $${layer * h} \\div ${h} = ${layer}$ cubes in each layer.`,
              `除回去：$${layer * h} \\div ${h} = ${layer}$，正好是每层的个数。`,
            ],
            [
              [layer + h, "That adds the layers instead of multiplying by them.", "这是加了层数，应该乘层数。"],
              [l + w + h, "That adds the three edges. Multiply them.", "这是把三条棱相加了，应该相乘。"],
              [layer, "That is only one layer.", "这只是一层。"],
            ],
          );
        return answered(
          [
            `A box holds $${layer * h}$ unit cubes, packed in $${h}$ equal layers with no gaps. How many cubes are in each layer?`,
            `一个长方体用 $${layer * h}$ 个单位立方体整齐地装满，分成同样的 $${h}$ 层。每层有多少个立方体？`,
          ],
          layer,
          [
            [
              ["Share among the layers", "平均分到各层"],
              [`The cubes are split into ${h} equal layers.`, `立方体平均分成 ${h} 层。`],
              [`${layer * h} \\div ${h} = ${layer}`],
            ],
          ],
          [`Multiply back: $${layer} \\times ${h} = ${layer * h}$.`, `乘回去：$${layer} \\times ${h} = ${layer * h}$。`],
          [
            [layer * h - h, "That subtracts the layers instead of dividing by them.", "这是减去了层数，应该除以层数。"],
            [layer * h * h, "That multiplies by the layers. Divide to share the cubes.", "这是乘了层数。要平分立方体，应该用除法。"],
            [h, "That is the number of layers, not the cubes in each.", "这是层数，不是每层的个数。"],
          ],
        );
      },
      cubesFigure(4, 3, 5),
    ),
  ],
  t(
    "Mia fills a toy box with 1-inch cubes. The bottom layer is 3 cubes by 2 cubes, which is 6 cubes. There are 4 layers, so the box holds $6 \\times 4 = 24$ cubes. Its volume is 24 cubic inches.\n\nCheck: count by layers: 6, 12, 18, 24.\n\nIn this lesson we measure volume by counting unit cubes.",
    "米娅用棱长 1 英寸的小立方体装满一个玩具盒。底层是 3 个乘 2 个，共 6 个。一共 4 层，所以盒子装了 $6 \\times 4 = 24$ 个立方体。它的体积是 24 立方英寸。\n\n检验：一层一层地数：6、12、18、24。\n\n本课我们通过数单位立方体来量体积。",
  ),
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
const unitTex = (u: LengthUnit, kind: number) => `\\text{${u.abbr}}${kind === 0 ? "" : `^{${kind + 1}}`}`;

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
    point(
      "choosing-length-area-or-volume-units",
      ["Choosing the kind of unit", "选择合适的单位"],
      [
        "The floor of a room is a flat surface, so it is an area. Measure it in square units, such as $\\text{m}^2$.\n\nCheck: a floor has a length and a width, two directions, so the unit is squared.\n\n> **Watch out.** The water in a tank fills space. It needs cubic units such as $\\text{m}^3$, not $\\text{m}^2$.",
        "房间的地面是一个平面，所以是面积，用平方单位来量，例如 $\\text{m}^2$。\n\n检验：地面有长和宽两个方向，所以单位是平方。\n\n> **注意。** 水箱里的水占据空间，要用立方单位，例如 $\\text{m}^3$，不是 $\\text{m}^2$。",
      ],
      (rng) => {
        const c = rng.pick(measureContexts);
        const u = rng.pick(c.units);
        return pickedMath(
          rng,
          [`Based on ${u.name.en}, which unit fits ${c.what.en}?`, `以${u.name["zh-CN"]}为基础，${c.what["zh-CN"]}应该用哪个单位？`],
          unitTex(u, c.kind),
          [0, 1, 2].filter((k) => k !== c.kind).map((k) => [unitTex(u, k), kindReasons[k]![0], kindReasons[k]![1]] as const),
          [
            [
              ["Decide what is measured", "看量的是什么"],
              [`This is ${c.kind === 1 ? "an" : "a"} ${kindNames[c.kind]!.en}.`, `这是${kindNames[c.kind]!["zh-CN"]}。`],
            ],
            [["Pick the unit", "选单位"], [kindWays[c.kind]![0], kindWays[c.kind]![1]], [unitTex(u, c.kind)]],
          ],
          [
            `Count the directions: ${["one", "two", "three"][c.kind]}, and the unit $${unitTex(u, c.kind)}$ shows ${["no small number", "a 2", "a 3"][c.kind]}.`,
            `数一数方向：${["一", "两", "三"][c.kind]}个，单位 $${unitTex(u, c.kind)}$ ${["上没有小数字", "上的小数字是 2", "上的小数字是 3"][c.kind]}。`,
          ],
        );
      },
      areaGridFigure(
        ["1 m", "1 m"],
        ["1 m", "1 m", "1 m"],
        [
          ["", "", ""],
          ["", "", ""],
        ],
      ),
    ),
    point(
      "telling-what-a-measurement-measures",
      ["Length, area or volume", "长度、面积还是体积"],
      [
        "The unit tells what is measured. $36 \\text{ ft}^3$ is a volume, $36 \\text{ ft}^2$ is an area and $36 \\text{ ft}$ is a length.\n\nCheck: the small number counts the directions. 3 means space, 2 means a surface, and none means a line.\n\n> **Watch out.** The number 36 does not tell you. Look at the unit.",
        "看单位就知道量的是什么。$36 \\text{ ft}^3$ 是体积，$36 \\text{ ft}^2$ 是面积，$36 \\text{ ft}$ 是长度。\n\n检验：小数字表示方向的个数。3 表示空间，2 表示平面，没有小数字表示一条线。\n\n> **注意。** 36 这个数看不出来，要看单位。",
      ],
      (rng) => {
        const u = rng.pick(lengthUnits);
        const kind = rng.int(0, 2);
        const n = rng.int(2, 500);
        const name = (k: number): Pair => [kindNames[k]!.en, kindNames[k]!["zh-CN"]];
        return picked(
          rng,
          [`What does the measurement $${n} \\ ${unitTex(u, kind)}$ describe?`, `测量结果 $${n} \\ ${unitTex(u, kind)}$ 表示什么？`],
          name(kind),
          [0, 1, 2]
            .filter((k) => k !== kind)
            .map(
              (k) =>
                [
                  name(k),
                  `${k === 1 ? "An" : "A"} ${kindNames[k]!.en} would use $${unitTex(u, k)}$.`,
                  `${kindNames[k]!["zh-CN"]}要用 $${unitTex(u, k)}$。`,
                ] as const,
            ),
          [
            [
              ["Read the unit", "看单位"],
              [`The unit is $${unitTex(u, kind)}$.`, `单位是 $${unitTex(u, kind)}$。`],
            ],
            [
              ["Name the measurement", "说出量的是什么"],
              [kindWays[kind]![0], kindWays[kind]![1]],
            ],
          ],
          [
            `${kind === 1 ? "An" : "A"} ${kindNames[kind]!.en} goes in ${["one direction", "two directions", "three directions"][kind]}, which matches $${unitTex(u, kind)}$.`,
            `${kindNames[kind]!["zh-CN"]}有${["一", "两", "三"][kind]}个方向，和 $${unitTex(u, kind)}$ 相符。`,
          ],
        );
      },
      cubesFigure(2, 2, 2),
    ),
  ],
  t(
    "A gift box has an edge 20 cm long. Its lid covers 400 cm². The space inside is 6,000 cm³. The small number on each unit tells how many directions are measured.\n\nCheck: cm goes one way, cm² covers two ways and cm³ fills three ways.\n\nIn this lesson we choose units for length, area and volume.",
    "一个礼盒的一条棱长 20 cm，盒盖的面积是 400 cm²，盒子里的空间是 6,000 cm³。单位上的小数字表示量了几个方向。\n\n检验：cm 是一个方向，cm² 是两个方向，cm³ 是三个方向。\n\n本课我们为长度、面积和体积选择合适的单位。",
  ),
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
    point(
      "volume-from-edge-lengths",
      ["Length × width × height", "长 × 宽 × 高"],
      [
        "A box is 6 in by 2 in by 5 in. Its volume is $6 \\times 2 \\times 5 = 60 \\text{ in}^3$.\n\nCheck: the base holds $6 \\times 2 = 12$ cubes, and 5 layers make $12 \\times 5 = 60$.\n\n> **Watch out.** Adding the edges gives 13, which is not a volume. Multiply them.",
        "一个长方体长 6 in、宽 2 in、高 5 in。体积是 $6 \\times 2 \\times 5 = 60 \\text{ in}^3$。\n\n检验：底层有 $6 \\times 2 = 12$ 个立方体，5 层是 $12 \\times 5 = 60$。\n\n> **注意。** 三条棱相加得 13，那不是体积。要相乘。",
      ],
      (rng) => {
        const u = rng.pick(lengthUnits);
        const [l, w, h] = [rng.int(2, 12), rng.int(2, 8), rng.int(2, 10)];
        const v = l * w * h;
        return answered(
          [`What is the volume of the box, in $${unitTex(u, 2)}$?`, `这个长方体的体积是多少 $${unitTex(u, 2)}$？`],
          v,
          [
            [["Find the base", "求底面"], ["Length times width is one layer.", "长乘宽是一层。"], [`${l} \\times ${w} = ${l * w}`]],
            [["Multiply by the height", "乘高"], ["The height counts the layers.", "高是层数。"], [`${l * w} \\times ${h} = ${v}`]],
          ],
          [
            `Multiply in another order: $${w} \\times ${h} = ${w * h}$ and $${w * h} \\times ${l} = ${v}$.`,
            `换个顺序乘：$${w} \\times ${h} = ${w * h}$，$${w * h} \\times ${l} = ${v}$。`,
          ],
          [
            [l + w + h, "That adds the edges. Volume multiplies them.", "这是把棱长相加了。体积要相乘。"],
            [l * w, "That is only the base, one layer.", "这只是底面，也就是一层。"],
            [
              2 * (l * w + l * h + w * h),
              "That is the area of all six faces, not the space inside.",
              "这是六个面的面积和，不是里面的空间。",
            ],
          ],
          { figure: prismFigure(l, w, h, u) },
        );
      },
      prismFigure(6, 2, 5, lengthUnits[2]!),
    ),
    point(
      "volume-from-base-area-and-missing-edges",
      ["Base area and missing edges", "底面积与未知棱长"],
      [
        "A box is 6 cm long and 4 cm wide, and its volume is $120 \\text{ cm}^3$. The base is $6 \\times 4 = 24 \\text{ cm}^2$, so the height is $120 \\div 24 = 5$ cm.\n\nCheck: $24 \\times 5 = 120$.\n\n> **Watch out.** Divide by the base area 24, not by 6 or by 4 alone.",
        "一个长方体长 6 厘米、宽 4 厘米，体积是 $120 \\text{ cm}^3$。底面积是 $6 \\times 4 = 24 \\text{ cm}^2$，所以高是 $120 \\div 24 = 5$ 厘米。\n\n检验：$24 \\times 5 = 120$。\n\n> **注意。** 要除以底面积 24，不是只除以 6 或 4。",
      ],
      (rng) => {
        const u = rng.pick(lengthUnits);
        const [l, w, h] = [rng.int(2, 12), rng.int(2, 9), rng.int(2, 12)];
        const v = l * w * h;
        if (rng.bool()) {
          const B = l * w;
          return answered(
            [
              `A box has a base with area $${B} \\ ${unitTex(u, 1)}$ and a height of $${h} \\ ${unitTex(u, 0)}$. What is its volume, in $${unitTex(u, 2)}$?`,
              `一个长方体的底面积是 $${B} \\ ${unitTex(u, 1)}$，高是 $${h} \\ ${unitTex(u, 0)}$。它的体积是多少 $${unitTex(u, 2)}$？`,
            ],
            v,
            [
              [
                ["Multiply base by height", "底面积乘高"],
                ["The base area is the cubes in one layer, and the height counts the layers.", "底面积是一层的立方体个数，高是层数。"],
                [`${B} \\times ${h} = ${v}`],
              ],
            ],
            [`Divide back: $${v} \\div ${h} = ${B}$, the base area.`, `除回去：$${v} \\div ${h} = ${B}$，正好是底面积。`],
            [
              [B + h, "That adds the height. Multiply by it.", "这是加了高，应该乘高。"],
              [B * h * h, "That multiplies by the height twice.", "这是乘了两次高。"],
              [B, "That is only the base, one layer.", "这只是底面，也就是一层。"],
            ],
          );
        }
        return answered(
          [
            `A box has a volume of $${v} \\ ${unitTex(u, 2)}$. It is $${l} \\ ${unitTex(u, 0)}$ long and $${w} \\ ${unitTex(u, 0)}$ wide. How tall is it, in ${u.name.en}?`,
            `一个长方体的体积是 $${v} \\ ${unitTex(u, 2)}$，长 $${l} \\ ${unitTex(u, 0)}$，宽 $${w} \\ ${unitTex(u, 0)}$。它高多少${u.name["zh-CN"]}？`,
          ],
          h,
          [
            [["Find the base area", "求底面积"], ["Multiply length and width.", "长乘宽。"], [`${l} \\times ${w} = ${l * w}`]],
            [
              ["Divide", "做除法"],
              ["The volume is the base area times the height.", "体积等于底面积乘高。"],
              [`${v} \\div ${l * w} = ${h}`],
            ],
          ],
          [`Multiply back: $${l} \\times ${w} \\times ${h} = ${v}$.`, `乘回去：$${l} \\times ${w} \\times ${h} = ${v}$。`],
          [
            [v - l - w, "That subtracts the edges. Divide by the base area.", "这是减去了棱长。应该除以底面积。"],
            [Math.floor(v / l), "That divides by the length only. Divide by length times width.", "这是只除以了长。要除以长乘宽。"],
            [v - l * w, "That subtracts the base area instead of dividing by it.", "这是减去了底面积，应该除以底面积。"],
          ],
        );
      },
      prismFigure(6, 4, 5, lengthUnits[0]!),
    ),
  ],
  t(
    "A toy chest is 4 ft long, 2 ft wide and 3 ft tall. The bottom layer holds $4 \\times 2 = 8$ cubic feet, and there are 3 layers. So the volume is $8 \\times 3 = 24$ cubic feet.\n\nCheck: multiply in another order. $2 \\times 3 = 6$ and $6 \\times 4 = 24$.\n\nIn this lesson we find the volume of a box by multiplying its edges.",
    "一个玩具箱长 4 英尺、宽 2 英尺、高 3 英尺。底层是 $4 \\times 2 = 8$ 立方英尺，一共 3 层。所以体积是 $8 \\times 3 = 24$ 立方英尺。\n\n检验：换个顺序乘。$2 \\times 3 = 6$，$6 \\times 4 = 24$。\n\n本课我们用棱长相乘求长方体的体积。",
  ),
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
    point(
      "volumes-of-containers",
      ["Volumes of containers", "容器的体积"],
      [
        "A sandbox is 6 ft long, 4 ft wide and 2 ft deep. It holds $6 \\times 4 \\times 2 = 48 \\text{ ft}^3$ of sand.\n\nCheck: multiply in another order. $4 \\times 2 = 8$ and $8 \\times 6 = 48$.\n\n> **Watch out.** The depth is the height. Multiply by it too.",
        "一个沙坑长 6 英尺、宽 4 英尺、深 2 英尺。它能装 $6 \\times 4 \\times 2 = 48 \\text{ ft}^3$ 沙子。\n\n检验：换个顺序乘。$4 \\times 2 = 8$，$8 \\times 6 = 48$。\n\n> **注意。** 深就是高，也要乘上。",
      ],
      (rng) => {
        const c = rng.pick(containers);
        const u = rng.pick(c.units);
        const [l, w, h] = [rng.int(3, 20), rng.int(2, 12), rng.int(2, 10)];
        const v = l * w * h;
        return answered(
          [
            `${c.what.en} is shaped like a box $${l} \\ ${unitTex(u, 0)}$ long, $${w} \\ ${unitTex(u, 0)}$ wide and $${h} \\ ${unitTex(u, 0)}$ deep. What volume of ${c.holds.en} does it hold when full, in $${unitTex(u, 2)}$?`,
            `${c.what["zh-CN"]}是长 $${l} \\ ${unitTex(u, 0)}$、宽 $${w} \\ ${unitTex(u, 0)}$、深 $${h} \\ ${unitTex(u, 0)}$ 的长方体。装满时能装多少 $${unitTex(u, 2)}$ ${c.holds["zh-CN"]}？`,
          ],
          v,
          [
            [["Find the bottom", "求底面"], ["Length times width.", "长乘宽。"], [`${l} \\times ${w} = ${l * w}`]],
            [["Multiply by the depth", "乘深"], ["The depth is the height.", "深就是高。"], [`${l * w} \\times ${h} = ${v}`]],
          ],
          [
            `Multiply in another order: $${w} \\times ${h} = ${w * h}$ and $${w * h} \\times ${l} = ${v}$.`,
            `换个顺序乘：$${w} \\times ${h} = ${w * h}$，$${w * h} \\times ${l} = ${v}$。`,
          ],
          [
            [l * w, "That is only the bottom. Multiply by the depth too.", "这只是底面，还要乘深。"],
            [l + w + h, "That adds the edges. Multiply them.", "这是把棱长相加了，应该相乘。"],
            [2 * (l * w + l * h + w * h), "That is the area of all the faces, not what it holds.", "这是所有面的面积和，不是能装多少。"],
          ],
        );
      },
      prismFigure(6, 4, 2, lengthUnits[3]!),
    ),
    point(
      "volumes-of-combined-boxes",
      ["Two boxes together", "两个长方体组合"],
      [
        "A step is made of a $5 \\times 3 \\times 2$ box and a $2 \\times 3 \\times 4$ box. The volumes are 30 and 24, so the step is $30 + 24 = 54$ cubic units.\n\nCheck: $54 - 30 = 24$, the second box.\n\n> **Watch out.** Add the two volumes. Do not multiply them.",
        "一个台阶由 $5 \\times 3 \\times 2$ 和 $2 \\times 3 \\times 4$ 两个长方体组成。体积分别是 30 和 24，所以台阶是 $30 + 24 = 54$ 立方单位。\n\n检验：$54 - 30 = 24$，正好是第二个长方体。\n\n> **注意。** 两个体积要相加，不是相乘。",
      ],
      (rng) => {
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
        return answered(
          [
            `${what.en} that do not overlap: one is $${dims(a)}$ and the other is $${dims(b)}$. What is the total volume, in $${unitTex(u, 2)}$?`,
            `${what["zh-CN"]}，两部分不重叠：一个是 $${dims(a)}$，另一个是 $${dims(b)}$。总体积是多少 $${unitTex(u, 2)}$？`,
          ],
          va + vb,
          [
            [
              ["Find each volume", "分别求体积"],
              ["Multiply the edges of each box.", "每个长方体的棱长相乘。"],
              [`${a.join(" \\times ")} = ${va}`, `${b.join(" \\times ")} = ${vb}`],
            ],
            [["Add", "相加"], ["The boxes do not overlap, so add.", "两部分不重叠，所以相加。"], [`${va} + ${vb} = ${va + vb}`]],
          ],
          [
            `Take one part away: $${va + vb} - ${va} = ${vb}$, the other box.`,
            `减去一部分：$${va + vb} - ${va} = ${vb}$，正好是另一个长方体。`,
          ],
          [
            [va * vb, "That multiplies the two volumes. Add them.", "这是把两个体积相乘了，应该相加。"],
            [
              (a[0] + b[0]) * (a[1] + b[1]) * (a[2] + b[2]),
              "That adds the edges first, as if it were one big box.",
              "这是先把棱长相加，好像是一个大长方体。",
            ],
            [Math.abs(va - vb), "That subtracts the volumes. Add them.", "这是把体积相减了，应该相加。"],
          ],
          {
            figure: tapeFigure(
              [
                {
                  total: String(va + vb),
                  pieces: [
                    { size: va, text: String(va) },
                    { size: vb, text: String(vb), lit: true },
                  ],
                },
              ],
              [`A bar for ${va + vb} made of ${va} and ${vb}.`, `表示 ${va + vb} 的长条，由 ${va} 和 ${vb} 组成。`],
            ),
          },
        );
      },
      tapeFigure(
        [
          {
            total: "54",
            pieces: [
              { size: 30, text: "30" },
              { size: 24, text: "24", lit: true },
            ],
          },
        ],
        ["A bar for 54 made of 30 and 24.", "表示 54 的长条，由 30 和 24 组成。"],
      ),
    ),
  ],
  t(
    "A fish tank is 10 in long, 6 in wide and 5 in deep. It holds $10 \\times 6 \\times 5 = 300$ cubic inches of water.\n\nCheck: the bottom is $10 \\times 6 = 60$ square inches, and 5 layers of 60 make 300.\n\nIn this lesson we solve problems about the volume of boxes and of shapes made of two boxes.",
    "一个鱼缸长 10 英寸、宽 6 英寸、深 5 英寸。它能装 $10 \\times 6 \\times 5 = 300$ 立方英寸的水。\n\n检验：底面是 $10 \\times 6 = 60$ 平方英寸，5 层 60 就是 300。\n\n本课我们解决长方体和由两个长方体组成的物体的体积问题。",
  ),
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

/** art picks "a" or "an" for the word that follows. */
const art = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

/** upper capitalizes the first letter of a sentence. */
const upper = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** Art picks "A" or "An" to start a sentence with the word that follows. */
const Art = (word: string) => upper(art(word));

/** namePair gives the capitalized name of the polygon with n sides, as an option. */
const namePair = (n: number): Pair => [capital(polygonNames[n]!).en, polygonNames[n]!["zh-CN"]];

/** regular gives the vertices of a regular polygon with n sides, counterclockwise from the top. */
const regular = (n: number, r = 5): Point[] =>
  Array.from({ length: n }, (_, i) => {
    const a = Math.PI / 2 + (2 * Math.PI * i) / n;
    return [r * Math.cos(a), r * Math.sin(a)] as Point;
  });

/** diagonalsFigure draws a regular polygon with every diagonal from its top vertex dashed. */
const diagonalsFigure = (n: number): Figure => {
  const pts = regular(n);
  const marks: Mark[] = [
    { kind: "polygon", points: pts, accent: true },
    { kind: "dot", at: pts[0]! },
  ];
  for (let i = 2; i < n - 1; i++) marks.push({ kind: "segment", a: pts[0]!, b: pts[i]!, dashed: true });
  return fig(marks, `A polygon with ${n} sides and its diagonals from one vertex.`, `一个 ${n} 边形和从一个顶点出发的对角线。`);
};

/** QuadName is a kind of quadrilateral or the word quadrilateral itself. */
type QuadName = QuadKind | "quadrilateral";

/** quadNeeds says what each kind of quadrilateral must have. */
const quadNeeds: Record<QuadName, Pair> = {
  square: ["four equal sides and four right angles", "四条边相等且四个角都是直角"],
  rectangle: ["four right angles", "四个直角"],
  rhombus: ["four equal sides", "四条边相等"],
  parallelogram: ["two pairs of parallel sides", "两组对边分别平行"],
  trapezoid: ["at least one pair of parallel sides", "至少一组对边平行"],
  quadrilateral: ["four straight sides", "四条直的边"],
};

/** quadExample names one plain example of each kind, with nothing extra. */
const quadExample: Record<QuadName, Pair> = {
  square: ["a square with 5 cm sides", "边长 5 厘米的正方形"],
  rectangle: ["a rectangle 6 cm long and 3 cm wide", "长 6 厘米、宽 3 厘米的长方形"],
  rhombus: ["a rhombus with 5 cm sides and angles of 60 and 120 degrees", "边长 5 厘米、角是 60 度和 120 度的菱形"],
  parallelogram: [
    "a parallelogram with sides of 6 cm and 3 cm and angles of 60 and 120 degrees",
    "边长 6 厘米和 3 厘米、角是 60 度和 120 度的平行四边形",
  ],
  trapezoid: ["a trapezoid with only one pair of parallel sides", "只有一组对边平行的梯形"],
  quadrilateral: ["a quadrilateral with no parallel sides", "没有平行边的四边形"],
};

/** quadDefinition says what each kind of quadrilateral is. */
const quadDefinition: Record<QuadKind, Pair> = {
  square: ["A square has four equal sides and four right angles.", "正方形四条边相等，四个角都是直角。"],
  rectangle: ["A rectangle is a parallelogram with four right angles.", "长方形是有四个直角的平行四边形。"],
  rhombus: ["A rhombus is a parallelogram with four equal sides.", "菱形是四条边都相等的平行四边形。"],
  parallelogram: ["A parallelogram has two pairs of parallel sides.", "平行四边形有两组分别平行的对边。"],
  trapezoid: ["A trapezoid has at least one pair of parallel sides.", "梯形至少有一组对边平行。"],
};

/** quadMarksSaid says what the marks of each kind show. */
const quadMarksSaid: Record<QuadKind, Pair> = {
  square: ["All four sides are marked equal, and all four angles are right angles.", "四条边都标为相等，四个角都是直角。"],
  rectangle: ["All four angles are right angles, but the sides have two lengths.", "四个角都是直角，但边长有两种。"],
  rhombus: ["All four sides are marked equal, and no angle is a right angle.", "四条边都标为相等，没有直角。"],
  parallelogram: [
    "Both pairs of opposite sides are parallel, the sides have two lengths and no angle is right.",
    "两组对边分别平行，边长有两种，没有直角。",
  ],
  trapezoid: ["Only one pair of sides is marked parallel.", "只有一组对边标为平行。"],
};

/** quadBelow says why no name more specific than the kind fits. */
const quadBelow: Record<QuadKind, Pair> = {
  square: ["A square fits every other name too, and no name is more specific.", "正方形也符合其他所有名称，没有比它更准确的了。"],
  rectangle: ["A square would also need four equal sides, but these sides have two lengths.", "正方形还要四条边相等，而这里的边长有两种。"],
  rhombus: ["A square would also need right angles, but these angles are not right.", "正方形还要有直角，而这里的角不是直角。"],
  parallelogram: [
    "A rectangle would need right angles and a rhombus would need four equal sides. Neither is true here.",
    "长方形要有直角，菱形要四条边相等，这里都不满足。",
  ],
  trapezoid: [
    "A parallelogram would need a second pair of parallel sides, but there is only one.",
    "平行四边形还要第二组平行边，而这里只有一组。",
  ],
};

/** kindPair gives the capitalized name of a quadrilateral, as an option. */
const kindPair = (k: QuadName): Pair => [capital(quadNames[k]).en, quadNames[k]["zh-CN"]];

/** wrongKind says why a name k is not the best name for a quadrilateral of the kind. */
const wrongKind = (k: QuadName, kind: QuadKind): readonly [Pair, string, string] =>
  isA(kind, k)
    ? [
        kindPair(k),
        `Every ${quadNames[kind].en} is ${art(k)} ${quadNames[k].en}, but ${quadNames[kind].en} is more specific.`,
        `${quadNames[kind]["zh-CN"]}都是${quadNames[k]["zh-CN"]}，但说成${quadNames[kind]["zh-CN"]}更准确。`,
      ]
    : [
        kindPair(k),
        `${Art(k)} ${quadNames[k].en} needs ${quadNeeds[k][0]}, and this one does not have that.`,
        `${quadNames[k]["zh-CN"]}要${quadNeeds[k][1]}，这个四边形不满足。`,
      ];

/** plainQuad draws a quadrilateral with no equal or parallel sides. */
const plainQuad = (): Mark[] => [
  {
    kind: "polygon",
    points: [
      [0, 0],
      [5, 0.6],
      [4.2, 3.4],
      [0.8, 2.6],
    ],
    accent: true,
  },
];

/** quadFigure draws a quadrilateral of a kind with its marks. */
const quadFigure = (rng: Rng, k: QuadName): Figure =>
  fig(
    k === "quadrilateral" ? plainQuad() : quadMarks(rng, k),
    "A quadrilateral with marks for equal sides, parallel sides and right angles.",
    "标有等边、平行边和直角记号的四边形。",
  );

/** rectangleSides draws a rectangle with its length and width labeled. */
const rectangleSides = (length: string, width: string): Figure =>
  sideFigure(
    [
      [0, 0],
      [6, 0],
      [6, 3],
      [0, 3],
    ],
    [length, width],
  );

/** twoDecimals writes hundredths with exactly two decimal places. */
const twoDecimals = (hundredths: number) => `${Math.floor(hundredths / 100)}.${String(hundredths % 100).padStart(2, "0")}`;

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
    point(
      "naming-polygons-from-figures",
      ["Naming a drawn polygon", "说出图中多边形的名称"],
      [
        "This shape has 6 straight sides, so it is a hexagon. A polygon is named by its sides: 3 triangle, 4 quadrilateral, 5 pentagon, 6 hexagon, 8 octagon.\n\nCheck: count the vertices too. There are 6, the same as the sides.\n\n> **Watch out.** Mark the side where you start, so you do not count a side twice.",
        "这个图形有 6 条直的边，所以是六边形。多边形按边数命名：3 条边是三角形，4 条是四边形，5 条是五边形，6 条是六边形，8 条是八边形。\n\n检验：再数一数顶点，也是 6 个，和边数一样。\n\n> **注意。** 先给开始数的那条边做个记号，免得重复数。",
      ],
      (rng) => {
        const n = rng.int(3, 10);
        const others = [n - 1, n + 1, n + 2, n - 2].filter((k) => k >= 3 && k <= 10).slice(0, 3);
        const name = polygonNames[n]!;
        return picked(
          rng,
          ["What is the name of this polygon?", "这个多边形叫什么？"],
          namePair(n),
          others.map(
            (k) =>
              [
                namePair(k),
                k < n
                  ? `${Art(polygonNames[k]!.en)} ${polygonNames[k]!.en} has only ${k} sides, but this one has ${n}. A side was missed.`
                  : `${Art(polygonNames[k]!.en)} ${polygonNames[k]!.en} has ${k} sides, but this one has only ${n}. A side was counted twice.`,
                k < n
                  ? `${polygonNames[k]!["zh-CN"]}只有 ${k} 条边，这个图形有 ${n} 条，漏数了边。`
                  : `${polygonNames[k]!["zh-CN"]}有 ${k} 条边，这个图形只有 ${n} 条，重复数了边。`,
              ] as const,
          ),
          [
            [
              ["Count the sides", "数边"],
              [`Start at one side and go around. There are ${n} sides.`, `从一条边开始绕一圈，共有 ${n} 条边。`],
            ],
            [
              ["Name it", "命名"],
              [`A polygon with ${n} sides is ${art(name.en)} ${name.en}.`, `有 ${n} 条边的多边形是${name["zh-CN"]}。`],
            ],
          ],
          [`Count the vertices instead. There are ${n}, the same as the sides.`, `改数顶点，也是 ${n} 个，和边数一样。`],
          fig(
            [{ kind: "polygon", points: randomPolygon(rng, n), accent: true }],
            `A polygon with ${n} sides.`,
            `一个有 ${n} 条边的多边形。`,
          ),
        );
      },
      fig([{ kind: "polygon", points: regular(6), accent: true }], "A polygon with 6 sides.", "一个有 6 条边的多边形。"),
    ),
    point(
      "sides-vertices-and-names",
      ["Sides, vertices and names", "边数、顶点数与名称"],
      [
        "An octagon has 8 sides, 8 vertices and 8 angles. A pentagon has 5 sides, so a polygon with one more side has 6. It is a hexagon.\n\nCheck: go around a shape: side, vertex, side, vertex. The sides and vertices take turns, so there are as many of each.\n\n> **Watch out.** A hexagon has 6 vertices, not 12. Do not add the sides and the vertices.",
        "八边形有 8 条边、8 个顶点、8 个角。五边形有 5 条边，多一条边就是 6 条，是六边形。\n\n检验：沿着图形走一圈：边、顶点、边、顶点……边和顶点轮流出现，所以个数一样多。\n\n> **注意。** 六边形有 6 个顶点，不是 12 个。不要把边数和顶点数加起来。",
      ],
      (rng) => {
        const form = rng.int(0, 2);
        const part = rng.pick<Pair>([
          ["sides", "条边"],
          ["vertices", "个顶点"],
          ["angles", "个角"],
        ]);
        const goAround: Pair = [
          "Go around the shape: side, vertex, side, vertex. They take turns, so there are as many sides as vertices and angles.",
          "沿着图形走一圈：边、顶点、边、顶点……它们轮流出现，所以边数、顶点数和角数一样多。",
        ];
        if (form === 0) {
          const n = rng.int(3, 10);
          const name = polygonNames[n]!;
          return answered(
            [`How many ${part[0]} does ${art(name.en)} ${name.en} have?`, `${name["zh-CN"]}有几${part[1]}？`],
            n,
            [
              [
                ["Recall the sides", "想边数"],
                [`${Art(name.en)} ${name.en} has ${n} sides.`, `${name["zh-CN"]}有 ${n} 条边。`],
              ],
              [
                ["Match the count", "对应个数"],
                [`A polygon has as many ${part[0]} as sides.`, `多边形的${part[1].slice(1)}数和边数一样多。`],
              ],
            ],
            goAround,
            [
              [n + 1, "That is one too many.", "多了一个。"],
              [n - 1, "That is one too few.", "少了一个。"],
              [2 * n, "That adds the sides and the vertices together.", "这是把边数和顶点数加在一起了。"],
            ],
          );
        }
        if (form === 1) {
          const n = rng.int(3, 10);
          const name = polygonNames[n]!;
          return picked(
            rng,
            [`What is a polygon with ${n} ${part[0]} called?`, `有 ${n} ${part[1]}的多边形叫什么？`],
            namePair(n),
            [n - 1, n + 1, n + 2, n - 2]
              .filter((k) => k >= 3 && k <= 10)
              .slice(0, 3)
              .map(
                (k) =>
                  [
                    namePair(k),
                    `${Art(polygonNames[k]!.en)} ${polygonNames[k]!.en} has ${k} ${part[0]}, not ${n}.`,
                    `${polygonNames[k]!["zh-CN"]}有 ${k} ${part[1]}，不是 ${n} ${part[1]}。`,
                  ] as const,
              ),
            [
              [
                ["Find the sides", "求边数"],
                [
                  `A polygon has as many sides as ${part[0]}, so it has ${n} sides.`,
                  `多边形的边数和${part[1].slice(1)}数一样多，所以有 ${n} 条边。`,
                ],
              ],
              [
                ["Name it", "命名"],
                [`A polygon with ${n} sides is ${art(name.en)} ${name.en}.`, `有 ${n} 条边的多边形是${name["zh-CN"]}。`],
              ],
            ],
            goAround,
          );
        }
        const n = rng.int(4, 9);
        const more = rng.bool();
        const target = more ? n + 1 : n - 1;
        const name = polygonNames[n]!;
        const goal = polygonNames[target]!;
        return picked(
          rng,
          [
            `Which polygon has one ${more ? "more" : "fewer"} side than ${art(name.en)} ${name.en}?`,
            `哪种多边形比${name["zh-CN"]}${more ? "多" : "少"}一条边？`,
          ],
          namePair(target),
          [more ? n - 1 : n + 1, n, target + (more ? 1 : -1)]
            .filter((k) => k >= 3 && k <= 10)
            .map(
              (k) =>
                [
                  namePair(k),
                  k === n
                    ? `That is the same polygon, with ${n} sides.`
                    : `${Art(polygonNames[k]!.en)} ${polygonNames[k]!.en} has ${k} sides, but you need ${target}.`,
                  k === n ? `这是同一种多边形，有 ${n} 条边。` : `${polygonNames[k]!["zh-CN"]}有 ${k} 条边，需要的是 ${target} 条。`,
                ] as const,
            ),
          [
            [
              ["Recall the sides", "想边数"],
              [`${Art(name.en)} ${name.en} has ${n} sides.`, `${name["zh-CN"]}有 ${n} 条边。`],
            ],
            [
              [more ? "Add one" : "Take one away", more ? "加一" : "减一"],
              [`A polygon with ${target} sides is ${art(goal.en)} ${goal.en}.`, `有 ${target} 条边的多边形是${goal["zh-CN"]}。`],
              [`${n} ${more ? "+" : "-"} 1 = ${target}`],
            ],
          ],
          [
            `Go back the other way. $${target} ${more ? "-" : "+"} 1 = ${n}$, the sides of ${art(name.en)} ${name.en}.`,
            `反过来算：$${target} ${more ? "-" : "+"} 1 = ${n}$，正是${name["zh-CN"]}的边数。`,
          ],
        );
      },
      fig([{ kind: "polygon", points: regular(8), accent: true }], "A polygon with 8 sides.", "一个有 8 条边的多边形。"),
    ),
  ],
  t(
    "A stop sign has 8 straight sides, so it is an octagon. It also has 8 corners, called vertices.\n\nCheck: count the corners: 8, the same as the sides.\n\nIn this lesson we name polygons by their number of sides.",
    "停车标志有 8 条直的边，所以是八边形。它也有 8 个角，角上的点叫顶点。\n\n检验：数一数顶点，也是 8 个，和边数一样。\n\n本课我们按边数给多边形命名。",
  ),
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
    point(
      "identifying-quadrilaterals",
      ["The best name for a quadrilateral", "四边形最准确的名称"],
      [
        "This shape has four right angles, and its sides have two lengths. So it is a rectangle.\n\nCheck: a square would need four equal sides, but these sides have two lengths.\n\n> **Watch out.** Give the most specific name. A square is also a rectangle, but the name square tells more.",
        "这个图形有四个直角，边长有两种，所以它是长方形。\n\n检验：正方形要四条边相等，而这里的边长有两种。\n\n> **注意。** 要说最准确的名称。正方形也是长方形，但叫它正方形说得更清楚。",
      ],
      (rng) => {
        const kind = rng.pick(quadKinds);
        return picked(
          rng,
          ["What is the most specific name for this quadrilateral?", "这个四边形最准确的名称是什么？"],
          kindPair(kind),
          quadKinds.filter((k) => k !== kind).map((k) => wrongKind(k, kind)),
          [
            [["Read the marks", "看记号"], quadMarksSaid[kind]],
            [
              ["Choose the most specific name", "选最准确的名称"],
              [`The most specific name that fits is ${quadNames[kind].en}.`, `符合条件的最准确的名称是${quadNames[kind]["zh-CN"]}。`],
            ],
          ],
          quadBelow[kind],
          quadFigure(rng, kind),
        );
      },
      quadFigure(createRng(3), "rectangle"),
    ),
    point(
      "properties-of-quadrilaterals",
      ["Properties of quadrilaterals", "四边形的特征"],
      [
        "Every rhombus has two pairs of parallel sides, because a rhombus is a parallelogram. But not every rhombus has four right angles.\n\nCheck: think of a rhombus with angles of 60 and 120 degrees. It has no right angle.\n\n> **Watch out.** One example with right angles does not prove that every one has them.",
        "每个菱形都有两组平行的对边，因为菱形是平行四边形。但不是每个菱形都有四个直角。\n\n检验：想一个角是 60 度和 120 度的菱形，它没有直角。\n\n> **注意。** 找到一个有直角的例子，并不能说明每一个都有直角。",
      ],
      (rng) => {
        const kind = rng.pick(quadKinds);
        const p = rng.pick(quadProperties);
        const yes = p.has.includes(kind);
        const name = quadNames[kind];
        const example = quadExample[kind];
        return picked(
          rng,
          [`True or false: every ${name.en} has ${p.text.en}.`, `判断：每个${name["zh-CN"]}都有${p.text["zh-CN"]}。`],
          yes ? ["True", "正确"] : ["False", "错误"],
          [
            yes
              ? [
                  ["False", "错误"],
                  `Every ${name.en} has ${p.text.en}. It comes with being ${art(name.en)} ${name.en}.`,
                  `每个${name["zh-CN"]}都有${p.text["zh-CN"]}，这是${name["zh-CN"]}本身带来的。`,
                ]
              : [
                  ["True", "正确"],
                  `Not every one. ${upper(example[0])} is ${art(name.en)} ${name.en} without ${p.text.en}.`,
                  `不是每个都有。${example[1]}就没有${p.text["zh-CN"]}。`,
                ],
          ],
          [
            [["Recall what it is", "想定义"], quadDefinition[kind]],
            [
              ["Test the property", "检查特征"],
              yes
                ? [`That always gives ${p.text.en}.`, `这样一定有${p.text["zh-CN"]}。`]
                : [`That does not force ${p.text.en}.`, `这并不能保证有${p.text["zh-CN"]}。`],
            ],
          ],
          [
            `Think of ${example[0]}. It ${yes ? "has" : "does not have"} ${p.text.en}.`,
            `想一想${example[1]}，它${yes ? "有" : "没有"}${p.text["zh-CN"]}。`,
          ],
          quadFigure(rng, kind),
        );
      },
      quadFigure(createRng(5), "rhombus"),
    ),
  ],
  t(
    "A window has four right angles. Its long sides are 6 ft and its short sides are 3 ft, so it is a rectangle, not a square.\n\nCheck: a square needs four equal sides, and 6 and 3 are not equal.\n\nIn this lesson we name quadrilaterals by their sides and angles.",
    "一扇窗户有四个直角。长边是 6 英尺，短边是 3 英尺，所以它是长方形，不是正方形。\n\n检验：正方形要四条边相等，而 6 和 3 不相等。\n\n本课我们根据边和角给四边形命名。",
  ),
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
  ["quadrilaterals", "perimeter-of-polygons"],
  ["5.G.B.3"],
  [
    point(
      "perimeters-of-special-quadrilaterals",
      ["Perimeter from one or two sides", "由一两条边求周长"],
      [
        "A rectangle is 9 cm long and 6 cm wide. Length plus width is $9 + 6 = 15$ cm, and there are two of each, so the perimeter is $2 \\times 15 = 30$ cm.\n\nCheck: add all four sides. $9 + 6 + 9 + 6 = 30$.\n\n> **Watch out.** $9 \\times 6 = 54$ is the area inside, not the distance around.",
        "一个长方形长 9 厘米、宽 6 厘米。长加宽是 $9 + 6 = 15$ 厘米，长和宽各有两条，所以周长是 $2 \\times 15 = 30$ 厘米。\n\n检验：四条边相加，$9 + 6 + 9 + 6 = 30$。\n\n> **注意。** $9 \\times 6 = 54$ 是里面的面积，不是一周的长度。",
      ],
      (rng) => {
        const kind = rng.pick<QuadKind>(["square", "rectangle", "rhombus"]);
        const u = rng.pick(lengthUnits);
        const marks = quadMarks(rng, kind);
        const pts = (marks[0] as Extract<Mark, { kind: "polygon" }>).points;
        const a = rng.int(3, 25);
        let b = rng.int(2, 20);
        if (b === a) b++;
        const [long, short] = [Math.max(a, b), Math.min(a, b)];
        const prompt: Pair = [
          `What is the perimeter of the ${quadNames[kind].en}, in ${u.name.en}?`,
          `这个${quadNames[kind]["zh-CN"]}的周长是多少${u.name["zh-CN"]}？`,
        ];
        if (kind === "rectangle") {
          const p = 2 * (a + b);
          return answered(
            prompt,
            p,
            [
              [
                ["Add a length and a width", "长加宽"],
                ["That is half of the way around.", "这是一周的一半。"],
                [`${long} + ${short} = ${a + b}`],
              ],
              [
                ["Double it", "乘 2"],
                ["Opposite sides are equal, so there are two of each.", "对边相等，长和宽各有两条。"],
                [`2 \\times ${a + b} = ${p}`],
              ],
            ],
            [
              `Add all four sides: $${long} + ${short} + ${long} + ${short} = ${p}$.`,
              `四条边相加：$${long} + ${short} + ${long} + ${short} = ${p}$。`,
            ],
            [
              [a + b, "That is only half of the way around.", "这只是一周的一半。"],
              [a * b, "That is the area inside, not the distance around.", "这是里面的面积，不是一周的长度。"],
              [2 * long + short, "That leaves out one side.", "这里漏了一条边。"],
            ],
            { figure: sideFigure(pts, [`${long} ${u.abbr}`, `${short} ${u.abbr}`], marks.slice(1)) },
          );
        }
        const p = 4 * a;
        return answered(
          prompt,
          p,
          [
            [
              ["Count the equal sides", "数相等的边"],
              [`All four sides of a ${quadNames[kind].en} are equal.`, `${quadNames[kind]["zh-CN"]}的四条边都相等。`],
            ],
            [["Multiply", "相乘"], ["Four sides of the same length.", "四条同样长的边。"], [`4 \\times ${a} = ${p}`]],
          ],
          [`Add all four sides: $${a} + ${a} + ${a} + ${a} = ${p}$.`, `四条边相加：$${a} + ${a} + ${a} + ${a} = ${p}$。`],
          [
            [a * a, "That is the area inside, not the distance around.", "这是里面的面积，不是一周的长度。"],
            [2 * a, "That counts only two sides.", "这只算了两条边。"],
            [a + 4, "That adds 4 instead of multiplying by 4.", "这是加了 4，应该乘 4。"],
          ],
          { figure: sideFigure(pts, [`${a} ${u.abbr}`], marks.slice(1)) },
        );
      },
      rectangleSides("9 cm", "6 cm"),
    ),
    point(
      "sides-from-perimeters",
      ["A side from the perimeter", "由周长求边长"],
      [
        "A rectangle has a perimeter of 30 cm and a length of 9 cm. Half the perimeter is $30 \\div 2 = 15$ cm, one length and one width. So the width is $15 - 9 = 6$ cm.\n\nCheck: $2 \\times (9 + 6) = 30$.\n\n> **Watch out.** Halve the perimeter first. $30 - 9 = 21$ still has a length and two widths in it.",
        "一个长方形的周长是 30 厘米，长是 9 厘米。周长的一半是 $30 \\div 2 = 15$ 厘米，是一条长和一条宽。所以宽是 $15 - 9 = 6$ 厘米。\n\n检验：$2 \\times (9 + 6) = 30$。\n\n> **注意。** 先把周长除以 2。$30 - 9 = 21$ 里还有一条长和两条宽。",
      ],
      (rng) => {
        const kind = rng.pick<QuadKind>(["square", "rectangle", "rhombus"]);
        const u = rng.pick(lengthUnits);
        const a = rng.int(3, 30);
        if (kind !== "rectangle") {
          const p = 4 * a;
          return answered(
            [
              `A ${quadNames[kind].en} has a perimeter of ${p} ${u.name.en}. How long is each side, in ${u.name.en}?`,
              `一个${quadNames[kind]["zh-CN"]}的周长是 ${p} ${u.name["zh-CN"]}。每条边长多少${u.name["zh-CN"]}？`,
            ],
            a,
            [
              [
                ["Count the equal sides", "数相等的边"],
                [`A ${quadNames[kind].en} has four equal sides.`, `${quadNames[kind]["zh-CN"]}有四条相等的边。`],
              ],
              [["Divide", "做除法"], ["Share the perimeter among the four sides.", "把周长平均分给四条边。"], [`${p} \\div 4 = ${a}`]],
            ],
            [`Multiply back: $4 \\times ${a} = ${p}$.`, `乘回去：$4 \\times ${a} = ${p}$。`],
            [
              [p / 2, "That is half the perimeter, two sides together.", "这是周长的一半，是两条边的和。"],
              [p - 4, "That subtracts 4 instead of dividing by 4.", "这是减了 4，应该除以 4。"],
              [p, "That is the whole perimeter, all four sides.", "这是整个周长，是四条边的和。"],
            ],
          );
        }
        let b = rng.int(2, 25);
        if (b === a) b++;
        const p = 2 * (a + b);
        return answered(
          [
            `A rectangle has a perimeter of ${p} ${u.name.en}, and one side is ${a} ${u.name.en}. How long is the side next to it, in ${u.name.en}?`,
            `一个长方形的周长是 ${p} ${u.name["zh-CN"]}，一条边长 ${a} ${u.name["zh-CN"]}。与它相邻的边长多少${u.name["zh-CN"]}？`,
          ],
          b,
          [
            [
              ["Halve the perimeter", "周长除以 2"],
              ["Half of the way around is two sides next to each other.", "一周的一半是相邻两条边的和。"],
              [`${p} \\div 2 = ${a + b}`],
            ],
            [["Subtract the known side", "减去已知边"], ["Take away the side you know.", "减去已知的那条边。"], [`${a + b} - ${a} = ${b}`]],
          ],
          [`Put it back together: $2 \\times (${a} + ${b}) = ${p}$.`, `合起来算：$2 \\times (${a} + ${b}) = ${p}$。`],
          [
            [p - a, "That subtracts one side from the whole perimeter. Halve it first.", "这是用整个周长减一条边。要先除以 2。"],
            [p - 2 * a, "That still has two sides in it. Halve what is left.", "这里还包含两条边，还要除以 2。"],
            [p / 2, "That is both sides together. Subtract the known side.", "这是两条边的和，还要减去已知的边。"],
          ],
          { figure: rectangleSides(`${a} ${u.abbr}`, "?") },
        );
      },
      rectangleSides("9 cm", "?"),
    ),
  ],
  t(
    "A picture frame is 9 in long and 6 in wide. Going around it is $9 + 6 + 9 + 6 = 30$ in.\n\nCheck: the frame has two lengths and two widths, and $2 \\times (9 + 6) = 30$.\n\nIn this lesson we find the perimeters and sides of rectangles, rhombuses and squares.",
    "一个相框长 9 英寸、宽 6 英寸。绕它一圈是 $9 + 6 + 9 + 6 = 30$ 英寸。\n\n检验：相框有两条长、两条宽，$2 \\times (9 + 6) = 30$。\n\n本课我们求长方形、菱形和正方形的周长和边长。",
  ),
);

export const perimetersOfShapes = topic(
  "perimeters-of-shapes",
  t("Perimeters of Shapes", "图形的周长"),
  t(
    "The perimeter of a polygon is the sum of the lengths of all its sides. Side lengths can be decimals or fractions: a triangle with sides 2.5 m, 3.4 m and 4 m has perimeter 9.9 m. If the perimeter and all but one side are known, subtract the known sides from the perimeter to find the missing one.",
    "多边形的周长是所有边长的和。边长可以是小数或分数：边长为 2.5 米、3.4 米、4 米的三角形，周长是 9.9 米。如果已知周长和除一条边以外的所有边，用周长减去已知各边就得到未知的边长。",
  ),
  ["polygons", "perimeter-of-polygons", "addition-with-unequal-numbers-of-decimals"],
  ["5.NBT.B.7"],
  [
    point(
      "adding-decimal-side-lengths",
      ["Adding the sides", "把各边相加"],
      [
        "A triangle has sides of 3.5 cm, 4 cm and 2.75 cm. Write each with two decimal places and add. $3.50 + 4.00 + 2.75 = 10.25$ cm.\n\nCheck: add in another order. $2.75 + 4.00 + 3.50 = 10.25$.\n\n> **Watch out.** Line up the decimal points, not the last digits.",
        "一个三角形的边长是 3.5 厘米、4 厘米和 2.75 厘米。都写成两位小数再相加，$3.50 + 4.00 + 2.75 = 10.25$ 厘米。\n\n检验：换个顺序加，$2.75 + 4.00 + 3.50 = 10.25$。\n\n> **注意。** 要对齐小数点，不是对齐末位。",
      ],
      (rng) => {
        const n = rng.int(3, 5);
        const u = rng.pick(lengthUnits);
        const sides = Array.from({ length: n }, () => {
          const x = rng.int(300, 590);
          return rng.bool() ? x : Math.round(x / 10) * 10;
        });
        const total = sides.reduce((a, b) => a + b, 0);
        const v = Q.of(total, 100);
        const shown = sides.map((s) => dec(Q.of(s, 100)));
        const padded = sides.map(twoDecimals);
        const name = polygonNames[n]!;
        return answered(
          [`What is the perimeter of the ${name.en}, in ${u.name.en}?`, `这个${name["zh-CN"]}的周长是多少${u.name["zh-CN"]}？`],
          v,
          [
            [
              ["Line up the decimal points", "对齐小数点"],
              ["Write every side with two decimal places.", "把每条边都写成两位小数。"],
              [padded.join(", \\quad ")],
            ],
            [["Add", "相加"], [`Add all ${n} sides.`, `把 ${n} 条边相加。`], [`${padded.join(" + ")} = ${twoDecimals(total)}`]],
          ],
          [
            `Add in another order: $${[...padded].reverse().join(" + ")} = ${twoDecimals(total)}$.`,
            `换个顺序加：$${[...padded].reverse().join(" + ")} = ${twoDecimals(total)}$。`,
          ],
          [
            [
              Q.of(
                sides.reduce((a, b) => a + (b % 10 === 0 ? b / 10 : b), 0),
                100,
              ),
              "That lines up the last digits instead of the decimal points.",
              "这是对齐了末位，没有对齐小数点。",
            ],
            [v.sub(Q.of(sides[0]!, 100)), "That leaves out one side.", "这里漏了一条边。"],
            [v.mul(Q.of(10)), "That moves the decimal point one place to the right.", "这是把小数点向右移了一位。"],
          ],
          {
            figure: sideFigure(
              randomPolygon(rng, n),
              shown.map((s) => `${s} ${u.abbr}`),
            ),
          },
        );
      },
      sideFigure(
        [
          [0, 0],
          [6, 0],
          [2, 3.5],
        ],
        ["3.5 cm", "4 cm", "2.75 cm"],
      ),
    ),
    point(
      "missing-side-from-perimeter",
      ["A missing side", "求未知的边"],
      [
        "A pentagon has a perimeter of 40 ft. Four of its sides are 8, 9, 6 and 7 ft. They add to $8 + 9 + 6 + 7 = 30$ ft, so the fifth side is $40 - 30 = 10$ ft.\n\nCheck: $8 + 9 + 6 + 7 + 10 = 40$.\n\n> **Watch out.** Subtract every known side, not just one of them.",
        "一个五边形的周长是 40 英尺，其中四条边是 8、9、6、7 英尺。它们的和是 $8 + 9 + 6 + 7 = 30$ 英尺，所以第五条边是 $40 - 30 = 10$ 英尺。\n\n检验：$8 + 9 + 6 + 7 + 10 = 40$。\n\n> **注意。** 要减去所有已知的边，不是只减一条。",
      ],
      (rng) => {
        const n = rng.int(3, 6);
        const u = rng.pick(lengthUnits);
        const sides = Array.from({ length: n }, () => (n === 3 ? rng.int(12, 22) : rng.int(3, 30)));
        const p = sides.reduce((a, b) => a + b, 0);
        const miss = rng.int(0, n - 1);
        const known = sides.filter((_, i) => i !== miss);
        const knownSum = p - sides[miss]!;
        const name = polygonNames[n]!;
        return answered(
          [
            `The ${name.en} has a perimeter of ${p} ${u.name.en}. What is the length of the side marked ?, in ${u.name.en}?`,
            `这个${name["zh-CN"]}的周长是 ${p} ${u.name["zh-CN"]}。标有 ? 的边长多少${u.name["zh-CN"]}？`,
          ],
          sides[miss]!,
          [
            [
              ["Add the known sides", "已知边相加"],
              [`There are ${n - 1} known sides.`, `已知的边有 ${n - 1} 条。`],
              [`${known.join(" + ")} = ${knownSum}`],
            ],
            [
              ["Subtract from the perimeter", "用周长减"],
              ["What is left of the perimeter is the missing side.", "周长剩下的部分就是未知的边。"],
              [`${p} - ${knownSum} = ${sides[miss]}`],
            ],
          ],
          [`Add all the sides: $${sides.join(" + ")} = ${p}$.`, `所有边相加：$${sides.join(" + ")} = ${p}$。`],
          [
            [p + knownSum, "That adds the known sides to the perimeter. Subtract them.", "这是把已知边加到周长上了，应该减去。"],
            [
              Math.round(p / n),
              "That shares the perimeter equally, but the sides are not all equal.",
              "这是把周长平均分了，可是各边并不相等。",
            ],
            [p - known[0]!, "That subtracts only one known side.", "这只减了一条已知边。"],
          ],
          {
            figure: sideFigure(
              randomPolygon(rng, n),
              sides.map((s, i) => (i === miss ? "?" : `${s} ${u.abbr}`)),
            ),
          },
        );
      },
      sideFigure(regular(5), ["8 ft", "9 ft", "6 ft", "7 ft", "?"]),
    ),
  ],
  t(
    "A garden has sides of 2.5 m, 3.4 m and 4 m. The fence around it is $2.5 + 3.4 + 4 = 9.9$ m long.\n\nCheck: $9.9 - 4 = 5.9$, and $2.5 + 3.4 = 5.9$ too.\n\nIn this lesson we add decimal sides and find a missing side.",
    "一个花园的边长是 2.5 米、3.4 米和 4 米。围一圈的篱笆长 $2.5 + 3.4 + 4 = 9.9$ 米。\n\n检验：$9.9 - 4 = 5.9$，而 $2.5 + 3.4$ 也等于 $5.9$。\n\n本课我们把小数边长相加，并求未知的边。",
  ),
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
    point(
      "every-one-is-also",
      ["Is every one also…?", "是不是都是……？"],
      [
        "Every square is a rhombus, since it has four equal sides. But not every rhombus is a square, since a rhombus need not have right angles.\n\nCheck: a rhombus with angles of 60 and 120 degrees is not a square.\n\n> **Watch out.** Every square is a rhombus, but that does not turn around. Check each direction on its own.",
        "正方形都是菱形，因为它四条边都相等。但菱形不都是正方形，因为菱形不一定有直角。\n\n检验：角是 60 度和 120 度的菱形不是正方形。\n\n> **注意。** 正方形都是菱形，反过来却不对。两个方向要分别判断。",
      ],
      (rng) => {
        const all: QuadName[] = [...quadKinds, "quadrilateral"];
        const x = rng.pick(all);
        let y = rng.pick(all);
        while (y === x) y = rng.pick(all);
        const yes = isA(x, y);
        const [xn, yn] = [quadNames[x], quadNames[y]];
        const example = quadExample[x];
        return picked(
          rng,
          [`Is every ${xn.en} ${art(yn.en)} ${yn.en}?`, `每个${xn["zh-CN"]}都是${yn["zh-CN"]}吗？`],
          yes ? ["Yes", "是"] : ["No", "不是"],
          [
            yes
              ? [
                  ["No", "不是"],
                  `Every ${xn.en} has ${quadNeeds[y][0]}, so it is always ${art(yn.en)} ${yn.en}.`,
                  `每个${xn["zh-CN"]}都有${quadNeeds[y][1]}，所以都是${yn["zh-CN"]}。`,
                ]
              : [
                  ["Yes", "是"],
                  `Not always. ${upper(example[0])} is not ${art(yn.en)} ${yn.en}.`,
                  `不一定。${example[1]}就不是${yn["zh-CN"]}。`,
                ],
          ],
          [
            [
              ["What it needs", "看需要什么"],
              [`${Art(yn.en)} ${yn.en} needs ${quadNeeds[y][0]}.`, `${yn["zh-CN"]}要${quadNeeds[y][1]}。`],
            ],
            [
              ["Test every one", "看是否每个都满足"],
              yes
                ? [`Every ${xn.en} has that.`, `每个${xn["zh-CN"]}都满足。`]
                : [`Some ${plural(x).en} do not have that.`, `有些${xn["zh-CN"]}不满足。`],
            ],
          ],
          [
            `Think of ${example[0]}. It ${yes ? "is" : "is not"} ${art(yn.en)} ${yn.en}.`,
            `想一想${example[1]}，它${yes ? "是" : "不是"}${yn["zh-CN"]}。`,
          ],
          quadFigure(rng, x),
        );
      },
      quadFigure(createRng(2), "square"),
    ),
    point(
      "naming-from-a-description",
      ["Naming from a description", "根据描述命名"],
      [
        "A quadrilateral has sides of 6, 4, 6 and 4 cm and four right angles. Four right angles make it a rectangle.\n\nCheck: a square would also need four equal sides, but 6 and 4 differ.\n\n> **Watch out.** Equal sides alone do not make a square. It also needs right angles.",
        "一个四边形的边依次是 6、4、6、4 厘米，有四个直角。四个直角说明它是长方形。\n\n检验：正方形还要四条边相等，而 6 和 4 不相等。\n\n> **注意。** 只有边相等还不是正方形，还要有直角。",
      ],
      (rng) => {
        const kind = rng.pick(quadKinds);
        const a = rng.int(3, 15);
        let b = rng.int(2, 14);
        if (b === a) b++;
        const angle = rng.int(50, 80);
        const desc: Record<QuadKind, Pair> = {
          square: [`sides of ${a}, ${a}, ${a} and ${a} cm and four right angles`, `四条边都是 ${a} 厘米，四个角都是直角`],
          rectangle: [
            `sides of ${a}, ${b}, ${a} and ${b} cm and four right angles`,
            `四条边依次是 ${a}、${b}、${a}、${b} 厘米，四个角都是直角`,
          ],
          rhombus: [
            `sides of ${a}, ${a}, ${a} and ${a} cm and angles of ${angle}, ${180 - angle}, ${angle} and ${180 - angle} degrees`,
            `四条边都是 ${a} 厘米，四个角依次是 ${angle}、${180 - angle}、${angle}、${180 - angle} 度`,
          ],
          parallelogram: [
            `two pairs of parallel sides, sides of ${a}, ${b}, ${a} and ${b} cm, and angles of ${angle}, ${180 - angle}, ${angle} and ${180 - angle} degrees`,
            `两组对边分别平行，四条边依次是 ${a}、${b}、${a}、${b} 厘米，四个角依次是 ${angle}、${180 - angle}、${angle}、${180 - angle} 度`,
          ],
          trapezoid: [
            `exactly one pair of parallel sides, of ${Math.max(a, b)} cm and ${Math.min(a, b)} cm`,
            `只有一组对边平行，长分别是 ${Math.max(a, b)} 厘米和 ${Math.min(a, b)} 厘米`,
          ],
        };
        return picked(
          rng,
          [`A quadrilateral has ${desc[kind][0]}. What is its most specific name?`, `一个四边形${desc[kind][1]}。它最准确的名称是什么？`],
          kindPair(kind),
          quadKinds.filter((k) => k !== kind).map((k) => wrongKind(k, kind)),
          [
            [["Read the sides and angles", "看边和角"], quadMarksSaid[kind]],
            [
              ["Choose the most specific name", "选最准确的名称"],
              [`The most specific name that fits is ${quadNames[kind].en}.`, `符合条件的最准确的名称是${quadNames[kind]["zh-CN"]}。`],
            ],
          ],
          quadBelow[kind],
        );
      },
      quadFigure(createRng(4), "parallelogram"),
    ),
  ],
  t(
    "Sam says every square is a rectangle. A square has four right angles, so he is right. But a rectangle 6 cm by 3 cm is not a square.\n\nCheck: a square needs four equal sides, and 6 and 3 differ.\n\nIn this lesson we sort quadrilaterals into families.",
    "小山说每个正方形都是长方形。正方形有四个直角，所以他说得对。但长 6 厘米、宽 3 厘米的长方形不是正方形。\n\n检验：正方形要四条边相等，而 6 和 3 不相等。\n\n本课我们给四边形分类。",
  ),
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

// ---------------------------------------------------------------------------
// Deeper knowledge points of the conversion topics

/** addingLengthsInTwoUnits adds a length in kilometers and a length in meters, in kilometers. */
export const addingLengthsInTwoUnits = point(
  "adding-lengths-in-two-units",
  ["Adding lengths in two units", "不同单位的长度相加"],
  [
    "Mia runs 2.5 km and then 350 m more. First write 350 m in kilometers: $350 \\div 1{,}000 = 0.35$ km. Then add: $2.5 + 0.35 = 2.85$ km.\n\nCheck: in meters it is $2{,}500 + 350 = 2{,}850$ m, and that is 2.85 km.\n\n> **Watch out.** Do not add 2.5 and 350. Change both lengths to the same unit first.",
    "米娅跑了 2.5 千米，又跑了 350 米。先把 350 米写成千米：$350 \\div 1{,}000 = 0.35$ 千米。再相加：$2.5 + 0.35 = 2.85$ 千米。\n\n检验：用米算，$2{,}500 + 350 = 2{,}850$ 米，就是 2.85 千米。\n\n> **注意。** 不能直接把 2.5 和 350 相加。先把两个长度换成同一个单位。",
  ],
  (rng) => {
    const k = rng.int(11, 99);
    const meters = rng.int(12, 95) * 10;
    const first = Q.of(k, 10);
    const part = Q.of(meters, 1000);
    const total = first.add(part);
    return answered(
      [
        `A runner goes ${dec(first)} kilometers and then ${meters} meters more. How many kilometers is that in all?`,
        `一名跑步者跑了 ${dec(first)} 千米，又跑了 ${meters} 米。一共跑了多少千米？`,
      ],
      total,
      [
        [
          ["Change meters to kilometers", "把米换成千米"],
          [
            "1,000 meters make 1 kilometer, so move the decimal point 3 places to the left.",
            "1,000 米是 1 千米，所以小数点向左移动 3 位。",
          ],
          [`${meters} \\div 1{,}000 = ${dec(part)}`],
        ],
        [
          ["Add the kilometers", "千米数相加"],
          ["Both lengths are now in kilometers.", "现在两个长度都以千米为单位。"],
          [`${dec(first)} + ${dec(part)} = ${dec(total)}`],
        ],
      ],
      [
        `Work in meters: $${tex(k * 100)} + ${meters} = ${tex(k * 100 + meters)}$ m, and that is ${dec(total)} km.`,
        `用米算：$${tex(k * 100)} + ${meters} = ${tex(k * 100 + meters)}$ 米，就是 ${dec(total)} 千米。`,
      ],
      [
        [
          first.add(Q.of(meters, 100)),
          "That moves the decimal point only 2 places for the meters. A kilometer is 1,000 meters.",
          "这是米数的小数点只移了 2 位。1 千米是 1,000 米。",
        ],
        [first.add(Q.of(meters)), "That adds the meters as if they were kilometers.", "这是把米数当成千米数直接加了。"],
        [
          first.add(Q.of(meters, 10000)),
          "That moves the decimal point 4 places for the meters, one too many.",
          "这是米数的小数点移了 4 位，多移了一位。",
        ],
      ],
      { form: "decimal" },
    );
  },
  tapeFigure(
    [
      {
        total: "2.85 km",
        pieces: [
          { size: 2500, text: "2.5 km" },
          { size: 350, text: "350 m", lit: true },
        ],
      },
    ],
    [
      "A bar for 2.85 km made of a piece of 2.5 km and a shaded piece of 350 m.",
      "一个表示 2.85 千米的长条，由 2.5 千米的一段和涂色的 350 米的一段组成。",
    ],
  ),
);

/** fullYardsInInches counts the full yards in a number of inches. */
export const fullYardsInInches = point(
  "full-yards-in-inches",
  ["Full yards in inches", "英寸中有几个整码"],
  [
    "A yard is 3 feet, and a foot is 12 inches, so a yard is $3 \\times 12 = 36$ inches. A rope of 80 inches: $80 \\div 36$ is 2 with 8 left, so it has 2 full yards.\n\nCheck: $2 \\times 36 + 8 = 80$ inches, and 8 is less than 36.\n\n> **Watch out.** Divide by 36, not by 12. Dividing by 12 counts feet.",
    "1 码是 3 英尺，1 英尺是 12 英寸，所以 1 码是 $3 \\times 12 = 36$ 英寸。一根 80 英寸的绳子：$80 \\div 36$ 商 2 余 8，所以有 2 个整码。\n\n检验：$2 \\times 36 + 8 = 80$ 英寸，而且 8 比 36 小。\n\n> **注意。** 要除以 36，不是除以 12。除以 12 求的是英尺数。",
  ],
  (rng) => {
    const y = rng.int(2, 30);
    const r = rng.int(1, 35);
    const n = 36 * y + r;
    return answered(
      [`How many full yards are in ${fmt(n)} inches?`, `${fmt(n)} 英寸中有多少个整码？`],
      y,
      [
        [
          ["Find the inches in a yard", "求 1 码有几英寸"],
          ["A yard is 3 feet of 12 inches each.", "1 码是 3 英尺，每英尺 12 英寸。"],
          ["3 \\times 12 = 36"],
        ],
        [
          ["Divide", "做除法"],
          [
            `Dividing by 36 gives ${y} with ${r} inches left, which is not a full yard.`,
            `除以 36 商 ${y} 余 ${r}，剩下的 ${r} 英寸不满 1 码。`,
          ],
          [`36 \\times ${y} = ${tex(36 * y)}`, `${tex(n)} - ${tex(36 * y)} = ${r}`],
        ],
      ],
      [
        `Change back: $${y} \\times 36 + ${r} = ${tex(n)}$ inches, and ${r} is less than 36.`,
        `换回去：$${y} \\times 36 + ${r} = ${tex(n)}$ 英寸，而且 ${r} 比 36 小。`,
      ],
      [
        [Math.floor(n / 12), "That divides by 12, which counts feet, not yards.", "这是除以 12，求的是英尺数，不是码数。"],
        [
          y + 1,
          `That counts the ${r} inches left as a full yard, but a yard needs 36.`,
          `这是把剩下的 ${r} 英寸算成了一整码，可 1 码要 36 英寸。`,
        ],
        [
          Math.floor(n / 3),
          "That divides by 3, but 3 is the feet in a yard, not the inches.",
          "这是除以 3，可 3 是 1 码的英尺数，不是英寸数。",
        ],
      ],
    );
  },
  leftTape(80, 36),
);

/** totalInLarger builds the knowledge point of several equal items whose total is written in a larger metric unit. */
const totalInLarger = (id: string, title: Pair, item: Pair, small: Pair, big: Pair, explanation: Pair, figure: Figure) =>
  point(
    id,
    title,
    explanation,
    (rng) => {
      const k = rng.int(3, 24);
      const size = rng.pick([125, 150, 175, 240, 250, 320, 350, 450, 500, 750]);
      const total = k * size;
      const v = Q.of(total, 1000);
      return answered(
        [
          `Each ${item[0]} holds ${size} ${small[0]}. How many ${big[0]} do ${k} of them hold in all?`,
          `每个${item[1]}有 ${size} ${small[1]}。${k} 个一共有多少${big[1]}？`,
        ],
        v,
        [
          [
            ["Find the total", "求总量"],
            [`Multiply to find the total in ${small[0]}.`, `先用乘法求出以${small[1]}为单位的总量。`],
            [`${k} \\times ${size} = ${tex(total)}`],
          ],
          [
            ["Change to the larger unit", "换成大单位"],
            [
              `1,000 ${small[0]} make 1 ${big[0].replace(/s$/, "")}, so move the decimal point 3 places to the left.`,
              `1,000 ${small[1]}是 1 ${big[1]}，所以小数点向左移动 3 位。`,
            ],
            [`${tex(total)} \\div 1{,}000 = ${dec(v)}`],
          ],
        ],
        [
          `Change back: $${dec(v)} \\times 1{,}000 = ${tex(total)}$ ${small[0]}.`,
          `换回去：$${dec(v)} \\times 1{,}000 = ${tex(total)}$ ${small[1]}。`,
        ],
        [
          [Q.of(total, 100), "That moves the decimal point only 2 places.", "这是小数点只移了 2 位。"],
          [Q.of(total, 10000), "That moves the decimal point 4 places, one too many.", "这是小数点移了 4 位，多移了一位。"],
          [Q.of(size, 1000), `That is just one ${item[0]}. There are ${k} of them.`, `这只是 1 个${item[1]}的量，一共有 ${k} 个。`],
        ],
        { form: "decimal" },
      );
    },
    figure,
  );

/** totalVolumeInLiters writes the total of several equal bottles in liters. */
export const totalVolumeInLiters = totalInLarger(
  "total-volume-in-liters",
  ["A total volume in liters", "以升为单位的总容积"],
  ["bottle", "瓶子"],
  ["milliliters", "毫升"],
  ["liters", "升"],
  [
    "Each bottle holds 250 mL, and there are 6 bottles. In all that is $6 \\times 250 = 1{,}500$ mL, and $1{,}500 \\div 1{,}000 = 1.5$ L.\n\nCheck: 4 bottles make 1,000 mL, which is 1 L. The other 2 bottles make 500 mL, which is 0.5 L. So $1 + 0.5 = 1.5$ L.\n\n> **Watch out.** Find the total first. 250 mL is only one bottle.",
    "每瓶装 250 毫升，一共 6 瓶。总共是 $6 \\times 250 = 1{,}500$ 毫升，$1{,}500 \\div 1{,}000 = 1.5$ 升。\n\n检验：4 瓶是 1,000 毫升，也就是 1 升。另外 2 瓶是 500 毫升，也就是 0.5 升。所以 $1 + 0.5 = 1.5$ 升。\n\n> **注意。** 先求总量。250 毫升只是 1 瓶的量。",
  ],
  equalTape(6, "250", "1,500"),
);

/** totalMassInKilograms writes the total of several equal bags in kilograms. */
export const totalMassInKilograms = totalInLarger(
  "total-mass-in-kilograms",
  ["A total mass in kilograms", "以千克为单位的总质量"],
  ["small bag", "小袋"],
  ["grams", "克"],
  ["kilograms", "千克"],
  [
    "Each small bag of rice is 450 g, and there are 4 bags. In all that is $4 \\times 450 = 1{,}800$ g, and $1{,}800 \\div 1{,}000 = 1.8$ kg.\n\nCheck: 450 g is 0.45 kg, and $0.45 + 0.45 + 0.45 + 0.45 = 1.8$ kg.\n\n> **Watch out.** 1,800 g is 1.8 kg, not 18 kg. Move the decimal point 3 places.",
    "每小袋米重 450 克，一共 4 袋。总共是 $4 \\times 450 = 1{,}800$ 克，$1{,}800 \\div 1{,}000 = 1.8$ 千克。\n\n检验：450 克是 0.45 千克，$0.45 + 0.45 + 0.45 + 0.45 = 1.8$ 千克。\n\n> **注意。** 1,800 克是 1.8 千克，不是 18 千克。小数点要移 3 位。",
  ],
  equalTape(4, "450", "1,800"),
);

/** clock writes a time on a clock as h:mm. */
const clock = (h: number, mins: number) => `${h}:${String(mins).padStart(2, "0")}`;

/** elapsedMinutesAcrossHours finds the minutes between two times in different hours. */
export const elapsedMinutesAcrossHours = point(
  "elapsed-minutes-across-hours",
  ["Elapsed minutes across hours", "跨小时的经过分钟数"],
  [
    "A film starts at 2:40 and ends at 4:15. From 2:40 to 3:00 is 20 minutes, from 3:00 to 4:00 is 60 minutes, and from 4:00 to 4:15 is 15 minutes. So it lasts $20 + 60 + 15 = 95$ minutes.\n\nCheck: 2:40 is $2 \\times 60 + 40 = 160$ minutes after 12:00, and 4:15 is $4 \\times 60 + 15 = 255$. Then $255 - 160 = 95$.\n\n> **Watch out.** An hour is 60 minutes, not 100. Do not subtract 240 from 415.",
    "一部电影 2:40 开始，4:15 结束。从 2:40 到 3:00 是 20 分钟，从 3:00 到 4:00 是 60 分钟，从 4:00 到 4:15 是 15 分钟。所以一共 $20 + 60 + 15 = 95$ 分钟。\n\n检验：2:40 是 12:00 之后 $2 \\times 60 + 40 = 160$ 分钟，4:15 是 $4 \\times 60 + 15 = 255$ 分钟。$255 - 160 = 95$。\n\n> **注意。** 1 小时是 60 分钟，不是 100 分钟。不能用 415 减 240。",
  ],
  (rng) => {
    const h1 = rng.int(1, 6);
    const m1 = rng.int(10, 55);
    const answer = rng.int(70, 200);
    const start = 60 * h1 + m1;
    const end = start + answer;
    const [h2, m2] = [Math.floor(end / 60), end % 60];
    const toHour = 60 - m1;
    const hours = h2 - h1 - 1;
    return answered(
      [
        `A film starts at ${clock(h1, m1)} and ends at ${clock(h2, m2)} on the same afternoon. How many minutes long is it?`,
        `一部电影下午 ${clock(h1, m1)} 开始，同一个下午 ${clock(h2, m2)} 结束。它有多少分钟长？`,
      ],
      answer,
      [
        [
          ["Change each time to minutes", "把时刻换成分钟数"],
          ["Count the minutes after 12:00: hours times 60, plus the minutes.", "算出 12:00 之后的分钟数：小时数乘 60，再加分钟数。"],
          [`${h1} \\times 60 + ${m1} = ${start}`, `${h2} \\times 60 + ${m2} = ${end}`],
        ],
        [
          ["Subtract", "相减"],
          ["The film lasts from the first count to the second.", "电影从第一个时刻放到第二个时刻。"],
          [`${end} - ${start} = ${answer}`],
        ],
      ],
      hours === 0
        ? [
            `Count on: ${toHour} minutes to ${clock(h2, 0)}, then ${m2} minutes. $${toHour} + ${m2} = ${answer}$.`,
            `往后数：到 ${clock(h2, 0)} 是 ${toHour} 分钟，再加 ${m2} 分钟。$${toHour} + ${m2} = ${answer}$。`,
          ]
        : [
            `Count on: ${toHour} minutes to ${clock(h1 + 1, 0)}, then ${60 * hours} minutes to ${clock(h2, 0)}, then ${m2} minutes. $${toHour} + ${60 * hours} + ${m2} = ${answer}$.`,
            `往后数：到 ${clock(h1 + 1, 0)} 是 ${toHour} 分钟，再到 ${clock(h2, 0)} 是 ${60 * hours} 分钟，再加 ${m2} 分钟。$${toHour} + ${60 * hours} + ${m2} = ${answer}$。`,
          ],
      [
        [
          100 * (h2 - h1) + m2 - m1,
          "That subtracts the times like whole numbers, as if an hour were 100 minutes.",
          "这是把时刻当成整数相减，好像 1 小时是 100 分钟。",
        ],
        [Math.abs(m2 - m1), "That compares only the minutes and leaves out the hours.", "这是只比较了分钟数，漏掉了小时。"],
        [answer + 60, "That counts one hour too many.", "这是多算了 1 小时。"],
        [answer - 60, "That counts one hour too few.", "这是少算了 1 小时。"],
      ],
    );
  },
  lineFigure(
    {
      lo: 160,
      hi: 255,
      step: 5,
      labels: [160, 180, 240, 255],
      marks: [{ at: 160 }, { at: 255, result: true }],
      jumps: [
        [160, 180],
        [180, 240],
        [240, 255],
      ],
    },
    [
      "A number line of minutes after 12:00 with jumps from 160 to 180, from 180 to 240 and from 240 to 255.",
      "一条表示 12:00 之后分钟数的数轴，从 160 跳到 180，从 180 跳到 240，再从 240 跳到 255。",
    ],
  ),
);

/** comparingTwoColumnsOfALinePlot compares the totals of two columns of a line plot. */
export const comparingTwoColumnsOfALinePlot = point(
  "comparing-two-columns-of-a-line-plot",
  ["Comparing two columns", "比较两列"],
  [
    "A line plot has 2 dots above $\\frac{1}{4}$ pound and 3 dots above $\\frac{3}{4}$ pound. The first column is $2 \\times \\frac{1}{4} = \\frac{2}{4}$ pound. The second is $3 \\times \\frac{3}{4} = \\frac{9}{4}$ pounds. They are $\\frac{9}{4} - \\frac{2}{4} = \\frac{7}{4}$ pounds apart.\n\nCheck: $\\frac{2}{4} + \\frac{7}{4} = \\frac{9}{4}$.\n\n> **Watch out.** Compare the column totals, not just the numbers of dots.",
    "线图中 $\\frac{1}{4}$ 磅上方有 2 个点，$\\frac{3}{4}$ 磅上方有 3 个点。第一列是 $2 \\times \\frac{1}{4} = \\frac{2}{4}$ 磅，第二列是 $3 \\times \\frac{3}{4} = \\frac{9}{4}$ 磅。两列相差 $\\frac{9}{4} - \\frac{2}{4} = \\frac{7}{4}$ 磅。\n\n检验：$\\frac{2}{4} + \\frac{7}{4} = \\frac{9}{4}$。\n\n> **注意。** 要比较每列的总量，不是只比较点的个数。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    let c = rng.int(1, 8);
    if (3 * c === a) c += 1;
    const [one, three] = [Q.of(a, 4), Q.of(3 * c, 4)];
    const answer = Q.of(Math.abs(3 * c - a), 4);
    const [big, small] = 3 * c > a ? [three, one] : [one, three];
    return answered(
      [
        `A line plot has ${a} dot${a > 1 ? "s" : ""} above $\\frac{1}{4}$ pound and ${c} dot${c > 1 ? "s" : ""} above $\\frac{3}{4}$ pound. How many pounds apart are the totals of these two columns?`,
        `线图中 $\\frac{1}{4}$ 磅上方有 ${a} 个点，$\\frac{3}{4}$ 磅上方有 ${c} 个点。这两列的总量相差多少磅？`,
      ],
      answer,
      [
        [
          ["Find each column", "求每列的总量"],
          ["Multiply the value by the number of dots.", "用值乘点的个数。"],
          [`${a} \\times \\frac{1}{4} = \\frac{${a}}{4}`, `${c} \\times \\frac{3}{4} = \\frac{${3 * c}}{4}`],
        ],
        [
          ["Subtract", "相减"],
          ["Take the smaller total from the larger.", "用大的总量减小的总量。"],
          [`\\frac{${big.mul(Q.of(4)).toString()}}{4} - \\frac{${small.mul(Q.of(4)).toString()}}{4} = ${mixedLatex(answer)}`],
        ],
      ],
      [
        `Add back: $\\frac{${small.mul(Q.of(4)).toString()}}{4} + ${mixedLatex(answer)} = ${mixedLatex(big)}$.`,
        `加回去：$\\frac{${small.mul(Q.of(4)).toString()}}{4} + ${mixedLatex(answer)} = ${mixedLatex(big)}$。`,
      ],
      [
        [one.add(three), "That adds the two columns. The question asks how far apart they are.", "这是把两列相加了。题目问的是相差多少。"],
        [Q.of(Math.abs(c - a)), "That compares only the numbers of dots.", "这是只比较了点的个数。"],
        [
          Q.of(1, 2),
          "That compares only the values $\\frac{1}{4}$ and $\\frac{3}{4}$, not the totals.",
          "这是只比较了 $\\frac{1}{4}$ 和 $\\frac{3}{4}$ 两个值，不是总量。",
        ],
      ],
      {
        form: "mixed",
        figure: {
          svg: fractionPlot([...Array(a).fill(1), ...Array(c).fill(3)], 4, 0, 4),
          alt: t("A line plot in pounds, marked in fourths.", "以磅为单位的线图，刻度是四分之一。"),
        },
      },
    );
  },
  {
    svg: fractionPlot([1, 1, 3, 3, 3], 4, 0, 4),
    alt: t("A line plot with 2 dots at 1/4 and 3 dots at 3/4.", "线图上 1/4 处有 2 个点，3/4 处有 3 个点。"),
  },
);

/** distanceAlongAGridLine finds the distance between two points that share a coordinate. */
export const distanceAlongAGridLine = point(
  "distance-along-a-grid-line",
  ["Distance along a grid line", "沿网格线的距离"],
  [
    "The points $(4, 2)$ and $(4, 9)$ both have $x = 4$, so they lie on one up-and-down line. The distance is $9 - 2 = 7$.\n\nCheck: count up from 2 to 9: 3, 4, 5, 6, 7, 8, 9. That is 7 steps.\n\n> **Watch out.** The shared coordinate, 4, is not the distance.",
    "点 $(4, 2)$ 和 $(4, 9)$ 的 $x$ 都是 4，所以在同一条竖直线上。距离是 $9 - 2 = 7$。\n\n检验：从 2 数到 9：3、4、5、6、7、8、9，一共 7 步。\n\n> **注意。** 相同的那个坐标 4 不是距离。",
  ],
  (rng) => {
    const s = rng.int(1, 15);
    const lo = rng.int(0, 10);
    const hi = lo + rng.int(1, 12);
    const vertical = rng.bool();
    const p = vertical ? `(${s}, ${lo})` : `(${lo}, ${s})`;
    const q = vertical ? `(${s}, ${hi})` : `(${hi}, ${s})`;
    return answered(
      [`How many units apart are the points $${p}$ and $${q}$?`, `点 $${p}$ 和 $${q}$ 相距多少个单位？`],
      hi - lo,
      [
        [
          ["Find the shared coordinate", "找相同的坐标"],
          [
            `Both points have ${vertical ? "$x$" : "$y$"} $= ${s}$, so they lie on one grid line.`,
            `两点的 ${vertical ? "$x$" : "$y$"} 都是 ${s}，所以在同一条网格线上。`,
          ],
        ],
        [
          ["Subtract the other coordinates", "另一个坐标相减"],
          ["Take the smaller from the larger.", "用大数减小数。"],
          [`${hi} - ${lo} = ${hi - lo}`],
        ],
      ],
      [`Add back: $${lo} + ${hi - lo} = ${hi}$.`, `加回去：$${lo} + ${hi - lo} = ${hi}$。`],
      [
        [hi + lo, "That adds the coordinates. Subtract them.", "这是把坐标相加了，应该相减。"],
        [hi, "That uses only one point. Subtract the other point's coordinate.", "这只用了一个点，还要减去另一个点的坐标。"],
        [s, "That is the shared coordinate, not the distance.", "这是相同的那个坐标，不是距离。"],
      ],
    );
  },
  grid(
    [
      { kind: "point", at: [4, 2], label: "A", accent: true },
      { kind: "point", at: [4, 9], label: "B", accent: true },
    ],
    "Points A at (4, 2) and B at (4, 9) on one vertical line.",
    "同一条竖直线上的点 A (4, 2) 和点 B (4, 9)。",
  ),
);

/** theAreaOfARectangleFromItsCorners finds the area or perimeter of a rectangle from two opposite corners. */
export const theAreaOfARectangleFromItsCorners = point(
  "the-area-of-a-rectangle-from-its-corners",
  ["The area of a rectangle from its corners", "由顶点坐标求长方形面积"],
  [
    "A rectangle has opposite corners at $(1, 2)$ and $(6, 5)$. Its width is $6 - 1 = 5$ and its height is $5 - 2 = 3$. So the area is $5 \\times 3 = 15$ squares, and the perimeter is $5 + 3 + 5 + 3 = 16$.\n\nCheck: count the squares row by row. There are 3 rows of 5, and $5 + 5 + 5 = 15$.\n\n> **Watch out.** Do not multiply the corner coordinates $6 \\times 5$. Subtract to get the sides first.",
    "一个长方形相对的两个顶点在 $(1, 2)$ 和 $(6, 5)$。宽是 $6 - 1 = 5$，高是 $5 - 2 = 3$。所以面积是 $5 \\times 3 = 15$ 个方格，周长是 $5 + 3 + 5 + 3 = 16$。\n\n检验：一行一行地数方格。有 3 行，每行 5 个，$5 + 5 + 5 = 15$。\n\n> **注意。** 不要用顶点坐标相乘 $6 \\times 5$。要先相减求出边长。",
  ],
  (rng) => {
    const x1 = rng.int(0, 9);
    const y1 = rng.int(0, 9);
    const w = rng.int(2, 12);
    const h = rng.pick([...Array(11).keys()].map((i) => i + 2).filter((v) => v !== w));
    const asksArea = rng.bool();
    const answer = asksArea ? w * h : 2 * (w + h);
    return answered(
      [
        `A rectangle with sides along the grid lines has opposite corners at $(${x1}, ${y1})$ and $(${x1 + w}, ${y1 + h})$. What is its ${asksArea ? "area" : "perimeter"}?`,
        `一个边沿网格线的长方形，相对的两个顶点是 $(${x1}, ${y1})$ 和 $(${x1 + w}, ${y1 + h})$。它的${asksArea ? "面积" : "周长"}是多少？`,
      ],
      answer,
      [
        [
          ["Find the sides", "求边长"],
          ["Subtract the $x$-coordinates for the width and the $y$-coordinates for the height.", "$x$ 坐标相减得宽，$y$ 坐标相减得高。"],
          [`${x1 + w} - ${x1} = ${w}`, `${y1 + h} - ${y1} = ${h}`],
        ],
        asksArea
          ? [["Multiply", "相乘"], ["The area is width times height.", "面积等于宽乘高。"], [`${w} \\times ${h} = ${answer}`]]
          : [
              ["Add all four sides", "四条边相加"],
              ["The perimeter goes all the way around.", "周长是绕一圈的长度。"],
              [`2 \\times (${w} + ${h}) = ${answer}`],
            ],
      ],
      asksArea
        ? [
            `Count by rows: ${h} rows of ${w} squares is $${h} \\times ${w} = ${answer}$.`,
            `按行数：${h} 行，每行 ${w} 个方格，$${h} \\times ${w} = ${answer}$。`,
          ]
        : [
            `Add the sides one by one: $${w} + ${h} + ${w} + ${h} = ${answer}$.`,
            `一条一条边相加：$${w} + ${h} + ${w} + ${h} = ${answer}$。`,
          ],
      [
        [
          asksArea ? 2 * (w + h) : w * h,
          asksArea ? "That is the perimeter, not the area." : "That is the area, not the perimeter.",
          asksArea ? "这是周长，不是面积。" : "这是面积，不是周长。",
        ],
        [w + h, "That adds the width and height once.", "这是把宽和高只加了一次。"],
        [
          (x1 + w) * (y1 + h),
          "That multiplies the corner's coordinates. Subtract to get the sides first.",
          "这是把顶点坐标相乘了。要先相减求边长。",
        ],
      ],
    );
  },
  grid(
    [
      { kind: "point", at: [1, 2], label: "A" },
      { kind: "point", at: [6, 5], label: "C", accent: true },
      {
        kind: "polygon",
        points: [
          [1, 2],
          [6, 2],
          [6, 5],
          [1, 5],
        ],
      },
    ],
    "A rectangle with corners A at (1, 2) and C at (6, 5).",
    "顶点 A 在 (1, 2)、C 在 (6, 5) 的长方形。",
  ),
);

/** theAreaOfARectangleOnAMap finds how many grid squares a rectangle on a map covers. */
export const theAreaOfARectangleOnAMap = point(
  "the-area-of-a-rectangle-on-a-map",
  ["The area of a rectangle on a map", "地图上长方形的面积"],
  [
    "A park on a map has corners at $(2, 1)$ and $(7, 4)$. It is $7 - 2 = 5$ squares wide and $4 - 1 = 3$ squares tall, so it covers $5 \\times 3 = 15$ squares.\n\nCheck: 3 rows of 5 squares: $5 + 5 + 5 = 15$.\n\n> **Watch out.** $7 \\times 4 = 28$ counts squares from the origin, not the park.",
    "地图上一个公园的两个角在 $(2, 1)$ 和 $(7, 4)$。它宽 $7 - 2 = 5$ 格，高 $4 - 1 = 3$ 格，所以占 $5 \\times 3 = 15$ 个方格。\n\n检验：3 行，每行 5 格：$5 + 5 + 5 = 15$。\n\n> **注意。** $7 \\times 4 = 28$ 是从原点开始数的方格，不是公园的。",
  ],
  (rng) => {
    const [x1, y1] = [rng.int(1, 9), rng.int(1, 9)];
    const [w, h] = [rng.int(2, 12), rng.int(2, 12)];
    const [x2, y2] = [x1 + w, y1 + h];
    const answer = w * h;
    return answered(
      [
        `A park on a map is a rectangle with opposite corners at $(${x1}, ${y1})$ and $(${x2}, ${y2})$. Its sides follow the grid lines. How many grid squares does it cover?`,
        `地图上的一个公园是长方形，相对的两个角在 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$，边沿着网格线。它占多少个方格？`,
      ],
      answer,
      [
        [
          ["Find the sides", "求边长"],
          ["Subtract the coordinates.", "坐标相减。"],
          [`${x2} - ${x1} = ${w}`, `${y2} - ${y1} = ${h}`],
        ],
        [["Multiply", "相乘"], ["Squares covered are width times height.", "占的方格数等于宽乘高。"], [`${w} \\times ${h} = ${answer}`]],
      ],
      [
        `Count by rows: ${h} rows of ${w} is $${h} \\times ${w} = ${answer}$ squares.`,
        `按行数：${h} 行，每行 ${w} 格，$${h} \\times ${w} = ${answer}$ 个方格。`,
      ],
      [
        [
          x2 * y2,
          "That multiplies the far corner's coordinates, which counts from the origin.",
          "这是把远处那个角的坐标相乘，是从原点开始数的。",
        ],
        [2 * (w + h), "That is the distance around the park, not the squares inside.", "这是公园一周的长度，不是里面的方格数。"],
        [w + h, "That adds the sides instead of multiplying.", "这是把边长相加了，应该相乘。"],
        [x1 * y1 + answer, "That adds squares from the origin to the first corner.", "这是多加了从原点到第一个角的方格。"],
      ],
    );
  },
  grid(
    [
      {
        kind: "polygon",
        points: [
          [2, 1],
          [7, 1],
          [7, 4],
          [2, 4],
        ],
      },
    ],
    "A park drawn as a rectangle from (2, 1) to (7, 4) on a map.",
    "地图上从 (2, 1) 到 (7, 4) 的长方形公园。",
  ),
);

/** theMatchingTermOfAnotherPattern finds a term of the smaller pattern from the matching term of the larger. */
export const theMatchingTermOfAnotherPattern = point(
  "the-matching-term-of-another-pattern",
  ["The matching term of another pattern", "另一个数列的对应项"],
  [
    "A adds 3 and B adds 12, so each term of B is $12 \\div 3 = 4$ times A's. When B is 60, A is $60 \\div 4 = 15$.\n\nCheck: $4 \\times 15 = 60$.\n\n> **Watch out.** Going from B back to A, divide by 4. Multiplying makes the number bigger, but A's terms are smaller.",
    "A 每次加 3，B 每次加 12，所以 B 的每一项是 A 的 $12 \\div 3 = 4$ 倍。当 B 是 60 时，A 是 $60 \\div 4 = 15$。\n\n检验：$4 \\times 15 = 60$。\n\n> **注意。** 从 B 求 A 要除以 4。乘 4 会更大，可 A 的项比较小。",
  ],
  (rng) => {
    const a = rng.int(2, 6);
    const k = rng.int(2, 6);
    const steps = rng.int(4, 40);
    const term = a * k * steps;
    const answer = a * steps;
    return answered(
      [
        `Pattern A starts at 0 and adds ${a} each time. Pattern B starts at 0 and adds ${a * k} each time. When a term of B is ${term}, what is the matching term of A?`,
        `数列 A 从 0 开始，每次加 ${a}。数列 B 从 0 开始，每次加 ${a * k}。当 B 的一项是 ${term} 时，A 的对应项是多少？`,
      ],
      answer,
      [
        [["Find the factor", "求倍数"], ["Compare the steps.", "比较每次加的数。"], [`${a * k} \\div ${a} = ${k}`]],
        [["Divide", "做除法"], [`A's term is B's term divided by ${k}.`, `A 的项是 B 的项除以 ${k}。`], [`${term} \\div ${k} = ${answer}`]],
      ],
      [`Multiply back: $${k} \\times ${answer} = ${term}$.`, `乘回去：$${k} \\times ${answer} = ${term}$。`],
      [
        [term * k, `That multiplies by ${k}. A's terms are smaller, so divide.`, `这是乘了 ${k}。A 的项比较小，要用除法。`],
        [
          term - a * (k - 1),
          "That takes away one difference of steps. The terms differ by more and more.",
          "这是只减去了一次步长的差。两项的差越来越大。",
        ],
        [steps, "That is the number of steps, not A's term.", "这是加的次数，不是 A 的项。"],
      ],
    );
  },
  stepTapes(3, 4),
);

/** aFarTermOfARelatedPattern finds a far term of a pattern from its place in the list. */
export const aFarTermOfARelatedPattern = point(
  "a-far-term-of-a-related-pattern",
  ["A far term of a related pattern", "相关规律中很靠后的一项"],
  [
    "Pattern B starts at 0 and adds 6. The 20th term comes after 19 steps, so it is $19 \\times 6 = 114$.\n\nCheck: pattern A adds 2 and its 20th term is $19 \\times 2 = 38$. B is 3 times A, and $3 \\times 38 = 114$.\n\n> **Watch out.** The first term is 0, so the 20th term has 19 steps, not 20.",
    "规律 B 从 0 开始，每次加 6。第 20 项是加了 19 次，所以是 $19 \\times 6 = 114$。\n\n检验：规律 A 每次加 2，第 20 项是 $19 \\times 2 = 38$。B 是 A 的 3 倍，$3 \\times 38 = 114$。\n\n> **注意。** 第一项是 0，所以第 20 项只加了 19 次，不是 20 次。",
  ],
  (rng) => {
    const step = rng.int(2, 6);
    const times = rng.int(2, 6);
    const position = rng.int(12, 40);
    const big = step * times;
    const answer = (position - 1) * big;
    return answered(
      [
        `Pattern A starts at 0 and adds ${step} each time. Pattern B starts at 0 and adds ${big} each time. What is term number ${position} of pattern B?`,
        `规律 A 从 0 开始，每次加 ${step}。规律 B 从 0 开始，每次加 ${big}。规律 B 的第 ${position} 项是多少？`,
      ],
      answer,
      [
        [
          ["Count the steps", "数加了几次"],
          [
            `The first term is 0, so term ${position} comes after ${position - 1} steps.`,
            `第一项是 0，所以第 ${position} 项是加了 ${position - 1} 次。`,
          ],
        ],
        [["Multiply", "相乘"], [`Each step of B adds ${big}.`, `B 每次加 ${big}。`], [`${position - 1} \\times ${big} = ${answer}`]],
      ],
      [
        `Use pattern A: its term ${position} is $${position - 1} \\times ${step} = ${(position - 1) * step}$, and B is ${times} times A, so $${times} \\times ${(position - 1) * step} = ${answer}$.`,
        `用规律 A：它的第 ${position} 项是 $${position - 1} \\times ${step} = ${(position - 1) * step}$，B 是 A 的 ${times} 倍，$${times} \\times ${(position - 1) * step} = ${answer}$。`,
      ],
      [
        [position * big, `That takes ${position} steps, but the first term is 0.`, `这是加了 ${position} 次，可第一项是 0。`],
        [(position - 1) * step, "That is the term of pattern A.", "这是规律 A 的项。"],
        [position * times, `That multiplies the place number by ${times}.`, `这是用项的序号乘了 ${times}。`],
      ],
    );
  },
  stepTapes(2, 3),
);

/** aFarPointOnTheGraph finds the second coordinate of a far point of a graphed pattern. */
export const aFarPointOnTheGraph = point(
  "a-far-point-on-the-graph",
  ["A far point on the graph", "图像上较远的点"],
  [
    "The graph shows $(0, 0)$, $(1, 3)$ and $(2, 6)$. Each second coordinate is 3 times the first. When the first is 50, the second is $3 \\times 50 = 150$.\n\nCheck: 50 is 50 moves of 1 across, and 50 moves of 3 up is $50 \\times 3 = 150$.\n\n> **Watch out.** Do not add 3 to 50. The second coordinate is a multiple of the first.",
    "图上有点 $(0, 0)$、$(1, 3)$、$(2, 6)$。每个点的第二个坐标都是第一个的 3 倍。当第一个坐标是 50 时，第二个是 $3 \\times 50 = 150$。\n\n检验：50 是横着移动 50 次 1，向上 50 次 3 是 $50 \\times 3 = 150$。\n\n> **注意。** 不是 50 加 3。第二个坐标是第一个坐标的倍数。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const k = rng.int(2, 6);
    const x = a * rng.int(11, 60);
    return answered(
      [
        `A graph shows the points $(0, 0)$, $(${a}, ${a * k})$ and $(${2 * a}, ${2 * a * k})$, formed from two patterns. If the patterns continue, what is the second coordinate when the first is ${x}?`,
        `一个图像显示由两个数列得到的点 $(0, 0)$、$(${a}, ${a * k})$ 和 $(${2 * a}, ${2 * a * k})$。如果数列继续下去，第一个坐标是 ${x} 时，第二个坐标是多少？`,
      ],
      x * k,
      [
        [
          ["Find the rule", "找出规则"],
          ["Divide the second coordinate by the first.", "用第二个坐标除以第一个坐标。"],
          [`${a * k} \\div ${a} = ${k}`],
        ],
        [
          ["Use the rule", "用规则计算"],
          [`The second coordinate is ${k} times the first.`, `第二个坐标是第一个的 ${k} 倍。`],
          [`${k} \\times ${x} = ${x * k}`],
        ],
      ],
      [
        `Count the moves: ${x} is $${x / a}$ moves of ${a} across, and $${x / a} \\times ${a * k} = ${x * k}$.`,
        `数移动次数：${x} 是横着移动 $${x / a}$ 次 ${a}，$${x / a} \\times ${a * k} = ${x * k}$。`,
      ],
      [
        [x + k, `That adds ${k} instead of multiplying by it.`, `这是加了 ${k}，应该乘 ${k}。`],
        [x + a * k, "That adds one move up instead of using the rule.", "这是只加了一次向上的移动，没有用规则。"],
        [x * a, `That multiplies by ${a}, the move across.`, `这是乘了横着移动的 ${a}。`],
      ],
    );
  },
  pointsGrid([
    [0, 0],
    [1, 3],
    [2, 6],
  ]),
);

/** theHeightFromACountOfCubes finds the height of a box from its number of cubes. */
export const theHeightFromACountOfCubes = point(
  "the-height-from-a-count-of-cubes",
  ["The height from a count of cubes", "由立方块个数求高"],
  [
    "A box 5 cubes long and 3 cubes wide holds 60 cubes. One layer is $5 \\times 3 = 15$ cubes, so there are $60 \\div 15 = 4$ layers. The box is 4 cubes high.\n\nCheck: $5 \\times 3 \\times 4 = 60$.\n\n> **Watch out.** Divide by one whole layer, 15, not by 5 or by 3 alone.",
    "一个盒子长 5 个、宽 3 个立方块，装了 60 个。一层是 $5 \\times 3 = 15$ 个，所以有 $60 \\div 15 = 4$ 层。盒子高 4 个立方块。\n\n检验：$5 \\times 3 \\times 4 = 60$。\n\n> **注意。** 要除以一整层的 15，不是只除以 5 或 3。",
  ],
  (rng) => {
    const [l, w] = [rng.int(2, 12), rng.int(2, 9)];
    const answer = rng.int(2, 12);
    const total = l * w * answer;
    return answered(
      [
        `A box ${l} cubes long and ${w} cubes wide is filled with ${total} unit cubes. How many cubes high is it?`,
        `一个盒子长 ${l} 个立方块，宽 ${w} 个立方块，装满了 ${total} 个单位立方块。它有多少个立方块高？`,
      ],
      answer,
      [
        [["Count one layer", "数一层"], ["One layer is length times width.", "一层是长乘宽。"], [`${l} \\times ${w} = ${l * w}`]],
        [["Divide", "做除法"], ["The number of layers is the height.", "层数就是高。"], [`${total} \\div ${l * w} = ${answer}`]],
      ],
      [`Multiply back: $${l} \\times ${w} \\times ${answer} = ${total}$.`, `乘回去：$${l} \\times ${w} \\times ${answer} = ${total}$。`],
      [
        [Q.of(total, l), "That divides by the length only. Divide by a whole layer.", "这是只除以了长。要除以一整层。"],
        [Q.of(total, w), "That divides by the width only. Divide by a whole layer.", "这是只除以了宽。要除以一整层。"],
        [total - l - w, "That subtracts the edges instead of dividing.", "这是减去了棱长，应该用除法。"],
        [l * w, "That is the cubes in one layer, not the number of layers.", "这是一层的个数，不是层数。"],
      ],
    );
  },
  cubesFigure(5, 3, 4),
);

/** convertingSquareAndCubicUnits converts an area or a volume between a larger and a smaller unit. */
export const convertingSquareAndCubicUnits = point(
  "converting-square-and-cubic-units",
  ["Converting square and cubic units", "换算平方单位和立方单位"],
  [
    "1 yd is 3 ft. A square yard is 3 ft by 3 ft, so it holds $3 \\times 3 = 9$ square feet. A cubic yard holds $3 \\times 3 \\times 3 = 27$ cubic feet.\n\nCheck: draw the square yard. It has 3 rows of 3 small squares, which is 9.\n\n> **Watch out.** 1 square yard is not 3 square feet. Use the 3 once for each direction.",
    "1 码是 3 英尺。1 平方码是 3 英尺乘 3 英尺，所以有 $3 \\times 3 = 9$ 平方英尺。1 立方码有 $3 \\times 3 \\times 3 = 27$ 立方英尺。\n\n检验：画出 1 平方码，它有 3 行，每行 3 个小正方形，共 9 个。\n\n> **注意。** 1 平方码不是 3 平方英尺。每个方向都要用一次 3。",
  ],
  (rng) => {
    const [big, small, bigZh, smallZh, factor] = rng.pick([
      ["m", "cm", "米", "厘米", 100],
      ["cm", "mm", "厘米", "毫米", 10],
      ["ft", "in", "英尺", "英寸", 12],
      ["yd", "ft", "码", "英尺", 3],
    ]) as [string, string, string, string, number];
    const power = rng.pick([2, 3]);
    const scale = factor ** power;
    const n = rng.int(2, 40);
    const nameEn = power === 2 ? "area" : "volume";
    const nameZh = power === 2 ? "面积" : "体积";
    const unitBig = `\\text{${big}}^{${power}}`;
    const unitSmall = `\\text{${small}}^{${power}}`;
    const subjectEn = power === 2 ? "A region has" : "A tank has";
    const subjectZh = power === 2 ? "一块区域" : "一个水箱";
    const chain = Array.from({ length: power }, () => String(factor)).join(" \\times ");
    const scaleStep: Walk = [
      ["Find the factor", "求进率"],
      [
        `1 ${big} is ${tex(factor)} ${small}, and a ${power === 2 ? "square has two" : "cube has three"} directions.`,
        `1 ${bigZh}是 ${tex(factor)} ${smallZh}，${power === 2 ? "正方形有两个" : "立方体有三个"}方向。`,
      ],
      [`${chain} = ${tex(scale)}`],
    ];
    if (rng.bool()) {
      const answer = n * scale;
      return answered(
        [
          `${subjectEn} ${nameEn} $${n} \\ ${unitBig}$. What is this ${nameEn} in $${unitSmall}$?`,
          `${subjectZh}的${nameZh}是 $${n} \\ ${unitBig}$。这个${nameZh}是多少 $${unitSmall}$？`,
        ],
        answer,
        [
          scaleStep,
          [
            ["Multiply", "相乘"],
            ["Smaller units give a larger number.", "换成小单位，数会变大。"],
            [`${n} \\times ${tex(scale)} = ${tex(answer)}`],
          ],
        ],
        [`Divide back: $${tex(answer)} \\div ${tex(scale)} = ${n}$.`, `除回去：$${tex(answer)} \\div ${tex(scale)} = ${n}$。`],
        [
          [n * factor, `That uses ${factor} only once. Use it once for each direction.`, `这是只用了一次 ${factor}。每个方向都要用一次。`],
          [
            n * factor ** (5 - power),
            `That uses ${factor} ${5 - power} times, but there are ${power} directions.`,
            `这是用了 ${5 - power} 次 ${factor}，可是只有 ${power} 个方向。`,
          ],
          [
            n * factor * power,
            `That multiplies by ${factor} and then by ${power}. Multiply by ${factor} ${power} times.`,
            `这是乘了 ${factor} 再乘 ${power}。应该连乘 ${power} 个 ${factor}。`,
          ],
        ],
      );
    }
    const start = n * scale;
    return answered(
      [
        `${subjectEn} ${nameEn} $${tex(start)} \\ ${unitSmall}$. What is this ${nameEn} in $${unitBig}$?`,
        `${subjectZh}的${nameZh}是 $${tex(start)} \\ ${unitSmall}$。这个${nameZh}是多少 $${unitBig}$？`,
      ],
      n,
      [
        scaleStep,
        [
          ["Divide", "做除法"],
          ["Larger units give a smaller number.", "换成大单位，数会变小。"],
          [`${tex(start)} \\div ${tex(scale)} = ${n}`],
        ],
      ],
      [`Multiply back: $${n} \\times ${tex(scale)} = ${tex(start)}$.`, `乘回去：$${n} \\times ${tex(scale)} = ${tex(start)}$。`],
      [
        [
          Q.of(start, factor),
          `That divides by ${factor} only once. Divide once for each direction.`,
          `这是只除了一次 ${factor}。每个方向都要除一次。`,
        ],
        [
          Q.of(start, factor ** (5 - power)),
          `That divides by ${factor} ${5 - power} times, but there are ${power} directions.`,
          `这是除了 ${5 - power} 次 ${factor}，可是只有 ${power} 个方向。`,
        ],
        [start * scale, "That multiplies. A larger unit gives a smaller number.", "这是用了乘法。换成大单位，数应该变小。"],
      ],
    );
  },
  captioned(
    areaGridFigure(
      ["1", "1", "1"],
      ["1", "1", "1"],
      [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    ),
    "A square yard cut into 3 rows of 3 square feet.",
    "1 平方码分成 3 行，每行 3 个 1 平方英尺。",
  ),
);

/** howVolumeGrowsWhenEdgesGrow finds the new volume of a box when its edges are multiplied. */
export const howVolumeGrowsWhenEdgesGrow = point(
  "how-volume-grows-when-edges-grow",
  ["How volume grows when edges grow", "棱长变大时体积如何变化"],
  [
    "A 1 by 1 by 1 cube has its edges doubled. The new cube is 2 by 2 by 2, so it holds $2 \\times 2 \\times 2 = 8$ small cubes. The volume is 8 times as large, not 2 times.\n\nCheck: the big cube has 2 layers of 4 small cubes, and $4 + 4 = 8$.\n\n> **Watch out.** Doubling only the height doubles the volume. Doubling every edge multiplies it by 8.",
    "把棱长为 1 的正方体的每条棱都扩大到 2 倍，新正方体是 2 乘 2 乘 2，能放 $2 \\times 2 \\times 2 = 8$ 个小正方体。体积是原来的 8 倍，不是 2 倍。\n\n检验：大正方体有 2 层，每层 4 个小正方体，$4 + 4 = 8$。\n\n> **注意。** 只把高扩大到 2 倍，体积是 2 倍；每条棱都扩大到 2 倍，体积是 8 倍。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const k = rng.int(2, 4);
    const all = rng.bool();
    const volume = a * b * c;
    const answer = all ? volume * k ** 3 : volume * k;
    return answered(
      [
        `A box has a volume of ${volume} cubic centimeters. ${all ? `Every edge is multiplied by ${k}.` : `Only its height is multiplied by ${k}.`} What is the new volume, in cubic centimeters?`,
        `一个盒子的体积是 ${volume} 立方厘米。${all ? `每条棱都乘以 ${k}。` : `只有高乘以 ${k}。`}新的体积是多少立方厘米？`,
      ],
      answer,
      all
        ? [
            [
              ["Count the directions", "数方向"],
              [
                `Length, width and height each grow ${k} times, so the volume grows ${k} times three times.`,
                `长、宽、高都扩大到 ${k} 倍，所以体积要乘三次 ${k}。`,
              ],
              [`${k} \\times ${k} \\times ${k} = ${k ** 3}`],
            ],
            [
              ["Multiply", "相乘"],
              [`The new volume is ${k ** 3} times as large.`, `新体积是原来的 ${k ** 3} 倍。`],
              [`${volume} \\times ${k ** 3} = ${tex(answer)}`],
            ],
          ]
        : [
            [
              ["One direction", "一个方向"],
              [`Only the height grows, so the box is ${k} times as many layers.`, `只有高变大，所以层数变成 ${k} 倍。`],
              [`${volume} \\times ${k} = ${tex(answer)}`],
            ],
          ],
      all
        ? [
            `Use edges: a box ${a} by ${b} by ${c} becomes ${a * k} by ${b * k} by ${c * k}, and $${a * k} \\times ${b * k} \\times ${c * k} = ${tex(answer)}$.`,
            `用棱长算：${a} 乘 ${b} 乘 ${c} 的盒子变成 ${a * k} 乘 ${b * k} 乘 ${c * k}，$${a * k} \\times ${b * k} \\times ${c * k} = ${tex(answer)}$。`,
          ]
        : [
            `Use edges: a box ${a} by ${b} by ${c} becomes ${a} by ${b} by ${c * k}, and $${a} \\times ${b} \\times ${c * k} = ${tex(answer)}$.`,
            `用棱长算：${a} 乘 ${b} 乘 ${c} 的盒子变成 ${a} 乘 ${b} 乘 ${c * k}，$${a} \\times ${b} \\times ${c * k} = ${tex(answer)}$。`,
          ],
      [
        [
          all ? volume * k : volume * k ** 3,
          all ? `That multiplies by ${k} once, but all three edges grew.` : `That multiplies by ${k} three times, but only one edge grew.`,
          all ? `这是只乘了一次 ${k}，可三条棱都变大了。` : `这是乘了三次 ${k}，可只有一条棱变大。`,
        ],
        [volume * k ** 2, `That multiplies by ${k} twice. A box has three directions.`, `这是乘了两次 ${k}。盒子有三个方向。`],
        [volume + k, `That adds ${k}. Growing edges multiply the volume.`, `这是加了 ${k}。棱长变大，体积要相乘。`],
      ],
    );
  },
  cubesFigure(2, 2, 2),
);

/** howManyCubesFillABox counts the whole cubes that fit inside a box. */
export const howManyCubesFillABox = point(
  "how-many-cubes-fill-a-box",
  ["How many cubes fill a box", "盒子能装多少个立方体"],
  [
    "A box is 7 cm by 4 cm by 6 cm. Cubes with 2 cm edges fit 3 along the 7 cm edge, with 1 cm left over. They fit 2 along 4 cm and 3 along 6 cm. So $3 \\times 2 \\times 3 = 18$ cubes fit.\n\nCheck: $3 \\times 2 = 6$ cm, the longest row that fits in 7 cm.\n\n> **Watch out.** Dividing the volumes gives 21, but the 1 cm gap cannot hold a whole cube.",
    "一个盒子长 7 厘米、宽 4 厘米、高 6 厘米。棱长 2 厘米的立方体沿 7 厘米能放 3 个，还剩 1 厘米；沿 4 厘米能放 2 个，沿 6 厘米能放 3 个。所以能放 $3 \\times 2 \\times 3 = 18$ 个。\n\n检验：$3 \\times 2 = 6$ 厘米，是 7 厘米里能放下的最长一排。\n\n> **注意。** 用体积相除得 21，可那 1 厘米的空隙放不下一个完整的立方体。",
  ],
  (rng) => {
    const s = rng.int(2, 5);
    const x = rng.int(2, 8);
    const y = rng.int(2, 8);
    const z = rng.int(2, 8);
    const extra = rng.int(1, s - 1);
    const a = x * s + extra;
    const b = y * s;
    const c = z * s;
    const answer = x * y * z;
    return answered(
      [
        `A box measures ${a} cm by ${b} cm by ${c} cm. How many whole cubes with edges of ${s} cm can be packed inside it?`,
        `一个盒子长 ${a} 厘米、宽 ${b} 厘米、高 ${c} 厘米。里面最多能放多少个棱长 ${s} 厘米的完整立方体？`,
      ],
      answer,
      [
        [
          ["Fit cubes along each edge", "沿每条棱放"],
          [`Divide each edge by ${s} and keep the whole cubes.`, `每条棱长除以 ${s}，只算完整的立方体。`],
          [`${a} \\div ${s} = ${x} \\text{ R } ${extra}`, `${b} \\div ${s} = ${y}`, `${c} \\div ${s} = ${z}`],
        ],
        [["Multiply", "相乘"], ["Multiply the three counts.", "把三个数相乘。"], [`${x} \\times ${y} \\times ${z} = ${answer}`]],
      ],
      [
        `The cubes take up $${x * s}$ cm of the ${a} cm edge, and ${extra} cm is less than ${s} cm, so one more cube does not fit.`,
        `立方体占了 ${a} 厘米中的 ${x * s} 厘米，剩下 ${extra} 厘米比 ${s} 厘米短，再放不下一个。`,
      ],
      [
        [
          (x + 1) * y * z,
          `That fits one more cube along the ${a} cm edge, but only ${extra} cm is left.`,
          `这是沿 ${a} 厘米的棱多放了一个，可只剩 ${extra} 厘米。`,
        ],
        [
          Math.floor((a * b * c) / s ** 3),
          "That divides the volumes. The gap along a wall cannot hold a whole cube.",
          "这是把体积相除了。靠墙的空隙放不下完整的立方体。",
        ],
        [
          Math.floor((a * b * c) / s),
          `That divides the volume by ${s}, not by the volume of a cube.`,
          `这是用体积除以 ${s}，不是除以一个立方体的体积。`,
        ],
        [x + y + z, "That adds the three counts. Multiply them.", "这是把三个数相加了，应该相乘。"],
      ],
    );
  },
  cubesFigure(3, 2, 3),
);

/** diagonalsFromOneVertex counts the diagonals from one vertex of a polygon and the triangles they make. */
export const diagonalsFromOneVertex = point(
  "diagonals-from-one-vertex",
  ["Diagonals from one vertex", "从一个顶点出发的对角线"],
  [
    "A hexagon has 6 vertices. From one vertex, you cannot draw to the vertex itself or to its 2 neighbors, since those are sides. So there are $6 - 3 = 3$ diagonals, and they cut the hexagon into 4 triangles.\n\nCheck: each of the 4 sides that do not touch the start vertex lies in one triangle, so there are 4 triangles.\n\n> **Watch out.** The two neighbors are joined by sides, not diagonals. Subtract 3, not 1.",
    "六边形有 6 个顶点。从一个顶点出发，不能连到它自己，也不能连到相邻的 2 个顶点，因为那些是边。所以有 $6 - 3 = 3$ 条对角线，它们把六边形分成 4 个三角形。\n\n检验：不经过出发顶点的边有 4 条，每条各在一个三角形里，所以有 4 个三角形。\n\n> **注意。** 和相邻顶点连的是边，不是对角线。要减 3，不是减 1。",
  ],
  (rng) => {
    const n = rng.int(4, 20);
    const asksTriangles = rng.bool();
    const answer = asksTriangles ? n - 2 : n - 3;
    const walk: Walk[] = [
      [
        ["Count the vertices", "数顶点"],
        [`A polygon with ${n} sides has ${n} vertices.`, `${n} 边形有 ${n} 个顶点。`],
      ],
      [
        ["Rule out three", "去掉三个"],
        ["A diagonal cannot go to the start vertex or to its 2 neighbors.", "对角线不能连到出发顶点和它相邻的 2 个顶点。"],
        [`${n} - 3 = ${n - 3}`],
      ],
    ];
    if (asksTriangles)
      walk.push([
        ["Count the triangles", "数三角形"],
        ["The diagonals make one more triangle than there are diagonals.", "三角形比对角线多 1 个。"],
        [`${n - 3} + 1 = ${n - 2}`],
      ]);
    return answered(
      [
        `A polygon has ${n} sides. All the diagonals are drawn from one vertex. ${asksTriangles ? "How many triangles are formed?" : "How many diagonals are drawn?"}`,
        `一个多边形有 ${n} 条边。从一个顶点画出所有的对角线。${asksTriangles ? "形成多少个三角形？" : "画了多少条对角线？"}`,
      ],
      answer,
      walk,
      asksTriangles
        ? [
            `Each side that does not touch the start vertex lies in one triangle, and there are $${n} - 2 = ${n - 2}$ such sides.`,
            `不经过出发顶点的每条边各在一个三角形里，这样的边有 $${n} - 2 = ${n - 2}$ 条。`,
          ]
        : [
            `Count the other way. There are $${n} - 1 = ${n - 1}$ other vertices, and 2 of them are neighbors, so $${n - 1} - 2 = ${n - 3}$.`,
            `换个方法数：其他顶点有 $${n} - 1 = ${n - 1}$ 个，其中 2 个相邻，所以 $${n - 1} - 2 = ${n - 3}$。`,
          ],
      [
        [n, "That counts every vertex, even the start and its neighbors.", "这是把所有顶点都算上了，包括出发顶点和相邻顶点。"],
        [
          n - 1,
          "That leaves out only the start vertex. Its 2 neighbors are joined by sides.",
          "这只去掉了出发顶点。相邻的 2 个顶点连的是边。",
        ],
        asksTriangles
          ? [n - 3, "That is the number of diagonals. There is one more triangle.", "这是对角线的条数。三角形还要多 1 个。"]
          : [n - 2, "That is the number of triangles. There is one fewer diagonal.", "这是三角形的个数。对角线要少 1 条。"],
      ],
      n <= 12 ? { figure: diagonalsFigure(n) } : {},
    );
  },
  diagonalsFigure(6),
);

/** theMissingAngleOfAQuadrilateral finds the fourth angle of a quadrilateral from the other three. */
export const theMissingAngleOfAQuadrilateral = point(
  "the-missing-angle-of-a-quadrilateral",
  ["The missing angle of a quadrilateral", "四边形中缺少的角"],
  [
    "Three angles of a quadrilateral are 90, 80 and 100 degrees. A diagonal cuts it into two triangles, so its angles add to $180 + 180 = 360$ degrees. The fourth angle is $360 - 90 - 80 - 100 = 90$ degrees.\n\nCheck: $90 + 80 + 100 + 90 = 360$.\n\n> **Watch out.** The angles of a quadrilateral add to 360 degrees. 180 degrees is for a triangle.",
    "四边形的三个角是 90 度、80 度和 100 度。一条对角线把它分成两个三角形，所以内角和是 $180 + 180 = 360$ 度。第四个角是 $360 - 90 - 80 - 100 = 90$ 度。\n\n检验：$90 + 80 + 100 + 90 = 360$。\n\n> **注意。** 四边形的内角和是 360 度，180 度是三角形的内角和。",
  ],
  (rng) => {
    const a = rng.int(65, 115);
    const b = rng.int(65, 115);
    const c = rng.int(65, 115);
    const d = 360 - a - b - c;
    return answered(
      [
        `Three angles of a quadrilateral measure $${a}^\\circ$, $${b}^\\circ$ and $${c}^\\circ$. What is the fourth angle, in degrees?`,
        `四边形的三个角分别是 $${a}^\\circ$、$${b}^\\circ$ 和 $${c}^\\circ$。第四个角是多少度？`,
      ],
      d,
      [
        [["Find the total", "求内角和"], ["A diagonal cuts it into two triangles.", "一条对角线把它分成两个三角形。"], ["180 + 180 = 360"]],
        [
          ["Subtract the known angles", "减去已知的角"],
          ["What is left is the fourth angle.", "剩下的就是第四个角。"],
          [`360 - ${a} - ${b} - ${c} = ${d}`],
        ],
      ],
      [`Add all four angles: $${a} + ${b} + ${c} + ${d} = 360$.`, `四个角相加：$${a} + ${b} + ${c} + ${d} = 360$。`],
      [
        [Math.abs(180 - a - b - c), "That uses 180, the total for a triangle.", "这用了 180，那是三角形的内角和。"],
        [a + b + c, "That is the sum of the three known angles.", "这是三个已知角的和。"],
        [360 - a - b, "That subtracts only two of the angles.", "这只减了两个角。"],
      ],
    );
  },
  fig(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [5, 0],
          [5.6, 3.2],
          [0.4, 3.6],
        ],
        accent: true,
      },
      { kind: "arc", vertex: [0, 0], from: [5, 0], to: [0.4, 3.6], label: "90°" },
      { kind: "arc", vertex: [5, 0], from: [5.6, 3.2], to: [0, 0], label: "80°" },
      { kind: "arc", vertex: [5.6, 3.2], from: [0.4, 3.6], to: [5, 0], label: "100°" },
      { kind: "arc", vertex: [0.4, 3.6], from: [0, 0], to: [5.6, 3.2], label: "?" },
    ],
    "A quadrilateral with angles of 90, 80 and 100 degrees and one unknown angle.",
    "一个四边形，三个角是 90 度、80 度、100 度，另一个角未知。",
  ),
);

/** aSquareWithTheSamePerimeter bends the wire of a rectangle into a square. */
export const aSquareWithTheSamePerimeter = point(
  "a-square-with-the-same-perimeter",
  ["A square with the same perimeter", "周长相同的正方形"],
  [
    "A wire is bent into a rectangle 8 cm long and 4 cm wide, so it is $2 \\times (8 + 4) = 24$ cm long. Bent into a square, each side is $24 \\div 4 = 6$ cm.\n\nCheck: the side of the square is halfway between 8 and 4, and $(8 + 4) \\div 2 = 6$.\n\n> **Watch out.** The wire keeps its length, so the perimeter stays the same. The area changes.",
    "一根铁丝弯成长 8 厘米、宽 4 厘米的长方形，所以铁丝长 $2 \\times (8 + 4) = 24$ 厘米。弯成正方形，每条边是 $24 \\div 4 = 6$ 厘米。\n\n检验：正方形的边长正好在 8 和 4 的中间，$(8 + 4) \\div 2 = 6$。\n\n> **注意。** 铁丝的长度不变，所以周长不变，但面积会变。",
  ],
  (rng) => {
    const side = rng.int(3, 25);
    const offset = rng.int(1, side - 1);
    const length = side + offset;
    const width = side - offset;
    const p = 4 * side;
    const asksArea = rng.bool();
    const walk: Walk[] = [
      [
        ["Find the wire's length", "求铁丝的长度"],
        ["The wire goes once around the rectangle.", "铁丝正好绕长方形一周。"],
        [`2 \\times (${length} + ${width}) = ${p}`],
      ],
      [["Find the side", "求边长"], ["The same wire makes four equal sides.", "同一根铁丝围成四条相等的边。"], [`${p} \\div 4 = ${side}`]],
    ];
    if (asksArea)
      walk.push([
        ["Find the area", "求面积"],
        ["Multiply the side by itself.", "边长乘边长。"],
        [`${side} \\times ${side} = ${side * side}`],
      ]);
    return answered(
      [
        `A wire is bent into a rectangle ${length} cm long and ${width} cm wide. It is then bent into a square. What is the ${asksArea ? "area of the square, in square centimeters" : "side of the square, in centimeters"}?`,
        `一根铁丝弯成长 ${length} 厘米、宽 ${width} 厘米的长方形，再弯成一个正方形。这个正方形的${asksArea ? "面积是多少平方厘米" : "边长是多少厘米"}？`,
      ],
      asksArea ? side * side : side,
      walk,
      [
        `The side of the square is halfway between the length and the width: $(${length} + ${width}) \\div 2 = ${side}$.`,
        `正方形的边长正好在长和宽的中间：$(${length} + ${width}) \\div 2 = ${side}$。`,
      ],
      asksArea
        ? [
            [
              length * width,
              "That is the area of the rectangle. Bending the wire changes the area.",
              "这是长方形的面积。弯成正方形后面积变了。",
            ],
            [p, "That is the perimeter, not the area.", "这是周长，不是面积。"],
            [side, "That is the side of the square, not its area.", "这是正方形的边长，不是面积。"],
          ]
        : [
            [length, "That is the length of the rectangle.", "这是长方形的长。"],
            [p, "That is the whole wire, all four sides.", "这是整根铁丝，是四条边的和。"],
            [length + width, "That is half the wire, two sides of the square.", "这是铁丝的一半，是正方形两条边的和。"],
          ],
    );
  },
  tapeFigure(
    [
      {
        pieces: [
          { size: 8, text: "8" },
          { size: 4, text: "4" },
          { size: 8, text: "8" },
          { size: 4, text: "4" },
        ],
      },
      {
        total: "24",
        pieces: [
          { size: 6, text: "6", lit: true },
          { size: 6, text: "6", lit: true },
          { size: 6, text: "6", lit: true },
          { size: 6, text: "6", lit: true },
        ],
      },
    ],
    [
      "One wire of 24 cm as the four sides of the rectangle and as four sides of 6 cm.",
      "同一根 24 厘米的铁丝，先是长方形的四条边，再是四条 6 厘米的边。",
    ],
  ),
);

/** regularShapes lists regular polygons with their side counts. */
const regularShapes: readonly [string, string, number][] = [
  ["square", "正方形", 4],
  ["regular pentagon", "正五边形", 5],
  ["regular hexagon", "正六边形", 6],
  ["regular octagon", "正八边形", 8],
  ["equilateral triangle", "等边三角形", 3],
];

/** aSideFromARegularPerimeter divides the perimeter of a regular polygon among its sides. */
export const aSideFromARegularPerimeter = point(
  "a-side-from-a-regular-perimeter",
  ["A side from a regular perimeter", "由正多边形的周长求边长"],
  [
    "A regular hexagon has a perimeter of 45.6 m. Its 6 sides are equal, so each is $45.6 \\div 6 = 7.6$ m.\n\nCheck: $7.6 \\times 6 = 45.6$.\n\n> **Watch out.** Divide by the number of sides. A hexagon has 6 and an octagon has 8.",
    "一个正六边形的周长是 45.6 米。它的 6 条边都相等，所以每条边是 $45.6 \\div 6 = 7.6$ 米。\n\n检验：$7.6 \\times 6 = 45.6$。\n\n> **注意。** 要除以边数。六边形有 6 条边，八边形有 8 条边。",
  ],
  (rng) => {
    const [en, zh, n] = rng.pick(regularShapes);
    const side = rng.int(11, 199);
    const perimeter = dec(Q.of(side * n, 10));
    const answer = Q.of(side, 10);
    return answered(
      [
        `${Art(en)} ${en} has a perimeter of $${perimeter}$ meters. How many meters long is each side?`,
        `一个${zh}的周长是 $${perimeter}$ 米。每条边长多少米？`,
      ],
      answer,
      [
        [
          ["Count the sides", "数边"],
          [`${Art(en)} ${en} has ${n} equal sides.`, `${zh}有 ${n} 条相等的边。`],
        ],
        [
          ["Divide", "做除法"],
          ["Share the perimeter among the sides.", "把周长平均分给各条边。"],
          [`${perimeter} \\div ${n} = ${dec(answer)}`],
        ],
      ],
      [`Multiply back: $${dec(answer)} \\times ${n} = ${perimeter}$.`, `乘回去：$${dec(answer)} \\times ${n} = ${perimeter}$。`],
      [
        [Q.of(side * n, 10 * (n + 1)), "That divides by one more than the number of sides.", "这是除以了比边数多 1 的数。"],
        [Q.of(side * n, 10 * (n - 1)), "That divides by one fewer than the number of sides.", "这是除以了比边数少 1 的数。"],
        [Q.of(side * n, 100), "That divides by 10, not by the number of sides.", "这是除以了 10，不是除以边数。"],
      ],
      {
        figure: fig(
          [{ kind: "polygon", points: regular(n), accent: true }],
          `A regular polygon with ${n} sides.`,
          `一个有 ${n} 条边的正多边形。`,
        ),
      },
    );
  },
  sideFigure(regular(6), ["7.6 m", undefined, undefined, undefined, undefined, undefined]),
);

/** oneRightAngleSettlesTheRest names a parallelogram from one angle and two adjacent sides. */
export const oneRightAngleSettlesTheRest = point(
  "one-right-angle-settles-the-rest",
  ["One right angle settles the rest", "一个直角决定其余的角"],
  [
    "Next to each other, the angles of a parallelogram add to 180 degrees. So if one angle is right, the next is $180 - 90 = 90$ degrees, and all four are right. The parallelogram is a rectangle.\n\nCheck: with sides of 5 cm and 5 cm next to each other, all four sides are equal, so it is a square.\n\n> **Watch out.** One right angle is enough. You do not need to be told about all four.",
    "平行四边形相邻的两个角加起来是 180 度。所以如果有一个直角，相邻的角就是 $180 - 90 = 90$ 度，四个角都是直角，它是长方形。\n\n检验：如果相邻两边都是 5 厘米，四条边都相等，它就是正方形。\n\n> **注意。** 有一个直角就够了，不需要告诉你四个角都是直角。",
  ],
  (rng) => {
    const a = rng.int(3, 20);
    const b = a + rng.int(1, 9);
    const angle = rng.int(40, 140);
    const unequal = angle === 90 ? 75 : angle;
    const right = rng.bool();
    const equal = rng.bool();
    const other = equal ? a : b;
    const kind: QuadKind = right ? (equal ? "square" : "rectangle") : equal ? "rhombus" : "parallelogram";
    const options: readonly QuadKind[] = ["square", "rectangle", "rhombus", "parallelogram"];
    const reason = (k: QuadKind): readonly [Pair, string, string] => {
      const needsRight = k === "square" || k === "rectangle";
      const needsEqual = k === "square" || k === "rhombus";
      if (needsRight && !right)
        return [
          kindPair(k),
          `${Art(k)} ${k} needs right angles, but these angles are ${unequal} and ${180 - unequal} degrees.`,
          `${quadNames[k]["zh-CN"]}要有直角，而这里的角是 ${unequal} 度和 ${180 - unequal} 度。`,
        ];
      if (needsEqual && !equal)
        return [
          kindPair(k),
          `${Art(k)} ${k} needs four equal sides, but ${a} and ${b} differ.`,
          `${quadNames[k]["zh-CN"]}要四条边相等，而 ${a} 和 ${b} 不相等。`,
        ];
      return wrongKind(k, kind);
    };
    return picked(
      rng,
      [
        `A parallelogram has ${right ? "a right angle" : `an angle of $${unequal}^\\circ$`} and adjacent sides of $${a}$ cm and $${other}$ cm. What is its most specific name?`,
        `一个平行四边形有${right ? "一个直角" : `一个 $${unequal}^\\circ$ 的角`}，相邻两边是 $${a}$ 厘米和 $${other}$ 厘米。它最准确的名称是什么？`,
      ],
      kindPair(kind),
      options.filter((k) => k !== kind).map(reason),
      [
        [
          ["Settle the angles", "确定角"],
          right
            ? ["Angles next to each other add to 180 degrees, so every angle is right.", "相邻两角和是 180 度，所以每个角都是直角。"]
            : [`The next angle is ${180 - unequal} degrees, so no angle is right.`, `相邻的角是 ${180 - unequal} 度，所以没有直角。`],
          [right ? "180 - 90 = 90" : `180 - ${unequal} = ${180 - unequal}`],
        ],
        [
          ["Compare the sides", "比较边"],
          equal
            ? [
                "Opposite sides are equal and the adjacent sides match, so all four sides are equal.",
                "对边相等，相邻两边也相等，所以四条边都相等。",
              ]
            : [
                `The adjacent sides are ${a} cm and ${b} cm, so the sides have two lengths.`,
                `相邻两边是 ${a} 厘米和 ${b} 厘米，边长有两种。`,
              ],
        ],
      ],
      quadBelow[kind],
      quadFigure(rng, kind),
    );
  },
  quadFigure(createRng(6), "rectangle"),
);
