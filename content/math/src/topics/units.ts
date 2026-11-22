import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, dec, gcd, linear, num, paren, Q, q } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { rect } from "../explanation-drawings-geometry-2.ts";
import { side } from "../explanation-drawings-grades-2.ts";
import { drawing, note, seg } from "../explanation-drawings-kit.ts";

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
import { range } from "../solution-kit.ts";

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

/** Unit is a metric unit: its symbol, its name (plural and singular), and its size in the base unit. */
interface Unit {
  readonly sym: string;
  readonly name: Text;
  readonly one: Text;
  readonly size: Q;
}

const unit = (sym: string, en: string, one: string, zh: string, size: Q): Unit => ({ sym, name: t(en, zh), one: t(one, zh), size });

const kilogram = unit("kg", "kilograms", "kilogram", "千克", Q.of(1000));
const gram = unit("g", "grams", "gram", "克", Q.one);
const milligram = unit("mg", "milligrams", "milligram", "毫克", q(1, 1000));
const kilometer = unit("km", "kilometers", "kilometer", "千米", Q.of(1000));
const meter = unit("m", "meters", "meter", "米", Q.one);
const centimeter = unit("cm", "centimeters", "centimeter", "厘米", q(1, 100));
const millimeter = unit("mm", "millimeters", "millimeter", "毫米", q(1, 1000));

/** relation writes how many of the smaller unit make one of the larger: "1\text{ kg} = 1000\text{ g}". */
const relation = (big: Unit, small: Unit) => `1${unitLatex(big.sym)} = ${dec(big.size.div(small.size))}${unitLatex(small.sym)}`;

/** convertLatex writes one conversion step: "4.5\text{ kg} = (4.5 \cdot 1000)\text{ g} = 4500\text{ g}". */
function convertLatex(v: Q, from: Unit, to: Unit): string {
  const r = from.size.div(to.size);
  const op = r.cmp(Q.one) > 0 ? `\\cdot ${dec(r)}` : `\\div ${dec(Q.one.div(r))}`;
  return `${qty(v, from.sym)} = (${dec(v)} ${op})${unitLatex(to.sym)} = ${qty(v.mul(r), to.sym)}`;
}

/** placesText says how many places a power of ten moves the decimal point: "three places", "三位". */
function placesText(f: Q): Text {
  const n = dec(f).length - 1;
  return t(`${["no", "one", "two", "three"][n]} place${n === 1 ? "" : "s"}`, `${["零", "一", "两", "三"][n]}位`);
}

/** kindOf names what a unit measures: mass for grams, length for meters. */
const kindOf = (u: Unit): Text => (u.sym.endsWith("g") ? t("mass", "质量") : t("length", "长度"));

/** whyFactor explains whether a one-step metric conversion multiplies or divides, from the sizes of the units. */
function whyFactor(from: Unit, to: Unit): Text {
  const down = from.size.cmp(to.size) > 0;
  const [big, small] = down ? [from, to] : [to, from];
  const f = dec(big.size.div(small.size));
  const what = kindOf(from);
  return down
    ? t(
        `Since $${relation(big, small)}$, each ${big.one.en} breaks into $${f}$ ${small.name.en}. A ${to.one.en} is the smaller unit, so the same ${what.en} takes $${f}$ times as many of them: multiply by $${f}$.`,
        `因为 $${relation(big, small)}$，每 $1$ ${big.one["zh-CN"]}可以分成 $${f}$ ${small.name["zh-CN"]}。${to.one["zh-CN"]}是较小的单位，同样的${what["zh-CN"]}要用的个数是原来的 $${f}$ 倍：乘 $${f}$。`,
      )
    : t(
        `Since $${relation(big, small)}$, every $${f}$ ${small.name.en} make one ${big.one.en}. A ${to.one.en} is the larger unit, so the same ${what.en} takes fewer of them: divide by $${f}$.`,
        `因为 $${relation(big, small)}$，每 $${f}$ ${small.name["zh-CN"]}合成 $1$ ${big.one["zh-CN"]}。${to.one["zh-CN"]}是较大的单位，同样的${what["zh-CN"]}要用的个数更少：除以 $${f}$。`,
      );
}

