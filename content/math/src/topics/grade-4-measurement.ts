import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dotPlot, gcd, type Mark, type Point, Q, sketch, svgDocument } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem } from "../problems.ts";

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
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** pickChoice builds a choice problem from a correct option and distinct wrong ones, keeping at most three wrong ones. */
function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))).slice(0, 3);
  const options = rng.shuffle([correct, ...rest]);
  return { ...choiceProblem({ prompt, options, correct: options.indexOf(correct), solution }), ...(figure && { figure }) };
}

/** fmt writes a whole number with thousands separators. */
const fmt = (n: number) => n.toLocaleString("en-US");

/** tex writes a whole number in LaTeX with thousands separators. */
const tex = (n: number) => fmt(n).replace(/,/g, "{,}");

const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

// ---------------------------------------------------------------------------
// Units

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
const mi = unit("mile", "miles", "英里");
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

/** amount writes n of a unit in English, singular or plural. */
const amountEn = (n: number, u: Unit) => `${fmt(n)} ${n === 1 ? u.one.en : u.many.en}`;

/** amountZh writes n of a unit in Chinese. */
const amountZh = (n: number, u: Unit) => `${fmt(n)} ${u.one["zh-CN"]}`;

/** unitName is a unit as a choice option. */
const unitName = (u: Unit): Text => u.many;

/** Estimate is an object, how big it is in one unit, and the unit choices to pick from. */
interface Estimate {
  readonly thing: Text;
  readonly low: number;
  readonly high: number;
  readonly unit: Unit;
  readonly others: readonly Unit[];
}

/** estimateKP asks which unit makes "about n ___" true for an everyday object. */
function estimateKP(
  id: string,
  title: Text,
  explanation: Text,
  estimates: readonly Estimate[],
  measure: (amount: string) => Text,
): KnowledgePointDef {
  return {
    id,
    title,
    explanation,
    generate(rng) {
      const e = rng.pick(estimates);
      const n = rng.int(e.low, e.high);
      return pickChoice(
        rng,
        t(
          `${e.thing.en} ${measure(`${fmt(n)} ___`).en}. Which unit fits?`,
          `${e.thing["zh-CN"]}${measure(`${fmt(n)} ___`)["zh-CN"]}。应填哪个单位？`,
        ),
        unitName(e.unit),
        e.others.map(unitName),
        t(
          `${e.thing.en} ${measure(amountEn(n, e.unit)).en}; the other units would make it far too large or too small.`,
          `${e.thing["zh-CN"]}${measure(amountZh(n, e.unit))["zh-CN"]}；用其他单位就太大或太小了。`,
        ),
      );
    },
  };
}

/** Conversion is a larger unit, a smaller unit and how many of the smaller make one of the larger. */
interface Conversion {
  readonly big: Unit;
  readonly small: Unit;
  readonly factor: number;
}

/** relationKP asks how many of a smaller unit make several of a larger one, or which of two amounts is greater. */
function relationKP(id: string, conversions: readonly Conversion[]): KnowledgePointDef {
  return {
    id,
    title: t("Comparing units", "比较单位的大小"),
    explanation: t(
      "Larger units hold many smaller ones, so the same amount takes fewer of the larger unit. $1$ meter is $100$ centimeters, so $3$ meters is more than $250$ centimeters.",
      "大单位包含许多小单位，所以同样的量用大单位表示时数更小。$1$ 米是 $100$ 厘米，所以 $3$ 米比 $250$ 厘米长。",
    ),
    generate(rng) {
      const c = rng.pick(conversions);
      const a = rng.int(1, 9);
      const big = a * c.factor;
      const rel = rng.int(0, 2);
      const step = rng.int(1, c.factor - 1);
      const b = rel === 0 ? big + step : rel === 1 ? big : big - step;
      const x = `\\text{${amountEn(a, c.big)}}`;
      const y = `\\text{${amountEn(b, c.small)}}`;
      const xz = `\\text{${amountZh(a, c.big)}}`;
      const yz = `\\text{${amountZh(b, c.small)}}`;
      return choiceProblem({
        prompt: t(`Which symbol makes this true? $$${x} \\ \\square \\ ${y}$$`, `方框中应填哪个符号？$$${xz} \\ \\square \\ ${yz}$$`),
        options: ["<", "=", ">"].map((s) => same(`$${s}$`)),
        correct: rel,
        solution: t(
          `$1$ ${c.big.one.en} is $${tex(c.factor)}$ ${c.small.many.en}, so ${amountEn(a, c.big)} is ${amountEn(big, c.small)}, which is ${["less than", "equal to", "more than"][rel]} ${amountEn(b, c.small)}.`,
          `$1$ ${c.big.one["zh-CN"]}是 $${tex(c.factor)}$ ${c.small.one["zh-CN"]}，所以 ${amountZh(a, c.big)}是 ${amountZh(big, c.small)}，${["小于", "等于", "大于"][rel]} ${amountZh(b, c.small)}。`,
        ),
      });
    },
  };
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

export const unitsOfLength = topic(
  "units-of-length",
  t("Units of Length", "长度单位"),
  t(
    "Metric units of length are the millimeter, centimeter, meter and kilometer: 1 cm = 10 mm, 1 m = 100 cm and 1 km = 1,000 m. Customary units are the inch, foot, yard and mile: 1 ft = 12 in and 1 yd = 3 ft.",
    "公制长度单位有毫米、厘米、米、千米：1 厘米 = 10 毫米，1 米 = 100 厘米，1 千米 = 1000 米。英制长度单位有英寸、英尺、码、英里：1 英尺 = 12 英寸，1 码 = 3 英尺。",
  ),
  [],
  ["4.MD.A.1"],
  [
    estimateKP(
      "choosing-units-of-length",
      t("Choosing a unit", "选择合适的单位"),
      t(
        "A pencil is about $15$ centimeters long, a door about $2$ meters tall, and a trip between towns tens of kilometers.",
        "一支铅笔大约长 $15$ 厘米，一扇门大约高 $2$ 米，两个城镇之间的路程有几十千米。",
      ),
      lengthEstimates,
      (a) => t(`is about ${a} long`, `的长度大约是 ${a}`),
    ),
    relationKP("comparing-lengths-in-different-units", lengthConversions),
  ],
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
      t("Choosing a unit", "选择合适的单位"),
      t(
        "Grams measure light things and kilograms measure heavy things; one kilogram is $1{,}000$ grams. Picture the object and choose the unit that gives a sensible number.\n\nA paper clip has a mass of about $1$ gram and a bicycle about $12$ kilograms.",
        "克用来称轻的物体，千克用来称重的物体；$1$ 千克等于 $1{,}000$ 克。想一想物体的样子，选一个使数值合理的单位。\n\n一枚回形针的质量大约是 $1$ 克，一辆自行车大约是 $12$ 千克。",
      ),
      massEstimates,
      (a) => t(`weighs about ${a}`, `的质量大约是 ${a}`),
    ),
    relationKP("comparing-masses-in-different-units", massConversions),
  ],
);

