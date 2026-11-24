// Further knowledge points for topics of 7th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade7Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { numberProblem } from "../problems.ts";
import { tableFigure } from "./early-grades-more-kit.ts";
import { drawn, lesson, valued } from "./grade-6-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** gcd7 is the greatest common factor of two positive integers. */
const gcd7 = (a: number, b: number): number => (b === 0 ? a : gcd7(b, a % b));

/** multiplierText writes 1 + p/100 as a decimal. */
const multiplierText = (p: number) => dec(Q.of(100 + p, 100));

const upThenDownSame: KnowledgePointDef = lesson(
  "up-and-down-by-the-same-percent",
  ["Up and down by the same percent", "先升后降相同的百分数"],
  [
    [
      "A rise and then a fall of the same percent does not bring a price back to the start. The fall is taken from the bigger, raised price, so more comes off than went on. Up $20\\%$ then down $20\\%$ multiplies by $1.2 \\times 0.8 = 0.96$: the price ends $4\\%$ lower.",
      "先涨再跌同样的百分数，价格回不到原来。下跌是从涨高后的价格算的，所以减掉的比加上的多。先涨 $20\\%$ 再跌 $20\\%$，相当于乘 $1.2 \\times 0.8 = 0.96$：最后比原价低 $4\\%$。",
    ],
    [
      "Start from $\\$100$: up to $\\$120$, then $20\\%$ of $120$ is $24$, so it falls to $\\$96$, which is $4\\%$ below $\\$100$.",
      "从 $\\$100$ 开始：涨到 $\\$120$，$120$ 的 $20\\%$ 是 $24$，所以跌到 $\\$96$，比 $\\$100$ 低 $4\\%$。",
    ],
    ["The answer is not $0\\%$: the two $20\\%$ are of different amounts.", "答案不是 $0\\%$：两个 $20\\%$ 的基数不同。"],
  ],
  (rng) => {
    const rate = rng.int(2, 90);
    const answer = Q.of(rate * rate, 100);
    const up = Q.of(100 + rate, 100);
    const down = Q.of(100 - rate, 100);
    const both = up.mul(down);
    const high = 100 + rate;
    const off = Q.of(high * rate, 100);
    return valued(
      [
        `A price rises by $${rate}\\%$ and then falls by $${rate}\\%$. By what percent of the original is the final price lower than the original?`,
        `一个价格先上涨 $${rate}\\%$，再下降 $${rate}\\%$。最终价格比原价低原价的百分之几？`,
      ],
      answer,
      [
        [
          ["Multipliers", "写出倍数"],
          ["Write the rise and the fall as multipliers:", "把上涨和下降写成倍数："],
          [`${100 + rate}\\% = ${dec(up)}`, `${100 - rate}\\% = ${dec(down)}`],
        ],
        [
          ["Multiply", "相乘"],
          ["Multiply them for the overall effect:", "相乘得到总效果："],
          [`${dec(up)} \\times ${dec(down)} = ${dec(both)}`],
        ],
        [
          ["Read the loss", "读出减少"],
          [
            `The final price is $${dec(both.mul(Q.of(100)))}\\%$ of the original, so it is lower by:`,
            `最终价格是原价的 $${dec(both.mul(Q.of(100)))}\\%$，所以低了：`,
          ],
          [`100\\% - ${dec(both.mul(Q.of(100)))}\\% = ${dec(answer)}\\%`],
        ],
      ],
      [
        `Start from $100$: it rises to $${high}$, and $${rate}\\%$ of $${high}$ is $${dec(off)}$, so it falls to $${dec(Q.of(high).sub(off))}$, which is $${dec(answer)}$ below $100$.`,
        `从 $100$ 开始：涨到 $${high}$，$${high}$ 的 $${rate}\\%$ 是 $${dec(off)}$，所以跌到 $${dec(Q.of(high).sub(off))}$，比 $100$ 少 $${dec(answer)}$。`,
      ],
      [
        [
          0,
          "That assumes the fall undoes the rise, but the fall is taken from a bigger price.",
          "这是以为下跌正好抵消上涨，但下跌是从更高的价格算的。",
        ],
        [rate, "That is the rate itself, not the overall loss.", "这是比率本身，不是总的减少。"],
        [2 * rate, "That adds the two rates, but one was a rise and the other a fall.", "这是把两个比率相加，但一个是上涨，一个是下降。"],
        [Q.of(rate * rate), "That squares the rate without dividing by $100$.", "这是把比率平方后没有除以 $100$。"],
      ],
      { form: "decimal", percent: true },
    );
  },
  tapeFigure(
    [
      { pieces: [{ size: 100, text: "100" }] },
      {
        pieces: [
          { size: 100, text: "100" },
          { size: 20, text: "20" },
        ],
      },
      {
        pieces: [
          { size: 96, text: "96", lit: true },
          { size: 24, text: "24", dashed: true },
        ],
      },
    ],
    ["Three bars: 100, then 120 after the rise, then 96 after taking away 24.", "三个长条：100，上涨后 120，再去掉 24 后剩 96。"],
  ),
);

const returningPercent: KnowledgePointDef = lesson(
  "the-percent-that-undoes-a-change",
  ["The percent that undoes a change", "抵消变化的百分数"],
  [
    [
      "A percent is always a percent of something, and after a rise the base is bigger. To bring a raised price back, divide the amount it must fall by the new price, not by the old one. A $\\$80$ price raised by $25\\%$ becomes $\\$100$; it must fall by $\\$20$, and $\\frac{20}{100} = 20\\%$.",
      "百分数总是某个量的百分数，上涨之后基数变大了。要让涨高的价格回到原价，就用要下降的量除以新价格，而不是除以原价。$\\$80$ 的价格上涨 $25\\%$ 变成 $\\$100$；它要下降 $\\$20$，$\\frac{20}{100} = 20\\%$。",
    ],
    ["$\\$100 \\times 0.8 = \\$80$, back to the start.", "$\\$100 \\times 0.8 = \\$80$，回到原价。"],
    ["Falling by the same $25\\%$ goes too far: $100 \\times 0.75 = 75$.", "下降同样的 $25\\%$ 就降过头了：$100 \\times 0.75 = 75$。"],
  ],
  (rng) => {
    const [up, down] = rng.pick([
      [25, 20],
      [100, 50],
      [150, 60],
      [300, 75],
      [400, 80],
      [900, 90],
      [60, 37.5],
    ]) as [number, number];
    const base = 20 * rng.int(1, 20);
    const raised = (base * (100 + up)) / 100;
    const fall = raised - base;
    const rest = Q.of((100 - down) * 2, 200);
    return valued(
      [
        `A price of $\\$${base}$ is raised by $${up}\\%$. By what percent must the new price be lowered to bring it back to $\\$${base}$?`,
        `$\\$${base}$ 的价格上涨 $${up}\\%$。新价格要下降百分之几才能回到 $\\$${base}$？`,
      ],
      Q.of(down * 2, 2),
      [
        [
          ["The new price", "新价格"],
          [`Raise $\\$${base}$ by $${up}\\%$, then find how far it must fall:`, `把 $\\$${base}$ 上涨 $${up}\\%$，再求要下降多少：`],
          [`${base} \\times ${multiplierText(up)} = ${raised}`, `${raised} - ${base} = ${fall}`],
        ],
        [
          ["Divide by the new price", "除以新价格"],
          ["The fall is a percent of the new price:", "下降的量是新价格的百分之几："],
          [`\\frac{${fall}}{${raised}} = ${dec(Q.of(down * 2, 200))} = ${dec(Q.of(down * 2, 2))}\\%`],
        ],
      ],
      [`$${raised} \\times ${dec(rest)} = ${base}$, the starting price.`, `$${raised} \\times ${dec(rest)} = ${base}$，正是原价。`],
      [
        [
          up,
          "Falling by the same percent goes too far, because it is taken from the bigger price.",
          "下降同样的百分数会降过头，因为它是从更高的价格算的。",
        ],
        [
          Q.of(fall * 100, base),
          "That divides by the old price; the fall is taken from the new price.",
          "这是除以原价；下降是从新价格算的。",
        ],
        [
          Q.of((100 - down) * 2, 2),
          "That is the percent of the new price that remains, not the percent taken off.",
          "这是新价格剩下的百分比，不是下降的百分比。",
        ],
      ],
      { form: "decimal", percent: true },
    );
  },
  tapeFigure(
    [
      {
        total: "100",
        pieces: [
          { size: 80, text: "80" },
          { size: 20, text: "20", lit: true },
        ],
      },
    ],
    [
      "A bar of 100: the old price 80 plus 20; the 20 must come off, compared with 100.",
      "长条 100：原价 80 加 20；要去掉 20，与 100 比较。",
    ],
  ),
);

