import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, poly, Q, sketch } from "@ga/subject-math";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";

import { article, numberProblem, solutionsProblem, why, whySet } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf, type Poly, pAt, par, pDer, pLatex, rounded } from "./calculus-common.ts";
import { fmt, walked } from "./calculus-i-differentiation.ts";

// Calculus I unit 7: Analytical Applications of Differentiation, modules 7.21 and 7.22.

/** Why is a value that a typical mistake produces, with what to say about it. */
type Why = ReturnType<typeof why>;

/** asQ reads the value of a mistake as an exact number. */
const asQ = (v: Why["value"]) => (v instanceof Q ? v : Q.of(Number(v)));

/** distinct keeps the first reason for each value, so that one wrong answer gets one reason. */
const distinct = (ms: readonly Why[]) => ms.filter((m, i) => ms.findIndex((n) => asQ(n.value).eq(asQ(m.value))) === i);

/** L writes a rational number in LaTeX. */
const L = (q: Q) => q.toLatex();

/** big writes a rational number in LaTeX, in tall parentheses when it is negative. */
const big = (q: Q) => (q.sign() < 0 ? `\\left(${L(q)}\\right)` : L(q));

/** solvingOptimizationProblemsUsingDerivatives maximizes and minimizes quantities described in words. */
export const solvingOptimizationProblemsUsingDerivatives: TopicDef = {
  id: "solving-optimization-problems-using-derivatives",
  title: t("Solving Optimization Problems Using Derivatives", "用导数解最优化问题"),
  summary: t(
    "Model a quantity as a function of one variable and find its greatest or least value.",
    "把一个量表示成单变量函数，并求它的最大值或最小值。",
  ),
  intro: t(
    "Two numbers add up to $10$. Their product depends on how the $10$ is split: $2 \\cdot 8 = 16$, $4 \\cdot 6 = 24$, $5 \\cdot 5 = 25$, $6 \\cdot 4 = 24$. It seems to peak at $5 \\cdot 5$. Writing the product as $P(x) = x(10 - x)$ settles it: $P'(x) = 10 - 2x$ is $0$ at $x = 5$, and $P$ rises before and falls after.\n\nCheck: $P(4.9) = 4.9 \\cdot 5.1 = 24.99$ and $P(5.1) = 5.1 \\cdot 4.9 = 24.99$, both just below $25$.\n\nIn this lesson we turn a problem in words into a function of one variable, using the condition that links the quantities, and find its greatest or least value with the derivative.",
    "两个数之和是 $10$。它们的乘积取决于 $10$ 怎样分：$2 \\cdot 8 = 16$，$4 \\cdot 6 = 24$，$5 \\cdot 5 = 25$，$6 \\cdot 4 = 24$。看起来在 $5 \\cdot 5$ 处最大。把乘积写成 $P(x) = x(10 - x)$ 就能确定：$P'(x) = 10 - 2x$ 在 $x = 5$ 处为 $0$，$P$ 在此之前增大，之后减小。\n\n检验：$P(4.9) = 4.9 \\cdot 5.1 = 24.99$，$P(5.1) = 5.1 \\cdot 4.9 = 24.99$，都略小于 $25$。\n\n本课我们把文字描述的问题化为单变量函数，利用联系各个量的条件，再用导数求它的最大值或最小值。",
  ),
  prerequisites: ["the-candidates-test"],
  encompasses: [{ topic: "the-candidates-test", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "optimizing-numbers",
      title: t("Optimizing numbers", "数的最优化"),
      explanation: t(
        "An optimization problem:\n\n1. Name the variables and write the quantity to optimize.\n2. Use the constraint to write it in terms of one variable, and note the allowed interval.\n3. Find the critical points and check that the one you pick gives the maximum or minimum.\n\nFor two numbers with sum $20$, the product is $P(x) = x(20 - x)$; $P'(x) = 20 - 2x = 0$ at $x = 10$, and $P''(x) = -2 < 0$, so the greatest product is $10 \\cdot 10 = 100$.\n\nCheck: $P(9) = 9 \\cdot 11 = 99$ and $P(11) = 11 \\cdot 9 = 99$, both less than $100$.\n\n> **Watch out.** Answer the question that is asked. Here the critical point is $x = 10$, but the greatest product is $P(10) = 100$.",
        "解最优化问题：\n\n1. 设出变量，写出要优化的量。\n2. 用约束条件把它化为单变量函数，并注明取值区间。\n3. 求临界点，并检验所选的点给出最大值或最小值。\n\n两数之和为 $20$ 时，乘积为 $P(x) = x(20 - x)$；$P'(x) = 20 - 2x = 0$ 于 $x = 10$，且 $P''(x) = -2 < 0$，所以最大乘积为 $10 \\cdot 10 = 100$。\n\n检验：$P(9) = 9 \\cdot 11 = 99$，$P(11) = 11 \\cdot 9 = 99$，都小于 $100$。\n\n> **注意。** 回答题目问的量。这里临界点是 $x = 10$，而最大乘积是 $P(10) = 100$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const s = 2 * rng.int(3, 30);
          const h = s / 2;
          const answer = h * h;
          return numberProblem({
            prompt: t(
              `Two numbers have sum $${s}$. What is the greatest possible value of their product?`,
              `两数之和为 $${s}$。它们乘积的最大可能值是多少？`,
            ),
            answer,
            mistakes: distinct([
              why(
                h,
                `This is the number $x = ${h}$ that gives the greatest product; the question asks for the product itself.`,
                `这是使乘积最大的数 $x = ${h}$；题目问的是乘积本身。`,
              ),
              why(
                s * s,
                `This squares the sum; each number is only half of it, $${h}$.`,
                `这是把和平方了；每个数只是和的一半，即 $${h}$。`,
              ),
              why(
                Q.of(s * s, 2),
                `This adds the squares of the two numbers, $${h}^{2} + ${h}^{2}$, instead of multiplying them.`,
                `这是把两个数的平方相加，即 $${h}^{2} + ${h}^{2}$，而不是把它们相乘。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the product in one variable", "把乘积写成单变量函数"],
                  t(
                    `The numbers are $x$ and $${s} - x$, so $P(x) = x(${s} - x) = ${s}x - x^{2}$.`,
                    `两数为 $x$ 和 $${s} - x$，所以 $P(x) = x(${s} - x) = ${s}x - x^{2}$。`,
                  ),
                ],
                [
                  ["Find the critical point", "求临界点"],
                  t(
                    `$P'(x) = ${s} - 2x$ is $0$ at $x = ${h}$, and $P''(x) = -2 < 0$, so this is a maximum.`,
                    `$P'(x) = ${s} - 2x$ 在 $x = ${h}$ 处为 $0$，且 $P''(x) = -2 < 0$，所以这是最大值。`,
                  ),
                ],
                [
                  ["Evaluate the product", "求乘积"],
                  t(
                    `Both numbers are $${h}$, so $P = ${h} \\cdot ${h} = ${answer}$.`,
                    `两个数都是 $${h}$，所以 $P = ${h} \\cdot ${h} = ${answer}$。`,
                  ),
                ],
              ],
              t(
                `Moving one unit away gives $${h - 1} \\cdot ${h + 1} = ${answer - 1}$, which is smaller, and the same on the other side.`,
                `偏离一个单位得 $${h - 1} \\cdot ${h + 1} = ${answer - 1}$，更小；向另一边偏离也一样。`,
              ),
            ),
          });
        }
        const m = rng.int(2, 15);
        const p = m * m;
        const next = Q.of(m + 1).add(Q.of(p, m + 1));
        return numberProblem({
          prompt: t(
            `Two positive numbers have product $${p}$. What is the least possible value of their sum?`,
            `两个正数之积为 $${p}$。它们之和的最小可能值是多少？`,
          ),
          answer: 2 * m,
          mistakes: distinct([
            why(
              m,
              `This is one of the numbers, $x = ${m}$; the question asks for their sum.`,
              `这是其中一个数 $x = ${m}$；题目问的是它们的和。`,
            ),
            why(
              p + 1,
              `This is the sum of $1$ and $${p}$. Their product is $${p}$, but their sum is not the least.`,
              `这是 $1$ 与 $${p}$ 的和。它们的积是 $${p}$，但和不是最小的。`,
            ),
            why(
              Q.of(p, 2).add(Q.of(2)),
              `This solves $x^{2} = ${p}$ as $x = \\frac{${p}}{2}$; $x$ is the square root of $${p}$.`,
              `这把 $x^{2} = ${p}$ 解成了 $x = \\frac{${p}}{2}$；$x$ 应是 $${p}$ 的平方根。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the sum in one variable", "把和写成单变量函数"],
                t(
                  `The numbers are $x$ and $\\frac{${p}}{x}$, so $S(x) = x + \\frac{${p}}{x}$ for $x > 0$.`,
                  `两数为 $x$ 和 $\\frac{${p}}{x}$，所以 $S(x) = x + \\frac{${p}}{x}$，$x > 0$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `$S'(x) = 1 - \\frac{${p}}{x^{2}} = 0$ when $x^{2} = ${p}$, so $x = ${m}$; $S''(x) = \\frac{${2 * p}}{x^{3}} > 0$, so this is a minimum.`,
                  `$S'(x) = 1 - \\frac{${p}}{x^{2}} = 0$ 时 $x^{2} = ${p}$，所以 $x = ${m}$；$S''(x) = \\frac{${2 * p}}{x^{3}} > 0$，所以这是最小值。`,
                ),
              ],
              [
                ["Evaluate the sum", "求和"],
                t(
                  `$S = ${m} + \\frac{${p}}{${m}} = ${m} + ${m} = ${2 * m}$.`,
                  `$S = ${m} + \\frac{${p}}{${m}} = ${m} + ${m} = ${2 * m}$。`,
                ),
              ],
            ],
            t(
              `Try a neighbour: $x = ${m + 1}$ gives $${m + 1} + \\frac{${p}}{${m + 1}} = ${L(next)}$, which is more than $${2 * m}$.`,
              `试一个相邻的值：$x = ${m + 1}$ 时，$${m + 1} + \\frac{${p}}{${m + 1}} = ${L(next)}$，比 $${2 * m}$ 大。`,
            ),
          ),
        });
      },
    },
    {
      id: "optimizing-fenced-areas",
      figure: calculusDrawings3["solving-optimization-problems-using-derivatives#optimizing-fenced-areas"],
      title: t("Optimizing fenced areas", "围栏面积的最优化"),
      explanation: t(
        "A rectangle fenced on three sides, against a wall, with $L$ m of fence: if the two sides perpendicular to the wall have length $x$, the third has length $L - 2x$ and $A(x) = x(L - 2x)$ for $0 < x < \\frac{L}{2}$. $A'(x) = L - 4x = 0$ at $x = \\frac{L}{4}$, giving $A = \\frac{L^{2}}{8}$.\n\nFor example, with $40$ m of fence, $x = 10$ and the field is $10$ m by $20$ m, an area of $200$ m².\n\nCheck: $A(9) = 9 \\cdot 22 = 198$ and $A(11) = 11 \\cdot 18 = 198$, both less than $200$.\n\n> **Watch out.** Only three sides use fence, and two of them have length $x$, so the side along the wall is $L - 2x$, not $L - x$. The best field is not a square: it is twice as long as it is deep.",
        "靠墙用 $L$ 米围栏围成三面的矩形：若垂直于墙的两边长为 $x$，第三边长为 $L - 2x$，$A(x) = x(L - 2x)$，$0 < x < \\frac{L}{2}$。$A'(x) = L - 4x = 0$ 于 $x = \\frac{L}{4}$，得 $A = \\frac{L^{2}}{8}$。\n\n例如有 $40$ 米围栏时，$x = 10$，田地为 $10$ 米乘 $20$ 米，面积 $200$ 平方米。\n\n检验：$A(9) = 9 \\cdot 22 = 198$，$A(11) = 11 \\cdot 18 = 198$，都小于 $200$。\n\n> **注意。** 只有三面用围栏，其中两面长为 $x$，所以沿墙的一边是 $L - 2x$，不是 $L - x$。最佳的田地不是正方形：它的长是宽的两倍。",
      ),
      generate(rng) {
        const wall = rng.bool();
        const len = 4 * rng.int(5, 50);
        const x = len / 4;
        if (wall) {
          const answer = x * (len - 2 * x);
          const near = (y: number) => y * (len - 2 * y);
          return numberProblem({
            prompt: t(
              `A farmer has $${len}$ m of fence to enclose a rectangular field along a straight river, with no fence needed along the river. What is the largest area that can be enclosed, in square metres?`,
              `农夫有 $${len}$ 米围栏，要沿一条笔直的河围出一块矩形田地，沿河一边不需要围栏。最多能围出多少平方米？`,
            ),
            answer,
            unit: "m^2",
            mistakes: distinct([
              why(
                Q.of(len * len, 16),
                `This is a square of side $\\frac{${len}}{4} = ${x}$, which would need fence on all four sides; along the river only three sides need fence.`,
                `这是边长为 $\\frac{${len}}{4} = ${x}$ 的正方形，需要四面围栏；沿河只需三面。`,
              ),
              why(
                Q.of(len * len, 9),
                `This makes the three fenced sides equal, $\\frac{${len}}{3}$ each; the best field has the side along the river twice as long as each other side.`,
                `这是让三面围栏一样长，各为 $\\frac{${len}}{3}$；最佳的田地沿河的一边是另两边的两倍长。`,
              ),
              why(
                Q.of(len * len, 4),
                `This uses $${len} - x$ for the side along the river; there are two sides of length $x$, so it is $${len} - 2x$.`,
                `这把沿河的边当成了 $${len} - x$；长为 $x$ 的边有两条，所以应是 $${len} - 2x$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the area in one variable", "把面积写成单变量函数"],
                  t(
                    `Let the two sides perpendicular to the river be $x$; the side along it is $${len} - 2x$, so $A(x) = x(${len} - 2x)$ for $0 < x < ${len / 2}$.`,
                    `设垂直于河的两边长为 $x$，沿河的边长为 $${len} - 2x$，所以 $A(x) = x(${len} - 2x)$，$0 < x < ${len / 2}$。`,
                  ),
                ],
                [
                  ["Find the critical point", "求临界点"],
                  t(
                    `$A'(x) = ${len} - 4x = 0$ at $x = ${x}$, and $A''(x) = -4 < 0$, so this is a maximum.`,
                    `$A'(x) = ${len} - 4x = 0$ 于 $x = ${x}$，且 $A''(x) = -4 < 0$，所以这是最大值。`,
                  ),
                ],
                [
                  ["Evaluate the area", "求面积"],
                  t(
                    `The field is $${x}$ m by $${len - 2 * x}$ m, so $A = ${answer}$ m².`,
                    `田地为 $${x}$ 米乘 $${len - 2 * x}$ 米，所以 $A = ${answer}$ 平方米。`,
                  ),
                ],
              ],
              t(
                `One metre either way gives less: $A(${x - 1}) = ${x - 1} \\cdot ${len - 2 * x + 2} = ${near(x - 1)}$ and $A(${x + 1}) = ${x + 1} \\cdot ${len - 2 * x - 2} = ${near(x + 1)}$.`,
                `向任一边偏离 $1$ 米都更小：$A(${x - 1}) = ${x - 1} \\cdot ${len - 2 * x + 2} = ${near(x - 1)}$，$A(${x + 1}) = ${x + 1} \\cdot ${len - 2 * x - 2} = ${near(x + 1)}$。`,
              ),
            ),
          });
        }
        const half = len / 2;
        return numberProblem({
          prompt: t(
            `A rectangle has perimeter $${len}$ cm. What is its largest possible area, in square centimetres?`,
            `一个矩形周长为 $${len}$ 厘米。它的面积最大可能是多少平方厘米？`,
          ),
          answer: x * x,
          unit: "cm^2",
          mistakes: distinct([
            why(
              half * half,
              `This squares half the perimeter, $${half}$; the best rectangle is a square whose side is a quarter of the perimeter, $${x}$.`,
              `这是把半周长 $${half}$ 平方了；最佳的矩形是正方形，边长是周长的四分之一，即 $${x}$。`,
            ),
            why(
              Q.of(len * len, 8),
              "This is the best area against a wall, with fence on three sides; here all four sides count.",
              "这是靠墙、三面围栏时的最大面积；这里四条边都要算。",
            ),
            why(len, "This is the perimeter. The question asks for the largest area.", "这是周长。题目问的是最大面积。"),
          ]),
          solution: walked(
            [
              [
                ["Write the area in one variable", "把面积写成单变量函数"],
                t(
                  `With width $x$, the length is $${half} - x$, so $A(x) = x(${half} - x)$ for $0 < x < ${half}$.`,
                  `设宽为 $x$，则长为 $${half} - x$，所以 $A(x) = x(${half} - x)$，$0 < x < ${half}$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `$A'(x) = ${half} - 2x = 0$ at $x = ${x}$, and $A''(x) = -2 < 0$, so this is a maximum.`,
                  `$A'(x) = ${half} - 2x = 0$ 于 $x = ${x}$，且 $A''(x) = -2 < 0$，所以这是最大值。`,
                ),
              ],
              [
                ["Evaluate the area", "求面积"],
                t(
                  `The rectangle is a square of side $${x}$, with area $${x * x}$ cm².`,
                  `矩形是边长为 $${x}$ 的正方形，面积为 $${x * x}$ 平方厘米。`,
                ),
              ],
            ],
            t(
              `A rectangle $1$ cm off square, $${x - 1}$ by $${x + 1}$, has the same perimeter and area $${x * x - 1}$, less than $${x * x}$.`,
              `偏离正方形 $1$ 厘米的矩形，$${x - 1}$ 乘 $${x + 1}$，周长相同，面积为 $${x * x - 1}$，小于 $${x * x}$。`,
            ),
          ),
        });
      },
    },
  ],
};

const sectorPoint = (a: number, r = 4): Point => [r * Math.cos(a), r * Math.sin(a)];

/** sectorFigure shows a sector of radius r and angle θ radians, whose arc has length rθ; drawn at the best angle, θ = 2. */
const sectorFigure: Figure = {
  svg: sketch([
    { kind: "segment", a: [0, 0], b: sectorPoint(0.6) },
    { kind: "segment", a: [0, 0], b: sectorPoint(2.6) },
    ...Array.from(
      { length: 40 },
      (_, i): Mark => ({
        kind: "segment",
        a: sectorPoint(0.6 + (2 * i) / 40),
        b: sectorPoint(0.6 + (2 * (i + 1)) / 40),
      }),
    ),
    { kind: "arc", vertex: [0, 0], from: sectorPoint(0.6), to: sectorPoint(2.6), label: "θ" },
    { kind: "side", a: sectorPoint(0.6), b: [0, 0], text: "r" },
    { kind: "side", a: [0, 0], b: sectorPoint(2.6), text: "r" },
    { kind: "label", at: sectorPoint(1.6), text: "rθ", dir: "n" },
  ]),
  alt: t(
    "A sector of radius r with central angle θ radians; its arc has length rθ and its perimeter is 2r + rθ.",
    "半径为 r、圆心角为 θ 弧度的扇形；弧长为 rθ，周长为 2r + rθ。",
  ),
};

/** sectorSteps writes the steps that find the best radius of a sector with perimeter P. */
function sectorSteps(P: number) {
  const r = P / 4;
  return [
    [
      ["Write the arc in terms of $r$", "用 $r$ 表示弧长"],
      t(
        `The perimeter is $2r + r\\theta = ${P}$, so the arc is $r\\theta = ${P} - 2r$.`,
        `周长 $2r + r\\theta = ${P}$，所以弧长 $r\\theta = ${P} - 2r$。`,
      ),
    ],
    [
      ["Write the area", "写出面积"],
      t(
        `$A(r) = \\frac{1}{2}r^{2}\\theta = \\frac{1}{2}r \\cdot r\\theta = \\frac{1}{2}r(${P} - 2r) = ${P / 2}r - r^{2}$.`,
        `$A(r) = \\frac{1}{2}r^{2}\\theta = \\frac{1}{2}r \\cdot r\\theta = \\frac{1}{2}r(${P} - 2r) = ${P / 2}r - r^{2}$。`,
      ),
    ],
    [
      ["Find the critical point", "求临界点"],
      t(
        `$A'(r) = ${P / 2} - 2r = 0$ at $r = ${r}$, and $A''(r) = -2 < 0$, so this is a maximum. The arc is $${P} - ${2 * r} = ${P - 2 * r}$, so $\\theta = \\frac{${P - 2 * r}}{${r}} = 2$.`,
        `$A'(r) = ${P / 2} - 2r = 0$ 于 $r = ${r}$，且 $A''(r) = -2 < 0$，所以这是最大值。弧长为 $${P} - ${2 * r} = ${P - 2 * r}$，所以 $\\theta = \\frac{${P - 2 * r}}{${r}} = 2$。`,
      ),
    ],
  ] as const;
}

