import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem, solutionsProblem } from "../problems.ts";
import { oneOf, type Poly, pAt, par, pDer, pLatex, rounded } from "./calculus-common.ts";
import { cubic, intervals, monotonicityOptions, open, zigzag, zigzagFigure, zigzagXs } from "./calculus-i-extrema.ts";

// Calculus I unit 7: Analytical Applications of Differentiation, modules 7.19 and 7.20.

/** smoothFigure draws y = g(x) for x from from to to, scaled to fill the view. */
function smoothFigure(g: (x: number) => number, from: number, to: number, alt: Text): Figure {
  const ys = Array.from({ length: 81 }, (_, i) => g(from + ((to - from) * i) / 80));
  const [lo, hi] = [Math.min(...ys), Math.max(...ys)];
  const k = (hi - lo) / 10;
  const mid = (hi + lo) / 2;
  return {
    svg: plane({ xMin: -6, xMax: 6, yMin: -6, yMax: 6 }, [{ kind: "curve", f: (x) => (g(x) - mid) / k, from, to, accent: true }]),
    alt,
  };
}

/** productFigure draws s·(x − r1)(x − r2)… scaled vertically to fill the view, keeping its zeros. */
function productFigure(roots: readonly number[], s: number, name: string): Figure {
  const g = (x: number) => s * roots.reduce((p, r) => p * (x - r), 1);
  const from = Math.max(-6, Math.min(...roots) - 1.5);
  const to = Math.min(6, Math.max(...roots) + 1.5);
  const ys = Array.from({ length: 81 }, (_, i) => Math.abs(g(from + ((to - from) * i) / 80)));
  const k = Math.max(...ys) / 5.5;
  const distinct = [...new Set(roots)];
  return {
    svg: plane({ xMin: -6, xMax: 6, yMin: -6, yMax: 6 }, [{ kind: "curve", f: (x) => g(x) / k, from, to, accent: true }]),
    alt: t(
      `The graph of $${name}$, a smooth curve that meets the $x$-axis only at $x = ${distinct.join(", ")}$; it is ${g(to) > 0 ? "above" : "below"} the axis at the right end.`,
      `$${name}$ 的图像是一条光滑曲线，只在 $x = ${distinct.join(", ")}$ 处与 $x$ 轴相交或相切；在右端它位于 $x$ 轴${g(to) > 0 ? "上方" : "下方"}。`,
    ),
  };
}

/** distinctRoots chooses n integer roots in [-4, 4], at least two apart. */
function distinctRoots(rng: Rng, n: number): number[] {
  for (;;) {
    const roots = rng.sample([-4, -3, -2, -1, 0, 1, 2, 3, 4], n).sort((a, b) => a - b);
    if (roots.every((r, i) => i === 0 || r - roots[i - 1]! >= 2)) return roots;
  }
}

/** signIntervals lists the intervals between simple roots where s·∏(x − r) has the given sign. */
function signIntervals(roots: readonly number[], s: number, positive: boolean): string[] {
  const ends = [undefined, ...roots, undefined];
  const out: string[] = [];
  for (let i = 0; i < ends.length - 1; i++) {
    const sign = s * ((roots.length - i) % 2 === 0 ? 1 : -1);
    if (sign > 0 === positive) out.push(open(ends[i], ends[i + 1]));
  }
  return out;
}