const originalFromTwoChanges: KnowledgePointDef = lesson(
  "the-original-value-after-two-changes",
  ["The original value after two changes", "两次变化后求原值"],
  [
    [
      "After two percent changes, the final value is the original times both multipliers. To work backwards, divide by both. A coat at $20\\%$ off with $10\\%$ tax costs $\\$88$: the multipliers are $0.8$ and $1.1$, so $88 \\div 1.1 = 80$ and $80 \\div 0.8 = \\$100$.",
      "经过两次百分比变化，最终值等于原值乘两个倍数。倒着算，就除以这两个倍数。一件外套打八折（减 $20\\%$）再加 $10\\%$ 的税，共 $\\$88$：倍数是 $0.8$ 和 $1.1$，所以 $88 \\div 1.1 = 80$，$80 \\div 0.8 = \\$100$。",
    ],
    [
      "Forward from $\\$100$: $100 \\times 0.8 = 80$, then $80 \\times 1.1 = 88$.",
      "从 $\\$100$ 往前算：$100 \\times 0.8 = 80$，再 $80 \\times 1.1 = 88$。",
    ],
    [
      "Do not add and take away the percents from $\\$88$: each one was taken from a different amount.",
      "不要直接在 $\\$88$ 上加减这些百分数：它们各自的基数不同。",
    ],
  ],
  (rng) => {
    const discount = rng.pick([10, 20, 25, 40, 50]);
    const tax = rng.pick([5, 10, 20]);
    const original = 400 * rng.int(1, 12);
    const sale = (original * (100 - discount)) / 100;
    const final = (sale * (100 + tax)) / 100;
    const both = Q.of((100 - discount) * (100 + tax), 10000);
    return valued(
      [
        `A coat is sold at $${discount}\\%$ off, and a $${tax}\\%$ tax is then added to the sale price. The final cost is $\\$${final}$. What was the original price, in dollars?`,
        `一件外套减价 $${discount}\\%$ 出售，然后在售价上加 $${tax}\\%$ 的税。最终花费 $\\$${final}$。原价是多少美元？`,
      ],
      original,
      [
        [
          ["Undo the tax", "去掉税"],
          [
            `The tax multiplied the sale price by $${multiplierText(tax)}$; divide by it:`,
            `加税是把售价乘 $${multiplierText(tax)}$；除以它：`,
          ],
          [`${final} \\div ${multiplierText(tax)} = ${sale}`],
        ],
        [
          ["Undo the discount", "去掉折扣"],
          [
            `The discount multiplied the original by $${multiplierText(-discount)}$; divide by it:`,
            `减价是把原价乘 $${multiplierText(-discount)}$；除以它：`,
          ],
          [`${sale} \\div ${multiplierText(-discount)} = ${original}`],
        ],
      ],
      [
        `One combined multiplier: $${multiplierText(-discount)} \\times ${multiplierText(tax)} = ${dec(both)}$, and $${original} \\times ${dec(both)} = ${final}$.`,
        `合成一个倍数：$${multiplierText(-discount)} \\times ${multiplierText(tax)} = ${dec(both)}$，$${original} \\times ${dec(both)} = ${final}$。`,
      ],
      [
        [sale, "That is the sale price before the tax, not the original price.", "这是加税前的售价，不是原价。"],
        [final, "That is the final cost; the original price was changed twice to reach it.", "这是最终花费；原价经过两次变化才变成它。"],
        [
          Q.of(final * (100 + discount - tax), 100),
          "That adds and takes away the percents from the final cost, but each one was taken from a different amount.",
          "这是在最终花费上直接加减百分数，但它们各自的基数不同。",
        ],
        [Q.of(final * 100, 100 - discount), "That undoes the discount but forgets the tax.", "这只去掉了折扣，忘了去掉税。"],
      ],
    );
  },
  tapeFigure(
    [
      { pieces: [{ size: 100, text: "100", lit: true }] },
      { pieces: [{ size: 80, text: "80" }] },
      {
        pieces: [
          { size: 80, text: "80" },
          { size: 8, text: "8" },
        ],
      },
    ],
    ["Three bars: 100, then 80 after 20 percent off, then 88 after the tax.", "三个长条：100，减价 20% 后 80，加税后 88。"],
  ),
);

const averagePrice: KnowledgePointDef = lesson(
  "the-average-price-of-a-mixture",
  ["The average price of a mixture", "混合后的平均价格"],
  [
    [
      "The price per kilogram of a mixture is its total cost divided by its total weight. Find the cost of each part, add the costs, and divide by the total weight. $3$ kg at $\\$4$ and $1$ kg at $\\$8$ cost $\\$12 + \\$8 = \\$20$ for $4$ kg, so the mixture costs $\\$20 \\div 4 = \\$5$ per kg.",
      "混合物每千克的价钱是总费用除以总重量。先算出每部分的费用，把费用相加，再除以总重量。$3$ 千克每千克 $\\$4$ 和 $1$ 千克每千克 $\\$8$，共 $4$ 千克，费用 $\\$12 + \\$8 = \\$20$，所以混合后每千克 $\\$20 \\div 4 = \\$5$。",
    ],
    [
      "$\\$5$ lies between $\\$4$ and $\\$8$, nearer to $\\$4$, the price of the larger part.",
      "$\\$5$ 在 $\\$4$ 和 $\\$8$ 之间，而且更接近量多那部分的价钱 $\\$4$。",
    ],
    [
      "It is not the simple average $\\$6$ of the two prices: the larger part counts for more.",
      "它不是两个价钱的简单平均 $\\$6$：量多的部分分量更重。",
    ],
  ],
  (rng) => {
    const low = rng.int(2, 9);
    const high = low + rng.int(2, 9);
    const a = rng.int(2, 18);
    let b = rng.int(2, 18);
    while (b === a) b = rng.int(2, 18);
    const cost = a * low + b * high;
    const answer = Q.of(cost, a + b);
    return valued(
      [
        `A shop mixes ${a} kg of tea at ${low} dollars per kg with ${b} kg of tea at ${high} dollars per kg. What is the price per kg of the mixture, in dollars? Give an exact value.`,
        `一家店把 ${a} 千克每千克 ${low} 美元的茶和 ${b} 千克每千克 ${high} 美元的茶混合。混合茶每千克多少美元？写出准确值。`,
      ],
      answer,
      [
        [
          ["Total cost", "总费用"],
          ["Add the cost of each part:", "把每部分的费用相加："],
          [`${a} \\times ${low} + ${b} \\times ${high} = ${a * low} + ${b * high} = ${cost}`],
        ],
        [
          ["Divide by the weight", "除以总重量"],
          [`The mixture weighs $${a} + ${b} = ${a + b}$ kg:`, `混合茶共 $${a} + ${b} = ${a + b}$ 千克：`],
          [`${cost} \\div ${a + b} = ${answer.toLatex()}`],
        ],
      ],
      [
        `$${answer.toLatex()} \\times ${a + b} = ${cost}$, the total cost, and the price lies between $${low}$ and $${high}$.`,
        `$${answer.toLatex()} \\times ${a + b} = ${cost}$，正是总费用，而且这个价钱在 $${low}$ 和 $${high}$ 之间。`,
      ],
      [
        [
          Q.of(low + high, 2),
          "That is the simple average of the prices; the two amounts are different.",
          "这是两个价钱的简单平均，但两部分的量不同。",
        ],
        [Q.of(cost), "That is the total cost, not the price per kg.", "这是总费用，不是每千克的价钱。"],
        [Q.of(low + high), "That adds the two prices.", "这是把两个价钱相加。"],
        [Q.of(cost, 2), "That divides the total cost by 2 instead of by the total weight.", "这是用总费用除以 2，而不是除以总重量。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "20",
        pieces: [
          { size: 4, text: "4" },
          { size: 4, text: "4" },
          { size: 4, text: "4" },
          { size: 8, text: "8", lit: true },
        ],
      },
      { pieces: [1, 2, 3, 4].map(() => ({ size: 5, text: "5", dashed: true })) },
    ],
    [
      "Three kilograms at 4 dollars and one at 8 dollars make 20 dollars, the same as four kilograms at 5 dollars.",
      "三千克每千克 4 美元加一千克 8 美元，共 20 美元，等于四千克每千克 5 美元。",
    ],
  ),
);

const wholeJobTime: KnowledgePointDef = lesson(
  "the-time-for-a-whole-job",
  ["The time for a whole job", "完成整项工作的时间"],
  [
    [
      "If part of a job takes some time, the whole job takes the time divided by the part. A painter covers $\\frac{2}{5}$ of a wall in $\\frac{1}{2}$ hour, so the whole wall takes $\\frac{1}{2} \\div \\frac{2}{5} = \\frac{1}{2} \\times \\frac{5}{2} = \\frac{5}{4}$ hours.",
      "如果完成一部分工作要用一段时间，那么完成整项工作的时间等于这段时间除以这部分工作量。油漆工 $\\frac{1}{2}$ 小时刷完墙的 $\\frac{2}{5}$，所以刷完整面墙要 $\\frac{1}{2} \\div \\frac{2}{5} = \\frac{1}{2} \\times \\frac{5}{2} = \\frac{5}{4}$ 小时。",
    ],
    [
      "The rate is $\\frac{2}{5} \\div \\frac{1}{2} = \\frac{4}{5}$ wall per hour, and $\\frac{5}{4}$ hours at that rate paint $\\frac{5}{4} \\times \\frac{4}{5} = 1$ wall.",
      "速率是每小时 $\\frac{2}{5} \\div \\frac{1}{2} = \\frac{4}{5}$ 面墙，$\\frac{5}{4}$ 小时正好刷 $\\frac{5}{4} \\times \\frac{4}{5} = 1$ 面墙。",
    ],
    [
      "The whole job must take longer than part of it; a smaller answer means the division is upside down.",
      "完成整项工作的时间一定比完成一部分长；答案更小，说明除反了。",
    ],
  ],
  (rng) => {
    const part = Q.of(rng.pick([1, 2, 3]), rng.pick([4, 5, 7]));
    const [hoursTop, hoursBottom] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 6],
      [5, 6],
    ]) as [number, number];
    const time = Q.of(hoursTop, hoursBottom);
    const answer = time.div(part);
    const rate = part.div(time);
    return valued(
      [
        `A painter covers $${part.toLatex()}$ of a wall in $${time.toLatex()}$ of an hour. At this rate, how many hours does the whole wall take?`,
        `一位油漆工 $${time.toLatex()}$ 小时刷完墙的 $${part.toLatex()}$。照这样的速度，刷完整面墙要多少小时？`,
      ],
      answer,
      [
        [
          ["Set up", "列式"],
          ["The whole wall takes the time divided by the part of the wall:", "整面墙的时间等于时间除以墙的比例："],
          [`${time.toLatex()} \\div ${part.toLatex()}`],
        ],
        [
          ["Multiply by the reciprocal", "乘倒数"],
          ["Multiply by the reciprocal of the part:", "乘这部分的倒数："],
          [`${time.toLatex()} \\times ${Q.one.div(part).toLatex()} = ${answer.toLatex()}`],
        ],
      ],
      [
        `The rate is $${part.toLatex()} \\div ${time.toLatex()} = ${rate.toLatex()}$ wall per hour, and $${answer.toLatex()} \\times ${rate.toLatex()} = 1$ whole wall.`,
        `速率是每小时 $${part.toLatex()} \\div ${time.toLatex()} = ${rate.toLatex()}$ 面墙，$${answer.toLatex()} \\times ${rate.toLatex()} = 1$ 面墙。`,
      ],
      [
        [rate, "That is the walls per hour, not the hours for one wall.", "这是每小时刷的墙数，不是刷一面墙的小时数。"],
        [part.mul(time), "That multiplies the part by the time instead of dividing.", "这是把工作量乘时间，而不是相除。"],
        [time, "That is the time for part of the wall only.", "这只是刷一部分墙的时间。"],
        [time.add(part), "That adds the time and the part.", "这是把时间和工作量相加。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "5/4",
        pieces: [
          { size: 2, text: "1/2", lit: true },
          { size: 3, text: "3/4", dashed: true },
        ],
      },
    ],
    [
      "The first 2 fifths of the wall take 1/2 hour; the other 3 fifths take 3/4 hour, so the whole wall takes 5/4 hours.",
      "墙的前五分之二用 1/2 小时；其余五分之三用 3/4 小时，所以整面墙要 5/4 小时。",
    ],
  ),
);

