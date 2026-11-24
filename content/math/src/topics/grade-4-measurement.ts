import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dotPlot, gcd, type Mark, type Point, Q, sketch, svgDocument } from "@ga/subject-math";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { mixedLatex } from "../problems.ts";
import { type Pair, picked, pickedMath, type Walk } from "./early-grades-more-kit.ts";
import { answered, lineFigure, point, tapeFigure } from "./upper-grades-kit.ts";

// 4th Grade Math: units of measure and conversions, line plots, and the geometry of points, lines and angles.

/** standards turns Common Core codes into standard ids. */
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

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

// ---------------------------------------------------------------------------
// Units

/** Kind is what a unit measures. */
type Kind = "length" | "mass" | "volume" | "time";

/** Unit is a unit of measure with its names, its short name, what it measures, its size in the smallest unit of its kind and an everyday thing about that size. */
interface Unit {
  readonly one: Text;
  readonly many: Text;
  readonly abbr: string;
  readonly kind: Kind;
  readonly size: number;
  readonly like: Text;
}

const unit = (oneEn: string, manyEn: string, zh: string, abbr: string, kind: Kind, size: number, likeEn: string, likeZh: string): Unit => ({
  one: t(oneEn, zh),
  many: t(manyEn, zh),
  abbr,
  kind,
  size,
  like: t(likeEn, likeZh),
});

const km = unit("kilometer", "kilometers", "千米", "km", "length", 1_000_000, "a walk of about 15 minutes", "步行大约 15 分钟的路程");
const m = unit("meter", "meters", "米", "m", "length", 1000, "one big step", "一大步");
const cm = unit("centimeter", "centimeters", "厘米", "cm", "length", 10, "the width of a fingertip", "一个指尖的宽度");
const mm = unit("millimeter", "millimeters", "毫米", "mm", "length", 1, "the thickness of a coin", "一枚硬币的厚度");
const mi = unit("mile", "miles", "英里", "mi", "length", 1_609_344, "a walk of about 20 minutes", "步行大约 20 分钟的路程");
const yd = unit("yard", "yards", "码", "yd", "length", 914, "the length of a baseball bat", "一根棒球棒的长度");
const ft = unit("foot", "feet", "英尺", "ft", "length", 305, "the length of a long ruler", "一把长尺子的长度");
const inch = unit("inch", "inches", "英寸", "in", "length", 25, "the top part of a thumb", "拇指第一节的长度");
const kg = unit("kilogram", "kilograms", "千克", "kg", "mass", 1000, "a thick dictionary", "一本厚词典");
const g = unit("gram", "grams", "克", "g", "mass", 1, "a paper clip", "一枚回形针");
const lb = unit("pound", "pounds", "磅", "lb", "mass", 454, "a loaf of bread", "一条面包");
const oz = unit("ounce", "ounces", "盎司", "oz", "mass", 28, "a slice of bread", "一片面包");
const liter = unit("liter", "liters", "升", "L", "volume", 1000, "a big bottle of water", "一大瓶水");
const mL = unit("milliliter", "milliliters", "毫升", "mL", "volume", 1, "about 20 drops of water", "大约 20 滴水");
const gal = unit("gallon", "gallons", "加仑", "gal", "volume", 3785, "a big jug of milk", "一大桶牛奶");
const qt = unit("quart", "quarts", "夸脱", "qt", "volume", 946, "a carton of milk", "一盒牛奶");
const pt = unit("pint", "pints", "品脱", "pt", "volume", 473, "two mugs of water", "两马克杯水");
const cup = unit("cup", "cups", "杯", "c", "volume", 237, "one mug of water", "一马克杯水");
const week = unit("week", "weeks", "周", "wk", "time", 604_800, "seven days", "七天");
const day = unit("day", "days", "天", "d", "time", 86_400, "from one morning to the next", "从一天早上到第二天早上");
const hour = unit("hour", "hours", "小时", "h", "time", 3600, "a long swimming lesson", "一节长长的游泳课");
const minute = unit("minute", "minutes", "分钟", "min", "time", 60, "singing a short song", "唱一首短歌");
const second = unit("second", "seconds", "秒", "s", "time", 1, "one clap of your hands", "拍一下手");

/** amountEn writes an amount with the unit's English name. */
const amountEn = (n: number, u: Unit) => `${fmt(n)} ${n === 1 ? u.one.en : u.many.en}`;

/** amountZh writes an amount with the unit's Chinese name. */
const amountZh = (n: number, u: Unit) => `${fmt(n)} ${u.one["zh-CN"]}`;

/** kindNames name what each kind of unit measures. */
const kindNames: Record<Kind, Pair> = {
  length: ["length", "长度"],
  mass: ["mass", "质量"],
  volume: ["volume", "容积"],
  time: ["time", "时间"],
};

/** tooSmall and tooBig say how an amount in the wrong unit misses, by kind. */
const tooSmall: Record<Kind, Pair> = { length: ["short", "短"], mass: ["light", "轻"], volume: ["little", "少"], time: ["short", "短"] };
const tooBig: Record<Kind, Pair> = { length: ["long", "长"], mass: ["heavy", "重"], volume: ["much", "多"], time: ["long", "长"] };

/** Estimate is an object, how big it is in one unit, and the unit choices to pick from. */
interface Estimate {
  readonly thing: Text;
  readonly low: number;
  readonly high: number;
  readonly unit: Unit;
  readonly others: readonly Unit[];
}

/** unitMiss says why n of another unit does not fit where n of the right unit does. */
function unitMiss(n: number, right: Unit, other: Unit): Pair {
  if (other.kind !== right.kind)
    return [
      `${other.many.en[0]!.toUpperCase()}${other.many.en.slice(1)} measure ${kindNames[other.kind][0]}, not ${kindNames[right.kind][0]}.`,
      `${other.one["zh-CN"]}是${kindNames[other.kind][1]}单位，不是${kindNames[right.kind][1]}单位。`,
    ];
  const word = other.size < right.size ? tooSmall[right.kind] : tooBig[right.kind];
  return [`${amountEn(n, other)} would be far too ${word[0]}.`, `${amountZh(n, other)}太${word[1]}了。`];
}

/** estimateKP asks which unit makes "about n ___" true for an everyday object. */
function estimateKP(
  id: string,
  explanation: Pair,
  estimates: readonly Estimate[],
  measure: (amount: string) => Text,
  figure: Figure,
): KnowledgePointDef {
  return point(
    id,
    ["Choosing a unit", "选择合适的单位"],
    explanation,
    (rng) => {
      const e = rng.pick(estimates);
      const n = rng.int(e.low, e.high);
      const u = e.unit;
      const near = e.others.find((o) => o.kind === u.kind) ?? e.others[0]!;
      return picked(
        rng,
        [
          `${e.thing.en} ${measure(`${fmt(n)} ___`).en}. Which unit fits?`,
          `${e.thing["zh-CN"]}${measure(`${fmt(n)} ___`)["zh-CN"]}。应填哪个单位？`,
        ],
        [u.many.en, u.many["zh-CN"]],
        e.others.map((o) => {
          const [en, zh] = unitMiss(n, u, o);
          return [[o.many.en, o.many["zh-CN"]], en, zh] as const;
        }),
        [
          [
            ["Picture one unit", "想一想 1 个单位"],
            [`1 ${u.one.en} is about ${u.like.en}.`, `1 ${u.one["zh-CN"]}大约是${u.like["zh-CN"]}。`],
          ],
          [
            ["Check the number", "看数是否合理"],
            [
              `${e.thing.en} ${measure(amountEn(n, u)).en}. That makes sense.`,
              `${e.thing["zh-CN"]}${measure(amountZh(n, u))["zh-CN"]}，这是合理的。`,
            ],
          ],
        ],
        (([en, zh]) => [`Try another unit. ${en}`, `换一个单位试试：${zh}`] as Pair)(unitMiss(n, u, near)),
      );
    },
    figure,
  );
}

/** Conversion is a larger unit, a smaller unit and how many of the smaller make one of the larger. */
interface Conversion {
  readonly big: Unit;
  readonly small: Unit;
  readonly factor: number;
}

const signs = ["<", "=", ">"] as const;

/** relationKP asks which symbol goes between an amount of a larger unit and an amount of a smaller one. */
function relationKP(id: string, conversions: readonly Conversion[], explanation: Pair, figure: Figure): KnowledgePointDef {
  return point(
    id,
    ["Comparing units", "比较单位的大小"],
    explanation,
    (rng) => {
      const c = rng.pick(conversions);
      const a = rng.int(1, 9);
      const big = a * c.factor;
      const rel = rng.int(0, 2);
      const step = rng.int(1, c.factor - 1);
      const b = rel === 0 ? big + step : rel === 1 ? big : big - step;
      const sign = signs[rel]!;
      const x = `\\text{${amountEn(a, c.big)}}`;
      const y = `\\text{${amountEn(b, c.small)}}`;
      const xz = `\\text{${amountZh(a, c.big)}}`;
      const yz = `\\text{${amountZh(b, c.small)}}`;
      const word: Pair = (
        [
          ["less than", "小于"],
          ["equal to", "等于"],
          ["more than", "大于"],
        ] as const
      )[rel]!;
      const back: Pair = (
        [
          ["more than", "大于"],
          ["equal to", "等于"],
          ["less than", "小于"],
        ] as const
      )[rel]!;
      const [q, r] = [Math.floor(b / c.factor), b % c.factor];
      const split: Pair =
        r === 0
          ? [`${amountEn(b, c.small)} is exactly ${amountEn(q, c.big)}.`, `${amountZh(b, c.small)}正好是 ${amountZh(q, c.big)}。`]
          : [
              `${amountEn(b, c.small)} is ${q === 0 ? "" : `${amountEn(q, c.big)} `}${amountEn(r, c.small)}. That is ${back[0]} ${amountEn(a, c.big)}.`,
              `${amountZh(b, c.small)}是${q === 0 ? "" : ` ${amountZh(q, c.big)}`} ${amountZh(r, c.small)}，${back[1]} ${amountZh(a, c.big)}。`,
            ];
      return picked(
        rng,
        [`Which symbol makes this true? $$${x} \\ \\square \\ ${y}$$`, `方框中应填哪个符号？$$${xz} \\ \\square \\ ${yz}$$`],
        [`$${sign}$`, `$${sign}$`],
        signs
          .filter((s) => s !== sign)
          .map((s) => {
            const why: Pair =
              rel === 1
                ? [
                    `${amountEn(a, c.big)} is exactly ${amountEn(big, c.small)}, so they are equal.`,
                    `${amountZh(a, c.big)}正好是 ${amountZh(big, c.small)}，两边相等。`,
                  ]
                : s === "="
                  ? [`They are not equal: ${fmt(big)} is not ${fmt(b)}.`, `两边不相等：${fmt(big)} 不等于 ${fmt(b)}。`]
                  : [
                      `That has the order the wrong way round. Change ${amountEn(a, c.big)} to ${c.small.many.en} first.`,
                      `这把大小弄反了。先把 ${amountZh(a, c.big)}化成${c.small.one["zh-CN"]}。`,
                    ];
            return [[`$${s}$`, `$${s}$`], why[0], why[1]] as const;
          }),
        [
          [
            ["Change to the smaller unit", "化成小单位"],
            [
              `1 ${c.big.one.en} is ${amountEn(c.factor, c.small)}. So ${amountEn(a, c.big)} is ${amountEn(big, c.small)}.`,
              `1 ${c.big.one["zh-CN"]}是 ${amountZh(c.factor, c.small)}。所以 ${amountZh(a, c.big)}是 ${amountZh(big, c.small)}。`,
            ],
          ],
          [
            ["Compare", "比较"],
            [`${fmt(big)} is ${word[0]} ${fmt(b)}. So the symbol is $${sign}$.`, `${fmt(big)} ${word[1]} ${fmt(b)}。所以填 $${sign}$。`],
          ],
        ],
        split,
      );
    },
    figure,
  );
}

const lengthConversions: readonly Conversion[] = [
  { big: km, small: m, factor: 1000 },
  { big: m, small: cm, factor: 100 },
  { big: cm, small: mm, factor: 10 },
  { big: ft, small: inch, factor: 12 },
  { big: yd, small: ft, factor: 3 },
];

const massConversions: readonly Conversion[] = [
  { big: kg, small: g, factor: 1000 },
  { big: lb, small: oz, factor: 16 },
];

const volumeConversions: readonly Conversion[] = [
  { big: liter, small: mL, factor: 1000 },
  { big: gal, small: qt, factor: 4 },
  { big: qt, small: pt, factor: 2 },
  { big: pt, small: cup, factor: 2 },
];

const timeConversions: readonly Conversion[] = [
  { big: week, small: day, factor: 7 },
  { big: day, small: hour, factor: 24 },
  { big: hour, small: minute, factor: 60 },
  { big: minute, small: second, factor: 60 },
];

/** est builds an Estimate. */
const est = (en: string, zh: string, low: number, high: number, u: Unit, others: readonly Unit[]): Estimate => ({
  thing: t(en, zh),
  low,
  high,
  unit: u,
  others,
});

const metricLength = [mm, cm, m, km];
const customaryLength = [inch, ft, yd, mi];
const without = (list: readonly Unit[], u: Unit) => list.filter((x) => x !== u);

const lengthEstimates: readonly Estimate[] = [
  est("A pencil", "一支铅笔", 14, 19, cm, without(metricLength, cm)),
  est("A grain of rice", "一粒米", 5, 7, mm, without(metricLength, mm)),
  est("A classroom", "一间教室", 8, 12, m, without(metricLength, m)),
  est("The trip between two cities", "两座城市之间的路程", 40, 300, km, without(metricLength, km)),
  est("A door", "一扇门", 2, 2, m, without(metricLength, m)),
  est("A fingernail", "一个指甲", 8, 12, mm, without(metricLength, mm)),
  est("A book", "一本书", 20, 28, cm, without(metricLength, cm)),
  est("A paper clip", "一枚回形针", 3, 4, cm, without(metricLength, cm)),
  est("A marathon", "一场马拉松", 42, 42, km, without(metricLength, km)),
  est("A crayon", "一支蜡笔", 3, 4, inch, without(customaryLength, inch)),
  est("A football field", "一个橄榄球场", 100, 120, yd, without(customaryLength, yd)),
  est("A grown-up", "一个成年人", 5, 6, ft, without(customaryLength, ft)),
  est("A bike ride across town", "骑车穿过小镇", 3, 9, mi, without(customaryLength, mi)),
  est("A car", "一辆汽车", 14, 16, ft, without(customaryLength, ft)),
  est("A smartphone", "一部手机", 5, 6, inch, without(customaryLength, inch)),
];

const metricMass = [g, kg];
const customaryMass = [oz, lb];

const massEstimates: readonly Estimate[] = [
  est("A paper clip", "一枚回形针", 1, 1, g, [kg, lb]),
  est("An apple", "一个苹果", 150, 250, g, [kg, mm, liter]),
  est("A bicycle", "一辆自行车", 10, 15, kg, without(metricMass, kg).concat([km, mL])),
  est("A grown-up", "一个成年人", 55, 90, kg, [g, km, liter]),
  est("A pencil", "一支铅笔", 5, 8, g, [kg, cm, liter]),
  est("A bag of flour", "一袋面粉", 2, 5, kg, [g, m, mL]),
  est("A slice of bread", "一片面包", 25, 35, g, [kg, cm, mL]),
  est("A letter", "一封信", 1, 2, oz, without(customaryMass, oz).concat([ft, gal])),
  est("A dog", "一只狗", 20, 70, lb, [oz, yd, qt]),
  est("A baseball", "一个棒球", 5, 5, oz, [lb, inch, cup]),
  est("A watermelon", "一个西瓜", 15, 25, lb, [oz, ft, gal]),
  est("A bowling ball", "一个保龄球", 10, 16, lb, [oz, mi, pt]),
];

const volumeEstimates: readonly Estimate[] = [
  est("A water bottle", "一瓶水", 500, 750, mL, [liter, g, cm]),
  est("A bathtub", "一个浴缸", 150, 300, liter, [mL, kg, m]),
  est("A spoonful of medicine", "一勺药", 5, 10, mL, [liter, g, mm]),
  est("A bucket", "一只水桶", 8, 12, liter, [mL, kg, cm]),
  est("A carton of juice", "一盒果汁", 1, 2, liter, [mL, g, km]),
  est("A can of soup", "一罐汤", 300, 400, mL, [liter, kg, mm]),
  est("A fish tank", "一个鱼缸", 10, 40, gal, [cup, lb, ft]),
  est("A glass of milk", "一杯牛奶", 1, 1, cup, [gal, oz, inch]),
  est("A car's gas tank", "汽车的油箱", 12, 16, gal, [pt, lb, yd]),
  est("A carton of cream", "一盒奶油", 1, 1, pt, [gal, lb, mi]),
];

const timeEstimates: readonly Estimate[] = [
  est("Brushing your teeth", "刷一次牙", 2, 3, minute, [second, hour, day]),
  est("A school day", "一个上学日", 6, 7, hour, [minute, day, week]),
  est("Sneezing", "打一个喷嚏", 1, 2, second, [minute, hour, day]),
  est("Summer vacation", "暑假", 8, 10, week, [day, hour, minute]),
  est("A movie", "一部电影", 2, 3, hour, [second, day, week]),
  est("Eating lunch", "吃一顿午饭", 20, 30, minute, [second, hour, day]),
  est("Clapping your hands 5 times", "拍手 5 次", 2, 4, second, [minute, hour, week]),
  est("A spring break", "春假", 7, 9, day, [minute, hour, second]),
  est("Running a mile", "跑一英里", 8, 12, minute, [second, hour, week]),
  est("Writing your name", "写一遍自己的名字", 3, 6, second, [minute, hour, day]),
];

/** equalTape is a bar for `count` large units, each cut off and marked with its size in the small unit. */
const equalTape = (count: number, each: string, total: string): Figure =>
  tapeFigure(
    [{ total, pieces: Array.from({ length: count }, () => ({ size: 1, text: each })) }],
    [`A bar for ${total} cut into ${count} equal parts, each ${each}.`, `一个表示 ${total} 的长条，平均分成 ${count} 份，每份是 ${each}。`],
  );

/** twoPartTape is a bar for an amount in two units: the larger unit changed to the smaller, and the part already in the smaller unit. */
const twoPartTape = (first: number, firstText: string, rest: number, restText: string, total: string): Figure =>
  tapeFigure(
    [
      {
        total,
        pieces: [
          { size: first, text: firstText, lit: true },
          { size: Math.max(rest, first * 0.2), text: restText },
        ],
      },
    ],
    [`A bar for ${total} made of ${firstText} and ${restText}.`, `一个表示 ${total} 的长条，由 ${firstText} 和 ${restText} 组成。`],
  );

/** rulerFigure is a number line from 0 to hi with one amount marked, standing for a ruler or a scale. */
const rulerFigure = (hi: number, step: number, labelStep: number, at: number, text: string, unitText: Pair): Figure =>
  lineFigure(
    {
      lo: 0,
      hi,
      step,
      labels: Array.from({ length: hi / labelStep + 1 }, (_, i) => i * labelStep),
      marks: [{ at, text, result: true }],
    },
    [`A scale from 0 to ${hi} ${unitText[0]} with ${text} marked.`, `一条从 0 到 ${hi} ${unitText[1]}的刻度尺，标出了 ${text}。`],
  );

export const unitsOfLength = topic(
  "units-of-length",
  t("Units of Length", "长度单位"),
  t(
    "Metric units of length are the millimeter, centimeter, meter and kilometer: 1 cm = 10 mm, 1 m = 100 cm and 1 km = 1,000 m. Customary units are the inch, foot, yard and mile: 1 ft = 12 in and 1 yd = 3 ft.",
    "公制长度单位有毫米、厘米、米、千米：1 厘米 = 10 毫米，1 米 = 100 厘米，1 千米 = 1000 米。英制长度单位有英寸、英尺、码、英里：1 英尺 = 12 英寸，1 码 = 3 英尺。",
  ),
  ["feet-and-meters"],
  ["4.MD.A.1"],
  [
    estimateKP(
      "choosing-units-of-length",
      [
        "Is a pencil about 15 ___ long? A centimeter is about the width of a fingertip. 15 fingertips in a row are about as long as a pencil. So the unit is centimeters.\n\nCheck: 15 meters would be longer than a classroom, and 15 millimeters would be shorter than a thumb.\n\n> **Watch out.** Look at the number and the unit together. 15 is a small number, but 15 kilometers is a long way.",
        "一支铅笔大约长 15 ___？1 厘米大约是一个指尖的宽度。15 个指尖排起来，大约和铅笔一样长。所以单位是厘米。\n\n检验：15 米比一间教室还长，15 毫米比拇指还短。\n\n> **注意。** 要把数和单位放在一起看。15 是个小数，可 15 千米是很远的路。",
      ],
      lengthEstimates,
      (a) => t(`is about ${a} long`, `的长度大约是 ${a}`),
      rulerFigure(20, 1, 5, 15, "15 cm", ["centimeters", "厘米"]),
    ),
    relationKP(
      "comparing-lengths-in-different-units",
      lengthConversions,
      [
        "Which is longer, 3 meters or 250 centimeters? 1 meter is 100 centimeters. So 3 meters is 300 centimeters. 300 is more than 250, so 3 meters is longer.\n\nCheck: 250 centimeters is 2 meters 50 centimeters. That is less than 3 meters.\n\n> **Watch out.** Do not compare 3 with 250. Change to the same unit first.",
        "3 米和 250 厘米，哪个长？1 米是 100 厘米。所以 3 米是 300 厘米。300 比 250 大，所以 3 米更长。\n\n检验：250 厘米是 2 米 50 厘米，比 3 米短。\n\n> **注意。** 不能直接拿 3 和 250 比。先化成同一个单位。",
      ],
      tapeFigure(
        [
          { total: "3 m", pieces: [1, 2, 3].map(() => ({ size: 100, text: "100 cm" })) },
          { pieces: [{ size: 250, text: "250 cm", lit: true }] },
        ],
        [
          "A bar for 3 meters made of three parts of 100 centimeters, over a shorter bar of 250 centimeters.",
          "一个表示 3 米的长条，由三段 100 厘米组成；下面是一个较短的 250 厘米长条。",
        ],
      ),
    ),
  ],
  t(
    "Mia's pencil is about 15 centimeters long. The hallway is about 20 meters long. The trip to her grandma's house is about 30 kilometers. Small things get small units, and long trips get big units.\n\nCheck: a pencil 15 kilometers long could not fit in any house.\n\nIn this lesson we choose units of length and compare lengths in different units.",
    "米娅的铅笔大约长 15 厘米，走廊大约长 20 米，去外婆家的路大约 30 千米。小东西用小单位，远的路用大单位。\n\n检验：15 千米长的铅笔，哪个房子都放不下。\n\n本课我们选择长度单位，并比较用不同单位表示的长度。",
  ),
);

export const unitsOfMass = topic(
  "units-of-mass",
  t("Units of Mass", "质量单位"),
  t(
    "Mass measures how heavy something is. Metric units are the gram and the kilogram: 1 kg = 1,000 g. Customary units of weight are the ounce and the pound: 1 lb = 16 oz.",
    "质量表示物体有多重。公制单位有克和千克：1 千克 = 1000 克。英制重量单位有盎司和磅：1 磅 = 16 盎司。",
  ),
  ["grams-kilograms-and-liters"],
  ["4.MD.A.1"],
  [
    estimateKP(
      "choosing-units-of-mass",
      [
        "Does an apple weigh about 200 ___? A gram is very light, like a paper clip. 200 paper clips weigh about as much as an apple. So the unit is grams.\n\nCheck: 200 kilograms would be heavier than two grown-ups. That cannot be an apple.\n\n> **Watch out.** A kilometer measures length, not mass. Pick a unit of mass.",
        "一个苹果大约重 200 ___？1 克很轻，就像一枚回形针。200 枚回形针大约和一个苹果一样重。所以单位是克。\n\n检验：200 千克比两个大人还重，不可能是一个苹果。\n\n> **注意。** 千米是长度单位，不是质量单位。要选质量单位。",
      ],
      massEstimates,
      (a) => t(`weighs about ${a}`, `的质量大约是 ${a}`),
      equalTape(5, "200 g", "1 kg"),
    ),
    relationKP(
      "comparing-masses-in-different-units",
      massConversions,
      [
        "Which is heavier, 2 kilograms or $1{,}800$ grams? 1 kilogram is $1{,}000$ grams. So 2 kilograms is $2{,}000$ grams. That is more than $1{,}800$ grams, so 2 kilograms is heavier.\n\nCheck: $1{,}800$ grams is 1 kilogram 800 grams. That is less than 2 kilograms.\n\n> **Watch out.** Do not compare 2 with $1{,}800$. Change to the same unit first.",
        "2 千克和 $1{,}800$ 克，哪个重？1 千克是 $1{,}000$ 克。所以 2 千克是 $2{,}000$ 克，比 $1{,}800$ 克重。所以 2 千克更重。\n\n检验：$1{,}800$ 克是 1 千克 800 克，比 2 千克轻。\n\n> **注意。** 不能直接拿 2 和 $1{,}800$ 比。先化成同一个单位。",
      ],
      tapeFigure(
        [
          { total: "2 kg", pieces: [1, 2].map(() => ({ size: 1000, text: "1,000 g" })) },
          { pieces: [{ size: 1800, text: "1,800 g", lit: true }] },
        ],
        [
          "A bar for 2 kilograms made of two parts of 1,000 grams, over a shorter bar of 1,800 grams.",
          "一个表示 2 千克的长条，由两段 1,000 克组成；下面是一个较短的 1,800 克长条。",
        ],
      ),
    ),
  ],
  t(
    "An apple weighs about 200 grams. A bicycle weighs about 12 kilograms. Light things are weighed in grams, and heavy things in kilograms.\n\nCheck: an apple of 200 kilograms would be heavier than two grown-ups.\n\nIn this lesson we choose units of mass and compare masses in different units.",
    "一个苹果大约重 200 克，一辆自行车大约重 12 千克。轻的东西用克，重的东西用千克。\n\n检验：200 千克的苹果比两个大人还重，不可能。\n\n本课我们选择质量单位，并比较用不同单位表示的质量。",
  ),
);

/** clock writes minutes after midnight as a time on a 12-hour clock in LaTeX, such as 2{:}45. */
const clock = (v: number) =>
  `${Math.floor(v / 60) > 12 ? Math.floor(v / 60) - 12 : Math.floor(v / 60)}{:}${String(v % 60).padStart(2, "0")}`;

/** clockText writes minutes after midnight as a time on a 12-hour clock in plain text, such as 2:45. */
const clockText = (v: number) => clock(v).replace("{:}", ":");

/** timeLine is a time line from start to end with the stops between them labelled and jumps from stop to stop; hidden times are not labelled. */
const timeLine = (stops: readonly number[], hidden: readonly number[] = []): Figure => {
  const [lo, hi] = [Math.min(...stops), Math.max(...stops)];
  return lineFigure(
    {
      lo,
      hi,
      step: hi - lo,
      labels: stops.filter((s) => !hidden.includes(s)),
      label: clockText,
      marks: hidden.map((at) => ({ at, text: "?", result: true })),
      jumps: stops.slice(1).map((s, i): [number, number] => [stops[i]!, s]),
    },
    [
      `A time line through ${stops.map((s) => (hidden.includes(s) ? "an unknown time" : clockText(s))).join(", ")}, with a jump between each pair of times.`,
      `一条时间线，依次经过 ${stops.map((s) => (hidden.includes(s) ? "一个未知时刻" : clockText(s))).join("、")}，每两个时刻之间画了跳跃。`,
    ],
  );
};

