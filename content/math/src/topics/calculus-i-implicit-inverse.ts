import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { functionProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { fracL, type Poly, pAt, par, pDer, pLatex, power, range, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 5: Advanced Differentiation, modules 5.12 and 5.13.

/** dydx is the prefix of an answer for dy/dx. */
const dydx = "\\frac{dy}{dx} =";

/** Step is one labelled step of a solution: its title in both languages, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** fmt writes a value rounded to three decimal places, without trailing zeros. */
const fmt = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** fmt4 writes a value rounded to four decimal places, without trailing zeros. */
const fmt4 = (v: number) => dec(Q.of(Math.round(v * 10000) || 0, 10000));

/** approxTo writes "= 5" for a whole number and "\approx 2.718" otherwise. */
const approxTo = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? `= ${Math.round(v) || 0}` : `\\approx ${fmt(v)}`);

/** exactly writes an exact value, followed by its decimal when it is not a whole number. */
const exactly = (q: Q) => (q.isInteger() ? q.toLatex() : `${q.toLatex()} \\approx ${fmt(q.toNumber())}`);

/** slopeCheck compares a derivative from the rules with difference quotients at one point, with h = 0.01 on each side; exact writes the rules' value when it is not to be rounded. */
function slopeCheck(f: (x: number) => number, slope: number, a: number, at = fmt(a), name = "f", exact?: string): Text {
  const q = (h: number) => (f(a + h) - f(a)) / h;
  const row = `\\frac{${name}(${at} + h) - ${name}(${at})}{h}`;
  const tab = table(["$h$", "$0.01$", "$-0.01$"], [`$${row}$`, `$${fmt(q(0.01))}$`, `$${fmt(q(-0.01))}$`]);
  const mean = (q(0.01) + q(-0.01)) / 2;
  const value = exact === undefined ? approxTo(slope) : `= ${exact}`;
  return t(
    `Compute difference quotients of $${name}$ at $x = ${at}$, with $h = 0.01$ on each side:\n\n${tab}\n\nTheir average is $${fmt(mean)}$, and the rules give $${name}'(${at}) ${value}$.`,
    `计算 $${name}$ 在 $x = ${at}$ 处的差商，两侧各取 $h = 0.01$：\n\n${tab}\n\n它们的平均值是 $${fmt(mean)}$，而求导法则给出 $${name}'(${at}) ${value}$。`,
  );
}

/** solveNear solves F(x, y) = 0 for y by Newton's method, starting from y0. */
function solveNear(F: (x: number, y: number) => number, x: number, y0: number): number {
  let y = y0;
  for (let i = 0; i < 60; i++) {
    const slope = (F(x, y + 1e-7) - F(x, y - 1e-7)) / 2e-7;
    const step = F(x, y) / slope;
    y -= step;
    if (Math.abs(step) < 1e-13) break;
  }
  return y;
}

/** curveCheck solves the curve F(x, y) = 0 for y near (x0, y0) at x0 − 0.01 and x0 + 0.01, and compares the chord's slope with the slope m from differentiation. */
function curveCheck(F: (x: number, y: number) => number, x0: number, y0: number, m: Q): Text {
  const lo = solveNear(F, x0 - 0.01, y0);
  const hi = solveNear(F, x0 + 0.01, y0);
  const tab = table(["$x$", `$${fmt(x0 - 0.01)}$`, `$${fmt(x0 + 0.01)}$`], ["$y$", `$${fmt4(lo)}$`, `$${fmt4(hi)}$`]);
  const chord = fmt((hi - lo) / 0.02);
  return t(
    `Without differentiating, solve the equation for $y$ near $(${x0}, ${y0})$, just left and just right of $x = ${x0}$:\n\n${tab}\n\nThe chord between these two points has slope about $${chord}$, and differentiation gave $${exactly(m)}$.`,
    `不求导，在 $(${x0}, ${y0})$ 附近、$x = ${x0}$ 的左右两侧解方程求 $y$：\n\n${tab}\n\n这两点连线的斜率约为 $${chord}$，而求导得到 $${exactly(m)}$。`,
  );
}

/** swapCheck estimates the slope of an inverse at f(a): the points (a ± 0.01, f(a ± 0.01)) of f swap into points of the inverse; m is the slope from the rule. */
function swapCheck(f: (x: number) => number, a: number, m: Q): Text {
  const [lo, hi] = [f(a - 0.01), f(a + 0.01)];
  const tab = table(["$x$", `$${fmt(a - 0.01)}$`, `$${fmt(a + 0.01)}$`], ["$f(x)$", `$${fmt4(lo)}$`, `$${fmt4(hi)}$`]);
  const chord = fmt(0.02 / (hi - lo));
  return t(
    `Swapping the coordinates of points of $f$ gives points of $f^{-1}$. Near $x = ${a}$:\n\n${tab}\n\nSo $f^{-1}$ rises by $0.02$ while its input goes from $${fmt4(lo)}$ to $${fmt4(hi)}$, a slope of about $${chord}$. The rule gave $${exactly(m)}$.`,
    `交换 $f$ 图像上点的坐标，就得到 $f^{-1}$ 图像上的点。在 $x = ${a}$ 附近：\n\n${tab}\n\n所以当 $f^{-1}$ 的输入从 $${fmt4(lo)}$ 变到 $${fmt4(hi)}$ 时，它的值增加 $0.02$，斜率约为 $${chord}$。法则给出的是 $${exactly(m)}$。`,
  );
}

/** dxdyCheck estimates dy/dx on a curve x = x(y) near y0: moving y by ±0.01 moves x, and dy/dx is the ratio; m is the slope from the reciprocal. */
function dxdyCheck(x: (y: number) => number, y0: number, m: Q): Text {
  const [lo, hi] = [x(y0 - 0.01), x(y0 + 0.01)];
  const tab = table(["$y$", `$${fmt(y0 - 0.01)}$`, `$${fmt(y0 + 0.01)}$`], ["$x$", `$${fmt4(lo)}$`, `$${fmt4(hi)}$`]);
  const chord = fmt(0.02 / (hi - lo));
  return t(
    `Move along the curve from $y = ${fmt(y0 - 0.01)}$ to $y = ${fmt(y0 + 0.01)}$ and compute $x$ at each end:\n\n${tab}\n\nThe rise is $0.02$ and the run is $${fmt4(hi - lo)}$, so the chord's slope is about $${chord}$. The reciprocal gave $${exactly(m)}$.`,
    `沿曲线从 $y = ${fmt(y0 - 0.01)}$ 走到 $y = ${fmt(y0 + 0.01)}$，算出两端的 $x$：\n\n${tab}\n\n纵向变化是 $0.02$，横向变化是 $${fmt4(hi - lo)}$，所以连线的斜率约为 $${chord}$。取倒数得到的是 $${exactly(m)}$。`,
  );
}

/** lineCheck checks (f⁻¹)'(b) = 1/m with the tangent line of f at (a, b): solved for x, it is the tangent line of the inverse with x and y swapped. */
function lineCheck(a: number, b: number, m: Q, answer: Q): Text {
  const xa = a === 0 ? "x" : `(${poly([1, "x"], [-a, ""])})`;
  const yb = b === 0 ? "y" : `(${poly([1, "y"], [-b, ""])})`;
  return t(
    `Near $x = ${a}$ the graph of $f$ is close to its tangent line $y = ${poly([m, xa], [b, ""])}$. Solving it for $x$ gives\n\n$$x = ${poly([answer, yb], [a, ""])}.$$\n\nThis is the tangent line of $f^{-1}$ at $${b}$, with the letters swapped, and its slope is $${answer.toLatex()}$.`,
    `在 $x = ${a}$ 附近，$f$ 的图像接近它的切线 $y = ${poly([m, xa], [b, ""])}$。对 $x$ 解出，得\n\n$$x = ${poly([answer, yb], [a, ""])}.$$\n\n这就是 $f^{-1}$ 在 $${b}$ 处的切线，只是字母互换了，它的斜率是 $${answer.toLatex()}$。`,
  );
}

/** frac writes a rational coefficient times a fraction of monomials: "-\\frac{3x}{2y}". */
function frac(c: Q, top: string, bottom: string): string {
  const n = c.n < 0n ? -c.n : c.n;
  const sign = c.sign() < 0 ? "-" : "";
  const num = `${n === 1n && top !== "" ? "" : n}${top}`;
  const den = `${c.d === 1n && bottom !== "" ? "" : c.d}${bottom}`;
  return den === "1" ? `${sign}${num}` : `${sign}\\frac{${num}}{${den}}`;
}

/** reciprocal writes 1/d, simplified when that changes it: "\\frac{1}{-4} = -\\frac{1}{4}". */
const reciprocal = (d: number) => `\\frac{1}{${d}}${d > 1 ? "" : ` = ${Q.of(1, d).toLatex()}`}`;

/** implicitDifferentiation differentiates equations in x and y. */
export const implicitDifferentiation: TopicDef = {
  id: "implicit-differentiation",
  title: t("Implicit Differentiation", "隐函数求导"),
  summary: t(
    "Differentiate both sides of an equation in x and y to find dy/dx, and evaluate it at a point.",
    "对关于 x 和 y 的方程两边求导得到 dy/dx，并计算它在某点处的值。",
  ),
  prerequisites: ["selecting-procedures-for-calculating-derivatives"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.3 },
    { topic: "the-product-rule-for-differentiation", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The chain rule differentiates a power of an inner function: $\\frac{d}{dx}\\left(g(x)\\right)^{2} = 2g(x)g'(x)$. When $y$ is a function of $x$, the same rule gives $\\frac{d}{dx} y^{2} = 2y\\frac{dy}{dx}$, even if $y$ is never written out. For the circle $x^{2} + y^{2} = 25$, differentiating both sides gives

$$2x + 2y\\frac{dy}{dx} = 0, \\quad \\text{so} \\quad \\frac{dy}{dx} = -\\frac{x}{y}.$$

At $(3, 4)$ the slope is $-\\frac{3}{4}$.

Check: the upper half of the circle is $y = \\sqrt{25 - x^{2}}$. Its derivative $-\\frac{x}{\\sqrt{25 - x^{2}}}$ is also $-\\frac{3}{4}$ at $x = 3$.

In this lesson we differentiate equations in $x$ and $y$ term by term, solve for $\\frac{dy}{dx}$, and find slopes at points of curves.`,
    `链式法则可以对内层函数的幂求导：$\\frac{d}{dx}\\left(g(x)\\right)^{2} = 2g(x)g'(x)$。当 $y$ 是 $x$ 的函数时，同一法则给出 $\\frac{d}{dx} y^{2} = 2y\\frac{dy}{dx}$，即使从不把 $y$ 写出来。对圆 $x^{2} + y^{2} = 25$，两边求导得

$$2x + 2y\\frac{dy}{dx} = 0, \\quad \\text{所以} \\quad \\frac{dy}{dx} = -\\frac{x}{y}.$$

在 $(3, 4)$ 处斜率为 $-\\frac{3}{4}$。

检验：圆的上半部分是 $y = \\sqrt{25 - x^{2}}$。它的导数 $-\\frac{x}{\\sqrt{25 - x^{2}}}$ 在 $x = 3$ 处也是 $-\\frac{3}{4}$。

这节课我们对关于 $x$ 和 $y$ 的方程逐项求导，解出 $\\frac{dy}{dx}$，并求曲线上各点处的斜率。`,
  ),
  knowledgePoints: [
    {
      id: "implicit-differentiation-of-sums-of-powers",
      title: t("Implicit differentiation of sums of powers", "幂之和的隐函数求导"),
      explanation: t(
        "When $y$ is a function of $x$ defined by an equation, differentiate both sides with respect to $x$. By the chain rule, the derivative of $y^{n}$ with respect to $x$ is $ny^{n - 1}\\frac{dy}{dx}$. Then solve for $\\frac{dy}{dx}$. For $x^{3} + y^{2} = 9$:\n\n$$3x^{2} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{3x^{2}}{2y}.$$\n\nThe point $(2, 1)$ is on this curve, and there the slope is $-\\frac{12}{2}$, which is $-6$.\n\nCheck: solving for $y$ gives $y = \\sqrt{9 - x^{3}}$ near $(2, 1)$, and the difference quotients of this function at $x = 2$ with $h = \\pm 0.01$ are about $-6.224$ and $-5.802$, on either side of $-6$.\n\n> **Watch out.** Every term with $y$ in it gets a factor $\\frac{dy}{dx}$, and the constant on the right differentiates to $0$. Writing $2y$ for the derivative of $y^{2}$ drops the chain rule.",
        "当 $y$ 是由方程确定的 $x$ 的函数时，对方程两边关于 $x$ 求导。由链式法则，$y^{n}$ 对 $x$ 的导数是 $ny^{n - 1}\\frac{dy}{dx}$。再解出 $\\frac{dy}{dx}$。对 $x^{3} + y^{2} = 9$：\n\n$$3x^{2} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{3x^{2}}{2y}.$$\n\n点 $(2, 1)$ 在这条曲线上，那里的斜率是 $-\\frac{12}{2}$，即 $-6$。\n\n检验：在 $(2, 1)$ 附近解出 $y = \\sqrt{9 - x^{3}}$，这个函数在 $x = 2$ 处取 $h = \\pm 0.01$ 的差商约为 $-6.224$ 和 $-5.802$，位于 $-6$ 的两侧。\n\n> **注意。** 每个含 $y$ 的项都要乘上因子 $\\frac{dy}{dx}$，右边的常数求导后为 $0$。把 $y^{2}$ 的导数写成 $2y$ 就漏掉了链式法则。",
      ),
      generate(rng) {
        const p = rng.int(2, 5);
        const q = rng.int(2, 4);
        const a = rng.pick([1, 1, 2, 3, 4]);
        const b = rng.pick([1, 1, 2, 3, 5, -1, -2]);
        const ends = [-2, -1, 1, 2];
        const [x0, y0] = rng.pick(ends.flatMap((x) => ends.map((y) => [x, y] as const)).filter(([x, y]) => a * x ** p + b * y ** q !== 0));
        const c = a * x0 ** p + b * y0 ** q;
        const answer = frac(Q.of(-a * p, b * q), power(p - 1), power(q - 1, "y"));
        const slope = Q.of(-a * p * x0 ** (p - 1), b * q * y0 ** (q - 1));
        const F = (x: number, y: number) => a * x ** p + b * y ** q - c;
        return functionProblem({
          prompt: t(
            `Find $\\frac{dy}{dx}$ for the curve $${poly([a, power(p)], [b, power(q, "y")])} = ${c}$.`,
            `求曲线 $${poly([a, power(p)], [b, power(q, "y")])} = ${c}$ 的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          prefix: dydx,
          wrong: [
            frac(Q.of(a * p, b * q), power(p - 1), power(q - 1, "y")),
            frac(Q.of(-a * p), power(p - 1), ""),
            frac(Q.of(-b * q, a * p), power(q - 1, "y"), power(p - 1)),
          ],
          solution: walked(
            [
              [
                ["Differentiate both sides", "两边求导"],
                t(
                  `By the chain rule the $y$-term gets a factor $\\frac{dy}{dx}$, and the constant $${c}$ gives $0$:`,
                  `由链式法则，含 $y$ 的项要乘上 $\\frac{dy}{dx}$，常数 $${c}$ 求导得 $0$：`,
                ),
                [`${poly([a * p, power(p - 1)], [b * q, `${power(q - 1, "y")}\\frac{dy}{dx}`])} = 0`],
              ],
              [
                ["Solve for dy/dx", "解出 dy/dx"],
                t(
                  `Move the $x$-term to the right and divide by $${poly([b * q, power(q - 1, "y")])}$:`,
                  `把含 $x$ 的项移到右边，再除以 $${poly([b * q, power(q - 1, "y")])}$：`,
                ),
                [`\\frac{dy}{dx} = ${answer}`],
              ],
            ],
            t(
              `The point $(${x0}, ${y0})$ is on the curve, since it gives $${c}$. There the formula gives the slope $${slope.toLatex()}$.\n\n${curveCheck(F, x0, y0, slope).en}`,
              `点 $(${x0}, ${y0})$ 在曲线上，因为代入得 $${c}$。那里公式给出的斜率是 $${slope.toLatex()}$。\n\n${curveCheck(F, x0, y0, slope)["zh-CN"]}`,
            ),
          ),
        });
      },
    },
    {
      id: "implicit-differentiation-with-products",
      title: t("Implicit differentiation with products", "含乘积的隐函数求导"),
      explanation: t(
        "A term such as $xy$ is a product: its derivative is $y + x\\frac{dy}{dx}$. Collect the terms with $\\frac{dy}{dx}$ on one side and factor it out. For $x^{2} + xy + y^{2} = 7$:\n\n$$2x + y + x\\frac{dy}{dx} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{2x + y}{x + 2y}.$$\n\nAt the point $(1, 2)$ this is $-\\frac{4}{5}$.\n\nCheck: as a quadratic in $y$, the branch through $(1, 2)$ is\n\n$$y = \\frac{-x + \\sqrt{28 - 3x^{2}}}{2}.$$\n\nAt $x = 0.99$ and $x = 1.01$ it gives $y \\approx 2.0080$ and $y \\approx 1.9920$, a chord of slope $-0.8$.\n\n> **Watch out.** The derivative of $xy$ is $y + x\\frac{dy}{dx}$, not $\\frac{dy}{dx}$ alone: $xy$ is a product of two functions of $x$, so it needs the product rule.",
        "像 $xy$ 这样的项是乘积：它的导数是 $y + x\\frac{dy}{dx}$。把含 $\\frac{dy}{dx}$ 的项移到一边，再提取公因式。对 $x^{2} + xy + y^{2} = 7$：\n\n$$2x + y + x\\frac{dy}{dx} + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{2x + y}{x + 2y}.$$\n\n在点 $(1, 2)$ 处它等于 $-\\frac{4}{5}$。\n\n检验：把方程看作 $y$ 的二次方程，过 $(1, 2)$ 的那一支是\n\n$$y = \\frac{-x + \\sqrt{28 - 3x^{2}}}{2}.$$\n\n在 $x = 0.99$ 和 $x = 1.01$ 处，它给出 $y \\approx 2.0080$ 和 $y \\approx 1.9920$，连线斜率为 $-0.8$。\n\n> **注意。** $xy$ 的导数是 $y + x\\frac{dy}{dx}$，不只是 $\\frac{dy}{dx}$：$xy$ 是两个 $x$ 的函数的乘积，要用乘积法则。",
      ),
      generate(rng) {
        const b = rng.pick([1, 1, 2, 3, -1]);
        const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        // With b and c both negative the left side could be negative everywhere, so c is then positive.
        const c = b < 0 ? rng.pick([1, 2, 3]) : rng.pick([1, 1, 2, 3, -1]);
        const [x0, y0] = rng.pick(
          range(-2, 2)
            .flatMap((x) => range(-2, 2).map((y) => [x, y] as const))
            .filter(([x, y]) => a * x + 2 * c * y !== 0 && b * x * x + a * x * y + c * y * y > 0),
        );
        const d = b * x0 * x0 + a * x0 * y0 + c * y0 * y0;
        const top = poly([2 * b, "x"], [a, "y"]);
        const bottom = poly([a, "x"], [2 * c, "y"]);
        const answer = `-\\frac{${top}}{${bottom}}`;
        const slope = Q.of(-(2 * b * x0 + a * y0), a * x0 + 2 * c * y0);
        const F = (x: number, y: number) => b * x * x + a * x * y + c * y * y - d;
        return functionProblem({
          prompt: t(
            `Find $\\frac{dy}{dx}$ for the curve $${poly([b, "x^{2}"], [a, "xy"], [c, "y^{2}"])} = ${d}$.`,
            `求曲线 $${poly([b, "x^{2}"], [a, "xy"], [c, "y^{2}"])} = ${d}$ 的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          prefix: dydx,
          wrong: [
            `-\\frac{${poly([2 * b, "x"])}}{${bottom}}`,
            `\\frac{${top}}{${bottom}}`,
            `-\\frac{${poly([2 * b, "x"], [a, "y"])}}{${poly([2 * c, "y"])}}`,
          ],
          solution: walked(
            [
              [
                ["Differentiate both sides", "两边求导"],
                t(
                  `Use the product rule on $${poly([a, "xy"])}$ and the chain rule on $${poly([c, "y^{2}"])}$:`,
                  `对 $${poly([a, "xy"])}$ 用乘积法则，对 $${poly([c, "y^{2}"])}$ 用链式法则：`,
                ),
                [`${poly([2 * b, "x"], [a, "y"], [a, "x\\frac{dy}{dx}"], [2 * c, "y\\frac{dy}{dx}"])} = 0`],
              ],
              [
                ["Collect and solve", "合并并解出"],
                t(
                  "Keep the terms with $\\frac{dy}{dx}$ on the left, factor it out, and divide:",
                  "把含 $\\frac{dy}{dx}$ 的项留在左边，提取公因式，再相除：",
                ),
                [`(${bottom})\\frac{dy}{dx} = -(${top})`, `\\frac{dy}{dx} = ${answer}`],
              ],
            ],
            t(
              `The point $(${x0}, ${y0})$ is on the curve, and there the formula gives $${slope.toLatex()}$.\n\n${curveCheck(F, x0, y0, slope).en}`,
              `点 $(${x0}, ${y0})$ 在曲线上，那里公式给出 $${slope.toLatex()}$。\n\n${curveCheck(F, x0, y0, slope)["zh-CN"]}`,
            ),
          ),
        });
      },
    },
    {
      id: "implicit-slopes-at-a-point",
      title: t("Implicit slopes at a point", "隐函数在某点处的斜率"),
      explanation: t(
        "Implicit differentiation gives the slope in terms of both coordinates, so you need the full point on the curve to get a number. After finding $\\frac{dy}{dx}$ in terms of $x$ and $y$, substitute both coordinates of the point. For $x^{2} + xy + y^{2} = 7$ at $(1, 2)$:\n\n$$\\frac{dy}{dx} = -\\frac{2(1) + 2}{1 + 2(2)} = -\\frac{4}{5}.$$\n\nCheck: solving the equation for $y$ at $x = 0.99$ and $x = 1.01$, near $y = 2$, gives $y \\approx 2.0080$ and $y \\approx 1.9920$. The chord's slope is $\\frac{-0.016}{0.02}$, which is $-0.8$.\n\n> **Watch out.** Differentiate first and substitute afterwards. Putting the point into the equation first turns it into a statement about numbers, whose derivative is $0 = 0$.",
        "隐函数求导给出的斜率同时含有两个坐标，所以需要曲线上完整的点才能算出一个数。求出用 $x$ 和 $y$ 表示的 $\\frac{dy}{dx}$ 后，代入该点的两个坐标。对 $x^{2} + xy + y^{2} = 7$ 在 $(1, 2)$ 处：\n\n$$\\frac{dy}{dx} = -\\frac{2(1) + 2}{1 + 2(2)} = -\\frac{4}{5}.$$\n\n检验：在 $x = 0.99$ 和 $x = 1.01$ 处、$y = 2$ 附近解方程，得 $y \\approx 2.0080$ 和 $y \\approx 1.9920$。连线斜率为 $\\frac{-0.016}{0.02}$，即 $-0.8$。\n\n> **注意。** 先求导，再代入。先把点代入方程，它就成了关于数的等式，求导只得到 $0 = 0$。",
      ),
      generate(rng) {
        // a = ±2 would make the curve a pair of lines.
        const a = rng.pick([1, 3, -1, -3]);
        const nonzero = [-3, -2, -1, 1, 2, 3];
        const [x0, y0] = rng.pick(nonzero.flatMap((x) => nonzero.map((y) => [x, y] as const)).filter(([x, y]) => a * x + 2 * y !== 0));
        const d = x0 * x0 + a * x0 * y0 + y0 * y0;
        const top = 2 * x0 + a * y0;
        const bottom = a * x0 + 2 * y0;
        const answer = Q.of(-top, bottom);
        const F = (x: number, y: number) => x * x + a * x * y + y * y - d;
        return numberProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the curve $${poly([1, "x^{2}"], [a, "xy"], [1, "y^{2}"])} = ${d}$. Find the slope of the curve there.`,
            `点 $(${x0}, ${y0})$ 在曲线 $${poly([1, "x^{2}"], [a, "xy"], [1, "y^{2}"])} = ${d}$ 上。求曲线在该点处的斜率。`,
          ),
          answer,
          wrong: [Q.of(-x0, y0), Q.of(top, bottom), Q.of(-(2 * x0), bottom)],
          solution: walked(
            [
              [
                ["Differentiate and solve", "求导并解出"],
                t(
                  `Differentiating, with the product rule for $${poly([a, "xy"])}$, and solving for $\\frac{dy}{dx}$:`,
                  `两边求导，对 $${poly([a, "xy"])}$ 用乘积法则，再解出 $\\frac{dy}{dx}$：`,
                ),
                [
                  `${poly([2, "x"], [a, "y"], [a, "x\\frac{dy}{dx}"], [2, "y\\frac{dy}{dx}"])} = 0`,
                  `\\frac{dy}{dx} = -\\frac{${poly([2, "x"], [a, "y"])}}{${poly([a, "x"], [2, "y"])}}`,
                ],
              ],
              [
                ["Substitute the point", "代入该点"],
                t(`Put $x = ${x0}$ and $y = ${y0}$ into both parts of the fraction:`, `把 $x = ${x0}$ 和 $y = ${y0}$ 代入分子和分母：`),
                [`\\frac{dy}{dx} = -\\frac{${top}}{${bottom}} = ${answer.toLatex()}`],
              ],
            ],
            curveCheck(F, x0, y0, answer),
          ),
        });
      },
    },
  ],
};

