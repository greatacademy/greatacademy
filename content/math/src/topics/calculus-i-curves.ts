import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { functionProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf, type Poly, pAt, par, pDer, pLatex, rounded, table } from "./calculus-common.ts";
import { type Cubic, cubic, factor, intervals, monotonicityOptions, open, zigzag, zigzagFigure, zigzagXs } from "./calculus-i-extrema.ts";

// Calculus I unit 7: Analytical Applications of Differentiation, modules 7.19 and 7.20.

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

/** fmt writes a value rounded to the given number of decimal places, without trailing zeros. */
const fmt = (v: number, places = 4) => dec(Q.of(Math.round(v * 10 ** places) || 0, 10 ** places));

/** pd writes a decimal, in parentheses when it is negative. */
const pd = (q: Q) => (q.sign() < 0 ? `(${dec(q)})` : dec(q));

/** pq writes a rational in LaTeX, in sized parentheses when it is negative. */
const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** plusTerm writes + c or − |c| after an expression, or nothing when c is 0. */
const plusTerm = (c: number | Q) => {
  const q = c instanceof Q ? c : Q.of(c);
  return q.sign() === 0 ? "" : q.sign() > 0 ? ` + ${q.toLatex()}` : ` - ${q.neg().toLatex()}`;
};

/** signName names the sign of a number. */
const signName = (v: number): Text => (v > 0 ? t("positive", "正") : t("negative", "负"));

/** wideCubic chooses a cubic whose critical points are at least two apart. */
function wideCubic(rng: Rng): Cubic {
  for (let i = 0; i < 40; i++) {
    const c = cubic(rng);
    if (c.c2 - c.c1 >= 2) return c;
  }
  return { p: [0, -3, 0, 1], c1: -1, c2: 1, up: true };
}

/** testPoint is an integer inside the first interval of a choice made by monotonicityOptions. */
const testPoint = (c: Cubic, middle: boolean) => (middle ? c.c1 + 1 : c.c2 + 1);

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

/** rootSets lists the sets of n integer roots in [-4, 4], at least two apart. */
function rootSets(n: number): number[][] {
  const out: number[][] = [];
  const grow = (from: number, acc: readonly number[]) => {
    if (acc.length === n) {
      out.push([...acc]);
      return;
    }
    for (let r = from; r <= 4; r++) grow(r + 2, [...acc, r]);
  };
  grow(-4, []);
  return out;
}

/** distinctRoots chooses n integer roots in [-4, 4], at least two apart. */
function distinctRoots(rng: Rng, n: number): number[] {
  return [...rng.pick(rootSets(n))];
}

/** Piece is an interval between consecutive simple roots of s·∏(x − r), with an integer inside it and the sign there. */
interface Piece {
  readonly text: string;
  readonly at: number;
  readonly positive: boolean;
}

/** pieces splits the line at the simple roots of s·∏(x − r). */
function pieces(roots: readonly number[], s: number): Piece[] {
  const ends = [undefined, ...roots, undefined];
  return roots.concat([0]).map((_, i) => {
    const [lo, hi] = [ends[i], ends[i + 1]];
    return {
      text: open(lo, hi),
      at: lo === undefined ? hi! - 1 : lo + 1,
      positive: s * ((roots.length - i) % 2 === 0 ? 1 : -1) > 0,
    };
  });
}

