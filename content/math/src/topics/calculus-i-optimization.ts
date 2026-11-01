import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem, solutionsProblem } from "../problems.ts";
import { oneOf, type Poly, pAt, par, pDer, pLatex, rounded } from "./calculus-common.ts";

// Calculus I unit 7: Analytical Applications of Differentiation, modules 7.21 and 7.22.

/** solvingOptimizationProblemsUsingDerivatives maximizes and minimizes quantities described in words. */
export const solvingOptimizationProblemsUsingDerivatives: TopicDef = {
  id: "solving-optimization-problems-using-derivatives",
  title: t("Solving Optimization Problems Using Derivatives", "用导数解最优化问题"),
  summary: t(
    "Model a quantity as a function of one variable and find its greatest or least value.",
    "把一个量表示成单变量函数，并求它的最大值或最小值。",
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
        "An optimization problem:\n\n1. Name the variables and write the quantity to optimize.\n2. Use the constraint to write it in terms of one variable, and note the allowed interval.\n3. Find the critical points and check that the one you pick gives the maximum or minimum.\n\nFor two numbers with sum $20$, the product is $P(x) = x(20 - x)$; $P'(x) = 20 - 2x = 0$ at $x = 10$, so the greatest product is $100$.",
        "解最优化问题：\n\n1. 设出变量，写出要优化的量。\n2. 用约束条件把它化为单变量函数，并注明取值区间。\n3. 求临界点，并检验所选的点给出最大值或最小值。\n\n两数之和为 $20$，乘积为 $P(x) = x(20 - x)$；$P'(x) = 20 - 2x = 0$ 于 $x = 10$，所以最大乘积为 $100$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const s = 2 * rng.int(3, 30);
          const answer = (s / 2) ** 2;
          return numberProblem({
            prompt: t(
              `Two numbers have sum $${s}$. What is the greatest possible value of their product?`,
              `两数之和为 $${s}$。它们乘积的最大可能值是多少？`,
            ),
            answer,
            wrong: [s / 2, s * s, s - 1],
            solution: t(
              `With numbers $x$ and $${s} - x$, $P(x) = x(${s} - x) = ${s}x - x^{2}$. $P'(x) = ${s} - 2x = 0$ at $x = ${s / 2}$, and $P''(x) = -2 < 0$, so this is a maximum: $P = ${s / 2} \\cdot ${s / 2} = ${answer}$.`,
              `设两数为 $x$ 和 $${s} - x$，$P(x) = x(${s} - x) = ${s}x - x^{2}$。$P'(x) = ${s} - 2x = 0$ 于 $x = ${s / 2}$，且 $P''(x) = -2 < 0$，所以是最大值：$P = ${s / 2} \\cdot ${s / 2} = ${answer}$。`,
            ),
          });
        }
        const m = rng.int(2, 15);
        const p = m * m;
        return numberProblem({
          prompt: t(
            `Two positive numbers have product $${p}$. What is the least possible value of their sum?`,
            `两个正数之积为 $${p}$。它们之和的最小可能值是多少？`,
          ),
          answer: 2 * m,
          wrong: [m, p + 1, Q.of(p, 2)],
          solution: t(
            `With numbers $x$ and $\\frac{${p}}{x}$, $S(x) = x + \\frac{${p}}{x}$ for $x > 0$. $S'(x) = 1 - \\frac{${p}}{x^{2}} = 0$ at $x = ${m}$, and $S''(x) = \\frac{${2 * p}}{x^{3}} > 0$, so this is a minimum: $S = ${m} + ${m} = ${2 * m}$.`,
            `设两数为 $x$ 和 $\\frac{${p}}{x}$，$S(x) = x + \\frac{${p}}{x}$，$x > 0$。$S'(x) = 1 - \\frac{${p}}{x^{2}} = 0$ 于 $x = ${m}$，且 $S''(x) = \\frac{${2 * p}}{x^{3}} > 0$，所以是最小值：$S = ${m} + ${m} = ${2 * m}$。`,
          ),
        });
      },
    },
    {
      id: "optimizing-fenced-areas",
      title: t("Optimizing fenced areas", "围栏面积的最优化"),
      explanation: t(
        "A rectangle fenced on three sides, against a wall, with $L$ m of fence: if the two sides perpendicular to the wall have length $x$, the third has length $L - 2x$ and $A(x) = x(L - 2x)$ for $0 < x < \\frac{L}{2}$. $A'(x) = L - 4x = 0$ at $x = \\frac{L}{4}$, giving $A = \\frac{L^{2}}{8}$.",
        "靠墙用 $L$ 米围栏围成三面的矩形：若垂直于墙的两边长为 $x$，第三边长为 $L - 2x$，$A(x) = x(L - 2x)$，$0 < x < \\frac{L}{2}$。$A'(x) = L - 4x = 0$ 于 $x = \\frac{L}{4}$，得 $A = \\frac{L^{2}}{8}$。",
      ),
      generate(rng) {
        const wall = rng.bool();
        const L = 4 * rng.int(5, 50);
        if (wall) {
          const x = L / 4;
          const answer = x * (L - 2 * x);
          return numberProblem({
            prompt: t(
              `A farmer has $${L}$ m of fence to enclose a rectangular field along a straight river, with no fence needed along the river. What is the largest area that can be enclosed, in square metres?`,
              `农夫有 $${L}$ 米围栏，要沿一条笔直的河围出一块矩形田地，沿河一边不需要围栏。最多能围出多少平方米？`,
            ),
            answer,
            unit: "m^2",
            wrong: [(L / 4) ** 2, Q.of(L * L, 9), L * L],
            solution: t(
              `Let the sides perpendicular to the river be $x$; the side along it is $${L} - 2x$. $A(x) = x(${L} - 2x)$, $A'(x) = ${L} - 4x = 0$ at $x = ${x}$, and $A'' = -4 < 0$. The area is $${x} \\cdot ${L - 2 * x} = ${answer}$ m².`,
              `设垂直于河的边长为 $x$，沿河的边长为 $${L} - 2x$。$A(x) = x(${L} - 2x)$，$A'(x) = ${L} - 4x = 0$ 于 $x = ${x}$，且 $A'' = -4 < 0$。面积为 $${x} \\cdot ${L - 2 * x} = ${answer}$ 平方米。`,
            ),
          });
        }
        const x = L / 4;
        return numberProblem({
          prompt: t(
            `A rectangle has perimeter $${L}$ cm. What is its largest possible area, in square centimetres?`,
            `一个矩形周长为 $${L}$ 厘米。它的面积最大可能是多少平方厘米？`,
          ),
          answer: x * x,
          unit: "cm^2",
          wrong: [(L / 2) ** 2, x * (L / 2 - x + 1), L],
          solution: t(
            `With width $x$, the length is $${L / 2} - x$ and $A(x) = x(${L / 2} - x)$. $A'(x) = ${L / 2} - 2x = 0$ at $x = ${x}$: a square, with area $${x * x}$ cm².`,
            `设宽为 $x$，则长为 $${L / 2} - x$，$A(x) = x(${L / 2} - x)$。$A'(x) = ${L / 2} - 2x = 0$ 于 $x = ${x}$：是正方形，面积为 $${x * x}$ 平方厘米。`,
          ),
        });
      },
    },
  ],
};