/** sketchingTheDerivativeOfAFunctionFromTheFunctionsGraph reads the derivative from the graph of a function. */
export const sketchingTheDerivativeOfAFunctionFromTheFunctionsGraph: TopicDef = {
  id: "sketching-the-derivative-of-a-function-from-the-functions-graph",
  title: t("Sketching the Derivative of a Function From the Function's Graph", "由函数图像画出导数"),
  summary: t("Read the slope and the sign of the derivative from the graph of a function.", "由函数图像读出导数的值和符号。"),
  prerequisites: ["using-the-first-derivative-test-to-classify-local-extrema"],
  encompasses: [{ topic: "determining-intervals-on-which-a-function-is-increasing-or-decreasing", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-piecewise-linear-graphs",
      title: t("Derivatives of piecewise linear graphs", "分段线性图像的导数"),
      explanation: t(
        "On a straight piece of a graph the derivative is constant and equal to the slope of the piece, $\\frac{\\Delta y}{\\Delta x}$. So the graph of $f'$ is a horizontal step on each piece, with a jump (and no derivative) at each corner.",
        "在图像的直线段上，导数是常数，等于该段的斜率 $\\frac{\\Delta y}{\\Delta x}$。所以 $f'$ 的图像在每一段上是水平的台阶，在每个折点处跳跃（导数不存在）。",
      ),
      generate(rng) {
        const ys = zigzag(rng, true);
        const i = rng.int(0, zigzagXs.length - 2);
        const x = zigzagXs[i]! + 1;
        const dy = ys[i + 1]! - ys[i]!;
        const answer = Q.of(dy, 2);
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ on $[-6, 6]$ is shown. Find $f'(${x})$.`, `图中是 $f$ 在 $[-6, 6]$ 上的图像。求 $f'(${x})$。`),
            answer,
            wrong: [Q.of(ys[i]! + ys[i + 1]!, 2), Q.of(dy), answer.neg()].filter((w) => !w.eq(answer)),
            solution: t(
              `Near $x = ${x}$ the graph is the segment from $(${zigzagXs[i]}, ${ys[i]})$ to $(${zigzagXs[i + 1]}, ${ys[i + 1]})$, with slope $\\frac{${ys[i + 1]} - ${par(ys[i]!)}}{2} = ${answer.toLatex()}$. So $f'(${x}) = ${answer.toLatex()}$.`,
              `在 $x = ${x}$ 附近，图像是从 $(${zigzagXs[i]}, ${ys[i]})$ 到 $(${zigzagXs[i + 1]}, ${ys[i + 1]})$ 的线段，斜率为 $\\frac{${ys[i + 1]} - ${par(ys[i]!)}}{2} = ${answer.toLatex()}$。所以 $f'(${x}) = ${answer.toLatex()}$。`,
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "the-sign-of-the-derivative-from-a-graph",
      title: t("The sign of the derivative from a graph", "由图像判断导数的符号"),
      explanation: t(
        "Where the graph of $f$ rises, $f' > 0$, so the graph of $f'$ lies above the $x$-axis; where it falls, $f' < 0$. At a smooth peak or valley the tangent is horizontal and $f' = 0$: the graph of $f'$ crosses the axis there.",
        "$f$ 的图像上升的地方 $f' > 0$，$f'$ 的图像位于 $x$ 轴上方；下降的地方 $f' < 0$。在光滑的峰顶或谷底，切线水平，$f' = 0$：$f'$ 的图像在那里穿过 $x$ 轴。",
      ),
      generate(rng) {
        let c = cubic(rng);
        while (c.c2 - c.c1 < 2) c = cubic(rng);
        const positive = rng.bool();
        const { right, wrong } = monotonicityOptions(c, positive);
        const [lo, hi] = c.up ? [c.c2, c.c1] : [c.c1, c.c2];
        return oneOf(
          rng,
          t(
            `The graph of $f$ is shown. On which intervals is $f'(x) ${positive ? ">" : "<"} 0$?`,
            `图中是 $f$ 的图像。$f'(x) ${positive ? ">" : "<"} 0$ 的区间是哪些？`,
          ),
          right,
          wrong,
          t(
            `$f'(x) ${positive ? ">" : "<"} 0$ where the graph ${positive ? "rises" : "falls"}. The graph turns at $x = ${c.c1}$ and $x = ${c.c2}$, and ${positive ? "rises" : "falls"} on ${right.en}.`,
            `$f'(x) ${positive ? ">" : "<"} 0$ 的地方图像${positive ? "上升" : "下降"}。图像在 $x = ${c.c1}$ 和 $x = ${c.c2}$ 处转向，在 ${right["zh-CN"]} 上${positive ? "上升" : "下降"}。`,
          ),
          smoothFigure(
            (x) => pAt(c.p, x),
            c.c1 - 2,
            c.c2 + 2,
            t(
              `The graph of $f$, a smooth curve with a local maximum at $x = ${hi}$ and a local minimum at $x = ${lo}$.`,
              `$f$ 的图像是一条光滑曲线，在 $x = ${hi}$ 处有局部极大值，在 $x = ${lo}$ 处有局部极小值。`,
            ),
          ),
        );
      },
    },
  ],
};

/** interpretingTheGraphOfAFunctionsDerivative reads extrema and monotonicity of f from the graph of f'. */
export const interpretingTheGraphOfAFunctionsDerivative: TopicDef = {
  id: "interpreting-the-graph-of-a-functions-derivative",
  title: t("Interpreting the Graph of a Function's Derivative", "解读导数的图像"),
  summary: t(
    "Find where a function increases, decreases and has local extrema from the graph of its derivative.",
    "由导数的图像确定函数的递增、递减区间和局部极值。",
  ),
  prerequisites: ["sketching-the-derivative-of-a-function-from-the-functions-graph"],
  encompasses: [{ topic: "using-the-first-derivative-test-to-classify-local-extrema", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "local-extrema-from-the-graph-of-the-derivative",
      title: t("Local extrema from the graph of the derivative", "由导数的图像求局部极值"),
      explanation: t(
        "Reading the graph of $f'$, not $f$: $f$ has a local maximum where $f'$ crosses the $x$-axis from above to below, and a local minimum where it crosses from below to above. Where $f'$ only touches the axis, $f'$ keeps its sign and $f$ has no extremum. The peaks and valleys of $f'$ are not extrema of $f$.",
        "读的是 $f'$ 的图像，而不是 $f$ 的：$f'$ 从上方穿过 $x$ 轴到下方的地方，$f$ 有局部极大值；从下方穿到上方的地方，$f$ 有局部极小值。$f'$ 只与 $x$ 轴相切的地方，$f'$ 不变号，$f$ 没有极值。$f'$ 的峰和谷并不是 $f$ 的极值。",
      ),
      generate(rng) {
        for (;;) {
          const simple = distinctRoots(rng, rng.int(2, 3));
          const touch = rng.bool(0.4) ? rng.int(0, simple.length - 1) : -1;
          const roots = simple.flatMap((r, i) => (i === touch ? [r, r] : [r]));
          const s = rng.sign();
          const max = rng.bool();
          const g = (x: number) => s * roots.reduce((p, r) => p * (x - r), 1);
          const at = simple.filter((r) => {
            const [l, rr] = [g(r - 0.5), g(r + 0.5)];
            return max ? l > 0 && rr < 0 : l < 0 && rr > 0;
          });
          if (at.length === 0) continue;
          const other = simple.filter((r) => !at.includes(r));
          return {
            ...solutionsProblem({
              prompt: t(
                `The graph of $f'$, the derivative of $f$, is shown. Find the $x$-coordinates of the local ${max ? "maxima" : "minima"} of $f$.`,
                `图中是 $f$ 的导数 $f'$ 的图像。求 $f$ 的局部${max ? "极大值" : "极小值"}点的 $x$ 坐标。`,
              ),
              values: at.map(String),
              wrong: [simple.map(String), ...(other.length > 0 ? [other.map(String)] : [])],
              solution: t(
                `$f'$ changes from ${max ? "positive to negative" : "negative to positive"} at $x = ${at.join(", ")}$, so $f$ has a local ${max ? "maximum" : "minimum"} at ${at.length === 1 ? "this point" : "each of them"}.${touch >= 0 ? ` At $x = ${simple[touch]}$ the graph of $f'$ only touches the axis, so $f$ has no extremum there.` : ""}`,
                `$f'$ 在 $x = ${at.join(", ")}$ 处${max ? "由正变负" : "由负变正"}，所以 $f$ 在${at.length === 1 ? "该点" : "这些点"}处有局部${max ? "极大值" : "极小值"}。${touch >= 0 ? `在 $x = ${simple[touch]}$ 处 $f'$ 的图像只与 $x$ 轴相切，所以 $f$ 在那里没有极值。` : ""}`,
              ),
            }),
            figure: productFigure(roots, s, "f'"),
          };
        }
      },
    },
    {
      id: "monotonicity-from-the-graph-of-the-derivative",
      title: t("Monotonicity from the graph of the derivative", "由导数的图像判断单调性"),
      explanation: t(
        "$f$ is increasing where the graph of $f'$ lies above the $x$-axis and decreasing where it lies below. Whether $f'$ itself rises or falls does not matter here.",
        "$f'$ 的图像在 $x$ 轴上方的地方 $f$ 递增，在下方的地方 $f$ 递减。这里 $f'$ 本身是上升还是下降无关紧要。",
      ),
      generate(rng) {
        const roots = distinctRoots(rng, rng.int(2, 3));
        const s = rng.sign();
        const increasing = rng.bool();
        const right = intervals(...signIntervals(roots, s, increasing));
        const wrong = [
          intervals(...signIntervals(roots, s, !increasing)),
          intervals(open(roots[0], undefined)),
          intervals(open(undefined, roots[roots.length - 1])),
        ].filter((w) => w.en !== right.en);
        return oneOf(
          rng,
          t(
            `The graph of $f'$, the derivative of $f$, is shown. On which intervals is $f$ ${increasing ? "increasing" : "decreasing"}?`,
            `图中是 $f$ 的导数 $f'$ 的图像。$f$ 在哪些区间上${increasing ? "递增" : "递减"}？`,
          ),
          right,
          wrong,
          t(
            `$f$ is ${increasing ? "increasing" : "decreasing"} where $f' ${increasing ? "> 0" : "< 0"}$, that is, where the graph of $f'$ is ${increasing ? "above" : "below"} the $x$-axis: ${right.en}.`,
            `$f$ 在 $f' ${increasing ? "> 0" : "< 0"}$ 的地方${increasing ? "递增" : "递减"}，也就是 $f'$ 的图像在 $x$ 轴${increasing ? "上方" : "下方"}的地方：${right["zh-CN"]}。`,
          ),
          productFigure(roots, s, "f'"),
        );
      },
    },
  ],
};

/** interpretingTheGraphOfAFunctionsDerivativeConcavity reads concavity and inflection points of f from the graph of f'. */
export const interpretingTheGraphOfAFunctionsDerivativeConcavity: TopicDef = {
  id: "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection",
  title: t("Interpreting the Graph of a Function's Derivative: Concavity and Points of Inflection", "解读导数的图像：凹凸性与拐点"),
  summary: t(
    "Find where a function is concave up or down and its points of inflection from the graph of its derivative.",
    "由导数的图像确定函数的凹凸区间和拐点。",
  ),
  prerequisites: ["interpreting-the-graph-of-a-functions-derivative", "points-of-inflection"],
  encompasses: [
    { topic: "interpreting-the-graph-of-a-functions-derivative", weight: 0.3 },
    { topic: "intervals-of-concavity", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "inflection-points-from-the-graph-of-the-derivative",
      title: t("Inflection points from the graph of the derivative", "由导数的图像求拐点"),
      explanation: t(
        "$f$ is concave up where $f'$ is increasing and concave down where $f'$ is decreasing. So $f$ has a point of inflection where $f'$ changes from increasing to decreasing or back: at the peaks and valleys of the graph of $f'$, not at its zeros.",
        "$f'$ 递增的地方 $f$ 上凹，$f'$ 递减的地方 $f$ 下凹。所以 $f$ 的拐点在 $f'$ 由递增变为递减或反过来的地方：在 $f'$ 图像的峰和谷处，而不是在它的零点处。",
      ),
      generate(rng) {
        for (;;) {
          const ys = zigzag(rng);
          const at = zigzagXs.slice(1, -1).filter((_, j) => (ys[j + 1]! - ys[j]!) * (ys[j + 2]! - ys[j + 1]!) < 0);
          if (at.length === 0 || at.length === 5) continue;
          const zeros = zigzagXs.filter((_, j) => ys[j] === 0);
          return {
            ...solutionsProblem({
              prompt: t(
                `The graph of $f'$, the derivative of $f$, on $[-6, 6]$ is shown. Find the $x$-coordinates of the points of inflection of $f$ in $(-6, 6)$.`,
                `图中是 $f$ 的导数 $f'$ 在 $[-6, 6]$ 上的图像。求 $f$ 在 $(-6, 6)$ 内拐点的 $x$ 坐标。`,
              ),
              values: at.map(String),
              wrong: [zigzagXs.slice(1, -1).map(String), ...(zeros.length > 0 ? [zeros.map(String)] : [])],
              solution: t(
                `$f'$ switches between increasing and decreasing at $x = ${at.join(", ")}$, where its graph turns. There the concavity of $f$ changes.`,
                `$f'$ 在 $x = ${at.join(", ")}$ 处图像转向，在递增与递减之间切换。$f$ 的凹凸性在这些点改变。`,
              ),
            }),
            figure: zigzagFigure(ys, "f'"),
          };
        }
      },
    },
    {
      id: "concavity-from-a-smooth-graph-of-the-derivative",
      title: t("Concavity from a smooth graph of the derivative", "由光滑的导数图像判断凹凸性"),
      explanation: t(
        "Find where the graph of $f'$ rises: there $f'' > 0$ and $f$ is concave up. Where it falls, $f$ is concave down. The sign of $f'$, above or below the axis, is irrelevant.",
        "找出 $f'$ 的图像上升的地方：那里 $f'' > 0$，$f$ 上凹。下降的地方 $f$ 下凹。$f'$ 在 $x$ 轴上方还是下方与此无关。",
      ),
      generate(rng) {
        let c = cubic(rng);
        while (c.c2 - c.c1 < 2) c = cubic(rng);
        const up = rng.bool();
        const { right, wrong } = monotonicityOptions(c, up);
        const [lo, hi] = c.up ? [c.c2, c.c1] : [c.c1, c.c2];
        return oneOf(
          rng,
          t(
            `The graph of $f'$, the derivative of $f$, is shown. On which intervals is $f$ concave ${up ? "up" : "down"}?`,
            `图中是 $f$ 的导数 $f'$ 的图像。$f$ 在哪些区间上${up ? "上凹" : "下凹"}？`,
          ),
          right,
          wrong,
          t(
            `$f$ is concave ${up ? "up" : "down"} where $f'$ is ${up ? "increasing" : "decreasing"}. The graph of $f'$ turns at $x = ${c.c1}$ and $x = ${c.c2}$ and ${up ? "rises" : "falls"} on ${right.en}.`,
            `$f'$ ${up ? "递增" : "递减"}的地方 $f$ ${up ? "上凹" : "下凹"}。$f'$ 的图像在 $x = ${c.c1}$ 和 $x = ${c.c2}$ 处转向，在 ${right["zh-CN"]} 上${up ? "上升" : "下降"}。`,
          ),
          smoothFigure(
            (x) => pAt(c.p, x),
            c.c1 - 2,
            c.c2 + 2,
            t(
              `The graph of $f'$, a smooth curve with a peak at $x = ${hi}$ and a valley at $x = ${lo}$.`,
              `$f'$ 的图像是一条光滑曲线，在 $x = ${hi}$ 处有峰，在 $x = ${lo}$ 处有谷。`,
            ),
          ),
        );
      },
    },
  ],
};

/** stepXs are the ends of the pieces of step graphs. */
const stepXs = [-6, -4, -2, 0, 2, 4, 6];

/** steps chooses the values of a piecewise constant derivative. */
function stepValues(rng: Rng): number[] {
  return Array.from({ length: stepXs.length - 1 }, () => rng.pick([-3, -2, -1, 1, 2, 3]));
}

/** stepFigure draws a piecewise constant derivative. */
function stepFigure(vs: readonly number[]): Figure {
  const marks: PlaneMark[] = vs.map((v, i) => ({
    kind: "segment" as const,
    a: [stepXs[i]!, v] as const,
    b: [stepXs[i + 1]!, v] as const,
    accent: true,
  }));
  const pieces = vs.map((v, i) => `$${v}$ on $(${stepXs[i]}, ${stepXs[i + 1]})$`);
  const piecesZh = vs.map((v, i) => `在 $(${stepXs[i]}, ${stepXs[i + 1]})$ 上为 $${v}$`);
  return {
    svg: plane({ xMin: -7, xMax: 7, yMin: -4, yMax: 4 }, marks),
    alt: t(`The graph of $f'$, made of horizontal segments: ${pieces.join(", ")}.`, `$f'$ 的图像由水平线段组成：${piecesZh.join("，")}。`),
  };
}

/** stepTotals are the values of f at the ends of the pieces, given f(−6). */
const stepTotals = (vs: readonly number[], y0: number) => {
  const totals = [y0];
  for (const v of vs) totals.push(totals[totals.length - 1]! + 2 * v);
  return totals;
};

/** sketchingAFunctionFromTheGraphOfItsDerivative recovers a function from the graph of its derivative. */
export const sketchingAFunctionFromTheGraphOfItsDerivative: TopicDef = {
  id: "sketching-a-function-from-the-graph-of-its-derivative",
  title: t("Sketching a Function From the Graph of Its Derivative", "由导数的图像画出函数"),
  summary: t("Rebuild a function from the graph of its derivative and a starting value.", "由导数的图像和一个起始值重建函数。"),
  prerequisites: ["interpreting-the-graph-of-a-functions-derivative"],
  encompasses: [{ topic: "interpreting-the-graph-of-a-functions-derivative", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "values-from-a-piecewise-constant-derivative",
      title: t("Values from a piecewise constant derivative", "由分段常数导数求函数值"),
      explanation: t(
        "Where $f'$ is a constant $m$, $f$ is a line of slope $m$: across a piece of width $\\Delta x$, $f$ changes by $m \\, \\Delta x$. Starting from a known value, add these changes piece by piece.",
        "$f'$ 为常数 $m$ 的地方，$f$ 是斜率为 $m$ 的直线：跨过宽度为 $\\Delta x$ 的一段，$f$ 改变 $m \\, \\Delta x$。从已知的值出发，逐段加上这些变化量。",
      ),
      generate(rng) {
        const vs = stepValues(rng);
        const y0 = rng.int(-5, 5);
        const k = rng.int(2, stepXs.length - 1);
        const totals = stepTotals(vs, y0);
        const answer = totals[k]!;
        const changes = vs.slice(0, k).map((v) => `2 \\cdot ${par(v)}`);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f'$, the derivative of a continuous function $f$, is shown, and $f(-6) = ${y0}$. Find $f(${stepXs[k]})$.`,
              `图中是连续函数 $f$ 的导数 $f'$ 的图像，且 $f(-6) = ${y0}$。求 $f(${stepXs[k]})$。`,
            ),
            answer,
            wrong: [answer - y0, y0 + vs.slice(0, k).reduce((a, v) => a + v, 0), totals[k - 1]!].filter((w) => w !== answer),
            solution: t(
              `Each piece has width $2$, so $f(${stepXs[k]}) = ${y0} + ${changes.join(" + ")} = ${answer}$.`,
              `每段宽 $2$，所以 $f(${stepXs[k]}) = ${y0} + ${changes.join(" + ")} = ${answer}$。`,
            ),
          }),
          figure: stepFigure(vs),
        };
      },
    },
    {
      id: "global-extrema-from-the-graph-of-the-derivative",
      title: t("Global extrema from the graph of the derivative", "由导数的图像求全局最值"),
      explanation: t(
        "The candidates for global extrema on $[a, b]$ are the endpoints and the points where $f'$ changes sign. Track how $f$ rises and falls between them to compare the values.",
        "$[a, b]$ 上全局最值的候选点是端点以及 $f'$ 变号的点。追踪 $f$ 在它们之间的升降，比较各处的值。",
      ),
      generate(rng) {
        for (;;) {
          const vs = stepValues(rng);
          const totals = stepTotals(vs, 0);
          const max = rng.bool();
          const best = max ? Math.max(...totals) : Math.min(...totals);
          if (totals.filter((v) => v === best).length > 1) continue;
          const at = stepXs[totals.indexOf(best)]!;
          const local = stepXs.slice(1, -1).filter((_, i) => (max ? vs[i]! > 0 && vs[i + 1]! < 0 : vs[i]! < 0 && vs[i + 1]! > 0));
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f'$, the derivative of a continuous function $f$ on $[-6, 6]$, is shown. At which $x$ does $f$ attain its global ${max ? "maximum" : "minimum"} on $[-6, 6]$?`,
                `图中是 $[-6, 6]$ 上连续函数 $f$ 的导数 $f'$ 的图像。$f$ 在 $[-6, 6]$ 上的全局${max ? "最大值" : "最小值"}在哪个 $x$ 处取得？`,
              ),
              answer: at,
              wrong: [...local, max ? 6 : -6, stepXs[totals.indexOf(max ? Math.min(...totals) : Math.max(...totals))]!].filter(
                (w) => w !== at,
              ),
              solution: t(
                `Measuring from $f(-6)$, the changes $2f'$ over the pieces give the values ${totals.map((v, i) => `$${v}$ at $x = ${stepXs[i]}$`).join(", ")}, relative to $f(-6)$. The ${max ? "largest" : "smallest"} is at $x = ${at}$.`,
                `以 $f(-6)$ 为基准，各段的改变量 $2f'$ 依次给出 ${totals.map((v, i) => `$x = ${stepXs[i]}$ 处为 $${v}$`).join("，")}（相对于 $f(-6)$）。其中${max ? "最大" : "最小"}的在 $x = ${at}$ 处。`,
              ),
            }),
            figure: stepFigure(vs),
          };
        }
      },
    },
  ],
};