/** signIntervals lists the intervals between simple roots where s·∏(x − r) has the given sign. */
function signIntervals(roots: readonly number[], s: number, positive: boolean): string[] {
  return pieces(roots, s)
    .filter((p) => p.positive === positive)
    .map((p) => p.text);
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
  intro: t(
    `The first derivative test reads the sign of $f'$ to tell where $f$ rises and falls. Turned around, the graph of $f$ tells us the sign of $f'$. The graph of $f(x) = x^{2} - 4x$ falls until its vertex $(2, -4)$ and rises after it, so $f' < 0$ for $x < 2$, $f'(2) = 0$ and $f' > 0$ for $x > 2$.

Check: $f'(x) = 2x - 4$, and $f'(0) = -4$ is negative while $f'(3) = 2$ is positive.

In this lesson we read the value and the sign of $f'$ straight from the graph of $f$, for graphs made of line segments and for smooth curves.`,
    `一阶导数检验法通过 $f'$ 的符号判断 $f$ 在哪里上升、在哪里下降。反过来，$f$ 的图像也告诉我们 $f'$ 的符号。$f(x) = x^{2} - 4x$ 的图像在顶点 $(2, -4)$ 之前下降，之后上升，所以当 $x < 2$ 时 $f' < 0$，$f'(2) = 0$，当 $x > 2$ 时 $f' > 0$。

检验：$f'(x) = 2x - 4$，$f'(0) = -4$ 为负，而 $f'(3) = 2$ 为正。

这节课我们直接由 $f$ 的图像读出 $f'$ 的值和符号，图像可以由线段组成，也可以是光滑曲线。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-piecewise-linear-graphs",
      figure: calculusDrawings2["sketching-the-derivative-of-a-function-from-the-functions-graph#derivatives-of-piecewise-linear-graphs"],
      title: t("Derivatives of piecewise linear graphs", "分段线性图像的导数"),
      explanation: t(
        "On a straight piece of a graph the derivative is constant and equal to the slope of the piece, $\\frac{\\Delta y}{\\Delta x}$. For the segment from $(-2, 1)$ to $(0, 5)$ the slope is $\\frac{5 - 1}{2}$, which is $2$, so $f'(x) = 2$ for every $x$ in $(-2, 0)$: for instance $f'(-1) = 2$. So the graph of $f'$ is a horizontal step on each piece, with a jump at each corner, where $f'$ does not exist.\n\nCheck: from $(-2, 1)$, one unit to the right at slope $2$ reaches $(-1, 3)$, and $3$ is halfway from $1$ to $5$, as it should be.\n\n> **Watch out.** $f'(x)$ is the slope of the piece, not the height of the graph. At $x = -1$ the graph is at height $3$, but $f'(-1) = 2$.",
        "在图像的直线段上，导数是常数，等于该段的斜率 $\\frac{\\Delta y}{\\Delta x}$。从 $(-2, 1)$ 到 $(0, 5)$ 的线段斜率为 $\\frac{5 - 1}{2}$，即 $2$，所以对 $(-2, 0)$ 内的每个 $x$ 都有 $f'(x) = 2$，例如 $f'(-1) = 2$。所以 $f'$ 的图像在每一段上是水平的台阶，在每个折点处跳跃，那里 $f'$ 不存在。\n\n检验：从 $(-2, 1)$ 出发，以斜率 $2$ 向右走一个单位到达 $(-1, 3)$，而 $3$ 正好在 $1$ 和 $5$ 的中间。\n\n> **注意。** $f'(x)$ 是这一段的斜率，不是图像的高度。在 $x = -1$ 处图像的高度是 $3$，但 $f'(-1) = 2$。",
      ),
      generate(rng) {
        const ys = zigzag(rng, true);
        const i = rng.int(0, zigzagXs.length - 2);
        const x = zigzagXs[i]! + 1;
        const [x0, x1, y0, y1] = [zigzagXs[i]!, zigzagXs[i + 1]!, ys[i]!, ys[i + 1]!];
        const dy = y1 - y0;
        const answer = Q.of(dy, 2);
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ on $[-6, 6]$ is shown. Find $f'(${x})$.`, `图中是 $f$ 在 $[-6, 6]$ 上的图像。求 $f'(${x})$。`),
            answer,
            wrong: [Q.of(y0 + y1, 2), Q.of(dy), answer.neg()].filter((w) => !w.eq(answer)),
            solution: walked(
              [
                [
                  ["Find the piece", "找出所在的线段"],
                  t(
                    `Near $x = ${x}$ the graph is the segment from $(${x0}, ${y0})$ to $(${x1}, ${y1})$, a straight piece of width $2$.`,
                    `在 $x = ${x}$ 附近，图像是从 $(${x0}, ${y0})$ 到 $(${x1}, ${y1})$ 的线段，这是宽度为 $2$ 的一段直线。`,
                  ),
                ],
                [
                  ["Take its slope", "求它的斜率"],
                  t("The derivative there is the slope of this segment.", "那里的导数就是这条线段的斜率。"),
                  [`f'(${x}) = \\frac{${y1} - ${par(y0)}}{${x1} - ${par(x0)}} = ${answer.toLatex()}`],
                ],
              ],
              t(
                `Start at $(${x0}, ${y0})$ and move $2$ to the right at slope $${answer.toLatex()}$. The height changes by $2 \\cdot ${pq(answer)}$, which is $${dy}$, and $${y0}${plusTerm(dy)} = ${y1}$ is the height of the other end.`,
                `从 $(${x0}, ${y0})$ 出发，以斜率 $${answer.toLatex()}$ 向右走 $2$。高度改变 $2 \\cdot ${pq(answer)}$，即 $${dy}$，而 $${y0}${plusTerm(dy)} = ${y1}$ 正是另一端的高度。`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "the-sign-of-the-derivative-from-a-graph",
      figure: calculusDrawings2["sketching-the-derivative-of-a-function-from-the-functions-graph#the-sign-of-the-derivative-from-a-graph"],
      title: t("The sign of the derivative from a graph", "由图像判断导数的符号"),
      explanation: t(
        "Where the graph of $f$ rises, $f' > 0$, so the graph of $f'$ lies above the $x$-axis; where it falls, $f' < 0$. At a smooth peak or valley the tangent is horizontal and $f' = 0$: the graph of $f'$ crosses the axis there. The graph of $f(x) = x^{3} - 3x$ rises to a peak at $x = -1$, falls to a valley at $x = 1$ and rises again, so $f' > 0$ on $(-\\infty, -1)$ and $(1, \\infty)$, and $f' < 0$ on $(-1, 1)$.\n\nCheck: $f'(x) = 3x^{2} - 3$, and $f'(0) = -3$ is negative while $f'(2) = 9$ is positive.\n\n> **Watch out.** The sign of $f'$ depends on whether the graph rises or falls, not on whether it lies above or below the $x$-axis. A graph below the axis can still be rising.",
        "$f$ 的图像上升的地方 $f' > 0$，$f'$ 的图像位于 $x$ 轴上方；下降的地方 $f' < 0$。在光滑的峰顶或谷底，切线水平，$f' = 0$：$f'$ 的图像在那里穿过 $x$ 轴。$f(x) = x^{3} - 3x$ 的图像上升到 $x = -1$ 处的峰顶，下降到 $x = 1$ 处的谷底，再上升，所以在 $(-\\infty, -1)$ 和 $(1, \\infty)$ 上 $f' > 0$，在 $(-1, 1)$ 上 $f' < 0$。\n\n检验：$f'(x) = 3x^{2} - 3$，$f'(0) = -3$ 为负，而 $f'(2) = 9$ 为正。\n\n> **注意。** $f'$ 的符号取决于图像是上升还是下降，而不是图像在 $x$ 轴上方还是下方。位于 $x$ 轴下方的图像也可以在上升。",
      ),
      generate(rng) {
        const c = wideCubic(rng);
        const positive = rng.bool();
        const { right, wrong } = monotonicityOptions(c, positive);
        const [lo, hi] = c.up ? [c.c2, c.c1] : [c.c1, c.c2];
        const middle = positive !== c.up;
        const at = testPoint(c, middle);
        const d = pDer(c.p);
        const v = pAt(d, at);
        const op = positive ? ">" : "<";
        return reasoned(
          oneOf(
            rng,
            t(`The graph of $f$ is shown. On which intervals is $f'(x) ${op} 0$?`, `图中是 $f$ 的图像。$f'(x) ${op} 0$ 的区间是哪些？`),
            right,
            wrong,
            walked(
              [
                [
                  ["Find the turning points", "找出转向点"],
                  t(
                    `The graph turns at $x = ${c.c1}$ and $x = ${c.c2}$. There the tangent is horizontal and $f' = 0$, and these points split the line into three intervals.`,
                    `图像在 $x = ${c.c1}$ 和 $x = ${c.c2}$ 处转向。那里切线水平，$f' = 0$，这两点把数轴分成三个区间。`,
                  ),
                ],
                [
                  ["Read where it rises or falls", "读出上升和下降的部分"],
                  t(
                    `$f'(x) ${op} 0$ where the graph ${positive ? "rises" : "falls"}, and it ${positive ? "rises" : "falls"} on ${right.en}.`,
                    `$f'(x) ${op} 0$ 的地方图像${positive ? "上升" : "下降"}，而图像在 ${right["zh-CN"]} 上${positive ? "上升" : "下降"}。`,
                  ),
                ],
              ],
              t(
                `The function drawn is $f(x) = ${pLatex(c.p)}$, with $f'(x) = ${pLatex(d)}$. At $x = ${at}$, inside the answer, $f'(${at}) = ${v}$, which is ${signName(v).en}, as it should be.`,
                `图中的函数是 $f(x) = ${pLatex(c.p)}$，$f'(x) = ${pLatex(d)}$。在答案的区间内取 $x = ${at}$，$f'(${at}) = ${v}$，为${signName(v)["zh-CN"]}，与结论一致。`,
              ),
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
          ),
          [
            [
              wrong[0]!.en,
              `This is where $f'$ is ${positive ? "negative" : "positive"}: there the graph of $f$ is going ${positive ? "down" : "up"}.`,
              `这是 $f'$ 为${positive ? "负" : "正"}的区间：那里 $f$ 的图像在${positive ? "下降" : "上升"}。`,
            ],
            [
              wrong[1]!.en,
              `This runs across $x = ${c.c1}$, where the graph of $f$ turns around.`,
              `这个区间跨过了 $x = ${c.c1}$，$f$ 的图像在那里转向。`,
            ],
            [
              wrong[2]!.en,
              `This runs across $x = ${c.c2}$, where the graph of $f$ turns around.`,
              `这个区间跨过了 $x = ${c.c2}$，$f$ 的图像在那里转向。`,
            ],
          ],
        );
      },
    },
  ],
};

/** product writes s·∏(x − r) in factored form, with repeated roots squared. */
function product(roots: readonly number[], s: number): string {
  const distinct = [...new Set(roots)];
  const body = distinct.map((r) =>
    roots.filter((x) => x === r).length > 1 ? `${factor(r).startsWith("(") ? factor(r) : "x"}^{2}` : factor(r),
  );
  return `${s < 0 ? "-" : ""}${body.join("")}`;
}

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
  intro: t(
    `Reading the graph of $f$ gave us the sign of $f'$. Now we go the other way. Suppose the graph of $f'$ is the line $y = x - 3$. It lies below the $x$-axis for $x < 3$ and above it for $x > 3$, so $f$ decreases on $(-\\infty, 3)$, increases on $(3, \\infty)$, and has a local minimum at $x = 3$.

Check: one function with this derivative is $f(x) = \\frac{1}{2}x^{2} - 3x$, a parabola that opens upward with its vertex at $x = 3$.

In this lesson we find where $f$ increases, decreases and has local extrema, using only the graph of $f'$.`,
    `由 $f$ 的图像我们读出了 $f'$ 的符号。现在反过来。设 $f'$ 的图像是直线 $y = x - 3$。当 $x < 3$ 时它在 $x$ 轴下方，当 $x > 3$ 时在上方，所以 $f$ 在 $(-\\infty, 3)$ 上递减，在 $(3, \\infty)$ 上递增，在 $x = 3$ 处有局部极小值。

检验：以它为导数的一个函数是 $f(x) = \\frac{1}{2}x^{2} - 3x$，它的图像是开口向上、顶点在 $x = 3$ 处的抛物线。

这节课我们只用 $f'$ 的图像，确定 $f$ 在哪里递增、在哪里递减、在哪里有局部极值。`,
  ),
  knowledgePoints: [
    {
      id: "local-extrema-from-the-graph-of-the-derivative",
      figure: calculusDrawings2["interpreting-the-graph-of-a-functions-derivative#local-extrema-from-the-graph-of-the-derivative"],
      title: t("Local extrema from the graph of the derivative", "由导数的图像求局部极值"),
      explanation: t(
        "Reading the graph of $f'$, not $f$: $f$ has a local maximum where $f'$ crosses the $x$-axis from above to below, and a local minimum where it crosses from below to above. Where $f'$ only touches the axis, $f'$ keeps its sign and $f$ has no extremum. If $f'(x) = (x + 1)(x - 2)$, its graph crosses the axis at $x = -1$ from above to below and at $x = 2$ from below to above, so $f$ has a local maximum at $x = -1$ and a local minimum at $x = 2$.\n\nCheck: $f'(-2) = 4$, $f'(0) = -2$ and $f'(3) = 4$, so $f$ rises, falls, then rises again.\n\n> **Watch out.** Read the crossings of the axis, not the peaks and valleys of the graph of $f'$. The highest point of $f'$ is where $f$ rises fastest, not a maximum of $f$.",
        "读的是 $f'$ 的图像，而不是 $f$ 的：$f'$ 从上方穿过 $x$ 轴到下方的地方，$f$ 有局部极大值；从下方穿到上方的地方，$f$ 有局部极小值。$f'$ 只与 $x$ 轴相切的地方，$f'$ 不变号，$f$ 没有极值。若 $f'(x) = (x + 1)(x - 2)$，它的图像在 $x = -1$ 处从上方穿到下方，在 $x = 2$ 处从下方穿到上方，所以 $f$ 在 $x = -1$ 处有局部极大值，在 $x = 2$ 处有局部极小值。\n\n检验：$f'(-2) = 4$，$f'(0) = -2$，$f'(3) = 4$，所以 $f$ 先升、再降、再升。\n\n> **注意。** 要看图像与 $x$ 轴的交点，而不是 $f'$ 图像的峰和谷。$f'$ 的最高点是 $f$ 上升最快的地方，不是 $f$ 的极大值。",
      ),
      generate(rng) {
        const simple = distinctRoots(rng, rng.int(2, 3));
        const touch = rng.bool(0.4) ? rng.int(0, simple.length - 1) : -1;
        const roots = simple.flatMap((r, i) => (i === touch ? [r, r] : [r]));
        const s = rng.sign();
        const g = (x: number) => s * roots.reduce((p, r) => p * (x - r), 1);
        const kind = (r: number) => (g(r - 0.5) > 0 && g(r + 0.5) < 0 ? 1 : g(r - 0.5) < 0 && g(r + 0.5) > 0 ? -1 : 0);
        const maxima = simple.filter((r) => kind(r) === 1);
        const minima = simple.filter((r) => kind(r) === -1);
        const max = rng.pick([...(maxima.length > 0 ? [true] : []), ...(minima.length > 0 ? [false] : [])]);
        const at = max ? maxima : minima;
        const opposite = max ? minima : maxima;
        const other = simple.filter((r) => !at.includes(r));
        const side = (v: number): Text => (v > 0 ? t("positive", "正") : t("negative", "负"));
        const around = simple.map((r) => ({ r, l: side(g(r - 0.5)), rr: side(g(r + 0.5)) }));
        return {
          ...solutionsProblem({
            prompt: t(
              `The graph of $f'$, the derivative of $f$, is shown. Find the $x$-coordinates of the local ${max ? "maxima" : "minima"} of $f$.`,
              `图中是 $f$ 的导数 $f'$ 的图像。求 $f$ 的局部${max ? "极大值" : "极小值"}点的 $x$ 坐标。`,
            ),
            values: at.map(String),
            wrong: [simple.map(String), ...(other.length > 0 ? [other.map(String)] : [])],
            solution: walked(
              [
                [
                  ["Find the zeros of f'", "找出 f' 的零点"],
                  t(
                    `The graph of $f'$ meets the $x$-axis at $x = ${simple.join(", ")}$. These are the critical points of $f$.`,
                    `$f'$ 的图像与 $x$ 轴交于 $x = ${simple.join(", ")}$。这些是 $f$ 的临界点。`,
                  ),
                ],
                [
                  ["Read how f' crosses", "看 f' 怎样穿过 x 轴"],
                  t(
                    `$f'$ changes from ${max ? "positive to negative" : "negative to positive"} at $x = ${at.join(", ")}$, so $f$ has a local ${max ? "maximum" : "minimum"} at ${at.length === 1 ? "this point" : "each of them"}.${opposite.length > 0 ? ` At $x = ${opposite.join(", ")}$ the change goes the other way, giving ${opposite.length === 1 ? `a local ${max ? "minimum" : "maximum"}` : `local ${max ? "minima" : "maxima"}`} instead.` : ""}${touch >= 0 ? ` At $x = ${simple[touch]}$ the graph of $f'$ only touches the axis, so $f$ has no extremum there.` : ""}`,
                    `$f'$ 在 $x = ${at.join(", ")}$ 处${max ? "由正变负" : "由负变正"}，所以 $f$ 在${at.length === 1 ? "该点" : "这些点"}处有局部${max ? "极大值" : "极小值"}。${opposite.length > 0 ? `在 $x = ${opposite.join(", ")}$ 处变号方向相反，给出的是局部${max ? "极小值" : "极大值"}。` : ""}${touch >= 0 ? `在 $x = ${simple[touch]}$ 处 $f'$ 的图像只与 $x$ 轴相切，所以 $f$ 在那里没有极值。` : ""}`,
                  ),
                ],
              ],
              t(
                `Look just left and right of each zero. ${around.map((a) => `At $x = ${a.r}$, $f'$ is ${a.l.en} on the left and ${a.rr.en} on the right.`).join(" ")} Only ${at.length === 1 ? `$x = ${at[0]}$ goes` : `$x = ${at.join(", ")}$ go`} from ${max ? "positive to negative" : "negative to positive"}.`,
                `看每个零点的左右两侧。${around.map((a) => `在 $x = ${a.r}$ 处，$f'$ 左侧为${a.l["zh-CN"]}，右侧为${a.rr["zh-CN"]}。`).join("")}只有 $x = ${at.join(", ")}$ 处${max ? "由正变负" : "由负变正"}。`,
              ),
            ),
          }),
          figure: productFigure(roots, s, "f'"),
        };
      },
    },
    {
      id: "monotonicity-from-the-graph-of-the-derivative",
      figure: calculusDrawings2["interpreting-the-graph-of-a-functions-derivative#monotonicity-from-the-graph-of-the-derivative"],
      title: t("Monotonicity from the graph of the derivative", "由导数的图像判断单调性"),
      explanation: t(
        "$f$ is increasing where the graph of $f'$ lies above the $x$-axis and decreasing where it lies below. Whether $f'$ itself rises or falls does not matter here. If the graph of $f'$ is the line $y = 1 - x$, it is above the axis on $(-\\infty, 1)$ and below it on $(1, \\infty)$, so $f$ increases on $(-\\infty, 1)$ and decreases on $(1, \\infty)$, even though $f'$ is falling the whole time.\n\nCheck: $f(x) = x - \\frac{1}{2}x^{2}$ has this derivative, and its graph is a parabola that opens downward with its vertex at $x = 1$.\n\n> **Watch out.** A falling graph of $f'$ does not make $f$ decrease. While $f'$ stays above the axis, $f$ keeps increasing, only more and more slowly.",
        "$f'$ 的图像在 $x$ 轴上方的地方 $f$ 递增，在下方的地方 $f$ 递减。这里 $f'$ 本身是上升还是下降无关紧要。若 $f'$ 的图像是直线 $y = 1 - x$，它在 $(-\\infty, 1)$ 上位于 $x$ 轴上方，在 $(1, \\infty)$ 上位于下方，所以 $f$ 在 $(-\\infty, 1)$ 上递增，在 $(1, \\infty)$ 上递减，尽管 $f'$ 一直在下降。\n\n检验：$f(x) = x - \\frac{1}{2}x^{2}$ 的导数就是它，其图像是开口向下、顶点在 $x = 1$ 处的抛物线。\n\n> **注意。** $f'$ 的图像下降并不意味着 $f$ 递减。只要 $f'$ 在 $x$ 轴上方，$f$ 就一直递增，只是越来越慢。",
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
        const g = (x: number) => s * roots.reduce((p, r) => p * (x - r), 1);
        const tested = pieces(roots, s).filter((p) => p.positive === increasing);
        return reasoned(
          oneOf(
            rng,
            t(
              `The graph of $f'$, the derivative of $f$, is shown. On which intervals is $f$ ${increasing ? "increasing" : "decreasing"}?`,
              `图中是 $f$ 的导数 $f'$ 的图像。$f$ 在哪些区间上${increasing ? "递增" : "递减"}？`,
            ),
            right,
            wrong,
            walked(
              [
                [
                  ["Find the zeros of f'", "找出 f' 的零点"],
                  t(
                    `The graph of $f'$ crosses the $x$-axis at $x = ${roots.join(", ")}$, so the sign of $f'$ can change only there.`,
                    `$f'$ 的图像在 $x = ${roots.join(", ")}$ 处穿过 $x$ 轴，所以 $f'$ 只可能在这些点变号。`,
                  ),
                ],
                [
                  ["Read the sign", "读出符号"],
                  t(
                    `$f$ is ${increasing ? "increasing" : "decreasing"} where $f' ${increasing ? "> 0" : "< 0"}$, that is, where the graph of $f'$ is ${increasing ? "above" : "below"} the $x$-axis: ${right.en}.`,
                    `$f$ 在 $f' ${increasing ? "> 0" : "< 0"}$ 的地方${increasing ? "递增" : "递减"}，也就是 $f'$ 的图像在 $x$ 轴${increasing ? "上方" : "下方"}的地方：${right["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `The curve drawn is $f'(x) = ${product(roots, s)}$. ${tested.map((p) => `At $x = ${p.at}$, in $${p.text}$, it gives $${g(p.at)}$.`).join(" ")} ${tested.length === 1 ? "This is" : "These are"} ${increasing ? "positive" : "negative"}, as the answer says.`,
                `图中的曲线是 $f'(x) = ${product(roots, s)}$。${tested.map((p) => `在 $${p.text}$ 内取 $x = ${p.at}$，得 $${g(p.at)}$。`).join("")}${tested.length === 1 ? "它" : "它们都"}为${increasing ? "正" : "负"}，与答案一致。`,
              ),
            ),
            productFigure(roots, s, "f'"),
          ),
          [
            [
              wrong[0]!.en,
              `This is where $f$ is ${increasing ? "decreasing" : "increasing"}: read the sign of $f'$ from the graph.`,
              `这是 $f$ ${increasing ? "递减" : "递增"}的区间：要从图像读出 $f'$ 的符号。`,
            ],
            [
              wrong[1]!.en,
              "This runs across a place where the graph of $f'$ crosses the axis, so the sign changes inside it.",
              "这个区间跨过了 $f'$ 的图像与轴的交点，所以符号在区间内会变。",
            ],
            [
              wrong[2]!.en,
              "This runs across a place where the graph of $f'$ crosses the axis, so the sign changes inside it.",
              "这个区间跨过了 $f'$ 的图像与轴的交点，所以符号在区间内会变。",
            ],
          ],
        );
      },
    },
  ],
};

/** turnsOf lists the interior vertices of a zigzag where its slope changes sign. */
const turnsOf = (ys: readonly number[]) => zigzagXs.slice(1, -1).filter((_, j) => (ys[j + 1]! - ys[j]!) * (ys[j + 2]! - ys[j + 1]!) < 0);

/** turningZigzag chooses a zigzag that turns at some but not all of its interior vertices. */
function turningZigzag(rng: Rng): number[] {
  for (let i = 0; i < 40; i++) {
    const ys = zigzag(rng);
    const n = turnsOf(ys).length;
    if (n > 0 && n < 5) return ys;
  }
  return [-2, 2, 0, 3, 1, -3, -1];
}

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
  intro: t(
    `The graph of $f'$ told us where $f$ rises and falls. Its slope tells us more, because the slope of $f'$ is $f''$. If the graph of $f'$ is the line $y = 2x - 4$, it rises everywhere, so $f'' = 2 > 0$ and $f$ is concave up everywhere, with no point of inflection.

Check: $f(x) = x^{2} - 4x$ has $f'(x) = 2x - 4$, and its graph is a parabola that opens upward, concave up everywhere.

In this lesson we read the concavity and the points of inflection of $f$ from where the graph of $f'$ rises, falls and turns.`,
    `$f'$ 的图像告诉我们 $f$ 在哪里上升、在哪里下降。它的斜率告诉我们更多，因为 $f'$ 的斜率就是 $f''$。若 $f'$ 的图像是直线 $y = 2x - 4$，它处处上升，所以 $f'' = 2 > 0$，$f$ 处处上凹，没有拐点。

检验：$f(x) = x^{2} - 4x$ 的导数是 $f'(x) = 2x - 4$，它的图像是开口向上的抛物线，处处上凹。

这节课我们由 $f'$ 的图像在哪里上升、下降和转向，读出 $f$ 的凹凸性和拐点。`,
  ),
  knowledgePoints: [
    {
      id: "inflection-points-from-the-graph-of-the-derivative",
      figure:
        calculusDrawings2[
          "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection#inflection-points-from-the-graph-of-the-derivative"
        ],
      title: t("Inflection points from the graph of the derivative", "由导数的图像求拐点"),
      explanation: t(
        "$f$ is concave up where $f'$ is increasing and concave down where $f'$ is decreasing. So $f$ has a point of inflection where $f'$ changes from increasing to decreasing or back: at the peaks and valleys of the graph of $f'$, not at its zeros. If the graph of $f'$ rises to a peak at $x = 1$ and then falls, $f$ is concave up before $x = 1$, concave down after it, and has a point of inflection at $x = 1$.\n\nCheck: $f'(x) = 3 - (x - 1)^{2}$ has its peak at $x = 1$, and $f''(x) = -2(x - 1)$ changes from positive to negative there.\n\n> **Watch out.** The zeros of $f'$ give the extrema of $f$, not its points of inflection. Look where the graph of $f'$ turns.",
        "$f'$ 递增的地方 $f$ 上凹，$f'$ 递减的地方 $f$ 下凹。所以 $f$ 的拐点在 $f'$ 由递增变为递减或反过来的地方：在 $f'$ 图像的峰和谷处，而不是在它的零点处。若 $f'$ 的图像上升到 $x = 1$ 处的峰再下降，则 $f$ 在 $x = 1$ 之前上凹，之后下凹，在 $x = 1$ 处有拐点。\n\n检验：$f'(x) = 3 - (x - 1)^{2}$ 的峰在 $x = 1$ 处，而 $f''(x) = -2(x - 1)$ 在那里由正变负。\n\n> **注意。** $f'$ 的零点给出的是 $f$ 的极值，不是拐点。要看 $f'$ 的图像在哪里转向。",
      ),
      generate(rng) {
        const ys = turningZigzag(rng);
        const at = turnsOf(ys);
        const zeros = zigzagXs.filter((_, j) => ys[j] === 0);
        const slopes = ys.slice(1).map((y, j) => Q.of(y - ys[j]!, 2));
        const rises = slopes.flatMap((m, j) => (m.sign() > 0 ? [open(zigzagXs[j], zigzagXs[j + 1])] : []));
        const falls = slopes.flatMap((m, j) => (m.sign() < 0 ? [open(zigzagXs[j], zigzagXs[j + 1])] : []));
        const list = (xs: readonly string[], zh = false) => xs.map((x) => `$${x}$`).join(zh ? "、" : ", ");
        return {
          ...solutionsProblem({
            prompt: t(
              `The graph of $f'$, the derivative of $f$, on $[-6, 6]$ is shown. Find the $x$-coordinates of the points of inflection of $f$ in $(-6, 6)$.`,
              `图中是 $f$ 的导数 $f'$ 在 $[-6, 6]$ 上的图像。求 $f$ 在 $(-6, 6)$ 内拐点的 $x$ 坐标。`,
            ),
            values: at.map(String),
            wrong: [zigzagXs.slice(1, -1).map(String), ...(zeros.length > 0 ? [zeros.map(String)] : [])],
            solution: walked(
              [
                [
                  ["Read where f' rises and falls", "读出 f' 上升和下降的部分"],
                  t(
                    `The graph of $f'$ rises on ${list(rises)}${falls.length > 0 ? ` and falls on ${list(falls)}` : ""}. Where it rises $f$ is concave up, and where it falls $f$ is concave down.`,
                    `$f'$ 的图像在 ${list(rises, true)} 上上升${falls.length > 0 ? `，在 ${list(falls, true)} 上下降` : ""}。它上升的地方 $f$ 上凹，下降的地方 $f$ 下凹。`,
                  ),
                ],
                [
                  ["Find where it turns", "找出转向的地方"],
                  t(
                    `$f'$ switches between increasing and decreasing at $x = ${at.join(", ")}$, where its graph turns. There the concavity of $f$ changes, so these are the points of inflection.`,
                    `$f'$ 在 $x = ${at.join(", ")}$ 处图像转向，在递增与递减之间切换。$f$ 的凹凸性在这些点改变，所以它们就是拐点。`,
                  ),
                ],
              ],
              t(
                `The slope of each piece of $f'$ is the value of $f''$ there. From left to right these are\n\n$$${slopes.map((m) => m.toLatex()).join(", \\quad ")}$$\n\nThe sign changes exactly between the pieces that meet at $x = ${at.join(", ")}$.`,
                `$f'$ 每一段的斜率就是那里 $f''$ 的值。从左到右依次为\n\n$$${slopes.map((m) => m.toLatex()).join(", \\quad ")}$$\n\n符号恰好在 $x = ${at.join(", ")}$ 处相接的两段之间改变。`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f'"),
        };
      },
    },
    {
      id: "concavity-from-a-smooth-graph-of-the-derivative",
      figure:
        calculusDrawings2[
          "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection#concavity-from-a-smooth-graph-of-the-derivative"
        ],
      title: t("Concavity from a smooth graph of the derivative", "由光滑的导数图像判断凹凸性"),
      explanation: t(
        "Find where the graph of $f'$ rises: there $f'' > 0$ and $f$ is concave up. Where it falls, $f$ is concave down. If the graph of $f'$ is the parabola $y = x^{2}$, with its valley at $x = 0$, it falls on $(-\\infty, 0)$ and rises on $(0, \\infty)$, so $f$ is concave down on $(-\\infty, 0)$ and concave up on $(0, \\infty)$, although $f' \\ge 0$ everywhere.\n\nCheck: $f'' = 2x$ is negative for $x < 0$ and positive for $x > 0$.\n\n> **Watch out.** Whether the graph of $f'$ lies above or below the axis is the sign of $f'$, which decides increasing or decreasing. For concavity, look at whether the graph of $f'$ goes up or down.",
        "找出 $f'$ 的图像上升的地方：那里 $f'' > 0$，$f$ 上凹。下降的地方 $f$ 下凹。若 $f'$ 的图像是抛物线 $y = x^{2}$，谷底在 $x = 0$ 处，它在 $(-\\infty, 0)$ 上下降，在 $(0, \\infty)$ 上上升，所以 $f$ 在 $(-\\infty, 0)$ 上下凹，在 $(0, \\infty)$ 上上凹，尽管处处有 $f' \\ge 0$。\n\n检验：$f'' = 2x$ 当 $x < 0$ 时为负，当 $x > 0$ 时为正。\n\n> **注意。** $f'$ 的图像在 $x$ 轴上方还是下方是 $f'$ 的符号，决定的是递增还是递减。判断凹凸性要看 $f'$ 的图像是上升还是下降。",
      ),
      generate(rng) {
        const c = wideCubic(rng);
        const up = rng.bool();
        const { right, wrong } = monotonicityOptions(c, up);
        const [lo, hi] = c.up ? [c.c2, c.c1] : [c.c1, c.c2];
        const at = testPoint(c, up !== c.up);
        const d = pDer(c.p);
        const v = pAt(d, at);
        return reasoned(
          oneOf(
            rng,
            t(
              `The graph of $f'$, the derivative of $f$, is shown. On which intervals is $f$ concave ${up ? "up" : "down"}?`,
              `图中是 $f$ 的导数 $f'$ 的图像。$f$ 在哪些区间上${up ? "上凹" : "下凹"}？`,
            ),
            right,
            wrong,
            walked(
              [
                [
                  ["Find where f' turns", "找出 f' 转向的地方"],
                  t(
                    `The graph of $f'$ has a peak at $x = ${hi}$ and a valley at $x = ${lo}$. There $f'' = 0$, and between them $f'$ keeps going one way.`,
                    `$f'$ 的图像在 $x = ${hi}$ 处有峰，在 $x = ${lo}$ 处有谷。那里 $f'' = 0$，在它们之间 $f'$ 保持同一个方向。`,
                  ),
                ],
                [
                  ["Read where f' rises or falls", "读出 f' 上升或下降的部分"],
                  t(
                    `$f$ is concave ${up ? "up" : "down"} where $f'$ is ${up ? "increasing" : "decreasing"}, and the graph of $f'$ ${up ? "rises" : "falls"} on ${right.en}.`,
                    `$f'$ ${up ? "递增" : "递减"}的地方 $f$ ${up ? "上凹" : "下凹"}，而 $f'$ 的图像在 ${right["zh-CN"]} 上${up ? "上升" : "下降"}。`,
                  ),
                ],
              ],
              t(
                `The curve drawn is $f'(x) = ${pLatex(c.p)}$, so $f''(x) = ${pLatex(d)}$. At $x = ${at}$, inside the answer, $f''(${at}) = ${v}$, which is ${signName(v).en}, as concave ${up ? "up" : "down"} needs.`,
                `图中的曲线是 $f'(x) = ${pLatex(c.p)}$，所以 $f''(x) = ${pLatex(d)}$。在答案的区间内取 $x = ${at}$，$f''(${at}) = ${v}$，为${signName(v)["zh-CN"]}，正符合${up ? "上凹" : "下凹"}。`,
              ),
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
          ),
          [
            [
              wrong[0]!.en,
              `This is where $f'$ ${up ? "falls" : "rises"}, so there $f$ is concave ${up ? "down" : "up"}.`,
              `这是 $f'$ ${up ? "下降" : "上升"}的区间，那里 $f$ ${up ? "下凹" : "上凹"}。`,
            ],
            [
              wrong[1]!.en,
              `This runs across $x = ${c.c1}$, where the graph of $f'$ turns, so the concavity of $f$ changes inside it.`,
              `这个区间跨过了 $x = ${c.c1}$，$f'$ 的图像在那里转向，所以 $f$ 的凹凸性在区间内会变。`,
            ],
            [
              wrong[2]!.en,
              `This runs across $x = ${c.c2}$, where the graph of $f'$ turns, so the concavity of $f$ changes inside it.`,
              `这个区间跨过了 $x = ${c.c2}$，$f'$ 的图像在那里转向，所以 $f$ 的凹凸性在区间内会变。`,
            ],
          ],
        );
      },
    },
  ],
};

/** stepXs are the ends of the pieces of step graphs. */
const stepXs = [-6, -4, -2, 0, 2, 4, 6];

/** stepValues chooses the values of a piecewise constant derivative. */
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

/** uniqueExtreme says whether the largest or smallest value of f at the ends of the pieces is attained only once. */
const uniqueExtreme = (vs: readonly number[], max: boolean) => {
  const totals = stepTotals(vs, 0);
  const best = max ? Math.max(...totals) : Math.min(...totals);
  return totals.filter((v) => v === best).length === 1;
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
  intro: t(
    `The graph of $f'$ tells us where $f$ rises and falls. When $f'$ is constant it tells us exactly how much. If $f'(x) = 3$ for every $x$ in $(0, 2)$, then $f$ is a line of slope $3$ there, so it climbs $3 \\cdot 2 = 6$ across the interval. With $f(0) = 1$ this gives $f(2) = 1 + 6 = 7$.

Check: the line through $(0, 1)$ with slope $3$ is $y = 3x + 1$, and at $x = 2$ it gives $7$.

In this lesson we rebuild the values of $f$ from the graph of $f'$ and a starting value, and use them to find the global extrema of $f$.`,
    `$f'$ 的图像告诉我们 $f$ 在哪里上升、在哪里下降。当 $f'$ 为常数时，它还能告诉我们升降了多少。若对 $(0, 2)$ 内的每个 $x$ 都有 $f'(x) = 3$，则 $f$ 在那里是斜率为 $3$ 的直线，跨过这个区间上升 $3 \\cdot 2 = 6$。由 $f(0) = 1$ 得 $f(2) = 1 + 6 = 7$。

检验：过 $(0, 1)$、斜率为 $3$ 的直线是 $y = 3x + 1$，在 $x = 2$ 处它给出 $7$。

这节课我们由 $f'$ 的图像和一个起始值重建 $f$ 的值，并用它们求 $f$ 的全局最值。`,
  ),
  knowledgePoints: [
    {
      id: "values-from-a-piecewise-constant-derivative",
      title: t("Values from a piecewise constant derivative", "由分段常数导数求函数值"),
      explanation: t(
        "Where $f'$ is a constant $m$, $f$ is a line of slope $m$: across a piece of width $\\Delta x$, $f$ changes by $m \\, \\Delta x$. Starting from a known value, add these changes piece by piece. If $f'$ is $2$ on $(0, 2)$ and $-1$ on $(2, 4)$, and $f(0) = 3$, then $f(2) = 3 + 2 \\cdot 2 = 7$ and $f(4) = 7 + 2 \\cdot (-1) = 5$.\n\nCheck: over all of $(0, 4)$, $f$ changes by $4 - 2 = 2$, and $3 + 2 = 5$.\n\n> **Watch out.** Multiply each value of $f'$ by the width of its piece. Adding up the values of $f'$ alone leaves out the widths.",
        "$f'$ 为常数 $m$ 的地方，$f$ 是斜率为 $m$ 的直线：跨过宽度为 $\\Delta x$ 的一段，$f$ 改变 $m \\, \\Delta x$。从已知的值出发，逐段加上这些变化量。若 $f'$ 在 $(0, 2)$ 上为 $2$，在 $(2, 4)$ 上为 $-1$，且 $f(0) = 3$，则 $f(2) = 3 + 2 \\cdot 2 = 7$，$f(4) = 7 + 2 \\cdot (-1) = 5$。\n\n检验：在整个 $(0, 4)$ 上，$f$ 改变 $4 - 2 = 2$，而 $3 + 2 = 5$。\n\n> **注意。** 要把 $f'$ 的每个值乘以所在段的宽度。只把 $f'$ 的值相加就漏掉了宽度。",
      ),
      generate(rng) {
        const vs = stepValues(rng);
        const y0 = rng.int(-5, 5);
        const k = rng.int(2, stepXs.length - 1);
        const totals = stepTotals(vs, y0);
        const answer = totals[k]!;
        const change = answer - y0;
        const changes = vs.slice(0, k).map((v) => `2 \\cdot ${par(v)}`);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f'$, the derivative of a continuous function $f$, is shown, and $f(-6) = ${y0}$. Find $f(${stepXs[k]})$.`,
              `图中是连续函数 $f$ 的导数 $f'$ 的图像，且 $f(-6) = ${y0}$。求 $f(${stepXs[k]})$。`,
            ),
            answer,
            wrong: [change, y0 + vs.slice(0, k).reduce((a, v) => a + v, 0), totals[k - 1]!].filter((w) => w !== answer),
            solution: walked(
              [
                [
                  ["Add the changes", "把变化量相加"],
                  t(
                    `Each piece has width $2$, so across it $f$ changes by $2$ times the value of $f'$. From $x = -6$ to $x = ${stepXs[k]}$ the total change is`,
                    `每段宽 $2$，所以跨过一段 $f$ 改变 $f'$ 的值的 $2$ 倍。从 $x = -6$ 到 $x = ${stepXs[k]}$，总的变化量为`,
                  ),
                  [`${changes.join(" + ")} = ${change}`],
                ],
                [
                  ["Start from the known value", "从已知的值出发"],
                  t(`Add the change to $f(-6) = ${y0}$.`, `把变化量加到 $f(-6) = ${y0}$ 上。`),
                  [`f(${stepXs[k]}) = ${y0} + ${par(change)} = ${answer}`],
                ],
              ],
              t(
                `Go piece by piece instead. Starting from $f(-6) = ${y0}$, the values at the ends of the pieces are\n\n$$${totals
                  .slice(1, k + 1)
                  .map((v, i) => `f(${stepXs[i + 1]}) = ${v}`)
                  .join(", \\quad ")}$$\n\nThe last one is $f(${stepXs[k]}) = ${answer}$, as before.`,
                `改为逐段计算。从 $f(-6) = ${y0}$ 出发，各段端点处的值为\n\n$$${totals
                  .slice(1, k + 1)
                  .map((v, i) => `f(${stepXs[i + 1]}) = ${v}`)
                  .join(", \\quad ")}$$\n\n最后一个是 $f(${stepXs[k]}) = ${answer}$，与前面一致。`,
              ),
            ),
          }),
          figure: stepFigure(vs),
        };
      },
    },
    {
      id: "global-extrema-from-the-graph-of-the-derivative",
      figure: calculusDrawings2["sketching-a-function-from-the-graph-of-its-derivative#global-extrema-from-the-graph-of-the-derivative"],
      title: t("Global extrema from the graph of the derivative", "由导数的图像求全局最值"),
      explanation: t(
        "The candidates for global extrema on $[a, b]$ are the endpoints and the points where $f'$ changes sign. Track how $f$ rises and falls between them to compare the values. If $f'$ is $1$ on $(0, 2)$, $-3$ on $(2, 4)$ and $2$ on $(4, 6)$, then from $f(0)$ the function rises $2$, falls $6$ and rises $4$. Measured from $f(0)$, the values at $x = 0, 2, 4, 6$ are $0, 2, -4, 0$, so the global maximum on $[0, 6]$ is at $x = 2$ and the global minimum is at $x = 4$.\n\nCheck: $x = 4$ is where $f'$ changes from negative to positive, and its value $-4$ is below both endpoints.\n\n> **Watch out.** A local maximum need not be the global one, and an endpoint can win. Compare the values at all the candidates.",
        "$[a, b]$ 上全局最值的候选点是端点以及 $f'$ 变号的点。追踪 $f$ 在它们之间的升降，比较各处的值。若 $f'$ 在 $(0, 2)$ 上为 $1$，在 $(2, 4)$ 上为 $-3$，在 $(4, 6)$ 上为 $2$，则从 $f(0)$ 出发，函数上升 $2$、下降 $6$、再上升 $4$。以 $f(0)$ 为基准，$x = 0, 2, 4, 6$ 处的值为 $0, 2, -4, 0$，所以 $[0, 6]$ 上的全局最大值在 $x = 2$ 处，全局最小值在 $x = 4$ 处。\n\n检验：$x = 4$ 是 $f'$ 由负变正的点，它的值 $-4$ 比两个端点都低。\n\n> **注意。** 局部极大值不一定是全局最大值，端点也可能取到最值。要比较所有候选点的值。",
      ),
      generate(rng) {
        let vs = stepValues(rng);
        let max = rng.bool();
        for (let i = 0; i < 40 && !uniqueExtreme(vs, max); i++) {
          vs = stepValues(rng);
          max = rng.bool();
        }
        if (!uniqueExtreme(vs, max)) vs = [2, -1, 3, -2, 1, -1];
        const totals = stepTotals(vs, 0);
        const best = max ? Math.max(...totals) : Math.min(...totals);
        const at = stepXs[totals.indexOf(best)]!;
        const local = stepXs.slice(1, -1).filter((_, i) => (max ? vs[i]! > 0 && vs[i + 1]! < 0 : vs[i]! < 0 && vs[i + 1]! > 0));
        const candidates = [-6, ...local, 6];
        const valueAt = (x: number) => totals[stepXs.indexOf(x)]!;
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
            solution: walked(
              [
                [
                  ["Track the changes", "追踪变化量"],
                  t(
                    "Each piece has width $2$, so across it $f$ changes by $2f'$. Measured from $f(-6)$, the values at the ends of the pieces are",
                    "每段宽 $2$，所以跨过一段 $f$ 改变 $2f'$。以 $f(-6)$ 为基准，各段端点处的值为",
                  ),
                  [table(["$x$", ...stepXs.map((x) => `$${x}$`)], ["$f(x) - f(-6)$", ...totals.map((v) => `$${v}$`)])],
                ],
                [
                  ["Pick the extreme value", "选出最值"],
                  t(
                    `The ${max ? "largest" : "smallest"} value in the table is $${best}$, at $x = ${at}$.`,
                    `表中${max ? "最大" : "最小"}的值是 $${best}$，在 $x = ${at}$ 处。`,
                  ),
                ],
              ],
              t(
                `Only the endpoints and the points where $f'$ changes from ${max ? "positive to negative" : "negative to positive"} can give the global ${max ? "maximum" : "minimum"}: $x = ${candidates.join(", ")}$. Their values are $${candidates.map(valueAt).join(", ")}$, and the ${max ? "largest" : "smallest"} is again at $x = ${at}$.`,
                `只有端点和 $f'$ ${max ? "由正变负" : "由负变正"}的点可能给出全局${max ? "最大值" : "最小值"}：$x = ${candidates.join(", ")}$。它们的值为 $${candidates.map(valueAt).join(", ")}$，其中${max ? "最大" : "最小"}的仍在 $x = ${at}$ 处。`,
              ),
            ),
          }),
          figure: stepFigure(vs),
        };
      },
    },
  ],
};