/** optimizationProblemsInvolvingSectorsOfCircles optimizes sectors with a fixed perimeter. */
export const optimizationProblemsInvolvingSectorsOfCircles: TopicDef = {
  id: "optimization-problems-involving-sectors-of-circles",
  title: t("Optimization Problems Involving Sectors of Circles", "涉及扇形的最优化问题"),
  summary: t("Maximize the area of a sector with a fixed perimeter.", "在周长固定时求扇形面积的最大值。"),
  intro: t(
    "A sector has a perimeter of $20$ cm: two radii and an arc. Radius $4$ leaves $12$ cm of arc, and the area is $\\frac{1}{2} \\cdot 4 \\cdot 12 = 24$ cm². Radius $5$ leaves $10$ cm, an area of $\\frac{1}{2} \\cdot 5 \\cdot 10 = 25$ cm². Radius $6$ leaves $8$ cm, an area of $24$ cm² again. The best radius is between, at $5$.\n\nCheck: with $r = 5$ the angle is $\\theta = \\frac{10}{5} = 2$ radians, and $\\frac{1}{2}r^{2}\\theta = \\frac{1}{2} \\cdot 25 \\cdot 2 = 25$, the same area.\n\nIn this lesson we write the area of a sector with a fixed perimeter as a function of its radius, and find the radius, the angle and the area of the largest one.",
    "一个扇形的周长是 $20$ 厘米：两条半径加一段弧。半径为 $4$ 时弧长剩 $12$ 厘米，面积为 $\\frac{1}{2} \\cdot 4 \\cdot 12 = 24$ 平方厘米。半径为 $5$ 时弧长 $10$ 厘米，面积为 $\\frac{1}{2} \\cdot 5 \\cdot 10 = 25$ 平方厘米。半径为 $6$ 时弧长 $8$ 厘米，面积又是 $24$ 平方厘米。最佳半径在中间，为 $5$。\n\n检验：$r = 5$ 时圆心角 $\\theta = \\frac{10}{5} = 2$ 弧度，$\\frac{1}{2}r^{2}\\theta = \\frac{1}{2} \\cdot 25 \\cdot 2 = 25$，面积相同。\n\n本课我们把周长固定的扇形面积写成半径的函数，求出最大扇形的半径、圆心角和面积。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives", "calculating-areas-of-sectors-using-radians"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-radius-of-the-largest-sector",
      title: t("The radius of the largest sector", "最大扇形的半径"),
      explanation: t(
        "A sector of radius $r$ and angle $\\theta$ (in radians) has arc length $r\\theta$, perimeter $P = 2r + r\\theta$ and area $A = \\frac{1}{2}r^{2}\\theta$. With $P$ fixed, $r\\theta = P - 2r$, so $A(r) = \\frac{1}{2}r(P - 2r)$. Then $A'(r) = \\frac{P}{2} - 2r = 0$ at $r = \\frac{P}{4}$, where $\\theta = 2$.\n\nFor example, with $P = 20$ the best radius is $5$ and the arc is $20 - 10 = 10$.\n\nCheck: $A(4) = \\frac{1}{2} \\cdot 4 \\cdot 12 = 24$ and $A(6) = \\frac{1}{2} \\cdot 6 \\cdot 8 = 24$, both less than $A(5) = 25$.\n\n> **Watch out.** The perimeter includes both radii, so the arc is $P - 2r$, not $P - r$. The formulas $r\\theta$ and $\\frac{1}{2}r^{2}\\theta$ need $\\theta$ in radians.",
        "半径为 $r$、圆心角为 $\\theta$（弧度）的扇形，弧长为 $r\\theta$，周长 $P = 2r + r\\theta$，面积 $A = \\frac{1}{2}r^{2}\\theta$。$P$ 固定时，$r\\theta = P - 2r$，所以 $A(r) = \\frac{1}{2}r(P - 2r)$。$A'(r) = \\frac{P}{2} - 2r = 0$ 于 $r = \\frac{P}{4}$，此时 $\\theta = 2$。\n\n例如 $P = 20$ 时最佳半径为 $5$，弧长为 $20 - 10 = 10$。\n\n检验：$A(4) = \\frac{1}{2} \\cdot 4 \\cdot 12 = 24$，$A(6) = \\frac{1}{2} \\cdot 6 \\cdot 8 = 24$，都小于 $A(5) = 25$。\n\n> **注意。** 周长包括两条半径，所以弧长是 $P - 2r$，不是 $P - r$。公式 $r\\theta$ 和 $\\frac{1}{2}r^{2}\\theta$ 要求 $\\theta$ 用弧度。",
      ),
      figure: sectorFigure,
      generate(rng) {
        const P = 4 * rng.int(2, 30);
        const askAngle = rng.bool(0.3);
        const r = P / 4;
        return numberProblem({
          prompt: askAngle
            ? t(
                `A sector of a circle has perimeter $${P}$ cm. Find the angle of the sector, in radians, that makes its area as large as possible.`,
                `一个扇形的周长为 $${P}$ 厘米。求使其面积最大的圆心角（弧度）。`,
              )
            : t(
                `A sector of a circle has perimeter $${P}$ cm. Find the radius, in cm, that makes its area as large as possible.`,
                `一个扇形的周长为 $${P}$ 厘米。求使其面积最大的半径（厘米）。`,
              ),
          answer: askAngle ? 2 : r,
          mistakes: distinct(
            askAngle
              ? [
                  why(
                    1,
                    `This counts only one radius in the perimeter, so the arc is $${P} - r$; with both radii the arc is $${P} - 2r$ and $\\theta = 2$.`,
                    `这在周长中只算了一条半径，弧长成了 $${P} - r$；算上两条半径，弧长是 $${P} - 2r$，$\\theta = 2$。`,
                  ),
                  why(
                    r,
                    `This is the best radius, $r = ${r}$; the question asks for the angle.`,
                    `这是最佳半径 $r = ${r}$；题目问的是圆心角。`,
                  ),
                  why(
                    4,
                    `This divides the whole perimeter by the radius; the two radii are part of the perimeter, so $\\theta = \\frac{${P} - 2r}{r}$.`,
                    `这是用整个周长除以半径；两条半径也是周长的一部分，所以 $\\theta = \\frac{${P} - 2r}{r}$。`,
                  ),
                ]
              : [
                  why(
                    P / 2,
                    `This counts only one radius in the perimeter, so the arc is $${P} - r$ and the area $\\frac{1}{2}r(${P} - r)$ peaks at $r = ${P / 2}$.`,
                    `这在周长中只算了一条半径，弧长成了 $${P} - r$，面积 $\\frac{1}{2}r(${P} - r)$ 在 $r = ${P / 2}$ 处最大。`,
                  ),
                  why(
                    Q.of(P, 3),
                    "This shares the perimeter equally among the two radii and the arc; the best arc is twice the radius.",
                    "这是把周长平均分给两条半径和弧；最佳的弧长是半径的两倍。",
                  ),
                ],
          ),
          solution: walked(
            sectorSteps(P),
            t(
              `One centimetre either way gives less: $A(${r - 1}) = ${r * r - 1}$ and $A(${r + 1}) = ${r * r - 1}$, while $A(${r}) = ${r * r}$.`,
              `向任一边偏离 $1$ 厘米都更小：$A(${r - 1}) = ${r * r - 1}$，$A(${r + 1}) = ${r * r - 1}$，而 $A(${r}) = ${r * r}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-area-of-the-largest-sector",
      title: t("The area of the largest sector", "最大扇形的面积"),
      explanation: t(
        "Once the best radius is found, substitute back. With perimeter $P$, the best sector has $r = \\frac{P}{4}$ and $\\theta = 2$, so $A = \\frac{1}{2}\\left(\\frac{P}{4}\\right)^{2} \\cdot 2 = \\frac{P^{2}}{16}$.\n\nFor example, with $P = 20$ m the best sector has $r = 5$ m and area $\\frac{400}{16} = 25$ m².\n\nCheck: an angle of $2$ radians is $\\frac{2}{2\\pi}$ of a full turn, so the sector is $\\frac{1}{\\pi}$ of a circle of area $25\\pi$, which is $25$ m².\n\n> **Watch out.** Substitute the best radius into the area, and keep both factors of $A = \\frac{1}{2}r^{2}\\theta$: the $\\frac{1}{2}$ and $\\theta = 2$ cancel, so $A = r^{2}$.",
        "求出最佳半径后代回。周长为 $P$ 时，最佳扇形 $r = \\frac{P}{4}$，$\\theta = 2$，所以 $A = \\frac{1}{2}\\left(\\frac{P}{4}\\right)^{2} \\cdot 2 = \\frac{P^{2}}{16}$。\n\n例如 $P = 20$ 米时，最佳扇形 $r = 5$ 米，面积为 $\\frac{400}{16} = 25$ 平方米。\n\n检验：$2$ 弧度是一整圈的 $\\frac{2}{2\\pi}$，所以扇形是面积为 $25\\pi$ 的圆的 $\\frac{1}{\\pi}$，即 $25$ 平方米。\n\n> **注意。** 把最佳半径代入面积公式，并保留 $A = \\frac{1}{2}r^{2}\\theta$ 中的两个因子：$\\frac{1}{2}$ 和 $\\theta = 2$ 相互抵消，所以 $A = r^{2}$。",
      ),
      figure: sectorFigure,
      generate(rng) {
        const P = 4 * rng.int(2, 30);
        const r = P / 4;
        const answer = r * r;
        return numberProblem({
          prompt: t(
            `A garden bed in the shape of a sector of a circle is to be edged with $${P}$ m of edging, along both radii and the arc. What is the largest area it can have, in square metres?`,
            `一块扇形花坛要用 $${P}$ 米的镶边围起来（包括两条半径和弧）。它的面积最大可以是多少平方米？`,
          ),
          answer,
          unit: "m^2",
          mistakes: distinct([
            why(r, "This is the best radius; substitute it into the area.", "这是最佳半径；还要把它代入面积公式。"),
            why(
              Q.of(answer, 2),
              "This leaves out $\\theta = 2$ in $A = \\frac{1}{2}r^{2}\\theta$.",
              "这漏掉了 $A = \\frac{1}{2}r^{2}\\theta$ 中的 $\\theta = 2$。",
            ),
            why(
              2 * answer,
              "This drops the $\\frac{1}{2}$ of the area formula $\\frac{1}{2}r^{2}\\theta$.",
              "这丢掉了面积公式 $\\frac{1}{2}r^{2}\\theta$ 中的 $\\frac{1}{2}$。",
            ),
            why(
              Q.of(P * P, 18),
              `This shares the edging equally among the two radii and the arc, $\\frac{${P}}{3}$ each; that sector is smaller than the best one.`,
              `这是把镶边平均分给两条半径和弧，各 $\\frac{${P}}{3}$；这样的扇形比最佳的小。`,
            ),
          ]),
          solution: walked(
            [
              ...sectorSteps(P),
              [
                ["Evaluate the area", "求面积"],
                t(
                  `$A = \\frac{1}{2} \\cdot ${r}^{2} \\cdot 2 = ${answer}$ m².`,
                  `$A = \\frac{1}{2} \\cdot ${r}^{2} \\cdot 2 = ${answer}$ 平方米。`,
                ),
              ],
            ],
            t(
              `An angle of $2$ radians is $\\frac{2}{2\\pi} = \\frac{1}{\\pi}$ of a full turn, so the bed is $\\frac{1}{\\pi}$ of a circle of area $${r * r}\\pi$, which is $${answer}$ m².`,
              `$2$ 弧度是一整圈的 $\\frac{2}{2\\pi} = \\frac{1}{\\pi}$，所以花坛是面积为 $${r * r}\\pi$ 的圆的 $\\frac{1}{\\pi}$，即 $${answer}$ 平方米。`,
            ),
          ),
        });
      },
    },
  ],
};

/** sheets are rectangular sheets whose best tray has a rational cut: [width, length, cut]. */
const sheets: readonly (readonly [number, number, Q])[] = [
  [3, 8, Q.of(2, 3)],
  [5, 8, Q.one],
  [8, 15, Q.of(5, 3)],
  [7, 15, Q.of(3, 2)],
  [6, 16, Q.of(4, 3)],
  [10, 16, Q.of(2)],
  [16, 30, Q.of(10, 3)],
  [14, 30, Q.of(3)],
  [15, 24, Q.of(3)],
  [9, 24, Q.of(2)],
  [24, 45, Q.of(5)],
  [21, 45, Q.of(9, 2)],
];

/** optimizationProblemsInvolvingBoxesAndTrays optimizes open boxes. */
export const optimizationProblemsInvolvingBoxesAndTrays: TopicDef = {
  id: "optimization-problems-involving-boxes-and-trays",
  title: t("Optimization Problems Involving Boxes and Trays", "涉及盒子与托盘的最优化问题"),
  summary: t(
    "Maximize the volume of trays folded from sheets, and minimize the material of open boxes.",
    "求由纸板折成的托盘的最大容积，以及开口盒子的最少用料。",
  ),
  intro: t(
    "Cut equal squares of side $x$ from the corners of a $12$ cm square sheet and fold up the sides to make a tray. Cutting $1$ cm gives $1 \\cdot 10 \\cdot 10 = 100$ cm³; cutting $2$ cm gives $2 \\cdot 8 \\cdot 8 = 128$ cm³; cutting $3$ cm gives $3 \\cdot 6 \\cdot 6 = 108$ cm³. Deeper trays have smaller bases, so there is a best cut.\n\nCheck: $V(x) = x(12 - 2x)^{2}$ has $V'(x) = (12 - 2x)(12 - 6x)$, which is $0$ at $x = 2$, inside $(0, 6)$.\n\nIn this lesson we write the volume of a folded tray and the surface area of an open box as functions of one length, and find the best size.",
    "从边长 $12$ 厘米的正方形纸板四角剪去边长为 $x$ 的相同正方形，再把四边折起做成托盘。剪 $1$ 厘米得 $1 \\cdot 10 \\cdot 10 = 100$ 立方厘米；剪 $2$ 厘米得 $2 \\cdot 8 \\cdot 8 = 128$ 立方厘米；剪 $3$ 厘米得 $3 \\cdot 6 \\cdot 6 = 108$ 立方厘米。托盘越深底面越小，所以存在最佳的剪法。\n\n检验：$V(x) = x(12 - 2x)^{2}$，$V'(x) = (12 - 2x)(12 - 6x)$，在 $x = 2$ 处为 $0$，位于 $(0, 6)$ 内。\n\n本课我们把折成的托盘的容积和开口盒子的表面积写成一个长度的函数，求出最佳尺寸。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "trays-folded-from-sheets",
      title: t("Trays folded from sheets", "由纸板折成的托盘"),
      explanation: t(
        "Cut squares of side $x$ from the corners of an $a$ by $b$ sheet and fold up the sides: the tray has volume $V(x) = x(a - 2x)(b - 2x)$ for $0 < x < \\frac{a}{2}$. Solve $V'(x) = 0$ and keep the root inside the interval. For a square sheet of side $L$, $V'(x) = (L - 2x)(L - 6x)$, so $x = \\frac{L}{6}$.\n\nFor example, a $12$ cm square sheet gives the best tray with $x = 2$: $V = 2 \\cdot 8^{2} = 128$ cm³.\n\nCheck: $V(1.9) = 1.9 \\cdot 8.2^{2} = 127.756$ and $V(2.1) = 2.1 \\cdot 7.8^{2} = 127.764$, both just below $128$.\n\n> **Watch out.** $V'$ has two zeros. The other one, $x = \\frac{L}{2}$ for a square sheet, cuts the whole sheet away; keep only the zero in $\\left(0, \\frac{a}{2}\\right)$.",
        "从 $a \\times b$ 纸板的四角剪去边长为 $x$ 的正方形，再把四边折起：托盘容积为 $V(x) = x(a - 2x)(b - 2x)$，$0 < x < \\frac{a}{2}$。解 $V'(x) = 0$，保留区间内的根。对边长为 $L$ 的正方形纸板，$V'(x) = (L - 2x)(L - 6x)$，所以 $x = \\frac{L}{6}$。\n\n例如 $12$ 厘米的正方形纸板，在 $x = 2$ 时托盘最大：$V = 2 \\cdot 8^{2} = 128$ 立方厘米。\n\n检验：$V(1.9) = 1.9 \\cdot 8.2^{2} = 127.756$，$V(2.1) = 2.1 \\cdot 7.8^{2} = 127.764$，都略小于 $128$。\n\n> **注意。** $V'$ 有两个零点。另一个零点（正方形纸板为 $x = \\frac{L}{2}$）会把整张纸板剪掉；只保留 $\\left(0, \\frac{a}{2}\\right)$ 内的零点。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const side = 6 * rng.int(1, 10);
          const x = side / 6;
          const askVolume = rng.bool();
          const V = (y: number) => y * (side - 2 * y) ** 2;
          const volume = V(x);
          return numberProblem({
            prompt: t(
              `An open tray is made from a square sheet of side $${side}$ cm by cutting equal squares from the corners and folding up the sides. ${askVolume ? "What is the largest possible volume, in cubic centimetres?" : "What side length of the cut squares, in cm, gives the largest volume?"}`,
              `从边长为 $${side}$ 厘米的正方形纸板四角剪去相同的正方形，再把四边折起，做成一个开口托盘。${askVolume ? "托盘容积最大可能是多少立方厘米？" : "剪去的正方形边长为多少厘米时容积最大？"}`,
            ),
            answer: askVolume ? volume : x,
            unit: askVolume ? "cm^3" : "cm",
            mistakes: distinct(
              askVolume
                ? [
                    why(
                      x * side * side,
                      `This keeps the base at $${side}$ by $${side}$; cutting the corners shortens each side by $2x$.`,
                      `这让底面仍是 $${side}$ 乘 $${side}$；剪去四角后每边缩短 $2x$。`,
                    ),
                    why(
                      x * (side - x) ** 2,
                      "This shortens each side by $x$; a square is cut from both ends of every side, so by $2x$.",
                      "这让每边只缩短 $x$；每条边的两端都剪去一个正方形，所以缩短 $2x$。",
                    ),
                    why(
                      Q.of(side ** 3, 16),
                      `This cuts squares of side $\\frac{${side}}{4}$, which give a smaller tray; the best cut is $\\frac{${side}}{6} = ${x}$.`,
                      `这剪去的是边长 $\\frac{${side}}{4}$ 的正方形，托盘更小；最佳剪法是 $\\frac{${side}}{6} = ${x}$。`,
                    ),
                  ]
                : [
                    why(
                      side / 2,
                      `This is the other zero of $V'$; cutting $${side / 2}$ cm from each corner uses up the whole sheet and gives volume $0$.`,
                      `这是 $V'$ 的另一个零点；从每个角剪去 $${side / 2}$ 厘米会用掉整张纸板，容积为 $0$。`,
                    ),
                    why(
                      Q.of(side, 4),
                      `This uses $-1$ for the derivative of $${side} - 2x$; it is $-2$, which gives $V'(x) = (${side} - 2x)(${side} - 6x)$.`,
                      `这把 $${side} - 2x$ 的导数当成了 $-1$；它是 $-2$，得 $V'(x) = (${side} - 2x)(${side} - 6x)$。`,
                    ),
                  ],
            ),
            solution: walked(
              [
                [
                  ["Write the volume", "写出容积"],
                  t(
                    `The base is $${side} - 2x$ on each side and the height is $x$, so $V(x) = x(${side} - 2x)^{2}$ for $0 < x < ${side / 2}$.`,
                    `底面每边长 $${side} - 2x$，高为 $x$，所以 $V(x) = x(${side} - 2x)^{2}$，$0 < x < ${side / 2}$。`,
                  ),
                ],
                [
                  ["Differentiate and factor", "求导并因式分解"],
                  t("", ""),
                  [`V'(x) = (${side} - 2x)^{2} - 4x(${side} - 2x)`, `= (${side} - 2x)(${side} - 6x)`],
                ],
                [
                  ["Choose the zero in the interval", "取区间内的零点"],
                  t(
                    `The zeros are $x = ${side / 2}$ and $x = ${x}$; only $x = ${x}$ lies in $(0, ${side / 2})$, and $V$ changes there from increasing to decreasing.${askVolume ? ` So $V(${x}) = ${x} \\cdot ${side - 2 * x}^{2} = ${volume}$ cm³.` : ""}`,
                    `零点是 $x = ${side / 2}$ 和 $x = ${x}$；只有 $x = ${x}$ 在 $(0, ${side / 2})$ 内，$V$ 在此由增变减。${askVolume ? `所以 $V(${x}) = ${x} \\cdot ${side - 2 * x}^{2} = ${volume}$ 立方厘米。` : ""}`,
                  ),
                ],
              ],
              t(
                `$V(${fmt(x - 0.1)}) \\approx ${fmt(V(x - 0.1))}$ and $V(${fmt(x + 0.1)}) \\approx ${fmt(V(x + 0.1))}$ are both less than $V(${x}) = ${volume}$.`,
                `$V(${fmt(x - 0.1)}) \\approx ${fmt(V(x - 0.1))}$，$V(${fmt(x + 0.1)}) \\approx ${fmt(V(x + 0.1))}$，都小于 $V(${x}) = ${volume}$。`,
              ),
            ),
          });
        }
        const [a, b, x] = rng.pick(sheets);
        const other = Q.of(a + b, 3).sub(x);
        return numberProblem({
          prompt: t(
            `An open tray is made from ${article(a)} $${a}$ cm by $${b}$ cm sheet by cutting equal squares from the corners and folding up the sides. What side length of the cut squares, in cm, gives the largest volume?`,
            `从 $${a}$ 厘米 $\\times$ $${b}$ 厘米的纸板四角剪去相同的正方形，再把四边折起，做成一个开口托盘。剪去的正方形边长为多少厘米时容积最大？`,
          ),
          answer: x,
          unit: "cm",
          mistakes: distinct([
            why(
              other,
              `This is the other zero of $V'$; it is more than half the shorter side, $${L(Q.of(a, 2))}$, so the cuts would overlap.`,
              `这是 $V'$ 的另一个零点；它超过了短边的一半 $${L(Q.of(a, 2))}$，剪口会重叠。`,
            ),
            why(
              Q.of(a, 6),
              "This uses the rule $x = \\frac{L}{6}$ of a square sheet with the shorter side; for a rectangle, solve $V'(x) = 0$.",
              "这是用短边套用正方形纸板的规则 $x = \\frac{L}{6}$；对矩形要解 $V'(x) = 0$。",
            ),
            why(
              Q.of(a + b, 12),
              `This uses the square-sheet rule with the average side $\\frac{${a} + ${b}}{2}$; for a rectangle, solve $V'(x) = 0$.`,
              `这是用两边的平均值 $\\frac{${a} + ${b}}{2}$ 套用正方形纸板的规则；对矩形要解 $V'(x) = 0$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the volume", "写出容积"],
                t(`For $0 < x < ${L(Q.of(a, 2))}$,`, `当 $0 < x < ${L(Q.of(a, 2))}$ 时，`),
                [`V(x) = x(${a} - 2x)(${b} - 2x) = 4x^{3} - ${2 * (a + b)}x^{2} + ${a * b}x`],
              ],
              [
                ["Differentiate", "求导"],
                t(
                  `$V'(x) = 12x^{2} - ${4 * (a + b)}x + ${a * b}$, whose zeros are $x = ${L(x)}$ and $x = ${L(other)}$.`,
                  `$V'(x) = 12x^{2} - ${4 * (a + b)}x + ${a * b}$，它的零点为 $x = ${L(x)}$ 和 $x = ${L(other)}$。`,
                ),
              ],
              [
                ["Choose the zero in the interval", "取区间内的零点"],
                t(
                  `Only $x = ${L(x)}$ lies in $(0, ${L(Q.of(a, 2))})$; there $V'$ changes from positive to negative, so it gives the maximum.`,
                  `只有 $x = ${L(x)}$ 在 $(0, ${L(Q.of(a, 2))})$ 内；$V'$ 在此由正变负，所以它给出最大值。`,
                ),
              ],
            ],
            t(
              `The zeros of $12x^{2} - ${4 * (a + b)}x + ${a * b}$ must add up to $\\frac{${4 * (a + b)}}{12} = ${L(Q.of(a + b, 3))}$ and multiply to $\\frac{${a * b}}{12} = ${L(Q.of(a * b, 12))}$: indeed $${L(x)} + ${L(other)} = ${L(x.add(other))}$ and $${L(x)} \\cdot ${L(other)} = ${L(x.mul(other))}$.`,
              `$12x^{2} - ${4 * (a + b)}x + ${a * b}$ 的两个零点之和应为 $\\frac{${4 * (a + b)}}{12} = ${L(Q.of(a + b, 3))}$，之积应为 $\\frac{${a * b}}{12} = ${L(Q.of(a * b, 12))}$：确实 $${L(x)} + ${L(other)} = ${L(x.add(other))}$，$${L(x)} \\cdot ${L(other)} = ${L(x.mul(other))}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "boxes-with-least-material",
      title: t("Boxes with the least material", "用料最少的盒子"),
      explanation: t(
        "An open box with a square base of side $x$ and volume $V$ has height $\\frac{V}{x^{2}}$, so its surface area is $S(x) = x^{2} + 4x \\cdot \\frac{V}{x^{2}} = x^{2} + \\frac{4V}{x}$. $S'(x) = 2x - \\frac{4V}{x^{2}} = 0$ when $x^{3} = 2V$.\n\nFor example, with $V = 4$ cm³, $x^{3} = 8$, so $x = 2$, the height is $\\frac{4}{4} = 1$ and $S = 4 + 8 = 12$ cm².\n\nCheck: $S(1) = 1 + 16 = 17$ and $S(4) = 16 + 4 = 20$, both more than $12$.\n\n> **Watch out.** An open box has one base and four sides: $S = x^{2} + 4xh$. A box with a lid would have $2x^{2} + 4xh$.",
        "底面为边长 $x$ 的正方形、容积为 $V$ 的开口盒子，高为 $\\frac{V}{x^{2}}$，所以表面积为 $S(x) = x^{2} + 4x \\cdot \\frac{V}{x^{2}} = x^{2} + \\frac{4V}{x}$。$S'(x) = 2x - \\frac{4V}{x^{2}} = 0$ 时 $x^{3} = 2V$。\n\n例如 $V = 4$ 立方厘米时，$x^{3} = 8$，所以 $x = 2$，高为 $\\frac{4}{4} = 1$，$S = 4 + 8 = 12$ 平方厘米。\n\n检验：$S(1) = 1 + 16 = 17$，$S(4) = 16 + 4 = 20$，都大于 $12$。\n\n> **注意。** 开口盒子有一个底面和四个侧面：$S = x^{2} + 4xh$。有盖的盒子才是 $2x^{2} + 4xh$。",
      ),
      generate(rng) {
        const x = 2 * rng.int(1, 15);
        const V = x ** 3 / 2;
        const h = V / (x * x);
        const ask = rng.int(0, 2);
        const area = x * x + (4 * V) / x;
        const answer = ask === 0 ? x : ask === 1 ? h : area;
        const mistakes =
          ask === 0
            ? [
                why(h, "This is the height; the base side is twice it.", "这是高；底面边长是它的两倍。"),
                why(
                  x * x,
                  "This is the area of the base, $x^{2}$; the question asks for the side length.",
                  "这是底面积 $x^{2}$；题目问的是边长。",
                ),
              ]
            : ask === 1
              ? [
                  why(
                    x,
                    `This is the base side; the height is $\\frac{V}{x^{2}} = ${h}$.`,
                    `这是底面边长；高为 $\\frac{V}{x^{2}} = ${h}$。`,
                  ),
                  why(
                    (x * x) / 2,
                    "This divides the volume by $x$ instead of $x^{2}$; the base has area $x^{2}$.",
                    "这是用体积除以 $x$，而不是 $x^{2}$；底面积是 $x^{2}$。",
                  ),
                ]
              : [
                  why(
                    2 * x * x,
                    "This counts only two side faces; there are four, each $x$ by $h$.",
                    "这只算了两个侧面；共有四个侧面，每个都是 $x$ 乘 $h$。",
                  ),
                  why(4 * x * x, "This adds a lid; an open box has only one base.", "这加上了盖子；开口盒子只有一个底面。"),
                  why(x * x, "This is only the area of the base.", "这只是底面积。"),
                ];
        return numberProblem({
          prompt: t(
            `An open-topped box with a square base must hold $${V}$ cm³. ${ask === 0 ? "What base side length, in cm, uses the least material?" : ask === 1 ? "What height, in cm, uses the least material?" : "What is the least surface area, in cm², it can have?"}`,
            `一个无盖盒子底面为正方形，容积须为 $${V}$ 立方厘米。${ask === 0 ? "底面边长为多少厘米时用料最少？" : ask === 1 ? "高为多少厘米时用料最少？" : "它的表面积最小是多少平方厘米？"}`,
          ),
          answer,
          unit: ask === 2 ? "cm^2" : "cm",
          mistakes: distinct(mistakes),
          solution: walked(
            [
              [
                ["Write the surface area in one variable", "把表面积写成单变量函数"],
                t(
                  `The height is $\\frac{${V}}{x^{2}}$, so $S(x) = x^{2} + 4x \\cdot \\frac{${V}}{x^{2}} = x^{2} + \\frac{${4 * V}}{x}$.`,
                  `高为 $\\frac{${V}}{x^{2}}$，所以 $S(x) = x^{2} + 4x \\cdot \\frac{${V}}{x^{2}} = x^{2} + \\frac{${4 * V}}{x}$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `$S'(x) = 2x - \\frac{${4 * V}}{x^{2}} = 0$ when $x^{3} = ${2 * V}$, so $x = ${x}$; $S''(x) = 2 + \\frac{${8 * V}}{x^{3}} > 0$, so this is a minimum.`,
                  `$S'(x) = 2x - \\frac{${4 * V}}{x^{2}} = 0$ 时 $x^{3} = ${2 * V}$，所以 $x = ${x}$；$S''(x) = 2 + \\frac{${8 * V}}{x^{3}} > 0$，所以这是最小值。`,
                ),
              ],
              [
                ["Find what is asked", "求所问的量"],
                ask === 0
                  ? t(`The base side is $${x}$ cm.`, `底面边长为 $${x}$ 厘米。`)
                  : ask === 1
                    ? t(`The height is $\\frac{${V}}{${x}^{2}} = ${h}$ cm.`, `高为 $\\frac{${V}}{${x}^{2}} = ${h}$ 厘米。`)
                    : t(
                        `$S = ${x * x} + \\frac{${4 * V}}{${x}} = ${area}$ cm².`,
                        `$S = ${x * x} + \\frac{${4 * V}}{${x}} = ${area}$ 平方厘米。`,
                      ),
              ],
            ],
            t(
              `Other bases use more material: $S(${x / 2}) = ${L(Q.of(17 * x * x, 4))}$ and $S(${2 * x}) = ${5 * x * x}$, both more than $S(${x}) = ${area}$.`,
              `其他底面用料更多：$S(${x / 2}) = ${L(Q.of(17 * x * x, 4))}$，$S(${2 * x}) = ${5 * x * x}$，都大于 $S(${x}) = ${area}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** canSteps writes the steps that minimize the surface of a can of volume kπ, with or without a lid. */
function canSteps(k: number, r: number, lid: boolean) {
  const ends = lid ? "2\\pi r^{2}" : "\\pi r^{2}";
  const d = lid ? "4\\pi r" : "2\\pi r";
  const cube = lid ? k / 2 : k;
  return [
    [
      ["Write the height from the volume", "由体积写出高"],
      t(`$\\pi r^{2}h = ${k}\\pi$, so $h = \\frac{${k}}{r^{2}}$.`, `$\\pi r^{2}h = ${k}\\pi$，所以 $h = \\frac{${k}}{r^{2}}$。`),
    ],
    [
      ["Write the surface area", "写出表面积"],
      t(
        `$S(r) = ${ends} + 2\\pi r h = ${ends} + \\frac{${2 * k}\\pi}{r}$ for $r > 0$.`,
        `$S(r) = ${ends} + 2\\pi r h = ${ends} + \\frac{${2 * k}\\pi}{r}$，$r > 0$。`,
      ),
    ],
    [
      ["Find the critical point", "求临界点"],
      t(
        `$S'(r) = ${d} - \\frac{${2 * k}\\pi}{r^{2}} = 0$ when $r^{3} = ${cube}$, so $r = ${r}$ and $h = \\frac{${k}}{${r * r}} = ${k / (r * r)}$; $S'' > 0$, so this is a minimum.`,
        `$S'(r) = ${d} - \\frac{${2 * k}\\pi}{r^{2}} = 0$ 时 $r^{3} = ${cube}$，所以 $r = ${r}$，$h = \\frac{${k}}{${r * r}} = ${k / (r * r)}$；$S'' > 0$，所以这是最小值。`,
      ),
    ],
  ] as const;
}

