import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// SAT Math Fundamentals, problem solving and data analysis: ratios in context, unit conversions through base units,
// density and physical models, and how means, medians and spreads respond to changes in the data.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** Unit is a unit of measure with its size in a base unit and its names. */
interface Unit {
  readonly symbol: string;
  readonly size: Q;
  readonly en: string;
  readonly zh: string;
}

/** convertProblem converts an amount between two units through their base unit. */
function convertProblem(rng: Rng, units: readonly Unit[], base: Unit, amounts: (from: Unit, to: Unit) => Q): Problem {
  const [from, to] = rng.sample([...units], 2) as [Unit, Unit];
  const amount = amounts(from, to);
  const value = amount.mul(from.size).div(to.size);
  const inBase = amount.mul(from.size).div(base.size);
  const show = (q: Q) => dec(q);
  const fromB = from.size.div(base.size);
  const toB = to.size.div(base.size);
  const one = (u: Unit) => (u.en === "feet" ? "foot" : u.en === "inches" ? "inch" : u.en.slice(0, -1));
  const larger = to.size.sub(from.size).sign() > 0;
  const a = (u: Unit) => (/^[aeiou]|^hour/.test(one(u)) ? "an" : "a");
  const intoBase = (label: string) =>
    `${label}Each ${one(from)} is $${show(fromB)}$ ${base.en}, so multiply by $${show(fromB)}$ to count the ${base.en}:${steps(`${show(amount)} \\cdot ${show(fromB)} = ${show(inBase)}`)}`;
  const outOfBase = (label: string) =>
    `${label}Each ${one(to)} is $${show(toB)}$ ${base.en}, so divide by $${show(toB)}$ to count how many ${to.en} the ${base.en} make:${steps(`${show(inBase)} \\div ${show(toB)} = ${show(value)}`)}`;
  const intoBaseZh = (label: string) =>
    `${label}每 $1$ ${from.zh}是 $${show(fromB)}$ ${base.zh}，所以乘以 $${show(fromB)}$，求出有多少${base.zh}：${steps(`${show(amount)} \\cdot ${show(fromB)} = ${show(inBase)}`)}`;
  const outOfBaseZh = (label: string) =>
    `${label}每 $1$ ${to.zh}是 $${show(toB)}$ ${base.zh}，所以除以 $${show(toB)}$，求出这些${base.zh}能凑成多少${to.zh}：${steps(`${show(inBase)} \\div ${show(toB)} = ${show(value)}`)}`;
  const back = from.size.eq(base.size)
    ? `${show(value)} \\cdot ${show(toB)} = ${show(amount)}`
    : to.size.eq(base.size)
      ? `${show(value)} \\div ${show(fromB)} = ${show(amount)}`
      : `${show(value)} \\cdot ${show(toB)} \\div ${show(fromB)} = ${show(amount)}`;
  const check = `**Check.** ${a(to) === "an" ? "An" : "A"} ${one(to)} is ${larger ? "larger" : "smaller"} than ${a(from)} ${one(from)}, so the number should get ${larger ? "smaller" : "bigger"}, and $${show(value)}$ is ${larger ? "less" : "more"} than $${show(amount)}$. Converting back gives $${back}$ ${from.en}.`;
  const checkZh = `**检验。** ${to.zh}比${from.zh}${larger ? "大" : "小"}，所以数值应该变${larger ? "小" : "大"}；$${show(value)}$ 确实比 $${show(amount)}$ ${larger ? "小" : "大"}。反过来换算：$${back}$ ${from.zh}。`;
  const en = from.size.eq(base.size)
    ? `The amount is already in the base unit, ${base.en}. ${outOfBase("")}`
    : to.size.eq(base.size)
      ? `The new unit is the base unit, ${base.en}. ${intoBase("")}`
      : `${intoBase(`**Step 1: into ${base.en}.** `)}\n\n${outOfBase(`**Step 2: into ${to.en}.** `)}`;
  const zh = from.size.eq(base.size)
    ? `数量已经用基本单位${base.zh}表示。${outOfBaseZh("")}`
    : to.size.eq(base.size)
      ? `新单位就是基本单位${base.zh}。${intoBaseZh("")}`
      : `${intoBaseZh(`**第一步：换算成${base.zh}。** `)}\n\n${outOfBaseZh(`**第二步：换算成${to.zh}。** `)}`;
  return numberProblem({
    prompt: t(`Convert $${show(amount)}$ ${from.en} to ${to.en}.`, `把 $${show(amount)}$ ${from.zh}换算成${to.zh}。`),
    answer: value,
    form: "decimal",
    unit: to.symbol,
    wrong: [amount.mul(to.size).div(from.size), amount.mul(from.size), amount.div(to.size), value.mul(Q.of(10))].filter(
      (w) => !w.eq(value),
    ),
    solution: t(`${en}\n\n${check}`, `${zh}\n\n${checkZh}`),
  });
}

/** amountFor picks an amount with at most two decimal places. */
function amountFor(rng: Rng): () => Q {
  return () => Q.of(rng.int(1, 999), rng.pick([1, 10, 100]));
}

/** mean is the mean of a list of numbers. */
function mean(xs: readonly number[]): Q {
  return Q.of(
    xs.reduce((a, b) => a + b, 0),
    xs.length,
  );
}

/** median is the median of a list of numbers. */
function median(xs: readonly number[]): Q {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 === 1 ? Q.of(s[(n - 1) / 2]!) : Q.of(s[n / 2 - 1]! + s[n / 2]!, 2);
}

/** list writes numbers separated by commas. */
function list(xs: readonly number[]): string {
  return xs.join(", ");
}

// ---------------------------------------------------------------------------
// Ratios