export const unitsOfTimeAndElapsedTime = topic(
  "units-of-time-and-elapsed-time",
  t("Units of Time", "时间单位"),
  t(
    "Units of time are the second, minute, hour, day and week: 1 min = 60 s, 1 h = 60 min, 1 day = 24 h and 1 week = 7 days. The time between a start and an end is the elapsed time.",
    "时间单位有秒、分钟、小时、天和周：1 分钟 = 60 秒，1 小时 = 60 分钟，1 天 = 24 小时，1 周 = 7 天。从开始到结束经过的时间叫经过时间。",
  ),
  ["elapsed-time-in-minutes"],
  ["4.MD.A.1", "4.MD.A.2"],
  [
    estimateKP(
      "choosing-units-of-time",
      t("Choosing a unit", "选择合适的单位"),
      t(
        "Seconds measure very short events, minutes measure everyday tasks, and hours measure longer activities. Choose the unit that makes the number sensible.\n\nA sneeze lasts about $1$ second, brushing your teeth about $2$ minutes and a movie about $2$ hours.",
        "秒用来计量很短的事情，分钟用来计量日常的小事，小时用来计量较长的活动。选一个使数值合理的单位。\n\n打一个喷嚏大约 $1$ 秒，刷牙大约 $2$ 分钟，看一部电影大约 $2$ 小时。",
      ),
      timeEstimates,
      (a) => t(`takes about ${a}`, `大约用时 ${a}`),
    ),
    {
      id: "finding-elapsed-time",
      title: t("Elapsed time", "经过时间"),
      explanation: t(
        "To find elapsed time, count forward from the start time in easy jumps: first to the next whole hour, then whole hours, then the minutes left. Add the jumps. An hour is $60$ minutes, not $100$, so do not just subtract the times as numbers.\n\nFrom $2{:}45$ to $4{:}10$: $15$ minutes to $3{:}00$, $1$ hour to $4{:}00$, and $10$ more minutes. That is $15 + 60 + 10 = 85$ minutes.",
        "求经过的时间，从开始时刻往后分段数：先数到下一个整点，再数整小时，最后数剩下的分钟，把各段加起来。$1$ 小时是 $60$ 分钟，不是 $100$ 分钟，所以不能把两个时刻直接当作数相减。\n\n从 $2{:}45$ 到 $4{:}10$：到 $3{:}00$ 是 $15$ 分钟，再到 $4{:}00$ 是 $1$ 小时，再过 $10$ 分钟。一共 $15 + 60 + 10 = 85$ 分钟。",
      ),
      generate(rng) {
        const start = rng.int(7, 10) * 60 + rng.int(0, 11) * 5;
        const length = rng.int(4, 36) * 5;
        const end = start + length;
        const clock = (v: number) => `${Math.floor(v / 60)}{:}${String(v % 60).padStart(2, "0")}`;
        const name = rng.pick(names);
        return numberProblem({
          prompt: t(
            `${name} started reading at $${clock(start)}$ a.m. and stopped at $${clock(end)}$ a.m. How many minutes did ${name} read?`,
            `${name} 上午 $${clock(start)}$ 开始读书，上午 $${clock(end)}$ 停下。${name} 读了多少分钟？`,
          ),
          answer: length,
          form: "integer",
          wrong: [
            end - start - 40 > 0 ? end - start - 40 : length + 40,
            (Math.floor(end / 60) - Math.floor(start / 60)) * 100 + (end % 60) - (start % 60),
            length + 60,
          ],
          solution: t(
            `From $${clock(start)}$ to $${clock(end)}$ is $${Math.floor(length / 60)}$ hour${Math.floor(length / 60) === 1 ? "" : "s"} and $${length % 60}$ minutes, which is $${length}$ minutes.`,
            `从 $${clock(start)}$ 到 $${clock(end)}$ 经过了 $${Math.floor(length / 60)}$ 小时 $${length % 60}$ 分钟，即 $${length}$ 分钟。`,
          ),
        });
      },
    },
  ],
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
      t("Choosing a unit", "选择合适的单位"),
      t(
        "Milliliters measure small amounts of liquid and liters measure large amounts; one liter is $1{,}000$ milliliters. Choose the unit that makes the number sensible.\n\nA spoonful holds about $5$ milliliters and a bucket about $10$ liters.",
        "毫升用来计量少量的液体，升用来计量大量的液体；$1$ 升等于 $1{,}000$ 毫升。选一个使数值合理的单位。\n\n一勺大约能装 $5$ 毫升，一只水桶大约能装 $10$ 升。",
      ),
      volumeEstimates,
      (a) => t(`holds about ${a}`, `大约能装 ${a}`),
    ),
    relationKP("comparing-volumes-in-different-units", volumeConversions),
  ],
);