/** optimizationProblemsInvolvingCylinders minimizes the material of cylinders with fixed volume. */
export const optimizationProblemsInvolvingCylinders: TopicDef = {
  id: "optimization-problems-involving-cylinders",
  title: t("Optimization Problems Involving Cylinders", "涉及圆柱的最优化问题"),
  summary: t(
    "Find the dimensions of closed and open cylinders of fixed volume that use the least material.",
    "求容积固定时用料最少的有盖和无盖圆柱的尺寸。",
  ),
  intro: t(
    "A closed can must hold $16\\pi$ cm³, so $h = \\frac{16}{r^{2}}$ and its surface area is $S(r) = 2\\pi r^{2} + \\frac{32\\pi}{r}$. A thin can, $r = 1$, needs $34\\pi$ cm²; $r = 2$ needs $8\\pi + 16\\pi = 24\\pi$ cm²; a wide flat can, $r = 4$, needs $32\\pi + 8\\pi = 40\\pi$ cm². The best can is in between.\n\nCheck: $S'(r) = 4\\pi r - \\frac{32\\pi}{r^{2}}$ is $0$ when $r^{3} = 8$, at $r = 2$, where $h = \\frac{16}{4} = 4 = 2r$.\n\nIn this lesson we write the surface area of a cylinder of fixed volume as a function of its radius, with and without a lid, and find the dimensions that use the least material.",
    "一个有盖圆柱罐的容积须为 $16\\pi$ 立方厘米，所以 $h = \\frac{16}{r^{2}}$，表面积 $S(r) = 2\\pi r^{2} + \\frac{32\\pi}{r}$。细长的罐子 $r = 1$ 需要 $34\\pi$ 平方厘米；$r = 2$ 需要 $8\\pi + 16\\pi = 24\\pi$ 平方厘米；扁平的罐子 $r = 4$ 需要 $32\\pi + 8\\pi = 40\\pi$ 平方厘米。最佳的罐子在中间。\n\n检验：$S'(r) = 4\\pi r - \\frac{32\\pi}{r^{2}}$ 在 $r^{3} = 8$ 即 $r = 2$ 时为 $0$，此时 $h = \\frac{16}{4} = 4 = 2r$。\n\n本课我们把容积固定的圆柱的表面积写成半径的函数，分有盖和无盖两种情况，求出用料最少的尺寸。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives", "surface-areas-of-cylinders"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "closed-cylinders",
      figure: calculusDrawings3["optimization-problems-involving-cylinders#closed-cylinders"],
      title: t("Closed cylinders", "有盖圆柱"),
      explanation: t(
        "A closed can of volume $V$ has $h = \\frac{V}{\\pi r^{2}}$, so its surface area is $S(r) = 2\\pi r^{2} + 2\\pi r h = 2\\pi r^{2} + \\frac{2V}{r}$. $S'(r) = 4\\pi r - \\frac{2V}{r^{2}} = 0$ when $r^{3} = \\frac{V}{2\\pi}$; then $h = 2r$: the best can is as tall as it is wide.\n\nFor example, for $V = 16\\pi$ cm³, $r^{3} = 8$, so $r = 2$ and $h = 4$, with $S = 24\\pi$ cm².\n\nCheck: $S(1) = 2\\pi + 32\\pi = 34\\pi$ and $S(4) = 32\\pi + 8\\pi = 40\\pi$, both more than $24\\pi$.\n\n> **Watch out.** A closed can has two circular ends, $2\\pi r^{2}$. Replace $h$ using the volume before differentiating: $h$ changes with $r$.",
        "容积为 $V$ 的有盖圆柱罐，$h = \\frac{V}{\\pi r^{2}}$，表面积为 $S(r) = 2\\pi r^{2} + 2\\pi r h = 2\\pi r^{2} + \\frac{2V}{r}$。$S'(r) = 4\\pi r - \\frac{2V}{r^{2}} = 0$ 时 $r^{3} = \\frac{V}{2\\pi}$；此时 $h = 2r$：最佳的罐子高度等于直径。\n\n例如 $V = 16\\pi$ 立方厘米时，$r^{3} = 8$，所以 $r = 2$，$h = 4$，$S = 24\\pi$ 平方厘米。\n\n检验：$S(1) = 2\\pi + 32\\pi = 34\\pi$，$S(4) = 32\\pi + 8\\pi = 40\\pi$，都大于 $24\\pi$。\n\n> **注意。** 有盖的罐子有两个圆形底面，共 $2\\pi r^{2}$。求导前先用体积替换 $h$：$h$ 随 $r$ 变化。",
      ),
      generate(rng) {
        const r = rng.int(1, 15);
        const k = 2 * r ** 3;
        const askHeight = rng.bool();
        return numberProblem({
          prompt: t(
            `A closed cylindrical can must hold $${k}\\pi$ cm³. Find the ${askHeight ? "height" : "radius"}, in cm, that uses the least material.`,
            `一个有盖圆柱罐的容积须为 $${k}\\pi$ 立方厘米。求用料最少时的${askHeight ? "高" : "底面半径"}（厘米）。`,
          ),
          answer: askHeight ? 2 * r : r,
          unit: "cm",
          mistakes: distinct(
            askHeight
              ? [
                  why(
                    r,
                    `This is the radius; the best closed can has height $2r = ${2 * r}$.`,
                    `这是半径；最佳的有盖罐子高为 $2r = ${2 * r}$。`,
                  ),
                  why(
                    2 * r * r,
                    "This divides the volume by $\\pi r$ instead of $\\pi r^{2}$.",
                    "这是用体积除以 $\\pi r$，而不是 $\\pi r^{2}$。",
                  ),
                ]
              : [
                  why(2 * r, "This is the height; the radius is half of it.", "这是高；半径是它的一半。"),
                  why(r ** 3, "This is $r^{3}$; take the cube root to get $r$.", "这是 $r^{3}$；开立方才得到 $r$。"),
                ],
          ),
          solution: walked(
            canSteps(k, r, true),
            t(
              `Other radii use more material: $S(${r}) = ${6 * r * r}\\pi$, while $S(${2 * r}) = ${10 * r * r}\\pi$ and $S\\left(${L(Q.of(r, 2))}\\right) = ${L(Q.of(17 * r * r, 2))}\\pi$.`,
              `其他半径用料更多：$S(${r}) = ${6 * r * r}\\pi$，而 $S(${2 * r}) = ${10 * r * r}\\pi$，$S\\left(${L(Q.of(r, 2))}\\right) = ${L(Q.of(17 * r * r, 2))}\\pi$。`,
            ),
          ),
        });
      },
    },
    {
      id: "open-cylinders",
      figure: calculusDrawings3["optimization-problems-involving-cylinders#open-cylinders"],
      title: t("Open cylinders", "无盖圆柱"),
      explanation: t(
        "Use the fixed volume to write the height in terms of the radius, so the surface area becomes a function of one variable that you can minimize. Without a lid, $S(r) = \\pi r^{2} + 2\\pi r h = \\pi r^{2} + \\frac{2V}{r}$. $S'(r) = 2\\pi r - \\frac{2V}{r^{2}} = 0$ when $r^{3} = \\frac{V}{\\pi}$, and then $h = r$.\n\nFor example, for $V = 8\\pi$ m³, $r^{3} = 8$, so $r = 2$, $h = 2$ and $S = 4\\pi + 8\\pi = 12\\pi$ m².\n\nCheck: $S(1) = \\pi + 16\\pi = 17\\pi$ and $S(4) = 16\\pi + 4\\pi = 20\\pi$, both more than $12\\pi$.\n\n> **Watch out.** Without a lid there is only one end, $\\pi r^{2}$, and the best open can has $h = r$, not the $h = 2r$ of a closed can.",
        "用固定的体积把高表示为半径的函数，这样表面积就成了一个变量的函数，可以求它的最小值。无盖时，$S(r) = \\pi r^{2} + 2\\pi r h = \\pi r^{2} + \\frac{2V}{r}$。$S'(r) = 2\\pi r - \\frac{2V}{r^{2}} = 0$ 时 $r^{3} = \\frac{V}{\\pi}$，此时 $h = r$。\n\n例如 $V = 8\\pi$ 立方米时，$r^{3} = 8$，所以 $r = 2$，$h = 2$，$S = 4\\pi + 8\\pi = 12\\pi$ 平方米。\n\n检验：$S(1) = \\pi + 16\\pi = 17\\pi$，$S(4) = 16\\pi + 4\\pi = 20\\pi$，都大于 $12\\pi$。\n\n> **注意。** 无盖时只有一个底面 $\\pi r^{2}$，最佳的无盖罐子 $h = r$，而不是有盖罐子的 $h = 2r$。",
      ),
      generate(rng) {
        const r = rng.int(1, 15);
        const k = r ** 3;
        const askArea = rng.bool();
        return numberProblem({
          prompt: t(
            `An open-topped cylindrical tank must hold $${k}\\pi$ m³. ${askArea ? "Its least possible surface area is $A\\pi$ m². Find $A$." : "Find the radius, in m, that uses the least material."}`,
            `一个无盖圆柱形水箱的容积须为 $${k}\\pi$ 立方米。${askArea ? "它的表面积最小为 $A\\pi$ 平方米。求 $A$。" : "求用料最少时的底面半径（米）。"}`,
          ),
          answer: askArea ? 3 * r * r : r,
          ...(askArea ? {} : { unit: "m" }),
          mistakes: distinct(
            askArea
              ? [
                  why(4 * r * r, "This adds a lid; an open tank has only one end.", "这加上了盖子；无盖水箱只有一个底面。"),
                  why(r * r, "This is only the base, $\\pi r^{2}$.", "这只是底面 $\\pi r^{2}$。"),
                  why(
                    2 * r * r,
                    "This is only the curved side, $2\\pi rh$; add the base $\\pi r^{2}$.",
                    "这只是侧面 $2\\pi rh$；还要加上底面 $\\pi r^{2}$。",
                  ),
                ]
              : [
                  why(r ** 3, "This is $r^{3}$; take the cube root to get $r$.", "这是 $r^{3}$；开立方才得到 $r$。"),
                  why(2 * r, "This is the diameter; the question asks for the radius.", "这是直径；题目问的是半径。"),
                ],
          ),
          solution: walked(
            [
              ...canSteps(k, r, false),
              ...(askArea
                ? ([
                    [
                      ["Evaluate the area", "求面积"],
                      t(
                        `$S = ${r * r}\\pi + ${2 * r * r}\\pi = ${3 * r * r}\\pi$, so $A = ${3 * r * r}$.`,
                        `$S = ${r * r}\\pi + ${2 * r * r}\\pi = ${3 * r * r}\\pi$，所以 $A = ${3 * r * r}$。`,
                      ),
                    ],
                  ] as const)
                : []),
            ],
            t(
              `Other radii use more material: $S(${r}) = ${3 * r * r}\\pi$, while $S(${2 * r}) = ${5 * r * r}\\pi$ and $S\\left(${L(Q.of(r, 2))}\\right) = ${L(Q.of(17 * r * r, 4))}\\pi$.`,
              `其他半径用料更多：$S(${r}) = ${3 * r * r}\\pi$，而 $S(${2 * r}) = ${5 * r * r}\\pi$，$S\\left(${L(Q.of(r, 2))}\\right) = ${L(Q.of(17 * r * r, 4))}\\pi$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** optimizingDistances minimizes distances to lines and between moving objects. */
export const optimizingDistances: TopicDef = {
  id: "optimizing-distances",
  title: t("Optimizing Distances", "距离的最优化"),
  summary: t(
    "Minimize distances by minimizing their squares: to a line, and between moving objects.",
    "通过最小化距离的平方来最小化距离：到直线的距离，以及运动物体之间的距离。",
  ),
  intro: t(
    "Which point of the line $y = 4 - x$ is closest to the origin? A point $(x, 4 - x)$ is at squared distance $D^{2} = x^{2} + (4 - x)^{2}$: $10$ at $x = 1$, $8$ at $x = 2$, $10$ at $x = 3$. The derivative $2x - 2(4 - x) = 4x - 8$ is $0$ at $x = 2$, so the closest point is $(2, 2)$, at distance $\\sqrt{8}$.\n\nCheck: the segment from the origin to $(2, 2)$ has slope $1$, the line has slope $-1$, and $1 \\cdot (-1) = -1$: the shortest segment meets the line at a right angle.\n\nIn this lesson we minimize a distance by minimizing its square, which has no square root, for points on lines and for objects that move.",
    "直线 $y = 4 - x$ 上哪个点离原点最近？点 $(x, 4 - x)$ 到原点的距离平方为 $D^{2} = x^{2} + (4 - x)^{2}$：$x = 1$ 时为 $10$，$x = 2$ 时为 $8$，$x = 3$ 时为 $10$。导数 $2x - 2(4 - x) = 4x - 8$ 在 $x = 2$ 处为 $0$，所以最近的点是 $(2, 2)$，距离为 $\\sqrt{8}$。\n\n检验：从原点到 $(2, 2)$ 的线段斜率为 $1$，直线斜率为 $-1$，$1 \\cdot (-1) = -1$：最短的线段与直线垂直。\n\n本课我们通过最小化距离的平方（它没有根号）来最小化距离，对象包括直线上的点和运动的物体。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives", "the-distance-formula"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "closest-points-on-lines",
      title: t("Closest points on lines", "直线上的最近点"),
      explanation: t(
        "A distance $D$ and its square $D^{2}$ are smallest at the same place, and $D^{2}$ has no square root, so minimize $D^{2}$. For the point $(x, mx + c)$ on a line and a point $(a, b)$: $D^{2} = (x - a)^{2} + (mx + c - b)^{2}$.\n\nFor example, for $y = 4 - x$ and the origin, $D^{2} = x^{2} + (4 - x)^{2}$ has derivative $2x - 2(4 - x) = 4x - 8$, which is $0$ at $x = 2$.\n\nCheck: the segment from $(0, 0)$ to $(2, 2)$ has slope $1$, and $1 \\cdot (-1) = -1$, so it is perpendicular to the line, as the shortest segment must be.\n\n> **Watch out.** The chain rule puts a factor $m$ in front of the second term: the derivative of $(mx + c - b)^{2}$ is $2m(mx + c - b)$, not $2(mx + c - b)$.",
        "距离 $D$ 与其平方 $D^{2}$ 在同一处取得最小值，而 $D^{2}$ 没有根号，所以最小化 $D^{2}$。直线上的点 $(x, mx + c)$ 到点 $(a, b)$：$D^{2} = (x - a)^{2} + (mx + c - b)^{2}$。\n\n例如对 $y = 4 - x$ 和原点，$D^{2} = x^{2} + (4 - x)^{2}$ 的导数为 $2x - 2(4 - x) = 4x - 8$，在 $x = 2$ 处为 $0$。\n\n检验：从 $(0, 0)$ 到 $(2, 2)$ 的线段斜率为 $1$，$1 \\cdot (-1) = -1$，所以它与直线垂直，最短的线段正应如此。\n\n> **注意。** 链式法则会在第二项前带出因子 $m$：$(mx + c - b)^{2}$ 的导数是 $2m(mx + c - b)$，不是 $2(mx + c - b)$。",
      ),
      generate(rng) {
        const m = rng.nonZero(-3, 3);
        const c = rng.int(-5, 5);
        const a = rng.int(-6, 6);
        const b = rng.int(-6, 6);
        const x = Q.of(a + m * (b - c), 1 + m * m);
        const y = x.mul(Q.of(m)).add(Q.of(c));
        const line = poly([m, "x"], [c, ""]);
        const xa = poly([1, "x"], [-a, ""]);
        const yb = poly([m, "x"], [c - b, ""]);
        const dx = x.sub(Q.of(a));
        const dy = y.sub(Q.of(b));
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the point on the line $y = ${line}$ closest to $(${a}, ${b})$.`,
            `求直线 $y = ${line}$ 上离点 $(${a}, ${b})$ 最近的点的 $x$ 坐标。`,
          ),
          answer: x,
          mistakes: distinct([
            why(
              a,
              `This is the $x$-coordinate of the given point; the closest point of the line is the foot of the perpendicular from it.`,
              "这是已知点的 $x$ 坐标；直线上最近的点是从它所作垂线的垂足。",
            ),
            ...(m === -1
              ? []
              : [
                  why(
                    Q.of(a + b - c, 1 + m),
                    `This leaves out the factor $${m}$ that the chain rule puts in front of the second term.`,
                    `这漏掉了链式法则在第二项前带出的因子 $${m}$。`,
                  ),
                ]),
            why(
              Q.of(a - m * (b - c), 1 + m * m),
              "This has a sign wrong when the constant terms are moved across the equation.",
              "这在移项时把常数项的符号弄错了。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the squared distance", "写出距离的平方"],
                t(
                  `A point of the line is $(x, ${line})$, so $D^{2} = (${xa})^{2} + (${yb})^{2}$.`,
                  `直线上的点为 $(x, ${line})$，所以 $D^{2} = (${xa})^{2} + (${yb})^{2}$。`,
                ),
              ],
              [
                ["Differentiate", "求导"],
                t("By the chain rule,", "由链式法则，"),
                [
                  `\\frac{d}{dx}D^{2} = 2(${xa}) ${m < 0 ? "-" : "+"} ${Math.abs(2 * m)}(${yb}) = ${poly([2 + 2 * m * m, "x"], [-2 * a + 2 * m * (c - b), ""])}`,
                ],
              ],
              [["Solve", "求解"], t(`This is $0$ at $x = ${L(x)}$.`, `它在 $x = ${L(x)}$ 处为 $0$。`)],
            ],
            t(
              `The closest point is $\\left(${L(x)}, ${L(y)}\\right)$. From $(${a}, ${b})$ to it, $x$ changes by $${L(dx)}$ and $y$ by $${L(dy)}$, so the segment is perpendicular to the line, whose direction is $(1, ${m})$: $${big(dx)} + ${par(m)} \\cdot ${big(dy)} = 0$.`,
              `最近的点是 $\\left(${L(x)}, ${L(y)}\\right)$。从 $(${a}, ${b})$ 到它，$x$ 变化 $${L(dx)}$，$y$ 变化 $${L(dy)}$，所以这条线段与方向为 $(1, ${m})$ 的直线垂直：$${big(dx)} + ${par(m)} \\cdot ${big(dy)} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "distances-between-moving-objects",
      title: t("Distances between moving objects", "运动物体之间的距离"),
      explanation: t(
        "Write each position as a function of time, then the squared distance between them, $D^{2}(t)$, and set its derivative to $0$. For one car $d$ km east of a crossing driving west at $u$ km/h, and another leaving the crossing northward at $v$ km/h: $D^{2} = (d - ut)^{2} + (vt)^{2}$.\n\nFor example, with $d = 10$, $u = 30$ and $v = 40$, the derivative $-60(10 - 30t) + 3200t = 5000t - 600$ is $0$ at $t = 0.12$ h, when $D^{2} = 6.4^{2} + 4.8^{2} = 64$, so the cars are $8$ km apart.\n\nCheck: at $t = 0.1$, $D^{2} = 7^{2} + 4^{2} = 65$, and at $t = 0.14$, $D^{2} = 5.8^{2} + 5.6^{2} = 65$, both more than $64$.\n\n> **Watch out.** Both positions use the same $t$. The cars need not meet, so do not solve $D = 0$: minimize $D^{2}$.",
        "把各位置写成时间的函数，再写出它们之间距离的平方 $D^{2}(t)$，令其导数为 $0$。一辆车在路口以东 $d$ 千米处以 $u$ 千米/时向西行驶，另一辆以 $v$ 千米/时从路口向北驶出：$D^{2} = (d - ut)^{2} + (vt)^{2}$。\n\n例如 $d = 10$，$u = 30$，$v = 40$ 时，导数 $-60(10 - 30t) + 3200t = 5000t - 600$ 在 $t = 0.12$ 小时处为 $0$，此时 $D^{2} = 6.4^{2} + 4.8^{2} = 64$，两车相距 $8$ 千米。\n\n检验：$t = 0.1$ 时 $D^{2} = 7^{2} + 4^{2} = 65$，$t = 0.14$ 时 $D^{2} = 5.8^{2} + 5.6^{2} = 65$，都大于 $64$。\n\n> **注意。** 两个位置用的是同一个 $t$。两车不一定相遇，所以不要解 $D = 0$，而要最小化 $D^{2}$。",
      ),
      generate(rng) {
        const u = 10 * rng.int(3, 9);
        const v = 10 * rng.int(3, 9);
        const d = 10 * rng.int(5, 30);
        const time = Q.of(d * u, u * u + v * v);
        const tn = time.toNumber();
        const answer = rounded(tn * 60, 1);
        const D2 = (s: number) => (d - u * s) ** 2 + (v * s) ** 2;
        const setup = t(
          `Car A is $${d}$ km east of a crossing, driving west toward it at $${u}$ km/h. At the same moment car B leaves the crossing, driving north at $${v}$ km/h.`,
          `A 车在路口以东 $${d}$ 千米处，以 $${u}$ 千米/时向西驶向路口。同一时刻 B 车从路口出发，以 $${v}$ 千米/时向北行驶。`,
        );
        const steps = [
          [
            ["Write the squared distance", "写出距离的平方"],
            t(
              `After $t$ hours car A is $${d} - ${u}t$ km east of the crossing and car B is $${v}t$ km north of it, so $D^{2} = (${d} - ${u}t)^{2} + (${v}t)^{2}$.`,
              `$t$ 小时后 A 车在路口以东 $${d} - ${u}t$ 千米处，B 车在路口以北 $${v}t$ 千米处，所以 $D^{2} = (${d} - ${u}t)^{2} + (${v}t)^{2}$。`,
            ),
          ],
          [
            ["Differentiate", "求导"],
            t("", ""),
            [`\\frac{d}{dt}D^{2} = -${2 * u}(${d} - ${u}t) + ${2 * v * v}t = ${2 * (u * u + v * v)}t - ${2 * d * u}`],
          ],
          [
            ["Solve", "求解"],
            answer
              ? t(
                  `This is $0$ at $t = \\frac{${2 * d * u}}{${2 * (u * u + v * v)}} = ${L(time)}$ h, that is $${L(time)} \\cdot 60 \\approx ${answer.toNumber()}$ minutes.`,
                  `它在 $t = \\frac{${2 * d * u}}{${2 * (u * u + v * v)}} = ${L(time)}$ 小时处为 $0$，即 $${L(time)} \\cdot 60 \\approx ${answer.toNumber()}$ 分钟。`,
                )
              : t(
                  `This is $0$ at $t = \\frac{${2 * d * u}}{${2 * (u * u + v * v)}} = ${L(time)}$ h.`,
                  `它在 $t = \\frac{${2 * d * u}}{${2 * (u * u + v * v)}} = ${L(time)}$ 小时处为 $0$。`,
                ),
          ],
        ] as const;
        const check = t(
          `With $t$ in hours, $D^{2}(${fmt(tn - 0.01)}) \\approx ${fmt(D2(tn - 0.01))}$, $D^{2}(${fmt(tn)}) \\approx ${fmt(D2(tn))}$ and $D^{2}(${fmt(tn + 0.01)}) \\approx ${fmt(D2(tn + 0.01))}$: the middle one is the least.`,
          `$t$ 以小时计，$D^{2}(${fmt(tn - 0.01)}) \\approx ${fmt(D2(tn - 0.01))}$，$D^{2}(${fmt(tn)}) \\approx ${fmt(D2(tn))}$，$D^{2}(${fmt(tn + 0.01)}) \\approx ${fmt(D2(tn + 0.01))}$：中间的最小。`,
        );
        const arrive = t(
          "This is when car A reaches the crossing; the cars are closest a little before that, while B is still near.",
          "这是 A 车到达路口的时刻；两车在此之前一点距离最近，那时 B 车还离得不远。",
        );
        const head = t(
          "This adds the speeds as if the cars drove toward each other; they move at right angles.",
          "这是把两车速度相加，好像两车相向而行；它们其实沿互相垂直的方向运动。",
        );
        if (!answer) {
          return numberProblem({
            prompt: t(`${setup.en} After how many hours are the cars closest together?`, `${setup["zh-CN"]}几小时后两车距离最近？`),
            answer: time,
            mistakes: distinct([
              why(Q.of(d, u), arrive.en, arrive["zh-CN"]),
              why(Q.of(d, u + v), head.en, head["zh-CN"]),
              why(
                Q.of(d * v, u * u + v * v),
                `This puts B's speed in place of A's in the constant term of the derivative; it is $2 \\cdot ${d} \\cdot ${u}$.`,
                `这在导数的常数项中用 B 车的速度代替了 A 车的速度；常数项是 $2 \\cdot ${d} \\cdot ${u}$。`,
              ),
            ]),
            solution: walked(steps, check),
          });
        }
        const wrong: Why[] = [];
        const add = (value: number, en: string, zh: string) => {
          const r = rounded(value, 1);
          if (r) wrong.push(why(r, en, zh));
        };
        add((60 * d) / u, arrive.en, arrive["zh-CN"]);
        add(tn, "This is the time in hours; multiply by $60$ to get minutes.", "这是以小时计的时间；乘以 $60$ 才是分钟数。");
        add((60 * d) / (u + v), head.en, head["zh-CN"]);
        return numberProblem({
          prompt: t(
            `${setup.en} After how many minutes are the cars closest together? Round to one decimal place.`,
            `${setup["zh-CN"]}几分钟后两车距离最近？精确到一位小数。`,
          ),
          answer,
          form: "decimal",
          mistakes: distinct(wrong),
          solution: walked(steps, check),
        });
      },
    },
  ],
};

/** optimizingDistancesToCurves finds the points of curves closest to given points. */
export const optimizingDistancesToCurves: TopicDef = {
  id: "optimizing-distances-to-curves",
  title: t("Optimizing Distances to Curves", "到曲线距离的最优化"),
  summary: t("Find the points on parabolas and square root curves closest to a given point.", "求抛物线和平方根曲线上离给定点最近的点。"),
  intro: t(
    "Which points of $y = x^{2}$ are closest to $\\left(0, \\frac{3}{2}\\right)$? The squared distance is $D^{2} = x^{2} + \\left(x^{2} - \\frac{3}{2}\\right)^{2}$: $\\frac{9}{4}$ at $x = 0$, $\\frac{5}{4}$ at $x = \\pm 1$, $\\frac{25}{4}$ at $x = \\pm 2$. The point straight below is not the closest.\n\nCheck: the derivative $2x + 4x\\left(x^{2} - \\frac{3}{2}\\right) = 2x(2x^{2} - 2)$ is $0$ at $x = 0$ and $x = \\pm 1$, and of these $D^{2}$ is least at $x = \\pm 1$.\n\nIn this lesson we find the points of parabolas and square root curves closest to a given point, comparing every critical point.",
    "$y = x^{2}$ 上哪些点离 $\\left(0, \\frac{3}{2}\\right)$ 最近？距离平方为 $D^{2} = x^{2} + \\left(x^{2} - \\frac{3}{2}\\right)^{2}$：$x = 0$ 时为 $\\frac{9}{4}$，$x = \\pm 1$ 时为 $\\frac{5}{4}$，$x = \\pm 2$ 时为 $\\frac{25}{4}$。正下方的点并不是最近的。\n\n检验：导数 $2x + 4x\\left(x^{2} - \\frac{3}{2}\\right) = 2x(2x^{2} - 2)$ 在 $x = 0$ 和 $x = \\pm 1$ 处为 $0$，其中 $D^{2}$ 在 $x = \\pm 1$ 处最小。\n\n本课我们求抛物线和平方根曲线上离给定点最近的点，并比较所有的临界点。",
  ),
  prerequisites: ["optimizing-distances"],
  encompasses: [{ topic: "optimizing-distances", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "closest-points-on-parabolas",
      figure: calculusDrawings3["optimizing-distances-to-curves#closest-points-on-parabolas"],
      title: t("Closest points on parabolas", "抛物线上的最近点"),
      explanation: t(
        "For the point $(x, x^{2})$ and the point $(0, b)$: $D^{2} = x^{2} + (x^{2} - b)^{2}$, with derivative $2x + 4x(x^{2} - b) = 2x(2x^{2} - 2b + 1)$. It is $0$ at $x = 0$ and at $x^{2} = b - \\frac{1}{2}$; when $b > \\frac{1}{2}$ the two symmetric points are closest, and $x = 0$ is a local maximum of $D^{2}$.\n\nFor example, for $b = \\frac{3}{2}$ the closest points are at $x = \\pm 1$, with $D^{2} = 1 + \\frac{1}{4} = \\frac{5}{4}$, while $x = 0$ gives $\\frac{9}{4}$.\n\nCheck: at $(1, 1)$ the tangent has slope $2$, and the segment to $\\left(0, \\frac{3}{2}\\right)$ has slope $\\frac{\\frac{3}{2} - 1}{0 - 1} = -\\frac{1}{2}$; the product is $-1$, so they are perpendicular.\n\n> **Watch out.** Not every critical point is a minimum: compare $D^{2}$ at all of them. The parabola is symmetric, so the closest points come in a pair $\\pm x$.",
        "对点 $(x, x^{2})$ 和点 $(0, b)$：$D^{2} = x^{2} + (x^{2} - b)^{2}$，导数为 $2x + 4x(x^{2} - b) = 2x(2x^{2} - 2b + 1)$。它在 $x = 0$ 和 $x^{2} = b - \\frac{1}{2}$ 处为 $0$；当 $b > \\frac{1}{2}$ 时，两个对称点最近，而 $x = 0$ 是 $D^{2}$ 的局部极大值点。\n\n例如 $b = \\frac{3}{2}$ 时最近的点在 $x = \\pm 1$ 处，$D^{2} = 1 + \\frac{1}{4} = \\frac{5}{4}$，而 $x = 0$ 处为 $\\frac{9}{4}$。\n\n检验：在 $(1, 1)$ 处切线斜率为 $2$，到 $\\left(0, \\frac{3}{2}\\right)$ 的线段斜率为 $\\frac{\\frac{3}{2} - 1}{0 - 1} = -\\frac{1}{2}$；两者之积为 $-1$，所以互相垂直。\n\n> **注意。** 临界点不一定是最小值点：要比较所有临界点处的 $D^{2}$。抛物线是对称的，所以最近的点成对出现，为 $\\pm x$。",
      ),
      generate(rng) {
        const m = rng.int(1, 5);
        const a = rng.int(1, 3);
        const c = rng.int(-3, 3);
        const b = Q.of(a * m * m).add(Q.of(1, 2 * a));
        const point = b.add(Q.of(c));
        const curve = poly([a, "x^{2}"], [c, ""]);
        const shifted = `${a === 1 ? "" : a}x^{2} - ${L(b)}`;
        const atZero = b.mul(b);
        const atM = Q.of(m * m).add(Q.of(1, 4 * a * a));
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points on $y = ${curve}$ closest to $\\left(0, ${L(point)}\\right)$.`,
            `求曲线 $y = ${curve}$ 上离点 $\\left(0, ${L(point)}\\right)$ 最近的点的 $x$ 坐标。`,
          ),
          values: [String(m), String(-m)],
          mistakes: [
            whySet(
              ["0"],
              `$x = 0$ is also a zero of the derivative, but there $D^{2} = ${L(atZero)}$ is larger: it is a local maximum of $D^{2}$.`,
              `$x = 0$ 也是导数的零点，但那里 $D^{2} = ${L(atZero)}$ 更大：它是 $D^{2}$ 的局部极大值点。`,
            ),
            whySet(
              [String(m)],
              `The curve is symmetric about the $y$-axis, so $x = ${-m}$ is just as close.`,
              `曲线关于 $y$ 轴对称，所以 $x = ${-m}$ 一样近。`,
            ),
            whySet(
              ["0", String(m), String(-m)],
              "These are all the zeros of the derivative, but $x = 0$ gives a larger $D^{2}$, so it is not a closest point.",
              "这些都是导数的零点，但 $x = 0$ 处 $D^{2}$ 更大，所以它不是最近的点。",
            ),
          ],
          solution: walked(
            [
              [
                ["Write the squared distance", "写出距离的平方"],
                t(
                  `A point of the curve is $(x, ${curve})$, and its height above or below $\\left(0, ${L(point)}\\right)$ is $${shifted}$, so $D^{2} = x^{2} + \\left(${shifted}\\right)^{2}$.`,
                  `曲线上的点为 $(x, ${curve})$，它与 $\\left(0, ${L(point)}\\right)$ 的高度差为 $${shifted}$，所以 $D^{2} = x^{2} + \\left(${shifted}\\right)^{2}$。`,
                ),
              ],
              [
                ["Differentiate and factor", "求导并因式分解"],
                t(`The zeros are $x = 0$ and $x = \\pm ${m}$:`, `零点为 $x = 0$ 和 $x = \\pm ${m}$：`),
                [
                  `\\frac{d}{dx}D^{2} = 2x + ${4 * a}x\\left(${shifted}\\right) = 2x\\left(${2 * a * a}x^{2} - ${2 * a * a * m * m}\\right)`,
                ],
              ],
              [
                ["Compare the critical points", "比较临界点"],
                t(
                  `$D^{2}(0) = ${L(atZero)}$ and $D^{2}(\\pm ${m}) = ${m * m} + ${L(Q.of(1, 4 * a * a))} = ${L(atM)}$, which is smaller, so the closest points are at $x = \\pm ${m}$.`,
                  `$D^{2}(0) = ${L(atZero)}$，$D^{2}(\\pm ${m}) = ${m * m} + ${L(Q.of(1, 4 * a * a))} = ${L(atM)}$，后者更小，所以最近的点在 $x = \\pm ${m}$ 处。`,
                ),
              ],
            ],
            t(
              `At $x = ${m}$ the tangent has slope $${2 * a * m}$, and the segment to $\\left(0, ${L(point)}\\right)$ has slope $${L(Q.of(-1, 2 * a * m))}$; the product is $-1$, so the segment meets the curve at a right angle, as a shortest segment must.`,
              `在 $x = ${m}$ 处切线斜率为 $${2 * a * m}$，到 $\\left(0, ${L(point)}\\right)$ 的线段斜率为 $${L(Q.of(-1, 2 * a * m))}$；两者之积为 $-1$，所以线段与曲线垂直，最短的线段正应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "closest-points-on-square-root-curves",
      title: t("Closest points on square root curves", "平方根曲线上的最近点"),
      explanation: t(
        "For the point $(x, \\sqrt{kx})$ and the point $(c, 0)$: $D^{2} = (x - c)^{2} + kx$, a quadratic. Its derivative $2(x - c) + k$ is $0$ at $x = c - \\frac{k}{2}$, provided that is at least $0$.\n\nFor example, for $y = \\sqrt{2x}$ and $(4, 0)$, $D^{2} = (x - 4)^{2} + 2x$ has derivative $2(x - 4) + 2$, which is $0$ at $x = 3$, where $D^{2} = 1 + 6 = 7$.\n\nCheck: completing the square, $D^{2} = x^{2} - 6x + 16 = (x - 3)^{2} + 7$, which is least at $x = 3$, where it is $7$.\n\n> **Watch out.** Square the height: $y^{2} = kx$, so $D^{2}$ has no square root left. The curve only exists for $x \\ge 0$, so the critical point must not be negative.",
        "对点 $(x, \\sqrt{kx})$ 和点 $(c, 0)$：$D^{2} = (x - c)^{2} + kx$ 是二次函数。其导数 $2(x - c) + k$ 在 $x = c - \\frac{k}{2}$ 处为 $0$（只要它不小于 $0$）。\n\n例如对 $y = \\sqrt{2x}$ 和 $(4, 0)$，$D^{2} = (x - 4)^{2} + 2x$ 的导数为 $2(x - 4) + 2$，在 $x = 3$ 处为 $0$，此时 $D^{2} = 1 + 6 = 7$。\n\n检验：配方得 $D^{2} = x^{2} - 6x + 16 = (x - 3)^{2} + 7$，在 $x = 3$ 处最小，等于 $7$。\n\n> **注意。** 要把高度平方：$y^{2} = kx$，所以 $D^{2}$ 中不再有根号。曲线只在 $x \\ge 0$ 时存在，所以临界点不能为负。",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const c = rng.int(Math.ceil(k / 2) + 1, 12);
        const x = Q.of(c).sub(Q.of(k, 2));
        const askDistance = rng.bool();
        const d2 = x.sub(Q.of(c)).pow(2).add(Q.of(k).mul(x));
        const curve = k === 1 ? "\\sqrt{x}" : `\\sqrt{${k}x}`;
        const kx = `${k === 1 ? "" : k}x`;
        return numberProblem({
          prompt: askDistance
            ? t(
                `Let $D$ be the least distance from the point $(${c}, 0)$ to the curve $y = ${curve}$. Find $D^{2}$.`,
                `设 $D$ 为点 $(${c}, 0)$ 到曲线 $y = ${curve}$ 的最短距离。求 $D^{2}$。`,
              )
            : t(
                `Find the $x$-coordinate of the point on $y = ${curve}$ closest to $(${c}, 0)$.`,
                `求曲线 $y = ${curve}$ 上离点 $(${c}, 0)$ 最近的点的 $x$ 坐标。`,
              ),
          answer: askDistance ? d2 : x,
          mistakes: distinct(
            askDistance
              ? [
                  why(
                    c * c,
                    `This is $D^{2}$ at $x = 0$, the end of the curve; the closest point is at $x = ${L(x)}$.`,
                    `这是曲线端点 $x = 0$ 处的 $D^{2}$；最近的点在 $x = ${L(x)}$ 处。`,
                  ),
                  why(
                    Q.of(k).mul(x),
                    `This keeps only the term $${kx}$; add $(x - ${c})^{2}$ as well.`,
                    `这只保留了 $${kx}$ 一项；还要加上 $(x - ${c})^{2}$。`,
                  ),
                  why(
                    Q.of(k * k, 4),
                    `This keeps only $(x - ${c})^{2}$; the squared height $${kx}$ counts too.`,
                    `这只保留了 $(x - ${c})^{2}$；高度的平方 $${kx}$ 也要算上。`,
                  ),
                ]
              : [
                  why(c, "This is the $x$-coordinate of the given point.", "这是已知点的 $x$ 坐标。"),
                  why(
                    Q.of(c).add(Q.of(k, 2)),
                    `This has the sign wrong: $2(x - ${c}) + ${k} = 0$ gives $x = ${c} - \\frac{${k}}{2}$.`,
                    `符号错了：$2(x - ${c}) + ${k} = 0$ 得 $x = ${c} - \\frac{${k}}{2}$。`,
                  ),
                  why(
                    c - k,
                    `This drops the factor $2$ from the derivative of $(x - ${c})^{2}$.`,
                    `这丢掉了 $(x - ${c})^{2}$ 求导得到的因子 $2$。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Write the squared distance", "写出距离的平方"],
                t(
                  `A point of the curve is $(x, ${curve})$, and $y^{2} = ${kx}$, so $D^{2} = (x - ${c})^{2} + ${kx}$ for $x \\ge 0$.`,
                  `曲线上的点为 $(x, ${curve})$，$y^{2} = ${kx}$，所以 $D^{2} = (x - ${c})^{2} + ${kx}$，$x \\ge 0$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `The derivative $2(x - ${c}) + ${k}$ is $0$ at $x = ${L(x)}$, which is not negative.`,
                  `导数 $2(x - ${c}) + ${k}$ 在 $x = ${L(x)}$ 处为 $0$，它不是负数。`,
                ),
              ],
              ...(askDistance
                ? ([
                    [
                      ["Evaluate the squared distance", "求距离的平方"],
                      t(
                        `$D^{2} = \\left(${L(x.sub(Q.of(c)))}\\right)^{2} + ${k === 1 ? "" : `${k} \\cdot `}${L(x)} = ${L(d2)}$.`,
                        `$D^{2} = \\left(${L(x.sub(Q.of(c)))}\\right)^{2} + ${k === 1 ? "" : `${k} \\cdot `}${L(x)} = ${L(d2)}$。`,
                      ),
                    ],
                  ] as const)
                : []),
            ],
            t(
              `Completing the square, $D^{2} = ${poly([1, "x^{2}"], [k - 2 * c, "x"], [c * c, ""])} = \\left(x - ${L(x)}\\right)^{2} + ${L(d2)}$, which is least at $x = ${L(x)}$, where it equals $${L(d2)}$.`,
              `配方得 $D^{2} = ${poly([1, "x^{2}"], [k - 2 * c, "x"], [c * c, ""])} = \\left(x - ${L(x)}\\right)^{2} + ${L(d2)}$，在 $x = ${L(x)}$ 处最小，等于 $${L(d2)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** optimizationProblemsWithInscribedShapes maximizes shapes inscribed in others. */
export const optimizationProblemsWithInscribedShapes: TopicDef = {
  id: "optimization-problems-with-inscribed-shapes",
  title: t("Optimization Problems With Inscribed Shapes", "内接图形的最优化问题"),
  summary: t(
    "Maximize the areas of rectangles inscribed under parabolas, in triangles and in circles.",
    "求内接于抛物线下方、三角形和圆中的矩形的最大面积。",
  ),
  intro: t(
    "A rectangle stands on the $x$-axis with its upper corners on $y = 12 - x^{2}$, at $(\\pm x, 12 - x^{2})$. Its area is $A(x) = 2x(12 - x^{2})$: $22$ at $x = 1$, $32$ at $x = 2$, $18$ at $x = 3$. A wide rectangle is short, a narrow one is thin, and the best one is in between.\n\nCheck: $A'(x) = 24 - 6x^{2}$ is $0$ at $x = 2$, and $A(1.9) \\approx 31.88$ and $A(2.1) \\approx 31.88$ are both below $32$.\n\nIn this lesson we place a rectangle inside a parabola, a triangle or a circle, write its area in one variable using the boundary, and maximize it.",
    "一个矩形立在 $x$ 轴上，上方两顶点在 $y = 12 - x^{2}$ 上，即 $(\\pm x, 12 - x^{2})$。它的面积为 $A(x) = 2x(12 - x^{2})$：$x = 1$ 时为 $22$，$x = 2$ 时为 $32$，$x = 3$ 时为 $18$。宽的矩形矮，窄的矩形细，最佳的在中间。\n\n检验：$A'(x) = 24 - 6x^{2}$ 在 $x = 2$ 处为 $0$，而 $A(1.9) \\approx 31.88$，$A(2.1) \\approx 31.88$，都小于 $32$。\n\n本课我们把矩形放在抛物线、三角形或圆内，利用边界把面积写成单变量函数，再求最大值。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "rectangles-under-parabolas",
      figure: calculusDrawings3["optimization-problems-with-inscribed-shapes#rectangles-under-parabolas"],
      title: t("Rectangles under parabolas", "抛物线下的矩形"),
      explanation: t(
        "A rectangle with its base on the $x$-axis and upper corners on $y = H - kx^{2}$ has corners at $(\\pm x, H - kx^{2})$, so $A(x) = 2x(H - kx^{2})$ for $0 < x < \\sqrt{\\frac{H}{k}}$. $A'(x) = 2H - 6kx^{2} = 0$ at $x = \\sqrt{\\frac{H}{3k}}$.\n\nFor example, under $y = 12 - x^{2}$ the best rectangle has $x = 2$: it is $4$ wide and $8$ tall, with area $32$.\n\nCheck: $A(1) = 2 \\cdot 11 = 22$ and $A(3) = 6 \\cdot 3 = 18$, both less than $32$.\n\n> **Watch out.** The corners are at $\\pm x$, so the width is $2x$, not $x$. The height is the value of the parabola there, $H - kx^{2}$, not $H$.",
        "底边在 $x$ 轴上、上方两顶点在 $y = H - kx^{2}$ 上的矩形，顶点为 $(\\pm x, H - kx^{2})$，所以 $A(x) = 2x(H - kx^{2})$，$0 < x < \\sqrt{\\frac{H}{k}}$。$A'(x) = 2H - 6kx^{2} = 0$ 于 $x = \\sqrt{\\frac{H}{3k}}$。\n\n例如在 $y = 12 - x^{2}$ 下，最佳矩形 $x = 2$：宽 $4$，高 $8$，面积 $32$。\n\n检验：$A(1) = 2 \\cdot 11 = 22$，$A(3) = 6 \\cdot 3 = 18$，都小于 $32$。\n\n> **注意。** 顶点在 $\\pm x$ 处，所以宽是 $2x$，不是 $x$。高是抛物线在该处的值 $H - kx^{2}$，不是 $H$。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const m = rng.int(1, 6);
        const H = 3 * k * m * m;
        const answer = 4 * k * m ** 3;
        const height = H - k * m * m;
        const askHeight = rng.bool();
        const curve = poly([H, ""], [-k, "x^{2}"]);
        const A = (x: number) => 2 * x * (H - k * x * x);
        return numberProblem({
          prompt: t(
            `A rectangle has its base on the $x$-axis and its upper corners on the parabola $y = ${curve}$. ${askHeight ? "What is the height of the rectangle with the largest area?" : "What is its largest possible area?"}`,
            `一个矩形的底边在 $x$ 轴上，上方两顶点在抛物线 $y = ${curve}$ 上。${askHeight ? "面积最大的矩形高是多少？" : "它的面积最大可能是多少？"}`,
          ),
          answer: askHeight ? height : answer,
          mistakes: distinct(
            askHeight
              ? [
                  why(m, `This is $x = ${m}$, half the width.`, `这是 $x = ${m}$，即宽的一半。`),
                  why(2 * m, "This is the width of the rectangle.", "这是矩形的宽。"),
                  why(
                    k * m * m,
                    `This is the drop from the top, $${k === 1 ? "" : k}x^{2} = ${k * m * m}$; the height is $${H} - ${k * m * m} = ${height}$.`,
                    `这是从顶点下降的量 $${k === 1 ? "" : k}x^{2} = ${k * m * m}$；高是 $${H} - ${k * m * m} = ${height}$。`,
                  ),
                ]
              : [
                  why(
                    answer / 2,
                    "This uses the width $x$ instead of $2x$; the corners are at $\\pm x$.",
                    "这把宽当成了 $x$，而不是 $2x$；顶点在 $\\pm x$ 处。",
                  ),
                  why(
                    2 * m * H,
                    `This uses the full height $${H}$; the corners are lower, at $${H} - ${k === 1 ? "" : k}x^{2}$.`,
                    `这用了整个高度 $${H}$；顶点更低，在 $${H} - ${k === 1 ? "" : k}x^{2}$ 处。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Write the area in one variable", "把面积写成单变量函数"],
                t(
                  `The upper corners are $(\\pm x, ${curve})$, so $A(x) = 2x(${curve}) = ${H * 2}x - ${2 * k}x^{3}$ for $x > 0$.`,
                  `上方两顶点为 $(\\pm x, ${curve})$，所以 $A(x) = 2x(${curve}) = ${H * 2}x - ${2 * k}x^{3}$，$x > 0$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `$A'(x) = ${2 * H} - ${6 * k}x^{2} = 0$ when $x^{2} = ${m * m}$, so $x = ${m}$; $A''(x) = -${12 * k}x < 0$, so this is a maximum.`,
                  `$A'(x) = ${2 * H} - ${6 * k}x^{2} = 0$ 时 $x^{2} = ${m * m}$，所以 $x = ${m}$；$A''(x) = -${12 * k}x < 0$，所以这是最大值。`,
                ),
              ],
              [
                ["Find the rectangle", "求出矩形"],
                t(
                  `The rectangle is $${2 * m}$ wide and $${H} - ${k * m * m} = ${height}$ tall, with area $${answer}$.`,
                  `矩形宽 $${2 * m}$，高 $${H} - ${k * m * m} = ${height}$，面积为 $${answer}$。`,
                ),
              ],
            ],
            t(
              `Nearby rectangles are smaller: $A(${fmt(m - 0.1)}) \\approx ${fmt(A(m - 0.1))}$ and $A(${fmt(m + 0.1)}) \\approx ${fmt(A(m + 0.1))}$, both below $${answer}$.`,
              `附近的矩形更小：$A(${fmt(m - 0.1)}) \\approx ${fmt(A(m - 0.1))}$，$A(${fmt(m + 0.1)}) \\approx ${fmt(A(m + 0.1))}$，都小于 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rectangles-in-triangles-and-circles",
      figure: calculusDrawings3["optimization-problems-with-inscribed-shapes#rectangles-in-triangles-and-circles"],
      title: t("Rectangles in triangles and circles", "三角形和圆中的矩形"),
      explanation: t(
        "In a right triangle with legs $a$ and $b$ along the axes, a rectangle with a corner at the right angle and the opposite corner on the hypotenuse has height $b\\left(1 - \\frac{x}{a}\\right)$, so $A(x) = bx - \\frac{b}{a}x^{2}$, greatest at $x = \\frac{a}{2}$: $A = \\frac{ab}{4}$. In a circle of radius $r$, the largest inscribed rectangle is a square, with area $2r^{2}$.\n\nFor example, in a triangle with legs $4$ and $6$ the best rectangle is $2$ by $3$, with area $6$; in a circle of radius $1$ it is a square of area $2$.\n\nCheck: the square in the unit circle has diagonal $2$, the diameter, so its side is $\\sqrt{2}$ and its area $2$.\n\n> **Watch out.** For the circle, maximize $A^{2} = 16x^{2}(r^{2} - x^{2})$ to avoid the square root. The corners are at $(\\pm x, \\pm y)$, so the area is $4xy$, not $xy$.",
        "直角边 $a$、$b$ 沿坐标轴的直角三角形中，一个顶点在直角处、对角顶点在斜边上的矩形，高为 $b\\left(1 - \\frac{x}{a}\\right)$，所以 $A(x) = bx - \\frac{b}{a}x^{2}$，在 $x = \\frac{a}{2}$ 处最大：$A = \\frac{ab}{4}$。半径为 $r$ 的圆中，面积最大的内接矩形是正方形，面积为 $2r^{2}$。\n\n例如直角边为 $4$ 和 $6$ 的三角形中，最佳矩形为 $2$ 乘 $3$，面积 $6$；半径为 $1$ 的圆中是面积为 $2$ 的正方形。\n\n检验：单位圆中的正方形对角线是直径 $2$，所以边长为 $\\sqrt{2}$，面积为 $2$。\n\n> **注意。** 对圆，最大化 $A^{2} = 16x^{2}(r^{2} - x^{2})$ 可以避开根号。顶点在 $(\\pm x, \\pm y)$，所以面积是 $4xy$，不是 $xy$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = 2 * rng.int(1, 10);
          const b = 2 * rng.int(1, 10);
          const answer = (a * b) / 4;
          const near = Q.of(answer).sub(Q.of(b, a));
          return numberProblem({
            prompt: t(
              `A right triangle has legs $${a}$ and $${b}$. A rectangle is drawn with one corner at the right angle, two sides along the legs and the opposite corner on the hypotenuse. What is its largest possible area?`,
              `一个直角三角形的两条直角边为 $${a}$ 和 $${b}$。在其中作一个矩形，一个顶点在直角处，两边沿直角边，对角顶点在斜边上。它的面积最大可能是多少？`,
            ),
            answer,
            mistakes: distinct([
              why((a * b) / 2, "This is the area of the whole triangle.", "这是整个三角形的面积。"),
              why(
                a * b,
                `This is a rectangle with sides $${a}$ and $${b}$, which does not fit inside the triangle.`,
                `这是边长为 $${a}$ 和 $${b}$ 的矩形，放不进三角形。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the area in one variable", "把面积写成单变量函数"],
                  t(
                    `With width $x$ along the leg of length $${a}$, the opposite corner on the hypotenuse gives height $${b}\\left(1 - \\frac{x}{${a}}\\right)$, so $A(x) = ${b}x - ${L(Q.of(b, a))}x^{2}$ for $0 < x < ${a}$.`,
                    `设沿长为 $${a}$ 的直角边的宽为 $x$，对角顶点在斜边上，高为 $${b}\\left(1 - \\frac{x}{${a}}\\right)$，所以 $A(x) = ${b}x - ${L(Q.of(b, a))}x^{2}$，$0 < x < ${a}$。`,
                  ),
                ],
                [
                  ["Find the critical point", "求临界点"],
                  t(
                    `$A'(x) = ${b} - ${L(Q.of(2 * b, a))}x = 0$ at $x = ${a / 2}$.`,
                    `$A'(x) = ${b} - ${L(Q.of(2 * b, a))}x = 0$ 于 $x = ${a / 2}$。`,
                  ),
                ],
                [
                  ["Evaluate the area", "求面积"],
                  t(
                    `The height is $${b / 2}$, so $A = ${a / 2} \\cdot ${b / 2} = ${answer}$.`,
                    `高为 $${b / 2}$，所以 $A = ${a / 2} \\cdot ${b / 2} = ${answer}$。`,
                  ),
                ],
              ],
              t(
                `One unit either way gives less: $A(${a / 2 - 1}) = A(${a / 2 + 1}) = ${L(near)}$, below $${answer}$. The best rectangle fills half the triangle.`,
                `向任一边偏离一个单位都更小：$A(${a / 2 - 1}) = A(${a / 2 + 1}) = ${L(near)}$，小于 $${answer}$。最佳矩形占三角形面积的一半。`,
              ),
            ),
          });
        }
        const r = rng.int(1, 12);
        const half = Q.of(r * r, 2);
        return numberProblem({
          prompt: t(
            `A rectangle is inscribed in a circle of radius $${r}$. What is its largest possible area?`,
            `一个矩形内接于半径为 $${r}$ 的圆。它的面积最大可能是多少？`,
          ),
          answer: 2 * r * r,
          mistakes: distinct([
            why(
              half,
              "This is $xy$, a quarter of the rectangle; with corners $(\\pm x, \\pm y)$ the area is $4xy$.",
              "这是 $xy$，只是矩形的四分之一；顶点为 $(\\pm x, \\pm y)$ 时面积为 $4xy$。",
            ),
            why(
              4 * r * r,
              `This is the square around the circle, of side $${2 * r}$; the inscribed square has the diameter $${2 * r}$ as its diagonal.`,
              `这是外切于圆、边长为 $${2 * r}$ 的正方形；内接正方形的对角线才是直径 $${2 * r}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the area", "写出面积"],
                t(
                  `With corners $(\\pm x, \\pm y)$ and $x^{2} + y^{2} = ${r * r}$, $A = 4xy = 4x\\sqrt{${r * r} - x^{2}}$.`,
                  `设顶点为 $(\\pm x, \\pm y)$，$x^{2} + y^{2} = ${r * r}$，则 $A = 4xy = 4x\\sqrt{${r * r} - x^{2}}$。`,
                ),
              ],
              [
                ["Maximize the square of the area", "最大化面积的平方"],
                t(
                  `$A^{2} = 16(${r * r}x^{2} - x^{4})$ has derivative $16(${2 * r * r}x - 4x^{3}) = 64x\\left(${L(half)} - x^{2}\\right)$, which is $0$ for $x > 0$ at $x^{2} = ${L(half)}$.`,
                  `$A^{2} = 16(${r * r}x^{2} - x^{4})$ 的导数为 $16(${2 * r * r}x - 4x^{3}) = 64x\\left(${L(half)} - x^{2}\\right)$，当 $x > 0$ 时在 $x^{2} = ${L(half)}$ 处为 $0$。`,
                ),
              ],
              [
                ["Evaluate the area", "求面积"],
                t(
                  `Then $y^{2} = ${r * r} - ${L(half)} = ${L(half)}$ too, so the rectangle is a square, and $A = 4xy = 4 \\cdot ${L(half)} = ${2 * r * r}$.`,
                  `此时 $y^{2} = ${r * r} - ${L(half)} = ${L(half)}$，所以矩形是正方形，$A = 4xy = 4 \\cdot ${L(half)} = ${2 * r * r}$。`,
                ),
              ],
            ],
            t(
              `The square's diagonal is the diameter, $${2 * r}$, so its side is $\\frac{${2 * r}}{\\sqrt{2}}$ and its area $\\frac{${4 * r * r}}{2} = ${2 * r * r}$.`,
              `正方形的对角线是直径 $${2 * r}$，所以边长为 $\\frac{${2 * r}}{\\sqrt{2}}$，面积为 $\\frac{${4 * r * r}}{2} = ${2 * r * r}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** optimizationProblemsInEconomics maximizes profit and revenue and minimizes average cost. */
export const optimizationProblemsInEconomics: TopicDef = {
  id: "optimization-problems-in-economics",
  title: t("Optimization Problems in Economics", "经济学中的最优化问题"),
  summary: t("Maximize revenue and profit and minimize average cost.", "求收入和利润的最大值以及平均成本的最小值。"),
  intro: t(
    "A shop sells $q$ items at $50 - q$ dollars each, and each item costs it $10$ dollars. The profit is $P(q) = (50 - q)q - 10q = 40q - q^{2}$: $300$ dollars at $q = 10$, $400$ at $q = 20$, $300$ at $q = 30$. Selling more brings the price down, so there is a best quantity.\n\nCheck: $P'(q) = 40 - 2q$ is $0$ at $q = 20$, and there the revenue $R(q) = 50q - q^{2}$ grows at $R'(20) = 10$ dollars per item, just what one more item costs.\n\nIn this lesson we maximize profit, where marginal revenue equals marginal cost, and minimize the average cost per item.",
    "一家商店以每件 $50 - q$ 美元的价格出售 $q$ 件商品，每件成本 $10$ 美元。利润为 $P(q) = (50 - q)q - 10q = 40q - q^{2}$：$q = 10$ 时为 $300$ 美元，$q = 20$ 时为 $400$，$q = 30$ 时为 $300$。卖得越多价格越低，所以存在最佳数量。\n\n检验：$P'(q) = 40 - 2q$ 在 $q = 20$ 处为 $0$，此时收入 $R(q) = 50q - q^{2}$ 以 $R'(20) = 10$ 美元每件的速率增长，恰好等于多做一件的成本。\n\n本课我们求利润的最大值（此时边际收入等于边际成本），以及每件平均成本的最小值。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "maximizing-profit",
      title: t("Maximizing profit", "利润最大化"),
      explanation: t(
        "Revenue is price times quantity, $R(q) = p(q) \\cdot q$; profit is $P(q) = R(q) - C(q)$. Profit is greatest where $P'(q) = 0$, that is where marginal revenue equals marginal cost: $R'(q) = C'(q)$.\n\nFor example, with price $50 - q$ and cost $10q$, $P(q) = 40q - q^{2}$ is greatest at $q = 20$, where $P = 400$.\n\nCheck: $R'(q) = 50 - 2q$ is $10$ at $q = 20$, equal to the marginal cost $C'(q) = 10$.\n\n> **Watch out.** Maximize profit, not revenue: the revenue $50q - q^{2}$ peaks later, at $q = 25$. Answer what is asked, the quantity or the profit.",
        "收入等于价格乘以数量，$R(q) = p(q) \\cdot q$；利润为 $P(q) = R(q) - C(q)$。利润在 $P'(q) = 0$ 处最大，即边际收入等于边际成本：$R'(q) = C'(q)$。\n\n例如价格为 $50 - q$，成本为 $10q$ 时，$P(q) = 40q - q^{2}$ 在 $q = 20$ 处最大，$P = 400$。\n\n检验：$R'(q) = 50 - 2q$ 在 $q = 20$ 处为 $10$，等于边际成本 $C'(q) = 10$。\n\n> **注意。** 要最大化利润而不是收入：收入 $50q - q^{2}$ 的最大值更晚，在 $q = 25$ 处。回答题目问的是数量还是利润。",
      ),
      generate(rng) {
        const b = rng.pick([1, 2, 4, 5]);
        const c1 = rng.int(2, 20);
        const q = rng.int(5, 40);
        const a = c1 + 2 * b * q;
        const c0 = 10 * rng.int(1, Math.max(1, Math.min(50, Math.floor((b * q * q) / 20))));
        const askProfit = rng.bool();
        const profit = (a - b * q) * q - c0 - c1 * q;
        const price = poly([a, ""], [-b, "q"]);
        const qr = Q.of(a, 2 * b);
        const atRevenue = Q.of(a)
          .sub(qr.mul(Q.of(b)))
          .mul(qr)
          .sub(Q.of(c0))
          .sub(qr.mul(Q.of(c1)));
        return numberProblem({
          prompt: t(
            `A company sells $q$ items at a price of $${price}$ dollars each, and making them costs $${c0} + ${c1}q$ dollars. ${askProfit ? "What is the greatest possible profit, in dollars?" : "How many items should it sell to make the greatest profit?"}`,
            `一家公司以每件 $${price}$ 美元的价格出售 $q$ 件商品，生产成本为 $${c0} + ${c1}q$ 美元。${askProfit ? "最大利润是多少美元？" : "卖出多少件时利润最大？"}`,
          ),
          answer: askProfit ? profit : q,
          mistakes: distinct(
            askProfit
              ? [
                  why((a - b * q) * q, "This is the revenue; subtract the cost to get the profit.", "这是收入；减去成本才是利润。"),
                  why(profit + c0, `This leaves out the fixed cost $${c0}$.`, `这漏掉了固定成本 $${c0}$。`),
                  why(
                    atRevenue,
                    `This is the profit at $q = ${L(qr)}$, the quantity that maximizes revenue; the profit is greatest at $q = ${q}$.`,
                    `这是收入最大时 $q = ${L(qr)}$ 的利润；利润在 $q = ${q}$ 处最大。`,
                  ),
                ]
              : [
                  why(
                    qr,
                    "This maximizes revenue; profit also subtracts the cost, so set marginal revenue equal to marginal cost.",
                    "这使收入最大；利润还要减去成本，所以应令边际收入等于边际成本。",
                  ),
                  why(
                    Q.of(a - c1, b),
                    `This sets the price equal to the marginal cost $${c1}$; set the marginal revenue $${poly([a, ""], [-2 * b, "q"])}$ equal to it.`,
                    `这是令价格等于边际成本 $${c1}$；应令边际收入 $${poly([a, ""], [-2 * b, "q"])}$ 等于它。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Write the profit", "写出利润"],
                t(
                  `$P(q) = (${price})q - (${c0} + ${c1}q) = ${poly([-b, "q^{2}"], [a - c1, "q"], [-c0, ""])}$.`,
                  `$P(q) = (${price})q - (${c0} + ${c1}q) = ${poly([-b, "q^{2}"], [a - c1, "q"], [-c0, ""])}$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `$P'(q) = ${poly([-2 * b, "q"], [a - c1, ""])} = 0$ at $q = ${q}$, and $P''(q) = ${-2 * b} < 0$, so this is a maximum.`,
                  `$P'(q) = ${poly([-2 * b, "q"], [a - c1, ""])} = 0$ 于 $q = ${q}$，且 $P''(q) = ${-2 * b} < 0$，所以这是最大值。`,
                ),
              ],
              ...(askProfit
                ? ([
                    [
                      ["Evaluate the profit", "求利润"],
                      t(
                        `$P(${q}) = ${(a - b * q) * q} - ${c0 + c1 * q} = ${profit}$ dollars.`,
                        `$P(${q}) = ${(a - b * q) * q} - ${c0 + c1 * q} = ${profit}$ 美元。`,
                      ),
                    ],
                  ] as const)
                : []),
            ],
            t(
              `Marginal revenue equals marginal cost there: $R'(${q}) = ${a} - ${2 * b} \\cdot ${q} = ${c1} = C'(${q})$. Selling one item fewer or more gives $P(${q - 1}) = P(${q + 1}) = ${profit - b}$, less than $${profit}$.`,
              `此时边际收入等于边际成本：$R'(${q}) = ${a} - ${2 * b} \\cdot ${q} = ${c1} = C'(${q})$。多卖或少卖一件，$P(${q - 1}) = P(${q + 1}) = ${profit - b}$，都小于 $${profit}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "minimizing-average-cost",
      title: t("Minimizing average cost", "平均成本最小化"),
      explanation: t(
        "Dividing total cost by quantity spreads the fixed cost over more items, and the minimum average cost occurs where its derivative is zero. The average cost per item is $\\bar{C}(q) = \\frac{C(q)}{q}$. For $C(q) = F + cq + kq^{2}$, $\\bar{C}(q) = \\frac{F}{q} + c + kq$, and $\\bar{C}'(q) = -\\frac{F}{q^{2}} + k = 0$ at $q = \\sqrt{\\frac{F}{k}}$.\n\nFor example, for $C(q) = 100 + 5q + q^{2}$, $\\bar{C}(q) = \\frac{100}{q} + 5 + q$ is least at $q = 10$, where it is $10 + 5 + 10 = 25$ dollars.\n\nCheck: the marginal cost there is $C'(10) = 5 + 2 \\cdot 10 = 25$, equal to the average cost, as it must be at the minimum.\n\n> **Watch out.** Minimize the average $\\frac{C(q)}{q}$, not the total cost $C(q)$, which only grows with $q$. From $q^{2} = \\frac{F}{k}$, take the square root.",
        "用总成本除以数量会把固定成本分摊到更多的产品上，平均成本的最小值出现在它的导数为零处。每件的平均成本为 $\\bar{C}(q) = \\frac{C(q)}{q}$。对 $C(q) = F + cq + kq^{2}$，$\\bar{C}(q) = \\frac{F}{q} + c + kq$，$\\bar{C}'(q) = -\\frac{F}{q^{2}} + k = 0$ 于 $q = \\sqrt{\\frac{F}{k}}$。\n\n例如 $C(q) = 100 + 5q + q^{2}$ 时，$\\bar{C}(q) = \\frac{100}{q} + 5 + q$ 在 $q = 10$ 处最小，为 $10 + 5 + 10 = 25$ 美元。\n\n检验：此时边际成本 $C'(10) = 5 + 2 \\cdot 10 = 25$，等于平均成本，最小值处正应如此。\n\n> **注意。** 要最小化平均成本 $\\frac{C(q)}{q}$，而不是总成本 $C(q)$，后者随 $q$ 一直增大。由 $q^{2} = \\frac{F}{k}$ 还要开平方。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const q = 10 * rng.int(1, 9);
        const F = k * q * q;
        const c = rng.int(5, 50);
        const askCost = rng.bool();
        const avg = 2 * k * q + c;
        const kq = k === 1 ? "" : k;
        const cost = `${F} + ${c}q + ${kq}q^{2}`;
        return numberProblem({
          prompt: t(
            `Making $q$ items costs $C(q) = ${cost}$ dollars. ${askCost ? "What is the least possible average cost per item, in dollars?" : "How many items should be made to minimize the average cost per item?"}`,
            `生产 $q$ 件商品的成本为 $C(q) = ${cost}$ 美元。${askCost ? "每件的平均成本最小是多少美元？" : "生产多少件时每件的平均成本最小？"}`,
          ),
          answer: askCost ? avg : q,
          mistakes: distinct(
            askCost
              ? [
                  why(
                    c,
                    `This is only the cost $${c}$ per item; the fixed cost and the term $${kq}q^{2}$ add to it.`,
                    `这只是每件 $${c}$ 的成本；固定成本和 $${kq}q^{2}$ 项也要加上。`,
                  ),
                  why(
                    k * q + c,
                    `This leaves out $\\frac{${F}}{q} = ${k * q}$, the fixed cost shared over the items.`,
                    `这漏掉了 $\\frac{${F}}{q} = ${k * q}$，即分摊到每件的固定成本。`,
                  ),
                  why(2 * k * q, `This leaves out the cost $${c}$ per item.`, `这漏掉了每件 $${c}$ 的成本。`),
                ]
              : [why(q * q, `This is $q^{2} = ${q * q}$; take the square root to get $q$.`, `这是 $q^{2} = ${q * q}$；开平方才得到 $q$。`)],
          ),
          solution: walked(
            [
              [
                ["Write the average cost", "写出平均成本"],
                t(
                  `$\\bar{C}(q) = \\frac{C(q)}{q} = \\frac{${F}}{q} + ${c} + ${kq}q$ for $q > 0$.`,
                  `$\\bar{C}(q) = \\frac{C(q)}{q} = \\frac{${F}}{q} + ${c} + ${kq}q$，$q > 0$。`,
                ),
              ],
              [
                ["Find the critical point", "求临界点"],
                t(
                  `$\\bar{C}'(q) = -\\frac{${F}}{q^{2}} + ${k} = 0$ when $q^{2} = ${q * q}$, so $q = ${q}$; $\\bar{C}''(q) = \\frac{${2 * F}}{q^{3}} > 0$, so this is a minimum.`,
                  `$\\bar{C}'(q) = -\\frac{${F}}{q^{2}} + ${k} = 0$ 时 $q^{2} = ${q * q}$，所以 $q = ${q}$；$\\bar{C}''(q) = \\frac{${2 * F}}{q^{3}} > 0$，所以这是最小值。`,
                ),
              ],
              ...(askCost
                ? ([
                    [
                      ["Evaluate the average cost", "求平均成本"],
                      t(
                        `$\\bar{C}(${q}) = ${F / q} + ${c} + ${k * q} = ${avg}$ dollars.`,
                        `$\\bar{C}(${q}) = ${F / q} + ${c} + ${k * q} = ${avg}$ 美元。`,
                      ),
                    ],
                  ] as const)
                : []),
            ],
            t(
              `At the least average cost, the marginal cost equals the average cost: $C'(${q}) = ${c} + ${2 * k} \\cdot ${q} = ${avg}$, and $\\bar{C}(${q}) = ${F / q} + ${c} + ${k * q} = ${avg}$.`,
              `平均成本最小时，边际成本等于平均成本：$C'(${q}) = ${c} + ${2 * k} \\cdot ${q} = ${avg}$，而 $\\bar{C}(${q}) = ${F / q} + ${c} + ${k * q} = ${avg}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tangentLine writes the tangent line y = f + g(x - x0) through (x0, f) with slope g. */
const tangentLine = (f: number, g: number, x0: number) =>
  `y = ${f} ${g < 0 ? "-" : "+"} ${Math.abs(g) === 1 ? "" : Math.abs(g)}\\left(${poly([1, "x"], [-x0, ""])}\\right)`;

/** tangentZero writes the value f + g d of the tangent line at the step d, which is zero. */
const tangentZero = (f: number, g: number, d: Q) => `y = ${f} ${g < 0 ? "-" : "+"} ${Math.abs(g)} \\cdot ${big(d)} = 0`;

/** newtonStep is one step of Newton's method for a polynomial p from x0. */
const newtonStep = (p: Poly, x0: Q) => {
  const at = (q: Poly, x: Q) => q.reduce((acc, c, i) => acc.add(Q.of(c).mul(x.pow(i))), Q.zero);
  const d = at(pDer(p), x0);
  return d.isZero() ? undefined : x0.sub(at(p, x0).div(d));
};

/** newtonMistakes are the usual slips in one Newton step x0 − f/g, said about f and g by name. */
const newtonMistakes = (x0: Q, f: Q, g: Q, fName: string, gName: string): Why[] => [
  why(
    x0.add(f.div(g)),
    `This adds the step; Newton's method subtracts it: $x_{1} = x_{0} - \\frac{${fName}}{${gName}}$.`,
    `这是加上了步长；牛顿法要减去它：$x_{1} = x_{0} - \\frac{${fName}}{${gName}}$。`,
  ),
  why(x0.sub(f.mul(g)), `This multiplies by $${gName}$; divide by it instead.`, `这是乘以 $${gName}$；应该除以它。`),
  why(f.div(g).neg(), "This is only the step; add it to $x_{0}$.", "这只是步长；还要加到 $x_{0}$ 上。"),
  ...(f.isZero() ? [] : [why(x0.sub(g.div(f)), "This has the fraction upside down.", "这把分数倒过来了。")]),
];

/** newtonsMethod approximates roots with Newton's method. */
export const newtonsMethod: TopicDef = {
  id: "newtons-method",
  title: t("Newton's Method", "牛顿法"),
  summary: t(
    "Approximate roots of equations by repeatedly following tangent lines to the x-axis.",
    "沿切线反复逼近 x 轴，求方程根的近似值。",
  ),
  intro: t(
    "To find $\\sqrt{2}$, solve $f(x) = x^{2} - 2 = 0$. Start from the guess $x_{0} = 1$: there $f(1) = -1$ and $f'(1) = 2$, so the tangent line $y = -1 + 2(x - 1)$ crosses the $x$-axis at $x_{1} = 1.5$. From $1.5$ the same step gives $x_{2} = 1.5 - \\frac{0.25}{3} \\approx 1.4167$, and $\\sqrt{2} \\approx 1.4142$.\n\nCheck: $1.4167^{2} \\approx 2.0069$, already close to $2$, while $1.5^{2} = 2.25$ and $1^{2} = 1$ were further away.\n\nIn this lesson we take steps of Newton's method, $x_{1} = x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$, and repeat them to approximate roots.",
    "求 $\\sqrt{2}$ 就是解 $f(x) = x^{2} - 2 = 0$。从猜测 $x_{0} = 1$ 出发：$f(1) = -1$，$f'(1) = 2$，所以切线 $y = -1 + 2(x - 1)$ 与 $x$ 轴交于 $x_{1} = 1.5$。从 $1.5$ 再走一步得 $x_{2} = 1.5 - \\frac{0.25}{3} \\approx 1.4167$，而 $\\sqrt{2} \\approx 1.4142$。\n\n检验：$1.4167^{2} \\approx 2.0069$，已经接近 $2$，而 $1.5^{2} = 2.25$、$1^{2} = 1$ 都差得更远。\n\n本课我们用牛顿法迭代 $x_{1} = x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$，并重复迭代来近似方程的根。",
  ),
  prerequisites: ["approximating-functions-using-local-linearity-and-linearization"],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-step-of-newtons-method",
      title: t("One step of Newton's method", "牛顿法的一步"),
      explanation: t(
        "Each step replaces the curve by its tangent line and finds where that line crosses the axis, which is usually much closer to the true root. To solve $f(x) = 0$ from a guess $x_{0}$, follow the tangent line at $x_{0}$ to the $x$-axis:\n\n$$x_{1} = x_{0} - \\frac{f(x_{0})}{f'(x_{0})}.$$\n\nFor example, for $f(x) = x^{2} - 2$ and $x_{0} = 1$: $f(1) = -1$ and $f'(1) = 2$, so $x_{1} = 1 - \\frac{-1}{2} = 1.5$.\n\nCheck: the tangent line at $1$ is $y = -1 + 2(x - 1)$, and at $x = 1.5$ it gives $y = -1 + 2 \\cdot 0.5 = 0$, so $x_{1}$ is where it crosses the axis.\n\n> **Watch out.** Subtract the step, and divide by $f'(x_{0})$: $x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$, not $x_{0} + \\frac{f(x_{0})}{f'(x_{0})}$ or $x_{0} - f(x_{0}) f'(x_{0})$.",
        "每一步都用切线代替曲线，并求出切线与坐标轴的交点，这个点通常离真正的根近得多。从初始猜测 $x_{0}$ 出发解 $f(x) = 0$ 时，沿 $x_{0}$ 处的切线走到 $x$ 轴：\n\n$$x_{1} = x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$$\n\n例如对 $f(x) = x^{2} - 2$，$x_{0} = 1$：$f(1) = -1$，$f'(1) = 2$，所以 $x_{1} = 1 - \\frac{-1}{2} = 1.5$。\n\n检验：$1$ 处的切线为 $y = -1 + 2(x - 1)$，在 $x = 1.5$ 处 $y = -1 + 2 \\cdot 0.5 = 0$，所以 $x_{1}$ 正是它与坐标轴的交点。\n\n> **注意。** 要减去步长，并且除以 $f'(x_{0})$：$x_{0} - \\frac{f(x_{0})}{f'(x_{0})}$，不是 $x_{0} + \\frac{f(x_{0})}{f'(x_{0})}$，也不是 $x_{0} - f(x_{0}) f'(x_{0})$。",
      ),
      generate(rng) {
        for (;;) {
          const p: Poly = [rng.int(-9, 9), rng.int(-5, 5), rng.int(-3, 3), rng.pick([1, -1, 2])];
          const x0 = rng.int(-3, 3);
          const x1 = newtonStep(p, Q.of(x0));
          const [fx, dx] = [pAt(p, x0), pAt(pDer(p), x0)];
          if (!x1 || fx === 0) continue;
          return numberProblem({
            prompt: t(
              `Apply one step of Newton's method to $${pLatex(p)} = 0$ with $x_{0} = ${x0}$. Find $x_{1}$.`,
              `对方程 $${pLatex(p)} = 0$ 从 $x_{0} = ${x0}$ 出发用牛顿法迭代一步，求 $x_{1}$。`,
            ),
            answer: x1,
            mistakes: distinct(newtonMistakes(Q.of(x0), Q.of(fx), Q.of(dx), `f(x_{0})`, `f'(x_{0})`)),
            solution: walked(
              [
                [["Evaluate the function", "求函数值"], t(`$f(${x0}) = ${fx}$.`, `$f(${x0}) = ${fx}$。`)],
                [
                  ["Evaluate the derivative", "求导数值"],
                  t(`$f'(x) = ${pLatex(pDer(p))}$, so $f'(${x0}) = ${dx}$.`, `$f'(x) = ${pLatex(pDer(p))}$，所以 $f'(${x0}) = ${dx}$。`),
                ],
                [["Take the step", "迭代一步"], t("", ""), [`x_{1} = ${x0} - \\frac{${fx}}{${dx}} = ${L(x1)}`]],
              ],
              t(
                `The tangent line at $x_{0} = ${x0}$ is $${tangentLine(fx, dx, x0)}$. At $x = ${L(x1)}$ the bracket is $${L(x1.sub(Q.of(x0)))}$, so $${tangentZero(fx, dx, x1.sub(Q.of(x0)))}$: the tangent crosses the axis at $x_{1}$.`,
                `$x_{0} = ${x0}$ 处的切线为 $${tangentLine(fx, dx, x0)}$。在 $x = ${L(x1)}$ 处括号内为 $${L(x1.sub(Q.of(x0)))}$，所以 $${tangentZero(fx, dx, x1.sub(Q.of(x0)))}$：切线在 $x_{1}$ 处与坐标轴相交。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "iterating-newtons-method",
      title: t("Iterating Newton's method", "迭代牛顿法"),
      explanation: t(
        "Repeat the step, each time from the newest estimate, with the function and the derivative evaluated there. For $\\sqrt{n}$, solve $x^{2} - n = 0$: the step becomes $x_{k+1} = \\frac{1}{2}\\left(x_{k} + \\frac{n}{x_{k}}\\right)$, and two steps from a nearby whole number are usually accurate to several decimal places.\n\nFor example, for $\\sqrt{2}$ from $x_{0} = 1$: $x_{1} = \\frac{1}{2}(1 + 2) = 1.5$ and $x_{2} = \\frac{1}{2}\\left(1.5 + \\frac{2}{1.5}\\right) \\approx 1.4167$.\n\nCheck: $1.4167^{2} \\approx 2.0069$, close to $2$.\n\n> **Watch out.** Each step uses a new tangent: evaluate $f'$ at the newest estimate, not at $x_{0}$. Two steps means giving $x_{2}$, not $x_{1}$.",
        "重复迭代，每次从最新的估计出发，并在该处计算函数值和导数值。求 $\\sqrt{n}$ 时解 $x^{2} - n = 0$：迭代式为 $x_{k+1} = \\frac{1}{2}\\left(x_{k} + \\frac{n}{x_{k}}\\right)$，从附近的整数出发迭代两步，通常就能精确到好几位小数。\n\n例如从 $x_{0} = 1$ 求 $\\sqrt{2}$：$x_{1} = \\frac{1}{2}(1 + 2) = 1.5$，$x_{2} = \\frac{1}{2}\\left(1.5 + \\frac{2}{1.5}\\right) \\approx 1.4167$。\n\n检验：$1.4167^{2} \\approx 2.0069$，接近 $2$。\n\n> **注意。** 每一步用的是新的切线：在最新的估计处计算 $f'$，而不是在 $x_{0}$ 处。迭代两步要给出 $x_{2}$，不是 $x_{1}$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 9);
          const n = a * a + rng.nonZero(-a, a);
          const root = rng.bool();
          const p: Poly = root ? [-n, 0, 1] : [-n, 0, 0, 1];
          const x0 = root ? a : Math.round(Math.cbrt(n));
          const e = root ? 2 : 3;
          if (x0 ** e === n) continue;
          const x1 = newtonStep(p, Q.of(x0));
          const x2 = x1 && newtonStep(p, x1);
          const answer = x2 && rounded(x2.toNumber(), 4);
          if (!x1 || !answer) continue;
          const eq = root ? `x^{2} = ${n}` : `x^{3} = ${n}`;
          const f = (x: number) => x ** e - n;
          const df = (x: number) => e * x ** (e - 1);
          const x1n = x1.toNumber();
          const wrong: Why[] = [];
          const r1 = rounded(x1n, 4);
          if (r1)
            wrong.push(
              why(r1, "This is $x_{1}$, after one step; take a second step from it.", "这是一步之后的 $x_{1}$；还要从它出发再迭代一步。"),
            );
          const stale = rounded(x1n - f(x1n) / df(x0), 4);
          if (stale)
            wrong.push(
              why(
                stale,
                `The second step reuses $f'(${x0})$; evaluate the derivative at $x_{1}$ instead.`,
                `第二步沿用了 $f'(${x0})$；应在 $x_{1}$ 处计算导数。`,
              ),
            );
          const added = rounded(x1n + f(x1n) / df(x1n), 4);
          if (added)
            wrong.push(
              why(
                added,
                "The second step adds $\\frac{f(x_{1})}{f'(x_{1})}$; subtract it.",
                "第二步加上了 $\\frac{f(x_{1})}{f'(x_{1})}$；应该减去。",
              ),
            );
          return numberProblem({
            prompt: t(
              `Use two steps of Newton's method with $x_{0} = ${x0}$ to approximate the solution of $${eq}$. Round to four decimal places.`,
              `从 $x_{0} = ${x0}$ 出发，用牛顿法迭代两步近似方程 $${eq}$ 的解，精确到四位小数。`,
            ),
            answer,
            form: "decimal",
            mistakes: distinct(wrong),
            solution: walked(
              [
                [
                  ["Set up the equation", "写出方程"],
                  t(
                    `Solve $f(x) = ${root ? `x^{2} - ${n}` : `x^{3} - ${n}`} = 0$, with $f'(x) = ${root ? "2x" : "3x^{2}"}$.`,
                    `解 $f(x) = ${root ? `x^{2} - ${n}` : `x^{3} - ${n}`} = 0$，$f'(x) = ${root ? "2x" : "3x^{2}"}$。`,
                  ),
                ],
                [
                  ["Take the first step", "迭代第一步"],
                  t("", ""),
                  [`x_{1} = ${x0} - \\frac{${f(x0)}}{${df(x0)}} = ${L(x1)} \\approx ${fmt(x1n)}`],
                ],
                [
                  ["Take the second step", "迭代第二步"],
                  t("The derivative is evaluated at $x_{1}$:", "导数在 $x_{1}$ 处计算："),
                  [
                    `x_{2} = x_{1} - \\frac{f(x_{1})}{f'(x_{1})} \\approx ${fmt(x1n)} - \\frac{${fmt(f(x1n))}}{${fmt(df(x1n))}} \\approx ${answer.toNumber()}`,
                  ],
                ],
              ],
              t(
                `$${answer.toNumber()}^{${e}} \\approx ${fmt(answer.toNumber() ** e)}$, very close to $${n}$, while $${x0}^{${e}} = ${x0 ** e}$.`,
                `$${answer.toNumber()}^{${e}} \\approx ${fmt(answer.toNumber() ** e)}$，非常接近 $${n}$，而 $${x0}^{${e}} = ${x0 ** e}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** newtonsMethodForOptimizingSingleVariableFunctions locates critical points with Newton's method. */
export const newtonsMethodForOptimizingSingleVariableFunctions: TopicDef = {
  id: "newtons-method-for-optimizing-single-variable-functions",
  title: t("Newton's Method for Optimizing Single-Variable Functions", "用牛顿法优化单变量函数"),
  summary: t("Approximate critical points by applying Newton's method to the derivative.", "对导数应用牛顿法来近似临界点。"),
  intro: t(
    "The minimum of $f(x) = x^{2} + \\frac{4}{x}$ for $x > 0$ is where $f'(x) = 2x - \\frac{4}{x^{2}} = 0$, that is $x^{3} = 2$. Newton's method solves this equation: apply it to $f'$, whose derivative is $f''(x) = 2 + \\frac{8}{x^{3}}$. From $x_{0} = 1$, $f'(1) = -2$ and $f''(1) = 10$, so $x_{1} = 1 - \\frac{-2}{10} = 1.2$.\n\nCheck: the exact critical point is $\\sqrt[3]{2} \\approx 1.26$, and $1.2$ is much closer to it than $1$ was.\n\nIn this lesson we locate critical points by applying Newton's method to the derivative, $x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$.",
    "$f(x) = x^{2} + \\frac{4}{x}$（$x > 0$）的最小值点满足 $f'(x) = 2x - \\frac{4}{x^{2}} = 0$，即 $x^{3} = 2$。牛顿法可以解这个方程：对 $f'$ 应用它，$f'$ 的导数是 $f''(x) = 2 + \\frac{8}{x^{3}}$。从 $x_{0} = 1$ 出发，$f'(1) = -2$，$f''(1) = 10$，所以 $x_{1} = 1 - \\frac{-2}{10} = 1.2$。\n\n检验：准确的临界点是 $\\sqrt[3]{2} \\approx 1.26$，$1.2$ 比 $1$ 离它近得多。\n\n本课我们对导数应用牛顿法 $x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$ 来求临界点。",
  ),
  prerequisites: ["newtons-method"],
  encompasses: [
    { topic: "newtons-method", weight: 0.5 },
    { topic: "using-differentiation-to-calculate-critical-points", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "newton-steps-toward-critical-points",
      title: t("Newton steps toward critical points", "向临界点迭代的牛顿步"),
      explanation: t(
        "Critical points solve $f'(x) = 0$, so apply Newton's method to $f'$:\n\n$$x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}.$$\n\nFor example, for $f(x) = x^{3} - 3x^{2}$ from $x_{0} = 3$: $f'(x) = 3x^{2} - 6x$ and $f''(x) = 6x - 6$, so $f'(3) = 9$, $f''(3) = 12$ and $x_{1} = 3 - \\frac{9}{12} = 2.25$, heading for the critical point $x = 2$.\n\nCheck: the tangent line of $f'$ at $3$ is $y = 9 + 12(x - 3)$, which is $0$ at $x = 2.25$.\n\n> **Watch out.** This needs the second derivative, not $f$ itself: Newton's method on $f$ looks for a root of $f$, which is not a critical point.",
        "临界点满足 $f'(x) = 0$，所以对 $f'$ 应用牛顿法：\n\n$$x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}$$\n\n例如对 $f(x) = x^{3} - 3x^{2}$，从 $x_{0} = 3$ 出发：$f'(x) = 3x^{2} - 6x$，$f''(x) = 6x - 6$，所以 $f'(3) = 9$，$f''(3) = 12$，$x_{1} = 3 - \\frac{9}{12} = 2.25$，向临界点 $x = 2$ 靠近。\n\n检验：$f'$ 在 $3$ 处的切线为 $y = 9 + 12(x - 3)$，在 $x = 2.25$ 处为 $0$。\n\n> **注意。** 这里需要的是二阶导数，而不是 $f$ 本身：对 $f$ 用牛顿法求的是 $f$ 的根，那不是临界点。",
      ),
      generate(rng) {
        for (;;) {
          const p: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-4, 4), rng.int(-3, 3), rng.pick([1, -1, 2])];
          const x0 = rng.int(-2, 3);
          const d = pDer(p);
          const x1 = newtonStep(d, Q.of(x0));
          const [f1, f2] = [pAt(d, x0), pAt(pDer(d), x0)];
          if (!x1 || f1 === 0) continue;
          const plain = newtonStep(p, Q.of(x0));
          return numberProblem({
            prompt: t(
              `To locate a critical point of $f(x) = ${pLatex(p)}$, apply one step of Newton's method with $x_{0} = ${x0}$. Find $x_{1}$.`,
              `为求 $f(x) = ${pLatex(p)}$ 的临界点，从 $x_{0} = ${x0}$ 出发用牛顿法迭代一步，求 $x_{1}$。`,
            ),
            answer: x1,
            mistakes: distinct([
              ...(plain
                ? [
                    why(
                      plain,
                      "This applies Newton's method to $f$, which looks for a root of $f$; a critical point is a root of $f'$, so use $f'$ and $f''$.",
                      "这是对 $f$ 用牛顿法，求的是 $f$ 的根；临界点是 $f'$ 的根，所以要用 $f'$ 和 $f''$。",
                    ),
                  ]
                : []),
              ...newtonMistakes(Q.of(x0), Q.of(f1), Q.of(f2), `f'(x_{0})`, `f''(x_{0})`),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate twice", "求两次导"],
                  t(`$f'(x) = ${pLatex(d)}$ and $f''(x) = ${pLatex(pDer(d))}$.`, `$f'(x) = ${pLatex(d)}$，$f''(x) = ${pLatex(pDer(d))}$。`),
                ],
                [
                  ["Evaluate at the guess", "在初始值处求值"],
                  t(`$f'(${x0}) = ${f1}$ and $f''(${x0}) = ${f2}$.`, `$f'(${x0}) = ${f1}$，$f''(${x0}) = ${f2}$。`),
                ],
                [["Take the step", "迭代一步"], t("", ""), [`x_{1} = ${x0} - \\frac{${f1}}{${f2}} = ${L(x1)}`]],
              ],
              t(
                `The tangent line of $f'$ at $x_{0} = ${x0}$ is $${tangentLine(f1, f2, x0)}$. At $x = ${L(x1)}$ the bracket is $${L(x1.sub(Q.of(x0)))}$, so $${tangentZero(f1, f2, x1.sub(Q.of(x0)))}$: $x_{1}$ is where it crosses the axis.`,
                `$f'$ 在 $x_{0} = ${x0}$ 处的切线为 $${tangentLine(f1, f2, x0)}$。在 $x = ${L(x1)}$ 处括号内为 $${L(x1.sub(Q.of(x0)))}$，所以 $${tangentZero(f1, f2, x1.sub(Q.of(x0)))}$：$x_{1}$ 正是它与坐标轴的交点。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "newton-steps-for-transcendental-functions",
      title: t("Newton steps for other functions", "其他函数的牛顿步"),
      explanation: t(
        "The method needs only the value and the derivative of the function at the current guess, so it works just as well for functions that are not polynomials. The same step works for any twice-differentiable function. For $f(x) = x^{2} + \\frac{k}{x}$: $f'(x) = 2x - \\frac{k}{x^{2}}$ and $f''(x) = 2 + \\frac{2k}{x^{3}}$.\n\nFor example, for $k = 4$ and $x_{0} = 1$: $f'(1) = 2 - 4 = -2$ and $f''(1) = 2 + 8 = 10$, so $x_{1} = 1 - \\frac{-2}{10} = 1.2$.\n\nCheck: the critical point solves $2x^{3} = 4$, so it is $\\sqrt[3]{2} \\approx 1.26$, and $1.2$ is close to it.\n\n> **Watch out.** Write $\\frac{k}{x}$ as $kx^{-1}$ before differentiating: its derivative is $-\\frac{k}{x^{2}}$, with a minus sign, and then $+\\frac{2k}{x^{3}}$.",
        "这个方法只需要函数在当前估计值处的值和导数，所以对非多项式函数同样适用。同样的迭代适用于任何二阶可导函数。对 $f(x) = x^{2} + \\frac{k}{x}$：$f'(x) = 2x - \\frac{k}{x^{2}}$，$f''(x) = 2 + \\frac{2k}{x^{3}}$。\n\n例如 $k = 4$，$x_{0} = 1$：$f'(1) = 2 - 4 = -2$，$f''(1) = 2 + 8 = 10$，所以 $x_{1} = 1 - \\frac{-2}{10} = 1.2$。\n\n检验：临界点满足 $2x^{3} = 4$，即 $\\sqrt[3]{2} \\approx 1.26$，$1.2$ 已接近它。\n\n> **注意。** 求导前把 $\\frac{k}{x}$ 写成 $kx^{-1}$：它的导数是 $-\\frac{k}{x^{2}}$，带负号，再求导得 $+\\frac{2k}{x^{3}}$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.int(1, 20);
          const x0 = rng.int(1, 4);
          const f1 = Q.of(2 * x0).sub(Q.of(k, x0 * x0));
          const f2 = Q.of(2).add(Q.of(2 * k, x0 ** 3));
          if (f1.isZero()) continue;
          const x1 = Q.of(x0).sub(f1.div(f2));
          const fx = Q.of(x0 * x0).add(Q.of(k, x0));
          const target = Math.cbrt(k / 2);
          return numberProblem({
            prompt: t(
              `To locate the minimum of $f(x) = x^{2} + \\frac{${k}}{x}$ for $x > 0$, apply one step of Newton's method to $f'$ with $x_{0} = ${x0}$. Find $x_{1}$.`,
              `为求 $f(x) = x^{2} + \\frac{${k}}{x}$（$x > 0$）的最小值点，对 $f'$ 从 $x_{0} = ${x0}$ 出发用牛顿法迭代一步，求 $x_{1}$。`,
            ),
            answer: x1,
            mistakes: distinct([
              ...newtonMistakes(Q.of(x0), f1, f2, `f'(x_{0})`, `f''(x_{0})`).filter((_, i) => i !== 1),
              why(Q.of(x0).sub(f1), `This leaves out the division by $f''(${x0})$.`, `这漏掉了除以 $f''(${x0})$。`),
              why(
                Q.of(x0).sub(fx.div(f1)),
                "This applies Newton's method to $f$ itself, using $f$ and $f'$; for a critical point use $f'$ and $f''$.",
                "这是对 $f$ 本身用牛顿法，用了 $f$ 和 $f'$；求临界点要用 $f'$ 和 $f''$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate twice", "求两次导"],
                  t(
                    `$f(x) = x^{2} + ${k}x^{-1}$, so $f'(x) = 2x - \\frac{${k}}{x^{2}}$ and $f''(x) = 2 + \\frac{${2 * k}}{x^{3}}$.`,
                    `$f(x) = x^{2} + ${k}x^{-1}$，所以 $f'(x) = 2x - \\frac{${k}}{x^{2}}$，$f''(x) = 2 + \\frac{${2 * k}}{x^{3}}$。`,
                  ),
                ],
                [
                  ["Evaluate at the guess", "在初始值处求值"],
                  t(`$f'(${x0}) = ${L(f1)}$ and $f''(${x0}) = ${L(f2)}$.`, `$f'(${x0}) = ${L(f1)}$，$f''(${x0}) = ${L(f2)}$。`),
                ],
                [["Take the step", "迭代一步"], t("", ""), [`x_{1} = ${x0} - \\frac{f'(${x0})}{f''(${x0})} = ${L(x1)}`]],
              ],
              t(
                `The critical point solves $2x^{3} = ${k}$, so it is $\\sqrt[3]{${L(Q.of(k, 2))}} \\approx ${fmt(target)}$. The step moved from $${x0}$ to $${L(x1)} \\approx ${fmt(x1.toNumber())}$, ${Math.abs(x1.toNumber() - target) < Math.abs(x0 - target) ? "closer to it" : "toward it"}.`,
                `临界点满足 $2x^{3} = ${k}$，即 $\\sqrt[3]{${L(Q.of(k, 2))}} \\approx ${fmt(target)}$。这一步从 $${x0}$ 走到 $${L(x1)} \\approx ${fmt(x1.toNumber())}$，${Math.abs(x1.toNumber() - target) < Math.abs(x0 - target) ? "离它更近了" : "朝它移动"}。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** Motion is a cubic position function whose velocity 3g(t − p)(t − q) vanishes at times p < q. */
interface Motion {
  readonly s: Poly;
  readonly p: number;
  readonly q: number;
}

/** motion chooses a position function with two integer turning times, 0 ≤ p < q. */
function motion(rng: Rng): Motion {
  const p = rng.int(0, 4);
  const q = rng.int(p + 1, 7);
  const g = rng.pick([1, 2]);
  const s0 = rng.int(-10, 10);
  // s'(t) = 3g(t − p)(t − q) needs g(p + q) even for integer coefficients.
  const gg = (p + q) % 2 === 0 ? g : 2;
  return { s: [s0, 3 * gg * p * q, (-3 * gg * (p + q)) / 2, gg], p, q };
}

/** factored writes the velocity of a motion in factored form, 3g(t − p)(t − q). */
const factored = (m: Motion) => `${3 * m.s[3]!}${m.p === 0 ? "t" : `(t - ${m.p})`}(t - ${m.q})`;

/** sNum evaluates a polynomial at a decimal time. */
const sNum = (p: Poly, x: number) => p.reduce((acc, c, i) => acc + c * x ** i, 0);

/** calculatingVelocityForStraightLineMotionUsingDifferentiation differentiates position to get velocity. */
export const calculatingVelocityForStraightLineMotionUsingDifferentiation: TopicDef = {
  id: "calculating-velocity-for-straight-line-motion-using-differentiation",
  title: t("Calculating Velocity for Straight-Line Motion Using Differentiation", "用求导计算直线运动的速度"),
  summary: t(
    "Differentiate a position function to find velocity, and find when a particle is at rest.",
    "对位置函数求导得到速度，并求质点静止的时刻。",
  ),
  intro: t(
    "A ball thrown upward is $s(t) = 20t - 5t^{2}$ metres high after $t$ seconds. Its velocity is $v(t) = s'(t) = 20 - 10t$: $10$ m/s upward at $t = 1$, $0$ at $t = 2$ when it reaches the top, and $-10$ m/s, falling, at $t = 3$.\n\nCheck: between $t = 1$ and $t = 1.01$ the ball rises from $15$ m to $15.0995$ m, about $\\frac{0.0995}{0.01} \\approx 9.95$ m/s, close to $v(1) = 10$.\n\nIn this lesson we differentiate position to get velocity, take its size for speed, and find when a particle is at rest.",
    "一个向上抛出的球 $t$ 秒后的高度为 $s(t) = 20t - 5t^{2}$ 米。它的速度为 $v(t) = s'(t) = 20 - 10t$：$t = 1$ 时向上 $10$ 米/秒，$t = 2$ 时为 $0$，此时到达最高点，$t = 3$ 时为 $-10$ 米/秒，正在下落。\n\n检验：从 $t = 1$ 到 $t = 1.01$，球从 $15$ 米升到 $15.0995$ 米，约为 $\\frac{0.0995}{0.01} \\approx 9.95$ 米/秒，接近 $v(1) = 10$。\n\n本课我们对位置求导得到速度，取其大小得到速率，并求质点静止的时刻。",
  ),
  prerequisites: ["rates-of-change-in-applied-contexts"],
  encompasses: [{ topic: "rates-of-change-in-applied-contexts", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-from-position",
      title: t("Velocity from position", "由位置求速度"),
      explanation: t(
        "For a particle moving along a line with position $s(t)$, the velocity is $v(t) = s'(t)$. Positive velocity means moving in the positive direction; negative means the opposite. Speed is $|v(t)|$.\n\nFor example, for $s(t) = t^{3} - 6t$, $v(t) = 3t^{2} - 6$, so $v(1) = -3$: the particle moves in the negative direction at speed $3$.\n\nCheck: $s(1.001) - s(0.999) \\approx -0.006$ over $0.002$ seconds, about $-3$.\n\n> **Watch out.** Velocity is $s'(t)$, not the position $s(t)$ and not the average $\\frac{s(t) - s(0)}{t}$. Speed is never negative.",
        "沿直线运动的质点位置为 $s(t)$，其速度为 $v(t) = s'(t)$。速度为正表示沿正方向运动，为负表示沿反方向运动。速率为 $|v(t)|$。\n\n例如 $s(t) = t^{3} - 6t$ 时，$v(t) = 3t^{2} - 6$，所以 $v(1) = -3$：质点以速率 $3$ 沿负方向运动。\n\n检验：$s(1.001) - s(0.999) \\approx -0.006$，经过 $0.002$ 秒，约为 $-3$。\n\n> **注意。** 速度是 $s'(t)$，不是位置 $s(t)$，也不是平均速度 $\\frac{s(t) - s(0)}{t}$。速率永远不为负。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const t0 = rng.int(1, 5);
        if (kind < 2) {
          const s: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2)];
          const v = pAt(pDer(s), t0);
          const speed = kind === 1;
          const h = 0.001;
          const quotient = (sNum(s, t0 + h) - sNum(s, t0 - h)) / (2 * h);
          const average = Q.of(pAt(s, t0) - pAt(s, 0), t0);
          return numberProblem({
            prompt: t(
              `A particle moves along a line with position $s(t) = ${pLatex(s, "t")}$ metres after $t$ seconds. Find its ${speed ? "speed" : "velocity"} at $t = ${t0}$, in m/s.`,
              `一个质点沿直线运动，$t$ 秒后的位置为 $s(t) = ${pLatex(s, "t")}$ 米。求它在 $t = ${t0}$ 时的${speed ? "速率" : "速度"}（米/秒）。`,
            ),
            answer: speed ? Math.abs(v) : v,
            unit: "m/s",
            mistakes: distinct(
              speed
                ? [
                    why(
                      -Math.abs(v),
                      "Speed is the size of the velocity, $|v|$, which is never negative.",
                      "速率是速度的大小 $|v|$，永远不为负。",
                    ),
                    why(v, "This is the velocity; the speed is its absolute value.", "这是速度；速率是它的绝对值。"),
                    why(
                      pAt(s, t0),
                      `This is the position $s(${t0})$; differentiate to get the velocity first.`,
                      `这是位置 $s(${t0})$；要先求导得到速度。`,
                    ),
                  ]
                : [
                    why(
                      pAt(s, t0),
                      `This is the position $s(${t0})$; the velocity is $s'(${t0})$.`,
                      `这是位置 $s(${t0})$；速度是 $s'(${t0})$。`,
                    ),
                    why(
                      average,
                      `This is the average velocity from $t = 0$ to $t = ${t0}$; the velocity at $t = ${t0}$ is $s'(${t0})$.`,
                      `这是从 $t = 0$ 到 $t = ${t0}$ 的平均速度；$t = ${t0}$ 时的速度是 $s'(${t0})$。`,
                    ),
                    why(
                      pAt(pDer(pDer(s)), t0),
                      "This differentiates twice, which gives the acceleration.",
                      "这求了两次导，得到的是加速度。",
                    ),
                  ],
            ),
            solution: walked(
              [
                [["Differentiate", "求导"], t(`$v(t) = s'(t) = ${pLatex(pDer(s), "t")}$.`, `$v(t) = s'(t) = ${pLatex(pDer(s), "t")}$。`)],
                [["Evaluate", "代入"], t(`$v(${t0}) = ${v}$ m/s.`, `$v(${t0}) = ${v}$ 米/秒。`)],
                ...(speed
                  ? ([
                      [
                        ["Take the size", "取绝对值"],
                        t(`The speed is $|${v}| = ${Math.abs(v)}$ m/s.`, `速率为 $|${v}| = ${Math.abs(v)}$ 米/秒。`),
                      ],
                    ] as const)
                  : []),
              ],
              t(
                `Over a short interval, $\\frac{s(${t0 + h}) - s(${t0 - h})}{${2 * h}} \\approx ${fmt(quotient)}$, which matches $v(${t0}) = ${v}$.`,
                `在很短的区间上，$\\frac{s(${t0 + h}) - s(${t0 - h})}{${2 * h}} \\approx ${fmt(quotient)}$，与 $v(${t0}) = ${v}$ 一致。`,
              ),
            ),
          });
        }
        for (;;) {
          const a = rng.int(1, 9);
          const w = rng.int(1, 4);
          const s0 = rng.pick([0, 1, 2, 3, 4, 6]);
          const ts = ["0", "\\frac{\\pi}{6}", "\\frac{\\pi}{4}", "\\frac{\\pi}{3}", "\\frac{\\pi}{2}", "", "\\pi"];
          const tNum = [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, 0, Math.PI][s0]!;
          const angle = (w * [0, 2, 3, 4, 6, 0, 12][s0]!) % 24;
          const r3 = Math.sqrt(3) / 2;
          const r2 = Math.SQRT1_2;
          const cosTable: Record<number, readonly [number, string]> = {
            0: [1, "1"],
            2: [r3, "\\frac{\\sqrt{3}}{2}"],
            3: [r2, "\\frac{\\sqrt{2}}{2}"],
            4: [0.5, "\\frac{1}{2}"],
            6: [0, "0"],
            8: [-0.5, "-\\frac{1}{2}"],
            9: [-r2, "-\\frac{\\sqrt{2}}{2}"],
            10: [-r3, "-\\frac{\\sqrt{3}}{2}"],
            12: [-1, "-1"],
            14: [-r3, "-\\frac{\\sqrt{3}}{2}"],
            15: [-r2, "-\\frac{\\sqrt{2}}{2}"],
            16: [-0.5, "-\\frac{1}{2}"],
            18: [0, "0"],
            20: [0.5, "\\frac{1}{2}"],
            21: [r2, "\\frac{\\sqrt{2}}{2}"],
            22: [r3, "\\frac{\\sqrt{3}}{2}"],
          };
          const entry = cosTable[angle];
          if (entry === undefined) continue;
          const [c, cLatex] = entry;
          const v = rounded(a * w * c, 3);
          if (!v) continue;
          const exact = Number.isInteger(a * w * c);
          const wt = w === 1 ? "t" : `${w}t`;
          const aw = a * w === 1 ? "" : String(a * w);
          const h = 0.0001;
          const quotient = (a * Math.sin(w * (tNum + h)) - a * Math.sin(w * (tNum - h))) / (2 * h);
          const wrong: Why[] = [];
          const noW = rounded(a * c, 3);
          if (noW && w !== 1)
            wrong.push(
              why(
                noW,
                `This leaves out the factor $${w}$ that the chain rule brings from $\\sin(${wt})$.`,
                `这漏掉了链式法则从 $\\sin(${wt})$ 带出的因子 $${w}$。`,
              ),
            );
          wrong.push(
            why(v.neg(), "This has the sign wrong: the derivative of $\\sin$ is $+\\cos$.", "符号错了：$\\sin$ 的导数是 $+\\cos$。"),
          );
          return numberProblem({
            prompt: t(
              `A mass on a spring has position $s(t) = ${a}\\sin(${wt})$ cm after $t$ seconds. Find its velocity at $t = ${ts[s0]}$, in cm/s${exact ? "" : ", to three decimal places"}.`,
              `弹簧上的物体 $t$ 秒后的位置为 $s(t) = ${a}\\sin(${wt})$ 厘米。求它在 $t = ${ts[s0]}$ 时的速度（厘米/秒）${exact ? "" : "，精确到三位小数"}。`,
            ),
            answer: v,
            form: "decimal",
            mistakes: distinct(wrong),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  w === 1
                    ? t(
                        `The derivative of $\\sin t$ is $\\cos t$, so $v(t) = ${aw}\\cos t$.`,
                        `$\\sin t$ 的导数是 $\\cos t$，所以 $v(t) = ${aw}\\cos t$。`,
                      )
                    : t(
                        `By the chain rule, $v(t) = ${a === 1 ? "" : `${a} \\cdot `}${w}\\cos(${wt}) = ${aw}\\cos(${wt})$.`,
                        `由链式法则，$v(t) = ${a === 1 ? "" : `${a} \\cdot `}${w}\\cos(${wt}) = ${aw}\\cos(${wt})$。`,
                      ),
                ],
                [
                  ["Evaluate", "代入"],
                  t(
                    `$v\\left(${ts[s0]}\\right) = ${aw}\\cos\\left(${w === 1 ? ts[s0] : `${w} \\cdot ${ts[s0]}`}\\right) = ${a * w} \\cdot ${cLatex === "1" ? "1" : `\\left(${cLatex}\\right)`} ${exact ? "=" : "\\approx"} ${v.toNumber()}$ cm/s.`,
                    `$v\\left(${ts[s0]}\\right) = ${aw}\\cos\\left(${w === 1 ? ts[s0] : `${w} \\cdot ${ts[s0]}`}\\right) = ${a * w} \\cdot ${cLatex === "1" ? "1" : `\\left(${cLatex}\\right)`} ${exact ? "=" : "\\approx"} ${v.toNumber()}$ 厘米/秒。`,
                  ),
                ],
              ],
              t(
                `Over a short interval around $t = ${ts[s0]} \\approx ${fmt(tNum)}$, the position changes at about $\\frac{s(t + ${h}) - s(t - ${h})}{${2 * h}} \\approx ${fmt(quotient)}$ cm/s, which matches.`,
                `在 $t = ${ts[s0]} \\approx ${fmt(tNum)}$ 附近很短的区间上，位置的变化率约为 $\\frac{s(t + ${h}) - s(t - ${h})}{${2 * h}} \\approx ${fmt(quotient)}$ 厘米/秒，一致。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "when-a-particle-is-at-rest",
      title: t("When a particle is at rest", "质点何时静止"),
      explanation: t(
        "A particle is momentarily at rest when $v(t) = 0$. Solve $s'(t) = 0$ and keep the times in the allowed range, usually $t \\ge 0$.\n\nFor example, for $s(t) = t^{3} - 6t^{2} + 9t$, $v(t) = 3t^{2} - 12t + 9 = 3(t - 1)(t - 3)$, so the particle is at rest at $t = 1$ and $t = 3$.\n\nCheck: $v(2) = -3$ and $v(4) = 9$, so the velocity does change sign at $t = 3$, and $v(0) = 9$ shows it changes at $t = 1$ too.\n\n> **Watch out.** At rest means $v = 0$, not $a = 0$ and not $s = 0$. Find every zero of $v$, and drop those outside the allowed times.",
        "当 $v(t) = 0$ 时质点瞬时静止。解 $s'(t) = 0$，保留允许范围内的时刻，通常是 $t \\ge 0$。\n\n例如 $s(t) = t^{3} - 6t^{2} + 9t$ 时，$v(t) = 3t^{2} - 12t + 9 = 3(t - 1)(t - 3)$，所以质点在 $t = 1$ 和 $t = 3$ 时静止。\n\n检验：$v(2) = -3$，$v(4) = 9$，所以速度在 $t = 3$ 处确实变号；$v(0) = 9$ 说明在 $t = 1$ 处也变号。\n\n> **注意。** 静止指 $v = 0$，不是 $a = 0$，也不是 $s = 0$。要找出 $v$ 的所有零点，并去掉不在允许时间内的。",
      ),
      generate(rng) {
        const m = motion(rng);
        const values = [m.p, m.q].filter((x) => x > 0).map(String);
        const v = pDer(m.s);
        const mid = m.p + m.q;
        const midText = mid % 2 === 0 ? String(mid / 2) : `${mid}/2`;
        const at = (x: number) => sNum(v, x);
        return solutionsProblem({
          prompt: t(
            `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ for $t > 0$. At what times is it at rest?`,
            `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$，$t > 0$。它在哪些时刻静止？`,
          ),
          variable: "t",
          values,
          mistakes: [
            whySet(
              [midText],
              "This is where the acceleration is $0$; at rest means the velocity is $0$.",
              "这是加速度为 $0$ 的时刻；静止指速度为 $0$。",
            ),
            ...(m.p === 0
              ? [whySet(["0", String(m.q)], "$t = 0$ is not allowed, since $t > 0$.", "$t = 0$ 不在范围内，因为 $t > 0$。")]
              : [
                  whySet([String(m.q)], `The velocity is also $0$ at $t = ${m.p}$.`, `速度在 $t = ${m.p}$ 时也为 $0$。`),
                  whySet([String(m.p)], `The velocity is also $0$ at $t = ${m.q}$.`, `速度在 $t = ${m.q}$ 时也为 $0$。`),
                ]),
          ],
          solution: walked(
            [
              [["Differentiate", "求导"], t(`$v(t) = s'(t) = ${pLatex(v, "t")}$.`, `$v(t) = s'(t) = ${pLatex(v, "t")}$。`)],
              [
                ["Factor and solve", "因式分解并求解"],
                t(
                  `$v(t) = ${factored(m)}$, which is $0$ at $t = ${m.p}$ and $t = ${m.q}$.`,
                  `$v(t) = ${factored(m)}$，在 $t = ${m.p}$ 和 $t = ${m.q}$ 处为 $0$。`,
                ),
              ],
              [
                ["Keep the allowed times", "保留允许的时刻"],
                m.p === 0
                  ? t(`Only $t > 0$ counts, so the particle is at rest at $t = ${m.q}$.`, `只取 $t > 0$，所以质点在 $t = ${m.q}$ 时静止。`)
                  : t(
                      `Both are positive, so the particle is at rest at $t = ${m.p}$ and $t = ${m.q}$.`,
                      `两者都为正，所以质点在 $t = ${m.p}$ 和 $t = ${m.q}$ 时静止。`,
                    ),
              ],
            ],
            t(
              m.p > 0
                ? `The velocity changes sign at both times: $v(${fmt(m.p - 0.5)}) = ${fmt(at(m.p - 0.5))}$ before, $v(${fmt(m.p + 0.5)}) = ${fmt(at(m.p + 0.5))}$ between them and $v(${m.q + 1}) = ${fmt(at(m.q + 1))}$ after.`
                : `The velocity changes sign at $t = ${m.q}$: $v(${fmt(m.q - 0.5)}) = ${fmt(at(m.q - 0.5))}$ before and $v(${m.q + 1}) = ${fmt(at(m.q + 1))}$ after.`,
              m.p > 0
                ? `速度在两个时刻都变号：之前 $v(${fmt(m.p - 0.5)}) = ${fmt(at(m.p - 0.5))}$，两者之间 $v(${fmt(m.p + 0.5)}) = ${fmt(at(m.p + 0.5))}$，之后 $v(${m.q + 1}) = ${fmt(at(m.q + 1))}$。`
                : `速度在 $t = ${m.q}$ 处变号：之前 $v(${fmt(m.q - 0.5)}) = ${fmt(at(m.q - 0.5))}$，之后 $v(${m.q + 1}) = ${fmt(at(m.q + 1))}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculatingAccelerationForStraightLineMotionUsingDifferentiation differentiates velocity to get acceleration. */
export const calculatingAccelerationForStraightLineMotionUsingDifferentiation: TopicDef = {
  id: "calculating-acceleration-for-straight-line-motion-using-differentiation",
  title: t("Calculating Acceleration for Straight-Line Motion Using Differentiation", "用求导计算直线运动的加速度"),
  summary: t(
    "Differentiate twice to find acceleration, including at the moments a particle stops.",
    "求两次导数得到加速度，包括质点停止的时刻的加速度。",
  ),
  intro: t(
    "For the ball at height $s(t) = 20t - 5t^{2}$, the velocity $v(t) = 20 - 10t$ drops by $10$ m/s every second, so the acceleration is $a(t) = v'(t) = s''(t) = -10$ m/s². At the top, $t = 2$, the ball is at rest, yet its acceleration is still $-10$: that is what turns it around.\n\nCheck: $v(1) = 10$ and $v(3) = -10$, a change of $-20$ m/s over $2$ seconds, which is $-10$ m/s² on average.\n\nIn this lesson we differentiate velocity, or position twice, to get acceleration, including at the moments a particle stops.",
    "对高度为 $s(t) = 20t - 5t^{2}$ 的球，速度 $v(t) = 20 - 10t$ 每秒减少 $10$ 米/秒，所以加速度为 $a(t) = v'(t) = s''(t) = -10$ 米/秒²。在最高点 $t = 2$ 时球静止，但加速度仍是 $-10$：正是它让球掉头。\n\n检验：$v(1) = 10$，$v(3) = -10$，$2$ 秒内变化 $-20$ 米/秒，平均为 $-10$ 米/秒²。\n\n本课我们对速度求导（或对位置求两次导）得到加速度，包括质点停止时刻的加速度。",
  ),
  prerequisites: ["calculating-velocity-for-straight-line-motion-using-differentiation"],
  encompasses: [{ topic: "calculating-velocity-for-straight-line-motion-using-differentiation", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "acceleration-from-position",
      title: t("Acceleration from position", "由位置求加速度"),
      explanation: t(
        "Acceleration is the rate of change of velocity: $a(t) = v'(t) = s''(t)$. Given velocity, differentiate once; given position, twice.\n\nFor example, for $s(t) = t^{3} - 6t$, $v(t) = 3t^{2} - 6$ and $a(t) = 6t$, so $a(2) = 12$ m/s².\n\nCheck: $v(2.5) - v(1.5) = 12.75 - 0.75 = 12$ over one second, matching $a(2) = 12$.\n\n> **Watch out.** Count the derivatives: from velocity one, from position two. The acceleration is not the velocity, and not the value of the given function.",
        "加速度是速度的变化率：$a(t) = v'(t) = s''(t)$。已知速度时求一次导，已知位置时求两次导。\n\n例如 $s(t) = t^{3} - 6t$ 时，$v(t) = 3t^{2} - 6$，$a(t) = 6t$，所以 $a(2) = 12$ 米/秒²。\n\n检验：$v(2.5) - v(1.5) = 12.75 - 0.75 = 12$，经过一秒，与 $a(2) = 12$ 一致。\n\n> **注意。** 数清求导次数：已知速度求一次，已知位置求两次。加速度不是速度，也不是已知函数的值。",
      ),
      generate(rng) {
        const t0 = rng.int(0, 5);
        const fromVelocity = rng.bool();
        const s: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2), rng.int(-1, 1)];
        const given = fromVelocity ? pDer(s) : s;
        const v = pDer(s);
        const acc = pDer(v);
        const answer = pAt(acc, t0);
        const h = 0.001;
        const quotient = (sNum(v, t0 + h) - sNum(v, t0 - h)) / (2 * h);
        return numberProblem({
          prompt: t(
            `A particle moves along a line with ${fromVelocity ? "velocity" : "position"} $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "m/s" : "m"} after $t$ seconds. Find its acceleration at $t = ${t0}$, in m/s².`,
            `一个质点沿直线运动，$t$ 秒后的${fromVelocity ? "速度" : "位置"}为 $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "米/秒" : "米"}。求它在 $t = ${t0}$ 时的加速度（米/秒²）。`,
          ),
          answer,
          unit: "m/s^2",
          mistakes: distinct(
            fromVelocity
              ? [
                  why(
                    pAt(v, t0),
                    `This is the velocity $v(${t0})$; differentiate it once to get the acceleration.`,
                    `这是速度 $v(${t0})$；对它求一次导才是加速度。`,
                  ),
                  why(pAt(pDer(acc), t0), "This differentiates the velocity twice; once is enough.", "这对速度求了两次导；一次就够了。"),
                ]
              : [
                  why(pAt(v, t0), `This is the velocity $s'(${t0})$; differentiate once more.`, `这是速度 $s'(${t0})$；还要再求一次导。`),
                  why(pAt(s, t0), `This is the position $s(${t0})$.`, `这是位置 $s(${t0})$。`),
                  why(
                    pAt(pDer(acc), t0),
                    "This differentiates the position three times; acceleration is the second derivative.",
                    "这对位置求了三次导；加速度是二阶导数。",
                  ),
                ],
          ),
          solution: walked(
            [
              fromVelocity
                ? [
                    ["Differentiate the velocity", "对速度求导"],
                    t(`$a(t) = v'(t) = ${pLatex(acc, "t")}$.`, `$a(t) = v'(t) = ${pLatex(acc, "t")}$。`),
                  ]
                : [
                    ["Differentiate twice", "求两次导"],
                    t(
                      `$v(t) = s'(t) = ${pLatex(v, "t")}$, so $a(t) = s''(t) = ${pLatex(acc, "t")}$.`,
                      `$v(t) = s'(t) = ${pLatex(v, "t")}$，所以 $a(t) = s''(t) = ${pLatex(acc, "t")}$。`,
                    ),
                  ],
              [["Evaluate", "代入"], t(`$a(${t0}) = ${answer}$ m/s².`, `$a(${t0}) = ${answer}$ 米/秒²。`)],
            ],
            t(
              `The velocity changes at about $\\frac{v(${t0 + h}) - v(${t0 - h})}{${2 * h}} \\approx ${fmt(quotient)}$ m/s per second, which matches $a(${t0}) = ${answer}$.`,
              `速度的变化率约为 $\\frac{v(${t0 + h}) - v(${t0 - h})}{${2 * h}} \\approx ${fmt(quotient)}$ 米/秒每秒，与 $a(${t0}) = ${answer}$ 一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "acceleration-when-a-particle-stops",
      title: t("Acceleration when a particle stops", "质点停止时的加速度"),
      explanation: t(
        "To find the acceleration at the moment a particle is at rest, first solve $v(t) = 0$ for the time, then evaluate $a(t)$ there. A particle at rest can still be accelerating: that is how it turns around.\n\nFor example, for $s(t) = t^{3} - 6t^{2} + 9t$, $v(t) = 3(t - 1)(t - 3)$ is $0$ at $t = 1$ and $t = 3$, and $a(t) = 6t - 12$, so $a(1) = -6$ and $a(3) = 6$.\n\nCheck: $v(0.5) = 3.75$ and $v(1.5) = -2.25$, so near $t = 1$ the velocity falls by $6$ in one second, matching $a(1) = -6$.\n\n> **Watch out.** At rest the velocity is $0$, but the acceleration usually is not. Evaluate $a$, not $s$, at the stopping time.",
        "求质点静止时刻的加速度，先解 $v(t) = 0$ 得到时刻，再计算该时刻的 $a(t)$。静止的质点仍然可以有加速度：正是这样它才会掉头。\n\n例如 $s(t) = t^{3} - 6t^{2} + 9t$ 时，$v(t) = 3(t - 1)(t - 3)$ 在 $t = 1$ 和 $t = 3$ 处为 $0$，$a(t) = 6t - 12$，所以 $a(1) = -6$，$a(3) = 6$。\n\n检验：$v(0.5) = 3.75$，$v(1.5) = -2.25$，所以在 $t = 1$ 附近速度一秒内下降 $6$，与 $a(1) = -6$ 一致。\n\n> **注意。** 静止时速度为 $0$，但加速度通常不为 $0$。在停止时刻计算的是 $a$，不是 $s$。",
      ),
      generate(rng) {
        const m = motion(rng);
        const first = m.p > 0 && rng.bool();
        const at = first ? m.p : m.q;
        const other = first ? m.q : m.p;
        const acc = pDer(pDer(m.s));
        const answer = pAt(acc, at);
        const v = pDer(m.s);
        const quotient = sNum(v, at + 0.5) - sNum(v, at - 0.5);
        return numberProblem({
          prompt: t(
            `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ metres for $t > 0$ seconds. It ${m.p > 0 ? `stops twice. Find its acceleration, in m/s², at the ${first ? "first" : "second"} time it stops.` : "stops once. Find its acceleration, in m/s², at that moment."}`,
            `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$ 米，$t > 0$ 秒。它${m.p > 0 ? `停止了两次。求它${first ? "第一次" : "第二次"}停止时的加速度（米/秒²）。` : "停止了一次。求那一刻的加速度（米/秒²）。"}`,
          ),
          answer,
          unit: "m/s^2",
          mistakes: distinct([
            why(
              0,
              "The velocity is $0$ when it stops, but the acceleration is not: it is what turns the particle around.",
              "停止时速度为 $0$，但加速度不为 $0$：正是它让质点掉头。",
            ),
            why(
              pAt(m.s, at),
              `This is the position $s(${at})$; evaluate the acceleration $a(${at})$.`,
              `这是位置 $s(${at})$；要计算加速度 $a(${at})$。`,
            ),
            why(
              -answer,
              m.p > 0
                ? `This is the acceleration at the other stop, $t = ${other}$.`
                : "This is the acceleration at $t = 0$, which is not allowed.",
              m.p > 0 ? `这是另一次停止 $t = ${other}$ 时的加速度。` : "这是 $t = 0$ 时的加速度，而 $t = 0$ 不在范围内。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find when it stops", "求停止时刻"],
                t(
                  `$v(t) = ${pLatex(v, "t")} = ${factored(m)}$ is $0$ at $t = ${m.p}$ and $t = ${m.q}$${m.p === 0 ? `, and only $t = ${m.q}$ is allowed` : ""}, so the time is $t = ${at}$.`,
                  `$v(t) = ${pLatex(v, "t")} = ${factored(m)}$ 在 $t = ${m.p}$ 和 $t = ${m.q}$ 处为 $0$${m.p === 0 ? `，只有 $t = ${m.q}$ 符合要求` : ""}，所以时刻为 $t = ${at}$。`,
                ),
              ],
              [["Differentiate again", "再求导"], t(`$a(t) = v'(t) = ${pLatex(acc, "t")}$.`, `$a(t) = v'(t) = ${pLatex(acc, "t")}$。`)],
              [["Evaluate", "代入"], t(`$a(${at}) = ${answer}$ m/s².`, `$a(${at}) = ${answer}$ 米/秒²。`)],
            ],
            t(
              `Around $t = ${at}$ the velocity goes from $v(${fmt(at - 0.5)}) = ${fmt(sNum(v, at - 0.5))}$ to $v(${fmt(at + 0.5)}) = ${fmt(sNum(v, at + 0.5))}$, a change of $${fmt(quotient)}$ in one second, matching $a(${at}) = ${answer}$.`,
              `在 $t = ${at}$ 附近，速度从 $v(${fmt(at - 0.5)}) = ${fmt(sNum(v, at - 0.5))}$ 变为 $v(${fmt(at + 0.5)}) = ${fmt(sNum(v, at + 0.5))}$，一秒内变化 $${fmt(quotient)}$，与 $a(${at}) = ${answer}$ 一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** determiningCharacteristicsOfMovingObjectsUsingDifferentiation finds direction, speeding up and distance traveled. */
export const determiningCharacteristicsOfMovingObjectsUsingDifferentiation: TopicDef = {
  id: "determining-characteristics-of-moving-objects-using-differentiation",
  title: t("Determining Characteristics of Moving Objects Using Differentiation", "用求导确定运动物体的特征"),
  summary: t(
    "Decide when a particle speeds up or slows down, and find the total distance it travels.",
    "判断质点何时加速、何时减速，并求它运动的总路程。",
  ),
  intro: t(
    "A particle has position $s(t) = t^{3} - 6t^{2} + 9t$. Its velocity $v(t) = 3(t - 1)(t - 3)$ is positive before $t = 1$, negative between $1$ and $3$, and positive after. From $t = 0$ to $t = 4$ it goes from $0$ to $4$, back to $0$, and out to $4$ again: it ends $4$ m from the start, but travels $4 + 4 + 4 = 12$ m.\n\nCheck: at $t = 2$, $v = -3$ and $a = 6t - 12 = 0$; at $t = 2.5$, $v = -2.25$ and $a = 3$, opposite signs, and indeed the speed falls from $3$ to $2.25$.\n\nIn this lesson we decide when a particle speeds up or slows down from the signs of $v$ and $a$, and add up the legs of its trip for the total distance.",
    "一个质点的位置为 $s(t) = t^{3} - 6t^{2} + 9t$。速度 $v(t) = 3(t - 1)(t - 3)$ 在 $t = 1$ 之前为正，$1$ 与 $3$ 之间为负，之后为正。从 $t = 0$ 到 $t = 4$，它从 $0$ 到 $4$，回到 $0$，再到 $4$：终点离起点 $4$ 米，但走过的路程是 $4 + 4 + 4 = 12$ 米。\n\n检验：$t = 2$ 时 $v = -3$，$a = 6t - 12 = 0$；$t = 2.5$ 时 $v = -2.25$，$a = 3$，异号，速率确实从 $3$ 降到 $2.25$。\n\n本课我们由 $v$ 与 $a$ 的符号判断质点何时加速、何时减速，并把各段行程相加求总路程。",
  ),
  prerequisites: ["calculating-acceleration-for-straight-line-motion-using-differentiation"],
  encompasses: [{ topic: "calculating-acceleration-for-straight-line-motion-using-differentiation", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "speeding-up-and-slowing-down",
      title: t("Speeding up and slowing down", "加速与减速"),
      explanation: t(
        "A particle is speeding up when $v$ and $a$ have the same sign, and slowing down when they have opposite signs. Negative acceleration alone does not mean slowing down: if $v < 0$ too, the particle moves faster and faster in the negative direction.\n\nFor example, for $s(t) = t^{3} - 6t^{2} + 9t$ at $t = 1.5$: $v = -2.25$ and $a = -3$, the same sign, so it is speeding up.\n\nCheck: the speed $|v|$ is $2.25$ at $t = 1.5$ and $|v(1.6)| = 2.52$ a moment later, so it is growing.\n\n> **Watch out.** Compare the signs of $v$ and $a$; the sign of $a$ alone does not decide it.",
        "当 $v$ 与 $a$ 同号时质点在加速，异号时在减速。仅仅加速度为负并不意味着减速：如果 $v$ 也为负，质点会沿负方向越来越快。\n\n例如对 $s(t) = t^{3} - 6t^{2} + 9t$，在 $t = 1.5$ 时：$v = -2.25$，$a = -3$，同号，所以在加速。\n\n检验：$t = 1.5$ 时速率 $|v|$ 为 $2.25$，片刻后 $|v(1.6)| = 2.52$，确实在增大。\n\n> **注意。** 要比较 $v$ 与 $a$ 的符号；仅凭 $a$ 的符号不能判断。",
      ),
      generate(rng) {
        for (;;) {
          const m = motion(rng);
          const t0 = rng.int(1, 8);
          const [v, a] = [pAt(pDer(m.s), t0), pAt(pDer(pDer(m.s)), t0)];
          if (v === 0 || a === 0) continue;
          const options = [t("Speeding up", "加速"), t("Slowing down", "减速")];
          const right = v * a > 0 ? 0 : 1;
          const sign = (x: number) => (x > 0 ? t("positive", "正") : t("negative", "负"));
          const later = Math.abs(sNum(pDer(m.s), t0 + 0.1));
          return reasoned(
            oneOf(
              rng,
              t(
                `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$. Is it speeding up or slowing down at $t = ${t0}$?`,
                `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$。它在 $t = ${t0}$ 时是在加速还是减速？`,
              ),
              options[right]!,
              [options[1 - right]!],
              walked(
                [
                  [
                    ["Find the velocity", "求速度"],
                    t(
                      `$v(t) = ${pLatex(pDer(m.s), "t")}$, so $v(${t0}) = ${v}$.`,
                      `$v(t) = ${pLatex(pDer(m.s), "t")}$，所以 $v(${t0}) = ${v}$。`,
                    ),
                  ],
                  [
                    ["Find the acceleration", "求加速度"],
                    t(
                      `$a(t) = ${pLatex(pDer(pDer(m.s)), "t")}$, so $a(${t0}) = ${a}$.`,
                      `$a(t) = ${pLatex(pDer(pDer(m.s)), "t")}$，所以 $a(${t0}) = ${a}$。`,
                    ),
                  ],
                  [
                    ["Compare the signs", "比较符号"],
                    t(
                      `They have ${right === 0 ? "the same sign, so it is speeding up" : "opposite signs, so it is slowing down"}.`,
                      `两者${right === 0 ? "同号，所以在加速" : "异号，所以在减速"}。`,
                    ),
                  ],
                ],
                t(
                  `The speed is $|v(${t0})| = ${Math.abs(v)}$, and a moment later $|v(${t0 + 0.1})| \\approx ${fmt(later)}$, which is ${later > Math.abs(v) ? "larger" : "smaller"}.`,
                  `速率 $|v(${t0})| = ${Math.abs(v)}$，片刻后 $|v(${t0 + 0.1})| \\approx ${fmt(later)}$，${later > Math.abs(v) ? "更大" : "更小"}。`,
                ),
              ),
            ),
            [
              right === 0
                ? [
                    "Slowing down",
                    `Slowing down needs $v$ and $a$ of opposite signs; here both are ${sign(v).en}${a < 0 ? ", and a negative $a$ alone does not mean slowing down" : ""}.`,
                    `减速需要 $v$ 与 $a$ 异号；这里两者都为${sign(v)["zh-CN"]}${a < 0 ? "，仅凭 $a$ 为负并不意味着减速" : ""}。`,
                  ]
                : [
                    "Speeding up",
                    `Speeding up needs $v$ and $a$ of the same sign; here $v$ is ${sign(v).en} and $a$ is ${sign(a).en}${a > 0 ? ", and a positive $a$ alone does not mean speeding up" : ""}.`,
                    `加速需要 $v$ 与 $a$ 同号；这里 $v$ 为${sign(v)["zh-CN"]}，$a$ 为${sign(a)["zh-CN"]}${a > 0 ? "，仅凭 $a$ 为正并不意味着加速" : ""}。`,
                  ],
            ],
          );
        }
      },
    },
    {
      id: "total-distance-traveled",
      title: t("Total distance traveled", "运动的总路程"),
      explanation: t(
        "Displacement $s(b) - s(a)$ ignores turning back. For the total distance, split $[a, b]$ at the times where $v$ changes sign and add the distances $|s(t_{k+1}) - s(t_{k})|$ of the pieces.\n\nFor example, for $s(t) = t^{3} - 6t^{2} + 9t$ on $[0, 4]$, $v = 3(t - 1)(t - 3)$ changes sign at $1$ and $3$; $s(0) = 0$, $s(1) = 4$, $s(3) = 0$ and $s(4) = 4$, so the distance is $4 + 4 + 4 = 12$.\n\nCheck: with signs the legs are $4 - 4 + 4 = 4 = s(4) - s(0)$, the displacement, so the positions are consistent.\n\n> **Watch out.** Do not stop at the displacement $s(b) - s(a)$, and do not skip a turning point: every leg counts as positive.",
        "位移 $s(b) - s(a)$ 不考虑折返。求总路程时，在 $v$ 变号的时刻把 $[a, b]$ 分段，再把各段的路程 $|s(t_{k+1}) - s(t_{k})|$ 相加。\n\n例如 $s(t) = t^{3} - 6t^{2} + 9t$ 在 $[0, 4]$ 上，$v = 3(t - 1)(t - 3)$ 在 $1$ 和 $3$ 处变号；$s(0) = 0$，$s(1) = 4$，$s(3) = 0$，$s(4) = 4$，所以路程为 $4 + 4 + 4 = 12$。\n\n检验：带符号的各段为 $4 - 4 + 4 = 4 = s(4) - s(0)$，即位移，各位置前后一致。\n\n> **注意。** 不要停在位移 $s(b) - s(a)$，也不要漏掉折返点：每一段都按正数计。",
      ),
      generate(rng) {
        const m = motion(rng);
        const T = m.q + rng.int(1, 3);
        const times = [0, ...[m.p, m.q].filter((x) => x > 0), T];
        const pos = times.map((x) => pAt(m.s, x));
        const legs = pos.slice(1).map((y, i) => Math.abs(y - pos[i]!));
        const signed = pos.slice(1).map((y, i) => y - pos[i]!);
        const answer = legs.reduce((a, b) => a + b, 0);
        const displacement = pos[pos.length - 1]! - pos[0]!;
        const at = (x: number) => pAt(m.s, x);
        const skip = (x: number) => Math.abs(at(x) - at(0)) + Math.abs(at(T) - at(x));
        return numberProblem({
          prompt: t(
            `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ metres. Find the total distance it travels from $t = 0$ to $t = ${T}$, in metres.`,
            `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$ 米。求它从 $t = 0$ 到 $t = ${T}$ 运动的总路程（米）。`,
          ),
          answer,
          unit: "m",
          mistakes: distinct([
            why(
              Math.abs(displacement),
              "This is the size of the displacement; the particle turns back, so add the legs of the trip.",
              "这是位移的大小；质点会折返，要把各段路程相加。",
            ),
            why(
              displacement,
              `This is the displacement $s(${T}) - s(0)$, which ignores turning back.`,
              `这是位移 $s(${T}) - s(0)$，没有考虑折返。`,
            ),
            why(pos[pos.length - 1]!, `This is the position $s(${T})$, not a distance traveled.`, `这是位置 $s(${T})$，不是走过的路程。`),
            ...(m.p > 0
              ? [
                  why(skip(m.q), `This misses the turn at $t = ${m.p}$.`, `这漏掉了 $t = ${m.p}$ 处的折返。`),
                  why(skip(m.p), `This misses the turn at $t = ${m.q}$.`, `这漏掉了 $t = ${m.q}$ 处的折返。`),
                ]
              : []),
          ]),
          solution: walked(
            [
              [
                ["Find the turning points", "求折返点"],
                t(
                  `$v(t) = ${pLatex(pDer(m.s), "t")} = ${factored(m)}$ changes sign at $t = ${times.slice(1, -1).join("$ and $t = ")}$.`,
                  `$v(t) = ${pLatex(pDer(m.s), "t")} = ${factored(m)}$ 在 $t = ${times.slice(1, -1).join("$ 和 $t = ")}$ 处变号。`,
                ),
              ],
              [
                ["Find the positions", "求各时刻位置"],
                t(
                  `${times.map((x, i) => `$s(${x}) = ${pos[i]}$`).join(", ")}.`,
                  `${times.map((x, i) => `$s(${x}) = ${pos[i]}$`).join("，")}。`,
                ),
              ],
              [
                ["Add the legs", "把各段相加"],
                t(`The distance is $${legs.join(" + ")} = ${answer}$ m.`, `路程为 $${legs.join(" + ")} = ${answer}$ 米。`),
              ],
            ],
            t(
              `With signs the legs are $${signed.map((x, i) => (i === 0 ? String(x) : x < 0 ? `- ${-x}` : `+ ${x}`)).join(" ")} = ${displacement} = s(${T}) - s(0)$, the displacement, so the positions are consistent; the distance counts every leg as positive.`,
              `带符号的各段为 $${signed.map((x, i) => (i === 0 ? String(x) : x < 0 ? `- ${-x}` : `+ ${x}`)).join(" ")} = ${displacement} = s(${T}) - s(0)$，即位移，各位置前后一致；路程把每一段都按正数计。`,
            ),
          ),
        });
      },
    },
  ],
};

/** newtonsSecondLaw relates force to the acceleration of a moving mass. */
export const newtonsSecondLaw: TopicDef = {
  id: "newtons-second-law",
  title: t("Newton's Second Law", "牛顿第二定律"),
  summary: t(
    "Find the force on a moving object from its mass and its position or velocity function.",
    "由物体的质量及其位置或速度函数求它所受的力。",
  ),
  intro: t(
    "A $2$ kg cart has position $s(t) = t^{3}$ m after $t$ seconds. Its acceleration is $a(t) = s''(t) = 6t$, so at $t = 1$ it is $6$ m/s², and Newton's second law gives the net force $F = ma = 2 \\cdot 6 = 12$ N; at $t = 2$ it is $24$ N.\n\nCheck: the velocity $v(t) = 3t^{2}$ goes from $v(0.5) = 0.75$ to $v(1.5) = 6.75$, a change of $6$ m/s in one second, so $a(1) = 6$ and $F = 12$ N.\n\nIn this lesson we find the net force on a moving object as its mass times its acceleration, and the moments when that force is zero.",
    "一辆 $2$ 千克的小车 $t$ 秒后的位置为 $s(t) = t^{3}$ 米。它的加速度为 $a(t) = s''(t) = 6t$，所以 $t = 1$ 时为 $6$ 米/秒²，由牛顿第二定律，合力为 $F = ma = 2 \\cdot 6 = 12$ N；$t = 2$ 时为 $24$ N。\n\n检验：速度 $v(t) = 3t^{2}$ 从 $v(0.5) = 0.75$ 变为 $v(1.5) = 6.75$，一秒内变化 $6$ 米/秒，所以 $a(1) = 6$，$F = 12$ N。\n\n本课我们把运动物体所受的合力求为质量乘以加速度，并求合力为零的时刻。",
  ),
  prerequisites: ["calculating-acceleration-for-straight-line-motion-using-differentiation"],
  encompasses: [{ topic: "calculating-acceleration-for-straight-line-motion-using-differentiation", weight: 0.4 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "force-from-motion",
      title: t("Force from motion", "由运动求力"),
      explanation: t(
        "Newton's second law says the net force on an object of constant mass $m$ is $F = ma$. With $m$ in kilograms and $a$ in m/s², $F$ is in newtons (N). So $F(t) = m \\, s''(t)$.\n\nFor example, a $3$ kg object with velocity $v(t) = t^{2} + 1$ has $a(t) = 2t$, so at $t = 2$ the net force is $3 \\cdot 4 = 12$ N.\n\nCheck: $v(2.5) - v(1.5) = 7.25 - 3.25 = 4$ m/s in one second, so $a(2) = 4$ and $F = 12$ N.\n\n> **Watch out.** Multiply the acceleration by the mass, not the velocity or the position. Given velocity, differentiate once; given position, twice.",
        "牛顿第二定律：质量恒为 $m$ 的物体所受合力为 $F = ma$。$m$ 以千克、$a$ 以米/秒² 为单位时，$F$ 以牛顿（N）为单位。所以 $F(t) = m \\, s''(t)$。\n\n例如质量 $3$ 千克、速度 $v(t) = t^{2} + 1$ 的物体，$a(t) = 2t$，所以 $t = 2$ 时合力为 $3 \\cdot 4 = 12$ N。\n\n检验：$v(2.5) - v(1.5) = 7.25 - 3.25 = 4$ 米/秒，经过一秒，所以 $a(2) = 4$，$F = 12$ N。\n\n> **注意。** 用质量乘以加速度，而不是速度或位置。已知速度求一次导，已知位置求两次导。",
      ),
      generate(rng) {
        const mass = rng.int(2, 20);
        const t0 = rng.int(0, 5);
        const fromVelocity = rng.bool();
        const s: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2)];
        const given = fromVelocity ? pDer(s) : s;
        const v = pDer(s);
        const acc = pDer(v);
        const a = pAt(acc, t0);
        const answer = mass * a;
        const change = sNum(v, t0 + 0.5) - sNum(v, t0 - 0.5);
        return numberProblem({
          prompt: t(
            `An object of mass $${mass}$ kg moves along a line with ${fromVelocity ? "velocity" : "position"} $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "m/s" : "m"} after $t$ seconds. Find the net force on it at $t = ${t0}$, in newtons.`,
            `质量为 $${mass}$ 千克的物体沿直线运动，$t$ 秒后的${fromVelocity ? "速度" : "位置"}为 $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "米/秒" : "米"}。求它在 $t = ${t0}$ 时所受的合力（牛顿）。`,
          ),
          answer,
          unit: "N",
          mistakes: distinct([
            why(a, `This is the acceleration; multiply it by the mass $${mass}$ kg.`, `这是加速度；还要乘以质量 $${mass}$ 千克。`),
            why(
              mass * pAt(v, t0),
              "This multiplies the mass by the velocity; force is mass times acceleration.",
              "这是质量乘以速度；力是质量乘以加速度。",
            ),
            fromVelocity
              ? why(
                  mass * pAt(pDer(acc), t0),
                  "This differentiates the velocity twice; once gives the acceleration.",
                  "这对速度求了两次导；求一次就得到加速度。",
                )
              : why(mass * pAt(s, t0), "This multiplies the mass by the position.", "这是质量乘以位置。"),
          ]),
          solution: walked(
            [
              [
                ["Find the acceleration", "求加速度"],
                fromVelocity
                  ? t(
                      `$a(t) = v'(t) = ${pLatex(acc, "t")}$, so $a(${t0}) = ${a}$ m/s².`,
                      `$a(t) = v'(t) = ${pLatex(acc, "t")}$，所以 $a(${t0}) = ${a}$ 米/秒²。`,
                    )
                  : t(
                      `$v(t) = ${pLatex(v, "t")}$ and $a(t) = s''(t) = ${pLatex(acc, "t")}$, so $a(${t0}) = ${a}$ m/s².`,
                      `$v(t) = ${pLatex(v, "t")}$，$a(t) = s''(t) = ${pLatex(acc, "t")}$，所以 $a(${t0}) = ${a}$ 米/秒²。`,
                    ),
              ],
              [
                ["Apply Newton's second law", "应用牛顿第二定律"],
                t(`$F = ma = ${mass} \\cdot ${par(a)} = ${answer}$ N.`, `$F = ma = ${mass} \\cdot ${par(a)} = ${answer}$ N。`),
              ],
            ],
            t(
              `The velocity changes by $v(${fmt(t0 + 0.5)}) - v(${fmt(t0 - 0.5)}) = ${fmt(change)}$ m/s in the second around $t = ${t0}$, so $a(${t0}) = ${a}$, and $\\frac{F}{m} = \\frac{${answer}}{${mass}} = ${a}$.`,
              `在 $t = ${t0}$ 前后的一秒内，速度变化 $v(${fmt(t0 + 0.5)}) - v(${fmt(t0 - 0.5)}) = ${fmt(change)}$ 米/秒，所以 $a(${t0}) = ${a}$，而 $\\frac{F}{m} = \\frac{${answer}}{${mass}} = ${a}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "when-the-force-vanishes",
      figure: calculusDrawings3["newtons-second-law#when-the-force-vanishes"],
      title: t("When the net force is zero", "合力何时为零"),
      explanation: t(
        "The net force is zero exactly when the acceleration is zero. At that moment the velocity is momentarily neither increasing nor decreasing.\n\nFor example, for $s(t) = t^{3} - 6t^{2} + 9t$, $a(t) = 6t - 12$ is $0$ at $t = 2$, so the net force is zero then, whatever the mass.\n\nCheck: $a(1.5) = -3$ and $a(2.5) = 3$, so the force changes direction at $t = 2$, halfway between the stops at $t = 1$ and $t = 3$.\n\n> **Watch out.** Solve $a(t) = 0$, not $v(t) = 0$: at the stops the velocity is $0$ but the force is not. The mass does not change when $a = 0$.",
        "合力为零当且仅当加速度为零。在那一刻，速度瞬时既不增大也不减小。\n\n例如 $s(t) = t^{3} - 6t^{2} + 9t$ 时，$a(t) = 6t - 12$ 在 $t = 2$ 处为 $0$，所以那时合力为零，与质量无关。\n\n检验：$a(1.5) = -3$，$a(2.5) = 3$，所以力在 $t = 2$ 处改变方向，恰在 $t = 1$ 与 $t = 3$ 两次停止的中间。\n\n> **注意。** 要解 $a(t) = 0$，不是 $v(t) = 0$：停止时速度为 $0$，但力不为 $0$。$a = 0$ 的时刻与质量无关。",
      ),
      generate(rng) {
        const mass = rng.int(2, 20);
        const m = motion(rng);
        const answer = Q.of(m.p + m.q, 2);
        const acc = pDer(pDer(m.s));
        const an = answer.toNumber();
        return numberProblem({
          prompt: t(
            `An object of mass $${mass}$ kg moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ m. At what time $t$, in seconds, is the net force on it zero?`,
            `质量为 $${mass}$ 千克的物体沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$ 米。在哪个时刻 $t$（秒）它所受的合力为零？`,
          ),
          answer,
          unit: "s",
          mistakes: distinct([
            why(
              m.p,
              `The object stops at $t = ${m.p}$: the velocity is $0$ there, not the acceleration.`,
              `物体在 $t = ${m.p}$ 时停止：那里速度为 $0$，而不是加速度。`,
            ),
            why(
              m.q,
              `The object stops at $t = ${m.q}$: the velocity is $0$ there, not the acceleration.`,
              `物体在 $t = ${m.q}$ 时停止：那里速度为 $0$，而不是加速度。`,
            ),
            why(
              m.p + m.q,
              `This adds the stopping times $${m.p}$ and $${m.q}$; the acceleration $${pLatex(acc, "t")}$ is $0$ halfway between them, at $t = \\frac{${m.p} + ${m.q}}{2} = ${L(answer)}$.`,
              `这是把停止时刻 $${m.p}$ 与 $${m.q}$ 相加；加速度 $${pLatex(acc, "t")}$ 在两者正中间为 $0$，即 $t = \\frac{${m.p} + ${m.q}}{2} = ${L(answer)}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the acceleration", "求加速度"],
                t(
                  `$v(t) = ${pLatex(pDer(m.s), "t")}$ and $a(t) = ${pLatex(acc, "t")}$, so $F = ${mass}a(t)$.`,
                  `$v(t) = ${pLatex(pDer(m.s), "t")}$，$a(t) = ${pLatex(acc, "t")}$，所以 $F = ${mass}a(t)$。`,
                ),
              ],
              [
                ["Solve for zero force", "令合力为零"],
                t(`$F = 0$ when $a(t) = 0$, at $t = ${L(answer)}$.`, `$F = 0$ 即 $a(t) = 0$，于 $t = ${L(answer)}$。`),
              ],
            ],
            t(
              `$a(${fmt(an - 0.5)}) = ${fmt(sNum(acc, an - 0.5))}$ and $a(${fmt(an + 0.5)}) = ${fmt(sNum(acc, an + 0.5))}$ have opposite signs, so the force changes direction at $t = ${L(answer)}$, halfway between the stops at $t = ${m.p}$ and $t = ${m.q}$.`,
              `$a(${fmt(an - 0.5)}) = ${fmt(sNum(acc, an - 0.5))}$ 与 $a(${fmt(an + 0.5)}) = ${fmt(sNum(acc, an + 0.5))}$ 异号，所以力在 $t = ${L(answer)}$ 处改变方向，恰在 $t = ${m.p}$ 与 $t = ${m.q}$ 两次停止的中间。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculusIOptimizationTopics are the topics of Calculus I modules 7.21 and 7.22. */
export const calculusIOptimizationTopics: readonly TopicDef[] = [
  solvingOptimizationProblemsUsingDerivatives,
  optimizationProblemsInvolvingSectorsOfCircles,
  optimizationProblemsInvolvingBoxesAndTrays,
  optimizationProblemsInvolvingCylinders,
  optimizingDistances,
  optimizingDistancesToCurves,
  optimizationProblemsWithInscribedShapes,
  optimizationProblemsInEconomics,
  newtonsMethod,
  newtonsMethodForOptimizingSingleVariableFunctions,
  calculatingVelocityForStraightLineMotionUsingDifferentiation,
  calculatingAccelerationForStraightLineMotionUsingDifferentiation,
  determiningCharacteristicsOfMovingObjectsUsingDifferentiation,
  newtonsSecondLaw,
];
