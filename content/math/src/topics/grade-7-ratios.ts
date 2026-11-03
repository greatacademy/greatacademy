import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q } from "@ga/subject-math";

import { article, choiceProblem, expressionProblem, mixedLatex, numberProblem, yesNo } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// 7th Grade Math: unit prices and unit rates with fractions and mixed numbers, proportional relationships in
// tables, graphs and words, percentage increase and decrease, and percentages in commerce and finance.

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

/** gcd is the greatest common divisor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** lcm is the least common multiple of two positive whole numbers. */
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** usd writes an amount of cents as dollars in LaTeX: "\$12.50". */
const usd = (cents: number) => `\\$${(cents / 100).toFixed(2)}`;

/** cq is an amount of cents as a number of dollars. */
const cq = (cents: number) => Q.of(cents, 100);

/** names are the people in word problems. */
const names = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Felix", "Grace", "Hana", "Ivan", "Jade"];

/** twoNames draws two different names. */
const twoNames = (rng: Rng): [string, string] => rng.sample(names, 2) as [string, string];

/** quarters are amounts from 1/2 to 4 1/2 in quarters, written as numbers of quarters. */
const quarters = [2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 18];

// ---------------------------------------------------------------------------
// Unit prices

/** Good is something sold by the piece, in both languages. */
interface Good {
  readonly one: string;
  readonly many: string;
  /** zh is the Chinese measure word and noun, such as "根燕麦棒". */
  readonly zh: string;
}

const goods: readonly Good[] = [
  { one: "granola bar", many: "granola bars", zh: "根燕麦棒" },
  { one: "can of soup", many: "cans of soup", zh: "罐汤" },
  { one: "bottle of juice", many: "bottles of juice", zh: "瓶果汁" },
  { one: "pencil", many: "pencils", zh: "支铅笔" },
  { one: "battery", many: "batteries", zh: "节电池" },
  { one: "yogurt cup", many: "yogurt cups", zh: "杯酸奶" },
];

/** Bulk is something sold by weight or length, in both languages. */
interface Bulk {
  readonly en: string;
  readonly zh: string;
  readonly unit: string;
  readonly units: string;
  readonly zhUnit: string;
  /** plural tells whether the name takes a plural verb: "grapes cost", "cheese costs". */
  readonly plural: boolean;
}

const bulks: readonly Bulk[] = [
  { en: "grapes", zh: "葡萄", unit: "pound", units: "pounds", zhUnit: "磅", plural: true },
  { en: "cheese", zh: "奶酪", unit: "pound", units: "pounds", zhUnit: "磅", plural: false },
  { en: "coffee beans", zh: "咖啡豆", unit: "pound", units: "pounds", zhUnit: "磅", plural: true },
  { en: "cherries", zh: "樱桃", unit: "kilogram", units: "kilograms", zhUnit: "千克", plural: true },
  { en: "rice", zh: "大米", unit: "kilogram", units: "kilograms", zhUnit: "千克", plural: false },
  { en: "ribbon", zh: "丝带", unit: "yard", units: "yards", zhUnit: "码", plural: false },
  { en: "fabric", zh: "布料", unit: "yard", units: "yards", zhUnit: "码", plural: false },
];

/** capitalized writes a word with a capital first letter. */
const capitalized = (s: string) => `${s[0]!.toUpperCase()}${s.slice(1)}`;

/** quarterLatex writes a number of quarters as a decimal: 6 → "1.5". */
const quarterLatex = (q: number) => dec(Q.of(q, 4));

/** findingUnitPrices divides a price by a number of items or by a decimal weight. */
export const findingUnitPrices = topic(
  "finding-unit-prices",
  t("Finding Unit Prices", "求单价"),
  t(
    "A unit price is the price of one item or of one unit of measure: price ÷ quantity. A pack of 6 bars for \\$8.10 costs \\$8.10 ÷ 6 = \\$1.35 per bar, and 2.5 pounds for \\$11.25 cost \\$11.25 ÷ 2.5 = \\$4.50 per pound.",
    "单价是一件物品或一个计量单位的价格：总价 ÷ 数量。6 根燕麦棒一包 \\$8.10，每根 \\$8.10 ÷ 6 = \\$1.35；2.5 磅售价 \\$11.25，每磅 \\$11.25 ÷ 2.5 = \\$4.50。",
  ),
  ["solving-problems-using-unit-rates", "dividing-decimals-using-the-standard-algorithm"],
  ["7.RP.A.1"],
  [
    {
      id: "price-of-one-item",
      title: t("The price of one item", "一件物品的价格"),
      explanation: t(
        "The unit price is the cost of one item. Divide the total price by the number of items in the package. Comparing unit prices shows which package is the better buy.\n\nA pack of $6$ granola bars costs $\\$8.10$. One bar costs $\\$8.10 \\div 6 = \\$1.35$.",
        "单价是一件商品的价钱。用总价除以包装里商品的件数，就得到单价。比较单价可以看出哪种包装更划算。\n\n$6$ 根燕麦棒一包，售价 $\\$8.10$。每根 $\\$8.10 \\div 6 = \\$1.35$。",
      ),
      generate(rng) {
        const g = rng.pick(goods);
        const n = rng.int(3, 12);
        const u = rng.int(25, 299);
        const total = n * u;
        return numberProblem({
          prompt: t(
            `A pack of ${n} ${g.many} costs $${usd(total)}$. What is the price of one ${g.one}, in dollars?`,
            `${n} ${g.zh}一包，售价 $${usd(total)}$。每${g.zh}多少美元？`,
          ),
          answer: cq(u),
          form: "decimal",
          wrong: [cq(total * n), Q.of(u, 10), Q.of(u, 1000), Q.of(n * 100, total)],
          solution: t(
            `Divide the price by the number of items: $${usd(total)} \\div ${n} = ${usd(u)}$.`,
            `用总价除以数量：$${usd(total)} \\div ${n} = ${usd(u)}$。`,
          ),
        });
      },
    },
    {
      id: "price-per-unit-of-measure",
      title: t("The price per unit of measure", "每个计量单位的价格"),
      explanation: t(
        "For goods sold by weight or volume, the unit price is the cost of one pound, one ounce or one liter. Divide the total price by the amount bought, even when the amount is a decimal.\n\n$2.5$ pounds of cheese cost $\\$11.25$. The price per pound is $\\$11.25 \\div 2.5 = \\$112.5 \\div 25 = \\$4.50$.",
        "按重量或体积出售的商品，单价是每磅、每盎司或每升的价钱。用总价除以购买的数量，即使数量是小数也一样。\n\n$2.5$ 磅奶酪售价 $\\$11.25$。每磅价格是 $\\$11.25 \\div 2.5 = \\$112.5 \\div 25 = \\$4.50$。",
      ),
      generate(rng) {
        const b = rng.pick(bulks);
        const q = rng.pick(quarters);
        const u = 4 * rng.int(25, 200);
        const total = (u * q) / 4;
        return numberProblem({
          prompt: t(
            `$${quarterLatex(q)}$ ${b.units} of ${b.en} cost $${usd(total)}$. What is the price per ${b.unit}, in dollars?`,
            `$${quarterLatex(q)}$ ${b.zhUnit}${b.zh}售价 $${usd(total)}$。每${b.zhUnit}多少美元？`,
          ),
          answer: cq(u),
          form: "decimal",
          wrong: [cq(total).mul(Q.of(q, 4)), Q.of(u, 10), Q.of(u, 1000), Q.of(q * 25, total)],
          solution: t(
            `Divide the price by the amount: $${usd(total)} \\div ${quarterLatex(q)} = ${usd(u)}$ per ${b.unit}.`,
            `用总价除以数量：$${usd(total)} \\div ${quarterLatex(q)} = ${usd(u)}$，即每${b.zhUnit} $${usd(u)}$。`,
          ),
        });
      },
    },
  ],
);

/** budgetGoods are things bought by the unit with a fixed amount of money. */
const budgetGoods: readonly Bulk[] = [
  { en: "gasoline", zh: "汽油", unit: "gallon", units: "gallons", zhUnit: "加仑", plural: false },
  { en: "ribbon", zh: "丝带", unit: "yard", units: "yards", zhUnit: "码", plural: false },
  { en: "rope", zh: "绳子", unit: "meter", units: "meters", zhUnit: "米", plural: false },
  { en: "rice", zh: "大米", unit: "kilogram", units: "kilograms", zhUnit: "千克", plural: false },
  { en: "potatoes", zh: "土豆", unit: "pound", units: "pounds", zhUnit: "磅", plural: true },
];

/** workingWithUnitPrices multiplies a unit price by a quantity and divides a budget by a unit price. */
export const workingWithUnitPrices = topic(
  "working-with-unit-prices",
  t("Working With Unit Prices", "运用单价"),
  t(
    "Cost = unit price × quantity, and quantity = cost ÷ unit price. At \\$2.40 per pound, 3.5 pounds cost \\$8.40; at \\$3.60 per gallon, \\$27 buys 7.5 gallons.",
    "总价 = 单价 × 数量，数量 = 总价 ÷ 单价。每磅 \\$2.40，3.5 磅要 \\$8.40；每加仑 \\$3.60，\\$27 能买 7.5 加仑。",
  ),
  ["finding-unit-prices", "multiplying-two-digit-decimals"],
  ["7.RP.A.1"],
  [
    {
      id: "cost-from-a-unit-price",
      title: t("Finding a cost", "求总价"),
      explanation: t(
        "Once the unit price is known, the cost of any amount is the unit price times the number of units. A larger amount costs proportionally more.\n\nGrapes cost $\\$2.40$ per pound, so $3.5$ pounds cost $3.5 \\times \\$2.40 = \\$8.40$.",
        "知道单价后，任意数量的价钱等于单价乘数量。数量越大，价钱按比例越多。\n\n葡萄每磅 $\\$2.40$，所以 $3.5$ 磅要 $3.5 \\times \\$2.40 = \\$8.40$。",
      ),
      generate(rng) {
        const b = rng.pick(bulks);
        const q = rng.pick(quarters);
        const u = 4 * rng.int(25, 200);
        const total = (u * q) / 4;
        return numberProblem({
          prompt: t(
            `${capitalized(b.en)} ${b.plural ? "cost" : "costs"} $${usd(u)}$ per ${b.unit}. How much do $${quarterLatex(q)}$ ${b.units} cost, in dollars?`,
            `${b.zh}每${b.zhUnit} $${usd(u)}$。$${quarterLatex(q)}$ ${b.zhUnit}要多少美元？`,
          ),
          answer: cq(total),
          form: "decimal",
          wrong: [cq(u).div(Q.of(q, 4)), cq(total * 10), cq(total).div(Q.of(10)), cq(u).add(Q.of(q, 4))],
          solution: t(
            `Multiply the unit price by the amount: $${quarterLatex(q)} \\times ${usd(u)} = ${usd(total)}$.`,
            `用单价乘数量：$${quarterLatex(q)} \\times ${usd(u)} = ${usd(total)}$。`,
          ),
        });
      },
    },
    {
      id: "quantity-for-a-budget",
      title: t("How much can you buy?", "能买多少？"),
      explanation: t(
        "To find how much a budget buys, divide the money available by the unit price. The quotient is the number of units, and it can be a decimal for goods sold by measure.\n\nGasoline costs $\\$3.60$ per gallon, so $\\$27$ buys $27 \\div 3.6 = 270 \\div 36 = 7.5$ gallons.",
        "要求一笔钱能买多少，就用这笔钱除以单价。商就是能买到的数量；按计量出售的商品，数量可以是小数。\n\n汽油每加仑 $\\$3.60$，所以 $\\$27$ 能买 $27 \\div 3.6 = 270 \\div 36 = 7.5$ 加仑。",
      ),
      generate(rng) {
        const b = rng.pick(budgetGoods);
        const q = rng.pick(quarters);
        const u = 4 * rng.int(25, 150);
        const total = (u * q) / 4;
        return numberProblem({
          prompt: t(
            `${capitalized(b.en)} ${b.plural ? "cost" : "costs"} $${usd(u)}$ per ${b.unit}. How many ${b.units} can you buy with $${usd(total)}$?`,
            `${b.zh}每${b.zhUnit} $${usd(u)}$。用 $${usd(total)}$ 能买多少${b.zhUnit}？`,
          ),
          answer: Q.of(q, 4),
          form: "decimal",
          wrong: [cq(u).mul(cq(total)), Q.of(u, total), Q.of(q, 40), Q.of(q * 10, 4)],
          solution: t(
            `Divide the money by the unit price: $${usd(total)} \\div ${usd(u)} = ${quarterLatex(q)}$ ${b.units}.`,
            `用钱数除以单价：$${usd(total)} \\div ${usd(u)} = ${quarterLatex(q)}$ ${b.zhUnit}。`,
          ),
        });
      },
    },
  ],
);

/** Sized is a product sold in sizes measured in ounces. */
const sizedGoods: readonly { readonly en: string; readonly zh: string }[] = [
  { en: "box of cereal", zh: "麦片" },
  { en: "jar of peanut butter", zh: "花生酱" },
  { en: "bottle of shampoo", zh: "洗发水" },
  { en: "bag of trail mix", zh: "什锦果仁" },
];

