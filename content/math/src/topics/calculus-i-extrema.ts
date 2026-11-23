import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { numberProblem, solutionsProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf, type Poly, pAt, par, pDer, pLatex, table } from "./calculus-common.ts";

// Calculus I unit 7: Analytical Applications of Differentiation, module 7.18.

/** Cubic is a cubic with integer coefficients whose derivative is g(x − c1)(x − c2), c1 < c2. */
export interface Cubic {
  readonly p: Poly;
  readonly c1: number;
  readonly c2: number;
  /** up is whether the leading coefficient is positive, so that c1 is a local maximum. */
  readonly up: boolean;
}

/** cubic chooses a cubic with two integer critical points. */
export function cubic(rng: Rng, lo = -4, hi = 4): Cubic {
  const c1 = rng.int(lo, hi - 1);
  const c2 = rng.int(c1 + 1, hi);
  const s = c1 + c2;
  const m = rng.sign();
  const g = s % 2 === 0 && rng.bool() ? 3 : 6;
  const p: Poly = [rng.int(-6, 6), g * m * c1 * c2, (-g * m * s) / 2, (g * m) / 3];
  return { p, c1, c2, up: m > 0 };
}

/** derivativeFactored writes f'(x) of a cubic in factored form: "6(x - 1)(x + 2)". */
export const derivativeFactored = (c: Cubic) => {
  const g = 3 * c.p[3]!;
  const lead = g === 1 ? "" : g === -1 ? "-" : String(g);
  return `${lead}${factor(c.c1)}${factor(c.c2)}`;
};

/** factor writes x − a in parentheses, or x alone when a is 0. */
export const factor = (a: number) => (a === 0 ? "x" : `(${poly([1, "x"], [-a, ""])})`);

/** open writes an open interval, with ±∞ for missing ends. */
export const open = (a: number | undefined, b: number | undefined) =>
  `(${a === undefined ? "-\\infty" : a}, ${b === undefined ? "\\infty" : b})`;

/** intervals writes a union of intervals as a choice option. */
export const intervals = (...xs: readonly string[]) => t(xs.map((x) => `$${x}$`).join(" and "), xs.map((x) => `$${x}$`).join(" 和 "));

/** zigzagXs are the x-coordinates of the vertices of zigzag graphs. */
export const zigzagXs = [-6, -4, -2, 0, 2, 4, 6];

/** zigzag chooses the heights of a piecewise linear graph with no flat pieces. */
export function zigzag(rng: Rng, flat = false): number[] {
  const ys = [rng.int(-4, 4)];
  for (let i = 1; i < zigzagXs.length; i++) {
    let y = ys[i - 1]! + rng.pick(flat ? [-4, -3, -2, -1, 0, 1, 2, 3, 4] : [-4, -3, -2, -1, 1, 2, 3, 4]);
    if (y > 6 || y < -6) y = 2 * ys[i - 1]! - y;
    ys.push(y);
  }
  return ys;
}

/** zigzagFigure draws a piecewise linear graph of a function named name. */
export function zigzagFigure(ys: readonly number[], name: string): Figure {
  const marks: PlaneMark[] = ys.slice(1).map((y, i) => ({
    kind: "segment" as const,
    a: [zigzagXs[i]!, ys[i]!] as const,
    b: [zigzagXs[i + 1]!, y] as const,
    accent: true,
  }));
  const points = ys.map((y, i) => `(${zigzagXs[i]}, ${y})`);
  return {
    svg: plane({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks),
    alt: t(
      `The graph of $${name}$ on $[-6, 6]$: line segments joining ${points.join(", ")}.`,
      `$${name}$ 在 $[-6, 6]$ 上的图像：依次连接 ${points.join("、")} 的线段。`,
    ),
  };
}

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

/** valueTable tabulates a function, named in LaTeX, at some x-values to three decimal places. */
function valueTable(xs: readonly number[], name: string, f: (x: number) => number): string {
  return table(["$x$", ...xs.map((x) => `$${fmt(x)}$`)], [`$${name}$`, ...xs.map((x) => `$${fmt(f(x))}$`)]);
}

/** signOf names the sign of a number. */
const signOf = (v: number): Text => (v > 0 ? t("positive", "正") : v < 0 ? t("negative", "负") : t("zero", "零"));

/** Applicability is a function on an interval with the hypotheses it meets, why, and a numerical look that confirms it. */
interface Applicability {
  readonly f: string;
  readonly interval: string;
  readonly continuous: boolean;
  readonly differentiable: boolean;
  readonly closed: boolean;
  readonly why: Text;
  readonly check: Text;
}

/** applicability chooses a function on an interval for questions about the hypotheses of theorems; closedOnly keeps to closed intervals. */
function applicability(rng: Rng, closedOnly = false): Applicability {
  const a = rng.int(-5, 0);
  const b = rng.int(2, 6);
  const c = rng.int(a + 1, b - 1);
  const kind = rng.pick(closedOnly ? [0, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6]);
  const [d, e] = [rng.int(-4, 4), rng.int(-5, 5)];
  const p = poly([1, "x^{2}"], [d, "x"], [e, ""]);
  const at = (x: number) => x * x + d * x + e;
  const shifted = poly([1, "x"], [-c, ""]);
  if (kind === 0) {
    const q = (h: number) => (at(c + h) - at(c)) / h;
    return {
      f: p,
      interval: `[${a}, ${b}]`,
      continuous: true,
      differentiable: true,
      closed: true,
      why: t("A polynomial is continuous and differentiable everywhere.", "多项式处处连续且可导。"),
      check: t(
        `At $x = ${c}$, inside the interval, the difference quotients with $h = 0.01$ and $h = -0.01$ are $${fmt(q(0.01))}$ and $${fmt(q(-0.01))}$. They nearly agree, so the graph is smooth there, as it is everywhere.`,
        `在区间内的 $x = ${c}$ 处，取 $h = 0.01$ 和 $h = -0.01$ 的差商分别是 $${fmt(q(0.01))}$ 和 $${fmt(q(-0.01))}$。两者几乎相等，所以图像在那里是光滑的，在其他地方也一样。`,
      ),
    };
  }
  if (kind === 1)
    return {
      f: p,
      interval: `(${a}, ${b})`,
      continuous: true,
      differentiable: true,
      closed: false,
      why: t("The polynomial is continuous, but the interval is open.", "多项式连续，但区间是开区间。"),
      check: t(
        `Near the right end, $f(${fmt(b - 0.01)}) \\approx ${fmt(at(b - 0.01))}$ and $f(${fmt(b - 0.001)}) \\approx ${fmt(at(b - 0.001))}$ approach $f(${b}) = ${at(b)}$, but $x = ${b}$ itself is left out of $(${a}, ${b})$.`,
        `在右端附近，$f(${fmt(b - 0.01)}) \\approx ${fmt(at(b - 0.01))}$，$f(${fmt(b - 0.001)}) \\approx ${fmt(at(b - 0.001))}$，趋近于 $f(${b}) = ${at(b)}$，但 $x = ${b}$ 本身不在 $(${a}, ${b})$ 中。`,
      ),
    };
  if (kind === 2)
    return {
      f: `|${shifted}|`,
      interval: `[${a}, ${b}]`,
      continuous: true,
      differentiable: false,
      closed: true,
      why: t(
        `$|${shifted}|$ is continuous everywhere but has a corner at $x = ${c}$, inside the interval, where it is not differentiable.`,
        `$|${shifted}|$ 处处连续，但在区间内的 $x = ${c}$ 处有尖点，在该处不可导。`,
      ),
      check: t(
        `At $x = ${c}$ the difference quotient is $1$ for $h = 0.01$ and $-1$ for $h = -0.01$. The two sides disagree, so there is no derivative there. Yet $f(${fmt(c - 0.01)})$ and $f(${fmt(c + 0.01)})$ are both $0.01$, close to $f(${c}) = 0$, so the graph does not break.`,
        `在 $x = ${c}$ 处，$h = 0.01$ 时差商为 $1$，$h = -0.01$ 时为 $-1$。两侧不一致，所以那里没有导数。但 $f(${fmt(c - 0.01)})$ 和 $f(${fmt(c + 0.01)})$ 都是 $0.01$，接近 $f(${c}) = 0$，所以图像没有断开。`,
      ),
    };
  if (kind === 3)
    return {
      f: `\\frac{1}{${shifted}}`,
      interval: `[${a}, ${b}]`,
      continuous: false,
      differentiable: false,
      closed: true,
      why: t(
        `$\\frac{1}{${shifted}}$ has a vertical asymptote at $x = ${c}$, inside the interval, so it is not continuous there.`,
        `$\\frac{1}{${shifted}}$ 在区间内的 $x = ${c}$ 处有竖直渐近线，在该处不连续。`,
      ),
      check: t(
        `$f(${fmt(c - 0.01)}) = -100$ and $f(${fmt(c + 0.01)}) = 100$: across $x = ${c}$ the values jump from large negative to large positive, and $f(${c})$ is not defined.`,
        `$f(${fmt(c - 0.01)}) = -100$，$f(${fmt(c + 0.01)}) = 100$：跨过 $x = ${c}$ 时，函数值从很大的负数跳到很大的正数，而 $f(${c})$ 没有定义。`,
      ),
    };
  if (kind === 4)
    return {
      f: "\\sqrt{x}",
      interval: `[0, ${b * b}]`,
      continuous: true,
      differentiable: true,
      closed: true,
      why: t(
        `$\\sqrt{x}$ is continuous on $[0, ${b * b}]$ and differentiable on $(0, ${b * b})$. It need not be differentiable at the endpoint $0$.`,
        `$\\sqrt{x}$ 在 $[0, ${b * b}]$ 上连续，在 $(0, ${b * b})$ 内可导。它在端点 $0$ 处不必可导。`,
      ),
      check: t(
        `The derivative $\\frac{1}{2\\sqrt{x}}$ exists for every $x > 0$. And $f(0.0001) = 0.01$ is close to $f(0) = 0$, so the graph joins its left endpoint.`,
        `导数 $\\frac{1}{2\\sqrt{x}}$ 对每个 $x > 0$ 都存在。而 $f(0.0001) = 0.01$ 接近 $f(0) = 0$，所以图像与左端点相连。`,
      ),
    };
  if (kind === 5)
    return {
      f: `\\sqrt[3]{${shifted}}`,
      interval: `[${a}, ${b}]`,
      continuous: true,
      differentiable: false,
      closed: true,
      why: t(
        `The cube root is continuous everywhere, but its graph has a vertical tangent at $x = ${c}$, inside the interval, where it is not differentiable.`,
        `立方根函数处处连续，但它的图像在区间内的 $x = ${c}$ 处有竖直切线，在该处不可导。`,
      ),
      check: t(
        `At $x = ${c}$ the difference quotient is $h^{-\\frac{2}{3}}$: about $${fmt(0.01 ** (-2 / 3))}$ for $h = 0.01$ and $100$ for $h = 0.001$, growing without bound. Yet $f(${c} \\pm 0.001) = \\pm 0.1$ is close to $f(${c}) = 0$, so the graph does not break.`,
        `在 $x = ${c}$ 处，差商为 $h^{-\\frac{2}{3}}$：$h = 0.01$ 时约为 $${fmt(0.01 ** (-2 / 3))}$，$h = 0.001$ 时为 $100$，无限增大。但 $f(${c} \\pm 0.001) = \\pm 0.1$ 接近 $f(${c}) = 0$，所以图像没有断开。`,
      ),
    };
  return {
    f: "\\tan x",
    interval: "[0, \\pi]",
    continuous: false,
    differentiable: false,
    closed: true,
    why: t(
      "$\\tan x$ has a vertical asymptote at $x = \\frac{\\pi}{2}$, inside the interval, so it is not continuous there.",
      "$\\tan x$ 在区间内的 $x = \\frac{\\pi}{2}$ 处有竖直渐近线，在该处不连续。",
    ),
    check: t(
      `$\\tan 1.56 \\approx ${fmt(Math.tan(1.56))}$ and $\\tan 1.58 \\approx ${fmt(Math.tan(1.58))}$: across $\\frac{\\pi}{2} \\approx 1.571$ the values jump from large positive to large negative.`,
      `$\\tan 1.56 \\approx ${fmt(Math.tan(1.56))}$，$\\tan 1.58 \\approx ${fmt(Math.tan(1.58))}$：跨过 $\\frac{\\pi}{2} \\approx 1.571$ 时，函数值从很大的正数跳到很大的负数。`,
    ),
  };
}

/** continuity says whether a function is continuous on its interval. */
const continuity = (fn: Applicability) =>
  fn.continuous
    ? t(`$f$ is continuous at every point of $${fn.interval}$.`, `$f$ 在 $${fn.interval}$ 的每一点都连续。`)
    : t(`$f$ breaks inside $${fn.interval}$, so it is not continuous there.`, `$f$ 在 $${fn.interval}$ 内断开，所以在那里不连续。`);

/** theMeanValueTheorem finds where instantaneous slopes equal average slopes. */
export const theMeanValueTheorem: TopicDef = {
  id: "the-mean-value-theorem",
  title: t("The Mean Value Theorem", "中值定理"),
  summary: t(
    "Check the hypotheses of the mean value theorem and find the values it guarantees.",
    "检查中值定理的条件，并求出它所保证存在的点。",
  ),
  prerequisites: ["selecting-procedures-for-calculating-derivatives", "continuity-and-differentiability-of-functions"],
  encompasses: [
    { topic: "continuity-and-differentiability-of-functions", weight: 0.2 },
    { topic: "the-average-rate-of-change-of-a-function", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The average rate of change of $f(x) = x^{2}$ on $[1, 3]$ is

$$\\frac{f(3) - f(1)}{3 - 1} = \\frac{9 - 1}{2} = 4.$$

The derivative $f'(x) = 2x$ equals $4$ at $x = 2$, which lies between $1$ and $3$: there the tangent line is parallel to the secant line through $(1, 1)$ and $(3, 9)$.

Check: the tangent at $(2, 4)$ is $y = 4x - 4$, and the secant is $y = 4x - 3$. Both have slope $4$.

In this lesson we see that a smooth function always has such a point, check when this is guaranteed, and find the point.`,
    `$f(x) = x^{2}$ 在 $[1, 3]$ 上的平均变化率是

$$\\frac{f(3) - f(1)}{3 - 1} = \\frac{9 - 1}{2} = 4.$$

导数 $f'(x) = 2x$ 在 $x = 2$ 处等于 $4$，而 $2$ 位于 $1$ 和 $3$ 之间：在那里切线与过 $(1, 1)$ 和 $(3, 9)$ 的割线平行。

检验：$(2, 4)$ 处的切线是 $y = 4x - 4$，割线是 $y = 4x - 3$。两者斜率都是 $4$。

这节课我们会看到光滑函数总有这样的点，检查何时能保证这一点，并把这个点求出来。`,
  ),
  knowledgePoints: [
    {
      id: "finding-mean-value-theorem-values",
      figure: calculusDrawings2["the-mean-value-theorem#finding-mean-value-theorem-values"],
      title: t("Finding mean value theorem values", "求中值定理中的点"),
      explanation: t(
        "If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, there is at least one $c$ in $(a, b)$ with\n\n$$f'(c) = \\frac{f(b) - f(a)}{b - a}.$$\n\nSomewhere the tangent line is parallel to the secant line. To find $c$, compute the average slope, set $f'(c)$ equal to it, and keep the solutions inside $(a, b)$. For $f(x) = x^{3}$ on $[0, 3]$ the average slope is $\\frac{27 - 0}{3}$, which is $9$, and $3c^{2} = 9$ gives $c = \\pm\\sqrt{3}$. Only $c = \\sqrt{3} \\approx 1.732$ lies in $(0, 3)$.\n\nCheck: $f'(1.732) = 3 \\cdot 1.732^{2} \\approx 9.0$, the average slope.\n\n> **Watch out.** Setting $f'(c)$ equal to the slope can give values outside $(a, b)$, like $-\\sqrt{3}$ here. They are not the values the theorem promises, so drop them.",
        "若 $f$ 在 $[a, b]$ 上连续，在 $(a, b)$ 内可导，则 $(a, b)$ 内至少有一点 $c$ 使\n\n$$f'(c) = \\frac{f(b) - f(a)}{b - a}.$$\n\n某处的切线与割线平行。求 $c$ 时，先算平均斜率，令 $f'(c)$ 等于它，只保留落在 $(a, b)$ 内的解。对 $[0, 3]$ 上的 $f(x) = x^{3}$，平均斜率为 $\\frac{27 - 0}{3}$，即 $9$，由 $3c^{2} = 9$ 得 $c = \\pm\\sqrt{3}$。只有 $c = \\sqrt{3} \\approx 1.732$ 在 $(0, 3)$ 内。\n\n检验：$f'(1.732) = 3 \\cdot 1.732^{2} \\approx 9.0$，正是平均斜率。\n\n> **注意。** 令 $f'(c)$ 等于斜率时可能得到 $(a, b)$ 以外的值，比如这里的 $-\\sqrt{3}$。它们不是定理所保证的点，要舍去。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const p: Poly = [rng.int(-5, 5), rng.int(-6, 6), rng.nonZero(-3, 3)];
          const a = rng.int(-5, 2);
          const b = a + rng.int(1, 6);
          const slope = Q.of(pAt(p, b) - pAt(p, a), b - a);
          const answer = Q.of(a + b, 2);
          const fd = poly([2 * p[2]!, "c"], [p[1]!, ""]);
          const back = Q.of(2 * p[2]!)
            .mul(answer)
            .add(Q.of(p[1]!));
          return numberProblem({
            prompt: t(
              `Find the value of $c$ that satisfies the conclusion of the mean value theorem for $f(x) = ${pLatex(p)}$ on $[${a}, ${b}]$.`,
              `求满足中值定理结论的 $c$，其中 $f(x) = ${pLatex(p)}$，区间为 $[${a}, ${b}]$。`,
            ),
            answer,
            wrong: [slope, Q.of(b - a, 2), Q.of(a + b)].filter((w) => !w.eq(answer)),
            solution: walked(
              [
                [
                  ["Find the average slope", "求平均斜率"],
                  t(
                    "A polynomial is continuous and differentiable everywhere, so the theorem applies. The secant slope is",
                    "多项式处处连续且可导，所以定理适用。割线斜率为",
                  ),
                  [`\\frac{f(${b}) - f(${a})}{${b} - ${par(a)}} = \\frac{${pAt(p, b)} - ${par(pAt(p, a))}}{${b - a}} = ${slope.toLatex()}`],
                ],
                [
                  ["Solve for c", "解出 c"],
                  t(
                    `Set $f'(c)$ equal to it and solve; $c = ${answer.toLatex()}$ lies in $(${a}, ${b})$.`,
                    `令 $f'(c)$ 等于它并求解；$c = ${answer.toLatex()}$ 在 $(${a}, ${b})$ 内。`,
                  ),
                  [`${fd} = ${slope.toLatex()}`, `c = ${answer.toLatex()}`],
                ],
              ],
              t(
                `Substitute back: $f'(${answer.toLatex()}) = ${back.toLatex()}$, the average slope. For a quadratic, $c$ is always the midpoint of the interval.`,
                `代回检验：$f'(${answer.toLatex()}) = ${back.toLatex()}$，正是平均斜率。对二次函数，$c$ 总是区间的中点。`,
              ),
            ),
          });
        }
        if (kind === 1) {
          const [a, b, c] = rng.pick([
            [1, 4, 2],
            [1, 9, 3],
            [2, 8, 4],
            [4, 9, 6],
            [1, 16, 4],
            [3, 12, 6],
            [4, 16, 8],
            [2, 18, 6],
            [1, 25, 5],
            [9, 16, 12],
          ] as const);
          const k = rng.int(1, 12);
          const slope = Q.of(-k, a * b);
          return numberProblem({
            prompt: t(
              `Find the value of $c$ that satisfies the conclusion of the mean value theorem for $f(x) = \\frac{${k}}{x}$ on $[${a}, ${b}]$.`,
              `求满足中值定理结论的 $c$，其中 $f(x) = \\frac{${k}}{x}$，区间为 $[${a}, ${b}]$。`,
            ),
            answer: c,
            wrong: [Q.of(a + b, 2), slope, Q.of(-c)].filter((w) => !w.eq(Q.of(c))),
            solution: walked(
              [
                [
                  ["Find the average slope", "求平均斜率"],
                  t(
                    `$f$ is continuous and differentiable for $x > 0$, which covers $[${a}, ${b}]$. The secant slope is`,
                    `$f$ 在 $x > 0$ 时连续且可导，这包含了 $[${a}, ${b}]$。割线斜率为`,
                  ),
                  [`\\frac{\\frac{${k}}{${b}} - \\frac{${k}}{${a}}}{${b} - ${a}} = ${slope.toLatex()}`],
                ],
                [
                  ["Solve for c", "解出 c"],
                  t(
                    `Set $f'(c)$ equal to it. Then $c^{2} = ${a * b}$, and of $c = \\pm ${c}$ only $c = ${c}$ lies in $(${a}, ${b})$.`,
                    `令 $f'(c)$ 等于它，得 $c^{2} = ${a * b}$；在 $c = \\pm ${c}$ 中只有 $c = ${c}$ 在 $(${a}, ${b})$ 内。`,
                  ),
                  [`-\\frac{${k}}{c^{2}} = ${slope.toLatex()}`],
                ],
              ],
              t(
                `Substitute back: $f'(${c})$ is $-\\frac{${k}}{${c * c}}$, which is $${slope.toLatex()}$, the average slope.`,
                `代回检验：$f'(${c})$ 等于 $-\\frac{${k}}{${c * c}}$，即 $${slope.toLatex()}$，正是平均斜率。`,
              ),
            ),
          });
        }
        const s = rng.int(0, 6);
        const tt = s + 2 * rng.int(1, 3);
        const c = ((s + tt) / 2) ** 2;
        const slope = Q.of(1, s + tt);
        return numberProblem({
          prompt: t(
            `Find the value of $c$ that satisfies the conclusion of the mean value theorem for $f(x) = \\sqrt{x}$ on $[${s * s}, ${tt * tt}]$.`,
            `求满足中值定理结论的 $c$，其中 $f(x) = \\sqrt{x}$，区间为 $[${s * s}, ${tt * tt}]$。`,
          ),
          answer: c,
          wrong: [Q.of(s * s + tt * tt, 2), Q.of((s + tt) / 2), slope].filter((w) => !w.eq(Q.of(c))),
          solution: walked(
            [
              [
                ["Find the average slope", "求平均斜率"],
                t(
                  `$\\sqrt{x}$ is continuous on $[${s * s}, ${tt * tt}]$ and differentiable inside it. The secant slope is`,
                  `$\\sqrt{x}$ 在 $[${s * s}, ${tt * tt}]$ 上连续，在其内部可导。割线斜率为`,
                ),
                [`\\frac{${tt} - ${s}}{${tt * tt} - ${s * s}} = ${slope.toLatex()}`],
              ],
              [
                ["Solve for c", "解出 c"],
                t(`Set $f'(c)$ equal to it, so $\\sqrt{c} = ${(s + tt) / 2}$:`, `令 $f'(c)$ 等于它，得 $\\sqrt{c} = ${(s + tt) / 2}$：`),
                [`\\frac{1}{2\\sqrt{c}} = ${slope.toLatex()}`, `c = ${c}`],
              ],
            ],
            t(
              `$${c}$ lies in $(${s * s}, ${tt * tt})$, and $f'(${c})$ is $\\frac{1}{2 \\cdot ${(s + tt) / 2}}$, which is $${slope.toLatex()}$, the average slope.`,
              `$${c}$ 在 $(${s * s}, ${tt * tt})$ 内，且 $f'(${c})$ 等于 $\\frac{1}{2 \\cdot ${(s + tt) / 2}}$，即 $${slope.toLatex()}$，正是平均斜率。`,
            ),
          ),
        });
      },
    },
    {
      id: "checking-the-hypotheses-of-the-mean-value-theorem",
      figure: calculusDrawings2["the-mean-value-theorem#checking-the-hypotheses-of-the-mean-value-theorem"],
      title: t("Checking the hypotheses of the mean value theorem", "检查中值定理的条件"),
      explanation: t(
        "The theorem needs both hypotheses: continuity on the closed interval $[a, b]$ and differentiability on the open interval $(a, b)$. A jump, a hole or an asymptote breaks the first; a corner, a cusp or a vertical tangent breaks the second. Differentiability at the endpoints is not needed.\n\nFor example, $f(x) = |x|$ on $[-1, 2]$ is continuous but has a corner at $0$, so the theorem does not apply.\n\nCheck: the average slope is $\\frac{2 - 1}{3}$, which is $\\frac{1}{3}$, but the slope of $|x|$ is only ever $-1$ or $1$. No $c$ works, as the failed hypothesis allows.\n\n> **Watch out.** Only the open interval needs differentiability. $\\sqrt{x}$ on $[0, 4]$ has no derivative at $0$, yet the theorem applies to it.",
        "定理需要两个条件：在闭区间 $[a, b]$ 上连续，在开区间 $(a, b)$ 内可导。跳跃、空洞或渐近线破坏第一个条件；尖点、角点或竖直切线破坏第二个条件。端点处不要求可导。\n\n例如 $f(x) = |x|$ 在 $[-1, 2]$ 上连续，但在 $0$ 处有尖点，所以定理不适用。\n\n检验：平均斜率为 $\\frac{2 - 1}{3}$，即 $\\frac{1}{3}$，而 $|x|$ 的斜率只能是 $-1$ 或 $1$。没有 $c$ 满足结论，这正是条件不满足时可能出现的情况。\n\n> **注意。** 只有开区间内要求可导。$\\sqrt{x}$ 在 $0$ 处没有导数，但定理仍适用于 $[0, 4]$ 上的 $\\sqrt{x}$。",
      ),
      generate(rng) {
        const fn = applicability(rng, true);
        const options = [
          t("Yes", "是"),
          t(`No: $f$ is not continuous on $${fn.interval}$`, `否：$f$ 在 $${fn.interval}$ 上不连续`),
          t("No: $f$ is not differentiable on the open interval", "否：$f$ 在开区间内不可导"),
        ];
        const right = !fn.continuous ? 1 : !fn.differentiable ? 2 : 0;
        const verdict =
          right === 0
            ? t("Both hypotheses hold, so the theorem applies.", "两个条件都满足，所以定理适用。")
            : t("So the theorem does not apply.", "所以定理不适用。");
        return reasoned(
          oneOf(
            rng,
            t(
              `Does the mean value theorem apply to $f(x) = ${fn.f}$ on $${fn.interval}$?`,
              `中值定理是否适用于 $f(x) = ${fn.f}$ 在 $${fn.interval}$ 上的情形？`,
            ),
            options[right]!,
            options.filter((_, i) => i !== right),
            walked(
              [
                [["Check continuity", "检查连续性"], continuity(fn)],
                [
                  ["Check differentiability inside", "检查内部的可导性"],
                  fn.differentiable
                    ? t("$f$ has a derivative at every point of the open interval.", "$f$ 在开区间的每一点都有导数。")
                    : t("$f$ fails to have a derivative at a point inside the interval.", "$f$ 在区间内的某一点没有导数。"),
                ],
                [["Conclude", "得出结论"], t(`${fn.why.en} ${verdict.en}`, `${fn.why["zh-CN"]}${verdict["zh-CN"]}`)],
              ],
              fn.check,
            ),
          ),
          [
            [options[0]!.en, `Not both hypotheses hold. ${fn.why.en}`, `两个条件并不都满足。${fn.why["zh-CN"]}`],
            [
              options[1]!.en,
              `$f$ is continuous on $${fn.interval}$: its graph has no break there.`,
              `$f$ 在 $${fn.interval}$ 上连续：它的图像在那里没有断开。`,
            ],
            [
              options[2]!.en,
              fn.continuous
                ? "$f$ has a derivative at every point inside the interval."
                : "The first hypothesis already fails: $f$ is not even continuous, which is the more basic reason.",
              fn.continuous ? "$f$ 在区间内的每一点都有导数。" : "第一个条件已经不满足：$f$ 本身就不连续，这是更根本的原因。",
            ],
          ],
        );
      },
    },
  ],
};

