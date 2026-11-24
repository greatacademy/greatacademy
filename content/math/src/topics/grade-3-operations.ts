// 3rd Grade Math: the meaning of multiplication and division, the facts up to
// 10 times 10, the properties, word problems, patterns, rounding and three-digit
// addition and subtraction.

import type { Rng, TopicDef } from "@ga/content";
import {
  arrayFigure,
  baseTenFigure,
  countersFigure,
  earlyNames,
  earlyPoint,
  earlyThings,
  earlyTopic,
  jumpsFigure,
  numberLineFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import {
  blockRowsFigure,
  captioned,
  factTriangleFigure,
  hopsFigure,
  type Pair,
  partWholeBarFigure,
  picked,
  solved,
  type Walk,
} from "./early-grades-more-kit.ts";

/** factorPair picks a fact whose first factor comes from the list and whose second runs from 2 to 10. */
function factorPair(rng: Rng, factors: readonly number[]): [number, number] {
  const a = rng.pick(factors);
  const b = rng.int(2, 10);
  return rng.bool() ? [a, b] : [b, a];
}

/** skipCount lists the first `times` multiples of n, starting at n. */
const skipCount = (n: number, times: number) => Array.from({ length: times }, (_, i) => n * (i + 1));

/** factPoints is the pair of knowledge points that ask for products of the listed factors and for a missing factor; fact and missing are the worked examples [a, b] of their explanations, each a times b. */
function factPoints(prefix: string, factors: readonly number[], fact: readonly [number, number], missing: readonly [number, number]) {
  const [fa, fb] = fact;
  const [ma, mb] = missing;
  return [
    earlyPoint(
      `${prefix}-facts`,
      ["Finding the product", "求积"],
      [
        `What is $${fa} \\times ${fb}$? Start from a fact you know: $${fa - 1} \\times ${fb} = ${(fa - 1) * fb}$. One more group of ${fb} makes $${(fa - 1) * fb} + ${fb} = ${fa * fb}$.\n\nCheck: count by ${fb}s ${fa} times: ${skipCount(fb, fa).join(", ")}.\n\n> **Watch out.** $${fa} \\times ${fb}$ is ${fa} groups of ${fb}, not $${fa} + ${fb} = ${fa + fb}$.`,
        `$${fa} \\times ${fb}$ 等于多少？从会的算式出发：$${fa - 1} \\times ${fb} = ${(fa - 1) * fb}$。再加一组 ${fb}：$${(fa - 1) * fb} + ${fb} = ${fa * fb}$。\n\n检验：${fb} 个 ${fb} 个地数 ${fa} 次：${skipCount(fb, fa).join("、")}。\n\n> **注意。** $${fa} \\times ${fb}$ 是 ${fa} 个 ${fb}，不是 $${fa} + ${fb} = ${fa + fb}$。`,
      ],
      (rng) => {
        const [a, b] = factorPair(rng, factors);
        const answer = a * b;
        return solved(
          [`What is $${a} \\times ${b}$?`, `$${a} \\times ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Start from a known fact", "从会的算式出发"],
              [`${a - 1} ${a === 2 ? "group" : "groups"} of ${b}:`, `${a - 1} 个 ${b}：`],
              [`${a - 1} \\times ${b} = ${(a - 1) * b}`],
            ],
            [["Add one more group", "再加一组"], [`One more ${b}:`, `再加一个 ${b}：`], [`${(a - 1) * b} + ${b} = ${answer}`]],
          ],
          [`Count by ${b}s ${a} times: ${skipCount(b, a).join(", ")}.`, `${b} 个 ${b} 个地数 ${a} 次：${skipCount(b, a).join("、")}。`],
          [
            [a + b, "That adds the two numbers. Multiplying counts the groups.", "这是把两个数相加。乘法是数组。"],
            [answer + a, `That is one group of ${a} too many.`, `多了一组 ${a}。`],
            [answer - b, `That is one group of ${b} too few.`, `少了一组 ${b}。`],
          ],
        );
      },
      captioned(arrayFigure(fa, fb), `${fa} rows of ${fb}: ${fa * fb} in all.`, `${fa} 行，每行 ${fb} 个：一共 ${fa * fb} 个。`),
    ),
    earlyPoint(
      `${prefix}-missing-factors`,
      ["Finding a missing factor", "求未知因数"],
      [
        `What goes in the box in $${ma} \\times \\square = ${ma * mb}$? Count by ${ma}s until you reach ${ma * mb}: ${skipCount(ma, mb).join(", ")}. That is ${mb} skips, so the box is ${mb}.\n\nCheck: $${ma} \\times ${mb} = ${ma * mb}$.\n\n> **Watch out.** The box is the number of skips, not the product ${ma * mb}.`,
        `$${ma} \\times \\square = ${ma * mb}$，方框里填几？${ma} 个 ${ma} 个地数，数到 ${ma * mb}：${skipCount(ma, mb).join("、")}。数了 ${mb} 次，所以方框里是 ${mb}。\n\n检验：$${ma} \\times ${mb} = ${ma * mb}$。\n\n> **注意。** 方框里是数的次数，不是积 ${ma * mb}。`,
      ],
      (rng) => {
        const [a, b] = factorPair(rng, factors);
        const product = a * b;
        return solved(
          [`What number goes in the box? $${a} \\times \\square = ${product}$`, `方框里填几？$${a} \\times \\square = ${product}$`],
          b,
          [
            [
              ["Count by the known factor", "用已知因数数"],
              [
                `Count by ${a}s up to ${product}: ${skipCount(a, b).join(", ")}.`,
                `${a} 个 ${a} 个地数到 ${product}：${skipCount(a, b).join("、")}。`,
              ],
            ],
            [
              ["Count the skips", "数次数"],
              [`That is ${b} skips, so the box is ${b}.`, `数了 ${b} 次，所以方框里是 ${b}。`],
            ],
          ],
          [`$${a} \\times ${b} = ${product}$.`, `$${a} \\times ${b} = ${product}$。`],
          [
            [
              product - a,
              "That subtracts. Find how many groups of the known factor make the product.",
              "这是相减。要找几个已知因数合成积。",
            ],
            [product, "That is the product, not the missing factor.", "这是积，不是未知因数。"],
            [a, "That is the factor you already know.", "这是已经知道的因数。"],
          ],
        );
      },
      captioned(
        hopsFigure([0, ...skipCount(ma, mb)]),
        `Skips of ${ma} from 0 to ${ma * mb}: ${mb} skips.`,
        `从 0 开始每次跳 ${ma}，跳到 ${ma * mb}：跳了 ${mb} 次。`,
      ),
    ),
  ];
}

const multiplicationAsEqualGroups = earlyTopic(
  "multiplication-as-equal-groups",
  ["Multiplication as Equal Groups", "乘法表示相同的组"],
  [
    "Read a multiplication as a number of equal groups, and connect it with repeated addition.",
    "把乘法理解成若干相同的组，并与重复相加联系起来。",
  ],
  ["arrays-and-repeated-addition"],
  ["3.OA.A.1"],
  [
    earlyPoint(
      "counting-equal-groups",
      ["Counting equal groups", "数相同的组"],
      [
        "There are 4 bags with 3 apples in each. That is 4 equal groups of 3, so $4 \\times 3 = 12$ apples.\n\nCheck: $3 + 3 + 3 + 3 = 12$.\n\n> **Watch out.** Multiply the number of groups by the size of each group. $4 + 3 = 7$ just adds the two numbers.",
        "有 4 个袋子，每袋 3 个苹果。这是 4 个相同的组，每组 3 个，所以 $4 \\times 3 = 12$ 个苹果。\n\n检验：$3 + 3 + 3 + 3 = 12$。\n\n> **注意。** 要用组数乘每组的个数。$4 + 3 = 7$ 只是把两个数加起来。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const answer = groups * each;
        return solved(
          [
            `There are ${groups} bags with ${each} ${thing.en} in each bag. How many ${thing.en} are there altogether?`,
            `有 ${groups} 个袋子，每个袋子里有 ${each} ${thing.unit}${thing.zh}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [
              ["Find the groups", "找出组"],
              [`${groups} equal groups, ${each} in each.`, `${groups} 个相同的组，每组 ${each} ${thing.unit}。`],
            ],
            [["Multiply", "相乘"], ["Groups times the size of each:", "组数乘每组的个数："], [`${groups} \\times ${each} = ${answer}`]],
          ],
          [
            `Add ${each} ${groups} times: $${Array<number>(groups).fill(each).join(" + ")} = ${answer}$.`,
            `把 ${groups} 个 ${each} 相加：$${Array<number>(groups).fill(each).join(" + ")} = ${answer}$。`,
          ],
          [
            [groups + each, "That adds the two numbers instead of counting the groups.", "这是把两个数相加，没有按组数。"],
            [answer - each, "That is one bag too few.", "少算了一袋。"],
            [answer + each, "That is one bag too many.", "多算了一袋。"],
          ],
          countersFigure(answer, each),
        );
      },
      captioned(countersFigure(12, 3), "12 counters in 4 rows of 3: 4 × 3 = 12.", "12 个圆片，4 行，每行 3 个：4 × 3 = 12。"),
    ),
    earlyPoint(
      "from-repeated-addition-to-multiplication",
      ["From repeated addition to multiplication", "从重复相加到乘法"],
      [
        "Look at $6 + 6 + 6 + 6 + 6$. The 6 is written 5 times, so it is 5 groups of 6: $5 \\times 6 = 30$.\n\nCheck: count by 6s: 6, 12, 18, 24, 30.\n\n> **Watch out.** Count how many times the number is written. That is the number of groups, not the number itself.",
        "看 $6 + 6 + 6 + 6 + 6$。6 写了 5 次，所以是 5 个 6：$5 \\times 6 = 30$。\n\n检验：6 个 6 个地数：6、12、18、24、30。\n\n> **注意。** 要数这个数写了几次，这才是组数，不是这个数本身。",
      ],
      (rng) => {
        const count = rng.int(3, 7);
        const each = rng.int(2, 9);
        const sum = Array(count).fill(`${each}`).join(" + ");
        const asksFactor = rng.bool();
        const counted: Walk = [
          ["Count the addends", "数加数"],
          [`${each} is written ${count} times.`, `${each} 写了 ${count} 次。`],
        ];
        const check: Pair = [
          `Count by ${each}s ${count} times: ${skipCount(each, count).join(", ")}.`,
          `${each} 个 ${each} 个地数 ${count} 次：${skipCount(each, count).join("、")}。`,
        ];
        return asksFactor
          ? solved(
              [
                `The sum $${sum}$ equals $\\square \\times ${each}$. What number goes in the box?`,
                `$${sum}$ 等于 $\\square \\times ${each}$。方框里填几？`,
              ],
              count,
              [
                counted,
                [
                  ["Write the product", "写成乘法"],
                  [`${count} groups of ${each}:`, `${count} 个 ${each}：`],
                  [`${sum} = ${count} \\times ${each}`],
                ],
              ],
              check,
              [
                [each * count, "That is the value of the sum, not the number of groups.", "这是和的值，不是组数。"],
                [count + each, "That adds the two numbers.", "这是把两个数相加。"],
                [each, "That is the size of each group, already in the product.", "这是每组的个数，乘法里已经有了。"],
              ],
            )
          : solved(
              [`Write $${sum}$ as a product and find its value.`, `把 $${sum}$ 写成乘法，并求出它的值。`],
              count * each,
              [
                counted,
                [
                  ["Multiply", "相乘"],
                  [`${count} groups of ${each}:`, `${count} 个 ${each}：`],
                  [`${count} \\times ${each} = ${count * each}`],
                ],
              ],
              check,
              [
                [count + each, "That adds the number of groups and the size of each.", "这把组数和每组的个数相加了。"],
                [(count + 1) * each, `That is one ${each} too many.`, `多了一个 ${each}。`],
                [(count - 1) * each, `That is one ${each} too few.`, `少了一个 ${each}。`],
              ],
            );
      },
      captioned(
        hopsFigure([0, 6, 12, 18, 24, 30]),
        "Five hops of 6 from 0 to 30: 5 × 6 = 30.",
        "从 0 开始跳 5 次，每次 6，到 30：5 × 6 = 30。",
      ),
    ),
  ],
  [
    "Grandma bakes 4 trays of buns with 3 buns on each tray. Instead of counting every bun, we can say 4 groups of 3, and write $4 \\times 3 = 12$.\n\nCheck: $3 + 3 + 3 + 3 = 12$.\n\nIn this lesson we read multiplication as equal groups and link it to repeated addition.",
    "奶奶烤了 4 盘面包，每盘 3 个。不用一个一个地数，可以说 4 个 3，写成 $4 \\times 3 = 12$。\n\n检验：$3 + 3 + 3 + 3 = 12$。\n\n本课我们把乘法看成相同的组，并把它和重复相加联系起来。",
  ],
);

const multiplicationWithArrays = earlyTopic(
  "multiplication-with-arrays",
  ["Multiplication With Arrays", "用点阵表示乘法"],
  [
    "Use rows and columns to see a product, and see why turning an array keeps the product the same.",
    "用行和列来看积，并明白把点阵转一下积不变。",
  ],
  ["multiplication-as-equal-groups"],
  ["3.OA.A.1", "3.OA.A.3"],
  [
    earlyPoint(
      "counting-an-array",
      ["Counting an array", "数点阵"],
      [
        "This array has 3 rows with 5 dots in each row. Each row is an equal group, so there are $3 \\times 5 = 15$ dots.\n\nCheck: count by columns instead: 5 columns of 3 is 3, 6, 9, 12, 15.\n\n> **Watch out.** Count every dot, not just the edges. $3 + 5 = 8$ only adds one row and one column.",
        "这个点阵有 3 行，每行 5 个点。每行是一个相同的组，所以有 $3 \\times 5 = 15$ 个点。\n\n检验：按列数：5 列，每列 3 个，3、6、9、12、15。\n\n> **注意。** 要数所有的点，不只是边上的。$3 + 5 = 8$ 只加了一行和一列。",
      ],
      (rng) => {
        const rows = rng.int(2, 8);
        const columns = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== rows));
        const answer = rows * columns;
        return solved(
          ["How many dots are in this array?", "这个点阵里有多少个点？"],
          answer,
          [
            [
              ["Count rows and columns", "数行和列"],
              [`${rows} rows, with ${columns} dots in each row.`, `${rows} 行，每行 ${columns} 个点。`],
            ],
            [["Multiply", "相乘"], ["Rows times the dots in a row:", "行数乘每行的点数："], [`${rows} \\times ${columns} = ${answer}`]],
          ],
          [
            `Count by columns: ${columns} columns of ${rows} is ${skipCount(rows, columns).join(", ")}.`,
            `按列数：${columns} 列，每列 ${rows} 个：${skipCount(rows, columns).join("、")}。`,
          ],
          [
            [rows + columns, "That adds one row and one column instead of counting every dot.", "这只加了一行和一列，没有数所有的点。"],
            [2 * (rows + columns), "That goes around the edge. Count the dots inside too.", "这是绕边数的。里面的点也要数。"],
            [answer - columns, "That is one row too few.", "少了一行。"],
          ],
          arrayFigure(rows, columns),
        );
      },
      captioned(arrayFigure(3, 5), "An array of 3 rows of 5: 15 dots.", "3 行、每行 5 个的点阵：15 个点。"),
    ),
    earlyPoint(
      "rows-from-the-total",
      ["Rows from the total", "由总数求行数"],
      [
        "There are 24 chairs in rows of 6. Build the rows and count by 6s: 6, 12, 18, 24. That is 4 rows.\n\nCheck: $4 \\times 6 = 24$.\n\n> **Watch out.** The question asks for the number of rows, not the number of chairs in each row.",
        "24 把椅子，每行 6 把。一行一行地摆，6 个 6 个地数：6、12、18、24。一共 4 行。\n\n检验：$4 \\times 6 = 24$。\n\n> **注意。** 问的是有几行，不是每行有几把。",
      ],
      (rng) => {
        const rows = rng.int(2, 9);
        const columns = rng.int(2, 9);
        const total = rows * columns;
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `A shelf holds ${total} ${thing.en} in equal rows, with ${columns} in each row. How many rows are there?`,
            `架子上有 ${total} ${thing.unit}${thing.zh}，排成相同的若干行，每行 ${columns} ${thing.unit}。有多少行？`,
          ],
          rows,
          [
            [
              ["Count by the row", "按每行的个数数"],
              [
                `Count by ${columns}s up to ${total}: ${skipCount(columns, rows).join(", ")}.`,
                `${columns} 个 ${columns} 个地数到 ${total}：${skipCount(columns, rows).join("、")}。`,
              ],
            ],
            [
              ["Count the rows", "数行数"],
              [`That is ${rows} rows.`, `一共 ${rows} 行。`],
            ],
          ],
          [`$${rows} \\times ${columns} = ${total}$.`, `$${rows} \\times ${columns} = ${total}$。`],
          [
            [total - columns, "That subtracts one row. Count how many rows make the total.", "这只减去了一行。要数几行合成总数。"],
            [columns, "That is the number in each row, not the number of rows.", "这是每行的个数，不是行数。"],
            [total, "That is the total, not the number of rows.", "这是总数，不是行数。"],
          ],
        );
      },
      captioned(arrayFigure(4, 6), "24 in rows of 6: 4 rows.", "24 个，每行 6 个：4 行。"),
    ),
  ],
  [
    "The class sets out chairs in 3 rows with 5 chairs in each row. The neat rows make an array, and the total is $3 \\times 5 = 15$ chairs.\n\nCheck: $5 + 5 + 5 = 15$.\n\nIn this lesson we use rows and columns to see a product, and see why turning an array keeps it the same.",
    "全班把椅子摆成 3 行，每行 5 把。整齐的行列就是点阵，总数是 $3 \\times 5 = 15$ 把。\n\n检验：$5 + 5 + 5 = 15$。\n\n本课我们用行和列来看积，并明白把点阵转一下积不变。",
  ],
);

