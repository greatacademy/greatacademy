// A third knowledge point for the school topics on rates, signed numbers, exponents, roots and expressions,
// shared by Prealgebra and 7th and 8th Grade Math: the missing number, the reverse question and the usual traps.

import type { KnowledgePointDef } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { mixedLatex } from "../problems.ts";

import { chooseMath, tableFigure } from "./early-grades-more-kit.ts";
import { chosenMath, lesson, valued } from "./grade-6-kit.ts";
import {
  aLongSumOfPowers,
  aNegativePowerTurnsTheFractionOver,
  theExponentInsideTheParentheses,
  theMissingExponentInAQuotient,
  theNegativeExponentThatFits,
  thePowerThatDoesNotMatch,
} from "./grade-8-exponents.ts";
import { theMissingDigitForDivisibilityBy4, theNumberFromItsPrimeFactors } from "./grade-8-number-theory.ts";
import {
  countingTheSurds,
  sumsOfCubeRoots,
  theMissingNumberInAQuotientOfRoots,
  theMissingNumberUnderARoot,
  theRootOfANegativeSquared,
  theRootOfASum,
} from "./grade-8-radicals.ts";
import {
  aDifferenceBelowOne,
  aSumAsADecimal,
  matchingThePowersFirst,
  theGreatestOfFourInScientificNotation,
  thePowerAfterTidyingTheProduct,
  whenTheSmallerHardlyMatters,
  zerosAtTheEnd,
} from "./grade-8-scientific-notation.ts";
import { frac, gcd, integer, signed, skill, tenths } from "./third-kit.ts";
import { areaGridFigure, lineFigure, stripsFigure, tapeFigure } from "./upper-grades-kit.ts";