/** vertexTable tabulates the vertices of a zigzag graph from index from to index to. */
const vertexTable = (ys: readonly number[], from = 0, to = ys.length - 1) =>
  table(["$x$", ...zigzagXs.slice(from, to + 1).map((x) => `$${x}$`)], ["$f(x)$", ...ys.slice(from, to + 1).map((y) => `$${y}$`)]);

/** turns lists the x-coordinates of the interior vertices of a zigzag graph that are local maxima, or local minima. */
function turns(ys: readonly number[], max: boolean): number[] {
  return zigzagXs.filter((_, i) => {
    if (i === 0 || i === ys.length - 1) return false;
    const [l, m, r] = [ys[i - 1]!, ys[i]!, ys[i + 1]!];
    return max ? m > l && m > r : m < l && m < r;
  });
}

/** globalVsLocalExtremaAndCriticalPoints distinguishes global and local extrema on graphs. */
export const globalVsLocalExtremaAndCriticalPoints: TopicDef = {
  id: "global-vs-local-extrema-and-critical-points",
  title: t("Global vs. Local Extrema and Critical Points", "全局极值、局部极值与临界点"),
  summary: t("Read global and local extrema from graphs, and recognize critical points.", "由图像读出全局极值和局部极值，并识别临界点。"),
  prerequisites: ["the-mean-value-theorem", "calculating-derivatives-from-graphs"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The slope of a graph can be read off where it turns. On $[-1, 2]$, the graph of $f(x) = x^{2}$ falls to its lowest point $(0, 0)$, where the tangent is horizontal and $f'(0) = 0$, and then rises to its highest point $(2, 4)$, at the right endpoint.

Check: $f(-1) = 1$, $f(0) = 0$, $f(1) = 1$ and $f(2) = 4$, so $0$ is the smallest of these values and $4$ the largest.

In this lesson we read the largest and smallest values of a function from its graph, both over a whole interval and near a single point, and meet the critical points where they can occur.`,
    `可以从图像转向的地方读出斜率。在 $[-1, 2]$ 上，$f(x) = x^{2}$ 的图像先下降到最低点 $(0, 0)$，那里切线水平，$f'(0) = 0$；然后上升到右端点处的最高点 $(2, 4)$。

检验：$f(-1) = 1$，$f(0) = 0$，$f(1) = 1$，$f(2) = 4$，所以 $0$ 是这些值中最小的，$4$ 是最大的。

这节课我们从图像读出函数的最大值和最小值，既看整个区间，也看某一点附近，并认识可能取得它们的临界点。`,
  ),
  knowledgePoints: [
    {
      id: "global-extrema-from-graphs",
      figure: calculusDrawings2["global-vs-local-extrema-and-critical-points#global-extrema-from-graphs"],
      title: t("Global extrema from graphs", "由图像读出全局极值"),
      explanation: t(
        "The global (absolute) maximum of $f$ on an interval is its largest value there; the global minimum is its smallest. They may occur at endpoints. The value is the $y$-coordinate, not the $x$-coordinate where it occurs.\n\nFor example, if the graph on $[-2, 3]$ is made of segments joining $(-2, 1)$, $(0, 5)$ and $(3, -2)$, the global maximum is $5$, at $x = 0$, and the global minimum is $-2$, at the endpoint $x = 3$.\n\nCheck: each segment stays between the heights of its two ends, so only the vertices need comparing, and $-2 \\le 1 \\le 5$.\n\n> **Watch out.** Answer with the height $5$, not the place $x = 0$. And do not skip the endpoints: here the minimum is at one.",
        "$f$ 在区间上的全局（绝对）最大值是它在该区间上的最大函数值，全局最小值是最小函数值。它们可能出现在端点处。所求的值是 $y$ 坐标，而不是取得该值的 $x$ 坐标。\n\n例如，若 $[-2, 3]$ 上的图像由连接 $(-2, 1)$、$(0, 5)$、$(3, -2)$ 的线段组成，则全局最大值是 $5$，在 $x = 0$ 处取得；全局最小值是 $-2$，在端点 $x = 3$ 处取得。\n\n检验：每条线段的高度都在两端的高度之间，所以只需比较顶点，而 $-2 \\le 1 \\le 5$。\n\n> **注意。** 回答高度 $5$，而不是位置 $x = 0$。也不要漏掉端点：这里的最小值就在端点处。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const max = rng.bool();
        const answer = max ? Math.max(...ys) : Math.min(...ys);
        const at = zigzagXs[ys.indexOf(answer)]!;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f$ on $[-6, 6]$ is shown. What is the global ${max ? "maximum" : "minimum"} value of $f$ on $[-6, 6]$?`,
              `图中是 $f$ 在 $[-6, 6]$ 上的图像。$f$ 在 $[-6, 6]$ 上的全局${max ? "最大值" : "最小值"}是多少？`,
            ),
            answer,
            wrong: [at, max ? Math.min(...ys) : Math.max(...ys)].filter((w) => w !== answer),
            solution: walked(
              [
                [
                  ["Read the heights of the vertices", "读出顶点的高度"],
                  t(
                    `Each segment stays between the heights of its ends, so the extreme values occur at the vertices, endpoints included:\n\n${vertexTable(ys)}\n\n`,
                    `每条线段的高度都在两端之间，所以最值出现在顶点处，端点也算在内：\n\n${vertexTable(ys)}\n\n`,
                  ),
                ],
                [
                  [`Pick the ${max ? "highest" : "lowest"}`, `找出${max ? "最高" : "最低"}的`],
                  t(
                    `The ${max ? "highest" : "lowest"} point is $(${at}, ${answer})$, so the global ${max ? "maximum" : "minimum"} value is its height, $${answer}$.`,
                    `${max ? "最高" : "最低"}点是 $(${at}, ${answer})$，所以全局${max ? "最大值" : "最小值"}是它的高度 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `The horizontal line $y = ${answer}$ touches the graph at $x = ${at}$, and every vertex lies on or ${max ? "below" : "above"} it, so no point of the graph is ${max ? "higher" : "lower"}. The answer is that height, not the place $x = ${at}$.`,
                `水平线 $y = ${answer}$ 在 $x = ${at}$ 处与图像接触，而每个顶点都在它${max ? "下方" : "上方"}或线上，所以图像上没有更${max ? "高" : "低"}的点。答案是这个高度，而不是位置 $x = ${at}$。`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "local-extrema-from-graphs",
      figure: calculusDrawings2["global-vs-local-extrema-and-critical-points#local-extrema-from-graphs"],
      title: t("Local extrema from graphs", "由图像读出局部极值"),
      explanation: t(
        "$f$ has a local maximum at an interior point $c$ if $f(c) \\ge f(x)$ for all $x$ near $c$: the graph rises to $c$ and falls after it. Local minima are the reverse. Local extrema occur at critical points, where $f'(c) = 0$ or $f'(c)$ does not exist; on these graphs they are the corners where the graph turns.\n\nFor example, if the vertices have heights $1, 4, 2, 5, 3$ at $x = 0, 1, 2, 3, 4$, the graph turns down at $x = 1$ and $x = 3$, two local maxima, and turns up at $x = 2$, one local minimum.\n\nCheck: local maxima and minima alternate along a graph, so between the two maxima there must be a minimum, and there is one, at $x = 2$.\n\n> **Watch out.** A local maximum need not be the global one: $4$ at $x = 1$ is lower than $5$. And on the open interval the endpoints $x = 0$ and $x = 4$ do not count.",
        "若对 $c$ 附近的所有 $x$ 都有 $f(c) \\ge f(x)$，则 $f$ 在内点 $c$ 处有局部极大值：图像在 $c$ 之前上升、之后下降。局部极小值相反。局部极值出现在临界点处，即 $f'(c) = 0$ 或 $f'(c)$ 不存在的点；在这些图像上就是图像转向的折点。\n\n例如，若顶点在 $x = 0, 1, 2, 3, 4$ 处的高度为 $1, 4, 2, 5, 3$，图像在 $x = 1$ 和 $x = 3$ 处向下转，是两个局部极大值；在 $x = 2$ 处向上转，是一个局部极小值。\n\n检验：沿着图像，局部极大值和局部极小值交替出现，所以两个极大值之间必有一个极小值，而 $x = 2$ 处正好有一个。\n\n> **注意。** 局部极大值不一定是全局最大值：$x = 1$ 处的 $4$ 比 $5$ 小。在开区间上，端点 $x = 0$ 和 $x = 4$ 不算。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const max = rng.bool();
        const at = turns(ys, max);
        const other = turns(ys, !max);
        const [kind, otherKind] = max ? [t("maxima", "极大值"), t("minima", "极小值")] : [t("minima", "极小值"), t("maxima", "极大值")];
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f$ on $[-6, 6]$ is shown. How many local ${kind.en} does $f$ have in the open interval $(-6, 6)$?`,
              `图中是 $f$ 在 $[-6, 6]$ 上的图像。$f$ 在开区间 $(-6, 6)$ 内有多少个局部${kind["zh-CN"]}？`,
            ),
            answer: at.length,
            wrong: [other.length, at.length + 1].filter((w) => w !== at.length),
            solution: walked(
              [
                [
                  ["Read the interior vertices", "读出内部的顶点"],
                  t(
                    `The endpoints $-6$ and $6$ are left out. The interior vertices are\n\n${vertexTable(ys, 1, ys.length - 2)}\n\n`,
                    `端点 $-6$ 和 $6$ 不算。内部的顶点是\n\n${vertexTable(ys, 1, ys.length - 2)}\n\n`,
                  ),
                ],
                [
                  ["Compare each with its neighbours", "与相邻顶点比较"],
                  at.length === 0
                    ? t(
                        `No interior vertex is ${max ? "higher" : "lower"} than both its neighbours, so there are none.`,
                        `没有哪个内部顶点比两侧相邻的顶点都${max ? "高" : "低"}，所以一个也没有。`,
                      )
                    : t(
                        `The graph ${max ? "rises and then falls" : "falls and then rises"} at $x = ${at.join(", ")}$, so there ${at.length === 1 ? "is $1$" : `are $${at.length}$`}.`,
                        `图像在 $x = ${at.join(", ")}$ 处${max ? "先升后降" : "先降后升"}，所以共有 $${at.length}$ 个。`,
                      ),
                ],
              ],
              t(
                `Local maxima and minima alternate along the graph, so their numbers differ by at most $1$. Counting the local ${otherKind.en} the same way gives $${other.length}$, which fits with $${at.length}$.`,
                `沿着图像，局部极大值和局部极小值交替出现，所以它们的个数最多相差 $1$。用同样的方法数局部${otherKind["zh-CN"]}，得 $${other.length}$ 个，与 $${at.length}$ 相符。`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
  ],
};

/** theExtremeValueTheorem applies the extreme value theorem. */
export const theExtremeValueTheorem: TopicDef = {
  id: "the-extreme-value-theorem",
  title: t("The Extreme Value Theorem", "极值定理"),
  summary: t(
    "Decide when the extreme value theorem guarantees global extrema, and find extrema of monotonic functions on closed intervals.",
    "判断极值定理何时保证全局极值存在，并求单调函数在闭区间上的最值。",
  ),
  prerequisites: ["global-vs-local-extrema-and-critical-points"],
  encompasses: [{ topic: "global-vs-local-extrema-and-critical-points", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `On the closed interval $[-1, 2]$, $f(x) = x^{2}$ has a global maximum $4$, at $x = 2$, and a global minimum $0$, at $x = 0$. On the open interval $(-1, 2)$ the endpoint $2$ is left out, and the values approach $4$ without reaching it, so there is no global maximum.

Check: $f(1.99) = 3.9601$ and $f(1.999) = 3.996001$. Each is below $4$, and a point closer to $2$ always gives a larger value.

In this lesson we learn when a function is sure to have a global maximum and minimum, and find them when the function only increases or only decreases.`,
    `在闭区间 $[-1, 2]$ 上，$f(x) = x^{2}$ 有全局最大值 $4$（在 $x = 2$ 处）和全局最小值 $0$（在 $x = 0$ 处）。在开区间 $(-1, 2)$ 上端点 $2$ 不在其中，函数值趋近 $4$ 却达不到，所以没有全局最大值。

检验：$f(1.99) = 3.9601$，$f(1.999) = 3.996001$。它们都小于 $4$，而更靠近 $2$ 的点总给出更大的值。

这节课我们学习函数在什么情况下一定有全局最大值和最小值，并在函数只增或只减时把它们求出来。`,
  ),
  knowledgePoints: [
    {
      id: "checking-the-hypotheses-of-the-extreme-value-theorem",
      title: t("Checking the hypotheses of the extreme value theorem", "检查极值定理的条件"),
      explanation: t(
        "If $f$ is continuous on a closed interval $[a, b]$, then $f$ has a global maximum and a global minimum on $[a, b]$. Differentiability is not needed. On an open interval, or with a discontinuity, the theorem guarantees nothing.\n\nFor example, $\\frac{1}{x}$ on $(0, 1)$ has no maximum: the interval is open, and the function grows without bound near $0$.\n\nCheck: $f(0.01) = 100$ and $f(0.001) = 1000$. Whatever value is proposed as the maximum, a point closer to $0$ gives more.\n\n> **Watch out.** A corner does not spoil the theorem: $|x|$ on $[-1, 1]$ is not differentiable at $0$, yet it has a maximum $1$ and a minimum $0$.",
        "若 $f$ 在闭区间 $[a, b]$ 上连续，则 $f$ 在 $[a, b]$ 上有全局最大值和全局最小值。不要求可导。在开区间上或有间断时，定理不能保证任何结论。\n\n例如 $\\frac{1}{x}$ 在 $(0, 1)$ 上没有最大值：区间是开的，而函数在 $0$ 附近无限增大。\n\n检验：$f(0.01) = 100$，$f(0.001) = 1000$。无论把哪个值当作最大值，更靠近 $0$ 的点都给出更大的值。\n\n> **注意。** 尖点不影响定理：$|x|$ 在 $0$ 处不可导，但它在 $[-1, 1]$ 上有最大值 $1$ 和最小值 $0$。",
      ),
      generate(rng) {
        const fn = applicability(rng);
        const options = [
          t("Yes", "是"),
          t("No: the interval is not closed", "否：区间不是闭区间"),
          t("No: $f$ is not continuous on the interval", "否：$f$ 在区间上不连续"),
        ];
        const right = !fn.closed ? 1 : !fn.continuous ? 2 : 0;
        return reasoned(
          oneOf(
            rng,
            t(
              `Does the extreme value theorem guarantee that $f(x) = ${fn.f}$ has a global maximum on $${fn.interval}$?`,
              `极值定理是否保证 $f(x) = ${fn.f}$ 在 $${fn.interval}$ 上有全局最大值？`,
            ),
            options[right]!,
            options.filter((_, i) => i !== right),
            walked(
              [
                [
                  ["Check the interval", "检查区间"],
                  fn.closed
                    ? t(`$${fn.interval}$ includes both endpoints, so it is closed.`, `$${fn.interval}$ 包含两个端点，所以是闭区间。`)
                    : t(`$${fn.interval}$ leaves out its endpoints, so it is open.`, `$${fn.interval}$ 不包含端点，所以是开区间。`),
                ],
                [["Check continuity", "检查连续性"], continuity(fn)],
                [
                  ["Conclude", "得出结论"],
                  t(
                    `${fn.why.en} ${right === 0 ? "Only continuity on a closed interval is needed, so the theorem applies." : "So the theorem does not apply."}`,
                    `${fn.why["zh-CN"]}${right === 0 ? "定理只要求在闭区间上连续，所以定理适用。" : "所以定理不适用。"}`,
                  ),
                ],
              ],
              fn.check,
            ),
          ),
          [
            [options[0]!.en, `A hypothesis fails. ${fn.why.en}`, `有一个条件不满足。${fn.why["zh-CN"]}`],
            [
              options[1]!.en,
              `$${fn.interval}$ includes both its endpoints, so it is closed.`,
              `$${fn.interval}$ 包含两个端点，所以是闭区间。`,
            ],
            [
              options[2]!.en,
              "$f$ is continuous there. A corner or a vertical tangent does not break continuity, and the theorem does not need a derivative.",
              "$f$ 在那里连续。尖点或竖直切线不会破坏连续性，而定理不要求可导。",
            ],
          ],
        );
      },
    },
    {
      id: "extrema-of-monotonic-functions",
      title: t("Extrema of monotonic functions", "单调函数的最值"),
      explanation: t(
        "A continuous function that is increasing on $[a, b]$ has its minimum $f(a)$ and maximum $f(b)$; a decreasing one is the reverse. The extremes sit at the endpoints.\n\nFor example, $f(x) = 2x + 1$ has slope $2 > 0$, so on $[-1, 3]$ its minimum is $f(-1) = -1$ and its maximum is $f(3) = 7$.\n\nCheck: an interior point gives a value in between, as it must: $f(1) = 3$, and $-1 < 3 < 7$.\n\n> **Watch out.** $x^{3}$ has $f'(0) = 0$, yet it still increases everywhere, so its extremes on $[a, b]$ are still at the ends. And the answer is the value $f(b)$, not the endpoint $b$.",
        "在 $[a, b]$ 上递增的连续函数，最小值为 $f(a)$，最大值为 $f(b)$；递减函数则相反。最值都在端点处取得。\n\n例如 $f(x) = 2x + 1$ 的斜率 $2 > 0$，所以在 $[-1, 3]$ 上最小值是 $f(-1) = -1$，最大值是 $f(3) = 7$。\n\n检验：内部的点给出介于两者之间的值，正应如此：$f(1) = 3$，且 $-1 < 3 < 7$。\n\n> **注意。** $x^{3}$ 有 $f'(0) = 0$，但它仍处处递增，所以它在 $[a, b]$ 上的最值仍在端点处。答案是函数值 $f(b)$，而不是端点 $b$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 2);
        const b = a + rng.int(1, 5);
        const max = rng.bool();
        const linear = rng.bool();
        const p: Poly = linear ? [rng.int(-9, 9), rng.nonZero(-6, 6)] : [rng.int(-9, 9), 0, 0, rng.pick([1, -1, 2, -2])];
        const [fa, fb] = [pAt(p, a), pAt(p, b)];
        const answer = max ? Math.max(fa, fb) : Math.min(fa, fb);
        const increasing = fb > fa;
        const mid = (a + b) / 2;
        return numberProblem({
          prompt: t(
            `Find the global ${max ? "maximum" : "minimum"} value of $f(x) = ${pLatex(p)}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = ${pLatex(p)}$ 在 $[${a}, ${b}]$ 上的全局${max ? "最大值" : "最小值"}。`,
          ),
          answer,
          wrong: [max ? Math.min(fa, fb) : Math.max(fa, fb), max === increasing ? b : a].filter((w) => w !== answer),
          solution: walked(
            [
              [
                ["Find the direction", "判断单调方向"],
                linear
                  ? t(
                      `$f'(x) = ${p[1]}$ is ${signOf(p[1]!).en}, so $f$ is ${increasing ? "increasing" : "decreasing"} on the interval.`,
                      `$f'(x) = ${p[1]}$ 为${signOf(p[1]!)["zh-CN"]}，所以 $f$ 在区间上${increasing ? "递增" : "递减"}。`,
                    )
                  : t(
                      `$f'(x) = ${pLatex(pDer(p))}$ is ${signOf(p[3]!).en} except at $x = 0$, where it is $0$, so $f$ is ${increasing ? "increasing" : "decreasing"} on the interval.`,
                      `$f'(x) = ${pLatex(pDer(p))}$ 除 $x = 0$ 处为 $0$ 外都为${signOf(p[3]!)["zh-CN"]}，所以 $f$ 在区间上${increasing ? "递增" : "递减"}。`,
                    ),
              ],
              [
                ["Evaluate at the endpoints", "计算端点处的值"],
                t(
                  `The extremes sit at the ends: $f(${a}) = ${fa}$ and $f(${b}) = ${fb}$. The ${max ? "maximum" : "minimum"} is $${answer}$.`,
                  `最值在端点处：$f(${a}) = ${fa}$，$f(${b}) = ${fb}$。${max ? "最大值" : "最小值"}是 $${answer}$。`,
                ),
              ],
            ],
            t(
              `An interior point should give a value between the two: $f(${fmt(mid)}) = ${fmt(pAt(p, mid))}$, which lies between $${Math.min(fa, fb)}$ and $${Math.max(fa, fb)}$.`,
              `内部的点应给出介于两者之间的值：$f(${fmt(mid)}) = ${fmt(pAt(p, mid))}$，确实在 $${Math.min(fa, fb)}$ 与 $${Math.max(fa, fb)}$ 之间。`,
            ),
          ),
        });
      },
    },
  ],
};

/** atRoot writes how a quadratic derivative with coefficients [d0, d1, d2] evaluates at x, term by term. */
const atRoot = (d: Poly, x: number) => `${d[2]} \\cdot ${par(x)}^{2} + ${par(d[1]!)} \\cdot ${par(x)} + ${par(d[0]!)} = ${pAt(d, x)}`;

/** usingDifferentiationToCalculateCriticalPoints finds critical points. */
export const usingDifferentiationToCalculateCriticalPoints: TopicDef = {
  id: "using-differentiation-to-calculate-critical-points",
  title: t("Using Differentiation to Calculate Critical Points", "用求导计算临界点"),
  summary: t("Find critical points, where the derivative is zero or does not exist.", "求临界点，即导数为零或不存在的点。"),
  prerequisites: ["global-vs-local-extrema-and-critical-points"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `Local extrema occur where the graph turns, and on a smooth graph the tangent there is horizontal. For $f(x) = x^{2} - 6x$, $f'(x) = 2x - 6$, which is $0$ at $x = 3$, and the lowest point of the graph is $(3, -9)$.

Check: $f(2.9) = -8.99$ and $f(3.1) = -8.99$, both above $-9$.

In this lesson we find critical points by differentiating: where the derivative is $0$, and where it does not exist.`,
    `局部极值出现在图像转向的地方，而在光滑的图像上，那里的切线是水平的。对 $f(x) = x^{2} - 6x$，$f'(x) = 2x - 6$，它在 $x = 3$ 处为 $0$，图像的最低点是 $(3, -9)$。

检验：$f(2.9) = -8.99$，$f(3.1) = -8.99$，都高于 $-9$。

这节课我们通过求导来找临界点：导数为 $0$ 的点，以及导数不存在的点。`,
  ),
  knowledgePoints: [
    {
      id: "critical-points-of-polynomials",
      title: t("Critical points of polynomials", "多项式的临界点"),
      explanation: t(
        "A critical point of $f$ is a point $c$ in its domain where $f'(c) = 0$ or $f'(c)$ does not exist. For a polynomial, $f'$ always exists, so solve $f'(x) = 0$. For $f(x) = 2x^{3} - 3x^{2} - 12x$,\n\n$$f'(x) = 6x^{2} - 6x - 12 = 6(x - 2)(x + 1),$$\n\nso the critical points are $x = 2$ and $x = -1$.\n\nCheck: in the expanded form, $f'(2) = 24 - 12 - 12 = 0$ and $f'(-1) = 6 + 6 - 12 = 0$.\n\n> **Watch out.** Solve $f'(x) = 0$, not $f(x) = 0$: the zeros of $f$ are where the graph crosses the axis, not where it turns.",
        "$f$ 的临界点是其定义域内满足 $f'(c) = 0$ 或 $f'(c)$ 不存在的点 $c$。多项式的导数总存在，所以解 $f'(x) = 0$。对 $f(x) = 2x^{3} - 3x^{2} - 12x$，\n\n$$f'(x) = 6x^{2} - 6x - 12 = 6(x - 2)(x + 1),$$\n\n所以临界点是 $x = 2$ 和 $x = -1$。\n\n检验：用展开式，$f'(2) = 24 - 12 - 12 = 0$，$f'(-1) = 6 + 6 - 12 = 0$。\n\n> **注意。** 解的是 $f'(x) = 0$，不是 $f(x) = 0$：$f$ 的零点是图像穿过坐标轴的地方，不是图像转向的地方。",
      ),
      generate(rng) {
        const c = cubic(rng);
        const d = pDer(c.p);
        return solutionsProblem({
          prompt: t(`Find the critical points of $f(x) = ${pLatex(c.p)}$.`, `求 $f(x) = ${pLatex(c.p)}$ 的临界点。`),
          values: [String(c.c1), String(c.c2)],
          wrong: [[String(-c.c1), String(-c.c2)], [String(c.c1)]],
          solution: walked(
            [
              [
                ["Differentiate and factor", "求导并因式分解"],
                t("$f$ is a polynomial, so $f'$ exists everywhere:", "$f$ 是多项式，所以 $f'$ 处处存在："),
                [`f'(x) = ${pLatex(d)} = ${derivativeFactored(c)}`],
              ],
              [
                ["Solve f'(x) = 0", "解 f'(x) = 0"],
                t(
                  `A product is $0$ when one of its factors is, so the critical points are $x = ${c.c1}$ and $x = ${c.c2}$.`,
                  `乘积为 $0$ 当且仅当某个因式为 $0$，所以临界点是 $x = ${c.c1}$ 和 $x = ${c.c2}$。`,
                ),
              ],
            ],
            t(
              `Put each into the expanded form of $f'$:${steps(`f'(${c.c1}) = ${atRoot(d, c.c1)}`, `f'(${c.c2}) = ${atRoot(d, c.c2)}`)}Both are $0$, as they should be.`,
              `把它们分别代入 $f'$ 的展开式：${steps(`f'(${c.c1}) = ${atRoot(d, c.c1)}`, `f'(${c.c2}) = ${atRoot(d, c.c2)}`)}两者都是 $0$，正应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "critical-points-of-other-functions",
      title: t("Critical points of other functions", "其他函数的临界点"),
      explanation: t(
        "Differentiate with the appropriate rules and solve $f'(x) = 0$; also include points of the domain where $f'$ does not exist. For $f(x) = xe^{2x}$, the product rule gives\n\n$$f'(x) = e^{2x} + 2xe^{2x} = e^{2x}(1 + 2x).$$\n\nSince $e^{2x} > 0$, this is $0$ only at $x = -\\frac{1}{2}$.\n\nCheck: $f'(-0.6) = -0.2e^{-1.2} < 0$ and $f'(-0.4) = 0.2e^{-0.8} > 0$, so $f'$ passes through $0$ between them.\n\n> **Watch out.** A point where $f'$ does not exist counts only if it is in the domain of $f$. For $x + \\frac{1}{x}$, $f'$ fails at $x = 0$, but $0$ is not in the domain, so it is not a critical point.",
        "用相应的法则求导并解 $f'(x) = 0$；还要包括定义域中 $f'$ 不存在的点。对 $f(x) = xe^{2x}$，由乘积法则得\n\n$$f'(x) = e^{2x} + 2xe^{2x} = e^{2x}(1 + 2x).$$\n\n因为 $e^{2x} > 0$，它只在 $x = -\\frac{1}{2}$ 处为 $0$。\n\n检验：$f'(-0.6) = -0.2e^{-1.2} < 0$，$f'(-0.4) = 0.2e^{-0.8} > 0$，所以 $f'$ 在两者之间经过 $0$。\n\n> **注意。** $f'$ 不存在的点只有在 $f$ 的定义域内才算。对 $x + \\frac{1}{x}$，$f'$ 在 $x = 0$ 处不存在，但 $0$ 不在定义域内，所以不是临界点。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const k = rng.int(1, 6);
        if (kind === 0) {
          const kk = rng.nonZero(-5, 5);
          const answer = Q.of(-1, kk).toLatex();
          const e = `e^{${poly([kk, "x"])}}`;
          const inner = poly([1, ""], [kk, "x"]);
          return solutionsProblem({
            prompt: t(`Find the critical points of $f(x) = x${e}$.`, `求 $f(x) = x${e}$ 的临界点。`),
            values: [answer],
            wrong: [[Q.of(1, kk).toLatex()], ["0", answer]],
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t("By the product rule, and factoring out the exponential:", "用乘积法则，再提出指数因子："),
                  [`f'(x) = ${e} ${kk < 0 ? "-" : "+"} ${Math.abs(kk) === 1 ? "" : Math.abs(kk)}x${e} = ${e}(${inner})`],
                ],
                [
                  ["Solve f'(x) = 0", "解 f'(x) = 0"],
                  t(
                    `$${e} > 0$ for every $x$, so $f'(x) = 0$ only when $${inner} = 0$, at $x = ${answer}$. $f'$ exists everywhere, so there are no other critical points.`,
                    `对每个 $x$ 都有 $${e} > 0$，所以 $f'(x) = 0$ 仅当 $${inner} = 0$，即 $x = ${answer}$。$f'$ 处处存在，所以没有别的临界点。`,
                  ),
                ],
              ],
              t(
                `The factor $${inner}$ is $${fmt(-0.1 * Math.abs(kk))}$ at $0.1$ to one side of $${answer}$ and $${fmt(0.1 * Math.abs(kk))}$ at $0.1$ to the other, so $f'$ changes sign there and passes through $0$.`,
                `因式 $${inner}$ 在 $${answer}$ 一侧距离 $0.1$ 处为 $${fmt(-0.1 * Math.abs(kk))}$，另一侧距离 $0.1$ 处为 $${fmt(0.1 * Math.abs(kk))}$，所以 $f'$ 在那里变号并经过 $0$。`,
              ),
            ),
          });
        }
        if (kind === 1) {
          return solutionsProblem({
            prompt: t(`Find the critical points of $f(x) = x + \\frac{${k * k}}{x}$.`, `求 $f(x) = x + \\frac{${k * k}}{x}$ 的临界点。`),
            values: [String(k), String(-k)],
            wrong: [[String(k)], [String(k), String(-k), "0"]],
            solution: walked(
              [
                [["Differentiate", "求导"], t("The power rule gives", "由幂法则得"), [`f'(x) = 1 - \\frac{${k * k}}{x^{2}}`]],
                [
                  ["Solve f'(x) = 0", "解 f'(x) = 0"],
                  t(
                    `$f'(x) = 0$ when $x^{2} = ${k * k}$, so $x = \\pm ${k}$. $f'$ does not exist at $x = 0$, but $0$ is not in the domain, so it is not a critical point.`,
                    `$f'(x) = 0$ 时 $x^{2} = ${k * k}$，所以 $x = \\pm ${k}$。$f'$ 在 $x = 0$ 处不存在，但 $0$ 不在定义域内，所以不是临界点。`,
                  ),
                ],
              ],
              t(
                `At $x = \\pm ${k}$, $x^{2} = ${k * k}$, so the fraction is $1$ and $f'$ is $1 - 1 = 0$. And $f(${k}) = ${2 * k}$ while $f(${k + 1}) \\approx ${fmt(k + 1 + (k * k) / (k + 1))}$ is larger, as near a turning point.`,
                `在 $x = \\pm ${k}$ 处 $x^{2} = ${k * k}$，分数等于 $1$，$f'$ 等于 $1 - 1 = 0$。而 $f(${k}) = ${2 * k}$，$f(${k + 1}) \\approx ${fmt(k + 1 + (k * k) / (k + 1))}$ 更大，符合转向点附近的情形。`,
              ),
            ),
          });
        }
        if (kind === 2) {
          return solutionsProblem({
            prompt: t(
              `Find the critical points of $f(x) = \\frac{x}{x^{2} + ${k * k}}$.`,
              `求 $f(x) = \\frac{x}{x^{2} + ${k * k}}$ 的临界点。`,
            ),
            values: [String(k), String(-k)],
            wrong: [[String(k)], ["0"]],
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t("By the quotient rule:", "由商法则："),
                  [
                    `f'(x) = \\frac{(x^{2} + ${k * k}) - 2x^{2}}{(x^{2} + ${k * k})^{2}} = \\frac{${k * k} - x^{2}}{(x^{2} + ${k * k})^{2}}`,
                  ],
                ],
                [
                  ["Solve f'(x) = 0", "解 f'(x) = 0"],
                  t(
                    `The denominator is never $0$, so $f'$ exists everywhere, and it is $0$ where the numerator is: $x = \\pm ${k}$.`,
                    `分母从不为 $0$，所以 $f'$ 处处存在，它在分子为 $0$ 处为 $0$：$x = \\pm ${k}$。`,
                  ),
                ],
              ],
              t(
                `$f(${k})$ is $\\frac{1}{${2 * k}}$ and $f(${-k})$ is $-\\frac{1}{${2 * k}}$. Nearby values are smaller in size: $f(${k + 1}) \\approx ${fmt((k + 1) / ((k + 1) ** 2 + k * k))}$, below $${fmt(1 / (2 * k))}$, as at a turning point.`,
                `$f(${k})$ 等于 $\\frac{1}{${2 * k}}$，$f(${-k})$ 等于 $-\\frac{1}{${2 * k}}$。附近的值绝对值更小：$f(${k + 1}) \\approx ${fmt((k + 1) / ((k + 1) ** 2 + k * k))}$，小于 $${fmt(1 / (2 * k))}$，符合转向点的情形。`,
              ),
            ),
          });
        }
        const c = rng.int(-5, 5);
        const inner = poly([1, "x"], [-c, ""]);
        const f = `\\sqrt[3]{${inner}}`;
        return solutionsProblem({
          prompt: t(`Find the critical points of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的临界点。`),
          values: [String(c)],
          wrong: [[], [String(-c)]],
          solution: walked(
            [
              [["Differentiate", "求导"], t("By the power rule:", "由幂法则："), [`f'(x) = \\frac{1}{3\\sqrt[3]{(${inner})^{2}}}`]],
              [
                ["Find where f' is 0 or fails", "找出 f' 为 0 或不存在的点"],
                t(
                  `The numerator is $1$, so $f'$ is never $0$. But $f'$ does not exist at $x = ${c}$, where the denominator is $0$, and $${c}$ is in the domain. So $x = ${c}$ is the only critical point.`,
                  `分子是 $1$，所以 $f'$ 从不为 $0$。但 $f'$ 在分母为 $0$ 的 $x = ${c}$ 处不存在，而 $${c}$ 在定义域内。所以 $x = ${c}$ 是唯一的临界点。`,
                ),
              ],
            ],
            t(
              `The difference quotient of $f$ at $x = ${c}$ is $h^{-\\frac{2}{3}}$: about $${fmt(0.01 ** (-2 / 3))}$ for $h = 0.01$ and $100$ for $h = 0.001$. It grows without bound, so the tangent there is vertical and $f'(${c})$ does not exist.`,
              `$f$ 在 $x = ${c}$ 处的差商为 $h^{-\\frac{2}{3}}$：$h = 0.01$ 时约为 $${fmt(0.01 ** (-2 / 3))}$，$h = 0.001$ 时为 $100$。它无限增大，所以那里的切线是竖直的，$f'(${c})$ 不存在。`,
            ),
          ),
        });
      },
    },
  ],
};

