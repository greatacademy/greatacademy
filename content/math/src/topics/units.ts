import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, dec, gcd, linear, num, paren, Q, q } from "@ga/subject-math";

import {
  choiceProblem,
  type ExpressionProblem,
  expressionProblem,
  isTerminating,
  numberProblem,
  steps,
  unitLatex,
  yesNo,
} from "../problems.ts";

/** qty writes a quantity in LaTeX: "4.5\text{ kg}", "12\text{ cm}^{2}". */
const qty = (v: Coefficient, unit: string) => `${dec(v)}${unitLatex(unit)}`;

/** tx writes a unit on its own in LaTeX: "\text{km/h}". */
const tx = (unit: string) => `\\text{${unit}}`;

/** decimal draws a positive number with at most the given number of decimal places and below max. */
const decimal = (rng: Rng, max: number, places: number) => q(rng.int(1, max * 10 ** places - 1), 10 ** places);

/** fixed writes a terminating decimal with exactly k decimal places: fixed(4, 1) is "4.0". */
function fixed(v: Q, k: number): string {
  if (k === 0) return dec(v);
  const [whole, frac = ""] = dec(v).split(".");
  return `${whole}.${frac.padEnd(k, "0")}`;
}

/** money writes an amount of money: whole amounts as integers, others with two decimal places. */
const money = (v: Q) => (v.isInteger() ? dec(v) : fixed(v, 2));

/** roundTo rounds a nonnegative number to p decimal places, halves up. */
function roundTo(v: Q, p: number): Q {
  const s = 10n ** BigInt(p);
  return Q.of((2n * v.n * s + v.d) / (2n * v.d), s);
}

/** truncTo cuts a nonnegative number off after p decimal places. */
function truncTo(v: Q, p: number): Q {
  const s = 10n ** BigInt(p);
  return Q.of((v.n * s) / v.d, s);
}

/** equationProblem builds an expression problem whose field follows "y =": the learner enters the right side of an equation. */
function equationProblem(variable: string, p: ExpressionProblem): Problem {
  return expressionProblem({ ...p, prefix: `${variable} =` });
}