const sumOfIntegerRange: KnowledgePointDef = lesson(
  "the-sum-of-integers-across-zero",
  ["The sum of integers across zero", "跨过零的整数之和"],
  [
    [
      "Additive inverses cancel, and this can shorten a long sum. In a list of consecutive integers that crosses zero, each negative number pairs with its opposite to make zero, and zero adds nothing. Only the numbers on the longer side, past where the other side stops, are left. From $-3$ to $5$: $-3$ to $3$ cancel, leaving $4 + 5 = 9$.",
      "相反数相互抵消，这可以让很长的加法变短。在跨过零的连续整数中，每个负数都和它的相反数配对得零，零本身也不增加什么。只剩下较长一侧、在另一侧结束之后的那几个数。从 $-3$ 到 $5$：$-3$ 到 $3$ 相互抵消，剩下 $4 + 5 = 9$。",
    ],
    [
      "Pair the first and last: there are $9$ numbers, and each pair averages $\\frac{-3 + 5}{2} = 1$, so the sum is $9 \\times 1 = 9$.",
      "首尾配对：共有 $9$ 个数，平均每个数是 $\\frac{-3 + 5}{2} = 1$，所以和是 $9 \\times 1 = 9$。",
    ],
    ["The answer is not $0$: only the numbers with a partner cancel.", "答案不是 $0$：只有能配对的数才会抵消。"],
  ],
  (rng) => {
    const low = rng.int(3, 30);
    const extra = rng.int(1, 5);
    const positiveLonger = rng.bool();
    const a = positiveLonger ? low : low + extra;
    const b = positiveLonger ? low + extra : low;
    const left: number[] = [];
    for (let i = low + 1; i <= low + extra; i++) left.push(positiveLonger ? i : -i);
    const answer = left.reduce((sum, v) => sum + v, 0);
    const count = a + b + 1;
    const listed = left.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(" + ");
    return valued(
      [`Find the sum of all the integers from $-${a}$ to $${b}$.`, `求从 $-${a}$ 到 $${b}$ 的所有整数之和。`],
      answer,
      [
        [
          ["Cancel the pairs", "抵消配对的数"],
          [`Each number from $-${low}$ to $${low}$ cancels with its opposite:`, `从 $-${low}$ 到 $${low}$ 的每个数都和它的相反数抵消：`],
          [`-${low} + \\dots + ${low} = 0`],
        ],
        [
          ["Add what is left", "加上剩下的数"],
          [`Only the numbers past $${positiveLonger ? low : -low}$ are left:`, `只剩下 $${positiveLonger ? low : -low}$ 以外的数：`],
          [left.length === 1 ? `${answer}` : `${listed} = ${answer}`],
        ],
      ],
      [
        `Pair the first and last: $${count}$ numbers with an average of $\\frac{-${a} + ${b}}{2}$ give $${count} \\times \\frac{${b - a}}{2} = ${answer}$.`,
        `首尾配对：$${count}$ 个数，平均每个数是 $\\frac{-${a} + ${b}}{2}$，和是 $${count} \\times \\frac{${b - a}}{2} = ${answer}$。`,
      ],
      [
        [0, "Not every number has a partner; the extra ones are left.", "不是每个数都能配对；多出来的数会剩下。"],
        [-answer, "The sign is wrong: the numbers left are on the longer side.", "符号错了：剩下的数在较长的一侧。"],
        [b - a, "That adds only the two ends.", "这只是把两端的数相加。"],
        [a + b, "That is the distance between the ends, not the sum of the list.", "这是两端之间的距离，不是这列数的和。"],
        [
          answer + (positiveLonger ? low : -low),
          `That keeps $${positiveLonger ? low : -low}$, which cancels with its opposite.`,
          `这是留下了 $${positiveLonger ? low : -low}$，可它已经和相反数抵消了。`,
        ],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "9",
        pieces: [
          { size: 7, text: "0", dashed: true },
          { size: 2, text: "4+5", lit: true },
        ],
      },
    ],
    [
      "From -3 to 5: the seven numbers from -3 to 3 cancel to 0, leaving 4 + 5 = 9.",
      "从 -3 到 5：-3 到 3 这七个数抵消为 0，剩下 4 + 5 = 9。",
    ],
  ),
);

const alternatingPowers: KnowledgePointDef = lesson(
  "a-sum-of-powers-of-negative-one",
  ["A sum of powers of negative one", "负一的幂之和"],
  [
    [
      "Powers of $-1$ take turns: an odd exponent gives $-1$ and an even exponent gives $1$, because each further factor flips the sign. In a long sum, each odd power and the next even power add to $0$. So only the last exponent matters: $(-1)^{1} + (-1)^{2} + \\cdots + (-1)^{6} = 0$, but $(-1)^{1} + \\cdots + (-1)^{7} = -1$.",
      "$-1$ 的幂轮流出现：奇数指数得 $-1$，偶数指数得 $1$，因为每多一个因数符号就翻转一次。在很长的和中，每个奇次幂和下一个偶次幂加起来是 $0$。所以只看最后的指数：$(-1)^{1} + (-1)^{2} + \\cdots + (-1)^{6} = 0$，而 $(-1)^{1} + \\cdots + (-1)^{7} = -1$。",
    ],
    [
      "Count the signs: up to $(-1)^{7}$ there are $4$ odd exponents and $3$ even ones, and $-4 + 3 = -1$.",
      "数符号：到 $(-1)^{7}$ 为止有 $4$ 个奇数指数、$3$ 个偶数指数，$-4 + 3 = -1$。",
    ],
    [
      "Even powers of $-1$ are $1$, not $-1$: the terms do not all add up to a large negative number.",
      "$-1$ 的偶次幂是 $1$，不是 $-1$：这些项加起来不会是很大的负数。",
    ],
  ],
  (rng) => {
    const n = rng.int(11, 400);
    const scale = rng.int(1, 9);
    const sum = n % 2 === 0 ? 0 : -1;
    const answer = scale * sum;
    const odd = Math.ceil(n / 2);
    const even = Math.floor(n / 2);
    const inner = `(-1)^{1} + (-1)^{2} + (-1)^{3} + \\cdots + (-1)^{${n}}`;
    const expr = scale === 1 ? inner : `${scale}\\left(${inner}\\right)`;
    const times = scale === 1 ? [] : [`${scale} \\times ${sum < 0 ? "(-1)" : "0"} = ${answer}`];
    return valued(
      [`Find the value of $${expr}$.`, `求 $${expr}$ 的值。`],
      answer,
      [
        [
          ["Pair the terms", "两两配对"],
          ["Each odd power and the next even power add to zero:", "每个奇次幂和下一个偶次幂加起来是零："],
          ["(-1)^{1} + (-1)^{2} = -1 + 1 = 0"],
        ],
        n % 2 === 0
          ? [
              ["What is left", "剩下什么"],
              [`All $${n}$ terms pair up, so nothing is left:`, `$${n}$ 项全部配对，什么也不剩：`],
              [`\\frac{${n}}{2} \\times 0 = 0`, ...times],
            ]
          : [
              ["What is left", "剩下什么"],
              [
                `$${n}$ is odd, so the last term $(-1)^{${n}} = -1$ has no partner:`,
                `$${n}$ 是奇数，最后一项 $(-1)^{${n}} = -1$ 没有配对：`,
              ],
              ["0 + (-1) = -1", ...times],
            ],
      ],
      [
        `Count the signs: there are $${odd}$ odd exponents and $${even}$ even ones, and $-${odd} + ${even} = ${sum}$${scale === 1 ? "" : `; times $${scale}$ gives $${answer}$`}.`,
        `数符号：有 $${odd}$ 个奇数指数、$${even}$ 个偶数指数，$-${odd} + ${even} = ${sum}$${scale === 1 ? "" : `；乘 $${scale}$ 得 $${answer}$`}。`,
      ],
      [
        [scale, "The sign is wrong: odd powers of $-1$ are $-1$.", "符号错了：$-1$ 的奇次幂是 $-1$。"],
        n % 2 === 0
          ? [
              -scale,
              `With $${n}$ terms, an even number, every term has a partner and nothing is left.`,
              `共 $${n}$ 项，是偶数，每一项都有配对，什么也不剩。`,
            ]
          : [
              0,
              `With $${n}$ terms, an odd number, one $-1$ is left without a partner.`,
              `共 $${n}$ 项，是奇数，会剩下一个没有配对的 $-1$。`,
            ],
        [-n * scale, "That makes every term $-1$; even powers of $-1$ are $1$.", "这是把每一项都当成 $-1$；$-1$ 的偶次幂是 $1$。"],
        [n * scale, "That makes every term $1$; odd powers of $-1$ are $-1$.", "这是把每一项都当成 $1$；$-1$ 的奇次幂是 $-1$。"],
      ],
    );
  },
  tableFigure(["(-1)¹ + (-1)²", "(-1)³ + (-1)⁴"], [0, 0]),
);