const multiplyingByTwoFiveTen = earlyTopic(
  "multiplying-by-2-5-and-10",
  ["Multiplying by 2, 5 and 10", "乘 2、5 和 10"],
  [
    "Know the products of 2, 5 and 10, using skip counting and the patterns in their last digits.",
    "掌握乘 2、5、10 的积，利用跳着数和末位数字的规律。",
  ],
  ["multiplication-with-arrays"],
  ["3.OA.C.7"],
  factPoints("twos-fives-and-tens", [2, 5, 10], [7, 5], [5, 8]),
  [
    "Each hand has 5 fingers. To count the fingers on 7 hands, count by 5s: 5, 10, 15, 20, 25, 30, 35. So $7 \\times 5 = 35$.\n\nCheck: fives always end in 5 or 0, and 35 ends in 5.\n\nIn this lesson we learn the products of 2, 5 and 10 by skip counting and their patterns.",
    "每只手有 5 根手指。数 7 只手的手指，5 个 5 个地数：5、10、15、20、25、30、35。所以 $7 \\times 5 = 35$。\n\n检验：乘 5 的积末位总是 5 或 0，35 的末位是 5。\n\n本课我们用跳着数和规律来掌握乘 2、5、10 的积。",
  ],
);

const multiplyingByThreeFour = earlyTopic(
  "multiplying-by-3-and-4",
  ["Multiplying by 3 and 4", "乘 3 和 4"],
  ["Know the products of 3 and 4, by building on doubles and adding one more group.", "掌握乘 3 和 4 的积：在二倍的基础上再加一组。"],
  ["multiplying-by-2-5-and-10"],
  ["3.OA.C.7"],
  factPoints("threes-and-fours", [3, 4], [4, 6], [3, 7]),
  [
    "A tricycle has 3 wheels. For 6 tricycles, start with 2 wheels each, $2 \\times 6 = 12$, then add the third wheel on each: $12 + 6 = 18$.\n\nCheck: $3 + 3 + 3 + 3 + 3 + 3 = 18$.\n\nIn this lesson we build the products of 3 and 4 from doubles and one more group.",
    "一辆三轮车有 3 个轮子。6 辆三轮车，先按每辆 2 个算，$2 \\times 6 = 12$，再给每辆加 1 个：$12 + 6 = 18$。\n\n检验：$3 + 3 + 3 + 3 + 3 + 3 = 18$。\n\n本课我们用二倍再加一组的方法掌握乘 3 和 4 的积。",
  ],
);

const multiplyingBySixToNine = earlyTopic(
  "multiplying-by-6-7-8-and-9",
  ["Multiplying by 6, 7, 8 and 9", "乘 6、7、8 和 9"],
  ["Know the harder products, by building them from facts already learned.", "掌握较难的积：用已经学过的算式来构成。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.C.7"],
  factPoints("sixes-to-nines", [6, 7, 8, 9], [6, 8], [9, 6]),
  [
    "A box holds 6 rows of 8 crayons. You may not know $6 \\times 8$ yet, but you know $5 \\times 8 = 40$. One more row of 8 makes 48.\n\nCheck: $8 \\times 6$ is the same, and $8 + 8 + 8 + 8 + 8 + 8 = 48$.\n\nIn this lesson we build the harder products from facts we already know.",
    "一盒蜡笔有 6 行，每行 8 支。你也许还不会 $6 \\times 8$，但你会 $5 \\times 8 = 40$。再加一行 8 支，就是 48。\n\n检验：$8 + 8 + 8 + 8 + 8 + 8 = 48$。\n\n本课我们用已经会的算式来构成较难的积。",
  ],
);