/** monotonicityOptions are the choices for where a cubic increases or decreases. */
export function monotonicityOptions(c: Cubic, increasing: boolean) {
  const middle = intervals(open(c.c1, c.c2));
  const outer = intervals(open(undefined, c.c1), open(c.c2, undefined));
  const rightIsMiddle = increasing !== c.up;
  return {
    right: rightIsMiddle ? middle : outer,
    wrong: [rightIsMiddle ? outer : middle, intervals(open(undefined, c.c2)), intervals(open(c.c1, undefined))],
  };
}

/** determiningIntervalsOnWhichAFunctionIsIncreasingOrDecreasing reads monotonicity from the sign of f'. */
export const determiningIntervalsOnWhichAFunctionIsIncreasingOrDecreasing: TopicDef = {
  id: "determining-intervals-on-which-a-function-is-increasing-or-decreasing",
  title: t("Determining Intervals on Which a Function Is Increasing or Decreasing", "确定函数的递增与递减区间"),
  summary: t(
    "Use the sign of the derivative between critical points to find where a function increases or decreases.",
    "用临界点之间导数的符号确定函数的递增和递减区间。",
  ),
  prerequisites: ["using-differentiation-to-calculate-critical-points"],
  encompasses: [{ topic: "using-differentiation-to-calculate-critical-points", weight: 0.4 }],
  xp: 10,
  standards: [],
  intro: t(
    `$f(x) = x^{2} - 4x$ has one critical point: $f'(x) = 2x - 4$ is $0$ at $x = 2$. For $x < 2$, $f'(x) < 0$, so the graph falls; for $x > 2$, $f'(x) > 0$, so it rises. So $f$ decreases on $(-\\infty, 2)$ and increases on $(2, \\infty)$.

Check: $f(0) = 0$, $f(1) = -3$, $f(2) = -4$, $f(3) = -3$ and $f(4) = 0$: the values fall until $x = 2$ and then rise.

In this lesson we use the sign of the derivative between critical points to find where a function increases and where it decreases.`,
    `$f(x) = x^{2} - 4x$ 有一个临界点：$f'(x) = 2x - 4$ 在 $x = 2$ 处为 $0$。当 $x < 2$ 时 $f'(x) < 0$，图像下降；当 $x > 2$ 时 $f'(x) > 0$，图像上升。所以 $f$ 在 $(-\\infty, 2)$ 上递减，在 $(2, \\infty)$ 上递增。

检验：$f(0) = 0$，$f(1) = -3$，$f(2) = -4$，$f(3) = -3$，$f(4) = 0$：函数值在 $x = 2$ 之前下降，之后上升。

这节课我们用临界点之间导数的符号，找出函数递增和递减的区间。`,
  ),
  knowledgePoints: [
    {
      id: "increasing-and-decreasing-polynomials",
      title: t("Increasing and decreasing polynomials", "多项式的单调性"),
      explanation: t(
        "$f$ is increasing where $f'(x) > 0$ and decreasing where $f'(x) < 0$. Find the critical points, which split the line into intervals, and test the sign of $f'$ at one point in each. For $f'(x) = 6(x - 2)(x + 1)$, $f'(-2) = 24$, $f'(0) = -12$ and $f'(3) = 24$, so $f$ increases on $(-\\infty, -1)$ and $(2, \\infty)$ and decreases on $(-1, 2)$.\n\nCheck: with $f(x) = 2x^{3} - 3x^{2} - 12x$, $f(-1) = 7$ and $f(2) = -20$: the values drop across $(-1, 2)$, as they must on an interval of decrease.\n\n> **Watch out.** Write the intervals of increase separately, not as one interval $(-\\infty, \\infty)$ or $(-\\infty, 2)$: each such interval would run across a point where $f'$ changes sign.",
        "$f'(x) > 0$ 时 $f$ 递增，$f'(x) < 0$ 时 $f$ 递减。先求临界点，它们把数轴分成若干区间，再在每个区间取一点检验 $f'$ 的符号。对 $f'(x) = 6(x - 2)(x + 1)$，$f'(-2) = 24$，$f'(0) = -12$，$f'(3) = 24$，所以 $f$ 在 $(-\\infty, -1)$ 和 $(2, \\infty)$ 上递增，在 $(-1, 2)$ 上递减。\n\n检验：取 $f(x) = 2x^{3} - 3x^{2} - 12x$，$f(-1) = 7$，$f(2) = -20$：函数值在 $(-1, 2)$ 上下降，递减区间上正应如此。\n\n> **注意。** 两个递增区间要分开写，不能写成一个区间 $(-\\infty, \\infty)$ 或 $(-\\infty, 2)$：这样的区间会跨过 $f'$ 变号的点。",
      ),
      generate(rng) {
        const c = cubic(rng);
        const increasing = rng.bool();
        const { right, wrong } = monotonicityOptions(c, increasing);
        const d = pDer(c.p);
        const probes = [c.c1 - 1, (c.c1 + c.c2) / 2, c.c2 + 1];
        return reasoned(
          oneOf(
            rng,
            t(
              `On which intervals is $f(x) = ${pLatex(c.p)}$ ${increasing ? "increasing" : "decreasing"}?`,
              `$f(x) = ${pLatex(c.p)}$ 在哪些区间上${increasing ? "递增" : "递减"}？`,
            ),
            right,
            wrong,
            walked(
              [
                [
                  ["Find the critical points", "求临界点"],
                  t(`They split the line into three intervals:`, `它们把数轴分成三个区间：`),
                  [`f'(x) = ${pLatex(d)} = ${derivativeFactored(c)}`],
                ],
                [
                  ["Test the sign in each interval", "检验每个区间上的符号"],
                  t(
                    `Take one point from each of $${open(undefined, c.c1)}$, $${open(c.c1, c.c2)}$ and $${open(c.c2, undefined)}$:\n\n${valueTable(probes, "f'(x)", (x) => pAt(d, x))}`,
                    `在 $${open(undefined, c.c1)}$、$${open(c.c1, c.c2)}$、$${open(c.c2, undefined)}$ 中各取一点：\n\n${valueTable(probes, "f'(x)", (x) => pAt(d, x))}`,
                  ),
                ],
                [
                  ["Read off the intervals", "读出区间"],
                  t(
                    `Between the critical points $f'$ is ${c.up ? "negative" : "positive"}, and outside them it is ${c.up ? "positive" : "negative"}. So $f$ is ${increasing ? "increasing" : "decreasing"} on ${right.en}.`,
                    `在两个临界点之间 $f'$ 为${c.up ? "负" : "正"}，在两侧为${c.up ? "正" : "负"}。所以 $f$ 在 ${right["zh-CN"]} 上${increasing ? "递增" : "递减"}。`,
                  ),
                ],
              ],
              t(
                `$f(${c.c1}) = ${pAt(c.p, c.c1)}$ and $f(${c.c2}) = ${pAt(c.p, c.c2)}$: across $${open(c.c1, c.c2)}$ the values ${c.up ? "drop" : "rise"}, which fits $f$ ${c.up ? "decreasing" : "increasing"} there.`,
                `$f(${c.c1}) = ${pAt(c.p, c.c1)}$，$f(${c.c2}) = ${pAt(c.p, c.c2)}$：在 $${open(c.c1, c.c2)}$ 上函数值${c.up ? "下降" : "上升"}，与 $f$ 在那里${c.up ? "递减" : "递增"}相符。`,
              ),
            ),
          ),
          [
            [
              wrong[0]!.en,
              `This is where $f$ is ${increasing ? "decreasing" : "increasing"}.`,
              `这是 $f$ ${increasing ? "递减" : "递增"}的区间。`,
            ],
            [wrong[1]!.en, `This runs across $x = ${c.c1}$, where $f'$ changes sign.`, `这个区间跨过了 $x = ${c.c1}$，$f'$ 在那里变号。`],
            [wrong[2]!.en, `This runs across $x = ${c.c2}$, where $f'$ changes sign.`, `这个区间跨过了 $x = ${c.c2}$，$f'$ 在那里变号。`],
          ],
        );
      },
    },
    {
      id: "increasing-and-decreasing-transcendental-functions",
      title: t("Increasing and decreasing transcendental functions", "超越函数的单调性"),
      explanation: t(
        "Factor $f'$ so that its sign is clear. For $f(x) = (x - 2)e^{x}$,\n\n$$f'(x) = e^{x} + (x - 2)e^{x} = (x - 1)e^{x}.$$\n\nSince $e^{x} > 0$, $f'$ has the sign of $x - 1$: $f$ decreases on $(-\\infty, 1)$ and increases on $(1, \\infty)$.\n\nCheck: $f(0) = -2$, $f(1) = -e \\approx -2.718$ and $f(2) = 0$. The value at $1$ is the lowest of the three, where the graph turns from falling to rising.\n\n> **Watch out.** Respect the domain: $x - 3\\ln x$ is only defined for $x > 0$, so its interval of decrease is $(0, 3)$, not $(-\\infty, 3)$.",
        "把 $f'$ 因式分解，使其符号一目了然。对 $f(x) = (x - 2)e^{x}$，\n\n$$f'(x) = e^{x} + (x - 2)e^{x} = (x - 1)e^{x}.$$\n\n由于 $e^{x} > 0$，$f'$ 与 $x - 1$ 同号：$f$ 在 $(-\\infty, 1)$ 上递减，在 $(1, \\infty)$ 上递增。\n\n检验：$f(0) = -2$，$f(1) = -e \\approx -2.718$，$f(2) = 0$。$1$ 处的值是三者中最小的，图像在那里由降转升。\n\n> **注意。** 注意定义域：$x - 3\\ln x$ 只在 $x > 0$ 时有定义，所以它的递减区间是 $(0, 3)$，不是 $(-\\infty, 3)$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const a = rng.int(-4, 4);
        const k = rng.int(1, 9);
        const increasing = rng.bool();
        const [f, fd, crit, lo, upFirst] =
          kind === 0
            ? [`${factor(a)}e^{x}`, `${factor(a - 1)}e^{x}`, a - 1, undefined, false]
            : kind === 1
              ? [`${factor(a)}e^{-x}`, `(${poly([-1, "x"], [a + 1, ""])})e^{-x}`, a + 1, undefined, true]
              : [poly([1, "x"], [-k, "\\ln x"]), `1 - \\frac{${k}}{x}`, k, 0, false];
        const fn = (x: number) => (kind === 0 ? (x - a) * Math.exp(x) : kind === 1 ? (x - a) * Math.exp(-x) : x - k * Math.log(x));
        const positive: Text =
          kind === 0
            ? t(
                `$e^{x} > 0$, so $f'$ has the sign of $${poly([1, "x"], [-(a - 1), ""])}$.`,
                `$e^{x} > 0$，所以 $f'$ 与 $${poly([1, "x"], [-(a - 1), ""])}$ 同号。`,
              )
            : kind === 1
              ? t(
                  `$e^{-x} > 0$, so $f'$ has the sign of $${poly([-1, "x"], [a + 1, ""])}$.`,
                  `$e^{-x} > 0$，所以 $f'$ 与 $${poly([-1, "x"], [a + 1, ""])}$ 同号。`,
                )
              : t(
                  `The domain is $x > 0$, and $f'(x) = \\frac{x - ${k}}{x}$ has the sign of $x - ${k}$ there.`,
                  `定义域是 $x > 0$，在那里 $f'(x) = \\frac{x - ${k}}{x}$ 与 $x - ${k}$ 同号。`,
                );
        const left = intervals(open(lo, crit));
        const rightI = intervals(open(crit, undefined));
        const right = increasing === upFirst ? left : rightI;
        const wrong = [
          increasing === upFirst ? rightI : left,
          intervals(open(undefined, undefined)),
          kind === 2 ? intervals(open(undefined, k)) : intervals(open(crit - 1, crit + 1)),
        ];
        const probes = kind === 2 ? [k / 2, k, 2 * k] : [crit - 1, crit, crit + 1];
        return reasoned(
          oneOf(
            rng,
            t(
              `On which interval is $f(x) = ${f}$ ${increasing ? "increasing" : "decreasing"}?`,
              `$f(x) = ${f}$ 在哪个区间上${increasing ? "递增" : "递减"}？`,
            ),
            right,
            wrong,
            walked(
              [
                [["Differentiate", "求导"], t("Differentiate and factor:", "求导并因式分解："), [`f'(x) = ${fd}`]],
                [
                  ["Find the sign of f'", "判断 f' 的符号"],
                  t(
                    `${positive.en} It is $0$ only at $x = ${crit}$, ${upFirst ? "positive" : "negative"} on ${left.en} and ${upFirst ? "negative" : "positive"} on ${rightI.en}.`,
                    `${positive["zh-CN"]}它只在 $x = ${crit}$ 处为 $0$，在 ${left["zh-CN"]} 上为${upFirst ? "正" : "负"}，在 ${rightI["zh-CN"]} 上为${upFirst ? "负" : "正"}。`,
                  ),
                ],
                [
                  ["Read off the interval", "读出区间"],
                  t(
                    `So $f$ is ${increasing ? "increasing" : "decreasing"} on ${right.en}.`,
                    `所以 $f$ 在 ${right["zh-CN"]} 上${increasing ? "递增" : "递减"}。`,
                  ),
                ],
              ],
              t(
                `Values of $f$ around $x = ${crit}$:\n\n${valueTable(probes, "f(x)", fn)}\n\nThe value at $${crit}$ is the ${upFirst ? "largest" : "smallest"} of the three: the graph ${upFirst ? "rises and then falls" : "falls and then rises"} there.`,
                `$f$ 在 $x = ${crit}$ 附近的值：\n\n${valueTable(probes, "f(x)", fn)}\n\n$${crit}$ 处的值是三者中最${upFirst ? "大" : "小"}的：图像在那里${upFirst ? "先升后降" : "先降后升"}。`,
              ),
            ),
          ),
          [
            [
              wrong[0]!.en,
              `This is where $f$ is ${increasing ? "decreasing" : "increasing"}.`,
              `这是 $f$ ${increasing ? "递减" : "递增"}的区间。`,
            ],
            [wrong[1]!.en, `This runs across $x = ${crit}$, where $f'$ changes sign.`, `这个区间跨过了 $x = ${crit}$，$f'$ 在那里变号。`],
            kind === 2
              ? [wrong[2]!.en, "$f$ is only defined for $x > 0$, because of $\\ln x$.", "因为有 $\\ln x$，$f$ 只在 $x > 0$ 时有定义。"]
              : [
                  wrong[2]!.en,
                  `This runs across $x = ${crit}$, where $f'$ changes sign.`,
                  `这个区间跨过了 $x = ${crit}$，$f'$ 在那里变号。`,
                ],
          ],
        );
      },
    },
  ],
};