/** conversionSolution works a one-step conversion between metric units: why it multiplies or divides, the decimal point, and a check by size. */
function conversionSolution(v: Q, from: Unit, to: Unit): Text {
  const down = from.size.cmp(to.size) > 0;
  const [big, small] = down ? [from, to] : [to, from];
  const f = big.size.div(small.size);
  const answer = v.mul(from.size.div(to.size));
  const why = whyFactor(from, to);
  const places = placesText(f);
  const line = steps(convertLatex(v, from, to));
  return t(
    `**Step 1: multiply or divide.** ${why.en}

**Step 2: move the decimal point.** ${down ? "Multiplying" : "Dividing"} by $${dec(f)}$ moves the decimal point ${places.en} to the ${down ? "right" : "left"}:${line}**Check.** A ${to.one.en} is ${down ? "smaller" : "larger"} than a ${from.one.en}, so the number should get ${down ? "bigger" : "smaller"}, and it does: $${dec(answer)} ${down ? ">" : "<"} ${dec(v)}$. Converting back, $${dec(answer)} ${down ? "\\div" : "\\cdot"} ${dec(f)} = ${dec(v)}$.`,
    `**第一步：乘还是除。** ${why["zh-CN"]}

**第二步：移动小数点。** ${down ? "乘" : "除以"} $${dec(f)}$，就是把小数点向${down ? "右" : "左"}移动${places["zh-CN"]}：${line}**检验。** ${to.one["zh-CN"]}比${from.one["zh-CN"]}${down ? "小" : "大"}，所以数应当变${down ? "大" : "小"}，确实如此：$${dec(answer)} ${down ? ">" : "<"} ${dec(v)}$。换算回去，$${dec(answer)} ${down ? "\\div" : "\\cdot"} ${dec(f)} = ${dec(v)}$。`,
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
  intro: t(
    `A unit rate counts how much goes with **one** unit: $\\$3$ per kilogram is the price of one kilogram. A measurement is a count of units too: a mass of $2$ kilograms is two of the unit called a kilogram. The same mass can be counted in a larger or a smaller unit; the mass stays the same, only the count changes.

The metric system makes these changes easy. Its units are built from one **base unit** with prefixes worth powers of ten. For mass the base unit is the **gram** (g), about the mass of a paper clip. The prefix *kilo-* means a thousand and *milli-* means a thousandth:

$$1\\text{ kg} = 1000\\text{ g}, \\qquad 1\\text{ g} = 1000\\text{ mg}.$$

So a $2$ kg bag of flour is $2$ groups of $1000$ grams, $2 \\cdot 1000 = 2000$ g: grams are small, so it takes many of them. Going back, $2000$ grams make $2000 \\div 1000 = 2$ kilograms.

In this lesson we convert masses to a smaller unit by multiplying and to a larger unit by dividing, and check each answer by asking whether the number should get bigger or smaller.`,
    `单位率说的是**一个**单位对应多少：每千克 $3$ 美元，就是一千克的价钱。测量值也是在数单位：$2$ 千克的质量，就是两个叫作“千克”的单位。同样的质量可以用较大或较小的单位来数；质量不变，变的只是个数。

公制让这种换算很容易。公制单位由一个**基本单位**加上表示十的乘方的前缀构成。质量的基本单位是**克**（g），大约是一枚回形针的质量。前缀“千”（kilo-）表示一千，“毫”（milli-）表示千分之一：

$$1\\text{ kg} = 1000\\text{ g}, \\qquad 1\\text{ g} = 1000\\text{ mg}.$$

所以一袋 $2$ kg 的面粉是 $2$ 个 $1000$ 克，即 $2 \\cdot 1000 = 2000$ g：克很小，所以要很多个。反过来，$2000$ 克合成 $2000 \\div 1000 = 2$ 千克。

这节课把质量换算成较小的单位时用乘法，换算成较大的单位时用除法，并通过判断数应当变大还是变小来检验每个答案。`,
  ),
  knowledgePoints: [
    {
      id: "converting-to-smaller-units-of-mass",
      title: t("Converting to a smaller unit", "换算成较小的单位"),
      explanation: t(
        `A kilogram is $1000$ grams: split one kilogram into grams and there are $1000$ of them. So $2.35$ kg is $2.35$ groups of $1000$ grams:

$$2.35\\text{ kg} = (2.35 \\cdot 1000)\\text{ g} = 2350\\text{ g}.$$

This is the rule for every conversion to a **smaller** unit: each large unit breaks into many small ones, so **multiply** by the number of small units in one large unit. Multiplying by $1000$ moves the decimal point three places to the right, writing zeros in the empty places: $2.35 \\to 23.5 \\to 235 \\to 2350$. Grams to milligrams works the same way, since $1\\text{ g} = 1000\\text{ mg}$.

> **Watch out.** A smaller unit always gives a **bigger** number for the same mass. Dividing, $2.35 \\div 1000 = 0.00235$, makes the number smaller, so it cannot be right. And both prefixes are worth $1000$: move the point three places, not two or one, since $235$ g or $23.5$ g would be only a tenth or a hundredth of the mass.`,
        `一千克是 $1000$ 克：把一千克分成克，就有 $1000$ 个。所以 $2.35$ kg 是 $2.35$ 个 $1000$ 克：

$$2.35\\text{ kg} = (2.35 \\cdot 1000)\\text{ g} = 2350\\text{ g}.$$

换算成**较小**的单位都是这个道理：每个大单位分成许多小单位，所以**乘**一个大单位所含小单位的个数。乘 $1000$ 就是把小数点向右移动三位，空位补零：$2.35 \\to 23.5 \\to 235 \\to 2350$。克换算成毫克也一样，因为 $1\\text{ g} = 1000\\text{ mg}$。

> **注意。** 同样的质量，用较小的单位表示，数一定**更大**。用除法得 $2.35 \\div 1000 = 0.00235$，数变小了，所以不可能对。两个前缀都表示 $1000$：小数点要移动三位，不是两位或一位，$235$ g 或 $23.5$ g 只是原来质量的十分之一或百分之一。`,
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
        `Going the other way, every $1000$ grams make one kilogram. So the number of kilograms is the number of grams **divided** by $1000$: $4500$ g make $4500 \\div 1000 = 4.5$ kg. Dividing by $1000$ moves the decimal point three places to the left:

$$450\\text{ mg} = (450 \\div 1000)\\text{ g} = 0.45\\text{ g}.$$

A larger unit needs fewer of itself to make the same mass, so the number gets **smaller**: a mass in kilograms is always a smaller number than the same mass in grams.

> **Watch out.** Do not multiply: $450 \\cdot 1000 = 450000$ g would be far heavier than $450$ mg. And count three places when you move the point: $450 \\div 100 = 4.5$ g would be ten times the mass.`,
        `反过来，每 $1000$ 克合成一千克。所以千克数等于克数**除以** $1000$：$4500$ g 合成 $4500 \\div 1000 = 4.5$ kg。除以 $1000$ 就是把小数点向左移动三位：

$$450\\text{ mg} = (450 \\div 1000)\\text{ g} = 0.45\\text{ g}.$$

单位越大，表示同样的质量需要的个数越少，所以数变**小**：同样的质量，用千克表示的数一定比用克表示的数小。

> **注意。** 不要用乘法：$450 \\cdot 1000 = 450000$ g 比 $450$ mg 重得多。移动小数点时要数够三位：$450 \\div 100 = 4.5$ g 是原来质量的十倍。`,
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
  encompasses: [],
  xp: 10,
  intro: t(
    `Masses convert through the gram: *kilo-* is a thousand grams and *milli-* a thousandth of a gram. Lengths use the same prefixes on a different base unit, the **meter** (m), about the length of a long step. One more prefix is common for lengths: *centi-* means a hundredth.

$$1\\text{ km} = 1000\\text{ m}, \\qquad 1\\text{ m} = 100\\text{ cm}, \\qquad 1\\text{ m} = 1000\\text{ mm}.$$

The reasoning is the one we used for mass. A $1.5$ km walk is $1.5$ groups of $1000$ meters, $1.5 \\cdot 1000 = 1500$ m; and a $245$ cm board is $245 \\div 100 = 2.45$ m, because every $100$ centimeters make one meter.

What is new is that the factors differ: $1000$ for kilometers and millimeters, $100$ for centimeters. In this lesson we convert lengths to meters and from meters, choosing the factor from the prefix and checking the direction by size.`,
    `质量通过克来换算：“千”是一千克，“毫”是千分之一克。长度用同样的前缀，但基本单位不同，是**米**（m），大约是一大步的长度。长度还常用一个前缀：“厘”（centi-）表示百分之一。

$$1\\text{ km} = 1000\\text{ m}, \\qquad 1\\text{ m} = 100\\text{ cm}, \\qquad 1\\text{ m} = 1000\\text{ mm}.$$

道理和质量一样。走 $1.5$ km 是 $1.5$ 个 $1000$ 米，即 $1.5 \\cdot 1000 = 1500$ m；一块 $245$ cm 长的木板是 $245 \\div 100 = 2.45$ m，因为每 $100$ 厘米合成一米。

新的地方在于换算率不同：千米和毫米是 $1000$，厘米是 $100$。这节课把长度换算成米、由米换算成其他单位，根据前缀选出换算率，并根据大小检验方向。`,
  ),
  knowledgePoints: [
    {
      id: "converting-to-meters",
      title: t("Converting to meters", "换算成米"),
      explanation: t(
        `To convert to meters, first ask which unit is larger. A kilometer is larger than a meter, so each kilometer breaks into $1000$ meters and we **multiply** by $1000$. Centimeters and millimeters are smaller than a meter, so many of them make one meter and we **divide**: by $100$ for centimeters, by $1000$ for millimeters.

$$245\\text{ cm} = (245 \\div 100)\\text{ m} = 2.45\\text{ m}.$$

Dividing by $100$ moves the decimal point two places to the left. The answer is a smaller number, as it should be: a meter is a larger unit than a centimeter.

> **Watch out.** Match the factor to the prefix: *centi-* is $100$, *milli-* and *kilo-* are $1000$. Dividing $245$ cm by $1000$ gives $0.245$ m, ten times too short. And dividing kilometers instead of multiplying them makes a long road shorter than a meter.`,
        `换算成米，先问哪个单位大。千米比米大，每千米分成 $1000$ 米，所以**乘** $1000$。厘米和毫米比米小，许多个才合成一米，所以**除**：厘米除以 $100$，毫米除以 $1000$。

$$245\\text{ cm} = (245 \\div 100)\\text{ m} = 2.45\\text{ m}.$$

除以 $100$ 就是把小数点向左移动两位。答案是较小的数，这是应当的：米是比厘米大的单位。

> **注意。** 换算率要和前缀对应：“厘”是 $100$，“毫”和“千”是 $1000$。把 $245$ cm 除以 $1000$ 得 $0.245$ m，短了十倍。把千米数相除而不是相乘，一条长路就会变得不到一米。`,
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
        `From meters, the direction reverses. Centimeters and millimeters are smaller units, so the same length takes more of them: **multiply**, by $100$ for centimeters and $1000$ for millimeters. A kilometer is larger, so **divide** by $1000$:

$$3.7\\text{ m} = (3.7 \\cdot 100)\\text{ cm} = 370\\text{ cm}, \\qquad 2500\\text{ m} = (2500 \\div 1000)\\text{ km} = 2.5\\text{ km}.$$

In the first, the point moves two places right; in the second, three places left. A quick picture helps: a $2500$ m run is two and a half kilometers, a number smaller than $2500$.

> **Watch out.** Multiplying by $1000$ to get kilometers, $2500 \\cdot 1000$, gives two and a half million kilometers, far more than the distance. And $3.7$ m is $370$ cm, not $3700$ cm: that would use the factor of millimeters.`,
        `由米换算，方向反过来。厘米和毫米是较小的单位，同样的长度要用更多个：**乘**，厘米乘 $100$，毫米乘 $1000$。千米较大，所以**除以** $1000$：

$$3.7\\text{ m} = (3.7 \\cdot 100)\\text{ cm} = 370\\text{ cm}, \\qquad 2500\\text{ m} = (2500 \\div 1000)\\text{ km} = 2.5\\text{ km}.$$

第一个式子小数点向右移动两位，第二个向左移动三位。想一想实际情形会有帮助：跑 $2500$ m 就是两千米半，这个数比 $2500$ 小。

> **注意。** 换算成千米时乘 $1000$，$2500 \\cdot 1000$ 得两百五十万千米，远远超过实际的路程。$3.7$ m 是 $370$ cm，不是 $3700$ cm：那是用了毫米的换算率。`,
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

/** twoStepSolution works a conversion through the base unit: each step with its reason, then a check by the overall factor. */
function twoStepSolution(v: Q, from: Unit, base: Unit, to: Unit): Text {
  const mid = v.mul(from.size);
  const answer = mid.div(to.size);
  const first = whyFactor(from, base);
  const second = whyFactor(base, to);
  const down = from.size.cmp(to.size) > 0;
  const total = down ? from.size.div(to.size) : to.size.div(from.size);
  return t(
    `There is no single prefix step from ${from.name.en} to ${to.name.en}, so go through the base unit, ${base.name.en}.

**Step 1: to ${base.name.en}.** ${first.en}${steps(convertLatex(v, from, base))}**Step 2: to ${to.name.en}.** ${second.en}${steps(convertLatex(mid, base, to))}**Check.** In all, $${relation(down ? from : to, down ? to : from)}$, so a ${to.one.en} is ${down ? "smaller" : "larger"} than a ${from.one.en} and the number should get $${dec(total)}$ times ${down ? "bigger" : "smaller"}: $${dec(v)} ${down ? "\\cdot" : "\\div"} ${dec(total)} = ${dec(answer)}$.`,
    `${from.name["zh-CN"]}和${to.name["zh-CN"]}之间没有一步的前缀换算，所以经由基本单位${base.name["zh-CN"]}。

**第一步：换算成${base.name["zh-CN"]}。** ${first["zh-CN"]}${steps(convertLatex(v, from, base))}**第二步：换算成${to.name["zh-CN"]}。** ${second["zh-CN"]}${steps(convertLatex(mid, base, to))}**检验。** 合起来，$${relation(down ? from : to, down ? to : from)}$，所以${to.one["zh-CN"]}比${from.one["zh-CN"]}${down ? "小" : "大"}，数应当变${down ? "大" : "小"}到 $${dec(total)}$ ${down ? "倍" : "分之一"}：$${dec(v)} ${down ? "\\cdot" : "\\div"} ${dec(total)} = ${dec(answer)}$。`,
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
  encompasses: [{ topic: "metric-units-of-length", weight: 0.5 }],
  xp: 12,
  intro: t(
    `We can convert between meters and any prefixed unit in one step: $1\\text{ km} = 1000\\text{ m}$, $1\\text{ m} = 100\\text{ cm}$, $1\\text{ m} = 1000\\text{ mm}$. But how many centimeters are in a kilometer? No single fact in that list says.

The base unit links them all. Every prefix is defined against the meter, so a conversion between two prefixed units can **go through the meter**: first from kilometers to meters, then from meters to centimeters. For $2$ km:

$$2\\text{ km} = 2000\\text{ m} = 2000 \\cdot 100\\text{ cm} = 200000\\text{ cm}.$$

Each step is an ordinary one-step conversion, with its own reason to multiply or divide. In this lesson we convert to smaller and to larger units in two steps, and check by the overall factor, here $1\\text{ km} = 1000 \\cdot 100 = 100000\\text{ cm}$.`,
    `米与任何带前缀的单位之间，一步就能换算：$1\\text{ km} = 1000\\text{ m}$，$1\\text{ m} = 100\\text{ cm}$，$1\\text{ m} = 1000\\text{ mm}$。可是一千米有多少厘米？上面没有一条直接说明。

基本单位把它们都联系起来。每个前缀都是相对于米规定的，所以两个带前缀的单位之间的换算可以**经由米**：先由千米换算成米，再由米换算成厘米。对于 $2$ km：

$$2\\text{ km} = 2000\\text{ m} = 2000 \\cdot 100\\text{ cm} = 200000\\text{ cm}.$$

每一步都是普通的一步换算，各有乘或除的理由。这节课分两步换算成较小和较大的单位，并用总的换算率检验，这里是 $1\\text{ km} = 1000 \\cdot 100 = 100000\\text{ cm}$。`,
  ),
  knowledgePoints: [
    {
      id: "two-steps-to-a-smaller-unit",
      title: t("Two steps to a smaller unit", "两步换算成较小的单位"),
      explanation: t(
        `To convert between two prefixed units, such as kilometers and centimeters, go **through the base unit**. Each step is decided on its own, by comparing the two units in that step. From $3.2$ km to centimeters, both steps go to a smaller unit, so both multiply:

$$3.2\\text{ km} = (3.2 \\cdot 1000)\\text{ m} = 3200\\text{ m}, \\qquad 3200\\text{ m} = (3200 \\cdot 100)\\text{ cm} = 320000\\text{ cm}.$$

The steps need not go the same way. From centimeters to millimeters, the first step goes **up** to meters (divide by $100$) and the second **down** to millimeters (multiply by $1000$): $4\\text{ cm} = 0.04\\text{ m} = 40\\text{ mm}$. Overall the target is smaller, so the number grows, by $10$.

> **Watch out.** Do not stop at the base unit: $3200$ m answers a different question. Do not divide in the second step either; going from meters to centimeters always multiplies. Check the size: the answer in the smaller unit must be the larger number.`,
        `在两个带前缀的单位之间换算，例如千米与厘米，要**经由基本单位**。每一步单独判断，比较这一步里的两个单位。由 $3.2$ km 换算成厘米，两步都是换算成较小的单位，所以都乘：

$$3.2\\text{ km} = (3.2 \\cdot 1000)\\text{ m} = 3200\\text{ m}, \\qquad 3200\\text{ m} = (3200 \\cdot 100)\\text{ cm} = 320000\\text{ cm}.$$

两步的方向不一定相同。由厘米换算成毫米，第一步**向上**换算成米（除以 $100$），第二步**向下**换算成毫米（乘 $1000$）：$4\\text{ cm} = 0.04\\text{ m} = 40\\text{ mm}$。总的来看目标单位较小，所以数变大，变为 $10$ 倍。

> **注意。** 不要停在基本单位：$3200$ m 回答的是另一个问题。第二步也不要用除法；由米换算成厘米总是乘。检验大小：用较小单位表示的答案，一定是较大的数。`,
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
        `Going to a larger unit, the same two steps run the other way. From milligrams to kilograms, both steps go to a larger unit, and a larger unit needs fewer of itself, so both **divide**:

$$45000\\text{ mg} = (45000 \\div 1000)\\text{ g} = 45\\text{ g}, \\qquad 45\\text{ g} = (45 \\div 1000)\\text{ kg} = 0.045\\text{ kg}.$$

In all the number is divided by $1000 \\cdot 1000 = 1000000$: a kilogram is a million milligrams. From millimeters to centimeters the steps differ, divide by $1000$ to meters, then multiply by $100$ to centimeters, and in all the number is divided by $10$.

> **Watch out.** Stopping at grams, $45$, is only half the work. Multiplying in either step makes the number bigger, but the larger unit must give the **smaller** number: $0.045$ kg is less than $45000$ mg as a number, though it is the same mass.`,
        `换算成较大的单位，同样的两步反过来走。由毫克换算成千克，两步都是换算成较大的单位，较大的单位需要的个数更少，所以两步都**除**：

$$45000\\text{ mg} = (45000 \\div 1000)\\text{ g} = 45\\text{ g}, \\qquad 45\\text{ g} = (45 \\div 1000)\\text{ kg} = 0.045\\text{ kg}.$$

合起来，这个数除以了 $1000 \\cdot 1000 = 1000000$：一千克是一百万毫克。由毫米换算成厘米时两步不同，先除以 $1000$ 换算成米，再乘 $100$ 换算成厘米，合起来是除以 $10$。

> **注意。** 停在克，得 $45$，只做了一半。任何一步用了乘法，数都会变大，但较大的单位必须给出**较小**的数：作为数，$0.045$ kg 比 $45000$ mg 小，尽管质量相同。`,
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

/** timeSolution works a conversion between units of time through the given chain of units, each step with its reason, and checks it by size. */
function timeSolution(v: Q, chain: readonly TimeUnit[]): Text {
  const en: string[] = [];
  const zh: string[] = [];
  const many = chain.length > 2;
  let x = v;
  for (let i = 1; i < chain.length; i++) {
    const a = chain[i - 1]!;
    const b = chain[i]!;
    const r = q(a.seconds, b.seconds);
    const down = r.cmp(Q.one) > 0;
    const [big, small] = down ? [a, b] : [b, a];
    const f = big.seconds / small.seconds;
    const y = x.mul(r);
    const line = steps(`${dec(x)} ${down ? "\\cdot" : "\\div"} ${f} = ${dec(y)}`);
    en.push(
      `${many ? `**Step ${i}: to ${b.many}.** ` : ""}Since $1$ ${big.one} is $${f}$ ${small.many}, ${down ? `each ${a.one} breaks into $${f}$ ${b.many}, so the same time takes more of them: multiply` : `every $${f}$ ${a.many} make one ${b.one}, so the same time takes fewer of them: divide`} by $${f}$.${line}`,
    );
    zh.push(
      `${many ? `**第${["一", "二"][i - 1]}步：换算成${b.zh}。** ` : ""}因为 $1$ ${big.zh}是 $${f}$ ${small.zh}，${down ? `每 $1$ ${a.zh}分成 $${f}$ ${b.zh}，同样的时间要用更多个：乘` : `每 $${f}$ ${a.zh}合成 $1$ ${b.zh}，同样的时间要用更少个：除以`} $${f}$。${line}`,
    );
    x = y;
  }
  const first = chain[0]!;
  const last = chain.at(-1)!;
  const down = first.seconds > last.seconds;
  const total = down ? first.seconds / last.seconds : last.seconds / first.seconds;
  return t(
    `${en.join("")}**Check.** ${last.one === "hour" ? "An" : "A"} ${last.one} is ${down ? "shorter" : "longer"} than ${first.one === "hour" ? "an" : "a"} ${first.one}, so the number should get ${down ? "bigger" : "smaller"}: $${dec(x)} ${down ? ">" : "<"} ${dec(v)}$. Converting back, $1$ ${down ? first.one : last.one} is $${total}$ ${down ? last.many : first.many}, and $${dec(x)} ${down ? "\\div" : "\\cdot"} ${total} = ${dec(v)}$. So the answer is $${dec(x)}$ ${last.many}.`,
    `${zh.join("")}**检验。** ${last.zh}比${first.zh}${down ? "短" : "长"}，所以数应当变${down ? "大" : "小"}：$${dec(x)} ${down ? ">" : "<"} ${dec(v)}$。换算回去，$1$ ${down ? first.zh : last.zh}是 $${total}$ ${down ? last.zh : first.zh}，$${dec(x)} ${down ? "\\div" : "\\cdot"} ${total} = ${dec(v)}$。所以答案是 $${dec(x)}$ ${last.zh}。`,
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

/** timeName names the unit of time of a speed: one hour, one minute or one second. */
const timeName = (s: Speed): Text => (s.time === 3600 ? t("hour", "小时") : s.time === 60 ? t("minute", "分钟") : t("second", "秒"));

/** distName names the unit of distance of a speed. */
const distName = (s: Speed): Text => (s.dist === 1000 ? t("kilometers", "千米") : t("meters", "米"));

export const unitsOfTime: TopicDef = {
  id: "units-of-time",
  title: t("Units of Time", "时间单位"),
  summary: t(
    "Convert between seconds, minutes, hours, days and weeks, and convert speeds.",
    "秒、分钟、小时、天、周之间的换算，以及速度单位的换算。",
  ),
  prerequisites: ["two-step-unit-conversions"],
  encompasses: [{ topic: "two-step-unit-conversions", weight: 0.2 }],
  xp: 15,
  intro: t(
    `Metric conversions multiply or divide by $10$, $100$ or $1000$, so they only move the decimal point. Time is measured in units that grew up separately, and their factors are not powers of ten:

$$1\\text{ week} = 7\\text{ days}, \\quad 1\\text{ day} = 24\\text{ hours}, \\quad 1\\text{ hour} = 60\\text{ minutes}, \\quad 1\\text{ minute} = 60\\text{ seconds}.$$

The reasoning is still the same. A film of $2$ hours lasts two groups of $60$ minutes, $2 \\cdot 60 = 120$ minutes: a minute is the smaller unit, so it takes more of them. And $90$ minutes make $90 \\div 60 = 1.5$ hours, because every $60$ minutes make one hour.

The danger is the decimal point. Since an hour has $60$ minutes, not $100$, the digits after the point of $1.5$ hours are not minutes: $0.5$ hours is half of $60$ minutes, $30$ minutes. In this lesson we convert in one and two steps, read decimal parts of a unit correctly, and convert speeds, which have a unit of time in them.`,
    `公制换算乘或除以 $10$、$100$、$1000$，只是移动小数点。时间单位是各自形成的，换算率不是十的乘方：

$$1\\text{ 周} = 7\\text{ 天}, \\quad 1\\text{ 天} = 24\\text{ 小时}, \\quad 1\\text{ 小时} = 60\\text{ 分钟}, \\quad 1\\text{ 分钟} = 60\\text{ 秒}.$$

道理仍然一样。一部 $2$ 小时的电影是两个 $60$ 分钟，即 $2 \\cdot 60 = 120$ 分钟：分钟是较小的单位，所以要更多个。$90$ 分钟合成 $90 \\div 60 = 1.5$ 小时，因为每 $60$ 分钟合成一小时。

容易出错的是小数点。一小时是 $60$ 分钟，不是 $100$ 分钟，所以 $1.5$ 小时小数点后的数字不是分钟数：$0.5$ 小时是 $60$ 分钟的一半，即 $30$ 分钟。这节课进行一步和两步换算，正确读出单位的小数部分，并换算含有时间单位的速度。`,
  ),
  knowledgePoints: [
    {
      id: "converting-to-smaller-units-of-time",
      title: t("Converting to a smaller unit", "换算成较小的单位"),
      explanation: t(
        `Each large unit of time breaks into a fixed number of smaller ones, so to convert to a smaller unit, **multiply** by the number of small units in one large unit. A day breaks into $24$ hours, so $3$ days are $3 \\cdot 24 = 72$ hours. The same works with a decimal: $2.5$ hours are two and a half groups of $60$ minutes,

$$2.5\\text{ hours} = 2.5 \\cdot 60 = 150\\text{ minutes}.$$

The answer is a bigger number, as it must be for a smaller unit.

> **Watch out.** Time is not decimal: $2.5$ hours is not $250$ minutes (that treats an hour as $100$ minutes), and not $2$ hours $50$ minutes. Multiply by the real factor, $60$, $24$ or $7$, and do not divide: dividing would give fewer of the smaller unit.`,
        `每个大的时间单位都分成固定个数的小单位，所以换算成较小的单位，要**乘**一个大单位所含小单位的个数。一天分成 $24$ 小时，所以 $3$ 天是 $3 \\cdot 24 = 72$ 小时。小数也一样：$2.5$ 小时是两个半 $60$ 分钟，

$$2.5\\text{ 小时} = 2.5 \\cdot 60 = 150\\text{ 分钟}.$$

答案是较大的数，换算成较小的单位就应当这样。

> **注意。** 时间不是十进制的：$2.5$ 小时不是 $250$ 分钟（那是把一小时当成 $100$ 分钟），也不是 $2$ 小时 $50$ 分钟。要乘真正的换算率 $60$、$24$ 或 $7$，不要除：除会得到更少的小单位。`,
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
        `To convert to a larger unit, ask how many groups of the larger unit the time fills: every $60$ minutes make an hour, so **divide** by $60$.

$$150\\text{ minutes} = 150 \\div 60 = 2.5\\text{ hours}.$$

The decimal part is a **fraction** of an hour. Here $150$ minutes are $2$ full hours and $30$ minutes left over, and $30$ minutes are $\\frac{30}{60} = 0.5$ of an hour. So the answer is $2.5$ hours.

> **Watch out.** Do not divide by $100$: $150$ minutes is not $1.5$ hours. And do not write the leftover minutes after the point: $2$ hours $30$ minutes is $2.5$ hours, not $2.3$ hours. Multiplying is wrong too: a larger unit needs a smaller number.`,
        `换算成较大的单位，就问这段时间能装满几个较大的单位：每 $60$ 分钟合成一小时，所以**除以** $60$。

$$150\\text{ 分钟} = 150 \\div 60 = 2.5\\text{ 小时}.$$

小数部分是一小时的**几分之几**。这里 $150$ 分钟是 $2$ 个整小时，还剩 $30$ 分钟，而 $30$ 分钟是 $\\frac{30}{60} = 0.5$ 小时。所以答案是 $2.5$ 小时。

> **注意。** 不要除以 $100$：$150$ 分钟不是 $1.5$ 小时。也不要把剩下的分钟数写在小数点后：$2$ 小时 $30$ 分钟是 $2.5$ 小时，不是 $2.3$ 小时。用乘法也不对：较大的单位应当给出较小的数。`,
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
        `No single fact links hours and seconds, but minutes sit between them. So go **through minutes**, deciding each step by its own pair of units. Both steps go to a smaller unit, so both multiply:

$$2\\text{ hours} = 2 \\cdot 60 = 120\\text{ minutes}, \\qquad 120\\text{ minutes} = 120 \\cdot 60 = 7200\\text{ seconds}.$$

In all, an hour is $60 \\cdot 60 = 3600$ seconds. In the other direction both steps go to a larger unit, so divide twice: $10800$ seconds $= 10800 \\div 60 = 180$ minutes $= 180 \\div 60 = 3$ hours.

> **Watch out.** Do not stop after the first step: $120$ minutes is not the number of seconds. And use each factor once, the right one for its step: a week is $7$ days and a day is $24$ hours, so a week is $7 \\cdot 24 = 168$ hours.`,
        `小时和秒之间没有一步的换算关系，但分钟在它们中间。所以要**经由分钟**，每一步按这一步的两个单位判断。两步都是换算成较小的单位，所以都乘：

$$2\\text{ 小时} = 2 \\cdot 60 = 120\\text{ 分钟}, \\qquad 120\\text{ 分钟} = 120 \\cdot 60 = 7200\\text{ 秒}.$$

合起来，一小时是 $60 \\cdot 60 = 3600$ 秒。反方向时两步都是换算成较大的单位，所以除两次：$10800$ 秒 $= 10800 \\div 60 = 180$ 分钟 $= 180 \\div 60 = 3$ 小时。

> **注意。** 不要只做第一步就停下：$120$ 分钟不是秒数。每个换算率用一次，并用在它对应的那一步：一周是 $7$ 天，一天是 $24$ 小时，所以一周是 $7 \\cdot 24 = 168$ 小时。`,
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
        `A speed is a distance **per** time, so it has two units, and converting it may change both: the distance on top and the time underneath. To convert $72$ km/h to meters per second, read it as $72$ km in one hour, then write the kilometers as meters and the hour as seconds:

$$72\\text{ km/h} = \\frac{72 \\cdot 1000\\text{ m}}{3600\\text{ s}} = \\frac{72000}{3600}\\text{ m/s} = 20\\text{ m/s}.$$

Changing the distance unit multiplies the top by $1000$, and changing the time unit multiplies the bottom by $3600$. Together the number is divided by $3.6$. It gets smaller because a meter per second is a faster unit: in an hour it covers $3600$ m, which is $3.6$ km.

> **Watch out.** Convert both parts. Changing only the kilometers gives $72000$, and changing only the hour gives $\\frac{72}{3600} = 0.02$; both are far off. And the time is underneath, so more seconds in the hour make the speed per second **smaller**, not bigger.`,
        `速度是**每**单位时间的路程，所以它有两个单位，换算时两个都可能要变：上面的路程和下面的时间。把 $72$ km/h 换算成米每秒，把它读作一小时 $72$ km，再把千米写成米，把小时写成秒：

$$72\\text{ km/h} = \\frac{72 \\cdot 1000\\text{ m}}{3600\\text{ s}} = \\frac{72000}{3600}\\text{ m/s} = 20\\text{ m/s}.$$

换路程单位使上面乘 $1000$，换时间单位使下面乘 $3600$。合起来这个数除以了 $3.6$。数变小，是因为米每秒是更快的单位：一小时它走 $3600$ m，即 $3.6$ km。

> **注意。** 两部分都要换算。只换千米得 $72000$，只换小时得 $\\frac{72}{3600} = 0.02$，都差得很远。时间在下面，所以一小时里的秒数多，每秒的速度就**小**，而不是大。`,
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
        const direct = !isTerminating(ms);
        const two = from !== mps && to !== mps;
        const first = t(
          `$${dec(v)}\\text{ ${from.tex}}$ means $${dec(v)}$ ${distName(from).en} in one ${timeName(from).en}. Write the distance in meters and the time in seconds:`,
          `$${dec(v)}\\text{ ${from.tex}}$ 表示每${timeName(from)["zh-CN"]}走 $${dec(v)}$ ${distName(from)["zh-CN"]}。把路程写成米，把时间写成秒：`,
        );
        const toFactor = dec(Q.of(to.time).div(Q.of(to.dist)));
        const second = t(
          `One ${timeName(to).en} has $${to.time}$ seconds, so each meter per second covers $${to.time}$ m${to.dist === 1000 ? ", which is $3.6$ km," : ""} in one ${timeName(to).en}: multiply by $${toFactor}$.`,
          `一${timeName(to)["zh-CN"]}有 $${to.time}$ 秒，所以每秒 $1$ 米的速度在一${timeName(to)["zh-CN"]}里走 $${to.time}$ m${to.dist === 1000 ? "，即 $3.6$ km" : ""}：乘 $${toFactor}$。`,
        );
        const work: Text = direct
          ? t(
              `$${dec(v)}\\text{ km/h}$ means $${dec(v)}$ km in one hour. Write the kilometers as meters and the hour as $60$ minutes:${steps(`${dec(v)}\\text{ km/h} = \\frac{${dec(v)} \\cdot 1000\\text{ m}}{60\\text{ min}} = ${dec(answer)}\\text{ m/min}`)}`,
              `$${dec(v)}\\text{ km/h}$ 表示每小时走 $${dec(v)}$ km。把千米写成米，把小时写成 $60$ 分钟：${steps(`${dec(v)}\\text{ km/h} = \\frac{${dec(v)} \\cdot 1000\\text{ m}}{60\\text{ min}} = ${dec(answer)}\\text{ m/min}`)}`,
            )
          : t(
              `${from === mps ? "" : `${two ? "**Step 1: meters per second.** " : ""}${first.en}${steps(`${dec(v)}\\text{ ${from.tex}} = \\frac{${dec(v)} \\cdot ${from.dist}\\text{ m}}{${from.time}\\text{ s}} = ${dec(ms)}\\text{ m/s}`)}`}${to === mps ? "" : `${two ? `**Step 2: ${to.name.en}.** ` : ""}${second.en}${steps(`${dec(ms)}\\text{ m/s} = ${dec(ms)} \\cdot ${toFactor}\\text{ ${to.tex}} = ${dec(answer)}\\text{ ${to.tex}}`)}`}`,
              `${from === mps ? "" : `${two ? "**第一步：换算成米每秒。** " : ""}${first["zh-CN"]}${steps(`${dec(v)}\\text{ ${from.tex}} = \\frac{${dec(v)} \\cdot ${from.dist}\\text{ m}}{${from.time}\\text{ s}} = ${dec(ms)}\\text{ m/s}`)}`}${to === mps ? "" : `${two ? `**第二步：换算成${to.name["zh-CN"]}。** ` : ""}${second["zh-CN"]}${steps(`${dec(ms)}\\text{ m/s} = ${dec(ms)} \\cdot ${toFactor}\\text{ ${to.tex}} = ${dec(answer)}\\text{ ${to.tex}}`)}`}`,
            );
        const faster = to.size.cmp(from.size) > 0 ? to : from;
        const slower = faster === to ? from : to;
        const fr = faster.size.div(slower.size);
        const ratio = isTerminating(fr) ? dec(fr) : num(fr);
        const smaller = faster === to;
        return numberProblem({
          prompt: t(
            `Convert $${dec(v)}\\text{ ${from.tex}}$ to ${to.name.en}.`,
            `把 $${dec(v)}\\text{ ${from.tex}}$ 换算成${to.name["zh-CN"]}。`,
          ),
          answer,
          form: "decimal",
          // Multiplying instead of dividing; converting only the distance; converting only the time.
          wrong: [v.mul(ft).div(fd), v.mul(fd), v.div(ft)],
          solution: t(
            `${work.en}**Check.** $1\\text{ ${faster.tex}} = ${ratio}\\text{ ${slower.tex}}$, so ${faster.tex} is the faster unit and the same speed takes a ${smaller ? "smaller" : "bigger"} number of ${to.tex}: $${dec(answer)} ${smaller ? "<" : ">"} ${dec(v)}$.`,
            `${work["zh-CN"]}**检验。** $1\\text{ ${faster.tex}} = ${ratio}\\text{ ${slower.tex}}$，所以 ${faster.tex} 是更快的单位，同样的速度用 ${to.tex} 表示的数应当更${smaller ? "小" : "大"}：$${dec(answer)} ${smaller ? "<" : ">"} ${dec(v)}$。`,
          ),
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

/** mixedOne is the singular English name of the large unit of a mixed pair: "foot", "hour". */
const mixedOne = (m: Mixed) => (m.bigName.en === "feet" ? "foot" : m.bigName.en.slice(0, -1));

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

/** mixedFact writes the relation of the two units: "1\text{ h} = 60\text{ min}". */
const mixedFact = (m: Mixed) => `1\\text{ ${m.big}} = ${m.f}\\text{ ${m.small}}`;

/** givenNote states the relation of customary units, which are not taught here. */
const givenNote = (m: Mixed): Text => (m.given ? t(` ($${mixedFact(m)}$)`, `（$${mixedFact(m)}$）`) : t("", ""));

const plus = (a: Text, b: Text): Text => t(a.en + b.en, a["zh-CN"] + b["zh-CN"]);

export const mixedUnits: TopicDef = {
  id: "mixed-units",
  title: t("Converting Between Mixed Units", "复名数的换算"),
  summary: t("Convert amounts such as 3 h 25 min to a single unit, and back.", "把 3 h 25 min 这样的量换算成单一单位，以及反过来。"),
  prerequisites: ["units-of-time"],
  encompasses: [],
  xp: 12,
  intro: t(
    `We can convert hours to minutes and minutes to hours. Everyday amounts are often written in **two** units at once: a film lasts $1$ h $45$ min, a baby weighs $3$ kg $250$ g, a shelf is $1$ m $35$ cm long. Such an amount is a whole number of the large unit plus a leftover in the small unit.

To compute with it, we usually need it in one unit. In the small unit, the whole part converts and the leftover is added: $1$ h $45$ min is $60 + 45 = 105$ minutes. In the large unit, the leftover becomes a fraction of the large unit: $45$ minutes is $\\frac{45}{60} = 0.75$ of an hour, so the film lasts $1.75$ hours.

In this lesson we write mixed amounts in the smaller unit and as a decimal of the larger unit, and turn decimals back into mixed units. The key is that the digits after a decimal point count fractions of the large unit, never leftover small units.`,
    `我们已经会把小时换算成分钟、把分钟换算成小时。日常的量常常**同时**用两个单位来写：电影长 $1$ h $45$ min，婴儿重 $3$ kg $250$ g，书架长 $1$ m $35$ cm。这样的量是大单位的整数部分，加上用小单位表示的剩余部分。

要计算，通常需要把它化成一个单位。化成小单位时，换算整数部分再加上剩余部分：$1$ h $45$ min 是 $60 + 45 = 105$ 分钟。化成大单位时，剩余部分变成大单位的几分之几：$45$ 分钟是 $\\frac{45}{60} = 0.75$ 小时，所以电影长 $1.75$ 小时。

这节课把复名数化成较小的单位、化成较大单位的小数，再把小数化回复名数。关键在于：小数点后的数字表示大单位的几分之几，而不是剩下的小单位个数。`,
  ),
  knowledgePoints: [
    {
      id: "mixed-units-to-the-smaller-unit",
      title: t("Mixed units to the smaller unit", "化成较小的单位"),
      explanation: t(
        `An amount such as $3\\text{ h }25\\text{ min}$ has two parts. The $25$ minutes are already in the small unit. The $3$ hours are not: each hour breaks into $60$ minutes, so they are $3 \\cdot 60 = 180$ minutes. Add the two parts:

$$3\\text{ h }25\\text{ min} = 3 \\cdot 60 + 25 = 180 + 25 = 205\\text{ min}.$$

The same works for any pair: $2\\text{ ft }5\\text{ in}$ is $2 \\cdot 12 + 5 = 29$ inches, since a foot is $12$ inches.

> **Watch out.** Use the real factor: an hour is $60$ minutes, not $100$, so $3$ h $25$ min is not $325$ minutes. Convert the large part before adding, $3 + 25 = 28$ mixes units, and do not forget to add the small part, $180$ alone leaves out the $25$ minutes.`,
        `像 $3\\text{ h }25\\text{ min}$ 这样的量有两部分。$25$ 分钟已经是小单位。$3$ 小时还不是：每小时分成 $60$ 分钟，所以是 $3 \\cdot 60 = 180$ 分钟。把两部分相加：

$$3\\text{ h }25\\text{ min} = 3 \\cdot 60 + 25 = 180 + 25 = 205\\text{ min}.$$

任何一对单位都一样：$2\\text{ ft }5\\text{ in}$ 是 $2 \\cdot 12 + 5 = 29$ 英寸，因为一英尺是 $12$ 英寸。

> **注意。** 要用真正的换算率：一小时是 $60$ 分钟，不是 $100$ 分钟，所以 $3$ h $25$ min 不是 $325$ 分钟。相加之前先换算大单位的部分，$3 + 25 = 28$ 把单位混在了一起；也别忘了加上小单位的部分，只写 $180$ 就漏掉了那 $25$ 分钟。`,
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
            `**Step 1: convert the large part.** Since $${mixedFact(m)}$, each of the $${a}$ ${m.bigName.en} breaks into $${m.f}$ ${m.smallName.en}:${steps(`${a}\\text{ ${m.big}} = ${a} \\cdot ${m.f}\\text{ ${m.small}} = ${a * m.f}\\text{ ${m.small}}`)}**Step 2: add the small part.** The $${b}$ ${m.smallName.en} are already in the small unit:${steps(`${mixedQty(a, b, m)} = ${a * m.f} + ${b} = ${answer}\\text{ ${m.small}}`)}**Check.** Going back, $${answer} \\div ${m.f}$ is $${a}$ with $${answer} - ${a * m.f} = ${b}$ left over: $${mixedQty(a, b, m)}$.`,
            `**第一步：换算大单位的部分。** 因为 $${mixedFact(m)}$，$${a}$ ${m.bigName["zh-CN"]}中的每一个都分成 $${m.f}$ ${m.smallName["zh-CN"]}：${steps(`${a}\\text{ ${m.big}} = ${a} \\cdot ${m.f}\\text{ ${m.small}} = ${a * m.f}\\text{ ${m.small}}`)}**第二步：加上小单位的部分。** $${b}$ ${m.smallName["zh-CN"]}已经是小单位：${steps(`${mixedQty(a, b, m)} = ${a * m.f} + ${b} = ${answer}\\text{ ${m.small}}`)}**检验。** 换算回去，$${answer} \\div ${m.f}$ 商 $${a}$，余 $${answer} - ${a * m.f} = ${b}$：正是 $${mixedQty(a, b, m)}$。`,
          ),
        });
      },
    },
    {
      id: "mixed-units-to-a-decimal",
      title: t("Mixed units as a decimal", "化成小数"),
      explanation: t(
        `To write $2\\text{ h }15\\text{ min}$ in hours, keep the $2$ whole hours and ask what part of an hour the $15$ minutes are. An hour is $60$ minutes, so $15$ minutes are $15$ sixtieths of an hour:

$$15\\text{ min} = \\frac{15}{60}\\text{ h} = 0.25\\text{ h}, \\qquad 2\\text{ h }15\\text{ min} = 2 + 0.25 = 2.25\\text{ h}.$$

A quarter of an hour is $0.25$ hours, which matches what we know about clocks.

> **Watch out.** It is not $2.15$ hours: the digits after the point are hundredths of an hour, not minutes, and $0.15$ hours is only $9$ minutes. Divide the small part by the factor of the units, $60$ here, not by $100$.`,
        `要把 $2\\text{ h }15\\text{ min}$ 化成小时，保留 $2$ 个整小时，再问 $15$ 分钟是一小时的几分之几。一小时是 $60$ 分钟，所以 $15$ 分钟是六十分之十五小时：

$$15\\text{ min} = \\frac{15}{60}\\text{ h} = 0.25\\text{ h}, \\qquad 2\\text{ h }15\\text{ min} = 2 + 0.25 = 2.25\\text{ h}.$$

一刻钟是 $0.25$ 小时，和我们对钟表的认识一致。

> **注意。** 不是 $2.15$ 小时：小数点后的数字是百分之几小时，不是分钟数，$0.15$ 小时只有 $9$ 分钟。小单位的部分要除以这两个单位的换算率，这里是 $60$，而不是 $100$。`,
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
            `**Step 1: the small part as a fraction.** Since $${mixedFact(m)}$, the $${b}$ ${m.smallName.en} are $${b}$ parts out of the $${m.f}$ in one ${mixedOne(m)}:${steps(`${b}\\text{ ${m.small}} = \\frac{${b}}{${m.f}}\\text{ ${m.big}} = ${qty(part, m.big)}`)}**Step 2: add the whole part.**${steps(`${mixedQty(a, b, m)} = ${a} + ${dec(part)} = ${qty(answer, m.big)}`)}**Check.** The decimal part times the factor gives back the small part: $${dec(part)} \\cdot ${m.f} = ${b}$.`,
            `**第一步：把小单位的部分化成分数。** 因为 $${mixedFact(m)}$，$${b}$ ${m.smallName["zh-CN"]}是 $1$ ${m.big} 的 $${m.f}$ 份中的 $${b}$ 份：${steps(`${b}\\text{ ${m.small}} = \\frac{${b}}{${m.f}}\\text{ ${m.big}} = ${qty(part, m.big)}`)}**第二步：加上整数部分。**${steps(`${mixedQty(a, b, m)} = ${a} + ${dec(part)} = ${qty(answer, m.big)}`)}**检验。** 小数部分乘换算率，应当得回小单位的部分：$${dec(part)} \\cdot ${m.f} = ${b}$。`,
          ),
        });
      },
    },
    {
      id: "decimals-to-mixed-units",
      title: t("Decimals to mixed units", "小数化成复名数"),
      explanation: t(
        `To write $3.4$ hours in hours and minutes, split it into the whole hours, $3$, and the part of an hour, $0.4$. The part is $0.4$ of $60$ minutes:

$$0.4\\text{ h} = 0.4 \\cdot 60\\text{ min} = 24\\text{ min}, \\qquad 3.4\\text{ h} = 3\\text{ h }24\\text{ min}.$$

Multiplying is right because a minute is the smaller unit, so the part of an hour becomes more minutes.

> **Watch out.** It is not $3$ h $4$ min or $3$ h $40$ min: the digits after the point are tenths of an hour, not minutes. Convert the decimal part by multiplying by the factor of the units, $60$ here.`,
        `要把 $3.4$ 小时写成几小时几分钟，把它分成整小时 $3$ 和不足一小时的部分 $0.4$。这部分是 $60$ 分钟的 $0.4$：

$$0.4\\text{ h} = 0.4 \\cdot 60\\text{ min} = 24\\text{ min}, \\qquad 3.4\\text{ h} = 3\\text{ h }24\\text{ min}.$$

用乘法是因为分钟是较小的单位，不足一小时的部分要化成更多的分钟。

> **注意。** 不是 $3$ h $4$ min，也不是 $3$ h $40$ min：小数点后的数字是十分之几小时，不是分钟数。小数部分要乘这两个单位的换算率来换算，这里是 $60$。`,
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
            `**Step 1: split off the whole part.** $${qty(v, m.big)}$ is $${a}$ whole ${m.bigName.en} and $${dec(part)}$ of a ${mixedOne(m)} more.

**Step 2: convert the decimal part.** Since $${mixedFact(m)}$, the part is $${dec(part)}$ of $${m.f}$ ${m.smallName.en}:${steps(`${qty(part, m.big)} = ${dec(part)} \\cdot ${m.f}\\text{ ${m.small}} = ${b}\\text{ ${m.small}}`)}So $${qty(v, m.big)} = ${mixedQty(a, b, m)}$.

**Check.** Back to a decimal: $\\frac{${b}}{${m.f}} = ${dec(part)}$, and $${a} + ${dec(part)} = ${dec(v)}$.`,
            `**第一步：分出整数部分。** $${qty(v, m.big)}$ 是 $${a}$ 个整${m.bigName["zh-CN"]}，再多 $${dec(part)}$ ${m.big}。

**第二步：换算小数部分。** 因为 $${mixedFact(m)}$，这部分是 $${m.f}$ ${m.smallName["zh-CN"]}的 $${dec(part)}$：${steps(`${qty(part, m.big)} = ${dec(part)} \\cdot ${m.f}\\text{ ${m.small}} = ${b}\\text{ ${m.small}}`)}所以 $${qty(v, m.big)} = ${mixedQty(a, b, m)}$。

**检验。** 化回小数：$\\frac{${b}}{${m.f}} = ${dec(part)}$，$${a} + ${dec(part)} = ${dec(v)}$。`,
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

/** squareWhy explains why a square of the large unit holds the square of the factor in small squares. */
const squareWhy = (p: AreaPair): Text =>
  t(
    `A square $1$ ${p.big} on each side has sides of $${p.f}\\text{ ${p.small}}$, so it holds $${p.f}$ rows of $${p.f}$ small squares:`,
    `边长 $1\\text{ ${p.big}}$ 的正方形，每边是 $${p.f}\\text{ ${p.small}}$，所以它含 $${p.f}$ 行、每行 $${p.f}$ 个小正方形：`,
  );

/** areaGrid draws a square centimeter cut into a grid of square millimeters, ten on each side. */
const areaGrid: Figure = drawing(
  [
    rect(0, 0, 5, 5),
    ...range(1, 9).flatMap((i) => [seg([i / 2, 0], [i / 2, 5]), seg([0, i / 2], [5, i / 2])]),
    seg([0, 0], [0.5, 0], "accent"),
    seg([0, 0], [0, 0.5], "accent"),
    side([0, 0], [5, 0], "1 cm = 10 mm"),
    side([5, 0], [5, 5], "1 cm = 10 mm"),
    note([2.5, 5], "1 cm² = 10 · 10 mm² = 100 mm²", "n"),
  ],
  "A square 1 cm on each side, cut into a grid of 10 by 10 squares 1 mm on each side: 1 cm² = 100 mm².",
  "边长 1 cm 的正方形，分成 10 × 10 个边长 1 mm 的小正方形：1 cm² = 100 mm²。",
);

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
  intro: t(
    `We convert lengths with a single factor: $1\\text{ cm} = 10\\text{ mm}$. An area is not a length, though. It counts **unit squares**: an area of $6\\text{ cm}^2$ means six squares $1$ cm on each side.

So how many square millimeters are in a square centimeter? Cut the square centimeter into squares $1$ mm on each side. Each side is $10$ mm long, so the grid has $10$ rows of $10$ small squares:

{{figure 0}}

$$1\\text{ cm}^2 = 10 \\cdot 10\\text{ mm}^2 = 100\\text{ mm}^2.$$

The factor for areas is the **square** of the factor for lengths, because a square is stretched in two directions. In the same way $1\\text{ m}^2 = 100 \\cdot 100 = 10000\\text{ cm}^2$. In this lesson we convert areas to smaller and to larger units with the squared factor, and find areas of rectangles in a unit other than that of their sides.`,
    `长度用一个换算率换算：$1\\text{ cm} = 10\\text{ mm}$。但面积不是长度，它数的是**单位正方形**：$6\\text{ cm}^2$ 的面积，就是六个边长 $1$ cm 的正方形。

那么一平方厘米里有多少平方毫米？把一平方厘米分成边长 $1$ mm 的小正方形。每边长 $10$ mm，所以共有 $10$ 行，每行 $10$ 个小正方形：

{{figure 0}}

$$1\\text{ cm}^2 = 10 \\cdot 10\\text{ mm}^2 = 100\\text{ mm}^2.$$

面积的换算率是长度换算率的**平方**，因为正方形在两个方向上都被放大了。同样，$1\\text{ m}^2 = 100 \\cdot 100 = 10000\\text{ cm}^2$。这节课用平方后的换算率把面积换算成较小和较大的单位，并用与边长不同的单位求长方形的面积。`,
  ),
  introFigures: [areaGrid],
  knowledgePoints: [
    {
      id: "area-to-smaller-units",
      title: t("Converting to a smaller unit", "换算成较小的单位"),
      explanation: t(
        `A square meter is a square $1$ m on each side. Each side is $100$ cm, so the square holds $100$ rows of $100$ square centimeters:

$$1\\text{ m}^2 = 100 \\cdot 100\\text{ cm}^2 = 10000\\text{ cm}^2.$$

To convert an area to a smaller unit, multiply by this **squared** factor, for the same reason as with lengths: each large square breaks into many small ones.

$$3.5\\text{ m}^2 = 3.5 \\cdot 10000\\text{ cm}^2 = 35000\\text{ cm}^2.$$

> **Watch out.** Multiplying by the length factor alone, $3.5 \\cdot 100 = 350\\text{ cm}^2$, counts only one row of each square meter. Doubling the factor, $2 \\cdot 100 = 200$, is not squaring it either. And dividing makes the number smaller, which a smaller unit never does.`,
        `一平方米是边长 $1$ m 的正方形。每边是 $100$ cm，所以这个正方形含 $100$ 行、每行 $100$ 个平方厘米：

$$1\\text{ m}^2 = 100 \\cdot 100\\text{ cm}^2 = 10000\\text{ cm}^2.$$

把面积换算成较小的单位，要乘这个**平方后**的换算率，道理和长度一样：每个大正方形分成许多小正方形。

$$3.5\\text{ m}^2 = 3.5 \\cdot 10000\\text{ cm}^2 = 35000\\text{ cm}^2.$$

> **注意。** 只乘长度的换算率，$3.5 \\cdot 100 = 350\\text{ cm}^2$，每个平方米只数了一行。把换算率乘 $2$，$2 \\cdot 100 = 200$，也不是平方。用除法会使数变小，而换成较小的单位数绝不会变小。`,
      ),
      keyPrerequisites: ["metric-units-of-length"],
      generate(rng) {
        const p = rng.pick(areaPairs);
        const v = p.given ? Q.of(rng.int(2, 20)).add(rng.bool(0.3) ? q(1, 2) : Q.zero) : decimal(rng, 30, rng.int(0, 1));
        const f2 = Q.of(p.f * p.f);
        const answer = v.mul(f2);
        const why = squareWhy(p);
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
            `**Step 1: the squared factor.** ${why.en}${steps(areaFact(p))}**Step 2: multiply.** Each ${p.big}² breaks into $${p.f * p.f}$ smaller squares, so multiply:${steps(`${qty(v, `${p.big}^2`)} = ${dec(v)} \\cdot ${p.f * p.f}${unitLatex(`${p.small}^2`)} = ${qty(answer, `${p.small}^2`)}`)}**Check.** The smaller unit gives the bigger number, $${dec(answer)} > ${dec(v)}$, and going back, $${dec(answer)} \\div ${p.f * p.f} = ${dec(v)}$.`,
            `**第一步：平方后的换算率。** ${why["zh-CN"]}${steps(areaFact(p))}**第二步：相乘。** 每个 ${p.big}² 分成 $${p.f * p.f}$ 个小正方形，所以乘：${steps(`${qty(v, `${p.big}^2`)} = ${dec(v)} \\cdot ${p.f * p.f}${unitLatex(`${p.small}^2`)} = ${qty(answer, `${p.small}^2`)}`)}**检验。** 较小的单位给出较大的数，$${dec(answer)} > ${dec(v)}$；换算回去，$${dec(answer)} \\div ${p.f * p.f} = ${dec(v)}$。`,
          ),
        });
      },
    },
    {
      id: "area-to-larger-units",
      title: t("Converting to a larger unit", "换算成较大的单位"),
      explanation: t(
        `To convert an area to a larger unit, ask how many large squares the small ones fill. Since $1\\text{ ft} = 12\\text{ in}$, a square foot holds $12 \\cdot 12 = 144$ square inches, so every $144$ square inches make one square foot. **Divide** by the squared factor:

$$360\\text{ in}^2 = (360 \\div 144)\\text{ ft}^2 = 2.5\\text{ ft}^2.$$

The number gets smaller, as it must for a larger unit: two and a half square feet is a small rug, and it holds $360$ little squares of an inch.

> **Watch out.** Dividing by $12$ gives $30\\text{ ft}^2$, twelve times too much: one square foot is $144$ square inches, not $12$. Dividing by $24$ doubles the factor instead of squaring it. And multiplying makes the number grow, which a larger unit never does.`,
        `把面积换算成较大的单位，就问这些小正方形能拼成几个大正方形。因为 $1\\text{ ft} = 12\\text{ in}$，一平方英尺含 $12 \\cdot 12 = 144$ 平方英寸，所以每 $144$ 平方英寸合成一平方英尺。要**除以**平方后的换算率：

$$360\\text{ in}^2 = (360 \\div 144)\\text{ ft}^2 = 2.5\\text{ ft}^2.$$

数变小了，换成较大的单位就应当这样：两平方英尺半是一块小地毯，它含 $360$ 个边长一英寸的小正方形。

> **注意。** 除以 $12$ 得 $30\\text{ ft}^2$，多了十二倍：一平方英尺是 $144$ 平方英寸，不是 $12$。除以 $24$ 是把换算率乘 $2$ 而不是平方。用乘法会使数变大，而换成较大的单位数绝不会变大。`,
      ),
      generate(rng) {
        const p = rng.pick(areaPairs);
        const answer = p.given ? Q.of(rng.int(1, 12)).add(q(rng.int(0, 3), 4)) : decimal(rng, 20, rng.int(1, 2));
        const f2 = Q.of(p.f * p.f);
        const v = answer.mul(f2);
        const why = squareWhy(p);
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
            `**Step 1: the squared factor.** ${why.en}${steps(areaFact(p))}**Step 2: divide.** Every $${p.f * p.f}$ small squares make one ${p.big}², so divide:${steps(`${qty(v, `${p.small}^2`)} = (${dec(v)} \\div ${p.f * p.f})${unitLatex(`${p.big}^2`)} = ${qty(answer, `${p.big}^2`)}`)}**Check.** The larger unit gives the smaller number, $${dec(answer)} < ${dec(v)}$, and going back, $${dec(answer)} \\cdot ${p.f * p.f} = ${dec(v)}$.`,
            `**第一步：平方后的换算率。** ${why["zh-CN"]}${steps(areaFact(p))}**第二步：相除。** 每 $${p.f * p.f}$ 个小正方形合成 $1$ ${p.big}²，所以除：${steps(`${qty(v, `${p.small}^2`)} = (${dec(v)} \\div ${p.f * p.f})${unitLatex(`${p.big}^2`)} = ${qty(answer, `${p.big}^2`)}`)}**检验。** 较大的单位给出较小的数，$${dec(answer)} < ${dec(v)}$；换算回去，$${dec(answer)} \\cdot ${p.f * p.f} = ${dec(v)}$。`,
          ),
        });
      },
    },
    {
      id: "areas-of-rectangles-in-other-units",
      figure: algebraDrawings["converting-units-of-area#areas-of-rectangles-in-other-units"],
      title: t("Areas in another unit", "用另一种单位表示面积"),
      explanation: t(
        `When the sides of a rectangle are in one unit and the area is wanted in another, there are two safe routes. Either convert each **side** with the length factor and then multiply, or find the area first and convert it with the **squared** factor. A rectangle $1.2$ m by $0.5$ m is $120$ cm by $50$ cm, so

$$120 \\cdot 50 = 6000\\text{ cm}^2 \\qquad \\text{or} \\qquad 1.2 \\cdot 0.5 = 0.6\\text{ m}^2 = 0.6 \\cdot 10000\\text{ cm}^2 = 6000\\text{ cm}^2.$$

The two routes agree, so one can check the other.

> **Watch out.** Do not mix the routes: finding $0.6\\text{ m}^2$ and then multiplying by $100$ uses the length factor on an area and gives $60\\text{ cm}^2$. And do not leave the answer in the old unit: $0.6$ is square meters, not square centimeters.`,
        `长方形的边长用一种单位、面积要用另一种单位时，有两条稳妥的路。要么用长度换算率换算每条**边**再相乘，要么先求面积，再用**平方后**的换算率换算。$1.2$ m 乘 $0.5$ m 的长方形就是 $120$ cm 乘 $50$ cm，所以

$$120 \\cdot 50 = 6000\\text{ cm}^2 \\qquad \\text{或} \\qquad 1.2 \\cdot 0.5 = 0.6\\text{ m}^2 = 0.6 \\cdot 10000\\text{ cm}^2 = 6000\\text{ cm}^2.$$

两条路结果相同，所以可以互相检验。

> **注意。** 不要把两条路混在一起：求出 $0.6\\text{ m}^2$ 后再乘 $100$，是把长度的换算率用在面积上，得 $60\\text{ cm}^2$。也不要把答案留在原来的单位：$0.6$ 是平方米数，不是平方厘米数。`,
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
              `**Step 1: convert the sides.** Each ${p.big} is $${p.f}\\text{ ${p.small}}$, a smaller unit, so multiply each side by $${p.f}$:${steps(`${qty(l, p.big)} = ${qty(l.mul(f), p.small)}, \\quad ${qty(w, p.big)} = ${qty(w.mul(f), p.small)}`)}**Step 2: multiply.** The area is length times width, now in ${p.smallName.en}:${steps(`A = ${dec(l.mul(f))} \\cdot ${dec(w.mul(f))} = ${qty(answer, `${p.small}^2`)}`)}**Check.** By the other route, the area is $${dec(l)} \\cdot ${dec(w)} = ${qty(area, `${p.big}^2`)}$, and $${dec(area)} \\cdot ${p.f * p.f} = ${dec(answer)}$.`,
              `**第一步：换算边长。** $1\\text{ ${p.big}} = ${p.f}\\text{ ${p.small}}$，${p.small} 是较小的单位，所以每条边乘 $${p.f}$：${steps(`${qty(l, p.big)} = ${qty(l.mul(f), p.small)}, \\quad ${qty(w, p.big)} = ${qty(w.mul(f), p.small)}`)}**第二步：相乘。** 面积等于长乘宽，现在以${p.smallName["zh-CN"]}为单位：${steps(`A = ${dec(l.mul(f))} \\cdot ${dec(w.mul(f))} = ${qty(answer, `${p.small}^2`)}`)}**检验。** 走另一条路，面积是 $${dec(l)} \\cdot ${dec(w)} = ${qty(area, `${p.big}^2`)}$，而 $${dec(area)} \\cdot ${p.f * p.f} = ${dec(answer)}$。`,
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
            `**Step 1: convert the sides.** Every $${p.f}\\text{ ${p.small}}$ make one ${p.big}, a larger unit, so divide each side by $${p.f}$:${steps(`${qty(l, p.small)} = ${qty(l.div(f), p.big)}, \\quad ${qty(w, p.small)} = ${qty(w.div(f), p.big)}`)}**Step 2: multiply.** The area is length times width, now in ${p.bigName.en}:${steps(`A = ${dec(l.div(f))} \\cdot ${dec(w.div(f))} = ${qty(answer, `${p.big}^2`)}`)}**Check.** By the other route, the area is $${dec(l)} \\cdot ${dec(w)} = ${qty(area, `${p.small}^2`)}$, and $${dec(area)} \\div ${p.f * p.f} = ${dec(answer)}$.`,
            `**第一步：换算边长。** 每 $${p.f}\\text{ ${p.small}}$ 合成 $1\\text{ ${p.big}}$，${p.big} 是较大的单位，所以每条边除以 $${p.f}$：${steps(`${qty(l, p.small)} = ${qty(l.div(f), p.big)}, \\quad ${qty(w, p.small)} = ${qty(w.div(f), p.big)}`)}**第二步：相乘。** 面积等于长乘宽，现在以${p.bigName["zh-CN"]}为单位：${steps(`A = ${dec(l.div(f))} \\cdot ${dec(w.div(f))} = ${qty(answer, `${p.big}^2`)}`)}**检验。** 走另一条路，面积是 $${dec(l)} \\cdot ${dec(w)} = ${qty(area, `${p.small}^2`)}$，而 $${dec(area)} \\div ${p.f * p.f} = ${dec(answer)}$。`,
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

/** unitWork writes the solution of a question on units: the reason, the units worked like factors, and a check. */
const unitWork = (reason: Text, work: string, check: Text): Text =>
  t(`${reason.en}\n\n$$${work}$$\n\n**Check.** ${check.en}`, `${reason["zh-CN"]}\n\n$$${work}$$\n\n**检验。** ${check["zh-CN"]}`);

/** cancel explains how units cancel in a product or quotient, with a check that the result is the right kind of unit. */
const cancel = (work: string, check: Text): Text =>
  unitWork(
    t(
      "Put the units of each quantity into the formula and treat them like factors: multiply them, and cancel a unit that appears both on top and underneath.",
      "把每个量的单位代入公式，把单位当作因数：相乘，分子分母中都有的单位约掉。",
    ),
    work,
    check,
  );

/** solvedFor explains finding the units of a quantity by solving the formula for it first. */
const solvedFor = (v: string, solved: string, work: string, check: Text): Text =>
  unitWork(
    t(
      `The formula does not give $${v}$ alone, so solve for it first: $${v} = ${solved}$. Then put in the units and treat them like factors:`,
      `公式没有单独给出 $${v}$，所以先解出它：$${v} = ${solved}$。再代入单位，把单位当作因数：`,
    ),
    work,
    check,
  );

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
        solution: cancel(
          `\\frac{${tx(l)}}{${tx(s)}} \\cdot ${tx(s)} = ${tx(l)}`,
          t(
            `A distance must come out as a length, and $${tx(l)}$ is one: going $r$ ${l} each ${s} for $t$ ${s} covers $rt$ ${l}.`,
            `距离应当是长度单位，$${tx(l)}$ 正是：每 ${s} 走 $r$ ${l}，走 $t$ ${s} 就是 $rt$ ${l}。`,
          ),
        ),
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
        solution: cancel(
          `${tx(l)} \\cdot ${tx(l)} = ${sq(l)}`,
          t(
            `An area counts squares $1$ ${l} on each side, so it must be in square units.`,
            `面积数的是边长 $1$ ${l} 的正方形，所以单位应当是平方单位。`,
          ),
        ),
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
        solution: cancel(
          `${tx(l)} \\cdot ${tx(l)} \\cdot ${tx(l)} = ${cube(l)}`,
          t(
            `A volume counts cubes $1$ ${l} on each edge, so it must be in cubic units.`,
            `体积数的是棱长 $1$ ${l} 的正方体，所以单位应当是立方单位。`,
          ),
        ),
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
        solution: cancel(
          `\\frac{${tx(g)}}{${cube(l)}} \\cdot ${cube(l)} = ${tx(g)}`,
          t(
            `A mass must come out in a unit of mass, and $${tx(g)}$ is one: $D$ ${g} in each ${l}³, for $V$ of them, is $DV$ ${g}.`,
            `质量应当是质量单位，$${tx(g)}$ 正是：每 ${l}³ 有 $D$ ${g}，$V$ 个就是 $DV$ ${g}。`,
          ),
        ),
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
        solution: cancel(
          `\\frac{\\$}{${tx(u)}} \\cdot ${tx(u)} = \\$`,
          t(
            `A cost is an amount of money, so it must be in dollars: $p$ dollars for each ${u}, for $n$ ${u}, is $pn$ dollars.`,
            `总价是一笔钱，单位应当是美元：每 ${u} $p$ 美元，买 $n$ ${u} 就是 $pn$ 美元。`,
          ),
        ),
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
        solution: cancel(
          `\\frac{${tx(l)}}{${tx(s)}} = ${per(l, s)}`,
          t(
            `A speed says how far is gone **per** unit of time, so the distance unit is on top and the time unit underneath; $${per(s, l)}$ would be time per distance.`,
            `速度说的是**每**单位时间走多远，所以路程单位在上、时间单位在下；$${per(s, l)}$ 是每单位路程的时间。`,
          ),
        ),
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
        solution: cancel(
          `\\frac{${tx(g)}}{${cube(l)}} = ${perCube(g, l)}`,
          t(
            `A density says how much mass there is **per** unit of volume, so the mass unit is on top and the volume unit underneath.`,
            `密度说的是**每**单位体积有多少质量，所以质量单位在上、体积单位在下。`,
          ),
        ),
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
        solution: solvedFor(
          "r",
          "\\frac{d}{t}",
          `\\frac{${tx(l)}}{${tx(s)}} = ${per(l, s)}`,
          t(
            `Put the units back into $d = rt$: $${per(l, s)} \\cdot ${tx(s)} = ${tx(l)}$, the units of $d$.`,
            `把单位代回 $d = rt$：$${per(l, s)} \\cdot ${tx(s)} = ${tx(l)}$，正是 $d$ 的单位。`,
          ),
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
        solution: solvedFor(
          "t",
          "\\frac{d}{r}",
          `${tx(l)} \\div \\frac{${tx(l)}}{${tx(s)}} = ${tx(l)} \\cdot \\frac{${tx(s)}}{${tx(l)}} = ${tx(s)}`,
          t(
            `Put the units back into $d = rt$: $${per(l, s)} \\cdot ${tx(s)} = ${tx(l)}$, the units of $d$. A time in $${tx(s)}$ is also what we expect.`,
            `把单位代回 $d = rt$：$${per(l, s)} \\cdot ${tx(s)} = ${tx(l)}$，正是 $d$ 的单位。时间以 $${tx(s)}$ 为单位，也合乎预期。`,
          ),
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
        solution: solvedFor(
          "w",
          "\\frac{A}{l}",
          `\\frac{${sq(l)}}{${tx(l)}} = ${tx(l)}`,
          t(
            `A width is a length, and $${tx(l)} \\cdot ${tx(l)} = ${sq(l)}$ gives back the units of $A$.`,
            `宽是长度，而 $${tx(l)} \\cdot ${tx(l)} = ${sq(l)}$ 正好得回 $A$ 的单位。`,
          ),
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
        solution: solvedFor(
          "B",
          "\\frac{V}{h}",
          `\\frac{${cube(l)}}{${tx(l)}} = ${sq(l)}`,
          t(
            `A base area is an area, in square units, and $${sq(l)} \\cdot ${tx(l)} = ${cube(l)}$ gives back the units of $V$.`,
            `底面积是面积，用平方单位，而 $${sq(l)} \\cdot ${tx(l)} = ${cube(l)}$ 正好得回 $V$ 的单位。`,
          ),
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
        solution: solvedFor(
          "p",
          "\\frac{C}{n}",
          `\\frac{\\$}{${tx(u)}} = \\$/${tx(u)}`,
          t(
            `A price is dollars **per** ${u}, and $\\$/${tx(u)} \\cdot ${tx(u)} = \\$$ gives back the units of $C$.`,
            `单价是**每** ${u} 多少美元，而 $\\$/${tx(u)} \\cdot ${tx(u)} = \\$$ 正好得回 $C$ 的单位。`,
          ),
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
        solution: solvedFor(
          "V",
          "\\frac{m}{D}",
          `${tx(g)} \\div \\frac{${tx(g)}}{${cube(l)}} = ${tx(g)} \\cdot \\frac{${cube(l)}}{${tx(g)}} = ${cube(l)}`,
          t(
            `A volume is in cubic units, and $${tx(g)} \\div ${cube(l)} = ${perCube(g, l)}$ gives back the units of $D$.`,
            `体积用立方单位，而 $${tx(g)} \\div ${cube(l)} = ${perCube(g, l)}$ 正好得回 $D$ 的单位。`,
          ),
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
  intro: t(
    `A unit rate such as $60$ km/h already mixes two units: kilometers **per** hour, a distance divided by a time. And the area of a rectangle $3$ m by $2$ m is $6\\text{ m}^2$: meters times meters. When we evaluate a formula, the units take part in the arithmetic along with the numbers.

Take a car going $60$ km/h for $2$ h. By $d = rt$,

$$d = 60\\,\\frac{\\text{km}}{\\text{h}} \\cdot 2\\text{ h} = 120\\text{ km}.$$

The hours on top and underneath cancel, just as $\\frac{5}{3} \\cdot 3 = 5$, and what is left, kilometers, is exactly what a distance should be measured in.

So units can be multiplied, divided and cancelled like factors. In this lesson we use this to find the units of the result of a formula, and of any other quantity in it, by solving for that quantity first.`,
    `像 $60$ km/h 这样的单位率已经把两个单位结合在一起：千米**每**小时，即路程除以时间。$3$ m 乘 $2$ m 的长方形面积是 $6\\text{ m}^2$：米乘米。用公式计算时，单位和数一起参与运算。

一辆汽车以 $60$ km/h 行驶 $2$ h。由 $d = rt$，

$$d = 60\\,\\frac{\\text{km}}{\\text{h}} \\cdot 2\\text{ h} = 120\\text{ km}.$$

上下的小时约掉了，就像 $\\frac{5}{3} \\cdot 3 = 5$；剩下的千米，正是距离应有的单位。

所以单位可以像因数一样相乘、相除、约分。这节课用这一点求公式结果的单位，以及公式中其他量的单位（先解出那个量）。`,
  ),
  knowledgePoints: [
    {
      id: "units-of-the-result",
      title: t("Units of the result", "结果的单位"),
      explanation: t(
        `To find the units of what a formula computes, put the units of the inputs into it and work them like factors. In $d = rt$ with $r$ in $\\text{km/h}$ and $t$ in $\\text{h}$, the hours cancel:

$$\\frac{\\text{km}}{\\text{h}} \\cdot \\text{h} = \\text{km}.$$

Two more patterns come up often. A unit multiplied by itself is **squared**: in $A = lw$, $\\text{m} \\cdot \\text{m} = \\text{m}^2$, and a third factor makes it cubed. A quotient of units is a **rate**: in $v = \\frac{d}{t}$, $\\text{km} \\div \\text{h} = \\text{km/h}$. Then check that the result is the right kind of unit: a length for a distance, money for a cost.

> **Watch out.** Cancel what appears on top and underneath: $\\text{km/h} \\cdot \\text{h}$ is $\\text{km}$, not $\\text{km/h}$ and not $\\text{km} \\cdot \\text{h}$. And keep the order of a quotient: distance over time is $\\text{km/h}$; $\\text{h/km}$ would be hours per kilometer.`,
        `要确定公式计算结果的单位，把输入量的单位代入公式，像因数一样运算。在 $d = rt$ 中，若 $r$ 的单位是 $\\text{km/h}$，$t$ 的单位是 $\\text{h}$，小时就约掉了：

$$\\frac{\\text{km}}{\\text{h}} \\cdot \\text{h} = \\text{km}.$$

还有两种常见的情形。单位与自身相乘得到**平方**：在 $A = lw$ 中 $\\text{m} \\cdot \\text{m} = \\text{m}^2$，再乘一个就是立方。单位相除得到**比率**：在 $v = \\frac{d}{t}$ 中 $\\text{km} \\div \\text{h} = \\text{km/h}$。最后检验结果的单位种类是否合理：距离是长度，总价是钱。

> **注意。** 分子分母中都有的单位要约掉：$\\text{km/h} \\cdot \\text{h}$ 是 $\\text{km}$，不是 $\\text{km/h}$，也不是 $\\text{km} \\cdot \\text{h}$。相除时顺序不能颠倒：路程除以时间是 $\\text{km/h}$；$\\text{h/km}$ 是每千米用几小时。`,
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
        `To find the units of a quantity that is not alone on one side, first solve the formula for it, then work out the units in the same way. In $d = rt$ with $d$ in $\\text{mi}$ and $t$ in $\\text{h}$, solving gives $r = \\frac{d}{t}$, so $r$ is in

$$\\frac{\\text{mi}}{\\text{h}} = \\text{mi/h}.$$

Check by putting the units back into the original formula: $\\text{mi/h} \\cdot \\text{h} = \\text{mi}$, the units of $d$. Dividing by a rate flips it: $t = \\frac{d}{r}$ is in $\\text{mi} \\div \\frac{\\text{mi}}{\\text{h}} = \\text{mi} \\cdot \\frac{\\text{h}}{\\text{mi}} = \\text{h}$.

> **Watch out.** Solving for $r$ divides by $t$, so the time unit goes **underneath**: $\\text{h/mi}$ has the quotient upside down, and $\\text{mi} \\cdot \\text{h}$ multiplies where the formula divides. The check catches both, since neither gives back the units of $d$.`,
        `要确定公式中不单独在一边的量的单位，先把公式变形，解出这个量，再同样计算单位。在 $d = rt$ 中，若 $d$ 的单位是 $\\text{mi}$，$t$ 的单位是 $\\text{h}$，解得 $r = \\frac{d}{t}$，所以 $r$ 的单位是

$$\\frac{\\text{mi}}{\\text{h}} = \\text{mi/h}.$$

把单位代回原公式检验：$\\text{mi/h} \\cdot \\text{h} = \\text{mi}$，正是 $d$ 的单位。除以一个比率要把它倒过来：$t = \\frac{d}{r}$ 的单位是 $\\text{mi} \\div \\frac{\\text{mi}}{\\text{h}} = \\text{mi} \\cdot \\frac{\\text{h}}{\\text{mi}} = \\text{h}$。

> **注意。** 解出 $r$ 要除以 $t$，所以时间单位在**下面**：$\\text{h/mi}$ 把商写倒了，$\\text{mi} \\cdot \\text{h}$ 则把公式里的除法当成了乘法。代回检验能发现这两种错误，因为它们都得不回 $d$ 的单位。`,
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

/** changeWords says how a quantity moves by k units each unit of time: "rises by 3 centimeters each week". */
function changeWords(d: ChangeData): Text {
  const n = Math.abs(d.k);
  const [, one, , zhRate] = d.c.time;
  return t(
    `${d.k < 0 ? "falls" : "rises"} by $${n}$ ${n === 1 ? d.c.unit[1] : d.c.unit[0]} each ${one}`,
    `每${zhRate}${d.k < 0 ? "减少" : "增加"} $${n}$ ${d.c.unit[2]}`,
  );
}

export const unitsOfRatesOfChange: TopicDef = {
  id: "units-of-rates-of-change",
  title: t("Selecting Units for Rates of Change", "变化率的单位"),
  summary: t("Find a rate of change between two times and give it the right units.", "求两个时刻之间的变化率，并写出正确的单位。"),
  prerequisites: ["units-in-formulas"],
  encompasses: [{ topic: "unit-rates", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSN.Q.A.1", "CCSS.HSF.IF.B.6"],
  intro: t(
    `Units work like factors: dividing kilometers by hours gives kilometers per hour. A **rate of change** is such a quotient. It tells how fast a quantity changes: how much it changes for each unit of time.

Suppose a plant is $12$ cm tall after $2$ weeks and $20$ cm tall after $6$ weeks. In those $6 - 2 = 4$ weeks it grew $20 - 12 = 8$ cm, so it grew

$$\\frac{8\\text{ cm}}{4\\text{ weeks}} = 2\\text{ cm per week}.$$

The number $2$ alone says little; the units say what it means, centimeters of height for each week of time. A quantity that shrinks, such as a burning candle, has a negative rate of change. In this lesson we choose the units of a rate of change and compute it from two readings.`,
    `单位像因数一样运算：千米除以小时得到千米每小时。**变化率**就是这样的商。它说明一个量变化得多快：每单位时间变化多少。

假设一株植物 $2$ 周后高 $12$ cm，$6$ 周后高 $20$ cm。在这 $6 - 2 = 4$ 周里它长高了 $20 - 12 = 8$ cm，所以它长高的速度是

$$\\frac{8\\text{ cm}}{4\\text{ 周}} = 2\\text{ cm/周}.$$

只说 $2$ 意义不大；单位说明了它的含义：每一周时间长高几厘米。一个减少的量，比如燃烧的蜡烛，变化率是负的。这节课确定变化率的单位，并由两次读数算出变化率。`,
  ),
  knowledgePoints: [
    {
      id: "choosing-units-of-a-rate",
      title: t("Units of a rate of change", "变化率的单位"),
      explanation: t(
        `The rate of change of a quantity is how much it changes per unit of time:

$$\\text{rate of change} = \\frac{\\text{change in the quantity}}{\\text{change in time}}.$$

Its units come from the same division: the units of the quantity on top, the units of time underneath. If a candle's height is measured in centimeters and time in hours, the rate of change is in **centimeters per hour** (cm/h). A rate of $-3$ cm/h then means the candle loses $3$ cm each hour.

> **Watch out.** Do not turn the quotient over: hours per centimeter would be the time needed for each centimeter, a different quantity. And a rate needs both units; centimeters alone or hours alone describe an amount, not how fast it changes.`,
        `一个量的变化率是它每单位时间变化多少：

$$\\text{变化率} = \\frac{\\text{量的变化}}{\\text{时间的变化}}.$$

它的单位来自同一个除法：量的单位在上，时间的单位在下。如果蜡烛的高度以厘米计、时间以小时计，变化率的单位就是**厘米/小时**（cm/h）。变化率 $-3$ cm/h 表示蜡烛每小时变短 $3$ cm。

> **注意。** 不要把商倒过来：小时/厘米是每变化一厘米所需的时间，是另一个量。变化率需要两个单位；只有厘米或只有小时，说的是一个数量，而不是它变化得多快。`,
      ),
      generate(rng) {
        const d = drawChange(rng);
        const { c } = d;
        const [many, one, , zhRate] = c.time;
        const [unitMany, unitOne, unitZh] = c.unit;
        const prompt = changePrompt(d);
        const move = changeWords(d);
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
            `The rate of change is the change in ${c.what.en} divided by the change in time. The quantity is measured in ${unitMany} and the time in ${many}, so the units are ${unitMany} divided by ${many}: **${unitMany} per ${one}**.

Here the rate is $${rateLatex(d)}$ ${unitMany} per ${one}.

**Check.** Read it back: ${c.what.en} ${move.en}, and over the $${d.x2 - d.x1}$ ${many} from the first reading to the second that is a change of $${d.y2 - d.y1}$ ${unitMany}, from $${d.y1}$ to $${d.y2}$.`,
            `变化率是${c.what["zh-CN"]}的变化除以时间的变化。这个量以${unitZh}计，时间以${zhRate}计，所以单位是${unitZh}除以${zhRate}：**${unitZh}/${zhRate}**。

这里变化率是 $${rateLatex(d)}$ ${unitZh}/${zhRate}。

**检验。** 反过来读：${c.what["zh-CN"]}${move["zh-CN"]}，从第一次读数到第二次经过 $${d.x2 - d.x1}$ ${c.time[2]}，共变化 $${d.y2 - d.y1}$ ${unitZh}，从 $${d.y1}$ 变到 $${d.y2}$。`,
          ),
        );
      },
    },
    {
      id: "finding-a-rate-of-change",
      title: t("Finding a rate of change", "求变化率"),
      explanation: t(
        `Divide the change in the quantity by the change in time, **subtracting in the same order** in both: later minus earlier. If a candle is $18$ cm tall after $2$ hours and $12$ cm tall after $5$ hours, then over $5 - 2 = 3$ hours its height changes by $12 - 18 = -6$ cm:

$$\\frac{12 - 18}{5 - 2} = \\frac{-6}{3} = -2 \\text{ cm/h}.$$

The rate is **negative** because the quantity decreases: the candle loses $2$ cm each hour. Check: $18 + 3 \\cdot (-2) = 12$, the second reading.

> **Watch out.** Subtracting in opposite orders flips the sign, so a burning candle would seem to grow. The change $-6$ is not the rate; it must be shared among the $3$ hours. And dividing one reading by its time, $\\frac{12}{5}$, ignores where the quantity started.`,
        `用量的变化除以时间的变化，两次相减**顺序要一致**：后减前。如果蜡烛 $2$ 小时后高 $18$ cm，$5$ 小时后高 $12$ cm，那么在 $5 - 2 = 3$ 小时里，高度变化了 $12 - 18 = -6$ cm：

$$\\frac{12 - 18}{5 - 2} = \\frac{-6}{3} = -2 \\text{ cm/h}.$$

变化率是**负**的，因为这个量在减少：蜡烛每小时变短 $2$ cm。检验：$18 + 3 \\cdot (-2) = 12$，正是第二次读数。

> **注意。** 两次相减顺序相反，符号就会反过来，燃烧的蜡烛好像在变长。变化量 $-6$ 不是变化率，还要平均分到 $3$ 个小时上。用一次读数除以它的时间，$\\frac{12}{5}$，忽略了这个量的起点。`,
      ),
      generate(rng) {
        const d = drawChange(rng);
        const { c } = d;
        const prompt = changePrompt(d);
        const move = changeWords(d);
        const dy = d.y2 - d.y1;
        const dx = d.x2 - d.x1;
        return numberProblem({
          prompt: t(
            `${prompt.en} Find the rate of change of ${c.what.en}, in ${c.unit[0]} per ${c.time[1]}.`,
            `${prompt["zh-CN"]}求${c.what["zh-CN"]}的变化率，单位是${c.unit[2]}/${c.time[3]}。`,
          ),
          answer: d.k,
          wrong: [-d.k, d.y2 - d.y1, q(d.x2 - d.x1, d.y2 - d.y1), q(d.y2, d.x2)],
          solution: t(
            `**Step 1: the changes.** Subtract later minus earlier in both: ${c.what.en} changes by $${d.y2} - ${paren(d.y1)} = ${dy}$ ${c.unit[0]}, over $${d.x2} - ${d.x1} = ${dx}$ ${c.time[0]}.

**Step 2: divide.** The rate is the change in the quantity per unit of time:${steps(rateLatex(d))}${c.what.en.charAt(0).toUpperCase()}${c.what.en.slice(1)} ${move.en}${d.k < 0 ? ", so the rate is negative" : ""}.

**Check.** Start from the first reading and apply the rate for $${dx}$ ${c.time[0]}: $${d.y1} + ${dx} \\cdot ${paren(d.k)} = ${d.y2}$, the second reading.`,
            `**第一步：求变化量。** 两次都用后减前：${c.what["zh-CN"]}变化了 $${d.y2} - ${paren(d.y1)} = ${dy}$ ${c.unit[2]}，经过 $${d.x2} - ${d.x1} = ${dx}$ ${c.time[2]}。

**第二步：相除。** 变化率是每单位时间的变化量：${steps(rateLatex(d))}${c.what["zh-CN"]}${move["zh-CN"]}${d.k < 0 ? "，所以变化率是负的" : ""}。

**检验。** 从第一次读数出发，按这个变化率经过 $${dx}$ ${c.time[2]}：$${d.y1} + ${dx} \\cdot ${paren(d.k)} = ${d.y2}$，正是第二次读数。`,
          ),
        });
      },
    },
  ],
};

// Degrees of accuracy.

const placeNames: readonly Text[] = [
  t("whole number", "个位"),
  t("tenth", "十分位"),
  t("hundredth", "百分位"),
  t("thousandth", "千分位"),
  t("ten-thousandth", "万分位"),
];

/** digitAt is the digit of a positive number in the p-th decimal place (0 is the ones digit). */
const digitAt = (v: Q, p: number) => Number(((v.n * 10n ** BigInt(p)) / v.d) % 10n);

/** keptPlaces says how many decimal places a rounding keeps: "two decimal places". */
const keptPlaces = (p: number): Text =>
  p === 0
    ? t("no decimal places", "不保留小数")
    : t(`${["", "one", "two", "three"][p]} decimal place${p === 1 ? "" : "s"}`, `保留${["", "一", "两", "三"][p]}位小数`);

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
  encompasses: [{ topic: "decimal-arithmetic", weight: 0.1 }],
  xp: 12,
  standards: ["CCSS.HSN.Q.A.3"],
  intro: t(
    `So far every quantity in a problem has been exact: a unit rate of $\\$2.40$ per kilogram, a length of $3.5$ m. Real measurements are never exact. A ruler marked in millimeters can only tell us a length to the nearest millimeter; a kitchen scale might weigh to the nearest $5$ grams.

Say a plank is measured as $1.8$ m, to the nearest $0.1$ m. Its true length could be $1.83$ m or $1.76$ m, since both round to $1.8$; the measurement only tells us that the length lies between $1.75$ m and $1.85$ m. And if we cut the plank into $7$ equal parts, the calculator's $1.8 \\div 7 = 0.257142\\ldots$ is far more precise than the measurement it came from.

The **degree of accuracy** of a number says how precise it is: to the nearest whole number, tenth, hundredth, and so on. In this lesson we round to a given place, give a calculated result to the accuracy of the data, and find the bounds within which a measured value must lie.`,
    `到目前为止，题目中的每个量都是精确的：每千克 $\\$2.40$ 的单价，$3.5$ m 的长度。真实的测量从来不是精确的。刻度到毫米的直尺只能把长度量到最接近的毫米；厨房秤也许只能称到最接近的 $5$ 克。

假设一块木板测得长 $1.8$ m，精确到 $0.1$ m。它的真实长度可能是 $1.83$ m，也可能是 $1.76$ m，因为两者都四舍五入为 $1.8$；这个测量值只告诉我们长度在 $1.75$ m 和 $1.85$ m 之间。如果把木板平均锯成 $7$ 段，计算器给出的 $1.8 \\div 7 = 0.257142\\ldots$ 比它所依据的测量精确得多。

数的**精确度**说明它有多精确：精确到个位、十分位、百分位，等等。这节课按要求的数位取近似值，按数据的精确度给出计算结果，并求测量值所在的范围。`,
  ),
  knowledgePoints: [
    {
      id: "rounding-decimals",
      title: t("Rounding decimals", "小数的四舍五入"),
      explanation: t(
        `Rounding replaces a number by the nearest number with fewer digits. To round to a place, the two candidates are the number cut off after that place and the next one up; the digit **just to the right** of the place says which is nearer. If it is $5$ or more, the number is at least halfway to the next one, so round up: add one to the digit in the place. Otherwise round down. Then drop every digit after the place.

To round $3.4961$ to the nearest hundredth, the candidates are $3.49$ and $3.50$. The digit after the hundredths is $6$, so $3.4961$ is past halfway and rounds up. Adding one to the $9$ carries:

$$3.4961 \\approx 3.50 \\text{ (nearest hundredth)}, \\qquad 3.4961 \\approx 3.5 \\text{ (nearest tenth)}, \\qquad 3.4961 \\approx 3 \\text{ (nearest whole number)}.$$

> **Watch out.** Cutting the digits off without looking at the next one, $3.4961 \\approx 3.49$, always rounds down. Count the places carefully: the nearest tenth keeps one decimal place, the nearest hundredth two. And look only at the one digit right after the place, not at the last digit of the number.`,
        `四舍五入是用位数较少的、最接近的数代替原数。要四舍五入到某一位，候选的两个数是在这一位后截断的数和比它大一个单位的数；这一位**右边紧挨着**的数字决定哪一个更近。如果它是 $5$ 或更大，原数至少走过了一半，所以进一：这一位加一；否则舍去。然后去掉这一位后面的所有数字。

把 $3.4961$ 四舍五入到百分位，候选的数是 $3.49$ 和 $3.50$。百分位后面一位是 $6$，所以 $3.4961$ 已过一半，要进一。$9$ 加一要进位：

$$3.4961 \\approx 3.50 \\text{（精确到百分位）}, \\qquad 3.4961 \\approx 3.5 \\text{（精确到十分位）}, \\qquad 3.4961 \\approx 3 \\text{（精确到个位）}.$$

> **注意。** 不看下一位就直接截掉，$3.4961 \\approx 3.49$，等于总是舍去。数位要数清楚：精确到十分位保留一位小数，精确到百分位保留两位。只看这一位后面紧挨着的那个数字，而不是原数的最后一位。`,
      ),
      generate(rng) {
        const v = q(rng.int(10001, 999999), 10000);
        const p = rng.int(0, 3);
        const answer = roundTo(v, p);
        const name = placeNames[p]!;
        const next = placeNames[p + 1]!;
        const d = digitAt(v, p + 1);
        const step = q(1, 10 ** p);
        const lo = truncTo(v, p);
        const hi = lo.add(step);
        const gap = answer.sub(v).abs();
        const halfway = gap.eq(step.div(Q.of(2)));
        const kept = keptPlaces(p);
        return numberProblem({
          prompt: t(`Round $${dec(v)}$ to the nearest ${name.en}.`, `把 $${dec(v)}$ 四舍五入到${name["zh-CN"]}。`),
          answer,
          form: "decimal",
          wrong: [truncTo(v, p), roundTo(v, p + 1), ...(p > 0 ? [roundTo(v, p - 1)] : [])],
          solution: t(
            `**Step 1: the deciding digit.** Rounding to the nearest ${name.en} keeps ${kept.en}, so the candidates are $${fixed(lo, p)}$ and $${fixed(hi, p)}$. The digit just after, in the ${next.en}s place, is $${d}$.

**Step 2: round ${d >= 5 ? "up" : "down"}.** ${d >= 5 ? `Since $${d} \\ge 5$, add one to the last digit kept` : `Since $${d} < 5$, keep the digits as they are`} and drop the rest:${steps(`${dec(v)} \\approx ${fixed(answer, p)}`)}**Check.** ${halfway ? `$${dec(v)}$ is exactly halfway between $${fixed(lo, p)}$ and $${fixed(hi, p)}$, and a half rounds up.` : `$${dec(v)}$ is $${dec(gap)}$ from $${fixed(answer, p)}$, less than half of $${dec(step)}$, so $${fixed(answer, p)}$ is the nearer of $${fixed(lo, p)}$ and $${fixed(hi, p)}$.`}`,
            `**第一步：决定的数字。** 四舍五入到${name["zh-CN"]}要${kept["zh-CN"]}，候选的数是 $${fixed(lo, p)}$ 和 $${fixed(hi, p)}$。后面紧挨着的${next["zh-CN"]}上的数字是 $${d}$。

**第二步：${d >= 5 ? "进一" : "舍去"}。** ${d >= 5 ? `因为 $${d} \\ge 5$，保留的最后一位加一` : `因为 $${d} < 5$，保留的数字不变`}，后面的数字去掉：${steps(`${dec(v)} \\approx ${fixed(answer, p)}`)}**检验。** ${halfway ? `$${dec(v)}$ 恰好在 $${fixed(lo, p)}$ 和 $${fixed(hi, p)}$ 的正中间，一半要进一。` : `$${dec(v)}$ 与 $${fixed(answer, p)}$ 相差 $${dec(gap)}$，小于 $${dec(step)}$ 的一半，所以在 $${fixed(lo, p)}$ 和 $${fixed(hi, p)}$ 中，$${fixed(answer, p)}$ 更近。`}`,
          ),
        });
      },
    },
    {
      id: "results-to-the-accuracy-of-the-data",
      title: t("Results to the accuracy of the data", "按数据的精确度给出结果"),
      explanation: t(
        `A calculation cannot make a measurement more accurate than it was. If a rope is measured as $4.3$ m to the nearest $0.1$ m, its true length could be anything from $4.25$ m to $4.35$ m, so the hundredths and thousandths of any length worked out from it are guesses. A result calculated from a measurement is therefore rounded to the same degree of accuracy. Cutting the $4.3$ m rope into $3$ equal pieces gives

$$4.3 \\div 3 = 1.4333\\ldots \\approx 1.4\\text{ m}.$$

> **Watch out.** Writing $1.43$ m or $1.433$ m claims an accuracy the measurement does not have; writing $1$ m throws away accuracy it does have. And round, do not cut off: $2.9 \\div 4 = 0.725$ is $0.7$ m to the nearest tenth, because the next digit, $2$, is less than $5$, but $1.9 \\div 2 = 0.95$ is $1.0$ m, not $0.9$ m.`,
        `计算不能使测量比原来更精确。如果一根绳子测得 $4.3$ m，精确到 $0.1$ m，它的真实长度可能是 $4.25$ m 到 $4.35$ m 之间的任何值，所以由它算出的长度中，百分位和千分位都只是猜测。因此由测量值算出的结果，要取到同样的精确度。把 $4.3$ m 的绳子平均剪成 $3$ 段：

$$4.3 \\div 3 = 1.4333\\ldots \\approx 1.4\\text{ m}.$$

> **注意。** 写成 $1.43$ m 或 $1.433$ m，就表示了测量本身并不具备的精确度；写成 $1$ m 则丢掉了它确有的精确度。要四舍五入，不要直接截掉：$2.9 \\div 4 = 0.725$ 精确到十分位是 $0.7$ m，因为下一位 $2$ 小于 $5$；但 $1.9 \\div 2 = 0.95$ 是 $1.0$ m，不是 $0.9$ m。`,
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
        const shown = truncTo(exact, p + 3);
        const quotient = shown.eq(exact) ? dec(exact) : `${dec(shown)}\\ldots`;
        const back = answer.mul(Q.of(n));
        const kept = keptPlaces(p);
        return numberProblem({
          prompt: s.text(fixed(total, p), n, precisionText(step, s.sym, s.unit)),
          answer,
          form: "decimal",
          unit: s.sym,
          wrong: [roundTo(exact, p + 1), roundTo(exact, p + 2), truncTo(exact, p), ...(p > 0 ? [roundTo(exact, p - 1)] : [])],
          solution: t(
            `**Step 1: divide.** Each part is the total shared among $${n}$:${steps(`${fixed(total, p)} \\div ${n} = ${quotient}`)}**Step 2: round to the accuracy of the data.** The measurement is to the nearest $${dec(step)}\\text{ ${s.sym}}$, so the result keeps ${kept.en} too. The next digit is $${digitAt(exact, p + 1)}$, so${steps(`${quotient} \\approx ${fixed(answer, p)}\\text{ ${s.sym}}`)}**Check.** $${n}$ parts of $${fixed(answer, p)}\\text{ ${s.sym}}$ make $${dec(back)}\\text{ ${s.sym}}$, ${back.eq(total) ? "exactly the measured total" : `close to the measured $${fixed(total, p)}\\text{ ${s.sym}}$; the small difference comes from rounding`}.`,
            `**第一步：相除。** 每份是总量平均分成 $${n}$ 份：${steps(`${fixed(total, p)} \\div ${n} = ${quotient}`)}**第二步：按数据的精确度取近似值。** 测量精确到 $${dec(step)}\\text{ ${s.sym}}$，所以结果也${kept["zh-CN"]}。下一位数字是 $${digitAt(exact, p + 1)}$，所以${steps(`${quotient} \\approx ${fixed(answer, p)}\\text{ ${s.sym}}`)}**检验。** $${n}$ 份 $${fixed(answer, p)}\\text{ ${s.sym}}$ 共 $${dec(back)}\\text{ ${s.sym}}$，${back.eq(total) ? "正好等于测得的总量" : `接近测得的 $${fixed(total, p)}\\text{ ${s.sym}}$；微小的差别来自四舍五入`}。`,
          ),
        });
      },
    },
    {
      id: "bounds-of-a-measurement",
      title: t("Bounds of a measurement", "测量值的上下界"),
      explanation: t(
        `A measurement given to the nearest unit could be off by up to **half** a unit either way, since anything closer to the next mark would have been rounded to that mark instead. A length of $8.4$ cm measured to the nearest $0.1$ cm is at least $8.4 - 0.05 = 8.35$ cm and less than $8.4 + 0.05 = 8.45$ cm:

$$8.35 \\le \\text{length} < 8.45.$$

The **lower bound** is the measurement minus half the unit of accuracy; the **upper bound** is the measurement plus half of it. The lower bound is included, because $8.35$ rounds up to $8.4$; the upper bound is not, because $8.45$ would round up to $8.5$.

> **Watch out.** Subtract or add **half** of the unit of accuracy, not the whole unit: $8.3$ cm would round to $8.3$, not $8.4$. And read which bound is asked for: the least possible value is the lower bound, and the value the true one stays below is the upper bound.`,
        `精确到某个单位的测量值，向两边的误差最多是**半个**单位，因为更接近下一个刻度的值会被四舍五入到那个刻度。精确到 $0.1$ cm 测得的长度 $8.4$ cm，实际至少是 $8.4 - 0.05 = 8.35$ cm，并且小于 $8.4 + 0.05 = 8.45$ cm：

$$8.35 \\le \\text{长度} < 8.45.$$

**下界**是测量值减去精确单位的一半；**上界**是测量值加上精确单位的一半。下界包括在内，因为 $8.35$ 四舍五入得 $8.4$；上界不包括，因为 $8.45$ 会四舍五入为 $8.5$。

> **注意。** 加减的是精确单位的**一半**，不是整个单位：$8.3$ cm 四舍五入得 $8.3$，不是 $8.4$。还要看清问的是哪个界：最小可能值是下界，实际值总小于的那个数是上界。`,
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
            `**Step 1: half the unit of accuracy.** The measurement is to the nearest $${dec(step)}\\text{ ${m.sym}}$, so the true ${m.noun.en} can differ from $${shown}$ by up to half of that: $${dec(step)} \\div 2 = ${dec(half)}$.

**Step 2: the bounds.** ${lower ? "The least possible value is the lower bound" : "The value the true one stays below is the upper bound"}:${steps(`${shown} - ${dec(half)} = ${dec(v.sub(half))} \\le \\text{${m.noun.en}} < ${shown} + ${dec(half)} = ${dec(v.add(half))}`)}So the answer is $${dec(answer)}\\text{ ${m.sym}}$.

**Check.** The two bounds are $${dec(step)}$ apart, one unit of accuracy, with $${shown}$ in the middle. ${lower ? `$${dec(answer)}$ itself rounds up to $${shown}$, while anything a little smaller would round down to $${dec(v.sub(step))}$.` : `$${dec(answer)}$ itself would round up to $${dec(v.add(step))}$, so the true value stays below it.`}`,
            `**第一步：精确单位的一半。** 测量精确到 $${dec(step)}\\text{ ${m.sym}}$，所以真实${m.noun["zh-CN"]}与 $${shown}$ 最多相差它的一半：$${dec(step)} \\div 2 = ${dec(half)}$。

**第二步：上下界。** ${lower ? "最小可能值是下界" : "实际值总小于的数是上界"}：${steps(`${shown} - ${dec(half)} = ${dec(v.sub(half))} \\le \\text{${m.noun["zh-CN"]}} < ${shown} + ${dec(half)} = ${dec(v.add(half))}`)}所以答案是 $${dec(answer)}\\text{ ${m.sym}}$。

**检验。** 两个界相差 $${dec(step)}$，正好一个精确单位，$${shown}$ 在正中间。${lower ? `$${dec(answer)}$ 本身四舍五入得 $${shown}$，而比它稍小的数会舍成 $${dec(v.sub(step))}$。` : `$${dec(answer)}$ 本身会进一成 $${dec(v.add(step))}$，所以实际值总小于它。`}`,
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

/** factor writes a number as a factor after a multiplication sign, in parentheses when it is negative. */
const factor = (v: Coefficient) => {
  const s = num(v);
  return s.startsWith("-") ? `\\left(${s}\\right)` : s;
};

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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.7.RP.A.2"],
  intro: t(
    `A proportion says that two ratios are equal, as in $\\frac{2}{6} = \\frac{5}{15}$. Some pairs of quantities keep the **same ratio** all the time. Pencils at $\\$3$ each: $2$ pencils cost $\\$6$, $5$ cost $\\$15$, $8$ cost $\\$24$, and every cost divided by its number of pencils is $3$:

$$\\frac{6}{2} = \\frac{15}{5} = \\frac{24}{8} = 3.$$

So the cost is always $3$ times the number of pencils: $y = 3x$. When $x$ doubles, $y$ doubles; when $x$ is $0$, so is $y$.

A relation like this, $y = kx$ for a fixed number $k \\ne 0$, is called **direct variation**, and $k$ is the **constant of variation**. In this lesson we recognize direct variation from a list of points, find $k$ from one pair of values, and write the equation $y = kx$.`,
    `比例式表示两个比相等，例如 $\\frac{2}{6} = \\frac{5}{15}$。有些成对的量，它们的**比始终不变**。铅笔每支 $3$ 元：$2$ 支 $6$ 元，$5$ 支 $15$ 元，$8$ 支 $24$ 元，每个总价除以支数都是 $3$：

$$\\frac{6}{2} = \\frac{15}{5} = \\frac{24}{8} = 3.$$

所以总价总是支数的 $3$ 倍：$y = 3x$。$x$ 变为两倍，$y$ 也变为两倍；$x$ 为 $0$ 时，$y$ 也是 $0$。

像这样的关系，$y = kx$，其中 $k \\ne 0$ 是固定的数，叫做**正比例关系**，$k$ 叫做**比例常数**。这节课由一组点识别正比例关系，由一组值求出 $k$，并写出方程 $y = kx$。`,
  ),
  knowledgePoints: [
    {
      id: "recognizing-direct-variation",
      figure: algebraDrawings["direct-variation#recognizing-direct-variation"],
      title: t("Recognizing direct variation", "识别正比例关系"),
      explanation: t(
        `$y$ **varies directly** with $x$ when $y = kx$ for some constant $k \\ne 0$, the **constant of variation**. Dividing both sides by $x$ gives $\\frac{y}{x} = k$, so the ratio $\\frac{y}{x}$ is the same for every pair with $x \\ne 0$; and the graph is a line through the origin, because $x = 0$ gives $y = 0$.

So to test a set of points, compute $\\frac{y}{x}$ for each. The points $(2, 6)$, $(3, 9)$, $(5, 15)$ show direct variation: $\\frac{6}{2} = \\frac{9}{3} = \\frac{15}{5} = 3$, and $y = 3x$.

> **Watch out.** A quantity that grows steadily need not vary directly. The points $(1, 5)$, $(2, 7)$, $(3, 9)$ go up by $2$ each time, but $\\frac{5}{1} \\ne \\frac{7}{2}$: they lie on $y = 2x + 3$, a line that misses the origin. Check the ratios, not just the steady growth.`,
        `如果 $y = kx$，其中 $k \\ne 0$ 是常数，就说 $y$ 与 $x$ **成正比例**，$k$ 叫做**比例常数**。两边除以 $x$ 得 $\\frac{y}{x} = k$，所以对每一组 $x \\ne 0$ 的数对，比值 $\\frac{y}{x}$ 都相同；图像是过原点的直线，因为 $x = 0$ 时 $y = 0$。

所以检验一组点，就对每个点计算 $\\frac{y}{x}$。点 $(2, 6)$、$(3, 9)$、$(5, 15)$ 成正比例：$\\frac{6}{2} = \\frac{9}{3} = \\frac{15}{5} = 3$，$y = 3x$。

> **注意。** 均匀增长的量不一定成正比例。点 $(1, 5)$、$(2, 7)$、$(3, 9)$ 每次增加 $2$，但 $\\frac{5}{1} \\ne \\frac{7}{2}$：它们在直线 $y = 2x + 3$ 上，这条直线不过原点。要检验比值，不能只看是否均匀增长。`,
      ),
      generate(rng) {
        const xs = rng.sample(range(1, 10), 3).sort((a, b) => a - b);
        const k = rng.int(2, 9);
        const direct = rng.bool();
        const b = rng.nonZero(-5, 5);
        const ys = xs.map((x) => (direct ? k * x : k * x + b));
        const pts = xs.map((x, i) => [x, ys[i]!] as const);
        const ratios = pts.map(([x, y]) => quotient(y, x)).join(", \\quad ");
        const line = `y = ${k}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
        const fits = pts.map(([x, y]) => `${k} \\cdot ${x} = ${y}`).join(", \\quad ");
        return choiceProblem({
          prompt: t(
            `The points ${points(pts).en} show how $y$ depends on $x$. Does $y$ vary directly with $x$?`,
            `点 ${points(pts)["zh-CN"]} 表示 $y$ 随 $x$ 变化的情况。$y$ 与 $x$ 成正比例吗？`,
          ),
          options: yesNo,
          correct: direct ? 0 : 1,
          solution: t(
            `**Step 1: the ratios.** If $y = kx$, every ratio $\\frac{y}{x}$ equals $k$. Compute them:${steps(ratios)}**Step 2: compare.** ${direct ? `They all equal $${k}$, so $y = ${k}x$: yes, $y$ varies directly with $x$.` : "They are not all equal, so no single $k$ gives $y = kx$: no."}

**Check.** ${direct ? `Each point fits $y = ${k}x$: $${fits}$.` : `The points lie on the line $${line}$, which gives $y = ${b}$ at $x = 0$; a direct variation passes through the origin.`}`,
            `**第一步：求比值。** 若 $y = kx$，每个比值 $\\frac{y}{x}$ 都等于 $k$。逐个计算：${steps(ratios)}**第二步：比较。** ${direct ? `它们都等于 $${k}$，所以 $y = ${k}x$：是，$y$ 与 $x$ 成正比例。` : "它们不全相等，没有一个 $k$ 能使 $y = kx$ 成立：否。"}

**检验。** ${direct ? `每个点都满足 $y = ${k}x$：$${fits}$。` : `这些点在直线 $${line}$ 上，$x = 0$ 时 $y = ${b}$；而正比例关系的图像过原点。`}`,
          ),
        });
      },
    },
    {
      id: "constant-of-direct-variation",
      title: t("The constant of variation", "比例常数"),
      explanation: t(
        `If $y$ varies directly with $x$, then $y = kx$, and dividing both sides by $x$ gives $k = \\frac{y}{x}$ for any pair of values with $x \\ne 0$. So one known pair is enough. If $y = 18$ when $x = 4$:

$$k = \\frac{18}{4} = \\frac{9}{2}.$$

Check by multiplying back: $\\frac{9}{2} \\cdot 4 = 18$.

> **Watch out.** Divide $y$ by $x$, not $x$ by $y$: $\\frac{4}{18}$ is the constant of $x$ in terms of $y$. And $k$ is a ratio, so neither the difference $18 - 4$ nor the product $18 \\cdot 4$ is the constant.`,
        `如果 $y$ 与 $x$ 成正比例，那么 $y = kx$，两边除以 $x$，对任何一组 $x \\ne 0$ 的值都有 $k = \\frac{y}{x}$。所以知道一组值就够了。若 $x = 4$ 时 $y = 18$：

$$k = \\frac{18}{4} = \\frac{9}{2}.$$

乘回去检验：$\\frac{9}{2} \\cdot 4 = 18$。

> **注意。** 是 $y$ 除以 $x$，不是 $x$ 除以 $y$：$\\frac{4}{18}$ 是用 $y$ 表示 $x$ 时的常数。$k$ 是比值，所以差 $18 - 4$ 和积 $18 \\cdot 4$ 都不是比例常数。`,
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
          solution: t(
            `Since $y = kx$, dividing both sides by $x$ gives $k = \\frac{y}{x}$. Substitute the known pair:${steps(`k = \\frac{y}{x} = ${quotient(Number(y.n), x)}`)}**Check.** $k \\cdot x = ${num(k)} \\cdot ${factor(x)} = ${num(y)}$, the given value of $y$.`,
            `因为 $y = kx$，两边除以 $x$ 得 $k = \\frac{y}{x}$。代入已知的一组值：${steps(`k = \\frac{y}{x} = ${quotient(Number(y.n), x)}`)}**检验。** $k \\cdot x = ${num(k)} \\cdot ${factor(x)} = ${num(y)}$，正是已知的 $y$ 值。`,
          ),
        });
      },
    },
    {
      id: "writing-direct-variation-equations",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        `Every direct variation has the form $y = kx$; only the number $k$ changes from one to the next. So to write the equation, find $k = \\frac{y}{x}$ from a known pair and put it in place of $k$. If $y = 15$ when $x = 6$, then $k = \\frac{15}{6} = \\frac{5}{2}$ and

$$y = \\frac{5}{2}x.$$

Check with the known pair: $\\frac{5}{2} \\cdot 6 = 15$.

> **Watch out.** Writing $y = \\frac{6}{15}x$ turns the ratio upside down, and $y = 15x$ uses the value of $y$ as the constant. A direct variation also has no constant term: $y = x + 9$ is a different kind of relation.`,
        `每个正比例关系都形如 $y = kx$，不同的只是数 $k$。所以要写出方程，就由已知的一组值求出 $k = \\frac{y}{x}$，代替 $k$。若 $x = 6$ 时 $y = 15$，则 $k = \\frac{15}{6} = \\frac{5}{2}$，

$$y = \\frac{5}{2}x.$$

用已知的一组值检验：$\\frac{5}{2} \\cdot 6 = 15$。

> **注意。** 写成 $y = \\frac{6}{15}x$ 是把比值倒过来了，写成 $y = 15x$ 是把 $y$ 的值当成了常数。正比例关系也没有常数项：$y = x + 9$ 是另一种关系。`,
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
          solution: t(
            `**Step 1: find $k$.** Dividing $y = kx$ by $x$ gives $k = \\frac{y}{x}$:${steps(`k = ${quotient(Number(y.n), x)}`)}**Step 2: write the equation.** Put this value in place of $k$ in $y = kx$:${steps(`y = ${linear(k, 0)}`)}**Check.** At $x = ${x}$ the equation gives $y = ${num(k)} \\cdot ${factor(x)} = ${num(y)}$, the given value.`,
            `**第一步：求 $k$。** $y = kx$ 两边除以 $x$ 得 $k = \\frac{y}{x}$：${steps(`k = ${quotient(Number(y.n), x)}`)}**第二步：写出方程。** 把这个值代替 $y = kx$ 中的 $k$：${steps(`y = ${linear(k, 0)}`)}**检验。** $x = ${x}$ 时，方程给出 $y = ${num(k)} \\cdot ${factor(x)} = ${num(y)}$，正是已知的值。`,
          ),
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

/** unitRate explains the constant of a direct-variation model as the amount of y for one unit of x. */
const unitRate = (c: DirectContext, x1: number, y1: Q, k: Q): Text =>
  t(
    `The constant is the amount of $${c.y}$ for each single unit of $${c.x}$, a unit rate. Divide the known $${c.y}$ by the known $${c.x}$:${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`)}`,
    `常数是每一个单位的 $${c.x}$ 对应的 $${c.y}$，也就是单位率。用已知的 $${c.y}$ 除以已知的 $${c.x}$：${steps(`k = \\frac{${dec(y1)}}{${x1}} = ${dec(k)}`)}`,
  );

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
  intro: t(
    `A direct variation $y = kx$ has a constant ratio $k = \\frac{y}{x}$, and a unit rate such as $\\$4$ per kilogram is also a constant ratio. Put together: whenever one quantity is a fixed amount **per unit** of another, the two vary directly, and the unit rate is the constant of variation.

A car that drives at a steady $80$ km/h covers $80$ km in $1$ hour, $160$ km in $2$ hours, $240$ km in $3$ hours. The distance is $80$ times the time:

$$d = 80t.$$

The model answers questions in both directions: in $4.5$ hours the car covers $80 \\cdot 4.5 = 360$ km, and $400$ km takes $400 \\div 80 = 5$ hours. In this lesson we write such models from one known pair of values, use them to predict an output, and work back to the input that gives a known output.`,
    `正比例关系 $y = kx$ 的比值 $k = \\frac{y}{x}$ 是常数，而像每千克 $4$ 元这样的单位率也是常数比值。合起来看：只要一个量是另一个量**每单位**固定的数量，两者就成正比例，单位率就是比例常数。

一辆汽车以稳定的 $80$ km/h 行驶，$1$ 小时行驶 $80$ km，$2$ 小时 $160$ km，$3$ 小时 $240$ km。路程是时间的 $80$ 倍：

$$d = 80t.$$

这个模型可以从两个方向回答问题：$4.5$ 小时行驶 $80 \\cdot 4.5 = 360$ km，行驶 $400$ km 要 $400 \\div 80 = 5$ 小时。这节课由一组已知的值写出这样的模型，用它预测输出，并由已知的输出反求输入。`,
  ),
  knowledgePoints: [
    {
      id: "writing-direct-variation-models",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        `In a real situation, the constant of variation is a unit rate with units: the amount of one quantity for each single unit of the other. Find it by dividing the given output by the given input. If $3$ kg of cheese costs $\\$37.50$, each kilogram costs

$$k = \\frac{37.50}{3} = 12.5 \\text{ dollars per kilogram}, \\qquad \\text{so} \\qquad C = 12.5w.$$

Check with the known pair: $12.5 \\cdot 3 = 37.5$.

> **Watch out.** Dividing the other way, $\\frac{3}{37.50}$, gives kilograms per dollar, not the price. Writing $C = 37.5w$ uses the total price as if it were the price of one kilogram. And $C = w + 12.5$ adds where direct variation multiplies.`,
        `在实际情境中，比例常数是带单位的单位率：每一个单位的一个量对应另一个量的多少。用已知的输出除以已知的输入求出它。如果 $3$ kg 奶酪 $37.5$ 元，每千克就是

$$k = \\frac{37.5}{3} = 12.5 \\text{ 元/千克}, \\qquad \\text{所以} \\qquad C = 12.5w.$$

用已知的一组值检验：$12.5 \\cdot 3 = 37.5$。

> **注意。** 反过来除，$\\frac{3}{37.5}$，得到的是每元多少千克，不是单价。写成 $C = 37.5w$ 是把总价当成了一千克的价格。写成 $C = w + 12.5$ 则是在正比例该乘的地方做了加法。`,
      ),
      generate(rng) {
        const { c, k, x1, y1 } = directData(rng);
        const setup = c.setup(x1, y1);
        const rate = unitRate(c, x1, y1, k);
        return equationProblem(c.y, {
          prompt: t(
            `${setup.en} Write an equation for $${c.y}$ in terms of $${c.x}$.`,
            `${setup["zh-CN"]}写出用 $${c.x}$ 表示 $${c.y}$ 的方程。`,
          ),
          answer: `${dec(k)}${c.x}`,
          wrong: [linear(Q.of(x1).div(y1), 0, c.x), `${dec(y1)}${c.x}`, `${c.x} + ${dec(k)}`],
          solution: t(
            `**Step 1: the constant.** ${rate.en}**Step 2: the model.** $${c.y}$ is $${dec(k)}$ times $${c.x}$:${steps(`${c.y} = ${dec(k)}${c.x}`)}**Check.** With $${c.x} = ${x1}$ the model gives $${dec(k)} \\cdot ${x1} = ${dec(y1)}$, the given value.`,
            `**第一步：求常数。** ${rate["zh-CN"]}**第二步：写出模型。** $${c.y}$ 是 $${c.x}$ 的 $${dec(k)}$ 倍：${steps(`${c.y} = ${dec(k)}${c.x}`)}**检验。** $${c.x} = ${x1}$ 时，模型给出 $${dec(k)} \\cdot ${x1} = ${dec(y1)}$，正是已知的值。`,
          ),
        });
      },
    },
    {
      id: "predicting-with-direct-variation",
      title: t("Predicting a value", "预测数值"),
      explanation: t(
        `To predict an output, find $k$ from the known pair and multiply it by the new input. If $3$ kg of cheese costs $\\$37.50$, then $k = 12.5$ and $5$ kg costs

$$C = 12.5 \\cdot 5 = 62.5,$$

that is, $\\$62.50$. Check by scaling: $5$ kg is $\\frac{5}{3}$ of $3$ kg, so it costs $\\frac{5}{3}$ of $\\$37.50$, which is again $\\$62.50$.

> **Watch out.** Direct variation multiplies; it does not add. Two more kilograms do not cost two more dollars ($37.50 + 2$): doubling $w$ doubles $C$. Multiplying the old total by the new input, $37.50 \\cdot 5$, skips finding the price of one kilogram, and dividing by the new input treats the variation as inverse.`,
        `要预测输出，由已知的一组值求出 $k$，再乘新的输入。如果 $3$ kg 奶酪 $37.5$ 元，那么 $k = 12.5$，$5$ kg 的价格是

$$C = 12.5 \\cdot 5 = 62.5,$$

即 $62.5$ 元。用倍数检验：$5$ kg 是 $3$ kg 的 $\\frac{5}{3}$，所以价格是 $37.5$ 元的 $\\frac{5}{3}$，同样是 $62.5$ 元。

> **注意。** 正比例是乘，不是加。多两千克并不是多两元（$37.5 + 2$）：$w$ 变为两倍，$C$ 也变为两倍。用原来的总价乘新的输入，$37.5 \\cdot 5$，省掉了求一千克的价格；除以新的输入则是把它当成了反比例。`,
      ),
      generate(rng) {
        const { c, k, x1, x2, y1, y2 } = directData(rng);
        const setup = c.setup(x1, y1);
        const ask = c.askY(x2);
        const rate = unitRate(c, x1, y1, k);
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: y2,
          form: "decimal",
          wrong: [y1.add(Q.of(x2 - x1)), y1.mul(Q.of(x2)), y1.mul(Q.of(x1)).div(Q.of(x2))],
          solution: t(
            `**Step 1: the constant.** ${rate.en}**Step 2: multiply.** The model is $${c.y} = ${dec(k)}${c.x}$, so at $${c.x} = ${x2}$:${steps(`${c.y} = ${dec(k)} \\cdot ${x2} = ${dec(y2)}`)}**Check.** $${x2}$ is $\\frac{${x2}}{${x1}}$ times $${x1}$, so $${c.y}$ is the same multiple of $${dec(y1)}$: $\\frac{${x2}}{${x1}} \\cdot ${dec(y1)} = ${dec(y2)}$.`,
            `**第一步：求常数。** ${rate["zh-CN"]}**第二步：相乘。** 模型是 $${c.y} = ${dec(k)}${c.x}$，所以 $${c.x} = ${x2}$ 时：${steps(`${c.y} = ${dec(k)} \\cdot ${x2} = ${dec(y2)}`)}**检验。** $${x2}$ 是 $${x1}$ 的 $\\frac{${x2}}{${x1}}$ 倍，所以 $${c.y}$ 也是 $${dec(y1)}$ 的同样倍数：$\\frac{${x2}}{${x1}} \\cdot ${dec(y1)} = ${dec(y2)}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-input",
      title: t("Finding the input", "求自变量"),
      explanation: t(
        `To find the input that gives a known output, substitute the output into $y = kx$ and solve. The input is multiplied by $k$, so undo that by **dividing** by $k$. With $C = 12.5w$, the weight of cheese that costs $\\$100$ is

$$100 = 12.5w \\quad\\Rightarrow\\quad w = \\frac{100}{12.5} = 8 \\text{ kg}.$$

Check: $12.5 \\cdot 8 = 100$.

> **Watch out.** Multiplying $100$ by $12.5$ goes the wrong way: that would be the cost of $100$ kg. Dividing $12.5$ by $100$ turns the quotient upside down. And adding the change in price to the old weight treats the model as if it added instead of multiplied.`,
        `要求得到已知输出的输入，把输出代入 $y = kx$ 再解方程。输入乘了 $k$，所以**除以** $k$ 把它还原。由 $C = 12.5w$，$100$ 元能买的奶酪重量是

$$100 = 12.5w \\quad\\Rightarrow\\quad w = \\frac{100}{12.5} = 8 \\text{ kg}.$$

检验：$12.5 \\cdot 8 = 100$。

> **注意。** 用 $100$ 乘 $12.5$ 方向反了：那是 $100$ kg 的价格。用 $12.5$ 除以 $100$ 是把商倒过来了。把价格的变化量加到原来的重量上，则是把模型当成了加法而不是乘法。`,
      ),
      keyPrerequisites: ["one-step-equations-multiplication"],
      generate(rng) {
        const { c, k, x1, x2, y1, y2 } = directData(rng);
        const setup = c.setup(x1, y1);
        const ask = c.askX(y2);
        const rate = unitRate(c, x1, y1, k);
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: x2,
          wrong: [y2.mul(k), k.div(y2), y2.sub(y1).add(Q.of(x1))],
          solution: t(
            `**Step 1: the constant.** ${rate.en}**Step 2: solve for $${c.x}$.** Put the known $${c.y}$ into $${c.y} = ${dec(k)}${c.x}$ and divide both sides by $${dec(k)}$:${steps(`${dec(y2)} = ${dec(k)}${c.x}`, `${c.x} = \\frac{${dec(y2)}}{${dec(k)}} = ${x2}`)}**Check.** $${dec(k)} \\cdot ${x2} = ${dec(y2)}$, the given value of $${c.y}$.`,
            `**第一步：求常数。** ${rate["zh-CN"]}**第二步：解出 $${c.x}$。** 把已知的 $${c.y}$ 代入 $${c.y} = ${dec(k)}${c.x}$，两边除以 $${dec(k)}$：${steps(`${dec(y2)} = ${dec(k)}${c.x}`, `${c.x} = \\frac{${dec(y2)}}{${dec(k)}} = ${x2}`)}**检验。** $${dec(k)} \\cdot ${x2} = ${dec(y2)}$，正是已知的 $${c.y}$ 值。`,
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

/** productStep explains finding the constant of an inverse variation as the product of a known pair. */
const productStep = (x: number, y: number, k: number): Text =>
  t(
    `Multiplying both sides of $y = \\frac{k}{x}$ by $x$ gives $k = xy$:${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`)}`,
    `$y = \\frac{k}{x}$ 两边乘 $x$ 得 $k = xy$：${steps(`k = xy = ${x} \\cdot ${paren(y)} = ${k}`)}`,
  );

export const inverseVariation: TopicDef = {
  id: "inverse-variation",
  title: t("Inverse Variation", "反比例关系"),
  summary: t(
    "Recognize inverse variation, find the constant k = xy, write y = k/x and use it.",
    "识别反比例关系，求常数 k = xy，写出 y = k/x 并加以运用。",
  ),
  prerequisites: ["direct-variation"],
  encompasses: [{ topic: "one-step-equations-multiplication", weight: 0.2 }],
  xp: 15,
  intro: t(
    `In a direct variation $y = kx$ the **ratio** $\\frac{y}{x}$ stays the same: when $x$ doubles, so does $y$. Many quantities do the opposite. Share $24$ cookies equally: $2$ friends get $12$ each, $3$ friends get $8$, $4$ friends get $6$, $6$ friends get $4$. More friends, fewer cookies each, and what stays the same is the **product**:

$$2 \\cdot 12 = 3 \\cdot 8 = 4 \\cdot 6 = 6 \\cdot 4 = 24.$$

So the number each gets is $y = \\frac{24}{x}$. When $x$ doubles, $y$ is halved; when $x$ triples, $y$ becomes a third.

A relation $y = \\frac{k}{x}$, or $xy = k$, for a fixed number $k \\ne 0$, is called **inverse variation**. In this lesson we tell inverse variation from direct variation, find the constant $k$, write the equation and use it to find new values.`,
    `在正比例关系 $y = kx$ 中，**比值** $\\frac{y}{x}$ 不变：$x$ 变为两倍，$y$ 也变为两倍。很多量恰好相反。把 $24$ 块饼干平均分：$2$ 个朋友每人 $12$ 块，$3$ 个朋友每人 $8$ 块，$4$ 个朋友每人 $6$ 块，$6$ 个朋友每人 $4$ 块。人越多，每人分得越少，不变的是**乘积**：

$$2 \\cdot 12 = 3 \\cdot 8 = 4 \\cdot 6 = 6 \\cdot 4 = 24.$$

所以每人分得的块数是 $y = \\frac{24}{x}$。$x$ 变为两倍，$y$ 变为一半；$x$ 变为三倍，$y$ 变为三分之一。

关系 $y = \\frac{k}{x}$，即 $xy = k$，其中 $k \\ne 0$ 是固定的数，叫做**反比例关系**。这节课区分反比例和正比例，求常数 $k$，写出方程，并用它求新的值。`,
  ),
  knowledgePoints: [
    {
      id: "recognizing-inverse-variation",
      title: t("Recognizing inverse variation", "识别反比例关系"),
      explanation: t(
        `$y$ **varies inversely** with $x$ when $y = \\frac{k}{x}$ for a constant $k \\ne 0$. Multiplying both sides by $x$ gives $xy = k$: the **product** of every pair is the same. When $x$ doubles, $y$ must be halved to keep the product.

To classify a set of points, compute the ratios $\\frac{y}{x}$ and the products $xy$: equal ratios mean direct variation, equal products inverse variation, and if neither is constant, neither. The points $(2, 12)$, $(3, 8)$, $(4, 6)$ vary inversely: $2 \\cdot 12 = 3 \\cdot 8 = 4 \\cdot 6 = 24$.

> **Watch out.** A quantity that goes down as $x$ goes up does not have to vary inversely. The points $(1, 11)$, $(2, 10)$, $(3, 9)$ decrease steadily, but their products are $11$, $20$, $27$: they are neither direct nor inverse. Check the products, not just the direction.`,
        `如果 $y = \\frac{k}{x}$，其中 $k \\ne 0$ 是常数，就说 $y$ 与 $x$ **成反比例**。两边乘 $x$ 得 $xy = k$：每一组值的**乘积**都相同。$x$ 变为两倍时，$y$ 必须变为一半，乘积才不变。

判断一组点的关系，计算比值 $\\frac{y}{x}$ 和乘积 $xy$：比值相等是正比例，乘积相等是反比例，两者都不固定就都不是。点 $(2, 12)$、$(3, 8)$、$(4, 6)$ 成反比例：$2 \\cdot 12 = 3 \\cdot 8 = 4 \\cdot 6 = 24$。

> **注意。** $x$ 增大时 $y$ 减小，不一定就是反比例。点 $(1, 11)$、$(2, 10)$、$(3, 9)$ 均匀减小，但乘积是 $11$、$20$、$27$：既不是正比例也不是反比例。要检验乘积，不能只看变化的方向。`,
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
        const [x0, y0] = pts[0]!;
        const offDirect = pts.find(([x, y]) => y * x0 !== y0 * x);
        const offInverse = pts.find(([x, y]) => x * y !== x0 * y0);
        const check = (en: boolean): string => {
          if (correct === 0) {
            const r = num(q(y0, x0));
            return en
              ? `Every point fits $y = ${r === "1" ? "" : r}x$: each $y$ is $${r}$ times its $x$.`
              : `每个点都满足 $y = ${r === "1" ? "" : r}x$：每个 $y$ 都是它的 $x$ 的 $${r}$ 倍。`;
          }
          if (correct === 1) {
            return en
              ? `Every point fits $y = \\frac{${x0 * y0}}{x}$: ${pts.map(([x, y]) => `$\\frac{${x0 * y0}}{${x}} = ${y}$`).join(", ")}.`
              : `每个点都满足 $y = \\frac{${x0 * y0}}{x}$：${pts.map(([x, y]) => `$\\frac{${x0 * y0}}{${x}} = ${y}$`).join("，")}。`;
          }
          const [xd, yd] = offDirect!;
          const [xi, yi] = offInverse!;
          return en
            ? `From the first point, direct variation would need $y = ${num(q(y0 * xd, x0))}$ at $x = ${xd}$, and inverse variation $y = ${num(q(x0 * y0, xi))}$ at $x = ${xi}$; the points give $${yd}$ and $${yi}$.`
            : `由第一个点，若成正比例，$x = ${xd}$ 时应有 $y = ${num(q(y0 * xd, x0))}$；若成反比例，$x = ${xi}$ 时应有 $y = ${num(q(x0 * y0, xi))}$；而这些点给出的是 $${yd}$ 和 $${yi}$。`;
        };
        return choiceProblem({
          prompt: t(
            `Do the points ${points(pts).en} show direct variation, inverse variation, or neither?`,
            `点 ${points(pts)["zh-CN"]} 表示正比例关系、反比例关系，还是都不是？`,
          ),
          options: [t("Direct variation", "正比例关系"), t("Inverse variation", "反比例关系"), t("Neither", "都不是")],
          correct,
          solution: t(
            `**Step 1: the ratios.** Direct variation keeps $\\frac{y}{x}$ the same:${steps(ratios)}**Step 2: the products.** Inverse variation keeps $xy$ the same:${steps(products)}${["The ratios are equal: direct variation.", "The products are equal: inverse variation.", "Neither the ratios nor the products are all equal: neither."][correct]}

**Check.** ${check(true)}`,
            `**第一步：求比值。** 正比例关系的 $\\frac{y}{x}$ 不变：${steps(ratios)}**第二步：求乘积。** 反比例关系的 $xy$ 不变：${steps(products)}${["比值相等：正比例关系。", "乘积相等：反比例关系。", "比值和乘积都不全相等：都不是。"][correct]}

**检验。** ${check(false)}`,
          ),
        });
      },
    },
    {
      id: "constant-of-inverse-variation",
      title: t("The constant of variation", "比例常数"),
      explanation: t(
        `If $y$ varies inversely with $x$, then $y = \\frac{k}{x}$, and multiplying both sides by $x$ gives $k = xy$ for any pair of values. If $y = 6$ when $x = 4$:

$$k = 4 \\cdot 6 = 24.$$

Check: $\\frac{24}{4} = 6$.

> **Watch out.** Multiply, do not divide: $\\frac{6}{4}$ or $\\frac{4}{6}$ would be the constant of a direct variation. And the constant is a product, not a sum: $4 + 6 = 10$ does not stay the same as $x$ and $y$ change.`,
        `如果 $y$ 与 $x$ 成反比例，那么 $y = \\frac{k}{x}$，两边乘 $x$，对任何一组值都有 $k = xy$。若 $x = 4$ 时 $y = 6$：

$$k = 4 \\cdot 6 = 24.$$

检验：$\\frac{24}{4} = 6$。

> **注意。** 要相乘，不要相除：$\\frac{6}{4}$ 或 $\\frac{4}{6}$ 是正比例关系的常数。常数是积，不是和：$x$ 和 $y$ 变化时，$4 + 6 = 10$ 并不保持不变。`,
      ),
      generate(rng) {
        const { x, y, k } = inverseData(rng);
        const product = productStep(x, y, k);
        return numberProblem({
          prompt: t(
            `$y$ varies inversely with $x$, and $y = ${y}$ when $x = ${x}$. Find the constant of variation $k$.`,
            `$y$ 与 $x$ 成反比例，当 $x = ${x}$ 时 $y = ${y}$。求比例常数 $k$。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [q(y, x), q(x, y), x + y],
          solution: t(
            `${product.en}**Check.** $\\frac{k}{x} = ${k} \\div ${paren(x)} = ${y}$, the given value of $y$.`,
            `${product["zh-CN"]}**检验。** $\\frac{k}{x} = ${k} \\div ${paren(x)} = ${y}$，正是已知的 $y$ 值。`,
          ),
        });
      },
    },
    {
      id: "writing-inverse-variation-equations",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        `In an inverse variation the product of the two quantities stays constant: when one doubles, the other halves. That constant product is $k$, and every inverse variation has the form $y = \\frac{k}{x}$.

So find $k = xy$ from a known pair and put it in place of $k$. If $y = 6$ when $x = 4$, then $k = 24$ and

$$y = \\frac{24}{x}.$$

Check with the known pair: $\\frac{24}{4} = 6$.

> **Watch out.** The constant goes on **top**, with $x$ underneath: $y = \\frac{x}{24}$ grows with $x$, and $y = 24x$ is a direct variation. Using the ratio, $y = \\frac{6}{4}x$, also writes a direct variation.`,
        `在反比例关系中，两个量的乘积保持不变：一个量变为两倍时，另一个量变为一半。这个不变的乘积就是 $k$，每个反比例关系都形如 $y = \\frac{k}{x}$。

所以由一组已知的值求出 $k = xy$，代替 $k$。若 $x = 4$ 时 $y = 6$，则 $k = 24$，

$$y = \\frac{24}{x}.$$

用已知的一组值检验：$\\frac{24}{4} = 6$。

> **注意。** 常数在**上面**，$x$ 在下面：$y = \\frac{x}{24}$ 随 $x$ 增大，而 $y = 24x$ 是正比例关系。用比值写成 $y = \\frac{6}{4}x$，也是正比例关系。`,
      ),
      generate(rng) {
        const { x, y, k } = inverseData(rng);
        const product = productStep(x, y, k);
        return equationProblem("y", {
          prompt: t(
            `$y$ varies inversely with $x$, and $y = ${y}$ when $x = ${x}$. Write an equation for $y$ in terms of $x$.`,
            `$y$ 与 $x$ 成反比例，当 $x = ${x}$ 时 $y = ${y}$。写出用 $x$ 表示 $y$ 的方程。`,
          ),
          answer: inverseFraction(k),
          wrong: [linear(k, 0), `${k < 0 ? "-" : ""}\\frac{x}{${Math.abs(k)}}`, linear(q(y, x), 0)],
          solution: t(
            `**Step 1: find $k$.** ${product.en}**Step 2: write the equation.** Put this value in place of $k$ in $y = \\frac{k}{x}$:${steps(`y = ${inverseFraction(k)}`)}**Check.** At $x = ${x}$ the equation gives $y = ${k} \\div ${paren(x)} = ${y}$, the given value.`,
            `**第一步：求 $k$。** ${product["zh-CN"]}**第二步：写出方程。** 把这个值代替 $y = \\frac{k}{x}$ 中的 $k$：${steps(`y = ${inverseFraction(k)}`)}**检验。** $x = ${x}$ 时，方程给出 $y = ${k} \\div ${paren(x)} = ${y}$，正是已知的值。`,
          ),
        });
      },
    },
    {
      id: "using-inverse-variation",
      title: t("Finding a value", "求值"),
      explanation: t(
        `To find a new value, first find the constant $k = xy$ from the known pair; then $y = \\frac{k}{x}$, so divide $k$ by the new value of $x$. If $y = 6$ when $x = 4$, then $k = 24$, and when $x = 8$:

$$y = \\frac{24}{8} = 3.$$

When $x$ doubled, $y$ was halved, and the product is still $8 \\cdot 3 = 24$.

> **Watch out.** Setting up a direct proportion, $\\frac{6}{4} = \\frac{y}{8}$, gives $y = 12$, which grows with $x$ instead of shrinking. Multiplying $k$ by the new $x$, or dividing the new $x$ by $k$, also loses the constant product.`,
        `要求新的值，先由已知的一组值求出常数 $k = xy$；因为 $y = \\frac{k}{x}$，所以用 $k$ 除以新的 $x$ 值。若 $x = 4$ 时 $y = 6$，则 $k = 24$；当 $x = 8$ 时

$$y = \\frac{24}{8} = 3.$$

$x$ 变为两倍，$y$ 变为一半，乘积仍是 $8 \\cdot 3 = 24$。

> **注意。** 按正比例列式，$\\frac{6}{4} = \\frac{y}{8}$，得 $y = 12$，$y$ 随 $x$ 增大而不是减小。用 $k$ 乘新的 $x$，或用新的 $x$ 除以 $k$，也都失去了不变的乘积。`,
      ),
      generate(rng) {
        const { x, y, k } = inverseData(rng);
        const x2 = rng.pick(range(-12, 12).filter((v) => Math.abs(v) > 1 && Math.abs(v) !== Math.abs(x)));
        const answer = q(k, x2);
        const product = productStep(x, y, k);
        return numberProblem({
          prompt: t(
            `$y$ varies inversely with $x$, and $y = ${y}$ when $x = ${x}$. Find $y$ when $x = ${x2}$.`,
            `$y$ 与 $x$ 成反比例，当 $x = ${x}$ 时 $y = ${y}$。求 $x = ${x2}$ 时 $y$ 的值。`,
          ),
          answer,
          solveFor: "y",
          wrong: [q(y * x2, x), k * x2, q(x2, k)],
          solution: t(
            `**Step 1: find $k$.** ${product.en}**Step 2: divide by the new $x$.** Since $y = \\frac{${k}}{x}$:${steps(`y = \\frac{${k}}{${x2}} = ${num(answer)}`)}**Check.** The product is unchanged: $${x2} \\cdot ${factor(answer)} = ${k}$. And $|x|$ went ${Math.abs(x2) > Math.abs(x) ? "up" : "down"} from $${Math.abs(x)}$ to $${Math.abs(x2)}$, so $|y|$ went ${Math.abs(x2) > Math.abs(x) ? "down" : "up"}.`,
            `**第一步：求 $k$。** ${product["zh-CN"]}**第二步：除以新的 $x$。** 因为 $y = \\frac{${k}}{x}$：${steps(`y = \\frac{${k}}{${x2}} = ${num(answer)}`)}**检验。** 乘积不变：$${x2} \\cdot ${factor(answer)} = ${k}$。而 $|x|$ 从 $${Math.abs(x)}$ ${Math.abs(x2) > Math.abs(x) ? "增大" : "减小"}到 $${Math.abs(x2)}$，所以 $|y|$ ${Math.abs(x2) > Math.abs(x) ? "减小了" : "增大了"}。`,
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

/** contextProduct explains the constant of an inverse-variation model as the product of the known pair. */
const contextProduct = (c: InverseContext, x1: number, y1: number, k: number): Text =>
  t(
    `In an inverse variation the product $${c.x}${c.y}$ stays the same, so it is the constant:${steps(`k = ${c.x}${c.y} = ${x1} \\cdot ${y1} = ${k}`)}`,
    `反比例关系中乘积 $${c.x}${c.y}$ 保持不变，所以它就是常数：${steps(`k = ${c.x}${c.y} = ${x1} \\cdot ${y1} = ${k}`)}`,
  );

export const modelingWithInverseVariation: TopicDef = {
  id: "modeling-with-inverse-variation",
  title: t("Modeling With Inverse Variation", "用反比例关系建模"),
  summary: t("Write and use inverse-variation models of real situations.", "写出并使用实际情境中的反比例模型。"),
  prerequisites: ["inverse-variation", "modeling-with-direct-variation"],
  encompasses: [{ topic: "inverse-variation", weight: 0.5 }],
  xp: 12,
  intro: t(
    `A direct-variation model such as $d = 80t$ describes quantities that grow together. An inverse variation $y = \\frac{k}{x}$ describes two quantities whose product is fixed, and that happens whenever a fixed total is split up. A trip of $240$ km takes $3$ hours at $80$ km/h, $4$ hours at $60$ km/h and $6$ hours at $40$ km/h: speed times time is always the distance,

$$v \\cdot t = 240, \\qquad t = \\frac{240}{v}.$$

The constant $k$ has a meaning here: it is the fixed total, the length of the trip. In the same way, the days a job takes times the number of workers is the total work, and the share each person pays times the number of people is the total bill. In this lesson we write such models from one known pair and use them to predict new values.`,
    `像 $d = 80t$ 这样的正比例模型，描述一起增长的量。反比例关系 $y = \\frac{k}{x}$ 描述乘积固定的两个量，而只要把一个固定的总量分开，就会出现这种情况。$240$ km 的路程，以 $80$ km/h 行驶要 $3$ 小时，$60$ km/h 要 $4$ 小时，$40$ km/h 要 $6$ 小时：速度乘时间总是路程，

$$v \\cdot t = 240, \\qquad t = \\frac{240}{v}.$$

这里常数 $k$ 有实际意义：它是固定的总量，即路程的长度。同样，完成一项工作的天数乘工人数是总工作量，每人分担的费用乘人数是总费用。这节课由一组已知的值写出这样的模型，并用它预测新的值。`,
  ),
  knowledgePoints: [
    {
      id: "writing-inverse-variation-models",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        `When one quantity doubles and another halves, as the time of a job and the number of workers, they vary inversely. The constant is the product of the two quantities, here the total work: if $6$ painters take $10$ days, the job is $6 \\cdot 10 = 60$ painter-days, and

$$t = \\frac{60}{n}.$$

Check with the known pair: $\\frac{60}{6} = 10$ days.

> **Watch out.** The constant is the product, not the ratio: $t = \\frac{10}{6}n$ would make more painters take longer. And the constant goes on top: $t = 60n$ and $t = \\frac{n}{60}$ both grow as painters are added.`,
        `一个量变为两倍、另一个量变为一半时，例如完成一项工作的时间与工人数，它们成反比例。常数是两个量的乘积，这里是总工作量：如果 $6$ 名油漆工需要 $10$ 天，这项工作就是 $6 \\cdot 10 = 60$ 个“人·天”，

$$t = \\frac{60}{n}.$$

用已知的一组值检验：$\\frac{60}{6} = 10$ 天。

> **注意。** 常数是乘积，不是比值：$t = \\frac{10}{6}n$ 会让人越多用时越长。常数要在上面：$t = 60n$ 和 $t = \\frac{n}{60}$ 都会随人数增加而变大。`,
      ),
      generate(rng) {
        const { c, k, x1, y1 } = inverseContextData(rng);
        const setup = c.setup(x1, y1);
        const product = contextProduct(c, x1, y1, k);
        return equationProblem(c.y, {
          prompt: t(
            `${setup.en} Write an equation for $${c.y}$ in terms of $${c.x}$.`,
            `${setup["zh-CN"]}写出用 $${c.x}$ 表示 $${c.y}$ 的方程。`,
          ),
          answer: inverseFraction(k, c.x),
          wrong: [linear(k, 0, c.x), `\\frac{${c.x}}{${k}}`, linear(q(y1, x1), 0, c.x)],
          solution: t(
            `**Step 1: the constant.** ${product.en}**Step 2: the model.** Dividing by $${c.x}$ gives $${c.y}$:${steps(`${c.y} = ${inverseFraction(k, c.x)}`)}**Check.** With $${c.x} = ${x1}$ the model gives $\\frac{${k}}{${x1}} = ${y1}$, the given value.`,
            `**第一步：求常数。** ${product["zh-CN"]}**第二步：写出模型。** 除以 $${c.x}$ 得 $${c.y}$：${steps(`${c.y} = ${inverseFraction(k, c.x)}`)}**检验。** $${c.x} = ${x1}$ 时，模型给出 $\\frac{${k}}{${x1}} = ${y1}$，正是已知的值。`,
          ),
        });
      },
    },
    {
      id: "predicting-with-inverse-variation",
      title: t("Predicting a value", "预测数值"),
      explanation: t(
        `Find the constant $k$ as the product of the known pair, then divide it by the new value. If $6$ painters take $10$ days, then $k = 60$ and $4$ painters take

$$t = \\frac{60}{4} = 15 \\text{ days}.$$

Fewer painters take **longer**, and the total work is still $4 \\cdot 15 = 60$ painter-days.

> **Watch out.** Setting up a direct proportion, $\\frac{10}{6} = \\frac{t}{4}$, wrongly gives fewer days for fewer painters. And multiplying the constant by the new value, $60 \\cdot 4$, counts painter-days, not days.`,
        `由已知的一组值求出乘积 $k$，再除以新的值。如果 $6$ 名油漆工需要 $10$ 天，那么 $k = 60$，$4$ 名油漆工需要

$$t = \\frac{60}{4} = 15 \\text{ 天}.$$

人越少，用时越**长**，总工作量仍是 $4 \\cdot 15 = 60$ 个“人·天”。

> **注意。** 按正比例列式，$\\frac{10}{6} = \\frac{t}{4}$，会错误地得出人少天数也少。用常数乘新的值，$60 \\cdot 4$，算出的是“人·天”，不是天数。`,
      ),
      generate(rng) {
        const { c, k, x1, x2, y1, y2 } = inverseContextData(rng);
        const setup = c.setup(x1, y1);
        const ask = c.ask(x2);
        const product = contextProduct(c, x1, y1, k);
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: y2,
          wrong: [q(y1 * x2, x1), k * x2],
          solution: t(
            `**Step 1: the constant.** ${product.en}**Step 2: divide by the new value.** The model is $${c.y} = ${inverseFraction(k, c.x)}$, so at $${c.x} = ${x2}$:${steps(`${c.y} = \\frac{${k}}{${x2}} = ${y2}`)}**Check.** The product is unchanged, $${x2} \\cdot ${y2} = ${k}$, and $${c.x}$ went ${x2 > x1 ? "up" : "down"} from $${x1}$ to $${x2}$, so $${c.y}$ went ${x2 > x1 ? "down" : "up"} from $${y1}$ to $${y2}$.`,
            `**第一步：求常数。** ${product["zh-CN"]}**第二步：除以新的值。** 模型是 $${c.y} = ${inverseFraction(k, c.x)}$，所以 $${c.x} = ${x2}$ 时：${steps(`${c.y} = \\frac{${k}}{${x2}} = ${y2}`)}**检验。** 乘积不变，$${x2} \\cdot ${y2} = ${k}$；$${c.x}$ 从 $${x1}$ ${x2 > x1 ? "增大" : "减小"}到 $${x2}$，所以 $${c.y}$ 从 $${y1}$ ${x2 > x1 ? "减小" : "增大"}到 $${y2}$。`,
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
