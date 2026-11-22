// A third knowledge point for the Precalculus topics on conics, parametric curves, polar coordinates and complex numbers.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
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
        "A point lies on a parametric curve when one value of $t$ gives both of its coordinates. So solve one equation for $t$, and check that value in the other.",
        "一个点在参数曲线上，当且仅当同一个 $t$ 值给出它的两个坐标。所以由一个方程解出 $t$，再代入另一个方程检验。",
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
            `$${p}t${linear(q, "")} = ${x}$ gives $t = ${t}$, and $y$ agrees. The $y$ equation alone would also allow $t = ${-t}$.`,
            `由 $${p}t${linear(q, "")} = ${x}$ 得 $t = ${t}$，$y$ 也符合。只看 $y$ 的方程还会得到 $t = ${-t}$。`,
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
        "When both coordinates change at steady rates, the curve is a line. Its slope is the change in $y$ per unit of $t$ divided by the change in $x$ per unit of $t$.",
        "两个坐标都匀速变化时，曲线是直线。它的斜率是每单位 $t$ 的 $y$ 变化量除以每单位 $t$ 的 $x$ 变化量。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let c = size(rng, 12);
        if (Math.abs(c) === a) c += c < 0 ? -1 : 1;
        const b = rng.int(-9, 9);
        const d = rng.int(-9, 9);
        return fraction(
          [
            `What is the slope of the line $x = ${a}t${linear(b, "")}$, $y = ${c}t${linear(d, "")}$?`,
            `直线 $x = ${a}t${linear(b, "")}$，$y = ${c}t${linear(d, "")}$ 的斜率是多少？`,
          ],
          Q.of(c, a),
          [Q.of(a, c), Q.of(-c, a), Q.of(d - b === 0 ? c + 1 : d - b, a)],
          [
            `$y$ changes by ${c} while $x$ changes by ${a}, so the slope is $${Q.of(c, a).toLatex()}$.`,
            `$x$ 变化 ${a} 时 $y$ 变化 ${c}，所以斜率是 $${Q.of(c, a).toLatex()}$。`,
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
        "A range for $t$ can remove solutions that the equations alone would allow. So after solving for $t$, keep only the values inside the range, and then find the coordinate.",
        "$t$ 的范围可能排除方程本身允许的解。所以解出 $t$ 后，只保留范围内的值，再求坐标。",
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
            `$x = 0$ gives $t = \\pm ${n}$, and only $t = ${n}$ is allowed, so $y = ${a * n + b}$.`,
            `$x = 0$ 得 $t = \\pm ${n}$，只有 $t = ${n}$ 在范围内，所以 $y = ${a * n + b}$。`,
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
        "With $x = r\\cos kt$ and $y = r\\sin kt$, the point goes around the circle $k$ times as $t$ runs from 0 to $2\\pi$. The distance traveled is therefore $k$ circumferences, while the curve itself stays one circle.",
        "$x = r\\cos kt$，$y = r\\sin kt$ 时，$t$ 从 0 到 $2\\pi$，点绕圆走 $k$ 圈。所以路程是 $k$ 个周长，而曲线本身仍是一个圆。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const k = rng.int(2, 6);
        const h = rng.int(-6, 6);
        const c = rng.int(-6, 6);
        return chooseFilled(
          rng,
          [
            `A point moves by $x = ${shifted(h, r, `\\cos ${k}t`)}$, $y = ${shifted(c, r, `\\sin ${k}t`)}$ for $0 \\le t \\le 2\\pi$. How far does it travel?`,
            `点按 $x = ${shifted(h, r, `\\cos ${k}t`)}$，$y = ${shifted(c, r, `\\sin ${k}t`)}$ 运动，$0 \\le t \\le 2\\pi$。它走了多远？`,
          ],
          `${2 * r * k}\\pi`,
          [`${2 * r}\\pi`, `${r * k}\\pi`, `${r * r * k}\\pi`],
          [`It goes around ${k} times, each lap being $${2 * r}\\pi$ long.`, `它绕 ${k} 圈，每圈长 $${2 * r}\\pi$。`],
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
          "In $x = h + a\\cos\\theta$, $y = k + b\\sin\\theta$, the parameter is not the angle seen from the center in general. Its values at quarter turns still give the four ends of the axes.",
          "在 $x = h + a\\cos\\theta$，$y = k + b\\sin\\theta$ 中，参数一般不是从中心看到的角。但它在四分之一圈处的值仍给出两条轴的四个端点。",
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
          return chooseFilled(
            rng,
            [
              `Find the point at $\\theta = ${row[0]}$ on $x = ${shifted(h, a, "\\cos\\theta")}$, $y = ${shifted(k, b, "\\sin\\theta")}$.`,
              `求 $x = ${shifted(h, a, "\\cos\\theta")}$，$y = ${shifted(k, b, "\\sin\\theta")}$ 上 $\\theta = ${row[0]}$ 对应的点。`,
            ],
            `(${x}, ${y})`,
            [`(${h + b * row[1]}, ${k + a * row[2]})`, `(${h + a * row[2]}, ${k + b * row[1]})`, `(${h}, ${k})`],
            [
              `$\\cos\\theta = ${row[1]}$ and $\\sin\\theta = ${row[2]}$, which gives $(${x}, ${y})$.`,
              `$\\cos\\theta = ${row[1]}$，$\\sin\\theta = ${row[2]}$，所以是 $(${x}, ${y})$。`,
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
        "In $x = pt + h$, $y = at^{2} + k$, the value of $y$ turns around at $t = 0$. So the vertex is the point at $t = 0$, which can be read directly from the constants.",
        "在 $x = pt + h$，$y = at^{2} + k$ 中，$y$ 在 $t = 0$ 处转向。所以顶点就是 $t = 0$ 对应的点，可以直接从常数读出。",
      ],
      (rng) => {
        const p = rng.int(2, 9);
        const a = rng.int(2, 6);
        const h = size(rng, 12);
        const k = size(rng, 12);
        return chooseFilled(
          rng,
          [
            `Find the vertex of the parabola $x = ${p}t${linear(h, "")}$, $y = ${a}t^{2}${linear(k, "")}$.`,
            `求抛物线 $x = ${p}t${linear(h, "")}$，$y = ${a}t^{2}${linear(k, "")}$ 的顶点。`,
          ],
          `(${h}, ${k})`,
          [`(${k}, ${h})`, `(${p + h}, ${a + k})`, `(${-h}, ${k})`],
          [`The vertex comes at $t = 0$, where $x = ${h}$ and $y = ${k}$.`, `顶点在 $t = 0$ 处，此时 $x = ${h}$，$y = ${k}$。`],
        );
      },
    ),
  ],
  "parametric-equations-of-horizontal-hyperbolas": [
    skill(
      "vertices-from-the-secant-form",
      ["Vertices from the secant form", "由正割形式求顶点"],
      [
        "In $x = h + a\\sec\\theta$, $y = k + b\\tan\\theta$, the vertices occur where $\\tan\\theta = 0$, so $\\sec\\theta = \\pm 1$. They lie $a$ to the left and right of the center.",
        "在 $x = h + a\\sec\\theta$，$y = k + b\\tan\\theta$ 中，顶点在 $\\tan\\theta = 0$ 处，此时 $\\sec\\theta = \\pm 1$。它们在中心左右各 $a$ 处。",
      ],
      (rng) => {
        const h = rng.int(-9, 9);
        const k = rng.int(-9, 9);
        const a = rng.int(2, 12);
        let b = rng.int(2, 12);
        if (b === a) b += 1;
        return chooseFilled(
          rng,
          [
            `Find the vertices of the hyperbola $x = ${shifted(h, a, "\\sec\\theta")}$, $y = ${shifted(k, b, "\\tan\\theta")}$.`,
            `求双曲线 $x = ${shifted(h, a, "\\sec\\theta")}$，$y = ${shifted(k, b, "\\tan\\theta")}$ 的顶点。`,
          ],
          `(${h - a}, ${k}), (${h + a}, ${k})`,
          [`(${h}, ${k - a}), (${h}, ${k + a})`, `(${h - b}, ${k}), (${h + b}, ${k})`, `(${h}, ${k - b}), (${h}, ${k + b})`],
          [
            `At $\\tan\\theta = 0$ we have $\\sec\\theta = \\pm 1$, so $x = ${h} \\pm ${a}$ and $y = ${k}$.`,
            `$\\tan\\theta = 0$ 时 $\\sec\\theta = \\pm 1$，所以 $x = ${h} \\pm ${a}$，$y = ${k}$。`,
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
          "To find where a curve starts, put the parameter value into both equations. With a tangent in $x$ and a secant in $y$, the value $\\theta = 0$ gives the upper vertex, which sits directly above the center.",
          "在 $x = h + b\\tan\\theta$，$y = k + a\\sec\\theta$ 中，令 $\\theta = 0$，得 $\\tan\\theta = 0$，$\\sec\\theta = 1$。这是上顶点，在中心的正上方。",
        ],
        (rng) => {
          const h = rng.int(-9, 9);
          const k = rng.int(-9, 9);
          const a = rng.int(2, 12);
          let b = rng.int(2, 12);
          if (b === a) b += 1;
          return chooseFilled(
            rng,
            [
              `Find the point at $\\theta = 0$ on $x = ${shifted(h, b, "\\tan\\theta")}$, $y = ${shifted(k, a, "\\sec\\theta")}$.`,
              `求 $x = ${shifted(h, b, "\\tan\\theta")}$，$y = ${shifted(k, a, "\\sec\\theta")}$ 上 $\\theta = 0$ 对应的点。`,
            ],
            `(${h}, ${k + a})`,
            [`(${h + b}, ${k})`, `(${h + b}, ${k + a})`, `(${h}, ${k})`],
            [
              `$\\tan 0 = 0$ and $\\sec 0 = 1$, so $x = ${h}$ and $y = ${k + a}$.`,
              `$\\tan 0 = 0$，$\\sec 0 = 1$，所以 $x = ${h}$，$y = ${k + a}$。`,
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
          "Points with the same angle lie on one ray, and points half a turn apart lie on opposite rays. Points a quarter turn apart form a right triangle with the pole, so the Pythagorean theorem applies.",
          "角相同的点在同一条射线上，相差半圈的点在相反的射线上。相差四分之一圈的点与极点构成直角三角形，可用勾股定理。",
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
              mode === 0
                ? `They lie on one ray, so subtract: ${answer}.`
                : mode === 1
                  ? `They lie on opposite rays through the pole, so add: ${answer}.`
                  : `The rays are perpendicular, so $\\sqrt{${a}^{2} + ${b}^{2}} = ${answer}$.`,
              mode === 0
                ? `它们在同一条射线上，所以相减：${answer}。`
                : mode === 1
                  ? `它们在过极点的相反射线上，所以相加：${answer}。`
                  : `两条射线垂直，所以 $\\sqrt{${a}^{2} + ${b}^{2}} = ${answer}$。`,
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
        "Since $x = r\\cos\\theta$ and $y = r\\sin\\theta$, an equation with one of these products is really a line. So $r\\cos\\theta = c$ is vertical and $r\\sin\\theta = c$ is horizontal.",
        "因为 $x = r\\cos\\theta$，$y = r\\sin\\theta$，含这种积的方程其实是直线。所以 $r\\cos\\theta = c$ 是竖直线，$r\\sin\\theta = c$ 是水平线。",
      ],
      (rng) => {
        const c = size(rng, 20);
        const cosine = rng.bool();
        return chooseFilled(
          rng,
          [
            `Write $r\\${cosine ? "cos" : "sin"}\\theta = ${c}$ as a Cartesian equation.`,
            `把 $r\\${cosine ? "cos" : "sin"}\\theta = ${c}$ 写成直角坐标方程。`,
          ],
          `${cosine ? "x" : "y"} = ${c}`,
          [`${cosine ? "y" : "x"} = ${c}`, `x^{2} + y^{2} = ${c * c}`, `y = ${c}x`],
          [
            `$r\\${cosine ? "cos" : "sin"}\\theta$ is exactly $${cosine ? "x" : "y"}$, so this is a ${cosine ? "vertical" : "horizontal"} line.`,
            `$r\\${cosine ? "cos" : "sin"}\\theta$ 正是 $${cosine ? "x" : "y"}$，所以这是一条${cosine ? "竖直" : "水平"}线。`,
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
          "The inequality $a \\le r \\le b$ describes the ring between two circles centered at the pole. Its area is the difference of the two disks, $\\pi(b^{2} - a^{2})$, which is not $\\pi(b - a)^{2}$.",
          "不等式 $a \\le r \\le b$ 表示以极点为圆心的两圆之间的圆环。它的面积是两个圆面积之差 $\\pi(b^{2} - a^{2})$，不是 $\\pi(b - a)^{2}$。",
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
              `The ring is the outer disk minus the inner disk, so $${b}^{2} - ${a}^{2} = ${b * b - a * a}$.`,
              `圆环是外圆减去内圆，所以 $${b}^{2} - ${a}^{2} = ${b * b - a * a}$。`,
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
          "A radial line extends through the pole in both directions when $r$ may be negative. So $\\theta = \\alpha$ and $\\theta = \\alpha + 180^{\\circ}$ describe the same line.",
          "$r$ 可以为负时，径向直线向两个方向穿过极点。所以 $\\theta = \\alpha$ 和 $\\theta = \\alpha + 180^{\\circ}$ 表示同一条直线。",
        ],
        (rng) => {
          const angle = rng.int(1, 35) * 5;
          const usable = angle === 90 ? 95 : angle;
          return chooseFilled(
            rng,
            [
              `With $r$ allowed to be negative, which equation describes the same line as $\\theta = ${usable}^{\\circ}$?`,
              `$r$ 可以为负时，哪个方程与 $\\theta = ${usable}^{\\circ}$ 表示同一条直线？`,
            ],
            `\\theta = ${usable + 180}^{\\circ}`,
            [`\\theta = ${usable + 90}^{\\circ}`, `\\theta = ${180 - usable}^{\\circ}`, `\\theta = ${360 - usable}^{\\circ}`],
            [`Adding half a turn gives the opposite ray of the same line.`, `加半圈得到同一条直线上相反的射线。`],
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
          "Setting $a\\cos\\theta = b\\sin\\theta$ gives $\\tan\\theta = \\frac{a}{b}$, and a right triangle then gives the cosine. Substituting back gives the distance from the pole to the intersection.",
          "令 $a\\cos\\theta = b\\sin\\theta$，得 $\\tan\\theta = \\frac{a}{b}$，再由直角三角形得到余弦。代回去就得到交点到极点的距离。",
        ],
        (rng) => {
          const [a, b, c] = rng.pick(triples);
          const k = rng.int(1, 5);
          return fraction(
            [
              `The curves $r = ${k * a}\\cos\\theta$ and $r = ${k * b}\\sin\\theta$ meet at a point with $0 < \\theta < \\frac{\\pi}{2}$. What is $r$ there?`,
              `曲线 $r = ${k * a}\\cos\\theta$ 和 $r = ${k * b}\\sin\\theta$ 在 $0 < \\theta < \\frac{\\pi}{2}$ 处相交。这一点的 $r$ 是多少？`,
            ],
            Q.of(k * a * b, c),
            [Q.of(k * c), Q.of(k * (a + b), 2), Q.of(c, k * a * b)],
            [
              `$\\tan\\theta = ${frac(a, b)}$ gives $\\cos\\theta = ${frac(b, c)}$, so $r = ${k * a} \\cdot ${frac(b, c)}$.`,
              `$\\tan\\theta = ${frac(a, b)}$ 给出 $\\cos\\theta = ${frac(b, c)}$，所以 $r = ${k * a} \\cdot ${frac(b, c)}$。`,
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
        "An equation with both $z$ and $\\bar{z}$ cannot be solved by moving terms around. Write $z = x + yi$ and match the real and imaginary parts, which gives two ordinary equations.",
        "同时含 $z$ 和 $\\bar{z}$ 的方程，不能靠移项解。令 $z = x + yi$，比较实部和虚部，得到两个普通方程。",
      ],
      (rng) => {
        const k = rng.int(2, 5);
        const x = size(rng, 9);
        const y = size(rng, 9);
        const re = (1 + k) * x;
        const im = (1 - k) * y;
        return chooseFilled(
          rng,
          [`Solve $z + ${k}\\bar{z} = ${complex(re, im)}$.`, `解方程 $z + ${k}\\bar{z} = ${complex(re, im)}$。`],
          `z = ${complex(x, y)}`,
          [`z = ${complex(x, -y)}`, `z = ${complex(-x, y)}`, `z = ${complex(re, im)}`],
          [
            `$z + ${k}\\bar{z} = ${1 + k}x ${k === 2 ? "-" : `- ${k - 1}`}${k === 2 ? " " : ""}yi$, so $x = ${x}$ and $y = ${y}$.`,
            `$z + ${k}\\bar{z} = ${1 + k}x ${k === 2 ? "-" : `- ${k - 1}`}${k === 2 ? " " : ""}yi$，所以 $x = ${x}$，$y = ${y}$。`,
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
        "A polynomial with real coefficients has its complex roots in conjugate pairs. So one root of a real quadratic gives the other, and then the sum and product of the roots give the coefficients.",
        "实系数多项式的复数根成共轭对出现。所以实系数二次方程的一个根给出另一个根，由根的和与积得到系数。",
      ],
      (rng) => {
        const a = size(rng, 9);
        const b = rng.int(1, 9);
        const askP = rng.bool();
        return integer(
          [
            `The equation $x^{2} + px + q = 0$ has real $p$ and $q$, and one root is $${complex(a, b)}$. What is $${askP ? "p" : "q"}$?`,
            `方程 $x^{2} + px + q = 0$ 中 $p$、$q$ 是实数，一个根是 $${complex(a, b)}$。$${askP ? "p" : "q"}$ 是多少？`,
          ],
          askP ? -2 * a : a * a + b * b,
          askP ? [2 * a, a, a * a + b * b] : [a * a - b * b, -2 * a, a * a + b],
          [
            `The other root is $${complex(a, -b)}$. The sum is ${2 * a}, so $p = ${-2 * a}$, and the product is $${paren(a)}^{2} + ${b}^{2}$, so $q = ${a * a + b * b}$.`,
            `另一个根是 $${complex(a, -b)}$。和是 ${2 * a}，所以 $p = ${-2 * a}$；积是 $${paren(a)}^{2} + ${b}^{2}$，所以 $q = ${a * a + b * b}$。`,
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
        "To divide by a pure imaginary number, multiply the top and bottom by $i$, because $i \\cdot i = -1$ makes the bottom real. The real and imaginary parts swap, and one sign changes.",
        "除以纯虚数时，分子分母同乘 $i$，因为 $i \\cdot i = -1$ 使分母成为实数。实部和虚部互换，其中一个变号。",
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
            [complex(-n, m), complex(m, n), complex(n, m)],
            [
              `Multiplying the top and bottom by $i$ makes the bottom ${-k}, and dividing gives $${complex(n, -m)}$.`,
              `分子分母同乘 $i$，分母变成 ${-k}，相除得 $${complex(n, -m)}$。`,
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
        "Since $(ax + bi)(ax - bi) = a^{2}x^{2} + b^{2}$, any sum of two squares factors over the complex numbers. So first write each term as a square, and then use conjugate factors.",
        "因为 $(ax + bi)(ax - bi) = a^{2}x^{2} + b^{2}$，任何两个平方的和都能在复数范围内分解。所以先把每一项写成平方，再用共轭因式。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        return chooseFilled(
          rng,
          [`Factor $${a * a}x^{2} + ${b * b}$ over the complex numbers.`, `在复数范围内分解 $${a * a}x^{2} + ${b * b}$。`],
          `(${a}x + ${b}i)(${a}x - ${b}i)`,
          [`(${a}x + ${b})(${a}x - ${b})`, `(${a}x + ${b}i)^{2}`, `(x + ${b}i)(${a * a}x - ${b}i)`],
          [`The terms are $(${a}x)^{2}$ and $${b}^{2}$, which take conjugate factors.`, `两项是 $(${a}x)^{2}$ 和 $${b}^{2}$，用共轭因式。`],
        );
      },
    ),
  ],
  "products-of-complex-numbers-expressed-in-polar-form": [
    skill(
      "powers-in-polar-form",
      ["Powers in polar form", "极坐标形式的幂"],
      [
        "A power is a repeated product, so the modulus is raised to the power and the argument is multiplied by it. This is de Moivre's theorem, which makes high powers quick.",
        "幂是重复的积，所以模取这个幂，辐角乘这个指数。这就是棣莫弗定理，它让高次幂的计算变得很快。",
      ],
      (rng) => {
        const r = rng.int(2, 5);
        const n = rng.int(2, 4);
        const angle = rng.int(1, 16) * 5;
        return chooseFilled(
          rng,
          [
            `Evaluate $\\left[${r}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})\\right]^{${n}}$.`,
            `计算 $\\left[${r}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})\\right]^{${n}}$。`,
          ],
          `${r ** n}(\\cos ${n * angle}^{\\circ} + i\\sin ${n * angle}^{\\circ})`,
          [
            `${r * n}(\\cos ${n * angle}^{\\circ} + i\\sin ${n * angle}^{\\circ})`,
            `${r ** n}(\\cos ${angle}^{\\circ} + i\\sin ${angle}^{\\circ})`,
            `${r ** n}(\\cos ${angle ** 2}^{\\circ} + i\\sin ${angle ** 2}^{\\circ})`,
          ],
          [
            `The modulus is $${r}^{${n}} = ${r ** n}$, and the argument is $${n} \\times ${angle}^{\\circ}$.`,
            `模是 $${r}^{${n}} = ${r ** n}$，辐角是 $${n} \\times ${angle}^{\\circ}$。`,
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
        "The number 1 has modulus 1 and argument 0, so the quotient rule gives the reciprocal at once. The modulus is inverted, and the argument changes sign.",
        "数 1 的模是 1，辐角是 0，所以由商的法则立刻得到倒数。模取倒数，辐角变号。",
      ],
      (rng) => {
        const r = rng.int(2, 12);
        const angle = rng.int(1, 35) * 5;
        return chooseFilled(
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
            `Invert the modulus to $${frac(1, r)}$, and change the argument to $-${angle}^{\\circ}$.`,
            `模取倒数得 $${frac(1, r)}$，辐角变为 $-${angle}^{\\circ}$。`,
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
          "Powers of $\\text{cis}\\,\\theta$ walk around the unit circle by steps of $\\theta$. The power first equals 1 when the steps add up to a whole number of full turns.",
          "$\\text{cis}\\,\\theta$ 的幂沿单位圆按步长 $\\theta$ 前进。步长累计达到整数圈时，幂第一次等于 1。",
        ],
        (rng) => {
          const angle = rng.int(1, 35) * 5;
          const n = 360 / gcd(angle, 360);
          return whole(
            [
              `What is the smallest positive integer $n$ with $(\\text{cis}\\,${angle}^{\\circ})^{n} = 1$?`,
              `使 $(\\text{cis}\\,${angle}^{\\circ})^{n} = 1$ 的最小正整数 $n$ 是多少？`,
            ],
            n,
            [n * 2, angle, 360 - angle],
            [
              `$n \\times ${angle}$ must be a multiple of $360$, which first happens at $n = ${n}$.`,
              `$n \\times ${angle}$ 必须是 $360$ 的倍数，第一次是在 $n = ${n}$ 时。`,
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
        "When $x$ is small, each term of $(1 + x)^{n}$ is much smaller than the one before. So the first term left out tells how far off the approximation is likely to be.",
        "$x$ 很小时，$(1 + x)^{n}$ 的每一项都比前一项小得多。所以舍去的第一项说明近似值大约差多少。",
      ],
      (rng) => {
        const k = rng.int(1, 5);
        const n = rng.int(3, 12);
        const minus = rng.bool();
        const base = minus ? 100 - k : 100 + k;
        const term = (n * (n - 1) * k * k) / 2;
        const shown = `${Math.floor(base / 100)}.${String(base % 100).padStart(2, "0")}`;
        return decimal(
          [
            `$${shown}^{${n}}$ is approximated by the first two terms of a binomial expansion. What is the first term left out?`,
            `用二项展开式的前两项近似 $${shown}^{${n}}$。舍去的第一项是多少？`,
          ],
          Q.of(term, 10000),
          [Q.of(n * k, 100), Q.of(n * n * k * k, 10000), Q.of(term, 1000)],
          [
            `It is $\\binom{${n}}{2}(0.0${k})^{2}$, which is positive for either sign of the small part.`,
            `它是 $\\binom{${n}}{2}(0.0${k})^{2}$，小量无论正负，这一项都是正的。`,
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
        "The curve is symmetric about 0, so each tail beyond $\\pm z$ has probability $1 - \\Phi(z)$. Removing both tails gives $P(-z < Z < z) = 2\\Phi(z) - 1$.",
        "曲线关于 0 对称，所以 $\\pm z$ 之外的每个尾部的概率是 $1 - \\Phi(z)$。去掉两个尾部，得 $P(-z < Z < z) = 2\\Phi(z) - 1$。",
      ],
      (rng) => {
        const [z, v] = rng.pick(standardNormal);
        return decimal(
          [
            `$Z \\sim N(0, 1)$ and $\\Phi(${z}) = ${v / 10000}$. Find $P(-${z} < Z < ${z})$.`,
            `$Z \\sim N(0, 1)$，$\\Phi(${z}) = ${v / 10000}$。求 $P(-${z} < Z < ${z})$。`,
          ],
          Q.of(2 * v - 10000, 10000),
          [Q.of(v, 10000), Q.of(10000 - v, 10000), Q.of(2 * (10000 - v), 10000)],
          [`$2 \\times ${v / 10000} - 1 = ${(2 * v - 10000) / 10000}$.`, `$2 \\times ${v / 10000} - 1 = ${(2 * v - 10000) / 10000}$。`],
        );
      },
    ),
  ],
};