/** pythagorean are integer points on circles centered at the origin. */
const pythagorean: readonly (readonly [number, number])[] = [
  [3, 4],
  [4, 3],
  [5, 12],
  [12, 5],
  [6, 8],
  [8, 6],
  [0, 5],
  [1, 1],
  [2, 1],
  [1, 3],
];

/** tangentFigure plots a curve with its tangent line at one point. */
const tangentFigure = (marks: readonly PlaneMark[], en: string, zh: string): Figure => ({
  svg: plane({ xMin: -6, xMax: 8, yMin: -6, yMax: 6, labelEvery: 2 }, marks),
  alt: t(en, zh),
});

/** circleTangentFigure plots x² + y² = 25 with its tangent at (3, 4), perpendicular to the radius. */
const circleTangentFigure = tangentFigure(
  [
    { kind: "circle", center: [0, 0], r: 5 },
    { kind: "segment", a: [0, 0], b: [3, 4], dashed: true },
    { kind: "line", a: [3, 4], b: [7, 1], accent: true },
    { kind: "point", at: [3, 4], label: "(3, 4)", dir: "ne" },
  ],
  "The circle x² + y² = 25 and its tangent line at (3, 4), with slope −3/4, perpendicular to the radius to (3, 4), with slope 4/3.",
  "圆 x² + y² = 25 及其在 (3, 4) 处的切线，斜率为 −3/4，与通往 (3, 4) 的半径（斜率 4/3）垂直。",
);

/** half draws the graph of f and its reflection in the x-axis, the two halves of a curve symmetric about that axis. */
const half = (f: (x: number) => number, from: number, to: number): PlaneMark[] => [
  { kind: "curve", f, from, to },
  { kind: "curve", f: (x) => -f(x), from, to },
];

/** ellipseTangentFigure plots x² + 4y² = 20 with its tangent at (4, 1). */
const ellipseTangentFigure = tangentFigure(
  [
    ...half((x) => Math.sqrt(Math.max(0, 20 - x * x)) / 2, -Math.sqrt(20), Math.sqrt(20)),
    { kind: "line", a: [4, 1], b: [5, 0], accent: true },
    { kind: "point", at: [4, 1], label: "(4, 1)", dir: "ne" },
  ],
  "The ellipse x² + 4y² = 20 and its tangent line at (4, 1), with slope −1.",
  "椭圆 x² + 4y² = 20 及其在 (4, 1) 处的切线，斜率为 −1。",
);

/** parabolaTangentFigure plots x = y² with its tangent at (4, 2). */
const parabolaTangentFigure = tangentFigure(
  [
    ...half((x) => Math.sqrt(Math.max(0, x)), 0, 8),
    { kind: "line", a: [4, 2], b: [0, 1], accent: true },
    { kind: "point", at: [4, 2], label: "(4, 2)", dir: "se" },
  ],
  "The sideways parabola x = y² and its tangent line at (4, 2), with slope 1/4.",
  "开口向右的抛物线 x = y² 及其在 (4, 2) 处的切线，斜率为 1/4。",
);

/** shifted writes x − h, or x when h is 0, in the variable v. */
const shifted = (h: number, v: string) => (h === 0 ? v : poly([1, v], [-h, ""]));