const multiplyingByZeroAndOne = earlyTopic(
  "multiplying-by-0-and-1",
  ["Multiplying by 0 and 1", "乘 0 和 1"],
  ["See why a product with 0 is 0, and a product with 1 keeps the other number.", "明白为什么和 0 相乘得 0，和 1 相乘得原来的数。"],
  ["multiplying-by-2-5-and-10"],
  ["3.OA.B.5"],
  [
    earlyPoint(
      "products-with-zero-and-one",
      ["Products with 0 and 1", "含 0 和 1 的积"],
      [
        "Five empty plates hold no cookies: 5 groups of 0, so $5 \\times 0 = 0$. One plate of 7 cookies holds 7: one group of 7, so $1 \\times 7 = 7$.\n\nCheck: $0 + 0 + 0 + 0 + 0 = 0$.\n\n> **Watch out.** $5 \\times 0$ is 0, not 5. Multiplying by 0 is not the same as adding 0.",
        "5 个空盘子里没有饼干：5 个 0，所以 $5 \\times 0 = 0$。一个盘子里有 7 块饼干，就是 7：一个 7，所以 $1 \\times 7 = 7$。\n\n检验：$0 + 0 + 0 + 0 + 0 = 0$。\n\n> **注意。** $5 \\times 0$ 是 0，不是 5。乘 0 和加 0 不一样。",
      ],
      (rng) => {
        const n = rng.int(2, 999);
        const zero = rng.bool();
        const first = rng.bool();
        const k = zero ? 0 : 1;
        const shown = first ? `${n} \\times ${k}` : `${k} \\times ${n}`;
        return zero
          ? solved(
              [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
              0,
              [
                [
                  ["Think of groups", "想一想组"],
                  [
                    first ? `${n} groups with nothing in each.` : `No groups of ${n} at all.`,
                    first ? `${n} 组，每组什么也没有。` : `一组 ${n} 也没有。`,
                  ],
                ],
                [["Find the total", "求总数"], ["Nothing in all:", "一共什么也没有："], [`${shown} = 0`]],
              ],
              [
                "Any number of zeros added together is still 0, and no groups at all hold nothing.",
                "多少个 0 加起来还是 0；一组也没有，就什么也没有。",
              ],
              [
                [
                  n,
                  "That treats times 0 like plus 0. Groups of nothing make nothing.",
                  "这是把乘 0 当成加 0 了。几组空的，还是什么也没有。",
                ],
                [1, "A product with 0 is 0, not 1.", "和 0 相乘得 0，不是 1。"],
                [n + 1, "That adds. Multiplying by 0 always gives 0.", "这是相加。乘 0 总是得 0。"],
              ],
            )
          : solved(
              [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
              n,
              [
                [
                  ["Think of groups", "想一想组"],
                  [first ? `${n} groups of one.` : `One group of ${n}.`, first ? `${n} 个 1。` : `一个 ${n}。`],
                ],
                [["Find the total", "求总数"], [`That is ${n}:`, `就是 ${n}：`], [`${shown} = ${n}`]],
              ],
              [`One group of ${n} is just ${n}, and ${n} ones also make ${n}.`, `一个 ${n} 就是 ${n}，${n} 个 1 也是 ${n}。`],
              [
                [n + 1, "That adds 1 instead of multiplying by 1.", "这是加 1，不是乘 1。"],
                [1, `One group of ${n} is ${n}, not 1.`, `一个 ${n} 是 ${n}，不是 1。`],
                [0, "Only multiplying by 0 gives 0.", "只有乘 0 才得 0。"],
              ],
            );
      },
      captioned(arrayFigure(1, 7), "One row of 7 dots: 1 × 7 = 7.", "一行 7 个点：1 × 7 = 7。"),
    ),
    earlyPoint(
      "choosing-the-factor-zero-or-one",
      ["Choosing the factor 0 or 1", "选择因数 0 或 1"],
      [
        "In $8 \\times \\square = 8$ the product is 8 itself, so there is one group of 8: the box is 1. In $8 \\times \\square = 0$ the product is 0, so there are no groups: the box is 0.\n\nCheck: $8 \\times 1 = 8$ and $8 \\times 0 = 0$.\n\n> **Watch out.** For $8 \\times \\square = 8$ the box is 1, not 0. Adding 0 keeps a number, but multiplying by 0 makes 0.",
        "$8 \\times \\square = 8$ 中，积就是 8 本身，所以是一组 8：方框里是 1。$8 \\times \\square = 0$ 中，积是 0，所以一组也没有：方框里是 0。\n\n检验：$8 \\times 1 = 8$，$8 \\times 0 = 0$。\n\n> **注意。** $8 \\times \\square = 8$ 的方框里是 1，不是 0。加 0 数不变，乘 0 却得 0。",
      ],
      (rng) => {
        const n = rng.int(2, 500);
        const zero = rng.bool();
        const answer = zero ? 0 : 1;
        const product = zero ? 0 : n;
        return solved(
          [`What number goes in the box? $${n} \\times \\square = ${product}$`, `方框里填几？$${n} \\times \\square = ${product}$`],
          answer,
          zero
            ? [
                [
                  ["Look at the product", "看积"],
                  ["The product is 0.", "积是 0。"],
                ],
                [
                  ["Find the factor", "求因数"],
                  [`Only 0 groups of ${n} make 0, so the box is 0.`, `只有 0 个 ${n} 才是 0，所以方框里是 0。`],
                ],
              ]
            : [
                [
                  ["Look at the product", "看积"],
                  [`The product is ${n}, the same as the other factor.`, `积是 ${n}，和另一个因数一样。`],
                ],
                [
                  ["Find the factor", "求因数"],
                  [`One group of ${n} is ${n}, so the box is 1.`, `一个 ${n} 就是 ${n}，所以方框里是 1。`],
                ],
              ],
          [`$${n} \\times ${answer} = ${product}$.`, `$${n} \\times ${answer} = ${product}$。`],
          zero
            ? [
                [1, `${n} times 1 is ${n}, not 0.`, `${n} 乘 1 是 ${n}，不是 0。`],
                [n, "That is the other factor, not the missing one.", "这是另一个因数，不是未知因数。"],
              ]
            : [
                [0, `${n} times 0 is 0, not ${n}.`, `${n} 乘 0 是 0，不是 ${n}。`],
                [n, `${n} times ${n} is far more than ${n}.`, `${n} 乘 ${n} 比 ${n} 大得多。`],
                [2, `${n} times 2 is double ${n}.`, `${n} 乘 2 是 ${n} 的两倍。`],
              ],
        );
      },
      captioned(arrayFigure(1, 8), "One row of 8: one group of 8 is 8.", "一行 8 个：一个 8 就是 8。"),
    ),
  ],
  [
    "Mia has 3 empty boxes. How many pencils are in them? Each box holds 0, so 3 groups of 0 is $3 \\times 0 = 0$ pencils.\n\nCheck: $0 + 0 + 0 = 0$.\n\nIn this lesson we see why a product with 0 is 0, and a product with 1 keeps the other number.",
    "Mia 有 3 个空盒子。里面有几支铅笔？每盒 0 支，3 个 0 就是 $3 \\times 0 = 0$ 支。\n\n检验：$0 + 0 + 0 = 0$。\n\n本课我们明白为什么和 0 相乘得 0，和 1 相乘得原来的数。",
  ],
);

const propertiesOfMultiplication = earlyTopic(
  "properties-of-multiplication",
  ["Order and Grouping in Multiplication", "乘法的顺序与结合"],
  ["Change the order or the grouping of factors to make a product easier.", "改变因数的顺序或组合方式，使计算更容易。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.B.5"],
  [
    earlyPoint(
      "swapping-the-factors",
      ["Swapping the factors", "交换因数"],
      [
        "An array of 3 rows of 5 has 15 dots. Turn it on its side and it is 5 rows of 3, with the same 15 dots. So $3 \\times 5 = 5 \\times 3$.\n\nCheck: $5 + 5 + 5 = 15$ and $3 + 3 + 3 + 3 + 3 = 15$.\n\n> **Watch out.** Swapping the factors keeps the product. It does not change it to $3 + 5$.",
        "3 行、每行 5 个的点阵有 15 个点。把它转过来，就是 5 行、每行 3 个，还是 15 个点。所以 $3 \\times 5 = 5 \\times 3$。\n\n检验：$5 + 5 + 5 = 15$，$3 + 3 + 3 + 3 + 3 = 15$。\n\n> **注意。** 交换因数，积不变，不会变成 $3 + 5$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a));
        const asksBox = rng.bool();
        const turn: Walk = [
          ["Turn the array", "把点阵转过来"],
          [
            `${a} rows of ${b} turned on its side is ${b} rows of ${a}, with the same dots.`,
            `${a} 行 ${b} 个转过来是 ${b} 行 ${a} 个，点数一样。`,
          ],
        ];
        return asksBox
          ? solved(
              [
                `What number goes in the box? $${a} \\times ${b} = ${b} \\times \\square$`,
                `方框里填几？$${a} \\times ${b} = ${b} \\times \\square$`,
              ],
              a,
              [
                turn,
                [
                  ["Match the factors", "对应因数"],
                  [`The same two factors swapped: the box is ${a}.`, `同样的两个因数换了位置：方框里是 ${a}。`],
                  [`${a} \\times ${b} = ${b} \\times ${a}`],
                ],
              ],
              [
                `Both sides are ${a * b}: $${a} \\times ${b} = ${a * b}$ and $${b} \\times ${a} = ${a * b}$.`,
                `两边都是 ${a * b}：$${a} \\times ${b} = ${a * b}$，$${b} \\times ${a} = ${a * b}$。`,
              ],
              [
                [b, `That would make ${b} times ${b}, a different product.`, `那就成了 ${b} 乘 ${b}，积不一样。`],
                [a * b, "That is the product, not the missing factor.", "这是积，不是未知因数。"],
                [a + b, "That adds the factors.", "这是把因数相加。"],
              ],
              arrayFigure(a, b),
            )
          : solved(
              [
                `Given that $${a} \\times ${b} = ${a * b}$, what is $${b} \\times ${a}$?`,
                `已知 $${a} \\times ${b} = ${a * b}$，$${b} \\times ${a}$ 等于多少？`,
              ],
              a * b,
              [
                turn,
                [["Use the known fact", "用已知的算式"], ["The product stays the same:", "积不变："], [`${b} \\times ${a} = ${a * b}`]],
              ],
              [`Count by ${a}s ${b} times: ${skipCount(a, b).join(", ")}.`, `${a} 个 ${a} 个地数 ${b} 次：${skipCount(a, b).join("、")}。`],
              [
                [a + b, "That adds the factors.", "这是把因数相加。"],
                [a * b + a, `That is one group of ${a} too many.`, `多了一组 ${a}。`],
                [a * b - b, `That is one group of ${b} too few.`, `少了一组 ${b}。`],
              ],
              arrayFigure(a, b),
            );
      },
      captioned(
        arrayFigure(3, 5),
        "3 rows of 5 dots; turned, it is 5 rows of 3: 15 either way.",
        "3 行 5 个点；转过来是 5 行 3 个：都是 15。",
      ),
    ),
    earlyPoint(
      "grouping-three-factors",
      ["Grouping three factors", "组合三个因数"],
      [
        "Find $4 \\times 2 \\times 5$. Look for an easy pair: $2 \\times 5 = 10$. Then $4 \\times 10 = 40$.\n\nCheck: group the other way: $4 \\times 2 = 8$ and $8 \\times 5 = 40$.\n\n> **Watch out.** Use all three factors. $2 \\times 5 = 10$ is only the first step.",
        "求 $4 \\times 2 \\times 5$。找容易的一对：$2 \\times 5 = 10$。再算 $4 \\times 10 = 40$。\n\n检验：换一种组合：$4 \\times 2 = 8$，$8 \\times 5 = 40$。\n\n> **注意。** 三个因数都要用。$2 \\times 5 = 10$ 只是第一步。",
      ],
      (rng) => {
        const [a, b] = rng.pick([
          [2, 5],
          [5, 2],
          [2, 3],
          [3, 2],
          [2, 4],
          [4, 2],
          [3, 3],
        ]) as [number, number];
        const c = rng.int(2, 9);
        const inFront = rng.bool();
        const shown = inFront ? `${c} \\times ${a} \\times ${b}` : `${a} \\times ${c} \\times ${b}`;
        const answer = a * b * c;
        return solved(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [
            [
              ["Pick an easy pair", "选容易的一对"],
              [`Multiply ${a} and ${b} first:`, `先乘 ${a} 和 ${b}：`],
              [`${a} \\times ${b} = ${a * b}`],
            ],
            [["Multiply by the factor left", "再乘剩下的因数"], [`Then the ${c}:`, `再乘 ${c}：`], [`${a * b} \\times ${c} = ${answer}`]],
          ],
          [
            `Group the other way: $${a} \\times ${c} = ${a * c}$ and $${a * c} \\times ${b} = ${answer}$.`,
            `换一种组合：$${a} \\times ${c} = ${a * c}$，$${a * c} \\times ${b} = ${answer}$。`,
          ],
          [
            [a + b + c, "That adds the three factors.", "这是把三个因数相加。"],
            [a * b + c, `That adds the ${c} instead of multiplying by it.`, `这是加上 ${c}，应该乘 ${c}。`],
            [a * b, `That stops after the first pair. Multiply by ${c} too.`, `这只算了第一对，还要乘 ${c}。`],
          ],
        );
      },
      captioned(arrayFigure(2, 5), "2 rows of 5 make 10; four of these make 40.", "2 行 5 个是 10；四个这样的就是 40。"),
    ),
  ],
  [
    "Sam has 4 boxes, each with 2 rows of 5 eggs. He can work out $2 \\times 5 = 10$ eggs in a box first, and then $4 \\times 10 = 40$.\n\nCheck: $4 \\times 2 = 8$ rows, and $8 \\times 5 = 40$ eggs too.\n\nIn this lesson we change the order or the grouping of factors to make a product easier.",
    "Sam 有 4 盒鸡蛋，每盒 2 行、每行 5 个。他可以先算一盒 $2 \\times 5 = 10$ 个，再算 $4 \\times 10 = 40$ 个。\n\n检验：$4 \\times 2 = 8$ 行，$8 \\times 5 = 40$ 个，也一样。\n\n本课我们改变因数的顺序或组合方式，让乘法更容易。",
  ],
);

const splittingAFactor = earlyTopic(
  "splitting-a-factor-to-multiply",
  ["Splitting a Factor to Multiply", "拆开因数来乘"],
  ["Break a factor into two easier parts, multiply each, and add the results.", "把一个因数拆成两个容易的部分，分别相乘，再把结果相加。"],
  ["multiplying-by-6-7-8-and-9"],
  ["3.OA.B.5", "3.MD.C.7"],
  [
    earlyPoint(
      "the-missing-part-of-a-split",
      ["The missing part of a split", "拆分中缺少的部分"],
      [
        "Split 8 into 5 and 3 to find $4 \\times 8$: $4 \\times 8 = 4 \\times 5 + 4 \\times 3 = 20 + 12 = 32$.\n\nCheck: count by 4s eight times: 4, 8, 12, 16, 20, 24, 28, 32.\n\n> **Watch out.** The two parts must add up to the factor you split. 5 and 3 make 8, so the missing part with 5 is 3.",
        "把 8 拆成 5 和 3 来求 $4 \\times 8$：$4 \\times 8 = 4 \\times 5 + 4 \\times 3 = 20 + 12 = 32$。\n\n检验：4 个 4 个地数 8 次：4、8、12、16、20、24、28、32。\n\n> **注意。** 两部分加起来要等于拆开的那个因数。5 和 3 合成 8，所以和 5 搭配的是 3。",
      ],
      (rng) => {
        const a = rng.int(3, 9);
        const big = rng.int(6, 9);
        const part = rng.pick([2, 5]);
        const rest = big - part;
        return solved(
          [
            `What number goes in the box? $${a} \\times ${big} = ${a} \\times ${part} + ${a} \\times \\square$`,
            `方框里填几？$${a} \\times ${big} = ${a} \\times ${part} + ${a} \\times \\square$`,
          ],
          rest,
          [
            [
              ["See what was split", "看拆的是哪个数"],
              [`${big} was split, and one part is ${part}.`, `拆的是 ${big}，一部分是 ${part}。`],
            ],
            [
              ["Find the other part", "求另一部分"],
              [`The parts add up to ${big}:`, `两部分合起来是 ${big}：`],
              [`${big} - ${part} = ${rest}`],
            ],
          ],
          [
            `$${a} \\times ${part} + ${a} \\times ${rest} = ${a * part} + ${a * rest} = ${a * big}$, which is $${a} \\times ${big}$.`,
            `$${a} \\times ${part} + ${a} \\times ${rest} = ${a * part} + ${a * rest} = ${a * big}$，正是 $${a} \\times ${big}$。`,
          ],
          [
            [big, `That is the whole factor. The two parts must add up to ${big}.`, `这是整个因数。两部分加起来才是 ${big}。`],
            [part, "That is the part already written.", "这是已经写出的部分。"],
            [a, "That is the other factor, which is not split.", "这是另一个因数，它没有拆。"],
            [big + part, "That adds the parts. Subtract the known part from the factor.", "这是相加。要用因数减去已知部分。"],
          ],
          arrayFigure(a, big),
        );
      },
      captioned(
        arrayFigure(4, 8),
        "4 rows of 8: the first 5 columns make 20 and the last 3 make 12.",
        "4 行 8 个：前 5 列是 20，后 3 列是 12。",
      ),
    ),
    {
      ...earlyPoint(
        "multiplying-by-splitting-a-teen-factor",
        ["Multiplying by a number past ten", "乘大于十的数"],
        [
          "Find $6 \\times 14$. Split 14 into 10 and 4. Then $6 \\times 10 = 60$ and $6 \\times 4 = 24$, and $60 + 24 = 84$.\n\nCheck: $6 \\times 14$ is 14 added 6 times: 14, 28, 42, 56, 70, 84.\n\n> **Watch out.** Multiply both parts. $6 \\times 10 + 4 = 64$ forgets to multiply the 4.",
          "求 $6 \\times 14$。把 14 拆成 10 和 4。$6 \\times 10 = 60$，$6 \\times 4 = 24$，$60 + 24 = 84$。\n\n检验：$6 \\times 14$ 是 6 个 14：14、28、42、56、70、84。\n\n> **注意。** 两部分都要乘。$6 \\times 10 + 4 = 64$ 忘了把 4 也乘上。",
        ],
        (rng) => {
          const a = rng.int(2, 9);
          const rest = rng.int(1, 9);
          const big = 10 + rest;
          const answer = a * big;
          return solved(
            [`Split ${big} into 10 and ${rest} to find $${a} \\times ${big}$.`, `把 ${big} 拆成 10 和 ${rest}，求 $${a} \\times ${big}$。`],
            answer,
            [
              [["Multiply the ten", "乘 10"], [`${a} times 10:`, `${a} 乘 10：`], [`${a} \\times 10 = ${a * 10}`]],
              [["Multiply the rest", "乘剩下的部分"], [`${a} times ${rest}:`, `${a} 乘 ${rest}：`], [`${a} \\times ${rest} = ${a * rest}`]],
              [["Add the parts", "两部分相加"], ["Together:", "合起来："], [`${a * 10} + ${a * rest} = ${answer}`]],
            ],
            [
              `Count by ${big}s ${a} times: ${skipCount(big, a).join(", ")}.`,
              `${big} 个 ${big} 个地数 ${a} 次：${skipCount(big, a).join("、")}。`,
            ],
            [
              [a * 10, `That multiplies only the 10. Multiply the ${rest} too.`, `这只乘了 10，还要乘 ${rest}。`],
              [a + big, "That adds the factors.", "这是把因数相加。"],
              [a * 10 + rest, `That adds the ${rest} instead of multiplying it by ${a}.`, `这是加上 ${rest}，应该用 ${a} 乘它。`],
            ],
          );
        },
      ),
      figure: gradeDrawings["adding-the-two-parts"],
    },
  ],
  [
    "A garden has 4 rows of 8 plants. Count the plants in two easy parts: 4 rows of 5 is 20, and 4 rows of 3 is 12. Together that is 32.\n\nCheck: $4 \\times 8 = 32$.\n\nIn this lesson we break a factor into easier parts, multiply each, and add.",
    "一块菜地有 4 行，每行 8 棵。分成容易的两部分来数：4 行 5 棵是 20，4 行 3 棵是 12。合起来是 32。\n\n检验：$4 \\times 8 = 32$。\n\n本课我们把一个因数拆成容易的部分，分别相乘，再相加。",
  ],
);

const multiplyingByMultiplesOfTen = earlyTopic(
  "multiplying-by-multiples-of-10",
  ["Multiplying by Multiples of 10", "乘整十数"],
  ["Multiply a one-digit number by 10, 20, up to 90, using a known fact and place value.", "用已知的算式和数位，把一位数乘 10、20……90。"],
  ["multiplying-by-6-7-8-and-9"],
  ["3.NBT.A.3"],
  [
    earlyPoint(
      "products-with-a-multiple-of-ten",
      ["Products with a multiple of ten", "乘整十数的积"],
      [
        "Find $3 \\times 40$. 40 is 4 tens, so this is 3 groups of 4 tens: $3 \\times 4 = 12$ tens, which is 120.\n\nCheck: $40 + 40 + 40 = 120$.\n\n> **Watch out.** The answer counts tens. 12 tens is 120, not 12.",
        "求 $3 \\times 40$。40 是 4 个十，所以是 3 组 4 个十：$3 \\times 4 = 12$ 个十，也就是 120。\n\n检验：$40 + 40 + 40 = 120$。\n\n> **注意。** 答案数的是十。12 个十是 120，不是 12。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const tens = rng.int(2, 9);
        const answer = a * tens * 10;
        return solved(
          [`What is $${a} \\times ${tens * 10}$?`, `$${a} \\times ${tens * 10}$ 等于多少？`],
          answer,
          [
            [
              ["Count the tens", "数十"],
              [`${tens * 10} is ${tens} tens, so use the fact:`, `${tens * 10} 是 ${tens} 个十，用算式：`],
              [`${a} \\times ${tens} = ${a * tens}`],
            ],
            [
              ["Write the number", "写成数"],
              [`${a * tens} tens is ${answer}.`, `${a * tens} 个十是 ${answer}。`],
            ],
          ],
          [
            `Add ${tens * 10} ${a} times: $${Array<number>(a)
              .fill(tens * 10)
              .join(" + ")} = ${answer}$.`,
            `把 ${a} 个 ${tens * 10} 相加：$${Array<number>(a)
              .fill(tens * 10)
              .join(" + ")} = ${answer}$。`,
          ],
          [
            [a * tens, `That is the number of tens. ${a * tens} tens is ${answer}.`, `这是十的个数。${a * tens} 个十是 ${answer}。`],
            [answer * 10, "That has one zero too many.", "多写了一个 0。"],
            [a + tens * 10, "That adds instead of multiplying.", "这是相加，不是相乘。"],
          ],
          blockRowsFigure(Array.from({ length: a }, (): [number, number, number] => [0, tens, 0])),
        );
      },
      captioned(
        blockRowsFigure([
          [0, 4, 0],
          [0, 4, 0],
          [0, 4, 0],
        ]),
        "3 rows of 4 tens: 12 tens, or 120.",
        "3 行，每行 4 个十：12 个十，也就是 120。",
      ),
    ),
    earlyPoint(
      "word-problems-with-multiples-of-ten",
      ["Word problems with multiples of ten", "整十数的应用题"],
      [
        "A store has 6 boxes with 30 pens in each. That is 6 groups of 3 tens: $6 \\times 3 = 18$ tens, so 180 pens.\n\nCheck: $30 + 30 + 30 + 30 + 30 + 30 = 180$.\n\n> **Watch out.** Say the answer in tens first, 18 tens, so you do not lose a zero or add an extra one.",
        "商店有 6 箱笔，每箱 30 支。这是 6 组 3 个十：$6 \\times 3 = 18$ 个十，所以是 180 支。\n\n检验：$30 + 30 + 30 + 30 + 30 + 30 = 180$。\n\n> **注意。** 先说出有几个十，18 个十，就不会少写或多写 0。",
      ],
      (rng) => {
        const boxes = rng.int(2, 9);
        const tens = rng.int(2, 9);
        const thing = rng.pick(earlyThings);
        const each = tens * 10;
        const answer = boxes * each;
        return solved(
          [
            `A store has ${boxes} boxes with ${each} ${thing.en} in each box. How many ${thing.en} does it have?`,
            `商店有 ${boxes} 箱${thing.zh}，每箱 ${each} ${thing.unit}。一共有多少${thing.unit}${thing.zh}？`,
          ],
          answer,
          [
            [
              ["Find the groups", "找出组"],
              [`${boxes} boxes of ${each}, and ${each} is ${tens} tens.`, `${boxes} 箱，每箱 ${each}，${each} 是 ${tens} 个十。`],
            ],
            [["Count the tens", "数十"], ["Use the fact:", "用算式："], [`${boxes} \\times ${tens} = ${boxes * tens}`]],
            [
              ["Write the number", "写成数"],
              [`${boxes * tens} tens is ${answer}.`, `${boxes * tens} 个十是 ${answer}。`],
            ],
          ],
          [
            `Add ${each} ${boxes} times: $${Array<number>(boxes).fill(each).join(" + ")} = ${answer}$.`,
            `把 ${boxes} 个 ${each} 相加：$${Array<number>(boxes).fill(each).join(" + ")} = ${answer}$。`,
          ],
          [
            [boxes * tens, `That is the number of tens, not the number of ${thing.en}.`, `这是十的个数，不是${thing.zh}的个数。`],
            [boxes + each, "That adds instead of multiplying.", "这是相加，不是相乘。"],
            [answer * 10, "That has one zero too many.", "多写了一个 0。"],
          ],
        );
      },
      captioned(
        blockRowsFigure([
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 0],
          [0, 3, 0],
        ]),
        "6 rows of 3 tens: 18 tens, or 180.",
        "6 行，每行 3 个十：18 个十，也就是 180。",
      ),
    ),
  ],
  [
    "Stickers come in sheets of 20. Lea buys 3 sheets. 20 is 2 tens, so 3 sheets are $3 \\times 2 = 6$ tens, which is 60 stickers.\n\nCheck: $20 + 20 + 20 = 60$.\n\nIn this lesson we multiply by 10, 20 and up to 90 using a known fact and place value.",
    "贴纸一张 20 个。Lea 买了 3 张。20 是 2 个十，所以 3 张是 $3 \\times 2 = 6$ 个十，也就是 60 个贴纸。\n\n检验：$20 + 20 + 20 = 60$。\n\n本课我们用已知的算式和数位来乘 10、20……90。",
  ],
);

const divisionAsSharing = earlyTopic(
  "division-as-sharing",
  ["Division as Sharing", "除法表示平均分"],
  ["Share a number of things equally, and find how many each group gets.", "把一些东西平均分，求每组得到多少。"],
  ["multiplication-with-arrays"],
  ["3.OA.A.2"],
  [
    earlyPoint(
      "sharing-into-equal-groups",
      ["Sharing into equal groups", "平均分成几组"],
      [
        "Share 12 grapes equally among 3 friends. Hand them out one at a time, round and round, until none are left. Each friend gets 4, so $12 \\div 3 = 4$.\n\nCheck: $3 \\times 4 = 12$.\n\n> **Watch out.** The answer is how many each friend gets, not the number of friends.",
        "把 12 颗葡萄平均分给 3 个朋友。一颗一颗地发，一轮一轮地发，直到发完。每人得到 4 颗，所以 $12 \\div 3 = 4$。\n\n检验：$3 \\times 4 = 12$。\n\n> **注意。** 答案是每人得到几颗，不是有几个朋友。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const total = groups * each;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return solved(
          [
            `${name} shares ${total} ${thing.en} equally among ${groups} friends. How many does each friend get?`,
            `${name} 把 ${total} ${thing.unit}${thing.zh}平均分给 ${groups} 个朋友。每个朋友得到多少${thing.unit}？`,
          ],
          each,
          [
            [
              ["Write the division", "列除法"],
              [`${total} shared into ${groups} equal groups:`, `${total} 平均分成 ${groups} 份：`],
              [`${total} \\div ${groups} = \\square`],
            ],
            [
              ["Use a times fact", "用乘法算式"],
              [`${groups} times what makes ${total}?`, `${groups} 乘几得 ${total}？`],
              [`${groups} \\times ${each} = ${total}`],
            ],
          ],
          [
            `${groups} friends with ${each} each have $${groups} \\times ${each} = ${total}$.`,
            `${groups} 个朋友每人 ${each} ${thing.unit}，一共 $${groups} \\times ${each} = ${total}$。`,
          ],
          [
            [total - groups, "That subtracts. Sharing equally is dividing.", "这是相减。平均分要用除法。"],
            [groups, "That is the number of friends, not each friend's share.", "这是朋友的人数，不是每人分到的。"],
            [total + groups, "That adds. Sharing equally is dividing.", "这是相加。平均分要用除法。"],
          ],
        );
      },
      captioned(countersFigure(12, 4), "12 counters shared into 3 rows: 4 in each row.", "12 个圆片平均分成 3 行：每行 4 个。"),
    ),
    earlyPoint(
      "reading-a-share-from-a-picture",
      ["Reading a share from a picture", "从图中读出平均分"],
      [
        "This picture shows 15 counters in 3 equal rows. Each row is one group's share, and each row has 5. So $15 \\div 3 = 5$.\n\nCheck: $5 + 5 + 5 = 15$.\n\n> **Watch out.** Count the counters in one row for the share. The number of rows is the number of groups.",
        "图中 15 个圆片平均排成 3 行。每行是一组分到的，每行 5 个。所以 $15 \\div 3 = 5$。\n\n检验：$5 + 5 + 5 = 15$。\n\n> **注意。** 每组分到几个，要数一行里的圆片。行数是组数。",
      ],
      (rng) => {
        const rows = rng.int(2, 6);
        const each = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== rows));
        const total = rows * each;
        return solved(
          [
            `The ${total} counters are shared equally into ${rows} rows, as shown. What is $${total} \\div ${rows}$?`,
            `如图，${total} 个圆片平均分成 ${rows} 行。$${total} \\div ${rows}$ 等于多少？`,
          ],
          each,
          [
            [
              ["Find the groups", "找出组"],
              [`Each of the ${rows} rows is one group.`, `${rows} 行中每行是一组。`],
            ],
            [
              ["Count one row", "数一行"],
              [`One row holds ${each} counters, so:`, `一行有 ${each} 个圆片，所以：`],
              [`${total} \\div ${rows} = ${each}`],
            ],
          ],
          [
            `Add the rows: $${Array<number>(rows).fill(each).join(" + ")} = ${total}$.`,
            `把各行加起来：$${Array<number>(rows).fill(each).join(" + ")} = ${total}$。`,
          ],
          [
            [rows, "That is the number of rows, not the counters in each row.", "这是行数，不是每行的圆片数。"],
            [total - rows, "That subtracts the rows from the total.", "这是用总数减行数。"],
            [total, "That is all the counters, not one row.", "这是全部圆片，不是一行。"],
          ],
          countersFigure(total, each),
        );
      },
      captioned(countersFigure(15, 5), "15 counters in 3 rows of 5.", "15 个圆片，3 行，每行 5 个。"),
    ),
  ],
  [
    "Three children share 12 grapes. They hand them out one each, round and round, until the bowl is empty. Each child ends up with 4.\n\nCheck: $4 + 4 + 4 = 12$.\n\nIn this lesson we share things equally and find how many each group gets.",
    "三个孩子分 12 颗葡萄。他们一人一颗地发，一轮一轮，直到碗空了。每人最后得到 4 颗。\n\n检验：$4 + 4 + 4 = 12$。\n\n本课我们把东西平均分，求每组得到多少。",
  ],
);

