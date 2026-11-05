// A third knowledge point for the foundations topics that Prealgebra and Algebra Foundations share with Algebra I.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { choose, chooseMath, whole } from "./early-grades-more-kit.ts";
import { frac, fraction, integer, signed, skill } from "./third-kit.ts";

/** deeperAlgebraThird2Points holds these third knowledge points, by topic. */
export const deeperAlgebraThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "decimal-arithmetic": [
    skill(
      "dividing-by-a-decimal",
      ["Dividing by a decimal", "除以小数"],
      [
        "Moving the decimal point of both numbers by the same number of places multiplies them by the same power of ten, so the quotient does not change. This turns the divisor into a whole number.",
        "把两个数的小数点移动相同的位数，相当于乘同一个 10 的幂，商不变。这样除数就变成了整数。",
      ],
      (rng) => {
        const divisor = rng.int(2, 95);
        const q = rng.int(2, 60);
        const places = rng.pick([1, 2]);
        const scale = 10 ** places;
        return whole(
          [
            `Evaluate $${(divisor * q) / scale} \\div ${(divisor / scale).toFixed(places)}$.`,
            `计算 $${(divisor * q) / scale} \\div ${(divisor / scale).toFixed(places)}$。`,
          ],
          q,
          [q * scale, q * 10 ** (places + 1), q + 1],
          [
            `Multiply both by ${scale}: $${divisor * q} \\div ${divisor} = ${q}$.`,
            `两个数都乘 ${scale}：$${divisor * q} \\div ${divisor} = ${q}$。`,
          ],
        );
      },
    ),
  ],
  "powers-of-rational-numbers": [
    skill(
      "a-negative-fraction-to-a-power",
      ["A negative fraction to a power", "负分数的幂"],
      [
        "An odd power of a negative number stays negative, and an even power is positive. The numerator and the denominator are each raised to the power, so settle the sign first.",
        "负数的奇数次幂仍是负数，偶数次幂是正数。分子和分母都要乘方，所以先确定符号。",
      ],
      (rng) => {
        const [n, d] = rng.pick<[number, number]>([
          [1, 2],
          [1, 3],
          [2, 3],
          [3, 2],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 2],
          [5, 3],
          [1, 5],
          [4, 3],
          [2, 7],
          [3, 7],
          [5, 4],
        ]);
        const e = rng.pick([2, 3, 4]);
        const size = Q.of(n ** e, d ** e);
        const answer = e % 2 === 0 ? size : Q.of(-(n ** e), d ** e);
        const other = e % 2 === 0 ? Q.of(-(n ** e), d ** e) : size;
        return fraction(
          [`Evaluate $\\left(-${frac(n, d)}\\right)^{${e}}$.`, `计算 $\\left(-${frac(n, d)}\\right)^{${e}}$。`],
          answer,
          [other, Q.of(n * e, d * e), Q.of(n ** e, d)],
          [
            `The power is ${e % 2 === 0 ? "even, so the result is positive" : "odd, so the result is negative"}, with size $${size.toLatex()}$.`,
            `指数是${e % 2 === 0 ? "偶数，所以结果为正" : "奇数，所以结果为负"}，大小是 $${size.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "rationalizing-denominators": [
    skill(
      "a-coefficient-beside-the-root",
      ["A coefficient beside the root", "根号旁的系数"],
      [
        "When the denominator is a number times a root, only the root needs removing, so multiply the top and bottom by that root alone. Then cancel any common factor that appears.",
        "分母是数乘根号时，只需去掉根号，所以分子分母只乘这个根号。然后约去出现的公因数。",
      ],
      (rng) => {
        const r = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
        const c = rng.int(2, 6);
        const k = rng.int(1, 5);
        const top = c * r * k;
        return chooseMath(
          rng,
          [
            `Rationalize the denominator and simplify: $${frac(top, `${c}\\sqrt{${r}}`)}$.`,
            `将分母有理化并化简：$${frac(top, `${c}\\sqrt{${r}}`)}$。`,
          ],
          k === 1 ? `\\sqrt{${r}}` : `${k}\\sqrt{${r}}`,
          [`${c * k}\\sqrt{${r}}`, `${frac(k, r)}\\sqrt{${r}}`, `${top}\\sqrt{${r}}`],
          [
            `Multiply by $${frac(`\\sqrt{${r}}`, `\\sqrt{${r}}`)}$: the bottom becomes ${c * r}, and $${top} \\div ${c * r} = ${k}$.`,
            `乘 $${frac(`\\sqrt{${r}}`, `\\sqrt{${r}}`)}$：分母变成 ${c * r}，$${top} \\div ${c * r} = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "adding-and-subtracting-radicals": [
    skill(
      "a-perimeter-with-radicals",
      ["A perimeter with radicals", "含根号的周长"],
      [
        "Radical lengths add just like like terms once they are simplified to the same root. So simplify each side first, and then add the coefficients of the matching root.",
        "根号长度化简成同一个根后，可以像同类项一样相加。所以先化简每条边，再把相同根号的系数相加。",
      ],
      (rng) => {
        const r = rng.pick([2, 3, 5, 6, 7]);
        const a = rng.int(2, 5);
        const b = rng.int(2, 5);
        const total = 2 * (a + b);
        return chooseMath(
          rng,
          [
            `A rectangle has sides $\\sqrt{${a * a * r}}$ and $\\sqrt{${b * b * r}}$. What is its perimeter?`,
            `长方形的两边是 $\\sqrt{${a * a * r}}$ 和 $\\sqrt{${b * b * r}}$。周长是多少？`,
          ],
          `${total}\\sqrt{${r}}`,
          [`${a + b}\\sqrt{${r}}`, `2\\sqrt{${(a * a + b * b) * r}}`, `${total}\\sqrt{${2 * r}}`],
          [
            `The sides are $${a}\\sqrt{${r}}$ and $${b}\\sqrt{${r}}$, and $2(${a} + ${b}) = ${total}$.`,
            `两边是 $${a}\\sqrt{${r}}$ 和 $${b}\\sqrt{${r}}$，$2(${a} + ${b}) = ${total}$。`,
          ],
        );
      },
    ),
  ],
  "one-step-equations-addition": [
    skill(
      "stories-with-one-step-equations",
      ["Stories with one-step equations", "一步方程的故事"],
      [
        "A story about a change gives an equation with one unknown. Writing the start plus the change equal to the end, and undoing the change, finds a start that may be negative.",
        "关于变化的故事给出一个含未知数的方程。写出“开始加变化等于结果”，再还原变化，得到的开始值可能是负数。",
      ],
      (rng) => {
        const rise = rng.int(3, 25);
        const end = rng.int(-12, 15);
        const start = end - rise;
        return integer(
          [
            `The temperature rose by ${rise} degrees and is now ${end} degrees. What was the temperature before the rise?`,
            `气温上升了 ${rise} 度，现在是 ${end} 度。上升前是多少度？`,
          ],
          start,
          [end + rise, rise - end, -start],
          [
            `$x + ${rise} = ${end}$, so $x = ${end} - ${rise} = ${start}$.`,
            `$x + ${rise} = ${end}$，所以 $x = ${end} - ${rise} = ${start}$。`,
          ],
        );
      },
    ),
  ],
  "one-step-equations-multiplication": [
    skill(
      "a-fraction-times-the-unknown",
      ["A fraction times the unknown", "分数乘未知数"],
      [
        "When a fraction multiplies the unknown, multiply both sides by its reciprocal. This is one step, and it replaces the two steps of dividing by the numerator and multiplying by the denominator.",
        "分数乘未知数时，两边同乘它的倒数。这是一步，代替了除以分子再乘分母两步。",
      ],
      (rng) => {
        const [n, d] = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 6],
          [3, 7],
          [5, 7],
          [3, 8],
          [7, 8],
          [4, 9],
          [7, 9],
        ]);
        const k = rng.int(-12, 12) || 5;
        return integer(
          [`Solve $${frac(n, d)}x = ${n * k}$.`, `解方程 $${frac(n, d)}x = ${n * k}$。`],
          d * k,
          [n * k * n, k, n * k - d],
          [`Multiply both sides by $${frac(d, n)}$: $x = ${d * k}$.`, `两边同乘 $${frac(d, n)}$：$x = ${d * k}$。`],
        );
      },
    ),
  ],
  "inequalities-and-solutions": [
    skill(
      "counting-whole-numbers-that-work",
      ["Counting the integers that work", "数符合条件的整数"],
      [
        "A pair of inequalities keeps only the numbers between two bounds. The symbols decide whether those bounds count, so check each end before counting the integers in between.",
        "一对不等式只留下两个界之间的数。符号决定界本身算不算，所以数中间的整数之前先检查两端。",
      ],
      (rng) => {
        const low = rng.int(-12, 6);
        const span = rng.int(3, 15);
        const lowIn = rng.bool();
        const highIn = rng.bool();
        const count = span - 1 + (lowIn ? 1 : 0) + (highIn ? 1 : 0);
        const expr = `${low} ${lowIn ? "\\le" : "<"} x ${highIn ? "\\le" : "<"} ${low + span}`;
        return whole(
          [`How many integers satisfy $${expr}$?`, `有多少个整数满足 $${expr}$？`],
          count,
          [span, span + 1, span - 1, span + 2],
          [
            `${lowIn ? "The lower bound counts" : "The lower bound does not count"} and ${highIn ? "the upper bound counts" : "the upper bound does not count"}, which leaves ${count}.`,
            `下界${lowIn ? "算" : "不算"}，上界${highIn ? "算" : "不算"}，所以有 ${count} 个。`,
          ],
        );
      },
    ),
  ],
  "systems-of-linear-equations": [
    skill(
      "the-value-that-makes-a-point-a-solution",
      ["The value that makes a point a solution", "使一点成为解的值"],
      [
        "A solution of a system satisfies every equation. So one equation with a known point can reveal a missing coefficient, as substituting the coordinates leaves one unknown.",
        "方程组的解满足每个方程。所以用已知点代入含未知系数的方程，就只剩一个未知数，可以求出它。",
      ],
      (rng) => {
        const x = rng.int(-6, 6) || 2;
        const y = rng.int(-6, 6) || 3;
        const a = rng.int(2, 5);
        const k = rng.int(-6, 6) || 2;
        const c = a * x + y;
        const d = k * x - y;
        return integer(
          [
            `The point $(${x}, ${y})$ is a solution of $${a}x + y = ${c}$ and $kx - y = ${d}$. What is $k$?`,
            `点 $(${x}, ${y})$ 是 $${a}x + y = ${c}$ 和 $kx - y = ${d}$ 的解。$k$ 是多少？`,
          ],
          k,
          [-k, a, k + 1],
          [
            `Substitute: $${x}k - (${y}) = ${d}$, so $${x}k = ${d + y}$ and $k = ${k}$.`,
            `代入：$${x}k - (${y}) = ${d}$，所以 $${x}k = ${d + y}$，$k = ${k}$。`,
          ],
        );
      },
    ),
  ],
  "vertical-angles": [
    skill(
      "the-angles-around-a-crossing",
      ["The angles around a crossing", "交点周围的角"],
      [
        "Two crossing lines make four angles totaling 360 degrees, in two equal pairs. So knowing the sum of a vertical pair gives each of the four angles directly.",
        "两条相交直线形成四个角，总和 360 度，并且两两相等。所以知道一对对顶角的和，就能直接得到四个角。",
      ],
      (rng) => {
        const each = rng.int(16, 80);
        const asked = rng.bool();
        return whole(
          asked
            ? [
                `Two lines cross, and one pair of vertical angles has a sum of ${2 * each} degrees. What is the measure of each of the other two angles, in degrees?`,
                `两条直线相交，一对对顶角的和是 ${2 * each} 度。另外两个角各是多少度？`,
              ]
            : [
                `Two lines cross, and one pair of vertical angles has a sum of ${2 * each} degrees. What is the sum of the other two angles, in degrees?`,
                `两条直线相交，一对对顶角的和是 ${2 * each} 度。另外两个角的和是多少度？`,
              ],
          asked ? 180 - each : 360 - 2 * each,
          asked ? [each, 180 - 2 * each, 360 - 2 * each] : [2 * each, 180 - each, 180 - 2 * each],
          [
            `Each angle of the pair is ${each}, so each other angle is ${180 - each}, and the two together are ${360 - 2 * each}.`,
            `这一对每个角是 ${each}，所以其余每个角是 ${180 - each}，两个合起来是 ${360 - 2 * each}。`,
          ],
        );
      },
    ),
  ],
  "classifying-triangles": [
    skill(
      "what-a-triangle-must-be",
      ["What a triangle must be", "三角形一定是什么"],
      [
        "A triangle has one name by sides and one by angles, and some pairs cannot happen. An equilateral triangle has three 60 degree angles, so it can be neither right nor obtuse.",
        "三角形按边和按角各有一个名称，有些组合不可能。等边三角形三个角都是 60 度，所以不可能是直角或钝角三角形。",
      ],
      (rng) => {
        const impossible: [string, string][] = [
          ["An equilateral right triangle", "等边直角三角形"],
          ["An equilateral obtuse triangle", "等边钝角三角形"],
          ["A right triangle with two obtuse angles", "有两个钝角的直角三角形"],
          ["A triangle with two right angles", "有两个直角的三角形"],
        ];
        const possible: [string, string][] = [
          ["An isosceles right triangle", "等腰直角三角形"],
          ["An isosceles obtuse triangle", "等腰钝角三角形"],
          ["A scalene right triangle", "不等边直角三角形"],
          ["A scalene obtuse triangle", "不等边钝角三角形"],
          ["An isosceles acute triangle", "等腰锐角三角形"],
          ["A scalene acute triangle", "不等边锐角三角形"],
          ["An equilateral acute triangle", "等边锐角三角形"],
        ];
        const bad = rng.pick(impossible);
        return choose(rng, ["Which of these triangles cannot exist?", "下面哪种三角形不可能存在？"], bad, rng.sample(possible, 3), [
          `${bad[0]} cannot exist, as its angles or sides would break the rule that the angles total 180 degrees.`,
          `${bad[1]}不可能存在，因为它的角或边违反了内角和是 180 度的规律。`,
        ]);
      },
    ),
  ],
  "isosceles-triangles": [
    skill(
      "two-cases-for-the-given-angle",
      ["Two cases for the given angle", "已知角的两种情况"],
      [
        "If the known angle of an isosceles triangle could be a base angle or the vertex, both cases must be tried. An angle of 90 degrees or more can only be the vertex, because two of them would be too large.",
        "如果等腰三角形的已知角可能是底角也可能是顶角，两种情况都要试。90 度或以上的角只能是顶角，因为两个这样的角太大了。",
      ],
      (rng) => {
        const even = rng.int(5, 40) * 2;
        const e = 180 - 2 * even;
        const v = (180 - even) / 2;
        const answer = Math.max(even, e, v);
        return whole(
          [
            `One angle of an isosceles triangle is $${even}^\\circ$. What is the greatest possible measure of another angle of the triangle, in degrees?`,
            `等腰三角形的一个角是 $${even}^\\circ$。另一个角最大可能是多少度？`,
          ],
          answer,
          [180 - even, 2 * even, Math.min(e, v)],
          [
            `As a base angle, it leaves a vertex of $${e}^\\circ$. As the vertex, it leaves base angles of $${v}^\\circ$. The greatest measure is $${answer}^\\circ$.`,
            `作为底角，顶角是 $${e}^\\circ$。作为顶角，底角是 $${v}^\\circ$。最大的是 $${answer}^\\circ$。`,
          ],
        );
      },
    ),
  ],
  "area-of-parallelograms": [
    skill(
      "two-heights-of-one-parallelogram",
      ["Two heights of one parallelogram", "同一平行四边形的两条高"],
      [
        "A parallelogram has one area but two base and height pairs. So the two products are equal, and any three of the four lengths give the last one.",
        "平行四边形只有一个面积，却有两组底和高。所以两个乘积相等，四个长度中知道三个就能求出第四个。",
      ],
      (rng) => {
        const area = rng.int(2, 15) * rng.pick([12, 24, 36, 60]);
        const divisors = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20].filter((n) => area % n === 0);
        const [b1, b2] = rng.sample(divisors, 2) as [number, number];
        const h1 = area / b1;
        const h2 = area / b2;
        return whole(
          [
            `A parallelogram has sides of ${b1} cm and ${b2} cm. The height to the ${b1} cm side is ${h1} cm. What is the height to the ${b2} cm side, in cm?`,
            `平行四边形两边长 ${b1} 厘米和 ${b2} 厘米。到 ${b1} 厘米边的高是 ${h1} 厘米。到 ${b2} 厘米边的高是多少厘米？`,
          ],
          h2,
          [h1, area, b1 + b2],
          [
            `The area is $${b1} \\times ${h1} = ${area}$, and $${area} \\div ${b2} = ${h2}$.`,
            `面积是 $${b1} \\times ${h1} = ${area}$，$${area} \\div ${b2} = ${h2}$。`,
          ],
        );
      },
    ),
  ],
  "area-of-trapezoids": [
    skill(
      "the-missing-base-of-a-trapezoid",
      ["The missing base of a trapezoid", "梯形缺失的底"],
      [
        "Twice the area divided by the height gives the sum of the two bases. Taking away the known base leaves the other, and forgetting to double the area is the usual slip.",
        "面积的两倍除以高，得到两底之和。减去已知的底，就是另一个底；忘记把面积乘 2 是常见错误。",
      ],
      (rng) => {
        const h = rng.int(2, 12);
        const b1 = rng.int(2, 20);
        const b2 = rng.int(2, 10) * 2 - (b1 % 2 === 0 ? 0 : 1);
        const area = ((b1 + b2) * h) / 2;
        const shownArea = `${area}`;
        return whole(
          [
            `A trapezoid has area ${shownArea} square cm and height ${h} cm. One base is ${b1} cm. How long is the other base, in cm?`,
            `梯形的面积是 ${shownArea} 平方厘米，高 ${h} 厘米，一条底长 ${b1} 厘米。另一条底长多少厘米？`,
          ],
          b2,
          [b1 + b2, Number.isInteger(area / h) ? area / h : b2 + 1, b2 + b1 + 1],
          [
            `$2 \\times ${shownArea} \\div ${h} = ${b1 + b2}$, and $${b1 + b2} - ${b1} = ${b2}$.`,
            `$2 \\times ${shownArea} \\div ${h} = ${b1 + b2}$，$${b1 + b2} - ${b1} = ${b2}$。`,
          ],
        );
      },
    ),
  ],
  "composite-shapes": [
    skill(
      "subtracting-a-hole",
      ["Subtracting a hole", "减去一个洞"],
      [
        "A shape with a piece removed has the area of the whole minus the area of the piece. This is often quicker than cutting what remains into smaller rectangles.",
        "挖去一块的图形，面积是整体减去这一块。这常常比把剩下的部分切成小长方形更快。",
      ],
      (rng) => {
        const w = rng.int(8, 30);
        const h = rng.int(8, 30);
        const a = rng.int(2, w - 3);
        const b = rng.int(2, h - 3);
        const path = rng.int(1, 2);
        const area = w * h - a * b * path;
        return whole(
          path === 1
            ? [
                `A rectangular garden is ${w} m by ${h} m. A pond of ${a} m by ${b} m is inside it. What area of the garden is not pond, in square meters?`,
                `长方形花园长 ${w} 米、宽 ${h} 米，里面有一个 ${a} 米 × ${b} 米的池塘。花园中不是池塘的面积是多少平方米？`,
              ]
            : [
                `A rectangular garden is ${w} m by ${h} m. A corner of ${a} m by ${b} m is paved, and so is another piece of the same size. What area is not paved, in square meters?`,
                `长方形花园长 ${w} 米、宽 ${h} 米。一角 ${a} 米 × ${b} 米铺了砖，另一块同样大小的地方也铺了砖。没铺砖的面积是多少平方米？`,
              ],
          area,
          [w * h, (w - a) * (h - b), 2 * (w + h)],
          [
            `$${w} \\times ${h} - ${path === 1 ? "" : "2 \\times "}${a} \\times ${b} = ${area}$.`,
            `$${w} \\times ${h} - ${path === 1 ? "" : "2 \\times "}${a} \\times ${b} = ${area}$。`,
          ],
        );
      },
    ),
  ],
  "comparing-data-sets": [
    skill(
      "the-mean-of-two-groups-together",
      ["The mean of two groups together", "两组合起来的平均数"],
      [
        "The mean of two groups together is not the average of their means unless they are equal in size. Use each group's total, which is its mean times its size, and divide by everyone.",
        "两组合起来的平均数，只有人数相等时才是两个平均数的平均。要用每组的总和，即平均数乘人数，再除以总人数。",
      ],
      (rng) => {
        const n1 = rng.int(2, 12);
        const n2 = n1 + rng.int(1, 12);
        const combined = rng.int(50, 90);
        const d = rng.int(1, 6);
        const m1 = combined + d * n2;
        const m2 = combined - d * n1;
        return whole(
          [
            `A group of ${n1} has a mean score of ${m1}, and a group of ${n2} has a mean score of ${m2}. What is the mean score of all ${n1 + n2} together?`,
            `${n1} 人一组的平均分是 ${m1}，${n2} 人一组的平均分是 ${m2}。这 ${n1 + n2} 人合起来的平均分是多少？`,
          ],
          combined,
          [Math.round((m1 + m2) / 2) === combined ? combined + 1 : Math.round((m1 + m2) / 2), m1, m2],
          [
            `The total is $${n1} \\times ${m1} + ${n2} \\times ${m2} = ${n1 * m1 + n2 * m2}$, and dividing by ${n1 + n2} gives ${combined}.`,
            `总分是 $${n1} \\times ${m1} + ${n2} \\times ${m2} = ${n1 * m1 + n2 * m2}$，除以 ${n1 + n2} 得 ${combined}。`,
          ],
        );
      },
    ),
  ],
  "modeling-with-one-step-inequalities": [
    skill(
      "rounding-the-right-way-in-a-story",
      ["Rounding the right way in a story", "故事中正确地取整"],
      [
        "An inequality about things that cannot be split needs a whole answer. Staying under a limit rounds down, while reaching a target rounds up, whatever the usual rounding rule would say.",
        "关于不能分割的东西，不等式需要整数答案。不超过限额要向下取整，达到目标要向上取整，不管通常的四舍五入怎么说。",
      ],
      (rng) => {
        const price = rng.int(3, 15);
        const budget = price * rng.int(4, 20) + rng.int(1, price - 1);
        const floor = Math.floor(budget / price);
        const reach = rng.bool();
        return whole(
          reach
            ? [
                `Tickets cost ${price} dollars each. How many must a club sell to raise at least ${budget} dollars?`,
                `每张票 ${price} 美元。社团至少要卖多少张才能筹到不少于 ${budget} 美元？`,
              ]
            : [
                `Tickets cost ${price} dollars each. What is the greatest number a club can buy with ${budget} dollars?`,
                `每张票 ${price} 美元。社团用 ${budget} 美元最多能买多少张？`,
              ],
          reach ? floor + 1 : floor,
          reach ? [floor, floor + 2, budget - price] : [floor + 1, floor - 1, budget - price],
          [
            `$${price}x ${reach ? "\\ge" : "\\le"} ${budget}$ gives $x ${reach ? "\\ge" : "\\le"} ${frac(budget, price)}$, so the whole answer is ${reach ? floor + 1 : floor}.`,
            `$${price}x ${reach ? "\\ge" : "\\le"} ${budget}$，得 $x ${reach ? "\\ge" : "\\le"} ${frac(budget, price)}$，所以整数答案是 ${reach ? floor + 1 : floor}。`,
          ],
        );
      },
    ),
  ],
  "units-in-formulas": [
    skill(
      "the-unit-of-a-constant",
      ["The unit of a constant", "常数的单位"],
      [
        "Both sides of a formula must have the same units. So the unit of a constant is whatever makes the right side match the left, which can be found by dividing the units.",
        "公式两边的单位必须相同。所以常数的单位就是使右边与左边一致的单位，可以用单位相除求出。",
      ],
      (rng) => {
        const [s, ti] = rng.pick<[[string, string], [string, string]]>([
          [
            ["feet", "英尺"],
            ["seconds", "秒"],
          ],
          [
            ["meters", "米"],
            ["minutes", "分钟"],
          ],
          [
            ["kilometers", "千米"],
            ["minutes", "分钟"],
          ],
          [
            ["liters", "升"],
            ["minutes", "分钟"],
          ],
          [
            ["gallons", "加仑"],
            ["hours", "小时"],
          ],
          [
            ["inches", "英寸"],
            ["seconds", "秒"],
          ],
          [
            ["centimeters", "厘米"],
            ["seconds", "秒"],
          ],
          [
            ["meters", "米"],
            ["seconds", "秒"],
          ],
          [
            ["feet", "英尺"],
            ["minutes", "分钟"],
          ],
          [
            ["kilometers", "千米"],
            ["hours", "小时"],
          ],
          [
            ["miles", "英里"],
            ["hours", "小时"],
          ],
          [
            ["liters", "升"],
            ["seconds", "秒"],
          ],
          [
            ["gallons", "加仑"],
            ["minutes", "分钟"],
          ],
        ]);
        const square = rng.bool();
        const correct: [string, string] = square
          ? [`${s[0]} per ${ti[0]} squared`, `${s[1]}每平方${ti[1]}`]
          : [`${s[0]} per ${ti[0]}`, `${s[1]}每${ti[1]}`];
        const others: [string, string][] = square
          ? [
              [`${s[0]} per ${ti[0]}`, `${s[1]}每${ti[1]}`],
              [`${s[0]} times ${ti[0]} squared`, `${s[1]}乘平方${ti[1]}`],
              [`${ti[0]} squared per ${s[0]}`, `平方${ti[1]}每${s[1]}`],
            ]
          : [
              [`${s[0]} per ${ti[0]} squared`, `${s[1]}每平方${ti[1]}`],
              [`${s[0]} times ${ti[0]}`, `${s[1]}乘${ti[1]}`],
              [`${ti[0]} per ${s[0]}`, `${ti[1]}每${s[1]}`],
            ];
        const eq = square ? "d = kt^{2}" : "d = kt";
        return choose(
          rng,
          [
            `In $${eq}$, $d$ is in ${s[0]} and $t$ is in ${ti[0]}. What is the unit of $k$?`,
            `在 $${eq}$ 中，$d$ 的单位是${s[1]}，$t$ 的单位是${ti[1]}。$k$ 的单位是什么？`,
          ],
          correct,
          others,
          [
            `$k = ${square ? frac("d", "t^{2}") : frac("d", "t")}$, so its unit is ${correct[0]}.`,
            `$k = ${square ? frac("d", "t^{2}") : frac("d", "t")}$，所以单位是${correct[1]}。`,
          ],
        );
      },
    ),
  ],
  "units-of-rates-of-change": [
    skill(
      "the-slope-between-two-readings",
      ["The slope between two readings", "两次读数之间的斜率"],
      [
        "A rate of change is the change in the output divided by the change in the input, and its unit is the same division. The two readings need not be neighbors or a single unit apart.",
        "变化率是输出的变化除以输入的变化，单位也是同样的除法。两次读数不必相邻，也不必只隔一个单位。",
      ],
      (rng) => {
        const rate = rng.int(2, 25);
        const h1 = rng.int(1, 5);
        const dh = rng.int(2, 6);
        const start = rng.int(10, 200);
        const v1 = start + rate * h1;
        const v2 = v1 + rate * dh;
        return whole(
          [
            `A tank holds ${v1} liters after ${h1} hours and ${v2} liters after ${h1 + dh} hours. If it fills steadily, what is the rate, in liters per hour?`,
            `水箱 ${h1} 小时后有 ${v1} 升，${h1 + dh} 小时后有 ${v2} 升。若匀速注水，速率是每小时多少升？`,
          ],
          rate,
          [v2 - v1, Math.round(v2 / (h1 + dh)) === rate ? rate + 1 : Math.round(v2 / (h1 + dh)), rate + dh],
          [`$(${v2} - ${v1}) \\div ${dh} = ${rate}$ liters per hour.`, `$(${v2} - ${v1}) \\div ${dh} = ${rate}$ 升每小时。`],
        );
      },
    ),
  ],
  "equations-with-parentheses": [
    skill(
      "subtracting-a-group",
      ["Subtracting a group", "减去一个括号"],
      [
        "A minus sign before parentheses changes the sign of every term inside. Most errors here come from changing only the first term, so expand carefully before collecting.",
        "括号前的减号要改变括号内每一项的符号。这里的错误多半是只改了第一项，所以合并前要仔细展开。",
      ],
      (rng) => {
        const a = rng.int(2, 6);
        const x = rng.int(-9, 9) || 2;
        const b = rng.int(1, 9);
        const c = rng.int(1, a * 3);
        const k = a + rng.int(1, 4);
        const right = k * x - (a * x - c) + b;
        return integer(
          [`Solve $${k}x - (${a}x - ${c}) + ${b} = ${right}$.`, `解方程 $${k}x - (${a}x - ${c}) + ${b} = ${right}$。`],
          x,
          [-x, x + 1, right - b],
          [
            `Expanding gives $${k - a}x + ${c + b} = ${right}$, so $x = ${x}$.`,
            `展开得 $${k - a}x + ${c + b} = ${right}$，所以 $x = ${x}$。`,
          ],
        );
      },
    ),
  ],
  "elimination-with-one-transformation": [
    skill(
      "the-sum-of-the-unknowns",
      ["The sum of the unknowns", "未知数的和"],
      [
        "Sometimes adding the equations gives the requested quantity at once, with no need to find each unknown. Look at what is asked before starting to solve.",
        "有时把两个方程相加，就立刻得到所求的量，不必分别求出未知数。开始解之前，先看题目要什么。",
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(1, 7);
        const k = 8 + rng.int(0, 6);
        const x = rng.int(-6, 9);
        const y = rng.int(-6, 9);
        const safeD = k - a;
        const safeE = k - b;
        return integer(
          [
            `If $${a}x + ${b}y = ${a * x + b * y}$ and $${safeD === 1 ? "" : safeD < 0 ? `(${safeD})` : safeD}x + ${safeE === 1 ? "" : safeE < 0 ? `(${safeE})` : safeE}y = ${safeD * x + safeE * y}$, what is $x + y$?`,
            `若 $${a}x + ${b}y = ${a * x + b * y}$，$${safeD === 1 ? "" : safeD < 0 ? `(${safeD})` : safeD}x + ${safeE === 1 ? "" : safeE < 0 ? `(${safeE})` : safeE}y = ${safeD * x + safeE * y}$，$x + y$ 是多少？`,
          ],
          x + y,
          [k * (x + y), x, y],
          [
            `Adding gives $${k}x + ${k}y = ${k * (x + y)}$, and dividing by ${k} gives ${x + y}.`,
            `相加得 $${k}x + ${k}y = ${k * (x + y)}$，除以 ${k} 得 ${x + y}。`,
          ],
        );
      },
    ),
  ],
  "elimination-with-two-transformations": [
    skill(
      "the-multipliers-that-eliminate",
      ["The multipliers that eliminate", "用于消元的乘数"],
      [
        "To eliminate a variable, multiply the equations so that its coefficients become opposites. The smallest choice uses the least common multiple of the two coefficients.",
        "要消去一个变量，就把方程乘某个数，使它的系数互为相反数。最小的选择用两个系数的最小公倍数。",
      ],
      (rng) => {
        const [a, b] = rng.pick<[number, number]>([
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
          [6, 7],
          [3, 8],
          [5, 8],
          [7, 8],
          [4, 9],
          [5, 9],
        ]);
        const c = rng.int(2, 9);
        const d = rng.int(2, 9);
        const lcm = a * b;
        return chooseMath(
          rng,
          [
            `To eliminate $x$ from $${a}x + ${c}y = 1$ and $${b}x - ${d}y = 2$, which multipliers work with the least common multiple, for the first and second equations?`,
            `要从 $${a}x + ${c}y = 1$ 和 $${b}x - ${d}y = 2$ 中消去 $x$，用最小公倍数时，第一、第二个方程应分别乘哪两个数？`,
          ],
          `${b} \\text{ and } {-${a}}`,
          [`${a} \\text{ and } {-${b}}`, `${b} \\text{ and } ${a}`, `${lcm} \\text{ and } {-${lcm}}`],
          [
            `The coefficients of $x$ become ${lcm} and $-${lcm}$, which cancel when added.`,
            `$x$ 的系数变成 ${lcm} 和 $-${lcm}$，相加时抵消。`,
          ],
        );
      },
    ),
  ],
  "representations-of-functions": [
    skill(
      "the-rule-behind-a-table",
      ["The rule behind a table", "表格背后的规则"],
      [
        "A table, a rule and a graph can show one function. To find a linear rule from a table, take the change per step as the multiplier and the output at zero as the constant.",
        "表格、规则和图像可以表示同一个函数。要由表格求线性规则，每步的变化是乘数，输入为 0 时的输出是常数。",
      ],
      (rng) => {
        const m = rng.int(2, 9) * (rng.bool() ? 1 : -1);
        let b = rng.int(1, 12) * (rng.bool() ? 1 : -1);
        if (b === m) b += 1;
        const xs = [1, 2, 3];
        const pairs = xs.map((x) => `(${x}, ${m * x + b})`).join(", ");
        const line = (mm: number, bb: number) => `y = ${mm}x${signed(bb)}`;
        return chooseMath(
          rng,
          [`Which rule gives the points ${`$${pairs}$`}?`, `哪个规则给出点 $${pairs}$？`],
          line(m, b),
          [line(b, m), line(m, -b), line(-m, b)],
          [
            `$y$ changes by ${m} per step, and stepping back from $x = 1$ to $x = 0$ gives ${b}.`,
            `每步 $y$ 变化 ${m}，从 $x = 1$ 退回到 $x = 0$ 得 ${b}。`,
          ],
        );
      },
    ),
  ],
  "increasing-and-decreasing": [
    skill(
      "from-a-table-of-values",
      ["From a table of values", "由数值表判断"],
      [
        "Reading across a table in order of the input, a function is increasing where the outputs go up and decreasing where they go down. The turning point is where this changes.",
        "按输入的顺序读表，输出上升的地方函数递增，下降的地方函数递减。发生变化的地方就是转折点。",
      ],
      (rng) => {
        const turn = rng.int(1, 4);
        const flip = rng.bool();
        const start = rng.int(-6, 6);
        const xs = [0, 1, 2, 3, 4, 5];
        const steps = xs.slice(1).map((x) => (x <= turn ? 1 : -1) * rng.int(1, 6) * (flip ? -1 : 1));
        let run = start;
        const ys = [start, ...steps.map((s) => (run += s))];
        const table = `\\begin{array}{|c|c|c|c|c|c|c|}\\hline x & ${xs.join(" & ")} \\\\ \\hline y & ${ys.join(" & ")} \\\\ \\hline\\end{array}`;
        return whole(
          flip
            ? [
                `The function shown decreases and then increases. At which value of $x$ does it stop decreasing? $$${table}$$`,
                `表中的函数先递减后递增。它在 $x$ 为何值时停止递减？$$${table}$$`,
              ]
            : [
                `The function shown increases and then decreases. At which value of $x$ does it stop increasing? $$${table}$$`,
                `表中的函数先递增后递减。它在 $x$ 为何值时停止递增？$$${table}$$`,
              ],
          turn,
          [turn + 1, turn === 1 ? 5 : turn - 1, ys[turn]! >= 0 && ys[turn] !== turn ? ys[turn]! : turn + 2],
          [
            `The outputs change direction at $x = ${turn}$, where $y = ${ys[turn]}$.`,
            `输出在 $x = ${turn}$ 处改变方向，此时 $y = ${ys[turn]}$。`,
          ],
        );
      },
    ),
  ],
  "adding-integers": [
    skill(
      "adding-a-long-list",
      ["Adding a long list", "一长串相加"],
      [
        "Addition can be done in any order. So grouping the positive numbers and the negative numbers, and combining the two totals at the end, is quicker and safer for a long list.",
        "加法可以按任何顺序进行。所以把正数和负数分别加起来，最后合并两个总和，对长串数更快也更不容易错。",
      ],
      (rng) => {
        const pos = [rng.int(5, 40), rng.int(5, 40), rng.int(5, 40)];
        const neg = [-rng.int(5, 40), -rng.int(5, 40)];
        const list = rng.shuffle([...pos, ...neg]);
        const p = pos.reduce((s, x) => s + x, 0);
        const n = neg.reduce((s, x) => s + x, 0);
        const text = list.map((x, i) => (i === 0 ? `${x}` : x < 0 ? `+ (${x})` : `+ ${x}`)).join(" ");
        return integer(
          [`Evaluate $${text}$.`, `计算 $${text}$。`],
          p + n,
          [p - n, -(p + n), p],
          [
            `The positives total ${p} and the negatives total ${n}, which gives ${p + n}.`,
            `正数总和 ${p}，负数总和 ${n}，合起来是 ${p + n}。`,
          ],
        );
      },
    ),
  ],
  "subtracting-integers": [
    skill(
      "the-distance-between-two-numbers",
      ["The distance between two numbers", "两个数之间的距离"],
      [
        "The difference of two numbers gives the distance between them on a number line, once any negative sign on the result is dropped. Across zero, the distance is the sum of their sizes.",
        "两个数的差去掉负号，就是它们在数轴上的距离。跨过零时，距离是两个数大小之和。",
      ],
      (rng) => {
        const hi = rng.int(1, 40);
        const lo = -rng.int(1, 60);
        return whole(
          [
            `An elevator at floor ${hi} goes down to floor ${lo}, with underground floors shown as negative integers. How many floors does it travel?`,
            `电梯从 ${hi} 层降到 ${lo} 层（地下层用负整数表示）。它走了多少层？`,
          ],
          hi - lo,
          [Math.abs(hi + lo), hi, -lo],
          [
            `The distance is the difference of the floors, $${hi} - (${lo}) = ${hi - lo}$.`,
            `距离是两个楼层之差，$${hi} - (${lo}) = ${hi - lo}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-integers": [
    skill(
      "the-sign-from-a-count-of-negatives",
      ["The sign from a count of negatives", "由负数个数定符号"],
      [
        "Negative factors pair up to make positives. So an even number of negative factors gives a positive product, and an odd number gives a negative one, with no need for the size.",
        "负因数两两配对变成正数。所以负因数个数为偶数时积为正，为奇数时积为负，不用算大小。",
      ],
      (rng) => {
        const negs = rng.int(2, 7);
        const posCount = rng.int(1, 4);
        const factors = rng.shuffle([
          ...Array.from({ length: negs }, () => -rng.int(1, 19)),
          ...Array.from({ length: posCount }, () => rng.int(1, 19)),
        ]);
        const negative = negs % 2 === 1;
        const options: [string, string][] = [
          ["Negative", "负数"],
          ["Positive", "正数"],
          ["Zero", "零"],
          ["It cannot be decided", "无法确定"],
        ];
        return choose(
          rng,
          [
            `What is the sign of $${factors.map((f) => (f < 0 ? `(${f})` : `${f}`)).join(" \\cdot ")}$?`,
            `$${factors.map((f) => (f < 0 ? `(${f})` : `${f}`)).join(" \\cdot ")}$ 的符号是什么？`,
          ],
          options[negative ? 0 : 1]!,
          options.filter((_, i) => i !== (negative ? 0 : 1)),
          [
            `There are ${negs} negative factors, which is ${negative ? "odd" : "even"}.`,
            `有 ${negs} 个负因数，是${negative ? "奇数" : "偶数"}个。`,
          ],
        );
      },
    ),
  ],
  "dividing-integers": [
    skill(
      "an-average-change",
      ["An average change", "平均变化"],
      [
        "A total change shared over several equal steps gives the change per step, and the sign of the total carries through. A fall shared over days is a negative change per day.",
        "总变化平均分到若干相等的步骤，就是每步的变化，总变化的符号保留下来。几天内的下降，每天的变化是负数。",
      ],
      (rng) => {
        const days = rng.int(2, 12);
        const each = rng.int(2, 15);
        const fall = rng.bool();
        const total = (fall ? -each : each) * days;
        return integer(
          [
            `A share price changes by $${total}$ cents in ${days} days, by the same amount each day. What is the change per day, in cents?`,
            `股价在 ${days} 天内变化 $${total}$ 美分，每天变化相同。每天变化多少美分？`,
          ],
          total / days,
          [-total / days, total + days, total],
          [
            `Share the total change equally among the days: $${total} \\div ${days} = ${total / days}$.`,
            `把总变化平均分到每一天：$${total} \\div ${days} = ${total / days}$。`,
          ],
        );
      },
    ),
  ],
  "powers-of-integers": [
    skill(
      "the-power-of-a-power-of-a-negative",
      ["Comparing powers of negatives", "比较负数的幂"],
      [
        "With parentheses, the sign is part of what is multiplied; without them, the power applies first and the minus sign comes last. So $(-a)^{n}$ and $-a^{n}$ agree only for odd $n$.",
        "有括号时，符号也参与相乘；没有括号时，先乘方，最后才取负。所以 $(-a)^{n}$ 和 $-a^{n}$ 只在 $n$ 为奇数时相同。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const n = rng.pick([2, 3, 4, 5]);
        const first = (-a) ** n;
        const second = -(a ** n);
        return integer(
          [`Evaluate $(-${a})^{${n}} - (-${a}^{${n}})$.`, `计算 $(-${a})^{${n}} - (-${a}^{${n}})$。`],
          first - second,
          [first + second, 2 * a ** n === first - second ? a ** n : 2 * a ** n, -2 * a ** n],
          [
            `$(-${a})^{${n}} = ${first}$ and $-${a}^{${n}} = ${second}$, whose difference is ${first - second}.`,
            `$(-${a})^{${n}} = ${first}$，$-${a}^{${n}} = ${second}$，差是 ${first - second}。`,
          ],
        );
      },
    ),
  ],
  "order-of-operations-with-integers": [
    skill(
      "a-fraction-bar-groups",
      ["A fraction bar groups", "分数线有分组作用"],
      [
        "A fraction bar acts like parentheses around the top and around the bottom. So each part must be worked out fully, keeping the signs, before the division happens.",
        "分数线相当于给分子和分母都加了括号。所以要先把每部分算完，保留符号，然后才相除。",
      ],
      (rng) => {
        const q = rng.int(-9, 9) || 3;
        const a = rng.int(2, 5);
        const b = rng.int(-6, 6) || 2;
        const d = a * a + b;
        if (d === 0)
          return integer(
            ["Evaluate $-2 \\cdot 3^{2}$.", "计算 $-2 \\cdot 3^{2}$。"],
            -18,
            [18, -36, 36],
            ["Square first: $-2 \\cdot 9 = -18$.", "先乘方：$-2 \\cdot 9 = -18$。"],
          );
        const c = rng.int(1, 20);
        const top = q * d + c;
        return integer(
          [`Evaluate $${frac(`${top} - ${c}`, `${a}^{2}${signed(b)}`)}$.`, `计算 $${frac(`${top} - ${c}`, `${a}^{2}${signed(b)}`)}$。`],
          q,
          [-q, top - c, d],
          [
            `The top is ${top - c} and the bottom is ${d}, and $${top - c} \\div ${d} = ${q}$.`,
            `分子是 ${top - c}，分母是 ${d}，$${top - c} \\div ${d} = ${q}$。`,
          ],
        );
      },
    ),
  ],
  "evaluating-expressions": [
    skill(
      "a-formula-from-a-story",
      ["A formula from a story", "故事中的公式"],
      [
        "A formula gets used by replacing each letter with its value and following the order of operations. Writing negative values in parentheses first keeps the signs right.",
        "使用公式时，把每个字母换成它的值，再按运算顺序计算。先给负值加括号，符号才不会错。",
      ],
      (rng) => {
        const f = 32 + 9 * rng.int(-16, 16);
        const c = ((f - 32) * 5) / 9;
        return integer(
          [
            `The formula $C = ${frac(5, 9)}(F - 32)$ converts Fahrenheit to Celsius. What is $C$ when $F = ${f}$?`,
            `公式 $C = ${frac(5, 9)}(F - 32)$ 把华氏度换算成摄氏度。$F = ${f}$ 时 $C$ 是多少？`,
          ],
          c,
          [-c, f - 32, ((f + 32) * 5) / 9 === c ? c + 1 : Math.round(((f + 32) * 5) / 9)],
          [
            `$${f} - 32 = ${f - 32}$, and $${frac(5, 9)} \\times (${f - 32}) = ${c}$.`,
            `$${f} - 32 = ${f - 32}$，$${frac(5, 9)} \\times (${f - 32}) = ${c}$。`,
          ],
        );
      },
    ),
  ],
  "distributive-property": [
    skill(
      "the-factor-that-was-pulled-out",
      ["The factor that was pulled out", "提出的公因数"],
      [
        "Reading the distributive property backward pulls out a common factor. The greatest factor leaves no common factor inside the parentheses, and expanding must bring back the original.",
        "反过来读分配律，就是提公因数。最大公因数提出后，括号内不再有公因数；展开后必须回到原式。",
      ],
      (rng) => {
        const g = rng.int(2, 9);
        const [p, q] = rng.pick<[number, number]>([
          [2, 3],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
          [5, 6],
          [2, 7],
          [3, 7],
          [5, 7],
          [3, 8],
          [5, 8],
          [7, 8],
        ]);
        const sub = rng.bool();
        const op = sub ? "-" : "+";
        return chooseMath(
          rng,
          [`Factor out the greatest common factor: $${g * p}x ${op} ${g * q}$.`, `提出最大公因数：$${g * p}x ${op} ${g * q}$。`],
          `${g}(${p}x ${op} ${q})`,
          [`${g}(${p}x ${sub ? "+" : "-"} ${q})`, `${p}(${g}x ${op} ${g * q})`, `${g * p}(x ${op} ${q})`],
          [
            `Both terms have the factor ${g}, and $${g} \\times ${p} = ${g * p}$ and $${g} \\times ${q} = ${g * q}$.`,
            `两项都有因数 ${g}，$${g} \\times ${p} = ${g * p}$，$${g} \\times ${q} = ${g * q}$。`,
          ],
        );
      },
    ),
  ],
  "simplifying-expressions": [
    skill(
      "the-perimeter-as-an-expression",
      ["The perimeter as an expression", "周长的表达式"],
      [
        "Lengths given as expressions are added like any other terms. Collecting the $x$ terms and the numbers separately gives a shorter expression that holds for every value of $x$.",
        "用表达式给出的长度，可以像其他项一样相加。分别合并 $x$ 项和数，得到对每个 $x$ 都成立的较短表达式。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(1, 12);
        const c = rng.int(2, 9);
        const d = rng.int(1, 12);
        return chooseMath(
          rng,
          [
            `A rectangle has length $${a}x + ${b}$ and width $${c}x + ${d}$. Which expression gives its perimeter?`,
            `长方形长 $${a}x + ${b}$，宽 $${c}x + ${d}$。哪个表达式表示它的周长？`,
          ],
          `${2 * (a + c)}x + ${2 * (b + d)}`,
          [`${a + c}x + ${b + d}`, `${2 * (a + c)}x + ${b + d}`, `${2 * (a + c) + 2 * (b + d)}x`],
          [
            `$2(${a}x + ${b}) + 2(${c}x + ${d}) = ${2 * (a + c)}x + ${2 * (b + d)}$.`,
            `$2(${a}x + ${b}) + 2(${c}x + ${d}) = ${2 * (a + c)}x + ${2 * (b + d)}$。`,
          ],
        );
      },
    ),
  ],
  "correlation-and-causation": [
    skill(
      "the-hidden-third-factor",
      ["The hidden third factor", "隐藏的第三个因素"],
      [
        "Two quantities can rise together because a third one drives both. Before believing that one causes the other, look for a factor that could explain them both.",
        "两个量可能因为第三个量同时推动而一起上升。相信其中一个导致另一个之前，先找能同时解释两者的因素。",
      ],
      (rng) => {
        const cases: { a: [string, string]; b: [string, string]; c: [string, string]; w: [string, string][] }[] = [
          {
            a: ["ice cream sales", "冰淇淋销量"],
            b: ["sunburn cases", "晒伤人数"],
            c: ["hot, sunny weather", "炎热晴朗的天气"],
            w: [
              ["the price of ice cream", "冰淇淋的价格"],
              ["the color of the cones", "蛋筒的颜色"],
              ["the number of shops closed", "关门的商店数量"],
            ],
          },
          {
            a: ["shoe size in a primary school", "小学里学生的鞋码"],
            b: ["reading level", "阅读水平"],
            c: ["the age of the student", "学生的年龄"],
            w: [
              ["the brand of the shoes", "鞋的品牌"],
              ["the size of the library", "图书馆的大小"],
              ["the shape of the classroom", "教室的形状"],
            ],
          },
          {
            a: ["firefighters at a fire", "火灾现场的消防员人数"],
            b: ["damage done", "造成的损失"],
            c: ["the size of the fire", "火灾的规模"],
            w: [
              ["the color of the fire truck", "消防车的颜色"],
              ["the day of the week", "星期几"],
              ["the age of the firefighters", "消防员的年龄"],
            ],
          },
          {
            a: ["hot chocolate sales", "热巧克力销量"],
            b: ["heating bills", "取暖费"],
            c: ["cold weather", "寒冷的天气"],
            w: [
              ["the size of the mugs", "杯子的大小"],
              ["the price of milk", "牛奶的价格"],
              ["the number of cafes", "咖啡馆的数量"],
            ],
          },
          {
            a: ["a city's number of parks", "城市的公园数量"],
            b: ["its number of restaurants", "餐馆数量"],
            c: ["the population of the city", "城市的人口"],
            w: [
              ["the height of the trees", "树的高度"],
              ["the taste of the food", "食物的味道"],
              ["the color of the benches", "长椅的颜色"],
            ],
          },
        ];
        const one = rng.pick(cases);
        return choose(
          rng,
          [
            `Data show that ${one.a[0]} and ${one.b[0]} are positively correlated. Which third factor best explains this?`,
            `数据显示${one.a[1]}和${one.b[1]}正相关。哪个第三因素最能解释这一点？`,
          ],
          one.c,
          rng.sample(
            [
              ...one.w,
              ["the day the data were collected", "收集数据的日期"],
              ["the color of the report's cover", "报告封面的颜色"],
              ["the font used for the table", "表格所用的字体"],
            ],
            3,
          ),
          [
            `${one.c[0]} drives both quantities, so neither needs to cause the other.`,
            `${one.c[1]}同时影响这两个量，所以不必是其中一个导致另一个。`,
          ],
        );
      },
    ),
  ],
};