/** optimizationProblemsInvolvingSectorsOfCircles optimizes sectors with a fixed perimeter. */
export const optimizationProblemsInvolvingSectorsOfCircles: TopicDef = {
  id: "optimization-problems-involving-sectors-of-circles",
  title: t("Optimization Problems Involving Sectors of Circles", "涉及扇形的最优化问题"),
  summary: t("Maximize the area of a sector with a fixed perimeter.", "在周长固定时求扇形面积的最大值。"),
  prerequisites: ["solving-optimization-problems-using-derivatives", "calculating-areas-of-sectors-using-radians"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-radius-of-the-largest-sector",
      title: t("The radius of the largest sector", "最大扇形的半径"),
      explanation: t(
        "A sector of radius $r$ and angle $\\theta$ (in radians) has arc length $r\\theta$, perimeter $P = 2r + r\\theta$ and area $A = \\frac{1}{2}r^{2}\\theta$. With $P$ fixed, $r\\theta = P - 2r$, so $A(r) = \\frac{1}{2}r(P - 2r)$. Then $A'(r) = \\frac{P}{2} - 2r = 0$ at $r = \\frac{P}{4}$, where $\\theta = 2$.",
        "半径为 $r$、圆心角为 $\\theta$（弧度）的扇形，弧长为 $r\\theta$，周长 $P = 2r + r\\theta$，面积 $A = \\frac{1}{2}r^{2}\\theta$。$P$ 固定时，$r\\theta = P - 2r$，所以 $A(r) = \\frac{1}{2}r(P - 2r)$。$A'(r) = \\frac{P}{2} - 2r = 0$ 于 $r = \\frac{P}{4}$，此时 $\\theta = 2$。",
      ),
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
          wrong: askAngle ? [1, Q.of(1, 2), r] : [P / 2, Q.of(P, 3), Q.of(P, 6)],
          solution: t(
            `$r\\theta = ${P} - 2r$, so $A(r) = \\frac{1}{2}r(${P} - 2r) = ${P / 2}r - r^{2}$. $A'(r) = ${P / 2} - 2r = 0$ at $r = ${r}$${askAngle ? `, and then $\\theta = \\frac{${P} - ${2 * r}}{${r}} = 2$` : ""}.`,
            `$r\\theta = ${P} - 2r$，所以 $A(r) = \\frac{1}{2}r(${P} - 2r) = ${P / 2}r - r^{2}$。$A'(r) = ${P / 2} - 2r = 0$ 于 $r = ${r}$${askAngle ? `，此时 $\\theta = \\frac{${P} - ${2 * r}}{${r}} = 2$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "the-area-of-the-largest-sector",
      title: t("The area of the largest sector", "最大扇形的面积"),
      explanation: t(
        "Once the best radius is found, substitute back. With perimeter $P$, the best sector has $r = \\frac{P}{4}$ and $\\theta = 2$, so $A = \\frac{1}{2}\\left(\\frac{P}{4}\\right)^{2} \\cdot 2 = \\frac{P^{2}}{16}$.",
        "求出最佳半径后代回。周长为 $P$ 时，最佳扇形 $r = \\frac{P}{4}$，$\\theta = 2$，所以 $A = \\frac{1}{2}\\left(\\frac{P}{4}\\right)^{2} \\cdot 2 = \\frac{P^{2}}{16}$。",
      ),
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
          wrong: [r, Q.of(answer, 2), 2 * answer],
          solution: t(
            `$A(r) = \\frac{1}{2}r(${P} - 2r)$ is greatest at $r = ${r}$, where the arc is $${P} - ${2 * r} = ${P - 2 * r}$ and $\\theta = 2$. Then $A = \\frac{1}{2} \\cdot ${r}^{2} \\cdot 2 = ${answer}$ m².`,
            `$A(r) = \\frac{1}{2}r(${P} - 2r)$ 在 $r = ${r}$ 处最大，此时弧长为 $${P} - ${2 * r} = ${P - 2 * r}$，$\\theta = 2$。于是 $A = \\frac{1}{2} \\cdot ${r}^{2} \\cdot 2 = ${answer}$ 平方米。`,
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
  prerequisites: ["solving-optimization-problems-using-derivatives"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "trays-folded-from-sheets",
      title: t("Trays folded from sheets", "由纸板折成的托盘"),
      explanation: t(
        "Cut squares of side $x$ from the corners of an $a$ by $b$ sheet and fold up the sides: the tray has volume $V(x) = x(a - 2x)(b - 2x)$ for $0 < x < \\frac{a}{2}$. Solve $V'(x) = 0$ and keep the root inside the interval. For a square sheet of side $L$, $V'(x) = (L - 2x)(L - 6x)$, so $x = \\frac{L}{6}$.",
        "从 $a \\times b$ 纸板的四角剪去边长为 $x$ 的正方形，再把四边折起：托盘容积为 $V(x) = x(a - 2x)(b - 2x)$，$0 < x < \\frac{a}{2}$。解 $V'(x) = 0$，保留区间内的根。对边长为 $L$ 的正方形纸板，$V'(x) = (L - 2x)(L - 6x)$，所以 $x = \\frac{L}{6}$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const L = 6 * rng.int(1, 10);
          const x = L / 6;
          const askVolume = rng.bool();
          const volume = x * (L - 2 * x) ** 2;
          return numberProblem({
            prompt: t(
              `An open tray is made from a square sheet of side $${L}$ cm by cutting equal squares from the corners and folding up the sides. ${askVolume ? "What is the largest possible volume, in cubic centimetres?" : "What side length of the cut squares, in cm, gives the largest volume?"}`,
              `从边长为 $${L}$ 厘米的正方形纸板四角剪去相同的正方形，再把四边折起，做成一个开口托盘。${askVolume ? "托盘容积最大可能是多少立方厘米？" : "剪去的正方形边长为多少厘米时容积最大？"}`,
            ),
            answer: askVolume ? volume : x,
            unit: askVolume ? "cm^3" : "cm",
            wrong: askVolume ? [x * x * (L - 2 * x), Q.of(L ** 3, 16), L ** 3] : [Q.of(L, 4), L / 2, L / 3],
            solution: t(
              `$V(x) = x(${L} - 2x)^{2}$, so $V'(x) = (${L} - 2x)^{2} - 4x(${L} - 2x) = (${L} - 2x)(${L} - 6x)$. In $(0, ${L / 2})$ the only zero is $x = ${x}$, where $V$ changes from increasing to decreasing${askVolume ? `. $V(${x}) = ${x} \\cdot ${L - 2 * x}^{2} = ${volume}$ cm³` : ""}.`,
              `$V(x) = x(${L} - 2x)^{2}$，所以 $V'(x) = (${L} - 2x)^{2} - 4x(${L} - 2x) = (${L} - 2x)(${L} - 6x)$。在 $(0, ${L / 2})$ 内唯一的零点是 $x = ${x}$，$V$ 在此由增变减${askVolume ? `。$V(${x}) = ${x} \\cdot ${L - 2 * x}^{2} = ${volume}$ 立方厘米` : ""}。`,
            ),
          });
        }
        const [a, b, x] = rng.pick(sheets);
        const other = Q.of(a + b, 6)
          .add(Q.of(a + b, 6))
          .sub(x);
        return numberProblem({
          prompt: t(
            `An open tray is made from a $${a}$ cm by $${b}$ cm sheet by cutting equal squares from the corners and folding up the sides. What side length of the cut squares, in cm, gives the largest volume?`,
            `从 $${a}$ 厘米 $\\times$ $${b}$ 厘米的纸板四角剪去相同的正方形，再把四边折起，做成一个开口托盘。剪去的正方形边长为多少厘米时容积最大？`,
          ),
          answer: x,
          unit: "cm",
          wrong: [other, Q.of(a, 6), Q.of(a, 4)],
          solution: t(
            `$V(x) = x(${a} - 2x)(${b} - 2x) = 4x^{3} - ${2 * (a + b)}x^{2} + ${a * b}x$, so $V'(x) = 12x^{2} - ${4 * (a + b)}x + ${a * b}$. Its zeros are $x = ${x.toLatex()}$ and $x = ${other.toLatex()}$; only $${x.toLatex()}$ lies in $(0, ${Q.of(a, 2).toLatex()})$, and it gives the maximum.`,
            `$V(x) = x(${a} - 2x)(${b} - 2x) = 4x^{3} - ${2 * (a + b)}x^{2} + ${a * b}x$，所以 $V'(x) = 12x^{2} - ${4 * (a + b)}x + ${a * b}$。它的零点为 $x = ${x.toLatex()}$ 和 $x = ${other.toLatex()}$；只有 $${x.toLatex()}$ 在 $(0, ${Q.of(a, 2).toLatex()})$ 内，它给出最大值。`,
          ),
        });
      },
    },
    {
      id: "boxes-with-least-material",
      title: t("Boxes with the least material", "用料最少的盒子"),
      explanation: t(
        "An open box with a square base of side $x$ and volume $V$ has height $\\frac{V}{x^{2}}$, so its surface area is $S(x) = x^{2} + 4x \\cdot \\frac{V}{x^{2}} = x^{2} + \\frac{4V}{x}$. $S'(x) = 2x - \\frac{4V}{x^{2}} = 0$ when $x^{3} = 2V$.",
        "底面为边长 $x$ 的正方形、容积为 $V$ 的开口盒子，高为 $\\frac{V}{x^{2}}$，所以表面积为 $S(x) = x^{2} + 4x \\cdot \\frac{V}{x^{2}} = x^{2} + \\frac{4V}{x}$。$S'(x) = 2x - \\frac{4V}{x^{2}} = 0$ 时 $x^{3} = 2V$。",
      ),
      generate(rng) {
        const x = 2 * rng.int(1, 15);
        const V = x ** 3 / 2;
        const h = V / (x * x);
        const ask = rng.int(0, 2);
        const area = x * x + (4 * V) / x;
        return numberProblem({
          prompt: t(
            `An open-topped box with a square base must hold $${V}$ cm³. ${ask === 0 ? "What base side length, in cm, uses the least material?" : ask === 1 ? "What height, in cm, uses the least material?" : "What is the least surface area, in cm², it can have?"}`,
            `一个无盖盒子底面为正方形，容积须为 $${V}$ 立方厘米。${ask === 0 ? "底面边长为多少厘米时用料最少？" : ask === 1 ? "高为多少厘米时用料最少？" : "它的表面积最小是多少平方厘米？"}`,
          ),
          answer: ask === 0 ? x : ask === 1 ? h : area,
          unit: ask === 2 ? "cm^2" : "cm",
          wrong: ask === 0 ? [h, Math.round(Math.cbrt(V)), 2 * x] : ask === 1 ? [x, 2 * h, V / x] : [x * x + (2 * V) / x, 6 * x * x, x * x],
          solution: t(
            `$S(x) = x^{2} + \\frac{${4 * V}}{x}$ and $S'(x) = 2x - \\frac{${4 * V}}{x^{2}} = 0$ when $x^{3} = ${2 * V}$, so $x = ${x}$. Since $S'' > 0$ this is a minimum. The height is $\\frac{${V}}{${x}^{2}} = ${h}$${ask === 2 ? `, and $S = ${x * x} + ${(4 * V) / x} = ${area}$` : ""}.`,
            `$S(x) = x^{2} + \\frac{${4 * V}}{x}$，$S'(x) = 2x - \\frac{${4 * V}}{x^{2}} = 0$ 时 $x^{3} = ${2 * V}$，所以 $x = ${x}$。由于 $S'' > 0$，这是最小值。高为 $\\frac{${V}}{${x}^{2}} = ${h}$${ask === 2 ? `，$S = ${x * x} + ${(4 * V) / x} = ${area}$` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** optimizationProblemsInvolvingCylinders minimizes the material of cylinders with fixed volume. */
export const optimizationProblemsInvolvingCylinders: TopicDef = {
  id: "optimization-problems-involving-cylinders",
  title: t("Optimization Problems Involving Cylinders", "涉及圆柱的最优化问题"),
  summary: t(
    "Find the dimensions of closed and open cylinders of fixed volume that use the least material.",
    "求容积固定时用料最少的有盖和无盖圆柱的尺寸。",
  ),
  prerequisites: ["solving-optimization-problems-using-derivatives", "surface-areas-of-cylinders"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "closed-cylinders",
      title: t("Closed cylinders", "有盖圆柱"),
      explanation: t(
        "A closed can of volume $V$ has $h = \\frac{V}{\\pi r^{2}}$, so its surface area is $S(r) = 2\\pi r^{2} + 2\\pi r h = 2\\pi r^{2} + \\frac{2V}{r}$. $S'(r) = 4\\pi r - \\frac{2V}{r^{2}} = 0$ when $r^{3} = \\frac{V}{2\\pi}$; then $h = 2r$: the best can is as tall as it is wide.",
        "容积为 $V$ 的有盖圆柱罐，$h = \\frac{V}{\\pi r^{2}}$，表面积为 $S(r) = 2\\pi r^{2} + 2\\pi r h = 2\\pi r^{2} + \\frac{2V}{r}$。$S'(r) = 4\\pi r - \\frac{2V}{r^{2}} = 0$ 时 $r^{3} = \\frac{V}{2\\pi}$；此时 $h = 2r$：最佳的罐子高度等于直径。",
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
          wrong: askHeight ? [r, 4 * r, k / (r * r) / 2] : [2 * r, Math.round(Math.cbrt(k)), r + 1],
          solution: t(
            `$h = \\frac{${k}}{r^{2}}$, so $S(r) = 2\\pi r^{2} + \\frac{${2 * k}\\pi}{r}$. $S'(r) = 4\\pi r - \\frac{${2 * k}\\pi}{r^{2}} = 0$ when $r^{3} = ${r ** 3}$, so $r = ${r}$${askHeight ? ` and $h = \\frac{${k}}{${r * r}} = ${2 * r}$` : ""}. $S'' > 0$, so this is a minimum.`,
            `$h = \\frac{${k}}{r^{2}}$，所以 $S(r) = 2\\pi r^{2} + \\frac{${2 * k}\\pi}{r}$。$S'(r) = 4\\pi r - \\frac{${2 * k}\\pi}{r^{2}} = 0$ 时 $r^{3} = ${r ** 3}$，所以 $r = ${r}$${askHeight ? `，$h = \\frac{${k}}{${r * r}} = ${2 * r}$` : ""}。$S'' > 0$，所以这是最小值。`,
          ),
        });
      },
    },
    {
      id: "open-cylinders",
      title: t("Open cylinders", "无盖圆柱"),
      explanation: t(
        "Without a lid, $S(r) = \\pi r^{2} + 2\\pi r h = \\pi r^{2} + \\frac{2V}{r}$. $S'(r) = 2\\pi r - \\frac{2V}{r^{2}} = 0$ when $r^{3} = \\frac{V}{\\pi}$, and then $h = r$.",
        "无盖时，$S(r) = \\pi r^{2} + 2\\pi r h = \\pi r^{2} + \\frac{2V}{r}$。$S'(r) = 2\\pi r - \\frac{2V}{r^{2}} = 0$ 时 $r^{3} = \\frac{V}{\\pi}$，此时 $h = r$。",
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
          wrong: askArea ? [2 * r * r, 4 * r * r, r * r] : [Math.round(Math.cbrt(k / 2)) || 2, 2 * r, r + 1],
          solution: t(
            `$h = \\frac{${k}}{r^{2}}$, so $S(r) = \\pi r^{2} + \\frac{${2 * k}\\pi}{r}$ and $S'(r) = 2\\pi r - \\frac{${2 * k}\\pi}{r^{2}} = 0$ when $r^{3} = ${k}$: $r = ${r}$ and $h = ${r}$.${askArea ? ` Then $S = ${r * r}\\pi + ${2 * r * r}\\pi = ${3 * r * r}\\pi$.` : ""}`,
            `$h = \\frac{${k}}{r^{2}}$，所以 $S(r) = \\pi r^{2} + \\frac{${2 * k}\\pi}{r}$，$S'(r) = 2\\pi r - \\frac{${2 * k}\\pi}{r^{2}} = 0$ 时 $r^{3} = ${k}$：$r = ${r}$，$h = ${r}$。${askArea ? `于是 $S = ${r * r}\\pi + ${2 * r * r}\\pi = ${3 * r * r}\\pi$。` : ""}`,
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
  prerequisites: ["solving-optimization-problems-using-derivatives", "the-distance-formula"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "closest-points-on-lines",
      title: t("Closest points on lines", "直线上的最近点"),
      explanation: t(
        "A distance $D$ and its square $D^{2}$ are smallest at the same place, and $D^{2}$ has no square root, so minimize $D^{2}$. For the point $(x, mx + c)$ on a line and a point $(a, b)$: $D^{2} = (x - a)^{2} + (mx + c - b)^{2}$.",
        "距离 $D$ 与其平方 $D^{2}$ 在同一处取得最小值，而 $D^{2}$ 没有根号，所以最小化 $D^{2}$。直线上的点 $(x, mx + c)$ 到点 $(a, b)$：$D^{2} = (x - a)^{2} + (mx + c - b)^{2}$。",
      ),
      generate(rng) {
        const m = rng.nonZero(-3, 3);
        const c = rng.int(-5, 5);
        const a = rng.int(-6, 6);
        const b = rng.int(-6, 6);
        const x = Q.of(a + m * (b - c), 1 + m * m);
        const line = poly([m, "x"], [c, ""]);
        return numberProblem({
          prompt: t(
            `Find the $x$-coordinate of the point on the line $y = ${line}$ closest to $(${a}, ${b})$.`,
            `求直线 $y = ${line}$ 上离点 $(${a}, ${b})$ 最近的点的 $x$ 坐标。`,
          ),
          answer: x,
          wrong: [Q.of(a), Q.of(a + m * (b - c), m * m), Q.of(a - m * (b - c), 1 + m * m)],
          solution: t(
            `$D^{2} = (x - ${par(a)})^{2} + (${poly([m, "x"], [c - b, ""])})^{2}$. Its derivative is $2(x - ${par(a)}) ${m < 0 ? "-" : "+"} ${Math.abs(2 * m)}(${poly([m, "x"], [c - b, ""])}) = ${poly([2 + 2 * m * m, "x"], [-2 * a + 2 * m * (c - b), ""])}$, which is $0$ at $x = ${x.toLatex()}$.`,
            `$D^{2} = (x - ${par(a)})^{2} + (${poly([m, "x"], [c - b, ""])})^{2}$。其导数为 $2(x - ${par(a)}) ${m < 0 ? "-" : "+"} ${Math.abs(2 * m)}(${poly([m, "x"], [c - b, ""])}) = ${poly([2 + 2 * m * m, "x"], [-2 * a + 2 * m * (c - b), ""])}$，在 $x = ${x.toLatex()}$ 处为 $0$。`,
          ),
        });
      },
    },
    {
      id: "distances-between-moving-objects",
      title: t("Distances between moving objects", "运动物体之间的距离"),
      explanation: t(
        "Write each position as a function of time, then the squared distance between them, $D^{2}(t)$, and set its derivative to $0$. For one car $d$ km east of a crossing driving west at $u$ km/h, and another leaving the crossing northward at $v$ km/h: $D^{2} = (d - ut)^{2} + (vt)^{2}$.",
        "把各位置写成时间的函数，再写出它们之间距离的平方 $D^{2}(t)$，令其导数为 $0$。一辆车在路口以东 $d$ 千米处以 $u$ 千米/时向西行驶，另一辆以 $v$ 千米/时从路口向北驶出：$D^{2} = (d - ut)^{2} + (vt)^{2}$。",
      ),
      generate(rng) {
        const u = 10 * rng.int(3, 9);
        const v = 10 * rng.int(3, 9);
        const d = 10 * rng.int(5, 30);
        const time = Q.of(d * u, u * u + v * v);
        const minutes = time.mul(Q.of(60));
        const answer = rounded(minutes.toNumber(), 1);
        if (!answer) {
          return numberProblem({
            prompt: t(
              `Car A is $${d}$ km east of a crossing, driving west toward it at $${u}$ km/h. At the same moment car B leaves the crossing, driving north at $${v}$ km/h. After how many hours are the cars closest together?`,
              `A 车在路口以东 $${d}$ 千米处，以 $${u}$ 千米/时向西驶向路口。同一时刻 B 车从路口出发，以 $${v}$ 千米/时向北行驶。几小时后两车距离最近？`,
            ),
            answer: time,
            wrong: [Q.of(d, u), Q.of(d, u + v), Q.of(d * v, u * u + v * v)],
            solution: t(
              `$D^{2} = (${d} - ${u}t)^{2} + (${v}t)^{2}$. Its derivative is $-${2 * u}(${d} - ${u}t) + ${2 * v * v}t = ${2 * (u * u + v * v)}t - ${2 * d * u}$, which is $0$ at $t = ${time.toLatex()}$ h.`,
              `$D^{2} = (${d} - ${u}t)^{2} + (${v}t)^{2}$。其导数为 $-${2 * u}(${d} - ${u}t) + ${2 * v * v}t = ${2 * (u * u + v * v)}t - ${2 * d * u}$，在 $t = ${time.toLatex()}$ 小时处为 $0$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Car A is $${d}$ km east of a crossing, driving west toward it at $${u}$ km/h. At the same moment car B leaves the crossing, driving north at $${v}$ km/h. After how many minutes are the cars closest together? Round to one decimal place.`,
            `A 车在路口以东 $${d}$ 千米处，以 $${u}$ 千米/时向西驶向路口。同一时刻 B 车从路口出发，以 $${v}$ 千米/时向北行驶。几分钟后两车距离最近？精确到一位小数。`,
          ),
          answer,
          form: "decimal",
          wrong: [rounded((60 * d) / u, 1) ?? answer, rounded(time.toNumber(), 1) ?? answer],
          solution: t(
            `$D^{2} = (${d} - ${u}t)^{2} + (${v}t)^{2}$ with $t$ in hours. Its derivative is $${2 * (u * u + v * v)}t - ${2 * d * u}$, which is $0$ at $t = ${time.toLatex()}$ h, that is $${time.toLatex()} \\cdot 60 \\approx ${answer.toNumber()}$ minutes.`,
            `$D^{2} = (${d} - ${u}t)^{2} + (${v}t)^{2}$，$t$ 以小时计。其导数为 $${2 * (u * u + v * v)}t - ${2 * d * u}$，在 $t = ${time.toLatex()}$ 小时处为 $0$，即 $${time.toLatex()} \\cdot 60 \\approx ${answer.toNumber()}$ 分钟。`,
          ),
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
  prerequisites: ["optimizing-distances"],
  encompasses: [{ topic: "optimizing-distances", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "closest-points-on-parabolas",
      title: t("Closest points on parabolas", "抛物线上的最近点"),
      explanation: t(
        "For the point $(x, x^{2})$ and the point $(0, b)$: $D^{2} = x^{2} + (x^{2} - b)^{2}$, with derivative $2x + 4x(x^{2} - b) = 2x(2x^{2} - 2b + 1)$. It is $0$ at $x = 0$ and at $x^{2} = b - \\frac{1}{2}$; when $b > \\frac{1}{2}$ the two symmetric points are closest, and $x = 0$ is a local maximum of $D^{2}$.",
        "对点 $(x, x^{2})$ 和点 $(0, b)$：$D^{2} = x^{2} + (x^{2} - b)^{2}$，导数为 $2x + 4x(x^{2} - b) = 2x(2x^{2} - 2b + 1)$。它在 $x = 0$ 和 $x^{2} = b - \\frac{1}{2}$ 处为 $0$；当 $b > \\frac{1}{2}$ 时，两个对称点最近，而 $x = 0$ 是 $D^{2}$ 的局部极大值点。",
      ),
      generate(rng) {
        const m = rng.int(1, 5);
        const a = rng.int(1, 3);
        const c = rng.int(-3, 3);
        const b = Q.of(a * m * m).add(Q.of(1, 2 * a));
        const point = b.add(Q.of(c));
        const curve = poly([a, "x^{2}"], [c, ""]);
        const shifted = `${a === 1 ? "" : a}x^{2} - ${b.toLatex()}`;
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points on $y = ${curve}$ closest to $\\left(0, ${point.toLatex()}\\right)$.`,
            `求曲线 $y = ${curve}$ 上离点 $\\left(0, ${point.toLatex()}\\right)$ 最近的点的 $x$ 坐标。`,
          ),
          values: [String(m), String(-m)],
          wrong: [["0"], [String(m)], ["0", String(m), String(-m)]],
          solution: t(
            `$D^{2} = x^{2} + \\left(${shifted}\\right)^{2}$ has derivative $2x + ${4 * a}x\\left(${shifted}\\right) = 2x\\left(${2 * a * a}x^{2} - ${Q.of(
              2 * a,
            )
              .mul(b)
              .sub(Q.one)
              .toLatex()}\\right)$. It is $0$ at $x = 0$ and $x = \\pm ${m}$. $D^{2}$ is smaller at $x = \\pm ${m}$, so those are the closest points.`,
            `$D^{2} = x^{2} + \\left(${shifted}\\right)^{2}$ 的导数为 $2x + ${4 * a}x\\left(${shifted}\\right) = 2x\\left(${2 * a * a}x^{2} - ${Q.of(
              2 * a,
            )
              .mul(b)
              .sub(Q.one)
              .toLatex()}\\right)$。它在 $x = 0$ 和 $x = \\pm ${m}$ 处为 $0$。$D^{2}$ 在 $x = \\pm ${m}$ 处更小，所以它们是最近的点。`,
          ),
        });
      },
    },
    {
      id: "closest-points-on-square-root-curves",
      title: t("Closest points on square root curves", "平方根曲线上的最近点"),
      explanation: t(
        "For the point $(x, \\sqrt{kx})$ and the point $(c, 0)$: $D^{2} = (x - c)^{2} + kx$, a quadratic. Its derivative $2(x - c) + k$ is $0$ at $x = c - \\frac{k}{2}$, provided that is at least $0$.",
        "对点 $(x, \\sqrt{kx})$ 和点 $(c, 0)$：$D^{2} = (x - c)^{2} + kx$ 是二次函数。其导数 $2(x - c) + k$ 在 $x = c - \\frac{k}{2}$ 处为 $0$（只要它不小于 $0$）。",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const c = rng.int(Math.ceil(k / 2) + 1, 12);
        const x = Q.of(c).sub(Q.of(k, 2));
        const askDistance = rng.bool();
        const d2 = x.sub(Q.of(c)).pow(2).add(Q.of(k).mul(x));
        const curve = k === 1 ? "\\sqrt{x}" : `\\sqrt{${k}x}`;
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
          wrong: askDistance ? [Q.of(c * c), Q.of(k).mul(x), d2.add(Q.of(k, 2))] : [Q.of(c), Q.of(c).add(Q.of(k, 2)), Q.of(c - k)],
          solution: t(
            `$D^{2} = (x - ${c})^{2} + ${k === 1 ? "" : k}x$, with derivative $2(x - ${c}) + ${k}$, which is $0$ at $x = ${x.toLatex()}$.${askDistance ? ` There $D^{2} = \\left(${x.sub(Q.of(c)).toLatex()}\\right)^{2} + ${k === 1 ? "" : `${k} \\cdot `}${x.toLatex()} = ${d2.toLatex()}$.` : ""}`,
            `$D^{2} = (x - ${c})^{2} + ${k === 1 ? "" : k}x$，导数为 $2(x - ${c}) + ${k}$，在 $x = ${x.toLatex()}$ 处为 $0$。${askDistance ? `此时 $D^{2} = \\left(${x.sub(Q.of(c)).toLatex()}\\right)^{2} + ${k === 1 ? "" : `${k} \\cdot `}${x.toLatex()} = ${d2.toLatex()}$。` : ""}`,
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
  prerequisites: ["solving-optimization-problems-using-derivatives"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "rectangles-under-parabolas",
      title: t("Rectangles under parabolas", "抛物线下的矩形"),
      explanation: t(
        "A rectangle with its base on the $x$-axis and upper corners on $y = H - kx^{2}$ has corners at $(\\pm x, H - kx^{2})$, so $A(x) = 2x(H - kx^{2})$ for $0 < x < \\sqrt{\\frac{H}{k}}$. $A'(x) = 2H - 6kx^{2} = 0$ at $x = \\sqrt{\\frac{H}{3k}}$.",
        "底边在 $x$ 轴上、上方两顶点在 $y = H - kx^{2}$ 上的矩形，顶点为 $(\\pm x, H - kx^{2})$，所以 $A(x) = 2x(H - kx^{2})$，$0 < x < \\sqrt{\\frac{H}{k}}$。$A'(x) = 2H - 6kx^{2} = 0$ 于 $x = \\sqrt{\\frac{H}{3k}}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const m = rng.int(1, 6);
        const H = 3 * k * m * m;
        const answer = 4 * k * m ** 3;
        const askHeight = rng.bool();
        const curve = poly([H, ""], [-k, "x^{2}"]);
        return numberProblem({
          prompt: t(
            `A rectangle has its base on the $x$-axis and its upper corners on the parabola $y = ${curve}$. ${askHeight ? "What is the height of the rectangle with the largest area?" : "What is its largest possible area?"}`,
            `一个矩形的底边在 $x$ 轴上，上方两顶点在抛物线 $y = ${curve}$ 上。${askHeight ? "面积最大的矩形高是多少？" : "它的面积最大可能是多少？"}`,
          ),
          answer: askHeight ? H - k * m * m : answer,
          wrong: askHeight ? [m, 2 * m, H / 3] : [answer / 2, 2 * m * H, m * (H - k * m * m)],
          solution: t(
            `$A(x) = 2x(${curve}) = ${2 * H}x - ${2 * k}x^{3}$. $A'(x) = ${2 * H} - ${6 * k}x^{2} = 0$ at $x = ${m}$. The rectangle is $${2 * m}$ wide and $${H - k * m * m}$ tall, with area $${answer}$.`,
            `$A(x) = 2x(${curve}) = ${2 * H}x - ${2 * k}x^{3}$。$A'(x) = ${2 * H} - ${6 * k}x^{2} = 0$ 于 $x = ${m}$。矩形宽 $${2 * m}$，高 $${H - k * m * m}$，面积为 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "rectangles-in-triangles-and-circles",
      title: t("Rectangles in triangles and circles", "三角形和圆中的矩形"),
      explanation: t(
        "In a right triangle with legs $a$ and $b$ along the axes, a rectangle with a corner at the right angle and the opposite corner on the hypotenuse has height $b\\left(1 - \\frac{x}{a}\\right)$, so $A(x) = bx - \\frac{b}{a}x^{2}$, greatest at $x = \\frac{a}{2}$: $A = \\frac{ab}{4}$. In a circle of radius $r$, the largest inscribed rectangle is a square, with area $2r^{2}$.",
        "直角边 $a$、$b$ 沿坐标轴的直角三角形中，一个顶点在直角处、对角顶点在斜边上的矩形，高为 $b\\left(1 - \\frac{x}{a}\\right)$，所以 $A(x) = bx - \\frac{b}{a}x^{2}$，在 $x = \\frac{a}{2}$ 处最大：$A = \\frac{ab}{4}$。半径为 $r$ 的圆中，面积最大的内接矩形是正方形，面积为 $2r^{2}$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = 2 * rng.int(1, 10);
          const b = 2 * rng.int(1, 10);
          const answer = (a * b) / 4;
          return numberProblem({
            prompt: t(
              `A right triangle has legs $${a}$ and $${b}$. A rectangle is drawn with one corner at the right angle, two sides along the legs and the opposite corner on the hypotenuse. What is its largest possible area?`,
              `一个直角三角形的两条直角边为 $${a}$ 和 $${b}$。在其中作一个矩形，一个顶点在直角处，两边沿直角边，对角顶点在斜边上。它的面积最大可能是多少？`,
            ),
            answer,
            wrong: [(a * b) / 2, Q.of(a * b, 3), a * b],
            solution: t(
              `With width $x$ along the leg of length $${a}$, the height is $${b}\\left(1 - \\frac{x}{${a}}\\right)$, so $A(x) = ${b}x - ${Q.of(b, a).toLatex()}x^{2}$. $A'(x) = ${b} - ${Q.of(2 * b, a).toLatex()}x = 0$ at $x = ${a / 2}$, giving $A = ${a / 2} \\cdot ${b / 2} = ${answer}$.`,
              `设沿长为 $${a}$ 的直角边的宽为 $x$，则高为 $${b}\\left(1 - \\frac{x}{${a}}\\right)$，所以 $A(x) = ${b}x - ${Q.of(b, a).toLatex()}x^{2}$。$A'(x) = ${b} - ${Q.of(2 * b, a).toLatex()}x = 0$ 于 $x = ${a / 2}$，得 $A = ${a / 2} \\cdot ${b / 2} = ${answer}$。`,
            ),
          });
        }
        const r = rng.int(1, 12);
        return numberProblem({
          prompt: t(
            `A rectangle is inscribed in a circle of radius $${r}$. What is its largest possible area?`,
            `一个矩形内接于半径为 $${r}$ 的圆。它的面积最大可能是多少？`,
          ),
          answer: 2 * r * r,
          wrong: [r * r, 4 * r * r, 2 * r],
          solution: t(
            `With corners $(\\pm x, \\pm y)$ and $x^{2} + y^{2} = ${r * r}$, $A = 4xy = 4x\\sqrt{${r * r} - x^{2}}$. Maximizing $A^{2} = 16x^{2}(${r * r} - x^{2})$ gives $x^{2} = ${Q.of(r * r, 2).toLatex()} = y^{2}$: a square with area $4 \\cdot ${Q.of(r * r, 2).toLatex()} = ${2 * r * r}$.`,
            `设顶点为 $(\\pm x, \\pm y)$，$x^{2} + y^{2} = ${r * r}$，$A = 4xy = 4x\\sqrt{${r * r} - x^{2}}$。最大化 $A^{2} = 16x^{2}(${r * r} - x^{2})$ 得 $x^{2} = ${Q.of(r * r, 2).toLatex()} = y^{2}$：是正方形，面积为 $4 \\cdot ${Q.of(r * r, 2).toLatex()} = ${2 * r * r}$。`,
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
  prerequisites: ["solving-optimization-problems-using-derivatives"],
  encompasses: [{ topic: "solving-optimization-problems-using-derivatives", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "maximizing-profit",
      title: t("Maximizing profit", "利润最大化"),
      explanation: t(
        "Revenue is price times quantity, $R(q) = p(q) \\cdot q$; profit is $P(q) = R(q) - C(q)$. Profit is greatest where $P'(q) = 0$, that is where marginal revenue equals marginal cost: $R'(q) = C'(q)$.",
        "收入等于价格乘以数量，$R(q) = p(q) \\cdot q$；利润为 $P(q) = R(q) - C(q)$。利润在 $P'(q) = 0$ 处最大，即边际收入等于边际成本：$R'(q) = C'(q)$。",
      ),
      generate(rng) {
        const b = rng.pick([1, 2, 4, 5]);
        const c1 = rng.int(2, 20);
        const q = rng.int(5, 40);
        const a = c1 + 2 * b * q;
        const c0 = 10 * rng.int(5, 50);
        const askProfit = rng.bool();
        const profit = (a - b * q) * q - c0 - c1 * q;
        const price = poly([a, ""], [-b, "q"]);
        return numberProblem({
          prompt: t(
            `A company sells $q$ items at a price of $${price}$ dollars each, and making them costs $${c0} + ${c1}q$ dollars. ${askProfit ? "What is the greatest possible profit, in dollars?" : "How many items should it sell to make the greatest profit?"}`,
            `一家公司以每件 $${price}$ 美元的价格出售 $q$ 件商品，生产成本为 $${c0} + ${c1}q$ 美元。${askProfit ? "最大利润是多少美元？" : "卖出多少件时利润最大？"}`,
          ),
          answer: askProfit ? profit : q,
          wrong: askProfit ? [(a - b * q) * q, profit + c0, a * q - c0] : [Q.of(a, 2 * b), Q.of(a - c1, b), q + 1],
          solution: t(
            `$P(q) = (${price})q - (${c0} + ${c1}q) = ${poly([-b, "q^{2}"], [a - c1, "q"], [-c0, ""])}$. $P'(q) = ${poly([-2 * b, "q"], [a - c1, ""])} = 0$ at $q = ${q}$, and $P'' < 0$.${askProfit ? ` $P(${q}) = ${profit}$.` : ""}`,
            `$P(q) = (${price})q - (${c0} + ${c1}q) = ${poly([-b, "q^{2}"], [a - c1, "q"], [-c0, ""])}$。$P'(q) = ${poly([-2 * b, "q"], [a - c1, ""])} = 0$ 于 $q = ${q}$，且 $P'' < 0$。${askProfit ? `$P(${q}) = ${profit}$。` : ""}`,
          ),
        });
      },
    },
    {
      id: "minimizing-average-cost",
      title: t("Minimizing average cost", "平均成本最小化"),
      explanation: t(
        "The average cost per item is $\\bar{C}(q) = \\frac{C(q)}{q}$. For $C(q) = F + cq + kq^{2}$, $\\bar{C}(q) = \\frac{F}{q} + c + kq$, and $\\bar{C}'(q) = -\\frac{F}{q^{2}} + k = 0$ at $q = \\sqrt{\\frac{F}{k}}$.",
        "每件的平均成本为 $\\bar{C}(q) = \\frac{C(q)}{q}$。对 $C(q) = F + cq + kq^{2}$，$\\bar{C}(q) = \\frac{F}{q} + c + kq$，$\\bar{C}'(q) = -\\frac{F}{q^{2}} + k = 0$ 于 $q = \\sqrt{\\frac{F}{k}}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const q = 10 * rng.int(1, 9);
        const F = k * q * q;
        const c = rng.int(5, 50);
        const askCost = rng.bool();
        const avg = 2 * k * q + c;
        const cost = `${F} + ${c}q + ${k === 1 ? "" : k}q^{2}`;
        return numberProblem({
          prompt: t(
            `Making $q$ items costs $C(q) = ${cost}$ dollars. ${askCost ? "What is the least possible average cost per item, in dollars?" : "How many items should be made to minimize the average cost per item?"}`,
            `生产 $q$ 件商品的成本为 $C(q) = ${cost}$ 美元。${askCost ? "每件的平均成本最小是多少美元？" : "生产多少件时每件的平均成本最小？"}`,
          ),
          answer: askCost ? avg : q,
          wrong: askCost ? [c, k * q + c, 2 * k * q] : [Q.of(c, 2 * k), q / 2, 2 * q],
          solution: t(
            `$\\bar{C}(q) = \\frac{${F}}{q} + ${c} + ${k === 1 ? "" : k}q$ and $\\bar{C}'(q) = -\\frac{${F}}{q^{2}} + ${k} = 0$ when $q^{2} = ${q * q}$, so $q = ${q}$.${askCost ? ` $\\bar{C}(${q}) = ${F / q} + ${c} + ${k * q} = ${avg}$.` : ""}`,
            `$\\bar{C}(q) = \\frac{${F}}{q} + ${c} + ${k === 1 ? "" : k}q$，$\\bar{C}'(q) = -\\frac{${F}}{q^{2}} + ${k} = 0$ 时 $q^{2} = ${q * q}$，所以 $q = ${q}$。${askCost ? `$\\bar{C}(${q}) = ${F / q} + ${c} + ${k * q} = ${avg}$。` : ""}`,
          ),
        });
      },
    },
  ],
};

/** newtonStep is one step of Newton's method for a polynomial p from x0. */
const newtonStep = (p: Poly, x0: Q) => {
  const at = (q: Poly, x: Q) => q.reduce((acc, c, i) => acc.add(Q.of(c).mul(x.pow(i))), Q.zero);
  const d = at(pDer(p), x0);
  return d.isZero() ? undefined : x0.sub(at(p, x0).div(d));
};

/** newtonsMethod approximates roots with Newton's method. */
export const newtonsMethod: TopicDef = {
  id: "newtons-method",
  title: t("Newton's Method", "牛顿法"),
  summary: t(
    "Approximate roots of equations by repeatedly following tangent lines to the x-axis.",
    "沿切线反复逼近 x 轴，求方程根的近似值。",
  ),
  prerequisites: ["approximating-functions-using-local-linearity-and-linearization"],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-step-of-newtons-method",
      title: t("One step of Newton's method", "牛顿法的一步"),
      explanation: t(
        "To solve $f(x) = 0$ from a guess $x_{0}$, follow the tangent line at $x_{0}$ to the $x$-axis:\n\n$$x_{1} = x_{0} - \\frac{f(x_{0})}{f'(x_{0})}.$$",
        "从初始猜测 $x_{0}$ 出发解 $f(x) = 0$ 时，沿 $x_{0}$ 处的切线走到 $x$ 轴：\n\n$$x_{1} = x_{0} - \\frac{f(x_{0})}{f'(x_{0})}。$$",
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
            wrong: [Q.of(x0).add(Q.of(fx, dx)), Q.of(x0 - fx * dx), Q.of(fx, dx).neg()].filter((w) => !w.eq(x1)),
            solution: t(
              `$f(${x0}) = ${fx}$ and $f'(x) = ${pLatex(pDer(p))}$ gives $f'(${x0}) = ${dx}$. So $x_{1} = ${x0} - \\frac{${fx}}{${dx}} = ${x1.toLatex()}$.`,
              `$f(${x0}) = ${fx}$，$f'(x) = ${pLatex(pDer(p))}$，$f'(${x0}) = ${dx}$。所以 $x_{1} = ${x0} - \\frac{${fx}}{${dx}} = ${x1.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "iterating-newtons-method",
      title: t("Iterating Newton's method", "迭代牛顿法"),
      explanation: t(
        "Repeat the step, each time from the newest estimate. For $\\sqrt{n}$, solve $x^{2} - n = 0$: the step becomes $x_{k+1} = \\frac{1}{2}\\left(x_{k} + \\frac{n}{x_{k}}\\right)$, and two steps from a nearby whole number are usually accurate to several decimal places.",
        "重复迭代，每次从最新的估计出发。求 $\\sqrt{n}$ 时解 $x^{2} - n = 0$：迭代式为 $x_{k+1} = \\frac{1}{2}\\left(x_{k} + \\frac{n}{x_{k}}\\right)$，从附近的整数出发迭代两步，通常就能精确到好几位小数。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 9);
          const n = a * a + rng.nonZero(-a, a);
          const root = rng.bool();
          const p: Poly = root ? [-n, 0, 1] : [-n, 0, 0, 1];
          const x0 = root ? a : Math.round(Math.cbrt(n));
          if (x0 ** (root ? 2 : 3) === n) continue;
          const x1 = newtonStep(p, Q.of(x0));
          const x2 = x1 && newtonStep(p, x1);
          const answer = x2 && rounded(x2.toNumber(), 4);
          if (!x1 || !answer) continue;
          const eq = root ? `x^{2} = ${n}` : `x^{3} = ${n}`;
          return numberProblem({
            prompt: t(
              `Use two steps of Newton's method with $x_{0} = ${x0}$ to approximate the solution of $${eq}$. Round to four decimal places.`,
              `从 $x_{0} = ${x0}$ 出发，用牛顿法迭代两步近似方程 $${eq}$ 的解，精确到四位小数。`,
            ),
            answer,
            form: "decimal",
            wrong: [rounded(x1.toNumber(), 4) ?? answer, rounded(root ? Math.sqrt(n) + 0.001 : Math.cbrt(n) + 0.001, 4) ?? answer],
            solution: t(
              `With $f(x) = ${root ? `x^{2} - ${n}` : `x^{3} - ${n}`}$ and $f'(x) = ${root ? "2x" : "3x^{2}"}$: $x_{1} = ${x0} - \\frac{f(${x0})}{f'(${x0})} = ${x1.toLatex()}$, and $x_{2} = x_{1} - \\frac{f(x_{1})}{f'(x_{1})} \\approx ${answer.toNumber()}$.`,
              `取 $f(x) = ${root ? `x^{2} - ${n}` : `x^{3} - ${n}`}$，$f'(x) = ${root ? "2x" : "3x^{2}"}$：$x_{1} = ${x0} - \\frac{f(${x0})}{f'(${x0})} = ${x1.toLatex()}$，$x_{2} = x_{1} - \\frac{f(x_{1})}{f'(x_{1})} \\approx ${answer.toNumber()}$。`,
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
        "Critical points solve $f'(x) = 0$, so apply Newton's method to $f'$:\n\n$$x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}.$$\n\nThis needs the second derivative, not $f$ itself.",
        "临界点满足 $f'(x) = 0$，所以对 $f'$ 应用牛顿法：\n\n$$x_{1} = x_{0} - \\frac{f'(x_{0})}{f''(x_{0})}。$$\n\n这里需要的是二阶导数，而不是 $f$ 本身。",
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
            wrong: [...(plain ? [plain] : []), Q.of(x0).add(Q.of(f1, f2)), Q.of(f1, f2).neg()].filter((w) => !w.eq(x1)),
            solution: t(
              `$f'(x) = ${pLatex(d)}$ and $f''(x) = ${pLatex(pDer(d))}$, so $f'(${x0}) = ${f1}$ and $f''(${x0}) = ${f2}$. Then $x_{1} = ${x0} - \\frac{${f1}}{${f2}} = ${x1.toLatex()}$.`,
              `$f'(x) = ${pLatex(d)}$，$f''(x) = ${pLatex(pDer(d))}$，所以 $f'(${x0}) = ${f1}$，$f''(${x0}) = ${f2}$。于是 $x_{1} = ${x0} - \\frac{${f1}}{${f2}} = ${x1.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "newton-steps-for-transcendental-functions",
      title: t("Newton steps for other functions", "其他函数的牛顿步"),
      explanation: t(
        "The same step works for any twice-differentiable function. For $f(x) = x^{2} + \\frac{k}{x}$: $f'(x) = 2x - \\frac{k}{x^{2}}$ and $f''(x) = 2 + \\frac{2k}{x^{3}}$.",
        "同样的迭代适用于任何二阶可导函数。对 $f(x) = x^{2} + \\frac{k}{x}$：$f'(x) = 2x - \\frac{k}{x^{2}}$，$f''(x) = 2 + \\frac{2k}{x^{3}}$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.int(1, 20);
          const x0 = rng.int(1, 4);
          const f1 = Q.of(2 * x0).sub(Q.of(k, x0 * x0));
          const f2 = Q.of(2).add(Q.of(2 * k, x0 ** 3));
          if (f1.isZero()) continue;
          const x1 = Q.of(x0).sub(f1.div(f2));
          return numberProblem({
            prompt: t(
              `To locate the minimum of $f(x) = x^{2} + \\frac{${k}}{x}$ for $x > 0$, apply one step of Newton's method to $f'$ with $x_{0} = ${x0}$. Find $x_{1}$.`,
              `为求 $f(x) = x^{2} + \\frac{${k}}{x}$（$x > 0$）的最小值点，对 $f'$ 从 $x_{0} = ${x0}$ 出发用牛顿法迭代一步，求 $x_{1}$。`,
            ),
            answer: x1,
            wrong: [Q.of(x0).add(f1.div(f2)), Q.of(x0).sub(f1), Q.of(x0).sub(f2.div(f1))].filter((w) => !w.eq(x1)),
            solution: t(
              `$f'(x) = 2x - \\frac{${k}}{x^{2}}$ and $f''(x) = 2 + \\frac{${2 * k}}{x^{3}}$, so $f'(${x0}) = ${f1.toLatex()}$ and $f''(${x0}) = ${f2.toLatex()}$. Then $x_{1} = ${x0} - \\frac{f'(${x0})}{f''(${x0})} = ${x1.toLatex()}$.`,
              `$f'(x) = 2x - \\frac{${k}}{x^{2}}$，$f''(x) = 2 + \\frac{${2 * k}}{x^{3}}$，所以 $f'(${x0}) = ${f1.toLatex()}$，$f''(${x0}) = ${f2.toLatex()}$。于是 $x_{1} = ${x0} - \\frac{f'(${x0})}{f''(${x0})} = ${x1.toLatex()}$。`,
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

/** calculatingVelocityForStraightLineMotionUsingDifferentiation differentiates position to get velocity. */
export const calculatingVelocityForStraightLineMotionUsingDifferentiation: TopicDef = {
  id: "calculating-velocity-for-straight-line-motion-using-differentiation",
  title: t("Calculating Velocity for Straight-Line Motion Using Differentiation", "用求导计算直线运动的速度"),
  summary: t(
    "Differentiate a position function to find velocity, and find when a particle is at rest.",
    "对位置函数求导得到速度，并求质点静止的时刻。",
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
        "For a particle moving along a line with position $s(t)$, the velocity is $v(t) = s'(t)$. Positive velocity means moving in the positive direction; negative means the opposite. Speed is $|v(t)|$.",
        "沿直线运动的质点位置为 $s(t)$，其速度为 $v(t) = s'(t)$。速度为正表示沿正方向运动，为负表示沿反方向运动。速率为 $|v(t)|$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const t0 = rng.int(1, 5);
        if (kind < 2) {
          const s: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2)];
          const v = pAt(pDer(s), t0);
          const speed = kind === 1;
          return numberProblem({
            prompt: t(
              `A particle moves along a line with position $s(t) = ${pLatex(s, "t")}$ metres after $t$ seconds. Find its ${speed ? "speed" : "velocity"} at $t = ${t0}$, in m/s.`,
              `一个质点沿直线运动，$t$ 秒后的位置为 $s(t) = ${pLatex(s, "t")}$ 米。求它在 $t = ${t0}$ 时的${speed ? "速率" : "速度"}（米/秒）。`,
            ),
            answer: speed ? Math.abs(v) : v,
            unit: "m/s",
            wrong: [pAt(s, t0), speed ? -Math.abs(v) : -v, pAt(pDer(pDer(s)), t0)],
            solution: t(
              `$v(t) = s'(t) = ${pLatex(pDer(s), "t")}$, so $v(${t0}) = ${v}$${speed ? ` and the speed is $|${v}| = ${Math.abs(v)}$` : ""} m/s.`,
              `$v(t) = s'(t) = ${pLatex(pDer(s), "t")}$，所以 $v(${t0}) = ${v}$${speed ? `，速率为 $|${v}| = ${Math.abs(v)}$` : ""} 米/秒。`,
            ),
          });
        }
        for (;;) {
          const a = rng.int(1, 9);
          const w = rng.int(1, 4);
          const s0 = rng.pick([0, 1, 2, 3, 4, 6]);
          const ts = ["0", "\\frac{\\pi}{6}", "\\frac{\\pi}{4}", "\\frac{\\pi}{3}", "\\frac{\\pi}{2}", "", "\\pi"];
          const angle = (w * [0, 2, 3, 4, 6, 0, 12][s0]!) % 24;
          const r3 = Math.sqrt(3) / 2;
          const r2 = Math.SQRT1_2;
          const cosTable: Record<number, number> = {
            0: 1,
            2: r3,
            3: r2,
            4: 0.5,
            6: 0,
            8: -0.5,
            9: -r2,
            10: -r3,
            12: -1,
            14: -r3,
            15: -r2,
            16: -0.5,
            18: 0,
            20: 0.5,
            21: r2,
            22: r3,
          };
          const c = cosTable[angle];
          if (c === undefined) continue;
          const v = rounded(a * w * c, 3);
          if (!v) continue;
          return numberProblem({
            prompt: t(
              `A mass on a spring has position $s(t) = ${a}\\sin(${w === 1 ? "" : w}t)$ cm after $t$ seconds. Find its velocity at $t = ${ts[s0]}$, in cm/s, to three decimal places.`,
              `弹簧上的物体 $t$ 秒后的位置为 $s(t) = ${a}\\sin(${w === 1 ? "" : w}t)$ 厘米。求它在 $t = ${ts[s0]}$ 时的速度（厘米/秒），精确到三位小数。`,
            ),
            answer: v,
            form: "decimal",
            wrong: [rounded(a * c, 3) ?? v, v.neg()],
            solution: t(
              `$v(t) = ${a * w}\\cos(${w === 1 ? "" : w}t)$, so $v(${ts[s0]}) = ${a * w}\\cos\\left(${w === 1 ? ts[s0] : `${w} \\cdot ${ts[s0]}`}\\right) \\approx ${v.toNumber()}$ cm/s.`,
              `$v(t) = ${a * w}\\cos(${w === 1 ? "" : w}t)$，所以 $v(${ts[s0]}) = ${a * w}\\cos\\left(${w === 1 ? ts[s0] : `${w} \\cdot ${ts[s0]}`}\\right) \\approx ${v.toNumber()}$ 厘米/秒。`,
            ),
          });
        }
      },
    },
    {
      id: "when-a-particle-is-at-rest",
      title: t("When a particle is at rest", "质点何时静止"),
      explanation: t(
        "A particle is momentarily at rest when $v(t) = 0$. Solve $s'(t) = 0$ and keep the times in the allowed range, usually $t \\ge 0$.",
        "当 $v(t) = 0$ 时质点瞬时静止。解 $s'(t) = 0$，保留允许范围内的时刻，通常是 $t \\ge 0$。",
      ),
      generate(rng) {
        const m = motion(rng);
        const values = [m.p, m.q].filter((x) => x > 0).map(String);
        const v = pDer(m.s);
        const lead = 3 * m.s[3]!;
        return solutionsProblem({
          prompt: t(
            `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ for $t > 0$. At what times is it at rest?`,
            `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$，$t > 0$。它在哪些时刻静止？`,
          ),
          variable: "t",
          values,
          wrong: [[String(m.p + m.q)], m.p === 0 ? ["0", String(m.q)] : [String(m.q)]],
          solution: t(
            `$v(t) = ${pLatex(v, "t")} = ${lead}${m.p === 0 ? "t" : `(t - ${m.p})`}(t - ${m.q})$, which is $0$ at $t = ${m.p}$ and $t = ${m.q}$.${m.p === 0 ? " Only $t > 0$ counts." : ""}`,
            `$v(t) = ${pLatex(v, "t")} = ${lead}${m.p === 0 ? "t" : `(t - ${m.p})`}(t - ${m.q})$，在 $t = ${m.p}$ 和 $t = ${m.q}$ 处为 $0$。${m.p === 0 ? "只取 $t > 0$。" : ""}`,
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
  prerequisites: ["calculating-velocity-for-straight-line-motion-using-differentiation"],
  encompasses: [{ topic: "calculating-velocity-for-straight-line-motion-using-differentiation", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "acceleration-from-position",
      title: t("Acceleration from position", "由位置求加速度"),
      explanation: t(
        "Acceleration is the rate of change of velocity: $a(t) = v'(t) = s''(t)$. Given velocity, differentiate once; given position, twice.",
        "加速度是速度的变化率：$a(t) = v'(t) = s''(t)$。已知速度时求一次导，已知位置时求两次导。",
      ),
      generate(rng) {
        const t0 = rng.int(0, 5);
        const fromVelocity = rng.bool();
        const s: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2), rng.int(-1, 1)];
        const given = fromVelocity ? pDer(s) : s;
        const answer = pAt(pDer(pDer(s)), t0);
        return numberProblem({
          prompt: t(
            `A particle moves along a line with ${fromVelocity ? "velocity" : "position"} $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "m/s" : "m"} after $t$ seconds. Find its acceleration at $t = ${t0}$, in m/s².`,
            `一个质点沿直线运动，$t$ 秒后的${fromVelocity ? "速度" : "位置"}为 $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "米/秒" : "米"}。求它在 $t = ${t0}$ 时的加速度（米/秒²）。`,
          ),
          answer,
          unit: "m/s^2",
          wrong: [pAt(pDer(s), t0), pAt(given, t0), fromVelocity ? pAt(pDer(pDer(pDer(s))), t0) : pAt(pDer(s), t0) + 1].filter(
            (w) => w !== answer,
          ),
          solution: t(
            `$a(t) = ${fromVelocity ? "v'(t)" : "s''(t)"} = ${pLatex(pDer(pDer(s)), "t")}$, so $a(${t0}) = ${answer}$ m/s².`,
            `$a(t) = ${fromVelocity ? "v'(t)" : "s''(t)"} = ${pLatex(pDer(pDer(s)), "t")}$，所以 $a(${t0}) = ${answer}$ 米/秒²。`,
          ),
        });
      },
    },
    {
      id: "acceleration-when-a-particle-stops",
      title: t("Acceleration when a particle stops", "质点停止时的加速度"),
      explanation: t(
        "To find the acceleration at the moment a particle is at rest, first solve $v(t) = 0$ for the time, then evaluate $a(t)$ there. A particle at rest can still be accelerating: that is how it turns around.",
        "求质点静止时刻的加速度，先解 $v(t) = 0$ 得到时刻，再计算该时刻的 $a(t)$。静止的质点仍然可以有加速度：正是这样它才会掉头。",
      ),
      generate(rng) {
        const m = motion(rng);
        const first = m.p > 0 && rng.bool();
        const at = first ? m.p : m.q;
        const answer = pAt(pDer(pDer(m.s)), at);
        return numberProblem({
          prompt: t(
            `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ metres for $t > 0$ seconds. It ${m.p > 0 ? `stops twice. Find its acceleration, in m/s², at the ${first ? "first" : "second"} time it stops.` : "stops once. Find its acceleration, in m/s², at that moment."}`,
            `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$ 米，$t > 0$ 秒。它${m.p > 0 ? `停止了两次。求它${first ? "第一次" : "第二次"}停止时的加速度（米/秒²）。` : "停止了一次。求那一刻的加速度（米/秒²）。"}`,
          ),
          answer,
          unit: "m/s^2",
          wrong: [0, pAt(m.s, at), -answer],
          solution: t(
            `$v(t) = ${pLatex(pDer(m.s), "t")}$ is $0$ at $t = ${m.p}$ and $t = ${m.q}$${m.p === 0 ? `, and only $t = ${m.q}$ is allowed` : ""}. $a(t) = ${pLatex(pDer(pDer(m.s)), "t")}$, so $a(${at}) = ${answer}$ m/s².`,
            `$v(t) = ${pLatex(pDer(m.s), "t")}$ 在 $t = ${m.p}$ 和 $t = ${m.q}$ 处为 $0$${m.p === 0 ? `，只有 $t = ${m.q}$ 符合要求` : ""}。$a(t) = ${pLatex(pDer(pDer(m.s)), "t")}$，所以 $a(${at}) = ${answer}$ 米/秒²。`,
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
  prerequisites: ["calculating-acceleration-for-straight-line-motion-using-differentiation"],
  encompasses: [{ topic: "calculating-acceleration-for-straight-line-motion-using-differentiation", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "speeding-up-and-slowing-down",
      title: t("Speeding up and slowing down", "加速与减速"),
      explanation: t(
        "A particle is speeding up when $v$ and $a$ have the same sign, and slowing down when they have opposite signs. Negative acceleration alone does not mean slowing down: if $v < 0$ too, the particle moves faster and faster in the negative direction.",
        "当 $v$ 与 $a$ 同号时质点在加速，异号时在减速。仅仅加速度为负并不意味着减速：如果 $v$ 也为负，质点会沿负方向越来越快。",
      ),
      generate(rng) {
        for (;;) {
          const m = motion(rng);
          const t0 = rng.int(1, 8);
          const [v, a] = [pAt(pDer(m.s), t0), pAt(pDer(pDer(m.s)), t0)];
          if (v === 0 || a === 0) continue;
          const options = [t("Speeding up", "加速"), t("Slowing down", "减速")];
          const right = v * a > 0 ? 0 : 1;
          return oneOf(
            rng,
            t(
              `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$. Is it speeding up or slowing down at $t = ${t0}$?`,
              `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$。它在 $t = ${t0}$ 时是在加速还是减速？`,
            ),
            options[right]!,
            [options[1 - right]!],
            t(
              `$v(${t0}) = ${v}$ and $a(${t0}) = ${a}$ have ${right === 0 ? "the same sign, so it is speeding up" : "opposite signs, so it is slowing down"}.`,
              `$v(${t0}) = ${v}$ 与 $a(${t0}) = ${a}$ ${right === 0 ? "同号，所以在加速" : "异号，所以在减速"}。`,
            ),
          );
        }
      },
    },
    {
      id: "total-distance-traveled",
      title: t("Total distance traveled", "运动的总路程"),
      explanation: t(
        "Displacement $s(b) - s(a)$ ignores turning back. For the total distance, split $[a, b]$ at the times where $v$ changes sign and add the distances $|s(t_{k+1}) - s(t_{k})|$ of the pieces.",
        "位移 $s(b) - s(a)$ 不考虑折返。求总路程时，在 $v$ 变号的时刻把 $[a, b]$ 分段，再把各段的路程 $|s(t_{k+1}) - s(t_{k})|$ 相加。",
      ),
      generate(rng) {
        const m = motion(rng);
        const T = m.q + rng.int(1, 3);
        const times = [0, ...[m.p, m.q].filter((x) => x > 0), T];
        const pos = times.map((x) => pAt(m.s, x));
        const legs = pos.slice(1).map((y, i) => Math.abs(y - pos[i]!));
        const answer = legs.reduce((a, b) => a + b, 0);
        const displacement = pos[pos.length - 1]! - pos[0]!;
        return numberProblem({
          prompt: t(
            `A particle moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ metres. Find the total distance it travels from $t = 0$ to $t = ${T}$, in metres.`,
            `一个质点沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$ 米。求它从 $t = 0$ 到 $t = ${T}$ 运动的总路程（米）。`,
          ),
          answer,
          unit: "m",
          wrong: [Math.abs(displacement), displacement, pos[pos.length - 1]!].filter((w) => w !== answer),
          solution: t(
            `$v(t) = ${pLatex(pDer(m.s), "t")}$ changes sign at $t = ${times.slice(1, -1).join("$ and $t = ")}$. The positions are ${times.map((x, i) => `$s(${x}) = ${pos[i]}$`).join(", ")}, so the distance is $${legs.join(" + ")} = ${answer}$ m.`,
            `$v(t) = ${pLatex(pDer(m.s), "t")}$ 在 $t = ${times.slice(1, -1).join("$ 和 $t = ")}$ 处变号。各时刻位置为 ${times.map((x, i) => `$s(${x}) = ${pos[i]}$`).join("，")}，所以路程为 $${legs.join(" + ")} = ${answer}$ 米。`,
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
  prerequisites: ["calculating-acceleration-for-straight-line-motion-using-differentiation"],
  encompasses: [{ topic: "calculating-acceleration-for-straight-line-motion-using-differentiation", weight: 0.4 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "force-from-motion",
      title: t("Force from motion", "由运动求力"),
      explanation: t(
        "Newton's second law says the net force on an object of constant mass $m$ is $F = ma$. With $m$ in kilograms and $a$ in m/s², $F$ is in newtons (N). So $F(t) = m \\, s''(t)$.",
        "牛顿第二定律：质量恒为 $m$ 的物体所受合力为 $F = ma$。$m$ 以千克、$a$ 以米/秒² 为单位时，$F$ 以牛顿（N）为单位。所以 $F(t) = m \\, s''(t)$。",
      ),
      generate(rng) {
        const mass = rng.int(2, 20);
        const t0 = rng.int(0, 5);
        const fromVelocity = rng.bool();
        const s: Poly = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2)];
        const given = fromVelocity ? pDer(s) : s;
        const a = pAt(pDer(pDer(s)), t0);
        const answer = mass * a;
        return numberProblem({
          prompt: t(
            `An object of mass $${mass}$ kg moves along a line with ${fromVelocity ? "velocity" : "position"} $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "m/s" : "m"} after $t$ seconds. Find the net force on it at $t = ${t0}$, in newtons.`,
            `质量为 $${mass}$ 千克的物体沿直线运动，$t$ 秒后的${fromVelocity ? "速度" : "位置"}为 $${fromVelocity ? "v" : "s"}(t) = ${pLatex(given, "t")}$ ${fromVelocity ? "米/秒" : "米"}。求它在 $t = ${t0}$ 时所受的合力（牛顿）。`,
          ),
          answer,
          unit: "N",
          wrong: [a, mass * pAt(pDer(s), t0), mass * pAt(given, t0)].filter((w) => w !== answer),
          solution: t(
            `$a(t) = ${pLatex(pDer(pDer(s)), "t")}$, so $a(${t0}) = ${a}$ m/s² and $F = ma = ${mass} \\cdot ${par(a)} = ${answer}$ N.`,
            `$a(t) = ${pLatex(pDer(pDer(s)), "t")}$，所以 $a(${t0}) = ${a}$ 米/秒²，$F = ma = ${mass} \\cdot ${par(a)} = ${answer}$ N。`,
          ),
        });
      },
    },
    {
      id: "when-the-force-vanishes",
      title: t("When the net force is zero", "合力何时为零"),
      explanation: t(
        "The net force is zero exactly when the acceleration is zero. At that moment the velocity is momentarily neither increasing nor decreasing.",
        "合力为零当且仅当加速度为零。在那一刻，速度瞬时既不增大也不减小。",
      ),
      generate(rng) {
        const mass = rng.int(2, 20);
        const m = motion(rng);
        const answer = Q.of(m.p + m.q, 2);
        return numberProblem({
          prompt: t(
            `An object of mass $${mass}$ kg moves along a line with position $s(t) = ${pLatex(m.s, "t")}$ m. At what time $t$, in seconds, is the net force on it zero?`,
            `质量为 $${mass}$ 千克的物体沿直线运动，位置为 $s(t) = ${pLatex(m.s, "t")}$ 米。在哪个时刻 $t$（秒）它所受的合力为零？`,
          ),
          answer,
          unit: "s",
          wrong: [Q.of(m.p), Q.of(m.q), Q.of(mass)].filter((w) => !w.eq(answer)),
          solution: t(
            `$F = ${mass}a(t)$ with $a(t) = ${pLatex(pDer(pDer(m.s)), "t")}$, which is $0$ at $t = ${answer.toLatex()}$.`,
            `$F = ${mass}a(t)$，其中 $a(t) = ${pLatex(pDer(pDer(m.s)), "t")}$，在 $t = ${answer.toLatex()}$ 处为 $0$。`,
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