export const unitsOfTimeAndElapsedTime = topic(
  "units-of-time-and-elapsed-time",
  t("Units of Time and Elapsed Time", "时间单位与经过的时间"),
  t(
    "Units of time are the second, minute, hour, day and week: 1 min = 60 s, 1 h = 60 min, 1 day = 24 h and 1 week = 7 days. The time between a start and an end is the elapsed time.",
    "时间单位有秒、分钟、小时、天和周：1 分钟 = 60 秒，1 小时 = 60 分钟，1 天 = 24 小时，1 周 = 7 天。从开始到结束经过的时间叫经过时间。",
  ),
  ["elapsed-time-in-minutes"],
  ["4.MD.A.1", "4.MD.A.2"],
  [
    estimateKP(
      "choosing-units-of-time",
      [
        "Does a movie take about 2 ___? A minute is about as long as singing a short song. 2 short songs are far too short for a movie. An hour is much longer. So a movie takes about 2 hours.\n\nCheck: 2 days would be far too long for one movie.\n\n> **Watch out.** A small number can go with a big unit. 2 hours is longer than 50 minutes.",
        "看一部电影大约用 2 ___？1 分钟大约是唱一首短歌的时间。唱 2 首短歌，对一部电影来说太短了。1 小时长得多。所以一部电影大约用 2 小时。\n\n检验：2 天对一部电影来说太长了。\n\n> **注意。** 小的数也可以配大的单位。2 小时比 50 分钟长。",
      ],
      timeEstimates,
      (a) => t(`takes about ${a}`, `大约用时 ${a}`),
      lineFigure(
        { lo: 0, hi: 120, step: 15, labels: [0, 60, 120], label: (v) => `${v} min`, marks: [{ at: 120, text: "2 h", result: true }] },
        [
          "A time line from 0 to 120 minutes in steps of 15 minutes, with 2 hours marked at 120 minutes.",
          "一条从 0 到 120 分钟的时间线，每格 15 分钟，在 120 分钟处标出了 2 小时。",
        ],
      ),
    ),
    point(
      "finding-elapsed-time",
      ["Elapsed time", "经过时间"],
      [
        "Ben reads from $2{:}45$ to $4{:}10$. How long is that? Up to $3{:}00$ is 15 minutes. Then 1 hour, 60 minutes, takes him to $4{:}00$. Then 10 more minutes. In all he reads 85 minutes, because $15 + 60 + 10 = 85$.\n\nCheck: 85 minutes is 1 hour 25 minutes. One hour after $2{:}45$ is $3{:}45$, and 25 more minutes is $4{:}10$.\n\n> **Watch out.** Do not subtract 245 from 410. An hour has 60 minutes, not 100.",
        "本从 $2{:}45$ 读到 $4{:}10$。读了多久？到 $3{:}00$ 是 15 分钟。再过 1 小时，也就是 60 分钟，到 $4{:}00$。再过 10 分钟。一共读了 85 分钟，因为 $15 + 60 + 10 = 85$。\n\n检验：85 分钟是 1 小时 25 分钟。$2{:}45$ 过 1 小时是 $3{:}45$，再过 25 分钟是 $4{:}10$。\n\n> **注意。** 不能用 410 减 245。1 小时是 60 分钟，不是 100 分钟。",
      ],
      (rng) => {
        const start = rng.int(7, 10) * 60 + rng.int(1, 11) * 5;
        const toHour = 60 - (start % 60);
        const hours = rng.int(0, 2);
        const rest = rng.int(1, 11) * 5;
        const length = toHour + 60 * hours + rest;
        const end = start + length;
        const nextHour = start + toHour;
        const dayPartEn = (v: number) => (v < 720 ? "a.m." : "p.m.");
        const dayPartZh = (v: number) => (v < 720 ? "上午" : v < 780 ? "中午" : "下午");
        const name = rng.pick(names);
        const parts = [toHour, 60 * hours, rest].filter((p) => p > 0);
        const raw = (Math.floor(end / 60) - Math.floor(start / 60)) * 100 + (end % 60) - (start % 60);
        return answered(
          [
            `${name} started reading at $${clock(start)}$ a.m. and stopped at $${clock(end)}$ ${dayPartEn(end)} How many minutes did ${name} read?`,
            `${name} 上午 $${clock(start)}$ 开始读书，${dayPartZh(end)} $${clock(end)}$ 停下。${name} 读了多少分钟？`,
          ],
          length,
          [
            [
              ["Up to the next hour", "数到下一个整点"],
              [
                `From $${clock(start)}$ to $${clock(nextHour)}$ is ${toHour} minutes.`,
                `从 $${clock(start)}$ 到 $${clock(nextHour)}$ 是 ${toHour} 分钟。`,
              ],
            ],
            [
              ["The rest of the way", "数剩下的"],
              hours > 0
                ? [
                    `Then ${hours} ${hours === 1 ? "hour" : "hours"}, or ${60 * hours} minutes, and ${rest} more minutes reach $${clock(end)}$.`,
                    `再过 ${hours} 小时，也就是 ${60 * hours} 分钟，再过 ${rest} 分钟，到 $${clock(end)}$。`,
                  ]
                : [`Then ${rest} more minutes reach $${clock(end)}$.`, `再过 ${rest} 分钟，到 $${clock(end)}$。`],
            ],
            [
              ["Add the jumps", "把各段加起来"],
              [`$${parts.join(" + ")} = ${length}$.`, `$${parts.join(" + ")} = ${length}$。`],
            ],
          ],
          [
            `${length} minutes is ${Math.floor(length / 60)} h ${length % 60} min. Counting that on from $${clock(start)}$ reaches $${clock(end)}$.`,
            `${length} 分钟是 ${Math.floor(length / 60)} 小时 ${length % 60} 分钟。从 $${clock(start)}$ 往后数这么久，正好到 $${clock(end)}$。`,
          ],
          [
            [
              raw,
              "That subtracts the times like ordinary numbers. An hour is 60 minutes, not 100.",
              "这把两个时刻当成普通的数相减了。1 小时是 60 分钟，不是 100 分钟。",
            ],
            [length + 60, "That counts one hour too many.", "这多数了 1 小时。"],
            hours > 0
              ? [toHour + rest, "That leaves out the whole hours in the middle.", "这漏掉了中间的整小时。"]
              : [rest, `That leaves out the ${toHour} minutes up to the next hour.`, `这漏掉了到下一个整点的 ${toHour} 分钟。`],
          ],
          { form: "integer", figure: timeLine(hours > 0 ? [start, nextHour, nextHour + 60 * hours, end] : [start, nextHour, end]) },
        );
      },
      timeLine([165, 180, 240, 250]),
    ),
  ],
  t(
    "Brushing your teeth takes about 2 minutes. A school day lasts about 6 hours. A sneeze takes about 1 second.\n\nCheck: brushing your teeth for 2 hours would be far too long.\n\nIn this lesson we choose units of time and find how much time has passed.",
    "刷牙大约用 2 分钟，一个上学日大约 6 小时，打一个喷嚏大约 1 秒。\n\n检验：刷牙刷 2 小时就太久了。\n\n本课我们选择时间单位，并求经过了多长时间。",
  ),
);

export const unitsOfVolume = topic(
  "units-of-volume",
  t("Units of Volume", "容积单位"),
  t(
    "Liquid volume measures how much a container holds. Metric units are the milliliter and the liter: 1 L = 1,000 mL. Customary units are the cup, pint, quart and gallon: 1 pt = 2 c, 1 qt = 2 pt and 1 gal = 4 qt.",
    "容积表示容器能装多少液体。公制单位有毫升和升：1 升 = 1000 毫升。英制单位有杯、品脱、夸脱和加仑：1 品脱 = 2 杯，1 夸脱 = 2 品脱，1 加仑 = 4 夸脱。",
  ),
  ["grams-kilograms-and-liters"],
  ["4.MD.A.1"],
  [
    estimateKP(
      "choosing-units-of-volume",
      [
        "Does a bucket hold about 10 ___? A milliliter is just a few drops. A liter is a big bottle of water. 10 big bottles fill a bucket. So the unit is liters.\n\nCheck: 10 milliliters is only two spoonfuls, far too little for a bucket.\n\n> **Watch out.** Grams measure mass, not how much a container holds.",
        "一只水桶大约能装 10 ___？1 毫升只有几滴水。1 升是一大瓶水。10 大瓶水能装满一桶。所以单位是升。\n\n检验：10 毫升只有两勺，装一桶太少了。\n\n> **注意。** 克是质量单位，不能表示容器能装多少。",
      ],
      volumeEstimates,
      (a) => t(`holds about ${a}`, `大约能装 ${a}`),
      equalTape(4, "250 mL", "1 L"),
    ),
    relationKP(
      "comparing-volumes-in-different-units",
      volumeConversions,
      [
        "Which is more, 3 quarts or 10 pints? 1 quart is 2 pints. So 3 quarts is 6 pints. 6 is less than 10, so 10 pints is more.\n\nCheck: 10 pints is 5 quarts. That is more than 3 quarts.\n\n> **Watch out.** Do not compare 3 with 10 and stop. Change to the same unit first.",
        "3 夸脱和 10 品脱，哪个多？1 夸脱是 2 品脱。所以 3 夸脱是 6 品脱。6 比 10 小，所以 10 品脱更多。\n\n检验：10 品脱是 5 夸脱，比 3 夸脱多。\n\n> **注意。** 不能只比 3 和 10 就下结论。先化成同一个单位。",
      ],
      tapeFigure(
        [
          { total: "3 qt", pieces: [1, 2, 3, 4, 5, 6].map(() => ({ size: 1, text: "1 pt" })) },
          { total: "10 pt", pieces: Array.from({ length: 10 }, () => ({ size: 1, text: "", lit: true })) },
        ],
        [
          "A bar for 3 quarts made of 6 pints, over a longer bar of 10 pints.",
          "一个表示 3 夸脱的长条，由 6 品脱组成；下面是一个更长的 10 品脱长条。",
        ],
      ),
    ),
  ],
  t(
    "A spoon holds about 5 milliliters of medicine. A bucket holds about 10 liters of water.\n\nCheck: 10 milliliters would fill only two spoons, not a bucket.\n\nIn this lesson we choose units of volume and compare volumes in different units.",
    "一勺大约装 5 毫升药，一只水桶大约装 10 升水。\n\n检验：10 毫升只能装两勺，装不满一桶。\n\n本课我们选择容积单位，并比较用不同单位表示的容积。",
  ),
);

/** conversionKPs builds the two knowledge points of a conversion topic: whole amounts, and amounts in two units. */
function conversionKPs(
  prefix: string,
  conversions: readonly Conversion[],
  example: Pair,
  exampleFigure: Figure,
  mixedExample: Pair,
  mixedFigure: Figure,
): KnowledgePointDef[] {
  return [
    point(
      `${prefix}-to-smaller-units`,
      ["Multiplying by the conversion factor", "乘以进率"],
      example,
      (rng) => {
        const c = rng.pick(conversions);
        const n = rng.int(2, c.factor >= 100 ? 15 : 12);
        const total = n * c.factor;
        const f = c.factor;
        return answered(
          [`How many ${c.small.many.en} are in ${amountEn(n, c.big)}?`, `${amountZh(n, c.big)}是多少${c.small.one["zh-CN"]}？`],
          total,
          [
            [
              ["Find the factor", "找进率"],
              [`1 ${c.big.one.en} is ${amountEn(f, c.small)}.`, `1 ${c.big.one["zh-CN"]}是 ${amountZh(f, c.small)}。`],
            ],
            [
              ["Multiply", "相乘"],
              [`$${n} \\times ${tex(f)} = ${tex(total)}$.`, `$${n} \\times ${tex(f)} = ${tex(total)}$。`],
            ],
          ],
          [`Group them back: $${tex(total)} \\div ${tex(f)} = ${n}$.`, `再分回去：$${tex(total)} \\div ${tex(f)} = ${n}$。`],
          [
            [n, "That keeps the same number. A smaller unit needs a bigger number.", "这还是原来的数。换成小单位，数要变大。"],
            [n + f, "That adds the factor instead of multiplying by it.", "这是加上进率，应该乘进率。"],
            f >= 10
              ? [total * 10, "That has one zero too many.", "这多写了一个 0。"]
              : [total + f, `That counts one ${c.big.one.en} too many.`, `这多算了 1 ${c.big.one["zh-CN"]}。`],
          ],
          { form: "integer", ...(n <= 6 && { figure: equalTape(n, `${fmt(f)} ${c.small.abbr}`, `${n} ${c.big.abbr}`) }) },
        );
      },
      exampleFigure,
    ),
    point(
      `${prefix}-in-two-units-to-smaller-units`,
      ["Amounts in two units", "复名数化成小单位"],
      mixedExample,
      (rng) => {
        const c = rng.pick(conversions);
        const a = rng.int(1, 9);
        const b = rng.int(1, c.factor - 1);
        const first = a * c.factor;
        const total = first + b;
        const joined = Number(`${a}${b}`);
        return answered(
          [
            `How many ${c.small.many.en} are in ${amountEn(a, c.big)} ${amountEn(b, c.small)}?`,
            `${amountZh(a, c.big)} ${amountZh(b, c.small)}是多少${c.small.one["zh-CN"]}？`,
          ],
          total,
          [
            [
              ["Change the larger unit", "把大单位化成小单位"],
              [
                `$${a} \\times ${tex(c.factor)} = ${tex(first)}$. So ${amountEn(a, c.big)} is ${amountEn(first, c.small)}.`,
                `$${a} \\times ${tex(c.factor)} = ${tex(first)}$。所以 ${amountZh(a, c.big)}是 ${amountZh(first, c.small)}。`,
              ],
            ],
            [
              ["Add the rest", "加上其余的"],
              [`$${tex(first)} + ${b} = ${tex(total)}$.`, `$${tex(first)} + ${b} = ${tex(total)}$。`],
            ],
          ],
          [
            `Split it back: ${fmt(total)} is ${a} ${a === 1 ? "group" : "groups"} of ${fmt(c.factor)} and ${b} more.`,
            `再分回去：${fmt(total)} 是 ${a} 个 ${fmt(c.factor)}，再多 ${b}。`,
          ],
          [
            [first, `That leaves out the ${amountEn(b, c.small)}.`, `这漏掉了 ${amountZh(b, c.small)}。`],
            [a + b, "That adds the numbers without changing the units.", "这没有换单位，就把两个数加起来了。"],
            joined !== total
              ? [
                  joined,
                  `That joins the digits. ${amountEn(a, c.big)} is ${amountEn(first, c.small)}.`,
                  `这只是把数字拼在一起。${amountZh(a, c.big)}是 ${amountZh(first, c.small)}。`,
                ]
              : [total + c.factor, `That counts one ${c.big.one.en} too many.`, `这多算了 1 ${c.big.one["zh-CN"]}。`],
          ],
          {
            form: "integer",
            figure: twoPartTape(
              first,
              `${a} ${c.big.abbr} = ${fmt(first)} ${c.small.abbr}`,
              b,
              `${b} ${c.small.abbr}`,
              `${fmt(total)} ${c.small.abbr}`,
            ),
          },
        );
      },
      mixedFigure,
    ),
  ];
}

export const convertingMetricUnitsOfLengthToSmallerUnits = topic(
  "converting-metric-units-of-length-to-smaller-units",
  t("Converting Metric Units of Length to Smaller Units", "公制长度单位化成较小单位"),
  t(
    "To convert to a smaller unit, multiply by how many small units make one large unit: 4 m = 4 × 100 cm = 400 cm, and 3 km 250 m = 3,000 m + 250 m = 3,250 m.",
    "化成较小的单位时，乘以进率：4 米 = 4 × 100 厘米 = 400 厘米，3 千米 250 米 = 3000 米 + 250 米 = 3250 米。",
  ),
  ["units-of-length", "multiplying-by-10-100-and-1000"],
  ["4.MD.A.1"],
  conversionKPs(
    "metric-lengths",
    [
      { big: km, small: m, factor: 1000 },
      { big: m, small: cm, factor: 100 },
      { big: cm, small: mm, factor: 10 },
      { big: m, small: mm, factor: 1000 },
    ],
    [
      "How many millimeters are in 7 centimeters? 1 centimeter is 10 millimeters. So 7 centimeters is 70 millimeters, because $7 \\times 10 = 70$.\n\nCheck: $70 \\div 10 = 7$.\n\n> **Watch out.** A smaller unit needs a bigger number. Multiply, do not divide.",
      "7 厘米是多少毫米？1 厘米是 10 毫米。所以 7 厘米是 70 毫米，因为 $7 \\times 10 = 70$。\n\n检验：$70 \\div 10 = 7$。\n\n> **注意。** 换成小单位，数要变大。要用乘法，不能用除法。",
    ],
    equalTape(7, "10 mm", "7 cm"),
    [
      "How many centimeters are in 5 m 6 cm? 5 meters is 500 centimeters. Add the 6. So it is 506 centimeters, because $500 + 6 = 506$.\n\nCheck: 506 centimeters is 5 hundreds and 6 more. That is 5 m 6 cm.\n\n> **Watch out.** Do not just join the digits. 5 m 6 cm is not 56 cm.",
      "5 米 6 厘米是多少厘米？5 米是 500 厘米，再加上 6。所以是 506 厘米，因为 $500 + 6 = 506$。\n\n检验：506 厘米是 5 个 100 再多 6，就是 5 米 6 厘米。\n\n> **注意。** 不能把数字直接拼起来。5 米 6 厘米不是 56 厘米。",
    ],
    twoPartTape(500, "5 m = 500 cm", 6, "6 cm", "506 cm"),
  ),
  t(
    "A ribbon is 4 meters long. Each meter is 100 centimeters. So the ribbon is 400 centimeters long, because $4 \\times 100 = 400$.\n\nCheck: 400 centimeters in groups of 100 makes 4 groups, so 4 meters.\n\nIn this lesson we change metric lengths into smaller units.",
    "一条丝带长 4 米。每米是 100 厘米。所以丝带长 400 厘米，因为 $4 \\times 100 = 400$。\n\n检验：400 厘米每 100 厘米一组，正好 4 组，就是 4 米。\n\n本课我们把公制长度化成较小的单位。",
  ),
);

export const convertingCustomaryUnitsOfLengthToSmallerUnits = topic(
  "converting-customary-units-of-length-to-smaller-units",
  t("Converting Customary Units of Length to Smaller Units", "英制长度单位化成较小单位"),
  t(
    "1 foot is 12 inches, 1 yard is 3 feet (36 inches) and 1 mile is 1,760 yards. To convert to a smaller unit, multiply: 5 ft = 5 × 12 in = 60 in.",
    "1 英尺 = 12 英寸，1 码 = 3 英尺（36 英寸），1 英里 = 1760 码。化成较小的单位时用乘法：5 英尺 = 5 × 12 英寸 = 60 英寸。",
  ),
  ["units-of-length", "products-and-factors"],
  ["4.MD.A.1"],
  conversionKPs(
    "customary-lengths",
    [
      { big: ft, small: inch, factor: 12 },
      { big: yd, small: ft, factor: 3 },
      { big: yd, small: inch, factor: 36 },
      { big: mi, small: yd, factor: 1760 },
    ],
    [
      "How many feet are in 4 yards? 1 yard is 3 feet. So 4 yards is 12 feet, because $4 \\times 3 = 12$.\n\nCheck: $12 \\div 3 = 4$.\n\n> **Watch out.** Use the right number. A yard is 3 feet, but a foot is 12 inches.",
      "4 码是多少英尺？1 码是 3 英尺。所以 4 码是 12 英尺，因为 $4 \\times 3 = 12$。\n\n检验：$12 \\div 3 = 4$。\n\n> **注意。** 要用对进率。1 码是 3 英尺，1 英尺是 12 英寸。",
    ],
    equalTape(4, "3 ft", "4 yd"),
    [
      "How many inches are in 3 ft 7 in? 3 feet is 36 inches, because $3 \\times 12 = 36$. Add the 7. So it is 43 inches, because $36 + 7 = 43$.\n\nCheck: 43 inches is 3 groups of 12 and 7 more.\n\n> **Watch out.** A foot is 12 inches, not 10. 3 ft 7 in is not 37 inches.",
      "3 英尺 7 英寸是多少英寸？3 英尺是 36 英寸，因为 $3 \\times 12 = 36$。再加上 7。所以是 43 英寸，因为 $36 + 7 = 43$。\n\n检验：43 英寸是 3 个 12 再多 7。\n\n> **注意。** 1 英尺是 12 英寸，不是 10 英寸。3 英尺 7 英寸不是 37 英寸。",
    ],
    twoPartTape(36, "3 ft = 36 in", 7, "7 in", "43 in"),
  ),
  t(
    "A board is 5 feet long. Each foot is 12 inches. So the board is 60 inches long, because $5 \\times 12 = 60$.\n\nCheck: 60 inches in groups of 12 makes 5 groups, so 5 feet.\n\nIn this lesson we change customary lengths into smaller units.",
    "一块木板长 5 英尺。每英尺是 12 英寸。所以木板长 60 英寸，因为 $5 \\times 12 = 60$。\n\n检验：60 英寸每 12 英寸一组，正好 5 组，就是 5 英尺。\n\n本课我们把英制长度化成较小的单位。",
  ),
);

export const convertingUnitsOfVolumeToSmallerUnits = topic(
  "converting-units-of-volume-to-smaller-units",
  t("Converting Units of Volume to Smaller Units", "容积单位化成较小单位"),
  t(
    "Multiply by the conversion factor: 3 L = 3,000 mL, 5 gal = 20 qt, 6 qt = 12 pt and 4 pt = 8 c.",
    "乘以进率：3 升 = 3000 毫升，5 加仑 = 20 夸脱，6 夸脱 = 12 品脱，4 品脱 = 8 杯。",
  ),
  ["units-of-volume", "products-and-factors"],
  ["4.MD.A.1"],
  conversionKPs(
    "volumes",
    [...volumeConversions, { big: gal, small: pt, factor: 8 }],
    [
      "How many quarts are in 6 gallons? 1 gallon is 4 quarts. So 6 gallons is 24 quarts, because $6 \\times 4 = 24$.\n\nCheck: $24 \\div 4 = 6$.\n\n> **Watch out.** Multiply by 4, do not divide. Quarts are smaller, so you need more of them.",
      "6 加仑是多少夸脱？1 加仑是 4 夸脱。所以 6 加仑是 24 夸脱，因为 $6 \\times 4 = 24$。\n\n检验：$24 \\div 4 = 6$。\n\n> **注意。** 要乘 4，不能除以 4。夸脱更小，需要的个数更多。",
    ],
    equalTape(6, "4 qt", "24 qt"),
    [
      "How many milliliters are in 2 L 350 mL? 2 liters is $2{,}000$ milliliters. Add the 350. So it is $2{,}350$ milliliters, because $2{,}000 + 350 = 2{,}350$.\n\nCheck: $2{,}350$ is 2 thousands and 350 more.\n\n> **Watch out.** Keep each digit in its place. 2 L 35 mL is $2{,}035$ mL, not $2{,}350$ mL.",
      "2 升 350 毫升是多少毫升？2 升是 $2{,}000$ 毫升，再加上 350。所以是 $2{,}350$ 毫升，因为 $2{,}000 + 350 = 2{,}350$。\n\n检验：$2{,}350$ 是 2 个 1000 再多 350。\n\n> **注意。** 每个数字要放在正确的数位上。2 升 35 毫升是 $2{,}035$ 毫升，不是 $2{,}350$ 毫升。",
    ],
    twoPartTape(2000, "2 L = 2,000 mL", 350, "350 mL", "2,350 mL"),
  ),
  t(
    "A big jug holds 3 liters of juice. Each liter is $1{,}000$ milliliters. So the jug holds $3{,}000$ milliliters.\n\nCheck: $3{,}000 \\div 1{,}000 = 3$.\n\nIn this lesson we change units of volume into smaller units.",
    "一个大壶装 3 升果汁。每升是 $1{,}000$ 毫升。所以壶里有 $3{,}000$ 毫升果汁。\n\n检验：$3{,}000 \\div 1{,}000 = 3$。\n\n本课我们把容积单位化成较小的单位。",
  ),
);

export const convertingUnitsOfMassToSmallerUnits = topic(
  "converting-units-of-mass-to-smaller-units",
  t("Converting Units of Mass to Smaller Units", "质量单位化成较小单位"),
  t(
    "Multiply by the conversion factor: 4 kg = 4 × 1,000 g = 4,000 g, and 3 lb = 3 × 16 oz = 48 oz.",
    "乘以进率：4 千克 = 4 × 1000 克 = 4000 克，3 磅 = 3 × 16 盎司 = 48 盎司。",
  ),
  ["units-of-mass", "products-and-factors"],
  ["4.MD.A.1"],
  conversionKPs(
    "masses",
    massConversions,
    [
      "How many ounces are in 5 pounds? 1 pound is 16 ounces. So 5 pounds is 80 ounces, because $5 \\times 16 = 80$.\n\nCheck: $80 \\div 16 = 5$.\n\n> **Watch out.** Multiply by 16, do not add. 21 ounces is far too few.",
      "5 磅是多少盎司？1 磅是 16 盎司。所以 5 磅是 80 盎司，因为 $5 \\times 16 = 80$。\n\n检验：$80 \\div 16 = 5$。\n\n> **注意。** 要乘 16，不能加 16。21 盎司太少了。",
    ],
    equalTape(5, "16 oz", "5 lb"),
    [
      "How many grams are in 2 kg 75 g? 2 kilograms is $2{,}000$ grams. Add the 75. So it is $2{,}075$ grams, because $2{,}000 + 75 = 2{,}075$.\n\nCheck: $2{,}075$ is 2 thousands and 75 more.\n\n> **Watch out.** 75 grams is not 750 grams. The answer is $2{,}075$, not $2{,}750$.",
      "2 千克 75 克是多少克？2 千克是 $2{,}000$ 克，再加上 75。所以是 $2{,}075$ 克，因为 $2{,}000 + 75 = 2{,}075$。\n\n检验：$2{,}075$ 是 2 个 1000 再多 75。\n\n> **注意。** 75 克不是 750 克。答案是 $2{,}075$，不是 $2{,}750$。",
    ],
    twoPartTape(2000, "2 kg = 2,000 g", 75, "75 g", "2,075 g"),
  ),
  t(
    "A bag of flour weighs 4 kilograms. Each kilogram is $1{,}000$ grams. So the bag weighs $4{,}000$ grams.\n\nCheck: $4{,}000 \\div 1{,}000 = 4$.\n\nIn this lesson we change units of mass into smaller units.",
    "一袋面粉重 4 千克。每千克是 $1{,}000$ 克。所以这袋面粉重 $4{,}000$ 克。\n\n检验：$4{,}000 \\div 1{,}000 = 4$。\n\n本课我们把质量单位化成较小的单位。",
  ),
);

export const convertingUnitsOfTimeToSmallerUnits = topic(
  "converting-units-of-time-to-smaller-units",
  t("Converting Units of Time to Smaller Units", "时间单位化成较小单位"),
  t(
    "Multiply by the conversion factor: 3 h = 3 × 60 min = 180 min, and 2 days 5 h = 48 h + 5 h = 53 h.",
    "乘以进率：3 小时 = 3 × 60 分钟 = 180 分钟，2 天 5 小时 = 48 小时 + 5 小时 = 53 小时。",
  ),
  ["units-of-time-and-elapsed-time", "products-and-factors"],
  ["4.MD.A.1"],
  conversionKPs(
    "times",
    timeConversions,
    [
      "How many seconds are in 4 minutes? 1 minute is 60 seconds. So 4 minutes is 240 seconds, because $4 \\times 60 = 240$.\n\nCheck: $240 \\div 60 = 4$.\n\n> **Watch out.** A minute is 60 seconds, not 100. 4 minutes is not 400 seconds.",
      "4 分钟是多少秒？1 分钟是 60 秒。所以 4 分钟是 240 秒，因为 $4 \\times 60 = 240$。\n\n检验：$240 \\div 60 = 4$。\n\n> **注意。** 1 分钟是 60 秒，不是 100 秒。4 分钟不是 400 秒。",
    ],
    equalTape(4, "60 s", "4 min"),
    [
      "How many minutes are in 1 h 25 min? 1 hour is 60 minutes. Add the 25. So it is 85 minutes, because $60 + 25 = 85$.\n\nCheck: 85 minutes is 60 minutes and 25 more, which is 1 hour 25 minutes.\n\n> **Watch out.** 1 h 25 min is not 125 minutes. An hour has 60 minutes, not 100.",
      "1 小时 25 分钟是多少分钟？1 小时是 60 分钟，再加上 25。所以是 85 分钟，因为 $60 + 25 = 85$。\n\n检验：85 分钟是 60 分钟再多 25 分钟，就是 1 小时 25 分钟。\n\n> **注意。** 1 小时 25 分钟不是 125 分钟。1 小时是 60 分钟，不是 100 分钟。",
    ],
    twoPartTape(60, "1 h = 60 min", 25, "25 min", "85 min"),
  ),
  t(
    "A road trip takes 3 hours. Each hour is 60 minutes. So the trip takes 180 minutes, because $3 \\times 60 = 180$.\n\nCheck: $180 \\div 60 = 3$.\n\nIn this lesson we change units of time into smaller units.",
    "一次自驾旅行用了 3 小时。每小时是 60 分钟。所以旅行用了 180 分钟，因为 $3 \\times 60 = 180$。\n\n检验：$180 \\div 60 = 3$。\n\n本课我们把时间单位化成较小的单位。",
  ),
);

// ---------------------------------------------------------------------------
// Line plots

/** Survey is the subject of a line plot of whole numbers. */
interface Survey {
  readonly what: Text;
  readonly each: Text;
  readonly min: number;
  readonly max: number;
}

const surveys: readonly Survey[] = [
  { what: t("the number of pets each student has", "每名学生养的宠物数"), each: t("pets", "只宠物"), min: 0, max: 5 },
  { what: t("the number of books each student read this month", "每名学生本月读的书的本数"), each: t("books", "本书"), min: 0, max: 8 },
  { what: t("the number of goals each student scored this season", "每名学生本赛季的进球数"), each: t("goals", "个进球"), min: 0, max: 7 },
  { what: t("the number of letters in each student's first name", "每名学生名字的字母数"), each: t("letters", "个字母"), min: 3, max: 9 },
];

/** wholePlotData draws 10 to 16 values for a survey. */
function wholePlotData(rng: Rng, s: Survey): number[] {
  const n = rng.int(10, 16);
  return Array.from({ length: n }, () => rng.int(s.min, s.max)).sort((a, b) => a - b);
}

const countOf = (values: readonly number[], v: number) => values.filter((x) => x === v).length;

/** surveyPlot draws a line plot of whole-number survey answers. */
const surveyPlot = (values: readonly number[], s: Survey): Figure => ({
  svg: dotPlot([...values], { min: s.min, max: s.max, step: 1 }),
  alt: t(`A line plot of ${s.what.en}, with values from ${s.min} to ${s.max}.`, `${s.what["zh-CN"]}的线图，数值从 ${s.min} 到 ${s.max}。`),
});

/** petsPlot is the line plot of pets used in the explanations. */
const petsPlot = (): Figure => surveyPlot([0, 1, 1, 2, 2, 2, 2, 3, 4], surveys[0]!);