/** solvingMultiStepUnitPriceProblems compares unit prices and combines several purchases. */
export const solvingMultiStepUnitPriceProblems = topic(
  "solving-multi-step-unit-price-problems",
  t("Solving Multi-Step Unit Price Problems", "解多步单价问题"),
  t(
    "To find the better buy, compare unit prices rather than total prices. The savings on a purchase are the difference in unit prices times the quantity, and the cost of a mixed purchase is the sum of the cost of each part.",
    "比较哪种更划算，要比较单价而不是总价。购买时节省的钱是单价之差乘数量；买几种东西的总价是各部分总价之和。",
  ),
  ["working-with-unit-prices"],
  ["7.RP.A.1", "7.RP.A.3"],
  [
    {
      id: "the-better-buy",
      title: t("The better buy", "哪种更划算"),
      explanation: t(
        "A $12$-ounce box costs $\\$3.60$ ($\\$0.30$ per ounce) and a $20$-ounce box costs $\\$6.40$ ($\\$0.32$ per ounce). The smaller box is the better buy, even though the larger box holds more.",
        "$12$ 盎司装售价 $\\$3.60$（每盎司 $\\$0.30$），$20$ 盎司装售价 $\\$6.40$（每盎司 $\\$0.32$）。小盒更划算，虽然大盒装得更多。",
      ),
      generate(rng) {
        const g = rng.pick(sizedGoods);
        const na = rng.int(6, 16);
        const nb = rng.int(na + 4, 32);
        let ua: number, ub: number;
        do {
          ua = rng.int(12, 60);
          ub = rng.int(12, 60);
        } while (ua === ub);
        const correct = ua < ub ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `${article(na, true)} ${na}-ounce ${g.en} costs $${usd(na * ua)}$ and ${article(nb)} ${nb}-ounce ${g.en} costs $${usd(nb * ub)}$. Which is the better buy?`,
            `${na} 盎司装的${g.zh}售价 $${usd(na * ua)}$，${nb} 盎司装的${g.zh}售价 $${usd(nb * ub)}$。哪种更划算？`,
          ),
          options: [
            t(`The ${na}-ounce size`, `${na} 盎司装`),
            t(`The ${nb}-ounce size`, `${nb} 盎司装`),
            t("They are equally good buys", "一样划算"),
          ],
          correct,
          solution: t(
            `Compare the prices per ounce: $${usd(na * ua)} \\div ${na} = ${usd(ua)}$ and $${usd(nb * ub)} \\div ${nb} = ${usd(ub)}$. The ${correct === 0 ? na : nb}-ounce size costs less per ounce.`,
            `比较每盎司的价格：$${usd(na * ua)} \\div ${na} = ${usd(ua)}$，$${usd(nb * ub)} \\div ${nb} = ${usd(ub)}$。${correct === 0 ? na : nb} 盎司装每盎司更便宜。`,
          ),
        });
      },
    },
    {
      id: "savings-at-the-cheaper-store",
      title: t("How much is saved?", "节省多少钱？"),
      explanation: t(
        "To compare two offers, find the unit price at each store first. The difference of the unit prices is the saving on each item; multiply it by the number of items to find the total saving.\n\nStore A sells $4$ cans for $\\$5.00$ ($\\$1.25$ each); store B sells $6$ cans for $\\$6.90$ ($\\$1.15$ each). On $12$ cans, store B saves $12 \\times \\$0.10 = \\$1.20$.",
        "比较两种售价时，先分别求出每家店的单价。单价之差就是每件商品省下的钱，再乘商品的件数，就得到一共节省的钱。\n\nA 店 $4$ 罐 $\\$5.00$（每罐 $\\$1.25$）；B 店 $6$ 罐 $\\$6.90$（每罐 $\\$1.15$）。买 $12$ 罐，在 B 店节省 $12 \\times \\$0.10 = \\$1.20$。",
      ),
      generate(rng) {
        const g = rng.pick(goods);
        const [na, nb] = rng.sample([2, 3, 4, 5, 6], 2) as [number, number];
        let ua: number, ub: number;
        do {
          ua = rng.int(60, 250);
          ub = rng.int(60, 250);
        } while (ua === ub || Math.abs(ua - ub) > 60);
        const base = lcm(na, nb);
        const n = base * rng.int(1, Math.max(1, Math.floor(60 / base)));
        const save = Math.abs(ua - ub) * n;
        const cheaper = ua < ub ? "A" : "B";
        return numberProblem({
          prompt: t(
            `Store A sells packs of ${na} ${g.many} for $${usd(na * ua)}$. Store B sells packs of ${nb} ${g.many} for $${usd(nb * ub)}$. How much do you save, in dollars, by buying ${n} ${g.many} at the cheaper store?`,
            `A 店 ${na} ${g.zh}一包，售价 $${usd(na * ua)}$；B 店 ${nb} ${g.zh}一包，售价 $${usd(nb * ub)}$。在更便宜的店买 ${n} ${g.zh}，能节省多少美元？`,
          ),
          answer: cq(save),
          form: "decimal",
          wrong: [cq(Math.abs(na * ua - nb * ub)), cq(Math.abs(ua - ub)), cq(Math.min(ua, ub) * n)],
          solution: t(
            `Unit prices: $${usd(na * ua)} \\div ${na} = ${usd(ua)}$ at store A and $${usd(nb * ub)} \\div ${nb} = ${usd(ub)}$ at store B, so store ${cheaper} is cheaper by $${usd(Math.abs(ua - ub))}$ per item. On ${n} items: $${n} \\times ${usd(Math.abs(ua - ub))} = ${usd(save)}$.`,
            `单价：A 店 $${usd(na * ua)} \\div ${na} = ${usd(ua)}$，B 店 $${usd(nb * ub)} \\div ${nb} = ${usd(ub)}$，${cheaper} 店每件便宜 $${usd(Math.abs(ua - ub))}$。买 ${n} 件：$${n} \\times ${usd(Math.abs(ua - ub))} = ${usd(save)}$。`,
          ),
        });
      },
    },
    {
      id: "cost-of-a-mixed-purchase",
      title: t("The cost of a mixed purchase", "买几种东西的总价"),
      explanation: t(
        "When a purchase includes several goods, find the cost of each good separately by multiplying its unit price by its amount. Then add those costs to get the total.\n\nApples cost $\\$1.20$ per pound and pears $\\$1.80$ per pound. $2.5$ pounds of apples and $1.5$ pounds of pears cost $2.5 \\times \\$1.20 + 1.5 \\times \\$1.80 = \\$3.00 + \\$2.70 = \\$5.70$.",
        "一次购买几种商品时，先分别用每种商品的单价乘它的数量，求出各自的价钱，再把这些价钱加起来得到总价。\n\n苹果每磅 $\\$1.20$，梨每磅 $\\$1.80$。$2.5$ 磅苹果和 $1.5$ 磅梨共 $2.5 \\times \\$1.20 + 1.5 \\times \\$1.80 = \\$3.00 + \\$2.70 = \\$5.70$。",
      ),
      generate(rng) {
        const [fa, fb] = rng.sample(
          [t("apples", "苹果"), t("pears", "梨"), t("bananas", "香蕉"), t("peaches", "桃子"), t("plums", "李子")],
          2,
        ) as [Text, Text];
        const [pa, pb] = [4 * rng.int(20, 90), 4 * rng.int(20, 90)];
        const [qa, qb] = rng.sample(quarters, 2) as [number, number];
        const [ca, cb] = [(pa * qa) / 4, (pb * qb) / 4];
        return numberProblem({
          prompt: t(
            `At a market, ${fa.en} cost $${usd(pa)}$ per pound and ${fb.en} cost $${usd(pb)}$ per pound. How much do $${quarterLatex(qa)}$ pounds of ${fa.en} and $${quarterLatex(qb)}$ pounds of ${fb.en} cost altogether, in dollars?`,
            `市场上${fa["zh-CN"]}每磅 $${usd(pa)}$，${fb["zh-CN"]}每磅 $${usd(pb)}$。买 $${quarterLatex(qa)}$ 磅${fa["zh-CN"]}和 $${quarterLatex(qb)}$ 磅${fb["zh-CN"]}一共要多少美元？`,
          ),
          answer: cq(ca + cb),
          form: "decimal",
          wrong: [cq(((pa + pb) * (qa + qb)) / 4), cq(ca), cq(cb), cq(pa + pb)],
          solution: t(
            `$${quarterLatex(qa)} \\times ${usd(pa)} = ${usd(ca)}$ and $${quarterLatex(qb)} \\times ${usd(pb)} = ${usd(cb)}$, so the total is $${usd(ca)} + ${usd(cb)} = ${usd(ca + cb)}$.`,
            `$${quarterLatex(qa)} \\times ${usd(pa)} = ${usd(ca)}$，$${quarterLatex(qb)} \\times ${usd(pb)} = ${usd(cb)}$，共 $${usd(ca)} + ${usd(cb)} = ${usd(ca + cb)}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Unit rates with fractions and mixed numbers

/** RateContext is a situation with a rate of one quantity a per one unit of another quantity b. */
interface RateContext {
  /** given says that the amount a goes with the amount b. */
  readonly given: (a: Q, b: Q) => Text;
  /** perOne asks for the amount of a per one unit of b. */
  readonly perOne: Text;
  /** scaled asks for the amount of a that goes with m units of b. */
  readonly scaled: (m: Q) => Text;
  /** inverse asks for the amount of b that goes with m units of a. */
  readonly inverse: (m: Q) => Text;
  /** rate names the unit rate a per b, and inverseRate the rate b per a. */
  readonly rate: Text;
  readonly inverseRate: Text;
}

/** ml writes a positive number as an integer, a fraction or a mixed number. */
const ml = (q: Q) => mixedLatex(q);

/** word picks the singular or plural of a unit for an amount: "mile" for 3/4, "miles" for 1 1/2. */
const word = (q: Q, one: string, many: string) => (q.cmp(Q.one) <= 0 ? one : many);

const rateContexts: readonly RateContext[] = [
  {
    given: (a, b) =>
      t(
        `A hiker walks $${ml(a)}$ ${word(a, "mile", "miles")} in $${ml(b)}$ ${word(b, "hour", "hours")}.`,
        `一名徒步者 $${ml(b)}$ 小时走了 $${ml(a)}$ 英里。`,
      ),
    perOne: t("How many miles does the hiker walk per hour?", "他每小时走多少英里？"),
    scaled: (m) =>
      t(
        `At this rate, how many miles does the hiker walk in $${ml(m)}$ ${word(m, "hour", "hours")}?`,
        `照这样的速度，他 $${ml(m)}$ 小时走多少英里？`,
      ),
    inverse: (m) =>
      t(
        `At this rate, how many hours does it take the hiker to walk $${ml(m)}$ ${word(m, "mile", "miles")}?`,
        `照这样的速度，他走 $${ml(m)}$ 英里需要多少小时？`,
      ),
    rate: t("the miles per hour", "每小时走的英里数"),
    inverseRate: t("the hours per mile", "每英里所需的小时数"),
  },
  {
    given: (a, b) =>
      t(
        `A recipe uses $${ml(a)}$ ${word(a, "cup", "cups")} of sugar for every $${ml(b)}$ ${word(b, "cup", "cups")} of flour.`,
        `一份食谱每用 $${ml(b)}$ 杯面粉，就要用 $${ml(a)}$ 杯糖。`,
      ),
    perOne: t("How many cups of sugar are used per cup of flour?", "每杯面粉要用多少杯糖？"),
    scaled: (m) =>
      t(`How many cups of sugar are needed for $${ml(m)}$ ${word(m, "cup", "cups")} of flour?`, `用 $${ml(m)}$ 杯面粉需要多少杯糖？`),
    inverse: (m) =>
      t(`How many cups of flour go with $${ml(m)}$ ${word(m, "cup", "cups")} of sugar?`, `用 $${ml(m)}$ 杯糖要配多少杯面粉？`),
    rate: t("the cups of sugar per cup of flour", "每杯面粉所用的糖的杯数"),
    inverseRate: t("the cups of flour per cup of sugar", "每杯糖所配的面粉的杯数"),
  },
  {
    given: (a, b) =>
      t(
        `A tap fills a tank with $${ml(a)}$ ${word(a, "gallon", "gallons")} of water in $${ml(b)}$ ${word(b, "minute", "minutes")}.`,
        `一个水龙头 $${ml(b)}$ 分钟向水箱注入 $${ml(a)}$ 加仑水。`,
      ),
    perOne: t("How many gallons does it fill per minute?", "它每分钟注入多少加仑水？"),
    scaled: (m) =>
      t(
        `At this rate, how many gallons does it fill in $${ml(m)}$ ${word(m, "minute", "minutes")}?`,
        `照这样的速度，$${ml(m)}$ 分钟注入多少加仑水？`,
      ),
    inverse: (m) =>
      t(
        `At this rate, how many minutes does it take to fill $${ml(m)}$ ${word(m, "gallon", "gallons")}?`,
        `照这样的速度，注入 $${ml(m)}$ 加仑水需要多少分钟？`,
      ),
    rate: t("the gallons per minute", "每分钟注入的加仑数"),
    inverseRate: t("the minutes per gallon", "每加仑所需的分钟数"),
  },
  {
    given: (a, b) =>
      t(
        `A painter paints $${ml(a)}$ ${a.cmp(Q.one) < 0 ? "of a wall" : word(a, "wall", "walls")} in $${ml(b)}$ ${word(b, "hour", "hours")}.`,
        `一名油漆工 $${ml(b)}$ 小时刷了 $${ml(a)}$ 面墙。`,
      ),
    perOne: t("How many walls does the painter paint per hour?", "他每小时刷多少面墙？"),
    scaled: (m) =>
      t(
        `At this rate, how many walls does the painter paint in $${ml(m)}$ ${word(m, "hour", "hours")}?`,
        `照这样的速度，他 $${ml(m)}$ 小时刷多少面墙？`,
      ),
    inverse: (m) =>
      t(
        `At this rate, how many hours does it take the painter to paint $${ml(m)}$ ${m.cmp(Q.one) < 0 ? "of a wall" : word(m, "wall", "walls")}?`,
        `照这样的速度，他刷 $${ml(m)}$ 面墙需要多少小时？`,
      ),
    rate: t("the walls per hour", "每小时刷的墙数"),
    inverseRate: t("the hours per wall", "每面墙所需的小时数"),
  },
];

/** properQ draws a proper fraction n/d in lowest terms with d from 2 to maxDen. */
function properQ(rng: Rng, maxDen = 8): Q {
  const d = rng.int(2, maxDen);
  let n: number;
  do n = rng.int(1, d - 1);
  while (gcd(n, d) !== 1);
  return Q.of(n, d);
}

/** mixedQ draws a mixed number from 1 1/d to 4 (d−1)/d with d from 2 to maxDen. */
const mixedQ = (rng: Rng, maxDen = 6) => properQ(rng, maxDen).add(Q.of(rng.int(1, 4)));

/** divisionSteps writes a ÷ b = a × 1/b = answer for two positive rationals, using improper fractions. */
function divisionSteps(a: Q, b: Q): string {
  const recip = Q.one.div(b);
  return `${ml(a)} \\div ${ml(b)} = ${a.toLatex()} \\times ${recip.toLatex()} = ${a.div(b).toLatex()}`;
}

/** mixedTail writes " = 2\\frac{2}{3}" after an improper fraction greater than 1, and nothing otherwise. */
const mixedTail = (q: Q) => (q.isInteger() || q.cmp(Q.one) < 0 ? "" : ` = ${ml(q)}`);

/** rateProblem asks for the unit rate a ÷ b in a context. */
function rateProblem(ctx: RateContext, a: Q, b: Q): ReturnType<typeof numberProblem> {
  const rate = a.div(b);
  return numberProblem({
    prompt: t(`${ctx.given(a, b).en} ${ctx.perOne.en}`, `${ctx.given(a, b)["zh-CN"]}${ctx.perOne["zh-CN"]}`),
    answer: rate,
    wrong: [a.mul(b), b.div(a), a, b],
    solution: t(
      `Divide to find ${ctx.rate.en}: $${divisionSteps(a, b)}${mixedTail(rate)}$.`,
      `用除法求${ctx.rate["zh-CN"]}：$${divisionSteps(a, b)}${mixedTail(rate)}$。`,
    ),
  });
}

/** unitRatesAssociatedWithRatiosOfFractions finds unit rates as quotients of fractions. */
export const unitRatesAssociatedWithRatiosOfFractions = topic(
  "unit-rates-associated-with-ratios-of-fractions",
  t("Unit Rates Associated With Ratios of Fractions", "分数之比的单位率"),
  t(
    "A unit rate is the amount of one quantity for one unit of another, found by dividing. Walking 1/2 mile in 1/4 hour is 1/2 ÷ 1/4 = 2 miles per hour; 6 laps in 3/4 hour is 6 ÷ 3/4 = 8 laps per hour.",
    "单位率是另一个量为 1 个单位时这个量的多少，用除法求。1/4 小时走 1/2 英里，速度是 1/2 ÷ 1/4 = 2 英里/小时；3/4 小时跑 6 圈，每小时跑 6 ÷ 3/4 = 8 圈。",
  ),
  ["solving-problems-using-unit-rates", "dividing-fractions"],
  ["7.RP.A.1"],
  [
    {
      id: "a-fraction-per-a-fraction",
      title: t("A fraction per a fraction", "分数除以分数"),
      explanation: t(
        "A unit rate is the amount of one quantity for one unit of the other. Divide the first quantity by the second, even when both are fractions, by multiplying by the reciprocal of the divisor.\n\nA hiker walks $\\frac{2}{3}$ mile in $\\frac{1}{4}$ hour. Per hour: $\\frac{2}{3} \\div \\frac{1}{4} = \\frac{2}{3} \\times 4 = \\frac{8}{3} = 2\\frac{2}{3}$ miles.",
        "单位率是另一个量每一个单位所对应的量。用第一个量除以第二个量；即使两个量都是分数也一样，除以一个分数就是乘它的倒数。\n\n徒步者 $\\frac{1}{4}$ 小时走 $\\frac{2}{3}$ 英里。每小时：$\\frac{2}{3} \\div \\frac{1}{4} = \\frac{2}{3} \\times 4 = \\frac{8}{3} = 2\\frac{2}{3}$ 英里。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        let a: Q, b: Q;
        do {
          a = properQ(rng);
          b = properQ(rng);
        } while (a.eq(b));
        return rateProblem(ctx, a, b);
      },
    },
    {
      id: "a-fraction-and-a-whole-number",
      title: t("A fraction and a whole number", "分数与整数"),
      explanation: t(
        "The unit rate is always the quantity being measured divided by the quantity that should become one unit. Dividing by a whole number makes the amount smaller, while dividing by a fraction less than one makes it larger.\n\n$\\frac{3}{4}$ gallon in $3$ minutes is $\\frac{3}{4} \\div 3 = \\frac{1}{4}$ gallon per minute. $6$ gallons in $\\frac{3}{4}$ minute is $6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ gallons per minute.",
        "单位率总是用要计量的量除以要化为一个单位的量。除以一个整数会使数变小，而除以一个小于 $1$ 的分数会使数变大。\n\n$3$ 分钟 $\\frac{3}{4}$ 加仑，每分钟 $\\frac{3}{4} \\div 3 = \\frac{1}{4}$ 加仑。$\\frac{3}{4}$ 分钟 $6$ 加仑，每分钟 $6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ 加仑。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        const f = properQ(rng);
        const w = Q.of(rng.int(2, 9));
        return rng.bool() ? rateProblem(ctx, f, w) : rateProblem(ctx, w, f);
      },
    },
  ],
);

/** unitRatesAssociatedWithRatiosOfMixedNumbers finds unit rates when the amounts are mixed numbers. */
export const unitRatesAssociatedWithRatiosOfMixedNumbers = topic(
  "unit-rates-associated-with-ratios-of-mixed-numbers",
  t("Unit Rates Associated With Ratios of Mixed Numbers", "带分数之比的单位率"),
  t(
    "To divide with mixed numbers, first write them as improper fractions. 3 3/4 gallons in 1 1/4 minutes is 15/4 ÷ 5/4 = 15/4 × 4/5 = 3 gallons per minute.",
    "带分数相除时，先化成假分数。1 1/4 分钟 3 3/4 加仑，每分钟 15/4 ÷ 5/4 = 15/4 × 4/5 = 3 加仑。",
  ),
  ["unit-rates-associated-with-ratios-of-fractions", "dividing-mixed-numbers"],
  ["7.RP.A.1"],
  [
    {
      id: "a-mixed-number-and-a-fraction",
      title: t("A mixed number and a fraction or whole number", "带分数与分数或整数"),
      explanation: t(
        "To find a unit rate with mixed numbers, first write each mixed number as an improper fraction. Then divide as with any fractions, multiplying by the reciprocal of the divisor.\n\n$2\\frac{1}{2}$ miles in $\\frac{1}{2}$ hour: $\\frac{5}{2} \\div \\frac{1}{2} = \\frac{5}{2} \\times 2 = 5$ miles per hour.",
        "求含带分数的单位率时，先把每个带分数化成假分数，再像普通分数那样相除，即乘除数的倒数。\n\n$\\frac{1}{2}$ 小时走 $2\\frac{1}{2}$ 英里：$\\frac{5}{2} \\div \\frac{1}{2} = \\frac{5}{2} \\times 2 = 5$ 英里/小时。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        const m = mixedQ(rng);
        const other = rng.bool() ? properQ(rng, 6) : Q.of(rng.int(2, 6));
        return rng.bool() ? rateProblem(ctx, m, other) : rateProblem(ctx, other, m);
      },
    },
    {
      id: "two-mixed-numbers",
      title: t("Two mixed numbers", "两个带分数"),
      explanation: t(
        "$3\\frac{3}{4}$ gallons in $1\\frac{1}{4}$ minutes: $\\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$ gallons per minute. Dividing the whole parts and the fraction parts separately does not work.",
        "$1\\frac{1}{4}$ 分钟 $3\\frac{3}{4}$ 加仑：$\\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$ 加仑/分钟。不能把整数部分和分数部分分别相除。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        let a: Q, b: Q;
        do {
          a = mixedQ(rng);
          b = mixedQ(rng, 4);
        } while (a.eq(b));
        return rateProblem(ctx, a, b);
      },
    },
  ],
);

/** scaledProblem asks for the amount that goes with m units at the rate a per b, or the inverse. */
function scaledProblem(ctx: RateContext, a: Q, b: Q, m: Q, inverse: boolean) {
  const rate = inverse ? b.div(a) : a.div(b);
  const answer = rate.mul(m);
  const [top, bottom] = inverse ? [b, a] : [a, b];
  const name = inverse ? ctx.inverseRate : ctx.rate;
  return numberProblem({
    prompt: t(
      `${ctx.given(a, b).en} ${(inverse ? ctx.inverse(m) : ctx.scaled(m)).en}`,
      `${ctx.given(a, b)["zh-CN"]}${(inverse ? ctx.inverse(m) : ctx.scaled(m))["zh-CN"]}`,
    ),
    answer,
    wrong: [top.mul(m), bottom.div(top).mul(m), rate.add(m), m.div(rate)],
    solution: t(
      `First find ${name.en}: $${divisionSteps(top, bottom)}$. Then multiply by $${ml(m)}$: $${rate.toLatex()} \\times ${m.toLatex()} = ${answer.toLatex()}${mixedTail(answer)}$.`,
      `先求${name["zh-CN"]}：$${divisionSteps(top, bottom)}$。再乘 $${ml(m)}$：$${rate.toLatex()} \\times ${m.toLatex()} = ${answer.toLatex()}${mixedTail(answer)}$。`,
    ),
  });
}

/** solvingUnitRateProblemsUsingRatiosOfFractions scales and compares rates given by fractions. */
export const solvingUnitRateProblemsUsingRatiosOfFractions = topic(
  "solving-unit-rate-problems-using-ratios-of-fractions",
  t("Solving Unit Rate Problems Using Ratios of Fractions", "用分数之比的单位率解决问题"),
  t(
    "Find the unit rate, then multiply by the amount asked about. With 3/4 cup of sugar for every 1/2 cup of flour, there are 3/2 cups of sugar per cup of flour, so 3 cups of flour need 9/2 = 4 1/2 cups of sugar. To compare two rates, compare their unit rates.",
    "先求单位率，再乘所问的量。每 1/2 杯面粉用 3/4 杯糖，即每杯面粉用 3/2 杯糖，所以 3 杯面粉需要 9/2 = 4 1/2 杯糖。比较两个速率，就比较它们的单位率。",
  ),
  ["unit-rates-associated-with-ratios-of-fractions"],
  ["7.RP.A.1"],
  [
    {
      id: "using-a-fractional-unit-rate",
      title: t("Using the unit rate", "用单位率计算"),
      explanation: t(
        "$\\frac{3}{4}$ cup of sugar for every $\\frac{1}{2}$ cup of flour is $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{2}$ cups of sugar per cup of flour. For $3$ cups of flour: $\\frac{3}{2} \\times 3 = \\frac{9}{2} = 4\\frac{1}{2}$ cups.",
        "每 $\\frac{1}{2}$ 杯面粉用 $\\frac{3}{4}$ 杯糖，即每杯面粉用 $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{2}$ 杯糖。$3$ 杯面粉：$\\frac{3}{2} \\times 3 = \\frac{9}{2} = 4\\frac{1}{2}$ 杯。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        let a: Q, b: Q;
        do {
          a = properQ(rng, 6);
          b = properQ(rng, 6);
        } while (a.eq(b));
        const m = rng.bool(0.7) ? Q.of(rng.int(2, 9)) : properQ(rng, 6);
        return scaledProblem(ctx, a, b, m, rng.bool(0.3));
      },
    },
    {
      id: "comparing-fractional-rates",
      title: t("Comparing rates", "比较速率"),
      explanation: t(
        "Ava walks $\\frac{2}{3}$ mile in $\\frac{1}{4}$ hour: $\\frac{8}{3}$ miles per hour. Ben walks $\\frac{1}{2}$ mile in $\\frac{1}{6}$ hour: $3$ miles per hour. Ben walks faster.",
        "Ava $\\frac{1}{4}$ 小时走 $\\frac{2}{3}$ 英里：每小时 $\\frac{8}{3}$ 英里。Ben $\\frac{1}{6}$ 小时走 $\\frac{1}{2}$ 英里：每小时 $3$ 英里。Ben 走得更快。",
      ),
      generate(rng) {
        const [p, q] = twoNames(rng);
        let a1: Q, b1: Q, a2: Q, b2: Q;
        do {
          a1 = properQ(rng, 6);
          b1 = properQ(rng, 6);
          a2 = properQ(rng, 6);
          b2 = properQ(rng, 6);
        } while (a1.eq(a2) || b1.eq(b2) || a1.eq(b1) || a2.eq(b2));
        const [r1, r2] = [a1.div(b1), a2.div(b2)];
        const c = r1.cmp(r2);
        const correct = c > 0 ? 0 : c < 0 ? 1 : 2;
        const sym = c > 0 ? ">" : c < 0 ? "<" : "=";
        return choiceProblem({
          prompt: t(
            `${p} paints $${a1.toLatex()}$ of a fence in $${b1.toLatex()}$ hour. ${q} paints $${a2.toLatex()}$ of the same kind of fence in $${b2.toLatex()}$ hour. Who paints faster?`,
            `${p} $${b1.toLatex()}$ 小时刷了 $${a1.toLatex()}$ 道篱笆，${q} $${b2.toLatex()}$ 小时刷了 $${a2.toLatex()}$ 道同样的篱笆。谁刷得更快？`,
          ),
          options: [t(p, p), t(q, q), t("They paint equally fast", "一样快")],
          correct,
          solution: t(
            `Fences per hour: ${p}: $${a1.toLatex()} \\div ${b1.toLatex()} = ${r1.toLatex()}$; ${q}: $${a2.toLatex()} \\div ${b2.toLatex()} = ${r2.toLatex()}$. Since $${r1.toLatex()} ${sym} ${r2.toLatex()}$, ${c === 0 ? "they paint equally fast" : `${c > 0 ? p : q} paints faster`}.`,
            `每小时刷的篱笆数：${p}：$${a1.toLatex()} \\div ${b1.toLatex()} = ${r1.toLatex()}$；${q}：$${a2.toLatex()} \\div ${b2.toLatex()} = ${r2.toLatex()}$。因为 $${r1.toLatex()} ${sym} ${r2.toLatex()}$，${c === 0 ? "两人一样快" : `${c > 0 ? p : q} 刷得更快`}。`,
          ),
        });
      },
    },
  ],
);

/** solvingUnitRateProblemsUsingRatiosOfMixedNumbers scales rates given by mixed numbers in both directions. */
export const solvingUnitRateProblemsUsingRatiosOfMixedNumbers = topic(
  "solving-unit-rate-problems-using-ratios-of-mixed-numbers",
  t("Solving Unit Rate Problems Using Ratios of Mixed Numbers", "用带分数之比的单位率解决问题"),
  t(
    "A hiker who walks 2 1/4 miles in 3/4 hour walks 9/4 ÷ 3/4 = 3 miles per hour, so in 2 1/2 hours she walks 3 × 5/2 = 7 1/2 miles. The rate the other way round, 1/3 hour per mile, gives the time: 9 miles take 9 × 1/3 = 3 hours.",
    "徒步者 3/4 小时走 2 1/4 英里，速度是 9/4 ÷ 3/4 = 3 英里/小时，所以 2 1/2 小时走 3 × 5/2 = 7 1/2 英里。反过来的单位率是每英里 1/3 小时，可用来求时间：9 英里需要 9 × 1/3 = 3 小时。",
  ),
  ["unit-rates-associated-with-ratios-of-mixed-numbers", "solving-unit-rate-problems-using-ratios-of-fractions"],
  ["7.RP.A.1"],
  [
    {
      id: "amount-for-a-mixed-number",
      title: t("Finding an amount", "求对应的量"),
      explanation: t(
        "First find the unit rate, the amount for one unit. Then multiply the unit rate by the given number of units, writing any mixed number as an improper fraction.\n\n$2\\frac{1}{4}$ miles in $\\frac{3}{4}$ hour is $3$ miles per hour, so $2\\frac{1}{2}$ hours give $3 \\times \\frac{5}{2} = 7\\frac{1}{2}$ miles.",
        "先求出单位率，即每一个单位对应的量，再用单位率乘给定的单位数。遇到带分数时先化成假分数。\n\n$\\frac{3}{4}$ 小时走 $2\\frac{1}{4}$ 英里，即每小时 $3$ 英里，所以 $2\\frac{1}{2}$ 小时走 $3 \\times \\frac{5}{2} = 7\\frac{1}{2}$ 英里。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        const a = mixedQ(rng, 4);
        const b = rng.bool() ? properQ(rng, 4) : mixedQ(rng, 4);
        const m = rng.bool() ? mixedQ(rng, 4) : Q.of(rng.int(2, 8));
        return scaledProblem(ctx, a, b, m, false);
      },
    },
    {
      id: "the-other-quantity-for-a-mixed-number",
      title: t("Using the rate the other way round", "反过来用单位率"),
      explanation: t(
        "Every ratio has two unit rates, one for each quantity. To find how much of the second quantity goes with a given amount of the first, use the rate of the second quantity per unit of the first.\n\n$2\\frac{1}{4}$ miles in $\\frac{3}{4}$ hour is $\\frac{3}{4} \\div \\frac{9}{4} = \\frac{1}{3}$ hour per mile, so $9$ miles take $9 \\times \\frac{1}{3} = 3$ hours.",
        "每个比都有两个单位率，每个量各对应一个。要求给定的第一个量对应多少第二个量，就用每一单位第一个量所对应的第二个量的单位率。\n\n$\\frac{3}{4}$ 小时走 $2\\frac{1}{4}$ 英里，即每英里 $\\frac{3}{4} \\div \\frac{9}{4} = \\frac{1}{3}$ 小时，所以 $9$ 英里需要 $9 \\times \\frac{1}{3} = 3$ 小时。",
      ),
      generate(rng) {
        const ctx = rng.pick(rateContexts);
        const a = mixedQ(rng, 4);
        const b = rng.bool() ? properQ(rng, 4) : mixedQ(rng, 4);
        const m = rng.bool() ? mixedQ(rng, 4) : Q.of(rng.int(2, 12));
        return scaledProblem(ctx, a, b, m, true);
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Proportional relationships

/** xyTable writes a table with an x row and a y row. */
function xyTable(xs: readonly string[], ys: readonly string[]): string {
  const cols = xs.map(() => "c").join("|");
  return `\\begin{array}{|c|${cols}|}\\hline x & ${xs.join(" & ")} \\\\ \\hline y & ${ys.join(" & ")} \\\\ \\hline\\end{array}`;
}

/** smallRate draws a constant of proportionality p/q in lowest terms with p ≤ maxP and q ≤ maxQ, other than 1. */
function smallRate(rng: Rng, maxP = 9, maxQ = 4): Q {
  for (;;) {
    const p = rng.int(1, maxP);
    const q = rng.int(1, maxQ);
    if (gcd(p, q) === 1 && p !== q) return Q.of(p, q);
  }
}

/** tableXs draws four increasing multiples of q. */
const tableXs = (rng: Rng, q: number) => (rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 10], 4) as number[]).sort((a, b) => a - b).map((m) => m * q);

/** quotientsLatex writes y ÷ x for each column, reduced: "\frac{6}{4} = \frac{3}{2}". */
const quotientsLatex = (xs: readonly number[], ys: readonly number[]) =>
  xs.map((x, i) => `\\frac{${ys[i]}}{${x}} = ${Q.of(ys[i]!, x).toLatex()}`).join(", \\quad ");

/** understandingProportionalRelationshipsUsingTables tests tables for proportionality and finds the constant. */
export const understandingProportionalRelationshipsUsingTables = topic(
  "understanding-proportional-relationships-using-tables",
  t("Understanding Proportional Relationships Using Tables", "用表格理解正比例关系"),
  t(
    "Two quantities are in a proportional relationship when y ÷ x is the same number k for every pair: y = kx. This k is the constant of proportionality. In a table, divide each y by its x and check that the quotients agree.",
    "如果每一对数的 y ÷ x 都等于同一个数 k，即 y = kx，那么这两个量成正比例关系，k 叫作比例常数。在表格中，用每个 y 除以对应的 x，看商是否都相等。",
  ),
  ["analyzing-two-variable-equations-using-tables", "unit-rates-associated-with-ratios-of-fractions"],
  ["7.RP.A.2a", "7.RP.A.2b"],
  [
    {
      id: "is-the-table-proportional",
      title: t("Is the table proportional?", "表格是否成正比例？"),
      explanation: t(
        "In the table $x: 2, 4, 6$ and $y: 5, 10, 15$, every $\\frac{y}{x} = \\frac{5}{2}$, so it is proportional. For $x: 1, 2, 3$ and $y: 4, 6, 8$, $\\frac{4}{1} \\ne \\frac{6}{2}$: $y$ grows steadily, but it is not proportional.",
        "表格 $x: 2, 4, 6$，$y: 5, 10, 15$ 中，每个 $\\frac{y}{x} = \\frac{5}{2}$，所以成正比例。$x: 1, 2, 3$，$y: 4, 6, 8$ 中，$\\frac{4}{1} \\ne \\frac{6}{2}$：$y$ 均匀增加，但不成正比例。",
      ),
      generate(rng) {
        const k = smallRate(rng);
        const q = Number(k.d);
        const xs = tableXs(rng, q);
        const kind = rng.int(0, 3);
        let ys = xs.map((x) => Number(k.mul(Q.of(x)).n));
        if (kind === 1) {
          const b = rng.int(1, 6);
          ys = ys.map((y) => y + b);
        } else if (kind === 2) {
          const i = rng.int(1, 3);
          ys = ys.map((y, j) => (j === i ? y + rng.pick([-1, 1]) * rng.int(1, 2) : y));
          if (ys.some((y) => y <= 0)) ys = ys.map((y) => y + 3);
        }
        const proportional = xs.every((x, i) => Q.of(ys[i]!, x).eq(Q.of(ys[0]!, xs[0]!)));
        return choiceProblem({
          prompt: t(
            `Is the relationship between $x$ and $y$ in the table proportional? $$${xyTable(xs.map(String), ys.map(String))}$$`,
            `表格中 $x$ 与 $y$ 的关系是正比例关系吗？$$${xyTable(xs.map(String), ys.map(String))}$$`,
          ),
          options: yesNo,
          correct: proportional ? 0 : 1,
          solution: proportional
            ? t(
                `Divide each $y$ by its $x$: $${quotientsLatex(xs, ys)}$. All the quotients are equal, so the relationship is proportional with $k = ${Q.of(ys[0]!, xs[0]!).toLatex()}$.`,
                `用每个 $y$ 除以对应的 $x$：$${quotientsLatex(xs, ys)}$。商都相等，所以是正比例关系，$k = ${Q.of(ys[0]!, xs[0]!).toLatex()}$。`,
              )
            : t(
                `Divide each $y$ by its $x$: $${quotientsLatex(xs, ys)}$. The quotients are not all equal, so the relationship is not proportional.`,
                `用每个 $y$ 除以对应的 $x$：$${quotientsLatex(xs, ys)}$。商不全相等，所以不是正比例关系。`,
              ),
        });
      },
    },
    {
      id: "constant-of-proportionality-from-a-table",
      title: t("The constant of proportionality", "求比例常数"),
      explanation: t(
        "In a proportional relationship, the ratio of $y$ to $x$ is the same for every pair in the table. That common ratio is the constant of proportionality $k$, and the relationship is $y = kx$.\n\nFor $x: 2, 4, 6$ and $y: 5, 10, 15$, $k = \\frac{y}{x} = \\frac{5}{2}$, so $y = \\frac{5}{2}x$. Note that $k$ is $y$ divided by $x$, not $x$ divided by $y$.",
        "在正比例关系中，表格里每一对数的 $y$ 与 $x$ 之比都相同。这个相同的比就是比例常数 $k$，关系式是 $y = kx$。\n\n对于 $x: 2, 4, 6$，$y: 5, 10, 15$，$k = \\frac{y}{x} = \\frac{5}{2}$，所以 $y = \\frac{5}{2}x$。注意 $k$ 是 $y$ 除以 $x$，不是 $x$ 除以 $y$。",
      ),
      generate(rng) {
        const k = smallRate(rng);
        const xs = tableXs(rng, Number(k.d));
        const ys = xs.map((x) => Number(k.mul(Q.of(x)).n));
        return numberProblem({
          prompt: t(
            `The table shows a proportional relationship between $x$ and $y$. What is the constant of proportionality? $$${xyTable(xs.map(String), ys.map(String))}$$`,
            `表格表示 $x$ 与 $y$ 的正比例关系。比例常数是多少？$$${xyTable(xs.map(String), ys.map(String))}$$`,
          ),
          answer: k,
          wrong: [Q.one.div(k), Q.of(ys[1]! - ys[0]!), Q.of(ys[0]! - xs[0]!), Q.of(ys[0]!)],
          solution: t(
            `$k = \\frac{y}{x} = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}$, and every other column gives the same quotient.`,
            `$k = \\frac{y}{x} = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}$，其余各列的商也都相同。`,
          ),
        });
      },
    },
    {
      id: "completing-a-proportional-table",
      title: t("Completing a proportional table", "补全正比例表格"),
      explanation: t(
        "To fill in a proportional table, first find the constant of proportionality from a complete pair. Every missing value then follows from $y = kx$.\n\nFor $x: 2, 4, 10$ and $y: 5, 10, \\square$: $k = \\frac{5}{2}$, so the missing $y$ is $\\frac{5}{2} \\times 10 = 25$. To find a missing $x$, divide its $y$ by $k$.",
        "补全正比例关系的表格时，先由一对完整的数求出比例常数，再用 $y = kx$ 求出每个缺少的值。\n\n对于 $x: 2, 4, 10$，$y: 5, 10, \\square$：$k = \\frac{5}{2}$，所以缺少的 $y$ 是 $\\frac{5}{2} \\times 10 = 25$。求缺少的 $x$，就用对应的 $y$ 除以 $k$。",
      ),
      generate(rng) {
        const k = smallRate(rng);
        const xs = tableXs(rng, Number(k.d));
        const ys = xs.map((x) => Number(k.mul(Q.of(x)).n));
        const i = rng.int(2, 3);
        const askY = rng.bool();
        const shownX = xs.map((x, j) => (j === i && !askY ? "\\square" : String(x)));
        const shownY = ys.map((y, j) => (j === i && askY ? "\\square" : String(y)));
        const answer = askY ? ys[i]! : xs[i]!;
        const step = askY ? xs[i]! - xs[i - 1]! : ys[i]! - ys[i - 1]!;
        return numberProblem({
          prompt: t(
            `The table shows a proportional relationship between $x$ and $y$. Find the missing number. $$${xyTable(shownX, shownY)}$$`,
            `表格表示 $x$ 与 $y$ 的正比例关系。求缺少的数。$$${xyTable(shownX, shownY)}$$`,
          ),
          answer,
          form: "integer",
          wrong: askY
            ? [ys[i - 1]! + step, Q.of(xs[i]!).div(k), ys[i - 1]! + (ys[1]! - ys[0]!)]
            : [xs[i - 1]! + step, Q.of(ys[i]!).mul(k), xs[i - 1]! + (xs[1]! - xs[0]!)],
          solution: askY
            ? t(
                `$k = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}$, so $y = ${k.toLatex()} \\times ${xs[i]} = ${answer}$.`,
                `$k = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}$，所以 $y = ${k.toLatex()} \\times ${xs[i]} = ${answer}$。`,
              )
            : t(
                `$k = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}$, so $x = ${ys[i]} \\div ${k.toLatex()} = ${answer}$.`,
                `$k = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}$，所以 $x = ${ys[i]} \\div ${k.toLatex()} = ${answer}$。`,
              ),
        });
      },
    },
  ],
);

/** graphView is the size of the first-quadrant grid used for proportional graphs. */
const graphView = 12;

/** relationGraph draws a graph through the origin or not, with the listed points marked. */
function relationGraph(curve: PlaneMark, points: readonly (readonly [number, number])[], alt: Text): Figure {
  const marks: PlaneMark[] = [curve, ...points.map((p): PlaneMark => ({ kind: "point", at: [p[0], p[1]], accent: true }))];
  return {
    svg: plane({ xMin: 0, xMax: graphView, yMin: 0, yMax: graphView, step: 1, labelEvery: 2 }, marks),
    alt,
  };
}

/** pointList writes points as "(1, 2), (3, 4) and (5, 6)", or with Chinese punctuation. */
const pointList = (ps: readonly (readonly [number, number])[], zh: boolean) =>
  `${ps
    .slice(0, -1)
    .map((p) => `$(${p[0]}, ${p[1]})$`)
    .join(zh ? "、" : ", ")}${zh ? " 和 " : " and "}$(${ps[ps.length - 1]![0]}, ${ps[ps.length - 1]![1]})$`;

/** understandingProportionalRelationshipsUsingGraphs recognizes proportional graphs and reads them. */
export const understandingProportionalRelationshipsUsingGraphs = topic(
  "understanding-proportional-relationships-using-graphs",
  t("Understanding Proportional Relationships Using Graphs", "用图像理解正比例关系"),
  t(
    "The graph of a proportional relationship y = kx is a straight line through the origin. The point (1, k) is on it, and for any point (x, y) on it other than the origin, k = y/x. A straight line that misses the origin, or a curve, is not proportional.",
    "正比例关系 y = kx 的图像是一条过原点的直线。点 (1, k) 在直线上；对直线上原点以外的任意一点 (x, y)，k = y/x。不过原点的直线或曲线都不是正比例关系。",
  ),
  ["understanding-proportional-relationships-using-tables", "analyzing-two-variable-equations-using-graphs"],
  ["7.RP.A.2a", "7.RP.A.2b", "7.RP.A.2d"],
  [
    {
      id: "is-the-graph-proportional",
      title: t("Is the graph proportional?", "图像是否成正比例？"),
      explanation: t(
        "A graph shows a proportional relationship only if it is a straight line and it passes through $(0, 0)$. The line through $(0, 2)$ and $(4, 6)$ is straight but misses the origin, so it is not proportional.",
        "只有当图像是直线并且经过 $(0, 0)$ 时，才表示正比例关系。过 $(0, 2)$ 和 $(4, 6)$ 的直线是直的，但不过原点，所以不是正比例关系。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const c = rng.int(2, 3);
          const shown: [number, number][] = [
            [0, 0],
            [c, c],
            [2 * c, 4 * c],
          ];
          const curve: PlaneMark = { kind: "curve", f: (x) => (x * x) / c, from: 0, accent: true };
          return {
            ...choiceProblem({
              prompt: t(
                `The graph shown passes through the points ${pointList(shown, false)}. Does it show a proportional relationship?`,
                `图中的图像经过点 ${pointList(shown, true)}。它表示正比例关系吗？`,
              ),
              options: yesNo,
              correct: 1,
              solution: t(
                `It passes through the origin, but it is not a straight line: $\\frac{${shown[1]![1]}}{${shown[1]![0]}} \\ne \\frac{${shown[2]![1]}}{${shown[2]![0]}}$. So it is not proportional.`,
                `它经过原点，但不是直线：$\\frac{${shown[1]![1]}}{${shown[1]![0]}} \\ne \\frac{${shown[2]![1]}}{${shown[2]![0]}}$。所以不是正比例关系。`,
              ),
            }),
            figure: relationGraph(
              curve,
              shown,
              t(
                `A curve through ${shown.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
                `一条经过 ${shown.map((p) => `(${p[0]}, ${p[1]})`).join("、")} 的曲线。`,
              ),
            ),
          };
        }
        const k = smallRate(rng, 3, 3);
        const q = Number(k.d);
        const p = Number(k.n);
        const b = kind === 0 || kind === 1 ? 0 : rng.int(1, 4);
        const maxM = Math.floor((graphView - b) / Math.max(p, q));
        const ms = (
          rng.sample(
            Array.from({ length: Math.max(2, maxM) }, (_, i) => i + 1),
            2,
          ) as number[]
        ).sort((x, y) => x - y);
        const pts = ms.map((m) => [m * q, m * p + b] as [number, number]).filter((pt) => pt[1] <= graphView);
        const shown: [number, number][] = [[0, b], ...pts];
        const proportional = b === 0;
        const line: PlaneMark = { kind: "line", a: [0, b], b: [q, p + b], accent: true };
        return {
          ...choiceProblem({
            prompt: t(
              `The graph shown passes through the points ${pointList(shown, false)}. Does it show a proportional relationship?`,
              `图中的图像经过点 ${pointList(shown, true)}。它表示正比例关系吗？`,
            ),
            options: yesNo,
            correct: proportional ? 0 : 1,
            solution: proportional
              ? t(
                  `It is a straight line through the origin, so it is proportional: $k = \\frac{${shown[1]![1]}}{${shown[1]![0]}} = ${k.toLatex()}$.`,
                  `它是一条过原点的直线，所以是正比例关系：$k = \\frac{${shown[1]![1]}}{${shown[1]![0]}} = ${k.toLatex()}$。`,
                )
              : t(
                  `It is a straight line, but it crosses the $y$-axis at $(0, ${b})$, not at the origin. So it is not proportional.`,
                  `它是直线，但与 $y$ 轴交于 $(0, ${b})$，不经过原点。所以不是正比例关系。`,
                ),
          }),
          figure: relationGraph(
            line,
            shown,
            t(
              `A straight line through ${shown.map((pt) => `(${pt[0]}, ${pt[1]})`).join(", ")}.`,
              `一条经过 ${shown.map((pt) => `(${pt[0]}, ${pt[1]})`).join("、")} 的直线。`,
            ),
          ),
        };
      },
    },
    {
      id: "constant-of-proportionality-from-a-graph",
      title: t("The constant of proportionality from a graph", "由图像求比例常数"),
      explanation: t(
        "The graph of a proportional relationship is a straight line through the origin. Read any point on the line other than the origin; its $y$ divided by its $x$ is the constant of proportionality.\n\nThe line of a proportional relationship passes through $(6, 4)$. Then $k = \\frac{4}{6} = \\frac{2}{3}$, and the equation is $y = \\frac{2}{3}x$.",
        "正比例关系的图像是一条经过原点的直线。读出直线上原点以外的任意一点，用它的 $y$ 除以 $x$，就是比例常数。\n\n某正比例关系的直线经过 $(6, 4)$。那么 $k = \\frac{4}{6} = \\frac{2}{3}$，方程是 $y = \\frac{2}{3}x$。",
      ),
      generate(rng) {
        const k = smallRate(rng, 6, 6);
        const [p, q] = [Number(k.n), Number(k.d)];
        const m = rng.int(1, Math.max(1, Math.floor(graphView / Math.max(p, q))));
        const [x, y] = [m * q, m * p];
        return {
          ...numberProblem({
            prompt: t(
              `The graph of a proportional relationship passes through the marked point $(${x}, ${y})$. What is the constant of proportionality $k$ in $y = kx$?`,
              `某正比例关系的图像经过标出的点 $(${x}, ${y})$。$y = kx$ 中的比例常数 $k$ 是多少？`,
            ),
            answer: k,
            wrong: [Q.of(x, y), ...(y > x ? [Q.of(y - x)] : []), Q.of(y), Q.of(x)],
            solution: t(
              `$k = \\frac{y}{x} = \\frac{${y}}{${x}} = ${k.toLatex()}$.`,
              `$k = \\frac{y}{x} = \\frac{${y}}{${x}} = ${k.toLatex()}$。`,
            ),
          }),
          figure: relationGraph(
            { kind: "line", a: [0, 0], b: [q, p], accent: true },
            [[x, y]],
            t(`A straight line through the origin and the marked point (${x}, ${y}).`, `一条经过原点和标出的点 (${x}, ${y}) 的直线。`),
          ),
        };
      },
    },
    {
      id: "meaning-of-a-point-on-the-graph",
      title: t("The meaning of a point", "图像上一点的含义"),
      explanation: t(
        "On the graph of the cost $y$ of $x$ tickets, the point $(4, 30)$ means $4$ tickets cost $\\$30$, and the point $(1, 7.5)$ means one ticket costs $\\$7.50$: $7.5$ is the unit rate.",
        "在 $x$ 张票的总价 $y$ 的图像上，点 $(4, 30)$ 表示 $4$ 张票共 $\\$30$；点 $(1, 7.5)$ 表示每张票 $\\$7.50$，$7.5$ 就是单位率。",
      ),
      generate(rng) {
        const g = rng.pick(goods);
        const u = rng.int(3, 15);
        const n = rng.int(2, 9);
        const c = n * u;
        if (rng.bool(0.6)) {
          const correct = t(`${n} ${g.many} cost $\\$${c}$.`, `${n} ${g.zh}共 $\\$${c}$。`);
          return pickChoice(
            rng,
            t(
              `The graph of a proportional relationship shows the cost $y$, in dollars, of $x$ ${g.many}. The point $(${n}, ${c})$ is on the graph. What does it mean?`,
              `某正比例关系的图像表示 $x$ ${g.zh}的总价 $y$（美元）。点 $(${n}, ${c})$ 在图像上。它表示什么？`,
            ),
            correct,
            [
              t(`${c} ${g.many} cost $\\$${n}$.`, `${c} ${g.zh}共 $\\$${n}$。`),
              t(`One ${g.one} costs $\\$${c}$.`, `每${g.zh} $\\$${c}$。`),
              t(`One ${g.one} costs $\\$${n}$.`, `每${g.zh} $\\$${n}$。`),
            ],
            t(
              `The first coordinate is the number of ${g.many} and the second is the cost, so ${n} ${g.many} cost $\\$${c}$ (one costs $\\$${c} \\div ${n} = \\$${u}$).`,
              `第一个坐标是数量，第二个坐标是总价，所以 ${n} ${g.zh}共 $\\$${c}$（每${g.zh} $\\$${c} \\div ${n} = \\$${u}$）。`,
            ),
          );
        }
        return pickChoice(
          rng,
          t(
            `The graph of a proportional relationship shows the cost $y$, in dollars, of $x$ ${g.many}. The point $(1, ${u})$ is on the graph. What does $${u}$ represent?`,
            `某正比例关系的图像表示 $x$ ${g.zh}的总价 $y$（美元）。点 $(1, ${u})$ 在图像上。$${u}$ 表示什么？`,
          ),
          t(`The price of one ${g.one}, in dollars`, `每${g.zh}的价格（美元）`),
          [
            t(`The number of ${g.many} you can buy for $\\$1$`, `$\\$1$ 能买的数量`),
            t(`The number of ${g.many} bought`, `买的数量`),
            t(`The cost of ${u} ${g.many}, in dollars`, `${u} ${g.zh}的总价（美元）`),
          ],
          t(
            `When $x = 1$, $y = ${u}$: one ${g.one} costs $\\$${u}$. This is the unit rate, the constant of proportionality.`,
            `$x = 1$ 时 $y = ${u}$：每${g.zh} $\\$${u}$。这是单位率，也就是比例常数。`,
          ),
        );
      },
    },
  ],
);