const divisionAsGrouping = earlyTopic(
  "division-as-making-groups",
  ["Division as Making Groups", "除法表示分组"],
  ["Find how many groups of a given size can be made.", "求可以分成多少个大小一定的组。"],
  ["division-as-sharing"],
  ["3.OA.A.2"],
  [
    earlyPoint(
      "how-many-groups",
      ["How many groups", "可以分几组"],
      [
        "There are 20 apples and each bag holds 4. Fill one bag at a time: 4, 8, 12, 16, 20. That is 5 bags, so $20 \\div 4 = 5$.\n\nCheck: $5 \\times 4 = 20$.\n\n> **Watch out.** Here the size of each group is known. The answer is the number of bags, not the 4 in each bag.",
        "有 20 个苹果，每袋装 4 个。一袋一袋地装：4、8、12、16、20。一共 5 袋，所以 $20 \\div 4 = 5$。\n\n检验：$5 \\times 4 = 20$。\n\n> **注意。** 这里知道的是每组的个数。答案是袋数，不是每袋的 4 个。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const groups = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== each));
        const total = each * groups;
        const thing = rng.pick(earlyThings);
        return solved(
          [
            `There are ${total} ${thing.en}. Each bag holds ${each} of them. How many bags are needed for all of them?`,
            `有 ${total} ${thing.unit}${thing.zh}。每个袋子装 ${each} ${thing.unit}。装完需要多少个袋子？`,
          ],
          groups,
          [
            [
              ["Fill bags one at a time", "一袋一袋地装"],
              [
                `Count by ${each}s up to ${total}: ${skipCount(each, groups).join(", ")}.`,
                `${each} 个 ${each} 个地数到 ${total}：${skipCount(each, groups).join("、")}。`,
              ],
            ],
            [["Count the bags", "数袋数"], [`That is ${groups} bags:`, `一共 ${groups} 袋：`], [`${total} \\div ${each} = ${groups}`]],
          ],
          [`$${groups} \\times ${each} = ${total}$.`, `$${groups} \\times ${each} = ${total}$。`],
          [
            [each, "That is how many go in each bag, not the number of bags.", "这是每袋装几个，不是袋数。"],
            [total - each, "That takes away only one bag.", "这只拿走了一袋。"],
            [total, "That is all the things, not the number of bags.", "这是全部的个数，不是袋数。"],
          ],
        );
      },
      captioned(countersFigure(20, 4), "20 counters in groups of 4: 5 groups.", "20 个圆片，每组 4 个：5 组。"),
    ),
    {
      ...earlyPoint(
        "division-by-repeated-subtraction",
        ["Division by repeated subtraction", "用连减做除法"],
        [
          "Find $12 \\div 3$ on a number line. Start at 12 and jump back 3 each time: 9, 6, 3, 0. That is 4 jumps, so $12 \\div 3 = 4$.\n\nCheck: $4 \\times 3 = 12$.\n\n> **Watch out.** The answer is the number of jumps, not the size of each jump.",
          "在数轴上求 $12 \\div 3$。从 12 开始，每次往回跳 3：9、6、3、0。跳了 4 次，所以 $12 \\div 3 = 4$。\n\n检验：$4 \\times 3 = 12$。\n\n> **注意。** 答案是跳的次数，不是每次跳多远。",
        ],
        (rng) => {
          const each = rng.int(2, 6);
          const jumps = rng.pick([2, 3, 4, 5, 6, 7, 8].filter((v) => v !== each));
          const total = each * jumps;
          const stops = Array.from({ length: jumps + 1 }, (_, i) => total - i * each);
          return {
            ...solved(
              [
                `On the number line, start at ${total} and jump back by ${each} each time. How many jumps reach 0?`,
                `在数轴上，从 ${total} 开始，每次向回跳 ${each}。跳多少次到 0？`,
              ],
              jumps,
              [
                [
                  ["Jump back", "往回跳"],
                  [`From ${total}: ${stops.slice(1).join(", ")}.`, `从 ${total} 开始：${stops.slice(1).join("、")}。`],
                ],
                [["Count the jumps", "数次数"], [`That is ${jumps} jumps:`, `跳了 ${jumps} 次：`], [`${total} \\div ${each} = ${jumps}`]],
              ],
              [`$${jumps} \\times ${each} = ${total}$.`, `$${jumps} \\times ${each} = ${total}$。`],
              [
                [each, "That is the size of each jump, not the number of jumps.", "这是每次跳的长度，不是次数。"],
                [total - each, "That is where the first jump lands.", "这是第一跳落下的地方。"],
                [jumps + 1, "That counts the starting point as a jump.", "这把起点也算成了一跳。"],
              ],
              numberLineFigure(0, total, each, total),
            ),
            solutionFigure: jumpsFigure(0, total, each, stops),
          };
        },
      ),
      figure: gradeDrawings2["division-as-making-groups#division-by-repeated-subtraction"],
    },
  ],
  [
    "A baker has 20 muffins and puts 4 in each box. She fills boxes until the muffins run out and counts 5 boxes.\n\nCheck: $5 \\times 4 = 20$.\n\nIn this lesson we find how many groups of a given size can be made.",
    "面包师有 20 个松饼，每盒装 4 个。她一盒一盒地装，直到装完，数了数一共 5 盒。\n\n检验：$5 \\times 4 = 20$。\n\n本课我们求可以分成多少个大小一定的组。",
  ],
);

const relatingMultiplicationDivision = earlyTopic(
  "relating-multiplication-and-division",
  ["Relating Multiplication and Division", "乘法和除法的关系"],
  ["Use a multiplication fact to find a quotient, and write the facts that belong together.", "用乘法算式求商，并写出相关的一组算式。"],
  ["division-as-making-groups", "multiplying-by-3-and-4"],
  ["3.OA.B.6", "3.OA.A.4"],
  [
    earlyPoint(
      "a-quotient-from-a-product",
      ["A quotient from a product", "由积求商"],
      [
        "Given $6 \\times 7 = 42$, find $42 \\div 6$. Ask: 6 times what is 42? The fact says 7, so $42 \\div 6 = 7$.\n\nCheck: $7 \\times 6 = 42$.\n\n> **Watch out.** The quotient is the other factor, 7, not the 6 you divided by.",
        "已知 $6 \\times 7 = 42$，求 $42 \\div 6$。想：6 乘几得 42？算式说是 7，所以 $42 \\div 6 = 7$。\n\n检验：$7 \\times 6 = 42$。\n\n> **注意。** 商是另一个因数 7，不是除数 6。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => v !== a));
        const product = a * b;
        return solved(
          [
            `Given that $${a} \\times ${b} = ${product}$, what is $${product} \\div ${a}$?`,
            `已知 $${a} \\times ${b} = ${product}$，$${product} \\div ${a}$ 等于多少？`,
          ],
          b,
          [
            [
              ["Turn it into a times question", "改成乘法问题"],
              [`${a} times what is ${product}?`, `${a} 乘几得 ${product}？`],
            ],
            [["Read the fact", "读算式"], [`The fact gives ${b}:`, `算式告诉我们是 ${b}：`], [`${product} \\div ${a} = ${b}`]],
          ],
          [`$${b} \\times ${a} = ${product}$.`, `$${b} \\times ${a} = ${product}$。`],
          [
            [a, "That is the number you divided by, not the quotient.", "这是除数，不是商。"],
            [product - a, "That subtracts instead of dividing.", "这是相减，不是相除。"],
            [product, "That is the product, not the quotient.", "这是积，不是商。"],
          ],
          factTriangleFigure(product, a, b, "×"),
        );
      },
      captioned(
        factTriangleFigure(42, 6, 7, "×"),
        "A fact triangle with 42 on top and 6 and 7 below.",
        "上面是 42、下面是 6 和 7 的算式三角形。",
      ),
    ),
    earlyPoint(
      "the-unknown-in-a-division",
      ["The unknown in a division", "除法中的未知数"],
      [
        "In $\\square \\div 4 = 6$ the box is the number being divided. Turn it into a multiplication: $4 \\times 6 = 24$, so the box is 24.\n\nCheck: $24 \\div 4 = 6$.\n\n> **Watch out.** When the box comes first, multiply. $6 - 4 = 2$ or $6 + 4 = 10$ will not do.",
        "$\\square \\div 4 = 6$ 中，方框是被除数。改成乘法：$4 \\times 6 = 24$，所以方框里是 24。\n\n检验：$24 \\div 4 = 6$。\n\n> **注意。** 方框在最前面时要相乘。$6 - 4 = 2$ 或 $6 + 4 = 10$ 都不对。",
      ],
      (rng) => {
        const divisor = rng.int(2, 9);
        const quotient = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== divisor));
        const total = divisor * quotient;
        const first = rng.bool();
        return first
          ? solved(
              [
                `What number goes in the box? $\\square \\div ${divisor} = ${quotient}$`,
                `方框里填几？$\\square \\div ${divisor} = ${quotient}$`,
              ],
              total,
              [
                [
                  ["Rewrite as a multiplication", "改写成乘法"],
                  [`The box is ${quotient} groups of ${divisor}.`, `方框里是 ${quotient} 个 ${divisor}。`],
                ],
                [["Multiply", "相乘"], ["The number being divided:", "被除数："], [`${divisor} \\times ${quotient} = ${total}`]],
              ],
              [`$${total} \\div ${divisor} = ${quotient}$.`, `$${total} \\div ${divisor} = ${quotient}$。`],
              [
                [divisor + quotient, "That adds. The number being divided is a product.", "这是相加。被除数是一个积。"],
                [divisor, "That is the divisor already in the sentence.", "这是算式里已有的除数。"],
                [quotient, "That is the quotient already in the sentence.", "这是算式里已有的商。"],
              ],
              factTriangleFigure(null, divisor, quotient, "×"),
            )
          : solved(
              [
                `What number goes in the box? $${total} \\div \\square = ${quotient}$`,
                `方框里填几？$${total} \\div \\square = ${quotient}$`,
              ],
              divisor,
              [
                [
                  ["Rewrite as a multiplication", "改写成乘法"],
                  ["The sentence says:", "这个算式就是："],
                  [`\\square \\times ${quotient} = ${total}`],
                ],
                [
                  ["Find the factor", "求因数"],
                  [
                    `${divisor} times ${quotient} is ${total}, so the box is ${divisor}.`,
                    `${divisor} 乘 ${quotient} 是 ${total}，所以方框里是 ${divisor}。`,
                  ],
                ],
              ],
              [`$${total} \\div ${divisor} = ${quotient}$.`, `$${total} \\div ${divisor} = ${quotient}$。`],
              [
                [total - quotient, "That subtracts instead of dividing.", "这是相减，不是相除。"],
                [quotient, "That is the quotient already in the sentence.", "这是算式里已有的商。"],
                [total, "That is the number being divided.", "这是被除数。"],
              ],
              factTriangleFigure(total, null, quotient, "×"),
            );
      },
      captioned(
        factTriangleFigure(null, 4, 6, "×"),
        "A fact triangle with 4 and 6 below and the top unknown: 24.",
        "下面是 4 和 6、上面未知的算式三角形：24。",
      ),
    ),
  ],
  [
    "Ben knows that 4 bags of 5 marbles make 20. So when 20 marbles are shared into 4 bags, he already knows each bag gets 5.\n\nCheck: $4 \\times 5 = 20$ and $20 \\div 4 = 5$.\n\nIn this lesson we use multiplication facts to find quotients and write facts that belong together.",
    "Ben 知道 4 袋、每袋 5 颗弹珠是 20 颗。所以把 20 颗弹珠平均装进 4 个袋子时，他马上知道每袋 5 颗。\n\n检验：$4 \\times 5 = 20$，$20 \\div 4 = 5$。\n\n本课我们用乘法算式求商，并写出相关的一组算式。",
  ],
);