const missingSignedValue: KnowledgePointDef = lesson(
  "a-missing-value-from-a-signed-mean",
  ["A missing value from a signed mean", "由带符号的平均数求缺失的值"],
  [
    [
      "A mean can be negative, and the usual reasoning still works: all the values share one total. Multiply the mean by the number of values to find the total, then subtract the known values. Five changes have a mean of $-2$, and four of them are $-4$, $3$, $-5$ and $-1$: the total is $5 \\times (-2) = -10$, the four add to $-7$, so the fifth is $-10 - (-7) = -3$.",
      "平均数可以是负数，通常的推理依然成立：所有的值共用一个总和。用平均数乘个数得到总和，再减去已知的值。五个变化的平均数是 $-2$，其中四个是 $-4$、$3$、$-5$ 和 $-1$：总和是 $5 \\times (-2) = -10$，四个之和是 $-7$，所以第五个是 $-10 - (-7) = -3$。",
    ],
    [
      "Average all five: $(-4 + 3 - 5 - 1 - 3) \\div 5 = -10 \\div 5 = -2$.",
      "五个一起求平均：$(-4 + 3 - 5 - 1 - 3) \\div 5 = -10 \\div 5 = -2$。",
    ],
    ["Subtracting a negative sum adds: $-10 - (-7)$ is $-3$, not $-17$.", "减去负的和就是加：$-10 - (-7)$ 是 $-3$，不是 $-17$。"],
  ],
  (rng) => {
    const known = [rng.int(-15, -1), rng.int(-12, 12), rng.int(-15, 3), rng.int(-9, 9)];
    const answer = rng.int(-20, 20);
    const knownSum = known.reduce((sum, v) => sum + v, 0);
    const shift = knownSum + answer;
    const adjust = ((shift % 5) + 5) % 5;
    const missing = answer - adjust;
    const total = shift - adjust;
    const mean = total / 5;
    const p = (v: number) => (v < 0 ? `(${v})` : `${v}`);
    const all = [...known, missing].map((v, i) => (i === 0 ? `${v}` : v < 0 ? `- ${-v}` : `+ ${v}`)).join(" ");
    return valued(
      [
        `On five days the temperature changes had a mean of $${mean}$ degrees. Four of the changes were $${known.join("$, $")}$. What was the fifth change, in degrees?`,
        `五天的温度变化平均是 $${mean}$ 度。其中四天的变化是 $${known.join("$、$")}$。第五天的变化是多少度？`,
      ],
      missing,
      [
        [["The total", "总和"], ["Multiply the mean by the number of values:", "用平均数乘个数："], [`5 \\times ${p(mean)} = ${total}`]],
        [
          ["Take away the known", "减去已知的"],
          [`The four known changes add to $${knownSum}$, so:`, `已知四天的和是 $${knownSum}$，所以：`],
          [`${total} - ${p(knownSum)} = ${missing}`],
        ],
      ],
      [
        `Average all five: $(${all}) \\div 5 = ${total} \\div 5 = ${mean}$.`,
        `五个一起求平均：$(${all}) \\div 5 = ${total} \\div 5 = ${mean}$。`,
      ],
      [
        [total + knownSum, "That adds the known values to the total instead of subtracting them.", "这是把已知值加到总和上，应该减去。"],
        [mean, "That is the mean, not the fifth value.", "这是平均数，不是第五个值。"],
        [-missing, "The sign is wrong.", "符号错了。"],
        [
          mean - knownSum,
          "That subtracts from the mean; subtract from the total, five times the mean.",
          "这是用平均数去减；应该用总和，也就是平均数的五倍去减。",
        ],
      ],
    );
  },
  tableFigure(["5(-2)", "-10-(-7)"], [-10, -3]),
);