/** calculatingSlopesOfCirclesEllipsesAndParabolas finds slopes of conics. */
export const calculatingSlopesOfCirclesEllipsesAndParabolas: TopicDef = {
  id: "calculating-slopes-of-circles-ellipses-and-parabolas",
  title: t("Calculating Slopes of Circles, Ellipses, and Parabolas", "计算圆、椭圆和抛物线的斜率"),
  summary: t(
    "Use implicit differentiation to find slopes of circles, ellipses and sideways parabolas.",
    "用隐函数求导计算圆、椭圆和开口向左右的抛物线的斜率。",
  ),
  prerequisites: ["implicit-differentiation", "equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "implicit-differentiation", weight: 0.5 }],
  xp: 12,
  standards: [],
  intro: t(
    `An ellipse centered at the origin can be written without fractions: $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$ becomes $9x^{2} + 25y^{2} = 225$. Implicit differentiation then gives its slope at every point:

$$18x + 50y\\frac{dy}{dx} = 0, \\quad \\text{so} \\quad \\frac{dy}{dx} = -\\frac{9x}{25y}.$$

At $\\left(4, \\frac{9}{5}\\right)$ the slope is $-\\frac{36}{45}$, which is $-\\frac{4}{5}$.

Check: the upper half is $y = \\frac{3}{5}\\sqrt{25 - x^{2}}$, and its difference quotients at $x = 4$ with $h = \\pm 0.01$ are about $-0.803$ and $-0.797$, on either side of $-0.8$.

In this lesson we find the slopes of circles, ellipses and parabolas that open sideways, none of which is the graph of a single function of $x$.`,
    `中心在原点的椭圆可以写成不含分数的形式：$\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$ 化为 $9x^{2} + 25y^{2} = 225$。隐函数求导给出它在每一点处的斜率：

$$18x + 50y\\frac{dy}{dx} = 0, \\quad \\text{所以} \\quad \\frac{dy}{dx} = -\\frac{9x}{25y}.$$

在 $\\left(4, \\frac{9}{5}\\right)$ 处斜率为 $-\\frac{36}{45}$，即 $-\\frac{4}{5}$。

检验：上半部分是 $y = \\frac{3}{5}\\sqrt{25 - x^{2}}$，它在 $x = 4$ 处取 $h = \\pm 0.01$ 的差商约为 $-0.803$ 和 $-0.797$，位于 $-0.8$ 的两侧。

这节课我们求圆、椭圆和开口向左右的抛物线的斜率，这些曲线都不是单个 $x$ 的函数的图像。`,
  ),
  knowledgePoints: [
    {
      id: "slopes-of-circles",
      title: t("Slopes of circles", "圆的斜率"),
      explanation: t(
        "The tangent to a circle is perpendicular to the radius, and the implicit derivative confirms this: its slope is the negative reciprocal of the radius slope. For the circle $(x - h)^{2} + (y - k)^{2} = r^{2}$,\n\n$$2(x - h) + 2(y - k)\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{x - h}{y - k}.$$\n\nFor example, on $x^{2} + y^{2} = 25$ at $(3, 4)$ the slope is $-\\frac{3}{4}$.\n\nCheck: the radius to $(3, 4)$ has slope $\\frac{4}{3}$, and the product of the two slopes is $-1$, so the tangent is perpendicular to the radius, as it must be.\n\n> **Watch out.** Measure from the center: the slope is $-\\frac{x - h}{y - k}$, and $-\\frac{x}{y}$ is right only for a circle centered at the origin. Where $y = k$ the tangent is vertical and has no slope.",
        "圆的切线垂直于半径，隐函数求导也证实了这一点：切线斜率是半径斜率的负倒数。对圆 $(x - h)^{2} + (y - k)^{2} = r^{2}$，\n\n$$2(x - h) + 2(y - k)\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{x - h}{y - k}.$$\n\n例如，在 $x^{2} + y^{2} = 25$ 上的 $(3, 4)$ 处，斜率为 $-\\frac{3}{4}$。\n\n检验：通往 $(3, 4)$ 的半径斜率为 $\\frac{4}{3}$，两个斜率之积为 $-1$，所以切线与半径垂直，正应如此。\n\n> **注意。** 要从圆心量起：斜率是 $-\\frac{x - h}{y - k}$，而 $-\\frac{x}{y}$ 只对圆心在原点的圆成立。在 $y = k$ 处切线竖直，没有斜率。",
      ),
      figure: circleTangentFigure,
      generate(rng) {
        let [u, v] = rng.pick(pythagorean.filter(([, b]) => b !== 0));
        u *= rng.sign();
        v *= rng.sign();
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 4);
        const r2 = u * u + v * v;
        const [x0, y0] = [h + u, k + v];
        const answer = Q.of(-u, v);
        const circle = `${h === 0 ? "x^{2}" : `(${shifted(h, "x")})^{2}`} + ${k === 0 ? "y^{2}" : `(${shifted(k, "y")})^{2}`} = ${r2}`;
        const check =
          u === 0
            ? t(
                `The tangent to a circle is perpendicular to the radius. The radius from the center $(${h}, ${k})$ to $(${x0}, ${y0})$ is vertical.\n\nSo the tangent there is horizontal, with slope $0$.`,
                `圆的切线垂直于半径。从圆心 $(${h}, ${k})$ 到 $(${x0}, ${y0})$ 的半径是竖直的。\n\n所以那里的切线是水平的，斜率为 $0$。`,
              )
            : t(
                `The tangent to a circle is perpendicular to the radius. The radius from the center $(${h}, ${k})$ to $(${x0}, ${y0})$ rises $${v}$ over a run of $${u}$, a slope of $${Q.of(v, u).toLatex()}$, and\n\n$$${Q.of(v, u).toLatex()} \\cdot ${par(answer)} = -1.$$\n\nTwo lines whose slopes multiply to $-1$ are perpendicular, so the slope $${answer.toLatex()}$ fits.`,
                `圆的切线垂直于半径。从圆心 $(${h}, ${k})$ 到 $(${x0}, ${y0})$ 的半径，横向变化 $${u}$，纵向变化 $${v}$，斜率为 $${Q.of(v, u).toLatex()}$，而\n\n$$${Q.of(v, u).toLatex()} \\cdot ${par(answer)} = -1.$$\n\n斜率之积为 $-1$ 的两条直线互相垂直，所以斜率 $${answer.toLatex()}$ 是对的。`,
              );
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the circle $${circle}$ at the point $(${x0}, ${y0})$.`,
            `求圆 $${circle}$ 在点 $(${x0}, ${y0})$ 处的切线斜率。`,
          ),
          answer,
          wrong: [Q.of(v, u === 0 ? 1 : u), Q.of(u, v), Q.of(-x0, y0 === 0 ? 1 : y0)],
          solution: walked(
            [
              [
                ["Differentiate the equation", "对方程求导"],
                t("Differentiate both sides with respect to $x$ and solve:", "两边对 $x$ 求导并解出："),
                [
                  `2(${shifted(h, "x")}) + 2(${shifted(k, "y")})\\frac{dy}{dx} = 0`,
                  `\\frac{dy}{dx} = -\\frac{${shifted(h, "x")}}{${shifted(k, "y")}}`,
                ],
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `At $(${x0}, ${y0})$, $${shifted(h, "x")} = ${u}$ and $${shifted(k, "y")} = ${v}$:`,
                  `在 $(${x0}, ${y0})$ 处，$${shifted(h, "x")} = ${u}$，$${shifted(k, "y")} = ${v}$：`,
                ),
                [`\\frac{dy}{dx} = -\\frac{${u}}{${v}} = ${answer.toLatex()}`],
              ],
            ],
            check,
          ),
        });
      },
    },
    {
      id: "slopes-of-ellipses",
      title: t("Slopes of ellipses", "椭圆的斜率"),
      explanation: t(
        "Differentiate both sides with respect to the horizontal variable, treating the vertical variable as a function of it, and then solve for the derivative. For $px^{2} + qy^{2} = r$, $2px + 2qy\\frac{dy}{dx} = 0$, so\n\n$$\\frac{dy}{dx} = -\\frac{px}{qy}.$$\n\nFor example, on $4x^{2} + 9y^{2} = 72$ at $(3, 2)$ the slope is $-\\frac{12}{18}$, which is $-\\frac{2}{3}$.\n\nCheck: the upper half is $y = \\frac{1}{3}\\sqrt{72 - 4x^{2}}$, and its difference quotients at $x = 3$ with $h = \\pm 0.01$ are about $-0.669$ and $-0.665$, on either side of $-0.667$.\n\n> **Watch out.** The coefficients stay with their own variables: $p$, the coefficient of $x^{2}$, goes on top with $x$, and $q$ goes underneath with $y$. Swapping them is a common slip.",
        "两边对水平变量求导，把竖直变量看作它的函数，再解出导数。对 $px^{2} + qy^{2} = r$，$2px + 2qy\\frac{dy}{dx} = 0$，所以\n\n$$\\frac{dy}{dx} = -\\frac{px}{qy}.$$\n\n例如，在 $4x^{2} + 9y^{2} = 72$ 上的 $(3, 2)$ 处，斜率为 $-\\frac{12}{18}$，即 $-\\frac{2}{3}$。\n\n检验：上半部分是 $y = \\frac{1}{3}\\sqrt{72 - 4x^{2}}$，它在 $x = 3$ 处取 $h = \\pm 0.01$ 的差商约为 $-0.669$ 和 $-0.665$，位于 $-0.667$ 的两侧。\n\n> **注意。** 系数跟着各自的变量走：$x^{2}$ 的系数 $p$ 和 $x$ 一起在分子上，$q$ 和 $y$ 一起在分母上。把它们对调是常见的错误。",
      ),
      figure: ellipseTangentFigure,
      generate(rng) {
        const [p, q] = rng.sample([1, 2, 3, 4, 5, 9, 16, 25], 2) as [number, number];
        const x0 = rng.nonZero(-3, 3);
        const y0 = rng.nonZero(-3, 3);
        const r = p * x0 * x0 + q * y0 * y0;
        const answer = Q.of(-p * x0, q * y0);
        const F = (x: number, y: number) => p * x * x + q * y * y - r;
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the ellipse $${poly([p, "x^{2}"], [q, "y^{2}"])} = ${r}$ at the point $(${x0}, ${y0})$.`,
            `求椭圆 $${poly([p, "x^{2}"], [q, "y^{2}"])} = ${r}$ 在点 $(${x0}, ${y0})$ 处的切线斜率。`,
          ),
          answer,
          wrong: [Q.of(-x0, y0), Q.of(p * x0, q * y0), Q.of(-q * x0, p * y0)],
          solution: walked(
            [
              [
                ["Differentiate the equation", "对方程求导"],
                t("Differentiate both sides with respect to $x$ and solve:", "两边对 $x$ 求导并解出："),
                [`${poly([2 * p, "x"], [2 * q, "y\\frac{dy}{dx}"])} = 0`, `\\frac{dy}{dx} = -\\frac{${poly([p, "x"])}}{${poly([q, "y"])}}`],
              ],
              [
                ["Substitute the point", "代入该点"],
                t(`Put $x = ${x0}$ and $y = ${y0}$:`, `代入 $x = ${x0}$，$y = ${y0}$：`),
                [`\\frac{dy}{dx} = -\\frac{${p * x0}}{${q * y0}} = ${answer.toLatex()}`],
              ],
            ],
            curveCheck(F, x0, y0, answer),
          ),
        });
      },
    },
    {
      id: "slopes-of-sideways-parabolas",
      title: t("Slopes of sideways parabolas", "开口向左右的抛物线的斜率"),
      explanation: t(
        "A parabola that opens sideways is not a function of the horizontal variable, but implicit differentiation still gives the slope at each point. A parabola $x = ay^{2} + by + c$ opens left or right. Differentiating with respect to $x$:\n\n$$1 = (2ay + b)\\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{1}{2ay + b}.$$\n\nFor example, on $x = y^{2}$ at $(4, 2)$ the slope is $\\frac{1}{4}$.\n\nCheck: the upper half of $x = y^{2}$ is $y = \\sqrt{x}$, whose derivative $\\frac{1}{2\\sqrt{x}}$ is also $\\frac{1}{4}$ at $x = 4$.\n\n> **Watch out.** The slope is the reciprocal $\\frac{1}{2ay + b}$. The expression $2ay + b$ itself is $\\frac{dx}{dy}$, the rate the other way round.",
        "开口向左右的抛物线不是水平变量的函数，但隐函数求导仍能给出每一点处的斜率。抛物线 $x = ay^{2} + by + c$ 开口向左或向右。对 $x$ 求导：\n\n$$1 = (2ay + b)\\frac{dy}{dx} \\implies \\frac{dy}{dx} = \\frac{1}{2ay + b}.$$\n\n例如，在 $x = y^{2}$ 上的 $(4, 2)$ 处，斜率为 $\\frac{1}{4}$。\n\n检验：$x = y^{2}$ 的上半部分是 $y = \\sqrt{x}$，它的导数 $\\frac{1}{2\\sqrt{x}}$ 在 $x = 4$ 处也是 $\\frac{1}{4}$。\n\n> **注意。** 斜率是倒数 $\\frac{1}{2ay + b}$。$2ay + b$ 本身是 $\\frac{dx}{dy}$，是反过来的变化率。",
      ),
      figure: parabolaTangentFigure,
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
        const y0 = rng.pick(range(-3, 3).filter((y) => pAt(pDer(p), y) !== 0));
        const x0 = pAt(p, y0);
        const d = pAt(pDer(p), y0);
        const answer = Q.of(1, d);
        const F = (x: number, y: number) => pAt(p, y) - x;
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to the parabola $x = ${pLatex(p, "y")}$ at the point $(${x0}, ${y0})$.`,
            `求抛物线 $x = ${pLatex(p, "y")}$ 在点 $(${x0}, ${y0})$ 处的切线斜率。`,
          ),
          answer,
          wrong: [Q.of(d), Q.of(-1, d), Q.of(pAt(pDer(p), x0) || 1)],
          solution: walked(
            [
              [
                ["Differentiate with respect to x", "对 x 求导"],
                t(
                  "The left side $x$ has derivative $1$, and each power of $y$ gets a factor $\\frac{dy}{dx}$:",
                  "左边 $x$ 的导数是 $1$，$y$ 的每个幂都要乘上 $\\frac{dy}{dx}$：",
                ),
                [`1 = (${pLatex(pDer(p), "y")})\\frac{dy}{dx}`],
              ],
              [
                ["Substitute y and divide", "代入 y 再相除"],
                t(`At $y = ${y0}$ the bracket is $${d}$, so`, `在 $y = ${y0}$ 处括号等于 $${d}$，所以`),
                [`\\frac{dy}{dx} = ${reciprocal(d)}`],
              ],
            ],
            curveCheck(F, x0, y0, answer),
          ),
        });
      },
    },
  ],
};

/** XofY is a curve x = x(y) in LaTeX, with its derivative dx/dy in LaTeX and both as numbers. */
interface XofY {
  readonly x: string;
  readonly dx: string;
  readonly at: (y: number) => number;
  readonly slope: (y: number) => number;
}

/** calculatingDyDxUsingDxDy finds dy/dx as the reciprocal of dx/dy. */
export const calculatingDyDxUsingDxDy: TopicDef = {
  id: "calculating-dy-dx-using-dx-dy",
  title: t("Calculating dy/dx Using dx/dy", "用 dx/dy 计算 dy/dx"),
  summary: t(
    "When x is given as a function of y, find dy/dx as the reciprocal of dx/dy.",
    "当 x 是 y 的函数时，把 dy/dx 作为 dx/dy 的倒数来求。",
  ),
  prerequisites: ["implicit-differentiation"],
  encompasses: [{ topic: "implicit-differentiation", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `Implicit differentiation works when $x$ is written in terms of $y$. For $x = y^{3} + 2y$, differentiating both sides with respect to $x$ gives

$$1 = (3y^{2} + 2)\\frac{dy}{dx}, \\quad \\text{so} \\quad \\frac{dy}{dx} = \\frac{1}{3y^{2} + 2}.$$

The bracket $3y^{2} + 2$ is $\\frac{dx}{dy}$, so $\\frac{dy}{dx}$ is its reciprocal. At $(3, 1)$ the slope is $\\frac{1}{5}$.

Check: at $y = 1.01$, $x = 3.050301$. A rise of $0.01$ in $y$ goes with a run of about $0.0503$ in $x$, a slope of about $0.199$, close to $0.2$.

In this lesson we find $\\frac{dy}{dx}$ as the reciprocal of $\\frac{dx}{dy}$, in general and at a point.`,
    `当 $x$ 用 $y$ 表示时，隐函数求导同样适用。对 $x = y^{3} + 2y$，两边对 $x$ 求导得

$$1 = (3y^{2} + 2)\\frac{dy}{dx}, \\quad \\text{所以} \\quad \\frac{dy}{dx} = \\frac{1}{3y^{2} + 2}.$$

括号 $3y^{2} + 2$ 就是 $\\frac{dx}{dy}$，所以 $\\frac{dy}{dx}$ 是它的倒数。在 $(3, 1)$ 处斜率为 $\\frac{1}{5}$。

检验：在 $y = 1.01$ 处 $x = 3.050301$。$y$ 增加 $0.01$ 时 $x$ 约增加 $0.0503$，斜率约为 $0.199$，接近 $0.2$。

这节课我们把 $\\frac{dy}{dx}$ 作为 $\\frac{dx}{dy}$ 的倒数来求，既求一般表达式，也求某点处的值。`,
  ),
  knowledgePoints: [
    {
      id: "dy-dx-as-a-reciprocal",
      title: t("dy/dx as a reciprocal", "dy/dx 作为倒数"),
      explanation: t(
        "When the curve is described with the horizontal variable as a function of the vertical one, the slope is the reciprocal of the derivative you can compute directly. When $x$ is a function of $y$, where $\\frac{dx}{dy} \\ne 0$,\n\n$$\\frac{dy}{dx} = \\frac{1}{\\frac{dx}{dy}}.$$\n\nFor $x = y^{3} + 2y$: $\\frac{dx}{dy} = 3y^{2} + 2$, so $\\frac{dy}{dx}$ is $\\frac{1}{3y^{2} + 2}$.\n\nCheck: at $y = 0$ this gives $\\frac{1}{2}$. Near the origin $x \\approx 2y$, because $y^{3}$ is tiny there, and the line $x = 2y$ has slope $\\frac{1}{2}$.\n\n> **Watch out.** Take the reciprocal of the derivative $\\frac{dx}{dy}$, not of $x$ itself, and do not add a minus sign: $-\\frac{1}{m}$ is the slope of a perpendicular line, not of the curve.",
        "当曲线把水平变量表示为竖直变量的函数时，斜率就是可以直接求出的那个导数的倒数。当 $x$ 是 $y$ 的函数且 $\\frac{dx}{dy} \\ne 0$ 时，\n\n$$\\frac{dy}{dx} = \\frac{1}{\\frac{dx}{dy}}.$$\n\n对 $x = y^{3} + 2y$：$\\frac{dx}{dy} = 3y^{2} + 2$，所以 $\\frac{dy}{dx}$ 等于 $\\frac{1}{3y^{2} + 2}$。\n\n检验：在 $y = 0$ 处它等于 $\\frac{1}{2}$。在原点附近 $y^{3}$ 很小，所以 $x \\approx 2y$，而直线 $x = 2y$ 的斜率正是 $\\frac{1}{2}$。\n\n> **注意。** 取倒数的是导数 $\\frac{dx}{dy}$，不是 $x$ 本身，也不要加负号：$-\\frac{1}{m}$ 是垂直直线的斜率，不是曲线的斜率。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const p: Poly = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const k = rng.pick([2, 3, -1, -2]);
        const c = rng.int(-5, 5);
        const curve: XofY =
          kind === 0
            ? { x: pLatex(p, "y"), dx: pLatex(pDer(p), "y"), at: (y) => pAt(p, y), slope: (y) => pAt(pDer(p), y) }
            : kind === 1
              ? {
                  x: sumLatex([`e^{${poly([k, "y"])}}`, poly([c, "y"])]),
                  dx: sumLatex([poly([k, `e^{${poly([k, "y"])}}`]), String(c)]),
                  at: (y) => Math.exp(k * y) + c * y,
                  slope: (y) => k * Math.exp(k * y) + c,
                }
              : {
                  x: sumLatex([poly([k, "\\sin y"]), poly([c, "y"])]),
                  dx: sumLatex([poly([k, "\\cos y"]), String(c)]),
                  at: (y) => k * Math.sin(y) + c * y,
                  slope: (y) => k * Math.cos(y) + c,
                };
        const y0 = [0, 1, -1, 2].find((y) => Math.abs(curve.slope(y)) > 0.05) ?? 0;
        const value = 1 / curve.slope(y0);
        const answer = `\\frac{1}{${curve.dx}}`;
        const [lo, hi] = [curve.at(y0 - 0.01), curve.at(y0 + 0.01)];
        const tab = table(["$y$", `$${fmt(y0 - 0.01)}$`, `$${fmt(y0 + 0.01)}$`], ["$x$", `$${fmt4(lo)}$`, `$${fmt4(hi)}$`]);
        return functionProblem({
          prompt: t(
            `The curve is given by $x = ${curve.x}$. Find $\\frac{dy}{dx}$ in terms of $y$.`,
            `曲线由 $x = ${curve.x}$ 给出。用 $y$ 表示 $\\frac{dy}{dx}$。`,
          ),
          answer,
          prefix: dydx,
          variable: "y",
          wrong: [curve.dx, `-\\frac{1}{${curve.dx}}`, `\\frac{1}{${curve.x}}`],
          solution: walked(
            [
              [
                ["Differentiate x with respect to y", "求 x 对 y 的导数"],
                t("Differentiate term by term with respect to $y$:", "逐项对 $y$ 求导："),
                [`\\frac{dx}{dy} = ${curve.dx}`],
              ],
              [
                ["Take the reciprocal", "取倒数"],
                t(
                  "Where $\\frac{dx}{dy} \\ne 0$, the slope $\\frac{dy}{dx}$ is its reciprocal:",
                  "在 $\\frac{dx}{dy} \\ne 0$ 处，斜率 $\\frac{dy}{dx}$ 是它的倒数：",
                ),
                [`\\frac{dy}{dx} = ${answer}`],
              ],
            ],
            t(
              `Test the formula at $y = ${y0}$, where it gives about $${fmt(value)}$. Move along the curve from $y = ${fmt(y0 - 0.01)}$ to $y = ${fmt(y0 + 0.01)}$:\n\n${tab}\n\nThe rise is $0.02$ and the run is $${fmt4(hi - lo)}$, a slope of about $${fmt(0.02 / (hi - lo))}$, which matches.`,
              `在 $y = ${y0}$ 处检验这个公式，它给出约 $${fmt(value)}$。沿曲线从 $y = ${fmt(y0 - 0.01)}$ 走到 $y = ${fmt(y0 + 0.01)}$：\n\n${tab}\n\n纵向变化是 $0.02$，横向变化是 $${fmt4(hi - lo)}$，斜率约为 $${fmt(0.02 / (hi - lo))}$，两者一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "dy-dx-at-a-point-from-dx-dy",
      title: t("dy/dx at a point from dx/dy", "由 dx/dy 求某点处的 dy/dx"),
      explanation: t(
        "To find the slope at a point, evaluate $\\frac{dx}{dy}$ at the point's $y$-coordinate and take the reciprocal. For $x = y^{3} + y$ at $(2, 1)$: $\\frac{dx}{dy} = 3y^{2} + 1$, which is $4$ at $y = 1$, so the slope is $\\frac{1}{4}$.\n\nCheck: at $y = 0.99$ and $y = 1.01$ the curve has $x \\approx 1.9603$ and $x \\approx 2.0403$. A rise of $0.02$ over a run of $0.08$ is a slope of $0.25$.\n\n> **Watch out.** Substitute the $y$-coordinate, since $\\frac{dx}{dy}$ is written in $y$. Putting in the $x$-coordinate gives a wrong number.",
        "求某点处的斜率时，在该点的 $y$ 坐标处计算 $\\frac{dx}{dy}$，再取倒数。对 $x = y^{3} + y$ 在 $(2, 1)$ 处：$\\frac{dx}{dy} = 3y^{2} + 1$，在 $y = 1$ 处为 $4$，所以斜率为 $\\frac{1}{4}$。\n\n检验：在 $y = 0.99$ 和 $y = 1.01$ 处，曲线上 $x \\approx 1.9603$ 和 $x \\approx 2.0403$。纵向变化 $0.02$，横向变化 $0.08$，斜率为 $0.25$。\n\n> **注意。** 要代入 $y$ 坐标，因为 $\\frac{dx}{dy}$ 是用 $y$ 写的。代入 $x$ 坐标会得到错误的数。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const y0 = rng.pick(range(-2, 2).filter((y) => pAt(pDer(p), y) !== 0));
        const x0 = pAt(p, y0);
        const d = pAt(pDer(p), y0);
        const answer = Q.of(1, d);
        return numberProblem({
          prompt: t(
            `The point $(${x0}, ${y0})$ lies on the curve $x = ${pLatex(p, "y")}$. Find $\\frac{dy}{dx}$ at this point.`,
            `点 $(${x0}, ${y0})$ 在曲线 $x = ${pLatex(p, "y")}$ 上。求该点处的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          wrong: [Q.of(d), Q.of(1, pAt(pDer(p), x0) || 2), Q.of(-1, d)],
          solution: walked(
            [
              [
                ["Differentiate x with respect to y", "求 x 对 y 的导数"],
                t(`At the point, $y = ${y0}$:`, `在该点处 $y = ${y0}$：`),
                [`\\frac{dx}{dy} = ${pLatex(pDer(p), "y")}`, `\\frac{dx}{dy}\\Big|_{y = ${y0}} = ${d}`],
              ],
              [
                ["Take the reciprocal", "取倒数"],
                t("The slope is the reciprocal of this rate:", "斜率是这个变化率的倒数："),
                [`\\frac{dy}{dx} = ${reciprocal(d)}`],
              ],
            ],
            dxdyCheck((y) => pAt(p, y), y0, answer),
          ),
        });
      },
    },
  ],
};

/** led puts a paragraph in front of a check. */
const led = (lead: Text, check: Text) => t(`${lead.en}\n\n${check.en}`, `${lead["zh-CN"]}\n\n${check["zh-CN"]}`);

/** differentiatingInverseFunctions differentiates inverse functions. */
export const differentiatingInverseFunctions: TopicDef = {
  id: "differentiating-inverse-functions",
  title: t("Differentiating Inverse Functions", "反函数求导"),
  summary: t(
    "Differentiate an inverse function with the formula (f⁻¹)'(x) = 1/f'(f⁻¹(x)).",
    "用公式 (f⁻¹)'(x) = 1/f'(f⁻¹(x)) 对反函数求导。",
  ),
  prerequisites: ["calculating-dy-dx-using-dx-dy", "calculating-the-inverse-of-a-function"],
  encompasses: [
    { topic: "calculating-dy-dx-using-dx-dy", weight: 0.4 },
    { topic: "calculating-the-inverse-of-a-function", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `When $x$ is a function of $y$, $\\frac{dy}{dx}$ is the reciprocal of $\\frac{dx}{dy}$. An inverse function is exactly this situation. The inverse of $f(x) = x^{3} + 1$ is $y = (x - 1)^{\\frac{1}{3}}$, and $y = f^{-1}(x)$ means $x = y^{3} + 1$, so

$$\\frac{dy}{dx} = \\frac{1}{\\frac{dx}{dy}} = \\frac{1}{3y^{2}}.$$

At $x = 9$, $y = 2$ and the slope is $\\frac{1}{12}$.

Check: differentiating $(x - 1)^{\\frac{1}{3}}$ directly by the power rule gives $\\frac{1}{3}(x - 1)^{-\\frac{2}{3}}$. At $x = 9$ this is $\\frac{1}{3}$ times $\\frac{1}{4}$, again $\\frac{1}{12}$.

In this lesson we differentiate inverse functions with the formula $\\left(f^{-1}\\right)'(x) = \\frac{1}{f'\\left(f^{-1}(x)\\right)}$, and see why the slopes of a function and its inverse are reciprocals.`,
    `当 $x$ 是 $y$ 的函数时，$\\frac{dy}{dx}$ 是 $\\frac{dx}{dy}$ 的倒数。反函数正是这种情形。$f(x) = x^{3} + 1$ 的反函数是 $y = (x - 1)^{\\frac{1}{3}}$，而 $y = f^{-1}(x)$ 意味着 $x = y^{3} + 1$，所以

$$\\frac{dy}{dx} = \\frac{1}{\\frac{dx}{dy}} = \\frac{1}{3y^{2}}.$$

在 $x = 9$ 处 $y = 2$，斜率为 $\\frac{1}{12}$。

检验：用幂法则直接对 $(x - 1)^{\\frac{1}{3}}$ 求导，得 $\\frac{1}{3}(x - 1)^{-\\frac{2}{3}}$。在 $x = 9$ 处它是 $\\frac{1}{3}$ 乘以 $\\frac{1}{4}$，同样等于 $\\frac{1}{12}$。

这节课我们用公式 $\\left(f^{-1}\\right)'(x) = \\frac{1}{f'\\left(f^{-1}(x)\\right)}$ 对反函数求导，并说明函数与其反函数的斜率为什么互为倒数。`,
  ),
  knowledgePoints: [
    {
      id: "the-derivative-of-an-inverse-function",
      figure: calculusDrawings2["differentiating-inverse-functions#the-derivative-of-an-inverse-function"],
      title: t("The derivative of an inverse function", "反函数的导数"),
      explanation: t(
        "The graph of an inverse is the reflection of the original graph, so its slope at a point is the reciprocal of the original slope at the reflected point. If $y = f^{-1}(x)$, then $f(y) = x$, so $f'(y)\\frac{dy}{dx} = 1$:\n\n$$\\left(f^{-1}\\right)'(x) = \\frac{1}{f'\\left(f^{-1}(x)\\right)}.$$\n\nFor $f(x) = e^{2x}$, $f'(x) = 2e^{2x}$ and $f\\left(f^{-1}(x)\\right) = x$, so\n\n$$\\left(f^{-1}\\right)'(x) = \\frac{1}{2e^{2f^{-1}(x)}} = \\frac{1}{2x}.$$\n\nCheck: the inverse is $f^{-1}(x) = \\frac{1}{2}\\ln x$, and differentiating it directly gives $\\frac{1}{2}$ times $\\frac{1}{x}$, which is $\\frac{1}{2x}$.\n\n> **Watch out.** $f'$ is evaluated at $f^{-1}(x)$, not at $x$, so $\\left(f^{-1}\\right)'(x)$ is not $\\frac{1}{f'(x)}$. And $f^{-1}$ is the inverse function, not the reciprocal $\\frac{1}{f}$.",
        "反函数的图像是原图像的对称图形，所以它在一点处的斜率是原函数在对称点处斜率的倒数。若 $y = f^{-1}(x)$，则 $f(y) = x$，于是 $f'(y)\\frac{dy}{dx} = 1$：\n\n$$\\left(f^{-1}\\right)'(x) = \\frac{1}{f'\\left(f^{-1}(x)\\right)}.$$\n\n对 $f(x) = e^{2x}$，$f'(x) = 2e^{2x}$，且 $f\\left(f^{-1}(x)\\right) = x$，所以\n\n$$\\left(f^{-1}\\right)'(x) = \\frac{1}{2e^{2f^{-1}(x)}} = \\frac{1}{2x}.$$\n\n检验：反函数是 $f^{-1}(x) = \\frac{1}{2}\\ln x$，直接对它求导得 $\\frac{1}{2}$ 乘以 $\\frac{1}{x}$，即 $\\frac{1}{2x}$。\n\n> **注意。** $f'$ 要在 $f^{-1}(x)$ 处取值，而不是在 $x$ 处，所以 $\\left(f^{-1}\\right)'(x)$ 不是 $\\frac{1}{f'(x)}$。另外 $f^{-1}$ 表示反函数，不是倒数 $\\frac{1}{f}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const prefix = "\\left(f^{-1}\\right)'(x) =";
        if (kind === 0) {
          const a = rng.pick([2, 3, 4, 5, -1, -2]);
          const b = rng.int(-4, 4);
          const f = `e^{${poly([a, "x"], [b, ""])}}`;
          const answer = fracL(a < 0 ? -1 : 1, poly([Math.abs(a), "x"]));
          const g = (x: number) => (Math.log(x) - b) / a;
          const slope = Q.of(1, a);
          return functionProblem({
            prompt: t(
              `Let $f(x) = ${f}$. Find $\\left(f^{-1}\\right)'(x)$ for $x > 0$.`,
              `设 $f(x) = ${f}$。当 $x > 0$ 时，求 $\\left(f^{-1}\\right)'(x)$。`,
            ),
            answer,
            prefix,
            positive: true,
            wrong: [`\\frac{1}{${f}}`, poly([a, "x"]), `\\frac{1}{x}`],
            solution: walked(
              [
                [
                  ["Differentiate f", "对 f 求导"],
                  t(
                    `By the chain rule $f'(x) = ${poly([a, f])}$, which is $${a}$ times $f(x)$ itself.`,
                    `由链式法则 $f'(x) = ${poly([a, f])}$，它是 $f(x)$ 本身的 $${a}$ 倍。`,
                  ),
                ],
                [
                  ["Evaluate at the inverse", "在反函数处取值"],
                  t(
                    `Since $f\\left(f^{-1}(x)\\right) = x$, $f'\\left(f^{-1}(x)\\right) = ${poly([a, "x"])}$, and the inverse rule gives`,
                    `因为 $f\\left(f^{-1}(x)\\right) = x$，所以 $f'\\left(f^{-1}(x)\\right) = ${poly([a, "x"])}$，反函数法则给出`,
                  ),
                  [`\\left(f^{-1}\\right)'(x) = \\frac{1}{${poly([a, "x"])}}${a < 0 ? ` = ${answer}` : ""}`],
                ],
              ],
              led(
                t(
                  `Solving $y = ${f}$ for $x$ gives the inverse $g(x) = \\frac{${sumLatex(["\\ln x", String(-b)])}}{${a}}$. At $x = 1$ the answer gives $${slope.toLatex()}$.`,
                  `由 $y = ${f}$ 解出 $x$，得反函数 $g(x) = \\frac{${sumLatex(["\\ln x", String(-b)])}}{${a}}$。在 $x = 1$ 处答案给出 $${slope.toLatex()}$。`,
                ),
                slopeCheck(g, slope.toNumber(), 1, "1", "g", slope.toLatex()),
              ),
            ),
          });
        }
        if (kind === 1) {
          const c = rng.int(-6, 0);
          const k = rng.pick([1, 1, 2, 3]);
          const f = poly([k, "x^{3}"], [c, ""]);
          const inside = poly([1, "x"], [-c, ""]);
          const arg = k === 1 ? inside : `\\frac{${inside}}{${k}}`;
          const answer = `\\frac{1}{${3 * k}\\left(${arg}\\right)^{\\frac{2}{3}}}`;
          const g = (x: number) => Math.cbrt((x - c) / k);
          const slope = Q.of(1, 3 * k);
          return functionProblem({
            prompt: t(
              `Let $f(x) = ${f}$. Find $\\left(f^{-1}\\right)'(x)$ for $x > ${c}$.`,
              `设 $f(x) = ${f}$。当 $x > ${c}$ 时，求 $\\left(f^{-1}\\right)'(x)$。`,
            ),
            answer,
            prefix,
            positive: true,
            wrong: [
              `\\frac{1}{${poly([3 * k, "x^{2}"])}}`,
              `${3 * k}\\left(${arg}\\right)^{\\frac{2}{3}}`,
              `\\frac{1}{3\\left(${arg}\\right)^{\\frac{2}{3}}}`,
            ],
            solution: walked(
              [
                [
                  ["Find the inverse", "求反函数"],
                  t(`Solve $y = ${f}$ for $x$ and swap the letters:`, `由 $y = ${f}$ 解出 $x$，再交换字母：`),
                  [`f^{-1}(x) = \\left(${arg}\\right)^{\\frac{1}{3}}`],
                ],
                [
                  ["Apply the inverse rule", "用反函数法则"],
                  t(
                    `With $f'(x) = ${poly([3 * k, "x^{2}"])}$, evaluated at $f^{-1}(x)$:`,
                    `取 $f'(x) = ${poly([3 * k, "x^{2}"])}$，在 $f^{-1}(x)$ 处取值：`,
                  ),
                  [`\\left(f^{-1}\\right)'(x) = \\frac{1}{${3 * k}\\left(f^{-1}(x)\\right)^{2}} = ${answer}`],
                ],
              ],
              led(
                t(
                  `Write $g$ for the inverse. At $x = ${c + k}$ the bracket is $1$, so the answer gives $${slope.toLatex()}$.`,
                  `把反函数记作 $g$。在 $x = ${c + k}$ 处括号等于 $1$，所以答案给出 $${slope.toLatex()}$。`,
                ),
                slopeCheck(g, slope.toNumber(), c + k, String(c + k), "g", slope.toLatex()),
              ),
            ),
          });
        }
        const b = rng.int(-5, 5);
        const f = sumLatex(["\\ln x", String(b)]);
        const g = `e^{${poly([1, "x"], [-b, ""])}}`;
        return functionProblem({
          prompt: t(
            `Let $f(x) = ${f}$ for $x > 0$. Find $\\left(f^{-1}\\right)'(x)$.`,
            `设 $f(x) = ${f}$，$x > 0$。求 $\\left(f^{-1}\\right)'(x)$。`,
          ),
          answer: g,
          prefix,
          wrong: ["\\frac{1}{x}", "e^{x}", `-${g}`],
          solution: walked(
            [
              [
                ["Find the derivative and the inverse", "求导数和反函数"],
                t(
                  `$f'(x) = \\frac{1}{x}$. Solving $y = ${f}$ for $x$ gives $f^{-1}(x) = ${g}$.`,
                  `$f'(x) = \\frac{1}{x}$。由 $y = ${f}$ 解出 $x$，得 $f^{-1}(x) = ${g}$。`,
                ),
              ],
              [
                ["Apply the inverse rule", "用反函数法则"],
                t(
                  `$f'\\left(f^{-1}(x)\\right)$ is $1$ over $${g}$, and its reciprocal is`,
                  `$f'\\left(f^{-1}(x)\\right)$ 等于 $1$ 除以 $${g}$，它的倒数是`,
                ),
                [`\\left(f^{-1}\\right)'(x) = ${g}`],
              ],
            ],
            led(
              t(
                `Write $g$ for the inverse. At $x = ${b}$ the answer gives $e^{0} = 1$.`,
                `把反函数记作 $g$。在 $x = ${b}$ 处答案给出 $e^{0} = 1$。`,
              ),
              slopeCheck((x) => Math.exp(x - b), 1, b, String(b), "g"),
            ),
          ),
        });
      },
    },
    {
      id: "slopes-of-inverse-functions-are-reciprocals",
      figure: calculusDrawings2["differentiating-inverse-functions#slopes-of-inverse-functions-are-reciprocals"],
      title: t("Slopes of inverse functions are reciprocals", "反函数的斜率互为倒数"),
      explanation: t(
        "The graph of $f^{-1}$ is the reflection of the graph of $f$ in the line $y = x$. If $f(a) = b$ and $f'(a) = m \\ne 0$, then $f^{-1}(b) = a$ and\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{m}.$$\n\nFor example, if $f(2) = 5$ and $f'(2) = 3$, then $\\left(f^{-1}\\right)'(5) = \\frac{1}{3}$.\n\nCheck: near $x = 2$, $f$ is close to its tangent line $y = 5 + 3(x - 2)$. Solving it for $x$ gives $x = 2 + \\frac{1}{3}(y - 5)$, a line of slope $\\frac{1}{3}$ through $(5, 2)$ once the letters are swapped.\n\n> **Watch out.** The inverse's slope is taken at $b$, the output of $f$, and uses $f'(a)$, the slope at the input. Its value is a reciprocal, $\\frac{1}{m}$, not the negative reciprocal $-\\frac{1}{m}$ of a perpendicular line.",
        "$f^{-1}$ 的图像是 $f$ 的图像关于直线 $y = x$ 的对称图形。若 $f(a) = b$，$f'(a) = m \\ne 0$，则 $f^{-1}(b) = a$，且\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{m}.$$\n\n例如，若 $f(2) = 5$，$f'(2) = 3$，则 $\\left(f^{-1}\\right)'(5) = \\frac{1}{3}$。\n\n检验：在 $x = 2$ 附近，$f$ 接近它的切线 $y = 5 + 3(x - 2)$。对 $x$ 解出得 $x = 2 + \\frac{1}{3}(y - 5)$，交换字母后，这是过 $(5, 2)$、斜率为 $\\frac{1}{3}$ 的直线。\n\n> **注意。** 反函数的斜率在 $b$（即 $f$ 的输出）处取，用的是输入处的斜率 $f'(a)$。它是倒数 $\\frac{1}{m}$，不是垂直直线的负倒数 $-\\frac{1}{m}$。",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        const b = rng.pick(range(-9, 9).filter((v) => v !== a));
        const m = Q.of(rng.nonZero(-9, 9), rng.pick([1, 1, 2, 3, 4, 5]));
        const answer = Q.one.div(m);
        return numberProblem({
          prompt: t(
            `A differentiable function $f$ has an inverse, with $f(${a}) = ${b}$ and $f'(${a}) = ${m.toLatex()}$. Find $\\left(f^{-1}\\right)'(${b})$.`,
            `可导函数 $f$ 有反函数，且 $f(${a}) = ${b}$，$f'(${a}) = ${m.toLatex()}$。求 $\\left(f^{-1}\\right)'(${b})$。`,
          ),
          answer,
          wrong: [m, m.neg(), answer.neg()],
          solution: walked(
            [
              [
                ["Read the point of the inverse", "找出反函数上的点"],
                t(
                  `Since $f(${a}) = ${b}$, the inverse sends $${b}$ back to $${a}$: $f^{-1}(${b}) = ${a}$.`,
                  `因为 $f(${a}) = ${b}$，反函数把 $${b}$ 送回 $${a}$：$f^{-1}(${b}) = ${a}$。`,
                ),
              ],
              [
                ["Take the reciprocal slope", "取斜率的倒数"],
                t(
                  `The slope of $f^{-1}$ at $${b}$ is the reciprocal of the slope of $f$ at $${a}$:`,
                  `$f^{-1}$ 在 $${b}$ 处的斜率是 $f$ 在 $${a}$ 处斜率的倒数：`,
                ),
                [`\\left(f^{-1}\\right)'(${b}) = \\frac{1}{f'(${a})} = ${answer.toLatex()}`],
              ],
            ],
            lineCheck(a, b, m, answer),
          ),
        });
      },
    },
  ],
};