/** manipulatingRatiosInVariousContexts splits totals by a ratio and chains ratios through a common term. */
export const manipulatingRatiosInVariousContexts = topic(
  "manipulating-ratios-in-various-contexts",
  t("Manipulating Ratios in Various Contexts", "在各种情境中运用比"),
  t(
    "Split a total in a given ratio, and combine two ratios that share a quantity into one.",
    "按给定的比分配总量，并把含有同一个量的两个比合并成一个比。",
  ),
  ["further-reasoning-with-equivalent-ratios"],
  ["6.RP.A.3", "7.RP.A.2"],
  [
    kp(
      "splitting-a-total",
      t("Splitting a total in a ratio", "按比分配总量"),
      t(
        "If two quantities are in the ratio $a : b$, the total is made of $a + b$ equal parts. Divide the total by $a + b$ to find one part, then multiply by $a$ or $b$. A ratio of $3 : 5$ with a total of $64$ gives parts of $8$, so the quantities are $24$ and $40$.",
        "如果两个量的比为 $a : b$，总量由 $a + b$ 份相等的部分组成。用总量除以 $a + b$ 求出一份，再乘以 $a$ 或 $b$。比为 $3 : 5$、总量为 $64$ 时，每份是 $8$，所以两个量分别是 $24$ 和 $40$。",
      ),
      (rng) => {
        const [a, b] = rng.pick([
          [2, 3],
          [3, 5],
          [4, 7],
          [1, 4],
          [5, 3],
          [7, 2],
          [3, 8],
          [5, 6],
        ] as const);
        const part = rng.int(2, 25);
        const context = rng.pick([
          ["red marbles to blue marbles", "红色弹珠与蓝色弹珠", "marbles", "颗弹珠", "red marbles", "红色弹珠", "blue marbles", "蓝色弹珠"],
          ["adults to children at a concert", "音乐会上成人与儿童", "people", "人", "adults", "成人", "children", "儿童"],
          [
            "flour to sugar by weight in a mix",
            "混合物中面粉与糖的重量",
            "grams",
            "克",
            "grams of flour",
            "克面粉",
            "grams of sugar",
            "克糖",
          ],
        ] as const);
        const askFirst = rng.bool();
        const total = (a + b) * part;
        const value = (askFirst ? a : b) * part;
        return numberProblem({
          prompt: t(
            `The ratio of ${context[0]} is $${a} : ${b}$, and there are $${total}$ ${context[2]} in all. How many ${askFirst ? context[4] : context[6]} are there?`,
            `${context[1]}的比为 $${a} : ${b}$，一共有 $${total}$ ${context[3]}。${askFirst ? context[5] : context[7]}有多少？`,
          ),
          answer: value,
          wrong: [(askFirst ? b : a) * part, Q.of(total * (askFirst ? a : b), askFirst ? b : a), part],
          solution: t(
            `There are $${a} + ${b} = ${a + b}$ parts, so one part is $\\frac{${total}}{${a + b}} = ${part}$. The answer is $${askFirst ? a : b} \\cdot ${part} = ${value}$.`,
            `一共 $${a} + ${b} = ${a + b}$ 份，所以一份是 $\\frac{${total}}{${a + b}} = ${part}$。答案是 $${askFirst ? a : b} \\cdot ${part} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "chaining-ratios",
      t("Chaining ratios", "连比"),
      t(
        "If $A : B = p : q$ and $B : C = r : s$, rewrite both with the same number for $B$: multiply the first ratio by $r$ and the second by $q$. Then $A : B : C = pr : qr : qs$, and $A : C = pr : qs$.",
        "若 $A : B = p : q$，$B : C = r : s$，就把两个比改写成 $B$ 对应同一个数：第一个比乘以 $r$，第二个比乘以 $q$。于是 $A : B : C = pr : qr : qs$，$A : C = pr : qs$。",
      ),
      (rng) => {
        const p = rng.int(1, 9);
        const q = rng.int(1, 9);
        const r = rng.int(1, 9);
        const s = rng.int(1, 9);
        if (p === q && r === s) return manipulatingRatiosInVariousContexts.knowledgePoints[1]!.generate(rng);
        const c = rng.int(1, 6) * q * s;
        const a = Q.of(p * r * c, q * s);
        return numberProblem({
          prompt: t(
            `On a farm, the ratio of goats to sheep is $${p} : ${q}$ and the ratio of sheep to cows is $${r} : ${s}$. If there are $${c}$ cows, how many goats are there?`,
            `在一个农场里，山羊与绵羊的比为 $${p} : ${q}$，绵羊与奶牛的比为 $${r} : ${s}$。如果有 $${c}$ 头奶牛，那么有多少只山羊？`,
          ),
          answer: a,
          wrong: [Q.of(p * c, s), Q.of(p * s * c, q * r), Q.of(c * (p + q), r + s)].filter((w) => !w.eq(a)),
          solution: t(
            `The number of sheep is $${c} \\cdot \\frac{${r}}{${s}} = ${Q.of(c * r, s).toLatex()}$, and the number of goats is $${Q.of(c * r, s).toLatex()} \\cdot \\frac{${p}}{${q}} = ${a.toLatex()}$.`,
            `绵羊有 $${c} \\cdot \\frac{${r}}{${s}} = ${Q.of(c * r, s).toLatex()}$ 只，山羊有 $${Q.of(c * r, s).toLatex()} \\cdot \\frac{${p}}{${q}} = ${a.toLatex()}$ 只。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Units

const gram: Unit = { symbol: "g", size: Q.of(1), en: "grams", zh: "克" };
const metricMass: readonly Unit[] = [
  { symbol: "mg", size: Q.of(1, 1000), en: "milligrams", zh: "毫克" },
  { symbol: "cg", size: Q.of(1, 100), en: "centigrams", zh: "厘克" },
  gram,
  { symbol: "kg", size: Q.of(1000), en: "kilograms", zh: "千克" },
];
const pound: Unit = { symbol: "lb", size: Q.of(16), en: "pounds", zh: "磅" };
const customaryMass: readonly Unit[] = [
  { symbol: "oz", size: Q.of(1), en: "ounces", zh: "盎司" },
  pound,
  { symbol: "ton", size: Q.of(32000), en: "tons", zh: "短吨" },
];
const meter: Unit = { symbol: "m", size: Q.of(1), en: "meters", zh: "米" };
const metricLength: readonly Unit[] = [
  { symbol: "mm", size: Q.of(1, 1000), en: "millimeters", zh: "毫米" },
  { symbol: "cm", size: Q.of(1, 100), en: "centimeters", zh: "厘米" },
  meter,
  { symbol: "km", size: Q.of(1000), en: "kilometers", zh: "千米" },
];
const foot: Unit = { symbol: "ft", size: Q.of(12), en: "feet", zh: "英尺" };
const customaryLength: readonly Unit[] = [
  { symbol: "in", size: Q.of(1), en: "inches", zh: "英寸" },
  foot,
  { symbol: "yd", size: Q.of(36), en: "yards", zh: "码" },
];
const second: Unit = { symbol: "s", size: Q.of(1), en: "seconds", zh: "秒" };
const times: readonly Unit[] = [
  second,
  { symbol: "min", size: Q.of(60), en: "minutes", zh: "分钟" },
  { symbol: "h", size: Q.of(3600), en: "hours", zh: "小时" },
  { symbol: "d", size: Q.of(86400), en: "days", zh: "天" },
  { symbol: "wk", size: Q.of(604800), en: "weeks", zh: "周" },
];

/** unitConversionsUsingBaseUnitsOfMass converts between metric or customary units of mass. */
export const unitConversionsUsingBaseUnitsOfMass: TopicDef = {
  ...topic(
  "unit-conversions-using-base-units-of-mass",
  t("Unit Conversions Using Base Units of Mass", "以基本单位换算质量单位"),
  t(
    "Convert between units of mass by going through a base unit: grams for metric units and ounces for customary units.",
    "通过基本单位换算质量单位：公制单位通过克，英制单位通过盎司。",
  ),
  ["two-step-unit-conversions", "converting-units-of-mass-to-larger-units"],
  ["6.RP.A.3.D", "HSN.Q.A.1"],
  [
    kp(
      "metric-mass",
      t("Metric units of mass", "公制质量单位"),
      t(
        "Every metric unit of mass is a power of ten times a gram: a milligram is $0.001$ g, a centigram $0.01$ g and a kilogram $1000$ g. Multiplying by the size of the old unit counts the grams; dividing by the size of the new unit counts how many new units those grams fill. For example, $2.5$ kg in centigrams: $2.5 \\cdot 1000 = 2500$ g, and $2500 \\div 0.01 = 250{,}000$ cg. Centigrams are much smaller, so the number grows.\n\n> **Watch out.** Do both steps. Stopping at grams, or dividing the starting amount by the new unit's size without first changing it to grams, gives the wrong number, and so does turning the factor upside down. Count the zeros carefully: one place too many is ten times too big.",
        "每个公制质量单位都是克的十的幂倍：毫克是 $0.001$ g，厘克是 $0.01$ g，千克是 $1000$ g。乘以原单位的大小，就数出了有多少克；除以新单位的大小，就数出这些克能凑成多少个新单位。例如把 $2.5$ kg 换算成厘克：$2.5 \\cdot 1000 = 2500$ g，$2500 \\div 0.01 = 250{,}000$ cg。厘克小得多，所以数值变大。\n\n> **注意。** 两步都要做。只换算到克就停下，或者没有先换成克就直接用原数除以新单位的大小，都会出错；把系数颠倒也不对。数零要仔细：多一位就大了十倍。",
      ),
      (rng) => convertProblem(rng, metricMass, gram, amountFor(rng)),
    ),
    kp(
      "customary-mass",
      t("Customary units of mass", "英制质量单位"),
      t(
        "In customary units, $1$ pound is $16$ ounces and $1$ ton is $2000$ pounds, so a ton is $2000 \\cdot 16 = 32{,}000$ ounces. Convert through ounces: multiply by the number of ounces in the starting unit, then divide by the number in the new unit. For example, $3$ tons is $3 \\cdot 32{,}000 = 96{,}000$ oz, and $96{,}000 \\div 16 = 6000$ lb.\n\n> **Watch out.** Going to a larger unit makes the number smaller, so multiplying there is a sign the factor is upside down. Do not stop at ounces when the question asks for pounds or tons.",
        "在英制单位中，$1$ 磅等于 $16$ 盎司，$1$ 短吨等于 $2000$ 磅，所以 $1$ 短吨等于 $2000 \\cdot 16 = 32{,}000$ 盎司。通过盎司换算：先乘以原单位含有的盎司数，再除以新单位含有的盎司数。例如 $3$ 短吨是 $3 \\cdot 32{,}000 = 96{,}000$ 盎司，$96{,}000 \\div 16 = 6000$ 磅。\n\n> **注意。** 换算成较大的单位，数值会变小；如果这时却在做乘法，说明系数颠倒了。题目问磅或短吨时，不要停在盎司。",
      ),
      (rng) =>
        convertProblem(rng, customaryMass, { ...customaryMass[0]! }, (from, to) => {
          const ratio = to.size.div(from.size);
          return ratio.sub(Q.one).sign() > 0
            ? ratio.mul(Q.of(rng.int(1, 40), rng.pick([1, 2, 4])))
            : Q.of(rng.int(1, 60), rng.pick([1, 2, 4]));
        }),
    ),
  ],
  ),
  intro: t(
    "Remembering a conversion factor for every pair of units is hard, and it is easy to multiply when you should divide. A safer route is to choose one base unit and know how big every other unit is in it: grams for metric masses, ounces for customary ones. Then any conversion is two short steps. First multiply by the size of the old unit to find how many base units there are, then divide by the size of the new unit to see how many new units they fill. A larger unit always needs fewer of itself, so you can check each answer by asking whether the number should get bigger or smaller.",
    "每一对单位都记一个换算系数很难，也容易把该除的算成乘。更稳妥的办法是选定一个基本单位，并知道其他单位各相当于多少个基本单位：公制质量用克，英制质量用盎司。这样任何换算都只要两小步：先乘以原单位的大小，求出有多少个基本单位；再除以新单位的大小，看这些基本单位能凑成多少个新单位。单位越大，需要的个数就越少，所以每个答案都可以通过“数值应该变大还是变小”来检验。",
  ),
};

/** unitConversionsUsingBaseUnitsOfLength converts between metric or customary units of length. */
export const unitConversionsUsingBaseUnitsOfLength: TopicDef = {
  ...topic(
  "unit-conversions-using-base-units-of-length",
  t("Unit Conversions Using Base Units of Length", "以基本单位换算长度单位"),
  t(
    "Convert between units of length by going through a base unit: meters for metric units and inches for customary units.",
    "通过基本单位换算长度单位：公制单位通过米，英制单位通过英寸。",
  ),
  ["two-step-unit-conversions", "converting-metric-units-of-length-to-larger-units"],
  ["6.RP.A.3.D", "HSN.Q.A.1"],
  [
    kp(
      "metric-length",
      t("Metric units of length", "公制长度单位"),
      t(
        "Metric lengths are powers of ten times a meter: $1$ mm is $0.001$ m, $1$ cm is $0.01$ m and $1$ km is $1000$ m. Converting from kilometers to millimeters therefore multiplies by $1000$ to reach meters and then divides by $0.001$, which is the same as multiplying by $1000$ again: $1000 \\cdot 1000 = 1{,}000{,}000$. For example, $0.4$ km is $0.4 \\cdot 1000 = 400$ m, and $400 \\div 0.001 = 400{,}000$ mm.\n\n> **Watch out.** Without the meter in between it is easy to use only one of the two factors, or to apply a factor the wrong way round. Check the direction: millimeters are smaller, so there must be more of them.",
        "公制长度单位是米的十的幂倍：$1$ mm 是 $0.001$ m，$1$ cm 是 $0.01$ m，$1$ km 是 $1000$ m。所以从千米换算到毫米，先乘以 $1000$ 得到米，再除以 $0.001$，也就是再乘以 $1000$：$1000 \\cdot 1000 = 1{,}000{,}000$。例如 $0.4$ km 是 $0.4 \\cdot 1000 = 400$ m，$400 \\div 0.001 = 400{,}000$ mm。\n\n> **注意。** 不经过米这一步，就容易只用了两个系数中的一个，或者把系数用反。检查方向：毫米更小，个数一定更多。",
      ),
      (rng) => convertProblem(rng, metricLength, meter, amountFor(rng)),
    ),
    kp(
      "customary-length",
      t("Customary units of length", "英制长度单位"),
      t(
        "In customary units, $1$ foot is $12$ inches and $1$ yard is $3$ feet, so a yard is $3 \\cdot 12 = 36$ inches. Convert through inches: multiply by the inches in the old unit, then divide by the inches in the new one. For example, $8$ yd is $8 \\cdot 36 = 288$ in, and $288 \\div 12 = 24$ ft. A larger unit gives a smaller number, so feet, being smaller than yards, give more.\n\n> **Watch out.** Stopping at inches answers a different question, and dividing by the old unit's size instead of multiplying turns the factor upside down. Compare the size of the answer with the starting number before you finish.",
        "在英制单位中，$1$ 英尺等于 $12$ 英寸，$1$ 码等于 $3$ 英尺，所以 $1$ 码等于 $3 \\cdot 12 = 36$ 英寸。通过英寸换算：先乘以原单位含有的英寸数，再除以新单位含有的英寸数。例如 $8$ 码是 $8 \\cdot 36 = 288$ 英寸，$288 \\div 12 = 24$ 英尺。单位越大，数值越小；英尺比码小，所以个数更多。\n\n> **注意。** 停在英寸就答非所问了；该乘原单位的大小却去除，就是把系数颠倒了。结束之前，把答案的大小和原来的数比一比。",
      ),
      (rng) =>
        convertProblem(rng, customaryLength, { ...customaryLength[0]! }, (from, to) => {
          const ratio = to.size.div(from.size);
          return ratio.sub(Q.one).sign() > 0
            ? ratio.mul(Q.of(rng.int(1, 40), rng.pick([1, 2, 4])))
            : Q.of(rng.int(1, 60), rng.pick([1, 2, 4]));
        }),
    ),
  ],
  ),
  intro: t(
    "A length can be measured in many units, and a direct factor between two of them, like millimeters per kilometer, is easy to get wrong. Instead, measure every unit in one base unit: meters for metric lengths, inches for customary ones. To convert, multiply by the size of the old unit to get the length in base units, then divide by the size of the new unit to see how many of it fit. The base unit is a stepping stone, and each step is a single multiplication or division you can explain. A larger unit fits fewer times, so the answer should shrink when the unit grows.",
    "长度可以用许多单位来量，两个单位之间的直接系数（比如每千米多少毫米）很容易弄错。不如把每个单位都用同一个基本单位来量：公制长度用米，英制长度用英寸。换算时，先乘以原单位的大小，得到用基本单位表示的长度；再除以新单位的大小，看能容纳多少个新单位。基本单位是一块垫脚石，每一步都只是一次说得清道理的乘法或除法。单位越大，能容纳的个数越少，所以单位变大时，答案应该变小。",
  ),
};

/** unitConversionsUsingUnitsOfTime converts between seconds, minutes, hours, days and weeks. */
export const unitConversionsUsingUnitsOfTime: TopicDef = {
  ...topic(
  "unit-conversions-using-units-of-time",
  t("Unit Conversions Using Units of Time", "时间单位的换算"),
  t(
    "Convert between seconds, minutes, hours, days and weeks, through seconds, and convert rates per unit of time.",
    "通过秒在秒、分钟、小时、天和周之间换算，并换算单位时间内的比率。",
  ),
  ["two-step-unit-conversions", "converting-units-of-time-to-larger-units"],
  ["6.RP.A.3.D", "HSN.Q.A.1"],
  [
    kp(
      "converting-times",
      t("Converting between units of time", "时间单位之间的换算"),
      t(
        "Units of time are not powers of ten: $1$ minute is $60$ seconds, $1$ hour is $60 \\cdot 60 = 3600$ seconds, $1$ day is $24 \\cdot 3600 = 86{,}400$ seconds and $1$ week is $7$ days. Writing each unit in seconds turns any conversion into one multiplication and one division. For example, $3$ hours in minutes: $3 \\cdot 3600 = 10{,}800$ s, and $10{,}800 \\div 60 = 180$ min. Minutes are shorter than hours, so there are more of them.\n\n> **Watch out.** Stopping at seconds, or skipping the first step and dividing the starting number by the new unit's size, gives the wrong count; so does turning a factor upside down. Shifting the decimal point by habit does not work here, because these factors are not powers of ten.",
        "时间单位不是十的幂倍：$1$ 分钟是 $60$ 秒，$1$ 小时是 $60 \\cdot 60 = 3600$ 秒，$1$ 天是 $24 \\cdot 3600 = 86{,}400$ 秒，$1$ 周是 $7$ 天。把每个单位都写成秒，任何换算都只需要一次乘法和一次除法。例如把 $3$ 小时换算成分钟：$3 \\cdot 3600 = 10{,}800$ 秒，$10{,}800 \\div 60 = 180$ 分钟。分钟比小时短，所以个数更多。\n\n> **注意。** 停在秒，或者跳过第一步直接用原数除以新单位的大小，得到的个数都不对；把系数颠倒也不对。这里的系数不是十的幂，不能凭习惯移动小数点。",
      ),
      (rng) =>
        convertProblem(rng, times, second, (from, to) => {
          const ratio = to.size.div(from.size);
          return ratio.sub(Q.one).sign() > 0
            ? ratio.mul(Q.of(rng.int(1, 30), rng.pick([1, 2, 4])))
            : Q.of(rng.int(1, 40), rng.pick([1, 2]));
        }),
    ),
    kp(
      "converting-a-rate-per-time",
      t("Converting a rate per unit of time", "换算单位时间的比率"),
      t(
        "A rate such as liters per minute tells how much flows in one unit of time. A longer unit of time lets more flow, so the rate moves the same way as the time unit, the opposite of a plain conversion: there are $60$ minutes in an hour, so $3$ liters per minute is $3 \\cdot 60 = 180$ liters per hour. Multiply by the number of small units in the large one when going to the larger time unit, and divide when going to the smaller one.\n\n> **Watch out.** Dividing when you go to a longer time unit gives a rate that is too small; ask whether more or less water flows in the new unit of time. Multiply by the factor once, not by its square, and do not just copy the given rate.",
        "像每分钟多少升这样的比率，表示一个单位时间里流过多少。时间单位越长，流过的就越多，所以比率与时间单位同向变化，这和普通的单位换算正好相反：$1$ 小时有 $60$ 分钟，所以每分钟 $3$ 升就是每小时 $3 \\cdot 60 = 180$ 升。换算到较大的时间单位时，乘以大单位中所含小单位的个数；换算到较小的时间单位时，就除以这个数。\n\n> **注意。** 换算到更长的时间单位时如果做了除法，比率就太小了；先想一想，在新的时间单位里流过的水是更多还是更少。系数只乘一次，不要乘它的平方，也不要照抄已知的比率。",
      ),
      (rng) => {
        const [small, big, factor] = rng.pick([
          ["minute", "hour", 60],
          ["hour", "day", 24],
          ["day", "week", 7],
          ["second", "minute", 60],
        ] as const);
        const zh: Record<string, string> = { minute: "分钟", hour: "小时", day: "天", second: "秒", week: "周" };
        const r = Q.of(rng.int(1, 40), rng.pick([1, 2, 4]));
        const toBig = rng.bool();
        const given = toBig ? r : r.mul(Q.of(factor));
        const value = toBig ? r.mul(Q.of(factor)) : r;
        const [fromU, toU] = toBig ? [small, big] : [big, small];
        return numberProblem({
          prompt: t(
            `A pump moves $${dec(given)}$ liters of water per ${fromU}. How many liters does it move per ${toU}?`,
            `一台水泵每${zh[fromU]}抽水 $${dec(given)}$ 升。它每${zh[toU]}抽水多少升？`,
          ),
          answer: value,
          form: "decimal",
          wrong: [toBig ? given.div(Q.of(factor)) : given.mul(Q.of(factor)), given, given.mul(Q.of(factor * factor))].filter(
            (w) => !w.eq(value),
          ),
          solution: t(
            `**Step 1: compare the time units.** There are $${factor}$ ${small}s in ${big === "hour" ? "an" : "a"} ${big}, so one ${toU} is ${toBig ? `$${factor}$ times as long as one ${fromU}` : `$\\frac{1}{${factor}}$ of one ${fromU}`}.\n\n**Step 2: scale the rate.** In ${toBig ? "the longer" : "the shorter"} time the pump moves ${toBig ? `$${factor}$ times as much` : `$\\frac{1}{${factor}}$ as much`} water, so ${toBig ? "multiply" : "divide"} by $${factor}$:${steps(`${dec(given)} ${toBig ? "\\cdot" : "\\div"} ${factor} = ${dec(value)}`)}The pump moves $${dec(value)}$ liters per ${toU}.\n\n**Check.** ${toBig ? `A ${big} is longer than ${small === "hour" ? "an" : "a"} ${small}, so the rate per ${big} should be the larger number` : `${small === "hour" ? "An" : "A"} ${small} is shorter than ${big === "hour" ? "an" : "a"} ${big}, so the rate per ${small} should be the smaller number`}, and it is. Going back: $${dec(value)} ${toBig ? "\\div" : "\\cdot"} ${factor} = ${dec(given)}$.`,
            `**第一步：比较时间单位。** $1$ ${zh[big]}有 $${factor}$ ${zh[small]}，所以 $1$ ${zh[toU]}${toBig ? `是 $1$ ${zh[fromU]}的 $${factor}$ 倍` : `是 $1$ ${zh[fromU]}的 $\\frac{1}{${factor}}$`}。\n\n**第二步：换算比率。** 在${toBig ? "更长" : "更短"}的时间里，水泵抽的水是原来的${toBig ? ` $${factor}$ 倍` : ` $\\frac{1}{${factor}}$`}，所以${toBig ? "乘以" : "除以"} $${factor}$：${steps(`${dec(given)} ${toBig ? "\\cdot" : "\\div"} ${factor} = ${dec(value)}`)}水泵每${zh[toU]}抽水 $${dec(value)}$ 升。\n\n**检验。** ${toBig ? `${zh[big]}比${zh[small]}长，所以每${zh[big]}的比率应该是较大的数` : `${zh[small]}比${zh[big]}短，所以每${zh[small]}的比率应该是较小的数`}，确实如此。反过来算：$${dec(value)} ${toBig ? "\\div" : "\\cdot"} ${factor} = ${dec(given)}$。`,
          ),
        });
      },
    ),
  ],
  ),
  intro: t(
    "Times are measured in seconds, minutes, hours, days and weeks, and the steps between them are $60$, $60$, $24$ and $7$, not powers of ten. So the decimal-point shortcuts of metric units do not apply, and it pays to work through one base unit, the second. Multiply by the size of the old unit in seconds, then divide by the size of the new unit. Rates per unit of time behave differently: a longer stretch of time holds more of whatever flows, so liters per hour is a larger number than liters per minute. In each problem, first decide whether the number should get bigger or smaller.",
    "时间用秒、分钟、小时、天和周来量，相邻单位之间是 $60$、$60$、$24$ 和 $7$ 倍，不是十的幂，所以公制单位那种移动小数点的捷径用不上，最好通过一个基本单位“秒”来换算：先乘以原单位相当于多少秒，再除以新单位相当于多少秒。单位时间的比率则不同：时间越长，流过的量越多，所以每小时多少升比每分钟多少升的数值大。每道题都先判断数值应该变大还是变小。",
  ),
};

/** convertingUnitsOfAreaToLargerUnits converts square units to larger square units by dividing by the squared factor. */
export const convertingUnitsOfAreaToLargerUnits: TopicDef = {
  ...topic(
  "converting-units-of-area-to-larger-units",
  t("Converting Units of Area to Larger Units", "把面积单位换算成较大的单位"),
  t(
    "Convert areas to larger square units by dividing by the square of the length conversion factor.",
    "用长度换算因子的平方去除，把面积换算成较大的平方单位。",
  ),
  ["converting-units-of-area"],
  ["HSN.Q.A.1", "6.RP.A.3.D"],
  [
    kp(
      "metric-areas",
      t("Metric units of area", "公制面积单位"),
      t(
        "A square meter is $100$ cm by $100$ cm, so it holds $100$ rows of $100$ square centimeters: $1 \\text{ m}^2 = 100^2 = 10{,}000 \\text{ cm}^2$. To change square centimeters to square meters, count how many groups of $10{,}000$ there are, so divide by $10{,}000$; likewise $1 \\text{ km}^2 = 1000^2 = 1{,}000{,}000 \\text{ m}^2$. For example, $35{,}000 \\text{ cm}^2 \\div 10{,}000 = 3.5 \\text{ m}^2$.\n\n> **Watch out.** Dividing by the length factor, $100$, forgets that a square has two sides; dividing by it squared is right. Multiplying makes the number bigger, but a larger unit needs fewer of itself. Count the zeros of the squared factor carefully.",
        "$1$ 平方米是 $100$ cm 乘 $100$ cm，里面有 $100$ 行、每行 $100$ 个平方厘米：$1 \\text{ m}^2 = 100^2 = 10{,}000 \\text{ cm}^2$。把平方厘米换算成平方米，就是数一数有多少个 $10{,}000$，所以除以 $10{,}000$；同理 $1 \\text{ km}^2 = 1000^2 = 1{,}000{,}000 \\text{ m}^2$。例如 $35{,}000 \\text{ cm}^2 \\div 10{,}000 = 3.5 \\text{ m}^2$。\n\n> **注意。** 只除以长度系数 $100$，就忘了正方形有两条边；要除以它的平方。做乘法会让数值变大，但单位越大，需要的个数越少。平方后的系数要仔细数零。",
      ),
      (rng) => {
        const [from, to, f, toZh] = rng.pick([
          ["cm", "m", 100, "平方米"],
          ["mm", "cm", 10, "平方厘米"],
          ["m", "km", 1000, "平方千米"],
          ["mm", "m", 1000, "平方米"],
        ] as const);
        const amount = Q.of(rng.int(1, 99) * f * rng.pick([1, 10, 100]), rng.pick([1, 10]));
        const value = amount.div(Q.of(f * f));
        return numberProblem({
          prompt: t(
            `A region has an area of $${dec(amount)} \\text{ ${from}}^2$. What is its area in square ${{ cm: "centimeters", m: "meters", km: "kilometers", mm: "millimeters" }[to]}?`,
            `一个区域的面积为 $${dec(amount)} \\text{ ${from}}^2$。它的面积是多少${toZh}？`,
          ),
          answer: value,
          form: "decimal",
          unit: `${to}^2`,
          wrong: [amount.div(Q.of(f)), amount.mul(Q.of(f * f)), amount.div(Q.of(f * f * 10))],
          solution: t(
            `**Step 1: the size of the large square unit.** $1 \\text{ ${to}} = ${f} \\text{ ${from}}$, so a square $1$ ${to} on each side holds $${f}$ rows of $${f}$ small squares: $1 \\text{ ${to}}^2 = ${f}^2 = ${dec(Q.of(f * f))} \\text{ ${from}}^2$.\n\n**Step 2: divide.** Each large square uses $${dec(Q.of(f * f))}$ small ones, so count the groups:${steps(`${dec(amount)} \\div ${dec(Q.of(f * f))} = ${dec(value)}`)}The area is $${dec(value)} \\text{ ${to}}^2$.\n\n**Check.** The new unit is larger, so the number should get smaller, and it does. Going back: $${dec(value)} \\cdot ${dec(Q.of(f * f))} = ${dec(amount)}$.`,
            `**第一步：大平方单位有多大。** $1 \\text{ ${to}} = ${f} \\text{ ${from}}$，所以边长 $1$ ${to} 的正方形里有 $${f}$ 行、每行 $${f}$ 个小正方形：$1 \\text{ ${to}}^2 = ${f}^2 = ${dec(Q.of(f * f))} \\text{ ${from}}^2$。\n\n**第二步：相除。** 每个大正方形要用 $${dec(Q.of(f * f))}$ 个小正方形，所以数一数有多少组：${steps(`${dec(amount)} \\div ${dec(Q.of(f * f))} = ${dec(value)}`)}面积是 $${dec(value)} \\text{ ${to}}^2$。\n\n**检验。** 新单位更大，数值应该变小，确实变小了。反过来算：$${dec(value)} \\cdot ${dec(Q.of(f * f))} = ${dec(amount)}$。`,
          ),
        });
      },
    ),
    kp(
      "customary-areas",
      t("Customary units of area", "英制面积单位"),
      t(
        "Since $1$ ft $= 12$ in, a square foot holds $12$ rows of $12$ square inches, so it is $12^2 = 144$ square inches; since $1$ yd $= 3$ ft, a square yard is $3^2 = 9$ square feet, and $36^2 = 1296$ square inches. Divide by these squared factors to convert to the larger unit. For example, a floor of $180 \\text{ ft}^2$ is $180 \\div 9 = 20 \\text{ yd}^2$.\n\n> **Watch out.** Dividing by the length factor alone, such as $3$ instead of $9$, forgets that area has two dimensions, and doubling the factor is not squaring it. Multiplying gives a bigger number, which cannot be right for a larger unit.",
        "由于 $1$ ft $= 12$ in，$1$ 平方英尺里有 $12$ 行、每行 $12$ 个平方英寸，即 $12^2 = 144$ 平方英寸；由于 $1$ yd $= 3$ ft，$1$ 平方码是 $3^2 = 9$ 平方英尺，也是 $36^2 = 1296$ 平方英寸。换算成较大的单位时除以这些平方后的系数。例如 $180 \\text{ ft}^2$ 的地板是 $180 \\div 9 = 20 \\text{ yd}^2$。\n\n> **注意。** 只除以长度系数（比如除以 $3$ 而不是 $9$），就忘了面积有两个方向；把系数乘以 $2$ 也不是平方。做乘法会得到更大的数，对较大的单位来说不可能对。",
      ),
      (rng) => {
        const [from, to, f, toEn, toZh] = rng.pick([
          ["in", "ft", 12, "feet", "平方英尺"],
          ["ft", "yd", 3, "yards", "平方码"],
          ["in", "yd", 36, "yards", "平方码"],
        ] as const);
        const value = Q.of(rng.int(1, 60), rng.pick([1, 2, 4]));
        const amount = value.mul(Q.of(f * f));
        return numberProblem({
          prompt: t(
            `A floor has an area of $${dec(amount)} \\text{ ${from}}^2$. What is its area in square ${toEn}?`,
            `一块地板的面积为 $${dec(amount)} \\text{ ${from}}^2$。它的面积是多少${toZh}？`,
          ),
          answer: value,
          form: "decimal",
          unit: `${to}^2`,
          wrong: [amount.div(Q.of(f)), amount.mul(Q.of(f * f)), amount.div(Q.of(2 * f))],
          solution: t(
            `**Step 1: the size of the large square unit.** $1 \\text{ ${to}} = ${f} \\text{ ${from}}$, so a square $1$ ${to} on each side holds $${f}$ rows of $${f}$ small squares: $1 \\text{ ${to}}^2 = ${f}^2 = ${dec(Q.of(f * f))} \\text{ ${from}}^2$.\n\n**Step 2: divide.** Each large square uses $${dec(Q.of(f * f))}$ small ones, so count the groups:${steps(`${dec(amount)} \\div ${dec(Q.of(f * f))} = ${dec(value)}`)}The area is $${dec(value)} \\text{ ${to}}^2$.\n\n**Check.** Square ${toEn} are larger, so the number should get smaller, and it does. Going back: $${dec(value)} \\cdot ${dec(Q.of(f * f))} = ${dec(amount)}$.`,
            `**第一步：大平方单位有多大。** $1 \\text{ ${to}} = ${f} \\text{ ${from}}$，所以边长 $1$ ${to} 的正方形里有 $${f}$ 行、每行 $${f}$ 个小正方形：$1 \\text{ ${to}}^2 = ${f}^2 = ${dec(Q.of(f * f))} \\text{ ${from}}^2$。\n\n**第二步：相除。** 每个大正方形要用 $${dec(Q.of(f * f))}$ 个小正方形，所以数一数有多少组：${steps(`${dec(amount)} \\div ${dec(Q.of(f * f))} = ${dec(value)}`)}面积是 $${dec(value)} \\text{ ${to}}^2$。\n\n**检验。** ${toZh}更大，数值应该变小，确实变小了。反过来算：$${dec(value)} \\cdot ${dec(Q.of(f * f))} = ${dec(amount)}$。`,
          ),
        });
      },
    ),
  ],
  ),
  intro: t(
    "Area counts unit squares, and a larger square unit is made of many smaller ones. A square meter is $100$ cm on each side, so it is filled by $100$ rows of $100$ square centimeters, $10{,}000$ in all, not $100$. So whenever a length factor is $f$, the area factor is $f^2$. To change an area to a larger square unit, divide by $f^2$: you are counting how many large squares the small ones make. The answer should be a smaller number, and multiplying it back by $f^2$ should return the area you started with.",
    "面积数的是单位正方形，大的平方单位由许多小的平方单位组成。$1$ 平方米边长 $100$ cm，所以由 $100$ 行、每行 $100$ 个平方厘米铺满，一共 $10{,}000$ 个，而不是 $100$ 个。因此长度系数是 $f$ 时，面积系数就是 $f^2$。把面积换算成较大的平方单位，就除以 $f^2$：数一数这些小正方形能拼成多少个大正方形。答案应该是更小的数，再乘以 $f^2$ 应该回到原来的面积。",
  ),
};

/** convertingBetweenMixedUnitsContainingSquares converts rates per square unit and accelerations. */
export const convertingBetweenMixedUnitsContainingSquares = topic(
  "converting-between-mixed-units-containing-squares",
  t("Converting Between Mixed Units Containing Squares", "换算含平方的复合单位"),
  t(
    "Convert compound units with a squared unit, such as dollars per square foot or meters per second squared.",
    "换算含平方单位的复合单位，比如每平方英尺多少美元或米每二次方秒。",
  ),
  ["converting-units-of-area-to-larger-units", "units-of-rates-of-change"],
  ["HSN.Q.A.1"],
  [
    kp(
      "per-square-unit",
      t("Rates per square unit", "每平方单位的比率"),
      t(
        "A price per square unit grows when the unit grows: a square yard is $9$ square feet, so a cost of $\\$4$ per square foot is $\\$36$ per square yard. Multiply by the number of small square units in one large square unit.",
        "单位变大时，每平方单位的价格也变大：$1$ 平方码是 $9$ 平方英尺，所以每平方英尺 $\\$4$ 就是每平方码 $\\$36$。乘以一个大平方单位中所含小平方单位的个数。",
      ),
      (rng) => {
        const [small, big, f, smallZh, bigZh] = rng.pick([
          ["square foot", "square yard", 9, "平方英尺", "平方码"],
          ["square centimeter", "square meter", 10000, "平方厘米", "平方米"],
          ["square inch", "square foot", 144, "平方英寸", "平方英尺"],
        ] as const);
        const rate = Q.of(rng.int(1, 40), rng.pick([1, 4, 100]));
        const toBig = rng.bool();
        const given = toBig ? rate : rate.mul(Q.of(f));
        const value = toBig ? rate.mul(Q.of(f)) : rate;
        return numberProblem({
          prompt: t(
            `A material costs $\\$${dec(given)}$ per ${toBig ? small : big}. What is the cost per ${toBig ? big : small}, in dollars?`,
            `一种材料每${toBig ? smallZh : bigZh} $\\$${dec(given)}$。每${toBig ? bigZh : smallZh}多少美元？`,
          ),
          answer: value,
          form: "decimal",
          wrong: [
            toBig ? given.div(Q.of(f)) : given.mul(Q.of(f)),
            toBig ? given.mul(Q.of(Math.round(Math.sqrt(f)))) : given.div(Q.of(Math.round(Math.sqrt(f)))),
          ],
          solution: t(
            `One ${big} is $${f}$ ${small}s, so the cost is $${dec(given)} ${toBig ? "\\cdot" : "\\div"} ${f} = ${dec(value)}$ dollars per ${toBig ? big : small}.`,
            `$1$ ${bigZh}等于 $${f}$ ${smallZh}，所以费用为每${toBig ? bigZh : smallZh} $${dec(given)} ${toBig ? "\\cdot" : "\\div"} ${f} = ${dec(value)}$ 美元。`,
          ),
        });
      },
    ),
    kp(
      "accelerations",
      t("Units of acceleration", "加速度的单位"),
      t(
        "Acceleration is measured in units such as $\\text{m}/\\text{s}^2$: length divided by time squared. Convert the length and the squared time separately. Since $1 \\text{ min} = 60 \\text{ s}$, $1 \\text{ min}^2 = 3600 \\text{ s}^2$, so $2 \\text{ m}/\\text{s}^2 = 2 \\cdot 3600 = 7200 \\text{ m}/\\text{min}^2$.",
        "加速度用 $\\text{m}/\\text{s}^2$ 这样的单位表示：长度除以时间的平方。分别换算长度和时间的平方。由于 $1 \\text{ min} = 60 \\text{ s}$，$1 \\text{ min}^2 = 3600 \\text{ s}^2$，所以 $2 \\text{ m}/\\text{s}^2 = 2 \\cdot 3600 = 7200 \\text{ m}/\\text{min}^2$。",
      ),
      (rng) => {
        const a = Q.of(rng.int(1, 30), rng.pick([1, 2, 10]));
        const kind = rng.pick(["min", "cm", "km-min"] as const);
        const value = kind === "min" ? a.mul(Q.of(3600)) : kind === "cm" ? a.mul(Q.of(100)) : a.mul(Q.of(3600, 1000));
        const target = kind === "min" ? "\\text{m}/\\text{min}^2" : kind === "cm" ? "\\text{cm}/\\text{s}^2" : "\\text{km}/\\text{min}^2";
        return numberProblem({
          prompt: t(
            `An object accelerates at $${dec(a)} \\text{ m}/\\text{s}^2$. What is its acceleration in $${target}$?`,
            `一个物体的加速度为 $${dec(a)} \\text{ m}/\\text{s}^2$。用 $${target}$ 表示，它的加速度是多少？`,
          ),
          answer: value,
          form: "decimal",
          wrong: [
            kind === "cm" ? a.mul(Q.of(10000)) : a.mul(Q.of(60)),
            kind === "km-min" ? a.mul(Q.of(60, 1000)) : a.div(Q.of(100)),
            a.mul(Q.of(3600 * 1000)),
          ].filter((w) => !w.eq(value)),
          solution: t(
            kind === "cm"
              ? `$1 \\text{ m} = 100 \\text{ cm}$ and the time unit is unchanged, so multiply by $100$: $${dec(value)} \\text{ cm}/\\text{s}^2$.`
              : `$1 \\text{ min}^2 = 60^2 = 3600 \\text{ s}^2$, so multiply by $3600$${kind === "km-min" ? " and divide by $1000$ to change meters to kilometers" : ""}: $${dec(value)} ${target}$.`,
            kind === "cm"
              ? `$1 \\text{ m} = 100 \\text{ cm}$，时间单位不变，所以乘以 $100$：$${dec(value)} \\text{ cm}/\\text{s}^2$。`
              : `$1 \\text{ min}^2 = 60^2 = 3600 \\text{ s}^2$，所以乘以 $3600$${kind === "km-min" ? "，再除以 $1000$ 把米换成千米" : ""}：$${dec(value)} ${target}$。`,
          ),
        });
      },
    ),
  ],
);

/** density relates mass, volume and density. */
export const density = topic(
  "density",
  t("Density", "密度"),
  t(
    "Use density, mass per unit volume, to find the density, mass or volume of an object.",
    "利用密度（单位体积的质量）求物体的密度、质量或体积。",
  ),
  ["volumes-of-rectangular-solids", "units-in-formulas"],
  ["HSG.MG.A.2", "HSN.Q.A.1"],
  [
    kp(
      "finding-density",
      t("Finding density", "求密度"),
      t(
        "Density is mass divided by volume: $\\rho = \\frac{m}{V}$. Its unit combines the two, such as grams per cubic centimeter. For a block, find the volume first by multiplying its three dimensions, then divide the mass by it.",
        "密度等于质量除以体积：$\\rho = \\frac{m}{V}$。它的单位由两者组合而成，比如克每立方厘米。对于长方体块，先把三个尺寸相乘求出体积，再用质量除以体积。",
      ),
      (rng) => {
        const [l, w, h] = [rng.int(2, 10), rng.int(2, 10), rng.int(1, 6)];
        const rho = Q.of(rng.int(2, 120), 10);
        const V = l * w * h;
        const m = rho.mul(Q.of(V));
        return numberProblem({
          prompt: t(
            `A block measures $${l}$ cm by $${w}$ cm by $${h}$ cm and has a mass of $${dec(m)}$ grams. What is its density, in grams per cubic centimeter?`,
            `一个块体的尺寸为 $${l}$ cm 乘 $${w}$ cm 乘 $${h}$ cm，质量为 $${dec(m)}$ 克。它的密度是多少克每立方厘米？`,
          ),
          answer: rho,
          form: "decimal",
          wrong: [Q.of(V).div(m), m.div(Q.of(l * w)), m.div(Q.of(l + w + h))].filter((x) => !x.eq(rho)),
          solution: t(
            `The volume is $${l} \\cdot ${w} \\cdot ${h} = ${V} \\text{ cm}^3$, so the density is $\\frac{${dec(m)}}{${V}} = ${dec(rho)}$ grams per cubic centimeter.`,
            `体积为 $${l} \\cdot ${w} \\cdot ${h} = ${V} \\text{ cm}^3$，所以密度为 $\\frac{${dec(m)}}{${V}} = ${dec(rho)}$ 克每立方厘米。`,
          ),
        });
      },
    ),
    kp(
      "mass-or-volume-from-density",
      t("Mass or volume from density", "由密度求质量或体积"),
      t(
        "Rearranging $\\rho = \\frac{m}{V}$ gives $m = \\rho V$ and $V = \\frac{m}{\\rho}$. Check the units: kilograms per cubic meter times cubic meters gives kilograms, and dividing kilograms by kilograms per cubic meter gives cubic meters.",
        "把 $\\rho = \\frac{m}{V}$ 变形得 $m = \\rho V$，$V = \\frac{m}{\\rho}$。检查单位：千克每立方米乘以立方米得到千克，千克除以千克每立方米得到立方米。",
      ),
      (rng) => {
        const rho = rng.int(2, 30) * 50;
        const V = Q.of(rng.int(1, 40), rng.pick([1, 2, 10]));
        const m = Q.of(rho).mul(V);
        const askMass = rng.bool();
        return numberProblem({
          prompt: askMass
            ? t(
                `A liquid has a density of $${rho}$ kilograms per cubic meter. What is the mass, in kilograms, of $${dec(V)}$ cubic meters of it?`,
                `一种液体的密度为 $${rho}$ 千克每立方米。$${dec(V)}$ 立方米这种液体的质量是多少千克？`,
              )
            : t(
                `A liquid has a density of $${rho}$ kilograms per cubic meter. What volume, in cubic meters, does $${dec(m)}$ kilograms of it occupy?`,
                `一种液体的密度为 $${rho}$ 千克每立方米。$${dec(m)}$ 千克这种液体的体积是多少立方米？`,
              ),
          answer: askMass ? m : V,
          form: "decimal",
          wrong: askMass ? [Q.of(rho).div(V), V.div(Q.of(rho)), Q.of(rho)] : [m.mul(Q.of(rho)), Q.of(rho).div(m), m],
          solution: askMass
            ? t(
                `$m = \\rho V = ${rho} \\cdot ${dec(V)} = ${dec(m)}$ kilograms.`,
                `$m = \\rho V = ${rho} \\cdot ${dec(V)} = ${dec(m)}$ 千克。`,
              )
            : t(
                `$V = \\frac{m}{\\rho} = \\frac{${dec(m)}}{${rho}} = ${dec(V)}$ cubic meters.`,
                `$V = \\frac{m}{\\rho} = \\frac{${dec(m)}}{${rho}} = ${dec(V)}$ 立方米。`,
              ),
        });
      },
    ),
  ],
);

/** interpretingDescriptionsOfPhysicalPhenomena builds and uses linear models of physical situations described in words. */
export const interpretingDescriptionsOfPhysicalPhenomena = topic(
  "interpreting-descriptions-of-physical-phenomena",
  t("Interpreting Descriptions of Physical Phenomena", "解读对物理现象的描述"),
  t(
    "Turn a description of a physical situation into a linear model, and use the model to find an output or an input.",
    "把对物理情境的描述转化为线性模型，并用模型求输出或输入。",
  ),
  ["interpreting-rate-of-change-and-initial-value-in-context"],
  ["HSF.LE.A.2", "HSF.LE.B.5"],
  [
    kp(
      "using-a-described-model",
      t("Using a described model", "运用描述的模型"),
      t(
        'A description such as "a spring is $12$ cm long and stretches $3$ cm for each kilogram hung from it" gives a starting value and a constant rate of change, so the model is linear: $L = 12 + 3m$. Substitute the given input to find the output, or set the output and solve for the input.',
        "像“一根弹簧长 $12$ cm，每挂 $1$ 千克伸长 $3$ cm”这样的描述给出了初始值和固定的变化率，所以模型是线性的：$L = 12 + 3m$。代入给定的输入求输出，或者令输出为已知值再解出输入。",
      ),
      (rng) => {
        const ctx = rng.pick([
          {
            en: (a: number, r: number) =>
              `A spring is $${a}$ cm long with nothing attached and stretches $${r}$ cm for each kilogram hung from it.`,
            zh: (a: number, r: number) => `一根弹簧不挂物体时长 $${a}$ cm，每挂 $1$ 千克伸长 $${r}$ cm。`,
            out: ["length of the spring, in centimeters", "弹簧的长度（厘米）"],
            at: (n: number) => [`with $${n}$ kilograms hung from it`, `挂 $${n}$ 千克时，`],
            how: ["How many kilograms must hang from it for its length to be", "挂多少千克时，弹簧的长度等于"],
            unit: "cm",
            inp: ["kilograms", "千克"],
          },
          {
            en: (a: number, r: number) => `A candle is $${a}$ cm tall when lit and burns down $${r}$ cm each hour.`,
            zh: (a: number, r: number) => `一支蜡烛点燃时高 $${a}$ cm，每小时燃烧 $${r}$ cm。`,
            out: ["height of the candle, in centimeters", "蜡烛的高度（厘米）"],
            at: (n: number) => [`after $${n}$ hours`, `经过 $${n}$ 小时后，`],
            how: ["After how many hours is the height of the candle", "经过多少小时后，蜡烛的高度等于"],
            unit: "cm",
            inp: ["hours", "小时"],
          },
          {
            en: (a: number, r: number) => `Water in a tank is $${a}$ °C and is heated by $${r}$ °C each minute.`,
            zh: (a: number, r: number) => `水箱里的水温为 $${a}$ °C，每分钟升高 $${r}$ °C。`,
            out: ["temperature of the water, in °C", "水温（°C）"],
            at: (n: number) => [`after $${n}$ minutes`, `经过 $${n}$ 分钟后，`],
            how: ["After how many minutes is the temperature of the water", "经过多少分钟后，水温等于"],
            unit: "°C",
            inp: ["minutes", "分钟"],
          },
        ]);
        const down = ctx.inp[0] === "hours";
        const r = rng.int(1, 6);
        const n = rng.int(1, 8);
        const a = down ? r * n + rng.int(2, 20) : rng.int(5, 40);
        const out = down ? a - r * n : a + r * n;
        const askOut = rng.bool();
        return numberProblem({
          prompt: askOut
            ? t(`${ctx.en(a, r)} What is the ${ctx.out[0]}, ${ctx.at(n)[0]}?`, `${ctx.zh(a, r)}${ctx.at(n)[1]}${ctx.out[1]}是多少？`)
            : t(`${ctx.en(a, r)} ${ctx.how[0]} $${out}$ ${ctx.unit}?`, `${ctx.zh(a, r)}${ctx.how[1]} $${out}$ ${ctx.unit}？`),
          answer: askOut ? out : n,
          wrong: askOut ? [down ? a + r * n : a - r * n, r * n, a * r * n] : [Q.of(out, r), Q.of(a + out, r), n + 1],
          solution: t(
            `The model is $y = ${down ? linear(-r, a) : linear(r, a)}$, where $x$ is the number of ${ctx.inp[0]}. ${askOut ? `So $y = ${a} ${down ? "-" : "+"} ${r} \\cdot ${n} = ${out}$.` : `Setting $y = ${out}$ gives $${down ? `${a} - ${r}x` : `${a} + ${r}x`} = ${out}$, so $x = ${n}$.`}`,
            `模型为 $y = ${down ? linear(-r, a) : linear(r, a)}$，其中 $x$ 是${ctx.inp[1]}数。${askOut ? `所以 $y = ${a} ${down ? "-" : "+"} ${r} \\cdot ${n} = ${out}$。` : `令 $y = ${out}$ 得 $${down ? `${a} - ${r}x` : `${a} + ${r}x`} = ${out}$，所以 $x = ${n}$。`}`,
          ),
        });
      },
    ),
    kp(
      "matching-a-model-to-a-description",
      t("Matching a model to a description", "选出与描述相符的模型"),
      t(
        "In a linear model $y = b + mx$ of a physical process, the constant $b$ is the value at the start and $m$ is the change per unit of input. A quantity that decreases has a negative $m$. Read both from the description before comparing equations.",
        "在物理过程的线性模型 $y = b + mx$ 中，常数 $b$ 是开始时的值，$m$ 是输入每增加一个单位时的变化量。减少的量对应负的 $m$。比较方程之前，先从描述中读出这两个数。",
      ),
      (rng) => {
        const a = rng.int(20, 90);
        const r = rng.int(2, 9);
        const falling = rng.bool();
        const opt = (b: number, m: number) => t(`$h = ${linear(m, b, "t")}$`, `$h = ${linear(m, b, "t")}$`);
        const m = falling ? -r : r;
        return pickChoice(
          rng,
          t(
            falling
              ? `A balloon is $${a}$ meters above the ground and descends at a constant $${r}$ meters per second. Which equation gives its height $h$, in meters, after $t$ seconds?`
              : `A lift starts $${a}$ meters above the ground and rises at a constant $${r}$ meters per second. Which equation gives its height $h$, in meters, after $t$ seconds?`,
            falling
              ? `一个气球离地面 $${a}$ 米，以每秒 $${r}$ 米的速度匀速下降。哪个方程表示 $t$ 秒后它的高度 $h$（米）？`
              : `一部升降机从离地面 $${a}$ 米处出发，以每秒 $${r}$ 米的速度匀速上升。哪个方程表示 $t$ 秒后它的高度 $h$（米）？`,
          ),
          opt(a, m),
          [opt(a, -m), opt(r, falling ? -a : a), opt(-a, m)],
          t(
            `The height starts at $${a}$ and changes by $${m}$ each second, so $h = ${linear(m, a, "t")}$.`,
            `高度从 $${a}$ 开始，每秒变化 $${m}$，所以 $h = ${linear(m, a, "t")}$。`,
          ),
        );
      },
    ),
  ],
);

/** interpretingRatesOfChangeOfPhysicalPhenomena computes and interprets rates of change of physical quantities with units. */
export const interpretingRatesOfChangeOfPhysicalPhenomena = topic(
  "interpreting-rates-of-change-of-physical-phenomena",
  t("Interpreting Rates of Change of Physical Phenomena", "解读物理现象的变化率"),
  t(
    "Find the rate of change of a physical quantity from two measurements, with its units, and interpret what it means.",
    "由两次测量求物理量的变化率及其单位，并解释它的含义。",
  ),
  ["units-of-rates-of-change", "interpreting-descriptions-of-physical-phenomena"],
  ["HSF.IF.B.6", "HSN.Q.A.1"],
  [
    kp(
      "rate-from-two-measurements",
      t("A rate from two measurements", "由两次测量求变化率"),
      t(
        "The average rate of change between two measurements is the change in the quantity divided by the change in time, and its unit is the quantity's unit per time unit. If a tank holds $120$ L at $2$ min and $45$ L at $7$ min, the rate is $\\frac{45 - 120}{7 - 2} = -15$ liters per minute: it is draining.",
        "两次测量之间的平均变化率等于量的变化除以时间的变化，单位是量的单位每时间单位。如果水箱在第 $2$ 分钟有 $120$ L，在第 $7$ 分钟有 $45$ L，变化率为 $\\frac{45 - 120}{7 - 2} = -15$ 升每分钟：水在流出。",
      ),
      (rng) => {
        const t1 = rng.int(0, 6);
        const dt = rng.int(2, 8);
        const r = rng.nonZero(-12, 12);
        const v1 = rng.int(50, 200);
        const v2 = v1 + r * dt;
        const ctx = rng.pick([
          ["the water in a tank", "水箱中的水", "liters", "升", "minute", "分钟"],
          ["the temperature of a cooling oven", "正在冷却的烤箱的温度", "degrees", "度", "minute", "分钟"],
          ["the charge stored in a battery", "电池中储存的电量", "units", "个单位", "hour", "小时"],
        ] as const);
        return numberProblem({
          prompt: t(
            `At $t = ${t1}$ ${ctx[4]}s, ${ctx[0]} measures $${v1}$ ${ctx[2]}, and at $t = ${t1 + dt}$ ${ctx[4]}s it measures $${v2}$ ${ctx[2]}. What is the average rate of change, in ${ctx[2]} per ${ctx[4]}?`,
            `在 $t = ${t1}$ ${ctx[5]}时，${ctx[1]}为 $${v1}$ ${ctx[3]}；在 $t = ${t1 + dt}$ ${ctx[5]}时为 $${v2}$ ${ctx[3]}。平均变化率是每${ctx[5]}多少${ctx[3]}？`,
          ),
          answer: r,
          wrong: [-r, Q.of(dt, r * dt), r * dt, Q.of(v2, t1 + dt)].filter((w) => !(typeof w === "number" ? Q.of(w) : w).eq(Q.of(r))),
          solution: t(
            `Divide the change in the quantity by the change in time: $\\frac{${v2} - ${v1}}{${t1 + dt} - ${t1}} = \\frac{${r * dt}}{${dt}} = ${r}$ ${ctx[2]} per ${ctx[4]}.`,
            `用量的变化除以时间的变化：$\\frac{${v2} - ${v1}}{${t1 + dt} - ${t1}} = \\frac{${r * dt}}{${dt}} = ${r}$，即每${ctx[5]} $${r}$ ${ctx[3]}。`,
          ),
        });
      },
    ),
    kp(
      "interpreting-a-rate",
      t("Interpreting a rate", "解释变化率"),
      t(
        "In a model such as $d = 340t$ for the distance sound travels, the coefficient $340$ is a rate: each additional second adds $340$ meters. Interpret a coefficient by saying how much the output changes when the input increases by one unit, with both units named.",
        "在声音传播距离的模型 $d = 340t$ 中，系数 $340$ 是变化率：每多一秒，距离增加 $340$ 米。解释系数时，要说明输入增加一个单位时输出变化多少，并说出两者的单位。",
      ),
      (rng) => {
        const r = rng.int(2, 60);
        const b = rng.int(5, 200);
        const ctx = rng.pick([
          {
            what: ["the volume $V$, in liters, of water in a pool", "泳池中水的体积 $V$（升）"],
            inp: ["minutes", "分钟", "minute"],
            out: ["liters", "升"],
            v: "V",
          },
          {
            what: ["the distance $d$, in kilometers, a train is from its station", "火车离车站的距离 $d$（千米）"],
            inp: ["hours", "小时", "hour"],
            out: ["kilometers", "千米"],
            v: "d",
          },
          {
            what: ["the mass $M$, in grams, of crystals in a solution", "溶液中晶体的质量 $M$（克）"],
            inp: ["days", "天", "day"],
            out: ["grams", "克"],
            v: "M",
          },
        ]);
        const opt = (en: string, zh: string) => t(en, zh);
        return pickChoice(
          rng,
          t(
            `The equation $${ctx.v} = ${b} + ${r}t$ models ${ctx.what[0]} after $t$ ${ctx.inp[0]}. What does $${r}$ represent?`,
            `方程 $${ctx.v} = ${b} + ${r}t$ 表示 $t$ ${ctx.inp[1]}后${ctx.what[1]}。$${r}$ 表示什么？`,
          ),
          opt(`The increase in ${ctx.out[0]} each ${ctx.inp[2]}`, `每${ctx.inp[1]}增加的${ctx.out[1]}数`),
          [
            opt(`The number of ${ctx.out[0]} at the start`, `开始时的${ctx.out[1]}数`),
            opt(`The number of ${ctx.inp[0]} needed to reach ${b} ${ctx.out[0]}`, `达到 ${b} ${ctx.out[1]}所需的${ctx.inp[1]}数`),
            opt(`The total ${ctx.out[0]} after one ${ctx.inp[2]}`, `一${ctx.inp[1]}后的总${ctx.out[1]}数`),
          ],
          t(
            `$${r}$ multiplies $t$, so each additional ${ctx.inp[2]} adds $${r}$ ${ctx.out[0]}; the constant $${b}$ is the value at the start, and after one ${ctx.inp[2]} the total is $${b + r}$.`,
            `$${r}$ 是 $t$ 的系数，所以每多一${ctx.inp[1]}增加 $${r}$ ${ctx.out[1]}；常数 $${b}$ 是开始时的值，一${ctx.inp[1]}后总量是 $${b + r}$。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Statistics

/** combiningMeans finds the mean of combined groups from the groups' sizes and means. */
export const combiningMeans = topic(
  "combining-means",
  t("Combining Means", "合并平均数"),
  t(
    "Find the mean of two combined groups from their sizes and means, and find one group's mean from the combined mean.",
    "由两组的人数和平均数求合并后的平均数，并由合并后的平均数求其中一组的平均数。",
  ),
  ["mean-of-a-data-set"],
  ["6.SP.B.5.C", "HSS.ID.A.2"],
  [
    kp(
      "the-combined-mean",
      t("The combined mean", "合并后的平均数"),
      t(
        "The mean of a combined group is not the average of the two means unless the groups are the same size. Multiply each mean by its group size to get each total, add the totals, and divide by the total number of values: $\\frac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1 + n_2}$.",
        "合并后的平均数一般不是两个平均数的平均，除非两组人数相同。把每组的平均数乘以人数得到各组总和，把总和相加，再除以总个数：$\\frac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1 + n_2}$。",
      ),
      (rng) => {
        const n1 = rng.int(5, 30);
        const n2 = rng.int(5, 30);
        const m1 = rng.int(60, 95);
        const m2 = rng.int(60, 95);
        const value = Q.of(n1 * m1 + n2 * m2, n1 + n2);
        if (!value.isInteger() && rng.bool(0.7)) return combiningMeans.knowledgePoints[0]!.generate(rng);
        return numberProblem({
          prompt: t(
            `A class of $${n1}$ students has a mean test score of $${m1}$, and another class of $${n2}$ students has a mean score of $${m2}$. What is the mean score of all $${n1 + n2}$ students?`,
            `一个班 $${n1}$ 名学生的测验平均分为 $${m1}$，另一个班 $${n2}$ 名学生的平均分为 $${m2}$。全部 $${n1 + n2}$ 名学生的平均分是多少？`,
          ),
          answer: value,
          wrong: [Q.of(m1 + m2, 2), Q.of(n1 * m1 + n2 * m2), Q.of(n2 * m1 + n1 * m2, n1 + n2)].filter((w) => !w.eq(value)),
          solution: t(
            `The totals are $${n1} \\cdot ${m1} = ${n1 * m1}$ and $${n2} \\cdot ${m2} = ${n2 * m2}$, so the mean is $\\frac{${n1 * m1} + ${n2 * m2}}{${n1 + n2}} = ${value.toLatex()}$.`,
            `两组总分分别为 $${n1} \\cdot ${m1} = ${n1 * m1}$ 和 $${n2} \\cdot ${m2} = ${n2 * m2}$，所以平均分为 $\\frac{${n1 * m1} + ${n2 * m2}}{${n1 + n2}} = ${value.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "a-group-mean-from-the-combined-mean",
      t("A group's mean from the combined mean", "由合并平均数求一组的平均数"),
      t(
        "Work with totals. The combined total is the combined mean times the number of values; subtract the known group's total to get the other group's total, then divide by that group's size.",
        "用总和来计算。合并后的总和等于合并平均数乘以总个数；减去已知组的总和，得到另一组的总和，再除以那一组的个数。",
      ),
      (rng) => {
        const n1 = rng.int(4, 20);
        const n2 = rng.int(4, 20);
        const m1 = rng.int(10, 60);
        const m2 = rng.int(10, 60);
        const total = n1 * m1 + n2 * m2;
        if (m1 === m2 || total % (n1 + n2) !== 0) return combiningMeans.knowledgePoints[1]!.generate(rng);
        const m = total / (n1 + n2);
        return numberProblem({
          prompt: t(
            `The mean weight of $${n1 + n2}$ packages is $${m}$ kg. The mean weight of $${n1}$ of them is $${m1}$ kg. What is the mean weight of the other $${n2}$ packages, in kilograms?`,
            `$${n1 + n2}$ 个包裹的平均重量为 $${m}$ kg，其中 $${n1}$ 个的平均重量为 $${m1}$ kg。其余 $${n2}$ 个包裹的平均重量是多少千克？`,
          ),
          answer: m2,
          wrong: [2 * m - m1, Q.of(total - n1 * m1, n1 + n2), Q.of(total - m1, n2)].filter(
            (w) => !Q.of(m2).eq(typeof w === "number" ? Q.of(w) : w),
          ),
          solution: t(
            `All the packages weigh $${n1 + n2} \\cdot ${m} = ${total}$ kg and the $${n1}$ weigh $${n1} \\cdot ${m1} = ${n1 * m1}$ kg. The other $${n2}$ weigh $${total - n1 * m1}$ kg, so their mean is $\\frac{${total - n1 * m1}}{${n2}} = ${m2}$ kg.`,
            `所有包裹共重 $${n1 + n2} \\cdot ${m} = ${total}$ kg，那 $${n1}$ 个共重 $${n1} \\cdot ${m1} = ${n1 * m1}$ kg。其余 $${n2}$ 个共重 $${total - n1 * m1}$ kg，所以它们的平均重量为 $\\frac{${total - n1 * m1}}{${n2}} = ${m2}$ kg。`,
          ),
        });
      },
    ),
  ],
);

/** determiningUnknownObservationsGivenStatisticalMetrics finds a missing value from a mean or a change in the mean. */
export const determiningUnknownObservationsGivenStatisticalMetrics = topic(
  "determining-unknown-observations-given-statistical-metrics",
  t("Determining Unknown Observations Given Statistical Metrics", "由统计量确定未知观测值"),
  t(
    "Find a missing data value from the mean of the data, or from how the mean changes when the value is added.",
    "由数据的平均数，或者由加入一个值后平均数的变化，求出缺失的数据值。",
  ),
  ["mean-of-a-data-set", "the-median-of-a-data-set"],
  ["6.SP.B.5.C"],
  [
    kp(
      "a-missing-value-from-the-mean",
      t("A missing value from the mean", "由平均数求缺失值"),
      t(
        "If $n$ values have mean $\\bar{x}$, their sum is $n\\bar{x}$. So a missing value is the required sum minus the sum of the known values. With a mean of $8$ for the five values $6, 9, 7, 10$ and $x$, the sum must be $40$, so $x = 40 - 32 = 8$.",
        "如果 $n$ 个值的平均数为 $\\bar{x}$，它们的和就是 $n\\bar{x}$。所以缺失的值等于应有的和减去已知值的和。五个值 $6, 9, 7, 10$ 和 $x$ 的平均数为 $8$ 时，和必须是 $40$，所以 $x = 40 - 32 = 8$。",
      ),
      (rng) => {
        const n = rng.int(4, 7);
        const known = Array.from({ length: n - 1 }, () => rng.int(1, 30));
        const x = rng.int(1, 40);
        const sum = known.reduce((a, b) => a + b, 0) + x;
        if (sum % n !== 0) return determiningUnknownObservationsGivenStatisticalMetrics.knowledgePoints[0]!.generate(rng);
        const m = sum / n;
        return numberProblem({
          prompt: t(
            `The mean of the data set $${list(known)}, x$ is $${m}$. What is $x$?`,
            `数据组 $${list(known)}, x$ 的平均数为 $${m}$。$x$ 是多少？`,
          ),
          answer: x,
          wrong: [m * (n - 1) - (sum - x), m, sum - x - m].filter((w) => w !== x),
          solution: t(
            `The ${n} values must add up to $${n} \\cdot ${m} = ${sum}$. The known values add up to $${sum - x}$, so $x = ${sum} - ${sum - x} = ${x}$.`,
            `这 ${n} 个值的和必须是 $${n} \\cdot ${m} = ${sum}$。已知值的和为 $${sum - x}$，所以 $x = ${sum} - ${sum - x} = ${x}$。`,
          ),
        });
      },
    ),
    kp(
      "a-value-from-a-change-in-mean",
      t("A value from a change in the mean", "由平均数的变化求值"),
      t(
        "When a value is added to a data set, compare totals before and after. If $n$ values have mean $a$ and the $n + 1$ values have mean $b$, the new value is $(n + 1)b - na$. Adding a value above the mean raises the mean, and one below lowers it.",
        "向数据组中加入一个值时，比较加入前后的总和。如果 $n$ 个值的平均数为 $a$，加入后 $n + 1$ 个值的平均数为 $b$，新值就是 $(n + 1)b - na$。加入高于平均数的值会使平均数升高，低于平均数的值会使它降低。",
      ),
      (rng) => {
        const n = rng.int(3, 15);
        const a = rng.int(50, 90);
        const d = rng.nonZero(-4, 4);
        const b = a + d;
        const value = (n + 1) * b - n * a;
        if (value <= 0) return determiningUnknownObservationsGivenStatisticalMetrics.knowledgePoints[1]!.generate(rng);
        return numberProblem({
          prompt: t(
            `A player's mean score over $${n}$ games is $${a}$ points. After one more game, the mean over all $${n + 1}$ games is $${b}$ points. How many points did the player score in that game?`,
            `一名选手 $${n}$ 场比赛的平均得分为 $${a}$ 分。再打一场后，全部 $${n + 1}$ 场的平均得分为 $${b}$ 分。这名选手在那场比赛中得了多少分？`,
          ),
          answer: value,
          wrong: [b + d, b, 2 * b - a, n * b - (n - 1) * a].filter((w) => w !== value),
          solution: t(
            `The total was $${n} \\cdot ${a} = ${n * a}$ and becomes $${n + 1} \\cdot ${b} = ${(n + 1) * b}$, so the new score is $${(n + 1) * b} - ${n * a} = ${value}$.`,
            `原来的总分为 $${n} \\cdot ${a} = ${n * a}$，之后变为 $${n + 1} \\cdot ${b} = ${(n + 1) * b}$，所以新的得分为 $${(n + 1) * b} - ${n * a} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** boundingStatisticsForGroupedData bounds the mean and locates the median of data grouped into intervals. */
export const boundingStatisticsForGroupedData = topic(
  "bounding-statistics-for-grouped-data",
  t("Bounding Statistics for Grouped Data", "估计分组数据统计量的范围"),
  t(
    "From a frequency table of intervals, find the least and greatest possible mean and the interval that contains the median.",
    "由区间的频数表，求平均数可能的最小值和最大值，以及中位数所在的区间。",
  ),
  ["calculating-means-from-frequency-tables", "calculating-medians-from-frequency-tables"],
  ["6.SP.B.5", "HSS.ID.A.2"],
  [
    kp(
      "bounds-on-the-mean",
      t("Bounds on the mean", "平均数的范围"),
      t(
        "When data are grouped into intervals, the exact values are unknown, but each value lies in its interval. The least possible mean puts every value at the lower end of its interval and the greatest puts every value at the upper end; the true mean lies between them.",
        "当数据分组成区间时，确切的值是未知的，但每个值都在它所在的区间里。把每个值都放在区间的下端得到平均数可能的最小值，都放在上端得到可能的最大值；真实的平均数在两者之间。",
      ),
      (rng) => {
        const w = rng.pick([5, 10]);
        const start = rng.int(0, 5) * w;
        const freqs = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
        const lows = [0, 1, 2].map((i) => start + i * w);
        const highs = lows.map((l) => l + w - 1);
        const n = freqs[0]! + freqs[1]! + freqs[2]!;
        const max = rng.bool();
        const ends = max ? highs : lows;
        const value = Q.of(
          ends.reduce((s, e, i) => s + e * freqs[i]!, 0),
          n,
        );
        const other = Q.of(
          (max ? lows : highs).reduce((s, e, i) => s + e * freqs[i]!, 0),
          n,
        );
        const rows = lows.map((l, i) => `${l}\\text{–}${highs[i]}: ${freqs[i]}`).join(",\\ ");
        return numberProblem({
          prompt: t(
            `The whole-number ages of the members of a club are grouped as follows (age range: number of members): $${rows}$. What is the ${max ? "greatest" : "least"} possible mean age?`,
            `一个俱乐部成员的年龄（整数）分组如下（年龄范围：人数）：$${rows}$。平均年龄最${max ? "大" : "小"}可能是多少？`,
          ),
          answer: value,
          wrong: [
            other,
            Q.of(
              ends.reduce((s, e) => s + e, 0),
              3,
            ),
            Q.of(
              ends.reduce((s, e, i) => s + e * freqs[i]!, 0),
              3,
            ),
          ].filter((x) => !x.eq(value)),
          solution: t(
            `Put every member at the ${max ? "top" : "bottom"} of their range:${steps(`\\frac{${ends.map((e, i) => `${freqs[i]} \\cdot ${e}`).join(" + ")}}{${n}} = ${value.toLatex()}`)}`,
            `把每个成员都放在其范围的${max ? "上端" : "下端"}：${steps(`\\frac{${ends.map((e, i) => `${freqs[i]} \\cdot ${e}`).join(" + ")}}{${n}} = ${value.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "the-interval-of-the-median",
      t("The interval containing the median", "中位数所在的区间"),
      t(
        "The median of $n$ ordered values is the middle one, in position $\\frac{n + 1}{2}$ (or the average of the two middle ones when $n$ is even). Add up the frequencies from the lowest interval until the running total reaches that position: that interval contains the median.",
        "$n$ 个有序值的中位数是正中间的那个，位于第 $\\frac{n + 1}{2}$ 个（$n$ 为偶数时是中间两个的平均）。从最低的区间开始累加频数，直到累计总数达到这个位置：那个区间就包含中位数。",
      ),
      (rng) => {
        const w = rng.pick([10, 20]);
        let freqs: number[];
        let n = 0;
        do {
          freqs = [rng.int(1, 12), rng.int(1, 12), rng.int(1, 12), rng.int(1, 12)];
          n = freqs.reduce((a, b) => a + b, 0);
        } while (n % 2 === 0);
        const pos = (n + 1) / 2;
        let run = 0;
        let idx = 0;
        for (let i = 0; i < 4; i++) {
          run += freqs[i]!;
          if (run >= pos) {
            idx = i;
            break;
          }
        }
        const label = (i: number) => `${i * w}\\text{–}${(i + 1) * w - 1}`;
        const opt = (i: number) => t(`$${label(i)}$`, `$${label(i)}$`);
        return pickChoice(
          rng,
          t(
            `The minutes that $${n}$ students spent reading are grouped as (minutes: students) $${[0, 1, 2, 3].map((i) => `${label(i)}: ${freqs[i]}`).join(",\\ ")}$. Which interval contains the median?`,
            `$${n}$ 名学生的阅读时间分组为（分钟：人数）$${[0, 1, 2, 3].map((i) => `${label(i)}: ${freqs[i]}`).join(",\\ ")}$。中位数在哪个区间？`,
          ),
          opt(idx),
          [0, 1, 2, 3].filter((i) => i !== idx).map(opt),
          t(
            `The median is value number $\\frac{${n} + 1}{2} = ${pos}$. The running totals are ${freqs.map((_, i) => `$${freqs.slice(0, i + 1).reduce((a, b) => a + b, 0)}$`).join(", ")}, which first reach $${pos}$ in the interval $${label(idx)}$.`,
            `中位数是第 $\\frac{${n} + 1}{2} = ${pos}$ 个值。累计频数依次为 ${freqs.map((_, i) => `$${freqs.slice(0, i + 1).reduce((a, b) => a + b, 0)}$`).join("、")}，在区间 $${label(idx)}$ 中首次达到 $${pos}$。`,
          ),
        );
      },
    ),
  ],
);

/** effectsOfDataChangeOnTheMean finds the new mean after a value is changed or removed. */
export const effectsOfDataChangeOnTheMean = topic(
  "effects-of-data-change-on-the-mean",
  t("Effects of Data Change on the Mean", "数据变化对平均数的影响"),
  t(
    "Find how the mean changes when one value is corrected or removed, by working with the total.",
    "利用总和，求更正或删除一个值后平均数的变化。",
  ),
  ["determining-unknown-observations-given-statistical-metrics"],
  ["6.SP.B.5.C", "HSS.ID.A.3"],
  [
    kp(
      "correcting-a-value",
      t("Correcting a value", "更正一个值"),
      t(
        "Changing one of $n$ values by $d$ changes the total by $d$, so the mean changes by $\\frac{d}{n}$. If one of $20$ scores is raised by $10$ points, the mean rises by $\\frac{10}{20} = 0.5$ point.",
        "把 $n$ 个值中的一个改变 $d$，总和就改变 $d$，所以平均数改变 $\\frac{d}{n}$。如果 $20$ 个分数中的一个提高 $10$ 分，平均数就提高 $\\frac{10}{20} = 0.5$ 分。",
      ),
      (rng) => {
        const n = rng.pick([4, 5, 8, 10, 20, 25, 40, 50]);
        const m = rng.int(40, 90);
        const wrongV = rng.int(10, 99);
        const d = rng.nonZero(-30, 30);
        const right = wrongV + d;
        if (right <= 0) return effectsOfDataChangeOnTheMean.knowledgePoints[0]!.generate(rng);
        const value = Q.of(m).add(Q.of(d, n));
        return numberProblem({
          prompt: t(
            `The mean of $${n}$ measurements was calculated as $${m}$. Then one measurement recorded as $${wrongV}$ was found to be $${right}$. What is the correct mean?`,
            `$${n}$ 个测量值的平均数算得为 $${m}$。后来发现其中一个记为 $${wrongV}$ 的测量值应为 $${right}$。正确的平均数是多少？`,
          ),
          answer: value,
          form: "decimal",
          wrong: [Q.of(m + d), Q.of(m).sub(Q.of(d, n)), Q.of(m * n + d, n - 1)].filter((w) => !w.eq(value)),
          solution: t(
            `The total changes by $${right} - ${wrongV} = ${d}$, so the mean changes by $\\frac{${d}}{${n}}$: $${m} ${d < 0 ? "-" : "+"} ${dec(Q.of(Math.abs(d), n))} = ${dec(value)}$.`,
            `总和改变 $${right} - ${wrongV} = ${d}$，所以平均数改变 $\\frac{${d}}{${n}}$：$${m} ${d < 0 ? "-" : "+"} ${dec(Q.of(Math.abs(d), n))} = ${dec(value)}$。`,
          ),
        });
      },
    ),
    kp(
      "removing-a-value",
      t("Removing a value", "删除一个值"),
      t(
        "To remove a value, subtract it from the total and divide by one fewer value. If $n$ values have mean $\\bar{x}$ and the value $v$ is removed, the new mean is $\\frac{n\\bar{x} - v}{n - 1}$. Removing a value above the mean lowers the mean.",
        "删除一个值时，从总和中减去它，再除以少一个的个数。如果 $n$ 个值的平均数为 $\\bar{x}$，删除值 $v$ 后，新的平均数为 $\\frac{n\\bar{x} - v}{n - 1}$。删除一个高于平均数的值会使平均数降低。",
      ),
      (rng) => {
        const n = rng.int(5, 16);
        const m2 = rng.int(20, 80);
        const v = rng.int(1, 150);
        const total = (n - 1) * m2 + v;
        if (total % n !== 0) return effectsOfDataChangeOnTheMean.knowledgePoints[1]!.generate(rng);
        const m = total / n;
        return numberProblem({
          prompt: t(
            `The mean of $${n}$ numbers is $${m}$. When the number $${v}$ is removed, what is the mean of the remaining numbers?`,
            `$${n}$ 个数的平均数为 $${m}$。去掉数 $${v}$ 后，剩下各数的平均数是多少？`,
          ),
          answer: m2,
          wrong: [Q.of(total - v, n), Q.of(total, n - 1), Q.of(m - v, n - 1)].filter((w) => !w.eq(Q.of(m2))),
          solution: t(
            `The total is $${n} \\cdot ${m} = ${total}$. Removing $${v}$ leaves $${total - v}$ for $${n - 1}$ numbers, so the mean is $\\frac{${total - v}}{${n - 1}} = ${m2}$.`,
            `总和为 $${n} \\cdot ${m} = ${total}$。去掉 $${v}$ 后剩下 $${total - v}$，共 $${n - 1}$ 个数，所以平均数为 $\\frac{${total - v}}{${n - 1}} = ${m2}$。`,
          ),
        });
      },
    ),
  ],
);

/** comparingEffectsOfDataChangeOnMeasuresOfCentrality compares how the mean and median respond to a change. */
export const comparingEffectsOfDataChangeOnMeasuresOfCentrality = topic(
  "comparing-effects-of-data-change-on-measures-of-centrality",
  t("Comparing Effects of Data Change on Measures of Centrality", "比较数据变化对集中趋势量的影响"),
  t(
    "Decide whether changing or adding a value changes the mean, the median, both or neither.",
    "判断改变或加入一个值后，平均数、中位数是否改变。",
  ),
  ["effects-of-data-change-on-the-mean", "comparing-measures-of-center"],
  ["6.SP.B.5.D", "HSS.ID.A.3"],
  [
    kp(
      "changing-an-extreme-value",
      t("Changing an extreme value", "改变一个极端值"),
      t(
        "The mean uses every value, so changing any value changes it. The median depends only on the middle position, so making the largest value even larger, or the smallest even smaller, leaves the median unchanged. Changing a middle value can change both.",
        "平均数用到每一个值，所以改变任何一个值都会改变它。中位数只取决于中间位置的值，所以把最大值变得更大，或把最小值变得更小，中位数不变。改变中间的值可能同时改变两者。",
      ),
      (rng) => {
        const n = rng.pick([5, 7, 9]);
        const xs = rng
          .sample(
            Array.from({ length: 40 }, (_, i) => i + 1),
            n,
          )
          .sort((a, b) => a - b);
        const which = rng.pick(["max", "min", "middle"] as const);
        const ys = [...xs];
        const mid = (n - 1) / 2;
        if (which === "max") ys[n - 1] = xs[n - 1]! + rng.int(5, 30);
        else if (which === "min") ys[0] = xs[0]! - rng.int(1, xs[0]!);
        else ys[mid] = xs[mid]! + Math.max(1, Math.floor((xs[mid + 1]! - xs[mid]!) / 2));
        if (ys[mid] === xs[mid] && which === "middle")
          return comparingEffectsOfDataChangeOnMeasuresOfCentrality.knowledgePoints[0]!.generate(rng);
        const meanChanges = !mean(xs).eq(mean(ys));
        const medianChanges = !median(xs).eq(median(ys));
        const label = (a: boolean, b: boolean) =>
          a && b
            ? t("Both the mean and the median change", "平均数和中位数都改变")
            : a
              ? t("Only the mean changes", "只有平均数改变")
              : b
                ? t("Only the median changes", "只有中位数改变")
                : t("Neither changes", "两者都不变");
        const from = which === "max" ? xs[n - 1] : which === "min" ? xs[0] : xs[mid];
        const to = which === "max" ? ys[n - 1] : which === "min" ? ys[0] : ys[mid];
        const all: [boolean, boolean][] = [
          [true, true],
          [true, false],
          [false, true],
          [false, false],
        ];
        return pickChoice(
          rng,
          t(
            `In the data set $${list(xs)}$, the value $${from}$ is changed to $${to}$. Which statement is true?`,
            `在数据组 $${list(xs)}$ 中，把值 $${from}$ 改为 $${to}$。下列哪个说法正确？`,
          ),
          label(meanChanges, medianChanges),
          all.filter(([a, b]) => a !== meanChanges || b !== medianChanges).map(([a, b]) => label(a, b)),
          t(
            `The total changes, so the mean changes. The median was $${median(xs).toLatex()}$ and is now $${median(ys).toLatex()}$, so it ${medianChanges ? "changes too" : "stays the same"}.`,
            `总和改变了，所以平均数改变。中位数原来是 $${median(xs).toLatex()}$，现在是 $${median(ys).toLatex()}$，所以它${medianChanges ? "也改变了" : "保持不变"}。`,
          ),
        );
      },
    ),
    kp(
      "adding-a-value",
      t("Adding a value", "加入一个值"),
      t(
        "Adding a value equal to the mean leaves the mean unchanged; a larger value raises it and a smaller one lowers it. The median of an odd number of values moves to the average of two middle values, which may or may not equal the old median, so compute it to be sure.",
        "加入一个等于平均数的值，平均数不变；加入更大的值会使它升高，更小的值会使它降低。奇数个值加入一个后，中位数变为中间两个值的平均，它可能等于也可能不等于原来的中位数，所以要计算才能确定。",
      ),
      (rng) => {
        const n = rng.pick([5, 7]);
        const xs = rng
          .sample(
            Array.from({ length: 30 }, (_, i) => i + 1),
            n,
          )
          .sort((a, b) => a - b);
        const m = mean(xs);
        const choice = rng.pick(["mean", "above", "below"] as const);
        const v =
          choice === "mean" && m.isInteger()
            ? Number(m.n)
            : choice === "below"
              ? rng.int(1, Math.max(1, Math.floor(Number(m.n) / Number(m.d)) - 1))
              : Math.ceil(Number(m.n) / Number(m.d)) + rng.int(1, 15);
        const m2 = mean([...xs, v]);
        const d = m2.sub(m).sign();
        const label = (s: number) =>
          t(
            s > 0 ? "The mean increases" : s < 0 ? "The mean decreases" : "The mean stays the same",
            s > 0 ? "平均数增大" : s < 0 ? "平均数减小" : "平均数不变",
          );
        return pickChoice(
          rng,
          t(
            `The value $${v}$ is added to the data set $${list(xs)}$. What happens to the mean?`,
            `把值 $${v}$ 加入数据组 $${list(xs)}$。平均数会怎样变化？`,
          ),
          label(d),
          [1, -1, 0].filter((s) => s !== d).map(label),
          t(
            `The mean was $${m.toLatex()}$. The new value is ${d > 0 ? "greater than" : d < 0 ? "less than" : "equal to"} it, so the new mean, $${m2.toLatex()}$, ${d > 0 ? "is larger" : d < 0 ? "is smaller" : "is the same"}.`,
            `原来的平均数是 $${m.toLatex()}$。新值${d > 0 ? "大于" : d < 0 ? "小于" : "等于"}它，所以新的平均数 $${m2.toLatex()}$ ${d > 0 ? "更大" : d < 0 ? "更小" : "不变"}。`,
          ),
        );
      },
    ),
  ],
);

/** statisticalEffectsOfDataTransformations finds the mean and standard deviation after every value is transformed linearly. */
export const statisticalEffectsOfDataTransformations = topic(
  "statistical-effects-of-data-transformations",
  t("Statistical Effects of Data Transformations", "数据变换的统计效果"),
  t(
    "Find the new mean, median and standard deviation when every value is multiplied by a constant or has a constant added.",
    "当每个值都乘以一个常数或加上一个常数时，求新的平均数、中位数和标准差。",
  ),
  ["comparing-data-sets-using-standard-deviation-and-mad"],
  ["HSS.ID.A.2", "HSS.ID.A.3"],
  [
    kp(
      "centers-under-a-transformation",
      t("Centers under a transformation", "变换后的中心"),
      t(
        "If every value $x$ becomes $ax + b$, every measure of center does the same: the new mean is $a\\bar{x} + b$ and the new median is $a$ times the old median plus $b$. Converting temperatures with $F = 1.8C + 32$ converts the mean temperature the same way.",
        "如果每个值 $x$ 都变成 $ax + b$，每个集中趋势量也同样变化：新的平均数为 $a\\bar{x} + b$，新的中位数为原中位数的 $a$ 倍再加 $b$。用 $F = 1.8C + 32$ 换算温度时，平均温度也按同样的方式换算。",
      ),
      (rng) => {
        const a = rng.int(2, 6);
        const b = rng.nonZero(-20, 20);
        const m = rng.int(5, 60);
        const which = rng.pick([
          ["mean", "平均数"],
          ["median", "中位数"],
        ] as const);
        const value = a * m + b;
        return numberProblem({
          prompt: t(
            `A data set has a ${which[0]} of $${m}$. Each value is multiplied by $${a}$ and then ${b > 0 ? `increased by $${b}$` : `decreased by $${-b}$`}. What is the ${which[0]} of the new data set?`,
            `一组数据的${which[1]}为 $${m}$。把每个值乘以 $${a}$，再${b > 0 ? `加上 $${b}$` : `减去 $${-b}$`}。新数据的${which[1]}是多少？`,
          ),
          answer: value,
          wrong: [a * (m + b), m + b, a * m],
          solution: t(
            `The ${which[0]} is transformed like each value: $${a} \\cdot ${m} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${value}$.`,
            `${which[1]}与每个值作同样的变换：$${a} \\cdot ${m} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${value}$。`,
          ),
        });
      },
    ),
    kp(
      "spread-under-a-transformation",
      t("Spread under a transformation", "变换后的离散程度"),
      t(
        "Adding a constant to every value shifts the data without spreading it, so the standard deviation and range do not change. Multiplying every value by $a$ multiplies every distance between values by $|a|$, so the standard deviation becomes $|a|$ times as large.",
        "每个值都加上一个常数只会平移数据，不会改变分散程度，所以标准差和极差不变。每个值都乘以 $a$ 会把值之间的每个距离乘以 $|a|$，所以标准差变为原来的 $|a|$ 倍。",
      ),
      (rng) => {
        const a = rng.int(2, 6);
        const b = rng.nonZero(-20, 20);
        const s = Q.of(rng.int(2, 60), rng.pick([1, 10]));
        const kind = rng.pick(["both", "add", "multiply"] as const);
        const value = kind === "add" ? s : s.mul(Q.of(a));
        const desc =
          kind === "add"
            ? [`${b > 0 ? `increased by $${b}$` : `decreased by $${-b}$`}`, `${b > 0 ? `加上 $${b}$` : `减去 $${-b}$`}`]
            : kind === "multiply"
              ? [`multiplied by $${a}$`, `乘以 $${a}$`]
              : [
                  `multiplied by $${a}$ and then ${b > 0 ? `increased by $${b}$` : `decreased by $${-b}$`}`,
                  `乘以 $${a}$，再${b > 0 ? `加上 $${b}$` : `减去 $${-b}$`}`,
                ];
        return numberProblem({
          prompt: t(
            `A data set has a standard deviation of $${dec(s)}$. Each value is ${desc[0]}. What is the standard deviation of the new data set?`,
            `一组数据的标准差为 $${dec(s)}$。把每个值都${desc[1]}。新数据的标准差是多少？`,
          ),
          answer: value,
          form: "decimal",
          wrong: [s.mul(Q.of(a)).add(Q.of(b)), s.add(Q.of(b)), s.mul(Q.of(a * a)), s].filter((w) => !w.eq(value) && w.sign() > 0),
          solution: t(
            kind === "add"
              ? `Adding a constant does not change the spread, so the standard deviation stays $${dec(s)}$.`
              : `Multiplying by $${a}$ multiplies the standard deviation by $${a}$${kind === "both" ? ", and adding a constant does not change it" : ""}: $${a} \\cdot ${dec(s)} = ${dec(value)}$.`,
            kind === "add"
              ? `加上一个常数不改变离散程度，所以标准差仍为 $${dec(s)}$。`
              : `乘以 $${a}$ 使标准差乘以 $${a}$${kind === "both" ? "，加上常数不改变它" : ""}：$${a} \\cdot ${dec(s)} = ${dec(value)}$。`,
          ),
        });
      },
    ),
  ],
);

/** comparingDataPointsToLinesOfBestFit compares observed values with the values a line of best fit predicts. */
export const comparingDataPointsToLinesOfBestFit = topic(
  "comparing-data-points-to-lines-of-best-fit",
  t("Comparing Data Points to Lines of Best Fit", "比较数据点与最佳拟合直线"),
  t(
    "Compare an observed data point with the value predicted by a line of best fit: whether it lies above or below the line, and by how much.",
    "比较观测数据点与最佳拟合直线的预测值：它在直线上方还是下方，以及相差多少。",
  ),
  ["predictions-with-trend-lines"],
  ["HSS.ID.B.6.B", "8.SP.A.3"],
  [
    kp(
      "observed-minus-predicted",
      t("Observed minus predicted", "观测值减预测值"),
      t(
        "The line of best fit predicts $\\hat{y} = mx + b$ at each $x$. The difference between the observed value and the prediction, $y - \\hat{y}$, is the residual: positive when the point lies above the line and negative when it lies below.",
        "最佳拟合直线在每个 $x$ 处给出预测值 $\\hat{y} = mx + b$。观测值与预测值之差 $y - \\hat{y}$ 叫作残差：点在直线上方时为正，在下方时为负。",
      ),
      (rng) => {
        const m = Q.of(rng.nonZero(-30, 30), rng.pick([1, 2, 10]));
        const b = rng.int(-20, 80);
        const x = rng.int(1, 20);
        const yhat = m.mul(Q.of(x)).add(Q.of(b));
        const r = Q.of(rng.nonZero(-40, 40), rng.pick([1, 2, 10]));
        const y = yhat.add(r);
        return numberProblem({
          prompt: t(
            `The line of best fit for a data set is $\\hat{y} = ${linear(m, b)}$. One data point is $(${x}, ${dec(y)})$. What is the observed value minus the value predicted by the line?`,
            `一组数据的最佳拟合直线为 $\\hat{y} = ${linear(m, b)}$。其中一个数据点是 $(${x}, ${dec(y)})$。观测值减去直线的预测值等于多少？`,
          ),
          answer: r,
          form: "decimal",
          wrong: [r.neg(), yhat, y.sub(Q.of(b))].filter((w) => !w.eq(r)),
          solution: t(
            `The line predicts $\\hat{y} = ${dec(m)} \\cdot ${x} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${dec(yhat)}$, so the difference is $${dec(y)} - ${yhat.sign() < 0 ? `(${dec(yhat)})` : dec(yhat)} = ${dec(r)}$.`,
            `直线的预测值为 $\\hat{y} = ${dec(m)} \\cdot ${x} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${dec(yhat)}$，所以差为 $${dec(y)} - ${yhat.sign() < 0 ? `(${dec(yhat)})` : dec(yhat)} = ${dec(r)}$。`,
          ),
        });
      },
    ),
    kp(
      "above-or-below-the-line",
      t("Above or below the line", "在直线上方还是下方"),
      t(
        "A data point lies above the line of best fit when its observed value is greater than the value the line predicts at the same input, and below when it is less. So the line overestimates points below it and underestimates points above it.",
        "当数据点的观测值大于直线在同一输入处的预测值时，点在最佳拟合直线上方；小于时在下方。所以直线高估了它下方的点，低估了它上方的点。",
      ),
      (rng) => {
        const m = rng.nonZero(-12, 12);
        const b = rng.int(-30, 60);
        const x = rng.int(1, 15);
        const yhat = m * x + b;
        const d = rng.pick([1, -1, 0]) * rng.int(1, 25);
        const y = yhat + d;
        const label = (s: number) =>
          t(s > 0 ? "Above the line" : s < 0 ? "Below the line" : "On the line", s > 0 ? "在直线上方" : s < 0 ? "在直线下方" : "在直线上");
        const s = Math.sign(d);
        return pickChoice(
          rng,
          t(
            `A line of best fit is $\\hat{y} = ${linear(m, b)}$. Where does the data point $(${x}, ${y})$ lie relative to the line?`,
            `最佳拟合直线为 $\\hat{y} = ${linear(m, b)}$。数据点 $(${x}, ${y})$ 相对于直线在什么位置？`,
          ),
          label(s),
          [1, -1, 0].filter((v) => v !== s).map(label),
          t(
            `At $x = ${x}$ the line predicts $${m} \\cdot ${x} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${yhat}$. The observed value $${y}$ is ${s > 0 ? "greater" : s < 0 ? "less" : "the same"}, so the point is ${s > 0 ? "above" : s < 0 ? "below" : "on"} the line.`,
            `在 $x = ${x}$ 处直线的预测值为 $${m} \\cdot ${x} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${yhat}$。观测值 $${y}$ ${s > 0 ? "更大" : s < 0 ? "更小" : "与之相等"}，所以点${s > 0 ? "在直线上方" : s < 0 ? "在直线下方" : "在直线上"}。`,
          ),
        );
      },
    ),
  ],
);

/** satFundamentalsDataTopics are the problem-solving and data topics written for SAT Math Fundamentals. */
export const satFundamentalsDataTopics: readonly TopicDef[] = [
  manipulatingRatiosInVariousContexts,
  unitConversionsUsingBaseUnitsOfMass,
  unitConversionsUsingBaseUnitsOfLength,
  unitConversionsUsingUnitsOfTime,
  convertingUnitsOfAreaToLargerUnits,
  convertingBetweenMixedUnitsContainingSquares,
  density,
  interpretingDescriptionsOfPhysicalPhenomena,
  interpretingRatesOfChangeOfPhysicalPhenomena,
  combiningMeans,
  determiningUnknownObservationsGivenStatisticalMetrics,
  boundingStatisticsForGroupedData,
  effectsOfDataChangeOnTheMean,
  comparingEffectsOfDataChangeOnMeasuresOfCentrality,
  statisticalEffectsOfDataTransformations,
  comparingDataPointsToLinesOfBestFit,
];