const divisionFacts = earlyTopic(
  "division-facts-to-100",
  ["Division Facts to 100", "100 以内的除法"],
  ["Know the quotients that come from the facts up to 10 times 10.", "掌握由 10 乘 10 以内的算式得到的商。"],
  ["relating-multiplication-and-division", "multiplying-by-6-7-8-and-9"],
  ["3.OA.C.7"],
  [
    earlyPoint(
      "finding-a-quotient",
      ["Finding a quotient", "求商"],
      [
        "Find $56 \\div 8$. Think of the times fact: 8 times what is 56? $8 \\times 7 = 56$, so $56 \\div 8 = 7$.\n\nCheck: count by 8s seven times: 8, 16, 24, 32, 40, 48, 56.\n\n> **Watch out.** Divide; do not subtract. $56 - 8 = 48$ is not the quotient.",
        "求 $56 \\div 8$。想乘法算式：8 乘几得 56？$8 \\times 7 = 56$，所以 $56 \\div 8 = 7$。\n\n检验：8 个 8 个地数 7 次：8、16、24、32、40、48、56。\n\n> **注意。** 要除，不要减。$56 - 8 = 48$ 不是商。",
      ],
      (rng) => {
        const divisor = rng.int(2, 10);
        const answer = rng.int(2, 10);
        const total = divisor * answer;
        return solved(
          [`What is $${total} \\div ${divisor}$?`, `$${total} \\div ${divisor}$ 等于多少？`],
          answer,
          [
            [
              ["Think of the times fact", "想乘法算式"],
              [`${divisor} times what is ${total}?`, `${divisor} 乘几得 ${total}？`],
              [`${divisor} \\times ${answer} = ${total}`],
            ],
            [
              ["Read the quotient", "读出商"],
              [`So ${total} divided by ${divisor} is ${answer}.`, `所以 ${total} 除以 ${divisor} 得 ${answer}。`],
            ],
          ],
          [
            `Count by ${divisor}s ${answer} times: ${skipCount(divisor, answer).join(", ")}.`,
            `${divisor} 个 ${divisor} 个地数 ${answer} 次：${skipCount(divisor, answer).join("、")}。`,
          ],
          [
            [total - divisor, "That subtracts instead of dividing.", "这是相减，不是相除。"],
            [
              divisor + answer,
              `That adds the divisor to the answer. ${divisor} times ${answer} is the fact to use.`,
              `这把除数和答案相加了。要用的是 ${divisor} 乘 ${answer}。`,
            ],
            [
              answer + 1,
              `That is one too many: ${divisor} times ${answer + 1} is ${divisor * (answer + 1)}.`,
              `多了 1：${divisor} 乘 ${answer + 1} 是 ${divisor * (answer + 1)}。`,
            ],
          ],
        );
      },
      captioned(arrayFigure(8, 7), "56 dots in 8 rows: 7 in each row.", "56 个点排成 8 行：每行 7 个。"),
    ),
    earlyPoint(
      "dividing-with-zero-one-and-itself",
      ["Dividing with 0, 1 and the number itself", "含 0、1 和自身的除法"],
      [
        "Share 9 cookies with 1 person: that person gets all 9, so $9 \\div 1 = 9$. Share 9 among 9 people: each gets 1, so $9 \\div 9 = 1$. Share 0 cookies among 9: each gets 0, so $0 \\div 9 = 0$.\n\nCheck: $1 \\times 9 = 9$, $9 \\times 1 = 9$ and $9 \\times 0 = 0$.\n\n> **Watch out.** $9 \\div 9$ is 1, not 0. A number divided by itself makes one whole group.",
        "9 块饼干分给 1 个人：他得到全部 9 块，所以 $9 \\div 1 = 9$。分给 9 个人：每人 1 块，所以 $9 \\div 9 = 1$。0 块饼干分给 9 个人：每人 0 块，所以 $0 \\div 9 = 0$。\n\n检验：$1 \\times 9 = 9$，$9 \\times 1 = 9$，$9 \\times 0 = 0$。\n\n> **注意。** $9 \\div 9$ 是 1，不是 0。一个数除以它本身正好是一整组。",
      ],
      (rng) => {
        const n = rng.int(2, 200);
        const kind = rng.int(0, 2);
        const shown = kind === 0 ? `${n} \\div 1` : kind === 1 ? `${n} \\div ${n}` : `0 \\div ${n}`;
        const answer = kind === 0 ? n : kind === 1 ? 1 : 0;
        const walk: Walk[] =
          kind === 0
            ? [
                [
                  ["Think of sharing", "想一想分东西"],
                  [`${n} shared with 1 person.`, `${n} 个分给 1 个人。`],
                ],
                [
                  ["Find the share", "求每份"],
                  [`That one person gets all ${n}.`, `这一个人得到全部 ${n} 个。`],
                ],
              ]
            : kind === 1
              ? [
                  [
                    ["Think of sharing", "想一想分东西"],
                    [`${n} shared among ${n} people.`, `${n} 个分给 ${n} 个人。`],
                  ],
                  [
                    ["Find the share", "求每份"],
                    ["Each person gets 1.", "每人得到 1 个。"],
                  ],
                ]
              : [
                  [
                    ["Think of sharing", "想一想分东西"],
                    [`Nothing shared among ${n} people.`, `什么也没有，分给 ${n} 个人。`],
                  ],
                  [
                    ["Find the share", "求每份"],
                    ["Each person gets 0.", "每人得到 0 个。"],
                  ],
                ];
        return solved(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          walk,
          kind === 0
            ? [`$1 \\times ${n} = ${n}$.`, `$1 \\times ${n} = ${n}$。`]
            : kind === 1
              ? [`$${n} \\times 1 = ${n}$.`, `$${n} \\times 1 = ${n}$。`]
              : [`$${n} \\times 0 = 0$.`, `$${n} \\times 0 = 0$。`],
          kind === 0
            ? [
                [1, `That divides ${n} by itself. Dividing by 1 leaves ${n}.`, `这是 ${n} 除以它本身。除以 1 还是 ${n}。`],
                [0, `Only 0 shared gives 0. Here ${n} is shared.`, `只有分 0 个才得 0。这里分的是 ${n} 个。`],
                [n - 1, "That subtracts 1 instead of dividing by it.", "这是减 1，不是除以 1。"],
              ]
            : kind === 1
              ? [
                  [0, "That subtracts. A number divided by itself is 1.", "这是相减。一个数除以它本身得 1。"],
                  [n, `That divides by 1, not by ${n}.`, `这是除以 1，不是除以 ${n}。`],
                ]
              : [
                  [n, "There is nothing to share, so no one gets anything.", "没有东西可分，谁也分不到。"],
                  [1, "There is nothing to share, so each share is 0, not 1.", "没有东西可分，每份是 0，不是 1。"],
                ],
        );
      },
      captioned(countersFigure(9, 9), "9 counters in one row: shared among 9, each gets 1.", "一行 9 个圆片：分给 9 个人，每人 1 个。"),
    ),
  ],
  [
    "Leo has 56 stickers to put in 8 equal rows. He thinks: 8 times what is 56? He knows $8 \\times 7 = 56$, so each row gets 7.\n\nCheck: $7 \\times 8 = 56$.\n\nIn this lesson we find quotients quickly from the multiplication facts to 10 times 10.",
    "Leo 要把 56 张贴纸贴成同样多的 8 行。他想：8 乘几得 56？他知道 $8 \\times 7 = 56$，所以每行 7 张。\n\n检验：$7 \\times 8 = 56$。\n\n本课我们由 10 乘 10 以内的乘法算式快速求商。",
  ],
);

const multiplyDivideWordProblems = earlyTopic(
  "multiplication-and-division-word-problems",
  ["Multiplication and Division Word Problems", "乘除法应用题"],
  ["Decide whether a situation calls for multiplying or dividing, and solve it.", "判断一个情境该用乘法还是除法，并解决问题。"],
  ["division-facts-to-100"],
  ["3.OA.A.3"],
  [
    earlyPoint(
      "multiply-or-divide",
      ["Multiply or divide", "乘还是除"],
      [
        "6 boxes hold 4 pens each. The total is missing, so multiply: $6 \\times 4 = 24$. If instead 24 pens go into 6 equal boxes, the size of each box is missing, so divide: $24 \\div 6 = 4$.\n\nCheck: $6 \\times 4 = 24$ fits both stories.\n\n> **Watch out.** Find which number is missing first: the groups, the size of each, or the total.",
        "6 盒笔，每盒 4 支。总数不知道，所以相乘：$6 \\times 4 = 24$。如果是把 24 支笔平均放进 6 个盒子，不知道的是每盒几支，所以相除：$24 \\div 6 = 4$。\n\n检验：$6 \\times 4 = 24$ 对两个故事都成立。\n\n> **注意。** 先看缺的是哪个数：组数、每组的个数，还是总数。",
      ],
      (rng) => {
        const a = rng.int(2, 10);
        const b = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => v !== a));
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const multiply = rng.bool();
        return multiply
          ? solved(
              [
                `${name} fills ${a} boxes with ${b} ${thing.en} each. How many ${thing.en} is that?`,
                `${name} 装了 ${a} 盒${thing.zh}，每盒 ${b} ${thing.unit}。一共有多少${thing.unit}？`,
              ],
              a * b,
              [
                [
                  ["Find what is missing", "找出缺的数"],
                  [`${a} groups of ${b} are known; the total is missing.`, `知道 ${a} 组、每组 ${b}，缺的是总数。`],
                ],
                [["Multiply", "相乘"], ["Groups times the size of each:", "组数乘每组的个数："], [`${a} \\times ${b} = ${a * b}`]],
              ],
              [`$${a * b} \\div ${a} = ${b}$ ${thing.en} in each box.`, `$${a * b} \\div ${a} = ${b}$，正是每盒的个数。`],
              [
                [a + b, "That adds. The total of equal groups is a product.", "这是相加。相同的组的总数要用乘法。"],
                [a * b - b, "That is one box too few.", "少算了一盒。"],
                [a * b + b, "That is one box too many.", "多算了一盒。"],
              ],
            )
          : solved(
              [
                `${name} puts ${a * b} ${thing.en} into ${a} equal boxes. How many ${thing.en} go in each box?`,
                `${name} 把 ${a * b} ${thing.unit}${thing.zh}平均放进 ${a} 个盒子。每盒放多少${thing.unit}？`,
              ],
              b,
              [
                [
                  ["Find what is missing", "找出缺的数"],
                  [
                    `The total ${a * b} and the ${a} boxes are known; the size of each is missing.`,
                    `知道总数 ${a * b} 和 ${a} 个盒子，缺的是每盒的个数。`,
                  ],
                ],
                [["Divide", "相除"], ["Share the total into the boxes:", "把总数平均分到各盒："], [`${a * b} \\div ${a} = ${b}`]],
              ],
              [`$${a} \\times ${b} = ${a * b}$.`, `$${a} \\times ${b} = ${a * b}$。`],
              [
                [a * b - a, "That subtracts. Sharing equally is dividing.", "这是相减。平均分要用除法。"],
                [a, "That is the number of boxes, not how many go in each.", "这是盒数，不是每盒的个数。"],
                [a * b * a, "That multiplies, but the total is already known.", "这是相乘，但总数已经知道了。"],
              ],
            );
      },
      captioned(countersFigure(24, 4), "24 counters in 6 rows of 4.", "24 个圆片，6 行，每行 4 个。"),
    ),
    earlyPoint(
      "times-as-many",
      ["Times as many", "几倍"],
      [
        "Leo has 4 shells. Mia has 3 times as many, so she has three groups the size of Leo's: $3 \\times 4 = 12$.\n\nCheck: $4 + 4 + 4 = 12$.\n\n> **Watch out.** 3 times as many is not 3 more. $4 + 3 = 7$ would be 3 more.",
        "Leo 有 4 个贝壳。Mia 的是他的 3 倍，就是 3 组和 Leo 一样多：$3 \\times 4 = 12$。\n\n检验：$4 + 4 + 4 = 12$。\n\n> **注意。** 3 倍不是多 3 个。$4 + 3 = 7$ 是多 3 个。",
      ],
      (rng) => {
        const small = rng.int(2, 10);
        const times = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== small));
        const thing = rng.pick(earlyThings);
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const forward = rng.bool();
        return forward
          ? solved(
              [
                `${p} has ${small} ${thing.en}. ${q} has ${times} times as many. How many does ${q} have?`,
                `${p} 有 ${small} ${thing.unit}${thing.zh}。${q} 的${thing.zh}是 ${p} 的 ${times} 倍。${q} 有多少${thing.unit}？`,
              ],
              small * times,
              [
                [
                  ["Read times as many", "理解几倍"],
                  [`${q} has ${times} groups of ${small}.`, `${q} 有 ${times} 个 ${small}。`],
                ],
                [
                  ["Multiply", "相乘"],
                  [`${times} groups of ${small}:`, `${times} 个 ${small}：`],
                  [`${times} \\times ${small} = ${small * times}`],
                ],
              ],
              [
                `$${small * times} \\div ${times} = ${small}$, ${p}'s amount.`,
                `$${small * times} \\div ${times} = ${small}$，正是 ${p} 的数量。`,
              ],
              [
                [small + times, `That is ${times} more, not ${times} times as many.`, `这是多 ${times} 个，不是 ${times} 倍。`],
                [small * (times - 1), `That is one group of ${small} too few.`, `少了一个 ${small}。`],
                [small * (times + 1), `That is one group of ${small} too many.`, `多了一个 ${small}。`],
              ],
              partWholeBarFigure(Array<number>(times).fill(small), -1),
            )
          : solved(
              [
                `${q} has ${small * times} ${thing.en}, which is ${times} times as many as ${p} has. How many does ${p} have?`,
                `${q} 有 ${small * times} ${thing.unit}${thing.zh}，是 ${p} 的 ${times} 倍。${p} 有多少${thing.unit}？`,
              ],
              small,
              [
                [
                  ["Read times as many", "理解几倍"],
                  [
                    `${small * times} is ${times} equal groups, and ${p} has one of them.`,
                    `${small * times} 是 ${times} 个相同的组，${p} 有其中一组。`,
                  ],
                ],
                [["Divide", "相除"], ["One of the groups:", "其中一组："], [`${small * times} \\div ${times} = ${small}`]],
              ],
              [`$${times} \\times ${small} = ${small * times}$.`, `$${times} \\times ${small} = ${small * times}$。`],
              [
                [
                  small * times - times,
                  `That takes away ${times}. Times as many means divide to go back.`,
                  `这是减去 ${times}。倍数要用除法还原。`,
                ],
                [small * times * times, "That multiplies again. Divide to go back.", "这又乘了一次。应该用除法还原。"],
                [times, "That is the number of times, not the amount.", "这是倍数，不是数量。"],
              ],
            );
      },
      captioned(partWholeBarFigure([4, 4, 4], -1), "Three bars of 4 make 12: 3 times as many as 4.", "三段 4 合起来是 12：是 4 的 3 倍。"),
    ),
  ],
  [
    "The class has 6 tables with 4 children at each. To find how many children there are, we multiply. To find how many sit at each table when 24 children share 6 tables, we divide.\n\nCheck: $6 \\times 4 = 24$ and $24 \\div 6 = 4$.\n\nIn this lesson we decide whether a story needs multiplying or dividing, and solve it.",
    "全班有 6 张桌子，每张坐 4 个孩子。求一共有几个孩子，用乘法。24 个孩子平均坐 6 张桌子，求每张坐几个，用除法。\n\n检验：$6 \\times 4 = 24$，$24 \\div 6 = 4$。\n\n本课我们判断故事该用乘法还是除法，并解决问题。",
  ],
);

const twoStepWordProblems = earlyTopic(
  "two-step-word-problems-with-all-operations",
  ["Two-Step Word Problems", "两步应用题"],
  ["Solve problems that take two steps, using a letter for the unknown when it helps.", "解决需要两步的问题，必要时用字母表示未知数。"],
  ["multiplication-and-division-word-problems"],
  ["3.OA.D.8"],
  [
    earlyPoint(
      "groups-and-then-more",
      ["Groups and then more", "先分组再增减"],
      [
        "Ana has 3 packs of 5 stickers and 4 loose ones. First the packs: $3 \\times 5 = 15$. Then the loose ones: $15 + 4 = 19$ stickers.\n\nCheck: $5 + 5 + 5 + 4 = 19$.\n\n> **Watch out.** Do not stop after the first step. 15 is only the stickers in packs.",
        "Ana 有 3 包贴纸，每包 5 张，另外还有 4 张散的。先算整包的：$3 \\times 5 = 15$。再加散的：$15 + 4 = 19$ 张。\n\n检验：$5 + 5 + 5 + 4 = 19$。\n\n> **注意。** 不要算完第一步就停。15 只是包里的贴纸。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const extra = rng.int(2, 15);
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        const lost = rng.bool() && groups * each > extra;
        const packs = groups * each;
        const answer = lost ? packs - extra : packs + extra;
        return solved(
          lost
            ? [
                `${name} has ${groups} packs of ${each} ${thing.en}, and gives away ${extra} of them. How many ${thing.en} are left?`,
                `${name} 有 ${groups} 包${thing.zh}，每包 ${each} ${thing.unit}，送出了 ${extra} ${thing.unit}。还剩多少${thing.unit}？`,
              ]
            : [
                `${name} has ${groups} packs of ${each} ${thing.en}, and ${extra} more loose ones. How many ${thing.en} is that altogether?`,
                `${name} 有 ${groups} 包${thing.zh}，每包 ${each} ${thing.unit}，另外还有 ${extra} ${thing.unit}散的。一共有多少${thing.unit}？`,
              ],
          answer,
          [
            [
              ["Count the packs", "先算整包的"],
              [`${groups} packs of ${each}:`, `${groups} 包，每包 ${each}：`],
              [`${groups} \\times ${each} = ${packs}`],
            ],
            lost
              ? [["Take away", "减去"], [`${extra} are given away:`, `送出 ${extra}：`], [`${packs} - ${extra} = ${answer}`]]
              : [["Add the loose ones", "加上散的"], [`${extra} more:`, `再加 ${extra}：`], [`${packs} + ${extra} = ${answer}`]],
          ],
          lost
            ? [
                `$${answer} + ${extra} = ${packs}$, all the ${thing.en} in the packs.`,
                `$${answer} + ${extra} = ${packs}$，正是包里的全部。`,
              ]
            : [
                `$${answer} - ${extra} = ${packs}$, and $${packs} \\div ${groups} = ${each}$ in each pack.`,
                `$${answer} - ${extra} = ${packs}$，$${packs} \\div ${groups} = ${each}$，正是每包的个数。`,
              ],
          [
            [packs, "That stops after the first step.", "这只算了第一步。"],
            [groups + each + extra, "That adds all three numbers. The packs must be multiplied.", "这把三个数都加起来了。整包的要用乘法。"],
            [groups * (each + extra), `That puts the ${extra} into every pack.`, `这把 ${extra} 加到了每一包里。`],
            [
              lost ? packs + extra : packs - extra,
              lost ? "That adds, but the ones given away are taken away." : "That takes away, but the loose ones are added.",
              lost ? "这是加上，但送出的要减去。" : "这是减去，但散的要加上。",
            ],
          ],
        );
      },
      captioned(
        partWholeBarFigure([5, 5, 5, 4], -1),
        "Three packs of 5 and 4 loose: 19 in all.",
        "三包各 5 张，再加 4 张散的：一共 19 张。",
      ),
    ),
    earlyPoint(
      "sharing-what-is-left",
      ["Sharing what is left", "平均分剩下的"],
      [
        "Ken has 20 cards, keeps 2, and shares the rest equally among 3 friends. First take away what he keeps: $20 - 2 = 18$. Then share: $18 \\div 3 = 6$ each.\n\nCheck: $3 \\times 6 + 2 = 20$.\n\n> **Watch out.** Subtract first, then divide. Sharing all 20 first tells a different story.",
        "Ken 有 20 张卡片，自己留 2 张，其余的平均分给 3 个朋友。先减去留下的：$20 - 2 = 18$。再分：$18 \\div 3 = 6$，每人 6 张。\n\n检验：$3 \\times 6 + 2 = 20$。\n\n> **注意。** 先减，再除。先把 20 张都分掉，就是另一个故事了。",
      ],
      (rng) => {
        const groups = rng.int(2, 9);
        const each = rng.int(2, 9);
        const kept = rng.int(2, 12);
        const rest = groups * each;
        const total = rest + kept;
        const thing = rng.pick(earlyThings);
        const name = rng.pick(earlyNames);
        return solved(
          [
            `${name} has ${total} ${thing.en}, keeps ${kept} of them, and shares the rest equally among ${groups} friends. How many does each friend get?`,
            `${name} 有 ${total} ${thing.unit}${thing.zh}，自己留下 ${kept} ${thing.unit}，把其余的平均分给 ${groups} 个朋友。每个朋友得到多少${thing.unit}？`,
          ],
          each,
          [
            [["Take away what is kept", "减去留下的"], ["The rest to share:", "要分的："], [`${total} - ${kept} = ${rest}`]],
            [["Share the rest", "平均分"], [`Among ${groups} friends:`, `分给 ${groups} 个朋友：`], [`${rest} \\div ${groups} = ${each}`]],
          ],
          [
            `$${groups} \\times ${each} + ${kept} = ${rest} + ${kept} = ${total}$.`,
            `$${groups} \\times ${each} + ${kept} = ${rest} + ${kept} = ${total}$。`,
          ],
          [
            [rest, "That is what is left to share, not each friend's part.", "这是要分的总数，不是每人分到的。"],
            [total - groups, "That subtracts the number of friends instead of sharing.", "这是减去朋友的人数，没有平均分。"],
            [each + kept, `That gives one friend the ${kept} that were kept.`, `这把留下的 ${kept} 也分给了一个朋友。`],
          ],
        );
      },
      captioned(partWholeBarFigure([2, 6, 6, 6], -1), "20 cut into 2 kept and three shares of 6.", "20 分成留下的 2 和三份 6。"),
    ),
  ],
  [
    "Sam buys 3 packs of 5 cards and finds 4 more on the floor. He works it out in two steps: $3 \\times 5 = 15$, then $15 + 4 = 19$ cards.\n\nCheck: $5 + 5 + 5 + 4 = 19$.\n\nIn this lesson we solve problems that take two steps, one at a time.",
    "Sam 买了 3 包卡片，每包 5 张，又在地上捡到 4 张。他分两步算：$3 \\times 5 = 15$，再 $15 + 4 = 19$ 张。\n\n检验：$5 + 5 + 5 + 4 = 19$。\n\n本课我们一步一步解决需要两步的问题。",
  ],
);