/** deeperMiddleSchoolThirdPoints holds these third knowledge points, by topic. */
export const deeperMiddleSchoolThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "unit-rates-associated-with-ratios-of-fractions": [
    lesson(
      "the-rate-the-other-way",
      ["The rate the other way", "反过来的比率"],
      [
        [
          "Every ratio gives two unit rates, one for each order. Hours per mile is time divided by distance, the reciprocal of miles per hour. A hiker walks $\\frac{1}{2}$ mile in $\\frac{1}{4}$ hour: that is $2$ miles per hour, or $\\frac{1}{4} \\div \\frac{1}{2} = \\frac{1}{2}$ hour per mile.",
          "每个比都有两个单位率，对应两种顺序。每英里的小时数是时间除以路程，是每小时英里数的倒数。徒步者 $\\frac{1}{4}$ 小时走 $\\frac{1}{2}$ 英里：每小时 $2$ 英里，也就是每英里 $\\frac{1}{4} \\div \\frac{1}{2} = \\frac{1}{2}$ 小时。",
        ],
        [
          "$\\frac{1}{2}$ hour per mile and $2$ miles per hour multiply to $1$, as reciprocals must.",
          "每英里 $\\frac{1}{2}$ 小时与每小时 $2$ 英里相乘得 $1$，互为倒数。",
        ],
        ["The question decides the order: for hours per mile, the hours go on top.", "由问题决定顺序：求每英里的小时数，小时数作被除数。"],
      ],
      (rng) => {
        const [a, b] = rng.pick<[number, number]>([
          [1, 2],
          [2, 3],
          [3, 4],
          [3, 5],
          [4, 5],
          [5, 6],
          [3, 8],
          [5, 8],
          [7, 8],
          [2, 5],
        ]);
        const [c, d] = rng.pick<[number, number]>([
          [1, 3],
          [1, 4],
          [2, 5],
          [3, 7],
          [1, 6],
          [2, 7],
          [4, 9],
          [5, 9],
          [3, 10],
        ]);
        const dist = Q.of(a, b);
        const time = Q.of(c, d);
        const answer = time.div(dist);
        return valued(
          [
            `A hiker walks $${frac(a, b)}$ mile in $${frac(c, d)}$ hour. How many hours does the hiker take per mile?`,
            `一名徒步者 $${frac(c, d)}$ 小时走 $${frac(a, b)}$ 英里。每英里要用多少小时？`,
          ],
          answer,
          [
            [
              ["Set up", "列式"],
              ["Hours per mile is the hours divided by the miles:", "每英里的小时数等于小时数除以英里数："],
              [`${frac(c, d)} \\div ${frac(a, b)}`],
            ],
            [
              ["Multiply by the reciprocal", "乘倒数"],
              ["Multiply by the reciprocal of the miles:", "乘英里数的倒数："],
              [`${frac(c, d)} \\times ${frac(b, a)} = ${answer.toLatex()}`],
            ],
          ],
          [
            `Miles per hour is $${frac(a, b)} \\div ${frac(c, d)} = ${dist.div(time).toLatex()}$, and $${answer.toLatex()} \\times ${dist.div(time).toLatex()} = 1$, so the two rates are reciprocals.`,
            `每小时英里数是 $${frac(a, b)} \\div ${frac(c, d)} = ${dist.div(time).toLatex()}$，而 $${answer.toLatex()} \\times ${dist.div(time).toLatex()} = 1$，两个比率互为倒数。`,
          ],
          [
            [dist.div(time), "That is miles per hour, the rate the other way.", "这是每小时的英里数，是反过来的比率。"],
            [dist.mul(time), "That multiplies the distance by the time instead of dividing.", "这是路程乘时间，而不是相除。"],
            [time, "That is the time for the whole walk, not for one mile.", "这是走完全程的时间，不是每英里的时间。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "1/2",
            pieces: [
              { size: 1, text: "1/4", lit: true },
              { size: 1, text: "1/4" },
            ],
          },
        ],
        [
          "A quarter hour covers half a mile, so a whole mile takes two quarter hours, 1/2 hour.",
          "四分之一小时走半英里，所以一整英里要两个四分之一小时，即 1/2 小时。",
        ],
      ),
    ),
  ],

  "understanding-proportional-relationships-from-descriptions": [
    lesson(
      "predicting-from-one-pair",
      ["Predicting from one pair", "由一组数预测"],
      [
        [
          "One pair of values fixes a proportional relationship, because $k$ is their quotient. Multiply any other $x$ by $k$ to get its $y$. If $y = 12$ when $x = 4$, then $k = 12 \\div 4 = 3$, and $x = 10$ gives $y = 3 \\times 10 = 30$.",
          "一组数就能确定正比例关系，因为 $k$ 就是它们的商。用 $k$ 乘任何别的 $x$，就得到对应的 $y$。如果 $x = 4$ 时 $y = 12$，那么 $k = 12 \\div 4 = 3$，$x = 10$ 时 $y = 3 \\times 10 = 30$。",
        ],
        [
          "$10$ is $\\frac{10}{4} = 2.5$ times $4$, and $2.5 \\times 12 = 30$.",
          "$10$ 是 $4$ 的 $\\frac{10}{4} = 2.5$ 倍，$2.5 \\times 12 = 30$。",
        ],
        [
          "Adding the same amount to $x$ and $y$ is not proportional: $y$ must grow $k$ times as fast.",
          "给 $x$ 和 $y$ 加同样的数不是正比例：$y$ 必须以 $k$ 倍的速度增加。",
        ],
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const x = rng.int(2, 12);
        let z = rng.int(2, 30);
        if (z === x) z += 1;
        const factor = Q.of(z, x);
        return valued(
          [
            `$y$ is proportional to $x$, and $y = ${k * x}$ when $x = ${x}$. What is $y$ when $x = ${z}$?`,
            `$y$ 与 $x$ 成正比例，当 $x = ${x}$ 时 $y = ${k * x}$。当 $x = ${z}$ 时 $y$ 是多少？`,
          ],
          k * z,
          [
            [["Find k", "求 k"], ["Divide the given $y$ by its $x$:", "用给出的 $y$ 除以对应的 $x$："], [`k = ${k * x} \\div ${x} = ${k}`]],
            [["Multiply", "相乘"], [`Multiply $x = ${z}$ by $k$:`, `用 $k$ 乘 $x = ${z}$：`], [`y = ${k} \\times ${z} = ${k * z}`]],
          ],
          [
            `$${z}$ is $${factor.toLatex()}$ times $${x}$, and $${factor.toLatex()} \\times ${k * x} = ${k * z}$.`,
            `$${z}$ 是 $${x}$ 的 $${factor.toLatex()}$ 倍，$${factor.toLatex()} \\times ${k * x} = ${k * z}$。`,
          ],
          [
            [
              k * x + Math.abs(z - x),
              "That adds the change in $x$ to $y$; $y$ must change $k$ times as much.",
              "这是把 $x$ 的变化量加到 $y$ 上；$y$ 的变化量必须是它的 $k$ 倍。",
            ],
            [k + z, "That adds $k$ to $x$ instead of multiplying.", "这是 $k$ 加 $x$，而不是相乘。"],
            [
              k * x * z,
              "That multiplies the given $y$ by the new $x$ without dividing by the old $x$.",
              "这是用给出的 $y$ 乘新的 $x$，却没有除以原来的 $x$。",
            ],
          ],
        );
      },
      tableFigure(["4", "10"], [12, 30]),
    ),
  ],

  "applying-percentage-increases": [
    lesson(
      "the-price-before-the-increase",
      ["The price before the increase", "涨价前的价格"],
      [
        [
          "After an increase, the new price is more than $100\\%$ of the old one. So the old price comes from dividing by the multiplier. A bike costs $\\$300$ after a $25\\%$ rise: it is $125\\%$ of the old price, so the old price is $300 \\div 1.25 = \\$240$.",
          "涨价后，新价是原价的百分之一百多。所以原价要用新价除以倍数。一辆自行车涨价 $25\\%$ 后售价 $\\$300$：它是原价的 $125\\%$，所以原价是 $300 \\div 1.25 = \\$240$。",
        ],
        ["$25\\%$ of $240$ is $60$, and $240 + 60 = 300$.", "$240$ 的 $25\\%$ 是 $60$，$240 + 60 = 300$。"],
        [
          "Taking $25\\%$ off $\\$300$ gives $\\$225$, too small: the $25\\%$ was of the old price.",
          "从 $\\$300$ 减去 $25\\%$ 得 $\\$225$，偏小了：这 $25\\%$ 是原价的。",
        ],
      ],
      (rng) => {
        const p = rng.pick([10, 20, 25, 40, 50, 60, 75]);
        const orig = rng.int(2, 30) * 20;
        const now = (orig * (100 + p)) / 100;
        const m = dec(Q.of(100 + p, 100));
        return valued(
          [
            `After a $${p}\\%$ increase, a bike costs $\\$${now}$. What did it cost before the increase, in dollars?`,
            `涨价 $${p}\\%$ 后，一辆自行车售价 $\\$${now}$。涨价前是多少美元？`,
          ],
          orig,
          [
            [
              ["The multiplier", "倍数"],
              [`The new price is $${100 + p}\\%$ of the old price:`, `新价是原价的 $${100 + p}\\%$：`],
              [`${100 + p}\\% = ${m}`],
            ],
            [["Divide", "相除"], ["Divide the new price by the multiplier:", "用新价除以倍数："], [`${now} \\div ${m} = ${orig}`]],
          ],
          [
            `$${p}\\%$ of $${orig}$ is $${(orig * p) / 100}$, and $${orig} + ${(orig * p) / 100} = ${now}$.`,
            `$${orig}$ 的 $${p}\\%$ 是 $${(orig * p) / 100}$，$${orig} + ${(orig * p) / 100} = ${now}$。`,
          ],
          [
            [
              Q.of(now * (100 - p), 100),
              `That takes $${p}\\%$ of the new price off, but the $${p}\\%$ was of the old price.`,
              `这是从新价中减去它的 $${p}\\%$，但这 $${p}\\%$ 是原价的。`,
            ],
            [now - p, `That subtracts $${p}$ dollars, not $${p}\\%$.`, `这是减去 $${p}$ 美元，而不是 $${p}\\%$。`],
            [now, "That is the price after the increase.", "这是涨价后的价格。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "300",
            pieces: [
              { size: 240, text: "240", lit: true },
              { size: 60, text: "60" },
            ],
          },
        ],
        ["A bar of 300 made of the old price 240 and the rise 60.", "长条 300 由原价 240 和上涨的 60 组成。"],
      ),
    ),
  ],

  "subtracting-a-positive-number-from-a-smaller-positive-number": [
    lesson(
      "the-number-taken-away",
      ["The number taken away", "减去的数"],
      [
        [
          "To land below zero, a subtraction first takes away the whole starting number and then keeps going. So the number taken away is the start plus the distance below zero. In $6 - \\square = -4$, the box must take $6$ to reach $0$ and $4$ more, so it is $6 + 4 = 10$.",
          "要减到零以下，先减掉整个起始数，再继续减。所以减去的数等于起始数加上零以下的距离。在 $6 - \\square = -4$ 中，方框要先减掉 $6$ 到 $0$，再减 $4$，所以是 $6 + 4 = 10$。",
        ],
        ["$6 - 10 = -4$.", "$6 - 10 = -4$。"],
        ["The box is not $2$: $6 - 2 = 4$ stays above zero.", "方框不是 $2$：$6 - 2 = 4$ 还在零以上。"],
      ],
      (rng) => {
        const a = rng.int(2, 60);
        const b = rng.int(2, 60);
        return valued(
          [`Fill in the box: $$${a} - \\square = -${b}$$`, `填方框：$$${a} - \\square = -${b}$$`],
          a + b,
          [
            [["Down to zero", "减到零"], [`Taking away $${a}$ reaches zero:`, `减去 $${a}$ 到达零：`], [`${a} - ${a} = 0`]],
            [
              ["Below zero", "到零以下"],
              [`Then $${b}$ more reach $-${b}$, so the box holds:`, `再减 $${b}$ 到 $-${b}$，所以方框里是：`],
              [`${a} + ${b} = ${a + b}`],
            ],
          ],
          [`$${a} - ${a + b} = -(${a + b} - ${a}) = -${b}$.`, `$${a} - ${a + b} = -(${a + b} - ${a}) = -${b}$。`],
          [
            [
              Math.abs(a - b),
              "That subtracts the two numbers; the box must cover the start and the distance below zero.",
              "这是把两个数相减；方框要包括起始数和零以下的距离。",
            ],
            [b, "That is only the distance below zero; the start must be taken away too.", "这只是零以下的距离；还要减掉起始数。"],
            [a, "That only reaches zero.", "这只减到零。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "10",
            pieces: [
              { size: 6, text: "6" },
              { size: 4, text: "4", lit: true },
            ],
          },
        ],
        ["The number taken away, 10, is the start 6 plus the 4 below zero.", "减去的数 10 是起始数 6 加上零以下的 4。"],
      ),
    ),
  ],

  "subtracting-a-positive-fraction-from-a-smaller-fraction": [
    lesson(
      "the-fraction-taken-away",
      ["The fraction taken away", "减去的分数"],
      [
        [
          "The fraction taken away must cover the starting fraction and the distance below zero. With the same denominator, add the two numerators. In $\\frac{2}{7} - \\square = -\\frac{3}{7}$, the box takes $\\frac{2}{7}$ to reach $0$ and $\\frac{3}{7}$ more, so it is $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$.",
          "减去的分数要包括起始分数和零以下的距离。分母相同时，把两个分子相加。在 $\\frac{2}{7} - \\square = -\\frac{3}{7}$ 中，方框先减掉 $\\frac{2}{7}$ 到 $0$，再减 $\\frac{3}{7}$，所以是 $\\frac{2}{7} + \\frac{3}{7} = \\frac{5}{7}$。",
        ],
        ["$\\frac{2}{7} - \\frac{5}{7} = -\\frac{3}{7}$.", "$\\frac{2}{7} - \\frac{5}{7} = -\\frac{3}{7}$。"],
        [
          "Keep the denominator: $\\frac{2}{7} + \\frac{3}{7}$ is $\\frac{5}{7}$, not $\\frac{5}{14}$.",
          "分母不变：$\\frac{2}{7} + \\frac{3}{7}$ 是 $\\frac{5}{7}$，不是 $\\frac{5}{14}$。",
        ],
      ],
      (rng) => {
        const d = rng.int(3, 15);
        const a = rng.int(1, d - 1);
        const b = rng.int(1, d - 1);
        const box = Q.of(a + b, d);
        return valued(
          [`Fill in the box: $$${frac(a, d)} - \\square = -${frac(b, d)}$$`, `填方框：$$${frac(a, d)} - \\square = -${frac(b, d)}$$`],
          box,
          [
            [
              ["Down to zero", "减到零"],
              [`Taking away $${frac(a, d)}$ reaches zero.`, `减去 $${frac(a, d)}$ 到达零。`],
            ],
            [
              ["Below zero", "到零以下"],
              [
                `Then $${frac(b, d)}$ more reach $-${frac(b, d)}$, so the box holds:`,
                `再减 $${frac(b, d)}$ 到 $-${frac(b, d)}$，所以方框里是：`,
              ],
              [`${frac(a, d)} + ${frac(b, d)} = ${frac(a + b, d)}${box.d === BigInt(d) ? "" : ` = ${box.toLatex()}`}`],
            ],
          ],
          [`$${frac(a, d)} - ${frac(a + b, d)} = -${frac(b, d)}$.`, `$${frac(a, d)} - ${frac(a + b, d)} = -${frac(b, d)}$。`],
          [
            [
              Q.of(Math.abs(a - b), d),
              "That subtracts the numerators; the box must cover the start and the distance below zero.",
              "这是把分子相减；方框要包括起始分数和零以下的距离。",
            ],
            [Q.of(b, d), "That is only the distance below zero.", "这只是零以下的距离。"],
            [Q.of(a + b, 2 * d), "That adds the denominators too; they stay the same.", "这是把分母也相加了；分母应保持不变。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "5/7",
            pieces: [
              { size: 2, text: "2/7" },
              { size: 3, text: "3/7", lit: true },
            ],
          },
        ],
        ["The fraction taken away, 5/7, is the start 2/7 plus the 3/7 below zero.", "减去的分数 5/7 是起始的 2/7 加上零以下的 3/7。"],
      ),
    ),
  ],
  "subtracting-a-positive-decimal-from-a-smaller-decimal": [
    lesson(
      "climbing-back-from-below-zero",
      ["Climbing back from below zero", "从零以下回升"],
      [
        [
          "A balance below zero must first climb back to zero before it can reach a positive target. So the amount needed is the distance below zero plus the target. An account with $4.5$ dollars spends $7.5$: it is at $-3$. To reach $2$ dollars, pay in $3 + 2 = 5$ dollars.",
          "零以下的余额要先回到零，才能达到正的目标。所以需要的量是零以下的距离加上目标。账户有 $4.5$ 美元，花掉 $7.5$ 美元：余额是 $-3$。要达到 $2$ 美元，要存入 $3 + 2 = 5$ 美元。",
        ],
        ["$-3 + 5 = 2$.", "$-3 + 5 = 2$。"],
        ["Paying in only the target, $2$, leaves $-3 + 2 = -1$, still below zero.", "只存入目标 $2$，余额是 $-3 + 2 = -1$，还在零以下。"],
      ],
      (rng) => {
        const have = rng.int(11, 99);
        const spend = have + rng.int(5, 90);
        const target = rng.int(5, 50);
        const below = spend - have;
        const need = below + target;
        return valued(
          [
            `An account has ${tenths(have)} dollars and ${tenths(spend)} dollars are spent. How many dollars must then be paid in for the balance to reach ${tenths(target)} dollars?`,
            `一个账户有 ${tenths(have)} 美元，花掉 ${tenths(spend)} 美元。之后要存入多少美元，余额才能达到 ${tenths(target)} 美元？`,
          ],
          Q.of(need, 10),
          [
            [
              ["The balance", "余额"],
              ["Spending more than there is goes below zero:", "花的比有的多，余额到零以下："],
              [`${tenths(have)} - ${tenths(spend)} = -${tenths(below)}`],
            ],
            [
              ["Back to the target", "回到目标"],
              [
                `Climb $${tenths(below)}$ back to zero, then $${tenths(target)}$ more:`,
                `先回升 $${tenths(below)}$ 到零，再增加 $${tenths(target)}$：`,
              ],
              [`${tenths(below)} + ${tenths(target)} = ${tenths(need)}`],
            ],
          ],
          [
            `$-${tenths(below)} + ${tenths(need)} = ${tenths(target)}$, the target.`,
            `$-${tenths(below)} + ${tenths(need)} = ${tenths(target)}$，正是目标。`,
          ],
          [
            [Q.of(below, 10), "That only climbs back to zero.", "这只回到零。"],
            [
              Q.of(Math.abs(below - target), 10),
              "That subtracts the target from the distance below zero; they add.",
              "这是用零以下的距离减去目标；应该相加。",
            ],
            [Q.of(spend + target, 10), "That forgets the money already in the account.", "这是忘了账户里原有的钱。"],
          ],
          { form: "decimal" },
        );
      },
      tapeFigure(
        [
          {
            total: "5",
            pieces: [
              { size: 3, text: "3" },
              { size: 2, text: "2", lit: true },
            ],
          },
        ],
        ["The amount paid in, 5, is the 3 below zero plus the target 2.", "存入的 5 是零以下的 3 加上目标 2。"],
      ),
    ),
  ],

  "adding-a-positive-number-to-a-negative-number": [
    lesson(
      "the-number-added-to-a-negative",
      ["The number added to a negative", "加到负数上的数"],
      [
        [
          "The number added to a negative start is the distance moved to the right. First it climbs back to zero, then it goes on to the end. So it equals the end minus the start. In $-6 + \\square = 4$, the box climbs $6$ to reach $0$ and $4$ more, so it is $4 - (-6) = 10$.",
          "加到负数上的数，就是向右移动的距离：先回到零，再走到终点。所以它等于终点减起点。在 $-6 + \\square = 4$ 中，方框先上升 $6$ 到 $0$，再上升 $4$，所以是 $4 - (-6) = 10$。",
        ],
        ["$-6 + 10 = 4$.", "$-6 + 10 = 4$。"],
        ["The box is not $4 - 6 = -2$: subtracting the negative start adds $6$.", "方框不是 $4 - 6 = -2$：减去负的起点就是加上 $6$。"],
      ],
      (rng) => {
        const a = rng.int(3, 60);
        const b = rng.int(2, 60);
        const end = rng.bool() ? b : -rng.int(1, a - 1);
        const answer = end + a;
        return valued(
          [`Fill in the box: $$-${a} + \\square = ${end}$$`, `填方框：$$-${a} + \\square = ${end}$$`],
          answer,
          [
            [
              ["Back to zero", "回到零"],
              [`From $-${a}$, a move of $${a}$ reaches zero.`, `从 $-${a}$ 出发，移动 $${a}$ 到达零。`],
            ],
            end > 0
              ? [
                  ["On to the end", "走到终点"],
                  [`Then $${end}$ more reach $${end}$, so the box holds:`, `再移动 $${end}$ 到 $${end}$，所以方框里是：`],
                  [`${a} + ${end} = ${answer}`],
                ]
              : [
                  ["Stop short", "提前停下"],
                  [`The end $${end}$ is $${-end}$ short of zero, so the box holds:`, `终点 $${end}$ 离零还差 $${-end}$，所以方框里是：`],
                  [`${a} - ${-end} = ${answer}`],
                ],
          ],
          [
            `End minus start: $${end} - (-${a}) = ${end} + ${a} = ${answer}$.`,
            `终点减起点：$${end} - (-${a}) = ${end} + ${a} = ${answer}$。`,
          ],
          [
            [
              Math.abs(end - a),
              "That subtracts the start as if it were positive; subtracting a negative adds.",
              "这是把起点当成正数来减；减去负数应该是加。",
            ],
            [a, "That only climbs back to zero.", "这只回到了零。"],
            [Math.abs(end), "That is only the distance from zero to the end.", "这只是从零到终点的距离。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "10",
            pieces: [
              { size: 6, text: "6" },
              { size: 4, text: "4", lit: true },
            ],
          },
        ],
        ["The number added, 10, is the 6 back to zero plus the 4 beyond it.", "加上的 10 是回到零的 6 加上零以上的 4。"],
      ),
    ),
  ],
  "interpreting-additive-opposites-and-addition-using-absolute-value": [
    lesson(
      "from-a-number-to-its-opposite",
      ["From a number to its opposite", "从一个数到它的相反数"],
      [
        [
          "A number and its opposite are the same distance from zero, on either side. So getting from one to the other means crossing that distance twice: once to zero and once beyond it. From $7$ to $-7$ is $7 + 7 = 14$ to the left, so add $-14$.",
          "一个数和它的相反数到零的距离相同，分在零的两侧。所以从一个数到另一个数，要走两倍的距离：一次到零，一次过零。从 $7$ 到 $-7$ 要向左走 $7 + 7 = 14$，所以加上 $-14$。",
        ],
        ["$7 + (-14) = -7$.", "$7 + (-14) = -7$。"],
        ["Adding the opposite $-7$ only reaches $0$, not $-7$.", "加上相反数 $-7$ 只能到 $0$，到不了 $-7$。"],
      ],
      (rng) => {
        const a = rng.int(2, 80);
        const start = rng.bool() ? -a : a;
        const left = start > 0;
        const p = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return valued(
          [`What number must be added to $${start}$ to get its opposite?`, `$${start}$ 加上什么数得到它的相反数？`],
          -2 * start,
          [
            [
              ["The distance", "距离"],
              [
                `The opposite is $${-start}$. Each is $${a}$ from zero, so the move is:`,
                `相反数是 $${-start}$。两者到零的距离都是 $${a}$，所以要移动：`,
              ],
              [`${a} + ${a} = ${2 * a}`],
            ],
            [
              ["The direction", "方向"],
              [
                `The move goes ${left ? "left, so the number is negative" : "right, so the number is positive"}:`,
                `要向${left ? "左移动，所以这个数是负数" : "右移动，所以这个数是正数"}：`,
              ],
              [`${-2 * start}`],
            ],
          ],
          [
            `End minus start: $${-start} - ${p(start)} = ${-2 * start}$, and $${start} + ${p(-2 * start)} = ${-start}$.`,
            `终点减起点：$${-start} - ${p(start)} = ${-2 * start}$，而 $${start} + ${p(-2 * start)} = ${-start}$。`,
          ],
          [
            [-start, "That is the opposite itself; adding it only reaches zero.", "这是相反数本身；加上它只能到零。"],
            [2 * start, "The direction is wrong: the move must cross zero.", "方向错了：移动要越过零。"],
            [0, "Adding zero leaves the number where it is.", "加零不会改变这个数。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "14",
            pieces: [
              { size: 7, text: "7" },
              { size: 7, text: "7", lit: true },
            ],
          },
        ],
        ["From 7 to -7: 7 down to zero and 7 beyond it, 14 in all.", "从 7 到 -7：到零是 7，过零再走 7，共 14。"],
      ),
    ),
  ],

  "multiplying-positive-numbers-with-negative-numbers": [
    lesson(
      "the-missing-factor-with-a-sign",
      ["The missing factor with a sign", "带符号的缺失因数"],
      [
        [
          "A positive times a negative gives a negative. So when one factor is positive and the product is negative, the missing factor must be negative, and its size comes from dividing the sizes. In $4 \\times \\square = -28$, the box is $-(28 \\div 4) = -7$.",
          "正数乘负数得负数。所以一个因数为正、积为负时，缺失的因数一定是负数，大小由两个绝对值相除得到。在 $4 \\times \\square = -28$ 中，方框是 $-(28 \\div 4) = -7$。",
        ],
        ["Multiply back: $4 \\times (-7) = -28$.", "乘回去：$4 \\times (-7) = -28$。"],
        ["The box is not $7$: $4 \\times 7 = 28$ is positive.", "方框不是 $7$：$4 \\times 7 = 28$ 是正数。"],
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        return valued(
          [`Fill in the box: $$${a} \\times \\square = -${a * b}$$`, `填方框：$$${a} \\times \\square = -${a * b}$$`],
          -b,
          [
            [
              ["The sign", "定符号"],
              [
                `$${a}$ is positive and the product is negative, so the missing factor is negative.`,
                `$${a}$ 是正数，积是负数，所以缺失的因数是负数。`,
              ],
            ],
            [
              ["The size", "算大小"],
              ["Divide the sizes and put on the sign:", "把绝对值相除，再加上符号："],
              [`${a * b} \\div ${a} = ${b}`, `\\square = -${b}`],
            ],
          ],
          [`Multiply back: $${a} \\times (-${b}) = -${a * b}$.`, `乘回去：$${a} \\times (-${b}) = -${a * b}$。`],
          [
            [b, "The sign is wrong: a positive times a positive is positive.", "符号错了：正数乘正数得正数。"],
            [-a * b + a, "That subtracts instead of dividing.", "这是做了减法，应该相除。"],
            [-a * b - a, "That adds instead of dividing.", "这是做了加法，应该相除。"],
          ],
        );
      },
      tableFigure(["4(?)", "-28÷4"], [-28, -7]),
    ),
  ],
  "equivalent-fractions-with-negative-numbers": [
    lesson(
      "the-one-with-the-other-sign",
      ["The one with the other sign", "符号不同的那个"],
      [
        [
          "A fraction with exactly one negative sign is negative, wherever that sign is written. Two negative signs cancel, so a fraction with both signs is positive and has a different value. Of $\\frac{-2}{5}$, $\\frac{2}{-5}$, $-\\frac{4}{10}$ and $\\frac{-2}{-5}$, only the last is not $-\\frac{2}{5}$.",
          "只有一个负号的分数是负数，不管负号写在哪里。两个负号相互抵消，所以有两个负号的分数是正数，值不同。在 $\\frac{-2}{5}$、$\\frac{2}{-5}$、$-\\frac{4}{10}$ 和 $\\frac{-2}{-5}$ 中，只有最后一个不等于 $-\\frac{2}{5}$。",
        ],
        ["As divisions: $-2 \\div (-5) = 0.4$, while $-2 \\div 5 = -0.4$.", "看成除法：$-2 \\div (-5) = 0.4$，而 $-2 \\div 5 = -0.4$。"],
        [
          "$-\\frac{4}{10}$ looks different but simplifies to $-\\frac{2}{5}$.",
          "$-\\frac{4}{10}$ 看起来不同，但约分后就是 $-\\frac{2}{5}$。",
        ],
      ],
      (rng) => {
        const b = rng.int(3, 25);
        let a = rng.int(1, b - 1);
        if (gcd(a, b) !== 1) a = 1;
        return chosenMath(
          rng,
          [`Which of these is not equal to $-${frac(a, b)}$?`, `哪个不等于 $-${frac(a, b)}$？`],
          frac(-a, -b),
          [
            [frac(-a, b), "One negative sign, in the numerator, so it is equal.", "只有一个负号，在分子上，所以相等。"],
            [frac(a, -b), "One negative sign, in the denominator, so it is equal.", "只有一个负号，在分母上，所以相等。"],
            [`-${frac(2 * a, 2 * b)}`, `It simplifies to $-${frac(a, b)}$, so it is equal.`, `约分后是 $-${frac(a, b)}$，所以相等。`],
          ],
          [
            [
              ["Count the signs", "数负号"],
              [`$${frac(-a, -b)}$ has two negative signs, and they cancel:`, `$${frac(-a, -b)}$ 有两个负号，它们互相抵消：`],
              [`${frac(-a, -b)} = ${frac(a, b)}`],
            ],
            [
              ["Compare", "比较"],
              [
                `$${frac(a, b)}$ is positive and $-${frac(a, b)}$ is negative, so they are not equal.`,
                `$${frac(a, b)}$ 是正数，$-${frac(a, b)}$ 是负数，所以不相等。`,
              ],
            ],
          ],
          [
            `As divisions: $-${a} \\div (-${b})$ is positive, while $-${a} \\div ${b}$ is negative.`,
            `看成除法：$-${a} \\div (-${b})$ 是正数，而 $-${a} \\div ${b}$ 是负数。`,
          ],
        );
      },
      lineFigure(
        {
          lo: -1,
          hi: 1,
          step: 0.2,
          labels: [-1, 0, 1],
          label: (v) => String(Math.round(v)),
          marks: [
            { at: -0.4, text: "-2/5" },
            { at: 0.4, text: "(-2)/(-5)", result: true },
          ],
        },
        ["A number line: -2/5 is left of zero, while (-2)/(-5) is right of zero.", "数轴：-2/5 在零的左边，而 (-2)/(-5) 在零的右边。"],
      ),
    ),
  ],
  "dividing-with-negative-decimals-and-fractions": [
    lesson(
      "the-number-before-a-signed-division",
      ["The number before a signed division", "带符号除法的被除数"],
      [
        [
          "A division is undone by multiplying the quotient by the divisor, and the sign rules still hold: two negatives give a positive number, and one negative gives a negative number. In $\\square \\div (-0.4) = 1.5$, the box is $1.5 \\times (-0.4) = -0.6$.",
          "除法可以用商乘除数来还原，符号法则仍然适用：两个负数得正数，一个负数得负数。在 $\\square \\div (-0.4) = 1.5$ 中，方框是 $1.5 \\times (-0.4) = -0.6$。",
        ],
        ["Divide again: $-0.6 \\div (-0.4) = 1.5$.", "再除一次：$-0.6 \\div (-0.4) = 1.5$。"],
        [
          "Count the decimal places: $0.4 \\times 1.5$ has two, so it is $0.60$, not $6.0$.",
          "数一数小数位数：$0.4 \\times 1.5$ 共两位小数，所以是 $0.60$，不是 $6.0$。",
        ],
      ],
      (rng) => {
        const d = rng.int(2, 19);
        const q = rng.int(2, 19);
        const negD = rng.bool();
        const negQ = rng.bool();
        const dd = negD ? -d : d;
        const qq = negQ ? -q : q;
        const show = (n: number) => (n < 0 ? `\\left(-${tenths(-n)}\\right)` : tenths(n));
        const answer = Q.of(dd * qq, 100);
        const quotient = `${negQ ? "-" : ""}${tenths(q)}`;
        return valued(
          [`Fill in the box: $$\\square \\div ${show(dd)} = ${quotient}$$`, `填方框：$$\\square \\div ${show(dd)} = ${quotient}$$`],
          answer,
          [
            [
              ["Undo the division", "还原除法"],
              ["Multiply the quotient by the divisor:", "用商乘除数："],
              [`\\square = ${show(qq)} \\times ${show(dd)}`],
            ],
            [
              ["Sign and size", "符号与大小"],
              [
                negD === negQ
                  ? "The signs are the same, so the result is positive:"
                  : "The signs are different, so the result is negative:",
                negD === negQ ? "两数同号，所以结果为正：" : "两数异号，所以结果为负：",
              ],
              [`${show(qq)} \\times ${show(dd)} = ${dec(answer)}`],
            ],
          ],
          [
            `Divide again: $${dec(answer)} \\div ${show(dd)} = ${quotient}$.`,
            `再除一次：$${dec(answer)} \\div ${show(dd)} = ${quotient}$。`,
          ],
          [
            [Q.of(-dd * qq, 100), "The sign is wrong: use the sign rule for the product.", "符号错了：要按乘法的符号法则定符号。"],
            [
              Q.of(dd * qq, 10),
              "The decimal point is in the wrong place: the two factors have two decimal places in all.",
              "小数点位置错了：两个因数一共有两位小数。",
            ],
            [Q.of(dd + qq, 10), "That adds instead of multiplying.", "这是做了加法，应该相乘。"],
          ],
          { form: "decimal" },
        );
      },
      tableFigure(["1.5(-0.4)", "-0.6÷(-0.4)"], [-0.6, 1.5]),
    ),
  ],
  "reciprocals-of-rational-numbers": [
    lesson(
      "the-multiplier-that-replaces-a-division",
      ["The multiplier that replaces a division", "替代除法的乘数"],
      [
        [
          "Dividing by a number is the same as multiplying by its reciprocal, and a reciprocal keeps the sign of the number. So $6 \\div \\left(-\\frac{2}{3}\\right) = 6 \\times \\left(-\\frac{3}{2}\\right)$.",
          "除以一个数等于乘它的倒数，而倒数与原数同号。所以 $6 \\div \\left(-\\frac{2}{3}\\right) = 6 \\times \\left(-\\frac{3}{2}\\right)$。",
        ],
        [
          "Both sides give $-9$: $6 \\times \\left(-\\frac{3}{2}\\right) = -9$ and $-9 \\times \\left(-\\frac{2}{3}\\right) = 6$.",
          "两边都得 $-9$：$6 \\times \\left(-\\frac{3}{2}\\right) = -9$，而 $-9 \\times \\left(-\\frac{2}{3}\\right) = 6$。",
        ],
        [
          "Changing the sign as well is a common slip: the reciprocal of $-\\frac{2}{3}$ is $-\\frac{3}{2}$, not $\\frac{3}{2}$.",
          "把符号也改变是常见错误：$-\\frac{2}{3}$ 的倒数是 $-\\frac{3}{2}$，不是 $\\frac{3}{2}$。",
        ],
      ],
      (rng) => {
        const b = rng.int(2, 15);
        let a = rng.int(2, 15);
        if (a === b) a += 1;
        const n = rng.int(2, 30);
        const answer = Q.of(-b, a);
        return valued(
          [
            `Fill in the box with a fraction: $$${n} \\div \\left(-${frac(a, b)}\\right) = ${n} \\times \\square$$`,
            `在方框中填一个分数：$$${n} \\div \\left(-${frac(a, b)}\\right) = ${n} \\times \\square$$`,
          ],
          answer,
          [
            [
              ["The rule", "法则"],
              ["Dividing by a number is multiplying by its reciprocal.", "除以一个数等于乘它的倒数。"],
            ],
            [
              ["The reciprocal", "求倒数"],
              ["Flip the fraction and keep the sign:", "把分数颠倒，符号不变："],
              [`-${frac(a, b)} \\to ${answer.toLatex()}`],
            ],
          ],
          [
            `Multiply: $\\left(-${frac(a, b)}\\right) \\times \\left(${answer.toLatex()}\\right) = 1$.`,
            `相乘：$\\left(-${frac(a, b)}\\right) \\times \\left(${answer.toLatex()}\\right) = 1$。`,
          ],
          [
            [Q.of(b, a), "The sign is wrong: a reciprocal keeps the sign.", "符号错了：倒数与原数同号。"],
            [Q.of(a, b), "That is the opposite, not the reciprocal.", "这是相反数，不是倒数。"],
            [Q.of(-a, b), "That is the number itself; it must be flipped.", "这是原数本身；要把它颠倒。"],
          ],
          { form: "fraction" },
        );
      },
      tableFigure(["6÷(-2/3)", "6(-3/2)"], [-9, -9]),
    ),
  ],

  "divisibility-of-integers-by-2-5-10-4-and-8": [theMissingDigitForDivisibilityBy4],
  "prime-factors": [theNumberFromItsPrimeFactors],
  "cubing-rational-numbers": [
    lesson(
      "the-greatest-of-the-powers",
      ["The greatest of the powers", "几个幂中最大的"],
      [
        [
          "Multiplying by a number between $0$ and $1$ makes a positive number smaller, so for such an $x$ each higher power is smaller and $x$ itself is the greatest. Between $-1$ and $0$, odd powers are negative and even powers positive, so the square is the greatest. For $x = \\frac{1}{2}$: $x^{2} = \\frac{1}{4}$, $x^{3} = \\frac{1}{8}$; for $x = -\\frac{1}{2}$: $x$ and $x^{3}$ are negative, and $x^{2} = \\frac{1}{4}$ is greater than $x^{4} = \\frac{1}{16}$.",
          "乘一个 $0$ 和 $1$ 之间的数会让正数变小，所以这样的 $x$，幂越高越小，$x$ 本身最大。在 $-1$ 和 $0$ 之间，奇次幂是负数，偶次幂是正数，所以平方最大。$x = \\frac{1}{2}$ 时：$x^{2} = \\frac{1}{4}$，$x^{3} = \\frac{1}{8}$；$x = -\\frac{1}{2}$ 时：$x$ 和 $x^{3}$ 是负数，而 $x^{2} = \\frac{1}{4}$ 大于 $x^{4} = \\frac{1}{16}$。",
        ],
        [
          "Compare $\\frac{1}{4}$ and $\\frac{1}{16}$: one more factor of $\\frac{1}{4}$ shrinks it, so $x^{2}$ is greater.",
          "比较 $\\frac{1}{4}$ 和 $\\frac{1}{16}$：再乘一个 $\\frac{1}{4}$ 就变小了，所以 $x^{2}$ 更大。",
        ],
        [
          "For a negative $x$, $x$ itself is not the greatest: it is below every even power.",
          "当 $x$ 是负数时，$x$ 本身不是最大的：它比每个偶次幂都小。",
        ],
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        const neg = rng.bool();
        const x = Q.of(neg ? -n : n, d);
        const v = (k: number) => x.pow(k).toLatex();
        const values = [`x = ${v(1)}`, `x^{2} = ${v(2)}`, `x^{3} = ${v(3)}`, `x^{4} = ${v(4)}`];
        return chosenMath(
          rng,
          [`Let $x = ${x.toLatex()}$. Which value is the greatest?`, `设 $x = ${x.toLatex()}$。哪个值最大？`],
          neg ? "x^{2}" : "x",
          neg
            ? [
                ["x", "$x$ is negative, so it is below every even power.", "$x$ 是负数，比每个偶次幂都小。"],
                ["x^{3}", "$x^{3}$ is negative: three negative factors.", "$x^{3}$ 是负数：三个负因数相乘。"],
                [
                  "x^{4}",
                  "$x^{4}$ is positive but smaller than $x^{2}$: it has two more factors whose size is below $1$.",
                  "$x^{4}$ 是正数，但比 $x^{2}$ 小：它多了两个绝对值小于 $1$ 的因数。",
                ],
              ]
            : [
                [
                  "x^{2}",
                  "$x^{2}$ is $x$ times a number below $1$, so it is smaller than $x$.",
                  "$x^{2}$ 是 $x$ 乘一个小于 $1$ 的数，所以比 $x$ 小。",
                ],
                [
                  "x^{3}",
                  "$x^{3}$ is smaller than $x^{2}$: each extra factor below $1$ shrinks it.",
                  "$x^{3}$ 比 $x^{2}$ 小：每多一个小于 $1$ 的因数就变小。",
                ],
                ["x^{4}", "$x^{4}$ is the smallest: it has the most factors below $1$.", "$x^{4}$ 最小：小于 $1$ 的因数最多。"],
              ],
          [
            [["The values", "算出各个值"], ["Work out each power:", "把每个幂算出来："], values],
            neg
              ? [
                  ["Compare", "比较"],
                  [
                    "$x$ and $x^{3}$ are negative; of the two positive values, $x^{2}$ is greater than $x^{4}$:",
                    "$x$ 和 $x^{3}$ 是负数；两个正数中，$x^{2}$ 大于 $x^{4}$：",
                  ],
                  [`${v(2)} > ${v(4)}`],
                ]
              : [
                  ["Compare", "比较"],
                  ["Each higher power is smaller, so $x$ is the greatest:", "幂越高越小，所以 $x$ 最大："],
                  [`${v(1)} > ${v(2)} > ${v(3)} > ${v(4)}`],
                ],
          ],
          neg
            ? [
                "Think of the signs: only even powers are positive, and $x^{2}$ has the fewest factors below $1$ in size.",
                "看符号：只有偶次幂是正数，而 $x^{2}$ 中绝对值小于 $1$ 的因数最少。",
              ]
            : [
                "Think of the factors: each power multiplies by $x$ once more, and $x$ is less than $1$, so the values keep shrinking.",
                "看因数：每升高一次就多乘一个 $x$，而 $x$ 小于 $1$，所以值越来越小。",
              ],
        );
      },
      lineFigure(
        {
          lo: 0,
          hi: 1,
          step: 0.125,
          labels: [0, 1],
          marks: [
            { at: 0.125, text: "x³" },
            { at: 0.25, text: "x²" },
            { at: 0.5, text: "x", result: true },
          ],
        },
        [
          "A number line from 0 to 1 with x = 1/2, x squared = 1/4 and x cubed = 1/8.",
          "从 0 到 1 的数轴：x = 1/2，x 的平方 = 1/4，x 的立方 = 1/8。",
        ],
      ),
    ),
  ],

  "powers-of-negative-one": [aLongSumOfPowers],
  "the-quotient-rule-for-exponents": [theMissingExponentInAQuotient],
  "the-power-of-product-rule-for-exponents": [theExponentInsideTheParentheses],
  "the-power-of-quotient-rule-for-exponents": [aNegativePowerTurnsTheFractionOver],
  "combining-the-rules-of-exponents": [thePowerThatDoesNotMatch],
  "converting-scientific-notation-to-standard-notation": [zerosAtTheEnd],
  "comparing-numbers-in-scientific-notation": [theGreatestOfFourInScientificNotation],
  "addition-and-subtraction-in-scientific-notation": [aDifferenceBelowOne],
  "addition-in-scientific-notation-with-different-powers-of-ten": [matchingThePowersFirst],
  "subtraction-in-scientific-notation-with-different-powers-of-ten": [whenTheSmallerHardlyMatters],
  "further-addition-in-scientific-notation-with-different-powers-of-ten": [aSumAsADecimal],
  "multiplying-numbers-in-scientific-notation": [thePowerAfterTidyingTheProduct],
  "evaluating-rational-number-expressions-without-exponents": [
    lesson(
      "where-the-parentheses-go",
      ["Where the parentheses go", "括号放在哪里"],
      [
        [
          "Without parentheses, multiplication comes before addition. Parentheses can change that order and the value, so the same numbers and signs may give several different results. $(-2 + 5) \\times 3 = 3 \\times 3 = 9$, but $-2 + 5 \\times 3 = -2 + 15 = 13$.",
          "没有括号时，先乘后加。括号可以改变运算顺序，也就改变了结果，所以相同的数和符号可能得到不同的值。$(-2 + 5) \\times 3 = 3 \\times 3 = 9$，而 $-2 + 5 \\times 3 = -2 + 15 = 13$。",
        ],
        ["Distribute: $(-2 + 5) \\times 3 = -6 + 15 = 9$.", "用分配律：$(-2 + 5) \\times 3 = -6 + 15 = 9$。"],
        ["A minus sign in front of parentheses changes the sign of everything inside.", "括号前的负号会改变括号里每一项的符号。"],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = a + rng.int(1, 9);
        const c = rng.int(2, 9);
        const value = (b - a) * c;
        return chosenMath(
          rng,
          [`Which expression equals $${value}$?`, `哪个式子等于 $${value}$？`],
          `(-${a} + ${b}) \\times ${c}`,
          [
            [`-${a} + (${b} \\times ${c})`, `This multiplies first and equals $${-a + b * c}$.`, `它先算乘法，等于 $${-a + b * c}$。`],
            [
              `-(${a} + ${b} \\times ${c})`,
              `This equals $-${a + b * c}$: the minus sign covers the whole sum.`,
              `它等于 $-${a + b * c}$：负号作用于整个和。`,
            ],
            [
              `-(${a} + ${b}) \\times ${c}`,
              `This equals $-${(a + b) * c}$: the minus sign covers $${a} + ${b}$.`,
              `它等于 $-${(a + b) * c}$：负号作用于 $${a} + ${b}$。`,
            ],
          ],
          [
            [["Inside first", "先算括号"], ["Work inside the parentheses:", "先算括号里面的："], [`-${a} + ${b} = ${b - a}`]],
            [["Then multiply", "再算乘法"], ["Multiply the result:", "再相乘："], [`${b - a} \\times ${c} = ${value}`]],
          ],
          [
            `Distribute: $(-${a}) \\times ${c} + ${b} \\times ${c} = -${a * c} + ${b * c} = ${value}$.`,
            `用分配律：$(-${a}) \\times ${c} + ${b} \\times ${c} = -${a * c} + ${b * c} = ${value}$。`,
          ],
        );
      },
      tableFigure(["(-2+5)3", "-2+5(3)"], [9, 13]),
    ),
  ],

  "evaluating-expressions-with-positive-integer-exponents": [
    lesson(
      "substituting-a-negative-into-a-square",
      ["Substituting a negative into a square", "把负数代入平方"],
      [
        [
          "When you substitute a negative number, put it in parentheses. In $-x^{2}$ the square comes first and the minus sign after it, so the result is negative even when $x$ is negative. For $x = -3$: $-x^{2} = -(-3)^{2} = -9$.",
          "代入负数时，要给它加上括号。在 $-x^{2}$ 中先平方，再取负，所以即使 $x$ 是负数，结果也是负数。当 $x = -3$ 时：$-x^{2} = -(-3)^{2} = -9$。",
        ],
        ["Read it as $-1 \\times x^{2} = -1 \\times 9 = -9$.", "把它看成 $-1 \\times x^{2} = -1 \\times 9 = -9$。"],
        ["$-x^{2}$ is never positive: $-(-3)^{2}$ is $-9$, not $9$.", "$-x^{2}$ 不会是正数：$-(-3)^{2}$ 是 $-9$，不是 $9$。"],
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const y = rng.int(1, 30);
        const v = y - a * a;
        return valued(
          [`Evaluate $-x^{2} + y$ when $x = -${a}$ and $y = ${y}$.`, `当 $x = -${a}$，$y = ${y}$ 时，计算 $-x^{2} + y$。`],
          v,
          [
            [
              ["Substitute", "代入"],
              ["Put the negative value in parentheses:", "把负数放进括号里代入："],
              [`-x^{2} + y = -(-${a})^{2} + ${y}`],
            ],
            [
              ["Square, then add", "先平方，再相加"],
              ["Square first, then the minus sign, then add:", "先平方，再取负，最后相加："],
              [`(-${a})^{2} = ${a * a}`, `-${a * a} + ${y} = ${v}`],
            ],
          ],
          [
            `Undo the addition: $${v} - ${y} = -${a * a}$, the opposite of $(-${a})^{2}$.`,
            `撤销加法：$${v} - ${y} = -${a * a}$，正是 $(-${a})^{2}$ 的相反数。`,
          ],
          [
            [
              a * a + y,
              "That drops the minus sign in front of $x^{2}$; it makes the square negative.",
              "这是丢掉了 $x^{2}$ 前面的负号；它让平方变成负数。",
            ],
            [-a * a - y, `That subtracts $y$; it is added.`, `这是减去了 $y$；应该加上它。`],
            [y + 2 * a, "That doubles $x$ instead of squaring it.", "这是把 $x$ 乘了 2，不是平方。"],
          ],
        );
      },
      tableFigure(["(-3)²", "-(-3)²"], [9, -9]),
    ),
  ],

  "evaluating-expressions-with-integer-exponents": [theNegativeExponentThatFits],
  "the-square-root-of-a-perfect-square": [theRootOfASum],
  "squaring-a-square-root": [theRootOfANegativeSquared],
  "the-cube-root-of-a-perfect-cube": [sumsOfCubeRoots],
  "classifying-rational-and-irrational-numbers": [
    skill(
      "irrationals-that-become-rational",
      ["Irrationals that become rational", "变成有理数的无理数"],
      [
        "Adding or multiplying an irrational number by a nonzero rational keeps it irrational. Squaring a square root removes the root, though, so the result is a rational number.",
        "无理数加上有理数或乘非零有理数，仍是无理数。但平方根再平方就消去了根号，结果是有理数。",
      ],
      (rng) => {
        const n = rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]);
        const k = rng.int(2, 12);
        return chooseMath(
          rng,
          ["Which of these numbers is rational?", "哪个数是有理数？"],
          `(\\sqrt{${n}})^{2} + ${k}`,
          [`\\sqrt{${n}} + ${k}`, `${k}\\sqrt{${n}}`, frac(`\\sqrt{${n}}`, k)],
          [
            `$(\\sqrt{${n}})^{2} = ${n}$, so the sum is $${n + k}$. The others still contain $\\sqrt{${n}}$.`,
            `$(\\sqrt{${n}})^{2} = ${n}$，所以和是 $${n + k}$。其他的仍含 $\\sqrt{${n}}$。`,
          ],
        );
      },
    ),
  ],
  surds: [countingTheSurds],
  "the-product-rule-for-radicals": [theMissingNumberUnderARoot],
  "the-quotient-rule-for-radicals": [theMissingNumberInAQuotientOfRoots],
  "evaluating-rational-expressions": [
    skill(
      "when-it-has-no-value",
      ["When it has no value", "什么时候没有值"],
      [
        "Division by zero has no meaning, so a rational expression has no value where its denominator is zero. A zero numerator causes no trouble, as it only makes the whole fraction zero.",
        "除以零没有意义，所以分母为零时有理式没有值。分子为零没有问题，只是整个分数为零。",
      ],
      (rng) => {
        const a = rng.int(1, 20);
        const b = rng.int(1, 20);
        const k = rng.int(2, 6);
        const neg = rng.bool();
        const den = neg ? `${k}x + ${k * b}` : `${k}x - ${k * b}`;
        const answer = neg ? -b : b;
        return integer(
          [`For what value of $x$ does $${frac(`x + ${a}`, den)}$ have no value?`, `$x$ 为何值时，$${frac(`x + ${a}`, den)}$ 没有值？`],
          answer,
          [-answer, -a, k * b],
          [`The denominator is zero when $${den} = 0$, which gives $x = ${answer}$.`, `当 $${den} = 0$ 时分母为零，得 $x = ${answer}$。`],
        );
      },
    ),
  ],
  "the-distributive-law-with-three-terms": [
    lesson(
      "a-missing-coefficient-with-three-terms",
      ["A missing coefficient with three terms", "三项中缺失的系数"],
      [
        [
          "The outside factor multiplies all three terms and carries its sign into each of them. So a term of the expansion divided by the factor gives the term inside, with the right sign. In $-2(3x + \\square y + 4) = -6x - 10y - 8$, the box times $-2$ is $-10$, so the box is $-10 \\div (-2) = 5$.",
          "外面的因数要乘全部三项，并把符号带进每一项。所以展开式中的一项除以这个因数，就得到括号里带正确符号的那一项。在 $-2(3x + \\square y + 4) = -6x - 10y - 8$ 中，方框乘 $-2$ 得 $-10$，所以方框是 $-10 \\div (-2) = 5$。",
        ],
        ["Multiply back: $-2 \\times 5 = -10$, the $y$-term of the expansion.", "乘回去：$-2 \\times 5 = -10$，正是展开式中的 $y$ 项。"],
        [
          "Divide by the factor with its sign: the box is $5$, not $-5$ and not $-10$.",
          "要除以带符号的因数：方框是 $5$，不是 $-5$，也不是 $-10$。",
        ],
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const neg = rng.bool();
        const f = neg ? -k : k;
        const pf = f < 0 ? `(${f})` : `${f}`;
        return valued(
          [
            `Fill in the box: $$${f}(${a}x + \\square y + ${c}) = ${f * a}x${signed(f * b)}y${signed(f * c)}$$`,
            `填方框：$$${f}(${a}x + \\square y + ${c}) = ${f * a}x${signed(f * b)}y${signed(f * c)}$$`,
          ],
          b,
          [
            [
              ["Match the term", "对应的项"],
              [`The $y$-term of the expansion is $${f}$ times the box:`, `展开式中的 $y$ 项是 $${f}$ 乘方框：`],
              [`${pf} \\times \\square = ${f * b}`],
            ],
            [
              ["Divide", "相除"],
              ["Divide by the factor, sign and all:", "连同符号一起除以这个因数："],
              [`\\square = ${f * b} \\div ${pf} = ${b}`],
            ],
          ],
          [
            `Multiply back: $${pf} \\times ${b} = ${f * b}$, the $y$-term of the expansion.`,
            `乘回去：$${pf} \\times ${b} = ${f * b}$，正是展开式中的 $y$ 项。`,
          ],
          [
            [
              -b,
              `The sign is wrong: $${pf} \\times ${-b}$ is $${-f * b}$, not $${f * b}$.`,
              `符号错了：$${pf} \\times ${-b}$ 得 $${-f * b}$，不是 $${f * b}$。`,
            ],
            [f * b, `That is the $y$-term of the expansion; divide it by $${f}$.`, `这是展开式中的 $y$ 项；还要除以 $${f}$。`],
            [b + k, `That adds the factor; divide by it instead.`, `这是加上了因数；应该除以它。`],
          ],
        );
      },
      tableFigure(["-10 ÷ (-2)", "-2 × 5"], [5, -10]),
    ),
  ],
  "distributing-the-negative-sign-in-a-linear-expression": [
    lesson(
      "subtracting-a-difference",
      ["Subtracting a difference", "减去一个差"],
      [
        [
          "A minus sign before parentheses changes the sign of every term inside. So when you subtract a difference, the term that was being taken away is added: $10 - (6 - x) = 10 - 6 + x = x + 4$.",
          "括号前的负号要改变括号里每一项的符号。所以减去一个差时，原来被减去的项变成加上：$10 - (6 - x) = 10 - 6 + x = x + 4$。",
        ],
        ["Put in $x = 2$: $10 - (6 - 2) = 6$, and $2 + 4 = 6$ too.", "代入 $x = 2$：$10 - (6 - 2) = 6$，而 $2 + 4$ 也等于 $6$。"],
        ["Subtracting $-x$ adds $x$: the answer has $+x$, not $-x$.", "减去 $-x$ 就是加 $x$：结果是 $+x$，不是 $-x$。"],
      ],
      (rng) => {
        const p = rng.int(2, 30);
        let q = rng.int(2, 30);
        if (q === p) q += 1;
        const v = rng.pick(["x", "y", "m", "t"]);
        const answer = `${v}${signed(p - q)}`;
        return chosenMath(
          rng,
          [`Simplify $${p} - (${q} - ${v})$.`, `化简 $${p} - (${q} - ${v})$。`],
          answer,
          [
            [
              `-${v}${signed(p - q)}`,
              `That leaves $${v}$ subtracted; the minus sign in front turns $-${v}$ into $+${v}$.`,
              `这是 $${v}$ 仍被减去；前面的负号把 $-${v}$ 变成 $+${v}$。`,
            ],
            [
              `${v}${signed(p + q)}`,
              `That adds $${q}$; the minus sign in front makes it $-${q}$.`,
              `这是加上了 $${q}$；前面的负号让它变成 $-${q}$。`,
            ],
            [
              `-${v}${signed(p + q)}`,
              "That changes the wrong signs: the minus sign in front changes both terms inside.",
              "这是变错了符号：前面的负号要改变括号里两项的符号。",
            ],
          ],
          [
            [
              ["Remove the parentheses", "去括号"],
              ["Change the sign of each term inside:", "括号里每一项都变号："],
              [`${p} - (${q} - ${v}) = ${p} - ${q} + ${v}`],
            ],
            [["Combine", "合并"], ["Combine the numbers:", "把数合并："], [`${p} - ${q} + ${v} = ${answer}`]],
          ],
          [
            `Put in $${v} = 2$: $${p} - (${q} - 2) = ${p - q + 2}$, and $2${signed(p - q)} = ${p - q + 2}$ too.`,
            `代入 $${v} = 2$：$${p} - (${q} - 2) = ${p - q + 2}$，而 $2${signed(p - q)}$ 也等于 $${p - q + 2}$。`,
          ],
        );
      },
      tableFigure(["10 - (6 - 2)", "2 + 4"], [6, 6]),
    ),
  ],
  "simplifying-linear-expressions-using-the-distributive-law": [
    lesson(
      "subtracting-a-group",
      ["Subtracting a group", "减去一组"],
      [
        [
          "When a group is subtracted, the factor in front is negative and it multiplies each term. A negative factor times a negative term inside the group gives a positive term: $5(x + 2) - 3(x - 4) = 5x + 10 - 3x + 12 = 2x + 22$.",
          "减去一组时，前面的因数是负的，要乘每一项。负因数乘括号里的负项，得到正项：$5(x + 2) - 3(x - 4) = 5x + 10 - 3x + 12 = 2x + 22$。",
        ],
        [
          "Put in $x = 2$: $5 \\times 4 - 3 \\times (-2) = 26$, and $2 \\times 2 + 22 = 26$ too.",
          "代入 $x = 2$：$5 \\times 4 - 3 \\times (-2) = 26$，而 $2 \\times 2 + 22$ 也等于 $26$。",
        ],
        [
          "$-3 \\times (-4)$ is $+12$: the last term of a subtracted difference is added.",
          "$-3 \\times (-4)$ 得 $+12$：被减去的差中，最后一项变成加上。",
        ],
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const a = c + rng.int(2, 8);
        const b = rng.int(1, 9);
        const d = rng.int(1, 9);
        const answer = `${a - c}x + ${a * b + c * d}`;
        const before = a * (2 + b) - c * (2 - d);
        return chosenMath(
          rng,
          [`Simplify $${a}(x + ${b}) - ${c}(x - ${d})$.`, `化简 $${a}(x + ${b}) - ${c}(x - ${d})$。`],
          answer,
          [
            [
              `${a - c}x${signed(a * b - c * d - (a * b - c * d === a * b + c * d ? 1 : 0))}`,
              `That gives $-${c} \\times (-${d})$ a minus sign; a negative times a negative is positive.`,
              `这是把 $-${c} \\times (-${d})$ 当成了负数；负数乘负数得正数。`,
            ],
            [
              `${a + c}x + ${a * b + c * d}`,
              `That adds $${c}x$; the group is subtracted, so it gives $-${c}x$.`,
              `这是加上了 $${c}x$；这组是被减去的，应该是 $-${c}x$。`,
            ],
            [
              `${a - c}x + ${a * b + d}`,
              `That leaves $${d}$ unmultiplied; $-${c}$ multiplies it too.`,
              `这是 $${d}$ 没有乘；$-${c}$ 也要乘它。`,
            ],
          ],
          [
            [
              ["Expand each group", "展开每组括号"],
              [`The factor in front of the second group is $-${c}$:`, `第二组前面的因数是 $-${c}$：`],
              [`${a}(x + ${b}) - ${c}(x - ${d}) = ${a}x + ${a * b} - ${c}x + ${c * d}`],
            ],
            [
              ["Combine like terms", "合并同类项"],
              ["Collect the $x$-terms and the constants:", "把含 $x$ 的项和常数项分别合并："],
              [`${a}x + ${a * b} - ${c}x + ${c * d} = ${answer}`],
            ],
          ],
          [
            `Put in $x = 2$: $${a} \\times ${2 + b} - ${c} \\times (${2 - d}) = ${before}$, and $${a - c} \\times 2 + ${a * b + c * d} = ${before}$ too.`,
            `代入 $x = 2$：$${a} \\times ${2 + b} - ${c} \\times (${2 - d}) = ${before}$，而 $${a - c} \\times 2 + ${a * b + c * d}$ 也等于 $${before}$。`,
          ],
        );
      },
      areaGridFigure(["-3"], ["x", "-4"], [["-3x", "12"]]),
    ),
  ],

  "simplifying-linear-expressions-containing-fractions": [
    lesson(
      "two-fractions-of-the-variable",
      ["Two fractions of the variable", "变量的两个分数"],
      [
        [
          "A term such as $\\frac{x}{3}$ is $\\frac{1}{3}x$, so combining two such terms means adding their fractional coefficients over a common denominator; the denominators are never added. $\\frac{x}{2} + \\frac{x}{3} = \\frac{3}{6}x + \\frac{2}{6}x = \\frac{5}{6}x$.",
          "像 $\\frac{x}{3}$ 这样的项就是 $\\frac{1}{3}x$，所以合并这样的两项，就是通分后把分数系数相加；分母不能相加。$\\frac{x}{2} + \\frac{x}{3} = \\frac{3}{6}x + \\frac{2}{6}x = \\frac{5}{6}x$。",
        ],
        [
          "Put in $x = 6$: $\\frac{6}{2} + \\frac{6}{3} = 3 + 2 = 5$, and $\\frac{5}{6} \\times 6 = 5$ too.",
          "代入 $x = 6$：$\\frac{6}{2} + \\frac{6}{3} = 3 + 2 = 5$，而 $\\frac{5}{6} \\times 6$ 也等于 $5$。",
        ],
        [
          "$\\frac{x}{2} + \\frac{x}{3}$ is not $\\frac{2x}{5}$: the denominators are not added.",
          "$\\frac{x}{2} + \\frac{x}{3}$ 不是 $\\frac{2x}{5}$：分母不能相加。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 12);
        if (b === a) b += 1;
        const sum = Q.of(a + b, a * b);
        const simplest = sum.toLatex() === frac(a + b, a * b) ? "" : ` = ${sum.toLatex()}`;
        return valued(
          [
            `Simplify $${frac("x", a)} + ${frac("x", b)}$ to a single term. What is the coefficient of $x$?`,
            `把 $${frac("x", a)} + ${frac("x", b)}$ 化成一项。$x$ 的系数是多少？`,
          ],
          sum,
          [
            [
              ["The coefficients", "找出系数"],
              [
                `$${frac("x", a)}$ is $${frac(1, a)}x$ and $${frac("x", b)}$ is $${frac(1, b)}x$, so add:`,
                `$${frac("x", a)}$ 就是 $${frac(1, a)}x$，$${frac("x", b)}$ 就是 $${frac(1, b)}x$，所以相加：`,
              ],
              [`${frac(1, a)} + ${frac(1, b)}`],
            ],
            [
              ["Common denominator", "通分"],
              [`Write both over $${a * b}$:`, `都化成分母是 $${a * b}$ 的分数：`],
              [`${frac(b, a * b)} + ${frac(a, a * b)} = ${frac(a + b, a * b)}${simplest}`],
            ],
          ],
          [
            `Put in $x = ${a * b}$: $${frac(a * b, a)} + ${frac(a * b, b)} = ${b} + ${a} = ${a + b}$, and $${sum.toLatex()} \\times ${a * b} = ${a + b}$ too.`,
            `代入 $x = ${a * b}$：$${frac(a * b, a)} + ${frac(a * b, b)} = ${b} + ${a} = ${a + b}$，而 $${sum.toLatex()} \\times ${a * b}$ 也等于 $${a + b}$。`,
          ],
          [
            [
              Q.of(2, a + b),
              "That adds the denominators; add the fractions over a common denominator.",
              "这是把分母相加了；应该通分后把分数相加。",
            ],
            [Q.of(1, a + b), "That adds the denominators and drops one of the two terms.", "这是把分母相加了，还丢掉了一项。"],
            [
              Q.of(2, a * b),
              `That uses the denominator $${a * b}$ without changing the numerators: $${frac(1, a)}$ is $${frac(b, a * b)}$.`,
              `这是用了分母 $${a * b}$，却没有改变分子：$${frac(1, a)}$ 是 $${frac(b, a * b)}$。`,
            ],
          ],
        );
      },
      stripsFigure([
        { parts: 6, shaded: 3, text: "1/2" },
        { parts: 6, shaded: 2, text: "1/3" },
        { parts: 6, shaded: 5, text: "5/6" },
      ]),
    ),
  ],
  "factoring-numerical-expressions": [
    lesson(
      "factoring-three-numbers",
      ["Factoring three numbers", "提取三个数的公因数"],
      [
        [
          "The greatest common factor must divide all three numbers, and each number leaves its own quotient in the parentheses. $12 + 18 + 30 = 6(2 + 3 + 5)$, because $12 \\div 6 = 2$, $18 \\div 6 = 3$ and $30 \\div 6 = 5$.",
          "最大公因数必须能整除三个数，每个数在括号里留下自己的商。$12 + 18 + 30 = 6(2 + 3 + 5)$，因为 $12 \\div 6 = 2$，$18 \\div 6 = 3$，$30 \\div 6 = 5$。",
        ],
        ["Expand: $6 \\cdot 2 + 6 \\cdot 3 + 6 \\cdot 5 = 12 + 18 + 30$.", "展开：$6 \\cdot 2 + 6 \\cdot 3 + 6 \\cdot 5 = 12 + 18 + 30$。"],
        [
          "Divide the third number too: the box holds $30 \\div 6 = 5$, not $30$.",
          "第三个数也要除：方框里是 $30 \\div 6 = 5$，不是 $30$。",
        ],
      ],
      (rng) => {
        const g = rng.int(2, 12);
        const [a, b, c] = rng.pick<[number, number, number]>([
          [2, 3, 5],
          [3, 4, 5],
          [2, 5, 7],
          [3, 5, 7],
          [4, 5, 7],
          [2, 3, 7],
          [5, 6, 7],
          [3, 7, 8],
          [2, 7, 9],
          [4, 7, 9],
        ]);
        return valued(
          [
            `Fill in the box, where $${g}$ is the greatest common factor: $$${g * a} + ${g * b} + ${g * c} = ${g}(${a} + ${b} + \\square)$$`,
            `填方框，其中 $${g}$ 是最大公因数：$$${g * a} + ${g * b} + ${g * c} = ${g}(${a} + ${b} + \\square)$$`,
          ],
          c,
          [
            [
              ["Match the term", "对应的项"],
              [`The third number, $${g * c}$, is $${g}$ times the box:`, `第三个数 $${g * c}$ 等于 $${g}$ 乘方框：`],
              [`${g} \\times \\square = ${g * c}`],
            ],
            [["Divide", "相除"], [`Divide by $${g}$:`, `除以 $${g}$：`], [`\\square = ${g * c} \\div ${g} = ${c}`]],
          ],
          [
            `Expand: $${g} \\cdot ${a} + ${g} \\cdot ${b} + ${g} \\cdot ${c} = ${g * a} + ${g * b} + ${g * c}$.`,
            `展开：$${g} \\cdot ${a} + ${g} \\cdot ${b} + ${g} \\cdot ${c} = ${g * a} + ${g * b} + ${g * c}$。`,
          ],
          [
            [g * c, `That copies the number on the left; divide it by $${g}$.`, `这是照抄了左边的数；还要除以 $${g}$。`],
            [g * c - g, `That subtracts $${g}$; divide by it instead.`, `这是减去了 $${g}$；应该除以它。`],
            [c + g, `That adds $${g}$; the box times $${g}$ must give $${g * c}$.`, `这是加上了 $${g}$；方框乘 $${g}$ 要等于 $${g * c}$。`],
          ],
        );
      },
      areaGridFigure(["6"], ["2", "3", "5"], [["12", "18", "30"]], [1], [2, 3, 5]),
    ),
  ],

  "solving-linear-equations-by-trial-and-error": [
    lesson(
      "trapping-the-solution-between-whole-numbers",
      ["Trapping the solution", "把解夹在整数之间"],
      [
        [
          "A solution need not be a whole number. When one whole number gives too little and the next gives too much, the solution lies between them. For $3x + 2 = 15$: $x = 4$ gives $14$, too little, and $x = 5$ gives $17$, too much, so the solution is between $4$ and $5$.",
          "解不一定是整数。如果一个整数得到的结果太小，下一个整数得到的结果太大，解就在它们之间。对于 $3x + 2 = 15$：$x = 4$ 得 $14$，太小；$x = 5$ 得 $17$，太大，所以解在 $4$ 和 $5$ 之间。",
        ],
        [
          "Solve exactly: $3x = 13$, so $x = \\frac{13}{3} = 4\\frac{1}{3}$, which is between $4$ and $5$.",
          "精确求解：$3x = 13$，所以 $x = \\frac{13}{3} = 4\\frac{1}{3}$，确实在 $4$ 和 $5$ 之间。",
        ],
        [
          "Both whole numbers must be tried: $x = 4$ alone only shows that $4$ is too small.",
          "两个整数都要试：只试 $x = 4$，只能说明 $4$ 太小。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const n = rng.int(2, 15);
        const b = rng.int(1, 20);
        const c = a * n + b + rng.int(1, a - 1);
        const exact = Q.of(c - b, a);
        return valued(
          [
            `The solution of $${a}x + ${b} = ${c}$ lies between two consecutive whole numbers. What is the smaller one?`,
            `$${a}x + ${b} = ${c}$ 的解在两个相邻整数之间。较小的那个是多少？`,
          ],
          n,
          [
            [
              ["Try a whole number", "试一个整数"],
              [`$x = ${n}$ gives too little:`, `$x = ${n}$ 得到的结果太小：`],
              [`${a} \\times ${n} + ${b} = ${a * n + b} < ${c}`],
            ],
            [
              ["Try the next one", "试下一个整数"],
              [
                `$x = ${n + 1}$ gives too much, so the solution is between $${n}$ and $${n + 1}$:`,
                `$x = ${n + 1}$ 得到的结果太大，所以解在 $${n}$ 和 $${n + 1}$ 之间：`,
              ],
              [`${a} \\times ${n + 1} + ${b} = ${a * (n + 1) + b} > ${c}`],
            ],
          ],
          [
            `Solve exactly: $${a}x = ${c - b}$, so $x = ${exact.toLatex()} = ${mixedLatex(exact)}$, which is between $${n}$ and $${n + 1}$.`,
            `精确求解：$${a}x = ${c - b}$，所以 $x = ${exact.toLatex()} = ${mixedLatex(exact)}$，确实在 $${n}$ 和 $${n + 1}$ 之间。`,
          ],
          [
            [n + 1, "That is the larger of the two whole numbers.", "这是两个整数中较大的那个。"],
            [
              n - 1,
              `$x = ${n}$ also gives too little, so the solution is above $${n}$.`,
              `$x = ${n}$ 得到的结果也太小，所以解比 $${n}$ 大。`,
            ],
            [
              Math.floor(c / a),
              `That divides $${c}$ by $${a}$ without first taking away $${b}$.`,
              `这是用 $${c}$ 除以 $${a}$，却没有先减去 $${b}$。`,
            ],
          ],
        );
      },
      lineFigure({ lo: 3, hi: 6, step: 1, labels: [3, 4, 5, 6], marks: [{ at: 13 / 3, text: "x" }] }, [
        "A number line from 3 to 6 with the solution x marked between 4 and 5.",
        "一条从 3 到 6 的数轴，解 x 标在 4 和 5 之间。",
      ]),
    ),
  ],
};