/** choices builds a choice problem from options whose first is correct, shown in random order. */
function choices(rng: Rng, prompt: Text, options: readonly Text[], solution: Text): Problem {
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// Metric units.

/** Unit is a metric unit: its symbol, its name, and its size in the base unit. */
interface Unit {
  readonly sym: string;
  readonly name: Text;
  readonly size: Q;
}

const unit = (sym: string, en: string, zh: string, size: Q): Unit => ({ sym, name: t(en, zh), size });

const kilogram = unit("kg", "kilograms", "千克", Q.of(1000));
const gram = unit("g", "grams", "克", Q.one);
const milligram = unit("mg", "milligrams", "毫克", q(1, 1000));
const kilometer = unit("km", "kilometers", "千米", Q.of(1000));
const meter = unit("m", "meters", "米", Q.one);
const centimeter = unit("cm", "centimeters", "厘米", q(1, 100));
const millimeter = unit("mm", "millimeters", "毫米", q(1, 1000));

/** relation writes how many of the smaller unit make one of the larger: "1\text{ kg} = 1000\text{ g}". */
const relation = (big: Unit, small: Unit) => `1${unitLatex(big.sym)} = ${dec(big.size.div(small.size))}${unitLatex(small.sym)}`;

/** convertLatex writes one conversion step: "4.5\text{ kg} = (4.5 \cdot 1000)\text{ g} = 4500\text{ g}". */
function convertLatex(v: Q, from: Unit, to: Unit): string {
  const r = from.size.div(to.size);
  const op = r.cmp(Q.one) > 0 ? `\\cdot ${dec(r)}` : `\\div ${dec(Q.one.div(r))}`;
  return `${qty(v, from.sym)} = (${dec(v)} ${op})${unitLatex(to.sym)} = ${qty(v.mul(r), to.sym)}`;
}

/** conversionSolution explains a one-step conversion between metric units. */
function conversionSolution(v: Q, from: Unit, to: Unit): Text {
  const down = from.size.cmp(to.size) > 0;
  const [big, small] = down ? [from, to] : [to, from];
  const f = dec(big.size.div(small.size));
  return t(
    `Since $${relation(big, small)}$, ${down ? "multiply" : "divide"} by $${f}$ to convert ${from.name.en} to ${to.name.en}:${steps(convertLatex(v, from, to))}`,
    `因为 $${relation(big, small)}$，把${from.name["zh-CN"]}换算成${to.name["zh-CN"]}要${down ? "乘" : "除以"} $${f}$：${steps(convertLatex(v, from, to))}`,
  );
}

/** convertPrompt asks to convert a quantity to another unit. */
const convertPrompt = (v: Q, from: Unit, to: Unit) =>
  t(`Convert $${qty(v, from.sym)}$ to ${to.name.en}.`, `把 $${qty(v, from.sym)}$ 换算成${to.name["zh-CN"]}。`);

export const metricUnitsOfMass: TopicDef = {
  id: "metric-units-of-mass",
  title: t("Metric Units of Mass", "公制质量单位"),
  summary: t("Convert between kilograms, grams and milligrams.", "千克、克与毫克之间的换算。"),
  prerequisites: ["unit-rates"],
  encompasses: [{ topic: "decimal-arithmetic", weight: 0.1 }],
  xp: 10,
  standards: ["CCSS.5.MD.A.1"],
  knowledgePoints: [
    {
      id: "converting-to-smaller-units-of-mass",
      title: t("Converting to a smaller unit", "换算成较小的单位"),
      explanation: t(
        "Metric units are built from a **base unit** with prefixes: *kilo-* means $1000$ and *milli-* means $\\frac{1}{1000}$. The base unit of mass is the **gram** (g), so\n\n$$1\\text{ kg} = 1000\\text{ g}, \\qquad 1\\text{ g} = 1000\\text{ mg}$$\n\nA smaller unit takes more of itself to make the same mass, so to convert to a smaller unit, **multiply**. Multiplying by $1000$ moves the decimal point three places to the right:\n\n$$2.35\\text{ kg} = (2.35 \\cdot 1000)\\text{ g} = 2350\\text{ g}$$",
        "公制单位由一个**基本单位**加上前缀构成：*千*（kilo-）表示 $1000$，*毫*（milli-）表示 $\\frac{1}{1000}$。质量的基本单位是**克**（g），所以\n\n$$1\\text{ kg} = 1000\\text{ g}, \\qquad 1\\text{ g} = 1000\\text{ mg}$$\n\n单位越小，表示同样的质量需要的数量越多，所以换算成较小的单位要**乘**。乘 $1000$ 就是把小数点向右移动三位：\n\n$$2.35\\text{ kg} = (2.35 \\cdot 1000)\\text{ g} = 2350\\text{ g}$$",
      ),
      generate(rng) {
        const [from, to] = rng.pick([
          [kilogram, gram],
          [gram, milligram],
        ] as const);
        const v = rng.bool(0.3) ? Q.of(rng.int(2, 60)) : decimal(rng, 20, rng.int(1, 3));
        const f = from.size.div(to.size);
        return numberProblem({
          prompt: convertPrompt(v, from, to),
          answer: v.mul(f),
          form: "decimal",
          unit: to.sym,
          wrong: [v.div(f), v.mul(Q.of(100)), v.mul(Q.of(10))],
          solution: conversionSolution(v, from, to),
        });
      },
    },
    {
      id: "converting-to-larger-units-of-mass",
      title: t("Converting to a larger unit", "换算成较大的单位"),
      explanation: t(
        "A larger unit takes fewer of itself to make the same mass, so to convert to a larger unit, **divide**. Dividing by $1000$ moves the decimal point three places to the left:\n\n$$450\\text{ mg} = (450 \\div 1000)\\text{ g} = 0.45\\text{ g}$$\n\nCheck the size of the answer: a number of kilograms is always smaller than the same mass in grams.",
        "单位越大，表示同样的质量需要的数量越少，所以换算成较大的单位要**除**。除以 $1000$ 就是把小数点向左移动三位：\n\n$$450\\text{ mg} = (450 \\div 1000)\\text{ g} = 0.45\\text{ g}$$\n\n检查答案的大小：同样的质量，用千克表示的数一定比用克表示的数小。",
      ),
      generate(rng) {
        const [from, to] = rng.pick([
          [gram, kilogram],
          [milligram, gram],
        ] as const);
        const v = rng.bool(0.7) ? Q.of(rng.int(5, 9999)) : decimal(rng, 999, 1);
        const f = to.size.div(from.size);
        return numberProblem({
          prompt: convertPrompt(v, from, to),
          answer: v.div(f),
          form: "decimal",
          unit: to.sym,
          wrong: [v.mul(f), v.div(Q.of(100)), v.div(Q.of(10))],
          solution: conversionSolution(v, from, to),
        });
      },
    },
  ],
};

export const metricUnitsOfLength: TopicDef = {
  id: "metric-units-of-length",
  title: t("Metric Units of Length", "公制长度单位"),
  summary: t("Convert between meters and kilometers, centimeters and millimeters.", "米与千米、厘米、毫米之间的换算。"),
  prerequisites: ["metric-units-of-mass"],
  encompasses: [{ topic: "metric-units-of-mass", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.5.MD.A.1"],
  knowledgePoints: [
    {
      id: "converting-to-meters",
      title: t("Converting to meters", "换算成米"),
      explanation: t(
        "The base unit of length is the **meter** (m). The prefix *centi-* means $\\frac{1}{100}$, so the units of length are\n\n$$1\\text{ km} = 1000\\text{ m}, \\qquad 1\\text{ m} = 100\\text{ cm}, \\qquad 1\\text{ m} = 1000\\text{ mm}$$\n\nA kilometer is larger than a meter, so kilometers convert to meters by multiplying by $1000$. Centimeters and millimeters are smaller, so they convert to meters by dividing:\n\n$$245\\text{ cm} = (245 \\div 100)\\text{ m} = 2.45\\text{ m}$$",
        "长度的基本单位是**米**（m）。前缀*厘*（centi-）表示 $\\frac{1}{100}$，所以长度单位之间的关系是\n\n$$1\\text{ km} = 1000\\text{ m}, \\qquad 1\\text{ m} = 100\\text{ cm}, \\qquad 1\\text{ m} = 1000\\text{ mm}$$\n\n千米比米大，千米换算成米要乘 $1000$；厘米和毫米比米小，换算成米要除：\n\n$$245\\text{ cm} = (245 \\div 100)\\text{ m} = 2.45\\text{ m}$$",
      ),
      generate(rng) {
        const from = rng.pick([kilometer, centimeter, millimeter]);
        const v =
          from === kilometer
            ? decimal(rng, 30, rng.int(0, 3))
            : from === centimeter
              ? decimal(rng, 2000, rng.int(0, 1))
              : Q.of(rng.int(1, 9999));
        const r = from.size;
        return numberProblem({
          prompt: convertPrompt(v, from, meter),
          answer: v.mul(r),
          form: "decimal",
          unit: "m",
          wrong: [v.div(r), v.mul(r).mul(Q.of(10)), v.mul(r).div(Q.of(10))],
          solution: conversionSolution(v, from, meter),
        });
      },
    },
    {
      id: "converting-from-meters",
      title: t("Converting from meters", "由米换算"),
      explanation: t(
        "To convert meters to a smaller unit, multiply: $1\\text{ m} = 100\\text{ cm}$, so $3.7\\text{ m} = 370\\text{ cm}$. To convert meters to kilometers, a larger unit, divide by $1000$:\n\n$$2500\\text{ m} = (2500 \\div 1000)\\text{ km} = 2.5\\text{ km}$$",
        "把米换算成较小的单位要乘：$1\\text{ m} = 100\\text{ cm}$，所以 $3.7\\text{ m} = 370\\text{ cm}$。把米换算成较大的单位千米要除以 $1000$：\n\n$$2500\\text{ m} = (2500 \\div 1000)\\text{ km} = 2.5\\text{ km}$$",
      ),
      generate(rng) {
        const to = rng.pick([kilometer, centimeter, millimeter]);
        const v = to === kilometer ? Q.of(rng.int(20, 20000)) : decimal(rng, 30, rng.int(0, 3));
        const r = to.size;
        return numberProblem({
          prompt: convertPrompt(v, meter, to),
          answer: v.div(r),
          form: "decimal",
          unit: to.sym,
          wrong: [v.mul(r), v.div(r).mul(Q.of(10)), v.div(r).div(Q.of(10))],
          solution: conversionSolution(v, meter, to),
        });
      },
    },
  ],
};

/** twoStepSolution explains a conversion through the base unit. */
function twoStepSolution(v: Q, from: Unit, base: Unit, to: Unit): Text {
  const mid = v.mul(from.size);
  const line = steps(convertLatex(v, from, base), convertLatex(mid, base, to));
  return t(
    `Convert to ${base.name.en} first, then to ${to.name.en}:${line}`,
    `先换算成${base.name["zh-CN"]}，再换算成${to.name["zh-CN"]}：${line}`,
  );
}

const lengths = [kilometer, centimeter, millimeter] as const;

/** twoStepPair draws two metric units of one kind, neither of them the base unit, in the given direction. */
function twoStepPair(rng: Rng, down: boolean): [Unit, Unit, Unit] {
  const [a, b] = rng.bool(0.6) ? rng.sample(lengths, 2) : [kilogram, milligram];
  const [from, to] = a!.size.cmp(b!.size) > 0 === down ? [a!, b!] : [b!, a!];
  return [from, from.sym.endsWith("g") ? gram : meter, to];
}

export const twoStepUnitConversions: TopicDef = {
  id: "two-step-unit-conversions",
  title: t("Two-Step Unit Conversions", "两步单位换算"),
  summary: t("Convert between metric units by way of the base unit.", "经由基本单位进行公制单位换算。"),
  prerequisites: ["metric-units-of-length"],
  encompasses: [
    { topic: "metric-units-of-length", weight: 0.5 },
    { topic: "metric-units-of-mass", weight: 0.3 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "two-steps-to-a-smaller-unit",
      title: t("Two steps to a smaller unit", "两步换算成较小的单位"),
      explanation: t(
        "To convert between two prefixed units, such as kilometers and centimeters, go **through the base unit**: first convert to meters, then from meters to the target unit.\n\n$$3.2\\text{ km} = (3.2 \\cdot 1000)\\text{ m} = 3200\\text{ m}$$\n\n$$3200\\text{ m} = (3200 \\cdot 100)\\text{ cm} = 320000\\text{ cm}$$\n\nBoth steps go to a smaller unit, so both multiply.",
        "在两个带前缀的单位之间换算，例如千米与厘米，要**经由基本单位**：先换算成米，再由米换算成目标单位。\n\n$$3.2\\text{ km} = (3.2 \\cdot 1000)\\text{ m} = 3200\\text{ m}$$\n\n$$3200\\text{ m} = (3200 \\cdot 100)\\text{ cm} = 320000\\text{ cm}$$\n\n两步都是换算成较小的单位，所以都用乘法。",
      ),
      generate(rng) {
        const [from, base, to] = twoStepPair(rng, true);
        const v = decimal(rng, 20, rng.int(0, 2));
        const answer = v.mul(from.size).div(to.size);
        return numberProblem({
          prompt: convertPrompt(v, from, to),
          answer,
          form: "decimal",
          unit: to.sym,
          // Stopping at the base unit; dividing in the second step; dividing throughout.
          wrong: [v.mul(from.size), v.mul(from.size).mul(to.size), v.mul(to.size).div(from.size)],
          solution: twoStepSolution(v, from, base, to),
        });
      },
    },
    {
      id: "two-steps-to-a-larger-unit",
      title: t("Two steps to a larger unit", "两步换算成较大的单位"),
      explanation: t(
        "Going to a larger unit, both steps divide. To convert $45000$ mg to kilograms:\n\n$$45000\\text{ mg} = (45000 \\div 1000)\\text{ g} = 45\\text{ g}$$\n\n$$45\\text{ g} = (45 \\div 1000)\\text{ kg} = 0.045\\text{ kg}$$",
        "换算成较大的单位时，两步都用除法。把 $45000$ mg 换算成千克：\n\n$$45000\\text{ mg} = (45000 \\div 1000)\\text{ g} = 45\\text{ g}$$\n\n$$45\\text{ g} = (45 \\div 1000)\\text{ kg} = 0.045\\text{ kg}$$",
      ),
      generate(rng) {
        const [from, base, to] = twoStepPair(rng, false);
        const v = Q.of(rng.int(1, 999) * 10 ** rng.int(0, 3));
        const answer = v.mul(from.size).div(to.size);
        return numberProblem({
          prompt: convertPrompt(v, from, to),
          answer,
          form: "decimal",
          unit: to.sym,
          wrong: [v.mul(from.size), v.mul(from.size).mul(to.size), v.mul(to.size).div(from.size)],
          solution: twoStepSolution(v, from, base, to),
        });
      },
    },
  ],
};

// Units of time.

/** TimeUnit is a unit of time: its names and its length in seconds. */
interface TimeUnit {
  readonly one: string;
  readonly many: string;
  readonly zh: string;
  readonly seconds: number;
}

const second: TimeUnit = { one: "second", many: "seconds", zh: "秒", seconds: 1 };
const minute: TimeUnit = { one: "minute", many: "minutes", zh: "分钟", seconds: 60 };
const hour: TimeUnit = { one: "hour", many: "hours", zh: "小时", seconds: 3600 };
const day: TimeUnit = { one: "day", many: "days", zh: "天", seconds: 86400 };
const week: TimeUnit = { one: "week", many: "weeks", zh: "周", seconds: 604800 };

/** timeAmount draws a number of a time unit that converts to a whole or simple number of the next smaller unit. */
function timeAmount(rng: Rng, f: number): Q {
  const d = rng.pick(f === 60 ? [1, 2, 4, 10] : f === 24 ? [1, 2, 4] : [1, 2]);
  return Q.of(rng.int(1, 12)).add(q(rng.int(d === 1 ? 0 : 1, d - 1), d));
}

/** howMany asks how many of one time unit there are in an amount of another. */
const howMany = (v: Q, from: TimeUnit, to: TimeUnit) =>
  t(`How many ${to.many} are in $${dec(v)}$ ${v.eq(Q.one) ? from.one : from.many}?`, `$${dec(v)}$ ${from.zh}是多少${to.zh}？`);

/** timeSolution explains a conversion between units of time through the given chain of units. */
function timeSolution(v: Q, chain: readonly TimeUnit[]): Text {
  const facts: string[] = [];
  const lines: string[] = [];
  let x = v;
  for (let i = 1; i < chain.length; i++) {
    const a = chain[i - 1]!;
    const b = chain[i]!;
    const r = q(a.seconds, b.seconds);
    const down = r.cmp(Q.one) > 0;
    const [big, small] = down ? [a, b] : [b, a];
    facts.push(`1\\text{ ${big.one}} = ${big.seconds / small.seconds}\\text{ ${small.many}}`);
    const y = x.mul(r);
    lines.push(`${dec(x)} ${down ? "\\cdot" : "\\div"} ${big.seconds / small.seconds} = ${dec(y)}`);
    x = y;
  }
  const zhFacts = chain.slice(1).map((b, i) => {
    const a = chain[i]!;
    const [big, small] = a.seconds > b.seconds ? [a, b] : [b, a];
    return `1 ${big.zh} = ${big.seconds / small.seconds} ${small.zh}`;
  });
  return t(
    `Use $${facts.join(", ")}$:${steps(...lines)}So the answer is $${dec(x)}$ ${chain.at(-1)!.many}.`,
    `利用 ${zhFacts.map((f) => `$${f}$`).join("、")}：${steps(...lines)}所以答案是 $${dec(x)}$ ${chain.at(-1)!.zh}。`,
  );
}

const onePairs = [
  [hour, minute],
  [minute, second],
  [day, hour],
  [week, day],
] as const;

const twoPairs = [
  [hour, minute, second],
  [day, hour, minute],
  [week, day, hour],
] as const;

/** Speed is a unit of speed: its LaTeX, its names, and its size in meters per second. */
interface Speed {
  readonly tex: string;
  readonly name: Text;
  /** dist and time are the unit of distance in meters and the unit of time in seconds. */
  readonly dist: number;
  readonly time: number;
  readonly size: Q;
}

const speed = (tex: string, en: string, zh: string, dist: number, time: number): Speed => ({
  tex,
  name: t(en, zh),
  dist,
  time,
  size: q(dist, time),
});

const kmh = speed("km/h", "kilometers per hour", "千米每小时", 1000, 3600);
const mps = speed("m/s", "meters per second", "米每秒", 1, 1);
const mpm = speed("m/min", "meters per minute", "米每分钟", 1, 60);

export const unitsOfTime: TopicDef = {
  id: "units-of-time",
  title: t("Units of Time", "时间单位"),
  summary: t(
    "Convert between seconds, minutes, hours, days and weeks, and convert speeds.",
    "秒、分钟、小时、天、周之间的换算，以及速度单位的换算。",
  ),
  prerequisites: ["two-step-unit-conversions"],
  encompasses: [{ topic: "two-step-unit-conversions", weight: 0.3 }],
  xp: 15,
  knowledgePoints: [
    {
      id: "converting-to-smaller-units-of-time",
      title: t("Converting to a smaller unit", "换算成较小的单位"),
      explanation: t(
        "Units of time are not decimal:\n\n$$1\\text{ week} = 7\\text{ days}, \\quad 1\\text{ day} = 24\\text{ hours}, \\quad 1\\text{ hour} = 60\\text{ minutes}, \\quad 1\\text{ minute} = 60\\text{ seconds}$$\n\nTo convert to a smaller unit, multiply by the number of small units in one large unit:\n\n$$2.5\\text{ hours} = 2.5 \\cdot 60 = 150\\text{ minutes}$$\n\nBeware: $2.5$ hours is not $250$ minutes, and not $2$ hours $50$ minutes. An hour has $60$ minutes, not $100$.",
        "时间单位不是十进制的：\n\n$$1 \\text{ 周} = 7 \\text{ 天}, \\quad 1 \\text{ 天} = 24 \\text{ 小时}, \\quad 1 \\text{ 小时} = 60 \\text{ 分钟}, \\quad 1 \\text{ 分钟} = 60 \\text{ 秒}$$\n\n换算成较小的单位，乘一个大单位所含小单位的个数：\n\n$$2.5 \\text{ 小时} = 2.5 \\cdot 60 = 150 \\text{ 分钟}$$\n\n注意：$2.5$ 小时不是 $250$ 分钟，也不是 $2$ 小时 $50$ 分钟。一小时是 $60$ 分钟，不是 $100$ 分钟。",
      ),
      generate(rng) {
        const [from, to] = rng.pick(onePairs);
        const f = from.seconds / to.seconds;
        const v = timeAmount(rng, f);
        return numberProblem({
          prompt: howMany(v, from, to),
          answer: v.mul(Q.of(f)),
          form: "decimal",
          wrong: [v.mul(Q.of(100)), v.div(Q.of(f)), v.mul(Q.of(10))],
          solution: timeSolution(v, [from, to]),
        });
      },
    },
    {
      id: "converting-to-larger-units-of-time",
      title: t("Converting to a larger unit", "换算成较大的单位"),
      explanation: t(
        "To convert to a larger unit, divide:\n\n$$150\\text{ minutes} = 150 \\div 60 = 2.5\\text{ hours}$$\n\nThe decimal part is a fraction of an hour: $0.5$ hours is half an hour, $30$ minutes. So $150$ minutes is $2.5$ hours, not $1.5$ hours (dividing by $100$) and not $2.3$ hours (writing the $30$ leftover minutes after the point).",
        "换算成较大的单位要除：\n\n$$150 \\text{ 分钟} = 150 \\div 60 = 2.5 \\text{ 小时}$$\n\n小数部分是一小时的几分之几：$0.5$ 小时是半小时，即 $30$ 分钟。所以 $150$ 分钟是 $2.5$ 小时，不是 $1.5$ 小时（错误地除以 $100$），也不是 $2.3$ 小时（把剩下的 $30$ 分钟写在小数点后）。",
      ),
      generate(rng) {
        const [to, from] = rng.pick(onePairs);
        const f = to.seconds / from.seconds;
        const a = timeAmount(rng, f);
        const v = a.mul(Q.of(f));
        const whole = Math.floor(a.toNumber());
        const rest = v.sub(Q.of(whole * f));
        return numberProblem({
          prompt: howMany(v, from, to),
          answer: a,
          form: "decimal",
          wrong: [v.div(Q.of(100)), v.mul(Q.of(f)), Q.of(whole).add(rest.div(Q.of(rest.cmp(Q.of(10)) < 0 ? 10 : 100)))],
          solution: timeSolution(v, [from, to]),
        });
      },
    },
    {
      id: "two-step-time-conversions",
      title: t("Two-step conversions", "两步换算"),
      explanation: t(
        "To convert hours to seconds, go through minutes:\n\n$$2\\text{ hours} = 2 \\cdot 60 = 120\\text{ minutes} = 120 \\cdot 60 = 7200\\text{ seconds}$$\n\nIn the other direction, divide twice: $10800$ seconds $= 10800 \\div 60 = 180$ minutes $= 180 \\div 60 = 3$ hours.",
        "把小时换算成秒，要经由分钟：\n\n$$2 \\text{ 小时} = 2 \\cdot 60 = 120 \\text{ 分钟} = 120 \\cdot 60 = 7200 \\text{ 秒}$$\n\n反过来就除两次：$10800$ 秒 $= 10800 \\div 60 = 180$ 分钟 $= 180 \\div 60 = 3$ 小时。",
      ),
      generate(rng) {
        const chain = rng.pick(twoPairs);
        const [big, mid, small] = chain;
        const f = big.seconds / small.seconds;
        const f1 = big.seconds / mid.seconds;
        const f2 = mid.seconds / small.seconds;
        const a = Q.of(rng.int(1, 9)).add(rng.bool(0.3) ? q(1, 2) : Q.zero);
        if (rng.bool()) {
          return numberProblem({
            prompt: howMany(a, big, small),
            answer: a.mul(Q.of(f)),
            form: "decimal",
            wrong: [a.mul(Q.of(f1)), a.mul(Q.of(f2)), a.div(Q.of(f))],
            solution: timeSolution(a, chain),
          });
        }
        const v = a.mul(Q.of(f));
        return numberProblem({
          prompt: howMany(v, small, big),
          answer: a,
          form: "decimal",
          wrong: [v.div(Q.of(f2)), v.div(Q.of(f1)), v.mul(Q.of(f))],
          solution: timeSolution(v, [small, mid, big]),
        });
      },
    },
    {
      id: "converting-speeds",
      title: t("Converting speeds", "速度单位的换算"),
      explanation: t(
        "A speed has two units, so converting it may take two conversions: one for the distance and one for the time. To convert $72$ km/h to meters per second, write the kilometers as meters and the hour as seconds:\n\n$$72\\text{ km/h} = \\frac{72 \\cdot 1000\\text{ m}}{3600\\text{ s}} = \\frac{72000}{3600}\\text{ m/s} = 20\\text{ m/s}$$",
        "速度有两个单位，所以换算时可能要换算两次：一次换算路程，一次换算时间。把 $72$ km/h 换算成米每秒，把千米写成米，把小时写成秒：\n\n$$72\\text{ km/h} = \\frac{72 \\cdot 1000\\text{ m}}{3600\\text{ s}} = \\frac{72000}{3600}\\text{ m/s} = 20\\text{ m/s}$$",
      ),
      generate(rng) {
        const [from, to] = rng.pick([
          [kmh, mps],
          [mps, kmh],
          [kmh, mpm],
          [mpm, mps],
          [mps, mpm],
        ] as const);
        const fd = Q.of(from.dist).div(Q.of(to.dist));
        const ft = Q.of(from.time).div(Q.of(to.time));
        // v is drawn so that the speed in the new unit has at most one decimal place.
        const v =
          from === kmh
            ? Q.of(rng.int(1, 30) * (to === mps ? 9 : 3))
            : from === mpm
              ? Q.of(rng.int(1, 40) * 6)
              : decimal(rng, 40, rng.int(0, 1));
        const answer = v.mul(fd).div(ft);
        const ms = v.mul(from.size);
        const lines = !isTerminating(ms)
          ? [`${dec(v)}\\text{ km/h} = \\frac{${dec(v)} \\cdot 1000\\text{ m}}{60\\text{ min}} = ${dec(answer)}\\text{ m/min}`]
          : [
              ...(from === mps
                ? []
                : [
                    `${dec(v)}\\text{ ${from.tex}} = \\frac{${dec(v)} \\cdot ${from.dist}\\text{ m}}{${from.time}\\text{ s}} = ${dec(ms)}\\text{ m/s}`,
                  ]),
              ...(to === mps
                ? []
                : [
                    `${dec(ms)}\\text{ m/s} = ${dec(ms)} \\cdot ${dec(Q.of(to.time).div(Q.of(to.dist)))}\\text{ ${to.tex}} = ${dec(answer)}\\text{ ${to.tex}}`,
                  ]),
            ];
        return numberProblem({
          prompt: t(
            `Convert $${dec(v)}\\text{ ${from.tex}}$ to ${to.name.en}.`,
            `把 $${dec(v)}\\text{ ${from.tex}}$ 换算成${to.name["zh-CN"]}。`,
          ),
          answer,
          form: "decimal",
          // Multiplying instead of dividing; converting only the distance; converting only the time.
          wrong: [v.mul(ft).div(fd), v.mul(fd), v.div(ft)],
          solution: t(`Write the speed in meters and seconds:${steps(...lines)}`, `把速度写成以米和秒为单位：${steps(...lines)}`),
        });
      },
    },
  ],
};

// Mixed units.

/** Mixed is a pair of units used together, as in 3 h 25 min, with the number of small units in one large unit. */
interface Mixed {
  readonly big: string;
  readonly small: string;
  readonly f: number;
  readonly bigName: Text;
  readonly smallName: Text;
  /** given marks customary units whose relation the prompt states. */
  readonly given: boolean;
  /** steps are the numbers of small units that make a terminating decimal of the large unit. */
  readonly steps: readonly number[];
}

const range = (from: number, to: number, by = 1) => Array.from({ length: Math.floor((to - from) / by) + 1 }, (_, i) => from + i * by);

const mixedPairs: readonly Mixed[] = [
  { big: "h", small: "min", f: 60, bigName: t("hours", "小时"), smallName: t("minutes", "分钟"), given: false, steps: range(3, 57, 3) },
  { big: "min", small: "s", f: 60, bigName: t("minutes", "分钟"), smallName: t("seconds", "秒"), given: false, steps: range(3, 57, 3) },
  { big: "ft", small: "in", f: 12, bigName: t("feet", "英尺"), smallName: t("inches", "英寸"), given: true, steps: [3, 6, 9] },
  { big: "lb", small: "oz", f: 16, bigName: t("pounds", "磅"), smallName: t("ounces", "盎司"), given: true, steps: range(2, 14, 2) },
  { big: "m", small: "cm", f: 100, bigName: t("meters", "米"), smallName: t("centimeters", "厘米"), given: false, steps: range(5, 95, 5) },
  { big: "kg", small: "g", f: 1000, bigName: t("kilograms", "千克"), smallName: t("grams", "克"), given: false, steps: range(25, 975, 25) },
];

/** mixedLatex writes an amount in mixed units: "3\text{ h }25\text{ min}". */
const mixedQty = (a: number, b: number | string, m: Mixed) => `${a}\\text{ ${m.big} }${b}\\text{ ${m.small}}`;

/** givenNote states the relation of customary units, which are not taught here. */
const givenNote = (m: Mixed): Text =>
  m.given ? t(` ($1\\text{ ${m.big}} = ${m.f}\\text{ ${m.small}}$)`, `（$1\\text{ ${m.big}} = ${m.f}\\text{ ${m.small}}$）`) : t("", "");

const plus = (a: Text, b: Text): Text => t(a.en + b.en, a["zh-CN"] + b["zh-CN"]);

export const mixedUnits: TopicDef = {
  id: "mixed-units",
  title: t("Converting Between Mixed Units", "复名数的换算"),
  summary: t("Convert amounts such as 3 h 25 min to a single unit, and back.", "把 3 h 25 min 这样的量换算成单一单位，以及反过来。"),
  prerequisites: ["units-of-time"],
  encompasses: [{ topic: "units-of-time", weight: 0.4 }],
  xp: 12,
  knowledgePoints: [
    {
      id: "mixed-units-to-the-smaller-unit",
      title: t("Mixed units to the smaller unit", "化成较小的单位"),
      explanation: t(
        "An amount such as $3\\text{ h }25\\text{ min}$ uses two units. To write it in the smaller unit, convert the large part and add the small part:\n\n$$3\\text{ h }25\\text{ min} = 3 \\cdot 60 + 25 = 205\\text{ min}$$",
        "像 $3\\text{ h }25\\text{ min}$ 这样的量用了两个单位。要化成较小的单位，先换算大单位的部分，再加上小单位的部分：\n\n$$3\\text{ h }25\\text{ min} = 3 \\cdot 60 + 25 = 205\\text{ min}$$",
      ),
      generate(rng) {
        const m = rng.pick(mixedPairs);
        const a = rng.int(1, 9);
        const b = rng.int(1, m.f - 1);
        const answer = a * m.f + b;
        return numberProblem({
          prompt: plus(
            t(`Write $${mixedQty(a, b, m)}$ in ${m.smallName.en}.`, `把 $${mixedQty(a, b, m)}$ 化成以${m.smallName["zh-CN"]}为单位。`),
            givenNote(m),
          ),
          answer,
          form: "integer",
          unit: m.small,
          wrong: [a * (m.f === 100 ? 1000 : 100) + b, a + b, a * m.f],
          solution: t(
            `$1\\text{ ${m.big}} = ${m.f}\\text{ ${m.small}}$:${steps(`${mixedQty(a, b, m)} = ${a} \\cdot ${m.f} + ${b} = ${answer}\\text{ ${m.small}}`)}`,
            `$1\\text{ ${m.big}} = ${m.f}\\text{ ${m.small}}$：${steps(`${mixedQty(a, b, m)} = ${a} \\cdot ${m.f} + ${b} = ${answer}\\text{ ${m.small}}`)}`,
          ),
        });
      },
    },
    {
      id: "mixed-units-to-a-decimal",
      title: t("Mixed units as a decimal", "化成小数"),
      explanation: t(
        "To write $2\\text{ h }15\\text{ min}$ in hours, convert the minutes to a fraction of an hour:\n\n$$15\\text{ min} = \\frac{15}{60}\\text{ h} = 0.25\\text{ h}, \\qquad 2\\text{ h }15\\text{ min} = 2.25\\text{ h}$$\n\nIt is not $2.15$ hours: the digits after the point are not minutes.",
        "要把 $2\\text{ h }15\\text{ min}$ 化成小时，把分钟换算成几分之几小时：\n\n$$15\\text{ min} = \\frac{15}{60}\\text{ h} = 0.25\\text{ h}, \\qquad 2\\text{ h }15\\text{ min} = 2.25\\text{ h}$$\n\n不是 $2.15$ 小时：小数点后的数字不是分钟数。",
      ),
      generate(rng) {
        const m = rng.pick(mixedPairs);
        const a = rng.int(1, 9);
        const b = rng.pick(m.steps);
        const part = q(b, m.f);
        const answer = part.add(Q.of(a));
        return numberProblem({
          prompt: plus(
            t(
              `Write $${mixedQty(a, b, m)}$ in ${m.bigName.en}, as a decimal.`,
              `把 $${mixedQty(a, b, m)}$ 化成以${m.bigName["zh-CN"]}为单位的小数。`,
            ),
            givenNote(m),
          ),
          answer,
          form: "decimal",
          unit: m.big,
          // Writing the small units after the decimal point.
          wrong: [Q.of(a).add(q(b, 10 ** String(b).length)), Q.of(a).add(q(b, 100))],
          solution: t(
            `${steps(`${b}\\text{ ${m.small}} = \\frac{${b}}{${m.f}}\\text{ ${m.big}} = ${qty(part, m.big)}`, `${mixedQty(a, b, m)} = ${qty(answer, m.big)}`)}`,
            `${steps(`${b}\\text{ ${m.small}} = \\frac{${b}}{${m.f}}\\text{ ${m.big}} = ${qty(part, m.big)}`, `${mixedQty(a, b, m)} = ${qty(answer, m.big)}`)}`,
          ),
        });
      },
    },
    {
      id: "decimals-to-mixed-units",
      title: t("Decimals to mixed units", "小数化成复名数"),
      explanation: t(
        "To write $3.4$ hours in hours and minutes, keep the whole hours and convert the decimal part:\n\n$$0.4\\text{ h} = 0.4 \\cdot 60\\text{ min} = 24\\text{ min}, \\qquad 3.4\\text{ h} = 3\\text{ h }24\\text{ min}$$\n\nIt is not $3$ h $40$ min: $0.4$ of an hour is $0.4$ of $60$ minutes.",
        "要把 $3.4$ 小时写成几小时几分钟，保留整数小时，把小数部分换算成分钟：\n\n$$0.4\\text{ h} = 0.4 \\cdot 60\\text{ min} = 24\\text{ min}, \\qquad 3.4\\text{ h} = 3\\text{ h }24\\text{ min}$$\n\n不是 $3$ h $40$ min：$0.4$ 小时是 $60$ 分钟的 $0.4$ 倍。",
      ),
      generate(rng) {
        const m = rng.pick(mixedPairs);
        const a = rng.int(1, 9);
        const b = rng.pick(m.steps);
        const part = q(b, m.f);
        const v = part.add(Q.of(a));
        const box = mixedQty(a, "\\square", m);
        return numberProblem({
          prompt: plus(
            t(
              `Write $${qty(v, m.big)}$ in ${m.bigName.en} and ${m.smallName.en}: $${qty(v, m.big)} = ${box}$. What number goes in the box?`,
              `把 $${qty(v, m.big)}$ 写成几${m.bigName["zh-CN"]}几${m.smallName["zh-CN"]}：$${qty(v, m.big)} = ${box}$。方框里应填什么数？`,
            ),
            givenNote(m),
          ),
          answer: b,
          form: "integer",
          unit: m.small,
          // Reading the digits after the point as small units.
          wrong: [Number(dec(part).split(".")[1]), part.mul(Q.of(100))],
          solution: t(
            `Convert the decimal part:${steps(`${qty(part, m.big)} = ${dec(part)} \\cdot ${m.f}\\text{ ${m.small}} = ${b}\\text{ ${m.small}}`)}So $${qty(v, m.big)} = ${mixedQty(a, b, m)}$.`,
            `换算小数部分：${steps(`${qty(part, m.big)} = ${dec(part)} \\cdot ${m.f}\\text{ ${m.small}} = ${b}\\text{ ${m.small}}`)}所以 $${qty(v, m.big)} = ${mixedQty(a, b, m)}$。`,
          ),
        });
      },
    },
  ],
};

// Units of area.

/** AreaPair is a pair of units of length, with the number of small units in one large unit. */
interface AreaPair {
  readonly big: string;
  readonly small: string;
  readonly f: number;
  readonly bigName: Text;
  readonly smallName: Text;
  readonly given: boolean;
}

const areaPairs: readonly AreaPair[] = [
  { big: "m", small: "cm", f: 100, bigName: t("square meters", "平方米"), smallName: t("square centimeters", "平方厘米"), given: false },
  {
    big: "cm",
    small: "mm",
    f: 10,
    bigName: t("square centimeters", "平方厘米"),
    smallName: t("square millimeters", "平方毫米"),
    given: false,
  },
  { big: "km", small: "m", f: 1000, bigName: t("square kilometers", "平方千米"), smallName: t("square meters", "平方米"), given: false },
  { big: "ft", small: "in", f: 12, bigName: t("square feet", "平方英尺"), smallName: t("square inches", "平方英寸"), given: true },
  { big: "yd", small: "ft", f: 3, bigName: t("square yards", "平方码"), smallName: t("square feet", "平方英尺"), given: true },
];

const areaNote = (p: AreaPair): Text =>
  p.given ? t(` ($1\\text{ ${p.big}} = ${p.f}\\text{ ${p.small}}$)`, `（$1\\text{ ${p.big}} = ${p.f}\\text{ ${p.small}}$）`) : t("", "");

/** areaFact writes the relation of the units of area: "1\text{ m}^{2} = 100 \cdot 100 = 10000\text{ cm}^{2}". */
const areaFact = (p: AreaPair) =>
  `1${unitLatex(`${p.big}^2`)} = ${p.f} \\cdot ${p.f}${unitLatex(`${p.small}^2`)} = ${p.f * p.f}${unitLatex(`${p.small}^2`)}`;

export const convertingUnitsOfArea: TopicDef = {
  id: "converting-units-of-area",
  title: t("Converting Units of Area", "面积单位的换算"),
  summary: t(
    "Convert areas to smaller and to larger units using the square of the length factor.",
    "用长度换算系数的平方，把面积换算成较小或较大的单位。",
  ),
  prerequisites: ["metric-units-of-length", "area-of-rectangles-and-squares"],
  encompasses: [
    { topic: "metric-units-of-length", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.3 },
  ],
  xp: 15,
  knowledgePoints: [
    {
      id: "area-to-smaller-units",
      title: t("Converting to a smaller unit", "换算成较小的单位"),
      explanation: t(
        "A square meter is a square $1$ m on each side. Each side is $100$ cm, so the square holds $100 \\cdot 100$ square centimeters:\n\n$$1\\text{ m}^2 = 100 \\cdot 100\\text{ cm}^2 = 10000\\text{ cm}^2$$\n\nTo convert an area to a smaller unit, multiply by the **square** of the length factor, not by the length factor itself:\n\n$$3.5\\text{ m}^2 = 3.5 \\cdot 10000\\text{ cm}^2 = 35000\\text{ cm}^2$$",
        "一平方米是边长 $1$ m 的正方形。每条边是 $100$ cm，所以这个正方形包含 $100 \\cdot 100$ 个平方厘米：\n\n$$1\\text{ m}^2 = 100 \\cdot 100\\text{ cm}^2 = 10000\\text{ cm}^2$$\n\n把面积换算成较小的单位，要乘长度换算系数的**平方**，而不是长度换算系数本身：\n\n$$3.5\\text{ m}^2 = 3.5 \\cdot 10000\\text{ cm}^2 = 35000\\text{ cm}^2$$",
      ),
      keyPrerequisites: ["metric-units-of-length"],
      generate(rng) {
        const p = rng.pick(areaPairs);
        const v = p.given ? Q.of(rng.int(2, 20)).add(rng.bool(0.3) ? q(1, 2) : Q.zero) : decimal(rng, 30, rng.int(0, 1));
        const f2 = Q.of(p.f * p.f);
        const answer = v.mul(f2);
        return numberProblem({
          prompt: plus(
            t(`Convert $${qty(v, `${p.big}^2`)}$ to ${p.smallName.en}.`, `把 $${qty(v, `${p.big}^2`)}$ 换算成${p.smallName["zh-CN"]}。`),
            areaNote(p),
          ),
          answer,
          form: "decimal",
          unit: `${p.small}^2`,
          wrong: [v.mul(Q.of(p.f)), v.div(f2), v.mul(Q.of(2 * p.f))],
          solution: t(
            `${steps(areaFact(p), `${qty(v, `${p.big}^2`)} = ${dec(v)} \\cdot ${p.f * p.f}${unitLatex(`${p.small}^2`)} = ${qty(answer, `${p.small}^2`)}`)}`,
            `${steps(areaFact(p), `${qty(v, `${p.big}^2`)} = ${dec(v)} \\cdot ${p.f * p.f}${unitLatex(`${p.small}^2`)} = ${qty(answer, `${p.small}^2`)}`)}`,
          ),
        });
      },
    },
    {
      id: "area-to-larger-units",
      title: t("Converting to a larger unit", "换算成较大的单位"),
      explanation: t(
        "To convert an area to a larger unit, divide by the square of the length factor. Since $1\\text{ ft} = 12\\text{ in}$, $1\\text{ ft}^2 = 144\\text{ in}^2$:\n\n$$360\\text{ in}^2 = (360 \\div 144)\\text{ ft}^2 = 2.5\\text{ ft}^2$$",
        "把面积换算成较大的单位，要除以长度换算系数的平方。因为 $1\\text{ ft} = 12\\text{ in}$，所以 $1\\text{ ft}^2 = 144\\text{ in}^2$：\n\n$$360\\text{ in}^2 = (360 \\div 144)\\text{ ft}^2 = 2.5\\text{ ft}^2$$",
      ),
      generate(rng) {
        const p = rng.pick(areaPairs);
        const answer = p.given ? Q.of(rng.int(1, 12)).add(q(rng.int(0, 3), 4)) : decimal(rng, 20, rng.int(1, 2));
        const f2 = Q.of(p.f * p.f);
        const v = answer.mul(f2);
        return numberProblem({
          prompt: plus(
            t(`Convert $${qty(v, `${p.small}^2`)}$ to ${p.bigName.en}.`, `把 $${qty(v, `${p.small}^2`)}$ 换算成${p.bigName["zh-CN"]}。`),
            areaNote(p),
          ),
          answer,
          form: "decimal",
          unit: `${p.big}^2`,
          wrong: [v.div(Q.of(p.f)), v.mul(f2), v.div(Q.of(2 * p.f))],
          solution: t(
            `${steps(areaFact(p), `${qty(v, `${p.small}^2`)} = (${dec(v)} \\div ${p.f * p.f})${unitLatex(`${p.big}^2`)} = ${qty(answer, `${p.big}^2`)}`)}`,
            `${steps(areaFact(p), `${qty(v, `${p.small}^2`)} = (${dec(v)} \\div ${p.f * p.f})${unitLatex(`${p.big}^2`)} = ${qty(answer, `${p.big}^2`)}`)}`,
          ),
        });
      },
    },
    {
      id: "areas-of-rectangles-in-other-units",
      title: t("Areas in another unit", "用另一种单位表示面积"),
      explanation: t(
        "To find the area of a rectangle in a different unit from its sides, either convert the sides first, or find the area and then convert it with the squared factor. A rectangle $1.2$ m by $0.5$ m is $120$ cm by $50$ cm, so its area is\n\n$$120 \\cdot 50 = 6000\\text{ cm}^2 \\qquad \\text{or} \\qquad 1.2 \\cdot 0.5 = 0.6\\text{ m}^2 = 0.6 \\cdot 10000\\text{ cm}^2 = 6000\\text{ cm}^2$$",
        "要用与边长不同的单位表示长方形的面积，可以先换算边长，也可以先求面积，再用系数的平方换算。$1.2$ m 乘 $0.5$ m 的长方形就是 $120$ cm 乘 $50$ cm，所以面积是\n\n$$120 \\cdot 50 = 6000\\text{ cm}^2 \\qquad \\text{或} \\qquad 1.2 \\cdot 0.5 = 0.6\\text{ m}^2 = 0.6 \\cdot 10000\\text{ cm}^2 = 6000\\text{ cm}^2$$",
      ),
      keyPrerequisites: ["area-of-rectangles-and-squares"],
      generate(rng) {
        const p = rng.pick(areaPairs.filter((a) => a.big !== "km"));
        const f = Q.of(p.f);
        if (rng.bool()) {
          // Sides in the large unit, area in the small one.
          const draw = () => (p.given ? Q.of(rng.int(1, 6)).add(rng.bool() ? q(1, 2) : Q.zero) : decimal(rng, 3, 1));
          const l = draw();
          const w = draw();
          const area = l.mul(w);
          const answer = area.mul(f).mul(f);
          return numberProblem({
            prompt: plus(
              t(
                `A rectangle measures $${qty(l, p.big)}$ by $${qty(w, p.big)}$. Find its area in ${p.smallName.en}.`,
                `一个长方形的两边分别是 $${qty(l, p.big)}$ 和 $${qty(w, p.big)}$。求它的面积，以${p.smallName["zh-CN"]}为单位。`,
              ),
              areaNote(p),
            ),
            answer,
            form: "decimal",
            unit: `${p.small}^2`,
            wrong: [area.mul(f), area, answer.div(Q.of(100))],
            solution: t(
              `Convert the sides first:${steps(`${qty(l, p.big)} = ${qty(l.mul(f), p.small)}, \\quad ${qty(w, p.big)} = ${qty(w.mul(f), p.small)}`, `A = ${dec(l.mul(f))} \\cdot ${dec(w.mul(f))} = ${qty(answer, `${p.small}^2`)}`)}`,
              `先换算边长：${steps(`${qty(l, p.big)} = ${qty(l.mul(f), p.small)}, \\quad ${qty(w, p.big)} = ${qty(w.mul(f), p.small)}`, `A = ${dec(l.mul(f))} \\cdot ${dec(w.mul(f))} = ${qty(answer, `${p.small}^2`)}`)}`,
            ),
          });
        }
        // Sides in the small unit, area in the large one.
        const l = Q.of(rng.int(2, 30) * (p.f >= 100 ? 10 : p.f === 10 ? 1 : 3));
        const w = Q.of(rng.int(2, 30) * (p.f >= 100 ? 5 : p.f === 10 ? 1 : 3));
        const area = l.mul(w);
        const answer = area.div(f).div(f);
        return numberProblem({
          prompt: plus(
            t(
              `A rectangle measures $${qty(l, p.small)}$ by $${qty(w, p.small)}$. Find its area in ${p.bigName.en}.`,
              `一个长方形的两边分别是 $${qty(l, p.small)}$ 和 $${qty(w, p.small)}$。求它的面积，以${p.bigName["zh-CN"]}为单位。`,
            ),
            areaNote(p),
          ),
          answer,
          form: "decimal",
          unit: `${p.big}^2`,
          wrong: [area.div(f), area, answer.mul(Q.of(100))],
          solution: t(
            `Convert the sides first:${steps(`${qty(l, p.small)} = ${qty(l.div(f), p.big)}, \\quad ${qty(w, p.small)} = ${qty(w.div(f), p.big)}`, `A = ${dec(l.div(f))} \\cdot ${dec(w.div(f))} = ${qty(answer, `${p.big}^2`)}`)}`,
            `先换算边长：${steps(`${qty(l, p.small)} = ${qty(l.div(f), p.big)}, \\quad ${qty(w, p.small)} = ${qty(w.div(f), p.big)}`, `A = ${dec(l.div(f))} \\cdot ${dec(w.div(f))} = ${qty(answer, `${p.big}^2`)}`)}`,
          ),
        });
      },
    },
  ],
};

// Units in formulas.

const opt = (tex: string) => same(`$${tex}$`);
const per = (a: string, b: string) => tx(`${a}/${b}`);
const times = (a: string, b: string) => `${tx(a)} \\cdot ${tx(b)}`;
const sq = (a: string) => `${tx(a)}^2`;
const cube = (a: string) => `${tx(a)}^3`;
const perCube = (a: string, b: string) => `${tx(`${a}/${b}`)}^3`;

/** FormulaQuestion is one question about the units in a formula: the correct option comes first. */
interface FormulaQuestion {
  readonly prompt: Text;
  readonly options: readonly string[];
  readonly solution: Text;
}

const distanceUnits = ["m", "km", "mi"] as const;
const timeUnits = ["s", "min", "h"] as const;
const lengthUnits = ["mm", "cm", "m", "km", "in", "ft"] as const;
const massUnits = ["g", "kg"] as const;
const goods = ["kg", "lb", "L", "gal"] as const;

/** cancel explains how units cancel in a product or quotient. */
const cancel = (work: string): Text => t(`Treat the units like factors and cancel: $$${work}$$`, `把单位当作因数来约分：$$${work}$$`);

/** resultQuestion asks for the units of the quantity a formula computes. */
function resultQuestion(rng: Rng): FormulaQuestion {
  switch (rng.int(0, 6)) {
    case 0: {
      const [l, s] = [rng.pick(distanceUnits), rng.pick(timeUnits)];
      return {
        prompt: t(
          `In the formula $d = rt$, the speed $r$ is in $${per(l, s)}$ and the time $t$ is in $${tx(s)}$. In what units is the distance $d$?`,
          `在公式 $d = rt$ 中，速度 $r$ 的单位是 $${per(l, s)}$，时间 $t$ 的单位是 $${tx(s)}$。距离 $d$ 的单位是什么？`,
        ),
        options: [tx(l), per(l, s), times(l, s), tx(s)],
        solution: cancel(`\\frac{${tx(l)}}{${tx(s)}} \\cdot ${tx(s)} = ${tx(l)}`),
      };
    }
    case 1: {
      const l = rng.pick(lengthUnits);
      return {
        prompt: t(
          `In the formula $A = lw$ for the area of a rectangle, the length $l$ and the width $w$ are in $${tx(l)}$. In what units is the area $A$?`,
          `在长方形面积公式 $A = lw$ 中，长 $l$ 和宽 $w$ 的单位都是 $${tx(l)}$。面积 $A$ 的单位是什么？`,
        ),
        options: [sq(l), tx(l), cube(l)],
        solution: cancel(`${tx(l)} \\cdot ${tx(l)} = ${sq(l)}`),
      };
    }
    case 2: {
      const l = rng.pick(lengthUnits);
      return {
        prompt: t(
          `In the formula $V = lwh$ for the volume of a box, the length, width and height are in $${tx(l)}$. In what units is the volume $V$?`,
          `在长方体体积公式 $V = lwh$ 中，长、宽、高的单位都是 $${tx(l)}$。体积 $V$ 的单位是什么？`,
        ),
        options: [cube(l), sq(l), tx(l)],
        solution: cancel(`${tx(l)} \\cdot ${tx(l)} \\cdot ${tx(l)} = ${cube(l)}`),
      };
    }
    case 3: {
      const [g, l] = [rng.pick(massUnits), rng.pick(["cm", "m"] as const)];
      return {
        prompt: t(
          `In the formula $m = DV$, the density $D$ is in $${perCube(g, l)}$ and the volume $V$ is in $${cube(l)}$. In what units is the mass $m$?`,
          `在公式 $m = DV$ 中，密度 $D$ 的单位是 $${perCube(g, l)}$，体积 $V$ 的单位是 $${cube(l)}$。质量 $m$ 的单位是什么？`,
        ),
        options: [tx(g), perCube(g, l), `${tx(g)} \\cdot ${cube(l)}`, cube(l)],
        solution: cancel(`\\frac{${tx(g)}}{${cube(l)}} \\cdot ${cube(l)} = ${tx(g)}`),
      };
    }
    case 4: {
      const u = rng.pick(goods);
      return {
        prompt: t(
          `In the formula $C = pn$, the price $p$ is in dollars per $${tx(u)}$ ($\\$/${tx(u)}$) and the amount $n$ is in $${tx(u)}$. In what units is the cost $C$?`,
          `在公式 $C = pn$ 中，单价 $p$ 的单位是美元每 $${tx(u)}$（$\\$/${tx(u)}$），数量 $n$ 的单位是 $${tx(u)}$。总价 $C$ 的单位是什么？`,
        ),
        options: ["\\$", `\\$/${tx(u)}`, `\\$ \\cdot ${tx(u)}`, tx(u)],
        solution: cancel(`\\frac{\\$}{${tx(u)}} \\cdot ${tx(u)} = \\$`),
      };
    }
    case 5: {
      const [l, s] = [rng.pick(distanceUnits), rng.pick(timeUnits)];
      return {
        prompt: t(
          `In the formula $v = \\frac{d}{t}$, the distance $d$ is in $${tx(l)}$ and the time $t$ is in $${tx(s)}$. In what units is the speed $v$?`,
          `在公式 $v = \\frac{d}{t}$ 中，路程 $d$ 的单位是 $${tx(l)}$，时间 $t$ 的单位是 $${tx(s)}$。速度 $v$ 的单位是什么？`,
        ),
        options: [per(l, s), per(s, l), times(l, s), tx(l)],
        solution: cancel(`\\frac{${tx(l)}}{${tx(s)}} = ${per(l, s)}`),
      };
    }
    default: {
      const [g, l] = [rng.pick(massUnits), rng.pick(["cm", "m"] as const)];
      return {
        prompt: t(
          `In the formula $D = \\frac{m}{V}$, the mass $m$ is in $${tx(g)}$ and the volume $V$ is in $${cube(l)}$. In what units is the density $D$?`,
          `在公式 $D = \\frac{m}{V}$ 中，质量 $m$ 的单位是 $${tx(g)}$，体积 $V$ 的单位是 $${cube(l)}$。密度 $D$ 的单位是什么？`,
        ),
        options: [perCube(g, l), `${cube(l)}/${tx(g)}`, `${tx(g)} \\cdot ${cube(l)}`, tx(g)],
        solution: cancel(`\\frac{${tx(g)}}{${cube(l)}} = ${perCube(g, l)}`),
      };
    }
  }
}

/** factorQuestion asks for the units of one of the quantities a formula relates, given the others. */
function factorQuestion(rng: Rng): FormulaQuestion {
  switch (rng.int(0, 5)) {
    case 0: {
      const [l, s] = [rng.pick(distanceUnits), rng.pick(timeUnits)];
      return {
        prompt: t(
          `In the formula $d = rt$, the distance $d$ is in $${tx(l)}$ and the time $t$ is in $${tx(s)}$. In what units is the speed $r$?`,
          `在公式 $d = rt$ 中，距离 $d$ 的单位是 $${tx(l)}$，时间 $t$ 的单位是 $${tx(s)}$。速度 $r$ 的单位是什么？`,
        ),
        options: [per(l, s), per(s, l), times(l, s), tx(l)],
        solution: t(
          `Solve for $r$: $r = \\frac{d}{t}$, so its units are $\\frac{${tx(l)}}{${tx(s)}} = ${per(l, s)}$.`,
          `解出 $r$：$r = \\frac{d}{t}$，所以它的单位是 $\\frac{${tx(l)}}{${tx(s)}} = ${per(l, s)}$。`,
        ),
      };
    }
    case 1: {
      const [l, s] = [rng.pick(distanceUnits), rng.pick(timeUnits)];
      return {
        prompt: t(
          `In the formula $d = rt$, the distance $d$ is in $${tx(l)}$ and the speed $r$ is in $${per(l, s)}$. In what units is the time $t$?`,
          `在公式 $d = rt$ 中，距离 $d$ 的单位是 $${tx(l)}$，速度 $r$ 的单位是 $${per(l, s)}$。时间 $t$ 的单位是什么？`,
        ),
        options: [tx(s), tx(l), per(l, s), per(s, l)],
        solution: t(
          `Solve for $t$: $t = \\frac{d}{r}$, so its units are $${tx(l)} \\div \\frac{${tx(l)}}{${tx(s)}} = ${tx(l)} \\cdot \\frac{${tx(s)}}{${tx(l)}} = ${tx(s)}$.`,
          `解出 $t$：$t = \\frac{d}{r}$，所以它的单位是 $${tx(l)} \\div \\frac{${tx(l)}}{${tx(s)}} = ${tx(l)} \\cdot \\frac{${tx(s)}}{${tx(l)}} = ${tx(s)}$。`,
        ),
      };
    }
    case 2: {
      const l = rng.pick(lengthUnits);
      return {
        prompt: t(
          `In the formula $A = lw$, the area $A$ is in $${sq(l)}$ and the length $l$ is in $${tx(l)}$. In what units is the width $w$?`,
          `在公式 $A = lw$ 中，面积 $A$ 的单位是 $${sq(l)}$，长 $l$ 的单位是 $${tx(l)}$。宽 $w$ 的单位是什么？`,
        ),
        options: [tx(l), sq(l), cube(l)],
        solution: t(
          `Solve for $w$: $w = \\frac{A}{l}$, so its units are $\\frac{${sq(l)}}{${tx(l)}} = ${tx(l)}$.`,
          `解出 $w$：$w = \\frac{A}{l}$，所以它的单位是 $\\frac{${sq(l)}}{${tx(l)}} = ${tx(l)}$。`,
        ),
      };
    }
    case 3: {
      const l = rng.pick(lengthUnits);
      return {
        prompt: t(
          `In the formula $V = Bh$, the volume $V$ is in $${cube(l)}$ and the height $h$ is in $${tx(l)}$. In what units is the base area $B$?`,
          `在公式 $V = Bh$ 中，体积 $V$ 的单位是 $${cube(l)}$，高 $h$ 的单位是 $${tx(l)}$。底面积 $B$ 的单位是什么？`,
        ),
        options: [sq(l), tx(l), cube(l)],
        solution: t(
          `Solve for $B$: $B = \\frac{V}{h}$, so its units are $\\frac{${cube(l)}}{${tx(l)}} = ${sq(l)}$.`,
          `解出 $B$：$B = \\frac{V}{h}$，所以它的单位是 $\\frac{${cube(l)}}{${tx(l)}} = ${sq(l)}$。`,
        ),
      };
    }
    case 4: {
      const u = rng.pick(goods);
      return {
        prompt: t(
          `In the formula $C = pn$, the cost $C$ is in dollars ($\\$$) and the amount $n$ is in $${tx(u)}$. In what units is the price $p$?`,
          `在公式 $C = pn$ 中，总价 $C$ 的单位是美元（$\\$$），数量 $n$ 的单位是 $${tx(u)}$。单价 $p$ 的单位是什么？`,
        ),
        options: [`\\$/${tx(u)}`, `${tx(u)}/\\$`, `\\$ \\cdot ${tx(u)}`, "\\$"],
        solution: t(
          `Solve for $p$: $p = \\frac{C}{n}$, so its units are $\\frac{\\$}{${tx(u)}} = \\$/${tx(u)}$.`,
          `解出 $p$：$p = \\frac{C}{n}$，所以它的单位是 $\\frac{\\$}{${tx(u)}} = \\$/${tx(u)}$。`,
        ),
      };
    }
    default: {
      const [g, l] = [rng.pick(massUnits), rng.pick(["cm", "m"] as const)];
      return {
        prompt: t(
          `In the formula $D = \\frac{m}{V}$, the density $D$ is in $${perCube(g, l)}$ and the mass $m$ is in $${tx(g)}$. In what units is the volume $V$?`,
          `在公式 $D = \\frac{m}{V}$ 中，密度 $D$ 的单位是 $${perCube(g, l)}$，质量 $m$ 的单位是 $${tx(g)}$。体积 $V$ 的单位是什么？`,
        ),
        options: [cube(l), tx(g), perCube(g, l), `${tx(g)} \\cdot ${cube(l)}`],
        solution: t(
          `Solve for $V$: $V = \\frac{m}{D}$, so its units are $${tx(g)} \\div \\frac{${tx(g)}}{${cube(l)}} = ${tx(g)} \\cdot \\frac{${cube(l)}}{${tx(g)}} = ${cube(l)}$.`,
          `解出 $V$：$V = \\frac{m}{D}$，所以它的单位是 $${tx(g)} \\div \\frac{${tx(g)}}{${cube(l)}} = ${tx(g)} \\cdot \\frac{${cube(l)}}{${tx(g)}} = ${cube(l)}$。`,
        ),
      };
    }
  }
}

export const unitsInFormulas: TopicDef = {
  id: "units-in-formulas",
  title: t("Determining Units in Formulas", "确定公式中的单位"),
  summary: t("Find the units of a quantity in a formula by multiplying and dividing units.", "通过单位的乘除确定公式中某个量的单位。"),
  prerequisites: ["unit-rates", "area-of-rectangles-and-squares", "evaluating-expressions"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.Q.A.1"],
  knowledgePoints: [
    {
      id: "units-of-the-result",
      title: t("Units of the result", "结果的单位"),
      explanation: t(
        "Units multiply and divide like factors. In $d = rt$ with $r$ in $\\text{km/h}$ and $t$ in $\\text{h}$, the hours cancel:\n\n$$\\frac{\\text{km}}{\\text{h}} \\cdot \\text{h} = \\text{km}$$\n\nA unit multiplied by itself is squared ($\\text{m} \\cdot \\text{m} = \\text{m}^2$), and a quotient of units is a rate ($\\text{km} \\div \\text{h} = \\text{km/h}$).",
        "单位像因数一样相乘、相除。在 $d = rt$ 中，若 $r$ 的单位是 $\\text{km/h}$，$t$ 的单位是 $\\text{h}$，小时就约掉了：\n\n$$\\frac{\\text{km}}{\\text{h}} \\cdot \\text{h} = \\text{km}$$\n\n单位与自身相乘得到平方（$\\text{m} \\cdot \\text{m} = \\text{m}^2$），单位相除得到比率（$\\text{km} \\div \\text{h} = \\text{km/h}$）。",
      ),
      generate(rng) {
        const f = resultQuestion(rng);
        return choices(rng, f.prompt, f.options.map(opt), f.solution);
      },
    },
    {
      id: "units-of-a-factor",
      title: t("Units of another quantity", "其他量的单位"),
      explanation: t(
        "To find the units of a quantity that is not alone on one side, solve the formula for it and work out the units the same way. In $d = rt$ with $d$ in $\\text{mi}$ and $t$ in $\\text{h}$, $r = \\frac{d}{t}$ is in\n\n$$\\frac{\\text{mi}}{\\text{h}} = \\text{mi/h}$$",
        "要确定公式中不单独在一边的量的单位，先把公式变形，解出这个量，再同样计算单位。在 $d = rt$ 中，若 $d$ 的单位是 $\\text{mi}$，$t$ 的单位是 $\\text{h}$，那么 $r = \\frac{d}{t}$ 的单位是\n\n$$\\frac{\\text{mi}}{\\text{h}} = \\text{mi/h}$$",
      ),
      generate(rng) {
        const f = factorQuestion(rng);
        return choices(rng, f.prompt, f.options.map(opt), f.solution);
      },
    },
  ],
};

// Rates of change.

/** Change is a quantity that changes over time, for rate-of-change problems. */
interface Change {
  readonly what: Text;
  /** unit is the unit of the quantity: plural and singular in English, and Chinese. */
  readonly unit: readonly [string, string, string];
  /** time is the unit of time: plural and singular in English, Chinese for counts and Chinese for rates. */
  readonly time: readonly [string, string, string, string];
  readonly trend: -1 | 0 | 1;
}

const hours = ["hours", "hour", "小时", "小时"] as const;
const weeks = ["weeks", "week", "周", "周"] as const;
const changes: readonly Change[] = [
  { what: t("the height of a candle", "蜡烛的高度"), unit: ["centimeters", "centimeter", "厘米"], time: hours, trend: -1 },
  { what: t("the height of a plant", "植物的高度"), unit: ["centimeters", "centimeter", "厘米"], time: weeks, trend: 1 },
  { what: t("the water in a tank", "水箱里的水"), unit: ["liters", "liter", "升"], time: ["minutes", "minute", "分钟", "分钟"], trend: 0 },
  {
    what: t("the balance of a savings account", "储蓄账户的余额"),
    unit: ["dollars", "dollar", "美元"],
    time: ["months", "month", "个月", "月"],
    trend: 0,
  },
  { what: t("the temperature", "气温"), unit: ["degrees Celsius", "degree Celsius", "摄氏度"], time: hours, trend: 0 },
  { what: t("the mass of a puppy", "小狗的体重"), unit: ["kilograms", "kilogram", "千克"], time: weeks, trend: 1 },
  { what: t("the distance from home", "离家的距离"), unit: ["kilometers", "kilometer", "千米"], time: hours, trend: 0 },
  { what: t("the population of a town", "小镇的人口"), unit: ["people", "person", "人"], time: ["years", "year", "年", "年"], trend: 0 },
  {
    what: t("the depth of the snow", "积雪的深度"),
    unit: ["centimeters", "centimeter", "厘米"],
    time: ["days", "day", "天", "天"],
    trend: 0,
  },
];

/** ChangeData is a change drawn for a problem: the quantity is y1 at time x1 and y2 at time x2, changing by k per unit of time. */
interface ChangeData {
  readonly c: Change;
  readonly x1: number;
  readonly x2: number;
  readonly y1: number;
  readonly y2: number;
  readonly k: number;
}

function drawChange(rng: Rng): ChangeData {
  const c = rng.pick(changes);
  const x1 = rng.int(1, 6);
  const x2 = x1 + rng.int(2, 6);
  const size = c.unit[0] === "people" ? rng.int(10, 90) : rng.int(1, 9);
  const k = (c.trend === 0 ? rng.sign() : c.trend) * size;
  const y1 = rng.int(10, 60) * (size >= 10 ? 20 : 1) + (k < 0 ? -k * (x2 - x1) : 0);
  return { c, x1, x2, y1, y2: y1 + k * (x2 - x1), k };
}

/** changePrompt describes the quantity at two times. */
function changePrompt(d: ChangeData): Text {
  const { c, x1, x2, y1, y2 } = d;
  const [many, one, zh] = c.time;
  const when = (x: number) => `$${x}$ ${x === 1 ? one : many}`;
  return t(
    `After ${when(x1)}, ${c.what.en} is $${y1}$ ${c.unit[0]}; after ${when(x2)}, it is $${y2}$ ${c.unit[0]}.`,
    `$${x1}$ ${zh}后，${c.what["zh-CN"]}是 $${y1}$ ${c.unit[2]}；$${x2}$ ${zh}后是 $${y2}$ ${c.unit[2]}。`,
  );
}

const rateLatex = (d: ChangeData) =>
  `\\frac{${d.y2} - ${paren(d.y1)}}{${d.x2} - ${d.x1}} = \\frac{${d.y2 - d.y1}}{${d.x2 - d.x1}} = ${d.k}`;

export const unitsOfRatesOfChange: TopicDef = {
  id: "units-of-rates-of-change",
  title: t("Selecting Units for Rates of Change", "变化率的单位"),
  summary: t("Find a rate of change between two times and give it the right units.", "求两个时刻之间的变化率，并写出正确的单位。"),
  prerequisites: ["units-in-formulas"],
  encompasses: [
    { topic: "units-in-formulas", weight: 0.3 },
    { topic: "unit-rates", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSN.Q.A.1", "CCSS.HSF.IF.B.6"],
  knowledgePoints: [
    {
      id: "choosing-units-of-a-rate",
      title: t("Units of a rate of change", "变化率的单位"),
      explanation: t(
        "The **rate of change** of a quantity is how much it changes per unit of time:\n\n$$\\text{rate of change} = \\frac{\\text{change in the quantity}}{\\text{change in time}}$$\n\nIts units are the units of the quantity divided by the units of time. If a candle's height is measured in centimeters and time in hours, the rate of change is in **centimeters per hour** (cm/h), not hours per centimeter.",
        "一个量的**变化率**是它每单位时间变化多少：\n\n$$\\text{变化率} = \\frac{\\text{量的变化}}{\\text{时间的变化}}$$\n\n它的单位是量的单位除以时间的单位。如果蜡烛的高度以厘米计、时间以小时计，变化率的单位就是**厘米/小时**（cm/h），而不是小时/厘米。",
      ),
      generate(rng) {
        const d = drawChange(rng);
        const { c } = d;
        const [many, one, , zhRate] = c.time;
        const [unitMany, unitOne, unitZh] = c.unit;
        const prompt = changePrompt(d);
        return choices(
          rng,
          t(
            `${prompt.en} In which units is the rate of change of ${c.what.en} measured?`,
            `${prompt["zh-CN"]}${c.what["zh-CN"]}的变化率用什么单位？`,
          ),
          [
            t(`${unitMany} per ${one}`, `${unitZh}/${zhRate}`),
            t(`${many} per ${unitOne}`, `${zhRate}/${unitZh}`),
            t(unitMany, unitZh),
            t(many, zhRate),
          ],
          t(
            `The rate of change is the change in ${c.what.en} divided by the change in time, so its units are ${unitMany} divided by ${many}: ${unitMany} per ${one}.`,
            `变化率是${c.what["zh-CN"]}的变化除以时间的变化，所以单位是${unitZh}除以${zhRate}：${unitZh}/${zhRate}。`,
          ),
        );
      },
    },
    {
      id: "finding-a-rate-of-change",
      title: t("Finding a rate of change", "求变化率"),
      explanation: t(
        "Divide the change in the quantity by the change in time, subtracting in the same order. A quantity that decreases has a **negative** rate of change. If a candle is $18$ cm tall after $2$ hours and $12$ cm tall after $5$ hours:\n\n$$\\frac{12 - 18}{5 - 2} = \\frac{-6}{3} = -2 \\text{ cm/h}$$",
        "用量的变化除以时间的变化，两次相减的顺序要一致。减少的量的变化率是**负数**。如果蜡烛 $2$ 小时后高 $18$ cm，$5$ 小时后高 $12$ cm：\n\n$$\\frac{12 - 18}{5 - 2} = \\frac{-6}{3} = -2 \\text{ cm/h}$$",
      ),
      generate(rng) {
        const d = drawChange(rng);
        const { c } = d;
        const prompt = changePrompt(d);
        return numberProblem({
          prompt: t(
            `${prompt.en} Find the rate of change of ${c.what.en}, in ${c.unit[0]} per ${c.time[1]}.`,
            `${prompt["zh-CN"]}求${c.what["zh-CN"]}的变化率，单位是${c.unit[2]}/${c.time[3]}。`,
          ),
          answer: d.k,
          wrong: [-d.k, d.y2 - d.y1, q(d.x2 - d.x1, d.y2 - d.y1), q(d.y2, d.x2)],
          solution: t(
            `Divide the change in ${c.what.en} by the change in time:${steps(rateLatex(d))}`,
            `用${c.what["zh-CN"]}的变化除以时间的变化：${steps(rateLatex(d))}`,
          ),
        });
      },
    },
  ],
};

// Degrees of accuracy.

const placeNames: readonly Text[] = [t("whole number", "个位"), t("tenth", "十分位"), t("hundredth", "百分位"), t("thousandth", "千分位")];

/** Share is a measured amount divided into equal parts. */
interface Share {
  readonly sym: string;
  readonly unit: Text;
  readonly text: (total: string, n: number, precision: Text) => Text;
}

const shares: readonly Share[] = [
  {
    sym: "m",
    unit: t("meter", "米"),
    text: (total, n, p) =>
      t(
        `A rope is measured as $${total}\\text{ m}$ long, ${p.en}. It is cut into $${n}$ equal pieces. How long is each piece, to the same degree of accuracy?`,
        `一根绳子测得长 $${total}\\text{ m}$，${p["zh-CN"]}。把它平均剪成 $${n}$ 段。每段长多少？结果保留同样的精确度。`,
      ),
  },
  {
    sym: "kg",
    unit: t("kilogram", "千克"),
    text: (total, n, p) =>
      t(
        `A sack of rice is weighed as $${total}\\text{ kg}$, ${p.en}. The rice is shared equally among $${n}$ bags. How much rice goes into each bag, to the same degree of accuracy?`,
        `一袋大米称得 $${total}\\text{ kg}$，${p["zh-CN"]}。把大米平均分装到 $${n}$ 个袋子里。每袋装多少？结果保留同样的精确度。`,
      ),
  },
  {
    sym: "km",
    unit: t("kilometer", "千米"),
    text: (total, n, p) =>
      t(
        `A hiking trail is measured as $${total}\\text{ km}$ long, ${p.en}. It is divided into $${n}$ stages of equal length. How long is each stage, to the same degree of accuracy?`,
        `一条徒步路线测得长 $${total}\\text{ km}$，${p["zh-CN"]}。把它分成长度相等的 $${n}$ 段。每段长多少？结果保留同样的精确度。`,
      ),
  },
];

/** precisionText says how precisely a measurement was made: "to the nearest 0.1 m". */
function precisionText(step: Q, sym: string, unitName: Text): Text {
  return step.eq(Q.one)
    ? t(`to the nearest ${unitName.en}`, `精确到 $1\\text{ ${sym}}$`)
    : t(`to the nearest $${dec(step)}\\text{ ${sym}}$`, `精确到 $${dec(step)}\\text{ ${sym}}$`);
}

/** Measured is a measurement for problems on the bounds of a measurement. */
interface Measured {
  readonly sym: string;
  readonly unit: Text;
  readonly what: Text;
  readonly noun: Text;
}

const measured: readonly Measured[] = [
  { sym: "cm", unit: t("centimeter", "厘米"), what: t("The length of a table", "一张桌子的长度"), noun: t("length", "长度") },
  { sym: "kg", unit: t("kilogram", "千克"), what: t("The mass of a parcel", "一个包裹的质量"), noun: t("mass", "质量") },
  { sym: "s", unit: t("second", "秒"), what: t("The time of a race", "一场赛跑的用时"), noun: t("time", "用时") },
];

export const degreesOfAccuracy: TopicDef = {
  id: "degrees-of-accuracy",
  title: t("Degrees of Accuracy", "精确度"),
  summary: t(
    "Round to a given place, give results to the accuracy of the measurements, and find the bounds of a measurement.",
    "按要求的数位取近似值，按测量的精确度给出结果，求测量值的上下界。",
  ),
  prerequisites: ["unit-rates"],
  encompasses: [
    { topic: "unit-rates", weight: 0.2 },
    { topic: "decimal-arithmetic", weight: 0.1 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.Q.A.3"],
  knowledgePoints: [
    {
      id: "rounding-decimals",
      title: t("Rounding decimals", "小数的四舍五入"),
      explanation: t(
        "To round to a place, look at the digit just to its right. If it is $5$ or more, round up: add one to the digit in the place. Otherwise round down. Then drop every digit after the place.\n\n$$3.4961 \\approx 3.50 \\text{ (nearest hundredth)}, \\qquad 3.4961 \\approx 3.5 \\text{ (nearest tenth)}, \\qquad 3.4961 \\approx 3 \\text{ (nearest whole number)}$$",
        "要四舍五入到某一位，看它右边紧挨着的那一位数字。如果是 $5$ 或更大，就进一：这一位加一；否则舍去。然后去掉这一位后面的所有数字。\n\n$$3.4961 \\approx 3.50 \\text{（精确到百分位）}, \\qquad 3.4961 \\approx 3.5 \\text{（精确到十分位）}, \\qquad 3.4961 \\approx 3 \\text{（精确到个位）}$$",
      ),
      generate(rng) {
        const v = q(rng.int(10001, 999999), 10000);
        const p = rng.int(0, 3);
        const answer = roundTo(v, p);
        const name = placeNames[p]!;
        return numberProblem({
          prompt: t(`Round $${dec(v)}$ to the nearest ${name.en}.`, `把 $${dec(v)}$ 四舍五入到${name["zh-CN"]}。`),
          answer,
          form: "decimal",
          wrong: [truncTo(v, p), roundTo(v, p + 1), ...(p > 0 ? [roundTo(v, p - 1)] : [])],
          solution: t(
            `The digit after the ${name.en} place decides:${steps(`${dec(v)} \\approx ${fixed(answer, p)}`)}`,
            `看${name["zh-CN"]}后面一位的数字：${steps(`${dec(v)} \\approx ${fixed(answer, p)}`)}`,
          ),
        });
      },
    },
    {
      id: "results-to-the-accuracy-of-the-data",
      title: t("Results to the accuracy of the data", "按数据的精确度给出结果"),
      explanation: t(
        "A calculation cannot make a measurement more accurate. When a length is measured to the nearest $0.1$ m, a length calculated from it should also be given to the nearest $0.1$ m. A $4.3$ m rope cut into $3$ equal pieces gives\n\n$$4.3 \\div 3 = 1.4333\\ldots \\approx 1.4\\text{ m}$$\n\nWriting $1.433$ m would claim an accuracy the measurement does not have.",
        "计算不能使测量变得更精确。长度精确到 $0.1$ m 时，由它算出的长度也应精确到 $0.1$ m。把 $4.3$ m 长的绳子平均剪成 $3$ 段：\n\n$$4.3 \\div 3 = 1.4333\\ldots \\approx 1.4\\text{ m}$$\n\n写成 $1.433$ m 就表示了测量本身并不具备的精确度。",
      ),
      keyPrerequisites: ["unit-rates"],
      generate(rng) {
        const s = rng.pick(shares);
        const p = rng.int(0, 2);
        const scale = 10 ** p;
        const total = q(rng.int(2 * scale, 60 * scale), scale);
        const n = rng.int(3, 9);
        const exact = total.div(Q.of(n));
        const answer = roundTo(exact, p);
        const step = q(1, scale);
        return numberProblem({
          prompt: s.text(fixed(total, p), n, precisionText(step, s.sym, s.unit)),
          answer,
          form: "decimal",
          unit: s.sym,
          wrong: [roundTo(exact, p + 1), roundTo(exact, p + 2), truncTo(exact, p), ...(p > 0 ? [roundTo(exact, p - 1)] : [])],
          solution: t(
            `The measurement is to the nearest $${dec(step)}\\text{ ${s.sym}}$, so round the result to that place:${steps(`${fixed(total, p)} \\div ${n} = ${dec(truncTo(exact, p + 3))}\\ldots \\approx ${fixed(answer, p)}\\text{ ${s.sym}}`)}`,
            `测量精确到 $${dec(step)}\\text{ ${s.sym}}$，所以结果也取到这一位：${steps(`${fixed(total, p)} \\div ${n} = ${dec(truncTo(exact, p + 3))}\\ldots \\approx ${fixed(answer, p)}\\text{ ${s.sym}}`)}`,
          ),
        });
      },
    },
    {
      id: "bounds-of-a-measurement",
      title: t("Bounds of a measurement", "测量值的上下界"),
      explanation: t(
        "A measurement rounded to the nearest unit can be off by up to half a unit. A length of $8.4$ cm measured to the nearest $0.1$ cm is at least $8.35$ cm and less than $8.45$ cm:\n\n$$8.35 \\le \\text{length} < 8.45$$\n\nThe **lower bound** is the measurement minus half the unit of accuracy; the **upper bound** is the measurement plus half of it.",
        "精确到某个单位的测量值，误差最多是半个单位。精确到 $0.1$ cm 测得的长度 $8.4$ cm，实际至少是 $8.35$ cm，并且小于 $8.45$ cm：\n\n$$8.35 \\le \\text{长度} < 8.45$$\n\n**下界**是测量值减去精确单位的一半；**上界**是测量值加上精确单位的一半。",
      ),
      generate(rng) {
        const m = rng.pick(measured);
        const p = rng.int(-1, 2);
        const step = p < 0 ? Q.of(10) : q(1, 10 ** p);
        const v = step.mul(Q.of(rng.int(p < 0 ? 3 : 11, p < 0 ? 40 : 999)));
        const half = step.div(Q.of(2));
        const lower = rng.bool();
        const answer = lower ? v.sub(half) : v.add(half);
        const shown = fixed(v, Math.max(p, 0));
        return numberProblem({
          prompt: t(
            `${m.what.en} is measured as $${shown}\\text{ ${m.sym}}$, ${precisionText(step, m.sym, m.unit).en}. ${lower ? `What is the least possible actual ${m.noun.en}?` : `The actual ${m.noun.en} is less than what value?`}`,
            `${m.what["zh-CN"]}测得 $${shown}\\text{ ${m.sym}}$，${precisionText(step, m.sym, m.unit)["zh-CN"]}。${lower ? `实际${m.noun["zh-CN"]}最小可能是多少？` : `实际${m.noun["zh-CN"]}小于多少？`}`,
          ),
          answer,
          form: "decimal",
          unit: m.sym,
          wrong: lower ? [v.sub(step), v.add(half)] : [v.add(step), v.sub(half)],
          solution: t(
            `Half of $${dec(step)}$ is $${dec(half)}$, so${steps(`${dec(v.sub(half))} \\le \\text{${m.noun.en}} < ${dec(v.add(half))}`)}`,
            `$${dec(step)}$ 的一半是 $${dec(half)}$，所以${steps(`${dec(v.sub(half))} \\le \\text{${m.noun["zh-CN"]}} < ${dec(v.add(half))}`)}`,
          ),
        });
      },
    },
  ],
};

// Direct variation.

/** points writes ordered pairs in both languages: "(2, 6), (3, 9)". */
function points(xs: readonly (readonly [Coefficient, Coefficient])[]): Text {
  const each = xs.map(([x, y]) => `$(${num(x)}, ${num(y)})$`);
  return t(each.join(", "), each.join("、"));
}

/** quotient writes y/x, followed by its value when that is written differently: "\\frac{6}{2} = 3". */
function quotient(y: number, x: number): string {
  const v = num(q(y, x));
  const raw = `\\frac{${y}}{${x}}`;
  return v === raw ? raw : `${raw} = ${v}`;
}

/** variationData draws x ≠ 0 and a constant k ≠ ±1 with y = kx a whole number. */
function variationData(rng: Rng): { x: number; k: Q; y: Q } {
  if (rng.bool(0.6)) {
    const k = Q.of(rng.sign() * rng.int(2, 9));
    const x = rng.sign() * rng.int(2, 12);
    return { x, k, y: k.mul(Q.of(x)) };
  }
  const d = rng.int(2, 4);
  const k = q(rng.sign() * rng.pick(range(1, 9).filter((n) => gcd(n, d) === 1)), d);
  const x = rng.sign() * d * rng.int(1, 4);
  return { x, k, y: k.mul(Q.of(x)) };
}

export const directVariation: TopicDef = {
  id: "direct-variation",
  title: t("Direct Variation", "正比例关系"),
  summary: t(
    "Recognize direct variation, find the constant of variation and write the equation y = kx.",
    "识别正比例关系，求比例常数，写出方程 y = kx。",
  ),
  prerequisites: ["proportions"],
  encompasses: [{ topic: "proportions", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.7.RP.A.2"],
  knowledgePoints: [
    {
      id: "recognizing-direct-variation",
      title: t("Recognizing direct variation", "识别正比例关系"),
      explanation: t(
        "$y$ **varies directly** with $x$ when $y = kx$ for some constant $k \\ne 0$, the **constant of variation**. Then the ratio $\\frac{y}{x}$ is the same for every pair with $x \\ne 0$, and the graph is a line through the origin.\n\nThe points $(2, 6)$, $(3, 9)$, $(5, 15)$ show direct variation: $\\frac{6}{2} = \\frac{9}{3} = \\frac{15}{5} = 3$. The points $(1, 5)$, $(2, 7)$, $(3, 9)$ do not: $\\frac{5}{1} \\ne \\frac{7}{2}$, even though $y$ grows steadily.",
        "如果 $y = kx$，其中 $k \\ne 0$ 是常数，就说 $y$ 与 $x$ **成正比例**，$k$ 叫做**比例常数**。这时对每一组 $x \\ne 0$ 的数对，比值 $\\frac{y}{x}$ 都相同，图像是过原点的直线。\n\n点 $(2, 6)$、$(3, 9)$、$(5, 15)$ 成正比例：$\\frac{6}{2} = \\frac{9}{3} = \\frac{15}{5} = 3$。点 $(1, 5)$、$(2, 7)$、$(3, 9)$ 不成正比例：$\\frac{5}{1} \\ne \\frac{7}{2}$，尽管 $y$ 均匀增长。",
      ),
      generate(rng) {
        const xs = rng.sample(range(1, 10), 3).sort((a, b) => a - b);
        const k = rng.int(2, 9);
        const direct = rng.bool();
        const b = rng.nonZero(-5, 5);
        const ys = xs.map((x) => (direct ? k * x : k * x + b));
        const pts = xs.map((x, i) => [x, ys[i]!] as const);
        const ratios = pts.map(([x, y]) => quotient(y, x)).join(", \\quad ");
        return choiceProblem({
          prompt: t(
            `The points ${points(pts).en} show how $y$ depends on $x$. Does $y$ vary directly with $x$?`,
            `点 ${points(pts)["zh-CN"]} 表示 $y$ 随 $x$ 变化的情况。$y$ 与 $x$ 成正比例吗？`,
          ),
          options: yesNo,
          correct: direct ? 0 : 1,
          solution: t(
            `Compare the ratios $\\frac{y}{x}$:${steps(ratios)}${direct ? `They are all equal, so $y = ${k}x$: yes.` : "They are not all equal: no."}`,
            `比较比值 $\\frac{y}{x}$：${steps(ratios)}${direct ? `它们都相等，所以 $y = ${k}x$：是。` : "它们不全相等：否。"}`,
          ),
        });
      },
    },
    {
      id: "constant-of-direct-variation",
      title: t("The constant of variation", "比例常数"),
      explanation: t(
        "If $y$ varies directly with $x$, then $k = \\frac{y}{x}$ for any pair of values with $x \\ne 0$. If $y = 18$ when $x = 4$:\n\n$$k = \\frac{18}{4} = \\frac{9}{2}$$\n\nDivide $y$ by $x$, not $x$ by $y$.",
        "如果 $y$ 与 $x$ 成正比例，那么对任何一组 $x \\ne 0$ 的值，$k = \\frac{y}{x}$。若 $x = 4$ 时 $y = 18$：\n\n$$k = \\frac{18}{4} = \\frac{9}{2}$$\n\n是 $y$ 除以 $x$，不是 $x$ 除以 $y$。",
      ),
      generate(rng) {
        const { x, k, y } = variationData(rng);
        return numberProblem({
          prompt: t(
            `$y$ varies directly with $x$, and $y = ${num(y)}$ when $x = ${x}$. Find the constant of variation $k$.`,
            `$y$ 与 $x$ 成正比例，当 $x = ${x}$ 时 $y = ${num(y)}$。求比例常数 $k$。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(x).div(y), y.sub(Q.of(x)), y.mul(Q.of(x))],
          solution: same(steps(`k = \\frac{y}{x} = ${quotient(Number(y.n), x)}`)),
        });
      },
    },
    {
      id: "writing-direct-variation-equations",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        "To write the equation of a direct variation, find $k = \\frac{y}{x}$ from a known pair and substitute it into $y = kx$. If $y = 15$ when $x = 6$, then $k = \\frac{15}{6} = \\frac{5}{2}$ and\n\n$$y = \\frac{5}{2}x$$",
        "要写出正比例关系的方程，由一组已知的值求出 $k = \\frac{y}{x}$，代入 $y = kx$。若 $x = 6$ 时 $y = 15$，则 $k = \\frac{15}{6} = \\frac{5}{2}$，\n\n$$y = \\frac{5}{2}x$$",
      ),
      generate(rng) {
        const { x, k, y } = variationData(rng);
        return equationProblem("y", {
          prompt: t(
            `$y$ varies directly with $x$, and $y = ${num(y)}$ when $x = ${x}$. Write an equation for $y$ in terms of $x$.`,
            `$y$ 与 $x$ 成正比例，当 $x = ${x}$ 时 $y = ${num(y)}$。写出用 $x$ 表示 $y$ 的方程。`,
          ),
          answer: linear(k, 0),
          wrong: [linear(Q.of(x).div(y), 0), linear(1, y.sub(Q.of(x))), linear(y, 0)],
          solution: same(steps(`k = ${quotient(Number(y.n), x)}`, `y = ${linear(k, 0)}`)),
        });
      },
    },
  ],
};

/** DirectContext is a real-world direct variation y = kx, with its variables, units and wording. */
interface DirectContext {
  readonly y: string;
  readonly x: string;
  readonly k: (rng: Rng) => Q;
  /** setup states that y varies directly with x and gives one pair. */
  readonly setup: (x: number, y: Q) => Text;
  /** askY asks for y at another x; askX asks for x at another y. */
  readonly askY: (x: number) => Text;
  readonly askX: (y: Q) => Text;
}

const directContexts: readonly DirectContext[] = [
  {
    y: "C",
    x: "w",
    k: (rng) => q(rng.int(16, 50), 2),
    setup: (x, y) =>
      t(
        `The cost $C$ (in dollars) of cheese varies directly with its weight $w$ (in kilograms). $${x}$ kg of cheese costs $\\$${money(y)}$.`,
        `奶酪的价格 $C$（元）与重量 $w$（千克）成正比例。$${x}$ kg 奶酪 $${money(y)}$ 元。`,
      ),
    askY: (x) => t(`How many dollars do $${x}$ kg cost?`, `$${x}$ kg 奶酪多少元？`),
    askX: (y) => t(`How many kilograms can be bought for $\\$${money(y)}$?`, `$${money(y)}$ 元能买多少千克？`),
  },
  {
    y: "d",
    x: "t",
    k: (rng) => Q.of(rng.int(8, 24) * 5),
    setup: (x, y) =>
      t(
        `A train runs at a constant speed, so the distance $d$ (in km) it travels varies directly with the time $t$ (in hours). It travels $${dec(y)}$ km in $${x}$ hours.`,
        `一列火车匀速行驶，所以行驶的路程 $d$（千米）与时间 $t$（小时）成正比例。它 $${x}$ 小时行驶 $${dec(y)}$ km。`,
      ),
    askY: (x) => t(`How many kilometers does it travel in $${x}$ hours?`, `它 $${x}$ 小时行驶多少千米？`),
    askX: (y) => t(`How many hours does it take to travel $${dec(y)}$ km?`, `行驶 $${dec(y)}$ km 需要多少小时？`),
  },
  {
    y: "P",
    x: "h",
    k: (rng) => q(rng.int(48, 100), 4),
    setup: (x, y) =>
      t(
        `A worker's pay $P$ (in dollars) varies directly with the number of hours $h$ worked. For $${x}$ hours the pay is $\\$${money(y)}$.`,
        `一名工人的工资 $P$（元）与工作的小时数 $h$ 成正比例。工作 $${x}$ 小时的工资是 $${money(y)}$ 元。`,
      ),
    askY: (x) => t(`How many dollars is the pay for $${x}$ hours?`, `工作 $${x}$ 小时的工资是多少元？`),
    askX: (y) => t(`How many hours must the worker work to earn $\\$${money(y)}$?`, `要挣 $${money(y)}$ 元需要工作多少小时？`),
  },
  {
    y: "V",
    x: "t",
    k: (rng) => q(rng.int(6, 50), 2),
    setup: (x, y) =>
      t(
        `A tank is filled at a steady rate, so the volume $V$ of water (in liters) varies directly with the time $t$ (in minutes). After $${x}$ minutes the tank holds $${dec(y)}$ liters.`,
        `以稳定的速度向水箱注水，所以水的体积 $V$（升）与时间 $t$（分钟）成正比例。$${x}$ 分钟后水箱里有 $${dec(y)}$ 升水。`,
      ),
    askY: (x) => t(`How many liters does it hold after $${x}$ minutes?`, `$${x}$ 分钟后水箱里有多少升水？`),
    askX: (y) => t(`After how many minutes does it hold $${dec(y)}$ liters?`, `多少分钟后水箱里有 $${dec(y)}$ 升水？`),
  },
];

/** directData draws a context with two different whole-number values of x. */
function directData(rng: Rng) {
  const c = rng.pick(directContexts);
  const k = c.k(rng);
  const x1 = rng.int(2, 9);
  const x2 = rng.pick(range(2, 20).filter((x) => x !== x1));
  return { c, k, x1, x2, y1: k.mul(Q.of(x1)), y2: k.mul(Q.of(x2)) };
}

export const modelingWithDirectVariation: TopicDef = {
  id: "modeling-with-direct-variation",
  title: t("Modeling With Direct Variation", "用正比例关系建模"),
  summary: t("Write and use direct-variation models of real situations.", "写出并使用实际情境中的正比例模型。"),
  prerequisites: ["direct-variation", "unit-rates"],
  encompasses: [
    { topic: "direct-variation", weight: 0.5 },
    { topic: "unit-rates", weight: 0.5 },
    { topic: "proportions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.7.RP.A.2.C"],
  knowledgePoints: [
    {
      id: "writing-direct-variation-models",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        "In a real situation, the constant of variation is a unit rate with units. If $3$ kg of cheese costs $\\$37.50$, then\n\n$$k = \\frac{37.50}{3} = 12.5 \\text{ dollars per kilogram}, \\qquad C = 12.5w$$",
        "在实际情境中，比例常数是带单位的单位率。如果 $3$ kg 奶酪 $37.5$ 元，那么\n\n$$k = \\frac{37.5}{3} = 12.5 \\text{ 元/千克}, \\qquad C = 12.5w$$",
      ),
      generate(rng) {
        const { c, k, x1, y1 } = directData(rng);
        const setup = c.setup(x1, y1);
        return equationProblem(c.y, {
          prompt: t(
            `${setup.en} Write an equation for $${c.y}$ in terms of $${c.x}$.`,
            `${setup["zh-CN"]}写出用 $${c.x}$ 表示 $${c.y}$ 的方程。`,
          ),
          answer: `${dec(k)}${c.x}`,
          wrong: [linear(Q.of(x1).div(y1), 0, c.x), `${dec(y1)}${c.x}`, `${c.x} + ${dec(k)}`],
          solution: t(
            `${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`, `${c.y} = ${dec(k)}${c.x}`)}`,
            `${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`, `${c.y} = ${dec(k)}${c.x}`)}`,
          ),
        });
      },
    },
    {
      id: "predicting-with-direct-variation",
      title: t("Predicting a value", "预测数值"),
      explanation: t(
        "Find $k$ from the known pair, then multiply. If $3$ kg of cheese costs $\\$37.50$, then $k = 12.5$ and $5$ kg costs\n\n$$C = 12.5 \\cdot 5 = 62.5$$\n\nthat is, $\\$62.50$. Adding the same amount ($37.50 + 2$) is not how direct variation works: doubling $w$ doubles $C$.",
        "由已知的一组值求出 $k$，再相乘。如果 $3$ kg 奶酪 $37.5$ 元，那么 $k = 12.5$，$5$ kg 的价格是\n\n$$C = 12.5 \\cdot 5 = 62.5$$\n\n即 $62.5$ 元。正比例关系不是加上同一个数（$37.5 + 2$）：$w$ 变为两倍，$C$ 也变为两倍。",
      ),
      generate(rng) {
        const { c, k, x1, x2, y1, y2 } = directData(rng);
        const setup = c.setup(x1, y1);
        const ask = c.askY(x2);
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: y2,
          form: "decimal",
          wrong: [y1.add(Q.of(x2 - x1)), y1.mul(Q.of(x2)), y1.mul(Q.of(x1)).div(Q.of(x2))],
          solution: t(
            `${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`, `${c.y} = ${dec(k)} \\cdot ${x2} = ${dec(y2)}`)}`,
            `${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`, `${c.y} = ${dec(k)} \\cdot ${x2} = ${dec(y2)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-input",
      title: t("Finding the input", "求自变量"),
      explanation: t(
        "To find the input that gives a known output, substitute into $y = kx$ and solve by dividing by $k$. With $C = 12.5w$, the weight of cheese that costs $\\$100$ is\n\n$$100 = 12.5w \\quad\\Rightarrow\\quad w = \\frac{100}{12.5} = 8 \\text{ kg}$$",
        "要求得到已知输出的输入，代入 $y = kx$，两边除以 $k$。由 $C = 12.5w$，$100$ 元能买的奶酪重量是\n\n$$100 = 12.5w \\quad\\Rightarrow\\quad w = \\frac{100}{12.5} = 8 \\text{ kg}$$",
      ),
      keyPrerequisites: ["one-step-equations-multiplication"],
      generate(rng) {
        const { c, k, x1, x2, y1, y2 } = directData(rng);
        const setup = c.setup(x1, y1);
        const ask = c.askX(y2);
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: x2,
          wrong: [y2.mul(k), k.div(y2), y2.sub(y1).add(Q.of(x1))],
          solution: t(
            `${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`, `${dec(y2)} = ${dec(k)}${c.x}`, `${c.x} = \\frac{${dec(y2)}}{${dec(k)}} = ${x2}`)}`,
            `${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`, `${dec(y2)} = ${dec(k)}${c.x}`, `${c.x} = \\frac{${dec(y2)}}{${dec(k)}} = ${x2}`)}`,
          ),
        });
      },
    },
  ],
};

// Inverse variation.

/** divisors lists the positive divisors of n between lo and hi. */
const divisors = (n: number, lo: number, hi: number) => range(lo, hi).filter((d) => n % d === 0);

/** inverseFraction writes k/x: "\frac{24}{x}", "-\frac{24}{x}". */
const inverseFraction = (k: number, x = "x") => `${k < 0 ? "-" : ""}\\frac{${Math.abs(k)}}{${x}}`;

/** inverseData draws x ≠ 0 and y with |x|, |y| ≥ 2, and k = xy. */
function inverseData(rng: Rng): { x: number; y: number; k: number } {
  const x = rng.sign() * rng.int(2, 12);
  const y = rng.sign() * rng.int(2, 15);
  return { x, y, k: x * y };
}

export const inverseVariation: TopicDef = {
  id: "inverse-variation",
  title: t("Inverse Variation", "反比例关系"),
  summary: t(
    "Recognize inverse variation, find the constant k = xy, write y = k/x and use it.",
    "识别反比例关系，求常数 k = xy，写出 y = k/x 并加以运用。",
  ),
  prerequisites: ["direct-variation"],
  encompasses: [
    { topic: "one-step-equations-multiplication", weight: 0.2 },
    { topic: "direct-variation", weight: 0.2 },
  ],
  xp: 15,
  knowledgePoints: [
    {
      id: "recognizing-inverse-variation",
      title: t("Recognizing inverse variation", "识别反比例关系"),
      explanation: t(
        "$y$ **varies inversely** with $x$ when $y = \\frac{k}{x}$ for a constant $k \\ne 0$, that is, when the **product** $xy = k$ is the same for every pair. When $x$ doubles, $y$ is halved.\n\nTo classify a set of points, compute the ratios $\\frac{y}{x}$ and the products $xy$: equal ratios mean direct variation, equal products inverse variation. The points $(2, 12)$, $(3, 8)$, $(4, 6)$ vary inversely: $2 \\cdot 12 = 3 \\cdot 8 = 4 \\cdot 6 = 24$.",
        "如果 $y = \\frac{k}{x}$，其中 $k \\ne 0$ 是常数，也就是说每一组值的**乘积** $xy = k$ 都相同，就说 $y$ 与 $x$ **成反比例**。$x$ 变为两倍时，$y$ 变为一半。\n\n判断一组点的关系，计算比值 $\\frac{y}{x}$ 和乘积 $xy$：比值相等是正比例，乘积相等是反比例。点 $(2, 12)$、$(3, 8)$、$(4, 6)$ 成反比例：$2 \\cdot 12 = 3 \\cdot 8 = 4 \\cdot 6 = 24$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.pick([12, 18, 24, 30, 36, 48, 60, 72]);
        const xs = (kind === 1 ? rng.sample(divisors(k, 1, 12), 3) : rng.sample(range(1, 10), 3)).sort((a, b) => a - b);
        const c = rng.int(2, 9);
        const ys = xs.map((x) => (kind === 0 ? c * x : kind === 1 ? k / x : rng.bool() ? x + c : 3 * c - x));
        const pts = xs.map((x, i) => [x, ys[i]!] as const);
        // A "neither" set that happens to be direct or inverse is classified as such.
        const direct = pts.every(([x, y]) => y * pts[0]![0] === pts[0]![1] * x);
        const inverse = pts.every(([x, y]) => x * y === pts[0]![0] * pts[0]![1]);
        const correct = direct ? 0 : inverse ? 1 : 2;
        const products = pts.map(([x, y]) => `${x} \\cdot ${paren(y)} = ${x * y}`).join(", \\quad ");
        const ratios = pts.map(([x, y]) => quotient(y, x)).join(", \\quad ");
        return choiceProblem({
          prompt: t(
            `Do the points ${points(pts).en} show direct variation, inverse variation, or neither?`,
            `点 ${points(pts)["zh-CN"]} 表示正比例关系、反比例关系，还是都不是？`,
          ),
          options: [t("Direct variation", "正比例关系"), t("Inverse variation", "反比例关系"), t("Neither", "都不是")],
          correct,
          solution: t(
            `Ratios:${steps(ratios)}Products:${steps(products)}${["The ratios are equal: direct variation.", "The products are equal: inverse variation.", "Neither the ratios nor the products are all equal: neither."][correct]}`,
            `比值：${steps(ratios)}乘积：${steps(products)}${["比值相等：正比例关系。", "乘积相等：反比例关系。", "比值和乘积都不全相等：都不是。"][correct]}`,
          ),
        });
      },
    },
    {
      id: "constant-of-inverse-variation",
      title: t("The constant of variation", "比例常数"),
      explanation: t(
        "If $y$ varies inversely with $x$, then $k = xy$ for any pair of values. If $y = 6$ when $x = 4$:\n\n$$k = 4 \\cdot 6 = 24$$\n\nMultiply, do not divide: dividing gives the constant of a direct variation.",
        "如果 $y$ 与 $x$ 成反比例，那么对任何一组值，$k = xy$。若 $x = 4$ 时 $y = 6$：\n\n$$k = 4 \\cdot 6 = 24$$\n\n要相乘，不要相除：相除得到的是正比例关系的常数。",
      ),
      generate(rng) {
        const { x, y, k } = inverseData(rng);
        return numberProblem({
          prompt: t(
            `$y$ varies inversely with $x$, and $y = ${y}$ when $x = ${x}$. Find the constant of variation $k$.`,
            `$y$ 与 $x$ 成反比例，当 $x = ${x}$ 时 $y = ${y}$。求比例常数 $k$。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [q(y, x), q(x, y), x + y],
          solution: t(`${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`)}`, `${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`)}`),
        });
      },
    },
    {
      id: "writing-inverse-variation-equations",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        "Find $k = xy$ from a known pair and substitute it into $y = \\frac{k}{x}$. If $y = 6$ when $x = 4$, then $k = 24$ and\n\n$$y = \\frac{24}{x}$$",
        "由一组已知的值求出 $k = xy$，代入 $y = \\frac{k}{x}$。若 $x = 4$ 时 $y = 6$，则 $k = 24$，\n\n$$y = \\frac{24}{x}$$",
      ),
      generate(rng) {
        const { x, y, k } = inverseData(rng);
        return equationProblem("y", {
          prompt: t(
            `$y$ varies inversely with $x$, and $y = ${y}$ when $x = ${x}$. Write an equation for $y$ in terms of $x$.`,
            `$y$ 与 $x$ 成反比例，当 $x = ${x}$ 时 $y = ${y}$。写出用 $x$ 表示 $y$ 的方程。`,
          ),
          answer: inverseFraction(k),
          wrong: [linear(k, 0), `${k < 0 ? "-" : ""}\\frac{x}{${Math.abs(k)}}`, linear(q(y, x), 0)],
          solution: t(
            `${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`, `y = ${inverseFraction(k)}`)}`,
            `${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`, `y = ${inverseFraction(k)}`)}`,
          ),
        });
      },
    },
    {
      id: "using-inverse-variation",
      title: t("Finding a value", "求值"),
      explanation: t(
        "Find $k = xy$, then divide $k$ by the new value of $x$. If $y = 6$ when $x = 4$, then $k = 24$, and when $x = 8$:\n\n$$y = \\frac{24}{8} = 3$$\n\nWhen $x$ doubled, $y$ was halved.",
        "求出 $k = xy$，再用 $k$ 除以新的 $x$ 值。若 $x = 4$ 时 $y = 6$，则 $k = 24$；当 $x = 8$ 时\n\n$$y = \\frac{24}{8} = 3$$\n\n$x$ 变为两倍，$y$ 变为一半。",
      ),
      generate(rng) {
        const { x, y, k } = inverseData(rng);
        const x2 = rng.pick(range(-12, 12).filter((v) => Math.abs(v) > 1 && Math.abs(v) !== Math.abs(x)));
        const answer = q(k, x2);
        return numberProblem({
          prompt: t(
            `$y$ varies inversely with $x$, and $y = ${y}$ when $x = ${x}$. Find $y$ when $x = ${x2}$.`,
            `$y$ 与 $x$ 成反比例，当 $x = ${x}$ 时 $y = ${y}$。求 $x = ${x2}$ 时 $y$ 的值。`,
          ),
          answer,
          solveFor: "y",
          wrong: [q(y * x2, x), k * x2, q(x2, k)],
          solution: t(
            `${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`, `y = \\frac{${k}}{${x2}} = ${num(answer)}`)}`,
            `${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`, `y = \\frac{${k}}{${x2}} = ${num(answer)}`)}`,
          ),
        });
      },
    },
  ],
};

/** InverseContext is a real-world inverse variation y = k/x, with its variables and wording. */
interface InverseContext {
  readonly y: string;
  readonly x: string;
  readonly ks: readonly number[];
  readonly xRange: readonly [number, number];
  readonly setup: (x: number, y: number) => Text;
  readonly ask: (x: number) => Text;
}

const inverseContexts: readonly InverseContext[] = [
  {
    y: "t",
    x: "n",
    ks: [24, 36, 48, 60, 72, 84, 90, 120],
    xRange: [2, 12],
    setup: (x, y) =>
      t(
        `The time $t$ (in days) it takes to paint a building varies inversely with the number of painters $n$. With $${x}$ painters it takes $${y}$ days.`,
        `粉刷一栋楼所需的时间 $t$（天）与油漆工人数 $n$ 成反比例。$${x}$ 名油漆工需要 $${y}$ 天。`,
      ),
    ask: (x) => t(`How many days does it take with $${x}$ painters?`, `$${x}$ 名油漆工需要多少天？`),
  },
  {
    y: "t",
    x: "v",
    ks: [120, 180, 240, 300, 360, 480, 600],
    xRange: [20, 120],
    setup: (x, y) =>
      t(
        `For a fixed trip, the travel time $t$ (in hours) varies inversely with the average speed $v$ (in km/h). At $${x}$ km/h the trip takes $${y}$ hours.`,
        `对于一段固定的路程，所用时间 $t$（小时）与平均速度 $v$（km/h）成反比例。以 $${x}$ km/h 行驶需要 $${y}$ 小时。`,
      ),
    ask: (x) => t(`How many hours does the trip take at $${x}$ km/h?`, `以 $${x}$ km/h 行驶需要多少小时？`),
  },
  {
    y: "c",
    x: "n",
    ks: [120, 180, 240, 360, 420, 480, 540, 600],
    xRange: [2, 12],
    setup: (x, y) =>
      t(
        `Friends share the cost of renting a cabin equally, so each person's share $c$ (in dollars) varies inversely with the number of people $n$. With $${x}$ people, each pays $\\$${y}$.`,
        `几个朋友平均分担租小屋的费用，所以每人分担的费用 $c$（元）与人数 $n$ 成反比例。$${x}$ 个人时每人付 $${y}$ 元。`,
      ),
    ask: (x) => t(`How many dollars does each pay with $${x}$ people?`, `$${x}$ 个人时每人付多少元？`),
  },
];

/** inverseContextData draws a context and two different values of x that divide k. */
function inverseContextData(rng: Rng) {
  const c = rng.pick(inverseContexts);
  const k = rng.pick(c.ks);
  const [x1, x2] = rng.sample(divisors(k, c.xRange[0], c.xRange[1]), 2) as [number, number];
  return { c, k, x1, x2, y1: k / x1, y2: k / x2 };
}

export const modelingWithInverseVariation: TopicDef = {
  id: "modeling-with-inverse-variation",
  title: t("Modeling With Inverse Variation", "用反比例关系建模"),
  summary: t("Write and use inverse-variation models of real situations.", "写出并使用实际情境中的反比例模型。"),
  prerequisites: ["inverse-variation", "modeling-with-direct-variation"],
  encompasses: [{ topic: "inverse-variation", weight: 0.5 }],
  xp: 12,
  knowledgePoints: [
    {
      id: "writing-inverse-variation-models",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        "When one quantity doubles and another halves, as the time of a job and the number of workers, they vary inversely. The constant is the product of the two quantities, here the total work: if $6$ painters take $10$ days, the job is $6 \\cdot 10 = 60$ painter-days, and\n\n$$t = \\frac{60}{n}$$",
        "一个量变为两倍、另一个量变为一半时，例如完成一项工作的时间与工人数，它们成反比例。常数是两个量的乘积，这里是总工作量：如果 $6$ 名油漆工需要 $10$ 天，这项工作就是 $6 \\cdot 10 = 60$ 个“人·天”，\n\n$$t = \\frac{60}{n}$$",
      ),
      generate(rng) {
        const { c, k, x1, y1 } = inverseContextData(rng);
        const setup = c.setup(x1, y1);
        return equationProblem(c.y, {
          prompt: t(
            `${setup.en} Write an equation for $${c.y}$ in terms of $${c.x}$.`,
            `${setup["zh-CN"]}写出用 $${c.x}$ 表示 $${c.y}$ 的方程。`,
          ),
          answer: inverseFraction(k, c.x),
          wrong: [linear(k, 0, c.x), `\\frac{${c.x}}{${k}}`, linear(q(y1, x1), 0, c.x)],
          solution: t(
            `${steps(`k = ${x1} \\cdot ${y1} = ${k}`, `${c.y} = ${inverseFraction(k, c.x)}`)}`,
            `${steps(`k = ${x1} \\cdot ${y1} = ${k}`, `${c.y} = ${inverseFraction(k, c.x)}`)}`,
          ),
        });
      },
    },
    {
      id: "predicting-with-inverse-variation",
      title: t("Predicting a value", "预测数值"),
      explanation: t(
        "Find the constant $k$ as the product of the known pair, then divide it by the new value. If $6$ painters take $10$ days, then $k = 60$ and $4$ painters take\n\n$$t = \\frac{60}{4} = 15 \\text{ days}$$\n\nFewer painters take **longer**: setting up a direct proportion would wrongly give fewer days.",
        "由已知的一组值求出乘积 $k$，再除以新的值。如果 $6$ 名油漆工需要 $10$ 天，那么 $k = 60$，$4$ 名油漆工需要\n\n$$t = \\frac{60}{4} = 15 \\text{ 天}$$\n\n人越少，用时越**长**：按正比例计算会错误地得出更少的天数。",
      ),
      generate(rng) {
        const { c, k, x1, x2, y1, y2 } = inverseContextData(rng);
        const setup = c.setup(x1, y1);
        const ask = c.ask(x2);
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: y2,
          wrong: [q(y1 * x2, x1), k * x2],
          solution: t(
            `${steps(`k = ${x1} \\cdot ${y1} = ${k}`, `${c.y} = \\frac{${k}}{${x2}} = ${y2}`)}`,
            `${steps(`k = ${x1} \\cdot ${y1} = ${k}`, `${c.y} = \\frac{${k}}{${x2}} = ${y2}`)}`,
          ),
        });
      },
    },
  ],
};

/** unitTopics are the topics on units, accuracy, and direct and inverse variation. */
export const unitTopics: readonly TopicDef[] = [
  metricUnitsOfMass,
  metricUnitsOfLength,
  twoStepUnitConversions,
  unitsOfTime,
  mixedUnits,
  convertingUnitsOfArea,
  unitsInFormulas,
  unitsOfRatesOfChange,
  degreesOfAccuracy,
  directVariation,
  modelingWithDirectVariation,
  inverseVariation,
  modelingWithInverseVariation,
];