/** Situation is a description of two quantities with its parameters filled in. */
interface Situation {
  readonly text: Text;
  readonly proportional: boolean;
  readonly why: Text;
}

/** situation draws a described relationship that is proportional or not. */
function situation(rng: Rng): Situation {
  const k = rng.int(2, 15);
  const b = rng.int(2, 20);
  const kind = rng.int(0, 7);
  switch (kind) {
    case 0:
      return {
        text: t(
          `Each movie ticket costs $\\$${k + 6}$. Is the total cost proportional to the number of tickets bought?`,
          `每张电影票 $\\$${k + 6}$。总价与买的票数成正比例吗？`,
        ),
        proportional: true,
        why: t(
          `The cost is $y = ${k + 6}x$: always $\\$${k + 6}$ per ticket, and $0$ tickets cost $\\$0$.`,
          `总价 $y = ${k + 6}x$：每张总是 $\\$${k + 6}$，$0$ 张票是 $\\$0$。`,
        ),
      };
    case 1:
      return {
        text: t(
          `A car travels at a constant speed of ${k * 5} miles per hour. Is the distance traveled proportional to the time?`,
          `一辆汽车以 ${k * 5} 英里/小时的速度匀速行驶。行驶的路程与时间成正比例吗？`,
        ),
        proportional: true,
        why: t(
          `The distance is $y = ${k * 5}x$, a constant rate with no starting amount.`,
          `路程 $y = ${k * 5}x$，速率不变，也没有初始量。`,
        ),
      };
    case 2:
      return {
        text: t(
          `A worker earns $\\$${k + 10}$ per hour and no other pay. Is the pay proportional to the number of hours worked?`,
          `一名工人每小时挣 $\\$${k + 10}$，没有其他收入。工资与工作的小时数成正比例吗？`,
        ),
        proportional: true,
        why: t(
          `Yes: for $x$ hours the pay is $y = ${k + 10}x$, a constant times $x$, and $0$ hours earn $\\$0$.`,
          `成正比例：工作 $x$ 小时的工资是 $y = ${k + 10}x$，是 $x$ 的常数倍，且工作 $0$ 小时挣 $\\$0$。`,
        ),
      };
    case 3:
      return {
        text: t(
          `A printer prints ${k * 2} pages per minute. Is the number of pages printed proportional to the time?`,
          `一台打印机每分钟打印 ${k * 2} 页。打印的页数与时间成正比例吗？`,
        ),
        proportional: true,
        why: t(`The number of pages is $y = ${k * 2}x$.`, `页数 $y = ${k * 2}x$。`),
      };
    case 4:
      return {
        text: t(
          `A taxi charges $\\$${(b % 6) + 2}$ plus $\\$${(k % 4) + 1}$ per mile. Is the fare proportional to the distance?`,
          `出租车起步价 $\\$${(b % 6) + 2}$，另加每英里 $\\$${(k % 4) + 1}$。车费与路程成正比例吗？`,
        ),
        proportional: false,
        why: t(
          `The fare is $y = ${(k % 4) + 1}x + ${(b % 6) + 2}$. A ride of $0$ miles would still cost $\\$${(b % 6) + 2}$, so the fare is not proportional.`,
          `车费 $y = ${(k % 4) + 1}x + ${(b % 6) + 2}$。即使路程为 $0$，也要付 $\\$${(b % 6) + 2}$，所以不成正比例。`,
        ),
      };
    case 5:
      return {
        text: t(
          `A gym charges ${article(b * 5)} $\\$${b * 5}$ joining fee and $\\$${k + 10}$ per month. Is the total cost proportional to the number of months?`,
          `一家健身房收 $\\$${b * 5}$ 入会费，另每月 $\\$${k + 10}$。总费用与月数成正比例吗？`,
        ),
        proportional: false,
        why: t(
          `The cost is $y = ${k + 10}x + ${b * 5}$. Because of the joining fee, $y \\div x$ is not constant.`,
          `总费用 $y = ${k + 10}x + ${b * 5}$。由于有入会费，$y \\div x$ 不是常数。`,
        ),
      };
    case 6:
      return {
        text: t(
          `A candle is ${b + 20} centimeters tall and burns down ${(k % 3) + 1} ${k % 3 === 0 ? "centimeter" : "centimeters"} per hour. Is its height proportional to the time it has burned?`,
          `一支蜡烛高 ${b + 20} 厘米，每小时燃烧 ${(k % 3) + 1} 厘米。它的高度与燃烧时间成正比例吗？`,
        ),
        proportional: false,
        why: t(
          `The height is $y = ${b + 20} - ${k % 3 === 0 ? "" : (k % 3) + 1}x$. It decreases from ${b + 20}, and at time $0$ it is not $0$, so it is not proportional.`,
          `高度 $y = ${b + 20} - ${k % 3 === 0 ? "" : (k % 3) + 1}x$，从 ${b + 20} 开始减少，时间为 $0$ 时高度不为 $0$，所以不成正比例。`,
        ),
      };
    default:
      return {
        text: t(
          `A pool already holds ${b * 50} gallons of water and is filled at ${k * 5} gallons per minute. Is the amount of water in the pool proportional to the time?`,
          `一个水池里已有 ${b * 50} 加仑水，又以每分钟 ${k * 5} 加仑的速度注水。池中的水量与时间成正比例吗？`,
        ),
        proportional: false,
        why: t(
          `The amount is $y = ${k * 5}x + ${b * 50}$. At time $0$ there are already ${b * 50} gallons, so it is not proportional.`,
          `水量 $y = ${k * 5}x + ${b * 50}$。时间为 $0$ 时已有 ${b * 50} 加仑，所以不成正比例。`,
        ),
      };
  }
}