export const creatingAndInterpretingLinePlots = topic(
  "creating-and-interpreting-line-plots",
  t("Creating and Interpreting Line Plots", "绘制和解读线图"),
  t(
    "A line plot shows data on a number line, with one dot (or X) above a value for each time it appears. Counting the dots above a value tells how often it occurs; counting all the dots tells how many data values there are.",
    "线图（点图）把数据画在数轴上：数据中每出现一次某个值，就在这个值的上方画一个点（或 X）。数某个值上方的点，就知道它出现了几次；数所有的点，就知道一共有多少个数据。",
  ),
  ["line-plots-of-measurements"],
  ["4.MD.B.4"],
  [
    point(
      "reading-counts-from-line-plots",
      ["How many dots", "数点"],
      [
        "Ana asked her class how many pets each child has. She drew a number line and put one dot above a number for each child. There are 4 dots above 2, so 4 children have 2 pets. There are 9 dots in all, so 9 children answered.\n\nCheck: add the columns, $1 + 2 + 4 + 1 + 1 = 9$.\n\n> **Watch out.** The number under a column is the value. The count is how many dots sit above it.",
        "安娜问全班同学每人养几只宠物。她画了一条数轴，每名同学的回答就在对应的数上方画一个点。2 的上方有 4 个点，所以有 4 名同学养 2 只宠物。一共有 9 个点，所以有 9 名同学回答。\n\n检验：把各列加起来，$1 + 2 + 4 + 1 + 1 = 9$。\n\n> **注意。** 列下面的数是数值，列上面点的个数才是人数。",
      ],
      (rng) => {
        const s = rng.pick(surveys);
        const values = wholePlotData(rng, s);
        const n = values.length;
        const figure = surveyPlot(values, s);
        const cols = [...new Set(values)];
        const kind = rng.int(0, 2);
        const v = rng.pick(values);
        if (kind === 0) {
          const c = countOf(values, v);
          return answered(
            [
              `The line plot shows ${s.what.en}. How many students had ${v} ${s.each.en}?`,
              `线图表示${s.what["zh-CN"]}。数值是 ${v} 的学生有几名？`,
            ],
            c,
            [
              [
                ["Find the value", "找到数值"],
                [`Find ${v} on the number line.`, `在数轴上找到 ${v}。`],
              ],
              [
                ["Count the dots", "数点"],
                [
                  `There ${c === 1 ? "is 1 dot" : `are ${c} dots`} above ${v}. Each dot is one student.`,
                  `${v} 的上方有 ${c} 个点，每个点代表一名学生。`,
                ],
              ],
            ],
            [
              `There are ${n} dots in all, and ${n - c} of them are not above ${v}: $${n} - ${n - c} = ${c}$.`,
              `一共有 ${n} 个点，其中 ${n - c} 个不在 ${v} 的上方：$${n} - ${n - c} = ${c}$。`,
            ],
            [
              [v, "That is the value, not how many dots are above it.", "这是数值本身，不是它上方点的个数。"],
              [n, `That counts every dot, not just the ones above ${v}.`, `这数了所有的点，不只是 ${v} 上方的点。`],
              [countOf(values, v + 1), `That counts the dots above ${v + 1}.`, `这数的是 ${v + 1} 上方的点。`],
            ],
            { form: "integer", figure },
          );
        }
        if (kind === 1) {
          const tallest = Math.max(...cols.map((x) => countOf(values, x)));
          const rows = Array.from({ length: tallest }, (_, r) => cols.filter((x) => countOf(values, x) > r).length);
          return answered(
            [`The line plot shows ${s.what.en}. How many students are shown in all?`, `线图表示${s.what["zh-CN"]}。图中一共有几名学生？`],
            n,
            [
              [
                ["Count each column", "数每一列"],
                [
                  `${cols.map((x) => `${countOf(values, x)} above ${x}`).join(", ")}.`,
                  `${cols.map((x) => `${x} 的上方有 ${countOf(values, x)} 个`).join("，")}。`,
                ],
              ],
              [
                ["Add", "相加"],
                [
                  `$${cols.map((x) => countOf(values, x)).join(" + ")} = ${n}$. Each dot is one student.`,
                  `$${cols.map((x) => countOf(values, x)).join(" + ")} = ${n}$。每个点代表一名学生。`,
                ],
              ],
            ],
            [
              `Count the dots row by row from the bottom instead: $${rows.join(" + ")} = ${n}$.`,
              `换一种数法，从下往上一行一行地数：$${rows.join(" + ")} = ${n}$。`,
            ],
            [
              [s.max - s.min + 1, "That counts the numbers on the line, not the dots.", "这数的是数轴上的数，不是点。"],
              [cols.length, "That counts the columns, not the dots in them.", "这数的是有点的列数，不是点的个数。"],
              [n - 1, "That misses one dot.", "这漏数了一个点。"],
            ],
            { form: "integer", figure },
          );
        }
        const w = Math.max(v, Math.min(...values) + 1);
        const atLeast = values.filter((x) => x >= w).length;
        const chosen = cols.filter((x) => x >= w);
        return answered(
          [
            `The line plot shows ${s.what.en}. How many students had ${w} or more ${s.each.en}?`,
            `线图表示${s.what["zh-CN"]}。数值不小于 ${w} 的学生有几名？`,
          ],
          atLeast,
          [
            [
              ["Pick the columns", "找出要数的列"],
              [`The values ${w} or more that have dots are ${chosen.join(", ")}.`, `不小于 ${w} 并且有点的数值是 ${chosen.join("、")}。`],
            ],
            [
              ["Add their dots", "把这些列的点加起来"],
              [
                `$${chosen.map((x) => countOf(values, x)).join(" + ")} = ${atLeast}$.`,
                `$${chosen.map((x) => countOf(values, x)).join(" + ")} = ${atLeast}$。`,
              ],
            ],
          ],
          [
            `There are ${n - atLeast} dots below ${w}, and $${n} - ${n - atLeast} = ${atLeast}$.`,
            `${w} 左边有 ${n - atLeast} 个点，$${n} - ${n - atLeast} = ${atLeast}$。`,
          ],
          [
            [countOf(values, w), `That counts only the dots above ${w}.`, `这只数了 ${w} 上方的点。`],
            [atLeast - countOf(values, w), `That leaves out the dots above ${w} itself.`, `这漏掉了 ${w} 本身上方的点。`],
            [n - atLeast, `That counts the dots below ${w}.`, `这数的是比 ${w} 小的点。`],
          ],
          { form: "integer", figure },
        );
      },
      petsPlot(),
    ),
    point(
      "comparing-values-in-line-plots",
      ["Greatest, least and most common", "最大值、最小值和出现最多的值"],
      [
        "On Ana's line plot of pets, the dot furthest right is above 4 and the dot furthest left is above 0. The greatest and least answers differ by $4 - 0 = 4$. The tallest column is above 2, so 2 is the most common answer.\n\nCheck: count the steps along the line from 0 to 4. There are 4.\n\n> **Watch out.** Use the values under the end dots, not the numbers at the ends of the line.",
        "在安娜的宠物线图上，最右边的点在 4 上方，最左边的点在 0 上方。最大值与最小值相差 $4 - 0 = 4$。最高的一列在 2 上方，所以 2 是出现最多的回答。\n\n检验：在数轴上从 0 数到 4，一共 4 格。\n\n> **注意。** 要用两端的点所对的数值，不能用数轴两端的数。",
      ],
      (rng) => {
        const s = rng.pick(surveys);
        let values: number[];
        do values = wholePlotData(rng, s);
        while (new Set(values).size < 3);
        const hi = Math.max(...values);
        const lo = Math.min(...values);
        if (rng.bool()) {
          return answered(
            [
              `The line plot shows ${s.what.en}. What is the difference between the greatest and the least value?`,
              `线图表示${s.what["zh-CN"]}。最大值与最小值相差多少？`,
            ],
            hi - lo,
            [
              [
                ["Find the ends", "找出两端"],
                [
                  `The dot furthest right is above ${hi}. The dot furthest left is above ${lo}.`,
                  `最右边的点在 ${hi} 上方，最左边的点在 ${lo} 上方。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [`$${hi} - ${lo} = ${hi - lo}$.`, `$${hi} - ${lo} = ${hi - lo}$。`],
              ],
            ],
            [
              `Count the steps along the line from ${lo} to ${hi}. There are ${hi - lo}.`,
              `在数轴上从 ${lo} 数到 ${hi}，一共 ${hi - lo} 格。`,
            ],
            [
              [hi, "That is the greatest value, not the difference.", "这是最大值，不是差。"],
              [hi + lo, "That adds the two values instead of subtracting.", "这是把两个数值相加了，应该相减。"],
              [s.max - s.min, "That uses the ends of the number line, not the end dots.", "这用了数轴两端的数，不是两端的点。"],
              [countOf(values, hi), "That counts the dots above the greatest value.", "这数的是最大值上方的点。"],
            ],
            { form: "integer", figure: surveyPlot(values, s) },
          );
        }
        const most = Math.max(...values.map((v) => countOf(values, v)));
        const modes = [...new Set(values)].filter((v) => countOf(values, v) === most);
        if (modes.length > 1) values.push(modes[0]!);
        const mode = modes[0]!;
        const top = countOf(values, mode);
        const next = Math.max(...[...new Set(values)].filter((v) => v !== mode).map((v) => countOf(values, v)));
        return answered(
          [`The line plot shows ${s.what.en}. Which value occurs most often?`, `线图表示${s.what["zh-CN"]}。哪个数值出现的次数最多？`],
          mode,
          [
            [
              ["Find the tallest column", "找最高的一列"],
              [`The tallest column has ${top} dots.`, `最高的一列有 ${top} 个点。`],
            ],
            [
              ["Read its value", "读出它的数值"],
              [`That column is above ${mode}.`, `这一列在 ${mode} 的上方。`],
            ],
          ],
          [
            `Every other column is shorter: the next tallest has ${next} ${next === 1 ? "dot" : "dots"}.`,
            `其他各列都更矮：第二高的一列只有 ${next} 个点。`,
          ],
          [
            [top, "That is how many dots are in the column, not its value.", "这是这一列点的个数，不是它的数值。"],
            [hi, "That is the greatest value, not the most common one.", "这是最大值，不是出现最多的值。"],
            [lo, "That is the least value, not the most common one.", "这是最小值，不是出现最多的值。"],
          ],
          { form: "integer", figure: surveyPlot(values, s) },
        );
      },
      petsPlot(),
    ),
  ],
  t(
    "Ana asks her class how many pets each child has. She draws a number line and puts one dot above a number for each answer. One look shows which answer is the most common.\n\nCheck: count all the dots. There is one for each child.\n\nIn this lesson we read line plots: how many dots sit above a value, how many there are in all, and how values compare.",
    "安娜问全班同学每人养几只宠物。她画了一条数轴，每个回答就在对应的数上方画一个点。看一眼就知道哪个回答最多。\n\n检验：数一数所有的点，每名同学正好一个。\n\n本课我们学习读线图：一个数值上方有几个点，一共有几个点，以及怎样比较数值。",
  ),
);

/** fractionLabel writes k/d for a figure, reduced, with whole numbers and mixed numbers: "1 1/4". */
function fractionLabel(k: number, d: number): string {
  const w = Math.floor(k / d);
  const r = k % d;
  if (r === 0) return String(w);
  const gg = gcd(r, d);
  const f = `${r / gg}/${d / gg}`;
  return w === 0 ? f : `${w} ${f}`;
}

/** fractionPlot draws a line plot of values counted in steps of 1/d from lo to hi steps. */
export function fractionPlot(values: readonly number[], d: number, lo: number, hi: number): string {
  const x = (k: number) => Math.round((20 + ((k - lo) / (hi - lo)) * 280) * 100) / 100;
  const tallest = Math.max(...[...new Set(values)].map((v) => countOf(values, v)));
  const base = 12 + tallest * 14;
  let body = "";
  for (const v of new Set(values))
    for (let i = 0; i < countOf(values, v); i++)
      body += `<circle class="accent" cx="${x(v)}" cy="${base - 4 - i * 14}" r="5" fill="currentColor" stroke="none"/>`;
  const y = base + 4;
  body += `<line x1="${x(lo)}" y1="${y}" x2="${x(hi)}" y2="${y}"/>`;
  for (let k = lo; k <= hi; k++)
    body += `<line x1="${x(k)}" y1="${y - 4}" x2="${x(k)}" y2="${y + 4}"/>${d === 8 && k % 2 === 1 ? "" : `<text x="${x(k)}" y="${y + 18}" stroke="none" fill="currentColor" font-size="10">${fractionLabel(k, d)}</text>`}`;
  return svgDocument(base + 28, body);
}

/** fracTex writes k/d reduced in LaTeX. */
const fracTex = (k: number, d: number) => Q.of(k, d).toLatex();

export const creatingAndInterpretingLinePlotsWithFractions = topic(
  "creating-and-interpreting-line-plots-with-fractions",
  t("Creating and Interpreting Line Plots With Fractions", "绘制和解读分数线图"),
  t(
    "Line plots can show measurements in fractions of a unit, such as lengths to the nearest eighth of an inch. Fraction addition and subtraction then answer questions about the data: the difference between the longest and shortest, or the total of all values.",
    "线图也可以表示以分数为单位的测量结果，例如精确到八分之一英寸的长度。再用分数加减法回答有关数据的问题：最长与最短相差多少，或所有数据的总和是多少。",
  ),
  ["creating-and-interpreting-line-plots", "subtracting-fractions-with-like-denominators"],
  ["4.MD.B.4"],
  [
    point(
      "differences-in-fraction-line-plots",
      ["Longest minus shortest", "最长减最短"],
      [
        "Ben measured some pencils to the nearest quarter inch and made a line plot. The longest is $5\\frac{3}{4}$ inches and the shortest is $4\\frac{1}{4}$ inches. The difference is $5\\frac{3}{4} - 4\\frac{1}{4} = 1\\frac{2}{4}$, which is $1\\frac{1}{2}$ inches.\n\nCheck: $4\\frac{1}{4} + 1\\frac{1}{2} = 5\\frac{3}{4}$.\n\n> **Watch out.** Subtract the values at the two ends. How many dots they have does not matter.",
        "本把一些铅笔量到最接近的四分之一英寸，画成线图。最长的是 $5\\frac{3}{4}$ 英寸，最短的是 $4\\frac{1}{4}$ 英寸。二者相差 $5\\frac{3}{4} - 4\\frac{1}{4} = 1\\frac{2}{4}$，也就是 $1\\frac{1}{2}$ 英寸。\n\n检验：$4\\frac{1}{4} + 1\\frac{1}{2} = 5\\frac{3}{4}$。\n\n> **注意。** 用两端的数值相减，和它们上方有几个点无关。",
      ],
      (rng) => {
        const d = rng.pick([4, 8]);
        const lo = rng.int(1, 4) * d;
        const hi = lo + rng.int(d - 2, d + 3);
        let values: number[];
        do values = Array.from({ length: rng.int(8, 12) }, () => rng.int(lo, hi));
        while (new Set(values).size < 3);
        const a = Math.max(...values);
        const b = Math.min(...values);
        const [A, B, D] = [mixedLatex(Q.of(a, d)), mixedLatex(Q.of(b, d)), mixedLatex(Q.of(a - b, d))];
        const what = rng.pick([t("pencils", "铅笔"), t("ribbons", "丝带"), t("worms", "虫子")]);
        return answered(
          [
            `The line plot shows the lengths, in inches, of some ${what.en}. How much longer is the longest than the shortest?`,
            `线图表示一些${what["zh-CN"]}的长度（单位：英寸）。最长的比最短的长多少英寸？`,
          ],
          Q.of(a - b, d),
          [
            [
              ["Find the ends", "找出两端"],
              [
                `The dot furthest right is at $${A}$ inches and the dot furthest left at $${B}$ inches.`,
                `最右边的点在 $${A}$ 英寸，最左边的点在 $${B}$ 英寸。`,
              ],
            ],
            [
              ["Subtract", "相减"],
              [`$${A} - ${B} = ${D}$.`, `$${A} - ${B} = ${D}$。`],
            ],
          ],
          [`Add back: $${B} + ${D} = ${A}$.`, `加回去：$${B} + ${D} = ${A}$。`],
          [
            [Q.of(a, d), "That is the longest length, not the difference.", "这是最长的长度，不是差。"],
            [Q.of(a + b, d), "That adds the two lengths instead of subtracting.", "这是把两个长度相加了，应该相减。"],
            [countOf(values, a), "That counts the dots above the longest length.", "这数的是最长长度上方的点。"],
          ],
          {
            figure: {
              svg: fractionPlot(values, d, lo, hi),
              alt: t(`A line plot of lengths in inches, marked in steps of 1/${d} inch.`, `长度（英寸）的线图，刻度间隔为 1/${d} 英寸。`),
            },
          },
        );
      },
      {
        svg: fractionPlot([17, 18, 18, 19, 20, 20, 21, 23], 4, 16, 24),
        alt: t(
          "A line plot of pencil lengths from 4 to 6 inches in quarter inches, with the shortest dot at 4 1/4 and the longest at 5 3/4.",
          "铅笔长度的线图，从 4 到 6 英寸，每格四分之一英寸，最短的点在 4 1/4，最长的点在 5 3/4。",
        ),
      },
    ),
    point(
      "totals-in-fraction-line-plots",
      ["Totals of fractional values", "分数数据的总和"],
      [
        "A line plot shows how much juice is in some glasses. There are 3 dots above $\\frac{1}{4}$ liter, so 3 glasses hold $\\frac{1}{4}$ liter each. Together they hold $3 \\times \\frac{1}{4} = \\frac{3}{4}$ liter.\n\nCheck: $\\frac{1}{4} + \\frac{1}{4} + \\frac{1}{4} = \\frac{3}{4}$.\n\n> **Watch out.** The dots tell how many glasses. Multiply by the amount in each glass to get the liters.",
        "线图表示一些杯子里的果汁量。$\\frac{1}{4}$ 升的上方有 3 个点，所以有 3 杯各装 $\\frac{1}{4}$ 升。合起来是 $3 \\times \\frac{1}{4} = \\frac{3}{4}$ 升。\n\n检验：$\\frac{1}{4} + \\frac{1}{4} + \\frac{1}{4} = \\frac{3}{4}$。\n\n> **注意。** 点的个数是杯数。要乘每杯的量，才得到一共多少升。",
      ],
      (rng) => {
        const d = rng.pick([4, 8]);
        let values: number[];
        do values = Array.from({ length: rng.int(7, 11) }, () => rng.int(1, d - 1));
        while (new Set(values).size < 3 || new Set(values).size === values.length);
        const v = rng.pick(values.filter((x) => countOf(values, x) >= 2));
        const c = countOf(values, v);
        const total = Q.of(c * v, d);
        const f = fracTex(v, d);
        return answered(
          [
            `The line plot shows how much water, in liters, is in some bottles. What is the total amount of water in the bottles that each hold $${f}$ liter?`,
            `线图表示一些瓶子里的水量（单位：升）。每瓶装 $${f}$ 升的那些瓶子一共装了多少升水？`,
          ],
          total,
          [
            [
              ["Count the dots", "数点"],
              [
                `There are ${c} dots above $${f}$, so ${c} bottles hold $${f}$ liter each.`,
                `$${f}$ 的上方有 ${c} 个点，所以有 ${c} 瓶各装 $${f}$ 升。`,
              ],
            ],
            [
              ["Multiply", "相乘"],
              [`$${c} \\times ${f} = ${mixedLatex(total)}$.`, `$${c} \\times ${f} = ${mixedLatex(total)}$。`],
            ],
          ],
          [
            `Add one bottle at a time: $${Array.from({ length: c }, () => f).join(" + ")} = ${mixedLatex(total)}$.`,
            `一瓶一瓶地加：$${Array.from({ length: c }, () => f).join(" + ")} = ${mixedLatex(total)}$。`,
          ],
          [
            [Q.of(v, d), "That is one bottle only.", "这只是一瓶的水量。"],
            [c, "That counts the bottles, not the water.", "这是瓶数，不是水量。"],
            [Q.of(c + v, d), "That adds the count to the top number instead of multiplying.", "这是把瓶数加到分子上了，应该相乘。"],
          ],
          {
            figure: {
              svg: fractionPlot(values, d, 0, d),
              alt: t(
                `A line plot of amounts of water in liters, marked in steps of 1/${d} liter.`,
                `水量（升）的线图，刻度间隔为 1/${d} 升。`,
              ),
            },
          },
        );
      },
      {
        svg: fractionPlot([1, 1, 1, 2, 3, 3], 4, 0, 4),
        alt: t(
          "A line plot of juice in liters from 0 to 1 in quarter liters, with 3 dots above 1/4.",
          "果汁量（升）的线图，从 0 到 1，每格四分之一升，1/4 的上方有 3 个点。",
        ),
      },
    ),
  ],
  t(
    "Ben measures 8 pencils to the nearest quarter inch. The lengths are fractions, so his number line is marked in quarters. He puts a dot above each length.\n\nCheck: there are 8 dots, one for each pencil.\n\nIn this lesson we read line plots of fractions and use adding, subtracting and multiplying to answer questions about them.",
    "本把 8 支铅笔量到最接近的四分之一英寸。长度是分数，所以他的数轴按四分之一来分格。每个长度就在上方画一个点。\n\n检验：一共 8 个点，每支铅笔一个。\n\n本课我们学习读分数线图，并用加、减、乘来回答有关的问题。",
  ),
);

// ---------------------------------------------------------------------------
// Geometry

const rad = (d: number) => (d * Math.PI) / 180;

/** dir is the point at distance r from the origin in direction d degrees. */
const dir = (d: number, r = 5): Point => [r * Math.cos(rad(d)), r * Math.sin(rad(d))];

const figureOf = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** FigureKind is one of the basic figures of geometry. */
type FigureKind = "point" | "segment" | "ray" | "line";

const figureKinds: readonly FigureKind[] = ["point", "segment", "ray", "line"];
const figureNames: Record<FigureKind, Text> = {
  point: t("A point", "点"),
  segment: t("A line segment", "线段"),
  ray: t("A ray", "射线"),
  line: t("A line", "直线"),
};

/** figureLooks describes each basic figure by what can be seen, without naming it. */
const figureLooks: Record<FigureKind, Text> = {
  point: t("A single dot labeled with a letter.", "一个用字母标注的点状标记。"),
  segment: t("A straight path between two labeled dots, with no arrowheads.", "两个标有字母的点之间的一条直路径，没有箭头。"),
  ray: t(
    "A straight path from a labeled dot through another labeled dot, with one arrowhead.",
    "一条直路径从一个标有字母的点出发，经过另一个标有字母的点，有一个箭头。",
  ),
  line: t("A straight path through two labeled dots, with arrowheads at both ends.", "一条直路径经过两个标有字母的点，两端都有箭头。"),
};

/** basicFigureSvg draws a point, segment, ray or line through A and B, with arrowheads on the ends that go on forever. */
function basicFigureSvg(kind: FigureKind, angle: number): string {
  const c = Math.cos(rad(angle));
  const s = -Math.sin(rad(angle));
  const [ax, ay] = [160 - 90 * c, 50 - 30 * s];
  const [bx, by] = [160 + 90 * c, 50 + 30 * s];
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const arrow = (x: number, y: number, dx: number, dy: number) => {
    const n = Math.hypot(dx, dy);
    const [ux, uy] = [dx / n, dy / n];
    return `<polyline points="${r2(x - 9 * ux - 5 * uy)},${r2(y - 9 * uy + 5 * ux)} ${r2(x)},${r2(y)} ${r2(x - 9 * ux + 5 * uy)},${r2(y - 9 * uy - 5 * ux)}"/>`;
  };
  const dot = (x: number, y: number) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="3.5" fill="currentColor" stroke="none"/>`;
  const label = (x: number, y: number, text: string) =>
    `<text x="${r2(x)}" y="${r2(y - 12)}" stroke="none" fill="currentColor" font-style="italic">${text}</text>`;
  if (kind === "point") return svgDocument(100, dot(160, 50) + label(160, 50, "A"));
  const [ex1, ey1] = kind === "line" ? [ax - 40 * c, ay - 40 * s] : [ax, ay];
  const [ex2, ey2] = kind === "segment" ? [bx, by] : [bx + 40 * c, by + 40 * s];
  let body = `<line class="accent" x1="${r2(ex1)}" y1="${r2(ey1)}" x2="${r2(ex2)}" y2="${r2(ey2)}"/>`;
  if (kind !== "segment") body += arrow(ex2, ey2, c, s);
  if (kind === "line") body += arrow(ex1, ey1, -c, -s);
  body += dot(ax, ay) + dot(bx, by) + label(ax, ay, "A") + label(bx, by, "B");
  return svgDocument(100, body);
}

/** pointsOnLine draws a line with labeled points spaced along it. */
function pointsOnLine(letters: readonly string[]): Figure {
  const marks: Mark[] = [{ kind: "segment", a: [-0.6, 0], b: [(letters.length - 1) * 1.5 + 0.6, 0] }];
  letters.forEach((l, i) => {
    marks.push({ kind: "dot", at: [i * 1.5, 0] }, { kind: "label", at: [i * 1.5, 0], text: l, dir: "n", italic: true });
  });
  return figureOf(marks, `Points ${letters.join(", ")} in order on a line.`, `点 ${letters.join("、")} 依次在一条直线上。`);
}

/** figureDefs describes what each basic figure looks like, as a reason against choosing it. */
const figureDefs: Record<FigureKind, Pair> = {
  point: ["A point is a single dot with no length.", "点只是一个位置，没有长短。"],
  segment: ["A segment has two endpoints and no arrowheads.", "线段有两个端点，没有箭头。"],
  ray: ["A ray has one endpoint and one arrowhead.", "射线有一个端点和一个箭头。"],
  line: ["A line has an arrowhead at each end.", "直线两端都有箭头。"],
};

export const pointsLinesRaysAndSegments = topic(
  "points-lines-rays-and-segments",
  t("Points, Lines, Rays, and Segments", "点、直线、射线和线段"),
  t(
    "A point marks a location. A line goes on forever in both directions (drawn with two arrowheads); a ray starts at an endpoint and goes on forever in one direction; a line segment is the part of a line between two endpoints. Line AB is written AB with a double arrow, ray AB with one arrow, and segment AB with a bar.",
    "点表示一个位置。直线向两端无限延伸（画两个箭头）；射线从一个端点出发向一端无限延伸；线段是直线上两个端点之间的部分。直线 AB、射线 AB、线段 AB 分别在 AB 上方画双箭头、单箭头和横线来表示。",
  ),
  [],
  ["4.G.A.1"],
  [
    point(
      "naming-basic-figures",
      ["Which figure is it?", "这是什么图形"],
      [
        "A flashlight beam starts at the lamp and shines on and on. Drawn, it has one endpoint and one arrowhead: a ray. A piece of string has two ends and no arrowheads: a segment. A line has an arrowhead at each end, because it goes on both ways.\n\nCheck: count the endpoints. A segment has 2, a ray 1 and a line 0.\n\n> **Watch out.** A figure with only one arrowhead is a ray, not a line.",
        "手电筒的光从灯头出发，一直照向远方。画出来，它有一个端点和一个箭头：是射线。一段绳子有两头，没有箭头：是线段。直线两端都有箭头，因为它向两边无限延伸。\n\n检验：数端点。线段有 2 个，射线有 1 个，直线没有。\n\n> **注意。** 只有一个箭头的是射线，不是直线。",
      ],
      (rng) => {
        const kind = rng.pick(figureKinds);
        const angle = rng.pick([0, 10, 20, 30, -10, -20, -30, 160, 170, 190, 200]);
        const name = (k: FigureKind): Pair => [figureNames[k].en, figureNames[k]["zh-CN"]];
        const ends: Record<FigureKind, Pair> = {
          point: ["It is a single dot. It has no length.", "它只是一个点，没有长短。"],
          segment: ["It has two endpoints and no arrowheads.", "它有两个端点，没有箭头。"],
          ray: ["It has one endpoint and one arrowhead.", "它有一个端点和一个箭头。"],
          line: ["It has an arrowhead at each end.", "它两端都有箭头。"],
        };
        const means: Record<FigureKind, Pair> = {
          point: ["It marks one place, so it is a point.", "它只表示一个位置，所以是点。"],
          segment: ["It stops at both ends, so it is a line segment.", "它两头都不延伸，所以是线段。"],
          ray: ["It goes on forever one way, so it is a ray.", "它向一个方向无限延伸，所以是射线。"],
          line: ["It goes on forever both ways, so it is a line.", "它向两个方向无限延伸，所以是直线。"],
        };
        const count: Record<FigureKind, Pair> = {
          point: ["It has no length at all, which only a point lacks.", "它完全没有长短，只有点是这样。"],
          segment: ["Count the endpoints: 2. Only a segment has two.", "数端点：2 个。只有线段有两个端点。"],
          ray: ["Count the endpoints: 1. Only a ray has one.", "数端点：1 个。只有射线有一个端点。"],
          line: [
            "Count the endpoints: none, yet it has length. Only a line is like that.",
            "数端点：一个也没有，却有长短。只有直线是这样。",
          ],
        };
        return picked(
          rng,
          ["What is shown in the figure?", "图中画的是什么？"],
          name(kind),
          figureKinds.filter((k) => k !== kind).map((k) => [name(k), figureDefs[k][0], figureDefs[k][1]] as const),
          [
            [["Look at the ends", "看两端"], ends[kind]],
            [["Name it", "说出名称"], means[kind]],
          ],
          count[kind],
          { svg: basicFigureSvg(kind, angle), alt: figureLooks[kind] },
        );
      },
      { svg: basicFigureSvg("ray", 20), alt: figureLooks.ray },
    ),
    point(
      "counting-segments-and-rays",
      ["Counting segments", "数线段"],
      [
        "Points $A$, $B$, $C$ and $D$ lie on a line. From $A$ there are the segments $AB$, $AC$ and $AD$. From $B$ there are $BC$ and $BD$, and from $C$ there is $CD$. That makes $3 + 2 + 1 = 6$ segments.\n\nCheck: each of the 4 points pairs with 3 others, and each segment is counted from both its ends, so $4 \\times 3 \\div 2 = 6$.\n\n> **Watch out.** Long segments count too. $AC$ and $AD$ are segments, not just the short ones between neighbors.",
        "点 $A$、$B$、$C$、$D$ 在一条直线上。从 $A$ 出发有线段 $AB$、$AC$、$AD$；从 $B$ 出发有 $BC$、$BD$；从 $C$ 出发有 $CD$。一共 $3 + 2 + 1 = 6$ 条线段。\n\n检验：4 个点每个都和另外 3 个点配对，每条线段从两端各数了一次，所以 $4 \\times 3 \\div 2 = 6$。\n\n> **注意。** 长线段也要数。$AC$ 和 $AD$ 也是线段，不只是相邻两点之间的短线段。",
      ],
      (rng) => {
        const n = rng.int(3, 8);
        const first = rng.int(0, 12);
        const letters = "ABCDEFGHIJKLMNOPQRSTUVW".slice(first, first + n).split("");
        const segments = (n * (n - 1)) / 2;
        const list = `$${letters.join(", ")}$`;
        const figure = pointsOnLine(letters);
        if (rng.bool(0.3)) {
          const answer = 2 * (n - 1);
          return answered(
            [
              `Points ${list} lie in that order on a line. How many rays start at one of these points and pass through another of them?`,
              `点 ${list} 依次在一条直线上。从其中一点出发、经过其中另一点的射线有几条？`,
            ],
            answer,
            [
              [
                ["Rays to the right", "向右的射线"],
                [
                  `Every point but the last starts a ray to the right: ${n - 1}.`,
                  `除了最右边的点，每个点都能向右引一条射线：${n - 1} 条。`,
                ],
              ],
              [
                ["Rays to the left", "向左的射线"],
                [
                  `Every point but the first starts a ray to the left: ${n - 1}. In all, $${n - 1} + ${n - 1} = ${answer}$.`,
                  `除了最左边的点，每个点都能向左引一条射线：${n - 1} 条。一共 $${n - 1} + ${n - 1} = ${answer}$ 条。`,
                ],
              ],
            ],
            [
              `The ${n - 2} middle points start 2 rays each and the 2 end points start 1 each: $${n - 2} \\times 2 + 2 = ${answer}$.`,
              `中间的 ${n - 2} 个点各引 2 条，两端的 2 个点各引 1 条：$${n - 2} \\times 2 + 2 = ${answer}$。`,
            ],
            [
              [n - 1, "That counts the rays going one way only.", "这只数了一个方向的射线。"],
              [segments, "That counts segments, not rays.", "这数的是线段，不是射线。"],
              [n, "That counts the points.", "这数的是点。"],
            ],
            { form: "integer", figure },
          );
        }
        const terms = Array.from({ length: n - 1 }, (_, i) => n - 1 - i);
        return answered(
          [
            `Points ${list} lie on a line. How many line segments have two of these points as endpoints?`,
            `点 ${list} 在一条直线上。以其中两点为端点的线段有几条？`,
          ],
          segments,
          [
            [
              ["Pair the first point", "第一个点配对"],
              [`$${letters[0]}$ pairs with the ${n - 1} points after it.`, `$${letters[0]}$ 和它后面的 ${n - 1} 个点各组成一条线段。`],
            ],
            [
              ["Pair the rest", "其余的点配对"],
              [
                `The next point pairs with ${n - 2}, and so on: $${terms.join(" + ")} = ${segments}$.`,
                `下一个点和后面的 ${n - 2} 个点配对，依此类推：$${terms.join(" + ")} = ${segments}$。`,
              ],
            ],
          ],
          [
            `Each point pairs with ${n - 1} others, and each segment is counted from both ends: $${n} \\times ${n - 1} \\div 2 = ${segments}$.`,
            `每个点和另外 ${n - 1} 个点配对，每条线段从两端各数了一次：$${n} \\times ${n - 1} \\div 2 = ${segments}$。`,
          ],
          [
            [n - 1, "That counts only the short segments between neighbors.", "这只数了相邻两点之间的短线段。"],
            [n, "That counts the points.", "这数的是点。"],
            [n * (n - 1), "That counts each segment twice, once from each end.", "这把每条线段从两端各数了一次，数重了。"],
          ],
          { form: "integer", figure },
        );
      },
      pointsOnLine(["A", "B", "C", "D"]),
    ),
  ],
  t(
    "A flashlight beam starts at the lamp and goes on and on. A piece of string has two ends. A road that runs off both edges of a map keeps going both ways. These are a ray, a segment and a line.\n\nCheck: the beam has one end, the string two and the road none.\n\nIn this lesson we name points, lines, rays and segments and count the segments and rays on a line.",
    "手电筒的光从灯头出发一直向前。一段绳子有两头。地图上一条伸出两边的路向两头一直延伸。它们分别是射线、线段和直线。\n\n检验：光束有一个端点，绳子有两个，路一个也没有。\n\n本课我们认识点、直线、射线和线段，并数一条直线上的线段和射线。",
  ),
);

/** turnFractions are fractions a/b of a full turn whose degree measure is a whole number. */
const turnFractions: readonly [number, number][] = [
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
  [1, 8],
  [3, 8],
  [5, 8],
  [7, 8],
  [1, 9],
  [2, 9],
  [1, 10],
  [3, 10],
  [7, 10],
  [1, 12],
  [5, 12],
  [7, 12],
  [1, 36],
  [1, 360],
];

/** turnFigure draws a circle cut into n equal parts by radii, shading the first k parts counterclockwise from the right and labeling each shaded part with its angle. */
function turnFigure(n: number, k: number, alt: Text): Figure {
  const on = (d: number, r = 3): Point => [r * Math.cos((d * Math.PI) / 180), r * Math.sin((d * Math.PI) / 180)];
  const part = 360 / n;
  const sector: Point[] = [[0, 0], ...Array.from({ length: k * 12 + 1 }, (_, i) => on((i * part) / 12))];
  const marks: Mark[] = [
    { kind: "shade", points: sector },
    { kind: "polygon", points: Array.from({ length: 96 }, (_, i) => on(i * 3.75)) },
    ...Array.from({ length: n }, (_, i): Mark => ({ kind: "segment", a: [0, 0], b: on(i * part) })),
    ...Array.from({ length: k }, (_, i): Mark => ({ kind: "label", at: on((i + 0.5) * part, 1.8), text: `${part}°`, dir: "n" })),
    { kind: "dot", at: [0, 0] },
  ];
  return { svg: sketch(marks), alt };
}

export const connectingAnglesAndCircles = topic(
  "connecting-angles-and-circles",
  t("Connecting Angles and Circles", "角与圆"),
  t(
    "An angle is measured by how much of a circle around its vertex it cuts off. A full turn is 360°, so an angle that turns through 1/360 of a circle measures 1°, and one that turns through a/b of a circle measures a/b × 360°.",
    "角的大小用它在以顶点为圆心的圆上截取的部分来度量。转一整圈是 360°，所以转过圆的 1/360 的角是 1°，转过圆的 a/b 的角是 a/b × 360°。",
  ),
  ["angles-and-angle-measures", "multiplying-fractions-by-whole-numbers"],
  ["4.MD.C.5"],
  [
    point(
      "degrees-from-fractions-of-a-turn",
      ["From a fraction of a turn to degrees", "由几分之几圈求度数"],
      [
        "A pizza is cut into 4 equal slices, and each slice has its corner at the center. One slice is $360^\\circ \\div 4 = 90^\\circ$. Three slices are $3 \\times 90^\\circ = 270^\\circ$, so $\\frac{3}{4}$ of a turn is $270^\\circ$.\n\nCheck: the last slice is $90^\\circ$, and $270^\\circ + 90^\\circ = 360^\\circ$.\n\n> **Watch out.** A full turn is $360^\\circ$. Divide $360$ by the bottom number, not $100$ or $180$.",
        "一张比萨饼平均切成 4 块，每块的尖角都在圆心。一块是 $360^\\circ \\div 4 = 90^\\circ$。三块是 $3 \\times 90^\\circ = 270^\\circ$，所以 $\\frac{3}{4}$ 圈是 $270^\\circ$。\n\n检验：剩下一块是 $90^\\circ$，$270^\\circ + 90^\\circ = 360^\\circ$。\n\n> **注意。** 一整圈是 $360^\\circ$。要用 $360$ 除以分母，不是用 $100$ 或 $180$。",
      ],
      (rng) => {
        const [a, b] = rng.pick(turnFractions);
        const part = 360 / b;
        const v = part * a;
        const name = rng.pick(names);
        return answered(
          rng.bool()
            ? [
                `An angle turns through $${fracTex(a, b)}$ of a circle. What is its measure in degrees?`,
                `一个角转过了圆的 $${fracTex(a, b)}$。它是多少度？`,
              ]
            : [
                `${name} turns through $${fracTex(a, b)}$ of a full turn. How many degrees did ${name} turn?`,
                `${name} 转了一整圈的 $${fracTex(a, b)}$。${name} 转了多少度？`,
              ],
          v,
          [
            [
              ["Find one part", "求一份"],
              [`$360^\\circ \\div ${b} = ${part}^\\circ$.`, `$360^\\circ \\div ${b} = ${part}^\\circ$。`],
            ],
            [
              [`Take ${a} ${a === 1 ? "part" : "parts"}`, `取 ${a} 份`],
              [`$${a} \\times ${part}^\\circ = ${v}^\\circ$.`, `$${a} \\times ${part}^\\circ = ${v}^\\circ$。`],
            ],
          ],
          [
            `The rest of the turn is $${b - a} \\times ${part}^\\circ = ${360 - v}^\\circ$, and $${v}^\\circ + ${360 - v}^\\circ = 360^\\circ$.`,
            `剩下的是 $${b - a} \\times ${part}^\\circ = ${360 - v}^\\circ$，$${v}^\\circ + ${360 - v}^\\circ = 360^\\circ$。`,
          ],
          [
            [part, "That is just one part of the turn.", "这只是一份的度数。"],
            [360 - v, "That is the rest of the turn.", "这是一圈中剩下的部分。"],
            ...(Number.isInteger((180 / b) * a)
              ? ([[(180 / b) * a, "That uses 180° for a full turn. A full turn is 360°.", "这把一整圈当成了 180°，其实是 360°。"]] as const)
              : []),
          ],
          {
            form: "integer",
            unit: "°",
            ...(b <= 12 && {
              figure: turnFigure(
                b,
                a,
                t(`A circle cut into ${b} equal parts with ${a} shaded.`, `一个圆平均分成 ${b} 份，其中 ${a} 份涂色。`),
              ),
            }),
          },
        );
      },
      turnFigure(
        4,
        3,
        t(
          "A circle cut into 4 equal parts by radii from its center. Three of the parts are shaded, each a 90° angle at the center, so 3/4 of a turn is 270°.",
          "一个圆被从圆心出发的半径分成 4 等份。其中 3 份涂上阴影，每份是圆心处的一个 90° 角，所以 3/4 圈是 270°。",
        ),
      ),
    ),
    point(
      "fractions-of-a-turn-from-degrees",
      ["From degrees to a fraction of a turn", "由度数求几分之几圈"],
      [
        "A round cake is cut into 3 equal pieces. The corner of one piece is $120^\\circ$. As a fraction of a full turn it is $\\frac{120}{360}$. Dividing the top and bottom by 120 gives $\\frac{1}{3}$.\n\nCheck: $\\frac{1}{3}$ of $360^\\circ$ is $360^\\circ \\div 3 = 120^\\circ$.\n\n> **Watch out.** Put the angle over 360, the degrees in a full turn, not over 100.",
        "一个圆蛋糕平均切成 3 块，一块的尖角是 $120^\\circ$。它是一整圈的 $\\frac{120}{360}$。分子分母同时除以 120，得到 $\\frac{1}{3}$。\n\n检验：$360^\\circ$ 的 $\\frac{1}{3}$ 是 $360^\\circ \\div 3 = 120^\\circ$。\n\n> **注意。** 分母是一整圈的度数 360，不是 100。",
      ],
      (rng) => {
        const b = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
        const a = rng.pick(Array.from({ length: b - 1 }, (_, k) => k + 1).filter((k) => gcd(k, b) === 1));
        const part = 360 / b;
        const v = part * a;
        return answered(
          [`What fraction of a full turn is an angle of $${v}^\\circ$?`, `$${v}^\\circ$ 的角是一整圈的几分之几？`],
          Q.of(a, b),
          [
            [
              ["Put it over 360", "写成以 360 为分母的分数"],
              [`$${v}^\\circ$ out of $360^\\circ$ is $\\frac{${v}}{360}$.`, `$360^\\circ$ 中的 $${v}^\\circ$ 是 $\\frac{${v}}{360}$。`],
            ],
            [
              ["Simplify", "约分"],
              [
                `Divide the top and bottom by ${part}: $\\frac{${v}}{360} = ${fracTex(a, b)}$.`,
                `分子分母同时除以 ${part}：$\\frac{${v}}{360} = ${fracTex(a, b)}$。`,
              ],
            ],
          ],
          [
            `$${fracTex(a, b)}$ of $360^\\circ$ is $${a} \\times ${part}^\\circ = ${v}^\\circ$.`,
            `$360^\\circ$ 的 $${fracTex(a, b)}$ 是 $${a} \\times ${part}^\\circ = ${v}^\\circ$。`,
          ],
          [
            [Q.of(v, 100), "That puts the angle over 100. A full turn is 360°.", "这用 100 作分母了，一整圈是 360°。"],
            [Q.of(v, 180), "That puts the angle over 180, which is only half a turn.", "这用 180 作分母了，180° 只是半圈。"],
            [Q.of(b - a, b), "That is the part of the turn that is left.", "这是一圈中剩下的部分。"],
          ],
          {
            form: "fraction",
            ...(b <= 12 && {
              figure: turnFigure(
                b,
                a,
                t(`A circle cut into ${b} equal parts with ${a} shaded.`, `一个圆平均分成 ${b} 份，其中 ${a} 份涂色。`),
              ),
            }),
          },
        );
      },
      turnFigure(
        3,
        1,
        t(
          "A circle cut into 3 equal parts by radii from its center. One part is shaded; its angle at the center is 120°, so 120° is 1/3 of a turn.",
          "一个圆被从圆心出发的半径分成 3 等份。其中 1 份涂上阴影，它在圆心处的角是 120°，所以 120° 是 1/3 圈。",
        ),
      ),
    ),
  ],
  t(
    "A pizza is cut into 4 equal slices. Each slice has a corner at the center, and the 4 corners fill the whole circle around it. A whole turn is $360^\\circ$, so each corner is $90^\\circ$.\n\nCheck: $4 \\times 90^\\circ = 360^\\circ$.\n\nIn this lesson we change a fraction of a turn into degrees and degrees into a fraction of a turn.",
    "一张比萨饼平均切成 4 块。每块的尖角都在圆心，4 个尖角正好铺满圆心一周。一整圈是 $360^\\circ$，所以每个尖角是 $90^\\circ$。\n\n检验：$4 \\times 90^\\circ = 360^\\circ$。\n\n本课我们把几分之几圈化成度数，也把度数化成几分之几圈。",
  ),
);

/** protractorSvg draws a protractor with its center at the bottom and two rays at the given readings of its scale. */
function protractorSvg(from: number, to: number): string {
  const [cx, cy, r] = [160, 150, 125];
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const at = (d: number, radius: number) => [r2(cx + radius * Math.cos(rad(d))), r2(cy - radius * Math.sin(rad(d)))] as const;
  let body = `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z"/>`;
  for (let d = 0; d <= 180; d += 5) {
    const len = d % 10 === 0 ? 10 : 5;
    const [x1, y1] = at(d, r);
    const [x2, y2] = at(d, r - len);
    body += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="1"/>`;
    if (d % 20 === 0) {
      const [tx, ty] = at(d, r - 22);
      body += `<text x="${tx}" y="${r2(ty + 4)}" stroke="none" fill="currentColor" font-size="9">${d}</text>`;
    }
  }
  for (const d of [from, to]) {
    const [x, y] = at(d, r + 8);
    body += `<line class="accent" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke-width="2.5"/>`;
  }
  body += `<circle cx="${cx}" cy="${cy}" r="3" fill="currentColor" stroke="none"/>`;
  return svgDocument(165, body);
}

export const measuringAnglesUsingAProtractor = topic(
  "measuring-angles-using-a-protractor",
  t("Measuring Angles Using a Protractor", "用量角器量角"),
  t(
    "To measure an angle, put the center of the protractor on the vertex and line up one ray with the 0° mark; the other ray crosses the scale at the measure. If neither ray is at 0°, subtract the two readings.",
    "量角时，把量角器的中心对准角的顶点，一条边对准 0° 刻度线，另一条边所对的刻度就是角的度数。如果两条边都不在 0°，就用两个读数相减。",
  ),
  ["connecting-angles-and-circles"],
  ["4.MD.C.6"],
  [
    point(
      "reading-a-protractor-from-zero",
      ["One ray at zero", "一条边对准 0°"],
      [
        "Sam opens a book a little. He puts the center of the protractor on the spine and one cover on $0^\\circ$. The other cover crosses the scale at $65^\\circ$, so the angle is $65^\\circ$.\n\nCheck: the angle is smaller than a square corner, and $65^\\circ$ is less than $90^\\circ$.\n\n> **Watch out.** Read the scale that has 0 on the first ray. The other scale would give $115^\\circ$ here.",
        "萨姆把书稍稍打开。他把量角器的中心对准书脊，一边书皮对准 $0^\\circ$。另一边书皮对着 $65^\\circ$，所以这个角是 $65^\\circ$。\n\n检验：这个角比直角小，$65^\\circ$ 也小于 $90^\\circ$。\n\n> **注意。** 要读第一条边对着 0 的那圈刻度。读另一圈会得到 $115^\\circ$。",
      ],
      (rng) => {
        const v = rng.int(1, 35) * 5;
        const look: Pair =
          v < 90
            ? [
                `The ray comes before the $90^\\circ$ mark, and the angle is narrower than a square corner. That fits $${v}^\\circ$.`,
                `这条边在 $90^\\circ$ 刻度之前，角比直角窄，符合 $${v}^\\circ$。`,
              ]
            : v === 90
              ? ["The ray is on the $90^\\circ$ mark, and the angle is a square corner.", "这条边正对 $90^\\circ$ 刻度，角是一个直角。"]
              : [
                  `The ray is past the $90^\\circ$ mark, and the angle is wider than a square corner. That fits $${v}^\\circ$.`,
                  `这条边超过了 $90^\\circ$ 刻度，角比直角宽，符合 $${v}^\\circ$。`,
                ];
        return answered(
          ["The angle is measured with a protractor. What is its measure?", "用量角器量这个角。它是多少度？"],
          v,
          [
            [
              ["Find the ray on 0", "找对准 0 的边"],
              ["One ray lies on $0^\\circ$.", "一条边对准 $0^\\circ$。"],
            ],
            [
              ["Read the other ray", "读另一条边"],
              [
                `The other ray crosses the scale at $${v}^\\circ$, so the angle is $${v}^\\circ$.`,
                `另一条边对着 $${v}^\\circ$，所以这个角是 $${v}^\\circ$。`,
              ],
            ],
          ],
          look,
          [
            [
              180 - v,
              "That reads the other scale. Use the scale that has 0 on the first ray.",
              "这读了另一圈刻度。要读第一条边对着 0 的那圈。",
            ],
            [v + 10, "That reads the next long mark.", "这多读了一大格。"],
            [v - 5, "That reads one small mark too early.", "这少读了一小格。"],
          ],
          {
            form: "integer",
            unit: "°",
            figure: {
              svg: protractorSvg(0, v),
              alt: t(`A protractor with one ray at 0° and the other at ${v}°.`, `量角器上，一条边在 0°，另一条边在 ${v}°。`),
            },
          },
        );
      },
      gradeDrawings["reading-a-protractor-from-zero"]!,
    ),
    point(
      "reading-a-protractor-between-two-marks",
      ["Neither ray at zero", "两条边都不在 0°"],
      [
        "Sometimes neither ray is on $0^\\circ$. Read where both rays cross the same scale. Here they are at $40^\\circ$ and $115^\\circ$, so the angle is $115^\\circ - 40^\\circ = 75^\\circ$.\n\nCheck: count up from $40^\\circ$. Adding $75^\\circ$ reaches $115^\\circ$.\n\n> **Watch out.** Do not read just one ray. $115^\\circ$ is where one ray is, not the size of the angle.",
        "有时两条边都不在 $0^\\circ$。在同一圈刻度上读出两条边对着的度数。这里分别是 $40^\\circ$ 和 $115^\\circ$，所以这个角是 $115^\\circ - 40^\\circ = 75^\\circ$。\n\n检验：从 $40^\\circ$ 往上数，加 $75^\\circ$ 正好到 $115^\\circ$。\n\n> **注意。** 不能只读一条边。$115^\\circ$ 是一条边的位置，不是角的大小。",
      ],
      (rng) => {
        const a = rng.int(2, 20) * 5;
        const b = rng.int(a / 5 + 3, 36) * 5;
        return answered(
          ["The angle is measured with a protractor. What is its measure?", "用量角器量这个角。它是多少度？"],
          b - a,
          [
            [
              ["Read both rays", "读两条边"],
              [
                `One ray crosses $${a}^\\circ$ and the other crosses $${b}^\\circ$.`,
                `一条边对着 $${a}^\\circ$，另一条边对着 $${b}^\\circ$。`,
              ],
            ],
            [
              ["Subtract", "相减"],
              [`$${b}^\\circ - ${a}^\\circ = ${b - a}^\\circ$.`, `$${b}^\\circ - ${a}^\\circ = ${b - a}^\\circ$。`],
            ],
          ],
          [
            `Count up from $${a}^\\circ$: adding $${b - a}^\\circ$ reaches $${b}^\\circ$.`,
            `从 $${a}^\\circ$ 往上数，加 $${b - a}^\\circ$ 正好到 $${b}^\\circ$。`,
          ],
          [
            [b, "That reads only one ray.", "这只读了一条边。"],
            [a + b, "That adds the two readings instead of subtracting.", "这是把两个读数相加了，应该相减。"],
            [180 - b + a, "That reads one ray on the other scale.", "这有一条边读了另一圈刻度。"],
          ],
          {
            form: "integer",
            unit: "°",
            figure: {
              svg: protractorSvg(a, b),
              alt: t(`A protractor with the two rays at ${a}° and ${b}°.`, `量角器上，两条边分别在 ${a}° 和 ${b}°。`),
            },
          },
        );
      },
      gradeDrawings["reading-a-protractor-between-two-marks"]!,
    ),
  ],
  t(
    "Sam opens a book and wants to know how wide it is open. He sets the center of his protractor on the spine and lines one cover up with $0^\\circ$. The other cover points at $65^\\circ$.\n\nCheck: the book is open less than a square corner, and $65^\\circ$ is less than $90^\\circ$.\n\nIn this lesson we read angles on a protractor, from $0^\\circ$ and between two marks.",
    "萨姆打开一本书，想知道它张开了多大。他把量角器的中心对准书脊，一边书皮对准 $0^\\circ$，另一边书皮指着 $65^\\circ$。\n\n检验：书张开得比直角小，$65^\\circ$ 也小于 $90^\\circ$。\n\n本课我们用量角器读角的度数：从 $0^\\circ$ 读起，以及在两个刻度之间读。",
  ),
);

const specialAngles: readonly { readonly name: Text; readonly measure: number; readonly turn: Text }[] = [
  { name: t("A null angle", "零角"), measure: 0, turn: t("no turn at all", "完全不转") },
  { name: t("A right angle", "直角"), measure: 90, turn: t("a quarter turn", "四分之一圈") },
  { name: t("A straight angle", "平角"), measure: 180, turn: t("a half turn", "半圈") },
  { name: t("A full angle", "周角"), measure: 360, turn: t("a full turn", "一整圈") },
];

export const rightStraightFullAndNullAngles = topic(
  "right-straight-full-and-null-angles",
  t("Right, Straight, Full, and Null Angles", "直角、平角、周角和零角"),
  t(
    "Four angles have special names: a null angle (0°, the rays lie on top of each other), a right angle (90°, a quarter turn, marked with a small square), a straight angle (180°, a half turn, the rays form a line) and a full angle (360°, a full turn).",
    "有四种角有特别的名字：零角（0°，两条边重合）、直角（90°，四分之一圈，用小正方形标出）、平角（180°，半圈，两条边成一条直线）和周角（360°，一整圈）。",
  ),
  ["angles-and-angle-measures"],
  ["4.MD.C.5"],
  [
    point(
      "measures-of-special-angles",
      ["Measures of the special angles", "特殊角的度数"],
      [
        "A door swings open a quarter turn: that is a right angle, $90^\\circ$. Pushed flat against the wall it has made a half turn, a straight angle of $180^\\circ$. All the way round is a full angle, $360^\\circ$, and no turn at all is a null angle, $0^\\circ$.\n\nCheck: four right angles make a full turn, $4 \\times 90^\\circ = 360^\\circ$.\n\n> **Watch out.** A straight angle looks like a line, but it is still an angle of $180^\\circ$.",
        "门转开四分之一圈：这是直角，$90^\\circ$。推到贴着墙转了半圈，是平角，$180^\\circ$。转一整圈是周角，$360^\\circ$；一点也不转是零角，$0^\\circ$。\n\n检验：四个直角正好一整圈，$4 \\times 90^\\circ = 360^\\circ$。\n\n> **注意。** 平角看起来像一条直线，但它仍然是一个角，是 $180^\\circ$。",
      ],
      (rng) => {
        const a = rng.pick(specialAngles);
        const m = a.measure;
        const k = rng.int(2, 9);
        const said: Record<number, Pair> = {
          0: ["That is a null angle, no turn at all.", "这是零角，一点也没转。"],
          90: ["That is a right angle, a quarter turn.", "这是直角，四分之一圈。"],
          180: ["That is a straight angle, a half turn.", "这是平角，半圈。"],
          360: ["That is a full angle, a whole turn.", "这是周角，一整圈。"],
        };
        if (m > 0 && rng.bool(0.75)) {
          const plural = a.name.en.replace(/^A /, "").replace("angle", "angles");
          const other: readonly [number, string, string] =
            m === 90
              ? [k * 180, "That uses a straight angle, 180°.", "这用的是平角，180°。"]
              : [k * 90, "That uses a right angle, 90°.", "这用的是直角，90°。"];
          return answered(
            [`How many degrees are in ${k} ${plural}?`, `${k} 个${a.name["zh-CN"]}一共是多少度？`],
            k * m,
            [
              [
                ["One angle", "一个角"],
                [`${a.name.en} is $${m}^\\circ$.`, `一个${a.name["zh-CN"]}是 $${m}^\\circ$。`],
              ],
              [
                [`${k} of them`, `${k} 个`],
                [`$${k} \\times ${m}^\\circ = ${k * m}^\\circ$.`, `$${k} \\times ${m}^\\circ = ${k * m}^\\circ$。`],
              ],
            ],
            [
              `Count on by ${m}: ${Array.from({ length: k }, (_, i) => (i + 1) * m).join(", ")}.`,
              `${m} 个 ${m} 个地数：${Array.from({ length: k }, (_, i) => (i + 1) * m).join("、")}。`,
            ],
            [
              [m, "That is just one angle.", "这只是一个角的度数。"],
              other,
              [k + m, "That adds instead of multiplying.", "这是相加，应该相乘。"],
            ],
            { form: "integer", unit: "°" },
          );
        }
        const how: Record<number, Pair> = {
          0: ["No turn at all is $0^\\circ$.", "一点也不转是 $0^\\circ$。"],
          90: ["$360^\\circ \\div 4 = 90^\\circ$.", "$360^\\circ \\div 4 = 90^\\circ$。"],
          180: ["$360^\\circ \\div 2 = 180^\\circ$.", "$360^\\circ \\div 2 = 180^\\circ$。"],
          360: ["A whole turn is $360^\\circ$.", "一整圈是 $360^\\circ$。"],
        };
        const check: Record<number, Pair> = {
          0: ["The two rays lie on top of each other, with nothing between them.", "两条边重合，中间什么也没有。"],
          90: [
            "Two right angles make a straight angle: $90^\\circ + 90^\\circ = 180^\\circ$.",
            "两个直角组成一个平角：$90^\\circ + 90^\\circ = 180^\\circ$。",
          ],
          180: [
            "Two right angles side by side make it: $90^\\circ + 90^\\circ = 180^\\circ$.",
            "两个直角并在一起就是它：$90^\\circ + 90^\\circ = 180^\\circ$。",
          ],
          360: ["Four right angles fill it: $4 \\times 90^\\circ = 360^\\circ$.", "四个直角正好铺满：$4 \\times 90^\\circ = 360^\\circ$。"],
        };
        return answered(
          [`${a.name.en} is ${a.turn.en}. What is its measure in degrees?`, `${a.name["zh-CN"]}是${a.turn["zh-CN"]}。它是多少度？`],
          m,
          [
            [
              ["Think of the turn", "想一想转了多少"],
              [`${a.name.en} is ${a.turn.en}.`, `${a.name["zh-CN"]}是${a.turn["zh-CN"]}。`],
            ],
            [["Find the degrees", "求度数"], how[m]!],
          ],
          check[m]!,
          specialAngles.filter((s) => s.measure !== m).map((s) => [s.measure, said[s.measure]![0], said[s.measure]![1]] as const),
          { form: "integer", unit: "°" },
        );
      },
      gradeDrawings2["right-straight-full-and-null-angles#measures-of-special-angles"]!,
    ),
    point(
      "naming-angles-on-a-clock",
      ["Angles on a clock", "钟面上的角"],
      [
        "At $3{:}00$ the minute hand points at 12 and the hour hand at 3. They are a quarter turn apart: a right angle. At $6{:}00$ they point opposite ways: a straight angle. At $12{:}00$ they lie together: a null angle.\n\nCheck: from 12 to 3 is 3 hour marks, and $3 \\times 30^\\circ = 90^\\circ$.\n\n> **Watch out.** At $9{:}00$ the hands are a quarter turn apart too. It is a right angle, whichever side the hour hand is on.",
        "$3{:}00$ 时分针指着 12，时针指着 3，相差四分之一圈：是直角。$6{:}00$ 时两针指向相反：是平角。$12{:}00$ 时两针重合：是零角。\n\n检验：从 12 到 3 有 3 个小时刻度，$3 \\times 30^\\circ = 90^\\circ$。\n\n> **注意。** $9{:}00$ 时两针也相差四分之一圈，也是直角，不管时针在哪一边。",
      ],
      (rng) => {
        const hours: [number, number][] = [
          [3, 1],
          [9, 1],
          [6, 2],
          [12, 0],
        ];
        const [h, idx] = rng.pick(hours);
        const name = rng.pick(names);
        const gaps = h === 12 ? 0 : Math.min(h, 12 - h);
        const opt = (i: number): Pair => [specialAngles[i]!.name.en, specialAngles[i]!.name["zh-CN"]];
        const reasons: readonly Pair[] = [
          ["For a null angle the hands would lie on top of each other, as at 12:00.", "零角时两针重合，比如 12:00。"],
          ["For a right angle the hands would be a quarter turn apart, as at 3:00.", "直角时两针相差四分之一圈，比如 3:00。"],
          ["For a straight angle the hands would point opposite ways, as at 6:00.", "平角时两针指向相反，比如 6:00。"],
        ];
        const apart: readonly Pair[] = [
          ["They lie on top of each other: a null angle.", "两针重合：是零角。"],
          ["They are a quarter turn apart: a right angle.", "两针相差四分之一圈：是直角。"],
          ["They point opposite ways, a half turn apart: a straight angle.", "两针指向相反，相差半圈：是平角。"],
        ];
        return picked(
          rng,
          [
            `${name} looks at a clock at exactly $${h}{:}00$. What angle do the hour hand and the minute hand form?`,
            `${name} 在 $${h}{:}00$ 整看钟。时针和分针成什么角？`,
          ],
          opt(idx),
          [0, 1, 2].filter((i) => i !== idx).map((i) => [opt(i), reasons[i]![0], reasons[i]![1]] as const),
          [
            [
              ["Find the hands", "看两根指针"],
              [`The minute hand points at 12 and the hour hand at ${h}.`, `分针指着 12，时针指着 ${h}。`],
            ],
            [["Name the angle", "说出角的名称"], apart[idx]!],
          ],
          [
            `Count the hour marks between the hands the short way: ${gaps}. Each is $30^\\circ$, so the angle is $${gaps * 30}^\\circ$.`,
            `沿近路数两针之间的小时刻度：${gaps} 个。每个 $30^\\circ$，所以这个角是 $${gaps * 30}^\\circ$。`,
          ],
        );
      },
      gradeDrawings2["right-straight-full-and-null-angles#naming-angles-on-a-clock"]!,
    ),
  ],
  t(
    "A door opens a quarter of the way round: a right angle. Pushed flat against the wall, it has turned half way round: a straight angle. A spinning top goes all the way round: a full angle.\n\nCheck: two quarter turns make a half turn, and two half turns make a full turn.\n\nIn this lesson we learn the right, straight, full and null angles and their measures.",
    "门转开四分之一圈：是直角。推到贴着墙，转了半圈：是平角。陀螺转了一整圈：是周角。\n\n检验：两个四分之一圈是半圈，两个半圈是一整圈。\n\n本课我们认识直角、平角、周角和零角，以及它们的度数。",
  ),
);

const angleClasses: readonly Text[] = [
  t("Acute", "锐角"),
  t("Right", "直角"),
  t("Obtuse", "钝角"),
  t("Straight", "平角"),
  t("Reflex", "优角"),
];

export const acuteObtuseAndReflexAngles = topic(
  "acute-obtuse-and-reflex-angles",
  t("Acute, Obtuse, and Reflex Angles", "锐角、钝角和优角"),
  t(
    "An acute angle is less than a right angle (under 90°); an obtuse angle is between a right angle and a straight angle (between 90° and 180°); a reflex angle is more than a straight angle but less than a full turn (between 180° and 360°). Two rays from a point form an angle and a reflex angle, which add up to 360°.",
    "锐角小于直角（小于 90°）；钝角大于直角而小于平角（在 90° 与 180° 之间）；优角大于平角而小于周角（在 180° 与 360° 之间）。从一点出发的两条射线组成一个角和一个优角，二者之和是 360°。",
  ),
  ["right-straight-full-and-null-angles"],
  ["4.G.A.1", "4.MD.C.5"],
  [
    point(
      "classifying-angles-by-measure",
      ["Classifying by measure", "按度数分类"],
      [
        "Scissors opened a little make an acute angle, less than $90^\\circ$. A laptop opened wide makes an obtuse angle, between $90^\\circ$ and $180^\\circ$. More than a half turn, between $180^\\circ$ and $360^\\circ$, is a reflex angle. So $125^\\circ$ is obtuse.\n\nCheck: $125^\\circ$ is $35^\\circ$ more than a right angle and $55^\\circ$ less than a straight angle.\n\n> **Watch out.** An angle of exactly $90^\\circ$ is a right angle, not acute or obtuse.",
        "剪刀张开一点，成锐角，小于 $90^\\circ$。笔记本电脑张得很开，成钝角，在 $90^\\circ$ 和 $180^\\circ$ 之间。比半圈还多，在 $180^\\circ$ 和 $360^\\circ$ 之间的，是优角。所以 $125^\\circ$ 是钝角。\n\n检验：$125^\\circ$ 比直角多 $35^\\circ$，比平角少 $55^\\circ$。\n\n> **注意。** 正好 $90^\\circ$ 的是直角，既不是锐角也不是钝角。",
      ],
      (rng) => {
        const k = rng.pick([0, 0, 2, 2, 4, 4, 1, 3]);
        const v = [rng.int(1, 89), 90, rng.int(91, 179), 180, rng.int(181, 359)][k]!;
        const opt = (i: number): Pair => [angleClasses[i]!.en, angleClasses[i]!["zh-CN"]];
        const defs: readonly Pair[] = [
          ["An acute angle is less than 90°.", "锐角小于 90°。"],
          ["A right angle is exactly 90°.", "直角正好是 90°。"],
          ["An obtuse angle is between 90° and 180°.", "钝角在 90° 和 180° 之间。"],
          ["A straight angle is exactly 180°.", "平角正好是 180°。"],
          ["A reflex angle is between 180° and 360°.", "优角在 180° 和 360° 之间。"],
        ];
        const compare: readonly Pair[] = [
          [`$${v}^\\circ$ is less than $90^\\circ$.`, `$${v}^\\circ$ 小于 $90^\\circ$。`],
          ["$90^\\circ$ is exactly a quarter turn.", "$90^\\circ$ 正好是四分之一圈。"],
          [`$${v}^\\circ$ is more than $90^\\circ$ and less than $180^\\circ$.`, `$${v}^\\circ$ 大于 $90^\\circ$，小于 $180^\\circ$。`],
          ["$180^\\circ$ is exactly a half turn.", "$180^\\circ$ 正好是半圈。"],
          [`$${v}^\\circ$ is more than $180^\\circ$ and less than $360^\\circ$.`, `$${v}^\\circ$ 大于 $180^\\circ$，小于 $360^\\circ$。`],
        ];
        const checks: readonly Pair[] = [
          [`It is $${90 - v}^\\circ$ short of a right angle.`, `它比直角少 $${90 - v}^\\circ$。`],
          [
            "Two of them make a straight angle: $90^\\circ + 90^\\circ = 180^\\circ$.",
            "两个这样的角组成平角：$90^\\circ + 90^\\circ = 180^\\circ$。",
          ],
          [
            `It is $${v - 90}^\\circ$ more than a right angle and $${180 - v}^\\circ$ less than a straight angle.`,
            `它比直角多 $${v - 90}^\\circ$，比平角少 $${180 - v}^\\circ$。`,
          ],
          ["It is two right angles: $90^\\circ + 90^\\circ = 180^\\circ$.", "它是两个直角：$90^\\circ + 90^\\circ = 180^\\circ$。"],
          [
            `The angle on the other side is $360^\\circ - ${v}^\\circ = ${360 - v}^\\circ$, smaller than $180^\\circ$, so this is the larger, reflex angle.`,
            `另一边的角是 $360^\\circ - ${v}^\\circ = ${360 - v}^\\circ$，小于 $180^\\circ$，所以这个是较大的优角。`,
          ],
        ];
        return picked(
          rng,
          [`What kind of angle measures $${v}^\\circ$?`, `$${v}^\\circ$ 的角是什么角？`],
          opt(k),
          [0, 1, 2, 3, 4].filter((i) => i !== k).map((i) => [opt(i), defs[i]![0], defs[i]![1]] as const),
          [
            [["Compare", "比较"], compare[k]!],
            [
              ["Name it", "说出名称"],
              [
                `So it is ${["an acute", "a right", "an obtuse", "a straight", "a reflex"][k]} angle.`,
                `所以它是${angleClasses[k]!["zh-CN"]}。`,
              ],
            ],
          ],
          checks[k]!,
        );
      },
      gradeDrawings2["acute-obtuse-and-reflex-angles#classifying-angles-by-measure"]!,
    ),
    point(
      "finding-reflex-angles",
      ["The reflex angle", "求优角"],
      [
        "Two rays from a point make a small angle and a big one, and together they fill a whole turn. If the small angle is $70^\\circ$, the reflex angle is $360^\\circ - 70^\\circ = 290^\\circ$.\n\nCheck: $70^\\circ + 290^\\circ = 360^\\circ$.\n\n> **Watch out.** Subtract from $360^\\circ$, not from $180^\\circ$.",
        "从一点出发的两条射线组成一个小角和一个大角，合起来正好一整圈。如果小角是 $70^\\circ$，优角就是 $360^\\circ - 70^\\circ = 290^\\circ$。\n\n检验：$70^\\circ + 290^\\circ = 360^\\circ$。\n\n> **注意。** 要用 $360^\\circ$ 去减，不是用 $180^\\circ$。",
      ],
      (rng) => {
        const v = rng.int(10, 170);
        const base = rng.pick([0, 20, 40, 200]);
        const o: Point = [0, 0];
        const [a, b] = [dir(base), dir(base + v)];
        const marks: Mark[] = [
          { kind: "segment", a: o, b: a },
          { kind: "segment", a: o, b: b },
          { kind: "arc", vertex: o, from: a, to: b, label: `${v}°`, accent: true },
          { kind: "dot", at: o },
        ];
        return answered(
          [
            "The smaller angle between the two rays is shown. What is the reflex angle between them?",
            "图中标出了两条射线所夹的较小的角。它们所成的优角是多少度？",
          ],
          360 - v,
          [
            [
              ["Two angles fill a turn", "两个角合成一整圈"],
              ["The small angle and the reflex angle make $360^\\circ$ together.", "小角和优角合起来是 $360^\\circ$。"],
            ],
            [
              ["Subtract", "相减"],
              [`$360^\\circ - ${v}^\\circ = ${360 - v}^\\circ$.`, `$360^\\circ - ${v}^\\circ = ${360 - v}^\\circ$。`],
            ],
          ],
          [`Add back: $${v}^\\circ + ${360 - v}^\\circ = 360^\\circ$.`, `加回去：$${v}^\\circ + ${360 - v}^\\circ = 360^\\circ$。`],
          [
            [180 - v, "That subtracts from a straight angle, 180°. A whole turn is 360°.", "这是用平角 180° 去减的，一整圈是 360°。"],
            [180 + v, "That adds the angle to a straight angle.", "这是把这个角加上了平角。"],
            [v, "That is the small angle, not the reflex one.", "这是小角，不是优角。"],
          ],
          {
            form: "integer",
            unit: "°",
            figure: figureOf(
              marks,
              `Two rays from a point with an angle of ${v}° marked between them.`,
              `从一点出发的两条射线，标出了它们之间 ${v}° 的角。`,
            ),
          },
        );
      },
      gradeDrawings["finding-reflex-angles"]!,
    ),
  ],
  t(
    "Scissors opened a little make a sharp, small angle. A laptop opened wide makes an angle bigger than a square corner. Measured the long way round, the hands of a clock at 8:00 make an angle bigger than a half turn.\n\nCheck: the small angle and the long-way angle at 8:00 together make a whole turn.\n\nIn this lesson we name angles as acute, obtuse or reflex and find a reflex angle from the angle beside it.",
    "剪刀张开一点，成一个尖尖的小角。笔记本电脑张得很开，成的角比直角大。8:00 时钟面两针之间沿远路量的角，比半圈还大。\n\n检验：8:00 时的小角和远路的大角合起来正好一整圈。\n\n本课我们认识锐角、钝角和优角，并由旁边的角求出优角。",
  ),
);

const triangleKinds: readonly Text[] = [
  t("Acute triangle", "锐角三角形"),
  t("Right triangle", "直角三角形"),
  t("Obtuse triangle", "钝角三角形"),
];

/** Shape is a named polygon with how many right angles, and pairs of parallel sides, it always has. */
interface Shape {
  readonly name: Text;
  readonly right: number;
  readonly parallel: number;
}

const shapes: readonly Shape[] = [
  { name: t("a rectangle", "长方形"), right: 4, parallel: 2 },
  { name: t("a square", "正方形"), right: 4, parallel: 2 },
  { name: t("a right triangle", "直角三角形"), right: 1, parallel: 0 },
  { name: t("an equilateral triangle", "等边三角形"), right: 0, parallel: 0 },
  { name: t("a regular hexagon", "正六边形"), right: 0, parallel: 3 },
  { name: t("a regular octagon", "正八边形"), right: 0, parallel: 4 },
];

/** triangleKindsFigure shows an acute, a right and an obtuse triangle side by side, marking every angle of the first, the right angle of the second and the obtuse angle of the third. */
const triangleKindsFigure: Figure = (() => {
  const acute: Point[] = [
    [0, 0],
    [4, 0],
    [1.6, 3],
  ];
  const right: Point[] = [
    [6, 0],
    [9.5, 0],
    [6, 3],
  ];
  const obtuse: Point[] = [
    [12, 0],
    [17, 0],
    [11, 2],
  ];
  const corners = (p: readonly Point[], i: number): [Point, Point, Point] => [p[i]!, p[(i + 1) % 3]!, p[(i + 2) % 3]!];
  const marks: Mark[] = [
    { kind: "polygon", points: acute },
    { kind: "polygon", points: right },
    { kind: "polygon", points: obtuse },
    ...[0, 1, 2].map((i): Mark => {
      const [v, a, b] = corners(acute, i);
      return { kind: "arc", vertex: v, from: a, to: b };
    }),
    { kind: "right", vertex: right[0]!, from: right[1]!, to: right[2]! },
    { kind: "arc", vertex: obtuse[0]!, from: obtuse[1]!, to: obtuse[2]!, accent: true },
  ];
  return {
    svg: sketch(marks),
    alt: t(
      "Three triangles side by side: an acute triangle with all three angles marked as less than a right angle, a right triangle with its right angle marked, and an obtuse triangle with its one angle greater than a right angle marked.",
      "三个三角形并排：锐角三角形，三个角都标出且都小于直角；直角三角形，标出它的直角；钝角三角形，标出它唯一一个大于直角的角。",
    ),
  };
})();

export const classifyingFiguresBasedOnAngles = topic(
  "classifying-figures-based-on-angles",
  t("Classifying Figures Based on Angles", "按角给图形分类"),
  t(
    "Triangles are classified by their largest angle: a right triangle has a right angle, an obtuse triangle an obtuse angle, and an acute triangle has three acute angles. Other shapes are described by how many right angles they have: a rectangle has four.",
    "三角形按最大的角分类：有一个直角的是直角三角形，有一个钝角的是钝角三角形，三个角都是锐角的是锐角三角形。其他图形可以按直角的个数来描述：长方形有四个直角。",
  ),
  ["acute-obtuse-and-reflex-angles"],
  ["4.G.A.2"],
  [
    point(
      "classifying-triangles-by-angles",
      ["Triangles", "三角形"],
      [
        "A sandwich cut from corner to corner gives two triangles, each with a square corner: right triangles. A triangle with angles $30^\\circ$, $45^\\circ$ and $105^\\circ$ has an angle over $90^\\circ$, so it is an obtuse triangle.\n\nCheck: $30 + 45 + 105 = 180$, so the angles fit a triangle, and only $105^\\circ$ is over $90^\\circ$.\n\n> **Watch out.** Look at the largest angle. Two acute angles do not make a triangle acute unless the third is acute too.",
        "三明治沿对角切开，得到两个三角形，每个都有一个直角：是直角三角形。三个角分别是 $30^\\circ$、$45^\\circ$、$105^\\circ$ 的三角形有一个角大于 $90^\\circ$，所以是钝角三角形。\n\n检验：$30 + 45 + 105 = 180$，这三个角能组成三角形，并且只有 $105^\\circ$ 大于 $90^\\circ$。\n\n> **注意。** 要看最大的角。有两个锐角不一定是锐角三角形，第三个角也必须是锐角。",
      ],
      (rng) => {
        const k = rng.int(0, 2);
        const big = [rng.int(61, 89), 90, rng.int(91, 150)][k]!;
        let a: number;
        do a = rng.int(Math.max(1, 180 - big - 89), Math.min(89, 180 - big - 1));
        while (k === 0 && (180 - big - a >= 90 || 180 - big - a > big || a > big));
        const c = 180 - big - a;
        const angles = rng.shuffle([big, a, c]);
        const opt = (i: number): Pair => [triangleKinds[i]!.en, triangleKinds[i]!["zh-CN"]];
        const reasons: readonly Pair[] = [
          [
            `An acute triangle has all angles less than $90^\\circ$, and one here is $${big}^\\circ$.`,
            `锐角三角形的所有角都小于 $90^\\circ$，而这里有一个角是 $${big}^\\circ$。`,
          ],
          [
            `A right triangle has an angle of exactly $90^\\circ$, and the largest here is $${big}^\\circ$.`,
            `直角三角形有一个角恰好是 $90^\\circ$，而这里最大的角是 $${big}^\\circ$。`,
          ],
          [
            `An obtuse triangle has an angle greater than $90^\\circ$, and the largest here is $${big}^\\circ$.`,
            `钝角三角形有一个角大于 $90^\\circ$，而这里最大的角是 $${big}^\\circ$。`,
          ],
        ];
        const compare: readonly Pair[] = [
          [
            `$${big}^\\circ$ is less than $90^\\circ$, so all three angles are acute: an acute triangle.`,
            `$${big}^\\circ$ 小于 $90^\\circ$，所以三个角都是锐角：锐角三角形。`,
          ],
          ["It is exactly $90^\\circ$: a right triangle.", "它正好是 $90^\\circ$：直角三角形。"],
          [`$${big}^\\circ$ is more than $90^\\circ$: an obtuse triangle.`, `$${big}^\\circ$ 大于 $90^\\circ$：钝角三角形。`],
        ];
        const checks: readonly Pair[] = [
          ["The other two angles are smaller still, so no angle reaches $90^\\circ$.", "另外两个角更小，所以没有一个角达到 $90^\\circ$。"],
          [
            `The other two angles add to $${a}^\\circ + ${c}^\\circ = 90^\\circ$, so neither of them is right or obtuse.`,
            `另外两个角的和是 $${a}^\\circ + ${c}^\\circ = 90^\\circ$，所以它们都不是直角或钝角。`,
          ],
          [
            `The other two angles add to only $${180 - big}^\\circ$, so neither of them can be obtuse.`,
            `另外两个角的和只有 $${180 - big}^\\circ$，所以它们都不可能是钝角。`,
          ],
        ];
        return picked(
          rng,
          [
            `A triangle has angles of $${angles.map((v) => `${v}^\\circ`).join("$, $")}$. What kind of triangle is it?`,
            `一个三角形的三个角分别是 $${angles.map((v) => `${v}^\\circ`).join("$、$")}$。它是什么三角形？`,
          ],
          opt(k),
          [0, 1, 2].filter((i) => i !== k).map((i) => [opt(i), reasons[i]![0], reasons[i]![1]] as const),
          [
            [
              ["Find the largest angle", "找最大的角"],
              [`The largest angle is $${big}^\\circ$.`, `最大的角是 $${big}^\\circ$。`],
            ],
            [["Compare with $90^\\circ$", "和 $90^\\circ$ 比较"], compare[k]!],
          ],
          checks[k]!,
        );
      },
      triangleKindsFigure,
    ),
    point(
      "counting-right-angles-in-shapes",
      ["Right angles in shapes", "图形中的直角"],
      [
        "A square has 4 right angles and a right triangle has 1. So 2 squares and 3 right triangles have $2 \\times 4 + 3 \\times 1 = 11$ right angles.\n\nCheck: count shape by shape, $4 + 4 + 1 + 1 + 1 = 11$.\n\n> **Watch out.** Not every shape has 4 right angles. A right triangle has just 1, and a regular hexagon has none.",
        "正方形有 4 个直角，直角三角形有 1 个。所以 2 个正方形和 3 个直角三角形一共有 $2 \\times 4 + 3 \\times 1 = 11$ 个直角。\n\n检验：一个图形一个图形地数，$4 + 4 + 1 + 1 + 1 = 11$。\n\n> **注意。** 不是每个图形都有 4 个直角。直角三角形只有 1 个，正六边形一个也没有。",
      ],
      (rng) => {
        const [s1, s2] = rng.sample(shapes, 2) as [Shape, Shape];
        const n1 = rng.int(1, 4);
        const n2 = rng.int(1, 4);
        const total = n1 * s1.right + n2 * s2.right;
        const terms = [...Array.from({ length: n1 }, () => s1.right), ...Array.from({ length: n2 }, () => s2.right)];
        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        return answered(
          [
            `How many right angles are there in all in ${n1} copies of ${s1.name.en} and ${n2} copies of ${s2.name.en}?`,
            `${n1} 个${s1.name["zh-CN"]}和 ${n2} 个${s2.name["zh-CN"]}一共有多少个直角？`,
          ],
          total,
          [
            [
              ["Right angles in each shape", "每个图形的直角"],
              [
                `${cap(s1.name.en)} has ${s1.right}, and ${s2.name.en} has ${s2.right}.`,
                `${s1.name["zh-CN"]}有 ${s1.right} 个，${s2.name["zh-CN"]}有 ${s2.right} 个。`,
              ],
            ],
            [
              ["Multiply and add", "相乘再相加"],
              [
                `$${n1} \\times ${s1.right} + ${n2} \\times ${s2.right} = ${total}$.`,
                `$${n1} \\times ${s1.right} + ${n2} \\times ${s2.right} = ${total}$。`,
              ],
            ],
          ],
          [`Count shape by shape: $${terms.join(" + ")} = ${total}$.`, `一个图形一个图形地数：$${terms.join(" + ")} = ${total}$。`],
          [
            [n1 + n2, "That counts the shapes, not the right angles.", "这数的是图形的个数，不是直角。"],
            [4 * (n1 + n2), "That gives every shape 4 right angles.", "这把每个图形都当成有 4 个直角。"],
            [n1 * s1.right, `That leaves out ${s2.name.en}.`, `这漏掉了${s2.name["zh-CN"]}。`],
          ],
          { form: "integer" },
        );
      },
      gradeDrawings2["classifying-figures-based-on-angles#counting-right-angles-in-shapes"]!,
    ),
  ],
  t(
    "Cut a sandwich from corner to corner and you get two triangles. Each has a square corner, so each is a right triangle. A slice of pizza has a narrow point and two other corners.\n\nCheck: a square corner is $90^\\circ$, and a triangle can have only one.\n\nIn this lesson we sort triangles by their largest angle and count the right angles in shapes.",
    "把三明治沿对角切开，得到两个三角形。每个都有一个直角，所以都是直角三角形。一块比萨有一个尖尖的角和另外两个角。\n\n检验：直角是 $90^\\circ$，一个三角形最多只有一个。\n\n本课我们按最大的角给三角形分类，并数图形中的直角。",
  ),
);

/** raysFigure draws rays from O at the given directions, marking the angles between neighbors with labels. */
function raysFigure(directions: readonly number[], labels: readonly string[], en: string, zh: string): Figure {
  const o: Point = [0, 0];
  const marks: Mark[] = directions.map((d) => ({ kind: "segment", a: o, b: dir(d) }) as Mark);
  for (let i = 0; i < labels.length; i++) {
    const from = directions[i]!;
    const to = directions[(i + 1) % directions.length]!;
    marks.push({ kind: "arc", vertex: o, from: dir(from), to: dir(to), label: labels[i]!, accent: labels[i] === "x" });
  }
  marks.push({ kind: "dot", at: o });
  return figureOf(marks, en, zh);
}

export const sumsOfAngles = topic(
  "sums-of-angles",
  t("Sums of Angles", "角的和"),
  t(
    "Angle measure is additive: when an angle is split into parts that do not overlap, its measure is the sum of the parts' measures. The angles around a point add up to 360°, and the angles along a straight line add up to 180°.",
    "角的度数可以相加：把一个角分成互不重叠的几部分，它的度数等于各部分度数之和。围绕一点的各角之和是 360°，一条直线上同侧的各角之和是 180°。",
  ),
  ["angles-and-angle-measures"],
  ["4.MD.C.7"],
  [
    point(
      "adding-several-adjacent-angles",
      ["Adding adjacent angles", "相邻角相加"],
      [
        "A fan opens in three sections of $25^\\circ$, $40^\\circ$ and $30^\\circ$. The whole fan opens $25^\\circ + 40^\\circ + 30^\\circ = 95^\\circ$.\n\nCheck: add in another order, $30^\\circ + 40^\\circ + 25^\\circ = 95^\\circ$.\n\n> **Watch out.** Add every part. Leaving one out gives an angle that is too small.",
        "一把扇子分三段打开，分别是 $25^\\circ$、$40^\\circ$、$30^\\circ$。整把扇子打开 $25^\\circ + 40^\\circ + 30^\\circ = 95^\\circ$。\n\n检验：换个顺序加，$30^\\circ + 40^\\circ + 25^\\circ = 95^\\circ$。\n\n> **注意。** 每一部分都要加上。漏掉一部分，得到的角就太小了。",
      ],
      (rng) => {
        let parts: number[];
        do parts = Array.from({ length: 3 }, () => rng.int(15, 70));
        while (parts.reduce((s, v) => s + v, 0) >= 180);
        const [p1, p2, p3] = parts as [number, number, number];
        const total = p1 + p2 + p3;
        const dirs = [0, p1, p1 + p2, total];
        const o: Point = [0, 0];
        const marks: Mark[] = dirs.map((d) => ({ kind: "segment", a: o, b: dir(d) }) as Mark);
        for (const [i, p] of parts.entries())
          marks.push({ kind: "arc", vertex: o, from: dir(dirs[i]!), to: dir(dirs[i + 1]!), label: `${p}°` });
        marks.push({ kind: "dot", at: o });
        return answered(
          ["The angle is split into three parts. What is the measure of the whole angle?", "这个角被分成三部分。整个角是多少度？"],
          total,
          [
            [
              ["Add the first two", "先加前两部分"],
              [`$${p1}^\\circ + ${p2}^\\circ = ${p1 + p2}^\\circ$.`, `$${p1}^\\circ + ${p2}^\\circ = ${p1 + p2}^\\circ$。`],
            ],
            [
              ["Add the third", "再加第三部分"],
              [`$${p1 + p2}^\\circ + ${p3}^\\circ = ${total}^\\circ$.`, `$${p1 + p2}^\\circ + ${p3}^\\circ = ${total}^\\circ$。`],
            ],
          ],
          [
            `Add the last two first: $${p2}^\\circ + ${p3}^\\circ = ${p2 + p3}^\\circ$, and $${p1}^\\circ + ${p2 + p3}^\\circ = ${total}^\\circ$.`,
            `先加后两部分：$${p2}^\\circ + ${p3}^\\circ = ${p2 + p3}^\\circ$，$${p1}^\\circ + ${p2 + p3}^\\circ = ${total}^\\circ$。`,
          ],
          [
            [
              180 - total,
              "That subtracts from a straight angle. Nothing here makes a straight angle.",
              "这是用平角去减的，但这里没有平角。",
            ],
            [p1 + p2, "That leaves out the third part.", "这漏掉了第三部分。"],
            [p2 + p3, "That leaves out the first part.", "这漏掉了第一部分。"],
          ],
          {
            form: "integer",
            unit: "°",
            figure: figureOf(marks, `An angle split into angles of ${parts.join("°, ")}°.`, `一个角被分成 ${parts.join("°、")}° 三部分。`),
          },
        );
      },
      gradeDrawings["adding-several-adjacent-angles"]!,
    ),
    point(
      "angles-around-a-point",
      ["Angles around a point", "围绕一点的角"],
      [
        "Three slices of a round cake meet at the center, and together they fill a whole turn. If two of them are $100^\\circ$ and $130^\\circ$, the third is $360^\\circ - 100^\\circ - 130^\\circ = 130^\\circ$.\n\nCheck: $100^\\circ + 130^\\circ + 130^\\circ = 360^\\circ$.\n\n> **Watch out.** Angles around a point make $360^\\circ$. Only angles along a straight line make $180^\\circ$.",
        "圆蛋糕的三块在圆心相接，合起来正好一整圈。如果其中两块是 $100^\\circ$ 和 $130^\\circ$，第三块就是 $360^\\circ - 100^\\circ - 130^\\circ = 130^\\circ$。\n\n检验：$100^\\circ + 130^\\circ + 130^\\circ = 360^\\circ$。\n\n> **注意。** 围绕一点的角合起来是 $360^\\circ$。只有一条直线上的角合起来才是 $180^\\circ$。",
      ],
      (rng) => {
        let a: number;
        let b: number;
        do {
          a = rng.int(6, 16) * 10 + rng.pick([0, 5]);
          b = rng.int(6, 16) * 10 + rng.pick([0, 5]);
        } while (360 - a - b < 50 || 360 - a - b > 175);
        const c = 360 - a - b;
        return answered(
          [
            "Three angles fill the space around a point. Two of them are labeled. Find $x$.",
            "三个角围绕一点铺满一周，图中标出了其中两个。求 $x$。",
          ],
          c,
          [
            [
              ["Add the known angles", "把已知的角相加"],
              [`$${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ$.`, `$${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ$。`],
            ],
            [
              ["Subtract from a whole turn", "用一整圈去减"],
              [`$360^\\circ - ${a + b}^\\circ = ${c}^\\circ$.`, `$360^\\circ - ${a + b}^\\circ = ${c}^\\circ$。`],
            ],
          ],
          [
            `Add all three: $${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 360^\\circ$.`,
            `三个角相加：$${a}^\\circ + ${b}^\\circ + ${c}^\\circ = 360^\\circ$。`,
          ],
          [
            ...(180 - a - b > 0
              ? ([[180 - a - b, "That uses 180°. Angles around a point make 360°.", "这用了 180°。围绕一点的角合起来是 360°。"]] as const)
              : []),
            [a + b, "That is the two known angles together.", "这是两个已知角的和。"],
            [360 - a, "That leaves out the second known angle.", "这漏减了第二个已知角。"],
          ],
          {
            form: "integer",
            unit: "°",
            figure: raysFigure(
              [90, 90 + a, 90 + a + b],
              [`${a}°`, `${b}°`, "x"],
              `Three rays from a point making angles of ${a}°, ${b}° and x.`,
              `从一点出发的三条射线，所成的角分别是 ${a}°、${b}° 和 x。`,
            ),
          },
        );
      },
      gradeDrawings["angles-around-a-point"]!,
    ),
  ],
  t(
    "Two slices of pie sit side by side with their points together. One slice is $40^\\circ$ and the other is $50^\\circ$. Together they make a corner of $90^\\circ$.\n\nCheck: $40^\\circ + 50^\\circ = 90^\\circ$, a square corner.\n\nIn this lesson we add angles that sit side by side and find a missing angle around a point.",
    "两块馅饼尖对尖并排放着。一块是 $40^\\circ$，另一块是 $50^\\circ$。合起来是一个 $90^\\circ$ 的角。\n\n检验：$40^\\circ + 50^\\circ = 90^\\circ$，正好是直角。\n\n本课我们把并排的角相加，并求出一点周围缺少的角。",
  ),
);

export const solvingAngleProblems = topic(
  "solving-angle-problems",
  t("Solving Angle Problems", "解决与角有关的问题"),
  t(
    "To find an unknown angle, use what the parts add up to: a right angle (90°), a straight angle (180°) or a full turn (360°), or a given whole angle. Subtract the known parts from the whole.",
    "求未知的角时，利用各部分之和：直角（90°）、平角（180°）、周角（360°）或已知的整个角，用整体减去已知的部分。",
  ),
  ["sums-of-angles", "right-straight-full-and-null-angles"],
  ["4.MD.C.7"],
  [
    point(
      "unknown-parts-of-right-and-straight-angles",
      ["Part of a right or straight angle", "直角或平角的一部分"],
      [
        "A ray splits a straight angle into $65^\\circ$ and $x$. The parts of a straight angle add to $180^\\circ$, so $x = 180^\\circ - 65^\\circ = 115^\\circ$.\n\nCheck: $65^\\circ + 115^\\circ = 180^\\circ$.\n\n> **Watch out.** Look first at the whole. A straight angle is $180^\\circ$ and a right angle is $90^\\circ$.",
        "一条射线把平角分成 $65^\\circ$ 和 $x$。平角的各部分加起来是 $180^\\circ$，所以 $x = 180^\\circ - 65^\\circ = 115^\\circ$。\n\n检验：$65^\\circ + 115^\\circ = 180^\\circ$。\n\n> **注意。** 先看清整个角。平角是 $180^\\circ$，直角是 $90^\\circ$。",
      ],
      (rng) => {
        const total = rng.pick([90, 180] as const);
        const a = rng.int(10, total - 10);
        const base = total === 180 ? 0 : rng.pick([0, 20]);
        const o: Point = [0, 0];
        const [p, q, r] = [dir(base), dir(base + a), dir(base + total)];
        const marks: Mark[] = [
          ...(total === 180
            ? [{ kind: "segment", a: p, b: r } as Mark]
            : [{ kind: "segment", a: o, b: p } as Mark, { kind: "segment", a: o, b: r } as Mark]),
          { kind: "segment", a: o, b: q },
          { kind: "arc", vertex: o, from: p, to: q, label: `${a}°` },
          { kind: "arc", vertex: o, from: q, to: r, label: "x", accent: true },
          { kind: "dot", at: o },
        ];
        const whole: Pair =
          total === 90
            ? ["The whole is a right angle, $90^\\circ$.", "整个角是直角，$90^\\circ$。"]
            : ["The whole is a straight angle, $180^\\circ$.", "整个角是平角，$180^\\circ$。"];
        return answered(
          total === 90
            ? ["The two angles make a right angle. Find $x$.", "两个角合起来是一个直角。求 $x$。"]
            : ["The two angles make a straight angle. Find $x$.", "两个角合起来是一个平角。求 $x$。"],
          total - a,
          [
            [["Name the whole", "看清整个角"], whole],
            [
              ["Subtract", "相减"],
              [`$x = ${total}^\\circ - ${a}^\\circ = ${total - a}^\\circ$.`, `$x = ${total}^\\circ - ${a}^\\circ = ${total - a}^\\circ$。`],
            ],
          ],
          [
            `Add back: $${a}^\\circ + ${total - a}^\\circ = ${total}^\\circ$.`,
            `加回去：$${a}^\\circ + ${total - a}^\\circ = ${total}^\\circ$。`,
          ],
          [
            [
              (total === 90 ? 180 : 90) - a,
              total === 90
                ? "That uses a straight angle, 180°, but the whole is a right angle."
                : "That uses a right angle, 90°, but the whole is a straight angle.",
              total === 90 ? "这用了平角 180°，但整个角是直角。" : "这用了直角 90°，但整个角是平角。",
            ],
            [360 - a, "That uses a whole turn, 360°.", "这用了一整圈 360°。"],
            [a, "That is the known part, not x.", "这是已知的部分，不是 x。"],
          ],
          {
            form: "integer",
            unit: "°",
            figure: figureOf(
              marks,
              `A ${total === 90 ? "right" : "straight"} angle split into ${a}° and x.`,
              `一个${total === 90 ? "直角" : "平角"}被分成 ${a}° 和 x。`,
            ),
          },
        );
      },
      gradeDrawings["unknown-parts-of-right-and-straight-angles"]!,
    ),
    point(
      "angle-word-problems",
      ["Word problems", "应用题"],
      [
        "A sprinkler turns $45^\\circ$ at a time. To sweep across $180^\\circ$ it makes $180 \\div 45 = 4$ turns.\n\nCheck: $4 \\times 45^\\circ = 180^\\circ$.\n\n> **Watch out.** The same turn is repeated, so divide. Subtracting $45$ once does not count the turns.",
        "一个喷头每次转 $45^\\circ$。要转过 $180^\\circ$，需要转 $180 \\div 45 = 4$ 次。\n\n检验：$4 \\times 45^\\circ = 180^\\circ$。\n\n> **注意。** 同样的转动重复几次，要用除法。只减一次 $45$ 数不出次数。",
      ],
      (rng) => {
        const name = rng.pick(names);
        if (rng.bool()) {
          const step = rng.pick([5, 10, 15, 20, 30, 36, 40, 45, 60, 72, 90, 120]);
          const total = rng.pick([180, 360].filter((v) => v % step === 0));
          const other = total === 180 ? 360 : 180;
          return answered(
            [
              `A sprinkler turns $${step}^\\circ$ at a time. How many turns does it make to go through $${total}^\\circ$?`,
              `一个喷头每次转 $${step}^\\circ$。转过 $${total}^\\circ$ 要转几次？`,
            ],
            total / step,
            [
              [
                ["Find what repeats", "找出重复的部分"],
                [
                  `Each turn is $${step}^\\circ$, and the turns add up to $${total}^\\circ$.`,
                  `每次转 $${step}^\\circ$，加起来是 $${total}^\\circ$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [`$${total} \\div ${step} = ${total / step}$.`, `$${total} \\div ${step} = ${total / step}$。`],
              ],
            ],
            [`$${total / step} \\times ${step}^\\circ = ${total}^\\circ$.`, `$${total / step} \\times ${step}^\\circ = ${total}^\\circ$。`],
            [
              [total - step, "That subtracts one turn instead of dividing.", "这是减去一次，应该相除。"],
              ...(Number.isInteger(other / step)
                ? ([[other / step, `That uses ${other}° instead of ${total}°.`, `这用了 ${other}°，应该用 ${total}°。`]] as const)
                : []),
              [total / step + 1, "That counts the starting position as a turn.", "这把开始的位置也算成了一次。"],
            ],
            { form: "integer" },
          );
        }
        const whole = rng.int(8, 17) * 10;
        const a = rng.int(2, whole / 10 - 2) * 10 + rng.pick([0, 5]);
        return answered(
          [
            `${name} opens a fan to $${whole}^\\circ$. The fan has two sections, and one of them covers $${a}^\\circ$. How many degrees does the other section cover?`,
            `${name} 把一把扇子打开到 $${whole}^\\circ$。扇面分成两部分，其中一部分是 $${a}^\\circ$。另一部分是多少度？`,
          ],
          whole - a,
          [
            [
              ["Find the whole", "找出整个角"],
              [`The two sections make the whole $${whole}^\\circ$.`, `两部分合起来是整个 $${whole}^\\circ$。`],
            ],
            [
              ["Subtract", "相减"],
              [`$${whole}^\\circ - ${a}^\\circ = ${whole - a}^\\circ$.`, `$${whole}^\\circ - ${a}^\\circ = ${whole - a}^\\circ$。`],
            ],
          ],
          [
            `Add back: $${a}^\\circ + ${whole - a}^\\circ = ${whole}^\\circ$.`,
            `加回去：$${a}^\\circ + ${whole - a}^\\circ = ${whole}^\\circ$。`,
          ],
          [
            [whole + a, "That adds the two angles instead of subtracting.", "这是相加，应该相减。"],
            [180 - a, "That uses a straight angle, but the fan opens to a different angle.", "这用了平角，但扇子打开的角度不是 180°。"],
            [360 - whole - a, "That uses a whole turn.", "这用了一整圈。"],
          ],
          { form: "integer", unit: "°" },
        );
      },
      gradeDrawings2["solving-angle-problems#angle-word-problems"]!,
    ),
  ],
  t(
    "A ladder leans against a wall. The wall and the ground meet in a square corner, and the ladder splits that corner into two angles. If one is $70^\\circ$, the other is $20^\\circ$.\n\nCheck: $70^\\circ + 20^\\circ = 90^\\circ$.\n\nIn this lesson we find unknown angles by taking known parts away from a whole, and solve word problems about turns.",
    "一架梯子靠在墙上。墙和地面成直角，梯子把这个直角分成两个角。如果一个是 $70^\\circ$，另一个就是 $20^\\circ$。\n\n检验：$70^\\circ + 20^\\circ = 90^\\circ$。\n\n本课我们用整体减去已知部分来求未知的角，并解决有关转动的应用题。",
  ),
);

const relations: readonly Text[] = [t("Parallel", "平行"), t("Perpendicular", "垂直"), t("Neither", "都不是")];

export const parallelAndPerpendicularLines = topic(
  "parallel-and-perpendicular-lines",
  t("Parallel and Perpendicular Lines", "平行线与垂线"),
  t(
    "Two lines in a plane that never meet are parallel; they stay the same distance apart. Two lines that meet at a right angle are perpendicular. Other lines that cross are neither.",
    "同一平面内永不相交的两条直线互相平行，它们之间的距离处处相等。相交成直角的两条直线互相垂直。以其他角度相交的直线既不平行也不垂直。",
  ),
  ["points-lines-rays-and-segments", "right-straight-full-and-null-angles"],
  ["4.G.A.1", "4.G.A.2"],
  [
    point(
      "identifying-parallel-and-perpendicular-lines",
      ["Parallel, perpendicular or neither", "平行、垂直还是都不是"],
      [
        "Train tracks run side by side and never meet: they are parallel, marked with matching arrows. Two streets crossing at a square corner are perpendicular, marked with a small square. Lines that cross at any other angle are neither.\n\nCheck: the gap between parallel lines stays the same all along.\n\n> **Watch out.** Lines that cross are not perpendicular unless the angle is a right angle.",
        "火车的两条铁轨并排延伸，永不相交：它们平行，用相同的箭头标出。两条街道成直角相交：它们垂直，用小正方形标出。以其他角度相交的直线既不平行也不垂直。\n\n检验：平行线之间的距离处处相等。\n\n> **注意。** 相交的直线不一定垂直，只有成直角时才垂直。",
      ],
      (rng) => {
        const k = rng.int(0, 2);
        const base = rng.pick([0, 15, 30, 45, 60, 120, 150]);
        const u = dir(base, 4);
        let marks: Mark[];
        if (k === 0) {
          const nrm = dir(base + 90, 2.2);
          const a1: Point = [-u[0], -u[1]];
          const a2: Point = [nrm[0] - u[0], nrm[1] - u[1]];
          const b2: Point = [nrm[0] + u[0], nrm[1] + u[1]];
          marks = [
            { kind: "segment", a: a1, b: u },
            { kind: "segment", a: a2, b: b2 },
            { kind: "arrows", a: a1, b: u, count: 1 },
            { kind: "arrows", a: a2, b: b2, count: 1 },
          ];
        } else {
          const turn = k === 1 ? 90 : rng.pick([40, 55, 65, 115, 125, 140]);
          const v = dir(base + turn, 4);
          marks = [
            { kind: "segment", a: [-u[0], -u[1]], b: u },
            { kind: "segment", a: [-v[0], -v[1]], b: v },
            k === 1 ? { kind: "right", vertex: [0, 0], from: u, to: v } : { kind: "dot", at: [0, 0] },
          ];
        }
        const opt = (i: number): Pair => [relations[i]!.en, relations[i]!["zh-CN"]];
        const reasons: readonly (readonly Pair[])[] = [
          [
            ["", ""],
            ["Perpendicular lines cross at a right angle, but these never meet.", "垂直的直线相交成直角，而这两条直线不相交。"],
            ["They never meet and have matching arrows, so they are parallel.", "它们不相交，并标有相同的箭头，所以平行。"],
          ],
          [
            ["Parallel lines never meet, but these cross.", "平行线不相交，而这两条直线相交了。"],
            ["", ""],
            ["The small square shows a right angle, so they are perpendicular.", "小正方形表示直角，所以它们垂直。"],
          ],
          [
            ["Parallel lines never meet, but these cross.", "平行线不相交，而这两条直线相交了。"],
            ["Perpendicular lines meet at a right angle, and there is no square mark here.", "垂直的直线相交成直角，这里没有直角记号。"],
            ["", ""],
          ],
        ];
        const meet: readonly Pair[] = [
          ["No. They have matching arrows and never cross.", "不相交。它们标有相同的箭头，永不相交。"],
          ["Yes, they cross.", "相交。"],
          ["Yes, they cross.", "相交。"],
        ];
        const angle: readonly Pair[] = [
          ["Lines that never meet are parallel.", "永不相交的直线互相平行。"],
          ["The small square marks a right angle, so they are perpendicular.", "小正方形表示直角，所以它们垂直。"],
          ["The angle is not a right angle, so they are neither.", "这个角不是直角，所以都不是。"],
        ];
        const checks: readonly Pair[] = [
          ["The gap between them stays the same all along, like train tracks.", "它们之间的距离处处相等，就像铁轨一样。"],
          ["All four angles where they cross are the same size, $90^\\circ$ each.", "相交处的四个角一样大，都是 $90^\\circ$。"],
          [
            "Where they cross, two of the angles are bigger than the other two, so none is a right angle.",
            "相交处有两个角比另外两个大，所以没有一个是直角。",
          ],
        ];
        return picked(
          rng,
          ["How are the two lines related?", "这两条直线是什么关系？"],
          opt(k),
          [0, 1, 2].filter((i) => i !== k).map((i) => [opt(i), reasons[k]![i]![0], reasons[k]![i]![1]] as const),
          [
            [["Do they meet?", "相交吗？"], meet[k]!],
            [["Look at the angle", "看角"], angle[k]!],
          ],
          checks[k]!,
          figureOf(marks, "Two lines in a plane.", "平面内的两条直线。"),
        );
      },
      gradeDrawings["identifying-parallel-and-perpendicular-lines"]!,
    ),
    point(
      "parallel-sides-of-shapes",
      ["Parallel sides of shapes", "图形中的平行边"],
      [
        "A window frame is a rectangle. Its top and bottom are parallel, and so are its two sides: 2 pairs. A regular hexagon has 3 pairs, and a triangle has none. So 4 rectangles have $4 \\times 2 = 8$ pairs.\n\nCheck: $2 + 2 + 2 + 2 = 8$.\n\n> **Watch out.** Count pairs, not sides. A rectangle has 4 sides but 2 pairs of parallel sides.",
        "窗框是长方形。上边和下边平行，左右两边也平行：一共 2 组。正六边形有 3 组，三角形一组也没有。所以 4 个长方形有 $4 \\times 2 = 8$ 组平行边。\n\n检验：$2 + 2 + 2 + 2 = 8$。\n\n> **注意。** 数的是组数，不是边数。长方形有 4 条边，但只有 2 组平行边。",
      ],
      (rng) => {
        const s = rng.pick(shapes.filter((x) => x.parallel > 0));
        const n = rng.int(2, 9);
        const cap = s.name.en.charAt(0).toUpperCase() + s.name.en.slice(1);
        return answered(
          [
            `How many pairs of parallel sides are there in all in $${n}$ copies of ${s.name.en}?`,
            `$${n}$ 个${s.name["zh-CN"]}一共有多少组平行边？`,
          ],
          n * s.parallel,
          [
            [
              ["Pairs in one shape", "一个图形的组数"],
              [`${cap} has ${s.parallel} pairs of parallel sides.`, `${s.name["zh-CN"]}有 ${s.parallel} 组平行边。`],
            ],
            [
              ["Multiply", "相乘"],
              [`$${n} \\times ${s.parallel} = ${n * s.parallel}$.`, `$${n} \\times ${s.parallel} = ${n * s.parallel}$。`],
            ],
          ],
          [
            `Count on by ${s.parallel}: ${Array.from({ length: n }, (_, i) => (i + 1) * s.parallel).join(", ")}.`,
            `${s.parallel} 个 ${s.parallel} 个地数：${Array.from({ length: n }, (_, i) => (i + 1) * s.parallel).join("、")}。`,
          ],
          [
            [n * s.right, "That counts right angles, not pairs of parallel sides.", "这数的是直角，不是平行边。"],
            [n * 2 * s.parallel, "That counts sides, not pairs.", "这数的是边数，不是组数。"],
            [n + s.parallel, "That adds instead of multiplying.", "这是相加，应该相乘。"],
          ],
          { form: "integer" },
        );
      },
      gradeDrawings["parallel-sides-of-shapes"]!,
    ),
  ],
  t(
    "Train tracks run side by side for miles and never meet. Where two streets cross at a square corner, the four corners are all the same. Two roads that cross at a slant make two wide corners and two narrow ones.\n\nCheck: the tracks stay the same distance apart all the way.\n\nIn this lesson we tell parallel, perpendicular and other lines apart and count parallel sides in shapes.",
    "火车的两条铁轨并排延伸很远，永不相交。两条街道成直角相交时，四个角都一样。两条斜着相交的路会形成两个大角和两个小角。\n\n检验：两条铁轨之间的距离一直不变。\n\n本课我们分辨平行线、垂线和其他直线，并数图形中的平行边。",
  ),
);

/** rectFigure draws a rectangle with its length labeled along the bottom and its width up the right side. */
function rectFigure(length: string, width: string, inside = ""): Figure {
  const p: Point[] = [
    [0, 0],
    [6, 0],
    [6, 3.5],
    [0, 3.5],
  ];
  const marks: Mark[] = [
    { kind: "polygon", points: p },
    { kind: "side", a: p[0]!, b: p[1]!, text: length },
    { kind: "side", a: p[1]!, b: p[2]!, text: width },
    ...(inside ? [{ kind: "label", at: [3, 1.75], text: inside, dir: "n" } as Mark] : []),
  ];
  return figureOf(
    marks,
    `A rectangle ${length} long and ${width} wide${inside ? `, labeled ${inside}` : ""}.`,
    `一个长 ${length}、宽 ${width} 的长方形${inside ? `，标着 ${inside}` : ""}。`,
  );
}

export const modelingWithRectangles = topic(
  "modeling-with-rectangles",
  t("Modeling With Rectangles", "用长方形建模"),
  t(
    "The area of a rectangle is length × width and its perimeter is $2$ × (length + width). These formulas solve real problems, including finding a missing side: a rug of area $48$ square feet that is $6$ feet wide is $48 \\div 6 = 8$ feet long.",
    "长方形的面积是长 × 宽，周长是 $2$ × (长 + 宽)。这些公式可以解决实际问题，包括求未知的边长：面积是 $48$ 平方英尺、宽 $6$ 英尺的地毯长 $48 \\div 6 = 8$ 英尺。",
  ),
  ["area-of-a-rectangle-by-multiplying", "two-digit-by-two-digit-multiplication-using-place-value", "division-with-remainders"],
  ["4.MD.A.3"],
  [
    point(
      "area-and-perimeter-word-problems",
      ["Area or perimeter", "面积还是周长"],
      [
        "Grandpa's garden is 8 m long and 5 m wide. A fence goes around the edge, so it needs the perimeter: $2 \\times (8 + 5) = 26$ m. Grass covers the inside, so it needs the area: $8 \\times 5 = 40$ square meters.\n\nCheck: add the four sides, $8 + 5 + 8 + 5 = 26$.\n\n> **Watch out.** A fence goes around, so add the sides. Do not multiply them.",
        "爷爷的菜园长 8 米，宽 5 米。篱笆围在四周，要求周长：$2 \\times (8 + 5) = 26$ 米。草铺满里面，要求面积：$8 \\times 5 = 40$ 平方米。\n\n检验：把四条边加起来，$8 + 5 + 8 + 5 = 26$。\n\n> **注意。** 篱笆围在四周，要把边加起来，不是相乘。",
      ],
      (rng) => {
        const l = rng.int(6, 40);
        const w = rng.int(3, Math.min(l - 1, 25));
        const name = rng.pick(names);
        const figure = rectFigure(`${l} ft`, `${w} ft`);
        if (rng.bool()) {
          const p = 2 * (l + w);
          return answered(
            [
              `${name}'s garden is a rectangle ${l} feet long and ${w} feet wide. How many feet of fencing go all the way around it?`,
              `${name} 的菜园是一个长 ${l} 英尺、宽 ${w} 英尺的长方形。围它一周需要多少英尺的篱笆？`,
            ],
            p,
            [
              [
                ["Around or inside?", "围一周还是铺满？"],
                ["Fencing goes around the edge, so find the perimeter.", "篱笆围在四周，所以求周长。"],
              ],
              [
                ["Add the sides", "把边加起来"],
                [`$2 \\times (${l} + ${w}) = ${p}$.`, `$2 \\times (${l} + ${w}) = ${p}$。`],
              ],
            ],
            [`Add all four sides: $${l} + ${w} + ${l} + ${w} = ${p}$.`, `把四条边都加起来：$${l} + ${w} + ${l} + ${w} = ${p}$。`],
            [
              [l * w, "That is the area, the space inside.", "这是面积，是里面的大小。"],
              [l + w, "That goes only half way round.", "这只围了半圈。"],
              [2 * l + w, "That leaves out one side.", "这漏掉了一条边。"],
            ],
            { form: "integer", figure },
          );
        }
        const [tens, ones] = [l - (l % 10), l % 10];
        return answered(
          [
            `A room is a rectangle ${l} feet long and ${w} feet wide. How many square feet of carpet cover the floor?`,
            `一个房间是长 ${l} 英尺、宽 ${w} 英尺的长方形。铺满地面需要多少平方英尺的地毯？`,
          ],
          l * w,
          [
            [
              ["Around or inside?", "围一周还是铺满？"],
              ["Carpet covers the floor, so find the area.", "地毯铺满地面，所以求面积。"],
            ],
            [
              ["Multiply", "相乘"],
              [`$${l} \\times ${w} = ${l * w}$.`, `$${l} \\times ${w} = ${l * w}$。`],
            ],
          ],
          tens > 0 && ones > 0
            ? [
                `Split the length: $${tens} \\times ${w} + ${ones} \\times ${w} = ${tens * w} + ${ones * w} = ${l * w}$.`,
                `把长拆开：$${tens} \\times ${w} + ${ones} \\times ${w} = ${tens * w} + ${ones * w} = ${l * w}$。`,
              ]
            : [
                `Split the width: $${l} \\times ${w - 1} + ${l} = ${l * (w - 1)} + ${l} = ${l * w}$.`,
                `把宽拆开：$${l} \\times ${w - 1} + ${l} = ${l * (w - 1)} + ${l} = ${l * w}$。`,
              ],
          [
            [2 * (l + w), "That is the perimeter, the edge around the room.", "这是周长，是房间四周的长度。"],
            [l + w, "That adds the two sides instead of multiplying.", "这是把两条边相加了，应该相乘。"],
            [l * w + l, "That adds one row too many.", "这多算了一行。"],
          ],
          { form: "integer", figure },
        );
      },
      rectFigure("8 m", "5 m"),
    ),
    point(
      "finding-a-missing-side",
      ["A missing side", "求未知的边长"],
      [
        "A pen has a perimeter of 30 m and a length of 9 m. Half the perimeter is one length and one width, $30 \\div 2 = 15$ m. So the width is $15 - 9 = 6$ m.\n\nCheck: $2 \\times (9 + 6) = 30$.\n\n> **Watch out.** Halve the perimeter first. $30 - 9 = 21$ is three sides, not one.",
        "一个围栏的周长是 30 米，长 9 米。周长的一半是一条长和一条宽，$30 \\div 2 = 15$ 米。所以宽是 $15 - 9 = 6$ 米。\n\n检验：$2 \\times (9 + 6) = 30$。\n\n> **注意。** 先把周长除以 2。$30 - 9 = 21$ 是三条边的长度，不是一条。",
      ],
      (rng) => {
        const l = rng.int(5, 30);
        const w = rng.int(2, l - 1);
        if (rng.bool()) {
          return answered(
            [
              `A rectangular poster has an area of ${l * w} square inches and is ${l} inches long. How wide is it?`,
              `一张长方形海报的面积是 ${l * w} 平方英寸，长 ${l} 英寸。它宽多少英寸？`,
            ],
            w,
            [
              [
                ["Area is length times width", "面积等于长乘宽"],
                [`$${l} \\times ? = ${l * w}$.`, `$${l} \\times ? = ${l * w}$。`],
              ],
              [
                ["Divide", "相除"],
                [`$${l * w} \\div ${l} = ${w}$.`, `$${l * w} \\div ${l} = ${w}$。`],
              ],
            ],
            [`$${l} \\times ${w} = ${l * w}$.`, `$${l} \\times ${w} = ${l * w}$。`],
            [
              [l * w - l, "That subtracts the length instead of dividing.", "这是减去长，应该除以长。"],
              [l, "That is the length, not the width.", "这是长，不是宽。"],
            ],
            { form: "integer", figure: rectFigure(`${l} in`, "?", `${l * w} sq in`) },
          );
        }
        const p = 2 * (l + w);
        return answered(
          [
            `A rectangular pen has a perimeter of ${p} meters and is ${l} meters long. How wide is it?`,
            `一个长方形围栏的周长是 ${p} 米，长 ${l} 米。它宽多少米？`,
          ],
          w,
          [
            [
              ["Halve the perimeter", "周长除以 2"],
              [`One length and one width make $${p} \\div 2 = ${l + w}$.`, `一条长和一条宽合起来是 $${p} \\div 2 = ${l + w}$。`],
            ],
            [
              ["Subtract the length", "减去长"],
              [`$${l + w} - ${l} = ${w}$.`, `$${l + w} - ${l} = ${w}$。`],
            ],
          ],
          [`$2 \\times (${l} + ${w}) = ${p}$.`, `$2 \\times (${l} + ${w}) = ${p}$。`],
          [
            [
              p - l,
              "That takes one length from the whole perimeter. That leaves three sides.",
              "这是用整个周长减去一条长，剩下的是三条边。",
            ],
            [l + w, "That is the length and width together.", "这是长和宽的和。"],
            [p - 2 * l, "That takes away both lengths but does not halve what is left.", "这减去了两条长，但剩下的没有除以 2。"],
          ],
          { form: "integer", figure: rectFigure(`${l} m`, "?", `P = ${p} m`) },
        );
      },
      gradeDrawings2["modeling-with-rectangles#finding-a-missing-side"]!,
    ),
  ],
  t(
    "Grandpa's garden is a rectangle 8 m long and 5 m wide. He needs a fence to go around it and grass seed to cover it. The fence follows the edge, and the seed covers the inside.\n\nCheck: the fence is $8 + 5 + 8 + 5 = 26$ m long.\n\nIn this lesson we decide between area and perimeter in real problems and find a missing side of a rectangle.",
    "爷爷的菜园是一个长 8 米、宽 5 米的长方形。他要在四周围篱笆，还要在里面撒草籽。篱笆沿着边，草籽铺满里面。\n\n检验：篱笆长 $8 + 5 + 8 + 5 = 26$ 米。\n\n本课我们在实际问题中分清面积和周长，并求长方形未知的边长。",
  ),
);

/** grade4MeasurementTopics are the 4th Grade Math topics on measurement, data and geometry. */
export const grade4MeasurementTopics: readonly TopicDef[] = [
  unitsOfLength,
  unitsOfMass,
  unitsOfTimeAndElapsedTime,
  unitsOfVolume,
  convertingMetricUnitsOfLengthToSmallerUnits,
  convertingCustomaryUnitsOfLengthToSmallerUnits,
  convertingUnitsOfVolumeToSmallerUnits,
  convertingUnitsOfMassToSmallerUnits,
  convertingUnitsOfTimeToSmallerUnits,
  creatingAndInterpretingLinePlots,
  creatingAndInterpretingLinePlotsWithFractions,
  pointsLinesRaysAndSegments,
  connectingAnglesAndCircles,
  measuringAnglesUsingAProtractor,
  rightStraightFullAndNullAngles,
  acuteObtuseAndReflexAngles,
  classifyingFiguresBasedOnAngles,
  sumsOfAngles,
  solvingAngleProblems,
  parallelAndPerpendicularLines,
  modelingWithRectangles,
];

/** gapAcrossUnits builds the knowledge point of how far apart a whole number of a large metric unit and an amount of the small unit are. */
function gapAcrossUnits(id: string, title: Pair, explanation: Pair, big: Unit, small: Unit): KnowledgePointDef {
  return point(
    id,
    title,
    explanation,
    (rng) => {
      const k = rng.int(2, 15);
      const other = (k - 1) * 1000 + rng.int(100, 950);
      const answer = k * 1000 - other;
      return answered(
        [
          `How many ${small.many.en} more is ${amountEn(k, big)} than $${tex(other)}$ ${small.many.en}?`,
          `${amountZh(k, big)}比 $${tex(other)}$ ${small.one["zh-CN"]}多多少${small.one["zh-CN"]}？`,
        ],
        answer,
        [
          [
            [`Change to ${small.many.en}`, `化成${small.one["zh-CN"]}`],
            [
              `1 ${big.one.en} is $1{,}000$ ${small.many.en}. $${k} \\times 1{,}000 = ${tex(k * 1000)}$.`,
              `1 ${big.one["zh-CN"]}是 $1{,}000$ ${small.one["zh-CN"]}。$${k} \\times 1{,}000 = ${tex(k * 1000)}$。`,
            ],
          ],
          [
            ["Subtract", "相减"],
            [`$${tex(k * 1000)} - ${tex(other)} = ${tex(answer)}$.`, `$${tex(k * 1000)} - ${tex(other)} = ${tex(answer)}$。`],
          ],
        ],
        [`Add back: $${tex(other)} + ${tex(answer)} = ${tex(k * 1000)}$.`, `加回去：$${tex(other)} + ${tex(answer)} = ${tex(k * 1000)}$。`],
        [
          [
            other - k,
            `That subtracts ${k} without changing ${big.many.en} to ${small.many.en}.`,
            `这没有把${big.one["zh-CN"]}化成${small.one["zh-CN"]}，就直接减了 ${k}。`,
          ],
          [
            Math.abs(k * 100 - other),
            `That uses 100 ${small.many.en} in a ${big.one.en}. It is $1{,}000$.`,
            `这把 1 ${big.one["zh-CN"]}当成 100 ${small.one["zh-CN"]}了。其实是 $1{,}000$。`,
          ],
          [k * 1000 + other, "That adds instead of finding the difference.", "这是相加，应该求差。"],
        ],
        { form: "integer" },
      );
    },
    tapeFigure(
      [
        { pieces: [{ size: 3000, text: `3 ${big.abbr}`, lit: true }] },
        {
          pieces: [
            { size: 2450, text: `2,450 ${small.abbr}` },
            { size: 550, text: "?", dashed: true },
          ],
        },
      ],
      [
        `A bar for 3 ${big.many.en} over a bar of 2,450 ${small.many.en} and a missing part.`,
        `一个表示 3 ${big.one["zh-CN"]}的长条，下面是 2,450 ${small.one["zh-CN"]}和缺少的一段。`,
      ],
    ),
  );
}

/** longerAcrossUnits finds how many meters longer some kilometers are than some meters. */
export const longerAcrossUnits = gapAcrossUnits(
  "how-much-longer-across-units",
  ["How much longer, across units", "跨单位比较长度"],
  [
    "One trail is 3 kilometers long. Another is $2{,}450$ meters long. How many meters longer is the first? Change 3 kilometers to meters: $3 \\times 1{,}000 = 3{,}000$. Then $3{,}000 - 2{,}450 = 550$. It is 550 meters longer.\n\nCheck: $2{,}450 + 550 = 3{,}000$.\n\n> **Watch out.** Change to the same unit first. You cannot take 3 from $2{,}450$ and get the gap.",
    "一条小路长 3 千米，另一条长 $2{,}450$ 米。第一条长多少米？把 3 千米化成米：$3 \\times 1{,}000 = 3{,}000$。再算 $3{,}000 - 2{,}450 = 550$。长 550 米。\n\n检验：$2{,}450 + 550 = 3{,}000$。\n\n> **注意。** 先化成同一个单位。不能直接用 $2{,}450$ 减 3。",
  ],
  km,
  m,
);

/** heavierAcrossUnits finds how many grams heavier some kilograms are than some grams. */
export const heavierAcrossUnits = gapAcrossUnits(
  "how-much-heavier-across-units",
  ["How much heavier, across units", "跨单位比较质量"],
  [
    "A melon weighs 3 kilograms. A bag of apples weighs $2{,}450$ grams. How many grams heavier is the melon? Change 3 kilograms to grams: $3 \\times 1{,}000 = 3{,}000$. Then $3{,}000 - 2{,}450 = 550$. It is 550 grams heavier.\n\nCheck: $2{,}450 + 550 = 3{,}000$.\n\n> **Watch out.** Change to the same unit first. You cannot take 3 from $2{,}450$ and get the gap.",
    "一个瓜重 3 千克，一袋苹果重 $2{,}450$ 克。瓜重多少克？把 3 千克化成克：$3 \\times 1{,}000 = 3{,}000$。再算 $3{,}000 - 2{,}450 = 550$。重 550 克。\n\n检验：$2{,}450 + 550 = 3{,}000$。\n\n> **注意。** 先化成同一个单位。不能直接用 $2{,}450$ 减 3。",
  ],
  kg,
  g,
);

/** moreAcrossUnits finds how many milliliters more some liters are than some milliliters. */
export const moreAcrossUnits = gapAcrossUnits(
  "how-much-more-across-units",
  ["How much more, across units", "跨单位比较容积"],
  [
    "A pot holds 3 liters of soup. A jug holds $2{,}450$ milliliters. How many milliliters more does the pot hold? Change 3 liters to milliliters: $3 \\times 1{,}000 = 3{,}000$. Then $3{,}000 - 2{,}450 = 550$. It holds 550 milliliters more.\n\nCheck: $2{,}450 + 550 = 3{,}000$.\n\n> **Watch out.** Change to the same unit first. You cannot take 3 from $2{,}450$ and get the gap.",
    "一口锅装 3 升汤，一个壶装 $2{,}450$ 毫升。锅多装多少毫升？把 3 升化成毫升：$3 \\times 1{,}000 = 3{,}000$。再算 $3{,}000 - 2{,}450 = 550$。多装 550 毫升。\n\n检验：$2{,}450 + 550 = 3{,}000$。\n\n> **注意。** 先化成同一个单位。不能直接用 $2{,}450$ 减 3。",
  ],
  liter,
  mL,
);

/** startFromElapsed finds the minute a trip started from its end time and how long it lasted. */
export const startFromElapsed = point(
  "the-start-time-from-the-elapsed-time",
  ["The start time from the elapsed time", "由经过的时间求开始时刻"],
  [
    "A train trip ends at 7:20 and lasts 2 hours 35 minutes. When did it start? Go back 2 hours: 5:20. Then go back 35 minutes. 20 minutes back is 5:00, and 15 more minutes back is 4:45.\n\nCheck: from 4:45, 2 hours later is 6:45, and 35 more minutes is 7:20.\n\n> **Watch out.** A clock counts in sixties. Taking 35 from 20 does not work like column subtraction with hundreds.",
    "一次火车旅行 7:20 结束，历时 2 小时 35 分钟。几点出发的？先倒退 2 小时：5:20。再倒退 35 分钟：退 20 分钟到 5:00，再退 15 分钟到 4:45。\n\n检验：从 4:45 起，2 小时后是 6:45，再过 35 分钟是 7:20。\n\n> **注意。** 时钟是满 60 进一。用 20 减 35 不能像百进制的竖式那样算。",
  ],
  (rng) => {
    const endHour = rng.int(5, 11);
    const endMinute = rng.int(1, 59);
    const hours = rng.int(1, 3);
    const minutes = rng.int(5, 55);
    const total = endHour * 60 + endMinute - hours * 60 - minutes;
    const startHour = Math.floor(total / 60);
    const answer = total % 60;
    const pad = (v: number) => String(v).padStart(2, "0");
    const borrowed = endMinute < minutes;
    const mid = endHour - hours;
    return answered(
      [
        `A train trip ends at ${endHour}:${pad(endMinute)} in the evening and lasts ${hours} ${hours === 1 ? "hour" : "hours"} ${minutes} minutes. It starts at ${startHour}:__. How many minutes go in the blank?`,
        `一次火车旅行在晚上 ${endHour}:${pad(endMinute)} 结束，历时 ${hours} 小时 ${minutes} 分钟。它在 ${startHour}:__ 开始。空格处应填多少分钟？`,
      ],
      answer,
      [
        [
          ["Go back the hours", "先倒退小时"],
          [
            `${hours} ${hours === 1 ? "hour" : "hours"} before ${endHour}:${pad(endMinute)} is ${mid}:${pad(endMinute)}.`,
            `${endHour}:${pad(endMinute)} 往前 ${hours} 小时是 ${mid}:${pad(endMinute)}。`,
          ],
        ],
        [
          ["Go back the minutes", "再倒退分钟"],
          borrowed
            ? [
                `Going back ${endMinute} minutes reaches ${mid}:00. Then ${minutes - endMinute} more minutes back is ${startHour}:${pad(answer)}.`,
                `往前 ${endMinute} 分钟到 ${mid}:00，再往前 ${minutes - endMinute} 分钟是 ${startHour}:${pad(answer)}。`,
              ]
            : [
                `$${endMinute} - ${minutes} = ${answer}$. So it starts at ${startHour}:${pad(answer)}.`,
                `$${endMinute} - ${minutes} = ${answer}$。所以 ${startHour}:${pad(answer)} 出发。`,
              ],
        ],
      ],
      [
        `Start at ${startHour}:${pad(answer)} and add ${hours} h ${minutes} min. That brings you to ${endHour}:${pad(endMinute)}.`,
        `从 ${startHour}:${pad(answer)} 往后加 ${hours} 小时 ${minutes} 分钟，正好到 ${endHour}:${pad(endMinute)}。`,
      ],
      [
        ...(borrowed
          ? ([
              [
                minutes - endMinute,
                "That takes the smaller number from the larger. Go back past the hour instead.",
                "这是用大数减小数。应该退过整点再往前数。",
              ],
              [answer + 40, "That borrows 100 minutes instead of 60.", "这是按 100 分钟借位的，1 小时只有 60 分钟。"],
            ] as const)
          : []),
        [(endMinute + minutes) % 60, "That adds the minutes instead of going back.", "这是把分钟加起来了，应该往前倒退。"],
        [
          60 - answer,
          "That gives the minutes left in the hour, not the minute on the clock.",
          "这是这一小时还剩的分钟数，不是钟面上的分钟。",
        ],
      ],
      { form: "integer", figure: timeLine([endHour * 60 + endMinute, mid * 60 + endMinute, total], [total]) },
    );
  },
  timeLine([440, 320, 285], [285]),
);

/** twoUnitLengths adds two lengths in meters and centimeters and gives the sum in centimeters. */
export const twoUnitLengths = point(
  "adding-lengths-given-in-two-units",
  ["Adding lengths given in two units", "相加用两种单位表示的长度"],
  [
    "One rope is 2 m 65 cm long. Another is 1 m 50 cm. How many centimeters in all? 2 m 65 cm is 265 cm. 1 m 50 cm is 150 cm. Together they are 415 cm, because $265 + 150 = 415$.\n\nCheck: add meters and centimeters apart. 3 m and 115 cm, and 115 cm is 1 m 15 cm. That makes 4 m 15 cm, which is 415 cm.\n\n> **Watch out.** 65 cm and 50 cm make more than 100 cm. Do not lose the extra meter.",
    "一根绳子长 2 米 65 厘米，另一根长 1 米 50 厘米。一共多少厘米？2 米 65 厘米是 265 厘米，1 米 50 厘米是 150 厘米。合起来是 415 厘米，因为 $265 + 150 = 415$。\n\n检验：米和厘米分开加。3 米和 115 厘米，115 厘米是 1 米 15 厘米。一共 4 米 15 厘米，就是 415 厘米。\n\n> **注意。** 65 厘米和 50 厘米合起来超过 100 厘米。不能丢掉多出来的 1 米。",
  ],
  (rng) => {
    const [m1, m2] = [rng.int(1, 9), rng.int(1, 9)];
    const [c1, c2] = [rng.int(15, 95), rng.int(15, 95)];
    const [x, y] = [100 * m1 + c1, 100 * m2 + c2];
    const answer = x + y;
    return answered(
      [
        `A rope of ${m1} m ${c1} cm is tied to a rope of ${m2} m ${c2} cm, ignoring the knot. How many centimeters long are they in all?`,
        `把一根 ${m1} 米 ${c1} 厘米的绳子和一根 ${m2} 米 ${c2} 厘米的绳子接起来（不计绳结）。总共多少厘米？`,
      ],
      answer,
      [
        [
          ["Change to centimeters", "化成厘米"],
          [
            `${m1} m ${c1} cm is ${x} cm. ${m2} m ${c2} cm is ${y} cm.`,
            `${m1} 米 ${c1} 厘米是 ${x} 厘米，${m2} 米 ${c2} 厘米是 ${y} 厘米。`,
          ],
        ],
        [
          ["Add", "相加"],
          [`$${x} + ${y} = ${answer}$.`, `$${x} + ${y} = ${answer}$。`],
        ],
      ],
      [
        `Add meters and centimeters apart: ${m1 + m2} m and ${c1 + c2} cm. That is ${100 * (m1 + m2)} cm and ${c1 + c2} cm, or ${answer} cm.`,
        `米和厘米分开加：${m1 + m2} 米和 ${c1 + c2} 厘米，也就是 ${100 * (m1 + m2)} 厘米和 ${c1 + c2} 厘米，一共 ${answer} 厘米。`,
      ],
      [
        [
          m1 + m2 + c1 + c2,
          "That adds all the numbers without changing meters to centimeters.",
          "这没有把米化成厘米，就把所有数加起来了。",
        ],
        [100 * (m1 + m2) + c1, `That leaves out the ${c2} cm.`, `这漏掉了 ${c2} 厘米。`],
        [10 * (m1 + m2) + c1 + c2, "That uses 10 cm in a meter. It is 100.", "这把 1 米当成 10 厘米了。其实是 100 厘米。"],
        [answer + 100, "That counts one meter too many.", "这多算了 1 米。"],
      ],
      { form: "integer" },
    );
  },
  tapeFigure(
    [
      {
        total: "415 cm",
        pieces: [
          { size: 265, text: "2 m 65 cm", lit: true },
          { size: 150, text: "1 m 50 cm" },
        ],
      },
    ],
    [
      "A bar for 415 centimeters made of 2 meters 65 centimeters and 1 meter 50 centimeters.",
      "一个表示 415 厘米的长条，由 2 米 65 厘米和 1 米 50 厘米组成。",
    ],
  ),
);

/** yardsToInches changes yards to inches through feet. */
export const yardsToInches = point(
  "yards-to-inches-in-two-steps",
  ["Yards to inches in two steps", "分两步把码化成英寸"],
  [
    "How many inches are in 4 yards? First change yards to feet: $4 \\times 3 = 12$ feet. Then change feet to inches: $12 \\times 12 = 144$ inches.\n\nCheck: 1 yard is 36 inches, and $4 \\times 36 = 144$.\n\n> **Watch out.** Do both steps. 12 is the number of feet, not inches.",
    "4 码是多少英寸？先把码化成英尺：$4 \\times 3 = 12$ 英尺。再把英尺化成英寸：$12 \\times 12 = 144$ 英寸。\n\n检验：1 码是 36 英寸，$4 \\times 36 = 144$。\n\n> **注意。** 两步都要做。12 是英尺数，不是英寸数。",
  ],
  (rng) => {
    const y = rng.int(2, 30);
    return answered(
      [`How many inches are in ${y} yards?`, `${y} 码是多少英寸？`],
      36 * y,
      [
        [
          ["Yards to feet", "码化成英尺"],
          [`1 yard is 3 feet. $${y} \\times 3 = ${3 * y}$.`, `1 码是 3 英尺。$${y} \\times 3 = ${3 * y}$。`],
        ],
        [
          ["Feet to inches", "英尺化成英寸"],
          [`1 foot is 12 inches. $${3 * y} \\times 12 = ${36 * y}$.`, `1 英尺是 12 英寸。$${3 * y} \\times 12 = ${36 * y}$。`],
        ],
      ],
      [`1 yard is 36 inches. $${y} \\times 36 = ${36 * y}$.`, `1 码是 36 英寸。$${y} \\times 36 = ${36 * y}$。`],
      [
        [12 * y, "That uses 12 inches in a yard. 12 inches is a foot.", "这把 1 码当成 12 英寸了。12 英寸是 1 英尺。"],
        [3 * y, "That stops at feet.", "这只算到了英尺。"],
        [15 * y, "That adds 3 and 12 instead of multiplying them.", "这把 3 和 12 加起来了，应该相乘。"],
      ],
      { form: "integer" },
    );
  },
  equalTape(3, "12 in", "1 yd"),
);

/** cupsFromLiters counts the small cups that some liters fill. */
export const cupsFromLiters = point(
  "small-cups-from-liters",
  ["Small cups from liters", "几升能倒多少小杯"],
  [
    "How many 250-milliliter cups can 2 liters fill? 2 liters is $2{,}000$ milliliters. $2{,}000 \\div 250 = 8$. So 8 cups.\n\nCheck: $8 \\times 250 = 2{,}000$.\n\n> **Watch out.** Change liters to milliliters first. You cannot share 2 among cups of 250.",
    "2 升水能倒满多少个 250 毫升的杯子？2 升是 $2{,}000$ 毫升。$2{,}000 \\div 250 = 8$。所以能倒 8 杯。\n\n检验：$8 \\times 250 = 2{,}000$。\n\n> **注意。** 先把升化成毫升。不能直接拿 2 去除以 250。",
  ],
  (rng) => {
    const size = rng.pick([100, 125, 200, 250, 500]);
    const l = rng.int(1, 12);
    const count = (l * 1000) / size;
    return answered(
      [
        `How many ${size}-milliliter cups can be filled from ${l} liter${l > 1 ? "s" : ""} of water?`,
        `${l} 升水能装满多少个 ${size} 毫升的杯子？`,
      ],
      count,
      [
        [
          ["Change to milliliters", "化成毫升"],
          [
            `1 liter is $1{,}000$ milliliters. $${l} \\times 1{,}000 = ${tex(l * 1000)}$.`,
            `1 升是 $1{,}000$ 毫升。$${l} \\times 1{,}000 = ${tex(l * 1000)}$。`,
          ],
        ],
        [
          ["Divide", "相除"],
          [`$${tex(l * 1000)} \\div ${size} = ${count}$.`, `$${tex(l * 1000)} \\div ${size} = ${count}$。`],
        ],
      ],
      [`$${count} \\times ${size} = ${tex(l * 1000)}$.`, `$${count} \\times ${size} = ${tex(l * 1000)}$。`],
      [
        [count * 10, "That has one zero too many.", "这多写了一个 0。"],
        [
          (l * 100) % size === 0 ? (l * 100) / size : count + 1,
          (l * 100) % size === 0 ? "That uses 100 mL in a liter. It is 1,000." : "That counts one cup too many.",
          (l * 100) % size === 0 ? "这把 1 升当成 100 毫升了。其实是 1,000 毫升。" : "这多算了一杯。",
        ],
        [l * size, "That multiplies instead of dividing.", "这是相乘，应该相除。"],
      ],
      { form: "integer" },
    );
  },
  equalTape(4, "250 mL", "1 L"),
);

/** bagsFromKilograms counts the equal bags of some grams that some kilograms fill. */
export const bagsFromKilograms = point(
  "how-many-equal-bags-from-a-mass",
  ["How many equal bags from a mass", "一定质量能装多少袋"],
  [
    "3 kg of rice is packed in bags of 500 g. How many bags? 3 kg is $3{,}000$ g. $3{,}000 \\div 500 = 6$. So 6 bags.\n\nCheck: $6 \\times 500 = 3{,}000$.\n\n> **Watch out.** Change kilograms to grams first. 3 bags of 500 g hold only $1{,}500$ g.",
    "把 3 千克大米装进每袋 500 克的袋子。能装多少袋？3 千克是 $3{,}000$ 克。$3{,}000 \\div 500 = 6$。所以能装 6 袋。\n\n检验：$6 \\times 500 = 3{,}000$。\n\n> **注意。** 先把千克化成克。3 袋 500 克只有 $1{,}500$ 克。",
  ],
  (rng) => {
    const each = rng.pick([100, 125, 200, 250, 500]);
    const k = rng.int(2, 30);
    const answer = (k * 1000) / each;
    return answered(
      [
        `${k} kg of rice is packed into bags of ${each} g each. How many bags are filled?`,
        `把 ${k} 千克大米装进每袋 ${each} 克的袋子。能装满多少袋？`,
      ],
      answer,
      [
        [
          ["Change to grams", "化成克"],
          [
            `1 kg is $1{,}000$ g. $${k} \\times 1{,}000 = ${tex(k * 1000)}$.`,
            `1 千克是 $1{,}000$ 克。$${k} \\times 1{,}000 = ${tex(k * 1000)}$。`,
          ],
        ],
        [
          ["Divide", "相除"],
          [`$${tex(k * 1000)} \\div ${each} = ${answer}$.`, `$${tex(k * 1000)} \\div ${each} = ${answer}$。`],
        ],
      ],
      [`$${answer} \\times ${each} = ${tex(k * 1000)}$.`, `$${answer} \\times ${each} = ${tex(k * 1000)}$。`],
      [
        [answer * 10, "That has one zero too many.", "这多写了一个 0。"],
        [
          Number.isInteger(answer / 10) ? answer / 10 : answer + 1,
          Number.isInteger(answer / 10) ? "That uses 100 g in a kilogram. It is 1,000." : "That counts one bag too many.",
          Number.isInteger(answer / 10) ? "这把 1 千克当成 100 克了。其实是 1,000 克。" : "这多算了一袋。",
        ],
        [k * each, "That multiplies instead of dividing.", "这是相乘，应该相除。"],
      ],
      { form: "integer" },
    );
  },
  equalTape(2, "500 g", "1 kg"),
);

/** twoStepTime changes a larger unit of time to a much smaller one through the unit between them. */
export const twoStepTime = point(
  "converting-through-two-units-of-time",
  ["Converting through two units of time", "经过两个时间单位的换算"],
  [
    "How many minutes are in 2 days? First days to hours: $2 \\times 24 = 48$ hours. Then hours to minutes: $48 \\times 60 = 2{,}880$ minutes.\n\nCheck: one day is $24 \\times 60 = 1{,}440$ minutes, and $1{,}440 + 1{,}440 = 2{,}880$.\n\n> **Watch out.** Use the right number at each step: 24 hours in a day, then 60 minutes in an hour.",
    "2 天是多少分钟？先把天化成小时：$2 \\times 24 = 48$ 小时。再把小时化成分钟：$48 \\times 60 = 2{,}880$ 分钟。\n\n检验：1 天是 $24 \\times 60 = 1{,}440$ 分钟，$1{,}440 + 1{,}440 = 2{,}880$。\n\n> **注意。** 每一步要用对进率：1 天 24 小时，1 小时 60 分钟。",
  ],
  (rng) => {
    const [from, fromZh, to, toZh, via, viaZh, f1, f2] = rng.pick([
      ["days", "天", "minutes", "分钟", "hours", "小时", 24, 60],
      ["hours", "小时", "seconds", "秒", "minutes", "分钟", 60, 60],
      ["weeks", "周", "hours", "小时", "days", "天", 7, 24],
    ]) as [string, string, string, string, string, string, number, number];
    const n = rng.int(2, 12);
    const answer = n * f1 * f2;
    return answered(
      [`How many ${to} are in ${n} ${from}?`, `${n} ${fromZh}是多少${toZh}？`],
      answer,
      [
        [
          [`Change to ${via}`, `化成${viaZh}`],
          [`$${n} \\times ${f1} = ${n * f1}$. That is ${n * f1} ${via}.`, `$${n} \\times ${f1} = ${n * f1}$。是 ${n * f1} ${viaZh}。`],
        ],
        [
          [`Change to ${to}`, `化成${toZh}`],
          [`$${n * f1} \\times ${f2} = ${tex(answer)}$.`, `$${n * f1} \\times ${f2} = ${tex(answer)}$。`],
        ],
      ],
      [
        `One of the ${from} is $${f1} \\times ${f2} = ${tex(f1 * f2)}$ ${to}. Then $${n} \\times ${tex(f1 * f2)} = ${tex(answer)}$.`,
        `1 ${fromZh}是 $${f1} \\times ${f2} = ${tex(f1 * f2)}$ ${toZh}。再算 $${n} \\times ${tex(f1 * f2)} = ${tex(answer)}$。`,
      ],
      [
        [n * f1, `That stops at ${via}.`, `这只算到了${viaZh}。`],
        [n * f2, `That skips the step to ${via}.`, `这跳过了化成${viaZh}的一步。`],
        [n * (f1 + f2), "That adds the two numbers instead of multiplying.", "这把两个进率加起来了，应该相乘。"],
        [n * f1 * 100, `That uses 100 instead of ${f2}.`, `这用了 100，应该用 ${f2}。`],
      ],
      { form: "integer" },
    );
  },
  equalTape(2, "24 h", "48 h"),
);

/** markCountsFromList counts the marks a value gets when a line plot is made from a list of data. */
export const markCountsFromList = point(
  "marks-from-a-data-list",
  ["Marks from a data list", "由数据写出标记"],
  [
    "The data are 3, 5, 4, 3, 6, 3, 5. The value 3 appears 3 times, so 3 marks go above 3. The value 5 appears twice, so 2 marks go above 5.\n\nCheck: the marks add up to the length of the list, $3 + 1 + 2 + 1 = 7$.\n\n> **Watch out.** Each time a value appears it gets its own mark. Do not mark a value only once.",
    "数据是 3、5、4、3、6、3、5。3 出现了 3 次，所以 3 的上方画 3 个标记。5 出现了 2 次，所以 5 的上方画 2 个标记。\n\n检验：标记的总数等于数据的个数，$3 + 1 + 2 + 1 = 7$。\n\n> **注意。** 一个数值出现几次就画几个标记，不能只画一个。",
  ],
  (rng) => {
    const low = rng.int(0, 5);
    const data = Array.from({ length: rng.int(8, 13) }, () => rng.int(low, low + 4));
    const v = rng.pick(data);
    const c = countOf(data, v);
    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    return answered(
      [
        `A line plot is made from these data: ${data.join(", ")}. How many marks go above ${v}?`,
        `用这些数据画线图：${data.join("、")}。${v} 的上方有多少个标记？`,
      ],
      c,
      [
        [
          ["Sort the list", "排好顺序"],
          [`In order: ${sorted.join(", ")}.`, `按从小到大排列：${sorted.join("、")}。`],
        ],
        [
          [`Count the ${v}s`, `数 ${v}`],
          [
            `${v} appears ${c} ${c === 1 ? "time" : "times"}, so ${c} ${c === 1 ? "mark goes" : "marks go"} above ${v}.`,
            `${v} 出现了 ${c} 次，所以 ${v} 的上方画 ${c} 个标记。`,
          ],
        ],
      ],
      [
        `The other values appear ${n - c} times, and $${n - c} + ${c} = ${n}$, the length of the list.`,
        `其他数值一共出现 ${n - c} 次，$${n - c} + ${c} = ${n}$，正好是数据的个数。`,
      ],
      [
        [n, "That counts every value in the list.", "这数了所有的数据。"],
        [v, "That is the value, not how many times it appears.", "这是数值本身，不是它出现的次数。"],
        [countOf(data, v + 1), `That counts the ${v + 1}s.`, `这数的是 ${v + 1}。`],
      ],
      { form: "integer" },
    );
  },
  {
    svg: dotPlot([3, 3, 3, 4, 5, 5, 6], { min: 2, max: 7, step: 1 }),
    alt: t(
      "A line plot with 3 marks above 3, 1 above 4, 2 above 5 and 1 above 6.",
      "线图：3 的上方有 3 个标记，4 有 1 个，5 有 2 个，6 有 1 个。",
    ),
  },
);

/** equalFractionsColumn counts the marks above a value when some data are written as equal fractions. */
export const equalFractionsColumn = point(
  "equal-fractions-share-a-column",
  ["Equal fractions share a column", "相等的分数在同一列"],
  [
    "The lengths are $\\frac{1}{2}$, $\\frac{2}{4}$, $\\frac{3}{4}$, $\\frac{1}{2}$ and $\\frac{1}{4}$ inch. $\\frac{2}{4}$ is the same as $\\frac{1}{2}$, so 3 marks go above $\\frac{1}{2}$.\n\nCheck: the marks add up to the 5 lengths, $1 + 3 + 1 = 5$.\n\n> **Watch out.** $\\frac{2}{4}$ does not get its own column. It sits above $\\frac{1}{2}$.",
    "长度是 $\\frac{1}{2}$、$\\frac{2}{4}$、$\\frac{3}{4}$、$\\frac{1}{2}$、$\\frac{1}{4}$ 英寸。$\\frac{2}{4}$ 和 $\\frac{1}{2}$ 相等，所以 $\\frac{1}{2}$ 的上方有 3 个标记。\n\n检验：标记的总数等于 5 个长度，$1 + 3 + 1 = 5$。\n\n> **注意。** $\\frac{2}{4}$ 没有自己的一列，它要标在 $\\frac{1}{2}$ 的上方。",
  ],
  (rng) => {
    const fr = (n: number, d: number) => `\\frac{${n}}{${d}}`;
    const options: readonly [string, number][] = [
      [fr(1, 4), 1],
      [fr(1, 2), 2],
      [fr(2, 4), 2],
      [fr(3, 4), 3],
      [fr(4, 4), 4],
      ["1", 4],
    ];
    const target = rng.pick([2, 4]);
    const sure: [string, number][] =
      target === 2
        ? [
            [fr(2, 4), 2],
            [fr(1, 2), 2],
          ]
        : [
            [fr(4, 4), 4],
            ["1", 4],
          ];
    const data = rng.shuffle([...sure, ...Array.from({ length: rng.int(5, 9) }, () => rng.pick(options))]);
    const count = data.filter((x) => x[1] === target).length;
    const name = target === 2 ? fr(1, 2) : "1";
    const same = target === 2 ? fr(2, 4) : fr(4, 4);
    const written = data.filter((x) => x[0] === name).length;
    const n = data.length;
    return answered(
      [
        `A line plot is made from these lengths, in inches: $${data.map((x) => x[0]).join(",\\ ")}$. How many marks go above $${name}$?`,
        `用这些长度（英寸）画线图：$${data.map((x) => x[0]).join(",\\ ")}$。$${name}$ 的上方有多少个标记？`,
      ],
      count,
      [
        [
          ["Rewrite equal fractions", "改写相等的分数"],
          [
            `The lengths written as $${same}$ equal $${name}$, so they go above $${name}$ too.`,
            `写成 $${same}$ 的长度等于 $${name}$，所以也标在 $${name}$ 的上方。`,
          ],
        ],
        [
          ["Count", "数一数"],
          [
            `${written} written as $${name}$ and ${count - written} written as $${same}$ make $${written} + ${count - written} = ${count}$.`,
            `写成 $${name}$ 的有 ${written} 个，写成 $${same}$ 的有 ${count - written} 个，$${written} + ${count - written} = ${count}$。`,
          ],
        ],
      ],
      [
        `The other lengths number ${n - count}, and $${n - count} + ${count} = ${n}$.`,
        `其他长度有 ${n - count} 个，$${n - count} + ${count} = ${n}$。`,
      ],
      [
        [written, `That counts only the lengths written as $${name}$.`, `这只数了写成 $${name}$ 的长度。`],
        [n, "That counts every length.", "这数了所有的长度。"],
      ],
      { form: "integer" },
    );
  },
  {
    svg: fractionPlot([1, 2, 2, 2, 3], 4, 0, 4),
    alt: t(
      "A line plot from 0 to 1 inch in quarters, with 1 mark above 1/4, 3 above 1/2 and 1 above 3/4.",
      "从 0 到 1 英寸、每格四分之一的线图：1/4 上方 1 个标记，1/2 上方 3 个，3/4 上方 1 个。",
    ),
  },
);

/** anotherRayName finds the other name of a ray through a third point on it. */
export const anotherRayName = point(
  "another-name-for-a-ray",
  ["Another name for a ray", "射线的另一个名字"],
  [
    "Points $A$, $B$ and $C$ lie on a line in that order. Ray $\\overrightarrow{AB}$ starts at $A$ and goes through $B$, on past $C$. So $\\overrightarrow{AC}$ is the same ray.\n\nCheck: both names start at $A$ and point toward $B$ and $C$.\n\n> **Watch out.** The first letter is the endpoint. $\\overrightarrow{BA}$ starts at $B$ and points the other way.",
    "点 $A$、$B$、$C$ 按顺序在一条直线上。射线 $\\overrightarrow{AB}$ 从 $A$ 出发，经过 $B$，再经过 $C$ 一直延伸。所以 $\\overrightarrow{AC}$ 是同一条射线。\n\n检验：两个名字都从 $A$ 开始，都指向 $B$ 和 $C$ 的方向。\n\n> **注意。** 第一个字母是端点。$\\overrightarrow{BA}$ 从 $B$ 出发，指向相反的方向。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M"], 3) as [string, string, string];
    return pickedMath(
      rng,
      [
        `Points $${a}$, $${b}$ and $${c}$ lie on a line in that order. Which names the same ray as $\\overrightarrow{${a}${b}}$?`,
        `点 $${a}$、$${b}$、$${c}$ 按顺序在一条直线上。哪个与 $\\overrightarrow{${a}${b}}$ 是同一条射线？`,
      ],
      `\\overrightarrow{${a}${c}}`,
      [
        [`\\overrightarrow{${b}${a}}`, `That starts at $${b}$ and points back toward $${a}$.`, `它从 $${b}$ 出发，指回 $${a}$ 的方向。`],
        [`\\overrightarrow{${c}${a}}`, `That starts at $${c}$ and points the other way.`, `它从 $${c}$ 出发，方向相反。`],
        [`\\overrightarrow{${b}${c}}`, `That starts at $${b}$, so it leaves out $${a}$.`, `它从 $${b}$ 出发，不包括 $${a}$。`],
      ],
      [
        [
          ["Find the endpoint", "找端点"],
          [
            `$\\overrightarrow{${a}${b}}$ starts at $${a}$ and goes through $${b}$.`,
            `$\\overrightarrow{${a}${b}}$ 从 $${a}$ 出发，经过 $${b}$。`,
          ],
        ],
        [
          ["Follow the ray", "顺着射线看"],
          [
            `$${c}$ lies beyond $${b}$ on the same ray, so $\\overrightarrow{${a}${c}}$ names it too.`,
            `$${c}$ 在同一条射线上 $${b}$ 的后面，所以 $\\overrightarrow{${a}${c}}$ 也是它的名字。`,
          ],
        ],
      ],
      [`Both names start at $${a}$ and point toward $${b}$ and $${c}$.`, `两个名字都从 $${a}$ 开始，都指向 $${b}$ 和 $${c}$。`],
      pointsOnLine([a, b, c]),
    );
  },
  pointsOnLine(["A", "B", "C"]),
);

/** minuteTurn builds a knowledge point on the degrees a minute hand turns in some minutes. */
function minuteTurn(id: string, title: Pair, explanation: Pair, lo: number, hi: number, figure: Figure): KnowledgePointDef {
  return point(
    id,
    title,
    explanation,
    (rng) => {
      const m = rng.int(lo, hi);
      const v = 6 * m;
      return answered(
        [
          `Through how many degrees does the minute hand of a clock turn in ${m} ${m === 1 ? "minute" : "minutes"}?`,
          `钟面上的分针 ${m} 分钟转过多少度？`,
        ],
        v,
        [
          [
            ["One minute", "1 分钟"],
            [
              "The minute hand turns $360^\\circ$ in 60 minutes, and $360 \\div 60 = 6$. That is $6^\\circ$ a minute.",
              "分针 60 分钟转 $360^\\circ$，$360 \\div 60 = 6$，每分钟转 $6^\\circ$。",
            ],
          ],
          [
            [`${m} minutes`, `${m} 分钟`],
            [`$${m} \\times 6 = ${v}$.`, `$${m} \\times 6 = ${v}$。`],
          ],
        ],
        m === 60
          ? ["60 minutes is a whole turn, $360^\\circ$.", "60 分钟正好转一整圈，$360^\\circ$。"]
          : [
              `The rest of the hour is ${60 - m} minutes, or $${60 - m} \\times 6 = ${360 - v}$ degrees, and $${v} + ${360 - v} = 360$.`,
              `这一小时还剩 ${60 - m} 分钟，是 $${60 - m} \\times 6 = ${360 - v}$ 度，$${v} + ${360 - v} = 360$。`,
            ],
        [
          [30 * m, "That uses 30°, the step from one number on the clock to the next.", "这用了 30°，那是钟面上相邻两个数之间的角度。"],
          [m, "That gives the minutes, not the degrees.", "这是分钟数，不是度数。"],
          [360 - v, "That is the turn still left in the hour.", "这是这一小时还没转的角度。"],
        ],
        { form: "integer", unit: "°" },
      );
    },
    figure,
  );
}

/** minuteHand finds how far the minute hand turns in some minutes. */
export const minuteHand = minuteTurn(
  "how-far-the-minute-hand-turns",
  ["How far the minute hand turns", "分针转过的角度"],
  [
    "The minute hand goes all the way round, $360^\\circ$, in 60 minutes. So each minute it turns $360 \\div 60 = 6$ degrees. In 15 minutes it turns $15 \\times 6 = 90$ degrees, from 12 to 3.\n\nCheck: 15 minutes is a quarter of an hour, and a quarter turn is $90^\\circ$.\n\n> **Watch out.** The minute hand turns $6^\\circ$ a minute. $30^\\circ$ is the step between two numbers on the clock.",
    "分针 60 分钟转一整圈，$360^\\circ$。所以每分钟转 $360 \\div 60 = 6$ 度。15 分钟转 $15 \\times 6 = 90$ 度，从 12 转到 3。\n\n检验：15 分钟是一刻钟，四分之一圈是 $90^\\circ$。\n\n> **注意。** 分针每分钟转 $6^\\circ$。$30^\\circ$ 是钟面上相邻两个数之间的角度。",
  ],
  2,
  58,
  gradeDrawings2["connecting-angles-and-circles#how-far-the-minute-hand-turns"]!,
);

/** minuteHandQuarter finds how far a minute hand turns, with a quarter hour as a right angle. */
export const minuteHandQuarter = minuteTurn(
  "how-far-a-minute-hand-turns",
  ["How far a minute hand turns", "分针转过的角度"],
  [
    "In a quarter of an hour, 15 minutes, the minute hand sweeps from 12 to 3. That is a right angle: $15 \\times 6^\\circ = 90^\\circ$, because the hand turns $6^\\circ$ a minute.\n\nCheck: 4 quarter hours make an hour, and $4 \\times 90^\\circ = 360^\\circ$.\n\n> **Watch out.** Multiply the minutes by 6. The minutes alone are not the degrees.",
    "一刻钟，也就是 15 分钟，分针从 12 转到 3。这是一个直角：$15 \\times 6^\\circ = 90^\\circ$，因为分针每分钟转 $6^\\circ$。\n\n检验：4 个一刻钟是 1 小时，$4 \\times 90^\\circ = 360^\\circ$。\n\n> **注意。** 要用分钟数乘 6。分钟数本身不是度数。",
  ],
  1,
  60,
  gradeDrawings2["right-straight-full-and-null-angles#how-far-a-minute-hand-turns"]!,
);

/** otherScale reads the right measure of an acute angle read on the wrong scale of a protractor. */
export const otherScale = point(
  "the-other-scale-of-a-protractor",
  ["The other scale of a protractor", "量角器的另一圈刻度"],
  [
    "A protractor has two scales that run opposite ways, and the two numbers at a mark add to 180. Mia measures a narrow angle and reads $120^\\circ$. That cannot be right for an angle smaller than a square corner, so she uses the other scale: $180 - 120 = 60$, and the angle is $60^\\circ$.\n\nCheck: $60 + 120 = 180$.\n\n> **Watch out.** If the reading does not fit how the angle looks, you read the wrong scale.",
    "量角器有两圈方向相反的刻度，同一刻度线上的两个数相加是 180。米娅量一个很窄的角，读到 $120^\\circ$。比直角小的角不可能是这个度数，所以要用另一圈刻度：$180 - 120 = 60$，这个角是 $60^\\circ$。\n\n检验：$60 + 120 = 180$。\n\n> **注意。** 读数和角的样子不符，说明读错了刻度。",
  ],
  (rng) => {
    const w = rng.int(91, 175);
    return answered(
      [
        `An angle is clearly acute, but a student read $${w}^\\circ$ from the wrong scale of a protractor. What is its measure, in degrees?`,
        `一个角明显是锐角，但学生从量角器的错误刻度上读到 $${w}^\\circ$。它是多少度？`,
      ],
      180 - w,
      [
        [
          ["Look at the angle", "看角的样子"],
          [
            `It is acute, so it is less than $90^\\circ$. $${w}^\\circ$ cannot be right.`,
            `它是锐角，小于 $90^\\circ$，不可能是 $${w}^\\circ$。`,
          ],
        ],
        [
          ["Use the other scale", "改用另一圈刻度"],
          [
            `The two scales add to 180 at each mark: $180 - ${w} = ${180 - w}$.`,
            `同一刻度线上两圈的数相加是 180：$180 - ${w} = ${180 - w}$。`,
          ],
        ],
      ],
      [
        `$${180 - w} + ${w} = 180$, and $${180 - w}^\\circ$ is less than $90^\\circ$, as an acute angle should be.`,
        `$${180 - w} + ${w} = 180$，并且 $${180 - w}^\\circ$ 小于 $90^\\circ$，符合锐角。`,
      ],
      [
        [w - 90, "That takes away 90, not 180.", "这是减去 90，应该减去 180。"],
        [360 - w, "That uses a whole turn. The two scales add to 180.", "这用了一整圈。两圈刻度相加是 180。"],
        [w, "That keeps the wrong scale.", "这还是错误刻度上的读数。"],
      ],
      { form: "integer", unit: "°" },
    );
  },
  gradeDrawings2["measuring-angles-using-a-protractor#the-other-scale-of-a-protractor"]!,
);

/** aroundAPoint finds the fourth angle around a point from the other three. */
export const aroundAPoint = point(
  "the-angle-left-around-a-point",
  ["The angle left around a point", "一点周围剩下的角"],
  [
    "Angles of $110^\\circ$ and $90^\\circ$ sit around a point, and one angle is missing. Together the known ones make $200^\\circ$. A whole turn is $360^\\circ$, so the missing angle is $360^\\circ - 200^\\circ = 160^\\circ$.\n\nCheck: $110^\\circ + 90^\\circ + 160^\\circ = 360^\\circ$.\n\n> **Watch out.** The angle left over can be bigger than a straight angle. Then it is a reflex angle, and that is fine.",
    "一点周围有 $110^\\circ$ 和 $90^\\circ$ 两个角，还缺一个角。已知的角合起来是 $200^\\circ$。一整圈是 $360^\\circ$，所以缺的角是 $360^\\circ - 200^\\circ = 160^\\circ$。\n\n检验：$110^\\circ + 90^\\circ + 160^\\circ = 360^\\circ$。\n\n> **注意。** 剩下的角可能比平角还大，那它就是优角，这没有问题。",
  ],
  (rng) => {
    const a = rng.int(25, 130);
    const b = rng.int(25, 110);
    const c = rng.int(25, 90);
    const s = a + b + c;
    const answer = 360 - s;
    return answered(
      [
        `Four angles fill the space around a point. Three of them measure $${a}^\\circ$, $${b}^\\circ$ and $${c}^\\circ$. How many degrees is the fourth?`,
        `四个角铺满一点的周围。其中三个角分别是 $${a}^\\circ$、$${b}^\\circ$ 和 $${c}^\\circ$。第四个角是多少度？`,
      ],
      answer,
      [
        [
          ["Add the known angles", "把已知的角相加"],
          [`$${a} + ${b} + ${c} = ${s}$.`, `$${a} + ${b} + ${c} = ${s}$。`],
        ],
        [
          ["Subtract from a whole turn", "用一整圈去减"],
          [`$360 - ${s} = ${answer}$.`, `$360 - ${s} = ${answer}$。`],
        ],
      ],
      [
        `Take the angles away one at a time: $360 - ${a} - ${b} - ${c} = ${answer}$.`,
        `一个一个地减：$360 - ${a} - ${b} - ${c} = ${answer}$。`,
      ],
      [
        ...(180 - s > 0
          ? ([[180 - s, "That uses 180°. Angles around a point make 360°.", "这用了 180°。围绕一点的角合起来是 360°。"]] as const)
          : []),
        [s, "That is the three known angles together.", "这是三个已知角的和。"],
        [360 - a - b, "That leaves out one of the known angles.", "这漏减了一个已知角。"],
      ],
      { form: "integer", unit: "°" },
    );
  },
  gradeDrawings2["acute-obtuse-and-reflex-angles#the-angle-left-around-a-point"]!,
);

/** triangleFromTwoAngles classifies a triangle from two of its angles. */
export const triangleFromTwoAngles = point(
  "classifying-from-two-angles",
  ["Classifying from two angles", "由两个角判断类型"],
  [
    "A triangle has angles of $35^\\circ$ and $40^\\circ$. The three angles add to $180^\\circ$, so the third is $180^\\circ - 35^\\circ - 40^\\circ = 105^\\circ$. That one is over $90^\\circ$, so the triangle is obtuse.\n\nCheck: $35 + 40 + 105 = 180$.\n\n> **Watch out.** Two acute angles are not enough. Find the third angle before you decide.",
    "一个三角形有 $35^\\circ$ 和 $40^\\circ$ 两个角。三个角加起来是 $180^\\circ$，所以第三个角是 $180^\\circ - 35^\\circ - 40^\\circ = 105^\\circ$。它大于 $90^\\circ$，所以是钝角三角形。\n\n检验：$35 + 40 + 105 = 180$。\n\n> **注意。** 有两个锐角还不够，要先求出第三个角再判断。",
  ],
  (rng) => {
    const kind = rng.int(0, 2);
    const c = kind === 0 ? rng.int(60, 85) : kind === 1 ? 90 : rng.int(95, 150);
    const a = kind === 0 ? rng.int(91 - c, Math.min(85, 175 - c)) : rng.int(5, 175 - c);
    const b = 180 - c - a;
    const big = Math.max(a, b, c);
    const opt: readonly Pair[] = [
      ["Acute", "锐角三角形"],
      ["Right", "直角三角形"],
      ["Obtuse", "钝角三角形"],
    ];
    const reasons: readonly Pair[] = [
      [
        `An acute triangle has all three angles under $90^\\circ$, and the largest here is $${big}^\\circ$.`,
        `锐角三角形的三个角都小于 $90^\\circ$，而这里最大的角是 $${big}^\\circ$。`,
      ],
      [
        `A right triangle has an angle of exactly $90^\\circ$, and the largest here is $${big}^\\circ$.`,
        `直角三角形有一个角正好是 $90^\\circ$，而这里最大的角是 $${big}^\\circ$。`,
      ],
      [
        `An obtuse triangle has an angle over $90^\\circ$, and the largest here is $${big}^\\circ$.`,
        `钝角三角形有一个角大于 $90^\\circ$，而这里最大的角是 $${big}^\\circ$。`,
      ],
    ];
    const look: readonly Pair[] = [
      [
        `The largest angle is $${big}^\\circ$, less than $90^\\circ$. All three are acute.`,
        `最大的角是 $${big}^\\circ$，小于 $90^\\circ$，三个角都是锐角。`,
      ],
      ["The third angle is exactly $90^\\circ$, a right angle.", "第三个角正好是 $90^\\circ$，是直角。"],
      [`The third angle, $${c}^\\circ$, is more than $90^\\circ$. It is obtuse.`, `第三个角 $${c}^\\circ$ 大于 $90^\\circ$，是钝角。`],
    ];
    return picked(
      rng,
      [
        `Two angles of a triangle measure $${a}^\\circ$ and $${b}^\\circ$. What kind of triangle is it?`,
        `三角形的两个角是 $${a}^\\circ$ 和 $${b}^\\circ$。它是什么三角形？`,
      ],
      opt[kind]!,
      [0, 1, 2].filter((i) => i !== kind).map((i) => [opt[i]!, reasons[i]![0], reasons[i]![1]] as const),
      [
        [
          ["Find the third angle", "求第三个角"],
          [`$180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$.`, `$180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$。`],
        ],
        [["Look at the largest", "看最大的角"], look[kind]!],
      ],
      [`Add all three: $${a} + ${b} + ${c} = 180$.`, `三个角相加：$${a} + ${b} + ${c} = 180$。`],
    );
  },
  gradeDrawings2["classifying-figures-based-on-angles#classifying-from-two-angles"]!,
);

/** lineChains decides how two lines are related from how each meets a third line. */
export const lineChains = point(
  "chains-of-line-relations",
  ["Chains of line relations", "直线关系的传递"],
  [
    "On a ladder, each rung is perpendicular to the side rail. Two rungs perpendicular to the same rail never meet, so they are parallel. A line perpendicular to one of two parallel lines is perpendicular to the other one too.\n\nCheck: draw the rail up the page. Both rungs then run across, side by side.\n\n> **Watch out.** Two perpendicular steps make lines parallel, not perpendicular.",
    "梯子的每根横档都垂直于边上的竖杆。垂直于同一根竖杆的两根横档不会相交，所以互相平行。垂直于两条平行线之一的直线，也垂直于另一条。\n\n检验：把竖杆画成上下方向，两根横档就都是左右方向，并排在一起。\n\n> **注意。** 两次垂直得到的是平行，不是垂直。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(["k", "l", "m", "n", "p", "q", "r", "s"], 3) as [string, string, string];
    const form = rng.int(0, 2);
    const sign = (x: boolean) => (x ? "\\perp" : "\\parallel");
    const first = form !== 1;
    const second = form === 0;
    const isParallel = first === second;
    const parallel: Pair = ["Parallel", "平行"];
    const perpendicular: Pair = ["Perpendicular", "垂直"];
    const way = (perp: boolean): Pair => (perp ? ["up and down", "上下方向"] : ["across", "左右方向"]);
    const rel = (x: string, perp: boolean): Pair =>
      perp
        ? [`$${x}$ crosses $${b}$ at a right angle.`, `$${x}$ 和 $${b}$ 相交成直角。`]
        : [`$${x}$ runs the same way as $${b}$.`, `$${x}$ 和 $${b}$ 方向相同。`];
    return picked(
      rng,
      [
        `In a plane, line $${a} ${sign(first)} ${b}$ and line $${b} ${sign(second)} ${c}$. How are lines $${a}$ and $${c}$ related?`,
        `在同一平面内，$${a} ${sign(first)} ${b}$，$${b} ${sign(second)} ${c}$。直线 $${a}$ 和 $${c}$ 有什么关系？`,
      ],
      isParallel ? parallel : perpendicular,
      [
        isParallel
          ? [
              perpendicular,
              `Perpendicular lines cross, but $${a}$ and $${c}$ run the same way.`,
              `垂直的直线会相交，而 $${a}$ 和 $${c}$ 方向相同。`,
            ]
          : [
              parallel,
              `Parallel lines never meet, but $${a}$ crosses the way $${c}$ runs.`,
              `平行线不相交，而 $${a}$ 和 $${c}$ 方向不同，会相交。`,
            ],
        [
          ["They meet, but not at a right angle", "相交但不垂直"],
          "Each line runs either across or up and down, so any crossing is at a right angle.",
          "每条直线不是左右方向就是上下方向，所以相交时一定成直角。",
        ],
      ],
      [
        [[`Compare $${a}$ with $${b}$`, `比较 $${a}$ 和 $${b}$`], rel(a, first)],
        [[`Compare $${c}$ with $${b}$`, `比较 $${c}$ 和 $${b}$`], rel(c, second)],
      ],
      [
        `Draw $${b}$ across the page. Then $${a}$ runs ${way(first)[0]} and $${c}$ runs ${way(second)[0]}, so they are ${isParallel ? "parallel" : "perpendicular"}.`,
        `把 $${b}$ 画成左右方向。那么 $${a}$ 是${way(first)[1]}，$${c}$ 是${way(second)[1]}，所以它们${isParallel ? "平行" : "垂直"}。`,
      ],
    );
  },
  gradeDrawings2["parallel-and-perpendicular-lines#chains-of-line-relations"]!,
);

/** equalAnglesAroundPoint shares what one known angle leaves of a whole turn among equal angles. */
export const equalAnglesAroundPoint = point(
  "equal-angles-around-a-point",
  ["Equal angles around a point", "一点周围相等的角"],
  [
    "Around a point there is one angle of $100^\\circ$ and two equal angles. The known angle leaves $360^\\circ - 100^\\circ = 260^\\circ$. The two equal angles share it, so each is $260^\\circ \\div 2 = 130^\\circ$.\n\nCheck: $100^\\circ + 130^\\circ + 130^\\circ = 360^\\circ$.\n\n> **Watch out.** Take away the known angle first. It does not share in the equal parts.",
    "一点周围有一个 $100^\\circ$ 的角和两个相等的角。已知角用掉后还剩 $360^\\circ - 100^\\circ = 260^\\circ$。两个相等的角平分它，每个是 $260^\\circ \\div 2 = 130^\\circ$。\n\n检验：$100^\\circ + 130^\\circ + 130^\\circ = 360^\\circ$。\n\n> **注意。** 要先减去已知的角，它不参加平分。",
  ],
  (rng) => {
    const count = rng.int(3, 6);
    const each = rng.pick([...Array(71).keys()].map((i) => 20 + i).filter((v) => 360 - v * count > 0 && 360 - v * count < 180));
    const known = 360 - each * count;
    const left = 360 - known;
    return answered(
      [
        `Around a point there is one angle of $${known}^\\circ$ and $${count}$ other angles that are all equal. How many degrees is each of the equal angles?`,
        `一点周围有一个 $${known}^\\circ$ 的角和另外 $${count}$ 个相等的角。每个相等的角是多少度？`,
      ],
      each,
      [
        [
          ["Take away the known angle", "减去已知的角"],
          [`$360^\\circ - ${known}^\\circ = ${left}^\\circ$.`, `$360^\\circ - ${known}^\\circ = ${left}^\\circ$。`],
        ],
        [
          ["Share equally", "平均分"],
          [`$${left}^\\circ \\div ${count} = ${each}^\\circ$.`, `$${left}^\\circ \\div ${count} = ${each}^\\circ$。`],
        ],
      ],
      [
        `$${known}^\\circ + ${count} \\times ${each}^\\circ = ${known}^\\circ + ${left}^\\circ = 360^\\circ$.`,
        `$${known}^\\circ + ${count} \\times ${each}^\\circ = ${known}^\\circ + ${left}^\\circ = 360^\\circ$。`,
      ],
      [
        ...(360 % (count + 1) === 0
          ? ([
              [
                360 / (count + 1),
                "That shares 360° among all the angles, the known one too.",
                "这是把 360° 平分给所有的角，连已知的角也算进去了。",
              ],
            ] as const)
          : []),
        [left, "That is all the equal angles together, not each one.", "这是所有相等的角的和，不是每一个。"],
        ...(360 % count === 0
          ? ([[360 / count, "That forgets to take away the known angle first.", "这忘了先减去已知的角。"]] as const)
          : []),
      ],
      { form: "integer", unit: "°" },
    );
  },
  gradeDrawings2["sums-of-angles#equal-angles-around-a-point"]!,
);

/** clockAngle finds the angle between clock hands on the hour, or how far the hour hand turns. */
export const clockAngle = point(
  "the-angle-between-clock-hands-on-the-hour",
  ["The angle between clock hands on the hour", "整点时钟面上两针的夹角"],
  [
    "A clock face is a whole turn, $360^\\circ$, cut into 12 hours, so the hour marks are $360^\\circ \\div 12 = 30^\\circ$ apart. At 4:00 the minute hand points at 12 and the hour hand at 4. They are 4 marks apart, so the angle is $4 \\times 30^\\circ = 120^\\circ$.\n\nCheck: the long way round is 8 marks, $240^\\circ$, and $120^\\circ + 240^\\circ = 360^\\circ$.\n\n> **Watch out.** Each hour mark is $30^\\circ$, not $6^\\circ$. $6^\\circ$ is one minute mark.",
    "钟面是一整圈 $360^\\circ$，分成 12 个小时，所以相邻两个小时刻度相差 $360^\\circ \\div 12 = 30^\\circ$。4:00 时分针指着 12，时针指着 4，相隔 4 个刻度，所以夹角是 $4 \\times 30^\\circ = 120^\\circ$。\n\n检验：沿远路是 8 个刻度，$240^\\circ$，$120^\\circ + 240^\\circ = 360^\\circ$。\n\n> **注意。** 每个小时刻度是 $30^\\circ$，不是 $6^\\circ$。$6^\\circ$ 是一个分钟刻度。",
  ],
  (rng) => {
    const hour = rng.int(1, 11);
    if (rng.bool()) {
      const hours = rng.int(2, 11);
      const later = ((hour + hours - 1) % 12) + 1;
      const answer = hours * 30;
      return answered(
        [
          `Through how many degrees does the hour hand of a clock turn from ${hour}:00 to the next ${later}:00?`,
          `从 ${hour}:00 到接下来的 ${later}:00，钟面上的时针转过多少度？`,
        ],
        answer,
        [
          [
            ["One hour", "1 小时"],
            [
              "The hour hand moves one hour mark each hour, $360^\\circ \\div 12 = 30^\\circ$.",
              "时针每小时走一个小时刻度，$360^\\circ \\div 12 = 30^\\circ$。",
            ],
          ],
          [
            [`${hours} hours`, `${hours} 小时`],
            [`$${hours} \\times 30^\\circ = ${answer}^\\circ$.`, `$${hours} \\times 30^\\circ = ${answer}^\\circ$。`],
          ],
        ],
        [
          `In 12 hours the hand goes all the way round. The other ${12 - hours} hours are $${(12 - hours) * 30}^\\circ$, and $${answer}^\\circ + ${(12 - hours) * 30}^\\circ = 360^\\circ$.`,
          `时针 12 小时转一整圈。其余 ${12 - hours} 小时是 $${(12 - hours) * 30}^\\circ$，$${answer}^\\circ + ${(12 - hours) * 30}^\\circ = 360^\\circ$。`,
        ],
        [
          [hours * 6, "That uses 6°, one minute mark.", "这用了 6°，那是一个分钟刻度。"],
          [hours * 60, "That counts minutes, not degrees.", "这算的是分钟数，不是度数。"],
          [later * 30, `That measures from 12, not from ${hour}.`, `这是从 12 量起的，应该从 ${hour} 量起。`],
          [360 - answer, "That is the rest of the turn.", "这是一圈中剩下的部分。"],
        ],
        { form: "integer", unit: "°" },
      );
    }
    const gaps = Math.min(hour, 12 - hour);
    const answer = gaps * 30;
    return answered(
      [
        `What is the smaller angle, in degrees, between the hands of a clock at ${hour}:00?`,
        `${hour}:00 时，钟面上两针所成的较小的角是多少度？`,
      ],
      answer,
      [
        [
          ["Count the hour marks", "数小时刻度"],
          [`The hands are ${gaps} hour ${gaps === 1 ? "mark" : "marks"} apart the short way round.`, `沿近路两针相隔 ${gaps} 个小时刻度。`],
        ],
        [
          ["Multiply by 30", "乘 30"],
          [`$${gaps} \\times 30^\\circ = ${answer}^\\circ$.`, `$${gaps} \\times 30^\\circ = ${answer}^\\circ$。`],
        ],
      ],
      [
        `The long way round is ${12 - gaps} marks, $${(12 - gaps) * 30}^\\circ$, and $${answer}^\\circ + ${(12 - gaps) * 30}^\\circ = 360^\\circ$.`,
        `沿远路是 ${12 - gaps} 个刻度，$${(12 - gaps) * 30}^\\circ$，$${answer}^\\circ + ${(12 - gaps) * 30}^\\circ = 360^\\circ$。`,
      ],
      [
        [360 - answer, "That is the larger angle, the long way round.", "这是较大的角，是沿远路量的。"],
        [hour * 6, "That uses 6°, one minute mark.", "这用了 6°，那是一个分钟刻度。"],
        [gaps * 60, "That counts minutes, not degrees.", "这算的是分钟数，不是度数。"],
      ],
      { form: "integer", unit: "°" },
    );
  },
  gradeDrawings2["solving-angle-problems#the-angle-between-clock-hands-on-the-hour"]!,
);

/** rectangleFromRatio finds a side or the area of a rectangle from its perimeter and how many times its width its length is. */
export const rectangleFromRatio = point(
  "a-rectangle-from-its-perimeter-and-a-side-comparison",
  ["A rectangle from its perimeter and a side comparison", "由周长和边的倍数关系求长方形"],
  [
    "A rectangle has a perimeter of 48 cm, and its length is 3 times its width. Half the perimeter, 24 cm, is one length and one width. That is 3 parts and 1 part, 4 equal parts. So the width is $24 \\div 4 = 6$ cm and the length is $3 \\times 6 = 18$ cm.\n\nCheck: $2 \\times (18 + 6) = 48$.\n\n> **Watch out.** The length and width make $3 + 1 = 4$ parts, not 3.",
    "一个长方形的周长是 48 厘米，长是宽的 3 倍。周长的一半 24 厘米是一条长和一条宽，也就是 3 份加 1 份，共 4 份。所以宽是 $24 \\div 4 = 6$ 厘米，长是 $3 \\times 6 = 18$ 厘米。\n\n检验：$2 \\times (18 + 6) = 48$。\n\n> **注意。** 长和宽合起来是 $3 + 1 = 4$ 份，不是 3 份。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const width = rng.int(2, 15);
    const length = k * width;
    const perimeter = 2 * (length + width);
    const half = perimeter / 2;
    const asksArea = rng.bool();
    const answer = asksArea ? length * width : width;
    const walk: Walk[] = [
      [
        ["Halve the perimeter", "周长除以 2"],
        [`One length and one width make $${perimeter} \\div 2 = ${half}$.`, `一条长和一条宽合起来是 $${perimeter} \\div 2 = ${half}$。`],
      ],
      [
        ["Find one part", "求一份"],
        [
          `They make $${k} + 1 = ${k + 1}$ equal parts, so the width is $${half} \\div ${k + 1} = ${width}$.`,
          `它们一共是 $${k} + 1 = ${k + 1}$ 份，所以宽是 $${half} \\div ${k + 1} = ${width}$。`,
        ],
      ],
    ];
    if (asksArea)
      walk.push([
        ["Find the area", "求面积"],
        [
          `The length is $${k} \\times ${width} = ${length}$, and $${length} \\times ${width} = ${answer}$.`,
          `长是 $${k} \\times ${width} = ${length}$，面积是 $${length} \\times ${width} = ${answer}$。`,
        ],
      ]);
    return answered(
      [
        `A rectangle has a perimeter of ${perimeter} cm, and its length is ${k} times its width. Find its ${asksArea ? "area in square centimeters" : "width in centimeters"}.`,
        `一个长方形的周长是 ${perimeter} 厘米，长是宽的 ${k} 倍。求它的${asksArea ? "面积（平方厘米）" : "宽（厘米）"}。`,
      ],
      answer,
      walk,
      [
        `$2 \\times (${length} + ${width}) = ${perimeter}$, and ${length} is ${k} times ${width}.`,
        `$2 \\times (${length} + ${width}) = ${perimeter}$，并且 ${length} 是 ${width} 的 ${k} 倍。`,
      ],
      asksArea
        ? [
            [width * width, "That multiplies the width by itself. Use the length.", "这是宽乘宽，应该乘长。"],
            [perimeter, "That is the perimeter, not the area.", "这是周长，不是面积。"],
            [half * width, "That uses half the perimeter as the length.", "这把周长的一半当成长了。"],
          ]
        : [
            ...(half % k === 0
              ? ([
                  [
                    half / k,
                    `That splits half the perimeter into ${k} parts. There are ${k + 1}.`,
                    `这把周长的一半分成了 ${k} 份，其实是 ${k + 1} 份。`,
                  ],
                ] as const)
              : []),
            ...(perimeter % (k + 1) === 0
              ? ([
                  [
                    perimeter / (k + 1),
                    `That splits the whole perimeter into ${k + 1} parts. Halve it first.`,
                    `这把整个周长分成了 ${k + 1} 份，应该先除以 2。`,
                  ],
                ] as const)
              : []),
            [length, "That is the length, not the width.", "这是长，不是宽。"],
            [half, "That is the length and width together.", "这是长和宽的和。"],
          ],
      { form: "integer" },
    );
  },
  tapeFigure(
    [
      {
        total: "24 cm",
        pieces: [
          { size: 1, text: "6" },
          { size: 1, text: "6" },
          { size: 1, text: "6" },
          { size: 1, text: "6", lit: true },
        ],
      },
    ],
    [
      "A bar for 24 centimeters, half the perimeter, cut into 3 parts for the length and 1 part for the width, each 6.",
      "一个表示周长一半 24 厘米的长条，长占 3 份，宽占 1 份，每份是 6。",
    ],
  ),
);
