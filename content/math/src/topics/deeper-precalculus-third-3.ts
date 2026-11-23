// A third knowledge point for the Precalculus topics on conics, parametric curves, polar coordinates and complex numbers.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { whole } from "./early-grades-more-kit.ts";
import { chooseFilled, decimal, frac, fraction, gcd, integer, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** shift writes x - h as a factor, or the bare variable when h is zero. */
const shift = (v: string, h: number) => (h === 0 ? v : h < 0 ? `(${v} + ${-h})` : `(${v} - ${h})`);

/** linear writes a following term such as " + 3x", or nothing when its coefficient is zero. */
const linear = (c: number, v: string) => (c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 && v !== "" ? "" : Math.abs(c)}${v}`);

/** shifted writes h + a times a function of the parameter, leaving out h when it is zero. */
const shifted = (h: number, a: number, fn: string) => `${h === 0 ? "" : `${h} + `}${a}${fn}`;

/** complex writes a + bi. */
const complex = (a: number, b: number) => {
  if (b === 0) return `${a}`;
  const size = Math.abs(b) === 1 ? "" : Math.abs(b);
  if (a === 0) return `${b < 0 ? "-" : ""}${size}i`;
  return `${a} ${b < 0 ? "-" : "+"} ${size}i`;
};

/** paren writes a negative number in parentheses. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** size picks a nonzero integer of magnitude at most n. */
const size = (rng: Rng, n: number) => rng.int(1, n) * (rng.bool() ? 1 : -1);

/** triples lists Pythagorean triples with the hypotenuse last. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
  [20, 21, 29],
  [21, 20, 29],
];

/** standardNormal lists z with the value of the standard normal distribution function, times 10000. */
const standardNormal: readonly (readonly [string, number])[] = [
  ["0.1", 5398],
  ["0.2", 5793],
  ["0.25", 5987],
  ["0.3", 6179],
  ["0.4", 6554],
  ["0.5", 6915],
  ["0.6", 7257],
  ["0.7", 7580],
  ["0.75", 7734],
  ["0.8", 7881],
  ["0.9", 8159],
  ["1", 8413],
  ["1.1", 8643],
  ["1.2", 8849],
  ["1.25", 8944],
  ["1.3", 9032],
  ["1.4", 9192],
  ["1.5", 9332],
  ["1.6", 9452],
  ["1.7", 9554],
  ["1.75", 9599],
  ["1.8", 9641],
  ["1.9", 9713],
  ["2", 9772],
  ["2.25", 9878],
  ["2.5", 9938],
  ["2.75", 9970],
  ["3", 9987],
];

/** deeperPrecalculusThird3Points holds these third knowledge points, by topic. */
export const deeperPrecalculusThird3Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "equations-of-ellipses-centered-at-a-general-point": [
    skill(
      "foci-of-a-shifted-ellipse",
      ["Foci of a shifted ellipse", "平移后椭圆的焦点"],
      [
        "The foci lie on the major axis, at a distance $c$ from the center, where $c^{2} = a^{2} - b^{2}$. Shifting an ellipse shifts its foci with it, so measure from the center.\n\nFor $\\frac{(x - 1)^{2}}{25} + \\frac{(y + 2)^{2}}{9} = 1$: $c^{2} = 25 - 9 = 16$, so $c = 4$, and the larger denominator is under $x$, so the foci are $(-3, -2)$ and $(5, -2)$. Check: their midpoint is $(1, -2)$, the center.\n\n> **Watch out.** Move $c$ from the center, not $a$ (that gives the vertices) or $b$, and move along the major axis, the one with the larger denominator.",
        "焦点在长轴上，到中心的距离是 $c$，其中 $c^{2} = a^{2} - b^{2}$。椭圆平移时焦点一起平移，所以从中心开始量。\n\n对 $\\frac{(x - 1)^{2}}{25} + \\frac{(y + 2)^{2}}{9} = 1$：$c^{2} = 25 - 9 = 16$，所以 $c = 4$；较大的分母在 $x$ 下，所以焦点是 $(-3, -2)$ 和 $(5, -2)$。检验：它们的中点是 $(1, -2)$，正是中心。\n\n> **注意。** 从中心移动的是 $c$，不是 $a$（那样得到顶点），也不是 $b$；而且沿分母较大的长轴移动。",
      ],
      (rng) => {
        const [b, c, a] = rng.pick(triples);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const wrong = [`(${h - a}, ${k}), (${h + a}, ${k})`, `(${h}, ${k - c}), (${h}, ${k + c})`, `(${h - b}, ${k}), (${h + b}, ${k})`];
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find the foci of the ellipse $\\frac{${shift("x", h)}^{2}}{${a * a}} + \\frac{${shift("y", k)}^{2}}{${b * b}} = 1$.`,
              `求椭圆 $\\frac{${shift("x", h)}^{2}}{${a * a}} + \\frac{${shift("y", k)}^{2}}{${b * b}} = 1$ 的焦点。`,
            ],
            `(${h - c}, ${k}), (${h + c}, ${k})`,
            wrong,
            [
              `**Step 1: Find c.** Subtract the denominators:\n\n$$c^{2} = ${a * a} - ${b * b} = ${c * c}, \\quad c = ${c}$$\n\n**Step 2: Find the major axis.** The center is $(${h}, ${k})$, and the larger denominator is under $x$, so the major axis is horizontal.\n\n**Step 3: Move c from the center.** Move $${c}$ left and right of $(${h}, ${k})$: the foci are $(${h - c}, ${k})$ and $(${h + c}, ${k})$.\n\n**Check.** Their midpoint is $\\left(\\frac{${h - c} + ${paren(h + c)}}{2}, ${k}\\right) = (${h}, ${k})$, the center, and they are $${2 * c} = 2c$ apart.`,
              `**第一步：求 c。**分母相减：\n\n$$c^{2} = ${a * a} - ${b * b} = ${c * c}, \\quad c = ${c}$$\n\n**第二步：找长轴。**中心是 $(${h}, ${k})$，较大的分母在 $x$ 下面，所以长轴水平。\n\n**第三步：从中心移动 c。**从 $(${h}, ${k})$ 向左右各移 $${c}$：焦点是 $(${h - c}, ${k})$ 和 $(${h + c}, ${k})$。\n\n**检验。**它们的中点是 $\\left(\\frac{${h - c} + ${paren(h + c)}}{2}, ${k}\\right) = (${h}, ${k})$，正是中心，且相距 $${2 * c} = 2c$。`,
            ],
          ),
          [
            [
              `$${wrong[0]}$`,
              `These are the vertices, $a = ${a}$ from the center; the foci are $c = ${c}$ from it.`,
              `这是顶点，距中心 $a = ${a}$；焦点距中心 $c = ${c}$。`,
            ],
            [
              `$${wrong[1]}$`,
              "These move up and down, but the larger denominator is under $x$, so the major axis is horizontal.",
              "这是上下移动，但较大的分母在 $x$ 下面，所以长轴水平。",
            ],
            [
              `$${wrong[2]}$`,
              `These move $b = ${b}$; the foci are $c = \\sqrt{a^{2} - b^{2}} = ${c}$ from the center.`,
              `这是移动 $b = ${b}$；焦点距中心 $c = \\sqrt{a^{2} - b^{2}} = ${c}$。`,
            ],
          ],
        );
      },
    ),
  ],
  "finding-the-center-and-axes-of-ellipses-by-completing-the-square": [
    skill(
      "the-major-axis-from-the-general-form",
      ["The major axis from the general form", "由一般式求长轴"],
      [
        "After completing the square, divide by the constant so that the right side is 1. The larger denominator is then $a^{2}$, and the length of the major axis is $2a$, not $a^{2}$.\n\nFor $x^{2} + 4y^{2} - 2x - 16y + 1 = 0$: $(x - 1)^{2} + 4(y - 2)^{2} = -1 + 1 + 16 = 16$, so $\\frac{(x - 1)^{2}}{16} + \\frac{(y - 2)^{2}}{4} = 1$, $a = 4$, and the major axis is $8$. Check: the vertex $(5, 2)$ gives $25 + 16 - 10 - 32 + 1 = 0$.\n\n> **Watch out.** Read $a^{2}$ only after the right side is $1$, take its square root, and double it: the coefficient $4$ in front of $y^{2}$ is not a semi-axis.",
        "配方之后，除以常数使右边为 1。较大的分母就是 $a^{2}$，长轴的长是 $2a$，而不是 $a^{2}$。\n\n对 $x^{2} + 4y^{2} - 2x - 16y + 1 = 0$：$(x - 1)^{2} + 4(y - 2)^{2} = -1 + 1 + 16 = 16$，所以 $\\frac{(x - 1)^{2}}{16} + \\frac{(y - 2)^{2}}{4} = 1$，$a = 4$，长轴长 $8$。检验：顶点 $(5, 2)$ 给出 $25 + 16 - 10 - 32 + 1 = 0$。\n\n> **注意。** 要在右边化成 $1$ 之后再读 $a^{2}$，开平方后再乘以 2：$y^{2}$ 前面的系数 $4$ 不是半轴。",
      ],
      (rng) => {
        const m = rng.int(2, 4);
        const r = rng.int(1, 5);
        const h = size(rng, 6);
        const k = size(rng, 6);
        const f = h * h + m * m * k * k - m * m * r * r;
        return whole(
          [
            `What is the length of the major axis of the ellipse $x^{2} + ${m * m}y^{2}${linear(-2 * h, "x")}${linear(-2 * m * m * k, "y")}${linear(f, "")} = 0$?`,
            `椭圆 $x^{2} + ${m * m}y^{2}${linear(-2 * h, "x")}${linear(-2 * m * m * k, "y")}${linear(f, "")} = 0$ 的长轴有多长？`,
          ],
          2 * m * r,
          [m * r, 2 * r, m * m * r * r],
          (() => {
            const grouped = `$$\\left(x^{2}${linear(-2 * h, "x")}\\right) + ${m * m}\\left(y^{2}${linear(-2 * k, "y")}\\right) = ${-f}$$`;
            const completed = `$$${shift("x", h)}^{2} + ${m * m}${shift("y", k)}^{2} = ${-f} + ${h * h} + ${m * m * k * k} = ${m * m * r * r}$$`;
            const standard = `$$\\frac{${shift("x", h)}^{2}}{${m * m * r * r}} + \\frac{${shift("y", k)}^{2}}{${r * r}} = 1$$`;
            return [
              `**Step 1: Group and factor.** Collect the $x$ terms and the $y$ terms and take out the $${m * m}$:\n\n${grouped}\n\n**Step 2: Complete the squares.** Inside the brackets add $${h * h}$ and $${k * k}$, which adds $${h * h}$ and $${m * m * k * k}$ to the left, so add them on the right:\n\n${completed}\n\n**Step 3: Divide and read a.** Divide by $${m * m * r * r}$:\n\n${standard}\n\nThe larger denominator is $a^{2} = ${m * m * r * r}$, so $a = ${m * r}$ and the major axis is $2a = ${2 * m * r}$.\n\n**Check.** The vertex $(${h + m * r}, ${k})$ gives $\\frac{${m * r}^{2}}{${m * m * r * r}} + 0 = 1$, and the two vertices $(${h - m * r}, ${k})$ and $(${h + m * r}, ${k})$ are $${2 * m * r}$ apart.`,
              `**第一步：分组并提系数。**把 $x$ 项和 $y$ 项分别归在一起，并提出 $${m * m}$：\n\n${grouped}\n\n**第二步：配方。**在括号里加上 $${h * h}$ 和 $${k * k}$，左边就加了 $${h * h}$ 和 $${m * m * k * k}$，所以右边也加上：\n\n${completed}\n\n**第三步：相除并读出 a。**除以 $${m * m * r * r}$：\n\n${standard}\n\n较大的分母是 $a^{2} = ${m * m * r * r}$，所以 $a = ${m * r}$，长轴长 $2a = ${2 * m * r}$。\n\n**检验。**顶点 $(${h + m * r}, ${k})$ 给出 $\\frac{${m * r}^{2}}{${m * m * r * r}} + 0 = 1$，两个顶点 $(${h - m * r}, ${k})$ 与 $(${h + m * r}, ${k})$ 相距 $${2 * m * r}$。`,
            ] as const;
          })(),
        );
      },
    ),
  ],
  "finding-intercepts-of-ellipses": [
    skill(
      "how-many-x-intercepts",
      ["How many $x$-intercepts", "有几个 $x$ 轴截点"],
      [
        "An ellipse reaches a vertical distance of $b$ from its center. So it crosses the $x$-axis twice when the center is closer than $b$ to the axis, touches once at exactly $b$, and otherwise misses it.\n\nFor $\\frac{(x - 3)^{2}}{25} + \\frac{(y - 2)^{2}}{9} = 1$, the center is $2$ from the $x$-axis and $b = 3$, so there are $2$ points. Check: $y = 0$ gives $\\frac{(x - 3)^{2}}{25} = 1 - \\frac{4}{9} = \\frac{5}{9} > 0$, which has two solutions.\n\n> **Watch out.** Compare the distance of the center from the axis with $b$, the semi-axis under $y$, not with $a$. The sign of $k$ does not matter, only its size.",
        "椭圆在竖直方向离中心最远为 $b$。所以中心到 $x$ 轴的距离小于 $b$ 时相交两次，等于 $b$ 时相切一次，否则不相交。\n\n对 $\\frac{(x - 3)^{2}}{25} + \\frac{(y - 2)^{2}}{9} = 1$，中心到 $x$ 轴的距离是 $2$，$b = 3$，所以有 $2$ 个公共点。检验：$y = 0$ 给出 $\\frac{(x - 3)^{2}}{25} = 1 - \\frac{4}{9} = \\frac{5}{9} > 0$，有两个解。\n\n> **注意。** 要把中心到轴的距离与 $y$ 下的半轴 $b$ 比较，不是与 $a$ 比较。$k$ 的正负无关，只看大小。",
      ],
      (rng) => {
        const a = rng.int(5, 12);
        const b = rng.int(2, 9);
        const distance = rng.pick([rng.int(0, b - 1), b, b + rng.int(1, 5)]);
        const k = rng.bool() ? distance : -distance;
        const h = rng.int(-6, 6);
        const count = distance < b ? 2 : distance === b ? 1 : 0;
        return whole(
          [
            `How many points does the ellipse $\\frac{${shift("x", h)}^{2}}{${a * a}} + \\frac{${shift("y", k)}^{2}}{${b * b}} = 1$ share with the $x$-axis?`,
            `椭圆 $\\frac{${shift("x", h)}^{2}}{${a * a}} + \\frac{${shift("y", k)}^{2}}{${b * b}} = 1$ 与 $x$ 轴有几个公共点？`,
          ],
          count,
          [0, 1, 2, 4].filter((n) => n !== count),
          (() => {
            const rest = Q.of(b * b - k * k, b * b).toLatex();
            const line = `$$\\frac{${shift("x", h)}^{2}}{${a * a}} = 1 - \\frac{${k * k}}{${b * b}} = ${rest}$$`;
            const [en, zh] =
              count === 2
                ? ["positive, so there are two values of $x$: $2$ points", "为正，所以 $x$ 有两个值：$2$ 个公共点"]
                : count === 1
                  ? [`zero, so $x = ${h}$ is the only value: $1$ point`, `为零，所以只有 $x = ${h}$：$1$ 个公共点`]
                  : ["negative, and a square cannot be negative: $0$ points", "为负，而平方不能是负数：$0$ 个公共点"];
            return [
              `**Step 1: Set y = 0.** On the $x$-axis $y = 0$, so the $y$ term becomes $\\frac{${k * k}}{${b * b}}$:\n\n${line}\n\n**Step 2: Look at the sign.** The right side is ${en}.\n\n**Check.** The center is $${distance}$ from the $x$-axis and the ellipse reaches $b = ${b}$ up and down, from $y = ${k - b}$ to $y = ${k + b}$; the axis $y = 0$ is ${count === 2 ? "strictly between them" : count === 1 ? "at one end" : "outside that range"}, which gives $${count}$.`,
              `**第一步：令 y = 0。**在 $x$ 轴上 $y = 0$，$y$ 项变成 $\\frac{${k * k}}{${b * b}}$：\n\n${line}\n\n**第二步：看符号。**右边${zh}。\n\n**检验。**中心到 $x$ 轴的距离是 $${distance}$，椭圆上下各伸展 $b = ${b}$，从 $y = ${k - b}$ 到 $y = ${k + b}$；$x$ 轴 $y = 0$ ${count === 2 ? "严格在两者之间" : count === 1 ? "恰在一端" : "在这个范围之外"}，所以有 $${count}$ 个。`,
            ] as const;
          })(),
        );
      },
    ),
  ],
  "equations-of-hyperbolas-centered-at-the-origin": [
    {
      ...skill(
        "asymptotes-of-a-hyperbola",
        ["Asymptotes of a hyperbola", "双曲线的渐近线"],
        [
          "Far from the center, the 1 in the equation hardly matters, so the curve approaches the lines found by replacing 1 with 0. For $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$ these are $y = \\pm\\frac{b}{a}x$.\n\nFor $\\frac{y^{2}}{9} - \\frac{x^{2}}{4} = 1$: replacing $1$ with $0$ gives $y^{2} = \\frac{9}{4}x^{2}$, so $y = \\pm\\frac{3}{2}x$. Check: at $x = 2$ the lines are at $y = \\pm 3$, the corners of the box with half-width $2$ and half-height $3$.\n\n> **Watch out.** Take square roots of the denominators before dividing: the slope is $\\frac{3}{2}$, not $\\frac{9}{4}$. And when $y^{2}$ is the positive term, its root goes on top.",
          "离中心很远时，方程中的 1 几乎不起作用，所以曲线趋近于把 1 换成 0 得到的直线。对 $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$，它们是 $y = \\pm\\frac{b}{a}x$。\n\n对 $\\frac{y^{2}}{9} - \\frac{x^{2}}{4} = 1$：把 $1$ 换成 $0$ 得 $y^{2} = \\frac{9}{4}x^{2}$，所以 $y = \\pm\\frac{3}{2}x$。检验：在 $x = 2$ 处两条直线的值是 $y = \\pm 3$，正是半宽 $2$、半高 $3$ 的矩形的角。\n\n> **注意。** 要先对分母开平方再相除：斜率是 $\\frac{3}{2}$，不是 $\\frac{9}{4}$。$y^{2}$ 是正项时，它的平方根在上面。",
        ],
        (rng) => {
          const a = rng.int(2, 12);
          let b = rng.int(2, 12);
          if (b === a) b += 1;
          const across = rng.bool();
          const slope = across ? Q.of(b, a) : Q.of(a, b);
          const other = across ? Q.of(a, b) : Q.of(b, a);
          const equation = across
            ? `\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 1`
            : `\\frac{y^{2}}{${a * a}} - \\frac{x^{2}}{${b * b}} = 1`;
          const squares = (across ? Q.of(b * b, a * a) : Q.of(a * a, b * b)).toLatex();
          const wrong = [`y = \\pm ${other.toLatex()}x`, `y = \\pm ${squares}x`, `y = ${slope.toLatex()}x`];
          const zero = across
            ? `\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 0`
            : `\\frac{y^{2}}{${a * a}} - \\frac{x^{2}}{${b * b}} = 0`;
          const [X, Y] = across ? [a, b] : [b, a];
          return reasoned(
            chooseFilled(
              rng,
              [`Find the asymptotes of $${equation}$.`, `求 $${equation}$ 的渐近线。`],
              `y = \\pm ${slope.toLatex()}x`,
              wrong,
              [
                `**Step 1: Replace 1 with 0.** Far from the center the $1$ hardly matters:\n\n$$${zero}$$\n\n**Step 2: Solve for y.** Move the $x$ term across and take both square roots:\n\n$$y^{2} = ${squares}x^{2}, \\quad y = \\pm ${slope.toLatex()}x$$\n\n**Check.** At $x = ${X}$ the line $y = ${slope.toLatex()}x$ is at $y = ${Y}$: it passes through $(${X}, ${Y})$, the corner of the box whose half-width and half-height are the square roots of the denominators under $x^{2}$ and $y^{2}$.`,
                `**第一步：把 1 换成 0。**离中心很远时 $1$ 几乎不起作用：\n\n$$${zero}$$\n\n**第二步：解出 y。**把 $x$ 项移过去，再取两个平方根：\n\n$$y^{2} = ${squares}x^{2}, \\quad y = \\pm ${slope.toLatex()}x$$\n\n**检验。**在 $x = ${X}$ 处，直线 $y = ${slope.toLatex()}x$ 的值是 $y = ${Y}$：它经过 $(${X}, ${Y})$，即以 $x^{2}$、$y^{2}$ 下分母的平方根为半宽、半高的矩形的角。`,
              ],
            ),
            [
              [
                `$${wrong[0]}$`,
                `The ratio is upside down: the slope is the root under $y^{2}$, $${Y}$, over the root under $x^{2}$, $${X}$.`,
                `比颠倒了：斜率是 $y^{2}$ 下的平方根 $${Y}$ 比 $x^{2}$ 下的平方根 $${X}$。`,
              ],
              [`$${wrong[1]}$`, "This divides the denominators; take their square roots first.", "这是分母之比；要先对它们开平方。"],
              [
                `$${wrong[2]}$`,
                "A hyperbola has two asymptotes, with opposite slopes: keep the $\\pm$.",
                "双曲线有两条斜率相反的渐近线：要保留 $\\pm$。",
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings4["equations-of-hyperbolas-centered-at-the-origin#asymptotes-of-a-hyperbola"],
    },
  ],
  "equations-of-hyperbolas-centered-at-a-general-point": [
    skill(
      "foci-of-a-shifted-hyperbola",
      ["Foci of a shifted hyperbola", "平移后双曲线的焦点"],
      [
        "For a hyperbola the distance to the foci satisfies $c^{2} = a^{2} + b^{2}$, with a plus sign, unlike an ellipse. The foci lie along the transverse axis, on either side of the center.\n\nFor $\\frac{(x + 1)^{2}}{9} - \\frac{(y - 2)^{2}}{16} = 1$: $c^{2} = 9 + 16 = 25$, so $c = 5$, and the $x$ term is positive, so the foci are $(-6, 2)$ and $(4, 2)$. Check: their midpoint is $(-1, 2)$, the center, and $c = 5$ is more than $a = 3$, so the foci lie beyond the vertices.\n\n> **Watch out.** Add the denominators, do not subtract them as for an ellipse, and move $c$ from the center, not $a$ or $b$.",
        "双曲线到焦点的距离满足 $c^{2} = a^{2} + b^{2}$，是加号，与椭圆不同。焦点在实轴上，位于中心两侧。\n\n对 $\\frac{(x + 1)^{2}}{9} - \\frac{(y - 2)^{2}}{16} = 1$：$c^{2} = 9 + 16 = 25$，所以 $c = 5$；$x$ 项为正，所以焦点是 $(-6, 2)$ 和 $(4, 2)$。检验：它们的中点是 $(-1, 2)$，正是中心，且 $c = 5$ 大于 $a = 3$，所以焦点在顶点之外。\n\n> **注意。** 分母要相加，不要像椭圆那样相减；从中心移动的是 $c$，不是 $a$ 或 $b$。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const wrong = [`(${h - a}, ${k}), (${h + a}, ${k})`, `(${h}, ${k - c}), (${h}, ${k + c})`, `(${h - b}, ${k}), (${h + b}, ${k})`];
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find the foci of the hyperbola $\\frac{${shift("x", h)}^{2}}{${a * a}} - \\frac{${shift("y", k)}^{2}}{${b * b}} = 1$.`,
              `求双曲线 $\\frac{${shift("x", h)}^{2}}{${a * a}} - \\frac{${shift("y", k)}^{2}}{${b * b}} = 1$ 的焦点。`,
            ],
            `(${h - c}, ${k}), (${h + c}, ${k})`,
            wrong,
            [
              `**Step 1: Find c.** Add the denominators:\n\n$$c^{2} = ${a * a} + ${b * b} = ${c * c}, \\quad c = ${c}$$\n\n**Step 2: Find the transverse axis.** The center is $(${h}, ${k})$, and the positive term is the $x$ term, so the transverse axis is horizontal.\n\n**Step 3: Move c from the center.** Move $${c}$ left and right of $(${h}, ${k})$: the foci are $(${h - c}, ${k})$ and $(${h + c}, ${k})$.\n\n**Check.** Their midpoint is $\\left(\\frac{${h - c} + ${paren(h + c)}}{2}, ${k}\\right) = (${h}, ${k})$, the center, and $c = ${c}$ is more than $a = ${a}$, so the foci lie beyond the vertices.`,
              `**第一步：求 c。**分母相加：\n\n$$c^{2} = ${a * a} + ${b * b} = ${c * c}, \\quad c = ${c}$$\n\n**第二步：找实轴。**中心是 $(${h}, ${k})$，正项是 $x$ 项，所以实轴水平。\n\n**第三步：从中心移动 c。**从 $(${h}, ${k})$ 向左右各移 $${c}$：焦点是 $(${h - c}, ${k})$ 和 $(${h + c}, ${k})$。\n\n**检验。**它们的中点是 $\\left(\\frac{${h - c} + ${paren(h + c)}}{2}, ${k}\\right) = (${h}, ${k})$，正是中心，且 $c = ${c}$ 大于 $a = ${a}$，所以焦点在顶点之外。`,
            ],
          ),
          [
            [
              `$${wrong[0]}$`,
              `These are the vertices, $a = ${a}$ from the center; the foci are $c = ${c}$ from it.`,
              `这是顶点，距中心 $a = ${a}$；焦点距中心 $c = ${c}$。`,
            ],
            [
              `$${wrong[1]}$`,
              "These move up and down, but the positive term is the $x$ term, so the transverse axis is horizontal.",
              "这是上下移动，但正项是 $x$ 项，所以实轴水平。",
            ],
            [
              `$${wrong[2]}$`,
              `These move $b = ${b}$; the foci are $c = \\sqrt{a^{2} + b^{2}} = ${c}$ from the center.`,
              `这是移动 $b = ${b}$；焦点距中心 $c = \\sqrt{a^{2} + b^{2}} = ${c}$。`,
            ],
          ],
        );
      },
    ),
  ],
  "finding-intercepts-and-intersections-of-hyperbolas": [
    {
      ...skill(
        "a-vertical-line-and-a-hyperbola",
        ["A vertical line and a hyperbola", "竖直线与双曲线"],
        [
          "A horizontal hyperbola has no points strictly between its two vertices. So a vertical line misses it inside that gap, touches it at a vertex, and crosses it twice beyond.\n\nFor $\\frac{x^{2}}{9} - \\frac{y^{2}}{4} = 1$ and $x = 5$: $\\frac{y^{2}}{4} = \\frac{25}{9} - 1 = \\frac{16}{9}$, which is positive, so $y = \\pm \\frac{4}{3}$ and there are $2$ points. Check: $5 > 3$, so the line is beyond the vertex $(3, 0)$.\n\n> **Watch out.** Compare the line with $a$, the root under $x^{2}$, not with $b$. The sign does not matter: $x = -5$ also gives $2$ points.",
          "开口向左右的双曲线，在两个顶点之间没有点。所以竖直线在这个间隙内与它不相交，在顶点处相切，在外面相交两次。\n\n对 $\\frac{x^{2}}{9} - \\frac{y^{2}}{4} = 1$ 和 $x = 5$：$\\frac{y^{2}}{4} = \\frac{25}{9} - 1 = \\frac{16}{9}$，为正，所以 $y = \\pm \\frac{4}{3}$，有 $2$ 个公共点。检验：$5 > 3$，所以直线在顶点 $(3, 0)$ 之外。\n\n> **注意。** 要把直线与 $x^{2}$ 下的平方根 $a$ 比较，不是与 $b$ 比较。正负号无关：$x = -5$ 也有 $2$ 个公共点。",
        ],
        (rng) => {
          const a = rng.int(3, 15);
          const b = rng.int(2, 12);
          const distance = rng.pick([rng.int(0, a - 1), a, a + rng.int(1, 9)]);
          const d = rng.bool() ? distance : -distance;
          const count = distance < a ? 0 : distance === a ? 1 : 2;
          return whole(
            [
              `How many points do the line $x = ${d}$ and the hyperbola $\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 1$ share?`,
              `直线 $x = ${d}$ 与双曲线 $\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 1$ 有几个公共点？`,
            ],
            count,
            [0, 1, 2, 4].filter((n) => n !== count),
            (() => {
              const rest = Q.of(d * d - a * a, a * a).toLatex();
              const line = `$$\\frac{y^{2}}{${b * b}} = \\frac{${d * d}}{${a * a}} - 1 = ${rest}$$`;
              const [en, zh] =
                count === 2
                  ? ["positive, so there are two values of $y$: $2$ points", "为正，所以 $y$ 有两个值：$2$ 个公共点"]
                  : count === 1
                    ? ["zero, so $y = 0$ is the only value: $1$ point", "为零，所以只有 $y = 0$：$1$ 个公共点"]
                    : ["negative, and a square cannot be negative: $0$ points", "为负，而平方不能是负数：$0$ 个公共点"];
              return [
                `**Step 1: Substitute the line.** Put $x = ${d}$ into the equation and move the $1$ across:\n\n${line}\n\n**Step 2: Look at the sign.** The right side is ${en}.\n\n**Check.** The vertices are at $x = \\pm ${a}$, and the line is $${distance}$ from the center, ${count === 2 ? "beyond a vertex" : count === 1 ? "exactly at a vertex" : "between the vertices"}, which gives $${count}$.`,
                `**第一步：代入直线。**把 $x = ${d}$ 代入方程，并把 $1$ 移过去：\n\n${line}\n\n**第二步：看符号。**右边${zh}。\n\n**检验。**顶点在 $x = \\pm ${a}$，直线到中心的距离是 $${distance}$，${count === 2 ? "在顶点之外" : count === 1 ? "恰好在顶点处" : "在两顶点之间"}，所以有 $${count}$ 个。`,
              ] as const;
            })(),
          );
        },
      ),
      figure: precalculusDrawings3["finding-intercepts-and-intersections-of-hyperbolas#a-vertical-line-and-a-hyperbola"],
    },
  ],
  "transverse-axes-of-hyperbolas": [
    skill(
      "the-transverse-axis-from-the-foci",
      ["The transverse axis from the foci", "由焦点求实轴"],
      [
        "The relation $c^{2} = a^{2} + b^{2}$ links the foci to both axes. So the foci and the value of $b$ give $a$, and the transverse axis has length $2a$.\n\nFor foci $(\\pm 5, 0)$ and a conjugate axis of $8$: $b = 4$ and $c = 5$, so $a^{2} = 25 - 16 = 9$, $a = 3$, and the transverse axis is $6$. Check: $3^{2} + 4^{2} = 5^{2}$.\n\n> **Watch out.** Halve the conjugate axis to get $b$ before squaring, and subtract: $a^{2} = c^{2} - b^{2}$. The answer is $2a$, not $a$.",
        "关系 $c^{2} = a^{2} + b^{2}$ 把焦点与两条轴联系起来。所以由焦点和 $b$ 可以求出 $a$，实轴长是 $2a$。\n\n对焦点 $(\\pm 5, 0)$ 且虚轴长 $8$：$b = 4$，$c = 5$，所以 $a^{2} = 25 - 16 = 9$，$a = 3$，实轴长 $6$。检验：$3^{2} + 4^{2} = 5^{2}$。\n\n> **注意。** 先把虚轴长减半得到 $b$，再平方，然后相减：$a^{2} = c^{2} - b^{2}$。答案是 $2a$，不是 $a$。",
      ],
      (rng) => {
        const [p, q, r] = rng.pick(triples);
        const k = rng.int(1, 4);
        const [a, b, c] = [k * p, k * q, k * r];
        return whole(
          [
            `A hyperbola has foci $(\\pm ${c}, 0)$ and a conjugate axis of length ${2 * b}. What is the length of its transverse axis?`,
            `双曲线的焦点是 $(\\pm ${c}, 0)$，虚轴长 ${2 * b}。实轴有多长？`,
          ],
          2 * a,
          [a, 2 * c, 2 * b],
          [
            `**Step 1: Read b and c.** The conjugate axis is $2b = ${2 * b}$, so $b = ${b}$, and the foci give $c = ${c}$.\n\n**Step 2: Find a.** Subtract the squares:\n\n$$a^{2} = c^{2} - b^{2} = ${c * c} - ${b * b} = ${a * a}, \\quad a = ${a}$$\n\n**Step 3: Double a.** The transverse axis is $2a = ${2 * a}$.\n\n**Check.** $a^{2} + b^{2} = ${a * a} + ${b * b} = ${c * c} = c^{2}$.`,
            `**第一步：读出 b 和 c。**虚轴长 $2b = ${2 * b}$，所以 $b = ${b}$；焦点给出 $c = ${c}$。\n\n**第二步：求 a。**平方相减：\n\n$$a^{2} = c^{2} - b^{2} = ${c * c} - ${b * b} = ${a * a}, \\quad a = ${a}$$\n\n**第三步：把 a 乘以 2。**实轴长 $2a = ${2 * a}$。\n\n**检验。**$a^{2} + b^{2} = ${a * a} + ${b * b} = ${c * c} = c^{2}$。`,
          ],
        );
      },
    ),
  ],
  "conjugate-axes-of-hyperbolas": [
    skill(
      "the-conjugate-axis-from-foci-and-vertices",
      ["The conjugate axis from foci and vertices", "由焦点和顶点求虚轴"],
      [
        "The vertices give $a$ and the foci give $c$, so $b^{2} = c^{2} - a^{2}$. The conjugate axis has length $2b$, even though no point of the curve lies on it.\n\nFor vertices $(0, \\pm 6)$ and foci $(0, \\pm 10)$: $b^{2} = 100 - 36 = 64$, so $b = 8$ and the conjugate axis is $16$. Check: $6^{2} + 8^{2} = 10^{2}$.\n\n> **Watch out.** For a hyperbola $c$ is the largest of the three, so subtract $a^{2}$ from $c^{2}$; and give $2b$, not $b$.",
        "顶点给出 $a$，焦点给出 $c$，所以 $b^{2} = c^{2} - a^{2}$。虚轴长是 $2b$，尽管曲线上没有点在它上面。\n\n对顶点 $(0, \\pm 6)$ 和焦点 $(0, \\pm 10)$：$b^{2} = 100 - 36 = 64$，所以 $b = 8$，虚轴长 $16$。检验：$6^{2} + 8^{2} = 10^{2}$。\n\n> **注意。** 双曲线中 $c$ 是三者中最大的，所以用 $c^{2}$ 减去 $a^{2}$；答案是 $2b$，不是 $b$。",
      ],
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const across = rng.bool();
        const vertices = across ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`;
        const foci = across ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`;
        return whole(
          [
            `A hyperbola has vertices $${vertices}$ and foci $${foci}$. What is the length of its conjugate axis?`,
            `双曲线的顶点是 $${vertices}$，焦点是 $${foci}$。虚轴有多长？`,
          ],
          2 * b,
          [b, 2 * a, 2 * c],
          [
            `**Step 1: Read a and c.** The vertices give $a = ${a}$ and the foci give $c = ${c}$.\n\n**Step 2: Find b.** Subtract the squares:\n\n$$b^{2} = c^{2} - a^{2} = ${c * c} - ${a * a} = ${b * b}, \\quad b = ${b}$$\n\n**Step 3: Double b.** The conjugate axis is $2b = ${2 * b}$.\n\n**Check.** $a^{2} + b^{2} = ${a * a} + ${b * b} = ${c * c} = c^{2}$.`,
            `**第一步：读出 a 和 c。**顶点给出 $a = ${a}$，焦点给出 $c = ${c}$。\n\n**第二步：求 b。**平方相减：\n\n$$b^{2} = c^{2} - a^{2} = ${c * c} - ${a * a} = ${b * b}, \\quad b = ${b}$$\n\n**第三步：把 b 乘以 2。**虚轴长 $2b = ${2 * b}$。\n\n**检验。**$a^{2} + b^{2} = ${a * a} + ${b * b} = ${c * c} = c^{2}$。`,
          ],
        );
      },
    ),
  ],
  "graphing-curves-defined-parametrically": [
    skill(
      "the-parameter-at-a-point",
      ["The parameter at a point", "某一点的参数"],
      [
        "A point lies on a parametric curve when one value of $t$ gives both of its coordinates. So solve one equation for $t$, and check that value in the other.\n\nFor $x = 3t + 1$, $y = t^{2} - 2$ and the point $(-5, 2)$: $3t + 1 = -5$ gives $t = -2$. Check: $y(-2) = 4 - 2 = 2$, the second coordinate.\n\n> **Watch out.** Solve the equation that is linear in $t$. The squared one, $t^{2} - 2 = 2$, also allows $t = 2$, but $x(2) = 7$, so that value belongs to another point.",
        "一个点在参数曲线上，当且仅当同一个 $t$ 值给出它的两个坐标。所以由一个方程解出 $t$，再代入另一个方程检验。\n\n对 $x = 3t + 1$，$y = t^{2} - 2$ 和点 $(-5, 2)$：由 $3t + 1 = -5$ 得 $t = -2$。检验：$y(-2) = 4 - 2 = 2$，正是第二个坐标。\n\n> **注意。** 要解关于 $t$ 为一次的方程。平方的那个方程 $t^{2} - 2 = 2$ 还允许 $t = 2$，但 $x(2) = 7$，所以这个值属于另一个点。",
      ],
      (rng) => {
        const t = size(rng, 9);
        const p = rng.int(2, 7);
        const q = rng.int(-9, 9);
        const r = rng.int(1, 3);
        const s = rng.int(-9, 9);
        const x = p * t + q;
        const y = r * t * t + s;
        return integer(
          [
            `The curve $x = ${p}t${linear(q, "")}$, $y = ${r === 1 ? "" : r}t^{2}${linear(s, "")}$ passes through $(${x}, ${y})$. What is $t$ at that point?`,
            `曲线 $x = ${p}t${linear(q, "")}$，$y = ${r === 1 ? "" : r}t^{2}${linear(s, "")}$ 经过 $(${x}, ${y})$。这一点的 $t$ 是多少？`,
          ],
          t,
          [-t, x, y],
          [
            `**Step 1: Solve the x equation.** It is linear in $t$:\n\n$$${p}t${linear(q, "")} = ${x} \\implies ${p}t = ${x - q} \\implies t = ${t}$$\n\n**Step 2: Test the y equation.** The same $t$ must give the second coordinate:\n\n$$y(${t}) = ${r === 1 ? "" : r}(${t})^{2}${linear(s, "")} = ${y}$$\n\n**Check.** The $y$ equation alone would also allow $t = ${-t}$, but $x(${-t}) = ${p * -t + q}$, not $${x}$; only $t = ${t}$ gives the point $(${x}, ${y})$.`,
            `**第一步：解 x 的方程。** 它关于 $t$ 是一次的：\n\n$$${p}t${linear(q, "")} = ${x} \\implies ${p}t = ${x - q} \\implies t = ${t}$$\n\n**第二步：检验 y 的方程。** 同一个 $t$ 必须给出第二个坐标：\n\n$$y(${t}) = ${r === 1 ? "" : r}(${t})^{2}${linear(s, "")} = ${y}$$\n\n**检验。** 只看 $y$ 的方程还会得到 $t = ${-t}$，但 $x(${-t}) = ${p * -t + q}$，不是 $${x}$；只有 $t = ${t}$ 给出点 $(${x}, ${y})$。`,
          ],
        );
      },
    ),
  ],
  "cartesian-equations-of-parametric-curves": [
    skill(
      "the-slope-of-a-parametric-line",
      ["The slope of a parametric line", "参数直线的斜率"],
      [
        "When both coordinates change at steady rates, the curve is a line. Its slope is the change in $y$ per unit of $t$ divided by the change in $x$ per unit of $t$.\n\nFor $x = 2t + 1$, $y = 6t - 5$: each unit of $t$ adds $2$ to $x$ and $6$ to $y$, so the slope is $\\frac{6}{2} = 3$. Check: $t = 0$ and $t = 1$ give $(1, -5)$ and $(3, 1)$, and $\\frac{1 - (-5)}{3 - 1} = 3$.\n\n> **Watch out.** The rate of $y$ goes on top: rise over run, $\\frac{6}{2}$, not $\\frac{2}{6}$. The constants $1$ and $-5$ only place the line and do not change its slope.",
        "两个坐标都匀速变化时，曲线是直线。它的斜率是每单位 $t$ 的 $y$ 变化量除以每单位 $t$ 的 $x$ 变化量。\n\n对 $x = 2t + 1$，$y = 6t - 5$：$t$ 每增加 1，$x$ 增加 $2$，$y$ 增加 $6$，所以斜率是 $\\frac{6}{2} = 3$。检验：$t = 0$ 和 $t = 1$ 给出 $(1, -5)$ 和 $(3, 1)$，而 $\\frac{1 - (-5)}{3 - 1} = 3$。\n\n> **注意。** $y$ 的变化率在分子上：纵向变化比横向变化，是 $\\frac{6}{2}$，不是 $\\frac{2}{6}$。常数 $1$ 和 $-5$ 只决定直线的位置，不改变斜率。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let c = size(rng, 12);
        if (Math.abs(c) === a) c += c < 0 ? -1 : 1;
        const b = rng.int(-9, 9);
        const d = rng.int(-9, 9);
        const m = Q.of(c, a).toLatex();
        const ratio = m === `\\frac{${c}}{${a}}` ? m : `\\frac{${c}}{${a}} = ${m}`;
        return fraction(
          [
            `What is the slope of the line $x = ${a}t${linear(b, "")}$, $y = ${c}t${linear(d, "")}$?`,
            `直线 $x = ${a}t${linear(b, "")}$，$y = ${c}t${linear(d, "")}$ 的斜率是多少？`,
          ],
          Q.of(c, a),
          [Q.of(a, c), Q.of(-c, a), Q.of(d - b === 0 ? c + 1 : d - b, a)],
          [
            `**Step 1: Read the rates.** Each unit of $t$ changes $x$ by $${a}$ and $y$ by $${c}$.\n\n**Step 2: Divide rise by run.**\n\n$$m = ${ratio}$$\n\n**Check.** $t = 0$ and $t = 1$ give the points $(${b}, ${d})$ and $(${a + b}, ${c + d})$, and\n\n$$\\frac{${c + d} - ${paren(d)}}{${a + b} - ${paren(b)}} = ${ratio}$$`,
            `**第一步：读出变化率。** $t$ 每增加 1，$x$ 变化 $${a}$，$y$ 变化 $${c}$。\n\n**第二步：纵向变化除以横向变化。**\n\n$$m = ${ratio}$$\n\n**检验。** $t = 0$ 和 $t = 1$ 给出点 $(${b}, ${d})$ 和 $(${a + b}, ${c + d})$，而\n\n$$\\frac{${c + d} - ${paren(d)}}{${a + b} - ${paren(b)}} = ${ratio}$$`,
          ],
        );
      },
    ),
  ],
  "finding-intercepts-of-curves-defined-parametrically": [
    skill(
      "intercepts-on-a-restricted-interval",
      ["Intercepts on a restricted interval", "限定区间上的截距"],
      [
        "A range for $t$ can remove solutions that the equations alone would allow. So after solving for $t$, keep only the values inside the range, and then find the coordinate.\n\nFor $x = t^{2} - 9$, $y = 2t + 1$ with $0 \\le t \\le 5$: $x = 0$ gives $t = \\pm 3$, and only $t = 3$ is in the range, so the curve crosses the $y$-axis at $y = 7$. Check: $x(3) = 9 - 9 = 0$ and $0 \\le 3 \\le 5$.\n\n> **Watch out.** $t = -3$ also solves $x = 0$, but it lies outside the range, so $y(-3) = -5$ belongs to a part of the curve that is not drawn.",
        "$t$ 的范围可能排除方程本身允许的解。所以解出 $t$ 后，只保留范围内的值，再求坐标。\n\n对 $x = t^{2} - 9$，$y = 2t + 1$，$0 \\le t \\le 5$：$x = 0$ 得 $t = \\pm 3$，只有 $t = 3$ 在范围内，所以曲线在 $y = 7$ 处穿过 $y$ 轴。检验：$x(3) = 9 - 9 = 0$，且 $0 \\le 3 \\le 5$。\n\n> **注意。** $t = -3$ 也满足 $x = 0$，但它在范围之外，所以 $y(-3) = -5$ 属于没有画出的那部分曲线。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const a = size(rng, 6);
        const b = rng.int(-9, 9);
        const top = n + rng.int(1, 5);
        return integer(
          [
            `A curve is $x = t^{2} - ${n * n}$, $y = ${a}t${linear(b, "")}$ for $0 \\le t \\le ${top}$. At what value of $y$ does it cross the $y$-axis?`,
            `曲线 $x = t^{2} - ${n * n}$，$y = ${a}t${linear(b, "")}$，$0 \\le t \\le ${top}$。它在 $y$ 轴上的 $y$ 值是多少？`,
          ],
          a * n + b,
          [-a * n + b, b, a * top + b],
          [
            `**Step 1: Solve x = 0.** On the $y$-axis the $x$-coordinate is $0$:\n\n$$t^{2} - ${n * n} = 0 \\implies t = \\pm ${n}$$\n\n**Step 2: Keep the allowed value.** Only $t = ${n}$ lies in $0 \\le t \\le ${top}$; $t = ${-n}$ is negative.\n\n**Step 3: Find y.**\n\n$$y(${n}) = ${a === 1 ? "" : a === -1 ? "-" : a}(${n})${linear(b, "")} = ${a * n + b}$$\n\n**Check.** $x(${n}) = ${n * n} - ${n * n} = 0$, and $0 \\le ${n} \\le ${top}$, so the point $(0, ${a * n + b})$ is on the curve.`,
            `**第一步：解 x = 0。** 在 $y$ 轴上，$x$ 坐标为 $0$：\n\n$$t^{2} - ${n * n} = 0 \\implies t = \\pm ${n}$$\n\n**第二步：保留范围内的值。** 只有 $t = ${n}$ 在 $0 \\le t \\le ${top}$ 内；$t = ${-n}$ 是负数。\n\n**第三步：求 y。**\n\n$$y(${n}) = ${a === 1 ? "" : a === -1 ? "-" : a}(${n})${linear(b, "")} = ${a * n + b}$$\n\n**检验。** $x(${n}) = ${n * n} - ${n * n} = 0$，且 $0 \\le ${n} \\le ${top}$，所以点 $(0, ${a * n + b})$ 在曲线上。`,
          ],
        );
      },
    ),
  ],
  "parametric-equations-of-circles": [
    skill(
      "distance-along-a-circle",
      ["Distance along a circle", "沿圆周走过的路程"],
      [
        "With $x = r\\cos kt$ and $y = r\\sin kt$, the point goes around the circle $k$ times as $t$ runs from 0 to $2\\pi$. The distance traveled is therefore $k$ circumferences, while the curve itself stays one circle.\n\nFor $x = 3\\cos 2t$, $y = 3\\sin 2t$ with $0 \\le t \\le 2\\pi$: the angle $2t$ runs from $0$ to $4\\pi$, two laps of length $2\\pi \\cdot 3 = 6\\pi$ each, so the point travels $12\\pi$. Check: one lap ends at $t = \\pi$, where $2t = 2\\pi$, so $t$ from $0$ to $2\\pi$ holds two laps.\n\n> **Watch out.** A lap is the circumference $2\\pi r$, not $\\pi r$ or $\\pi r^{2}$, and the number of laps is the multiplier $k$ of $t$. Moving the center does not change the distance.",
        "$x = r\\cos kt$，$y = r\\sin kt$ 时，$t$ 从 0 到 $2\\pi$，点绕圆走 $k$ 圈。所以路程是 $k$ 个周长，而曲线本身仍是一个圆。\n\n对 $x = 3\\cos 2t$，$y = 3\\sin 2t$，$0 \\le t \\le 2\\pi$：角 $2t$ 从 $0$ 变到 $4\\pi$，走两圈，每圈长 $2\\pi \\cdot 3 = 6\\pi$，所以点走了 $12\\pi$。检验：$t = \\pi$ 时 $2t = 2\\pi$，正好走完一圈，所以 $t$ 从 $0$ 到 $2\\pi$ 包含两圈。\n\n> **注意。** 一圈的长度是周长 $2\\pi r$，不是 $\\pi r$，也不是 $\\pi r^{2}$；圈数是 $t$ 前面的倍数 $k$。平移圆心不改变路程。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const k = rng.int(2, 6);
        const h = rng.int(-6, 6);
        const c = rng.int(-6, 6);
        const wrong = [`${2 * r}\\pi`, `${r * k}\\pi`, `${r * r * k}\\pi`];
        return reasoned(
          chooseFilled(
            rng,
            [
              `A point moves by $x = ${shifted(h, r, `\\cos ${k}t`)}$, $y = ${shifted(c, r, `\\sin ${k}t`)}$ for $0 \\le t \\le 2\\pi$. How far does it travel?`,
              `点按 $x = ${shifted(h, r, `\\cos ${k}t`)}$，$y = ${shifted(c, r, `\\sin ${k}t`)}$ 运动，$0 \\le t \\le 2\\pi$。它走了多远？`,
            ],
            `${2 * r * k}\\pi`,
            wrong,
            [
              `**Step 1: Count the laps.** As $t$ runs from $0$ to $2\\pi$, the angle $${k}t$ runs from $0$ to $${2 * k}\\pi$, which is $${k}$ full turns.\n\n**Step 2: Find one lap.** The radius is $${r}$, so one lap is the circumference $2\\pi \\cdot ${r} = ${2 * r}\\pi$.\n\n**Step 3: Multiply.**\n\n$$${k} \\cdot ${2 * r}\\pi = ${2 * r * k}\\pi$$\n\n**Check.** Each lap takes $2\\pi / ${k}$ units of $t$, and $${k}$ such laps fill $0 \\le t \\le 2\\pi$ exactly; the center $(${h}, ${c})$ only moves the circle.`,
              `**第一步：数圈数。** $t$ 从 $0$ 到 $2\\pi$ 时，角 $${k}t$ 从 $0$ 到 $${2 * k}\\pi$，正好 $${k}$ 整圈。\n\n**第二步：求一圈的长度。** 半径是 $${r}$，所以一圈是周长 $2\\pi \\cdot ${r} = ${2 * r}\\pi$。\n\n**第三步：相乘。**\n\n$$${k} \\cdot ${2 * r}\\pi = ${2 * r * k}\\pi$$\n\n**检验。** 每圈用 $2\\pi / ${k}$ 个单位的 $t$，$${k}$ 圈正好填满 $0 \\le t \\le 2\\pi$；圆心 $(${h}, ${c})$ 只是移动了圆的位置。`,
            ],
          ),
          [
            [`$${wrong[0]}$`, `This is one lap; the angle $${k}t$ goes around $${k}$ times.`, `这只是一圈；角 $${k}t$ 绕了 $${k}$ 圈。`],
            [
              `$${wrong[1]}$`,
              `This counts $\\pi r$ per lap; a lap is the circumference $2\\pi r = ${2 * r}\\pi$.`,
              `这把每圈算成 $\\pi r$；一圈是周长 $2\\pi r = ${2 * r}\\pi$。`,
            ],
            [
              `$${wrong[2]}$`,
              `This uses $\\pi r^{2}$, an area; the length of a lap is $2\\pi r$.`,
              `这用了面积 $\\pi r^{2}$；一圈的长度是 $2\\pi r$。`,
            ],
          ],
        );
      },
    ),
  ],
  "parametric-equations-of-ellipses": [
    {
      ...skill(
        "the-point-at-a-given-parameter",
        ["The point at a given parameter", "给定参数对应的点"],
        [
          "In $x = h + a\\cos\\theta$, $y = k + b\\sin\\theta$, the parameter is not the angle seen from the center in general. Its values at quarter turns still give the four ends of the axes.\n\nFor $x = 1 + 4\\cos\\theta$, $y = 2 + 3\\sin\\theta$ at $\\theta = \\pi$: $\\cos\\pi = -1$ and $\\sin\\pi = 0$, so the point is $(1 - 4, 2) = (-3, 2)$, the left end of the major axis. Check: $\\frac{(-3 - 1)^{2}}{16} + \\frac{0^{2}}{9} = 1$.\n\n> **Watch out.** The cosine goes with $x$ and its coefficient $a$, the sine with $y$ and $b$. At $\\theta = \\frac{\\pi}{2}$ the point is $(h, k + b)$, not $(h + a, k)$.",
          "在 $x = h + a\\cos\\theta$，$y = k + b\\sin\\theta$ 中，参数一般不是从中心看到的角。但它在四分之一圈处的值仍给出两条轴的四个端点。\n\n对 $x = 1 + 4\\cos\\theta$，$y = 2 + 3\\sin\\theta$，$\\theta = \\pi$：$\\cos\\pi = -1$，$\\sin\\pi = 0$，所以点是 $(1 - 4, 2) = (-3, 2)$，即长轴的左端点。检验：$\\frac{(-3 - 1)^{2}}{16} + \\frac{0^{2}}{9} = 1$。\n\n> **注意。** 余弦跟 $x$ 和它的系数 $a$ 在一起，正弦跟 $y$ 和 $b$ 在一起。$\\theta = \\frac{\\pi}{2}$ 时点是 $(h, k + b)$，不是 $(h + a, k)$。",
        ],
        (rng) => {
          const h = rng.int(-9, 9);
          const k = rng.int(-9, 9);
          const a = rng.int(3, 12);
          let b = rng.int(2, 11);
          if (b === a) b += 1;
          const row = rng.pick<[string, number, number]>([
            ["0", 1, 0],
            ["\\frac{\\pi}{2}", 0, 1],
            ["\\pi", -1, 0],
            ["\\frac{3\\pi}{2}", 0, -1],
          ]);
          const x = h + a * row[1];
          const y = k + b * row[2];
          const wrong = [`(${h + b * row[1]}, ${k + a * row[2]})`, `(${h + a * row[2]}, ${k + b * row[1]})`, `(${h}, ${k})`];
          const check = `$$\\frac{(${x} - ${paren(h)})^{2}}{${a * a}} + \\frac{(${y} - ${paren(k)})^{2}}{${b * b}} = ${row[1] ** 2} + ${row[2] ** 2} = 1$$`;
          return reasoned(
            chooseFilled(
              rng,
              [
                `Find the point at $\\theta = ${row[0]}$ on $x = ${shifted(h, a, "\\cos\\theta")}$, $y = ${shifted(k, b, "\\sin\\theta")}$.`,
                `求 $x = ${shifted(h, a, "\\cos\\theta")}$，$y = ${shifted(k, b, "\\sin\\theta")}$ 上 $\\theta = ${row[0]}$ 对应的点。`,
              ],
              `(${x}, ${y})`,
              wrong,
              [
                `**Step 1: Evaluate cosine and sine.** At $\\theta = ${row[0]}$, $\\cos\\theta = ${row[1]}$ and $\\sin\\theta = ${row[2]}$.\n\n**Step 2: Substitute.**\n\n$$x = ${h} + ${a}(${row[1]}) = ${x}, \\quad y = ${k} + ${b}(${row[2]}) = ${y}$$\n\n**Check.** The point satisfies the ellipse's standard equation:\n\n${check}`,
                `**第一步：求余弦和正弦。** $\\theta = ${row[0]}$ 时，$\\cos\\theta = ${row[1]}$，$\\sin\\theta = ${row[2]}$。\n\n**第二步：代入。**\n\n$$x = ${h} + ${a}(${row[1]}) = ${x}, \\quad y = ${k} + ${b}(${row[2]}) = ${y}$$\n\n**检验。** 这个点满足椭圆的标准方程：\n\n${check}`,
              ],
            ),
            [
              [
                `$${wrong[0]}$`,
                `This swaps the semi-axes: $a = ${a}$ multiplies $\\cos\\theta$ in $x$, and $b = ${b}$ multiplies $\\sin\\theta$ in $y$.`,
                `这把两条半轴对调了：$a = ${a}$ 乘 $x$ 里的 $\\cos\\theta$，$b = ${b}$ 乘 $y$ 里的 $\\sin\\theta$。`,
              ],
              [
                `$${wrong[1]}$`,
                `This swaps cosine and sine: at $\\theta = ${row[0]}$, $\\cos\\theta = ${row[1]}$ goes into $x$.`,
                `这把余弦和正弦对调了：$\\theta = ${row[0]}$ 时，$\\cos\\theta = ${row[1]}$ 放进 $x$。`,
              ],
              [
                `$${wrong[2]}$`,
                `This is the center, which is not on the ellipse: at $\\theta = ${row[0]}$ the point moves $a\\cos\\theta$ across and $b\\sin\\theta$ up from it.`,
                `这是中心，它不在椭圆上：$\\theta = ${row[0]}$ 时，点要从中心横向移动 $a\\cos\\theta$、纵向移动 $b\\sin\\theta$。`,
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings3["parametric-equations-of-ellipses#the-point-at-a-given-parameter"],
    },
  ],
  "parametric-equations-of-parabolas-centered-at-hk": [
    skill(
      "the-vertex-from-the-parameter",
      ["The vertex from the parameter", "由参数求顶点"],
      [
        "In $x = pt + h$, $y = at^{2} + k$, the value of $y$ turns around at $t = 0$. So the vertex is the point at $t = 0$, which can be read directly from the constants.\n\nFor $x = 3t - 2$, $y = 2t^{2} + 5$: at $t = 0$, $x = -2$ and $y = 5$, so the vertex is $(-2, 5)$. Check: $t = 1$ and $t = -1$ both give $y = 7$, at $x = 1$ and $x = -5$, which lie $3$ either side of $x = -2$.\n\n> **Watch out.** The vertex is the point at $t = 0$, not at $t = 1$, and its $x$-coordinate is the constant in $x$ with its own sign: $x = 3t - 2$ gives $-2$, not $2$.",
        "在 $x = pt + h$，$y = at^{2} + k$ 中，$y$ 在 $t = 0$ 处转向。所以顶点就是 $t = 0$ 对应的点，可以直接从常数读出。\n\n对 $x = 3t - 2$，$y = 2t^{2} + 5$：$t = 0$ 时 $x = -2$，$y = 5$，所以顶点是 $(-2, 5)$。检验：$t = 1$ 和 $t = -1$ 都给出 $y = 7$，对应 $x = 1$ 和 $x = -5$，正好在 $x = -2$ 两侧各 $3$ 处。\n\n> **注意。** 顶点是 $t = 0$ 对应的点，不是 $t = 1$ 对应的点；它的横坐标就是 $x$ 中的常数，连同符号：$x = 3t - 2$ 给出 $-2$，不是 $2$。",
      ],
      (rng) => {
        const p = rng.int(2, 9);
        const a = rng.int(2, 6);
        const h = size(rng, 12);
        const k = size(rng, 12);
        const wrong = [`(${k}, ${h})`, `(${p + h}, ${a + k})`, `(${-h}, ${k})`];
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find the vertex of the parabola $x = ${p}t${linear(h, "")}$, $y = ${a}t^{2}${linear(k, "")}$.`,
              `求抛物线 $x = ${p}t${linear(h, "")}$，$y = ${a}t^{2}${linear(k, "")}$ 的顶点。`,
            ],
            `(${h}, ${k})`,
            wrong,
            [
              `**Step 1: Find where y turns.** $y = ${a}t^{2}${linear(k, "")}$ is smallest when $t^{2} = 0$, so the vertex comes at $t = 0$.\n\n**Step 2: Evaluate at t = 0.**\n\n$$x = ${p}(0)${linear(h, "")} = ${h}, \\quad y = ${a}(0)^{2}${linear(k, "")} = ${k}$$\n\n**Check.** $t = 1$ and $t = -1$ both give $y = ${a + k}$, at $x = ${p + h}$ and $x = ${h - p}$, which lie $${p}$ either side of $x = ${h}$: the parabola is symmetric about the vertical line through $(${h}, ${k})$.`,
              `**第一步：找 y 转向的地方。** $y = ${a}t^{2}${linear(k, "")}$ 在 $t^{2} = 0$ 时最小，所以顶点在 $t = 0$ 处。\n\n**第二步：求 t = 0 时的点。**\n\n$$x = ${p}(0)${linear(h, "")} = ${h}, \\quad y = ${a}(0)^{2}${linear(k, "")} = ${k}$$\n\n**检验。** $t = 1$ 和 $t = -1$ 都给出 $y = ${a + k}$，对应 $x = ${p + h}$ 和 $x = ${h - p}$，正好在 $x = ${h}$ 两侧各 $${p}$ 处：抛物线关于经过 $(${h}, ${k})$ 的竖直线对称。`,
            ],
          ),
          [
            [
              `$${wrong[0]}$`,
              `This swaps the coordinates: the constant in $x$, $${h}$, is the $x$-coordinate.`,
              `这把两个坐标对调了：$x$ 中的常数 $${h}$ 才是横坐标。`,
            ],
            [
              `$${wrong[1]}$`,
              `This is the point at $t = 1$; the vertex is where $y$ turns, at $t = 0$.`,
              `这是 $t = 1$ 对应的点；顶点在 $y$ 转向的地方，即 $t = 0$。`,
            ],
            [
              `$${wrong[2]}$`,
              `At $t = 0$, $x = ${p}(0)${linear(h, "")} = ${h}$: the constant keeps its own sign.`,
              `$t = 0$ 时 $x = ${p}(0)${linear(h, "")} = ${h}$：常数保留它自己的符号。`,
            ],
          ],
        );
      },
    ),
  ],
  "parametric-equations-of-horizontal-hyperbolas": [
    skill(
      "vertices-from-the-secant-form",
      ["Vertices from the secant form", "由正割形式求顶点"],
      [
        "In $x = h + a\\sec\\theta$, $y = k + b\\tan\\theta$, the vertices occur where $\\tan\\theta = 0$, so $\\sec\\theta = \\pm 1$. They lie $a$ to the left and right of the center.\n\nFor $x = 1 + 3\\sec\\theta$, $y = -2 + 5\\tan\\theta$: $\\theta = 0$ gives $(4, -2)$ and $\\theta = \\pi$ gives $(1 - 3, -2) = (-2, -2)$. Check: $\\frac{(-2 - 1)^{2}}{9} - 0 = 1$, and the midpoint of the two vertices is the center $(1, -2)$.\n\n> **Watch out.** The vertices are $a$ from the center along $x$, the variable with the secant. The coefficient $b$ of the tangent gives the other semi-axis, and no vertex lies $b$ from the center.",
        "在 $x = h + a\\sec\\theta$，$y = k + b\\tan\\theta$ 中，顶点在 $\\tan\\theta = 0$ 处，此时 $\\sec\\theta = \\pm 1$。它们在中心左右各 $a$ 处。\n\n对 $x = 1 + 3\\sec\\theta$，$y = -2 + 5\\tan\\theta$：$\\theta = 0$ 给出 $(4, -2)$，$\\theta = \\pi$ 给出 $(1 - 3, -2) = (-2, -2)$。检验：$\\frac{(-2 - 1)^{2}}{9} - 0 = 1$，而且两个顶点的中点就是中心 $(1, -2)$。\n\n> **注意。** 顶点沿 $x$（含正割的变量）方向离中心 $a$。正切的系数 $b$ 给出的是另一条半轴，没有顶点离中心 $b$。",
      ],
      (rng) => {
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const a = rng.int(2, 12);
        let b = rng.int(2, 12);
        if (b === a) b += 1;
        const wrong = [`(${h}, ${k - a}), (${h}, ${k + a})`, `(${h - b}, ${k}), (${h + b}, ${k})`, `(${h}, ${k - b}), (${h}, ${k + b})`];
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find the vertices of the hyperbola $x = ${shifted(h, a, "\\sec\\theta")}$, $y = ${shifted(k, b, "\\tan\\theta")}$.`,
              `求双曲线 $x = ${shifted(h, a, "\\sec\\theta")}$，$y = ${shifted(k, b, "\\tan\\theta")}$ 的顶点。`,
            ],
            `(${h - a}, ${k}), (${h + a}, ${k})`,
            wrong,
            [
              `**Step 1: Find where the tangent is zero.** $\\tan\\theta = 0$ at $\\theta = 0$ and $\\theta = \\pi$, where $\\sec\\theta = 1$ and $\\sec\\theta = -1$.\n\n**Step 2: Substitute.**\n\n$$x = ${h} + ${a}(\\pm 1) = ${h - a} \\text{ or } ${h + a}, \\quad y = ${k} + ${b}(0) = ${k}$$\n\n**Check.** At both points $x - h = \\pm ${a}$ and $y - k = 0$, so they satisfy the standard equation:\n\n$$\\left(\\frac{\\pm ${a}}{${a}}\\right)^{2} - \\left(\\frac{0}{${b}}\\right)^{2} = 1$$\n\nTheir midpoint is the center $(${h}, ${k})$.`,
              `**第一步：找正切为零的地方。** $\\tan\\theta = 0$ 在 $\\theta = 0$ 和 $\\theta = \\pi$ 处，此时 $\\sec\\theta = 1$ 和 $\\sec\\theta = -1$。\n\n**第二步：代入。**\n\n$$x = ${h} + ${a}(\\pm 1) = ${h - a} \\text{ 或 } ${h + a}, \\quad y = ${k} + ${b}(0) = ${k}$$\n\n**检验。** 两个点处 $x - h = \\pm ${a}$，$y - k = 0$，所以都满足标准方程：\n\n$$\\left(\\frac{\\pm ${a}}{${a}}\\right)^{2} - \\left(\\frac{0}{${b}}\\right)^{2} = 1$$\n\n它们的中点是中心 $(${h}, ${k})$。`,
            ],
          ),
          [
            [
              `$${wrong[0]}$`,
              `These are $${a}$ above and below the center, but the secant is in $x$, so the vertices lie to the left and right.`,
              `这是中心上下各 $${a}$ 处的点，但正割在 $x$ 里，所以顶点在中心的左右两侧。`,
            ],
            [
              `$${wrong[1]}$`,
              `This uses $b = ${b}$, the coefficient of the tangent; at $\\tan\\theta = 0$ the $x$-coordinate is $${h} \\pm ${a}$.`,
              `这用了正切的系数 $b = ${b}$；$\\tan\\theta = 0$ 时横坐标是 $${h} \\pm ${a}$。`,
            ],
            [
              `$${wrong[2]}$`,
              `At $\\tan\\theta = 0$ the $y$-coordinate stays $${k}$; these points move $y$ by $${b}$ instead.`,
              `$\\tan\\theta = 0$ 时纵坐标仍是 $${k}$；这些点却把 $y$ 移动了 $${b}$。`,
            ],
          ],
        );
      },
    ),
  ],
  "parametric-equations-of-vertical-hyperbolas": [
    {
      ...skill(
        "the-point-at-parameter-zero",
        ["The point at parameter zero", "参数为零时的点"],
        [
          "To find where a curve starts, put the parameter value into both equations. With a tangent in $x$ and a secant in $y$, the value $\\theta = 0$ gives the upper vertex, which sits directly above the center.\n\nFor $x = 2 + 3\\tan\\theta$, $y = -1 + 4\\sec\\theta$: $\\tan 0 = 0$ and $\\sec 0 = \\frac{1}{\\cos 0} = 1$, so the point is $(2, -1 + 4) = (2, 3)$. Check: $\\left(\\frac{3 - (-1)}{4}\\right)^{2} - 0 = 1$.\n\n> **Watch out.** $\\sec 0 = 1$, not $0$: the secant is $\\frac{1}{\\cos\\theta}$ and $\\cos 0 = 1$. Only the tangent is $0$ at $\\theta = 0$.",
          "在 $x = h + b\\tan\\theta$，$y = k + a\\sec\\theta$ 中，令 $\\theta = 0$，得 $\\tan\\theta = 0$，$\\sec\\theta = 1$。这是上顶点，在中心的正上方。\n\n对 $x = 2 + 3\\tan\\theta$，$y = -1 + 4\\sec\\theta$：$\\tan 0 = 0$，$\\sec 0 = \\frac{1}{\\cos 0} = 1$，所以点是 $(2, -1 + 4) = (2, 3)$。检验：$\\left(\\frac{3 - (-1)}{4}\\right)^{2} - 0 = 1$。\n\n> **注意。** $\\sec 0 = 1$，不是 $0$：正割是 $\\frac{1}{\\cos\\theta}$，而 $\\cos 0 = 1$。$\\theta = 0$ 时只有正切为 $0$。",
        ],
        (rng) => {
          const h = rng.int(-9, 9);
          const k = rng.int(-9, 9);
          const a = rng.int(2, 12);
          let b = rng.int(2, 12);
          if (b === a) b += 1;
          const wrong = [`(${h + b}, ${k})`, `(${h + b}, ${k + a})`, `(${h}, ${k})`];
          return reasoned(
            chooseFilled(
              rng,
              [
                `Find the point at $\\theta = 0$ on $x = ${shifted(h, b, "\\tan\\theta")}$, $y = ${shifted(k, a, "\\sec\\theta")}$.`,
                `求 $x = ${shifted(h, b, "\\tan\\theta")}$，$y = ${shifted(k, a, "\\sec\\theta")}$ 上 $\\theta = 0$ 对应的点。`,
              ],
              `(${h}, ${k + a})`,
              wrong,
              [
                `**Step 1: Evaluate tangent and secant.** $\\tan 0 = 0$, and $\\sec 0 = 1/\\cos 0 = 1$.\n\n**Step 2: Substitute.**\n\n$$x = ${h} + ${b}(0) = ${h}, \\quad y = ${k} + ${a}(1) = ${k + a}$$\n\n**Check.** Here $y - k = ${a}$ and $x - h = 0$, so the point satisfies the standard equation:\n\n$$\\left(\\frac{${a}}{${a}}\\right)^{2} - \\left(\\frac{0}{${b}}\\right)^{2} = 1$$\n\nIt is $${a}$ straight above the center $(${h}, ${k})$, the upper vertex.`,
                `**第一步：求正切和正割。** $\\tan 0 = 0$，$\\sec 0 = 1/\\cos 0 = 1$。\n\n**第二步：代入。**\n\n$$x = ${h} + ${b}(0) = ${h}, \\quad y = ${k} + ${a}(1) = ${k + a}$$\n\n**检验。** 这里 $y - k = ${a}$，$x - h = 0$，所以这个点满足标准方程：\n\n$$\\left(\\frac{${a}}{${a}}\\right)^{2} - \\left(\\frac{0}{${b}}\\right)^{2} = 1$$\n\n它在中心 $(${h}, ${k})$ 正上方 $${a}$ 处，是上顶点。`,
              ],
            ),
            [
              [
                `$${wrong[0]}$`,
                `This takes $\\tan 0 = 1$ and $\\sec 0 = 0$; in fact $\\tan 0 = 0$ and $\\sec 0 = 1$.`,
                `这把 $\\tan 0$ 当成 $1$、$\\sec 0$ 当成 $0$；其实 $\\tan 0 = 0$，$\\sec 0 = 1$。`,
              ],
              [
                `$${wrong[1]}$`,
                `This takes $\\tan 0 = 1$; in fact $\\tan 0 = 0$, so $x$ stays $${h}$.`,
                `这把 $\\tan 0$ 当成了 $1$；其实 $\\tan 0 = 0$，所以 $x$ 仍是 $${h}$。`,
              ],
              [
                `$${wrong[2]}$`,
                `This is the center, which is not on the hyperbola: $\\sec 0 = 1$, not $0$, so $y = ${k + a}$.`,
                `这是中心，它不在双曲线上：$\\sec 0 = 1$，不是 $0$，所以 $y = ${k + a}$。`,
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings3["parametric-equations-of-vertical-hyperbolas#the-point-at-parameter-zero"],
    },
  ],
  "introduction-to-polar-coordinates": [
    {
      ...skill(
        "distance-between-polar-points",
        ["Distance between polar points", "极坐标点之间的距离"],
        [
          "Points with the same angle lie on one ray, and points half a turn apart lie on opposite rays. Points a quarter turn apart form a right triangle with the pole, so the Pythagorean theorem applies.\n\nFor $(5, 20^{\\circ})$ and $(12, 110^{\\circ})$: the angles differ by $90^{\\circ}$, so the distance is $\\sqrt{5^{2} + 12^{2}} = 13$. Check: the law of cosines gives $25 + 144 - 2(5)(12)\\cos 90^{\\circ} = 169 = 13^{2}$.\n\n> **Watch out.** Look at the difference of the angles first. On one ray subtract the radii, on opposite rays add them, and only for a right angle use $\\sqrt{a^{2} + b^{2}}$.",
          "角相同的点在同一条射线上，相差半圈的点在相反的射线上。相差四分之一圈的点与极点构成直角三角形，可用勾股定理。\n\n对 $(5, 20^{\\circ})$ 和 $(12, 110^{\\circ})$：两角相差 $90^{\\circ}$，所以距离是 $\\sqrt{5^{2} + 12^{2}} = 13$。检验：余弦定理给出 $25 + 144 - 2(5)(12)\\cos 90^{\\circ} = 169 = 13^{2}$。\n\n> **注意。** 先看两角之差。在同一条射线上，极径相减；在相反的射线上，极径相加；只有成直角时才用 $\\sqrt{a^{2} + b^{2}}$。",
        ],
        (rng) => {
          const angle = rng.int(1, 12) * 5;
          const mode = rng.int(0, 2);
          const [a, b, c] = rng.pick(triples);
          const second = mode === 0 ? angle : mode === 1 ? angle + 180 : angle + 90;
          const answer = mode === 0 ? Math.abs(a - b) : mode === 1 ? a + b : c;
          return whole(
            [
              `Find the distance between the polar points $(${a}, ${angle}^{\\circ})$ and $(${b}, ${second}^{\\circ})$.`,
              `求极坐标点 $(${a}, ${angle}^{\\circ})$ 和 $(${b}, ${second}^{\\circ})$ 之间的距离。`,
            ],
            answer,
            [mode === 0 ? a + b : Math.abs(a - b), mode === 2 ? a + b : c, a * b],
            [
              `**Step 1: Compare the angles.** The angles differ by $${second - angle}^{\\circ}$, so ${
                mode === 0
                  ? "the points lie on one ray from the pole."
                  : mode === 1
                    ? "the points lie on opposite rays, with the pole between them."
                    : "the rays are perpendicular, and the points form a right triangle with the pole."
              }\n\n**Step 2: Find the distance.**\n\n$$${mode === 0 ? `|${a} - ${b}| = ${answer}` : mode === 1 ? `${a} + ${b} = ${answer}` : `\\sqrt{${a}^{2} + ${b}^{2}} = \\sqrt{${a * a + b * b}} = ${answer}`}$$\n\n**Check.** The law of cosines gives the same distance:\n\n$$${a}^{2} + ${b}^{2} - 2(${a})(${b})\\cos ${second - angle}^{\\circ} = ${a * a + b * b - 2 * a * b * (mode === 0 ? 1 : mode === 1 ? -1 : 0)} = ${answer}^{2}$$`,
              `**第一步：比较两个角。** 两角相差 $${second - angle}^{\\circ}$，所以${
                mode === 0
                  ? "两点在从极点出发的同一条射线上。"
                  : mode === 1
                    ? "两点在相反的射线上，极点在它们之间。"
                    : "两条射线垂直，两点与极点构成直角三角形。"
              }\n\n**第二步：求距离。**\n\n$$${mode === 0 ? `|${a} - ${b}| = ${answer}` : mode === 1 ? `${a} + ${b} = ${answer}` : `\\sqrt{${a}^{2} + ${b}^{2}} = \\sqrt{${a * a + b * b}} = ${answer}`}$$\n\n**检验。** 余弦定理给出同样的距离：\n\n$$${a}^{2} + ${b}^{2} - 2(${a})(${b})\\cos ${second - angle}^{\\circ} = ${a * a + b * b - 2 * a * b * (mode === 0 ? 1 : mode === 1 ? -1 : 0)} = ${answer}^{2}$$`,
            ],
          );
        },
      ),
      figure: precalculusDrawings3["introduction-to-polar-coordinates#distance-between-polar-points"],
    },
  ],
  "converting-from-polar-coordinates-to-cartesian-coordinates": [
    skill(
      "a-polar-equation-that-is-a-line",
      ["A polar equation that is a line", "表示直线的极坐标方程"],
      [
        "Since $x = r\\cos\\theta$ and $y = r\\sin\\theta$, an equation with one of these products is really a line. So $r\\cos\\theta = c$ is vertical and $r\\sin\\theta = c$ is horizontal.\n\nFor $r\\sin\\theta = -4$: $r\\sin\\theta$ is $y$, so this is the horizontal line $y = -4$. Check: the polar point $(4, \\frac{3\\pi}{2})$ has $4\\sin\\frac{3\\pi}{2} = -4$, and in Cartesian coordinates it is $(0, -4)$, on the line.\n\n> **Watch out.** $r\\cos\\theta$ is $x$ and $r\\sin\\theta$ is $y$, not the other way round. Squaring is only needed for $r$ alone: $r = c$ is the circle $x^{2} + y^{2} = c^{2}$, but $r\\cos\\theta = c$ is a line.",
        "因为 $x = r\\cos\\theta$，$y = r\\sin\\theta$，含这种积的方程其实是直线。所以 $r\\cos\\theta = c$ 是竖直线，$r\\sin\\theta = c$ 是水平线。\n\n对 $r\\sin\\theta = -4$：$r\\sin\\theta$ 就是 $y$，所以这是水平线 $y = -4$。检验：极坐标点 $(4, \\frac{3\\pi}{2})$ 满足 $4\\sin\\frac{3\\pi}{2} = -4$，它的直角坐标是 $(0, -4)$，在这条线上。\n\n> **注意。** $r\\cos\\theta$ 是 $x$，$r\\sin\\theta$ 是 $y$，不要弄反。只有单独的 $r$ 才需要平方：$r = c$ 是圆 $x^{2} + y^{2} = c^{2}$，而 $r\\cos\\theta = c$ 是直线。",
      ],
      (rng) => {
        const c = size(rng, 20);
        const cosine = rng.bool();
        const fn = cosine ? "cos" : "sin";
        const v = cosine ? "x" : "y";
        const wrong = [`${cosine ? "y" : "x"} = ${c}`, `x^{2} + y^{2} = ${c * c}`, `y = ${c}x`];
        // The point on the line that lies on an axis: at angle 0 or pi/2 when c > 0, at pi or 3pi/2 when c < 0.
        const angle = cosine ? (c > 0 ? "0" : "\\pi") : c > 0 ? "\\frac{\\pi}{2}" : "\\frac{3\\pi}{2}";
        const point = cosine ? `(${c}, 0)` : `(0, ${c})`;
        return reasoned(
          chooseFilled(
            rng,
            [`Write $r\\${fn}\\theta = ${c}$ as a Cartesian equation.`, `把 $r\\${fn}\\theta = ${c}$ 写成直角坐标方程。`],
            `${v} = ${c}`,
            wrong,
            [
              `**Step 1: Recognize the product.** Since $${v} = r\\${fn}\\theta$, the left side is exactly $${v}$.\n\n**Step 2: Substitute.**\n\n$$r\\${fn}\\theta = ${c} \\implies ${v} = ${c}$$\n\nThis is a ${cosine ? "vertical" : "horizontal"} line.\n\n**Check.** The polar point $(${Math.abs(c)}, ${angle})$ satisfies $${Math.abs(c)}\\${fn}${angle} = ${c}$, and in Cartesian coordinates it is $${point}$, which is on $${v} = ${c}$.`,
              `**第一步：认出这个积。** 因为 $${v} = r\\${fn}\\theta$，左边正是 $${v}$。\n\n**第二步：代入。**\n\n$$r\\${fn}\\theta = ${c} \\implies ${v} = ${c}$$\n\n这是一条${cosine ? "竖直" : "水平"}线。\n\n**检验。** 极坐标点 $(${Math.abs(c)}, ${angle})$ 满足 $${Math.abs(c)}\\${fn}${angle} = ${c}$，它的直角坐标是 $${point}$，在 $${v} = ${c}$ 上。`,
            ],
          ),
          [
            [`$${wrong[0]}$`, `This swaps the variables: $r\\${fn}\\theta$ is $${v}$.`, `这把变量弄反了：$r\\${fn}\\theta$ 是 $${v}$。`],
            [
              `$${wrong[1]}$`,
              `This is the circle $r = ${Math.abs(c)}$; the equation has the product $r\\${fn}\\theta$, not $r$ alone.`,
              `这是圆 $r = ${Math.abs(c)}$；方程里是积 $r\\${fn}\\theta$，不是单独的 $r$。`,
            ],
            [
              `$${wrong[2]}$`,
              `This is the line $\\tan\\theta = ${c}$ through the pole; $r\\${fn}\\theta = ${c}$ fixes $${v}$ alone.`,
              `这是过极点的直线 $\\tan\\theta = ${c}$；$r\\${fn}\\theta = ${c}$ 只确定 $${v}$。`,
            ],
          ],
        );
      },
    ),
  ],
  "polar-equations-of-circles-centered-at-the-origin": [
    {
      ...skill(
        "the-area-of-a-ring",
        ["The area of a ring", "圆环的面积"],
        [
          "The inequality $a \\le r \\le b$ describes the ring between two circles centered at the pole. Its area is the difference of the two disks, $\\pi(b^{2} - a^{2})$, which is not $\\pi(b - a)^{2}$.\n\nFor $2 \\le r \\le 5$: the outer disk has area $25\\pi$ and the inner disk $4\\pi$, so the ring has area $21\\pi$. Check: $5^{2} - 2^{2} = (5 - 2)(5 + 2) = 3 \\cdot 7 = 21$.\n\n> **Watch out.** Square each radius before subtracting: $(5 - 2)^{2} = 9$ squares the width of the ring, and $5^{2} + 2^{2} = 29$ adds the inner disk instead of removing it.",
          "不等式 $a \\le r \\le b$ 表示以极点为圆心的两圆之间的圆环。它的面积是两个圆面积之差 $\\pi(b^{2} - a^{2})$，不是 $\\pi(b - a)^{2}$。\n\n对 $2 \\le r \\le 5$：外圆面积 $25\\pi$，内圆面积 $4\\pi$，所以圆环面积是 $21\\pi$。检验：$5^{2} - 2^{2} = (5 - 2)(5 + 2) = 3 \\cdot 7 = 21$。\n\n> **注意。** 要先把每个半径平方再相减：$(5 - 2)^{2} = 9$ 是把圆环的宽度平方，$5^{2} + 2^{2} = 29$ 是把内圆加上而不是减去。",
        ],
        (rng) => {
          const a = rng.int(1, 12);
          const b = a + rng.int(1, 9);
          return whole(
            [
              `The region $${a} \\le r \\le ${b}$ has area $k\\pi$. What is $k$?`,
              `区域 $${a} \\le r \\le ${b}$ 的面积是 $k\\pi$。$k$ 是多少？`,
            ],
            b * b - a * a,
            [(b - a) * (b - a), b * b + a * a, 2 * (b - a)],
            [
              `**Step 1: Find the two disks.** The region lies between the circles $r = ${a}$ and $r = ${b}$ centered at the pole. The outer disk has area $\\pi \\cdot ${b}^{2} = ${b * b}\\pi$ and the inner disk $\\pi \\cdot ${a}^{2} = ${a * a}\\pi$.\n\n**Step 2: Subtract.** The ring is the outer disk with the inner disk removed:\n\n$$${b * b}\\pi - ${a * a}\\pi = ${b * b - a * a}\\pi$$\n\nSo $k = ${b * b - a * a}$.\n\n**Check.** Factoring the difference of squares gives the same number:\n\n$$(${b} - ${a})(${b} + ${a}) = ${b - a} \\cdot ${a + b} = ${b * b - a * a}$$`,
              `**第一步：求两个圆面积。** 这个区域在以极点为圆心的圆 $r = ${a}$ 与 $r = ${b}$ 之间。外圆面积是 $\\pi \\cdot ${b}^{2} = ${b * b}\\pi$，内圆面积是 $\\pi \\cdot ${a}^{2} = ${a * a}\\pi$。\n\n**第二步：相减。** 圆环是外圆去掉内圆：\n\n$$${b * b}\\pi - ${a * a}\\pi = ${b * b - a * a}\\pi$$\n\n所以 $k = ${b * b - a * a}$。\n\n**检验。** 用平方差分解得到同一个数：\n\n$$(${b} - ${a})(${b} + ${a}) = ${b - a} \\cdot ${a + b} = ${b * b - a * a}$$`,
            ],
          );
        },
      ),
      figure: precalculusDrawings3["polar-equations-of-circles-centered-at-the-origin#the-area-of-a-ring"],
    },
  ],
  "polar-equations-of-radial-lines": [
    {
      ...skill(
        "two-angles-for-one-line",
        ["Two angles for one line", "一条直线的两个角"],
        [
          "A radial line extends through the pole in both directions when $r$ may be negative. So $\\theta = \\alpha$ and $\\theta = \\alpha + 180^{\\circ}$ describe the same line.\n\nFor $\\theta = 40^{\\circ}$: the point $(-3, 40^{\\circ})$ is $3$ from the pole in the direction $220^{\\circ}$, so it is $(3, 220^{\\circ})$, and $\\theta = 220^{\\circ}$ is the same line. Check: $\\tan 220^{\\circ} = \\tan 40^{\\circ}$, so both have the same slope through the pole.\n\n> **Watch out.** $180^{\\circ} - \\alpha$ and $360^{\\circ} - \\alpha$ are reflections: they give the line with the opposite slope. Adding $90^{\\circ}$ gives the perpendicular line. Only adding or subtracting $180^{\\circ}$ keeps the line.",
          "$r$ 可以为负时，径向直线向两个方向穿过极点。所以 $\\theta = \\alpha$ 和 $\\theta = \\alpha + 180^{\\circ}$ 表示同一条直线。\n\n对 $\\theta = 40^{\\circ}$：点 $(-3, 40^{\\circ})$ 在 $220^{\\circ}$ 方向上离极点 $3$，所以它就是 $(3, 220^{\\circ})$，$\\theta = 220^{\\circ}$ 是同一条直线。检验：$\\tan 220^{\\circ} = \\tan 40^{\\circ}$，所以两者过极点、斜率相同。\n\n> **注意。** $180^{\\circ} - \\alpha$ 和 $360^{\\circ} - \\alpha$ 是对称，得到的是斜率相反的直线。加 $90^{\\circ}$ 得到垂直的直线。只有加减 $180^{\\circ}$ 才保持同一条直线。",
        ],
        (rng) => {
          const angle = rng.int(1, 35) * 5;
          const usable = angle === 90 ? 95 : angle;
          const opposite = usable + 180;
          return reasoned(
            chooseFilled(
              rng,
              [
                `With $r$ allowed to be negative, which equation describes the same line as $\\theta = ${usable}^{\\circ}$?`,
                `$r$ 可以为负时，哪个方程与 $\\theta = ${usable}^{\\circ}$ 表示同一条直线？`,
              ],
              `\\theta = ${opposite}^{\\circ}`,
              [`\\theta = ${usable + 90}^{\\circ}`, `\\theta = ${180 - usable}^{\\circ}`, `\\theta = ${360 - usable}^{\\circ}`],
              [
                `**Step 1: Follow a negative radius.** For $r < 0$, the point $(r, ${usable}^{\\circ})$ lies $|r|$ from the pole in the opposite direction, half a turn away:\n\n$$${usable}^{\\circ} + 180^{\\circ} = ${opposite}^{\\circ}$$\n\n**Step 2: Compare the two equations.** So $\\theta = ${usable}^{\\circ}$ covers the rays at $${usable}^{\\circ}$ and $${opposite}^{\\circ}$, and $\\theta = ${opposite}^{\\circ}$ covers the same two rays, its negative radii pointing back along $${usable}^{\\circ}$.\n\n**Check.** The two angles differ by $${opposite}^{\\circ} - ${usable}^{\\circ} = 180^{\\circ}$, so $\\tan ${opposite}^{\\circ} = \\tan ${usable}^{\\circ}$: the same slope through the pole.`,
                `**第一步：看负极径。** $r < 0$ 时，点 $(r, ${usable}^{\\circ})$ 在相反方向上离极点 $|r|$，相差半圈：\n\n$$${usable}^{\\circ} + 180^{\\circ} = ${opposite}^{\\circ}$$\n\n**第二步：比较两个方程。** 所以 $\\theta = ${usable}^{\\circ}$ 包括 $${usable}^{\\circ}$ 和 $${opposite}^{\\circ}$ 两条射线，而 $\\theta = ${opposite}^{\\circ}$ 也包括这两条射线，它的负极径指回 $${usable}^{\\circ}$ 方向。\n\n**检验。** 两角相差 $${opposite}^{\\circ} - ${usable}^{\\circ} = 180^{\\circ}$，所以 $\\tan ${opposite}^{\\circ} = \\tan ${usable}^{\\circ}$：过极点、斜率相同。`,
              ],
            ),
            [
              [
                `$\\theta = ${usable + 90}^{\\circ}$`,
                "This is a quarter turn away, so it is the perpendicular line through the pole.",
                "这相差四分之一圈，所以是过极点的垂直直线。",
              ],
              [
                `$\\theta = ${180 - usable}^{\\circ}$`,
                `$180^{\\circ} - ${usable}^{\\circ}$ reflects the direction across the vertical axis, which gives the line with the opposite slope.`,
                `$180^{\\circ} - ${usable}^{\\circ}$ 是把方向关于竖直轴作对称，得到斜率相反的直线。`,
              ],
              [
                `$\\theta = ${360 - usable}^{\\circ}$`,
                `$360^{\\circ} - ${usable}^{\\circ}$ reflects the direction across the polar axis, which gives the line with the opposite slope.`,
                `$360^{\\circ} - ${usable}^{\\circ}$ 是把方向关于极轴作对称，得到斜率相反的直线。`,
              ],
              [
                `$\\theta = ${opposite + 1}^{\\circ}$`,
                `This differs from $${usable}^{\\circ}$ by $${opposite + 1 - usable}^{\\circ}$; only a difference of $180^{\\circ}$ gives the same line.`,
                `它与 $${usable}^{\\circ}$ 相差 $${opposite + 1 - usable}^{\\circ}$；只有相差 $180^{\\circ}$ 才是同一条直线。`,
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings4["polar-equations-of-radial-lines#two-angles-for-one-line"],
    },
  ],
  "finding-intersections-of-polar-curves": [
    {
      ...skill(
        "the-radius-where-two-circles-meet",
        ["The radius where two circles meet", "两圆交点处的半径"],
        [
          "Setting $a\\cos\\theta = b\\sin\\theta$ gives $\\tan\\theta = \\frac{a}{b}$, and a right triangle then gives the cosine. Substituting back gives the distance from the pole to the intersection.\n\nFor $r = 6\\cos\\theta$ and $r = 8\\sin\\theta$: $\\tan\\theta = 6/8 = 3/4$, so the right triangle has legs $3$ and $4$ and hypotenuse $5$, giving $\\cos\\theta = 4/5$ and $r = 6 \\cdot 4/5 = 24/5$. Check: $\\sin\\theta = 3/5$, and the other curve gives $8 \\cdot 3/5 = 24/5$ too.\n\n> **Watch out.** Dividing $a\\cos\\theta = b\\sin\\theta$ by $b\\cos\\theta$ gives $\\tan\\theta = a/b$, not $b/a$. The answer is $r$, not the hypotenuse of the triangle.",
          "令 $a\\cos\\theta = b\\sin\\theta$，得 $\\tan\\theta = \\frac{a}{b}$，再由直角三角形得到余弦。代回去就得到交点到极点的距离。\n\n对 $r = 6\\cos\\theta$ 和 $r = 8\\sin\\theta$：$\\tan\\theta = 6/8 = 3/4$，直角三角形两条直角边为 $3$、$4$，斜边为 $5$，所以 $\\cos\\theta = 4/5$，$r = 6 \\cdot 4/5 = 24/5$。检验：$\\sin\\theta = 3/5$，另一条曲线给出 $8 \\cdot 3/5 = 24/5$，也一样。\n\n> **注意。** 把 $a\\cos\\theta = b\\sin\\theta$ 两边除以 $b\\cos\\theta$，得 $\\tan\\theta = a/b$，不是 $b/a$。答案是 $r$，不是三角形的斜边。",
        ],
        (rng) => {
          const [a, b, c] = rng.pick(triples);
          const k = rng.int(1, 5);
          const g = gcd(k * a * b, c);
          const radius = g === c ? `${(k * a * b) / c}` : frac((k * a * b) / g, c / g);
          return fraction(
            [
              `The curves $r = ${k * a}\\cos\\theta$ and $r = ${k * b}\\sin\\theta$ meet at a point with $0 < \\theta < \\frac{\\pi}{2}$. What is $r$ there?`,
              `曲线 $r = ${k * a}\\cos\\theta$ 和 $r = ${k * b}\\sin\\theta$ 在 $0 < \\theta < \\frac{\\pi}{2}$ 处相交。这一点的 $r$ 是多少？`,
            ],
            Q.of(k * a * b, c),
            [Q.of(k * c), Q.of(k * (a + b), 2), Q.of(c, k * a * b)],
            [
              `**Step 1: Set the radii equal.** At the intersection both curves give the same $r$; divide by $${k * b}\\cos\\theta$:\n\n$$${k * a}\\cos\\theta = ${k * b}\\sin\\theta \\implies \\tan\\theta = ${frac(k * a, k * b)}${k === 1 ? "" : ` = ${frac(a, b)}`}$$\n\n**Step 2: Read the cosine.** In $0 < \\theta < \\frac{\\pi}{2}$, take a right triangle with opposite side $${a}$, adjacent side $${b}$ and hypotenuse $\\sqrt{${a}^{2} + ${b}^{2}} = ${c}$:\n\n$$\\cos\\theta = ${frac(b, c)}, \\quad \\sin\\theta = ${frac(a, c)}$$\n\n**Step 3: Substitute.** Put the cosine into the first curve:\n\n$$r = ${k * a} \\cdot ${frac(b, c)} = ${radius}$$\n\n**Check.** The second curve gives the same radius:\n\n$$${k * b} \\cdot ${frac(a, c)} = ${radius}$$`,
              `**第一步：令两个极径相等。** 在交点处两条曲线的 $r$ 相同；两边除以 $${k * b}\\cos\\theta$：\n\n$$${k * a}\\cos\\theta = ${k * b}\\sin\\theta \\implies \\tan\\theta = ${frac(k * a, k * b)}${k === 1 ? "" : ` = ${frac(a, b)}`}$$\n\n**第二步：求余弦。** 在 $0 < \\theta < \\frac{\\pi}{2}$ 中，取对边 $${a}$、邻边 $${b}$ 的直角三角形，斜边为 $\\sqrt{${a}^{2} + ${b}^{2}} = ${c}$：\n\n$$\\cos\\theta = ${frac(b, c)}, \\quad \\sin\\theta = ${frac(a, c)}$$\n\n**第三步：代入。** 把余弦代入第一条曲线：\n\n$$r = ${k * a} \\cdot ${frac(b, c)} = ${radius}$$\n\n**检验。** 第二条曲线给出同样的半径：\n\n$$${k * b} \\cdot ${frac(a, c)} = ${radius}$$`,
            ],
          );
        },
      ),
      figure: precalculusDrawings3["finding-intersections-of-polar-curves#the-radius-where-two-circles-meet"],
    },
  ],
  "the-complex-conjugate": [
    skill(
      "an-equation-with-the-conjugate",
      ["An equation with the conjugate", "含共轭的方程"],
      [
        "An equation with both $z$ and $\\bar{z}$ cannot be solved by moving terms around. Write $z = x + yi$ and match the real and imaginary parts, which gives two ordinary equations.\n\nFor example, in $z + 2\\bar{z} = 9 - 2i$ the left side is $(x + yi) + 2(x - yi) = 3x - yi$. Matching parts gives $3x = 9$ and $-y = -2$, so $z = 3 + 2i$. Check: $(3 + 2i) + 2(3 - 2i) = 9 - 2i$.\n\n> **Watch out.** The conjugate changes only the sign of the imaginary part. In $k\\bar{z}$ the real part is $kx$ and the imaginary part is $-ky$, so the imaginary parts of $z$ and $k\\bar{z}$ partly cancel.",
        "同时含 $z$ 和 $\\bar{z}$ 的方程，不能靠移项解。令 $z = x + yi$，比较实部和虚部，得到两个普通方程。\n\n例如，在 $z + 2\\bar{z} = 9 - 2i$ 中，左边是 $(x + yi) + 2(x - yi) = 3x - yi$。比较两部分得 $3x = 9$，$-y = -2$，所以 $z = 3 + 2i$。检验：$(3 + 2i) + 2(3 - 2i) = 9 - 2i$。\n\n> **注意。** 共轭只改变虚部的符号。在 $k\\bar{z}$ 中，实部是 $kx$，虚部是 $-ky$，所以 $z$ 与 $k\\bar{z}$ 的虚部会部分抵消。",
      ],
      (rng) => {
        const k = rng.int(2, 5);
        const x = size(rng, 9);
        const y = size(rng, 9);
        const re = (1 + k) * x;
        const im = (1 - k) * y;
        const left = `${1 + k}x - ${k - 1 === 1 ? "" : k - 1}yi`;
        return reasoned(
          chooseFilled(
            rng,
            [`Solve $z + ${k}\\bar{z} = ${complex(re, im)}$.`, `解方程 $z + ${k}\\bar{z} = ${complex(re, im)}$。`],
            `z = ${complex(x, y)}`,
            [`z = ${complex(x, -y)}`, `z = ${complex(-x, y)}`, `z = ${complex(re, im)}`],
            [
              `**Step 1: Write out the left side.** Put $z = x + yi$, so $\\bar{z} = x - yi$:\n\n$$z + ${k}\\bar{z} = (x + yi) + ${k}(x - yi) = ${left}$$\n\n**Step 2: Match the parts.** The real parts give $${1 + k}x = ${re}$, so $x = ${x}$. The imaginary parts give $${k === 2 ? "-" : 1 - k}y = ${im}$, so $y = ${y}$. Hence $z = ${complex(x, y)}$.\n\n**Check.** Put the answer back into the equation:\n\n$$(${complex(x, y)}) + ${k}(${complex(x, -y)}) = ${complex(re, im)}$$\n\nThis is the right-hand side.`,
              `**第一步：写出左边。** 令 $z = x + yi$，则 $\\bar{z} = x - yi$：\n\n$$z + ${k}\\bar{z} = (x + yi) + ${k}(x - yi) = ${left}$$\n\n**第二步：比较两部分。** 实部给出 $${1 + k}x = ${re}$，所以 $x = ${x}$。虚部给出 $${k === 2 ? "-" : 1 - k}y = ${im}$，所以 $y = ${y}$。因此 $z = ${complex(x, y)}$。\n\n**检验。** 把答案代回方程：\n\n$$(${complex(x, y)}) + ${k}(${complex(x, -y)}) = ${complex(re, im)}$$\n\n正是右边。`,
            ],
          ),
          [
            [
              `$z = ${complex(x, -y)}$`,
              `This is the conjugate of the solution. Putting it in gives $${complex(re, -im)}$: the imaginary part has the wrong sign.`,
              `这是解的共轭。代入得 $${complex(re, -im)}$：虚部符号不对。`,
            ],
            [
              `$z = ${complex(-x, y)}$`,
              `Putting this in gives $${complex(-re, im)}$: the real part has the wrong sign.`,
              `代入得 $${complex(-re, im)}$：实部符号不对。`,
            ],
            [
              `$z = ${complex(re, im)}$`,
              `This is the right-hand side, not $z$. Putting it in gives $${complex((1 + k) * re, (1 - k) * im)}$.`,
              `这是右边，不是 $z$。代入得 $${complex((1 + k) * re, (1 - k) * im)}$。`,
            ],
          ],
        );
      },
    ),
  ],
  "special-properties-of-the-complex-conjugate": [
    skill(
      "the-conjugate-root",
      ["The conjugate root", "共轭根"],
      [
        "A polynomial with real coefficients has its complex roots in conjugate pairs. So one root of a real quadratic gives the other, and then the sum and product of the roots give the coefficients.\n\nFor example, if $x^{2} + px + q = 0$ has the root $2 + 3i$, the other root is $2 - 3i$. Their sum is $4$, so $p = -4$, and their product is $2^{2} + 3^{2} = 13$, so $q = 13$. Check: $(2 + 3i)^{2} = -5 + 12i$, and adding $-4(2 + 3i) + 13$ gives $0$.\n\n> **Watch out.** The coefficient $p$ is minus the sum of the roots, so a sum of $4$ gives $p = -4$. The product of $a + bi$ and $a - bi$ is $a^{2} + b^{2}$, not $a^{2} - b^{2}$.",
        "实系数多项式的复数根成共轭对出现。所以实系数二次方程的一个根给出另一个根，由根的和与积得到系数。\n\n例如，若 $x^{2} + px + q = 0$ 有根 $2 + 3i$，则另一个根是 $2 - 3i$。两根之和是 $4$，所以 $p = -4$；两根之积是 $2^{2} + 3^{2} = 13$，所以 $q = 13$。检验：$(2 + 3i)^{2} = -5 + 12i$，再加上 $-4(2 + 3i) + 13$ 得 $0$。\n\n> **注意。** 系数 $p$ 是两根之和的相反数，所以和为 $4$ 时 $p = -4$。$a + bi$ 与 $a - bi$ 的积是 $a^{2} + b^{2}$，不是 $a^{2} - b^{2}$。",
      ],
      (rng) => {
        const a = size(rng, 9);
        const b = rng.int(1, 9);
        const askP = rng.bool();
        const [p, q] = [-2 * a, a * a + b * b];
        const bi = b === 1 ? "i" : `${b}i`;
        return integer(
          [
            `The equation $x^{2} + px + q = 0$ has real $p$ and $q$, and one root is $${complex(a, b)}$. What is $${askP ? "p" : "q"}$?`,
            `方程 $x^{2} + px + q = 0$ 中 $p$、$q$ 是实数，一个根是 $${complex(a, b)}$。$${askP ? "p" : "q"}$ 是多少？`,
          ],
          askP ? p : q,
          askP ? [2 * a, a, a * a + b * b] : [a * a - b * b, -2 * a, a * a + b],
          [
            `**Step 1: Find the other root.** The coefficients are real, so the conjugate $${complex(a, -b)}$ is also a root.\n\n**Step 2: Use the sum and the product.** The sum of the roots is $${2 * a}$, so $p = ${p}$. The product is\n\n$$(${complex(a, b)})(${complex(a, -b)}) = ${paren(a)}^{2} + ${b}^{2} = ${q}$$\n\nSo $q = ${q}$.\n\n**Check.** The quadratic formula for $x^{2} ${p < 0 ? "-" : "+"} ${Math.abs(p)}x + ${q} = 0$ gives\n\n$$x = ${a} \\pm \\sqrt{${paren(a)}^{2} - ${q}} = ${a} \\pm \\sqrt{${-b * b}} = ${a} \\pm ${bi}$$\n\nThese are the two conjugate roots.`,
            `**第一步：求另一个根。** 系数是实数，所以共轭 $${complex(a, -b)}$ 也是根。\n\n**第二步：用和与积。** 两根之和是 $${2 * a}$，所以 $p = ${p}$。两根之积是\n\n$$(${complex(a, b)})(${complex(a, -b)}) = ${paren(a)}^{2} + ${b}^{2} = ${q}$$\n\n所以 $q = ${q}$。\n\n**检验。** 对 $x^{2} ${p < 0 ? "-" : "+"} ${Math.abs(p)}x + ${q} = 0$ 用求根公式：\n\n$$x = ${a} \\pm \\sqrt{${paren(a)}^{2} - ${q}} = ${a} \\pm \\sqrt{${-b * b}} = ${a} \\pm ${bi}$$\n\n正是这两个共轭根。`,
          ],
        );
      },
    ),
  ],
  "dividing-complex-numbers": [
    skill(
      "dividing-by-an-imaginary-number",
      ["Dividing by an imaginary number", "除以纯虚数"],
      [
        "To divide by a pure imaginary number, multiply the top and bottom by $i$, because $i \\cdot i = -1$ makes the bottom real. The real and imaginary parts swap, and one sign changes.\n\nFor example, multiplying the top and bottom of $\\frac{6 + 4i}{2i}$ by $i$ gives $\\frac{-4 + 6i}{-2}$, which is $2 - 3i$. Check: $2i(2 - 3i) = 4i - 6i^{2} = 6 + 4i$.\n\n> **Watch out.** The bottom becomes negative, $2i \\cdot i = -2$, so dividing by it changes the signs of both parts. Dividing by $i$ is the same as multiplying by $-i$, not by $i$.",
        "除以纯虚数时，分子分母同乘 $i$，因为 $i \\cdot i = -1$ 使分母成为实数。实部和虚部互换，其中一个变号。\n\n例如，$\\frac{6 + 4i}{2i}$ 的分子分母同乘 $i$，得 $\\frac{-4 + 6i}{-2}$，即 $2 - 3i$。检验：$2i(2 - 3i) = 4i - 6i^{2} = 6 + 4i$。\n\n> **注意。** 分母变成负数，$2i \\cdot i = -2$，所以除以它会改变两部分的符号。除以 $i$ 等于乘以 $-i$，而不是乘以 $i$。",
      ],
      (rng) => {
        const k = rng.int(2, 6);
        const m = size(rng, 9);
        const n = size(rng, 9);
        return reasoned(
          chooseFilled(
            rng,
            [`Evaluate $\\frac{${complex(k * m, k * n)}}{${k}i}$.`, `计算 $\\frac{${complex(k * m, k * n)}}{${k}i}$。`],
            complex(n, -m),
            // The last two slips stand in when m and n are equal or opposite and the first three coincide.
            [...new Set([complex(-n, m), complex(m, n), complex(n, m), complex(m, -n), complex(-n, -m)])]
              .filter((o) => o !== complex(n, -m))
              .slice(0, 3),
            [
              `**Step 1: Multiply the top and bottom by $i$.** The bottom becomes $${k}i \\cdot i = ${-k}$, and the top becomes\n\n$$(${complex(k * m, k * n)})i = ${complex(-k * n, k * m)}$$\n\n**Step 2: Divide each part by $${-k}$.** This gives\n\n$$\\frac{${complex(-k * n, k * m)}}{${-k}} = ${complex(n, -m)}$$\n\n**Check.** Multiply the answer by the bottom:\n\n$$${k}i(${complex(n, -m)}) = ${complex(k * m, k * n)}$$\n\nThis is the top, as it should be.`,
              `**第一步：分子分母同乘 $i$。** 分母变成 $${k}i \\cdot i = ${-k}$，分子变成\n\n$$(${complex(k * m, k * n)})i = ${complex(-k * n, k * m)}$$\n\n**第二步：每部分除以 $${-k}$。** 得\n\n$$\\frac{${complex(-k * n, k * m)}}{${-k}} = ${complex(n, -m)}$$\n\n**检验。** 用答案乘以分母：\n\n$$${k}i(${complex(n, -m)}) = ${complex(k * m, k * n)}$$\n\n正是分子。`,
            ],
          ),
          [
            [
              `$${complex(-n, m)}$`,
              "This multiplies by $i$ instead of dividing by it: dividing by $i$ is multiplying by $-i$.",
              "这是乘以 $i$，而不是除以 $i$：除以 $i$ 等于乘以 $-i$。",
            ],
            [
              `$${complex(m, n)}$`,
              "Dividing by $i$ exchanges the real and imaginary parts, and this keeps them in place.",
              "除以 $i$ 会交换实部和虚部，而这里没有交换。",
            ],
            [
              `$${complex(n, m)}$`,
              "The parts are exchanged, but one must change sign because $i \\cdot i = -1$.",
              "实部和虚部交换了，但因为 $i \\cdot i = -1$，其中一个要变号。",
            ],
            [
              `$${complex(m, -n)}$`,
              "This only changes the sign of the imaginary part; dividing by $i$ also exchanges the real and imaginary parts.",
              "这只改变了虚部的符号；除以 $i$ 还要交换实部和虚部。",
            ],
            [
              `$${complex(-n, -m)}$`,
              "The parts are exchanged, but only the new imaginary part changes sign, not both.",
              "实部和虚部交换了，但只有新的虚部变号，而不是两个都变。",
            ],
          ],
        );
      },
    ),
  ],
  "extending-polynomial-identities-to-the-complex-numbers": [
    skill(
      "a-sum-of-squares-with-a-coefficient",
      ["A sum of squares with a coefficient", "带系数的平方和"],
      [
        "Since $(ax + bi)(ax - bi) = a^{2}x^{2} + b^{2}$, any sum of two squares factors over the complex numbers. So first write each term as a square, and then use conjugate factors.\n\nFor example, $4x^{2} + 9$ is $(2x)^{2} + 3^{2}$, so it factors as $(2x + 3i)(2x - 3i)$. Check: the middle terms $-6xi$ and $6xi$ cancel, and $-9i^{2} = 9$.\n\n> **Watch out.** The factors $(2x + 3)(2x - 3)$ give $4x^{2} - 9$, a difference of squares. The square $(2x + 3i)^{2}$ is not a factorization of the sum either, because its middle term $12xi$ does not cancel.",
        "因为 $(ax + bi)(ax - bi) = a^{2}x^{2} + b^{2}$，任何两个平方的和都能在复数范围内分解。所以先把每一项写成平方，再用共轭因式。\n\n例如，$4x^{2} + 9$ 是 $(2x)^{2} + 3^{2}$，所以分解为 $(2x + 3i)(2x - 3i)$。检验：中间项 $-6xi$ 与 $6xi$ 相消，而 $-9i^{2} = 9$。\n\n> **注意。** 因式 $(2x + 3)(2x - 3)$ 给出 $4x^{2} - 9$，是平方差。平方 $(2x + 3i)^{2}$ 也不是这个和的分解，因为它的中间项 $12xi$ 不会抵消。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        return reasoned(
          chooseFilled(
            rng,
            [`Factor $${a * a}x^{2} + ${b * b}$ over the complex numbers.`, `在复数范围内分解 $${a * a}x^{2} + ${b * b}$。`],
            `(${a}x + ${b}i)(${a}x - ${b}i)`,
            [`(${a}x + ${b})(${a}x - ${b})`, `(${a}x + ${b}i)^{2}`, `(x + ${b}i)(${a * a}x - ${b}i)`],
            [
              `**Step 1: Write each term as a square.** The terms are $${a * a}x^{2} = (${a}x)^{2}$ and $${b * b} = ${b}^{2}$.\n\n**Step 2: Use conjugate factors.** A sum $u^{2} + v^{2}$ factors as $(u + vi)(u - vi)$, so with $u = ${a}x$ and $v = ${b}$ the factors are $(${a}x + ${b}i)(${a}x - ${b}i)$.\n\n**Check.** Multiply out:\n\n$$(${a}x + ${b}i)(${a}x - ${b}i) = ${a * a}x^{2} - ${a * b}xi + ${a * b}xi - ${b * b}i^{2} = ${a * a}x^{2} + ${b * b}$$\n\nThe middle terms cancel, and $i^{2} = -1$ makes the last term positive.`,
              `**第一步：把每一项写成平方。** 两项是 $${a * a}x^{2} = (${a}x)^{2}$ 和 $${b * b} = ${b}^{2}$。\n\n**第二步：用共轭因式。** 和 $u^{2} + v^{2}$ 分解为 $(u + vi)(u - vi)$，取 $u = ${a}x$、$v = ${b}$，因式是 $(${a}x + ${b}i)(${a}x - ${b}i)$。\n\n**检验。** 乘开：\n\n$$(${a}x + ${b}i)(${a}x - ${b}i) = ${a * a}x^{2} - ${a * b}xi + ${a * b}xi - ${b * b}i^{2} = ${a * a}x^{2} + ${b * b}$$\n\n中间项相消，而 $i^{2} = -1$ 使最后一项为正。`,
            ],
          ),
          [
            [
              `$(${a}x + ${b})(${a}x - ${b})$`,
              `This multiplies out to $${a * a}x^{2} - ${b * b}$, a difference of squares, not the sum.`,
              `乘开得 $${a * a}x^{2} - ${b * b}$，是平方差，不是这个和。`,
            ],
            [
              `$(${a}x + ${b}i)^{2}$`,
              `This square is $${a * a}x^{2} + ${2 * a * b}xi - ${b * b}$: it has a middle term, and its constant is negative.`,
              `这个平方是 $${a * a}x^{2} + ${2 * a * b}xi - ${b * b}$：它有中间项，常数项还是负的。`,
            ],
            [
              `$(x + ${b}i)(${a * a}x - ${b}i)$`,
              `The factors are not conjugates, so the middle terms leave $${(a * a - 1) * b}xi$ behind.`,
              `两个因式不是共轭的，所以中间项留下 $${(a * a - 1) * b}xi$。`,
            ],
          ],
        );
      },
    ),
  ],
  "products-of-complex-numbers-expressed-in-polar-form": [
    skill(
      "powers-in-polar-form",
      ["Powers in polar form", "极坐标形式的幂"],
      [
        "A power is a repeated product, so the modulus is raised to the power and the argument is multiplied by it. This is de Moivre's theorem, which makes high powers quick.\n\nFor example, the cube of $2(\\cos 30^{\\circ} + i\\sin 30^{\\circ})$ has modulus $2^{3} = 8$ and argument $3 \\times 30^{\\circ} = 90^{\\circ}$, so it is $8i$. Check: in rectangular form the number is $\\sqrt{3} + i$. Its square is $2 + 2\\sqrt{3}i$, and multiplying once more by $\\sqrt{3} + i$ gives $8i$.\n\n> **Watch out.** The modulus is raised to the power, $2^{3} = 8$, not multiplied by it. The argument is multiplied by the power, not left alone.",
        "幂是重复的积，所以模取这个幂，辐角乘这个指数。这就是棣莫弗定理，它让高次幂的计算变得很快。\n\n例如，$2(\\cos 30^{\\circ} + i\\sin 30^{\\circ})$ 的立方，模是 $2^{3} = 8$，辐角是 $3 \\times 30^{\\circ} = 90^{\\circ}$，所以它是 $8i$。检验：这个数的直角坐标形式是 $\\sqrt{3} + i$。它的平方是 $2 + 2\\sqrt{3}i$，再乘一次 $\\sqrt{3} + i$ 得 $8i$。\n\n> **注意。** 模是取幂，$2^{3} = 8$，而不是乘以指数。辐角要乘以指数，不能保持不变。",
      ],
      (rng) => {
        const r = rng.int(2, 5);
        const n = rng.int(2, 4);
        const angle = rng.int(1, 16) * 5;
        const polar = (modulus: number, degrees: number) => `${modulus}(\\cos ${degrees}^{\\circ} + i\\sin ${degrees}^{\\circ})`;
        // When r times n equals r to the n, as for 2 squared, the slip of multiplying the modulus gives the answer, so the slip of adding the power to the argument stands in for it.
        const slip: [string, string, string] =
          r * n !== r ** n
            ? [
                polar(r * n, n * angle),
                `This multiplies the modulus by $${n}$; it must be raised to the power, $${r}^{${n}} = ${r ** n}$.`,
                `这是把模乘以 $${n}$；模应取幂，$${r}^{${n}} = ${r ** n}$。`,
              ]
            : [
                polar(r ** n, angle + n),
                `This adds $${n}$ to the argument; it must be multiplied by $${n}$, giving $${n * angle}^{\\circ}$.`,
                `这是把辐角加上 $${n}$；辐角应乘以 $${n}$，得 $${n * angle}^{\\circ}$。`,
              ];
        return reasoned(
          chooseFilled(
            rng,
            [`Evaluate $\\left[${polar(r, angle)}\\right]^{${n}}$.`, `计算 $\\left[${polar(r, angle)}\\right]^{${n}}$。`],
            polar(r ** n, n * angle),
            [slip[0], polar(r ** n, angle), polar(r, n * angle)],
            [
              `**Step 1: Raise the modulus to the power.** The modulus becomes $${r}^{${n}} = ${r ** n}$.\n\n**Step 2: Multiply the argument by the power.** The argument becomes $${n} \\times ${angle}^{\\circ} = ${n * angle}^{\\circ}$, so the power is\n\n$$${polar(r ** n, n * angle)}$$\n\n**Check.** Multiply the $${n}$ copies one at a time instead. The moduli multiply:\n\n$$${Array.from({ length: n }, () => r).join(" \\cdot ")} = ${r ** n}$$\n\nThe arguments add:\n\n$$${Array.from({ length: n }, () => `${angle}^{\\circ}`).join(" + ")} = ${n * angle}^{\\circ}$$\n\nBoth agree with the answer.`,
              `**第一步：模取幂。** 模变为 $${r}^{${n}} = ${r ** n}$。\n\n**第二步：辐角乘以指数。** 辐角变为 $${n} \\times ${angle}^{\\circ} = ${n * angle}^{\\circ}$，所以这个幂是\n\n$$${polar(r ** n, n * angle)}$$\n\n**检验。** 改为把 $${n}$ 个因数逐个相乘。模相乘：\n\n$$${Array.from({ length: n }, () => r).join(" \\cdot ")} = ${r ** n}$$\n\n辐角相加：\n\n$$${Array.from({ length: n }, () => `${angle}^{\\circ}`).join(" + ")} = ${n * angle}^{\\circ}$$\n\n两者都与答案一致。`,
            ],
          ),
          [
            [`$${slip[0]}$`, slip[1], slip[2]],
            [
              `$${polar(r ** n, angle)}$`,
              `The modulus is right, but the argument must be multiplied by $${n}$ as well, giving $${n * angle}^{\\circ}$.`,
              `模是对的，但辐角也要乘以 $${n}$，得 $${n * angle}^{\\circ}$。`,
            ],
            [
              `$${polar(r, n * angle)}$`,
              `The argument is right, but the modulus must be raised to the power as well, giving $${r ** n}$.`,
              `辐角是对的，但模也要取幂，得 $${r ** n}$。`,
            ],
          ],
        );
      },
    ),
  ],
  "quotients-of-complex-numbers-expressed-in-polar-form": [
    skill(
      "the-reciprocal-in-polar-form",
      ["The reciprocal in polar form", "极坐标形式的倒数"],
      [
        "The number 1 has modulus 1 and argument 0, so the quotient rule gives the reciprocal at once. The modulus is inverted, and the argument changes sign.\n\nFor example, the reciprocal of $2(\\cos 60^{\\circ} + i\\sin 60^{\\circ})$ has modulus $\\frac{1}{2}$ and argument $-60^{\\circ}$. Check: multiplying the number by its reciprocal multiplies the moduli to $1$ and adds the arguments to $0^{\\circ}$, which gives $1$.\n\n> **Watch out.** The reciprocal is not the negative of the number, and not its conjugate. The conjugate also has argument $-60^{\\circ}$, but its modulus stays $2$, while the reciprocal has modulus $\\frac{1}{2}$.",
        "数 1 的模是 1，辐角是 0，所以由商的法则立刻得到倒数。模取倒数，辐角变号。\n\n例如，$2(\\cos 60^{\\circ} + i\\sin 60^{\\circ})$ 的倒数，模是 $\\frac{1}{2}$，辐角是 $-60^{\\circ}$。检验：这个数乘以它的倒数，模相乘得 $1$，辐角相加得 $0^{\\circ}$，结果是 $1$。\n\n> **注意。** 倒数不是这个数的相反数，也不是它的共轭。共轭的辐角也是 $-60^{\\circ}$，但模仍是 $2$，而倒数的模是 $\\frac{1}{2}$。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const angle = rng.int(1, 35) * 5;
        return reasoned(
          chooseFilled(
            rng,
            [
              `Find the reciprocal of $${r}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})$.`,
              `求 $${r}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})$ 的倒数。`,
            ],
            `${frac(1, r)}(\\cos(-${angle}^{\\circ}) + i\\sin(-${angle}^{\\circ}))`,
            [
              `${frac(1, r)}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})`,
              `${r}(\\cos(-${angle}^{\\circ}) + i\\sin(-${angle}^{\\circ}))`,
              `-${r}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})`,
            ],
            [
              `**Step 1: Write 1 in polar form.** The number $1$ is $1(\\cos 0^{\\circ} + i\\sin 0^{\\circ})$.\n\n**Step 2: Use the quotient rule.** Divide the moduli and subtract the arguments. The modulus is $${frac(1, r)}$, and the argument is $0^{\\circ} - ${angle}^{\\circ} = -${angle}^{\\circ}$.\n\n**Check.** Multiply the number by the answer. The moduli give $${r} \\cdot ${frac(1, r)} = 1$, and the arguments give $${angle}^{\\circ} + (-${angle}^{\\circ}) = 0^{\\circ}$. The product is $1$, as a reciprocal must give.`,
              `**第一步：把 1 写成极坐标形式。** 数 $1$ 是 $1(\\cos 0^{\\circ} + i\\sin 0^{\\circ})$。\n\n**第二步：用商的法则。** 模相除，辐角相减。模是 $${frac(1, r)}$，辐角是 $0^{\\circ} - ${angle}^{\\circ} = -${angle}^{\\circ}$。\n\n**检验。** 用这个数乘以答案。模得 $${r} \\cdot ${frac(1, r)} = 1$，辐角得 $${angle}^{\\circ} + (-${angle}^{\\circ}) = 0^{\\circ}$。积是 $1$，正是倒数应有的结果。`,
            ],
          ),
          [
            [
              `$${frac(1, r)}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})$`,
              `The modulus is inverted, but the argument must change sign: dividing 1 by the number subtracts $${angle}^{\\circ}$ from $0^{\\circ}$.`,
              `模取了倒数，但辐角也要变号：用 1 除以这个数，是从 $0^{\\circ}$ 中减去 $${angle}^{\\circ}$。`,
            ],
            [
              `$${r}(\\cos(-${angle}^{\\circ}) + i\\sin(-${angle}^{\\circ}))$`,
              `This is the conjugate: the argument changes sign, but the modulus must be inverted to $${frac(1, r)}$.`,
              `这是共轭：辐角变了号，但模还要取倒数，变为 $${frac(1, r)}$。`,
            ],
            [
              `$-${r}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})$`,
              "This is the negative of the number, which points the opposite way, not its reciprocal.",
              "这是这个数的相反数，方向正好相反，不是它的倒数。",
            ],
          ],
        );
      },
    ),
  ],
  "the-cis-notation": [
    {
      ...skill(
        "the-power-that-returns-to-one",
        ["The power that returns to one", "回到 1 的幂"],
        [
          "Powers of $\\text{cis}\\,\\theta$ walk around the unit circle by steps of $\\theta$. The power first equals 1 when the steps add up to a whole number of full turns.\n\nFor example, for $\\text{cis}\\,150^{\\circ}$ the steps must add up to a multiple of $360^{\\circ}$. In lowest terms $\\frac{150}{360} = \\frac{5}{12}$, so the smallest power is $n = 12$. Check: $12 \\times 150 = 1800 = 5 \\times 360$, five full turns.\n\n> **Watch out.** The answer is not $360$ divided by the step, which need not be a whole number: $360 \\div 150$ is not whole. Reduce the fraction of a turn first, and its denominator is the answer.",
          "$\\text{cis}\\,\\theta$ 的幂沿单位圆按步长 $\\theta$ 前进。步长累计达到整数圈时，幂第一次等于 1。\n\n例如，对 $\\text{cis}\\,150^{\\circ}$，步长之和必须是 $360^{\\circ}$ 的倍数。约成最简分数 $\\frac{150}{360} = \\frac{5}{12}$，所以最小的幂是 $n = 12$。检验：$12 \\times 150 = 1800 = 5 \\times 360$，正好五整圈。\n\n> **注意。** 答案不是 $360$ 除以步长，那不一定是整数：$360 \\div 150$ 就不是整数。先把占一圈的分数约到最简，它的分母就是答案。",
        ],
        (rng) => {
          const angle = rng.int(1, 35) * 5;
          const g = gcd(angle, 360);
          const n = 360 / g;
          const turns = angle / g;
          return whole(
            [
              `What is the smallest positive integer $n$ with $(\\text{cis}\\,${angle}^{\\circ})^{n} = 1$?`,
              `使 $(\\text{cis}\\,${angle}^{\\circ})^{n} = 1$ 的最小正整数 $n$ 是多少？`,
            ],
            n,
            [n * 2, angle, 360 - angle],
            [
              `**Step 1: Turn the condition into whole turns.** Each power turns a further $${angle}^{\\circ}$, and the power is $1$ exactly when $n \\times ${angle}$ is a multiple of $360$.\n\n**Step 2: Reduce the fraction of a turn.** In lowest terms\n\n$$\\frac{${angle}}{360} = ${frac(turns, n)}$$\n\nSo $n$ must be a multiple of $${n}$, and the smallest is $n = ${n}$.\n\n**Check.** With $n = ${n}$ the total turn is $${n} \\times ${angle} = ${n * angle}$, which is $${turns}$ full turn${turns === 1 ? "" : "s"}. Since $${turns}$ and $${n}$ share no factor, no smaller $n$ gives whole turns.`,
              `**第一步：把条件化为整圈。** 每多一次幂就再转 $${angle}^{\\circ}$，当且仅当 $n \\times ${angle}$ 是 $360$ 的倍数时幂等于 $1$。\n\n**第二步：约简占一圈的分数。** 化成最简分数：\n\n$$\\frac{${angle}}{360} = ${frac(turns, n)}$$\n\n所以 $n$ 必须是 $${n}$ 的倍数，最小的是 $n = ${n}$。\n\n**检验。** 取 $n = ${n}$，总共转了 $${n} \\times ${angle} = ${n * angle}$，即 $${turns}$ 整圈。因为 $${turns}$ 与 $${n}$ 没有公因数，更小的 $n$ 都转不成整圈。`,
            ],
          );
        },
      ),
      figure: precalculusDrawings3["the-cis-notation#the-power-that-returns-to-one"],
    },
  ],
  "approximating-values-using-the-binomial-theorem": [
    skill(
      "the-size-of-the-next-term",
      ["The size of the next term", "下一项的大小"],
      [
        "When $x$ is small, each term of $(1 + x)^{n}$ is much smaller than the one before. So the first term left out tells how far off the approximation is likely to be.\n\nFor $1.02^{5}$, the first two terms give $1 + 5(0.02) = 1.1$. The first term left out is\n\n$$\\binom{5}{2}(0.02)^{2} = 10 \\times 0.0004 = 0.004$$\n\nCheck: $1.02^{5} = 1.1040808\\ldots$, which is $0.00408\\ldots$ above $1.1$, close to $0.004$.\n\n> **Watch out.** The term left out is $\\binom{n}{2}x^{2}$, with the coefficient $\\binom{n}{2} = \\frac{n(n - 1)}{2}$, not $n^{2}$. It is positive even when $x$ is negative, and $(0.0k)^{2}$ has four decimal places: $0.03^{2} = 0.0009$, not $0.009$.",
        "$x$ 很小时，$(1 + x)^{n}$ 的每一项都比前一项小得多。所以舍去的第一项说明近似值大约差多少。\n\n对 $1.02^{5}$，前两项给出 $1 + 5(0.02) = 1.1$。舍去的第一项是\n\n$$\\binom{5}{2}(0.02)^{2} = 10 \\times 0.0004 = 0.004$$\n\n检验：$1.02^{5} = 1.1040808\\ldots$，比 $1.1$ 大 $0.00408\\ldots$，与 $0.004$ 很接近。\n\n> **注意。** 舍去的项是 $\\binom{n}{2}x^{2}$，系数是 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$，不是 $n^{2}$。即使 $x$ 是负数，这一项也是正的；而且 $(0.0k)^{2}$ 有四位小数：$0.03^{2} = 0.0009$，不是 $0.009$。",
      ],
      (rng) => {
        const k = rng.int(1, 5);
        const n = rng.int(3, 12);
        const minus = rng.bool();
        const base = minus ? 100 - k : 100 + k;
        const term = (n * (n - 1) * k * k) / 2;
        const shown = `${Math.floor(base / 100)}.${String(base % 100).padStart(2, "0")}`;
        const x = `${minus ? "-" : ""}0.0${k}`;
        const sign = minus ? "-" : "+";
        const pairs = (n * (n - 1)) / 2;
        const square = String((k * k) / 10000);
        const answer = String(term / 10000);
        const second = String((n * k) / 100);
        const ratio = String(((n - 1) * k) / 200);
        return decimal(
          [
            `$${shown}^{${n}}$ is approximated by the first two terms of a binomial expansion. What is the first term left out?`,
            `用二项展开式的前两项近似 $${shown}^{${n}}$。舍去的第一项是多少？`,
          ],
          Q.of(term, 10000),
          [Q.of(n * k, 100), Q.of(n * n * k * k, 10000), Q.of(term, 1000)],
          [
            `**Step 1: Write the number as one plus a small part.** $${shown} = 1 ${sign} 0.0${k}$, so the expansion is\n\n$$${minus ? `(1 + (${x}))` : `(1 + ${x})`}^{${n}} = 1 ${sign} \\binom{${n}}{1}(0.0${k}) + \\binom{${n}}{2}(0.0${k})^{2} ${sign} \\cdots$$\n\n**Step 2: Find the first term left out.** The first two terms are $1 ${sign} ${second}$, so the next one is $\\binom{${n}}{2}(${x})^{2}$. The square makes it positive.\n\n**Step 3: Compute it.**\n\n$$\\binom{${n}}{2}(0.0${k})^{2} = \\frac{${n} \\times ${n - 1}}{2} \\times ${square} = ${pairs} \\times ${square} = ${answer}$$\n\n**Check.** Going from the term in $x$ to the term in $x^{2}$ multiplies the size by $\\frac{${n - 1}}{2} \\times 0.0${k} = ${ratio}$. Starting from the second term $${second}$:\n\n$$${second} \\times ${ratio} = ${answer}$$`,
            `**第一步：把这个数写成 1 加一个小量。** $${shown} = 1 ${sign} 0.0${k}$，所以展开式是\n\n$$${minus ? `(1 + (${x}))` : `(1 + ${x})`}^{${n}} = 1 ${sign} \\binom{${n}}{1}(0.0${k}) + \\binom{${n}}{2}(0.0${k})^{2} ${sign} \\cdots$$\n\n**第二步：找出舍去的第一项。** 前两项是 $1 ${sign} ${second}$，所以下一项是 $\\binom{${n}}{2}(${x})^{2}$。平方使它为正。\n\n**第三步：计算。**\n\n$$\\binom{${n}}{2}(0.0${k})^{2} = \\frac{${n} \\times ${n - 1}}{2} \\times ${square} = ${pairs} \\times ${square} = ${answer}$$\n\n**检验。** 从含 $x$ 的项到含 $x^{2}$ 的项，大小乘以 $\\frac{${n - 1}}{2} \\times 0.0${k} = ${ratio}$。从第二项 $${second}$ 出发：\n\n$$${second} \\times ${ratio} = ${answer}$$`,
          ],
        );
      },
    ),
  ],
  "the-standard-normal-distribution": [
    skill(
      "a-symmetric-interval",
      ["A symmetric interval", "对称区间"],
      [
        "The curve is symmetric about 0, so each tail beyond $\\pm z$ has probability $1 - \\Phi(z)$. Removing both tails gives $P(-z < Z < z) = 2\\Phi(z) - 1$.\n\nWith $\\Phi(1.96) = 0.975$, each tail is $1 - 0.975 = 0.025$, so $P(-1.96 < Z < 1.96) = 1 - 2(0.025) = 0.95$.\n\nCheck: $2\\Phi(1.96) - 1 = 2(0.975) - 1 = 0.95$.\n\n> **Watch out.** $\\Phi(z)$ by itself still includes the left tail, and $1 - \\Phi(z)$ is only one tail. Remove both tails from the whole area.",
        "曲线关于 0 对称，所以 $\\pm z$ 之外的每个尾部的概率是 $1 - \\Phi(z)$。去掉两个尾部，得 $P(-z < Z < z) = 2\\Phi(z) - 1$。\n\n由 $\\Phi(1.96) = 0.975$，每个尾部是 $1 - 0.975 = 0.025$，所以 $P(-1.96 < Z < 1.96) = 1 - 2(0.025) = 0.95$。\n\n检验：$2\\Phi(1.96) - 1 = 2(0.975) - 1 = 0.95$。\n\n> **注意。** $\\Phi(z)$ 本身还包括左边的尾部，$1 - \\Phi(z)$ 只是一个尾部。要从全部面积中去掉两个尾部。",
      ],
      (rng) => {
        const [z, v] = rng.pick(standardNormal);
        const phi = v / 10000;
        const tail = (10000 - v) / 10000;
        const answer = (2 * v - 10000) / 10000;
        return numberProblem({
          prompt: t(
            `$Z \\sim N(0, 1)$ and $\\Phi(${z}) = ${phi}$. Find $P(-${z} < Z < ${z})$.`,
            `$Z \\sim N(0, 1)$，$\\Phi(${z}) = ${phi}$。求 $P(-${z} < Z < ${z})$。`,
          ),
          answer: Q.of(2 * v - 10000, 10000),
          form: "decimal",
          mistakes: [
            why(
              Q.of(v, 10000),
              `This is $\\Phi(${z})$, everything below $${z}$; it still includes the tail below $-${z}$.`,
              `这是 $\\Phi(${z})$，即 $${z}$ 以下的全部；它还包括 $-${z}$ 以下的尾部。`,
            ),
            why(
              Q.of(10000 - v, 10000),
              `This is one tail, beyond $${z}$, not the middle part.`,
              `这是 $${z}$ 之外的一个尾部，不是中间部分。`,
            ),
            why(
              Q.of(2 * (10000 - v), 10000),
              "This is both tails together, the part outside the interval.",
              "这是两个尾部之和，即区间之外的部分。",
            ),
          ],
          solution: t(
            `**Step 1: Find one tail.** By symmetry the tails beyond $-${z}$ and $${z}$ are equal, each\n\n$$1 - \\Phi(${z}) = 1 - ${phi} = ${tail}$$\n\n**Step 2: Remove both tails.**\n\n$$P(-${z} < Z < ${z}) = 1 - 2(${tail}) = ${answer}$$\n\n**Check.** By the formula for a symmetric interval:\n\n$$2\\Phi(${z}) - 1 = 2 \\times ${phi} - 1 = ${answer}$$`,
            `**第一步：求一个尾部。**由对称性，$-${z}$ 和 $${z}$ 之外的两个尾部相等，各为\n\n$$1 - \\Phi(${z}) = 1 - ${phi} = ${tail}$$\n\n**第二步：去掉两个尾部。**\n\n$$P(-${z} < Z < ${z}) = 1 - 2(${tail}) = ${answer}$$\n\n**检验。**用对称区间的公式：\n\n$$2\\Phi(${z}) - 1 = 2 \\times ${phi} - 1 = ${answer}$$`,
          ),
        });
      },
    ),
  ],
};