const whatMustBeAdded: KnowledgePointDef = lesson(
  "what-must-be-added-to-an-expression",
  ["What must be added to an expression", "算式要加什么"],
  [
    [
      "To find what must be added to one expression to get another, subtract: the result minus the start. The subtraction applies to every term of the start, so both of its signs change. To get from $3x + 4$ to $7x - 2$, add $(7x - 2) - (3x + 4) = 7x - 2 - 3x - 4 = 4x - 6$.",
      "要求一个算式加上什么才能得到另一个，就做减法：结果减去起始算式。减法作用于起始算式的每一项，所以它的两项都要变号。从 $3x + 4$ 得到 $7x - 2$，要加 $(7x - 2) - (3x + 4) = 7x - 2 - 3x - 4 = 4x - 6$。",
    ],
    ["Add it back: $(3x + 4) + (4x - 6) = 7x - 2$, the result.", "加回去：$(3x + 4) + (4x - 6) = 7x - 2$，正是结果。"],
    [
      "Change both signs of the start: $-(3x + 4)$ is $-3x - 4$, so the constant is $-6$, not $-2 + 4 = 2$.",
      "起始算式的两项都要变号：$-(3x + 4)$ 是 $-3x - 4$，所以常数项是 $-6$，不是 $-2 + 4 = 2$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(2, 15);
    const c = a + rng.int(2, 9);
    const d = rng.int(2, 15);
    const asksCoefficient = rng.bool();
    const answer = asksCoefficient ? c - a : -d - b;
    const added = `${c - a}x - ${d + b}`;
    return valued(
      [
        `An expression is added to $${a}x + ${b}$, and the result is $${c}x - ${d}$. What is the ${asksCoefficient ? "coefficient of $x$" : "constant term"} of the added expression?`,
        `$${a}x + ${b}$ 加上一个算式，结果是 $${c}x - ${d}$。所加算式的${asksCoefficient ? " $x$ 的系数" : "常数项"}是多少？`,
      ],
      answer,
      [
        [
          ["Subtract", "做减法"],
          ["What is added is the result minus the start:", "所加的算式等于结果减去起始算式："],
          [`(${c}x - ${d}) - (${a}x + ${b})`],
        ],
        [
          ["Change the signs and combine", "变号并合并"],
          ["Both terms of the start change sign:", "起始算式的两项都变号："],
          [`${c}x - ${d} - ${a}x - ${b} = ${added}`],
        ],
      ],
      [
        `Add it back: $(${a}x + ${b}) + (${added}) = ${c}x - ${d}$, the result; the ${asksCoefficient ? "coefficient" : "constant term"} is $${answer}$.`,
        `加回去：$(${a}x + ${b}) + (${added}) = ${c}x - ${d}$，正是结果；${asksCoefficient ? "系数" : "常数项"}是 $${answer}$。`,
      ],
      asksCoefficient
        ? [
            [a + c, "That adds the coefficients; subtract the start from the result.", "这是把系数相加了；应该用结果减去起始算式。"],
            [a - c, "That subtracts the wrong way round: the result minus the start.", "这是减反了：应该是结果减去起始算式。"],
            [-d - b, "That is the constant term; the question asks for the coefficient of $x$.", "这是常数项；题目问的是 $x$ 的系数。"],
            [c, `That is the coefficient of the result; take away the starting $${a}$.`, `这是结果的系数；还要减去起始的 $${a}$。`],
          ]
        : [
            [b - d, `That adds $${b}$; the starting constant is subtracted.`, `这是加上了 $${b}$；起始的常数项要减去。`],
            [d - b, `That uses $+${d}$; the result's constant is $-${d}$.`, `这是用了 $+${d}$；结果的常数项是 $-${d}$。`],
            [c - a, "That is the coefficient of $x$; the question asks for the constant term.", "这是 $x$ 的系数；题目问的是常数项。"],
            [b + d, "The sign is wrong.", "符号错了。"],
          ],
    );
  },
  tableFigure(["7 - 3", "-2 - 4"], [4, -6]),
);

const consecutiveIntegers: KnowledgePointDef = lesson(
  "consecutive-integers-with-a-given-sum",
  ["Consecutive integers with a given sum", "和一定的连续整数"],
  [
    [
      "Consecutive integers can be written with one variable: $n$, $n + 1$, $n + 2$ and so on, and consecutive even or odd ones go up by $2$. Adding them gives a two-step equation. Look out for what the question asks for: the variable is the smallest number, and the question may want a different one. For three integers that add to $15$: $n + (n + 1) + (n + 2) = 15$, so $3n + 3 = 15$, $3n = 12$ and $n = 4$. The numbers are $4$, $5$ and $6$.",
      "连续整数可以用一个变量表示：$n$、$n + 1$、$n + 2$ 等，连续偶数或奇数每次加 $2$。把它们相加得到一个两步方程。要注意问题问的是什么：变量是最小的数，问题可能要的是另一个。三个连续整数的和是 $15$：$n + (n + 1) + (n + 2) = 15$，所以 $3n + 3 = 15$，$3n = 12$，$n = 4$。这三个数是 $4$、$5$、$6$。",
    ],
    [
      "Add them back: $4 + 5 + 6 = 15$. Also, for an odd number of them the middle one is the mean: $15 \\div 3 = 5$.",
      "加回去检验：$4 + 5 + 6 = 15$。另外，奇数个连续整数的中间数等于平均数：$15 \\div 3 = 5$。",
    ],
    [
      "$n$ is the smallest number. If the question asks for the largest, add the steps on: $n + 2 = 6$.",
      "$n$ 是最小的数。如果问的是最大的数，还要加上间隔：$n + 2 = 6$。",
    ],
  ],
  (rng) => {
    const step = rng.pick([1, 2]);
    const count = rng.pick([3, 4, 5]);
    const first = rng.int(-20, 60) * (step === 2 ? 2 : 1);
    const terms = [...Array(count).keys()].map((i) => first + i * step);
    const sum = terms.reduce((total, v) => total + v, 0);
    const asksLargest = rng.bool();
    const last = terms[count - 1] as number;
    const answer = asksLargest ? last : first;
    const nameEn = step === 1 ? "consecutive integers" : "consecutive even integers";
    const nameZh = step === 1 ? "连续整数" : "连续偶数";
    const offset = (step * count * (count - 1)) / 2;
    const spread = step * (count - 1);
    const listed = terms.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(" + ");
    const shifted = (by: number): [string, string] => [
      `Starting there moves every number ${by > 0 ? "up" : "down"} by $${step}$, and the sum becomes $${sum + by * count * step}$, not $${sum}$.`,
      `从这个数开始，每个数都${by > 0 ? "大" : "小"}了 $${step}$，和就变成 $${sum + by * count * step}$，不是 $${sum}$。`,
    ];
    return valued(
      [
        `The sum of $${count}$ ${nameEn} is $${sum}$. What is the ${asksLargest ? "largest" : "smallest"} of them?`,
        `$${count}$ 个${nameZh}的和是 $${sum}$。其中${asksLargest ? "最大" : "最小"}的数是多少？`,
      ],
      answer,
      [
        [
          ["Write the sum", "写出和"],
          [
            `Call the smallest $n$. The numbers go up by $${step}$, so together they make:`,
            `设最小的数是 $n$。这些数每次增加 $${step}$，合起来是：`,
          ],
          [`${count}n + ${offset} = ${sum}`],
        ],
        [
          ["Solve", "求解"],
          [
            `Take $${offset}$ from both sides, then divide by $${count}$${asksLargest ? `; the largest is $${spread}$ more` : ""}:`,
            `两边同时减去 $${offset}$，再除以 $${count}$${asksLargest ? `；最大的数比它大 $${spread}$` : ""}：`,
          ],
          [`${count}n = ${sum - offset}`, `n = ${first}`, ...(asksLargest ? [`n + ${spread} = ${last}`] : [])],
        ],
      ],
      [`Add them back: $${listed} = ${sum}$.`, `加回去检验：$${listed} = ${sum}$。`],
      [
        [
          asksLargest ? first : last,
          `That is the ${asksLargest ? "smallest" : "largest"} number, but the question asks for the ${asksLargest ? "largest" : "smallest"}.`,
          `这是最${asksLargest ? "小" : "大"}的数，但问题问的是最${asksLargest ? "大" : "小"}的数。`,
        ],
        [
          Math.round(sum / count),
          `That is about the mean, $${sum} \\div ${count}$, which sits in the middle of the numbers, not at the end.`,
          `这大约是平均数 $${sum} \\div ${count}$，它在这些数的中间，不在一端。`,
        ],
        [answer + step, ...shifted(1)],
        [answer - step, ...shifted(-1)],
      ],
      { form: "integer" },
    );
  },
  lineFigure({ lo: 3, hi: 7, step: 1, labels: [3, 4, 5, 6, 7], marks: [{ at: 4 }, { at: 5 }, { at: 6 }] }, [
    "A number line with the consecutive integers 4, 5 and 6 marked.",
    "一条数轴，标出了连续整数 4、5、6。",
  ]),
);

const agesEquation: KnowledgePointDef = lesson(
  "when-one-age-is-a-multiple-of-another",
  ["When one age is a multiple of another", "一个年龄何时是另一个的倍数"],
  [
    [
      "As time passes, two ages grow by the same amount, so their difference stays fixed but their ratio changes. Let $x$ be the number of years from now, and write each future age as the current age plus $x$. Setting one equal to the required multiple of the other gives an equation with the variable on both sides. A parent of $30$ and a child of $10$: when is the parent twice as old? $30 + x = 2(10 + x)$, so $30 + x = 20 + 2x$ and $x = 10$.",
      "随着时间过去，两个年龄增加同样多，所以它们的差不变，但比值会变。设 $x$ 为从现在起的年数，把每个将来的年龄写成现在的年龄加 $x$。令一个等于另一个的所要求的倍数，就得到两边都有变量的方程。家长 $30$ 岁，孩子 $10$ 岁，什么时候家长的年龄是孩子的两倍？$30 + x = 2(10 + x)$，所以 $30 + x = 20 + 2x$，$x = 10$。",
    ],
    [
      "In $10$ years the parent is $40$ and the child is $20$, and $2 \\times 20 = 40$.",
      "$10$ 年后家长 $40$ 岁，孩子 $20$ 岁，$2 \\times 20 = 40$。",
    ],
    [
      "Multiply the whole future age by the multiple: $2(10 + x)$, not $2 \\cdot 10 + x$. The child gets older too.",
      "要把整个将来的年龄乘以倍数：$2(10 + x)$，而不是 $2 \\cdot 10 + x$。孩子也在长大。",
    ],
  ],
  (rng) => {
    const multiple = rng.int(2, 4);
    const futureKid = multiple === 2 ? rng.int(20, 40) : multiple === 3 ? rng.int(10, 20) : rng.int(7, 13);
    const answer = rng.int(1, Math.min(15, futureKid - 1));
    const kid = futureKid - answer;
    const adult = multiple * futureKid - answer;
    const gap = adult - kid;
    const later = (y: number): [string, string] => [
      `In $${y}$ years the ages are $${adult + y}$ and $${kid + y}$, and $${multiple} \\times ${kid + y} = ${multiple * (kid + y)}$, not $${adult + y}$.`,
      `$${y}$ 年后两人是 $${adult + y}$ 岁和 $${kid + y}$ 岁，$${multiple} \\times ${kid + y} = ${multiple * (kid + y)}$，不是 $${adult + y}$。`,
    ];
    return valued(
      [
        `A parent is $${adult}$ years old and a child is $${kid}$. In how many years will the parent be $${multiple}$ times as old as the child?`,
        `家长 $${adult}$ 岁，孩子 $${kid}$ 岁。多少年后家长的年龄是孩子的 $${multiple}$ 倍？`,
      ],
      answer,
      [
        [
          ["Write the equation", "列方程"],
          [
            `In $x$ years the parent is $${adult} + x$ and the child is $${kid} + x$. Multiply the whole child's age by $${multiple}$:`,
            `$x$ 年后家长 $${adult} + x$ 岁，孩子 $${kid} + x$ 岁。把孩子的整个年龄乘以 $${multiple}$：`,
          ],
          [`${adult} + x = ${multiple}(${kid} + x)`, `${adult} + x = ${multiple * kid} + ${multiple}x`],
        ],
        [
          ["Solve", "求解"],
          [
            `Take $x$ and $${multiple * kid}$ from both sides${multiple === 2 ? "" : `, then divide by $${multiple - 1}$`}:`,
            `两边同时减去 $x$ 和 $${multiple * kid}$${multiple === 2 ? "" : `，再除以 $${multiple - 1}$`}：`,
          ],
          multiple === 2 ? [`x = ${answer}`] : [`${multiple - 1}x = ${adult - multiple * kid}`, `x = ${answer}`],
        ],
      ],
      [
        `In $${answer}$ years the parent is $${adult + answer}$ and the child is $${futureKid}$, and $${multiple} \\times ${futureKid} = ${adult + answer}$.`,
        `$${answer}$ 年后家长 $${adult + answer}$ 岁，孩子 $${futureKid}$ 岁，$${multiple} \\times ${futureKid} = ${adult + answer}$。`,
      ],
      [
        [
          adult - multiple * kid,
          `That is $${multiple - 1}x$, not $x$: divide it by $${multiple - 1}$.`,
          `这是 $${multiple - 1}x$ 的值，不是 $x$：还要除以 $${multiple - 1}$。`,
        ],
        [gap, `That is the age gap, which never changes. It is not the number of years.`, `这是年龄差，它永远不变，不是所求的年数。`],
        [
          Math.round(gap / multiple),
          `That divides the age gap by $${multiple}$. Write both future ages with $x$ and solve instead.`,
          `这是把年龄差除以了 $${multiple}$。应该用 $x$ 写出两人将来的年龄再求解。`,
        ],
        [futureKid, `That is the child's age then, not the number of years from now.`, `这是孩子到时候的年龄，不是从现在起的年数。`],
        [answer + 1, ...later(answer + 1)],
      ],
      { form: "integer" },
    );
  },
  tableFigure(["x", "30 + x", "10 + x"], [10, 40, 20]),
);

const addToBothForRatio: KnowledgePointDef = lesson(
  "adding-the-same-amount-to-reach-a-ratio",
  ["Adding the same amount to reach a ratio", "加同样的量以达到某个比"],
  [
    [
      "A fraction changes when the same amount is added to its top and bottom. To find the amount that gives a wanted ratio, write the new fraction with $x$ in both places, set it equal to the ratio and cross-multiply. For $\\frac{1}{4}$ to become $\\frac{1}{2}$: $\\frac{1 + x}{4 + x} = \\frac{1}{2}$, so $2(1 + x) = 4 + x$, $2 + 2x = 4 + x$ and $x = 2$.",
      "分子分母加上同样的量，分数就会变。要求加多少才得到想要的比，就把新分数的两处都写上 $x$，令它等于这个比，再交叉相乘。要让 $\\frac{1}{4}$ 变成 $\\frac{1}{2}$：$\\frac{1 + x}{4 + x} = \\frac{1}{2}$，所以 $2(1 + x) = 4 + x$，$2 + 2x = 4 + x$，$x = 2$。",
    ],
    [
      "Add it: $\\frac{1 + 2}{4 + 2} = \\frac{3}{6}$, which simplifies to $\\frac{1}{2}$.",
      "加上去：$\\frac{1 + 2}{4 + 2} = \\frac{3}{6}$，约分后正是 $\\frac{1}{2}$。",
    ],
    [
      "Adding the same amount to the top and bottom keeps their difference: it does not keep the ratio.",
      "分子分母加上同样的量，它们的差不变，但比会变。",
    ],
  ],
  (rng) => {
    const [p, q] = rng.pick([
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 5],
      [4, 5],
      [2, 5],
      [5, 6],
      [5, 7],
    ]) as [number, number];
    const k = rng.int(2, 9);
    const candidates = [...Array(p * k - 1).keys()].map((i) => i + 1).filter((x) => gcd7(p * k - x, q * k - x) === 1);
    const result = rng.pick(candidates);
    const top = p * k - result;
    const bottom = q * k - result;
    const gap = q - p;
    return valued(
      [
        `What number must be added to both the top and bottom of $\\frac{${top}}{${bottom}}$ to make it equal to $\\frac{${p}}{${q}}$?`,
        `$\\frac{${top}}{${bottom}}$ 的分子和分母都加上多少，才等于 $\\frac{${p}}{${q}}$？`,
      ],
      result,
      [
        [
          ["Write the proportion", "列比例式"],
          ["Add $x$ to the top and to the bottom:", "分子和分母都加上 $x$："],
          [`\\frac{${top} + x}{${bottom} + x} = \\frac{${p}}{${q}}`],
        ],
        [
          ["Cross-multiply and solve", "交叉相乘并求解"],
          ["Multiply each numerator by the other denominator, then collect $x$:", "每个分子乘以另一边的分母，再把 $x$ 移到一边："],
          [`${q}(${top} + x) = ${p}(${bottom} + x)`, ...(gap === 1 ? [] : [`${gap}x = ${p * bottom - q * top}`]), `x = ${result}`],
        ],
      ],
      [
        `Add it: $\\frac{${top} + ${result}}{${bottom} + ${result}} = \\frac{${p * k}}{${q * k}}$, which simplifies to $\\frac{${p}}{${q}}$.`,
        `加上去：$\\frac{${top} + ${result}}{${bottom} + ${result}} = \\frac{${p * k}}{${q * k}}$，约分后正是 $\\frac{${p}}{${q}}$。`,
      ],
      [
        [
          result + 1,
          `Add it: $\\frac{${top + result + 1}}{${bottom + result + 1}}$ does not simplify to $\\frac{${p}}{${q}}$.`,
          `加上去：$\\frac{${top + result + 1}}{${bottom + result + 1}}$ 约分后不是 $\\frac{${p}}{${q}}$。`,
        ],
        [p, "That is the top of the wanted ratio, not the amount to add.", "这是想要的比的前项，不是要加的数。"],
        [
          (q - p) * k,
          "That is the difference between the bottom and the top; adding the same amount never changes it.",
          "这是分母与分子的差；加上同样的量，这个差不会变。",
        ],
      ],
    );
  },
  tableFigure(["x", "(1 + x)/(4 + x)"], [2, 0.5]),
);