/** conversionTopicKPs builds the two knowledge points of a conversion topic: whole amounts, and amounts in two units. */
function conversionKPs(prefix: string, conversions: readonly Conversion[], example: Text, mixedExample: Text): KnowledgePointDef[] {
  return [
    {
      id: `${prefix}-to-smaller-units`,
      title: t("Multiplying by the conversion factor", "乘以进率"),
      explanation: example,
      generate(rng) {
        const c = rng.pick(conversions);
        const n = rng.int(2, c.factor >= 100 ? 15 : 12);
        return numberProblem({
          prompt: t(`How many ${c.small.many.en} are in ${amountEn(n, c.big)}?`, `${amountZh(n, c.big)}是多少${c.small.one["zh-CN"]}？`),
          answer: n * c.factor,
          form: "integer",
          wrong: [n + c.factor, n * c.factor * 10, Math.max(1, Math.round((n * c.factor) / 10))].filter((w) => w !== n * c.factor),
          solution: t(
            `$1$ ${c.big.one.en} is $${tex(c.factor)}$ ${c.small.many.en}, so $${n} \\times ${tex(c.factor)} = ${tex(n * c.factor)}$ ${c.small.many.en}.`,
            `$1$ ${c.big.one["zh-CN"]} = $${tex(c.factor)}$ ${c.small.one["zh-CN"]}，所以 $${n} \\times ${tex(c.factor)} = ${tex(n * c.factor)}$ ${c.small.one["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: `${prefix}-in-two-units-to-smaller-units`,
      title: t("Amounts in two units", "复名数化成小单位"),
      explanation: mixedExample,
      generate(rng) {
        const c = rng.pick(conversions);
        const a = rng.int(1, 9);
        const b = rng.int(1, c.factor - 1);
        const total = a * c.factor + b;
        return numberProblem({
          prompt: t(
            `How many ${c.small.many.en} are in ${amountEn(a, c.big)} ${amountEn(b, c.small)}?`,
            `${amountZh(a, c.big)} ${amountZh(b, c.small)}是多少${c.small.one["zh-CN"]}？`,
          ),
          answer: total,
          form: "integer",
          wrong: [a * c.factor, a + b, a * 10 + b === total ? total + c.factor : a * 10 + b],
          solution: t(
            `$${a} \\times ${tex(c.factor)} + ${b} = ${tex(total)}$ ${c.small.many.en}.`,
            `$${a} \\times ${tex(c.factor)} + ${b} = ${tex(total)}$ ${c.small.one["zh-CN"]}。`,
          ),
        });
      },
    },
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
    t(
      "A smaller unit fits into a larger one many times, so changing to a smaller unit gives a larger number: multiply by how many small units make one large unit. One centimeter is $10$ millimeters, one meter is $100$ centimeters, and one kilometer is $1{,}000$ meters.\n\n$7$ cm $= 7 \\times 10 = 70$ mm.",
      "一个大单位里有好几个小单位，所以换成小单位后数值变大：乘一个大单位里小单位的个数。$1$ 厘米 $= 10$ 毫米，$1$ 米 $= 100$ 厘米，$1$ 千米 $= 1{,}000$ 米。\n\n$7$ 厘米 $= 7 \\times 10 = 70$ 毫米。",
    ),
    t(
      "For an amount in two units, convert the larger unit to the smaller one, then add the part already in the smaller unit.\n\n$5$ m $36$ cm: $5$ m $= 500$ cm, so $5$ m $36$ cm $= 500 + 36 = 536$ cm. Joining the digits does not always work: $5$ m $6$ cm is $506$ cm, not $56$ cm.",
      "有两个单位的量，先把大单位换成小单位，再加上原来就是小单位的部分。\n\n$5$ 米 $36$ 厘米：$5$ 米 $= 500$ 厘米，所以 $5$ 米 $36$ 厘米 $= 500 + 36 = 536$ 厘米。不能把数字直接拼在一起：$5$ 米 $6$ 厘米是 $506$ 厘米，而不是 $56$ 厘米。",
    ),
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
    t(
      "To change to a smaller unit, multiply by how many small units make one large unit: one foot is $12$ inches, one yard is $3$ feet, and one mile is $5{,}280$ feet.\n\n$4$ yd $= 4 \\times 3 = 12$ ft.",
      "换成较小的单位，就乘一个大单位里小单位的个数：$1$ 英尺 $= 12$ 英寸，$1$ 码 $= 3$ 英尺，$1$ 英里 $= 5{,}280$ 英尺。\n\n$4$ 码 $= 4 \\times 3 = 12$ 英尺。",
    ),
    t(
      "Convert the larger unit to the smaller one by multiplying, then add the part already in the smaller unit.\n\n$3$ ft $7$ in: $3$ ft $= 3 \\times 12 = 36$ in, so $3$ ft $7$ in $= 36 + 7 = 43$ in.",
      "先用乘法把大单位换成小单位，再加上原来就是小单位的部分。\n\n$3$ 英尺 $7$ 英寸：$3$ 英尺 $= 3 \\times 12 = 36$ 英寸，所以 $3$ 英尺 $7$ 英寸 $= 36 + 7 = 43$ 英寸。",
    ),
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
    t(
      "To change to a smaller unit of volume, multiply by how many small units make one large unit: one gallon is $4$ quarts, one quart is $2$ pints, one pint is $2$ cups, and one liter is $1{,}000$ milliliters.\n\n$6$ gal $= 6 \\times 4 = 24$ qt.",
      "换成较小的容积单位，就乘一个大单位里小单位的个数：$1$ 加仑 $= 4$ 夸脱，$1$ 夸脱 $= 2$ 品脱，$1$ 品脱 $= 2$ 杯，$1$ 升 $= 1{,}000$ 毫升。\n\n$6$ 加仑 $= 6 \\times 4 = 24$ 夸脱。",
    ),
    t(
      "Convert the larger unit to the smaller one by multiplying, then add the part already in the smaller unit.\n\n$2$ L $350$ mL: $2$ L $= 2{,}000$ mL, so $2$ L $350$ mL $= 2{,}000 + 350 = 2{,}350$ mL.",
      "先用乘法把大单位换成小单位，再加上原来就是小单位的部分。\n\n$2$ 升 $350$ 毫升：$2$ 升 $= 2000$ 毫升，所以 $2$ 升 $350$ 毫升 $= 2000 + 350 = 2350$ 毫升。",
    ),
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
    t(
      "To change to a smaller unit of mass, multiply by how many small units make one large unit: one pound is $16$ ounces and one kilogram is $1{,}000$ grams.\n\n$5$ lb $= 5 \\times 16 = 80$ oz.",
      "换成较小的质量单位，就乘一个大单位里小单位的个数：$1$ 磅 $= 16$ 盎司，$1$ 千克 $= 1{,}000$ 克。\n\n$5$ 磅 $= 5 \\times 16 = 80$ 盎司。",
    ),
    t(
      "Convert the larger unit to the smaller one by multiplying, then add the part already in the smaller unit. Keep every place: $75$ g is not $750$ g.\n\n$2$ kg $75$ g: $2$ kg $= 2{,}000$ g, so $2$ kg $75$ g $= 2{,}000 + 75 = 2{,}075$ g.",
      "先用乘法把大单位换成小单位，再加上原来就是小单位的部分。数位要对齐：$75$ 克不是 $750$ 克。\n\n$2$ 千克 $75$ 克：$2$ 千克 $= 2000$ 克，所以 $2$ 千克 $75$ 克 $= 2000 + 75 = 2075$ 克。",
    ),
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
    t(
      "To change to a smaller unit of time, multiply by how many small units make one large unit: one minute is $60$ seconds, one hour is $60$ minutes, and one day is $24$ hours.\n\n$4$ min $= 4 \\times 60 = 240$ s.",
      "换成较小的时间单位，就乘一个大单位里小单位的个数：$1$ 分 $= 60$ 秒，$1$ 小时 $= 60$ 分，$1$ 天 $= 24$ 小时。\n\n$4$ 分钟 $= 4 \\times 60 = 240$ 秒。",
    ),
    t(
      "Convert the larger unit to the smaller one, then add the part already in the smaller unit. Remember that an hour is $60$ minutes, not $100$.\n\n$1$ h $25$ min $= 60 + 25 = 85$ min, not $125$ min.",
      "先把大单位换成小单位，再加上原来就是小单位的部分。记住 $1$ 小时是 $60$ 分钟，不是 $100$ 分钟。\n\n$1$ 小时 $25$ 分钟 $= 60 + 25 = 85$ 分钟，而不是 $125$ 分钟。",
    ),
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
  { what: t("the number of goals each player scored this season", "每名球员本赛季的进球数"), each: t("goals", "个进球"), min: 0, max: 7 },
  { what: t("the number of letters in each student's first name", "每名学生名字的字母数"), each: t("letters", "个字母"), min: 3, max: 9 },
];

/** wholePlotData draws 10 to 16 values for a survey. */
function wholePlotData(rng: Rng, s: Survey): number[] {
  const n = rng.int(10, 16);
  return Array.from({ length: n }, () => rng.int(s.min, s.max)).sort((a, b) => a - b);
}

const countOf = (values: readonly number[], v: number) => values.filter((x) => x === v).length;

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
    {
      id: "reading-counts-from-line-plots",
      title: t("How many dots", "数点"),
      explanation: t(
        "In a line plot each dot stands for one item, placed above its value. The number of dots above a value tells how many items have that value, and counting all the dots gives the total number of items.\n\nIf there are $3$ dots above $4$, then $3$ students gave the answer $4$.",
        "在线图中，每个点代表一个数据，画在它的数值上方。某个数值上方有几个点，就有几个数据是这个值；数出所有的点，就得到数据的总个数。\n\n如果 $4$ 的上方有 $3$ 个点，就说明有 $3$ 名学生的答案是 $4$。",
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const values = wholePlotData(rng, s);
        const kind = rng.int(0, 2);
        const v = rng.pick(values);
        const fig: Figure = {
          svg: dotPlot(values, { min: s.min, max: s.max, step: 1 }),
          alt: t(
            `A line plot of ${s.what.en}, with values from ${s.min} to ${s.max}.`,
            `${s.what["zh-CN"]}的线图，数值从 ${s.min} 到 ${s.max}。`,
          ),
        };
        if (kind === 0)
          return {
            ...numberProblem({
              prompt: t(
                `The line plot shows ${s.what.en}. How many students had ${v} ${s.each.en}?`,
                `线图表示${s.what["zh-CN"]}。数值是 ${v} 的学生有几名？`,
              ),
              answer: countOf(values, v),
              form: "integer",
              wrong: [v, countOf(values, v) + 1].filter((w) => w !== countOf(values, v)),
              solution: t(`There are $${countOf(values, v)}$ dots above $${v}$.`, `$${v}$ 的上方有 $${countOf(values, v)}$ 个点。`),
            }),
            figure: fig,
          };
        if (kind === 1)
          return {
            ...numberProblem({
              prompt: t(
                `The line plot shows ${s.what.en}. How many students are shown in all?`,
                `线图表示${s.what["zh-CN"]}。图中一共有几名学生？`,
              ),
              answer: values.length,
              form: "integer",
              wrong: [s.max - s.min + 1, values.length - 1],
              solution: t(
                `Each dot is one student, and there are $${values.length}$ dots.`,
                `每个点代表一名学生，一共有 $${values.length}$ 个点。`,
              ),
            }),
            figure: fig,
          };
        const w = Math.max(v, Math.min(...values) + 1);
        const atLeast = values.filter((x) => x >= w).length;
        return {
          ...numberProblem({
            prompt: t(
              `The line plot shows ${s.what.en}. How many students had ${w} or more ${s.each.en}?`,
              `线图表示${s.what["zh-CN"]}。数值不小于 ${w} 的学生有几名？`,
            ),
            answer: atLeast,
            form: "integer",
            wrong: [countOf(values, w), atLeast - countOf(values, w), values.length - atLeast].filter((x) => x !== atLeast),
            solution: t(
              `Count the dots above $${w}$ and every value to its right: $${atLeast}$.`,
              `数 $${w}$ 及其右边所有数值上方的点：$${atLeast}$。`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "comparing-values-in-line-plots",
      title: t("Greatest, least and most common", "最大值、最小值和出现最多的值"),
      explanation: t(
        "The difference between the greatest and least values is the distance from the rightmost dot to the leftmost dot.",
        "最大值与最小值的差，就是最右边的点与最左边的点之间的距离。",
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        let values: number[];
        do values = wholePlotData(rng, s);
        while (new Set(values).size < 3);
        const fig: Figure = {
          svg: dotPlot(values, { min: s.min, max: s.max, step: 1 }),
          alt: t(
            `A line plot of ${s.what.en}, with values from ${s.min} to ${s.max}.`,
            `${s.what["zh-CN"]}的线图，数值从 ${s.min} 到 ${s.max}。`,
          ),
        };
        const hi = Math.max(...values);
        const lo = Math.min(...values);
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `The line plot shows ${s.what.en}. What is the difference between the greatest and the least value?`,
                `线图表示${s.what["zh-CN"]}。最大值与最小值相差多少？`,
              ),
              answer: hi - lo,
              form: "integer",
              wrong: [hi, hi + lo, countOf(values, hi)].filter((w) => w !== hi - lo),
              solution: t(
                `The greatest value is $${hi}$ and the least is $${lo}$: $${hi} - ${lo} = ${hi - lo}$.`,
                `最大值是 $${hi}$，最小值是 $${lo}$：$${hi} - ${lo} = ${hi - lo}$。`,
              ),
            }),
            figure: fig,
          };
        }
        const most = Math.max(...values.map((v) => countOf(values, v)));
        const modes = [...new Set(values)].filter((v) => countOf(values, v) === most);
        if (modes.length > 1) values.push(modes[0]!);
        const mode = modes[0]!;
        const fig2: Figure = { ...fig, svg: dotPlot(values, { min: s.min, max: s.max, step: 1 }) };
        return {
          ...numberProblem({
            prompt: t(
              `The line plot shows ${s.what.en}. Which value occurs most often?`,
              `线图表示${s.what["zh-CN"]}。哪个数值出现的次数最多？`,
            ),
            answer: mode,
            form: "integer",
            wrong: [countOf(values, mode), hi, lo].filter((w) => w !== mode),
            solution: t(`The tallest stack of dots is above $${mode}$.`, `$${mode}$ 上方的点最多。`),
          }),
          figure: fig2,
        };
      },
    },
  ],
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
    {
      id: "differences-in-fraction-line-plots",
      title: t("Longest minus shortest", "最长减最短"),
      explanation: t(
        "To find how much longer the longest item is than the shortest, find the rightmost and leftmost values that have dots, then subtract. Ignore how many dots each has.\n\nIf the longest pencil is $5\\frac{3}{4}$ inches and the shortest $4\\frac{1}{4}$ inches, the difference is $5\\frac{3}{4} - 4\\frac{1}{4} = 1\\frac{2}{4} = 1\\frac{1}{2}$ inches.",
        "求最长的比最短的长多少，先找出有点的最右边和最左边的数值，再相减。不用管每个数值上有几个点。\n\n如果最长的铅笔长 $5\\frac{3}{4}$ 英寸，最短的长 $4\\frac{1}{4}$ 英寸，二者相差 $5\\frac{3}{4} - 4\\frac{1}{4} = 1\\frac{2}{4} = 1\\frac{1}{2}$ 英寸。",
      ),
      generate(rng) {
        const d = rng.pick([4, 8]);
        const lo = rng.int(1, 4) * d;
        const hi = lo + rng.int(d - 2, d + 3);
        let values: number[];
        do values = Array.from({ length: rng.int(8, 12) }, () => rng.int(lo, hi));
        while (new Set(values).size < 3);
        const a = Math.max(...values);
        const b = Math.min(...values);
        const what = rng.pick([t("pencils", "铅笔"), t("ribbons", "丝带"), t("worms", "虫子")]);
        return {
          ...numberProblem({
            prompt: t(
              `The line plot shows the lengths, in inches, of some ${what.en}. How much longer is the longest than the shortest?`,
              `线图表示一些${what["zh-CN"]}的长度（单位：英寸）。最长的比最短的长多少英寸？`,
            ),
            answer: Q.of(a - b, d),
            wrong: [Q.of(a, d), Q.of(a + b, d), Q.of(countOf(values, a) + 0, 1)].filter((w) => !w.eq(Q.of(a - b, d))),
            solution: t(
              `The rightmost mark is the longest, $${mixedLatex(Q.of(a, d))}$ inches, and the leftmost is the shortest, $${mixedLatex(Q.of(b, d))}$ inches. Subtract: $${mixedLatex(Q.of(a, d))} - ${mixedLatex(Q.of(b, d))} = ${mixedLatex(Q.of(a - b, d))}$ inches.`,
              `最右边的点是最长的，$${mixedLatex(Q.of(a, d))}$ 英寸；最左边的点是最短的，$${mixedLatex(Q.of(b, d))}$ 英寸。相减：$${mixedLatex(Q.of(a, d))} - ${mixedLatex(Q.of(b, d))} = ${mixedLatex(Q.of(a - b, d))}$ 英寸。`,
            ),
          }),
          figure: {
            svg: fractionPlot(values, d, lo, hi),
            alt: t(`A line plot of lengths in inches, marked in steps of 1/${d} inch.`, `长度（英寸）的线图，刻度间隔为 1/${d} 英寸。`),
          },
        };
      },
    },
    {
      id: "totals-in-fraction-line-plots",
      title: t("Totals of fractional values", "分数数据的总和"),
      explanation: t(
        "To find the total of the items at one value, count the dots above it and multiply the count by the value, or add the value once for each dot.\n\nIf $3$ glasses each hold $\\frac{1}{4}$ liter, together they hold $3 \\times \\frac{1}{4} = \\frac{3}{4}$ liter.",
        "求某个数值上所有数据的总量，数出它上方有几个点，用点数乘这个数值，或者每个点加一次这个数值。\n\n如果 $3$ 个杯子各装 $\\frac{1}{4}$ 升，合起来一共 $3 \\times \\frac{1}{4} = \\frac{3}{4}$ 升。",
      ),
      generate(rng) {
        const d = rng.pick([4, 8]);
        let values: number[];
        do values = Array.from({ length: rng.int(7, 11) }, () => rng.int(1, d - 1));
        while (new Set(values).size < 3);
        const v = rng.pick(values);
        const c = countOf(values, v);
        const total = Q.of(c * v, d);
        return {
          ...numberProblem({
            prompt: t(
              `The line plot shows how much water, in liters, is in some bottles. What is the total amount of water in the bottles that each hold $${fracTex(v, d)}$ liter?`,
              `线图表示一些瓶子里的水量（单位：升）。每瓶装 $${fracTex(v, d)}$ 升的那些瓶子一共装了多少升水？`,
            ),
            answer: total,
            wrong: [Q.of(v, d), Q.of(c, 1), Q.of(c + v, d)].filter((w) => !w.eq(total)),
            solution: t(
              `There are $${c}$ bottles with $${fracTex(v, d)}$ liter: $${c} \\times ${fracTex(v, d)} = ${mixedLatex(total)}$ liters.`,
              `装 $${fracTex(v, d)}$ 升的有 $${c}$ 瓶：$${c} \\times ${fracTex(v, d)} = ${mixedLatex(total)}$ 升。`,
            ),
          }),
          figure: {
            svg: fractionPlot(values, d, 0, d),
            alt: t(
              `A line plot of amounts of water in liters, marked in steps of 1/${d} liter.`,
              `水量（升）的线图，刻度间隔为 1/${d} 升。`,
            ),
          },
        };
      },
    },
  ],
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
    {
      id: "naming-basic-figures",
      title: t("Which figure is it?", "这是什么图形"),
      explanation: t(
        "Arrowheads mean the figure keeps going. No arrowheads and two endpoints: a segment. One arrowhead: a ray. Two: a line.",
        "箭头表示图形无限延伸。没有箭头、有两个端点的是线段；有一个箭头的是射线；有两个箭头的是直线。",
      ),
      generate(rng) {
        const kind = rng.pick(figureKinds);
        const angle = rng.pick([0, 10, 20, 30, -10, -20, -30, 160, 170, 190, 200]);
        return {
          ...choiceProblem({
            prompt: t("What is shown in the figure?", "图中画的是什么？"),
            options: figureKinds.map((k) => figureNames[k]),
            correct: figureKinds.indexOf(kind),
            solution: [
              t("Only a single location is marked: a point.", "只标出了一个位置：点。"),
              t("It has two endpoints and no arrowheads: a line segment.", "它有两个端点，没有箭头：线段。"),
              t("It starts at an endpoint and has one arrowhead: a ray.", "它从一个端点出发，只有一个箭头：射线。"),
              t("It has arrowheads at both ends: a line.", "它两端都有箭头：直线。"),
            ][figureKinds.indexOf(kind)]!,
          }),
          figure: {
            svg: basicFigureSvg(kind, angle),
            alt: t(`A figure labeled with letters, showing ${figureNames[kind].en.toLowerCase()}.`, `一个用字母标注的图形。`),
          },
        };
      },
    },
    {
      id: "counting-segments-and-rays",
      title: t("Counting segments", "数线段"),
      explanation: t(
        "A segment needs two endpoints, so count the pairs of points. Starting from the first point, it pairs with every point after it; the next point pairs with the ones after it, and so on. Add these counts.\n\nPoints $A, B, C$ on a line give $3$ segments: $AB$, $BC$ and $AC$. With $4$ points there are $3 + 2 + 1 = 6$. Counting only the short segments between neighbors misses the longer ones.",
        "一条线段有两个端点，所以要数点的配对。第一个点和后面每个点各组成一条，第二个点和它后面的点各组成一条，依此类推，把这些数加起来。\n\n直线上的点 $A, B, C$ 构成 $3$ 条线段：$AB$、$BC$、$AC$。$4$ 个点则有 $3 + 2 + 1 = 6$ 条。只数相邻两点之间的短线段，会漏掉较长的线段。",
      ),
      generate(rng) {
        const n = rng.int(2, 8);
        const first = rng.int(0, 12);
        const letters = "ABCDEFGHIJKLMNOPQRSTUVW".slice(first, first + n);
        const segments = (n * (n - 1)) / 2;
        const asRays = rng.bool(0.3);
        const answer = asRays ? 2 * (n - 1) : segments;
        return numberProblem({
          prompt: asRays
            ? t(
                `Points $${letters.split("").join(", ")}$ lie in that order on a line. How many rays start at one of these points and pass through another of them?`,
                `点 $${letters.split("").join(", ")}$ 依次在一条直线上。从其中一点出发、经过其中另一点的射线有几条？`,
              )
            : t(
                `Points $${letters.split("").join(", ")}$ lie on a line. How many line segments have two of these points as endpoints?`,
                `点 $${letters.split("").join(", ")}$ 在一条直线上。以其中两点为端点的线段有几条？`,
              ),
          answer,
          form: "integer",
          wrong: [n - 1, n, n * (n - 1), segments === answer ? segments + 1 : segments].filter((w) => w !== answer),
          solution: asRays
            ? t(
                `From each point there is one ray to the left and one to the right, except at the two ends: $2 \\times ${n - 1} = ${answer}$.`,
                `除了两端的点，每个点都能向左、向右各引一条射线；两端的点只能引一条：$2 \\times ${n - 1} = ${answer}$。`,
              )
            : t(
                `Pair each point with every point to its right: $${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = ${segments}$.`,
                `把每个点与它右边的每个点配对：$${Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" + ")} = ${segments}$。`,
              ),
        });
      },
    },
  ],
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
    {
      id: "degrees-from-fractions-of-a-turn",
      title: t("From a fraction of a turn to degrees", "由几分之几圈求度数"),
      explanation: t(
        "A full turn is $360^\\circ$. To find the degrees in a fraction of a turn, divide $360^\\circ$ by the denominator to get one part, then multiply by the numerator.\n\n$\\frac{1}{4}$ of a full turn is $360^\\circ \\div 4 = 90^\\circ$, and $\\frac{3}{4}$ of a turn is $3 \\times 90^\\circ = 270^\\circ$.",
        "一整圈是 $360^\\circ$。求几分之几圈是多少度，先用 $360^\\circ$ 除以分母得到一份，再乘分子。\n\n一整圈的 $\\frac{1}{4}$ 是 $360^\\circ \\div 4 = 90^\\circ$，$\\frac{3}{4}$ 圈是 $3 \\times 90^\\circ = 270^\\circ$。",
      ),
      figure: turnFigure(
        4,
        3,
        t(
          "A circle cut into 4 equal parts by radii from its center. Three of the parts are shaded, each a 90° angle at the center, so 3/4 of a turn is 270°.",
          "一个圆被从圆心出发的半径分成 4 等份。其中 3 份涂上阴影，每份是圆心处的一个 90° 角，所以 3/4 圈是 270°。",
        ),
      ),
      generate(rng) {
        const [a, b] = rng.pick(turnFractions);
        const v = (360 / b) * a;
        const name = rng.pick(names);
        return numberProblem({
          prompt: rng.bool()
            ? t(
                `An angle turns through $${fracTex(a, b)}$ of a circle. What is its measure in degrees?`,
                `一个角转过了圆的 $${fracTex(a, b)}$。它是多少度？`,
              )
            : t(
                `${name} turns through $${fracTex(a, b)}$ of a full turn. How many degrees did ${name} turn?`,
                `${name} 转了一整圈的 $${fracTex(a, b)}$。${name} 转了多少度？`,
              ),
          answer: v,
          form: "integer",
          unit: "°",
          wrong: [360 / b, 360 - v, (180 / b) * a].filter((w) => w !== v && Number.isInteger(w)),
          solution: t(
            `$${fracTex(a, b)} \\times 360^\\circ = ${a} \\times ${360 / b}^\\circ = ${v}^\\circ$.`,
            `$${fracTex(a, b)} \\times 360^\\circ = ${a} \\times ${360 / b}^\\circ = ${v}^\\circ$。`,
          ),
        });
      },
    },
    {
      id: "fractions-of-a-turn-from-degrees",
      title: t("From degrees to a fraction of a turn", "由度数求几分之几圈"),
      explanation: t(
        "To find what fraction of a full turn an angle is, put its measure over $360$ and simplify.\n\n$120^\\circ$ is $\\frac{120}{360} = \\frac{1}{3}$ of a full turn, dividing both by $120$.",
        "求一个角是一整圈的几分之几，用它的度数作分子、$360$ 作分母，再约分。\n\n$120^\\circ$ 是一整圈的 $\\frac{120}{360} = \\frac{1}{3}$，分子分母同时除以 $120$。",
      ),
      figure: turnFigure(
        3,
        1,
        t(
          "A circle cut into 3 equal parts by radii from its center. One part is shaded; its angle at the center is 120°, so 120° is 1/3 of a turn.",
          "一个圆被从圆心出发的半径分成 3 等份。其中 1 份涂上阴影，它在圆心处的角是 120°，所以 120° 是 1/3 圈。",
        ),
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
        const a = rng.pick(Array.from({ length: b - 1 }, (_, k) => k + 1).filter((k) => gcd(k, b) === 1));
        const v = (360 / b) * a;
        return numberProblem({
          prompt: t(`What fraction of a full turn is an angle of $${v}^\\circ$?`, `$${v}^\\circ$ 的角是一整圈的几分之几？`),
          answer: Q.of(a, b),
          form: "fraction",
          wrong: [Q.of(v, 100), Q.of(a, b + 1), Q.of(v, 180)].filter((w) => !w.eq(Q.of(a, b))),
          solution: t(
            `$${fracTex(v, 360) === fracTex(a, b) ? `\\frac{${v}}{360} = ` : ""}${fracTex(a, b)}$ of a turn.`,
            `是一整圈的 $\\frac{${v}}{360} = ${fracTex(a, b)}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "reading-a-protractor-from-zero",
      title: t("One ray at zero", "一条边对准 0°"),
      explanation: t(
        "One ray is at $0^\\circ$ and the other crosses the scale at $65^\\circ$, so the angle measures $65^\\circ$.",
        "一条边对准 $0^\\circ$，另一条边对着 $65^\\circ$，所以这个角是 $65^\\circ$。",
      ),
      generate(rng) {
        const v = rng.int(1, 35) * 5;
        return {
          ...numberProblem({
            prompt: t("The angle is measured with a protractor. What is its measure?", "用量角器量这个角。它是多少度？"),
            answer: v,
            form: "integer",
            unit: "°",
            wrong: [180 - v, v + 10, v - 5].filter((w) => w !== v && w > 0),
            solution: t(
              `One ray is at $0^\\circ$ and the other at $${v}^\\circ$, so the angle is $${v}^\\circ$.`,
              `一条边在 $0^\\circ$，另一条边在 $${v}^\\circ$，所以这个角是 $${v}^\\circ$。`,
            ),
          }),
          figure: {
            svg: protractorSvg(0, v),
            alt: t(`A protractor with one ray at 0° and the other at ${v}°.`, `量角器上，一条边在 0°，另一条边在 ${v}°。`),
          },
        };
      },
    },
    {
      id: "reading-a-protractor-between-two-marks",
      title: t("Neither ray at zero", "两条边都不在 0°"),
      explanation: t(
        "When neither ray is on $0^\\circ$, read the marks where both rays cross the protractor on the same scale, then subtract the smaller reading from the larger.\n\nThe rays are at $40^\\circ$ and $115^\\circ$, so the angle measures $115^\\circ - 40^\\circ = 75^\\circ$. Reading only one ray would give $115^\\circ$, which is wrong.",
        "两条边都不在 $0^\\circ$ 刻度上时，在同一圈刻度上读出两条边对着的度数，再用大数减小数。\n\n两条边分别在 $40^\\circ$ 和 $115^\\circ$，所以这个角是 $115^\\circ - 40^\\circ = 75^\\circ$。只读一条边会得到 $115^\\circ$，这是错误的。",
      ),
      generate(rng) {
        const a = rng.int(2, 20) * 5;
        const b = rng.int(a / 5 + 3, 36) * 5;
        return {
          ...numberProblem({
            prompt: t("The angle is measured with a protractor. What is its measure?", "用量角器量这个角。它是多少度？"),
            answer: b - a,
            form: "integer",
            unit: "°",
            wrong: [b, a + b, 180 - b + a].filter((w) => w !== b - a),
            solution: t(
              `The rays are at $${a}^\\circ$ and $${b}^\\circ$: $${b}^\\circ - ${a}^\\circ = ${b - a}^\\circ$.`,
              `两条边分别在 $${a}^\\circ$ 和 $${b}^\\circ$：$${b}^\\circ - ${a}^\\circ = ${b - a}^\\circ$。`,
            ),
          }),
          figure: {
            svg: protractorSvg(a, b),
            alt: t(`A protractor with the two rays at ${a}° and ${b}°.`, `量角器上，两条边分别在 ${a}° 和 ${b}°。`),
          },
        };
      },
    },
  ],
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
    {
      id: "measures-of-special-angles",
      title: t("Measures of the special angles", "特殊角的度数"),
      explanation: t(
        "Four angles have special names. A right angle is a quarter turn, a straight angle is a half turn and looks like a straight line, a full angle is a whole turn, and a null angle is no turn at all.\n\nA right angle is $90^\\circ$, a straight angle $180^\\circ$, a full angle $360^\\circ$ and a null angle $0^\\circ$. So $2$ right angles make a straight angle and $4$ make a full angle.",
        "有四种角有特别的名称。直角是四分之一圈，平角是半圈，看起来像一条直线，周角是一整圈，零角是一点也没有转。\n\n直角是 $90^\\circ$，平角是 $180^\\circ$，周角是 $360^\\circ$，零角是 $0^\\circ$。所以 $2$ 个直角组成一个平角，$4$ 个直角组成一个周角。",
      ),
      generate(rng) {
        const a = rng.pick(specialAngles);
        const k = rng.int(2, 9);
        if (a.measure > 0 && rng.bool(0.75)) {
          return numberProblem({
            prompt: t(
              `How many degrees are in ${k} ${a.name.en.replace(/^A /, "").replace("angle", "angles")}?`,
              `${k} 个${a.name["zh-CN"]}一共是多少度？`,
            ),
            answer: k * a.measure,
            form: "integer",
            unit: "°",
            wrong: [a.measure, k * 90 === k * a.measure ? k * 180 : k * 90, k + a.measure],
            solution: t(
              `Each is $${a.measure}^\\circ$: $${k} \\times ${a.measure}^\\circ = ${k * a.measure}^\\circ$.`,
              `每个是 $${a.measure}^\\circ$：$${k} \\times ${a.measure}^\\circ = ${k * a.measure}^\\circ$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${a.name.en} is ${a.turn.en}. What is its measure in degrees?`,
            `${a.name["zh-CN"]}是${a.turn["zh-CN"]}。它是多少度？`,
          ),
          answer: a.measure,
          form: "integer",
          unit: "°",
          wrong: specialAngles.map((s) => s.measure).filter((v) => v !== a.measure),
          solution: t(`${a.name.en} measures $${a.measure}^\\circ$.`, `${a.name["zh-CN"]}是 $${a.measure}^\\circ$。`),
        });
      },
    },
    {
      id: "naming-angles-on-a-clock",
      title: t("Angles on a clock", "钟面上的角"),
      explanation: t(
        "At $3{:}00$ the hands of a clock form a right angle, at $6{:}00$ a straight angle, and at $12{:}00$ a null angle.",
        "$3{:}00$ 时钟面上的时针和分针成直角，$6{:}00$ 时成平角，$12{:}00$ 时成零角。",
      ),
      generate(rng) {
        const hours: [number, number][] = [
          [3, 1],
          [9, 1],
          [6, 2],
          [12, 0],
        ];
        const [h, idx] = rng.pick(hours);
        const name = rng.pick(names);
        const options = specialAngles.slice(0, 3).map((s) => s.name);
        return choiceProblem({
          prompt: t(
            `${name} looks at a clock at exactly $${h}{:}00$. What angle do the hour hand and the minute hand form?`,
            `${name} 在 $${h}{:}00$ 整看钟。时针和分针成什么角？`,
          ),
          options,
          correct: idx,
          solution: t(
            `At $${h}{:}00$ the hands are ${["together", "a quarter turn apart", "a half turn apart"][idx]}: ${options[idx]!.en.toLowerCase()}.`,
            `$${h}{:}00$ 时两根指针${["重合", "相差四分之一圈", "相差半圈"][idx]}：${options[idx]!["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
);

const angleClasses: readonly Text[] = [
  t("Acute", "锐角"),
  t("Right", "直角"),
  t("Obtuse", "钝角"),
  t("Straight", "平角"),
  t("Reflex", "优角"),
];

/** classIndex is the index in angleClasses of an angle of v degrees, 0 < v < 360. */
const classIndex = (v: number) => (v < 90 ? 0 : v === 90 ? 1 : v < 180 ? 2 : v === 180 ? 3 : 4);

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
    {
      id: "classifying-angles-by-measure",
      title: t("Classifying by measure", "按度数分类"),
      explanation: t(
        "Classify an angle by comparing its measure with $90^\\circ$, $180^\\circ$ and $360^\\circ$. An acute angle is less than $90^\\circ$, an obtuse angle is between $90^\\circ$ and $180^\\circ$, and a reflex angle is between $180^\\circ$ and $360^\\circ$.\n\n$35^\\circ$ is acute, $90^\\circ$ right, $125^\\circ$ obtuse, $180^\\circ$ straight and $250^\\circ$ reflex.",
        "把角的度数和 $90^\\circ$、$180^\\circ$、$360^\\circ$ 比较来分类。锐角小于 $90^\\circ$，钝角在 $90^\\circ$ 和 $180^\\circ$ 之间，优角在 $180^\\circ$ 和 $360^\\circ$ 之间。\n\n$35^\\circ$ 是锐角，$90^\\circ$ 是直角，$125^\\circ$ 是钝角，$180^\\circ$ 是平角，$250^\\circ$ 是优角。",
      ),
      generate(rng) {
        const k = rng.pick([0, 0, 2, 2, 4, 4, 1, 3]);
        const v = [rng.int(1, 89), 90, rng.int(91, 179), 180, rng.int(181, 359)][k]!;
        return choiceProblem({
          prompt: t(`What kind of angle measures $${v}^\\circ$?`, `$${v}^\\circ$ 的角是什么角？`),
          options: angleClasses,
          correct: classIndex(v),
          solution: [
            t(`$${v}^\\circ < 90^\\circ$: acute.`, `$${v}^\\circ < 90^\\circ$：锐角。`),
            t("Exactly $90^\\circ$: right.", "恰好 $90^\\circ$：直角。"),
            t(`$90^\\circ < ${v}^\\circ < 180^\\circ$: obtuse.`, `$90^\\circ < ${v}^\\circ < 180^\\circ$：钝角。`),
            t("Exactly $180^\\circ$: straight.", "恰好 $180^\\circ$：平角。"),
            t(`$180^\\circ < ${v}^\\circ < 360^\\circ$: reflex.`, `$180^\\circ < ${v}^\\circ < 360^\\circ$：优角。`),
          ][k]!,
        });
      },
    },
    {
      id: "finding-reflex-angles",
      title: t("The reflex angle", "求优角"),
      explanation: t(
        "Two rays from a point make two angles that together fill a full turn. So the reflex angle is $360^\\circ$ minus the smaller angle.\n\nIf the smaller angle between two rays is $70^\\circ$, the reflex angle between them is $360^\\circ - 70^\\circ = 290^\\circ$. Subtracting from $180^\\circ$ gives the wrong angle.",
        "从一点出发的两条射线组成两个角，合起来正好是一整圈。所以优角等于 $360^\\circ$ 减去较小的角。\n\n如果两条射线所夹的较小角是 $70^\\circ$，那么它们所成的优角是 $360^\\circ - 70^\\circ = 290^\\circ$。用 $180^\\circ$ 去减是错误的。",
      ),
      generate(rng) {
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
        return {
          ...numberProblem({
            prompt: t(
              "The smaller angle between the two rays is shown. What is the reflex angle between them?",
              "图中标出了两条射线所夹的较小的角。它们所成的优角是多少度？",
            ),
            answer: 360 - v,
            form: "integer",
            unit: "°",
            wrong: [180 - v, 180 + v, v].filter((w) => w !== 360 - v),
            solution: t(
              `The two angles make a full turn: $360^\\circ - ${v}^\\circ = ${360 - v}^\\circ$.`,
              `两个角合起来是一整圈：$360^\\circ - ${v}^\\circ = ${360 - v}^\\circ$。`,
            ),
          }),
          figure: figureOf(
            marks,
            `Two rays from a point with an angle of ${v}° marked between them.`,
            `从一点出发的两条射线，标出了它们之间 ${v}° 的角。`,
          ),
        };
      },
    },
  ],
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
    {
      id: "classifying-triangles-by-angles",
      title: t("Triangles", "三角形"),
      explanation: t(
        "A triangle is named by its largest angle. If one angle is greater than $90^\\circ$ it is obtuse, if one angle is exactly $90^\\circ$ it is right, and if all three are less than $90^\\circ$ it is acute. A triangle can have at most one right or obtuse angle.\n\nA triangle with angles $30^\\circ$, $45^\\circ$ and $105^\\circ$ has an obtuse angle, so it is an obtuse triangle.",
        "三角形按最大的角来分类：有一个角大于 $90^\\circ$ 的是钝角三角形，有一个角等于 $90^\\circ$ 的是直角三角形，三个角都小于 $90^\\circ$ 的是锐角三角形。一个三角形最多只有一个直角或钝角。\n\n三个角分别是 $30^\\circ$、$45^\\circ$、$105^\\circ$ 的三角形有一个钝角，所以是钝角三角形。",
      ),
      figure: triangleKindsFigure,
      generate(rng) {
        const k = rng.int(0, 2);
        const big = [rng.int(61, 89), 90, rng.int(91, 150)][k]!;
        let a: number;
        do a = rng.int(Math.max(1, 180 - big - 89), Math.min(89, 180 - big - 1));
        while (k === 0 && (180 - big - a >= 90 || 180 - big - a > big || a > big));
        const angles = rng.shuffle([big, a, 180 - big - a]);
        return choiceProblem({
          prompt: t(
            `A triangle has angles of $${angles.map((v) => `${v}^\\circ`).join("$, $")}$. What kind of triangle is it?`,
            `一个三角形的三个角分别是 $${angles.map((v) => `${v}^\\circ`).join("$、$")}$。它是什么三角形？`,
          ),
          options: triangleKinds,
          correct: k,
          solution: [
            t("All three angles are less than $90^\\circ$: an acute triangle.", "三个角都小于 $90^\\circ$：锐角三角形。"),
            t("One angle is $90^\\circ$: a right triangle.", "有一个角是 $90^\\circ$：直角三角形。"),
            t(`$${big}^\\circ$ is obtuse: an obtuse triangle.`, `$${big}^\\circ$ 是钝角：钝角三角形。`),
          ][k]!,
        });
      },
    },
    {
      id: "counting-right-angles-in-shapes",
      title: t("Right angles in shapes", "图形中的直角"),
      explanation: t(
        "To count right angles in several shapes, find how many each shape has, multiply by the number of copies, and add. Rectangles and squares have $4$ right angles, a right triangle has exactly $1$, and a regular pentagon or hexagon has none, since its angles are larger than $90^\\circ$.\n\n$2$ squares and $3$ right triangles have $2 \\times 4 + 3 \\times 1 = 11$ right angles.",
        "数几个图形中一共有多少个直角时，先找出每种图形有几个直角，乘这种图形的个数，再相加。长方形和正方形有 $4$ 个直角，直角三角形恰好有 $1$ 个，正五边形和正六边形没有直角，因为它们的角都大于 $90^\\circ$。\n\n$2$ 个正方形和 $3$ 个直角三角形一共有 $2 \\times 4 + 3 \\times 1 = 11$ 个直角。",
      ),
      generate(rng) {
        const [s1, s2] = rng.sample(shapes, 2);
        const n1 = rng.int(1, 4);
        const n2 = rng.int(1, 4);
        const total = n1 * s1!.right + n2 * s2!.right;
        return numberProblem({
          prompt: t(
            `How many right angles are there in all in ${n1} copies of ${s1!.name.en} and ${n2} copies of ${s2!.name.en}?`,
            `${n1} 个${s1!.name["zh-CN"]}和 ${n2} 个${s2!.name["zh-CN"]}一共有多少个直角？`,
          ),
          answer: total,
          form: "integer",
          wrong: [n1 + n2, 4 * (n1 + n2), total + 1].filter((w) => w !== total),
          solution: t(
            `${s1!.name.en} has $${s1!.right}$ and ${s2!.name.en} has $${s2!.right}$: $${n1} \\times ${s1!.right} + ${n2} \\times ${s2!.right} = ${total}$.`,
            `${s1!.name["zh-CN"]}有 $${s1!.right}$ 个，${s2!.name["zh-CN"]}有 $${s2!.right}$ 个：$${n1} \\times ${s1!.right} + ${n2} \\times ${s2!.right} = ${total}$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "adding-several-adjacent-angles",
      title: t("Adding adjacent angles", "相邻角相加"),
      explanation: t(
        "When an angle is split into parts that do not overlap, its measure is the sum of the parts. Add all the parts, however many there are.\n\nAn angle split into $25^\\circ$, $40^\\circ$ and $30^\\circ$ measures $25^\\circ + 40^\\circ + 30^\\circ = 95^\\circ$.",
        "一个角被分成互不重叠的几部分时，它的度数等于各部分的和。不管有几部分，都要全部加起来。\n\n分成 $25^\\circ$、$40^\\circ$、$30^\\circ$ 三部分的角是 $25^\\circ + 40^\\circ + 30^\\circ = 95^\\circ$。",
      ),
      generate(rng) {
        let parts: number[];
        do parts = Array.from({ length: 3 }, () => rng.int(15, 70));
        while (parts.reduce((s, v) => s + v, 0) >= 180);
        const total = parts.reduce((s, v) => s + v, 0);
        const dirs = [0, parts[0]!, parts[0]! + parts[1]!, total];
        const o: Point = [0, 0];
        const marks: Mark[] = dirs.map((d) => ({ kind: "segment", a: o, b: dir(d) }) as Mark);
        for (const [i, p] of parts.entries())
          marks.push({ kind: "arc", vertex: o, from: dir(dirs[i]!), to: dir(dirs[i + 1]!), label: `${p}°` });
        marks.push({ kind: "dot", at: o });
        return {
          ...numberProblem({
            prompt: t(
              "The angle is split into three parts. What is the measure of the whole angle?",
              "这个角被分成三部分。整个角是多少度？",
            ),
            answer: total,
            form: "integer",
            unit: "°",
            wrong: [180 - total, total - parts[2]!, total + 10],
            solution: t(
              `$${parts.join("^\\circ + ")}^\\circ = ${total}^\\circ$.`,
              `$${parts.join("^\\circ + ")}^\\circ = ${total}^\\circ$。`,
            ),
          }),
          figure: figureOf(marks, `An angle split into angles of ${parts.join("°, ")}°.`, `一个角被分成 ${parts.join("°、")}° 三部分。`),
        };
      },
    },
    {
      id: "angles-around-a-point",
      title: t("Angles around a point", "围绕一点的角"),
      explanation: t(
        "Angles that fill the space around a point make a full turn, so they add up to $360^\\circ$. To find an unknown one, subtract the known angles from $360^\\circ$.\n\nThree angles around a point measure $100^\\circ$, $130^\\circ$ and $130^\\circ$: together $360^\\circ$, a full turn. If the last were unknown, it would be $360^\\circ - 100^\\circ - 130^\\circ = 130^\\circ$.",
        "围绕一点的几个角正好组成一整圈，所以它们的和是 $360^\\circ$。求未知的角，就用 $360^\\circ$ 减去已知的角。\n\n围绕一点的三个角分别是 $100^\\circ$、$130^\\circ$、$130^\\circ$：合起来是 $360^\\circ$，一整圈。如果最后一个未知，它就是 $360^\\circ - 100^\\circ - 130^\\circ = 130^\\circ$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(6, 16) * 10 + rng.pick([0, 5]);
          b = rng.int(6, 16) * 10 + rng.pick([0, 5]);
        } while (360 - a - b < 50 || 360 - a - b > 175);
        const c = 360 - a - b;
        return {
          ...numberProblem({
            prompt: t(
              "Three angles fill the space around a point. Two of them are labeled. Find $x$.",
              "三个角围绕一点铺满一周，图中标出了其中两个。求 $x$。",
            ),
            answer: c,
            form: "integer",
            unit: "°",
            wrong: [180 - a - b > 0 ? 180 - a - b : a + b, a + b, 360 - a].filter((w) => w !== c),
            solution: t(
              `The angles around a point add up to $360^\\circ$: $360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$.`,
              `围绕一点的角之和是 $360^\\circ$：$360^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$。`,
            ),
          }),
          figure: raysFigure(
            [90, 90 + a, 90 + a + b],
            [`${a}°`, `${b}°`, "x"],
            `Three rays from a point making angles of ${a}°, ${b}° and x.`,
            `从一点出发的三条射线，所成的角分别是 ${a}°、${b}° 和 x。`,
          ),
        };
      },
    },
  ],
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
    {
      id: "unknown-parts-of-right-and-straight-angles",
      title: t("Part of a right or straight angle", "直角或平角的一部分"),
      explanation: t(
        "The parts of a right angle add up to $90^\\circ$, and the parts of a straight angle add up to $180^\\circ$. Subtract the known part from the whole to find the unknown part. Check first which kind of angle it is.\n\nA straight angle split into $65^\\circ$ and $x$: $x = 180^\\circ - 65^\\circ = 115^\\circ$.",
        "直角的各部分加起来是 $90^\\circ$，平角的各部分加起来是 $180^\\circ$。用整个角减去已知的部分，就得到未知的部分。先看清是哪一种角。\n\n平角被分成 $65^\\circ$ 和 $x$：$x = 180^\\circ - 65^\\circ = 115^\\circ$。",
      ),
      generate(rng) {
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
        return {
          ...numberProblem({
            prompt:
              total === 90
                ? t("The two angles make a right angle. Find $x$.", "两个角合起来是一个直角。求 $x$。")
                : t("The two angles make a straight angle. Find $x$.", "两个角合起来是一个平角。求 $x$。"),
            answer: total - a,
            form: "integer",
            unit: "°",
            wrong: [(total === 90 ? 180 : 90) - a, 360 - a, a].filter((w) => w > 0 && w !== total - a),
            solution: t(
              `$x = ${total}^\\circ - ${a}^\\circ = ${total - a}^\\circ$.`,
              `$x = ${total}^\\circ - ${a}^\\circ = ${total - a}^\\circ$。`,
            ),
          }),
          figure: figureOf(
            marks,
            `A ${total === 90 ? "right" : "straight"} angle split into ${a}° and x.`,
            `一个${total === 90 ? "直角" : "平角"}被分成 ${a}° 和 x。`,
          ),
        };
      },
    },
    {
      id: "angle-word-problems",
      title: t("Word problems", "应用题"),
      explanation: t(
        "In an angle word problem, decide what the angles do. If parts make up a whole angle, add or subtract; if the same turn is repeated, multiply or divide.\n\nA sprinkler turns $45^\\circ$ at a time. To turn $180^\\circ$ it needs $180 \\div 45 = 4$ turns.",
        "解角的应用题，先想清楚角之间的关系。几部分组成一个角，就用加法或减法；同样的转动重复几次，就用乘法或除法。\n\n一个喷头每次转 $45^\\circ$。要转 $180^\\circ$ 需要 $180 \\div 45 = 4$ 次。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        if (rng.bool()) {
          const step = rng.pick([5, 10, 15, 20, 30, 36, 40, 45, 60, 72, 90, 120]);
          const total = rng.pick([180, 360].filter((v) => v % step === 0));
          return numberProblem({
            prompt: t(
              `A sprinkler turns $${step}^\\circ$ at a time. How many turns does it make to go through $${total}^\\circ$?`,
              `一个喷头每次转 $${step}^\\circ$。转过 $${total}^\\circ$ 要转几次？`,
            ),
            answer: total / step,
            form: "integer",
            wrong: [total - step, total / step + 1, (total === 180 ? 360 : 180) / step].filter(
              (w) => w !== total / step && Number.isInteger(w),
            ),
            solution: t(
              `Count how many $${step}^\\circ$ turns fit into $${total}^\\circ$: $${total} \\div ${step} = ${total / step}$ turns.`,
              `数一数 $${total}^\\circ$ 里有几个 $${step}^\\circ$：$${total} \\div ${step} = ${total / step}$ 次。`,
            ),
          });
        }
        const whole = rng.int(8, 17) * 10;
        const a = rng.int(2, whole / 10 - 2) * 10 + rng.pick([0, 5]);
        return numberProblem({
          prompt: t(
            `${name} opens a fan to $${whole}^\\circ$. The fan has two sections, and one of them covers $${a}^\\circ$. How many degrees does the other section cover?`,
            `${name} 把一把扇子打开到 $${whole}^\\circ$。扇面分成两部分，其中一部分是 $${a}^\\circ$。另一部分是多少度？`,
          ),
          answer: whole - a,
          form: "integer",
          unit: "°",
          wrong: [whole + a, 180 - a, 360 - whole - a].filter((w) => w > 0 && w !== whole - a),
          solution: t(
            `The two sections add up to the whole $${whole}^\\circ$, so subtract the known one: $${whole}^\\circ - ${a}^\\circ = ${whole - a}^\\circ$.`,
            `两部分合起来是整个 $${whole}^\\circ$，所以减去已知的部分：$${whole}^\\circ - ${a}^\\circ = ${whole - a}^\\circ$。`,
          ),
        });
      },
    },
  ],
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
    {
      id: "identifying-parallel-and-perpendicular-lines",
      title: t("Parallel, perpendicular or neither", "平行、垂直还是都不是"),
      explanation: t(
        "Lines that cross with a right-angle mark are perpendicular; lines marked with matching arrows are parallel.",
        "相交处标有直角记号的两条直线互相垂直；标有相同箭头记号的两条直线互相平行。",
      ),
      generate(rng) {
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
        return {
          ...choiceProblem({
            prompt: t("How are the two lines related?", "这两条直线是什么关系？"),
            options: relations,
            correct: k,
            solution: [
              t("They never meet and are marked with matching arrows: parallel.", "它们永不相交，并且标有相同的箭头记号：平行。"),
              t("They meet at a right angle: perpendicular.", "它们相交成直角：垂直。"),
              t("They cross, but not at a right angle: neither.", "它们相交，但不成直角：都不是。"),
            ][k]!,
          }),
          figure: figureOf(marks, "Two lines in a plane.", "平面内的两条直线。"),
        };
      },
    },
    {
      id: "parallel-sides-of-shapes",
      title: t("Parallel sides of shapes", "图形中的平行边"),
      explanation: t(
        "Two sides are parallel if they would never meet, however far they were extended. Count each pair of parallel sides once; a shape may have none, one or several pairs.\n\nA rectangle has $2$ pairs of parallel sides; a regular hexagon has $3$. A triangle has none.",
        "两条边无论怎样延长都不相交，就互相平行。每组平行边只数一次；一个图形可能没有、有一组或有好几组平行边。\n\n长方形有 $2$ 组平行边；正六边形有 $3$ 组。三角形没有平行边。",
      ),
      generate(rng) {
        const s = rng.pick(shapes);
        const n = rng.int(1, 5);
        return numberProblem({
          prompt: t(
            `How many pairs of parallel sides are there in all in ${n} cop${n === 1 ? "y" : "ies"} of ${s.name.en}?`,
            `${n} 个${s.name["zh-CN"]}一共有多少组平行边？`,
          ),
          answer: n * s.parallel,
          form: "integer",
          wrong: [n * s.right, n * (s.parallel + 1), n + s.parallel].filter((w) => w !== n * s.parallel),
          solution: t(
            `${s.name.en} has $${s.parallel}$ pair${s.parallel === 1 ? "" : "s"} of parallel sides: $${n} \\times ${s.parallel} = ${n * s.parallel}$.`,
            `${s.name["zh-CN"]}有 $${s.parallel}$ 组平行边：$${n} \\times ${s.parallel} = ${n * s.parallel}$。`,
          ),
        });
      },
    },
  ],
);

export const modelingWithRectangles = topic(
  "modeling-with-rectangles",
  t("Modeling With Rectangles", "用长方形建模"),
  t(
    "The area of a rectangle is length × width and its perimeter is 2 × (length + width). These formulas solve real problems, including finding a missing side: a rug of area 48 square feet that is 6 feet wide is 48 ÷ 6 = 8 feet long.",
    "长方形的面积是长 × 宽，周长是 2 × (长 + 宽)。这些公式可以解决实际问题，包括求未知的边长：面积是 48 平方英尺、宽 6 英尺的地毯长 48 ÷ 6 = 8 英尺。",
  ),
  ["area-of-rectangles-and-squares", "two-digit-by-two-digit-multiplication-using-place-value", "division-with-remainders"],
  ["4.MD.A.3"],
  [
    {
      id: "area-and-perimeter-word-problems",
      title: t("Area or perimeter", "面积还是周长"),
      explanation: t(
        "Fencing goes around the edge, so it is a perimeter; carpet covers the floor, so it is an area.",
        "篱笆围在边上，求的是周长；地毯铺满地面，求的是面积。",
      ),
      generate(rng) {
        const l = rng.int(6, 40);
        const w = rng.int(3, Math.min(l - 1, 25));
        const name = rng.pick(names);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `${name}'s garden is a rectangle ${l} feet long and ${w} feet wide. How many feet of fencing go all the way around it?`,
              `${name} 的菜园是一个长 ${l} 英尺、宽 ${w} 英尺的长方形。围它一周需要多少英尺的篱笆？`,
            ),
            answer: 2 * (l + w),
            form: "integer",
            wrong: [l * w, l + w, 2 * l + w],
            solution: t(`$2 \\times (${l} + ${w}) = ${2 * (l + w)}$ feet.`, `$2 \\times (${l} + ${w}) = ${2 * (l + w)}$ 英尺。`),
          });
        }
        return numberProblem({
          prompt: t(
            `A room is a rectangle ${l} feet long and ${w} feet wide. How many square feet of carpet cover the floor?`,
            `一个房间是长 ${l} 英尺、宽 ${w} 英尺的长方形。铺满地面需要多少平方英尺的地毯？`,
          ),
          answer: l * w,
          form: "integer",
          wrong: [2 * (l + w), l + w, l * w + l],
          solution: t(`$${l} \\times ${w} = ${l * w}$ square feet.`, `$${l} \\times ${w} = ${l * w}$ 平方英尺。`),
        });
      },
    },
    {
      id: "finding-a-missing-side",
      title: t("A missing side", "求未知的边长"),
      explanation: t(
        "A rectangle with perimeter $30$ m and length $9$ m: the length and width add up to $15$ m, so the width is $6$ m.",
        "周长 $30$ 米、长 $9$ 米的长方形：长与宽之和是 $15$ 米，所以宽是 $6$ 米。",
      ),
      generate(rng) {
        const l = rng.int(5, 30);
        const w = rng.int(2, l - 1);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `A rectangular poster has an area of ${l * w} square inches and is ${l} inches long. How wide is it?`,
              `一张长方形海报的面积是 ${l * w} 平方英寸，长 ${l} 英寸。它宽多少英寸？`,
            ),
            answer: w,
            form: "integer",
            wrong: [l * w - l, (l * w) / 2 - l > 0 ? (l * w) / 2 - l : w + 1, l].filter((x) => Number.isInteger(x) && x !== w),
            solution: t(
              `Area is length times width, so the width is the area divided by the length: $${l * w} \\div ${l} = ${w}$ inches.`,
              `面积等于长乘宽，所以宽等于面积除以长：$${l * w} \\div ${l} = ${w}$ 英寸。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A rectangular pen has a perimeter of ${2 * (l + w)} meters and is ${l} meters long. How wide is it?`,
            `一个长方形围栏的周长是 ${2 * (l + w)} 米，长 ${l} 米。它宽多少米？`,
          ),
          answer: w,
          form: "integer",
          wrong: [2 * (l + w) - l, l + w, 2 * (l + w) - 2 * l].filter((x) => x !== w),
          solution: t(
            `Length plus width is $${2 * (l + w)} \\div 2 = ${l + w}$, so the width is $${l + w} - ${l} = ${w}$ meters.`,
            `长与宽之和是 $${2 * (l + w)} \\div 2 = ${l + w}$，所以宽是 $${l + w} - ${l} = ${w}$ 米。`,
          ),
        });
      },
    },
  ],
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