/** model names a function with the given signs of f' and f'' everywhere, for checking a shape. */
const model = (rising: boolean, up: boolean): Text => {
  const f = rising ? (up ? "e^{x}" : "-e^{-x}") : up ? "e^{-x}" : "-e^{x}";
  const d1 = rising ? (up ? "e^{x}" : "e^{-x}") : up ? "-e^{-x}" : "-e^{x}";
  const d2 = up ? (rising ? "e^{x}" : "e^{-x}") : rising ? "-e^{-x}" : "-e^{x}";
  return t(
    `$g(x) = ${f}$ has $g'(x) = ${d1}$, which is ${rising ? "positive" : "negative"}, and $g''(x) = ${d2}$, which is ${up ? "positive" : "negative"}. Its graph ${rising ? "rises" : "falls"} and bends ${up ? "upward" : "downward"}, ${rising === up ? "getting steeper" : "levelling off"}.`,
    `$g(x) = ${f}$ 有 $g'(x) = ${d1}$，为${rising ? "正" : "负"}，$g''(x) = ${d2}$，为${up ? "正" : "负"}。它的图像${rising ? "上升" : "下降"}并且${up ? "向上" : "向下"}弯，${rising === up ? "越来越陡" : "逐渐平缓"}。`,
  );
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
  intro: t(
    `The sign of $f'$ says whether a graph rises or falls, and the sign of $f''$ says which way it bends. On $(0, \\infty)$, $f(x) = \\sqrt{x}$ has $f'(x) > 0$ and $f''(x) < 0$: it rises, but less and less steeply, climbing from $(0, 0)$ through $(1, 1)$ and $(4, 2)$.

Check: from $x = 0$ to $x = 1$ the graph climbs $1$, but from $x = 1$ to $x = 4$, three times as far, it climbs only $1$ more.

In this lesson we describe the shape of a graph from the signs of $f'$ and $f''$, and decide what happens at points where $f' = 0$.`,
    `$f'$ 的符号说明图像上升还是下降，$f''$ 的符号说明它向哪边弯。在 $(0, \\infty)$ 上，$f(x) = \\sqrt{x}$ 有 $f'(x) > 0$，$f''(x) < 0$：它上升，但越来越平缓，从 $(0, 0)$ 经过 $(1, 1)$ 和 $(4, 2)$。

检验：从 $x = 0$ 到 $x = 1$ 图像上升 $1$，但从 $x = 1$ 到 $x = 4$，距离是三倍，却只再上升 $1$。

这节课我们由 $f'$ 和 $f''$ 的符号描述图像的形状，并判断在 $f' = 0$ 的点处会发生什么。`,
  ),
  knowledgePoints: [
    {
      id: "shapes-from-the-signs-of-the-derivatives",
      figure: calculusDrawings2["sketching-a-function-given-some-derivative-properties#shapes-from-the-signs-of-the-derivatives"],
      title: t("Shapes from the signs of the derivatives", "由导数的符号判断形状"),
      explanation: t(
        "The sign of $f'$ says whether the graph rises or falls; the sign of $f''$ says whether it bends up or down. Together they give four shapes: rising and concave up (getting steeper), rising and concave down (levelling off), falling and concave up (levelling off), and falling and concave down (getting steeper). For example, $f(x) = x^{2}$ on $(0, \\infty)$ has $f'(x) = 2x > 0$ and $f''(x) = 2 > 0$, so it rises and gets steeper.\n\nCheck: $f(1) - f(0) = 1$ but $f(2) - f(1) = 3$, a bigger climb over the same width.\n\n> **Watch out.** Concave up does not mean rising. A graph can fall and be concave up at once, like $x^{2}$ on $(-\\infty, 0)$, which falls and levels off.",
        "$f'$ 的符号决定图像上升还是下降；$f''$ 的符号决定它向上弯还是向下弯。两者合起来有四种形状：上升且上凹（越来越陡），上升且下凹（逐渐平缓），下降且上凹（逐渐平缓），下降且下凹（越来越陡）。例如在 $(0, \\infty)$ 上，$f(x) = x^{2}$ 有 $f'(x) = 2x > 0$，$f''(x) = 2 > 0$，所以它上升且越来越陡。\n\n检验：$f(1) - f(0) = 1$，而 $f(2) - f(1) = 3$，同样的宽度上升得更多。\n\n> **注意。** 上凹不等于上升。图像可以同时下降且上凹，比如 $x^{2}$ 在 $(-\\infty, 0)$ 上，它下降并逐渐平缓。",
      ),
      generate(rng) {
        const a = rng.int(-6, 3);
        const b = a + rng.int(1, 5);
        const rising = rng.bool();
        const up = rng.bool();
        const shapes = [
          [true, true],
          [true, false],
          [false, true],
          [false, false],
        ] as const;
        const options = [
          t("Increasing and concave up", "递增且上凹"),
          t("Increasing and concave down", "递增且下凹"),
          t("Decreasing and concave up", "递减且上凹"),
          t("Decreasing and concave down", "递减且下凹"),
        ];
        const right = (rising ? 0 : 2) + (up ? 0 : 1);
        const op = (v: boolean) => (v ? ">" : "<");
        return reasoned(
          oneOf(
            rng,
            t(
              `On $(${a}, ${b})$, $f'(x) ${op(rising)} 0$ and $f''(x) ${op(up)} 0$. Which describes the graph of $f$ there?`,
              `在 $(${a}, ${b})$ 上，$f'(x) ${op(rising)} 0$ 且 $f''(x) ${op(up)} 0$。下列哪项描述了 $f$ 在该区间上的图像？`,
            ),
            options[right]!,
            options.filter((_, i) => i !== right),
            walked(
              [
                [
                  ["Read the sign of f'", "读 f' 的符号"],
                  t(
                    `$f' ${op(rising)} 0$, so $f$ is ${rising ? "increasing" : "decreasing"} on $(${a}, ${b})$.`,
                    `$f' ${op(rising)} 0$，所以 $f$ 在 $(${a}, ${b})$ 上${rising ? "递增" : "递减"}。`,
                  ),
                ],
                [
                  ["Read the sign of f''", "读 f'' 的符号"],
                  t(
                    `$f'' ${op(up)} 0$, so $f$ is concave ${up ? "up" : "down"} there. Together: ${options[right]!.en.toLowerCase()}.`,
                    `$f'' ${op(up)} 0$，所以 $f$ 在那里${up ? "上凹" : "下凹"}。合起来：${options[right]!["zh-CN"]}。`,
                  ),
                ],
              ],
              model(rising, up),
            ),
          ),
          options.flatMap((o, i): (readonly [string, string, string])[] => {
            if (i === right) return [];
            const [r, u] = shapes[i]!;
            if (r !== rising && u !== up)
              return [
                [
                  o.en,
                  `Both signs are reversed: this needs $f' ${op(r)} 0$ and $f'' ${op(u)} 0$.`,
                  `两个符号都反了：这需要 $f' ${op(r)} 0$ 且 $f'' ${op(u)} 0$。`,
                ],
              ];
            if (r !== rising)
              return [
                [
                  o.en,
                  `The concavity is right, but ${r ? "increasing" : "decreasing"} needs $f' ${op(r)} 0$.`,
                  `凹凸性对了，但${r ? "递增" : "递减"}需要 $f' ${op(r)} 0$。`,
                ],
              ];
            return [
              [
                o.en,
                `The direction is right, but concave ${u ? "up" : "down"} needs $f'' ${op(u)} 0$.`,
                `升降方向对了，但${u ? "上凹" : "下凹"}需要 $f'' ${op(u)} 0$。`,
              ],
            ];
          }),
        );
      },
    },
    {
      id: "extrema-from-derivative-properties",
      title: t("Extrema from derivative properties", "由导数的性质判断极值"),
      explanation: t(
        "A list of properties is enough to place the key features. If $f'(c) = 0$ and $f'$ changes sign at $c$, there is an extremum; if $f'(c) = 0$ and $f''(c) \\ne 0$, the sign of $f''(c)$ decides which. Where $f''$ changes sign, there is a point of inflection. For example, if $f'(2) = 0$ and $f'$ is positive left of $2$ and negative right of it, $f$ has a local maximum at $x = 2$. If instead $f'(2) = 0$ and $f''(2) = 3$, the graph is concave up there and $f$ has a local minimum.\n\nCheck: $f(x) = -(x - 2)^{2}$ has $f'(x) = -2(x - 2)$, positive for $x < 2$ and negative for $x > 2$, and its graph has its peak at $x = 2$.\n\n> **Watch out.** $f'(c) = 0$ alone does not give an extremum. If $f'$ has the same sign on both sides, like the derivative of $x^{3}$ at $0$, there is none.",
        "一组性质就足以确定关键特征。若 $f'(c) = 0$ 且 $f'$ 在 $c$ 处变号，则有极值；若 $f'(c) = 0$ 且 $f''(c) \\ne 0$，则由 $f''(c)$ 的符号决定是哪一种。$f''$ 变号的地方是拐点。例如，若 $f'(2) = 0$，且 $f'$ 在 $2$ 的左侧为正、右侧为负，则 $f$ 在 $x = 2$ 处有局部极大值。若改为 $f'(2) = 0$ 且 $f''(2) = 3$，图像在那里上凹，$f$ 有局部极小值。\n\n检验：$f(x) = -(x - 2)^{2}$ 的导数 $f'(x) = -2(x - 2)$ 当 $x < 2$ 时为正，当 $x > 2$ 时为负，它的图像在 $x = 2$ 处达到峰顶。\n\n> **注意。** 仅有 $f'(c) = 0$ 不能得出极值。若 $f'$ 在两侧同号，比如 $x^{3}$ 的导数在 $0$ 处，就没有极值。",
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
          const c = atA ? a : b;
          const [l, r] = atA ? [s[0]!, s[1]!] : [s[1]!, s[2]!];
          const verdict = l === r ? 2 : l > 0 ? 0 : 1;
          const g = verdict === 0 ? `-${factor(c)}^{2}` : verdict === 1 ? `${factor(c)}^{2}` : `${l < 0 ? "-" : ""}${factor(c)}^{3}`;
          return reasoned(
            oneOf(
              rng,
              t(
                `$f$ is differentiable, $f'(${a}) = f'(${b}) = 0$, and $f'(x) ${sign(s[0]!)} 0$ for $x < ${a}$, $f'(x) ${sign(s[1]!)} 0$ for $${a} < x < ${b}$, and $f'(x) ${sign(s[2]!)} 0$ for $x > ${b}$. What does $f$ have at $x = ${c}$?`,
                `$f$ 可导，$f'(${a}) = f'(${b}) = 0$，且当 $x < ${a}$ 时 $f'(x) ${sign(s[0]!)} 0$，当 $${a} < x < ${b}$ 时 $f'(x) ${sign(s[1]!)} 0$，当 $x > ${b}$ 时 $f'(x) ${sign(s[2]!)} 0$。$f$ 在 $x = ${c}$ 处有什么？`,
              ),
              options[verdict]!,
              options.filter((_, i) => i !== verdict),
              walked(
                [
                  [
                    ["Read the signs around the point", "读出该点两侧的符号"],
                    t(
                      `$f'(${c}) = 0$. Just left of $${c}$, $f'$ is ${l > 0 ? "positive" : "negative"}, and just right of it, $f'$ is ${r > 0 ? "positive" : "negative"}.`,
                      `$f'(${c}) = 0$。在 $${c}$ 的左侧 $f'$ 为${l > 0 ? "正" : "负"}，右侧为${r > 0 ? "正" : "负"}。`,
                    ),
                  ],
                  [
                    ["Apply the first derivative test", "用一阶导数检验法"],
                    verdict === 2
                      ? t(
                          `$f'$ does not change sign, so $f$ keeps ${l > 0 ? "rising" : "falling"} through $x = ${c}$ and has no extremum there.`,
                          `$f'$ 不变号，所以 $f$ 经过 $x = ${c}$ 时一直${l > 0 ? "上升" : "下降"}，在那里没有极值。`,
                        )
                      : t(
                          `$f$ ${l > 0 ? "rises and then falls" : "falls and then rises"}, so it has a local ${verdict === 0 ? "maximum" : "minimum"} at $x = ${c}$.`,
                          `$f$ ${l > 0 ? "先升后降" : "先降后升"}，所以在 $x = ${c}$ 处有局部${verdict === 0 ? "极大值" : "极小值"}。`,
                        ),
                  ],
                ],
                t(
                  `Near $x = ${c}$, $g(x) = ${g}$ has a derivative with the same signs. Its graph ${verdict === 0 ? "has a peak" : verdict === 1 ? "has a valley" : `${l > 0 ? "rises" : "falls"} through the point without turning`} at $x = ${c}$.`,
                  `在 $x = ${c}$ 附近，$g(x) = ${g}$ 的导数有相同的符号。它的图像在 $x = ${c}$ 处${verdict === 0 ? "达到峰顶" : verdict === 1 ? "达到谷底" : `一直${l > 0 ? "上升" : "下降"}，没有转向`}。`,
                ),
              ),
            ),
            [
              [
                options[0]!.en,
                `A local maximum needs $f'$ to change from positive to negative at $x = ${c}$.`,
                `局部极大值需要 $f'$ 在 $x = ${c}$ 处由正变负。`,
              ],
              [
                options[1]!.en,
                `A local minimum needs $f'$ to change from negative to positive at $x = ${c}$.`,
                `局部极小值需要 $f'$ 在 $x = ${c}$ 处由负变正。`,
              ],
              [
                options[2]!.en,
                `$f'$ changes sign at $x = ${c}$, so there is an extremum there.`,
                `$f'$ 在 $x = ${c}$ 处变号，所以那里有极值。`,
              ],
            ],
          );
        }
        const f2 = rng.nonZero(-5, 5);
        const verdict = f2 < 0 ? 0 : 1;
        const half = Q.of(f2, 2);
        const lead = half.eq(Q.one) ? "" : half.eq(Q.of(-1)) ? "-" : half.toLatex();
        return reasoned(
          oneOf(
            rng,
            t(
              `$f$ is twice differentiable, $f'(${a}) = 0$ and $f''(${a}) = ${f2}$. What does $f$ have at $x = ${a}$?`,
              `$f$ 二阶可导，$f'(${a}) = 0$，$f''(${a}) = ${f2}$。$f$ 在 $x = ${a}$ 处有什么？`,
            ),
            options[verdict]!,
            options.filter((_, i) => i !== verdict),
            walked(
              [
                [
                  ["Note the horizontal tangent", "注意切线水平"],
                  t(
                    `$f'(${a}) = 0$, so $x = ${a}$ is a critical point and the tangent there is horizontal.`,
                    `$f'(${a}) = 0$，所以 $x = ${a}$ 是临界点，那里的切线水平。`,
                  ),
                ],
                [
                  ["Read the concavity", "读出凹凸性"],
                  t(
                    `$f''(${a}) ${f2 < 0 ? "< 0" : "> 0"}$, so the graph is concave ${f2 < 0 ? "down" : "up"} there. By the second derivative test, $f$ has a local ${f2 < 0 ? "maximum" : "minimum"} at $x = ${a}$.`,
                    `$f''(${a}) ${f2 < 0 ? "< 0" : "> 0"}$，图像在那里${f2 < 0 ? "下凹" : "上凹"}。由二阶导数检验法，$f$ 在 $x = ${a}$ 处有局部${f2 < 0 ? "极大值" : "极小值"}。`,
                  ),
                ],
              ],
              t(
                `$g(x) = ${lead}${factor(a)}^{2}$ has $g'(${a}) = 0$ and $g''(x) = ${f2}$. Its graph is a parabola that opens ${f2 < 0 ? "downward, with its peak" : "upward, with its valley"} at $x = ${a}$.`,
                `$g(x) = ${lead}${factor(a)}^{2}$ 有 $g'(${a}) = 0$，$g''(x) = ${f2}$。它的图像是开口${f2 < 0 ? "向下的抛物线，峰顶" : "向上的抛物线，谷底"}在 $x = ${a}$ 处。`,
              ),
            ),
          ),
          [
            [
              options[0]!.en,
              "A local maximum needs $f''$ to be negative there, concave down.",
              "局部极大值需要那里的 $f''$ 为负，即下凹。",
            ],
            [options[1]!.en, "A local minimum needs $f''$ to be positive there, concave up.", "局部极小值需要那里的 $f''$ 为正，即上凹。"],
            [
              options[2]!.en,
              `The second derivative test decides here, since $f''(${a}) \\ne 0$.`,
              `这里 $f''(${a}) \\ne 0$，二阶导数检验法可以作出判断。`,
            ],
          ],
        );
      },
    },
  ],
};