/** differentiatingAnInverseFunctionAtAPoint evaluates (f⁻¹)' at a point. */
export const differentiatingAnInverseFunctionAtAPoint: TopicDef = {
  id: "differentiating-an-inverse-function-at-a-point",
  title: t("Differentiating an Inverse Function at a Point", "求反函数在某点处的导数"),
  summary: t(
    "Find the derivative of an inverse function at a point without finding the inverse.",
    "不求出反函数，直接计算反函数在某点处的导数。",
  ),
  prerequisites: ["differentiating-inverse-functions"],
  encompasses: [{ topic: "differentiating-inverse-functions", weight: 0.6 }],
  xp: 12,
  standards: [],
  intro: t(
    `The rule $\\left(f^{-1}\\right)'(b) = \\frac{1}{f'(a)}$, where $f(a) = b$, needs only one point of $f$ and the slope there, not a formula for the inverse. The function $f(x) = x^{3} + x$ is increasing, but solving $y = x^{3} + x$ for $x$ is hard. Still, $f(2) = 10$ and $f'(2) = 3(2)^{2} + 1 = 13$, so

$$\\left(f^{-1}\\right)'(10) = \\frac{1}{13}.$$

Check: $f(2.01) \\approx 10.1306$. So when the input of $f^{-1}$ grows from $10$ to $10.1306$, its output grows from $2$ to $2.01$, a slope of about $0.0766$, close to $\\frac{1}{13} \\approx 0.0769$.

In this lesson we find derivatives of inverse functions at a point, from a formula for $f$ or from a table of its values.`,
    `法则 $\\left(f^{-1}\\right)'(b) = \\frac{1}{f'(a)}$（其中 $f(a) = b$）只需要 $f$ 上的一个点和那里的斜率，不需要反函数的表达式。函数 $f(x) = x^{3} + x$ 是增函数，但由 $y = x^{3} + x$ 解出 $x$ 很难。不过 $f(2) = 10$，$f'(2) = 3(2)^{2} + 1 = 13$，所以

$$\\left(f^{-1}\\right)'(10) = \\frac{1}{13}.$$

检验：$f(2.01) \\approx 10.1306$。所以当 $f^{-1}$ 的输入从 $10$ 增加到 $10.1306$ 时，它的值从 $2$ 增加到 $2.01$，斜率约为 $0.0766$，接近 $\\frac{1}{13} \\approx 0.0769$。

这节课我们由 $f$ 的表达式或它的取值表，求反函数在某点处的导数。`,
  ),
  knowledgePoints: [
    {
      id: "inverse-derivatives-of-polynomials-at-a-point",
      title: t("Inverse derivatives of polynomials at a point", "多项式反函数在某点处的导数"),
      explanation: t(
        "To find $\\left(f^{-1}\\right)'(b)$, first find $a$ with $f(a) = b$ (often by trying small integers), then\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{f'(a)}.$$\n\nFor $f(x) = x^{3} + x$ and $b = 10$: $f(2) = 10$ and $f'(2) = 13$, so $\\left(f^{-1}\\right)'(10) = \\frac{1}{13}$.\n\nCheck: $f(1.99) \\approx 9.8706$ and $f(2.01) \\approx 10.1306$. Over that stretch the inverse rises $0.02$ while its input grows by $0.26$, a slope of about $0.0769$, which is $\\frac{1}{13}$ to four places.\n\n> **Watch out.** Evaluate $f'$ at $a$, the solution of $f(a) = b$, and not at $b$ itself. $\\frac{1}{f'(b)}$ is a different number.",
        "求 $\\left(f^{-1}\\right)'(b)$ 时，先找出满足 $f(a) = b$ 的 $a$（常可尝试较小的整数），则\n\n$$\\left(f^{-1}\\right)'(b) = \\frac{1}{f'(a)}.$$\n\n对 $f(x) = x^{3} + x$，$b = 10$：$f(2) = 10$，$f'(2) = 13$，所以 $\\left(f^{-1}\\right)'(10) = \\frac{1}{13}$。\n\n检验：$f(1.99) \\approx 9.8706$，$f(2.01) \\approx 10.1306$。在这一段上，反函数的输入增加 $0.26$ 时它的值增加 $0.02$，斜率约为 $0.0769$，与 $\\frac{1}{13}$ 的前四位小数一致。\n\n> **注意。** $f'$ 要在 $a$（即 $f(a) = b$ 的解）处取值，而不是在 $b$ 处。$\\frac{1}{f'(b)}$ 是另一个数。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(-6, 6), rng.int(1, 6), 0, rng.pick([1, 1, 2])];
        const a = rng.int(-2, 2);
        const b = pAt(p, a);
        const d = pAt(pDer(p), a);
        const answer = Q.of(1, d);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$, which is increasing and so has an inverse. Find $\\left(f^{-1}\\right)'(${b})$.`,
            `设 $f(x) = ${pLatex(p)}$，它是增函数，因此有反函数。求 $\\left(f^{-1}\\right)'(${b})$。`,
          ),
          answer,
          wrong: [Q.of(d), Q.of(1, pAt(pDer(p), b)), Q.of(a)],
          solution: walked(
            [
              [
                ["Find the input that gives the value", "找出给出该值的输入"],
                t(
                  `Try small integers: $f(${a}) = ${b}$, so $f^{-1}(${b}) = ${a}$.`,
                  `尝试较小的整数：$f(${a}) = ${b}$，所以 $f^{-1}(${b}) = ${a}$。`,
                ),
              ],
              [
                ["Differentiate and take the reciprocal", "求导并取倒数"],
                t(`$f'(x) = ${pLatex(pDer(p))}$, so $f'(${a}) = ${d}$ and`, `$f'(x) = ${pLatex(pDer(p))}$，所以 $f'(${a}) = ${d}$，于是`),
                [`\\left(f^{-1}\\right)'(${b}) = ${reciprocal(d)}`],
              ],
            ],
            swapCheck((x) => pAt(p, x), a, answer),
          ),
        });
      },
    },
    {
      id: "inverse-derivatives-from-a-table",
      title: t("Inverse derivatives from a table", "由表格求反函数的导数"),
      explanation: t(
        "To find $\\left(f^{-1}\\right)'(b)$ from a table, look for $b$ among the values of $f(x)$, not of $x$. The $x$ in that column is $f^{-1}(b)$; take the reciprocal of $f'$ there. For example, if the table shows $f(3) = 7$ and $f'(3) = 4$, then $\\left(f^{-1}\\right)'(7) = \\frac{1}{4}$.\n\nCheck: near $x = 3$, $f$ is close to $y = 7 + 4(x - 3)$. Solved for $x$, this is $x = 3 + \\frac{1}{4}(y - 7)$, a line of slope $\\frac{1}{4}$ through the point $(7, 3)$ of the inverse.\n\n> **Watch out.** Look for $b$ in the $f(x)$ row. If $b$ also appears in the $x$ row, the $f'$ in that column belongs to the wrong point.",
        "由表格求 $\\left(f^{-1}\\right)'(b)$ 时，要在 $f(x)$ 的值中找 $b$，而不是在 $x$ 中找。该列的 $x$ 就是 $f^{-1}(b)$，再取该处 $f'$ 的倒数。例如，若表中 $f(3) = 7$，$f'(3) = 4$，则 $\\left(f^{-1}\\right)'(7) = \\frac{1}{4}$。\n\n检验：在 $x = 3$ 附近，$f$ 接近 $y = 7 + 4(x - 3)$。对 $x$ 解出得 $x = 3 + \\frac{1}{4}(y - 7)$，这是过反函数上的点 $(7, 3)$、斜率为 $\\frac{1}{4}$ 的直线。\n\n> **注意。** 要在 $f(x)$ 那一行找 $b$。如果 $b$ 也出现在 $x$ 那一行，那一列的 $f'$ 属于另一个点。",
      ),
      generate(rng) {
        const xs = [1, 2, 3, 4];
        const values = rng.sample([-3, -1, 0, 2, 5, 6, 7, 8, 9, 11], 4).sort((u, v) => u - v);
        const slopes = xs.map(() => rng.pick([1, 2, 3, 4, 5, 6]));
        const j = rng.int(0, 3);
        const b = values[j]!;
        const s = slopes[j]!;
        const x = xs[j]!;
        const answer = Q.of(1, s);
        const tab = table(
          ["$x$", ...xs.map((v) => `$${v}$`)],
          ["$f(x)$", ...values.map((v) => `$${v}$`)],
          ["$f'(x)$", ...slopes.map((v) => `$${v}$`)],
        );
        const k = xs.indexOf(b);
        return numberProblem({
          prompt: t(
            `$f$ is differentiable and increasing. The table gives some of its values.\n\n${tab}\n\nFind $\\left(f^{-1}\\right)'(${b})$.`,
            `$f$ 可导且递增。下表给出它的一些值。\n\n${tab}\n\n求 $\\left(f^{-1}\\right)'(${b})$。`,
          ),
          answer,
          wrong: [Q.of(s), ...(k >= 0 ? [Q.of(1, slopes[k]!), Q.of(slopes[k]!)] : [Q.of(1, x)])],
          solution: walked(
            [
              [
                ["Find the value in the f(x) row", "在 f(x) 行中找到该值"],
                t(
                  `$${b}$ appears in the $f(x)$ row under $x = ${x}$, so $f(${x}) = ${b}$ and $f^{-1}(${b}) = ${x}$.`,
                  `$${b}$ 出现在 $f(x)$ 行中 $x = ${x}$ 的下方，所以 $f(${x}) = ${b}$，$f^{-1}(${b}) = ${x}$。`,
                ),
              ],
              [
                ["Take the reciprocal of the slope", "取斜率的倒数"],
                t(`The same column gives $f'(${x}) = ${s}$, so`, `同一列给出 $f'(${x}) = ${s}$，所以`),
                [`\\left(f^{-1}\\right)'(${b}) = \\frac{1}{f'(${x})} = ${answer.toLatex()}`],
              ],
            ],
            lineCheck(x, b, Q.of(s), answer),
          ),
        });
      },
    },
  ],
};