const orderOfOperationsEarly = earlyTopic(
  "expressions-with-two-operations",
  ["Expressions With Two Operations", "含两种运算的算式"],
  ["Multiply or divide before adding or subtracting, unless parentheses say otherwise.", "先乘除后加减，除非括号另有说明。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.D.8"],
  [
    earlyPoint(
      "multiplying-before-adding",
      ["Multiplying before adding", "先乘后加"],
      [
        "Find $3 + 4 \\times 2$. Multiply first: $4 \\times 2 = 8$. Then add: $3 + 8 = 11$. Think of 4 packs of 2 juice boxes and 3 single ones.\n\nCheck: $2 + 2 + 2 + 2 + 3 = 11$.\n\n> **Watch out.** Do not add first. $(3 + 4) \\times 2 = 14$ is a different answer.",
        "求 $3 + 4 \\times 2$。先算乘法：$4 \\times 2 = 8$。再加：$3 + 8 = 11$。想一想 4 盒果汁，每盒 2 瓶，另外 3 瓶单的。\n\n检验：$2 + 2 + 2 + 2 + 3 = 11$。\n\n> **注意。** 不要先算加法。$(3 + 4) \\times 2 = 14$ 是另一个答案。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const first = rng.bool();
        const shown = first ? `${b} \\times ${c} + ${a}` : `${a} + ${b} \\times ${c}`;
        const answer = a + b * c;
        return solved(
          [`What is $${shown}$?`, `$${shown}$ 等于多少？`],
          answer,
          [
            [["Multiply first", "先算乘法"], ["The product:", "乘法："], [`${b} \\times ${c} = ${b * c}`]],
            [["Then add", "再算加法"], [`Add the ${a}:`, `加上 ${a}：`], [`${b * c} + ${a} = ${answer}`]],
          ],
          [
            `Add ${c} ${b} times and then ${a}: $${Array<number>(b).fill(c).join(" + ")} + ${a} = ${answer}$.`,
            `把 ${b} 个 ${c} 加起来，再加 ${a}：$${Array<number>(b).fill(c).join(" + ")} + ${a} = ${answer}$。`,
          ],
          [
            [first ? b * (c + a) : (a + b) * c, "That adds first. Multiply before adding.", "这是先算加法。要先乘后加。"],
            [a + b + c, "That adds all three numbers.", "这把三个数都加起来了。"],
            [a * b * c, "That multiplies all three numbers.", "这把三个数都乘起来了。"],
          ],
        );
      },
      captioned(partWholeBarFigure([2, 2, 2, 2, 3], -1), "Four 2s and then 3 more: 8 + 3 = 11.", "四个 2 再加 3：8 + 3 = 11。"),
    ),
    earlyPoint(
      "parentheses-come-first",
      ["Parentheses come first", "先算括号里的"],
      [
        "Find $(3 + 2) \\times 4$. The parentheses come first: $3 + 2 = 5$. Then $5 \\times 4 = 20$. Think of 4 rows, each with 3 red and 2 blue beads.\n\nCheck: $3 \\times 4 + 2 \\times 4 = 12 + 8 = 20$.\n\n> **Watch out.** Without the parentheses, $3 + 2 \\times 4 = 11$. The parentheses change the answer.",
        "求 $(3 + 2) \\times 4$。先算括号：$3 + 2 = 5$。再算 $5 \\times 4 = 20$。想一想 4 行珠子，每行 3 颗红的、2 颗蓝的。\n\n检验：$3 \\times 4 + 2 \\times 4 = 12 + 8 = 20$。\n\n> **注意。** 没有括号时，$3 + 2 \\times 4 = 11$。括号会改变答案。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const answer = (a + b) * c;
        return solved(
          [`What is $(${a} + ${b}) \\times ${c}$?`, `$(${a} + ${b}) \\times ${c}$ 等于多少？`],
          answer,
          [
            [["Parentheses first", "先算括号"], ["The sum inside:", "括号里的和："], [`${a} + ${b} = ${a + b}`]],
            [["Then multiply", "再算乘法"], [`Times ${c}:`, `乘 ${c}：`], [`${a + b} \\times ${c} = ${answer}`]],
          ],
          [
            `Multiply each part: $${a} \\times ${c} + ${b} \\times ${c} = ${a * c} + ${b * c} = ${answer}$.`,
            `分别相乘：$${a} \\times ${c} + ${b} \\times ${c} = ${a * c} + ${b * c} = ${answer}$。`,
          ],
          [
            [a + b * c, "That ignores the parentheses and multiplies first.", "这没管括号，先算了乘法。"],
            [a * c + b, `That multiplies only the ${a} by ${c}.`, `这只把 ${a} 乘了 ${c}。`],
            [a + b + c, "That adds all three numbers.", "这把三个数都加起来了。"],
          ],
        );
      },
      captioned(arrayFigure(4, 5), "4 rows of 3 + 2 = 5: 20 in all.", "4 行，每行 3 + 2 = 5：一共 20。"),
    ),
  ],
  [
    "Mom buys 4 packs of 2 yogurts and 3 single ones. Everyone must get 11, so we agree to multiply first: $4 \\times 2 = 8$, then $8 + 3 = 11$.\n\nCheck: $2 + 2 + 2 + 2 + 3 = 11$.\n\nIn this lesson we multiply or divide before adding or subtracting, unless parentheses say otherwise.",
    "妈妈买了 4 盒酸奶，每盒 2 杯，还有 3 杯单的。为了大家都算出 11，约定先乘：$4 \\times 2 = 8$，再 $8 + 3 = 11$。\n\n检验：$2 + 2 + 2 + 2 + 3 = 11$。\n\n本课我们学习先乘除后加减，除非括号另有说明。",
  ],
);

const arithmeticPatterns = earlyTopic(
  "arithmetic-patterns",
  ["Number Patterns", "数的规律"],
  ["Find and explain patterns in sums and products, including even and odd numbers.", "找出并说明和与积中的规律，包括奇数和偶数。"],
  ["multiplying-by-3-and-4"],
  ["3.OA.D.9"],
  [
    earlyPoint(
      "the-next-number-in-a-pattern",
      ["The next number in a pattern", "规律中的下一个数"],
      [
        "What comes next in 7, 11, 15, 19? Each number is 4 more than the one before, so the rule is add 4: $19 + 4 = 23$.\n\nCheck: the rule works all the way: $7 + 4 = 11$, $11 + 4 = 15$, $15 + 4 = 19$.\n\n> **Watch out.** Use the difference between the numbers, not just 1 more than the last number.",
        "7、11、15、19 后面是几？每个数都比前一个多 4，规则是加 4：$19 + 4 = 23$。\n\n检验：规则从头到尾都成立：$7 + 4 = 11$，$11 + 4 = 15$，$15 + 4 = 19$。\n\n> **注意。** 要用相邻两数的差，不是比最后一个数多 1。",
      ],
      (rng) => {
        const step = rng.int(2, 12);
        const start = rng.int(1, 40);
        const terms = [0, 1, 2, 3].map((i) => start + i * step);
        const last = terms[3] as number;
        const answer = last + step;
        return solved(
          [`What number comes next? $${terms.join(",\\ ")},\\ \\square$`, `下一个数是几？$${terms.join(",\\ ")},\\ \\square$`],
          answer,
          [
            [["Find the rule", "找规则"], ["The difference between neighbors:", "相邻两数的差："], [`${terms[1]} - ${terms[0]} = ${step}`]],
            [["Apply it", "用规则"], [`Add ${step} to the last number:`, `最后一个数加 ${step}：`], [`${last} + ${step} = ${answer}`]],
          ],
          [
            `The rule works for every pair: ${terms
              .slice(1)
              .map((v, i) => `$${terms[i]} + ${step} = ${v}$`)
              .join(", ")}.`,
            `规则对每一对都成立：${terms
              .slice(1)
              .map((v, i) => `$${terms[i]} + ${step} = ${v}$`)
              .join("，")}。`,
          ],
          [
            [answer + step, "That skips a number in the pattern.", "这跳过了规律中的一个数。"],
            [last + 1, `That adds 1, but the rule adds ${step}.`, `这是加 1，但规则是加 ${step}。`],
            [last + step + 1, `That is 1 more than the next number.`, `比下一个数多了 1。`],
          ],
          hopsFigure([...terms, answer], true),
        );
      },
      captioned(hopsFigure([7, 11, 15, 19, 23]), "Hops of 4: 7, 11, 15, 19, then 23.", "每次跳 4：7、11、15、19，然后是 23。"),
    ),
    earlyPoint(
      "even-and-odd-products",
      ["Even and odd products", "积的奇偶"],
      [
        "Is $13 \\times 24$ even or odd? 24 is even, so every group of 24 splits into two equal halves, and so does the whole product. It is even.\n\nCheck: try small numbers with the same ones digits: $3 \\times 4 = 12$, which is even.\n\n> **Watch out.** One even factor is enough to make the product even. The product is odd only when both factors are odd.",
        "$13 \\times 24$ 是偶数还是奇数？24 是偶数，每组 24 都能分成相等的两半，整个积也能。所以是偶数。\n\n检验：用个位相同的小数试试：$3 \\times 4 = 12$，是偶数。\n\n> **注意。** 只要有一个因数是偶数，积就是偶数。只有两个因数都是奇数，积才是奇数。",
      ],
      (rng) => {
        const a = rng.int(11, 99);
        const b = rng.int(11, 99);
        const odd = a % 2 === 1 && b % 2 === 1;
        const even: Pair = ["Even", "偶数"];
        const oddText: Pair = ["Odd", "奇数"];
        const oa = a % 10;
        const ob = b % 10;
        const kind = (n: number): Pair => (n % 2 === 0 ? ["even", "偶数"] : ["odd", "奇数"]);
        return picked(
          rng,
          [`Is the product $${a} \\times ${b}$ even or odd?`, `积 $${a} \\times ${b}$ 是偶数还是奇数？`],
          odd ? oddText : even,
          [
            [
              odd ? even : oddText,
              odd
                ? "Both factors are odd, so the product cannot be split into equal pairs."
                : "At least one factor is even, so the product splits into equal pairs.",
              odd ? "两个因数都是奇数，积不能分成相等的两份。" : "至少有一个因数是偶数，积能分成相等的两份。",
            ],
            [
              ["It depends on the order of the factors", "取决于因数的顺序"],
              "Changing the order of the factors does not change the product.",
              "交换因数的顺序不会改变积。",
            ],
            [
              ["It cannot be told without multiplying", "不算出来就不能判断"],
              "The ones digits of the factors decide it, so no multiplying is needed.",
              "看因数的个位就能判断，不用算出来。",
            ],
          ],
          [
            [
              ["Look at each factor", "看每个因数"],
              [`${a} is ${kind(a)[0]} and ${b} is ${kind(b)[0]}.`, `${a} 是${kind(a)[1]}，${b} 是${kind(b)[1]}。`],
            ],
            [
              ["Decide", "判断"],
              odd
                ? ["Both are odd, so the product is odd.", "两个都是奇数，所以积是奇数。"]
                : ["One factor is even, so the product is even.", "有一个因数是偶数，所以积是偶数。"],
            ],
          ],
          [
            `The ones digits give $${oa} \\times ${ob} = ${oa * ob}$, which is ${kind(oa * ob)[0]} too.`,
            `个位相乘 $${oa} \\times ${ob} = ${oa * ob}$，也是${kind(oa * ob)[1]}。`,
          ],
        );
      },
      captioned(
        arrayFigure(3, 4),
        "3 rows of 4: each row splits into two equal halves, so 12 is even.",
        "3 行 4 个：每行都能分成相等的两半，所以 12 是偶数。",
      ),
    ),
  ],
  [
    "Count the legs of some chairs: 4, 8, 12, 16. Each number is 4 more than the one before, and every one of them is even.\n\nCheck: $16 + 4 = 20$ is the next, and it is even too.\n\nIn this lesson we find and explain patterns in sums and products, including even and odd numbers.",
    "数椅子腿：4、8、12、16。每个数都比前一个多 4，而且都是偶数。\n\n检验：下一个是 $16 + 4 = 20$，也是偶数。\n\n本课我们找出并说明和与积中的规律，包括奇数和偶数。",
  ],
);