/** sketchingAFunctionGivenSomeDerivativeProperties describes graphs from the signs of f' and f''. */
export const sketchingAFunctionGivenSomeDerivativeProperties: TopicDef = {
  id: "sketching-a-function-given-some-derivative-properties",
  title: t("Sketching a Function Given Some Derivative Properties", "由导数的性质画出函数"),
  summary: t("Describe the shape of a graph from the signs of its first and second derivatives.", "由一阶和二阶导数的符号描述图像的形状。"),
  prerequisites: ["interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection", "the-second-derivative-test"],
  encompasses: [
    { topic: "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection", weight: 0.3 },
    { topic: "the-second-derivative-test", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "shapes-from-the-signs-of-the-derivatives",
      title: t("Shapes from the signs of the derivatives", "由导数的符号判断形状"),
      explanation: t(
        "The sign of $f'$ says whether the graph rises or falls; the sign of $f''$ says whether it bends up or down. Together they give four shapes: rising and concave up (getting steeper), rising and concave down (levelling off), falling and concave up (levelling off), and falling and concave down (getting steeper).",
        "$f'$ 的符号决定图像上升还是下降；$f''$ 的符号决定它向上弯还是向下弯。两者合起来有四种形状：上升且上凹（越来越陡），上升且下凹（逐渐平缓），下降且上凹（逐渐平缓），下降且下凹（越来越陡）。",
      ),
      generate(rng) {
        const a = rng.int(-6, 3);
        const b = a + rng.int(1, 5);
        const rising = rng.bool();
        const up = rng.bool();
        const options = [
          t("Increasing and concave up", "递增且上凹"),
          t("Increasing and concave down", "递增且下凹"),
          t("Decreasing and concave up", "递减且上凹"),
          t("Decreasing and concave down", "递减且下凹"),
        ];
        const right = (rising ? 0 : 2) + (up ? 0 : 1);
        return oneOf(
          rng,
          t(
            `On $(${a}, ${b})$, $f'(x) ${rising ? ">" : "<"} 0$ and $f''(x) ${up ? ">" : "<"} 0$. Which describes the graph of $f$ there?`,
            `在 $(${a}, ${b})$ 上，$f'(x) ${rising ? ">" : "<"} 0$ 且 $f''(x) ${up ? ">" : "<"} 0$。下列哪项描述了 $f$ 在该区间上的图像？`,
          ),
          options[right]!,
          options.filter((_, i) => i !== right),
          t(
            `$f' ${rising ? "> 0" : "< 0"}$ means $f$ is ${rising ? "increasing" : "decreasing"}, and $f'' ${up ? "> 0" : "< 0"}$ means it is concave ${up ? "up" : "down"}.`,
            `$f' ${rising ? "> 0" : "< 0"}$ 说明 $f$ ${rising ? "递增" : "递减"}，$f'' ${up ? "> 0" : "< 0"}$ 说明它${up ? "上凹" : "下凹"}。`,
          ),
        );
      },
    },
    {
      id: "extrema-from-derivative-properties",
      title: t("Extrema from derivative properties", "由导数的性质判断极值"),
      explanation: t(
        "A list of properties is enough to place the key features. If $f'(c) = 0$ and $f'$ changes sign at $c$, there is an extremum; if $f'(c) = 0$ and $f''(c) \\ne 0$, the sign of $f''(c)$ decides which. Where $f''$ changes sign, there is a point of inflection.",
        "一组性质就足以确定关键特征。若 $f'(c) = 0$ 且 $f'$ 在 $c$ 处变号，则有极值；若 $f'(c) = 0$ 且 $f''(c) \\ne 0$，则由 $f''(c)$ 的符号决定是哪一种。$f''$ 变号的地方是拐点。",
      ),
      generate(rng) {
        const a = rng.int(-5, 2);
        const b = a + rng.int(2, 4);
        const s = [rng.sign(), rng.sign(), rng.sign()];
        const sign = (v: number) => (v > 0 ? ">" : "<");
        const byFirst = rng.bool();
        const options = [t("A local maximum", "局部极大值"), t("A local minimum", "局部极小值"), t("Neither", "都不是")];
        if (byFirst) {
          const atA = rng.bool();
          const [l, r] = atA ? [s[0]!, s[1]!] : [s[1]!, s[2]!];
          const verdict = l === r ? 2 : l > 0 ? 0 : 1;
          return oneOf(
            rng,
            t(
              `$f$ is differentiable, $f'(${a}) = f'(${b}) = 0$, and $f'(x) ${sign(s[0]!)} 0$ for $x < ${a}$, $f'(x) ${sign(s[1]!)} 0$ for $${a} < x < ${b}$, and $f'(x) ${sign(s[2]!)} 0$ for $x > ${b}$. What does $f$ have at $x = ${atA ? a : b}$?`,
              `$f$ 可导，$f'(${a}) = f'(${b}) = 0$，且当 $x < ${a}$ 时 $f'(x) ${sign(s[0]!)} 0$，当 $${a} < x < ${b}$ 时 $f'(x) ${sign(s[1]!)} 0$，当 $x > ${b}$ 时 $f'(x) ${sign(s[2]!)} 0$。$f$ 在 $x = ${atA ? a : b}$ 处有什么？`,
            ),
            options[verdict]!,
            options.filter((_, i) => i !== verdict),
            t(
              `$f'$ is ${l > 0 ? "positive" : "negative"} just left of $${atA ? a : b}$ and ${r > 0 ? "positive" : "negative"} just right of it, so ${verdict === 2 ? "there is no extremum" : `$f$ has a local ${verdict === 0 ? "maximum" : "minimum"}`}.`,
              `$f'$ 在 $${atA ? a : b}$ 左侧为${l > 0 ? "正" : "负"}，右侧为${r > 0 ? "正" : "负"}，所以${verdict === 2 ? "没有极值" : `$f$ 有局部${verdict === 0 ? "极大值" : "极小值"}`}。`,
            ),
          );
        }
        const f2 = rng.nonZero(-5, 5);
        const verdict = f2 < 0 ? 0 : 1;
        return oneOf(
          rng,
          t(
            `$f$ is twice differentiable, $f'(${a}) = 0$ and $f''(${a}) = ${f2}$. What does $f$ have at $x = ${a}$?`,
            `$f$ 二阶可导，$f'(${a}) = 0$，$f''(${a}) = ${f2}$。$f$ 在 $x = ${a}$ 处有什么？`,
          ),
          options[verdict]!,
          options.filter((_, i) => i !== verdict),
          t(
            `The tangent is horizontal at $x = ${a}$ and $f''(${a}) ${f2 < 0 ? "< 0" : "> 0"}$, so the graph is concave ${f2 < 0 ? "down" : "up"} there: a local ${f2 < 0 ? "maximum" : "minimum"} by the second derivative test.`,
            `在 $x = ${a}$ 处切线水平，且 $f''(${a}) ${f2 < 0 ? "< 0" : "> 0"}$，图像在那里${f2 < 0 ? "下凹" : "上凹"}：由二阶导数检验法，是局部${f2 < 0 ? "极大值" : "极小值"}。`,
          ),
        );
      },
    },
  ],
};

