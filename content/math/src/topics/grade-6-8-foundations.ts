import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";
import type { MathWrong, Pair } from "./early-grades-more-kit.ts";
import { chosenMath, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { histogramSvg } from "./grade-7-statistics.ts";
import { equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** unitPricesAndSpeed computes unit rates, prices per unit, and constant speed. */
export const unitPricesAndSpeed: TopicDef = withIntro(
  {
    id: "unit-prices-and-speed",
    title: t("Unit Prices and Speed", "单价与速度"),
    summary: t("Calculate and compare unit rates including price per unit and speed.", "计算并比较单位费率，包括单价与速度。"),
    prerequisites: ["unit-rates"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.6.RP.A.2", "CCSS.7.RP.A.1"],
    knowledgePoints: [
      lesson(
        "unit-price-calculation",
        ["Calculating Unit Price", "计算单价"],
        [
          [
            "A **unit price** is the cost of one item: divide the total cost by the number of items. A pack of $4$ notebooks for $\\$12$ has a unit price of $12 \\div 4 = \\$3$. The lower unit price is the better buy.",
            "**单价**是一件物品的价钱：用总价除以数量。$4$ 本一包的笔记本卖 $12$ 美元，单价是 $12 \\div 4 = 3$ 美元。单价越低越划算。",
          ],
          ["$4 \\times \\$3 = \\$12$.", "$4 \\times 3 = 12$ 美元。"],
          [
            "Divide the cost by the number, not the number by the cost. $4 \\div 12$ is notebooks per dollar.",
            "要用总价除以数量，不是用数量除以总价。$4 \\div 12$ 是每美元能买的本数。",
          ],
        ],
        (rng) => {
          const qty = rng.pick([3, 4, 5, 6, 8, 10]);
          const each = rng.int(2, 18);
          const total = qty * each;
          return valued(
            [
              `A store sells a pack of $${qty}$ notebooks for a total of $\\$${total}$. What is the unit price per notebook in dollars?`,
              `商店里一包 $${qty}$ 本笔记本总价为 $${total}$ 美元。每本笔记本的单价是多少美元？`,
            ],
            each,
            [
              [["Set up the rate", "列出比率"], ["Dollars per notebook:", "每本多少美元："], [`\\frac{${total}}{${qty}}`]],
              [["Divide", "相除"], ["Share the cost among the notebooks:", "把总价平均分给每本："], [`${total} \\div ${qty} = ${each}`]],
            ],
            [`$${qty} \\times ${each} = ${total}$.`, `$${qty} \\times ${each} = ${total}$。`],
            [
              [qty, "That is the number of notebooks, not the price of one.", "这是本数，不是单价。"],
              [total, "That is the price of the whole pack.", "这是整包的价钱。"],
              [total - qty, "That subtracts instead of dividing.", "这是相减，不是相除。"],
            ],
            { unit: "$" },
          );
        },
        equalTape(4, "3", "12", 0),
      ),
      lesson(
        "constant-speed-calculation",
        ["Calculating Speed as a Unit Rate", "计算恒定速度"],
        [
          [
            "Speed is a unit rate: the distance covered in one unit of time. Divide the distance by the time. A train that goes $150$ miles in $3$ hours has a speed of $150 \\div 3 = 50$ miles per hour.",
            "速度是一种单位率：单位时间内走过的路程。用路程除以时间。火车 $3$ 小时行 $150$ 英里，速度是 $150 \\div 3 = 50$ 英里每小时。",
          ],
          ["$50 \\times 3 = 150$ miles.", "$50 \\times 3 = 150$ 英里。"],
          [
            "Divide distance by time, not time by distance. $3 \\div 150$ is hours per mile.",
            "要用路程除以时间，不能反过来。$3 \\div 150$ 是每英里用的小时数。",
          ],
        ],
        (rng) => {
          const speed = rng.int(35, 75);
          const hours = rng.int(2, 6);
          const distance = speed * hours;
          return valued(
            [
              `A train travels $${distance}$ miles in $${hours}$ hours at a constant speed. What is the train's speed in miles per hour?`,
              `一列火车以恒定速度在 $${hours}$ 小时内行驶了 $${distance}$ 英里。这列火车的时速是多少英里？`,
            ],
            speed,
            [
              [["Set up the rate", "列出比率"], ["Miles per hour:", "每小时多少英里："], [`\\frac{${distance}}{${hours}}`]],
              [
                ["Divide", "相除"],
                ["Share the distance among the hours:", "把路程平均分到每小时："],
                [`${distance} \\div ${hours} = ${speed}`],
              ],
            ],
            [`$${speed} \\times ${hours} = ${distance}$ miles.`, `$${speed} \\times ${hours} = ${distance}$ 英里。`],
            [
              [distance, "That is the whole distance, not the distance in one hour.", "这是全程，不是一小时走的路程。"],
              [distance * hours, "That multiplies by the hours instead of dividing.", "这是乘小时数，不是除以小时数。"],
              [distance - hours, "That subtracts the hours instead of dividing.", "这是减去小时数，不是除以小时数。"],
            ],
            { unit: "mph" },
          );
        },
        equalTape(3, "50", "150", 0),
      ),
    ],
  },
  [
    "A cyclist rides $36$ miles in $3$ hours, and a store sells $3$ bottles of water for $\\$6$. Both are rates.",
    "一个骑车人 $3$ 小时骑了 $36$ 英里，一家商店 $3$ 瓶水卖 $6$ 美元。两者都是比率。",
  ],
  [
    "$36 \\div 3 = 12$ miles each hour, and $6 \\div 3 = 2$ dollars each bottle.",
    "$36 \\div 3 = 12$，每小时 $12$ 英里；$6 \\div 3 = 2$，每瓶 $2$ 美元。",
  ],
  ["find the price of one item and the speed in one hour by dividing.", "用除法求一件物品的价钱和一小时走的路程。"],
);
/** percentApplicationsInterestAndDiscounts computes simple interest, taxes, and discounts. */
export const percentApplicationsInterestAndDiscounts: TopicDef = withIntro(
  {
    id: "percent-applications-interest-and-discounts",
    title: t("Percent Applications: Interest and Discounts", "百分数应用：利息与折扣"),
    summary: t(
      "Solve real-world problems involving simple interest, sales tax, markups, and discounts.",
      "求解涉及单利、销售税、加价与折扣的实际问题。",
    ),
    prerequisites: ["percent-of-a-number"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.7.RP.A.3"],
    knowledgePoints: [
      lesson(
        "simple-interest",
        ["Simple Interest Formula", "单利计算公式"],
        [
          [
            "Simple interest is found with $I = P \\times r \\times t$: $P$ is the principal, the money put in; $r$ is the yearly rate as a decimal; $t$ is the time in years. $\\$300$ at $5\\%$ for $2$ years earns $I = 300 \\times 0.05 \\times 2 = \\$30$.",
            "单利用 $I = P \\times r \\times t$ 计算：$P$ 是本金，也就是存入的钱；$r$ 是写成小数的年利率；$t$ 是年数。$\\$300$ 按 $5\\%$ 存 $2$ 年，利息 $I = 300 \\times 0.05 \\times 2 = \\$30$。",
          ],
          ["Each year earns $0.05 \\times 300 = 15$, and $2 \\times 15 = 30$.", "每年得 $0.05 \\times 300 = 15$，$2 \\times 15 = 30$。"],
          [
            "Do not forget the time: $300 \\times 0.05 = 15$ is only one year of interest.",
            "别忘了乘年数：$300 \\times 0.05 = 15$ 只是一年的利息。",
          ],
        ],
        (rng) => {
          const principal = rng.int(2, 20) * 100;
          const ratePercent = rng.int(2, 8);
          const years = rng.int(2, 5);
          const year = (principal * ratePercent) / 100;
          const interest = year * years;
          const r = (ratePercent / 100).toFixed(2);
          return valued(
            [
              `Elena deposits $\\$${principal}$ into a savings account that earns $${ratePercent}\\%$ simple annual interest. How much interest in dollars will she earn after $${years}$ years?`,
              `埃琳娜将 $\\$${principal}$ 存入一个年单利率为 $${ratePercent}\\%$ 的储蓄账户。$${years}$ 年后她将获得多少美元利息？`,
            ],
            interest,
            [
              [["The rate", "利率"], ["Write the rate as a decimal:", "把利率写成小数："], [`${ratePercent}\\% = ${r}`]],
              [
                ["Multiply", "相乘"],
                ["Use $I = P \\times r \\times t$:", "用 $I = P \\times r \\times t$："],
                [`I = ${principal} \\times ${r} \\times ${years} = ${interest}`],
              ],
            ],
            [
              `One year earns $${r} \\times ${principal} = ${year}$, and $${years} \\times ${year} = ${interest}$.`,
              `一年得 $${r} \\times ${principal} = ${year}$，$${years} \\times ${year} = ${interest}$。`,
            ],
            [
              [year, "That is the interest for one year only; multiply by the years too.", "这只是一年的利息；还要乘年数。"],
              [principal + interest, "That is the balance; the question asks for the interest alone.", "这是本息和；问题只问利息。"],
              [
                principal * ratePercent * years,
                `That uses $${ratePercent}$ instead of $${r}$ for the rate.`,
                `这是把利率当成 $${ratePercent}$，而不是 $${r}$。`,
              ],
            ],
            { form: "integer", unit: "$" },
          );
        },
        tapeFigure(
          [
            {
              total: "30",
              pieces: [
                { size: 15, text: "15", lit: true },
                { size: 15, text: "15", lit: true },
              ],
            },
          ],
          ["Two equal pieces of 15, one each year, making 30 of interest.", "两段相等的 15，每年一段，利息共 30。"],
        ),
      ),
      lesson(
        "discounts-and-sales",
        ["Discounts and Sale Prices", "折扣与折后售价"],
        [
          [
            "A discount is an amount taken off the regular price. For a price $P$ and a discount of $d\\%$, the discount is $P \\times \\frac{d}{100}$, and the sale price is the price minus the discount. A $\\$80$ jacket at $25\\%$ off: the discount is $80 \\times 0.25 = \\$20$, so it sells for $80 - 20 = \\$60$.",
            "折扣是从原价中减去的金额。原价为 $P$、折扣率为 $d\\%$ 时，折扣金额是 $P \\times \\frac{d}{100}$，折后售价等于原价减去折扣金额。$\\$80$ 的夹克优惠 $25\\%$：折扣金额 $80 \\times 0.25 = \\$20$，所以售价 $80 - 20 = \\$60$。",
          ],
          ["You pay $75\\%$ of the price: $80 \\times 0.75 = 60$.", "要付原价的 $75\\%$：$80 \\times 0.75 = 60$。"],
          ["The $\\$20$ is the money saved; the sale price is what is left.", "$\\$20$ 是省下的钱；售价是剩下的部分。"],
        ],
        (rng) => {
          const originalPrice = rng.int(4, 25) * 20;
          const discountPct = rng.pick([10, 20, 30, 40, 50]);
          const discountAmount = (originalPrice * discountPct) / 100;
          const salePrice = originalPrice - discountAmount;
          const r = (discountPct / 100).toFixed(1);
          return valued(
            [
              `A jacket has an original price of $\\$${originalPrice}$. During a holiday sale, it is discounted by $${discountPct}\\%$. What is the sale price of the jacket in dollars?`,
              `一件夹克原价为 $\\$${originalPrice}$。在节日促销期间，它优惠 $${discountPct}\\%$ 出售。这件夹克的折后售价是多少美元？`,
            ],
            salePrice,
            [
              [
                ["Find the discount", "求折扣金额"],
                ["Multiply the price by the rate:", "用原价乘折扣率："],
                [`${originalPrice} \\times ${r} = ${discountAmount}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the discount off the price:", "从原价中减去折扣金额："],
                [`${originalPrice} - ${discountAmount} = ${salePrice}`],
              ],
            ],
            [
              `You pay $${100 - discountPct}\\%$ of the price: $${originalPrice} \\times ${((100 - discountPct) / 100).toFixed(1)} = ${salePrice}$.`,
              `要付原价的 $${100 - discountPct}\\%$：$${originalPrice} \\times ${((100 - discountPct) / 100).toFixed(1)} = ${salePrice}$。`,
            ],
            [
              [discountAmount, "That is the discount, the money saved, not the sale price.", "这是折扣金额，也就是省下的钱，不是售价。"],
              [originalPrice + discountAmount, "That adds the discount instead of taking it off.", "这是把折扣金额加上了，应该减去。"],
              [
                originalPrice - discountPct,
                `That takes off $${discountPct}$ dollars, not $${discountPct}\\%$ of the price.`,
                `这是减去 $${discountPct}$ 美元，而不是原价的 $${discountPct}\\%$。`,
              ],
            ],
            { form: "integer", unit: "$" },
          );
        },
        tapeFigure(
          [
            {
              total: "80",
              pieces: [
                { size: 60, text: "60", lit: true },
                { size: 20, text: "20", dashed: true },
              ],
            },
          ],
          ["A bar of 80 with the discount 20 taken off, leaving the sale price 60.", "长条 80 减去折扣 20，剩下售价 60。"],
        ),
      ),
    ],
  },
  [
    "Elena puts $\\$300$ in a savings account at $5\\%$ simple interest. How much interest does she earn in $2$ years?",
    "埃琳娜把 $\\$300$ 存进单利年利率 $5\\%$ 的储蓄账户。$2$ 年能得多少利息？",
  ],
  [
    "$I = 300 \\times 0.05 \\times 2 = \\$30$; each year earns $\\$15$, and $2 \\times 15 = 30$.",
    "$I = 300 \\times 0.05 \\times 2 = \\$30$；每年得 $\\$15$，$2 \\times 15 = 30$。",
  ],
  [
    "find simple interest with $I = P \\times r \\times t$ and find sale prices after a discount.",
    "用 $I = P \\times r \\times t$ 求单利，并求打折后的售价。",
  ],
);

/** scaleDrawingsAndScaleFactor computes actual lengths and dimensions using scale factors. */
export const scaleDrawingsAndScaleFactor: TopicDef = {
  id: "scale-drawings-and-scale-factor",
  title: t("Scale Drawings and Scale Factor", "比例图与比例系数"),
  summary: t(
    "Use scale factors to compute actual dimensions and distances from scale drawings.",
    "利用比例系数根据比例图计算实际尺寸与距离。",
  ),
  prerequisites: ["proportions"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.7.G.A.1"],
  knowledgePoints: [
    {
      id: "scale-factor-actual-length",
      title: t("Finding Actual Dimensions from a Scale Drawing", "根据比例图计算实际尺寸"),
      explanation: t(
        "A **scale drawing** represents an object with dimensions proportional to the actual object. The **scale** tells the relationship between the drawing measurements and the actual measurements.\n\nIf the scale is $1\\text{ cm} = 5\\text{ m}$, then a length of $4\\text{ cm}$ on the drawing corresponds to $4 \\times 5 = 20\\text{ m}$ in real life.",
        "**比例图**按与实际物体成比例的尺寸表示物体。**比例尺**表示图纸度量与实际度量之间的对应关系。\n\n如果比例尺为 $1\\text{ cm} = 5\\text{ m}$，图纸上 $4\\text{ cm}$ 的长度对应实际的 $4 \\times 5 = 20\\text{ m}$。",
      ),
      generate(rng) {
        const scaleMeters = rng.int(3, 12);
        const drawingCm = rng.int(4, 15);
        const actualMeters = drawingCm * scaleMeters;

        const prompt = t(
          `On a floor plan, the scale is $1\\text{ cm} = ${scaleMeters}\\text{ m}$. A living room is represented by a segment measuring $${drawingCm}\\text{ cm}$. What is the actual length of the room in meters?`,
          `在一张平面设计图上，比例尺为 $1\\text{ cm} = ${scaleMeters}\\text{ m}$。客厅在图上由一条长 $${drawingCm}\\text{ cm}$ 的线段表示。客厅的实际长度是多少米？`,
        );
        const solution = t(
          `Multiply the drawing measurement by the scale factor: $${drawingCm} \\times ${scaleMeters} = ${actualMeters}\\text{ meters}$.`,
          `将图纸尺寸乘比例系数：$${drawingCm} \\times ${scaleMeters} = ${actualMeters}\\text{ 米}$。`,
        );

        return numberProblem({
          prompt,
          answer: actualMeters,
          form: "integer",
          unit: "m",
          wrong: [actualMeters + scaleMeters, actualMeters - scaleMeters, drawingCm + scaleMeters],
          solution,
        });
      },
    },
    {
      id: "scale-factor-drawing-length",
      title: t("Finding Drawing Lengths from Actual Dimensions", "根据实际尺寸求图上长度"),
      explanation: t(
        "Going the other way, from a real object to the drawing, divide by the scale instead of multiplying. Each drawing unit stands for a fixed actual length, so count how many of those lengths fit into the actual measurement.\n\nWith the scale $1\\text{ cm} = 5\\text{ m}$, a wall that is $35\\text{ m}$ long is drawn as $35 \\div 5 = 7\\text{ cm}$. Check: $7\\text{ cm}$ on the drawing stands for $7 \\times 5 = 35\\text{ m}$.",
        "反过来，由实物求图上长度时，要除以比例尺而不是乘。图上每个单位代表固定的实际长度，所以看实际长度里含有多少个这样的长度。\n\n比例尺为 $1\\text{ cm} = 5\\text{ m}$ 时，一面 $35\\text{ m}$ 长的墙在图上画成 $35 \\div 5 = 7\\text{ cm}$。检验：图上 $7\\text{ cm}$ 代表 $7 \\times 5 = 35\\text{ m}$。",
      ),
      generate(rng) {
        const scale = rng.int(2, 25);
        const drawing = rng.int(3, 18);
        const actual = drawing * scale;
        const [thing, thingZh] = rng.pick([
          ["a soccer field", "一个足球场"],
          ["a parking lot", "一个停车场"],
          ["a garden", "一个花园"],
          ["a swimming pool", "一个游泳池"],
          ["a warehouse", "一个仓库"],
        ] as const);
        return numberProblem({
          prompt: t(
            `A map uses the scale $1\\text{ cm} = ${scale}\\text{ m}$. ${thing[0]!.toUpperCase()}${thing.slice(1)} is $${actual}\\text{ m}$ long. How long is it on the map, in centimeters?`,
            `一张地图的比例尺为 $1\\text{ cm} = ${scale}\\text{ m}$。${thingZh}长 $${actual}\\text{ m}$。它在地图上长多少厘米？`,
          ),
          answer: drawing,
          form: "integer",
          unit: "cm",
          wrong: [actual * scale, actual - scale, drawing + 1],
          solution: t(
            `Each centimeter stands for $${scale}\\text{ m}$, so divide: $${actual} \\div ${scale} = ${drawing}\\text{ cm}$.`,
            `每厘米代表 $${scale}\\text{ m}$，所以相除：$${actual} \\div ${scale} = ${drawing}\\text{ cm}$。`,
          ),
        });
      },
    },
  ],
};

/** squareBounds gives the whole number k with k² < n < (k + 1)², for n not a perfect square. */
const squareBounds = (n: number) => Math.floor(Math.sqrt(n));

/** classifyingRationalAndIrrationalNumbers distinguishes rational numbers from irrational numbers. */
export const classifyingRationalAndIrrationalNumbers: TopicDef = withIntro(
  {
    id: "classifying-rational-and-irrational-numbers",
    title: t("Classifying Rational and Irrational Numbers", "区分有理数与无理数"),
    summary: t(
      "Identify and classify numbers, square roots, and cube roots as rational or irrational.",
      "识别并将数、平方根与立方根分类为有理数或无理数。",
    ),
    prerequisites: ["square-roots-and-cube-roots"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.8.NS.A.1"],
    knowledgePoints: [
      lesson(
        "rational-vs-irrational",
        ["Rational and Irrational Numbers", "有理数与无理数"],
        [
          [
            "A **rational number** can be written as a ratio of two integers $\\frac{a}{b}$ (where $b \\neq 0$). Its decimal form either terminates or repeats.\n\nAn **irrational number** cannot be written as a fraction of integers. Its decimal expansion goes on forever without repeating. Examples include $\\pi$, $\\sqrt{2}$, $\\sqrt{3}$, and $\\sqrt{5}$. The square root of any whole number that is not a perfect square is irrational.",
            "**有理数**可以写成两个整数的比 $\\frac{a}{b}$（其中 $b \\neq 0$）。其小数形式要么有限，要么无限循环。\n\n**无理数**不能写成整数分数形式，其小数展开是无限不循环的。例如 $\\pi$、$\\sqrt{2}$、$\\sqrt{3}$ 与 $\\sqrt{5}$。任何不是完全平方数的整数，其算术平方根都是无理数。",
          ],
          [
            "Write each rational one as a fraction: $\\sqrt{9} = \\frac{3}{1}$ and $0.25 = \\frac{25}{100}$. No such fraction exists for $\\sqrt{2}$, which lies strictly between $1$ and $2$.",
            "把每个有理数写成分数：$\\sqrt{9} = \\frac{3}{1}$，$0.25 = \\frac{25}{100}$。$\\sqrt{2}$ 严格位于 $1$ 和 $2$ 之间，找不到这样的分数。",
          ],
          [
            "A root sign alone does not make a number irrational: $\\sqrt{49} = 7$. Simplify first, then decide.",
            "有根号不一定是无理数：$\\sqrt{49} = 7$。先化简，再判断。",
          ],
        ],
        (rng) => {
          const nonSquare = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]);
          const root = rng.int(2, 10);
          const fracNum = rng.int(1, 9);
          const fracDen = rng.int(2, 10);
          const hundredths = rng.int(12, 98);
          const decVal = `0.${hundredths}`;
          const k = squareBounds(nonSquare);
          return chosenMath(
            rng,
            ["Which of these numbers is irrational?", "下面哪个数是无理数？"],
            `\\sqrt{${nonSquare}}`,
            [
              [
                `\\sqrt{${root * root}}`,
                `$\\sqrt{${root * root}} = ${root}$, a whole number, so it is rational.`,
                `$\\sqrt{${root * root}} = ${root}$，是整数，所以是有理数。`,
              ],
              [
                `\\frac{${fracNum}}{${fracDen}}`,
                "It is already a ratio of two integers, so it is rational.",
                "它本身就是两个整数之比，所以是有理数。",
              ],
              [
                decVal,
                `The decimal ends: $${decVal} = \\frac{${hundredths}}{100}$, so it is rational.`,
                `这个小数是有限小数：$${decVal} = \\frac{${hundredths}}{100}$，所以是有理数。`,
              ],
            ],
            [
              [
                ["Simplify what you can", "能化简的先化简"],
                [
                  `$\\sqrt{${root * root}} = ${root}$, $\\frac{${fracNum}}{${fracDen}}$ is a fraction already, and $${decVal} = \\frac{${hundredths}}{100}$. All three are ratios of integers.`,
                  `$\\sqrt{${root * root}} = ${root}$，$\\frac{${fracNum}}{${fracDen}}$ 本身是分数，$${decVal} = \\frac{${hundredths}}{100}$。三个都是整数之比。`,
                ],
              ],
              [
                ["Look at the root", "看剩下的根"],
                [
                  `$${nonSquare}$ is not a perfect square, so $\\sqrt{${nonSquare}}$ is irrational.`,
                  `$${nonSquare}$ 不是完全平方数，所以 $\\sqrt{${nonSquare}}$ 是无理数。`,
                ],
              ],
            ],
            [
              `Since $${k * k} < ${nonSquare} < ${(k + 1) * (k + 1)}$, $\\sqrt{${nonSquare}}$ lies strictly between $${k}$ and $${k + 1}$, so it is not whole, and the root of a whole number is either whole or irrational.`,
              `因为 $${k * k} < ${nonSquare} < ${(k + 1) * (k + 1)}$，$\\sqrt{${nonSquare}}$ 严格位于 $${k}$ 和 $${k + 1}$ 之间，不是整数；而整数的平方根要么是整数，要么是无理数。`,
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 4,
            step: 1,
            labels: [0, 1, 2, 3, 4],
            marks: [
              { at: Math.SQRT2, text: "√2" },
              { at: 2.5, text: "2.5" },
              { at: Math.PI, text: "π" },
            ],
          },
          ["A number line from 0 to 4 with √2, 2.5 and π marked.", "一条从 0 到 4 的数轴，标出 √2、2.5 和 π。"],
        ),
      ),
      lesson(
        "rational-numbers-in-disguise",
        ["Recognizing Rational Numbers That Look Irrational", "识别看似无理的有理数"],
        [
          [
            "Some numbers look irrational but are not, so simplify before deciding. A root of a perfect power is an integer: $\\sqrt{49} = 7$ and $\\sqrt[3]{27} = 3$. A repeating decimal such as $0.\\overline{3} = \\frac{1}{3}$ is rational, because its digits repeat in a fixed block.\n\nOn the other hand, $\\pi$, the square root of a non-square such as $\\sqrt{8}$, and the cube root of a non-cube such as $\\sqrt[3]{10}$ stay irrational, as does a nonzero rational multiple of one of them, like $3\\sqrt{2}$.",
            "有些数看起来是无理数，其实不是，所以要先化简再判断。完全幂的方根是整数：$\\sqrt{49} = 7$，$\\sqrt[3]{27} = 3$。像 $0.\\overline{3} = \\frac{1}{3}$ 这样的循环小数是有理数，因为它的数字按固定的段重复。\n\n另一方面，$\\pi$、非完全平方数的平方根（如 $\\sqrt{8}$）以及非完全立方数的立方根（如 $\\sqrt[3]{10}$）仍是无理数，它们的非零有理倍数（如 $3\\sqrt{2}$）也是无理数。",
          ],
          [
            "Multiply back: $7 \\cdot 7 = 49$, $3 \\cdot 3 \\cdot 3 = 27$, and $1 \\div 3 = 0.333\\ldots$.",
            "乘回去验证：$7 \\cdot 7 = 49$，$3 \\cdot 3 \\cdot 3 = 27$，$1 \\div 3 = 0.333\\ldots$。",
          ],
          [
            "A decimal that goes on forever is rational when it repeats. Only a decimal that never repeats, like that of $\\pi$, is irrational.",
            "无限小数如果循环，就是有理数。只有不循环的无限小数（如 $\\pi$）才是无理数。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          const square = rng.int(4, 15);
          const cube = rng.int(2, 6);
          const digit = rng.int(1, 8);
          const rational = [`\\sqrt{${square * square}}`, `\\sqrt[3]{${cube ** 3}}`, `0.\\overline{${digit}}`][kind]!;
          const whys: Pair[] = [
            [`$\\sqrt{${square * square}} = ${square}$.`, `$\\sqrt{${square * square}} = ${square}$。`],
            [`$\\sqrt[3]{${cube ** 3}} = ${cube}$.`, `$\\sqrt[3]{${cube ** 3}} = ${cube}$。`],
            [`$0.\\overline{${digit}} = \\frac{${digit}}{9}$.`, `$0.\\overline{${digit}} = \\frac{${digit}}{9}$。`],
          ];
          const why = whys[kind]!;
          const backs: Pair[] = [
            [`$${square} \\cdot ${square} = ${square * square}$`, `$${square} \\cdot ${square} = ${square * square}$`],
            [`$${cube} \\cdot ${cube} \\cdot ${cube} = ${cube ** 3}$`, `$${cube} \\cdot ${cube} \\cdot ${cube} = ${cube ** 3}$`],
            [`$${digit} \\div 9 = 0.${`${digit}`.repeat(3)}\\ldots$`, `$${digit} \\div 9 = 0.${`${digit}`.repeat(3)}\\ldots$`],
          ];
          const back = backs[kind]!;
          const nonSquare = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]);
          const nonCube = rng.pick([2, 3, 4, 5, 6, 7, 9, 10, 12, 15, 20, 25]);
          const multiple = rng.int(2, 9);
          const otherNonSquare = rng.pick([2, 3, 5, 7].filter((n) => n !== nonSquare));
          const irrationals: MathWrong[] = rng.sample(
            [
              [
                `\\sqrt{${nonSquare}}`,
                `$${nonSquare}$ is not a perfect square, so its square root is irrational.`,
                `$${nonSquare}$ 不是完全平方数，所以它的平方根是无理数。`,
              ],
              [
                `\\sqrt[3]{${nonCube}}`,
                `$${nonCube}$ is not a perfect cube, so its cube root is irrational.`,
                `$${nonCube}$ 不是完全立方数，所以它的立方根是无理数。`,
              ],
              [
                "\\pi",
                "The decimal of $\\pi$ never ends and never repeats, so it is irrational.",
                "$\\pi$ 的小数既不终止也不循环，所以是无理数。",
              ],
              [
                `${multiple}\\sqrt{${otherNonSquare}}`,
                `A whole number times the irrational $\\sqrt{${otherNonSquare}}$ stays irrational.`,
                `整数乘无理数 $\\sqrt{${otherNonSquare}}$ 仍是无理数。`,
              ],
            ],
            3,
          );
          return chosenMath(
            rng,
            ["Which of these numbers is rational?", "下面哪个数是有理数？"],
            rational,
            irrationals,
            [
              [
                ["Simplify", "化简"],
                [`Simplify the one that can be simplified: ${why[0]}`, `把能化简的化简：${why[1]}`],
              ],
              [
                ["Decide", "判断"],
                [
                  "That is a ratio of integers, so it is rational. The others keep $\\pi$ or a root of a number that is not a perfect power.",
                  "这是整数之比，所以是有理数。其他各数仍含 $\\pi$ 或非完全幂的方根。",
                ],
              ],
            ],
            [`Work backwards: ${back[0]}.`, `反过来验证：${back[1]}。`],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 4,
            step: 1,
            labels: [0, 1, 2, 3, 4],
            marks: [
              { at: 1 / 3, text: "0.3̅" },
              { at: 3, text: "∛27" },
              { at: Math.sqrt(8), text: "√8" },
            ],
          },
          [
            "A number line from 0 to 4 with 0.3 repeating, the cube root of 27 at 3, and √8 marked.",
            "一条从 0 到 4 的数轴，标出 0.3 循环、位于 3 的 27 的立方根，以及 √8。",
          ],
        ),
      ),
    ],
  },
  [
    "Measure the diagonal of a square with sides of $1$ metre. Its length squared is $1 + 1 = 2$, so it is $\\sqrt{2}$ metres, a length that no fraction of a metre can name exactly.",
    "量一个边长为 $1$ 米的正方形的对角线。它的长度的平方是 $1 + 1 = 2$，所以长 $\\sqrt{2}$ 米，没有哪个分数能准确表示这个长度。",
  ],
  [
    "$1.4^2 = 1.96$ and $1.5^2 = 2.25$, so $\\sqrt{2}$ lies between $1.4$ and $1.5$.",
    "$1.4^2 = 1.96$，$1.5^2 = 2.25$，所以 $\\sqrt{2}$ 在 $1.4$ 和 $1.5$ 之间。",
  ],
  [
    "sort numbers into rational and irrational, find rational numbers hidden under roots and repeating decimals, and see when an irrational becomes rational.",
    "把数分成有理数和无理数，找出藏在根号和循环小数中的有理数，并看看无理数什么时候会变成有理数。",
  ],
);

/** approximatingSquareRoots estimates values of non-perfect square roots between integers. */
export const approximatingSquareRoots: TopicDef = withIntro(
  {
    id: "approximating-square-roots",
    title: t("Approximating Square Roots", "近似平方根"),
    summary: t(
      "Estimate square roots of non-perfect squares between consecutive integers.",
      "在两个连续整数之间估算非完全平方数的平方根。",
    ),
    prerequisites: ["square-roots-and-cube-roots"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.8.NS.A.2"],
    knowledgePoints: [
      lesson(
        "consecutive-integer-bounds",
        ["Consecutive Integer Bounds for Square Roots", "平方根的连续整数界限"],
        [
          [
            "To estimate a square root $\\sqrt{N}$ where $N$ is not a perfect square, find the two consecutive perfect squares that bracket $N$.\n\nFor example, $49 < 54 < 64$, so $7 < \\sqrt{54} < 8$.",
            "要估算非完全平方数 $N$ 的平方根 $\\sqrt{N}$，找出夹住 $N$ 的两个连续完全平方数。\n\n例如，因为 $49 < 54 < 64$，所以 $7 < \\sqrt{54} < 8$。",
          ],
          [
            "A calculator gives $\\sqrt{54} \\approx 7.35$, which is between $7$ and $8$.",
            "计算器给出 $\\sqrt{54} \\approx 7.35$，确实在 $7$ 和 $8$ 之间。",
          ],
          [
            "Compare $N$ with squares, not with doubles: $\\sqrt{54}$ is not near $27$, because $27^2 = 729$.",
            "要把 $N$ 和平方数比较，而不是和它的一半比较：$\\sqrt{54}$ 并不接近 $27$，因为 $27^2 = 729$。",
          ],
        ],
        (rng) => {
          const k = rng.int(3, 11);
          const lowerSq = k * k;
          const upperSq = (k + 1) * (k + 1);
          const n = rng.int(lowerSq + 1, upperSq - 1);
          return valued(
            [
              `The value of $\\sqrt{${n}}$ lies between two consecutive integers $k$ and $k + 1$. What is the value of $k$?`,
              `$\\sqrt{${n}}$ 的值介于两个连续整数 $k$ 与 $k + 1$ 之间。$k$ 的值是多少？`,
            ],
            k,
            [
              [
                ["Find the squares around it", "找出两边的平方数"],
                [
                  `The perfect squares on either side of $${n}$ are $${lowerSq}$ and $${upperSq}$:`,
                  `$${n}$ 两边的完全平方数是 $${lowerSq}$ 和 $${upperSq}$：`,
                ],
                [`${lowerSq} < ${n} < ${upperSq}`],
              ],
              [
                ["Take square roots", "开平方"],
                ["Square roots keep the order:", "开平方后大小顺序不变："],
                [`${k} < \\sqrt{${n}} < ${k + 1}`],
              ],
            ],
            [
              `A calculator gives $\\sqrt{${n}} \\approx ${Math.sqrt(n).toFixed(2)}$, which is between $${k}$ and $${k + 1}$.`,
              `计算器给出 $\\sqrt{${n}} \\approx ${Math.sqrt(n).toFixed(2)}$，确实在 $${k}$ 和 $${k + 1}$ 之间。`,
            ],
            [
              [k + 1, `That is $k + 1$, the integer above. $k$ is the smaller one.`, `这是上面的整数 $k + 1$。$k$ 是较小的那个。`],
              [k - 1, `Too low: $${k}^2 = ${lowerSq}$ is already below $${n}$.`, `太小了：$${k}^2 = ${lowerSq}$ 已经小于 $${n}$。`],
              ...(n % 2 === 0
                ? [
                    [
                      n / 2,
                      "You halved the number. A square root is the number that squares to it.",
                      "你把这个数除以了 2。平方根是平方后等于它的数。",
                    ] as const,
                  ]
                : []),
            ],
            {
              form: "integer",
              figure: lineFigure(
                { lo: k - 1, hi: k + 2, step: 1, labels: [k - 1, k, k + 1, k + 2], marks: [{ at: Math.sqrt(n), text: `√${n}` }] },
                [`A number line from ${k - 1} to ${k + 2} with √${n} marked.`, `一条从 ${k - 1} 到 ${k + 2} 的数轴，标出 √${n}。`],
              ),
            },
          );
        },
        lineFigure({ lo: 6, hi: 9, step: 1, labels: [6, 7, 8, 9], marks: [{ at: Math.sqrt(54), text: "√54" }] }, [
          "A number line from 6 to 9 with √54 marked between 7 and 8.",
          "一条从 6 到 9 的数轴，在 7 和 8 之间标出 √54。",
        ]),
      ),
      lesson(
        "nearest-integer-to-a-square-root",
        ["The Nearest Integer to a Square Root", "最接近平方根的整数"],
        [
          [
            "Knowing that $\\sqrt{N}$ lies between $k$ and $k + 1$ does not say which one it is closer to. The halfway point is $k + \\frac{1}{2}$, and $(k + \\frac{1}{2})^2 = k^2 + k + \\frac{1}{4}$. So $\\sqrt{N}$ is closer to $k$ when $N \\le k^2 + k$ and closer to $k + 1$ when $N \\ge k^2 + k + 1$.\n\nFor $\\sqrt{54}$: $k = 7$ and $7^2 + 7 = 56$. Since $54 \\le 56$, $\\sqrt{54}$ is closer to $7$.",
            "知道 $\\sqrt{N}$ 在 $k$ 与 $k + 1$ 之间，并不能说明它更接近哪一个。两者的中点是 $k + \\frac{1}{2}$，而 $(k + \\frac{1}{2})^2 = k^2 + k + \\frac{1}{4}$。因此当 $N \\le k^2 + k$ 时 $\\sqrt{N}$ 更接近 $k$，当 $N \\ge k^2 + k + 1$ 时更接近 $k + 1$。\n\n对于 $\\sqrt{54}$：$k = 7$，$7^2 + 7 = 56$。因为 $54 \\le 56$，所以 $\\sqrt{54}$ 更接近 $7$。",
          ],
          [
            "A calculator gives $\\sqrt{54} \\approx 7.35$, which rounds to $7$.",
            "计算器给出 $\\sqrt{54} \\approx 7.35$，四舍五入是 $7$。",
          ],
          [
            "The halfway point between the roots is not the halfway point between the squares: $7.5^2 = 56.25$, not $56.5$.",
            "两个根之间的中点不对应两个平方数之间的中点：$7.5^2 = 56.25$，不是 $56.5$。",
          ],
        ],
        (rng) => {
          const k = rng.int(3, 14);
          const n = rng.int(k * k + 1, (k + 1) * (k + 1) - 1);
          const mid = k * k + k;
          const nearest = n <= mid ? k : k + 1;
          const other = nearest === k ? k + 1 : k;
          return valued(
            [`Which whole number is closest to $\\sqrt{${n}}$?`, `哪个整数最接近 $\\sqrt{${n}}$？`],
            nearest,
            [
              [
                ["Bound it", "确定范围"],
                ["Find the perfect squares on either side:", "找出两边的完全平方数："],
                [`${k * k} < ${n} < ${(k + 1) * (k + 1)}`, `${k} < \\sqrt{${n}} < ${k + 1}`],
              ],
              [
                ["Compare with the halfway square", "和中点的平方比较"],
                [
                  `The halfway point $${k}.5$ has square $${mid}.25$, and $${n}$ is ${n <= mid ? "below" : "above"} it. So $\\sqrt{${n}}$ is closer to $${nearest}$.`,
                  `中点 $${k}.5$ 的平方是 $${mid}.25$，$${n}$ ${n <= mid ? "小于" : "大于"}它。所以 $\\sqrt{${n}}$ 更接近 $${nearest}$。`,
                ],
              ],
            ],
            [
              `A calculator gives $\\sqrt{${n}} \\approx ${Math.sqrt(n).toFixed(2)}$, which rounds to $${nearest}$.`,
              `计算器给出 $\\sqrt{${n}} \\approx ${Math.sqrt(n).toFixed(2)}$，四舍五入是 $${nearest}$。`,
            ],
            [
              [
                other,
                `That is the other integer around it. The halfway square $${mid}.25$ decides between them.`,
                `这是另一边的整数。由中点的平方 $${mid}.25$ 来决定更接近哪个。`,
              ],
              [
                nearest === k ? k - 1 : k + 2,
                `$\\sqrt{${n}}$ is not even between that and its neighbour: it lies between $${k}$ and $${k + 1}$.`,
                `$\\sqrt{${n}}$ 并不在这个数附近：它在 $${k}$ 和 $${k + 1}$ 之间。`,
              ],
              [nearest * nearest, "That is the perfect square nearby, not its square root.", "这是附近的完全平方数，不是它的平方根。"],
            ],
            {
              form: "integer",
              figure: lineFigure(
                {
                  lo: k,
                  hi: k + 1,
                  step: 0.5,
                  labels: [k, k + 0.5, k + 1],
                  marks: [{ at: Math.sqrt(n), text: `√${n}` }],
                },
                [
                  `A number line from ${k} to ${k + 1}, with its midpoint ${k}.5 and √${n} marked.`,
                  `一条从 ${k} 到 ${k + 1} 的数轴，标出中点 ${k}.5 和 √${n}。`,
                ],
              ),
            },
          );
        },
        lineFigure({ lo: 7, hi: 8, step: 0.5, labels: [7, 7.5, 8], marks: [{ at: Math.sqrt(54), text: "√54" }] }, [
          "A number line from 7 to 8 with its midpoint 7.5 and √54 marked left of it.",
          "一条从 7 到 8 的数轴，标出中点 7.5，√54 在中点左边。",
        ]),
      ),
    ],
  },
  [
    "A square garden has an area of $54$ square metres. A side of $7$ metres would give only $49$, and $8$ metres would give $64$, so the side is somewhere between $7$ and $8$ metres.",
    "一块正方形花园的面积是 $54$ 平方米。边长 $7$ 米只有 $49$，$8$ 米则是 $64$，所以边长在 $7$ 米和 $8$ 米之间。",
  ],
  [
    "$7.3^2 = 53.29$ and $7.4^2 = 54.76$, so the side is between $7.3$ and $7.4$ metres.",
    "$7.3^2 = 53.29$，$7.4^2 = 54.76$，所以边长在 $7.3$ 米和 $7.4$ 米之间。",
  ],
  [
    "trap a square root between two whole numbers, find the nearest whole number, and count the whole numbers whose square root falls in a range.",
    "把平方根夹在两个整数之间，找出最接近的整数，并数出平方根落在某个范围内的整数。",
  ],
);

/** twoWayLatex writes a two-way table with row and column totals; a null cell is shown as a blank to fill. */
function twoWayLatex(
  rows: readonly [string, string],
  cols: readonly [string, string],
  cells: readonly (readonly (number | null)[])[],
  total: string,
): string {
  const cell = (v: number | null | undefined) => (v === null || v === undefined ? "?" : `${v}`);
  const line = (label: string, r: readonly (number | null)[]) => `\\text{${label}} & ${r.map(cell).join(" & ")}`;
  return `\\begin{array}{|l|c|c|c|}\\hline & \\text{${cols[0]}} & \\text{${cols[1]}} & \\text{${total}} \\\\ \\hline ${line(rows[0], cells[0]!)} \\\\ \\hline ${line(rows[1], cells[1]!)} \\\\ \\hline ${line(total, cells[2]!)} \\\\ \\hline\\end{array}`;
}

/** twoWayFrequencyTables reads and interprets bivariate categorical data tables. */
export const twoWayFrequencyTables: TopicDef = {
  id: "two-way-frequency-tables",
  title: t("Two-Way Frequency Tables", "双向频数表"),
  summary: t(
    "Construct, read, and complete two-way frequency tables for bivariate categorical data.",
    "构建、识读并填补二元分类数据的双向频数表。",
  ),
  prerequisites: ["dot-plots"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.8.SP.A.4"],
  knowledgePoints: [
    {
      id: "completing-two-way-tables",
      title: t("Completing Two-Way Frequency Tables", "填补双向频数表"),
      explanation: t(
        "A **two-way frequency table** shows counts for two categorical variables. The row totals and column totals must each sum to the overall total in the bottom-right cell.",
        "**双向频数表**显示两个分类变量的频数统计。行合计与列合计加总后必须等于右下角单元格的总计数。",
      ),
      generate(rng) {
        const a1 = rng.int(10, 35);
        const a2 = rng.int(12, 35);
        const b1 = rng.int(15, 40);
        const b2 = rng.int(10, 35);

        const row1Total = a1 + a2;
        const row2Total = b1 + b2;
        const col1Total = a1 + b1;
        const grandTotal = row1Total + row2Total;

        const prompt = t(
          `In a survey of $${grandTotal}$ students, $${row1Total}$ students play a sport and $${row2Total}$ do not. Of those who play a sport, $${a1}$ play an instrument. If $${col1Total}$ students in total play an instrument, how many students play a sport but do NOT play an instrument?`,
          `在一项对 $${grandTotal}$ 名学生的调查中，$${row1Total}$ 名学生参加体育运动，$${row2Total}$ 名不参加。在参加体育运动的学生中，$${a1}$ 名学生演奏乐器。如果总共有 $${col1Total}$ 名学生演奏乐器，有多少名学生参加体育运动但不演奏乐器？`,
        );
        const solution = t(
          `Among students who play a sport, the total is $${row1Total}$. Since $${a1}$ play an instrument, subtract to find those who do not: $${row1Total} - ${a1} = ${a2}$.`,
          `在参加体育运动的学生中，总数为 $${row1Total}$ 人。因为其中 $${a1}$ 人演奏乐器，相减即可得出不演奏乐器的人数：$${row1Total} - ${a1} = ${a2}$。`,
        );

        return numberProblem({
          prompt,
          answer: a2,
          form: "integer",
          wrong: [a1, b2, grandTotal - a1],
          solution,
        });
      },
    },
    {
      id: "a-cell-from-the-totals",
      title: t("Finding a Cell from Row and Column Totals", "由行列合计求单元格"),
      explanation: t(
        'In a two-way table every row adds up to its row total and every column adds up to its column total. A blank cell can therefore be found from any line through it whose other entries are known, and sometimes a second blank must be filled first.\n\nIf the "yes" column total is $40$ and the first row has $15$ in that column, the second row\'s "yes" cell is $40 - 15 = 25$; with a row total of $60$, the cell next to it is $60 - 25 = 35$.',
        "在双向表中，每行之和等于行合计，每列之和等于列合计。因此只要经过空格的某一行或某一列的其余数都已知，就能求出这个空格；有时要先填出另一个空格。\n\n若“是”这一列的合计为 $40$，第一行在这一列是 $15$，则第二行“是”的格子为 $40 - 15 = 25$；若第二行合计为 $60$，它旁边的格子为 $60 - 25 = 35$。",
      ),
      generate(rng) {
        const a1 = rng.int(8, 40);
        const a2 = rng.int(8, 40);
        const b1 = rng.int(8, 40);
        const b2 = rng.int(8, 40);
        const [rowsEn, rowsZh, colsEn, colsZh] = rng.pick([
          [
            ["Grade 7", "Grade 8"],
            ["七年级", "八年级"],
            ["Bus", "Walk"],
            ["坐车", "步行"],
          ],
          [
            ["Adults", "Children"],
            ["成人", "儿童"],
            ["Tea", "Juice"],
            ["茶", "果汁"],
          ],
          [
            ["Morning", "Evening"],
            ["上午", "晚上"],
            ["Online", "In store"],
            ["网购", "店内"],
          ],
        ] as const);
        const r1 = a1 + a2;
        const r2 = b1 + b2;
        const c1 = a1 + b1;
        const c2 = a2 + b2;
        const all = r1 + r2;
        const cells = [
          [a1, null, r1],
          [null, null, r2],
          [c1, c2, all],
        ] as const;
        return numberProblem({
          prompt: t(
            `Find the value in the "${rowsEn[1]}" row and the "${colsEn[1]}" column. $$${twoWayLatex(rowsEn, colsEn, cells, "Total")}$$`,
            `求“${rowsZh[1]}”一行中“${colsZh[1]}”一列的数。$$${twoWayLatex(rowsZh, colsZh, cells, "合计")}$$`,
          ),
          answer: b2,
          form: "integer",
          wrong: [b1, a2, c2 - a1, r2 - a1].filter((w) => w !== b2 && w > 0),
          solution: t(
            `First the "${colsEn[1]}" cell of the first row: $${r1} - ${a1} = ${a2}$. Then the "${colsEn[1]}" column gives $${c2} - ${a2} = ${b2}$.`,
            `先求第一行“${colsZh[1]}”的格子：$${r1} - ${a1} = ${a2}$。再由“${colsZh[1]}”一列得 $${c2} - ${a2} = ${b2}$。`,
          ),
        });
      },
    },
  ],
};

/** contestEdges are the class edges of the contest scores in the histogram knowledge points. */
const contestEdges = [0, 20, 40, 60, 80, 100];

/** contestFigure draws contest scores as a histogram, with alt text giving each bar. */
function contestFigure(freqs: readonly number[]): Figure {
  const bars = freqs.map((f, i) => [contestEdges[i]!, contestEdges[i + 1]!, f] as const);
  return {
    svg: histogramSvg(contestEdges, freqs),
    alt: t(
      `Histogram of contest scores: ${bars.map(([a, b, f]) => `${f} ${f === 1 ? "student" : "students"} from ${a} to ${b}`).join(", ")}.`,
      `竞赛成绩直方图：${bars.map(([a, b, f]) => `${a} 到 ${b} 分有 ${f} 名学生`).join("，")}。`,
    ),
  };
}

/** contestFreqs draws five bar heights for the contest histogram, all different so the tallest and shortest bars are clear. */
const contestFreqs = (rng: Rng) => rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 5);

/** histogramExample is the histogram drawn with the knowledge-point explanations. */
const histogramExample = contestFigure([3, 7, 10, 6, 2]);

/** histograms reads and interprets frequency distributions in histograms. */
export const histograms: TopicDef = withIntro(
  {
    id: "histograms",
    title: t("Histograms", "直方图"),
    summary: t(
      "Interpret frequency distributions and count data displayed across intervals in histograms.",
      "解读直方图中按区间展示的频数分布并统计数据。",
    ),
    prerequisites: ["dot-plots"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.6.SP.B.4"],
    knowledgePoints: [
      lesson(
        "reading-histograms",
        ["Reading Frequencies from Histograms", "识读直方图的频数"],
        [
          [
            "A **histogram** groups data into intervals of equal width, called bins, drawn side by side. The height of a bar is how many values fall in that bin. In the histogram shown, the bar over $40$ to $60$ reaches $10$, so $10$ students scored at least $40$ but less than $60$. To count several bins, add their heights.",
            "**直方图**把数据分成宽度相等、彼此相邻的区间，称为组。柱子的高度是落在该组中的数据个数。图中 $40$ 到 $60$ 上方的柱子高到 $10$，所以有 $10$ 名学生的成绩不低于 $40$ 且低于 $60$。要统计几个组，就把它们的高度相加。",
          ],
          [
            "Scores of $40$ or more: $10 + 6 + 2 = 18$, and those below $40$ are $3 + 7 = 10$, which make all $28$.",
            "$40$ 分及以上：$10 + 6 + 2 = 18$；$40$ 分以下：$3 + 7 = 10$；合起来正好是全部 $28$ 人。",
          ],
          [
            "A bin holds its left edge but not its right. A score of $60$ is in the $60$ to $80$ bin.",
            "每组包含左端点，不包含右端点。$60$ 分属于 $60$ 到 $80$ 这一组。",
          ],
        ],
        (rng) => {
          const freqs = contestFreqs(rng);
          const [c1, c2, c3, c4, c5] = freqs as [number, number, number, number, number];
          const answer = c3 + c4 + c5;
          const all = c1 + c2 + answer;
          return valued(
            [
              "The histogram shows the scores of the students in a math contest. Each bin includes its left edge but not its right edge. How many students scored $40$ or higher?",
              "直方图显示了一次数学竞赛中学生的成绩。每组包含左端点，不包含右端点。有多少名学生的成绩在 $40$ 分及以上？",
            ],
            answer,
            [
              [
                ["Pick the bins", "找出这些组"],
                [
                  "From $40$ up the bins are $40$–$60$, $60$–$80$ and $80$–$100$, with heights:",
                  "$40$ 分起的组是 $40$–$60$、$60$–$80$ 和 $80$–$100$，高度是：",
                ],
                [`${c3}, \\ ${c4}, \\ ${c5}`],
              ],
              [["Add", "相加"], ["Add the heights:", "把高度相加："], [`${c3} + ${c4} + ${c5} = ${answer}`]],
            ],
            [
              `All the bars add to $${all}$, and the two bins below $40$ hold $${c1} + ${c2} = ${c1 + c2}$; $${all} - ${c1 + c2} = ${answer}$.`,
              `所有柱子加起来是 $${all}$，$40$ 分以下的两组有 $${c1} + ${c2} = ${c1 + c2}$；$${all} - ${c1 + c2} = ${answer}$。`,
            ],
            [
              [c4 + c5, "That leaves out the $40$ to $60$ bin.", "这漏掉了 $40$ 到 $60$ 这一组。"],
              [c1 + c2, "That counts the students below $40$.", "这是 $40$ 分以下的人数。"],
              [c3 + c4, "That leaves out the $80$ to $100$ bin.", "这漏掉了 $80$ 到 $100$ 这一组。"],
              [all, "That counts every student.", "这是全部学生的人数。"],
            ],
            { figure: contestFigure(freqs) },
          );
        },
        histogramExample,
      ),
      lesson(
        "total-count-from-a-histogram",
        ["Finding the total count", "求数据总数"],
        [
          [
            "Every value falls in exactly one bin, so the total number of values is the sum of all the bar heights. In the histogram shown, $3 + 7 + 10 + 6 + 2 = 28$ students took the contest.",
            "每个数据恰好落在一个组中，所以数据总数等于所有柱子高度之和。图中参加竞赛的学生有 $3 + 7 + 10 + 6 + 2 = 28$ 名。",
          ],
          ["In pairs: $3 + 7 = 10$, $6 + 2 = 8$, and $10 + 10 + 8 = 28$.", "凑整相加：$3 + 7 = 10$，$6 + 2 = 8$，$10 + 10 + 8 = 28$。"],
          [
            "Add the heights; do not count the bars. Five bars can hold many more than five students.",
            "要把高度相加，不是数柱子的根数。五根柱子可以代表远多于五名学生。",
          ],
        ],
        (rng) => {
          const freqs = contestFreqs(rng);
          const answer = freqs.reduce((a, b) => a + b, 0);
          const [c1, c2, c3, c4, c5] = freqs as [number, number, number, number, number];
          return valued(
            [
              "The histogram shows the scores of the students in a math contest. How many students took the contest?",
              "直方图显示了一次数学竞赛中学生的成绩。共有多少名学生参加了竞赛？",
            ],
            answer,
            [
              [["Read each bar", "读出每根柱子"], ["The five heights are:", "五根柱子的高度是："], [freqs.join(", \\ ")]],
              [["Add", "相加"], ["Every student is in one bin:", "每名学生都在某一组中："], [`${freqs.join(" + ")} = ${answer}`]],
            ],
            [
              `The first two bins hold $${c1 + c2}$ and the last three $${c3 + c4 + c5}$, and $${c1 + c2} + ${c3 + c4 + c5} = ${answer}$.`,
              `前两组有 $${c1 + c2}$ 人，后三组有 $${c3 + c4 + c5}$ 人，$${c1 + c2} + ${c3 + c4 + c5} = ${answer}$。`,
            ],
            [
              [freqs.length, "That counts the bars, not the students.", "这是柱子的根数，不是学生人数。"],
              [Math.max(...freqs), "That is only the tallest bar.", "这只是最高的柱子。"],
              [answer - c1, "That leaves out the first bin.", "这漏掉了第一组。"],
            ],
            { figure: contestFigure(freqs) },
          );
        },
        histogramExample,
      ),
      lesson(
        "comparing-bins",
        ["Comparing bins", "比较各组"],
        [
          [
            "The tallest bar marks the bin with the most values, and the shortest the bin with the fewest. In the histogram shown, the tallest is over $40$ to $60$ with $10$ and the shortest over $80$ to $100$ with $2$. To compare two bins, subtract their heights: $10 - 2 = 8$.",
            "最高的柱子标出数据最多的组，最矮的柱子标出数据最少的组。图中最高的在 $40$ 到 $60$ 上方，有 $10$ 人；最矮的在 $80$ 到 $100$ 上方，有 $2$ 人。比较两组时，把高度相减：$10 - 2 = 8$。",
          ],
          ["$2 + 8 = 10$.", "$2 + 8 = 10$。"],
          [
            "Compare the heights, not the bins' positions or the scores along the bottom.",
            "比较的是柱子的高度，不是组的位置或底下的分数。",
          ],
        ],
        (rng) => {
          const freqs = contestFreqs(rng);
          const most = freqs.indexOf(Math.max(...freqs));
          const fewest = freqs.indexOf(Math.min(...freqs));
          const hi = freqs[most] as number;
          const lo = freqs[fewest] as number;
          const answer = hi - lo;
          const bin = (i: number) => `$${contestEdges[i]}$–$${contestEdges[i + 1]}$`;
          return valued(
            [
              "The histogram shows the scores of the students in a math contest. How many more students scored in the bin with the most students than in the bin with the fewest?",
              "直方图显示了一次数学竞赛中学生的成绩。人数最多的组比人数最少的组多多少名学生？",
            ],
            answer,
            [
              [
                ["Find the tallest and shortest", "找出最高和最矮的柱子"],
                [`Tallest over ${bin(most)}, shortest over ${bin(fewest)}:`, `最高的在 ${bin(most)} 上方，最矮的在 ${bin(fewest)} 上方：`],
                [`${hi} \\text{ and } ${lo}`],
              ],
              [["Subtract", "相减"], ["How many more:", "多多少："], [`${hi} - ${lo} = ${answer}`]],
            ],
            [`$${lo} + ${answer} = ${hi}$.`, `$${lo} + ${answer} = ${hi}$。`],
            [
              [hi, "That is the tallest bar alone, not the difference.", "这只是最高的柱子，不是差。"],
              [hi + lo, "That adds the two bars instead of subtracting.", "这是把两根柱子相加，不是相减。"],
              [Math.abs(most - fewest), "That counts the bins between them, not the students.", "这是两组之间相隔的组数，不是人数。"],
            ],
            { figure: contestFigure(freqs) },
          );
        },
        histogramExample,
      ),
    ],
  },
  [
    "A teacher has the scores of $28$ students. Instead of listing them all, she counts how many fall between $0$ and $20$, $20$ and $40$, and so on, and draws a bar for each.",
    "一位老师有 $28$ 名学生的成绩。她没有一一列出，而是数出 $0$ 到 $20$、$20$ 到 $40$ 等各段各有多少人，再为每段画一根柱子。",
  ],
  [
    "The bars are $3$, $7$, $10$, $6$ and $2$ tall, and $3 + 7 + 10 + 6 + 2 = 28$.",
    "柱子高 $3$、$7$、$10$、$6$ 和 $2$，而 $3 + 7 + 10 + 6 + 2 = 28$。",
  ],
  ["read bars of a histogram, find the total count and compare bins.", "读出直方图中柱子的高度，求数据总数，并比较各组。"],
);
/** grade6to8FoundationTopics are the foundational topics bridging Middle School mathematics. */
export const grade6to8FoundationTopics: readonly TopicDef[] = [
  unitPricesAndSpeed,
  percentApplicationsInterestAndDiscounts,
  scaleDrawingsAndScaleFactor,
  classifyingRationalAndIrrationalNumbers,
  approximatingSquareRoots,
  twoWayFrequencyTables,
  histograms,
];