/** understandingProportionalRelationshipsFromDescriptions recognizes proportional situations and writes y = kx. */
export const understandingProportionalRelationshipsFromDescriptions = topic(
  "understanding-proportional-relationships-from-descriptions",
  t("Understanding Proportional Relationships From Descriptions", "由文字描述理解正比例关系"),
  t(
    "A situation is proportional when one quantity is always the same number of times the other: a fixed price per item, a constant speed, a fixed pay per hour. A starting amount or a fixed fee breaks proportionality. A proportional relationship is written y = kx, where k is the amount for one unit.",
    "如果一个量总是另一个量的同一倍数，例如单价固定、速度不变、时薪固定，那么它们成正比例。有初始量或固定费用就不成正比例。正比例关系写作 y = kx，k 是 1 个单位对应的量。",
  ),
  ["understanding-proportional-relationships-using-tables"],
  ["7.RP.A.2a", "7.RP.A.2c"],
  [
    {
      id: "is-the-situation-proportional",
      title: t("Is the situation proportional?", "情境是否成正比例？"),
      explanation: t(
        "A situation is proportional when one quantity is always the same multiple of the other, so zero of one goes with zero of the other. A fixed starting amount, such as a fee paid up front, breaks proportionality.\n\nTickets at $\\$8$ each: cost $y = 8x$, proportional. A taxi at $\\$3$ plus $\\$2$ per mile: $y = 2x + 3$, not proportional, because the $\\$3$ is paid even for $0$ miles.",
        "如果一个量总是另一个量的同一倍数，这个情境就是正比例关系，此时一个量为零，另一个量也为零。固定的起始量，比如预先支付的费用，会使它不成正比例。\n\n每张票 $\\$8$：总价 $y = 8x$，成正比例。出租车起步价 $\\$3$，每英里 $\\$2$：$y = 2x + 3$，不成正比例，因为路程为 $0$ 也要付 $\\$3$。",
      ),
      generate(rng) {
        const s = situation(rng);
        return choiceProblem({ prompt: s.text, options: yesNo, correct: s.proportional ? 0 : 1, solution: s.why });
      },
    },
    {
      id: "writing-the-equation-of-a-proportional-relationship",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        "The equation of a proportional relationship is $y = kx$, where $k$ is the amount of $y$ for one unit of $x$. If a rate is not given directly, divide a known $y$ by its $x$ to find $k$.\n\nPears cost $\\$1.25$ per pound, so the cost of $x$ pounds is $y = 1.25x$. If instead $4$ pounds cost $\\$5$, first find $k = 5 \\div 4 = 1.25$.",
        "正比例关系的方程是 $y = kx$，其中 $k$ 是每一个单位的 $x$ 所对应的 $y$。如果没有直接给出单位率，就用已知的 $y$ 除以对应的 $x$ 求 $k$。\n\n梨每磅 $\\$1.25$，所以 $x$ 磅的价钱是 $y = 1.25x$。如果已知 $4$ 磅 $\\$5$，就先求 $k = 5 \\div 4 = 1.25$。",
      ),
      generate(rng) {
        const b = rng.pick(bulks.slice(0, 5));
        const u = 5 * rng.int(10, 120);
        const k = dec(cq(u));
        if (rng.bool()) {
          return expressionProblem({
            prompt: t(
              `${capitalized(b.en)} ${b.plural ? "cost" : "costs"} $${usd(u)}$ per ${b.unit}. Write an equation for the cost $y$, in dollars, of $x$ ${b.units}.`,
              `${b.zh}每${b.zhUnit} $${usd(u)}$。写出 $x$ ${b.zhUnit}${b.zh}的价钱 $y$（美元）的方程。`,
            ),
            answer: `${k}x`,
            prefix: "y =",
            wrong: [`\\frac{x}{${k}}`, `x + ${k}`, `${k}`],
            solution: t(`The cost is the price per ${b.unit} times the amount: $y = ${k}x$.`, `价钱等于单价乘数量：$y = ${k}x$。`),
          });
        }
        const n = rng.int(2, 9);
        return expressionProblem({
          prompt: t(
            `${n} ${b.units} of ${b.en} cost $${usd(n * u)}$, and the cost is proportional to the amount. Write an equation for the cost $y$, in dollars, of $x$ ${b.units}.`,
            `${n} ${b.zhUnit}${b.zh}售价 $${usd(n * u)}$，价钱与数量成正比例。写出 $x$ ${b.zhUnit}${b.zh}的价钱 $y$（美元）的方程。`,
          ),
          answer: `${k}x`,
          prefix: "y =",
          wrong: [`${dec(cq(n * u))}x`, `\\frac{${n}}{${dec(cq(n * u))}}x`, `x + ${k}`, `${n}x`],
          solution: t(
            `$k = ${dec(cq(n * u))} \\div ${n} = ${k}$, so $y = ${k}x$.`,
            `$k = ${dec(cq(n * u))} \\div ${n} = ${k}$，所以 $y = ${k}x$。`,
          ),
        });
      },
    },
  ],
);