/** linLatex writes m·(x − a) + b expanded as a linear expression. */
const linLatex = (m: Q, a: Q, b: Q) => poly([m, "x"], [b.sub(m.mul(a)), ""]) || "0";

/** Linearizable is a function with its derivative, a point, and the value and slope there. */
interface Linearizable {
  readonly f: string;
  readonly df: string;
  readonly a: Q;
  readonly fa: Q;
  readonly da: Q;
  readonly answer: string;
  readonly wrong: readonly string[];
}

/** linearizable chooses a function and a point at which to linearize it. */
function linearizable(rng: Rng): Linearizable {
  const kind = rng.int(0, 4);
  const make = (f: string, df: string, a: Q, fa: Q, da: Q, wrong: readonly string[]): Linearizable => ({
    f,
    df,
    a,
    fa,
    da,
    answer: linLatex(da, a, fa),
    wrong,
  });
  if (kind === 0) {
    const p: Poly = [rng.int(-6, 6), rng.int(-5, 5), rng.nonZero(-3, 3), rng.int(-1, 1)];
    const a = rng.nonZero(-3, 3);
    const [fa, da] = [Q.of(pAt(p, a)), Q.of(pAt(pDer(p), a))];
    return make(pLatex(p), pLatex(pDer(p)), Q.of(a), fa, da, [linLatex(da, Q.zero, fa), linLatex(da, Q.of(a), Q.zero)]);
  }
  if (kind === 1) {
    const s = rng.int(1, 9);
    const m = Q.of(1, 2 * s);
    return make("\\sqrt{x}", "\\frac{1}{2\\sqrt{x}}", Q.of(s * s), Q.of(s), m, [
      linLatex(m, Q.zero, Q.of(s)),
      linLatex(Q.of(1, s), Q.of(s * s), Q.of(s)),
    ]);
  }
  if (kind === 2) {
    const a = rng.nonZero(-5, 5);
    const k = rng.int(1, 6);
    const fa = Q.of(k, a);
    const m = Q.of(-k, a * a);
    return make(`\\frac{${k}}{x}`, `-\\frac{${k}}{x^{2}}`, Q.of(a), fa, m, [linLatex(m.neg(), Q.of(a), fa), linLatex(m, Q.zero, fa)]);
  }
  if (kind === 3) {
    const k = rng.nonZero(-6, 6);
    const c = rng.int(1, 9);
    const e = `e^{${poly([k, "x"])}}`;
    return make(`${c === 1 ? "" : c}${e}`, `${c * k === 1 ? "" : c * k === -1 ? "-" : c * k}${e}`, Q.zero, Q.of(c), Q.of(c * k), [
      linLatex(Q.of(k), Q.zero, Q.of(c)),
      linLatex(Q.of(c), Q.zero, Q.of(c)),
    ]);
  }
  const k = rng.int(1, 6);
  return make(`${k === 1 ? "" : k}\\ln x`, `\\frac{${k}}{x}`, Q.one, Q.zero, Q.of(k), [
    linLatex(Q.of(k), Q.zero, Q.zero),
    linLatex(Q.one, Q.one, Q.zero),
  ]);
}