/** usingTheFirstDerivativeTestToClassifyLocalExtrema classifies critical points by sign changes of f'. */
export const usingTheFirstDerivativeTestToClassifyLocalExtrema: TopicDef = {
  id: "using-the-first-derivative-test-to-classify-local-extrema",
  title: t("Using the First Derivative Test to Classify Local Extrema", "用一阶导数检验法判定局部极值"),
  summary: t(
    "Classify critical points as local maxima, local minima or neither by the sign change of the derivative.",
    "根据导数符号的变化，判定临界点是局部极大值、局部极小值还是都不是。",
  ),
  prerequisites: ["determining-intervals-on-which-a-function-is-increasing-or-decreasing"],
  encompasses: [{ topic: "determining-intervals-on-which-a-function-is-increasing-or-decreasing", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `$f(x) = x^{2} - 4x$ decreases on $(-\\infty, 2)$ and increases on $(2, \\infty)$. A graph that falls and then rises has a low point where it turns, so $f$ has a local minimum at $x = 2$, with value $f(2) = -4$.

Check: $f(1.9) = -3.99$ and $f(2.1) = -3.99$, both above $-4$.

In this lesson we classify critical points as local maxima, local minima or neither by how the sign of the derivative changes.`,
    `$f(x) = x^{2} - 4x$ 在 $(-\\infty, 2)$ 上递减，在 $(2, \\infty)$ 上递增。先降后升的图像在转向处有一个低点，所以 $f$ 在 $x = 2$ 处有局部极小值 $f(2) = -4$。

检验：$f(1.9) = -3.99$，$f(2.1) = -3.99$，都高于 $-4$。

这节课我们根据导数符号的变化方式，判定临界点是局部极大值、局部极小值，还是都不是。`,
  ),
  knowledgePoints: [
    {
      id: "local-extrema-of-polynomials",
      title: t("Local extrema of polynomials", "多项式的局部极值"),
      explanation: t(
        "At a critical point $c$: if $f'$ changes from positive to negative, $f$ has a local maximum; from negative to positive, a local minimum; if $f'$ keeps its sign, neither.\n\nFor $f(x) = x^{3} - 3x$, $f'(x) = 3(x + 1)(x - 1)$ is positive before $-1$, negative between $-1$ and $1$, and positive after $1$. So $f(-1) = 2$ is a local maximum and $f(1) = -2$ a local minimum.\n\nCheck: $f(-1.5) = 1.125$ and $f(-0.5) = 1.375$, both below $2$.\n\n> **Watch out.** The local maximum value is $f(-1) = 2$; the critical point $-1$ is only where it occurs. Read the question to see which is asked for.",
        "在临界点 $c$ 处：若 $f'$ 由正变负，$f$ 有局部极大值；由负变正，有局部极小值；若 $f'$ 不变号，则都不是。\n\n对 $f(x) = x^{3} - 3x$，$f'(x) = 3(x + 1)(x - 1)$ 在 $-1$ 之前为正，在 $-1$ 与 $1$ 之间为负，在 $1$ 之后为正。所以 $f(-1) = 2$ 是局部极大值，$f(1) = -2$ 是局部极小值。\n\n检验：$f(-1.5) = 1.125$，$f(-0.5) = 1.375$，都小于 $2$。\n\n> **注意。** 局部极大值是 $f(-1) = 2$；临界点 $-1$ 只是取得它的位置。看清题目问的是哪一个。",
      ),
      generate(rng) {
        const c = cubic(rng);
        const max = rng.bool();
        const at = max === c.up ? c.c1 : c.c2;
        const valueAsked = rng.bool();
        const answer = valueAsked ? pAt(c.p, at) : at;
        const other = max === c.up ? c.c2 : c.c1;
        const d = pDer(c.p);
        return numberProblem({
          prompt: t(
            `$f(x) = ${pLatex(c.p)}$ has one local maximum and one local minimum. Find the ${valueAsked ? `local ${max ? "maximum" : "minimum"} value` : `$x$-coordinate of the local ${max ? "maximum" : "minimum"}`}.`,
            `$f(x) = ${pLatex(c.p)}$ 有一个局部极大值和一个局部极小值。求${valueAsked ? `局部${max ? "极大值" : "极小值"}` : `局部${max ? "极大值" : "极小值"}点的 $x$ 坐标`}。`,
          ),
          answer,
          wrong: (valueAsked ? [pAt(c.p, other), at] : [other, pAt(c.p, at)]).filter((w) => w !== answer),
          solution: walked(
            [
              [
                ["Find the critical points", "求临界点"],
                t("Factor the derivative:", "把导数因式分解："),
                [`f'(x) = ${pLatex(d)} = ${derivativeFactored(c)}`],
              ],
              [
                ["Test the sign change", "检验符号变化"],
                t(
                  `Just left and right of $x = ${at}$:\n\n${valueTable([at - 0.5, at + 0.5], "f'(x)", (x) => pAt(d, x))}\n\n$f'$ changes from ${max ? "positive to negative" : "negative to positive"}, so $f$ has a local ${max ? "maximum" : "minimum"} at $x = ${at}$.`,
                  `在 $x = ${at}$ 的左右两侧：\n\n${valueTable([at - 0.5, at + 0.5], "f'(x)", (x) => pAt(d, x))}\n\n$f'$ ${max ? "由正变负" : "由负变正"}，所以 $f$ 在 $x = ${at}$ 处有局部${max ? "极大值" : "极小值"}。`,
                ),
              ],
              ...(valueAsked
                ? [
                    [
                      ["Evaluate f", "计算函数值"],
                      t(`The value asked for is $f(${at}) = ${answer}$.`, `所求的值为 $f(${at}) = ${answer}$。`),
                    ] as const,
                  ]
                : []),
            ],
            t(
              `Compare $f$ at the point with its neighbours: $f(${fmt(at - 0.5)}) = ${fmt(pAt(c.p, at - 0.5))}$, $f(${at}) = ${pAt(c.p, at)}$ and $f(${fmt(at + 0.5)}) = ${fmt(pAt(c.p, at + 0.5))}$. The middle value is the ${max ? "largest" : "smallest"}.`,
              `比较该点与两侧的函数值：$f(${fmt(at - 0.5)}) = ${fmt(pAt(c.p, at - 0.5))}$，$f(${at}) = ${pAt(c.p, at)}$，$f(${fmt(at + 0.5)}) = ${fmt(pAt(c.p, at + 0.5))}$。中间的值最${max ? "大" : "小"}。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-critical-points-from-the-derivative",
      title: t("Classifying critical points from the derivative", "由导数判定临界点"),
      explanation: t(
        "When $f'$ is given in factored form, a factor $(x - c)^{n}$ changes sign at $c$ only when $n$ is odd. For $f'(x) = (x - 1)^{2}(x + 3)$: at $x = 1$ the sign does not change, so there is no extremum; at $x = -3$, $f'$ goes from negative to positive, a local minimum.\n\nCheck: $f'(0.9) = 0.01 \\cdot 3.9 > 0$ and $f'(1.1) = 0.01 \\cdot 4.1 > 0$, the same sign; $f'(-3.1) = 16.81 \\cdot (-0.1) < 0$ and $f'(-2.9) = 15.21 \\cdot 0.1 > 0$, a change from negative to positive.\n\n> **Watch out.** $f'(1) = 0$ does not make $x = 1$ an extremum. With an even power the sign is the same on both sides, and $f$ just levels off before carrying on.",
        "当 $f'$ 以因式分解形式给出时，因式 $(x - c)^{n}$ 只有在 $n$ 为奇数时才会在 $c$ 处变号。对 $f'(x) = (x - 1)^{2}(x + 3)$：在 $x = 1$ 处不变号，没有极值；在 $x = -3$ 处 $f'$ 由负变正，是局部极小值。\n\n检验：$f'(0.9) = 0.01 \\cdot 3.9 > 0$，$f'(1.1) = 0.01 \\cdot 4.1 > 0$，符号相同；$f'(-3.1) = 16.81 \\cdot (-0.1) < 0$，$f'(-2.9) = 15.21 \\cdot 0.1 > 0$，由负变正。\n\n> **注意。** $f'(1) = 0$ 并不使 $x = 1$ 成为极值点。偶次幂在两侧符号相同，$f$ 只是暂时变平，然后继续原来的走向。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const b = rng.pick([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].filter((v) => v !== a));
        const j = rng.int(1, 3);
        const kk = rng.int(1, 2);
        const lead = rng.sign();
        const near = `${factor(a)}${j === 1 ? "" : `^{${j}}`}`;
        const rest = `${factor(b)}${kk === 1 ? "" : `^{${kk}}`}`;
        const fd = `${lead < 0 ? "-" : ""}${near}${rest}`;
        const sideSign = lead * (a > b || kk % 2 === 0 ? 1 : -1);
        const verdict = j % 2 === 0 ? 2 : sideSign > 0 ? 1 : 0;
        const options = [t("A local maximum", "局部极大值"), t("A local minimum", "局部极小值"), t("Neither", "都不是")];
        const leftSign = j % 2 === 0 ? sideSign : -sideSign;
        const [L, R] = [signOf(leftSign), signOf(sideSign)];
        const fdAt = (x: number) => lead * (x - a) ** j * (x - b) ** kk;
        const needs = (want: number): readonly [string, string] =>
          leftSign === sideSign
            ? [
                `$f'$ is ${R.en} on both sides of $${a}$, so it does not change sign there.`,
                `$f'$ 在 $${a}$ 两侧都为${R["zh-CN"]}，在那里不变号。`,
              ]
            : [
                `A local ${want === 0 ? "maximum" : "minimum"} needs $f'$ to go from ${want === 0 ? "positive to negative" : "negative to positive"}, but here it goes from ${L.en} to ${R.en}.`,
                `局部${want === 0 ? "极大值" : "极小值"}要求 $f'$ ${want === 0 ? "由正变负" : "由负变正"}，而这里是由${L["zh-CN"]}变${R["zh-CN"]}。`,
              ];
        return reasoned(
          oneOf(
            rng,
            t(
              `$f'(x) = ${fd}$. What does $f$ have at the critical point $x = ${a}$?`,
              `$f'(x) = ${fd}$。$f$ 在临界点 $x = ${a}$ 处有什么？`,
            ),
            options[verdict]!,
            options.filter((_, i) => i !== verdict),
            walked(
              [
                [
                  ["Look at the other factors", "看其他因式"],
                  t(
                    `Near $x = ${a}$, the factor $${lead < 0 ? `-${rest}` : rest}$ keeps a fixed sign: it is ${R.en} there, since its value at $${a}$ is.`,
                    `在 $x = ${a}$ 附近，因式 $${lead < 0 ? `-${rest}` : rest}$ 符号不变：它在那里为${R["zh-CN"]}，因为它在 $${a}$ 处的值就是${R["zh-CN"]}的。`,
                  ),
                ],
                [
                  [`Look at the power of ${factor(a)}`, `看 ${factor(a)} 的幂`],
                  t(
                    `$${near}$ has the power $${j}$, which is ${j % 2 === 0 ? "even, so it is positive on both sides and does not change sign" : "odd, so it changes from negative to positive"}.`,
                    `$${near}$ 的指数是 $${j}$，为${j % 2 === 0 ? "偶数，所以它在两侧都为正，不变号" : "奇数，所以它由负变正"}。`,
                  ),
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    `So $f'$ is ${L.en} just left of $${a}$ and ${R.en} just right of it: ${verdict === 2 ? "no extremum" : verdict === 0 ? "a local maximum" : "a local minimum"}.`,
                    `所以 $f'$ 在 $${a}$ 左侧为${L["zh-CN"]}，右侧为${R["zh-CN"]}：${verdict === 2 ? "没有极值" : verdict === 0 ? "局部极大值" : "局部极小值"}。`,
                  ),
                ],
              ],
              t(
                `Evaluate $f'$ on each side:\n\n${valueTable([a - 0.1, a + 0.1], "f'(x)", fdAt)}\n\nThe signs are ${L.en} and then ${R.en}, as found.`,
                `计算 $f'$ 在两侧的值：\n\n${valueTable([a - 0.1, a + 0.1], "f'(x)", fdAt)}\n\n符号依次为${L["zh-CN"]}和${R["zh-CN"]}，与上面的结论一致。`,
              ),
            ),
          ),
          [
            [options[0]!.en, ...needs(0)],
            [options[1]!.en, ...needs(1)],
            [
              options[2]!.en,
              `$f'$ does change sign at $${a}$, from ${L.en} to ${R.en}.`,
              `$f'$ 在 $${a}$ 处确实变号，由${L["zh-CN"]}变${R["zh-CN"]}。`,
            ],
          ],
        );
      },
    },
  ],
};

/** gridBest is the largest, or smallest, value of f on a grid of step 0.25 across [a, b], with where it occurs. */
function gridBest(f: (x: number) => number, a: number, b: number, max: boolean): readonly [number, number] {
  let best: readonly [number, number] = [a, f(a)];
  for (let i = 1; i <= 4 * (b - a); i++) {
    const x = a + i / 4;
    const v = f(x);
    if (max ? v > best[1] + 1e-9 : v < best[1] - 1e-9) best = [x, v];
  }
  return best;
}

/** theCandidatesTest finds global extrema on closed intervals. */
export const theCandidatesTest: TopicDef = {
  id: "the-candidates-test",
  title: t("The Candidates Test", "候选点检验法"),
  summary: t(
    "Find global extrema on a closed interval by comparing the values at critical points and endpoints.",
    "比较临界点与端点处的函数值，求闭区间上的全局最值。",
  ),
  prerequisites: ["using-the-first-derivative-test-to-classify-local-extrema", "the-extreme-value-theorem"],
  encompasses: [{ topic: "using-differentiation-to-calculate-critical-points", weight: 0.3 }],
  xp: 12,
  standards: [],
  intro: t(
    `A continuous function on a closed interval has a global maximum and a global minimum, and each is either at a critical point or at an endpoint. For $f(x) = x^{2} - 2x$ on $[0, 3]$, the only critical point is $x = 1$, and

$$f(0) = 0, \\quad f(1) = -1, \\quad f(3) = 3.$$

So the global minimum is $-1$ and the global maximum is $3$, at the endpoint.

Check: other points give values in between, such as $f(2) = 0$ and $f(2.5) = 1.25$.

In this lesson we find global extrema on closed intervals by comparing the values at all the candidates.`,
    `闭区间上的连续函数有全局最大值和全局最小值，而它们要么在临界点处，要么在端点处。对 $[0, 3]$ 上的 $f(x) = x^{2} - 2x$，唯一的临界点是 $x = 1$，而

$$f(0) = 0, \\quad f(1) = -1, \\quad f(3) = 3.$$

所以全局最小值是 $-1$，全局最大值是端点处的 $3$。

检验：其他点给出的值都在两者之间，例如 $f(2) = 0$，$f(2.5) = 1.25$。

这节课我们比较所有候选点处的值，求闭区间上的全局最值。`,
  ),
  knowledgePoints: [
    {
      id: "global-extrema-on-closed-intervals",
      title: t("Global extrema on closed intervals", "闭区间上的全局最值"),
      explanation: t(
        "To find the global extrema of a continuous $f$ on $[a, b]$:\n\n1. Find the critical points in $(a, b)$.\n2. Evaluate $f$ at them and at $a$ and $b$.\n3. The largest value is the global maximum and the smallest is the global minimum.\n\nFor $f(x) = x^{3} - 3x$ on $[0, 3]$, the critical points are $\\pm 1$, and only $1$ lies inside. $f(0) = 0$, $f(1) = -2$ and $f(3) = 18$, so the minimum is $-2$ and the maximum is $18$.\n\nCheck: $f(0.5) = -1.375$ and $f(2) = 2$ lie between $-2$ and $18$.\n\n> **Watch out.** Discard critical points outside the interval, like $-1$ here, but never leave out the endpoints: the maximum $18$ is at one.",
        "求连续函数 $f$ 在 $[a, b]$ 上的全局最值：\n\n1. 求出 $(a, b)$ 内的临界点。\n2. 计算 $f$ 在这些点及 $a$、$b$ 处的值。\n3. 最大的值为全局最大值，最小的值为全局最小值。\n\n对 $[0, 3]$ 上的 $f(x) = x^{3} - 3x$，临界点是 $\\pm 1$，只有 $1$ 在区间内。$f(0) = 0$，$f(1) = -2$，$f(3) = 18$，所以最小值是 $-2$，最大值是 $18$。\n\n检验：$f(0.5) = -1.375$，$f(2) = 2$，都在 $-2$ 与 $18$ 之间。\n\n> **注意。** 区间外的临界点要舍去，比如这里的 $-1$，但端点一定不能漏掉：最大值 $18$ 就在端点处。",
      ),
      generate(rng) {
        const c = cubic(rng, -3, 3);
        const a = c.c1 - rng.int(-1, 2);
        const b = Math.max(a + 2, c.c2 + rng.int(-1, 2));
        const max = rng.bool();
        const inside = [c.c1, c.c2].filter((x) => x > a && x < b);
        const candidates = [a, ...inside, b];
        const values = candidates.map((x) => pAt(c.p, x));
        const answer = max ? Math.max(...values) : Math.min(...values);
        const local = pAt(c.p, max === c.up ? c.c1 : c.c2);
        const [gx, gv] = gridBest((x) => pAt(c.p, x), a, b, max);
        return numberProblem({
          prompt: t(
            `Find the global ${max ? "maximum" : "minimum"} value of $f(x) = ${pLatex(c.p)}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = ${pLatex(c.p)}$ 在 $[${a}, ${b}]$ 上的全局${max ? "最大值" : "最小值"}。`,
          ),
          answer,
          wrong: [local, max ? Math.min(...values) : Math.max(...values), pAt(c.p, b)].filter((w) => w !== answer),
          solution: walked(
            [
              [
                ["Find the critical points", "求临界点"],
                t(
                  `The critical points are $${c.c1}$ and $${c.c2}$. ${inside.length === 2 ? "Both lie" : inside.length === 1 ? `Only $${inside[0]}$ lies` : "Neither lies"} inside $(${a}, ${b})$.`,
                  `临界点是 $${c.c1}$ 和 $${c.c2}$。${inside.length === 2 ? "两者都" : inside.length === 1 ? `只有 $${inside[0]}$ ` : "两者都不"}在 $(${a}, ${b})$ 内。`,
                ),
                [`f'(x) = ${pLatex(pDer(c.p))} = ${derivativeFactored(c)}`],
              ],
              [
                ["Evaluate the candidates", "计算候选点处的值"],
                t(
                  `Add the endpoints and evaluate:\n\n${table(["$x$", ...candidates.map((x) => `$${x}$`)], ["$f(x)$", ...values.map((v) => `$${v}$`)])}`,
                  `加上两个端点并计算：\n\n${table(["$x$", ...candidates.map((x) => `$${x}$`)], ["$f(x)$", ...values.map((v) => `$${v}$`)])}`,
                ),
              ],
              [
                [`Pick the ${max ? "largest" : "smallest"}`, `找出最${max ? "大" : "小"}的`],
                t(`The ${max ? "largest" : "smallest"} value is $${answer}$.`, `最${max ? "大" : "小"}的值是 $${answer}$。`),
              ],
            ],
            t(
              `Evaluate $f$ on a grid of step $0.25$ across $[${a}, ${b}]$. The ${max ? "largest" : "smallest"} value on the grid is $${fmt(gv)}$, at $x = ${fmt(gx)}$, and no grid point does better than $${answer}$.`,
              `在 $[${a}, ${b}]$ 上以步长 $0.25$ 取点计算 $f$。这些点中最${max ? "大" : "小"}的值是 $${fmt(gv)}$，在 $x = ${fmt(gx)}$ 处，没有哪个点超过 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "global-extrema-of-other-functions",
      title: t("Global extrema of other functions", "其他函数的全局最值"),
      explanation: t(
        "The method is the same for any continuous function. For $f(x) = x + \\frac{4}{x}$ on $[1, 8]$, the derivative is\n\n$$f'(x) = 1 - \\frac{4}{x^{2}},$$\n\nwhich is $0$ at $x = 2$ and at $x = -2$, outside the interval. $f(1) = 5$, $f(2) = 4$ and $f(8) = 8.5$, so the minimum is $4$ and the maximum is $8.5$.\n\nCheck: $f(1.5) \\approx 4.167$ and $f(4) = 5$ lie between $4$ and $8.5$.\n\n> **Watch out.** The critical point gives the minimum here, but the maximum is at an endpoint. Compare all the candidates' values rather than assuming the critical point is the answer.",
        "对任何连续函数方法都一样。对 $[1, 8]$ 上的 $f(x) = x + \\frac{4}{x}$，导数为\n\n$$f'(x) = 1 - \\frac{4}{x^{2}},$$\n\n它在 $x = 2$ 处为 $0$，在 $x = -2$ 处也为 $0$，但 $-2$ 在区间外。$f(1) = 5$，$f(2) = 4$，$f(8) = 8.5$，所以最小值为 $4$，最大值为 $8.5$。\n\n检验：$f(1.5) \\approx 4.167$，$f(4) = 5$，都在 $4$ 与 $8.5$ 之间。\n\n> **注意。** 这里临界点给出最小值，最大值却在端点处。要比较所有候选点的值，不能认定临界点就是答案。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const a = rng.int(1, k);
        const b = rng.int(k + 1, 4 * k);
        const max = rng.bool();
        const f = (x: number) => Q.of(x).add(Q.of(k * k, x));
        const candidates = [a, ...(k > a ? [k] : []), b];
        const values = candidates.map(f);
        const answer = values.reduce((m, v) => ((max ? v.cmp(m) > 0 : v.cmp(m) < 0) ? v : m));
        const [gx, gv] = gridBest((x) => x + (k * k) / x, a, b, max);
        return numberProblem({
          prompt: t(
            `Find the global ${max ? "maximum" : "minimum"} value of $f(x) = x + \\frac{${k * k}}{x}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = x + \\frac{${k * k}}{x}$ 在 $[${a}, ${b}]$ 上的全局${max ? "最大值" : "最小值"}。`,
          ),
          answer,
          wrong: [f(k), Q.of(2 * k), Q.of(max ? a : b), values.reduce((m, v) => ((max ? v.cmp(m) < 0 : v.cmp(m) > 0) ? v : m))].filter(
            (w) => !w.eq(answer),
          ),
          solution: walked(
            [
              [
                ["Find the critical points", "求临界点"],
                t(
                  `$f'(x) = 0$ at $x = \\pm ${k}$; ${k > a ? `only $${k}$ lies in $(${a}, ${b})$` : `neither lies inside $(${a}, ${b})$`}.`,
                  `$f'(x) = 0$ 于 $x = \\pm ${k}$；${k > a ? `只有 $${k}$ 在 $(${a}, ${b})$ 内` : `两者都不在 $(${a}, ${b})$ 内`}。`,
                ),
                [`f'(x) = 1 - \\frac{${k * k}}{x^{2}}`],
              ],
              [
                ["Evaluate the candidates", "计算候选点处的值"],
                t(
                  `With the endpoints:\n\n${table(["$x$", ...candidates.map((x) => `$${x}$`)], ["$f(x)$", ...values.map((v) => `$${v.toLatex()}$`)])}`,
                  `加上端点：\n\n${table(["$x$", ...candidates.map((x) => `$${x}$`)], ["$f(x)$", ...values.map((v) => `$${v.toLatex()}$`)])}`,
                ),
              ],
              [
                [`Pick the ${max ? "largest" : "smallest"}`, `找出最${max ? "大" : "小"}的`],
                t(
                  `The global ${max ? "maximum" : "minimum"} is $${answer.toLatex()}$.`,
                  `全局${max ? "最大值" : "最小值"}是 $${answer.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `On a grid of step $0.25$ across $[${a}, ${b}]$, the ${max ? "largest" : "smallest"} value of $f$ is about $${fmt(gv)}$, at $x = ${fmt(gx)}$, which matches $${answer.toLatex()}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$.`,
              `在 $[${a}, ${b}]$ 上以步长 $0.25$ 取点，$f$ 的最${max ? "大" : "小"}值约为 $${fmt(gv)}$，在 $x = ${fmt(gx)}$ 处，与 $${answer.toLatex()}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$ 一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** concavityOptions are the three answers to whether f is concave up or down somewhere. */
const concavityOptions = () => [
  t("Concave up", "上凹"),
  t("Concave down", "下凹"),
  t("Neither: $f$ is linear there", "都不是：$f$ 在那里是直线"),
];

/** intervalsOfConcavity reads concavity from how the derivative changes. */
export const intervalsOfConcavity: TopicDef = {
  id: "intervals-of-concavity",
  title: t("Intervals of Concavity", "凹凸区间"),
  summary: t(
    "Decide where a function is concave up or down from how its derivative changes.",
    "根据导数的变化判断函数在哪些区间上凹或凸。",
  ),
  prerequisites: ["determining-intervals-on-which-a-function-is-increasing-or-decreasing", "second-and-higher-order-derivatives"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The sign of $f'$ tells whether $f$ rises or falls; how $f'$ changes tells how the graph bends. For $f(x) = x^{3}$, $f'(x) = 3x^{2}$ decreases on $(-\\infty, 0)$ and increases on $(0, \\infty)$: the slopes get smaller and then larger, so the graph bends down like a cap and then up like a cup.

Check: on $[0, 2]$ the chord from $(0, 0)$ to $(2, 8)$ passes through $(1, 4)$, above $f(1) = 1$. A graph that lies below its chords bends up.

In this lesson we find where a function is concave up and where it is concave down from how its derivative changes.`,
    `$f'$ 的符号说明 $f$ 是上升还是下降；$f'$ 怎样变化则说明图像怎样弯曲。对 $f(x) = x^{3}$，$f'(x) = 3x^{2}$ 在 $(-\\infty, 0)$ 上递减，在 $(0, \\infty)$ 上递增：斜率先变小再变大，所以图像先像帽子一样向下弯，再像杯子一样向上弯。

检验：在 $[0, 2]$ 上，从 $(0, 0)$ 到 $(2, 8)$ 的弦经过 $(1, 4)$，高于 $f(1) = 1$。位于弦下方的图像是向上弯的。

这节课我们根据导数的变化，找出函数上凹和下凹的区间。`,
  ),
  knowledgePoints: [
    {
      id: "concavity-from-the-graph-of-the-derivative",
      figure: calculusDrawings2["intervals-of-concavity#concavity-from-the-graph-of-the-derivative"],
      title: t("Concavity from the graph of the derivative", "由导数的图像判断凹凸性"),
      explanation: t(
        "$f$ is concave up where $f'$ is increasing (the graph bends upward, like a cup) and concave down where $f'$ is decreasing (like a cap). Where $f'$ is constant, $f$ is a line and is neither. If the graph of $f'$ rises from $(0, -3)$ to $(2, 1)$, then $f'$ is increasing on $(0, 2)$ and $f$ is concave up there, even though $f'$ is negative at first.\n\nCheck: the slope of that piece of the graph of $f'$ is $\\frac{1 - (-3)}{2} = 2$, and this slope is $f''$. It is positive, so $f$ is concave up.\n\n> **Watch out.** Look at whether $f'$ rises or falls, not at whether it is above or below the axis. The sign of $f'$ says where $f$ increases; the direction of $f'$ says how it bends.",
        "$f'$ 递增的地方 $f$ 是上凹的（图像像杯子一样向上弯），$f'$ 递减的地方 $f$ 是下凹的（像帽子）。$f'$ 为常数的地方 $f$ 是直线，两者都不是。如果 $f'$ 的图像从 $(0, -3)$ 上升到 $(2, 1)$，那么 $f'$ 在 $(0, 2)$ 上递增，$f$ 在那里上凹，尽管 $f'$ 一开始是负的。\n\n检验：$f'$ 图像这一段的斜率为 $\\frac{1 - (-3)}{2} = 2$，而这个斜率就是 $f''$。它为正，所以 $f$ 上凹。\n\n> **注意。** 要看 $f'$ 是上升还是下降，而不是看它在坐标轴上方还是下方。$f'$ 的符号说明 $f$ 在哪里递增；$f'$ 的走向说明 $f$ 怎样弯曲。",
      ),
      generate(rng) {
        const ys = zigzag(rng, true);
        const i = rng.int(0, zigzagXs.length - 2);
        const [x0, x1] = [zigzagXs[i]!, zigzagXs[i + 1]!];
        const [y0, y1] = [ys[i]!, ys[i + 1]!];
        const x = x0 + 1;
        const d = y1 - y0;
        const verdict = d > 0 ? 0 : d < 0 ? 1 : 2;
        const options = concavityOptions();
        const motion = d > 0 ? t("rises", "上升") : d < 0 ? t("falls", "下降") : t("is flat", "水平");
        return reasoned(
          oneOf(
            rng,
            t(
              `The graph of $f'$, the derivative of $f$, is shown. Is $f$ concave up or concave down at $x = ${x}$?`,
              `图中是 $f$ 的导数 $f'$ 的图像。$f$ 在 $x = ${x}$ 处是上凹还是下凹？`,
            ),
            options[verdict]!,
            options.filter((_, j) => j !== verdict),
            walked(
              [
                [
                  ["Read the graph of f'", "读 f' 的图像"],
                  t(
                    `$x = ${x}$ lies in $(${x0}, ${x1})$, where the graph of $f'$ goes from $(${x0}, ${y0})$ to $(${x1}, ${y1})$: it ${motion.en}.`,
                    `$x = ${x}$ 位于 $(${x0}, ${x1})$ 内，$f'$ 的图像在那里从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$：它${motion["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    `So $f'$ is ${d > 0 ? "increasing and $f$ is concave up" : d < 0 ? "decreasing and $f$ is concave down" : "constant and $f$ is linear"} there. The sign of $f'$ itself does not matter.`,
                    `所以 $f'$ 在那里${d > 0 ? "递增，$f$ 上凹" : d < 0 ? "递减，$f$ 下凹" : "为常数，$f$ 是直线"}。$f'$ 本身的正负与此无关。`,
                  ),
                ],
              ],
              t(
                `The slope of that segment of the graph of $f'$ is $${Q.of(d, x1 - x0).toLatex()}$, and that slope is $f''(${x})$. It is ${signOf(d).en}, which gives the same answer.`,
                `$f'$ 图像这一段的斜率为 $${Q.of(d, x1 - x0).toLatex()}$，这个斜率就是 $f''(${x})$。它为${signOf(d)["zh-CN"]}，结论相同。`,
              ),
            ),
            zigzagFigure(ys, "f'"),
          ),
          [
            [
              options[0]!.en,
              `That needs $f'$ to be increasing, but on $(${x0}, ${x1})$ its graph ${motion.en}.`,
              `那要求 $f'$ 递增，但在 $(${x0}, ${x1})$ 上它的图像${motion["zh-CN"]}。`,
            ],
            [
              options[1]!.en,
              `That needs $f'$ to be decreasing, but on $(${x0}, ${x1})$ its graph ${motion.en}.`,
              `那要求 $f'$ 递减，但在 $(${x0}, ${x1})$ 上它的图像${motion["zh-CN"]}。`,
            ],
            [
              options[2]!.en,
              `$f'$ is not constant on $(${x0}, ${x1})$: its graph ${motion.en}, so $f$ is not a line there.`,
              `$f'$ 在 $(${x0}, ${x1})$ 上不是常数：它的图像${motion["zh-CN"]}，所以 $f$ 在那里不是直线。`,
            ],
          ],
        );
      },
    },
    {
      id: "concavity-from-a-sign-chart",
      title: t("Concavity from a factored second derivative", "由因式分解的二阶导数判断凹凸性"),
      explanation: t(
        "$f$ is concave up where $f''(x) > 0$ and concave down where $f''(x) < 0$. With $f''$ factored, test its sign between consecutive zeros. For $f''(x) = 2(x + 1)(x - 3)$, $f''(-2) = 10$, $f''(0) = -6$ and $f''(4) = 10$, so $f$ is concave down on $(-1, 3)$ and concave up on $(-\\infty, -1)$ and $(3, \\infty)$.\n\nCheck: far from the origin, $f''(x) \\approx 2x^{2}$, which is positive, so $f$ must be concave up on both outer intervals.\n\n> **Watch out.** Write the two outer intervals separately: one interval such as $(-\\infty, 3)$ would run across $-1$, where $f''$ changes sign.",
        "$f''(x) > 0$ 时 $f$ 上凹，$f''(x) < 0$ 时 $f$ 下凹。$f''$ 因式分解后，检验它在相邻零点之间的符号。对 $f''(x) = 2(x + 1)(x - 3)$，$f''(-2) = 10$，$f''(0) = -6$，$f''(4) = 10$，所以 $f$ 在 $(-1, 3)$ 上下凹，在 $(-\\infty, -1)$ 和 $(3, \\infty)$ 上上凹。\n\n检验：离原点很远时 $f''(x) \\approx 2x^{2}$，为正，所以 $f$ 在两侧的区间上必定上凹。\n\n> **注意。** 两侧的区间要分开写：像 $(-\\infty, 3)$ 这样的一个区间会跨过 $f''$ 变号的 $-1$。",
      ),
      generate(rng) {
        const p = rng.int(-5, 3);
        const q = rng.int(p + 1, 5);
        const k = rng.pick([1, 2, 3, 6, 12, -1, -2, -6]);
        const up = rng.bool();
        const lead = k === 1 ? "" : k === -1 ? "-" : String(k);
        const middle = intervals(open(p, q));
        const outer = intervals(open(undefined, p), open(q, undefined));
        const rightIsMiddle = up !== k > 0;
        const right = rightIsMiddle ? middle : outer;
        const wrong = [rightIsMiddle ? outer : middle, intervals(open(undefined, q)), intervals(open(p, undefined))];
        const f2 = (x: number) => k * (x - p) * (x - q);
        const probes = [p - 1, (p + q) / 2, q + 1];
        const word = up ? t("up", "上凹") : t("down", "下凹");
        return reasoned(
          oneOf(
            rng,
            t(
              `$f''(x) = ${lead}${factor(p)}${factor(q)}$. On which intervals is $f$ concave ${word.en}?`,
              `$f''(x) = ${lead}${factor(p)}${factor(q)}$。$f$ 在哪些区间上${word["zh-CN"]}？`,
            ),
            right,
            wrong,
            walked(
              [
                [
                  ["Find the zeros of f''", "求 f'' 的零点"],
                  t(
                    `$f''$ is $0$ at $x = ${p}$ and $x = ${q}$, which split the line into three intervals.`,
                    `$f''$ 在 $x = ${p}$ 和 $x = ${q}$ 处为 $0$，它们把数轴分成三个区间。`,
                  ),
                ],
                [
                  ["Test the sign in each interval", "检验每个区间上的符号"],
                  t(
                    `Take one point from each:\n\n${valueTable(probes, "f''(x)", f2)}`,
                    `在每个区间各取一点：\n\n${valueTable(probes, "f''(x)", f2)}`,
                  ),
                ],
                [
                  ["Read off the intervals", "读出区间"],
                  t(
                    `$f''$ is ${k > 0 ? "negative" : "positive"} between $${p}$ and $${q}$ and ${k > 0 ? "positive" : "negative"} outside them. So $f$ is concave ${word.en} on ${right.en}.`,
                    `$f''$ 在 $${p}$ 与 $${q}$ 之间为${k > 0 ? "负" : "正"}，在两侧为${k > 0 ? "正" : "负"}。所以 $f$ 在 ${right["zh-CN"]} 上${word["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Far from the zeros, $f''(x) \\approx ${lead}x^{2}$, which is ${k > 0 ? "positive" : "negative"}. So $f$ is concave ${k > 0 ? "up" : "down"} on the two outer intervals, as found.`,
                `离零点很远时 $f''(x) \\approx ${lead}x^{2}$，为${k > 0 ? "正" : "负"}。所以 $f$ 在两侧的区间上${k > 0 ? "上凹" : "下凹"}，与上面一致。`,
              ),
            ),
          ),
          [
            [wrong[0]!.en, `This is where $f$ is concave ${up ? "down" : "up"}.`, `这是 $f$ ${up ? "下凹" : "上凹"}的区间。`],
            [wrong[1]!.en, `This runs across $x = ${p}$, where $f''$ changes sign.`, `这个区间跨过了 $x = ${p}$，$f''$ 在那里变号。`],
            [wrong[2]!.en, `This runs across $x = ${q}$, where $f''$ changes sign.`, `这个区间跨过了 $x = ${q}$，$f''$ 在那里变号。`],
          ],
        );
      },
    },
  ],
};

/** Quartic is a quartic whose second derivative is 12m(x − p)(x − q), p < q. */
interface Quartic {
  readonly f: Poly;
  readonly p: number;
  readonly q: number;
  readonly m: number;
}

/** quartic chooses a quartic with two integer inflection points. */
function quartic(rng: Rng): Quartic {
  const p = rng.int(-3, 2);
  const q = rng.int(p + 1, 3);
  const m = rng.sign();
  return { f: [rng.int(-5, 5), rng.int(-6, 6), 6 * m * p * q, -2 * m * (p + q), m], p, q, m };
}

/** relatingConcavityToTheSecondDerivative computes second derivatives to find concavity. */
export const relatingConcavityToTheSecondDerivative: TopicDef = {
  id: "relating-concavity-to-the-second-derivative",
  title: t("Relating Concavity to the Second Derivative", "凹凸性与二阶导数"),
  summary: t(
    "Compute the second derivative and use its sign to find where a function is concave up or down.",
    "计算二阶导数，用它的符号确定函数的凹凸区间。",
  ),
  prerequisites: ["intervals-of-concavity"],
  encompasses: [{ topic: "intervals-of-concavity", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `$f$ is concave up where $f'$ increases, and $f'$ increases where its own derivative $f''$ is positive. For $f(x) = x^{3} - 3x^{2}$, $f''(x) = 6x - 6$, which is negative for $x < 1$ and positive for $x > 1$: $f$ is concave down on $(-\\infty, 1)$ and concave up on $(1, \\infty)$.

Check: on $[2, 4]$, $f(2) = -4$ and $f(4) = 16$, so the chord passes through $(3, 6)$, while $f(3) = 0$ lies below it, as on a graph that bends up.

In this lesson we compute the second derivative and use its sign to find where a function is concave up or down.`,
    `$f'$ 递增的地方 $f$ 上凹，而 $f'$ 在它自己的导数 $f''$ 为正的地方递增。对 $f(x) = x^{3} - 3x^{2}$，$f''(x) = 6x - 6$，它在 $x < 1$ 时为负，在 $x > 1$ 时为正：$f$ 在 $(-\\infty, 1)$ 上下凹，在 $(1, \\infty)$ 上上凹。

检验：在 $[2, 4]$ 上，$f(2) = -4$，$f(4) = 16$，所以弦经过 $(3, 6)$，而 $f(3) = 0$ 在弦的下方，正是向上弯的图像。

这节课我们计算二阶导数，用它的符号确定函数在哪里上凹、在哪里下凹。`,
  ),
  knowledgePoints: [
    {
      id: "concavity-of-polynomials",
      title: t("Concavity of polynomials", "多项式的凹凸性"),
      explanation: t(
        "Differentiate twice, factor $f''$, and test its sign. For $f(x) = x^{4} - 6x^{2}$,\n\n$$f''(x) = 12x^{2} - 12 = 12(x - 1)(x + 1),$$\n\nso $f$ is concave down on $(-1, 1)$ and concave up on $(-\\infty, -1)$ and $(1, \\infty)$.\n\nCheck: $f''(0) = -12 < 0$ and $f''(2) = 36 > 0$, one in each kind of interval.\n\n> **Watch out.** Concavity comes from $f''$, not $f'$. Here $f'(x) = 4x^{3} - 12x$ is positive on $(-\\sqrt{3}, 0)$, yet $f$ is concave down there.",
        "求两次导数，把 $f''$ 因式分解，再检验符号。对 $f(x) = x^{4} - 6x^{2}$，\n\n$$f''(x) = 12x^{2} - 12 = 12(x - 1)(x + 1),$$\n\n所以 $f$ 在 $(-1, 1)$ 上下凹，在 $(-\\infty, -1)$ 和 $(1, \\infty)$ 上上凹。\n\n检验：$f''(0) = -12 < 0$，$f''(2) = 36 > 0$，两类区间中各取一点。\n\n> **注意。** 凹凸性由 $f''$ 决定，而不是 $f'$。这里 $f'(x) = 4x^{3} - 12x$ 在 $(-\\sqrt{3}, 0)$ 上为正，但 $f$ 在那里下凹。",
      ),
      generate(rng) {
        const Qd = quartic(rng);
        const up = rng.bool();
        const middle = intervals(open(Qd.p, Qd.q));
        const outer = intervals(open(undefined, Qd.p), open(Qd.q, undefined));
        const rightIsMiddle = up !== Qd.m > 0;
        const right = rightIsMiddle ? middle : outer;
        const wrong = [rightIsMiddle ? outer : middle, intervals(open(undefined, Qd.q)), intervals(open(Qd.p, undefined))];
        const f2 = pDer(pDer(Qd.f));
        const probes = [Qd.p - 1, (Qd.p + Qd.q) / 2, Qd.q + 1];
        const word = up ? t("up", "上凹") : t("down", "下凹");
        return reasoned(
          oneOf(
            rng,
            t(
              `On which intervals is $f(x) = ${pLatex(Qd.f)}$ concave ${word.en}?`,
              `$f(x) = ${pLatex(Qd.f)}$ 在哪些区间上${word["zh-CN"]}？`,
            ),
            right,
            wrong,
            walked(
              [
                [
                  ["Differentiate twice and factor", "求两次导数并因式分解"],
                  t("The second derivative is", "二阶导数为"),
                  [`f''(x) = ${pLatex(f2)} = ${12 * Qd.m}${factor(Qd.p)}${factor(Qd.q)}`],
                ],
                [
                  ["Test the sign in each interval", "检验每个区间上的符号"],
                  t(
                    `Its zeros $${Qd.p}$ and $${Qd.q}$ split the line into three intervals:\n\n${valueTable(probes, "f''(x)", (x) => pAt(f2, x))}`,
                    `它的零点 $${Qd.p}$ 和 $${Qd.q}$ 把数轴分成三个区间：\n\n${valueTable(probes, "f''(x)", (x) => pAt(f2, x))}`,
                  ),
                ],
                [
                  ["Read off the intervals", "读出区间"],
                  t(`So $f$ is concave ${word.en} on ${right.en}.`, `所以 $f$ 在 ${right["zh-CN"]} 上${word["zh-CN"]}。`),
                ],
              ],
              t(
                `Far from the zeros, $f''(x) \\approx ${12 * Qd.m}x^{2}$, which is ${Qd.m > 0 ? "positive" : "negative"}, so $f$ is concave ${Qd.m > 0 ? "up" : "down"} on the two outer intervals, as found.`,
                `离零点很远时 $f''(x) \\approx ${12 * Qd.m}x^{2}$，为${Qd.m > 0 ? "正" : "负"}，所以 $f$ 在两侧的区间上${Qd.m > 0 ? "上凹" : "下凹"}，与上面一致。`,
              ),
            ),
          ),
          [
            [wrong[0]!.en, `This is where $f$ is concave ${up ? "down" : "up"}.`, `这是 $f$ ${up ? "下凹" : "上凹"}的区间。`],
            [wrong[1]!.en, `This runs across $x = ${Qd.p}$, where $f''$ changes sign.`, `这个区间跨过了 $x = ${Qd.p}$，$f''$ 在那里变号。`],
            [wrong[2]!.en, `This runs across $x = ${Qd.q}$, where $f''$ changes sign.`, `这个区间跨过了 $x = ${Qd.q}$，$f''$ 在那里变号。`],
          ],
        );
      },
    },
    {
      id: "concavity-at-a-point",
      title: t("Concavity at a point", "某点处的凹凸性"),
      explanation: t(
        "To decide concavity at one point, evaluate $f''$ there: positive means concave up, negative means concave down. For $f(x) = x^{3} + e^{x}$ at $x = -1$, $f''(x) = 6x + e^{x}$ gives $f''(-1) = -6 + e^{-1} \\approx -5.632$, so $f$ is concave down there.\n\nCheck: the second difference $\\frac{f(-0.99) - 2f(-1) + f(-1.01)}{0.01^{2}}$ is also about $-5.632$, since it approximates $f''(-1)$.\n\n> **Watch out.** If $f''(c) = 0$, the second derivative alone does not decide the concavity at $c$; do not guess either way.",
        "判断某一点处的凹凸性时，计算该点的 $f''$：为正则上凹，为负则下凹。对 $f(x) = x^{3} + e^{x}$ 在 $x = -1$ 处，$f''(x) = 6x + e^{x}$，$f''(-1) = -6 + e^{-1} \\approx -5.632$，所以 $f$ 在那里下凹。\n\n检验：二阶差商 $\\frac{f(-0.99) - 2f(-1) + f(-1.01)}{0.01^{2}}$ 也约为 $-5.632$，因为它近似于 $f''(-1)$。\n\n> **注意。** 若 $f''(c) = 0$，仅凭二阶导数无法判断 $c$ 处的凹凸性；不要随便猜。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const x0 = rng.int(-3, 3);
        let f: string;
        let f2: string;
        let fn: (x: number) => number;
        let value: number;
        if (kind === 0) {
          const p: Poly = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-4, 4), rng.int(-3, 3), rng.nonZero(-2, 2)];
          f = pLatex(p);
          f2 = pLatex(pDer(pDer(p)));
          fn = (x) => pAt(p, x);
          value = pAt(pDer(pDer(p)), x0);
        } else if (kind === 1) {
          const k = rng.nonZero(-3, 3);
          const c = rng.int(1, 9);
          f = `${poly([k, "x^{3}"])} + ${c}e^{x}`;
          f2 = `${poly([6 * k, "x"])} + ${c}e^{x}`;
          fn = (x) => k * x ** 3 + c * Math.exp(x);
          value = 6 * k * x0 + c * Math.exp(x0);
        } else {
          const k = rng.int(1, 9);
          f = `${k}\\sin x`;
          f2 = `-${k}\\sin x`;
          fn = (x) => k * Math.sin(x);
          value = -k * Math.sin(x0);
        }
        if (Math.abs(value) < 1e-9) value = 0;
        const shown = Number.isInteger(value) ? `= ${value}` : `\\approx ${fmt(value)}`;
        const verdict = value > 0 ? 0 : value < 0 ? 1 : 2;
        const options = [
          t("Concave up", "上凹"),
          t("Concave down", "下凹"),
          t("Cannot tell from $f''$: it is $0$ there", "无法由 $f''$ 判断：该处 $f''$ 为 $0$"),
        ];
        const h = 0.01;
        const second = (fn(x0 + h) - 2 * fn(x0) + fn(x0 - h)) / (h * h);
        return reasoned(
          oneOf(
            rng,
            t(`Is $f(x) = ${f}$ concave up or concave down at $x = ${x0}$?`, `$f(x) = ${f}$ 在 $x = ${x0}$ 处是上凹还是下凹？`),
            options[verdict]!,
            options.filter((_, i) => i !== verdict),
            walked(
              [
                [["Differentiate twice", "求两次导数"], t("The second derivative is", "二阶导数为"), [`f''(x) = ${f2}`]],
                [
                  [`Evaluate at x = ${x0}`, `代入 x = ${x0}`],
                  t(
                    `$f''(${x0}) ${shown}$, so ${verdict === 0 ? "$f$ is concave up there" : verdict === 1 ? "$f$ is concave down there" : "the second derivative alone does not decide"}.`,
                    `$f''(${x0}) ${shown}$，所以${verdict === 0 ? " $f$ 在该处上凹" : verdict === 1 ? " $f$ 在该处下凹" : "仅凭二阶导数无法判断"}。`,
                  ),
                ],
              ],
              t(
                `The second difference with $h = 0.01$, which approximates $f''(${x0})$, is about $${fmt(second)}$${verdict === 2 ? ", which is also $0$ to three decimal places." : `, ${signOf(value).en} as well.`}`,
                `取 $h = 0.01$ 的二阶差商近似于 $f''(${x0})$，约为 $${fmt(second)}$${verdict === 2 ? "，保留三位小数也是 $0$。" : `，同样为${signOf(value)["zh-CN"]}。`}`,
              ),
            ),
          ),
          [
            [
              options[0]!.en,
              `That needs $f''(${x0}) > 0$, but $f''(${x0}) ${shown}$.`,
              `那要求 $f''(${x0}) > 0$，但 $f''(${x0}) ${shown}$。`,
            ],
            [
              options[1]!.en,
              `That needs $f''(${x0}) < 0$, but $f''(${x0}) ${shown}$.`,
              `那要求 $f''(${x0}) < 0$，但 $f''(${x0}) ${shown}$。`,
            ],
            [
              options[2]!.en,
              `$f''(${x0})$ is not $0$: it is ${signOf(value).en}, and its sign decides.`,
              `$f''(${x0})$ 不为 $0$：它为${signOf(value)["zh-CN"]}，由它的符号即可判断。`,
            ],
          ],
        );
      },
    },
  ],
};

/** pointsOfInflection finds points of inflection. */
export const pointsOfInflection: TopicDef = {
  id: "points-of-inflection",
  title: t("Points of Inflection", "拐点"),
  summary: t(
    "Find points of inflection, where concavity changes, and recognize when f'' = 0 is not one.",
    "求凹凸性发生改变的拐点，并识别 f'' = 0 但不是拐点的情形。",
  ),
  prerequisites: ["relating-concavity-to-the-second-derivative"],
  encompasses: [{ topic: "relating-concavity-to-the-second-derivative", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `$f(x) = x^{3} - 3x^{2}$ is concave down on $(-\\infty, 1)$ and concave up on $(1, \\infty)$. At $(1, -2)$ the graph switches from bending down to bending up; such a point is a point of inflection.

Check: there the slopes stop falling and start rising: $f'(0.9) = -2.97$, $f'(1) = -3$ and $f'(1.1) = -2.97$, so the slope is least at $x = 1$.

In this lesson we find points of inflection, where the concavity changes, and see when $f'' = 0$ is not one.`,
    `$f(x) = x^{3} - 3x^{2}$ 在 $(-\\infty, 1)$ 上下凹，在 $(1, \\infty)$ 上上凹。在 $(1, -2)$ 处图像由向下弯变为向上弯；这样的点叫作拐点。

检验：在那里斜率停止下降、开始上升：$f'(0.9) = -2.97$，$f'(1) = -3$，$f'(1.1) = -2.97$，所以斜率在 $x = 1$ 处最小。

这节课我们求凹凸性发生改变的拐点，并看看 $f'' = 0$ 在什么情况下不是拐点。`,
  ),
  knowledgePoints: [
    {
      id: "finding-points-of-inflection",
      figure: calculusDrawings2["points-of-inflection#finding-points-of-inflection"],
      title: t("Finding points of inflection", "求拐点"),
      explanation: t(
        "A point of inflection is a point on the graph where the concavity changes. Candidates are where $f''(x) = 0$ or $f''$ does not exist; keep those where $f''$ changes sign. For $f(x) = x^{3} - 6x^{2} + 5$, $f''(x) = 6x - 12$ is $0$ at $x = 2$ and changes sign there, so the point of inflection is $(2, f(2)) = (2, -11)$.\n\nCheck: $f''(1) = -6$ and $f''(3) = 6$, opposite signs on the two sides of $2$.\n\n> **Watch out.** A point of inflection is a point of the graph. When the question asks for the point, give both coordinates, $(2, -11)$, not just $x = 2$.",
        "拐点是图像上凹凸性发生改变的点。候选点是 $f''(x) = 0$ 或 $f''$ 不存在的点；保留 $f''$ 在该处变号的点。对 $f(x) = x^{3} - 6x^{2} + 5$，$f''(x) = 6x - 12$ 在 $x = 2$ 处为 $0$ 并在那里变号，所以拐点是 $(2, f(2)) = (2, -11)$。\n\n检验：$f''(1) = -6$，$f''(3) = 6$，在 $2$ 的两侧符号相反。\n\n> **注意。** 拐点是图像上的点。题目问的是点时，要给出两个坐标 $(2, -11)$，而不只是 $x = 2$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const Qd = quartic(rng);
          const f2 = pDer(pDer(Qd.f));
          const probes = [Qd.p - 0.5, (Qd.p + Qd.q) / 2, Qd.q + 0.5];
          return solutionsProblem({
            prompt: t(
              `Find the $x$-coordinates of the points of inflection of $f(x) = ${pLatex(Qd.f)}$.`,
              `求 $f(x) = ${pLatex(Qd.f)}$ 的拐点的 $x$ 坐标。`,
            ),
            values: [String(Qd.p), String(Qd.q)],
            wrong: [[String(-Qd.p), String(-Qd.q)], [String(Qd.p)]],
            solution: walked(
              [
                [
                  ["Differentiate twice and factor", "求两次导数并因式分解"],
                  t(`The candidates are the zeros of`, `候选点是下式的零点：`),
                  [`f''(x) = ${pLatex(f2)} = ${12 * Qd.m}${factor(Qd.p)}${factor(Qd.q)}`],
                ],
                [
                  ["Check the sign changes", "检验是否变号"],
                  t(
                    `$f''$ has the sign shown on each side of the zeros:\n\n${valueTable(probes, "f''(x)", (x) => pAt(f2, x))}\n\nIt changes sign at both zeros, so the points of inflection are at $x = ${Qd.p}$ and $x = ${Qd.q}$.`,
                    `$f''$ 在零点两侧的符号如下：\n\n${valueTable(probes, "f''(x)", (x) => pAt(f2, x))}\n\n它在两个零点处都变号，所以拐点在 $x = ${Qd.p}$ 和 $x = ${Qd.q}$ 处。`,
                  ),
                ],
              ],
              t(
                `Put each into the expanded form of $f''$:${steps(`f''(${Qd.p}) = ${atRoot(f2, Qd.p)}`, `f''(${Qd.q}) = ${atRoot(f2, Qd.q)}`)}Both are $0$, as they should be.`,
                `把它们分别代入 $f''$ 的展开式：${steps(`f''(${Qd.p}) = ${atRoot(f2, Qd.p)}`, `f''(${Qd.q}) = ${atRoot(f2, Qd.q)}`)}两者都是 $0$，正应如此。`,
              ),
            ),
          });
        }
        const c = cubic(rng);
        const x = Q.of(c.c1 + c.c2, 2);
        const xn = x.toNumber();
        const f2 = pDer(pDer(c.p));
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points of inflection of $f(x) = ${pLatex(c.p)}$.`,
            `求 $f(x) = ${pLatex(c.p)}$ 的拐点的 $x$ 坐标。`,
          ),
          values: [x.toLatex()],
          wrong: [[String(c.c1), String(c.c2)], [x.neg().toLatex()]],
          solution: walked(
            [
              [
                ["Differentiate twice", "求两次导数"],
                t("The second derivative is linear:", "二阶导数是一次函数："),
                [`f''(x) = ${pLatex(f2)}`],
              ],
              [
                ["Solve f''(x) = 0", "解 f''(x) = 0"],
                t(
                  `It is $0$ at $x = ${x.toLatex()}$, and a linear function with nonzero slope changes sign at its zero. So the only point of inflection is at $x = ${x.toLatex()}$.`,
                  `它在 $x = ${x.toLatex()}$ 处为 $0$，而斜率不为零的一次函数在零点处变号。所以唯一的拐点在 $x = ${x.toLatex()}$ 处。`,
                ),
              ],
            ],
            t(
              `Evaluate $f''$ on each side:\n\n${valueTable([xn - 0.5, xn + 0.5], "f''(x)", (v) => pAt(f2, v))}\n\nThe signs are opposite, so the concavity does change there.`,
              `计算 $f''$ 在两侧的值：\n\n${valueTable([xn - 0.5, xn + 0.5], "f''(x)", (v) => pAt(f2, v))}\n\n符号相反，所以凹凸性确实在那里改变。`,
            ),
          ),
        });
      },
    },
    {
      id: "when-a-zero-second-derivative-is-not-an-inflection-point",
      title: t("When a zero second derivative is not an inflection point", "二阶导数为零却不是拐点的情形"),
      explanation: t(
        "$f''(c) = 0$ does not guarantee an inflection point. For $f(x) = x^{4}$, $f''(x) = 12x^{2}$ is $0$ at $x = 0$ but positive on both sides, so $f$ is concave up throughout. Conversely, $f(x) = \\sqrt[3]{x}$ has an inflection point at $0$ although $f''(0)$ does not exist.\n\nCheck: $f''(-0.5) = 3$ and $f''(0.5) = 3$ for $x^{4}$, the same sign on both sides of $0$.\n\n> **Watch out.** Decide by the sign change of $f''$, not by $f''(c) = 0$. For a power $(x - c)^{n}$, the concavity changes at $c$ only when $n - 2$ is odd.",
        "$f''(c) = 0$ 并不保证是拐点。对 $f(x) = x^{4}$，$f''(x) = 12x^{2}$ 在 $x = 0$ 处为 $0$，但两侧都为正，所以 $f$ 处处上凹。反过来，$f(x) = \\sqrt[3]{x}$ 在 $0$ 处有拐点，尽管 $f''(0)$ 不存在。\n\n检验：对 $x^{4}$，$f''(-0.5) = 3$，$f''(0.5) = 3$，在 $0$ 的两侧同号。\n\n> **注意。** 要看 $f''$ 是否变号，而不是看 $f''(c) = 0$。对幂 $(x - c)^{n}$，只有当 $n - 2$ 为奇数时凹凸性才在 $c$ 处改变。",
      ),
      generate(rng) {
        const c = rng.int(-5, 5);
        const d = rng.int(-9, 9);
        const n = rng.int(2, 7);
        const root = n === 2;
        const k = rng.nonZero(-3, 3);
        const coef = k === 1 ? "" : k === -1 ? "-" : String(k);
        const inner = poly([1, "x"], [-c, ""]);
        const f = root ? sumLatex2(`${coef}\\sqrt[3]{${inner}}`, d) : sumLatex2(`${coef}${factor(c)}^{${n}}`, d);
        const yes = root || n % 2 === 1;
        const f1 = root ? `${Q.of(k, 3).toLatex()}(${inner})^{-\\frac{2}{3}}` : `${k * n}${factor(c)}${n - 1 === 1 ? "" : `^{${n - 1}}`}`;
        const f2 = root
          ? `${Q.of(-2 * k, 9).toLatex()}(${inner})^{-\\frac{5}{3}}`
          : `${k * n * (n - 1)}${factor(c)}${n - 2 === 1 ? "" : `^{${n - 2}}`}`;
        const f2At = (x: number) =>
          root ? ((-2 * k) / 9) * Math.sign(x - c) * Math.abs(x - c) ** (-5 / 3) : k * n * (n - 1) * (x - c) ** (n - 2);
        const options = [t("Yes", "是"), t("No", "否")];
        return reasoned(
          oneOf(
            rng,
            t(`Does $f(x) = ${f}$ have a point of inflection at $x = ${c}$?`, `$f(x) = ${f}$ 在 $x = ${c}$ 处有拐点吗？`),
            options[yes ? 0 : 1]!,
            [options[yes ? 1 : 0]!],
            walked(
              [
                [["Differentiate twice", "求两次导数"], t("By the power rule:", "由幂法则："), [`f'(x) = ${f1}`, `f''(x) = ${f2}`]],
                [
                  ["Look for a sign change", "看是否变号"],
                  t(
                    `${root ? `$f''$ does not exist at $x = ${c}$.` : `$f''(${c}) = 0$.`} ${yes ? `${root ? `$(${inner})^{-\\frac{5}{3}}$ has the sign of $${inner}$` : `The power $${n - 2}$ is odd`}, so $f''$ changes sign at $x = ${c}$ and the concavity changes: yes.` : `The power $${n - 2}$ is even, so $f''$ has the same sign on both sides and the concavity does not change: no.`}`,
                    `${root ? `$f''$ 在 $x = ${c}$ 处不存在。` : `$f''(${c}) = 0$。`}${yes ? `${root ? `$(${inner})^{-\\frac{5}{3}}$ 与 $${inner}$ 同号` : `指数 $${n - 2}$ 为奇数`}，所以 $f''$ 在 $x = ${c}$ 处变号，凹凸性改变：是。` : `指数 $${n - 2}$ 为偶数，所以 $f''$ 在两侧同号，凹凸性不变：否。`}`,
                  ),
                ],
              ],
              t(
                `Evaluate $f''$ on each side:\n\n${valueTable([c - 0.5, c + 0.5], "f''(x)", f2At)}\n\nThe signs are ${yes ? "opposite" : "the same"}, as found.`,
                `计算 $f''$ 在两侧的值：\n\n${valueTable([c - 0.5, c + 0.5], "f''(x)", f2At)}\n\n符号${yes ? "相反" : "相同"}，与上面的结论一致。`,
              ),
            ),
          ),
          yes
            ? [
                [
                  "No",
                  `$f''$ changes sign at $x = ${c}$, so the concavity does change there.`,
                  `$f''$ 在 $x = ${c}$ 处变号，所以凹凸性确实在那里改变。`,
                ],
              ]
            : [
                [
                  "Yes",
                  `$f''(${c}) = 0$ is not enough: $f''$ has the same sign on both sides, so the concavity does not change.`,
                  `仅有 $f''(${c}) = 0$ 不够：$f''$ 在两侧同号，凹凸性没有改变。`,
                ],
              ],
        );
      },
    },
  ],
};

/** sumLatex2 writes a term plus a constant. */
const sumLatex2 = (term: string, d: number) => (d === 0 ? term : `${term} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`);

/** theSecondDerivativeTest classifies critical points with the second derivative. */
export const theSecondDerivativeTest: TopicDef = {
  id: "the-second-derivative-test",
  title: t("The Second Derivative Test", "二阶导数检验法"),
  summary: t(
    "Classify critical points with the sign of the second derivative, and recognize when the test is inconclusive.",
    "用二阶导数的符号判定临界点，并识别检验法失效的情形。",
  ),
  prerequisites: ["points-of-inflection", "using-the-first-derivative-test-to-classify-local-extrema"],
  encompasses: [{ topic: "relating-concavity-to-the-second-derivative", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `At a critical point the tangent is horizontal. If the graph bends up there, the point is a low point; if it bends down, a high point. For $f(x) = x^{3} - 3x$, the critical points are $\\pm 1$ and $f''(x) = 6x$: $f''(1) = 6 > 0$, so $x = 1$ gives a local minimum, and $f''(-1) = -6 < 0$, so $x = -1$ gives a local maximum.

Check: by the first derivative test, $f'(0.9) = -0.57$ and $f'(1.1) = 0.63$, a change from negative to positive at $x = 1$: a local minimum.

In this lesson we classify critical points with the sign of the second derivative, and see when this test is inconclusive.`,
    `在临界点处切线是水平的。如果图像在那里向上弯，该点就是低点；如果向下弯，就是高点。对 $f(x) = x^{3} - 3x$，临界点是 $\\pm 1$，$f''(x) = 6x$：$f''(1) = 6 > 0$，所以 $x = 1$ 处为局部极小值；$f''(-1) = -6 < 0$，所以 $x = -1$ 处为局部极大值。

检验：用一阶导数检验法，$f'(0.9) = -0.57$，$f'(1.1) = 0.63$，在 $x = 1$ 处由负变正：局部极小值。

这节课我们用二阶导数的符号判定临界点，并看看这种检验法在什么情况下失效。`,
  ),
  knowledgePoints: [
    {
      id: "classifying-with-the-second-derivative",
      figure: calculusDrawings2["the-second-derivative-test#classifying-with-the-second-derivative"],
      title: t("Classifying with the second derivative", "用二阶导数判定"),
      explanation: t(
        "If $f'(c) = 0$ and $f''(c) < 0$, the graph is concave down at $c$, so $f$ has a local maximum there; if $f''(c) > 0$, a local minimum. If $f''(c) = 0$ the test is inconclusive, and the first derivative test must be used instead. For $f(x) = x^{3} - 12x$, $f'(2) = 0$ and $f''(2) = 12 > 0$: a local minimum at $x = 2$.\n\nCheck: $f'(1.9) = -1.17$ and $f'(2.1) = 1.23$, from negative to positive, as the first derivative test requires for a minimum.\n\n> **Watch out.** Inconclusive does not mean there is no extremum: $x^{4}$ has $f''(0) = 0$ and still has a minimum at $0$, while $x^{3}$ has $f''(0) = 0$ and none.",
        "若 $f'(c) = 0$ 且 $f''(c) < 0$，图像在 $c$ 处下凹，$f$ 在该处有局部极大值；若 $f''(c) > 0$，有局部极小值。若 $f''(c) = 0$，检验法失效，需改用一阶导数检验法。对 $f(x) = x^{3} - 12x$，$f'(2) = 0$，$f''(2) = 12 > 0$：$x = 2$ 处为局部极小值。\n\n检验：$f'(1.9) = -1.17$，$f'(2.1) = 1.23$，由负变正，正是一阶导数检验法中极小值的情形。\n\n> **注意。** 失效并不意味着没有极值：$x^{4}$ 有 $f''(0) = 0$，在 $0$ 处仍有极小值；而 $x^{3}$ 也有 $f''(0) = 0$，却没有极值。",
      ),
      generate(rng) {
        const options = [
          t("A local maximum", "局部极大值"),
          t("A local minimum", "局部极小值"),
          t("The test is inconclusive", "检验法失效"),
        ];
        if (rng.int(0, 3) === 0) {
          const c = rng.int(-4, 4);
          const n = rng.int(3, 5);
          const k = rng.nonZero(-2, 2);
          const coef = k === 1 ? "" : k === -1 ? "-" : String(k);
          const f = sumLatex2(`${coef}${factor(c)}^{${n}}`, rng.int(-5, 5));
          const fdAt = (x: number) => k * n * (x - c) ** (n - 1);
          const [L, R] = [signOf(fdAt(c - 0.5)), signOf(fdAt(c + 0.5))];
          const truth =
            n % 2 === 1
              ? t("$f'$ keeps its sign, so there is in fact no extremum", "$f'$ 不变号，所以实际上没有极值")
              : k > 0
                ? t("$f'$ goes from negative to positive, so there is in fact a local minimum", "$f'$ 由负变正，所以实际上有局部极小值")
                : t("$f'$ goes from positive to negative, so there is in fact a local maximum", "$f'$ 由正变负，所以实际上有局部极大值");
          return reasoned(
            oneOf(
              rng,
              t(
                `$x = ${c}$ is a critical point of $f(x) = ${f}$. What does the second derivative test say about it?`,
                `$x = ${c}$ 是 $f(x) = ${f}$ 的临界点。二阶导数检验法对它有什么结论？`,
              ),
              options[2]!,
              [options[0]!, options[1]!],
              walked(
                [
                  [
                    ["Differentiate twice", "求两次导数"],
                    t("By the power rule:", "由幂法则："),
                    [
                      `f'(x) = ${k * n}${factor(c)}^{${n - 1}}`,
                      `f''(x) = ${k * n * (n - 1)}${factor(c)}${n - 2 === 1 ? "" : `^{${n - 2}}`}`,
                    ],
                  ],
                  [
                    [`Evaluate at x = ${c}`, `代入 x = ${c}`],
                    t(`$f''(${c}) = 0$, so the second derivative test is inconclusive.`, `$f''(${c}) = 0$，所以二阶导数检验法失效。`),
                  ],
                ],
                t(
                  `The first derivative test settles what happens: $f'(${fmt(c - 0.5)})$ is ${L.en} and $f'(${fmt(c + 0.5)})$ is ${R.en}, so ${truth.en}. The second derivative test could not have told these cases apart.`,
                  `一阶导数检验法可以说明实际情况：$f'(${fmt(c - 0.5)})$ 为${L["zh-CN"]}，$f'(${fmt(c + 0.5)})$ 为${R["zh-CN"]}，${truth["zh-CN"]}。二阶导数检验法无法区分这些情形。`,
                ),
              ),
            ),
            [
              [options[0]!.en, `That needs $f''(${c}) < 0$, but $f''(${c}) = 0$.`, `那要求 $f''(${c}) < 0$，但 $f''(${c}) = 0$。`],
              [options[1]!.en, `That needs $f''(${c}) > 0$, but $f''(${c}) = 0$.`, `那要求 $f''(${c}) > 0$，但 $f''(${c}) = 0$。`],
            ],
          );
        }
        const c = cubic(rng);
        const at = rng.bool() ? c.c1 : c.c2;
        const d1 = pDer(c.p);
        const d2 = pDer(d1);
        const f2 = pAt(d2, at);
        const verdict = f2 < 0 ? 0 : 1;
        return reasoned(
          oneOf(
            rng,
            t(
              `$x = ${at}$ is a critical point of $f(x) = ${pLatex(c.p)}$. Use the second derivative test to classify it.`,
              `$x = ${at}$ 是 $f(x) = ${pLatex(c.p)}$ 的临界点。用二阶导数检验法判定它。`,
            ),
            options[verdict]!,
            options.filter((_, i) => i !== verdict),
            walked(
              [
                [
                  ["Differentiate twice", "求两次导数"],
                  t("The derivatives are", "导数为"),
                  [`f'(x) = ${pLatex(d1)}`, `f''(x) = ${pLatex(d2)}`],
                ],
                [
                  [`Evaluate f'' at x = ${at}`, `计算 f''(${at})`],
                  t(
                    `$f''(${at}) = ${f2}$, which is ${f2 < 0 ? "negative: $f$ is concave down there, a local maximum" : "positive: $f$ is concave up there, a local minimum"}.`,
                    `$f''(${at}) = ${f2}$，为${f2 < 0 ? "负：$f$ 在那里下凹，是局部极大值" : "正：$f$ 在那里上凹，是局部极小值"}。`,
                  ),
                ],
              ],
              t(
                `By the first derivative test:\n\n${valueTable([at - 0.5, at + 0.5], "f'(x)", (x) => pAt(d1, x))}\n\n$f'$ goes from ${f2 < 0 ? "positive to negative" : "negative to positive"}, which also gives a local ${f2 < 0 ? "maximum" : "minimum"}.`,
                `用一阶导数检验法：\n\n${valueTable([at - 0.5, at + 0.5], "f'(x)", (x) => pAt(d1, x))}\n\n$f'$ ${f2 < 0 ? "由正变负" : "由负变正"}，同样得到局部${f2 < 0 ? "极大值" : "极小值"}。`,
              ),
            ),
          ),
          [
            [
              options[0]!.en,
              `That needs $f''(${at}) < 0$, but $f''(${at}) = ${f2}$.`,
              `那要求 $f''(${at}) < 0$，但 $f''(${at}) = ${f2}$。`,
            ],
            [
              options[1]!.en,
              `That needs $f''(${at}) > 0$, but $f''(${at}) = ${f2}$.`,
              `那要求 $f''(${at}) > 0$，但 $f''(${at}) = ${f2}$。`,
            ],
            [
              options[2]!.en,
              `The test is inconclusive only when $f''(${at}) = 0$; here it is $${f2}$.`,
              `只有 $f''(${at}) = 0$ 时检验法才失效；这里它等于 $${f2}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "local-extreme-values-with-the-second-derivative-test",
      title: t("Local extreme values with the second derivative test", "用二阶导数检验法求局部极值"),
      explanation: t(
        "Find the critical points, classify each with the sign of $f''$, and evaluate $f$ at the one asked for. For $f(x) = x^{3} - 12x$: $f'(x) = 3x^{2} - 12 = 0$ at $x = \\pm 2$; $f''(x) = 6x$ gives $f''(2) = 12 > 0$, so the local minimum value is $f(2) = -16$.\n\nCheck: $f(1.5) = -14.625$ and $f(2.5) = -14.375$, both above $-16$.\n\n> **Watch out.** The answer is the value $f(2) = -16$, not the location $x = 2$, and not $f''(2)$.",
        "求出临界点，用 $f''$ 的符号判定每一个，再计算所求那一点处的函数值。对 $f(x) = x^{3} - 12x$：$f'(x) = 3x^{2} - 12 = 0$ 于 $x = \\pm 2$；$f''(x) = 6x$，$f''(2) = 12 > 0$，所以局部极小值为 $f(2) = -16$。\n\n检验：$f(1.5) = -14.625$，$f(2.5) = -14.375$，都高于 $-16$。\n\n> **注意。** 答案是函数值 $f(2) = -16$，不是位置 $x = 2$，也不是 $f''(2)$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const d = rng.int(-20, 20);
        const m = rng.sign();
        const p: Poly = [d, -3 * m * k * k, 0, m];
        const max = rng.bool();
        const at = max === m > 0 ? -k : k;
        const answer = pAt(p, at);
        const d1 = pDer(p);
        const d2 = pDer(d1);
        return numberProblem({
          prompt: t(
            `Find the local ${max ? "maximum" : "minimum"} value of $f(x) = ${pLatex(p)}$.`,
            `求 $f(x) = ${pLatex(p)}$ 的局部${max ? "极大值" : "极小值"}。`,
          ),
          answer,
          wrong: [pAt(p, -at), at, d].filter((w) => w !== answer),
          solution: walked(
            [
              [
                ["Find the critical points", "求临界点"],
                t(`Set $f'(x) = 0$:`, `令 $f'(x) = 0$：`),
                [`f'(x) = ${pLatex(d1)} = ${3 * m}(x - ${k})(x + ${k})`],
              ],
              [
                ["Classify with f''", "用 f'' 判定"],
                t(
                  `The critical points are $x = \\pm ${k}$, and $f''(x) = ${pLatex(d2)}$. $f''(${at}) = ${pAt(d2, at)} ${max ? "< 0" : "> 0"}$, so the local ${max ? "maximum" : "minimum"} is at $x = ${at}$.`,
                  `临界点是 $x = \\pm ${k}$，$f''(x) = ${pLatex(d2)}$。$f''(${at}) = ${pAt(d2, at)} ${max ? "< 0" : "> 0"}$，所以局部${max ? "极大值" : "极小值"}在 $x = ${at}$ 处。`,
                ),
              ],
              [["Evaluate f", "计算函数值"], t(`The value is $f(${at}) = ${answer}$.`, `函数值为 $f(${at}) = ${answer}$。`)],
            ],
            t(
              `Compare with the neighbours: $f(${fmt(at - 0.5)}) = ${fmt(pAt(p, at - 0.5))}$ and $f(${fmt(at + 0.5)}) = ${fmt(pAt(p, at + 0.5))}$ are both ${max ? "below" : "above"} $${answer}$.`,
              `与两侧比较：$f(${fmt(at - 0.5)}) = ${fmt(pAt(p, at - 0.5))}$，$f(${fmt(at + 0.5)}) = ${fmt(pAt(p, at + 0.5))}$，都${max ? "低于" : "高于"} $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculusIExtremaTopics are the topics of Calculus I module 7.18. */
export const calculusIExtremaTopics: readonly TopicDef[] = [
  theMeanValueTheorem,
  globalVsLocalExtremaAndCriticalPoints,
  theExtremeValueTheorem,
  usingDifferentiationToCalculateCriticalPoints,
  determiningIntervalsOnWhichAFunctionIsIncreasingOrDecreasing,
  usingTheFirstDerivativeTestToClassifyLocalExtrema,
  theCandidatesTest,
  intervalsOfConcavity,
  relatingConcavityToTheSecondDerivative,
  pointsOfInflection,
  theSecondDerivativeTest,
];