/** Job is a proportional situation with a rate per unit, used for interpreting y = kx. */
interface Job {
  /** what describes y in terms of x, such as "the pay $y$, in dollars, for $x$ hours of work". */
  readonly what: Text;
  readonly k: (k: string) => Text;
  readonly askY: (x: string) => Text;
  readonly askX: (y: string) => Text;
  readonly money: boolean;
}

const jobs: readonly Job[] = [
  {
    what: t("the pay $y$, in dollars, for $x$ hours of work", "工作 $x$ 小时的工资 $y$（美元）"),
    k: (k) => t(`the pay for one hour of work, $\\$${k}$`, `每小时的工资 $\\$${k}$`),
    askY: (x) => t(`How much is earned in $${x}$ hours, in dollars?`, `工作 $${x}$ 小时挣多少美元？`),
    askX: (y) => t(`How many hours of work does it take to earn $\\$${y}$?`, `挣 $\\$${y}$ 需要工作多少小时？`),
    money: true,
  },
  {
    what: t("the distance $y$, in miles, a train travels in $x$ hours", "火车行驶 $x$ 小时的路程 $y$（英里）"),
    k: (k) => t(`the distance traveled in one hour, $${k}$ miles`, `每小时行驶的路程 $${k}$ 英里`),
    askY: (x) => t(`How many miles does it travel in $${x}$ hours?`, `$${x}$ 小时行驶多少英里？`),
    askX: (y) => t(`How many hours does it take to travel $${y}$ miles?`, `行驶 $${y}$ 英里需要多少小时？`),
    money: false,
  },
  {
    what: t("the cost $y$, in dollars, of $x$ museum tickets", "购买 $x$ 张博物馆门票的价钱 $y$（美元）"),
    k: (k) => t(`the price of one museum ticket, $\\$${k}$`, `每张博物馆门票的价钱 $\\$${k}$`),
    askY: (x) => t(`How much do $${x}$ tickets cost, in dollars?`, `$${x}$ 张门票要多少美元？`),
    askX: (y) => t(`How many tickets can be bought for $\\$${y}$?`, `$\\$${y}$ 能买多少张门票？`),
    money: true,
  },
];