/** Curved is a function whose concavity is known on x > 0, with its value and derivative as numbers. */
interface Curved {
  readonly f: string;
  readonly x0: number;
  readonly concaveDown: boolean;
  readonly f2: Text;
  readonly at: (x: number) => number;
  readonly slope: (x: number) => number;
}

/** curved chooses a function with known concavity and a point at which to linearize it. */
function curved(rng: Rng): Curved {
  const kind = rng.int(0, 3);
  const a = rng.int(1, 9);
  if (kind === 0)
    return {
      f: "\\sqrt{x}",
      x0: a * a,
      concaveDown: true,
      f2: t("$f''(x) = -\\frac{1}{4}x^{-3/2}$, which is negative for $x > 0$", "$f''(x) = -\\frac{1}{4}x^{-3/2}$，当 $x > 0$ 时为负"),
      at: Math.sqrt,
      slope: (x) => 1 / (2 * Math.sqrt(x)),
    };
  if (kind === 1) {
    const k = rng.nonZero(-4, 4);
    const e = `e^{${poly([k, "x"])}}`;
    return {
      f: e,
      x0: 0,
      concaveDown: false,
      f2: t(`$f''(x) = ${k * k === 1 ? "" : k * k}${e}$, which is positive`, `$f''(x) = ${k * k === 1 ? "" : k * k}${e}$，为正`),
      at: (x) => Math.exp(k * x),
      slope: (x) => k * Math.exp(k * x),
    };
  }
  if (kind === 2)
    return {
      f: "\\ln x",
      x0: a,
      concaveDown: true,
      f2: t("$f''(x) = -\\frac{1}{x^{2}}$, which is negative", "$f''(x) = -\\frac{1}{x^{2}}$，为负"),
      at: Math.log,
      slope: (x) => 1 / x,
    };
  const n = rng.int(2, 5);
  return {
    f: `x^{${n}}`,
    x0: a,
    concaveDown: false,
    f2: t(
      n === 2
        ? "$f''(x) = 2$, which is positive"
        : `$f''(x) = ${n * (n - 1)}x${n === 3 ? "" : `^{${n - 2}}`}$, which is positive for $x > 0$`,
      n === 2 ? "$f''(x) = 2$，为正" : `$f''(x) = ${n * (n - 1)}x${n === 3 ? "" : `^{${n - 2}}`}$，当 $x > 0$ 时为正`,
    ),
    at: (x) => x ** n,
    slope: (x) => n * x ** (n - 1),
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
  intro: t(
    `The tangent line to $f(x) = x^{2}$ at $x = 3$ has slope $f'(3) = 6$ and passes through $(3, 9)$, so it is $y = 9 + 6(x - 3)$. Near $x = 3$ the curve and the line are close: at $x = 3.1$ the line gives $9.6$ and the curve gives $3.1^{2} = 9.61$.

Check: in slope-intercept form the line is $y = 6x - 9$, and $6 \\cdot 3.1 - 9 = 9.6$.

In this lesson we use the tangent line, called the linearization, to estimate values of a function, and tell from the concavity whether the estimate is too big or too small.`,
    `$f(x) = x^{2}$ 在 $x = 3$ 处的切线斜率为 $f'(3) = 6$，经过 $(3, 9)$，所以切线是 $y = 9 + 6(x - 3)$。在 $x = 3$ 附近，曲线和这条直线很接近：在 $x = 3.1$ 处，直线给出 $9.6$，曲线给出 $3.1^{2} = 9.61$。

检验：写成斜截式，这条直线是 $y = 6x - 9$，而 $6 \\cdot 3.1 - 9 = 9.6$。

这节课我们用切线，也就是线性化，来估计函数值，并由凹凸性判断估计偏大还是偏小。`,
  ),
  knowledgePoints: [
    {
      id: "finding-a-linearization",
      figure: calculusDrawings2["approximating-functions-using-local-linearity-and-linearization#finding-a-linearization"],
      title: t("Finding a linearization", "求线性化"),
      explanation: t(
        "Near $x = a$ the graph of a differentiable function looks like its tangent line. The linearization of $f$ at $a$ is that line:\n\n$$L(x) = f(a) + f'(a)(x - a).$$\n\nFor $f(x) = \\sqrt{x}$ at $a = 4$, $f(4) = 2$ and $f'(4) = \\frac{1}{4}$, so\n\n$$L(x) = 2 + \\frac{1}{4}(x - 4) = \\frac{1}{4}x + 1.$$\n\nCheck: $L(4) = 1 + 1 = 2$, which is $f(4)$, so the line touches the curve at $x = 4$.\n\n> **Watch out.** Use $x - a$, not $x$, in the second term. Writing $f(a) + f'(a)x$ gives a line with the right slope that misses the point $(a, f(a))$.",
        "在 $x = a$ 附近，可导函数的图像看起来就像它的切线。$f$ 在 $a$ 处的线性化就是这条切线：\n\n$$L(x) = f(a) + f'(a)(x - a).$$\n\n对 $a = 4$ 处的 $f(x) = \\sqrt{x}$，$f(4) = 2$，$f'(4) = \\frac{1}{4}$，所以\n\n$$L(x) = 2 + \\frac{1}{4}(x - 4) = \\frac{1}{4}x + 1.$$\n\n检验：$L(4) = 1 + 1 = 2$，正是 $f(4)$，所以这条直线在 $x = 4$ 处与曲线相切。\n\n> **注意。** 第二项要用 $x - a$，而不是 $x$。写成 $f(a) + f'(a)x$ 得到的直线斜率虽然对，却不经过点 $(a, f(a))$。",
      ),
      generate(rng) {
        const L = linearizable(rng);
        const a = L.a.toLatex();
        const intercept = L.fa.sub(L.da.mul(L.a));
        const shift = L.a.sign() === 0 ? "x" : `(${poly([1, "x"], [L.a.neg(), ""])})`;
        return functionProblem({
          prompt: t(
            `Find the linearization $L(x)$ of $f(x) = ${L.f}$ at $a = ${a}$.`,
            `求 $f(x) = ${L.f}$ 在 $a = ${a}$ 处的线性化 $L(x)$。`,
          ),
          prefix: "L(x) =",
          answer: L.answer,
          wrong: L.wrong,
          solution: walked(
            [
              [["Differentiate", "求导"], t("The derivative of $f$ is", "$f$ 的导数为"), [`f'(x) = ${L.df}`]],
              [
                ["Evaluate at a", "在 a 处求值"],
                t(`At $a = ${a}$ the value and the slope are`, `在 $a = ${a}$ 处，函数值和斜率为`),
                [`f(${a}) = ${L.fa.toLatex()}, \\quad f'(${a}) = ${L.da.toLatex()}`],
              ],
              [
                ["Write the line", "写出直线"],
                t("Put them into $L(x) = f(a) + f'(a)(x - a)$ and expand.", "代入 $L(x) = f(a) + f'(a)(x - a)$ 并展开。"),
                [`L(x) = ${L.fa.toLatex()} + ${pq(L.da)}${shift} = ${L.answer}`],
              ],
            ],
            t(
              `The line must pass through $(${a}, f(${a}))$. Substituting $x = ${a}$ into the expanded form gives\n\n$$L(${a}) = ${pq(L.da)} \\cdot ${pq(L.a)}${plusTerm(intercept)} = ${L.fa.toLatex()}$$\n\nThis is $f(${a})$, and the coefficient of $x$ is $f'(${a})$.`,
              `这条直线必须经过 $(${a}, f(${a}))$。把 $x = ${a}$ 代入展开式得\n\n$$L(${a}) = ${pq(L.da)} \\cdot ${pq(L.a)}${plusTerm(intercept)} = ${L.fa.toLatex()}$$\n\n这正是 $f(${a})$，而 $x$ 的系数正是 $f'(${a})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "estimating-values-with-a-linearization",
      title: t("Estimating values with a linearization", "用线性化估计函数值"),
      explanation: t(
        "Near a point, a curve is close to its tangent line, so the tangent line gives a good estimate of values a small step away. To estimate $f(a + h)$ for small $h$, use $f(a + h) \\approx f(a) + f'(a) \\, h$. Only the value and the derivative at $a$ are needed. If $f(2) = 5$ and $f'(2) = 3$, then $f(2.1) \\approx 5 + 3(0.1) = 5.3$.\n\nCheck: the step is $h = 2.1 - 2 = 0.1$, and the line rises $3$ per unit, so $0.3$ over the step, and $5 + 0.3 = 5.3$.\n\n> **Watch out.** Multiply $f'(a)$ by the step $h$, not by the new $x$. Here $5 + 3(2.1)$ would be far off.",
        "在一点附近，曲线与它的切线很接近，所以切线可以很好地估计稍微偏离该点处的函数值。当 $h$ 很小时，用 $f(a + h) \\approx f(a) + f'(a) \\, h$ 估计 $f(a + h)$。只需要 $a$ 处的函数值和导数。若 $f(2) = 5$，$f'(2) = 3$，则 $f(2.1) \\approx 5 + 3(0.1) = 5.3$。\n\n检验：步长为 $h = 2.1 - 2 = 0.1$，直线每单位上升 $3$，所以这一步上升 $0.3$，而 $5 + 0.3 = 5.3$。\n\n> **注意。** 要用 $f'(a)$ 乘以步长 $h$，而不是乘以新的 $x$。这里 $5 + 3(2.1)$ 就差得很远。",
      ),
      generate(rng) {
        const a = rng.int(-5, 8);
        const fa = rng.int(-20, 20);
        const da = rng.nonZero(-9, 9);
        const h = Q.of(rng.nonZero(-9, 9), rng.pick([10, 100]));
        const x = Q.of(a).add(h);
        const answer = Q.of(fa).add(Q.of(da).mul(h));
        const b = Q.of(fa - da * a);
        return numberProblem({
          prompt: t(
            `$f(${a}) = ${fa}$ and $f'(${a}) = ${da}$. Use a linearization to estimate $f(${dec(x)})$.`,
            `$f(${a}) = ${fa}$，$f'(${a}) = ${da}$。用线性化估计 $f(${dec(x)})$。`,
          ),
          answer,
          form: "decimal",
          wrong: [Q.of(fa).add(Q.of(da).mul(x)), Q.of(fa).sub(Q.of(da).mul(h)), Q.of(fa + da)],
          solution: walked(
            [
              [
                ["Find the step", "求步长"],
                t(`The step from $a = ${a}$ is`, `从 $a = ${a}$ 出发的步长为`),
                [`h = ${dec(x)} - ${par(a)} = ${dec(h)}`],
              ],
              [
                ["Follow the tangent line", "沿切线走"],
                t("Add the slope times the step to the known value.", "把斜率乘以步长加到已知的值上。"),
                [`f(${dec(x)}) \\approx ${fa} + ${par(da)} \\cdot ${pd(h)} = ${dec(answer)}`],
              ],
            ],
            t(
              `Write the tangent line in slope-intercept form instead: $y = ${poly([da, "x"], [b, ""])}$. At $x = ${dec(x)}$ it gives\n\n$$${da} \\cdot ${pd(x)}${plusTerm(b)} = ${dec(answer)}$$\n\nThis is the same estimate.`,
              `改把切线写成斜截式：$y = ${poly([da, "x"], [b, ""])}$。在 $x = ${dec(x)}$ 处它给出\n\n$$${da} \\cdot ${pd(x)}${plusTerm(b)} = ${dec(answer)}$$\n\n得到同样的估计值。`,
            ),
          ),
        });
      },
    },
    {
      id: "over-and-underestimates",
      figure: calculusDrawings2["approximating-functions-using-local-linearity-and-linearization#over-and-underestimates"],
      title: t("Overestimates and underestimates", "估计偏大还是偏小"),
      explanation: t(
        "Where $f$ is concave up, the graph lies above its tangent lines, so a linearization underestimates $f$. Where $f$ is concave down, the graph lies below them and the linearization overestimates. For example, $\\sqrt{x}$ is concave down, and its linearization at $4$ gives $\\sqrt{4.1} \\approx 2 + \\frac{0.1}{4} = 2.025$, a little too big.\n\nCheck: $2.025^{2} = 4.100625$, more than $4.1$, so $2.025$ is indeed larger than $\\sqrt{4.1}$.\n\n> **Watch out.** The answer depends on the concavity, not on whether the step is to the left or to the right. A tangent line stays on the same side of the curve on both sides of the point of tangency.",
        "$f$ 上凹的地方，图像在切线上方，所以线性化低估 $f$。$f$ 下凹的地方，图像在切线下方，线性化高估 $f$。例如 $\\sqrt{x}$ 下凹，它在 $4$ 处的线性化给出 $\\sqrt{4.1} \\approx 2 + \\frac{0.1}{4} = 2.025$，稍微偏大。\n\n检验：$2.025^{2} = 4.100625$，大于 $4.1$，所以 $2.025$ 确实大于 $\\sqrt{4.1}$。\n\n> **注意。** 结论取决于凹凸性，而不取决于步长是向左还是向右。在切点两侧，切线都位于曲线的同一侧。",
      ),
      generate(rng) {
        const c = curved(rng);
        const options = [t("An overestimate", "偏大"), t("An underestimate", "偏小")];
        const right = c.concaveDown ? 0 : 1;
        const dx = rng.pick([-1, 1]) * rng.pick([1, 2, 5]);
        const near = Q.of(c.x0 * 10 + dx, 10);
        const n = near.toNumber();
        const estimate = c.at(c.x0) + c.slope(c.x0) * (n - c.x0);
        return reasoned(
          oneOf(
            rng,
            t(
              `The linearization of $f(x) = ${c.f}$ at $a = ${c.x0}$ is used to estimate $f(${dec(near)})$. Is the estimate an overestimate or an underestimate?`,
              `用 $f(x) = ${c.f}$ 在 $a = ${c.x0}$ 处的线性化估计 $f(${dec(near)})$。这个估计值偏大还是偏小？`,
            ),
            options[right]!,
            [options[1 - right]!],
            walked(
              [
                [["Find the sign of f''", "求 f'' 的符号"], t(`${c.f2.en}.`, `${c.f2["zh-CN"]}。`)],
                [
                  ["Compare the curve with its tangent", "比较曲线和切线"],
                  t(
                    `So $f$ is concave ${c.concaveDown ? "down and lies below" : "up and lies above"} its tangent lines. The tangent line at $a = ${c.x0}$ gives values that are too ${c.concaveDown ? "big" : "small"}: the estimate is ${c.concaveDown ? "an overestimate" : "an underestimate"}.`,
                    `所以 $f$ ${c.concaveDown ? "下凹，图像在切线下方" : "上凹，图像在切线上方"}。$a = ${c.x0}$ 处的切线给出的值${c.concaveDown ? "偏大" : "偏小"}：估计值${c.concaveDown ? "偏大" : "偏小"}。`,
                  ),
                ],
              ],
              t(
                `With a calculator, the linearization gives about $${fmt(estimate, 6)}$, and $f(${dec(near)}) \\approx ${fmt(c.at(n), 6)}$. The estimate is ${c.concaveDown ? "larger" : "smaller"}.`,
                `用计算器算，线性化给出约 $${fmt(estimate, 6)}$，而 $f(${dec(near)}) \\approx ${fmt(c.at(n), 6)}$。估计值${c.concaveDown ? "更大" : "更小"}。`,
              ),
            ),
          ),
          [
            [
              options[0]!.en,
              "The curve lies above its tangent lines here, so the line gives values that are too small.",
              "这里曲线在切线上方，所以直线给出的值偏小。",
            ],
            [
              options[1]!.en,
              "The curve lies below its tangent lines here, so the line gives values that are too big.",
              "这里曲线在切线下方，所以直线给出的值偏大。",
            ],
          ],
        );
      },
    },
  ],
};

/** powerOf raises a rational to a whole power. */
const powerOf = (q: Q, n: number) => {
  let out = Q.one;
  for (let i = 0; i < n; i++) out = out.mul(q);
  return out;
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
  intro: t(
    `To estimate $\\sqrt{9.2}$, linearize $f(x) = \\sqrt{x}$ at $9$, where the root is exact: $f(9) = 3$ and $f'(9) = \\frac{1}{6}$. Then $\\sqrt{9.2} \\approx 3 + \\frac{1}{6}(0.2) \\approx 3.0333$.

Check: $3.0333^{2} \\approx 9.2009$, very close to $9.2$.

In this lesson we estimate square roots, cube roots and powers near values we know exactly.`,
    `估计 $\\sqrt{9.2}$ 时，把 $f(x) = \\sqrt{x}$ 在 $9$ 处线性化，那里的根是精确的：$f(9) = 3$，$f'(9) = \\frac{1}{6}$。于是 $\\sqrt{9.2} \\approx 3 + \\frac{1}{6}(0.2) \\approx 3.0333$。

检验：$3.0333^{2} \\approx 9.2009$，非常接近 $9.2$。

这节课我们在已知精确值的数附近估计平方根、立方根和幂。`,
  ),
  knowledgePoints: [
    {
      id: "approximating-square-roots",
      title: t("Approximating square roots", "近似平方根"),
      explanation: t(
        "Choose the perfect square nearest to the number, because the tangent line estimate is most accurate when the step from the known point is small. To estimate $\\sqrt{n}$, linearize $f(x) = \\sqrt{x}$ at the nearest perfect square $a^{2}$: $f'(a^{2}) = \\frac{1}{2a}$, so $\\sqrt{a^{2} + h} \\approx a + \\frac{h}{2a}$. For $\\sqrt{26}$: $5 + \\frac{1}{10} = 5.1$.\n\nCheck: $5.1^{2} = 26.01$, very close to $26$.\n\n> **Watch out.** The slope at $a^{2}$ is $\\frac{1}{2a}$, not $\\frac{1}{a}$. Forgetting the $2$ doubles the correction.",
        "选择离这个数最近的完全平方数，因为离已知点的步长越小，切线估计就越准确。估计 $\\sqrt{n}$ 时，把 $f(x) = \\sqrt{x}$ 在最近的完全平方数 $a^{2}$ 处线性化：$f'(a^{2}) = \\frac{1}{2a}$，所以 $\\sqrt{a^{2} + h} \\approx a + \\frac{h}{2a}$。对 $\\sqrt{26}$：$5 + \\frac{1}{10} = 5.1$。\n\n检验：$5.1^{2} = 26.01$，非常接近 $26$。\n\n> **注意。** 在 $a^{2}$ 处的斜率是 $\\frac{1}{2a}$，而不是 $\\frac{1}{a}$。漏掉 $2$ 会让修正量翻倍。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const h = rng.nonZero(-3, 3);
        const n = a * a + h;
        const answer = Q.of(a).add(Q.of(h, 2 * a));
        const square = answer.mul(answer);
        return numberProblem({
          prompt: t(
            `Use a linearization of $\\sqrt{x}$ at a perfect square to estimate $\\sqrt{${n}}$. Give the exact value of the estimate.`,
            `用 $\\sqrt{x}$ 在某个完全平方数处的线性化估计 $\\sqrt{${n}}$。给出估计值的精确值。`,
          ),
          answer,
          wrong: [Q.of(a).add(Q.of(h, a)), Q.of(a).add(Q.of(h, 2)), Q.of(a).sub(Q.of(h, 2 * a))],
          solution: walked(
            [
              [
                ["Pick the perfect square", "选完全平方数"],
                t(
                  `The perfect square nearest to $${n}$ is $${a * a}$, with $\\sqrt{${a * a}} = ${a}$. Since $f'(x) = \\frac{1}{2\\sqrt{x}}$, the slope there is`,
                  `离 $${n}$ 最近的完全平方数是 $${a * a}$，$\\sqrt{${a * a}} = ${a}$。由于 $f'(x) = \\frac{1}{2\\sqrt{x}}$，那里的斜率为`,
                ),
                [`f'(${a * a}) = \\frac{1}{${2 * a}}`],
              ],
              [
                ["Linearize", "线性化"],
                t(`The step is $${n} - ${a * a} = ${h}$.`, `步长为 $${n} - ${a * a} = ${h}$。`),
                [`\\sqrt{${n}} \\approx ${a} + \\frac{1}{${2 * a}} \\cdot ${par(h)} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `Square the estimate:\n\n$$\\left(${answer.toLatex()}\\right)^{2} = ${square.toLatex()} ${Number(fmt(square.toNumber())) === square.toNumber() ? "=" : "\\approx"} ${fmt(square.toNumber())}$$\n\nThis is very close to $${n}$, and a little above it, since $\\sqrt{x}$ is concave down.`,
              `把估计值平方：\n\n$$\\left(${answer.toLatex()}\\right)^{2} = ${square.toLatex()} ${Number(fmt(square.toNumber())) === square.toNumber() ? "=" : "\\approx"} ${fmt(square.toNumber())}$$\n\n它非常接近 $${n}$，而且稍大一些，因为 $\\sqrt{x}$ 是下凹的。`,
            ),
          ),
        });
      },
    },
    {
      id: "approximating-cube-roots-and-powers",
      title: t("Approximating cube roots and powers", "近似立方根和幂"),
      explanation: t(
        "Pick a nearby point where the root or power is easy to compute exactly, and use the derivative there to adjust for the small difference. The same idea works for any power. $\\sqrt[3]{a^{3} + h} \\approx a + \\frac{h}{3a^{2}}$, and $(a + h)^{n} \\approx a^{n} + na^{n - 1}h$. For $(2.01)^{5}$: $32 + 80(0.01) = 32.8$.\n\nCheck: the exact value is $(2.01)^{5} \\approx 32.808$, a little above $32.8$, as expected since $x^{5}$ is concave up for $x > 0$.\n\n> **Watch out.** The derivative of $x^{n}$ at $a$ is $na^{n - 1}$. Using $a^{n - 1}$ or $n$ alone gives the wrong correction.",
        "选一个附近的、根或幂容易精确算出的点，再用该点的导数修正这个小差别。同样的思路适用于任何幂。$\\sqrt[3]{a^{3} + h} \\approx a + \\frac{h}{3a^{2}}$，$(a + h)^{n} \\approx a^{n} + na^{n - 1}h$。对 $(2.01)^{5}$：$32 + 80(0.01) = 32.8$。\n\n检验：精确值为 $(2.01)^{5} \\approx 32.808$，比 $32.8$ 稍大，这是意料之中的，因为 $x^{5}$ 在 $x > 0$ 时上凹。\n\n> **注意。** $x^{n}$ 在 $a$ 处的导数是 $na^{n - 1}$。只用 $a^{n - 1}$ 或只用 $n$ 都会得到错误的修正量。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = rng.int(2, 5);
          const h = rng.nonZero(-4, 4);
          const n = a ** 3 + h;
          const answer = Q.of(a).add(Q.of(h, 3 * a * a));
          const cube = answer.toNumber() ** 3;
          return numberProblem({
            prompt: t(
              `Use a linearization of $\\sqrt[3]{x}$ at a perfect cube to estimate $\\sqrt[3]{${n}}$. Give the exact value of the estimate.`,
              `用 $\\sqrt[3]{x}$ 在某个完全立方数处的线性化估计 $\\sqrt[3]{${n}}$。给出估计值的精确值。`,
            ),
            answer,
            wrong: [Q.of(a).add(Q.of(h, 3 * a)), Q.of(a).add(Q.of(h, 2 * a)), Q.of(a).sub(Q.of(h, 3 * a * a))],
            solution: walked(
              [
                [
                  ["Find the slope at the perfect cube", "求完全立方数处的斜率"],
                  t(
                    `The perfect cube nearest to $${n}$ is $${a ** 3}$, with $\\sqrt[3]{${a ** 3}} = ${a}$. Since $f(x) = \\sqrt[3]{x}$ has $f'(x) = \\frac{1}{3x^{2/3}}$, the slope there is`,
                    `离 $${n}$ 最近的完全立方数是 $${a ** 3}$，$\\sqrt[3]{${a ** 3}} = ${a}$。由于 $f(x) = \\sqrt[3]{x}$ 的导数为 $f'(x) = \\frac{1}{3x^{2/3}}$，那里的斜率为`,
                  ),
                  [`f'(${a ** 3}) = \\frac{1}{3 \\cdot ${a * a}} = \\frac{1}{${3 * a * a}}`],
                ],
                [
                  ["Linearize", "线性化"],
                  t(`The step is $${n} - ${a ** 3} = ${h}$.`, `步长为 $${n} - ${a ** 3} = ${h}$。`),
                  [`\\sqrt[3]{${n}} \\approx ${a} + \\frac{1}{${3 * a * a}} \\cdot ${par(h)} = ${answer.toLatex()}`],
                ],
              ],
              t(
                `Cube the estimate:\n\n$$\\left(${answer.toLatex()}\\right)^{3} \\approx ${fmt(cube)}$$\n\nThis is very close to $${n}$.`,
                `把估计值立方：\n\n$$\\left(${answer.toLatex()}\\right)^{3} \\approx ${fmt(cube)}$$\n\n它非常接近 $${n}$。`,
              ),
            ),
          });
        }
        const a = rng.int(1, 3);
        const n = rng.int(2, a === 1 ? 9 : a === 2 ? 6 : 4);
        const h = Q.of(rng.nonZero(-3, 3), 100);
        const slope = n * a ** (n - 1);
        const answer = Q.of(a ** n).add(Q.of(slope).mul(h));
        const x = Q.of(a).add(h);
        const exact = powerOf(x, n).toNumber();
        return numberProblem({
          prompt: t(
            `Use a linearization of $x^{${n}}$ at $x = ${a}$ to estimate $(${dec(x)})^{${n}}$.`,
            `用 $x^{${n}}$ 在 $x = ${a}$ 处的线性化估计 $(${dec(x)})^{${n}}$。`,
          ),
          answer,
          form: "decimal",
          wrong: [Q.of(a ** n).add(Q.of(a ** (n - 1)).mul(h)), Q.of(a ** n).add(Q.of(n).mul(h)), Q.of(a ** n).sub(Q.of(slope).mul(h))],
          solution: walked(
            [
              [
                ["Find the slope", "求斜率"],
                t(
                  `The derivative of $x^{${n}}$ is $${n}x${n === 2 ? "" : `^{${n - 1}}`}$, so at $x = ${a}$ the slope is`,
                  `$x^{${n}}$ 的导数是 $${n}x${n === 2 ? "" : `^{${n - 1}}`}$，所以在 $x = ${a}$ 处斜率为`,
                ),
                [`f'(${a}) = ${n} \\cdot ${a}${n === 2 ? "" : `^{${n - 1}}`} = ${slope}`],
              ],
              [
                ["Linearize", "线性化"],
                t(
                  `The value at $x = ${a}$ is $${a}^{${n}} = ${a ** n}$, and the step is $${dec(h)}$.`,
                  `在 $x = ${a}$ 处的值为 $${a}^{${n}} = ${a ** n}$，步长为 $${dec(h)}$。`,
                ),
                [`(${dec(x)})^{${n}} \\approx ${a ** n} + ${slope} \\cdot ${pd(h)} = ${dec(answer)}`],
              ],
            ],
            t(
              `Multiplying out exactly gives $(${dec(x)})^{${n}} \\approx ${fmt(exact, 5)}$, close to the estimate $${dec(answer)}$. The estimate is a little low, since $x^{${n}}$ is concave up for $x > 0$.`,
              `直接精确计算得 $(${dec(x)})^{${n}} \\approx ${fmt(exact, 5)}$，与估计值 $${dec(answer)}$ 很接近。估计值稍小，因为 $x^{${n}}$ 在 $x > 0$ 时上凹。`,
            ),
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

/** NearAngle is a step of d degrees from a special angle, for sine or cosine, whose estimates round cleanly. */
interface NearAngle {
  readonly b: BaseAngle;
  readonly d: number;
  readonly sine: boolean;
  readonly answer: Q;
  readonly noRadians: Q;
  readonly backwards: Q;
}

/** nearAngles are the steps from special angles used in problems. */
const nearAngles: readonly NearAngle[] = baseAngles.flatMap((b) =>
  [-3, -2, -1, 1, 2, 3].flatMap((d) =>
    [true, false].flatMap((sine) => {
      const step = (d * Math.PI) / 180;
      const [v, dv] = sine ? [b.sin, b.cos] : [b.cos, -b.sin];
      const answer = rounded(v + dv * step, 3);
      const noRadians = rounded(v + dv * d, 3);
      const backwards = rounded(v - dv * step, 3);
      return answer && noRadians && backwards ? [{ b, d, sine, answer, noRadians, backwards }] : [];
    }),
  ),
);

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
  intro: t(
    `Linearize $f(x) = \\sin x$ at $0$: $f(0) = 0$ and $f'(0) = \\cos 0 = 1$, so $L(x) = x$. For a small angle in radians, $\\sin x \\approx x$, for instance $\\sin 0.1 \\approx 0.1$.

Check: a calculator gives $\\sin 0.1 \\approx 0.0998$, which differs from $0.1$ by less than $0.0002$.

In this lesson we estimate sines, cosines and tangents of small angles, and of angles near $30^{\\circ}$, $45^{\\circ}$ and $60^{\\circ}$.`,
    `把 $f(x) = \\sin x$ 在 $0$ 处线性化：$f(0) = 0$，$f'(0) = \\cos 0 = 1$，所以 $L(x) = x$。对弧度制下很小的角，$\\sin x \\approx x$，例如 $\\sin 0.1 \\approx 0.1$。

检验：计算器给出 $\\sin 0.1 \\approx 0.0998$，与 $0.1$ 相差不到 $0.0002$。

这节课我们估计小角的正弦、余弦和正切，以及 $30^{\\circ}$、$45^{\\circ}$、$60^{\\circ}$ 附近的角的三角函数值。`,
  ),
  knowledgePoints: [
    {
      id: "small-angle-approximations",
      figure: calculusDrawings2["approximating-trigonometric-functions-using-local-linearity#small-angle-approximations"],
      title: t("Small angle approximations", "小角近似"),
      explanation: t(
        "Near zero, the graphs of sine and tangent hug the line through the origin with slope one, while cosine stays close to its maximum of one. Linearizing at $0$ gives $\\sin x \\approx x$, $\\tan x \\approx x$ and $\\cos x \\approx 1$ for small $x$ in radians. Near $\\pi$, $\\sin(\\pi + h) \\approx -h$, since $\\sin \\pi = 0$ and $\\cos \\pi = -1$.\n\nCheck: a calculator gives $\\sin 0.05 \\approx 0.049979$ and $\\cos 0.05 \\approx 0.99875$, close to $0.05$ and $1$.\n\n> **Watch out.** These hold only for angles in radians. $\\sin 2^{\\circ}$ is about $0.0349$, not $2$.",
        "在零附近，正弦和正切的图像紧贴着经过原点、斜率为 1 的直线，而余弦则保持在最大值 1 附近。在 $0$ 处线性化，对弧度制下很小的 $x$，有 $\\sin x \\approx x$，$\\tan x \\approx x$，$\\cos x \\approx 1$。在 $\\pi$ 附近，由于 $\\sin \\pi = 0$，$\\cos \\pi = -1$，有 $\\sin(\\pi + h) \\approx -h$。\n\n检验：计算器给出 $\\sin 0.05 \\approx 0.049979$，$\\cos 0.05 \\approx 0.99875$，分别接近 $0.05$ 和 $1$。\n\n> **注意。** 这些近似只对弧度制的角成立。$\\sin 2^{\\circ}$ 约为 $0.0349$，而不是 $2$。",
      ),
      generate(rng) {
        const h = Q.of(rng.nonZero(-9, 9), rng.pick([100, 1000]));
        const k = rng.int(1, 9);
        const c = rng.int(-5, 5);
        const kind = rng.int(0, 2);
        const fn = kind === 0 ? "\\sin" : kind === 1 ? "\\tan" : "\\cos";
        const linear = kind === 2 ? Q.zero : Q.of(k).mul(h);
        const answer = Q.of(c).add(kind === 2 ? Q.of(k) : linear);
        const expr = `${k === 1 ? "" : k}${fn}(${dec(h)})${plusTerm(c)}`;
        const hv = h.toNumber();
        const exact = k * (kind === 0 ? Math.sin(hv) : kind === 1 ? Math.tan(hv) : Math.cos(hv)) + c;
        return numberProblem({
          prompt: t(
            `Use a linearization at $0$ to estimate $${expr}$, where the angle is in radians.`,
            `用在 $0$ 处的线性化估计 $${expr}$（角为弧度制）。`,
          ),
          answer,
          form: "decimal",
          wrong: kind === 2 ? [Q.of(c), Q.of(c).add(Q.of(k).mul(h))] : [Q.of(c + k), Q.of(c).sub(linear), Q.of(c)],
          solution: walked(
            [
              [
                ["Linearize at 0", "在 0 处线性化"],
                kind === 2
                  ? t(
                      "$\\cos 0 = 1$, and the derivative $-\\sin x$ is $0$ at $0$, so near $0$ the linearization of $\\cos x$ is the constant $1$.",
                      "$\\cos 0 = 1$，而导数 $-\\sin x$ 在 $0$ 处为 $0$，所以在 $0$ 附近 $\\cos x$ 的线性化是常数 $1$。",
                    )
                  : t(
                      `$${fn} 0 = 0$, and the derivative ${kind === 0 ? "$\\cos x$" : "$\\sec^{2} x$"} is $1$ at $0$, so near $0$ we have $${fn} x \\approx x$.`,
                      `$${fn} 0 = 0$，而导数${kind === 0 ? " $\\cos x$ " : " $\\sec^{2} x$ "}在 $0$ 处为 $1$，所以在 $0$ 附近 $${fn} x \\approx x$。`,
                    ),
              ],
              [
                ["Estimate", "估计"],
                t("Replace the trigonometric value by its linearization.", "用线性化代替三角函数值。"),
                [`${expr} \\approx ${k} \\cdot ${kind === 2 ? "1" : pd(h)}${plusTerm(c)} = ${dec(answer)}`],
              ],
            ],
            t(
              `With a calculator, $${expr} \\approx ${fmt(exact, 6)}$, very close to the estimate.`,
              `用计算器算，$${expr} \\approx ${fmt(exact, 6)}$，与估计值非常接近。`,
            ),
          ),
        });
      },
    },
    {
      id: "approximations-near-special-angles",
      figure: calculusDrawings2["approximating-trigonometric-functions-using-local-linearity#approximations-near-special-angles"],
      title: t("Approximations near special angles", "特殊角附近的近似"),
      explanation: t(
        "To estimate $\\sin 31^{\\circ}$, linearize $\\sin x$ at $30^{\\circ} = \\frac{\\pi}{6}$, and convert the step to radians: $1^{\\circ} = \\frac{\\pi}{180}$. Then\n\n$$\\sin 31^{\\circ} \\approx \\sin \\frac{\\pi}{6} + \\cos \\frac{\\pi}{6} \\cdot \\frac{\\pi}{180} = \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\pi}{180} \\approx 0.515.$$\n\nCheck: a calculator gives $\\sin 31^{\\circ} \\approx 0.5150$.\n\n> **Watch out.** The derivative formulas only hold in radians. Using the step $1$ instead of $\\frac{\\pi}{180}$ gives $\\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\approx 1.366$, which is not even a possible value of a sine.",
        "估计 $\\sin 31^{\\circ}$ 时，把 $\\sin x$ 在 $30^{\\circ} = \\frac{\\pi}{6}$ 处线性化，并把步长换成弧度：$1^{\\circ} = \\frac{\\pi}{180}$。于是\n\n$$\\sin 31^{\\circ} \\approx \\sin \\frac{\\pi}{6} + \\cos \\frac{\\pi}{6} \\cdot \\frac{\\pi}{180} = \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\pi}{180} \\approx 0.515.$$\n\n检验：计算器给出 $\\sin 31^{\\circ} \\approx 0.5150$。\n\n> **注意。** 求导公式只在弧度制下成立。用步长 $1$ 代替 $\\frac{\\pi}{180}$ 会得到 $\\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\approx 1.366$，这根本不可能是正弦值。",
      ),
      generate(rng) {
        const { b, d, sine, answer, noRadians, backwards } = rng.pick(nearAngles);
        const step = (d * Math.PI) / 180;
        const [vL, dvL] = sine ? [b.sinL, b.cosL] : [b.cosL, `-${b.sinL}`];
        const fn = sine ? "\\sin" : "\\cos";
        const deg = b.deg + d;
        const exact = sine ? Math.sin((deg * Math.PI) / 180) : Math.cos((deg * Math.PI) / 180);
        return numberProblem({
          prompt: t(
            `Use a linearization at $${b.deg}^{\\circ}$ to estimate $${fn} ${deg}^{\\circ}$. Round to three decimal places.`,
            `用在 $${b.deg}^{\\circ}$ 处的线性化估计 $${fn} ${deg}^{\\circ}$，精确到三位小数。`,
          ),
          answer,
          form: "decimal",
          wrong: [noRadians, backwards],
          solution: walked(
            [
              [
                ["Convert the step to radians", "把步长换成弧度"],
                t(
                  `The step from $${b.deg}^{\\circ}$ to $${deg}^{\\circ}$ is $${d}^{\\circ}$. In radians it is`,
                  `从 $${b.deg}^{\\circ}$ 到 $${deg}^{\\circ}$ 的步长为 $${d}^{\\circ}$。换成弧度为`,
                ),
                [`${d} \\cdot \\frac{\\pi}{180} \\approx ${fmt(step, 5)}`],
              ],
              [
                ["Linearize", "线性化"],
                t(
                  `The derivative of $${fn} x$ is $${sine ? "\\cos x" : "-\\sin x"}$. At $${b.deg}^{\\circ}$ the value is $${vL}$ and the slope is $${dvL}$, so`,
                  `$${fn} x$ 的导数为 $${sine ? "\\cos x" : "-\\sin x"}$。在 $${b.deg}^{\\circ}$ 处函数值为 $${vL}$，斜率为 $${dvL}$，所以`,
                ),
                [
                  `${fn} ${deg}^{\\circ} \\approx ${vL} + \\left(${dvL}\\right)\\left(${d} \\cdot \\frac{\\pi}{180}\\right) \\approx ${dec(answer)}`,
                ],
              ],
            ],
            t(
              `A calculator gives $${fn} ${deg}^{\\circ} \\approx ${fmt(exact)}$, close to the estimate $${dec(answer)}$.`,
              `计算器给出 $${fn} ${deg}^{\\circ} \\approx ${fmt(exact)}$，与估计值 $${dec(answer)}$ 很接近。`,
            ),
          ),
        });
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
