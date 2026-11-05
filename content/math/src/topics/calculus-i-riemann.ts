import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, plane, poly, Q, radical } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { type Exact, exactLatex, exactMul, oneOf, type Poly, pLatex, power, rounded, specialAngles, table } from "./calculus-common.ts";

// Calculus I unit 8: Integration, modules 8.24 and 8.25.

/** qAt evaluates a polynomial with integer coefficients at a rational x. */
export const qAt = (p: Poly, x: Q) => p.reduce((s: Q, c, i) => s.add(Q.of(c).mul(x.pow(i))), Q.zero);

/** Rule is a way of choosing the heights in a Riemann sum. */
type Rule = "left" | "right" | "midpoint" | "trapezoidal";

/** ruleName names a rule in both languages. */
const ruleName: Record<Rule, Text> = {
  left: t("left Riemann sum", "左黎曼和"),
  right: t("right Riemann sum", "右黎曼和"),
  midpoint: t("midpoint Riemann sum", "中点黎曼和"),
  trapezoidal: t("trapezoidal rule", "梯形法则"),
};

/** ruleWithArticle names a rule in English with its article: "a left Riemann sum", "the trapezoidal rule". */
const ruleWithArticle = (rule: Rule) => `${rule === "trapezoidal" ? "the" : "a"} ${ruleName[rule].en}`;

/** Grid is a partition of [a, b] into n subintervals of width dx. */
interface Grid {
  readonly a: Q;
  readonly b: Q;
  readonly dx: Q;
  readonly n: number;
}

/** nodes are the n + 1 endpoints of a grid's subintervals. */
const nodes = (g: Grid) => Array.from({ length: g.n + 1 }, (_, i) => g.a.add(g.dx.mul(Q.of(i))));

/** sample lists the points a rule evaluates f at, each with its weight in units of dx. */
function sample(g: Grid, rule: Rule): [Q, Q][] {
  const xs = nodes(g);
  const half = Q.of(1, 2);
  if (rule === "left") return xs.slice(0, -1).map((x) => [x, Q.one]);
  if (rule === "right") return xs.slice(1).map((x) => [x, Q.one]);
  if (rule === "midpoint") return xs.slice(0, -1).map((x) => [x.add(g.dx.mul(half)), Q.one]);
  return xs.map((x, i) => [x, i === 0 || i === g.n ? half : Q.one]);
}

/** riemann computes the approximation of the area under f by a rule. */
function riemann(values: (x: Q) => Q, g: Grid, rule: Rule): Q {
  return sample(g, rule)
    .reduce((s, [x, w]) => s.add(values(x).mul(w)), Q.zero)
    .mul(g.dx);
}

/** riemannSteps writes the sum of a rule term by term: "\frac{1}{2}\left[f(1) + f(\frac{3}{2})\right]". */
function riemannSteps(g: Grid, rule: Rule, f = "f"): string {
  const terms = sample(g, rule).map(([x, w]) => `${w.eq(Q.one) ? "" : "\\tfrac{1}{2}"}${f}(${x.toLatex()})`);
  return `${g.dx.eq(Q.one) ? "" : g.dx.toLatex()}\\left[${terms.join(" + ")}\\right]`;
}

/** grid chooses a partition with small endpoints. */
function grid(rng: Rng, nMin = 3, nMax = 6): Grid {
  const dx = rng.pick([Q.of(1, 2), Q.one, Q.one, Q.of(2)]);
  const n = rng.int(nMin, nMax);
  const a = Q.of(rng.int(-2, 3));
  return { a, b: a.add(dx.mul(Q.of(n))), dx, n };
}

/** positivePoly chooses a quadratic or cubic that is positive at every point a rule may use on the grid. */
function positivePoly(rng: Rng, g: Grid): Poly {
  for (;;) {
    const p: Poly = rng.bool(0.3)
      ? [rng.int(-5, 9), rng.int(-3, 3), rng.int(-1, 1), rng.pick([-1, 1])]
      : [rng.int(-4, 12), rng.int(-4, 4), rng.nonZero(-2, 2)];
    const xs = [...nodes(g), ...sample(g, "midpoint").map(([x]) => x)];
    if (xs.every((x) => qAt(p, x).sign() > 0)) return p;
  }
}

/** intervalLatex writes [a, b]. */
const intervalLatex = (g: Grid) => `[${g.a.toLatex()}, ${g.b.toLatex()}]`;

/** formulaProblem asks for the approximation by a rule of the area under a polynomial. */
function formulaProblem(rng: Rng, rule: Rule) {
  const g = grid(rng, 3, rule === "midpoint" ? 5 : 6);
  const p = positivePoly(rng, g);
  const at = (x: Q) => qAt(p, x);
  const answer = riemann(at, g, rule);
  const others = (["left", "right", "midpoint", "trapezoidal"] as const).filter((r) => r !== rule).map((r) => riemann(at, g, r));
  const values = sample(g, rule).map(([x]) => `f(${x.toLatex()}) = ${at(x).toLatex()}`);
  const raw = sample(g, rule).reduce((s, [x, w]) => s.add(at(x).mul(w)), Q.zero);
  return numberProblem({
    prompt: t(
      `Approximate the area under the graph of $f(x) = ${pLatex(p)}$ on $${intervalLatex(g)}$ using ${ruleWithArticle(rule)} with $${g.n}$ subintervals of equal width.`,
      `用 $${g.n}$ 个等宽子区间的${ruleName[rule]["zh-CN"]}，近似计算 $f(x) = ${pLatex(p)}$ 的图像在 $${intervalLatex(g)}$ 上方与 $x$ 轴之间的面积。`,
    ),
    answer,
    wrong: [...others, raw, answer.mul(Q.of(2))],
    solution: t(
      `The width is $\\Delta x = \\frac{${g.b.toLatex()} - ${par(g.a)}}{${g.n}} = ${g.dx.toLatex()}$. Then $${values.join(", ")}$, and the approximation is $${riemannSteps(g, rule)} = ${answer.toLatex()}$.`,
      `宽度 $\\Delta x = \\frac{${g.b.toLatex()} - ${par(g.a)}}{${g.n}} = ${g.dx.toLatex()}$。$${values.join(", ")}$，近似值为 $${riemannSteps(g, rule)} = ${answer.toLatex()}$。`,
    ),
  });
}

/** par wraps a negative rational in parentheses. */
const par = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());

/** tableProblem asks for the approximation by a rule from a table of values. */
function tableProblem(rng: Rng, rule: Rule) {
  const base = grid(rng, 3, 5);
  // A midpoint sum from a table needs the midpoints in the table: the table is twice as fine.
  const g: Grid = rule === "midpoint" ? { ...base, dx: base.dx.mul(Q.of(2)), b: base.a.add(base.dx.mul(Q.of(2 * base.n))) } : base;
  const fine: Grid = rule === "midpoint" ? { ...g, dx: base.dx, n: 2 * g.n } : g;
  const xs = nodes(fine);
  const ys = xs.map(() => Q.of(rng.int(1, 20)));
  const at = (x: Q) => ys[xs.findIndex((y) => y.eq(x))] ?? Q.zero;
  const answer = riemann(at, g, rule);
  const wrong = (["left", "right", "trapezoidal"] as const).filter((r) => r !== rule).map((r) => riemann(at, g, r));
  const rows = table(["$x$", ...xs.map((x) => `$${x.toLatex()}$`)], ["$f(x)$", ...ys.map((y) => `$${y.toLatex()}$`)]);
  return numberProblem({
    prompt: t(
      `The table gives values of a continuous function $f$.\n\n${rows}\n\nUse ${ruleWithArticle(rule)} with $${g.n}$ subintervals of equal width to approximate the area under the graph of $f$ from $x = ${g.a.toLatex()}$ to $x = ${g.b.toLatex()}$.`,
      `下表给出连续函数 $f$ 的一些值。\n\n${rows}\n\n用 $${g.n}$ 个等宽子区间的${ruleName[rule]["zh-CN"]}，近似计算 $f$ 的图像从 $x = ${g.a.toLatex()}$ 到 $x = ${g.b.toLatex()}$ 下方的面积。`,
    ),
    answer,
    wrong: [...wrong, answer.div(g.dx)],
    solution: t(
      `The subintervals have width $\\Delta x = ${g.dx.toLatex()}$, so the approximation is $${riemannSteps(g, rule)} = ${answer.toLatex()}$.`,
      `子区间宽度 $\\Delta x = ${g.dx.toLatex()}$，所以近似值为 $${riemannSteps(g, rule)} = ${answer.toLatex()}$。`,
    ),
  });
}

/** approximatingAreasWithTheLeftRiemannSum approximates areas with left endpoints. */
export const approximatingAreasWithTheLeftRiemannSum: TopicDef = {
  id: "approximating-areas-with-the-left-riemann-sum",
  title: t("Approximating Areas With the Left Riemann Sum", "用左黎曼和近似面积"),
  summary: t(
    "Approximate the area under a graph with rectangles whose heights are taken at left endpoints.",
    "用以左端点处函数值为高的矩形近似图像下方的面积。",
  ),
  prerequisites: ["the-antiderivative"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "left-sums-from-a-formula",
      title: t("Left sums from a formula", "由公式求左黎曼和"),
      explanation: t(
        "To approximate the area under $y = f(x)$ on $[a, b]$, split the interval into $n$ subintervals of width $\\Delta x = \\frac{b - a}{n}$ with endpoints $x_{0} = a, x_{1}, \\ldots, x_{n} = b$. The **left Riemann sum** uses the height at the left end of each subinterval:\n\n$$L_{n} = \\Delta x\\left[f(x_{0}) + f(x_{1}) + \\cdots + f(x_{n - 1})\\right].$$",
        "要近似 $y = f(x)$ 在 $[a, b]$ 上的图像下方面积，把区间分成 $n$ 个宽为 $\\Delta x = \\frac{b - a}{n}$ 的子区间，端点为 $x_{0} = a, x_{1}, \\ldots, x_{n} = b$。**左黎曼和**取每个子区间左端点处的高：\n\n$$L_{n} = \\Delta x\\left[f(x_{0}) + f(x_{1}) + \\cdots + f(x_{n - 1})\\right]$$",
      ),
      generate: (rng) => formulaProblem(rng, "left"),
    },
    {
      id: "left-sums-from-a-table",
      title: t("Left sums from a table", "由表格求左黎曼和"),
      explanation: t(
        "With values in a table, read the heights at the left endpoints $x_{0}, \\ldots, x_{n - 1}$; the last value $f(x_{n})$ is not used. Multiply their sum by the width $\\Delta x$.",
        "函数值在表格中时，读出左端点 $x_{0}, \\ldots, x_{n - 1}$ 处的高，最后一个值 $f(x_{n})$ 不用。把它们的和乘以宽度 $\\Delta x$。",
      ),
      generate: (rng) => tableProblem(rng, "left"),
    },
  ],
};