const ticketsSystem: KnowledgePointDef = {
  id: "a-system-from-a-count-and-a-cost",
  title: t("A system from a count and a cost", "由数量和费用列方程组"),
  explanation: t(
    `Problems with two kinds of item often give two facts: how many there are in all, and how much they cost in all. Each fact gives one equation. From the count, write one kind in terms of the other, and substitute this into the cost equation.

Say $10$ tickets cost $62$ dollars, adults at $8$ dollars and children at $5$. With $a$ adult tickets there are $10 - a$ child tickets, so $8a + 5(10 - a) = 62$. That is $3a + 50 = 62$, so $3a = 12$, $a = 4$, and there are $6$ child tickets. Check: $4 + 6 = 10$ and $32 + 30 = 62$.

> **Watch out.** Answer the unknown the question asks for: if it wants the child tickets, $a$ is only halfway. And multiply the whole of $10 - a$ by the child price.`,
    `有两种物品的问题常常给两个条件：一共有多少个，一共多少钱。每个条件给出一个方程。由数量，把一种用另一种表示，再代入费用方程。

比如 $10$ 张票共 $62$ 美元，成人票 $8$ 美元，儿童票 $5$ 美元。设成人票 $a$ 张，儿童票就是 $10 - a$ 张，所以 $8a + 5(10 - a) = 62$，即 $3a + 50 = 62$，$3a = 12$，$a = 4$，儿童票 $6$ 张。检验：$4 + 6 = 10$，$32 + 30 = 62$。

> **注意。** 要回答题目问的未知数：如果问的是儿童票，求出 $a$ 只完成了一半。还要用儿童票价乘整个 $10 - a$。`,
  ),
  generate(rng) {
    const adult = rng.int(6, 15);
    const child = rng.int(2, adult - 2);
    const adults = rng.int(5, 80);
    const children = rng.int(5, 80);
    const count = adults + children;
    const cost = adult * adults + child * children;
    const asksAdults = rng.bool();
    const answer = asksAdults ? adults : children;
    return numberProblem({
      prompt: t(
        `A show sold $${count}$ tickets for $${cost}$ dollars in all. Adult tickets cost $${adult}$ dollars and child tickets cost $${child}$ dollars. How many ${asksAdults ? "adult" : "child"} tickets were sold?`,
        `一场演出共卖出 $${count}$ 张票，收入 $${cost}$ 美元。成人票 $${adult}$ 美元，儿童票 $${child}$ 美元。卖出多少张${asksAdults ? "成人" : "儿童"}票？`,
      ),
      answer,
      form: "integer",
      wrong: [
        asksAdults ? children : adults,
        Math.round(cost / adult),
        Math.round(cost / child),
        answer + 1,
        answer + 2,
        Math.floor(count / 2),
      ],
      solution: t(
        `**Write the equation.** With $a$ adult tickets there are $${count} - a$ child tickets, since $${count}$ were sold in all. The cost gives $$${adult}a + ${child}(${count} - a) = ${cost}.$$

**Solve.** Multiplying out, $${adult}a + ${child * count} - ${child}a = ${cost}$, so $${adult - child === 1 ? "" : adult - child}a = ${cost} - ${child * count} = ${cost - child * count}$${adult - child === 1 ? "" : ` and $a = ${adults}$`}. There are $${adults}$ adult tickets and $${count} - ${adults} = ${children}$ child tickets, so the answer is $${answer}$.

**Check.** $${adults} + ${children} = ${count}$ tickets, and $${adult} \\cdot ${adults} + ${child} \\cdot ${children} = ${adult * adults} + ${child * children} = ${cost}$ dollars.`,
        `**列方程。** 设成人票 $a$ 张，因为一共卖出 $${count}$ 张，儿童票就是 $${count} - a$ 张。由收入得 $$${adult}a + ${child}(${count} - a) = ${cost}.$$

**求解。** 去括号得 $${adult}a + ${child * count} - ${child}a = ${cost}$，所以 $${adult - child === 1 ? "" : adult - child}a = ${cost} - ${child * count} = ${cost - child * count}$${adult - child === 1 ? "" : `，$a = ${adults}$`}。成人票 $${adults}$ 张，儿童票 $${count} - ${adults} = ${children}$ 张，所以答案是 $${answer}$。

**检验。** $${adults} + ${children} = ${count}$ 张，$${adult} \\cdot ${adults} + ${child} \\cdot ${children} = ${adult * adults} + ${child * children} = ${cost}$ 美元。`,
      ),
    });
  },
};

const compoundCount: KnowledgePointDef = lesson(
  "counting-integers-in-a-compound-inequality",
  ["Counting integers in a compound inequality", "数复合不等式中的整数"],
  [
    [
      "A compound inequality is solved by doing the same operation to all three parts. Once $x$ stands alone in the middle, the ends show which integers qualify: a strict sign leaves its end out, and an inclusive sign keeps it in. To count them, subtract the smallest qualifying integer from the largest and add one. For $1 < 2x + 1 \\le 9$: $0 < x \\le 4$, so the integers are $1$ to $4$, and $4 - 1 + 1 = 4$.",
      "解复合不等式时，对三个部分都做同样的运算。$x$ 单独留在中间后，两端就说明哪些整数符合：严格的符号不包括这一端，包含的符号则包括。要数个数，就用最大的符合条件的整数减去最小的，再加 $1$。对于 $1 < 2x + 1 \\le 9$：$0 < x \\le 4$，所以整数是 $1$ 到 $4$，共 $4 - 1 + 1 = 4$ 个。",
    ],
    ["List them: $1, 2, 3, 4$ is four integers.", "列出来：$1, 2, 3, 4$，正好四个整数。"],
    [
      "Add one after subtracting: from $1$ to $4$ there are $4$ integers, not $4 - 1 = 3$.",
      "相减后要加 $1$：从 $1$ 到 $4$ 有 $4$ 个整数，不是 $4 - 1 = 3$ 个。",
    ],
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const c = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const low = rng.int(-12, 2);
    const high = low + rng.int(3, 15);
    const lowStrict = rng.bool();
    const highStrict = rng.bool();
    const first = lowStrict ? low + 1 : low;
    const last = highStrict ? high - 1 : high;
    const answer = last - first + 1;
    const body = `${k}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
    const left = low * k + c;
    const right = high * k + c;
    const [s1, s2] = [lowStrict ? "<" : "\\le", highStrict ? "<" : "\\le"];
    const inside = high - low - 1;
    const ends = (lowStrict ? 0 : 1) + (highStrict ? 0 : 1);
    return valued(
      [
        `How many integers $x$ satisfy $${left} ${s1} ${body} ${s2} ${right}$?`,
        `有多少个整数 $x$ 满足 $${left} ${s1} ${body} ${s2} ${right}$？`,
      ],
      answer,
      [
        [
          ["Get x alone", "让 x 单独留在中间"],
          [
            `${c < 0 ? `Add $${-c}$ to` : `Subtract $${c}$ from`} all three parts, then divide them by $${k}$:`,
            `三个部分都${c < 0 ? `加上 $${-c}$` : `减去 $${c}$`}，再都除以 $${k}$：`,
          ],
          [`${low} ${s1} x ${s2} ${high}`],
        ],
        [
          ["Count", "数一数"],
          [`The integers run from $${first}$ to $${last}$:`, `整数从 $${first}$ 到 $${last}$：`],
          [`${last} - ${first < 0 ? `(${first})` : first} + 1 = ${answer}`],
        ],
      ],
      [
        `Count another way: $${inside}$ integers lie strictly between $${low}$ and $${high}$, and ${ends === 0 ? "neither end counts" : ends === 1 ? "one end counts" : "both ends count"}, so $${inside} + ${ends} = ${answer}$.`,
        `换个方法数：严格在 $${low}$ 和 $${high}$ 之间的整数有 $${inside}$ 个，${ends === 0 ? "两端都不算" : ends === 1 ? "有一端算" : "两端都算"}，所以共 $${inside} + ${ends} = ${answer}$ 个。`,
      ],
      [
        [
          high - low,
          "That subtracts the ends without adding one, and does not look at which ends count.",
          "这是把两端相减却没有加 $1$，也没有看哪一端算。",
        ],
        [high - low + 1, "That counts both ends, but a strict sign leaves its end out.", "这是两端都算了，但严格的符号不包括这一端。"],
        [
          high - low - 1,
          "That leaves both ends out, but an inclusive sign keeps its end in.",
          "这是两端都不算，但包含的符号要包括这一端。",
        ],
        [
          right - left,
          `That counts between the outer numbers before dividing by $${k}$.`,
          `这是在除以 $${k}$ 之前就用外面的两个数来数了。`,
        ],
      ],
    );
  },
  lineFigure({ lo: -1, hi: 5, step: 1, labels: [-1, 0, 1, 2, 3, 4, 5], marks: [{ at: 1 }, { at: 2 }, { at: 3 }, { at: 4 }] }, [
    "A number line with the integers 1, 2, 3 and 4 marked.",
    "一条数轴，标出了整数 1、2、3、4。",
  ]),
);

const anglesInRatio: KnowledgePointDef = lesson(
  "triangle-angles-in-a-ratio",
  ["Triangle angles in a ratio", "三角形的角成比例"],
  [
    [
      "When the angles of a triangle are in a given ratio, write them as multiples of one unknown. As the three angles add up to $180$ degrees, the sum of the ratio numbers tells how many equal parts make $180$. Divide to find one part, and multiply to get the angle that is asked for. For $1:2:3$ there are $6$ parts, one part is $180 \\div 6 = 30^\\circ$, and the angles are $30^\\circ$, $60^\\circ$ and $90^\\circ$.",
      "当三角形的角成给定的比时，就把它们写成一个未知数的倍数。由于三个角加起来是 $180$ 度，比中各数的和说明 $180$ 度被分成多少等份。做除法得到一份，再相乘得到所求的角。比是 $1:2:3$ 时共 $6$ 份，一份是 $180 \\div 6 = 30^\\circ$，三个角是 $30^\\circ$、$60^\\circ$、$90^\\circ$。",
    ],
    [
      "Add them back: $30 + 60 + 90 = 180$, and $30:60:90$ simplifies to $1:2:3$.",
      "加回去检验：$30 + 60 + 90 = 180$，$30:60:90$ 化简后正是 $1:2:3$。",
    ],
    [
      "The ratio numbers are parts, not degrees: the largest angle is $3$ parts, $3 \\times 30 = 90^\\circ$, not $3^\\circ$.",
      "比中的数是份数，不是度数：最大的角占 $3$ 份，是 $3 \\times 30 = 90^\\circ$，不是 $3^\\circ$。",
    ],
  ],
  (rng) => {
    const [a, b, c] = rng.pick([
      [1, 2, 3],
      [2, 3, 4],
      [1, 1, 2],
      [1, 2, 2],
      [2, 3, 5],
      [1, 3, 5],
      [3, 4, 5],
      [1, 4, 5],
      [2, 7, 9],
      [4, 5, 6],
      [2, 2, 5],
      [1, 5, 6],
      [3, 5, 10],
      [5, 6, 7],
      [1, 3, 8],
      [5, 7, 8],
    ]) as [number, number, number];
    const parts = a + b + c;
    const unit = 180 / parts;
    const smallest = rng.bool();
    const n = smallest ? a : c;
    const answer = n * unit;
    const [en, zh] = smallest ? ["smallest", "最小"] : ["largest", "最大"];
    return valued(
      [
        `The angles of a triangle are in the ratio $${a}:${b}:${c}$. What is the ${en} angle, in degrees?`,
        `三角形三个角的比是 $${a}:${b}:${c}$。${zh}的角是多少度？`,
      ],
      answer,
      [
        [
          ["Find one part", "求一份"],
          [
            `The ratio has $${parts}$ parts in all, and together they make $180^\\circ$:`,
            `比中一共有 $${parts}$ 份，合起来是 $180^\\circ$：`,
          ],
          [`${a} + ${b} + ${c} = ${parts}`, `180 \\div ${parts} = ${unit}`],
        ],
        [
          ["Take the parts asked for", "求所问的角"],
          [`The ${en} angle is $${n}$ parts:`, `${zh}的角占 $${n}$ 份：`],
          [`${n} \\times ${unit} = ${answer}`],
        ],
      ],
      [
        `The angles are $${a * unit}^\\circ$, $${b * unit}^\\circ$ and $${c * unit}^\\circ$, and $${a * unit} + ${b * unit} + ${c * unit} = 180$.`,
        `三个角是 $${a * unit}^\\circ$、$${b * unit}^\\circ$、$${c * unit}^\\circ$，$${a * unit} + ${b * unit} + ${c * unit} = 180$。`,
      ],
      [
        [
          smallest ? c * unit : a * unit,
          `That is the ${smallest ? "largest" : "smallest"} angle.`,
          `这是${smallest ? "最大" : "最小"}的角。`,
        ],
        [unit, `That is one part. The ${en} angle is $${n}$ parts.`, `这是一份。${zh}的角占 $${n}$ 份。`],
        [n, "That is the ratio number, not degrees: multiply it by one part.", "这是比中的份数，不是度数：要乘以一份的度数。"],
        [answer + unit, `That takes one part too many: the ${en} angle is $${n}$ parts.`, `这是多算了一份：${zh}的角占 $${n}$ 份。`],
      ],
      { form: "integer" },
    );
  },
  drawn(gradeDrawings4["angles-of-a-triangle#triangle-angles-in-a-ratio"]),
);

const bisectorsOfNeighbors: KnowledgePointDef = {
  id: "the-angle-between-two-bisectors",
  figure: gradeDrawings4["angle-bisectors#the-angle-between-two-bisectors"],
  title: t("The angle between two bisectors", "两条角平分线的夹角"),
  explanation: t(
    "When two angles share a side and each is bisected, the angle between the two bisectors is made of one half from each angle. So it is half of the two angles together, and the separate sizes do not matter. If the two angles form a straight line, the bisectors are always at a right angle, which is a neat result. The same reasoning works for any pair of adjacent angles, and a sketch with the halves marked makes it clear.",
    "两个角有公共边，分别作平分线时，两条平分线的夹角由两个角的各一半组成。所以它是两个角之和的一半，与各自的大小无关。如果两个角组成一条直线，两条平分线总是成直角，这是个很漂亮的结论。同样的推理适用于任何一对相邻的角，画一个标出一半的草图就很清楚。",
  ),
  generate(rng) {
    const a = 2 * rng.int(10, 60);
    const b = 2 * rng.int(10, 60);
    const answer = (a + b) / 2;
    return numberProblem({
      prompt: t(
        `Two adjacent angles measure $${a}^\\circ$ and $${b}^\\circ$, and each one is bisected. What is the angle between the two bisectors, in degrees?`,
        `两个相邻的角分别是 $${a}^\\circ$ 和 $${b}^\\circ$，各作一条角平分线。两条平分线的夹角是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [a + b, Math.abs(a - b) / 2, a / 2, b / 2, answer + 10],
      solution: t(
        `The angle is made of half of each one: $${a / 2}^\\circ + ${b / 2}^\\circ = ${answer}^\\circ$.`,
        `这个角由两个角的各一半组成：$${a / 2}^\\circ + ${b / 2}^\\circ = ${answer}^\\circ$。`,
      ),
    });
  },
};

