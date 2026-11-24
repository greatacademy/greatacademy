// A third knowledge point for the first 6th Grade Math topics on ratios, percents, fraction division,
// signed numbers, expressions and one-step equations: the reverse question, a further step and the usual traps.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { earlyNames, lowestNumerator } from "../early-grades-kit.ts";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { mixedLatex } from "../problems.ts";
import { type MathWrong, type Pair, tableFigure } from "./early-grades-more-kit.ts";
import { chosenMath, drawn, lesson, valued } from "./grade-6-kit.ts";
import { areaGridFigure, equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** reduced continues a calculation with the simplest form of a fraction when that differs from it. */
const reduced = (n: number, d: number) => {
  const v = Q.of(n, d).toLatex();
  return v === frac(n, d) ? "" : ` = ${v}`;
};

/** frac writes a fraction in LaTeX. */
const frac = (n: number | string, d: number | string) => `\\frac{${n}}{${d}}`;

/** commas writes a whole number with thousands separators for LaTeX. */
const commas = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");

/** gcd finds the greatest common factor of two whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** tenths writes a count of tenths as a decimal. */
const tenths = (n: number) => (n / 10).toFixed(1);

/** deeperGrade6ThirdPoints holds the third knowledge points of these 6th Grade Math topics, by topic. */
export const deeperGrade6ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "equivalent-ratios": [
    lesson(
      "sharing-a-total-in-a-ratio",
      ["Sharing a total in a ratio", "按比分配总数"],
      [
        [
          "To share a total in a ratio, add the ratio's numbers to find how many equal shares there are. Divide the total to get one share; each person gets a number of shares. $40$ stickers shared $3 : 5$: $8$ shares of $40 \\div 8 = 5$, so the friends get $15$ and $25$.",
          "按比分配总数时，先把比的各项相加，得到一共几份。总数除以份数得到一份，每人得到若干份。$40$ 张贴纸按 $3 : 5$ 分：共 $8$ 份，每份 $40 \\div 8 = 5$ 张，两人分别得到 $15$ 张和 $25$ 张。",
        ],
        ["$15 + 25 = 40$, and $15 : 25 = 3 : 5$.", "$15 + 25 = 40$，而 $15 : 25 = 3 : 5$。"],
        [
          "Sharing in a ratio is not sharing equally. Half of $40$ is $20$, but the ratio gives $15$ and $25$.",
          "按比分配不是平均分。$40$ 的一半是 $20$，但按比是 $15$ 和 $25$。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const k = rng.int(3, 25);
        const total = (a + b) * k;
        const first = rng.bool();
        const [mine, theirs] = first ? [a, b] : [b, a];
        const [which, whichZh] = first ? ["first", "第一"] : ["second", "第二"];
        return valued(
          [
            `Two friends share $${total}$ stickers in the ratio $${a} : ${b}$. How many stickers does the ${which} friend get?`,
            `两个朋友按 $${a} : ${b}$ 分 $${total}$ 张贴纸。${whichZh}个朋友得到多少张？`,
          ],
          mine * k,
          [
            [["Count the shares", "数份数"], ["Add the ratio's numbers:", "把比的各项相加："], [`${a} + ${b} = ${a + b}`]],
            [["Find one share", "求一份"], ["Divide the total:", "用总数除以份数："], [`${total} \\div ${a + b} = ${k}`]],
            [
              ["Multiply", "乘份数"],
              [`The ${which} friend gets $${mine}$ shares:`, `${whichZh}个朋友得 $${mine}$ 份：`],
              [`${mine} \\times ${k} = ${mine * k}`],
            ],
          ],
          [
            `The other friend gets $${theirs * k}$, and $${mine * k} + ${theirs * k} = ${total}$.`,
            `另一个朋友得 $${theirs * k}$ 张，而 $${mine * k} + ${theirs * k} = ${total}$。`,
          ],
          [
            [theirs * k, "That is the other friend's share.", "这是另一个朋友分到的。"],
            [k, `That is one share. The ${which} friend gets $${mine}$ shares.`, `这是一份的数量。${whichZh}个朋友得 $${mine}$ 份。`],
            [Q.of(total, 2), "That shares the stickers equally, not in the ratio.", "这是平均分，不是按比分。"],
          ],
        );
      },
      tapeFigure(
        [
          { total: "15", pieces: [0, 1, 2].map(() => ({ size: 5, text: "5", lit: true })) },
          { total: "25", pieces: [0, 1, 2, 3, 4].map(() => ({ size: 5, text: "5" })) },
        ],
        ["40 shared in the ratio 3 : 5: eight shares of 5, so 15 and 25.", "40 按 3 : 5 分：8 份，每份 5，所以是 15 和 25。"],
      ),
    ),
  ],
  "comparing-ratios": [
    lesson(
      "the-greatest-of-four-ratios",
      ["The greatest of four ratios", "四个比中最大的"],
      [
        [
          "Ratios are compared by their values, the quotient of the first number by the second. Work out each quotient, then pick the largest. Among $1 : 2$, $3 : 4$, $2 : 5$ and $4 : 5$, the values are $0.5$, $0.75$, $0.4$ and $0.8$, so $4 : 5$ is the greatest.",
          "比的大小由比值决定，比值是前项除以后项的商。算出每个比值，再找最大的。$1 : 2$、$3 : 4$、$2 : 5$、$4 : 5$ 的比值是 $0.5$、$0.75$、$0.4$、$0.8$，所以 $4 : 5$ 最大。",
        ],
        [
          "Cross products: $4 \\times 4 = 16$ and $5 \\times 3 = 15$, so $4 : 5 > 3 : 4$.",
          "交叉相乘：$4 \\times 4 = 16$，$5 \\times 3 = 15$，所以 $4 : 5 > 3 : 4$。",
        ],
        [
          "Larger numbers do not make a larger ratio. $6 : 12$ has big numbers, but its value is only $0.5$.",
          "数大不等于比大。$6 : 12$ 的数大，但比值只有 $0.5$。",
        ],
      ],
      (rng) => {
        const pool = rng.sample<[number, number]>(
          [
            [1, 2],
            [2, 3],
            [3, 4],
            [3, 5],
            [4, 5],
            [5, 8],
            [7, 10],
            [5, 6],
            [7, 8],
            [9, 10],
            [2, 5],
            [3, 8],
            [4, 7],
            [5, 7],
          ],
          4,
        );
        const scaled = pool.map((p): [number, number, number] => {
          const k = rng.int(1, 4);
          return [p[0] * k, p[1] * k, p[0] / p[1]];
        });
        const sorted = [...scaled].sort((x, y) => y[2] - x[2]);
        const [best, next, ...rest] = sorted as [[number, number, number], [number, number, number], ...[number, number, number][]];
        const v = (r: [number, number, number]) => r[2].toFixed(2);
        const wrong: MathWrong[] = [next, ...rest].map((r) => [
          `${r[0]} : ${r[1]}`,
          `Its value is about $${v(r)}$, less than $${v(best)}$.`,
          `它的比值约为 $${v(r)}$，比 $${v(best)}$ 小。`,
        ]);
        return chosenMath(
          rng,
          ["Which ratio has the greatest value?", "哪个比的比值最大？"],
          `${best[0]} : ${best[1]}`,
          wrong,
          [
            [
              ["Find each value", "求每个比值"],
              ["Divide the first number by the second:", "用前项除以后项："],
              scaled.map((r) => `${r[0]} \\div ${r[1]} \\approx ${v(r)}`),
            ],
            [
              ["Pick the greatest", "找出最大的"],
              [
                `The largest value is about $${v(best)}$, from $${best[0]} : ${best[1]}$.`,
                `最大的比值约为 $${v(best)}$，是 $${best[0]} : ${best[1]}$。`,
              ],
            ],
          ],
          [
            `Against the runner-up: $${best[0]} \\times ${next[1]} = ${best[0] * next[1]}$ and $${best[1]} \\times ${next[0]} = ${best[1] * next[0]}$, so $${best[0]} : ${best[1]}$ is larger.`,
            `和第二大的比较：$${best[0]} \\times ${next[1]} = ${best[0] * next[1]}$，$${best[1]} \\times ${next[0]} = ${best[1] * next[0]}$，所以 $${best[0]} : ${best[1]}$ 更大。`,
          ],
        );
      },
      tableFigure(["1 : 2", "3 : 4", "2 : 5", "4 : 5"], [0.5, 0.75, 0.4, 0.8]),
    ),
  ],
  "approximating-ratios": [
    lesson(
      "about-how-many-times-as-many",
      ["About how many times as many", "大约是多少倍"],
      [
        [
          "Round both numbers to friendly ones to see about how many times one is the other. $1{,}206$ cars and $298$ buses: about $1{,}200$ and $300$, and $1{,}200 \\div 300 = 4$, so there are about $4$ times as many cars.",
          "把两个数都取成好算的数，就能看出一个大约是另一个的多少倍。$1206$ 辆汽车和 $298$ 辆公共汽车：约为 $1200$ 和 $300$，$1200 \\div 300 = 4$，所以汽车大约是公共汽车的 $4$ 倍。",
        ],
        ["$4 \\times 298 = 1{,}192$, close to $1{,}206$.", "$4 \\times 298 = 1192$，接近 $1206$。"],
        ["Keep the place values. $1{,}200 \\div 300$ is $4$, not $40$.", "注意数位。$1200 \\div 300$ 是 $4$，不是 $40$。"],
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const b = rng.int(4, 30) * 10;
        const x = b + rng.int(-3, 3);
        const y = k * b + rng.int(-7, 7);
        return valued(
          [
            `A town has $${commas(y)}$ cars and $${x}$ buses. To the nearest whole number, about how many times as many cars as buses are there?`,
            `一个城镇有 $${commas(y)}$ 辆汽车和 $${x}$ 辆公共汽车。汽车的数量大约是公共汽车的多少倍（精确到整数）？`,
          ],
          k,
          [
            [
              ["Round both", "都取近似值"],
              ["Use friendly numbers:", "取好算的数："],
              [`${commas(y)} \\approx ${commas(k * b)}`, `${x} \\approx ${b}`],
            ],
            [
              ["Divide", "相除"],
              ["How many buses fit into the cars:", "汽车数是公共汽车数的几倍："],
              [`${commas(k * b)} \\div ${b} = ${k}`],
            ],
          ],
          [
            `$${k} \\times ${x} = ${commas(k * x)}$, close to $${commas(y)}$.`,
            `$${k} \\times ${x} = ${commas(k * x)}$，接近 $${commas(y)}$。`,
          ],
          [
            [
              k + 1,
              `$${k + 1} \\times ${x} = ${commas((k + 1) * x)}$, too far above $${commas(y)}$.`,
              `$${k + 1} \\times ${x} = ${commas((k + 1) * x)}$，比 $${commas(y)}$ 大太多。`,
            ],
            [k * 10, "That slips a place value: ten times too big.", "这把数位弄错了，大了十倍。"],
            [
              k - 1,
              `$${k - 1} \\times ${x} = ${commas((k - 1) * x)}$, too far below $${commas(y)}$.`,
              `$${k - 1} \\times ${x} = ${commas((k - 1) * x)}$，比 $${commas(y)}$ 小太多。`,
            ],
          ],
        );
      },
      equalTape(4, "300", "1200", 1),
    ),
  ],
  "ratio-tables": [
    lesson(
      "adding-two-columns",
      ["Adding two columns", "把两列相加"],
      [
        [
          "Adding two columns of a ratio table gives another column in the same ratio. With $(4, 6)$ and $(6, 9)$, adding gives $(10, 15)$, still the ratio $2 : 3$.",
          "把比例表的两列相加，得到的还是比相同的一列。$(4, 6)$ 和 $(6, 9)$ 相加得 $(10, 15)$，比仍是 $2 : 3$。",
        ],
        ["$10 = 2 \\times 5$ and $15 = 3 \\times 5$.", "$10 = 2 \\times 5$，$15 = 3 \\times 5$。"],
        [
          "Add the columns; do not multiply them. $(4 \\times 6, 6 \\times 9) = (24, 54)$ is not in the ratio $2 : 3$.",
          "要把两列相加，不是相乘。$(4 \\times 6, 6 \\times 9) = (24, 54)$ 的比不是 $2 : 3$。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 12);
        const p = rng.int(2, 6);
        const q = rng.int(p + 1, 11);
        return valued(
          [
            `A ratio table has the columns $(${a * p}, ${b * p})$ and $(${a * q}, ${b * q})$. Adding them gives a new column. What goes below $${a * (p + q)}$?`,
            `比例表有两列 $(${a * p}, ${b * p})$ 和 $(${a * q}, ${b * q})$。相加得到新的一列。$${a * (p + q)}$ 下面是多少？`,
          ],
          b * (p + q),
          [
            [
              ["Check the top", "看上面的数"],
              ["The top numbers add to the new one:", "上面的数相加得到新的数："],
              [`${a * p} + ${a * q} = ${a * (p + q)}`],
            ],
            [["Add the bottom", "把下面的数相加"], ["Do the same below:", "下面也这样相加："], [`${b * p} + ${b * q} = ${b * (p + q)}`]],
          ],
          [
            `Each column has the bottom $${Q.of(b, a).toLatex()}$ times the top, and $${a * (p + q)} \\times ${Q.of(b, a).toLatex()} = ${b * (p + q)}$.`,
            `每一列下面都是上面的 $${Q.of(b, a).toLatex()}$ 倍，而 $${a * (p + q)} \\times ${Q.of(b, a).toLatex()} = ${b * (p + q)}$。`,
          ],
          [
            [b * p * q, "That multiplies the bottom numbers. Add them.", "这是把下面的数相乘。应该相加。"],
            [
              a * (p + q) + b,
              `That adds $${b}$ to the top number. The bottom comes from adding the bottom numbers.`,
              `这是在上面的数上加 $${b}$。下面的数要由下面两个数相加得到。`,
            ],
            [b * q, "That copies the second column's bottom number.", "这是照抄第二列下面的数。"],
          ],
        );
      },
      tableFigure(["4", "6", "10"], [6, 9, 15]),
    ),
  ],
  "graphing-ratios": [
    lesson(
      "the-height-at-one",
      ["The height at x = 1", "x = 1 时的高度"],
      [
        [
          "A graph of equivalent ratios is a line through the origin. Dividing a point's height by its first coordinate gives the height at $x = 1$, the unit rate. Through $(4, 6)$, the height at $x = 1$ is $6 \\div 4 = \\frac{3}{2}$.",
          "等值比的图像是一条过原点的直线。用一点的纵坐标除以横坐标，就得到 $x = 1$ 时的高度，也就是单位比率。经过 $(4, 6)$ 时，$x = 1$ 处的高度是 $6 \\div 4 = \\frac{3}{2}$。",
        ],
        ["$4 \\times \\frac{3}{2} = 6$, back to the point $(4, 6)$.", "$4 \\times \\frac{3}{2} = 6$，又回到点 $(4, 6)$。"],
        [
          "Divide the height by $x$, not $x$ by the height. $\\frac{4}{6}$ is the run for a rise of $1$.",
          "要用高度除以 $x$，不是 $x$ 除以高度。$\\frac{4}{6}$ 是上升 $1$ 时向右走的距离。",
        ],
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const y = rng.int(1, 30);
        const h = Q.of(y, x);
        return valued(
          [
            `A graph of equivalent ratios of $x$ to $y$ passes through $(${x}, ${y})$. What is $y$ when $x = 1$?`,
            `$x$ 与 $y$ 的等值比图像经过 $(${x}, ${y})$。$x = 1$ 时 $y$ 是多少？`,
          ],
          h,
          [
            [
              ["Scale down to x = 1", "缩到 x = 1"],
              [`Divide both coordinates by $${x}$:`, `两个坐标都除以 $${x}$：`],
              [`(${x}, ${y}) \\to (1, ${frac(y, x)})`],
            ],
            [["Simplify", "化简"], ["The height at $x = 1$ is:", "$x = 1$ 时的高度是："], [`y = ${frac(y, x)} = ${h.toLatex()}`]],
          ],
          [
            `$${x} \\times ${h.toLatex()} = ${y}$, the height of the given point.`,
            `$${x} \\times ${h.toLatex()} = ${y}$，正是已知点的高度。`,
          ],
          [
            [Q.of(x, y), "That divides $x$ by the height, upside down.", "这是用 $x$ 除以高度，颠倒了。"],
            [y, "That is the height at the given point, not at $x = 1$.", "这是已知点的高度，不是 $x = 1$ 时的高度。"],
            [Q.of(x + y, x), "That adds $x$ to the height before dividing.", "这是先把 $x$ 加到高度上再除。"],
          ],
        );
      },
      drawn(gradeDrawings4["graphing-ratios#the-height-at-one"]),
    ),
  ],
  "solving-problems-using-unit-rates": [
    lesson(
      "how-many-for-a-given-cost",
      ["How many for a given cost", "一定的钱能买多少"],
      [
        [
          "A unit rate works in both directions. To find how many items a sum of money buys, divide the money by the price of one. $4$ notebooks cost $\\$12$, so one costs $\\$3$, and $\\$27$ buys $27 \\div 3 = 9$ notebooks.",
          "单位率可以双向使用。求一笔钱能买多少件，就用钱数除以单价。$4$ 本笔记本 $\\$12$，每本 $\\$3$，所以 $\\$27$ 能买 $27 \\div 3 = 9$ 本。",
        ],
        ["$9 \\times \\$3 = \\$27$.", "$9 \\times \\$3 = \\$27$。"],
        [
          "Divide by the price of one, not by the first total. $27 \\div 12$ is not a number of notebooks.",
          "要除以单价，不是除以原来的总价。$27 \\div 12$ 不是本数。",
        ],
      ],
      (rng) => {
        const price = rng.int(2, 12);
        const n = rng.int(3, 12);
        const m = rng.int(n + 1, 40);
        return valued(
          [
            `$${n}$ notebooks cost $${n * price}$ dollars. At the same price, how many notebooks can be bought for $${m * price}$ dollars?`,
            `$${n}$ 本笔记本售价 $${n * price}$ 美元。按同样的价格，$${m * price}$ 美元能买多少本？`,
          ],
          m,
          [
            [
              ["Find the unit price", "求单价"],
              ["Divide the cost by the number:", "总价除以本数："],
              [`${n * price} \\div ${n} = ${price}`],
            ],
            [
              ["Divide the money", "用钱数除以单价"],
              ["How many prices fit in the money:", "这笔钱里有几个单价："],
              [`${m * price} \\div ${price} = ${m}`],
            ],
          ],
          [
            `$${m}$ notebooks at $${price}$ dollars cost $${m} \\times ${price} = ${m * price}$ dollars.`,
            `$${m}$ 本、每本 $${price}$ 美元，共 $${m} \\times ${price} = ${m * price}$ 美元。`,
          ],
          [
            [m * price, "That is the money, not the number of notebooks.", "这是钱数，不是本数。"],
            [
              n + m,
              `That adds $${n}$ to the answer. The money buys $${m}$ notebooks on its own.`,
              `这是又加上了 $${n}$。这笔钱单独就能买 $${m}$ 本。`,
            ],
            [m * n, `That multiplies by $${n}$. Divide the money by the price of one.`, `这是乘了 $${n}$。应该用钱数除以单价。`],
          ],
        );
      },
      equalTape(9, "3", "27", 0),
    ),
  ],
  "understanding-percentages-using-models": [
    lesson(
      "parts-of-a-bar-for-a-percent",
      ["Parts of a bar for a percent", "百分数对应几份"],
      [
        [
          "A whole bar is $100\\%$, so each of its equal parts is $100\\%$ divided by the number of parts. The parts to shade are the percent divided by one part. A bar of $5$ parts has $20\\%$ in each, so $60\\%$ is $60 \\div 20 = 3$ parts.",
          "整个长条是 $100\\%$，所以每一等份是 $100\\%$ 除以份数。要涂的份数是百分数除以每份的大小。$5$ 份的长条每份 $20\\%$，所以 $60\\%$ 是 $60 \\div 20 = 3$ 份。",
        ],
        ["$3 \\times 20\\% = 60\\%$.", "$3 \\times 20\\% = 60\\%$。"],
        [
          "The percent is not the number of parts. $60\\%$ of a $5$-part bar is $3$ parts, not $60$.",
          "百分数不是份数。$5$ 份长条的 $60\\%$ 是 $3$ 份，不是 $60$ 份。",
        ],
      ],
      (rng) => {
        const parts = rng.pick([2, 4, 5, 10, 20, 25, 50]);
        const each = 100 / parts;
        const k = rng.int(1, parts - 1);
        return valued(
          [
            `A bar is split into $${parts}$ equal parts. How many parts must be shaded to show $${k * each}\\%$?`,
            `一个长条分成 $${parts}$ 等份。要表示 $${k * each}\\%$ 需要涂几份？`,
          ],
          k,
          [
            [
              ["Find one part", "求一份"],
              [`$100\\%$ shared among $${parts}$ parts:`, `$100\\%$ 平均分成 $${parts}$ 份：`],
              [`100 \\div ${parts} = ${each}`],
            ],
            [
              ["Count the parts", "求份数"],
              [`How many parts of $${each}\\%$ make $${k * each}\\%$:`, `几个 $${each}\\%$ 是 $${k * each}\\%$：`],
              [`${k * each} \\div ${each} = ${k}`],
            ],
          ],
          [
            `$${k}$ parts of $${each}\\%$ make $${k} \\times ${each} = ${k * each}\\%$.`,
            `$${k}$ 份、每份 $${each}\\%$，共 $${k} \\times ${each} = ${k * each}\\%$。`,
          ],
          [
            [k * each, "That is the percent, not the number of parts.", "这是百分数，不是份数。"],
            [parts - k, "That is the parts left unshaded.", "这是不涂色的份数。"],
            [k + 1, `That is one part too many: it shows $${(k + 1) * each}\\%$.`, `这多了一份：表示的是 $${(k + 1) * each}\\%$。`],
          ],
        );
      },
      equalTape(5, "20%", "100%", 3),
    ),
  ],
  "converting-between-percentages-and-fractions": [
    lesson(
      "percents-over-one-hundred-as-fractions",
      ["Percents over 100 as fractions", "超过 100% 的百分数化分数"],
      [
        [
          "A percent over $100$ means more than the whole, so its fraction is greater than $1$. Write it over $100$ and simplify: $135\\% = \\frac{135}{100} = \\frac{27}{20}$.",
          "超过 $100\\%$ 的百分数表示比整体多，所以对应的分数大于 $1$。写成分母为 $100$ 的分数再约分：$135\\% = \\frac{135}{100} = \\frac{27}{20}$。",
        ],
        [
          "$\\frac{27}{20} = 1\\frac{7}{20}$, and $\\frac{7}{20} = 35\\%$, so it is $100\\% + 35\\%$.",
          "$\\frac{27}{20} = 1\\frac{7}{20}$，而 $\\frac{7}{20} = 35\\%$，所以就是 $100\\% + 35\\%$。",
        ],
        [
          "Keep the whole. $\\frac{35}{100}$ is only $35\\%$; the $100\\%$ is missing.",
          "不能丢掉整体。$\\frac{35}{100}$ 只是 $35\\%$，少了 $100\\%$。",
        ],
      ],
      (rng) => {
        let p = rng.int(21, 79) * 5;
        if (p % 100 === 0) p += 5;
        const g = gcd(p, 100);
        return valued(
          [`Write $${p}\\%$ as a fraction in simplest form.`, `把 $${p}\\%$ 写成最简分数。`],
          Q.of(p, 100),
          [
            [["Write over 100", "写成分母 100"], ["Percent means hundredths:", "百分数表示百分之几："], [`${p}\\% = ${frac(p, 100)}`]],
            [["Simplify", "约分"], [`Divide both by $${g}$:`, `分子分母都除以 $${g}$：`], [`${frac(p, 100)} = ${frac(p / g, 100 / g)}`]],
          ],
          [
            `$${frac(p / g, 100 / g)} = ${p / 100}$, more than $1$ just as $${p}\\%$ is more than $100\\%$.`,
            `$${frac(p / g, 100 / g)} = ${p / 100}$，大于 $1$，正如 $${p}\\%$ 大于 $100\\%$。`,
          ],
          [
            [Q.of(100, p), "That is upside down: $100$ goes on the bottom.", "这颠倒了：$100$ 应该作分母。"],
            [Q.of(p, 1000), "That puts the number over $1000$. Percent means hundredths.", "这是写在 $1000$ 上面。百分数表示百分之几。"],
            [Q.of(p - 100, 100), "That drops the whole $100\\%$.", "这丢掉了整体的 $100\\%$。"],
          ],
          { form: "fraction" },
        );
      },
      tapeFigure(
        [
          { total: "100%", pieces: [{ size: 100, text: "100", lit: true }] },
          {
            total: "135%",
            pieces: [
              { size: 100, text: "100", lit: true },
              { size: 35, text: "35" },
            ],
          },
        ],
        ["135% is a whole bar of 100% and 35% more, so it is more than 1.", "135% 是一整条 100% 再加 35%，所以大于 1。"],
      ),
    ),
  ],
  "converting-between-percentages-and-decimals": [
    lesson(
      "percents-below-one-as-decimals",
      ["Percents below 1 as decimals", "小于 1% 的百分数化小数"],
      [
        [
          "Moving the point two places to the left works for every percent, even one below $1$. $0.5\\%$ becomes $0.005$, and $0.04\\%$ becomes $0.0004$.",
          "小数点左移两位适用于所有百分数，包括小于 $1\\%$ 的。$0.5\\%$ 化成 $0.005$，$0.04\\%$ 化成 $0.0004$。",
        ],
        ["$0.005 \\times 100 = 0.5$, so $0.005$ is $0.5\\%$.", "$0.005 \\times 100 = 0.5$，所以 $0.005$ 是 $0.5\\%$。"],
        [
          "$0.5$ is fifty percent, not half of one percent. Still move the point two places.",
          "$0.5$ 是百分之五十，不是百分之零点五。仍然要移两位。",
        ],
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const form = rng.int(0, 2);
        const two = rng.int(1, 9) * 10 + k;
        const percent = form === 0 ? `0.${k}` : form === 1 ? `0.0${k}` : `0.${two}`;
        const answer = form === 0 ? `0.00${k}` : form === 1 ? `0.000${k}` : `0.00${two}`;
        const oneShort = form === 0 ? `0.0${k}` : form === 1 ? `0.00${k}` : `0.0${two}`;
        const wrongWay = form === 0 ? `${k}` : form === 1 ? `0.${k}` : `${two}`;
        return chosenMath(
          rng,
          [`Write $${percent}\\%$ as a decimal.`, `把 $${percent}\\%$ 写成小数。`],
          answer,
          [
            [percent, "That drops the percent sign without dividing by $100$.", "这只是去掉了百分号，没有除以 $100$。"],
            [oneShort, "That moves the point only one place.", "这只把小数点移了一位。"],
            [wrongWay, "That moves the point to the right, which multiplies.", "这是把小数点向右移，变成了乘。"],
          ],
          [
            [
              ["Divide by 100", "除以 100"],
              ["Percent means hundredths:", "百分数表示百分之几："],
              [`${percent}\\% = ${percent} \\div 100`],
            ],
            [
              ["Move the point", "移动小数点"],
              ["Two places to the left, writing zeros:", "向左移两位，不够的补 $0$："],
              [`${percent} \\div 100 = ${answer}`],
            ],
          ],
          [
            `$${answer} \\times 100 = ${percent}$, so $${answer}$ is $${percent}\\%$.`,
            `$${answer} \\times 100 = ${percent}$，所以 $${answer}$ 就是 $${percent}\\%$。`,
          ],
        );
      },
      tableFigure(["50%", "5%", "0.5%"], [0.5, 0.05, 0.005]),
    ),
  ],
  "finding-a-percentage-given-two-numbers": [
    lesson(
      "the-percent-that-did-not",
      ["The percent that did not", "没有做到的百分比"],
      [
        [
          "The two parts of a whole have percents that add to $100\\%$. So the percent who did not do something is $100\\%$ minus the percent who did. $60$ of $200$ students walk: $\\frac{60}{200} = 30\\%$, so $70\\%$ do not walk.",
          "整体的两部分的百分数之和是 $100\\%$。所以没有做某事的百分数，就是 $100\\%$ 减去做了的百分数。$200$ 名学生中 $60$ 人步行：$\\frac{60}{200} = 30\\%$，所以 $70\\%$ 不步行。",
        ],
        ["$140$ do not walk, and $\\frac{140}{200} = 70\\%$.", "不步行的有 $140$ 人，$\\frac{140}{200} = 70\\%$。"],
        ["Answer the group asked about. $30\\%$ is those who walk.", "回答所问的那部分人。$30\\%$ 是步行的。"],
      ],
      (rng) => {
        const total = rng.pick([20, 40, 60, 80, 100, 200, 300, 400, 500]);
        const p = rng.int(2, 19) * 5;
        const yes = (total * p) / 100;
        return valued(
          [
            `In a school of $${total}$ students, $${yes}$ walk to school. What percent of the students do not walk to school?`,
            `一所有 $${total}$ 名学生的学校中，$${yes}$ 人步行上学。不步行上学的学生占百分之几？`,
          ],
          100 - p,
          [
            [
              ["Find the percent who walk", "求步行的百分数"],
              ["Part over whole:", "部分比整体："],
              [`${frac(yes, total)} = ${frac(p, 100)} = ${p}\\%`],
            ],
            [["Subtract from 100%", "用 100% 减"], ["The rest do not walk:", "其余的不步行："], [`100\\% - ${p}\\% = ${100 - p}\\%`]],
          ],
          [
            `$${total - yes}$ students do not walk, and $${frac(total - yes, total)} = ${100 - p}\\%$.`,
            `不步行的有 $${total - yes}$ 人，而 $${frac(total - yes, total)} = ${100 - p}\\%$。`,
          ],
          [
            [p, "That is the percent who walk.", "这是步行的百分数。"],
            [total - yes, "That is the number who do not walk, not the percent.", "这是不步行的人数，不是百分数。"],
            [
              100 - yes,
              `That subtracts the number $${yes}$ from $100$. Subtract the percent instead.`,
              `这是用 $100$ 减去人数 $${yes}$。应该减去百分数。`,
            ],
          ],
          { percent: true },
        );
      },
      tapeFigure(
        [
          {
            total: "100%",
            pieces: [
              { size: 30, text: "30%" },
              { size: 70, text: "70%", lit: true },
            ],
          },
        ],
        ["The whole is 100%: 30% walk, and the shaded 70% do not.", "整体是 100%：30% 步行，涂色的 70% 不步行。"],
      ),
    ),
  ],
  "converting-units-of-length-to-larger-units-using-long-division": [
    lesson(
      "feet-left-after-whole-miles",
      ["Feet left after whole miles", "整英里之后剩下的英尺"],
      [
        [
          "A mile is $5{,}280$ feet, too large for mental work, so use long division. The quotient is the whole miles and the remainder is the feet left over. $12{,}000 \\div 5{,}280 = 2$ R $1{,}440$: $2$ miles and $1{,}440$ feet.",
          "$1$ 英里是 $5280$ 英尺，心算太难，所以用长除法。商是整英里数，余数是剩下的英尺。$12000 \\div 5280 = 2$ 余 $1440$：$2$ 英里 $1440$ 英尺。",
        ],
        ["$2 \\times 5{,}280 + 1{,}440 = 10{,}560 + 1{,}440 = 12{,}000$.", "$2 \\times 5280 + 1440 = 10560 + 1440 = 12000$。"],
        [
          "The remainder must be less than $5{,}280$; if it is not, another whole mile fits.",
          "余数必须小于 $5280$；否则还能再凑一整英里。",
        ],
      ],
      (rng) => {
        const m = rng.int(2, 12);
        const r = rng.int(100, 5000);
        const n = 5280 * m + r;
        return valued(
          [
            `Write $${commas(n)}$ feet in miles and feet. How many feet are left over after the whole miles?`,
            `把 $${commas(n)}$ 英尺写成英里和英尺。整英里之后还剩多少英尺？`,
          ],
          r,
          [
            [
              ["Find the whole miles", "求整英里数"],
              [
                `$${m + 1}$ miles would be $${commas(5280 * (m + 1))}$ feet, too many, so:`,
                `$${m + 1}$ 英里是 $${commas(5280 * (m + 1))}$ 英尺，太多了，所以：`,
              ],
              [`5{,}280 \\times ${m} = ${commas(5280 * m)}`],
            ],
            [["Subtract", "相减"], ["The feet left over:", "剩下的英尺："], [`${commas(n)} - ${commas(5280 * m)} = ${commas(r)}`]],
          ],
          [`$${m} \\times 5{,}280 + ${commas(r)} = ${commas(n)}$ feet.`, `$${m} \\times 5280 + ${commas(r)} = ${commas(n)}$ 英尺。`],
          [
            [m, "That is the number of whole miles, not the feet left.", "这是整英里数，不是剩下的英尺。"],
            [r + 5280, "That takes away one mile too few; another whole mile still fits.", "这少减了一英里，还能再凑一整英里。"],
            [
              n - 5000 * m,
              "That uses $5{,}000$ feet for a mile. A mile is $5{,}280$ feet.",
              "这把 $1$ 英里当成了 $5000$ 英尺。$1$ 英里是 $5280$ 英尺。",
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "12000",
            pieces: [
              { size: 5280, text: "5280", lit: true },
              { size: 5280, text: "5280", lit: true },
              { size: 1440, text: "1440", dashed: true },
            ],
          },
        ],
        ["12,000 feet: two whole miles of 5,280 feet and 1,440 feet left over.", "12000 英尺：两整英里各 5280 英尺，剩下 1440 英尺。"],
      ),
    ),
  ],
  "dividing-fractions-word-problems": [
    lesson(
      "the-length-left-after-cutting",
      ["The length left after cutting", "剪完后剩下的长度"],
      [
        [
          "When a length is cut into equal pieces and does not come out even, a short piece is left. Count the full pieces, take away the length they use, and what remains is the leftover length. $\\frac{11}{8}$ yard cut into $\\frac{3}{8}$ yard pieces makes $3$ pieces using $\\frac{9}{8}$ yard, leaving $\\frac{2}{8} = \\frac{1}{4}$ yard.",
          "把一段长度平均剪成若干段而除不尽时，会剩下一小段。先数出完整的段数，减去它们用掉的长度，剩下的就是余下的长度。$\\frac{11}{8}$ 码的丝带每段剪 $\\frac{3}{8}$ 码，能剪 $3$ 段，用去 $\\frac{9}{8}$ 码，剩下 $\\frac{2}{8} = \\frac{1}{4}$ 码。",
        ],
        [
          "$3 \\times \\frac{3}{8} + \\frac{2}{8} = \\frac{9}{8} + \\frac{2}{8} = \\frac{11}{8}$, the whole ribbon.",
          "$3 \\times \\frac{3}{8} + \\frac{2}{8} = \\frac{9}{8} + \\frac{2}{8} = \\frac{11}{8}$，正好是整根丝带。",
        ],
        [
          "The quotient $\\frac{11}{3} = 3\\frac{2}{3}$ has fraction part $\\frac{2}{3}$, but that counts pieces, not yards: the leftover is $\\frac{2}{3}$ of a piece, $\\frac{1}{4}$ yard.",
          "商 $\\frac{11}{3} = 3\\frac{2}{3}$ 的分数部分是 $\\frac{2}{3}$，但它数的是段数，不是码数：剩下的是一段的 $\\frac{2}{3}$，也就是 $\\frac{1}{4}$ 码。",
        ],
      ],
      (rng) => {
        const d = rng.pick([6, 8, 10, 12]);
        const piece = rng.pick([2, 3, 4].filter((x) => x < d));
        const count = rng.int(2, 7);
        const left = rng.int(1, piece - 1);
        const total = piece * count + left;
        return valued(
          [
            `A ribbon $${frac(total, d)}$ yards long is cut into as many pieces of $${frac(piece, d)}$ yard as possible. How many yards are left over?`,
            `一根 $${frac(total, d)}$ 码长的丝带尽量剪成每段 $${frac(piece, d)}$ 码。还剩多少码？`,
          ],
          Q.of(left, d),
          [
            [
              ["Full pieces", "完整的段数"],
              [
                `Compare the numerators: $${total} \\div ${piece} = ${count}$ R $${left}$. That makes $${count}$ full pieces.`,
                `比较分子：$${total} \\div ${piece} = ${count}$ 余 $${left}$，所以能剪 $${count}$ 整段。`,
              ],
            ],
            [
              ["What is left", "剩下的长度"],
              ["Take away the length the pieces use:", "减去这些段用掉的长度："],
              [
                `${frac(total, d)} - ${count} \\times ${frac(piece, d)} = ${frac(total, d)} - ${frac(piece * count, d)} = ${frac(left, d)}${reduced(left, d)}`,
              ],
            ],
          ],
          [
            `$${count} \\times ${frac(piece, d)} + ${frac(left, d)} = ${frac(total, d)}$, the whole ribbon, and $${frac(left, d)}$ is shorter than one piece.`,
            `$${count} \\times ${frac(piece, d)} + ${frac(left, d)} = ${frac(total, d)}$，正好是整根丝带，而且 $${frac(left, d)}$ 比一段短。`,
          ],
          [
            [
              Q.of(left, piece),
              "That is the fraction part of the quotient, which counts pieces, not yards.",
              "这是商的分数部分，它数的是段数，不是码数。",
            ],
            [Q.of(piece, d), "That is the length of one piece, not what is left.", "这是一段的长度，不是剩下的。"],
            [Q.of(left + piece, d), "That takes away one piece too few; another full piece still fits.", "这少剪了一段；还能再剪一整段。"],
            [Q.of(total, d), "That is the whole ribbon before cutting.", "这是剪之前整根丝带的长度。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "11/8",
            pieces: [
              { size: 3, text: "3/8", lit: true },
              { size: 3, text: "3/8", lit: true },
              { size: 3, text: "3/8", lit: true },
              { size: 2, text: "2/8", dashed: true },
            ],
          },
        ],
        ["A ribbon of 11/8 yard: three pieces of 3/8 yard and 2/8 yard left over.", "11/8 码的丝带：三段各 3/8 码，剩下 2/8 码。"],
      ),
    ),
  ],
  "dividing-mixed-numbers-by-whole-numbers": [
    lesson(
      "the-number-before-dividing-by-a-whole",
      ["The number before dividing", "除之前的数"],
      [
        [
          "Multiplying undoes dividing. To find the number that was divided, multiply the quotient by the whole number: in $\\square \\div 3 = 1\\frac{1}{2}$, the box is $3 \\times 1\\frac{1}{2} = 3 \\times \\frac{3}{2} = \\frac{9}{2} = 4\\frac{1}{2}$.",
          "乘法可以还原除法。要求被除数，就用商乘这个整数：$\\square \\div 3 = 1\\frac{1}{2}$ 中，方框是 $3 \\times 1\\frac{1}{2} = 3 \\times \\frac{3}{2} = \\frac{9}{2} = 4\\frac{1}{2}$。",
        ],
        [
          "Divide back: $4\\frac{1}{2} \\div 3 = \\frac{9}{2} \\times \\frac{1}{3} = \\frac{3}{2} = 1\\frac{1}{2}$.",
          "再除回去：$4\\frac{1}{2} \\div 3 = \\frac{9}{2} \\times \\frac{1}{3} = \\frac{3}{2} = 1\\frac{1}{2}$。",
        ],
        [
          "Multiply the whole mixed number, not just its whole part: $3 \\times 1 + \\frac{1}{2}$ is too small.",
          "要乘整个带分数，不能只乘整数部分：$3 \\times 1 + \\frac{1}{2}$ 太小了。",
        ],
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const a = rng.int(1, 6);
        const n = lowestNumerator(rng, d);
        const k = rng.int(2, 9);
        const quotient = Q.of(a * d + n, d);
        const answer = quotient.mul(Q.of(k));
        return valued(
          [`Fill in the box: $$\\square \\div ${k} = ${a}${frac(n, d)}$$`, `填方框：$$\\square \\div ${k} = ${a}${frac(n, d)}$$`],
          answer,
          [
            [
              ["Undo the division", "还原除法"],
              [
                `The box is the quotient times $${k}$; write the mixed number as an improper fraction:`,
                `方框里的数等于商乘 $${k}$；先把带分数化成假分数：`,
              ],
              [`${a}${frac(n, d)} = ${frac(a * d + n, d)}`],
            ],
            [
              ["Multiply", "相乘"],
              [`Multiply by $${k}$ and simplify:`, `乘 $${k}$ 并化简：`],
              [`${k} \\times ${frac(a * d + n, d)} = ${frac((a * d + n) * k, d)}${reduced((a * d + n) * k, d)}`],
            ],
          ],
          [
            `Divide back: $${answer.toLatex()} \\div ${k} = ${answer.toLatex()} \\times ${frac(1, k)} = ${quotient.toLatex()} = ${a}${frac(n, d)}$.`,
            `再除回去：$${answer.toLatex()} \\div ${k} = ${answer.toLatex()} \\times ${frac(1, k)} = ${quotient.toLatex()} = ${a}${frac(n, d)}$。`,
          ],
          [
            [
              Q.of(a * d + n, d * k),
              `That divides by $${k}$ again instead of undoing the division.`,
              `这又除了一次 $${k}$，而不是还原除法。`,
            ],
            [Q.of(a * d + n * k, d), `That multiplies only the fraction part by $${k}$.`, `这只把分数部分乘了 $${k}$。`],
            [Q.of(a * k * d + n, d), `That multiplies only the whole part by $${k}$.`, `这只把整数部分乘了 $${k}$。`],
          ],
        );
      },
      equalTape(3, "1 1/2", "?"),
    ),
  ],
  "dividing-mixed-numbers-by-fractions": [
    lesson(
      "full-scoops-from-a-mixed-amount",
      ["Full scoops from a mixed amount", "带分数的量能舀几满勺"],
      [
        [
          "Dividing an amount by the scoop size tells how many scoops it holds. When only full scoops count, keep the whole part of the quotient, even if the fraction part is nearly $1$. $2\\frac{3}{4} \\div \\frac{3}{4} = \\frac{11}{4} \\div \\frac{3}{4} = \\frac{11}{3} = 3\\frac{2}{3}$, so $3$ full scoops.",
          "总量除以每勺的大小，得到能舀几勺。只数满勺时取商的整数部分，即使分数部分接近 $1$ 也一样。$2\\frac{3}{4} \\div \\frac{3}{4} = \\frac{11}{4} \\div \\frac{3}{4} = \\frac{11}{3} = 3\\frac{2}{3}$，所以能舀 $3$ 满勺。",
        ],
        [
          "$3$ scoops use $\\frac{9}{4} = 2\\frac{1}{4}$ cups, and a fourth would need $3$ cups, more than $2\\frac{3}{4}$.",
          "$3$ 勺用去 $\\frac{9}{4} = 2\\frac{1}{4}$ 杯，第 $4$ 勺需要总共 $3$ 杯，比 $2\\frac{3}{4}$ 多。",
        ],
        [
          "Do not round $3\\frac{2}{3}$ up to $4$: the fourth scoop would not be full.",
          "不要把 $3\\frac{2}{3}$ 进位成 $4$：第 $4$ 勺舀不满。",
        ],
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([4, 5, 6, 7, 8, 9]);
        const c = rng.pick([2, 3].filter((x) => gcd(x, d) === 1).concat(d === 6 ? [5] : []));
        const a = rng.int(2, 9);
        let n = rng.int(1, d - 1);
        if ((a * d + n) % c === 0) n = n < d - 1 ? n + 1 : n - 1;
        const top = a * d + n;
        const full = Math.floor(top / c);
        return valued(
          [
            `${who} has $${a}${frac(n, d)}$ cups of flour and a scoop that holds $${frac(c, d)}$ cup. How many full scoops can be made?`,
            `${who} 有 $${a}${frac(n, d)}$ 杯面粉，勺子每勺 $${frac(c, d)}$ 杯。能舀多少满勺？`,
          ],
          full,
          [
            [
              ["Divide", "相除"],
              ["Write the amount as an improper fraction and divide by the scoop:", "把总量化成假分数，再除以每勺的量："],
              [
                `${a}${frac(n, d)} \\div ${frac(c, d)} = ${frac(top, d)} \\div ${frac(c, d)} = ${frac(top, c)} = ${mixedLatex(Q.of(top, c))}`,
              ],
            ],
            [
              ["Full scoops", "满勺数"],
              [`Only full scoops count, so keep the whole part: $${full}$.`, `只数满勺，所以取整数部分：$${full}$。`],
            ],
          ],
          [
            `$${full}$ scoops use $${frac(full * c, d)}$ cups, and one more would need $${frac((full + 1) * c, d)}$ cups, more than $${frac(top, d)}$.`,
            `$${full}$ 勺用去 $${frac(full * c, d)}$ 杯，再舀一勺需要总共 $${frac((full + 1) * c, d)}$ 杯，比 $${frac(top, d)}$ 杯多。`,
          ],
          [
            [full + 1, "That rounds up; the last scoop would not be full.", "这是进位了；最后一勺舀不满。"],
            [top, `That counts the $${frac(1, d)}$ cups, not the scoops.`, `这数的是 $${frac(1, d)}$ 杯的份数，不是勺数。`],
            [a, "That is the whole cups; each scoop is less than a cup, so more scoops fit.", "这是整杯数；每勺不到一杯，所以能舀更多勺。"],
          ],
          { form: "integer" },
        );
      },
      tapeFigure(
        [
          {
            total: "2 3/4",
            pieces: [
              { size: 3, text: "3/4", lit: true },
              { size: 3, text: "3/4", lit: true },
              { size: 3, text: "3/4", lit: true },
              { size: 2, text: "2/4", dashed: true },
            ],
          },
        ],
        [
          "2 3/4 cups: three full scoops of 3/4 cup and 2/4 cup that does not fill a scoop.",
          "2 3/4 杯：三满勺各 3/4 杯，剩下 2/4 杯舀不满一勺。",
        ],
      ),
    ),
  ],
  "dividing-whole-numbers-by-mixed-numbers": [
    lesson(
      "the-mixed-number-divisor",
      ["The mixed number divisor", "作为除数的带分数"],
      [
        [
          "In a division, the divisor is the dividend divided by the quotient. In $10 \\div \\square = 4$, the box is $10 \\div 4 = \\frac{10}{4} = 2\\frac{1}{2}$: the answer may well be a mixed number.",
          "除法中，除数等于被除数除以商。$10 \\div \\square = 4$ 中，方框是 $10 \\div 4 = \\frac{10}{4} = 2\\frac{1}{2}$：答案很可能是带分数。",
        ],
        [
          "$4 \\times 2\\frac{1}{2} = 8 + 2 = 10$, so $10 \\div 2\\frac{1}{2} = 4$.",
          "$4 \\times 2\\frac{1}{2} = 8 + 2 = 10$，所以 $10 \\div 2\\frac{1}{2} = 4$。",
        ],
        [
          "Do not divide the other way: $4 \\div 10 = \\frac{2}{5}$ would make the quotient $25$.",
          "不要反过来除：$4 \\div 10 = \\frac{2}{5}$ 会让商变成 $25$。",
        ],
      ],
      (rng) => {
        const q = rng.int(2, 9);
        const k = rng.int(3, 40);
        const top = k % q === 0 ? k + 1 : k;
        const answer = Q.of(top, q);
        return valued(
          [`Fill in the box: $$${top} \\div \\square = ${q}$$`, `填方框：$$${top} \\div \\square = ${q}$$`],
          answer,
          [
            [
              ["Turn it around", "换个算法"],
              ["The divisor is the dividend divided by the quotient:", "除数等于被除数除以商："],
              [`\\square = ${top} \\div ${q}`],
            ],
            [
              ["Divide", "相除"],
              ["Write the quotient as a fraction and simplify:", "写成分数并化简："],
              [`${top} \\div ${q} = ${frac(top, q)}${reduced(top, q)}`],
            ],
          ],
          [
            `Multiply: $${q} \\times ${answer.toLatex()} = ${top}$, so $${top} \\div ${mixedLatex(answer)} = ${q}$.`,
            `相乘：$${q} \\times ${answer.toLatex()} = ${top}$，所以 $${top} \\div ${mixedLatex(answer)} = ${q}$。`,
          ],
          [
            [Q.of(q, top), `That divides the other way, $${q} \\div ${top}$.`, `这是反过来除，算成了 $${q} \\div ${top}$。`],
            [Q.of(top * q), "That multiplies instead of dividing.", "这是相乘，不是相除。"],
            [Q.of(top - q), "That subtracts instead of dividing.", "这是相减，不是相除。"],
          ],
        );
      },
      equalTape(4, "?", "10"),
    ),
  ],
  "dividing-fractions-by-mixed-numbers": [
    lesson(
      "the-reciprocal-of-the-mixed-divisor",
      ["The reciprocal of the mixed divisor", "带分数除数的倒数"],
      [
        [
          "Dividing by a mixed number means multiplying by its reciprocal, but first write the mixed number as an improper fraction. $1\\frac{2}{3} = \\frac{5}{3}$, so its reciprocal is $\\frac{3}{5}$ and $\\frac{1}{2} \\div 1\\frac{2}{3} = \\frac{1}{2} \\times \\frac{3}{5}$.",
          "除以带分数就是乘它的倒数，但要先把带分数化成假分数。$1\\frac{2}{3} = \\frac{5}{3}$，它的倒数是 $\\frac{3}{5}$，所以 $\\frac{1}{2} \\div 1\\frac{2}{3} = \\frac{1}{2} \\times \\frac{3}{5}$。",
        ],
        [
          "A number times its reciprocal is $1$: $\\frac{5}{3} \\times \\frac{3}{5} = 1$.",
          "一个数乘它的倒数等于 $1$：$\\frac{5}{3} \\times \\frac{3}{5} = 1$。",
        ],
        [
          "Turning over only the fraction part, $\\frac{3}{2}$, is the common slip: it ignores the whole $1$.",
          "只颠倒分数部分得到 $\\frac{3}{2}$ 是常见错误：它忽略了整数 $1$。",
        ],
      ],
      (rng) => {
        const d = rng.int(2, 9);
        const n = lowestNumerator(rng, d);
        const x = rng.int(1, 6);
        const b = rng.int(2, 9);
        const a = rng.int(1, b - 1);
        const top = x * d + n;
        return valued(
          [
            `Fill in the box with a fraction: $$${frac(a, b)} \\div ${x}${frac(n, d)} = ${frac(a, b)} \\times \\square$$`,
            `在方框中填一个分数：$$${frac(a, b)} \\div ${x}${frac(n, d)} = ${frac(a, b)} \\times \\square$$`,
          ],
          Q.of(d, top),
          [
            [
              ["Improper fraction", "化成假分数"],
              ["Write the divisor as an improper fraction:", "把除数化成假分数："],
              [`${x}${frac(n, d)} = ${frac(`${x} \\times ${d} + ${n}`, d)} = ${frac(top, d)}`],
            ],
            [
              ["Reciprocal", "求倒数"],
              ["Dividing by it means multiplying by its reciprocal:", "除以它就是乘它的倒数："],
              [`\\square = ${frac(d, top)}${reduced(d, top)}`],
            ],
          ],
          [
            `A number times its reciprocal is $1$: $${frac(top, d)} \\times ${frac(d, top)} = ${frac(top * d, top * d)} = 1$.`,
            `一个数乘它的倒数等于 $1$：$${frac(top, d)} \\times ${frac(d, top)} = ${frac(top * d, top * d)} = 1$。`,
          ],
          [
            [Q.of(d, n), "That turns over only the fraction part and ignores the whole number.", "这只颠倒了分数部分，忽略了整数部分。"],
            [Q.of(top, d), "That is the divisor itself, not its reciprocal.", "这是除数本身，不是它的倒数。"],
            [
              Q.of(1, x).add(Q.of(d, n)),
              "That turns over the whole part and the fraction part separately.",
              "这把整数部分和分数部分分别颠倒了。",
            ],
          ],
          { form: "fraction" },
        );
      },
      equalTape(5, "1/3", "5/3"),
    ),
  ],
  "dividing-mixed-numbers": [
    lesson(
      "a-speed-from-mixed-numbers",
      ["A speed from mixed numbers", "由带分数求速度"],
      [
        [
          "The distance in one hour is the distance divided by the hours. Write both mixed numbers as improper fractions, then multiply by the reciprocal. $3\\frac{3}{4}$ miles in $1\\frac{1}{2}$ hours: $\\frac{15}{4} \\div \\frac{3}{2} = \\frac{15}{4} \\times \\frac{2}{3} = \\frac{5}{2} = 2\\frac{1}{2}$ miles per hour.",
          "一小时走的路程等于总路程除以小时数。先把两个带分数都化成假分数，再乘除数的倒数。$1\\frac{1}{2}$ 小时走 $3\\frac{3}{4}$ 英里：$\\frac{15}{4} \\div \\frac{3}{2} = \\frac{15}{4} \\times \\frac{2}{3} = \\frac{5}{2} = 2\\frac{1}{2}$ 英里每小时。",
        ],
        [
          "$2\\frac{1}{2}$ miles each hour for $1\\frac{1}{2}$ hours: $2\\frac{1}{2} + 1\\frac{1}{4} = 3\\frac{3}{4}$ miles.",
          "每小时 $2\\frac{1}{2}$ 英里，走 $1\\frac{1}{2}$ 小时：$2\\frac{1}{2} + 1\\frac{1}{4} = 3\\frac{3}{4}$ 英里。",
        ],
        [
          "Divide miles by hours, not hours by miles: $\\frac{2}{5}$ would be hours for each mile.",
          "用英里数除以小时数，不是反过来：$\\frac{2}{5}$ 是每英里用的小时数。",
        ],
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const d = rng.pick([2, 3, 4, 5]);
        const n = lowestNumerator(rng, d);
        const a = rng.int(1, 5);
        const e = rng.pick([2, 3, 4, 6]);
        const m = lowestNumerator(rng, e);
        const b = rng.int(1, 4);
        const dist = Q.of(a * d + n, d);
        const time = Q.of(b * e + m, e);
        const speed = dist.div(time);
        return valued(
          [
            `${who} walks $${a}${frac(n, d)}$ miles in $${b}${frac(m, e)}$ hours. At this rate, how many miles does ${who} walk in one hour?`,
            `${who} 在 $${b}${frac(m, e)}$ 小时内走了 $${a}${frac(n, d)}$ 英里。按这个速度，${who} 一小时走多少英里？`,
          ],
          speed,
          [
            [
              ["Improper fractions", "化成假分数"],
              ["Write both mixed numbers as improper fractions:", "把两个带分数都化成假分数："],
              [`${a}${frac(n, d)} = ${frac(a * d + n, d)}`, `${b}${frac(m, e)} = ${frac(b * e + m, e)}`],
            ],
            [
              ["Divide", "相除"],
              ["Miles divided by hours, multiplying by the reciprocal:", "英里数除以小时数，乘除数的倒数："],
              [`${frac(a * d + n, d)} \\times ${frac(e, b * e + m)} = ${speed.toLatex()}`],
            ],
          ],
          [
            `Multiply back: $${speed.toLatex()} \\times ${frac(b * e + m, e)} = ${dist.toLatex()} = ${a}${frac(n, d)}$ miles.`,
            `乘回去：$${speed.toLatex()} \\times ${frac(b * e + m, e)} = ${dist.toLatex()} = ${a}${frac(n, d)}$ 英里。`,
          ],
          [
            [
              time.div(dist),
              "That divides hours by miles, which gives hours for each mile.",
              "这是小时数除以英里数，得到的是每英里用的时间。",
            ],
            [dist.mul(time), "That multiplies the distance by the time instead of dividing.", "这是用路程乘时间，而不是相除。"],
            [dist, "That is the whole distance, walked in more than one hour.", "这是全部路程，用了不止一小时。"],
          ],
          { unit: "miles" },
        );
      },
      tapeFigure(
        [
          {
            total: "3 3/4",
            pieces: [
              { size: 2, text: "2 1/2", lit: true },
              { size: 1, text: "1 1/4" },
            ],
          },
        ],
        [
          "3 3/4 miles split into 2 1/2 miles for the first hour and 1 1/4 miles for the half hour.",
          "3 3/4 英里分成第一小时的 2 1/2 英里和半小时的 1 1/4 英里。",
        ],
      ),
    ),
  ],
  "estimating-multi-digit-division-with-decimals": [
    lesson(
      "dividing-can-make-a-number-larger",
      ["Dividing can make a number larger", "除法可能使数变大"],
      [
        [
          "Dividing by a number between $0$ and $1$ asks how many small pieces fit, so the quotient is larger than the number divided. Dividing by a number greater than $1$ makes it smaller. $2 \\div 0.5 = 4$, since four halves fit in $2$.",
          "除以 $0$ 和 $1$ 之间的数，是在问能放下多少小块，所以商比被除数大。除以大于 $1$ 的数，商比被除数小。$2 \\div 0.5 = 4$，因为 $2$ 里有四个 $0.5$。",
        ],
        [
          "$4 \\times 0.5 = 2$, so $2 \\div 0.5 = 4$ is right, and $4 > 2$.",
          "$4 \\times 0.5 = 2$，所以 $2 \\div 0.5 = 4$ 是对的，而且 $4 > 2$。",
        ],
        [
          "Multiplying by $0.5$ makes $2$ smaller, $1$; it is dividing by $0.5$ that makes it larger.",
          "乘 $0.5$ 会让 $2$ 变小，得 $1$；除以 $0.5$ 才会变大。",
        ],
      ],
      (rng) => {
        const n = rng.int(12, 900);
        const below = rng.int(1, 9);
        let above = rng.int(11, 90);
        if (above % 10 === 0) above += 1;
        const right = `${n} \\div 0.${below}`;
        return chosenMath(
          rng,
          [`Which value is greater than $${n}$?`, `哪个值大于 $${n}$？`],
          right,
          [
            [
              `${n} \\div ${tenths(above)}`,
              `$${tenths(above)}$ is greater than $1$, so dividing by it makes $${n}$ smaller.`,
              `$${tenths(above)}$ 大于 $1$，除以它会使 $${n}$ 变小。`,
            ],
            [
              `${n} \\times 0.${below}`,
              `Multiplying by $0.${below}$, less than $1$, makes $${n}$ smaller.`,
              `乘小于 $1$ 的 $0.${below}$，会使 $${n}$ 变小。`,
            ],
            [`${n} - 0.${below}`, "Subtracting a positive number makes it smaller.", "减去一个正数会使它变小。"],
          ],
          [
            [
              ["Compare with 1", "和 1 比较"],
              [
                `$0.${below}$ is less than $1$, so many pieces of $0.${below}$ fit in $${n}$.`,
                `$0.${below}$ 小于 $1$，所以 $${n}$ 里能放下很多个 $0.${below}$。`,
              ],
            ],
            [
              ["Choose", "选择"],
              [
                `So $${right}$ is greater than $${n}$; the others all make $${n}$ smaller.`,
                `所以 $${right}$ 大于 $${n}$；其他几个都使 $${n}$ 变小。`,
              ],
            ],
          ],
          [
            `Dividing by $0.${below}$ is the same as multiplying by $${frac(10, below)}$, which is more than $1$.`,
            `除以 $0.${below}$ 等于乘 $${frac(10, below)}$，而它大于 $1$。`,
          ],
          equalTape(4, "0.5", "2"),
        );
      },
      equalTape(4, "0.5", "2"),
    ),
  ],
  "interpreting-negative-numbers": [
    lesson(
      "a-depth-after-rising",
      ["A depth after rising", "上升之后的深度"],
      [
        [
          "Heights below sea level are negative, so rising means adding. Starting from a negative height, a rise may stop below sea level or pass above it, and the sign of the answer shows which. From $-20$ meters, rising $30$ meters gives $-20 + 30 = 10$ meters, above sea level.",
          "海平面以下的高度是负数，所以上升就是加。从负的高度出发，上升后可能仍在海平面以下，也可能超过海平面，答案的符号说明是哪一种。从 $-20$ 米上升 $30$ 米：$-20 + 30 = 10$ 米，在海平面以上。",
        ],
        ["Go back down $30$ from $10$: $10 - 30 = -20$, the starting height.", "从 $10$ 再下降 $30$：$10 - 30 = -20$，正是出发的高度。"],
        [
          "Do not drop the minus sign: $20 + 30 = 50$ starts from $20$ meters above sea level.",
          "不要丢掉负号：$20 + 30 = 50$ 是从海平面以上 $20$ 米出发的。",
        ],
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const a = rng.int(5, 60);
        const b = rng.int(2, 80);
        const answer = b - a === 0 ? 1 : b - a;
        const rise = answer + a;
        return valued(
          [
            `${who} is at $-${a}$ meters compared with sea level and rises $${rise}$ meters. What number gives the new height, in meters?`,
            `${who} 位于海平面 $-${a}$ 米处，上升了 $${rise}$ 米。新的高度用什么数表示（单位：米）？`,
          ],
          answer,
          [
            [
              ["Rising adds", "上升就是加"],
              ["Start from the negative height and add the rise:", "从负的高度出发，加上上升的高度："],
              [`-${a} + ${rise}`],
            ],
            [
              ["Add", "计算"],
              answer > 0
                ? [`The rise is more than $${a}$, so it passes sea level:`, `上升的高度超过 $${a}$，所以越过了海平面：`]
                : [`The rise is less than $${a}$, so it stays below sea level:`, `上升的高度不到 $${a}$，所以仍在海平面以下：`],
              [`-${a} + ${rise} = ${answer}`],
            ],
          ],
          [
            `Go back down: $${answer} - ${rise} = -${a}$, the starting height.`,
            `再下降回去：$${answer} - ${rise} = -${a}$，正是出发的高度。`,
          ],
          [
            [a + rise, "That drops the minus sign of the starting height.", "这丢掉了出发高度的负号。"],
            [-(a + rise), "That goes down instead of up.", "这是下降，不是上升。"],
            [-answer, "That has the wrong sign; compare the rise with the depth.", "符号错了；比较一下上升的高度和原来的深度。"],
          ],
          { form: "integer" },
        );
      },
      lineFigure(
        { lo: -20, hi: 20, step: 10, labels: [-20, -10, 0, 10, 20], marks: [{ at: -20 }, { at: 10, result: true }], jumps: [[-20, 10]] },
        ["A number line from −20 to 20 with a jump of 30 from −20 up to 10.", "从 −20 到 20 的数轴，从 −20 向上跳 30 到 10。"],
      ),
    ),
  ],
  "natural-numbers-integers-and-rational-numbers": [
    lesson(
      "how-many-are-integers",
      ["How many are integers", "其中有几个整数"],
      [
        [
          "A number's form can hide its kind. A fraction whose numerator divides evenly by its denominator is an integer, so simplify each number before deciding. Among $\\frac{6}{3}$, $-4$, $\\frac{7}{2}$ and $2.5$, the integers are $\\frac{6}{3} = 2$ and $-4$: two of them.",
          "数的写法可能掩盖它的类型。分子能被分母整除的分数是整数，所以先化简再判断。在 $\\frac{6}{3}$、$-4$、$\\frac{7}{2}$、$2.5$ 中，整数是 $\\frac{6}{3} = 2$ 和 $-4$，共两个。",
        ],
        [
          "Count the others too: $\\frac{7}{2} = 3.5$ and $2.5$ are not integers, and $2 + 2 = 4$ numbers in all.",
          "也数一数其他的：$\\frac{7}{2} = 3.5$ 和 $2.5$ 不是整数，$2 + 2 = 4$，正好是全部的数。",
        ],
        [
          "A fraction bar does not make a number a non-integer: $\\frac{6}{3}$ is just $2$.",
          "有分数线不代表不是整数：$\\frac{6}{3}$ 就是 $2$。",
        ],
      ],
      (rng) => {
        const items: { latex: string; isInt: boolean; plain: boolean; value: string }[] = [];
        const count = rng.int(4, 6);
        for (let i = 0; i < count; i++) {
          const kind = rng.int(0, 3);
          const d = rng.int(2, 6);
          const k = rng.int(1, 9);
          const sign = rng.bool() ? "-" : "";
          if (kind === 0) items.push({ latex: `${sign}${frac(d * k, d)}`, isInt: true, plain: false, value: `${sign}${k}` });
          else if (kind === 1) items.push({ latex: `${sign}${k}`, isInt: true, plain: true, value: `${sign}${k}` });
          else if (kind === 2)
            items.push({
              latex: `${sign}${frac(d * k + 1, d)}`,
              isInt: false,
              plain: false,
              value: `${sign}${mixedLatex(Q.of(d * k + 1, d))}`,
            });
          else items.push({ latex: `${sign}${k}.5`, isInt: false, plain: false, value: `${sign}${k}.5` });
        }
        const answer = items.filter((x) => x.isInt).length;
        const plain = items.filter((x) => x.plain).length;
        const fractions = items.filter((x) => x.latex.includes("frac"));
        return valued(
          [
            `How many of these numbers are integers? $$${items.map((x) => x.latex).join(",\\quad ")}$$`,
            `这些数中有几个是整数？$$${items.map((x) => x.latex).join(",\\quad ")}$$`,
          ],
          answer,
          [
            fractions.length > 0
              ? [["Simplify", "化简"], ["Simplify each fraction:", "把每个分数化简："], fractions.map((x) => `${x.latex} = ${x.value}`)]
              : [
                  ["Simplify", "化简"],
                  ["There are no fractions to simplify.", "没有需要化简的分数。"],
                ],
            [
              ["Count", "数一数"],
              answer === 0
                ? ["None of them is a whole number or the opposite of one.", "没有一个是整数或整数的相反数。"]
                : [
                    `The integers are $${items
                      .filter((x) => x.isInt)
                      .map((x) => x.latex)
                      .join(",\\;")}$: $${answer}$ of them.`,
                    `整数是 $${items
                      .filter((x) => x.isInt)
                      .map((x) => x.latex)
                      .join(",\\;")}$，共 $${answer}$ 个。`,
                  ],
            ],
          ],
          [
            `The other $${count - answer}$ numbers lie between two integers, and $${answer} + ${count - answer} = ${count}$, all the numbers.`,
            `其余 $${count - answer}$ 个数都在两个整数之间，$${answer} + ${count - answer} = ${count}$，正好是全部的数。`,
          ],
          [
            [count, "Every number here is rational, but not every one is an integer.", "这里每个数都是有理数，但不是每个都是整数。"],
            [count - answer, "That counts the numbers that are not integers.", "这数的是不是整数的数。"],
            [
              plain,
              "That counts only the numbers written without a fraction bar; simplify the fractions too.",
              "这只数了没有分数线的数；分数也要化简后再判断。",
            ],
          ],
          { form: "integer" },
        );
      },
      lineFigure(
        {
          lo: -4,
          hi: 4,
          step: 1,
          labels: [-4, -2, 0, 2, 4],
          marks: [
            { at: -4, text: "-4" },
            { at: 2, text: "6/3" },
            { at: 2.5, text: "2.5" },
            { at: 3.5, text: "7/2" },
          ],
        },
        [
          "A number line from −4 to 4: −4 and 6/3 sit on whole numbers, while 2.5 and 7/2 fall between them.",
          "从 −4 到 4 的数轴：−4 和 6/3 落在整数上，而 2.5 和 7/2 落在整数之间。",
        ],
      ),
    ),
  ],
  "comparing-rational-numbers": [
    lesson(
      "farthest-from-zero",
      ["Farthest from zero", "离零最远"],
      [
        [
          "Distance from zero ignores the sign, so look at the absolute values. A very negative number can be farther from zero than a large positive one: $-8$ is $8$ from zero and $6$ is only $6$, so $-8$ is farther.",
          "到零的距离不看符号，所以比较绝对值。很小的负数可能比较大的正数离零更远：$-8$ 离零 $8$，$6$ 离零只有 $6$，所以 $-8$ 更远。",
        ],
        [
          "On a number line, $-8$ is $8$ steps left of $0$ and $6$ is $6$ steps right: $-8$ is the farther point.",
          "在数轴上，$-8$ 在 $0$ 左边 $8$ 格，$6$ 在右边 $6$ 格：$-8$ 更远。",
        ],
        [
          "Farther from zero is not the same as greater: $-8$ is farther than $6$, but $-8 < 6$.",
          "离零更远不等于更大：$-8$ 比 $6$ 离零远，但 $-8 < 6$。",
        ],
      ],
      (rng) => {
        const big = rng.int(30, 95);
        const others = rng.sample([5, 8, 12, 15, 18, 21, 24, 28], 3) as [number, number, number];
        const sign = rng.bool() ? "-" : "";
        const right = `${sign}${tenths(big)}`;
        const shown: [string, number][] = [
          [`${sign === "" ? "-" : ""}${tenths(others[0])}`, others[0]],
          [tenths(others[1]), others[1]],
          [`-${tenths(others[2])}`, others[2]],
        ];
        const all: [string, number][] = [[right, big], ...shown];
        return chosenMath(
          rng,
          ["Which number is farthest from zero?", "哪个数离零最远？"],
          right,
          shown.map(
            ([s, v]): MathWrong =>
              s.startsWith("-")
                ? [
                    s,
                    `Its distance from zero is $${tenths(v)}$, less than $${tenths(big)}$; being negative does not make it farther.`,
                    `它离零 $${tenths(v)}$，比 $${tenths(big)}$ 近；是负数不代表离零更远。`,
                  ]
                : [
                    s,
                    `Its distance from zero is $${tenths(v)}$, less than $${tenths(big)}$.`,
                    `它离零 $${tenths(v)}$，比 $${tenths(big)}$ 近。`,
                  ],
          ),
          [
            [
              ["Distances", "求距离"],
              ["Drop the signs to get each distance from zero:", "去掉符号，得到每个数离零的距离："],
              all.map(([s, v]) => `|${s}| = ${tenths(v)}`),
            ],
            [
              ["Choose", "选择"],
              [
                `The largest distance is $${tenths(big)}$, so $${right}$ is farthest.`,
                `最大的距离是 $${tenths(big)}$，所以 $${right}$ 离零最远。`,
              ],
            ],
          ],
          [
            `On a number line, $${right}$ is $${tenths(big)}$ steps ${sign === "" ? "right" : "left"} of $0$, past every other point.`,
            `在数轴上，$${right}$ 在 $0$ 的${sign === "" ? "右" : "左"}边 $${tenths(big)}$ 处，比其他每个点都远。`,
          ],
        );
      },
      lineFigure(
        {
          lo: -10,
          hi: 10,
          step: 2,
          labels: [-10, 0, 10],
          marks: [
            { at: -8, text: "-8" },
            { at: 6, text: "6" },
          ],
          jumps: [[0, -8]],
        },
        [
          "A number line from −10 to 10 with −8, eight steps left of 0, and 6, six steps right of 0.",
          "从 −10 到 10 的数轴：−8 在 0 左边 8 格，6 在 0 右边 6 格。",
        ],
      ),
    ),
  ],
  "ordering-rational-numbers": [
    lesson(
      "the-number-between-two-negatives",
      ["The number between two negatives", "两个负数之间的数"],
      [
        [
          "Among negative numbers, the one nearer zero is greater. A number between $-3$ and $-2$ is negative, farther from zero than $2$ and nearer than $3$: $-2\\frac{1}{2}$ works, since $-3 < -2\\frac{1}{2} < -2$.",
          "负数中离零较近的较大。在 $-3$ 和 $-2$ 之间的数是负数，比 $2$ 离零远，比 $3$ 离零近：$-2\\frac{1}{2}$ 符合，因为 $-3 < -2\\frac{1}{2} < -2$。",
        ],
        ["On a number line, $-2\\frac{1}{2}$ is halfway between $-3$ and $-2$.", "在数轴上，$-2\\frac{1}{2}$ 在 $-3$ 和 $-2$ 的正中间。"],
        [
          "$-3\\frac{1}{2}$ is not between them: it is left of $-3$, so it is less than both.",
          "$-3\\frac{1}{2}$ 不在它们之间：它在 $-3$ 左边，比两个数都小。",
        ],
      ],
      (rng) => {
        const lo = rng.int(2, 30);
        const hi = lo + 1;
        const d = rng.pick([2, 4, 5]);
        const n = lowestNumerator(rng, d);
        const right = `-${lo}${frac(n, d)}`;
        return chosenMath(
          rng,
          [`Which number lies between $-${hi}$ and $-${lo}$?`, `哪个数在 $-${hi}$ 和 $-${lo}$ 之间？`],
          right,
          [
            [`${lo}${frac(n, d)}`, "That is positive, so it is greater than both negative numbers.", "这是正数，比两个负数都大。"],
            [
              `-${hi}${frac(n, d)}`,
              `That is farther from zero than $${hi}$, so it is less than $-${hi}$.`,
              `它离零比 $${hi}$ 还远，所以比 $-${hi}$ 小。`,
            ],
            [
              `-${lo - 1}${frac(n, d)}`,
              `That is nearer zero than $${lo}$, so it is greater than $-${lo}$.`,
              `它离零比 $${lo}$ 还近，所以比 $-${lo}$ 大。`,
            ],
          ],
          [
            [
              ["Distances", "看距离"],
              [
                `A number between them is negative, farther from zero than $${lo}$ and nearer than $${hi}$.`,
                `在它们之间的数是负数，比 $${lo}$ 离零远，比 $${hi}$ 离零近。`,
              ],
            ],
            [
              ["Choose", "选择"],
              [`$${lo}${frac(n, d)}$ is between $${lo}$ and $${hi}$, so:`, `$${lo}${frac(n, d)}$ 在 $${lo}$ 和 $${hi}$ 之间，所以：`],
              [`-${hi} < ${right} < -${lo}`],
            ],
          ],
          [
            `On a number line, $${right}$ is $${frac(n, d)}$ of the way from $-${lo}$ toward $-${hi}$.`,
            `在数轴上，$${right}$ 在从 $-${lo}$ 走向 $-${hi}$ 的 $${frac(n, d)}$ 处。`,
          ],
        );
      },
      lineFigure({ lo: -4, hi: -1, step: 0.5, labels: [-4, -3, -2, -1], marks: [{ at: -2.5, result: true }, { at: -3.5 }] }, [
        "A number line from −4 to −1 with −2 1/2 between −3 and −2, and −3 1/2 to the left of −3.",
        "从 −4 到 −1 的数轴：−2 1/2 在 −3 和 −2 之间，−3 1/2 在 −3 的左边。",
      ]),
    ),
  ],
  "the-cartesian-coordinate-system": [
    lesson(
      "reflecting-a-point-in-an-axis",
      ["Reflecting a point in an axis", "点关于坐标轴对称"],
      [
        [
          "Reflecting in the $x$-axis moves a point straight up or down, so its second coordinate changes sign and the first stays. Reflecting in the $y$-axis moves it straight left or right, so the first coordinate changes sign. In the $x$-axis, $(3, -7)$ lands on $(3, 7)$.",
          "关于 $x$ 轴对称，点竖直上下移动，所以第二个坐标变号，第一个不变。关于 $y$ 轴对称，点水平左右移动，所以第一个坐标变号。$(3, -7)$ 关于 $x$ 轴的对称点是 $(3, 7)$。",
        ],
        [
          "$(3, -7)$ is $7$ below the $x$-axis and $(3, 7)$ is $7$ above it, straight up: a mirror image.",
          "$(3, -7)$ 在 $x$ 轴下方 $7$，$(3, 7)$ 在 $x$ 轴上方 $7$，正上方：像照镜子一样。",
        ],
        ["In the $x$-axis it is the $y$-coordinate that changes, not $x$.", "关于 $x$ 轴对称，变的是 $y$ 坐标，不是 $x$ 坐标。"],
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = a + rng.int(1, 9);
        const sa = rng.bool() ? a : -a;
        const sb = rng.bool() ? b : -b;
        const xAxis = rng.bool();
        const axis = xAxis ? "$x$" : "$y$";
        const right = xAxis ? `(${sa}, ${-sb})` : `(${-sa}, ${sb})`;
        const dist = xAxis ? b : a;
        return chosenMath(
          rng,
          [`Where does $(${sa}, ${sb})$ land after a reflection in the ${axis}-axis?`, `$(${sa}, ${sb})$ 关于 ${axis} 轴对称的点是哪个？`],
          right,
          [
            [
              xAxis ? `(${-sa}, ${sb})` : `(${sa}, ${-sb})`,
              `That reflects in the other axis; in the ${axis}-axis the ${xAxis ? "first" : "second"} coordinate stays.`,
              `这是关于另一条坐标轴对称；关于 ${axis} 轴对称时${xAxis ? "第一个" : "第二个"}坐标不变。`,
            ],
            [
              `(${-sa}, ${-sb})`,
              "That changes both signs, which is reflecting in both axes.",
              "这把两个坐标都变了号，是先后关于两条坐标轴对称。",
            ],
            [`(${sb}, ${sa})`, "That swaps the coordinates instead of changing a sign.", "这是交换了两个坐标，而不是改变符号。"],
          ],
          [
            [
              ["Keep", "不变的坐标"],
              [
                `The point moves ${xAxis ? "up or down" : "left or right"}, so the ${xAxis ? "first" : "second"} coordinate stays.`,
                `点${xAxis ? "上下" : "左右"}移动，所以${xAxis ? "第一个" : "第二个"}坐标不变。`,
              ],
            ],
            [
              ["Change the sign", "变号"],
              [`The ${xAxis ? "second" : "first"} coordinate becomes its opposite:`, `${xAxis ? "第二个" : "第一个"}坐标变成相反数：`],
              [`(${sa}, ${sb}) \\to ${right}`],
            ],
          ],
          [
            `Both points are $${dist}$ units from the ${axis}-axis, on opposite sides of it.`,
            `两个点到 ${axis} 轴的距离都是 $${dist}$，分在轴的两侧。`,
          ],
        );
      },
      drawn(gradeDrawings3["the-cartesian-coordinate-system#reflecting-a-point-in-an-axis"]),
    ),
  ],
  "rational-numbers-in-the-coordinate-plane": [
    lesson(
      "distance-across-an-axis",
      ["Distance across an axis", "跨过坐标轴的距离"],
      [
        [
          "When two points on one grid line are on opposite sides of an axis, add their distances to the axis. $(2, 1.5)$ and $(2, -2)$ are $1.5$ above and $2$ below the $x$-axis, so they are $1.5 + 2 = 3.5$ units apart.",
          "同一条网格线上的两点在坐标轴两侧时，把它们到坐标轴的距离相加。$(2, 1.5)$ 和 $(2, -2)$ 分别在 $x$ 轴上方 $1.5$ 和下方 $2$，所以相距 $1.5 + 2 = 3.5$ 个单位。",
        ],
        [
          "Subtract the coordinates that differ: $1.5 - (-2) = 3.5$, the same distance.",
          "用不同的坐标相减：$1.5 - (-2) = 3.5$，距离相同。",
        ],
        [
          "$2 - 1.5 = 0.5$ is the slip: subtracting is for two points on the same side.",
          "$2 - 1.5 = 0.5$ 是常见错误：相减只适用于同侧的两点。",
        ],
      ],
      (rng) => {
        const s = rng.int(-6, 6);
        const up = rng.int(1, 9) * 5;
        let down = rng.int(1, 9) * 5;
        if (down === up) down = up === 45 ? 40 : up + 5;
        const value = (x: number) => String(x / 10);
        const vertical = rng.bool();
        const p = vertical ? `(${s}, ${value(up)})` : `(${value(up)}, ${s})`;
        const q = vertical ? `(${s}, -${value(down)})` : `(-${value(down)}, ${s})`;
        const axis = vertical ? "$x$" : "$y$";
        return valued(
          [`How far apart are the points $${p}$ and $${q}$?`, `点 $${p}$ 和 $${q}$ 相距多远？`],
          Q.of(up + down, 10),
          [
            [
              ["Distances to the axis", "到坐标轴的距离"],
              [
                `The points share the coordinate $${s}$ and lie on opposite sides of the ${axis}-axis, at distances:`,
                `两点有相同的坐标 $${s}$，分在 ${axis} 轴两侧，距离分别是：`,
              ],
              [`|${value(up)}| = ${value(up)}`, `|-${value(down)}| = ${value(down)}`],
            ],
            [
              ["Add", "相加"],
              ["On opposite sides, the distances add:", "在两侧时，距离相加："],
              [`${value(up)} + ${value(down)} = ${value(up + down)}`],
            ],
          ],
          [
            `Subtract the coordinates that differ: $${value(up)} - (-${value(down)}) = ${value(up + down)}$.`,
            `用不同的坐标相减：$${value(up)} - (-${value(down)}) = ${value(up + down)}$。`,
          ],
          [
            [
              Q.of(Math.abs(up - down), 10),
              "That subtracts the distances; the points are on opposite sides, so they add.",
              "这把距离相减了；两点在坐标轴两侧，距离要相加。",
            ],
            [Q.of(up + down, 100), "That puts the decimal point in the wrong place.", "小数点的位置错了。"],
            [Q.of(up, 10), "That is only one point's distance to the axis.", "这只是一个点到坐标轴的距离。"],
          ],
          { form: "decimal" },
        );
      },
      lineFigure(
        {
          lo: -3,
          hi: 3,
          step: 0.5,
          labels: [-3, -2, 0, 2, 3],
          marks: [
            { at: -2, text: "-2" },
            { at: 1.5, text: "1.5" },
          ],
          jumps: [
            [-2, 0],
            [0, 1.5],
          ],
        },
        [
          "A number line along an axis with points at −2 and 1.5: jumps of 2 and 1.5 from 0 make 3.5 in all.",
          "沿坐标轴的数轴上有 −2 和 1.5 两点：从 0 分别跳 2 和 1.5，共 3.5。",
        ],
      ),
    ),
  ],
  "solving-problems-in-the-coordinate-plane": [
    lesson(
      "the-area-from-opposite-corners",
      ["The area from opposite corners", "由对角顶点求面积"],
      [
        [
          "Two opposite corners of a rectangle with sides parallel to the axes give both side lengths: the width is the difference of the first coordinates and the height the difference of the second. Corners $(-2, -1)$ and $(3, 2)$ give width $3 - (-2) = 5$ and height $2 - (-1) = 3$, so the area is $15$ and the perimeter $16$.",
          "边平行于坐标轴的长方形，由两个对角顶点可以得到两条边长：宽是第一个坐标之差，高是第二个坐标之差。对角顶点 $(-2, -1)$ 和 $(3, 2)$：宽 $3 - (-2) = 5$，高 $2 - (-1) = 3$，所以面积是 $15$，周长是 $16$。",
        ],
        ["Count the unit squares: $3$ rows of $5$ make $15$.", "数单位正方形：$3$ 行，每行 $5$ 个，共 $15$ 个。"],
        ["Subtracting a negative adds: $3 - (-2) = 5$, not $1$.", "减去负数等于加：$3 - (-2) = 5$，不是 $1$。"],
      ],
      (rng) => {
        const x1 = rng.int(-9, 2);
        const y1 = rng.int(-9, 2);
        const w = rng.int(2, 12);
        let h = rng.int(2, 12);
        if (h === w) h = w === 12 ? 11 : w + 1;
        const area = rng.bool();
        const [x2, y2] = [x1 + w, y1 + h];
        const sub = (a: number, b: number) => `${a} - ${b < 0 ? `(${b})` : b}`;
        const corners: Pair = [`opposite corners $(${x1}, ${y1})$ and $(${x2}, ${y2})$`, `对角顶点 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$`];
        return valued(
          area
            ? [
                `A rectangle with sides parallel to the axes has ${corners[0]}. What is its area?`,
                `边平行于坐标轴的长方形有${corners[1]}。它的面积是多少？`,
              ]
            : [
                `A rectangle with sides parallel to the axes has ${corners[0]}. What is its perimeter?`,
                `边平行于坐标轴的长方形有${corners[1]}。它的周长是多少？`,
              ],
          area ? w * h : 2 * (w + h),
          [
            [
              ["Side lengths", "求边长"],
              ["Subtract the first coordinates, then the second:", "第一个坐标相减，第二个坐标相减："],
              [`${sub(x2, x1)} = ${w}`, `${sub(y2, y1)} = ${h}`],
            ],
            area
              ? [["Area", "求面积"], ["Width times height:", "宽乘高："], [`${w} \\times ${h} = ${w * h}`]]
              : [["Perimeter", "求周长"], ["Twice width plus height:", "宽与高之和的 2 倍："], [`2(${w} + ${h}) = ${2 * (w + h)}`]],
          ],
          area
            ? [`Divide back: $${w * h} \\div ${w} = ${h}$, the height.`, `除回去：$${w * h} \\div ${w} = ${h}$，正是高。`]
            : [
                `Add the four sides: $${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$.`,
                `把四条边加起来：$${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$。`,
              ],
          area
            ? [
                [2 * (w + h), "That is the perimeter, not the area.", "这是周长，不是面积。"],
                [w + h, "That adds the two sides instead of multiplying.", "这是把两条边相加，不是相乘。"],
                [(w + 1) * (h + 1), "That counts grid points, not unit squares.", "这数的是格点，不是单位正方形。"],
              ]
            : [
                [w * h, "That is the area, not the perimeter.", "这是面积，不是周长。"],
                [w + h, "That is only two of the four sides.", "这只是四条边中的两条。"],
                [2 * (w + h + 2), "That counts grid points along the sides, not unit lengths.", "这数的是边上的格点，不是单位长度。"],
              ],
          { form: "integer" },
        );
      },
      drawn(gradeDrawings4["solving-problems-in-the-coordinate-plane#the-area-from-opposite-corners"]),
    ),
  ],
  "introduction-to-algebraic-expressions": [
    lesson(
      "less-than-goes-backwards",
      ["Less than goes backwards", "“比……少”的顺序"],
      [
        [
          "“Less than” turns the order of the words around. “$5$ less than $n$” starts from $n$ and takes $5$ away, so it is $n - 5$. Writing the $5$ first, $5 - n$, describes a different amount.",
          "“比……少”要注意顺序。“比 $n$ 少 $5$”是从 $n$ 开始，减去 $5$，所以是 $n - 5$。把 $5$ 写在前面，$5 - n$，表示的是另一个量。",
        ],
        [
          "Try $n = 12$: $5$ less than $12$ is $7$, and $12 - 5 = 7$, while $5 - 12$ is not $7$.",
          "取 $n = 12$：比 $12$ 少 $5$ 是 $7$，$12 - 5 = 7$；而 $5 - 12$ 不是 $7$。",
        ],
        [
          "The number said first is not always written first. In “$5$ less than $n$”, write $n$ first.",
          "先说的数不一定先写。“比 $n$ 少 $5$”要先写 $n$。",
        ],
      ],
      (rng) => {
        const v = rng.pick(["x", "y", "m", "n", "t", "w", "p"]);
        const a = rng.int(2, 40);
        return chosenMath(
          rng,
          [`Write an expression for ${a} less than $${v}$.`, `写出比 $${v}$ 少 ${a} 的表达式。`],
          `${v} - ${a}`,
          [
            [
              `${a} - ${v}`,
              `That starts from ${a}. “${a} less than $${v}$” starts from $${v}$.`,
              `这是从 ${a} 开始减。“比 $${v}$ 少 ${a}”要从 $${v}$ 开始。`,
            ],
            [`${a}${v}`, "That multiplies. “Less than” takes away.", "这是乘法。“少”要用减法。"],
            [`${v} + ${a}`, `That is ${a} more than $${v}$. “Less than” takes away.`, `这是比 $${v}$ 多 ${a}。“少”要用减法。`],
          ],
          [
            [
              ["Find the start", "找起点"],
              [`“Less than $${v}$” means we start from $${v}$.`, `“比 $${v}$ 少”说明从 $${v}$ 开始。`],
            ],
            [["Take away", "减去"], [`Take ${a} away from it:`, `从中减去 ${a}：`], [`${v} - ${a}`]],
          ],
          [
            `Try $${v} = ${a + 10}$: ${a} less than ${a + 10} is $10$, and $${a + 10} - ${a} = 10$.`,
            `取 $${v} = ${a + 10}$：比 ${a + 10} 少 ${a} 是 $10$，而 $${a + 10} - ${a} = 10$。`,
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "n",
            pieces: [
              { size: 4, text: "n − 5", lit: true },
              { size: 2, text: "5", dashed: true },
            ],
          },
        ],
        ["A bar n with a piece of 5 taken off the end: what is left is n − 5.", "长条 n 去掉末尾的一段 5，剩下的是 n − 5。"],
      ),
    ),
  ],
  "constructing-algebraic-expressions": [
    lesson(
      "a-fee-and-a-rate",
      ["A fee and a rate", "固定费用加单价"],
      [
        [
          "Many costs have a part paid once and a part that grows with the amount used. The growing part is the rate times the letter, and the part paid once is added to it. A rental of $\\$20$ plus $\\$6$ a day costs $6d + 20$ dollars for $d$ days.",
          "很多费用有只付一次的部分，也有随用量增长的部分。增长的部分是单价乘字母，一次性的部分加在后面。租金 $\\$20$，每天再加 $\\$6$，租 $d$ 天要 $6d + 20$ 美元。",
        ],
        [
          "For $3$ days: $20 + 6 + 6 + 6 = 38$, and $6 \\times 3 + 20 = 38$.",
          "租 $3$ 天：$20 + 6 + 6 + 6 = 38$，而 $6 \\times 3 + 20 = 38$。",
        ],
        [
          "Only the rate is multiplied by the letter. $20d + 6$ would pay the fee again every day.",
          "只有单价乘字母。$20d + 6$ 相当于每天都要再付一次固定费用。",
        ],
      ],
      (rng) => {
        const fee = rng.int(2, 30);
        let rate = rng.int(2, 12);
        if (rate === fee) rate += 1;
        const v = rng.pick(["m", "h", "d", "k"]);
        const unit: Pair =
          v === "m" ? ["miles", "英里"] : v === "h" ? ["hours", "小时"] : v === "d" ? ["days", "天"] : ["kilometers", "千米"];
        return chosenMath(
          rng,
          [
            `A rental costs $${fee}$ dollars plus $${rate}$ dollars for each of $${v}$ ${unit[0]}. Which expression gives the total cost in dollars?`,
            `租用费用是 $${fee}$ 美元，每${unit[1]}再加 $${rate}$ 美元，共 $${v}$ ${unit[1]}。哪个表达式表示总费用（美元）？`,
          ],
          `${rate}${v} + ${fee}`,
          [
            [
              `${fee}${v} + ${rate}`,
              `That swaps the two amounts: the $${fee}$ dollars are paid once, not for each of the ${unit[0]}.`,
              `这把两个数弄反了：$${fee}$ 美元只付一次，不是每${unit[1]}都付。`,
            ],
            [
              `(${fee} + ${rate})${v}`,
              `That pays the $${fee}$ dollars again for each of the ${unit[0]}.`,
              `这相当于每${unit[1]}都再付一次 $${fee}$ 美元。`,
            ],
            [
              `${fee} + ${rate} + ${v}`,
              `That adds $${v}$ instead of paying $${rate}$ dollars for each one.`,
              `这是加上 $${v}$，而不是每${unit[1]}付 $${rate}$ 美元。`,
            ],
          ],
          [
            [
              ["The growing part", "增长的部分"],
              [`$${rate}$ dollars for each of $${v}$ ${unit[0]}:`, `每${unit[1]} $${rate}$ 美元，共 $${v}$ ${unit[1]}：`],
              [`${rate}${v}`],
            ],
            [["Add the fee", "加上固定费用"], [`The $${fee}$ dollars are paid once:`, `$${fee}$ 美元只付一次：`], [`${rate}${v} + ${fee}`]],
          ],
          [
            `For $${v} = 2$: $${fee} + ${rate} + ${rate} = ${fee + 2 * rate}$, and $${rate} \\times 2 + ${fee} = ${fee + 2 * rate}$.`,
            `当 $${v} = 2$ 时：$${fee} + ${rate} + ${rate} = ${fee + 2 * rate}$，而 $${rate} \\times 2 + ${fee} = ${fee + 2 * rate}$。`,
          ],
        );
      },
      tapeFigure(
        [{ total: "6d + 20", pieces: [{ size: 3, text: "20", lit: true }, ...Array.from({ length: 3 }, () => ({ size: 1, text: "6" }))] }],
        [
          "A bar: a shaded piece of 20 paid once, then a piece of 6 for each day; 3 days are shown.",
          "一个长条：涂色的一段 20 只付一次，后面每天一段 6；图中画了 3 天。",
        ],
      ),
    ),
  ],
  "evaluating-algebraic-expressions": [
    lesson(
      "the-exponent-binds-first",
      ["The exponent binds first", "指数先算"],
      [
        [
          "In $3x^{2}$ the exponent belongs only to $x$, so square first and then multiply. For $x = 4$: $3 \\times 4^{2} = 3 \\times 16 = 48$. To square the whole product, write parentheses: $(3x)^{2}$.",
          "在 $3x^{2}$ 中，指数只属于 $x$，所以先平方再乘。当 $x = 4$ 时：$3 \\times 4^{2} = 3 \\times 16 = 48$。要把整个积平方，要写括号：$(3x)^{2}$。",
        ],
        [
          "The picture shows $3$ squares of $4 \\times 4$: $16 + 16 + 16 = 48$.",
          "图中是 $3$ 个 $4 \\times 4$ 的正方形：$16 + 16 + 16 = 48$。",
        ],
        [
          "$3x^{2}$ is not $(3x)^{2}$. For $x = 4$ the first is $48$ and the second is $144$.",
          "$3x^{2}$ 不等于 $(3x)^{2}$。当 $x = 4$ 时，前者是 $48$，后者是 $144$。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const x = rng.int(2, 9);
        const v = rng.pick(["x", "y", "n", "t"]);
        return valued(
          [`Evaluate $${a}${v}^{2}$ when $${v} = ${x}$.`, `当 $${v} = ${x}$ 时，求 $${a}${v}^{2}$ 的值。`],
          a * x * x,
          [
            [["Square first", "先平方"], [`Only $${v}$ is squared:`, `只有 $${v}$ 平方：`], [`${x}^{2} = ${x * x}`]],
            [["Then multiply", "再乘"], ["", ""], [`${a} \\times ${x * x} = ${a * x * x}`]],
          ],
          [
            `Add $${a}$ squares of $${x * x}$: $${Array<number>(a)
              .fill(x * x)
              .join(" + ")} = ${a * x * x}$.`,
            `把 $${a}$ 个 $${x * x}$ 相加：$${Array<number>(a)
              .fill(x * x)
              .join(" + ")} = ${a * x * x}$。`,
          ],
          [
            [
              (a * x) ** 2,
              `That squares $${a}$ too. In $${a}${v}^{2}$ only $${v}$ is squared.`,
              `这把 $${a}$ 也平方了。在 $${a}${v}^{2}$ 中只有 $${v}$ 平方。`,
            ],
            [2 * a * x, `That doubles $${x}$ instead of squaring it.`, `这是把 $${x}$ 乘 $2$，不是平方。`],
            [a + x * x, `That adds $${a}$. A number next to a letter multiplies.`, `这是加上 $${a}$。数写在字母前面表示相乘。`],
          ],
        );
      },
      areaGridFigure(["4"], ["4", "4", "4"], [["16", "16", "16"]]),
    ),
  ],
  "identifying-terms-in-linear-expressions": [
    lesson(
      "a-term-keeps-its-sign",
      ["A term keeps its sign", "项带着符号"],
      [
        [
          "A term includes the sign in front of it, because subtracting is the same as adding the opposite. $5x - 3y = 5x + (-3y)$, so the second term is $-3y$, not $3y$.",
          "项包括它前面的符号，因为减去一个数等于加上它的相反数。$5x - 3y = 5x + (-3y)$，所以第二项是 $-3y$，不是 $3y$。",
        ],
        ["For $x = 1$ and $y = 1$: $5 - 3 = 2$, and $5 + (-3) = 2$.", "当 $x = 1$，$y = 1$ 时：$5 - 3 = 2$，$5 + (-3) = 2$。"],
        ["Carry the minus sign with the term. Dropping it turns taking away into adding.", "负号要跟着这一项。丢了它，减就变成了加。"],
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const c = rng.int(2, 15);
        const [u, v] = rng.sample(["x", "y", "m", "n", "p", "t"], 2) as [string, string];
        return chosenMath(
          rng,
          [
            `What is the term containing $${v}$ in $${a}${u} - ${b}${v} + ${c}$?`,
            `在 $${a}${u} - ${b}${v} + ${c}$ 中，含 $${v}$ 的项是什么？`,
          ],
          `-${b}${v}`,
          [
            [`${b}${v}`, "That drops the minus sign in front, which belongs to the term.", "这丢了前面的负号，负号属于这一项。"],
            [v, `That is only the letter. The term is the whole part, number and letter.`, `这只是字母。项是完整的一部分，有数也有字母。`],
            [`-${b}`, "That is only the number with its sign. The term includes the letter.", "这只是带符号的数。项还包括字母。"],
          ],
          [
            [
              ["Find the part", "找出这一部分"],
              [`The part with $${v}$ is $${b}${v}$, with a minus sign in front.`, `含 $${v}$ 的部分是 $${b}${v}$，前面是负号。`],
            ],
            [["Keep the sign", "带上符号"], ["The sign in front belongs to the term:", "前面的符号属于这一项："], [`-${b}${v}`]],
          ],
          [
            `$${a}${u} + (-${b}${v}) + ${c}$ is the same expression, written as a sum of its terms.`,
            `$${a}${u} + (-${b}${v}) + ${c}$ 是同一个代数式，写成了各项的和。`,
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "5x",
            pieces: [
              { size: 3, text: "5x − 3y", lit: true },
              { size: 2, text: "3y", dashed: true },
            ],
          },
        ],
        ["A bar 5x with a piece 3y taken off: the term −3y takes away.", "长条 5x 去掉一段 3y：−3y 这一项表示减去。"],
      ),
    ),
  ],
  "identifying-coefficients-and-constants": [
    lesson(
      "the-sum-of-the-coefficients",
      ["The sum of the coefficients", "系数之和"],
      [
        [
          "Each coefficient carries the sign in front of its term, and a letter alone has coefficient $1$ or $-1$. A constant has no letter, so it is not a coefficient. In $6x - y + 4$ the coefficients are $6$ and $-1$, and their sum is $5$.",
          "每个系数都带着项前面的符号，单独的字母系数是 $1$ 或 $-1$。常数项不含字母，不是系数。在 $6x - y + 4$ 中，系数是 $6$ 和 $-1$，和是 $5$。",
        ],
        [
          "$6x - y + 4 = 6x + (-1)y + 4$, which shows the coefficients $6$ and $-1$.",
          "$6x - y + 4 = 6x + (-1)y + 4$，可以看出系数是 $6$ 和 $-1$。",
        ],
        [
          "Leave the constant out. The $4$ in $6x - y + 4$ has no letter, so it is not a coefficient.",
          "不要算常数项。$6x - y + 4$ 中的 $4$ 不含字母，不是系数。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const c = rng.int(2, 30);
        const minus = rng.bool();
        const [u, v] = rng.sample(["x", "y", "m", "n", "p", "t"], 2) as [string, string];
        const second = minus ? -1 : 1;
        const e = `${a}${u} ${minus ? "-" : "+"} ${v} + ${c}`;
        return valued(
          [`What is the sum of the coefficients of $${u}$ and $${v}$ in $${e}$?`, `在 $${e}$ 中，$${u}$ 和 $${v}$ 的系数之和是多少？`],
          a + second,
          [
            [
              ["Read each coefficient", "读出每个系数"],
              [
                `The coefficient of $${u}$ is $${a}$. $${minus ? `-${v}` : v}$ means $${second}${v}$, so its coefficient is $${second}$.`,
                `$${u}$ 的系数是 $${a}$。$${minus ? `-${v}` : v}$ 表示 $${second}${v}$，系数是 $${second}$。`,
              ],
            ],
            [["Add them", "相加"], ["", ""], [`${a} + (${second}) = ${a + second}`]],
          ],
          [
            `Put $${u} = 1$, $${v} = 1$ and take away the constant: $${a} ${minus ? "-" : "+"} 1 + ${c} - ${c} = ${a + second}$.`,
            `令 $${u} = 1$，$${v} = 1$，再去掉常数项：$${a} ${minus ? "-" : "+"} 1 + ${c} - ${c} = ${a + second}$。`,
          ],
          [
            [a, `That leaves out $${v}$. A letter alone has coefficient $${second}$.`, `这漏了 $${v}$。单独的字母系数是 $${second}$。`],
            [a + second + c, `That counts the constant $${c}$, which has no letter.`, `这把常数项 $${c}$ 也算进去了，它不含字母。`],
            [
              a - second,
              `That uses the wrong sign for $${v}$: its coefficient is $${second}$.`,
              `$${v}$ 的符号用错了：它的系数是 $${second}$。`,
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "6x − y + 4",
            pieces: [
              { size: 6, text: "6x", lit: true },
              { size: 1.5, text: "−y", lit: true },
              { size: 2.5, text: "4" },
            ],
          },
        ],
        [
          "The terms 6x, −y and 4; the two letter terms, with coefficients 6 and −1, are shaded, the constant 4 is not.",
          "各项是 6x、−y 和 4；两个字母项（系数 6 和 −1）涂了色，常数项 4 没有涂。",
        ],
      ),
    ),
  ],
  "identifying-like-terms-in-linear-expressions": [
    lesson(
      "terms-left-after-combining",
      ["Terms left after combining", "合并后还有几项"],
      [
        [
          "Combining like terms leaves one term for each different letter part, and one for the constants. So the number of terms afterward is the number of kinds of term, not the number at the start. $3x + 2 + 4x + 5y$ has the kinds $x$, $y$ and constant, so it becomes $7x + 5y + 2$, with $3$ terms.",
          "合并同类项后，每种字母部分留下一项，常数也留下一项。所以合并后的项数是项的种类数，而不是开始时的项数。$3x + 2 + 4x + 5y$ 有 $x$、$y$ 和常数三种，合并成 $7x + 5y + 2$，共 $3$ 项。",
        ],
        [
          "Counting after combining: $7x$, $5y$, $2$ is $3$ terms, the same as the $3$ kinds.",
          "合并后数一数：$7x$、$5y$、$2$，共 $3$ 项，正好是 $3$ 种。",
        ],
        [
          "Do not count the terms before combining. $3x + 2 + 4x + 5y$ starts with $4$ terms but ends with $3$.",
          "不要数合并前的项。$3x + 2 + 4x + 5y$ 开始有 $4$ 项，合并后只有 $3$ 项。",
        ],
      ],
      (rng) => {
        const [u, v] = rng.sample(["x", "y", "m", "n", "p", "t"], 2) as [string, string];
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const d = rng.int(1, 9);
        const e = rng.int(1, 9);
        const form = rng.int(0, 2);
        const [text, count, start, result] =
          form === 0
            ? ([`${a}${u} + ${d} + ${b}${u} + ${c}${v}`, 3, 4, `${a + b}${u} + ${c}${v} + ${d}`] as const)
            : form === 1
              ? ([`${a}${u} + ${b}${u} + ${d} + ${e}`, 2, 4, `${a + b}${u} + ${d + e}`] as const)
              : ([`${a}${u} + ${d} + ${c}${v} + ${b}${u} + ${e}`, 3, 5, `${a + b}${u} + ${c}${v} + ${d + e}`] as const);
        const kinds: Pair =
          count === 3 ? [`$${u}$, $${v}$ and a constant`, `$${u}$、$${v}$ 和常数`] : [`$${u}$ and a constant`, `$${u}$ 和常数`];
        return valued(
          [`How many terms does $${text}$ have after like terms are combined?`, `$${text}$ 合并同类项后有几项？`],
          count,
          [
            [
              ["Sort the kinds", "分种类"],
              [`The kinds of term are ${kinds[0]}.`, `项的种类有${kinds[1]}。`],
            ],
            [["Combine", "合并"], ["Each kind becomes one term:", "每种合成一项："], [`${text} = ${result}`]],
          ],
          [
            `Count the result: $${result}$ has $${count}$ terms, one for each kind.`,
            `数一数结果：$${result}$ 有 $${count}$ 项，每种一项。`,
          ],
          [
            [start, "That counts the terms before combining.", "这数的是合并前的项。"],
            [
              count === 3 ? 2 : 3,
              count === 3
                ? "That joins two kinds. Different letters stay apart."
                : "That keeps the two constants apart. Constants are like terms.",
              count === 3 ? "这把两种项合在一起了。字母不同的项要分开。" : "这没有合并两个常数。常数项是同类项。",
            ],
            [1, "That joins every term into one. Only like terms combine.", "这把所有项合成了一项。只有同类项才能合并。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "7x",
            pieces: [
              { size: 3, text: "3x", lit: true },
              { size: 4, text: "4x", lit: true },
            ],
          },
          { pieces: [{ size: 5, text: "5y" }] },
          { pieces: [{ size: 2, text: "2" }] },
        ],
        [
          "3x + 2 + 4x + 5y sorted into three rows: x terms, y terms and constants. Three rows give three terms.",
          "把 3x + 2 + 4x + 5y 分成三行：x 的项、y 的项、常数。三行就是三项。",
        ],
      ),
    ),
  ],
  "the-greatest-common-factor-of-two-linear-expressions": [
    lesson(
      "the-gcf-of-three-terms",
      ["The GCF of three terms", "三项的最大公因数"],
      [
        [
          "A common factor must divide every term. If even one term has no letter, the letter cannot be part of the greatest common factor. The GCF of $8x$, $12x$ and $20$ is $4$: it divides all three numbers, and $20$ has no $x$.",
          "公因数必须能整除每一项。只要有一项不含字母，这个字母就不能在最大公因数中。$8x$、$12x$ 和 $20$ 的最大公因数是 $4$：$4$ 能整除这三个数，而 $20$ 不含 $x$。",
        ],
        [
          "$8x \\div 4 = 2x$, $12x \\div 4 = 3x$ and $20 \\div 4 = 5$; $2$, $3$ and $5$ share no factor but $1$.",
          "$8x \\div 4 = 2x$，$12x \\div 4 = 3x$，$20 \\div 4 = 5$；$2$、$3$、$5$ 除了 $1$ 没有公因数。",
        ],
        [
          "Two terms with $x$ are not enough. $4x$ does not divide $20$, so it is not a common factor.",
          "只有两项含 $x$ 不够。$4x$ 不能整除 $20$，所以不是公因数。",
        ],
      ],
      (rng) => {
        const g = rng.int(2, 9);
        const [a, b, c] = rng.pick<[number, number, number]>([
          [2, 3, 5],
          [3, 4, 5],
          [2, 5, 7],
          [3, 5, 7],
          [4, 5, 7],
          [2, 3, 7],
          [5, 6, 7],
        ]);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chosenMath(
          rng,
          [
            `Find the greatest common factor of $${g * a}${v}$, $${g * b}${v}$ and $${g * c}$.`,
            `求 $${g * a}${v}$、$${g * b}${v}$ 和 $${g * c}$ 的最大公因数。`,
          ],
          `${g}`,
          [
            [
              `${g}${v}`,
              `$${g * c}$ has no $${v}$, so $${v}$ cannot be in a common factor.`,
              `$${g * c}$ 不含 $${v}$，所以 $${v}$ 不能在公因数中。`,
            ],
            [
              v,
              `$${v}$ does not divide $${g * c}$, and it leaves out the common number $${g}$.`,
              `$${v}$ 不能整除 $${g * c}$，而且漏了公因数 $${g}$。`,
            ],
            [`${g * c}`, `$${g * c}$ does not divide $${g * a}${v}$.`, `$${g * c}$ 不能整除 $${g * a}${v}$。`],
          ],
          [
            [
              ["The numbers", "看数"],
              [`The GCF of $${g * a}$, $${g * b}$ and $${g * c}$ is $${g}$.`, `$${g * a}$、$${g * b}$、$${g * c}$ 的最大公因数是 $${g}$。`],
            ],
            [
              ["The letter", "看字母"],
              [`$${g * c}$ has no $${v}$, so the GCF has no letter: $${g}$.`, `$${g * c}$ 不含 $${v}$，所以最大公因数不含字母：$${g}$。`],
            ],
          ],
          [
            `Dividing by $${g}$ leaves $${a}${v}$, $${b}${v}$ and $${c}$, and $${a}$, $${b}$, $${c}$ share no factor but $1$.`,
            `除以 $${g}$ 后剩下 $${a}${v}$、$${b}${v}$ 和 $${c}$，$${a}$、$${b}$、$${c}$ 除了 $1$ 没有公因数。`,
          ],
        );
      },
      areaGridFigure(["4"], ["2x", "3x", "5"], [["8x", "12x", "20"]], [1], [2, 3, 5]),
    ),
  ],
  "applying-the-distributive-law-to-linear-expressions": [
    lesson(
      "the-missing-number-in-a-distribution",
      ["The missing number in a distribution", "分配律中缺少的数"],
      [
        [
          "Every term inside the parentheses is multiplied by the factor outside. So a missing number inside is found by dividing the matching term of the expanded form by that factor. In $4(3x + \\square) = 12x + 20$, $4 \\times \\square = 20$, so the box is $5$.",
          "括号内的每一项都要乘外面的因数。所以括号内缺少的数，用展开式中对应的项除以这个因数求出。在 $4(3x + \\square) = 12x + 20$ 中，$4 \\times \\square = 20$，所以方框里是 $5$。",
        ],
        ["$4(3x + 5) = 12x + 20$ when expanded.", "$4(3x + 5)$ 展开正是 $12x + 20$。"],
        [
          "The box is not $20$. $20$ is the product after multiplying by $4$; divide it by $4$.",
          "方框里不是 $20$。$20$ 是乘 $4$ 以后的积，要用它除以 $4$。",
        ],
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const a = rng.int(2, 9);
        const b = rng.int(2, 15);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return valued(
          [
            `Fill in the box: $$${k}(${a}${v} + \\square) = ${k * a}${v} + ${k * b}$$`,
            `填方框：$$${k}(${a}${v} + \\square) = ${k * a}${v} + ${k * b}$$`,
          ],
          b,
          [
            [
              ["Match the constants", "对应常数项"],
              [`The box is multiplied by $${k}$ to give $${k * b}$:`, `方框乘 $${k}$ 得 $${k * b}$：`],
              [`${k} \\times \\square = ${k * b}`],
            ],
            [["Divide", "相除"], ["", ""], [`\\square = ${k * b} \\div ${k} = ${b}`]],
          ],
          [`Expand: $${k}(${a}${v} + ${b}) = ${k * a}${v} + ${k * b}$.`, `展开：$${k}(${a}${v} + ${b}) = ${k * a}${v} + ${k * b}$。`],
          [
            [k * b, `That is the product. The box times $${k}$ gives $${k * b}$.`, `这是积。方框乘 $${k}$ 才得 $${k * b}$。`],
            [k * b - k, `That subtracts $${k}$. Undo multiplying by dividing.`, `这是减去 $${k}$。乘法要用除法来还原。`],
            [b + k, `That adds $${k}$. Divide $${k * b}$ by $${k}$ instead.`, `这是加上 $${k}$。应该用 $${k * b}$ 除以 $${k}$。`],
          ],
        );
      },
      areaGridFigure(["4"], ["3x", "?"], [["12x", "20"]], [1], [3, 2]),
    ),
  ],
  "factoring-linear-expressions": [
    lesson(
      "the-one-left-behind",
      ["The 1 left behind", "留下的 1"],
      [
        [
          "When a term equals the common factor, dividing it by the factor leaves $1$, not nothing. $15x + 5 = 5(3x + 1)$, because $5 \\div 5 = 1$.",
          "某一项等于公因数时，除以公因数得 $1$，不是什么都没有。$15x + 5 = 5(3x + 1)$，因为 $5 \\div 5 = 1$。",
        ],
        ["Expand back: $5 \\cdot 3x + 5 \\cdot 1 = 15x + 5$.", "展开回去：$5 \\cdot 3x + 5 \\cdot 1 = 15x + 5$。"],
        ["Keep the $1$. $5(3x)$ expands to $15x$ and loses the $5$.", "要留下 $1$。$5(3x)$ 展开是 $15x$，丢了 $5$。"],
      ],
      (rng) => {
        const g = rng.int(2, 15);
        const a = rng.int(2, 9);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chosenMath(
          rng,
          [`Factor $${g * a}${v} + ${g}$.`, `因式分解 $${g * a}${v} + ${g}$。`],
          `${g}(${a}${v} + 1)`,
          [
            [`${g}(${a}${v})`, `That drops the $1$: it expands to $${g * a}${v}$ only.`, `这丢了 $1$：展开只得 $${g * a}${v}$。`],
            [
              `${g}(${a}${v} + ${g})`,
              `That leaves $${g}$ inside without dividing it by $${g}$.`,
              `这把 $${g}$ 留在括号里，没有除以 $${g}$。`,
            ],
            [
              `${g * a}(${v} + ${g})`,
              `$${g * a}$ does not divide $${g}$, so it is not a common factor.`,
              `$${g * a}$ 不能整除 $${g}$，不是公因数。`,
            ],
          ],
          [
            [
              ["Find the GCF", "求最大公因数"],
              [`$${g}$ divides $${g * a}${v}$ and $${g}$.`, `$${g}$ 能整除 $${g * a}${v}$ 和 $${g}$。`],
            ],
            [
              ["Divide each term", "每项除以它"],
              ["", ""],
              [`${g * a}${v} \\div ${g} = ${a}${v}`, `${g} \\div ${g} = 1`],
            ],
          ],
          [
            `Expand back: $${g} \\cdot ${a}${v} + ${g} \\cdot 1 = ${g * a}${v} + ${g}$.`,
            `展开回去：$${g} \\cdot ${a}${v} + ${g} \\cdot 1 = ${g * a}${v} + ${g}$。`,
          ],
        );
      },
      areaGridFigure(["5"], ["3x", "1"], [["15x", "5"]], [1], [3, 1.2]),
    ),
  ],
  "identifying-equivalent-expressions": [
    lesson(
      "the-one-that-is-not-equivalent",
      ["The one that is not equivalent", "不等价的表达式"],
      [
        [
          "Two expressions are equivalent when they agree for every value of the letter. A single value that gives different results shows they are not equivalent, so it is a quick test. $3(x + 4)$, $3x + 12$ and $12 + 3x$ are equivalent; $3x + 4$ is not.",
          "两个表达式对字母的每个值都相等时才等价。只要有一个值使结果不同，就说明不等价，所以这是快速的检验方法。$3(x + 4)$、$3x + 12$、$12 + 3x$ 都等价；$3x + 4$ 不等价。",
        ],
        ["Try $x = 0$: $3(0 + 4) = 12$, but $3 \\times 0 + 4 = 4$.", "取 $x = 0$：$3(0 + 4) = 12$，而 $3 \\times 0 + 4 = 4$。"],
        [
          "Changing the order of the terms or factors keeps an expression equivalent; leaving a term unmultiplied does not.",
          "交换项或因数的顺序，代数式仍然等价；有一项没乘，就不等价了。",
        ],
      ],
      (rng) => {
        const k = rng.int(2, 9);
        const a = rng.int(2, 15);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return chosenMath(
          rng,
          [`Which expression is not equivalent to $${k}(${v} + ${a})$?`, `哪个表达式与 $${k}(${v} + ${a})$ 不等价？`],
          `${k}${v} + ${a}`,
          [
            [`${k}${v} + ${k * a}`, `That is the expanded form, so it is equivalent.`, `这是展开后的形式，是等价的。`],
            [
              `${k}(${a} + ${v})`,
              "That only swaps the order inside the parentheses, so it is equivalent.",
              "这只是交换了括号里的顺序，是等价的。",
            ],
            [`${k * a} + ${k}${v}`, "That is the expanded form in another order, so it is equivalent.", "这是换了顺序的展开式，是等价的。"],
          ],
          [
            [["Expand the given expression", "展开原式"], ["", ""], [`${k}(${v} + ${a}) = ${k}${v} + ${k * a}`]],
            [
              ["Find the odd one", "找出不同的"],
              [
                `$${k}${v} + ${a}$ multiplies only $${v}$ by $${k}$; the $${a}$ was never multiplied.`,
                `$${k}${v} + ${a}$ 只把 $${v}$ 乘了 $${k}$；$${a}$ 没有乘。`,
              ],
            ],
          ],
          [
            `Try $${v} = 0$: $${k}(0 + ${a}) = ${k * a}$, but $${k} \\times 0 + ${a} = ${a}$.`,
            `取 $${v} = 0$：$${k}(0 + ${a}) = ${k * a}$，而 $${k} \\times 0 + ${a} = ${a}$。`,
          ],
        );
      },
      areaGridFigure(["3"], ["x", "4"], [["3x", "12"]], [1], [2, 1.6]),
    ),
  ],
  "identifying-solutions-to-linear-equations": [
    lesson(
      "the-equation-a-value-solves",
      ["The equation a value solves", "这个值是哪个方程的解"],
      [
        [
          "A value solves an equation when putting it in makes both sides equal. To find which equation a value solves, put it into each one and compare the two sides. $x = 3$ solves $2x + 5 = 11$, because $2 \\times 3 + 5 = 11$. It does not solve $2(x + 5) = 11$, because $2 \\times 8 = 16$.",
          "代入一个值后两边相等，它就是方程的解。要找它是哪个方程的解，就逐个代入，比较两边。$x = 3$ 是 $2x + 5 = 11$ 的解，因为 $2 \\times 3 + 5 = 11$；它不是 $2(x + 5) = 11$ 的解，因为 $2 \\times 8 = 16$。",
        ],
        ["Solving $2x + 5 = 11$ directly: $11 - 5 = 6$, and $6 \\div 2 = 3$.", "直接解 $2x + 5 = 11$：$11 - 5 = 6$，$6 \\div 2 = 3$。"],
        ["Brackets change the order. In $2(x + 5)$, add $5$ before multiplying.", "括号会改变运算顺序。$2(x + 5)$ 要先加 $5$ 再乘。"],
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const a = rng.int(2, 9);
        const b = rng.int(1, 20);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        const c = a * x + b;
        return chosenMath(
          rng,
          [`For which equation is $${v} = ${x}$ a solution?`, `$${v} = ${x}$ 是哪个方程的解？`],
          `${a}${v} + ${b} = ${c}`,
          [
            [
              `${a}${v} + ${b} = ${c + a}`,
              `The left side is $${c}$, but the right side is $${c + a}$.`,
              `左边是 $${c}$，右边却是 $${c + a}$。`,
            ],
            [
              `${a}${v} - ${b} = ${c}`,
              `The left side is $${a * x} - ${b} = ${a * x - b}$, not $${c}$.`,
              `左边是 $${a * x} - ${b} = ${a * x - b}$，不是 $${c}$。`,
            ],
            [
              `${a}(${v} + ${b}) = ${c}`,
              `The left side is $${a} \\times ${x + b} = ${a * (x + b)}$, not $${c}$.`,
              `左边是 $${a} \\times ${x + b} = ${a * (x + b)}$，不是 $${c}$。`,
            ],
          ],
          [
            [
              ["Work out the left sides", "算出左边"],
              [`Put $${x}$ in place of $${v}$ in each:`, `在每个方程中用 $${x}$ 代替 $${v}$：`],
              [`${a}(${x}) + ${b} = ${c}`, `${a}(${x}) - ${b} = ${a * x - b}`, `${a}(${x} + ${b}) = ${a * (x + b)}`],
            ],
            [
              ["Compare with the right sides", "和右边比较"],
              [`Only $${a}${v} + ${b} = ${c}$ has equal sides.`, `只有 $${a}${v} + ${b} = ${c}$ 两边相等。`],
            ],
          ],
          [
            `Solve $${a}${v} + ${b} = ${c}$ directly: $${c} - ${b} = ${a * x}$, and $${a * x} \\div ${a} = ${x}$.`,
            `直接解 $${a}${v} + ${b} = ${c}$：$${c} - ${b} = ${a * x}$，$${a * x} \\div ${a} = ${x}$。`,
          ],
        );
      },
      tableFigure(["2x + 5", "2(x + 5)"], [11, 16]),
    ),
  ],
  "one-step-addition-equations": [
    lesson(
      "a-negative-solution-to-an-addition",
      ["A negative solution", "负数解"],
      [
        [
          "When the number added is larger than the total, the unknown must be negative. Subtract from both sides as usual: for $x + 9 = 4$, $x = 4 - 9 = -5$.",
          "加上的数比和还大时，未知数一定是负数。照样在两边同时减去这个数：$x + 9 = 4$，得 $x = 4 - 9 = -5$。",
        ],
        ["$-5 + 9 = 4$.", "$-5 + 9 = 4$。"],
        ["Keep the sign. $x = 5$ gives $5 + 9 = 14$, not $4$.", "要保留负号。$x = 5$ 时 $5 + 9 = 14$，不是 $4$。"],
      ],
      (rng) => {
        const b = rng.int(2, 40);
        const a = b + rng.int(1, 40);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return valued(
          [`Solve $${v} + ${a} = ${b}$.`, `解方程 $${v} + ${a} = ${b}$。`],
          b - a,
          [
            [["Undo the addition", "抵消加法"], [`Subtract $${a}$ from both sides:`, `两边同时减去 $${a}$：`], [`${v} = ${b} - ${a}`]],
            [
              ["Work it out", "算出结果"],
              [`$${a}$ is larger than $${b}$, so the result is negative:`, `$${a}$ 比 $${b}$ 大，所以结果是负数：`],
              [`${v} = ${b - a}`],
            ],
          ],
          [`Put $${v} = ${b - a}$ back: $${b - a} + ${a} = ${b}$.`, `代回原方程：$${b - a} + ${a} = ${b}$。`],
          [
            [
              a - b,
              `That drops the sign. $${a - b} + ${a}$ is $${2 * a - b}$, not $${b}$.`,
              `这丢了负号。$${a - b} + ${a}$ 等于 $${2 * a - b}$，不是 $${b}$。`,
            ],
            [a + b, `That adds $${a}$. To undo adding $${a}$, subtract it.`, `这是加上了 $${a}$。要抵消加 $${a}$，应该减去它。`],
            [
              -(a + b),
              `That adds the numbers and makes the result negative. Subtract $${a}$ from $${b}$.`,
              `这是把两个数相加再变成负数。应该用 $${b}$ 减去 $${a}$。`,
            ],
          ],
          { solveFor: v },
        );
      },
      lineFigure(
        {
          lo: -6,
          hi: 5,
          step: 1,
          labels: [-5, 0, 4],
          jumps: [[-5, 4]],
          marks: [
            { at: -5, text: "x", result: true },
            { at: 4, text: "4" },
          ],
        },
        ["A jump of 9 to the right from x lands on 4, so x = 4 − 9 = −5.", "从 x 向右跳 9 落在 4，所以 x = 4 − 9 = −5。"],
      ),
    ),
  ],
  "one-step-subtraction-equations": [
    lesson(
      "subtracting-the-variable-with-a-negative-solution",
      ["Subtracting the variable, with a negative solution", "减去未知数时的负数解"],
      [
        [
          "If a number minus the unknown is larger than the number, the unknown is negative: taking away a negative number makes a value larger. For $5 - x = 8$, add $x$ to both sides, $5 = 8 + x$, so $x = 5 - 8 = -3$.",
          "如果一个数减去未知数后比这个数还大，未知数就是负数：减去负数会使值变大。$5 - x = 8$，两边同时加上 $x$，得 $5 = 8 + x$，所以 $x = 5 - 8 = -3$。",
        ],
        ["$5 - (-3) = 5 + 3 = 8$.", "$5 - (-3) = 5 + 3 = 8$。"],
        [
          "Taking away $3$ gives $5 - 3 = 2$, which is smaller. To end up larger, the number taken away must be negative.",
          "减去 $3$ 得 $5 - 3 = 2$，变小了。要变大，减去的数必须是负数。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 40);
        const b = a + rng.int(1, 40);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return valued(
          [`Solve $${a} - ${v} = ${b}$.`, `解方程 $${a} - ${v} = ${b}$。`],
          a - b,
          [
            [["Move the letter", "移走字母"], [`Add $${v}$ to both sides:`, `两边同时加上 $${v}$：`], [`${a} = ${b} + ${v}`]],
            [
              ["Undo the addition", "抵消加法"],
              [`Subtract $${b}$ from both sides:`, `两边同时减去 $${b}$：`],
              [`${v} = ${a} - ${b} = ${a - b}`],
            ],
          ],
          [
            `Put $${v} = ${a - b}$ back: $${a} - (${a - b}) = ${a} + ${b - a} = ${b}$.`,
            `代回原方程：$${a} - (${a - b}) = ${a} + ${b - a} = ${b}$。`,
          ],
          [
            [
              b - a,
              `That drops the sign. $${a} - ${b - a}$ is $${2 * a - b}$, not $${b}$.`,
              `这丢了负号。$${a} - ${b - a}$ 等于 $${2 * a - b}$，不是 $${b}$。`,
            ],
            [
              a + b,
              `That adds the numbers. Then $${a} - ${a + b}$ is $${-b}$, not $${b}$.`,
              `这是把两个数相加。那样 $${a} - ${a + b}$ 等于 $${-b}$，不是 $${b}$。`,
            ],
            [
              -(a + b),
              `That adds the numbers and makes the result negative. Subtract $${b}$ from $${a}$.`,
              `这是把两个数相加再变成负数。应该用 $${a}$ 减去 $${b}$。`,
            ],
          ],
          { solveFor: v },
        );
      },
      lineFigure(
        {
          lo: -4,
          hi: 9,
          step: 1,
          labels: [0, 5, 8],
          jumps: [[5, 8]],
          marks: [
            { at: 5, text: "5" },
            { at: 8, text: "8", result: true },
          ],
        },
        ["From 5 to 8 is a jump of 3 to the right: taking away −3 adds 3.", "从 5 到 8 向右跳了 3：减去 −3 就是加上 3。"],
      ),
    ),
  ],
  "one-step-multiplication-equations-containing-fractions": [
    lesson(
      "a-fraction-of-an-unknown-number",
      ["A fraction of an unknown number", "未知数的几分之几"],
      [
        [
          "When a fraction of a number is known, write an equation and multiply both sides by the reciprocal. $\\frac{2}{5}$ of a book is $12$ pages: $\\frac{2}{5}p = 12$, so $p = 12 \\times \\frac{5}{2} = 30$.",
          "已知一个数的几分之几时，列方程，再在两边同时乘倒数。一本书的 $\\frac{2}{5}$ 是 $12$ 页：$\\frac{2}{5}p = 12$，所以 $p = 12 \\times \\frac{5}{2} = 30$。",
        ],
        [
          "One fifth of the book is $12 \\div 2 = 6$ pages, and five fifths are $30$.",
          "这本书的五分之一是 $12 \\div 2 = 6$ 页，五个五分之一是 $30$ 页。",
        ],
        [
          "When the fraction is less than $1$, the whole is larger than the part. An answer smaller than $12$ cannot be right.",
          "分数小于 $1$ 时，整体比部分大。比 $12$ 小的答案不可能对。",
        ],
      ],
      (rng) => {
        const d = rng.int(3, 9);
        const n = rng.int(2, d - 1);
        const k = rng.int(2, 20);
        const part = n * k;
        const who = rng.pick(earlyNames);
        return valued(
          [
            `${who} has read $${part}$ pages, which is $${frac(n, d)}$ of a book. How many pages does the book have?`,
            `${who} 读了 $${part}$ 页，是一本书的 $${frac(n, d)}$。这本书有多少页？`,
          ],
          d * k,
          [
            [
              ["Write the equation", "列方程"],
              [`$${frac(n, d)}$ of the $p$ pages is $${part}$:`, `全书 $p$ 页的 $${frac(n, d)}$ 是 $${part}$ 页：`],
              [`${frac(n, d)}p = ${part}`],
            ],
            [
              ["Use the reciprocal", "乘倒数"],
              [`Multiply both sides by $${frac(d, n)}$:`, `两边同时乘 $${frac(d, n)}$：`],
              [`p = ${part} \\times ${frac(d, n)} = ${d * k}`],
            ],
          ],
          [
            `One part is $${part} \\div ${n} = ${k}$ pages, and the book has $${d}$ parts: $${d} \\times ${k} = ${d * k}$.`,
            `一份是 $${part} \\div ${n} = ${k}$ 页，全书有 $${d}$ 份：$${d} \\times ${k} = ${d * k}$。`,
          ],
          [
            [
              Q.of(part * n, d),
              "That multiplies by the fraction instead of its reciprocal, which makes the book shorter than the part read.",
              "这是乘了分数而不是它的倒数，书反而比读过的部分还少。",
            ],
            [
              part * d,
              `That multiplies by $${d}$ only. The reciprocal also divides by $${n}$.`,
              `这只乘了 $${d}$。乘倒数还要再除以 $${n}$。`,
            ],
            [
              part + d,
              `That adds $${d}$. A fraction of the book means multiplying, so undo it with the reciprocal.`,
              `这是加上了 $${d}$。几分之几是乘法，要用倒数来抵消。`,
            ],
          ],
        );
      },
      tapeFigure(
        [{ total: "p = 30", pieces: [0, 1, 2, 3, 4].map((i) => ({ size: 1, text: "6", lit: i < 2 })) }],
        [
          "A bar p in 5 equal parts of 6. Two parts, 2/5 of p, make 12, so p = 30.",
          "长条 p 平均分成 5 份，每份 6。其中 2 份（p 的 2/5）是 12，所以 p = 30。",
        ],
      ),
    ),
  ],
  "one-step-division-equations": [
    lesson(
      "a-division-equation-with-a-negative-quotient",
      ["A negative quotient", "商为负数"],
      [
        [
          "When a number is divided by a positive number and the result is negative, the number divided was negative. Multiply both sides by the divisor as usual: $\\frac{x}{4} = -3$ gives $x = -3 \\times 4 = -12$.",
          "一个数除以正数，结果是负数，说明被除数是负数。照样两边同时乘除数：$\\frac{x}{4} = -3$，得 $x = -3 \\times 4 = -12$。",
        ],
        ["$-12 \\div 4 = -3$.", "$-12 \\div 4 = -3$。"],
        ["Keep the negative sign. $x = 12$ gives $12 \\div 4 = 3$, not $-3$.", "要保留负号。$x = 12$ 时 $12 \\div 4 = 3$，不是 $-3$。"],
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const q = rng.int(2, 15);
        const v = rng.pick(["x", "y", "m", "n", "t"]);
        return valued(
          [`Solve $${frac(v, d)} = -${q}$.`, `解方程 $${frac(v, d)} = -${q}$。`],
          -d * q,
          [
            [["Undo the division", "抵消除法"], [`Multiply both sides by $${d}$:`, `两边同时乘 $${d}$：`], [`${v} = -${q} \\times ${d}`]],
            [["Work it out", "算出结果"], ["A negative times a positive is negative:", "负数乘正数得负数："], [`${v} = ${-d * q}`]],
          ],
          [`Put $${v} = ${-d * q}$ back: $${-d * q} \\div ${d} = -${q}$.`, `代回原方程：$${-d * q} \\div ${d} = -${q}$。`],
          [
            [
              d * q,
              `That drops the sign. $${d * q} \\div ${d}$ is $${q}$, not $-${q}$.`,
              `这丢了负号。$${d * q} \\div ${d}$ 等于 $${q}$，不是 $-${q}$。`,
            ],
            [Q.of(-q, d), `That divides by $${d}$ again. Multiplication undoes division.`, `这是又除以了 $${d}$。要抵消除法，应该用乘法。`],
            [-d - q, `That adds $-${q}$ and $-${d}$. Multiply instead.`, `这是把 $-${q}$ 和 $-${d}$ 相加，应该相乘。`],
          ],
          { solveFor: v },
        );
      },
      lineFigure(
        {
          lo: -12,
          hi: 0,
          step: 3,
          labels: [-12, -9, -6, -3, 0],
          jumps: [
            [0, -3],
            [-3, -6],
            [-6, -9],
            [-9, -12],
          ],
          marks: [{ at: -12, text: "x", result: true }],
        },
        ["Four jumps of −3 from 0 reach −12, so x = −12 and x ÷ 4 = −3.", "从 0 开始跳 4 次、每次 −3，到 −12，所以 x = −12，x ÷ 4 = −3。"],
      ),
    ),
  ],
  "modeling-real-world-problems-using-one-step-equations": [
    lesson(
      "choosing-the-equation-for-a-reverse-story",
      ["The equation for a story told backwards", "倒着讲的故事的方程"],
      [
        [
          "Write the equation in the order the story happens, starting from the unknown. “Leo gave away $5$ cards and now has $12$” starts with $c$ cards, takes $5$ away and leaves $12$: $c - 5 = 12$. The equation keeps the subtraction, even though solving it will need adding.",
          "按故事发生的顺序列方程，从未知的开始量写起。“Leo 送出 $5$ 张卡片，现在有 $12$ 张”：开始有 $c$ 张，减去 $5$ 张，剩下 $12$ 张，$c - 5 = 12$。方程里保留减法，尽管解方程时要用加法。",
        ],
        ["Solving gives $c = 17$, and $17 - 5 = 12$.", "解得 $c = 17$，而 $17 - 5 = 12$。"],
        [
          "Do not write the operation you will use to solve. $c + 5 = 12$ says Leo was given cards, not that he gave them away.",
          "不要写成解方程时用的运算。$c + 5 = 12$ 表示 Leo 得到了卡片，而不是送出卡片。",
        ],
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const give = rng.int(3, 30);
        const left = rng.int(5, 60);
        const v = rng.pick(["c", "s", "n", "k"]);
        return chosenMath(
          rng,
          [
            `${who} gave away $${give}$ cards and now has $${left}$. If $${v}$ is the number of cards at the start, which equation fits?`,
            `${who} 送出 $${give}$ 张卡片，现在有 $${left}$ 张。设开始时有 $${v}$ 张，哪个方程符合？`,
          ],
          `${v} - ${give} = ${left}`,
          [
            [
              `${v} + ${give} = ${left}`,
              "That adds the cards given away. Giving cards away takes them from the start.",
              "这是加上送出的卡片。送出是从开始的卡片中减去。",
            ],
            [
              `${give} - ${v} = ${left}`,
              `That takes $${v}$ from $${give}$. The $${give}$ cards are taken from the $${v}$ at the start.`,
              `这是从 $${give}$ 中减去 $${v}$。应该从开始的 $${v}$ 张中减去 $${give}$ 张。`,
            ],
            [`${give}${v} = ${left}`, "That multiplies. Giving cards away takes them away.", "这是乘法。送出卡片是减少。"],
          ],
          [
            [
              ["Follow the story", "按故事顺序"],
              [
                `Start with $${v}$ cards, take away the $${give}$ given away, and $${left}$ are left.`,
                `开始有 $${v}$ 张，减去送出的 $${give}$ 张，剩下 $${left}$ 张。`,
              ],
            ],
            [["Write it in symbols", "写成式子"], ["So:", "所以："], [`${v} - ${give} = ${left}`]],
          ],
          [
            `Solving gives $${v} = ${left} + ${give} = ${left + give}$, and $${left + give} - ${give} = ${left}$ cards, as in the story.`,
            `解得 $${v} = ${left} + ${give} = ${left + give}$，而 $${left + give} - ${give} = ${left}$ 张，和故事相符。`,
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "c",
            pieces: [
              { size: 12, text: "12" },
              { size: 5, text: "5", dashed: true },
            ],
          },
        ],
        ["A bar c: 5 cards given away leave 12, so c − 5 = 12.", "长条 c：送出 5 张后剩 12 张，所以 c − 5 = 12。"],
      ),
    ),
  ],
  "solving-real-world-problems-using-one-step-equations": [
    lesson(
      "solving-and-using-the-answer",
      ["Solving and using the answer", "解出后再使用"],
      [
        [
          "Sometimes solving the equation is only one step. Solve for the unknown, then read the question again and use the answer. $4$ tickets cost $\\$20$: $4p = 20$ gives $p = 5$, so $7$ tickets cost $7 \\times 5 = 35$ dollars.",
          "有时解方程只是其中一步。解出未知数后，再读一遍问题，用这个结果继续算。$4$ 张票共 $\\$20$：$4p = 20$，得 $p = 5$，所以 $7$ 张票要 $7 \\times 5 = 35$ 美元。",
        ],
        ["$4$ tickets cost $20$ and $3$ more cost $15$: $20 + 15 = 35$.", "$4$ 张票 $20$ 美元，再买 $3$ 张 $15$ 美元：$20 + 15 = 35$。"],
        [
          "The value of $p$ is not the final answer here. Read the question again before you stop.",
          "这里 $p$ 的值还不是最后的答案。停笔前再读一遍问题。",
        ],
      ],
      (rng) => {
        const each = rng.int(3, 12);
        const n = rng.int(3, 12);
        const more = rng.int(2, 9);
        const total = each * n;
        const answer = each * (n + more);
        return valued(
          [
            `$${n}$ equal tickets cost $${total}$ dollars in all. How much would $${n + more}$ of the same tickets cost, in dollars?`,
            `$${n}$ 张相同的票共 $${total}$ 美元。$${n + more}$ 张同样的票要多少美元？`,
          ],
          answer,
          [
            [
              ["Find one ticket", "求一张票的价钱"],
              [`$${n}p = ${total}$, so divide by $${n}$:`, `$${n}p = ${total}$，两边除以 $${n}$：`],
              [`p = ${total} \\div ${n} = ${each}`],
            ],
            [
              ["Use the answer", "用这个结果"],
              [`$${n + more}$ tickets cost:`, `$${n + more}$ 张票要：`],
              [`${n + more} \\times ${each} = ${answer}`],
            ],
          ],
          [
            `$${n}$ tickets cost $${total}$, and $${more}$ more cost $${more} \\times ${each} = ${more * each}$: $${total} + ${more * each} = ${answer}$.`,
            `$${n}$ 张票 $${total}$ 美元，再买 $${more}$ 张要 $${more} \\times ${each} = ${more * each}$ 美元：$${total} + ${more * each} = ${answer}$。`,
          ],
          [
            [
              total + more,
              `That adds $${more}$ dollars, but $${more}$ is a number of tickets.`,
              `这是加上 $${more}$ 美元，但 $${more}$ 是张数。`,
            ],
            [each, "That is the price of one ticket, only the first step.", "这是一张票的价钱，只是第一步。"],
            [
              total * more,
              `That multiplies the total by $${more}$. Use the price of one ticket instead.`,
              `这是用总价乘 $${more}$。应该用一张票的价钱来算。`,
            ],
          ],
        );
      },
      equalTape(4, "5", "20"),
    ),
  ],
  "representing-inequalities-on-number-lines": [
    lesson(
      "whole-numbers-on-the-graph",
      ["Whole numbers on the graph", "图像上的整数"],
      [
        [
          "A filled dot includes its end and an open circle leaves it out. To count the integers in $2 < x \\le 6$, count those strictly between the ends, $3, 4, 5$, then add each end that is included: $6$ is and $2$ is not, so there are $4$.",
          "实心点包括端点，空心圈不包括。数 $2 < x \\le 6$ 中的整数，先数严格在两端之间的 $3, 4, 5$，再加上包括在内的端点：包括 $6$，不包括 $2$，所以共 $4$ 个。",
        ],
        ["List them: $3, 4, 5, 6$, four integers.", "列出来：$3, 4, 5, 6$，共四个整数。"],
        [
          "Subtracting the ends, $6 - 2 = 4$, matches here only by chance. In $2 \\le x \\le 6$ there are $5$ integers.",
          "两端相减得 $6 - 2 = 4$，在这里只是碰巧对了。$2 \\le x \\le 6$ 中有 $5$ 个整数。",
        ],
      ],
      (rng) => {
        const lo = rng.int(-9, 15);
        const hi = lo + rng.int(3, 14);
        const leftIn = rng.bool();
        const rightIn = rng.bool();
        const inner = hi - lo - 1;
        const count = inner + (leftIn ? 1 : 0) + (rightIn ? 1 : 0);
        const expr = `${lo} ${leftIn ? "\\le" : "<"} x ${rightIn ? "\\le" : "<"} ${hi}`;
        const list = Array.from({ length: count }, (_, i) => (leftIn ? lo : lo + 1) + i);
        const end = (v: number, inside: boolean): Pair =>
          inside ? [`$${v}$ is included`, `包括 $${v}$`] : [`$${v}$ is left out`, `不包括 $${v}$`];
        const [l, r] = [end(lo, leftIn), end(hi, rightIn)];
        return valued(
          [`How many integers satisfy $${expr}$?`, `有多少个整数满足 $${expr}$？`],
          count,
          [
            [
              ["Count between the ends", "数两端之间的整数"],
              [
                `Strictly between $${lo}$ and $${hi}$ there are $${hi} - (${lo}) - 1 = ${inner}$ integers.`,
                `严格在 $${lo}$ 和 $${hi}$ 之间有 $${hi} - (${lo}) - 1 = ${inner}$ 个整数。`,
              ],
            ],
            [
              ["Look at each end", "看两端"],
              [`${l[0]} and ${r[0]}, so there are $${count}$ integers.`, `${l[1]}，${r[1]}，所以共有 $${count}$ 个整数。`],
            ],
          ],
          [`They are $${list.join(", ")}$: $${count}$ integers.`, `它们是 $${list.join(", ")}$，共 $${count}$ 个。`],
          [
            [
              hi - lo,
              "That subtracts the ends. Count the integers instead, and look at each end.",
              "这是两端相减。应该数整数，并看两端是否包括在内。",
            ],
            [inner + 2, "That counts both ends, but an open circle leaves its end out.", "这把两个端点都算上了，但空心圈不包括端点。"],
            [inner, "That leaves out both ends, but a filled dot includes its end.", "这把两个端点都去掉了，但实心点包括端点。"],
          ],
        );
      },
      drawn(gradeDrawings4["representing-inequalities-on-number-lines#whole-numbers-on-the-graph"]),
    ),
  ],
  "introduction-to-two-variable-equations": [
    lesson(
      "an-equation-from-a-table",
      ["An equation from a table", "由表格得到方程"],
      [
        [
          "When $y$ goes up by the same amount for each step of $1$ in $x$, that amount multiplies $x$. Then find the number to add so that the first pair fits. For $(1, 5)$, $(2, 8)$, $(3, 11)$, $y$ goes up by $3$, and $3 \\times 1 + 2 = 5$, so $y = 3x + 2$.",
          "$x$ 每增加 $1$，$y$ 都增加同样的量时，这个量就是 $x$ 的乘数。再找出要加上的数，使第一对数符合。对于 $(1, 5)$、$(2, 8)$、$(3, 11)$，$y$ 每次增加 $3$，而 $3 \\times 1 + 2 = 5$，所以 $y = 3x + 2$。",
        ],
        ["$3 \\times 3 + 2 = 11$, the last pair.", "$3 \\times 3 + 2 = 11$，正是最后一对。"],
        [
          "Check every pair, not just the first. $y = x + 4$ fits $(1, 5)$ but gives $6$ at $x = 2$, not $8$.",
          "每一对都要检验，不能只看第一对。$y = x + 4$ 符合 $(1, 5)$，但 $x = 2$ 时得 $6$，不是 $8$。",
        ],
      ],
      (rng) => {
        const m = rng.int(2, 9);
        let b = rng.int(1, 12);
        if (b === m) b += 1;
        const x0 = rng.int(1, 4);
        const xs = [x0, x0 + 1, x0 + 2];
        const pts = xs.map((x) => `(${x}, ${m * x + b})`).join(",\\ ");
        const misses = (k: number, c: number): readonly [string, string] => {
          const x = xs.find((u) => k * u + c !== m * u + b) ?? x0;
          return [`At $x = ${x}$ it gives $${k * x + c}$, not $${m * x + b}$.`, `$x = ${x}$ 时得 $${k * x + c}$，不是 $${m * x + b}$。`];
        };
        const wrong = (k: number, c: number, en: string, zh: string): MathWrong => {
          const [e, z] = misses(k, c);
          return [`y = ${k === 1 ? "" : k}x + ${c}`, `${en} ${e}`, `${zh}${z}`];
        };
        return chosenMath(
          rng,
          [`The pairs $(x, y)$ are $${pts}$. Which equation fits them all?`, `数对 $(x, y)$ 是 $${pts}$。哪个方程符合所有数对？`],
          `y = ${m}x + ${b}`,
          [
            wrong(b, m, "That swaps the number that multiplies and the number added.", "这把乘数和加上的数对调了。"),
            wrong(1, m + b, "That adds instead of multiplying.", "这是用了加法，应该乘。"),
            wrong(m, b + 1, "The number added is one too many.", "加上的数多了 $1$。"),
          ],
          [
            [
              ["Find the rise", "找每次增加的量"],
              [
                `Each step of $1$ in $x$ adds $${m}$ to $y$, so $${m}$ multiplies $x$.`,
                `$x$ 每增加 $1$，$y$ 增加 $${m}$，所以 $x$ 要乘 $${m}$。`,
              ],
            ],
            [
              ["Find the number added", "找加上的数"],
              [
                `At $x = ${x0}$: $${m} \\times ${x0} = ${m * x0}$, and $${m * x0 + b} - ${m * x0} = ${b}$. So:`,
                `$x = ${x0}$ 时：$${m} \\times ${x0} = ${m * x0}$，$${m * x0 + b} - ${m * x0} = ${b}$。所以：`,
              ],
              [`y = ${m}x + ${b}`],
            ],
          ],
          [
            `At $x = ${x0 + 2}$: $${m} \\times ${x0 + 2} + ${b} = ${m * (x0 + 2) + b}$, the last pair.`,
            `$x = ${x0 + 2}$ 时：$${m} \\times ${x0 + 2} + ${b} = ${m * (x0 + 2) + b}$，正是最后一对。`,
          ],
        );
      },
      tableFigure(["x = 1", "x = 2", "x = 3"], [5, 8, 11]),
    ),
  ],
  "two-variable-equations-solving-for-the-independent-variable": [
    lesson(
      "the-input-with-a-fee-and-a-rate",
      ["The input, with a fee and a rate", "有固定费用时求输入"],
      [
        [
          "With a fee and a rate, undo the rule in reverse order. The rule multiplies by the rate and then adds the fee, so first take the fee away, then divide by the rate. For $c = 4h + 10$ and $c = 30$: $30 - 10 = 20$, and $20 \\div 4 = 5$ hours.",
          "既有固定费用又有单价时，要按相反的顺序还原。规则是先乘单价、再加固定费用，所以先减去固定费用，再除以单价。$c = 4h + 10$，$c = 30$：$30 - 10 = 20$，$20 \\div 4 = 5$ 小时。",
        ],
        ["$4 \\times 5 + 10 = 30$.", "$4 \\times 5 + 10 = 30$。"],
        [
          "Take the fee away before dividing. $30 \\div 4 = 7.5$ hours would treat the fee as if it were paid by the hour.",
          "先减去固定费用再除。$30 \\div 4 = 7.5$ 小时，就把固定费用也当成按小时付的了。",
        ],
      ],
      (rng) => {
        const rate = rng.int(2, 12);
        const fee = rng.int(1, 30);
        const x = rng.int(2, 25);
        const y = rate * x + fee;
        return valued(
          [
            `A cost $c$ in dollars is $c = ${rate}h + ${fee}$, where $h$ is the number of hours. For how many hours is the cost $${y}$ dollars?`,
            `费用 $c$（美元）满足 $c = ${rate}h + ${fee}$，其中 $h$ 是小时数。费用为 $${y}$ 美元时是多少小时？`,
          ],
          x,
          [
            [
              ["Take away the fee", "减去固定费用"],
              [`$${y} = ${rate}h + ${fee}$. Subtract $${fee}$ from both sides:`, `$${y} = ${rate}h + ${fee}$。两边同时减去 $${fee}$：`],
              [`${y - fee} = ${rate}h`],
            ],
            [
              ["Divide by the rate", "除以单价"],
              [`Divide both sides by $${rate}$:`, `两边同时除以 $${rate}$：`],
              [`h = ${y - fee} \\div ${rate} = ${x}`],
            ],
          ],
          [
            `$${rate} \\times ${x} + ${fee} = ${rate * x} + ${fee} = ${y}$ dollars.`,
            `$${rate} \\times ${x} + ${fee} = ${rate * x} + ${fee} = ${y}$ 美元。`,
          ],
          [
            [
              Math.floor(y / rate),
              "That divides the whole cost by the rate. The fee is not paid by the hour, so take it away first.",
              "这是用全部费用除以单价。固定费用不是按小时付的，要先减去。",
            ],
            [y - fee, `That takes the fee away but does not divide by the rate $${rate}$.`, `这减去了固定费用，但没有除以单价 $${rate}$。`],
            [
              y - rate,
              `That takes away the rate $${rate}$ instead of the fee $${fee}$.`,
              `这减去的是单价 $${rate}$，不是固定费用 $${fee}$。`,
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "30",
            pieces: [
              { size: 10, text: "10", lit: true },
              { size: 4, text: "4" },
              { size: 4, text: "4" },
              { size: 4, text: "4" },
              { size: 4, text: "4" },
              { size: 4, text: "4" },
            ],
          },
        ],
        [
          "A bar of 30: a fee of 10, then five pieces of 4 for the hours, so h = 5.",
          "总长 30 的长条：固定费用 10，再加 5 段每段 4 的小时费用，所以 h = 5。",
        ],
      ),
    ),
  ],
};