/** approximatingAreasWithTheRightRiemannSum approximates areas with right endpoints. */
export const approximatingAreasWithTheRightRiemannSum: TopicDef = {
  id: "approximating-areas-with-the-right-riemann-sum",
  title: t("Approximating Areas With the Right Riemann Sum", "用右黎曼和近似面积"),
  summary: t(
    "Approximate areas with right endpoints, and tell when left and right sums overestimate or underestimate.",
    "用右端点近似面积，并判断左、右黎曼和何时高估或低估。",
  ),
  prerequisites: ["approximating-areas-with-the-left-riemann-sum", "determining-intervals-on-which-a-function-is-increasing-or-decreasing"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "right-sums",
      title: t("Right sums", "右黎曼和"),
      explanation: t(
        "The **right Riemann sum** uses the height at the right end of each subinterval:\n\n$$R_{n} = \\Delta x\\left[f(x_{1}) + f(x_{2}) + \\cdots + f(x_{n})\\right].$$\n\nIt differs from the left sum only in its first and last terms: $R_{n} - L_{n} = \\Delta x\\left[f(x_{n}) - f(x_{0})\\right]$.",
        "**右黎曼和**取每个子区间右端点处的高：\n\n$$R_{n} = \\Delta x\\left[f(x_{1}) + f(x_{2}) + \\cdots + f(x_{n})\\right]$$\n\n它与左黎曼和只差首尾两项：$R_{n} - L_{n} = \\Delta x\\left[f(x_{n}) - f(x_{0})\\right]$。",
      ),
      generate: (rng) => (rng.bool() ? formulaProblem(rng, "right") : tableProblem(rng, "right")),
    },
    {
      id: "overestimates-and-underestimates",
      title: t("Overestimates and underestimates", "高估与低估"),
      explanation: t(
        "If $f$ is increasing on $[a, b]$, each left rectangle lies under the curve and each right rectangle pokes above it: $L_{n}$ underestimates the area and $R_{n}$ overestimates it. If $f$ is decreasing, it is the other way round.",
        "若 $f$ 在 $[a, b]$ 上递增，每个左矩形都在曲线下方，每个右矩形都高出曲线：$L_{n}$ 低估面积，$R_{n}$ 高估面积。若 $f$ 递减，则正好相反。",
      ),
      generate(rng) {
        const kinds: [string, boolean][] = [
          ["e^{x}", true],
          ["\\sqrt{x}", true],
          ["\\ln x", true],
          ["x^{3}", true],
          ["e^{-x}", false],
          ["\\frac{1}{x}", false],
          ["\\frac{1}{x^{2}}", false],
          ["2^{-x}", false],
        ];
        const [f, increasing] = rng.pick(kinds);
        const a = rng.int(1, 4);
        const b = a + rng.int(2, 6);
        const n = rng.int(3, 8);
        const rule = rng.pick(["left", "right"] as const);
        const over = increasing === (rule === "right");
        const right = over ? t("An overestimate", "高估") : t("An underestimate", "低估");
        return reasoned(
          oneOf(
            rng,
            t(
              `The area under $y = ${f}$ on $[${a}, ${b}]$ is approximated by ${ruleWithArticle(rule)} with $${n}$ subintervals. Is the approximation an overestimate or an underestimate of the area?`,
              `用 $${n}$ 个子区间的${ruleName[rule]["zh-CN"]}近似 $y = ${f}$ 在 $[${a}, ${b}]$ 上的图像下方面积。这个近似值是高估还是低估？`,
            ),
            right,
            [
              over ? t("An underestimate", "低估") : t("An overestimate", "高估"),
              t("Exactly equal to the area", "恰好等于面积"),
              t("It cannot be determined", "无法判断"),
            ],
            t(
              `$y = ${f}$ is ${increasing ? "increasing" : "decreasing"} on $[${a}, ${b}]$, so the height at the ${rule} end of each subinterval is the ${over ? "largest" : "smallest"} value on it. Each rectangle ${over ? "contains" : "fits under"} the curve, so the sum is ${over ? "an overestimate" : "an underestimate"}.`,
              `$y = ${f}$ 在 $[${a}, ${b}]$ 上${increasing ? "递增" : "递减"}，所以每个子区间${rule === "left" ? "左" : "右"}端点处的高是该子区间上的${over ? "最大值" : "最小值"}。每个矩形都${over ? "盖住" : "位于"}曲线${over ? "" : "下方"}，所以这个和是${over ? "高估" : "低估"}。`,
            ),
          ),
          [
            [
              over ? "An underestimate" : "An overestimate",
              `The height at the ${rule} end is the ${over ? "largest" : "smallest"} on each subinterval, so each rectangle is ${over ? "above" : "below"} the curve.`,
              `${rule === "left" ? "左" : "右"}端的高度是每个小区间上${over ? "最大" : "最小"}的，所以每个矩形都在曲线${over ? "上方" : "下方"}。`,
            ],
            [
              "Exactly equal to the area",
              "Each rectangle has a flat top and the curve does not, so some area is missed or added.",
              "每个矩形的顶是平的，而曲线不是，所以总会少算或多算一些面积。",
            ],
            [
              "It cannot be determined",
              "The function only goes one way on this interval, and that decides it.",
              "函数在这个区间上是单调的，这就能判断了。",
            ],
          ],
        );
      },
    },
  ],
};

/** approximatingAreasWithTheMidpointRiemannSum approximates areas with midpoints. */
export const approximatingAreasWithTheMidpointRiemannSum: TopicDef = {
  id: "approximating-areas-with-the-midpoint-riemann-sum",
  title: t("Approximating Areas With the Midpoint Riemann Sum", "用中点黎曼和近似面积"),
  summary: t("Approximate areas with heights taken at the midpoints of the subintervals.", "用子区间中点处的高近似面积。"),
  prerequisites: ["approximating-areas-with-the-right-riemann-sum"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "midpoint-sums-from-a-formula",
      title: t("Midpoint sums from a formula", "由公式求中点黎曼和"),
      explanation: t(
        "The **midpoint Riemann sum** uses the height at the middle of each subinterval, $m_{i} = \\frac{x_{i - 1} + x_{i}}{2}$:\n\n$$M_{n} = \\Delta x\\left[f(m_{1}) + f(m_{2}) + \\cdots + f(m_{n})\\right].$$\n\nIt is usually much more accurate than the left or right sum with the same $n$.",
        "**中点黎曼和**取每个子区间中点 $m_{i} = \\frac{x_{i - 1} + x_{i}}{2}$ 处的高：\n\n$$M_{n} = \\Delta x\\left[f(m_{1}) + f(m_{2}) + \\cdots + f(m_{n})\\right]$$\n\n在 $n$ 相同时，它通常比左、右黎曼和精确得多。",
      ),
      generate: (rng) => formulaProblem(rng, "midpoint"),
    },
    {
      id: "midpoint-sums-from-a-table",
      title: t("Midpoint sums from a table", "由表格求中点黎曼和"),
      explanation: t(
        "A table can only give a midpoint sum if it lists the midpoints. With values at $0, 1, 2, 3, 4$ and two subintervals $[0, 2]$ and $[2, 4]$, the midpoints are $1$ and $3$, so $M_{2} = 2\\left[f(1) + f(3)\\right]$; the width is $2$, not $1$.",
        "只有表格列出中点处的值时，才能求中点黎曼和。若给出 $0, 1, 2, 3, 4$ 处的值，取两个子区间 $[0, 2]$ 和 $[2, 4]$，中点为 $1$ 和 $3$，所以 $M_{2} = 2\\left[f(1) + f(3)\\right]$；宽度是 $2$ 而不是 $1$。",
      ),
      generate: (rng) => tableProblem(rng, "midpoint"),
    },
  ],
};

