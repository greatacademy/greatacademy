import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { article, mixedLatex } from "../problems.ts";
import { type Pair, tableFigure, type Walk, type Wrong } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, decided, drawn, expressed, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { equalTape, tapeFigure } from "./upper-grades-kit.ts";

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
export const findingUnitPrices = withIntro(
  topic(
    "finding-unit-prices",
    t("Finding Unit Prices", "求单价"),
    t(
      "A unit price is the price of one item or of one unit of measure: price ÷ quantity. A pack of 6 bars for \\$8.10 costs \\$8.10 ÷ 6 = \\$1.35 per bar, and 2.5 pounds for \\$11.25 cost \\$11.25 ÷ 2.5 = \\$4.50 per pound.",
      "单价是一件物品或一个计量单位的价格：总价 ÷ 数量。6 根燕麦棒一包 \\$8.10，每根 \\$8.10 ÷ 6 = \\$1.35；2.5 磅售价 \\$11.25，每磅 \\$11.25 ÷ 2.5 = \\$4.50。",
    ),
    ["solving-problems-using-unit-rates", "dividing-decimals-using-the-standard-algorithm"],
    ["7.RP.A.1"],
    [
      lesson(
        "price-of-one-item",
        ["The price of one item", "一件物品的价格"],
        [
          [
            "The unit price is the cost of one item: divide the total price by the number of items in the package. A pack of $6$ granola bars costs $\\$8.10$, so one bar costs $\\$8.10 \\div 6 = \\$1.35$.",
            "单价是一件商品的价钱：用总价除以包装里的件数。$6$ 根燕麦棒一包售价 $\\$8.10$，所以每根 $\\$8.10 \\div 6 = \\$1.35$。",
          ],
          [
            "$6$ bars at $\\$1.35$ each cost $6 \\times \\$1.35 = \\$8.10$, the price of the pack.",
            "$6$ 根、每根 $\\$1.35$，共 $6 \\times \\$1.35 = \\$8.10$，正是一包的价钱。",
          ],
          [
            "One item costs less than the pack: divide the price by the count, never multiply.",
            "一件比一包便宜：要用总价除以件数，不能相乘。",
          ],
        ],
        (rng) => {
          const g = rng.pick(goods);
          const n = rng.int(3, 12);
          const u = rng.int(25, 299);
          const total = n * u;
          return valued(
            [
              `A pack of ${n} ${g.many} costs $${usd(total)}$. What is the price of one ${g.one}, in dollars?`,
              `${n} ${g.zh}一包，售价 $${usd(total)}$。每${g.zh}多少美元？`,
            ],
            cq(u),
            [
              [
                ["Set up", "列式"],
                [`One ${g.one} costs the price of the pack shared among $${n}$:`, `一件的价钱是整包价钱平均分成 $${n}$ 份：`],
                [`$$\\text{unit price} = ${usd(total)} \\div ${n}$$`],
              ],
              [
                ["Divide", "相除"],
                ["Divide the cents and write the result in dollars:", "先算出美分，再写成美元："],
                [`${total} \\div ${n} = ${u}`, `$$${u}\\text{ cents} = ${usd(u)}$$`],
              ],
            ],
            [
              `$${n} \\times ${usd(u)} = ${usd(total)}$, the price of the pack.`,
              `$${n} \\times ${usd(u)} = ${usd(total)}$，正是一包的价钱。`,
            ],
            [
              [cq(total * n), "That multiplies by the number of items instead of dividing.", "这是乘件数，而不是除以件数。"],
              [Q.of(u, 10), "The decimal point is one place off.", "小数点错了一位。"],
              [Q.of(u, 1000), "The decimal point is one place off.", "小数点错了一位。"],
              [
                Q.of(n * 100, total),
                "That divides the count by the price, which is items per dollar.",
                "这是件数除以价钱，得到的是每美元能买几件。",
              ],
            ],
            { form: "decimal" },
          );
        },
        equalTape(6, "1.35", "8.10"),
      ),
      lesson(
        "price-per-unit-of-measure",
        ["The price per unit of measure", "每个计量单位的价格"],
        [
          [
            "For goods sold by weight or length, the unit price is the cost of one pound, one kilogram or one yard. Divide the price by the amount, even when the amount is a decimal: $2.5$ pounds of cheese for $\\$11.25$ cost $\\$11.25 \\div 2.5 = \\$112.5 \\div 25 = \\$4.50$ per pound.",
            "按重量或长度出售的商品，单价是每磅、每千克或每码的价钱。用总价除以数量，即使数量是小数也一样：$2.5$ 磅奶酪 $\\$11.25$，每磅 $\\$11.25 \\div 2.5 = \\$112.5 \\div 25 = \\$4.50$。",
          ],
          [
            "$2.5 \\times \\$4.50 = \\$9.00 + \\$2.25 = \\$11.25$, the price paid.",
            "$2.5 \\times \\$4.50 = \\$9.00 + \\$2.25 = \\$11.25$，正是付的钱。",
          ],
          [
            "Move the decimal point the same number of places in both numbers before dividing.",
            "相除前，两个数的小数点要移动同样多的位数。",
          ],
        ],
        (rng) => {
          const b = rng.pick(bulks);
          const q = rng.pick(quarters);
          const u = 4 * rng.int(25, 200);
          const total = (u * q) / 4;
          return valued(
            [
              `$${quarterLatex(q)}$ ${b.units} of ${b.en} cost $${usd(total)}$. What is the price per ${b.unit}, in dollars?`,
              `$${quarterLatex(q)}$ ${b.zhUnit}${b.zh}售价 $${usd(total)}$。每${b.zhUnit}多少美元？`,
            ],
            cq(u),
            [
              [
                ["Set up", "列式"],
                [`The price of one ${b.unit} is the price divided by the amount:`, `每${b.zhUnit}的价钱等于总价除以数量：`],
                [`$$${usd(total)} \\div ${quarterLatex(q)}$$`],
              ],
              [
                ["Divide", "相除"],
                ["Multiply both by 100 so the divisor is whole, then divide:", "两个数都乘 100，使除数变成整数，再相除："],
                [`${total} \\div ${q * 25} = ${dec(cq(u))}`],
              ],
            ],
            [
              `$${quarterLatex(q)} \\times ${usd(u)} = ${usd(total)}$, the price paid.`,
              `$${quarterLatex(q)} \\times ${usd(u)} = ${usd(total)}$，正是付的钱。`,
            ],
            [
              [cq(total).mul(Q.of(q, 4)), "That multiplies by the amount instead of dividing.", "这是乘数量，而不是除以数量。"],
              [Q.of(u, 10), "The decimal point is one place off.", "小数点错了一位。"],
              [Q.of(u, 1000), "The decimal point is one place off.", "小数点错了一位。"],
              [
                Q.of(q * 25, total),
                `That divides the amount by the price, which is ${b.units} per dollar.`,
                `这是数量除以价钱，得到的是每美元能买几${b.zhUnit}。`,
              ],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "11.25",
              pieces: [
                { size: 1, text: "4.50", lit: true },
                { size: 1, text: "4.50" },
                { size: 0.5, text: "2.25" },
              ],
            },
          ],
          [
            "11.25 dollars for 2.5 pounds: 4.50 for each whole pound and 2.25 for the half pound.",
            "2.5 磅共 11.25 美元：每整磅 4.50，半磅 2.25。",
          ],
        ),
      ),
    ],
  ),
  [
    "A pack of $6$ granola bars costs $\\$8.10$ and a pack of $4$ costs $\\$5.60$. To see which is cheaper per bar, find the price of one bar in each pack.",
    "$6$ 根燕麦棒一包 $\\$8.10$，$4$ 根一包 $\\$5.60$。要看哪种每根更便宜，就分别求出每包中一根的价钱。",
  ],
  [
    "$\\$8.10 \\div 6 = \\$1.35$ and $\\$5.60 \\div 4 = \\$1.40$, so the $6$-pack is cheaper per bar.",
    "$\\$8.10 \\div 6 = \\$1.35$，$\\$5.60 \\div 4 = \\$1.40$，所以 $6$ 根装每根更便宜。",
  ],
  [
    "find the price of one item or one unit of measure by dividing the price by the quantity.",
    "用总价除以数量，求出一件或一个计量单位的价钱。",
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
export const workingWithUnitPrices = withIntro(
  topic(
    "working-with-unit-prices",
    t("Working With Unit Prices", "运用单价"),
    t(
      "Cost = unit price × quantity, and quantity = cost ÷ unit price. At \\$2.40 per pound, 3.5 pounds cost \\$8.40; at \\$3.60 per gallon, \\$27 buys 7.5 gallons.",
      "总价 = 单价 × 数量，数量 = 总价 ÷ 单价。每磅 \\$2.40，3.5 磅要 \\$8.40；每加仑 \\$3.60，\\$27 能买 7.5 加仑。",
    ),
    ["finding-unit-prices", "multiplying-two-digit-decimals"],
    ["7.RP.A.1"],
    [
      lesson(
        "cost-from-a-unit-price",
        ["Finding a cost", "求总价"],
        [
          [
            "The cost of any amount is the unit price times the number of units. Grapes cost $\\$2.40$ per pound, so $3.5$ pounds cost $3.5 \\times \\$2.40 = \\$7.20 + \\$1.20 = \\$8.40$.",
            "任意数量的价钱等于单价乘数量。葡萄每磅 $\\$2.40$，所以 $3.5$ 磅要 $3.5 \\times \\$2.40 = \\$7.20 + \\$1.20 = \\$8.40$。",
          ],
          [
            "Divide back: $\\$8.40 \\div 3.5 = \\$2.40$, the price of one pound.",
            "除回去：$\\$8.40 \\div 3.5 = \\$2.40$，正是每磅的价钱。",
          ],
          ["More than one pound costs more than the unit price: multiply, do not divide.", "超过一磅就比单价贵：要相乘，不要相除。"],
        ],
        (rng) => {
          const b = rng.pick(bulks);
          const q = rng.pick(quarters);
          const u = 4 * rng.int(25, 200);
          const total = (u * q) / 4;
          return valued(
            [
              `${capitalized(b.en)} ${b.plural ? "cost" : "costs"} $${usd(u)}$ per ${b.unit}. How much do $${quarterLatex(q)}$ ${b.units} cost, in dollars?`,
              `${b.zh}每${b.zhUnit} $${usd(u)}$。$${quarterLatex(q)}$ ${b.zhUnit}要多少美元？`,
            ],
            cq(total),
            [
              [
                ["Set up", "列式"],
                ["Cost is the unit price times the amount:", "总价等于单价乘数量："],
                [`$$${quarterLatex(q)} \\times ${usd(u)}$$`],
              ],
              [
                ["Multiply", "相乘"],
                ["Multiply the cents by the number of quarters, then divide by 4:", "用美分乘四分之一的个数，再除以 4："],
                [`${u} \\times ${q} \\div 4 = ${total}`, `$$${total}\\text{ cents} = ${usd(total)}$$`],
              ],
            ],
            [
              `Divide back: $${usd(total)} \\div ${quarterLatex(q)} = ${usd(u)}$, the price of one ${b.unit}.`,
              `除回去：$${usd(total)} \\div ${quarterLatex(q)} = ${usd(u)}$，正是每${b.zhUnit}的价钱。`,
            ],
            [
              [cq(u).div(Q.of(q, 4)), "That divides by the amount instead of multiplying.", "这是除以数量，而不是乘数量。"],
              [cq(total * 10), "The decimal point is one place off.", "小数点错了一位。"],
              [cq(total).div(Q.of(10)), "The decimal point is one place off.", "小数点错了一位。"],
              [cq(u).add(Q.of(q, 4)), "That adds the amount to the price instead of multiplying.", "这是把数量加到单价上，而不是相乘。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "8.40",
              pieces: [
                { size: 1, text: "2.40", lit: true },
                { size: 1, text: "2.40" },
                { size: 1, text: "2.40" },
                { size: 0.5, text: "1.20" },
              ],
            },
          ],
          [
            "3.5 pounds at 2.40 dollars a pound: three whole pounds and a half pound make 8.40 dollars.",
            "每磅 2.40 美元买 3.5 磅：三整磅加半磅，共 8.40 美元。",
          ],
        ),
      ),
      lesson(
        "quantity-for-a-budget",
        ["How much can you buy?", "能买多少？"],
        [
          [
            "To find how much a budget buys, divide the money by the unit price; for goods sold by measure the answer can be a decimal. Gasoline costs $\\$3.60$ per gallon, so $\\$27$ buys $27 \\div 3.6 = 270 \\div 36 = 7.5$ gallons.",
            "要求一笔钱能买多少，就用钱数除以单价；按计量出售的商品，结果可以是小数。汽油每加仑 $\\$3.60$，所以 $\\$27$ 能买 $27 \\div 3.6 = 270 \\div 36 = 7.5$ 加仑。",
          ],
          [
            "$7.5 \\times \\$3.60 = \\$25.20 + \\$1.80 = \\$27$, the whole budget.",
            "$7.5 \\times \\$3.60 = \\$25.20 + \\$1.80 = \\$27$，正好用完这笔钱。",
          ],
          [
            "Divide the money by the price, not the price by the money: $3.6 \\div 27$ is far too small.",
            "用钱数除以单价，不是单价除以钱数：$3.6 \\div 27$ 太小了。",
          ],
        ],
        (rng) => {
          const b = rng.pick(budgetGoods);
          const q = rng.pick(quarters);
          const u = 4 * rng.int(25, 150);
          const total = (u * q) / 4;
          return valued(
            [
              `${capitalized(b.en)} ${b.plural ? "cost" : "costs"} $${usd(u)}$ per ${b.unit}. How many ${b.units} can you buy with $${usd(total)}$?`,
              `${b.zh}每${b.zhUnit} $${usd(u)}$。用 $${usd(total)}$ 能买多少${b.zhUnit}？`,
            ],
            Q.of(q, 4),
            [
              [
                ["Set up", "列式"],
                ["The amount is the money divided by the unit price:", "数量等于钱数除以单价："],
                [`$$${usd(total)} \\div ${usd(u)}$$`],
              ],
              [
                ["Divide", "相除"],
                ["Write both in cents so the divisor is whole:", "都写成美分，使除数是整数："],
                [`${total} \\div ${u} = ${quarterLatex(q)}`],
              ],
            ],
            [
              `$${quarterLatex(q)} \\times ${usd(u)} = ${usd(total)}$, the whole budget.`,
              `$${quarterLatex(q)} \\times ${usd(u)} = ${usd(total)}$，正好用完这笔钱。`,
            ],
            [
              [cq(u).mul(cq(total)), "That multiplies the money by the price instead of dividing.", "这是钱数乘单价，而不是相除。"],
              [Q.of(u, total), "That divides the price by the money.", "这是单价除以钱数。"],
              [Q.of(q, 40), "The decimal point is one place off.", "小数点错了一位。"],
              [Q.of(q * 10, 4), "The decimal point is one place off.", "小数点错了一位。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "27",
              pieces: [
                ...Array.from({ length: 7 }, (_, i) => ({ size: 3.6, text: "3.60", lit: i === 0 })),
                { size: 1.8, text: "1.80", dashed: true },
              ],
            },
          ],
          [
            "27 dollars split into seven gallons at 3.60 dollars and half a gallon at 1.80 dollars.",
            "27 美元分成七个每加仑 3.60 美元，再加半加仑 1.80 美元。",
          ],
        ),
      ),
    ],
  ),
  [
    "A family buys $3.5$ pounds of grapes at $\\$2.40$ per pound, and then wants to know how many gallons of gasoline $\\$27$ buys at $\\$3.60$ per gallon.",
    "一家人买 $3.5$ 磅葡萄，每磅 $\\$2.40$；接着想知道每加仑 $\\$3.60$ 的汽油，$\\$27$ 能买多少加仑。",
  ],
  [
    "The grapes cost $3.5 \\times \\$2.40 = \\$8.40$, and $\\$27 \\div \\$3.60 = 7.5$ gallons.",
    "葡萄要 $3.5 \\times \\$2.40 = \\$8.40$；$\\$27 \\div \\$3.60 = 7.5$ 加仑。",
  ],
  [
    "multiply a unit price by an amount to find a cost, and divide money by a unit price to find an amount.",
    "用单价乘数量求总价，用钱数除以单价求数量。",
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
export const solvingMultiStepUnitPriceProblems = withIntro(
  topic(
    "solving-multi-step-unit-price-problems",
    t("Solving Multi-Step Unit Price Problems", "解多步单价问题"),
    t(
      "To find the better buy, compare unit prices rather than total prices. The savings on a purchase are the difference in unit prices times the quantity, and the cost of a mixed purchase is the sum of the cost of each part.",
      "比较哪种更划算，要比较单价而不是总价。购买时节省的钱是单价之差乘数量；买几种东西的总价是各部分总价之和。",
    ),
    ["working-with-unit-prices"],
    ["7.RP.A.1", "7.RP.A.3"],
    [
      lesson(
        "the-better-buy",
        ["The better buy", "哪种更划算"],
        [
          [
            "The better buy is the size with the lower price per ounce, not the lower price. A $12$-ounce box for $\\$3.60$ costs $\\$0.30$ per ounce, and a $20$-ounce box for $\\$6.40$ costs $\\$0.32$ per ounce, so the smaller box is the better buy.",
            "更划算的是每盎司更便宜的那种，不是总价更低的那种。$12$ 盎司装 $\\$3.60$，每盎司 $\\$0.30$；$20$ 盎司装 $\\$6.40$，每盎司 $\\$0.32$，所以小盒更划算。",
          ],
          [
            "At $\\$0.30$ per ounce, $20$ ounces would cost $\\$6.00$, less than the $\\$6.40$ asked for the big box.",
            "按每盎司 $\\$0.30$ 算，$20$ 盎司只要 $\\$6.00$，比大盒的 $\\$6.40$ 便宜。",
          ],
          ["A bigger package is not always cheaper per ounce; always compare unit prices.", "大包装不一定每盎司更便宜；一定要比较单价。"],
        ],
        (rng) => {
          const g = rng.pick(sizedGoods);
          const na = rng.int(6, 16);
          const nb = rng.int(na + 4, 32);
          let ua = rng.int(12, 60);
          let ub = rng.int(12, 60);
          while (ua === ub) [ua, ub] = [rng.int(12, 60), rng.int(12, 60)];
          const smallWins = ua < ub;
          const [best, bestRate, other, otherRate] = smallWins ? [na, ua, nb, ub] : [nb, ub, na, ua];
          const options: Pair[] = [
            [`The ${na}-ounce size`, `${na} 盎司装`],
            [`The ${nb}-ounce size`, `${nb} 盎司装`],
            ["They are equally good buys", "一样划算"],
          ];
          return chosen(
            rng,
            [
              `${article(na, true)} ${na}-ounce ${g.en} costs $${usd(na * ua)}$ and ${article(nb)} ${nb}-ounce ${g.en} costs $${usd(nb * ub)}$. Which is the better buy?`,
              `${na} 盎司装的${g.zh}售价 $${usd(na * ua)}$，${nb} 盎司装的${g.zh}售价 $${usd(nb * ub)}$。哪种更划算？`,
            ],
            options[smallWins ? 0 : 1] as Pair,
            [
              [
                options[smallWins ? 1 : 0] as Pair,
                `It costs $${usd(otherRate)}$ per ounce, more than $${usd(bestRate)}$.`,
                `它每盎司 $${usd(otherRate)}$，比 $${usd(bestRate)}$ 贵。`,
              ],
              [
                options[2] as Pair,
                `The prices per ounce differ: $${usd(ua)}$ and $${usd(ub)}$.`,
                `每盎司的价格不同：$${usd(ua)}$ 和 $${usd(ub)}$。`,
              ],
            ],
            [
              [
                ["Unit prices", "求单价"],
                ["Divide each price by its number of ounces:", "用每种的价钱除以盎司数："],
                [`$$${usd(na * ua)} \\div ${na} = ${usd(ua)}$$`, `$$${usd(nb * ub)} \\div ${nb} = ${usd(ub)}$$`],
              ],
              [
                ["Compare", "比较"],
                [`The ${best}-ounce size costs less per ounce.`, `${best} 盎司装每盎司更便宜。`],
              ],
            ],
            [
              `At $${usd(bestRate)}$ per ounce, $${other}$ ounces would cost $${usd(other * bestRate)}$, less than the $${usd(other * otherRate)}$ asked.`,
              `按每盎司 $${usd(bestRate)}$ 算，$${other}$ 盎司只要 $${usd(other * bestRate)}$，比标价 $${usd(other * otherRate)}$ 便宜。`,
            ],
          );
        },
        tapeFigure(
          [
            { total: "3.60", pieces: [{ size: 12, text: "12 oz", lit: true }] },
            { total: "6.40", pieces: [{ size: 20, text: "20 oz" }] },
          ],
          ["Two bars: 12 ounces for 3.60 dollars and 20 ounces for 6.40 dollars.", "两个长条：12 盎司 3.60 美元，20 盎司 6.40 美元。"],
        ),
      ),
      lesson(
        "savings-at-the-cheaper-store",
        ["How much is saved?", "节省多少钱？"],
        [
          [
            "Find the unit price at each store; their difference is the saving on each item, and that times the number of items is the total saving. Store A sells $4$ cans for $\\$5.00$ ($\\$1.25$ each) and store B $6$ cans for $\\$6.90$ ($\\$1.15$ each), so on $12$ cans store B saves $12 \\times \\$0.10 = \\$1.20$.",
            "先求每家店的单价；单价之差是每件省下的钱，再乘件数就是一共省下的钱。A 店 $4$ 罐 $\\$5.00$（每罐 $\\$1.25$），B 店 $6$ 罐 $\\$6.90$（每罐 $\\$1.15$），买 $12$ 罐在 B 店省 $12 \\times \\$0.10 = \\$1.20$。",
          ],
          [
            "$12$ cans cost $\\$15.00$ at store A and $\\$13.80$ at store B: $\\$15.00 - \\$13.80 = \\$1.20$.",
            "$12$ 罐在 A 店要 $\\$15.00$，在 B 店要 $\\$13.80$：$\\$15.00 - \\$13.80 = \\$1.20$。",
          ],
          [
            "The packs hold different numbers of items, so comparing pack prices says nothing about the saving.",
            "两种包装的件数不同，所以比较一包的价钱看不出省多少。",
          ],
        ],
        (rng) => {
          const g = rng.pick(goods);
          const [na, nb] = rng.sample([2, 3, 4, 5, 6], 2) as [number, number];
          let ua = rng.int(60, 250);
          let ub = rng.int(60, 250);
          while (ua === ub || Math.abs(ua - ub) > 60) [ua, ub] = [rng.int(60, 250), rng.int(60, 250)];
          const base = lcm(na, nb);
          const n = base * rng.int(1, Math.max(1, Math.floor(60 / base)));
          const gap = Math.abs(ua - ub);
          const save = gap * n;
          const cheaper = ua < ub ? "A" : "B";
          return valued(
            [
              `Store A sells packs of ${na} ${g.many} for $${usd(na * ua)}$. Store B sells packs of ${nb} ${g.many} for $${usd(nb * ub)}$. How much do you save, in dollars, by buying ${n} ${g.many} at the cheaper store?`,
              `A 店 ${na} ${g.zh}一包，售价 $${usd(na * ua)}$；B 店 ${nb} ${g.zh}一包，售价 $${usd(nb * ub)}$。在更便宜的店买 ${n} ${g.zh}，能节省多少美元？`,
            ],
            cq(save),
            [
              [
                ["Unit prices", "求单价"],
                ["Divide each pack price by its count:", "用每包的价钱除以件数："],
                [`$$${usd(na * ua)} \\div ${na} = ${usd(ua)}$$`, `$$${usd(nb * ub)} \\div ${nb} = ${usd(ub)}$$`],
              ],
              [
                ["Saving on one", "每件省多少"],
                [`Store ${cheaper} is cheaper on each item by:`, `${cheaper} 店每件便宜：`],
                [`$$${usd(Math.max(ua, ub))} - ${usd(Math.min(ua, ub))} = ${usd(gap)}$$`],
              ],
              [
                ["Total saving", "一共省多少"],
                [`Multiply by the $${n}$ items:`, `乘 $${n}$ 件：`],
                [`$$${n} \\times ${usd(gap)} = ${usd(save)}$$`],
              ],
            ],
            [
              `$${n}$ items cost $${usd(n * ua)}$ at store A and $${usd(n * ub)}$ at store B, which differ by $${usd(save)}$.`,
              `$${n}$ 件在 A 店要 $${usd(n * ua)}$，在 B 店要 $${usd(n * ub)}$，相差 $${usd(save)}$。`,
            ],
            [
              [
                cq(Math.abs(na * ua - nb * ub)),
                "That compares the pack prices, but the packs hold different numbers of items.",
                "这比较的是一包的价钱，但两种包装的件数不同。",
              ],
              [cq(gap), "That is the saving on one item only.", "这只是一件省下的钱。"],
              [
                cq(Math.min(ua, ub) * n),
                "That is the cost at the cheaper store, not the saving.",
                "这是在便宜的店要花的钱，不是省下的钱。",
              ],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "15.00",
              pieces: [
                { size: 13.8, text: "13.80" },
                { size: 1.2, text: "1.20", dashed: true },
              ],
            },
            { total: "13.80", pieces: [{ size: 13.8, text: "13.80", lit: true }] },
          ],
          [
            "12 cans cost 15.00 dollars at one store and 13.80 at the other; the difference is 1.20.",
            "12 罐在一家店 15.00 美元，在另一家 13.80 美元；相差 1.20。",
          ],
        ),
      ),
      lesson(
        "cost-of-a-mixed-purchase",
        ["The cost of a mixed purchase", "买几种东西的总价"],
        [
          [
            "Find the cost of each good separately, its unit price times its amount, then add the costs. Apples at $\\$1.20$ per pound and pears at $\\$1.80$ per pound: $2.5$ pounds of apples and $1.5$ pounds of pears cost $\\$3.00 + \\$2.70 = \\$5.70$.",
            "先分别求每种商品的价钱（单价乘数量），再把它们加起来。苹果每磅 $\\$1.20$，梨每磅 $\\$1.80$：$2.5$ 磅苹果和 $1.5$ 磅梨共 $\\$3.00 + \\$2.70 = \\$5.70$。",
          ],
          [
            "Take away the apples: $\\$5.70 - \\$3.00 = \\$2.70$, which is $1.5 \\times \\$1.80$ for the pears.",
            "减去苹果：$\\$5.70 - \\$3.00 = \\$2.70$，正是梨的 $1.5 \\times \\$1.80$。",
          ],
          [
            "Do not add the prices and the amounts first: each price goes with its own amount.",
            "不要先把单价相加、数量相加：每个单价只乘它自己的数量。",
          ],
        ],
        (rng) => {
          const [fa, fb] = rng.sample(
            [
              ["apples", "苹果"],
              ["pears", "梨"],
              ["bananas", "香蕉"],
              ["peaches", "桃子"],
              ["plums", "李子"],
            ] as Pair[],
            2,
          ) as [Pair, Pair];
          const [pa, pb] = [4 * rng.int(20, 90), 4 * rng.int(20, 90)];
          const [qa, qb] = rng.sample(quarters, 2) as [number, number];
          const [ca, cb] = [(pa * qa) / 4, (pb * qb) / 4];
          return valued(
            [
              `At a market, ${fa[0]} cost $${usd(pa)}$ per pound and ${fb[0]} cost $${usd(pb)}$ per pound. How much do $${quarterLatex(qa)}$ pounds of ${fa[0]} and $${quarterLatex(qb)}$ pounds of ${fb[0]} cost altogether, in dollars?`,
              `市场上${fa[1]}每磅 $${usd(pa)}$，${fb[1]}每磅 $${usd(pb)}$。买 $${quarterLatex(qa)}$ 磅${fa[1]}和 $${quarterLatex(qb)}$ 磅${fb[1]}一共要多少美元？`,
            ],
            cq(ca + cb),
            [
              [
                ["Each cost", "分别求价钱"],
                ["Multiply each unit price by its own amount:", "每个单价乘它自己的数量："],
                [`$$${quarterLatex(qa)} \\times ${usd(pa)} = ${usd(ca)}$$`, `$$${quarterLatex(qb)} \\times ${usd(pb)} = ${usd(cb)}$$`],
              ],
              [["Add", "相加"], ["Add the two costs:", "把两部分价钱加起来："], [`$$${usd(ca)} + ${usd(cb)} = ${usd(ca + cb)}$$`]],
            ],
            [
              `Take away the ${fa[0]}: $${usd(ca + cb)} - ${usd(ca)} = ${usd(cb)}$, which is $${quarterLatex(qb)} \\times ${usd(pb)}$.`,
              `减去${fa[1]}：$${usd(ca + cb)} - ${usd(ca)} = ${usd(cb)}$，正是 $${quarterLatex(qb)} \\times ${usd(pb)}$。`,
            ],
            [
              [
                cq(((pa + pb) * (qa + qb)) / 4),
                "That adds the prices and the amounts first; each price goes with its own amount.",
                "这是先把单价相加、数量相加；每个单价只乘它自己的数量。",
              ],
              [cq(ca), `That is only the ${fa[0]}.`, `这只是${fa[1]}的钱。`],
              [cq(cb), `That is only the ${fb[0]}.`, `这只是${fb[1]}的钱。`],
              [cq(pa + pb), "That adds the prices per pound without the amounts.", "这只把每磅的价钱相加，没有乘数量。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "5.70",
              pieces: [
                { size: 3, text: "3.00", lit: true },
                { size: 2.7, text: "2.70" },
              ],
            },
          ],
          [
            "A total of 5.70 dollars made of 3.00 dollars for one fruit and 2.70 dollars for the other.",
            "总价 5.70 美元：一种水果 3.00 美元，另一种 2.70 美元。",
          ],
        ),
      ),
    ],
  ),
  [
    "One store sells $4$ cans of soup for $\\$5.00$ and another sells $6$ cans for $\\$6.90$. The bigger pack costs more, but is it really the worse deal?",
    "一家店 $4$ 罐汤卖 $\\$5.00$，另一家 $6$ 罐卖 $\\$6.90$。大包装更贵，但它真的更不划算吗？",
  ],
  [
    "Per can, $\\$5.00 \\div 4 = \\$1.25$ and $\\$6.90 \\div 6 = \\$1.15$, so the $6$-pack is the better deal.",
    "每罐 $\\$5.00 \\div 4 = \\$1.25$，$\\$6.90 \\div 6 = \\$1.15$，所以 $6$ 罐装更划算。",
  ],
  [
    "compare unit prices, work out savings, and find the cost of a purchase of several goods.",
    "比较单价，算出节省的钱，并求出买几种东西的总价。",
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

/** divided writes a ÷ b = a × 1/b = answer for two positive rationals, using improper fractions. */
function divided(a: Q, b: Q): string {
  return `${ml(a)} \\div ${ml(b)} = ${a.toLatex()} \\times ${Q.one.div(b).toLatex()} = ${a.div(b).toLatex()}`;
}

/** mixedTail writes " = 2\\frac{2}{3}" after an improper fraction greater than 1, and nothing otherwise. */
const mixedTail = (q: Q) => (q.isInteger() || q.cmp(Q.one) < 0 ? "" : ` = ${ml(q)}`);

/** rateProblem asks for the unit rate a ÷ b in a context, with steps, a check by multiplying back and a reason for each slip. */
function rateProblem(ctx: RateContext, a: Q, b: Q) {
  const rate = a.div(b);
  return valued(
    [`${ctx.given(a, b).en} ${ctx.perOne.en}`, `${ctx.given(a, b)["zh-CN"]}${ctx.perOne["zh-CN"]}`],
    rate,
    [
      [
        ["Set up", "列式"],
        [`To find ${ctx.rate.en}, divide $${ml(a)}$ by $${ml(b)}$:`, `求${ctx.rate["zh-CN"]}，用 $${ml(a)}$ 除以 $${ml(b)}$：`],
        [`${ml(a)} \\div ${ml(b)}`],
      ],
      [
        ["Multiply by the reciprocal", "乘倒数"],
        ["Write both as fractions and multiply by the reciprocal of the divisor:", "都写成分数，再乘除数的倒数："],
        [`${divided(a, b)}${mixedTail(rate)}`],
      ],
    ],
    [
      `Multiply back: $${rate.toLatex()} \\times ${b.toLatex()} = ${a.toLatex()}$, the amount in the story.`,
      `乘回去：$${rate.toLatex()} \\times ${b.toLatex()} = ${a.toLatex()}$，正是题目中的量。`,
    ],
    [
      [a.mul(b), "That multiplies the two amounts instead of dividing.", "这是把两个量相乘，而不是相除。"],
      [b.div(a), `That divides the other way, which gives ${ctx.inverseRate.en}.`, `这是反过来除，得到的是${ctx.inverseRate["zh-CN"]}。`],
      [a, "That is the amount in the story, not the amount for one unit.", "这是题目中的量，不是每一个单位对应的量。"],
      [b, "That is the other amount in the story.", "这是题目中的另一个量。"],
    ],
  );
}

/** unitRatesAssociatedWithRatiosOfFractions finds unit rates as quotients of fractions. */
export const unitRatesAssociatedWithRatiosOfFractions = withIntro(
  topic(
    "unit-rates-associated-with-ratios-of-fractions",
    t("Unit Rates Associated With Ratios of Fractions", "分数之比的单位率"),
    t(
      "A unit rate is the amount of one quantity for one unit of another, found by dividing. Walking 1/2 mile in 1/4 hour is 1/2 ÷ 1/4 = 2 miles per hour; 6 laps in 3/4 hour is 6 ÷ 3/4 = 8 laps per hour.",
      "单位率是另一个量为 1 个单位时这个量的多少，用除法求。1/4 小时走 1/2 英里，速度是 1/2 ÷ 1/4 = 2 英里/小时；3/4 小时跑 6 圈，每小时跑 6 ÷ 3/4 = 8 圈。",
    ),
    ["solving-problems-using-unit-rates", "dividing-fractions"],
    ["7.RP.A.1"],
    [
      lesson(
        "a-fraction-per-a-fraction",
        ["A fraction per a fraction", "分数除以分数"],
        [
          [
            "A unit rate is the amount for one unit of the other quantity. Divide the first amount by the second, even when both are fractions, by multiplying by the reciprocal. A hiker walks $\\frac{2}{3}$ mile in $\\frac{1}{4}$ hour, so per hour: $\\frac{2}{3} \\div \\frac{1}{4} = \\frac{2}{3} \\times 4 = \\frac{8}{3} = 2\\frac{2}{3}$ miles.",
            "单位率是另一个量为一个单位时对应的量。用第一个量除以第二个量；即使两个都是分数也一样，除以分数就是乘它的倒数。徒步者 $\\frac{1}{4}$ 小时走 $\\frac{2}{3}$ 英里，所以每小时走 $\\frac{2}{3} \\div \\frac{1}{4} = \\frac{2}{3} \\times 4 = \\frac{8}{3} = 2\\frac{2}{3}$ 英里。",
          ],
          [
            "An hour is four quarter hours, and $4 \\times \\frac{2}{3} = \\frac{8}{3}$ miles.",
            "一小时有四个四分之一小时，$4 \\times \\frac{2}{3} = \\frac{8}{3}$ 英里。",
          ],
          [
            "Divide by the amount that should become one unit (here the hours), not the other way round.",
            "要除以将要变成一个单位的那个量（这里是小时数），不要除反了。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          let a: Q;
          let b: Q;
          do {
            a = properQ(rng);
            b = properQ(rng);
          } while (a.eq(b));
          return rateProblem(ctx, a, b);
        },
        equalTape(4, "2/3", "8/3"),
      ),
      lesson(
        "a-fraction-and-a-whole-number",
        ["A fraction and a whole number", "分数与整数"],
        [
          [
            "The unit rate is still the measured amount divided by the amount that becomes one unit. Dividing by a whole number makes the amount smaller; dividing by a fraction less than $1$ makes it larger. $6$ gallons in $\\frac{3}{4}$ minute is $6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ gallons per minute.",
            "单位率仍然是用要计量的量除以要变成一个单位的量。除以整数，数会变小；除以小于 $1$ 的分数，数会变大。$\\frac{3}{4}$ 分钟 $6$ 加仑，每分钟 $6 \\div \\frac{3}{4} = 6 \\times \\frac{4}{3} = 8$ 加仑。",
          ],
          [
            "Each quarter minute brings $6 \\div 3 = 2$ gallons, and a whole minute has four quarters: $4 \\times 2 = 8$.",
            "每四分之一分钟注入 $6 \\div 3 = 2$ 加仑，一分钟有四个四分之一分钟：$4 \\times 2 = 8$。",
          ],
          [
            "Less than one minute for $6$ gallons means more than $6$ gallons in a whole minute.",
            "不到一分钟就注入 $6$ 加仑，那么一整分钟一定超过 $6$ 加仑。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          const f = properQ(rng);
          const w = Q.of(rng.int(2, 9));
          return rng.bool() ? rateProblem(ctx, f, w) : rateProblem(ctx, w, f);
        },
        tapeFigure(
          [
            {
              total: "8",
              pieces: [
                { size: 1, text: "2", lit: true },
                { size: 1, text: "2", lit: true },
                { size: 1, text: "2", lit: true },
                { size: 1, text: "2", dashed: true },
              ],
            },
          ],
          [
            "Three quarter minutes hold 6 gallons, 2 in each; a fourth quarter makes 8 gallons in a whole minute.",
            "三个四分之一分钟共 6 加仑，每个 2 加仑；再加一个四分之一分钟，一整分钟共 8 加仑。",
          ],
        ),
      ),
    ],
  ),
  [
    "A hiker walks $\\frac{2}{3}$ mile in $\\frac{1}{4}$ hour. How far would she walk in a whole hour at the same speed?",
    "一名徒步者 $\\frac{1}{4}$ 小时走了 $\\frac{2}{3}$ 英里。照同样的速度，她一整小时能走多远？",
  ],
  [
    "$\\frac{2}{3} \\div \\frac{1}{4} = \\frac{8}{3}$, and four quarter hours give $4 \\times \\frac{2}{3} = \\frac{8}{3}$ miles too.",
    "$\\frac{2}{3} \\div \\frac{1}{4} = \\frac{8}{3}$；四个四分之一小时也是 $4 \\times \\frac{2}{3} = \\frac{8}{3}$ 英里。",
  ],
  ["find unit rates when one or both amounts are fractions, by dividing.", "用除法求一个或两个量是分数时的单位率。"],
);

/** unitRatesAssociatedWithRatiosOfMixedNumbers finds unit rates when the amounts are mixed numbers. */
export const unitRatesAssociatedWithRatiosOfMixedNumbers = withIntro(
  topic(
    "unit-rates-associated-with-ratios-of-mixed-numbers",
    t("Unit Rates Associated With Ratios of Mixed Numbers", "带分数之比的单位率"),
    t(
      "To divide with mixed numbers, first write them as improper fractions. 3 3/4 gallons in 1 1/4 minutes is 15/4 ÷ 5/4 = 15/4 × 4/5 = 3 gallons per minute.",
      "带分数相除时，先化成假分数。1 1/4 分钟 3 3/4 加仑，每分钟 15/4 ÷ 5/4 = 15/4 × 4/5 = 3 加仑。",
    ),
    ["unit-rates-associated-with-ratios-of-fractions", "dividing-mixed-numbers"],
    ["7.RP.A.1"],
    [
      lesson(
        "a-mixed-number-and-a-fraction",
        ["A mixed number and a fraction or whole number", "带分数与分数或整数"],
        [
          [
            "With a mixed number, first write it as an improper fraction. Then divide as with any fractions, multiplying by the reciprocal of the divisor. $2\\frac{1}{2}$ miles in $\\frac{1}{2}$ hour: $\\frac{5}{2} \\div \\frac{1}{2} = \\frac{5}{2} \\times 2 = 5$ miles per hour.",
            "遇到带分数，先化成假分数，再像普通分数那样相除，即乘除数的倒数。$\\frac{1}{2}$ 小时走 $2\\frac{1}{2}$ 英里：$\\frac{5}{2} \\div \\frac{1}{2} = \\frac{5}{2} \\times 2 = 5$ 英里/小时。",
          ],
          [
            "Two half hours make an hour, and $2\\frac{1}{2} + 2\\frac{1}{2} = 5$ miles.",
            "两个半小时是一小时，$2\\frac{1}{2} + 2\\frac{1}{2} = 5$ 英里。",
          ],
          [
            "Do not divide only the whole part: $2\\frac{1}{2}$ is $\\frac{5}{2}$, not $2$ and a forgotten half.",
            "不要只除整数部分：$2\\frac{1}{2}$ 是 $\\frac{5}{2}$，不能把那一半忘掉。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          const m = mixedQ(rng);
          const other = rng.bool() ? properQ(rng, 6) : Q.of(rng.int(2, 6));
          return rng.bool() ? rateProblem(ctx, m, other) : rateProblem(ctx, other, m);
        },
        tapeFigure(
          [
            {
              total: "5",
              pieces: [
                { size: 1, text: "5/2", lit: true },
                { size: 1, text: "5/2" },
              ],
            },
          ],
          ["Two half hours, each with 5/2 miles, make 5 miles in one hour.", "两个半小时，每个走 5/2 英里，一小时共 5 英里。"],
        ),
      ),
      lesson(
        "two-mixed-numbers",
        ["Two mixed numbers", "两个带分数"],
        [
          [
            "When both amounts are mixed numbers, write both as improper fractions, then multiply by the reciprocal of the divisor. $3\\frac{3}{4}$ gallons in $1\\frac{1}{4}$ minutes: $\\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$ gallons per minute.",
            "两个量都是带分数时，先都化成假分数，再乘除数的倒数。$1\\frac{1}{4}$ 分钟 $3\\frac{3}{4}$ 加仑：$\\frac{15}{4} \\div \\frac{5}{4} = \\frac{15}{4} \\times \\frac{4}{5} = 3$ 加仑/分钟。",
          ],
          [
            "$1\\frac{1}{4}$ minutes at $3$ gallons a minute: $3 + \\frac{3}{4} = 3\\frac{3}{4}$ gallons.",
            "每分钟 $3$ 加仑，$1\\frac{1}{4}$ 分钟：$3 + \\frac{3}{4} = 3\\frac{3}{4}$ 加仑。",
          ],
          [
            "Dividing the whole parts and the fraction parts separately does not work: $3 \\div 1$ and $\\frac{3}{4} \\div \\frac{1}{4}$ give nothing useful.",
            "不能把整数部分和分数部分分别相除：$3 \\div 1$ 和 $\\frac{3}{4} \\div \\frac{1}{4}$ 都没有用。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          let a: Q;
          let b: Q;
          do {
            a = mixedQ(rng);
            b = mixedQ(rng, 4);
          } while (a.eq(b));
          return rateProblem(ctx, a, b);
        },
        tapeFigure(
          [
            {
              total: "15/4",
              pieces: [
                { size: 1, text: "3/4", lit: true },
                { size: 1, text: "3/4", lit: true },
                { size: 1, text: "3/4", lit: true },
                { size: 1, text: "3/4", lit: true },
                { size: 1, text: "3/4" },
              ],
            },
          ],
          [
            "Five quarter minutes, 3/4 gallon in each; the four shaded quarters make one minute and 3 gallons.",
            "五个四分之一分钟，每个 3/4 加仑；涂色的四个合成一分钟，共 3 加仑。",
          ],
        ),
      ),
    ],
  ),
  [
    "A tap fills $3\\frac{3}{4}$ gallons in $1\\frac{1}{4}$ minutes. How many gallons does it fill in one minute?",
    "一个水龙头 $1\\frac{1}{4}$ 分钟注入 $3\\frac{3}{4}$ 加仑水。它一分钟注入多少加仑？",
  ],
  [
    "$\\frac{15}{4} \\div \\frac{5}{4} = 3$, and $1\\frac{1}{4}$ minutes at $3$ gallons a minute give $3\\frac{3}{4}$ gallons.",
    "$\\frac{15}{4} \\div \\frac{5}{4} = 3$；每分钟 $3$ 加仑，$1\\frac{1}{4}$ 分钟正好 $3\\frac{3}{4}$ 加仑。",
  ],
  ["write mixed numbers as improper fractions and divide them to find unit rates.", "把带分数化成假分数，再相除求单位率。"],
);

/** scaledProblem asks for the amount that goes with m units at the rate a per b, or the inverse, checked by scaling the given pair. */
function scaledProblem(ctx: RateContext, a: Q, b: Q, m: Q, inverse: boolean) {
  const rate = inverse ? b.div(a) : a.div(b);
  const answer = rate.mul(m);
  const [top, bottom] = inverse ? [b, a] : [a, b];
  const name = inverse ? ctx.inverseRate : ctx.rate;
  const factor = m.div(bottom);
  return valued(
    [
      `${ctx.given(a, b).en} ${(inverse ? ctx.inverse(m) : ctx.scaled(m)).en}`,
      `${ctx.given(a, b)["zh-CN"]}${(inverse ? ctx.inverse(m) : ctx.scaled(m))["zh-CN"]}`,
    ],
    answer,
    [
      [["Unit rate", "求单位率"], [`First find ${name.en}:`, `先求${name["zh-CN"]}：`], [divided(top, bottom)]],
      [
        ["Multiply", "相乘"],
        [`Multiply the unit rate by $${ml(m)}$:`, `用单位率乘 $${ml(m)}$：`],
        [`${rate.toLatex()} \\times ${m.toLatex()} = ${answer.toLatex()}${mixedTail(answer)}`],
      ],
    ],
    [
      `Scale the given pair instead: $${ml(m)}$ is $${m.toLatex()} \\div ${bottom.toLatex()} = ${factor.toLatex()}$ times $${ml(bottom)}$, and $${factor.toLatex()} \\times ${top.toLatex()} = ${answer.toLatex()}$.`,
      `也可以直接放大给出的一对数：$${ml(m)}$ 是 $${ml(bottom)}$ 的 $${m.toLatex()} \\div ${bottom.toLatex()} = ${factor.toLatex()}$ 倍，$${factor.toLatex()} \\times ${top.toLatex()} = ${answer.toLatex()}$。`,
    ],
    [
      [top.mul(m), "That multiplies by the given amount without first finding the unit rate.", "这是没有先求单位率，就直接乘给出的量。"],
      [bottom.div(top).mul(m), "That uses the unit rate the wrong way round.", "这是把单位率用反了。"],
      [rate.add(m), "That adds the unit rate instead of multiplying by it.", "这是加单位率，而不是乘单位率。"],
      [m.div(rate), "That divides by the unit rate instead of multiplying.", "这是除以单位率，而不是乘单位率。"],
    ],
  );
}

/** solvingUnitRateProblemsUsingRatiosOfFractions scales and compares rates given by fractions. */
export const solvingUnitRateProblemsUsingRatiosOfFractions = withIntro(
  topic(
    "solving-unit-rate-problems-using-ratios-of-fractions",
    t("Solving Unit Rate Problems Using Ratios of Fractions", "用分数之比的单位率解决问题"),
    t(
      "Find the unit rate, then multiply by the amount asked about. With 3/4 cup of sugar for every 1/2 cup of flour, there are 3/2 cups of sugar per cup of flour, so 3 cups of flour need 9/2 = 4 1/2 cups of sugar. To compare two rates, compare their unit rates.",
      "先求单位率，再乘所问的量。每 1/2 杯面粉用 3/4 杯糖，即每杯面粉用 3/2 杯糖，所以 3 杯面粉需要 9/2 = 4 1/2 杯糖。比较两个速率，就比较它们的单位率。",
    ),
    ["unit-rates-associated-with-ratios-of-fractions"],
    ["7.RP.A.1"],
    [
      lesson(
        "using-a-fractional-unit-rate",
        ["Using the unit rate", "用单位率计算"],
        [
          [
            "First find the unit rate, then multiply it by the amount asked about. $\\frac{3}{4}$ cup of sugar for every $\\frac{1}{2}$ cup of flour is $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{2}$ cups of sugar per cup of flour, so $3$ cups of flour need $\\frac{3}{2} \\times 3 = \\frac{9}{2} = 4\\frac{1}{2}$ cups of sugar.",
            "先求单位率，再乘所问的量。每 $\\frac{1}{2}$ 杯面粉用 $\\frac{3}{4}$ 杯糖，即每杯面粉用 $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{2}$ 杯糖，所以 $3$ 杯面粉要 $\\frac{3}{2} \\times 3 = \\frac{9}{2} = 4\\frac{1}{2}$ 杯糖。",
          ],
          [
            "$3$ cups of flour are six half cups, and $6 \\times \\frac{3}{4} = \\frac{9}{2}$ cups of sugar.",
            "$3$ 杯面粉是六个半杯，$6 \\times \\frac{3}{4} = \\frac{9}{2}$ 杯糖。",
          ],
          [
            "Do not multiply the given amount straight away: $\\frac{3}{4}$ goes with half a cup, not with one cup.",
            "不要直接乘给出的量：$\\frac{3}{4}$ 杯糖配的是半杯面粉，不是一杯。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          let a: Q;
          let b: Q;
          do {
            a = properQ(rng, 6);
            b = properQ(rng, 6);
          } while (a.eq(b));
          const m = rng.bool(0.7) ? Q.of(rng.int(2, 9)) : properQ(rng, 6);
          return scaledProblem(ctx, a, b, m, rng.bool(0.3));
        },
        tapeFigure(
          [
            {
              total: "9/2",
              pieces: Array.from({ length: 6 }, (_, i) => ({ size: 1, text: "3/4", lit: i < 2 })),
            },
          ],
          [
            "Six half cups of flour, each with 3/4 cup of sugar; the two shaded halves make one cup and 3/2 cups of sugar.",
            "六个半杯面粉，每个配 3/4 杯糖；涂色的两个半杯合成一杯，配 3/2 杯糖。",
          ],
        ),
      ),
      lesson(
        "comparing-fractional-rates",
        ["Comparing rates", "比较速率"],
        [
          [
            "To compare two rates, find each unit rate and compare those. Ava walks $\\frac{2}{3}$ mile in $\\frac{1}{4}$ hour, which is $\\frac{8}{3}$ miles per hour; Ben walks $\\frac{1}{2}$ mile in $\\frac{1}{6}$ hour, which is $3$ miles per hour. Ben walks faster.",
            "比较两个速率，要先分别求出单位率再比较。Ava $\\frac{1}{4}$ 小时走 $\\frac{2}{3}$ 英里，每小时 $\\frac{8}{3}$ 英里；Ben $\\frac{1}{6}$ 小时走 $\\frac{1}{2}$ 英里，每小时 $3$ 英里。Ben 走得更快。",
          ],
          [
            "In one hour Ben covers $3 = \\frac{9}{3}$ miles and Ava $\\frac{8}{3}$ miles, so Ben goes farther.",
            "一小时 Ben 走 $3 = \\frac{9}{3}$ 英里，Ava 走 $\\frac{8}{3}$ 英里，Ben 走得更远。",
          ],
          [
            "Do not compare only the distances: Ava walks farther, but she also takes longer.",
            "不要只比较路程：Ava 走得远，但她用的时间也更长。",
          ],
        ],
        (rng) => {
          const [p, q] = twoNames(rng);
          let a1: Q;
          let b1: Q;
          let a2: Q;
          let b2: Q;
          do {
            a1 = properQ(rng, 6);
            b1 = properQ(rng, 6);
            a2 = properQ(rng, 6);
            b2 = properQ(rng, 6);
          } while (a1.eq(a2) || b1.eq(b2) || a1.eq(b1) || a2.eq(b2));
          const [r1, r2] = [a1.div(b1), a2.div(b2)];
          const c = r1.cmp(r2);
          const sym = c > 0 ? ">" : c < 0 ? "<" : "=";
          const options: Pair[] = [
            [p, p],
            [q, q],
            ["They paint equally fast", "一样快"],
          ];
          const correct = c > 0 ? 0 : c < 0 ? 1 : 2;
          const reason = (i: number): Wrong => {
            const option = options[i] as Pair;
            if (i === 2)
              return [
                option,
                `Their rates differ: $${r1.toLatex()}$ and $${r2.toLatex()}$ fences per hour.`,
                `两人的速率不同：每小时 $${r1.toLatex()}$ 道和 $${r2.toLatex()}$ 道。`,
              ];
            if (c === 0) return [option, `Both paint $${r1.toLatex()}$ fences per hour.`, `两人每小时都刷 $${r1.toLatex()}$ 道。`];
            const [slow, fast] = c > 0 ? [r2, r1] : [r1, r2];
            return [
              option,
              `${i === 0 ? p : q} paints only $${slow.toLatex()}$ fences per hour, less than $${fast.toLatex()}$.`,
              `${i === 0 ? p : q} 每小时只刷 $${slow.toLatex()}$ 道，比 $${fast.toLatex()}$ 少。`,
            ];
          };
          return chosen(
            rng,
            [
              `${p} paints $${a1.toLatex()}$ of a fence in $${b1.toLatex()}$ hour. ${q} paints $${a2.toLatex()}$ of the same kind of fence in $${b2.toLatex()}$ hour. Who paints faster?`,
              `${p} $${b1.toLatex()}$ 小时刷了 $${a1.toLatex()}$ 道篱笆，${q} $${b2.toLatex()}$ 小时刷了 $${a2.toLatex()}$ 道同样的篱笆。谁刷得更快？`,
            ],
            options[correct] as Pair,
            [0, 1, 2].filter((i) => i !== correct).map(reason),
            [
              [
                ["Unit rates", "求单位率"],
                ["Divide each part of a fence by its time:", "用每人刷的篱笆数除以时间："],
                [`\\text{${p}: } ${divided(a1, b1)}`, `\\text{${q}: } ${divided(a2, b2)}`],
              ],
              [
                ["Compare", "比较"],
                [
                  `Since $${r1.toLatex()} ${sym} ${r2.toLatex()}$, ${c === 0 ? "they paint equally fast" : `${c > 0 ? p : q} paints faster`}.`,
                  `因为 $${r1.toLatex()} ${sym} ${r2.toLatex()}$，${c === 0 ? "两人一样快" : `${c > 0 ? p : q} 刷得更快`}。`,
                ],
              ],
            ],
            [
              `Cross-multiply instead: $${a1.toLatex()} \\times ${b2.toLatex()} = ${a1.mul(b2).toLatex()} ${sym} ${a2.mul(b1).toLatex()} = ${a2.toLatex()} \\times ${b1.toLatex()}$, the same order.`,
              `也可以交叉相乘：$${a1.toLatex()} \\times ${b2.toLatex()} = ${a1.mul(b2).toLatex()} ${sym} ${a2.mul(b1).toLatex()} = ${a2.toLatex()} \\times ${b1.toLatex()}$，大小顺序相同。`,
            ],
          );
        },
        tapeFigure(
          [{ pieces: [{ size: 8, text: "8/3" }] }, { pieces: [{ size: 9, text: "3", lit: true }] }],
          [
            "Two bars for the miles in one hour: 8/3 for one walker and the longer 3 for the other.",
            "两个长条表示一小时走的英里数：一人 8/3，另一人 3，更长。",
          ],
        ),
      ),
    ],
  ),
  [
    "A recipe uses $\\frac{3}{4}$ cup of sugar for every $\\frac{1}{2}$ cup of flour. How much sugar goes with $3$ cups of flour?",
    "一份食谱每用 $\\frac{1}{2}$ 杯面粉，就要用 $\\frac{3}{4}$ 杯糖。$3$ 杯面粉要配多少糖？",
  ],
  [
    "$\\frac{3}{2} \\times 3 = \\frac{9}{2}$, and six half cups of flour need $6 \\times \\frac{3}{4} = \\frac{9}{2}$ cups too.",
    "$\\frac{3}{2} \\times 3 = \\frac{9}{2}$；六个半杯面粉也是 $6 \\times \\frac{3}{4} = \\frac{9}{2}$ 杯糖。",
  ],
  ["use a unit rate to find any amount, and compare two rates by their unit rates.", "用单位率求任意数量，并用单位率比较两个速率。"],
);

/** solvingUnitRateProblemsUsingRatiosOfMixedNumbers scales rates given by mixed numbers in both directions. */
export const solvingUnitRateProblemsUsingRatiosOfMixedNumbers = withIntro(
  topic(
    "solving-unit-rate-problems-using-ratios-of-mixed-numbers",
    t("Solving Unit Rate Problems Using Ratios of Mixed Numbers", "用带分数之比的单位率解决问题"),
    t(
      "A hiker who walks 2 1/4 miles in 3/4 hour walks 9/4 ÷ 3/4 = 3 miles per hour, so in 2 1/2 hours she walks 3 × 5/2 = 7 1/2 miles. The rate the other way round, 1/3 hour per mile, gives the time: 9 miles take 9 × 1/3 = 3 hours.",
      "徒步者 3/4 小时走 2 1/4 英里，速度是 9/4 ÷ 3/4 = 3 英里/小时，所以 2 1/2 小时走 3 × 5/2 = 7 1/2 英里。反过来的单位率是每英里 1/3 小时，可用来求时间：9 英里需要 9 × 1/3 = 3 小时。",
    ),
    ["unit-rates-associated-with-ratios-of-mixed-numbers", "solving-unit-rate-problems-using-ratios-of-fractions"],
    ["7.RP.A.1"],
    [
      lesson(
        "amount-for-a-mixed-number",
        ["Finding an amount", "求对应的量"],
        [
          [
            "First find the unit rate, the amount for one unit. Then multiply it by the number of units, writing any mixed number as an improper fraction. $2\\frac{1}{4}$ miles in $\\frac{3}{4}$ hour is $\\frac{9}{4} \\div \\frac{3}{4} = 3$ miles per hour, so $2\\frac{1}{2}$ hours give $3 \\times \\frac{5}{2} = \\frac{15}{2} = 7\\frac{1}{2}$ miles.",
            "先求单位率，即一个单位对应的量，再乘单位数；带分数要先化成假分数。$\\frac{3}{4}$ 小时走 $2\\frac{1}{4}$ 英里，即每小时 $\\frac{9}{4} \\div \\frac{3}{4} = 3$ 英里，所以 $2\\frac{1}{2}$ 小时走 $3 \\times \\frac{5}{2} = \\frac{15}{2} = 7\\frac{1}{2}$ 英里。",
          ],
          [
            "Two hours give $6$ miles and the half hour $1\\frac{1}{2}$ more: $6 + 1\\frac{1}{2} = 7\\frac{1}{2}$.",
            "两小时走 $6$ 英里，再加半小时 $1\\frac{1}{2}$ 英里：$6 + 1\\frac{1}{2} = 7\\frac{1}{2}$。",
          ],
          [
            "Write $2\\frac{1}{2}$ as $\\frac{5}{2}$ before multiplying; $3 \\times 2\\frac{1}{2}$ is not $6\\frac{1}{2}$.",
            "相乘前先把 $2\\frac{1}{2}$ 写成 $\\frac{5}{2}$；$3 \\times 2\\frac{1}{2}$ 不是 $6\\frac{1}{2}$。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          const a = mixedQ(rng, 4);
          let b = rng.bool() ? properQ(rng, 4) : mixedQ(rng, 4);
          // Equal quantities would make the unit rate 1, with nothing to divide out.
          if (b.eq(a)) b = properQ(rng, 4);
          const m = rng.bool() ? mixedQ(rng, 4) : Q.of(rng.int(2, 8));
          return scaledProblem(ctx, a, b, m, false);
        },
        tapeFigure(
          [
            {
              total: "15/2",
              pieces: [
                { size: 2, text: "3", lit: true },
                { size: 2, text: "3" },
                { size: 1, text: "3/2" },
              ],
            },
          ],
          [
            "Two whole hours at 3 miles and a half hour at 3/2 miles make 15/2 miles.",
            "两整小时各 3 英里，半小时 3/2 英里，共 15/2 英里。",
          ],
        ),
      ),
      lesson(
        "the-other-quantity-for-a-mixed-number",
        ["Using the rate the other way round", "反过来用单位率"],
        [
          [
            "Every ratio has two unit rates, one for each quantity. To find the time for a distance, use the hours per mile. $2\\frac{1}{4}$ miles in $\\frac{3}{4}$ hour is $\\frac{3}{4} \\div \\frac{9}{4} = \\frac{1}{3}$ hour per mile, so $9$ miles take $9 \\times \\frac{1}{3} = 3$ hours.",
            "每个比都有两个单位率，每个量各对应一个。要求走一段路的时间，就用每英里所需的小时数。$\\frac{3}{4}$ 小时走 $2\\frac{1}{4}$ 英里，即每英里 $\\frac{3}{4} \\div \\frac{9}{4} = \\frac{1}{3}$ 小时，所以 $9$ 英里要 $9 \\times \\frac{1}{3} = 3$ 小时。",
          ],
          ["At $3$ miles per hour, $3$ hours cover $3 \\times 3 = 9$ miles.", "每小时 $3$ 英里，$3$ 小时正好走 $3 \\times 3 = 9$ 英里。"],
          [
            "Pick the rate whose unit matches the given amount: for miles given, use hours per mile.",
            "要选单位与给出的量相配的单位率：给出英里数，就用每英里的小时数。",
          ],
        ],
        (rng) => {
          const ctx = rng.pick(rateContexts);
          const a = mixedQ(rng, 4);
          let b = rng.bool() ? properQ(rng, 4) : mixedQ(rng, 4);
          // Equal quantities would make the unit rate 1, with nothing to divide out.
          if (b.eq(a)) b = properQ(rng, 4);
          const m = rng.bool() ? mixedQ(rng, 4) : Q.of(rng.int(2, 12));
          return scaledProblem(ctx, a, b, m, true);
        },
        equalTape(9, "1/3", "3"),
      ),
    ],
  ),
  [
    "A hiker walks $2\\frac{1}{4}$ miles in $\\frac{3}{4}$ hour. How far does she walk in $2\\frac{1}{2}$ hours, and how long do $9$ miles take?",
    "一名徒步者 $\\frac{3}{4}$ 小时走 $2\\frac{1}{4}$ 英里。$2\\frac{1}{2}$ 小时她走多远？走 $9$ 英里要多久？",
  ],
  [
    "$3 \\times \\frac{5}{2} = 7\\frac{1}{2}$ miles and $9 \\times \\frac{1}{3} = 3$ hours; $3$ hours at $3$ miles per hour are $9$ miles.",
    "$3 \\times \\frac{5}{2} = 7\\frac{1}{2}$ 英里，$9 \\times \\frac{1}{3} = 3$ 小时；每小时 $3$ 英里走 $3$ 小时正好 $9$ 英里。",
  ],
  ["use unit rates with mixed numbers in both directions to find an amount or a time.", "用含带分数的单位率，正反两个方向求数量或时间。"],
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
  xs
    .map((x, i) => {
      const shown = `\\frac{${ys[i]}}{${x}}`;
      const value = Q.of(ys[i]!, x).toLatex();
      return shown === value ? shown : `${shown} = ${value}`;
    })
    .join(", \\quad ");

/** understandingProportionalRelationshipsUsingTables tests tables for proportionality and finds the constant. */
export const understandingProportionalRelationshipsUsingTables = withIntro(
  topic(
    "understanding-proportional-relationships-using-tables",
    t("Understanding Proportional Relationships Using Tables", "用表格理解正比例关系"),
    t(
      "Two quantities are in a proportional relationship when y ÷ x is the same number k for every pair: y = kx. This k is the constant of proportionality. In a table, divide each y by its x and check that the quotients agree.",
      "如果每一对数的 y ÷ x 都等于同一个数 k，即 y = kx，那么这两个量成正比例关系，k 叫作比例常数。在表格中，用每个 y 除以对应的 x，看商是否都相等。",
    ),
    ["analyzing-two-variable-equations-using-tables", "unit-rates-associated-with-ratios-of-fractions"],
    ["7.RP.A.2a", "7.RP.A.2b"],
    [
      lesson(
        "is-the-table-proportional",
        ["Is the table proportional?", "表格是否成正比例？"],
        [
          [
            "A table is proportional when $\\frac{y}{x}$ is the same in every column. In the table $x: 2, 4, 6$ and $y: 5, 10, 15$, every $\\frac{y}{x} = \\frac{5}{2}$, so it is proportional. For $x: 1, 2, 3$ and $y: 4, 6, 8$, $\\frac{4}{1} \\ne \\frac{6}{2}$, so it is not.",
            "每一列的 $\\frac{y}{x}$ 都相同时，表格成正比例。表格 $x: 2, 4, 6$，$y: 5, 10, 15$ 中，每个 $\\frac{y}{x} = \\frac{5}{2}$，所以成正比例。$x: 1, 2, 3$，$y: 4, 6, 8$ 中，$\\frac{4}{1} \\ne \\frac{6}{2}$，所以不成正比例。",
          ],
          [
            "In the first table, doubling $x$ from $2$ to $4$ doubles $y$ from $5$ to $10$; in the second, doubling $x$ from $1$ to $2$ takes $y$ from $4$ only to $6$.",
            "第一个表格中，$x$ 从 $2$ 加倍到 $4$，$y$ 也从 $5$ 加倍到 $10$；第二个表格中，$x$ 从 $1$ 加倍到 $2$，$y$ 却只从 $4$ 变到 $6$。",
          ],
          [
            "$y$ growing steadily as $x$ grows is not enough: the quotients $\\frac{y}{x}$ must all be equal.",
            "$y$ 随 $x$ 均匀增大还不够：每个商 $\\frac{y}{x}$ 都必须相等。",
          ],
        ],
        (rng) => {
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
          const k0 = Q.of(ys[0]!, xs[0]!);
          const proportional = xs.every((x, i) => Q.of(ys[i]!, x).eq(k0));
          const j = proportional ? xs.length - 1 : xs.findIndex((x, i) => !Q.of(ys[i]!, x).eq(k0));
          const expected = k0.mul(Q.of(xs[j]!));
          return decided(
            rng,
            [
              `Is the relationship between $x$ and $y$ in the table proportional? $$${xyTable(xs.map(String), ys.map(String))}$$`,
              `表格中 $x$ 与 $y$ 的关系是正比例关系吗？$$${xyTable(xs.map(String), ys.map(String))}$$`,
            ],
            proportional,
            [
              [["Divide", "相除"], ["Divide each $y$ by its $x$:", "用每个 $y$ 除以对应的 $x$："], [quotientsLatex(xs, ys)]],
              [
                ["Compare", "比较"],
                proportional
                  ? [
                      `All the quotients equal $${k0.toLatex()}$, so the relationship is proportional.`,
                      `商都等于 $${k0.toLatex()}$，所以是正比例关系。`,
                    ]
                  : ["The quotients are not all equal, so the relationship is not proportional.", "商不全相等，所以不是正比例关系。"],
              ],
            ],
            proportional
              ? [
                  `Every $y$ is $${k0.toLatex()}$ times its $x$: $${k0.toLatex()} \\times ${xs[j]} = ${ys[j]}$.`,
                  `每个 $y$ 都是对应 $x$ 的 $${k0.toLatex()}$ 倍：$${k0.toLatex()} \\times ${xs[j]} = ${ys[j]}$。`,
                ]
              : [
                  `With the first column's rate, $x = ${xs[j]}$ would need $y = ${k0.toLatex()} \\times ${xs[j]} = ${expected.toLatex()}$, not $${ys[j]}$.`,
                  `按第一列的比率，$x = ${xs[j]}$ 时 $y$ 应是 $${k0.toLatex()} \\times ${xs[j]} = ${expected.toLatex()}$，而不是 $${ys[j]}$。`,
                ],
            proportional
              ? [
                  `Every quotient $\\frac{y}{x}$ is $${k0.toLatex()}$, so the table is proportional.`,
                  `每个商 $\\frac{y}{x}$ 都是 $${k0.toLatex()}$，所以表格成正比例。`,
                ]
              : [
                  `$\\frac{y}{x}$ is $${k0.toLatex()}$ at $x = ${xs[0]}$ and $${Q.of(ys[j]!, xs[j]!).toLatex()}$ at $x = ${xs[j]}$.`,
                  `$\\frac{y}{x}$ 在 $x = ${xs[0]}$ 处是 $${k0.toLatex()}$，在 $x = ${xs[j]}$ 处是 $${Q.of(ys[j]!, xs[j]!).toLatex()}$。`,
                ],
          );
        },
        tableFigure(["2", "4", "6"], [5, 10, 15]),
      ),
      lesson(
        "constant-of-proportionality-from-a-table",
        ["The constant of proportionality", "求比例常数"],
        [
          [
            "In a proportional table, $\\frac{y}{x}$ is the same for every column. That common value is the constant of proportionality $k$, and the relationship is $y = kx$. For $x: 2, 4, 6$ and $y: 5, 10, 15$, $k = \\frac{5}{2}$, so $y = \\frac{5}{2}x$.",
            "在成正比例的表格中，每一列的 $\\frac{y}{x}$ 都相同。这个相同的值就是比例常数 $k$，关系式是 $y = kx$。对于 $x: 2, 4, 6$，$y: 5, 10, 15$，$k = \\frac{5}{2}$，所以 $y = \\frac{5}{2}x$。",
          ],
          [
            "Another column agrees: $\\frac{15}{6} = \\frac{5}{2}$, and $\\frac{5}{2} \\times 4 = 10$.",
            "另一列也相符：$\\frac{15}{6} = \\frac{5}{2}$，而且 $\\frac{5}{2} \\times 4 = 10$。",
          ],
          ["$k$ is $y$ divided by $x$, not $x$ divided by $y$.", "$k$ 是 $y$ 除以 $x$，不是 $x$ 除以 $y$。"],
        ],
        (rng) => {
          const k = smallRate(rng);
          const xs = tableXs(rng, Number(k.d));
          const ys = xs.map((x) => Number(k.mul(Q.of(x)).n));
          return valued(
            [
              `The table shows a proportional relationship between $x$ and $y$. What is the constant of proportionality? $$${xyTable(xs.map(String), ys.map(String))}$$`,
              `表格表示 $x$ 与 $y$ 的正比例关系。比例常数是多少？$$${xyTable(xs.map(String), ys.map(String))}$$`,
            ],
            k,
            [
              [
                ["Pick a column", "选一列"],
                [`Take the column with $x = ${xs[0]}$ and $y = ${ys[0]}$:`, `取 $x = ${xs[0]}$、$y = ${ys[0]}$ 这一列：`],
                [`k = \\frac{y}{x} = \\frac{${ys[0]}}{${xs[0]}}`],
              ],
              [
                ["Simplify", "化简"],
                ["Write the quotient in lowest terms:", "把商化成最简形式："],
                [`\\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}`],
              ],
            ],
            [
              `Another column gives the same: $\\frac{${ys[3]}}{${xs[3]}} = ${k.toLatex()}$.`,
              `另一列结果相同：$\\frac{${ys[3]}}{${xs[3]}} = ${k.toLatex()}$。`,
            ],
            [
              [Q.one.div(k), "That divides $x$ by $y$; $k$ is $y$ divided by $x$.", "这是 $x$ 除以 $y$；$k$ 是 $y$ 除以 $x$。"],
              [
                Q.of(ys[1]! - ys[0]!),
                "That is how much $y$ grows from one column to the next, not $y \\div x$.",
                "这是 $y$ 从一列到下一列增加的量，不是 $y \\div x$。",
              ],
              [Q.of(ys[0]! - xs[0]!), "That subtracts $x$ from $y$ instead of dividing.", "这是 $y$ 减 $x$，而不是相除。"],
              [Q.of(ys[0]!), "That is a value of $y$, not $y \\div x$.", "这是 $y$ 的一个值，不是 $y \\div x$。"],
            ],
          );
        },
        tableFigure(["2", "4", "6"], [5, 10, 15]),
      ),
      lesson(
        "completing-a-proportional-table",
        ["Completing a proportional table", "补全正比例表格"],
        [
          [
            "To fill in a proportional table, find $k$ from a complete column, then use $y = kx$. For $x: 2, 4, 10$ and $y: 5, 10, \\square$: $k = \\frac{5}{2}$, so the missing $y$ is $\\frac{5}{2} \\times 10 = 25$. To find a missing $x$, divide its $y$ by $k$.",
            "补全正比例表格时，先由一整列求出 $k$，再用 $y = kx$。对于 $x: 2, 4, 10$，$y: 5, 10, \\square$：$k = \\frac{5}{2}$，所以缺少的 $y$ 是 $\\frac{5}{2} \\times 10 = 25$。求缺少的 $x$，就用它的 $y$ 除以 $k$。",
          ],
          ["$10$ is $5$ times $2$, so $y$ is $5$ times $5$: $25$.", "$10$ 是 $2$ 的 $5$ 倍，所以 $y$ 也是 $5$ 的 $5$ 倍：$25$。"],
          [
            "Do not add the same step to $y$ each time: $y$ grows by $k$ times the step in $x$.",
            "不要每次给 $y$ 加同样的数：$y$ 增加的是 $x$ 增加量的 $k$ 倍。",
          ],
        ],
        (rng) => {
          const k = smallRate(rng);
          const xs = tableXs(rng, Number(k.d));
          const ys = xs.map((x) => Number(k.mul(Q.of(x)).n));
          const i = rng.int(2, 3);
          const askY = rng.bool();
          const shownX = xs.map((x, j) => (j === i && !askY ? "\\square" : String(x)));
          const shownY = ys.map((y, j) => (j === i && askY ? "\\square" : String(y)));
          const answer = askY ? ys[i]! : xs[i]!;
          const step = askY ? xs[i]! - xs[i - 1]! : ys[i]! - ys[i - 1]!;
          const factor = askY ? Q.of(xs[i]!, xs[0]!) : Q.of(ys[i]!, ys[0]!);
          return valued(
            [
              `The table shows a proportional relationship between $x$ and $y$. Find the missing number. $$${xyTable(shownX, shownY)}$$`,
              `表格表示 $x$ 与 $y$ 的正比例关系。求缺少的数。$$${xyTable(shownX, shownY)}$$`,
            ],
            answer,
            [
              [["Find k", "求 k"], ["Use the first column:", "用第一列："], [`k = \\frac{${ys[0]}}{${xs[0]}} = ${k.toLatex()}`]],
              askY
                ? [
                    ["Multiply", "相乘"],
                    ["Multiply the $x$ by $k$:", "用 $x$ 乘 $k$："],
                    [`y = ${k.toLatex()} \\times ${xs[i]} = ${answer}`],
                  ]
                : [["Divide", "相除"], ["Divide the $y$ by $k$:", "用 $y$ 除以 $k$："], [`x = ${ys[i]} \\div ${k.toLatex()} = ${answer}`]],
            ],
            askY
              ? [
                  `$x = ${xs[i]}$ is $${factor.toLatex()}$ times $${xs[0]}$, and $${factor.toLatex()} \\times ${ys[0]} = ${answer}$.`,
                  `$x = ${xs[i]}$ 是 $${xs[0]}$ 的 $${factor.toLatex()}$ 倍，$${factor.toLatex()} \\times ${ys[0]} = ${answer}$。`,
                ]
              : [
                  `$y = ${ys[i]}$ is $${factor.toLatex()}$ times $${ys[0]}$, and $${factor.toLatex()} \\times ${xs[0]} = ${answer}$.`,
                  `$y = ${ys[i]}$ 是 $${ys[0]}$ 的 $${factor.toLatex()}$ 倍，$${factor.toLatex()} \\times ${xs[0]} = ${answer}$。`,
                ],
            askY
              ? [
                  [
                    ys[i - 1]! + step,
                    "That adds the change in $x$ to $y$, but $y$ grows by $k$ times that change.",
                    "这是把 $x$ 的增加量加到 $y$ 上，但 $y$ 增加的是它的 $k$ 倍。",
                  ],
                  [Q.of(xs[i]!).div(k), "That divides by $k$ instead of multiplying.", "这是除以 $k$，而不是乘 $k$。"],
                  [
                    ys[i - 1]! + (ys[1]! - ys[0]!),
                    "That repeats the first step in $y$, but the $x$ values do not grow evenly.",
                    "这是重复 $y$ 的第一次增加量，但 $x$ 并不是均匀增加的。",
                  ],
                ]
              : [
                  [
                    xs[i - 1]! + step,
                    "That adds the change in $y$ to $x$, but $x$ grows by that change divided by $k$.",
                    "这是把 $y$ 的增加量加到 $x$ 上，但 $x$ 增加的是它除以 $k$。",
                  ],
                  [Q.of(ys[i]!).mul(k), "That multiplies by $k$ instead of dividing.", "这是乘 $k$，而不是除以 $k$。"],
                  [
                    xs[i - 1]! + (xs[1]! - xs[0]!),
                    "That repeats the first step in $x$, but the $y$ values do not grow evenly.",
                    "这是重复 $x$ 的第一次增加量，但 $y$ 并不是均匀增加的。",
                  ],
                ],
          );
        },
        tableFigure(["2", "4", "10"], [5, 10, null]),
      ),
    ],
  ),
  [
    "A table lists $x: 2, 4, 6$ and $y: 5, 10, 15$. Is $y$ the same number of times $x$ in every column?",
    "一张表格列出 $x: 2, 4, 6$ 和 $y: 5, 10, 15$。每一列中 $y$ 是不是 $x$ 的同样倍数？",
  ],
  [
    "$\\frac{5}{2} = \\frac{10}{4} = \\frac{15}{6} = \\frac{5}{2}$, so yes: $y = \\frac{5}{2}x$.",
    "$\\frac{5}{2} = \\frac{10}{4} = \\frac{15}{6} = \\frac{5}{2}$，所以是：$y = \\frac{5}{2}x$。",
  ],
  [
    "test tables for proportionality, find the constant of proportionality and complete proportional tables.",
    "判断表格是否成正比例，求比例常数，并补全正比例表格。",
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
export const understandingProportionalRelationshipsUsingGraphs = withIntro(
  topic(
    "understanding-proportional-relationships-using-graphs",
    t("Understanding Proportional Relationships Using Graphs", "用图像理解正比例关系"),
    t(
      "The graph of a proportional relationship y = kx is a straight line through the origin. The point (1, k) is on it, and for any point (x, y) on it other than the origin, k = y/x. A straight line that misses the origin, or a curve, is not proportional.",
      "正比例关系 y = kx 的图像是一条过原点的直线。点 (1, k) 在直线上；对直线上原点以外的任意一点 (x, y)，k = y/x。不过原点的直线或曲线都不是正比例关系。",
    ),
    ["understanding-proportional-relationships-using-tables", "analyzing-two-variable-equations-using-graphs"],
    ["7.RP.A.2a", "7.RP.A.2b", "7.RP.A.2d"],
    [
      lesson(
        "is-the-graph-proportional",
        ["Is the graph proportional?", "图像是否成正比例？"],
        [
          [
            "A graph shows a proportional relationship only if it is a straight line and it passes through $(0, 0)$. The line through $(0, 2)$ and $(4, 6)$ is straight but misses the origin, so it is not proportional.",
            "只有当图像是直线并且经过 $(0, 0)$ 时，才表示正比例关系。过 $(0, 2)$ 和 $(4, 6)$ 的直线是直的，但不过原点，所以不是正比例关系。",
          ],
          [
            "At $(4, 6)$, $\\frac{y}{x} = \\frac{3}{2}$, but $\\frac{3}{2} \\times 4 = 6$ would need the line to start at $(0, 0)$, and it starts at $(0, 2)$.",
            "在 $(4, 6)$ 处 $\\frac{y}{x} = \\frac{3}{2}$；但要成正比例，直线必须从 $(0, 0)$ 出发，而它从 $(0, 2)$ 出发。",
          ],
          ["A line that rises is not enough: it must also pass through the origin.", "直线上升还不够：它还必须经过原点。"],
        ],
        (rng) => {
          const straightThroughOrigin: Pair = ["Yes, because it is a straight line through the origin.", "是，因为它是一条过原点的直线。"];
          const missesOrigin: Pair = ["No, because it is a straight line that misses the origin.", "否，因为它是一条不过原点的直线。"];
          const notStraight: Pair = [
            "No, because it passes through the origin but is not a straight line.",
            "否，因为它经过原点，但不是直线。",
          ];
          const rising: Pair = ["Yes, because $y$ increases as $x$ increases.", "是，因为 $x$ 增大时 $y$ 也增大。"];
          const kind = rng.int(0, 3);
          if (kind === 3) {
            const c = rng.int(2, 3);
            const shown: [number, number][] = [
              [0, 0],
              [c, c],
              [2 * c, 4 * c],
            ];
            const curve: PlaneMark = { kind: "curve", f: (x) => (x * x) / c, from: 0, accent: true };
            return chosen(
              rng,
              [
                `The graph shown passes through the points ${pointList(shown, false)}. Does it show a proportional relationship?`,
                `图中的图像经过点 ${pointList(shown, true)}。它表示正比例关系吗？`,
              ],
              notStraight,
              [
                [straightThroughOrigin, "It bends, so it is not a straight line.", "它是弯的，不是直线。"],
                [missesOrigin, "It does pass through the origin $(0, 0)$.", "它确实经过原点 $(0, 0)$。"],
                [rising, "Rising is not enough; $\\frac{y}{x}$ must stay the same.", "上升还不够；$\\frac{y}{x}$ 必须保持不变。"],
              ],
              [
                [
                  ["Origin", "看原点"],
                  ["The graph passes through $(0, 0)$.", "图像经过 $(0, 0)$。"],
                ],
                [
                  ["Straight?", "是否是直线"],
                  ["Compare $\\frac{y}{x}$ at the two other points:", "比较另外两点的 $\\frac{y}{x}$："],
                  [`\\frac{${c}}{${c}} = 1, \\quad \\frac{${4 * c}}{${2 * c}} = 2`],
                ],
              ],
              [
                `Doubling $x$ from $${c}$ to $${2 * c}$ takes $y$ from $${c}$ to $${4 * c}$, four times as much, so $y$ is not a fixed multiple of $x$.`,
                `$x$ 从 $${c}$ 加倍到 $${2 * c}$，$y$ 却从 $${c}$ 变成 $${4 * c}$，是四倍，所以 $y$ 不是 $x$ 的固定倍数。`,
              ],
              relationGraph(
                curve,
                shown,
                t(
                  `A curve through ${shown.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
                  `一条经过 ${shown.map((p) => `(${p[0]}, ${p[1]})`).join("、")} 的曲线。`,
                ),
              ),
            );
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
          const last = shown[shown.length - 1]!;
          return chosen(
            rng,
            [
              `The graph shown passes through the points ${pointList(shown, false)}. Does it show a proportional relationship?`,
              `图中的图像经过点 ${pointList(shown, true)}。它表示正比例关系吗？`,
            ],
            proportional ? straightThroughOrigin : missesOrigin,
            [
              proportional
                ? [missesOrigin, "The line does pass through the origin $(0, 0)$.", "这条直线确实经过原点 $(0, 0)$。"]
                : [
                    straightThroughOrigin,
                    `The line crosses the $y$-axis at $(0, ${b})$, not at the origin.`,
                    `这条直线与 $y$ 轴交于 $(0, ${b})$，不经过原点。`,
                  ],
              [notStraight, "The graph is a straight line.", "这个图像是直线。"],
              proportional
                ? [rising, "Rising is not the reason; a rising line can miss the origin.", "上升不是理由；上升的直线也可能不过原点。"]
                : [rising, "Rising is not enough; the line must also pass through the origin.", "上升还不够；直线还必须经过原点。"],
            ],
            [
              [
                ["Straight?", "是否是直线"],
                ["The points lie on one straight line.", "这些点在同一条直线上。"],
              ],
              [
                ["Origin", "看原点"],
                proportional
                  ? ["The line passes through $(0, 0)$, so it is proportional.", "直线经过 $(0, 0)$，所以是正比例关系。"]
                  : [
                      `The line crosses the $y$-axis at $(0, ${b})$, so it is not proportional.`,
                      `直线与 $y$ 轴交于 $(0, ${b})$，所以不是正比例关系。`,
                    ],
              ],
            ],
            proportional
              ? [
                  `$\\frac{y}{x}$ is the same at both points: $\\frac{${shown[1]![1]}}{${shown[1]![0]}} = \\frac{${last[1]}}{${last[0]}} = ${k.toLatex()}$.`,
                  `两点的 $\\frac{y}{x}$ 相同：$\\frac{${shown[1]![1]}}{${shown[1]![0]}} = \\frac{${last[1]}}{${last[0]}} = ${k.toLatex()}$。`,
                ]
              : [
                  `At $x = 0$ a proportional relationship gives $y = k \\times 0 = 0$, but here $y = ${b}$.`,
                  `正比例关系在 $x = 0$ 时 $y = k \\times 0 = 0$，但这里 $y = ${b}$。`,
                ],
            relationGraph(
              line,
              shown,
              t(
                `A straight line through ${shown.map((pt) => `(${pt[0]}, ${pt[1]})`).join(", ")}.`,
                `一条经过 ${shown.map((pt) => `(${pt[0]}, ${pt[1]})`).join("、")} 的直线。`,
              ),
            ),
          );
        },
        drawn(gradeDrawings3["understanding-proportional-relationships-using-graphs#is-the-graph-proportional"]),
      ),
      lesson(
        "constant-of-proportionality-from-a-graph",
        ["The constant of proportionality from a graph", "由图像求比例常数"],
        [
          [
            "The graph of a proportional relationship is a straight line through the origin. Read any point on it other than the origin; its $y$ divided by its $x$ is $k$. The line through $(6, 4)$ has $k = \\frac{4}{6} = \\frac{2}{3}$, so $y = \\frac{2}{3}x$.",
            "正比例关系的图像是一条过原点的直线。读出直线上原点以外的任意一点，它的 $y$ 除以 $x$ 就是 $k$。经过 $(6, 4)$ 的直线 $k = \\frac{4}{6} = \\frac{2}{3}$，所以 $y = \\frac{2}{3}x$。",
          ],
          [
            "The line also passes through $(3, 2)$, and $\\frac{2}{3} \\times 3 = 2$.",
            "这条直线也经过 $(3, 2)$，而 $\\frac{2}{3} \\times 3 = 2$。",
          ],
          [
            "Divide $y$ by $x$, not $x$ by $y$: here $\\frac{6}{4}$ would be wrong.",
            "用 $y$ 除以 $x$，不是 $x$ 除以 $y$：这里 $\\frac{6}{4}$ 就错了。",
          ],
        ],
        (rng) => {
          const k = smallRate(rng, 6, 6);
          const [p, q] = [Number(k.n), Number(k.d)];
          const m = rng.int(1, Math.max(1, Math.floor(graphView / Math.max(p, q))));
          const [x, y] = [m * q, m * p];
          return valued(
            [
              `The graph of a proportional relationship passes through the marked point $(${x}, ${y})$. What is the constant of proportionality $k$ in $y = kx$?`,
              `某正比例关系的图像经过标出的点 $(${x}, ${y})$。$y = kx$ 中的比例常数 $k$ 是多少？`,
            ],
            k,
            [
              [
                ["Read the point", "读点"],
                [`The marked point has $x = ${x}$ and $y = ${y}$.`, `标出的点 $x = ${x}$，$y = ${y}$。`],
              ],
              [["Divide", "相除"], ["Divide $y$ by $x$:", "用 $y$ 除以 $x$："], [`k = \\frac{${y}}{${x}} = ${k.toLatex()}`]],
            ],
            [
              `From the origin, the line goes $${q}$ right and $${p}$ up to $(${q}, ${p})$, and $\\frac{${p}}{${q}} = ${k.toLatex()}$ too.`,
              `从原点出发，直线向右 $${q}$、向上 $${p}$ 到达 $(${q}, ${p})$，$\\frac{${p}}{${q}} = ${k.toLatex()}$，结果相同。`,
            ],
            [
              [Q.of(x, y), "That divides $x$ by $y$; $k$ is $y$ divided by $x$.", "这是 $x$ 除以 $y$；$k$ 是 $y$ 除以 $x$。"],
              ...(y > x
                ? [[Q.of(y - x), "That subtracts $x$ from $y$ instead of dividing.", "这是 $y$ 减 $x$，而不是相除。"] as const]
                : []),
              [Q.of(y), "That is the $y$-coordinate alone.", "这只是 $y$ 坐标。"],
              [Q.of(x), "That is the $x$-coordinate alone.", "这只是 $x$ 坐标。"],
            ],
            {
              figure: relationGraph(
                { kind: "line", a: [0, 0], b: [q, p], accent: true },
                [[x, y]],
                t(`A straight line through the origin and the marked point (${x}, ${y}).`, `一条经过原点和标出的点 (${x}, ${y}) 的直线。`),
              ),
            },
          );
        },
        drawn(gradeDrawings3["understanding-proportional-relationships-using-graphs#constant-of-proportionality-from-a-graph"]),
      ),
      lesson(
        "meaning-of-a-point-on-the-graph",
        ["The meaning of a point", "图像上一点的含义"],
        [
          [
            "On the graph of the cost $y$ of $x$ tickets, a point $(x, y)$ says that $x$ tickets cost $y$ dollars. The point $(4, 30)$ means $4$ tickets cost $\\$30$, and the point $(1, 7.5)$ means one ticket costs $\\$7.50$: $7.5$ is the unit rate.",
            "在 $x$ 张票的总价 $y$ 的图像上，点 $(x, y)$ 表示 $x$ 张票共 $y$ 美元。点 $(4, 30)$ 表示 $4$ 张票共 $\\$30$；点 $(1, 7.5)$ 表示每张票 $\\$7.50$，$7.5$ 就是单位率。",
          ],
          [
            "$4$ tickets at $\\$7.50$ each cost $4 \\times \\$7.50 = \\$30$, the point $(4, 30)$.",
            "$4$ 张票、每张 $\\$7.50$，共 $4 \\times \\$7.50 = \\$30$，正是点 $(4, 30)$。",
          ],
          [
            "The first coordinate is the number of tickets and the second the cost; do not swap them.",
            "第一个坐标是票数，第二个坐标是总价；不要弄反。",
          ],
        ],
        (rng) => {
          const g = rng.pick(goods);
          const u = rng.int(3, 15);
          const n = rng.int(2, 9);
          const c = n * u;
          if (rng.bool(0.6)) {
            return chosen(
              rng,
              [
                `The graph of a proportional relationship shows the cost $y$, in dollars, of $x$ ${g.many}. The point $(${n}, ${c})$ is on the graph. What does it mean?`,
                `某正比例关系的图像表示 $x$ ${g.zh}的总价 $y$（美元）。点 $(${n}, ${c})$ 在图像上。它表示什么？`,
              ],
              [`${n} ${g.many} cost $\\$${c}$.`, `${n} ${g.zh}共 $\\$${c}$。`],
              [
                [
                  [`${c} ${g.many} cost $\\$${n}$.`, `${c} ${g.zh}共 $\\$${n}$。`],
                  "That swaps the coordinates: the first is the number bought.",
                  "这是把两个坐标弄反了：第一个坐标是数量。",
                ],
                [
                  [`One ${g.one} costs $\\$${c}$.`, `每${g.zh} $\\$${c}$。`],
                  `$\\$${c}$ is the cost of all ${n}, not of one.`,
                  `$\\$${c}$ 是 ${n} 件的总价，不是一件的价钱。`,
                ],
                [
                  [`One ${g.one} costs $\\$${n}$.`, `每${g.zh} $\\$${n}$。`],
                  `$${n}$ is the number bought, not a price.`,
                  `$${n}$ 是数量，不是价钱。`,
                ],
              ],
              [
                [
                  ["First coordinate", "第一个坐标"],
                  [`$x = ${n}$ is the number of ${g.many}.`, `$x = ${n}$ 是数量。`],
                ],
                [
                  ["Second coordinate", "第二个坐标"],
                  [
                    `$y = ${c}$ is their cost in dollars, so ${n} ${g.many} cost $\\$${c}$.`,
                    `$y = ${c}$ 是总价（美元），所以 ${n} ${g.zh}共 $\\$${c}$。`,
                  ],
                ],
              ],
              [
                `One costs $\\$${c} \\div ${n} = \\$${u}$, and $${n} \\times \\$${u} = \\$${c}$.`,
                `每件 $\\$${c} \\div ${n} = \\$${u}$，而 $${n} \\times \\$${u} = \\$${c}$。`,
              ],
            );
          }
          return chosen(
            rng,
            [
              `The graph of a proportional relationship shows the cost $y$, in dollars, of $x$ ${g.many}. The point $(1, ${u})$ is on the graph. What does $${u}$ represent?`,
              `某正比例关系的图像表示 $x$ ${g.zh}的总价 $y$（美元）。点 $(1, ${u})$ 在图像上。$${u}$ 表示什么？`,
            ],
            [`The price of one ${g.one}, in dollars`, `每${g.zh}的价格（美元）`],
            [
              [
                [`The number of ${g.many} you can buy for $\\$1$`, `$\\$1$ 能买的数量`],
                "That would be the first coordinate when the cost is $1$.",
                "那应是总价为 $1$ 时的第一个坐标。",
              ],
              [[`The number of ${g.many} bought`, `买的数量`], "The number bought is the first coordinate, $1$.", "数量是第一个坐标 $1$。"],
              [
                [`The cost of ${u} ${g.many}, in dollars`, `${u} ${g.zh}的总价（美元）`],
                `$${u}$ is a cost, but for $1$ item, not for $${u}$.`,
                `$${u}$ 是总价，但它是 $1$ 件的，不是 $${u}$ 件的。`,
              ],
            ],
            [
              [
                ["First coordinate", "第一个坐标"],
                ["$x = 1$: one item is bought.", "$x = 1$：买了一件。"],
              ],
              [
                ["Second coordinate", "第二个坐标"],
                [`$y = ${u}$: it costs $\\$${u}$, the unit rate.`, `$y = ${u}$：它的价钱是 $\\$${u}$，即单位率。`],
              ],
            ],
            [
              `Then $${n}$ items cost $${n} \\times \\$${u} = \\$${c}$, so $(${n}, ${c})$ is also on the line.`,
              `那么 $${n}$ 件共 $${n} \\times \\$${u} = \\$${c}$，所以 $(${n}, ${c})$ 也在直线上。`,
            ],
          );
        },
        drawn(gradeDrawings4["understanding-proportional-relationships-using-graphs#meaning-of-a-point-on-the-graph"]),
      ),
    ],
  ),
  [
    "A line on a grid passes through $(0, 0)$ and $(6, 4)$. Does it show a proportional relationship, and what is $k$?",
    "坐标格上的一条直线经过 $(0, 0)$ 和 $(6, 4)$。它表示正比例关系吗？$k$ 是多少？",
  ],
  [
    "It is straight through the origin, and $k = \\frac{4}{6} = \\frac{2}{3}$; the point $(3, 2)$ gives $\\frac{2}{3}$ too.",
    "它是过原点的直线，$k = \\frac{4}{6} = \\frac{2}{3}$；点 $(3, 2)$ 也得 $\\frac{2}{3}$。",
  ],
  [
    "recognize proportional graphs, read $k$ from a point, and say what a point on the graph means.",
    "识别正比例图像，由一点读出 $k$，并说明图像上一点的含义。",
  ],
);

/** Situation is a description of two quantities y = slope × x + start, with its parameters filled in. */
interface Situation {
  readonly text: Text;
  readonly proportional: boolean;
  readonly why: Text;
  readonly slope: number;
  readonly start: number;
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
        why: t(`The cost of $x$ tickets is $y = ${k + 6}x$.`, `$x$ 张票的总价是 $y = ${k + 6}x$。`),
        slope: k + 6,
        start: 0,
      };
    case 1:
      return {
        text: t(
          `A car travels at a constant speed of $${k * 5}$ miles per hour. Is the distance traveled proportional to the time?`,
          `一辆汽车以 $${k * 5}$ 英里/小时的速度匀速行驶。行驶的路程与时间成正比例吗？`,
        ),
        proportional: true,
        why: t(`The distance in $x$ hours is $y = ${k * 5}x$.`, `$x$ 小时的路程是 $y = ${k * 5}x$。`),
        slope: k * 5,
        start: 0,
      };
    case 2:
      return {
        text: t(
          `A worker earns $\\$${k + 10}$ per hour and no other pay. Is the pay proportional to the number of hours worked?`,
          `一名工人每小时挣 $\\$${k + 10}$，没有其他收入。工资与工作的小时数成正比例吗？`,
        ),
        proportional: true,
        why: t(`The pay for $x$ hours is $y = ${k + 10}x$.`, `工作 $x$ 小时的工资是 $y = ${k + 10}x$。`),
        slope: k + 10,
        start: 0,
      };
    case 3:
      return {
        text: t(
          `A printer prints $${k * 2}$ pages per minute. Is the number of pages printed proportional to the time?`,
          `一台打印机每分钟打印 $${k * 2}$ 页。打印的页数与时间成正比例吗？`,
        ),
        proportional: true,
        why: t(`The pages printed in $x$ minutes are $y = ${k * 2}x$.`, `$x$ 分钟打印的页数是 $y = ${k * 2}x$。`),
        slope: k * 2,
        start: 0,
      };
    case 4:
      return {
        text: t(
          `A taxi charges $\\$${(b % 6) + 2}$ plus $\\$${(k % 4) + 1}$ per mile. Is the fare proportional to the distance?`,
          `出租车起步价 $\\$${(b % 6) + 2}$，另加每英里 $\\$${(k % 4) + 1}$。车费与路程成正比例吗？`,
        ),
        proportional: false,
        why: t(
          `The fare for $x$ miles is $y = ${(k % 4) + 1}x + ${(b % 6) + 2}$.`,
          `$x$ 英里的车费是 $y = ${(k % 4) + 1}x + ${(b % 6) + 2}$。`,
        ),
        slope: (k % 4) + 1,
        start: (b % 6) + 2,
      };
    case 5:
      return {
        text: t(
          `A gym charges ${article(b * 5)} $\\$${b * 5}$ joining fee and $\\$${k + 10}$ per month. Is the total cost proportional to the number of months?`,
          `一家健身房收 $\\$${b * 5}$ 入会费，另每月 $\\$${k + 10}$。总费用与月数成正比例吗？`,
        ),
        proportional: false,
        why: t(`The cost for $x$ months is $y = ${k + 10}x + ${b * 5}$.`, `$x$ 个月的总费用是 $y = ${k + 10}x + ${b * 5}$。`),
        slope: k + 10,
        start: b * 5,
      };
    case 6:
      return {
        text: t(
          `A candle is $${b + 20}$ centimeters tall and burns down ${(k % 3) + 1} ${k % 3 === 0 ? "centimeter" : "centimeters"} per hour. Is its height proportional to the time it has burned?`,
          `一支蜡烛高 $${b + 20}$ 厘米，每小时燃烧 ${(k % 3) + 1} 厘米。它的高度与燃烧时间成正比例吗？`,
        ),
        proportional: false,
        why: t(
          `The height after $x$ hours is $y = ${b + 20} - ${k % 3 === 0 ? "" : (k % 3) + 1}x$.`,
          `燃烧 $x$ 小时后的高度是 $y = ${b + 20} - ${k % 3 === 0 ? "" : (k % 3) + 1}x$。`,
        ),
        slope: -((k % 3) + 1),
        start: b + 20,
      };
    default:
      return {
        text: t(
          `A pool already holds $${b * 50}$ gallons of water and is filled at $${k * 5}$ gallons per minute. Is the amount of water in the pool proportional to the time?`,
          `一个水池里已有 $${b * 50}$ 加仑水，又以每分钟 $${k * 5}$ 加仑的速度注水。池中的水量与时间成正比例吗？`,
        ),
        proportional: false,
        why: t(`The water after $x$ minutes is $y = ${k * 5}x + ${b * 50}$.`, `$x$ 分钟后的水量是 $y = ${k * 5}x + ${b * 50}$。`),
        slope: k * 5,
        start: b * 50,
      };
  }
}

/** understandingProportionalRelationshipsFromDescriptions recognizes proportional situations and writes y = kx. */
export const understandingProportionalRelationshipsFromDescriptions = withIntro(
  topic(
    "understanding-proportional-relationships-from-descriptions",
    t("Understanding Proportional Relationships From Descriptions", "由文字描述理解正比例关系"),
    t(
      "A situation is proportional when one quantity is always the same number of times the other: a fixed price per item, a constant speed, a fixed pay per hour. A starting amount or a fixed fee breaks proportionality. A proportional relationship is written y = kx, where k is the amount for one unit.",
      "如果一个量总是另一个量的同一倍数，例如单价固定、速度不变、时薪固定，那么它们成正比例。有初始量或固定费用就不成正比例。正比例关系写作 y = kx，k 是 1 个单位对应的量。",
    ),
    ["understanding-proportional-relationships-using-tables"],
    ["7.RP.A.2a", "7.RP.A.2c"],
    [
      lesson(
        "is-the-situation-proportional",
        ["Is the situation proportional?", "情境是否成正比例？"],
        [
          [
            "A situation is proportional when one quantity is always the same multiple of the other, so zero of one goes with zero of the other. A fixed starting amount, such as a fee paid up front, breaks it. Tickets at $\\$8$ each cost $y = 8x$: proportional. A taxi at $\\$3$ plus $\\$2$ per mile costs $y = 2x + 3$: not proportional.",
            "如果一个量总是另一个量的同一倍数，这个情境就成正比例，此时一个量为零，另一个量也为零。固定的起始量（比如预先支付的费用）会破坏正比例。每张票 $\\$8$，总价 $y = 8x$：成正比例。出租车起步价 $\\$3$，每英里 $\\$2$，车费 $y = 2x + 3$：不成正比例。",
          ],
          [
            "$2$ tickets cost $\\$16$ and $4$ cost $\\$32$, twice as much; a $2$-mile ride costs $\\$7$ and a $4$-mile ride $\\$11$, not twice as much.",
            "$2$ 张票 $\\$16$，$4$ 张 $\\$32$，正好两倍；坐 $2$ 英里 $\\$7$，坐 $4$ 英里 $\\$11$，不是两倍。",
          ],
          [
            "A steady rate is not enough: a starting amount, even a small one, breaks proportionality.",
            "速率不变还不够：只要有起始量，哪怕很小，也不成正比例。",
          ],
        ],
        (rng) => {
          const s = situation(rng);
          const [y1, y2] = [s.slope + s.start, 2 * s.slope + s.start];
          return decided(
            rng,
            [s.text.en, s.text["zh-CN"]],
            s.proportional,
            [
              [
                ["Write the rule", "写出关系"],
                [s.why.en, s.why["zh-CN"]],
              ],
              [
                ["Look at zero", "看零点"],
                s.proportional
                  ? [
                      "At $x = 0$, $y = 0$, and $y$ is always the same multiple of $x$, so it is proportional.",
                      "$x = 0$ 时 $y = 0$，而且 $y$ 总是 $x$ 的同一倍数，所以成正比例。",
                    ]
                  : [
                      `At $x = 0$, $y = ${s.start}$, not $0$, so it is not proportional.`,
                      `$x = 0$ 时 $y = ${s.start}$，不是 $0$，所以不成正比例。`,
                    ],
              ],
            ],
            s.proportional
              ? [
                  `Doubling $x$ from $1$ to $2$ doubles $y$ from $${y1}$ to $${y2}$.`,
                  `$x$ 从 $1$ 加倍到 $2$，$y$ 也从 $${y1}$ 加倍到 $${y2}$。`,
                ]
              : [
                  `Doubling $x$ from $1$ to $2$ takes $y$ from $${y1}$ to $${y2}$, which is not double.`,
                  `$x$ 从 $1$ 加倍到 $2$，$y$ 从 $${y1}$ 变成 $${y2}$，不是两倍。`,
                ],
            s.proportional
              ? ["There is no starting amount, so $y$ is always the same multiple of $x$.", "没有起始量，所以 $y$ 总是 $x$ 的同一倍数。"]
              : [
                  `The starting amount $${s.start}$ means $y$ is not the same multiple of $x$ each time.`,
                  `起始量 $${s.start}$ 使 $y$ 不再总是 $x$ 的同一倍数。`,
                ],
          );
        },
        tableFigure(["0", "1", "2", "3"], [0, 8, 16, 24]),
      ),
      lesson(
        "writing-the-equation-of-a-proportional-relationship",
        ["Writing the equation", "写出方程"],
        [
          [
            "The equation of a proportional relationship is $y = kx$, where $k$ is the amount of $y$ for one unit of $x$. If the rate is not given, divide a known $y$ by its $x$. Pears cost $\\$1.25$ per pound, so $x$ pounds cost $y = 1.25x$; if instead $4$ pounds cost $\\$5$, then $k = 5 \\div 4 = 1.25$.",
            "正比例关系的方程是 $y = kx$，其中 $k$ 是每一个单位的 $x$ 对应的 $y$。没有直接给出单位率时，就用已知的 $y$ 除以对应的 $x$。梨每磅 $\\$1.25$，所以 $x$ 磅的价钱是 $y = 1.25x$；如果已知 $4$ 磅 $\\$5$，那么 $k = 5 \\div 4 = 1.25$。",
          ],
          [
            "Put $x = 4$ into $y = 1.25x$: $1.25 \\times 4 = 5$, the given cost.",
            "把 $x = 4$ 代入 $y = 1.25x$：$1.25 \\times 4 = 5$，正是给出的价钱。",
          ],
          ["Use the cost of one unit as $k$, not the cost of several units.", "要用一个单位的价钱作 $k$，不要用几个单位的总价。"],
        ],
        (rng) => {
          const b = rng.pick(bulks.slice(0, 5));
          const u = 5 * rng.int(10, 120);
          const k = dec(cq(u));
          if (rng.bool()) {
            return expressed(
              [
                `${capitalized(b.en)} ${b.plural ? "cost" : "costs"} $${usd(u)}$ per ${b.unit}. Write an equation for the cost $y$, in dollars, of $x$ ${b.units}.`,
                `${b.zh}每${b.zhUnit} $${usd(u)}$。写出 $x$ ${b.zhUnit}${b.zh}的价钱 $y$（美元）的方程。`,
              ],
              `${k}x`,
              [
                [
                  ["Unit rate", "单位率"],
                  [`One ${b.unit} costs $${k}$ dollars, so $k = ${k}$.`, `每${b.zhUnit} $${k}$ 美元，所以 $k = ${k}$。`],
                ],
                [
                  ["Write the equation", "写方程"],
                  ["The cost is the unit rate times the amount:", "价钱等于单位率乘数量："],
                  [`y = ${k}x`],
                ],
              ],
              [
                `$x = 2$ gives $y = ${k} \\times 2 = ${dec(cq(2 * u))}$, the cost of two ${b.units}.`,
                `$x = 2$ 时 $y = ${k} \\times 2 = ${dec(cq(2 * u))}$，正是两${b.zhUnit}的价钱。`,
              ],
              [
                [`\\frac{x}{${k}}`, "That divides the amount by the price instead of multiplying.", "这是数量除以单价，而不是相乘。"],
                [`x + ${k}`, "That adds the price instead of multiplying by it.", "这是加单价，而不是乘单价。"],
                [`${k}`, "That leaves out $x$: the cost depends on the amount.", "这里漏了 $x$：价钱取决于数量。"],
              ],
              { prefix: "y =" },
            );
          }
          const n = rng.int(2, 9);
          const total = dec(cq(n * u));
          return expressed(
            [
              `$${n}$ ${b.units} of ${b.en} cost $${usd(n * u)}$, and the cost is proportional to the amount. Write an equation for the cost $y$, in dollars, of $x$ ${b.units}.`,
              `$${n}$ ${b.zhUnit}${b.zh}售价 $${usd(n * u)}$，价钱与数量成正比例。写出 $x$ ${b.zhUnit}${b.zh}的价钱 $y$（美元）的方程。`,
            ],
            `${k}x`,
            [
              [["Unit rate", "单位率"], ["Divide the cost by the amount:", "用价钱除以数量："], [`k = ${total} \\div ${n} = ${k}`]],
              [["Write the equation", "写方程"], ["The cost is $k$ times the amount:", "价钱等于 $k$ 乘数量："], [`y = ${k}x`]],
            ],
            [
              `$x = ${n}$ gives $y = ${k} \\times ${n} = ${total}$, the given cost.`,
              `$x = ${n}$ 时 $y = ${k} \\times ${n} = ${total}$，正是给出的价钱。`,
            ],
            [
              [
                `${total}x`,
                `That uses the cost of all $${n}$ ${b.units} as the cost of one.`,
                `这是把 $${n}$ ${b.zhUnit}的总价当成每${b.zhUnit}的价钱。`,
              ],
              [
                `\\frac{${n}}{${total}}x`,
                "That divides the amount by the cost, which is the amount per dollar.",
                "这是数量除以价钱，得到的是每美元能买的量。",
              ],
              [`x + ${k}`, "That adds the unit rate instead of multiplying by it.", "这是加单位率，而不是乘单位率。"],
              [`${n}x`, "That uses the amount as the rate.", "这是把数量当成了单位率。"],
            ],
            { prefix: "y =" },
          );
        },
        tableFigure(["1", "2", "4"], [1.25, 2.5, 5]),
      ),
    ],
  ),
  [
    "Movie tickets cost $\\$8$ each, and a taxi charges $\\$3$ plus $\\$2$ per mile. Which total grows in proportion to the number of tickets or miles?",
    "电影票每张 $\\$8$；出租车起步价 $\\$3$，另加每英里 $\\$2$。哪一个总价与票数或英里数成正比例？",
  ],
  [
    "$y = 8x$ gives $\\$0$ for $0$ tickets, so the tickets are proportional; the taxi costs $\\$3$ for $0$ miles, so it is not.",
    "$y = 8x$ 在 $0$ 张票时是 $\\$0$，所以门票成正比例；出租车 $0$ 英里也要 $\\$3$，所以不成正比例。",
  ],
  [
    "decide whether a described situation is proportional and write its equation $y = kx$.",
    "判断文字描述的情境是否成正比例，并写出方程 $y = kx$。",
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
export const interpretingDataFromProportionalRelationships = withIntro(
  topic(
    "interpreting-data-from-proportional-relationships",
    t("Interpreting Data From Proportional Relationships", "解读正比例关系中的数据"),
    t(
      "In y = kx, the constant k is the amount of y for one unit of x. Multiply by k to find y from x, divide by k to find x from y, and compare two proportional relationships by comparing their constants, wherever they come from: an equation, a table or a description.",
      "在 y = kx 中，常数 k 是 x 为 1 个单位时 y 的量。由 x 求 y 就乘 k，由 y 求 x 就除以 k。比较两个正比例关系，就比较它们的常数，不论它们来自方程、表格还是文字描述。",
    ),
    ["understanding-proportional-relationships-using-graphs", "understanding-proportional-relationships-from-descriptions"],
    ["7.RP.A.2b", "7.RP.A.2c", "7.RP.A.2d"],
    [
      lesson(
        "using-the-equation-in-context",
        ["Using the equation", "运用方程"],
        [
          [
            "The equation $y = kx$ works in both directions: to find $y$ for a given $x$, multiply by $k$; to find the $x$ for a given $y$, divide by $k$. If $y = 14.5x$ is the pay for $x$ hours, $6$ hours pay $14.5 \\times 6 = \\$87$, and earning $\\$116$ takes $116 \\div 14.5 = 8$ hours.",
            "方程 $y = kx$ 可以双向使用：已知 $x$ 求 $y$，就乘 $k$；已知 $y$ 求 $x$，就除以 $k$。如果 $y = 14.5x$ 表示工作 $x$ 小时的工资，那么 $6$ 小时挣 $14.5 \\times 6 = \\$87$，挣 $\\$116$ 需要 $116 \\div 14.5 = 8$ 小时。",
          ],
          ["$8$ hours pay $14.5 \\times 8 = \\$116$, the amount we wanted.", "$8$ 小时挣 $14.5 \\times 8 = \\$116$，正是想要的数。"],
          [
            "To find $x$ from $y$, divide by $k$; multiplying again gives a far too large answer.",
            "由 $y$ 求 $x$ 要除以 $k$；再乘一次会得到大得离谱的答案。",
          ],
        ],
        (rng) => {
          const job = rng.pick(jobs);
          const kq = job.money ? Q.of(rng.int(16, 60), 2) : Q.of(rng.int(8, 20) * 5);
          const k = dec(kq);
          const x = rng.int(2, 12);
          const y = kq.mul(Q.of(x));
          const head: Pair = [`The equation $y = ${k}x$ gives ${job.what.en}.`, `方程 $y = ${k}x$ 表示${job.what["zh-CN"]}。`];
          if (rng.bool()) {
            const ask = job.askY(String(x));
            return valued(
              [`${head[0]} ${ask.en}`, `${head[1]}${ask["zh-CN"]}`],
              y,
              [
                [["Substitute", "代入"], [`Put $x = ${x}$ into the equation:`, `把 $x = ${x}$ 代入方程：`], [`y = ${k} \\times ${x}`]],
                [["Multiply", "相乘"], ["Work out the product:", "算出乘积："], [`${k} \\times ${x} = ${dec(y)}`]],
              ],
              [`Divide back: $${dec(y)} \\div ${k} = ${x}$.`, `除回去：$${dec(y)} \\div ${k} = ${x}$。`],
              [
                [kq.div(Q.of(x)), "That divides by $x$ instead of multiplying.", "这是除以 $x$，而不是乘 $x$。"],
                [kq.add(Q.of(x)), "That adds $x$ instead of multiplying.", "这是加 $x$，而不是乘 $x$。"],
                [Q.of(x).div(kq), "That divides $x$ by $k$.", "这是 $x$ 除以 $k$。"],
              ],
              { form: "decimal" },
            );
          }
          const ask = job.askX(dec(y));
          return valued(
            [`${head[0]} ${ask.en}`, `${head[1]}${ask["zh-CN"]}`],
            x,
            [
              [["Set up", "列方程"], [`Put $y = ${dec(y)}$ into the equation:`, `把 $y = ${dec(y)}$ 代入方程：`], [`${dec(y)} = ${k}x`]],
              [["Divide", "相除"], ["Divide both sides by $k$:", "两边同除以 $k$："], [`x = ${dec(y)} \\div ${k} = ${x}`]],
            ],
            [`Multiply back: $${k} \\times ${x} = ${dec(y)}$.`, `乘回去：$${k} \\times ${x} = ${dec(y)}$。`],
            [
              [y.mul(kq), "That multiplies by $k$ instead of dividing.", "这是乘 $k$，而不是除以 $k$。"],
              [y.sub(kq), "That subtracts $k$ instead of dividing.", "这是减 $k$，而不是除以 $k$。"],
              [kq.div(y), "That divides $k$ by $y$, the wrong way round.", "这是 $k$ 除以 $y$，除反了。"],
            ],
            { form: "decimal" },
          );
        },
        tableFigure(["1", "6", "8"], [14.5, 87, 116]),
      ),
      lesson(
        "meaning-of-the-constant",
        ["The meaning of the constant", "常数的含义"],
        [
          [
            "In $y = kx$, put $x = 1$: then $y = k$. So $k$ is the amount of $y$ for one unit of $x$. In $y = 2.5x$, where $y$ is the cost of $x$ pounds of apples, $2.5$ is the cost of one pound: $\\$2.50$.",
            "在 $y = kx$ 中令 $x = 1$，得 $y = k$。所以 $k$ 是 $x$ 为一个单位时 $y$ 的量。在 $y = 2.5x$ 中，$y$ 是 $x$ 磅苹果的价钱，$2.5$ 就是每磅的价钱：$\\$2.50$。",
          ],
          ["$2$ pounds cost $2.5 \\times 2 = \\$5$, two lots of $\\$2.50$.", "$2$ 磅要 $2.5 \\times 2 = \\$5$，正是两个 $\\$2.50$。"],
          [
            "$k$ is $y$ for one unit of $x$, not $x$ for one unit of $y$.",
            "$k$ 是一个单位的 $x$ 对应的 $y$，不是一个单位的 $y$ 对应的 $x$。",
          ],
        ],
        (rng) => {
          const job = rng.pick(jobs);
          const kq = job.money ? Q.of(rng.int(16, 60), 2) : Q.of(rng.int(8, 20) * 5);
          const k = dec(kq);
          const stated = job.k(job.money ? kq.toNumber().toFixed(2) : k);
          return chosen(
            rng,
            [
              `The equation $y = ${k}x$ gives ${job.what.en}. What does $${k}$ represent?`,
              `方程 $y = ${k}x$ 表示${job.what["zh-CN"]}。$${k}$ 表示什么？`,
            ],
            [capitalized(stated.en), stated["zh-CN"]],
            [
              [
                ["The amount of $x$ for one unit of $y$", "$y$ 为 1 个单位时 $x$ 的量"],
                `That is $1 \\div ${k}$, the rate the other way.`,
                `那是 $1 \\div ${k}$，是反过来的比率。`,
              ],
              [
                [`The value of $y$ when $x = ${k}$`, `$x = ${k}$ 时 $y$ 的值`],
                `When $x = ${k}$, $y = ${k} \\times ${k} = ${dec(kq.mul(kq))}$.`,
                `$x = ${k}$ 时 $y = ${k} \\times ${k} = ${dec(kq.mul(kq))}$。`,
              ],
              [
                [`The value of $x$ when $y = ${k}$`, `$y = ${k}$ 时 $x$ 的值`],
                `When $y = ${k}$, $x = 1$, not $${k}$.`,
                `$y = ${k}$ 时 $x = 1$，不是 $${k}$。`,
              ],
            ],
            [
              [["One unit", "一个单位"], ["One unit of $x$ gives:", "一个单位的 $x$ 对应："], [`y = ${k} \\times 1 = ${k}`]],
              [
                ["Read it", "说明含义"],
                [`So $${k}$ is ${stated.en}.`, `所以 $${k}$ 是${stated["zh-CN"]}。`],
              ],
            ],
            [
              `Two units give $y = ${k} \\times 2 = ${dec(kq.mul(Q.of(2)))}$, twice as much, one $${k}$ for each unit.`,
              `两个单位对应 $y = ${k} \\times 2 = ${dec(kq.mul(Q.of(2)))}$，每个单位一个 $${k}$。`,
            ],
          );
        },
        tableFigure(["0", "1", "2"], [0, 2.5, 5]),
      ),
      lesson(
        "comparing-two-proportional-relationships",
        ["Comparing two relationships", "比较两个正比例关系"],
        [
          [
            "To compare two proportional relationships, find each constant $k$, the amount for one unit, and compare those. Printer A prints $y = 12x$ pages in $x$ minutes, $12$ pages a minute. Printer B prints $35$ pages in $3$ minutes, $\\frac{35}{3} = 11\\frac{2}{3}$ pages a minute. Printer A is faster.",
            "比较两个正比例关系，要先求出各自的常数 $k$（每一个单位对应的量），再比较。打印机 A $x$ 分钟打印 $y = 12x$ 页，每分钟 $12$ 页。打印机 B $3$ 分钟打印 $35$ 页，每分钟 $\\frac{35}{3} = 11\\frac{2}{3}$ 页。打印机 A 更快。",
          ],
          [
            "In $3$ minutes printer A prints $12 \\times 3 = 36$ pages, more than printer B's $35$.",
            "$3$ 分钟打印机 A 打印 $12 \\times 3 = 36$ 页，比打印机 B 的 $35$ 页多。",
          ],
          ["Compare the amounts for the same time, not $12$ against $35$.", "要比较同样时间内的量，不能拿 $12$ 和 $35$ 比。"],
        ],
        (rng) => {
          const ka = rng.int(8, 30);
          let n: number;
          let pages: number;
          do {
            n = rng.int(2, 6);
            pages = rng.int(ka * n - 6, ka * n + 6);
          } while (pages <= 0);
          const kb = Q.of(pages, n);
          const c = Q.of(ka).cmp(kb);
          const sym = c > 0 ? ">" : c < 0 ? "<" : "=";
          const options: Pair[] = [
            ["Printer A", "打印机 A"],
            ["Printer B", "打印机 B"],
            ["They are equally fast", "一样快"],
          ];
          const correct = c > 0 ? 0 : c < 0 ? 1 : 2;
          const reasons: Pair[] = [
            c === 0
              ? ["Both print the same number of pages per minute.", "两台每分钟打印的页数相同。"]
              : [`Printer A prints $${ka}$ pages a minute, fewer than printer B.`, `打印机 A 每分钟 $${ka}$ 页，比打印机 B 少。`],
            c === 0
              ? ["Both print the same number of pages per minute.", "两台每分钟打印的页数相同。"]
              : [
                  `Printer B prints $${mixedLatex(kb)}$ pages a minute, fewer than printer A.`,
                  `打印机 B 每分钟 $${mixedLatex(kb)}$ 页，比打印机 A 少。`,
                ],
            [`The rates differ: $${ka}$ and $${mixedLatex(kb)}$ pages a minute.`, `速率不同：每分钟 $${ka}$ 页和 $${mixedLatex(kb)}$ 页。`],
          ];
          return chosen(
            rng,
            [
              `Printer A prints $y = ${ka}x$ pages in $x$ minutes. Printer B prints ${pages} pages in ${n} minutes, at a constant rate. Which printer is faster?`,
              `打印机 A $x$ 分钟打印 $y = ${ka}x$ 页。打印机 B 匀速打印，${n} 分钟打印 ${pages} 页。哪台打印机更快？`,
            ],
            options[correct] as Pair,
            [0, 1, 2]
              .filter((i) => i !== correct)
              .map((i): Wrong => [options[i] as Pair, (reasons[i] as Pair)[0], (reasons[i] as Pair)[1]]),
            [
              [
                ["Printer A", "打印机 A"],
                [`From $y = ${ka}x$, printer A prints $${ka}$ pages a minute.`, `由 $y = ${ka}x$，打印机 A 每分钟打印 $${ka}$ 页。`],
              ],
              [
                ["Printer B", "打印机 B"],
                ["Divide its pages by its minutes, then compare:", "用它的页数除以分钟数，再比较："],
                [`\\frac{${pages}}{${n}} = ${mixedLatex(kb)}`, `${ka} ${sym} ${mixedLatex(kb)}`],
              ],
            ],
            [
              `In $${n}$ minutes printer A prints $${ka} \\times ${n} = ${ka * n}$ pages and printer B prints $${pages}$, the same order.`,
              `$${n}$ 分钟打印机 A 打印 $${ka} \\times ${n} = ${ka * n}$ 页，打印机 B 打印 $${pages}$ 页，大小顺序相同。`,
            ],
          );
        },
        tapeFigure(
          [{ pieces: [{ size: 36, text: "36", lit: true }] }, { pieces: [{ size: 35, text: "35" }] }],
          ["Pages in 3 minutes: 36 for printer A and 35 for printer B.", "3 分钟打印的页数：打印机 A 36 页，打印机 B 35 页。"],
        ),
      ),
    ],
  ),
  [
    "A worker's pay is $y = 14.5x$ dollars for $x$ hours. How much is $6$ hours of work, and what does $14.5$ mean?",
    "一名工人工作 $x$ 小时的工资是 $y = 14.5x$ 美元。工作 $6$ 小时挣多少？$14.5$ 表示什么？",
  ],
  [
    "$14.5 \\times 6 = 87$ dollars, and $x = 1$ gives $y = 14.5$, the pay for one hour.",
    "$14.5 \\times 6 = 87$ 美元；$x = 1$ 时 $y = 14.5$，即每小时的工资。",
  ],
  [
    "use $y = kx$ in both directions, explain what $k$ means, and compare two proportional relationships.",
    "双向运用 $y = kx$，说明 $k$ 的含义，并比较两个正比例关系。",
  ],
);

// ---------------------------------------------------------------------------
// Percentage increase and decrease

/** multiplier writes 1 + p/100 as a decimal: 15 → "1.15", −20 → "0.8". */
const multiplier = (p: number) => dec(Q.of(100 + p, 100));

/** rateOf writes p/100 as a decimal: 15 → "0.15". */
const rateOf = (p: number) => dec(Q.of(p, 100));

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
    up: (p) => t(`The weekly pay increases by $${p}\\%$.`, `周薪提高了 $${p}\\%$。`),
    down: (p) => t(`The weekly pay decreases by $${p}\\%$.`, `周薪降低了 $${p}\\%$。`),
    askNew: t("How much does Leo earn a week now, in dollars?", "Leo 现在每周挣多少美元？"),
    askOld: t("How much did Leo earn a week before, in dollars?", "Leo 原来每周挣多少美元？"),
    isNow: (n) => t(`Leo now earns $\\$${n}$ a week`, `Leo 现在每周挣 $\\$${n}$`),
    now: (n) => t(`Now Leo earns $\\$${n}$ a week.`, `现在 Leo 每周挣 $\\$${n}$。`),
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
const join = (...parts: readonly Text[]): Pair => [parts.map((p) => p.en).join(" "), parts.map((p) => p["zh-CN"]).join("")];

/** percentStart draws a starting value that is a multiple of 20 so that any multiple of 5 percent of it is whole. */
const percentStart = (rng: Rng) => 20 * rng.int(2, 45);

/** upWords names the direction of a change in both languages. */
const upWords = (up: boolean): Pair => (up ? ["increase", "增加"] : ["decrease", "减少"]);

/** increaseTape is the bar of 240 grown by 15% to 276. */
const increaseTape = tapeFigure(
  [
    {
      total: "276",
      pieces: [
        { size: 240, text: "240" },
        { size: 36, text: "36", lit: true },
      ],
    },
  ],
  ["A bar of 240 with 36 more added, 15 percent of 240, making 276.", "长条 240 再加上它的 15%，即 36，共 276。"],
);

/** decreaseTape is the bar of 240 shrunk by 15% to 204. */
const decreaseTape = tapeFigure(
  [
    {
      total: "240",
      pieces: [
        { size: 204, text: "204", lit: true },
        { size: 36, text: "36", dashed: true },
      ],
    },
  ],
  ["A bar of 240 with 36 taken away, 15 percent of 240, leaving 204.", "长条 240 去掉它的 15%，即 36，剩下 204。"],
);

/** multiplierProblem asks which expression applies a percentage change. */
function multiplierProblem(rng: Rng, up: boolean) {
  const n = percentStart(rng);
  const p = 5 * rng.int(1, 19);
  const s = up ? p : -p;
  const [word, zhWord] = upWords(up);
  const [, zhOther] = upWords(!up);
  const result = (n * (100 + s)) / 100;
  const change = (n * p) / 100;
  return chosenMath(
    rng,
    [
      `Which expression gives the result of ${up ? "increasing" : "decreasing"} $${n}$ by $${p}\\%$?`,
      `哪个式子表示把 $${n}$ ${zhWord} $${p}\\%$ 的结果？`,
    ],
    `${n} \\times ${multiplier(s)}`,
    [
      [`${n} \\times ${rateOf(p)}`, `That gives only the ${word}, not the new value.`, `这只得到${zhWord}的量，不是新的值。`],
      [
        `${n} \\times ${multiplier(-s)}`,
        `That is the multiplier for ${up ? "a decrease" : "an increase"} of $${p}\\%$.`,
        `这是${zhOther} $${p}\\%$ 时乘的数。`,
      ],
      [
        `${n} ${up ? "+" : "-"} ${rateOf(p)}`,
        `That ${up ? "adds" : "subtracts"} the rate as a number, not $${p}\\%$ of $${n}$.`,
        `这是把比率当成一个数来${up ? "加" : "减"}，而不是 $${n}$ 的 $${p}\\%$。`,
      ],
      ...(p < 10
        ? [
            [
              `${n} \\times ${dec(Q.of(10 + s, 10))}`,
              `That treats $${p}\\%$ as $${dec(Q.of(p, 10))}$; it is $${rateOf(p)}$.`,
              `这是把 $${p}\\%$ 当成了 $${dec(Q.of(p, 10))}$；它应是 $${rateOf(p)}$。`,
            ] as const,
          ]
        : []),
    ],
    [
      [
        ["Compare with the original", "与原值相比"],
        [
          `After ${up ? "an increase" : "a decrease"} of $${p}\\%$, the result is this much of the original:`,
          `${zhWord} $${p}\\%$ 后，结果是原来的：`,
        ],
        [`100\\% ${up ? "+" : "-"} ${p}\\% = ${100 + s}\\%`],
      ],
      [
        ["As a decimal", "写成小数"],
        ["Write it as a decimal and multiply:", "写成小数再相乘："],
        [`${100 + s}\\% = ${multiplier(s)}`, `${n} \\times ${multiplier(s)}`],
      ],
    ],
    [
      `$${n} \\times ${multiplier(s)} = ${result}$, the same as $${n} ${up ? "+" : "-"} ${change}$, where $${change}$ is $${p}\\%$ of $${n}$.`,
      `$${n} \\times ${multiplier(s)} = ${result}$，与 $${n} ${up ? "+" : "-"} ${change}$ 相同，其中 $${change}$ 是 $${n}$ 的 $${p}\\%$。`,
    ],
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
  const [word, zhWord] = upWords(up);
  return valued(
    join(c.start(n), up ? c.up(p) : c.down(p), c.askNew),
    answer,
    [
      [
        [`Find the ${word}`, `求${zhWord}的量`],
        [`The ${word} is $${p}\\%$ of $${n}$:`, `${zhWord}的量是 $${n}$ 的 $${p}\\%$：`],
        [`${rateOf(p)} \\times ${n} = ${change}`],
      ],
      [
        [up ? "Add" : "Subtract", up ? "相加" : "相减"],
        [`${up ? "Add it to" : "Take it from"} the original:`, `${up ? "加到" : "从"}原来的量${up ? "上" : "中减去"}：`],
        [`${n} ${up ? "+" : "-"} ${change} = ${answer}`],
      ],
    ],
    [`In one step: $${n} \\times ${multiplier(s)} = ${answer}$.`, `一步算：$${n} \\times ${multiplier(s)} = ${answer}$。`],
    [
      [change, `That is only the ${word}, not the new value.`, `这只是${zhWord}的量，不是新的值。`],
      [
        up ? n + p : n - p,
        `That ${up ? "adds" : "subtracts"} $${p}$ itself, not $${p}\\%$ of $${n}$.`,
        `这是${up ? "加" : "减"} $${p}$ 本身，而不是 $${n}$ 的 $${p}\\%$。`,
      ],
      [
        (n * (100 - s)) / 100,
        `That ${up ? "decreases" : "increases"} instead of ${up ? "increasing" : "decreasing"}.`,
        `这是${up ? "减少" : "增加"}了，方向反了。`,
      ],
    ],
  );
}

/** applyingPercentageIncreases increases a quantity by a percentage. */
export const applyingPercentageIncreases = withIntro(
  topic(
    "applying-percentage-increases",
    t("Applying Percentage Increases", "百分比增加"),
    t(
      "To increase a quantity by p%, add p% of it, or multiply it by (100 + p)% at once: increasing 240 by 15% gives 240 + 36 = 276, the same as 240 × 1.15.",
      "把一个量增加 p%，就加上它的 p%，或者直接乘 (100 + p)%：240 增加 15% 得 240 + 36 = 276，等于 240 × 1.15。",
    ),
    ["finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems", "converting-between-percentages-and-decimals"],
    ["7.RP.A.3"],
    [
      lesson(
        "the-multiplier-for-an-increase",
        ["The multiplier for an increase", "增加时乘的数"],
        [
          [
            "After an increase you have the whole original, $100\\%$, plus the increase. Increasing by $15\\%$ leaves $100\\% + 15\\% = 115\\%$ of the original, so multiply by $1.15$.",
            "增加之后，得到的是原来的全部 $100\\%$ 再加上增加的部分。增加 $15\\%$ 后是原来的 $100\\% + 15\\% = 115\\%$，所以乘 $1.15$。",
          ],
          [
            "$240 \\times 1.15 = 276$, and $240 + 0.15 \\times 240 = 240 + 36 = 276$ as well.",
            "$240 \\times 1.15 = 276$，而 $240 + 0.15 \\times 240 = 240 + 36 = 276$，结果相同。",
          ],
          ["Multiplying by $0.15$ gives only the increase, not the new value.", "乘 $0.15$ 得到的只是增加的量，不是新的值。"],
        ],
        (rng) => multiplierProblem(rng, true),
        increaseTape,
      ),
      lesson(
        "increasing-a-quantity",
        ["Increasing a quantity", "增加一个量"],
        [
          [
            "To increase a quantity by a percentage, find that percentage of it and add it to the original. A $\\$240$ price increases by $15\\%$: the increase is $0.15 \\times 240 = 36$, so the new price is $240 + 36 = \\$276$.",
            "把一个量增加百分之几，先求出它的百分之几，再加到原来的量上。$\\$240$ 的价格上涨 $15\\%$：上涨的量是 $0.15 \\times 240 = 36$，所以新价格是 $240 + 36 = \\$276$。",
          ],
          ["In one step: $240 \\times 1.15 = 276$.", "一步算：$240 \\times 1.15 = 276$。"],
          ["Add $15\\%$ of $240$, not the number $15$: $240 + 15$ is wrong.", "要加 $240$ 的 $15\\%$，不是加数 $15$：$240 + 15$ 是错的。"],
        ],
        (rng) => changeProblem(rng, true),
        increaseTape,
      ),
    ],
  ),
  ["A $\\$240$ bike goes up in price by $15\\%$. How much does it cost now?", "一辆 $\\$240$ 的自行车涨价 $15\\%$。现在要多少钱？"],
  [
    "$15\\%$ of $240$ is $36$, so $240 + 36 = \\$276$; in one step, $240 \\times 1.15 = 276$.",
    "$240$ 的 $15\\%$ 是 $36$，所以 $240 + 36 = \\$276$；一步算 $240 \\times 1.15 = 276$。",
  ],
  [
    "increase a quantity by a percentage, by adding the increase or by multiplying once.",
    "把一个量增加百分之几：加上增加的量，或者一次相乘。",
  ],
);

/** applyingPercentageDecreases decreases a quantity by a percentage. */
export const applyingPercentageDecreases = withIntro(
  topic(
    "applying-percentage-decreases",
    t("Applying Percentage Decreases", "百分比减少"),
    t(
      "To decrease a quantity by p%, subtract p% of it, or multiply it by (100 − p)% at once: decreasing 240 by 15% gives 240 − 36 = 204, the same as 240 × 0.85.",
      "把一个量减少 p%，就减去它的 p%，或者直接乘 (100 − p)%：240 减少 15% 得 240 − 36 = 204，等于 240 × 0.85。",
    ),
    ["applying-percentage-increases"],
    ["7.RP.A.3"],
    [
      lesson(
        "the-multiplier-for-a-decrease",
        ["The multiplier for a decrease", "减少时乘的数"],
        [
          [
            "After a decrease, what remains is the whole, $100\\%$, minus the part taken away. Decreasing by $15\\%$ leaves $100\\% - 15\\% = 85\\%$ of the original, so multiply by $0.85$.",
            "减少之后，剩下的是整体 $100\\%$ 减去去掉的部分。减少 $15\\%$ 后剩下原来的 $100\\% - 15\\% = 85\\%$，所以乘 $0.85$。",
          ],
          [
            "$240 \\times 0.85 = 204$, and $240 - 0.15 \\times 240 = 240 - 36 = 204$ as well.",
            "$240 \\times 0.85 = 204$，而 $240 - 0.15 \\times 240 = 240 - 36 = 204$，结果相同。",
          ],
          ["Multiply by what remains, $0.85$, not by the part taken away, $0.15$.", "要乘剩下的部分 $0.85$，不是去掉的部分 $0.15$。"],
        ],
        (rng) => multiplierProblem(rng, false),
        decreaseTape,
      ),
      lesson(
        "decreasing-a-quantity",
        ["Decreasing a quantity", "减少一个量"],
        [
          [
            "To decrease a quantity by a percentage, find that percentage of it and subtract it from the original. A town of $240$ residents shrinks by $15\\%$: it loses $0.15 \\times 240 = 36$ residents, leaving $240 - 36 = 204$.",
            "把一个量减少百分之几，先求出它的百分之几，再从原来的量中减去。一个 $240$ 人的镇人口减少 $15\\%$：减少 $0.15 \\times 240 = 36$ 人，剩下 $240 - 36 = 204$ 人。",
          ],
          ["In one step: $240 \\times 0.85 = 204$.", "一步算：$240 \\times 0.85 = 204$。"],
          ["The answer is what is left, $204$, not the $36$ taken away.", "答案是剩下的 $204$，不是去掉的 $36$。"],
        ],
        (rng) => changeProblem(rng, false),
        decreaseTape,
      ),
    ],
  ),
  ["A town of $240$ residents shrinks by $15\\%$. How many residents are left?", "一个 $240$ 人的镇人口减少了 $15\\%$。还剩多少人？"],
  [
    "$15\\%$ of $240$ is $36$, so $240 - 36 = 204$; in one step, $240 \\times 0.85 = 204$.",
    "$240$ 的 $15\\%$ 是 $36$，所以 $240 - 36 = 204$；一步算 $240 \\times 0.85 = 204$。",
  ],
  [
    "decrease a quantity by a percentage, by subtracting the decrease or by multiplying by what remains.",
    "把一个量减少百分之几：减去减少的量，或者乘剩下的部分。",
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
  const [word, zhWord] = upWords(up);
  return valued(
    join(c.start(old), c.now(String(now)), t(`What is the percentage ${word}?`, `${zhWord}了百分之几？`)),
    p,
    [
      [
        [`Find the ${word}`, `求${zhWord}的量`],
        ["Subtract the smaller value from the larger:", "用大的值减去小的值："],
        [`${Math.max(now, old)} - ${Math.min(now, old)} = ${diff}`],
      ],
      [
        ["Divide by the original", "除以原值"],
        [`Divide by the original value, $${old}$:`, `除以原来的值 $${old}$：`],
        [`\\frac{${diff}}{${old}} = ${rateOf(p)} = ${p}\\%`],
      ],
    ],
    [`$${old} \\times ${multiplier(s)} = ${now}$, the new value.`, `$${old} \\times ${multiplier(s)} = ${now}$，正是新的值。`],
    [
      [Q.of(diff * 100, now), "That divides by the new value; divide by the original.", "这是除以新的值；应该除以原来的值。"],
      [diff, "That is the change itself, not a percentage of the original.", "这是变化量本身，不是占原值的百分比。"],
      [
        Q.of(now * 100, old),
        "That is the new value as a percentage of the original, not the change.",
        "这是新值占原值的百分比，不是变化的百分比。",
      ],
      ...(up
        ? []
        : [
            [
              100 - p,
              "That is the percentage that remains, not the percentage taken away.",
              "这是剩下的百分比，不是减少的百分比。",
            ] as const,
          ]),
    ],
    { percent: true },
  );
}

/** calculatingPercentageChange finds a percentage increase or decrease from the old and new values. */
export const calculatingPercentageChange = withIntro(
  topic(
    "calculating-percentage-change",
    t("Calculating Percentage Change", "计算百分比变化"),
    t(
      "Percentage change = (new − original) ÷ original × 100%. From 80 to 92 is an increase of 12 ÷ 80 = 15%; from 80 to 68 is a decrease of 12 ÷ 80 = 15%. Always divide by the original value.",
      "百分比变化 = (新值 − 原值) ÷ 原值 × 100%。从 80 变到 92 增加了 12 ÷ 80 = 15%；从 80 变到 68 减少了 12 ÷ 80 = 15%。一定要除以原值。",
    ),
    ["applying-percentage-decreases", "finding-a-percentage-given-two-numbers-word-problems"],
    ["7.RP.A.3"],
    [
      lesson(
        "percentage-increase",
        ["Percentage increase", "增加的百分比"],
        [
          [
            "The percentage change compares the change with the original value. Divide the increase by the original and write it as a percentage. A price rises from $\\$80$ to $\\$92$: the increase is $\\$12$, and $\\frac{12}{80} = 0.15$, an increase of $15\\%$.",
            "百分比变化是把变化量与原来的值相比。用增加的量除以原来的值，再写成百分数。价格从 $\\$80$ 涨到 $\\$92$：上涨 $\\$12$，$\\frac{12}{80} = 0.15$，即上涨了 $15\\%$。",
          ],
          ["$80 \\times 1.15 = 92$, the new price.", "$80 \\times 1.15 = 92$，正是新价格。"],
          ["Divide by the original $80$, not by the new value $92$.", "要除以原来的 $80$，不是新的 $92$。"],
        ],
        (rng) => percentChangeProblem(rng, true),
        tapeFigure(
          [
            {
              total: "92",
              pieces: [
                { size: 80, text: "80" },
                { size: 12, text: "12", lit: true },
              ],
            },
          ],
          ["A bar of 80 with 12 more added, making 92; the 12 is compared with the 80.", "长条 80 再加 12，共 92；用 12 和 80 比较。"],
        ),
      ),
      lesson(
        "percentage-decrease",
        ["Percentage decrease", "减少的百分比"],
        [
          [
            "For a decrease, divide the amount lost by the original value. A population falls from $80$ to $68$: the decrease is $12$, and $\\frac{12}{80} = 0.15$, a decrease of $15\\%$.",
            "减少时，用减少的量除以原来的值。人口从 $80$ 减少到 $68$：减少了 $12$，$\\frac{12}{80} = 0.15$，即减少了 $15\\%$。",
          ],
          ["$80 \\times 0.85 = 68$, the new population.", "$80 \\times 0.85 = 68$，正是新的人口。"],
          ["Dividing by the new value, $68$, would be wrong.", "除以新的值 $68$ 是错的。"],
        ],
        (rng) => percentChangeProblem(rng, false),
        tapeFigure(
          [
            {
              total: "80",
              pieces: [
                { size: 68, text: "68" },
                { size: 12, text: "12", dashed: true, lit: true },
              ],
            },
          ],
          ["A bar of 80 with 12 taken away, leaving 68; the 12 is compared with the 80.", "长条 80 去掉 12，剩下 68；用 12 和 80 比较。"],
        ),
      ),
    ],
  ),
  ["A price rises from $\\$80$ to $\\$92$. By what percentage did it go up?", "价格从 $\\$80$ 涨到 $\\$92$。上涨了百分之几？"],
  [
    "The rise is $\\$12$, and $\\frac{12}{80} = 15\\%$; indeed $80 \\times 1.15 = 92$.",
    "上涨了 $\\$12$，$\\frac{12}{80} = 15\\%$；而 $80 \\times 1.15 = 92$。",
  ],
  ["find the percentage increase or decrease by dividing the change by the original value.", "用变化量除以原值，求增加或减少的百分比。"],
);

/** originalProblem finds the original value from the value after a percentage change. */
function originalProblem(rng: Rng, up: boolean) {
  const c = rng.pick(changeContexts);
  const old = c.size(rng);
  const p = 5 * rng.int(1, up ? Math.min(20, c.maxUp / 5) : 16);
  const s = up ? p : -p;
  const now = (old * (100 + s)) / 100;
  const isNow = c.isNow(String(now));
  const change = (old * p) / 100;
  return valued(
    [
      `After ${up ? "an increase" : "a decrease"} of $${p}\\%$, ${isNow.en}. ${c.askOld.en}`,
      `${up ? "增加" : "减少"} $${p}\\%$ 后，${isNow["zh-CN"]}。${c.askOld["zh-CN"]}`,
    ],
    old,
    [
      [
        ["Write the equation", "列方程"],
        [`The new value is $${100 + s}\\%$ of the original $x$:`, `新的值是原值 $x$ 的 $${100 + s}\\%$：`],
        [`${multiplier(s)}x = ${now}`],
      ],
      [["Divide", "相除"], ["Divide by the multiplier:", "除以倍数："], [`x = ${now} \\div ${multiplier(s)} = ${old}`]],
    ],
    [
      `$${p}\\%$ of $${old}$ is $${change}$, and $${old} ${up ? "+" : "-"} ${change} = ${now}$.`,
      `$${old}$ 的 $${p}\\%$ 是 $${change}$，$${old} ${up ? "+" : "-"} ${change} = ${now}$。`,
    ],
    [
      ...(p < 100
        ? [
            [
              Q.of(now * (100 - s), 100),
              `That takes $${p}\\%$ of the new value, but the percentage was of the original.`,
              `这是取新值的 $${p}\\%$，但百分数是针对原值的。`,
            ] as const,
          ]
        : []),
      [
        up ? now - p : now + p,
        `That ${up ? "subtracts" : "adds"} $${p}$ itself, not a percentage.`,
        `这是${up ? "减" : "加"} $${p}$ 本身，不是百分数。`,
      ],
      [Q.of(now * 100, p), "That divides by the percentage instead of by the multiplier.", "这是除以百分数，而不是除以倍数。"],
    ],
  );
}

/** originalEquationProblem asks which equation gives the original value. */
function originalEquationProblem(rng: Rng, up: boolean) {
  const old = percentStart(rng);
  const p = 5 * rng.int(1, up ? 20 : 16);
  const s = up ? p : -p;
  const now = (old * (100 + s)) / 100;
  return chosenMath(
    rng,
    [
      `A number $x$ ${up ? "increased" : "decreased"} by $${p}\\%$ gives $${now}$. Which equation can be solved to find $x$?`,
      `一个数 $x$ ${up ? "增加" : "减少"} $${p}\\%$ 后得到 $${now}$。解哪个方程可以求出 $x$？`,
    ],
    `${multiplier(s)}x = ${now}`,
    [
      [
        `x = ${multiplier(s)} \\times ${now}`,
        `That changes $${now}$ again instead of $x$.`,
        `这是再把 $${now}$ 变化一次，而不是变化 $x$。`,
      ],
      [
        `${multiplier(-s)}x = ${now}`,
        `That is the multiplier for ${up ? "a decrease" : "an increase"}.`,
        `这是${up ? "减少" : "增加"}时乘的数。`,
      ],
      [`${rateOf(p)}x = ${now}`, `That says $${now}$ is only $${p}\\%$ of $x$.`, `这表示 $${now}$ 只是 $x$ 的 $${p}\\%$。`],
      [
        `x ${up ? "+" : "-"} ${rateOf(p)} = ${now}`,
        "That uses the rate as a number to add, not a percentage of $x$.",
        "这是把比率当成一个数来加减，而不是 $x$ 的百分之几。",
      ],
    ],
    [
      [
        ["Compare with the original", "与原值相比"],
        [`After the change, $x$ becomes this much of itself:`, `变化之后，$x$ 变成它自己的：`],
        [`100\\% ${up ? "+" : "-"} ${p}\\% = ${100 + s}\\% = ${multiplier(s)}`],
      ],
      [["Write the equation", "列方程"], [`That amount equals $${now}$:`, `这个量等于 $${now}$：`], [`${multiplier(s)}x = ${now}`]],
    ],
    [
      `Solving gives $x = ${now} \\div ${multiplier(s)} = ${old}$, and $${old} \\times ${multiplier(s)} = ${now}$.`,
      `解得 $x = ${now} \\div ${multiplier(s)} = ${old}$，而 $${old} \\times ${multiplier(s)} = ${now}$。`,
    ],
  );
}

/** findingOriginalValuesFromPercentageIncreases undoes a percentage increase. */
export const findingOriginalValuesFromPercentageIncreases = withIntro(
  topic(
    "finding-original-values-from-percentage-increases",
    t("Finding Original Values From Percentage Increases", "由百分比增加求原值"),
    t(
      "After a p% increase, the new value is (100 + p)% of the original x. So if a price is \\$276 after a 15% increase, 1.15x = 276 and x = 276 ÷ 1.15 = 240. Subtracting 15% of 276 does not give the original.",
      "增加 p% 后，新值是原值 x 的 (100 + p)%。所以如果价格上涨 15% 后是 \\$276，那么 1.15x = 276，x = 276 ÷ 1.15 = 240。减去 276 的 15% 得不到原值。",
    ),
    ["applying-percentage-increases", "finding-a-total-given-a-part-and-a-percentage"],
    ["7.RP.A.3"],
    [
      lesson(
        "the-equation-for-the-original-after-an-increase",
        ["Writing the equation", "列方程"],
        [
          [
            "Call the unknown original value $x$. An increase of $15\\%$ makes it $115\\%$ of itself, $1.15x$, and that equals the new value. A number increased by $15\\%$ gives $276$: $1.15x = 276$.",
            "设未知的原值为 $x$。增加 $15\\%$ 后，它变成自己的 $115\\%$，即 $1.15x$，这等于新的值。一个数增加 $15\\%$ 后得 $276$：$1.15x = 276$。",
          ],
          ["$x = 240$ fits: $1.15 \\times 240 = 276$.", "$x = 240$ 符合：$1.15 \\times 240 = 276$。"],
          [
            "The multiplier goes on $x$, not on $276$: $x = 1.15 \\times 276$ changes the wrong number.",
            "倍数乘在 $x$ 上，不是乘在 $276$ 上：$x = 1.15 \\times 276$ 变化的是错的数。",
          ],
        ],
        (rng) => originalEquationProblem(rng, true),
        increaseTape,
      ),
      lesson(
        "original-value-after-an-increase",
        ["Finding the original value", "求原值"],
        [
          [
            "To undo an increase, divide the new value by the multiplier. After a $15\\%$ increase a price is $\\$276$: $1.15x = 276$, so $x = 276 \\div 1.15 = \\$240$.",
            "要还原一次增加，就用新的值除以倍数。上涨 $15\\%$ 后价格是 $\\$276$：$1.15x = 276$，所以 $x = 276 \\div 1.15 = \\$240$。",
          ],
          ["$15\\%$ of $240$ is $36$, and $240 + 36 = 276$.", "$240$ 的 $15\\%$ 是 $36$，$240 + 36 = 276$。"],
          [
            "Taking $15\\%$ off $276$ gives $234.60$, not $240$: the $15\\%$ was of the original.",
            "从 $276$ 减去它的 $15\\%$ 得 $234.60$，不是 $240$：这 $15\\%$ 是针对原价的。",
          ],
        ],
        (rng) => originalProblem(rng, true),
        increaseTape,
      ),
    ],
  ),
  [
    "After a $15\\%$ price rise, a bike costs $\\$276$. What did it cost before the rise?",
    "涨价 $15\\%$ 后，一辆自行车售价 $\\$276$。涨价前是多少钱？",
  ],
  [
    "$1.15x = 276$ gives $x = 240$, and $240 + 15\\%$ of $240 = 240 + 36 = 276$.",
    "$1.15x = 276$ 得 $x = 240$；$240$ 加上它的 $15\\%$，$240 + 36 = 276$。",
  ],
  [
    "write an equation for the original value after an increase and solve it by dividing by the multiplier.",
    "为增加后的原值列方程，并用除以倍数的方法求解。",
  ],
);

/** findingOriginalValuesFromPercentageDecreases undoes a percentage decrease. */
export const findingOriginalValuesFromPercentageDecreases = withIntro(
  topic(
    "finding-original-values-from-percentage-decreases",
    t("Finding Original Values From Percentage Decreases", "由百分比减少求原值"),
    t(
      "After a p% decrease, the new value is (100 − p)% of the original x. If a town has 204 residents after a 15% decrease, 0.85x = 204 and x = 204 ÷ 0.85 = 240.",
      "减少 p% 后，新值是原值 x 的 (100 − p)%。如果某镇人口减少 15% 后是 204 人，那么 0.85x = 204，x = 204 ÷ 0.85 = 240。",
    ),
    ["finding-original-values-from-percentage-increases", "applying-percentage-decreases"],
    ["7.RP.A.3"],
    [
      lesson(
        "the-equation-for-the-original-after-a-decrease",
        ["Writing the equation", "列方程"],
        [
          [
            "Call the unknown original value $x$. A decrease of $15\\%$ leaves $85\\%$ of it, $0.85x$, and that equals the new value. A number decreased by $15\\%$ gives $204$: $0.85x = 204$.",
            "设未知的原值为 $x$。减少 $15\\%$ 后剩下它的 $85\\%$，即 $0.85x$，这等于新的值。一个数减少 $15\\%$ 后得 $204$：$0.85x = 204$。",
          ],
          ["$x = 240$ fits: $0.85 \\times 240 = 204$.", "$x = 240$ 符合：$0.85 \\times 240 = 204$。"],
          [
            "Use the part that remains, $0.85$, not the part taken away: $0.15x = 204$ is wrong.",
            "要用剩下的部分 $0.85$，不是去掉的部分：$0.15x = 204$ 是错的。",
          ],
        ],
        (rng) => originalEquationProblem(rng, false),
        decreaseTape,
      ),
      lesson(
        "original-value-after-a-decrease",
        ["Finding the original value", "求原值"],
        [
          [
            "To undo a decrease, divide the new value by the multiplier for the part that remains. After a $15\\%$ decrease a town has $204$ residents: $0.85x = 204$, so $x = 204 \\div 0.85 = 240$.",
            "要还原一次减少，就用新的值除以剩下部分的倍数。减少 $15\\%$ 后某镇有 $204$ 人：$0.85x = 204$，所以 $x = 204 \\div 0.85 = 240$。",
          ],
          ["$15\\%$ of $240$ is $36$, and $240 - 36 = 204$.", "$240$ 的 $15\\%$ 是 $36$，$240 - 36 = 204$。"],
          [
            "Adding $15\\%$ of $204$ back gives $234.60$, not $240$: the $15\\%$ was of the original.",
            "把 $204$ 的 $15\\%$ 加回去得 $234.60$，不是 $240$：这 $15\\%$ 是针对原值的。",
          ],
        ],
        (rng) => originalProblem(rng, false),
        decreaseTape,
      ),
    ],
  ),
  [
    "After a $15\\%$ fall, a town has $204$ residents. How many did it have before?",
    "人口减少 $15\\%$ 后，某镇有 $204$ 人。原来有多少人？",
  ],
  [
    "$0.85x = 204$ gives $x = 240$, and $240 - 15\\%$ of $240 = 240 - 36 = 204$.",
    "$0.85x = 204$ 得 $x = 240$；$240$ 减去它的 $15\\%$，$240 - 36 = 204$。",
  ],
  [
    "write an equation for the original value after a decrease and solve it by dividing by the part that remains.",
    "为减少后的原值列方程，并用除以剩下部分的方法求解。",
  ],
);

/** signedChange describes a percentage change of s percent in words. */
const signedChange = (s: number) =>
  s > 0 ? t(`increased by $${s}\\%$`, `增加 $${s}\\%$`) : t(`decreased by $${-s}\\%$`, `减少 $${-s}\\%$`);

/** applyingPercentagesInSuccession applies two percentage changes one after the other. */
export const applyingPercentagesInSuccession = withIntro(
  topic(
    "applying-percentages-in-succession",
    t("Applying Percentages in Succession", "连续的百分比变化"),
    t(
      "Two percentage changes in a row multiply: a 20% increase followed by a 10% decrease multiplies by 1.2 × 0.9 = 1.08, an overall increase of 8%, not 10%. The second percentage is taken of the new value, not of the original.",
      "连续两次百分比变化要相乘：先增加 20% 再减少 10%，相当于乘 1.2 × 0.9 = 1.08，总体增加 8%，而不是 10%。第二个百分比是以新值为基准的，而不是原值。",
    ),
    ["calculating-percentage-change"],
    ["7.RP.A.3"],
    [
      lesson(
        "value-after-two-changes",
        ["The value after two changes", "两次变化后的值"],
        [
          [
            "When one percentage change follows another, the second applies to the new value. Multiply by one multiplier, then by the next. $500$ increased by $20\\%$ is $500 \\times 1.2 = 600$; then decreased by $10\\%$ it is $600 \\times 0.9 = 540$.",
            "一次百分比变化之后再变化时，第二次变化针对的是新的值。先乘第一个倍数，再乘第二个倍数。$500$ 增加 $20\\%$ 得 $500 \\times 1.2 = 600$；再减少 $10\\%$ 得 $600 \\times 0.9 = 540$。",
          ],
          [
            "One combined multiplier: $1.2 \\times 0.9 = 1.08$, and $500 \\times 1.08 = 540$.",
            "合成一个倍数：$1.2 \\times 0.9 = 1.08$，$500 \\times 1.08 = 540$。",
          ],
          [
            "Do not add the percentages: $+20\\%$ and $-10\\%$ is not $+10\\%$, because the $10\\%$ is of $600$.",
            "不要把百分数相加：$+20\\%$ 和 $-10\\%$ 不是 $+10\\%$，因为这 $10\\%$ 是 $600$ 的。",
          ],
        ],
        (rng) => {
          const n = 100 * rng.int(2, 9);
          let a: number;
          let b: number;
          do {
            a = 10 * rng.nonZero(-5, 8);
            b = 10 * rng.nonZero(-5, 8);
          } while (a + b === 0 || a === b);
          const mid = (n * (100 + a)) / 100;
          const end = (mid * (100 + b)) / 100;
          const both = Q.of((100 + a) * (100 + b), 10000);
          return valued(
            [
              `The number $${n}$ is ${signedChange(a).en}, and the result is then ${signedChange(b).en}. What is the final value?`,
              `把 $${n}$ 先${signedChange(a)["zh-CN"]}，再把结果${signedChange(b)["zh-CN"]}。最后的值是多少？`,
            ],
            end,
            [
              [
                ["First change", "第一次变化"],
                [`Multiply by $${multiplier(a)}$:`, `乘 $${multiplier(a)}$：`],
                [`${n} \\times ${multiplier(a)} = ${mid}`],
              ],
              [
                ["Second change", "第二次变化"],
                [`Multiply the new value by $${multiplier(b)}$:`, `用新的值乘 $${multiplier(b)}$：`],
                [`${mid} \\times ${multiplier(b)} = ${end}`],
              ],
            ],
            [
              `One combined multiplier: $${multiplier(a)} \\times ${multiplier(b)} = ${dec(both)}$, and $${n} \\times ${dec(both)} = ${end}$.`,
              `合成一个倍数：$${multiplier(a)} \\times ${multiplier(b)} = ${dec(both)}$，$${n} \\times ${dec(both)} = ${end}$。`,
            ],
            [
              [
                (n * (100 + a + b)) / 100,
                "That adds the two percentages, but the second applies to the new value.",
                "这是把两个百分数相加，但第二个是针对新值的。",
              ],
              [mid, "That is the value after the first change only.", "这只是第一次变化后的值。"],
              [(n * (100 - a) * (100 - b)) / 10000, "That turns both changes the wrong way.", "这是把两次变化的方向都弄反了。"],
            ],
          );
        },
        tapeFigure(
          [
            { pieces: [{ size: 500, text: "500" }] },
            { pieces: [{ size: 600, text: "600" }] },
            { pieces: [{ size: 540, text: "540", lit: true }] },
          ],
          ["Three bars: 500, then 600 after the increase, then 540 after the decrease.", "三个长条：500，增加后 600，再减少后 540。"],
        ),
      ),
      lesson(
        "overall-percentage-change",
        ["The overall percentage change", "总体百分比变化"],
        [
          [
            "The overall effect of two changes is the product of their multipliers. Subtract $1$ from the product and write it as a percentage. A $20\\%$ increase and then a $10\\%$ increase multiply by $1.2 \\times 1.1 = 1.32$: an overall increase of $32\\%$.",
            "两次变化的总效果是两个倍数的乘积。把乘积减去 $1$，再写成百分数。先增加 $20\\%$ 再增加 $10\\%$，相当于乘 $1.2 \\times 1.1 = 1.32$：总体增加 $32\\%$。",
          ],
          [
            "Start from $100$: $100 \\times 1.2 = 120$, then $120 \\times 1.1 = 132$, which is $32$ more than $100$.",
            "从 $100$ 开始：$100 \\times 1.2 = 120$，再 $120 \\times 1.1 = 132$，比 $100$ 多 $32$。",
          ],
          [
            "Adding the percentages gives $30\\%$, which is wrong: the second $10\\%$ is of $120$.",
            "把百分数相加得 $30\\%$，是错的：第二个 $10\\%$ 是 $120$ 的。",
          ],
        ],
        (rng) => {
          const what = rng.pick([
            t("price of a bike", "一辆自行车的价格"),
            t("population of a town", "某镇的人口"),
            t("weekly pay of a worker", "一名工人的周薪"),
            t("number of members of a club", "一个俱乐部的会员人数"),
          ]);
          let a: number;
          let b: number;
          let total: number;
          do {
            a = 10 * rng.nonZero(-5, 5);
            b = 10 * rng.nonZero(-5, 5);
            total = ((100 + a) * (100 + b)) / 100 - 100;
          } while (total === 0 || a + b === 0);
          return valued(
            [
              `The ${what.en} is ${signedChange(a).en} one year and ${signedChange(b).en} the next year. What is the overall percentage change over the two years? Write a decrease as a negative number.`,
              `${what["zh-CN"]}第一年${signedChange(a)["zh-CN"]}，第二年又${signedChange(b)["zh-CN"]}。两年总体的百分比变化是多少？减少用负数表示。`,
            ],
            total,
            [
              [
                ["Multipliers", "写出倍数"],
                ["Write each change as a multiplier:", "把每次变化写成倍数："],
                [`${100 + a}\\% = ${multiplier(a)}`, `${100 + b}\\% = ${multiplier(b)}`],
              ],
              [
                ["Multiply", "相乘"],
                ["Multiply them for the overall effect:", "相乘得到总效果："],
                [`${multiplier(a)} \\times ${multiplier(b)} = ${multiplier(total)}`],
              ],
              [
                ["Read the change", "读出变化"],
                [`That is $${100 + total}\\%$ of the start, a change of:`, `这是开始时的 $${100 + total}\\%$，变化了：`],
                [`${100 + total}\\% - 100\\% = ${total}\\%`],
              ],
            ],
            [
              `Start from $100$: $100 \\times ${multiplier(a)} = ${100 + a}$, then $${100 + a} \\times ${multiplier(b)} = ${100 + total}$.`,
              `从 $100$ 开始：$100 \\times ${multiplier(a)} = ${100 + a}$，再 $${100 + a} \\times ${multiplier(b)} = ${100 + total}$。`,
            ],
            [
              [a + b, "That adds the percentages, but the second applies to the new value.", "这是把百分数相加，但第二个是针对新值的。"],
              [-(a + b), "That adds the percentages and also flips the sign.", "这是把百分数相加，还弄反了符号。"],
              [
                Q.of(a * b, 100),
                "That multiplies the percentages themselves, not the multipliers.",
                "这是把百分数本身相乘，而不是把倍数相乘。",
              ],
              [
                -total,
                `The sign is wrong: the overall change is ${total > 0 ? "an increase" : "a decrease"}.`,
                `符号错了：总体是${total > 0 ? "增加" : "减少"}。`,
              ],
            ],
            { percent: true },
          );
        },
        tapeFigure(
          [
            { pieces: [{ size: 100, text: "100" }] },
            { pieces: [{ size: 120, text: "120" }] },
            {
              pieces: [
                { size: 100, text: "100" },
                { size: 32, text: "32", lit: true },
              ],
            },
          ],
          ["Three bars: 100, then 120, then 132, which is 32 more than 100.", "三个长条：100，然后 120，再然后 132，比 100 多 32。"],
        ),
      ),
    ],
  ),
  [
    "A price goes up $20\\%$ and then down $10\\%$. Is it now $10\\%$ higher than at the start?",
    "一个价格先上涨 $20\\%$，再下降 $10\\%$。它现在比开始时高 $10\\%$ 吗？",
  ],
  [
    "No: $1.2 \\times 0.9 = 1.08$, so it is $8\\%$ higher; from $100$, $120$ then $108$.",
    "不是：$1.2 \\times 0.9 = 1.08$，所以只高 $8\\%$；从 $100$ 变到 $120$，再变到 $108$。",
  ],
  [
    "apply two percentage changes one after the other and find the overall change by multiplying.",
    "连续进行两次百分比变化，并用相乘的方法求总体变化。",
  ],
);

/** interpretingPercentageChange compares percentage changes and reads a value as a percentage of the original. */
export const interpretingPercentageChange = withIntro(
  topic(
    "interpreting-percentage-change",
    t("Interpreting Percentage Change", "解读百分比变化"),
    t(
      "A percentage change compares the change with the starting value, so a large change in a large quantity can be a small percentage. A value that is now 130% of the original has increased by 30%; one that is 75% of the original has decreased by 25%.",
      "百分比变化是把变化量与起始值相比，所以大的量变化很多，百分比也可能很小。现在是原来 130% 的值增加了 30%；是原来 75% 的值减少了 25%。",
    ),
    ["calculating-percentage-change"],
    ["7.RP.A.3"],
    [
      lesson(
        "comparing-percentage-changes",
        ["Comparing percentage changes", "比较百分比变化"],
        [
          [
            "To compare growth fairly, compare percentages, not amounts. Town A grew from $200$ to $260$ people, $+60$ or $30\\%$. Town B grew from $1000$ to $1200$, $+200$ or $20\\%$. Town B gained more people, but town A had the greater percentage increase.",
            "要公平地比较增长，就比较百分比，不比较数量。A 镇从 $200$ 人增长到 $260$ 人，增加 $60$ 人，即 $30\\%$。B 镇从 $1000$ 人增长到 $1200$ 人，增加 $200$ 人，即 $20\\%$。B 镇增加的人更多，但 A 镇增长的百分比更大。",
          ],
          ["$200 \\times 1.3 = 260$ and $1000 \\times 1.2 = 1200$.", "$200 \\times 1.3 = 260$，$1000 \\times 1.2 = 1200$。"],
          ["A bigger number of new people does not mean a bigger percentage.", "增加的人数多，不代表增长的百分比大。"],
        ],
        (rng) => {
          const a0 = 200 * rng.int(5, 15);
          const b0 = 200 * rng.int(25, 49);
          let pa: number;
          let pb: number;
          do {
            pa = 5 * rng.int(2, 12);
            pb = 5 * rng.int(2, 12);
          } while (pa === pb);
          const [a1, b1] = [(a0 * (100 + pa)) / 100, (b0 * (100 + pb)) / 100];
          const swap = rng.bool();
          const [x0, x1, px, y0, y1, py] = swap ? [b0, b1, pb, a0, a1, pa] : [a0, a1, pa, b0, b1, pb];
          const aWins = px > py;
          const options: Pair[] = [
            ["Town A", "A 镇"],
            ["Town B", "B 镇"],
            ["Both are the same", "一样大"],
          ];
          const [lose, loseP, winP] = aWins ? ["B", py, px] : ["A", px, py];
          return chosen(
            rng,
            [
              `The population of town A grew from $${x0}$ to $${x1}$. The population of town B grew from $${y0}$ to $${y1}$. Which town had the greater percentage increase?`,
              `A 镇的人口从 $${x0}$ 增长到 $${x1}$，B 镇的人口从 $${y0}$ 增长到 $${y1}$。哪个镇人口增长的百分比更大？`,
            ],
            options[aWins ? 0 : 1] as Pair,
            [
              [
                options[aWins ? 1 : 0] as Pair,
                `Town ${lose} grew by only $${loseP}\\%$, less than $${winP}\\%$.`,
                `${lose} 镇只增长了 $${loseP}\\%$，比 $${winP}\\%$ 少。`,
              ],
              [options[2] as Pair, `The percentages differ: $${px}\\%$ and $${py}\\%$.`, `两个百分比不同：$${px}\\%$ 和 $${py}\\%$。`],
            ],
            [
              [
                ["Town A", "A 镇"],
                ["Divide its increase by its starting population:", "用增加的人数除以原来的人口："],
                [`\\frac{${x1 - x0}}{${x0}} = ${px}\\%`],
              ],
              [
                ["Town B", "B 镇"],
                ["Do the same for town B, then compare:", "B 镇也这样算，再比较："],
                [`\\frac{${y1 - y0}}{${y0}} = ${py}\\%`],
              ],
            ],
            [
              `$${x0} \\times ${multiplier(px)} = ${x1}$ and $${y0} \\times ${multiplier(py)} = ${y1}$, so the percentages are right.`,
              `$${x0} \\times ${multiplier(px)} = ${x1}$，$${y0} \\times ${multiplier(py)} = ${y1}$，所以百分比是对的。`,
            ],
          );
        },
        tapeFigure(
          [
            {
              pieces: [
                { size: 200, text: "200" },
                { size: 60, text: "60", lit: true },
              ],
            },
            {
              pieces: [
                { size: 1000, text: "1000" },
                { size: 200, text: "200", lit: true },
              ],
            },
          ],
          [
            "Two bars: 200 grows by 60 and 1000 grows by 200; 60 is a larger share of 200.",
            "两个长条：200 增加 60，1000 增加 200；60 占 200 的份额更大。",
          ],
        ),
      ),
      lesson(
        "percentage-of-the-original",
        ["A value as a percentage of the original", "现值占原值的百分比"],
        [
          [
            "The original value is $100\\%$, so a value that is now $r\\%$ of it has changed by $r\\% - 100\\%$. A price that is now $130\\%$ of the original has changed by $130\\% - 100\\% = 30\\%$, an increase; one that is $75\\%$ of the original has changed by $-25\\%$, a decrease.",
            "原值是 $100\\%$，所以现在是原值 $r\\%$ 的值变化了 $r\\% - 100\\%$。现在是原价 $130\\%$ 的价格变化了 $130\\% - 100\\% = 30\\%$，是增加；是原价 $75\\%$ 的价格变化了 $-25\\%$，是减少。",
          ],
          [
            "A $\\$100$ price that rises $30\\%$ becomes $\\$130$, which is $130\\%$ of $\\$100$.",
            "$\\$100$ 的价格上涨 $30\\%$ 变成 $\\$130$，正是 $\\$100$ 的 $130\\%$。",
          ],
          ["$130\\%$ of the original is a change of $30\\%$, not $130\\%$.", "是原来的 $130\\%$，表示变化了 $30\\%$，不是 $130\\%$。"],
        ],
        (rng) => {
          let r: number;
          do r = rng.int(8, 39) * 5;
          while (r === 100);
          const what = rng.pick([
            t("the price of a game", "一款游戏的价格"),
            t("the number of visitors to a museum", "博物馆的参观人数"),
            t("the rent of an apartment", "一套公寓的租金"),
            t("the monthly profit of a shop", "一家商店的月利润"),
          ]);
          return valued(
            [
              `This year, ${what.en} is $${r}\\%$ of what it was last year. What is the percentage change? Write a decrease as a negative number.`,
              `今年${what["zh-CN"]}是去年的 $${r}\\%$。百分比变化是多少？减少用负数表示。`,
            ],
            r - 100,
            [
              [
                ["The start", "起点"],
                ["Last year's value is the whole, $100\\%$.", "去年的值是整体 $100\\%$。"],
              ],
              [
                ["Subtract", "相减"],
                ["Subtract $100\\%$ from this year's percentage:", "用今年的百分比减去 $100\\%$："],
                [`${r}\\% - 100\\% = ${r - 100}\\%`],
              ],
            ],
            [
              `A value of $100$ changed by $${r - 100}\\%$ becomes $100 ${r > 100 ? "+" : "-"} ${Math.abs(r - 100)} = ${r}$, which is $${r}\\%$ of $100$.`,
              `$100$ 变化 $${r - 100}\\%$ 后变成 $100 ${r > 100 ? "+" : "-"} ${Math.abs(r - 100)} = ${r}$，正是 $100$ 的 $${r}\\%$。`,
            ],
            [
              [r, "That is this year as a percentage of last year, not the change.", "这是今年占去年的百分比，不是变化的百分比。"],
              [
                100 - r,
                `The sign is wrong: this is ${r > 100 ? "an increase" : "a decrease"}.`,
                `符号错了：这是${r > 100 ? "增加" : "减少"}。`,
              ],
              [Q.of(10000, r).sub(Q.of(100)), "That compares with this year instead of last year.", "这是与今年比，而不是与去年比。"],
            ],
            { percent: true },
          );
        },
        tapeFigure(
          [
            { pieces: [{ size: 100, text: "100%" }] },
            {
              pieces: [
                { size: 100, text: "100%" },
                { size: 30, text: "30%", lit: true },
              ],
            },
          ],
          [
            "Two bars: the original at 100 percent and the new value at 130 percent, 30 percent more.",
            "两个长条：原值 100%，新值 130%，多出 30%。",
          ],
        ),
      ),
    ],
  ),
  [
    "Town A grew from $200$ to $260$ people and town B from $1000$ to $1200$. Which town grew faster in percentage terms?",
    "A 镇从 $200$ 人增长到 $260$ 人，B 镇从 $1000$ 人增长到 $1200$ 人。按百分比算，哪个镇增长得快？",
  ],
  [
    "Town A: $\\frac{60}{200} = 30\\%$; town B: $\\frac{200}{1000} = 20\\%$. Town A grew faster, though B gained more people.",
    "A 镇：$\\frac{60}{200} = 30\\%$；B 镇：$\\frac{200}{1000} = 20\\%$。A 镇增长得快，尽管 B 镇增加的人更多。",
  ],
  ["compare percentage changes and read a value given as a percentage of the original.", "比较百分比变化，并解读用原值百分比表示的值。"],
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
export const percentagesInCommerceAndFinance = withIntro(
  topic(
    "percentages-in-commerce-and-finance",
    t("Percentages in Commerce and Finance", "商业与理财中的百分比"),
    t(
      "Sales tax and tips are percentages added to a price; discounts are percentages taken off. A \\$40 item with 8% tax costs \\$40 × 1.08 = \\$43.20; with a 25% discount it costs \\$40 × 0.75 = \\$30.",
      "销售税和小费是加在价格上的百分比；折扣是从价格中减去的百分比。\\$40 的商品加 8% 的税是 \\$40 × 1.08 = \\$43.20；打 25% 的折扣是 \\$40 × 0.75 = \\$30。",
    ),
    ["applying-percentage-decreases"],
    ["7.RP.A.3"],
    [
      lesson(
        "sales-tax",
        ["Sales tax", "销售税"],
        [
          [
            "Sales tax is a percentage of the price that is added on top of it. Multiply the price by the tax rate to find the tax, then add it to the price for the total. A $\\$40$ item with $8\\%$ sales tax: the tax is $0.08 \\times 40 = \\$3.20$, so the total is $\\$43.20$.",
            "销售税是按价格的百分之几加收的钱。用价格乘税率求出税，再加到价格上得到总额。$\\$40$ 的商品，销售税 $8\\%$：税是 $0.08 \\times 40 = \\$3.20$，所以共 $\\$43.20$。",
          ],
          ["In one step: $40 \\times 1.08 = 43.20$.", "一步算：$40 \\times 1.08 = 43.20$。"],
          ["The tax alone, $\\$3.20$, is not the total: add it to the price.", "只有税 $\\$3.20$ 不是总额：要把它加到价格上。"],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          const d = rng.int(12, 150);
          const r = rng.int(3, 10);
          const tax = d * r;
          return valued(
            [
              `A ${it.en} costs $\\$${d}$ before tax. The sales tax is $${r}\\%$. What is the total cost, in dollars?`,
              `${it.zh}税前售价 $\\$${d}$，销售税为 $${r}\\%$。总共要付多少美元？`,
            ],
            cq(d * 100 + tax),
            [
              [
                ["Find the tax", "求税"],
                ["Multiply the price by the tax rate:", "用价格乘税率："],
                [`${dec(Q.of(r, 100))} \\times ${d} = ${dec(cq(tax))}`],
              ],
              [["Add", "相加"], ["Add the tax to the price:", "把税加到价格上："], [`${d} + ${dec(cq(tax))} = ${dec(cq(d * 100 + tax))}`]],
            ],
            [
              `In one step: $${d} \\times ${dec(Q.of(100 + r, 100))} = ${dec(cq(d * 100 + tax))}$.`,
              `一步算：$${d} \\times ${dec(Q.of(100 + r, 100))} = ${dec(cq(d * 100 + tax))}$。`,
            ],
            [
              [cq(tax), "That is only the tax; add it to the price.", "这只是税；还要加到价格上。"],
              [Q.of(d + r), `That adds $${r}$ dollars, not $${r}\\%$ of the price.`, `这是加了 $${r}$ 美元，而不是价格的 $${r}\\%$。`],
              [cq(d * 100 - tax), "That takes the tax off; tax is added on.", "这是把税减掉了；税是要加上的。"],
              [cq(d * 100 + tax * 10), `That uses $${r * 10}\\%$ instead of $${r}\\%$.`, `这是用了 $${r * 10}\\%$，而不是 $${r}\\%$。`],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "43.20",
              pieces: [
                { size: 40, text: "40" },
                { size: 3.2, text: "3.20", lit: true },
              ],
            },
          ],
          ["A bar of 40 with 3.20 of tax added, making 43.20.", "长条 40 加上税 3.20，共 43.20。"],
        ),
      ),
      lesson(
        "discounts",
        ["Discounts", "折扣"],
        [
          [
            "A discount is a percentage of the original price that is taken off. Multiply the price by the rate to find the discount, then subtract it to get the sale price. A $\\$40$ item is $25\\%$ off: the discount is $0.25 \\times 40 = \\$10$, so the sale price is $\\$30$.",
            "折扣是从原价中减去原价的百分之几。用原价乘折扣率求出优惠的钱，再从原价中减去，得到售价。$\\$40$ 的商品优惠 $25\\%$：优惠 $0.25 \\times 40 = \\$10$，所以售价 $\\$30$。",
          ],
          ["You pay $75\\%$ of the price: $40 \\times 0.75 = 30$.", "要付原价的 $75\\%$：$40 \\times 0.75 = 30$。"],
          ["The $\\$10$ is what you save, not what you pay.", "$\\$10$ 是省下的钱，不是要付的钱。"],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          const d = rng.int(12, 150);
          const p = 5 * rng.int(1, 14);
          const off = d * p;
          return valued(
            [
              `A ${it.en} regularly costs $\\$${d}$. It is on sale for $${p}\\%$ off. What is the sale price, in dollars?`,
              `${it.zh}原价 $\\$${d}$，现在优惠 $${p}\\%$。售价是多少美元？`,
            ],
            cq(d * 100 - off),
            [
              [
                ["Find the discount", "求优惠的钱"],
                ["Multiply the price by the rate:", "用原价乘折扣率："],
                [`${dec(Q.of(p, 100))} \\times ${d} = ${dec(cq(off))}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the discount off the price:", "从原价中减去优惠的钱："],
                [`${d} - ${dec(cq(off))} = ${dec(cq(d * 100 - off))}`],
              ],
            ],
            [
              `You pay $${100 - p}\\%$ of the price: $${d} \\times ${dec(Q.of(100 - p, 100))} = ${dec(cq(d * 100 - off))}$.`,
              `要付原价的 $${100 - p}\\%$：$${d} \\times ${dec(Q.of(100 - p, 100))} = ${dec(cq(d * 100 - off))}$。`,
            ],
            [
              [cq(off), "That is the discount, the money saved, not the sale price.", "这是优惠的钱，也就是省下的钱，不是售价。"],
              ...(d > p
                ? [
                    [
                      Q.of(d - p),
                      `That takes off $${p}$ dollars, not $${p}\\%$ of the price.`,
                      `这是减去 $${p}$ 美元，而不是原价的 $${p}\\%$。`,
                    ] as const,
                  ]
                : []),
              [cq(d * 100 + off), "That adds the discount instead of taking it off.", "这是把优惠的钱加上了，应该减去。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "40",
              pieces: [
                { size: 30, text: "30", lit: true },
                { size: 10, text: "10", dashed: true },
              ],
            },
          ],
          ["A bar of 40 with the discount 10 taken off, leaving the sale price 30.", "长条 40 减去优惠的 10，剩下售价 30。"],
        ),
      ),
      lesson(
        "tips",
        ["Tips", "小费"],
        [
          [
            "A tip is a percentage of the bill paid on top of it. Multiply the bill by the tip rate to find the tip, then add it to the bill. An $18\\%$ tip on a $\\$45$ bill is $0.18 \\times 45 = \\$8.10$, so the total is $\\$53.10$.",
            "小费是在账单之外另付的账单的百分之几。用账单金额乘小费率求出小费，再加到账单上。$\\$45$ 的账单付 $18\\%$ 的小费：$0.18 \\times 45 = \\$8.10$，所以共 $\\$53.10$。",
          ],
          [
            "$10\\%$ of $45$ is $4.50$, and $8\\%$ is $3.60$; $4.50 + 3.60 = 8.10$.",
            "$45$ 的 $10\\%$ 是 $4.50$，$8\\%$ 是 $3.60$；$4.50 + 3.60 = 8.10$。",
          ],
          ["Read the question: it may ask for the tip alone or for the whole amount paid.", "看清问题：可能只问小费，也可能问一共付多少。"],
        ],
        (rng) => {
          const d = rng.int(15, 120);
          const r = rng.pick([10, 12, 15, 18, 20, 22, 25]);
          const tip = d * r;
          const total = rng.bool();
          const find: Walk = [
            ["Find the tip", "求小费"],
            ["Multiply the bill by the tip rate:", "用账单金额乘小费率："],
            [`${dec(Q.of(r, 100))} \\times ${d} = ${dec(cq(tip))}`],
          ];
          const ten = d * 10;
          return valued(
            total
              ? [
                  `A restaurant bill is $\\$${d}$. The diners leave ${article(r)} $${r}\\%$ tip. How much do they pay in all, in dollars?`,
                  `餐馆账单是 $\\$${d}$，顾客另付 $${r}\\%$ 的小费。他们一共付多少美元？`,
                ]
              : [
                  `A restaurant bill is $\\$${d}$. How much is ${article(r)} $${r}\\%$ tip, in dollars?`,
                  `餐馆账单是 $\\$${d}$。$${r}\\%$ 的小费是多少美元？`,
                ],
            total ? cq(d * 100 + tip) : cq(tip),
            total
              ? [
                  find,
                  [
                    ["Add", "相加"],
                    ["Add the tip to the bill:", "把小费加到账单上："],
                    [`${d} + ${dec(cq(tip))} = ${dec(cq(d * 100 + tip))}`],
                  ],
                ]
              : [
                  [
                    ["Write the rate", "写出比率"],
                    ["Write the tip rate as a decimal:", "把小费率写成小数："],
                    [`${r}\\% = ${dec(Q.of(r, 100))}`],
                  ],
                  find,
                ],
            total
              ? [
                  `In one step: $${d} \\times ${dec(Q.of(100 + r, 100))} = ${dec(cq(d * 100 + tip))}$.`,
                  `一步算：$${d} \\times ${dec(Q.of(100 + r, 100))} = ${dec(cq(d * 100 + tip))}$。`,
                ]
              : [
                  `$10\\%$ of $${d}$ is $${dec(cq(ten))}$, so $${r}\\%$ is $${dec(cq(ten))} \\times ${dec(Q.of(r, 10))} = ${dec(cq(tip))}$.`,
                  `$${d}$ 的 $10\\%$ 是 $${dec(cq(ten))}$，所以 $${r}\\%$ 是 $${dec(cq(ten))} \\times ${dec(Q.of(r, 10))} = ${dec(cq(tip))}$。`,
                ],
            total
              ? [
                  [cq(tip), "That is only the tip; add it to the bill.", "这只是小费；还要加到账单上。"],
                  [Q.of(d + r), `That adds $${r}$ dollars, not $${r}\\%$ of the bill.`, `这是加了 $${r}$ 美元，而不是账单的 $${r}\\%$。`],
                  [cq(d * 100 - tip), "That takes the tip off; a tip is added on.", "这是把小费减掉了；小费是要加上的。"],
                ]
              : [
                  [
                    Q.of(d * r),
                    `That multiplies by $${r}$ instead of by $${dec(Q.of(r, 100))}$.`,
                    `这是乘 $${r}$，而不是乘 $${dec(Q.of(r, 100))}$。`,
                  ],
                  [
                    cq(d * 100 + tip),
                    "That is the whole amount paid; the question asks for the tip alone.",
                    "这是一共付的钱；问题只问小费。",
                  ],
                  [Q.of(r), "That is the rate as a number of dollars.", "这是把比率当成了美元数。"],
                ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "53.10",
              pieces: [
                { size: 45, text: "45" },
                { size: 8.1, text: "8.10", lit: true },
              ],
            },
          ],
          ["A bar of the bill 45 with the tip 8.10 added, making 53.10.", "账单 45 的长条加上小费 8.10，共 53.10。"],
        ),
      ),
    ],
  ),
  [
    "A $\\$40$ backpack is $25\\%$ off, and a $\\$45$ meal gets an $18\\%$ tip. What does each cost in the end?",
    "一个 $\\$40$ 的背包优惠 $25\\%$，一顿 $\\$45$ 的饭付 $18\\%$ 的小费。最后各要付多少钱？",
  ],
  [
    "Backpack: $40 - 0.25 \\times 40 = \\$30$, and $40 \\times 0.75 = 30$. Meal: $45 + 0.18 \\times 45 = \\$53.10$, and $45 \\times 1.18 = 53.10$.",
    "背包：$40 - 0.25 \\times 40 = \\$30$，而 $40 \\times 0.75 = 30$。饭钱：$45 + 0.18 \\times 45 = \\$53.10$，而 $45 \\times 1.18 = 53.10$。",
  ],
  ["work out sales tax, discounts and tips, adding a percentage on or taking it off.", "计算销售税、折扣和小费：加上或减去一个百分比。"],
);

/** furtherPercentagesInCommerceAndFinance computes markups and commissions and finds percentage rates. */
export const furtherPercentagesInCommerceAndFinance = withIntro(
  topic(
    "further-percentages-in-commerce-and-finance",
    t("Further Percentages in Commerce and Finance", "商业与理财中的百分比（进阶）"),
    t(
      "A store marks up the price it pays (the cost) by a percentage to set its retail price. A salesperson's commission is a percentage of their sales. A tax, tip or discount rate is the amount divided by the original price.",
      "商店在进价（成本）上加一个百分比来定零售价，这叫加价。销售员的佣金是销售额的百分比。税率、小费率或折扣率等于相应的金额除以原价。",
    ),
    ["percentages-in-commerce-and-finance", "calculating-percentage-change"],
    ["7.RP.A.3"],
    [
      lesson(
        "markups",
        ["Markups", "加价"],
        [
          [
            "A markup is the percentage a store adds to what it paid, to set its selling price. The retail price is the cost plus the markup. A store pays $\\$24$ for a lamp and marks it up by $75\\%$: the markup is $0.75 \\times 24 = \\$18$, so the retail price is $24 + 18 = \\$42$.",
            "加价是商店在进价上加的百分之几，以此定出售价。零售价等于进价加上加价的金额。商店以 $\\$24$ 购进一盏台灯，加价 $75\\%$：加价 $0.75 \\times 24 = \\$18$，所以零售价是 $24 + 18 = \\$42$。",
          ],
          ["In one step: $24 \\times 1.75 = 42$.", "一步算：$24 \\times 1.75 = 42$。"],
          ["The markup is a percentage of the cost, the price the store paid.", "加价是按进价，也就是商店付的钱，算百分之几。"],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          const c = 4 * rng.int(3, 40);
          const m = 5 * rng.int(4, 30);
          const up = c * m;
          return valued(
            [
              `A store buys a ${it.en} for $\\$${c}$ and marks up the price by $${m}\\%$. What is the retail price, in dollars?`,
              `商店以 $\\$${c}$ 购进${it.zh}，加价 $${m}\\%$。零售价是多少美元？`,
            ],
            cq(c * 100 + up),
            [
              [
                ["Find the markup", "求加价的金额"],
                ["Multiply the cost by the markup rate:", "用进价乘加价率："],
                [`${dec(Q.of(m, 100))} \\times ${c} = ${dec(cq(up))}`],
              ],
              [
                ["Add", "相加"],
                ["Add the markup to the cost:", "把加价的金额加到进价上："],
                [`${c} + ${dec(cq(up))} = ${dec(cq(c * 100 + up))}`],
              ],
            ],
            [
              `In one step: $${c} \\times ${dec(Q.of(100 + m, 100))} = ${dec(cq(c * 100 + up))}$.`,
              `一步算：$${c} \\times ${dec(Q.of(100 + m, 100))} = ${dec(cq(c * 100 + up))}$。`,
            ],
            [
              [cq(up), "That is only the markup; add it to the cost.", "这只是加价的金额；还要加到进价上。"],
              [Q.of(c + m), `That adds $${m}$ dollars, not $${m}\\%$ of the cost.`, `这是加了 $${m}$ 美元，而不是进价的 $${m}\\%$。`],
              ...(m < 100
                ? [[cq(c * 100 - up), "That takes the markup off; a markup is added on.", "这是把加价减掉了；加价是要加上的。"] as const]
                : []),
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "42",
              pieces: [
                { size: 24, text: "24" },
                { size: 18, text: "18", lit: true },
              ],
            },
          ],
          ["A bar of the cost 24 with the markup 18 added, making 42.", "进价 24 的长条加上加价 18，共 42。"],
        ),
      ),
      lesson(
        "commission",
        ["Commission", "佣金"],
        [
          [
            "A commission is a percentage of the sales that a salesperson earns. Multiply the sales by the commission rate, then add any base pay. A salesperson earns $\\$300$ a week plus $5\\%$ commission. On $\\$4000$ of sales, the commission is $0.05 \\times 4000 = \\$200$, so the pay is $300 + 200 = \\$500$.",
            "佣金是销售员按销售额的百分之几得到的报酬。用销售额乘佣金率，再加上底薪。一名销售员每周底薪 $\\$300$，另加 $5\\%$ 的佣金。销售额 $\\$4000$ 时，佣金是 $0.05 \\times 4000 = \\$200$，所以工资是 $300 + 200 = \\$500$。",
          ],
          [
            "$1\\%$ of $4000$ is $40$, so $5\\%$ is $5 \\times 40 = 200$.",
            "$4000$ 的 $1\\%$ 是 $40$，所以 $5\\%$ 是 $5 \\times 40 = 200$。",
          ],
          ["The commission is a percentage of the sales only, not of the base pay.", "佣金只按销售额算百分之几，不按底薪算。"],
        ],
        (rng) => {
          const name = rng.pick(names);
          const base = 50 * rng.int(4, 12);
          const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12]);
          const sales = 100 * rng.int(15, 99);
          const comm = (sales * r) / 100;
          return valued(
            [
              `${name} earns $\\$${base}$ a week plus ${article(r)} $${r}\\%$ commission on sales. This week ${name} sold $\\$${sales}$ worth of goods. How much did ${name} earn this week, in dollars?`,
              `${name} 每周底薪 $\\$${base}$，另加销售额 $${r}\\%$ 的佣金。这周 ${name} 的销售额是 $\\$${sales}$。${name} 这周挣了多少美元？`,
            ],
            base + comm,
            [
              [
                ["Find the commission", "求佣金"],
                ["Multiply the sales by the rate:", "用销售额乘佣金率："],
                [`${dec(Q.of(r, 100))} \\times ${sales} = ${comm}`],
              ],
              [
                ["Add the base pay", "加上底薪"],
                ["Add the commission to the base pay:", "把佣金加到底薪上："],
                [`${base} + ${comm} = ${base + comm}`],
              ],
            ],
            [
              `$1\\%$ of $${sales}$ is $${sales / 100}$, so $${r}\\%$ is $${r} \\times ${sales / 100} = ${comm}$, and $${base} + ${comm} = ${base + comm}$.`,
              `$${sales}$ 的 $1\\%$ 是 $${sales / 100}$，所以 $${r}\\%$ 是 $${r} \\times ${sales / 100} = ${comm}$，$${base} + ${comm} = ${base + comm}$。`,
            ],
            [
              [comm, "That is only the commission; add the base pay.", "这只是佣金；还要加上底薪。"],
              [
                Q.of((base + sales) * r, 100),
                "That takes the percentage of the base pay as well as the sales.",
                "这是把底薪也算进了百分比。",
              ],
              [
                base + sales * r,
                `That multiplies by $${r}$ instead of by $${dec(Q.of(r, 100))}$.`,
                `这是乘 $${r}$，而不是乘 $${dec(Q.of(r, 100))}$。`,
              ],
              [
                base + sales,
                "That adds all the sales, but only a percentage of them is earned.",
                "这是把全部销售额都加上了，但只能挣其中的百分之几。",
              ],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "500",
              pieces: [
                { size: 300, text: "300" },
                { size: 200, text: "200", lit: true },
              ],
            },
          ],
          ["A bar of pay 500: the base pay 300 and the commission 200.", "工资 500 的长条：底薪 300 和佣金 200。"],
        ),
      ),
      lesson(
        "finding-a-percentage-rate",
        ["Finding the rate", "求百分率"],
        [
          [
            "To find a rate, divide the amount of the tax, tip, discount or markup by the amount it was taken from, usually the original price, and write it as a percentage. A $\\$60$ jacket is on sale for $\\$45$: the discount is $\\$15$, and $\\frac{15}{60} = 25\\%$.",
            "求比率时，用税、小费、折扣或加价的金额除以计算它所依据的金额（通常是原价），再写成百分数。原价 $\\$60$ 的夹克现价 $\\$45$：优惠了 $\\$15$，$\\frac{15}{60} = 25\\%$。",
          ],
          ["$25\\%$ of $60$ is $15$, and $60 - 15 = 45$.", "$60$ 的 $25\\%$ 是 $15$，$60 - 15 = 45$。"],
          ["Divide by the original price $60$, not by the sale price $45$.", "要除以原价 $60$，不是现价 $45$。"],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          const d = 20 * rng.int(1, 10);
          if (rng.bool()) {
            const p = 5 * rng.int(1, 15);
            const sale = (d * (100 - p)) / 100;
            return valued(
              [
                `A ${it.en} that regularly costs $\\$${d}$ is on sale for $\\$${sale}$. What is the percentage discount?`,
                `${it.zh}原价 $\\$${d}$，现价 $\\$${sale}$。优惠了百分之几？`,
              ],
              p,
              [
                [
                  ["Find the discount", "求优惠的钱"],
                  ["Subtract the sale price from the original:", "用原价减去现价："],
                  [`${d} - ${sale} = ${d - sale}`],
                ],
                [
                  ["Divide by the original", "除以原价"],
                  [`Divide by the original price, $${d}$:`, `除以原价 $${d}$：`],
                  [`\\frac{${d - sale}}{${d}} = ${dec(Q.of(p, 100))} = ${p}\\%`],
                ],
              ],
              [
                `$${d} \\times ${dec(Q.of(100 - p, 100))} = ${sale}$, the sale price.`,
                `$${d} \\times ${dec(Q.of(100 - p, 100))} = ${sale}$，正是现价。`,
              ],
              [
                [100 - p, "That is the percentage you still pay, not the discount.", "这是还要付的百分比，不是优惠的百分比。"],
                [d - sale, "That is the discount in dollars, not a percentage.", "这是优惠的美元数，不是百分比。"],
                [
                  Q.of((d - sale) * 100, sale),
                  "That divides by the sale price; divide by the original price.",
                  "这是除以现价；应该除以原价。",
                ],
              ],
              { percent: true },
            );
          }
          const r = rng.int(3, 10);
          const tax = d * r;
          return valued(
            [
              `The sales tax on ${article(d)} $\\$${d}$ ${it.en} is $${usd(tax)}$. What is the sales tax rate?`,
              `$\\$${d}$ 的${it.zhNoun}要交 $${usd(tax)}$ 的销售税。销售税率是多少？`,
            ],
            r,
            [
              [
                ["Divide", "相除"],
                ["Divide the tax by the price:", "用税除以价格："],
                [`\\frac{${dec(cq(tax))}}{${d}} = ${dec(Q.of(r, 100))}`],
              ],
              [["Write a percentage", "化成百分数"], ["Multiply by $100$:", "乘 $100$："], [`${dec(Q.of(r, 100))} \\times 100 = ${r}\\%`]],
            ],
            [
              `$${r}\\%$ of $${d}$ is $${dec(Q.of(r, 100))} \\times ${d} = ${dec(cq(tax))}$, the tax.`,
              `$${d}$ 的 $${r}\\%$ 是 $${dec(Q.of(r, 100))} \\times ${d} = ${dec(cq(tax))}$，正是税。`,
            ],
            [
              [Q.of(r, 100), "That is the decimal; multiply by $100$ to write it as a percentage.", "这是小数；还要乘 $100$ 才是百分数。"],
              [
                Q.of(d * 100, tax),
                "That divides the price by the tax; divide the tax by the price.",
                "这是用价格除以税；应该用税除以价格。",
              ],
              [
                Q.of(tax * 100, d * 100 + tax),
                "That divides by the price with the tax; divide by the price before tax.",
                "这是除以含税的价格；应该除以税前价格。",
              ],
            ],
            { percent: true },
          );
        },
        tapeFigure(
          [
            {
              total: "60",
              pieces: [
                { size: 45, text: "45" },
                { size: 15, text: "15", lit: true },
              ],
            },
          ],
          [
            "A bar of the original price 60: the sale price 45 and the discount 15, a quarter of 60.",
            "原价 60 的长条：现价 45 和优惠 15，是 60 的四分之一。",
          ],
        ),
      ),
    ],
  ),
  [
    "A store buys a lamp for $\\$24$ and sells it for $\\$42$. By what percentage did it mark up the price?",
    "商店以 $\\$24$ 购进一盏台灯，卖 $\\$42$。加价了百分之几？",
  ],
  [
    "The markup is $42 - 24 = \\$18$, and $\\frac{18}{24} = 75\\%$; indeed $24 \\times 1.75 = 42$.",
    "加价 $42 - 24 = \\$18$，$\\frac{18}{24} = 75\\%$；而 $24 \\times 1.75 = 42$。",
  ],
  [
    "work out markups and commissions, and find a rate from an amount and the price it was taken from.",
    "计算加价和佣金，并由金额和它所依据的价格求出百分率。",
  ],
);

/** solvingMultipartCommerceAndFinancePercentageProblems combines discounts, taxes and markups. */
export const solvingMultipartCommerceAndFinancePercentageProblems = withIntro(
  topic(
    "solving-multipart-commerce-and-finance-percentage-problems",
    t("Solving Multipart Commerce and Finance Percentage Problems", "解多步商业与理财百分比问题"),
    t(
      "Apply the percentages one at a time, each to the amount it applies to: a 20% discount and then 8% tax on \\$50 give \\$50 × 0.8 = \\$40 and then \\$40 × 1.08 = \\$43.20. Subtracting 20% − 8% = 12% at once would be wrong.",
      "逐个应用百分比，每个都作用在它所对应的金额上：\\$50 先打 20% 的折扣，再加 8% 的税，得 \\$50 × 0.8 = \\$40，再 \\$40 × 1.08 = \\$43.20。一次减去 20% − 8% = 12% 是错误的。",
    ),
    ["further-percentages-in-commerce-and-finance", "applying-percentages-in-succession"],
    ["7.RP.A.3", "7.EE.B.3"],
    [
      lesson(
        "discount-then-tax",
        ["A discount, then tax", "先打折，再加税"],
        [
          [
            "When a discount and a tax both apply, take each percentage of the right amount. The discount comes off the original price, and the tax is then charged on the sale price. A $\\$50$ item is $20\\%$ off, and $8\\%$ tax is added: $50 \\times 0.8 = \\$40$, then $40 \\times 1.08 = \\$43.20$.",
            "同时有折扣和税时，每个百分数都要按对应的金额算。折扣从原价中减去，税则按折后的售价计算。$\\$50$ 的商品优惠 $20\\%$，再加 $8\\%$ 的税：$50 \\times 0.8 = \\$40$，再 $40 \\times 1.08 = \\$43.20$。",
          ],
          [
            "One combined multiplier: $0.8 \\times 1.08 = 0.864$, and $50 \\times 0.864 = 43.20$.",
            "合成一个倍数：$0.8 \\times 1.08 = 0.864$，$50 \\times 0.864 = 43.20$。",
          ],
          [
            "Taking off $20\\% - 8\\% = 12\\%$ at once gives $\\$44$, which is wrong: the tax is of $\\$40$, not $\\$50$.",
            "一次减去 $20\\% - 8\\% = 12\\%$ 得 $\\$44$，是错的：税是按 $\\$40$ 算的，不是 $\\$50$。",
          ],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          const d = 10 * rng.int(2, 20);
          const p = 10 * rng.int(1, 5);
          const r = rng.int(3, 9);
          const sale = (d * (100 - p)) / 100;
          const total = sale * (100 + r);
          const both = Q.of((100 - p) * (100 + r), 10000);
          return valued(
            [
              `A ${it.en} regularly costs $\\$${d}$. It is on sale for $${p}\\%$ off, and ${article(r)} $${r}\\%$ sales tax is added to the sale price. What is the total cost, in dollars?`,
              `${it.zh}原价 $\\$${d}$，现在优惠 $${p}\\%$，并按优惠后的价格加收 $${r}\\%$ 的销售税。总共要付多少美元？`,
            ],
            cq(total),
            [
              [
                ["The discount", "打折"],
                [`You pay $${100 - p}\\%$ of the price:`, `要付原价的 $${100 - p}\\%$：`],
                [`${d} \\times ${multiplier(-p)} = ${sale}`],
              ],
              [
                ["The tax", "加税"],
                ["Add the tax to the sale price:", "在售价上加税："],
                [`${sale} \\times ${multiplier(r)} = ${dec(cq(total))}`],
              ],
            ],
            [
              `One combined multiplier: $${multiplier(-p)} \\times ${multiplier(r)} = ${dec(both)}$, and $${d} \\times ${dec(both)} = ${dec(cq(total))}$.`,
              `合成一个倍数：$${multiplier(-p)} \\times ${multiplier(r)} = ${dec(both)}$，$${d} \\times ${dec(both)} = ${dec(cq(total))}$。`,
            ],
            [
              [
                cq(d * (100 - p + r)),
                `That takes off $${p}\\% - ${r}\\%$ at once, but the tax is of the sale price.`,
                `这是一次减去 $${p}\\% - ${r}\\%$，但税是按售价算的。`,
              ],
              [Q.of(sale), "That is the sale price before the tax.", "这是加税前的售价。"],
              [
                cq(sale * 100 + d * r),
                "That charges the tax on the original price instead of the sale price.",
                "这是按原价算税，而不是按售价。",
              ],
              [cq(d * (100 + r)), "That forgets the discount.", "这是忘了打折。"],
            ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "50",
              pieces: [
                { size: 40, text: "40", lit: true },
                { size: 10, text: "10", dashed: true },
              ],
            },
            {
              total: "43.20",
              pieces: [
                { size: 40, text: "40" },
                { size: 3.2, text: "3.20", lit: true },
              ],
            },
          ],
          [
            "Two bars: 50 less the discount 10 is 40; then 40 plus the tax 3.20 is 43.20.",
            "两个长条：50 减去优惠 10 得 40；40 再加税 3.20 得 43.20。",
          ],
        ),
      ),
      lesson(
        "markup-then-discount",
        ["A markup, then a discount", "先加价，再打折"],
        [
          [
            "A markup raises the cost to a selling price, and a later discount is taken of that selling price, not of the cost. The profit is the final price minus what the store paid. A store pays $\\$40$ for a backpack, marks it up $50\\%$ to $\\$60$, and later sells it at $20\\%$ off: $60 \\times 0.8 = \\$48$. Its profit is $48 - 40 = \\$8$.",
            "加价把进价提高到售价，之后的折扣是按这个售价计算的，而不是按进价。利润等于最终的售价减去商店的进价。商店以 $\\$40$ 购进一个背包，加价 $50\\%$ 定价 $\\$60$，后来打 $20\\%$ 的折扣出售：$60 \\times 0.8 = \\$48$。利润是 $48 - 40 = \\$8$。",
          ],
          [
            "One combined multiplier: $1.5 \\times 0.8 = 1.2$, and $40 \\times 1.2 = 48$.",
            "合成一个倍数：$1.5 \\times 0.8 = 1.2$，$40 \\times 1.2 = 48$。",
          ],
          [
            "The discount is $20\\%$ of $\\$60$, not of $\\$40$: $50\\% - 20\\% = 30\\%$ is wrong.",
            "折扣是 $\\$60$ 的 $20\\%$，不是 $\\$40$ 的：$50\\% - 20\\% = 30\\%$ 是错的。",
          ],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          let c: number;
          let m: number;
          let p: number;
          let sale: Q;
          do {
            c = 10 * rng.int(2, 15);
            m = 10 * rng.int(3, 10);
            p = 10 * rng.int(1, 4);
            sale = Q.of(c * (100 + m) * (100 - p), 10000);
          } while (sale.cmp(Q.of(c)) <= 0);
          const retail = (c * (100 + m)) / 100;
          const profit = sale.sub(Q.of(c));
          const askProfit = rng.bool();
          const both = Q.of((100 + m) * (100 - p), 10000);
          return valued(
            [
              `A store buys a ${it.en} for $\\$${c}$ and marks up the price by $${m}\\%$. Later it sells the ${it.en} at $${p}\\%$ off the marked-up price. ${askProfit ? "How much profit does the store make, in dollars?" : "What is the sale price, in dollars?"}`,
              `商店以 $\\$${c}$ 购进${it.zh}，加价 $${m}\\%$ 定价。后来按定价打 $${p}\\%$ 的折扣出售。${askProfit ? "商店赚了多少美元？" : "售价是多少美元？"}`,
            ],
            askProfit ? profit : sale,
            [
              [["The markup", "加价"], ["Mark up the cost:", "在进价上加价："], [`${c} \\times ${multiplier(m)} = ${retail}`]],
              [
                ["The discount", "打折"],
                ["Take the discount off the marked-up price:", "从定价中打折："],
                [`${retail} \\times ${multiplier(-p)} = ${dec(sale)}`],
              ],
              ...(askProfit
                ? [
                    [
                      ["The profit", "利润"],
                      ["Subtract what the store paid:", "减去商店的进价："],
                      [`${dec(sale)} - ${c} = ${dec(profit)}`],
                    ] as Walk,
                  ]
                : []),
            ],
            [
              `One combined multiplier: $${multiplier(m)} \\times ${multiplier(-p)} = ${dec(both)}$, and $${c} \\times ${dec(both)} = ${dec(sale)}$.`,
              `合成一个倍数：$${multiplier(m)} \\times ${multiplier(-p)} = ${dec(both)}$，$${c} \\times ${dec(both)} = ${dec(sale)}$。`,
            ],
            askProfit
              ? [
                  [
                    Q.of(c * (m - p), 100),
                    `That takes $${m}\\% - ${p}\\%$ of the cost, but the discount is of the marked-up price.`,
                    `这是按进价算 $${m}\\% - ${p}\\%$，但折扣是按定价算的。`,
                  ],
                  [sale, "That is the sale price; subtract what the store paid.", "这是售价；还要减去进价。"],
                  [Q.of(retail - c), "That is the markup alone; the discount comes off later.", "这只是加价的金额；之后还要打折。"],
                ]
              : [
                  [
                    Q.of(c * (100 + m - p), 100),
                    `That uses $${m}\\% - ${p}\\%$ at once, but the discount is of the marked-up price.`,
                    `这是一次用 $${m}\\% - ${p}\\%$，但折扣是按定价算的。`,
                  ],
                  [Q.of(retail), "That is the marked-up price before the discount.", "这是打折前的定价。"],
                  [Q.of(c * (100 - p), 100), "That forgets the markup and discounts the cost.", "这是忘了加价，直接按进价打折。"],
                ],
            { form: "decimal" },
          );
        },
        tapeFigure(
          [
            {
              total: "60",
              pieces: [
                { size: 40, text: "40" },
                { size: 20, text: "20" },
              ],
            },
            {
              total: "60",
              pieces: [
                { size: 48, text: "48", lit: true },
                { size: 12, text: "12", dashed: true },
              ],
            },
          ],
          [
            "Two bars: the cost 40 plus the markup 20 is 60; then 60 less the discount 12 is 48.",
            "两个长条：进价 40 加加价 20 得 60；60 减去折扣 12 得 48。",
          ],
        ),
      ),
      lesson(
        "comparing-two-offers",
        ["Comparing two offers", "比较两种优惠"],
        [
          [
            "To compare a percentage off with a fixed amount off, turn the percentage into dollars for the given price. The offer that saves more gives the lower price. On an $\\$80$ item, $30\\%$ off saves $0.3 \\times 80 = \\$24$, more than a $\\$20$ coupon.",
            "比较按百分比的折扣与直接减去固定金额的优惠时，先把百分比折扣换算成这个价格下省下的钱。省得多的优惠，价格更低。$\\$80$ 的商品，优惠 $30\\%$ 能省 $0.3 \\times 80 = \\$24$，比 $\\$20$ 的优惠券省得多。",
          ],
          [
            "Prices: $80 \\times 0.7 = 56$ and $80 - 20 = 60$, so $30\\%$ off is cheaper.",
            "价格：$80 \\times 0.7 = 56$，$80 - 20 = 60$，所以优惠 $30\\%$ 更便宜。",
          ],
          [
            "A percentage is not a number of dollars: $30\\%$ off an $\\$80$ item is $\\$24$, not $\\$30$.",
            "百分数不是美元数：$\\$80$ 的商品优惠 $30\\%$ 是 $\\$24$，不是 $\\$30$。",
          ],
        ],
        (rng) => {
          const it = rng.pick(purchases);
          const d = 10 * rng.int(3, 25);
          const p = 5 * rng.int(2, 8);
          const off = (d * p) / 100;
          let coupon: number;
          do coupon = 5 * Math.max(1, Math.round(off / 5) + rng.int(-2, 2));
          while (coupon === off || coupon >= d);
          const aWins = off > coupon;
          const a: Pair = ["Store A", "A 店"];
          const b: Pair = ["Store B", "B 店"];
          const priceA = dec(cq(d * (100 - p)));
          return chosen(
            rng,
            [
              `A ${it.en} costs $\\$${d}$. Store A offers $${p}\\%$ off. Store B offers $\\$${coupon}$ off. Which store has the lower price?`,
              `${it.zh}售价 $\\$${d}$。A 店优惠 $${p}\\%$，B 店直接减 $\\$${coupon}$。哪家店的价格更低？`,
            ],
            aWins ? a : b,
            [
              aWins
                ? [
                    b,
                    `Store B takes off only $${coupon}$ dollars, less than the $${dec(cq(d * p))}$ dollars at store A.`,
                    `B 店只减 $${coupon}$ 美元，比 A 店的 $${dec(cq(d * p))}$ 美元少。`,
                  ]
                : [
                    a,
                    `$${p}\\%$ of $${d}$ is only $${dec(cq(d * p))}$ dollars, less than store B's $${coupon}$ dollars.`,
                    `$${d}$ 的 $${p}\\%$ 只有 $${dec(cq(d * p))}$ 美元，比 B 店的 $${coupon}$ 美元少。`,
                  ],
            ],
            [
              [
                ["Store A", "A 店"],
                [`Turn $${p}\\%$ into dollars and take it off:`, `把 $${p}\\%$ 换算成美元再减去：`],
                [`${dec(Q.of(p, 100))} \\times ${d} = ${dec(cq(d * p))}`, `${d} - ${dec(cq(d * p))} = ${priceA}`],
              ],
              [
                ["Store B", "B 店"],
                ["Take off the coupon, then compare:", "减去优惠券的钱，再比较："],
                [`${d} - ${coupon} = ${d - coupon}`],
              ],
            ],
            [
              `Compare the savings instead: $${dec(cq(d * p))} ${aWins ? ">" : "<"} ${coupon}$, so store ${aWins ? "A" : "B"} saves more and costs less.`,
              `改为比较省下的钱：$${dec(cq(d * p))} ${aWins ? ">" : "<"} ${coupon}$，所以 ${aWins ? "A" : "B"} 店省得多，价格更低。`,
            ],
            tableFigure(["A", "B"], [Number(priceA), d - coupon]),
          );
        },
        tapeFigure(
          [
            {
              total: "80",
              pieces: [
                { size: 56, text: "56", lit: true },
                { size: 24, text: "24", dashed: true },
              ],
            },
            {
              total: "80",
              pieces: [
                { size: 60, text: "60" },
                { size: 20, text: "20", dashed: true },
              ],
            },
          ],
          [
            "Two bars of 80: 30 percent off takes 24, leaving 56; the coupon takes 20, leaving 60.",
            "两个 80 的长条：优惠 30% 减去 24，剩 56；优惠券减去 20，剩 60。",
          ],
        ),
      ),
    ],
  ),
  [
    "A $\\$50$ pair of shoes is $20\\%$ off, and $8\\%$ tax is added. Is that the same as $12\\%$ off?",
    "一双 $\\$50$ 的鞋优惠 $20\\%$，再加 $8\\%$ 的税。这和优惠 $12\\%$ 一样吗？",
  ],
  [
    "No: $50 \\times 0.8 = 40$ and $40 \\times 1.08 = \\$43.20$, but $12\\%$ off would be $50 \\times 0.88 = \\$44$.",
    "不一样：$50 \\times 0.8 = 40$，$40 \\times 1.08 = \\$43.20$；而优惠 $12\\%$ 是 $50 \\times 0.88 = \\$44$。",
  ],
  [
    "solve problems with two percentages in a row, taking each of the right amount.",
    "解连续用到两个百分数的问题，每个都按对应的金额计算。",
  ],
);

/** yearsText says a time in years or months in both languages. */
const yearsText = (tq: Q, months: boolean): Pair =>
  months ? [`${dec(tq.mul(Q.of(12)))} months`, `${dec(tq.mul(Q.of(12)))} 个月`] : [`${dec(tq)} years`, `${dec(tq)} 年`];

/** interestBars is the bar of $500 and its $60 of interest over 3 years. */
const interestBars = tapeFigure(
  [
    {
      total: "560",
      pieces: [
        { size: 500, text: "500" },
        { size: 20, text: "20", lit: true },
        { size: 20, text: "20", lit: true },
        { size: 20, text: "20", lit: true },
      ],
    },
  ],
  ["A bar of 500 with three pieces of 20, one each year, making 560.", "长条 500 加上每年 20 的三段，共 560。"],
);

/** calculatingSimpleInterest uses I = Prt to find interest, balances and rates. */
export const calculatingSimpleInterest = withIntro(
  topic(
    "calculating-simple-interest",
    t("Calculating Simple Interest", "计算单利"),
    t(
      "Simple interest is I = Prt: the principal P times the yearly rate r (as a decimal) times the time t in years. \\$500 at 4% for 3 years earns 500 × 0.04 × 3 = \\$60, for a balance of \\$560.",
      "单利 I = Prt：本金 P 乘年利率 r（化成小数）再乘年数 t。\\$500 按 4% 存 3 年，利息是 500 × 0.04 × 3 = \\$60，本息共 \\$560。",
    ),
    ["percentages-in-commerce-and-finance"],
    ["7.RP.A.3", "7.EE.B.3"],
    [
      lesson(
        "interest-earned",
        ["Interest earned", "求利息"],
        [
          [
            "Simple interest is earned only on the original amount, the principal. It equals the principal times the yearly rate times the time in years, $I = Prt$. $\\$500$ at $4\\%$ for $3$ years: $I = 500 \\times 0.04 \\times 3 = \\$60$. Write months as part of a year: $18$ months is $t = 1.5$.",
            "单利只按原来的本金计算。利息等于本金乘年利率再乘年数，即 $I = Prt$。$\\$500$ 按 $4\\%$ 存 $3$ 年：$I = 500 \\times 0.04 \\times 3 = \\$60$。月数要化成年数：$18$ 个月是 $t = 1.5$。",
          ],
          [
            "Each year earns $0.04 \\times 500 = 20$, and $3$ years earn $3 \\times 20 = 60$.",
            "每年得 $0.04 \\times 500 = 20$，$3$ 年得 $3 \\times 20 = 60$。",
          ],
          ["Write the rate as a decimal: $4\\%$ is $0.04$, not $4$.", "利率要写成小数：$4\\%$ 是 $0.04$，不是 $4$。"],
        ],
        (rng) => {
          const p = 100 * rng.int(2, 50);
          const r = rng.pick([2, 3, 4, 5, 6, 8]);
          const months = rng.bool(0.3);
          const tq = months ? Q.of(rng.pick([6, 18, 30]), 12) : Q.of(rng.int(2, 10));
          const interest = Q.of(p * r, 100).mul(tq);
          const year = Q.of(p * r, 100);
          const time = yearsText(tq, months);
          return valued(
            [
              `How much simple interest does $\\$${p}$ earn in ${time[0]} at an annual rate of $${r}\\%$, in dollars?`,
              `$\\$${p}$ 按年利率 $${r}\\%$ 计单利，${time[1]}的利息是多少美元？`,
            ],
            interest,
            [
              months
                ? [
                    ["Time in years", "化成年数"],
                    ["Write the months as years:", "把月数化成年数："],
                    [`t = \\frac{${dec(tq.mul(Q.of(12)))}}{12} = ${dec(tq)}`],
                  ]
                : [
                    ["The values", "写出各量"],
                    ["Write the rate as a decimal:", "把利率写成小数："],
                    [`P = ${p}`, `r = ${r}\\% = ${dec(Q.of(r, 100))}`, `t = ${dec(tq)}`],
                  ],
              [
                ["Multiply", "相乘"],
                ["Use $I = Prt$:", "用 $I = Prt$："],
                [`I = ${p} \\times ${dec(Q.of(r, 100))} \\times ${dec(tq)} = ${dec(interest)}`],
              ],
            ],
            [
              `One year earns $${dec(Q.of(r, 100))} \\times ${p} = ${dec(year)}$, and $${dec(tq)} \\times ${dec(year)} = ${dec(interest)}$.`,
              `一年得 $${dec(Q.of(r, 100))} \\times ${p} = ${dec(year)}$，$${dec(tq)} \\times ${dec(year)} = ${dec(interest)}$。`,
            ],
            [
              [
                Q.of(p * r).mul(tq),
                `That uses $${r}$ instead of $${dec(Q.of(r, 100))}$ for the rate.`,
                `这是把利率当成 $${r}$，而不是 $${dec(Q.of(r, 100))}$。`,
              ],
              [year, "That is the interest for one year only.", "这只是一年的利息。"],
              [
                interest.add(Q.of(p)),
                "That is the balance, principal plus interest; the question asks for the interest.",
                "这是本息和；问题只问利息。",
              ],
              ...(months
                ? [[year.mul(tq.mul(Q.of(12))), "That uses the months as if they were years.", "这是把月数当成了年数。"] as const]
                : []),
            ],
            { form: "decimal" },
          );
        },
        interestBars,
      ),
      lesson(
        "balance-with-simple-interest",
        ["The balance after some years", "本息和"],
        [
          [
            "The balance of an account is the principal plus the interest it has earned. Find the interest with $I = Prt$ first, then add it to the principal. $\\$500$ at $4\\%$ for $3$ years earns $\\$60$, so the account holds $500 + 60 = \\$560$.",
            "账户的余额等于本金加上得到的利息。先用 $I = Prt$ 求出利息，再加到本金上。$\\$500$ 按 $4\\%$ 存 $3$ 年得利息 $\\$60$，所以账户里有 $500 + 60 = \\$560$。",
          ],
          ["Each year adds $\\$20$: $500, 520, 540, 560$.", "每年加 $\\$20$：$500, 520, 540, 560$。"],
          ["The interest alone, $\\$60$, is not the balance: add the principal.", "只有利息 $\\$60$ 不是余额：还要加上本金。"],
        ],
        (rng) => {
          const name = rng.pick(names);
          const p = 100 * rng.int(2, 50);
          const r = rng.pick([2, 3, 4, 5, 6, 7]);
          const years = rng.int(2, 8);
          const interest = Q.of(p * r * years, 100);
          const year = Q.of(p * r, 100);
          const balance = interest.add(Q.of(p));
          return valued(
            [
              `${name} deposits $\\$${p}$ in an account that pays $${r}\\%$ simple interest per year. How much is in the account after ${years} years, in dollars?`,
              `${name} 把 $\\$${p}$ 存入一个按年利率 $${r}\\%$ 计单利的账户。${years} 年后账户里有多少美元？`,
            ],
            balance,
            [
              [
                ["Find the interest", "求利息"],
                ["Use $I = Prt$:", "用 $I = Prt$："],
                [`I = ${p} \\times ${dec(Q.of(r, 100))} \\times ${years} = ${dec(interest)}`],
              ],
              [
                ["Add the principal", "加上本金"],
                ["Add the interest to the principal:", "把利息加到本金上："],
                [`${p} + ${dec(interest)} = ${dec(balance)}`],
              ],
            ],
            [
              `Each year adds $${dec(year)}$, and $${p} + ${years} \\times ${dec(year)} = ${dec(balance)}$.`,
              `每年加 $${dec(year)}$，$${p} + ${years} \\times ${dec(year)} = ${dec(balance)}$。`,
            ],
            [
              [interest, "That is only the interest; add the principal.", "这只是利息；还要加上本金。"],
              [year.add(Q.of(p)), "That adds the interest for one year only.", "这只加了一年的利息。"],
              [
                Q.of(p * r * years + p),
                `That uses $${r}$ instead of $${dec(Q.of(r, 100))}$ for the rate.`,
                `这是把利率当成 $${r}$，而不是 $${dec(Q.of(r, 100))}$。`,
              ],
            ],
            { form: "decimal" },
          );
        },
        interestBars,
      ),
      lesson(
        "finding-the-interest-rate",
        ["Finding the interest rate", "求利率"],
        [
          [
            "When the interest, the principal and the time are known, put them into $I = Prt$ and solve for the rate $r$. Write the rate as a percentage. $\\$800$ earns $\\$96$ in $3$ years: $96 = 800 \\times r \\times 3 = 2400r$, so $r = 0.04 = 4\\%$.",
            "已知利息、本金和时间时，把它们代入 $I = Prt$，解出利率 $r$，再把利率写成百分数。$\\$800$ 存 $3$ 年得单利 $\\$96$：$96 = 800 \\times r \\times 3 = 2400r$，所以 $r = 0.04 = 4\\%$。",
          ],
          ["$800 \\times 0.04 \\times 3 = 96$.", "$800 \\times 0.04 \\times 3 = 96$。"],
          [
            "Divide by both the principal and the time; dividing by $800$ alone gives the rate for all $3$ years.",
            "要同时除以本金和年数；只除以 $800$ 得到的是 $3$ 年合起来的利率。",
          ],
        ],
        (rng) => {
          const p = 100 * rng.int(2, 50);
          const r = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
          const years = rng.int(2, 8);
          const interest = (p * r * years) / 100;
          return valued(
            [
              `An account earns $\\$${interest}$ of simple interest on $\\$${p}$ in ${years} years. What is the annual interest rate?`,
              `$\\$${p}$ 存 ${years} 年得单利 $\\$${interest}$。年利率是多少？`,
            ],
            r,
            [
              [
                ["Substitute", "代入"],
                ["Put the values into $I = Prt$:", "把各量代入 $I = Prt$："],
                [`${interest} = ${p} \\times r \\times ${years} = ${p * years}r`],
              ],
              [
                ["Solve", "求解"],
                [`Divide by $${p * years}$ and write a percentage:`, `除以 $${p * years}$，再写成百分数：`],
                [`r = \\frac{${interest}}{${p * years}} = ${dec(Q.of(r, 100))} = ${r}\\%`],
              ],
            ],
            [
              `$${p} \\times ${dec(Q.of(r, 100))} \\times ${years} = ${interest}$, the interest.`,
              `$${p} \\times ${dec(Q.of(r, 100))} \\times ${years} = ${interest}$，正是利息。`,
            ],
            [
              [
                r * years,
                "That is the rate for all the years together; divide by the time too.",
                "这是所有年份合起来的利率；还要除以年数。",
              ],
              [Q.of(r, 100), "That is the decimal; multiply by $100$ to write it as a percentage.", "这是小数；还要乘 $100$ 才是百分数。"],
              [Q.of(interest, years), "That is the interest for one year in dollars, not a rate.", "这是一年的利息美元数，不是利率。"],
            ],
            { percent: true },
          );
        },
        interestBars,
      ),
    ],
  ),
  [
    "Ava puts $\\$500$ in a bank at $4\\%$ simple interest a year. How much interest does she earn in $3$ years?",
    "Ava 把 $\\$500$ 存进银行，单利年利率 $4\\%$。$3$ 年能得多少利息？",
  ],
  [
    "$I = 500 \\times 0.04 \\times 3 = \\$60$; each year earns $\\$20$, and $3 \\times 20 = 60$.",
    "$I = 500 \\times 0.04 \\times 3 = \\$60$；每年得 $\\$20$，$3 \\times 20 = 60$。",
  ],
  [
    "find simple interest with $I = Prt$, the balance it builds, and the rate from the interest.",
    "用 $I = Prt$ 求单利、本息和，并由利息求利率。",
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