/** linLatex writes m·(x − a) + b expanded as a linear expression. */
const linLatex = (m: Q, a: Q, b: Q) => poly([m, "x"], [b.sub(m.mul(a)), ""]) || "0";

/** Linearizable is a function with its value and derivative at a point. */
interface Linearizable {
  readonly f: string;
  readonly a: string;
  readonly fa: string;
  readonly da: string;
  readonly answer: string;
  readonly wrong: readonly string[];
}

/** linearizable chooses a function and a point at which to linearize it. */
function linearizable(rng: Rng): Linearizable {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const p: Poly = [rng.int(-6, 6), rng.int(-5, 5), rng.nonZero(-3, 3), rng.int(-1, 1)];
    const a = rng.nonZero(-3, 3);
    const [fa, da] = [pAt(p, a), pAt(pDer(p), a)];
    return {
      f: pLatex(p),
      a: String(a),
      fa: String(fa),
      da: String(da),
      answer: linLatex(Q.of(da), Q.of(a), Q.of(fa)),
      wrong: [linLatex(Q.of(da), Q.zero, Q.of(fa)), linLatex(Q.of(da), Q.of(a), Q.zero)],
    };
  }
  if (kind === 1) {
    const s = rng.int(1, 9);
    const m = Q.of(1, 2 * s);
    return {
      f: "\\sqrt{x}",
      a: String(s * s),
      fa: String(s),
      da: m.toLatex(),
      answer: linLatex(m, Q.of(s * s), Q.of(s)),
      wrong: [linLatex(m, Q.zero, Q.of(s)), linLatex(Q.of(1, s), Q.of(s * s), Q.of(s))],
    };
  }
  if (kind === 2) {
    const a = rng.nonZero(-5, 5);
    const k = rng.int(1, 6);
    const fa = Q.of(k, a);
    const m = Q.of(-k, a * a);
    return {
      f: `\\frac{${k}}{x}`,
      a: String(a),
      fa: fa.toLatex(),
      da: m.toLatex(),
      answer: linLatex(m, Q.of(a), fa),
      wrong: [linLatex(m.neg(), Q.of(a), fa), linLatex(m, Q.zero, fa)],
    };
  }
  if (kind === 3) {
    const k = rng.nonZero(-6, 6);
    const c = rng.int(1, 9);
    return {
      f: `${c}e^{${poly([k, "x"])}}`,
      a: "0",
      fa: String(c),
      da: String(c * k),
      answer: linLatex(Q.of(c * k), Q.zero, Q.of(c)),
      wrong: [linLatex(Q.of(k), Q.zero, Q.of(c)), linLatex(Q.of(c), Q.zero, Q.of(c))],
    };
  }
  const k = rng.int(1, 6);
  return {
    f: `${k === 1 ? "" : k}\\ln x`,
    a: "1",
    fa: "0",
    da: String(k),
    answer: linLatex(Q.of(k), Q.one, Q.zero),
    wrong: [linLatex(Q.of(k), Q.zero, Q.zero), linLatex(Q.one, Q.one, Q.zero)],
  };
}

