// A third knowledge point for the foundations topics that Prealgebra and Algebra Foundations share with Algebra I.

import type { KnowledgePointDef } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { choose, chooseMath, tableFigure, whole } from "./early-grades-more-kit.ts";
import { aFractionTimesTheUnknown, storiesWithOneStepEquations, subtractingAGroup } from "./equations.ts";
import { aNegativeFractionToAPower } from "./exponents.ts";
import { aFormulaFromAStory, theFactorThatWasPulledOut, thePerimeterAsAnExpression } from "./expressions.ts";
import { lesson, valued } from "./grade-6-kit.ts";
import { countingTheIntegersThatWork } from "./inequalities.ts";
import {
  addingALongList,
  aFractionBarGroups,
  anAverageChange,
  theDistanceBetweenTwoNumbers,
  thePowerOfAPowerOfANegative,
  theSignFromACountOfNegatives,
} from "./integers.ts";
import { frac, integer, signed, skill } from "./third-kit.ts";

/** deeperAlgebraThird2Points holds these third knowledge points, by topic. */
export const deeperAlgebraThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "decimal-arithmetic": [
    lesson(
      "dividing-by-a-decimal",
      ["Dividing by a decimal", "除以小数"],
      [
        [
          "Multiplying both numbers of a division by the same power of ten does not change the quotient. So move both decimal points until the divisor is a whole number. $4.2 \\div 0.06$: multiply both by $100$ to get $420 \\div 6 = 70$.",
          "把除法中的两个数同乘一个 $10$ 的幂，商不变。所以把两个小数点同时移动，直到除数变成整数。$4.2 \\div 0.06$：两个数都乘 $100$，得 $420 \\div 6 = 70$。",
        ],
        ["$70 \\times 0.06 = 4.2$.", "$70 \\times 0.06 = 4.2$。"],
        [
          "Move both points the same number of places. Moving only the divisor's makes the answer $100$ times too big.",
          "两个小数点要移动相同的位数。只移动除数的小数点，答案会大 $100$ 倍。",
        ],
      ],
      (rng) => {
        let divisor = rng.int(2, 95);
        while (divisor % 10 === 0) divisor = rng.int(2, 95);
        const quotient = rng.int(2, 60);
        const places = rng.pick([1, 2]);
        const scale = 10 ** places;
        const shownA = dec(Q.of(divisor * quotient, scale));
        const shownB = dec(Q.of(divisor, scale));
        return valued(
          [`Evaluate $${shownA} \\div ${shownB}$.`, `计算 $${shownA} \\div ${shownB}$。`],
          quotient,
          [
            [
              ["Make the divisor whole", "把除数变成整数"],
              [`Multiply both numbers by $${scale}$:`, `两个数都乘 $${scale}$：`],
              [`${shownA} \\div ${shownB} = ${divisor * quotient} \\div ${divisor}`],
            ],
            [
              ["Divide", "相除"],
              ["Now divide whole numbers:", "现在是整数除法："],
              [`${divisor * quotient} \\div ${divisor} = ${quotient}`],
            ],
          ],
          [`$${quotient} \\times ${shownB} = ${shownA}$.`, `$${quotient} \\times ${shownB} = ${shownA}$。`],
          [
            [
              quotient * scale,
              "That moves only the divisor's point, so the answer is too big.",
              "这只移动了除数的小数点，所以答案太大了。",
            ],
            [quotient * 10 ** (places + 1), "That moves the points by different numbers of places.", "这是两个小数点移动的位数不同。"],
            [Q.of(quotient, scale), "That moves the point the wrong way.", "这是把小数点向错误的方向移动了。"],
          ],
        );
      },
      tableFigure(["4.2 / 0.06", "42 / 0.6", "420 / 6"], [70, 70, 70]),
    ),
  ],
  "powers-of-rational-numbers": [aNegativeFractionToAPower],
  "one-step-equations-addition": [storiesWithOneStepEquations],
  "one-step-equations-multiplication": [aFractionTimesTheUnknown],
  "inequalities-and-solutions": [countingTheIntegersThatWork],
  "systems-of-linear-equations": [
    skill(
      "the-value-that-makes-a-point-a-solution",
      ["The value that makes a point a solution", "使一点成为解的值"],
      [
        `A solution of a system satisfies every equation. So if a point is known to be a solution, its coordinates can be put into an equation with a missing coefficient, and that leaves one equation in one unknown.

Say $(2, 3)$ solves $x + y = 5$ and $kx - y = 7$. Putting $x = 2$ and $y = 3$ into the second equation gives $2k - 3 = 7$, so $2k = 10$ and $k = 5$. Check: $5 \\cdot 2 - 3 = 7$.

> **Watch out.** Use the equation that contains $k$, and substitute carefully: with $y = -4$, the term $-y$ becomes $-(-4) = +4$. Dropping that sign gives the opposite number or a value off by a little.`,
        `方程组的解满足每个方程。所以如果已知某点是解，就可以把它的坐标代入含未知系数的方程，剩下一个只含一个未知数的方程。

比如 $(2, 3)$ 是 $x + y = 5$ 和 $kx - y = 7$ 的解。把 $x = 2$，$y = 3$ 代入第二个方程，得 $2k - 3 = 7$，所以 $2k = 10$，$k = 5$。检验：$5 \\cdot 2 - 3 = 7$。

> **注意。** 要用含 $k$ 的那个方程，并仔细代入：$y = -4$ 时，$-y$ 变成 $-(-4) = +4$。丢掉这个符号，就会得到相反数或差一点的值。`,
      ],
      (rng) => {
        const x = rng.int(-6, 6) || 2;
        const y = rng.int(-6, 6) || 3;
        const a = rng.int(2, 5);
        const k = rng.int(-6, 6) || 2;
        const c = a * x + y;
        const d = k * x - y;
        const kx = x === 1 ? "k" : x === -1 ? "-k" : `${x}k`;
        return integer(
          [
            `The point $(${x}, ${y})$ is a solution of $${a}x + y = ${c}$ and $kx - y = ${d}$. What is $k$?`,
            `点 $(${x}, ${y})$ 是 $${a}x + y = ${c}$ 和 $kx - y = ${d}$ 的解。$k$ 是多少？`,
          ],
          k,
          [-k, a, k + 1].filter((v) => v !== k),
          [
            `**Substitute.** The unknown $k$ is in the second equation, so put $x = ${x}$ and $y = ${y}$ into $kx - y = ${d}$: $$${kx} - ${y < 0 ? `(${y})` : y} = ${d}.$$

**Solve for $k$.** ${y < 0 ? `Subtracting $${y}$ is adding $${-y}$, so take $${-y}$ from both sides` : `Add $${y}$ to both sides`}: $${kx} = ${d + y}$${x === 1 ? "" : `, and divide by $${x}$`}, so $k = ${k}$.

**Check.** $${k} \\cdot ${x < 0 ? `(${x})` : x} - ${y < 0 ? `(${y})` : y} = ${k * x} ${y < 0 ? "+" : "-"} ${Math.abs(y)} = ${d}$, as the second equation requires.`,
            `**代入。** 未知数 $k$ 在第二个方程里，所以把 $x = ${x}$，$y = ${y}$ 代入 $kx - y = ${d}$：$$${kx} - ${y < 0 ? `(${y})` : y} = ${d}.$$

**解出 $k$。** ${y < 0 ? `减去 $${y}$ 就是加上 $${-y}$，所以两边都减去 $${-y}$` : `两边都加上 $${y}$`}：$${kx} = ${d + y}$${x === 1 ? "" : `，再除以 $${x}$`}，所以 $k = ${k}$。

**检验。** $${k} \\cdot ${x < 0 ? `(${x})` : x} - ${y < 0 ? `(${y})` : y} = ${k * x} ${y < 0 ? "+" : "-"} ${Math.abs(y)} = ${d}$，满足第二个方程。`,
          ],
        );
      },
    ),
  ],
  "vertical-angles": [
    {
      ...skill(
        "the-angles-around-a-crossing",
        ["The angles around a crossing", "交点周围的角"],
        [
          "Two crossing lines make four angles totaling $360$ degrees, in two equal pairs. So knowing the sum of a vertical pair gives each of the four angles directly.",
          "两条相交直线形成四个角，总和 $360$ 度，并且两两相等。所以知道一对对顶角的和，就能直接得到四个角。",
        ],
        (rng) => {
          const each = rng.int(16, 80);
          const asked = rng.bool();
          return whole(
            asked
              ? [
                  `Two lines cross, and one pair of vertical angles has a sum of $${2 * each}$ degrees. What is the measure of each of the other two angles, in degrees?`,
                  `两条直线相交，一对对顶角的和是 $${2 * each}$ 度。另外两个角各是多少度？`,
                ]
              : [
                  `Two lines cross, and one pair of vertical angles has a sum of $${2 * each}$ degrees. What is the sum of the other two angles, in degrees?`,
                  `两条直线相交，一对对顶角的和是 $${2 * each}$ 度。另外两个角的和是多少度？`,
                ],
            asked ? 180 - each : 360 - 2 * each,
            asked ? [each, 180 - 2 * each, 360 - 2 * each] : [2 * each, 180 - each, 180 - 2 * each],
            [
              `Each angle of the pair is $${each}$, so each other angle is $${180 - each}$, and the two together are $${360 - 2 * each}$.`,
              `这一对每个角是 $${each}$，所以其余每个角是 $${180 - each}$，两个合起来是 $${360 - 2 * each}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings4["vertical-angles#the-angles-around-a-crossing"],
    },
  ],
  "classifying-triangles": [
    {
      ...skill(
        "what-a-triangle-must-be",
        ["What a triangle must be", "三角形一定是什么"],
        [
          "A triangle has one name by sides and one by angles, and some pairs cannot happen. An equilateral triangle has three $60$ degree angles, so it can be neither right nor obtuse.",
          "三角形按边和按角各有一个名称，有些组合不可能。等边三角形三个角都是 $60$ 度，所以不可能是直角或钝角三角形。",
        ],
        (rng) => {
          const impossible: [string, string, string, string][] = [
            [
              "An equilateral right triangle",
              "等边直角三角形",
              "All three angles of an equilateral triangle measure $60^\\circ$, so none of them is a right angle.",
              "等边三角形的三个角都是 $60^\\circ$，所以没有直角。",
            ],
            [
              "An equilateral obtuse triangle",
              "等边钝角三角形",
              "All three angles of an equilateral triangle measure $60^\\circ$, so none of them is obtuse.",
              "等边三角形的三个角都是 $60^\\circ$，所以没有钝角。",
            ],
            [
              "A right triangle with two obtuse angles",
              "有两个钝角的直角三角形",
              "Two obtuse angles alone add up to more than $180^\\circ$, which is the total of all three angles.",
              "两个钝角的和已经超过 $180^\\circ$，而三个角的和才是 $180^\\circ$。",
            ],
            [
              "A triangle with two right angles",
              "有两个直角的三角形",
              "Two right angles already add up to $180^\\circ$, which leaves $0^\\circ$ for the third angle.",
              "两个直角的和已经是 $180^\\circ$，第三个角只剩 $0^\\circ$。",
            ],
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
          return choose(
            rng,
            ["Which of these triangles cannot exist?", "下面哪种三角形不可能存在？"],
            [bad[0], bad[1]],
            rng.sample(possible, 3),
            [`${bad[0]} cannot exist. ${bad[2]}`, `${bad[1]}不可能存在。${bad[3]}`],
          );
        },
      ),
      figure: gradeDrawings4["classifying-triangles#what-a-triangle-must-be"],
    },
  ],
  "isosceles-triangles": [
    {
      ...skill(
        "two-cases-for-the-given-angle",
        ["Two cases for the given angle", "已知角的两种情况"],
        [
          "If the known angle of an isosceles triangle could be a base angle or the vertex, both cases must be tried. An angle of 90 degrees or more can only be the vertex, because two of them would be too large.",
          "如果等腰三角形的已知角可能是底角也可能是顶角，两种情况都要试。90 度或以上的角只能是顶角，因为两个这样的角太大了。",
        ],
        (rng) => {
          const drawn = rng.int(5, 40) * 2;
          const even = drawn === 60 ? 58 : drawn;
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
              `As a base angle, it leaves a vertex of $${e}^\\circ$. As the vertex, it leaves base angles of $${v}^\\circ$. ${answer === even ? `As a base angle, it also has an equal partner of $${even}^\\circ$, so the` : "The"} greatest measure is $${answer}^\\circ$.`,
              `作为底角，顶角是 $${e}^\\circ$。作为顶角，底角是 $${v}^\\circ$。${answer === even ? `作为底角时，另一个底角也是 $${even}^\\circ$，所以` : ""}最大的是 $${answer}^\\circ$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["isosceles-triangles#two-cases-for-the-given-angle"],
    },
  ],
  "area-of-parallelograms": [
    {
      ...skill(
        "two-heights-of-one-parallelogram",
        ["Two heights of one parallelogram", "同一平行四边形的两条高"],
        [
          "A parallelogram has one area but two base and height pairs. So the two products are equal, and any three of the four lengths give the last one.",
          "平行四边形只有一个面积，却有两组底和高。所以两个乘积相等，四个长度中知道三个就能求出第四个。",
        ],
        (rng) => {
          // Sides p m and q m with heights q k and p k: k < m keeps each height shorter than the slanted side.
          const [p, q] = rng.pick<[number, number]>([
            [2, 3],
            [3, 2],
            [3, 4],
            [4, 3],
            [2, 5],
            [5, 2],
            [3, 5],
            [5, 3],
            [4, 5],
            [5, 4],
          ]);
          const m = rng.int(3, 8);
          const k = rng.int(2, m - 1);
          const b1 = p * m;
          const b2 = q * m;
          const h1 = q * k;
          const h2 = p * k;
          const area = b1 * h1;
          return whole(
            [
              `A parallelogram has sides of $${b1}$ cm and $${b2}$ cm. The height to the $${b1}$ cm side is $${h1}$ cm. What is the height to the $${b2}$ cm side, in cm?`,
              `平行四边形两边长 $${b1}$ 厘米和 $${b2}$ 厘米。到 $${b1}$ 厘米边的高是 $${h1}$ 厘米。到 $${b2}$ 厘米边的高是多少厘米？`,
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
      figure: gradeDrawings4["area-of-parallelograms#two-heights-of-one-parallelogram"],
    },
  ],
  "area-of-trapezoids": [
    {
      ...skill(
        "the-missing-base-of-a-trapezoid",
        ["The missing base of a trapezoid", "梯形缺失的底"],
        [
          "Twice the area divided by the height gives the sum of the two bases. Taking away the known base leaves the other, and forgetting to double the area is the usual slip.",
          "面积的两倍除以高，得到两底之和。减去已知的底，就是另一个底；忘记把面积乘 $2$ 是常见错误。",
        ],
        (rng) => {
          const h = rng.int(2, 12);
          const b1 = rng.int(2, 20);
          const drawn = rng.int(2, 10) * 2 - (b1 % 2 === 0 ? 0 : 1);
          const b2 = drawn === b1 ? drawn + 2 : drawn;
          const area = ((b1 + b2) * h) / 2;
          const shownArea = `${area}`;
          return whole(
            [
              `A trapezoid has area $${shownArea}$ square cm and height $${h}$ cm. One base is $${b1}$ cm. How long is the other base, in cm?`,
              `梯形的面积是 $${shownArea}$ 平方厘米，高 $${h}$ 厘米，一条底长 $${b1}$ 厘米。另一条底长多少厘米？`,
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
      figure: gradeDrawings4["area-of-trapezoids#the-missing-base-of-a-trapezoid"],
    },
  ],
  "composite-shapes": [
    {
      ...skill(
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
                  `A rectangular garden is $${w}$ m by $${h}$ m. A pond of $${a}$ m by $${b}$ m is inside it. What area of the garden is not pond, in square meters?`,
                  `长方形花园长 $${w}$ 米、宽 $${h}$ 米，里面有一个 $${a}$ 米 × $${b}$ 米的池塘。花园中不是池塘的面积是多少平方米？`,
                ]
              : [
                  `A rectangular garden is $${w}$ m by $${h}$ m. A corner of $${a}$ m by $${b}$ m is paved, and so is another piece of the same size. What area is not paved, in square meters?`,
                  `长方形花园长 $${w}$ 米、宽 $${h}$ 米。一角 $${a}$ 米 × $${b}$ 米铺了砖，另一块同样大小的地方也铺了砖。没铺砖的面积是多少平方米？`,
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
      figure: gradeDrawings4["composite-shapes#subtracting-a-hole"],
    },
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
            `A group of $${n1}$ has a mean score of $${m1}$, and a group of $${n2}$ has a mean score of $${m2}$. What is the mean score of all $${n1 + n2}$ together?`,
            `$${n1}$ 人一组的平均分是 $${m1}$，$${n2}$ 人一组的平均分是 $${m2}$。这 $${n1 + n2}$ 人合起来的平均分是多少？`,
          ],
          combined,
          [Math.round((m1 + m2) / 2) === combined ? combined + 1 : Math.round((m1 + m2) / 2), m1, m2],
          [
            `The total is $${n1} \\times ${m1} + ${n2} \\times ${m2} = ${n1 * m1 + n2 * m2}$, and dividing by $${n1 + n2}$ gives $${combined}$.`,
            `总分是 $${n1} \\times ${m1} + ${n2} \\times ${m2} = ${n1 * m1 + n2 * m2}$，除以 $${n1 + n2}$ 得 $${combined}$。`,
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
        `An inequality about things that cannot be split, such as tickets, needs a whole answer. The solution set says which whole numbers are allowed, so the direction of the inequality decides the rounding: staying under a limit allows the whole numbers **below** the bound, so round down; reaching a target needs the whole numbers **above** it, so round up.

With $50$ dollars and tickets at $8$ dollars, $8x \\le 50$ gives $x \\le 6\\frac{1}{4}$, so at most $6$ tickets: $7$ would cost $56$. To raise at least $50$ dollars, $8x \\ge 50$ gives $x \\ge 6\\frac{1}{4}$, so at least $7$ tickets: $6$ bring only $48$.

> **Watch out.** The usual rounding rule does not apply: $6\\frac{1}{4}$ rounds **up** to $7$ when a target must be reached. Check the answer and the whole number next to it in the story.`,
        `关于不能分割的东西（例如票），不等式需要整数答案。解集说明哪些整数被允许，所以不等号的方向决定取整的方向：不超过限额时，允许的是边界**以下**的整数，所以向下取整；要达到目标时，需要的是边界**以上**的整数，所以向上取整。

有 $50$ 美元、每张票 $8$ 美元时，$8x \\le 50$ 得 $x \\le 6\\frac{1}{4}$，所以最多 $6$ 张：$7$ 张要 $56$ 美元。要筹到至少 $50$ 美元，$8x \\ge 50$ 得 $x \\ge 6\\frac{1}{4}$，所以至少 $7$ 张：$6$ 张只有 $48$ 美元。

> **注意。** 通常的四舍五入在这里不适用：要达到目标时，$6\\frac{1}{4}$ 要**向上**取整为 $7$。在情境中检验答案和与它相邻的整数。`,
      ],
      (rng) => {
        const price = rng.int(3, 15);
        const budget = price * rng.int(4, 20) + rng.int(1, price - 1);
        const floor = Math.floor(budget / price);
        const reach = rng.bool();
        return whole(
          reach
            ? [
                `Tickets cost $${price}$ dollars each. How many must a club sell to raise at least $${budget}$ dollars?`,
                `每张票 $${price}$ 美元。社团至少要卖多少张才能筹到不少于 $${budget}$ 美元？`,
              ]
            : [
                `Tickets cost $${price}$ dollars each. What is the greatest number a club can buy with $${budget}$ dollars?`,
                `每张票 $${price}$ 美元。社团用 $${budget}$ 美元最多能买多少张？`,
              ],
          reach ? floor + 1 : floor,
          reach ? [floor, floor + 2, budget - price] : [floor + 1, floor - 1, budget - price],
          [
            `**Solve.** $x$ tickets ${reach ? "bring" : "cost"} $${price}x$ dollars, which must be ${reach ? "at least" : "at most"} $${budget}$. Divide by $${price}$: $${price}x ${reach ? "\\ge" : "\\le"} ${budget}$ gives $x ${reach ? "\\ge" : "\\le"} ${frac(budget, price)}$.

**Round.** Tickets come whole, and they must be ${reach ? "no fewer than the bound, so round up" : "no more than the bound, so round down"}: ${reach ? floor + 1 : floor}.

**Check.** ${
              reach
                ? `$${floor + 1}$ tickets bring $${price * (floor + 1)}$ dollars, at least $${budget}$; $${floor}$ bring only $${price * floor}$.`
                : `$${floor}$ tickets cost $${price * floor}$ dollars, within $${budget}$; $${floor + 1}$ would cost $${price * (floor + 1)}$.`
            }`,
            `**求解。** $x$ 张票${reach ? "能筹到" : "要花"} $${price}x$ 美元，${reach ? "至少要" : "不能超过"} $${budget}$ 美元。两边除以 $${price}$：$${price}x ${reach ? "\\ge" : "\\le"} ${budget}$，得 $x ${reach ? "\\ge" : "\\le"} ${frac(budget, price)}$。

**取整。** 票只能整张卖，而且${reach ? "不能少于这个边界，所以向上取整" : "不能多于这个边界，所以向下取整"}：${reach ? floor + 1 : floor}。

**检验。** ${
              reach
                ? `$${floor + 1}$ 张票能筹到 $${price * (floor + 1)}$ 美元，不少于 $${budget}$ 美元；$${floor}$ 张只有 $${price * floor}$ 美元。`
                : `$${floor}$ 张票要 $${price * floor}$ 美元，没有超过 $${budget}$ 美元；$${floor + 1}$ 张要 $${price * (floor + 1)}$ 美元。`
            }`,
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
        `Both sides of a formula measure the same thing, so they must have the same units. A constant in a formula therefore carries whatever unit makes the right side match the left. To find it, solve for the constant and divide the units.

In $d = kt$ with $d$ in meters and $t$ in seconds, $k = \\frac{d}{t}$ has the unit meters per second; then $kt$ is in $\\frac{\\text{m}}{\\text{s}} \\cdot \\text{s} = \\text{m}$, just as $d$ is. In $d = kt^{2}$, $k = \\frac{d}{t^{2}}$ is in meters per second squared.

> **Watch out.** When the formula has $t^{2}$, the unit of time is squared too: meters per second is the unit for $d = kt$, not for $d = kt^{2}$. Multiplying the units where we should divide, or turning the quotient upside down, would not give back the units of $d$.`,
        `公式两边度量的是同一个量，所以单位必须相同。因此公式中的常数带有使右边与左边一致的单位。要求它，就解出常数，再把单位相除。

在 $d = kt$ 中，若 $d$ 以米计、$t$ 以秒计，$k = \\frac{d}{t}$ 的单位是米每秒；于是 $kt$ 的单位是 $\\frac{\\text{m}}{\\text{s}} \\cdot \\text{s} = \\text{m}$，与 $d$ 相同。在 $d = kt^{2}$ 中，$k = \\frac{d}{t^{2}}$ 的单位是米每平方秒。

> **注意。** 公式中有 $t^{2}$ 时，时间单位也要平方：米每秒是 $d = kt$ 中 $k$ 的单位，不是 $d = kt^{2}$ 中的。该除的时候把单位相乘，或者把商倒过来，都得不回 $d$ 的单位。`,
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
        const one = (unit: string): string => (unit === "feet" ? "foot" : unit === "inches" ? "inch" : unit.slice(0, -1));
        const correct: [string, string] = square
          ? [`${s[0]} per ${one(ti[0])} squared`, `${s[1]}每平方${ti[1]}`]
          : [`${s[0]} per ${one(ti[0])}`, `${s[1]}每${ti[1]}`];
        const others: [string, string][] = square
          ? [
              [`${s[0]} per ${one(ti[0])}`, `${s[1]}每${ti[1]}`],
              [`${s[0]} times ${ti[0]} squared`, `${s[1]}乘平方${ti[1]}`],
              [`${ti[0]} squared per ${one(s[0])}`, `平方${ti[1]}每${s[1]}`],
            ]
          : [
              [`${s[0]} per ${one(ti[0])} squared`, `${s[1]}每平方${ti[1]}`],
              [`${s[0]} times ${ti[0]}`, `${s[1]}乘${ti[1]}`],
              [`${ti[0]} per ${one(s[0])}`, `${ti[1]}每${s[1]}`],
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
            `**Step 1: solve for $k$.** $k = ${square ? frac("d", "t^{2}") : frac("d", "t")}$, so the unit of $k$ is the unit of $d$ divided by the unit of $${square ? "t^{2}" : "t"}$.

**Step 2: divide the units.** ${s[0][0]?.toUpperCase()}${s[0].slice(1)} divided by ${square ? `${ti[0]} squared` : ti[0]} gives ${correct[0]}.

**Check.** Put the units back into $${eq}$: ${correct[0]} times ${square ? `${ti[0]} squared` : ti[0]} leaves ${s[0]}, the unit of $d$.`,
            `**第一步：解出 $k$。** $k = ${square ? frac("d", "t^{2}") : frac("d", "t")}$，所以 $k$ 的单位是 $d$ 的单位除以 $${square ? "t^{2}" : "t"}$ 的单位。

**第二步：单位相除。** ${s[1]}除以${square ? `平方${ti[1]}` : ti[1]}，得${correct[1]}。

**检验。** 把单位代回 $${eq}$：${correct[1]}乘${square ? `平方${ti[1]}` : ti[1]}，剩下${s[1]}，正是 $d$ 的单位。`,
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
        `A rate of change is the change in the output divided by the change in the input, and its unit comes from the same division. The two readings need not be neighbors or one unit apart. If a tank holds $50$ L after $2$ hours and $74$ L after $5$ hours, the water rose by $74 - 50 = 24$ L over $5 - 2 = 3$ hours, so the rate is

$$\\frac{24\\text{ L}}{3\\text{ h}} = 8\\text{ liters per hour}.$$

> **Watch out.** The change of $24$ L is not yet the rate; it must be shared among the $3$ hours. And dividing one reading by its own time, $74 \\div 5$, counts the water that was in the tank before the first reading.`,
        `变化率是输出的变化除以输入的变化，单位也来自同样的除法。两次读数不必相邻，也不必只隔一个单位。如果水箱 $2$ 小时后有 $50$ 升，$5$ 小时后有 $74$ 升，那么在 $5 - 2 = 3$ 小时里水增加了 $74 - 50 = 24$ 升，所以速率是

$$\\frac{24\\text{ L}}{3\\text{ h}} = 8\\text{ 升每小时}.$$

> **注意。** 变化量 $24$ 升还不是速率，要平均分到 $3$ 个小时上。用一次读数除以它自己的时间，$74 \\div 5$，把第一次读数之前箱里已有的水也算了进去。`,
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
            `A tank holds $${v1}$ liters after $${h1}$ hours and $${v2}$ liters after $${h1 + dh}$ hours. If it fills steadily, what is the rate, in liters per hour?`,
            `水箱 $${h1}$ 小时后有 $${v1}$ 升，$${h1 + dh}$ 小时后有 $${v2}$ 升。若匀速注水，速率是每小时多少升？`,
          ],
          rate,
          [v2 - v1, Math.round(v2 / (h1 + dh)) === rate ? rate + 1 : Math.round(v2 / (h1 + dh)), rate + dh],
          [
            `**Step 1: the changes.** From the first reading to the second, the volume changes by $${v2} - ${v1} = ${v2 - v1}$ liters, over $${h1 + dh} - ${h1} = ${dh}$ hours.

**Step 2: divide.** The rate is the change in volume per hour: $${v2 - v1} \\div ${dh} = ${rate}$ liters per hour.

**Check.** Starting from $${v1}$ liters and adding $${rate}$ liters in each of the $${dh}$ hours gives $${v1} + ${dh} \\cdot ${rate} = ${v2}$ liters, the second reading.`,
            `**第一步：求变化量。** 从第一次读数到第二次，水量变化 $${v2} - ${v1} = ${v2 - v1}$ 升，经过 $${h1 + dh} - ${h1} = ${dh}$ 小时。

**第二步：相除。** 速率是每小时的水量变化：$${v2 - v1} \\div ${dh} = ${rate}$ 升每小时。

**检验。** 从 $${v1}$ 升开始，$${dh}$ 小时里每小时加 $${rate}$ 升，得 $${v1} + ${dh} \\cdot ${rate} = ${v2}$ 升，正是第二次读数。`,
          ],
        );
      },
    ),
  ],
  "equations-with-parentheses": [subtractingAGroup],
  "elimination-with-one-transformation": [
    skill(
      "the-sum-of-the-unknowns",
      ["The sum of the unknowns", "未知数的和"],
      [
        `Sometimes adding the equations gives the requested quantity at once, with no need to find each unknown. Look at what is asked before starting to solve: if the question wants $x + y$, check whether the coefficients of $x$ add up to the same number as the coefficients of $y$.

Take $3x + 5y = 21$ and $7x + 5y = 29$. The $x$ coefficients add to $3 + 7 = 10$ and the $y$ coefficients to $5 + 5 = 10$, so adding gives $10x + 10y = 50$, that is $10(x + y) = 50$, and $x + y = 5$. Indeed $x = 2$, $y = 3$ fits both: $6 + 15 = 21$ and $14 + 15 = 29$.

> **Watch out.** The sum of the equations is $10(x + y)$, not $x + y$: divide by the common coefficient before answering.`,
        `有时把两个方程相加，就立刻得到所求的量，不必分别求出未知数。开始解之前，先看题目要什么：如果问的是 $x + y$，就看 $x$ 的系数之和是否与 $y$ 的系数之和相等。

看 $3x + 5y = 21$ 和 $7x + 5y = 29$。$x$ 的系数之和是 $3 + 7 = 10$，$y$ 的系数之和是 $5 + 5 = 10$，所以相加得 $10x + 10y = 50$，即 $10(x + y) = 50$，$x + y = 5$。确实，$x = 2$，$y = 3$ 同时满足两个方程：$6 + 15 = 21$，$14 + 15 = 29$。

> **注意。** 两个方程相加得到的是 $10(x + y)$，不是 $x + y$：回答之前要除以公共系数。`,
      ],
      (rng) => {
        const a = rng.int(2, 7);
        const b = rng.int(1, 7);
        const k = 8 + rng.int(0, 6);
        const x = rng.int(-6, 9);
        const y = rng.int(-6, 9);
        const safeD = k - a;
        const safeE = k - b;
        const pr = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return integer(
          [
            `If $${a}x + ${b}y = ${a * x + b * y}$ and $${safeD === 1 ? "" : safeD < 0 ? `(${safeD})` : safeD}x + ${safeE === 1 ? "" : safeE < 0 ? `(${safeE})` : safeE}y = ${safeD * x + safeE * y}$, what is $x + y$?`,
            `若 $${a}x + ${b}y = ${a * x + b * y}$，$${safeD === 1 ? "" : safeD < 0 ? `(${safeD})` : safeD}x + ${safeE === 1 ? "" : safeE < 0 ? `(${safeE})` : safeE}y = ${safeD * x + safeE * y}$，$x + y$ 是多少？`,
          ],
          x + y,
          [k * (x + y), x, y],
          [
            `**Add the equations.** The coefficients of $x$ add to $${a} + ${safeD} = ${k}$ and those of $y$ to $${b} + ${safeE} = ${k}$, so adding gives $${k}x + ${k}y = ${k * (x + y)}$, that is $${k}(x + y) = ${k * (x + y)}$.

**Divide.** Dividing by $${k}$ gives $x + y = ${x + y}$.

**Check.** Solving fully gives $x = ${x}$, $y = ${y}$, which fits both equations: $${a} \\cdot ${pr(x)} + ${b} \\cdot ${pr(y)} = ${a * x + b * y}$ and $${safeD} \\cdot ${pr(x)} + ${safeE} \\cdot ${pr(y)} = ${safeD * x + safeE * y}$. And $${x} + ${pr(y)} = ${x + y}$.`,
            `**两个方程相加。** $x$ 的系数之和是 $${a} + ${safeD} = ${k}$，$y$ 的系数之和是 $${b} + ${safeE} = ${k}$，所以相加得 $${k}x + ${k}y = ${k * (x + y)}$，即 $${k}(x + y) = ${k * (x + y)}$。

**做除法。** 两边除以 $${k}$，得 $x + y = ${x + y}$。

**检验。** 完整解出来是 $x = ${x}$，$y = ${y}$，两个方程都满足：$${a} \\cdot ${pr(x)} + ${b} \\cdot ${pr(y)} = ${a * x + b * y}$，$${safeD} \\cdot ${pr(x)} + ${safeE} \\cdot ${pr(y)} = ${safeD * x + safeE * y}$。而 $${x} + ${pr(y)} = ${x + y}$。`,
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
        `To eliminate a variable by adding, multiply the equations so that its coefficients become opposites. The smallest numbers to aim for are the least common multiple of the two coefficients and its opposite, and each multiplier is what takes its coefficient there.

For $2x + y = 4$ and $3x - y = 1$, the coefficients of $x$ are $2$ and $3$, with least common multiple $6$. Multiply the first equation by $3$ to get $6x$, and the second by $-2$ to get $-6x$. Adding, $6x - 6x = 0$, and $x$ is gone.

> **Watch out.** Each equation is multiplied by the **other** coefficient: $2$ times $2$ would give $4x$, not $6x$. And one multiplier must be negative; with two positive ones the coefficients are equal, and adding doubles $x$ instead of cancelling it.`,
        `要用相加来消去一个变量，就把两个方程分别乘以适当的数，使它的系数互为相反数。最小的目标是两个系数的最小公倍数和它的相反数，每个乘数就是把对应系数变成目标所需的数。

对 $2x + y = 4$ 和 $3x - y = 1$，$x$ 的系数是 $2$ 和 $3$，最小公倍数是 $6$。第一个方程乘以 $3$ 得 $6x$，第二个方程乘以 $-2$ 得 $-6x$。相加时 $6x - 6x = 0$，$x$ 就消去了。

> **注意。** 每个方程乘的是**另一个**方程的系数：$2$ 乘以 $2$ 得 $4x$，不是 $6x$。而且一个乘数必须是负数；两个都是正数时系数相等，相加会让 $x$ 翻倍，而不是抵消。`,
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
            `To eliminate $x$ from $${a}x + ${c}y = 1$ and $${b}x - ${d}y = 2$ by adding them, using the least common multiple of the coefficients of $x$, what should the first and second equations be multiplied by?`,
            `要把 $${a}x + ${c}y = 1$ 和 $${b}x - ${d}y = 2$ 相加来消去 $x$，并用 $x$ 的系数的最小公倍数，第一、第二个方程应分别乘哪两个数？`,
          ],
          `${b} \\text{ and } {-${a}}`,
          [`${a} \\text{ and } {-${b}}`, `${b} \\text{ and } ${a}`, `${lcm} \\text{ and } {-${lcm}}`],
          [
            `**Find the target.** The coefficients of $x$ are $${a}$ and $${b}$, which have no common factor, so their least common multiple is $${a} \\cdot ${b} = ${lcm}$.

**Choose the multipliers.** To get $${lcm}x$ the first equation needs $${b}$, and to get $-${lcm}x$ the second needs $-${a}$. One multiplier is negative so that the coefficients are opposite and cancel when added. The multipliers are $${b}$ and $-${a}$.

**Check.** $${b} \\cdot ${a}x + (-${a}) \\cdot ${b}x = ${lcm}x - ${lcm}x = 0$, so adding the scaled equations eliminates $x$.`,
            `**找目标。** $x$ 的系数是 $${a}$ 和 $${b}$，没有公因数，所以最小公倍数是 $${a} \\cdot ${b} = ${lcm}$。

**选乘数。** 要得到 $${lcm}x$，第一个方程要乘 $${b}$；要得到 $-${lcm}x$，第二个方程要乘 $-${a}$。其中一个乘数是负数，系数才互为相反数，相加时抵消。所以乘数是 $${b}$ 和 $-${a}$。

**检验。** $${b} \\cdot ${a}x + (-${a}) \\cdot ${b}x = ${lcm}x - ${lcm}x = 0$，所以乘过之后相加能消去 $x$。`,
          ],
        );
      },
    ),
  ],
  "representations-of-functions": [
    {
      ...skill(
        "the-rule-behind-a-table",
        ["The rule behind a table", "表格背后的规则"],
        [
          `A table, a rule and a graph can show one function. When the inputs go up by $1$ and the outputs change by the same amount each time, the rule is $y = mx + b$: each extra $1$ of input adds $m$ more, so $m$ is the **change per step**, and $b$ is the output when the input is $0$.

Take the points $(1, 7)$, $(2, 10)$, $(3, 13)$. The outputs go up by $10 - 7 = 3$ and $13 - 10 = 3$, so $m = 3$. Going back one step, from $x = 1$ to $x = 0$, takes $3$ away: $b = 7 - 3 = 4$. The rule is $y = 3x + 4$, and indeed $3(2) + 4 = 10$.

> **Watch out.** The constant is the output at $x = 0$, not the first output in the table: here $7$ is the output at $x = 1$. And the change per step multiplies $x$; it is not the constant.`,
          `表格、规则和图象可以表示同一个函数。当输入每次增加 $1$、输出每次变化同样的量时，规则就是 $y = mx + b$：输入每多 $1$，输出就多 $m$，所以 $m$ 是**每步的变化**，$b$ 是输入为 $0$ 时的输出。

看点 $(1, 7)$、$(2, 10)$、$(3, 13)$。输出依次增加 $10 - 7 = 3$ 和 $13 - 10 = 3$，所以 $m = 3$。往回退一步，从 $x = 1$ 到 $x = 0$，要减去 $3$：$b = 7 - 3 = 4$。规则是 $y = 3x + 4$，验证：$3(2) + 4 = 10$。

> **注意。** 常数是 $x = 0$ 时的输出，不是表中的第一个输出：这里的 $7$ 是 $x = 1$ 时的输出。另外，每步的变化是 $x$ 的系数，不是常数。`,
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
              `**Step 1: the change per step.** From $x = 1$ to $x = 2$ the output goes from $${m + b}$ to $${2 * m + b}$, a change of $${m}$; from $x = 2$ to $x = 3$ it changes by $${m}$ again. So $m = ${m}$.

**Step 2: the output at $x = 0$.** Step back from $x = 1$ to $x = 0$ by undoing one change: $${m + b}${m < 0 ? ` + ${-m}` : ` - ${m}`} = ${b}$. So $b = ${b}$, and the rule is $${line(m, b)}$.

**Check.** At $x = 3$ the rule gives $${m}(3)${signed(b)} = ${3 * m + b}$, the last point of the list.`,
              `**第一步：每步的变化。** 从 $x = 1$ 到 $x = 2$，输出从 $${m + b}$ 变为 $${2 * m + b}$，变化 $${m}$；从 $x = 2$ 到 $x = 3$，又变化 $${m}$。所以 $m = ${m}$。

**第二步：$x = 0$ 时的输出。** 从 $x = 1$ 退回到 $x = 0$，撤销一次变化：$${m + b}${m < 0 ? ` + ${-m}` : ` - ${m}`} = ${b}$。所以 $b = ${b}$，规则是 $${line(m, b)}$。

**检验。** 当 $x = 3$ 时，规则给出 $${m}(3)${signed(b)} = ${3 * m + b}$，正是最后一个点。`,
            ],
          );
        },
      ),
      figure: gradeDrawings5["representations-of-functions#the-rule-behind-a-table"],
    },
  ],
  "increasing-and-decreasing": [
    skill(
      "from-a-table-of-values",
      ["From a table of values", "由数值表判断"],
      [
        `A table shows only some points of a graph, but reading it in order of the input still shows the direction: where each output is larger than the one before, the function is going up, **increasing**; where it is smaller, it is going down, **decreasing**. The input where the direction changes is the **turning point**.

For the outputs $1, 4, 6, 5, 2$ at $x = 0, 1, 2, 3, 4$, the changes from one output to the next are $+3, +2, -1, -3$. The function rises up to $x = 2$ and falls after it, so it stops increasing at $x = 2$, where its output $6$ is the largest.

> **Watch out.** The answer is the input at the turn, $2$, not the output $6$ there. And it is the last input of the rise, not the first input after it, $3$: the function climbs all the way to $x = 2$.`,
        `数值表只给出图象上的一些点，但按输入的顺序读表，仍然能看出方向：每个输出都比前一个大的地方，函数在上升，即**递增**；比前一个小的地方，函数在下降，即**递减**。方向改变处的输入就是**转折点**。

对于 $x = 0, 1, 2, 3, 4$ 处的输出 $1, 4, 6, 5, 2$，相邻输出的变化是 $+3, +2, -1, -3$。函数一直上升到 $x = 2$，之后下降，所以它在 $x = 2$ 处停止递增，此时输出 $6$ 最大。

> **注意。** 答案是转折处的输入 $2$，而不是那里的输出 $6$。另外，它是上升段的最后一个输入，而不是之后的第一个输入 $3$：函数一直升到 $x = 2$。`,
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
        const changes = steps.map((s) => (s > 0 ? `+${s}` : `${s}`)).join(", ");
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
            `**Step 1: the changes.** Going from each output to the next, the changes are $${changes}$.

**Step 2: find the turn.** The changes are ${flip ? "negative" : "positive"} up to $x = ${turn}$ and ${flip ? "positive" : "negative"} after it, so the function ${flip ? "decreases" : "increases"} until $x = ${turn}$ and stops there.

**Check.** At $x = ${turn}$ the output is $${ys[turn]}$, the ${flip ? "smallest" : "largest"} in the table, as it must be where a ${flip ? "fall" : "rise"} ends.`,
            `**第一步：看变化。** 从每个输出到下一个，变化依次是 $${changes}$。

**第二步：找转折点。** 到 $x = ${turn}$ 为止变化都是${flip ? "负" : "正"}的，之后都是${flip ? "正" : "负"}的，所以函数${flip ? "递减" : "递增"}到 $x = ${turn}$ 为止。

**检验。** $x = ${turn}$ 处的输出是 $${ys[turn]}$，是表中最${flip ? "小" : "大"}的，${flip ? "下降" : "上升"}结束的地方正应如此。`,
          ],
        );
      },
    ),
  ],
  "adding-integers": [addingALongList],
  "subtracting-integers": [theDistanceBetweenTwoNumbers],
  "multiplying-integers": [theSignFromACountOfNegatives],
  "dividing-integers": [anAverageChange],
  "powers-of-integers": [thePowerOfAPowerOfANegative],
  "order-of-operations-with-integers": [aFractionBarGroups],
  "evaluating-expressions": [aFormulaFromAStory],
  "distributive-property": [theFactorThatWasPulledOut],
  "simplifying-expressions": [thePerimeterAsAnExpression],
  "correlation-and-causation": [
    skill(
      "the-hidden-third-factor",
      ["The hidden third factor", "隐藏的第三个因素"],
      [
        `Two quantities can rise together because a third one drives both: when the third factor goes up, it pushes up each of them, so they move together although neither affects the other. Before believing that one causes the other, look for a factor that could explain them both.

Ice cream sales and sunburn cases rise together over a year. Hot, sunny weather makes people buy ice cream and also makes them burn, so it explains both.

> **Watch out.** The third factor must affect **both** quantities. A factor linked to only one of them, such as the price of ice cream, cannot make the two move together, and neither can a detail that affects neither.`,
        `两个量可能因为第三个量同时推动而一起上升：第三个因素增加时，它分别推高这两个量，所以即使谁也不影响谁，它们也会一起变化。相信其中一个导致另一个之前，先找能同时解释两者的因素。

一年中冰淇淋销量和晒伤人数一起上升。炎热晴朗的天气让人们买冰淇淋，也让人们晒伤，所以它能解释二者。

> **注意。** 第三个因素必须影响**两个**量。只与其中一个有关的因素，比如冰淇淋的价格，不能让二者一起变化；对二者都没有影响的细节也不能。`,
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
              ["the flavor of the ice cream", "冰淇淋的口味"],
              ["the brand of the sunscreen", "防晒霜的品牌"],
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
              ["the color of the school uniform", "校服的颜色"],
              ["the length of the school day", "每天上学的时长"],
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
              ["the size of the fire station", "消防站的大小"],
              ["the name of the street", "街道的名称"],
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
              ["the brand of the heater", "取暖器的品牌"],
              ["the flavor of the marshmallows", "棉花糖的口味"],
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
              ["the shape of the menus", "菜单的形状"],
              ["the length of the park paths", "公园小路的长度"],
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
          rng.sample([...one.w], 3),
          [
            `**Step 1: What the factor must do.** To explain the correlation, a third factor must push up both ${one.a[0]} and ${one.b[0]}.\n\n**Step 2: Test the choices.** ${one.c[0][0]!.toUpperCase()}${one.c[0].slice(1)} raises each of them, so it drives both quantities, and neither needs to cause the other. The other choices affect at most one of the two quantities.\n\n**Check.** Among cases alike in ${one.c[0]}, the two quantities would no longer be expected to rise together.`,
            `**第一步：这个因素必须做到什么。** 要解释这种相关，第三个因素必须同时推高${one.a[1]}和${one.b[1]}。\n\n**第二步：检验各个选项。** “${one.c[1]}”会同时推高二者，所以它推动了这两个量，不必是其中一个导致另一个。其余选项至多只影响其中一个量。\n\n**检验。** 在“${one.c[1]}”相同的情况下，这两个量就不会再一起上升了。`,
          ],
        );
      },
    ),
  ],
};