/** InverseRule is an inverse function with its derivative in LaTeX, a typical wrong derivative, both as numbers, and a point inside its domain for checking. */
interface InverseRule {
  readonly name: string;
  readonly d: string;
  readonly bad: string;
  readonly at: (x: number) => number;
  readonly slope: (x: number) => number;
  readonly x0: number;
}

/** scaled writes k times a derivative written as a fraction with an optional leading minus. */
function scaled(k: number, d: string): string {
  const negative = d.startsWith("-");
  const body = negative ? d.slice(1) : d;
  const sign = k < 0 !== negative ? "-" : "";
  const m = /^\\frac\{1\}(.*)$/.exec(body);
  const abs = Math.abs(k);
  return m ? `${sign}\\frac{${abs}}${m[1]}` : `${sign}${abs === 1 ? "" : abs}${body}`;
}

/** inverseTrigRules are the derivatives of arcsin, arccos and arctan. */
const inverseTrigRules: readonly InverseRule[] = [
  {
    name: "\\arcsin x",
    d: "\\frac{1}{\\sqrt{1 - x^{2}}}",
    bad: "\\frac{1}{\\sqrt{1 + x^{2}}}",
    at: Math.asin,
    slope: (x) => 1 / Math.sqrt(1 - x * x),
    x0: 0.5,
  },
  {
    name: "\\arccos x",
    d: "-\\frac{1}{\\sqrt{1 - x^{2}}}",
    bad: "\\frac{1}{\\sqrt{1 - x^{2}}}",
    at: Math.acos,
    slope: (x) => -1 / Math.sqrt(1 - x * x),
    x0: 0.5,
  },
  {
    name: "\\arctan x",
    d: "\\frac{1}{1 + x^{2}}",
    bad: "\\frac{1}{1 - x^{2}}",
    at: Math.atan,
    slope: (x) => 1 / (1 + x * x),
    x0: 0.5,
  },
];

/** ruleLines writes the derivative of each named inverse function as a displayed line. */
const ruleLines = (rules: readonly InverseRule[]) => rules.map((r) => `\\frac{d}{dx}${r.name} = ${r.d}`);

/** differentiatingInverseTrigonometricFunctions differentiates arcsin, arccos and arctan. */
export const differentiatingInverseTrigonometricFunctions: TopicDef = {
  id: "differentiating-inverse-trigonometric-functions",
  title: t("Differentiating Inverse Trigonometric Functions", "反三角函数求导"),
  summary: t(
    "Differentiate arcsin, arccos and arctan, including with inner functions.",
    "对 arcsin、arccos、arctan 求导，包括含内层函数的情形。",
  ),
  prerequisites: ["differentiating-inverse-functions", "evaluating-expressions-containing-inverse-trigonometric-functions"],
  encompasses: [],
  xp: 12,
  standards: [],
  intro: t(
    `The inverse rule applies to $\\arcsin x$, the inverse of $\\sin x$ on $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. If $y = \\arcsin x$, then $\\sin y = x$, and differentiating gives $\\cos y\\,\\frac{dy}{dx} = 1$. At $x = \\frac{1}{2}$, $y = \\frac{\\pi}{6}$ and $\\cos y = \\frac{\\sqrt{3}}{2}$, so

$$\\frac{dy}{dx} = \\frac{2}{\\sqrt{3}} \\approx 1.155.$$

Check: $\\arcsin 0.51 \\approx 0.53519$ and $\\arcsin 0.49 \\approx 0.51209$. Their difference over $0.02$ is about $1.155$.

In this lesson we derive and use the derivatives of $\\arcsin x$, $\\arccos x$ and $\\arctan x$, also with an inner function.`,
    `反函数法则适用于 $\\arcsin x$，它是 $\\sin x$ 在 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 上的反函数。若 $y = \\arcsin x$，则 $\\sin y = x$，求导得 $\\cos y\\,\\frac{dy}{dx} = 1$。在 $x = \\frac{1}{2}$ 处 $y = \\frac{\\pi}{6}$，$\\cos y = \\frac{\\sqrt{3}}{2}$，所以

$$\\frac{dy}{dx} = \\frac{2}{\\sqrt{3}} \\approx 1.155.$$

检验：$\\arcsin 0.51 \\approx 0.53519$，$\\arcsin 0.49 \\approx 0.51209$。两者之差除以 $0.02$ 约为 $1.155$。

这节课我们推导并使用 $\\arcsin x$、$\\arccos x$ 和 $\\arctan x$ 的导数，也包括含内层函数的情形。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-arcsin-arccos-and-arctan",
      title: t("Derivatives of arcsin, arccos and arctan", "arcsin、arccos、arctan 的导数"),
      explanation: t(
        "These formulas come from implicit differentiation of the inverse relation, followed by a Pythagorean identity that removes the trigonometric functions:\n\n$$\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arccos x = -\\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^{2}}.$$\n\nFor $y = \\arcsin x$, $\\sin y = x$, so $\\cos y\\,\\frac{dy}{dx} = 1$, and $\\cos y = \\sqrt{1 - x^{2}}$ since $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$. For example, $f(x) = 3\\arctan x - \\arcsin x$ has $f'(0) = 3 - 1 = 2$.\n\nCheck: the difference quotients of this $f$ at $0$ with $h = \\pm 0.01$ are both about $2.000$.\n\n> **Watch out.** $\\arccos x$ has the derivative of $\\arcsin x$ with a minus sign, and the derivative of $\\arctan x$ has $1 + x^{2}$ with no root. Also, $\\arcsin x$ is the inverse function, not $\\frac{1}{\\sin x}$.",
        "这些公式来自对反函数关系进行隐函数求导，再用勾股恒等式消去三角函数：\n\n$$\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arccos x = -\\frac{1}{\\sqrt{1 - x^{2}}}, \\qquad \\frac{d}{dx}\\arctan x = \\frac{1}{1 + x^{2}}.$$\n\n对 $y = \\arcsin x$，$\\sin y = x$，所以 $\\cos y\\,\\frac{dy}{dx} = 1$；由于 $-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}$，$\\cos y = \\sqrt{1 - x^{2}}$。例如 $f(x) = 3\\arctan x - \\arcsin x$ 有 $f'(0) = 3 - 1 = 2$。\n\n检验：这个 $f$ 在 $0$ 处取 $h = \\pm 0.01$ 的差商都约为 $2.000$。\n\n> **注意。** $\\arccos x$ 的导数是 $\\arcsin x$ 的导数加负号，$\\arctan x$ 的导数是 $1 + x^{2}$ 分之一，没有根号。另外，$\\arcsin x$ 表示反函数，不是 $\\frac{1}{\\sin x}$。",
      ),
      generate(rng) {
        const [r1, r2] = rng.sample(inverseTrigRules, 2) as [InverseRule, InverseRule];
        const a = rng.pick([1, 1, 2, 3, 4, 5, -1, -2, -3]);
        const b = rng.int(-4, 4);
        const f = sumLatex([poly([a, r1.name]), poly([b, r2.name])]);
        const answer = sumLatex([scaled(a, r1.d), b === 0 ? "" : scaled(b, r2.d)]);
        const value = (x: number) => a * r1.at(x) + b * r2.at(x);
        const slope = a * r1.slope(0.5) + b * r2.slope(0.5);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            sumLatex([scaled(a, r1.bad), b === 0 ? "" : scaled(b, r2.bad)]),
            sumLatex([scaled(-a, r1.d), b === 0 ? "" : scaled(b, r2.d)]),
          ],
          solution: walked(
            [
              [
                ["Recall the rules", "回顾求导公式"],
                b === 0
                  ? t("The function has one term, with the rule", "函数只有一项，其公式为")
                  : t("Each term has its rule:", "每一项都有它的公式："),
                ruleLines(b === 0 ? [r1] : [r1, r2]),
              ],
              [
                ["Multiply by the coefficients", "乘以系数"],
                t("The constant multiples stay, and the terms add:", "常数倍保留，各项相加："),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck(value, slope, 0.5),
          ),
        });
      },
    },
    {
      id: "inverse-trigonometric-functions-of-inner-functions",
      title: t("Inverse trigonometric functions of inner functions", "内层函数的反三角函数"),
      explanation: t(
        "Apply the formula for the inverse function with the inner function in place of the variable, then multiply by the derivative of the inner function. Use the chain rule. For example,\n\n$$\\frac{d}{dx}\\arctan(3x) = \\frac{3}{1 + 9x^{2}}, \\qquad \\frac{d}{dx}\\arcsin\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{\\sqrt{1 - \\frac{x^{2}}{4}}} = \\frac{1}{\\sqrt{4 - x^{2}}}.$$\n\nCheck: the first gives $3$ at $x = 0$, and the difference quotients of $\\arctan(3x)$ at $0$ with $h = \\pm 0.01$ are both about $2.999$.\n\n> **Watch out.** Multiply by the inner derivative, and square the whole inner function: $(3x)^{2} = 9x^{2}$, not $3x^{2}$.",
        "把内层函数代替变量套用反函数的求导公式，再乘以内层函数的导数。使用链式法则。例如\n\n$$\\frac{d}{dx}\\arctan(3x) = \\frac{3}{1 + 9x^{2}}, \\qquad \\frac{d}{dx}\\arcsin\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{\\sqrt{1 - \\frac{x^{2}}{4}}} = \\frac{1}{\\sqrt{4 - x^{2}}}.$$\n\n检验：第一个式子在 $x = 0$ 处为 $3$，而 $\\arctan(3x)$ 在 $0$ 处取 $h = \\pm 0.01$ 的差商都约为 $2.999$。\n\n> **注意。** 要乘以内层函数的导数，并且整个内层函数都要平方：$(3x)^{2} = 9x^{2}$，不是 $3x^{2}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const k = rng.int(2, 9);
        const over = `\\frac{x}{${k}}`;
        const pieces: readonly {
          f: string;
          outer: string;
          inner: string;
          du: string;
          chain: string;
          answer: string;
          wrong: string[];
          at: (x: number) => number;
          slope: number;
        }[] = [
          {
            f: `\\arcsin\\left(${over}\\right)`,
            outer: "\\arcsin u",
            inner: over,
            du: `\\frac{1}{${k}}`,
            chain: `\\frac{1}{\\sqrt{1 - \\left(${over}\\right)^{2}}} \\cdot \\frac{1}{${k}} = \\frac{1}{${k}\\sqrt{1 - \\frac{x^{2}}{${k * k}}}}`,
            answer: `\\frac{1}{\\sqrt{${k * k} - x^{2}}}`,
            wrong: ["\\frac{1}{\\sqrt{1 - x^{2}}}", `\\frac{${k}}{\\sqrt{${k * k} - x^{2}}}`],
            at: (x) => Math.asin(x / k),
            slope: 1 / Math.sqrt(k * k - 1),
          },
          {
            f: `\\arccos\\left(${over}\\right)`,
            outer: "\\arccos u",
            inner: over,
            du: `\\frac{1}{${k}}`,
            chain: `-\\frac{1}{\\sqrt{1 - \\left(${over}\\right)^{2}}} \\cdot \\frac{1}{${k}} = -\\frac{1}{${k}\\sqrt{1 - \\frac{x^{2}}{${k * k}}}}`,
            answer: `-\\frac{1}{\\sqrt{${k * k} - x^{2}}}`,
            wrong: [`\\frac{1}{\\sqrt{${k * k} - x^{2}}}`, `-\\frac{1}{${k}\\sqrt{1 - x^{2}}}`],
            at: (x) => Math.acos(x / k),
            slope: -1 / Math.sqrt(k * k - 1),
          },
          {
            f: `\\arctan(${k}x)`,
            outer: "\\arctan u",
            inner: `${k}x`,
            du: `${k}`,
            chain: `\\frac{1}{1 + (${k}x)^{2}} \\cdot ${k}`,
            answer: `\\frac{${k}}{1 + ${k * k}x^{2}}`,
            wrong: [`\\frac{1}{1 + ${k * k}x^{2}}`, `\\frac{${k}}{1 + x^{2}}`],
            at: (x) => Math.atan(k * x),
            slope: k / (1 + k * k),
          },
          {
            f: `\\arctan\\left(${over}\\right)`,
            outer: "\\arctan u",
            inner: over,
            du: `\\frac{1}{${k}}`,
            chain: `\\frac{1}{1 + \\left(${over}\\right)^{2}} \\cdot \\frac{1}{${k}} = \\frac{1}{${k} + \\frac{x^{2}}{${k}}}`,
            answer: `\\frac{${k}}{${k * k} + x^{2}}`,
            wrong: [`\\frac{1}{${k * k} + x^{2}}`, "\\frac{1}{1 + x^{2}}"],
            at: (x) => Math.atan(x / k),
            slope: k / (k * k + 1),
          },
        ];
        const c = pieces[kind]!;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${c.f}$.`, `设 $f(x) = ${c.f}$。求 $f'(x)$。`),
          answer: c.answer,
          prefix: "f'(x) =",
          wrong: c.wrong,
          solution: walked(
            [
              [
                ["Name the outer and inner functions", "找出外层和内层函数"],
                t(
                  `The outer function is $${c.outer}$, with $u = ${c.inner}$ and $u' = ${c.du}$.`,
                  `外层函数是 $${c.outer}$，其中 $u = ${c.inner}$，$u' = ${c.du}$。`,
                ),
              ],
              [
                ["Apply the chain rule and simplify", "用链式法则并化简"],
                t(
                  "Put $u$ into the outer derivative, multiply by $u'$, and clear the fraction inside:",
                  "把 $u$ 代入外层函数的导数，乘以 $u'$，再消去里面的分数：",
                ),
                [`f'(x) = ${c.chain}`, `= ${c.answer}`],
              ],
            ],
            slopeCheck(c.at, c.slope, 1),
          ),
        });
      },
    },
  ],
};

/** inverseReciprocalTrigRules are the derivatives of arccot, arcsec and arccsc. */
const inverseReciprocalTrigRules: readonly InverseRule[] = [
  {
    name: "\\operatorname{arccot} x",
    d: "-\\frac{1}{1 + x^{2}}",
    bad: "\\frac{1}{1 + x^{2}}",
    at: (x) => Math.PI / 2 - Math.atan(x),
    slope: (x) => -1 / (1 + x * x),
    x0: -2,
  },
  {
    name: "\\operatorname{arcsec} x",
    d: "\\frac{1}{|x|\\sqrt{x^{2} - 1}}",
    bad: "\\frac{1}{x\\sqrt{x^{2} - 1}}",
    at: (x) => Math.acos(1 / x),
    slope: (x) => 1 / (Math.abs(x) * Math.sqrt(x * x - 1)),
    x0: -2,
  },
  {
    name: "\\operatorname{arccsc} x",
    d: "-\\frac{1}{|x|\\sqrt{x^{2} - 1}}",
    bad: "\\frac{1}{|x|\\sqrt{x^{2} - 1}}",
    at: (x) => Math.asin(1 / x),
    slope: (x) => -1 / (Math.abs(x) * Math.sqrt(x * x - 1)),
    x0: -2,
  },
];

