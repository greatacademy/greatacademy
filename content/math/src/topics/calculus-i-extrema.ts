import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { numberProblem, solutionsProblem } from "../problems.ts";
import { oneOf, type Poly, pAt, par, pDer, pLatex } from "./calculus-common.ts";

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

/** Applicability is a function on an interval with the hypotheses it meets. */
interface Applicability {
  readonly f: string;
  readonly interval: string;
  readonly continuous: boolean;
  readonly differentiable: boolean;
  readonly closed: boolean;
  readonly why: Text;
}

/** applicability chooses a function on an interval for questions about the hypotheses of theorems. */
function applicability(rng: Rng): Applicability {
  const a = rng.int(-5, 0);
  const b = rng.int(2, 6);
  const c = rng.int(a + 1, b - 1);
  const kind = rng.int(0, 6);
  const p = poly([1, "x^{2}"], [rng.int(-4, 4), "x"], [rng.int(-5, 5), ""]);
  if (kind === 0)
    return {
      f: p,
      interval: `[${a}, ${b}]`,
      continuous: true,
      differentiable: true,
      closed: true,
      why: t("A polynomial is continuous and differentiable everywhere.", "多项式处处连续且可导。"),
    };
  if (kind === 1)
    return {
      f: p,
      interval: `(${a}, ${b})`,
      continuous: true,
      differentiable: true,
      closed: false,
      why: t("The polynomial is continuous, but the interval is open.", "多项式连续，但区间是开区间。"),
    };
  if (kind === 2)
    return {
      f: `|${poly([1, "x"], [-c, ""])}|`,
      interval: `[${a}, ${b}]`,
      continuous: true,
      differentiable: false,
      closed: true,
      why: t(
        `$|${poly([1, "x"], [-c, ""])}|$ is continuous everywhere but has a corner at $x = ${c}$, inside the interval, where it is not differentiable.`,
        `$|${poly([1, "x"], [-c, ""])}|$ 处处连续，但在区间内的 $x = ${c}$ 处有尖点，在该处不可导。`,
      ),
    };
  if (kind === 3)
    return {
      f: `\\frac{1}{${poly([1, "x"], [-c, ""])}}`,
      interval: `[${a}, ${b}]`,
      continuous: false,
      differentiable: false,
      closed: true,
      why: t(
        `$\\frac{1}{${poly([1, "x"], [-c, ""])}}$ has a vertical asymptote at $x = ${c}$, inside the interval, so it is not continuous there.`,
        `$\\frac{1}{${poly([1, "x"], [-c, ""])}}$ 在区间内的 $x = ${c}$ 处有竖直渐近线，在该处不连续。`,
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
        `$\\sqrt{x}$ is continuous on $[0, ${b * b}]$ and differentiable on $(0, ${b * b})$; it need not be differentiable at the endpoint $0$.`,
        `$\\sqrt{x}$ 在 $[0, ${b * b}]$ 上连续，在 $(0, ${b * b})$ 内可导；它在端点 $0$ 处不必可导。`,
      ),
    };
  if (kind === 5)
    return {
      f: `\\sqrt[3]{${poly([1, "x"], [-c, ""])}}`,
      interval: `[${a}, ${b}]`,
      continuous: true,
      differentiable: false,
      closed: true,
      why: t(
        `The cube root is continuous everywhere, but its graph has a vertical tangent at $x = ${c}$, inside the interval, where it is not differentiable.`,
        `立方根函数处处连续，但它的图像在区间内的 $x = ${c}$ 处有竖直切线，在该处不可导。`,
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
  };
}

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
  knowledgePoints: [
    {
      id: "finding-mean-value-theorem-values",
      title: t("Finding mean value theorem values", "求中值定理中的点"),
      explanation: t(
        "If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, there is at least one $c$ in $(a, b)$ with\n\n$$f'(c) = \\frac{f(b) - f(a)}{b - a}:$$\n\nsomewhere the tangent line is parallel to the secant line. To find $c$, compute the average slope, set $f'(c)$ equal to it, and keep the solutions inside $(a, b)$.",
        "若 $f$ 在 $[a, b]$ 上连续，在 $(a, b)$ 内可导，则 $(a, b)$ 内至少有一点 $c$ 使\n\n$$f'(c) = \\frac{f(b) - f(a)}{b - a}:$$\n\n某处的切线与割线平行。求 $c$ 时，先算平均斜率，令 $f'(c)$ 等于它，只保留落在 $(a, b)$ 内的解。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const p: Poly = [rng.int(-5, 5), rng.int(-6, 6), rng.nonZero(-3, 3)];
          const a = rng.int(-5, 2);
          const b = a + rng.int(1, 6);
          const slope = Q.of(pAt(p, b) - pAt(p, a), b - a);
          const answer = Q.of(a + b, 2);
          return numberProblem({
            prompt: t(
              `Find the value of $c$ that satisfies the conclusion of the mean value theorem for $f(x) = ${pLatex(p)}$ on $[${a}, ${b}]$.`,
              `求满足中值定理结论的 $c$，其中 $f(x) = ${pLatex(p)}$，区间为 $[${a}, ${b}]$。`,
            ),
            answer,
            wrong: [slope, Q.of(b - a, 2), Q.of(a + b)].filter((w) => !w.eq(answer)),
            solution: t(
              `The average slope is $\\frac{f(${b}) - f(${a})}{${b} - ${par(a)}} = \\frac{${pAt(p, b)} - ${par(pAt(p, a))}}{${b - a}} = ${slope.toLatex()}$. Setting $f'(c) = ${poly([2 * p[2]!, "c"], [p[1]!, ""])} = ${slope.toLatex()}$ gives $c = ${answer.toLatex()}$.`,
              `平均斜率为 $\\frac{f(${b}) - f(${a})}{${b} - ${par(a)}} = \\frac{${pAt(p, b)} - ${par(pAt(p, a))}}{${b - a}} = ${slope.toLatex()}$。令 $f'(c) = ${poly([2 * p[2]!, "c"], [p[1]!, ""])} = ${slope.toLatex()}$，得 $c = ${answer.toLatex()}$。`,
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
            solution: t(
              `The average slope is $\\frac{\\frac{${k}}{${b}} - \\frac{${k}}{${a}}}{${b} - ${a}} = ${slope.toLatex()}$. Setting $f'(c) = -\\frac{${k}}{c^{2}} = ${slope.toLatex()}$ gives $c^{2} = ${a * b}$, and the solution in $(${a}, ${b})$ is $c = ${c}$.`,
              `平均斜率为 $\\frac{\\frac{${k}}{${b}} - \\frac{${k}}{${a}}}{${b} - ${a}} = ${slope.toLatex()}$。令 $f'(c) = -\\frac{${k}}{c^{2}} = ${slope.toLatex()}$，得 $c^{2} = ${a * b}$，在 $(${a}, ${b})$ 内的解为 $c = ${c}$。`,
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
          solution: t(
            `The average slope is $\\frac{${tt} - ${s}}{${tt * tt} - ${s * s}} = ${slope.toLatex()}$. Setting $f'(c) = \\frac{1}{2\\sqrt{c}} = ${slope.toLatex()}$ gives $\\sqrt{c} = ${(s + tt) / 2}$, so $c = ${c}$.`,
            `平均斜率为 $\\frac{${tt} - ${s}}{${tt * tt} - ${s * s}} = ${slope.toLatex()}$。令 $f'(c) = \\frac{1}{2\\sqrt{c}} = ${slope.toLatex()}$，得 $\\sqrt{c} = ${(s + tt) / 2}$，所以 $c = ${c}$。`,
          ),
        });
      },
    },
    {
      id: "checking-the-hypotheses-of-the-mean-value-theorem",
      title: t("Checking the hypotheses of the mean value theorem", "检查中值定理的条件"),
      explanation: t(
        "The theorem needs both hypotheses: continuity on the closed interval $[a, b]$ and differentiability on the open interval $(a, b)$. A jump, a hole or an asymptote breaks the first; a corner, a cusp or a vertical tangent breaks the second. Differentiability at the endpoints is not needed.",
        "定理需要两个条件：在闭区间 $[a, b]$ 上连续，在开区间 $(a, b)$ 内可导。跳跃、空洞或渐近线破坏第一个条件；尖点、角点或竖直切线破坏第二个条件。端点处不要求可导。",
      ),
      generate(rng) {
        let fn = applicability(rng);
        while (!fn.closed) fn = applicability(rng);
        const options = [
          t("Yes", "是"),
          t(`No: $f$ is not continuous on $${fn.interval}$`, `否：$f$ 在 $${fn.interval}$ 上不连续`),
          t("No: $f$ is not differentiable on the open interval", "否：$f$ 在开区间内不可导"),
        ];
        const right = !fn.continuous ? 1 : !fn.differentiable ? 2 : 0;
        return oneOf(
          rng,
          t(
            `Does the mean value theorem apply to $f(x) = ${fn.f}$ on $${fn.interval}$?`,
            `中值定理是否适用于 $f(x) = ${fn.f}$ 在 $${fn.interval}$ 上的情形？`,
          ),
          options[right]!,
          options.filter((_, i) => i !== right),
          fn.why,
        );
      },
    },
  ],
};

/** globalVsLocalExtremaAndCriticalPoints distinguishes global and local extrema on graphs. */
export const globalVsLocalExtremaAndCriticalPoints: TopicDef = {
  id: "global-vs-local-extrema-and-critical-points",
  title: t("Global vs. Local Extrema and Critical Points", "全局极值、局部极值与临界点"),
  summary: t("Read global and local extrema from graphs, and recognize critical points.", "由图像读出全局极值和局部极值，并识别临界点。"),
  prerequisites: ["the-mean-value-theorem", "calculating-derivatives-from-graphs"],
  encompasses: [{ topic: "calculating-derivatives-from-graphs", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "global-extrema-from-graphs",
      title: t("Global extrema from graphs", "由图像读出全局极值"),
      explanation: t(
        "The global (absolute) maximum of $f$ on an interval is its largest value there; the global minimum is its smallest. They may occur at endpoints. The value is the $y$-coordinate, not the $x$-coordinate where it occurs.",
        "$f$ 在区间上的全局（绝对）最大值是它在该区间上的最大函数值，全局最小值是最小函数值。它们可能出现在端点处。所求的值是 $y$ 坐标，而不是取得该值的 $x$ 坐标。",
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
            solution: t(
              `The ${max ? "highest" : "lowest"} point of the graph is $(${at}, ${answer})$, so the global ${max ? "maximum" : "minimum"} value is $${answer}$.`,
              `图像的${max ? "最高" : "最低"}点是 $(${at}, ${answer})$，所以全局${max ? "最大值" : "最小值"}是 $${answer}$。`,
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "local-extrema-from-graphs",
      title: t("Local extrema from graphs", "由图像读出局部极值"),
      explanation: t(
        "$f$ has a local maximum at an interior point $c$ if $f(c) \\ge f(x)$ for all $x$ near $c$: the graph rises to $c$ and falls after it. Local minima are the reverse. Local extrema occur at critical points, where $f'(c) = 0$ or $f'(c)$ does not exist; on these graphs they are the corners where the graph turns.",
        "若对 $c$ 附近的所有 $x$ 都有 $f(c) \\ge f(x)$，则 $f$ 在内点 $c$ 处有局部极大值：图像在 $c$ 之前上升、之后下降。局部极小值相反。局部极值出现在临界点处，即 $f'(c) = 0$ 或 $f'(c)$ 不存在的点；在这些图像上就是图像转向的折点。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const max = rng.bool();
        const at: number[] = [];
        for (let i = 1; i < ys.length - 1; i++) {
          const [l, m, r] = [ys[i - 1]!, ys[i]!, ys[i + 1]!];
          if (max ? m > l && m > r : m < l && m < r) at.push(zigzagXs[i]!);
        }
        const other = ys.slice(1, -1).filter((y, i) => (max ? y < ys[i]! && y < ys[i + 2]! : y > ys[i]! && y > ys[i + 2]!)).length;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f$ on $[-6, 6]$ is shown. How many local ${max ? "maxima" : "minima"} does $f$ have in the open interval $(-6, 6)$?`,
              `图中是 $f$ 在 $[-6, 6]$ 上的图像。$f$ 在开区间 $(-6, 6)$ 内有多少个局部${max ? "极大值" : "极小值"}？`,
            ),
            answer: at.length,
            wrong: [other, at.length + 1].filter((w) => w !== at.length),
            solution:
              at.length === 0
                ? t(
                    `The graph never ${max ? "rises and then falls" : "falls and then rises"} at an interior corner, so there are none.`,
                    `图像在内部折点处从不${max ? "先升后降" : "先降后升"}，所以没有。`,
                  )
                : t(
                    `The graph ${max ? "rises and then falls" : "falls and then rises"} at $x = ${at.join(", ")}$, so there ${at.length === 1 ? "is $1$" : `are $${at.length}$`}.`,
                    `图像在 $x = ${at.join(", ")}$ 处${max ? "先升后降" : "先降后升"}，所以共有 $${at.length}$ 个。`,
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
  knowledgePoints: [
    {
      id: "checking-the-hypotheses-of-the-extreme-value-theorem",
      title: t("Checking the hypotheses of the extreme value theorem", "检查极值定理的条件"),
      explanation: t(
        "If $f$ is continuous on a closed interval $[a, b]$, then $f$ has a global maximum and a global minimum on $[a, b]$. Differentiability is not needed. On an open interval, or with a discontinuity, the theorem guarantees nothing: $\\frac{1}{x}$ on $(0, 1)$ has no maximum.",
        "若 $f$ 在闭区间 $[a, b]$ 上连续，则 $f$ 在 $[a, b]$ 上有全局最大值和全局最小值。不要求可导。在开区间上或有间断时，定理不能保证任何结论：$\\frac{1}{x}$ 在 $(0, 1)$ 上没有最大值。",
      ),
      generate(rng) {
        const fn = applicability(rng);
        const options = [
          t("Yes", "是"),
          t("No: the interval is not closed", "否：区间不是闭区间"),
          t("No: $f$ is not continuous on the interval", "否：$f$ 在区间上不连续"),
        ];
        const right = !fn.closed ? 1 : !fn.continuous ? 2 : 0;
        return oneOf(
          rng,
          t(
            `Does the extreme value theorem guarantee that $f(x) = ${fn.f}$ has a global maximum on $${fn.interval}$?`,
            `极值定理是否保证 $f(x) = ${fn.f}$ 在 $${fn.interval}$ 上有全局最大值？`,
          ),
          options[right]!,
          options.filter((_, i) => i !== right),
          t(
            `${fn.why.en} ${right === 0 ? "Only continuity on a closed interval is needed, so the theorem applies." : "So the theorem does not apply."}`,
            `${fn.why["zh-CN"]}${right === 0 ? "定理只要求在闭区间上连续，所以定理适用。" : "所以定理不适用。"}`,
          ),
        );
      },
    },
    {
      id: "extrema-of-monotonic-functions",
      title: t("Extrema of monotonic functions", "单调函数的最值"),
      explanation: t(
        "A continuous function that is increasing on $[a, b]$ has its minimum $f(a)$ and maximum $f(b)$; a decreasing one is the reverse. The extremes sit at the endpoints.",
        "在 $[a, b]$ 上递增的连续函数，最小值为 $f(a)$，最大值为 $f(b)$；递减函数则相反。最值都在端点处取得。",
      ),
      generate(rng) {
        const a = rng.int(-5, 2);
        const b = a + rng.int(1, 5);
        const max = rng.bool();
        const p: Poly = rng.bool() ? [rng.int(-9, 9), rng.nonZero(-6, 6)] : [rng.int(-9, 9), 0, 0, rng.pick([1, -1, 2, -2])];
        const [fa, fb] = [pAt(p, a), pAt(p, b)];
        const answer = max ? Math.max(fa, fb) : Math.min(fa, fb);
        const increasing = fb > fa;
        return numberProblem({
          prompt: t(
            `Find the global ${max ? "maximum" : "minimum"} value of $f(x) = ${pLatex(p)}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = ${pLatex(p)}$ 在 $[${a}, ${b}]$ 上的全局${max ? "最大值" : "最小值"}。`,
          ),
          answer,
          wrong: [max ? Math.min(fa, fb) : Math.max(fa, fb), max === increasing ? b : a].filter((w) => w !== answer),
          solution: t(
            `$f$ is ${increasing ? "increasing" : "decreasing"} on the interval, so its ${max ? "maximum" : "minimum"} is at an endpoint: $f(${a}) = ${fa}$ and $f(${b}) = ${fb}$, giving $${answer}$.`,
            `$f$ 在区间上${increasing ? "递增" : "递减"}，所以其${max ? "最大值" : "最小值"}在端点处取得：$f(${a}) = ${fa}$，$f(${b}) = ${fb}$，所以为 $${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** usingDifferentiationToCalculateCriticalPoints finds critical points. */
export const usingDifferentiationToCalculateCriticalPoints: TopicDef = {
  id: "using-differentiation-to-calculate-critical-points",
  title: t("Using Differentiation to Calculate Critical Points", "用求导计算临界点"),
  summary: t("Find critical points, where the derivative is zero or does not exist.", "求临界点，即导数为零或不存在的点。"),
  prerequisites: ["global-vs-local-extrema-and-critical-points"],
  encompasses: [{ topic: "global-vs-local-extrema-and-critical-points", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "critical-points-of-polynomials",
      title: t("Critical points of polynomials", "多项式的临界点"),
      explanation: t(
        "A critical point of $f$ is a point $c$ in its domain where $f'(c) = 0$ or $f'(c)$ does not exist. For a polynomial, $f'$ always exists, so solve $f'(x) = 0$. For $f(x) = 2x^{3} - 3x^{2} - 12x$: $f'(x) = 6x^{2} - 6x - 12 = 6(x - 2)(x + 1)$, so $x = 2$ and $x = -1$.",
        "$f$ 的临界点是其定义域内满足 $f'(c) = 0$ 或 $f'(c)$ 不存在的点 $c$。多项式的导数总存在，所以解 $f'(x) = 0$。对 $f(x) = 2x^{3} - 3x^{2} - 12x$：$f'(x) = 6x^{2} - 6x - 12 = 6(x - 2)(x + 1)$，所以 $x = 2$ 和 $x = -1$。",
      ),
      generate(rng) {
        const c = cubic(rng);
        return solutionsProblem({
          prompt: t(`Find the critical points of $f(x) = ${pLatex(c.p)}$.`, `求 $f(x) = ${pLatex(c.p)}$ 的临界点。`),
          values: [String(c.c1), String(c.c2)],
          wrong: [[String(-c.c1), String(-c.c2)], [String(c.c1)]],
          solution: t(
            `$f'(x) = ${pLatex(pDer(c.p))} = ${derivativeFactored(c)}$, which is $0$ at $x = ${c.c1}$ and $x = ${c.c2}$.`,
            `$f'(x) = ${pLatex(pDer(c.p))} = ${derivativeFactored(c)}$，在 $x = ${c.c1}$ 和 $x = ${c.c2}$ 处为 $0$。`,
          ),
        });
      },
    },
    {
      id: "critical-points-of-other-functions",
      title: t("Critical points of other functions", "其他函数的临界点"),
      explanation: t(
        "Differentiate with the appropriate rules and solve $f'(x) = 0$; also include points of the domain where $f'$ does not exist. For $f(x) = xe^{2x}$: $f'(x) = e^{2x}(1 + 2x) = 0$ only at $x = -\\frac{1}{2}$, since $e^{2x} > 0$.",
        "用相应的法则求导并解 $f'(x) = 0$；还要包括定义域中 $f'$ 不存在的点。对 $f(x) = xe^{2x}$：$f'(x) = e^{2x}(1 + 2x)$，因为 $e^{2x} > 0$，只在 $x = -\\frac{1}{2}$ 处为 $0$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const k = rng.int(1, 6);
        if (kind === 0) {
          const kk = rng.nonZero(-5, 5);
          const answer = Q.of(-1, kk).toLatex();
          const f = `xe^{${poly([kk, "x"])}}`;
          return solutionsProblem({
            prompt: t(`Find the critical points of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的临界点。`),
            values: [answer],
            wrong: [[Q.of(1, kk).toLatex()], ["0", answer]],
            solution: t(
              `$f'(x) = e^{${poly([kk, "x"])}}(${poly([1, ""], [kk, "x"])})$. Since $e^{${poly([kk, "x"])}} > 0$, $f'(x) = 0$ only when $${poly([1, ""], [kk, "x"])} = 0$, so $x = ${answer}$.`,
              `$f'(x) = e^{${poly([kk, "x"])}}(${poly([1, ""], [kk, "x"])})$。因为 $e^{${poly([kk, "x"])}} > 0$，$f'(x) = 0$ 仅当 $${poly([1, ""], [kk, "x"])} = 0$，所以 $x = ${answer}$。`,
            ),
          });
        }
        if (kind === 1) {
          return solutionsProblem({
            prompt: t(`Find the critical points of $f(x) = x + \\frac{${k * k}}{x}$.`, `求 $f(x) = x + \\frac{${k * k}}{x}$ 的临界点。`),
            values: [String(k), String(-k)],
            wrong: [[String(k)], [String(k), String(-k), "0"]],
            solution: t(
              `$f'(x) = 1 - \\frac{${k * k}}{x^{2}} = 0$ when $x^{2} = ${k * k}$, so $x = \\pm ${k}$. $f'$ does not exist at $x = 0$, but $0$ is not in the domain, so it is not a critical point.`,
              `$f'(x) = 1 - \\frac{${k * k}}{x^{2}} = 0$ 时 $x^{2} = ${k * k}$，所以 $x = \\pm ${k}$。$f'$ 在 $x = 0$ 处不存在，但 $0$ 不在定义域内，所以不是临界点。`,
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
            solution: t(
              `By the quotient rule, $f'(x) = \\frac{(x^{2} + ${k * k}) - 2x^{2}}{(x^{2} + ${k * k})^{2}} = \\frac{${k * k} - x^{2}}{(x^{2} + ${k * k})^{2}}$, which is $0$ when $x = \\pm ${k}$.`,
              `由商法则，$f'(x) = \\frac{(x^{2} + ${k * k}) - 2x^{2}}{(x^{2} + ${k * k})^{2}} = \\frac{${k * k} - x^{2}}{(x^{2} + ${k * k})^{2}}$，在 $x = \\pm ${k}$ 处为 $0$。`,
            ),
          });
        }
        const c = rng.int(-5, 5);
        const f = `\\sqrt[3]{${poly([1, "x"], [-c, ""])}}`;
        return solutionsProblem({
          prompt: t(`Find the critical points of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的临界点。`),
          values: [String(c)],
          wrong: [[], [String(-c)]],
          solution: t(
            `$f'(x) = \\frac{1}{3\\sqrt[3]{(${poly([1, "x"], [-c, ""])})^{2}}}$ is never $0$, but it does not exist at $x = ${c}$, which is in the domain. So $x = ${c}$ is the only critical point.`,
            `$f'(x) = \\frac{1}{3\\sqrt[3]{(${poly([1, "x"], [-c, ""])})^{2}}}$ 从不为 $0$，但在定义域内的 $x = ${c}$ 处不存在。所以 $x = ${c}$ 是唯一的临界点。`,
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
  knowledgePoints: [
    {
      id: "increasing-and-decreasing-polynomials",
      title: t("Increasing and decreasing polynomials", "多项式的单调性"),
      explanation: t(
        "$f$ is increasing where $f'(x) > 0$ and decreasing where $f'(x) < 0$. Find the critical points, which split the line into intervals, and test the sign of $f'$ at one point in each. For $f'(x) = 6(x - 2)(x + 1)$: $f'(0) < 0$, so $f$ decreases on $(-1, 2)$ and increases on $(-\\infty, -1)$ and $(2, \\infty)$.",
        "$f'(x) > 0$ 时 $f$ 递增，$f'(x) < 0$ 时 $f$ 递减。先求临界点，它们把数轴分成若干区间，再在每个区间取一点检验 $f'$ 的符号。对 $f'(x) = 6(x - 2)(x + 1)$：$f'(0) < 0$，所以 $f$ 在 $(-1, 2)$ 上递减，在 $(-\\infty, -1)$ 和 $(2, \\infty)$ 上递增。",
      ),
      generate(rng) {
        const c = cubic(rng);
        const increasing = rng.bool();
        const { right, wrong } = monotonicityOptions(c, increasing);
        return oneOf(
          rng,
          t(
            `On which intervals is $f(x) = ${pLatex(c.p)}$ ${increasing ? "increasing" : "decreasing"}?`,
            `$f(x) = ${pLatex(c.p)}$ 在哪些区间上${increasing ? "递增" : "递减"}？`,
          ),
          right,
          wrong,
          t(
            `$f'(x) = ${derivativeFactored(c)}$, with zeros $${c.c1}$ and $${c.c2}$. Between them $f'$ is ${c.up ? "negative" : "positive"}, and outside them it is ${c.up ? "positive" : "negative"}. So $f$ is ${increasing ? "increasing" : "decreasing"} on ${right.en}.`,
            `$f'(x) = ${derivativeFactored(c)}$，零点为 $${c.c1}$ 和 $${c.c2}$。在两者之间 $f'$ 为${c.up ? "负" : "正"}，在两侧为${c.up ? "正" : "负"}。所以 $f$ 在 ${right["zh-CN"]} 上${increasing ? "递增" : "递减"}。`,
          ),
        );
      },
    },
    {
      id: "increasing-and-decreasing-transcendental-functions",
      title: t("Increasing and decreasing transcendental functions", "超越函数的单调性"),
      explanation: t(
        "Factor $f'$ so that its sign is clear. For $f(x) = (x - 2)e^{x}$: $f'(x) = (x - 1)e^{x}$, and $e^{x} > 0$, so $f'$ has the sign of $x - 1$: $f$ decreases on $(-\\infty, 1)$ and increases on $(1, \\infty)$. Respect the domain: $x - 3\\ln x$ is only defined for $x > 0$.",
        "把 $f'$ 因式分解，使其符号一目了然。对 $f(x) = (x - 2)e^{x}$：$f'(x) = (x - 1)e^{x}$，又 $e^{x} > 0$，所以 $f'$ 与 $x - 1$ 同号：$f$ 在 $(-\\infty, 1)$ 上递减，在 $(1, \\infty)$ 上递增。注意定义域：$x - 3\\ln x$ 只在 $x > 0$ 时有定义。",
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
        const left = intervals(open(lo, crit));
        const rightI = intervals(open(crit, undefined));
        const right = increasing === upFirst ? left : rightI;
        const wrong = [increasing === upFirst ? rightI : left, intervals(open(undefined, undefined)), intervals(open(undefined, -crit))];
        return oneOf(
          rng,
          t(
            `On which interval is $f(x) = ${f}$ ${increasing ? "increasing" : "decreasing"}?`,
            `$f(x) = ${f}$ 在哪个区间上${increasing ? "递增" : "递减"}？`,
          ),
          right,
          wrong,
          t(
            `$f'(x) = ${fd}$, which is $0$ only at $x = ${crit}$. It is ${upFirst ? "positive" : "negative"} on ${left.en} and ${upFirst ? "negative" : "positive"} on ${rightI.en}, so $f$ is ${increasing ? "increasing" : "decreasing"} on ${right.en}.`,
            `$f'(x) = ${fd}$，只在 $x = ${crit}$ 处为 $0$。它在 ${left["zh-CN"]} 上为${upFirst ? "正" : "负"}，在 ${rightI["zh-CN"]} 上为${upFirst ? "负" : "正"}，所以 $f$ 在 ${right["zh-CN"]} 上${increasing ? "递增" : "递减"}。`,
          ),
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
  knowledgePoints: [
    {
      id: "local-extrema-of-polynomials",
      title: t("Local extrema of polynomials", "多项式的局部极值"),
      explanation: t(
        "At a critical point $c$: if $f'$ changes from positive to negative, $f$ has a local maximum; from negative to positive, a local minimum; if $f'$ keeps its sign, neither.",
        "在临界点 $c$ 处：若 $f'$ 由正变负，$f$ 有局部极大值；由负变正，有局部极小值；若 $f'$ 不变号，则都不是。",
      ),
      generate(rng) {
        const c = cubic(rng);
        const max = rng.bool();
        const at = max === c.up ? c.c1 : c.c2;
        const valueAsked = rng.bool();
        const answer = valueAsked ? pAt(c.p, at) : at;
        const other = max === c.up ? c.c2 : c.c1;
        return numberProblem({
          prompt: t(
            `$f(x) = ${pLatex(c.p)}$ has one local maximum and one local minimum. Find the ${valueAsked ? `local ${max ? "maximum" : "minimum"} value` : `$x$-coordinate of the local ${max ? "maximum" : "minimum"}`}.`,
            `$f(x) = ${pLatex(c.p)}$ 有一个局部极大值和一个局部极小值。求${valueAsked ? `局部${max ? "极大值" : "极小值"}` : `局部${max ? "极大值" : "极小值"}点的 $x$ 坐标`}。`,
          ),
          answer,
          wrong: (valueAsked ? [pAt(c.p, other), at] : [other, pAt(c.p, at)]).filter((w) => w !== answer),
          solution: t(
            `$f'(x) = ${derivativeFactored(c)}$ changes from ${max ? "positive to negative" : "negative to positive"} at $x = ${at}$, so the local ${max ? "maximum" : "minimum"} is at $x = ${at}$${valueAsked ? `, with value $f(${at}) = ${answer}$` : ""}.`,
            `$f'(x) = ${derivativeFactored(c)}$ 在 $x = ${at}$ 处${max ? "由正变负" : "由负变正"}，所以局部${max ? "极大值" : "极小值"}点为 $x = ${at}$${valueAsked ? `，其值为 $f(${at}) = ${answer}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "classifying-critical-points-from-the-derivative",
      title: t("Classifying critical points from the derivative", "由导数判定临界点"),
      explanation: t(
        "When $f'$ is given in factored form, a factor $(x - c)^{n}$ changes sign at $c$ only when $n$ is odd. For $f'(x) = (x - 1)^{2}(x + 3)$: at $x = 1$ the sign does not change, so there is no extremum; at $x = -3$, $f'$ goes from negative to positive, a local minimum.",
        "当 $f'$ 以因式分解形式给出时，因式 $(x - c)^{n}$ 只有在 $n$ 为奇数时才会在 $c$ 处变号。对 $f'(x) = (x - 1)^{2}(x + 3)$：在 $x = 1$ 处不变号，没有极值；在 $x = -3$ 处 $f'$ 由负变正，是局部极小值。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        let b = rng.int(-5, 5);
        while (b === a) b = rng.int(-5, 5);
        const j = rng.int(1, 3);
        const kk = rng.int(1, 2);
        const lead = rng.sign();
        const fd = `${lead < 0 ? "-" : ""}${factor(a)}${j === 1 ? "" : `^{${j}}`}${factor(b)}${kk === 1 ? "" : `^{${kk}}`}`;
        const sideSign = lead * (a > b || kk % 2 === 0 ? 1 : -1);
        const verdict = j % 2 === 0 ? 2 : sideSign > 0 ? 1 : 0;
        const options = [t("A local maximum", "局部极大值"), t("A local minimum", "局部极小值"), t("Neither", "都不是")];
        const signs = (s: number) => (s > 0 ? t("positive", "正") : t("negative", "负"));
        const leftSign = j % 2 === 0 ? sideSign : -sideSign;
        return oneOf(
          rng,
          t(`$f'(x) = ${fd}$. What does $f$ have at the critical point $x = ${a}$?`, `$f'(x) = ${fd}$。$f$ 在临界点 $x = ${a}$ 处有什么？`),
          options[verdict]!,
          options.filter((_, i) => i !== verdict),
          t(
            `Near $x = ${a}$ the other factors keep a fixed sign, and $${factor(a)}${j === 1 ? "" : `^{${j}}`}$ ${j % 2 === 0 ? "does not change sign" : "changes sign"}. So $f'$ is ${signs(leftSign).en} just left of $${a}$ and ${signs(sideSign).en} just right of it: ${verdict === 2 ? "no extremum" : verdict === 0 ? "a local maximum" : "a local minimum"}.`,
            `在 $x = ${a}$ 附近其他因式的符号不变，而 $${factor(a)}${j === 1 ? "" : `^{${j}}`}$ ${j % 2 === 0 ? "不变号" : "变号"}。所以 $f'$ 在 $${a}$ 左侧为${signs(leftSign)["zh-CN"]}，右侧为${signs(sideSign)["zh-CN"]}：${verdict === 2 ? "没有极值" : verdict === 0 ? "局部极大值" : "局部极小值"}。`,
          ),
        );
      },
    },
  ],
};

/** theCandidatesTest finds global extrema on closed intervals. */
export const theCandidatesTest: TopicDef = {
  id: "the-candidates-test",
  title: t("The Candidates Test", "候选点检验法"),
  summary: t(
    "Find global extrema on a closed interval by comparing the values at critical points and endpoints.",
    "比较临界点与端点处的函数值，求闭区间上的全局最值。",
  ),
  prerequisites: ["using-the-first-derivative-test-to-classify-local-extrema", "the-extreme-value-theorem"],
  encompasses: [
    { topic: "the-extreme-value-theorem", weight: 0.3 },
    { topic: "using-differentiation-to-calculate-critical-points", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "global-extrema-on-closed-intervals",
      title: t("Global extrema on closed intervals", "闭区间上的全局最值"),
      explanation: t(
        "To find the global extrema of a continuous $f$ on $[a, b]$:\n\n1. Find the critical points in $(a, b)$.\n2. Evaluate $f$ at them and at $a$ and $b$.\n3. The largest value is the global maximum and the smallest is the global minimum.\n\nCritical points outside the interval are discarded.",
        "求连续函数 $f$ 在 $[a, b]$ 上的全局最值：\n\n1. 求出 $(a, b)$ 内的临界点。\n2. 计算 $f$ 在这些点及 $a$、$b$ 处的值。\n3. 最大的值为全局最大值，最小的值为全局最小值。\n\n区间外的临界点要舍去。",
      ),
      generate(rng) {
        const c = cubic(rng, -3, 3);
        const a = c.c1 - rng.int(-1, 2);
        const b = Math.max(a + 2, c.c2 + rng.int(-1, 2));
        const max = rng.bool();
        const candidates = [a, b, ...[c.c1, c.c2].filter((x) => x > a && x < b)];
        const values = candidates.map((x) => pAt(c.p, x));
        const answer = max ? Math.max(...values) : Math.min(...values);
        const local = pAt(c.p, max === c.up ? c.c1 : c.c2);
        return numberProblem({
          prompt: t(
            `Find the global ${max ? "maximum" : "minimum"} value of $f(x) = ${pLatex(c.p)}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = ${pLatex(c.p)}$ 在 $[${a}, ${b}]$ 上的全局${max ? "最大值" : "最小值"}。`,
          ),
          answer,
          wrong: [local, max ? Math.min(...values) : Math.max(...values), pAt(c.p, b)].filter((w) => w !== answer),
          solution: t(
            `$f'(x) = ${derivativeFactored(c)}$, so the critical points are $${c.c1}$ and $${c.c2}$. The candidates in $[${a}, ${b}]$ give ${candidates.map((x, i) => `$f(${x}) = ${values[i]}$`).join(", ")}. The ${max ? "largest" : "smallest"} is $${answer}$.`,
            `$f'(x) = ${derivativeFactored(c)}$，所以临界点为 $${c.c1}$ 和 $${c.c2}$。$[${a}, ${b}]$ 中的候选点给出 ${candidates.map((x, i) => `$f(${x}) = ${values[i]}$`).join("，")}。其中${max ? "最大" : "最小"}的是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "global-extrema-of-other-functions",
      title: t("Global extrema of other functions", "其他函数的全局最值"),
      explanation: t(
        "The method is the same for any continuous function. For $f(x) = x + \\frac{4}{x}$ on $[1, 8]$: $f'(x) = 1 - \\frac{4}{x^{2}} = 0$ at $x = 2$ (and $-2$, outside). $f(1) = 5$, $f(2) = 4$, $f(8) = 8.5$, so the minimum is $4$ and the maximum is $8.5$.",
        "对任何连续函数方法都一样。对 $f(x) = x + \\frac{4}{x}$ 在 $[1, 8]$ 上：$f'(x) = 1 - \\frac{4}{x^{2}} = 0$ 于 $x = 2$（$-2$ 在区间外）。$f(1) = 5$，$f(2) = 4$，$f(8) = 8.5$，所以最小值为 $4$，最大值为 $8.5$。",
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
        return numberProblem({
          prompt: t(
            `Find the global ${max ? "maximum" : "minimum"} value of $f(x) = x + \\frac{${k * k}}{x}$ on $[${a}, ${b}]$.`,
            `求 $f(x) = x + \\frac{${k * k}}{x}$ 在 $[${a}, ${b}]$ 上的全局${max ? "最大值" : "最小值"}。`,
          ),
          answer,
          wrong: [f(k), Q.of(2 * k), Q.of(max ? a : b), values.reduce((m, v) => ((max ? v.cmp(m) < 0 : v.cmp(m) > 0) ? v : m))].filter(
            (w) => !w.eq(answer),
          ),
          solution: t(
            `$f'(x) = 1 - \\frac{${k * k}}{x^{2}} = 0$ at $x = \\pm ${k}$; ${k > a ? `only $${k}$ lies in $(${a}, ${b})$` : `neither lies inside $(${a}, ${b})$`}. The candidates give ${candidates.map((x, i) => `$f(${x}) = ${values[i]!.toLatex()}$`).join(", ")}, so the global ${max ? "maximum" : "minimum"} is $${answer.toLatex()}$.`,
            `$f'(x) = 1 - \\frac{${k * k}}{x^{2}} = 0$ 于 $x = \\pm ${k}$；${k > a ? `只有 $${k}$ 在 $(${a}, ${b})$ 内` : `两者都不在 $(${a}, ${b})$ 内`}。候选点给出 ${candidates.map((x, i) => `$f(${x}) = ${values[i]!.toLatex()}$`).join("，")}，所以全局${max ? "最大值" : "最小值"}为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** intervalsOfConcavity reads concavity from graphs of the derivative and from sign charts. */
export const intervalsOfConcavity: TopicDef = {
  id: "intervals-of-concavity",
  title: t("Intervals of Concavity", "凹凸区间"),
  summary: t(
    "Decide where a function is concave up or down from how its derivative changes.",
    "根据导数的变化判断函数在哪些区间上凹或凸。",
  ),
  prerequisites: ["determining-intervals-on-which-a-function-is-increasing-or-decreasing", "second-and-higher-order-derivatives"],
  encompasses: [{ topic: "determining-intervals-on-which-a-function-is-increasing-or-decreasing", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "concavity-from-the-graph-of-the-derivative",
      title: t("Concavity from the graph of the derivative", "由导数的图像判断凹凸性"),
      explanation: t(
        "$f$ is concave up where $f'$ is increasing (the graph bends upward, like a cup) and concave down where $f'$ is decreasing (like a cap). Where $f'$ is constant, $f$ is a line and is neither.",
        "$f'$ 递增的地方 $f$ 是上凹的（图像像杯子一样向上弯），$f'$ 递减的地方 $f$ 是下凹的（像帽子）。$f'$ 为常数的地方 $f$ 是直线，两者都不是。",
      ),
      generate(rng) {
        const ys = zigzag(rng, true);
        const i = rng.int(0, zigzagXs.length - 2);
        const x = zigzagXs[i]! + 1;
        const d = ys[i + 1]! - ys[i]!;
        const verdict = d > 0 ? 0 : d < 0 ? 1 : 2;
        const options = [t("Concave up", "上凹"), t("Concave down", "下凹"), t("Neither: $f$ is linear there", "都不是：$f$ 在那里是直线")];
        return oneOf(
          rng,
          t(
            `The graph of $f'$, the derivative of $f$, is shown. Is $f$ concave up or concave down at $x = ${x}$?`,
            `图中是 $f$ 的导数 $f'$ 的图像。$f$ 在 $x = ${x}$ 处是上凹还是下凹？`,
          ),
          options[verdict]!,
          options.filter((_, j) => j !== verdict),
          t(
            `On $(${zigzagXs[i]}, ${zigzagXs[i + 1]})$ the graph of $f'$ ${d > 0 ? "rises" : d < 0 ? "falls" : "is flat"}, so $f'$ is ${d > 0 ? "increasing and $f$ is concave up" : d < 0 ? "decreasing and $f$ is concave down" : "constant and $f$ is linear"} there. The sign of $f'$ itself does not matter.`,
            `在 $(${zigzagXs[i]}, ${zigzagXs[i + 1]})$ 上 $f'$ 的图像${d > 0 ? "上升" : d < 0 ? "下降" : "水平"}，所以 $f'$ ${d > 0 ? "递增，$f$ 上凹" : d < 0 ? "递减，$f$ 下凹" : "为常数，$f$ 是直线"}。$f'$ 本身的正负与此无关。`,
          ),
          zigzagFigure(ys, "f'"),
        );
      },
    },
    {
      id: "concavity-from-a-sign-chart",
      title: t("Concavity from a factored second derivative", "由因式分解的二阶导数判断凹凸性"),
      explanation: t(
        "$f$ is concave up where $f''(x) > 0$ and concave down where $f''(x) < 0$. With $f''$ factored, test its sign between consecutive zeros.",
        "$f''(x) > 0$ 时 $f$ 上凹，$f''(x) < 0$ 时 $f$ 下凹。$f''$ 因式分解后，检验它在相邻零点之间的符号。",
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
        return oneOf(
          rng,
          t(
            `$f''(x) = ${lead}${factor(p)}${factor(q)}$. On which intervals is $f$ concave ${up ? "up" : "down"}?`,
            `$f''(x) = ${lead}${factor(p)}${factor(q)}$。$f$ 在哪些区间上${up ? "上凹" : "下凹"}？`,
          ),
          rightIsMiddle ? middle : outer,
          [rightIsMiddle ? outer : middle, intervals(open(undefined, q)), intervals(open(p, undefined))],
          t(
            `$f''$ is ${k > 0 ? "negative" : "positive"} between its zeros $${p}$ and $${q}$, and ${k > 0 ? "positive" : "negative"} outside them. So $f$ is concave ${up ? "up" : "down"} on ${(rightIsMiddle ? middle : outer).en}.`,
            `$f''$ 在零点 $${p}$ 与 $${q}$ 之间为${k > 0 ? "负" : "正"}，在两侧为${k > 0 ? "正" : "负"}。所以 $f$ 在 ${(rightIsMiddle ? middle : outer)["zh-CN"]} 上${up ? "上凹" : "下凹"}。`,
          ),
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
  encompasses: [{ topic: "intervals-of-concavity", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "concavity-of-polynomials",
      title: t("Concavity of polynomials", "多项式的凹凸性"),
      explanation: t(
        "Differentiate twice, factor $f''$, and test its sign. For $f(x) = x^{4} - 6x^{2}$: $f''(x) = 12x^{2} - 12 = 12(x - 1)(x + 1)$, so $f$ is concave down on $(-1, 1)$ and concave up on $(-\\infty, -1)$ and $(1, \\infty)$.",
        "求两次导数，把 $f''$ 因式分解，再检验符号。对 $f(x) = x^{4} - 6x^{2}$：$f''(x) = 12x^{2} - 12 = 12(x - 1)(x + 1)$，所以 $f$ 在 $(-1, 1)$ 上下凹，在 $(-\\infty, -1)$ 和 $(1, \\infty)$ 上上凹。",
      ),
      generate(rng) {
        const Qd = quartic(rng);
        const up = rng.bool();
        const middle = intervals(open(Qd.p, Qd.q));
        const outer = intervals(open(undefined, Qd.p), open(Qd.q, undefined));
        const rightIsMiddle = up !== Qd.m > 0;
        const f2 = pDer(pDer(Qd.f));
        return oneOf(
          rng,
          t(
            `On which intervals is $f(x) = ${pLatex(Qd.f)}$ concave ${up ? "up" : "down"}?`,
            `$f(x) = ${pLatex(Qd.f)}$ 在哪些区间上${up ? "上凹" : "下凹"}？`,
          ),
          rightIsMiddle ? middle : outer,
          [rightIsMiddle ? outer : middle, intervals(open(undefined, Qd.q)), intervals(open(Qd.p, undefined))],
          t(
            `$f''(x) = ${pLatex(f2)} = ${12 * Qd.m}${factor(Qd.p)}${factor(Qd.q)}$, which is ${Qd.m > 0 ? "negative" : "positive"} on $${open(Qd.p, Qd.q)}$ and ${Qd.m > 0 ? "positive" : "negative"} outside it. So $f$ is concave ${up ? "up" : "down"} on ${(rightIsMiddle ? middle : outer).en}.`,
            `$f''(x) = ${pLatex(f2)} = ${12 * Qd.m}${factor(Qd.p)}${factor(Qd.q)}$，在 $${open(Qd.p, Qd.q)}$ 上为${Qd.m > 0 ? "负" : "正"}，在其两侧为${Qd.m > 0 ? "正" : "负"}。所以 $f$ 在 ${(rightIsMiddle ? middle : outer)["zh-CN"]} 上${up ? "上凹" : "下凹"}。`,
          ),
        );
      },
    },
    {
      id: "concavity-at-a-point",
      title: t("Concavity at a point", "某点处的凹凸性"),
      explanation: t(
        "To decide concavity at one point, evaluate $f''$ there: positive means concave up, negative means concave down.",
        "判断某一点处的凹凸性时，计算该点的 $f''$：为正则上凹，为负则下凹。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const x0 = rng.int(-3, 3);
        let f: string;
        let f2: string;
        let value: number;
        if (kind === 0) {
          const p: Poly = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-4, 4), rng.int(-3, 3), rng.nonZero(-2, 2)];
          f = pLatex(p);
          f2 = pLatex(pDer(pDer(p)));
          value = pAt(pDer(pDer(p)), x0);
        } else if (kind === 1) {
          const k = rng.nonZero(-3, 3);
          const c = rng.int(1, 9);
          f = `${poly([k, "x^{3}"])} + ${c}e^{x}`;
          f2 = `${6 * k}x + ${c}e^{x}`;
          value = 6 * k * x0 + c * Math.exp(x0);
        } else {
          const k = rng.int(1, 9);
          f = `${k}\\sin x`;
          f2 = `-${k}\\sin x`;
          value = -k * Math.sin(x0);
        }
        if (Math.abs(value) < 1e-9) value = 0;
        const verdict = value > 0 ? 0 : value < 0 ? 1 : 2;
        const options = [
          t("Concave up", "上凹"),
          t("Concave down", "下凹"),
          t("Cannot tell from $f''$: it is $0$ there", "无法由 $f''$ 判断：该处 $f''$ 为 $0$"),
        ];
        return oneOf(
          rng,
          t(`Is $f(x) = ${f}$ concave up or concave down at $x = ${x0}$?`, `$f(x) = ${f}$ 在 $x = ${x0}$ 处是上凹还是下凹？`),
          options[verdict]!,
          options.filter((_, i) => i !== verdict),
          t(
            `$f''(x) = ${f2}$, and $f''(${x0}) ${value > 0 ? "> 0" : value < 0 ? "< 0" : "= 0"}$${kind === 0 ? ` (it is $${value}$)` : ""}, so ${verdict === 0 ? "$f$ is concave up there" : verdict === 1 ? "$f$ is concave down there" : "the second derivative alone does not decide"}.`,
            `$f''(x) = ${f2}$，$f''(${x0}) ${value > 0 ? "> 0" : value < 0 ? "< 0" : "= 0"}$${kind === 0 ? `（等于 $${value}$）` : ""}，所以${verdict === 0 ? " $f$ 在该处上凹" : verdict === 1 ? " $f$ 在该处下凹" : "仅凭二阶导数无法判断"}。`,
          ),
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
  knowledgePoints: [
    {
      id: "finding-points-of-inflection",
      title: t("Finding points of inflection", "求拐点"),
      explanation: t(
        "A point of inflection is a point on the graph where the concavity changes. Candidates are where $f''(x) = 0$ or $f''$ does not exist; keep those where $f''$ changes sign. For a cubic $ax^{3} + bx^{2} + cx + d$, $f''(x) = 6ax + 2b$ changes sign once, at $x = -\\frac{b}{3a}$.",
        "拐点是图像上凹凸性发生改变的点。候选点是 $f''(x) = 0$ 或 $f''$ 不存在的点；保留 $f''$ 在该处变号的点。对三次函数 $ax^{3} + bx^{2} + cx + d$，$f''(x) = 6ax + 2b$ 只变号一次，在 $x = -\\frac{b}{3a}$ 处。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const Qd = quartic(rng);
          return solutionsProblem({
            prompt: t(
              `Find the $x$-coordinates of the points of inflection of $f(x) = ${pLatex(Qd.f)}$.`,
              `求 $f(x) = ${pLatex(Qd.f)}$ 的拐点的 $x$ 坐标。`,
            ),
            values: [String(Qd.p), String(Qd.q)],
            wrong: [[String(-Qd.p), String(-Qd.q)], [String(Qd.p)]],
            solution: t(
              `$f''(x) = ${pLatex(pDer(pDer(Qd.f)))} = ${12 * Qd.m}${factor(Qd.p)}${factor(Qd.q)}$, which changes sign at both zeros, $x = ${Qd.p}$ and $x = ${Qd.q}$.`,
              `$f''(x) = ${pLatex(pDer(pDer(Qd.f)))} = ${12 * Qd.m}${factor(Qd.p)}${factor(Qd.q)}$，在两个零点 $x = ${Qd.p}$ 和 $x = ${Qd.q}$ 处都变号。`,
            ),
          });
        }
        const c = cubic(rng);
        const x = Q.of(c.c1 + c.c2, 2);
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of the points of inflection of $f(x) = ${pLatex(c.p)}$.`,
            `求 $f(x) = ${pLatex(c.p)}$ 的拐点的 $x$ 坐标。`,
          ),
          values: [x.toLatex()],
          wrong: [[String(c.c1), String(c.c2)], [x.neg().toLatex()]],
          solution: t(
            `$f''(x) = ${pLatex(pDer(pDer(c.p)))}$, a linear function that changes sign at its zero $x = ${x.toLatex()}$.`,
            `$f''(x) = ${pLatex(pDer(pDer(c.p)))}$ 是一次函数，在零点 $x = ${x.toLatex()}$ 处变号。`,
          ),
        });
      },
    },
    {
      id: "when-a-zero-second-derivative-is-not-an-inflection-point",
      title: t("When a zero second derivative is not an inflection point", "二阶导数为零却不是拐点的情形"),
      explanation: t(
        "$f''(c) = 0$ does not guarantee an inflection point. For $f(x) = x^{4}$, $f''(x) = 12x^{2}$ is $0$ at $x = 0$ but positive on both sides, so $f$ is concave up throughout. Conversely, $f(x) = \\sqrt[3]{x}$ has an inflection point at $0$ although $f''(0)$ does not exist.",
        "$f''(c) = 0$ 并不保证是拐点。对 $f(x) = x^{4}$，$f''(x) = 12x^{2}$ 在 $x = 0$ 处为 $0$，但两侧都为正，所以 $f$ 处处上凹。反过来，$f(x) = \\sqrt[3]{x}$ 在 $0$ 处有拐点，尽管 $f''(0)$ 不存在。",
      ),
      generate(rng) {
        const c = rng.int(-5, 5);
        const d = rng.int(-9, 9);
        const n = rng.int(2, 7);
        const root = n === 2;
        const k = rng.nonZero(-3, 3);
        const f = root
          ? sumLatex2(`${k === 1 ? "" : k === -1 ? "-" : k}\\sqrt[3]{${poly([1, "x"], [-c, ""])}}`, d)
          : sumLatex2(`${k === 1 ? "" : k === -1 ? "-" : k}${factor(c)}^{${n}}`, d);
        const yes = root || n % 2 === 1;
        const f2 = root
          ? `${Q.of(-2 * k, 9).toLatex()}(${poly([1, "x"], [-c, ""])})^{-\\frac{5}{3}}`
          : `${k * n * (n - 1)}${factor(c)}${n - 2 === 1 ? "" : `^{${n - 2}}`}`;
        const options = [t("Yes", "是"), t("No", "否")];
        return oneOf(
          rng,
          t(`Does $f(x) = ${f}$ have a point of inflection at $x = ${c}$?`, `$f(x) = ${f}$ 在 $x = ${c}$ 处有拐点吗？`),
          options[yes ? 0 : 1]!,
          [options[yes ? 1 : 0]!],
          t(
            `$f''(x) = ${f2}$${root ? `, which does not exist at $x = ${c}$` : `, which is $0$ at $x = ${c}$`}. ${yes ? `It changes sign there, so the concavity changes: yes.` : `It has the same sign on both sides, since the power $${n - 2}$ is even, so the concavity does not change: no.`}`,
            `$f''(x) = ${f2}$${root ? `，在 $x = ${c}$ 处不存在` : `，在 $x = ${c}$ 处为 $0$`}。${yes ? "它在该处变号，凹凸性改变：是。" : `由于指数 $${n - 2}$ 为偶数，它在两侧同号，凹凸性不变：否。`}`,
          ),
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
  encompasses: [
    { topic: "relating-concavity-to-the-second-derivative", weight: 0.3 },
    { topic: "using-the-first-derivative-test-to-classify-local-extrema", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-with-the-second-derivative",
      title: t("Classifying with the second derivative", "用二阶导数判定"),
      explanation: t(
        "If $f'(c) = 0$ and $f''(c) < 0$, the graph is concave down at $c$, so $f$ has a local maximum there; if $f''(c) > 0$, a local minimum. If $f''(c) = 0$ the test is inconclusive, and the first derivative test must be used instead.",
        "若 $f'(c) = 0$ 且 $f''(c) < 0$，图像在 $c$ 处下凹，$f$ 在该处有局部极大值；若 $f''(c) > 0$，有局部极小值。若 $f''(c) = 0$，检验法失效，需改用一阶导数检验法。",
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
          const f = sumLatex2(`${k === 1 ? "" : k === -1 ? "-" : k}${factor(c)}^{${n}}`, rng.int(-5, 5));
          return oneOf(
            rng,
            t(
              `$x = ${c}$ is a critical point of $f(x) = ${f}$. What does the second derivative test say about it?`,
              `$x = ${c}$ 是 $f(x) = ${f}$ 的临界点。二阶导数检验法对它有什么结论？`,
            ),
            options[2]!,
            [options[0]!, options[1]!],
            t(
              `$f''(x) = ${k * n * (n - 1)}${factor(c)}${n - 2 === 1 ? "" : `^{${n - 2}}`}$, so $f''(${c}) = 0$ and the test is inconclusive.`,
              `$f''(x) = ${k * n * (n - 1)}${factor(c)}${n - 2 === 1 ? "" : `^{${n - 2}}`}$，所以 $f''(${c}) = 0$，检验法失效。`,
            ),
          );
        }
        const c = cubic(rng);
        const at = rng.bool() ? c.c1 : c.c2;
        const f2 = pAt(pDer(pDer(c.p)), at);
        const verdict = f2 < 0 ? 0 : 1;
        return oneOf(
          rng,
          t(
            `$x = ${at}$ is a critical point of $f(x) = ${pLatex(c.p)}$. Use the second derivative test to classify it.`,
            `$x = ${at}$ 是 $f(x) = ${pLatex(c.p)}$ 的临界点。用二阶导数检验法判定它。`,
          ),
          options[verdict]!,
          options.filter((_, i) => i !== verdict),
          t(
            `$f''(x) = ${pLatex(pDer(pDer(c.p)))}$, so $f''(${at}) = ${f2}$, which is ${f2 < 0 ? "negative: a local maximum" : "positive: a local minimum"}.`,
            `$f''(x) = ${pLatex(pDer(pDer(c.p)))}$，所以 $f''(${at}) = ${f2}$，为${f2 < 0 ? "负：局部极大值" : "正：局部极小值"}。`,
          ),
        );
      },
    },
    {
      id: "local-extreme-values-with-the-second-derivative-test",
      title: t("Local extreme values with the second derivative test", "用二阶导数检验法求局部极值"),
      explanation: t(
        "Find the critical points, classify each with the sign of $f''$, and evaluate $f$ at the one asked for. For $f(x) = x^{3} - 12x$: $f'(x) = 3x^{2} - 12 = 0$ at $x = \\pm 2$; $f''(x) = 6x$ gives $f''(2) = 12 > 0$, so the local minimum value is $f(2) = -16$.",
        "求出临界点，用 $f''$ 的符号判定每一个，再计算所求那一点处的函数值。对 $f(x) = x^{3} - 12x$：$f'(x) = 3x^{2} - 12 = 0$ 于 $x = \\pm 2$；$f''(x) = 6x$，$f''(2) = 12 > 0$，所以局部极小值为 $f(2) = -16$。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const d = rng.int(-20, 20);
        const m = rng.sign();
        const p: Poly = [d, -3 * m * k * k, 0, m];
        const max = rng.bool();
        const at = max === m > 0 ? -k : k;
        const answer = pAt(p, at);
        return numberProblem({
          prompt: t(
            `Find the local ${max ? "maximum" : "minimum"} value of $f(x) = ${pLatex(p)}$.`,
            `求 $f(x) = ${pLatex(p)}$ 的局部${max ? "极大值" : "极小值"}。`,
          ),
          answer,
          wrong: [pAt(p, -at), at, d].filter((w) => w !== answer),
          solution: t(
            `$f'(x) = ${pLatex(pDer(p))} = 0$ at $x = \\pm ${k}$. $f''(x) = ${pLatex(pDer(pDer(p)))}$ and $f''(${at}) = ${pAt(pDer(pDer(p)), at)} ${max ? "< 0" : "> 0"}$, so the local ${max ? "maximum" : "minimum"} is $f(${at}) = ${answer}$.`,
            `$f'(x) = ${pLatex(pDer(p))} = 0$ 于 $x = \\pm ${k}$。$f''(x) = ${pLatex(pDer(pDer(p)))}$，$f''(${at}) = ${pAt(pDer(pDer(p)), at)} ${max ? "< 0" : "> 0"}$，所以局部${max ? "极大值" : "极小值"}为 $f(${at}) = ${answer}$。`,
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
