import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, plane, poly, Q, radical } from "@ga/subject-math";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";

import { numberProblem, say, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import {
  type Exact,
  exactLatex,
  exactMul,
  exactNumber,
  oneOf,
  type Poly,
  pLatex,
  power,
  rounded,
  specialAngles,
  table,
} from "./calculus-common.ts";
import { fmt, functionWith, walked } from "./calculus-i-differentiation.ts";

// Calculus I unit 8: Integration, modules 8.24 and 8.25.

/** qAt evaluates a polynomial with integer coefficients at a rational x. */
export const qAt = (p: Poly, x: Q) => p.reduce((s: Q, c, i) => s.add(Q.of(c).mul(x.pow(i))), Q.zero);

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

/** Rule is a way of choosing the heights in a Riemann sum. */
type Rule = "left" | "right" | "midpoint" | "trapezoidal";

/** ruleName names a rule in both languages. */
const ruleName: Record<Rule, Text> = {
  left: t("left Riemann sum", "左黎曼和"),
  right: t("right Riemann sum", "右黎曼和"),
  midpoint: t("midpoint Riemann sum", "中点黎曼和"),
  trapezoidal: t("trapezoidal rule", "梯形法则"),
};

/** usesPoints says which heights a rule uses. */
const usesPoints: Record<Rule, Text> = {
  left: t("the heights at the left ends of the subintervals", "各子区间左端点处的高"),
  right: t("the heights at the right ends of the subintervals", "各子区间右端点处的高"),
  midpoint: t("the heights at the midpoints of the subintervals", "各子区间中点处的高"),
  trapezoidal: t("the heights at every endpoint, the two ends at half weight", "每个端点处的高，两端按一半计"),
};

/** ruleWithArticle names a rule in English with its article: "a left Riemann sum", "the trapezoidal rule". */
const ruleWithArticle = (rule: Rule) => `${rule === "trapezoidal" ? "the" : "a"} ${ruleName[rule].en}`;

/** otherRule says that a value comes from using one rule where another was asked for. */
const otherRule = (used: Rule, wanted: Rule, value: Q): Why =>
  why(
    value,
    `This is the ${ruleName[used].en}, which uses ${usesPoints[used].en}; the ${ruleName[wanted].en} uses ${usesPoints[wanted].en}.`,
    `这是${ruleName[used]["zh-CN"]}，它用${usesPoints[used]["zh-CN"]}；${ruleName[wanted]["zh-CN"]}用${usesPoints[wanted]["zh-CN"]}。`,
  );

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

/** sumOf adds the heights a rule uses, each with its weight, before multiplying by the width. */
const sumOf = (g: Grid, rule: Rule, at: (x: Q) => Q) => sample(g, rule).reduce((s, [x, w]) => s.add(at(x).mul(w)), Q.zero);

/** riemann computes the approximation of the area under f by a rule. */
function riemann(values: (x: Q) => Q, g: Grid, rule: Rule): Q {
  return sumOf(g, rule, values).mul(g.dx);
}

/** riemannSteps writes the sum of a rule term by term: "\frac{1}{2}\left[f(1) + f(\frac{3}{2})\right]". */
function riemannSteps(g: Grid, rule: Rule, f = "f"): string {
  const terms = sample(g, rule).map(([x, w]) => `${w.eq(Q.one) ? "" : "\\tfrac{1}{2}"}${f}(${x.toLatex()})`);
  return `${g.dx.eq(Q.one) ? "" : g.dx.toLatex()}\\left[${terms.join(" + ")}\\right]`;
}

/** riemannValues writes the sum of a rule with the heights put in: "\frac{1}{2} \cdot \left[3 + 5\right]". */
function riemannValues(g: Grid, rule: Rule, at: (x: Q) => Q): string {
  const terms = sample(g, rule).map(([x, w]) => `${w.eq(Q.one) ? "" : "\\tfrac{1}{2} \\cdot "}${par(at(x))}`);
  return `${g.dx.eq(Q.one) ? "" : `${g.dx.toLatex()} \\cdot `}\\left[${terms.join(" + ")}\\right]`;
}

/** heightTable tabulates the heights a rule uses. */
function heightTable(g: Grid, rule: Rule, at: (x: Q) => Q): string {
  const xs = sample(g, rule).map(([x]) => x);
  return table(["$x$", ...xs.map((x) => `$${L(x)}$`)], ["$f(x)$", ...xs.map((x) => `$${L(at(x))}$`)]);
}

/** ruleCheck checks a rule by another route: the trapezoidal rule as the average of the left and right sums, the others by adding the areas of the rectangles one by one. */
function ruleCheck(g: Grid, rule: Rule, at: (x: Q) => Q): Text {
  const answer = riemann(at, g, rule);
  if (rule === "trapezoidal") {
    const [l, r] = [riemann(at, g, "left"), riemann(at, g, "right")];
    const lines = `$$L_{${g.n}} = ${riemannValues(g, "left", at)} = ${L(l)}$$\n\n$$R_{${g.n}} = ${riemannValues(g, "right", at)} = ${L(r)}$$\n\n$$\\tfrac{1}{2}\\left(L_{${g.n}} + R_{${g.n}}\\right) = \\tfrac{1}{2}\\left(${L(l)} + ${L(r)}\\right) = ${L(answer)}$$`;
    return t(
      `The trapezoidal rule is the average of the left and right sums:\n\n${lines}\n\nThe two routes agree.`,
      `梯形法则等于左和与右和的平均值：\n\n${lines}\n\n两种算法结果一致。`,
    );
  }
  if (g.dx.eq(Q.one) && rule !== "midpoint") {
    const other = rule === "left" ? "right" : "left";
    const s = riemann(at, g, other);
    const [fa, fb] = [at(g.a), at(g.b)];
    const shift = rule === "left" ? `${L(s)} - \\left(${L(fb)} - ${big(fa)}\\right)` : `${L(s)} + \\left(${L(fb)} - ${big(fa)}\\right)`;
    const lines = `$$${other === "left" ? "L" : "R"}_{${g.n}} = ${riemannValues(g, other, at)} = ${L(s)}$$\n\n$$${shift} = ${L(answer)}$$`;
    return t(
      `The ${ruleName[other].en} shares every height but one: it uses $f(${L(rule === "left" ? g.b : g.a)})$ in place of $f(${L(rule === "left" ? g.a : g.b)})$. So ${rule === "left" ? "subtract" : "add"} $\\Delta x\\left(f(b) - f(a)\\right)$:\n\n${lines}\n\nThe two routes agree.`,
      `${ruleName[other]["zh-CN"]}只有一个高不同：它用 $f(${L(rule === "left" ? g.b : g.a)})$ 代替 $f(${L(rule === "left" ? g.a : g.b)})$。所以${rule === "left" ? "减去" : "加上"} $\\Delta x\\left(f(b) - f(a)\\right)$：\n\n${lines}\n\n两种算法结果一致。`,
    );
  }
  const areas = sample(g, rule).map(([x]) => g.dx.mul(at(x)));
  const line = `$$${areas.map(L).join(" + ")} = ${L(answer)}$$`;
  return t(
    `Multiply each height by $\\Delta x = ${L(g.dx)}$ first, which gives the area of each rectangle, and then add:\n\n${line}\n\nThe total is the same.`,
    `先把每个高乘以 $\\Delta x = ${L(g.dx)}$，得到每个矩形的面积，再相加：\n\n${line}\n\n总和相同。`,
  );
}

/** ruleSolution works out a rule in three steps, the width, the heights and their weighted sum times the width, and checks it by another route. */
function ruleSolution(g: Grid, rule: Rule, at: (x: Q) => Q, width: Text): Text {
  const half = rule === "trapezoidal";
  return walked(
    [
      [["Find the width", "求宽度"], width],
      [
        ["Find the heights", "求各个高"],
        t(`The ${ruleName[rule].en} uses ${usesPoints[rule].en}:`, `${ruleName[rule]["zh-CN"]}用${usesPoints[rule]["zh-CN"]}：`),
        [heightTable(g, rule, at)],
      ],
      [
        ["Add and multiply by the width", "相加并乘以宽度"],
        half
          ? t("Count the two end heights at half weight, add, and multiply by $\\Delta x$:", "两端的高按一半计，相加后乘以 $\\Delta x$：")
          : t("Add the heights and multiply by $\\Delta x$:", "把各个高相加，再乘以 $\\Delta x$："),
        [riemannSteps(g, rule), `= ${riemannValues(g, rule, at)}`, `= ${L(riemann(at, g, rule))}`],
      ],
    ],
    ruleCheck(g, rule, at),
  );
}

/** ruleMistakes gives the values that typical mistakes with a rule produce: another rule, no width, and too many or wrongly weighted heights. */
function ruleMistakes(g: Grid, rule: Rule, at: (x: Q) => Q, rules: readonly Rule[], extra: readonly Why[] = []): Why[] {
  const answer = riemann(at, g, rule);
  const all = nodes(g)
    .reduce((s, x) => s.add(at(x)), Q.zero)
    .mul(g.dx);
  return distinct([
    ...extra,
    ...rules.filter((r) => r !== rule).map((r) => otherRule(r, rule, riemann(at, g, r))),
    why(
      sumOf(g, rule, at),
      `This adds the heights but never multiplies by the width $\\Delta x = ${L(g.dx)}$.`,
      `这是把各个高相加，却没有乘以宽度 $\\Delta x = ${L(g.dx)}$。`,
    ),
    ...(rule === "trapezoidal"
      ? [
          why(
            answer.mul(Q.of(2)),
            "This leaves out the $\\frac{1}{2}$: each trapezoid's area is its width times the average of its two heights.",
            "这里漏掉了 $\\frac{1}{2}$：每个梯形的面积是宽度乘以两个高的平均值。",
          ),
          why(
            all,
            "This counts the two end heights in full. Each end belongs to only one trapezoid, so it counts half as much as an inner height.",
            "这里把两端的高按整份计算。端点只属于一个梯形，所以只按内部高的一半计。",
          ),
        ]
      : [
          why(
            all,
            `This adds all $${g.n + 1}$ endpoint heights. There are only $${g.n}$ rectangles, each with one height.`,
            `这是把全部 $${g.n + 1}$ 个端点处的高都加上了。只有 $${g.n}$ 个矩形，每个矩形只有一个高。`,
          ),
        ]),
  ]);
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

/** widthFrom writes the width of a grid worked out from its interval. */
const widthFrom = (g: Grid) => `\\Delta x = \\frac{b - a}{n} = \\frac{${g.b.toLatex()} - ${par(g.a)}}{${g.n}} = ${g.dx.toLatex()}`;

/** formulaProblem asks for the approximation by a rule of the area under a polynomial. */
function formulaProblem(rng: Rng, rule: Rule) {
  const g = grid(rng, 3, rule === "midpoint" ? 5 : 6);
  const p = positivePoly(rng, g);
  const at = (x: Q) => qAt(p, x);
  return numberProblem({
    prompt: t(
      `Approximate the area under the graph of $f(x) = ${pLatex(p)}$ on $${intervalLatex(g)}$ using ${ruleWithArticle(rule)} with $${g.n}$ subintervals of equal width.`,
      `用 $${g.n}$ 个等宽子区间的${ruleName[rule]["zh-CN"]}，近似计算 $f(x) = ${pLatex(p)}$ 的图像在 $${intervalLatex(g)}$ 上方与 $x$ 轴之间的面积。`,
    ),
    answer: riemann(at, g, rule),
    mistakes: ruleMistakes(g, rule, at, ["left", "right", "midpoint", "trapezoidal"]),
    solution: ruleSolution(g, rule, at, t(`$${widthFrom(g)}$.`, `$${widthFrom(g)}$。`)),
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
  const rows = table(["$x$", ...xs.map((x) => `$${x.toLatex()}$`)], ["$f(x)$", ...ys.map((y) => `$${y.toLatex()}$`)]);
  const width =
    rule === "midpoint"
      ? t(
          `The $${g.n}$ subintervals have width $${widthFrom(g)}$, twice the spacing of the table, so their midpoints are in the table.`,
          `$${g.n}$ 个子区间的宽度为 $${widthFrom(g)}$，是表格间距的两倍，所以它们的中点都在表中。`,
        )
      : t(
          `The listed $x$-values are $${L(g.dx)}$ apart and cut $${intervalLatex(g)}$ into $${g.n}$ subintervals, so $\\Delta x = ${L(g.dx)}$.`,
          `表中相邻的 $x$ 值相差 $${L(g.dx)}$，把 $${intervalLatex(g)}$ 分成 $${g.n}$ 个子区间，所以 $\\Delta x = ${L(g.dx)}$。`,
        );
  const spacing =
    rule === "midpoint"
      ? [
          why(
            answer.div(Q.of(2)),
            `This uses the spacing of the table, $${L(base.dx)}$, as the width. Each subinterval runs from one listed $x$ to the one after next, so $\\Delta x = ${L(g.dx)}$.`,
            `这里把表格的间距 $${L(base.dx)}$ 当成了宽度。每个子区间从一个列出的 $x$ 跨到下下个，所以 $\\Delta x = ${L(g.dx)}$。`,
          ),
        ]
      : [];
  return numberProblem({
    prompt: t(
      `The table gives values of a continuous function $f$.\n\n${rows}\n\nUse ${ruleWithArticle(rule)} with $${g.n}$ subintervals of equal width to approximate the area under the graph of $f$ from $x = ${g.a.toLatex()}$ to $x = ${g.b.toLatex()}$.`,
      `下表给出连续函数 $f$ 的一些值。\n\n${rows}\n\n用 $${g.n}$ 个等宽子区间的${ruleName[rule]["zh-CN"]}，近似计算 $f$ 的图像从 $x = ${g.a.toLatex()}$ 到 $x = ${g.b.toLatex()}$ 下方的面积。`,
    ),
    answer,
    mistakes: ruleMistakes(g, rule, at, ["left", "right", "trapezoidal"], spacing),
    solution: ruleSolution(g, rule, at, width),
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
  intro: t(
    "How much area lies under $y = x^{2}$ from $x = 0$ to $x = 2$? Cut $[0, 2]$ into $4$ strips of width $0.5$ and stand a rectangle on each, as tall as the curve at the strip's left end. The heights are $0$, $0.25$, $1$ and $2.25$, so the rectangles cover\n\n$$0.5\\left(0 + 0.25 + 1 + 2.25\\right) = 1.75.$$\n\nCheck: the curve rises, so each rectangle fits under it and the area is more than $1.75$; the whole region fits in the $2$ by $4$ box, so the area is less than $8$.\n\nIn this lesson we approximate the area under a graph with rectangles whose heights are taken at the left ends of equal subintervals, from a formula and from a table.",
    "$y = x^{2}$ 从 $x = 0$ 到 $x = 2$ 下方有多少面积？把 $[0, 2]$ 分成 $4$ 条宽 $0.5$ 的长条，在每条上立一个矩形，高等于曲线在该长条左端的高度。各个高是 $0$、$0.25$、$1$ 和 $2.25$，所以矩形的面积是\n\n$$0.5\\left(0 + 0.25 + 1 + 2.25\\right) = 1.75$$\n\n检验：曲线上升，所以每个矩形都在曲线下方，面积大于 $1.75$；整个区域在 $2 \\times 4$ 的方框内，所以面积小于 $8$。\n\n本课我们用矩形近似图像下方的面积，矩形的高取在等宽子区间的左端点处，函数可以由公式给出，也可以由表格给出。",
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
        "To approximate the area under $y = f(x)$ on $[a, b]$, split the interval into $n$ subintervals of width $\\Delta x = \\frac{b - a}{n}$ with endpoints $x_{0} = a, x_{1}, \\ldots, x_{n} = b$. The **left Riemann sum** uses the height at the left end of each subinterval:\n\n$$L_{n} = \\Delta x\\left[f(x_{0}) + f(x_{1}) + \\cdots + f(x_{n - 1})\\right].$$\n\nFor $f(x) = x^{2} + 1$ on $[0, 3]$ with $n = 3$: $\\Delta x = 1$, the left ends are $0$, $1$ and $2$, and $L_{3} = 1\\left[1 + 2 + 5\\right] = 8$.\n\nCheck: the three heights average $\\frac{8}{3}$, and one rectangle of that height across the whole interval has area $3 \\cdot \\frac{8}{3} = 8$.\n\n> **Watch out.** The left sum stops at $x_{n - 1}$: it never uses $f(b)$. With $n$ subintervals there are $n$ heights, not $n + 1$.",
        "要近似 $y = f(x)$ 在 $[a, b]$ 上的图像下方面积，把区间分成 $n$ 个宽为 $\\Delta x = \\frac{b - a}{n}$ 的子区间，端点为 $x_{0} = a, x_{1}, \\ldots, x_{n} = b$。**左黎曼和**取每个子区间左端点处的高：\n\n$$L_{n} = \\Delta x\\left[f(x_{0}) + f(x_{1}) + \\cdots + f(x_{n - 1})\\right]$$\n\n对 $[0, 3]$ 上的 $f(x) = x^{2} + 1$，取 $n = 3$：$\\Delta x = 1$，左端点为 $0$、$1$、$2$，$L_{3} = 1\\left[1 + 2 + 5\\right] = 8$。\n\n检验：三个高的平均值是 $\\frac{8}{3}$，以它为高、横跨整个区间的矩形面积是 $3 \\cdot \\frac{8}{3} = 8$。\n\n> **注意。** 左黎曼和到 $x_{n - 1}$ 为止，不用 $f(b)$。$n$ 个子区间只有 $n$ 个高，不是 $n + 1$ 个。",
      ),
      generate: (rng) => formulaProblem(rng, "left"),
    },
    {
      id: "left-sums-from-a-table",
      title: t("Left sums from a table", "由表格求左黎曼和"),
      explanation: t(
        "With values in a table, read the heights at the left endpoints $x_{0}, \\ldots, x_{n - 1}$; the last value $f(x_{n})$ is not used. Multiply their sum by the width $\\Delta x$, the spacing of the listed $x$-values.\n\nFor values $3, 7, 4, 5$ at $x = 0, 2, 4, 6$, there are $3$ subintervals of width $2$, and $L_{3} = 2\\left[3 + 7 + 4\\right] = 28$.\n\nCheck: the rectangles have areas $2 \\cdot 3 = 6$, $2 \\cdot 7 = 14$ and $2 \\cdot 4 = 8$, and $6 + 14 + 8 = 28$.\n\n> **Watch out.** The width is the gap between consecutive $x$-values in the table, which need not be $1$.",
        "函数值在表格中时，读出左端点 $x_{0}, \\ldots, x_{n - 1}$ 处的高，最后一个值 $f(x_{n})$ 不用。把它们的和乘以宽度 $\\Delta x$，即表中相邻 $x$ 值的间距。\n\n若 $x = 0, 2, 4, 6$ 处的值为 $3, 7, 4, 5$，则有 $3$ 个宽为 $2$ 的子区间，$L_{3} = 2\\left[3 + 7 + 4\\right] = 28$。\n\n检验：各矩形面积为 $2 \\cdot 3 = 6$、$2 \\cdot 7 = 14$、$2 \\cdot 4 = 8$，$6 + 14 + 8 = 28$。\n\n> **注意。** 宽度是表中相邻 $x$ 值的差，不一定是 $1$。",
      ),
      generate: (rng) => tableProblem(rng, "left"),
    },
  ],
};

/** Monotone is a function that is increasing or decreasing on positive x, with its values for a check. */
type Monotone = readonly [latex: string, increasing: boolean, f: (x: number) => number];

/** monotone are functions that only rise or only fall for x ≥ 1. */
const monotone: readonly Monotone[] = [
  ["e^{x}", true, Math.exp],
  ["\\sqrt{x}", true, Math.sqrt],
  ["\\ln x", true, Math.log],
  ["x^{3}", true, (x) => x ** 3],
  ["e^{-x}", false, (x) => Math.exp(-x)],
  ["\\frac{1}{x}", false, (x) => 1 / x],
  ["\\frac{1}{x^{2}}", false, (x) => 1 / (x * x)],
  ["2^{-x}", false, (x) => 2 ** -x],
];

/** approximatingAreasWithTheRightRiemannSum approximates areas with right endpoints. */
export const approximatingAreasWithTheRightRiemannSum: TopicDef = {
  id: "approximating-areas-with-the-right-riemann-sum",
  title: t("Approximating Areas With the Right Riemann Sum", "用右黎曼和近似面积"),
  summary: t(
    "Approximate areas with right endpoints, and tell when left and right sums overestimate or underestimate.",
    "用右端点近似面积，并判断左、右黎曼和何时高估或低估。",
  ),
  intro: t(
    "The left sum for $y = x^{2}$ on $[0, 2]$ with $4$ strips was $1.75$, too small because the curve rises. Taking each height at the right end of its strip instead gives heights $0.25$, $1$, $2.25$ and $4$, and\n\n$$0.5\\left(0.25 + 1 + 2.25 + 4\\right) = 3.75,$$\n\nwhich is too big, so the area lies between $1.75$ and $3.75$.\n\nCheck: the two sums share the heights $0.25$, $1$ and $2.25$; the right sum swaps $f(0) = 0$ for $f(2) = 4$, so it is larger by $0.5\\left(4 - 0\\right) = 2$, and $1.75 + 2 = 3.75$.\n\nIn this lesson we approximate areas with right endpoints, and use whether a function rises or falls to tell whether a left or right sum is too big or too small.",
    "$y = x^{2}$ 在 $[0, 2]$ 上取 $4$ 条长条的左黎曼和是 $1.75$，因为曲线上升，这个值偏小。改取每条长条右端的高，各个高为 $0.25$、$1$、$2.25$、$4$，得\n\n$$0.5\\left(0.25 + 1 + 2.25 + 4\\right) = 3.75$$\n\n这个值偏大，所以面积在 $1.75$ 和 $3.75$ 之间。\n\n检验：两个和共有 $0.25$、$1$、$2.25$ 这三个高；右和把 $f(0) = 0$ 换成 $f(2) = 4$，所以大 $0.5\\left(4 - 0\\right) = 2$，而 $1.75 + 2 = 3.75$。\n\n本课我们用右端点近似面积，并根据函数的增减判断左、右黎曼和是偏大还是偏小。",
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
        "The **right Riemann sum** uses the height at the right end of each subinterval:\n\n$$R_{n} = \\Delta x\\left[f(x_{1}) + f(x_{2}) + \\cdots + f(x_{n})\\right].$$\n\nIt differs from the left sum only in its first and last terms: $R_{n} - L_{n} = \\Delta x\\left[f(x_{n}) - f(x_{0})\\right]$. For $f(x) = x^{2} + 1$ on $[0, 3]$ with $n = 3$: the right ends are $1$, $2$ and $3$, and $R_{3} = 1\\left[2 + 5 + 10\\right] = 17$.\n\nCheck: the left sum is $L_{3} = 1 + 2 + 5 = 8$, and $R_{3} - L_{3} = 1\\left[f(3) - f(0)\\right] = 10 - 1 = 9 = 17 - 8$.\n\n> **Watch out.** The right sum starts at $x_{1}$, not at $x_{0} = a$, and it does use $f(b)$.",
        "**右黎曼和**取每个子区间右端点处的高：\n\n$$R_{n} = \\Delta x\\left[f(x_{1}) + f(x_{2}) + \\cdots + f(x_{n})\\right]$$\n\n它与左黎曼和只差首尾两项：$R_{n} - L_{n} = \\Delta x\\left[f(x_{n}) - f(x_{0})\\right]$。对 $[0, 3]$ 上的 $f(x) = x^{2} + 1$，取 $n = 3$：右端点为 $1$、$2$、$3$，$R_{3} = 1\\left[2 + 5 + 10\\right] = 17$。\n\n检验：左和 $L_{3} = 1 + 2 + 5 = 8$，而 $R_{3} - L_{3} = 1\\left[f(3) - f(0)\\right] = 10 - 1 = 9 = 17 - 8$。\n\n> **注意。** 右黎曼和从 $x_{1}$ 开始，不从 $x_{0} = a$ 开始，而且要用 $f(b)$。",
      ),
      generate: (rng) => (rng.bool() ? formulaProblem(rng, "right") : tableProblem(rng, "right")),
    },
    {
      id: "overestimates-and-underestimates",
      figure: calculusDrawings3["approximating-areas-with-the-right-riemann-sum#overestimates-and-underestimates"],
      title: t("Overestimates and underestimates", "高估与低估"),
      explanation: t(
        "If $f$ is increasing on $[a, b]$, each left rectangle lies under the curve and each right rectangle pokes above it: $L_{n}$ underestimates the area and $R_{n}$ overestimates it. If $f$ is decreasing, it is the other way round.\n\nFor $f(x) = \\sqrt{x}$ on $[0, 4]$ with $n = 2$: $L_{2} = 2\\left(\\sqrt{0} + \\sqrt{2}\\right) \\approx 2.83$ is too small and $R_{2} = 2\\left(\\sqrt{2} + \\sqrt{4}\\right) \\approx 6.83$ is too big.\n\nCheck: at $x = 1$, inside the first subinterval, the curve has height $1$, above the left rectangle's height $0$ and below the right rectangle's height $\\sqrt{2} \\approx 1.41$.\n\n> **Watch out.** The rule needs $f$ to rise, or to fall, on the whole interval. If it turns, the left and right sums can each be too big on some subintervals and too small on others.",
        "若 $f$ 在 $[a, b]$ 上递增，每个左矩形都在曲线下方，每个右矩形都高出曲线：$L_{n}$ 低估面积，$R_{n}$ 高估面积。若 $f$ 递减，则正好相反。\n\n对 $[0, 4]$ 上的 $f(x) = \\sqrt{x}$，取 $n = 2$：$L_{2} = 2\\left(\\sqrt{0} + \\sqrt{2}\\right) \\approx 2.83$ 偏小，$R_{2} = 2\\left(\\sqrt{2} + \\sqrt{4}\\right) \\approx 6.83$ 偏大。\n\n检验：在第一个子区间内的 $x = 1$ 处，曲线高为 $1$，高于左矩形的高 $0$，低于右矩形的高 $\\sqrt{2} \\approx 1.41$。\n\n> **注意。** 这个判断要求 $f$ 在整个区间上都递增，或都递减。如果函数有转折，左、右黎曼和可能在一些子区间上偏大、在另一些子区间上偏小。",
      ),
      generate(rng) {
        const [f, increasing, value] = rng.pick(monotone);
        const a = rng.int(1, 4);
        const b = a + rng.int(2, 6);
        const n = rng.int(3, 8);
        const rule = rng.pick(["left", "right"] as const);
        const over = increasing === (rule === "right");
        const right = over ? t("An overestimate", "高估") : t("An underestimate", "低估");
        const dx = Q.of(b - a, n);
        const next = Q.of(a).add(dx);
        const [fa, fn] = [fmt(value(a)), fmt(value(next.toNumber()))];
        const used = rule === "left" ? fa : fn;
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
            walked(
              [
                [
                  ["Decide whether f rises or falls", "判断 f 的增减"],
                  t(
                    `$y = ${f}$ is ${increasing ? "increasing" : "decreasing"} on $[${a}, ${b}]$.`,
                    `$y = ${f}$ 在 $[${a}, ${b}]$ 上${increasing ? "递增" : "递减"}。`,
                  ),
                ],
                [
                  ["Compare each rectangle with the curve", "比较每个矩形与曲线"],
                  t(
                    `So the height at the ${rule} end of each subinterval is the ${over ? "largest" : "smallest"} value on it. Each rectangle ${over ? "contains" : "fits under"} the curve, so the sum is ${over ? "an overestimate" : "an underestimate"}.`,
                    `所以每个子区间${rule === "left" ? "左" : "右"}端点处的高是该子区间上的${over ? "最大值" : "最小值"}。每个矩形都${over ? "盖住" : "位于"}曲线${over ? "" : "下方"}，所以这个和是${over ? "高估" : "低估"}。`,
                  ),
                ],
              ],
              t(
                `On the first subinterval, from $${a}$ to $${L(next)}$, $f(${a}) \\approx ${fa}$ and $f\\left(${L(next)}\\right) \\approx ${fn}$. The ${rule} sum uses $${used}$, the ${over ? "larger" : "smaller"} of the two, so this rectangle is ${over ? "taller" : "shorter"} than the curve there, and the same holds on every subinterval.`,
                `在第一个子区间 $${a}$ 到 $${L(next)}$ 上，$f(${a}) \\approx ${fa}$，$f\\left(${L(next)}\\right) \\approx ${fn}$。${ruleName[rule]["zh-CN"]}用 $${used}$，是两者中${over ? "较大" : "较小"}的，所以这个矩形比那里的曲线${over ? "高" : "矮"}，每个子区间都是这样。`,
              ),
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
  intro: t(
    "For $y = x^{2}$ on $[0, 2]$ with $4$ strips, the left sum $1.75$ is too small and the right sum $3.75$ too big. Taking each height in the middle of its strip, at $0.25$, $0.75$, $1.25$ and $1.75$, gives\n\n$$0.5\\left(0.0625 + 0.5625 + 1.5625 + 3.0625\\right) = 2.625.$$\n\nCheck: $2.625$ lies between $1.75$ and $3.75$, as it must, and close to their average $2.75$.\n\nIn this lesson we approximate areas with heights taken at the midpoints of the subintervals, from a formula and from a table.",
    "对 $[0, 2]$ 上的 $y = x^{2}$ 取 $4$ 条长条，左和 $1.75$ 偏小，右和 $3.75$ 偏大。改取每条长条中间的高，即 $0.25$、$0.75$、$1.25$、$1.75$ 处的高，得\n\n$$0.5\\left(0.0625 + 0.5625 + 1.5625 + 3.0625\\right) = 2.625$$\n\n检验：$2.625$ 在 $1.75$ 和 $3.75$ 之间，理应如此，而且接近两者的平均值 $2.75$。\n\n本课我们用子区间中点处的高近似面积，函数可以由公式给出，也可以由表格给出。",
  ),
  prerequisites: ["approximating-areas-with-the-right-riemann-sum"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "midpoint-sums-from-a-formula",
      title: t("Midpoint sums from a formula", "由公式求中点黎曼和"),
      explanation: t(
        "The **midpoint Riemann sum** uses the height at the middle of each subinterval, $m_{i} = \\frac{x_{i - 1} + x_{i}}{2}$:\n\n$$M_{n} = \\Delta x\\left[f(m_{1}) + f(m_{2}) + \\cdots + f(m_{n})\\right].$$\n\nIt is usually much more accurate than the left or right sum with the same $n$. For $f(x) = x^{2} + 1$ on $[0, 4]$ with $n = 2$: $\\Delta x = 2$, the midpoints are $1$ and $3$, and $M_{2} = 2\\left[2 + 10\\right] = 24$.\n\nCheck: $f$ is increasing, and $M_{2}$ lies between $L_{2} = 2\\left[1 + 5\\right] = 12$ and $R_{2} = 2\\left[5 + 17\\right] = 44$.\n\n> **Watch out.** The first midpoint is $a + \\frac{\\Delta x}{2}$, not $a + \\Delta x$, and the width stays $\\Delta x$, not $\\frac{\\Delta x}{2}$.",
        "**中点黎曼和**取每个子区间中点 $m_{i} = \\frac{x_{i - 1} + x_{i}}{2}$ 处的高：\n\n$$M_{n} = \\Delta x\\left[f(m_{1}) + f(m_{2}) + \\cdots + f(m_{n})\\right]$$\n\n在 $n$ 相同时，它通常比左、右黎曼和精确得多。对 $[0, 4]$ 上的 $f(x) = x^{2} + 1$，取 $n = 2$：$\\Delta x = 2$，中点为 $1$ 和 $3$，$M_{2} = 2\\left[2 + 10\\right] = 24$。\n\n检验：$f$ 递增，$M_{2}$ 在 $L_{2} = 2\\left[1 + 5\\right] = 12$ 和 $R_{2} = 2\\left[5 + 17\\right] = 44$ 之间。\n\n> **注意。** 第一个中点是 $a + \\frac{\\Delta x}{2}$，不是 $a + \\Delta x$；宽度仍是 $\\Delta x$，不是 $\\frac{\\Delta x}{2}$。",
      ),
      generate: (rng) => formulaProblem(rng, "midpoint"),
    },
    {
      id: "midpoint-sums-from-a-table",
      title: t("Midpoint sums from a table", "由表格求中点黎曼和"),
      explanation: t(
        "A table can only give a midpoint sum if it lists the midpoints. With values at $0, 1, 2, 3, 4$ and two subintervals $[0, 2]$ and $[2, 4]$, the midpoints are $1$ and $3$, so $M_{2} = 2\\left[f(1) + f(3)\\right]$; the width is $2$, not $1$. If the values are $5, 6, 8, 11, 15$, then $M_{2} = 2\\left[6 + 11\\right] = 34$.\n\nCheck: the values rise, and $34$ lies between $L_{2} = 2\\left[5 + 8\\right] = 26$ and $R_{2} = 2\\left[8 + 15\\right] = 46$.\n\n> **Watch out.** The values at the endpoints $0$, $2$ and $4$ are not used at all, and the width is twice the spacing of the table.",
        "只有表格列出中点处的值时，才能求中点黎曼和。若给出 $0, 1, 2, 3, 4$ 处的值，取两个子区间 $[0, 2]$ 和 $[2, 4]$，中点为 $1$ 和 $3$，所以 $M_{2} = 2\\left[f(1) + f(3)\\right]$；宽度是 $2$ 而不是 $1$。若这些值为 $5, 6, 8, 11, 15$，则 $M_{2} = 2\\left[6 + 11\\right] = 34$。\n\n检验：函数值递增，$34$ 在 $L_{2} = 2\\left[5 + 8\\right] = 26$ 和 $R_{2} = 2\\left[8 + 15\\right] = 46$ 之间。\n\n> **注意。** 端点 $0$、$2$、$4$ 处的值完全不用，宽度是表格间距的两倍。",
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
  intro: t(
    "Instead of flat-topped rectangles, join the points of $y = x^{2}$ above $0$, $0.5$, $1$, $1.5$ and $2$ with straight lines. Each strip becomes a trapezoid whose area is its width times the average of its two heights, and together\n\n$$\\frac{0.5}{2}\\left[0 + 2(0.25) + 2(1) + 2(2.25) + 4\\right] = 0.25 \\cdot 11 = 2.75.$$\n\nCheck: each trapezoid is the average of the left and right rectangles on its strip, so the total is the average of the left and right sums, $\\frac{1.75 + 3.75}{2} = 2.75$.\n\nIn this lesson we approximate areas with trapezoids, from a formula, from a table, and from the left and right sums.",
    "不用平顶的矩形，而是用直线把 $y = x^{2}$ 在 $0$、$0.5$、$1$、$1.5$、$2$ 上方的点连起来。每条长条变成一个梯形，面积等于宽度乘以两个高的平均值，合起来是\n\n$$\\frac{0.5}{2}\\left[0 + 2(0.25) + 2(1) + 2(2.25) + 4\\right] = 0.25 \\cdot 11 = 2.75$$\n\n检验：每个梯形是该长条上左矩形与右矩形的平均，所以总和是左和与右和的平均值，$\\frac{1.75 + 3.75}{2} = 2.75$。\n\n本课我们用梯形近似面积，函数可以由公式或表格给出，也可以由左和与右和求出。",
  ),
  prerequisites: ["approximating-areas-with-the-right-riemann-sum"],
  encompasses: [{ topic: "approximating-areas-with-the-right-riemann-sum", weight: 0.3 }],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "the-trapezoidal-rule-from-a-formula",
      figure: calculusDrawings3["approximating-areas-with-the-trapezoidal-rule#the-trapezoidal-rule-from-a-formula"],
      title: t("The trapezoidal rule from a formula", "由公式用梯形法则"),
      explanation: t(
        "Joining the points of the graph above consecutive endpoints gives trapezoids of area $\\frac{\\Delta x}{2}\\left[f(x_{i - 1}) + f(x_{i})\\right]$. Adding them, the inner heights count twice:\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(x_{0}) + 2f(x_{1}) + \\cdots + 2f(x_{n - 1}) + f(x_{n})\\right] = \\frac{L_{n} + R_{n}}{2}.$$\n\nFor $f(x) = x^{2} + 1$ on $[0, 3]$ with $n = 3$: $T_{3} = \\frac{1}{2}\\left[1 + 2 \\cdot 2 + 2 \\cdot 5 + 10\\right] = \\frac{25}{2} = 12.5$.\n\nCheck: $L_{3} = 8$ and $R_{3} = 17$, and $\\frac{8 + 17}{2} = 12.5$.\n\n> **Watch out.** Only the two end heights count once; every inner height counts twice, and the bracket is multiplied by $\\frac{\\Delta x}{2}$, not $\\Delta x$.",
        "把相邻端点上方的图像点连起来，得到面积为 $\\frac{\\Delta x}{2}\\left[f(x_{i - 1}) + f(x_{i})\\right]$ 的梯形。相加时，内部的高各算两次：\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(x_{0}) + 2f(x_{1}) + \\cdots + 2f(x_{n - 1}) + f(x_{n})\\right] = \\frac{L_{n} + R_{n}}{2}$$\n\n对 $[0, 3]$ 上的 $f(x) = x^{2} + 1$，取 $n = 3$：$T_{3} = \\frac{1}{2}\\left[1 + 2 \\cdot 2 + 2 \\cdot 5 + 10\\right] = \\frac{25}{2} = 12.5$。\n\n检验：$L_{3} = 8$，$R_{3} = 17$，$\\frac{8 + 17}{2} = 12.5$。\n\n> **注意。** 只有两端的高算一次，每个内部的高都算两次，方括号乘的是 $\\frac{\\Delta x}{2}$，不是 $\\Delta x$。",
      ),
      generate: (rng) => formulaProblem(rng, "trapezoidal"),
    },
    {
      id: "the-trapezoidal-rule-from-a-table",
      figure: calculusDrawings3["approximating-areas-with-the-trapezoidal-rule#the-trapezoidal-rule-from-a-table"],
      title: t("The trapezoidal rule from a table", "由表格用梯形法则"),
      explanation: t(
        "From a table, use every value: the two end values once and each inner value twice, then multiply by $\\frac{\\Delta x}{2}$. If $L_{n}$ and $R_{n}$ are already known, $T_{n}$ is their average. For values $3, 7, 4, 5$ at $x = 0, 2, 4, 6$: $T_{3} = \\frac{2}{2}\\left[3 + 2 \\cdot 7 + 2 \\cdot 4 + 5\\right] = 30$.\n\nCheck: $L_{3} = 2\\left[3 + 7 + 4\\right] = 28$ and $R_{3} = 2\\left[7 + 4 + 5\\right] = 32$, whose average is $30$.\n\n> **Watch out.** The average of $L_{n}$ and $R_{n}$ divides their sum by $2$, whatever the number of subintervals.",
        "由表格计算时，每个值都要用：两端的值各用一次，内部的值各用两次，再乘以 $\\frac{\\Delta x}{2}$。若已知 $L_{n}$ 和 $R_{n}$，$T_{n}$ 就是它们的平均值。若 $x = 0, 2, 4, 6$ 处的值为 $3, 7, 4, 5$：$T_{3} = \\frac{2}{2}\\left[3 + 2 \\cdot 7 + 2 \\cdot 4 + 5\\right] = 30$。\n\n检验：$L_{3} = 2\\left[3 + 7 + 4\\right] = 28$，$R_{3} = 2\\left[7 + 4 + 5\\right] = 32$，平均值为 $30$。\n\n> **注意。** $L_{n}$ 与 $R_{n}$ 的平均值是两者之和除以 $2$，与子区间的个数无关。",
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
          mistakes: distinct([
            why(
              l + r,
              "This adds the two sums but does not halve: the trapezoidal approximation is their average.",
              "这是把两个和相加却没有除以 $2$：梯形近似是它们的平均值。",
            ),
            why(
              Q.of(Math.abs(r - l), 2),
              "This is half the difference of the two sums; the trapezoidal approximation is half their sum.",
              "这是两个和之差的一半；梯形近似是它们之和的一半。",
            ),
            why(
              Q.of(l + r, n),
              `This divides by the number of subintervals, $${n}$; the average of two sums divides by $2$.`,
              `这是除以子区间的个数 $${n}$；两个和的平均值要除以 $2$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Relate T to L and R", "找出 T 与 L、R 的关系"],
                t(
                  "On each subinterval, the trapezoid's area is the average of the left and right rectangles, so $T_{n} = \\frac{L_{n} + R_{n}}{2}$.",
                  "在每个子区间上，梯形的面积是左矩形与右矩形面积的平均值，所以 $T_{n} = \\frac{L_{n} + R_{n}}{2}$。",
                ),
              ],
              [
                ["Average the sums", "求平均值"],
                t(`$T_{${n}} = \\frac{${l} + ${r}}{2} = ${L(answer)}$.`, `$T_{${n}} = \\frac{${l} + ${r}}{2} = ${L(answer)}$。`),
              ],
            ],
            t(
              `Start from $L_{${n}}$ and go halfway to $R_{${n}}$: $${l} + \\tfrac{1}{2}\\left(${r} - ${l}\\right) = ${l} + ${big(Q.of(r - l, 2))} = ${L(answer)}$.`,
              `从 $L_{${n}}$ 出发，向 $R_{${n}}$ 走一半：$${l} + \\tfrac{1}{2}\\left(${r} - ${l}\\right) = ${l} + ${big(Q.of(r - l, 2))} = ${L(answer)}$。`,
            ),
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
  intro: t(
    "Writing out every term of a Riemann sum gets long. For $f(x) = x^{2}$ on $[1, 3]$ with $4$ subintervals, $\\Delta x = \\frac{1}{2}$ and the endpoints are $x_{i} = 1 + \\frac{1}{2}i$, so the left sum is\n\n$$L_{4} = \\sum_{i = 0}^{3} f\\left(1 + \\tfrac{1}{2}i\\right) \\cdot \\tfrac{1}{2} = \\tfrac{1}{2}\\left(1 + 2.25 + 4 + 6.25\\right) = 6.75.$$\n\nCheck: the right sum runs from $i = 1$ to $4$, so it drops $f(1) = 1$ and gains $f(3) = 9$: $6.75 + \\frac{1}{2}(9 - 1) = 10.75$, and indeed $\\frac{1}{2}\\left(2.25 + 4 + 6.25 + 9\\right) = 10.75$.\n\nIn this lesson we write left and right Riemann sums in sigma notation, read them back, and evaluate them.",
    "把黎曼和的每一项都写出来会很长。对 $[1, 3]$ 上的 $f(x) = x^{2}$ 取 $4$ 个子区间，$\\Delta x = \\frac{1}{2}$，端点为 $x_{i} = 1 + \\frac{1}{2}i$，所以左和为\n\n$$L_{4} = \\sum_{i = 0}^{3} f\\left(1 + \\tfrac{1}{2}i\\right) \\cdot \\tfrac{1}{2} = \\tfrac{1}{2}\\left(1 + 2.25 + 4 + 6.25\\right) = 6.75$$\n\n检验：右和从 $i = 1$ 到 $4$，去掉 $f(1) = 1$，加上 $f(3) = 9$：$6.75 + \\frac{1}{2}(9 - 1) = 10.75$，而 $\\frac{1}{2}\\left(2.25 + 4 + 6.25 + 9\\right) = 10.75$，确实相符。\n\n本课我们用求和符号写出左、右黎曼和，反过来读懂这样的和，并求出它们的值。",
  ),
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
      figure: calculusDrawings3["left-and-right-riemann-sums-in-sigma-notation#writing-left-and-right-sums"],
      title: t("Writing left and right sums", "写出左、右黎曼和"),
      explanation: t(
        "Divide the interval into equal widths, then add up the areas of rectangles whose heights are taken at the left or right end of each piece. The endpoints are $x_{i} = a + i\\Delta x$. The left sum uses $i = 0$ to $n - 1$ and the right sum $i = 1$ to $n$:\n\n$$L_{n} = \\sum_{i = 0}^{n - 1} f(a + i\\Delta x)\\Delta x, \\qquad R_{n} = \\sum_{i = 1}^{n} f(a + i\\Delta x)\\Delta x.$$\n\nOn $[2, 5]$ with $n = 6$: $\\Delta x = \\frac{1}{2}$, $x_{i} = 2 + \\frac{1}{2}i$, and $R_{6} = \\sum_{i = 1}^{6} f\\left(2 + \\frac{1}{2}i\\right) \\cdot \\frac{1}{2}$.\n\nCheck: the first term, $i = 1$, is $f\\left(\\frac{5}{2}\\right)$, the right end of $\\left[2, \\frac{5}{2}\\right]$, and the last, $i = 6$, is $f(5) = f(b)$.\n\n> **Watch out.** Both sums have exactly $n$ terms, and each term is multiplied by $\\Delta x$; a sum from $i = 0$ to $n$ has $n + 1$ terms.",
        "把区间分成等宽的小段，再把高度取在每段左端或右端的矩形面积加起来。端点为 $x_{i} = a + i\\Delta x$。左黎曼和取 $i = 0$ 到 $n - 1$，右黎曼和取 $i = 1$ 到 $n$：\n\n$$L_{n} = \\sum_{i = 0}^{n - 1} f(a + i\\Delta x)\\Delta x, \\qquad R_{n} = \\sum_{i = 1}^{n} f(a + i\\Delta x)\\Delta x$$\n\n在 $[2, 5]$ 上取 $n = 6$：$\\Delta x = \\frac{1}{2}$，$x_{i} = 2 + \\frac{1}{2}i$，$R_{6} = \\sum_{i = 1}^{6} f\\left(2 + \\frac{1}{2}i\\right) \\cdot \\frac{1}{2}$。\n\n检验：第一项 $i = 1$ 是 $f\\left(\\frac{5}{2}\\right)$，即 $\\left[2, \\frac{5}{2}\\right]$ 的右端点；最后一项 $i = 6$ 是 $f(5) = f(b)$。\n\n> **注意。** 两个和都恰有 $n$ 项，每项都要乘以 $\\Delta x$；从 $i = 0$ 到 $n$ 的和有 $n + 1$ 项。",
      ),
      generate(rng) {
        const g = { ...grid(rng, 4, 10) };
        const rule = rng.pick(["left", "right"] as const);
        const other = rule === "left" ? "right" : "left";
        const [lo, hi] = rule === "left" ? [0, g.n - 1] : [1, g.n];
        const left = sigmaLatex(0, g.n - 1, g.a, g.dx, g.dx);
        const right = sigmaLatex(1, g.n, g.a, g.dx, g.dx);
        const [yes, no] = rule === "left" ? [left, right] : [right, left];
        const noWidth = sigmaLatex(lo, hi, g.a, g.dx, undefined);
        const tooMany = sigmaLatex(0, g.n, g.a, g.dx, g.dx);
        const at = (i: number) => L(g.a.add(g.dx.mul(Q.of(i))));
        return reasoned(
          oneOf(
            rng,
            t(
              `Which sum is the ${ruleName[rule].en} for a function $f$ on $${intervalLatex(g)}$ with $${g.n}$ subintervals of equal width?`,
              `函数 $f$ 在 $${intervalLatex(g)}$ 上取 $${g.n}$ 个等宽子区间，下列哪个和是它的${ruleName[rule]["zh-CN"]}？`,
            ),
            t(`$${yes}$`, `$${yes}$`),
            [no, noWidth, tooMany].filter((w) => w !== yes).map((w) => t(`$${w}$`, `$${w}$`)),
            walked(
              [
                [
                  ["Find the width and the endpoints", "求宽度和端点"],
                  t(
                    `$${widthFrom(g)}$, and the endpoints are $x_{i} = a + i\\Delta x = ${argLatex(g.a, g.dx)}$.`,
                    `$${widthFrom(g)}$，端点为 $x_{i} = a + i\\Delta x = ${argLatex(g.a, g.dx)}$。`,
                  ),
                ],
                [
                  ["Choose the indices", "确定下标范围"],
                  t(
                    `The ${ruleName[rule].en} uses ${usesPoints[rule].en}, so $i$ runs from $${lo}$ to $${hi}$: $${g.n}$ terms.`,
                    `${ruleName[rule]["zh-CN"]}用${usesPoints[rule]["zh-CN"]}，所以 $i$ 从 $${lo}$ 到 $${hi}$，共 $${g.n}$ 项。`,
                  ),
                ],
                [["Write the sum", "写出和式"], t("Each term is a height times $\\Delta x$:", "每一项都是一个高乘以 $\\Delta x$："), [yes]],
              ],
              t(
                `The first term is $f(${at(lo)})$ and the last is $f(${at(hi)})$: the ${rule} ends of the first subinterval, $\\left[${at(0)}, ${at(1)}\\right]$, and of the last, $\\left[${at(g.n - 1)}, ${at(g.n)}\\right]$.`,
                `第一项是 $f(${at(lo)})$，最后一项是 $f(${at(hi)})$：分别是第一个子区间 $\\left[${at(0)}, ${at(1)}\\right]$ 和最后一个子区间 $\\left[${at(g.n - 1)}, ${at(g.n)}\\right]$ 的${rule === "left" ? "左" : "右"}端点。`,
              ),
            ),
          ),
          [
            [
              `$${no}$`,
              `This runs from $i = ${rule === "left" ? 1 : 0}$ to $i = ${rule === "left" ? g.n : g.n - 1}$, which is the ${ruleName[other].en}.`,
              `这里从 $i = ${rule === "left" ? 1 : 0}$ 到 $i = ${rule === "left" ? g.n : g.n - 1}$，是${ruleName[other]["zh-CN"]}。`,
            ],
            [
              `$${noWidth}$`,
              `This adds the heights but leaves out the width $\\Delta x = ${L(g.dx)}$; each term is a height times a width.`,
              `这里只把高相加，漏掉了宽度 $\\Delta x = ${L(g.dx)}$；每一项都是高乘以宽。`,
            ],
            [
              `$${tooMany}$`,
              `This runs from $i = 0$ to $i = ${g.n}$: $${g.n + 1}$ terms, one more than there are subintervals.`,
              `这里从 $i = 0$ 到 $i = ${g.n}$，共 $${g.n + 1}$ 项，比子区间多一项。`,
            ],
          ],
        );
      },
    },
    {
      id: "evaluating-sums-in-sigma-notation",
      title: t("Evaluating sums in sigma notation", "计算求和符号表示的和"),
      explanation: t(
        "To evaluate a Riemann sum in sigma notation, substitute each value of $i$, evaluate $f$, and add. Reading the sum backward also tells you the interval: the arguments run through the endpoints used.\n\nFor $f(x) = x^{2}$, the sum $\\sum_{i = 1}^{3} f(1 + i)$ has arguments $2, 3, 4$, so it is $4 + 9 + 16 = 29$: the right sum on $[1, 4]$ with $\\Delta x = 1$.\n\nCheck: the left sum on $[1, 4]$ is $1 + 4 + 9 = 14$, and the right sum is larger by $f(4) - f(1) = 15$: $14 + 15 = 29$.\n\n> **Watch out.** Start at the lower index shown: a sum from $i = 0$ uses $f(a)$, a sum from $i = 1$ does not. And multiply by any width factor written after $f$.",
        "要计算用求和符号表示的黎曼和，逐个代入 $i$ 的值，求出 $f$ 的值再相加。反过来读这个和也能知道区间：自变量依次取所用的端点。\n\n对 $f(x) = x^{2}$，和 $\\sum_{i = 1}^{3} f(1 + i)$ 的自变量为 $2, 3, 4$，所以等于 $4 + 9 + 16 = 29$，即 $[1, 4]$ 上 $\\Delta x = 1$ 的右和。\n\n检验：$[1, 4]$ 上的左和是 $1 + 4 + 9 = 14$，右和比它大 $f(4) - f(1) = 15$：$14 + 15 = 29$。\n\n> **注意。** 从和式标出的下标开始：从 $i = 0$ 开始的和用到 $f(a)$，从 $i = 1$ 开始的则不用。还要乘以写在 $f$ 后面的宽度因子。",
      ),
      generate(rng) {
        const g = grid(rng, 3, 5);
        const rule = rng.pick(["left", "right"] as const);
        const other = rule === "left" ? "right" : "left";
        const [lo, hi] = rule === "left" ? [0, g.n - 1] : [1, g.n];
        const p = positivePoly(rng, g);
        const at = (x: Q) => qAt(p, x);
        const answer = riemann(at, g, rule);
        const sum = sigmaLatex(lo, hi, g.a, g.dx, g.dx);
        const args = sample(g, rule)
          .map(([x]) => x.toLatex())
          .join(", ");
        return numberProblem({
          prompt: t(`Let $f(x) = ${pLatex(p)}$. Evaluate $${sum}$.`, `设 $f(x) = ${pLatex(p)}$。求 $${sum}$ 的值。`),
          answer,
          mistakes: distinct([
            why(
              riemann(at, g, other),
              `This uses $i = ${rule === "left" ? 1 : 0}$ to $${rule === "left" ? g.n : g.n - 1}$, the ${ruleName[other].en}. The sum shown runs from $i = ${lo}$ to $${hi}$, so its arguments are $${args}$.`,
              `这里用了 $i = ${rule === "left" ? 1 : 0}$ 到 $${rule === "left" ? g.n : g.n - 1}$，是${ruleName[other]["zh-CN"]}。题中的和从 $i = ${lo}$ 到 $${hi}$，自变量是 $${args}$。`,
            ),
            why(
              answer.div(g.dx),
              `This leaves out the factor $${L(g.dx)}$ written after each $f$.`,
              `这里漏掉了每个 $f$ 后面的因子 $${L(g.dx)}$。`,
            ),
            why(
              riemann(at, { ...g, n: g.n + 1, b: g.b.add(g.dx) }, rule),
              `This adds one term too many: from $i = ${lo}$ to $i = ${hi}$ there are $${g.n}$ terms.`,
              `这里多加了一项：从 $i = ${lo}$ 到 $i = ${hi}$ 只有 $${g.n}$ 项。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["List the arguments", "列出自变量"],
                t(
                  `Putting $i = ${lo}, \\ldots, ${hi}$ into $${argLatex(g.a, g.dx)}$ gives $${args}$.`,
                  `把 $i = ${lo}, \\ldots, ${hi}$ 代入 $${argLatex(g.a, g.dx)}$，得 $${args}$。`,
                ),
              ],
              [["Evaluate f", "求函数值"], t("The heights are:", "各个高为："), [heightTable(g, rule, at)]],
              [
                ["Add the terms", "把各项相加"],
                g.dx.eq(Q.one)
                  ? t(
                      "No factor follows $f$, since $\\Delta x = 1$, so add the heights:",
                      "$f$ 后面没有因子，因为 $\\Delta x = 1$，所以把各个高相加：",
                    )
                  : t(`Each term carries the factor $${L(g.dx)}$:`, `每一项都带有因子 $${L(g.dx)}$：`),
                [riemannSteps(g, rule), `= ${riemannValues(g, rule, at)}`, `= ${L(answer)}`],
              ],
            ],
            ruleCheck(g, rule, at),
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
  intro: t(
    "The midpoint of the $i$th subinterval sits half a width before its right end. On $[0, 2]$ with $4$ subintervals, $\\Delta x = \\frac{1}{2}$ and the $i$th midpoint is $\\left(i - \\frac{1}{2}\\right) \\cdot \\frac{1}{2} = -\\frac{1}{4} + \\frac{1}{2}i$, so\n\n$$M_{4} = \\sum_{i = 1}^{4} f\\left(-\\tfrac{1}{4} + \\tfrac{1}{2}i\\right) \\cdot \\tfrac{1}{2}.$$\n\nCheck: $i = 1$ gives $\\frac{1}{4}$, the middle of $\\left[0, \\frac{1}{2}\\right]$, and $i = 4$ gives $\\frac{7}{4}$, the middle of $\\left[\\frac{3}{2}, 2\\right]$.\n\nIn this lesson we write the midpoint rule and the trapezoidal rule in sigma notation, with the arguments simplified to the form $c + di$.",
    "第 $i$ 个子区间的中点在它右端点之前半个宽度处。在 $[0, 2]$ 上取 $4$ 个子区间，$\\Delta x = \\frac{1}{2}$，第 $i$ 个中点为 $\\left(i - \\frac{1}{2}\\right) \\cdot \\frac{1}{2} = -\\frac{1}{4} + \\frac{1}{2}i$，所以\n\n$$M_{4} = \\sum_{i = 1}^{4} f\\left(-\\tfrac{1}{4} + \\tfrac{1}{2}i\\right) \\cdot \\tfrac{1}{2}$$\n\n检验：$i = 1$ 给出 $\\frac{1}{4}$，是 $\\left[0, \\frac{1}{2}\\right]$ 的中点；$i = 4$ 给出 $\\frac{7}{4}$，是 $\\left[\\frac{3}{2}, 2\\right]$ 的中点。\n\n本课我们用求和符号写出中点法则和梯形法则，并把自变量化简成 $c + di$ 的形式。",
  ),
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
        "The midpoint of the $i$th subinterval is $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$ for $i = 1, \\ldots, n$, so\n\n$$M_{n} = \\sum_{i = 1}^{n} f\\left(a + \\left(i - \\tfrac{1}{2}\\right)\\Delta x\\right)\\Delta x.$$\n\nSimplify the argument to the form $c + di$. On $[1, 4]$ with $n = 6$: $\\Delta x = \\frac{1}{2}$, and $1 + \\left(i - \\frac{1}{2}\\right) \\cdot \\frac{1}{2} = \\frac{3}{4} + \\frac{1}{2}i$, so $M_{6} = \\sum_{i = 1}^{6} f\\left(\\frac{3}{4} + \\frac{1}{2}i\\right) \\cdot \\frac{1}{2}$.\n\nCheck: $i = 1$ gives $\\frac{5}{4}$, halfway between $1$ and $\\frac{3}{2}$, and $i = 6$ gives $\\frac{15}{4}$, halfway between $\\frac{7}{2}$ and $4$.\n\n> **Watch out.** Subtract half a width, $\\frac{1}{2}\\Delta x$, not $\\frac{1}{2}$; and each term is still multiplied by the full width $\\Delta x$.",
        "第 $i$ 个子区间的中点为 $a + \\left(i - \\frac{1}{2}\\right)\\Delta x$，$i = 1, \\ldots, n$，所以\n\n$$M_{n} = \\sum_{i = 1}^{n} f\\left(a + \\left(i - \\tfrac{1}{2}\\right)\\Delta x\\right)\\Delta x$$\n\n把自变量化简成 $c + di$ 的形式。在 $[1, 4]$ 上取 $n = 6$：$\\Delta x = \\frac{1}{2}$，$1 + \\left(i - \\frac{1}{2}\\right) \\cdot \\frac{1}{2} = \\frac{3}{4} + \\frac{1}{2}i$，所以 $M_{6} = \\sum_{i = 1}^{6} f\\left(\\frac{3}{4} + \\frac{1}{2}i\\right) \\cdot \\frac{1}{2}$。\n\n检验：$i = 1$ 给出 $\\frac{5}{4}$，在 $1$ 与 $\\frac{3}{2}$ 正中间；$i = 6$ 给出 $\\frac{15}{4}$，在 $\\frac{7}{2}$ 与 $4$ 正中间。\n\n> **注意。** 减去的是半个宽度 $\\frac{1}{2}\\Delta x$，不是 $\\frac{1}{2}$；每一项仍乘以整个宽度 $\\Delta x$。",
      ),
      generate(rng) {
        const g = grid(rng, 4, 10);
        const half = g.dx.mul(Q.of(1, 2));
        const right = sigmaLatex(1, g.n, g.a.sub(half), g.dx, g.dx);
        const shifted = sigmaLatex(1, g.n, g.a.add(half), g.dx, g.dx);
        const ends = sigmaLatex(1, g.n, g.a, g.dx, g.dx);
        const halfWidth = sigmaLatex(1, g.n, g.a.sub(half), g.dx, half);
        const first = g.a.add(half);
        const last = g.b.sub(half);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which sum is the midpoint Riemann sum for a function $f$ on $${intervalLatex(g)}$ with $${g.n}$ subintervals of equal width?`,
              `函数 $f$ 在 $${intervalLatex(g)}$ 上取 $${g.n}$ 个等宽子区间，下列哪个和是它的中点黎曼和？`,
            ),
            t(`$${right}$`, `$${right}$`),
            [shifted, ends, halfWidth].map((w) => t(`$${w}$`, `$${w}$`)),
            walked(
              [
                [["Find the width", "求宽度"], t(`$${widthFrom(g)}$.`, `$${widthFrom(g)}$。`)],
                [
                  ["Find the ith midpoint", "求第 i 个中点"],
                  t("Half a width before the right end $a + i\\Delta x$:", "在右端点 $a + i\\Delta x$ 之前半个宽度处："),
                  [`${g.a.toLatex()} + \\left(i - \\frac{1}{2}\\right) \\cdot ${g.dx.toLatex()} = ${argLatex(g.a.sub(half), g.dx)}`],
                ],
                [
                  ["Write the sum", "写出和式"],
                  t("Each term is a height times the full width $\\Delta x$:", "每一项都是一个高乘以整个宽度 $\\Delta x$："),
                  [`M_{${g.n}} = ${right}`],
                ],
              ],
              t(
                `For $i = 1$ the argument is $${L(first)}$, halfway between $${L(g.a)}$ and $${L(g.a.add(g.dx))}$; for $i = ${g.n}$ it is $${L(last)}$, halfway between $${L(g.b.sub(g.dx))}$ and $${L(g.b)}$.`,
                `$i = 1$ 时自变量为 $${L(first)}$，在 $${L(g.a)}$ 与 $${L(g.a.add(g.dx))}$ 正中间；$i = ${g.n}$ 时为 $${L(last)}$，在 $${L(g.b.sub(g.dx))}$ 与 $${L(g.b)}$ 正中间。`,
              ),
            ),
          ),
          [
            [
              `$${shifted}$`,
              `This samples at $a + \\left(i + \\frac{1}{2}\\right)\\Delta x$: its last term, at $${L(g.b.add(half))}$, lies past $${L(g.b)}$.`,
              `这里取样点是 $a + \\left(i + \\frac{1}{2}\\right)\\Delta x$：最后一项在 $${L(g.b.add(half))}$，超出了 $${L(g.b)}$。`,
            ],
            [
              `$${ends}$`,
              "This samples at $a + i\\Delta x$, the right ends of the subintervals: it is the right Riemann sum.",
              "这里取样点是 $a + i\\Delta x$，即各子区间的右端点：这是右黎曼和。",
            ],
            [
              `$${halfWidth}$`,
              `This multiplies by $\\frac{\\Delta x}{2} = ${L(half)}$, but each midpoint rectangle has the full width $\\Delta x = ${L(g.dx)}$.`,
              `这里乘的是 $\\frac{\\Delta x}{2} = ${L(half)}$，但每个中点矩形的宽是整个 $\\Delta x = ${L(g.dx)}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "the-trapezoidal-rule-in-sigma-notation",
      figure: calculusDrawings3["midpoint-and-trapezoidal-rules-in-sigma-notation#the-trapezoidal-rule-in-sigma-notation"],
      title: t("The trapezoidal rule in sigma notation", "用求和符号表示梯形法则"),
      explanation: t(
        "Each trapezoid averages the heights at its two ends, so every inner point is shared by two trapezoids and counted twice. The inner endpoints $x_{1}, \\ldots, x_{n - 1}$ count twice and the ends once:\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(a) + 2\\sum_{i = 1}^{n - 1} f(a + i\\Delta x) + f(b)\\right].$$\n\nOn $[0, 3]$ with $n = 3$: $T_{3} = \\frac{1}{2}\\left[f(0) + 2\\sum_{i = 1}^{2} f(i) + f(3)\\right]$.\n\nCheck: for $f(x) = 1$ the area is the length $3$, and the formula gives $\\frac{1}{2}\\left[1 + 2 \\cdot 2 + 1\\right] = 3$.\n\n> **Watch out.** The sum inside runs over the inner points only, from $i = 1$ to $n - 1$; the ends $f(a)$ and $f(b)$ stand outside it.",
        "每个梯形取两端高度的平均值，所以每个内部点被两个梯形共用，要算两次。内部端点 $x_{1}, \\ldots, x_{n - 1}$ 各算两次，两端各算一次：\n\n$$T_{n} = \\frac{\\Delta x}{2}\\left[f(a) + 2\\sum_{i = 1}^{n - 1} f(a + i\\Delta x) + f(b)\\right]$$\n\n在 $[0, 3]$ 上取 $n = 3$：$T_{3} = \\frac{1}{2}\\left[f(0) + 2\\sum_{i = 1}^{2} f(i) + f(3)\\right]$。\n\n检验：$f(x) = 1$ 时面积等于区间长度 $3$，公式给出 $\\frac{1}{2}\\left[1 + 2 \\cdot 2 + 1\\right] = 3$。\n\n> **注意。** 括号里的和只取内部点，从 $i = 1$ 到 $n - 1$；两端的 $f(a)$ 和 $f(b)$ 写在和的外面。",
      ),
      generate(rng) {
        const g = grid(rng, 4, 10);
        const half = g.dx.mul(Q.of(1, 2));
        const ends = (inner: string, factor: Q) =>
          `${factor.eq(Q.one) ? "" : factor.toLatex()}\\left[f(${g.a.toLatex()}) + ${inner} + f(${g.b.toLatex()})\\right]`;
        const right = ends(`2${sigmaLatex(1, g.n - 1, g.a, g.dx, undefined)}`, half);
        const once = ends(sigmaLatex(1, g.n - 1, g.a, g.dx, undefined), half);
        const fullWidth = ends(`2${sigmaLatex(1, g.n - 1, g.a, g.dx, undefined)}`, g.dx);
        const allPoints = ends(`2${sigmaLatex(0, g.n, g.a, g.dx, undefined)}`, half);
        const length = g.b.sub(g.a);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which expression is the trapezoidal approximation for a function $f$ on $${intervalLatex(g)}$ with $${g.n}$ subintervals of equal width?`,
              `函数 $f$ 在 $${intervalLatex(g)}$ 上取 $${g.n}$ 个等宽子区间，下列哪个式子是它的梯形近似？`,
            ),
            t(`$${right}$`, `$${right}$`),
            [once, fullWidth, allPoints].map((w) => t(`$${w}$`, `$${w}$`)),
            walked(
              [
                [
                  ["Find the factor in front", "求前面的因子"],
                  t(
                    `$${widthFrom(g)}$, so the factor is $\\frac{\\Delta x}{2} = ${half.toLatex()}$.`,
                    `$${widthFrom(g)}$，所以因子为 $\\frac{\\Delta x}{2} = ${half.toLatex()}$。`,
                  ),
                ],
                [
                  ["Weigh the heights", "确定各个高的权重"],
                  t(
                    `The inner endpoints $${argLatex(g.a, g.dx)}$ for $i = 1, \\ldots, ${g.n - 1}$ count twice, and $f(${g.a.toLatex()})$ and $f(${g.b.toLatex()})$ once:`,
                    `内部端点 $${argLatex(g.a, g.dx)}$（$i = 1, \\ldots, ${g.n - 1}$）各算两次，$f(${g.a.toLatex()})$ 和 $f(${g.b.toLatex()})$ 各算一次：`,
                  ),
                  [`T_{${g.n}} = ${right}`],
                ],
              ],
              t(
                `If $f(x) = 1$, the area is the length $${L(g.b)} - ${par(g.a)} = ${L(length)}$. The expression gives $${half.toLatex()} \\cdot \\left[1 + 2 \\cdot ${g.n - 1} + 1\\right] = ${half.toLatex()} \\cdot ${2 * g.n} = ${L(length)}$.`,
                `若 $f(x) = 1$，面积等于区间长度 $${L(g.b)} - ${par(g.a)} = ${L(length)}$。这个式子给出 $${half.toLatex()} \\cdot \\left[1 + 2 \\cdot ${g.n - 1} + 1\\right] = ${half.toLatex()} \\cdot ${2 * g.n} = ${L(length)}$。`,
              ),
            ),
          ),
          [
            [
              `$${once}$`,
              "This counts each inner height once. Each inner point is shared by two trapezoids, so its height counts twice.",
              "这里内部的高只算了一次。每个内部点被两个梯形共用，所以它的高要算两次。",
            ],
            [
              `$${fullWidth}$`,
              `This multiplies by $\\Delta x = ${L(g.dx)}$; averaging the two heights of each trapezoid makes the factor $\\frac{\\Delta x}{2} = ${L(half)}$.`,
              `这里乘的是 $\\Delta x = ${L(g.dx)}$；每个梯形取两个高的平均值，所以因子是 $\\frac{\\Delta x}{2} = ${L(half)}$。`,
            ],
            [
              `$${allPoints}$`,
              `The sum from $i = 0$ to $${g.n}$ includes the two ends, so $f(${g.a.toLatex()})$ and $f(${g.b.toLatex()})$ would count three times; it should run from $1$ to $${g.n - 1}$.`,
              `从 $i = 0$ 到 $${g.n}$ 的和包含两端，这样 $f(${g.a.toLatex()})$ 和 $f(${g.b.toLatex()})$ 会算三次；应从 $1$ 到 $${g.n - 1}$。`,
            ],
          ],
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

/** Shape is a function with its monotonicity and concavity on x ≥ 0, and its values for a check. */
type Shape = readonly [latex: string, increasing: boolean, up: boolean, f: (x: number) => number];

/** approximatingAreasUnderGraphsOfCompositeFunctions applies the rules to functions needing a calculator. */
export const approximatingAreasUnderGraphsOfCompositeFunctions: TopicDef = {
  id: "approximating-areas-under-graphs-of-composite-functions",
  title: t("Approximating Areas Under Graphs of Composite Functions", "近似复合函数图像下方的面积"),
  summary: t(
    "Apply the four approximation rules to roots, logarithms, exponentials and trigonometric functions.",
    "把四种近似法则用于根式、对数、指数和三角函数。",
  ),
  intro: t(
    "The rules do not care what the function is, only what its values are. For $y = \\sqrt{x + 1}$ on $[0, 3]$ with $3$ subintervals, the midpoint sum needs $\\sqrt{1.5}$, $\\sqrt{2.5}$ and $\\sqrt{3.5}$, which a calculator gives:\n\n$$M_{3} = 1 \\cdot \\left(1.2247 + 1.5811 + 1.8708\\right) \\approx 4.677.$$\n\nCheck: the function rises, so $M_{3}$ should lie between $L_{3} = 1 + 1.4142 + 1.7321 \\approx 4.146$ and $R_{3} = 1.4142 + 1.7321 + 2 \\approx 5.146$, and it does.\n\nIn this lesson we apply the left, right, midpoint and trapezoidal rules to roots, logarithms, exponentials and trigonometric functions, and use the shape of the graph to tell which approximations are too big.",
    "这些法则不关心函数是什么，只关心它的值。对 $[0, 3]$ 上的 $y = \\sqrt{x + 1}$ 取 $3$ 个子区间，中点和要用到 $\\sqrt{1.5}$、$\\sqrt{2.5}$、$\\sqrt{3.5}$，用计算器求得：\n\n$$M_{3} = 1 \\cdot \\left(1.2247 + 1.5811 + 1.8708\\right) \\approx 4.677$$\n\n检验：函数递增，所以 $M_{3}$ 应在 $L_{3} = 1 + 1.4142 + 1.7321 \\approx 4.146$ 和 $R_{3} = 1.4142 + 1.7321 + 2 \\approx 5.146$ 之间，确实如此。\n\n本课我们把左、右、中点和梯形法则用于根式、对数、指数和三角函数，并根据图像的形状判断哪些近似值偏大。",
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
        "The rules work the same way for any function: find $\\Delta x$, list the points the rule uses, evaluate $f$ there with a calculator, and combine. Keep full precision until the end and round only the final answer.\n\nFor $\\ln(x + 1)$ on $[0, 2]$ with $n = 2$, the trapezoidal rule gives $T_{2} = \\frac{1}{2}\\left[\\ln 1 + 2\\ln 2 + \\ln 3\\right] \\approx \\frac{1}{2}\\left(0 + 1.3863 + 1.0986\\right) \\approx 1.242$.\n\nCheck: $L_{2} = \\ln 1 + \\ln 2 \\approx 0.6931$ and $R_{2} = \\ln 2 + \\ln 3 \\approx 1.7918$, and their average is $\\approx 1.2425$.\n\n> **Watch out.** Rounding each value early adds up errors: with values rounded to one decimal place the same sum gives $\\frac{1}{2}\\left(0 + 1.4 + 1.1\\right) = 1.25$. Use radians for trigonometric functions.",
        "这些法则对任何函数都一样用：求出 $\\Delta x$，列出法则要用的点，用计算器求这些点处的 $f$ 值，再组合起来。中间保留全部精度，只对最终答案取近似。\n\n对 $[0, 2]$ 上的 $\\ln(x + 1)$ 取 $n = 2$，梯形法则给出 $T_{2} = \\frac{1}{2}\\left[\\ln 1 + 2\\ln 2 + \\ln 3\\right] \\approx \\frac{1}{2}\\left(0 + 1.3863 + 1.0986\\right) \\approx 1.242$。\n\n检验：$L_{2} = \\ln 1 + \\ln 2 \\approx 0.6931$，$R_{2} = \\ln 2 + \\ln 3 \\approx 1.7918$，平均值 $\\approx 1.2425$。\n\n> **注意。** 过早取近似会累积误差：各值只保留一位小数时，同一个和得 $\\frac{1}{2}\\left(0 + 1.4 + 1.1\\right) = 1.25$。三角函数要用弧度。",
      ),
      figure: midpointFigure,
      generate(rng) {
        const k = rng.int(1, 5);
        const c = rng.pick(curves(k));
        const rule = rng.pick(["left", "right", "midpoint", "trapezoidal"] as const);
        const dx = rule === "midpoint" ? rng.pick([Q.of(1, 2), Q.of(2)]) : rng.pick([Q.of(1, 2), Q.one, Q.one]);
        const n = rng.int(3, 6);
        const a = Q.of(Math.max(c.from, rng.int(-2, 2)));
        const g: Grid = { a, b: a.add(dx.mul(Q.of(n))), dx, n };
        const value = (r: Rule) => sample(g, r).reduce((s, [x, w]) => s + c.f(x.toNumber()) * w.toNumber(), 0) * dx.toNumber();
        const answer = rounded(value(rule), 3) ?? Q.zero;
        const points = sample(g, rule).map(([x]) => x);
        const heights = table(["$x$", ...points.map((x) => `$${L(x)}$`)], ["$f(x)$", ...points.map((x) => `$${fmt(c.f(x.toNumber()))}$`)]);
        const check =
          rule === "trapezoidal"
            ? t(
                `The trapezoidal rule is the average of the left and right sums: $L_{${n}} \\approx ${fmt(value("left"))}$ and $R_{${n}} \\approx ${fmt(value("right"))}$, and $\\tfrac{1}{2}\\left(${fmt(value("left"))} + ${fmt(value("right"))}\\right) \\approx ${fmt(value(rule))}$.`,
                `梯形法则是左和与右和的平均值：$L_{${n}} \\approx ${fmt(value("left"))}$，$R_{${n}} \\approx ${fmt(value("right"))}$，$\\tfrac{1}{2}\\left(${fmt(value("left"))} + ${fmt(value("right"))}\\right) \\approx ${fmt(value(rule))}$。`,
              )
            : dx.eq(Q.one) && rule !== "midpoint"
              ? t(
                  `The ${ruleName[rule === "left" ? "right" : "left"].en} shares every height but one, and comes to $\\approx ${fmt(value(rule === "left" ? "right" : "left"))}$. It uses $f(${L(rule === "left" ? g.b : g.a)}) \\approx ${fmt(c.f((rule === "left" ? g.b : g.a).toNumber()))}$ in place of $f(${L(rule === "left" ? g.a : g.b)}) \\approx ${fmt(c.f((rule === "left" ? g.a : g.b).toNumber()))}$, so the ${ruleName[rule].en} is $\\approx ${fmt(value(rule))}$ again.`,
                  `${ruleName[rule === "left" ? "right" : "left"]["zh-CN"]}只有一个高不同，它约为 $${fmt(value(rule === "left" ? "right" : "left"))}$。它用 $f(${L(rule === "left" ? g.b : g.a)}) \\approx ${fmt(c.f((rule === "left" ? g.b : g.a).toNumber()))}$ 代替 $f(${L(rule === "left" ? g.a : g.b)}) \\approx ${fmt(c.f((rule === "left" ? g.a : g.b).toNumber()))}$，换回来，${ruleName[rule]["zh-CN"]}同样约为 $${fmt(value(rule))}$。`,
                )
              : t(
                  `Multiply each height by $\\Delta x$ first, which gives the rectangles' areas $${points.map((x) => fmt(c.f(x.toNumber()) * dx.toNumber())).join(", ")}$; they add to $\\approx ${fmt(value(rule))}$, which also rounds to $${answer.toNumber()}$.`,
                  `先把每个高乘以 $\\Delta x$，得到各矩形的面积 $${points.map((x) => fmt(c.f(x.toNumber()) * dx.toNumber())).join(", ")}$；它们之和 $\\approx ${fmt(value(rule))}$，同样取近似为 $${answer.toNumber()}$。`,
                );
        return numberProblem({
          prompt: t(
            `Use ${ruleWithArticle(rule)} with $${n}$ subintervals of equal width to approximate the area under $y = ${c.latex}$ on $${intervalLatex(g)}$. Round to three decimal places.`,
            `用 $${n}$ 个等宽子区间的${ruleName[rule]["zh-CN"]}，近似计算 $y = ${c.latex}$ 在 $${intervalLatex(g)}$ 上的图像下方面积，精确到三位小数。`,
          ),
          answer,
          form: "decimal",
          mistakes: distinct([
            ...(["left", "right", "midpoint", "trapezoidal"] as const)
              .filter((r) => r !== rule)
              .map((r) => otherRule(r, rule, rounded(value(r), 3) ?? answer)),
            why(
              rounded(value(rule) / dx.toNumber(), 3) ?? answer,
              `This adds the heights but never multiplies by the width $\\Delta x = ${L(dx)}$.`,
              `这是把各个高相加，却没有乘以宽度 $\\Delta x = ${L(dx)}$。`,
            ),
          ]),
          solution: walked(
            [
              [["Find the width", "求宽度"], t(`$${widthFrom(g)}$.`, `$${widthFrom(g)}$。`)],
              [
                ["Evaluate f with a calculator", "用计算器求函数值"],
                t(
                  `The ${ruleName[rule].en} uses ${usesPoints[rule].en}. With $f(x) = ${c.latex}$, to four decimal places:`,
                  `${ruleName[rule]["zh-CN"]}用${usesPoints[rule]["zh-CN"]}。$f(x) = ${c.latex}$，保留四位小数：`,
                ),
                [heights],
              ],
              [
                ["Combine and round", "组合并取近似"],
                t(
                  `Keeping full precision until the end, then rounding to $${answer.toNumber()}$:`,
                  `中间保留全部精度，最后取近似为 $${answer.toNumber()}$：`,
                ),
                [`${riemannSteps(g, rule)} \\approx ${fmt(value(rule))}`],
              ],
            ],
            check,
          ),
        });
      },
    },
    {
      id: "overestimates-from-monotonicity-and-concavity",
      figure: calculusDrawings3["approximating-areas-under-graphs-of-composite-functions#overestimates-from-monotonicity-and-concavity"],
      title: t("Overestimates from monotonicity and concavity", "由单调性和凹凸性判断高估或低估"),
      explanation: t(
        "Whether an approximation is too big or too small depends on the shape of the graph, not on the numbers:\n\n- **left and right sums** depend on monotonicity: for an increasing $f$, $L_{n}$ underestimates and $R_{n}$ overestimates; for a decreasing $f$ it is the other way round;\n- **the trapezoidal rule and the midpoint sum** depend on concavity: if $f$ is concave up, each chord lies above the curve, so the trapezoidal rule overestimates, and each midpoint rectangle trades a smaller piece of extra area for a larger missing one, so the midpoint sum underestimates; if $f$ is concave down, both reverse.\n\nSo find the signs of $f'$ and $f''$ on the interval first. For $\\sqrt{x + 1}$, $f' > 0$ and $f'' < 0$: the right sum and the midpoint sum overestimate. On $[0, 2]$ with one subinterval, $T_{1} = 2 \\cdot \\frac{1 + \\sqrt{3}}{2} \\approx 2.732$ and $M_{1} = 2\\sqrt{2} \\approx 2.828$.\n\nCheck: the exact area is $\\frac{2}{3}\\left(3\\sqrt{3} - 1\\right) \\approx 2.797$, between $T_{1}$ and $M_{1}$, with the midpoint value above it.\n\n> **Watch out.** Do not mix the two tests: concavity says nothing about left and right sums, and monotonicity says nothing about the midpoint and trapezoidal rules.",
        "近似值偏大还是偏小取决于图像的形状，而不是具体数值：\n\n- **左、右黎曼和**取决于单调性：$f$ 递增时，$L_{n}$ 低估、$R_{n}$ 高估；$f$ 递减时正好相反；\n- **梯形法则和中点黎曼和**取决于凹凸性：$f$ 下凸（凹向上）时，每条弦都在曲线上方，所以梯形法则高估；每个中点矩形多出的面积小于缺少的面积，所以中点黎曼和低估；$f$ 上凸（凹向下）时，两者都反过来。\n\n所以先判断 $f'$ 和 $f''$ 在区间上的符号。对 $\\sqrt{x + 1}$，$f' > 0$，$f'' < 0$：右黎曼和与中点黎曼和高估。在 $[0, 2]$ 上取一个子区间，$T_{1} = 2 \\cdot \\frac{1 + \\sqrt{3}}{2} \\approx 2.732$，$M_{1} = 2\\sqrt{2} \\approx 2.828$。\n\n检验：精确面积为 $\\frac{2}{3}\\left(3\\sqrt{3} - 1\\right) \\approx 2.797$，在 $T_{1}$ 与 $M_{1}$ 之间，中点值比它大。\n\n> **注意。** 两种判断不要混用：凹凸性与左、右黎曼和无关，单调性与中点法则和梯形法则无关。",
      ),
      generate(rng) {
        const k = rng.int(1, 5);
        const kinds: Shape[] = [
          [`\\sqrt{x + ${k}}`, true, false, (x) => Math.sqrt(x + k)],
          [`\\ln(x + ${k})`, true, false, (x) => Math.log(x + k)],
          [`\\frac{${k}}{x + 1}`, false, true, (x) => k / (x + 1)],
          [`e^{\\frac{x}{${k + 1}}}`, true, true, (x) => Math.exp(x / (k + 1))],
          [`\\sqrt{x^{2} + ${k}}`, true, true, (x) => Math.sqrt(x * x + k)],
          [`e^{-\\frac{x}{${k + 1}}}`, false, true, (x) => Math.exp(-x / (k + 1))],
        ];
        const [f, increasing, up, value] = rng.pick(kinds);
        const a = rng.int(0, 3);
        const b = a + rng.int(2, 6);
        const n = rng.int(3, 8);
        const rule = rng.pick(["left", "right", "midpoint", "trapezoidal"] as const);
        const over = rule === "left" ? !increasing : rule === "right" ? increasing : rule === "trapezoidal" ? up : !up;
        const byShape = rule === "left" || rule === "right";
        const shape = byShape
          ? t(increasing ? "increasing" : "decreasing", increasing ? "递增" : "递减")
          : t(up ? "concave up" : "concave down", up ? "下凸（凹向上）" : "上凸（凹向下）");
        const sign = byShape
          ? t(`$f'(x) ${increasing ? ">" : "<"} 0$`, `$f'(x) ${increasing ? ">" : "<"} 0$`)
          : t(`$f''(x) ${up ? ">" : "<"} 0$`, `$f''(x) ${up ? ">" : "<"} 0$`);
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
        const dx = Q.of(b - a, n);
        const next = Q.of(a).add(dx);
        const mid = Q.of(a + b, 2);
        const chord = (value(a) + value(b)) / 2;
        const check = byShape
          ? t(
              `On the first subinterval, from $${a}$ to $${L(next)}$, $f(${a}) \\approx ${fmt(value(a))}$ and $f\\left(${L(next)}\\right) \\approx ${fmt(value(next.toNumber()))}$, so $f$ ${increasing ? "rises" : "falls"}, and the ${rule} end gives the ${over ? "larger" : "smaller"} height.`,
              `在第一个子区间 $${a}$ 到 $${L(next)}$ 上，$f(${a}) \\approx ${fmt(value(a))}$，$f\\left(${L(next)}\\right) \\approx ${fmt(value(next.toNumber()))}$，所以 $f$ ${increasing ? "上升" : "下降"}，${rule === "left" ? "左" : "右"}端给出的高${over ? "较大" : "较小"}。`,
            )
          : t(
              `At the middle of $[${a}, ${b}]$, the curve has height $f\\left(${L(mid)}\\right) \\approx ${fmt(value(mid.toNumber()))}$, while the chord from $(${a}, ${fmt(value(a))})$ to $(${b}, ${fmt(value(b))})$ has height $\\approx ${fmt(chord)}$. The chord is ${up ? "above" : "below"} the curve, so the graph is ${shape.en}.`,
              `在 $[${a}, ${b}]$ 的中点，曲线高 $f\\left(${L(mid)}\\right) \\approx ${fmt(value(mid.toNumber()))}$，而从 $(${a}, ${fmt(value(a))})$ 到 $(${b}, ${fmt(value(b))})$ 的弦高 $\\approx ${fmt(chord)}$。弦在曲线${up ? "上方" : "下方"}，所以图像${shape["zh-CN"]}。`,
            );
        return reasoned(
          oneOf(
            rng,
            t(
              `The area under $y = ${f}$ on $[${a}, ${b}]$ is approximated by ${ruleWithArticle(rule)} with $${n}$ subintervals. Is the approximation an overestimate or an underestimate of the area?`,
              `用 $${n}$ 个子区间的${ruleName[rule]["zh-CN"]}近似 $y = ${f}$ 在 $[${a}, ${b}]$ 上的图像下方面积。这个近似值是高估还是低估？`,
            ),
            over ? t("An overestimate", "高估") : t("An underestimate", "低估"),
            [over ? t("An underestimate", "低估") : t("An overestimate", "高估"), t("It equals the area exactly", "恰好等于面积")],
            walked(
              [
                [
                  ["Decide what matters", "判断依据"],
                  t(
                    `The ${ruleName[rule].en} depends on whether $f$ is ${byShape ? "increasing or decreasing" : "concave up or down"}.`,
                    `${ruleName[rule]["zh-CN"]}取决于 $f$ 的${byShape ? "单调性" : "凹凸性"}。`,
                  ),
                ],
                [
                  ["Find the shape", "判断形状"],
                  t(
                    `For $y = ${f}$ on $[${a}, ${b}]$, ${sign.en}, so $f$ is ${shape.en}.`,
                    `对 $[${a}, ${b}]$ 上的 $y = ${f}$，${sign["zh-CN"]}，所以 $f$ ${shape["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    `So ${reason.en}: the approximation is ${over ? "an overestimate" : "an underestimate"}.`,
                    `所以${reason["zh-CN"]}：近似值是${over ? "高估" : "低估"}。`,
                  ),
                ],
              ],
              check,
            ),
          ),
          [
            [
              over ? "An underestimate" : "An overestimate",
              `This has the direction reversed: $f$ is ${shape.en} here, so ${reason.en}.`,
              `方向反了：这里 $f$ ${shape["zh-CN"]}，所以${reason["zh-CN"]}。`,
            ],
            [
              "It equals the area exactly",
              byShape
                ? "A left or right sum is exact only for a constant function; this graph rises or falls."
                : "The midpoint and trapezoidal rules are exact only where the graph is a straight line; this graph curves.",
              byShape
                ? "左、右黎曼和只对常数函数才精确；这个图像在上升或下降。"
                : "中点法则和梯形法则只在图像是直线时才精确；这个图像是弯曲的。",
            ],
          ],
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
  intro: t(
    "More rectangles fit a curve better. For $y = x^{2}$ on $[0, 1]$ with $n$ subintervals, the right sum is\n\n$$R_{n} = \\sum_{i = 1}^{n} \\left(\\frac{i}{n}\\right)^{2} \\cdot \\frac{1}{n} = \\frac{(n + 1)(2n + 1)}{6n^{2}},$$\n\nwhich is $0.385$ for $n = 10$ and $0.33835$ for $n = 100$: it settles toward $\\frac{1}{3}$.\n\nCheck: the left sum, $\\frac{(n - 1)(2n - 1)}{6n^{2}}$, is $0.32835$ for $n = 100$, just below $\\frac{1}{3}$, so the two sums close in on $\\frac{1}{3}$ from both sides.\n\nIn this lesson we define the definite integral as the limit of Riemann sums, read an integral off such a limit, and evaluate simple integrals from the definition.",
    "矩形越多，越贴合曲线。对 $[0, 1]$ 上的 $y = x^{2}$ 取 $n$ 个子区间，右和为\n\n$$R_{n} = \\sum_{i = 1}^{n} \\left(\\frac{i}{n}\\right)^{2} \\cdot \\frac{1}{n} = \\frac{(n + 1)(2n + 1)}{6n^{2}}$$\n\n$n = 10$ 时为 $0.385$，$n = 100$ 时为 $0.33835$：它趋于 $\\frac{1}{3}$。\n\n检验：左和 $\\frac{(n - 1)(2n - 1)}{6n^{2}}$ 在 $n = 100$ 时为 $0.32835$，略小于 $\\frac{1}{3}$，所以两个和从两侧逼近 $\\frac{1}{3}$。\n\n本课我们把定积分定义为黎曼和的极限，从这样的极限读出积分，并由定义计算简单的定积分。",
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
        "As $n \\to \\infty$ the Riemann sums of a continuous $f$ approach one number, the **definite integral**:\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} f\\left(a + \\frac{(b - a)i}{n}\\right)\\frac{b - a}{n}.$$\n\nTo read an integral off such a limit, match $\\Delta x = \\frac{b - a}{n}$ and the argument $a + i\\Delta x$: the constant term is $a$, and $b = a + (b - a)$. So $\\lim_{n \\to \\infty} \\sum_{i = 1}^{n} \\left(2 + \\frac{3i}{n}\\right)^{2} \\cdot \\frac{3}{n} = \\int_{2}^{5} x^{2} \\, dx$.\n\nCheck: the first sample point, $2 + \\frac{3}{n}$, tends to $2$, and the last, $i = n$, is $2 + 3 = 5$.\n\n> **Watch out.** The numerator of $\\Delta x$ is the length $b - a$, not the upper limit $b$: add it to $a$ to find $b$.",
        "当 $n \\to \\infty$ 时，连续函数 $f$ 的黎曼和趋于同一个数，即**定积分**：\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} f\\left(a + \\frac{(b - a)i}{n}\\right)\\frac{b - a}{n}$$\n\n要从这样的极限读出积分，对照 $\\Delta x = \\frac{b - a}{n}$ 和自变量 $a + i\\Delta x$：常数项是 $a$，且 $b = a + (b - a)$。所以 $\\lim_{n \\to \\infty} \\sum_{i = 1}^{n} \\left(2 + \\frac{3i}{n}\\right)^{2} \\cdot \\frac{3}{n} = \\int_{2}^{5} x^{2} \\, dx$。\n\n检验：第一个取样点 $2 + \\frac{3}{n}$ 趋于 $2$，最后一个 $i = n$ 是 $2 + 3 = 5$。\n\n> **注意。** $\\Delta x$ 的分子是区间长度 $b - a$，不是上限 $b$：把它加到 $a$ 上才得到 $b$。",
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
            walked(
              [
                [
                  ["Match the width", "对照宽度"],
                  t(
                    `The factor $\\frac{${w}}{n}$ is $\\Delta x = \\frac{b - a}{n}$, so $b - a = ${w}$.`,
                    `因子 $\\frac{${w}}{n}$ 是 $\\Delta x = \\frac{b - a}{n}$，所以 $b - a = ${w}$。`,
                  ),
                ],
                [
                  ["Match the argument", "对照自变量"],
                  t(
                    `The argument $${u}$ is $a + i\\Delta x$ with $a = ${a}$, and the function applied to it is $f(x) = ${f}$.`,
                    `自变量 $${u}$ 即 $a + i\\Delta x$，其中 $a = ${a}$，作用在它上面的函数是 $f(x) = ${f}$。`,
                  ),
                ],
                [
                  ["Write the integral", "写出积分"],
                  t(`$b = ${a} + ${w} = ${b}$, so the limit is $${right}$.`, `$b = ${a} + ${w} = ${b}$，所以极限为 $${right}$。`),
                ],
              ],
              t(
                `The first term, $i = 1$, samples at $${a} + \\frac{${w}}{n}$, which tends to $${a}$; the last, $i = n$, samples at $${a} + ${w} = ${b}$. So the sample points fill $[${a}, ${b}]$.`,
                `第一项 $i = 1$ 的取样点是 $${a} + \\frac{${w}}{n}$，趋于 $${a}$；最后一项 $i = n$ 的取样点是 $${a} + ${w} = ${b}$。所以取样点布满 $[${a}, ${b}]$。`,
              ),
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
        "Write the right sum with the sum formulas for powers of the index, simplify it in terms of the number of pieces, and let that number grow without bound. For polynomials the limit can be computed with\n\n$$\\sum_{i = 1}^{n} 1 = n, \\qquad \\sum_{i = 1}^{n} i = \\frac{n(n + 1)}{2}, \\qquad \\sum_{i = 1}^{n} i^{2} = \\frac{n(n + 1)(2n + 1)}{6}.$$\n\nFor example, $\\int_{0}^{2} 3x \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} 3 \\cdot \\frac{2i}{n} \\cdot \\frac{2}{n} = \\lim_{n \\to \\infty} \\frac{12}{n^{2}} \\cdot \\frac{n(n + 1)}{2} = 6$, and in the same way $\\int_{0}^{b} x^{2} \\, dx = \\lim_{n \\to \\infty} \\frac{b^{3}}{n^{3}} \\cdot \\frac{n(n + 1)(2n + 1)}{6} = \\frac{b^{3}}{3}$.\n\nCheck: the region under $y = 3x$ on $[0, 2]$ is a triangle with base $2$ and height $6$, of area $\\frac{1}{2} \\cdot 2 \\cdot 6 = 6$.\n\n> **Watch out.** $\\Delta x$ multiplies every term, the constant term too: a constant $q$ contributes $\\sum_{i = 1}^{n} q \\cdot \\frac{b}{n} = qb$, not $q$.",
        "用下标幂的求和公式写出右和，把它化简为小段数的式子，再让小段数无限增大。对多项式，可以用下列公式求极限：\n\n$$\\sum_{i = 1}^{n} 1 = n, \\qquad \\sum_{i = 1}^{n} i = \\frac{n(n + 1)}{2}, \\qquad \\sum_{i = 1}^{n} i^{2} = \\frac{n(n + 1)(2n + 1)}{6}$$\n\n例如 $\\int_{0}^{2} 3x \\, dx = \\lim_{n \\to \\infty} \\sum_{i = 1}^{n} 3 \\cdot \\frac{2i}{n} \\cdot \\frac{2}{n} = \\lim_{n \\to \\infty} \\frac{12}{n^{2}} \\cdot \\frac{n(n + 1)}{2} = 6$；同样，$\\int_{0}^{b} x^{2} \\, dx = \\lim_{n \\to \\infty} \\frac{b^{3}}{n^{3}} \\cdot \\frac{n(n + 1)(2n + 1)}{6} = \\frac{b^{3}}{3}$。\n\n检验：$y = 3x$ 在 $[0, 2]$ 上方的区域是底为 $2$、高为 $6$ 的三角形，面积为 $\\frac{1}{2} \\cdot 2 \\cdot 6 = 6$。\n\n> **注意。** $\\Delta x$ 乘以每一项，常数项也不例外：常数 $q$ 贡献 $\\sum_{i = 1}^{n} q \\cdot \\frac{b}{n} = qb$，而不是 $q$。",
      ),
      generate(rng) {
        const b = rng.int(1, 6);
        const p = rng.nonZero(-4, 4);
        const q = rng.nonZero(-5, 5);
        const co = p === 1 ? "" : p === -1 ? "-" : `${p} \\cdot `;
        const square = rng.bool();
        const f = square ? poly([p, "x^{2}"], [q, ""]) : poly([p, "x"], [q, ""]);
        const answer = square ? Q.of(p * b ** 3, 3).add(Q.of(q * b)) : Q.of(p * b * b, 2).add(Q.of(q * b));
        const sum = square
          ? `\\sum_{i = 1}^{n} \\left(${co}\\frac{${b * b}i^{2}}{n^{2}} + ${par(Q.of(q))}\\right)\\frac{${b}}{n}`
          : `\\sum_{i = 1}^{n} \\left(${co}\\frac{${b}i}{n} + ${par(Q.of(q))}\\right)\\frac{${b}}{n}`;
        const split = square
          ? `= ${co}\\frac{${b ** 3}}{n^{3}} \\cdot \\frac{n(n + 1)(2n + 1)}{6} + ${par(Q.of(q))} \\cdot \\frac{${b}}{n} \\cdot n`
          : `= ${co}\\frac{${b * b}}{n^{2}} \\cdot \\frac{n(n + 1)}{2} + ${par(Q.of(q))} \\cdot \\frac{${b}}{n} \\cdot n`;
        const limit = square ? `\\frac{(n + 1)(2n + 1)}{6n^{2}} \\to \\frac{1}{3}` : `\\frac{n(n + 1)}{2n^{2}} \\to \\frac{1}{2}`;
        const lead = square ? `${co}\\frac{${b ** 3}}{3}` : `${co}\\frac{${b * b}}{2}`;
        const hundred = square ? Q.of(p * b ** 3 * 101 * 201, 60000).add(Q.of(q * b)) : Q.of(p * b * b * 101, 200).add(Q.of(q * b));
        const end = p * b + q;
        const check = square
          ? t(
              `With $n = 100$ the right sum is $${p} \\cdot ${b ** 3} \\cdot \\frac{101 \\cdot 201}{6 \\cdot 100^{2}} + ${par(Q.of(q))} \\cdot ${b} \\approx ${fmt(hundred.toNumber())}$, already close to $${L(answer)} \\approx ${fmt(answer.toNumber())}$, and the gap shrinks as $n$ grows.`,
              `取 $n = 100$，右和为 $${p} \\cdot ${b ** 3} \\cdot \\frac{101 \\cdot 201}{6 \\cdot 100^{2}} + ${par(Q.of(q))} \\cdot ${b} \\approx ${fmt(hundred.toNumber())}$，已经接近 $${L(answer)} \\approx ${fmt(answer.toNumber())}$，而且 $n$ 越大差距越小。`,
            )
          : t(
              `The integrand is linear, so its integral is the width times the average of its end values, $f(0) = ${q}$ and $f(${b}) = ${end}$: $${b} \\cdot \\frac{${q} + ${par(Q.of(end))}}{2} = ${L(answer)}$.`,
              `被积函数是一次函数，所以它的积分等于宽度乘以两端函数值 $f(0) = ${q}$ 与 $f(${b}) = ${end}$ 的平均值：$${b} \\cdot \\frac{${q} + ${par(Q.of(end))}}{2} = ${L(answer)}$。`,
            );
        return numberProblem({
          prompt: t(
            `Use the limit of right Riemann sums to evaluate $\\int_{0}^{${b}} (${f}) \\, dx$.`,
            `用右黎曼和的极限计算 $\\int_{0}^{${b}} (${f}) \\, dx$。`,
          ),
          answer,
          mistakes: distinct(
            square
              ? [
                  why(
                    Q.of(p * b ** 3, 2).add(Q.of(q * b)),
                    "This uses $\\frac{1}{2}$, the limit that goes with $\\sum i$; for $\\sum i^{2}$, $\\frac{(n + 1)(2n + 1)}{6n^{2}} \\to \\frac{1}{3}$.",
                    "这里用了 $\\frac{1}{2}$，那是与 $\\sum i$ 对应的极限；对 $\\sum i^{2}$，$\\frac{(n + 1)(2n + 1)}{6n^{2}} \\to \\frac{1}{3}$。",
                  ),
                  why(
                    Q.of(p * b ** 3, 3),
                    `This leaves out the constant term: $${q}$ over an interval of length $${b}$ adds $${q * b}$.`,
                    `这里漏掉了常数项：$${q}$ 在长为 $${b}$ 的区间上贡献 $${q * b}$。`,
                  ),
                  why(
                    Q.of(p * b ** 2, 3).add(Q.of(q * b)),
                    `This uses $b^{2}$ from $x_{i}^{2}$ but leaves out the factor $${b}$ in $\\Delta x = \\frac{${b}}{n}$.`,
                    `这里只用了 $x_{i}^{2}$ 中的 $b^{2}$，漏掉了 $\\Delta x = \\frac{${b}}{n}$ 中的因子 $${b}$。`,
                  ),
                ]
              : [
                  why(
                    Q.of(p * b * b).add(Q.of(q * b)),
                    "This drops the $2$ from $\\sum_{i = 1}^{n} i = \\frac{n(n + 1)}{2}$.",
                    "这里漏掉了 $\\sum_{i = 1}^{n} i = \\frac{n(n + 1)}{2}$ 中的 $2$。",
                  ),
                  why(
                    Q.of(p * b * b, 2),
                    `This leaves out the constant term: $${q}$ over an interval of length $${b}$ adds $${q * b}$.`,
                    `这里漏掉了常数项：$${q}$ 在长为 $${b}$ 的区间上贡献 $${q * b}$。`,
                  ),
                  why(
                    Q.of(p * b * b, 2).add(Q.of(q)),
                    `The constant term contributes $${q}$ times the length $${b}$, since $\\sum_{i = 1}^{n} ${par(Q.of(q))} \\cdot \\frac{${b}}{n} = ${q * b}$, not just $${q}$.`,
                    `常数项贡献 $${q}$ 乘以长度 $${b}$，因为 $\\sum_{i = 1}^{n} ${par(Q.of(q))} \\cdot \\frac{${b}}{n} = ${q * b}$，而不只是 $${q}$。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Write the right sum", "写出右和"],
                t(
                  `With $\\Delta x = \\frac{${b}}{n}$ and $x_{i} = \\frac{${b}i}{n}$, the right sum is:`,
                  `取 $\\Delta x = \\frac{${b}}{n}$，$x_{i} = \\frac{${b}i}{n}$，右和为：`,
                ),
                [sum, split],
              ],
              [
                ["Let n grow", "令 n 无限增大"],
                t(
                  `As $n \\to \\infty$, $${limit}$, and the constant part is $${q * b}$ for every $n$. So the integral is $${lead} + ${par(Q.of(q))} \\cdot ${b} = ${L(answer)}$.`,
                  `当 $n \\to \\infty$ 时，$${limit}$，而常数部分对每个 $n$ 都是 $${q * b}$。所以积分为 $${lead} + ${par(Q.of(q))} \\cdot ${b} = ${L(answer)}$。`,
                ),
              ],
            ],
            check,
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
  intro: t(
    "Limits of Riemann sums are slow to compute, but an antiderivative gives the same number at once. For $\\int_{0}^{2} x^{2} \\, dx$, an antiderivative of $x^{2}$ is $\\frac{x^{3}}{3}$, so\n\n$$\\int_{0}^{2} x^{2} \\, dx = \\frac{2^{3}}{3} - \\frac{0^{3}}{3} = \\frac{8}{3} \\approx 2.667.$$\n\nCheck: the midpoint sum with $4$ subintervals of width $\\frac{1}{2}$ is $\\frac{1}{2}\\left(\\frac{1}{16} + \\frac{9}{16} + \\frac{25}{16} + \\frac{49}{16}\\right) = 2.625$, close to $\\frac{8}{3}$.\n\nIn this lesson we use the fundamental theorem of calculus to evaluate definite integrals of polynomials and of powers of $x$.",
    "黎曼和的极限算起来很慢，而原函数能一下子给出同一个数。对 $\\int_{0}^{2} x^{2} \\, dx$，$x^{2}$ 的一个原函数是 $\\frac{x^{3}}{3}$，所以\n\n$$\\int_{0}^{2} x^{2} \\, dx = \\frac{2^{3}}{3} - \\frac{0^{3}}{3} = \\frac{8}{3} \\approx 2.667$$\n\n检验：取 $4$ 个宽为 $\\frac{1}{2}$ 的子区间，中点和为 $\\frac{1}{2}\\left(\\frac{1}{16} + \\frac{9}{16} + \\frac{25}{16} + \\frac{49}{16}\\right) = 2.625$，与 $\\frac{8}{3}$ 很接近。\n\n本课我们用微积分基本定理计算多项式和 $x$ 的幂的定积分。",
  ),
  prerequisites: ["defining-definite-integrals-using-left-and-right-riemann-sums", "the-sum-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-sum-rule-for-indefinite-integrals", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "definite-integrals-of-polynomials",
      title: t("Definite integrals of polynomials", "多项式的定积分"),
      explanation: t(
        "**The fundamental theorem of calculus:** if $f$ is continuous on $[a, b]$ and $F$ is any antiderivative of $f$, then\n\n$$\\int_{a}^{b} f(x) \\, dx = \\Big[F(x)\\Big]_{a}^{b} = F(b) - F(a).$$\n\nThe constant $C$ cancels, so leave it out. For example, $\\int_{1}^{3} (2x + 1) \\, dx = \\Big[x^{2} + x\\Big]_{1}^{3} = 12 - 2 = 10$.\n\nCheck: the region under $y = 2x + 1$ on $[1, 3]$ is a trapezoid with parallel sides $3$ and $7$ and width $2$, of area $2 \\cdot \\frac{3 + 7}{2} = 10$.\n\n> **Watch out.** Subtract in the order $F(b) - F(a)$, and subtract all of $F(a)$: put it in parentheses when it is negative.",
        "**微积分基本定理：**若 $f$ 在 $[a, b]$ 上连续，$F$ 是 $f$ 的任一原函数，则\n\n$$\\int_{a}^{b} f(x) \\, dx = \\Big[F(x)\\Big]_{a}^{b} = F(b) - F(a)$$\n\n常数 $C$ 会抵消，所以不必写。例如 $\\int_{1}^{3} (2x + 1) \\, dx = \\Big[x^{2} + x\\Big]_{1}^{3} = 12 - 2 = 10$。\n\n检验：$y = 2x + 1$ 在 $[1, 3]$ 上方的区域是两条平行边为 $3$ 和 $7$、宽为 $2$ 的梯形，面积为 $2 \\cdot \\frac{3 + 7}{2} = 10$。\n\n> **注意。** 按 $F(b) - F(a)$ 的顺序相减，并减去整个 $F(a)$：它是负数时要加括号。",
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
        const fAt = (x: number) => p.reduce((s, c, i) => s + c * x ** i, 0);
        const terms = p
          .map((c, i) => [c, i + 1] as const)
          .filter(([c]) => c !== 0)
          .map(([c, k]) => ({ value: Q.of(c * (b ** k - a ** k), k) }));
        return numberProblem({
          prompt: t(`Evaluate $\\int_{${a}}^{${b}} (${pLatex(p)}) \\, dx$.`, `计算 $\\int_{${a}}^{${b}} (${pLatex(p)}) \\, dx$。`),
          answer,
          mistakes: distinct([
            why(
              Fa.sub(Fb),
              "This subtracts in the wrong order: the integral is $F(b) - F(a)$, upper limit first.",
              "这里减的顺序反了：积分是 $F(b) - F(a)$，先上限后下限。",
            ),
            why(
              Fb,
              `This is $F(${b})$ alone; the value $F(${a}) = ${L(Fa)}$ at the lower limit must be subtracted.`,
              `这只是 $F(${b})$；还要减去下限处的值 $F(${a}) = ${L(Fa)}$。`,
            ),
            why(Fb.add(Fa), `This adds $F(${a})$ instead of subtracting it.`, `这里把 $F(${a})$ 加上了，应该减去。`),
            why(
              Q.of(fAt(b) - fAt(a)),
              "This evaluates the integrand $f$ at the limits; the theorem uses an antiderivative $F$.",
              "这是在上下限处求被积函数 $f$ 的值；基本定理用的是原函数 $F$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find an antiderivative", "求原函数"],
                t("Raise each power by one and divide by the new power:", "把每个幂的指数加一，再除以新的指数："),
                [`F(x) = ${F}`],
              ],
              [
                ["Evaluate at the limits", "在上下限处求值"],
                t(`$F(${b}) = ${L(Fb)}$ and $F(${a}) = ${L(Fa)}$.`, `$F(${b}) = ${L(Fb)}$，$F(${a}) = ${L(Fa)}$。`),
              ],
              [
                ["Subtract", "相减"],
                t("Upper limit minus lower limit:", "上限处的值减去下限处的值："),
                [`F(${b}) - F(${a}) = ${L(Fb)} - ${big(Fa)} = ${L(answer)}`],
              ],
            ],
            t(
              `Integrate term by term instead: the term $cx^{k - 1}$ contributes $\\frac{c}{k}\\left(b^{k} - a^{k}\\right)$, giving $${terms
                .map((x) => L(x.value))
                .join(" + ")
                .replaceAll("+ -", "- ")} = ${L(answer)}$.`,
              `改为逐项积分：$cx^{k - 1}$ 这一项贡献 $\\frac{c}{k}\\left(b^{k} - a^{k}\\right)$，得 $${terms
                .map((x) => L(x.value))
                .join(" + ")
                .replaceAll("+ -", "- ")} = ${L(answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "definite-integrals-of-powers",
      title: t("Definite integrals of powers", "幂函数的定积分"),
      explanation: t(
        "Rewrite roots and reciprocals as powers, integrate with the power rule, then substitute the limits. With $\\int_{1}^{4} \\sqrt{x} \\, dx$: $\\Big[\\frac{2}{3}x^{\\frac{3}{2}}\\Big]_{1}^{4} = \\frac{2}{3}(8 - 1) = \\frac{14}{3} \\approx 4.667$.\n\nCheck: $\\sqrt{x}$ rises from $1$ to $2$ on $[1, 4]$, an interval of length $3$, so the integral lies between $3 \\cdot 1 = 3$ and $3 \\cdot 2 = 6$, and $\\frac{14}{3}$ does.\n\n> **Watch out.** Divide by the new exponent: $x^{\\frac{1}{2}}$ becomes $\\frac{x^{\\frac{3}{2}}}{\\frac{3}{2}} = \\frac{2}{3}x^{\\frac{3}{2}}$, and $x^{-2}$ becomes $\\frac{x^{-1}}{-1} = -x^{-1}$.",
        "把根式和倒数写成幂，用幂法则积分，再代入上下限。例如 $\\int_{1}^{4} \\sqrt{x} \\, dx = \\Big[\\frac{2}{3}x^{\\frac{3}{2}}\\Big]_{1}^{4} = \\frac{2}{3}(8 - 1) = \\frac{14}{3} \\approx 4.667$。\n\n检验：$\\sqrt{x}$ 在长为 $3$ 的区间 $[1, 4]$ 上从 $1$ 增到 $2$，所以积分在 $3 \\cdot 1 = 3$ 与 $3 \\cdot 2 = 6$ 之间，$\\frac{14}{3}$ 确实如此。\n\n> **注意。** 要除以新的指数：$x^{\\frac{1}{2}}$ 变为 $\\frac{x^{\\frac{3}{2}}}{\\frac{3}{2}} = \\frac{2}{3}x^{\\frac{3}{2}}$，$x^{-2}$ 变为 $\\frac{x^{-1}}{-1} = -x^{-1}$。",
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
        const f = (x: number) => k * x ** n.toNumber();
        const [lo, hi] = [Math.min(f(a), f(b)), Math.max(f(a), f(b))];
        return numberProblem({
          prompt: t(`Evaluate $\\int_{${a}}^{${b}} ${shown} \\, dx$.`, `计算 $\\int_{${a}}^{${b}} ${shown} \\, dx$。`),
          answer,
          mistakes: distinct([
            why(
              answer.neg(),
              "This has the sign reversed: the integral is $F(b) - F(a)$, upper limit first.",
              "这里符号反了：积分是 $F(b) - F(a)$，先上限后下限。",
            ),
            why(
              Q.of(k).mul(pw(b).sub(pw(a))),
              `This raises the exponent to $${up.toLatex()}$ but does not divide by it.`,
              `这里把指数升到了 $${up.toLatex()}$，却没有除以它。`,
            ),
            why(
              c.mul(pw(b)),
              `This is the antiderivative at $${b}$ alone; its value at $${a}$ must be subtracted.`,
              `这只是原函数在 $${b}$ 处的值；还要减去它在 $${a}$ 处的值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the integrand as a power", "把被积函数写成幂"],
                t(`$${shown} = ${poly([Q.of(k), `x^{${n.toLatex()}}`])}$.`, `$${shown} = ${poly([Q.of(k), `x^{${n.toLatex()}}`])}$。`),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `Raise the exponent to $${up.toLatex()}$ and divide by it: an antiderivative is $${term}$.`,
                  `把指数升到 $${up.toLatex()}$ 并除以它：一个原函数为 $${term}$。`,
                ),
              ],
              [
                ["Substitute the limits", "代入上下限"],
                t(
                  `At $${b}$ and $${a}$, $x^{${up.toLatex()}}$ is $${L(pw(b))}$ and $${L(pw(a))}$:`,
                  `在 $${b}$ 和 $${a}$ 处，$x^{${up.toLatex()}}$ 分别为 $${L(pw(b))}$ 和 $${L(pw(a))}$：`,
                ),
                [`${c.toLatex()}\\left(${L(pw(b))} - ${L(pw(a))}\\right) = ${L(answer)}`],
              ],
            ],
            t(
              `The integrand is monotone on $[${a}, ${b}]$, with end values $\\approx ${fmt(f(a))}$ and $\\approx ${fmt(f(b))}$, so the integral lies between $${b - a} \\cdot ${fmt(lo)} \\approx ${fmt((b - a) * lo)}$ and $${b - a} \\cdot ${fmt(hi)} \\approx ${fmt((b - a) * hi)}$; indeed $${L(answer)} \\approx ${fmt(answer.toNumber())}$.`,
              `被积函数在 $[${a}, ${b}]$ 上单调，两端的值约为 $${fmt(f(a))}$ 和 $${fmt(f(b))}$，所以积分在 $${b - a} \\cdot ${fmt(lo)} \\approx ${fmt((b - a) * lo)}$ 与 $${b - a} \\cdot ${fmt(hi)} \\approx ${fmt((b - a) * hi)}$ 之间；确实 $${L(answer)} \\approx ${fmt(answer.toNumber())}$。`,
            ),
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
  intro: t(
    "The fundamental theorem works with any antiderivative, not just those of polynomials. The area under one arch of $y = \\sin x$ is\n\n$$\\int_{0}^{\\pi} \\sin x \\, dx = \\Big[-\\cos x\\Big]_{0}^{\\pi} = -(-1) - (-1) = 2.$$\n\nCheck: the midpoint sum with $2$ subintervals is $\\frac{\\pi}{2}\\left(\\sin\\frac{\\pi}{4} + \\sin\\frac{3\\pi}{4}\\right) = \\frac{\\pi}{2} \\cdot \\sqrt{2} \\approx 2.221$, close to $2$.\n\nIn this lesson we evaluate definite integrals of exponential, reciprocal and trigonometric functions exactly, using $e^{0} = 1$, $\\ln 1 = 0$ and the values of sine, cosine and tangent at special angles.",
    "基本定理对任何原函数都成立，不只是多项式的原函数。$y = \\sin x$ 一个拱下方的面积为\n\n$$\\int_{0}^{\\pi} \\sin x \\, dx = \\Big[-\\cos x\\Big]_{0}^{\\pi} = -(-1) - (-1) = 2$$\n\n检验：取 $2$ 个子区间，中点和为 $\\frac{\\pi}{2}\\left(\\sin\\frac{\\pi}{4} + \\sin\\frac{3\\pi}{4}\\right) = \\frac{\\pi}{2} \\cdot \\sqrt{2} \\approx 2.221$，与 $2$ 很接近。\n\n本课我们利用 $e^{0} = 1$、$\\ln 1 = 0$ 以及特殊角的正弦、余弦、正切值，精确计算指数函数、倒数函数和三角函数的定积分。",
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
        "Find the antiderivative, evaluate it at both limits and subtract, using the facts that $e^{0} = 1$ and $\\ln 1 = 0$. Give exact answers: $\\int_{0}^{2} e^{x} \\, dx = e^{2} - e^{0} = e^{2} - 1$ and $\\int_{1}^{5} \\frac{1}{x} \\, dx = \\ln 5 - \\ln 1 = \\ln 5$.\n\nCheck: on $[0, 2]$, $e^{x}$ lies between $1$ and $e^{2}$, so the first integral lies between $2$ and $2e^{2} \\approx 14.78$; indeed $e^{2} - 1 \\approx 6.389$.\n\n> **Watch out.** $e^{0} = 1$, not $0$, so the lower limit of an exponential integral still counts; it is $\\ln 1$ that is $0$.",
        "求出原函数，在上下限处分别求值再相减，并利用 $e^{0} = 1$、$\\ln 1 = 0$ 这两个事实。给出精确答案：$\\int_{0}^{2} e^{x} \\, dx = e^{2} - e^{0} = e^{2} - 1$，$\\int_{1}^{5} \\frac{1}{x} \\, dx = \\ln 5 - \\ln 1 = \\ln 5$。\n\n检验：在 $[0, 2]$ 上 $e^{x}$ 介于 $1$ 与 $e^{2}$ 之间，所以第一个积分在 $2$ 与 $2e^{2} \\approx 14.78$ 之间；确实 $e^{2} - 1 \\approx 6.389$。\n\n> **注意。** $e^{0} = 1$ 而不是 $0$，所以指数函数积分的下限仍要算进去；等于 $0$ 的是 $\\ln 1$。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const b = rng.int(2, 9);
        const kk = k === 1 ? "" : String(k);
        if (rng.bool()) {
          const e = rng.int(1, 4);
          const answer = poly([k, `e^{${e}}`], [-k, ""]);
          const value = k * (Math.exp(e) - 1);
          return functionWith(
            {
              prompt: t(
                `Evaluate $\\int_{0}^{${e}} ${kk}e^{x} \\, dx$. Give an exact answer.`,
                `计算 $\\int_{0}^{${e}} ${kk}e^{x} \\, dx$，给出精确值。`,
              ),
              answer,
              solution: walked(
                [
                  [
                    ["Find an antiderivative", "求原函数"],
                    t(
                      `$e^{x}$ is its own antiderivative, so $F(x) = ${kk}e^{x}$.`,
                      `$e^{x}$ 的原函数就是它自己，所以 $F(x) = ${kk}e^{x}$。`,
                    ),
                  ],
                  [
                    ["Evaluate at the limits", "在上下限处求值"],
                    t(
                      `$F(${e}) = ${kk}e^{${e}}$ and $F(0) = ${kk}e^{0} = ${k}$.`,
                      `$F(${e}) = ${kk}e^{${e}}$，$F(0) = ${kk}e^{0} = ${k}$。`,
                    ),
                  ],
                  [["Subtract", "相减"], t("Upper limit minus lower limit:", "上限处的值减去下限处的值："), [`F(${e}) - F(0) = ${answer}`]],
                ],
                t(
                  `On $[0, ${e}]$ the integrand lies between $${k}$ and $${kk}e^{${e}}$, so the integral lies between $${e} \\cdot ${k} = ${e * k}$ and $${e} \\cdot ${kk}e^{${e}} \\approx ${fmt(e * k * Math.exp(e))}$; indeed $${answer} \\approx ${fmt(value)}$.`,
                  `在 $[0, ${e}]$ 上被积函数介于 $${k}$ 与 $${kk}e^{${e}}$ 之间，所以积分在 $${e} \\cdot ${k} = ${e * k}$ 与 $${e} \\cdot ${kk}e^{${e}} \\approx ${fmt(e * k * Math.exp(e))}$ 之间；确实 $${answer} \\approx ${fmt(value)}$。`,
                ),
              ),
            },
            [
              say(
                `${kk}e^{${e}}`,
                `This leaves out the value at the lower limit: $F(0) = ${kk}e^{0} = ${k}$, not $0$.`,
                `这里漏掉了下限处的值：$F(0) = ${kk}e^{0} = ${k}$，不是 $0$。`,
              ),
              say(
                poly([k, `e^{${e}}`], [k, ""]),
                `This adds $F(0) = ${k}$ instead of subtracting it.`,
                `这里把 $F(0) = ${k}$ 加上了，应该减去。`,
              ),
              say(
                poly([k, `e^{${e - 1}}`]),
                "This lowers the exponent as the power rule would; but $e^{x}$ is not a power of $x$, and its antiderivative is $e^{x}$ itself.",
                "这里像幂法则那样降低了指数；但 $e^{x}$ 不是 $x$ 的幂，它的原函数就是 $e^{x}$ 本身。",
              ),
            ],
          );
        }
        const answer = `${kk}\\ln ${b}`;
        return functionWith(
          {
            prompt: t(
              `Evaluate $\\int_{1}^{${b}} \\frac{${k}}{x} \\, dx$. Give an exact answer.`,
              `计算 $\\int_{1}^{${b}} \\frac{${k}}{x} \\, dx$，给出精确值。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Find an antiderivative", "求原函数"],
                  t(
                    `An antiderivative of $\\frac{1}{x}$ is $\\ln|x|$, so $F(x) = ${kk}\\ln|x|$.`,
                    `$\\frac{1}{x}$ 的一个原函数是 $\\ln|x|$，所以 $F(x) = ${kk}\\ln|x|$。`,
                  ),
                ],
                [
                  ["Evaluate at the limits", "在上下限处求值"],
                  t(`$F(${b}) = ${kk}\\ln ${b}$ and $F(1) = ${kk}\\ln 1 = 0$.`, `$F(${b}) = ${kk}\\ln ${b}$，$F(1) = ${kk}\\ln 1 = 0$。`),
                ],
                [["Subtract", "相减"], t("Upper limit minus lower limit:", "上限处的值减去下限处的值："), [`F(${b}) - F(1) = ${answer}`]],
              ],
              t(
                `On $[1, ${b}]$ the integrand falls from $${k}$ to $\\frac{${k}}{${b}}$, so the integral lies between $${b - 1} \\cdot \\frac{${k}}{${b}} \\approx ${fmt(((b - 1) * k) / b)}$ and $${b - 1} \\cdot ${k} = ${(b - 1) * k}$; indeed $${answer} \\approx ${fmt(k * Math.log(b))}$.`,
                `在 $[1, ${b}]$ 上被积函数从 $${k}$ 降到 $\\frac{${k}}{${b}}$，所以积分在 $${b - 1} \\cdot \\frac{${k}}{${b}} \\approx ${fmt(((b - 1) * k) / b)}$ 与 $${b - 1} \\cdot ${k} = ${(b - 1) * k}$ 之间；确实 $${answer} \\approx ${fmt(k * Math.log(b))}$。`,
              ),
            ),
          },
          [
            ...(k === 1
              ? []
              : [
                  say(`\\ln ${b}`, `This leaves out the constant factor $${k}$.`, `这里漏掉了常数因子 $${k}$。`),
                  say(
                    `\\ln ${k * b}`,
                    `This puts $${k}$ inside the logarithm as a factor; $${k}\\ln ${b} = \\ln ${b}^{${k}}$, not $\\ln(${k} \\cdot ${b})$.`,
                    `这里把 $${k}$ 当作因子放进了对数；$${k}\\ln ${b} = \\ln ${b}^{${k}}$，不是 $\\ln(${k} \\cdot ${b})$。`,
                  ),
                ]),
            say(
              `${kk}\\ln ${b - 1}`,
              `This subtracts inside the logarithm; $\\ln ${b} - \\ln 1 = \\ln ${b} - 0$, not $\\ln(${b} - 1)$.`,
              `这里在对数里面做了减法；$\\ln ${b} - \\ln 1 = \\ln ${b} - 0$，不是 $\\ln(${b} - 1)$。`,
            ),
            say(
              `\\frac{${k}}{${b}} - ${k}`,
              "This evaluates the integrand at the limits; the theorem uses an antiderivative, here $\\ln|x|$.",
              "这是在上下限处求被积函数的值；基本定理用的是原函数，这里是 $\\ln|x|$。",
            ),
          ],
        );
      },
    },
    {
      id: "trigonometric-integrals",
      figure:
        calculusDrawings3[
          "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions#trigonometric-integrals"
        ],
      title: t("Trigonometric integrals", "三角函数的积分"),
      explanation: t(
        "After finding the antiderivative, the exact values of sine and cosine at the special angles give an exact answer instead of a decimal. Integrate, then use exact values at special angles: $\\int_{0}^{\\frac{\\pi}{3}} \\sin x \\, dx = \\Big[-\\cos x\\Big]_{0}^{\\frac{\\pi}{3}} = -\\frac{1}{2} - (-1) = \\frac{1}{2}$.\n\nCheck: on $\\left[0, \\frac{\\pi}{3}\\right]$, $\\sin x$ rises from $0$ to $\\frac{\\sqrt{3}}{2}$, so the integral lies between $0$ and $\\frac{\\pi}{3} \\cdot \\frac{\\sqrt{3}}{2} \\approx 0.907$, and $\\frac{1}{2}$ does.\n\n> **Watch out.** Mind the minus sign in $\\int \\sin x \\, dx = -\\cos x + C$, and remember that $\\cos 0 = 1$, so the lower limit does not vanish.",
        "求出原函数后，利用特殊角的正弦和余弦精确值，就能得到精确答案而不是小数。先积分，再用特殊角的精确值：$\\int_{0}^{\\frac{\\pi}{3}} \\sin x \\, dx = \\Big[-\\cos x\\Big]_{0}^{\\frac{\\pi}{3}} = -\\frac{1}{2} - (-1) = \\frac{1}{2}$。\n\n检验：在 $\\left[0, \\frac{\\pi}{3}\\right]$ 上 $\\sin x$ 从 $0$ 增到 $\\frac{\\sqrt{3}}{2}$，所以积分在 $0$ 与 $\\frac{\\pi}{3} \\cdot \\frac{\\sqrt{3}}{2} \\approx 0.907$ 之间，$\\frac{1}{2}$ 确实如此。\n\n> **注意。** 留意 $\\int \\sin x \\, dx = -\\cos x + C$ 中的负号，并记住 $\\cos 0 = 1$，所以下限处的值不为零。",
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
        const ex = (e: Exact, c: number) => exactLatex(exactMul(e, Q.of(c)));
        const [answer, F, Fs, F0, exact] =
          kind === "cos"
            ? [ex(s.sin, k), `${kk}\\sin x`, ex(s.sin, k), "0", k * exactNumber(s.sin)]
            : kind === "sin"
              ? [oneMinus(k, s.cos), `-${kk}\\cos x`, ex(s.cos, -k), String(-k), k - k * exactNumber(s.cos)]
              : [ex(tan, k), `${kk}\\tan x`, ex(tan, k), "0", k * exactNumber(tan)];
        const mistakes =
          kind === "cos"
            ? [
                say(
                  ex(s.cos, k),
                  "This evaluates $\\cos x$ itself at the limit; its antiderivative is $\\sin x$.",
                  "这是在上限处求 $\\cos x$ 本身的值；它的原函数是 $\\sin x$。",
                ),
                say(
                  ex(s.sin, -k),
                  "This puts a minus sign on $\\sin x$; the derivative of $\\sin x$ is $\\cos x$, so no minus sign is needed.",
                  "这里给 $\\sin x$ 加了负号；$\\sin x$ 的导数就是 $\\cos x$，不需要负号。",
                ),
              ]
            : kind === "sin"
              ? [
                  say(
                    ex(s.cos, -k),
                    `This is $F\\left(${s.latex}\\right)$ alone; the value $F(0) = -${kk}\\cos 0 = ${-k}$ must be subtracted.`,
                    `这只是 $F\\left(${s.latex}\\right)$；还要减去 $F(0) = -${kk}\\cos 0 = ${-k}$。`,
                  ),
                  say(
                    ex(s.cos, k),
                    "This drops the minus sign of $-\\cos x$ and leaves out the value at $0$.",
                    "这里丢掉了 $-\\cos x$ 的负号，还漏掉了 $0$ 处的值。",
                  ),
                  say(
                    oneMinus(k, s.sin),
                    "This uses $\\sin$ where $\\cos$ belongs: an antiderivative of $\\sin x$ is $-\\cos x$.",
                    "这里该用 $\\cos$ 的地方用了 $\\sin$：$\\sin x$ 的一个原函数是 $-\\cos x$。",
                  ),
                ]
              : [
                  say(
                    ex(s.sin, k),
                    "An antiderivative of $\\sec^{2} x$ is $\\tan x$, not $\\sin x$.",
                    "$\\sec^{2} x$ 的一个原函数是 $\\tan x$，不是 $\\sin x$。",
                  ),
                  say(
                    ex(tan, -k),
                    "The derivative of $\\tan x$ is $\\sec^{2} x$ with no minus sign, so the integral is positive.",
                    "$\\tan x$ 的导数就是 $\\sec^{2} x$，没有负号，所以积分为正。",
                  ),
                ];
        const f = kind === "sec" ? "\\sec^{2} x" : `\\${kind} x`;
        const g = (x: number) => k * (kind === "sin" ? Math.sin(x) : kind === "cos" ? Math.cos(x) : 1 / Math.cos(x) ** 2);
        const M4 = (s.value / 4) * [1, 3, 5, 7].reduce((sum, j) => sum + g((j * s.value) / 8), 0);
        return functionWith(
          {
            prompt: t(
              `Evaluate $\\int_{0}^{${s.latex}} ${kk}${f} \\, dx$. Give an exact answer.`,
              `计算 $\\int_{0}^{${s.latex}} ${kk}${f} \\, dx$，给出精确值。`,
            ),
            answer,
            solution: walked(
              [
                [
                  ["Find an antiderivative", "求原函数"],
                  t(`An antiderivative of $${kk}${f}$ is $F(x) = ${F}$.`, `$${kk}${f}$ 的一个原函数为 $F(x) = ${F}$。`),
                ],
                [
                  ["Evaluate at the limits", "在上下限处求值"],
                  t(`$F\\left(${s.latex}\\right) = ${Fs}$ and $F(0) = ${F0}$.`, `$F\\left(${s.latex}\\right) = ${Fs}$，$F(0) = ${F0}$。`),
                ],
                [
                  ["Subtract", "相减"],
                  t("Upper limit minus lower limit:", "上限处的值减去下限处的值："),
                  [`\\Big[${F}\\Big]_{0}^{${s.latex}} = ${answer}`],
                ],
              ],
              t(
                `The midpoint sum with $4$ subintervals of $\\left[0, ${s.latex}\\right]$ is $\\approx ${fmt(M4)}$, close to the exact value $${answer} \\approx ${fmt(exact)}$.`,
                `把 $\\left[0, ${s.latex}\\right]$ 分成 $4$ 个子区间，中点和 $\\approx ${fmt(M4)}$，与精确值 $${answer} \\approx ${fmt(exact)}$ 很接近。`,
              ),
            ),
          },
          mistakes,
        );
      },
    },
  ],
};

/** theSumAndConstantMultipleRulesForDefiniteIntegrals combines known definite integrals linearly. */
export const theSumAndConstantMultipleRulesForDefiniteIntegrals: TopicDef = {
  id: "the-sum-and-constant-multiple-rules-for-definite-integrals",
  title: t("The Sum and Constant Multiple Rules for Definite Integrals", "定积分的和法则与常数倍法则"),
  summary: t("Combine known definite integrals using linearity.", "利用线性性组合已知的定积分。"),
  intro: t(
    "Knowing two integrals is enough to find many more without integrating. If $\\int_{0}^{2} f(x) \\, dx = 3$ and $\\int_{0}^{2} g(x) \\, dx = 2$, then\n\n$$\\int_{0}^{2} \\left[3f(x) + 2g(x)\\right] dx = 3 \\cdot 3 + 2 \\cdot 2 = 13.$$\n\nCheck: the constant functions $f(x) = \\frac{3}{2}$ and $g(x) = 1$ have these integrals on $[0, 2]$, and for them $3f + 2g = \\frac{13}{2}$, whose integral over a length of $2$ is $13$.\n\nIn this lesson we use the sum and constant multiple rules to combine known definite integrals, including integrals with a constant term.",
    "知道两个积分，不必积分就能求出更多积分。若 $\\int_{0}^{2} f(x) \\, dx = 3$，$\\int_{0}^{2} g(x) \\, dx = 2$，则\n\n$$\\int_{0}^{2} \\left[3f(x) + 2g(x)\\right] dx = 3 \\cdot 3 + 2 \\cdot 2 = 13$$\n\n检验：常数函数 $f(x) = \\frac{3}{2}$ 和 $g(x) = 1$ 在 $[0, 2]$ 上的积分正是这两个值，对它们 $3f + 2g = \\frac{13}{2}$，在长为 $2$ 的区间上积分为 $13$。\n\n本课我们用和法则与常数倍法则组合已知的定积分，包括含常数项的积分。",
  ),
  prerequisites: ["the-fundamental-theorem-of-calculus"],
  encompasses: [],
  xp: 8,
  standards: [],
  knowledgePoints: [
    {
      id: "combining-known-integrals",
      title: t("Combining known integrals", "组合已知的积分"),
      explanation: t(
        "Definite integrals are linear, so when the integrals of the separate functions are known, any combination of them can be found without integrating again. Definite integrals split over sums and constant multiples:\n\n$$\\int_{a}^{b} \\left[pf(x) + qg(x)\\right] dx = p\\int_{a}^{b} f(x) \\, dx + q\\int_{a}^{b} g(x) \\, dx.$$\n\nFor example, if $\\int_{0}^{1} f(x) \\, dx = 4$ and $\\int_{0}^{1} g(x) \\, dx = -1$, then $\\int_{0}^{1} \\left[2f(x) - 3g(x)\\right] dx = 2 \\cdot 4 - 3 \\cdot (-1) = 11$.\n\nCheck: the constants $f(x) = 4$ and $g(x) = -1$ have these integrals on $[0, 1]$, and $2 \\cdot 4 - 3 \\cdot (-1) = 11$ over a length of $1$.\n\n> **Watch out.** The rules cover sums and constant multiples only: the integral of a product $f(x)g(x)$ is not the product of the integrals.",
        "定积分是线性的，所以当各个函数的积分已知时，不必重新积分就能求出它们的任意组合。定积分对和与常数倍可以拆开：\n\n$$\\int_{a}^{b} \\left[pf(x) + qg(x)\\right] dx = p\\int_{a}^{b} f(x) \\, dx + q\\int_{a}^{b} g(x) \\, dx$$\n\n例如，若 $\\int_{0}^{1} f(x) \\, dx = 4$，$\\int_{0}^{1} g(x) \\, dx = -1$，则 $\\int_{0}^{1} \\left[2f(x) - 3g(x)\\right] dx = 2 \\cdot 4 - 3 \\cdot (-1) = 11$。\n\n检验：常数 $f(x) = 4$ 和 $g(x) = -1$ 在 $[0, 1]$ 上的积分正是这两个值，在长为 $1$ 的区间上 $2 \\cdot 4 - 3 \\cdot (-1) = 11$。\n\n> **注意。** 这些法则只适用于和与常数倍：乘积 $f(x)g(x)$ 的积分不等于积分的乘积。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const b = a + rng.int(1, 6);
        const [F, G] = [rng.nonZero(-12, 12), rng.nonZero(-12, 12)];
        const [p, q] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const answer = p * F + q * G;
        const body = poly([p, "f(x)"], [q, "g(x)"]);
        const len = b - a;
        const [f0, g0] = [Q.of(F, len), Q.of(G, len)];
        const per = Q.of(p).mul(f0).add(Q.of(q).mul(g0));
        return numberProblem({
          prompt: t(
            `Given $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$ and $\\int_{${a}}^{${b}} g(x) \\, dx = ${G}$, find $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$.`,
            `已知 $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，$\\int_{${a}}^{${b}} g(x) \\, dx = ${G}$，求 $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$。`,
          ),
          answer,
          mistakes: distinct([
            why(
              F + G,
              `This adds the two integrals but leaves out the multipliers $${p}$ and $${q}$.`,
              `这里把两个积分相加，却漏掉了系数 $${p}$ 和 $${q}$。`,
            ),
            why(
              p * F - q * G,
              `This subtracts $${q}$ times the second integral instead of adding it.`,
              `这里减去了第二个积分的 $${q}$ 倍，应该加上。`,
            ),
            why(
              p * F + G,
              `This multiplies only the first integral; the second needs its multiplier $${q}$ too.`,
              `这里只给第一个积分乘了系数；第二个积分也要乘以 $${q}$。`,
            ),
            why(
              (p + q) * (F + G),
              "This multiplies the sum of the multipliers by the sum of the integrals; each multiplier goes with its own integral.",
              "这里用系数之和乘以积分之和；每个系数只乘它自己的积分。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Split the integral", "拆开积分"],
                t("By the sum and constant multiple rules:", "由和法则与常数倍法则："),
                [
                  `\\int_{${a}}^{${b}} \\left[${body}\\right] dx = ${p}\\int_{${a}}^{${b}} f(x) \\, dx + ${par(Q.of(q))}\\int_{${a}}^{${b}} g(x) \\, dx`,
                ],
              ],
              [
                ["Substitute the known integrals", "代入已知积分"],
                t("Put in the given values:", "代入已知值："),
                [`= ${p} \\cdot ${par(Q.of(F))} + ${par(Q.of(q))} \\cdot ${par(Q.of(G))} = ${answer}`],
              ],
            ],
            t(
              `Try constant functions with the given integrals over the length $${len}$: $f(x) = ${L(f0)}$ and $g(x) = ${L(g0)}$. Then $${body} = ${L(per)}$, and $${big(per)} \\cdot ${len} = ${answer}$.`,
              `取在长为 $${len}$ 的区间上积分为已知值的常数函数：$f(x) = ${L(f0)}$，$g(x) = ${L(g0)}$。则 $${body} = ${L(per)}$，而 $${big(per)} \\cdot ${len} = ${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "integrals-with-a-constant-term",
      figure: calculusDrawings3["the-sum-and-constant-multiple-rules-for-definite-integrals#integrals-with-a-constant-term"],
      title: t("Integrals with a constant term", "含常数项的积分"),
      explanation: t(
        "A constant function gives a rectangle under its graph, whose area is the constant times the width of the interval. A constant integrates to the constant times the length of the interval: $\\int_{a}^{b} c \\, dx = c(b - a)$. So if $\\int_{1}^{4} f(x) \\, dx = 7$, then $\\int_{1}^{4} \\left[2f(x) + 5\\right] dx = 2 \\cdot 7 + 5 \\cdot 3 = 29$.\n\nCheck: the constant $f(x) = \\frac{7}{3}$ has integral $7$ on $[1, 4]$, and $\\left(2 \\cdot \\frac{7}{3} + 5\\right) \\cdot 3 = 14 + 15 = 29$.\n\n> **Watch out.** The constant is multiplied by the length $b - a$, not by $b$, and it is not multiplied by the coefficient of $f$.",
        "常数函数的图像下方是一个矩形，它的面积等于这个常数乘以区间的宽度。常数的积分等于常数乘以区间长度：$\\int_{a}^{b} c \\, dx = c(b - a)$。所以若 $\\int_{1}^{4} f(x) \\, dx = 7$，则 $\\int_{1}^{4} \\left[2f(x) + 5\\right] dx = 2 \\cdot 7 + 5 \\cdot 3 = 29$。\n\n检验：常数 $f(x) = \\frac{7}{3}$ 在 $[1, 4]$ 上的积分为 $7$，而 $\\left(2 \\cdot \\frac{7}{3} + 5\\right) \\cdot 3 = 14 + 15 = 29$。\n\n> **注意。** 常数乘的是区间长度 $b - a$，不是 $b$；它也不乘 $f$ 的系数。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const b = a + rng.int(2, 7);
        const F = rng.nonZero(-15, 15);
        const p = rng.nonZero(-5, 5);
        const c = rng.nonZero(-9, 9);
        const len = b - a;
        const answer = p * F + c * len;
        const body = poly([p, "f(x)"], [c, ""]);
        const f0 = Q.of(F, len);
        const per = Q.of(p).mul(f0).add(Q.of(c));
        return numberProblem({
          prompt: t(
            `Given $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$, find $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$.`,
            `已知 $\\int_{${a}}^{${b}} f(x) \\, dx = ${F}$，求 $\\int_{${a}}^{${b}} \\left[${body}\\right] dx$。`,
          ),
          answer,
          mistakes: distinct([
            why(
              p * F + c,
              `This adds the constant $${c}$ itself; its integral is $${c}$ times the length $${len}$.`,
              `这里直接加上了常数 $${c}$；它的积分是 $${c}$ 乘以长度 $${len}$。`,
            ),
            why(
              p * F,
              `This leaves out the constant term, which contributes $${par(Q.of(c))} \\cdot ${len} = ${c * len}$.`,
              `这里漏掉了常数项，它贡献 $${par(Q.of(c))} \\cdot ${len} = ${c * len}$。`,
            ),
            why(
              p * (F + c * len),
              `This multiplies the constant term by $${p}$ too; only $f$ carries that coefficient.`,
              `这里把常数项也乘了 $${p}$；只有 $f$ 带这个系数。`,
            ),
            why(
              p * F + c * b,
              `This multiplies the constant by the upper limit $${b}$ instead of the length $${b} - ${par(Q.of(a))} = ${len}$.`,
              `这里常数乘的是上限 $${b}$，而不是长度 $${b} - ${par(Q.of(a))} = ${len}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Integrate the constant", "求常数的积分"],
                t("A constant integrates to itself times the length:", "常数的积分等于它乘以区间长度："),
                [`\\int_{${a}}^{${b}} ${par(Q.of(c))} \\, dx = ${par(Q.of(c))} \\cdot \\left(${b} - ${par(Q.of(a))}\\right) = ${c * len}`],
              ],
              [
                ["Combine", "组合"],
                t("By the sum and constant multiple rules:", "由和法则与常数倍法则："),
                [`${p} \\cdot ${par(Q.of(F))} + ${par(Q.of(c * len))} = ${answer}`],
              ],
            ],
            t(
              `Try the constant $f(x) = ${L(f0)}$, whose integral over the length $${len}$ is $${F}$. Then $${body} = ${L(per)}$, and $${big(per)} \\cdot ${len} = ${answer}$.`,
              `取常数 $f(x) = ${L(f0)}$，它在长为 $${len}$ 的区间上积分为 $${F}$。则 $${body} = ${L(per)}$，而 $${big(per)} \\cdot ${len} = ${answer}$。`,
            ),
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
  intro: t(
    "The limits of an integral can be swapped, joined and split. With $f(x) = x$:\n\n$$\\int_{0}^{3} x \\, dx = \\frac{9}{2}, \\qquad \\int_{3}^{0} x \\, dx = -\\frac{9}{2}, \\qquad \\int_{0}^{5} x \\, dx = \\frac{25}{2}.$$\n\nCheck: $\\int_{0}^{5} x \\, dx$ splits at $3$ into $\\frac{9}{2}$ and the trapezoid over $[3, 5]$ with sides $3$ and $5$, of area $2 \\cdot \\frac{3 + 5}{2} = 8$; and $\\frac{9}{2} + 8 = \\frac{25}{2}$.\n\nIn this lesson we reverse the limits of integration, integrate over a single point, and split an interval into pieces.",
    "积分的上下限可以交换、合并和拆分。取 $f(x) = x$：\n\n$$\\int_{0}^{3} x \\, dx = \\frac{9}{2}, \\qquad \\int_{3}^{0} x \\, dx = -\\frac{9}{2}, \\qquad \\int_{0}^{5} x \\, dx = \\frac{25}{2}$$\n\n检验：$\\int_{0}^{5} x \\, dx$ 在 $3$ 处拆成 $\\frac{9}{2}$ 和 $[3, 5]$ 上两边为 $3$、$5$ 的梯形，梯形面积为 $2 \\cdot \\frac{3 + 5}{2} = 8$；而 $\\frac{9}{2} + 8 = \\frac{25}{2}$。\n\n本课我们交换积分上下限、在单点上积分，并把区间拆成几段。",
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
        "Integrating from right to left counts every piece of area with the opposite sign, so swapping the limits flips the sign of the integral. Swapping the limits changes the sign, and an interval of length zero gives zero:\n\n$$\\int_{b}^{a} f(x) \\, dx = -\\int_{a}^{b} f(x) \\, dx, \\qquad \\int_{a}^{a} f(x) \\, dx = 0.$$\n\nFor example, if $\\int_{1}^{4} f(x) \\, dx = 6$, then $\\int_{4}^{1} 2f(x) \\, dx = -2 \\cdot 6 = -12$.\n\nCheck: going from $1$ to $4$ and back covers no interval at all, so $\\int_{1}^{4} 2f(x) \\, dx + \\int_{4}^{1} 2f(x) \\, dx = \\int_{1}^{1} 2f(x) \\, dx = 0$, and indeed $12 + (-12) = 0$.\n\n> **Watch out.** Swapping the limits changes only the sign; a constant multiple stays. And $\\int_{c}^{c}$ is $0$ whatever the function is.",
        "从右往左积分时每一块面积都取相反的符号，所以交换上下限会改变积分的符号。交换上下限会改变符号，长度为零的区间给出零：\n\n$$\\int_{b}^{a} f(x) \\, dx = -\\int_{a}^{b} f(x) \\, dx, \\qquad \\int_{a}^{a} f(x) \\, dx = 0$$\n\n例如，若 $\\int_{1}^{4} f(x) \\, dx = 6$，则 $\\int_{4}^{1} 2f(x) \\, dx = -2 \\cdot 6 = -12$。\n\n检验：从 $1$ 到 $4$ 再回到 $1$ 不覆盖任何区间，所以 $\\int_{1}^{4} 2f(x) \\, dx + \\int_{4}^{1} 2f(x) \\, dx = \\int_{1}^{1} 2f(x) \\, dx = 0$，确实 $12 + (-12) = 0$。\n\n> **注意。** 交换上下限只改变符号，常数倍保持不变。$\\int_{c}^{c}$ 无论函数是什么都等于 $0$。",
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
        const int = (lo: number, hi: number) => `\\int_{${lo}}^{${hi}} ${body} \\, dx`;
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
          mistakes: distinct(
            point
              ? [
                  why(
                    p * F,
                    `This uses the given integral, but here both limits are $${c}$: the interval has length $0$.`,
                    `这里用了已知积分，但本题上下限都是 $${c}$：区间长度为 $0$。`,
                  ),
                  why(
                    F,
                    `The given integral is over $[${a}, ${b}]$; this one is over the single point $${c}$, so it is $0$.`,
                    `已知积分在 $[${a}, ${b}]$ 上；本题只在单点 $${c}$ 上，所以为 $0$。`,
                  ),
                  why(
                    p * c,
                    "This multiplies the coefficient by the limit; an integral over a single point is $0$.",
                    "这里用系数乘以积分限；在单点上的积分为 $0$。",
                  ),
                ]
              : [
                  why(
                    p * F,
                    "This keeps the sign; swapping the limits changes the sign of the integral.",
                    "这里没有改变符号；交换上下限会改变积分的符号。",
                  ),
                  why(-F, `This changes the sign but leaves out the factor $${p}$.`, `这里改变了符号，却漏掉了因子 $${p}$。`),
                  why(
                    F,
                    `This copies the given integral; the factor $${p}$ and the reversed limits both change it.`,
                    `这里照抄了已知积分；因子 $${p}$ 和交换的上下限都会改变它。`,
                  ),
                ],
          ),
          solution: point
            ? walked(
                [
                  [
                    ["Compare the limits", "比较上下限"],
                    t(
                      `The lower and upper limits are both $${c}$, so the interval has length $0$.`,
                      `上下限都是 $${c}$，所以区间长度为 $0$。`,
                    ),
                  ],
                  [
                    ["Conclude", "得出结论"],
                    t(
                      `An integral over a single point is $0$ whatever $f$ is: $${int(c, c)} = 0$.`,
                      `无论 $f$ 是什么，单点上的积分都是 $0$：$${int(c, c)} = 0$。`,
                    ),
                  ],
                ],
                t(
                  `Split at $${c + 1}$: $${int(c, c)} = ${int(c, c + 1)} + ${int(c + 1, c)}$, and the second integral is the first with its limits reversed, so the two cancel to $0$.`,
                  `在 $${c + 1}$ 处拆开：$${int(c, c)} = ${int(c, c + 1)} + ${int(c + 1, c)}$，第二个积分是第一个交换上下限，所以两者相消为 $0$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Reverse the limits", "交换上下限"],
                    t("Swapping the limits changes the sign:", "交换上下限改变符号："),
                    [`${int(b, a)} = -${int(a, b)}`],
                  ],
                  [
                    ["Use the constant multiple", "用常数倍法则"],
                    t("Take the factor out and put in the given value:", "提出因子并代入已知值："),
                    [`= -${par(Q.of(p))}\\int_{${a}}^{${b}} f(x) \\, dx = -${par(Q.of(p))} \\cdot ${par(Q.of(F))} = ${answer}`],
                  ],
                ],
                t(
                  `Going there and back covers no interval: $${int(a, b)} + ${int(b, a)} = ${int(a, a)} = 0$. With $${int(a, b)} = ${p * F}$, indeed $${p * F} + ${par(Q.of(answer))} = 0$.`,
                  `去了又回来不覆盖任何区间：$${int(a, b)} + ${int(b, a)} = ${int(a, a)} = 0$。由 $${int(a, b)} = ${p * F}$，确实 $${p * F} + ${par(Q.of(answer))} = 0$。`,
                ),
              ),
        });
      },
    },
    {
      id: "splitting-the-interval",
      title: t("Splitting the interval", "拆分积分区间"),
      explanation: t(
        "Area over a whole interval is the sum of the areas over its pieces, so a known total and one known piece give the other piece. For any $a$, $b$ and $c$,\n\n$$\\int_{a}^{b} f(x) \\, dx + \\int_{b}^{c} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx.$$\n\nTo find a piece, subtract, reversing limits where needed. For example, if $\\int_{0}^{5} f(x) \\, dx = 10$ and $\\int_{0}^{2} f(x) \\, dx = 4$, then $\\int_{2}^{5} f(x) \\, dx = 10 - 4 = 6$.\n\nCheck: the two pieces add back to the whole: $4 + 6 = 10$.\n\n> **Watch out.** A piece asked for with its limits the other way round, such as $\\int_{5}^{2}$, has the opposite sign: here $-6$.",
        "整个区间上的面积等于各个小区间上面积的和，所以已知总和与其中一块，就能求出另一块。对任意 $a$、$b$、$c$，\n\n$$\\int_{a}^{b} f(x) \\, dx + \\int_{b}^{c} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx$$\n\n要求其中一段，就做减法，必要时交换上下限。例如，若 $\\int_{0}^{5} f(x) \\, dx = 10$，$\\int_{0}^{2} f(x) \\, dx = 4$，则 $\\int_{2}^{5} f(x) \\, dx = 10 - 4 = 6$。\n\n检验：两段加起来等于整体：$4 + 6 = 10$。\n\n> **注意。** 如果所求的一段上下限是反过来的，比如 $\\int_{5}^{2}$，符号相反：这里是 $-6$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 2);
        const b = a + rng.int(1, 4);
        const c = b + rng.int(1, 4);
        const [AB, BC] = [rng.nonZero(-12, 12), rng.nonZero(-12, 12)];
        const AC = AB + BC;
        const int = (lo: number, hi: number) => `\\int_{${lo}}^{${hi}} f(x) \\, dx`;
        const kind = rng.int(0, 2);
        const n = (v: number) => par(Q.of(v));
        const added = t(
          "This adds the two given integrals; the piece is the whole minus the other piece.",
          "这里把两个已知积分相加了；所求的一段等于整体减去另一段。",
        );
        const whole = t(
          `This is the integral over the whole of $[${a}, ${c}]$, not over the piece asked for.`,
          `这是整个 $[${a}, ${c}]$ 上的积分，不是所求那一段上的积分。`,
        );
        const [given1, given2, ask, answer, mistakes] =
          kind === 0
            ? [
                `${int(a, c)} = ${AC}`,
                `${int(a, b)} = ${AB}`,
                int(b, c),
                BC,
                [
                  why(AC + AB, added.en, added["zh-CN"]),
                  why(
                    AB - AC,
                    "This subtracts in the wrong order: the piece is the whole minus the other piece.",
                    "这里减的顺序反了：所求的一段等于整体减去另一段。",
                  ),
                  why(AC, whole.en, whole["zh-CN"]),
                ],
              ]
            : kind === 1
              ? [
                  `${int(a, c)} = ${AC}`,
                  `${int(b, c)} = ${BC}`,
                  int(a, b),
                  AB,
                  [
                    why(AC + BC, added.en, added["zh-CN"]),
                    why(
                      BC - AC,
                      "This subtracts in the wrong order: the piece is the whole minus the other piece.",
                      "这里减的顺序反了：所求的一段等于整体减去另一段。",
                    ),
                    why(AC, whole.en, whole["zh-CN"]),
                  ],
                ]
              : [
                  `${int(a, c)} = ${AC}`,
                  `${int(a, b)} = ${AB}`,
                  int(c, b),
                  -BC,
                  [
                    why(
                      BC,
                      `This is $${int(b, c)}$; the limits asked for run from $${c}$ down to $${b}$, which changes the sign.`,
                      `这是 $${int(b, c)}$；所求积分从 $${c}$ 到 $${b}$，上下限反过来，符号要变。`,
                    ),
                    why(AC + AB, added.en, added["zh-CN"]),
                    why(AC, whole.en, whole["zh-CN"]),
                  ],
                ];
        const piece = kind === 1 ? int(a, b) : int(b, c);
        const known = kind === 1 ? BC : AB;
        const found = kind === 1 ? AB : BC;
        const steps: Parameters<typeof walked>[0] = [
          [
            ["Split the interval", "拆分区间"],
            t(`Split $[${a}, ${c}]$ at $${b}$:`, `在 $${b}$ 处拆分 $[${a}, ${c}]$：`),
            [`${int(a, b)} + ${int(b, c)} = ${int(a, c)}`],
          ],
          [
            ["Solve for the piece", "求出那一段"],
            t("Subtract the known piece from the whole:", "用整体减去已知的一段："),
            [`${piece} = ${AC} - ${n(known)} = ${found}`],
          ],
          ...(kind === 2
            ? [
                [
                  ["Reverse the limits", "交换上下限"],
                  t("Swapping the limits changes the sign:", "交换上下限改变符号："),
                  [`${ask} = -${int(b, c)} = ${answer}`],
                ] as Parameters<typeof walked>[0][number],
              ]
            : []),
        ];
        return numberProblem({
          prompt: t(`Given $${given1}$ and $${given2}$, find $${ask}$.`, `已知 $${given1}$，$${given2}$，求 $${ask}$。`),
          answer,
          mistakes: distinct(mistakes),
          solution: walked(
            steps,
            kind === 2
              ? t(
                  `$${int(b, c)} = -(${answer}) = ${BC}$, and the pieces add back to the whole: $${AB} + ${n(BC)} = ${AC}$.`,
                  `$${int(b, c)} = -(${answer}) = ${BC}$，两段加起来等于整体：$${AB} + ${n(BC)} = ${AC}$。`,
                )
              : t(`The pieces add back to the whole: $${AB} + ${n(BC)} = ${AC}$.`, `两段加起来等于整体：$${AB} + ${n(BC)} = ${AC}$。`),
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