const clockAtAnyTime: KnowledgePointDef = {
  id: "clock-angles-between-the-hours",
  figure: gradeDrawings4["solving-problems-with-angles#clock-angles-between-the-hours"],
  title: t("Clock angles between the hours", "非整点时的钟面夹角"),
  explanation: t(
    "On a clock, the minute hand turns $6$ degrees each minute, and the hour hand turns only half a degree each minute. So between the hours, the hour hand lies part of the way from one mark to the next, and forgetting this is the usual mistake. Measure both hands from $12$, subtract, and if the result is more than $180$ degrees, subtract it from $360$ to get the smaller of the two angles.",
    "钟面上，分针每分钟转 $6$ 度，时针每分钟只转半度。所以在两个整点之间，时针位于两个刻度之间的某处，忘记这一点是常见的差错。从 $12$ 开始分别量两针的角度，相减，如果结果大于 $180$ 度，就用 $360$ 减去它，得到两个角中较小的一个。",
  ),
  generate(rng) {
    const hour = rng.int(1, 12);
    const minute = 10 * rng.int(1, 5);
    const hourAngle = (hour % 12) * 30 + minute / 2;
    const minuteAngle = minute * 6;
    const gap = Math.abs(hourAngle - minuteAngle);
    const answer = Math.min(gap, 360 - gap);
    return numberProblem({
      prompt: t(
        `What is the smaller angle between the hands of a clock at $${hour}:${minute}$, in degrees?`,
        `$${hour}:${minute}$ 时，钟面上两针所成的较小的角是多少度？`,
      ),
      answer,
      form: "integer",
      wrong: [
        Math.min(Math.abs((hour % 12) * 30 - minuteAngle), 360 - Math.abs((hour % 12) * 30 - minuteAngle)),
        360 - answer,
        answer + 5,
        answer + 30,
        minuteAngle,
      ],
      solution: t(
        `From 12, the minute hand is at $${minute} \\times 6^\\circ = ${minuteAngle}^\\circ$, and the hour hand is at $${hourAngle}^\\circ$. They differ by $${gap}^\\circ$${gap > 180 ? `, and the smaller angle is $360^\\circ - ${gap}^\\circ = ${answer}^\\circ$` : ""}.`,
        `从 12 算起，分针在 $${minute} \\times 6^\\circ = ${minuteAngle}^\\circ$，时针在 $${hourAngle}^\\circ$。两者相差 $${gap}^\\circ$${gap > 180 ? `，较小的角是 $360^\\circ - ${gap}^\\circ = ${answer}^\\circ$` : ""}。`,
      ),
    });
  },
};