/** differentiatingInverseReciprocalTrigonometricFunctions differentiates arccot, arcsec and arccsc. */
export const differentiatingInverseReciprocalTrigonometricFunctions: TopicDef = {
  id: "differentiating-inverse-reciprocal-trigonometric-functions",
  title: t("Differentiating Inverse Reciprocal Trigonometric Functions", "反倒数三角函数求导"),
  summary: t("Differentiate arccot, arcsec and arccsc, and evaluate their derivatives.", "对 arccot、arcsec、arccsc 求导并计算导数值。"),
  prerequisites: ["differentiating-inverse-trigonometric-functions"],
  encompasses: [{ topic: "differentiating-inverse-trigonometric-functions", weight: 0.2 }],
  xp: 10,
  standards: [],
  intro: t(
    `The derivative of $\\arctan x$ is $\\frac{1}{1 + x^{2}}$. Since $\\operatorname{arccot} x = \\frac{\\pi}{2} - \\arctan x$, the constant $\\frac{\\pi}{2}$ drops out and

$$\\frac{d}{dx}\\operatorname{arccot} x = -\\frac{1}{1 + x^{2}}.$$

At $x = 1$ this is $-\\frac{1}{2}$.

Check: the difference quotients of $\\operatorname{arccot} x$ at $x = 1$ with $h = 0.01$ and $h = -0.01$ are about $-0.4975$ and $-0.5025$, on either side of $-0.5$.

In this lesson we differentiate $\\operatorname{arccot} x$, $\\operatorname{arcsec} x$ and $\\operatorname{arccsc} x$, and evaluate their derivatives at points.`,
    `$\\arctan x$ 的导数是 $\\frac{1}{1 + x^{2}}$。由于 $\\operatorname{arccot} x = \\frac{\\pi}{2} - \\arctan x$，常数 $\\frac{\\pi}{2}$ 求导后消失，于是

$$\\frac{d}{dx}\\operatorname{arccot} x = -\\frac{1}{1 + x^{2}}.$$

在 $x = 1$ 处它等于 $-\\frac{1}{2}$。

检验：$\\operatorname{arccot} x$ 在 $x = 1$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $-0.4975$ 和 $-0.5025$，位于 $-0.5$ 的两侧。

这节课我们对 $\\operatorname{arccot} x$、$\\operatorname{arcsec} x$ 和 $\\operatorname{arccsc} x$ 求导，并计算它们在某些点处的导数值。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-arccot-arcsec-and-arccsc",
      title: t("Derivatives of arccot, arcsec and arccsc", "arccot、arcsec、arccsc 的导数"),
      explanation: t(
        "Each of these is the negative of, or closely related to, an earlier formula, and the absolute value in the arcsecant formula keeps its slope positive:\n\n$$\\frac{d}{dx}\\operatorname{arccot} x = -\\frac{1}{1 + x^{2}}, \\quad \\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{|x|\\sqrt{x^{2} - 1}}, \\quad \\frac{d}{dx}\\operatorname{arccsc} x = -\\frac{1}{|x|\\sqrt{x^{2} - 1}}.$$\n\nThe absolute value makes the slope of $\\operatorname{arcsec} x$ positive for $x < -1$ as well as for $x > 1$. For example, $f(x) = 4\\operatorname{arcsec} x$ has $f'(-2) = \\frac{4}{2\\sqrt{3}}$, about $1.155$.\n\nCheck: $\\operatorname{arcsec} x = \\arccos\\frac{1}{x}$, and the difference quotients of $4\\arccos\\frac{1}{x}$ at $x = -2$ with $h = \\pm 0.01$ are about $1.162$ and $1.148$, on either side of $1.155$.\n\n> **Watch out.** Keep the absolute value: with $x$ in place of $|x|$, the slope of $\\operatorname{arcsec} x$ would come out negative for $x < -1$, although its graph rises there.",
        "这些公式与前面的公式相差一个负号或密切相关，反正割公式中的绝对值保证了它的斜率为正：\n\n$$\\frac{d}{dx}\\operatorname{arccot} x = -\\frac{1}{1 + x^{2}}, \\quad \\frac{d}{dx}\\operatorname{arcsec} x = \\frac{1}{|x|\\sqrt{x^{2} - 1}}, \\quad \\frac{d}{dx}\\operatorname{arccsc} x = -\\frac{1}{|x|\\sqrt{x^{2} - 1}}.$$\n\n绝对值保证了 $\\operatorname{arcsec} x$ 在 $x < -1$ 和 $x > 1$ 时斜率都为正。例如 $f(x) = 4\\operatorname{arcsec} x$ 有 $f'(-2) = \\frac{4}{2\\sqrt{3}}$，约为 $1.155$。\n\n检验：$\\operatorname{arcsec} x = \\arccos\\frac{1}{x}$，而 $4\\arccos\\frac{1}{x}$ 在 $x = -2$ 处取 $h = \\pm 0.01$ 的差商约为 $1.162$ 和 $1.148$，位于 $1.155$ 的两侧。\n\n> **注意。** 绝对值不能丢：如果把 $|x|$ 写成 $x$，$\\operatorname{arcsec} x$ 在 $x < -1$ 时的斜率就成了负的，而它的图像在那里是上升的。",
      ),
      generate(rng) {
        const r = rng.pick(inverseReciprocalTrigRules);
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
        const f = poly([k, r.name]);
        const answer = scaled(k, r.d);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [scaled(k, r.bad), scaled(-k, r.d)],
          solution: walked(
            [
              [["Recall the rule", "回顾求导公式"], t("The rule for this inverse function is", "这个反函数的求导公式是"), ruleLines([r])],
              [
                ["Multiply by the coefficient", "乘以系数"],
                t(`The constant multiple $${k}$ stays:`, `常数倍 $${k}$ 保留：`),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => k * r.at(x), k * r.slope(r.x0), r.x0),
          ),
        });
      },
    },
    {
      id: "evaluating-derivatives-of-inverse-reciprocal-trigonometric-functions",
      title: t("Evaluating derivatives of inverse reciprocal trigonometric functions", "计算反倒数三角函数的导数值"),
      explanation: t(
        "Substitute the point into the derivative formula, keeping the absolute value and the signs, and then simplify the radical. For $\\operatorname{arcsec} x$ at $x = -2$:\n\n$$\\frac{1}{|-2|\\sqrt{4 - 1}} = \\frac{1}{2\\sqrt{3}} = \\frac{\\sqrt{3}}{6}.$$\n\nCheck: the difference quotients of $\\arccos\\frac{1}{x}$ at $x = -2$ with $h = \\pm 0.01$ are about $0.290$ and $0.287$, on either side of $\\frac{\\sqrt{3}}{6} \\approx 0.289$.\n\n> **Watch out.** $|-2|$ is $2$, not $-2$. Dropping the absolute value flips the sign of the answer.",
        "把该点代入导数公式，保留绝对值和符号，再化简根式。对 $\\operatorname{arcsec} x$ 在 $x = -2$ 处：\n\n$$\\frac{1}{|-2|\\sqrt{4 - 1}} = \\frac{1}{2\\sqrt{3}} = \\frac{\\sqrt{3}}{6}.$$\n\n检验：$\\arccos\\frac{1}{x}$ 在 $x = -2$ 处取 $h = \\pm 0.01$ 的差商约为 $0.290$ 和 $0.287$，位于 $\\frac{\\sqrt{3}}{6} \\approx 0.289$ 的两侧。\n\n> **注意。** $|-2|$ 等于 $2$，不是 $-2$。丢掉绝对值会使答案的符号反过来。",
      ),
      generate(rng) {
        const r = rng.int(0, 2);
        const k = rng.pick([1, 2, 3, 4, 6, -1, -2, -3]);
        const rule = inverseReciprocalTrigRules[r]!;
        let x0: number;
        let value: string;
        let substituted: string;
        if (r === 0) {
          x0 = rng.nonZero(-5, 5);
          value = Q.of(-k, 1 + x0 * x0).toLatex();
          substituted = `\\frac{${-k}}{1 + ${par(x0)}^{2}}`;
        } else {
          x0 = rng.pick([2, 3, -2, -3]);
          const num = r === 1 ? k : -k;
          const [rad, den] = Math.abs(x0) === 2 ? ["\\sqrt{3}", 6] : ["\\sqrt{2}", 12];
          const c = Q.of(num, den);
          const cn = c.n < 0n ? -c.n : c.n;
          value =
            c.d === 1n
              ? `${c.sign() < 0 ? "-" : ""}${cn === 1n ? "" : cn}${rad}`
              : `${c.sign() < 0 ? "-" : ""}\\frac{${cn === 1n ? "" : cn}${rad}}{${c.d}}`;
          substituted = `\\frac{${num}}{|${x0}|\\sqrt{${x0 * x0} - 1}}`;
        }
        const f = poly([k, rule.name]);
        return functionProblem({
          prompt: t(`Let $f(x) = ${f}$. Find $f'(${x0})$.`, `设 $f(x) = ${f}$。求 $f'(${x0})$。`),
          answer: value,
          prefix: `f'(${x0}) =`,
          wrong:
            r === 0
              ? [Q.of(k, 1 + x0 * x0).toLatex(), Q.of(-k, x0 * x0).toLatex()]
              : [value.startsWith("-") ? value.slice(1) : `-${value}`],
          solution: walked(
            [
              [
                ["Write the derivative", "写出导数"],
                t(`Multiply the rule for $${rule.name}$ by $${k}$:`, `把 $${rule.name}$ 的求导公式乘以 $${k}$：`),
                [`f'(x) = ${scaled(k, rule.d)}`],
              ],
              [
                ["Substitute and simplify", "代入并化简"],
                r === 0
                  ? t(`Put $x = ${x0}$ into the fraction:`, `把 $x = ${x0}$ 代入分数：`)
                  : t(
                      `Put $x = ${x0}$, with $|${x0}| = ${Math.abs(x0)}$, and rationalize the denominator:`,
                      `代入 $x = ${x0}$，其中 $|${x0}| = ${Math.abs(x0)}$，再把分母有理化：`,
                    ),
                [`f'(${x0}) = ${substituted} = ${value}`],
              ],
            ],
            slopeCheck((x) => k * rule.at(x), k * rule.slope(x0), x0),
          ),
        });
      },
    },
  ],
};

/** inverseHyperbolicRules are the derivatives of arsinh, arcosh and artanh. */
const inverseHyperbolicRules: readonly InverseRule[] = [
  {
    name: "\\operatorname{arsinh} x",
    d: "\\frac{1}{\\sqrt{x^{2} + 1}}",
    bad: "\\frac{1}{\\sqrt{1 - x^{2}}}",
    at: Math.asinh,
    slope: (x) => 1 / Math.sqrt(x * x + 1),
    x0: 0.75,
  },
  {
    name: "\\operatorname{arcosh} x",
    d: "\\frac{1}{\\sqrt{x^{2} - 1}}",
    bad: "-\\frac{1}{\\sqrt{1 - x^{2}}}",
    at: Math.acosh,
    slope: (x) => 1 / Math.sqrt(x * x - 1),
    x0: 1.25,
  },
  {
    name: "\\operatorname{artanh} x",
    d: "\\frac{1}{1 - x^{2}}",
    bad: "\\frac{1}{1 + x^{2}}",
    at: Math.atanh,
    slope: (x) => 1 / (1 - x * x),
    x0: 0.5,
  },
];

/** differentiatingInverseHyperbolicFunctions differentiates arsinh, arcosh and artanh. */
export const differentiatingInverseHyperbolicFunctions: TopicDef = {
  id: "differentiating-inverse-hyperbolic-functions",
  title: t("Differentiating Inverse Hyperbolic Functions", "反双曲函数求导"),
  summary: t(
    "Differentiate arsinh, arcosh and artanh, including with inner functions.",
    "对 arsinh、arcosh、artanh 求导，包括含内层函数的情形。",
  ),
  prerequisites: ["differentiating-inverse-trigonometric-functions", "the-inverse-hyperbolic-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The derivative of $\\arcsin x$ came from differentiating $\\sin y = x$. The same steps work for $y = \\operatorname{arsinh} x$: from $\\sinh y = x$, $\\cosh y\\,\\frac{dy}{dx} = 1$, and $\\cosh y = \\sqrt{1 + \\sinh^{2} y} = \\sqrt{1 + x^{2}}$, so

$$\\frac{d}{dx}\\operatorname{arsinh} x = \\frac{1}{\\sqrt{x^{2} + 1}}.$$

At $x = 0$ this is $1$.

Check: the logarithm form $\\operatorname{arsinh} x = \\ln\\left(x + \\sqrt{x^{2} + 1}\\right)$ has derivative $\\frac{1 + 0}{0 + 1} = 1$ at $x = 0$, by the chain rule.

In this lesson we differentiate $\\operatorname{arsinh} x$, $\\operatorname{arcosh} x$ and $\\operatorname{artanh} x$, also with an inner function.`,
    `$\\arcsin x$ 的导数来自对 $\\sin y = x$ 求导。同样的步骤适用于 $y = \\operatorname{arsinh} x$：由 $\\sinh y = x$ 得 $\\cosh y\\,\\frac{dy}{dx} = 1$，而 $\\cosh y = \\sqrt{1 + \\sinh^{2} y} = \\sqrt{1 + x^{2}}$，所以

$$\\frac{d}{dx}\\operatorname{arsinh} x = \\frac{1}{\\sqrt{x^{2} + 1}}.$$

在 $x = 0$ 处它等于 $1$。

检验：对数形式 $\\operatorname{arsinh} x = \\ln\\left(x + \\sqrt{x^{2} + 1}\\right)$ 由链式法则，在 $x = 0$ 处的导数为 $\\frac{1 + 0}{0 + 1} = 1$。

这节课我们对 $\\operatorname{arsinh} x$、$\\operatorname{arcosh} x$ 和 $\\operatorname{artanh} x$ 求导，也包括含内层函数的情形。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-arsinh-arcosh-and-artanh",
      title: t("Derivatives of arsinh, arcosh and artanh", "arsinh、arcosh、artanh 的导数"),
      explanation: t(
        "These formulas resemble the inverse trigonometric ones, with signs inside the radicals changed, reflecting the minus sign in the hyperbolic identity:\n\n$$\\frac{d}{dx}\\operatorname{arsinh} x = \\frac{1}{\\sqrt{x^{2} + 1}}, \\quad \\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{\\sqrt{x^{2} - 1}} \\ (x > 1), \\quad \\frac{d}{dx}\\operatorname{artanh} x = \\frac{1}{1 - x^{2}} \\ (|x| < 1).$$\n\nFor $y = \\operatorname{arsinh} x$, $\\sinh y = x$, so $\\cosh y\\,\\frac{dy}{dx} = 1$ and $\\cosh y = \\sqrt{1 + \\sinh^{2}y} = \\sqrt{1 + x^{2}}$. For example, at $x = 0.75$, $\\sqrt{0.75^{2} + 1} = 1.25$, so the slope of $\\operatorname{arsinh} x$ there is $0.8$.\n\nCheck: the difference quotients of $\\operatorname{arsinh} x$ at $0.75$ with $h = \\pm 0.01$ are about $0.798$ and $0.802$, on either side of $0.8$.\n\n> **Watch out.** Inside the root, $\\operatorname{arsinh}$ has $x^{2} + 1$ and $\\operatorname{arcosh}$ has $x^{2} - 1$, the reverse of $\\arcsin$'s $1 - x^{2}$. The derivative of $\\operatorname{artanh}$ has no root at all.",
        "这些公式与反三角函数的公式相似，只是根号内的符号不同，这反映了双曲恒等式中的负号：\n\n$$\\frac{d}{dx}\\operatorname{arsinh} x = \\frac{1}{\\sqrt{x^{2} + 1}}, \\quad \\frac{d}{dx}\\operatorname{arcosh} x = \\frac{1}{\\sqrt{x^{2} - 1}} \\ (x > 1), \\quad \\frac{d}{dx}\\operatorname{artanh} x = \\frac{1}{1 - x^{2}} \\ (|x| < 1).$$\n\n对 $y = \\operatorname{arsinh} x$，$\\sinh y = x$，所以 $\\cosh y\\,\\frac{dy}{dx} = 1$，而 $\\cosh y = \\sqrt{1 + \\sinh^{2}y} = \\sqrt{1 + x^{2}}$。例如在 $x = 0.75$ 处，$\\sqrt{0.75^{2} + 1} = 1.25$，所以 $\\operatorname{arsinh} x$ 在那里的斜率是 $0.8$。\n\n检验：$\\operatorname{arsinh} x$ 在 $0.75$ 处取 $h = \\pm 0.01$ 的差商约为 $0.798$ 和 $0.802$，位于 $0.8$ 的两侧。\n\n> **注意。** 根号内，$\\operatorname{arsinh}$ 是 $x^{2} + 1$，$\\operatorname{arcosh}$ 是 $x^{2} - 1$，与 $\\arcsin$ 的 $1 - x^{2}$ 相反。$\\operatorname{artanh}$ 的导数根本没有根号。",
      ),
      generate(rng) {
        const r = rng.pick(inverseHyperbolicRules);
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
        const answer = scaled(k, r.d);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, r.name])}$.`, `设 $f(x) = ${poly([k, r.name])}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [scaled(k, r.bad), scaled(-k, r.d)],
          solution: walked(
            [
              [["Recall the rule", "回顾求导公式"], t("The rule for this inverse function is", "这个反函数的求导公式是"), ruleLines([r])],
              [
                ["Multiply by the coefficient", "乘以系数"],
                t(`The constant multiple $${k}$ stays:`, `常数倍 $${k}$ 保留：`),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => k * r.at(x), k * r.slope(r.x0), r.x0),
          ),
        });
      },
    },
    {
      id: "inverse-hyperbolic-functions-of-inner-functions",
      title: t("Inverse hyperbolic functions of inner functions", "内层函数的反双曲函数"),
      explanation: t(
        "As with every composite function, use the formula for the outer inverse function and then multiply by the derivative of what is inside. For example,\n\n$$\\frac{d}{dx}\\operatorname{arsinh}(3x) = \\frac{3}{\\sqrt{9x^{2} + 1}}, \\qquad \\frac{d}{dx}\\operatorname{artanh}\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{1 - \\frac{x^{2}}{4}} = \\frac{2}{4 - x^{2}}.$$\n\nCheck: the first gives $3$ at $x = 0$. The difference quotients of $\\operatorname{arsinh}(3x)$ at $0$ with $h = \\pm 0.01$ are both about $2.999$.\n\n> **Watch out.** Do not forget the inner derivative, and square the whole inner function: $(3x)^{2}$ is $9x^{2}$.",
        "与所有复合函数一样，先用外层反函数的公式，再乘以里面函数的导数。例如\n\n$$\\frac{d}{dx}\\operatorname{arsinh}(3x) = \\frac{3}{\\sqrt{9x^{2} + 1}}, \\qquad \\frac{d}{dx}\\operatorname{artanh}\\left(\\frac{x}{2}\\right) = \\frac{\\frac{1}{2}}{1 - \\frac{x^{2}}{4}} = \\frac{2}{4 - x^{2}}.$$\n\n检验：第一个式子在 $x = 0$ 处为 $3$。$\\operatorname{arsinh}(3x)$ 在 $0$ 处取 $h = \\pm 0.01$ 的差商都约为 $2.999$。\n\n> **注意。** 不要漏掉内层函数的导数，并且整个内层函数都要平方：$(3x)^{2}$ 是 $9x^{2}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const k = rng.int(2, 10);
        const over = `\\frac{x}{${k}}`;
        const pieces = [
          {
            f: `\\operatorname{arsinh}(${k}x)`,
            outer: "\\operatorname{arsinh} u",
            inner: `${k}x`,
            du: `${k}`,
            chain: `\\frac{1}{\\sqrt{(${k}x)^{2} + 1}} \\cdot ${k}`,
            answer: `\\frac{${k}}{\\sqrt{${k * k}x^{2} + 1}}`,
            wrong: [`\\frac{1}{\\sqrt{${k * k}x^{2} + 1}}`, `\\frac{${k}}{\\sqrt{x^{2} + 1}}`],
            at: (x: number) => Math.asinh(k * x),
            slope: k / Math.sqrt(k * k + 1),
          },
          {
            f: `\\operatorname{artanh}\\left(${over}\\right)`,
            outer: "\\operatorname{artanh} u",
            inner: over,
            du: `\\frac{1}{${k}}`,
            chain: `\\frac{1}{1 - \\left(${over}\\right)^{2}} \\cdot \\frac{1}{${k}} = \\frac{1}{${k} - \\frac{x^{2}}{${k}}}`,
            answer: `\\frac{${k}}{${k * k} - x^{2}}`,
            wrong: [`\\frac{1}{${k * k} - x^{2}}`, `\\frac{${k}}{1 - x^{2}}`],
            at: (x: number) => Math.atanh(x / k),
            slope: k / (k * k - 1),
          },
          {
            f: `\\operatorname{arsinh}\\left(${over}\\right)`,
            outer: "\\operatorname{arsinh} u",
            inner: over,
            du: `\\frac{1}{${k}}`,
            chain: `\\frac{1}{\\sqrt{\\left(${over}\\right)^{2} + 1}} \\cdot \\frac{1}{${k}} = \\frac{1}{${k}\\sqrt{\\frac{x^{2}}{${k * k}} + 1}}`,
            answer: `\\frac{1}{\\sqrt{x^{2} + ${k * k}}}`,
            wrong: [`\\frac{${k}}{\\sqrt{x^{2} + ${k * k}}}`, "\\frac{1}{\\sqrt{x^{2} + 1}}"],
            at: (x: number) => Math.asinh(x / k),
            slope: 1 / Math.sqrt(1 + k * k),
          },
        ];
        const c = pieces[kind]!;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${c.f}$.`, `设 $f(x) = ${c.f}$。求 $f'(x)$。`),
          answer: c.answer,
          prefix: "f'(x) =",
          wrong: c.wrong,
          solution: walked(
            [
              [
                ["Name the outer and inner functions", "找出外层和内层函数"],
                t(
                  `The outer function is $${c.outer}$, with $u = ${c.inner}$ and $u' = ${c.du}$.`,
                  `外层函数是 $${c.outer}$，其中 $u = ${c.inner}$，$u' = ${c.du}$。`,
                ),
              ],
              [
                ["Apply the chain rule and simplify", "用链式法则并化简"],
                t(
                  "Put $u$ into the outer derivative, multiply by $u'$, and clear the fraction inside:",
                  "把 $u$ 代入外层函数的导数，乘以 $u'$，再消去里面的分数：",
                ),
                [`f'(x) = ${c.chain}`, `= ${c.answer}`],
              ],
            ],
            slopeCheck(c.at, c.slope, 1),
          ),
        });
      },
    },
  ],
};

/** inverseReciprocalHyperbolicRules are the derivatives of arsech, arcsch and arcoth. */
const inverseReciprocalHyperbolicRules: readonly InverseRule[] = [
  {
    name: "\\operatorname{arsech} x",
    d: "-\\frac{1}{x\\sqrt{1 - x^{2}}}",
    bad: "\\frac{1}{x\\sqrt{1 - x^{2}}}",
    at: (x) => Math.acosh(1 / x),
    slope: (x) => -1 / (x * Math.sqrt(1 - x * x)),
    x0: 0.6,
  },
  {
    name: "\\operatorname{arcsch} x",
    d: "-\\frac{1}{|x|\\sqrt{1 + x^{2}}}",
    bad: "-\\frac{1}{x\\sqrt{1 + x^{2}}}",
    at: (x) => Math.asinh(1 / x),
    slope: (x) => -1 / (Math.abs(x) * Math.sqrt(1 + x * x)),
    x0: -0.75,
  },
  {
    name: "\\operatorname{arcoth} x",
    d: "\\frac{1}{1 - x^{2}}",
    bad: "-\\frac{1}{1 - x^{2}}",
    at: (x) => Math.atanh(1 / x),
    slope: (x) => 1 / (1 - x * x),
    x0: 2,
  },
];

