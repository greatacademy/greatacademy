// A third knowledge point for the school topics on equations, inequalities, angles, rates, solids, data and real numbers,
// shared by Prealgebra and 7th and 8th Grade Math.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { choose, chooseMath, whole } from "./early-grades-more-kit.ts";
import { frac, fraction, integer, signed, skill } from "./third-kit.ts";

/** money writes a count of cents as dollars. */
const money = (cents: number) => (cents / 100).toFixed(2);

/** deeperMiddleSchoolThird2Points holds these third knowledge points, by topic. */
export const deeperMiddleSchoolThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "solving-linear-equations-with-fractional-coefficients": [
    skill(
      "a-fraction-of-a-number-in-a-story",
      ["A fraction of a number in a story", "故事中一个数的几分之几"],
      [
        "A story about part of an unknown number gives an equation with a fractional coefficient. Undo the addition first, and then multiply by the reciprocal of the fraction to find the number.",
        "关于未知数一部分的故事，会得到分数系数的方程。先还原加法，再乘分数的倒数，求出这个数。",
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
        return whole(
          [
            `When $${frac(n, d)}$ of a number is increased by ${add}, the result is ${n * k + add}. What is the number?`,
            `一个数的 $${frac(n, d)}$ 加上 ${add}，结果是 ${n * k + add}。这个数是多少？`,
          ],
          d * k,
          [n * k, n * k + add, d * k + add],
          [
            `$${frac(n, d)}x = ${n * k}$, so $x = ${n * k} \\times ${frac(d, n)} = ${d * k}$.`,
            `$${frac(n, d)}x = ${n * k}$，所以 $x = ${n * k} \\times ${frac(d, n)} = ${d * k}$。`,
          ],
        );
      },
    ),
  ],
  "solving-linear-equations-with-decimal-coefficients": [
    skill(
      "a-fee-and-a-decimal-rate",
      ["A fee and a decimal rate", "固定费用和小数单价"],
      [
        "Prices often give equations with decimal coefficients. Taking away the fee first leaves the part paid per unit, and multiplying through by 100 can clear the decimals before dividing.",
        "价格常常得到小数系数的方程。先减去固定费用，剩下按单位计算的部分；除之前可以同乘 100 去掉小数。",
      ],
      (rng) => {
        const rate = rng.int(5, 95) * 5;
        const fee = rng.int(1, 12) * 100;
        const n = rng.int(3, 40);
        const total = fee + rate * n;
        return whole(
          [
            `A taxi charges ${money(fee)} dollars plus ${money(rate)} dollars per mile. A ride costs ${money(total)} dollars. How many miles was it?`,
            `出租车起步价 ${money(fee)} 美元，每英里 ${money(rate)} 美元。一次乘车花了 ${money(total)} 美元。行驶了多少英里？`,
          ],
          n,
          [Math.round(total / rate), n + fee / 100, n - 1],
          [
            `$${money(total)} - ${money(fee)} = ${money(total - fee)}$, and $${money(total - fee)} \\div ${money(rate)} = ${n}$.`,
            `$${money(total)} - ${money(fee)} = ${money(total - fee)}$，$${money(total - fee)} \\div ${money(rate)} = ${n}$。`,
          ],
        );
      },
    ),
  ],
  "solving-linear-equations-by-clearing-a-rational-expression": [
    skill(
      "a-fraction-on-each-side",
      ["A fraction on each side", "两边各有一个分数"],
      [
        "With a fraction on each side, multiply both sides by both denominators to clear them. Every term in each numerator gets multiplied, so write the numerators in parentheses first.",
        "两边各有一个分数时，两边同乘两个分母来去分母。分子的每一项都要乘，所以先给分子加上括号。",
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
        return integer(
          [`Solve $${frac(top(a), b)} = ${frac(top(c), d)}$.`, `解方程 $${frac(top(a), b)} = ${frac(top(c), d)}$。`],
          x,
          [-x, x + 1, a - c],
          [
            `Multiply both sides by ${b * d}: $${d}(${top(a)}) = ${b}(${top(c)})$. Collecting terms gives $x = ${x}$.`,
            `两边同乘 ${b * d}：$${d}(${top(a)}) = ${b}(${top(c)})$。合并后得 $x = ${x}$。`,
          ],
        );
      },
    ),
  ],
  "solving-two-variable-equations": [
    skill(
      "solving-for-x-instead",
      ["Solving for x instead", "改为求 x"],
      [
        "Any letter in an equation can be isolated with the same steps. To solve for $x$, treat $y$ like a number: move it to the other side and then divide by the coefficient of $x$.",
        "方程中任何字母都可以用同样的步骤单独放一边。解 $x$ 时把 $y$ 当作数：移到另一边，再除以 $x$ 的系数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const c = rng.int(2, 30);
        return chooseMath(
          rng,
          [`Solve $${a}x + y = ${c}$ for $x$.`, `解 $${a}x + y = ${c}$，用 $y$ 表示 $x$。`],
          `x = ${frac(`${c} - y`, a)}`,
          [`x = ${frac(`${c} + y`, a)}`, `x = ${frac(c, a)} - y`, `x = ${c} - ${a}y`],
          [
            `$${a}x = ${c} - y$, and dividing the whole right side by ${a} gives the result.`,
            `$${a}x = ${c} - y$，整个右边除以 ${a} 就得到结果。`,
          ],
        );
      },
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
    skill(
      "how-many-values-work",
      ["How many values work", "有几个值符合"],
      [
        "An inequality has many solutions, and each candidate can be tested by substituting it. Pay attention to whether the boundary value counts, which depends on the symbol used.",
        "不等式有很多解，每个候选值都可以代入检验。要注意边界值是否算解，这取决于所用的符号。",
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const b = rng.int(1, 15);
        const bound = rng.int(-3, 8);
        const strict = rng.bool();
        const c = a * bound + b;
        const start = bound - rng.int(1, 3);
        const values = [start, start + 1, start + 2, start + 3, start + 4, start + 5];
        const count = values.filter((v) => (strict ? a * v + b > c : a * v + b >= c)).length;
        return whole(
          [
            `How many of the values ${values.join(", ")} are solutions of $${a}x + ${b} ${strict ? ">" : "\\ge"} ${c}$?`,
            `${values.join("、")} 中有几个是 $${a}x + ${b} ${strict ? ">" : "\\ge"} ${c}$ 的解？`,
          ],
          count,
          [6 - count, count + (strict ? 1 : -1), 6],
          [
            `The boundary is $x = ${bound}$, which ${strict ? "does not count" : "counts"}, so ${count} values work.`,
            `边界是 $x = ${bound}$，它${strict ? "不算" : "算"}解，所以有 ${count} 个值符合。`,
          ],
        );
      },
    ),
  ],
  "representing-solutions-to-inequalities-on-number-lines": [
    skill(
      "the-first-whole-number-on-the-graph",
      ["The first integer on the graph", "图像上的第一个整数"],
      [
        "An open circle leaves out its endpoint, so the first integer on the graph is one step past it. Dividing by a negative number reverses the arrow, which sets the direction of that step.",
        "空心圆不含端点，所以图像上的第一个整数还要走一步。除以负数会使箭头反向，也决定了这一步的方向。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const bound = rng.int(-9, 12);
        const b = rng.int(1, 20);
        const neg = rng.bool();
        const c = neg ? -a * bound + b : a * bound + b;
        const answer = neg ? bound - 1 : bound + 1;
        return integer(
          neg
            ? [`What is the greatest integer that solves $-${a}x + ${b} > ${c}$?`, `满足 $-${a}x + ${b} > ${c}$ 的最大整数是多少？`]
            : [`What is the smallest integer that solves $${a}x + ${b} > ${c}$?`, `满足 $${a}x + ${b} > ${c}$ 的最小整数是多少？`],
          answer,
          [bound, neg ? bound + 1 : bound - 1, -bound],
          [
            neg
              ? `The solutions are $x < ${bound}$, so the greatest integer is ${answer}.`
              : `The solutions are $x > ${bound}$, so the smallest integer is ${answer}.`,
            neg ? `解是 $x < ${bound}$，所以最大整数是 ${answer}。` : `解是 $x > ${bound}$，所以最小整数是 ${answer}。`,
          ],
        );
      },
    ),
  ],
  "further-solving-linear-inequalities": [
    skill(
      "negative-terms-on-both-sides",
      ["Negative terms on both sides", "两边都有负项"],
      [
        "Moving the variable terms so that the coefficient stays positive avoids dividing by a negative. Either way gives the same solutions, as long as the symbol reverses whenever a negative divides.",
        "移项时让系数保持为正，可以避免除以负数。两种做法结果相同，只要除以负数时不等号反向。",
      ],
      (rng) => {
        const c = rng.int(1, 6);
        const a = c + rng.int(1, 6);
        const k = a - c;
        const x = rng.int(-9, 9);
        const b = rng.int(1, 20);
        const d = k * x + b;
        const dText = d === 0 ? "" : signed(d);
        return chooseMath(
          rng,
          [`Solve $-${a}x${dText} \\le -${c}x + ${b}$.`, `解 $-${a}x${dText} \\le -${c}x + ${b}$。`],
          `x \\ge ${x}`,
          [`x \\le ${x}`, `x \\ge ${-x === x ? x + 1 : -x}`, `x \\le ${-x === x ? x + 1 : -x}`],
          [
            `$${d} - ${b} \\le ${k}x$ after adding $${a}x$ and taking away ${b}, so $x \\ge ${x}$.`,
            `两边加 $${a}x$，再减 ${b}，得 $${d} - ${b} \\le ${k}x$，所以 $x \\ge ${x}$。`,
          ],
        );
      },
    ),
  ],
  "graphing-linear-equations": [
    skill(
      "where-the-line-crosses-the-x-axis",
      ["Where the line crosses the x-axis", "直线与 x 轴的交点"],
      [
        "Every point on the $x$-axis has a second coordinate of 0. So putting $y = 0$ into the equation of a line and solving gives the place where the line crosses that axis.",
        "$x$ 轴上每个点的第二个坐标都是 0。所以把 $y = 0$ 代入直线方程求解，就得到直线与这条轴的交点。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const k = rng.int(-9, 12) || 3;
        const c = a * k;
        return integer(
          [
            `The line $${a}x + ${b}y = ${c}$ crosses the $x$-axis at $(x, 0)$. What is $x$?`,
            `直线 $${a}x + ${b}y = ${c}$ 与 $x$ 轴交于 $(x, 0)$。$x$ 是多少？`,
          ],
          k,
          [c, c - b, -k],
          [`With $y = 0$: $${a}x = ${c}$, so $x = ${k}$.`, `令 $y = 0$：$${a}x = ${c}$，所以 $x = ${k}$。`],
        );
      },
    ),
  ],
  "horizontal-and-vertical-lines": [
    skill(
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
            `The width is ${w} and the height is ${h}, and $${w} \\times ${h} = ${w * h}$.`,
            `宽是 ${w}，高是 ${h}，$${w} \\times ${h} = ${w * h}$。`,
          ],
        );
      },
    ),
  ],
  "measures-of-segments": [
    skill(
      "adding-segments-with-algebra",
      ["Adding segments with algebra", "用代数加线段"],
      [
        "When a point lies between two others, the two short segments add up to the long one. Writing this as an equation gives the unknown, and substituting it back gives each length.",
        "一点在另外两点之间时，两条短线段之和等于长线段。写成方程求出未知数，再代回去得到各段长度。",
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const c = rng.int(1, 5);
        const x = rng.int(2, 12);
        const b = rng.int(1, 9);
        const d = rng.int(1, 9);
        return whole(
          [
            `$B$ lies between $A$ and $C$. If $AB = ${a}x + ${b}$, $BC = ${c}x + ${d}$ and $AC = ${(a + c) * x + b + d}$, how long is $AB$?`,
            `$B$ 在 $A$ 和 $C$ 之间。若 $AB = ${a}x + ${b}$，$BC = ${c}x + ${d}$，$AC = ${(a + c) * x + b + d}$，$AB$ 有多长？`,
          ],
          a * x + b,
          [x, c * x + d === a * x + b ? a * x + b + 1 : c * x + d, (a + c) * x + b + d],
          [
            `$${a + c}x + ${b + d} = ${(a + c) * x + b + d}$ gives $x = ${x}$, so $AB = ${a * x + b}$.`,
            `$${a + c}x + ${b + d} = ${(a + c) * x + b + d}$，得 $x = ${x}$，所以 $AB = ${a * x + b}$。`,
          ],
        );
      },
    ),
  ],
  "congruent-segments": [
    skill(
      "the-whole-segment-from-its-midpoint",
      ["The whole segment from its midpoint", "由中点求整条线段"],
      [
        "A midpoint cuts a segment into two congruent parts, which gives an equation. Solving it is not the end, as the whole length still needs the value substituted and then doubled.",
        "中点把线段分成两条相等的部分，由此得到方程。解出来还没结束，要把值代入，再乘 2 才是整条长度。",
      ],
      (rng) => {
        const c = rng.int(1, 5);
        const a = c + rng.int(1, 4);
        const x = rng.int(2, 12);
        let d = rng.int(10, 40);
        if (d === (a - c) * x) d += 1;
        const b = d - (a - c) * x;
        const half = a * x + b;
        return whole(
          [
            `$M$ is the midpoint of $\\overline{AB}$, with $AM = ${a}x${signed(b)}$ and $MB = ${c}x + ${d}$. How long is $\\overline{AB}$?`,
            `$M$ 是 $\\overline{AB}$ 的中点，$AM = ${a}x${signed(b)}$，$MB = ${c}x + ${d}$。$\\overline{AB}$ 有多长？`,
          ],
          2 * half,
          [half, x, 2 * x],
          [
            `$${a}x${signed(b)} = ${c}x + ${d}$ gives $x = ${x}$, so $AM = ${half}$ and $AB = ${2 * half}$.`,
            `$${a}x${signed(b)} = ${c}x + ${d}$，得 $x = ${x}$，所以 $AM = ${half}$，$AB = ${2 * half}$。`,
          ],
        );
      },
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
            `$y$ changes by ${m} for each 1 of $x$, so at $x = ${x3}$ it is ${m * x3 + b}.`,
            `$x$ 每增加 1，$y$ 变化 ${m}，所以 $x = ${x3}$ 时 $y$ 是 ${m * x3 + b}。`,
          ],
        );
      },
    ),
  ],
  "congruent-angles": [
    skill(
      "the-whole-angle-from-its-bisector",
      ["The whole angle from its bisector", "由角平分线求整个角"],
      [
        "A bisector cuts an angle into two congruent angles, which gives an equation. The measure of the whole angle comes from substituting the solution and then doubling.",
        "角平分线把角分成两个相等的角，由此得到方程。把解代入后再乘 2，才是整个角的度数。",
      ],
      (rng) => {
        const c = rng.int(1, 5);
        const a = c + rng.int(1, 4);
        const x = rng.int(3, 12);
        const half = rng.int(15, 80);
        const b = half - a * x;
        const d = half - c * x;
        return whole(
          [
            `Ray $BD$ bisects $\\angle ABC$, with $m\\angle ABD = (${a}x${signed(b)})^\\circ$ and $m\\angle DBC = (${c}x${signed(d)})^\\circ$. What is $m\\angle ABC$, in degrees?`,
            `射线 $BD$ 平分 $\\angle ABC$，$m\\angle ABD = (${a}x${signed(b)})^\\circ$，$m\\angle DBC = (${c}x${signed(d)})^\\circ$。$m\\angle ABC$ 是多少度？`,
          ],
          2 * half,
          [half, x, 180 - half],
          [
            `Setting them equal gives $x = ${x}$, so each part is $${half}^\\circ$ and the whole is $${2 * half}^\\circ$.`,
            `令两者相等，得 $x = ${x}$，每部分是 $${half}^\\circ$，整个角是 $${2 * half}^\\circ$。`,
          ],
        );
      },
    ),
  ],
  "corresponding-angles": [
    skill(
      "the-value-that-makes-lines-parallel",
      ["The value that makes lines parallel", "使两线平行的值"],
      [
        "The converse also holds: when corresponding angles are equal, the lines are parallel. So setting the two expressions equal finds the value that makes the lines parallel.",
        "逆命题也成立：同位角相等时两直线平行。所以令两个表达式相等，就能求出使两线平行的值。",
      ],
      (rng) => {
        const c = rng.int(1, 5);
        const a = c + rng.int(1, 4);
        const x = rng.int(3, 15);
        const angle = rng.int(30, 150);
        const b = angle - a * x;
        const d = angle - c * x;
        return whole(
          [
            `A transversal crosses lines $\\ell$ and $m$. Corresponding angles measure $(${a}x${signed(b)})^\\circ$ and $(${c}x${signed(d)})^\\circ$. For what value of $x$ are $\\ell$ and $m$ parallel?`,
            `一条截线与直线 $\\ell$、$m$ 相交。同位角分别是 $(${a}x${signed(b)})^\\circ$ 和 $(${c}x${signed(d)})^\\circ$。$x$ 为何值时 $\\ell$ 与 $m$ 平行？`,
          ],
          x,
          [angle, x + a - c, 180 - angle],
          [`Corresponding angles must be equal: solving gives $x = ${x}$.`, `同位角必须相等：解得 $x = ${x}$。`],
        );
      },
    ),
  ],
  "consecutive-angles": [
    skill(
      "consecutive-angles-in-a-ratio",
      ["Consecutive angles in a ratio", "成比例的同旁内角"],
      [
        "Consecutive interior angles between parallel lines add up to 180 degrees. So a ratio splits 180 degrees into equal shares, and each angle is a number of those shares.",
        "两平行线间的同旁内角之和是 180 度。所以比把 180 度分成若干等份，每个角占若干份。",
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
                `Two consecutive interior angles between parallel lines are in the ratio ${p} : ${q}. What is the larger angle, in degrees?`,
                `两平行线间的同旁内角之比是 ${p} : ${q}。较大的角是多少度？`,
              ]
            : [
                `Two consecutive interior angles between parallel lines are in the ratio ${p} : ${q}. What is the smaller angle, in degrees?`,
                `两平行线间的同旁内角之比是 ${p} : ${q}。较小的角是多少度？`,
              ],
          (large ? q : p) * each,
          [(large ? p : q) * each, each, 90],
          [
            `One share is $180 \\div ${p + q} = ${each}$, and $${large ? q : p} \\times ${each} = ${(large ? q : p) * each}$.`,
            `一份是 $180 \\div ${p + q} = ${each}$，$${large ? q : p} \\times ${each} = ${(large ? q : p) * each}$。`,
          ],
        );
      },
    ),
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
            `These are the five-number summaries of two classes. A: ${a}. B: ${b}. For which classes can you be sure that at least half of the students scored ${x} or more?`,
            `这是两个班的五数概括。A 班：${a}。B 班：${b}。可以确定哪些班至少一半的学生得分不低于 ${x}？`,
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
                `A data set has a mean absolute deviation of ${mad}. Every value is multiplied by ${k}. What is the new mean absolute deviation?`,
                `一组数据的平均绝对偏差是 ${mad}。每个值都乘 ${k}。新的平均绝对偏差是多少？`,
              ]
            : [
                `A data set has a mean absolute deviation of ${mad}. Every value is increased by ${k}. What is the new mean absolute deviation?`,
                `一组数据的平均绝对偏差是 ${mad}。每个值都加 ${k}。新的平均绝对偏差是多少？`,
              ],
          mul ? mad * k : mad,
          mul ? [mad, mad + k, mad * k + k] : [mad + k, mad * k, k],
          mul
            ? [
                `All gaps are ${k} times as wide, so it is $${mad} \\times ${k} = ${mad * k}$.`,
                `所有间隔都变成 ${k} 倍，所以是 $${mad} \\times ${k} = ${mad * k}$。`,
              ]
            : [
                `Adding ${k} moves every value equally, so the gaps and the deviation stay at ${mad}.`,
                `加 ${k} 使每个值移动相同的距离，所以间隔和偏差仍是 ${mad}。`,
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
            `A test has a mean of ${mean} and a standard deviation of ${sd}. A student scores ${mean + k * sd}. How many standard deviations above the mean is this?`,
            `一次测验的平均数是 ${mean}，标准差是 ${sd}。一名学生得 ${mean + k * sd} 分。这比平均数高几个标准差？`,
          ],
          k,
          [k * sd, k + 1, Math.round((mean + k * sd) / sd)],
          [
            `The score is ${k * sd} above the mean, and $${k * sd} \\div ${sd} = ${k}$.`,
            `比平均数高 ${k * sd} 分，$${k * sd} \\div ${sd} = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "finding-unit-prices": [
    skill(
      "the-best-buy",
      ["The best buy", "最划算的选择"],
      [
        "A larger pack is not always cheaper per item. Comparing prices means finding each unit price first, and the lowest unit price is the best buy whatever the pack size.",
        "大包装不一定每件更便宜。比较价格要先求单价，单价最低的最划算，不管包装多大。",
      ],
      (rng) => {
        const [u1, u2, u3, u4] = rng.sample([40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90], 4) as [number, number, number, number];
        const sorted = [u1, u2, u3, u4].sort((a, b) => a - b);
        const pack = (u: number): [string, string] => {
          const n = rng.pick([2, 3, 4, 5, 6, 8, 10, 12]);
          return [`${n} cans for ${money(n * u)} dollars`, `${n} 罐 ${money(n * u)} 美元`];
        };
        const best = sorted[0]!;
        return choose(rng, ["Which offer has the lowest price per can?", "哪种优惠每罐最便宜？"], pack(best), sorted.slice(1).map(pack), [
          `Divide each price by its number of cans. The lowest result is ${money(best)} dollars per can.`,
          `每个价格除以罐数。最低的是每罐 ${money(best)} 美元。`,
        ]);
      },
    ),
  ],
  "unit-rates-associated-with-ratios-of-mixed-numbers": [
    skill(
      "pounds-for-one-dollar",
      ["Pounds for one dollar", "一美元能买多少磅"],
      [
        "A price can be read two ways, as dollars per pound or as pounds per dollar. Writing the mixed numbers as improper fractions first makes either division routine.",
        "价格有两种读法：每磅多少美元，或每美元多少磅。先把带分数化成假分数，哪种除法都很常规。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = rng.pick([2, 3, 4]);
        const c = rng.int(2, 9);
        const d = rng.pick([2, 4, 5]);
        const pounds = Q.of(a * b + 1, b);
        const dollars = Q.of(c * d + 1, d);
        return fraction(
          [
            `$${a}${frac(1, b)}$ pounds of apples cost $${c}${frac(1, d)}$ dollars. How many pounds can be bought per dollar?`,
            `$${a}${frac(1, b)}$ 磅苹果售价 $${c}${frac(1, d)}$ 美元。每美元能买多少磅？`,
          ],
          pounds.div(dollars),
          [dollars.div(pounds), pounds.mul(dollars), pounds],
          [
            `Pounds divided by dollars: $${frac(a * b + 1, b)} \\div ${frac(c * d + 1, d)}$.`,
            `磅数除以美元数：$${frac(a * b + 1, b)} \\div ${frac(c * d + 1, d)}$。`,
          ],
        );
      },
    ),
  ],
  "solving-unit-rate-problems-using-ratios-of-mixed-numbers": [
    skill(
      "how-much-faster",
      ["How much faster", "快多少"],
      [
        "Two rates can be compared only after each is written per one unit. Subtracting them then says how much more one covers in a single unit, and subtracting the raw distances would not.",
        "两个比率要先都写成每单位，才能比较。相减后得到一方每单位多走多少；直接减路程则不行。",
      ],
      (rng) => {
        const r1 = rng.int(4, 9);
        const r2 = r1 - rng.int(1, 3);
        const t1 = Q.of(2 * rng.int(1, 4) + 1, 2);
        const t2 = Q.of(4 * rng.int(1, 4) + 1, 4);
        const d1 = t1.mul(Q.of(r1));
        const d2 = t2.mul(Q.of(r2));
        return whole(
          [
            `Ann walks $${d1.toLatex()}$ miles in $${t1.toLatex()}$ hours, and Ben walks $${d2.toLatex()}$ miles in $${t2.toLatex()}$ hours. How many more miles per hour does Ann walk?`,
            `Ann $${t1.toLatex()}$ 小时走 $${d1.toLatex()}$ 英里，Ben $${t2.toLatex()}$ 小时走 $${d2.toLatex()}$ 英里。Ann 每小时比 Ben 多走多少英里？`,
          ],
          r1 - r2,
          [r1, r2, r1 + r2],
          [
            `Ann's rate is ${r1} miles per hour and Ben's is ${r2}, and $${r1} - ${r2} = ${r1 - r2}$.`,
            `Ann 每小时 ${r1} 英里，Ben 每小时 ${r2} 英里，$${r1} - ${r2} = ${r1 - r2}$。`,
          ],
        );
      },
    ),
  ],
  "interpreting-products-and-quotients-of-rational-numbers": [
    skill(
      "going-back-in-time",
      ["Going back in time", "回到过去"],
      [
        "A negative rate times a negative time gives a positive change. It says that a falling quantity was higher in the past, which is what the sign rule means in a story.",
        "负的变化率乘负的时间得正的变化。它表示下降的量在过去更高，这就是符号规则在故事中的含义。",
      ],
      (rng) => {
        const a = rng.int(2, 20);
        const b = rng.int(2, 15);
        return whole(
          [
            `A tank's level changes by $-${a}$ liters each day. How many liters higher was the level ${b} days ago than it is now?`,
            `水箱的水量每天变化 $-${a}$ 升。${b} 天前的水量比现在多多少升？`,
          ],
          a * b,
          [a + b, a, b],
          [
            `$(-${a}) \\times (-${b}) = ${a * b}$, so it was ${a * b} liters higher.`,
            `$(-${a}) \\times (-${b}) = ${a * b}$，所以多 ${a * b} 升。`,
          ],
        );
      },
    ),
  ],
  "solving-multistep-problems-with-rational-numbers": [
    skill(
      "the-mean-of-signed-values",
      ["The mean of signed values", "带符号数值的平均数"],
      [
        "A mean is the sum divided by the count, and negative values reduce the sum. Ignoring their signs is the usual slip, and it gives a mean that is too high.",
        "平均数是总和除以个数，负数会使总和减小。忽略符号是常见错误，会使平均数偏高。",
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
        return integer(
          [
            `The temperatures on ${n} days were ${xs.join(", ")} degrees. What was the mean temperature, in degrees?`,
            `${n} 天的气温分别是 ${xs.join("、")} 度。平均气温是多少度？`,
          ],
          mean,
          [Math.round(abs / n), total, -mean],
          [`The sum is ${total}, and $${total} \\div ${n} = ${mean}$.`, `总和是 ${total}，$${total} \\div ${n} = ${mean}$。`],
        );
      },
    ),
  ],
  "volumes-of-triangular-prisms": [
    skill(
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
    skill(
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
  ],
  "calculating-means-from-histograms": [
    skill(
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
            `A histogram has classes ${start} to ${ups[0]}, ${ups[0]} to ${ups[1]} and ${ups[1]} to ${ups[2]}, with frequencies ${fs.join(", ")}. What is the greatest possible total of the values?`,
            `直方图的组为 ${start} 到 ${ups[0]}、${ups[0]} 到 ${ups[1]}、${ups[1]} 到 ${ups[2]}，频数为 ${fs.join("、")}。这些数据的总和最大可能是多少？`,
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
    skill(
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