const placeValueThreeDigits = earlyTopic(
  "understanding-three-digit-numbers",
  ["Understanding Three-Digit Numbers", "理解三位数"],
  [
    "See a three-digit number as hundreds, tens and ones, and regroup between the places.",
    "把三位数看成几百、几十和几，并在数位之间转换。",
  ],
  ["place-value-up-to-1000"],
  ["3.NBT.A.1"],
  [
    earlyPoint(
      "reading-base-ten-blocks",
      ["Reading base-ten blocks", "读十进制积木"],
      [
        "The picture has 2 big squares, 3 rods and 4 small cubes. A big square is 100, a rod is 10 and a cube is 1. So it shows 2 hundreds, 3 tens and 4 ones: 234.\n\nCheck: $200 + 30 + 4 = 234$.\n\n> **Watch out.** Do not just add the counts. $2 + 3 + 4 = 9$ forgets what each block is worth.",
        "图里有 2 个大方块、3 根长条和 4 个小方块。大方块是 100，长条是 10，小方块是 1。所以是 2 个百、3 个十和 4 个一：234。\n\n检验：$200 + 30 + 4 = 234$。\n\n> **注意。** 不要只把个数加起来。$2 + 3 + 4 = 9$ 忘了每种积木代表多少。",
      ],
      (rng) => {
        const hundreds = rng.int(1, 3);
        const tens = rng.int(0, 9);
        const ones = rng.int(0, 9);
        const answer = 100 * hundreds + 10 * tens + ones;
        return {
          ...solved(
            ["What number do these blocks show?", "这些积木表示多少？"],
            answer,
            [
              [
                ["Count each kind", "分别数"],
                [
                  `${hundreds} big ${hundreds === 1 ? "square" : "squares"}, ${tens} ${tens === 1 ? "rod" : "rods"} and ${ones} small ${ones === 1 ? "cube" : "cubes"}.`,
                  `${hundreds} 个大方块、${tens} 根长条和 ${ones} 个小方块。`,
                ],
              ],
              [
                ["Write the digits", "写出数字"],
                ["Hundreds, tens and ones in their places:", "按百位、十位、个位写："],
                [`${100 * hundreds} + ${10 * tens} + ${ones} = ${answer}`],
              ],
            ],
            [
              `${answer} has ${hundreds} in the hundreds place, ${tens} in the tens place and ${ones} in the ones place, matching the blocks.`,
              `${answer} 的百位是 ${hundreds}，十位是 ${tens}，个位是 ${ones}，和积木一致。`,
            ],
            [
              [
                hundreds + tens + ones,
                "That adds the counts and forgets what each block is worth.",
                "这只把个数加起来，忘了每种积木代表多少。",
              ],
              [100 * ones + 10 * tens + hundreds, "That puts the hundreds and the ones in swapped places.", "这把百位和个位放反了。"],
              [100 * tens + 10 * hundreds + ones, "That puts the hundreds and the tens in swapped places.", "这把百位和十位放反了。"],
            ],
          ),
          figure: baseTenFigure(hundreds, tens, ones),
        };
      },
      captioned(baseTenFigure(2, 3, 4), "2 hundreds, 3 tens and 4 ones: 234.", "2 个百、3 个十和 4 个一：234。"),
    ),
    earlyPoint(
      "tens-in-a-three-digit-number",
      ["Tens in a three-digit number", "三位数里有多少个十"],
      [
        "How many tens are in 236? Each hundred is 10 tens, so 2 hundreds are 20 tens. With the 3 tens, that is $20 + 3 = 23$ tens.\n\nCheck: $23 \\times 10 = 230$, and 236 is 230 and 6 ones.\n\n> **Watch out.** The tens digit alone is not the answer. 3 counts only the rods, not the tens inside the hundreds.",
        "236 里有多少个十？每个百是 10 个十，2 个百就是 20 个十。再加 3 个十，一共 $20 + 3 = 23$ 个十。\n\n检验：$23 \\times 10 = 230$，236 就是 230 和 6 个一。\n\n> **注意。** 十位上的数字不是答案。3 只数了长条，没有数百里的十。",
      ],
      (rng) => {
        const hundreds = rng.int(1, 9);
        const tens = rng.int(1, 9);
        const ones = rng.int(1, 9);
        const n = 100 * hundreds + 10 * tens + ones;
        const answer = 10 * hundreds + tens;
        return solved(
          [
            `How many tens in all are there in ${n}? Count every ten, including those inside the hundreds, and ignore the ones.`,
            `${n} 里一共有多少个十？要数上百里的十，个位不算。`,
          ],
          answer,
          [
            [
              ["Tens in the hundreds", "百里的十"],
              [`Each hundred is 10 tens:`, "每个百是 10 个十："],
              [`${hundreds} \\times 10 = ${10 * hundreds}`],
            ],
            [
              ["Add the other tens", "加上其余的十"],
              [`${tens} more ${tens === 1 ? "ten" : "tens"}:`, `再加 ${tens} 个十：`],
              [`${10 * hundreds} + ${tens} = ${answer}`],
            ],
          ],
          [
            `$${answer} \\times 10 = ${10 * answer}$, and $${10 * answer} + ${ones} = ${n}$.`,
            `$${answer} \\times 10 = ${10 * answer}$，$${10 * answer} + ${ones} = ${n}$。`,
          ],
          [
            [tens, "That is only the tens digit. The hundreds hold tens too.", "这只是十位上的数字。百里也有十。"],
            [hundreds + tens, "That counts each hundred as one ten instead of ten.", "这把每个百只算成一个十，应该是十个十。"],
            [n, "That is the number itself, not the count of tens.", "这是这个数本身，不是十的个数。"],
          ],
        );
      },
      captioned(
        baseTenFigure(2, 3, 6),
        "236: 2 hundreds are 20 tens, and 3 more rods make 23 tens.",
        "236：2 个百是 20 个十，再加 3 根长条，一共 23 个十。",
      ),
    ),
  ],
  [
    "A shop packs pencils in boxes of 100, packs of 10 and single pencils. It has 2 boxes, 3 packs and 4 single pencils, so it has 234 pencils.\n\nCheck: $200 + 30 + 4 = 234$.\n\nIn this lesson we see a three-digit number as hundreds, tens and ones, and trade between the places.",
    "商店把铅笔装成 100 支一箱、10 支一包，还有单支的。店里有 2 箱、3 包和 4 支，一共 234 支。\n\n检验：$200 + 30 + 4 = 234$。\n\n本课我们把三位数看成几百、几十和几，并在数位之间换算。",
  ],
);

const roundingToNearestTen = earlyTopic(
  "rounding-to-the-nearest-ten",
  ["Rounding to the Nearest Ten", "取整到十位"],
  ["Round a number to the closer ten, and use it to estimate.", "把一个数取近似到较近的整十数，并用来估算。"],
  ["understanding-three-digit-numbers"],
  ["3.NBT.A.1"],
  [
    earlyPoint(
      "the-closer-ten",
      ["The closer ten", "较近的整十数"],
      [
        "Round 47 to the nearest ten. 47 is between 40 and 50. Its ones digit is 7, which is 5 or more, so 47 rounds up to 50.\n\nCheck: on the line, 47 is 3 steps from 50 and 7 steps from 40, so 50 is closer.\n\n> **Watch out.** A number ending in 5 is exactly halfway, and it rounds up.",
        "把 47 取近似到十位。47 在 40 和 50 之间。个位是 7，大于或等于 5，所以向上取 50。\n\n检验：在数轴上，47 离 50 有 3 格，离 40 有 7 格，50 更近。\n\n> **注意。** 末位是 5 的数正好在中间，要向上取。",
      ],
      (rng) => {
        const n = rng.int(12, 989);
        const number = n % 10 === 0 ? n + 3 : n;
        const answer = Math.round(number / 10) * 10;
        const low = Math.floor(number / 10) * 10;
        const ones = number % 10;
        const up = answer !== low;
        return {
          ...solved(
            [`Round ${number} to the nearest ten.`, `把 ${number} 取近似到十位。`],
            answer,
            [
              [
                ["Find the two tens", "找出两边的整十数"],
                [`${number} is between ${low} and ${low + 10}.`, `${number} 在 ${low} 和 ${low + 10} 之间。`],
              ],
              [
                ["Look at the ones digit", "看个位"],
                up
                  ? [
                      `The ones digit is ${ones}, which is 5 or more, so round up to ${answer}.`,
                      `个位是 ${ones}，大于或等于 5，所以向上取 ${answer}。`,
                    ]
                  : [
                      `The ones digit is ${ones}, which is less than 5, so round down to ${answer}.`,
                      `个位是 ${ones}，小于 5，所以向下取 ${answer}。`,
                    ],
              ],
            ],
            [
              `${number} is ${Math.abs(number - answer)} away from ${answer} and ${Math.abs(number - (up ? low : low + 10))} away from ${up ? low : low + 10}.`,
              `${number} 离 ${answer} 有 ${Math.abs(number - answer)}，离 ${up ? low : low + 10} 有 ${Math.abs(number - (up ? low : low + 10))}。`,
            ],
            [
              [
                up ? low : low + 10,
                up ? "That rounds down, but the ones digit is 5 or more." : "That rounds up, but the ones digit is less than 5.",
                up ? "这是向下取，但个位大于或等于 5。" : "这是向上取，但个位小于 5。",
              ],
              [Math.round(number / 100) * 100, "That rounds to the nearest hundred, not ten.", "这是取近似到百位，不是十位。"],
              [number, "That leaves the number as it is.", "这没有取近似。"],
            ],
          ),
          figure: numberLineFigure(low, low + 10, 1, number),
        };
      },
      captioned(numberLineFigure(40, 50, 1, 47), "47 lies between 40 and 50, closer to 50.", "47 在 40 和 50 之间，离 50 更近。"),
    ),
    earlyPoint(
      "estimating-a-sum-with-tens",
      ["Estimating a sum with tens", "用整十数估算和"],
      [
        "Estimate $28 + 53$. 28 rounds to 30 and 53 rounds to 50. So the sum is about $30 + 50 = 80$.\n\nCheck: the exact sum is $28 + 53 = 81$, close to 80.\n\n> **Watch out.** An estimate uses the rounded numbers. 81 is the exact sum, not the estimate.",
        "估算 $28 + 53$。28 取近似是 30，53 取近似是 50。所以和大约是 $30 + 50 = 80$。\n\n检验：准确的和是 $28 + 53 = 81$，接近 80。\n\n> **注意。** 估算要用近似数相加。81 是准确的和，不是估算的结果。",
      ],
      (rng) => {
        const a = rng.int(11, 89);
        const b = rng.int(11, 89);
        const x = a % 10 === 0 ? a + 1 : a;
        const y = b % 10 === 0 ? b + 2 : b;
        const rx = Math.round(x / 10) * 10;
        const ry = Math.round(y / 10) * 10;
        return solved(
          [
            `Round each number to the nearest ten to estimate $${x} + ${y}$. What is the estimate?`,
            `把每个数取近似到十位，估算 $${x} + ${y}$。估算的结果是多少？`,
          ],
          rx + ry,
          [
            [
              ["Round each number", "分别取近似"],
              [`${x} rounds to ${rx}, and ${y} rounds to ${ry}.`, `${x} 取近似是 ${rx}，${y} 取近似是 ${ry}。`],
            ],
            [["Add the rounded numbers", "把近似数相加"], ["The estimate:", "估算："], [`${rx} + ${ry} = ${rx + ry}`]],
          ],
          [
            `The exact sum is $${x} + ${y} = ${x + y}$, which is close to ${rx + ry}.`,
            `准确的和是 $${x} + ${y} = ${x + y}$，接近 ${rx + ry}。`,
          ],
          [
            [x + y, "That is the exact sum, not the estimate.", "这是准确的和，不是估算的结果。"],
            [rx + ry + 10, "That rounds one of the numbers the wrong way.", "有一个数取近似的方向错了。"],
            [rx + ry - 10, "That rounds one of the numbers the wrong way.", "有一个数取近似的方向错了。"],
          ],
        );
      },
      captioned(hopsFigure([30, 80]), "From 30, a hop of 50 reaches 80.", "从 30 跳 50，到 80。"),
    ),
  ],
  [
    "A book costs 47 yuan. Mom says it is about 50 yuan, because 47 is closer to 50 than to 40.\n\nCheck: 47 is 3 away from 50 and 7 away from 40.\n\nIn this lesson we round a number to the closer ten and use it to estimate.",
    "一本书 47 元。妈妈说大约 50 元，因为 47 离 50 比离 40 近。\n\n检验：47 离 50 有 3，离 40 有 7。\n\n本课我们把一个数取近似到较近的整十数，并用来估算。",
  ],
);

const roundingToNearestHundred = earlyTopic(
  "rounding-to-the-nearest-hundred",
  ["Rounding to the Nearest Hundred", "取整到百位"],
  ["Round a number to the closer hundred, looking at the tens digit.", "看十位数字，把一个数取近似到较近的整百数。"],
  ["rounding-to-the-nearest-ten"],
  ["3.NBT.A.1"],
  [
    earlyPoint(
      "the-closer-hundred",
      ["The closer hundred", "较近的整百数"],
      [
        "Round 372 to the nearest hundred. 372 is between 300 and 400. Its tens digit is 7, which is 5 or more, so it rounds up to 400.\n\nCheck: 372 is 28 from 400 and 72 from 300, so 400 is closer.\n\n> **Watch out.** Look at the tens digit, not the ones digit, and round only once.",
        "把 372 取近似到百位。372 在 300 和 400 之间。十位是 7，大于或等于 5，所以向上取 400。\n\n检验：372 离 400 有 28，离 300 有 72，400 更近。\n\n> **注意。** 看十位，不看个位，而且只取一次近似。",
      ],
      (rng) => {
        const n = rng.int(110, 990);
        const number = n % 100 === 0 ? n + 30 : n;
        const low = Math.floor(number / 100) * 100;
        const answer = Math.round(number / 100) * 100;
        const tensDigit = Math.floor(number / 10) % 10;
        const up = answer !== low;
        const other = up ? low : low + 100;
        return {
          ...solved(
            [`Round ${number} to the nearest hundred.`, `把 ${number} 取近似到百位。`],
            answer,
            [
              [
                ["Find the two hundreds", "找出两边的整百数"],
                [`${number} is between ${low} and ${low + 100}.`, `${number} 在 ${low} 和 ${low + 100} 之间。`],
              ],
              [
                ["Look at the tens digit", "看十位"],
                up
                  ? [
                      `The tens digit is ${tensDigit}, which is 5 or more, so round up to ${answer}.`,
                      `十位是 ${tensDigit}，大于或等于 5，所以向上取 ${answer}。`,
                    ]
                  : [
                      `The tens digit is ${tensDigit}, which is less than 5, so round down to ${answer}.`,
                      `十位是 ${tensDigit}，小于 5，所以向下取 ${answer}。`,
                    ],
              ],
            ],
            [
              `${number} is ${Math.abs(number - answer)} away from ${answer} and ${Math.abs(number - other)} away from ${other}.`,
              `${number} 离 ${answer} 有 ${Math.abs(number - answer)}，离 ${other} 有 ${Math.abs(number - other)}。`,
            ],
            [
              [
                other,
                up ? "That rounds down, but the tens digit is 5 or more." : "That rounds up, but the tens digit is less than 5.",
                up ? "这是向下取，但十位大于或等于 5。" : "这是向上取，但十位小于 5。",
              ],
              [Math.round(number / 10) * 10, "That rounds to the nearest ten, not hundred.", "这是取近似到十位，不是百位。"],
              [number, "That leaves the number as it is.", "这没有取近似。"],
            ],
          ),
          figure: numberLineFigure(low, low + 100, 10, number),
        };
      },
      captioned(
        numberLineFigure(300, 400, 10, 372),
        "372 lies between 300 and 400, closer to 400.",
        "372 在 300 和 400 之间，离 400 更近。",
      ),
    ),
    earlyPoint(
      "numbers-that-round-to-a-hundred",
      ["Numbers that round to a hundred", "取近似后是某个整百数的数"],
      [
        "Which numbers round to 400? The halfway numbers are 350 and 450. 350 rounds up to 400, and 449 rounds down to 400. So the smallest is 350 and the largest is 449.\n\nCheck: 349 rounds to 300, and 450 rounds to 500, so both are outside.\n\n> **Watch out.** 450 is halfway to 500, so it rounds up to 500, not down to 400.",
        "哪些数取近似后是 400？中间的数是 350 和 450。350 向上取 400，449 向下取 400。所以最小是 350，最大是 449。\n\n检验：349 取近似是 300，450 取近似是 500，两个都不在范围里。\n\n> **注意。** 450 正好在 400 和 500 中间，要向上取 500，不是 400。",
      ],
      (rng) => {
        const hundred = 100 * rng.int(2, 19);
        const asksSmallest = rng.bool();
        const answer = asksSmallest ? hundred - 50 : hundred + 49;
        return solved(
          [
            `A whole number rounds to ${hundred} when rounded to the nearest hundred. What is the ${asksSmallest ? "smallest" : "largest"} it could be?`,
            `一个整数取近似到百位后是 ${hundred}。它${asksSmallest ? "最小" : "最大"}可能是多少？`,
          ],
          answer,
          asksSmallest
            ? [
                [
                  ["Find the halfway number", "找出中间的数"],
                  [`Halfway between ${hundred - 100} and ${hundred}:`, `${hundred - 100} 和 ${hundred} 的中间：`],
                  [`${hundred} - 50 = ${hundred - 50}`],
                ],
                [
                  ["Decide", "判断"],
                  [
                    `Halfway rounds up, so ${hundred - 50} rounds to ${hundred}.`,
                    `正好在中间的向上取，所以 ${hundred - 50} 取近似是 ${hundred}。`,
                  ],
                ],
              ]
            : [
                [
                  ["Find the halfway number", "找出中间的数"],
                  [`Halfway between ${hundred} and ${hundred + 100}:`, `${hundred} 和 ${hundred + 100} 的中间：`],
                  [`${hundred} + 50 = ${hundred + 50}`],
                ],
                [
                  ["Decide", "判断"],
                  [
                    `${hundred + 50} rounds up, so the number just before it is the largest: ${hundred + 49}.`,
                    `${hundred + 50} 要向上取，所以它前面的 ${hundred + 49} 最大。`,
                  ],
                ],
              ],
          asksSmallest
            ? [
                `${hundred - 51} has tens digit 4, so it rounds down to ${hundred - 100}.`,
                `${hundred - 51} 的十位是 4，取近似是 ${hundred - 100}。`,
              ]
            : [`${hundred + 49} has tens digit 4, so it rounds down to ${hundred}.`, `${hundred + 49} 的十位是 4，取近似是 ${hundred}。`],
          [
            [
              asksSmallest ? hundred - 49 : hundred + 50,
              asksSmallest
                ? `${hundred - 50} also rounds up to ${hundred}, so a smaller one works.`
                : `${hundred + 50} is halfway, so it rounds up to ${hundred + 100}.`,
              asksSmallest
                ? `${hundred - 50} 也向上取 ${hundred}，还有更小的。`
                : `${hundred + 50} 正好在中间，要向上取 ${hundred + 100}。`,
            ],
            [
              asksSmallest ? hundred - 100 : hundred + 99,
              `That rounds to ${asksSmallest ? hundred - 100 : hundred + 100}.`,
              `它取近似是 ${asksSmallest ? hundred - 100 : hundred + 100}。`,
            ],
            [
              hundred,
              `${hundred} rounds to itself, but it is not the ${asksSmallest ? "smallest" : "largest"}.`,
              `${hundred} 取近似是它自己，但不是${asksSmallest ? "最小" : "最大"}的。`,
            ],
            [
              asksSmallest ? hundred - 51 : hundred + 48,
              asksSmallest ? `That rounds down to ${hundred - 100}.` : `${hundred + 49} also rounds to ${hundred}, so a larger one works.`,
              asksSmallest ? `它取近似是 ${hundred - 100}。` : `${hundred + 49} 也取近似是 ${hundred}，还有更大的。`,
            ],
          ],
        );
      },
      captioned(
        numberLineFigure(350, 450, 10, 400),
        "From 350 up to 449, every number rounds to 400.",
        "从 350 到 449，每个数取近似都是 400。",
      ),
    ),
  ],
  [
    "A school has 372 children. The newspaper says about 400 children, because 372 is closer to 400 than to 300.\n\nCheck: 372 is 28 from 400 and 72 from 300.\n\nIn this lesson we round a number to the closer hundred, looking at the tens digit.",
    "一所学校有 372 个孩子。报纸上说大约 400 个，因为 372 离 400 比离 300 近。\n\n检验：372 离 400 有 28，离 300 有 72。\n\n本课我们看十位数字，把一个数取近似到较近的整百数。",
  ],
);