/** interpretingDataFromProportionalRelationships uses y = kx in context and compares two relationships. */
export const interpretingDataFromProportionalRelationships = topic(
  "interpreting-data-from-proportional-relationships",
  t("Interpreting Data From Proportional Relationships", "解读正比例关系中的数据"),
  t(
    "In y = kx, the constant k is the amount of y for one unit of x. Multiply by k to find y from x, divide by k to find x from y, and compare two proportional relationships by comparing their constants, wherever they come from: an equation, a table or a description.",
    "在 y = kx 中，常数 k 是 x 为 1 个单位时 y 的量。由 x 求 y 就乘 k，由 y 求 x 就除以 k。比较两个正比例关系，就比较它们的常数，不论它们来自方程、表格还是文字描述。",
  ),
  ["understanding-proportional-relationships-using-graphs", "understanding-proportional-relationships-from-descriptions"],
  ["7.RP.A.2b", "7.RP.A.2c", "7.RP.A.2d"],
  [
    {
      id: "using-the-equation-in-context",
      title: t("Using the equation", "运用方程"),
      explanation: t(
        "The equation $y = kx$ works in both directions. To find $y$ for a given $x$, multiply by $k$; to find the $x$ that gives a certain $y$, divide by $k$.\n\nIf $y = 14.5x$ gives the pay for $x$ hours, $6$ hours pay $14.5 \\times 6 = \\$87$, and earning $\\$116$ takes $116 \\div 14.5 = 8$ hours.",
        "方程 $y = kx$ 可以双向使用。已知 $x$ 求 $y$，就乘 $k$；已知 $y$ 求对应的 $x$，就除以 $k$。\n\n如果 $y = 14.5x$ 表示工作 $x$ 小时的工资，那么 $6$ 小时挣 $14.5 \\times 6 = \\$87$，挣 $\\$116$ 需要 $116 \\div 14.5 = 8$ 小时。",
      ),
      generate(rng) {
        const job = rng.pick(jobs);
        const kq = job.money ? Q.of(rng.int(16, 60), 2) : Q.of(rng.int(8, 20) * 5);
        const k = dec(kq);
        const x = rng.int(2, 12);
        const y = kq.mul(Q.of(x));
        const head = t(`The equation $y = ${k}x$ gives ${job.what.en}.`, `方程 $y = ${k}x$ 表示${job.what["zh-CN"]}。`);
        if (rng.bool()) {
          const ask = job.askY(String(x));
          return numberProblem({
            prompt: t(`${head.en} ${ask.en}`, `${head["zh-CN"]}${ask["zh-CN"]}`),
            answer: y,
            form: "decimal",
            wrong: [kq.div(Q.of(x)), kq.add(Q.of(x)), Q.of(x).div(kq)],
            solution: t(
              `Substitute $x = ${x}$ into the equation: $y = ${k} \\times ${x} = ${dec(y)}$.`,
              `把 $x = ${x}$ 代入方程：$y = ${k} \\times ${x} = ${dec(y)}$。`,
            ),
          });
        }
        const ask = job.askX(dec(y));
        return numberProblem({
          prompt: t(`${head.en} ${ask.en}`, `${head["zh-CN"]}${ask["zh-CN"]}`),
          answer: x,
          form: "decimal",
          wrong: [y.mul(kq), y.sub(kq), kq.div(y)],
          solution: t(
            `Solve $${dec(y)} = ${k}x$: $x = ${dec(y)} \\div ${k} = ${x}$.`,
            `解 $${dec(y)} = ${k}x$：$x = ${dec(y)} \\div ${k} = ${x}$。`,
          ),
        });
      },
    },
    {
      id: "meaning-of-the-constant",
      title: t("The meaning of the constant", "常数的含义"),
      explanation: t(
        "In $y = 2.5x$, where $y$ is the cost of $x$ pounds of apples, $2.5$ is the cost of one pound: $\\$2.50$.",
        "在 $y = 2.5x$ 中，$y$ 是 $x$ 磅苹果的价钱，$2.5$ 是每磅的价钱：$\\$2.50$。",
      ),
      generate(rng) {
        const job = rng.pick(jobs);
        const kq = job.money ? Q.of(rng.int(16, 60), 2) : Q.of(rng.int(8, 20) * 5);
        const k = dec(kq);
        const wrongs: Text[] = [
          t("The amount of $x$ for one unit of $y$", "$y$ 为 1 个单位时 $x$ 的量"),
          t(`The value of $y$ when $x = ${k}$`, `$x = ${k}$ 时 $y$ 的值`),
          t(`The value of $x$ when $y = ${k}$`, `$y = ${k}$ 时 $x$ 的值`),
        ];
        return pickChoice(
          rng,
          t(
            `The equation $y = ${k}x$ gives ${job.what.en}. What does $${k}$ represent?`,
            `方程 $y = ${k}x$ 表示${job.what["zh-CN"]}。$${k}$ 表示什么？`,
          ),
          t(capitalized(job.k(k).en), job.k(k)["zh-CN"]),
          wrongs,
          t(
            `When $x = 1$, $y = ${k}$, so $${k}$ is the value of $y$ for one unit of $x$: ${job.k(k).en}.`,
            `$x = 1$ 时 $y = ${k}$，所以 $${k}$ 是 $x$ 为 1 个单位时 $y$ 的值：${job.k(k)["zh-CN"]}。`,
          ),
        );
      },
    },
    {
      id: "comparing-two-proportional-relationships",
      title: t("Comparing two relationships", "比较两个正比例关系"),
      explanation: t(
        "Printer A prints $y = 12x$ pages in $x$ minutes. Printer B prints $35$ pages in $3$ minutes, $\\frac{35}{3} = 11\\frac{2}{3}$ pages per minute. Printer A is faster.",
        "打印机 A $x$ 分钟打印 $y = 12x$ 页。打印机 B $3$ 分钟打印 $35$ 页，每分钟 $\\frac{35}{3} = 11\\frac{2}{3}$ 页。打印机 A 更快。",
      ),
      generate(rng) {
        const ka = rng.int(8, 30);
        let n: number, pages: number;
        do {
          n = rng.int(2, 6);
          pages = rng.int(ka * n - 6, ka * n + 6);
        } while (pages <= 0);
        const kb = Q.of(pages, n);
        const c = Q.of(ka).cmp(kb);
        const correct = c > 0 ? 0 : c < 0 ? 1 : 2;
        const sym = c > 0 ? ">" : c < 0 ? "<" : "=";
        return choiceProblem({
          prompt: t(
            `Printer A prints $y = ${ka}x$ pages in $x$ minutes. Printer B prints ${pages} pages in ${n} minutes, at a constant rate. Which printer is faster?`,
            `打印机 A $x$ 分钟打印 $y = ${ka}x$ 页。打印机 B 匀速打印，${n} 分钟打印 ${pages} 页。哪台打印机更快？`,
          ),
          options: [t("Printer A", "打印机 A"), t("Printer B", "打印机 B"), t("They are equally fast", "一样快")],
          correct,
          solution: t(
            `Printer A prints $${ka}$ pages per minute. Printer B prints $\\frac{${pages}}{${n}} = ${mixedLatex(kb)}$ pages per minute. $${ka} ${sym} ${mixedLatex(kb)}$.`,
            `打印机 A 每分钟打印 $${ka}$ 页，打印机 B 每分钟打印 $\\frac{${pages}}{${n}} = ${mixedLatex(kb)}$ 页。$${ka} ${sym} ${mixedLatex(kb)}$。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Percentage increase and decrease

/** multiplier writes 1 + p/100 as a decimal: 15 → "1.15", −20 → "0.8". */
const multiplier = (p: number) => dec(Q.of(100 + p, 100));

/** ChangeContext is a quantity that changes by a percentage. */
interface ChangeContext {
  readonly start: (n: number) => Text;
  readonly up: (p: number) => Text;
  readonly down: (p: number) => Text;
  readonly askNew: Text;
  readonly askOld: Text;
  /** isNow states the value after the change as part of a sentence. */
  readonly isNow: (n: string) => Text;
  /** now states the value after the change as a sentence of its own. */
  readonly now: (n: string) => Text;
  /** size draws a realistic starting value, a multiple of 20 so that any multiple of 5 percent of it is whole. */
  readonly size: (rng: Rng) => number;
  /** maxUp is the largest realistic percentage increase, a multiple of 5. */
  readonly maxUp: number;
}

const changeContexts: readonly ChangeContext[] = [
  {
    start: (n) => t(`A bike costs $\\$${n}$.`, `一辆自行车售价 $\\$${n}$。`),
    up: (p) => t(`Its price increases by $${p}\\%$.`, `价格上涨了 $${p}\\%$。`),
    down: (p) => t(`Its price decreases by $${p}\\%$.`, `价格下降了 $${p}\\%$。`),
    askNew: t("What is the new price, in dollars?", "新价格是多少美元？"),
    askOld: t("What was the original price, in dollars?", "原价是多少美元？"),
    isNow: (n) => t(`the price of a bike is now $\\$${n}$`, `一辆自行车现在售价 $\\$${n}$`),
    now: (n) => t(`Now it costs $\\$${n}$.`, `现在售价 $\\$${n}$。`),
    size: (rng) => 20 * rng.int(5, 40),
    maxUp: 50,
  },
  {
    start: (n) => t(`A town has ${n} residents.`, `某镇有 ${n} 名居民。`),
    up: (p) => t(`Its population grows by $${p}\\%$.`, `人口增长了 $${p}\\%$。`),
    down: (p) => t(`Its population falls by $${p}\\%$.`, `人口减少了 $${p}\\%$。`),
    askNew: t("How many residents does it have now?", "现在有多少名居民？"),
    askOld: t("How many residents did it have before?", "原来有多少名居民？"),
    isNow: (n) => t(`a town now has ${n} residents`, `某镇现在有 ${n} 名居民`),
    now: (n) => t(`Now it has ${n} residents.`, `现在有 ${n} 名居民。`),
    size: (rng) => 20 * rng.int(50, 600),
    maxUp: 150,
  },
  {
    start: (n) => t(`Leo earns $\\$${n}$ a week.`, `Leo 每周挣 $\\$${n}$。`),
    up: (p) => t(`His weekly pay increases by $${p}\\%$.`, `他的周薪提高了 $${p}\\%$。`),
    down: (p) => t(`His weekly pay decreases by $${p}\\%$.`, `他的周薪降低了 $${p}\\%$。`),
    askNew: t("How much does he earn a week now, in dollars?", "他现在每周挣多少美元？"),
    askOld: t("How much did he earn a week before, in dollars?", "他原来每周挣多少美元？"),
    isNow: (n) => t(`Leo now earns $\\$${n}$ a week`, `Leo 现在每周挣 $\\$${n}$`),
    now: (n) => t(`Now he earns $\\$${n}$ a week.`, `现在他每周挣 $\\$${n}$。`),
    size: (rng) => 20 * rng.int(15, 60),
    maxUp: 40,
  },
  {
    start: (n) => t(`A school library has ${n} books.`, `学校图书馆有 ${n} 本书。`),
    up: (p) => t(`The number of books increases by $${p}\\%$.`, `书的数量增加了 $${p}\\%$。`),
    down: (p) => t(`The number of books decreases by $${p}\\%$.`, `书的数量减少了 $${p}\\%$。`),
    askNew: t("How many books does it have now?", "现在有多少本书？"),
    askOld: t("How many books did it have before?", "原来有多少本书？"),
    isNow: (n) => t(`a school library now has ${n} books`, `学校图书馆现在有 ${n} 本书`),
    now: (n) => t(`Now it has ${n} books.`, `现在有 ${n} 本书。`),
    size: (rng) => 20 * rng.int(25, 200),
    maxUp: 150,
  },
];

/** join puts two sentences together in both languages. */
const join = (...parts: readonly Text[]) => t(parts.map((p) => p.en).join(" "), parts.map((p) => p["zh-CN"]).join(""));

/** percentStart draws a starting value that is a multiple of 20 so that any multiple of 5 percent of it is whole. */
const percentStart = (rng: Rng) => 20 * rng.int(2, 45);

/** multiplierProblem asks which expression applies a percentage change. */
function multiplierProblem(rng: Rng, up: boolean): ReturnType<typeof pickChoice> {
  const n = percentStart(rng);
  const p = 5 * rng.int(1, 19);
  const s = up ? p : -p;
  const correct = mathText(`${n} \\times ${multiplier(s)}`);
  const wrong = [
    mathText(`${n} \\times ${dec(Q.of(p, 100))}`),
    mathText(`${n} \\times ${multiplier(-s)}`),
    mathText(`${n} ${up ? "+" : "-"} ${dec(Q.of(p, 100))}`),
    ...(p < 10 ? [mathText(`${n} \\times ${dec(Q.of(10 + (up ? p : -p), 10))}`)] : []),
  ];
  return pickChoice(
    rng,
    t(
      `Which expression gives the result of ${up ? "increasing" : "decreasing"} $${n}$ by $${p}\\%$?`,
      `哪个式子表示把 $${n}$ ${up ? "增加" : "减少"} $${p}\\%$ 的结果？`,
    ),
    correct,
    rng.shuffle(wrong),
    t(
      `After ${up ? "an increase" : "a decrease"} of $${p}\\%$, the result is $100\\% ${up ? "+" : "-"} ${p}\\% = ${100 + s}\\%$ of the original, and $${100 + s}\\% = ${multiplier(s)}$. So the expression is $${n} \\times ${multiplier(s)}$.`,
      `${up ? "增加" : "减少"} $${p}\\%$ 后，结果是原来的 $100\\% ${up ? "+" : "-"} ${p}\\% = ${100 + s}\\%$，而 $${100 + s}\\% = ${multiplier(s)}$。所以式子是 $${n} \\times ${multiplier(s)}$。`,
    ),
  );
}

/** changeProblem applies a percentage increase or decrease in context. */
function changeProblem(rng: Rng, up: boolean) {
  const c = rng.pick(changeContexts);
  const n = c.size(rng);
  const p = 5 * rng.int(1, up ? c.maxUp / 5 : 19);
  const s = up ? p : -p;
  const change = (n * p) / 100;
  const answer = (n * (100 + s)) / 100;
  return numberProblem({
    prompt: join(c.start(n), up ? c.up(p) : c.down(p), c.askNew),
    answer,
    form: "integer",
    wrong: [change, up ? n + p : n - p, (n * (100 - s)) / 100],
    solution: t(
      `The ${up ? "increase" : "decrease"} is $${p}\\%$ of $${n}$: $${dec(Q.of(p, 100))} \\times ${n} = ${change}$. So the new value is $${n} ${up ? "+" : "-"} ${change} = ${answer}$, which is also $${n} \\times ${multiplier(s)}$.`,
      `${up ? "增加" : "减少"}的量是 $${n}$ 的 $${p}\\%$：$${dec(Q.of(p, 100))} \\times ${n} = ${change}$。所以新值是 $${n} ${up ? "+" : "-"} ${change} = ${answer}$，也等于 $${n} \\times ${multiplier(s)}$。`,
    ),
  });
}

/** applyingPercentageIncreases increases a quantity by a percentage. */
export const applyingPercentageIncreases = topic(
  "applying-percentage-increases",
  t("Applying Percentage Increases", "百分比增加"),
  t(
    "To increase a quantity by p%, add p% of it, or multiply it by (100 + p)% at once: increasing 240 by 15% gives 240 + 36 = 276, the same as 240 × 1.15.",
    "把一个量增加 p%，就加上它的 p%，或者直接乘 (100 + p)%：240 增加 15% 得 240 + 36 = 276，等于 240 × 1.15。",
  ),
  ["finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems", "converting-between-percentages-and-decimals"],
  ["7.RP.A.3"],
  [
    {
      id: "the-multiplier-for-an-increase",
      title: t("The multiplier for an increase", "增加时乘的数"),
      explanation: t(
        "Increasing by $15\\%$ leaves $100\\% + 15\\% = 115\\%$ of the original, so multiply by $1.15$. Multiplying by $0.15$ gives only the increase.",
        "增加 $15\\%$ 后是原来的 $100\\% + 15\\% = 115\\%$，所以乘 $1.15$。乘 $0.15$ 得到的只是增加的量。",
      ),
      generate: (rng) => multiplierProblem(rng, true),
    },
    {
      id: "increasing-a-quantity",
      title: t("Increasing a quantity", "增加一个量"),
      explanation: t(
        "To increase a quantity by a percentage, find that percentage of the quantity and add it to the original. The same result comes from multiplying by $1$ plus the rate written as a decimal.\n\nA $\\$240$ price increases by $15\\%$: the increase is $0.15 \\times 240 = 36$, so the new price is $240 + 36 = \\$276$.",
        "把一个量增加百分之几，先求出这个量的百分之几，再加到原来的量上。也可以直接乘以 $1$ 加上用小数表示的增长率，结果相同。\n\n$\\$240$ 的价格上涨 $15\\%$：上涨的量是 $0.15 \\times 240 = 36$，所以新价格是 $240 + 36 = \\$276$。",
      ),
      generate: (rng) => changeProblem(rng, true),
    },
  ],
);

/** applyingPercentageDecreases decreases a quantity by a percentage. */
export const applyingPercentageDecreases = topic(
  "applying-percentage-decreases",
  t("Applying Percentage Decreases", "百分比减少"),
  t(
    "To decrease a quantity by p%, subtract p% of it, or multiply it by (100 − p)% at once: decreasing 240 by 15% gives 240 − 36 = 204, the same as 240 × 0.85.",
    "把一个量减少 p%，就减去它的 p%，或者直接乘 (100 − p)%：240 减少 15% 得 240 − 36 = 204，等于 240 × 0.85。",
  ),
  ["applying-percentage-increases"],
  ["7.RP.A.3"],
  [
    {
      id: "the-multiplier-for-a-decrease",
      title: t("The multiplier for a decrease", "减少时乘的数"),
      explanation: t(
        "After a decrease, what remains is the whole, $100\\%$, minus the percentage taken away. Write that remaining percentage as a decimal; multiplying by it gives the new value in one step.\n\nDecreasing by $15\\%$ leaves $100\\% - 15\\% = 85\\%$ of the original, so multiply by $0.85$, not by $0.15$.",
        "减少之后，剩下的是整体 $100\\%$ 减去减少的百分数。把剩下的百分数写成小数，乘它就能一步得到新的值。\n\n减少 $15\\%$ 后剩下原来的 $100\\% - 15\\% = 85\\%$，所以乘 $0.85$，而不是 $0.15$。",
      ),
      generate: (rng) => multiplierProblem(rng, false),
    },
    {
      id: "decreasing-a-quantity",
      title: t("Decreasing a quantity", "减少一个量"),
      explanation: t(
        "To decrease a quantity by a percentage, find that percentage of the quantity and subtract it from the original. The same result comes from multiplying by $1$ minus the rate.\n\nA town of $240$ residents shrinks by $15\\%$: it loses $0.15 \\times 240 = 36$ residents, leaving $240 - 36 = 204$.",
        "把一个量减少百分之几，先求出这个量的百分之几，再从原来的量中减去。也可以直接乘以 $1$ 减去减少率，结果相同。\n\n一个 $240$ 人的镇人口减少 $15\\%$：减少 $0.15 \\times 240 = 36$ 人，剩下 $240 - 36 = 204$ 人。",
      ),
      generate: (rng) => changeProblem(rng, false),
    },
  ],
);

/** percentChangeProblem asks for the percentage change from an old value to a new one. */
function percentChangeProblem(rng: Rng, up: boolean) {
  const c = rng.pick(changeContexts);
  const old = c.size(rng);
  const p = 5 * rng.int(1, up ? c.maxUp / 5 : 19);
  const s = up ? p : -p;
  const now = (old * (100 + s)) / 100;
  const diff = Math.abs(now - old);
  return numberProblem({
    prompt: join(
      c.start(old),
      c.now(String(now)),
      t(`What is the percentage ${up ? "increase" : "decrease"}?`, `${up ? "增加" : "减少"}了百分之几？`),
    ),
    answer: p,
    percent: true,
    wrong: [Q.of(diff * 100, now), diff, Q.of(now * 100, old), ...(p < 100 ? [100 - p] : [])],
    solution: t(
      `The change is $${Math.max(now, old)} - ${Math.min(now, old)} = ${diff}$. Divide by the original value: $\\frac{${diff}}{${old}} = ${dec(Q.of(p, 100))} = ${p}\\%$.`,
      `变化量是 $${Math.max(now, old)} - ${Math.min(now, old)} = ${diff}$。除以原来的值：$\\frac{${diff}}{${old}} = ${dec(Q.of(p, 100))} = ${p}\\%$。`,
    ),
  });
}

/** calculatingPercentageChange finds a percentage increase or decrease from the old and new values. */
export const calculatingPercentageChange = topic(
  "calculating-percentage-change",
  t("Calculating Percentage Change", "计算百分比变化"),
  t(
    "Percentage change = (new − original) ÷ original × 100%. From 80 to 92 is an increase of 12 ÷ 80 = 15%; from 80 to 68 is a decrease of 12 ÷ 80 = 15%. Always divide by the original value.",
    "百分比变化 = (新值 − 原值) ÷ 原值 × 100%。从 80 变到 92 增加了 12 ÷ 80 = 15%；从 80 变到 68 减少了 12 ÷ 80 = 15%。一定要除以原值。",
  ),
  ["applying-percentage-decreases", "finding-a-percentage-given-two-numbers-word-problems"],
  ["7.RP.A.3"],
  [
    {
      id: "percentage-increase",
      title: t("Percentage increase", "增加的百分比"),
      explanation: t(
        "The percentage change compares the amount of change with the original value. Divide the increase by the original, not by the new value, and write the result as a percentage.\n\nA price rises from $\\$80$ to $\\$92$. The increase is $\\$12$, and $\\frac{12}{80} = 0.15$, an increase of $15\\%$.",
        "百分比变化是把变化的量与原来的值相比较。用增加的量除以原来的值，而不是除以新的值，再把结果写成百分数。\n\n价格从 $\\$80$ 涨到 $\\$92$。上涨 $\\$12$，$\\frac{12}{80} = 0.15$，即上涨了 $15\\%$。",
      ),
      generate: (rng) => percentChangeProblem(rng, true),
    },
    {
      id: "percentage-decrease",
      title: t("Percentage decrease", "减少的百分比"),
      explanation: t(
        "A population falls from $80$ to $68$. The decrease is $12$, and $\\frac{12}{80} = 0.15$, a decrease of $15\\%$. Dividing by the new value, $68$, would be wrong.",
        "人口从 $80$ 减少到 $68$。减少了 $12$，$\\frac{12}{80} = 0.15$，即减少了 $15\\%$。除以新值 $68$ 是错误的。",
      ),
      generate: (rng) => percentChangeProblem(rng, false),
    },
  ],
);

/** originalProblem finds the original value from the value after a percentage change. */
function originalProblem(rng: Rng, up: boolean) {
  const c = rng.pick(changeContexts);
  const old = c.size(rng);
  const p = 5 * rng.int(1, up ? Math.min(20, c.maxUp / 5) : 16);
  const s = up ? p : -p;
  const now = (old * (100 + s)) / 100;
  const isNow = c.isNow(String(now));
  return numberProblem({
    prompt: t(
      `After ${up ? "an increase" : "a decrease"} of $${p}\\%$, ${isNow.en}. ${c.askOld.en}`,
      `${up ? "增加" : "减少"} $${p}\\%$ 后，${isNow["zh-CN"]}。${c.askOld["zh-CN"]}`,
    ),
    answer: old,
    form: "integer",
    wrong: [...(p < 100 ? [Q.of(now * (100 - s), 100)] : []), up ? now - p : now + p, Q.of(now * 100, p)],
    solution: t(
      `The new value is $${100 + s}\\%$ of the original $x$: $${multiplier(s)}x = ${now}$, so $x = ${now} \\div ${multiplier(s)} = ${old}$. Taking $${p}\\%$ of $${now}$ would use the wrong base.`,
      `新值是原值 $x$ 的 $${100 + s}\\%$：$${multiplier(s)}x = ${now}$，所以 $x = ${now} \\div ${multiplier(s)} = ${old}$。用 $${now}$ 的 $${p}\\%$ 来算就用错了基准。`,
    ),
  });
}

/** originalEquationProblem asks which equation gives the original value. */
function originalEquationProblem(rng: Rng, up: boolean) {
  const old = percentStart(rng);
  const p = 5 * rng.int(1, up ? 20 : 16);
  const s = up ? p : -p;
  const now = (old * (100 + s)) / 100;
  return pickChoice(
    rng,
    t(
      `A number $x$ ${up ? "increased" : "decreased"} by $${p}\\%$ gives $${now}$. Which equation can be solved to find $x$?`,
      `一个数 $x$ ${up ? "增加" : "减少"} $${p}\\%$ 后得到 $${now}$。解哪个方程可以求出 $x$？`,
    ),
    mathText(`${multiplier(s)}x = ${now}`),
    [
      mathText(`x = ${multiplier(s)} \\times ${now}`),
      mathText(`${multiplier(-s)}x = ${now}`),
      mathText(`${dec(Q.of(p, 100))}x = ${now}`),
      mathText(`x ${up ? "+" : "-"} ${dec(Q.of(p, 100))} = ${now}`),
    ],
    t(
      `$${now}$ is $${100 + s}\\%$ of $x$, so $${multiplier(s)}x = ${now}$ (which gives $x = ${old}$).`,
      `$${now}$ 是 $x$ 的 $${100 + s}\\%$，所以 $${multiplier(s)}x = ${now}$（解得 $x = ${old}$）。`,
    ),
  );
}

/** findingOriginalValuesFromPercentageIncreases undoes a percentage increase. */
export const findingOriginalValuesFromPercentageIncreases = topic(
  "finding-original-values-from-percentage-increases",
  t("Finding Original Values From Percentage Increases", "由百分比增加求原值"),
  t(
    "After a p% increase, the new value is (100 + p)% of the original x. So if a price is \\$276 after a 15% increase, 1.15x = 276 and x = 276 ÷ 1.15 = 240. Subtracting 15% of 276 does not give the original.",
    "增加 p% 后，新值是原值 x 的 (100 + p)%。所以如果价格上涨 15% 后是 \\$276，那么 1.15x = 276，x = 276 ÷ 1.15 = 240。减去 276 的 15% 得不到原值。",
  ),
  ["applying-percentage-increases", "finding-a-total-given-a-part-and-a-percentage"],
  ["7.RP.A.3"],
  [
    {
      id: "the-equation-for-the-original-after-an-increase",
      title: t("Writing the equation", "列方程"),
      explanation: t(
        "Call the unknown original value $x$. An increase multiplies it by $1$ plus the rate, so the new value equals that multiplier times $x$.\n\nA number increased by $15\\%$ gives $276$: $1.15x = 276$.",
        "设未知的原来的值为 $x$。增加相当于把它乘以 $1$ 加上增长率，所以新的值等于这个倍数乘 $x$。\n\n一个数增加 $15\\%$ 后得 $276$：$1.15x = 276$。",
      ),
      generate: (rng) => originalEquationProblem(rng, true),
    },
    {
      id: "original-value-after-an-increase",
      title: t("Finding the original value", "求原值"),
      explanation: t(
        "To undo an increase, divide the new value by the multiplier. Subtracting the percentage of the new value does not work, because the percentage was taken of the original.\n\nAfter a $15\\%$ increase a price is $\\$276$: $1.15x = 276$, so $x = 276 \\div 1.15 = \\$240$.",
        "要还原一次增加，就用新的值除以倍数。从新的值中减去它的百分之几是不对的，因为百分数是针对原来的值算的。\n\n上涨 $15\\%$ 后价格是 $\\$276$：$1.15x = 276$，所以 $x = 276 \\div 1.15 = \\$240$。",
      ),
      generate: (rng) => originalProblem(rng, true),
    },
  ],
);

/** findingOriginalValuesFromPercentageDecreases undoes a percentage decrease. */
export const findingOriginalValuesFromPercentageDecreases = topic(
  "finding-original-values-from-percentage-decreases",
  t("Finding Original Values From Percentage Decreases", "由百分比减少求原值"),
  t(
    "After a p% decrease, the new value is (100 − p)% of the original x. If a town has 204 residents after a 15% decrease, 0.85x = 204 and x = 204 ÷ 0.85 = 240.",
    "减少 p% 后，新值是原值 x 的 (100 − p)%。如果某镇人口减少 15% 后是 204 人，那么 0.85x = 204，x = 204 ÷ 0.85 = 240。",
  ),
  ["finding-original-values-from-percentage-increases", "applying-percentage-decreases"],
  ["7.RP.A.3"],
  [
    {
      id: "the-equation-for-the-original-after-a-decrease",
      title: t("Writing the equation", "列方程"),
      explanation: t(
        "Call the unknown original value $x$. A decrease leaves $1$ minus the rate of it, so the new value equals that multiplier times $x$.\n\nA number decreased by $15\\%$ gives $204$: $0.85x = 204$, not $0.15x = 204$.",
        "设未知的原来的值为 $x$。减少后剩下它的 $1$ 减去减少率，所以新的值等于这个倍数乘 $x$。\n\n一个数减少 $15\\%$ 后得 $204$：$0.85x = 204$，而不是 $0.15x = 204$。",
      ),
      generate: (rng) => originalEquationProblem(rng, false),
    },
    {
      id: "original-value-after-a-decrease",
      title: t("Finding the original value", "求原值"),
      explanation: t(
        "To undo a decrease, divide the new value by the multiplier for the part that remains. Adding the percentage back to the new value does not give the original.\n\nAfter a $15\\%$ decrease a town has $204$ residents: $0.85x = 204$, so $x = 204 \\div 0.85 = 240$.",
        "要还原一次减少，就用新的值除以剩下部分的倍数。把百分之几加回到新的值上，得不到原来的值。\n\n减少 $15\\%$ 后某镇有 $204$ 人：$0.85x = 204$，所以 $x = 204 \\div 0.85 = 240$。",
      ),
      generate: (rng) => originalProblem(rng, false),
    },
  ],
);

/** signedChange describes a percentage change of s percent in words. */
const signedChange = (s: number) =>
  s > 0 ? t(`increased by $${s}\\%$`, `增加 $${s}\\%$`) : t(`decreased by $${-s}\\%$`, `减少 $${-s}\\%$`);

/** applyingPercentagesInSuccession applies two percentage changes one after the other. */
export const applyingPercentagesInSuccession = topic(
  "applying-percentages-in-succession",
  t("Applying Percentages in Succession", "连续的百分比变化"),
  t(
    "Two percentage changes in a row multiply: a 20% increase followed by a 10% decrease multiplies by 1.2 × 0.9 = 1.08, an overall increase of 8%, not 10%. The second percentage is taken of the new value, not of the original.",
    "连续两次百分比变化要相乘：先增加 20% 再减少 10%，相当于乘 1.2 × 0.9 = 1.08，总体增加 8%，而不是 10%。第二个百分比是以新值为基准的，而不是原值。",
  ),
  ["calculating-percentage-change"],
  ["7.RP.A.3"],
  [
    {
      id: "value-after-two-changes",
      title: t("The value after two changes", "两次变化后的值"),
      explanation: t(
        "When one percentage change follows another, the second change applies to the new value, not to the original. Multiply by one multiplier, then by the next.\n\n$500$ increased by $20\\%$ is $500 \\times 1.2 = 600$; then decreased by $10\\%$ it is $600 \\times 0.9 = 540$.",
        "一次百分比变化之后再发生另一次变化时，第二次变化是针对新的值，而不是原来的值。先乘第一个倍数，再乘第二个倍数。\n\n$500$ 增加 $20\\%$ 得 $500 \\times 1.2 = 600$；再减少 $10\\%$ 得 $600 \\times 0.9 = 540$。",
      ),
      generate(rng) {
        const n = 100 * rng.int(2, 9);
        let a: number, b: number;
        do {
          a = 10 * rng.nonZero(-5, 8);
          b = 10 * rng.nonZero(-5, 8);
        } while (a + b === 0 || a === b);
        const mid = (n * (100 + a)) / 100;
        const end = (mid * (100 + b)) / 100;
        return numberProblem({
          prompt: t(
            `The number $${n}$ is ${signedChange(a).en}, and the result is then ${signedChange(b).en}. What is the final value?`,
            `把 $${n}$ 先${signedChange(a)["zh-CN"]}，再把结果${signedChange(b)["zh-CN"]}。最后的值是多少？`,
          ),
          answer: end,
          form: "integer",
          wrong: [(n * (100 + a + b)) / 100, mid, (n * (100 - a) * (100 - b)) / 10000],
          solution: t(
            `$${n} \\times ${multiplier(a)} = ${mid}$, then $${mid} \\times ${multiplier(b)} = ${end}$.`,
            `$${n} \\times ${multiplier(a)} = ${mid}$，再 $${mid} \\times ${multiplier(b)} = ${end}$。`,
          ),
        });
      },
    },
    {
      id: "overall-percentage-change",
      title: t("The overall percentage change", "总体百分比变化"),
      explanation: t(
        "The overall effect of successive changes is the product of their multipliers. Subtract $1$ from that product and write it as a percentage to get the overall change. Adding the percentages gives the wrong answer.\n\nA $20\\%$ increase and then a $10\\%$ increase multiply by $1.2 \\times 1.1 = 1.32$: an overall increase of $32\\%$, not $30\\%$.",
        "连续几次变化的总效果是各个倍数的乘积。把这个乘积减去 $1$，再写成百分数，就是总体的变化。直接把百分数相加是错误的。\n\n先增加 $20\\%$ 再增加 $10\\%$，相当于乘 $1.2 \\times 1.1 = 1.32$：总体增加 $32\\%$，而不是 $30\\%$。",
      ),
      generate(rng) {
        const what = rng.pick([
          t("price of a bike", "一辆自行车的价格"),
          t("population of a town", "某镇的人口"),
          t("weekly pay of a worker", "一名工人的周薪"),
          t("number of members of a club", "一个俱乐部的会员人数"),
        ]);
        let a: number, b: number, total: number;
        do {
          a = 10 * rng.nonZero(-5, 5);
          b = 10 * rng.nonZero(-5, 5);
          total = ((100 + a) * (100 + b)) / 100 - 100;
        } while (total === 0 || a + b === 0);
        return numberProblem({
          prompt: t(
            `The ${what.en} is ${signedChange(a).en} one year and ${signedChange(b).en} the next year. What is the overall percentage change over the two years? Write a decrease as a negative number.`,
            `${what["zh-CN"]}第一年${signedChange(a)["zh-CN"]}，第二年又${signedChange(b)["zh-CN"]}。两年总体的百分比变化是多少？减少用负数表示。`,
          ),
          answer: total,
          percent: true,
          wrong: [a + b, -(a + b), Q.of(a * b, 100), -total],
          solution: t(
            `Multiply the two factors: $${multiplier(a)} \\times ${multiplier(b)} = ${multiplier(total)}$, which is $${100 + total}\\%$ of the original: a change of $${total}\\%$.`,
            `把两个倍数相乘：$${multiplier(a)} \\times ${multiplier(b)} = ${multiplier(total)}$，是原来的 $${100 + total}\\%$，即变化了 $${total}\\%$。`,
          ),
        });
      },
    },
  ],
);

/** interpretingPercentageChange compares percentage changes and reads a value as a percentage of the original. */
export const interpretingPercentageChange = topic(
  "interpreting-percentage-change",
  t("Interpreting Percentage Change", "解读百分比变化"),
  t(
    "A percentage change compares the change with the starting value, so a large change in a large quantity can be a small percentage. A value that is now 130% of the original has increased by 30%; one that is 75% of the original has decreased by 25%.",
    "百分比变化是把变化量与起始值相比，所以大的量变化很多，百分比也可能很小。现在是原来 130% 的值增加了 30%；是原来 75% 的值减少了 25%。",
  ),
  ["calculating-percentage-change"],
  ["7.RP.A.3"],
  [
    {
      id: "comparing-percentage-changes",
      title: t("Comparing percentage changes", "比较百分比变化"),
      explanation: t(
        "Town A grew from $200$ to $260$ people ($+60$, $30\\%$). Town B grew from $1000$ to $1200$ ($+200$, $20\\%$). Town B gained more people, but town A had the greater percentage increase.",
        "A 镇从 $200$ 人增长到 $260$ 人（$+60$，$30\\%$）。B 镇从 $1000$ 人增长到 $1200$ 人（$+200$，$20\\%$）。B 镇增加的人更多，但 A 镇增加的百分比更大。",
      ),
      generate(rng) {
        const a0 = 200 * rng.int(5, 15);
        const b0 = 200 * rng.int(25, 49);
        let pa: number, pb: number;
        do {
          pa = 5 * rng.int(2, 12);
          pb = 5 * rng.int(2, 12);
        } while (pa === pb);
        const [a1, b1] = [(a0 * (100 + pa)) / 100, (b0 * (100 + pb)) / 100];
        const swap = rng.bool();
        const [x0, x1, px, y0, y1, py] = swap ? [b0, b1, pb, a0, a1, pa] : [a0, a1, pa, b0, b1, pb];
        const correct = px > py ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `The population of town A grew from ${x0} to ${x1}. The population of town B grew from ${y0} to ${y1}. Which town had the greater percentage increase?`,
            `A 镇的人口从 ${x0} 增长到 ${x1}，B 镇的人口从 ${y0} 增长到 ${y1}。哪个镇人口增长的百分比更大？`,
          ),
          options: [t("Town A", "A 镇"), t("Town B", "B 镇"), t("Both are the same", "一样大")],
          correct,
          solution: t(
            `Town A: $\\frac{${x1 - x0}}{${x0}} = ${px}\\%$. Town B: $\\frac{${y1 - y0}}{${y0}} = ${py}\\%$. Town ${correct === 0 ? "A" : "B"} had the greater percentage increase.`,
            `A 镇：$\\frac{${x1 - x0}}{${x0}} = ${px}\\%$。B 镇：$\\frac{${y1 - y0}}{${y0}} = ${py}\\%$。${correct === 0 ? "A" : "B"} 镇增长的百分比更大。`,
          ),
        });
      },
    },
    {
      id: "percentage-of-the-original",
      title: t("A value as a percentage of the original", "现值占原值的百分比"),
      explanation: t(
        "A price that is now $130\\%$ of the original has changed by $130\\% - 100\\% = 30\\%$, an increase. One that is $75\\%$ of the original has changed by $-25\\%$, a decrease.",
        "现在是原价 $130\\%$ 的价格变化了 $130\\% - 100\\% = 30\\%$，是增加。现在是原价 $75\\%$ 的价格变化了 $-25\\%$，是减少。",
      ),
      generate(rng) {
        let r: number;
        do r = rng.int(8, 39) * 5;
        while (r === 100);
        const what = rng.pick([
          t("the price of a game", "一款游戏的价格"),
          t("the number of visitors to a museum", "博物馆的参观人数"),
          t("the rent of an apartment", "一套公寓的租金"),
          t("the monthly profit of a shop", "一家商店的月利润"),
        ]);
        return numberProblem({
          prompt: t(
            `This year, ${what.en} is $${r}\\%$ of what it was last year. What is the percentage change? Write a decrease as a negative number.`,
            `今年${what["zh-CN"]}是去年的 $${r}\\%$。百分比变化是多少？减少用负数表示。`,
          ),
          answer: r - 100,
          percent: true,
          wrong: [r, 100 - r, Q.of(10000, r).sub(Q.of(100))],
          solution: t(
            `Last year's value is $100\\%$. The change is $${r}\\% - 100\\% = ${r - 100}\\%$, ${r > 100 ? "an increase" : "a decrease"}.`,
            `去年的值是 $100\\%$。变化是 $${r}\\% - 100\\% = ${r - 100}\\%$，是${r > 100 ? "增加" : "减少"}。`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Percentages in commerce and finance

/** Purchase is something bought in a store, with an article in both languages. */
interface Purchase {
  readonly en: string;
  /** zh has a numeral and measure word, such as "一件夹克"; zhNoun is the bare noun. */
  readonly zh: string;
  readonly zhNoun: string;
}

const purchases: readonly Purchase[] = [
  { en: "jacket", zh: "一件夹克", zhNoun: "夹克" },
  { en: "pair of shoes", zh: "一双鞋", zhNoun: "鞋" },
  { en: "backpack", zh: "一个背包", zhNoun: "背包" },
  { en: "lamp", zh: "一盏台灯", zhNoun: "台灯" },
  { en: "video game", zh: "一款电子游戏", zhNoun: "电子游戏" },
  { en: "bike helmet", zh: "一个自行车头盔", zhNoun: "自行车头盔" },
];

/** percentagesInCommerceAndFinance computes sales tax, discounts and tips. */
export const percentagesInCommerceAndFinance = topic(
  "percentages-in-commerce-and-finance",
  t("Percentages in Commerce and Finance", "商业与理财中的百分比"),
  t(
    "Sales tax and tips are percentages added to a price; discounts are percentages taken off. A \\$40 item with 8% tax costs \\$40 × 1.08 = \\$43.20; with a 25% discount it costs \\$40 × 0.75 = \\$30.",
    "销售税和小费是加在价格上的百分比；折扣是从价格中减去的百分比。\\$40 的商品加 8% 的税是 \\$40 × 1.08 = \\$43.20；打 25% 的折扣是 \\$40 × 0.75 = \\$30。",
  ),
  ["applying-percentage-decreases"],
  ["7.RP.A.3"],
  [
    {
      id: "sales-tax",
      title: t("Sales tax", "销售税"),
      explanation: t(
        "Sales tax is a percentage of the price that is added on top of it. Find the tax by multiplying the price by the tax rate, then add it to the price for the total.\n\nA $\\$40$ item with $8\\%$ sales tax: the tax is $0.08 \\times 40 = \\$3.20$, so the total is $\\$43.20$.",
        "销售税是按价格的百分之几加收的钱。用价格乘税率求出税，再加到价格上得到总额。\n\n$\\$40$ 的商品，销售税 $8\\%$：税是 $0.08 \\times 40 = \\$3.20$，所以共 $\\$43.20$。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        const d = rng.int(12, 150);
        const r = rng.int(3, 10);
        const tax = d * r;
        return numberProblem({
          prompt: t(
            `A ${it.en} costs $\\$${d}$ before tax. The sales tax is $${r}\\%$. What is the total cost, in dollars?`,
            `${it.zh}税前售价 $\\$${d}$，销售税为 $${r}\\%$。总共要付多少美元？`,
          ),
          answer: cq(d * 100 + tax),
          form: "decimal",
          wrong: [cq(tax), Q.of(d + r), cq(d * 100 - tax), cq(d * 100 + tax * 10)],
          solution: t(
            `The tax is $${dec(Q.of(r, 100))} \\times ${d} = ${usd(tax)}$, so the total is $\\$${d} + ${usd(tax)} = ${usd(d * 100 + tax)}$.`,
            `税是 $${dec(Q.of(r, 100))} \\times ${d} = ${usd(tax)}$，所以共 $\\$${d} + ${usd(tax)} = ${usd(d * 100 + tax)}$。`,
          ),
        });
      },
    },
    {
      id: "discounts",
      title: t("Discounts", "折扣"),
      explanation: t(
        "A discount is a percentage of the original price that is taken off. Find the discount by multiplying the price by the rate, then subtract it to get the sale price.\n\nA $\\$40$ item is $25\\%$ off: the discount is $0.25 \\times 40 = \\$10$, so the sale price is $\\$30$.",
        "折扣是从原价中减去原价的百分之几。用原价乘折扣率求出优惠的钱，再从原价中减去，得到售价。\n\n$\\$40$ 的商品优惠 $25\\%$：优惠 $0.25 \\times 40 = \\$10$，所以售价 $\\$30$。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        const d = rng.int(12, 150);
        const p = 5 * rng.int(1, 14);
        const off = d * p;
        return numberProblem({
          prompt: t(
            `A ${it.en} regularly costs $\\$${d}$. It is on sale for $${p}\\%$ off. What is the sale price, in dollars?`,
            `${it.zh}原价 $\\$${d}$，现在优惠 $${p}\\%$。售价是多少美元？`,
          ),
          answer: cq(d * 100 - off),
          form: "decimal",
          wrong: [cq(off), ...(d > p ? [Q.of(d - p)] : []), cq(d * 100 + off)],
          solution: t(
            `The discount is $${dec(Q.of(p, 100))} \\times ${d} = ${usd(off)}$, so the sale price is $\\$${d} - ${usd(off)} = ${usd(d * 100 - off)}$.`,
            `优惠的金额是 $${dec(Q.of(p, 100))} \\times ${d} = ${usd(off)}$，所以售价是 $\\$${d} - ${usd(off)} = ${usd(d * 100 - off)}$。`,
          ),
        });
      },
    },
    {
      id: "tips",
      title: t("Tips", "小费"),
      explanation: t(
        "A tip is a percentage of the bill that is paid in addition to it. Multiply the bill by the tip rate to find the tip, then add it to the bill.\n\nAn $18\\%$ tip on a $\\$45$ bill is $0.18 \\times 45 = \\$8.10$, so the total is $\\$53.10$.",
        "小费是在账单之外另付的账单的百分之几。用账单金额乘小费率求出小费，再加到账单上。\n\n$\\$45$ 的账单付 $18\\%$ 的小费：$0.18 \\times 45 = \\$8.10$，所以共 $\\$53.10$。",
      ),
      generate(rng) {
        const d = rng.int(15, 120);
        const r = rng.pick([10, 12, 15, 18, 20, 22, 25]);
        const tip = d * r;
        const total = rng.bool();
        return numberProblem({
          prompt: total
            ? t(
                `A restaurant bill is $\\$${d}$. The diners leave ${article(r)} $${r}\\%$ tip. How much do they pay in all, in dollars?`,
                `餐馆账单是 $\\$${d}$，顾客另付 $${r}\\%$ 的小费。他们一共付多少美元？`,
              )
            : t(
                `A restaurant bill is $\\$${d}$. How much is ${article(r)} $${r}\\%$ tip, in dollars?`,
                `餐馆账单是 $\\$${d}$。$${r}\\%$ 的小费是多少美元？`,
              ),
          answer: total ? cq(d * 100 + tip) : cq(tip),
          form: "decimal",
          wrong: total ? [cq(tip), Q.of(d + r), cq(d * 100 - tip)] : [Q.of(d * r), cq(d * 100 + tip), Q.of(r)],
          solution: total
            ? t(
                `The tip is $${dec(Q.of(r, 100))} \\times ${d} = ${usd(tip)}$, so they pay $\\$${d} + ${usd(tip)} = ${usd(d * 100 + tip)}$.`,
                `小费是 $${dec(Q.of(r, 100))} \\times ${d} = ${usd(tip)}$，所以一共付 $\\$${d} + ${usd(tip)} = ${usd(d * 100 + tip)}$。`,
              )
            : t(
                `The tip is $${dec(Q.of(r, 100))} \\times ${d} = ${usd(tip)}$.`,
                `小费是 $${dec(Q.of(r, 100))} \\times ${d} = ${usd(tip)}$。`,
              ),
        });
      },
    },
  ],
);

/** furtherPercentagesInCommerceAndFinance computes markups and commissions and finds percentage rates. */
export const furtherPercentagesInCommerceAndFinance = topic(
  "further-percentages-in-commerce-and-finance",
  t("Further Percentages in Commerce and Finance", "商业与理财中的百分比（进阶）"),
  t(
    "A store marks up the price it pays (the cost) by a percentage to set its retail price. A salesperson's commission is a percentage of their sales. A tax, tip or discount rate is the amount divided by the original price.",
    "商店在进价（成本）上加一个百分比来定零售价，这叫加价。销售员的佣金是销售额的百分比。税率、小费率或折扣率等于相应的金额除以原价。",
  ),
  ["percentages-in-commerce-and-finance", "calculating-percentage-change"],
  ["7.RP.A.3"],
  [
    {
      id: "markups",
      title: t("Markups", "加价"),
      explanation: t(
        "A markup is the percentage a store adds to what it paid in order to set its selling price. The retail price is the cost plus the markup, which is the cost times $1$ plus the markup rate.\n\nA store pays $\\$24$ for a lamp and marks it up by $75\\%$. The retail price is $24 \\times 1.75 = \\$42$.",
        "加价是商店在进价上加的百分之几，以此定出售价。零售价等于进价加上加价，也就是进价乘以 $1$ 加上加价率。\n\n商店以 $\\$24$ 购进一盏台灯，加价 $75\\%$。零售价是 $24 \\times 1.75 = \\$42$。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        const c = 4 * rng.int(3, 40);
        const m = 5 * rng.int(4, 30);
        const up = c * m;
        return numberProblem({
          prompt: t(
            `A store buys a ${it.en} for $\\$${c}$ and marks up the price by $${m}\\%$. What is the retail price, in dollars?`,
            `商店以 $\\$${c}$ 购进${it.zh}，加价 $${m}\\%$。零售价是多少美元？`,
          ),
          answer: cq(c * 100 + up),
          form: "decimal",
          wrong: [cq(up), Q.of(c + m), ...(m < 100 ? [cq(c * 100 - up)] : [])],
          solution: t(
            `The markup is $${dec(Q.of(m, 100))} \\times ${c} = ${usd(up)}$, so the retail price is $\\$${c} + ${usd(up)} = ${usd(c * 100 + up)}$.`,
            `加价的金额是 $${dec(Q.of(m, 100))} \\times ${c} = ${usd(up)}$，所以零售价是 $\\$${c} + ${usd(up)} = ${usd(c * 100 + up)}$。`,
          ),
        });
      },
    },
    {
      id: "commission",
      title: t("Commission", "佣金"),
      explanation: t(
        "A commission is a percentage of the sales that a salesperson earns. Multiply the sales by the commission rate, and add any base pay to find the total earnings.\n\nA salesperson earns $\\$300$ a week plus $5\\%$ commission. On $\\$4{,}000$ of sales, the commission is $0.05 \\times 4000 = \\$200$, so the pay is $\\$500$.",
        "佣金是销售员按销售额的百分之几得到的报酬。用销售额乘佣金率，再加上底薪，得到总收入。\n\n一名销售员每周底薪 $\\$300$，另加 $5\\%$ 的佣金。销售额 $\\$4{,}000$ 时，佣金是 $0.05 \\times 4000 = \\$200$，所以工资是 $\\$500$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const base = 50 * rng.int(4, 12);
        const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12]);
        const sales = 100 * rng.int(15, 99);
        const comm = (sales * r) / 100;
        return numberProblem({
          prompt: t(
            `${name} earns $\\$${base}$ a week plus ${article(r)} $${r}\\%$ commission on sales. This week ${name} sold $\\$${sales}$ worth of goods. How much did ${name} earn this week, in dollars?`,
            `${name} 每周底薪 $\\$${base}$，另加销售额 $${r}\\%$ 的佣金。这周 ${name} 的销售额是 $\\$${sales}$。${name} 这周挣了多少美元？`,
          ),
          answer: base + comm,
          form: "decimal",
          wrong: [comm, Q.of((base + sales) * r, 100), base + sales * r, base + sales],
          solution: t(
            `The commission is $${dec(Q.of(r, 100))} \\times ${sales} = ${comm}$, so the pay is $${base} + ${comm} = \\$${base + comm}$.`,
            `佣金是 $${dec(Q.of(r, 100))} \\times ${sales} = ${comm}$，所以工资是 $${base} + ${comm} = \\$${base + comm}$。`,
          ),
        });
      },
    },
    {
      id: "finding-a-percentage-rate",
      title: t("Finding the rate", "求百分率"),
      explanation: t(
        "To find a rate, divide the amount of the tax, tip, discount or markup by the amount it was calculated from, usually the original price. Then write the quotient as a percentage.\n\nA $\\$60$ jacket is on sale for $\\$45$. The discount is $\\$15$, and $\\frac{15}{60} = 25\\%$. A $\\$2.40$ tax on a $\\$30$ purchase is a rate of $\\frac{2.40}{30} = 8\\%$.",
        "求比率时，用税、小费、折扣或加价的金额除以计算它所依据的金额，通常是原价，再把商写成百分数。\n\n原价 $\\$60$ 的夹克现价 $\\$45$。优惠了 $\\$15$，$\\frac{15}{60} = 25\\%$。$\\$30$ 的商品交税 $\\$2.40$，税率是 $\\frac{2.40}{30} = 8\\%$。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        const d = 20 * rng.int(1, 10);
        if (rng.bool()) {
          const p = 5 * rng.int(1, 15);
          const sale = (d * (100 - p)) / 100;
          return numberProblem({
            prompt: t(
              `A ${it.en} that regularly costs $\\$${d}$ is on sale for $\\$${sale}$. What is the percentage discount?`,
              `${it.zh}原价 $\\$${d}$，现价 $\\$${sale}$。优惠了百分之几？`,
            ),
            answer: p,
            percent: true,
            wrong: [100 - p, d - sale, Q.of((d - sale) * 100, sale)],
            solution: t(
              `The discount is $\\$${d} - \\$${sale} = \\$${d - sale}$, and $\\frac{${d - sale}}{${d}} = ${dec(Q.of(p, 100))} = ${p}\\%$.`,
              `优惠了 $\\$${d} - \\$${sale} = \\$${d - sale}$，$\\frac{${d - sale}}{${d}} = ${dec(Q.of(p, 100))} = ${p}\\%$。`,
            ),
          });
        }
        const r = rng.int(3, 10);
        const tax = d * r;
        return numberProblem({
          prompt: t(
            `The sales tax on ${article(d)} $\\$${d}$ ${it.en} is $${usd(tax)}$. What is the sales tax rate?`,
            `$\\$${d}$ 的${it.zhNoun}要交 $${usd(tax)}$ 的销售税。销售税率是多少？`,
          ),
          answer: r,
          percent: true,
          wrong: [Q.of(r, 100), Q.of(d * 100, tax), Q.of(tax * 100, d * 100 + tax)],
          solution: t(
            `$\\frac{${dec(cq(tax))}}{${d}} = ${dec(Q.of(r, 100))} = ${r}\\%$.`,
            `$\\frac{${dec(cq(tax))}}{${d}} = ${dec(Q.of(r, 100))} = ${r}\\%$。`,
          ),
        });
      },
    },
  ],
);

/** solvingMultipartCommerceAndFinancePercentageProblems combines discounts, taxes and markups. */
export const solvingMultipartCommerceAndFinancePercentageProblems = topic(
  "solving-multipart-commerce-and-finance-percentage-problems",
  t("Solving Multipart Commerce and Finance Percentage Problems", "解多步商业与理财百分比问题"),
  t(
    "Apply the percentages one at a time, each to the amount it applies to: a 20% discount and then 8% tax on \\$50 give \\$50 × 0.8 = \\$40 and then \\$40 × 1.08 = \\$43.20. Subtracting 20% − 8% = 12% at once would be wrong.",
    "逐个应用百分比，每个都作用在它所对应的金额上：\\$50 先打 20% 的折扣，再加 8% 的税，得 \\$50 × 0.8 = \\$40，再 \\$40 × 1.08 = \\$43.20。一次减去 20% − 8% = 12% 是错误的。",
  ),
  ["further-percentages-in-commerce-and-finance", "applying-percentages-in-succession"],
  ["7.RP.A.3", "7.EE.B.3"],
  [
    {
      id: "discount-then-tax",
      title: t("A discount, then tax", "先打折，再加税"),
      explanation: t(
        "When a discount and a tax both apply, the order matters for what each percentage is taken of. The discount comes off the original price, and the tax is then charged on the sale price.\n\nA $\\$50$ item is $20\\%$ off, and $8\\%$ tax is added to the sale price: $50 \\times 0.8 = \\$40$, then $40 \\times 1.08 = \\$43.20$.",
        "同时有折扣和税时，要弄清每个百分数针对的是哪个金额。折扣从原价中减去，税则按折后的售价计算。\n\n$\\$50$ 的商品优惠 $20\\%$，再按售价加 $8\\%$ 的税：$50 \\times 0.8 = \\$40$，再 $40 \\times 1.08 = \\$43.20$。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        const d = 10 * rng.int(2, 20);
        const p = 10 * rng.int(1, 5);
        const r = rng.int(3, 9);
        const sale = (d * (100 - p)) / 100;
        const total = sale * (100 + r);
        return numberProblem({
          prompt: t(
            `A ${it.en} regularly costs $\\$${d}$. It is on sale for $${p}\\%$ off, and ${article(r)} $${r}\\%$ sales tax is added to the sale price. What is the total cost, in dollars?`,
            `${it.zh}原价 $\\$${d}$，现在优惠 $${p}\\%$，并按优惠后的价格加收 $${r}\\%$ 的销售税。总共要付多少美元？`,
          ),
          answer: cq(total),
          form: "decimal",
          wrong: [cq(d * (100 - p + r)), Q.of(sale), cq(sale * 100 + d * r), cq(d * (100 + r))],
          solution: t(
            `Sale price: $${d} \\times ${multiplier(-p)} = ${sale}$. With tax: $${sale} \\times ${multiplier(r)} = ${dec(cq(total))}$, so the total is $${usd(total)}$.`,
            `优惠后的价格：$${d} \\times ${multiplier(-p)} = ${sale}$。加税：$${sale} \\times ${multiplier(r)} = ${dec(cq(total))}$，所以共 $${usd(total)}$。`,
          ),
        });
      },
    },
    {
      id: "markup-then-discount",
      title: t("A markup, then a discount", "先加价，再打折"),
      explanation: t(
        "A markup raises the cost to a selling price, and a later discount is taken of that selling price, not of the cost. The profit is the final price minus what the store paid.\n\nA store pays $\\$40$ for a backpack, marks it up $50\\%$ to $\\$60$, and later sells it at $20\\%$ off: $60 \\times 0.8 = \\$48$. Its profit is $\\$48 - \\$40 = \\$8$.",
        "加价把进价提高到售价，之后的折扣是按这个售价计算的，而不是按进价。利润等于最终的售价减去商店的进价。\n\n商店以 $\\$40$ 购进一个背包，加价 $50\\%$ 定价 $\\$60$，后来打 $20\\%$ 的折扣出售：$60 \\times 0.8 = \\$48$。利润是 $\\$48 - \\$40 = \\$8$。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        let c: number, m: number, p: number, sale: Q;
        do {
          c = 10 * rng.int(2, 15);
          m = 10 * rng.int(3, 10);
          p = 10 * rng.int(1, 4);
          sale = Q.of(c * (100 + m) * (100 - p), 10000);
        } while (sale.cmp(Q.of(c)) <= 0);
        const retail = (c * (100 + m)) / 100;
        const profit = sale.sub(Q.of(c));
        const askProfit = rng.bool();
        return numberProblem({
          prompt: t(
            `A store buys a ${it.en} for $\\$${c}$ and marks up the price by $${m}\\%$. Later it sells the ${it.en} at $${p}\\%$ off the marked-up price. ${askProfit ? "How much profit does the store make, in dollars?" : "What is the sale price, in dollars?"}`,
            `商店以 $\\$${c}$ 购进${it.zh}，加价 $${m}\\%$ 定价。后来按定价打 $${p}\\%$ 的折扣出售。${askProfit ? "商店赚了多少美元？" : "售价是多少美元？"}`,
          ),
          answer: askProfit ? profit : sale,
          form: "decimal",
          wrong: askProfit
            ? [Q.of(c * (m - p), 100), sale, Q.of(retail - c)]
            : [Q.of(c * (100 + m - p), 100), Q.of(retail), Q.of(c * (100 - p), 100)],
          solution: t(
            `Marked-up price: $${c} \\times ${multiplier(m)} = ${retail}$. Sale price: $${retail} \\times ${multiplier(-p)} = ${dec(sale)}$.${askProfit ? ` Profit: $${dec(sale)} - ${c} = ${dec(profit)}$ dollars.` : ""}`,
            `定价：$${c} \\times ${multiplier(m)} = ${retail}$。售价：$${retail} \\times ${multiplier(-p)} = ${dec(sale)}$。${askProfit ? `利润：$${dec(sale)} - ${c} = ${dec(profit)}$ 美元。` : ""}`,
          ),
        });
      },
    },
    {
      id: "comparing-two-offers",
      title: t("Comparing two offers", "比较两种优惠"),
      explanation: t(
        "To compare a percentage discount with a fixed amount off, turn the percentage into a dollar amount for the given price. The offer that saves more money gives the lower price.\n\nOn an $\\$80$ item, $30\\%$ off saves $0.3 \\times 80 = \\$24$, more than a coupon for $\\$20$ off. So the $30\\%$ discount gives the lower price.",
        "比较按百分比的折扣与直接减去固定金额的优惠时，先把百分比折扣换算成这个价格下省下的钱。省得多的优惠，价格更低。\n\n$\\$80$ 的商品，优惠 $30\\%$ 能省 $0.3 \\times 80 = \\$24$，比 $\\$20$ 的优惠券省得多。所以 $30\\%$ 的折扣价格更低。",
      ),
      generate(rng) {
        const it = rng.pick(purchases);
        const d = 10 * rng.int(3, 25);
        const p = 5 * rng.int(2, 8);
        const off = (d * p) / 100;
        let coupon: number;
        do coupon = 5 * Math.max(1, Math.round(off / 5) + rng.int(-2, 2));
        while (coupon === off || coupon >= d);
        const correct = off > coupon ? 0 : 1;
        return choiceProblem({
          prompt: t(
            `A ${it.en} costs $\\$${d}$. Store A offers $${p}\\%$ off. Store B offers $\\$${coupon}$ off. Which store has the lower price?`,
            `${it.zh}售价 $\\$${d}$。A 店优惠 $${p}\\%$，B 店直接减 $\\$${coupon}$。哪家店的价格更低？`,
          ),
          options: [t("Store A", "A 店"), t("Store B", "B 店")],
          correct,
          solution: t(
            `Store A takes off $${dec(Q.of(p, 100))} \\times ${d} = ${usd(d * p)}$, so its price is $${usd(d * (100 - p))}$. Store B's price is $\\$${d - coupon}$. Store ${correct === 0 ? "A" : "B"} is cheaper.`,
            `A 店减 $${dec(Q.of(p, 100))} \\times ${d} = ${usd(d * p)}$，价格是 $${usd(d * (100 - p))}$。B 店价格是 $\\$${d - coupon}$。${correct === 0 ? "A" : "B"} 店更便宜。`,
          ),
        });
      },
    },
  ],
);

/** calculatingSimpleInterest uses I = Prt to find interest, balances and rates. */
export const calculatingSimpleInterest = topic(
  "calculating-simple-interest",
  t("Calculating Simple Interest", "计算单利"),
  t(
    "Simple interest is I = Prt: the principal P times the yearly rate r (as a decimal) times the time t in years. \\$500 at 4% for 3 years earns 500 × 0.04 × 3 = \\$60, for a balance of \\$560.",
    "单利 I = Prt：本金 P 乘年利率 r（化成小数）再乘年数 t。\\$500 按 4% 存 3 年，利息是 500 × 0.04 × 3 = \\$60，本息共 \\$560。",
  ),
  ["percentages-in-commerce-and-finance"],
  ["7.RP.A.3", "7.EE.B.3"],
  [
    {
      id: "interest-earned",
      title: t("Interest earned", "求利息"),
      explanation: t(
        "Simple interest is earned only on the original amount, the principal. It equals the principal times the yearly rate times the time in years, $I = Prt$. Write months as a fraction of a year.\n\n$\\$500$ at $4\\%$ simple interest for $3$ years: $I = 500 \\times 0.04 \\times 3 = \\$60$. For $18$ months, use $t = 1.5$.",
        "单利只按原来的本金计算。利息等于本金乘年利率再乘以年数，即 $I = Prt$。时间是月数时，要化成年数。\n\n$\\$500$ 按 $4\\%$ 的单利存 $3$ 年：$I = 500 \\times 0.04 \\times 3 = \\$60$。存 $18$ 个月时 $t = 1.5$。",
      ),
      generate(rng) {
        const p = 100 * rng.int(2, 50);
        const r = rng.pick([2, 3, 4, 5, 6, 8]);
        const months = rng.bool(0.3);
        const tq = months ? Q.of(rng.pick([6, 18, 30]), 12) : Q.of(rng.int(2, 10));
        const interest = Q.of(p * r, 100).mul(tq);
        const time = months
          ? t(`${Number(tq.mul(Q.of(12)).n)} months`, `${Number(tq.mul(Q.of(12)).n)} 个月`)
          : t(`${tq.n} years`, `${tq.n} 年`);
        return numberProblem({
          prompt: t(
            `How much simple interest does $\\$${p}$ earn in ${time.en} at an annual rate of $${r}\\%$, in dollars?`,
            `$\\$${p}$ 按年利率 $${r}\\%$ 计单利，${time["zh-CN"]}的利息是多少美元？`,
          ),
          answer: interest,
          form: "decimal",
          wrong: [
            Q.of(p * r).mul(tq),
            Q.of(p * r, 100),
            interest.add(Q.of(p)),
            ...(months ? [Q.of(p * r, 100).mul(tq.mul(Q.of(12)))] : []),
          ],
          solution: t(
            `$I = Prt = ${p} \\times ${dec(Q.of(r, 100))} \\times ${dec(tq)} = ${dec(interest)}$ dollars.${months ? ` The time is in years: $\\frac{${Number(tq.mul(Q.of(12)).n)}}{12} = ${dec(tq)}$.` : ""}`,
            `$I = Prt = ${p} \\times ${dec(Q.of(r, 100))} \\times ${dec(tq)} = ${dec(interest)}$ 美元。${months ? `时间要换算成年：$\\frac{${Number(tq.mul(Q.of(12)).n)}}{12} = ${dec(tq)}$。` : ""}`,
          ),
        });
      },
    },
    {
      id: "balance-with-simple-interest",
      title: t("The balance after some years", "本息和"),
      explanation: t(
        "The balance of an account is the principal plus the interest it has earned. Find the interest with $I = Prt$ first, then add it to the principal.\n\n$\\$500$ at $4\\%$ for $3$ years earns $\\$60$ of interest, so the account holds $500 + 60 = \\$560$.",
        "账户的余额等于本金加上得到的利息。先用 $I = Prt$ 求出利息，再加到本金上。\n\n$\\$500$ 按 $4\\%$ 存 $3$ 年得利息 $\\$60$，所以账户里有 $500 + 60 = \\$560$。",
      ),
      generate(rng) {
        const name = rng.pick(names);
        const p = 100 * rng.int(2, 50);
        const r = rng.pick([2, 3, 4, 5, 6, 7]);
        const years = rng.int(2, 8);
        const interest = Q.of(p * r * years, 100);
        return numberProblem({
          prompt: t(
            `${name} deposits $\\$${p}$ in an account that pays $${r}\\%$ simple interest per year. How much is in the account after ${years} years, in dollars?`,
            `${name} 把 $\\$${p}$ 存入一个按年利率 $${r}\\%$ 计单利的账户。${years} 年后账户里有多少美元？`,
          ),
          answer: interest.add(Q.of(p)),
          form: "decimal",
          wrong: [interest, Q.of(p * r, 100).add(Q.of(p)), Q.of(p * r * years + p)],
          solution: t(
            `$I = ${p} \\times ${dec(Q.of(r, 100))} \\times ${years} = ${dec(interest)}$, so the balance is $${p} + ${dec(interest)} = ${dec(interest.add(Q.of(p)))}$ dollars.`,
            `$I = ${p} \\times ${dec(Q.of(r, 100))} \\times ${years} = ${dec(interest)}$，所以账户里有 $${p} + ${dec(interest)} = ${dec(interest.add(Q.of(p)))}$ 美元。`,
          ),
        });
      },
    },
    {
      id: "finding-the-interest-rate",
      title: t("Finding the interest rate", "求利率"),
      explanation: t(
        "When the interest, the principal and the time are known, substitute them into $I = Prt$ and solve for the rate $r$. Write the rate as a percentage.\n\n$\\$800$ earns $\\$96$ of simple interest in $3$ years: $96 = 800 \\times r \\times 3 = 2400r$, so $r = 0.04 = 4\\%$.",
        "已知利息、本金和时间时，把它们代入 $I = Prt$，解出利率 $r$，再把利率写成百分数。\n\n$\\$800$ 存 $3$ 年得单利 $\\$96$：$96 = 800 \\times r \\times 3 = 2400r$，所以 $r = 0.04 = 4\\%$。",
      ),
      generate(rng) {
        const p = 100 * rng.int(2, 50);
        const r = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const years = rng.int(2, 8);
        const interest = (p * r * years) / 100;
        return numberProblem({
          prompt: t(
            `An account earns $\\$${interest}$ of simple interest on $\\$${p}$ in ${years} years. What is the annual interest rate?`,
            `$\\$${p}$ 存 ${years} 年得单利 $\\$${interest}$。年利率是多少？`,
          ),
          answer: r,
          percent: true,
          wrong: [r * years, Q.of(r, 100), Q.of(interest, years)],
          solution: t(
            `$I = Prt$: $${interest} = ${p} \\times r \\times ${years} = ${p * years}r$, so $r = \\frac{${interest}}{${p * years}} = ${dec(Q.of(r, 100))} = ${r}\\%$.`,
            `$I = Prt$：$${interest} = ${p} \\times r \\times ${years} = ${p * years}r$，所以 $r = \\frac{${interest}}{${p * years}} = ${dec(Q.of(r, 100))} = ${r}\\%$。`,
          ),
        });
      },
    },
  ],
);

/** grade7RatioTopics lists the 7th grade topics on unit rates, proportional relationships and percentages. */
export const grade7RatioTopics: readonly TopicDef[] = [
  findingUnitPrices,
  workingWithUnitPrices,
  solvingMultiStepUnitPriceProblems,
  unitRatesAssociatedWithRatiosOfFractions,
  unitRatesAssociatedWithRatiosOfMixedNumbers,
  solvingUnitRateProblemsUsingRatiosOfFractions,
  solvingUnitRateProblemsUsingRatiosOfMixedNumbers,
  understandingProportionalRelationshipsUsingTables,
  understandingProportionalRelationshipsUsingGraphs,
  understandingProportionalRelationshipsFromDescriptions,
  interpretingDataFromProportionalRelationships,
  applyingPercentageIncreases,
  applyingPercentageDecreases,
  calculatingPercentageChange,
  findingOriginalValuesFromPercentageIncreases,
  findingOriginalValuesFromPercentageDecreases,
  applyingPercentagesInSuccession,
  interpretingPercentageChange,
  percentagesInCommerceAndFinance,
  furtherPercentagesInCommerceAndFinance,
  solvingMultipartCommerceAndFinancePercentageProblems,
  calculatingSimpleInterest,
];