/** differentiatingInverseReciprocalHyperbolicFunctions differentiates arsech, arcsch and arcoth. */
export const differentiatingInverseReciprocalHyperbolicFunctions: TopicDef = {
  id: "differentiating-inverse-reciprocal-hyperbolic-functions",
  title: t("Differentiating Inverse Reciprocal Hyperbolic Functions", "反倒数双曲函数求导"),
  summary: t("Differentiate arsech, arcsch and arcoth, and evaluate their derivatives.", "对 arsech、arcsch、arcoth 求导并计算导数值。"),
  prerequisites: ["differentiating-inverse-hyperbolic-functions"],
  encompasses: [{ topic: "differentiating-inverse-hyperbolic-functions", weight: 0.2 }],
  xp: 10,
  standards: [],
  intro: t(
    `For $|x| > 1$, $\\operatorname{arcoth} x = \\operatorname{artanh}\\frac{1}{x}$. The chain rule, with the derivative $\\frac{1}{1 - u^{2}}$ of $\\operatorname{artanh} u$ and $u = \\frac{1}{x}$, gives

$$\\frac{d}{dx}\\operatorname{arcoth} x = \\frac{1}{1 - \\frac{1}{x^{2}}} \\cdot \\left(-\\frac{1}{x^{2}}\\right) = \\frac{-1}{x^{2} - 1} = \\frac{1}{1 - x^{2}}.$$

At $x = 2$ this is $-\\frac{1}{3}$.

Check: the difference quotients of $\\operatorname{arcoth} x$ at $x = 2$ with $h = 0.01$ and $h = -0.01$ are about $-0.331$ and $-0.336$, on either side of $-0.333$.

In this lesson we differentiate $\\operatorname{arsech} x$, $\\operatorname{arcsch} x$ and $\\operatorname{arcoth} x$, and evaluate their derivatives at points of their domains.`,
    `当 $|x| > 1$ 时，$\\operatorname{arcoth} x = \\operatorname{artanh}\\frac{1}{x}$。用链式法则，$\\operatorname{artanh} u$ 的导数是 $\\frac{1}{1 - u^{2}}$，取 $u = \\frac{1}{x}$，得

$$\\frac{d}{dx}\\operatorname{arcoth} x = \\frac{1}{1 - \\frac{1}{x^{2}}} \\cdot \\left(-\\frac{1}{x^{2}}\\right) = \\frac{-1}{x^{2} - 1} = \\frac{1}{1 - x^{2}}.$$

在 $x = 2$ 处它等于 $-\\frac{1}{3}$。

检验：$\\operatorname{arcoth} x$ 在 $x = 2$ 处取 $h = 0.01$ 和 $h = -0.01$ 的差商约为 $-0.331$ 和 $-0.336$，位于 $-0.333$ 的两侧。

这节课我们对 $\\operatorname{arsech} x$、$\\operatorname{arcsch} x$ 和 $\\operatorname{arcoth} x$ 求导，并计算它们在定义域内某些点处的导数值。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-arsech-arcsch-and-arcoth",
      title: t("Derivatives of arsech, arcsch and arcoth", "arsech、arcsch、arcoth 的导数"),
      explanation: t(
        "Each of these is an earlier inverse function of $\\frac{1}{x}$, and the chain rule gives\n\n$$\\frac{d}{dx}\\operatorname{arsech} x = -\\frac{1}{x\\sqrt{1 - x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcsch} x = -\\frac{1}{|x|\\sqrt{1 + x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcoth} x = \\frac{1}{1 - x^{2}}.$$\n\n$\\operatorname{arsech}$ is defined for $0 < x \\le 1$, and $\\operatorname{arcoth}$ for $|x| > 1$: it has the same derivative formula as $\\operatorname{artanh}$, on a different domain. For example, at $x = 0.6$, $\\sqrt{1 - 0.36} = 0.8$, so the slope of $\\operatorname{arsech} x$ is $-\\frac{1}{0.48}$, about $-2.083$.\n\nCheck: $\\operatorname{arsech} x = \\operatorname{arcosh}\\frac{1}{x}$, and its difference quotients at $0.6$ with $h = \\pm 0.01$ are about $-2.076$ and $-2.091$, on either side of $-2.083$.\n\n> **Watch out.** $\\operatorname{arsech}$ and $\\operatorname{arcsch}$ decrease, so their derivatives carry a minus sign, while $\\operatorname{arcoth}$ uses $\\frac{1}{1 - x^{2}}$ with no minus sign in front. That fraction is negative anyway, since $|x| > 1$.",
        "它们都是前面某个反函数在 $\\frac{1}{x}$ 处的值，由链式法则得\n\n$$\\frac{d}{dx}\\operatorname{arsech} x = -\\frac{1}{x\\sqrt{1 - x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcsch} x = -\\frac{1}{|x|\\sqrt{1 + x^{2}}}, \\quad \\frac{d}{dx}\\operatorname{arcoth} x = \\frac{1}{1 - x^{2}}.$$\n\n$\\operatorname{arsech}$ 的定义域为 $0 < x \\le 1$，$\\operatorname{arcoth}$ 的定义域为 $|x| > 1$：它与 $\\operatorname{artanh}$ 的导数公式相同，只是定义域不同。例如在 $x = 0.6$ 处，$\\sqrt{1 - 0.36} = 0.8$，所以 $\\operatorname{arsech} x$ 的斜率是 $-\\frac{1}{0.48}$，约为 $-2.083$。\n\n检验：$\\operatorname{arsech} x = \\operatorname{arcosh}\\frac{1}{x}$，它在 $0.6$ 处取 $h = \\pm 0.01$ 的差商约为 $-2.076$ 和 $-2.091$，位于 $-2.083$ 的两侧。\n\n> **注意。** $\\operatorname{arsech}$ 和 $\\operatorname{arcsch}$ 是减函数，所以导数带负号；而 $\\operatorname{arcoth}$ 的导数是 $\\frac{1}{1 - x^{2}}$，前面没有负号。由于 $|x| > 1$，这个分数本身就是负的。",
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4]);
        if (rng.int(0, 2) === 0) {
          // arsech lives on 0 < x ≤ 1, so it is scaled to 0 < x ≤ a, which leaves room to check the answer.
          const a = rng.int(4, 6);
          const name = `\\operatorname{arsech}\\left(\\frac{x}{${a}}\\right)`;
          const d = (c: number) => `${c < 0 ? "-" : ""}\\frac{${Math.abs(c)}}{x\\sqrt{${a * a} - x^{2}}}`;
          return functionProblem({
            prompt: t(
              `Find $f'(x)$ for $f(x) = ${poly([k, name])}$, where $0 < x < ${a}$.`,
              `设 $f(x) = ${poly([k, name])}$，其中 $0 < x < ${a}$。求 $f'(x)$。`,
            ),
            answer: d(-k * a),
            prefix: "f'(x) =",
            positive: true,
            wrong: [d(k * a), d(-k), `${k < 0 ? "" : "-"}\\frac{${Math.abs(k)}}{x\\sqrt{1 - x^{2}}}`],
            solution: walked(
              [
                [
                  ["Use the rule with an inner function", "对内层函数使用公式"],
                  t(
                    `With $u = \\frac{x}{${a}}$ and $u' = \\frac{1}{${a}}$, the chain rule gives`,
                    `取 $u = \\frac{x}{${a}}$，$u' = \\frac{1}{${a}}$，由链式法则得`,
                  ),
                  [
                    `\\frac{d}{dx}${name} = -\\frac{\\frac{1}{${a}}}{\\frac{x}{${a}}\\sqrt{1 - \\frac{x^{2}}{${a * a}}}} = -\\frac{${a}}{x\\sqrt{${a * a} - x^{2}}}`,
                  ],
                ],
                [
                  ["Multiply by the coefficient", "乘以系数"],
                  t(`The constant multiple $${k}$ stays:`, `常数倍 $${k}$ 保留：`),
                  [`f'(x) = ${d(-k * a)}`],
                ],
              ],
              slopeCheck((x) => k * Math.acosh(a / x), (-k * a) / (3 * Math.sqrt(a * a - 9)), 3),
            ),
          });
        }
        const r = rng.pick(inverseReciprocalHyperbolicRules.slice(1));
        const answer = scaled(k, r.d);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, r.name])}$.`, `设 $f(x) = ${poly([k, r.name])}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [scaled(k, r.bad), scaled(-k, r.d)],
          solution: walked(
            [
              [["Recall the rule", "回顾求导公式"], t("The rule for this inverse function is", "这个反函数的求导公式是"), ruleLines([r])],
              [
                ["Multiply by the coefficient", "乘以系数"],
                t(`The constant multiple $${k}$ stays:`, `常数倍 $${k}$ 保留：`),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => k * r.at(x), k * r.slope(r.x0), r.x0),
          ),
        });
      },
    },
    {
      id: "evaluating-derivatives-of-inverse-reciprocal-hyperbolic-functions",
      title: t("Evaluating derivatives of inverse reciprocal hyperbolic functions", "计算反倒数双曲函数的导数值"),
      explanation: t(
        "Make sure the point lies in the domain of the function first, then substitute it into the derivative formula and simplify. For $\\operatorname{arcoth} x$ at $x = 3$, the value is $\\frac{1}{1 - 9}$, which is $-\\frac{1}{8}$. For $\\operatorname{arsech} x$ at $x = \\frac{3}{5}$, the root $\\sqrt{1 - \\frac{9}{25}}$ is $\\frac{4}{5}$, so\n\n$$-\\frac{1}{\\frac{3}{5} \\cdot \\frac{4}{5}} = -\\frac{25}{12}.$$\n\nCheck: the difference quotients of $\\operatorname{arsech} x$ at $0.6$ with $h = \\pm 0.01$ are about $-2.076$ and $-2.091$, on either side of $-\\frac{25}{12} \\approx -2.083$.\n\n> **Watch out.** $\\operatorname{arcoth}$ needs $|x| > 1$ and $\\operatorname{arsech}$ needs $0 < x \\le 1$. A point outside the domain has no derivative to evaluate, even if the formula gives a number.",
        "先确认该点在函数的定义域内，再把它代入导数公式并化简。对 $\\operatorname{arcoth} x$ 在 $x = 3$ 处，值为 $\\frac{1}{1 - 9}$，即 $-\\frac{1}{8}$。对 $\\operatorname{arsech} x$ 在 $x = \\frac{3}{5}$ 处，根式 $\\sqrt{1 - \\frac{9}{25}}$ 等于 $\\frac{4}{5}$，所以\n\n$$-\\frac{1}{\\frac{3}{5} \\cdot \\frac{4}{5}} = -\\frac{25}{12}.$$\n\n检验：$\\operatorname{arsech} x$ 在 $0.6$ 处取 $h = \\pm 0.01$ 的差商约为 $-2.076$ 和 $-2.091$，位于 $-\\frac{25}{12} \\approx -2.083$ 的两侧。\n\n> **注意。** $\\operatorname{arcoth}$ 要求 $|x| > 1$，$\\operatorname{arsech}$ 要求 $0 < x \\le 1$。定义域外的点没有导数可求，即使公式能算出一个数。",
      ),
      generate(rng) {
        const arcoth = rng.bool();
        const k = rng.pick([1, 2, 3, 4, 5, -1, -2, -3]);
        if (arcoth) {
          const x0 = rng.pick([2, 3, 4, 5, -2, -3, -4]);
          const answer = Q.of(k, 1 - x0 * x0);
          return numberProblem({
            prompt: t(
              `Let $f(x) = ${poly([k, "\\operatorname{arcoth} x"])}$. Find $f'(${x0})$.`,
              `设 $f(x) = ${poly([k, "\\operatorname{arcoth} x"])}$。求 $f'(${x0})$。`,
            ),
            answer,
            wrong: [Q.of(k, 1 + x0 * x0), answer.neg()],
            solution: walked(
              [
                [
                  ["Write the derivative", "写出导数"],
                  t(`$|${x0}| > 1$, so $${x0}$ is in the domain, and`, `$|${x0}| > 1$，所以 $${x0}$ 在定义域内，并且`),
                  [`f'(x) = ${scaled(k, "\\frac{1}{1 - x^{2}}")}`],
                ],
                [
                  ["Substitute", "代入"],
                  t(`Put $x = ${x0}$:`, `代入 $x = ${x0}$：`),
                  [`f'(${x0}) = \\frac{${k}}{1 - ${x0 * x0}} = ${answer.toLatex()}`],
                ],
              ],
              slopeCheck((x) => k * Math.atanh(1 / x), answer.toNumber(), x0),
            ),
          });
        }
        const [p, q, r] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
        ] as const);
        // At x = p/r, √(1 − x²) = q/r, so the derivative is −r²/(pq).
        const answer = Q.of(-k * r * r, p * q);
        const at = `\\frac{${p}}{${r}}`;
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${poly([k, "\\operatorname{arsech} x"])}$. Find $f'\\left(${at}\\right)$.`,
            `设 $f(x) = ${poly([k, "\\operatorname{arsech} x"])}$。求 $f'\\left(${at}\\right)$。`,
          ),
          answer,
          wrong: [answer.neg(), Q.of(-k * r, p * q), Q.of(-k * r * r, q * q)],
          solution: walked(
            [
              [
                ["Write the derivative", "写出导数"],
                t(`$0 < ${at} \\le 1$, so the point is in the domain, and`, `$0 < ${at} \\le 1$，所以该点在定义域内，并且`),
                [`f'(x) = ${scaled(k, "-\\frac{1}{x\\sqrt{1 - x^{2}}}")}`],
              ],
              [
                ["Substitute and simplify", "代入并化简"],
                t(
                  `At $x = ${at}$ the root is $\\sqrt{1 - \\frac{${p * p}}{${r * r}}}$, which is $\\frac{${q}}{${r}}$, so`,
                  `在 $x = ${at}$ 处，根式为 $\\sqrt{1 - \\frac{${p * p}}{${r * r}}}$，即 $\\frac{${q}}{${r}}$，所以`,
                ),
                [
                  `f'\\left(${at}\\right) = ${par(-k)} \\cdot \\frac{1}{\\frac{${p}}{${r}} \\cdot \\frac{${q}}{${r}}} = ${answer.toLatex()}`,
                ],
              ],
            ],
            slopeCheck((x) => k * Math.acosh(1 / x), answer.toNumber(), p / r, at),
          ),
        });
      },
    },
  ],
};

/** Exponent is an exponent g(x) of x^{g(x)}, with ln y = g(x) ln x and g'(x) ln x + g(x)/x written out, and g and g' as numbers. */
interface Exponent {
  readonly g: string;
  readonly lnY: string;
  readonly bracket: string;
  readonly at: (x: number) => number;
  readonly slope: (x: number) => number;
}

/** exponent chooses an exponent for x^{g(x)}. */
function exponent(rng: Rng): Exponent {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const k = rng.int(1, 9);
    const g = poly([k, "x"]);
    return { g, lnY: `${g}\\ln x`, bracket: sumLatex([poly([k, "\\ln x"]), String(k)]), at: (x) => k * x, slope: () => k };
  }
  if (kind === 1) {
    const k = rng.int(2, 6);
    return {
      g: `x^{${k}}`,
      lnY: `x^{${k}}\\ln x`,
      bracket: `${k}${power(k - 1)}\\ln x + ${power(k - 1)}`,
      at: (x) => x ** k,
      slope: (x) => k * x ** (k - 1),
    };
  }
  if (kind === 2) {
    const c = rng.nonZero(-4, 6);
    const g = poly([1, "x"], [c, ""]);
    return { g, lnY: `(${g})\\ln x`, bracket: `\\ln x + \\frac{${g}}{x}`, at: (x) => x + c, slope: () => 1 };
  }
  return rng.pick<Exponent>([
    { g: "\\sin x", lnY: "\\sin x\\ln x", bracket: "\\cos x\\ln x + \\frac{\\sin x}{x}", at: Math.sin, slope: Math.cos },
    { g: "\\cos x", lnY: "\\cos x\\ln x", bracket: "-\\sin x\\ln x + \\frac{\\cos x}{x}", at: Math.cos, slope: (x) => -Math.sin(x) },
    { g: "\\ln x", lnY: "(\\ln x)^{2}", bracket: "\\frac{2\\ln x}{x}", at: Math.log, slope: (x) => 1 / x },
    {
      g: "\\sqrt{x}",
      lnY: "\\sqrt{x}\\ln x",
      bracket: "\\frac{\\ln x}{2\\sqrt{x}} + \\frac{1}{\\sqrt{x}}",
      at: Math.sqrt,
      slope: (x) => 1 / (2 * Math.sqrt(x)),
    },
    { g: "e^{x}", lnY: "e^{x}\\ln x", bracket: "e^{x}\\ln x + \\frac{e^{x}}{x}", at: Math.exp, slope: Math.exp },
  ]);
}