/** approximatingAreasWithTheTrapezoidalRule approximates areas with trapezoids. */
export const approximatingAreasWithTheTrapezoidalRule: TopicDef = {
  id: "approximating-areas-with-the-trapezoidal-rule",
  title: t("Approximating Areas With the Trapezoidal Rule", "用梯形法则近似面积"),
  summary: t("Approximate areas with trapezoids instead of rectangles.", "用梯形代替矩形近似面积。"),
  prerequisites: ["approximating-areas-with-the-right-riemann-sum"],
  encompasses: [{ topic: "approximating-areas-with-the-right-riemann-sum", weight: 0.3 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "the-trapezoidal-rule-from-a-formula",
      title: t("The trapezoidal rule from a formula", "由公式用梯形法则"),
      explanation: t(
        "Joining the points of the graph above consecutive endpoints gives trapezoids of area $\\frac{\\Delta x}{2}\\left[f(x_{i - 1}) + f(x_{i})\\right]$. Adding them, the inner heights count twice:\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(x_{0}) + 2f(x_{1}) + \\cdots + 2f(x_{n - 1}) + f(x_{n})\\right] = \\frac{L_{n} + R_{n}}{2}.$$",
        "把相邻端点上方的图像点连起来，得到面积为 $\\frac{\\Delta x}{2}\\left[f(x_{i - 1}) + f(x_{i})\\right]$ 的梯形。相加时，内部的高各算两次：\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(x_{0}) + 2f(x_{1}) + \\cdots + 2f(x_{n - 1}) + f(x_{n})\\right] = \\frac{L_{n} + R_{n}}{2}$$",
      ),
      generate: (rng) => formulaProblem(rng, "trapezoidal"),
    },
    {
      id: "the-trapezoidal-rule-from-a-table",
      title: t("The trapezoidal rule from a table", "由表格用梯形法则"),
      explanation: t(
        "From a table, use every value: the two end values once and each inner value twice, then multiply by $\\frac{\\Delta x}{2}$. If $L_{n}$ and $R_{n}$ are already known, $T_{n}$ is their average.",
        "由表格计算时，每个值都要用：两端的值各用一次，内部的值各用两次，再乘以 $\\frac{\\Delta x}{2}$。若已知 $L_{n}$ 和 $R_{n}$，$T_{n}$ 就是它们的平均值。",
      ),
      generate(rng) {
        if (rng.bool(0.7)) return tableProblem(rng, "trapezoidal");
        const l = rng.int(10, 80);
        const r = l + rng.nonZero(-15, 15);
        const n = rng.int(4, 10);
        const answer = Q.of(l + r, 2);
        return numberProblem({
          prompt: t(
            `For a function $f$, the left and right Riemann sums with $${n}$ subintervals on an interval are $L_{${n}} = ${l}$ and $R_{${n}} = ${r}$. Find the trapezoidal approximation $T_{${n}}$ on the same interval.`,
            `对函数 $f$，某区间上 $${n}$ 个子区间的左、右黎曼和分别为 $L_{${n}} = ${l}$ 和 $R_{${n}} = ${r}$。求同一区间上的梯形近似 $T_{${n}}$。`,
          ),
          answer,
          wrong: [Q.of(l + r), Q.of(Math.abs(r - l), 2), Q.of(l + r, n)],
          solution: t(
            `$T_{${n}} = \\frac{L_{${n}} + R_{${n}}}{2} = \\frac{${l} + ${r}}{2} = ${answer.toLatex()}$.`,
            `$T_{${n}} = \\frac{L_{${n}} + R_{${n}}}{2} = \\frac{${l} + ${r}}{2} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** argLatex writes the argument c + d·i of f in a sum, such as "1 + \frac{1}{2}i". */
const argLatex = (c: Q, d: Q) => (c.isZero() ? poly([d, "i"]) : poly([c, ""], [d, "i"]));

/** dxFactor writes a width as a factor after f(…): "", " \cdot 2". */
const dxFactor = (dx: Q) => (dx.eq(Q.one) ? "" : ` \\cdot ${dx.toLatex()}`);

/** sigmaLatex writes Σ_{i=lo}^{hi} f(c + d·i)·dx. */
const sigmaLatex = (lo: number, hi: number, c: Q, d: Q, dx: Q | undefined) =>
  `\\sum_{i = ${lo}}^{${hi}} f\\left(${argLatex(c, d)}\\right)${dx ? dxFactor(dx) : ""}`;

/** leftAndRightRiemannSumsInSigmaNotation writes and evaluates left and right sums in sigma notation. */
export const leftAndRightRiemannSumsInSigmaNotation: TopicDef = {
  id: "left-and-right-riemann-sums-in-sigma-notation",
  title: t("Left and Right Riemann Sums in Sigma Notation", "用求和符号表示左、右黎曼和"),
  summary: t("Write left and right Riemann sums in sigma notation and evaluate them.", "用求和符号写出左、右黎曼和并求值。"),
  prerequisites: ["approximating-areas-with-the-right-riemann-sum", "sigma-notation"],
  encompasses: [
    { topic: "approximating-areas-with-the-right-riemann-sum", weight: 0.2 },
    { topic: "sigma-notation", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-left-and-right-sums",
      title: t("Writing left and right sums", "写出左、右黎曼和"),
      explanation: t(
        "Divide the interval into equal widths, then add up the areas of rectangles whose heights are taken at the left or right end of each piece. The endpoints are $x_{i} = a + i\\Delta x$. The left sum uses $i = 0$ to $n - 1$ and the right sum $i = 1$ to $n$:\n\n$$L_{n} = \\sum_{i = 0}^{n - 1} f(a + i\\Delta x)\\Delta x, \\qquad R_{n} = \\sum_{i = 1}^{n} f(a + i\\Delta x)\\Delta x.$$",
        "把区间分成等宽的小段，再把高度取在每段左端或右端的矩形面积加起来。端点为 $x_{i} = a + i\\Delta x$。左黎曼和取 $i = 0$ 到 $n - 1$，右黎曼和取 $i = 1$ 到 $n$：\n\n$$L_{n} = \\sum_{i = 0}^{n - 1} f(a + i\\Delta x)\\Delta x, \\qquad R_{n} = \\sum_{i = 1}^{n} f(a + i\\Delta x)\\Delta x$$",
      ),
      generate(rng) {
        const g = { ...grid(rng, 4, 10) };
        const rule = rng.pick(["left", "right"] as const);
        const left = sigmaLatex(0, g.n - 1, g.a, g.dx, g.dx);
        const right = sigmaLatex(1, g.n, g.a, g.dx, g.dx);
        const [yes, no] = rule === "left" ? [left, right] : [right, left];
        return oneOf(
          rng,
          t(
            `Which sum is the ${ruleName[rule].en} for a function $f$ on $${intervalLatex(g)}$ with $${g.n}$ subintervals of equal width?`,
            `函数 $f$ 在 $${intervalLatex(g)}$ 上取 $${g.n}$ 个等宽子区间，下列哪个和是它的${ruleName[rule]["zh-CN"]}？`,
          ),
          t(`$${yes}$`, `$${yes}$`),
          [
            no,
            sigmaLatex(rule === "left" ? 0 : 1, rule === "left" ? g.n - 1 : g.n, g.a, g.dx, undefined),
            sigmaLatex(0, g.n, g.a, g.dx, g.dx),
          ]
            .filter((w) => w !== yes)
            .map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `$\\Delta x = ${g.dx.toLatex()}$ and $x_{i} = ${argLatex(g.a, g.dx)}$. The ${ruleName[rule].en} has $${g.n}$ terms, from $i = ${rule === "left" ? 0 : 1}$ to $i = ${rule === "left" ? g.n - 1 : g.n}$, each multiplied by $\\Delta x$: $${yes}$.`,
            `$\\Delta x = ${g.dx.toLatex()}$，$x_{i} = ${argLatex(g.a, g.dx)}$。${ruleName[rule]["zh-CN"]}共 $${g.n}$ 项，从 $i = ${rule === "left" ? 0 : 1}$ 到 $i = ${rule === "left" ? g.n - 1 : g.n}$，每项都乘以 $\\Delta x$：$${yes}$。`,
          ),
        );
      },
    },
    {
      id: "evaluating-sums-in-sigma-notation",
      title: t("Evaluating sums in sigma notation", "计算求和符号表示的和"),
      explanation: t(
        "To evaluate a Riemann sum in sigma notation, substitute each value of $i$, evaluate $f$, and add. Reading the sum backward also tells you the interval: the arguments run through the endpoints used.",
        "要计算用求和符号表示的黎曼和，逐个代入 $i$ 的值，求出 $f$ 的值再相加。反过来读这个和也能知道区间：自变量依次取所用的端点。",
      ),
      generate(rng) {
        const g = grid(rng, 3, 5);
        const rule = rng.pick(["left", "right"] as const);
        const p = positivePoly(rng, g);
        const at = (x: Q) => qAt(p, x);
        const answer = riemann(at, g, rule);
        const sum = rule === "left" ? sigmaLatex(0, g.n - 1, g.a, g.dx, g.dx) : sigmaLatex(1, g.n, g.a, g.dx, g.dx);
        return numberProblem({
          prompt: t(`Let $f(x) = ${pLatex(p)}$. Evaluate $${sum}$.`, `设 $f(x) = ${pLatex(p)}$。求 $${sum}$ 的值。`),
          answer,
          wrong: [
            riemann(at, g, rule === "left" ? "right" : "left"),
            answer.div(g.dx),
            riemann(at, { ...g, n: g.n + 1, b: g.b.add(g.dx) }, rule),
          ],
          solution: t(
            `The arguments are $${sample(g, rule)
              .map(([x]) => x.toLatex())
              .join(", ")}$, so the sum is $${riemannSteps(g, rule)} = ${answer.toLatex()}$.`,
            `自变量依次为 $${sample(g, rule)
              .map(([x]) => x.toLatex())
              .join(", ")}$，所以和为 $${riemannSteps(g, rule)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** midpointAndTrapezoidalRulesInSigmaNotation writes the midpoint and trapezoidal rules in sigma notation. */
export const midpointAndTrapezoidalRulesInSigmaNotation: TopicDef = {
  id: "midpoint-and-trapezoidal-rules-in-sigma-notation",
  title: t("Midpoint and Trapezoidal Rules in Sigma Notation", "用求和符号表示中点法则与梯形法则"),
  summary: t("Write the midpoint and trapezoidal rules in sigma notation.", "用求和符号写出中点法则和梯形法则。"),
  prerequisites: [
    "left-and-right-riemann-sums-in-sigma-notation",
    "approximating-areas-with-the-midpoint-riemann-sum",
    "approximating-areas-with-the-trapezoidal-rule",
  ],
  encompasses: [{ topic: "left-and-right-riemann-sums-in-sigma-notation", weight: 0.4 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "the-midpoint-rule-in-sigma-notation",
      title: t("The midpoint rule in sigma notation", "用求和符号表示中点法则"),
      explanation: t(
        "The midpoint of the $i$th subinterval is $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$ for $i = 1, \\ldots, n$, so\n\n$$M_{n} = \\sum_{i = 1}^{n} f\\left(a + \\left(i - \\tfrac{1}{2}\\right)\\Delta x\\right)\\Delta x.$$\n\nSimplify the argument to the form $c + di$.",
        "第 $i$ 个子区间的中点为 $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$，$i = 1, \\ldots, n$，所以\n\n$$M_{n} = \\sum_{i = 1}^{n} f\\left(a + \\left(i - \\tfrac{1}{2}\\right)\\Delta x\\right)\\Delta x$$\n\n把自变量化简成 $c + di$ 的形式。",
      ),
      generate(rng) {
        const g = grid(rng, 4, 10);
        const half = g.dx.mul(Q.of(1, 2));
        const right = sigmaLatex(1, g.n, g.a.sub(half), g.dx, g.dx);
        return oneOf(
          rng,
          t(
            `Which sum is the midpoint Riemann sum for a function $f$ on $${intervalLatex(g)}$ with $${g.n}$ subintervals of equal width?`,
            `函数 $f$ 在 $${intervalLatex(g)}$ 上取 $${g.n}$ 个等宽子区间，下列哪个和是它的中点黎曼和？`,
          ),
          t(`$${right}$`, `$${right}$`),
          [
            sigmaLatex(1, g.n, g.a.add(half), g.dx, g.dx),
            sigmaLatex(1, g.n, g.a, g.dx, g.dx),
            sigmaLatex(1, g.n, g.a.sub(half), g.dx, half),
          ].map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `$\\Delta x = ${g.dx.toLatex()}$, and the $i$th midpoint is $${g.a.toLatex()} + \\left(i - \\frac{1}{2}\\right) \\cdot ${g.dx.toLatex()} = ${argLatex(g.a.sub(half), g.dx)}$. So $M_{${g.n}} = ${right}$.`,
            `$\\Delta x = ${g.dx.toLatex()}$，第 $i$ 个中点为 $${g.a.toLatex()} + \\left(i - \\frac{1}{2}\\right) \\cdot ${g.dx.toLatex()} = ${argLatex(g.a.sub(half), g.dx)}$。所以 $M_{${g.n}} = ${right}$。`,
          ),
        );
      },
    },
    {
      id: "the-trapezoidal-rule-in-sigma-notation",
      title: t("The trapezoidal rule in sigma notation", "用求和符号表示梯形法则"),
      explanation: t(
        "Each trapezoid averages the heights at its two ends, so every inner point is shared by two trapezoids and counted twice. The inner endpoints $x_{1}, \\ldots, x_{n - 1}$ count twice and the ends once:\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(a) + 2\\sum_{i = 1}^{n - 1} f(a + i\\Delta x) + f(b)\\right].$$",
        "每个梯形取两端高度的平均值，所以每个内部点被两个梯形共用，要算两次。内部端点 $x_{1}, \\ldots, x_{n - 1}$ 各算两次，两端各算一次：\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(a) + 2\\sum_{i = 1}^{n - 1} f(a + i\\Delta x) + f(b)\\right]$$",
      ),
      generate(rng) {
        const g = grid(rng, 4, 10);
        const half = g.dx.mul(Q.of(1, 2));
        const ends = (inner: string, factor: Q) =>
          `${factor.eq(Q.one) ? "" : factor.toLatex()}\\left[f(${g.a.toLatex()}) + ${inner} + f(${g.b.toLatex()})\\right]`;
        const right = ends(`2${sigmaLatex(1, g.n - 1, g.a, g.dx, undefined)}`, half);
        return oneOf(
          rng,
          t(
            `Which expression is the trapezoidal approximation for a function $f$ on $${intervalLatex(g)}$ with $${g.n}$ subintervals of equal width?`,
            `函数 $f$ 在 $${intervalLatex(g)}$ 上取 $${g.n}$ 个等宽子区间，下列哪个式子是它的梯形近似？`,
          ),
          t(`$${right}$`, `$${right}$`),
          [
            ends(sigmaLatex(1, g.n - 1, g.a, g.dx, undefined), half),
            ends(`2${sigmaLatex(1, g.n - 1, g.a, g.dx, undefined)}`, g.dx),
            ends(`2${sigmaLatex(0, g.n, g.a, g.dx, undefined)}`, half),
          ].map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `$\\Delta x = ${g.dx.toLatex()}$, so the factor in front is $\\frac{\\Delta x}{2} = ${half.toLatex()}$. The inner endpoints $${argLatex(g.a, g.dx)}$ for $i = 1, \\ldots, ${g.n - 1}$ count twice, and $f(${g.a.toLatex()})$ and $f(${g.b.toLatex()})$ once.`,
            `$\\Delta x = ${g.dx.toLatex()}$，所以前面的因子为 $\\frac{\\Delta x}{2} = ${half.toLatex()}$。内部端点 $${argLatex(g.a, g.dx)}$（$i = 1, \\ldots, ${g.n - 1}$）各算两次，$f(${g.a.toLatex()})$ 和 $f(${g.b.toLatex()})$ 各算一次。`,
          ),
        );
      },
    },
  ],
};

/** Curve is a function whose Riemann sums need a calculator. */
interface Curve {
  readonly latex: string;
  readonly f: (x: number) => number;
  readonly from: number;
}

/** curves are composite functions positive on [from, ∞). */
const curves = (k: number): Curve[] => [
  { latex: `\\sqrt{x + ${k}}`, f: (x) => Math.sqrt(x + k), from: 0 },
  { latex: `\\ln(x + ${k})`, f: (x) => Math.log(x + k), from: 0 },
  { latex: `\\frac{${k}}{x + 1}`, f: (x) => k / (x + 1), from: 0 },
  { latex: `e^{\\frac{x}{${k + 1}}}`, f: (x) => Math.exp(x / (k + 1)), from: -2 },
  { latex: `\\sqrt{x^{2} + ${k}}`, f: (x) => Math.sqrt(x * x + k), from: -2 },
  { latex: `${k + 1} + \\sin x`, f: (x) => k + 1 + Math.sin(x), from: -2 },
];

/** midpointFigure plots y = √(1 + x²) on [0, 4] under four midpoint rectangles, each as tall as the curve at its center. */
const midpointFigure: Figure = {
  svg: plane({ xMin: -1, xMax: 5, yMin: -1, yMax: 5, labelEvery: 1 }, [
    ...[0, 1, 2, 3].flatMap((i): PlaneMark[] => {
      const h = Math.sqrt(1 + (i + 0.5) ** 2);
      return [
        {
          kind: "region",
          halfPlanes: [
            [1, 0, -i],
            [-1, 0, i + 1],
            [0, 1, 0],
            [0, -1, h],
          ],
        },
        { kind: "segment", a: [i, 0], b: [i, h] },
        { kind: "segment", a: [i, h], b: [i + 1, h] },
        { kind: "segment", a: [i + 1, 0], b: [i + 1, h] },
        { kind: "point", at: [i + 0.5, h] },
      ];
    }),
    { kind: "curve", f: (x) => Math.sqrt(1 + x * x), from: -1, to: 5, accent: true },
  ]),
  alt: t(
    "The graph of y = √(1 + x²) over [0, 4] with four rectangles of width 1; each rectangle's top meets the curve at the midpoint of its base, so the rectangles' total area approximates the area under the curve.",
    "y = √(1 + x²) 在 [0, 4] 上的图像，下方有四个宽为 1 的矩形；每个矩形的顶边在底边中点处与曲线相交，矩形面积之和近似曲线下方的面积。",
  ),
};
/** approximatingAreasUnderGraphsOfCompositeFunctions applies the rules to functions needing a calculator. */
export const approximatingAreasUnderGraphsOfCompositeFunctions: TopicDef = {
  id: "approximating-areas-under-graphs-of-composite-functions",
  title: t("Approximating Areas Under Graphs of Composite Functions", "近似复合函数图像下方的面积"),
  summary: t(
    "Apply the four approximation rules to roots, logarithms, exponentials and trigonometric functions.",
    "把四种近似法则用于根式、对数、指数和三角函数。",
  ),
  prerequisites: ["approximating-areas-with-the-midpoint-riemann-sum", "approximating-areas-with-the-trapezoidal-rule"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "approximations-needing-a-calculator",
      title: t("Approximations needing a calculator", "需要计算器的近似"),
      explanation: t(
        "The rules work the same way for any function: find $\\Delta x$, list the points the rule uses, evaluate $f$ there with a calculator, and combine. Keep full precision until the end and round only the final answer.",
        "这些法则对任何函数都一样用：求出 $\\Delta x$，列出法则要用的点，用计算器求这些点处的 $f$ 值，再组合起来。中间保留全部精度，只对最终答案取近似。",
      ),
      figure: midpointFigure,
      generate(rng) {
        const k = rng.int(1, 5);
        const c = rng.pick(curves(k));
        const dx = rng.pick([Q.of(1, 2), Q.one, Q.one]);
        const n = rng.int(3, 6);
        const a = Q.of(Math.max(c.from, rng.int(-2, 2)));
        const g: Grid = { a, b: a.add(dx.mul(Q.of(n))), dx, n };
        const rule = rng.pick(["left", "right", "midpoint", "trapezoidal"] as const);
        const value = (r: Rule) => sample(g, r).reduce((s, [x, w]) => s + c.f(x.toNumber()) * w.toNumber(), 0) * dx.toNumber();
        const answer = rounded(value(rule), 3) ?? Q.zero;
        return numberProblem({
          prompt: t(
            `Use ${ruleWithArticle(rule)} with $${n}$ subintervals of equal width to approximate the area under $y = ${c.latex}$ on $${intervalLatex(g)}$. Round to three decimal places.`,
            `用 $${n}$ 个等宽子区间的${ruleName[rule]["zh-CN"]}，近似计算 $y = ${c.latex}$ 在 $${intervalLatex(g)}$ 上的图像下方面积，精确到三位小数。`,
          ),
          answer,
          form: "decimal",
          wrong: (["left", "right", "midpoint", "trapezoidal"] as const)
            .filter((r) => r !== rule)
            .map((r) => rounded(value(r), 3) ?? answer),
          solution: t(
            `$\\Delta x = ${dx.toLatex()}$, and the approximation is $${riemannSteps(g, rule)} \\approx ${answer.toNumber()}$, with $f(x) = ${c.latex}$.`,
            `$\\Delta x = ${dx.toLatex()}$，其中 $f(x) = ${c.latex}$，近似值为 $${riemannSteps(g, rule)} \\approx ${answer.toNumber()}$。`,
          ),
        });
      },
    },
    {
      id: "overestimates-from-monotonicity-and-concavity",
      title: t("Overestimates from monotonicity and concavity", "由单调性和凹凸性判断高估或低估"),
      explanation: t(
        "Whether an approximation is too big or too small depends on the shape of the graph, not on the numbers:\n\n- **left and right sums** depend on monotonicity: for an increasing $f$, $L_{n}$ underestimates and $R_{n}$ overestimates; for a decreasing $f$ it is the other way round;\n- **the trapezoidal rule and the midpoint sum** depend on concavity: if $f$ is concave up, each chord lies above the curve, so the trapezoidal rule overestimates, and each midpoint rectangle trades a smaller piece of extra area for a larger missing one, so the midpoint sum underestimates; if $f$ is concave down, both reverse.\n\nSo find the signs of $f'$ and $f''$ on the interval first. For $\\sqrt{x + 1}$, $f' > 0$ and $f'' < 0$: the right sum and the midpoint sum overestimate.",
        "近似值偏大还是偏小取决于图像的形状，而不是具体数值：\n\n- **左、右黎曼和**取决于单调性：$f$ 递增时，$L_{n}$ 低估、$R_{n}$ 高估；$f$ 递减时正好相反；\n- **梯形法则和中点黎曼和**取决于凹凸性：$f$ 下凸（凹向上）时，每条弦都在曲线上方，所以梯形法则高估；每个中点矩形多出的面积小于缺少的面积，所以中点黎曼和低估；$f$ 上凸（凹向下）时，两者都反过来。\n\n所以先判断 $f'$ 和 $f''$ 在区间上的符号。对 $\\sqrt{x + 1}$，$f' > 0$，$f'' < 0$：右黎曼和与中点黎曼和高估。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const kinds: [string, boolean, boolean][] = [
          [`\\sqrt{x + ${k}}`, true, false],
          [`\\ln(x + ${k})`, true, false],
          [`\\frac{${k}}{x + 1}`, false, true],
          [`e^{\\frac{x}{${k + 1}}}`, true, true],
          [`\\sqrt{x^{2} + ${k}}`, true, true],
          [`e^{-\\frac{x}{${k + 1}}}`, false, true],
        ];
        const [f, increasing, up] = rng.pick(kinds);
        const a = rng.int(0, 3);
        const b = a + rng.int(2, 6);
        const n = rng.int(3, 8);
        const rule = rng.pick(["left", "right", "midpoint", "trapezoidal"] as const);
        const over = rule === "left" ? !increasing : rule === "right" ? increasing : rule === "trapezoidal" ? up : !up;
        const byShape = rule === "left" || rule === "right";
        const shape = byShape
          ? t(increasing ? "increasing" : "decreasing", increasing ? "递增" : "递减")
          : t(up ? "concave up" : "concave down", up ? "下凸（凹向上）" : "上凸（凹向下）");
        const reason = byShape
          ? t(
              `the height at the ${rule} end of each subinterval is the ${over ? "largest" : "smallest"} value on it`,
              `每个子区间${rule === "left" ? "左" : "右"}端点处的高度是该区间上的${over ? "最大" : "最小"}值`,
            )
          : rule === "trapezoidal"
            ? t(`each chord lies ${over ? "above" : "below"} the curve`, `每条弦都在曲线${over ? "上方" : "下方"}`)
            : t(
                `each midpoint rectangle ${over ? "adds more area than it leaves out" : "leaves out more area than it adds"}`,
                `每个中点矩形${over ? "多出的面积大于缺少的面积" : "缺少的面积大于多出的面积"}`,
              );
        return oneOf(
          rng,
          t(
            `The area under $y = ${f}$ on $[${a}, ${b}]$ is approximated by ${ruleWithArticle(rule)} with $${n}$ subintervals. Is the approximation an overestimate or an underestimate of the area?`,
            `用 $${n}$ 个子区间的${ruleName[rule]["zh-CN"]}近似 $y = ${f}$ 在 $[${a}, ${b}]$ 上的图像下方面积。这个近似值是高估还是低估？`,
          ),
          over ? t("An overestimate", "高估") : t("An underestimate", "低估"),
          [over ? t("An underestimate", "低估") : t("An overestimate", "高估"), t("It equals the area exactly", "恰好等于面积")],
          t(
            `The ${ruleName[rule].en} depends on whether $f$ is ${byShape ? "increasing or decreasing" : "concave up or down"}. $y = ${f}$ is ${shape.en} on $[${a}, ${b}]$, so ${reason.en}: the approximation is ${over ? "an overestimate" : "an underestimate"}.`,
            `${ruleName[rule]["zh-CN"]}取决于 $f$ 的${byShape ? "单调性" : "凹凸性"}。$y = ${f}$ 在 $[${a}, ${b}]$ 上${shape["zh-CN"]}，所以${reason["zh-CN"]}：近似值是${over ? "高估" : "低估"}。`,
          ),
        );
      },
    },
  ],
};

/** shapes are functions with a template for writing f at an argument. */
const shapes: readonly [string, (u: string) => string][] = [
  ["x^{2}", (u) => `\\left(${u}\\right)^{2}`],
  ["x^{3}", (u) => `\\left(${u}\\right)^{3}`],
  ["\\sqrt{x}", (u) => `\\sqrt{${u}}`],
  ["e^{x}", (u) => `e^{${u}}`],
  ["\\sin x", (u) => `\\sin\\left(${u}\\right)`],
  ["\\ln x", (u) => `\\ln\\left(${u}\\right)`],
];

/** definingDefiniteIntegralsUsingLeftAndRightRiemannSums defines the definite integral as a limit of sums. */
export const definingDefiniteIntegralsUsingLeftAndRightRiemannSums: TopicDef = {
  id: "defining-definite-integrals-using-left-and-right-riemann-sums",
  title: t("Defining Definite Integrals Using Left and Right Riemann Sums", "用左、右黎曼和定义定积分"),
  summary: t(
    "Define the definite integral as the limit of Riemann sums, and evaluate simple integrals from the definition.",
    "把定积分定义为黎曼和的极限，并由定义计算简单的定积分。",
  ),
  prerequisites: ["left-and-right-riemann-sums-in-sigma-notation", "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions"],
  encompasses: [{ topic: "left-and-right-riemann-sums-in-sigma-notation", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-sums-as-integrals",
      title: t("Limits of sums as integrals", "把和的极限写成积分"),
      explanation: t(
        "As $n \\to \\infty$ the Riemann sums of a continuous $f$ approach one number, the **definite integral**:\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} f\\left(a + \\frac{(b - a)i}{n}\\right)\\frac{b - a}{n}.$$\n\nTo read an integral off such a limit, match $\\Delta x = \\frac{b - a}{n}$ and the argument $a + i\\Delta x$: the constant term is $a$, and $b = a + (b - a)$.",
        "当 $n \\to \\infty$ 时，连续函数 $f$ 的黎曼和趋于同一个数，即**定积分**：\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} f\\left(a + \\frac{(b - a)i}{n}\\right)\\frac{b - a}{n}$$\n\n要从这样的极限读出积分，对照 $\\Delta x = \\frac{b - a}{n}$ 和自变量 $a + i\\Delta x$：常数项是 $a$，且 $b = a + (b - a)$。",
      ),
      generate(rng) {
        const [f, at] = rng.pick(shapes);
        const a = rng.int(1, 5);
        const w = rng.int(2, 6);
        const b = a + w;
        const u = `${a} + \\frac{${w}i}{n}`;
        const sum = `\\lim_{n \\to \\infty} \\sum_{i = 1}^{n} ${at(u)} \\cdot \\frac{${w}}{n}`;
        const integral = (lo: string | number, hi: string | number, body = f) => `\\int_{${lo}}^{${hi}} ${body} \\, dx`;
        const right = integral(a, b);
        return reasoned(
          oneOf(
            rng,
            t(`Which definite integral equals $${sum}$?`, `哪个定积分等于 $${sum}$？`),
            t(`$${right}$`, `$${right}$`),
            [integral(0, w), integral(a, w === a ? w + 1 : w), integral(w, w + a)]
              .filter((x) => x !== right)
              .map((x) => t(`$${x}$`, `$${x}$`)),
            t(
              `The factor $\\frac{${w}}{n}$ is $\\Delta x$, so $b - a = ${w}$, and the argument $${u}$ is $a + i\\Delta x$ with $a = ${a}$. So $b = ${b}$ and the limit is $${right}$.`,
              `因子 $\\frac{${w}}{n}$ 是 $\\Delta x$，所以 $b - a = ${w}$；自变量 $${u}$ 即 $a + i\\Delta x$，其中 $a = ${a}$。所以 $b = ${b}$，极限为 $${right}$。`,
            ),
          ),
          [
            [
              `$${integral(0, w)}$`,
              `This starts at $0$, but the argument starts at $${a}$, so the lower limit is $${a}$.`,
              `这里从 $0$ 开始，但自变量从 $${a}$ 开始，所以下限是 $${a}$。`,
            ],
            [
              `$${integral(a, w === a ? w + 1 : w)}$`,
              `$\\Delta x$ gives the length of the interval, so the upper limit is $${a} + ${w} = ${b}$.`,
              `$\\Delta x$ 给出的是区间长度，所以上限是 $${a} + ${w} = ${b}$。`,
            ],
            [
              `$${integral(w, w + a)}$`,
              `The lower limit comes from the constant in the argument, which is $${a}$.`,
              `下限来自自变量中的常数，也就是 $${a}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "evaluating-integrals-from-the-definition",
      title: t("Evaluating integrals from the definition", "由定义计算定积分"),
      explanation: t(
        "Write the right sum with the sum formulas for powers of the index, simplify it in terms of the number of pieces, and let that number grow without bound. For polynomials the limit can be computed with\n\n$$\\sum_{i = 1}^{n} 1 = n, \\qquad \\sum_{i = 1}^{n} i = \\frac{n(n + 1)}{2}, \\qquad \\sum_{i = 1}^{n} i^{2} = \\frac{n(n + 1)(2n + 1)}{6}.$$\n\nFor example, $\\int_{0}^{b} x^{2} \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} \\frac{b^{2}i^{2}}{n^{2}} \\cdot \\frac{b}{n} = \\lim_{n \\to \\infty} \\frac{b^{3}}{n^{3}} \\cdot \\frac{n(n + 1)(2n + 1)}{6} = \\frac{b^{3}}{3}$.",
        "用下标幂的求和公式写出右和，把它化简为小段数的式子，再让小段数无限增大。对多项式，可以用下列公式求极限：\n\n$$\\sum_{i = 1}^{n} 1 = n, \\qquad \\sum_{i = 1}^{n} i = \\frac{n(n + 1)}{2}, \\qquad \\sum_{i = 1}^{n} i^{2} = \\frac{n(n + 1)(2n + 1)}{6}$$\n\n例如 $\\int_{0}^{b} x^{2} \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} \\frac{b^{2}i^{2}}{n^{2}} \\cdot \\frac{b}{n} = \\lim_{n \\to \\infty} \\frac{b^{3}}{n^{3}} \\cdot \\frac{n(n + 1)(2n + 1)}{6} = \\frac{b^{3}}{3}$。",
      ),
      generate(rng) {
        const b = rng.int(1, 6);
        const p = rng.nonZero(-4, 4);
        const q = rng.int(-5, 5);
        const square = rng.bool();
        const f = square ? poly([p, "x^{2}"], [q, ""]) : poly([p, "x"], [q, ""]);
        const answer = square ? Q.of(p * b ** 3, 3).add(Q.of(q * b)) : Q.of(p * b * b, 2).add(Q.of(q * b));
        const sum = square
          ? `\\sum_{i = 1}^{n} \\left(${p} \\cdot \\frac{${b * b}i^{2}}{n^{2}} + ${par(Q.of(q))}\\right)\\frac{${b}}{n}`
          : `\\sum_{i = 1}^{n} \\left(${p} \\cdot \\frac{${b}i}{n} + ${par(Q.of(q))}\\right)\\frac{${b}}{n}`;
        return numberProblem({
          prompt: t(
            `Use the limit of right Riemann sums to evaluate $\\int_{0}^{${b}} (${f}) \\, dx$.`,
            `用右黎曼和的极限计算 $\\int_{0}^{${b}} (${f}) \\, dx$。`,
          ),
          answer,
          wrong: square
            ? [Q.of(p * b ** 3, 2).add(Q.of(q * b)), Q.of(p * b ** 3, 3), Q.of(p * b ** 2, 3).add(Q.of(q * b))]
            : [Q.of(p * b * b).add(Q.of(q * b)), Q.of(p * b * b, 2), Q.of(p * b * b, 2).add(Q.of(q))],
          solution: t(
            `With $\\Delta x = \\frac{${b}}{n}$ and $x_{i} = \\frac{${b}i}{n}$, the right sum is $${sum}$. Using the sum formulas and letting $n \\to \\infty$ gives $${square ? `${p} \\cdot \\frac{${b ** 3}}{3}` : `${p} \\cdot \\frac{${b * b}}{2}`} + ${par(Q.of(q))} \\cdot ${b} = ${answer.toLatex()}$.`,
            `取 $\\Delta x = \\frac{${b}}{n}$，$x_{i} = \\frac{${b}i}{n}$，右黎曼和为 $${sum}$。用求和公式并令 $n \\to \\infty$，得 $${square ? `${p} \\cdot \\frac{${b ** 3}}{3}` : `${p} \\cdot \\frac{${b * b}}{2}`} + ${par(Q.of(q))} \\cdot ${b} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** antiderivativeLatex writes the antiderivative of a polynomial without its constant. */
export const antiderivativeLatex = (p: Poly) => poly(...p.map((c, i) => [Q.of(c, i + 1), power(i + 1)] as const).reverse());

/** antiderivativeAt evaluates the antiderivative of a polynomial at x. */
export const antiderivativeAt = (p: Poly, x: number) => p.reduce((s: Q, c, i) => s.add(Q.of(c * x ** (i + 1), i + 1)), Q.zero);

/** theFundamentalTheoremOfCalculus evaluates definite integrals with antiderivatives. */
export const theFundamentalTheoremOfCalculus: TopicDef = {
  id: "the-fundamental-theorem-of-calculus",
  title: t("The Fundamental Theorem of Calculus", "微积分基本定理"),
  summary: t("Evaluate definite integrals of polynomials and powers with antiderivatives.", "用原函数计算多项式和幂函数的定积分。"),
  prerequisites: ["defining-definite-integrals-using-left-and-right-riemann-sums", "the-sum-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-sum-rule-for-indefinite-integrals", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "definite-integrals-of-polynomials",
      title: t("Definite integrals of polynomials", "多项式的定积分"),
      explanation: t(
        "**The fundamental theorem of calculus:** if $f$ is continuous on $[a, b]$ and $F$ is any antiderivative of $f$, then\n\n$$\\int_{a}^{b} f(x) \\, dx = \\Big[F(x)\\Big]_{a}^{b} = F(b) - F(a).$$\n\nThe constant $C$ cancels, so leave it out.",
        "**微积分基本定理：**若 $f$ 在 $[a, b]$ 上连续，$F$ 是 $f$ 的任一原函数，则\n\n$$\\int_{a}^{b} f(x) \\, dx = \\Big[F(x)\\Big]_{a}^{b} = F(b) - F(a)$$\n\n常数 $C$ 会抵消，所以不必写。",
      ),
      generate(rng) {
        const deg = rng.int(1, 3);
        const p: number[] = Array.from({ length: deg + 1 }, () => rng.int(-6, 6));
        p[deg] = rng.nonZero(-4, 4);
        const a = rng.int(-3, 2);
        const b = a + rng.int(1, 4);
        const [Fa, Fb] = [antiderivativeAt(p, a), antiderivativeAt(p, b)];
        const answer = Fb.sub(Fa);
        const F = antiderivativeLatex(p);
        return numberProblem({
          prompt: t(`Evaluate $\\int_{${a}}^{${b}} (${pLatex(p)}) \\, dx$.`, `计算 $\\int_{${a}}^{${b}} (${pLatex(p)}) \\, dx$。`),
          answer,
          wrong: [Fa.sub(Fb), Fb, Fb.add(Fa)],
          solution: t(
            `An antiderivative is $F(x) = ${F}$. Then $F(${b}) - F(${a}) = ${Fb.toLatex()} - ${par(Fa)} = ${answer.toLatex()}$.`,
            `一个原函数为 $F(x) = ${F}$。于是 $F(${b}) - F(${a}) = ${Fb.toLatex()} - ${par(Fa)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "definite-integrals-of-powers",
      title: t("Definite integrals of powers", "幂函数的定积分"),
      explanation: t(
        "Rewrite roots and reciprocals as powers, integrate with the power rule, then substitute the limits. With $\\int_{1}^{4} \\sqrt{x} \\, dx$: $\\Big[\\frac{2}{3}x^{\\frac{3}{2}}\\Big]_{1}^{4} = \\frac{2}{3}(8 - 1) = \\frac{14}{3}$.",
        "把根式和倒数写成幂，用幂法则积分，再代入上下限。例如 $\\int_{1}^{4} \\sqrt{x} \\, dx = \\Big[\\frac{2}{3}x^{\\frac{3}{2}}\\Big]_{1}^{4} = \\frac{2}{3}(8 - 1) = \\frac{14}{3}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const kk = k === 1 ? "" : String(k);
        const kinds: [string, Q, readonly number[]][] = [
          [`${kk}\\sqrt{x}`, Q.of(1, 2), [1, 4, 9, 16]],
          [`\\frac{${k}}{\\sqrt{x}}`, Q.of(-1, 2), [1, 4, 9, 16]],
          [`${kk}x\\sqrt{x}`, Q.of(3, 2), [1, 4, 9]],
          [`${kk}\\sqrt[3]{x}`, Q.of(1, 3), [1, 8, 27]],
          [`\\frac{${k}}{x^{2}}`, Q.of(-2), [1, 2, 3, 4, 5, 6]],
          [`\\frac{${k}}{x^{3}}`, Q.of(-3), [1, 2, 3, 4]],
        ];
        const [shown, n, ends] = rng.pick(kinds);
        const i = rng.int(0, ends.length - 2);
        const a = ends[i]!;
        const b = ends[rng.int(i + 1, ends.length - 1)]!;
        const up = n.add(Q.one);
        // x^(up) for x a perfect power of the denominator of up.
        const pw = (x: number) => {
          const r = Math.round(x ** (1 / Number(up.d)));
          const m = Number(up.n);
          return m >= 0 ? Q.of(r ** m) : Q.of(1, r ** -m);
        };
        const c = Q.of(k).div(up);
        const answer = c.mul(pw(b).sub(pw(a)));
        const term = poly([c, `x^{${up.toLatex()}}`]);
        return numberProblem({
          prompt: t(`Evaluate $\\int_{${a}}^{${b}} ${shown} \\, dx$.`, `计算 $\\int_{${a}}^{${b}} ${shown} \\, dx$。`),
          answer,
          wrong: [answer.neg(), Q.of(k).mul(pw(b).sub(pw(a))), c.mul(pw(b))],
          solution: t(
            `$${shown} = ${poly([Q.of(k), `x^{${n.toLatex()}}`])}$, with antiderivative $${term}$. So the integral is $${c.toLatex()}\\left(${pw(b).toLatex()} - ${pw(a).toLatex()}\\right) = ${answer.toLatex()}$.`,
            `$${shown} = ${poly([Q.of(k), `x^{${n.toLatex()}}`])}$，原函数为 $${term}$。所以积分为 $${c.toLatex()}\\left(${pw(b).toLatex()} - ${pw(a).toLatex()}\\right) = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** angleOf finds the special angle nπ/d. */
const angleOf = (n: number, d: number) => specialAngles.find((s) => s.n === n && s.d === d) ?? specialAngles[0]!;

/** oneMinus writes k − k·e for an exact value e: "3 - \frac{3\sqrt{2}}{2}". */
function oneMinus(k: number, e: Exact): string {
  const ke = exactMul(e, Q.of(k));
  if (e.m === 1) return Q.of(k).sub(ke.c).toLatex();
  return `${k} ${ke.c.sign() < 0 ? "+" : "-"} ${radical(ke.c.abs(), e.m)}`;
}

/** applyingTheFundamentalTheoremToExponentialAndTrigonometricFunctions evaluates integrals of transcendental functions. */
export const applyingTheFundamentalTheoremToExponentialAndTrigonometricFunctions: TopicDef = {
  id: "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
  title: t(
    "Applying the Fundamental Theorem of Calculus to Exponential and Trigonometric Functions",
    "把微积分基本定理用于指数函数和三角函数",
  ),
  summary: t(
    "Evaluate definite integrals of exponential, reciprocal and trigonometric functions exactly.",
    "精确计算指数函数、倒数函数和三角函数的定积分。",
  ),
  prerequisites: [
    "the-fundamental-theorem-of-calculus",
    "integrating-exponential-functions",
    "integrating-the-reciprocal-function",
    "integrating-trigonometric-functions",
  ],
  encompasses: [
    { topic: "integrating-exponential-functions", weight: 0.3 },
    { topic: "integrating-trigonometric-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-and-reciprocal-integrals",
      title: t("Exponential and reciprocal integrals", "指数函数与倒数函数的积分"),
      explanation: t(
        "Find the antiderivative, evaluate it at both limits and subtract, using the facts that $e^{0} = 1$ and $\\ln 1 = 0$. Give exact answers: $\\int_{0}^{2} e^{x} \\, dx = e^{2} - e^{0} = e^{2} - 1$ and $\\int_{1}^{5} \\frac{1}{x} \\, dx = \\ln 5 - \\ln 1 = \\ln 5$.",
        "求出原函数，在上下限处分别求值再相减，并利用 $e^{0} = 1$、$\\ln 1 = 0$ 这两个事实。给出精确答案：$\\int_{0}^{2} e^{x} \\, dx = e^{2} - e^{0} = e^{2} - 1$，$\\int_{1}^{5} \\frac{1}{x} \\, dx = \\ln 5 - \\ln 1 = \\ln 5$。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const b = rng.int(2, 9);
        const kk = k === 1 ? "" : String(k);
        if (rng.bool()) {
          const e = rng.int(1, 4);
          const answer = poly([k, `e^{${e}}`], [-k, ""]);
          return functionProblem({
            prompt: t(
              `Evaluate $\\int_{0}^{${e}} ${kk}e^{x} \\, dx$. Give an exact answer.`,
              `计算 $\\int_{0}^{${e}} ${kk}e^{x} \\, dx$，给出精确值。`,
            ),
            answer,
            wrong: [`${kk}e^{${e}}`, poly([k, `e^{${e}}`], [k, ""]), poly([k, `e^{${e - 1}}`])],
            solution: t(
              `$\\Big[${kk}e^{x}\\Big]_{0}^{${e}} = ${kk}e^{${e}} - ${kk}e^{0} = ${answer}$.`,
              `$\\Big[${kk}e^{x}\\Big]_{0}^{${e}} = ${kk}e^{${e}} - ${kk}e^{0} = ${answer}$。`,
            ),
          });
        }
        const answer = `${kk}\\ln ${b}`;
        return functionProblem({
          prompt: t(
            `Evaluate $\\int_{1}^{${b}} \\frac{${k}}{x} \\, dx$. Give an exact answer.`,
            `计算 $\\int_{1}^{${b}} \\frac{${k}}{x} \\, dx$，给出精确值。`,
          ),
          answer,
          wrong: [`\\ln ${b}`, `${kk}\\ln ${b - 1}`, `\\ln ${k * b}`, `\\frac{${k}}{${b}} - ${k}`],
          solution: t(
            `$\\Big[${kk}\\ln|x|\\Big]_{1}^{${b}} = ${kk}\\ln ${b} - ${kk}\\ln 1 = ${answer}$.`,
            `$\\Big[${kk}\\ln|x|\\Big]_{1}^{${b}} = ${kk}\\ln ${b} - ${kk}\\ln 1 = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "trigonometric-integrals",
      title: t("Trigonometric integrals", "三角函数的积分"),
      explanation: t(
        "After finding the antiderivative, the exact values of sine and cosine at the special angles give an exact answer instead of a decimal. Integrate, then use exact values at special angles: $\\int_{0}^{\\frac{\\pi}{3}} \\sin x \\, dx = \\Big[-\\cos x\\Big]_{0}^{\\frac{\\pi}{3}} = -\\frac{1}{2} - (-1) = \\frac{1}{2}$. Watch the minus sign in $\\int \\sin x \\, dx = -\\cos x + C$.",
        "求出原函数后，利用特殊角的正弦和余弦精确值，就能得到精确答案而不是小数。先积分，再用特殊角的精确值：$\\int_{0}^{\\frac{\\pi}{3}} \\sin x \\, dx = \\Big[-\\cos x\\Big]_{0}^{\\frac{\\pi}{3}} = -\\frac{1}{2} - (-1) = \\frac{1}{2}$。注意 $\\int \\sin x \\, dx = -\\cos x + C$ 中的负号。",
      ),
      generate(rng) {
        const k = rng.int(1, 8);
        const kk = k === 1 ? "" : String(k);
        const kind = rng.pick(["sin", "cos", "sec"] as const);
        const [n, d] = rng.pick(
          kind === "sec"
            ? [
                [1, 6],
                [1, 4],
                [1, 3],
              ]
            : [
                [1, 6],
                [1, 4],
                [1, 3],
                [1, 2],
                [2, 3],
                [3, 4],
                [5, 6],
                [1, 1],
              ],
        ) as [number, number];
        const s = angleOf(n, d);
        const tan: Exact = n === 1 && d === 4 ? { c: Q.one, m: 1 } : d === 6 ? { c: Q.of(1, 3), m: 3 } : { c: Q.one, m: 3 };
        const [answer, wrong, F] =
          kind === "cos"
            ? [
                exactLatex(exactMul(s.sin, Q.of(k))),
                [exactLatex(exactMul(s.cos, Q.of(k))), exactLatex(exactMul(s.sin, Q.of(-k)))],
                `${kk}\\sin x`,
              ]
            : kind === "sin"
              ? [
                  oneMinus(k, s.cos),
                  [exactLatex(exactMul(s.cos, Q.of(-k))), exactLatex(exactMul(s.cos, Q.of(k))), oneMinus(k, s.sin)],
                  `-${kk}\\cos x`,
                ]
              : [
                  exactLatex(exactMul(tan, Q.of(k))),
                  [exactLatex(exactMul(s.sin, Q.of(k))), exactLatex(exactMul(tan, Q.of(-k)))],
                  `${kk}\\tan x`,
                ];
        const f = kind === "sec" ? "\\sec^{2} x" : `\\${kind} x`;
        return functionProblem({
          prompt: t(
            `Evaluate $\\int_{0}^{${s.latex}} ${kk}${f} \\, dx$. Give an exact answer.`,
            `计算 $\\int_{0}^{${s.latex}} ${kk}${f} \\, dx$，给出精确值。`,
          ),
          answer,
          wrong,
          solution: t(
            `An antiderivative is $${F}$, so the integral is $\\Big[${F}\\Big]_{0}^{${s.latex}} = ${answer}$.`,
            `一个原函数为 $${F}$，所以积分为 $\\Big[${F}\\Big]_{0}^{${s.latex}} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** theSumAndConstantMultipleRulesForDefiniteIntegrals combines known definite integrals linearly. */
export const theSumAndConstantMultipleRulesForDefiniteIntegrals: TopicDef = {
  id: "the-sum-and-constant-multiple-rules-for-definite-integrals",
  title: t("The Sum and Constant Multiple Rules for Definite Integrals", "定积分的和法则与常数倍法则"),
  summary: t("Combine known definite integrals using linearity.", "利用线性性组合已知的定积分。"),
  prerequisites: ["the-fundamental-theorem-of-calculus"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "combining-known-integrals",
      title: t("Combining known integrals", "组合已知的积分"),
      explanation: t(
        "Definite integrals are linear, so when the integrals of the separate functions are known, any combination of them can be found without integrating again. Definite integrals split over sums and constant multiples:\n\n$$\\int_{a}^{b} \\left[pf(x) + qg(x)\\right] dx = p\\int_{a}^{b} f(x) \\, dx + q\\int_{a}^{b} g(x) \\, dx.$$",
        "定积分是线性的，所以当各个函数的积分已知时，不必重新积分就能求出它们的任意组合。定积分对和与常数倍可以拆开：\n\n$$\\int_{a}^{b} \\left[pf(x) + qg(x)\\right] dx = p\\int_{a}^{b} f(x) \\, dx + q\\int_{a}^{b} g(x) \\, dx$$",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const b = a + rng.int(1, 6);
        const [F, G] = [rng.nonZero(-12, 12), rng.nonZero(-12, 12)];
        const [p, q] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const answer = p * F + q * G;
        const body = poly([p, "f(x)"], [q, "g(x)"]);
        return numberProblem({
          prompt: t(
            `Given $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$ and $\\int_{${a}}^{${b}} g(x) \\, dx = ${G}$, find $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$.`,
            `已知 $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，$\\int_{${a}}^{${b}} g(x) \\, dx = ${G}$，求 $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$。`,
          ),
          answer,
          wrong: [F + G, p * F - q * G, p * F + G, (p + q) * (F + G)],
          solution: t(
            `$\\int_{${a}}^{${b}} \\left[${body}\\right] dx = ${p} \\cdot ${par(Q.of(F))} + ${par(Q.of(q))} \\cdot ${par(Q.of(G))} = ${answer}$.`,
            `$\\int_{${a}}^{${b}} \\left[${body}\\right] dx = ${p} \\cdot ${par(Q.of(F))} + ${par(Q.of(q))} \\cdot ${par(Q.of(G))} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "integrals-with-a-constant-term",
      title: t("Integrals with a constant term", "含常数项的积分"),
      explanation: t(
        "A constant function gives a rectangle under its graph, whose area is the constant times the width of the interval. A constant integrates to the constant times the length of the interval: $\\int_{a}^{b} c \\, dx = c(b - a)$. So $\\int_{1}^{4} \\left[2f(x) + 5\\right] dx = 2\\int_{1}^{4} f(x) \\, dx + 15$.",
        "常数函数的图像下方是一个矩形，它的面积等于这个常数乘以区间的宽度。常数的积分等于常数乘以区间长度：$\\int_{a}^{b} c \\, dx = c(b - a)$。所以 $\\int_{1}^{4} \\left[2f(x) + 5\\right] dx = 2\\int_{1}^{4} f(x) \\, dx + 15$。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const b = a + rng.int(2, 7);
        const F = rng.nonZero(-15, 15);
        const p = rng.nonZero(-5, 5);
        const c = rng.nonZero(-9, 9);
        const answer = p * F + c * (b - a);
        const body = poly([p, "f(x)"], [c, ""]);
        return numberProblem({
          prompt: t(
            `Given $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$, find $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$.`,
            `已知 $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，求 $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$。`,
          ),
          answer,
          wrong: [p * F + c, p * F, p * (F + c * (b - a)), p * F + c * b],
          solution: t(
            `$\\int_{${a}}^{${b}} ${par(Q.of(c))} \\, dx = ${par(Q.of(c))}(${b} - ${par(Q.of(a))}) = ${c * (b - a)}$, so the integral is $${p} \\cdot ${par(Q.of(F))} + ${par(Q.of(c * (b - a)))} = ${answer}$.`,
            `$\\int_{${a}}^{${b}} ${par(Q.of(c))} \\, dx = ${par(Q.of(c))}(${b} - ${par(Q.of(a))}) = ${c * (b - a)}$，所以积分为 $${p} \\cdot ${par(Q.of(F))} + ${par(Q.of(c * (b - a)))} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** propertiesOfDefiniteIntegralsInvolvingTheLimitsOfIntegration reverses and splits limits of integration. */
export const propertiesOfDefiniteIntegralsInvolvingTheLimitsOfIntegration: TopicDef = {
  id: "properties-of-definite-integrals-involving-the-limits-of-integration",
  title: t("Properties of Definite Integrals Involving the Limits of Integration", "与积分限有关的定积分性质"),
  summary: t(
    "Reverse the limits of integration, integrate over a single point, and split an interval.",
    "交换积分上下限、在单点上积分，以及拆分积分区间。",
  ),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-definite-integrals"],
  encompasses: [{ topic: "the-sum-and-constant-multiple-rules-for-definite-integrals", weight: 0.4 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "reversing-the-limits",
      title: t("Reversing the limits", "交换上下限"),
      explanation: t(
        "Integrating from right to left counts every piece of area with the opposite sign, so swapping the limits flips the sign of the integral. Swapping the limits changes the sign, and an interval of length zero gives zero:\n\n$$\\int_{b}^{a} f(x) \\, dx = -\\int_{a}^{b} f(x) \\, dx, \\qquad \\int_{a}^{a} f(x) \\, dx = 0.$$",
        "从右往左积分时每一块面积都取相反的符号，所以交换上下限会改变积分的符号。交换上下限会改变符号，长度为零的区间给出零：\n\n$$\\int_{b}^{a} f(x) \\, dx = -\\int_{a}^{b} f(x) \\, dx, \\qquad \\int_{a}^{a} f(x) \\, dx = 0$$",
      ),
      generate(rng) {
        const a = rng.int(-4, 3);
        const b = a + rng.int(1, 6);
        const F = rng.nonZero(-15, 15);
        const p = rng.nonZero(-6, 6);
        const c = rng.int(-6, 6);
        const point = rng.bool(0.25);
        const answer = point ? 0 : -p * F;
        const body = p === 1 ? "f(x)" : `${p === -1 ? "-" : p}f(x)`;
        return numberProblem({
          prompt: point
            ? t(
                `Given $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$, find $\\int_{${c}}^{${c}} ${body} \\, dx$.`,
                `已知 $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，求 $\\int_{${c}}^{${c}} ${body} \\, dx$。`,
              )
            : t(
                `Given $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$, find $\\int_{${b}}^{${a}} ${body} \\, dx$.`,
                `已知 $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，求 $\\int_{${b}}^{${a}} ${body} \\, dx$。`,
              ),
          answer,
          wrong: point ? [p * F, F, p * c] : [p * F, -F, F],
          solution: point
            ? t(
                `The upper and lower limits are both $${c}$, so the integral is $0$ whatever $f$ is.`,
                `上下限都是 $${c}$，所以无论 $f$ 是什么，积分都是 $0$。`,
              )
            : t(
                `$\\int_{${b}}^{${a}} ${body} \\, dx = -${p === 1 ? "" : par(Q.of(p))}\\int_{${a}}^{${b}} f(x) \\, dx = ${answer}$.`,
                `$\\int_{${b}}^{${a}} ${body} \\, dx = -${p === 1 ? "" : par(Q.of(p))}\\int_{${a}}^{${b}} f(x) \\, dx = ${answer}$。`,
              ),
        });
      },
    },
    {
      id: "splitting-the-interval",
      title: t("Splitting the interval", "拆分积分区间"),
      explanation: t(
        "Area over a whole interval is the sum of the areas over its pieces, so a known total and one known piece give the other piece. For any $a$, $b$ and $c$,\n\n$$\\int_{a}^{b} f(x) \\, dx + \\int_{b}^{c} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx.$$\n\nTo find a piece, subtract, reversing limits where needed.",
        "整个区间上的面积等于各个小区间上面积的和，所以已知总和与其中一块，就能求出另一块。对任意 $a$、$b$、$c$，\n\n$$\\int_{a}^{b} f(x) \\, dx + \\int_{b}^{c} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx$$\n\n要求其中一段，就做减法，必要时交换上下限。",
      ),
      generate(rng) {
        const a = rng.int(-5, 2);
        const b = a + rng.int(1, 4);
        const c = b + rng.int(1, 4);
        const [AB, BC] = [rng.nonZero(-12, 12), rng.nonZero(-12, 12)];
        const AC = AB + BC;
        const int = (lo: number, hi: number) => `\\int_{${lo}}^{${hi}} f(x) \\, dx`;
        const kind = rng.int(0, 2);
        const [given1, given2, ask, answer, wrong] =
          kind === 0
            ? [`${int(a, c)} = ${AC}`, `${int(a, b)} = ${AB}`, int(b, c), BC, [AC + AB, AB - AC, -BC]]
            : kind === 1
              ? [`${int(a, c)} = ${AC}`, `${int(b, c)} = ${BC}`, int(a, b), AB, [AC + BC, BC - AC, -AB]]
              : [`${int(a, c)} = ${AC}`, `${int(a, b)} = ${AB}`, int(c, b), -BC, [BC, AC + AB, AB - AC]];
        return numberProblem({
          prompt: t(`Given $${given1}$ and $${given2}$, find $${ask}$.`, `已知 $${given1}$，$${given2}$，求 $${ask}$。`),
          answer,
          wrong,
          solution: t(
            kind === 1
              ? `$${int(a, b)} + ${int(b, c)} = ${int(a, c)}$, so $${int(a, b)} = ${AC} - ${BC < 0 ? `(${BC})` : BC} = ${AB}$.`
              : `$${int(a, b)} + ${int(b, c)} = ${int(a, c)}$, so $${int(b, c)} = ${AC} - ${AB < 0 ? `(${AB})` : AB} = ${BC}$.${kind === 2 ? ` Swapping the limits changes the sign, so $${ask} = ${answer}$.` : ""}`,
            kind === 1
              ? `$${int(a, b)} + ${int(b, c)} = ${int(a, c)}$，所以 $${int(a, b)} = ${AC} - ${BC < 0 ? `(${BC})` : BC} = ${AB}$。`
              : `$${int(a, b)} + ${int(b, c)} = ${int(a, c)}$，所以 $${int(b, c)} = ${AC} - ${AB < 0 ? `(${AB})` : AB} = ${BC}$。${kind === 2 ? `交换上下限改变符号，所以 $${ask} = ${answer}$。` : ""}`,
          ),
        });
      },
    },
  ],
};

/** calculusIRiemannTopics are the topics of Calculus I modules 8.24 and 8.25. */
export const calculusIRiemannTopics: readonly TopicDef[] = [
  approximatingAreasWithTheLeftRiemannSum,
  approximatingAreasWithTheRightRiemannSum,
  approximatingAreasWithTheMidpointRiemannSum,
  approximatingAreasWithTheTrapezoidalRule,
  leftAndRightRiemannSumsInSigmaNotation,
  midpointAndTrapezoidalRulesInSigmaNotation,
  approximatingAreasUnderGraphsOfCompositeFunctions,
  definingDefiniteIntegralsUsingLeftAndRightRiemannSums,
  theFundamentalTheoremOfCalculus,
  applyingTheFundamentalTheoremToExponentialAndTrigonometricFunctions,
  theSumAndConstantMultipleRulesForDefiniteIntegrals,
  propertiesOfDefiniteIntegralsInvolvingTheLimitsOfIntegration,
];