/** approximatingFunctionsUsingLocalLinearityAndLinearization linearizes functions to approximate them. */
export const approximatingFunctionsUsingLocalLinearityAndLinearization: TopicDef = {
  id: "approximating-functions-using-local-linearity-and-linearization",
  title: t("Approximating Functions Using Local Linearity and Linearization", "用局部线性与线性化近似函数"),
  summary: t(
    "Find the linearization of a function at a point, use it to estimate values, and tell whether the estimate is too big or too small.",
    "求函数在某点的线性化，用它估计函数值，并判断估计偏大还是偏小。",
  ),
  prerequisites: ["calculating-the-equation-of-a-tangent-line-using-differentiation", "relating-concavity-to-the-second-derivative"],
  encompasses: [{ topic: "calculating-the-equation-of-a-tangent-line-using-differentiation", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-a-linearization",
      title: t("Finding a linearization", "求线性化"),
      explanation: t(
        "Near $x = a$ the graph of a differentiable function looks like its tangent line. The linearization of $f$ at $a$ is that line:\n\n$$L(x) = f(a) + f'(a)(x - a).$$",
        "在 $x = a$ 附近，可导函数的图像看起来就像它的切线。$f$ 在 $a$ 处的线性化就是这条切线：\n\n$$L(x) = f(a) + f'(a)(x - a)。$$",
      ),
      generate(rng) {
        const L = linearizable(rng);
        return functionProblem({
          prompt: t(
            `Find the linearization $L(x)$ of $f(x) = ${L.f}$ at $a = ${L.a}$.`,
            `求 $f(x) = ${L.f}$ 在 $a = ${L.a}$ 处的线性化 $L(x)$。`,
          ),
          prefix: "L(x) =",
          answer: L.answer,
          wrong: L.wrong,
          solution: t(
            `$f(${L.a}) = ${L.fa}$ and $f'(${L.a}) = ${L.da}$, so $L(x) = ${L.fa} + ${L.da.startsWith("-") ? `(${L.da})` : L.da}(x - ${par(Number(L.a))}) = ${L.answer}$.`,
            `$f(${L.a}) = ${L.fa}$，$f'(${L.a}) = ${L.da}$，所以 $L(x) = ${L.fa} + ${L.da.startsWith("-") ? `(${L.da})` : L.da}(x - ${par(Number(L.a))}) = ${L.answer}$。`,
          ),
        });
      },
    },
    {
      id: "estimating-values-with-a-linearization",
      title: t("Estimating values with a linearization", "用线性化估计函数值"),
      explanation: t(
        "Near a point, a curve is close to its tangent line, so the tangent line gives a good estimate of values a small step away. To estimate $f(a + h)$ for small $h$, use $f(a + h) \\approx f(a) + f'(a) \\, h$. Only the value and the derivative at $a$ are needed.",
        "在一点附近，曲线与它的切线很接近，所以切线可以很好地估计稍微偏离该点处的函数值。当 $h$ 很小时，用 $f(a + h) \\approx f(a) + f'(a) \\, h$ 估计 $f(a + h)$。只需要 $a$ 处的函数值和导数。",
      ),
      generate(rng) {
        const a = rng.int(-5, 8);
        const fa = rng.int(-20, 20);
        const da = rng.nonZero(-9, 9);
        const h = Q.of(rng.nonZero(-9, 9), rng.pick([10, 100]));
        const x = Q.of(a).add(h);
        const answer = Q.of(fa).add(Q.of(da).mul(h));
        return numberProblem({
          prompt: t(
            `$f(${a}) = ${fa}$ and $f'(${a}) = ${da}$. Use a linearization to estimate $f(${x.toNumber()})$.`,
            `$f(${a}) = ${fa}$，$f'(${a}) = ${da}$。用线性化估计 $f(${x.toNumber()})$。`,
          ),
          answer,
          form: "decimal",
          wrong: [Q.of(fa).add(Q.of(da).mul(x)), Q.of(fa).sub(Q.of(da).mul(h)), Q.of(fa + da)],
          solution: t(
            `$f(${x.toNumber()}) \\approx f(${a}) + f'(${a})(${x.toNumber()} - ${par(a)}) = ${fa} + ${par(da)}(${h.toNumber()}) = ${answer.toNumber()}$.`,
            `$f(${x.toNumber()}) \\approx f(${a}) + f'(${a})(${x.toNumber()} - ${par(a)}) = ${fa} + ${par(da)}(${h.toNumber()}) = ${answer.toNumber()}$。`,
          ),
        });
      },
    },
    {
      id: "over-and-underestimates",
      title: t("Overestimates and underestimates", "估计偏大还是偏小"),
      explanation: t(
        "Where $f$ is concave up, the graph lies above its tangent lines, so a linearization underestimates $f$. Where $f$ is concave down, the graph lies below them and the linearization overestimates.",
        "$f$ 上凹的地方，图像在切线上方，所以线性化低估 $f$。$f$ 下凹的地方，图像在切线下方，线性化高估 $f$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const a = rng.int(1, 9);
        const [f, f2, sign] =
          kind === 0
            ? [`\\sqrt{x}`, "-\\frac{1}{4}x^{-\\frac{3}{2}}", -1]
            : kind === 1
              ? [`e^{${poly([rng.nonZero(-4, 4), "x"])}}`, "a positive multiple of $f(x)$", 1]
              : kind === 2
                ? [`\\ln x`, "-\\frac{1}{x^{2}}", -1]
                : [`x^{${rng.int(2, 5)}}`, "", 1];
        const x0 = kind === 0 ? a * a : a;
        const options = [t("An overestimate", "偏大"), t("An underestimate", "偏小")];
        const right = sign < 0 ? 0 : 1;
        const f2Text =
          kind === 1
            ? t(`$f''(x)$ is ${f2}, which is positive`, `$f''(x)$ 是 $f(x)$ 的正数倍，为正`)
            : kind === 3
              ? t(
                  `$f''(x)$ is a positive multiple of a power of $x$, positive for $x > 0$`,
                  `$f''(x)$ 是 $x$ 的幂的正数倍，当 $x > 0$ 时为正`,
                )
              : t(`$f''(x) = ${f2}$, which is negative for $x > 0$`, `$f''(x) = ${f2}$，当 $x > 0$ 时为负`);
        const dx = rng.pick([-1, 1]) * rng.pick([1, 2, 5]);
        const near = Q.of(x0 * 10 + dx, 10).toNumber();
        return oneOf(
          rng,
          t(
            `The linearization of $f(x) = ${f}$ at $a = ${x0}$ is used to estimate $f(${near})$. Is the estimate an overestimate or an underestimate?`,
            `用 $f(x) = ${f}$ 在 $a = ${x0}$ 处的线性化估计 $f(${near})$。这个估计值偏大还是偏小？`,
          ),
          options[right]!,
          [options[1 - right]!],
          t(
            `${f2Text.en}, so $f$ is concave ${sign < 0 ? "down and lies below" : "up and lies above"} its tangent lines: the estimate is ${sign < 0 ? "an overestimate" : "an underestimate"}.`,
            `${f2Text["zh-CN"]}，所以 $f$ ${sign < 0 ? "下凹，图像在切线下方" : "上凹，图像在切线上方"}：估计值${sign < 0 ? "偏大" : "偏小"}。`,
          ),
        );
      },
    },
  ],
};