const addingWithinThousand = earlyTopic(
  "adding-within-1000",
  ["Adding Within 1,000", "1000 以内的加法"],
  ["Add three-digit numbers place by place, regrouping when a place reaches ten.", "按数位相加三位数，某一位满十时进位。"],
  ["understanding-three-digit-numbers"],
  ["3.NBT.A.2"],
  [
    earlyPoint(
      "adding-with-regrouping",
      ["Adding with regrouping", "进位加法"],
      [
        "Find $258 + 167$. Ones: $8 + 7 = 15$, so write 5 and carry 1 ten. Tens: $5 + 6 + 1 = 12$, so write 2 and carry 1 hundred. Hundreds: $2 + 1 + 1 = 4$. The sum is 425.\n\nCheck: $425 - 167 = 258$.\n\n> **Watch out.** Do not forget the carried 1. Without it you get 315.",
        "求 $258 + 167$。个位：$8 + 7 = 15$，写 5，向十位进 1。十位：$5 + 6 + 1 = 12$，写 2，向百位进 1。百位：$2 + 1 + 1 = 4$。和是 425。\n\n检验：$425 - 167 = 258$。\n\n> **注意。** 别忘了进上来的 1。忘了就会得到 315。",
      ],
      (rng) => {
        const a = rng.int(115, 589);
        const b = rng.int(115, 399);
        const answer = a + b;
        const [a2, a1, a0] = [Math.floor(a / 100), Math.floor(a / 10) % 10, a % 10];
        const [b2, b1, b0] = [Math.floor(b / 100), Math.floor(b / 10) % 10, b % 10];
        const c0 = a0 + b0 >= 10 ? 1 : 0;
        const tensSum = a1 + b1 + c0;
        const c1 = tensSum >= 10 ? 1 : 0;
        const noCarry = (a2 + b2) * 100 + ((a1 + b1) % 10) * 10 + ((a0 + b0) % 10);
        return solved(
          [`What is $${a} + ${b}$?`, `$${a} + ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Add the ones", "加个位"],
              c0 ? ["Ten or more, so carry 1 ten:", "满十，向十位进 1："] : ["Less than ten, so nothing to carry:", "不满十，不用进位："],
              [`${a0} + ${b0} = ${a0 + b0}`],
            ],
            [
              ["Add the tens", "加十位"],
              c1
                ? ["Ten or more, so carry 1 hundred:", "满十，向百位进 1："]
                : ["Less than ten, so nothing to carry:", "不满十，不用进位："],
              [c0 ? `${a1} + ${b1} + 1 = ${tensSum}` : `${a1} + ${b1} = ${tensSum}`],
            ],
            [
              ["Add the hundreds", "加百位"],
              ["The hundreds give the sum:", "加上百位，得到和："],
              [c1 ? `${a2} + ${b2} + 1 = ${a2 + b2 + 1}` : `${a2} + ${b2} = ${a2 + b2}`],
            ],
          ],
          [`$${answer} - ${b} = ${a}$.`, `$${answer} - ${b} = ${a}$。`],
          [
            [noCarry, "That forgets to carry when a place reaches ten.", "某一位满十时忘了进位。"],
            [answer + 100, "That carries one hundred too many.", "多进了一个百。"],
            [answer - 100, "That forgets a carried hundred.", "忘了进上来的一个百。"],
            [answer + 10, "That carries one ten too many.", "多进了一个十。"],
          ],
          blockRowsFigure([
            [a2, a1, a0],
            [b2, b1, b0],
          ]),
        );
      },
      captioned(
        blockRowsFigure([
          [2, 5, 8],
          [1, 6, 7],
        ]),
        "258 above 167. 15 ones trade for 1 ten, 12 tens for 1 hundred: 425.",
        "258 在上，167 在下。15 个一换成 1 个十，12 个十换成 1 个百：425。",
      ),
    ),
    earlyPoint(
      "a-missing-addend-within-1000",
      ["A missing addend within 1,000", "1000 以内求未知加数"],
      [
        "Find the box in $245 + \\square = 412$. Count up from 245: 5 to reach 250, 150 more to reach 400, and 12 more to reach 412. That is $5 + 150 + 12 = 167$.\n\nCheck: $245 + 167 = 412$.\n\n> **Watch out.** Do not add 245 and 412. The box is the part still needed, so subtract or count up.",
        "求 $245 + \\square = 412$ 中的方框。从 245 往上数：加 5 到 250，再加 150 到 400，再加 12 到 412。一共 $5 + 150 + 12 = 167$。\n\n检验：$245 + 167 = 412$。\n\n> **注意。** 不要把 245 和 412 相加。方框是还差的部分，要用减法或往上数。",
      ],
      (rng) => {
        const a = rng.int(120, 480);
        const answer = rng.int(110, 480);
        const total = a + answer;
        return solved(
          [`What number goes in the box? $${a} + \\square = ${total}$`, `方框里填几？$${a} + \\square = ${total}$`],
          answer,
          [
            [
              ["Find what is needed", "找还差多少"],
              [`The box is what takes ${a} up to ${total}.`, `方框是从 ${a} 到 ${total} 还差的部分。`],
            ],
            [["Subtract", "做减法"], ["The total minus the known addend:", "总和减去已知加数："], [`${total} - ${a} = ${answer}`]],
          ],
          [`$${a} + ${answer} = ${total}$.`, `$${a} + ${answer} = ${total}$。`],
          [
            [total + a, "That adds the two numbers. The box is what is still needed.", "这是把两个数相加。方框是还差的部分。"],
            [answer + 100, "That is 100 too many. Check by adding it back.", "多了 100。加回去检验一下。"],
            [answer - 100, "That is 100 too few. Check by adding it back.", "少了 100。加回去检验一下。"],
            [answer + 10, "That is 10 too many. A trade was missed.", "多了 10。漏了一次借位。"],
          ],
          hopsFigure([a, total], true),
        );
      },
      captioned(
        hopsFigure([245, 250, 400, 412]),
        "Counting up from 245: 5, then 150, then 12 reach 412.",
        "从 245 往上数：5，再 150，再 12，到 412。",
      ),
    ),
  ],
  [
    "A library has 258 storybooks and gets 167 more. To find the total, we add hundreds, tens and ones, trading 10 ones for a ten and 10 tens for a hundred: 425 books.\n\nCheck: $425 - 167 = 258$.\n\nIn this lesson we add three-digit numbers place by place, carrying when a place reaches ten.",
    "图书馆有 258 本故事书，又来了 167 本。求一共多少本，就按百、十、一相加，10 个一换 1 个十，10 个十换 1 个百：425 本。\n\n检验：$425 - 167 = 258$。\n\n本课我们按数位相加三位数，某一位满十时进位。",
  ],
);

const subtractingWithinThousand = earlyTopic(
  "subtracting-within-1000",
  ["Subtracting Within 1,000", "1000 以内的减法"],
  ["Subtract three-digit numbers place by place, trading from the next place when needed.", "按数位相减三位数，不够减时向前一位借。"],
  ["adding-within-1000"],
  ["3.NBT.A.2"],
  [
    earlyPoint(
      "subtracting-with-regrouping",
      ["Subtracting with regrouping", "退位减法"],
      [
        "Find $332 - 165$. Ones: 2 is less than 5, so trade 1 ten for 10 ones: $12 - 5 = 7$. Tens: 2 is less than 6, so trade 1 hundred: $12 - 6 = 6$. Hundreds: $2 - 1 = 1$. The answer is 167.\n\nCheck: $167 + 165 = 332$.\n\n> **Watch out.** Do not take the small digit from the big one. $5 - 2 = 3$ in the ones place is wrong.",
        "求 $332 - 165$。个位：2 比 5 小，从十位借 1 个十换成 10 个一：$12 - 5 = 7$。十位：2 比 6 小，从百位借 1：$12 - 6 = 6$。百位：$2 - 1 = 1$。结果是 167。\n\n检验：$167 + 165 = 332$。\n\n> **注意。** 不能用大的数字减小的数字。个位算成 $5 - 2 = 3$ 是错的。",
      ],
      (rng) => {
        const b = rng.int(112, 468);
        const answer = rng.int(112, 468);
        const a = b + answer;
        const [a2, a1, a0] = [Math.floor(a / 100), Math.floor(a / 10) % 10, a % 10];
        const [b2, b1, b0] = [Math.floor(b / 100), Math.floor(b / 10) % 10, b % 10];
        const t0 = a0 < b0 ? 1 : 0;
        const tensTop = a1 - t0;
        const t1 = tensTop < b1 ? 1 : 0;
        const wrongDigits = [0, 1, 2].reduce(
          (sum, i) => sum + Math.abs((Math.floor(a / 10 ** i) % 10) - (Math.floor(b / 10 ** i) % 10)) * 10 ** i,
          0,
        );
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Subtract the ones", "减个位"],
              t0
                ? [`${a0} is less than ${b0}, so trade 1 ten for 10 ones:`, `${a0} 比 ${b0} 小，借 1 个十换成 10 个一：`]
                : ["Enough ones, no trade:", "个位够减："],
              [`${a0 + 10 * t0} - ${b0} = ${a0 + 10 * t0 - b0}`],
            ],
            [
              ["Subtract the tens", "减十位"],
              t1
                ? [`${tensTop} is less than ${b1}, so trade 1 hundred for 10 tens:`, `${tensTop} 比 ${b1} 小，借 1 个百换成 10 个十：`]
                : ["Enough tens, no trade:", "十位够减："],
              [`${tensTop + 10 * t1} - ${b1} = ${tensTop + 10 * t1 - b1}`],
            ],
            [
              ["Subtract the hundreds", "减百位"],
              ["What is left of the hundreds:", "百位剩下的："],
              [`${a2 - t1} - ${b2} = ${a2 - t1 - b2}`],
            ],
          ],
          [`$${answer} + ${b} = ${a}$.`, `$${answer} + ${b} = ${a}$。`],
          [
            [
              wrongDigits,
              "That takes the smaller digit from the larger one in each place instead of trading.",
              "这在每一位都用大的减小的，没有借位。",
            ],
            [a + b, "That adds instead of subtracting.", "这是加法，不是减法。"],
            [answer + 100, "That forgets the hundred that was traded.", "忘了借走的一个百。"],
            [answer + 10, "That forgets the ten that was traded.", "忘了借走的一个十。"],
          ],
        );
      },
      captioned(
        blockRowsFigure([
          [3, 3, 2],
          [3, 2, 12],
          [2, 12, 12],
        ]),
        "332, then 1 ten traded for 12 ones, then 1 hundred traded for 12 tens.",
        "332，先借 1 个十，个位变成 12，再借 1 个百，十位变成 12。",
      ),
    ),
    earlyPoint(
      "subtracting-across-a-zero",
      ["Subtracting across a zero", "跨过零的减法"],
      [
        "Find $304 - 128$. The ones need a trade, but there are 0 tens. So first trade 1 hundred for 10 tens, then 1 ten for 10 ones. Now 304 is 2 hundreds, 9 tens and 14 ones. $14 - 8 = 6$, $9 - 2 = 7$, $2 - 1 = 1$. The answer is 176.\n\nCheck: $176 + 128 = 304$.\n\n> **Watch out.** After trading, the 0 tens become 9, not 10, because one ten moved to the ones.",
        "求 $304 - 128$。个位要借，可是十位是 0。所以先把 1 个百换成 10 个十，再把 1 个十换成 10 个一。现在 304 是 2 个百、9 个十和 14 个一。$14 - 8 = 6$，$9 - 2 = 7$，$2 - 1 = 1$。结果是 176。\n\n检验：$176 + 128 = 304$。\n\n> **注意。** 借完以后，十位的 0 变成 9，不是 10，因为有一个十给了个位。",
      ],
      (rng) => {
        const hundreds = rng.int(2, 9);
        const ones = rng.int(0, 5);
        const a = 100 * hundreds + ones;
        const drawn = rng.int(ones + 11, 100 * (hundreds - 1) + 89);
        const b = Math.floor(drawn / 10) % 10 === 0 ? drawn + 10 : drawn;
        const answer = a - b;
        const [b2, b1, b0] = [Math.floor(b / 100), Math.floor(b / 10) % 10, b % 10];
        const tradeOnes = ones < b0;
        const tensTop = tradeOnes ? 9 : 10;
        const onesTop = tradeOnes ? ones + 10 : ones;
        return solved(
          [`What is $${a} - ${b}$?`, `$${a} - ${b}$ 等于多少？`],
          answer,
          [
            [
              ["Trade across the zero", "跨过 0 借位"],
              tradeOnes
                ? [
                    `There are 0 tens, so trade 1 hundred for 10 tens, then 1 ten for 10 ones: ${hundreds - 1} hundreds, 9 tens, ${onesTop} ones.`,
                    `十位是 0，先把 1 个百换成 10 个十，再把 1 个十换成 10 个一：${hundreds - 1} 个百、9 个十、${onesTop} 个一。`,
                  ]
                : [
                    `The tens need a trade, so trade 1 hundred for 10 tens: ${hundreds - 1} hundreds, 10 tens, ${ones} ones.`,
                    `十位要借，把 1 个百换成 10 个十：${hundreds - 1} 个百、10 个十、${ones} 个一。`,
                  ],
            ],
            [
              ["Subtract each place", "逐位相减"],
              ["Ones, tens, then hundreds:", "个位、十位、百位："],
              [
                `${onesTop} - ${b0} = ${onesTop - b0}`,
                `${tensTop} - ${b1} = ${tensTop - b1}`,
                `${hundreds - 1} - ${b2} = ${hundreds - 1 - b2}`,
              ],
            ],
          ],
          [`$${answer} + ${b} = ${a}$.`, `$${answer} + ${b} = ${a}$。`],
          [
            [answer + 100, "That forgets the hundred that was traded.", "忘了借走的一个百。"],
            [answer + 10, "That keeps 10 tens after trading one of them to the ones.", "有一个十已经给了个位，十位却还当 10 个。"],
            [answer - 10, "That trades one ten too many.", "多借了一个十。"],
            [a + b, "That adds instead of subtracting.", "这是加法，不是减法。"],
          ],
        );
      },
      captioned(
        blockRowsFigure([
          [3, 0, 4],
          [2, 10, 4],
          [2, 9, 14],
        ]),
        "304 as 3 hundreds and 4 ones, then 2 hundreds and 10 tens, then 9 tens and 14 ones.",
        "304 是 3 个百和 4 个一，换成 2 个百和 10 个十，再换成 9 个十和 14 个一。",
      ),
    ),
  ],
  [
    "A farm has 332 eggs and sells 165. Some places are too small to subtract, so we trade a ten for ones and a hundred for tens. 167 eggs are left.\n\nCheck: $167 + 165 = 332$.\n\nIn this lesson we subtract three-digit numbers place by place, trading from the next place when needed.",
    "农场有 332 个鸡蛋，卖了 165 个。有的数位不够减，就把一个十换成一，把一个百换成十。还剩 167 个。\n\n检验：$167 + 165 = 332$。\n\n本课我们按数位相减三位数，不够减时向前一位借。",
  ],
);

/** gradeThreeOperationTopics are the number and operation topics of 3rd Grade Math, in teaching order. */
export const gradeThreeOperationTopics: readonly TopicDef[] = [
  multiplicationAsEqualGroups,
  multiplicationWithArrays,
  multiplyingByTwoFiveTen,
  multiplyingByThreeFour,
  multiplyingBySixToNine,
  multiplyingByZeroAndOne,
  propertiesOfMultiplication,
  splittingAFactor,
  multiplyingByMultiplesOfTen,
  divisionAsSharing,
  divisionAsGrouping,
  relatingMultiplicationDivision,
  divisionFacts,
  multiplyDivideWordProblems,
  twoStepWordProblems,
  orderOfOperationsEarly,
  arithmeticPatterns,
  placeValueThreeDigits,
  roundingToNearestTen,
  roundingToNearestHundred,
  addingWithinThousand,
  subtractingWithinThousand,
];