/** logarithmicDifferentiation differentiates variable powers. */
export const logarithmicDifferentiation: TopicDef = {
  id: "logarithmic-differentiation",
  title: t("Logarithmic Differentiation", "对数求导法"),
  summary: t(
    "Differentiate functions with a variable base and a variable exponent by taking logarithms first.",
    "先取对数，再对底数和指数都含变量的函数求导。",
  ),
  prerequisites: ["implicit-differentiation"],
  encompasses: [
    { topic: "implicit-differentiation", weight: 0.3 },
    { topic: "the-chain-rule-with-logarithmic-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `Implicit differentiation handles an equation in $x$ and $y$, and the chain rule gives $\\frac{d}{dx}\\ln y = \\frac{1}{y}\\frac{dy}{dx}$. Together they differentiate $y = x^{x}$, which is neither a power of $x$ nor an exponential with a fixed base. Take logarithms, $\\ln y = x\\ln x$, and differentiate both sides:

$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1, \\quad \\text{so} \\quad \\frac{dy}{dx} = x^{x}(\\ln x + 1).$$

At $x = 2$ this is $4(\\ln 2 + 1)$, about $6.773$.

Check: writing $x^{x} = e^{x\\ln x}$, the chain rule gives $e^{x\\ln x}(\\ln x + 1)$, the same. And the difference quotients of $x^{x}$ at $2$ with $h = \\pm 0.01$ are about $6.840$ and $6.706$, on either side of $6.773$.

In this lesson we take logarithms first to differentiate functions whose base and exponent both contain the variable.`,
    `隐函数求导处理关于 $x$ 和 $y$ 的方程，链式法则给出 $\\frac{d}{dx}\\ln y = \\frac{1}{y}\\frac{dy}{dx}$。两者结合，可以对 $y = x^{x}$ 求导，它既不是 $x$ 的幂，也不是底数固定的指数函数。取对数得 $\\ln y = x\\ln x$，两边求导：

$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1, \\quad \\text{所以} \\quad \\frac{dy}{dx} = x^{x}(\\ln x + 1).$$

在 $x = 2$ 处它等于 $4(\\ln 2 + 1)$，约为 $6.773$。

检验：把 $x^{x}$ 写成 $e^{x\\ln x}$，由链式法则得 $e^{x\\ln x}(\\ln x + 1)$，结果相同。另外，$x^{x}$ 在 $2$ 处取 $h = \\pm 0.01$ 的差商约为 $6.840$ 和 $6.706$，位于 $6.773$ 的两侧。

这节课我们先取对数，再对底数和指数都含变量的函数求导。`,
  ),
  knowledgePoints: [
    {
      id: "variable-bases-and-exponents",
      title: t("Variable bases and exponents", "底数与指数都含变量"),
      explanation: t(
        "Neither the power rule nor the exponential rule applies to $y = x^{x}$. Take logarithms first: $\\ln y = x\\ln x$. Differentiating implicitly,\n\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1 \\implies \\frac{dy}{dx} = x^{x}(\\ln x + 1).$$\n\nAt $x = 1$ this gives $1 \\cdot (0 + 1) = 1$.\n\nCheck: $x^{x} = e^{x\\ln x}$, and the chain rule gives $e^{x\\ln x}$ times the derivative of $x\\ln x$, which is $\\ln x + 1$: the same formula by another route.\n\n> **Watch out.** $x \\cdot x^{x - 1}$ treats the exponent as a constant, and $x^{x}\\ln x$ treats the base as a constant. Each misses one of the two terms in $\\ln x + 1$.",
        "幂法则和指数函数的求导法则都不适用于 $y = x^{x}$。先取对数：$\\ln y = x\\ln x$。用隐函数求导，\n\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + 1 \\implies \\frac{dy}{dx} = x^{x}(\\ln x + 1).$$\n\n在 $x = 1$ 处它给出 $1 \\cdot (0 + 1) = 1$。\n\n检验：$x^{x} = e^{x\\ln x}$，由链式法则得 $e^{x\\ln x}$ 乘以 $x\\ln x$ 的导数 $\\ln x + 1$：换一条路得到同一个公式。\n\n> **注意。** $x \\cdot x^{x - 1}$ 把指数当成了常数，$x^{x}\\ln x$ 把底数当成了常数。两者都漏掉了 $\\ln x + 1$ 中的一项。",
      ),
      generate(rng) {
        const e = exponent(rng);
        const y = `x^{${e.g}}`;
        const answer = `${y}\\left(${e.bracket}\\right)`;
        const value = (x: number) => x ** e.at(x);
        const slope = value(1.5) * (e.slope(1.5) * Math.log(1.5) + e.at(1.5) / 1.5);
        return functionProblem({
          prompt: t(`Find $\\frac{dy}{dx}$ for $y = ${y}$, where $x > 0$.`, `设 $y = ${y}$，其中 $x > 0$。求 $\\frac{dy}{dx}$。`),
          answer,
          prefix: dydx,
          positive: true,
          wrong: [`\\left(${e.g}\\right)x^{${e.g} - 1}`, `${y}\\ln x`, `\\left(${e.bracket}\\right)`],
          solution: walked(
            [
              [
                ["Take logarithms", "取对数"],
                t("For $x > 0$, $y > 0$, so take the natural logarithm of both sides:", "当 $x > 0$ 时 $y > 0$，所以两边取自然对数："),
                [`\\ln y = ${e.lnY}`],
              ],
              [
                ["Differentiate both sides", "两边求导"],
                t(
                  "The left side gives $\\frac{1}{y}\\frac{dy}{dx}$ by the chain rule, and the right side needs the product rule:",
                  "左边由链式法则得 $\\frac{1}{y}\\frac{dy}{dx}$，右边要用乘积法则：",
                ),
                [`\\frac{1}{y}\\frac{dy}{dx} = ${e.bracket}`],
              ],
              [
                ["Multiply by y", "乘以 y"],
                t(`Multiply both sides by $y = ${y}$:`, `两边乘以 $y = ${y}$：`),
                [`\\frac{dy}{dx} = ${answer}`],
              ],
            ],
            slopeCheck(value, slope, 1.5, "1.5", "y"),
          ),
        });
      },
    },
    {
      id: "a-function-to-a-variable-power",
      title: t("A function to a variable power", "函数的变量次幂"),
      explanation: t(
        "When the variable appears in both the base and the exponent, neither the power rule nor the exponential rule applies, so take logarithms first and differentiate implicitly. For $y = f(x)^{g(x)}$ with $f(x) > 0$: $\\ln y = g(x)\\ln f(x)$, so\n\n$$\\frac{dy}{dx} = f(x)^{g(x)}\\left(g'(x)\\ln f(x) + \\frac{g(x)f'(x)}{f(x)}\\right).$$\n\nFor example, $y = \\left(x^{2} + 1\\right)^{x}$ has $\\ln y = x\\ln\\left(x^{2} + 1\\right)$, and at $x = 1$ the bracket is $\\ln 2 + 1$, so $\\frac{dy}{dx} = 2(\\ln 2 + 1)$, about $3.386$.\n\nCheck: the difference quotients of $\\left(x^{2} + 1\\right)^{x}$ at $1$ with $h = \\pm 0.01$ are about $3.41$ and $3.36$, on either side of $3.386$.\n\n> **Watch out.** The base's inner derivative $f'(x)$ belongs in the second term, from the chain rule on $\\ln f(x)$. Leaving it out is the commonest slip.",
        "当底数和指数中都有变量时，幂法则和指数法则都不适用，所以先取对数，再用隐函数求导。对 $y = f(x)^{g(x)}$（$f(x) > 0$）：$\\ln y = g(x)\\ln f(x)$，所以\n\n$$\\frac{dy}{dx} = f(x)^{g(x)}\\left(g'(x)\\ln f(x) + \\frac{g(x)f'(x)}{f(x)}\\right).$$\n\n例如 $y = \\left(x^{2} + 1\\right)^{x}$ 有 $\\ln y = x\\ln\\left(x^{2} + 1\\right)$，在 $x = 1$ 处括号为 $\\ln 2 + 1$，所以 $\\frac{dy}{dx} = 2(\\ln 2 + 1)$，约为 $3.386$。\n\n检验：$\\left(x^{2} + 1\\right)^{x}$ 在 $1$ 处取 $h = \\pm 0.01$ 的差商约为 $3.41$ 和 $3.36$，位于 $3.386$ 的两侧。\n\n> **注意。** 第二项中要有底数的内层导数 $f'(x)$，它来自对 $\\ln f(x)$ 用链式法则。漏掉它是最常见的错误。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const a = rng.pick([1, 1, 2, 3]);
        const base = poly([a, "x^{2}"], [c, ""]);
        const k = rng.pick([1, 2, 3, 4]);
        const g = poly([k, "x"]);
        const y = `\\left(${base}\\right)^{${g}}`;
        const answer = `${y}\\left(${poly([k, `\\ln\\left(${base}\\right)`])} + \\frac{${poly([2 * a * k, "x^{2}"])}}{${base}}\\right)`;
        const value = (x: number) => (a * x * x + c) ** (k * x);
        const B = a * 0.25 + c;
        const slope = value(0.5) * (k * Math.log(B) + (k * 0.5 * 2 * a * 0.5) / B);
        return functionProblem({
          prompt: t(`Find $\\frac{dy}{dx}$ for $y = ${y}$.`, `设 $y = ${y}$。求 $\\frac{dy}{dx}$。`),
          answer,
          prefix: dydx,
          wrong: [
            `${g}\\left(${base}\\right)^{${g} - 1} \\cdot ${poly([2 * a, "x"])}`,
            `${y} \\cdot ${poly([k, `\\ln\\left(${base}\\right)`])}`,
            `${y}\\left(${poly([k, `\\ln\\left(${base}\\right)`])} + \\frac{${poly([2 * a, "x"])}}{${base}}\\right)`,
          ],
          solution: walked(
            [
              [
                ["Take logarithms", "取对数"],
                t("The base is positive, so take the natural logarithm of both sides:", "底数为正，所以两边取自然对数："),
                [`\\ln y = ${poly([k, `x\\ln\\left(${base}\\right)`])}`],
              ],
              [
                ["Differentiate both sides", "两边求导"],
                t(
                  `By the product rule, and the chain rule on $\\ln\\left(${base}\\right)$:`,
                  `用乘积法则，并对 $\\ln\\left(${base}\\right)$ 用链式法则：`,
                ),
                [
                  `\\frac{1}{y}\\frac{dy}{dx} = ${poly([k, `\\ln\\left(${base}\\right)`])} + ${poly([k, "x"])} \\cdot \\frac{${poly([2 * a, "x"])}}{${base}}`,
                ],
              ],
              [
                ["Multiply by y", "乘以 y"],
                t("Simplify the second term and multiply both sides by $y$:", "化简第二项，两边乘以 $y$："),
                [`\\frac{dy}{dx} = ${answer}`],
              ],
            ],
            slopeCheck(value, slope, 0.5, "0.5", "y"),
          ),
        });
      },
    },
  ],
};

/** PowerFactor is a factor (x + a)^m of a product, with m negative in the denominator. */
interface PowerFactor {
  readonly a: number;
  readonly m: Q;
}

/** factorLatex writes (x + a)^m for m > 0 as it appears in the function. */
function factorLatex(f: PowerFactor): string {
  const base = poly([1, "x"], [f.a, ""]);
  const m = f.m.sign() < 0 ? f.m.neg() : f.m;
  if (m.eq(Q.of(1, 2))) return `\\sqrt{${base}}`;
  if (m.eq(Q.one)) return f.a === 0 ? "x" : `(${base})`;
  return `${f.a === 0 ? "x" : `(${base})`}^{${m.toLatex()}}`;
}

/** furtherLogarithmicDifferentiation differentiates products and quotients of powers. */
export const furtherLogarithmicDifferentiation: TopicDef = {
  id: "further-logarithmic-differentiation",
  title: t("Further Logarithmic Differentiation", "对数求导法的进一步应用"),
  summary: t("Differentiate products and quotients of powers by taking logarithms first.", "先取对数，再对幂的乘积与商求导。"),
  prerequisites: ["logarithmic-differentiation"],
  encompasses: [{ topic: "logarithmic-differentiation", weight: 0.5 }],
  xp: 12,
  standards: [],
  intro: t(
    `Logarithmic differentiation also helps when there is no variable exponent. Logarithms turn products into sums, so for $y = x^{2}(x + 1)^{3}$,

$$\\ln y = 2\\ln x + 3\\ln(x + 1), \\quad \\text{so} \\quad \\frac{dy}{dx} = y\\left(\\frac{2}{x} + \\frac{3}{x + 1}\\right).$$

At $x = 1$, $y = 8$ and the bracket is $2 + \\frac{3}{2}$, so $\\frac{dy}{dx} = 28$.

Check: the product rule gives $2x(x + 1)^{3} + 3x^{2}(x + 1)^{2}$, which is $16 + 12 = 28$ at $x = 1$.

In this lesson we differentiate products and quotients of powers by taking logarithms first, in general and at a point.`,
    `即使没有变量指数，对数求导法也有用。对数把乘积变成和，所以对 $y = x^{2}(x + 1)^{3}$，

$$\\ln y = 2\\ln x + 3\\ln(x + 1), \\quad \\text{所以} \\quad \\frac{dy}{dx} = y\\left(\\frac{2}{x} + \\frac{3}{x + 1}\\right).$$

在 $x = 1$ 处 $y = 8$，括号为 $2 + \\frac{3}{2}$，所以 $\\frac{dy}{dx} = 28$。

检验：乘积法则给出 $2x(x + 1)^{3} + 3x^{2}(x + 1)^{2}$，在 $x = 1$ 处为 $16 + 12 = 28$。

这节课我们先取对数，再对幂的乘积与商求导，既求一般表达式，也求某点处的值。`,
  ),
  knowledgePoints: [
    {
      id: "products-and-quotients-of-powers",
      title: t("Products and quotients of powers", "幂的乘积与商"),
      explanation: t(
        "For a product or quotient of several powers, taking logarithms turns it into a sum:\n\n$$y = \\frac{x^{2}(x + 1)^{3}}{\\sqrt{x + 4}} \\implies \\ln y = 2\\ln x + 3\\ln(x + 1) - \\frac{1}{2}\\ln(x + 4).$$\n\nSo $\\frac{dy}{dx}$ is $y\\left(\\frac{2}{x} + \\frac{3}{x + 1} - \\frac{1}{2(x + 4)}\\right)$. Leave $y$ written out as the original function.\n\nCheck: at $x = 1$ the bracket is $2 + 1.5 - 0.1 = 3.4$. The difference quotients of $\\ln y$ at $1$ with $h = \\pm 0.01$ are about $3.38$ and $3.42$, on either side of $3.4$.\n\n> **Watch out.** A factor in the denominator contributes a minus sign, and a square root contributes the exponent $\\frac{1}{2}$. And remember to multiply the bracket by $y$ at the end.",
        "对若干个幂的乘积或商，取对数后变为和：\n\n$$y = \\frac{x^{2}(x + 1)^{3}}{\\sqrt{x + 4}} \\implies \\ln y = 2\\ln x + 3\\ln(x + 1) - \\frac{1}{2}\\ln(x + 4).$$\n\n所以 $\\frac{dy}{dx}$ 等于 $y\\left(\\frac{2}{x} + \\frac{3}{x + 1} - \\frac{1}{2(x + 4)}\\right)$，其中 $y$ 写成原函数。\n\n检验：在 $x = 1$ 处括号为 $2 + 1.5 - 0.1 = 3.4$。$\\ln y$ 在 $1$ 处取 $h = \\pm 0.01$ 的差商约为 $3.38$ 和 $3.42$，位于 $3.4$ 的两侧。\n\n> **注意。** 分母中的因子带来负号，平方根带来指数 $\\frac{1}{2}$。最后别忘了把括号乘以 $y$。",
      ),
      generate(rng) {
        const [a1, a2, a3] = rng.sample([0, 1, 2, 3, 4, 5, 6, 7], 3) as [number, number, number];
        const ms = [Q.of(rng.int(1, 5)), Q.of(rng.int(1, 4)), rng.pick([Q.of(-1, 2), Q.of(-1), Q.of(-2), Q.of(-3)])];
        const fs: PowerFactor[] = [
          { a: a1, m: ms[0]! },
          { a: a2, m: ms[1]! },
          { a: a3, m: ms[2]! },
        ];
        const top = fs
          .filter((f) => f.m.sign() > 0)
          .map(factorLatex)
          .join("");
        const bottom = fs
          .filter((f) => f.m.sign() < 0)
          .map(factorLatex)
          .join("");
        const y = `\\frac{${top}}{${bottom}}`;
        const term = (f: PowerFactor) => {
          const base = poly([1, "x"], [f.a, ""]);
          const c = f.m;
          const cn = c.n < 0n ? -c.n : c.n;
          return `${c.sign() < 0 ? "-" : ""}\\frac{${cn}}{${c.d === 1n ? "" : c.d}${c.d === 1n || f.a === 0 ? base : `(${base})`}}`;
        };
        const bracket = sumLatex(fs.map(term));
        const answer = `${y}\\left(${bracket}\\right)`;
        const flip = (s: string) => (s.startsWith("-") ? s.slice(1) : `-${s}`);
        const lnY = sumLatex(fs.map((f) => poly([f.m, `\\ln${f.a === 0 ? " x" : `(${poly([1, "x"], [f.a, ""])})`}`])));
        const L = (x: number) => fs.reduce((s, f) => s + f.m.toNumber() * Math.log(x + f.a), 0);
        const at1 = fs.reduce((s, f) => s.add(f.m.div(Q.of(1 + f.a))), Q.zero);
        return functionProblem({
          prompt: t(`Find $\\frac{dy}{dx}$ for $y = ${y}$, where $x > 0$.`, `设 $y = ${y}$，其中 $x > 0$。求 $\\frac{dy}{dx}$。`),
          answer,
          prefix: dydx,
          positive: true,
          wrong: [`\\left(${bracket}\\right)`, `${y}\\left(${sumLatex([term(fs[0]!), term(fs[1]!), flip(term(fs[2]!))])}\\right)`],
          solution: walked(
            [
              [
                ["Take logarithms", "取对数"],
                t(
                  "Each exponent becomes a multiplier, and the factor in the denominator is subtracted:",
                  "每个指数变成乘数，分母中的因子变成减项：",
                ),
                [`\\ln y = ${lnY}`],
              ],
              [
                ["Differentiate both sides", "两边求导"],
                t("Each logarithm differentiates to one over its argument:", "每个对数求导后是它的真数分之一："),
                [`\\frac{1}{y}\\frac{dy}{dx} = ${bracket}`],
              ],
              [
                ["Multiply by y", "乘以 y"],
                t("Multiply both sides by the original function:", "两边乘以原函数："),
                [`\\frac{dy}{dx} = ${answer}`],
              ],
            ],
            led(
              t(
                `The bracket is the derivative of $L(x) = \\ln y$. At $x = 1$ it is $${exactly(at1)}$.`,
                `括号是 $L(x) = \\ln y$ 的导数。在 $x = 1$ 处它等于 $${exactly(at1)}$。`,
              ),
              slopeCheck(L, at1.toNumber(), 1, "1", "L"),
            ),
          ),
        });
      },
    },
    {
      id: "logarithmic-derivatives-at-a-point",
      title: t("Logarithmic derivatives at a point", "对数求导法求某点处的导数"),
      explanation: t(
        "At a specific point it is easier to compute the value of the function and the value of the bracket separately, and then multiply the two numbers. For $y = x^{x}$ at $x = 2$: $y = 4$ and the bracket $\\ln x + 1$ is $\\ln 2 + 1$, so $\\frac{dy}{dx} = 4(\\ln 2 + 1)$, about $6.773$.\n\nCheck: the difference quotients of $x^{x}$ at $2$ with $h = \\pm 0.01$ are about $6.840$ and $6.706$, whose average is $6.773$.\n\n> **Watch out.** Multiply by the value of $y$ at the point, here $2^{2} = 4$. The bracket alone is $\\frac{1}{y}\\frac{dy}{dx}$, not $\\frac{dy}{dx}$.",
        "在具体的一点处，分别算出函数值和括号的值，再把两个数相乘会更容易。对 $y = x^{x}$ 在 $x = 2$ 处：$y = 4$，括号 $\\ln x + 1$ 为 $\\ln 2 + 1$，所以 $\\frac{dy}{dx} = 4(\\ln 2 + 1)$，约为 $6.773$。\n\n检验：$x^{x}$ 在 $2$ 处取 $h = \\pm 0.01$ 的差商约为 $6.840$ 和 $6.706$，平均值为 $6.773$。\n\n> **注意。** 要乘以 $y$ 在该点的值，这里是 $2^{2} = 4$。括号本身只是 $\\frac{1}{y}\\frac{dy}{dx}$，不是 $\\frac{dy}{dx}$。",
      ),
      generate(rng) {
        const triples = [2, 3, 4].flatMap((x) => [1, 2].flatMap((k) => range(-2, 2).map((c) => [x, k, c] as const)));
        const [x0, k, c] = rng.pick(triples.filter(([x, k, c]) => x ** (k * x + c) <= 5000));
        const g = poly([k, "x"], [c, ""]);
        const n = k * x0 + c;
        const y0 = x0 ** n;
        const bracket = sumLatex([poly([k, `\\ln ${x0}`]), Q.of(n, x0).toLatex()]);
        const answer = `${y0 === 1 ? "" : y0}\\left(${bracket}\\right)`;
        const general = sumLatex([poly([k, "\\ln x"]), c === 0 ? String(k) : `\\frac{${g}}{x}`]);
        const slope = y0 * (k * Math.log(x0) + n / x0);
        return functionProblem({
          prompt: t(
            `Let $y = x^{${g}}$. Find $\\frac{dy}{dx}$ at $x = ${x0}$.`,
            `设 $y = x^{${g}}$。求 $x = ${x0}$ 处的 $\\frac{dy}{dx}$。`,
          ),
          answer,
          wrong: [`${n} \\cdot ${x0}^{${n - 1}}`, `${y0}\\ln ${x0}`, `${y0}\\left(${poly([k, `\\ln ${x0}`])} + 1\\right)`],
          solution: walked(
            [
              [
                ["Differentiate the logarithm", "对对数求导"],
                t(
                  "Take logarithms of both sides and differentiate, with the product rule on the right:",
                  "两边取对数再求导，右边用乘积法则：",
                ),
                [`\\ln y = ${c === 0 ? g : `(${g})`}\\ln x`, `\\frac{1}{y}\\frac{dy}{dx} = ${general}`],
              ],
              [
                ["Evaluate at the point", "在该点取值"],
                t(`At $x = ${x0}$, $y = ${x0}^{${n}} = ${y0}$, so`, `在 $x = ${x0}$ 处 $y = ${x0}^{${n}} = ${y0}$，所以`),
                [`\\frac{dy}{dx} = ${y0}\\left(${bracket}\\right)${y0 === 1 ? ` = ${bracket}` : ""}`],
              ],
            ],
            slopeCheck((x) => x ** (k * x + c), slope, x0, String(x0), "y"),
          ),
        });
      },
    },
  ],
};

/** calculusIImplicitInverseTopics are the topics of Calculus I modules 5.12 and 5.13. */
export const calculusIImplicitInverseTopics: readonly TopicDef[] = [
  implicitDifferentiation,
  calculatingSlopesOfCirclesEllipsesAndParabolas,
  calculatingDyDxUsingDxDy,
  differentiatingInverseFunctions,
  differentiatingAnInverseFunctionAtAPoint,
  differentiatingInverseTrigonometricFunctions,
  differentiatingInverseReciprocalTrigonometricFunctions,
  differentiatingInverseHyperbolicFunctions,
  differentiatingInverseReciprocalHyperbolicFunctions,
  logarithmicDifferentiation,
  furtherLogarithmicDifferentiation,
];