const midpointsOfParts: KnowledgePointDef = {
  id: "the-gap-between-two-midpoints",
  title: t("The gap between two midpoints", "两个中点之间的距离"),
  explanation: t(
    "Let a segment be split into two parts by a point, and mark the midpoint of each part. The distance between those midpoints is made of half of one part and half of the other. So it equals half of the whole segment, however the point divides it. The segment addition postulate gives this directly, and a labeled sketch with each half marked shows it clearly. No separate lengths are needed to find the result.",
    "一个点把线段分成两部分，再标出每部分的中点。这两个中点之间的距离，由一部分的一半和另一部分的一半组成。所以不管这个点怎样分，它都等于整条线段的一半。线段相加公理直接给出这个结果，画一个标出各半段的草图就看得很清楚。不需要各段的长度就能求出结果。",
  ),
  generate(rng) {
    const whole = 2 * rng.int(6, 60);
    const part = rng.int(2, whole - 2);
    const answer = whole / 2;
    return numberProblem({
      prompt: t(
        `Point $B$ lies on segment $AC$, with $AB = ${part}$ and $AC = ${whole}$. Point $M$ is the midpoint of $AB$, and $N$ is the midpoint of $BC$. What is $MN$?`,
        `点 $B$ 在线段 $AC$ 上，$AB = ${part}$，$AC = ${whole}$。点 $M$ 是 $AB$ 的中点，$N$ 是 $BC$ 的中点。$MN$ 是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [whole, Math.round(part / 2), whole - part, Math.round(Math.abs(whole - 2 * part) / 2), answer + 1],
      solution: t(
        `We have $MB = ${part / 2}$ and $BN = ${(whole - part) / 2}$. So $MN$ is half of $AB$ plus half of $BC$, which is half of $AC$: $${answer}$.`,
        `$MB = ${part / 2}$，$BN = ${(whole - part) / 2}$。所以 $MN$ 是 $AB$ 的一半加 $BC$ 的一半，也就是 $AC$ 的一半：$${answer}$。`,
      ),
    });
  },
};

const areaWithPercentSides: KnowledgePointDef = {
  id: "the-area-after-percent-changes-to-the-sides",
  figure: gradeDrawings4["area-of-rectangles-and-squares#the-area-after-percent-changes-to-the-sides"],
  title: t("The area after percent changes to the sides", "边按百分比变化后的面积"),
  explanation: t(
    "Area is a product of two lengths, and so changes in the sides combine by multiplying and not by adding. Raising the length by one percent and lowering the width by another does not change the area by the difference of the two. Write each change as a multiplier, multiply the two, and read the overall change. Choosing a simple rectangle, such as one with sides of $100$ and $100$, is a good way to confirm the answer.",
    "面积是两个长度的积，所以边的变化是相乘，不是相加。把长增加一个百分数、宽减少另一个百分数，面积的变化并不等于这两个百分数的差。把每个变化写成乘数，相乘，再读出总的变化。选一个简单的长方形，比如边长都是 $100$，可以用来确认答案。",
  ),
  generate(rng) {
    const up = 10 * rng.int(1, 6);
    const down = 10 * rng.int(1, 5);
    const factor = (100 + up) * (100 - down);
    const area = 100 * rng.int(2, 40);
    const answer = (area * factor) / 10000;
    return numberProblem({
      prompt: t(
        `A rectangle has an area of $${area}$ square centimeters. Its length is increased by $${up}\\%$ and its width is decreased by $${down}\\%$. What is the new area, in square centimeters?`,
        `一个长方形的面积是 $${area}$ 平方厘米。长增加 $${up}\\%$，宽减少 $${down}\\%$。新的面积是多少平方厘米？`,
      ),
      answer,
      wrong: [(area * (100 + up - down)) / 100, area, (area * (100 + up)) / 100, (area * (100 - down)) / 100, answer + 10],
      solution: t(
        `The area is multiplied by $${(100 + up) / 100} \\times ${(100 - down) / 100} = ${factor / 10000}$. So the new area is $${area} \\times ${factor / 10000} = ${answer}$.`,
        `面积乘以 $${(100 + up) / 100} \\times ${(100 - down) / 100} = ${factor / 10000}$。所以新的面积是 $${area} \\times ${factor / 10000} = ${answer}$。`,
      ),
    });
  },
};

const cubesInARow: KnowledgePointDef = {
  id: "the-surface-of-cubes-in-a-row",
  title: t("The surface of cubes in a row", "排成一行的立方体的表面积"),
  explanation: t(
    "When solids are glued together, the faces that touch are no longer on the outside. Each join removes two faces, one from each solid. So the surface area of a row of cubes is less than the sum of the separate surfaces. Count the faces that remain: 4 faces along the row for each cube, plus 2 faces at the ends. Multiply this count by the area of one face to get the total surface area.",
    "几个立体粘在一起时，相接触的面就不在外面了。每个接合处减少两个面，每个立体各一个。所以一排立方体的表面积小于各自表面积的和。数一数剩下的面：每个立方体沿着这排有 4 个面，两端再加 2 个面。用这个数乘以一个面的面积，就得到总表面积。",
  ),
  generate(rng) {
    const n = rng.int(2, 15);
    const s = rng.int(1, 9);
    const faces = 4 * n + 2;
    const answer = faces * s * s;
    return numberProblem({
      prompt: t(
        `${n} cubes with edges of ${s} cm are glued face to face in a straight row. What is the surface area of the solid, in square centimeters?`,
        `${n} 个棱长 ${s} 厘米的立方体面对面粘成一排。这个立体的表面积是多少平方厘米？`,
      ),
      answer,
      form: "integer",
      wrong: [6 * n * s * s, (6 * n - 2) * s * s, n * s * s * s, 4 * n * s * s, answer + s * s],
      solution: t(
        `${n} cubes have ${6 * n} faces, and the ${n - 1} ${n === 2 ? "join removes" : "joins remove"} ${2 * (n - 1)} of them, which leaves ${faces}. Each face is ${s * s} square cm, so the total is ${answer}.`,
        `${n} 个立方体有 ${6 * n} 个面，${n - 1} 个接合处减少 ${2 * (n - 1)} 个面，剩下 ${faces} 个。每个面 ${s * s} 平方厘米，总共 ${answer}。`,
      ),
    });
  },
};

const combinedMean: KnowledgePointDef = {
  id: "the-mean-of-two-groups-together",
  title: t("The mean of two groups together", "两组合并后的平均数"),
  explanation: t(
    "To combine two groups, the two means cannot simply be averaged, unless the groups have equal size. A mean times its count gives the total for that group. Add the two totals, and then divide by the total number of members. The combined mean always lies between the two group means and closer to that of the larger group. This also shows why a small group with an extreme mean does not move the overall mean very much.",
    "合并两组时，除非两组人数相同，否则不能简单地对两个平均数求平均。平均数乘以个数得到这组的总和。把两个总和相加，再除以总人数。合并后的平均数总在两组平均数之间，并且更接近人数较多的一组。这也说明了为什么平均数极端的小组不会使总平均数变动太多。",
  ),
  generate(rng) {
    const a = rng.int(5, 30);
    const b = rng.int(5, 30);
    const meanA = rng.int(50, 95);
    const meanB = rng.pick([...Array(46).keys()].map((i) => 50 + i).filter((v) => v !== meanA));
    const total = a * meanA + b * meanB;
    const answer = Q.of(total, a + b);
    return numberProblem({
      prompt: t(
        `A class of $${a}$ students has a mean score of $${meanA}$, and a class of $${b}$ students has a mean score of $${meanB}$. What is the mean score of all the students together? Give an exact value.`,
        `一个 $${a}$ 人的班平均分是 $${meanA}$，一个 $${b}$ 人的班平均分是 $${meanB}$。所有学生的平均分是多少？写出准确值。`,
      ),
      answer,
      wrong: [Q.of(meanA + meanB, 2), Q.of(total), Q.of(meanA + meanB), answer.add(Q.of(1)), Q.of(total, 2)],
      solution: t(
        `The totals are $${a} \\times ${meanA} = ${a * meanA}$ and $${b} \\times ${meanB} = ${b * meanB}$. Together, $${total} \\div ${a + b} = ${answer.toLatex()}$.`,
        `两个总和是 $${a} \\times ${meanA} = ${a * meanA}$ 和 $${b} \\times ${meanB} = ${b * meanB}$。合起来 $${total} \\div ${a + b} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const addToReachProbability: KnowledgePointDef = {
  id: "adding-items-to-reach-a-probability",
  title: t("Adding items to reach a probability", "加入物品以达到某个概率"),
  explanation: t(
    "A probability from a bag is the number of favorable items over the total, and adding favorable items changes both of these numbers. Write the new probability with an unknown in both the top and the bottom, set it equal to the target, and solve. A common slip is to leave the total as it was. The answer can be checked by forming the new fraction and simplifying it to see if the target appears.\n\nFor example, a bag of $2$ red and $6$ blue balls needs red to be $\\frac{1}{2}$: the $6$ blue balls must be half, so the total is $12$ and there are $6$ red, which means adding $4$. Indeed $\\frac{6}{12} = \\frac{1}{2}$.\n\n> **Watch out.** Adding red balls makes the total grow too. Solving $\\frac{2 + x}{8} = \\frac{1}{2}$, with the old total, gives $x = 2$, and then red is only $\\frac{4}{10}$.",
    "从袋子里摸的概率，是有利的物品数除以总数，加入有利的物品后，这两个数都会变。把新的概率写成分子分母都含未知数的形式，令它等于目标，再求解。常见的差错是总数没有变。把新的分数写出来再化简，看是否得到目标，就能检验答案。\n\n例如，袋子里有 $2$ 个红球和 $6$ 个蓝球，要使红球的概率为 $\\frac{1}{2}$：$6$ 个蓝球必须占一半，所以总数是 $12$，红球 $6$ 个，要加 $4$ 个。确实 $\\frac{6}{12} = \\frac{1}{2}$。\n\n> **注意。** 加入红球后总数也会变大。用原来的总数解 $\\frac{2 + x}{8} = \\frac{1}{2}$ 得 $x = 2$，这时红球的概率只有 $\\frac{4}{10}$。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 5],
      [2, 5],
      [4, 5],
      [1, 3],
      [5, 6],
    ]) as [number, number];
    const others = (q - p) * rng.int(2, 9);
    const finalRed = (others * p) / (q - p);
    const answer = rng.int(1, Math.max(1, finalRed - 1));
    const red = finalRed - answer;
    return numberProblem({
      prompt: t(
        `A bag has ${red} red ${red === 1 ? "ball" : "balls"} and ${others} blue balls. How many red balls must be added so that the probability of drawing a red ball is $\\frac{${p}}{${q}}$?`,
        `袋子里有 ${red} 个红球和 ${others} 个蓝球。要加入多少个红球，摸到红球的概率才是 $\\frac{${p}}{${q}}$？`,
      ),
      answer,
      form: "integer",
      wrong: [finalRed, Math.max(1, Math.round(((red + others) * p) / q - red)), answer + 1, answer + others, answer + 2, answer + 3],
      solution: t(
        `**Step 1: use the balls that do not change.** The blue balls stay at ${others}, and once red is $\\frac{${p}}{${q}}$ of the bag, blue must be $\\frac{${q - p}}{${q}}$ of it. So the new total is $${others} \\div \\frac{${q - p}}{${q}} = ${others + finalRed}$.\n\n**Step 2: find the red balls to add.** The new bag holds $${others + finalRed} - ${others} = ${finalRed}$ red balls, and there ${red === 1 ? "is" : "are"} ${red} now, so add $${finalRed} - ${red} = ${answer}$.\n\n**Check.** The new probability is $\\frac{${red} + ${answer}}{${red + others} + ${answer}} = \\frac{${finalRed}}{${others + finalRed}} = \\frac{${p}}{${q}}$, the target.`,
        `**第一步：利用不变的球。** 蓝球还是 ${others} 个；红球占 $\\frac{${p}}{${q}}$ 时，蓝球必须占 $\\frac{${q - p}}{${q}}$。所以新的总数是 $${others} \\div \\frac{${q - p}}{${q}} = ${others + finalRed}$。\n\n**第二步：求要加的红球。** 新袋子里有 $${others + finalRed} - ${others} = ${finalRed}$ 个红球，现在有 ${red} 个，所以要加 $${finalRed} - ${red} = ${answer}$ 个。\n\n**检验。** 新的概率是 $\\frac{${red} + ${answer}}{${red + others} + ${answer}} = \\frac{${finalRed}}{${others + finalRed}} = \\frac{${p}}{${q}}$，正是目标。`,
      ),
    });
  },
};

/** deeperGrade7Points maps topics of 7th Grade Math to further knowledge points. */
export const deeperGrade7Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "applying-percentages-in-succession": [upThenDownSame],
  "interpreting-percentage-change": [returningPercent],
  "finding-original-values-from-percentage-decreases": [originalFromTwoChanges],
  "working-with-unit-prices": [averagePrice],
  "solving-unit-rate-problems-using-ratios-of-fractions": [wholeJobTime],
  "additive-inverses-of-numbers": [sumOfIntegerRange],
  "exponents-with-rational-bases": [alternatingPowers],
  "solving-problems-using-the-four-operations-on-rational-numbers": [missingSignedValue],
  "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted": [whatMustBeAdded],
  "two-step-equations": [consecutiveIntegers],
  "equations-with-variables-on-both-sides": [agesEquation],
  "solving-linear-equations-using-cross-multiplication": [addToBothForRatio],
  "solving-systems-by-substitution": [ticketsSystem],
  "compound-inequalities": [compoundCount],
  "angles-of-a-triangle": [anglesInRatio],
  "angle-bisectors": [bisectorsOfNeighbors],
  "solving-problems-with-angles": [clockAtAnyTime],
  "the-segment-addition-postulate": [midpointsOfParts],
  "area-of-rectangles-and-squares": [areaWithPercentSides],
  "surface-areas-of-combined-rectangular-prisms": [cubesInARow],
  "comparing-means": [combinedMean],
  "the-likelihood-of-an-event": [addToReachProbability],
};
