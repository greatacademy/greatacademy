// A third knowledge point for the school topics on equations, inequalities, angles, rates, solids, data and real numbers,
// shared by Prealgebra and 7th and 8th Grade Math.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { choose, chooseMath, type Pair, tableFigure, type Wrong, whole } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, drawn, lesson, valued } from "./grade-6-kit.ts";
import { frac, fraction, integer, signed, skill } from "./third-kit.ts";
import { tapeFigure } from "./upper-grades-kit.ts";

/** money writes a count of cents as dollars. */
const money = (cents: number) => (cents / 100).toFixed(2);

/** deeperMiddleSchoolThird2Points holds these third knowledge points, by topic. */
export const deeperMiddleSchoolThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "solving-linear-equations-with-fractional-coefficients": [
    lesson(
      "a-fraction-of-a-number-in-a-story",
      ["A fraction of a number in a story", "故事中一个数的几分之几"],
      [
        [
          "A story about part of an unknown number gives an equation with a fractional coefficient. Undo the addition first, then multiply by the reciprocal of the fraction. If $\\frac{2}{3}$ of a number increased by $5$ is $17$, then $\\frac{2}{3}x = 12$ and $x = 12 \\times \\frac{3}{2} = 18$.",
          "关于未知数一部分的故事，会得到分数系数的方程。先还原加法，再乘分数的倒数。如果一个数的 $\\frac{2}{3}$ 加上 $5$ 得 $17$，那么 $\\frac{2}{3}x = 12$，$x = 12 \\times \\frac{3}{2} = 18$。",
        ],
        [
          "Go through the story with $18$: $\\frac{2}{3}$ of $18$ is $12$, and $12 + 5 = 17$.",
          "用 $18$ 把故事走一遍：$18$ 的 $\\frac{2}{3}$ 是 $12$，$12 + 5 = 17$。",
        ],
        [
          "$12$ is only $\\frac{2}{3}$ of the number; multiply by $\\frac{3}{2}$ to find the whole number.",
          "$12$ 只是这个数的 $\\frac{2}{3}$；还要乘 $\\frac{3}{2}$ 才得到整个数。",
        ],
      ],
      (rng) => {
        const [n, d] = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 6],
          [2, 7],
          [3, 7],
          [4, 7],
          [5, 7],
          [3, 8],
          [5, 8],
          [7, 8],
          [2, 9],
          [4, 9],
          [5, 9],
          [7, 9],
        ]);
        const k = rng.int(2, 15);
        const add = rng.int(2, 30);
        return valued(
          [
            `When $${frac(n, d)}$ of a number is increased by $${add}$, the result is $${n * k + add}$. What is the number?`,
            `一个数的 $${frac(n, d)}$ 加上 $${add}$，结果是 $${n * k + add}$。这个数是多少？`,
          ],
          d * k,
          [
            [
              ["Undo the addition", "还原加法"],
              [`Take away $${add}$ from both sides:`, `两边同时减去 $${add}$：`],
              [`${frac(n, d)}x = ${n * k + add} - ${add} = ${n * k}`],
            ],
            [
              ["Multiply by the reciprocal", "乘以倒数"],
              [`Multiply by $${frac(d, n)}$:`, `乘以 $${frac(d, n)}$：`],
              [`x = ${n * k} \\times ${frac(d, n)} = ${d * k}`],
            ],
          ],
          [
            `Go through the story with $${d * k}$: $${frac(n, d)}$ of $${d * k}$ is $${n * k}$, and $${n * k} + ${add} = ${n * k + add}$.`,
            `用 $${d * k}$ 把故事走一遍：$${d * k}$ 的 $${frac(n, d)}$ 是 $${n * k}$，$${n * k} + ${add} = ${n * k + add}$。`,
          ],
          [
            [
              n * k,
              `That is $${frac(n, d)}$ of the number; multiply by $${frac(d, n)}$ to find the whole number.`,
              `这只是这个数的 $${frac(n, d)}$；还要乘 $${frac(d, n)}$ 才得到整个数。`,
            ],
            [n * k + add, "That is the result in the story, not the number.", "这是故事中的结果，不是这个数。"],
            [
              d * k + add,
              `That adds $${add}$ to the number; it was added after taking the fraction.`,
              `这是把 $${add}$ 加到了这个数上；它是在取分数之后才加的。`,
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 1, text: "6", lit: true },
              { size: 1, text: "6", lit: true },
              { size: 1, text: "6", dashed: true },
            ],
            total: "x = 18",
          },
        ],
        ["A tape for x cut into three equal parts of 6; two of them make 12.", "表示 x 的纸条平均分成三份，每份 6；其中两份合起来是 12。"],
      ),
    ),
  ],
  "solving-linear-equations-with-decimal-coefficients": [
    lesson(
      "a-fee-and-a-decimal-rate",
      ["A fee and a decimal rate", "固定费用和小数单价"],
      [
        [
          "Prices often give equations with decimal coefficients. Take away the fee first; what is left is paid per unit, so divide it by the rate. A ride that costs $2.00$ dollars plus $1.50$ dollars per mile and comes to $8.00$ dollars gives $2 + 1.5n = 8$, so $1.5n = 6$ and $n = 4$.",
          "价格常常得到小数系数的方程。先减去固定费用，剩下的部分按单位计算，再除以单价。起步价 $2.00$ 美元、每英里 $1.50$ 美元、一共 $8.00$ 美元的行程，得到 $2 + 1.5n = 8$，所以 $1.5n = 6$，$n = 4$。",
        ],
        [
          "Price the ride: $2.00 + 4 \\times 1.50 = 2.00 + 6.00 = 8.00$ dollars.",
          "算一算车费：$2.00 + 4 \\times 1.50 = 2.00 + 6.00 = 8.00$ 美元。",
        ],
        [
          "Take away the fee before dividing: $8.00 \\div 1.50$ counts the fee as miles too.",
          "要先减去起步价再除：$8.00 \\div 1.50$ 把起步价也算成了里程。",
        ],
      ],
      (rng) => {
        const rate = rng.int(5, 95) * 5;
        const fee = rng.int(1, 12) * 100;
        const n = rng.int(3, 40);
        const total = fee + rate * n;
        return valued(
          [
            `A taxi charges $${money(fee)}$ dollars plus $${money(rate)}$ dollars per mile. A ride costs $${money(total)}$ dollars. How many miles was it?`,
            `出租车起步价 $${money(fee)}$ 美元，每英里 $${money(rate)}$ 美元。一次乘车花了 $${money(total)}$ 美元。行驶了多少英里？`,
          ],
          n,
          [
            [
              ["Take away the fee", "减去起步价"],
              ["The part paid by the mile is:", "按里程付的部分是："],
              [`${money(total)} - ${money(fee)} = ${money(total - fee)}`],
            ],
            [
              ["Divide by the rate", "除以单价"],
              [`Each mile costs $${money(rate)}$ dollars:`, `每英里 $${money(rate)}$ 美元：`],
              [`${money(total - fee)} \\div ${money(rate)} = ${n}`],
            ],
          ],
          [
            `Price the ride: $${money(fee)} + ${n} \\times ${money(rate)} = ${money(fee)} + ${money(rate * n)} = ${money(total)}$ dollars.`,
            `算一算车费：$${money(fee)} + ${n} \\times ${money(rate)} = ${money(fee)} + ${money(rate * n)} = ${money(total)}$ 美元。`,
          ],
          [
            [
              Math.round(total / rate),
              "That divides the whole cost, fee included; take away the fee first.",
              "这是用全部车费去除，包括了起步价；应该先减去起步价。",
            ],
            [n + fee / 100, "That counts each dollar of the fee as a mile.", "这是把起步价的每一美元都算成了一英里。"],
            [
              n - 1,
              `That is one mile short: $${n - 1}$ miles cost $${money(fee + rate * (n - 1))}$ dollars.`,
              `少算了一英里：$${n - 1}$ 英里的车费是 $${money(fee + rate * (n - 1))}$ 美元。`,
            ],
          ],
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 2, text: "2.00", lit: true },
              { size: 6, text: "1.50n" },
            ],
            total: "8.00",
          },
        ],
        ["A tape of 8.00 made of a fee of 2.00 and 1.50 for each mile.", "一条表示 8.00 的纸条，由起步价 2.00 和每英里 1.50 的部分组成。"],
      ),
    ),
  ],

  "solving-linear-equations-by-clearing-a-rational-expression": [
    lesson(
      "a-fraction-on-each-side",
      ["A fraction on each side", "两边各有一个分数"],
      [
        [
          "With a fraction on each side, multiply both sides by both denominators to clear them. Every term of each numerator gets multiplied, so put the numerators in parentheses first. For $\\frac{x + 1}{2} = \\frac{x + 3}{3}$, multiply by $6$: $3(x + 1) = 2(x + 3)$, so $3x + 3 = 2x + 6$ and $x = 3$.",
          "两边各有一个分数时，两边同乘两个分母来去分母。分子的每一项都要乘，所以先给分子加上括号。对于 $\\frac{x + 1}{2} = \\frac{x + 3}{3}$，乘以 $6$：$3(x + 1) = 2(x + 3)$，所以 $3x + 3 = 2x + 6$，$x = 3$。",
        ],
        ["Put $x = 3$ back: $\\frac{4}{2} = 2$ and $\\frac{6}{3} = 2$.", "把 $x = 3$ 代回去：$\\frac{4}{2} = 2$，$\\frac{6}{3} = 2$。"],
        ["Multiply the whole numerator: $3(x + 1)$ is $3x + 3$, not $3x + 1$.", "要乘整个分子：$3(x + 1)$ 是 $3x + 3$，不是 $3x + 1$。"],
      ],
      (rng) => {
        const b = rng.int(2, 6);
        let d = rng.int(2, 7);
        if (d === b) d += 1;
        const x = rng.int(-12, 12);
        const value = rng.int(1, 6);
        const a = b * value - x;
        const c = d * value - x;
        const top = (n: number) => (n === 0 ? "x" : `x${signed(n)}`);
        const term = (k: number, n: number) => `${k === 1 ? "" : k === -1 ? "-" : k}x${n === 0 ? "" : signed(n)}`;
        const eq = `${frac(top(a), b)} = ${frac(top(c), d)}`;
        const side = (n: number, den: number) => Q.of(x + 1 + n, den).toLatex();
        return valued(
          [`Solve $${eq}$.`, `解方程 $${eq}$。`],
          x,
          [
            [
              ["Clear both denominators", "去掉两个分母"],
              [`Multiply both sides by $${b * d}$, then expand:`, `两边同乘 $${b * d}$，再展开：`],
              [`${d}(${top(a)}) = ${b}(${top(c)})`, `${term(d, d * a)} = ${term(b, b * c)}`],
            ],
            [
              ["Collect and solve", "移项并求解"],
              ["Collect the $x$-terms on the left and the numbers on the right:", "把含 $x$ 的项移到左边，数移到右边："],
              d - b === 1 ? [`x = ${x}`] : [`${term(d - b, 0)} = ${b * c - d * a}`, `x = ${x}`],
            ],
          ],
          [
            `Put $x = ${x}$ back: $${frac(x + a, b)} = ${value}$ and $${frac(x + c, d)} = ${value}$.`,
            `把 $x = ${x}$ 代回去：$${frac(x + a, b)} = ${value}$，$${frac(x + c, d)} = ${value}$。`,
          ],
          [
            [-x, "The sign is wrong: check which side each term moved to.", "符号错了：看看每一项移到了哪一边。"],
            [
              x + 1,
              `Put it back: the two sides become $${side(a, b)}$ and $${side(c, d)}$, which are not equal.`,
              `代回去：两边分别是 $${side(a, b)}$ 和 $${side(c, d)}$，并不相等。`,
            ],
            [a - c, "That subtracts the numbers in the numerators and drops the denominators.", "这是把分子中的数相减，却丢掉了分母。"],
          ],
        );
      },
      tableFigure(["(x + 1)/2", "(x + 3)/3", "x"], [2, 2, 3]),
    ),
  ],

  "solving-two-variable-equations": [
    lesson(
      "solving-for-x-instead",
      ["Solving for x instead", "改为求 x"],
      [
        [
          "Any letter in an equation can be isolated with the same steps. To solve for $x$, treat $y$ like a number: move it to the other side, then divide the whole other side by the coefficient of $x$. $3x + y = 12$ gives $3x = 12 - y$, so $x = \\frac{12 - y}{3}$.",
          "方程中任何字母都可以用同样的步骤单独放一边。解 $x$ 时把 $y$ 当作数：先移到另一边，再用 $x$ 的系数去除整个另一边。由 $3x + y = 12$ 得 $3x = 12 - y$，所以 $x = \\frac{12 - y}{3}$。",
        ],
        [
          "Put in $y = 6$: $x = \\frac{12 - 6}{3} = 2$, and $3(2) + 6 = 12$.",
          "代入 $y = 6$：$x = \\frac{12 - 6}{3} = 2$，而 $3(2) + 6 = 12$。",
        ],
        [
          "Divide the whole right side: $\\frac{12 - y}{3}$ is not $\\frac{12}{3} - y$.",
          "要除整个右边：$\\frac{12 - y}{3}$ 不是 $\\frac{12}{3} - y$。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const c = rng.int(2, 30);
        const answer = `x = ${frac(`${c} - y`, a)}`;
        const y = c - a;
        const py = y < 0 ? `(${y})` : `${y}`;
        return chosenMath(
          rng,
          [`Solve $${a}x + y = ${c}$ for $x$.`, `解 $${a}x + y = ${c}$，用 $y$ 表示 $x$。`],
          answer,
          [
            [`x = ${frac(`${c} + y`, a)}`, "That moves $y$ without changing its sign.", "这是移动 $y$ 时没有变号。"],
            [
              `x = ${frac(c, a)} - y`,
              `That divides only $${c}$ by $${a}$; divide the whole right side.`,
              `这是只把 $${c}$ 除以了 $${a}$；要除整个右边。`,
            ],
            [
              `x = ${c} - ${a}y`,
              `That moves the $${a}$ onto $y$; divide the right side by $${a}$ instead.`,
              `这是把 $${a}$ 移到了 $y$ 上；应该用 $${a}$ 去除右边。`,
            ],
          ],
          [
            [["Move y", "移走 y"], ["Subtract $y$ from both sides:", "两边同时减去 $y$："], [`${a}x = ${c} - y`]],
            [["Divide", "相除"], [`Divide the whole right side by $${a}$:`, `用 $${a}$ 去除整个右边：`], [answer]],
          ],
          [
            `Put in $y = ${y}$: $x = ${frac(`${c} - ${py}`, a)} = 1$, and $${a}(1) + ${py} = ${c}$.`,
            `代入 $y = ${y}$：$x = ${frac(`${c} - ${py}`, a)} = 1$，而 $${a}(1) + ${py} = ${c}$。`,
          ],
        );
      },
      tableFigure(["x", "y", "3x + y"], [2, 6, 12]),
    ),
  ],

  "linear-equations-with-infinitely-many-solutions": [
    skill(
      "choosing-a-value-for-no-solution",
      ["Choosing a value for no solution", "选值使方程无解"],
      [
        "When both sides have the same coefficient of $x$, the variable terms cancel. With different constants the equation then says something false, so it has no solution at all.",
        "两边 $x$ 的系数相同时，含变量的项相互抵消。常数不同时方程成了假命题，所以无解。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(1, 9);
        const c = a * b + rng.int(1, 9);
        return whole(
          [
            `For what value of $k$ does $${a}(x + ${b}) = kx + ${c}$ have no solution?`,
            `$k$ 为何值时，$${a}(x + ${b}) = kx + ${c}$ 无解？`,
          ],
          a,
          [a * b, c, a + b],
          [
            `The left side is $${a}x + ${a * b}$. With $k = ${a}$ the $x$ terms cancel, leaving $${a * b} = ${c}$, which is false.`,
            `左边是 $${a}x + ${a * b}$。$k = ${a}$ 时 $x$ 项抵消，剩下 $${a * b} = ${c}$，不成立。`,
          ],
        );
      },
    ),
  ],
  "verifying-solutions-of-linear-inequalities": [
    lesson(
      "how-many-values-work",
      ["How many values work", "有几个值符合"],
      [
        [
          "An inequality has many solutions, and each candidate can be tested by substituting it. First find the boundary, where the two sides are equal, and decide whether it counts: it does for $\\ge$ and $\\le$, but not for $>$ and $<$. For $2x + 1 \\ge 5$ the boundary is $x = 2$, and it counts.",
          "不等式有很多解，每个候选值都可以代入检验。先找出边界，也就是两边相等的地方，再判断它算不算：$\\ge$ 和 $\\le$ 算，$>$ 和 $<$ 不算。对于 $2x + 1 \\ge 5$，边界是 $x = 2$，它算解。",
        ],
        [
          "Test $1, 2, 3$ in $2x + 1 \\ge 5$: they give $3, 5, 7$, and only $5$ and $7$ are at least $5$, so two values work.",
          "把 $1, 2, 3$ 代入 $2x + 1 \\ge 5$：得 $3, 5, 7$，只有 $5$ 和 $7$ 不小于 $5$，所以有两个值符合。",
        ],
        [
          "Look at the symbol at the boundary: with $>$, the value that makes both sides equal does not work.",
          "要看边界处的符号：对于 $>$，使两边相等的值不符合。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const b = rng.int(1, 15);
        const bound = rng.int(-3, 8);
        const strict = rng.bool();
        const c = a * bound + b;
        const start = bound - rng.int(1, 3);
        const values = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
        const works = values.filter((v) => (strict ? a * v + b > c : a * v + b >= c));
        const count = works.length;
        const sym = strict ? ">" : "\\ge";
        return valued(
          [
            `How many of the values ${values.join(", ")} are solutions of $${a}x + ${b} ${sym} ${c}$?`,
            `${values.join("、")} 中有几个是 $${a}x + ${b} ${sym} ${c}$ 的解？`,
          ],
          count,
          [
            [
              ["Find the boundary", "找出边界"],
              [
                `The two sides are equal when $${a}x = ${c - b}$, and the boundary ${strict ? "does not count" : "counts"}:`,
                `当 $${a}x = ${c - b}$ 时两边相等，这个边界${strict ? "不算" : "算"}解：`,
              ],
              [`x = ${bound}`],
            ],
            [
              ["Count the values", "数出符合的值"],
              [
                `The values ${strict ? "greater than" : "at least"} $${bound}$ work:`,
                `${strict ? "大于" : "不小于"} $${bound}$ 的值符合：`,
              ],
              [`${works.join(",\\ ")}`],
            ],
          ],
          [
            `Test them all: the left side takes the values $${values.map((v) => a * v + b).join(",\\ ")}$, and $${count}$ of them are ${strict ? "greater than" : "at least"} $${c}$.`,
            `逐个检验：左边的值依次是 $${values.map((v) => a * v + b).join(",\\ ")}$，其中有 $${count}$ 个${strict ? "大于" : "不小于"} $${c}$。`,
          ],
          [
            [6 - count, "That counts the values that do not work.", "这是数了不符合的值。"],
            [
              count + (strict ? 1 : -1),
              `That counts the boundary the wrong way: $x = ${bound}$ ${strict ? "does not count with $>$" : "counts with $\\ge$"}.`,
              `这是把边界算错了：$x = ${bound}$ ${strict ? "对于 $>$ 不算" : "对于 $\\ge$ 算"}。`,
            ],
            [
              6,
              `Not every value works: $x = ${start}$ gives $${a * start + b}$, which is less than $${c}$.`,
              `并不是每个值都符合：$x = ${start}$ 得 $${a * start + b}$，小于 $${c}$。`,
            ],
          ],
        );
      },
      tableFigure(["x = 1", "x = 2", "x = 3"], [3, 5, 7]),
    ),
  ],

  "representing-solutions-to-inequalities-on-number-lines": [
    lesson(
      "the-first-whole-number-on-the-graph",
      ["The first integer on the graph", "图像上的第一个整数"],
      [
        [
          "An open circle leaves out its endpoint, so the first integer on the graph is one step past it, in the direction of the shading. $2x + 1 > 7$ gives $x > 3$: the circle at $3$ is open, so the smallest integer solution is $4$.",
          "空心圈不含端点，所以图像上的第一个整数要沿涂色方向再走一步。$2x + 1 > 7$ 得 $x > 3$：$3$ 处是空心圈，所以最小的整数解是 $4$。",
        ],
        [
          "$2(4) + 1 = 9 > 7$ works, but $2(3) + 1 = 7$ is not greater than $7$.",
          "$2(4) + 1 = 9 > 7$ 成立，但 $2(3) + 1 = 7$ 不大于 $7$。",
        ],
        [
          "Dividing by a negative number reverses the arrow, so then you step down to find the greatest integer instead.",
          "除以负数会使箭头反向，这时要向小的方向走，找最大的整数。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const bound = rng.int(-9, 12);
        const b = rng.int(1, 20);
        const neg = rng.bool();
        const c = neg ? -a * bound + b : a * bound + b;
        const answer = neg ? bound - 1 : bound + 1;
        const lead = neg ? `-${a}x` : `${a}x`;
        const value = (x: number) => (neg ? -a : a) * x + b;
        const at = (x: number) => `${neg ? `-${a}` : a}(${x}) + ${b} = ${value(x)}`;
        return valued(
          neg
            ? [`What is the greatest integer that solves $-${a}x + ${b} > ${c}$?`, `满足 $-${a}x + ${b} > ${c}$ 的最大整数是多少？`]
            : [`What is the smallest integer that solves $${a}x + ${b} > ${c}$?`, `满足 $${a}x + ${b} > ${c}$ 的最小整数是多少？`],
          answer,
          [
            [
              ["Solve", "求解"],
              neg
                ? [`Subtract $${b}$, then divide by $-${a}$, reversing the symbol:`, `减去 $${b}$，再除以 $-${a}$，并改变不等号方向：`]
                : [`Subtract $${b}$, then divide by $${a}$:`, `减去 $${b}$，再除以 $${a}$：`],
              [`${lead} > ${c - b}`, `x ${neg ? "<" : ">"} ${bound}`],
            ],
            [
              ["Step past the circle", "越过空心圈"],
              [
                `The circle at $${bound}$ is open, so go one step ${neg ? "left" : "right"}:`,
                `$${bound}$ 处是空心圈，所以向${neg ? "左" : "右"}走一步：`,
              ],
              [`${bound} ${neg ? "-" : "+"} 1 = ${answer}`],
            ],
          ],
          [
            `$${at(answer)}$, and $${value(answer)} > ${c}$ is true; but $${at(bound)}$, which is not greater than $${c}$.`,
            `$${at(answer)}$，$${value(answer)} > ${c}$ 成立；而 $${at(bound)}$，不大于 $${c}$。`,
          ],
          [
            [bound, `That is the open circle itself, and $${bound}$ is not a solution.`, `这是空心圈本身，$${bound}$ 不是解。`],
            [
              neg ? bound + 1 : bound - 1,
              neg
                ? "That steps the wrong way: dividing by a negative number reverses the arrow."
                : "That steps the wrong way, away from the shading.",
              neg ? "方向走反了：除以负数时箭头要反向。" : "方向走反了，离开了涂色的一侧。",
            ],
            [-bound, "That has the wrong sign.", "符号错了。"],
          ],
        );
      },
      drawn(gradeDrawings4["representing-solutions-to-inequalities-on-number-lines#the-first-whole-number-on-the-graph"]),
    ),
  ],
  "further-solving-linear-inequalities": [
    lesson(
      "negative-terms-on-both-sides",
      ["Negative terms on both sides", "两边都有负项"],
      [
        [
          "Moving the variable terms so that the coefficient stays positive avoids dividing by a negative. For $-5x + 1 \\le -3x - 3$, add $5x$ to both sides: $1 \\le 2x - 3$, so $4 \\le 2x$ and $x \\ge 2$.",
          "移项时让系数保持为正，可以避免除以负数。对于 $-5x + 1 \\le -3x - 3$，两边加上 $5x$：$1 \\le 2x - 3$，所以 $4 \\le 2x$，$x \\ge 2$。",
        ],
        [
          "The other way: $-2x \\le -4$, and dividing by $-2$ reverses the symbol, so again $x \\ge 2$.",
          "换一种做法：$-2x \\le -4$，除以 $-2$ 时不等号改变方向，同样得 $x \\ge 2$。",
        ],
        [
          "$4 \\le 2x$ means $x \\ge 2$: read it from $x$'s side, and the symbol turns around with it.",
          "$4 \\le 2x$ 就是 $x \\ge 2$：从 $x$ 这一边读，不等号也要跟着掉头。",
        ],
      ],
      (rng) => {
        const c = rng.int(1, 6);
        const a = c + rng.int(1, 6);
        const k = a - c;
        const x = rng.int(-9, 9);
        const b = rng.int(1, 20);
        const d = k * x + b;
        const dText = d === 0 ? "" : signed(d);
        const kx = `${k === 1 ? "" : k}x`;
        const other = -x === x ? x + 1 : -x;
        return chosenMath(
          rng,
          [`Solve $-${a}x${dText} \\le -${c}x + ${b}$.`, `解 $-${a}x${dText} \\le -${c}x + ${b}$。`],
          `x \\ge ${x}`,
          [
            [
              `x \\le ${x}`,
              `The symbol points the wrong way: $${d - b} \\le ${kx}$ means $x$ is at least $${x}$.`,
              `不等号方向错了：$${d - b} \\le ${kx}$ 表示 $x$ 不小于 $${x}$。`,
            ],
            [`x \\ge ${other}`, `The boundary is wrong: $${d - b} \\div ${k} = ${x}$.`, `边界错了：$${d - b} \\div ${k} = ${x}$。`],
            [
              `x \\le ${other}`,
              `Both the boundary and the symbol are wrong: $${d - b} \\le ${kx}$ gives $x \\ge ${x}$.`,
              `边界和不等号方向都错了：$${d - b} \\le ${kx}$ 得 $x \\ge ${x}$。`,
            ],
          ],
          [
            [
              ["Keep the coefficient positive", "让系数保持为正"],
              [`Add $${a}x$ to both sides, then take away $${b}$:`, `两边加上 $${a}x$，再减去 $${b}$：`],
              [`${d} \\le ${kx} + ${b}`, `${d - b} \\le ${kx}`],
            ],
            [
              ["Divide", "相除"],
              [`Divide by $${k}$, a positive number, and read it from $x$'s side:`, `除以正数 $${k}$，再从 $x$ 这一边读：`],
              [`x \\ge ${x}`],
            ],
          ],
          [
            `The other way: $-${kx} \\le ${b - d}$, and dividing by $-${k}$ reverses the symbol, so again $x \\ge ${x}$.`,
            `换一种做法：$-${kx} \\le ${b - d}$，除以 $-${k}$ 时不等号改变方向，同样得 $x \\ge ${x}$。`,
          ],
        );
      },
      tableFigure(["-5x + 1", "-3x - 3", "x"], [-9, -9, 2]),
    ),
  ],

  "graphing-linear-equations": [
    lesson(
      "where-the-line-crosses-the-x-axis",
      ["Where the line crosses the x-axis", "直线与 x 轴的交点"],
      [
        [
          "Every point on the $x$-axis has $y = 0$. So put $y = 0$ into the equation and solve for $x$. For $3x + 2y = 12$: $3x + 0 = 12$, so $x = 4$, and the line crosses the $x$-axis at $(4, 0)$.",
          "$x$ 轴上每个点都有 $y = 0$。所以把 $y = 0$ 代入方程，解出 $x$。对于 $3x + 2y = 12$：$3x + 0 = 12$，所以 $x = 4$，直线与 $x$ 轴交于 $(4, 0)$。",
        ],
        ["Put $(4, 0)$ back: $3(4) + 2(0) = 12$.", "把 $(4, 0)$ 代回去：$3(4) + 2(0) = 12$。"],
        [
          "On the $x$-axis it is $y$ that is $0$, not $x$. Setting $x = 0$ gives $2y = 12$, the crossing on the $y$-axis instead.",
          "在 $x$ 轴上是 $y$ 等于 $0$，不是 $x$。令 $x = 0$ 得 $2y = 12$，那是与 $y$ 轴的交点。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const k = rng.int(-9, 12) || 3;
        const c = a * k;
        return valued(
          [
            `The line $${a}x + ${b}y = ${c}$ crosses the $x$-axis at $(x, 0)$. What is $x$?`,
            `直线 $${a}x + ${b}y = ${c}$ 与 $x$ 轴交于 $(x, 0)$。$x$ 是多少？`,
          ],
          k,
          [
            [
              ["Set y to 0", "令 y = 0"],
              ["On the $x$-axis, $y = 0$:", "在 $x$ 轴上，$y = 0$："],
              [`${a}x + ${b} \\cdot 0 = ${c}`, `${a}x = ${c}`],
            ],
            [["Divide", "相除"], [`Divide both sides by $${a}$:`, `两边同时除以 $${a}$：`], [`x = ${k}`]],
          ],
          [
            `Put $(${k}, 0)$ back: $${a} \\cdot ${k < 0 ? `(${k})` : k} + ${b} \\cdot 0 = ${c}$.`,
            `把 $(${k}, 0)$ 代回去：$${a} \\cdot ${k < 0 ? `(${k})` : k} + ${b} \\cdot 0 = ${c}$。`,
          ],
          [
            [c, `That is $${a}x$; it still has to be divided by $${a}$.`, `这是 $${a}x$；还要除以 $${a}$。`],
            [
              Q.of(c, b),
              `That sets $x = 0$ and finds $y$, the crossing on the $y$-axis.`,
              `这是令 $x = 0$ 求出的 $y$，是与 $y$ 轴的交点。`,
            ],
            [c - b, `That subtracts $${b}$ instead of dropping the $y$ term.`, `这是减去了 $${b}$，而 $y$ 项应该变成 $0$。`],
            [-k, "That has the wrong sign.", "符号错了。"],
          ],
          { solveFor: "x" },
        );
      },
      tableFigure(["x", "y"], [4, 0]),
    ),
  ],
  "horizontal-and-vertical-lines": [
    {
      ...skill(
        "the-rectangle-inside-four-lines",
        ["The rectangle inside four lines", "四条直线围成的长方形"],
        [
          "Two vertical and two horizontal lines enclose a rectangle. Its width is the distance between the vertical lines and its height is the distance between the horizontal ones.",
          "两条竖直线和两条水平线围成一个长方形。宽是两条竖直线的距离，高是两条水平线的距离。",
        ],
        (rng) => {
          const x1 = rng.int(-9, 3);
          const w = rng.int(2, 12);
          const y1 = rng.int(-9, 3);
          const h = rng.int(2, 12);
          return whole(
            [
              `What is the area of the rectangle enclosed by $x = ${x1}$, $x = ${x1 + w}$, $y = ${y1}$ and $y = ${y1 + h}$?`,
              `$x = ${x1}$、$x = ${x1 + w}$、$y = ${y1}$ 和 $y = ${y1 + h}$ 围成的长方形面积是多少？`,
            ],
            w * h,
            [2 * (w + h), w + h, Math.abs(x1 + w) * Math.abs(y1 + h) === w * h ? w * h + 1 : Math.abs(x1 + w) * Math.abs(y1 + h)],
            [
              `The width is $${w}$ and the height is $${h}$, and $${w} \\times ${h} = ${w * h}$.`,
              `宽是 $${w}$，高是 $${h}$，$${w} \\times ${h} = ${w * h}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["horizontal-and-vertical-lines#the-rectangle-inside-four-lines"],
    },
  ],
  "measures-of-segments": [
    lesson(
      "adding-segments-with-algebra",
      ["Adding segments with algebra", "用代数加线段"],
      [
        [
          "When a point lies between two others, the two short segments add up to the long one. Writing this as an equation gives the unknown, and substituting it back gives each length. If $AB = 2x + 1$, $BC = x + 4$ and $AC = 14$, then $3x + 5 = 14$, so $x = 3$ and $AB = 2 \\cdot 3 + 1 = 7$.",
          "一点在另外两点之间时，两条短线段之和等于长线段。写成方程求出未知数，再代回去得到各段长度。若 $AB = 2x + 1$，$BC = x + 4$，$AC = 14$，则 $3x + 5 = 14$，所以 $x = 3$，$AB = 2 \\cdot 3 + 1 = 7$。",
        ],
        ["The other part is $BC = 3 + 4 = 7$, and $7 + 7 = 14$, which is $AC$.", "另一段 $BC = 3 + 4 = 7$，$7 + 7 = 14$，正是 $AC$。"],
        [
          "$x = 3$ is not a length. Put it into the expression for $AB$ to get the length.",
          "$x = 3$ 不是长度。要把它代入 $AB$ 的式子，才得到长度。",
        ],
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const c = rng.int(1, 5);
        const x = rng.int(2, 12);
        const b = rng.int(1, 9);
        const d = rng.int(1, 9);
        const ab = a * x + b;
        const bc = c * x + d;
        const ac = ab + bc;
        const cx = c === 1 ? "x" : `${c}x`;
        return valued(
          [
            `$B$ lies between $A$ and $C$. If $AB = ${a}x + ${b}$, $BC = ${cx} + ${d}$ and $AC = ${ac}$, how long is $AB$?`,
            `$B$ 在 $A$ 和 $C$ 之间。若 $AB = ${a}x + ${b}$，$BC = ${cx} + ${d}$，$AC = ${ac}$，$AB$ 有多长？`,
          ],
          ab,
          [
            [
              ["Add the parts", "把两段相加"],
              ["The two parts make the whole, $AB + BC = AC$:", "两段合起来是整条线段，$AB + BC = AC$："],
              [`${a}x + ${b} + ${cx} + ${d} = ${ac}`, `${a + c}x + ${b + d} = ${ac}`],
            ],
            [
              ["Solve and substitute", "求解并代入"],
              [
                `Take $${b + d}$ from both sides, divide by $${a + c}$, then put $x$ into $AB$:`,
                `两边减去 $${b + d}$，再除以 $${a + c}$，然后把 $x$ 代入 $AB$：`,
              ],
              [`x = ${x}`, `AB = ${a} \\cdot ${x} + ${b} = ${ab}`],
            ],
          ],
          [
            `The other part is $BC = ${c === 1 ? "" : `${c} \\cdot `}${x} + ${d} = ${bc}$, and $${ab} + ${bc} = ${ac}$, which is $AC$.`,
            `另一段 $BC = ${c === 1 ? "" : `${c} \\cdot `}${x} + ${d} = ${bc}$，$${ab} + ${bc} = ${ac}$，正是 $AC$。`,
          ],
          [
            [x, `That is $x$, not a length: put it into $${a}x + ${b}$.`, `这是 $x$ 的值，不是长度：要把它代入 $${a}x + ${b}$。`],
            [bc, "That is $BC$, the other part of the segment.", "这是 $BC$，线段的另一部分。"],
            [ac, "That is $AC$, the whole segment, which was already given.", "这是 $AC$，整条线段，题目已经给出了。"],
            [a * x, `That leaves out the $+ ${b}$ in $AB = ${a}x + ${b}$.`, `这是漏掉了 $AB = ${a}x + ${b}$ 中的 $+ ${b}$。`],
          ],
          { form: "integer" },
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 7, text: "2x + 1", lit: true },
              { size: 7, text: "x + 4" },
            ],
            total: "14",
          },
        ],
        ["A bar of length 14 cut into two parts, 2x + 1 and x + 4.", "一条长 14 的线段分成两部分：2x + 1 和 x + 4。"],
      ),
    ),
  ],
  "congruent-segments": [
    lesson(
      "the-whole-segment-from-its-midpoint",
      ["The whole segment from its midpoint", "由中点求整条线段"],
      [
        [
          "A midpoint cuts a segment into two congruent parts, which gives an equation. Solving it is not the end, as the whole length still needs the value substituted and then doubled. If $M$ is the midpoint of $\\overline{AB}$ with $AM = 3x - 2$ and $MB = x + 8$, then $3x - 2 = x + 8$, so $2x = 10$, $x = 5$, $AM = 13$ and $AB = 26$.",
          "中点把线段分成两条相等的部分，由此得到方程。解出来还没结束，要把值代入，再乘 2 才是整条长度。若 $M$ 是 $\\overline{AB}$ 的中点，$AM = 3x - 2$，$MB = x + 8$，则 $3x - 2 = x + 8$，所以 $2x = 10$，$x = 5$，$AM = 13$，$AB = 26$。",
        ],
        ["$MB = 5 + 8 = 13$, the same as $AM$, and $13 + 13 = 26$.", "$MB = 5 + 8 = 13$，与 $AM$ 相等，$13 + 13 = 26$。"],
        [
          "$AM = 13$ is only half the segment. The question asks for $AB$, so double it.",
          "$AM = 13$ 只是线段的一半。题目问的是 $AB$，所以要乘 2。",
        ],
      ],
      (rng) => {
        const c = rng.int(1, 5);
        const a = c + rng.int(1, 4);
        const x = rng.int(2, 12);
        let d = rng.int(10, 40);
        if (d === (a - c) * x) d += 1;
        const b = d - (a - c) * x;
        const half = a * x + b;
        const cx = c === 1 ? "x" : `${c}x`;
        const k = a - c;
        return valued(
          [
            `$M$ is the midpoint of $\\overline{AB}$, with $AM = ${a}x${signed(b)}$ and $MB = ${cx} + ${d}$. How long is $\\overline{AB}$?`,
            `$M$ 是 $\\overline{AB}$ 的中点，$AM = ${a}x${signed(b)}$，$MB = ${cx} + ${d}$。$\\overline{AB}$ 有多长？`,
          ],
          2 * half,
          [
            [
              ["Set the halves equal", "令两半相等"],
              [
                `$M$ is the midpoint, so $AM = MB$. Take $${cx}$ from both sides and solve:`,
                `$M$ 是中点，所以 $AM = MB$。两边减去 $${cx}$ 再求解：`,
              ],
              [`${a}x${signed(b)} = ${cx} + ${d}`, ...(k === 1 ? [] : [`${k}x = ${d - b}`]), `x = ${x}`],
            ],
            [
              ["Find the whole", "求整条线段"],
              ["Put $x$ into $AM$, then double it:", "把 $x$ 代入 $AM$，再乘 2："],
              [`AM = ${a} \\cdot ${x}${signed(b)} = ${half}`, `AB = 2 \\cdot ${half} = ${2 * half}`],
            ],
          ],
          [
            `$MB = ${c === 1 ? "" : `${c} \\cdot `}${x} + ${d} = ${half}$, the same as $AM$, and $${half} + ${half} = ${2 * half}$.`,
            `$MB = ${c === 1 ? "" : `${c} \\cdot `}${x} + ${d} = ${half}$，与 $AM$ 相等，$${half} + ${half} = ${2 * half}$。`,
          ],
          [
            [half, "That is $AM$, only half of $\\overline{AB}$: double it.", "这是 $AM$，只是 $\\overline{AB}$ 的一半：要乘 2。"],
            [x, `That is $x$, not a length: put it into $AM$ and double.`, `这是 $x$ 的值，不是长度：要代入 $AM$ 再乘 2。`],
            [2 * x, "That doubles $x$, not the length $AM$.", "这是把 $x$ 乘了 2，而不是把长度 $AM$ 乘 2。"],
          ],
          { form: "integer" },
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 13, text: "3x - 2", lit: true },
              { size: 13, text: "x + 8" },
            ],
            total: "AB",
          },
        ],
        ["Segment AB cut at its midpoint into two equal parts, 3x - 2 and x + 8.", "线段 AB 在中点处分成相等的两部分：3x - 2 和 x + 8。"],
      ),
    ),
  ],

  "collinear-points": [
    skill(
      "the-coordinate-that-makes-points-collinear",
      ["The coordinate that makes points collinear", "使三点共线的坐标"],
      [
        "Points are collinear when equal steps across always bring equal steps up. So the rise per unit from two known points fixes the height of a third point on that line.",
        "三点共线时，横向走相同的步，纵向变化也相同。所以由两个已知点得到每单位的变化，就确定了第三点的高度。",
      ],
      (rng) => {
        const m = rng.int(-6, 6) || 2;
        const b = rng.int(-9, 9);
        const x1 = rng.int(0, 3);
        const x2 = x1 + rng.int(1, 3);
        const x3 = x2 + rng.int(1, 5);
        return integer(
          [
            `The points $(${x1}, ${m * x1 + b})$, $(${x2}, ${m * x2 + b})$ and $(${x3}, y)$ are collinear. What is $y$?`,
            `点 $(${x1}, ${m * x1 + b})$、$(${x2}, ${m * x2 + b})$ 和 $(${x3}, y)$ 共线。$y$ 是多少？`,
          ],
          m * x3 + b,
          [m * x2 + b + (x3 - x2), m * x3, m * x3 + b + m],
          [
            `$y$ changes by $${m}$ for each $1$ of $x$, so at $x = ${x3}$ it is $${m * x3 + b}$.`,
            `$x$ 每增加 $1$，$y$ 变化 $${m}$，所以 $x = ${x3}$ 时 $y$ 是 $${m * x3 + b}$。`,
          ],
        );
      },
    ),
  ],
  "congruent-angles": [
    lesson(
      "the-whole-angle-from-its-bisector",
      ["The whole angle from its bisector", "由角平分线求整个角"],
      [
        [
          "A bisector cuts an angle into two congruent angles, which gives an equation. The measure of the whole angle comes from substituting the solution and then doubling. If ray $BD$ bisects $\\angle ABC$ with $m\\angle ABD = (3x + 5)^\\circ$ and $m\\angle DBC = (x + 25)^\\circ$, then $3x + 5 = x + 25$, so $x = 10$, each part is $35^\\circ$ and $m\\angle ABC = 70^\\circ$.",
          "角平分线把角分成两个相等的角，由此得到方程。把解代入后再乘 2，才是整个角的度数。若射线 $BD$ 平分 $\\angle ABC$，$m\\angle ABD = (3x + 5)^\\circ$，$m\\angle DBC = (x + 25)^\\circ$，则 $3x + 5 = x + 25$，所以 $x = 10$，每部分是 $35^\\circ$，$m\\angle ABC = 70^\\circ$。",
        ],
        [
          "$m\\angle DBC = 10 + 25 = 35^\\circ$, the same as $m\\angle ABD$, and $35 + 35 = 70$.",
          "$m\\angle DBC = 10 + 25 = 35^\\circ$，与 $m\\angle ABD$ 相等，$35 + 35 = 70$。",
        ],
        [
          "$35^\\circ$ is only one of the two parts. The whole angle is twice as big.",
          "$35^\\circ$ 只是两部分中的一个。整个角是它的两倍。",
        ],
      ],
      (rng) => {
        const c = rng.int(1, 5);
        const a = c + rng.int(1, 4);
        const x = rng.int(3, 12);
        const half = rng.int(15, 80);
        const b = half - a * x;
        const d = half - c * x;
        const k = a - c;
        const cx = c === 1 ? "x" : `${c}x`;
        return valued(
          [
            `Ray $BD$ bisects $\\angle ABC$, with $m\\angle ABD = (${a}x${signed(b)})^\\circ$ and $m\\angle DBC = (${cx}${signed(d)})^\\circ$. What is $m\\angle ABC$, in degrees?`,
            `射线 $BD$ 平分 $\\angle ABC$，$m\\angle ABD = (${a}x${signed(b)})^\\circ$，$m\\angle DBC = (${cx}${signed(d)})^\\circ$。$m\\angle ABC$ 是多少度？`,
          ],
          2 * half,
          [
            [
              ["Set the parts equal", "令两部分相等"],
              [
                `The bisector makes the two parts equal. Take $${cx}$ from both sides and solve:`,
                `角平分线使两部分相等。两边减去 $${cx}$ 再求解：`,
              ],
              [`${a}x${signed(b)} = ${cx}${signed(d)}`, ...(k === 1 ? [] : [`${k}x = ${d - b}`]), `x = ${x}`],
            ],
            [
              ["Find the whole", "求整个角"],
              ["Put $x$ into one part, then double it:", "把 $x$ 代入其中一部分，再乘 2："],
              [
                `m\\angle ABD = ${a} \\cdot ${x}${signed(b)} = ${half}^\\circ`,
                `m\\angle ABC = 2 \\cdot ${half}^\\circ = ${2 * half}^\\circ`,
              ],
            ],
          ],
          [
            `$m\\angle DBC = ${c === 1 ? "" : `${c} \\cdot `}${x}${signed(d)} = ${half}^\\circ$, the same as $m\\angle ABD$, and $${half} + ${half} = ${2 * half}$.`,
            `$m\\angle DBC = ${c === 1 ? "" : `${c} \\cdot `}${x}${signed(d)} = ${half}^\\circ$，与 $m\\angle ABD$ 相等，$${half} + ${half} = ${2 * half}$。`,
          ],
          [
            [
              half,
              "That is one part, $m\\angle ABD$: the whole angle is twice as big.",
              "这是其中一部分 $m\\angle ABD$：整个角是它的两倍。",
            ],
            [x, "That is $x$, not an angle: put it into a part and double.", "这是 $x$ 的值，不是角的度数：要代入其中一部分再乘 2。"],
            [
              180 - half,
              `That takes one part from $180^\\circ$, but the two parts are not a straight angle. Double $${half}^\\circ$ instead.`,
              `这是用 $180^\\circ$ 减去了一部分，但两部分合起来不是平角。应把 $${half}^\\circ$ 乘 2。`,
            ],
          ],
          { form: "integer" },
        );
      },
      drawn(gradeDrawings4["congruent-angles#the-whole-angle-from-its-bisector"]),
    ),
  ],

  "corresponding-angles": [
    {
      ...skill(
        "the-value-that-makes-lines-parallel",
        ["The value that makes lines parallel", "使两线平行的值"],
        [
          "The converse also holds: when corresponding angles are equal, the lines are parallel. So setting the two expressions equal finds the value that makes the lines parallel.",
          "逆命题也成立：同位角相等时两直线平行。所以令两个表达式相等，就能求出使两线平行的值。",
        ],
        (rng) => {
          const c = rng.int(2, 5);
          const a = c + rng.int(1, 4);
          const x = rng.int(3, 15);
          const drawn = rng.int(30, 150);
          const angle = drawn === a * x || drawn === c * x ? a * x + c * x : drawn;
          const b = angle - a * x;
          const d = angle - c * x;
          return whole(
            [
              `A transversal crosses lines $\\ell$ and $m$. Corresponding angles measure $(${a}x${signed(b)})^\\circ$ and $(${c}x${signed(d)})^\\circ$. For what value of $x$ are $\\ell$ and $m$ parallel?`,
              `一条截线与直线 $\\ell$、$m$ 相交。同位角分别是 $(${a}x${signed(b)})^\\circ$ 和 $(${c}x${signed(d)})^\\circ$。$x$ 为何值时 $\\ell$ 与 $m$ 平行？`,
            ],
            x,
            [angle, x + a - c, 180 - angle],
            [
              `Corresponding angles must be equal: $${a}x${signed(b)} = ${c}x${signed(d)}$, so $${a - c === 1 ? "" : a - c}x = ${d - b}$ and $x = ${x}$.`,
              `同位角必须相等：$${a}x${signed(b)} = ${c}x${signed(d)}$，所以 $${a - c === 1 ? "" : a - c}x = ${d - b}$，$x = ${x}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["corresponding-angles#the-value-that-makes-lines-parallel"],
    },
  ],
  "consecutive-angles": [
    {
      ...skill(
        "consecutive-angles-in-a-ratio",
        ["Consecutive angles in a ratio", "成比例的同旁内角"],
        [
          "Consecutive interior angles between parallel lines add up to $180$ degrees. So a ratio splits $180$ degrees into equal shares, and each angle is a number of those shares.",
          "两平行线间的同旁内角之和是 $180$ 度。所以比把 $180$ 度分成若干等份，每个角占若干份。",
        ],
        (rng) => {
          const [p, q] = rng.pick<[number, number]>([
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
            [2, 3],
            [1, 8],
            [4, 5],
            [1, 9],
            [7, 8],
            [5, 7],
            [1, 11],
            [3, 7],
            [2, 7],
            [1, 14],
            [1, 17],
            [5, 13],
            [7, 11],
            [9, 11],
            [3, 17],
            [7, 13],
          ]);
          const each = 180 / (p + q);
          const large = rng.bool();
          return whole(
            large
              ? [
                  `Two consecutive interior angles between parallel lines are in the ratio $${p} : ${q}$. What is the larger angle, in degrees?`,
                  `两平行线间的同旁内角之比是 $${p} : ${q}$。较大的角是多少度？`,
                ]
              : [
                  `Two consecutive interior angles between parallel lines are in the ratio $${p} : ${q}$. What is the smaller angle, in degrees?`,
                  `两平行线间的同旁内角之比是 $${p} : ${q}$。较小的角是多少度？`,
                ],
            (large ? q : p) * each,
            [(large ? p : q) * each, each, 90],
            [
              `One share is $180 \\div ${p + q} = ${each}$${(large ? q : p) === 1 ? ", and the smaller angle is one share" : `, and $${large ? q : p} \\times ${each} = ${(large ? q : p) * each}$`}.`,
              `一份是 $180 \\div ${p + q} = ${each}$${(large ? q : p) === 1 ? "，较小的角就是一份" : `，$${large ? q : p} \\times ${each} = ${(large ? q : p) * each}$`}。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["consecutive-angles#consecutive-angles-in-a-ratio"],
    },
  ],
  "comparing-data-sets-using-range-and-quartiles": [
    skill(
      "at-least-half-from-the-medians",
      ["At least half, from the medians", "由中位数判断至少一半"],
      [
        "The median has half of the values at or above it. So at least half of a group is sure to have reached a score when its median is at that score or higher.",
        "至少一半的数据大于或等于中位数。所以中位数不低于某分数时，这一组一定至少有一半达到该分数。",
      ],
      (rng) => {
        const x = rng.int(40, 80);
        const medA = x + (rng.bool() ? rng.int(1, 9) : -rng.int(1, 9));
        const medB = x + (rng.bool() ? rng.int(1, 9) : -rng.int(1, 9));
        const five = (m: number) => `${m - rng.int(11, 20)}, ${m - rng.int(3, 10)}, ${m}, ${m + rng.int(3, 10)}, ${m + rng.int(11, 20)}`;
        const correct = medA >= x && medB >= x ? 0 : medA >= x ? 1 : medB >= x ? 2 : 3;
        const options: [string, string][] = [
          ["Both classes", "两个班都可以确定"],
          ["Class A only", "只有 A 班"],
          ["Class B only", "只有 B 班"],
          ["Neither class", "两个班都不能确定"],
        ];
        const a = five(medA);
        const b = five(medB);
        return choose(
          rng,
          [
            `These are the five-number summaries of two classes. A: $${a}$. B: $${b}$. For which classes can you be sure that at least half of the students scored $${x}$ or more?`,
            `这是两个班的五数概括。A 班：$${a}$。B 班：$${b}$。可以确定哪些班至少一半的学生得分不低于 $${x}$？`,
          ],
          options[correct]!,
          options.filter((_, i) => i !== correct),
          [`The medians are ${medA} and ${medB}. Compare each with ${x}.`, `中位数是 ${medA} 和 ${medB}，分别与 ${x} 比较。`],
        );
      },
    ),
  ],
  "comparing-data-set-visualizations-using-standard-deviation-and-mad": [
    skill(
      "scaling-data-scales-its-spread",
      ["Scaling data scales its spread", "数据放大，离散程度也放大"],
      [
        "Adding a constant slides a data set along and leaves its spread alone. Multiplying every value by a constant stretches all the gaps, so the spread is multiplied by that constant too.",
        "加上常数只是平移数据，离散程度不变。每个值乘一个常数，所有间隔都被拉伸，所以离散程度也乘这个常数。",
      ],
      (rng) => {
        const mad = rng.int(2, 20);
        const k = rng.int(2, 9);
        const mul = rng.bool();
        return whole(
          mul
            ? [
                `A data set has a mean absolute deviation of $${mad}$. Every value is multiplied by $${k}$. What is the new mean absolute deviation?`,
                `一组数据的平均绝对偏差是 $${mad}$。每个值都乘 $${k}$。新的平均绝对偏差是多少？`,
              ]
            : [
                `A data set has a mean absolute deviation of $${mad}$. Every value is increased by $${k}$. What is the new mean absolute deviation?`,
                `一组数据的平均绝对偏差是 $${mad}$。每个值都加 $${k}$。新的平均绝对偏差是多少？`,
              ],
          mul ? mad * k : mad,
          mul ? [mad, mad + k, mad * k + k] : [mad + k, mad * k, k],
          mul
            ? [
                `All gaps are $${k}$ times as wide, so it is $${mad} \\times ${k} = ${mad * k}$.`,
                `所有间隔都变成 $${k}$ 倍，所以是 $${mad} \\times ${k} = ${mad * k}$。`,
              ]
            : [
                `Adding $${k}$ moves every value equally, so the gaps and the deviation stay at $${mad}$.`,
                `加 $${k}$ 使每个值移动相同的距离，所以间隔和偏差仍是 $${mad}$。`,
              ],
        );
      },
    ),
  ],
  "comparing-data-sets-using-standard-deviation-and-mad": [
    skill(
      "how-many-deviations-above-the-mean",
      ["How many deviations above the mean", "比平均数高几个标准差"],
      [
        "A distance from the mean means more when the data are tightly packed. Dividing that distance by the standard deviation measures it in units of spread, and it can compare different data sets.",
        "数据越集中，到平均数的距离就越有意义。用这个距离除以标准差，就是以离散程度为单位的度量，可以比较不同的数据组。",
      ],
      (rng) => {
        const mean = rng.int(40, 90);
        const sd = rng.int(2, 12);
        const k = rng.int(1, 5);
        return whole(
          [
            `A test has a mean of $${mean}$ and a standard deviation of $${sd}$. A student scores $${mean + k * sd}$. How many standard deviations above the mean is this?`,
            `一次测验的平均数是 $${mean}$，标准差是 $${sd}$。一名学生得 $${mean + k * sd}$ 分。这比平均数高几个标准差？`,
          ],
          k,
          [k * sd, k + 1, Math.round((mean + k * sd) / sd)],
          [
            `The score is $${k * sd}$ above the mean, and $${k * sd} \\div ${sd} = ${k}$.`,
            `比平均数高 $${k * sd}$ 分，$${k * sd} \\div ${sd} = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "finding-unit-prices": [
    lesson(
      "the-best-buy",
      ["The best buy", "最划算的选择"],
      [
        [
          "With several offers, find the unit price of each: its price divided by its number of cans. The lowest unit price is the best buy, whatever the pack size. $3$ cans for $\\$1.50$ is $\\$0.50$ a can, and $8$ cans for $\\$4.40$ is $\\$0.55$ a can, so the $3$-can offer is better.",
          "有好几种优惠时，先求每种的单价：价钱除以罐数。单价最低的最划算，不管包装多大。$3$ 罐 $\\$1.50$ 是每罐 $\\$0.50$，$8$ 罐 $\\$4.40$ 是每罐 $\\$0.55$，所以 $3$ 罐装更划算。",
        ],
        [
          "At $\\$0.50$ a can, $8$ cans would cost only $\\$4.00$, less than $\\$4.40$.",
          "按每罐 $\\$0.50$ 算，$8$ 罐只要 $\\$4.00$，比 $\\$4.40$ 便宜。",
        ],
        [
          "The lowest total price is not the best buy when the packs hold different numbers of cans.",
          "包装罐数不同时，总价最低的不一定最划算。",
        ],
      ],
      (rng) => {
        const rates = (rng.sample([40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90], 4) as number[]).sort((a, b) => a - b);
        const packs = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 4) as number[];
        const offer = (i: number): Pair => [
          `${packs[i]} cans for ${money(packs[i]! * rates[i]!)} dollars`,
          `${packs[i]} 罐 ${money(packs[i]! * rates[i]!)} 美元`,
        ];
        const best = rates[0]!;
        return chosen(
          rng,
          ["Which offer has the lowest price per can?", "哪种优惠每罐最便宜？"],
          offer(0),
          [1, 2, 3].map(
            (i): Wrong => [
              offer(i),
              `It costs ${money(rates[i]!)} dollars per can, more than ${money(best)}.`,
              `它每罐 ${money(rates[i]!)} 美元，比 ${money(best)} 贵。`,
            ],
          ),
          [
            [
              ["Unit prices", "求单价"],
              ["Divide each price by its number of cans:", "每个价钱除以罐数："],
              [0, 1, 2, 3].map((i) => `${money(packs[i]! * rates[i]!)} \\div ${packs[i]} = ${money(rates[i]!)}`),
            ],
            [
              ["Compare", "比较"],
              [
                `The lowest is $${money(best)}$ dollars per can, from ${packs[0]} cans.`,
                `最低的是每罐 $${money(best)}$ 美元，来自 ${packs[0]} 罐装。`,
              ],
            ],
          ],
          [
            `At $${money(best)}$ dollars a can, ${packs[1]} cans would cost $${money(packs[1]! * best)}$, less than the $${money(packs[1]! * rates[1]!)}$ asked.`,
            `按每罐 $${money(best)}$ 美元算，${packs[1]} 罐只要 $${money(packs[1]! * best)}$，比标价 $${money(packs[1]! * rates[1]!)}$ 便宜。`,
          ],
        );
      },
      tableFigure(["1.50 / 3", "4.40 / 8"], [0.5, 0.55]),
    ),
  ],

  "unit-rates-associated-with-ratios-of-mixed-numbers": [
    lesson(
      "pounds-for-one-dollar",
      ["Pounds for one dollar", "一美元能买多少磅"],
      [
        [
          "A price can be read two ways: dollars per pound, or pounds per dollar. For pounds per dollar, divide the pounds by the dollars, after writing the mixed numbers as improper fractions. $2\\frac{1}{2}$ pounds for $5$ dollars: $\\frac{5}{2} \\div 5 = \\frac{1}{2}$ pound per dollar.",
          "价格有两种读法：每磅多少美元，或每美元多少磅。求每美元多少磅，就用磅数除以美元数，带分数先化成假分数。$5$ 美元买 $2\\frac{1}{2}$ 磅：$\\frac{5}{2} \\div 5 = \\frac{1}{2}$ 磅/美元。",
        ],
        [
          "$5$ dollars at $\\frac{1}{2}$ pound each buy $5 \\times \\frac{1}{2} = 2\\frac{1}{2}$ pounds.",
          "$5$ 美元、每美元 $\\frac{1}{2}$ 磅，共 $5 \\times \\frac{1}{2} = 2\\frac{1}{2}$ 磅。",
        ],
        [
          "Pounds per dollar puts the pounds on top; dollars per pound is the reciprocal.",
          "每美元的磅数要把磅数作被除数；每磅的美元数是它的倒数。",
        ],
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = rng.pick([2, 3, 4]);
        const c = rng.int(2, 9);
        const d = rng.pick([2, 4, 5]);
        const pounds = Q.of(a * b + 1, b);
        const dollars = Q.of(c * d + 1, d);
        const answer = pounds.div(dollars);
        return valued(
          [
            `$${a}${frac(1, b)}$ pounds of apples cost $${c}${frac(1, d)}$ dollars. How many pounds can be bought per dollar?`,
            `$${a}${frac(1, b)}$ 磅苹果售价 $${c}${frac(1, d)}$ 美元。每美元能买多少磅？`,
          ],
          answer,
          [
            [
              ["Improper fractions", "化成假分数"],
              ["Write both mixed numbers as improper fractions:", "把两个带分数化成假分数："],
              [`${a}${frac(1, b)} = ${frac(a * b + 1, b)}`, `${c}${frac(1, d)} = ${frac(c * d + 1, d)}`],
            ],
            [
              ["Divide", "相除"],
              ["Pounds per dollar is the pounds divided by the dollars:", "每美元的磅数等于磅数除以美元数："],
              [
                `${frac(a * b + 1, b)} \\div ${frac(c * d + 1, d)} = ${frac(a * b + 1, b)} \\times ${frac(d, c * d + 1)} = ${answer.toLatex()}`,
              ],
            ],
          ],
          [
            `Multiply back: $${answer.toLatex()} \\times ${dollars.toLatex()} = ${pounds.toLatex()}$, the pounds bought.`,
            `乘回去：$${answer.toLatex()} \\times ${dollars.toLatex()} = ${pounds.toLatex()}$，正是买到的磅数。`,
          ],
          [
            [dollars.div(pounds), "That is dollars per pound, the rate the other way.", "这是每磅的美元数，是反过来的比率。"],
            [pounds.mul(dollars), "That multiplies the pounds by the dollars instead of dividing.", "这是磅数乘美元数，而不是相除。"],
            [pounds, "That is all the pounds, not the pounds for one dollar.", "这是全部的磅数，不是一美元能买的磅数。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            total: "5/2",
            pieces: [1, 2, 3, 4, 5].map((i) => ({ size: 1, text: "1/2", lit: i === 1 })),
          },
        ],
        ["Five dollars buy 5/2 pounds, 1/2 pound for each dollar.", "五美元买 5/2 磅，每美元 1/2 磅。"],
      ),
    ),
  ],
  "solving-unit-rate-problems-using-ratios-of-mixed-numbers": [
    lesson(
      "how-much-faster",
      ["How much faster", "快多少"],
      [
        [
          "Two rates can be compared only once each is written per one unit. Find each unit rate, then subtract them to see how much more one covers in a single unit. Ann walks $7\\frac{1}{2}$ miles in $1\\frac{1}{2}$ hours, $5$ miles per hour; Ben walks $5\\frac{1}{4}$ miles in $1\\frac{3}{4}$ hours, $3$ miles per hour. Ann walks $5 - 3 = 2$ more miles per hour.",
          "两个比率要先都写成每一个单位，才能比较。先求各自的单位率，再相减，就知道一方每单位多走多少。Ann $1\\frac{1}{2}$ 小时走 $7\\frac{1}{2}$ 英里，每小时 $5$ 英里；Ben $1\\frac{3}{4}$ 小时走 $5\\frac{1}{4}$ 英里，每小时 $3$ 英里。Ann 每小时多走 $5 - 3 = 2$ 英里。",
        ],
        [
          "In one hour Ann walks $5$ miles and Ben $3$; Ben plus $2$ makes $5$.",
          "一小时 Ann 走 $5$ 英里，Ben 走 $3$ 英里；$3$ 加 $2$ 正是 $5$。",
        ],
        ["Subtracting the distances does not work when the times differ.", "时间不同时，直接把路程相减是不对的。"],
      ],
      (rng) => {
        const r1 = rng.int(4, 9);
        const r2 = r1 - rng.int(1, 3);
        const t1 = Q.of(2 * rng.int(1, 4) + 1, 2);
        const t2 = Q.of(4 * rng.int(1, 4) + 1, 4);
        const d1 = t1.mul(Q.of(r1));
        const d2 = t2.mul(Q.of(r2));
        return valued(
          [
            `Ann walks $${d1.toLatex()}$ miles in $${t1.toLatex()}$ hours, and Ben walks $${d2.toLatex()}$ miles in $${t2.toLatex()}$ hours. How many more miles per hour does Ann walk?`,
            `Ann $${t1.toLatex()}$ 小时走 $${d1.toLatex()}$ 英里，Ben $${t2.toLatex()}$ 小时走 $${d2.toLatex()}$ 英里。Ann 每小时比 Ben 多走多少英里？`,
          ],
          r1 - r2,
          [
            [
              ["Unit rates", "求单位率"],
              ["Divide each distance by its time:", "每人的路程除以时间："],
              [`${d1.toLatex()} \\div ${t1.toLatex()} = ${r1}`, `${d2.toLatex()} \\div ${t2.toLatex()} = ${r2}`],
            ],
            [["Subtract", "相减"], ["Subtract the unit rates:", "把两个单位率相减："], [`${r1} - ${r2} = ${r1 - r2}`]],
          ],
          [
            `Ben's ${r2} plus ${r1 - r2} is ${r1}, and $${r1} \\times ${t1.toLatex()} = ${d1.toLatex()}$ gives back Ann's distance.`,
            `Ben 的 ${r2} 加 ${r1 - r2} 是 ${r1}，而 $${r1} \\times ${t1.toLatex()} = ${d1.toLatex()}$，正是 Ann 走的路程。`,
          ],
          [
            [r1, "That is Ann's rate, not how much faster she is.", "这是 Ann 的速度，不是她快多少。"],
            [r2, "That is Ben's rate.", "这是 Ben 的速度。"],
            [r1 + r2, "That adds the two rates instead of subtracting.", "这是把两个速度相加，而不是相减。"],
          ],
        );
      },
      tapeFigure(
        [
          {
            pieces: [
              { size: 3, text: "3" },
              { size: 2, text: "2", lit: true },
            ],
          },
          { pieces: [{ size: 3, text: "3" }] },
        ],
        ["Ann's 5 miles per hour is Ben's 3 plus 2 more.", "Ann 每小时 5 英里，等于 Ben 的 3 英里再多 2 英里。"],
      ),
    ),
  ],

  "interpreting-products-and-quotients-of-rational-numbers": [
    lesson(
      "going-back-in-time",
      ["Going back in time", "回到过去"],
      [
        [
          "Time in the past can be written as a negative number of days. A negative rate times a negative time gives a positive change: a falling quantity was higher in the past. A tank changes by $-5$ liters a day; $3$ days ago is a time of $-3$, and $(-5) \\times (-3) = 15$, so the level was $15$ liters higher.",
          "过去的时间可以写成负的天数。负的变化率乘负的时间得正的变化：一个不断下降的量，过去更高。水箱每天变化 $-5$ 升；$3$ 天前就是时间 $-3$，$(-5) \\times (-3) = 15$，所以那时水量多 $15$ 升。",
        ],
        [
          "Count forward instead: from $3$ days ago to now the level falls $3 \\times 5 = 15$ liters.",
          "换个方向数：从 $3$ 天前到现在，水量下降了 $3 \\times 5 = 15$ 升。",
        ],
        ["The level was higher in the past, so the answer is positive, not $-15$.", "过去的水量更多，所以答案是正数，不是 $-15$。"],
      ],
      (rng) => {
        const a = rng.int(2, 20);
        const b = rng.int(2, 15);
        return valued(
          [
            `A tank's level changes by $-${a}$ liters each day. How many liters higher was the level $${b}$ days ago than it is now?`,
            `水箱的水量每天变化 $-${a}$ 升。$${b}$ 天前的水量比现在多多少升？`,
          ],
          a * b,
          [
            [
              ["Signed numbers", "写成带符号的数"],
              [
                `The rate is $-${a}$ liters a day, and $${b}$ days ago is a time of $-${b}$ days.`,
                `变化率是每天 $-${a}$ 升，$${b}$ 天前就是时间 $-${b}$ 天。`,
              ],
            ],
            [
              ["Multiply", "相乘"],
              ["Two negatives give a positive change:", "两个负数相乘得正的变化："],
              [`(-${a}) \\times (-${b}) = ${a * b}`],
            ],
          ],
          [
            `Count forward: from $${b}$ days ago to now the level falls $${b} \\times ${a} = ${a * b}$ liters.`,
            `往后数：从 $${b}$ 天前到现在，水量下降了 $${b} \\times ${a} = ${a * b}$ 升。`,
          ],
          [
            [a + b, "That adds the rate and the days; the change is a product.", "这是把变化率和天数相加；变化量是乘积。"],
            [a, "That is the change for one day only.", "这只是一天的变化。"],
            [b, "That is the number of days, not the change in liters.", "这是天数，不是水量的变化。"],
          ],
        );
      },
      tableFigure(["(-5)(-3)", "3 × 5"], [15, 15]),
    ),
  ],

  "solving-multistep-problems-with-rational-numbers": [
    lesson(
      "the-mean-of-signed-values",
      ["The mean of signed values", "带符号数值的平均数"],
      [
        [
          "A mean is the sum divided by the count. Negative values make the sum smaller, so add every value with its sign. The temperatures $-4$, $3$ and $-5$ degrees add to $-6$, and $-6 \\div 3 = -2$, so the mean is $-2$ degrees.",
          "平均数是总和除以个数。负数会使总和变小，所以每个值都要带着符号相加。气温 $-4$、$3$ 和 $-5$ 度的和是 $-6$，$-6 \\div 3 = -2$，所以平均气温是 $-2$ 度。",
        ],
        ["Multiply back: $3 \\times (-2) = -6$, the sum of the three values.", "乘回去：$3 \\times (-2) = -6$，正是三个值的和。"],
        [
          "Ignoring the signs gives $(4 + 3 + 5) \\div 3 = 4$, a mean that is far too high.",
          "忽略符号会得到 $(4 + 3 + 5) \\div 3 = 4$，平均数就偏高很多。",
        ],
      ],
      (rng) => {
        const n = rng.pick([4, 5, 6]);
        const xs = Array.from({ length: n }, () => rng.int(-15, 15));
        let total = xs.reduce((s, x) => s + x, 0);
        while (total % n !== 0) {
          xs[0] = xs[0]! + 1;
          total += 1;
        }
        const mean = total / n;
        const abs = xs.reduce((s, x) => s + Math.abs(x), 0);
        const sum = xs.map((v, i) => (i === 0 ? `${v}` : v < 0 ? `- ${-v}` : `+ ${v}`)).join(" ");
        const p = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return valued(
          [
            `The temperatures on ${n} days were ${xs.join(", ")} degrees. What was the mean temperature, in degrees?`,
            `${n} 天的气温分别是 ${xs.join("、")} 度。平均气温是多少度？`,
          ],
          mean,
          [
            [["The sum", "求和"], ["Add the values with their signs:", "带着符号把各个值相加："], [`${sum} = ${total}`]],
            [["Divide", "相除"], [`Divide the sum by the ${n} days:`, `用总和除以 ${n} 天：`], [`${p(total)} \\div ${n} = ${mean}`]],
          ],
          [
            `Multiply back: $${n} \\times ${p(mean)} = ${total}$, the sum of the values.`,
            `乘回去：$${n} \\times ${p(mean)} = ${total}$，正是各个值的和。`,
          ],
          [
            [Math.round(abs / n), "That ignores the signs; negative values make the sum smaller.", "这是忽略了符号；负数会使总和变小。"],
            [total, `That is the sum; divide it by the ${n} days.`, `这是总和；还要除以 ${n} 天。`],
            [-mean, "The sign is wrong.", "符号错了。"],
          ],
        );
      },
      tableFigure(["-4+3-5", "-6/3"], [-6, -2]),
    ),
  ],

  "volumes-of-triangular-prisms": [
    {
      ...skill(
        "a-house-shaped-prism",
        ["A house-shaped prism", "房子形状的棱柱"],
        [
          "Any prism has a volume of base area times length, whatever shape its cross-section has. A house shape is a rectangle with a triangle on top, so add those two areas first.",
          "任何棱柱的体积都是底面积乘长度，不管截面是什么形状。房子形状是长方形上面加三角形，所以先把两个面积相加。",
        ],
        (rng) => {
          const w = rng.int(2, 12) * 2;
          const h = rng.int(3, 12);
          const roof = rng.int(2, 9);
          const l = rng.int(5, 25);
          const area = w * h + (w * roof) / 2;
          return whole(
            [
              `A shed is a prism ${l} m long. Its end is a rectangle ${w} m wide and ${h} m high, with a triangular roof ${roof} m high on top. What is its volume, in cubic meters?`,
              `一个棚屋是长 ${l} 米的棱柱。端面是宽 ${w} 米、高 ${h} 米的长方形，上面有高 ${roof} 米的三角形屋顶。它的体积是多少立方米？`,
            ],
            area * l,
            [(w * h + w * roof) * l, w * h * l, w * (h + roof) * l],
            [
              `The end has area $${w * h} + ${(w * roof) / 2} = ${area}$, and $${area} \\times ${l} = ${area * l}$.`,
              `端面面积是 $${w * h} + ${(w * roof) / 2} = ${area}$，$${area} \\times ${l} = ${area * l}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings4["volumes-of-triangular-prisms#a-house-shaped-prism"],
    },
  ],
  "surface-areas-of-triangular-prisms": [
    skill(
      "the-surface-without-the-floor",
      ["The surface without the floor", "不含底面的表面积"],
      [
        "Real objects often leave out a face, as a tent's floor may be open. Add only the faces that are asked for, which here are the two triangular ends and the two sloping or upright sides.",
        "实际物体常常少一个面，比如帐篷可以没有底。只加题目要求的面，这里是两个三角形端面和另外两个侧面。",
      ],
      (rng) => {
        const [p, q, r] = rng.pick<[number, number, number]>([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [9, 12, 15],
          [8, 15, 17],
        ]);
        const l = rng.int(4, 25);
        return whole(
          [
            `A right triangular prism is ${l} m long, and its ends are right triangles with legs ${p} m and ${q} m and hypotenuse ${r} m. It rests on the face with the ${q} m leg. What is the surface area without that face, in square meters?`,
            `一个直角三棱柱长 ${l} 米，端面是直角三角形，两条直角边为 ${p} 米和 ${q} 米，斜边 ${r} 米。它放在含 ${q} 米直角边的面上。不含这个面的表面积是多少平方米？`,
          ],
          p * q + p * l + r * l,
          [p * q + (p + q + r) * l, (p * q) / 2 + p * l + r * l, (p + r) * l],
          [
            `The two ends total $${p} \\times ${q} = ${p * q}$, and the two faces left are $${p} \\times ${l}$ and $${r} \\times ${l}$.`,
            `两个端面共 $${p} \\times ${q} = ${p * q}$，剩下的两个面是 $${p} \\times ${l}$ 和 $${r} \\times ${l}$。`,
          ],
        );
      },
    ),
  ],
  "cross-sections-of-three-dimensional-shapes": [
    skill(
      "the-new-surface-from-a-cut",
      ["The new surface from a cut", "切割产生的新表面"],
      [
        "A cut creates two new faces, one on each piece, each equal to the cross-section. So the total surface area of the pieces rises by twice the area of the cross-section.",
        "切一刀产生两个新面，每块一个，都等于截面。所以各块的总表面积增加截面积的两倍。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const c = rng.int(2, 15);
        return whole(
          [
            `A box ${a} cm by ${b} cm by ${c} cm is cut into two pieces parallel to its ${a} cm by ${b} cm face. By how many square cm does the total surface area increase?`,
            `一个 ${a} 厘米 × ${b} 厘米 × ${c} 厘米的盒子，平行于 ${a} 厘米 × ${b} 厘米的面切成两块。总表面积增加多少平方厘米？`,
          ],
          2 * a * b,
          [a * b, 2 * a * b * c, 2 * (a + b)],
          [
            `Two new faces appear, each of area $${a} \\times ${b} = ${a * b}$, for ${2 * a * b} in all.`,
            `出现两个新面，每个面积 $${a} \\times ${b} = ${a * b}$，共 ${2 * a * b}。`,
          ],
        );
      },
    ),
  ],
  "biased-and-unbiased-samples": [
    skill(
      "scaling-up-a-fair-sample",
      ["Scaling up a fair sample", "按比例推算公平样本"],
      [
        "A fair sample is expected to have about the same fraction as the whole population. So the sample's fraction multiplied by the population gives an estimate, and it is no more than an estimate.",
        "公平样本的比例应大致等于总体的比例。所以样本比例乘总体数量得到估计值，这只是估计。",
      ],
      (rng) => {
        const sample = rng.pick([20, 40, 60, 80, 100, 200]);
        const k = rng.pick([10, 20, 25, 30, 40, 50, 60]);
        const yes = rng.int(1, 9) * (sample / 20);
        return whole(
          [
            `In a random sample of ${sample} of the ${sample * k} students at a university, ${yes} ride a bike. About how many of all the students ride a bike?`,
            `从一所大学的 ${sample * k} 名学生中随机抽取 ${sample} 人，有 ${yes} 人骑自行车。全校大约有多少学生骑自行车？`,
          ],
          yes * k,
          [yes, yes + sample * k - sample, sample * k - yes * k],
          [
            `The sample is $${frac(1, k)}$ of the students, so multiply ${yes} by ${k}: ${yes * k}.`,
            `样本是学生总数的 $${frac(1, k)}$，所以 ${yes} 乘 ${k}：${yes * k}。`,
          ],
        );
      },
    ),
  ],
  "cumulative-frequency": [
    skill(
      "a-frequency-from-the-running-totals",
      ["A frequency from the running totals", "由累积频数求频数"],
      [
        "Each cumulative frequency is a running total of the frequencies so far. So the frequency of one value is the difference between its running total and the one before it.",
        "累积频数是到目前为止频数的总和。所以一个值的频数，是它的累积频数减去前一个累积频数。",
      ],
      (rng) => {
        const fs = Array.from({ length: 5 }, () => rng.int(2, 15));
        let run = 0;
        const totals = fs.map((f) => (run += f));
        const i = rng.int(1, 4);
        const table = `\\begin{array}{|c|c|c|c|c|c|}\\hline \\text{value} & 0 & 1 & 2 & 3 & 4 \\\\ \\hline \\text{total} & ${totals.join(" & ")} \\\\ \\hline\\end{array}`;
        const zhTable = table.replace("\\text{value}", "\\text{值}").replace("\\text{total}", "\\text{累积}");
        return whole(
          [
            `The table gives cumulative frequencies. How many of the values equal ${i}? $$${table}$$`,
            `表格给出累积频数。有多少个数据等于 ${i}？$$${zhTable}$$`,
          ],
          fs[i]!,
          [totals[i]!, totals[i - 1]!, totals[i]! + totals[i - 1]!],
          [
            `A frequency is the jump between running totals, so $${totals[i]} - ${totals[i - 1]} = ${fs[i]}$.`,
            `频数是累积总数的增量，所以 $${totals[i]} - ${totals[i - 1]} = ${fs[i]}$。`,
          ],
        );
      },
    ),
  ],
  "calculating-means-from-frequency-tables": [
    skill(
      "the-exact-mean-from-a-table",
      ["The exact mean from a table", "由频数表求准确的平均数"],
      [
        "A frequency table is a short way of writing a long list. So the sum multiplies each value by its frequency, and the count is the sum of the frequencies, not the number of columns.",
        "频数表是长列表的简写。所以总和是每个值乘它的频数，个数是频数之和，而不是列数。",
      ],
      (rng) => {
        const low = rng.bool();
        const f = rng.int(1, 5);
        const g = rng.int(1, 5);
        const free = rng.int(1, 9);
        const fs = low ? [f + 2 * g, free, f, g] : [f, g, free, 2 * f + g];
        const base = rng.int(0, 5);
        const vals = [base, base + 1, base + 2, base + 3];
        const total = () => fs.reduce((s, f) => s + f, 0);
        const sum = () => fs.reduce((s, f, i) => s + f * vals[i]!, 0);
        const mean = sum() / total();
        const table = `\\begin{array}{|c|c|c|c|c|}\\hline x & ${vals.join(" & ")} \\\\ \\hline f & ${fs.join(" & ")} \\\\ \\hline\\end{array}`;
        return whole(
          [`What is the mean of the data in this frequency table? $$${table}$$`, `这个频数表中数据的平均数是多少？$$${table}$$`],
          mean,
          [sum(), total(), base + 4 === mean ? mean + 1 : base + 4],
          [
            `The sum is ${sum()} and the count is ${total()}, and $${sum()} \\div ${total()} = ${mean}$.`,
            `总和是 ${sum()}，个数是 ${total()}，$${sum()} \\div ${total()} = ${mean}$。`,
          ],
        );
      },
    ),
  ],
  "calculating-medians-from-frequency-tables": [
    skill(
      "the-position-of-the-median",
      ["The position of the median", "中位数的位置"],
      [
        "For an odd count, the median is one value, whose position is half of one more than the count. For an even count, it lies between two values, the lower being at half of the count.",
        "个数为奇数时，中位数是一个值，位置是个数加 1 的一半。个数为偶数时，它在两个值之间，较前的位置是个数的一半。",
      ],
      (rng) => {
        const n = rng.int(11, 120);
        const odd = n % 2 === 1;
        const answer = odd ? (n + 1) / 2 : n / 2;
        return whole(
          odd
            ? [
                `A frequency table has ${n} values in order. In which position is the median?`,
                `频数表中有 ${n} 个按序排列的数据。中位数在第几个？`,
              ]
            : [
                `A frequency table has ${n} values in order. The median lies between two neighboring positions. What is the lower position?`,
                `频数表中有 ${n} 个按序排列的数据。中位数在相邻两个位置之间。较前的位置是第几个？`,
              ],
          answer,
          [answer + 1, answer - 1, n],
          odd
            ? [
                `With an odd count the middle position is $(${n} + 1) \\div 2 = ${answer}$.`,
                `个数为奇数时，中间位置是 $(${n} + 1) \\div 2 = ${answer}$。`,
              ]
            : [
                `$${n} \\div 2 = ${answer}$, so the median is between positions ${answer} and ${answer + 1}.`,
                `$${n} \\div 2 = ${answer}$，所以中位数在第 ${answer} 和第 ${answer + 1} 个之间。`,
              ],
        );
      },
    ),
  ],
  "calculating-modes-and-medians-from-histograms": [
    {
      ...skill(
        "the-share-of-the-modal-class",
        ["The share of the modal class", "众数组所占的比例"],
        [
          "The tallest bar of a histogram marks the modal class. Its height counts the values in it, so its share of the data is its height divided by the sum of all the heights.",
          "直方图中最高的条形是众数组。它的高度是这一组的个数，所以它所占的比例是高度除以所有高度之和。",
        ],
        (rng) => {
          const total = rng.pick([20, 25, 50, 100]);
          const max = Math.round(total * rng.pick([0.4, 0.48, 0.52, 0.6]));
          const rest = total - max;
          const a = rng.int(1, Math.floor(rest / 3));
          const b = rng.int(1, Math.floor(rest / 3));
          const c = rest - a - b;
          const bars = rng.shuffle([max, a, b, c]);
          const percent = (max * 100) / total;
          return whole(
            [
              `A histogram has four bars with heights ${bars.join(", ")}. What percent of the values are in the modal class?`,
              `直方图有四个条形，高度分别是 ${bars.join("、")}。众数组的数据占百分之几？`,
            ],
            percent,
            [max, 25, 100 - percent],
            [
              `The tallest bar is ${max} of ${total} values, which is ${percent}%.`,
              `最高的条形是 ${total} 个数据中的 ${max} 个，即 ${percent}%。`,
            ],
          );
        },
      ),
      figure: gradeDrawings4["calculating-modes-and-medians-from-histograms#the-share-of-the-modal-class"],
    },
  ],
  "calculating-means-from-histograms": [
    {
      ...skill(
        "the-greatest-possible-total",
        ["The greatest possible total", "可能的最大总和"],
        [
          "A histogram hides the exact values, so a total can only be estimated. Using each class's upper end gives a total that the data cannot exceed, while the midpoints give a balanced estimate.",
          "直方图隐藏了准确的值，所以总和只能估计。用每组的上限得到数据不可能超过的总和，用组中值则得到较均衡的估计。",
        ],
        (rng) => {
          const w = rng.pick([4, 6, 10, 20]);
          const start = rng.int(1, 5) * w;
          const fs = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
          const ups = [start + w, start + 2 * w, start + 3 * w];
          const total = fs.reduce((s, f, i) => s + f * ups[i]!, 0);
          const low = fs.reduce((s, f, i) => s + f * (ups[i]! - w), 0);
          return whole(
            [
              `A histogram has classes ${start} to ${ups[0]}, ${ups[0]} to ${ups[1]} and ${ups[1]} to ${ups[2]}, with frequencies ${fs.join(", ")}. Each class includes its upper end. What is the greatest possible total of the values?`,
              `直方图的组为 ${start} 到 ${ups[0]}、${ups[0]} 到 ${ups[1]}、${ups[1]} 到 ${ups[2]}，频数为 ${fs.join("、")}，每组都包含其上限。这些数据的总和最大可能是多少？`,
            ],
            total,
            [low, (total + low) / 2, ups[2]! * 3],
            [
              `Put every value at the top of its class: $${fs.map((f, i) => `${f} \\times ${ups[i]}`).join(" + ")} = ${total}$.`,
              `每个值都取所在组的上限：$${fs.map((f, i) => `${f} \\times ${ups[i]}`).join(" + ")} = ${total}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings4["calculating-means-from-histograms#the-greatest-possible-total"],
    },
  ],
  "comparing-medians": [
    skill(
      "the-median-after-one-more-value",
      ["The median after one more value", "再加一个数后的中位数"],
      [
        "A median depends only on position, so a new top value shifts the middle by half a place. However large the new value is, the median moves to the point between two old neighbors.",
        "中位数只取决于位置，所以新的最大值使中间位置移动半格。不管新值多大，中位数都移到两个原有相邻值之间。",
      ],
      (rng) => {
        const a = rng.int(2, 20);
        const b = a + rng.int(1, 6);
        const c = b + rng.int(1, 6);
        const d = c + 2 * rng.int(1, 4);
        const e = d + rng.int(1, 6);
        const big = e + rng.int(5, 200);
        const answer = (c + d) / 2;
        return whole(
          [
            `A class of 5 has quiz scores ${a}, ${b}, ${c}, ${d}, ${e}. A student who scored ${big} joins. What is the median now?`,
            `一个 5 人小组的分数是 ${a}、${b}、${c}、${d}、${e}。一名得 ${big} 分的学生加入。现在的中位数是多少？`,
          ],
          answer,
          [c, d, Math.round((a + b + c + d + e + big) / 6)],
          [
            `The middle two of the 6 values are ${c} and ${d}, whose mean is ${answer}.`,
            `6 个值中间的两个是 ${c} 和 ${d}，它们的平均数是 ${answer}。`,
          ],
        );
      },
    ),
  ],
  "comparing-modes": [
    skill(
      "how-many-modes",
      ["How many modes", "有几个众数"],
      [
        "A mode is a value that occurs most often, and several values can tie for that. So count how often each value occurs, and every value that reaches the highest count is a mode.",
        "众数是出现次数最多的值，可能有几个值并列。所以数每个值出现几次，达到最高次数的值都是众数。",
      ],
      (rng) => {
        const count = rng.int(1, 3);
        const values = rng.sample([3, 5, 7, 8, 11, 12, 14, 16, 18, 21, 23, 25], count + 2) as number[];
        const list = rng.shuffle(values.flatMap((v, i) => (i < count ? [v, v, v] : [v])));
        return whole(
          [`How many modes does this data set have? ${list.join(", ")}`, `这组数据有几个众数？${list.join("、")}`],
          count,
          [count + 2, list.length, count + 1],
          [
            `${count === 1 ? "One value occurs" : `${count} values occur`} three times, which is the highest count.`,
            `有 ${count} 个值出现三次，是最高的次数。`,
          ],
        );
      },
    ),
  ],
  "assessing-visual-overlap-of-data-distributions": [
    skill(
      "the-width-of-the-overlap",
      ["The width of the overlap", "重叠部分的宽度"],
      [
        "Two ranges overlap from the greater of their low ends to the smaller of their high ends. If that start is beyond that end, the data sets do not overlap at all.",
        "两个范围从较大的下端重叠到较小的上端。如果这个起点超过了终点，两组数据就完全不重叠。",
      ],
      (rng) => {
        const a = rng.int(10, 50);
        const w = rng.int(8, 25);
        const b = a + rng.int(1, w + 6);
        const v = rng.int(8, 25);
        const answer = Math.max(0, Math.min(a + w, b + v) - b);
        return whole(
          [
            `The scores of class A run from ${a} to ${a + w}, and those of class B run from ${b} to ${b + v}. How wide is the part of the scale where the two ranges overlap?`,
            `A 班的分数从 ${a} 到 ${a + w}，B 班的分数从 ${b} 到 ${b + v}。两个范围重叠部分的宽度是多少？`,
          ],
          answer,
          [w, v, b - a],
          [
            `The overlap starts at ${b} and ends at ${Math.min(a + w, b + v)}${answer === 0 ? ", so there is none" : `, a width of ${answer}`}.`,
            `重叠从 ${b} 开始，到 ${Math.min(a + w, b + v)} 结束${answer === 0 ? "，所以没有重叠" : `，宽度是 ${answer}`}。`,
          ],
        );
      },
    ),
  ],
  "experimental-probability-for-compound-events": [
    skill(
      "at-least-one-from-the-counts",
      ["At least one, from the counts", "由次数求“至少一个”"],
      [
        "At least one head fails only when both coins are tails. So take the count of the double-tails outcome away from all the trials, and the rest are the successes.",
        "只有两枚都反面时才没有“至少一个正面”。所以用总次数减去两个反面的次数，剩下的就是成功次数。",
      ],
      (rng) => {
        const hh = rng.int(5, 30);
        const mix = rng.int(10, 50);
        const tt = rng.int(5, 30);
        const n = hh + mix + tt;
        return fraction(
          [
            `Two coins were tossed together ${n} times, giving two heads ${hh} times, one head ${mix} times and no heads ${tt} times. What is the experimental probability of at least one head?`,
            `两枚硬币一起抛了 ${n} 次，两个正面 ${hh} 次，一个正面 ${mix} 次，没有正面 ${tt} 次。至少一个正面的实验概率是多少？`,
          ],
          Q.of(hh + mix, n),
          [Q.of(hh, n), Q.of(mix, n), Q.of(3, 4)],
          [
            `$${hh} + ${mix} = ${hh + mix}$ of the ${n} tosses had a head, so it is $${frac(hh + mix, n)}$.`,
            `${n} 次中有 $${hh} + ${mix} = ${hh + mix}$ 次出现正面，所以是 $${frac(hh + mix, n)}$。`,
          ],
        );
      },
    ),
  ],
  "simulating-compound-events": [
    skill(
      "how-many-numbers-stand-for-success",
      ["How many numbers stand for success", "用多少个数代表成功"],
      [
        "A simulation matches a probability by giving success the same share of the random numbers. So the share of numbers that stand for success must equal the probability being simulated.",
        "模拟时要让代表成功的随机数所占份额等于概率。所以代表成功的数的比例，必须等于要模拟的概率。",
      ],
      (rng) => {
        const n = rng.pick([10, 20, 50, 100, 200]);
        const p = rng.int(1, 9) * 10;
        return whole(
          [
            `A simulation uses random whole numbers from 1 to ${n}, and an event has a probability of ${p}%. How many of the numbers should stand for the event happening?`,
            `模拟时用 1 到 ${n} 的随机整数，事件的概率是 ${p}%。应该用多少个数代表事件发生？`,
          ],
          (n * p) / 100,
          [p, n - (n * p) / 100, p / 10 === (n * p) / 100 ? p / 10 + 1 : p / 10],
          [
            `Each number is equally likely, so use $${p}\\%$ of the ${n} numbers, which is ${(n * p) / 100}.`,
            `每个数的可能性相同，所以取 ${n} 个数的 $${p}\\%$，即 ${(n * p) / 100} 个。`,
          ],
        );
      },
    ),
  ],
  "classifying-square-roots-and-cube-roots-as-rational-or-irrational": [
    skill(
      "the-smallest-multiplier-for-a-rational-cube-root",
      ["The smallest multiplier for a rational cube root", "使立方根为有理数的最小乘数"],
      [
        "A cube root is rational when every prime in the number appears a multiple of three times. So the multiplier supplies exactly the copies of each prime that are still missing.",
        "每个质因数出现的次数都是 3 的倍数时，立方根才是有理数。所以乘数正好补上每个质因数缺少的次数。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7]);
        const q = rng.pick([2, 3, 5, 7].filter((x) => x !== p));
        const form = rng.int(0, 2);
        const m = rng.int(1, 3);
        const base = form === 0 ? p : form === 1 ? p * p : p * q;
        const k = form === 0 ? p * p : form === 1 ? p : p * p * q * q;
        const a = m === 1 || (m % p !== 0 && m % q !== 0) ? base * m ** 3 : base;
        return whole(
          [
            `What is the smallest positive whole number $k$ for which $\\sqrt[3]{${a}k}$ is a whole number?`,
            `使 $\\sqrt[3]{${a}k}$ 为整数的最小正整数 $k$ 是多少？`,
          ],
          k,
          [base, form === 2 ? p * q * p : k * p, a],
          [
            `$${a} \\times ${k} = ${a * k}$, a perfect cube, and no smaller multiplier gives one.`,
            `$${a} \\times ${k} = ${a * k}$ 是完全立方数，更小的乘数都不行。`,
          ],
        );
      },
    ),
  ],
  "comparing-and-ordering-real-numbers": [
    skill(
      "integers-between-two-roots",
      ["Integers between two roots", "两个根之间的整数"],
      [
        "Square roots can be placed by looking at the perfect squares around them. So an integer lies between two roots exactly when its square lies between the numbers under the roots.",
        "平方根可以通过附近的完全平方数定位。所以一个整数在两个根之间，当且仅当它的平方在两个被开方数之间。",
      ],
      (rng) => {
        const lo = rng.int(2, 9);
        const n = rng.int(2, 8);
        const a = lo * lo + rng.int(1, 2 * lo - 1);
        const hi = lo + n;
        const b = hi * hi + rng.int(1, 2 * hi - 1);
        return whole(
          [`How many integers lie between $\\sqrt{${a}}$ and $\\sqrt{${b}}$?`, `$\\sqrt{${a}}$ 和 $\\sqrt{${b}}$ 之间有多少个整数？`],
          n,
          [n + 1, n - 1, b - a],
          [
            `$\\sqrt{${a}}$ is just above ${lo} and $\\sqrt{${b}}$ is just above ${hi}, so the integers run from ${lo + 1} to ${hi}.`,
            `$\\sqrt{${a}}$ 略大于 ${lo}，$\\sqrt{${b}}$ 略大于 ${hi}，所以整数从 ${lo + 1} 到 ${hi}。`,
          ],
        );
      },
    ),
  ],
  "estimating-expressions-with-irrational-numbers": [
    skill(
      "a-multiple-of-a-root",
      ["A multiple of a root", "根的倍数"],
      [
        "Rounding a root before multiplying can lose accuracy. Writing the multiple as a single root first, by squaring the multiplier, and then comparing with perfect squares gives a better estimate.",
        "先把根取整再相乘，可能损失精度。先把乘数平方，写成一个根，再与完全平方数比较，估计更准确。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const n = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]);
        const inside = k * k * n;
        const low = Math.floor(Math.sqrt(inside));
        return whole(
          [
            `$${k}\\sqrt{${n}}$ lies between two consecutive whole numbers. What is the smaller one?`,
            `$${k}\\sqrt{${n}}$ 在两个相邻整数之间。较小的那个是多少？`,
          ],
          low,
          [low + 1, k * Math.round(Math.sqrt(n)) === low ? low - 1 : k * Math.round(Math.sqrt(n)), k * n],
          [
            `$${k}\\sqrt{${n}} = \\sqrt{${inside}}$, and $${low}^{2} = ${low * low}$ while $${low + 1}^{2} = ${(low + 1) ** 2}$.`,
            `$${k}\\sqrt{${n}} = \\sqrt{${inside}}$，$${low}^{2} = ${low * low}$，$${low + 1}^{2} = ${(low + 1) ** 2}$。`,
          ],
        );
      },
    ),
  ],
  "estimating-and-comparing-real-world-quantities-using-scientific-notation": [
    skill(
      "how-long-it-takes",
      ["How long it takes", "需要多长时间"],
      [
        "Dividing a total by a rate gives a time, and in scientific notation this means dividing the leading numbers and subtracting the powers of ten. The size of the answer shows if it is sensible.",
        "总量除以速率得到时间，在科学记数法中就是前面的数相除、指数相减。答案的大小可以检验是否合理。",
      ],
      (rng) => {
        const q = rng.int(2, 4);
        const r = rng.int(2, 4);
        const m = rng.int(7, 12);
        const n = rng.int(2, 6);
        return chooseMath(
          rng,
          [
            `A file of $${q * r} \\times 10^{${m}}$ bytes downloads at $${r} \\times 10^{${n}}$ bytes per second. How many seconds does it take?`,
            `一个 $${q * r} \\times 10^{${m}}$ 字节的文件以每秒 $${r} \\times 10^{${n}}$ 字节下载。需要多少秒？`,
          ],
          `${q} \\times 10^{${m - n}}`,
          [`${q} \\times 10^{${m + n}}`, `${q * r * r} \\times 10^{${m - n}}`, `${q} \\times 10^{${m - n + 1}}`],
          [`$${q * r} \\div ${r} = ${q}$, and $${m} - ${n} = ${m - n}$.`, `$${q * r} \\div ${r} = ${q}$，$${m} - ${n} = ${m - n}$。`],
        );
      },
    ),
  ],
  "solving-equations-using-cube-roots": [
    skill(
      "a-cube-of-a-sum",
      ["A cube of a sum", "和的立方"],
      [
        "When an expression in parentheses is cubed, taking the cube root leaves the expression. Then one more step finds $x$, and a cube has only one real root, unlike a square.",
        "括号内的式子立方时，开立方后剩下这个式子。再走一步求出 $x$；与平方不同，立方只有一个实数根。",
      ],
      (rng) => {
        const a = rng.int(1, 15);
        const b = rng.int(1, 6);
        const neg = rng.bool();
        const value = neg ? -(b ** 3) : b ** 3;
        const root = neg ? -b : b;
        return integer(
          [`Solve $(x + ${a})^{3} = ${value}$.`, `解方程 $(x + ${a})^{3} = ${value}$。`],
          root - a,
          [root + a, -root - a, value - a],
          [`The cube root gives $x + ${a} = ${root}$, so $x = ${root - a}$.`, `开立方得 $x + ${a} = ${root}$，所以 $x = ${root - a}$。`],
        );
      },
    ),
  ],
  "solving-radical-equations-with-cube-roots": [
    skill(
      "a-coefficient-before-the-cube-root",
      ["A coefficient before the cube root", "立方根前的系数"],
      [
        "Isolate the cube root completely before cubing, which means taking away any added number and then dividing by the coefficient. Cubing too early would cube the coefficient as well.",
        "立方之前要把立方根完全分离：先减去加上的数，再除以系数。过早立方会把系数也立方。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const r = rng.int(-5, 6) || 2;
        const a = rng.int(1, 20);
        return integer(
          [`Solve $${k}\\sqrt[3]{x} + ${a} = ${k * r + a}$.`, `解方程 $${k}\\sqrt[3]{x} + ${a} = ${k * r + a}$。`],
          r ** 3,
          [r, k * r, (k * r) ** 3],
          [
            `$\\sqrt[3]{x} = ${r}$ after both steps, and cubing gives $x = ${r ** 3}$.`,
            `两步之后 $\\sqrt[3]{x} = ${r}$，立方得 $x = ${r ** 3}$。`,
          ],
        );
      },
    ),
  ],
  "finding-side-lengths-of-squares-and-cubes-from-area-or-volume": [
    skill(
      "the-volume-from-the-surface-area",
      ["The volume from the surface area", "由表面积求体积"],
      [
        "A cube has six equal square faces, so one face is a sixth of the surface area. Its square root gives the edge, and the cube of the edge gives the volume.",
        "立方体有六个相等的正方形面，所以一个面是表面积的六分之一。开平方得棱长，棱长的立方就是体积。",
      ],
      (rng) => {
        const s = rng.int(2, 30);
        return whole(
          [
            `A cube has a surface area of ${6 * s * s} square centimeters. What is its volume, in cubic centimeters?`,
            `一个立方体的表面积是 ${6 * s * s} 平方厘米。它的体积是多少立方厘米？`,
          ],
          s ** 3,
          [s * s, 6 * s, 6 * s ** 3],
          [
            `One face is ${s * s}, so the edge is ${s}, and $${s}^{3} = ${s ** 3}$.`,
            `一个面是 ${s * s}，棱长是 ${s}，$${s}^{3} = ${s ** 3}$。`,
          ],
        );
      },
    ),
  ],
  "determining-the-number-of-solutions-of-a-linear-equation": [
    skill(
      "reading-what-is-left",
      ["Reading what is left", "读懂剩下的式子"],
      [
        "When the variable cancels, what is left decides the matter. A true statement means every number works, a false one means no number does, and a surviving variable means exactly one solution.",
        "变量抵消后，由剩下的式子决定。成立表示每个数都是解，不成立表示没有解；变量还在则恰有一个解。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const a = rng.int(1, 40);
        const b = kind === 1 ? a + rng.int(1, 20) : a;
        const k = rng.int(2, 9);
        const text = kind === 2 ? `${k}x = ${a}` : `${a} = ${b}`;
        const options: [string, string][] = [
          ["Infinitely many solutions", "无穷多个解"],
          ["No solution", "没有解"],
          ["Exactly one solution", "恰有一个解"],
          ["Exactly two solutions", "恰有两个解"],
        ];
        return choose(
          rng,
          [
            `Solving a linear equation leads to $${text}$. How many solutions does the equation have?`,
            `解一元一次方程得到 $${text}$。这个方程有几个解？`,
          ],
          options[kind]!,
          options.filter((_, i) => i !== kind),
          kind === 0
            ? [`$${text}$ is always true, so every number is a solution.`, `$${text}$ 恒成立，所以每个数都是解。`]
            : kind === 1
              ? [`$${text}$ is false, so no number is a solution.`, `$${text}$ 不成立，所以没有解。`]
              : [`The variable remains, and $x = ${frac(a, k)}$ is the only solution.`, `变量还在，$x = ${frac(a, k)}$ 是唯一的解。`],
        );
      },
    ),
  ],
  "describing-the-functional-relationship-between-two-quantities-from-a-graph": [
    {
      ...skill(
        "the-fastest-part-of-a-trip",
        ["The fastest part of a trip", "行程中最快的一段"],
        [
          "On a graph of distance against time, a steeper part means more distance in the same time. In a table with equal time steps, the largest change between neighbors is the fastest part.",
          "在路程与时间的图像上，越陡表示相同时间走得越远。在时间间隔相同的表中，相邻变化最大的一段最快。",
        ],
        (rng) => {
          const steps = rng.sample([2, 4, 6, 9, 11, 13, 15, 18], 4) as number[];
          let run = rng.int(0, 9);
          const totals = [run, ...steps.map((s) => (run += s))];
          const best = steps.indexOf(Math.max(...steps));
          const hour = (i: number): [string, string] => [`Hour ${i + 1}`, `第 ${i + 1} 小时`];
          return choose(
            rng,
            [
              `A cyclist's distance from home, in km, at the start of each hour and at the end was ${totals.join(", ")}. In which hour was the cyclist fastest?`,
              `骑车人每小时开始时和最后离家的距离（千米）依次是 ${totals.join("、")}。哪一小时骑得最快？`,
            ],
            hour(best),
            [0, 1, 2, 3].filter((i) => i !== best).map(hour),
            [
              `The hourly changes are ${steps.join(", ")}, and ${steps[best]} is the largest.`,
              `每小时的变化是 ${steps.join("、")}，${steps[best]} 最大。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["describing-the-functional-relationship-between-two-quantities-from-a-graph#the-fastest-part-of-a-trip"],
    },
  ],
  "linear-functions-versus-nonlinear-functions": [
    skill(
      "the-missing-value-in-a-linear-table",
      ["The missing value in a linear table", "线性表中缺失的值"],
      [
        "A linear function changes by the same amount for each step of 1. A table may skip inputs, so divide the output change by the input change first, and then step to the missing value.",
        "线性函数每增加 1，变化量相同。表格可能跳过输入，所以先用输出变化除以输入变化，再走到缺失的值。",
      ],
      (rng) => {
        const m = rng.int(-9, 9) || 3;
        const b = rng.int(-9, 12);
        const x0 = rng.int(0, 3);
        const x1 = x0 + rng.int(2, 3);
        const x2 = x1 + rng.int(1, 3);
        const f = (x: number) => m * x + b;
        const table = `\\begin{array}{|c|c|c|c|}\\hline x & ${x0} & ${x1} & ${x2} \\\\ \\hline y & ${f(x0)} & ${f(x1)} & \\square \\\\ \\hline\\end{array}`;
        return integer(
          [
            `The table comes from a linear function. What value goes in the box? $$${table}$$`,
            `表格来自一个线性函数。方框里是什么值？$$${table}$$`,
          ],
          f(x2),
          [f(x1) + (f(x1) - f(x0)), f(x1) + x2 - x1, f(x2) + m],
          [
            `$y$ changes by $${f(x1) - f(x0)} \\div ${x1 - x0} = ${m}$ per step, and at $x = ${x2}$ it is ${f(x2)}.`,
            `每增加 1，$y$ 变化 $${f(x1) - f(x0)} \\div ${x1 - x0} = ${m}$，$x = ${x2}$ 时是 ${f(x2)}。`,
          ],
        );
      },
    ),
  ],
};