/** approximatingTheRootsOfANumberUsingLocalLinearity estimates roots with linearizations. */
export const approximatingTheRootsOfANumberUsingLocalLinearity: TopicDef = {
  id: "approximating-the-roots-of-a-number-using-local-linearity",
  title: t("Approximating the Roots of a Number Using Local Linearity", "用局部线性近似数的方根"),
  summary: t(
    "Estimate square roots, cube roots and powers near known values with a linearization.",
    "用线性化估计已知值附近的平方根、立方根和幂。",
  ),
  prerequisites: ["approximating-functions-using-local-linearity-and-linearization"],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.5 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "approximating-square-roots",
      title: t("Approximating square roots", "近似平方根"),
      explanation: t(
        "Choose the perfect square nearest to the number, because the tangent line estimate is most accurate when the step from the known point is small. To estimate $\\sqrt{n}$, linearize $f(x) = \\sqrt{x}$ at the nearest perfect square $a^{2}$: $f'(a^{2}) = \\frac{1}{2a}$, so $\\sqrt{a^{2} + h} \\approx a + \\frac{h}{2a}$. For $\\sqrt{26}$: $5 + \\frac{1}{10} = 5.1$.",
        "选择离这个数最近的完全平方数，因为离已知点的步长越小，切线估计就越准确。估计 $\\sqrt{n}$ 时，把 $f(x) = \\sqrt{x}$ 在最近的完全平方数 $a^{2}$ 处线性化：$f'(a^{2}) = \\frac{1}{2a}$，所以 $\\sqrt{a^{2} + h} \\approx a + \\frac{h}{2a}$。对 $\\sqrt{26}$：$5 + \\frac{1}{10} = 5.1$。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const h = rng.nonZero(-3, 3);
        const n = a * a + h;
        const answer = Q.of(a).add(Q.of(h, 2 * a));
        return numberProblem({
          prompt: t(
            `Use a linearization of $\\sqrt{x}$ at a perfect square to estimate $\\sqrt{${n}}$. Give the exact value of the estimate.`,
            `用 $\\sqrt{x}$ 在某个完全平方数处的线性化估计 $\\sqrt{${n}}$。给出估计值的精确值。`,
          ),
          answer,
          wrong: [Q.of(a).add(Q.of(h, a)), Q.of(a).add(Q.of(h, 2)), Q.of(a).sub(Q.of(h, 2 * a))],
          solution: t(
            `Linearize at $${a * a}$: $\\sqrt{${n}} \\approx \\sqrt{${a * a}} + \\frac{1}{2\\sqrt{${a * a}}}(${n} - ${a * a}) = ${a} ${h < 0 ? "-" : "+"} \\frac{${Math.abs(h)}}{${2 * a}} = ${answer.toLatex()}$.`,
            `在 $${a * a}$ 处线性化：$\\sqrt{${n}} \\approx \\sqrt{${a * a}} + \\frac{1}{2\\sqrt{${a * a}}}(${n} - ${a * a}) = ${a} ${h < 0 ? "-" : "+"} \\frac{${Math.abs(h)}}{${2 * a}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "approximating-cube-roots-and-powers",
      title: t("Approximating cube roots and powers", "近似立方根和幂"),
      explanation: t(
        "Pick a nearby point where the root or power is easy to compute exactly, and use the derivative there to adjust for the small difference. The same idea works for any power. $\\sqrt[3]{a^{3} + h} \\approx a + \\frac{h}{3a^{2}}$, and $(a + h)^{n} \\approx a^{n} + na^{n - 1}h$. For $(2.01)^{5}$: $32 + 80(0.01) = 32.8$.",
        "选一个附近的、根或幂容易精确算出的点，再用该点的导数修正这个小差别。同样的思路适用于任何幂。$\\sqrt[3]{a^{3} + h} \\approx a + \\frac{h}{3a^{2}}$，$(a + h)^{n} \\approx a^{n} + na^{n - 1}h$。对 $(2.01)^{5}$：$32 + 80(0.01) = 32.8$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = rng.int(2, 5);
          const h = rng.nonZero(-4, 4);
          const n = a ** 3 + h;
          const answer = Q.of(a).add(Q.of(h, 3 * a * a));
          return numberProblem({
            prompt: t(
              `Use a linearization of $\\sqrt[3]{x}$ at a perfect cube to estimate $\\sqrt[3]{${n}}$. Give the exact value of the estimate.`,
              `用 $\\sqrt[3]{x}$ 在某个完全立方数处的线性化估计 $\\sqrt[3]{${n}}$。给出估计值的精确值。`,
            ),
            answer,
            wrong: [Q.of(a).add(Q.of(h, 3 * a)), Q.of(a).add(Q.of(h, 2 * a)), Q.of(a).sub(Q.of(h, 3 * a * a))],
            solution: t(
              `$f(x) = \\sqrt[3]{x}$ has $f'(x) = \\frac{1}{3x^{2/3}}$, so $f'(${a ** 3}) = \\frac{1}{${3 * a * a}}$ and $\\sqrt[3]{${n}} \\approx ${a} ${h < 0 ? "-" : "+"} \\frac{${Math.abs(h)}}{${3 * a * a}} = ${answer.toLatex()}$.`,
              `$f(x) = \\sqrt[3]{x}$ 的导数为 $f'(x) = \\frac{1}{3x^{2/3}}$，所以 $f'(${a ** 3}) = \\frac{1}{${3 * a * a}}$，$\\sqrt[3]{${n}} \\approx ${a} ${h < 0 ? "-" : "+"} \\frac{${Math.abs(h)}}{${3 * a * a}} = ${answer.toLatex()}$。`,
            ),
          });
        }
        const a = rng.int(1, 3);
        const n = rng.int(2, a === 1 ? 9 : a === 2 ? 6 : 4);
        const h = Q.of(rng.nonZero(-3, 3), 100);
        const answer = Q.of(a ** n).add(Q.of(n * a ** (n - 1)).mul(h));
        const x = Q.of(a).add(h);
        return numberProblem({
          prompt: t(
            `Use a linearization of $x^{${n}}$ at $x = ${a}$ to estimate $(${x.toNumber()})^{${n}}$.`,
            `用 $x^{${n}}$ 在 $x = ${a}$ 处的线性化估计 $(${x.toNumber()})^{${n}}$。`,
          ),
          answer,
          form: "decimal",
          wrong: [
            Q.of(a ** n).add(Q.of(a ** (n - 1)).mul(h)),
            Q.of(a ** n).add(Q.of(n).mul(h)),
            Q.of(a ** n).sub(Q.of(n * a ** (n - 1)).mul(h)),
          ],
          solution: t(
            `$f'(x) = ${n}x${n === 2 ? "" : `^{${n - 1}}`}$, so $f'(${a}) = ${n * a ** (n - 1)}$ and $(${x.toNumber()})^{${n}} \\approx ${a ** n} + ${n * a ** (n - 1)}(${h.toNumber()}) = ${answer.toNumber()}$.`,
            `$f'(x) = ${n}x${n === 2 ? "" : `^{${n - 1}}`}$，所以 $f'(${a}) = ${n * a ** (n - 1)}$，$(${x.toNumber()})^{${n}} \\approx ${a ** n} + ${n * a ** (n - 1)}(${h.toNumber()}) = ${answer.toNumber()}$。`,
          ),
        });
      },
    },
  ],
};

/** BaseAngle is a special angle in degrees with its sine and cosine. */
interface BaseAngle {
  readonly deg: number;
  readonly sin: number;
  readonly cos: number;
  readonly sinL: string;
  readonly cosL: string;
}

/** baseAngles are the special angles used to approximate trigonometric values. */
const baseAngles: readonly BaseAngle[] = [
  { deg: 30, sin: 0.5, cos: Math.sqrt(3) / 2, sinL: "\\frac{1}{2}", cosL: "\\frac{\\sqrt{3}}{2}" },
  { deg: 45, sin: Math.SQRT1_2, cos: Math.SQRT1_2, sinL: "\\frac{\\sqrt{2}}{2}", cosL: "\\frac{\\sqrt{2}}{2}" },
  { deg: 60, sin: Math.sqrt(3) / 2, cos: 0.5, sinL: "\\frac{\\sqrt{3}}{2}", cosL: "\\frac{1}{2}" },
];

/** approximatingTrigonometricFunctionsUsingLocalLinearity estimates trigonometric values with linearizations. */
export const approximatingTrigonometricFunctionsUsingLocalLinearity: TopicDef = {
  id: "approximating-trigonometric-functions-using-local-linearity",
  title: t("Approximating Trigonometric Functions Using Local Linearity", "用局部线性近似三角函数"),
  summary: t(
    "Estimate trigonometric values near zero and near special angles with linearizations.",
    "用线性化估计零附近和特殊角附近的三角函数值。",
  ),
  prerequisites: ["approximating-functions-using-local-linearity-and-linearization"],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.5 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "small-angle-approximations",
      title: t("Small angle approximations", "小角近似"),
      explanation: t(
        "Near zero, the graphs of sine and tangent hug the line through the origin with slope one, while cosine stays close to its maximum of one. Linearizing at $0$ gives $\\sin x \\approx x$, $\\tan x \\approx x$ and $\\cos x \\approx 1$ for small $x$ in radians. Near $\\pi$, $\\sin(\\pi + h) \\approx -h$, since $\\sin \\pi = 0$ and $\\cos \\pi = -1$.",
        "在零附近，正弦和正切的图像紧贴着经过原点、斜率为 1 的直线，而余弦则保持在最大值 1 附近。在 $0$ 处线性化，对弧度制下很小的 $x$，有 $\\sin x \\approx x$，$\\tan x \\approx x$，$\\cos x \\approx 1$。在 $\\pi$ 附近，由于 $\\sin \\pi = 0$，$\\cos \\pi = -1$，有 $\\sin(\\pi + h) \\approx -h$。",
      ),
      generate(rng) {
        const h = Q.of(rng.nonZero(-9, 9), rng.pick([100, 1000]));
        const k = rng.int(1, 9);
        const c = rng.int(-5, 5);
        const kind = rng.int(0, 2);
        const fn = kind === 0 ? "\\sin" : kind === 1 ? "\\tan" : "\\cos";
        const linear = kind === 2 ? Q.zero : Q.of(k).mul(h);
        const answer = Q.of(c).add(kind === 2 ? Q.of(k) : linear);
        const expr = `${k === 1 ? "" : k}${fn}(${h.toNumber()})${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
        return numberProblem({
          prompt: t(
            `Use a linearization at $0$ to estimate $${expr}$, where the angle is in radians.`,
            `用在 $0$ 处的线性化估计 $${expr}$（角为弧度制）。`,
          ),
          answer,
          form: "decimal",
          wrong: kind === 2 ? [Q.of(c), Q.of(c).add(Q.of(k).mul(h))] : [Q.of(c + k), Q.of(c).sub(linear), Q.of(c)],
          solution: t(
            kind === 2
              ? `Near $0$, $\\cos x \\approx 1$, since $\\cos 0 = 1$ and its derivative $-\\sin x$ is $0$ at $0$. So the estimate is $${k} + ${par(c)} = ${answer.toNumber()}$.`
              : `$${fn} x \\approx x$ near $0$, so the estimate is $${k} \\cdot ${h.sign() < 0 ? `(${h.toNumber()})` : String(h.toNumber())} + ${par(c)} = ${answer.toNumber()}$.`,
            kind === 2
              ? `由于 $\\cos 0 = 1$，且其导数 $-\\sin x$ 在 $0$ 处为 $0$，在 $0$ 附近 $\\cos x \\approx 1$。所以估计值为 $${k} + ${par(c)} = ${answer.toNumber()}$。`
              : `在 $0$ 附近 $${fn} x \\approx x$，所以估计值为 $${k} \\cdot ${h.sign() < 0 ? `(${h.toNumber()})` : String(h.toNumber())} + ${par(c)} = ${answer.toNumber()}$。`,
          ),
        });
      },
    },
    {
      id: "approximations-near-special-angles",
      title: t("Approximations near special angles", "特殊角附近的近似"),
      explanation: t(
        "To estimate $\\sin 31^{\\circ}$, linearize $\\sin x$ at $30^{\\circ} = \\frac{\\pi}{6}$, and convert the step to radians: $1^{\\circ} = \\frac{\\pi}{180}$. Then $\\sin 31^{\\circ} \\approx \\sin \\frac{\\pi}{6} + \\cos \\frac{\\pi}{6} \\cdot \\frac{\\pi}{180} = \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\pi}{180} \\approx 0.515$. The derivative formulas only hold in radians.",
        "估计 $\\sin 31^{\\circ}$ 时，把 $\\sin x$ 在 $30^{\\circ} = \\frac{\\pi}{6}$ 处线性化，并把步长换成弧度：$1^{\\circ} = \\frac{\\pi}{180}$。于是 $\\sin 31^{\\circ} \\approx \\sin \\frac{\\pi}{6} + \\cos \\frac{\\pi}{6} \\cdot \\frac{\\pi}{180} = \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\pi}{180} \\approx 0.515$。求导公式只在弧度制下成立。",
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick(baseAngles);
          const d = rng.nonZero(-3, 3);
          const sine = rng.bool();
          const step = (d * Math.PI) / 180;
          const [v, dv, vL, dvL] = sine ? [b.sin, b.cos, b.sinL, b.cosL] : [b.cos, -b.sin, b.cosL, `-${b.sinL}`];
          const answer = rounded(v + dv * step, 3);
          const noRadians = rounded(v + dv * d, 3);
          if (!answer || !noRadians) continue;
          const fn = sine ? "\\sin" : "\\cos";
          return numberProblem({
            prompt: t(
              `Use a linearization at $${b.deg}^{\\circ}$ to estimate $${fn} ${b.deg + d}^{\\circ}$. Round to three decimal places.`,
              `用在 $${b.deg}^{\\circ}$ 处的线性化估计 $${fn} ${b.deg + d}^{\\circ}$，精确到三位小数。`,
            ),
            answer,
            form: "decimal",
            wrong: [noRadians, rounded(v - dv * step, 3) ?? noRadians],
            solution: t(
              `In radians the step is $${d} \\cdot \\frac{\\pi}{180}$. The derivative of $${fn} x$ is $${sine ? "\\cos x" : "-\\sin x"}$, so $${fn} ${b.deg + d}^{\\circ} \\approx ${vL} + \\left(${dvL}\\right)\\left(${d} \\cdot \\frac{\\pi}{180}\\right) \\approx ${answer.toNumber()}$.`,
              `换成弧度，步长为 $${d} \\cdot \\frac{\\pi}{180}$。$${fn} x$ 的导数为 $${sine ? "\\cos x" : "-\\sin x"}$，所以 $${fn} ${b.deg + d}^{\\circ} \\approx ${vL} + \\left(${dvL}\\right)\\left(${d} \\cdot \\frac{\\pi}{180}\\right) \\approx ${answer.toNumber()}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** calculusICurveTopics are the topics of Calculus I modules 7.19 and 7.20. */
export const calculusICurveTopics: readonly TopicDef[] = [
  sketchingTheDerivativeOfAFunctionFromTheFunctionsGraph,
  interpretingTheGraphOfAFunctionsDerivative,
  interpretingTheGraphOfAFunctionsDerivativeConcavity,
  sketchingAFunctionFromTheGraphOfItsDerivative,
  sketchingAFunctionGivenSomeDerivativeProperties,
  approximatingFunctionsUsingLocalLinearityAndLinearization,
  approximatingTheRootsOfANumberUsingLocalLinearity,
  approximatingTrigonometricFunctionsUsingLocalLinearity,
];
