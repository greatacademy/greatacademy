import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  gcd,
  type Interval,
  intervalLatex,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  paren,
  plane,
  poly,
  Q,
  type RealSet,
  realLine,
  type Surd,
  simplifyRadical,
  surd,
  surdLatex,
  union,
} from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { annotate, at, graphFigure, guides, plain } from "../graph-figures.ts";
import {
  choiceProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  solutionsProblem,
  steps,
  why,
  yesNo,
} from "../problems.ts";
import { binomialSquare, chain, front, isSquare, quad, sqrtSurd, tail, toQ, view } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

/** sq writes (x − h)², or x² when h = 0. */
const sq = (h: Coefficient, v = "x") => binomialSquare(toQ(h).neg(), v);

/** vertexForm writes a(x − h)² + k. */
const vertexForm = (a: Coefficient, h: Coefficient, k: Coefficient, v = "x") => `${front(a)}${sq(h, v)}${tail(k)}`;

/** factor writes the factor (x − r). */
const factor = (r: Coefficient, v = "x") => `(${linear(1, toQ(r).neg(), v)})`;

/** pt writes the point (x, y). */
const pt = (x: Coefficient, y: Coefficient) => `(${num(x)}, ${num(y)})`;

/** valueAt is ax² + bx + c at x, exactly. */
const valueAt = (a: Coefficient, b: Coefficient, c: Coefficient, x: Coefficient): Q => {
  const X = toQ(x);
  return toQ(a).mul(X).mul(X).add(toQ(b).mul(X)).add(toQ(c));
};

/** plugIn writes ax² + bx + c with a number substituted: "2 \cdot (-3)^{2} - 4 \cdot (-3) + 1". */
function plugIn(a: Coefficient, b: Coefficient, c: Coefficient, x: Coefficient): string {
  const p = toQ(x).isInteger() ? paren(x) : `\\left(${num(x)}\\right)`;
  const term = (k: Q, body: string, first: boolean) => {
    if (k.isZero()) return "";
    const abs = k.abs();
    const coef = abs.eq(Q.one) ? body : `${num(abs)} \\cdot ${body}`;
    if (first) return k.sign() < 0 ? `-${coef}` : coef;
    return k.sign() < 0 ? ` - ${coef}` : ` + ${coef}`;
  };
  const A = toQ(a);
  const B = toQ(b);
  return `${term(A, `${p}^{2}`, true)}${term(B, p, A.isZero())}${tail(c)}`;
}

/** pm lists center + root and center − root in simplest form; one value when the root is 0. */
function pm(center: Q, root: Surd): string[] {
  if (root.m === 1n) {
    if (root.a.isZero()) return [num(center)];
    return [num(center.add(root.a)), num(center.sub(root.a))];
  }
  return [surdLatex(surd(center, root.b, root.m)), surdLatex(surd(center, root.b.neg(), root.m))];
}

/** rootsOf lists the real solutions of ax² + bx + c = 0 in simplest form, the larger first when a > 0. */
function rootsOf(a: number, b: number, c: number): string[] {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  return pm(Q.of(-b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a)));
}

/** distinctRoots draws two distinct nonzero integer roots with a nonzero sum. */
function distinctRoots(rng: Rng, max = 8): [number, number] {
  let r: number;
  let s: number;
  do {
    r = rng.nonZero(-max, max);
    s = rng.nonZero(-max, max);
  } while (r === s || r + s === 0);
  return [r, s];
}

/** drawBySign draws ax² + bx + c with integer coefficients whose discriminant has the given sign. */
function drawBySign(rng: Rng, sign: -1 | 0 | 1): [number, number, number] {
  if (sign === 0) {
    const a = rng.nonZero(-3, 3);
    const h = rng.nonZero(-5, 5);
    return [a, -2 * a * h, a * h * h];
  }
  let a: number;
  let b: number;
  let c: number;
  do {
    a = rng.nonZero(-4, 4);
    b = rng.int(-10, 10);
    c = rng.nonZero(-12, 12);
  } while (Math.sign(b * b - 4 * a * c) !== sign);
  return [a, b, c];
}

/** ray is [k, ∞) when up, (−∞, k] otherwise; open at k unless closed. */
function ray(k: Coefficient, up: boolean, closed = true): RealSet {
  const end = toQ(k);
  const i: Interval = up ? { lo: end, loClosed: closed, hiClosed: false } : { hi: end, loClosed: false, hiClosed: closed };
  return union(i);
}

/** parabolaFigure draws y = a(x − h)² + k with extra marks. */
function parabolaFigure(a: Coefficient, h: number, k: number, marks: readonly PlaneMark[] = [], v: PlaneView = view, note?: Text): Figure {
  const A = toQ(a).toNumber();
  const up = A > 0;
  return {
    svg: plane(v, [{ kind: "curve", f: (x) => A * (x - h) ** 2 + k, accent: true }, ...marks]),
    alt: t(
      `A parabola opening ${up ? "upward" : "downward"} with vertex (${h}, ${k}).${note ? ` ${note.en}` : ""}`,
      `一条开口向${up ? "上" : "下"}、顶点为 (${h}, ${k}) 的抛物线。${note ? note["zh-CN"] : ""}`,
    ),
  };
}

const interceptOptions: readonly Text[] = [
  t("No $x$-intercepts", "与 $x$ 轴没有交点"),
  t("Exactly one $x$-intercept", "与 $x$ 轴恰有一个交点"),
  t("Two $x$-intercepts", "与 $x$ 轴有两个交点"),
];

/** discriminantSteps writes the computation of b² − 4ac. */
function discriminantSteps(a: number, b: number, c: number): string {
  const d = b * b - 4 * a * c;
  const ac4 = 4 * a * c;
  const middle = b === 0 || ac4 === 0 ? "" : ` = ${b * b} ${ac4 > 0 ? "-" : "+"} ${Math.abs(ac4)}`;
  return `b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)}${middle} = ${d}`;
}

/** countWords describes how many x-intercepts a discriminant gives. */
function countWords(d: number): Text {
  if (d > 0) return t("positive, so the graph has two $x$-intercepts", "为正，所以图象与 $x$ 轴有两个交点");
  if (d === 0) return t("zero, so the graph has exactly one $x$-intercept", "为零，所以图象与 $x$ 轴恰有一个交点");
  return t("negative, so the graph has no $x$-intercepts", "为负，所以图象与 $x$ 轴没有交点");
}

/** listed joins values as "$x = 2$ and $x = -3$" in both locales. */
function listed(values: readonly string[], v = "x"): Text {
  return t(values.map((x) => `$${v} = ${x}$`).join(" and "), values.map((x) => `$${v} = ${x}$`).join(" 和 "));
}

const positiveAs: readonly Q[] = [1, 2, 3, 4, 5].map((n) => Q.of(n)).concat([Q.of(1, 2), Q.of(1, 3), Q.of(1, 4)]);

// Module: graphs of quadratic functions.

/** squareThenScale writes the evaluation of a·x² at x, squaring first: "3 \cdot (-2)^{2} = 3 \cdot 4 = 12", or "(-2)^{2} = 4" when a = 1. */
function squareThenScale(a: Q, x: number): string {
  const y = a.mul(Q.of(x * x));
  if (a.eq(Q.one)) return `${paren(x)}^{2} = ${x * x}`;
  if (a.eq(Q.of(-1))) return `-${paren(x)}^{2} = ${-x * x}`;
  return `${plugIn(a, 0, 0, x)} = ${num(a)} \\cdot ${x * x} = ${num(y)}`;
}

export const graphingElementaryQuadraticFunctions: TopicDef = {
  id: "graphing-elementary-quadratic-functions",
  title: t("Graphing Elementary Quadratic Functions", "画简单二次函数的图象"),
  summary: t(
    "Graph $y = ax^{2}$ with $a > 0$ from a table of values, and see how $a$ changes the shape of the parabola.",
    "由函数值表画出 $y = ax^{2}$（$a > 0$）的图象，并了解 $a$ 如何改变抛物线的形状。",
  ),
  prerequisites: ["graphs-of-functions"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSF.IF.C.7.A"],
  intro: t(
    `We graph a function by computing outputs for several inputs and plotting the points $(x, y)$. For a linear function the points line up, so two of them are enough. Squaring behaves differently. Take $y = x^{2}$ and the inputs $-2$ to $2$:

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & 4 & 1 & 0 & 1 & 4 \\end{array}$$

The outputs fall to $0$ and rise again, and they rise faster and faster: from $x = 0$ to $1$ the output grows by $1$, from $1$ to $2$ by $3$. The points do not lie on a line but on a U-shaped curve, a **parabola**:

{{figure 0}}

Two facts shape it. A square is never negative, so no point lies below the $x$-axis and the lowest point, the **vertex**, is $(0, 0)$. And $(-x)^{2} = x^{2}$, so the inputs $2$ and $-2$ reach the same height: the graph is a mirror image of itself across the $y$-axis.

Functions such as $y = x^{2}$, $y = 3x^{2}$ and $y = \\frac{1}{2}x^{2}$ are the simplest **quadratic functions**. In this lesson we compute their values, find the number $a$ in $y = ax^{2}$ from one point of the graph, and see how $a$ makes the parabola narrow or wide.`,
    `画函数图象时，我们对若干输入算出输出，再描出点 $(x, y)$。一次函数的点排成一条直线，所以两个点就够了。平方却不一样。取 $y = x^{2}$，输入从 $-2$ 到 $2$：

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline y & 4 & 1 & 0 & 1 & 4 \\end{array}$$

输出先降到 $0$ 再升高，而且升得越来越快：$x$ 从 $0$ 到 $1$，输出增加 $1$；从 $1$ 到 $2$，增加 $3$。这些点不在一条直线上，而在一条 U 形曲线上，这条曲线叫做**抛物线**：

{{figure 0}}

有两个事实决定了它的形状。平方永远不是负数，所以没有点在 $x$ 轴下方，最低点 $(0, 0)$ 叫做**顶点**。又因为 $(-x)^{2} = x^{2}$，输入 $2$ 和 $-2$ 到达同样的高度：图象关于 $y$ 轴左右对称。

$y = x^{2}$、$y = 3x^{2}$、$y = \\frac{1}{2}x^{2}$ 这样的函数是最简单的**二次函数**。这节课我们计算它们的函数值，由图象上的一个点求出 $y = ax^{2}$ 中的 $a$，并看 $a$ 如何让抛物线变窄或变宽。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: (x) => x * x, accent: true },
        { kind: "point", at: [-2, 4], label: "(−2, 4)", dir: "w" },
        { kind: "point", at: [-1, 1], label: "(−1, 1)", dir: "w" },
        { kind: "point", at: [0, 0], label: "(0, 0)", dir: "se", tone: "result" },
        { kind: "point", at: [1, 1], label: "(1, 1)", dir: "e" },
        { kind: "point", at: [2, 4], label: "(2, 4)", dir: "e" },
      ],
      "The parabola y = x² through (−2, 4), (−1, 1), (0, 0), (1, 1) and (2, 4); its vertex is (0, 0).",
      "抛物线 y = x² 经过 (−2, 4)、(−1, 1)、(0, 0)、(1, 1) 和 (2, 4)；顶点是 (0, 0)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "tables-of-values",
      title: t("Tables of values", "函数值表"),
      explanation: t(
        `In $y = ax^{2}$ the input is squared, and then the square is multiplied by $a$. The order matters because the exponent belongs to $x$ alone, not to $ax$: in $3x^{2}$ only the $x$ is squared.

For $y = 3x^{2}$ and $x = -2$: first $(-2)^{2} = 4$, then $3 \\cdot 4 = 12$. So the graph passes through $(-2, 12)$, and also through $(2, 12)$, since $2^{2}$ is $4$ as well. Making a table this way, a few inputs on each side of $0$, gives the points to plot:

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline 3x^{2} & 12 & 3 & 0 & 3 & 12 \\end{array}$$

> **Watch out.** Square the input before multiplying: $3 \\cdot (-2)^{2} = 12$, not $(3 \\cdot (-2))^{2} = 36$. Squaring is not doubling, so $x^{2}$ at $x = -2$ is $4$, not $-4$: with $a > 0$ every output is positive or zero.`,
        `在 $y = ax^{2}$ 中，先把输入平方，再把平方乘以 $a$。顺序很重要，因为指数只属于 $x$，不属于 $ax$：$3x^{2}$ 中只有 $x$ 被平方。

对 $y = 3x^{2}$ 和 $x = -2$：先算 $(-2)^{2} = 4$，再算 $3 \\cdot 4 = 12$。所以图象经过 $(-2, 12)$，也经过 $(2, 12)$，因为 $2^{2}$ 也是 $4$。这样在 $0$ 的两侧各取几个输入列表，就得到要描的点：

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline 3x^{2} & 12 & 3 & 0 & 3 & 12 \\end{array}$$

> **注意。** 先把输入平方，再相乘：$3 \\cdot (-2)^{2} = 12$，不是 $(3 \\cdot (-2))^{2} = 36$。平方不是乘以 $2$，而 $x = -2$ 时 $x^{2}$ 是 $4$，不是 $-4$：$a > 0$ 时每个输出都是正数或零。`,
      ),
      figure: parabolaFigure(1, 0, 0, [
        { kind: "point", at: [-2, 4] },
        { kind: "point", at: [-1, 1] },
        { kind: "point", at: [0, 0] },
        { kind: "point", at: [1, 1] },
        { kind: "point", at: [2, 4] },
      ]),
      generate(rng) {
        const a = rng.pick(positiveAs);
        const x = rng.nonZero(-6, 6);
        const y = valueAt(a, 0, 0, x);
        const fn = rng.bool();
        const X = Q.of(x);
        const what = fn ? `f(${x})` : "y";
        const check = a.eq(Q.one)
          ? t(
              `**Check.** A square is never negative, and $${x * x}$ is positive. The opposite input gives the same output, $${paren(-x)}^{2} = ${x * x}$, as the mirror symmetry of the parabola says.`,
              `**检验。** 平方不会是负数，而 $${x * x}$ 是正数。相反的输入给出同样的输出，$${paren(-x)}^{2} = ${x * x}$，正符合抛物线的左右对称。`,
            )
          : t(
              `**Check.** Dividing the output by $${num(a)}$ must give back the square of the input: $${num(y)} \\div ${num(a)} = ${x * x} = ${paren(x)}^{2}$.`,
              `**检验。** 输出除以 $${num(a)}$ 应当回到输入的平方：$${num(y)} \\div ${num(a)} = ${x * x} = ${paren(x)}^{2}$。`,
            );
        const work = a.eq(Q.one)
          ? t(
              `**Square the input.** Here $a = 1$, so the output is just the square of $${x}$:${steps(`${what} = ${squareThenScale(a, x)}`)}`,
              `**把输入平方。** 这里 $a = 1$，所以输出就是 $${x}$ 的平方：${steps(`${what} = ${squareThenScale(a, x)}`)}`,
            )
          : t(
              `**Step 1: Square the input.** The exponent belongs to $x$ alone, so first $${paren(x)}^{2} = ${x * x}$.

**Step 2: Multiply by $${num(a)}$.** The square is then multiplied by the coefficient:${steps(`${what} = ${squareThenScale(a, x)}`)}`,
              `**第一步：把输入平方。** 指数只属于 $x$，所以先算 $${paren(x)}^{2} = ${x * x}$。

**第二步：乘以 $${num(a)}$。** 再把平方乘以系数：${steps(`${what} = ${squareThenScale(a, x)}`)}`,
            );
        return numberProblem({
          prompt: fn
            ? t(`Let $f(x) = ${front(a)}x^{2}$. Find $f(${x})$.`, `设 $f(x) = ${front(a)}x^{2}$。求 $f(${x})$。`)
            : t(`For $y = ${front(a)}x^{2}$, find $y$ when $x = ${x}$.`, `对 $y = ${front(a)}x^{2}$，求 $x = ${x}$ 时 $y$ 的值。`),
          answer: y,
          wrong: [y.neg(), a.mul(X).mul(a.mul(X)), a.mul(Q.of(2 * x))],
          solution: t(`${work.en}${check.en}`, `${work["zh-CN"]}${check["zh-CN"]}`),
        });
      },
    },
    {
      id: "finding-a-from-a-point",
      figure: algebraDrawings["graphing-elementary-quadratic-functions#finding-a-from-a-point"],
      title: t("Finding $a$ from a point", "由一个点求 $a$"),
      explanation: t(
        `A point lies on a graph exactly when its coordinates make the equation true. So if the graph of $y = ax^{2}$ passes through a known point, substituting the point leaves an equation with only $a$ unknown, and solving it gives $a$.

Through $(3, 18)$: put $x = 3$ and $y = 18$ into $y = ax^{2}$:

$$18 = a \\cdot 3^{2} = 9a, \\qquad\\text{so}\\qquad a = \\frac{18}{9} = 2.$$

The graph is $y = 2x^{2}$, and indeed $2 \\cdot 3^{2} = 18$.

> **Watch out.** The $x$-coordinate is squared before it meets $a$, so divide $y$ by the **square** of $x$: $\\frac{18}{9}$, not $\\frac{18}{3}$. And divide $y$ by $x^{2}$, not $x^{2}$ by $y$.`,
        `点在图象上，当且仅当它的坐标使方程成立。所以如果 $y = ax^{2}$ 的图象经过一个已知点，代入这个点后，方程里只剩下 $a$ 未知，解出来就得到 $a$。

经过 $(3, 18)$：把 $x = 3$，$y = 18$ 代入 $y = ax^{2}$：

$$18 = a \\cdot 3^{2} = 9a, \\qquad\\text{所以}\\qquad a = \\frac{18}{9} = 2.$$

图象是 $y = 2x^{2}$，确实 $2 \\cdot 3^{2} = 18$。

> **注意。** $x$ 坐标先平方才与 $a$ 相乘，所以要用 $y$ 除以 $x$ 的**平方**：$\\frac{18}{9}$，不是 $\\frac{18}{3}$。而且是 $y$ 除以 $x^{2}$，不是 $x^{2}$ 除以 $y$。`,
      ),
      generate(rng) {
        let a: Q;
        let p: number;
        let q: Q;
        do {
          a = rng.pick(positiveAs);
          p = rng.nonZero(-6, 6);
          q = a.mul(Q.of(p * p));
        } while (!q.isInteger() || q.toNumber() > 80 || q.eq(Q.of(p)));
        const lines =
          p * p === 1
            ? [`${num(q)} = a \\cdot ${paren(p)}^{2} = a`]
            : [`${num(q)} = a \\cdot ${paren(p)}^{2} = ${p * p}a`, `a = \\frac{${num(q)}}{${p * p}} = ${num(a)}`];
        return numberProblem({
          prompt: t(
            `The graph of $y = ax^{2}$ passes through the point $${pt(p, q)}$. Find $a$.`,
            `$y = ax^{2}$ 的图象经过点 $${pt(p, q)}$。求 $a$。`,
          ),
          answer: a,
          wrong: [q.div(Q.of(p)), Q.of(p * p).div(q), q.mul(Q.of(p * p)), q.div(Q.of(2 * p))],
          solution: t(
            `**Step 1: Substitute the point.** The point is on the graph, so $x = ${p}$ and $y = ${num(q)}$ make the equation true:${steps(lines[0]!)}**Step 2: Solve for $a$.** ${p * p === 1 ? `Since $${paren(p)}^{2} = 1$, the equation already reads $a = ${num(a)}$.` : `Divide both sides by $${p * p}$, the square of the $x$-coordinate:${steps(lines[1]!)}`}

**Check.** With $a = ${num(a)}$, the input $${p}$ gives back the $y$-coordinate of the point: $${squareThenScale(a, p)}$.`,
            `**第一步：代入这个点。** 点在图象上，所以 $x = ${p}$，$y = ${num(q)}$ 使方程成立：${steps(lines[0]!)}**第二步：解出 $a$。** ${p * p === 1 ? `因为 $${paren(p)}^{2} = 1$，方程已经是 $a = ${num(a)}$。` : `两边同除以 $x$ 坐标的平方 $${p * p}$：${steps(lines[1]!)}`}

**检验。** 当 $a = ${num(a)}$ 时，输入 $${p}$ 得到的正是这个点的 $y$ 坐标：$${squareThenScale(a, p)}$。`,
          ),
        });
      },
    },
    {
      id: "narrow-and-wide-parabolas",
      title: t("Narrow and wide parabolas", "窄的与宽的抛物线"),
      explanation: t(
        `Every graph $y = ax^{2}$ with $a > 0$ has its vertex at $(0, 0)$, so what tells them apart is how fast they climb. At $x = 1$ the height is $a \\cdot 1^{2} = a$ itself, and at every other input the height is $a$ times that of $y = x^{2}$. A larger $a$ lifts every point more, so the two sides rise steeply and close in: the parabola is **narrower**. A smaller $a$, such as a fraction, flattens it: the parabola is **wider**.

In the figure, at $x = 1$ the graphs $y = 3x^{2}$, $y = x^{2}$ and $y = \\frac{1}{3}x^{2}$ are at heights $3$, $1$ and $\\frac{1}{3}$, so $y = 3x^{2}$ is the narrowest and $y = \\frac{1}{3}x^{2}$ the widest.

> **Watch out.** The larger coefficient makes the narrower graph, not the wider one. A fraction is less than $1$: $y = \\frac{1}{2}x^{2}$ is wider than $y = x^{2}$, though $2$ appears in it.`,
        `每个 $a > 0$ 的图象 $y = ax^{2}$ 的顶点都在 $(0, 0)$，所以区别在于上升得多快。在 $x = 1$ 处高度是 $a \\cdot 1^{2} = a$ 本身；在其他每个输入处，高度都是 $y = x^{2}$ 的 $a$ 倍。$a$ 越大，每个点抬得越高，两边升得越陡、靠得越拢：抛物线越**窄**。$a$ 越小（比如分数），抛物线被压平：越**宽**。

图中在 $x = 1$ 处，$y = 3x^{2}$、$y = x^{2}$、$y = \\frac{1}{3}x^{2}$ 的高度分别是 $3$、$1$、$\\frac{1}{3}$，所以 $y = 3x^{2}$ 最窄，$y = \\frac{1}{3}x^{2}$ 最宽。

> **注意。** 系数越大图象越窄，而不是越宽。分数小于 $1$：$y = \\frac{1}{2}x^{2}$ 比 $y = x^{2}$ 宽，尽管式子里出现了 $2$。`,
      ),
      figure: {
        svg: plane(view, [
          { kind: "curve", f: (x) => 3 * x * x, accent: true },
          { kind: "curve", f: (x) => x * x },
          { kind: "curve", f: (x) => (x * x) / 3, dashed: true },
        ]),
        alt: t(
          "The parabolas y = 3x², y = x² and y = x²/3, all with vertex (0, 0); the first is the narrowest and the last the widest.",
          "抛物线 y = 3x²、y = x² 和 y = x²/3，顶点都是 (0, 0)；第一条最窄，最后一条最宽。",
        ),
      },
      generate(rng) {
        const as = rng.sample(positiveAs, rng.int(3, 4)) as Q[];
        const narrow = rng.bool();
        const sorted = [...as].sort((x, y) => x.cmp(y));
        const pick = narrow ? sorted[sorted.length - 1]! : sorted[0]!;
        const graphs = as.map((a) => `$y = ${front(a)}x^{2}$`);
        const listed = `${graphs.slice(0, -1).join(", ")} or ${graphs[graphs.length - 1]}`;
        const others = as.filter((a) => !a.eq(pick)).map((a) => Q.of(4).mul(a));
        const at2 = Q.of(4).mul(pick);
        return choiceProblem({
          prompt: narrow
            ? t(`Which graph is the narrowest: ${listed}?`, `${graphs.join("、")} 的图象中，哪个最窄？`)
            : t(`Which graph is the widest: ${listed}?`, `${graphs.join("、")} 的图象中，哪个最宽？`),
          options: graphs.map(same),
          correct: as.indexOf(pick),
          solution: t(
            `**Step 1: Compare the coefficients.** All the graphs have vertex $(0, 0)$, and at every input each height is its coefficient times $x^{2}$. The coefficients are $${as.map(num).join(", ")}$; the ${narrow ? "largest" : "smallest"} is $${num(pick)}$.

**Step 2: Choose the graph.** The ${narrow ? "largest" : "smallest"} coefficient climbs ${narrow ? "fastest" : "slowest"}, so $y = ${front(pick)}x^{2}$ is the ${narrow ? "narrowest" : "widest"}.

**Check.** At $x = 2$ this graph is at height $${num(at2)}$, while the others are at $${others.map(num).join(", ")}$: ${narrow ? "it is the highest, so its sides are the steepest" : "it is the lowest, so its sides are the flattest"}.`,
            `**第一步：比较系数。** 所有图象的顶点都是 $(0, 0)$，在每个输入处，高度都是系数乘以 $x^{2}$。系数是 $${as.map(num).join(", ")}$，其中最${narrow ? "大" : "小"}的是 $${num(pick)}$。

**第二步：选出图象。** 系数最${narrow ? "大" : "小"}的上升得最${narrow ? "快" : "慢"}，所以 $y = ${front(pick)}x^{2}$ 最${narrow ? "窄" : "宽"}。

**检验。** 在 $x = 2$ 处，这个图象的高度是 $${num(at2)}$，其他的是 $${others.map(num).join(", ")}$：${narrow ? "它最高，所以两边最陡" : "它最低，所以两边最平"}。`,
          ),
        });
      },
    },
  ],
};

const signedAs: readonly Q[] = [1, 2, 3, 4, 5, 6, 7, 8]
  .map((n) => Q.of(n))
  .concat([Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(2, 3), Q.of(3, 2), Q.of(3, 4)])
  .flatMap((a) => [a, a.neg()]);

/** solveForA writes the steps that solve q = a·p² for a: substitute, then divide by p² unless it is 1. */
function solveForA(p: number, q: Q): string[] {
  const a = q.div(Q.of(p * p));
  return p * p === 1
    ? [`${num(q)} = a \\cdot ${paren(p)}^{2} = a`]
    : [`${num(q)} = a \\cdot ${paren(p)}^{2} = ${p * p}a`, `a = ${num(q)} \\div ${p * p} = ${num(a)}`];
}

export const verticalReflectionsOfQuadraticFunctions: TopicDef = {
  id: "vertical-reflections-of-quadratic-functions",
  title: t("Vertical Reflections of Quadratic Functions", "二次函数图象关于 x 轴的翻折"),
  summary: t(
    "Graph $y = ax^{2}$ with $a < 0$ as the reflection of a parabola in the $x$-axis.",
    "把 $y = ax^{2}$（$a < 0$）的图象看作抛物线关于 $x$ 轴的翻折。",
  ),
  prerequisites: ["graphing-elementary-quadratic-functions"],
  encompasses: [{ topic: "graphing-elementary-quadratic-functions", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7.A"],
  intro: t(
    `So far $a$ in $y = ax^{2}$ has been positive: the parabola opens upward, with its vertex $(0, 0)$ as its lowest point, and a larger $a$ makes it narrower. Now let $a$ be negative. Compare $y = x^{2}$ with $y = -x^{2}$:

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline x^{2} & 4 & 1 & 0 & 1 & 4 \\\\ -x^{2} & -4 & -1 & 0 & -1 & -4 \\end{array}$$

Each output of $y = -x^{2}$ is the opposite of the output of $y = x^{2}$ at the same input. The point $(2, 4)$ becomes $(2, -4)$: the same distance from the $x$-axis, on the other side. Doing that to every point **reflects** the graph in the $x$-axis, and the parabola turns upside down:

{{figure 0}}

The square is still never negative, so $-x^{2}$ is never positive: now the vertex $(0, 0)$ is the **highest** point. In this lesson we tell from the sign of $a$ which way a parabola opens, reflect parabolas in the $x$-axis, and read a negative $a$ from a graph.`,
    `到目前为止，$y = ax^{2}$ 中的 $a$ 都是正数：抛物线开口向上，顶点 $(0, 0)$ 是最低点，$a$ 越大抛物线越窄。现在让 $a$ 取负数。比较 $y = x^{2}$ 与 $y = -x^{2}$：

$$\\begin{array}{c|ccccc} x & -2 & -1 & 0 & 1 & 2 \\\\ \\hline x^{2} & 4 & 1 & 0 & 1 & 4 \\\\ -x^{2} & -4 & -1 & 0 & -1 & -4 \\end{array}$$

对同一个输入，$y = -x^{2}$ 的输出是 $y = x^{2}$ 的输出的相反数。点 $(2, 4)$ 变成 $(2, -4)$：离 $x$ 轴一样远，但在另一侧。对每个点都这样做，就是把图象关于 $x$ 轴**翻折**，抛物线上下颠倒：

{{figure 0}}

平方仍然不会是负数，所以 $-x^{2}$ 不会是正数：现在顶点 $(0, 0)$ 是**最高**点。这节课我们由 $a$ 的符号判断抛物线的开口方向，把抛物线关于 $x$ 轴翻折，并从图象读出负的 $a$。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: (x) => x * x },
        { kind: "curve", f: (x) => -x * x, accent: true },
        { kind: "point", at: [2, 4], label: "(2, 4)", dir: "e" },
        { kind: "arrow", from: [2, 4], to: [2, -4], tone: "action", thin: true },
        { kind: "point", at: [2, -4], label: "(2, −4)", dir: "e", tone: "result" },
      ],
      "The parabola y = x² and its reflection y = −x² in the x-axis; the point (2, 4) goes to (2, −4).",
      "抛物线 y = x² 与它关于 x 轴的翻折 y = −x²；点 (2, 4) 变到 (2, −4)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "opening-up-or-down",
      title: t("Opening upward or downward", "开口向上或向下"),
      explanation: t(
        `Whatever $x$ is, $x^{2}$ is positive or zero. Multiplying by $a$ keeps that sign when $a > 0$ and flips it when $a < 0$. So the graph of $y = ax^{2}$

- opens **upward** when $a > 0$: every output is at least $0$, and the vertex $(0, 0)$ is the **lowest** point;
- opens **downward** when $a < 0$: every output is at most $0$, and the vertex $(0, 0)$ is the **highest** point.

For $y = -\\frac{1}{3}x^{2}$: at $x = 3$ the output is $-\\frac{1}{3} \\cdot 9 = -3$, below the vertex, and so is every other output except at $x = 0$. The parabola opens downward.

> **Watch out.** Only the sign of $a$ decides the direction; its size decides the width. A fraction such as $-\\frac{1}{3}$ is negative, so the parabola opens downward, however small $a$ looks.`,
        `无论 $x$ 是多少，$x^{2}$ 都是正数或零。乘以 $a$ 时，$a > 0$ 保持这个符号，$a < 0$ 把它变号。所以 $y = ax^{2}$ 的图象

- 当 $a > 0$ 时开口**向上**：每个输出都不小于 $0$，顶点 $(0, 0)$ 是**最低**点；
- 当 $a < 0$ 时开口**向下**：每个输出都不大于 $0$，顶点 $(0, 0)$ 是**最高**点。

对 $y = -\\frac{1}{3}x^{2}$：在 $x = 3$ 处输出是 $-\\frac{1}{3} \\cdot 9 = -3$，在顶点下方；除 $x = 0$ 外的其他输出也都如此。抛物线开口向下。

> **注意。** 只有 $a$ 的符号决定开口方向，$a$ 的大小决定宽窄。像 $-\\frac{1}{3}$ 这样的分数是负数，所以抛物线开口向下，不管 $a$ 看起来多小。`,
      ),
      figure: {
        svg: plane(view, [
          { kind: "curve", f: (x) => x * x },
          { kind: "curve", f: (x) => -x * x, accent: true },
        ]),
        alt: t(
          "The parabola y = x² opening upward and its reflection y = −x² opening downward, both with vertex (0, 0).",
          "开口向上的抛物线 y = x² 与它的翻折 y = −x²（开口向下），顶点都是 (0, 0)。",
        ),
      },
      generate(rng) {
        const a = rng.pick(signedAs);
        const lhs = rng.pick(["y", "f(x)", "g(x)"]);
        const up = a.sign() > 0;
        return choiceProblem({
          prompt: t(`Describe the graph of $${lhs} = ${front(a)}x^{2}$.`, `描述 $${lhs} = ${front(a)}x^{2}$ 的图象。`),
          options: [
            t("It opens upward; $(0, 0)$ is its lowest point.", "开口向上；$(0, 0)$ 是最低点。"),
            t("It opens downward; $(0, 0)$ is its highest point.", "开口向下；$(0, 0)$ 是最高点。"),
          ],
          correct: up ? 0 : 1,
          solution: t(
            `**Step 1: Find the sign of $a$.** The coefficient of $x^{2}$ is $a = ${num(a)}$, which is ${up ? "positive" : "negative"}.

**Step 2: Decide the direction.** The square $x^{2}$ is never negative, and multiplying it by a ${up ? "positive" : "negative"} number makes every output ${up ? "positive or zero" : "negative or zero"}. So the parabola opens ${up ? "upward" : "downward"}, and its vertex $(0, 0)$ is its ${up ? "lowest" : "highest"} point.

**Check.** At $x = 1$ the output is $${plugIn(a, 0, 0, 1)} = ${num(a)}$, ${up ? "above" : "below"} the vertex, as a parabola opening ${up ? "upward" : "downward"} must be.`,
            `**第一步：看 $a$ 的符号。** $x^{2}$ 的系数是 $a = ${num(a)}$，是${up ? "正" : "负"}数。

**第二步：判断开口方向。** 平方 $x^{2}$ 不会是负数，乘以一个${up ? "正" : "负"}数后，每个输出都${up ? "是正数或零" : "是负数或零"}。所以抛物线开口向${up ? "上" : "下"}，顶点 $(0, 0)$ 是最${up ? "低" : "高"}点。

**检验。** 在 $x = 1$ 处输出是 $${plugIn(a, 0, 0, 1)} = ${num(a)}$，在顶点${up ? "上方" : "下方"}，正符合开口向${up ? "上" : "下"}的抛物线。`,
          ),
        });
      },
    },
    {
      id: "reflecting-in-the-x-axis",
      figure: algebraDrawings["vertical-reflections-of-quadratic-functions#reflecting-in-the-x-axis"],
      title: t("Reflecting in the $x$-axis", "关于 $x$ 轴翻折"),
      explanation: t(
        `Reflecting in the $x$-axis keeps every $x$-coordinate and changes the sign of every $y$-coordinate: the point $(2, 12)$ goes to $(2, -12)$, the same distance from the axis on the other side. So the reflected graph has, at each input, the opposite of the old output: the reflection of $y = ax^{2}$ is $y = -(ax^{2}) = -ax^{2}$.

For example, $y = 3x^{2}$ passes through $(2, 12)$; its reflection $y = -3x^{2}$ passes through $(2, -12)$. And $y = -\\frac{1}{2}x^{2}$ becomes $y = \\frac{1}{2}x^{2}$: reflecting twice brings a parabola back.

> **Watch out.** Reflecting changes only the sign of $a$, not its size: the reflection of $y = 3x^{2}$ is $y = -3x^{2}$, not $y = -\\frac{1}{3}x^{2}$. And the $x$-coordinate stays the same: $(2, 12)$ goes to $(2, -12)$, not to $(-2, 12)$ or $(-2, -12)$.`,
        `关于 $x$ 轴翻折时，每个点的 $x$ 坐标不变，$y$ 坐标变号：点 $(2, 12)$ 变为 $(2, -12)$，离 $x$ 轴一样远，但在另一侧。所以翻折后的图象在每个输入处的输出都是原来输出的相反数：$y = ax^{2}$ 翻折后是 $y = -(ax^{2}) = -ax^{2}$。

例如，$y = 3x^{2}$ 经过 $(2, 12)$，它的翻折 $y = -3x^{2}$ 经过 $(2, -12)$。而 $y = -\\frac{1}{2}x^{2}$ 变为 $y = \\frac{1}{2}x^{2}$：翻折两次，抛物线回到原处。

> **注意。** 翻折只改变 $a$ 的符号，不改变大小：$y = 3x^{2}$ 翻折后是 $y = -3x^{2}$，不是 $y = -\\frac{1}{3}x^{2}$。$x$ 坐标保持不变：$(2, 12)$ 变到 $(2, -12)$，不是 $(-2, 12)$ 或 $(-2, -12)$。`,
      ),
      generate(rng) {
        const a = rng.pick(signedAs);
        if (rng.bool()) {
          return expressionProblem({
            prompt: t(
              `The graph of $y = ${front(a)}x^{2}$ is reflected in the $x$-axis. Write the equation of the new graph.`,
              `把 $y = ${front(a)}x^{2}$ 的图象关于 $x$ 轴翻折。写出所得图象的方程。`,
            ),
            answer: `${front(a.neg())}x^{2}`,
            prefix: "y =",
            wrong: [`${front(a)}x^{2}`, `${front(Q.one.div(a))}x^{2}`, `${front(Q.one.div(a).neg())}x^{2}`],
            solution: t(
              `**Step 1: Change the sign of every output.** Reflecting in the $x$-axis keeps each input and replaces each output by its opposite, so the new graph is $y = -(${front(a) === "-" ? "-" : front(a)}x^{2})$.

**Step 2: Simplify.** The opposite of $${num(a)}$ is $${num(a.neg())}$:${steps(`y = ${front(a.neg())}x^{2}`)}**Check.** At $x = 1$ the old graph is at height $${num(a)}$ and the new one at $${num(a.neg())}$: the same distance from the $x$-axis, on the other side.`,
              `**第一步：每个输出变号。** 关于 $x$ 轴翻折时，每个输入不变，每个输出换成它的相反数，所以新图象是 $y = -(${front(a) === "-" ? "-" : front(a)}x^{2})$。

**第二步：化简。** $${num(a)}$ 的相反数是 $${num(a.neg())}$：${steps(`y = ${front(a.neg())}x^{2}`)}**检验。** 在 $x = 1$ 处，原图象的高度是 $${num(a)}$，新图象的是 $${num(a.neg())}$：离 $x$ 轴一样远，在另一侧。`,
            ),
          });
        }
        const p = rng.nonZero(-5, 5);
        const q = valueAt(a, 0, 0, p);
        return pointProblem({
          prompt: t(
            `The point $${pt(p, q)}$ lies on the graph of $y = ${front(a)}x^{2}$. The graph is reflected in the $x$-axis. Which point of the new graph has $x$-coordinate $${p}$?`,
            `点 $${pt(p, q)}$ 在 $y = ${front(a)}x^{2}$ 的图象上。把图象关于 $x$ 轴翻折，新图象上 $x$ 坐标为 $${p}$ 的点是哪一个？`,
          ),
          answer: [p, q.neg()],
          wrong: [
            [p, q],
            [-p, q],
            [-p, q.neg()],
          ],
          solution: t(
            `**Step 1: Keep the $x$-coordinate.** Reflecting in the $x$-axis moves each point straight across the axis, so $x = ${p}$ stays.

**Step 2: Change the sign of the $y$-coordinate.** The point $${pt(p, q)}$ goes to $${pt(p, q.neg())}$.

**Check.** The new graph is $y = ${front(a.neg())}x^{2}$, and at $x = ${p}$ it gives $${plugIn(a.neg(), 0, 0, p)} = ${num(q.neg())}$.`,
            `**第一步：$x$ 坐标不变。** 关于 $x$ 轴翻折时，每个点竖直地翻到轴的另一侧，所以 $x = ${p}$ 不变。

**第二步：$y$ 坐标变号。** 点 $${pt(p, q)}$ 变到 $${pt(p, q.neg())}$。

**检验。** 新图象是 $y = ${front(a.neg())}x^{2}$，在 $x = ${p}$ 处得 $${plugIn(a.neg(), 0, 0, p)} = ${num(q.neg())}$。`,
          ),
        });
      },
    },
    {
      id: "finding-a-from-a-graph",
      title: t("Finding $a$ from a graph", "由图象求 $a$"),
      explanation: t(
        `A graph of $y = ax^{2}$ is fixed by one of its points other than the vertex, since that point must satisfy the equation. So read from the graph a point with integer coordinates, substitute it, and solve for $a$.

If the graph opens downward and passes through $(2, -2)$:

$$-2 = a \\cdot 2^{2} = 4a, \\qquad\\text{so}\\qquad a = -2 \\div 4 = -\\frac{1}{2}.$$

The sign agrees with the picture: a parabola opening downward has $a < 0$.

> **Watch out.** Keep the sign of the $y$-coordinate: a point below the $x$-axis gives a negative $a$, and $\\frac{1}{2}$ here would be the parabola opening upward. Divide by the square of $x$, not by $x$.`,
        `$y = ax^{2}$ 的图象由顶点以外的任意一个点确定，因为这个点必须满足方程。所以从图象上读出一个坐标为整数的点，代入后解出 $a$。

若图象开口向下并经过 $(2, -2)$：

$$-2 = a \\cdot 2^{2} = 4a, \\qquad\\text{所以}\\qquad a = -2 \\div 4 = -\\frac{1}{2}.$$

符号与图一致：开口向下的抛物线 $a < 0$。

> **注意。** 保留 $y$ 坐标的符号：$x$ 轴下方的点给出负的 $a$，这里若写 $\\frac{1}{2}$，就成了开口向上的抛物线。要除以 $x$ 的平方，不是除以 $x$。`,
      ),
      figure: parabolaFigure(Q.of(-1, 2), 0, 0, [{ kind: "point", at: [2, -2], label: "(2, −2)", dir: "e" }]),
      generate(rng) {
        const down = rng.bool(0.7);
        const as = [Q.of(1, 4), Q.of(1, 2), Q.one, Q.of(2), Q.of(3), Q.of(4), Q.of(1, 3), Q.of(1, 9), Q.of(2, 9)];
        let a: Q;
        let p: number;
        let q: Q;
        do {
          a = rng.pick(as);
          p = rng.int(1, 6);
          q = a.mul(Q.of(p * p));
        } while (!q.isInteger() || q.toNumber() > 9);
        if (down) {
          a = a.neg();
          q = q.neg();
        }
        p *= rng.sign();
        const qn = q.toNumber();
        const v: PlaneView = down ? { xMin: -6, xMax: 6, yMin: -10, yMax: 2 } : { xMin: -6, xMax: 6, yMin: -2, yMax: 10 };
        const [sub, divide] = solveForA(p, q);
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                "The graph of $y = ax^{2}$ passes through the marked point. Find $a$.",
                "$y = ax^{2}$ 的图象经过标出的点。求 $a$。",
              ),
              answer: a,
              wrong: [a.neg(), q.div(Q.of(p)), Q.of(p * p).div(q)],
              solution: t(
                `**Step 1: Read the point.** The marked point is $${pt(p, q)}$, ${down ? "below" : "above"} the $x$-axis.

**Step 2: Substitute and solve.** The point satisfies $y = ax^{2}$:${steps(sub!, ...(divide ? [divide] : []))}So $a = ${num(a)}$.

**Check.** The sign fits the graph: $a$ is ${down ? "negative and the parabola opens downward" : "positive and the parabola opens upward"}. And the input $${p}$ gives back the height of the marked point: $${squareThenScale(a, p)}$.`,
                `**第一步：读出这个点。** 标出的点是 $${pt(p, q)}$，在 $x$ 轴${down ? "下方" : "上方"}。

**第二步：代入并求解。** 这个点满足 $y = ax^{2}$：${steps(sub!, ...(divide ? [divide] : []))}所以 $a = ${num(a)}$。

**检验。** 符号与图象相符：$a$ ${down ? "为负，抛物线开口向下" : "为正，抛物线开口向上"}。并且输入 $${p}$ 得到的正是标出的点的高度：$${squareThenScale(a, p)}$。`,
              ),
            }),
            figure: parabolaFigure(
              a,
              0,
              0,
              [{ kind: "point", at: [p, qn] }],
              v,
              t(`The marked point is (${p}, ${qn}).`, `标出的点是 (${p}, ${qn})。`),
            ),
          },
          v,
          guides([p, qn], at([p, qn])),
          `With vertex at the origin, ${qn} = a · ${p * p}, so a = ${plain(a)}.`,
          `顶点在原点，${qn} = a · ${p * p}，所以 a = ${plain(a)}。`,
        );
      },
    },
  ],
};

/** termValues writes the terms of ax² + bx + c at x as numbers, added: "8 + 6 - 1". */
function termValues(a: Coefficient, b: Coefficient, c: Coefficient, x: Coefficient): string {
  const X = toQ(x);
  const parts = [toQ(a).mul(X).mul(X), toQ(b).mul(X), toQ(c)];
  return parts.reduce((s, v, i) => (i === 0 ? num(v) : v.isZero() ? s : `${s} ${v.sign() < 0 ? "-" : "+"} ${num(v.abs())}`), "");
}

/** evaluation writes ax² + bx + c at x step by step: substituted, as terms, then the value; steps that say nothing new are left out. */
function evaluation(a: Coefficient, b: Coefficient, c: Coefficient, x: Coefficient): string {
  const lines = [plugIn(a, b, c, x), termValues(a, b, c, x), num(valueAt(a, b, c, x))];
  return lines.filter((l, i) => i === 0 || l !== lines[i - 1]).join(" = ");
}

export const graphsOfGeneralQuadraticFunctions: TopicDef = {
  id: "graphs-of-general-quadratic-functions",
  title: t("Graphs of General Quadratic Functions", "一般二次函数的图象"),
  summary: t(
    "Read the direction and the $y$-intercept of the graph of $y = ax^{2} + bx + c$, and test points on it.",
    "读出 $y = ax^{2} + bx + c$ 的图象的开口方向和 $y$ 轴截距，并检验点是否在图象上。",
  ),
  prerequisites: ["vertical-reflections-of-quadratic-functions"],
  encompasses: [
    { topic: "vertical-reflections-of-quadratic-functions", weight: 0.4 },
    { topic: "evaluating-expressions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.A"],
  intro: t(
    `The graphs of $y = ax^{2}$ are parabolas with their vertex at the origin, opening upward when $a > 0$ and downward when $a < 0$. A general **quadratic function** adds a term in $x$ and a constant: $y = ax^{2} + bx + c$, with $a \\ne 0$. Its graph is still a parabola, of the same shape as $y = ax^{2}$, only moved.

Take $y = x^{2} - 2x - 3$ and make a table:

$$\\begin{array}{c|ccccc} x & -1 & 0 & 1 & 2 & 3 \\\\ \\hline y & 0 & -3 & -4 & -3 & 0 \\end{array}$$

The points fall to $(1, -4)$ and rise again in the same way on both sides, so the vertex is now $(1, -4)$:

{{figure 0}}

The term $ax^{2}$ still wins when $x$ is far from $0$, so the sign of $a$ still decides the direction: here $a = 1$ and the parabola opens upward. And at $x = 0$ both terms with $x$ vanish and only $c = -3$ is left: the graph crosses the $y$-axis at $(0, -3)$. In this lesson we read these two features from the equation, test whether a point lies on the graph, and match equations to graphs.`,
    `$y = ax^{2}$ 的图象是顶点在原点的抛物线，$a > 0$ 时开口向上，$a < 0$ 时开口向下。一般的**二次函数**再加上一次项和常数项：$y = ax^{2} + bx + c$，其中 $a \\ne 0$。它的图象仍是抛物线，形状与 $y = ax^{2}$ 相同，只是位置移动了。

取 $y = x^{2} - 2x - 3$ 列表：

$$\\begin{array}{c|ccccc} x & -1 & 0 & 1 & 2 & 3 \\\\ \\hline y & 0 & -3 & -4 & -3 & 0 \\end{array}$$

这些点降到 $(1, -4)$ 后以同样的方式升高，两边对称，所以现在顶点是 $(1, -4)$：

{{figure 0}}

当 $x$ 离 $0$ 很远时，$ax^{2}$ 这一项仍然起主导作用，所以开口方向仍由 $a$ 的符号决定：这里 $a = 1$，抛物线开口向上。而在 $x = 0$ 处，两个含 $x$ 的项都等于零，只剩下 $c = -3$：图象与 $y$ 轴交于 $(0, -3)$。这节课我们从方程读出这两个特征，检验点是否在图象上，并为图象选出方程。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: (x) => x * x - 2 * x - 3, accent: true },
        { kind: "point", at: [1, -4], label: "(1, −4)", dir: "s", tone: "result" },
        { kind: "point", at: [0, -3], label: "(0, −3)", dir: "w" },
        { kind: "point", at: [-1, 0] },
        { kind: "point", at: [2, -3] },
        { kind: "point", at: [3, 0] },
      ],
      "The parabola y = x² − 2x − 3 opening upward, with vertex (1, −4), crossing the y-axis at (0, −3) and the x-axis at −1 and 3.",
      "开口向上的抛物线 y = x² − 2x − 3，顶点 (1, −4)，与 y 轴交于 (0, −3)，与 x 轴交于 −1 和 3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "the-y-intercept",
      figure: algebraDrawings["graphs-of-general-quadratic-functions#the-y-intercept"],
      title: t("The $y$-intercept", "$y$ 轴截距"),
      explanation: t(
        `Every point on the $y$-axis has $x$-coordinate $0$. So the graph of $y = ax^{2} + bx + c$ meets the $y$-axis where $x = 0$, and there

$$y = a \\cdot 0^{2} + b \\cdot 0 + c = c.$$

Both terms with $x$ vanish, whatever $a$ and $b$ are, and the **$y$-intercept** is $(0, c)$, the constant term. For $y = 2x^{2} - 5x + 3$ it is $(0, 3)$; for $y = 4 - x + 3x^{2}$, written in another order, the constant is still $4$, so it is $(0, 4)$.

> **Watch out.** The $y$-intercept is $(0, c)$, with $0$ first: $(c, 0)$ would be a point on the $x$-axis. And $c$ is the term without $x$, wherever it is written; it is not the coefficient of $x^{2}$ or of $x$.`,
        `$y$ 轴上每个点的 $x$ 坐标都是 $0$。所以 $y = ax^{2} + bx + c$ 的图象在 $x = 0$ 处与 $y$ 轴相交，此时

$$y = a \\cdot 0^{2} + b \\cdot 0 + c = c.$$

无论 $a$、$b$ 是多少，两个含 $x$ 的项都等于零，所以 **$y$ 轴截距**是 $(0, c)$，即常数项。$y = 2x^{2} - 5x + 3$ 的 $y$ 轴截距是 $(0, 3)$；$y = 4 - x + 3x^{2}$ 换了顺序书写，常数仍是 $4$，所以是 $(0, 4)$。

> **注意。** $y$ 轴截距是 $(0, c)$，$0$ 在前：$(c, 0)$ 是 $x$ 轴上的点。$c$ 是不含 $x$ 的那一项，不论它写在哪里；它不是 $x^{2}$ 或 $x$ 的系数。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-9, 9);
        const c = rng.nonZero(-12, 12);
        const scrambled = rng.bool(0.3);
        const rhs = scrambled ? poly([c, ""], [b, "x"], [a, "x^{2}"]) : quad(a, b, c);
        return pointProblem({
          prompt: t(`At which point does the graph of $y = ${rhs}$ cross the $y$-axis?`, `$y = ${rhs}$ 的图象与 $y$ 轴交于哪一点？`),
          answer: [0, c],
          wrong: [
            [c, 0],
            [0, a],
            [0, b],
          ],
          solution: t(
            `**Step 1: Use $x = 0$.** Every point on the $y$-axis has $x$-coordinate $0$.

**Step 2: Compute $y$.** Substitute $x = 0$: the terms $${poly([a, "x^{2}"])}$ and $${poly([b, "x"])}$ both become $0$, since they contain the factor $x$, and only the constant is left:${steps(`y = ${c}`)}So the graph crosses the $y$-axis at $(0, ${c})$.

**Check.** The answer is the constant term of $${rhs}$, which is $${c}$${scrambled ? ", written first here" : ""}, and the point has $x = 0$, so it does lie on the $y$-axis.`,
            `**第一步：取 $x = 0$。** $y$ 轴上每个点的 $x$ 坐标都是 $0$。

**第二步：求 $y$。** 代入 $x = 0$：$${poly([a, "x^{2}"])}$ 和 $${poly([b, "x"])}$ 两项都含因数 $x$，都变成 $0$，只剩下常数：${steps(`y = ${c}`)}所以图象与 $y$ 轴交于 $(0, ${c})$。

**检验。** 结果正是 $${rhs}$ 的常数项 $${c}$${scrambled ? "（这里写在最前面）" : ""}，而且这个点的 $x = 0$，确实在 $y$ 轴上。`,
          ),
        });
      },
    },
    {
      id: "points-on-the-graph",
      figure: algebraDrawings["graphs-of-general-quadratic-functions#points-on-the-graph"],
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        `The graph of an equation is the set of points whose coordinates make it true. So a point lies on the graph of $y = ax^{2} + bx + c$ exactly when substituting its $x$-coordinate gives its $y$-coordinate.

Is $(-2, 13)$ on $y = 2x^{2} - 3x - 1$? Substitute $x = -2$, keeping it in parentheses:

$$2 \\cdot (-2)^{2} - 3 \\cdot (-2) - 1 = 8 + 6 - 1 = 13$$

The output is $13$, the $y$-coordinate of the point, so yes. Had the point been $(-2, 1)$, the answer would be no: the graph passes $13$ units above the axis there, not $1$.

> **Watch out.** Keep parentheses around a negative input: $(-2)^{2} = 4$, whereas $-2^{2}$ would be read as $-4$. And $-3 \\cdot (-2) = +6$: the two negatives make a positive.`,
        `一个方程的图象由坐标使方程成立的点组成。所以点在 $y = ax^{2} + bx + c$ 的图象上，当且仅当代入它的 $x$ 坐标得到它的 $y$ 坐标。

$(-2, 13)$ 在 $y = 2x^{2} - 3x - 1$ 上吗？代入 $x = -2$，并加上括号：

$$2 \\cdot (-2)^{2} - 3 \\cdot (-2) - 1 = 8 + 6 - 1 = 13$$

输出是 $13$，正是这个点的 $y$ 坐标，所以在。如果点是 $(-2, 1)$，答案就是不在：图象在那里高出 $x$ 轴 $13$ 个单位，而不是 $1$ 个。

> **注意。** 负的输入要加括号：$(-2)^{2} = 4$，而 $-2^{2}$ 会被读作 $-4$。并且 $-3 \\cdot (-2) = +6$：两个负号得正。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-6, 6);
        const c = rng.int(-9, 9);
        const p = rng.nonZero(-4, 4);
        const value = valueAt(a, b, c, p);
        const on = rng.bool();
        const slip = valueAt(-a, b, c, p);
        const q = on ? value : slip.eq(value) ? value.add(Q.of(rng.nonZero(-3, 3))) : slip;
        const A = toQ(a).mul(Q.of(p * p));
        const B = toQ(b).mul(Q.of(p));
        return choiceProblem({
          prompt: t(
            `Does the point $${pt(p, q)}$ lie on the graph of $y = ${quad(a, b, c)}$?`,
            `点 $${pt(p, q)}$ 在 $y = ${quad(a, b, c)}$ 的图象上吗？`,
          ),
          options: yesNo,
          correct: on ? 0 : 1,
          solution: t(
            `**Step 1: Substitute the $x$-coordinate.** Put $x = ${p}$ into the equation, in parentheses:${steps(evaluation(a, b, c, p))}**Step 2: Compare with the $y$-coordinate.** ${on ? `The output is $${num(q)}$, the $y$-coordinate of the point, so the point lies on the graph.` : `The output is $${num(value)}$, but the point has $y = ${num(q)}$, so the point does not lie on the graph.`}

**Check.** Term by term at $x = ${p}$: $${plugIn(a, 0, 0, p)} = ${num(A)}$ and $${plugIn(0, b, 0, p)} = ${num(B)}$, and $${num(A)}${tail(B)}${tail(c)} = ${num(value)}$${on ? "" : `, not $${num(q)}$`}.`,
            `**第一步：代入 $x$ 坐标。** 把 $x = ${p}$ 加括号代入方程：${steps(evaluation(a, b, c, p))}**第二步：与 $y$ 坐标比较。** ${on ? `输出是 $${num(q)}$，正是这个点的 $y$ 坐标，所以点在图象上。` : `输出是 $${num(value)}$，而这个点的 $y = ${num(q)}$，所以点不在图象上。`}

**检验。** 在 $x = ${p}$ 处逐项计算：$${plugIn(a, 0, 0, p)} = ${num(A)}$，$${plugIn(0, b, 0, p)} = ${num(B)}$，而 $${num(A)}${tail(B)}${tail(c)} = ${num(value)}$${on ? "" : `，不是 $${num(q)}$`}。`,
          ),
        });
      },
    },
    {
      id: "matching-a-graph",
      figure: algebraDrawings["graphs-of-general-quadratic-functions#matching-a-graph"],
      title: t("Matching an equation to a graph", "由图象选方程"),
      explanation: t(
        `Two different quadratic functions have different graphs, so an equation can be matched to a parabola by checking features that are easy to read, one at a time:

1. the direction: upward needs $a > 0$, downward $a < 0$;
2. the $y$-intercept: the graph crosses the $y$-axis at $(0, c)$;
3. if two equations still fit, test another point of the graph, such as the vertex.

For an upward parabola through $(0, 3)$ with vertex $(1, 2)$, the equations $y = x^{2} - 2x + 3$ and $y = x^{2} + 2x + 3$ both pass the first two tests. At $x = 1$ the first gives $1 - 2 + 3 = 2$ and the second $1 + 2 + 3 = 6$, so only the first has this graph.

> **Watch out.** The direction and the $y$-intercept say nothing about $b$. Changing the sign of $b$ moves the vertex to the other side of the $y$-axis, so do not stop after two tests: put a point of the graph into the equations that are left.`,
        `不同的二次函数有不同的图象，所以可以逐一检查容易读出的特征，为抛物线选出方程：

1. 开口方向：向上要求 $a > 0$，向下要求 $a < 0$；
2. $y$ 轴截距：图象与 $y$ 轴交于 $(0, c)$；
3. 若仍有两个方程符合，再检验图象上的另一点，比如顶点。

对开口向上、经过 $(0, 3)$、顶点为 $(1, 2)$ 的抛物线，$y = x^{2} - 2x + 3$ 和 $y = x^{2} + 2x + 3$ 都通过前两项检查。在 $x = 1$ 处，前者得 $1 - 2 + 3 = 2$，后者得 $1 + 2 + 3 = 6$，所以只有前者是这个图象的方程。

> **注意。** 开口方向和 $y$ 轴截距都不涉及 $b$。改变 $b$ 的符号会让顶点移到 $y$ 轴的另一侧，所以检查两项后不要停下：把图象上的一个点代入剩下的方程。`,
      ),
      generate(rng) {
        let a: number;
        let h: number;
        let k: number;
        let c: number;
        do {
          a = rng.pick([1, -1, 2, -2]);
          h = rng.nonZero(-2, 2);
          k = rng.int(-5, 5);
          c = a * h * h + k;
        } while (c === 0 || Math.abs(c) > 5);
        const b = -2 * a * h;
        const variants: [number, number, number][] = [
          [a, b, c],
          [-a, b, c],
          [a, -b, c],
          [a, b, -c],
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const options = order.map((i) => {
          const [p, q, r] = variants[i]!;
          return same(`$y = ${quad(p, q, r)}$`);
        });
        const up = a > 0;
        return annotate(
          {
            ...choiceProblem({
              prompt: t("Which equation has the graph shown?", "图中的图象是哪个方程的图象？"),
              options,
              correct: order.indexOf(0),
              solution: t(
                `**Step 1: The direction.** The parabola opens ${up ? "upward" : "downward"}, so $a ${up ? ">" : "<"} 0$. This rules out $y = ${quad(-a, b, c)}$.

**Step 2: The $y$-intercept.** The graph crosses the $y$-axis at $(0, ${c})$, so $c = ${c}$. This rules out $y = ${quad(a, b, -c)}$.

**Step 3: Test the vertex.** The vertex $${pt(h, k)}$ is on the graph. In the two equations left, $x = ${h}$ gives${steps(`${evaluation(a, b, c, h)}`, `${evaluation(a, -b, c, h)}`)}Only $y = ${quad(a, b, c)}$ reaches $${k}$ there, so it is the equation of the graph.

**Check.** The parabola is symmetric about the line $x = ${h}$, so the mirror image of $(0, ${c})$, the point $${pt(2 * h, c)}$, must be on it as well: $${evaluation(a, b, c, 2 * h)}$.`,
                `**第一步：开口方向。** 抛物线开口向${up ? "上" : "下"}，所以 $a ${up ? ">" : "<"} 0$。这排除了 $y = ${quad(-a, b, c)}$。

**第二步：$y$ 轴截距。** 图象与 $y$ 轴交于 $(0, ${c})$，所以 $c = ${c}$。这排除了 $y = ${quad(a, b, -c)}$。

**第三步：检验顶点。** 顶点 $${pt(h, k)}$ 在图象上。在剩下的两个方程中，$x = ${h}$ 时分别得到${steps(`${evaluation(a, b, c, h)}`, `${evaluation(a, -b, c, h)}`)}只有 $y = ${quad(a, b, c)}$ 在那里等于 $${k}$，所以它就是图象的方程。

**检验。** 抛物线关于直线 $x = ${h}$ 对称，所以 $(0, ${c})$ 的对称点 $${pt(2 * h, c)}$ 也必须在图象上：$${evaluation(a, b, c, 2 * h)}$。`,
              ),
            }),
            figure: parabolaFigure(
              a,
              h,
              k,
              [{ kind: "point", at: [0, c] }],
              view,
              t(`It crosses the y-axis at (0, ${c}).`, `它与 y 轴交于 (0, ${c})。`),
            ),
          },
          view,
          [{ kind: "point", at: [h, k], label: at([h, k]), dir: up ? "s" : "n", tone: "result" }],
          `The vertex is ${at([h, k])} and the graph crosses the y-axis at ${c}.`,
          `顶点是 ${at([h, k])}，图象与 y 轴交于 ${c}。`,
        );
      },
    },
  ],
};

/** squared writes q², with parentheses around a negative number or a fraction. */
const squared = (q: Coefficient) => `${toQ(q).isInteger() ? paren(q) : `\\left(${num(q)}\\right)`}^{2}`;

/** rootChecks substitutes each root into ax² + bx + c, one line each, every line ending in 0. */
function rootChecks(a: number, b: number, c: number, roots: readonly number[]): string[] {
  return roots.map((r) => `f(${r}) = ${evaluation(a, b, c, r)}`);
}

export const rootsOfQuadraticFunctions: TopicDef = {
  id: "roots-of-quadratic-functions",
  title: t("Roots of Quadratic Functions", "二次函数的零点"),
  summary: t(
    "Find the roots of a quadratic function, the $x$-intercepts of its graph, by factoring or with the quadratic formula.",
    "用因式分解或求根公式求二次函数的零点，即图象与 $x$ 轴交点的横坐标。",
  ),
  prerequisites: [
    "graphs-of-general-quadratic-functions",
    "roots-of-a-function",
    "solving-quadratic-equations-by-factoring",
    "the-quadratic-formula",
  ],
  encompasses: [
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.5 },
    { topic: "roots-of-a-function", weight: 0.4 },
    { topic: "the-quadratic-formula", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.8.A", "CCSS.HSA.APR.B.3"],
  intro: t(
    `A **root** of a function $f$ is an input where $f(x) = 0$; on the graph it is an $x$-intercept, a point where the graph meets the $x$-axis. For a quadratic function $f(x) = ax^{2} + bx + c$, finding the roots means solving the quadratic equation $ax^{2} + bx + c = 0$, and we already know how: by factoring, or with the quadratic formula.

Take $f(x) = x^{2} - 2x - 8$. Its graph is an upward parabola crossing the $y$-axis at $(0, -8)$. Where does it cross the $x$-axis? Set $f(x) = 0$ and factor:

$$x^{2} - 2x - 8 = (x - 4)(x + 2) = 0$$

A product is $0$ only when a factor is $0$, so $x = 4$ or $x = -2$. Indeed $f(4) = 16 - 8 - 8 = 0$ and $f(-2) = 4 + 4 - 8 = 0$, and the graph passes through $(4, 0)$ and $(-2, 0)$:

{{figure 0}}

The roots tell where the graph changes sign: between them this parabola is below the axis, outside them above. In this lesson we find the roots of quadratic functions by factoring, from a factored form, and with the quadratic formula.`,
    `函数 $f$ 的**零点**是使 $f(x) = 0$ 的输入；在图象上，它是图象与 $x$ 轴的交点的横坐标。对二次函数 $f(x) = ax^{2} + bx + c$，求零点就是解一元二次方程 $ax^{2} + bx + c = 0$，而这我们已经会了：用因式分解，或用求根公式。

取 $f(x) = x^{2} - 2x - 8$。它的图象是开口向上、与 $y$ 轴交于 $(0, -8)$ 的抛物线。它在哪里与 $x$ 轴相交？令 $f(x) = 0$ 并分解因式：

$$x^{2} - 2x - 8 = (x - 4)(x + 2) = 0$$

乘积为 $0$ 只能是某个因式为 $0$，所以 $x = 4$ 或 $x = -2$。确实 $f(4) = 16 - 8 - 8 = 0$，$f(-2) = 4 + 4 - 8 = 0$，图象经过 $(4, 0)$ 和 $(-2, 0)$：

{{figure 0}}

零点告诉我们图象在哪里变号：这条抛物线在两个零点之间位于 $x$ 轴下方，在两侧位于上方。这节课我们用因式分解、由因式分解形式以及用求根公式求二次函数的零点。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -4, xMax: 6, yMin: -10, yMax: 4, labelEvery: 2 },
      [
        { kind: "curve", f: (x) => x * x - 2 * x - 8, accent: true },
        { kind: "point", at: [-2, 0], label: "(−2, 0)", dir: "nw", tone: "result" },
        { kind: "point", at: [4, 0], label: "(4, 0)", dir: "ne", tone: "result" },
        { kind: "point", at: [0, -8], label: "(0, −8)", dir: "w" },
      ],
      "The parabola y = x² − 2x − 8 crosses the x-axis at (−2, 0) and (4, 0) and the y-axis at (0, −8).",
      "抛物线 y = x² − 2x − 8 与 x 轴交于 (−2, 0) 和 (4, 0)，与 y 轴交于 (0, −8)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "roots-by-factoring",
      title: t("Roots by factoring", "用因式分解求零点"),
      explanation: t(
        `The roots of $f(x) = ax^{2} + bx + c$ are the solutions of $f(x) = 0$. When the quadratic factors, the zero product rule finds them: a product is $0$ exactly when one of its factors is $0$.

For $f(x) = x^{2} - 2x - 8$, look for two numbers with product $-8$ and sum $-2$: they are $-4$ and $2$. So

$$x^{2} - 2x - 8 = (x - 4)(x + 2) = 0 \\quad\\Rightarrow\\quad x - 4 = 0 \\text{ or } x + 2 = 0,$$

and the roots are $x = 4$ and $x = -2$. The graph crosses the $x$-axis at $(4, 0)$ and $(-2, 0)$. If the leading coefficient is not $1$, take it out first: $2x^{2} - 4x - 16 = 2(x^{2} - 2x - 8)$ has the same roots, since the factor $2$ is never $0$.

> **Watch out.** The root has the opposite sign to the number in its factor: $x - 4$ gives $x = 4$, and $x + 2$ gives $x = -2$. A quadratic with two factors has two roots; give both, and do not give the constant term as a root.`,
        `$f(x) = ax^{2} + bx + c$ 的零点是 $f(x) = 0$ 的解。二次式能分解时，用零乘积法则求它们：乘积为 $0$，当且仅当某个因式为 $0$。

对 $f(x) = x^{2} - 2x - 8$，找积为 $-8$、和为 $-2$ 的两个数：$-4$ 和 $2$。所以

$$x^{2} - 2x - 8 = (x - 4)(x + 2) = 0 \\quad\\Rightarrow\\quad x - 4 = 0 \\text{ 或 } x + 2 = 0,$$

零点是 $x = 4$ 和 $x = -2$。图象与 $x$ 轴交于 $(4, 0)$ 和 $(-2, 0)$。若二次项系数不是 $1$，先把它提出来：$2x^{2} - 4x - 16 = 2(x^{2} - 2x - 8)$ 的零点相同，因为因数 $2$ 不会等于 $0$。

> **注意。** 零点与因式中的数符号相反：$x - 4$ 给出 $x = 4$，$x + 2$ 给出 $x = -2$。有两个因式的二次式有两个零点，两个都要写出，也不要把常数项当作零点。`,
      ),
      figure: parabolaFigure(1, 1, -9, [
        { kind: "point", at: [4, 0], label: "(4, 0)", dir: "se" },
        { kind: "point", at: [-2, 0], label: "(−2, 0)", dir: "sw" },
      ]),
      generate(rng) {
        const [r, s] = distinctRoots(rng);
        const a = rng.pick([1, 1, 1, -1, 2]);
        const fx = quad(a, -a * (r + s), a * r * s);
        const graph = rng.bool();
        const inner = quad(1, -(r + s), r * s);
        const factorLines =
          a === 1
            ? [`${fx} = 0`, `${factor(r)}${factor(s)} = 0`]
            : [`${fx} = 0`, `${front(a)}(${inner}) = 0`, `${front(a)}${factor(r)}${factor(s)} = 0`];
        const pair = t(
          `**Step 2: Factor.** ${a === 1 ? "" : `Take out the leading coefficient $${a}$ first. `}Two numbers with product $${r * s}$ and sum $${-(r + s)}$ are $${-r}$ and $${-s}$:${steps(...factorLines)}`,
          `**第二步：分解因式。** ${a === 1 ? "" : `先提出二次项系数 $${a}$。`}积为 $${r * s}$、和为 $${-(r + s)}$ 的两个数是 $${-r}$ 和 $${-s}$：${steps(...factorLines)}`,
        );
        return solutionsProblem({
          prompt: graph
            ? t(
                `Find the $x$-coordinates of the points where the graph of $y = ${fx}$ crosses the $x$-axis.`,
                `求 $y = ${fx}$ 的图象与 $x$ 轴交点的横坐标。`,
              )
            : t(`Find the roots of $f(x) = ${fx}$.`, `求 $f(x) = ${fx}$ 的零点。`),
          values: [String(r), String(s)],
          wrong: [[String(-r), String(-s)], [String(r)], [String(a * r * s)]],
          solution: t(
            `**Step 1: Set the function equal to $0$.** ${graph ? "On the $x$-axis $y = 0$" : "A root is an input where the function is $0$"}, so solve $${fx} = 0$.

${pair.en}**Step 3: Use the zero product rule.** ${a === 1 ? "" : `The factor $${a}$ is never $0$, so one of the others is. `}$${linear(1, -r)} = 0$ gives $x = ${r}$, and $${linear(1, -s)} = 0$ gives $x = ${s}$. So the ${graph ? "graph crosses the $x$-axis at" : "roots are"} $x = ${r}$ and $x = ${s}$.

**Check.** Substitute each value:${steps(...rootChecks(a, -a * (r + s), a * r * s, [r, s]))}`,
            `**第一步：令函数值为 $0$。** ${graph ? "在 $x$ 轴上 $y = 0$" : "零点是使函数值为 $0$ 的输入"}，所以解 $${fx} = 0$。

${pair["zh-CN"]}**第三步：用零乘积法则。** ${a === 1 ? "" : `因数 $${a}$ 不会等于 $0$，所以另外的因式之一为 $0$。`}由 $${linear(1, -r)} = 0$ 得 $x = ${r}$，由 $${linear(1, -s)} = 0$ 得 $x = ${s}$。所以${graph ? "图象与 $x$ 轴交点的横坐标是" : "零点是"} $x = ${r}$ 和 $x = ${s}$。

**检验。** 代入每个值：${steps(...rootChecks(a, -a * (r + s), a * r * s, [r, s]))}`,
          ),
        });
      },
    },
    {
      id: "roots-from-factored-form",
      title: t("Roots from factored form", "由因式分解形式求零点"),
      explanation: t(
        `When the function is already written as a product, no factoring is needed: it is $0$ exactly when one of its factors is $0$. Set each factor that contains $x$ equal to $0$ and solve. A constant factor in front is never $0$, so it gives no root.

$$f(x) = -3(2x - 5)(x + 4) \\quad\\Rightarrow\\quad 2x - 5 = 0 \\text{ or } x + 4 = 0$$

From $2x - 5 = 0$: add $5$, then divide by $2$, so $x = \\frac{5}{2}$. From $x + 4 = 0$: $x = -4$. The roots are $\\frac{5}{2}$ and $-4$; the $-3$ only stretches and flips the graph.

> **Watch out.** Solve each factor, do not just read off the number in it: $2x - 5 = 0$ gives $\\frac{5}{2}$, not $5$, and $x + 4 = 0$ gives $-4$, not $4$. The constant $-3$ is not a root.`,
        `函数已经写成乘积时，不需要再分解：它为 $0$，当且仅当某个因式为 $0$。令每个含 $x$ 的因式等于 $0$ 并求解。前面的常数因子不会等于 $0$，不给出零点。

$$f(x) = -3(2x - 5)(x + 4) \\quad\\Rightarrow\\quad 2x - 5 = 0 \\text{ 或 } x + 4 = 0$$

由 $2x - 5 = 0$：加 $5$，再除以 $2$，得 $x = \\frac{5}{2}$。由 $x + 4 = 0$：$x = -4$。零点是 $\\frac{5}{2}$ 和 $-4$；$-3$ 只是让图象伸缩和翻转。

> **注意。** 要解每个因式，而不是直接读出其中的数：$2x - 5 = 0$ 给出 $\\frac{5}{2}$，不是 $5$；$x + 4 = 0$ 给出 $-4$，不是 $4$。常数 $-3$ 不是零点。`,
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(2, 5);
          q = rng.nonZero(-9, 9);
        } while (gcd(p, Math.abs(q)) !== 1);
        const s = rng.nonZero(-8, 8);
        const k = rng.pick([1, -1, 2, -2, 3, -3, 4, 5]);
        const fx = `${front(k)}(${linear(p, q)})${factor(s)}`;
        const r = Q.of(-q, p);
        const constant =
          k === 1
            ? t("There is no constant factor in front, so", "前面没有常数因子，所以")
            : t(`The constant factor $${k}$ is never $0$, so`, `常数因子 $${k}$ 不会等于 $0$，所以`);
        return solutionsProblem({
          prompt: t(`Find the roots of $f(x) = ${fx}$.`, `求 $f(x) = ${fx}$ 的零点。`),
          values: [num(r), String(s)],
          wrong: [
            [num(r.neg()), String(-s)],
            [String(-q), String(s)],
            [String(k), num(r), String(s)],
          ],
          solution: t(
            `**Step 1: Set each factor with $x$ equal to $0$.** A product is $0$ exactly when one of its factors is. ${constant.en} $f(x) = 0$ when $${linear(p, q)} = 0$ or $${linear(1, -s)} = 0$.

**Step 2: Solve each.** ${q > 0 ? `Subtract $${q}$` : `Add $${-q}$`}, then divide by $${p}$:${steps(`${p}x = ${-q}`, `x = ${num(r)}`)}And $${linear(1, -s)} = 0$ gives $x = ${s}$. The roots are $x = ${num(r)}$ and $x = ${s}$.

**Check.** At $x = ${num(r)}$ the first factor is $${p} \\cdot ${paren(r)}${tail(q)} = ${-q}${tail(q)} = 0$, and at $x = ${s}$ the second is $${s}${tail(-s)} = 0$.`,
            `**第一步：令每个含 $x$ 的因式等于 $0$。** 乘积为 $0$，当且仅当某个因式为 $0$。${constant["zh-CN"]}当 $${linear(p, q)} = 0$ 或 $${linear(1, -s)} = 0$ 时 $f(x) = 0$。

**第二步：分别求解。** ${q > 0 ? `减去 $${q}$` : `加上 $${-q}$`}，再除以 $${p}$：${steps(`${p}x = ${-q}`, `x = ${num(r)}`)}由 $${linear(1, -s)} = 0$ 得 $x = ${s}$。零点是 $x = ${num(r)}$ 和 $x = ${s}$。

**检验。** 在 $x = ${num(r)}$ 处第一个因式是 $${p} \\cdot ${paren(r)}${tail(q)} = ${-q}${tail(q)} = 0$，在 $x = ${s}$ 处第二个因式是 $${s}${tail(-s)} = 0$。`,
          ),
        });
      },
    },
    {
      id: "roots-with-the-quadratic-formula",
      figure: algebraDrawings["roots-of-quadratic-functions#roots-with-the-quadratic-formula"],
      title: t("Roots with the quadratic formula", "用求根公式求零点"),
      explanation: t(
        `Many quadratics do not factor over the integers, yet their graphs still cross the $x$-axis. The quadratic formula, which comes from completing the square, finds the roots of every $ax^{2} + bx + c$:

$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

For $f(x) = x^{2} - 4x + 1$: $a = 1$, $b = -4$, $c = 1$, and $b^{2} - 4ac = 16 - 4 = 12$. So

$$x = \\frac{4 \\pm \\sqrt{12}}{2} = \\frac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}.$$

The graph crosses the $x$-axis at $x = 2 + \\sqrt{3} \\approx 3.73$ and $x = 2 - \\sqrt{3} \\approx 0.27$.

> **Watch out.** The formula starts with $-b$, the opposite of $b$: for $b = -4$ it is $4$. Take the signs of $a$, $b$ and $c$ with them into $b^{2} - 4ac$, and simplify the square root before dividing by $2a$.`,
        `很多二次式不能在整数范围内分解，但它们的图象仍与 $x$ 轴相交。求根公式由配方得来，能求出每个 $ax^{2} + bx + c$ 的零点：

$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

对 $f(x) = x^{2} - 4x + 1$：$a = 1$，$b = -4$，$c = 1$，$b^{2} - 4ac = 16 - 4 = 12$。所以

$$x = \\frac{4 \\pm \\sqrt{12}}{2} = \\frac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}.$$

图象与 $x$ 轴交于 $x = 2 + \\sqrt{3} \\approx 3.73$ 和 $x = 2 - \\sqrt{3} \\approx 0.27$。

> **注意。** 公式以 $-b$ 开头，即 $b$ 的相反数：$b = -4$ 时它是 $4$。代入 $b^{2} - 4ac$ 时 $a$、$b$、$c$ 要带着各自的符号；先化简平方根，再除以 $2a$。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        do {
          a = rng.pick([1, 1, 2, -1, 3]);
          b = rng.int(-9, 9);
          c = rng.nonZero(-9, 9);
          d = b * b - 4 * a * c;
        } while (d <= 0 || isSquare(d));
        const roots = rootsOf(a, b, c);
        const wrong: string[][] = [];
        if (b !== 0) wrong.push(rootsOf(a, -b, c));
        if (b * b + 4 * a * c > 0 && !isSquare(b * b + 4 * a * c)) wrong.push(rootsOf(a, b, -c));
        const [outside, inside] = simplifyRadical(d);
        const top = (root: string) => `${b === 0 ? "" : `${-b} `}\\pm ${root}`;
        const formulaLines = [`x = \\frac{${top(`\\sqrt{${d}}`)}}{${2 * a}}`];
        if (outside !== 1) formulaLines.push(`x = \\frac{${top(`${outside}\\sqrt{${inside}}`)}}{${2 * a}}`);
        const center = Q.of(-b, 2 * a);
        const spread = Q.of(d, 4 * a * a);
        const sum = Q.of(-b, a);
        const product = Q.of(c, a);
        const expandRoots = `${front(a)}(x - x_{1})(x - x_{2}) = ${front(a)}\\left(${quad(1, sum.neg(), product)}\\right)${a === 1 ? "" : ` = ${quad(a, b, c)}`}`;
        return solutionsProblem({
          prompt: t(`Find the roots of $f(x) = ${quad(a, b, c)}$.`, `求 $f(x) = ${quad(a, b, c)}$ 的零点。`),
          values: roots,
          wrong,
          solution: t(
            `**Step 1: Read the coefficients and the discriminant.** Here $a = ${a}$, $b = ${b}$, $c = ${c}$, and${steps(discriminantSteps(a, b, c))}It is positive but not a perfect square, so there are two roots and the expression does not factor over the integers.

**Step 2: Use the quadratic formula.**${steps(...formulaLines)}Dividing ${b === 0 ? "the root" : "both terms"} by $${2 * a}$ gives the roots ${listed(roots).en}.

**Check.** The two roots add to $${num(sum)}$, since the square roots cancel, and multiply to $${squared(center)} - ${num(spread)} = ${num(product)}$ by the difference of squares. So they are the roots of the function:${steps(expandRoots)}`,
            `**第一步：读出系数，计算判别式。** 这里 $a = ${a}$，$b = ${b}$，$c = ${c}$，并且${steps(discriminantSteps(a, b, c))}它是正数但不是完全平方数，所以有两个零点，且式子不能在整数范围内分解。

**第二步：用求根公式。**${steps(...formulaLines)}${b === 0 ? "把根式" : "把两项都"}除以 $${2 * a}$，得零点 ${listed(roots)["zh-CN"]}。

**检验。** 两个零点之和是 $${num(sum)}$，因为平方根相互抵消；由平方差公式，它们之积是 $${squared(center)} - ${num(spread)} = ${num(product)}$。所以它们正是这个函数的零点：${steps(expandRoots)}`,
          ),
        });
      },
    },
  ],
};

/** wrap writes a number to be multiplied: negative numbers and fractions in parentheses. */
const wrap = (q: Coefficient) => (toQ(q).isInteger() ? paren(q) : `\\left(${num(q)}\\right)`);

/** vertexCheck completes the square of ax² + bx + c and says what its lowest or highest value means for the x-intercepts. */
function vertexCheck(a: number, b: number, c: number): Text {
  const h = Q.of(-b, 2 * a);
  const k = Q.of(4 * a * c - b * b, 4 * a);
  const form = `${quad(a, b, c)} = ${vertexForm(a, h, k)}`;
  const up = a > 0;
  const where = k.isZero()
    ? t("on the $x$-axis, where the graph only touches it", "在 $x$ 轴上，图象只在那里与它相切")
    : k.sign() > 0 === up
      ? t(
          `${up ? "above" : "below"} the $x$-axis, and the parabola opens ${up ? "upward" : "downward"}, away from it, so it never meets the axis`,
          `在 $x$ 轴${up ? "上方" : "下方"}，而抛物线开口向${up ? "上" : "下"}，远离 $x$ 轴，所以永远不与它相交`,
        )
      : t(
          `${up ? "below" : "above"} the $x$-axis, and the parabola opens ${up ? "upward" : "downward"}, toward it, so it crosses the axis on both sides of the vertex`,
          `在 $x$ 轴${up ? "下方" : "上方"}，而抛物线开口向${up ? "上" : "下"}，朝着 $x$ 轴，所以在顶点两侧各与它相交一次`,
        );
  return t(
    `**Check.** Completing the square gives${steps(form)}so the ${up ? "lowest" : "highest"} point is $${pt(h, k)}$, ${where.en}.`,
    `**检验。** 配方得${steps(form)}所以最${up ? "低" : "高"}点是 $${pt(h, k)}$，${where["zh-CN"]}。`,
  );
}

export const theDiscriminantOfAQuadraticFunction: TopicDef = {
  id: "the-discriminant-of-a-quadratic-function",
  title: t("The Discriminant of a Quadratic Function", "二次函数的判别式"),
  summary: t(
    "Use the discriminant $b^{2} - 4ac$ to tell how many times a parabola meets the $x$-axis.",
    "用判别式 $b^{2} - 4ac$ 判断抛物线与 $x$ 轴有几个交点。",
  ),
  prerequisites: ["roots-of-quadratic-functions", "quadratic-equations-with-one-real-solution"],
  encompasses: [
    { topic: "the-discriminant-of-a-quadratic-equation", weight: 0.5 },
    { topic: "quadratic-equations-with-one-real-solution", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.4.B", "CCSS.HSF.IF.C.8.A"],
  intro: t(
    `The $x$-intercepts of $y = ax^{2} + bx + c$ are the real solutions of $ax^{2} + bx + c = 0$, and we know that the **discriminant** $b^{2} - 4ac$, the number under the square root in the quadratic formula, counts those solutions: two when it is positive, one when it is zero, none when it is negative. So the discriminant also tells how many times a parabola meets the $x$-axis, without drawing it or solving anything.

Take three parabolas that differ only in $c$:

$$y = x^{2} - 2x - 3, \\qquad y = x^{2} - 2x + 1, \\qquad y = x^{2} - 2x + 3.$$

Their discriminants are $4 + 12 = 16$, $4 - 4 = 0$ and $4 - 12 = -8$. Raising $c$ lifts the parabola: the first dips below the $x$-axis and crosses it twice, the second just touches it at its vertex $(1, 0)$, and the third stays above it:

{{figure 0}}

In this lesson we count $x$-intercepts with the discriminant, read the sign of the discriminant from a graph, and find the constant that makes a parabola touch the $x$-axis.`,
    `$y = ax^{2} + bx + c$ 与 $x$ 轴的交点对应 $ax^{2} + bx + c = 0$ 的实数解，而我们知道，**判别式** $b^{2} - 4ac$，也就是求根公式中根号下的数，决定这些解的个数：为正时两个，为零时一个，为负时没有。所以判别式也告诉我们抛物线与 $x$ 轴相交几次，不必画图，也不必求解。

取三条只有 $c$ 不同的抛物线：

$$y = x^{2} - 2x - 3, \\qquad y = x^{2} - 2x + 1, \\qquad y = x^{2} - 2x + 3.$$

它们的判别式分别是 $4 + 12 = 16$、$4 - 4 = 0$ 和 $4 - 12 = -8$。$c$ 增大时抛物线上移：第一条落到 $x$ 轴下方，与它相交两次；第二条恰好在顶点 $(1, 0)$ 处与它相切；第三条完全在它上方：

{{figure 0}}

这节课我们用判别式数出与 $x$ 轴的交点，从图象读出判别式的符号，并求出使抛物线与 $x$ 轴相切的常数。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: (x) => x * x - 2 * x - 3, accent: true },
        { kind: "curve", f: (x) => x * x - 2 * x + 1 },
        { kind: "curve", f: (x) => x * x - 2 * x + 3, dashed: true },
        { kind: "point", at: [-1, 0], tone: "result" },
        { kind: "point", at: [3, 0], tone: "result" },
        { kind: "point", at: [1, 0], label: "(1, 0)", dir: "s", tone: "result" },
      ],
      "Three parabolas: y = x² − 2x − 3 crosses the x-axis at −1 and 3, y = x² − 2x + 1 touches it at (1, 0), and y = x² − 2x + 3 stays above it.",
      "三条抛物线：y = x² − 2x − 3 与 x 轴交于 −1 和 3，y = x² − 2x + 1 在 (1, 0) 处与它相切，y = x² − 2x + 3 完全在它上方。",
    ),
  ],
  knowledgePoints: [
    {
      id: "counting-x-intercepts",
      figure: algebraDrawings["the-discriminant-of-a-quadratic-function#counting-x-intercepts"],
      title: t("Counting $x$-intercepts", "数与 $x$ 轴的交点"),
      explanation: t(
        `On the $x$-axis $y = 0$, so the $x$-intercepts of $y = ax^{2} + bx + c$ are the real solutions of $ax^{2} + bx + c = 0$. The quadratic formula gives them as $\\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$, so the discriminant $b^{2} - 4ac$ decides how many there are:

- positive: the $\\pm$ gives two different values, and the parabola crosses the $x$-axis twice;
- zero: both values are $-\\frac{b}{2a}$, and the parabola touches the $x$-axis at one point, its vertex;
- negative: there is no real square root, and the parabola does not meet the $x$-axis.

For $y = 2x^{2} - 3x + 4$: $a = 2$, $b = -3$, $c = 4$, so $(-3)^{2} - 4 \\cdot 2 \\cdot 4 = 9 - 32 = -23 < 0$, and the graph has no $x$-intercepts.

> **Watch out.** Take the signs into $b^{2} - 4ac$: $b^{2}$ is never negative, even when $b$ is, and when $a$ and $c$ have opposite signs, $-4ac$ is positive and the discriminant is too. Only the sign of the result matters, not its size.`,
        `在 $x$ 轴上 $y = 0$，所以 $y = ax^{2} + bx + c$ 与 $x$ 轴的交点对应 $ax^{2} + bx + c = 0$ 的实数解。求根公式给出它们为 $\\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$，所以判别式 $b^{2} - 4ac$ 决定解的个数：

- 为正：$\\pm$ 给出两个不同的值，抛物线与 $x$ 轴相交两次；
- 为零：两个值都是 $-\\frac{b}{2a}$，抛物线与 $x$ 轴相切于一点，即顶点；
- 为负：没有实数平方根，抛物线与 $x$ 轴没有交点。

对 $y = 2x^{2} - 3x + 4$：$a = 2$，$b = -3$，$c = 4$，所以 $(-3)^{2} - 4 \\cdot 2 \\cdot 4 = 9 - 32 = -23 < 0$，图象与 $x$ 轴没有交点。

> **注意。** 代入 $b^{2} - 4ac$ 时要带上符号：即使 $b$ 是负数，$b^{2}$ 也不是负数；当 $a$ 与 $c$ 异号时，$-4ac$ 为正，判别式也为正。要看的只是结果的符号，而不是大小。`,
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [a, b, c] = drawBySign(rng, sign);
        const d = b * b - 4 * a * c;
        const check = vertexCheck(a, b, c);
        return reasoned(
          choiceProblem({
            prompt: t(
              `How many $x$-intercepts does the graph of $y = ${quad(a, b, c)}$ have?`,
              `$y = ${quad(a, b, c)}$ 的图象与 $x$ 轴有几个交点？`,
            ),
            options: interceptOptions,
            correct: sign + 1,
            solution: t(
              `**Step 1: Compute the discriminant.** Here $a = ${a}$, $b = ${b}$ and $c = ${c}$:${steps(discriminantSteps(a, b, c))}**Step 2: Read its sign.** The $x$-intercepts are the real solutions of $${quad(a, b, c)} = 0$, and the discriminant is ${countWords(d).en}.

${check.en}`,
              `**第一步：计算判别式。** 这里 $a = ${a}$，$b = ${b}$，$c = ${c}$：${steps(discriminantSteps(a, b, c))}**第二步：看它的符号。** 与 $x$ 轴的交点对应 $${quad(a, b, c)} = 0$ 的实数解，而判别式${countWords(d)["zh-CN"]}。

${check["zh-CN"]}`,
            ),
          }),
          [
            [
              interceptOptions[0]!.en,
              `No $x$-intercept needs a negative discriminant, and here it is $${d}$.`,
              `与 $x$ 轴没有交点要求判别式为负，而这里它等于 $${d}$。`,
            ],
            [
              interceptOptions[1]!.en,
              `Exactly one $x$-intercept needs a discriminant of $0$, and here it is $${d}$.`,
              `恰有一个交点要求判别式为 $0$，而这里它等于 $${d}$。`,
            ],
            [
              interceptOptions[2]!.en,
              `Two $x$-intercepts needs a positive discriminant, and here it is $${d}$.`,
              `有两个交点要求判别式为正，而这里它等于 $${d}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "the-discriminant-from-a-graph",
      figure: algebraDrawings["the-discriminant-of-a-quadratic-function#the-discriminant-from-a-graph"],
      title: t("The sign of the discriminant from a graph", "由图象判断判别式的符号"),
      explanation: t(
        `The link between the discriminant and the $x$-intercepts works in both directions. Each point where the parabola meets the $x$-axis is a real solution of $ax^{2} + bx + c = 0$, so counting those points tells the sign of $b^{2} - 4ac$, even when the equation is not given:

- two crossings: two solutions, so $b^{2} - 4ac > 0$;
- the vertex on the $x$-axis: one solution, so $b^{2} - 4ac = 0$;
- no meeting point: no solutions, so $b^{2} - 4ac < 0$.

The last case happens when the vertex is above the $x$-axis and the parabola opens upward, or below it and the parabola opens downward: it turns away before reaching the axis.

> **Watch out.** Count the points on the $x$-axis, not on the $y$-axis: every parabola crosses the $y$-axis exactly once. And a parabola whose vertex lies on the $x$-axis meets it once, so its discriminant is $0$, not positive.`,
        `判别式与 $x$ 轴交点之间的联系是双向的。抛物线与 $x$ 轴的每个交点都对应 $ax^{2} + bx + c = 0$ 的一个实数解，所以即使没有给出方程，数一数这些交点也能知道 $b^{2} - 4ac$ 的符号：

- 相交两次：两个解，所以 $b^{2} - 4ac > 0$；
- 顶点在 $x$ 轴上：一个解，所以 $b^{2} - 4ac = 0$；
- 没有交点：没有解，所以 $b^{2} - 4ac < 0$。

最后一种情形出现在顶点在 $x$ 轴上方且开口向上，或顶点在 $x$ 轴下方且开口向下时：抛物线还没到达 $x$ 轴就转回去了。

> **注意。** 数的是 $x$ 轴上的点，不是 $y$ 轴上的点：每条抛物线都恰好与 $y$ 轴相交一次。顶点在 $x$ 轴上的抛物线与它只有一个交点，所以判别式是 $0$，而不是正数。`,
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const a = rng.pick([1, -1, Q.of(1, 2), Q.of(-1, 2), 2, -2]);
        const up = toQ(a).sign() > 0;
        const h = rng.int(-3, 3);
        const size = rng.int(1, 4);
        const k = sign === 0 ? 0 : sign > 0 === up ? -size : size;
        const options = [same("$b^{2} - 4ac > 0$"), same("$b^{2} - 4ac = 0$"), same("$b^{2} - 4ac < 0$")];
        const meets =
          sign > 0
            ? t("crosses the $x$-axis twice", "与 $x$ 轴相交两次")
            : sign === 0
              ? t("touches the $x$-axis only at its vertex", "只在顶点处与 $x$ 轴相切")
              : t("does not meet the $x$-axis", "与 $x$ 轴没有交点");
        const count = t(
          sign > 0 ? "two real solutions" : sign === 0 ? "exactly one real solution" : "no real solutions",
          sign > 0 ? "两个实数解" : sign === 0 ? "恰有一个实数解" : "没有实数解",
        );
        const why =
          sign === 0
            ? t(`The vertex $${pt(h, 0)}$ lies on the $x$-axis`, `顶点 $${pt(h, 0)}$ 在 $x$ 轴上`)
            : t(
                `The vertex $${pt(h, k)}$ is ${k > 0 ? "above" : "below"} the $x$-axis and the parabola opens ${up ? "upward" : "downward"}, ${sign > 0 ? "toward the axis, so it must cross it on both sides" : "away from the axis, so it can never reach it"}`,
                `顶点 $${pt(h, k)}$ 在 $x$ 轴${k > 0 ? "上方" : "下方"}，而抛物线开口向${up ? "上" : "下"}，${sign > 0 ? "朝着 $x$ 轴，所以一定在两侧各穿过它一次" : "远离 $x$ 轴，所以永远到不了它"}`,
              );
        return annotate(
          {
            ...choiceProblem({
              prompt: t(
                "The graph of $y = ax^{2} + bx + c$ is shown. What is true of its discriminant?",
                "如图是 $y = ax^{2} + bx + c$ 的图象。它的判别式满足什么？",
              ),
              options,
              correct: 1 - sign,
              solution: t(
                `**Step 1: Count the meeting points.** The parabola ${meets.en}, so $ax^{2} + bx + c = 0$ has ${count.en}.

**Step 2: Read the discriminant.** The discriminant counts those solutions, so ${options[1 - sign]!.en}.

**Check.** ${why.en}, which agrees with the count.`,
                `**第一步：数交点。** 抛物线${meets["zh-CN"]}，所以 $ax^{2} + bx + c = 0$ ${count["zh-CN"]}。

**第二步：读出判别式。** 判别式决定解的个数，所以 ${options[1 - sign]!["zh-CN"]}。

**检验。** ${why["zh-CN"]}，与交点个数一致。`,
              ),
            }),
            figure: parabolaFigure(a, h, k),
          },
          view,
          (sign < 0 ? [] : sign === 0 ? [h] : [h - Math.sqrt(-k / toQ(a).toNumber()), h + Math.sqrt(-k / toQ(a).toNumber())]).map(
            (x): PlaneMark => ({ kind: "point", at: [x, 0], tone: "result" }),
          ),
          `The parabola meets the x-axis at ${sign < 0 ? 0 : sign === 0 ? 1 : 2} points.`,
          `抛物线与 x 轴有 ${sign < 0 ? 0 : sign === 0 ? 1 : 2} 个交点。`,
        );
      },
    },
    {
      id: "touching-the-x-axis",
      figure: algebraDrawings["the-discriminant-of-a-quadratic-function#touching-the-x-axis"],
      title: t("Parabolas that touch the $x$-axis", "与 $x$ 轴相切的抛物线"),
      explanation: t(
        `A parabola meets the $x$-axis at exactly one point, touching it at its vertex, when $ax^{2} + bx + c = 0$ has exactly one solution, that is, when the discriminant is $0$. If one coefficient is unknown, setting $b^{2} - 4ac = 0$ gives an equation for it.

For which $c$ does $y = 2x^{2} - 12x + c$ touch the $x$-axis? Here $a = 2$ and $b = -12$:

$$(-12)^{2} - 4 \\cdot 2 \\cdot c = 0 \\quad\\Rightarrow\\quad 144 - 8c = 0 \\quad\\Rightarrow\\quad c = \\frac{144}{8} = 18$$

Indeed $2x^{2} - 12x + 18 = 2(x - 3)^{2}$, which is $0$ only at $x = 3$.

> **Watch out.** Solve $b^{2} - 4ac = 0$ for $c$, which gives $c = \\frac{b^{2}}{4a}$: divide by $4a$, not by $2a$ or by $a$. When $a$ is negative, $c$ is negative too.`,
        `抛物线与 $x$ 轴恰有一个交点（在顶点处相切），当且仅当 $ax^{2} + bx + c = 0$ 恰有一个解，即判别式为 $0$。若有一个系数未知，令 $b^{2} - 4ac = 0$ 就得到关于它的方程。

$c$ 为何值时 $y = 2x^{2} - 12x + c$ 与 $x$ 轴相切？这里 $a = 2$，$b = -12$：

$$(-12)^{2} - 4 \\cdot 2 \\cdot c = 0 \\quad\\Rightarrow\\quad 144 - 8c = 0 \\quad\\Rightarrow\\quad c = \\frac{144}{8} = 18$$

确实 $2x^{2} - 12x + 18 = 2(x - 3)^{2}$，只在 $x = 3$ 处为 $0$。

> **注意。** 由 $b^{2} - 4ac = 0$ 解出 $c$，得 $c = \\frac{b^{2}}{4a}$：要除以 $4a$，不是除以 $2a$ 或 $a$。当 $a$ 为负数时，$c$ 也是负数。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-12, 12);
        const c = Q.of(b * b, 4 * a);
        const h = Q.of(-b, 2 * a);
        return numberProblem({
          prompt: t(
            `Find the value of $c$ for which the graph of $y = ${quad(a, b, 0)} + c$ meets the $x$-axis at exactly one point.`,
            `求 $c$ 的值，使 $y = ${quad(a, b, 0)} + c$ 的图象与 $x$ 轴恰有一个交点。`,
          ),
          answer: c,
          wrong: [c.neg(), Q.of(b, 2 * a)],
          mistakes: [
            why(
              Q.of(b * b, 2 * a),
              "You divided by $2a$. Touching means $b^2 - 4ac = 0$, so $c = \\frac{b^2}{4a}$.",
              "你除以了 $2a$。相切意味着 $b^2 - 4ac = 0$，所以 $c = \\frac{b^2}{4a}$。",
            ),
            why(
              Q.of(b * b, a),
              "You dropped the $4$. The discriminant is $b^2 - 4ac$, so $c = \\frac{b^2}{4a}$.",
              "你漏掉了 $4$。判别式是 $b^2 - 4ac$，所以 $c = \\frac{b^2}{4a}$。",
            ),
          ],
          solution: t(
            `**Step 1: Set the discriminant equal to $0$.** Exactly one meeting point means exactly one solution of $${quad(a, b, 0)} + c = 0$, so $b^{2} - 4ac = 0$ with $a = ${a}$ and $b = ${b}$:${steps(`${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot c = 0`, `${b * b} ${4 * a > 0 ? "-" : "+"} ${Math.abs(4 * a)}c = 0`)}**Step 2: Solve for $c$.** Move the term with $c$ to the other side and divide by $${4 * a}$:${steps(`${4 * a}c = ${b * b}`, `c = ${b * b} \\div ${paren(4 * a)} = ${num(c)}`)}**Check.** With $c = ${num(c)}$ the discriminant is $${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${wrap(c)} = ${b * b} - ${b * b} = 0$, and the function is a perfect square:${steps(`${quad(a, b, c)} = ${vertexForm(a, h, 0)}`)}It is $0$ only at $x = ${num(h)}$, where the parabola touches the $x$-axis.`,
            `**第一步：令判别式等于 $0$。** 恰有一个交点意味着 $${quad(a, b, 0)} + c = 0$ 恰有一个解，所以 $b^{2} - 4ac = 0$，其中 $a = ${a}$，$b = ${b}$：${steps(`${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot c = 0`, `${b * b} ${4 * a > 0 ? "-" : "+"} ${Math.abs(4 * a)}c = 0`)}**第二步：解出 $c$。** 把含 $c$ 的项移到另一边，再除以 $${4 * a}$：${steps(`${4 * a}c = ${b * b}`, `c = ${b * b} \\div ${paren(4 * a)} = ${num(c)}`)}**检验。** 当 $c = ${num(c)}$ 时，判别式是 $${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${wrap(c)} = ${b * b} - ${b * b} = 0$，函数是一个完全平方：${steps(`${quad(a, b, c)} = ${vertexForm(a, h, 0)}`)}它只在 $x = ${num(h)}$ 处为 $0$，抛物线在那里与 $x$ 轴相切。`,
          ),
        });
      },
    },
  ],
};

// Module: parabolas and vertex form.

/** drawVertex draws a parabola y = a(x − h)² + k that fits the standard view, with a ∈ {±1, ±1/2, ±2}. */
function drawVertex(rng: Rng): { a: Q; h: number; k: number } {
  const a = rng.pick([Q.one, Q.of(-1), Q.of(1, 2), Q.of(-1, 2), Q.of(2), Q.of(-2)]);
  const h = rng.int(-4, 4);
  const k = a.sign() > 0 ? rng.int(-5, 2) : rng.int(-2, 5);
  return { a, h, k };
}

/** axisFormula writes x = −b/(2a) for integer a and b, step by step. */
function axisFormula(a: number, b: number): string {
  const h = Q.of(-b, 2 * a);
  const parts = [`-\\frac{${b}}{2 \\cdot ${paren(a)}}`, `-\\frac{${b}}{${2 * a}}`, num(h)];
  return `x = ${parts.filter((p, i) => p !== parts[i - 1]).join(" = ")}`;
}

export const theAxisOfSymmetryOfAParabola: TopicDef = {
  id: "the-axis-of-symmetry-of-a-parabola",
  title: t("The Axis of Symmetry of a Parabola", "抛物线的对称轴"),
  summary: t(
    "Find the axis of symmetry of a parabola from its graph or with $x = -\\frac{b}{2a}$, and use it to find mirror-image points.",
    "从图象或用 $x = -\\frac{b}{2a}$ 求抛物线的对称轴，并用它求对称点。",
  ),
  prerequisites: ["graphs-of-general-quadratic-functions"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.7.A", "CCSS.HSF.IF.B.4"],
  intro: t(
    `The graph of $y = x^{2}$ is a mirror image of itself across the $y$-axis, because $x$ and $-x$ have the same square. Every parabola has such a mirror line: the vertical line through its vertex, called its **axis of symmetry**. Folding the graph along it makes the two halves match, so points at the same height come in pairs, one on each side, at the same distance from the line.

Where is the axis of $y = x^{2} - 4x + 1$? Two points at the same height are easy to find. At $x = 0$ the graph is at height $1$, its $y$-intercept. The graph is at height $1$ again where $x^{2} - 4x + 1 = 1$, that is, where $x^{2} - 4x = x(x - 4) = 0$: at $x = 0$ and at $x = 4$. The axis lies halfway between them, at $x = 2$, and the vertex is on it: $2^{2} - 4 \\cdot 2 + 1 = -3$, so the vertex is $(2, -3)$:

{{figure 0}}

The same reasoning works for every $y = ax^{2} + bx + c$: the height $c$ is reached where $ax^{2} + bx = x(ax + b) = 0$, at $x = 0$ and at $x = -\\frac{b}{a}$, so the axis is halfway, at

$$x = -\\frac{b}{2a}.$$

In this lesson we read the axis of symmetry from a graph, compute it from an equation, and use it to find mirror-image points.`,
    `$y = x^{2}$ 的图象关于 $y$ 轴对称，因为 $x$ 与 $-x$ 的平方相同。每条抛物线都有这样一条对称线：经过顶点的竖直线，叫做**对称轴**。沿它对折，两半完全重合，所以同一高度的点成对出现，分居两侧，到这条线的距离相等。

$y = x^{2} - 4x + 1$ 的对称轴在哪里？同一高度的两个点很容易找到。在 $x = 0$ 处图象的高度是 $1$，即 $y$ 轴截距。图象再次到达高度 $1$ 的地方满足 $x^{2} - 4x + 1 = 1$，即 $x^{2} - 4x = x(x - 4) = 0$：在 $x = 0$ 和 $x = 4$ 处。对称轴在它们正中间，即 $x = 2$，顶点就在它上面：$2^{2} - 4 \\cdot 2 + 1 = -3$，所以顶点是 $(2, -3)$：

{{figure 0}}

同样的推理适用于每个 $y = ax^{2} + bx + c$：高度 $c$ 出现在 $ax^{2} + bx = x(ax + b) = 0$ 处，即 $x = 0$ 和 $x = -\\frac{b}{a}$，所以对称轴在正中间：

$$x = -\\frac{b}{2a}.$$

这节课我们从图象读出对称轴，由方程算出对称轴，并用它求对称点。`,
  ),
  introFigures: [
    graphFigure(
      view,
      [
        { kind: "curve", f: (x) => x * x - 4 * x + 1, accent: true },
        { kind: "line", a: [2, 0], b: [2, 1], dashed: true, tone: "action" },
        { kind: "segment", a: [0, 1], b: [4, 1], dashed: true },
        { kind: "point", at: [0, 1], label: "(0, 1)", dir: "w" },
        { kind: "point", at: [4, 1], label: "(4, 1)", dir: "e" },
        { kind: "point", at: [2, -3], label: "(2, −3)", dir: "e", tone: "result" },
      ],
      "The parabola y = x² − 4x + 1 with the points (0, 1) and (4, 1) at the same height; the axis of symmetry x = 2 lies halfway between them and passes through the vertex (2, −3).",
      "抛物线 y = x² − 4x + 1 上同一高度的两点 (0, 1) 和 (4, 1)；对称轴 x = 2 在它们正中间，并经过顶点 (2, −3)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "the-axis-from-a-graph",
      title: t("The axis of symmetry from a graph", "从图象读对称轴"),
      explanation: t(
        `A parabola falls to its vertex and rises again in exactly the same way, or rises and falls, so it is symmetric about the vertical line through its vertex, its **axis of symmetry**. If the vertex is $(h, k)$, every point of that line has $x$-coordinate $h$, so the axis of symmetry is the line $x = h$.

In the figure the vertex is $(2, -3)$, so the axis of symmetry is $x = 2$. The points $(1, -2)$ and $(3, -2)$ show it: they are at the same height, one unit to the left and one unit to the right of the line.

> **Watch out.** The axis is a vertical line, so its equation fixes $x$: it is $x = 2$, not $x = -3$ or $y = -3$, which use the height of the vertex. Read the $x$-coordinate of the vertex with its sign.`,
        `抛物线以完全相同的方式降到顶点再升高（或升高再下降），所以它关于经过顶点的竖直线对称，这条线叫做**对称轴**。若顶点是 $(h, k)$，这条线上每个点的 $x$ 坐标都是 $h$，所以对称轴是直线 $x = h$。

图中顶点是 $(2, -3)$，所以对称轴是 $x = 2$。点 $(1, -2)$ 和 $(3, -2)$ 印证了这一点：它们高度相同，分别在这条线左边和右边一个单位处。

> **注意。** 对称轴是竖直线，所以它的方程确定的是 $x$：是 $x = 2$，不是用顶点高度写成的 $x = -3$ 或 $y = -3$。读顶点的 $x$ 坐标时要带上符号。`,
      ),
      figure: parabolaFigure(
        1,
        2,
        -3,
        [{ kind: "line", a: [2, 0], b: [2, 1], dashed: true }],
        view,
        t("The dashed line x = 2 passes through the vertex.", "虚线 x = 2 经过顶点。"),
      ),
      generate(rng) {
        let v: { a: Q; h: number; k: number };
        do v = drawVertex(rng);
        while (v.h === 0 || v.h === v.k);
        const { a, h, k } = v;
        const d = a.abs().eq(Q.of(1, 2)) ? 2 : 1;
        const y = a.mul(Q.of(d * d)).add(Q.of(k));
        return annotate(
          {
            ...numberProblem({
              prompt: t("What is the equation of the axis of symmetry of the parabola shown?", "图中抛物线的对称轴方程是什么？"),
              answer: h,
              solveFor: "x",
              wrong: [k, -h],
              solution: t(
                `**Step 1: Find the vertex.** The parabola opens ${a.sign() > 0 ? "upward, so the vertex is its lowest" : "downward, so the vertex is its highest"} point: $${pt(h, k)}$.

**Step 2: Draw the vertical line through it.** Every point of the vertical line through the vertex has $x = ${h}$, so the axis of symmetry is $x = ${h}$.

**Check.** The points $${pt(h - d, y)}$ and $${pt(h + d, y)}$ of the graph are at the same height and both $${d}$ from the line $x = ${h}$, one on each side, as mirror images must be.`,
                `**第一步：找出顶点。** 抛物线开口向${a.sign() > 0 ? "上，所以顶点是最低" : "下，所以顶点是最高"}点：$${pt(h, k)}$。

**第二步：作经过它的竖直线。** 经过顶点的竖直线上每个点都有 $x = ${h}$，所以对称轴是 $x = ${h}$。

**检验。** 图象上的点 $${pt(h - d, y)}$ 和 $${pt(h + d, y)}$ 高度相同，到直线 $x = ${h}$ 的距离都是 $${d}$，分居两侧，正是对称点应有的样子。`,
              ),
            }),
            figure: parabolaFigure(a, h, k),
          },
          view,
          [
            { kind: "line", a: [h, 0], b: [h, 1], dashed: true, tone: "result" },
            { kind: "point", at: [h, k], label: at([h, k]), dir: "e", tone: "result" },
          ],
          `The axis of symmetry passes through the vertex: x = ${h}.`,
          `对称轴经过顶点：x = ${h}。`,
        );
      },
    },
    {
      id: "the-axis-from-the-equation",
      title: t("The formula for the axis of symmetry", "对称轴公式"),
      explanation: t(
        `The graph of $y = ax^{2} + bx + c$ is at height $c$ where $ax^{2} + bx = 0$, that is, where $x(ax + b) = 0$: at $x = 0$ and at $x = -\\frac{b}{a}$. These two points are mirror images, so the axis of symmetry is halfway between them:

$$x = -\\frac{b}{2a}$$

For $y = 3x^{2} + 12x - 1$: $a = 3$ and $b = 12$, so $x = -\\frac{12}{2 \\cdot 3} = -2$. With $b = -10$ and $a = 2$: $x = -\\frac{-10}{4} = \\frac{5}{2}$. The axis need not pass through grid points, and $c$ plays no part, since changing $c$ only moves the parabola up or down.

> **Watch out.** Keep the minus sign in front and the sign of $b$: they cancel when $b$ is negative. Divide by $2a$, not by $a$, and do not swap $a$ and $b$.`,
        `$y = ax^{2} + bx + c$ 的图象在 $ax^{2} + bx = 0$，即 $x(ax + b) = 0$ 处的高度是 $c$：在 $x = 0$ 和 $x = -\\frac{b}{a}$ 处。这两点互为对称点，所以对称轴在它们正中间：

$$x = -\\frac{b}{2a}$$

对 $y = 3x^{2} + 12x - 1$：$a = 3$，$b = 12$，所以 $x = -\\frac{12}{2 \\cdot 3} = -2$。当 $b = -10$，$a = 2$ 时：$x = -\\frac{-10}{4} = \\frac{5}{2}$。对称轴不一定经过格点；$c$ 不起作用，因为改变 $c$ 只是让抛物线上下移动。

> **注意。** 保留前面的负号和 $b$ 的符号：$b$ 为负时两者抵消。要除以 $2a$，不是除以 $a$，也不要把 $a$ 和 $b$ 对调。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-12, 12);
        const c = rng.int(-9, 9);
        const h = Q.of(-b, 2 * a);
        const mirror = h.mul(Q.of(2));
        return numberProblem({
          prompt: t(`Find the axis of symmetry of the graph of $y = ${quad(a, b, c)}$.`, `求 $y = ${quad(a, b, c)}$ 的图象的对称轴。`),
          answer: h,
          solveFor: "x",
          wrong: [h.neg(), Q.of(-b, a), Q.of(-2 * a, b), Q.of(c)],
          solution: t(
            `**Step 1: Read $a$ and $b$.** In $y = ${quad(a, b, c)}$ the coefficient of $x^{2}$ is $a = ${a}$ and the coefficient of $x$ is $b = ${b}$; the constant does not affect the axis.

**Step 2: Use $x = -\\frac{b}{2a}$.**${steps(axisFormula(a, b))}So the axis of symmetry is $x = ${num(h)}$.

**Check.** The $y$-intercept $(0, ${c})$ and its mirror image across $x = ${num(h)}$, the point with $x = ${num(mirror)}$, must be at the same height:${steps(`y = ${evaluation(a, b, c, mirror)}`)}`,
            `**第一步：读出 $a$ 和 $b$。** 在 $y = ${quad(a, b, c)}$ 中，$x^{2}$ 的系数 $a = ${a}$，$x$ 的系数 $b = ${b}$；常数项不影响对称轴。

**第二步：用 $x = -\\frac{b}{2a}$。**${steps(axisFormula(a, b))}所以对称轴是 $x = ${num(h)}$。

**检验。** $y$ 轴截距 $(0, ${c})$ 与它关于 $x = ${num(h)}$ 的对称点（$x = ${num(mirror)}$ 处）必须高度相同：${steps(`y = ${evaluation(a, b, c, mirror)}`)}`,
          ),
        });
      },
    },
    {
      id: "mirror-points",
      figure: algebraDrawings["the-axis-of-symmetry-of-a-parabola#mirror-points"],
      title: t("Mirror-image points", "对称点"),
      explanation: t(
        `Folding a parabola along its axis of symmetry carries each point to another point of the parabola at the same height, at the same distance from the axis on the other side. So knowing one point and the axis gives a second point for free.

If the axis is $x = 1$ and $(4, 7)$ is on the parabola: $4$ is $3$ to the right of $1$, so its mirror image is $3$ to the left, at $x = 1 - 3 = -2$. The point $(-2, 7)$ is on the parabola too. In general the mirror image of $(p, q)$ across $x = h$ is $(2h - p, q)$; for instance the $y$-intercept $(0, c)$ is mirrored to $(2h, c)$.

> **Watch out.** Only the $x$-coordinate changes; the height $q$ stays. The new $x$ is $2h - p$, not $-p$ (that would be the mirror image across the $y$-axis) and not $h - p$, which is only the distance to the axis.`,
        `沿对称轴对折抛物线，每个点都落到抛物线上另一个点：高度相同，在对称轴另一侧，距离相等。所以知道一个点和对称轴，就白得第二个点。

若对称轴是 $x = 1$，$(4, 7)$ 在抛物线上：$4$ 在 $1$ 右边 $3$ 个单位，所以对称点在左边 $3$ 个单位，即 $x = 1 - 3 = -2$。点 $(-2, 7)$ 也在抛物线上。一般地，$(p, q)$ 关于 $x = h$ 的对称点是 $(2h - p, q)$；例如 $y$ 轴截距 $(0, c)$ 的对称点是 $(2h, c)$。

> **注意。** 只有 $x$ 坐标改变，高度 $q$ 不变。新的 $x$ 是 $2h - p$，不是 $-p$（那是关于 $y$ 轴的对称点），也不是 $h - p$（那只是到对称轴的距离）。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const h = rng.nonZero(-6, 6);
          let p: number;
          do p = rng.int(-9, 9);
          while (p === h || p === 2 * h - p || p === -p);
          const q = rng.int(-12, 12);
          const m = 2 * h - p;
          const d = Math.abs(p - h);
          return pointProblem({
            prompt: t(
              `A parabola has axis of symmetry $x = ${h}$ and passes through $${pt(p, q)}$. Find the other point of the parabola with $y$-coordinate $${q}$.`,
              `一条抛物线的对称轴是 $x = ${h}$，且经过 $${pt(p, q)}$。求抛物线上 $y$ 坐标为 $${q}$ 的另一点。`,
            ),
            answer: [m, q],
            wrong: [
              [-p, q],
              [p, -q],
              [h - p, q],
            ],
            solution: t(
              `**Step 1: Measure the distance to the axis.** The point has $x = ${p}$, which is $${d}$ to the ${p > h ? "right" : "left"} of the axis $x = ${h}$.

**Step 2: Go the same distance the other way.** Its mirror image is $${d}$ to the ${p > h ? "left" : "right"} of the axis, at $x = ${h} ${p > h ? "-" : "+"} ${d} = ${m}$, and at the same height. The point is $${pt(m, q)}$.

**Check.** The axis lies halfway between the two $x$-coordinates: $${m === 0 ? "" : `\\frac{${p} + ${paren(m)}}{2} = `}\\frac{${p + m}}{2} = ${h}$.`,
              `**第一步：量出到对称轴的距离。** 这个点的 $x = ${p}$，在对称轴 $x = ${h}$ ${p > h ? "右" : "左"}边 $${d}$ 个单位。

**第二步：向另一侧走同样的距离。** 对称点在对称轴${p > h ? "左" : "右"}边 $${d}$ 个单位，即 $x = ${h} ${p > h ? "-" : "+"} ${d} = ${m}$，高度不变。所求点是 $${pt(m, q)}$。

**检验。** 对称轴在两个 $x$ 坐标的正中间：$${m === 0 ? "" : `\\frac{${p} + ${paren(m)}}{2} = `}\\frac{${p + m}}{2} = ${h}$。`,
            ),
          });
        }
        const a = rng.nonZero(-3, 3);
        const h = rng.nonZero(-4, 4);
        const b = -2 * a * h;
        const c = rng.nonZero(-9, 9);
        return pointProblem({
          prompt: t(
            `The graph of $y = ${quad(a, b, c)}$ crosses the $y$-axis at $(0, ${c})$. Find the other point of the graph with $y$-coordinate $${c}$.`,
            `$y = ${quad(a, b, c)}$ 的图象与 $y$ 轴交于 $(0, ${c})$。求图象上 $y$ 坐标为 $${c}$ 的另一点。`,
          ),
          answer: [2 * h, c],
          wrong: [
            [h, c],
            [-2 * h, c],
            [c, 0],
          ],
          solution: t(
            `**Step 1: Find the axis of symmetry.** Here $a = ${a}$ and $b = ${b}$:${steps(axisFormula(a, b))}**Step 2: Mirror the $y$-intercept.** The point $(0, ${c})$ is $${Math.abs(h)}$ to the ${h > 0 ? "left" : "right"} of the axis, so its mirror image is $${Math.abs(h)}$ to the ${h > 0 ? "right" : "left"}, at $x = 2 \\cdot ${paren(h)} = ${2 * h}$. The point is $${pt(2 * h, c)}$.

**Check.** Substitute $x = ${2 * h}$:${steps(`y = ${evaluation(a, b, c, 2 * h)}`)}`,
            `**第一步：求对称轴。** 这里 $a = ${a}$，$b = ${b}$：${steps(axisFormula(a, b))}**第二步：作 $y$ 轴截距的对称点。** 点 $(0, ${c})$ 在对称轴${h > 0 ? "左" : "右"}边 $${Math.abs(h)}$ 个单位，所以对称点在${h > 0 ? "右" : "左"}边 $${Math.abs(h)}$ 个单位，即 $x = 2 \\cdot ${paren(h)} = ${2 * h}$。所求点是 $${pt(2 * h, c)}$。

**检验。** 代入 $x = ${2 * h}$：${steps(`y = ${evaluation(a, b, c, 2 * h)}`)}`,
          ),
        });
      },
    },
  ],
};

/** average writes (r + s)/2 = value for two integers. */
const average = (r: number, s: number) =>
  `\\frac{${r} + ${paren(s)}}{2} = \\frac{${r + s}}{2}${(r + s) % 2 === 0 ? ` = ${(r + s) / 2}` : ""}`;

/** distanceCheck shows that two numbers are the same distance from h, on opposite sides. */
function distanceCheck(r: Coefficient, s: Coefficient, h: Coefficient): Text {
  const [lo, hi] = toQ(r).cmp(toQ(s)) < 0 ? [toQ(r), toQ(s)] : [toQ(s), toQ(r)];
  const d = hi.sub(toQ(h));
  const gap = (x: Q, y: Q) => (y.isZero() ? `${num(x)}` : `${num(x)} - ${wrap(y)} = ${num(d)}`);
  const line = `${gap(hi, toQ(h))} \\qquad ${gap(toQ(h), lo)}`;
  return t(
    `**Check.** Both roots are the same distance from the axis, one on each side:${steps(line)}`,
    `**检验。** 两个零点到对称轴的距离相同，分居两侧：${steps(line)}`,
  );
}

export const theAverageOfTheRootsFormula: TopicDef = {
  id: "the-average-of-the-roots-formula",
  title: t("The Average of the Roots Formula", "根的平均值公式"),
  summary: t(
    "Use the fact that the axis of symmetry lies halfway between the roots to find the axis, the vertex or a missing root.",
    "利用对称轴位于两个零点正中间，求对称轴、顶点或缺少的零点。",
  ),
  prerequisites: ["the-axis-of-symmetry-of-a-parabola", "roots-of-quadratic-functions"],
  encompasses: [{ topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.8.A", "CCSS.HSA.APR.B.3"],
  intro: t(
    `The axis of symmetry of a parabola lies halfway between any two of its points at the same height. The two $x$-intercepts are such a pair: both are at height $0$. So when the roots of a quadratic function are known, its axis of symmetry is simply their **average**, with no formula in $a$ and $b$ needed.

Take $y = (x - 1)(x - 5)$. Its roots are $1$ and $5$, so its axis of symmetry is

$$x = \\frac{1 + 5}{2} = 3.$$

The vertex lies on the axis, so substituting $x = 3$ gives its height: $(3 - 1)(3 - 5) = 2 \\cdot (-2) = -4$. The vertex is $(3, -4)$:

{{figure 0}}

In this lesson we find the axis of symmetry and the vertex from the roots, and the other root from one root and the axis.`,
    `抛物线的对称轴位于它上面任意两个同高点的正中间。与 $x$ 轴的两个交点就是这样一对点：它们的高度都是 $0$。所以知道二次函数的零点时，对称轴就是它们的**平均值**，不需要用含 $a$、$b$ 的公式。

取 $y = (x - 1)(x - 5)$。零点是 $1$ 和 $5$，所以对称轴是

$$x = \\frac{1 + 5}{2} = 3.$$

顶点在对称轴上，所以代入 $x = 3$ 就得到它的高度：$(3 - 1)(3 - 5) = 2 \\cdot (-2) = -4$。顶点是 $(3, -4)$：

{{figure 0}}

这节课我们由零点求对称轴和顶点，并由一个零点和对称轴求另一个零点。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -2, xMax: 8, yMin: -6, yMax: 6 },
      [
        { kind: "curve", f: (x) => (x - 1) * (x - 5), accent: true },
        { kind: "line", a: [3, 0], b: [3, 1], dashed: true, tone: "action" },
        { kind: "point", at: [1, 0], label: "(1, 0)", dir: "nw" },
        { kind: "point", at: [5, 0], label: "(5, 0)", dir: "ne" },
        { kind: "point", at: [3, -4], label: "(3, −4)", dir: "e", tone: "result" },
      ],
      "The parabola y = (x − 1)(x − 5) with roots 1 and 5; the axis of symmetry x = 3 lies halfway between them and passes through the vertex (3, −4).",
      "抛物线 y = (x − 1)(x − 5)，零点是 1 和 5；对称轴 x = 3 在它们正中间，并经过顶点 (3, −4)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "the-axis-from-the-roots",
      figure: algebraDrawings["the-average-of-the-roots-formula#the-axis-from-the-roots"],
      title: t("The axis of symmetry from the roots", "由零点求对称轴"),
      explanation: t(
        `The two $x$-intercepts of a parabola are at the same height, $0$, so they are mirror images across the axis of symmetry. The axis lies halfway between them, at the **average of the roots** $r$ and $s$:

$$x = \\frac{r + s}{2}$$

For $y = 2(x - 5)(x + 1)$ the roots are $5$ and $-1$, since $x + 1 = 0$ at $x = -1$. So the axis is $x = \\frac{5 + (-1)}{2} = 2$: both roots are $3$ from it. The factor $2$ in front changes the shape, not the roots, so it does not change the axis.

> **Watch out.** Add the roots, then **halve** the sum: $5 + (-1) = 4$ gives $x = 2$, not $x = 4$. And read the roots with the right sign: the factor $x + 1$ gives the root $-1$.`,
        `抛物线与 $x$ 轴的两个交点高度相同（都是 $0$），所以它们关于对称轴对称。对称轴位于它们正中间，即两根 $r$、$s$ 的**平均值**处：

$$x = \\frac{r + s}{2}$$

对 $y = 2(x - 5)(x + 1)$，零点是 $5$ 和 $-1$，因为 $x + 1$ 在 $x = -1$ 时为 $0$。所以对称轴是 $x = \\frac{5 + (-1)}{2} = 2$：两个零点到它的距离都是 $3$。前面的因数 $2$ 改变的是形状，不是零点，所以不改变对称轴。

> **注意。** 先把两根相加，再把和**除以 $2$**：$5 + (-1) = 4$ 给出 $x = 2$，不是 $x = 4$。读零点时要用对符号：因式 $x + 1$ 给出零点 $-1$。`,
      ),
      generate(rng) {
        const [r, s] = distinctRoots(rng, 9);
        const a = rng.pick([1, -1, 2, -2, 3, Q.of(1, 2), -4]);
        const h = Q.of(r + s, 2);
        const expanded = rng.bool(0.35) && toQ(a).eq(Q.one);
        const fx = expanded ? quad(1, -(r + s), r * s) : `${front(a)}${factor(r)}${factor(s)}`;
        const roots = expanded
          ? t(
              `**Step 1: Find the roots.** Factor: two numbers with product $${r * s}$ and sum $${-(r + s)}$ are $${-r}$ and $${-s}$, so $y = ${factor(r)}${factor(s)}$, and the roots are $${r}$ and $${s}$.`,
              `**第一步：求零点。** 分解因式：积为 $${r * s}$、和为 $${-(r + s)}$ 的两个数是 $${-r}$ 和 $${-s}$，所以 $y = ${factor(r)}${factor(s)}$，零点是 $${r}$ 和 $${s}$。`,
            )
          : t(
              `**Step 1: Read the roots.** Each factor is $0$ at one root: $${linear(1, -r)} = 0$ at $x = ${r}$ and $${linear(1, -s)} = 0$ at $x = ${s}$.${toQ(a).eq(Q.one) ? "" : ` The factor $${num(a)}$ in front is never $0$.`}`,
              `**第一步：读出零点。** 每个因式在一个零点处为 $0$：$${linear(1, -r)} = 0$ 在 $x = ${r}$，$${linear(1, -s)} = 0$ 在 $x = ${s}$。${toQ(a).eq(Q.one) ? "" : `前面的因数 $${num(a)}$ 不会为 $0$。`}`,
            );
        const check = distanceCheck(r, s, h);
        return numberProblem({
          prompt: t(`Find the axis of symmetry of the graph of $y = ${fx}$.`, `求 $y = ${fx}$ 的图象的对称轴。`),
          answer: h,
          solveFor: "x",
          wrong: [h.neg(), Q.of(r + s), Q.of(r - s, 2)],
          solution: t(
            `${roots.en}

**Step 2: Average the roots.** The roots are mirror images across the axis, so the axis is halfway between them:${steps(`x = ${average(r, s)}`)}${check.en}`,
            `${roots["zh-CN"]}

**第二步：求两根的平均值。** 两个零点关于对称轴对称，所以对称轴在它们正中间：${steps(`x = ${average(r, s)}`)}${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "the-vertex-from-the-roots",
      figure: algebraDrawings["the-average-of-the-roots-formula#the-vertex-from-the-roots"],
      title: t("The vertex from the roots", "由零点求顶点"),
      explanation: t(
        `The vertex lies on the axis of symmetry, and the axis is at the average of the roots. So to find the vertex of $y = a(x - r)(x - s)$, average the roots to get its $x$-coordinate, then substitute that $x$ into the function to get the $y$-coordinate. For $y = 2(x - 5)(x + 1)$:

$$x = \\frac{5 + (-1)}{2} = 2, \\qquad y = 2(2 - 5)(2 + 1) = 2 \\cdot (-3) \\cdot 3 = -18$$

The vertex is $(2, -18)$. It is below the $x$-axis, as it must be: the parabola opens upward and dips between its roots.

> **Watch out.** Substitute the average of the roots, not $x = 0$: $2 \\cdot (0 - 5)(0 + 1) = -10$ is the $y$-intercept, not the vertex. Keep the factor $a$ and the signs: the $y$-coordinate here is $-18$, not $18$.`,
        `顶点在对称轴上，而对称轴在两根的平均值处。所以求 $y = a(x - r)(x - s)$ 的顶点时，先取两根的平均值得到横坐标，再把这个 $x$ 代入函数得到纵坐标。对 $y = 2(x - 5)(x + 1)$：

$$x = \\frac{5 + (-1)}{2} = 2, \\qquad y = 2(2 - 5)(2 + 1) = 2 \\cdot (-3) \\cdot 3 = -18$$

顶点是 $(2, -18)$。它在 $x$ 轴下方，这是必然的：抛物线开口向上，在两个零点之间向下凹。

> **注意。** 代入的是两根的平均值，不是 $x = 0$：$2 \\cdot (0 - 5)(0 + 1) = -10$ 是 $y$ 轴截距，不是顶点。保留因数 $a$ 和符号：这里纵坐标是 $-18$，不是 $18$。`,
      ),
      generate(rng) {
        let r: number;
        let s: number;
        do [r, s] = distinctRoots(rng, 9);
        while ((r + s) % 2 !== 0);
        const a = rng.pick([1, -1, 2, -2, 3, -3]);
        const h = (r + s) / 2;
        const k = a * (h - r) * (h - s);
        const fx = `${front(a)}${factor(r)}${factor(s)}`;
        const at = (v: number, root: number) => `(${v} ${root > 0 ? "-" : "+"} ${Math.abs(root)})`;
        const product = `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${paren(h - r)} \\cdot ${paren(h - s)}`;
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $y = ${fx}$.`, `求抛物线 $y = ${fx}$ 的顶点。`),
          answer: [h, k],
          wrong: [
            [h, -k],
            [-h, k],
            [h, a * r * s],
          ],
          solution: t(
            `**Step 1: Average the roots.** The roots are $${r}$ and $${s}$, and the vertex lies on the axis halfway between them:${steps(`x = ${average(r, s)}`)}**Step 2: Substitute to find the height.** Put $x = ${h}$ into the function:${steps(`y = ${front(a)}${at(h, r)}${at(h, s)} = ${product} = ${k}`)}The vertex is $${pt(h, k)}$.

**Check.** The parabola opens ${a > 0 ? "upward" : "downward"}, since $a = ${a}$ is ${a > 0 ? "positive" : "negative"}, so between its roots it lies ${a > 0 ? "below" : "above"} the $x$-axis, and the vertex must too: $${k}$ is ${a > 0 ? "negative" : "positive"}.`,
            `**第一步：求两根的平均值。** 零点是 $${r}$ 和 $${s}$，顶点在它们正中间的对称轴上：${steps(`x = ${average(r, s)}`)}**第二步：代入求高度。** 把 $x = ${h}$ 代入函数：${steps(`y = ${front(a)}${at(h, r)}${at(h, s)} = ${product} = ${k}`)}顶点是 $${pt(h, k)}$。

**检验。** 因为 $a = ${a}$ 是${a > 0 ? "正" : "负"}数，抛物线开口向${a > 0 ? "上" : "下"}，所以在两个零点之间位于 $x$ 轴${a > 0 ? "下方" : "上方"}，顶点也应如此：$${k}$ 是${a > 0 ? "负" : "正"}数。`,
          ),
        });
      },
    },
    {
      id: "the-other-root",
      title: t("Finding the other root", "求另一个零点"),
      explanation: t(
        `The axis of symmetry is the average of the two roots. So if the axis is $x = h$ and one root is $r$, the other root $s$ satisfies $\\frac{r + s}{2} = h$. Doubling both sides gives $r + s = 2h$, and so

$$s = 2h - r.$$

With axis $x = -1$ and root $3$: $s = 2 \\cdot (-1) - 3 = -5$. The picture agrees: $3$ is $4$ to the right of $-1$, and $-5$ is $4$ to the left.

> **Watch out.** The other root is $2h - r$, not $h - r$, which is only how far apart the axis and the root are, and not $-r$, which would be the mirror image across the $y$-axis.`,
        `对称轴是两根的平均值。所以若对称轴是 $x = h$，一个零点是 $r$，另一个零点 $s$ 满足 $\\frac{r + s}{2} = h$。两边乘以 $2$ 得 $r + s = 2h$，所以

$$s = 2h - r.$$

对称轴 $x = -1$，零点 $3$：$s = 2 \\cdot (-1) - 3 = -5$。图形也印证了这一点：$3$ 在 $-1$ 右边 $4$ 个单位，$-5$ 在左边 $4$ 个单位。

> **注意。** 另一个零点是 $2h - r$，不是 $h - r$（那只是对称轴与零点之间的距离），也不是 $-r$（那是关于 $y$ 轴的对称点）。`,
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        let r: number;
        do r = rng.int(-10, 10);
        while (r === h);
        const s = 2 * h - r;
        const solveS =
          r === 0
            ? t(`Double both sides:${steps(`s = ${2 * h}`)}`, `两边乘以 $2$：${steps(`s = ${2 * h}`)}`)
            : t(
                `Double both sides, then ${r > 0 ? `subtract $${r}$` : `add $${-r}$`}:${steps(`${r} + s = ${2 * h}`, `s = ${2 * h} ${r > 0 ? "-" : "+"} ${Math.abs(r)} = ${s}`)}`,
                `两边乘以 $2$，再${r > 0 ? `减去 $${r}$` : `加上 $${-r}$`}：${steps(`${r} + s = ${2 * h}`, `s = ${2 * h} ${r > 0 ? "-" : "+"} ${Math.abs(r)} = ${s}`)}`,
              );
        return numberProblem({
          prompt: t(
            `A parabola has axis of symmetry $x = ${h}$ and crosses the $x$-axis at $(${r}, 0)$. At what other value of $x$ does it cross the $x$-axis?`,
            `一条抛物线的对称轴是 $x = ${h}$，且与 $x$ 轴交于 $(${r}, 0)$。它还在 $x$ 取何值处与 $x$ 轴相交？`,
          ),
          answer: s,
          solveFor: "x",
          wrong: [-r, h - r, r - 2 * h, 2 * h + r],
          solution: t(
            `**Step 1: Write the average.** The axis is the average of the two roots, $${r}$ and the unknown $s$:${steps(`\\frac{${r} + s}{2} = ${h}`)}**Step 2: Solve for $s$.** ${solveS.en}So the parabola also crosses the $x$-axis at $x = ${s}$.

${distanceCheck(r, s, h).en}`,
            `**第一步：写出平均值。** 对称轴是两根 $${r}$ 与未知的 $s$ 的平均值：${steps(`\\frac{${r} + s}{2} = ${h}`)}**第二步：解出 $s$。** ${solveS["zh-CN"]}所以抛物线还在 $x = ${s}$ 处与 $x$ 轴相交。

${distanceCheck(r, s, h)["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** atVertex writes a(h − h)² + k = k, the value of a vertex form at its own vertex. */
const atVertex = (a: Coefficient, h: number, k: number) => `${front(a)}(${h} - ${paren(h)})^{2}${tail(k)} = ${k}`;

export const theVertexFormOfAParabola: TopicDef = {
  id: "the-vertex-form-of-a-parabola",
  title: t("The Vertex Form of a Parabola", "抛物线的顶点式"),
  summary: t(
    "Read the vertex, the axis of symmetry and the extreme value from $y = a(x - h)^{2} + k$, and expand it to standard form.",
    "从 $y = a(x - h)^{2} + k$ 读出顶点、对称轴和最值，并把它展开成一般式。",
  ),
  prerequisites: ["the-axis-of-symmetry-of-a-parabola", "squaring-binomials"],
  encompasses: [{ topic: "squaring-binomials", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.C.8.A", "CCSS.HSF.BF.B.3"],
  intro: t(
    `So far the vertex of $y = ax^{2} + bx + c$ took two steps: find the axis $x = -\\frac{b}{2a}$, then substitute it to get the height. A quadratic function can also be written so that the vertex can simply be **read off**. This is the **vertex form**

$$y = a(x - h)^{2} + k$$

Take $y = 2(x - 3)^{2} + 1$. A square is never negative, and $(x - 3)^{2}$ is $0$ only at $x = 3$. So $y$ is smallest at $x = 3$, where $y = 2 \\cdot 0 + 1 = 1$, and the vertex is $(3, 1)$. Squaring out gives $y = 2x^{2} - 12x + 19$, and indeed $-\\frac{-12}{2 \\cdot 2} = 3$:

{{figure 0}}

In this lesson we read the vertex and the extreme value from vertex form, and expand vertex form to standard form.`,
    `到目前为止，求 $y = ax^{2} + bx + c$ 的顶点要两步：先求对称轴 $x = -\\frac{b}{2a}$，再代入求高度。二次函数还可以写成另一种样子，让顶点可以直接**读出来**。这就是**顶点式**

$$y = a(x - h)^{2} + k$$

取 $y = 2(x - 3)^{2} + 1$。平方永远不是负数，而 $(x - 3)^{2}$ 只在 $x = 3$ 时为 $0$。所以 $y$ 在 $x = 3$ 处最小，此时 $y = 2 \\cdot 0 + 1 = 1$，顶点是 $(3, 1)$。把平方展开得 $y = 2x^{2} - 12x + 19$，果然 $-\\frac{-12}{2 \\cdot 2} = 3$：

{{figure 0}}

这节课我们从顶点式读出顶点和最值，并把顶点式展开成一般式。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -1, xMax: 7, yMin: -2, yMax: 10 },
      [
        { kind: "curve", f: (x) => 2 * (x - 3) ** 2 + 1, accent: true },
        { kind: "line", a: [3, 0], b: [3, 1], dashed: true, tone: "action" },
        { kind: "point", at: [3, 1], label: "(3, 1)", dir: "e", tone: "result" },
      ],
      "The parabola y = 2(x − 3)² + 1 with its vertex (3, 1) and its axis of symmetry x = 3.",
      "抛物线 y = 2(x − 3)² + 1，顶点 (3, 1)，对称轴 x = 3。",
    ),
  ],
  knowledgePoints: [
    {
      id: "reading-the-vertex",
      figure: algebraDrawings["the-vertex-form-of-a-parabola#reading-the-vertex"],
      title: t("Reading the vertex", "读出顶点"),
      explanation: t(
        `A quadratic function in **vertex form** is

$$y = a(x - h)^{2} + k$$

The square $(x - h)^{2}$ is $0$ at $x = h$ and positive everywhere else, so the turning point of the graph is at $x = h$, where $y = k$. The graph is the parabola $y = ax^{2}$ moved so that its vertex is at $(h, k)$, and the axis of symmetry is $x = h$.

To read $h$, first make the signs match the form. $y = 3(x + 2)^{2} - 5$ is $3(x - (-2))^{2} + (-5)$, so $h = -2$, $k = -5$, and the vertex is $(-2, -5)$.

> **Watch out.** The form has a **minus** inside the parentheses, so $h$ has the opposite sign of the number you see: $(x + 2)^{2}$ gives $h = -2$, not $2$. The number outside keeps its sign, and the point is written $(h, k)$: the $x$-value first.`,
        `**顶点式**的二次函数是

$$y = a(x - h)^{2} + k$$

平方 $(x - h)^{2}$ 在 $x = h$ 时为 $0$，在其他地方都是正数，所以图象的转折点在 $x = h$ 处，此时 $y = k$。它的图象是把抛物线 $y = ax^{2}$ 平移，使顶点位于 $(h, k)$；对称轴是 $x = h$。

读 $h$ 之前，先把符号写成与形式一致。$y = 3(x + 2)^{2} - 5$ 即 $3(x - (-2))^{2} + (-5)$，所以 $h = -2$，$k = -5$，顶点是 $(-2, -5)$。

> **注意。** 形式中括号里是**减号**，所以 $h$ 与看到的数符号相反：$(x + 2)^{2}$ 给出 $h = -2$，不是 $2$。括号外的数保持原来的符号；点写成 $(h, k)$，$x$ 值在前。`,
      ),
      generate(rng) {
        const a = rng.pick(signedAs);
        const h = rng.nonZero(-9, 9);
        const k = rng.nonZero(-12, 12);
        const up = a.sign() > 0;
        return pointProblem({
          prompt: t(`Find the vertex of the parabola $y = ${vertexForm(a, h, k)}$.`, `求抛物线 $y = ${vertexForm(a, h, k)}$ 的顶点。`),
          answer: [h, k],
          wrong: [
            [-h, k],
            [h, -k],
            [-h, -k],
            [k, h],
          ],
          solution: t(
            `**Step 1: Match the form $y = a(x - h)^{2} + k$.** ${h < 0 || k < 0 ? `Write the signs as the form has them, a minus inside and a plus outside: $y = ${front(a)}(x - ${paren(h)})^{2} + ${paren(k)}$.` : "The equation already has a minus inside the parentheses and a plus outside, as the form does."}

**Step 2: Read $h$ and $k$.** The number subtracted from $x$ is $h = ${h}$, and the number added is $k = ${k}$. So the vertex is $${pt(h, k)}$.

**Check.** At $x = ${h}$ the square is $0$:${steps(`y = ${atVertex(a, h, k)}`)}For any other $x$ the square is positive and makes $y$ ${up ? "larger" : "smaller"}, so $${pt(h, k)}$ is the turning point.`,
            `**第一步：对照形式 $y = a(x - h)^{2} + k$。** ${h < 0 || k < 0 ? `按形式写出符号，括号里是减号，括号外是加号：$y = ${front(a)}(x - ${paren(h)})^{2} + ${paren(k)}$。` : "方程括号里已经是减号，括号外是加号，与形式一致。"}

**第二步：读出 $h$ 和 $k$。** 从 $x$ 中减去的数是 $h = ${h}$，加上的数是 $k = ${k}$。所以顶点是 $${pt(h, k)}$。

**检验。** 在 $x = ${h}$ 处平方为 $0$：${steps(`y = ${atVertex(a, h, k)}`)}对其他任何 $x$，平方都是正数，使 $y$ 变${up ? "大" : "小"}，所以 $${pt(h, k)}$ 是转折点。`,
          ),
        });
      },
    },
    {
      id: "maximum-and-minimum-values",
      title: t("Maximum and minimum values", "最大值与最小值"),
      explanation: t(
        `Since $(x - h)^{2} \\ge 0$, with equality only at $x = h$:

- if $a > 0$, then $a(x - h)^{2} \\ge 0$ and $y \\ge k$: the function has a **minimum value** $k$, at $x = h$;
- if $a < 0$, then $a(x - h)^{2} \\le 0$ and $y \\le k$: the function has a **maximum value** $k$, at $x = h$.

For $f(x) = -2(x - 3)^{2} + 7$, $a = -2$ is negative, so the parabola opens downward. The maximum value is $7$, reached at $x = 3$; one step away, $f(4) = -2 + 7 = 5$ is lower.

> **Watch out.** The extreme value is $k$, a $y$-value; $h$ only tells **where** it occurs. And the sign of $a$ decides which kind it is: a positive $a$ gives a minimum, a negative $a$ a maximum.`,
        `因为 $(x - h)^{2} \\ge 0$，且只在 $x = h$ 时取等号：

- 若 $a > 0$，则 $a(x - h)^{2} \\ge 0$，$y \\ge k$：函数有**最小值** $k$，在 $x = h$ 处取得；
- 若 $a < 0$，则 $a(x - h)^{2} \\le 0$，$y \\le k$：函数有**最大值** $k$，在 $x = h$ 处取得。

对 $f(x) = -2(x - 3)^{2} + 7$，$a = -2$ 是负数，抛物线开口向下。最大值是 $7$，在 $x = 3$ 处取得；往旁边走一步，$f(4) = -2 + 7 = 5$ 更低。

> **注意。** 最值是 $k$，是一个 $y$ 值；$h$ 只说明在**哪里**取得。最值的种类由 $a$ 的符号决定：$a$ 为正是最小值，$a$ 为负是最大值。`,
      ),
      generate(rng) {
        const a = rng.pick(signedAs);
        let h: number;
        let k: number;
        do {
          h = rng.nonZero(-9, 9);
          k = rng.int(-12, 12);
        } while (h === k || h === -k);
        const up = a.sign() > 0;
        const options = [
          t(`A minimum value of $${k}$`, `最小值 $${k}$`),
          t(`A maximum value of $${k}$`, `最大值 $${k}$`),
          t(`A minimum value of $${h}$`, `最小值 $${h}$`),
          t(`A maximum value of $${h}$`, `最大值 $${h}$`),
          t(`A minimum value of $${-h}$`, `最小值 $${-h}$`),
          t(`A maximum value of $${-h}$`, `最大值 $${-h}$`),
        ];
        const order = rng.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4);
        if (!order.includes(up ? 0 : 1)) order[0] = up ? 0 : 1;
        const shown = rng.shuffle(order);
        const next = num(a.add(Q.of(k)));
        return choiceProblem({
          prompt: t(
            `Which describes the function $f(x) = ${vertexForm(a, h, k)}$?`,
            `关于函数 $f(x) = ${vertexForm(a, h, k)}$，下列哪项正确？`,
          ),
          options: shown.map((i) => options[i]!),
          correct: shown.indexOf(up ? 0 : 1),
          solution: t(
            `**Step 1: Read the direction.** Here $a = ${num(a)}$ is ${up ? "positive, so the parabola opens upward" : "negative, so the parabola opens downward"} and the vertex $${pt(h, k)}$ is its ${up ? "lowest" : "highest"} point.

**Step 2: Read the extreme value.** Since $${sq(h)} \\ge 0$, ${up ? `$f(x) \\ge ${k}$` : `$f(x) \\le ${k}$`}, with equality at $x = ${h}$. The ${up ? "minimum" : "maximum"} value is the $y$-value $${k}$, not $${h}$.

**Check.** At the vertex, $f(${h}) = ${atVertex(a, h, k)}$. One step away, $f(${h + 1}) = ${next}$, which is ${up ? "greater" : "less"} than $${k}$, as a ${up ? "minimum" : "maximum"} requires.`,
            `**第一步：看开口方向。** 这里 $a = ${num(a)}$ 是${up ? "正数，抛物线开口向上" : "负数，抛物线开口向下"}，顶点 $${pt(h, k)}$ 是最${up ? "低" : "高"}点。

**第二步：读出最值。** 因为 $${sq(h)} \\ge 0$，${up ? `$f(x) \\ge ${k}$` : `$f(x) \\le ${k}$`}，在 $x = ${h}$ 处取等号。${up ? "最小值" : "最大值"}是 $y$ 值 $${k}$，不是 $${h}$。

**检验。** 在顶点处，$f(${h}) = ${atVertex(a, h, k)}$。往旁边走一步，$f(${h + 1}) = ${next}$，比 $${k}$ ${up ? "大" : "小"}，符合${up ? "最小值" : "最大值"}的要求。`,
          ),
        });
      },
    },
    {
      id: "expanding-vertex-form",
      figure: algebraDrawings["the-vertex-form-of-a-parabola#expanding-vertex-form"],
      title: t("From vertex form to standard form", "由顶点式化为一般式"),
      explanation: t(
        `Vertex form and standard form describe the same function, so either can be turned into the other. To go from $y = a(x - h)^{2} + k$ to standard form, square the binomial with $(x - h)^{2} = x^{2} - 2hx + h^{2}$, distribute $a$, and add $k$:

$$y = 2(x - 3)^{2} + 1 = 2(x^{2} - 6x + 9) + 1 = 2x^{2} - 12x + 18 + 1 = 2x^{2} - 12x + 19$$

The two forms must agree at the vertex: $2 \\cdot 3^{2} - 12 \\cdot 3 + 19 = 18 - 36 + 19 = 1$, which is $k$.

> **Watch out.** Multiply **every** term of the square by $a$, including the constant: $2 \\cdot 9 = 18$, so the constant is $18 + 1 = 19$, not $9 + 1$. And the middle term of $(x - 3)^{2}$ is $-6x$: the sign comes from the minus in the parentheses.`,
        `顶点式和一般式描述的是同一个函数，所以可以互相转化。要把 $y = a(x - h)^{2} + k$ 化成一般式，用 $(x - h)^{2} = x^{2} - 2hx + h^{2}$ 把二项式平方，再乘以 $a$，最后加上 $k$：

$$y = 2(x - 3)^{2} + 1 = 2(x^{2} - 6x + 9) + 1 = 2x^{2} - 12x + 18 + 1 = 2x^{2} - 12x + 19$$

两种形式在顶点处的值必须相同：$2 \\cdot 3^{2} - 12 \\cdot 3 + 19 = 18 - 36 + 19 = 1$，正是 $k$。

> **注意。** 平方展开后的**每一项**都要乘以 $a$，包括常数：$2 \\cdot 9 = 18$，所以常数项是 $18 + 1 = 19$，不是 $9 + 1$。$(x - 3)^{2}$ 的中间项是 $-6x$：符号来自括号里的减号。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const h = rng.nonZero(-7, 7);
        const k = rng.int(-12, 12);
        const b = -2 * a * h;
        const c = a * h * h + k;
        const squared = `${sq(h)} = ${quad(1, -2 * h, h * h)}`;
        const distributed = `y = ${front(a)}(${quad(1, -2 * h, h * h)})${tail(k)} = ${quad(a, b, a * h * h)}${tail(k)}`;
        const en = [
          `**Step 1: Square the binomial.**${steps(squared)}`,
          a === 1
            ? `**Step 2: Drop the parentheses.** With $a = 1$ the terms stay as they are:${steps(`y = ${quad(1, b, h * h)}${tail(k)}`)}`
            : `**Step 2: Distribute $${a}$.** Multiply every term in the parentheses by $${a}$, the constant too:${steps(distributed)}`,
        ];
        const zh = [
          `**第一步：把二项式平方。**${steps(squared)}`,
          a === 1
            ? `**第二步：去括号。** $a = 1$，各项保持不变：${steps(`y = ${quad(1, b, h * h)}${tail(k)}`)}`
            : `**第二步：乘以 $${a}$。** 括号里的每一项都乘以 $${a}$，常数项也要乘：${steps(distributed)}`,
        ];
        if (k !== 0) {
          en.push(`**Step 3: Combine the constants.** $${a * h * h}${tail(k)} = ${c}$, so${steps(`y = ${quad(a, b, c)}`)}`);
          zh.push(`**第三步：合并常数项。** $${a * h * h}${tail(k)} = ${c}$，所以${steps(`y = ${quad(a, b, c)}`)}`);
        }
        const check = evaluation(a, b, c, h);
        return expressionProblem({
          prompt: t(
            `Write $y = ${vertexForm(a, h, k)}$ in the form $y = ax^{2} + bx + c$.`,
            `把 $y = ${vertexForm(a, h, k)}$ 写成 $y = ax^{2} + bx + c$ 的形式。`,
          ),
          answer: quad(a, b, c),
          simplified: true,
          prefix: "y =",
          wrong: [quad(a, -b, c), quad(a, b, h * h + k), quad(a, -2 * h, a * h * h + k), quad(a, 0, c), quad(a, b, a * h * h - k)],
          solution: t(
            `${en.join("")}**Check.** At the vertex $x = ${h}$ the vertex form gives $${k}$, and so does the answer:${steps(check)}`,
            `${zh.join("")}**检验。** 在顶点 $x = ${h}$ 处，顶点式的值是 $${k}$，答案的值也是：${steps(check)}`,
          ),
        });
      },
    },
  ],
};

export const writingTheEquationOfAParabolaInVertexForm: TopicDef = {
  id: "writing-the-equation-of-a-parabola-in-vertex-form",
  title: t("Writing the Equation of a Parabola in Vertex Form", "把抛物线的方程写成顶点式"),
  summary: t(
    "Complete the square to put $y = ax^{2} + bx + c$ in vertex form, and write the equation of a parabola from its vertex and one more point.",
    "用配方法把 $y = ax^{2} + bx + c$ 化为顶点式，并由顶点和另一点写出抛物线的方程。",
  ),
  prerequisites: ["the-vertex-form-of-a-parabola", "completing-the-square-with-leading-coefficients"],
  encompasses: [{ topic: "the-vertex-form-of-a-parabola", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.8.A"],
  intro: t(
    `Vertex form $y = a(x - h)^{2} + k$ shows the vertex at a glance, and we can already expand it to standard form. Now we go the other way. Completing the square turns $x^{2} + bx + c$ into a perfect square plus a constant, and that is exactly vertex form.

Take $y = x^{2} - 6x + 11$. Half of $-6$ is $-3$, and $(-3)^{2} = 9$. Adding and subtracting $9$ changes nothing, but it makes a perfect square:

$$y = (x^{2} - 6x + 9) - 9 + 11 = (x - 3)^{2} + 2$$

Now the vertex $(3, 2)$ can be read off:

{{figure 0}}

In this lesson we complete the square to reach vertex form, with and without a leading coefficient, and we write the equation of a parabola from its vertex and one more point.`,
    `顶点式 $y = a(x - h)^{2} + k$ 一眼就能看出顶点，我们也已经会把它展开成一般式。现在反过来。配方能把 $x^{2} + bx + c$ 化成一个完全平方加一个常数，这正是顶点式。

取 $y = x^{2} - 6x + 11$。$-6$ 的一半是 $-3$，$(-3)^{2} = 9$。加上再减去 $9$ 不改变式子，却凑出了完全平方：

$$y = (x^{2} - 6x + 9) - 9 + 11 = (x - 3)^{2} + 2$$

现在可以直接读出顶点 $(3, 2)$：

{{figure 0}}

这节课我们用配方化成顶点式，包括二次项系数不为 1 的情形，并由顶点和另一点写出抛物线的方程。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -1, xMax: 7, yMin: -1, yMax: 12 },
      [
        { kind: "curve", f: (x) => x * x - 6 * x + 11, accent: true },
        { kind: "line", a: [3, 0], b: [3, 1], dashed: true, tone: "action" },
        { kind: "point", at: [3, 2], label: "(3, 2)", dir: "e", tone: "result" },
        { kind: "point", at: [0, 11], label: "(0, 11)", dir: "e" },
      ],
      "The parabola y = x² − 6x + 11 = (x − 3)² + 2 with its vertex (3, 2) and y-intercept (0, 11).",
      "抛物线 y = x² − 6x + 11 = (x − 3)² + 2，顶点 (3, 2)，与 y 轴交于 (0, 11)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "completing-the-square",
      figure: algebraDrawings["writing-the-equation-of-a-parabola-in-vertex-form#completing-the-square"],
      title: t("Completing the square", "配方"),
      explanation: t(
        `Since $(x - h)^{2} = x^{2} - 2hx + h^{2}$, the $x$-term of a perfect square is $-2h$ times $x$. So for $y = x^{2} + bx + c$, half of $b$ is $-h$, and its square is the constant the perfect square needs. Add and subtract it, so the value does not change:

$$y = x^{2} - 6x + 11 = (x^{2} - 6x + 9) - 9 + 11 = (x - 3)^{2} + 2$$

Half of $b = -6$ is $-3$, which gives $(x - 3)^{2}$. So $h = 3$, $k = 2$, and the vertex is $(3, 2)$.

> **Watch out.** The $9$ added to make the square must also be **subtracted**: $k = 11 - 9 = 2$, not $11 + 9$. And $(x - 3)^{2}$ gives $h = 3$: half of $b$ is $-h$, not $h$.`,
        `因为 $(x - h)^{2} = x^{2} - 2hx + h^{2}$，完全平方的一次项系数是 $-2h$。所以对 $y = x^{2} + bx + c$，$b$ 的一半就是 $-h$，它的平方就是完全平方需要的常数。加上它再减去它，式子的值不变：

$$y = x^{2} - 6x + 11 = (x^{2} - 6x + 9) - 9 + 11 = (x - 3)^{2} + 2$$

$b = -6$ 的一半是 $-3$，得到 $(x - 3)^{2}$。所以 $h = 3$，$k = 2$，顶点是 $(3, 2)$。

> **注意。** 为凑平方加上的 $9$ 还必须**减去**：$k = 11 - 9 = 2$，不是 $11 + 9$。$(x - 3)^{2}$ 给出 $h = 3$：$b$ 的一半是 $-h$，不是 $h$。`,
      ),
      generate(rng) {
        const h = rng.nonZero(-8, 8);
        const k = rng.int(-12, 12);
        const b = -2 * h;
        const c = h * h + k;
        const square = steps(`y = (${quad(1, b, h * h)}) - ${h * h}${tail(c)}`, `y = ${vertexForm(1, h, k)}`);
        const back = steps(chain(vertexForm(1, h, k), `${quad(1, b, h * h)}${tail(k)}`, quad(1, b, c)));
        const left =
          c === 0
            ? t(`the constant left is $${k}$`, `剩下的常数是 $${k}$`)
            : t(`$-${h * h}${tail(c)} = ${k}$`, ` $-${h * h}${tail(c)} = ${k}$`);
        return pointProblem({
          prompt: t(
            `Write $y = ${quad(1, b, c)}$ in the form $y = (x - h)^{2} + k$. Give $(h, k)$.`,
            `把 $y = ${quad(1, b, c)}$ 写成 $y = (x - h)^{2} + k$ 的形式，写出 $(h, k)$。`,
          ),
          answer: [h, k],
          vars: ["h", "k"],
          wrong: [
            [-h, k],
            [h, c + h * h],
            [b, c],
          ],
          solution: t(
            `**Step 1: Halve $b$ and square it.** Half of $${b}$ is $${-h}$, and $${paren(-h)}^{2} = ${h * h}$.

**Step 2: Add and subtract $${h * h}$.** The first three terms form the perfect square, and ${left.en}:${square}**Step 3: Read $h$ and $k$.** The square is $${sq(h)}$, so $h = ${h}$, and $k = ${k}$: $(h, k) = ${pt(h, k)}$.

**Check.** Expanding the vertex form gives back the original equation:${back}`,
            `**第一步：取 $b$ 的一半再平方。** $${b}$ 的一半是 $${-h}$，$${paren(-h)}^{2} = ${h * h}$。

**第二步：加上再减去 $${h * h}$。** 前三项构成完全平方，而${left["zh-CN"]}：${square}**第三步：读出 $h$ 和 $k$。** 平方是 $${sq(h)}$，所以 $h = ${h}$，$k = ${k}$：$(h, k) = ${pt(h, k)}$。

**检验。** 把顶点式展开，得到原来的方程：${back}`,
          ),
        });
      },
    },
    {
      id: "with-a-leading-coefficient",
      figure: algebraDrawings["writing-the-equation-of-a-parabola-in-vertex-form#with-a-leading-coefficient"],
      title: t("With a leading coefficient", "二次项系数不为 1"),
      explanation: t(
        `When $a \\ne 1$, the square is completed inside parentheses. Factor $a$ out of the $x$-terms only, and complete the square inside. A number added inside the parentheses is multiplied by $a$, so outside subtract $a$ times it:

$$y = 2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9) - 2 \\cdot 9 + 5 = 2(x + 3)^{2} - 13$$

Adding $9$ inside added $2 \\cdot 9 = 18$ to $y$, so $18$ comes off outside. The vertex is $(-3, -13)$.

> **Watch out.** Subtract $a$ **times** the square, not the square alone: here $2 \\cdot 9 = 18$, not $9$. When $a$ is negative, the number added inside lowers $y$, so it is added back outside.`,
        `当 $a \\ne 1$ 时，在括号里配方。只从含 $x$ 的项中提出 $a$，在括号内配方。括号里加上的数会被乘以 $a$，所以括号外要减去它的 $a$ 倍：

$$y = 2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9) - 2 \\cdot 9 + 5 = 2(x + 3)^{2} - 13$$

括号里加 $9$，使 $y$ 增加了 $2 \\cdot 9 = 18$，所以括号外减去 $18$。顶点是 $(-3, -13)$。

> **注意。** 减去的是平方的 $a$ **倍**，不是平方本身：这里是 $2 \\cdot 9 = 18$，不是 $9$。当 $a$ 为负数时，括号里加的数使 $y$ 变小，所以括号外要加回来。`,
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-12, 12);
        const b = -2 * a * h;
        const c = a * h * h + k;
        const added = a * h * h;
        const fix = `${added > 0 ? "-" : "+"} ${Math.abs(added)}`;
        const work = steps(
          `y = ${front(a)}(${quad(1, -2 * h, 0)})${tail(c)}`,
          `y = ${front(a)}(${quad(1, -2 * h, h * h)}) ${fix}${tail(c)}`,
          `y = ${vertexForm(a, h, k)}`,
        );
        const back = steps(chain(vertexForm(a, h, k), `${quad(a, b, added)}${tail(k)}`, quad(a, b, c)));
        const scaled = a === -1 ? `$-${h * h}$` : `$${a} \\cdot ${h * h} = ${added}$`;
        return pointProblem({
          prompt: t(
            `Write $y = ${quad(a, b, c)}$ in the form $y = a(x - h)^{2} + k$. Give $(h, k)$.`,
            `把 $y = ${quad(a, b, c)}$ 写成 $y = a(x - h)^{2} + k$ 的形式，写出 $(h, k)$。`,
          ),
          answer: [h, k],
          vars: ["h", "k"],
          wrong: [
            [-h, k],
            [h, c - h * h],
            [h, c + a * h * h],
          ],
          solution: t(
            `**Step 1: Factor $${a}$ out of the $x$-terms.** Inside the parentheses the $x$-term is $${-2 * h}x$; half of $${-2 * h}$ is $${-h}$, and $${paren(-h)}^{2} = ${h * h}$.

**Step 2: Complete the square inside.** Adding $${h * h}$ inside the parentheses adds ${scaled} to $y$, so ${added > 0 ? `subtract $${added}$` : `add $${-added}$`} outside. ${c === 0 ? `The constant left is $${k}$` : `Then $${-added}${tail(c)} = ${k}$`}:${work}**Step 3: Read $h$ and $k$.** The square is $${sq(h)}$, so $h = ${h}$, and $k = ${k}$: $(h, k) = ${pt(h, k)}$.

**Check.** Expanding the vertex form gives back the original equation:${back}`,
            `**第一步：从含 $x$ 的项中提出 $${a}$。** 括号里的一次项是 $${-2 * h}x$；$${-2 * h}$ 的一半是 $${-h}$，$${paren(-h)}^{2} = ${h * h}$。

**第二步：在括号里配方。** 括号里加 $${h * h}$，使 $y$ 增加了 ${scaled}，所以括号外${added > 0 ? `减去 $${added}$` : `加上 $${-added}$`}。${c === 0 ? `剩下的常数是 $${k}$` : `于是 $${-added}${tail(c)} = ${k}$`}：${work}**第三步：读出 $h$ 和 $k$。** 平方是 $${sq(h)}$，所以 $h = ${h}$，$k = ${k}$：$(h, k) = ${pt(h, k)}$。

**检验。** 把顶点式展开，得到原来的方程：${back}`,
          ),
        });
      },
    },
    {
      id: "from-the-vertex-and-a-point",
      figure: algebraDrawings["writing-the-equation-of-a-parabola-in-vertex-form#from-the-vertex-and-a-point"],
      title: t("From the vertex and a point", "由顶点和一点求方程"),
      explanation: t(
        `The vertex fixes $h$ and $k$, but not $a$: every parabola $y = a(x - h)^{2} + k$ has the same vertex $(h, k)$, wide or narrow, up or down. One more point of the parabola picks out the right $a$. Substitute it and solve for $a$. With vertex $(1, -4)$ and the point $(3, 4)$:

$$4 = a(3 - 1)^{2} - 4 \\Rightarrow 4 = 4a - 4 \\Rightarrow 8 = 4a \\Rightarrow a = 2$$

so $y = 2(x - 1)^{2} - 4$.

> **Watch out.** Move $k$ to the other side **before** dividing: $4 + 4 = 8$, then $a = 8 \\div 4 = 2$. Dividing $4$ by $4$ straight away gives $a = 1$, a parabola that misses the point.`,
        `顶点确定了 $h$ 和 $k$，却不确定 $a$：所有抛物线 $y = a(x - h)^{2} + k$，无论宽窄、开口朝上还是朝下，顶点都是 $(h, k)$。抛物线上再多一个点，才能定出 $a$。代入这个点，解出 $a$。顶点 $(1, -4)$，经过点 $(3, 4)$：

$$4 = a(3 - 1)^{2} - 4 \\Rightarrow 4 = 4a - 4 \\Rightarrow 8 = 4a \\Rightarrow a = 2$$

所以 $y = 2(x - 1)^{2} - 4$。

> **注意。** 除以系数**之前**先把 $k$ 移到另一边：$4 + 4 = 8$，再 $a = 8 \\div 4 = 2$。直接用 $4$ 除以 $4$ 会得到 $a = 1$，这条抛物线不经过该点。`,
      ),
      generate(rng) {
        let a: Q;
        let h: number;
        let k: number;
        let d: number;
        const graph = rng.bool(0.4);
        do {
          a = rng.pick(graph ? [Q.one, Q.of(-1), Q.of(2), Q.of(-2), Q.of(1, 2), Q.of(-1, 2)] : signedAs.slice(0, 10));
          h = graph ? rng.int(-4, 4) : rng.nonZero(-7, 7);
          k = graph ? (a.sign() > 0 ? rng.int(-5, 1) : rng.int(-1, 5)) : rng.int(-10, 10);
          d = rng.nonZero(-3, 3);
        } while (!a.mul(Q.of(d * d)).isInteger() || (graph && (Math.abs(h + d) > 5 || Math.abs(k + a.toNumber() * d * d) > 5)));
        const p = h + d;
        const q = a.mul(Q.of(d * d)).add(Q.of(k));
        const forgotK = q.div(Q.of(d * d));
        const answer = vertexForm(a, h, k);
        const inner = h === 0 ? `${paren(p)}^{2}` : `(${p} - ${paren(h)})^{2}`;
        const dd = d * d;
        const moved = q.sub(Q.of(k));
        const substitute = steps(
          `${num(q)} = a${h === 0 ? " \\cdot " : ""}${inner}${tail(k)}`,
          `${num(q)} = ${dd === 1 ? "" : dd}a${tail(k)}`,
        );
        const solveLines = [
          ...(k === 0 ? [] : [`${num(moved)} = ${dd === 1 ? "" : dd}a`]),
          ...(dd === 1 ? [] : [`a = \\frac{${num(moved)}}{${dd}} = ${num(a)}`]),
        ];
        const solve = solveLines.length > 0 ? steps(...solveLines) : "";
        const aTimes = a.eq(Q.one) ? "" : a.eq(Q.of(-1)) ? "-" : `${num(a)} \\cdot `;
        const check = steps(chain(`${aTimes}${inner}${tail(k)}`, `${aTimes}${dd}${tail(k)}`, num(q)));
        const move =
          k === 0
            ? dd === 1
              ? t(`The equation already says $a = ${num(a)}$. `, `方程已经给出 $a = ${num(a)}$。`)
              : t(`There is no constant to move; divide by $${dd}$:`, `没有常数需要移项，两边除以 $${dd}$：`)
            : k > 0
              ? t(
                  `Subtract $${k}$ from both sides${dd === 1 ? "" : `, then divide by $${dd}$`}:`,
                  `两边同时减去 $${k}$${dd === 1 ? "" : `，再除以 $${dd}$`}：`,
                )
              : t(
                  `Add $${-k}$ to both sides${dd === 1 ? "" : `, then divide by $${dd}$`}:`,
                  `两边同时加上 $${-k}$${dd === 1 ? "" : `，再除以 $${dd}$`}：`,
                );
        const problem = expressionProblem({
          prompt: graph
            ? t(
                "The vertex of the parabola and one more point of it are marked. Write its equation in vertex form.",
                "图中标出了抛物线的顶点和另一点。写出它的顶点式方程。",
              )
            : t(
                `A parabola has vertex $${pt(h, k)}$ and passes through $${pt(p, q)}$. Write its equation in vertex form.`,
                `一条抛物线的顶点是 $${pt(h, k)}$，且经过 $${pt(p, q)}$。写出它的顶点式方程。`,
              ),
          answer,
          prefix: "y =",
          wrong: [vertexForm(a, -h, k), vertexForm(a, h, -k), vertexForm(forgotK, h, k), vertexForm(a.neg(), h, k)],
          solution: t(
            `**Step 1: Write the form with the vertex.** ${graph ? `The vertex is $${pt(h, k)}$ and the other point is $${pt(p, q)}$. ` : ""}With $h = ${h}$ and $k = ${k}$ the equation is $y = a${sq(h)}${tail(k)}$, with $a$ still unknown.

**Step 2: Substitute the point $${pt(p, q)}$.** Put $x = ${p}$ and $y = ${num(q)}$:${substitute}**Step 3: Solve for $a$.** ${move.en}${solve}So $y = ${answer}$.

**Check.** The point $${pt(p, q)}$ lies on the parabola:${check}`,
            `**第一步：用顶点写出形式。** ${graph ? `顶点是 $${pt(h, k)}$，另一点是 $${pt(p, q)}$。` : ""}$h = ${h}$，$k = ${k}$，方程是 $y = a${sq(h)}${tail(k)}$，$a$ 待定。

**第二步：代入点 $${pt(p, q)}$。** 令 $x = ${p}$，$y = ${num(q)}$：${substitute}**第三步：解出 $a$。** ${move["zh-CN"]}${solve}所以 $y = ${answer}$。

**检验。** 点 $${pt(p, q)}$ 在抛物线上：${check}`,
          ),
        });
        if (!graph) return problem;
        return {
          ...problem,
          figure: parabolaFigure(
            a,
            h,
            k,
            [
              { kind: "point", at: [h, k] },
              { kind: "point", at: [p, q.toNumber()] },
            ],
            view,
            t(`The marked points are (${h}, ${k}) and (${p}, ${num(q)}).`, `标出的点是 (${h}, ${k}) 和 (${p}, ${num(q)})。`),
          ),
        };
      },
    },
  ],
};

export const domainAndRangeOfQuadraticFunctions: TopicDef = {
  id: "domain-and-range-of-quadratic-functions",
  title: t("Domain and Range of Quadratic Functions", "二次函数的定义域与值域"),
  summary: t(
    "Find the domain and the range of a quadratic function from its graph, its vertex form or its standard form.",
    "由图象、顶点式或一般式求二次函数的定义域和值域。",
  ),
  prerequisites: ["writing-the-equation-of-a-parabola-in-vertex-form", "range-of-a-function"],
  encompasses: [
    { topic: "range-of-a-function", weight: 0.4 },
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  intro: t(
    `The domain of a function is the set of inputs it accepts, and its range is the set of outputs it produces. For a quadratic function the first is easy, and vertex form makes the second easy too: the vertex is the lowest or the highest point, so its height is where the outputs stop.

Take $f(x) = (x - 1)^{2} + 2$. Any number can be put in for $x$, so the domain is all real numbers, $\\mathbb{R}$. The square is never negative, so $f(x) \\ge 2$, and $f(1) = 2$ is reached at the vertex $(1, 2)$. Every height from $2$ upward is reached, so the range is $[2, \\infty)$:

{{figure 0}}

In this lesson we find the range of a quadratic function from its graph, from vertex form and from standard form.`,
    `函数的定义域是它接受的输入的集合，值域是它产生的输出的集合。对二次函数，定义域很简单；有了顶点式，值域也不难：顶点是最低点或最高点，它的高度就是输出的边界。

取 $f(x) = (x - 1)^{2} + 2$。$x$ 可以取任何数，所以定义域是全体实数 $\\mathbb{R}$。平方永远不是负数，所以 $f(x) \\ge 2$，并且在顶点 $(1, 2)$ 处取到 $f(1) = 2$。从 $2$ 往上的每个高度都能取到，所以值域是 $[2, \\infty)$：

{{figure 0}}

这节课我们由图象、顶点式和一般式求二次函数的值域。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -3, xMax: 5, yMin: -1, yMax: 10 },
      [
        { kind: "curve", f: (x) => (x - 1) ** 2 + 2, accent: true },
        { kind: "line", a: [0, 2], b: [1, 2], dashed: true, tone: "action" },
        { kind: "point", at: [1, 2], label: "(1, 2)", dir: "s", tone: "result" },
      ],
      "The parabola y = (x − 1)² + 2 lies on and above the dashed line y = 2, touching it at the vertex (1, 2).",
      "抛物线 y = (x − 1)² + 2 在虚线 y = 2 上及其上方，在顶点 (1, 2) 处与它相接。",
    ),
  ],
  knowledgePoints: [
    {
      id: "from-a-graph",
      figure: algebraDrawings["domain-and-range-of-quadratic-functions#from-a-graph"],
      title: t("Domain and range from a graph", "从图象求定义域和值域"),
      explanation: t(
        `Every real number can be squared, so the **domain** of a quadratic function is all real numbers, $\\mathbb{R}$. The **range** is the set of heights the graph reaches, and it depends on the vertex $(h, k)$:

- opening upward, the vertex is the lowest point, so the outputs are $k$ and everything above: the range is $[k, \\infty)$;
- opening downward, the vertex is the highest point, so the range is $(-\\infty, k]$.

A parabola opening downward from $(3, 5)$ has range $(-\\infty, 5]$: it reaches the height $5$ at its vertex and every height below.

> **Watch out.** The range is about heights, so it uses $k$, the $y$-coordinate of the vertex, not $h$. The bracket at $k$ is **closed**, because the vertex is on the graph.`,
        `每个实数都可以平方，所以二次函数的**定义域**是全体实数 $\\mathbb{R}$。**值域**是图象达到的高度的集合，取决于顶点 $(h, k)$：

- 开口向上时，顶点是最低点，输出是 $k$ 及其上方所有的数：值域是 $[k, \\infty)$；
- 开口向下时，顶点是最高点，值域是 $(-\\infty, k]$。

从 $(3, 5)$ 开口向下的抛物线，值域是 $(-\\infty, 5]$：它在顶点处达到高度 $5$，并达到下方的每个高度。

> **注意。** 值域说的是高度，所以用顶点的纵坐标 $k$，不是 $h$。$k$ 处用**闭**括号，因为顶点在图象上。`,
      ),
      generate(rng) {
        let v: { a: Q; h: number; k: number };
        do v = drawVertex(rng);
        while (v.h === v.k);
        const { a, h, k } = v;
        const up = a.sign() > 0;
        const set = ray(k, up);
        return annotate(
          {
            ...intervalProblem({
              prompt: t("Find the range of the quadratic function whose graph is shown.", "求图中二次函数的值域。"),
              set,
              wrong: [ray(k, !up), ray(k, up, false), realLine, ray(h, up)],
              solution: t(
                `**Step 1: Find the vertex and the direction.** The parabola opens ${up ? "upward" : "downward"}, so its vertex $${pt(h, k)}$ is its ${up ? "lowest" : "highest"} point.

**Step 2: Read the heights.** The graph reaches the height $${k}$ at the vertex and every height ${up ? "above" : "below"} it, so the range is $${intervalLatex(set)}$.

**Check.** The vertex is on the graph, so $${k}$ is an output and the bracket at $${k}$ is closed. The graph never goes ${up ? "below" : "above"} the line $y = ${k}$, so no output is ${up ? "smaller" : "larger"} than $${k}$.`,
                `**第一步：找顶点和开口方向。** 抛物线开口向${up ? "上" : "下"}，所以顶点 $${pt(h, k)}$ 是它的最${up ? "低" : "高"}点。

**第二步：读出高度。** 图象在顶点处达到高度 $${k}$，并达到${up ? "上" : "下"}方的每个高度，所以值域是 $${intervalLatex(set)}$。

**检验。** 顶点在图象上，所以 $${k}$ 是一个输出，$${k}$ 处用闭括号。图象从不越到直线 $y = ${k}$ 的${up ? "下" : "上"}方，所以没有比 $${k}$ 更${up ? "小" : "大"}的输出。`,
              ),
            }),
            figure: parabolaFigure(a, h, k),
          },
          view,
          [
            { kind: "line", a: [0, k], b: [1, k], dashed: true, tone: "action" },
            { kind: "point", at: [h, k], label: at([h, k]), dir: up ? "s" : "n", tone: "result" },
          ],
          `The lowest or highest height is the vertex: y = ${k}.`,
          `最低或最高的高度在顶点：y = ${k}。`,
        );
      },
    },
    {
      id: "from-vertex-form",
      figure: algebraDrawings["domain-and-range-of-quadratic-functions#from-vertex-form"],
      title: t("Domain and range from vertex form", "由顶点式求定义域和值域"),
      explanation: t(
        `In $f(x) = a(x - h)^{2} + k$ the vertex is $(h, k)$, and the sign of $a$ gives the direction: $a(x - h)^{2}$ is never negative when $a > 0$ and never positive when $a < 0$. So $k$ is the minimum or the maximum value, and the range runs from $k$ in that direction.

For $f(x) = -3(x + 1)^{2} + 4$: $a = -3$ is negative, so the parabola opens downward from $(-1, 4)$, and the range is $(-\\infty, 4]$. The domain is $\\mathbb{R}$, as for every quadratic function: any $x$ can be substituted.

> **Watch out.** The range starts at $k$, the number **added** outside the parentheses, not at the number inside. And it is $a$, not $k$, that decides whether the range goes up or down from $k$.`,
        `在 $f(x) = a(x - h)^{2} + k$ 中，顶点是 $(h, k)$，$a$ 的符号决定开口方向：$a > 0$ 时 $a(x - h)^{2}$ 永远不是负数，$a < 0$ 时永远不是正数。所以 $k$ 是最小值或最大值，值域从 $k$ 向那个方向延伸。

对 $f(x) = -3(x + 1)^{2} + 4$：$a = -3$ 是负数，抛物线从 $(-1, 4)$ 开口向下，值域是 $(-\\infty, 4]$。与所有二次函数一样，定义域是 $\\mathbb{R}$：任何 $x$ 都可以代入。

> **注意。** 值域从 $k$ 开始，$k$ 是括号外**加上**的数，不是括号里的数。决定值域从 $k$ 向上还是向下的是 $a$，不是 $k$。`,
      ),
      generate(rng) {
        const a = rng.pick(signedAs);
        const h = rng.nonZero(-9, 9);
        let k: number;
        do k = rng.int(-12, 12);
        while (k === h || k === -h);
        const up = a.sign() > 0;
        const far = num(a.mul(Q.of(100)).add(Q.of(k)));
        if (rng.bool(0.2)) {
          return intervalProblem({
            prompt: t(`Find the domain of $f(x) = ${vertexForm(a, h, k)}$.`, `求 $f(x) = ${vertexForm(a, h, k)}$ 的定义域。`),
            set: realLine,
            wrong: [ray(k, up), ray(h, up)],
            solution: t(
              `**Step 1: Look at what the formula does to $x$.** It ${h === 0 ? "squares $x$" : `subtracts $${h}$ from $x$, squares the result`}, multiplies by $${num(a)}$ and adds $${k}$. Each of these works for every real number.

**Step 2: Write the domain.** No value of $x$ is excluded, so the domain is $\\mathbb{R}$. The vertex limits the outputs, not the inputs.

**Check.** Even an input far from the vertex gives an output: $f(${h + 10}) = ${a.eq(Q.one) ? "" : a.eq(Q.of(-1)) ? "-" : `${num(a)} \\cdot `}10^{2}${tail(k)} = ${far}$.`,
              `**第一步：看公式对 $x$ 做了什么。** 它${h === 0 ? "把 $x$ 平方" : `从 $x$ 中减去 $${h}$，再平方`}，乘以 $${num(a)}$，加上 $${k}$。这些运算对每个实数都能进行。

**第二步：写出定义域。** 没有哪个 $x$ 被排除，所以定义域是 $\\mathbb{R}$。顶点限制的是输出，不是输入。

**检验。** 即使离顶点很远的输入也有输出：$f(${h + 10}) = ${a.eq(Q.one) ? "" : a.eq(Q.of(-1)) ? "-" : `${num(a)} \\cdot `}10^{2}${tail(k)} = ${far}$。`,
            ),
          });
        }
        const set = ray(k, up);
        const next = num(a.add(Q.of(k)));
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${vertexForm(a, h, k)}$.`, `求 $f(x) = ${vertexForm(a, h, k)}$ 的值域。`),
          set,
          wrong: [ray(k, !up), ray(-k, up), ray(h, up), ray(-h, up), realLine],
          solution: t(
            `**Step 1: Read the vertex.** The equation is in vertex form with $h = ${h}$ and $k = ${k}$, so the vertex is $${pt(h, k)}$.

**Step 2: Read the direction.** $a = ${num(a)}$ is ${up ? "positive" : "negative"}, so the parabola opens ${up ? "upward" : "downward"} and $f$ has ${up ? "minimum" : "maximum"} value $${k}$. The range is $${intervalLatex(set)}$.

**Check.** The value $${k}$ is reached: $f(${h}) = ${atVertex(a, h, k)}$. One step away, $f(${h + 1}) = ${next}$ is ${up ? "above" : "below"} $${k}$, inside the range.`,
            `**第一步：读出顶点。** 方程是顶点式，$h = ${h}$，$k = ${k}$，所以顶点是 $${pt(h, k)}$。

**第二步：看开口方向。** $a = ${num(a)}$ 是${up ? "正" : "负"}数，抛物线开口向${up ? "上" : "下"}，$f$ 的${up ? "最小" : "最大"}值是 $${k}$。值域是 $${intervalLatex(set)}$。

**检验。** 能取到 $${k}$：$f(${h}) = ${atVertex(a, h, k)}$。往旁边走一步，$f(${h + 1}) = ${next}$ 在 $${k}$ 的${up ? "上" : "下"}方，在值域内。`,
          ),
        });
      },
    },
    {
      id: "from-standard-form",
      figure: algebraDrawings["domain-and-range-of-quadratic-functions#from-standard-form"],
      title: t("Range from standard form", "由一般式求值域"),
      explanation: t(
        `Standard form does not show the vertex, and the vertex is what the range needs. So find it first: its $x$-coordinate is $-\\frac{b}{2a}$, and its $y$-coordinate is the value of $f$ there. For $f(x) = 2x^{2} - 8x + 3$:

$$x = -\\frac{-8}{2 \\cdot 2} = 2, \\qquad f(2) = 8 - 16 + 3 = -5$$

The parabola opens upward, since $a = 2 > 0$, so the range is $[-5, \\infty)$.

> **Watch out.** The constant $c$ is the $y$-intercept, $f(0)$, not the extreme value: here $f(0) = 3$, but the minimum is $-5$. Use $c$ only when the vertex happens to be on the $y$-axis.`,
        `一般式看不出顶点，而求值域要用顶点。所以先求顶点：横坐标是 $-\\frac{b}{2a}$，纵坐标是 $f$ 在该处的值。对 $f(x) = 2x^{2} - 8x + 3$：

$$x = -\\frac{-8}{2 \\cdot 2} = 2, \\qquad f(2) = 8 - 16 + 3 = -5$$

因为 $a = 2 > 0$，抛物线开口向上，所以值域是 $[-5, \\infty)$。

> **注意。** 常数 $c$ 是 $y$ 轴截距 $f(0)$，不是最值：这里 $f(0) = 3$，最小值却是 $-5$。只有顶点恰好在 $y$ 轴上时，$c$ 才是最值。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, -1, -1, -2, -3]);
        const h = rng.nonZero(-6, 6);
        let k: number;
        do k = rng.int(-12, 12);
        while (k === h);
        const b = -2 * a * h;
        const c = a * h * h + k;
        const up = a > 0;
        const set = ray(k, up);
        const vertexValue = steps(`f(${h}) = ${evaluation(a, b, c, h)}`);
        const back = steps(chain(vertexForm(a, h, k), `${quad(a, b, a * h * h)}${tail(k)}`, quad(a, b, c)));
        return intervalProblem({
          prompt: t(`Find the range of $f(x) = ${quad(a, b, c)}$.`, `求 $f(x) = ${quad(a, b, c)}$ 的值域。`),
          set,
          wrong: [ray(c, up), ray(k, !up), ray(h, up), realLine],
          solution: t(
            `**Step 1: Find the axis of symmetry.** With $a = ${a}$ and $b = ${b}$:${steps(axisFormula(a, b))}**Step 2: Find the height of the vertex.** Substitute $x = ${h}$:${vertexValue}**Step 3: Read the range.** $a = ${a}$ is ${up ? "positive" : "negative"}, so the parabola opens ${up ? "upward" : "downward"} from $${pt(h, k)}$, and the range is $${intervalLatex(set)}$.

**Check.** The vertex form $f(x) = ${vertexForm(a, h, k)}$ shows the ${up ? "minimum" : "maximum"} $${k}$ directly, and it expands back to the given function:${back}`,
            `**第一步：求对称轴。** $a = ${a}$，$b = ${b}$：${steps(axisFormula(a, b))}**第二步：求顶点的高度。** 代入 $x = ${h}$：${vertexValue}**第三步：读出值域。** $a = ${a}$ 是${up ? "正" : "负"}数，抛物线从 $${pt(h, k)}$ 开口向${up ? "上" : "下"}，所以值域是 $${intervalLatex(set)}$。

**检验。** 顶点式 $f(x) = ${vertexForm(a, h, k)}$ 直接显示${up ? "最小值" : "最大值"} $${k}$，并且展开后就是原来的函数：${back}`,
          ),
        });
      },
    },
  ],
};

// Module: intersections.

/** lineAt writes mx + n at x step by step: "3 \cdot (-2) + 4 = -6 + 4 = -2"; steps that say nothing new are left out. */
const lineAt = (m: number, n: number, x: number) =>
  chain(`${m === 1 ? "" : m === -1 ? "-" : `${m} \\cdot `}${paren(x)}${tail(n)}`, `${m * x}${tail(n)}`, `${m * x + n}`);

/** distinctLines drops a line that repeats the one before it, so steps never shows the same line twice. */
const distinctLines = (...lines: string[]) => lines.filter((l, i) => i === 0 || l !== lines[i - 1]);

export const solvingSystemsOfNonlinearEquations: TopicDef = {
  id: "solving-systems-of-nonlinear-equations",
  title: t("Solving Systems of Nonlinear Equations", "解非线性方程组"),
  summary: t(
    "Solve a system of a quadratic and a linear equation, or of two quadratic equations, by substitution.",
    "用代入法解由一个二次方程和一个一次方程、或由两个二次方程组成的方程组。",
  ),
  prerequisites: ["solving-systems-by-substitution", "roots-of-quadratic-functions"],
  encompasses: [
    { topic: "solving-systems-by-substitution", weight: 0.5 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.7"],
  intro: t(
    `A system of two linear equations is solved by substitution: replace $y$ in one equation by its expression from the other, and solve for $x$. The same move works when one of the equations is **quadratic**. The equation for $x$ is then quadratic too, so it can have two solutions, which we already know how to find.

Take $y = x^{2}$ and $y = x + 2$. Both expressions equal $y$, so they equal each other:

$$x^{2} = x + 2 \\Rightarrow x^{2} - x - 2 = 0 \\Rightarrow (x - 2)(x + 1) = 0$$

So $x = 2$ or $x = -1$, and the line gives $y = 4$ and $y = 1$. The solutions are $(2, 4)$ and $(-1, 1)$, the two points where the line crosses the parabola:

{{figure 0}}

In this lesson we solve systems of a quadratic and a linear equation, and systems of two quadratic equations.`,
    `由两个一次方程组成的方程组用代入法解：用一个方程中 $y$ 的表达式替换另一个方程中的 $y$，再解出 $x$。当其中一个方程是**二次**方程时，同样可以这样做。这时关于 $x$ 的方程也是二次方程，可能有两个解，而这种方程我们已经会解。

取 $y = x^{2}$ 和 $y = x + 2$。两个表达式都等于 $y$，所以它们相等：

$$x^{2} = x + 2 \\Rightarrow x^{2} - x - 2 = 0 \\Rightarrow (x - 2)(x + 1) = 0$$

所以 $x = 2$ 或 $x = -1$，由直线得 $y = 4$ 和 $y = 1$。解是 $(2, 4)$ 和 $(-1, 1)$，正是直线与抛物线相交的两点：

{{figure 0}}

这节课我们解由一个二次方程和一个一次方程组成的方程组，以及由两个二次方程组成的方程组。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -4, xMax: 4, yMin: -2, yMax: 8 },
      [
        { kind: "curve", f: (x) => x * x, accent: true },
        { kind: "curve", f: (x) => x + 2 },
        { kind: "point", at: [2, 4], label: "(2, 4)", dir: "e", tone: "result" },
        { kind: "point", at: [-1, 1], label: "(−1, 1)", dir: "w", tone: "result" },
      ],
      "The parabola y = x² and the line y = x + 2 cross at (2, 4) and (−1, 1).",
      "抛物线 y = x² 与直线 y = x + 2 相交于 (2, 4) 和 (−1, 1)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "substituting-into-the-quadratic",
      title: t("Substituting into the quadratic", "代入二次方程"),
      explanation: t(
        `A system such as

$$y = x^{2} - 3x + 1, \\qquad y = x - 2$$

is **nonlinear** because one equation is not linear. Both right-hand sides equal $y$, so set them equal, bring everything to one side and solve the quadratic equation:

$$x^{2} - 3x + 1 = x - 2 \\Rightarrow x^{2} - 4x + 3 = 0 \\Rightarrow (x - 1)(x - 3) = 0$$

so $x = 1$ or $x = 3$. A nonlinear system can have more than one solution.

> **Watch out.** Move every term to one side **before** factoring, so that the product equals $0$. Then read each root with the opposite sign of its factor: $(x - 3)$ gives $x = 3$. Keep both roots; each is a solution.`,
        `像

$$y = x^{2} - 3x + 1, \\qquad y = x - 2$$

这样的方程组是**非线性**的，因为有一个方程不是一次方程。两个右边都等于 $y$，所以令它们相等，把所有项移到一边，解所得的一元二次方程：

$$x^{2} - 3x + 1 = x - 2 \\Rightarrow x^{2} - 4x + 3 = 0 \\Rightarrow (x - 1)(x - 3) = 0$$

所以 $x = 1$ 或 $x = 3$。非线性方程组可以有不止一个解。

> **注意。** 因式分解**之前**先把所有项移到一边，使乘积等于 $0$。再按与因式相反的符号读出每个根：$(x - 3)$ 给出 $x = 3$。两个根都要保留，每个都是解。`,
      ),
      generate(rng) {
        const [r, s] = distinctRoots(rng, 7);
        const m = rng.nonZero(-5, 5);
        const n = rng.int(-9, 9);
        const b = m - (r + s);
        const c = n + r * s;
        const standard = rng.bool(0.3) && m === -1;
        const line = standard ? `x + y = ${n}` : `y = ${linear(m, n)}`;
        const equal = steps(`${quad(1, b, c)} = ${linear(m, n)}`);
        const zero = steps(`${quad(1, -(r + s), r * s)} = 0`, `${factor(r)}${factor(s)} = 0`);
        const at = (x: number) => steps(`y = ${evaluation(1, b, c, x)}`, `y = ${lineAt(m, n, x)}`);
        return solutionsProblem({
          prompt: t(
            `Find the $x$-coordinates of all solutions of the system $y = ${quad(1, b, c)}$, $${line}$.`,
            `求方程组 $y = ${quad(1, b, c)}$，$${line}$ 所有解的 $x$ 坐标。`,
          ),
          values: [String(r), String(s)],
          wrong: [[String(-r), String(-s)], [String(r)], [String(s)]],
          solution: t(
            `**Step 1: Set the two expressions for $y$ equal.** ${standard ? `Solving the line for $y$ gives $y = ${linear(m, n)}$. ` : ""}Both equal $y$, so${equal}**Step 2: Bring everything to one side and factor.** Move the terms of $${linear(m, n)}$ to the left, changing their signs:${zero}So $x = ${r}$ or $x = ${s}$.

**Check.** At $x = ${r}$ both equations give $y = ${m * r + n}$:${at(r)}At $x = ${s}$ both give $y = ${m * s + n}$:${at(s)}`,
            `**第一步：令 $y$ 的两个表达式相等。** ${standard ? `由直线解出 $y$，得 $y = ${linear(m, n)}$。` : ""}两者都等于 $y$，所以${equal}**第二步：移到一边并因式分解。** 把 $${linear(m, n)}$ 的各项移到左边并变号：${zero}所以 $x = ${r}$ 或 $x = ${s}$。

**检验。** 在 $x = ${r}$ 处，两个方程都给出 $y = ${m * r + n}$：${at(r)}在 $x = ${s}$ 处，两个方程都给出 $y = ${m * s + n}$：${at(s)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-solutions",
      title: t("Finding the solutions as ordered pairs", "求出有序数对形式的解"),
      explanation: t(
        `A solution of a system is an ordered pair $(x, y)$ that satisfies **both** equations, so an $x$-value alone is only half of it. After finding the $x$-values, substitute each into the **linear** equation, which is easier, to get its $y$. In the system $y = x^{2} - 3x + 1$, $y = x - 2$, the $x$-values are $1$ and $3$, and $y = x - 2$ gives

$$x = 1: y = -1, \\qquad x = 3: y = 1$$

The solutions are $(1, -1)$ and $(3, 1)$. The quadratic gives the same heights: $1 - 3 + 1 = -1$ and $9 - 9 + 1 = 1$.

> **Watch out.** Compute $y$ from the $x$ you chose, using the whole equation: in $y = x - 2$ do not drop the $-2$. Write the pair as $(x, y)$, with $x$ first.`,
        `方程组的解是同时满足**两个**方程的有序数对 $(x, y)$，所以只有 $x$ 值只是解的一半。求出 $x$ 值后，把每个值代入较简单的**一次**方程求 $y$。在方程组 $y = x^{2} - 3x + 1$，$y = x - 2$ 中，$x$ 值是 $1$ 和 $3$，由 $y = x - 2$ 得

$$x = 1: y = -1, \\qquad x = 3: y = 1$$

解是 $(1, -1)$ 和 $(3, 1)$。二次方程给出同样的高度：$1 - 3 + 1 = -1$，$9 - 9 + 1 = 1$。

> **注意。** 用所选的 $x$ 和完整的方程计算 $y$：在 $y = x - 2$ 中不要漏掉 $-2$。数对写成 $(x, y)$，$x$ 在前。`,
      ),
      generate(rng) {
        const [r, s] = distinctRoots(rng, 7);
        const m = rng.nonZero(-4, 4);
        const n = rng.int(-9, 9);
        const a = rng.pick([1, 1, -1, 2]);
        const b = m - a * (r + s);
        const c = n + a * r * s;
        const larger = rng.bool();
        const x = larger ? Math.max(r, s) : Math.min(r, s);
        const other = larger ? Math.min(r, s) : Math.max(r, s);
        const y = m * x + n;
        const work = steps(
          ...distinctLines(
            `${quad(a, b, c)} = ${linear(m, n)}`,
            `${quad(a, -a * (r + s), a * r * s)} = 0`,
            `${front(a)}${factor(r)}${factor(s)} = 0`,
          ),
        );
        return pointProblem({
          prompt: t(
            `The system $y = ${quad(a, b, c)}$, $y = ${linear(m, n)}$ has two solutions. Find the solution with the ${larger ? "larger" : "smaller"} $x$-coordinate.`,
            `方程组 $y = ${quad(a, b, c)}$，$y = ${linear(m, n)}$ 有两个解。求 $x$ 坐标较${larger ? "大" : "小"}的那个解。`,
          ),
          answer: [x, y],
          wrong: [
            [other, m * other + n],
            [x, -y],
            [y, x],
            [x, m * x],
          ],
          solution: t(
            `**Step 1: Find the $x$-values.** Set the expressions equal, bring everything to one side and factor:${work}So $x = ${r}$ or $x = ${s}$. The ${larger ? "larger" : "smaller"} is $x = ${x}$.

**Step 2: Find $y$ from the line.** Substitute $x = ${x}$ into $y = ${linear(m, n)}$:${steps(`y = ${lineAt(m, n, x)}`)}The solution is $${pt(x, y)}$.

**Check.** The quadratic gives the same height at $x = ${x}$:${steps(`y = ${evaluation(a, b, c, x)}`)}`,
            `**第一步：求 $x$ 值。** 令两个表达式相等，移到一边并因式分解：${work}所以 $x = ${r}$ 或 $x = ${s}$。较${larger ? "大" : "小"}的是 $x = ${x}$。

**第二步：由直线求 $y$。** 把 $x = ${x}$ 代入 $y = ${linear(m, n)}$：${steps(`y = ${lineAt(m, n, x)}`)}解是 $${pt(x, y)}$。

**检验。** 二次方程在 $x = ${x}$ 处给出同样的高度：${steps(`y = ${evaluation(a, b, c, x)}`)}`,
          ),
        });
      },
    },
    {
      id: "two-parabolas",
      title: t("Two quadratic equations", "两个二次方程"),
      explanation: t(
        `When both equations are quadratic, set the two expressions for $y$ equal as before. If the $x^{2}$ terms are the same, they cancel and leave a linear equation, with a single solution:

$$x^{2} + 3x - 2 = x^{2} - x + 6 \\Rightarrow 3x - 2 = -x + 6 \\Rightarrow 4x = 8 \\Rightarrow x = 2$$

Then $y = 2^{2} + 3 \\cdot 2 - 2 = 8$, and the only solution is $(2, 8)$. The other equation agrees: $4 - 2 + 6 = 8$.

> **Watch out.** Collect the $x$-terms on one side and the constants on the other, changing the sign of whatever crosses the equals sign: $3x + x = 6 + 2$. Then find $y$ by substituting $x$ into one of the original equations.`,
        `当两个方程都是二次方程时，同样令 $y$ 的两个表达式相等。若 $x^{2}$ 项相同，它们就会抵消，只剩一个一次方程，只有一个解：

$$x^{2} + 3x - 2 = x^{2} - x + 6 \\Rightarrow 3x - 2 = -x + 6 \\Rightarrow 4x = 8 \\Rightarrow x = 2$$

于是 $y = 2^{2} + 3 \\cdot 2 - 2 = 8$，唯一的解是 $(2, 8)$。另一个方程也给出 $4 - 2 + 6 = 8$。

> **注意。** 把含 $x$ 的项集中到一边、常数集中到另一边，越过等号的项要变号：$3x + x = 6 + 2$。然后把 $x$ 代入原来的一个方程求 $y$。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, -1, 3]);
        const x0 = rng.nonZero(-5, 5);
        let b1: number;
        let b2: number;
        do {
          b1 = rng.int(-8, 8);
          b2 = rng.int(-8, 8);
        } while (b1 === b2);
        const c1 = rng.int(-9, 9);
        const y0 = a * x0 * x0 + b1 * x0 + c1;
        const c2 = y0 - a * x0 * x0 - b2 * x0;
        const work = steps(
          ...distinctLines(
            `${quad(a, b1, c1)} = ${quad(a, b2, c2)}`,
            `${linear(b1, c1)} = ${linear(b2, c2)}`,
            `${linear(b1 - b2, 0)} = ${c2 - c1}`,
            `x = ${x0}`,
          ),
        );
        return pointProblem({
          prompt: t(
            `Solve the system $y = ${quad(a, b1, c1)}$, $y = ${quad(a, b2, c2)}$.`,
            `解方程组 $y = ${quad(a, b1, c1)}$，$y = ${quad(a, b2, c2)}$。`,
          ),
          answer: [x0, y0],
          wrong: [
            [-x0, y0],
            [x0, -y0],
            [y0, x0],
          ],
          solution: t(
            `**Step 1: Set the expressions equal and solve for $x$.** Both sides have $${quad(a, 0, 0)}$, so it cancels; then collect the $x$-terms on the left and the constants on the right:${work}**Step 2: Find $y$.** Substitute $x = ${x0}$ into the first equation:${steps(`y = ${evaluation(a, b1, c1, x0)}`)}The solution is $${pt(x0, y0)}$.

**Check.** The second equation gives the same $y$:${steps(`y = ${evaluation(a, b2, c2, x0)}`)}`,
            `**第一步：令两个表达式相等，解出 $x$。** 两边都有 $${quad(a, 0, 0)}$，可以抵消；再把含 $x$ 的项移到左边、常数移到右边：${work}**第二步：求 $y$。** 把 $x = ${x0}$ 代入第一个方程：${steps(`y = ${evaluation(a, b1, c1, x0)}`)}解是 $${pt(x0, y0)}$。

**检验。** 第二个方程给出同样的 $y$：${steps(`y = ${evaluation(a, b2, c2, x0)}`)}`,
          ),
        });
      },
    },
  ],
};

/** gapCheck completes the square of the gap ax² + bx + c between a parabola and a line, and says how often the gap is 0. */
function gapCheck(a: number, b: number, c: number): Text {
  const h = Q.of(-b, 2 * a);
  const k = Q.of(4 * a * c - b * b, 4 * a);
  const form = `${quad(a, b, c)} = ${vertexForm(a, h, k)}`;
  const up = a > 0;
  const how = k.isZero()
    ? t(
        `it is $0$ only at $x = ${num(h)}$, the one point where the line touches the parabola`,
        `它只在 $x = ${num(h)}$ 处为 $0$，那是直线与抛物线唯一的公共点`,
      )
    : k.sign() > 0 === up
      ? t(
          `it is always ${up ? "at least" : "at most"} $${num(k)}$ and never $0$: the line and the parabola never meet`,
          `它总是${up ? "不小于" : "不大于"} $${num(k)}$，永远不为 $0$，所以直线与抛物线永远不相交`,
        )
      : t(
          `it ${up ? "dips below" : "rises above"} $0$ around $x = ${num(h)}$, so it is $0$ at two values of $x$, one on each side: the line crosses the parabola twice`,
          `它在 $x = ${num(h)}$ 附近${up ? "小于" : "大于"} $0$，所以在两侧各有一个 $x$ 使它为 $0$：直线与抛物线相交两次`,
        );
  return t(
    `**Check.** The parabola minus the line is $${quad(a, b, c)}$. Completing the square gives${steps(form)}so ${how.en}.`,
    `**检验。** 抛物线减去直线得 $${quad(a, b, c)}$。配方得${steps(form)}所以${how["zh-CN"]}。`,
  );
}

export const findingIntersectionsOfLinesAndQuadraticFunctions: TopicDef = {
  id: "finding-intersections-of-lines-and-quadratic-functions",
  title: t("Finding Intersections of Lines and Quadratic Functions", "求直线与二次函数图象的交点"),
  summary: t(
    "Find where a line meets a parabola, count the intersection points with the discriminant, and find tangent lines.",
    "求直线与抛物线的交点，用判别式数交点个数，并求切线。",
  ),
  prerequisites: ["solving-systems-of-nonlinear-equations", "the-discriminant-of-a-quadratic-function"],
  encompasses: [
    { topic: "solving-systems-of-nonlinear-equations", weight: 0.5 },
    { topic: "the-discriminant-of-a-quadratic-function", weight: 0.3 },
    { topic: "quadratic-equations-with-one-real-solution", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.C.7", "CCSS.HSA.REI.D.11"],
  intro: t(
    `Solving a system of a quadratic and a linear equation finds the points the two graphs have in common. Geometrically, these are the points where a line meets a parabola. The equation for $x$ is quadratic, and its discriminant tells how many solutions it has. So the discriminant also tells, without solving, whether the line crosses the parabola twice, touches it once, or misses it.

Take the parabola $y = x^{2}$ and the lines $y = 2x - 1$, $y = 2x$ and $y = 2x - 2$. Setting them equal gives $x^{2} - 2x + 1 = 0$, $x^{2} - 2x = 0$ and $x^{2} - 2x + 2 = 0$. The discriminants are $0$, $4$ and $-4$:

{{figure 0}}

The line with discriminant $0$ touches the parabola at $(1, 1)$: it is **tangent** to it. In this lesson we find intersection points, count them, and find tangent lines.`,
    `解由一个二次方程和一个一次方程组成的方程组，就是求两个图象的公共点。从几何上看，这些点就是直线与抛物线的交点。关于 $x$ 的方程是二次方程，它的判别式说明它有几个解。所以不必求解，判别式就能告诉我们直线与抛物线相交两次、只接触一次，还是不相交。

取抛物线 $y = x^{2}$ 和直线 $y = 2x - 1$、$y = 2x$、$y = 2x - 2$。令它们相等，得 $x^{2} - 2x + 1 = 0$、$x^{2} - 2x = 0$ 和 $x^{2} - 2x + 2 = 0$。判别式分别是 $0$、$4$ 和 $-4$：

{{figure 0}}

判别式为 $0$ 的直线在 $(1, 1)$ 处与抛物线接触：它与抛物线**相切**。这节课我们求交点、数交点个数，并求切线。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -3, xMax: 4, yMin: -3, yMax: 8 },
      [
        { kind: "curve", f: (x) => x * x, accent: true },
        { kind: "curve", f: (x) => 2 * x - 1, tone: "result" },
        { kind: "curve", f: (x) => 2 * x, dashed: true },
        { kind: "curve", f: (x) => 2 * x - 2, dashed: true },
        { kind: "point", at: [1, 1], label: "(1, 1)", dir: "e", tone: "result" },
      ],
      "The parabola y = x² with three parallel lines: y = 2x crosses it twice, y = 2x − 1 touches it at (1, 1), and y = 2x − 2 misses it.",
      "抛物线 y = x² 和三条平行直线：y = 2x 与它相交两次，y = 2x − 1 在 (1, 1) 处与它相切，y = 2x − 2 与它不相交。",
    ),
  ],
  knowledgePoints: [
    {
      id: "intersection-points",
      title: t("Intersection points", "交点"),
      explanation: t(
        `A point on both graphs satisfies both equations, so the points where a line meets a parabola are the solutions of the system of their equations. In the figure, the line $y = x + 1$ meets $y = x^{2} - 1$ where the two heights are equal:

$$x^{2} - 1 = x + 1 \\Rightarrow x^{2} - x - 2 = 0 \\Rightarrow (x - 2)(x + 1) = 0$$

At $x = 2$ the line gives $y = 3$; at $x = -1$ it gives $y = 0$. The intersection points are $(2, 3)$ and $(-1, 0)$.

> **Watch out.** Find $y$ from the **whole** equation of the line or the parabola, not from $ax^{2}$ alone. "Farther to the left" means the smaller $x$, and "farther to the right" the larger.`,
        `同时在两个图象上的点满足两个方程，所以直线与抛物线的交点就是它们的方程组成的方程组的解。图中直线 $y = x + 1$ 与 $y = x^{2} - 1$ 在两者高度相等处相交：

$$x^{2} - 1 = x + 1 \\Rightarrow x^{2} - x - 2 = 0 \\Rightarrow (x - 2)(x + 1) = 0$$

$x = 2$ 时直线给出 $y = 3$；$x = -1$ 时给出 $y = 0$。交点是 $(2, 3)$ 和 $(-1, 0)$。

> **注意。** 用直线或抛物线的**完整**方程求 $y$，不要只用 $ax^{2}$。"较左"指 $x$ 较小，"较右"指 $x$ 较大。`,
      ),
      figure: parabolaFigure(1, 0, -1, [
        { kind: "line", a: [0, 1], b: [1, 2] },
        { kind: "point", at: [2, 3], label: "(2, 3)", dir: "e" },
        { kind: "point", at: [-1, 0], label: "(−1, 0)", dir: "w" },
      ]),
      generate(rng) {
        let a: number;
        let r: number;
        let s: number;
        let m: number;
        let n: number;
        do {
          a = rng.pick([1, -1, 2, -2]);
          [r, s] = distinctRoots(rng, 5);
          m = rng.int(-4, 4);
          n = rng.int(-6, 6);
        } while (Math.abs(m * r + n) > 6 || Math.abs(m * s + n) > 6);
        const b = m - a * (r + s);
        const c = n + a * r * s;
        const left = Math.min(r, s);
        const right = Math.max(r, s);
        const askLeft = rng.bool();
        const x = askLeft ? left : right;
        const other = askLeft ? right : left;
        const y = m * x + n;
        const lineText = m === 0 ? `y = ${n}` : `y = ${linear(m, n)}`;
        const work = steps(
          ...distinctLines(
            `${quad(a, b, c)} = ${linear(m, n)}`,
            `${quad(a, -a * (r + s), a * r * s)} = 0`,
            `${front(a)}${factor(r)}${factor(s)} = 0`,
          ),
        );
        const height =
          m === 0
            ? t(`The line is horizontal, so $y = ${n}$ there.`, `直线是水平的，所以那里 $y = ${n}$。`)
            : t(`On the line,${steps(`y = ${lineAt(m, n, x)}`)}`, `在直线上，${steps(`y = ${lineAt(m, n, x)}`)}`);
        const problem = pointProblem({
          prompt: t(
            `The line $${lineText}$ meets the parabola $y = ${quad(a, b, c)}$ at two points. Find the intersection point that is farther to the ${askLeft ? "left" : "right"}.`,
            `直线 $${lineText}$ 与抛物线 $y = ${quad(a, b, c)}$ 交于两点。求较${askLeft ? "左" : "右"}边的交点。`,
          ),
          answer: [x, y],
          wrong: [
            [other, m * other + n],
            [x, a * x * x],
            [-x, y],
          ],
          solution: t(
            `**Step 1: Find the $x$-coordinates.** Set the expressions equal, bring everything to one side and factor:${work}So $x = ${r}$ or $x = ${s}$. Farther to the ${askLeft ? "left is the smaller" : "right is the larger"}, $x = ${x}$.

**Step 2: Find the height.** ${height.en}${m === 0 ? " " : ""}The point is $${pt(x, y)}$.

**Check.** The parabola passes through the same point:${steps(`y = ${evaluation(a, b, c, x)}`)}`,
            `**第一步：求横坐标。** 令两个表达式相等，移到一边并因式分解：${work}所以 $x = ${r}$ 或 $x = ${s}$。较${askLeft ? "左的是较小的" : "右的是较大的"} $x = ${x}$。

**第二步：求高度。** ${height["zh-CN"]}交点是 $${pt(x, y)}$。

**检验。** 抛物线也经过这个点：${steps(`y = ${evaluation(a, b, c, x)}`)}`,
          ),
        });
        return problem;
      },
    },
    {
      id: "counting-intersections",
      figure: algebraDrawings["finding-intersections-of-lines-and-quadratic-functions#counting-intersections"],
      title: t("Counting intersection points", "数交点个数"),
      explanation: t(
        `Each common point of a line and a parabola gives a solution of the quadratic equation made by setting their expressions equal. So the discriminant of that equation counts the intersection points: positive gives two, zero gives one, negative gives none. For $y = x^{2} + 1$ and $y = 2x - 3$:

$$x^{2} + 1 = 2x - 3 \\Rightarrow x^{2} - 2x + 4 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 4 = -12 < 0$$

so the line misses the parabola. A discriminant of $0$ means the line touches the parabola at one point: it is **tangent** to it.

> **Watch out.** Take the discriminant of the equation **after** moving everything to one side, $x^{2} - 2x + 4 = 0$, not of the parabola $x^{2} + 1$ alone: the line changes $b$ and $c$.`,
        `直线与抛物线的每个公共点，都对应于令两个表达式相等所得二次方程的一个解。所以这个方程的判别式就是交点的个数：为正有两个，为零有一个，为负没有。对 $y = x^{2} + 1$ 和 $y = 2x - 3$：

$$x^{2} + 1 = 2x - 3 \\Rightarrow x^{2} - 2x + 4 = 0, \\qquad (-2)^{2} - 4 \\cdot 1 \\cdot 4 = -12 < 0$$

所以直线与抛物线不相交。判别式为 $0$ 表示直线与抛物线只有一个公共点：它与抛物线**相切**。

> **注意。** 要对**移项之后**的方程 $x^{2} - 2x + 4 = 0$ 求判别式，而不是只对抛物线 $x^{2} + 1$ 求：直线会改变 $b$ 和 $c$。`,
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [a, B, C] = drawBySign(rng, sign);
        const m = rng.int(-5, 5);
        const n = rng.int(-9, 9);
        const b = B + m;
        const c = C + n;
        const d = B * B - 4 * a * C;
        const options = [t("None", "没有交点"), t("Exactly one", "恰有一个"), t("Two", "两个")];
        const lineText = m === 0 ? `y = ${n}` : `y = ${linear(m, n)}`;
        const moved = steps(...distinctLines(`${quad(a, b, c)} = ${linear(m, n)}`, `${quad(a, B, C)} = 0`));
        const check = gapCheck(a, B, C);
        return choiceProblem({
          prompt: t(
            `How many points do the line $${lineText}$ and the parabola $y = ${quad(a, b, c)}$ have in common?`,
            `直线 $${lineText}$ 与抛物线 $y = ${quad(a, b, c)}$ 有几个公共点？`,
          ),
          options,
          correct: sign + 1,
          solution: t(
            `**Step 1: Set the expressions equal.** Move everything to one side:${moved}**Step 2: Compute the discriminant.** With $a = ${a}$, $b = ${B}$, $c = ${C}$:${steps(discriminantSteps(a, B, C))}The discriminant is ${d > 0 ? "positive: two points" : d === 0 ? "zero: exactly one point, where the line is tangent" : "negative: no common points"}.

${check.en}`,
            `**第一步：令两个表达式相等。** 把所有项移到一边：${moved}**第二步：计算判别式。** $a = ${a}$，$b = ${B}$，$c = ${C}$：${steps(discriminantSteps(a, B, C))}判别式${d > 0 ? "为正：有两个公共点" : d === 0 ? "为零：恰有一个公共点，直线与抛物线相切" : "为负：没有公共点"}。

${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "tangent-lines",
      figure: algebraDrawings["finding-intersections-of-lines-and-quadratic-functions#tangent-lines"],
      title: t("Tangent lines", "切线"),
      explanation: t(
        `A line is tangent to a parabola when they have exactly one common point, that is, when the equation made by setting them equal has exactly one solution: its discriminant is $0$. So to find the constant $k$ for which $y = mx + k$ is tangent, set the equations equal, collect terms, and make the discriminant $0$. For $y = x^{2} + 2x + 3$ and $y = 4x + k$:

$$x^{2} - 2x + (3 - k) = 0, \\qquad (-2)^{2} - 4(3 - k) = 0 \\Rightarrow 4k - 8 = 0 \\Rightarrow k = 2$$

With $k = 2$ the equation is $x^{2} - 2x + 1 = (x - 1)^{2} = 0$, one solution.

> **Watch out.** The constant term of the collected equation is $3 - k$, not $3$ or $3 + k$: the $k$ comes from the line and changes sign when it moves across. Keep $k$ in the discriminant, then solve for it.`,
        `直线与抛物线相切，就是它们恰有一个公共点，也就是令两者相等所得的方程恰有一个解：判别式为 $0$。所以要求使 $y = mx + k$ 与抛物线相切的常数 $k$，先令两个方程相等并整理，再令判别式为 $0$。对 $y = x^{2} + 2x + 3$ 和 $y = 4x + k$：

$$x^{2} - 2x + (3 - k) = 0, \\qquad (-2)^{2} - 4(3 - k) = 0 \\Rightarrow 4k - 8 = 0 \\Rightarrow k = 2$$

$k = 2$ 时方程是 $x^{2} - 2x + 1 = (x - 1)^{2} = 0$，只有一个解。

> **注意。** 整理后方程的常数项是 $3 - k$，不是 $3$ 或 $3 + k$：$k$ 来自直线，移项时要变号。把 $k$ 留在判别式里，再解出它。`,
      ),
      generate(rng) {
        const b = rng.int(-8, 8);
        const c = rng.int(-9, 9);
        let m: number;
        do m = rng.int(-6, 6);
        while (m === b);
        const e = b - m;
        const k = Q.of(c).sub(Q.of(e * e, 4));
        const quarter = Q.of(e * e, 4);
        const line = `y = ${m === 0 ? "" : `${front(m)}x + `}k`;
        const collect = steps(`${quad(1, b, c)} = ${m === 0 ? "" : `${front(m)}x + `}k`, `${quad(1, e, 0)} + (${c} - k) = 0`);
        const solve = steps(
          `${paren(e)}^{2} - 4(${c} - k) = 0`,
          `${e * e}${tail(-4 * c)} + 4k = 0`,
          `4k = ${4 * c - e * e}`,
          `k = ${chain(`\\frac{${4 * c - e * e}}{4}`, num(k))}`,
        );
        const minusK = k.sign() < 0 ? `${c} + ${num(k.neg())}` : `${c} - ${num(k)}`;
        const constText = k.isZero() ? `$${c}$` : `$${minusK} = ${num(quarter)}$`;
        const square = steps(`${quad(1, e, quarter)} = ${sq(Q.of(-e, 2))} = 0`);
        return numberProblem({
          prompt: t(
            `Find the value of $k$ for which the line $${line}$ is tangent to the parabola $y = ${quad(1, b, c)}$.`,
            `求 $k$ 的值，使直线 $${line}$ 与抛物线 $y = ${quad(1, b, c)}$ 相切。`,
          ),
          answer: k,
          wrong: [Q.of(c).add(Q.of(e * e, 4)), Q.of(e * e, 4), Q.of(c).sub(Q.of(e * e, 2)), Q.of(c - e)],
          solution: t(
            `**Step 1: Set the expressions equal and collect terms.** Move the line's terms to the left, changing their signs:${collect}**Step 2: Make the discriminant $0$.** Tangent means exactly one common point, so $b^{2} - 4ac = 0$ with $a = 1$, $b = ${e}$, $c = ${c} - k$:${solve}**Check.** With $k = ${num(k)}$ the constant is ${constText}, and the equation is a perfect square with one solution, $x = ${num(Q.of(-e, 2))}$:${square}`,
            `**第一步：令两个表达式相等并整理。** 把直线的各项移到左边并变号：${collect}**第二步：令判别式为 $0$。** 相切就是恰有一个公共点，所以 $b^{2} - 4ac = 0$，其中 $a = 1$，$b = ${e}$，$c = ${c} - k$：${solve}**检验。** $k = ${num(k)}$ 时常数项是 ${constText}，方程是完全平方，只有一个解 $x = ${num(Q.of(-e, 2))}$：${square}`,
          ),
        });
      },
    },
  ],
};

// Module: vertical motion.

/** Units describes the units of a vertical-motion model: g is the coefficient of t², half the acceleration of gravity. */
interface Units {
  readonly g: number;
  readonly en: string;
  readonly zh: string;
  readonly unit: string;
}

const feet: Units = { g: 16, en: "feet", zh: "英尺", unit: "ft" };
const meters: Units = { g: 5, en: "meters", zh: "米", unit: "m" };

const motionObjects: readonly Text[] = [
  t("A ball", "一个球"),
  t("A stone", "一块石头"),
  t("A coin", "一枚硬币"),
  t("A water balloon", "一个水气球"),
];

export const modelingDownwardsVerticalMotion: TopicDef = {
  id: "modeling-downwards-vertical-motion",
  title: t("Modeling Downwards Vertical Motion", "向下竖直运动的建模"),
  summary: t(
    "Use $h = -16t^{2} - vt + h_{0}$ or $h = -5t^{2} - vt + h_{0}$ to find the height of a dropped or thrown-down object and when it lands.",
    "用 $h = -16t^{2} - vt + h_{0}$ 或 $h = -5t^{2} - vt + h_{0}$ 求下落或向下抛出的物体的高度和落地时间。",
  ),
  prerequisites: [
    "graphs-of-general-quadratic-functions",
    "modeling-with-quadratic-equations",
    "solving-perfect-square-quadratic-equations",
  ],
  encompasses: [
    { topic: "modeling-with-quadratic-equations", weight: 0.4 },
    { topic: "solving-perfect-square-quadratic-equations", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSA.CED.A.1"],
  intro: t(
    `We have modeled situations with quadratic equations and solved equations like $t^{2} = 9$ by taking square roots. A falling object is one of the most important such situations. Gravity makes it fall faster and faster, so the distance it has fallen is not proportional to the time but to the **square** of the time. Its height is therefore a quadratic function of time.

Take a stone dropped from $20$ meters. After $t$ seconds it has fallen about $5t^{2}$ meters, so its height is

$$h = -5t^{2} + 20$$

After $1$ second it is at $-5 + 20 = 15$ meters: it has fallen only $5$ meters. After $2$ seconds it is at $-20 + 20 = 0$: in the second second it fell $15$ meters, and it lands.

In this lesson we find the height of a dropped object, when it reaches a given height, and when an object thrown downward lands.`,
    `我们已经用二次方程为实际情境建模，也会用开平方法解 $t^{2} = 9$ 这样的方程。下落的物体是这类情境中最重要的一种。重力使它越落越快，所以下落的距离不与时间成正比，而与时间的**平方**成正比。于是它的高度是时间的二次函数。

取一块从 $20$ 米高处落下的石头。$t$ 秒后它大约下落了 $5t^{2}$ 米，所以它的高度是

$$h = -5t^{2} + 20$$

$1$ 秒后它在 $-5 + 20 = 15$ 米处：只下落了 $5$ 米。$2$ 秒后它在 $-20 + 20 = 0$ 米处：第二秒内下落了 $15$ 米，落到地面。

这节课我们求下落物体的高度、到达某一高度的时间，以及向下抛出的物体的落地时间。`,
  ),
  knowledgePoints: [
    {
      id: "height-of-a-dropped-object",
      figure: algebraDrawings["modeling-downwards-vertical-motion#height-of-a-dropped-object"],
      title: t("The height of a dropped object", "下落物体的高度"),
      explanation: t(
        `An object dropped from a height $h_{0}$ falls faster and faster: the distance it has fallen after $t$ seconds is about $16t^{2}$ feet, or $5t^{2}$ meters, where $5$ rounds $4.9$. Ignoring air resistance, its height is the starting height minus that distance:

$$h = -16t^{2} + h_{0} \\text{ (feet)} \\qquad \\text{or} \\qquad h = -5t^{2} + h_{0} \\text{ (meters)}$$

Dropped from $200$ feet, after $3$ seconds it is at $h = -16 \\cdot 3^{2} + 200 = -144 + 200 = 56$ feet. The graph against $t$ is half of a downward parabola with vertex $(0, h_{0})$.

> **Watch out.** Square the time **first**, then multiply: $-16 \\cdot 3^{2} = -16 \\cdot 9 = -144$, not $-16 \\cdot 3 = -48$ and not $(-16 \\cdot 3)^{2}$. The result is subtracted from the starting height, because the object falls.`,
        `从高度 $h_{0}$ 处落下的物体越落越快：$t$ 秒后下落的距离约为 $16t^{2}$ 英尺，或 $5t^{2}$ 米，其中 $5$ 是 $4.9$ 的近似。忽略空气阻力，它的高度是起始高度减去这段距离：

$$h = -16t^{2} + h_{0}\\text{（英尺）} \\qquad \\text{或} \\qquad h = -5t^{2} + h_{0}\\text{（米）}$$

从 $200$ 英尺高处落下，$3$ 秒后高度是 $h = -16 \\cdot 3^{2} + 200 = -144 + 200 = 56$ 英尺。以 $t$ 为横轴，它的图象是顶点为 $(0, h_{0})$、开口向下的抛物线的一半。

> **注意。** **先**把时间平方，再相乘：$-16 \\cdot 3^{2} = -16 \\cdot 9 = -144$，不是 $-16 \\cdot 3 = -48$，也不是 $(-16 \\cdot 3)^{2}$。结果要从起始高度中减去，因为物体在下落。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const time = rng.int(1, 6);
        const fall = u.g * time * time;
        const h0 = fall + rng.int(1, 40) * (u === feet ? 5 : 2);
        const obj = rng.pick(motionObjects);
        const h = h0 - fall;
        const back = steps(
          `-${u.g}t^{2} + ${h0} = ${h}`,
          `t^{2} = \\frac{${h0} - ${h}}{${u.g}} = \\frac{${fall}}{${u.g}} = ${time * time}`,
        );
        return numberProblem({
          prompt: t(
            `${obj.en} is dropped from a height of $${h0}$ ${u.en}. Its height after $t$ seconds is $h = -${u.g}t^{2} + ${h0}$ ${u.en}. How high is it after $${time}$ seconds?`,
            `${obj["zh-CN"]}从 $${h0}$ ${u.zh}高处落下，$t$ 秒后它的高度是 $h = -${u.g}t^{2} + ${h0}$ ${u.zh}。$${time}$ 秒后它有多高？`,
          ),
          answer: h,
          unit: u.unit,
          wrong: [h0 - u.g * time, h0 + fall, fall, h0 - (u.g * time) ** 2],
          solution: t(
            `**Step 1: Find how far it has fallen.** Square the time first, then multiply by $${u.g}$: $${u.g} \\cdot ${time}^{2} = ${u.g} \\cdot ${time * time} = ${fall}$ ${u.en}.

**Step 2: Subtract from the starting height.** Substitute $t = ${time}$:${steps(`h = -${u.g} \\cdot ${time}^{2} + ${h0} = -${fall} + ${h0} = ${h}`)}It is $${h}$ ${u.en} high.

**Check.** Solving for the time at height $${h}$ gives back $t = ${time}$:${back}and $t = ${time}$ is the positive square root.`,
            `**第一步：求下落了多远。** 先把时间平方，再乘以 $${u.g}$：$${u.g} \\cdot ${time}^{2} = ${u.g} \\cdot ${time * time} = ${fall}$ ${u.zh}。

**第二步：从起始高度中减去。** 代入 $t = ${time}$：${steps(`h = -${u.g} \\cdot ${time}^{2} + ${h0} = -${fall} + ${h0} = ${h}`)}高度是 $${h}$ ${u.zh}。

**检验。** 反过来求高度为 $${h}$ 的时刻，得到 $t = ${time}$：${back}$t = ${time}$ 正是正的平方根。`,
          ),
        });
      },
    },
    {
      id: "time-to-fall",
      title: t("How long it takes to fall", "下落所用的时间"),
      explanation: t(
        `To find **when** a dropped object reaches a height, run the model backwards: set $h$ equal to that height and solve for $t$. There is no $t$-term, so isolate $t^{2}$ and take square roots. It lands when $h = 0$: dropped from $144$ feet,

$$-16t^{2} + 144 = 0 \\Rightarrow -16t^{2} = -144 \\Rightarrow t^{2} = 9 \\Rightarrow t = \\pm 3$$

Time after the drop is positive, so it lands after $3$ seconds. Check: $-16 \\cdot 9 + 144 = 0$.

> **Watch out.** $t^{2} = 9$ is not the answer: take the square root, $t = 3$. Divide by $16$, not by $2 \\cdot 16$, and reject the negative root, which would be a time before the drop.`,
        `要求下落物体**何时**到达某一高度，把模型反过来用：令 $h$ 等于该高度，解出 $t$。方程中没有 $t$ 的一次项，所以先把 $t^{2}$ 单独留在一边，再开平方。落地时 $h = 0$：从 $144$ 英尺高处落下，

$$-16t^{2} + 144 = 0 \\Rightarrow -16t^{2} = -144 \\Rightarrow t^{2} = 9 \\Rightarrow t = \\pm 3$$

落下后的时间是正数，所以 $3$ 秒后落地。检验：$-16 \\cdot 9 + 144 = 0$。

> **注意。** $t^{2} = 9$ 还不是答案：要开平方，$t = 3$。除以 $16$，不是除以 $2 \\cdot 16$；负根表示落下之前的时刻，要舍去。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const time = rng.int(1, 8);
        const ground = rng.bool(0.6);
        const level = ground ? 0 : rng.int(1, 30) * (u === feet ? 4 : 5);
        const h0 = u.g * time * time + level;
        const obj = rng.pick(motionObjects);
        const target = ground ? t("hit the ground", "落地") : t(`reach a height of $${level}$ ${u.en}`, `到达 $${level}$ ${u.zh}的高度`);
        const fall = h0 - level;
        const work = steps(
          `-${u.g}t^{2} + ${h0} = ${level}`,
          `-${u.g}t^{2} = ${-fall}`,
          `t^{2} = \\frac{${fall}}{${u.g}} = ${time * time}`,
          `t = \\pm ${time}`,
        );
        return numberProblem({
          prompt: t(
            `${obj.en} is dropped from a height of $${h0}$ ${u.en}. Its height after $t$ seconds is $h = -${u.g}t^{2} + ${h0}$ ${u.en}. After how many seconds does it ${target.en}?`,
            `${obj["zh-CN"]}从 $${h0}$ ${u.zh}高处落下，$t$ 秒后它的高度是 $h = -${u.g}t^{2} + ${h0}$ ${u.zh}。它在多少秒后${target["zh-CN"]}？`,
          ),
          answer: time,
          unit: "s",
          wrong: [time * time, -time, Q.of(h0, u.g), Q.of(h0 - level, 2 * u.g)],
          solution: t(
            `**Step 1: Set the height.** ${ground ? "It hits the ground when $h = 0$." : `It is at that height when $h = ${level}$.`} Subtract $${h0}$ from both sides, divide by $-${u.g}$ and take square roots:${work}**Step 2: Keep the positive root.** Time after the drop is positive, so $t = ${time}$ seconds.

**Check.** At $t = ${time}$ the height is${steps(`h = -${u.g} \\cdot ${time}^{2} + ${h0} = -${u.g * time * time} + ${h0} = ${level}`)}`,
            `**第一步：令高度相等。** ${ground ? "落地时 $h = 0$。" : `到达该高度时 $h = ${level}$。`}两边减去 $${h0}$，除以 $-${u.g}$，再开平方：${work}**第二步：取正根。** 落下后的时间是正数，所以 $t = ${time}$ 秒。

**检验。** $t = ${time}$ 时高度是${steps(`h = -${u.g} \\cdot ${time}^{2} + ${h0} = -${u.g * time * time} + ${h0} = ${level}`)}`,
          ),
        });
      },
    },
    {
      id: "thrown-downward",
      title: t("Objects thrown downward", "向下抛出的物体"),
      explanation: t(
        `An object thrown **downward** with speed $v$ starts out moving down, so besides the fall due to gravity it loses $v$ units of height each second. The model gets a term $-vt$:

$$h = -16t^{2} - vt + h_{0}$$

Now there is a $t$-term, so solve by factoring. Thrown down at $32$ feet per second from $240$ feet, it lands when

$$-16t^{2} - 32t + 240 = 0 \\Rightarrow -16(t^{2} + 2t - 15) = 0 \\Rightarrow -16(t + 5)(t - 3) = 0$$

so after $3$ seconds; $t = -5$ is rejected.

> **Watch out.** Take out the common factor $-16$ with its sign, so the bracket starts with $t^{2}$. Of the two roots, only the positive one is a time after the throw; the negative root is not the answer, with or without its sign.`,
        `以速度 $v$ **向下**抛出的物体一开始就向下运动，所以除了重力造成的下落外，它每秒还要降低 $v$ 个单位的高度。模型中多了一项 $-vt$：

$$h = -16t^{2} - vt + h_{0}$$

现在有了 $t$ 的一次项，用因式分解来解。从 $240$ 英尺高处以每秒 $32$ 英尺的速度向下抛出，落地时

$$-16t^{2} - 32t + 240 = 0 \\Rightarrow -16(t^{2} + 2t - 15) = 0 \\Rightarrow -16(t + 5)(t - 3) = 0$$

所以 $3$ 秒后落地；舍去 $t = -5$。

> **注意。** 提取公因数 $-16$ 时连同符号一起提出，使括号里以 $t^{2}$ 开头。两个根中只有正根是抛出后的时刻；负根不是答案，去掉符号也不是。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const land = rng.int(1, 6);
        const s = rng.int(land + 1, land + 6);
        const v = u.g * (s - land);
        const h0 = u.g * land * s;
        const obj = rng.pick(motionObjects);
        const work = steps(
          `${quad(-u.g, -v, h0, "t")} = 0`,
          `-${u.g}(${quad(1, s - land, -land * s, "t")}) = 0`,
          `-${u.g}(t + ${s})(t - ${land}) = 0`,
        );
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown downward at $${v}$ ${u.en} per second from a height of $${h0}$ ${u.en}. Its height after $t$ seconds is $h = ${quad(-u.g, -v, h0, "t")}$ ${u.en}. After how many seconds does it hit the ground?`,
            `${obj["zh-CN"]}从 $${h0}$ ${u.zh}高处以每秒 $${v}$ ${u.zh}的速度向下抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, -v, h0, "t")}$ ${u.zh}。它在多少秒后落地？`,
          ),
          answer: land,
          unit: "s",
          wrong: [s, -s, s - land],
          solution: t(
            `**Step 1: Set the height to $0$ and factor.** It hits the ground when $h = 0$. Take out the common factor $-${u.g}$, then factor the bracket:${work}**Step 2: Keep the positive root.** So $t = ${land}$ or $t = -${s}$. Time after the throw is positive, so it lands after $${land}$ seconds.

**Check.** At $t = ${land}$ the height is $0$:${steps(`h = ${evaluation(-u.g, -v, h0, land)}`)}`,
            `**第一步：令高度为 $0$ 并因式分解。** 落地时 $h = 0$。提取公因数 $-${u.g}$，再分解括号：${work}**第二步：取正根。** 所以 $t = ${land}$ 或 $t = -${s}$。抛出后的时间是正数，所以 $${land}$ 秒后落地。

**检验。** $t = ${land}$ 时高度为 $0$：${steps(`h = ${evaluation(-u.g, -v, h0, land)}`)}`,
          ),
        });
      },
    },
  ],
};

/** peakTime writes t = −v / (2 · (−g)) for a vertical-motion model −g t² + v t + h₀, worked to its value. */
const peakTime = (g: number, v: Coefficient, peak: Q) =>
  `t = ${chain(`-\\frac{${num(v)}}{2 \\cdot (-${g})}`, `\\frac{${num(v)}}{${2 * g}}`, num(peak))}`;

export const modelingUpwardsVerticalMotion: TopicDef = {
  id: "modeling-upwards-vertical-motion",
  title: t("Modeling Upwards Vertical Motion", "向上竖直运动的建模"),
  summary: t(
    "Find the maximum height of an object thrown upward, when it reaches it, when it is at a given height and when it lands.",
    "求向上抛出的物体的最大高度、到达最大高度的时间、位于某一高度的时间和落地时间。",
  ),
  prerequisites: ["modeling-downwards-vertical-motion", "the-axis-of-symmetry-of-a-parabola"],
  encompasses: [
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.4 },
    { topic: "modeling-with-quadratic-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSA.CED.A.1"],
  intro: t(
    `A dropped object has height $h = -5t^{2} + h_{0}$ meters, and an object thrown down gets an extra term $-vt$. An object thrown **upward** at $v$ meters per second gains $v$ meters of height each second from its throw, so the term becomes $+vt$:

$$h = -5t^{2} + vt + h_{0}$$

Now the object rises, slows down, stops for an instant and falls back. Take $h = -5t^{2} + 20t$, a ball thrown up from the ground at $20$ meters per second. Its heights after $0, 1, 2, 3, 4$ seconds are $0, 15, 20, 15, 0$. The heights repeat in reverse, because the graph is a downward parabola, symmetric about its axis. The highest point is the vertex, at $t = 2$: the ball reaches $20$ meters and lands after $4$ seconds.

In this lesson we use the axis of symmetry and the vertex to find when an object thrown upward is highest and how high it gets, and we solve for when it is at a given height and when it lands.`,
    `下落物体的高度是 $h = -5t^{2} + h_{0}$ 米，向下抛出的物体多一项 $-vt$。以每秒 $v$ 米的速度**向上**抛出的物体，由于抛出时的速度每秒升高 $v$ 米，所以这一项变成 $+vt$：

$$h = -5t^{2} + vt + h_{0}$$

这时物体先上升，逐渐变慢，在一瞬间停住，再落回来。取 $h = -5t^{2} + 20t$，即以每秒 $20$ 米的速度从地面向上抛出的球。它在 $0, 1, 2, 3, 4$ 秒后的高度是 $0, 15, 20, 15, 0$。高度按相反的顺序重复，因为图象是开口向下的抛物线，关于对称轴对称。最高点是顶点，在 $t = 2$ 处：球升到 $20$ 米，$4$ 秒后落地。

这节课我们用对称轴和顶点求向上抛出的物体何时最高、能升多高，并求它何时位于某一高度、何时落地。`,
  ),
  knowledgePoints: [
    {
      id: "time-to-the-maximum-height",
      figure: algebraDrawings["modeling-upwards-vertical-motion#time-to-the-maximum-height"],
      title: t("When it reaches its maximum height", "何时到达最大高度"),
      explanation: t(
        `An object thrown **upward** with speed $v$ from height $h_{0}$ has height

$$h = -16t^{2} + vt + h_{0}$$

The coefficient of $t^{2}$ is negative, so the graph is a downward parabola and the object is highest at the vertex, on the axis of symmetry $t = -\\frac{b}{2a}$. For $h = -16t^{2} + 48t + 6$:

$$t = -\\frac{48}{2 \\cdot (-16)} = \\frac{48}{32} = 1.5$$

seconds. As a check, the height is $6$ both at $t = 0$ and at $t = 3$, and $1.5$ is halfway between.

> **Watch out.** Here $a = -16$ and $b = 48$: divide by $2a = -32$, not by $-16$, and the two minus signs make the time positive. The question asks for a time, not a height.`,
        `以速度 $v$ 从高度 $h_{0}$ 处**向上**抛出的物体，高度为

$$h = -16t^{2} + vt + h_{0}$$

$t^{2}$ 的系数是负数，所以图象是开口向下的抛物线，物体在顶点处最高，即对称轴 $t = -\\frac{b}{2a}$ 处。对 $h = -16t^{2} + 48t + 6$：

$$t = -\\frac{48}{2 \\cdot (-16)} = \\frac{48}{32} = 1.5$$

秒。检验：在 $t = 0$ 和 $t = 3$ 时高度都是 $6$，而 $1.5$ 恰在两者正中间。

> **注意。** 这里 $a = -16$，$b = 48$：要除以 $2a = -32$，不是除以 $-16$；两个负号使时间为正。题目问的是时间，不是高度。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const twice = rng.int(1, 12);
        const v = u.g * twice;
        const peak = Q.of(twice, 2);
        const h0 = rng.int(0, 30) * (u === feet ? 2 : 1);
        const obj = rng.pick(motionObjects);
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. After how many seconds does it reach its maximum height?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它在多少秒后到达最大高度？`,
          ),
          answer: peak,
          unit: "s",
          wrong: [Q.of(twice), peak.neg(), Q.of(twice, 4)],
          solution: t(
            `**Step 1: Find where the maximum is.** The coefficient of $t^{2}$ is $-${u.g}$, negative, so the graph is a downward parabola and the maximum is at the vertex, on the axis $t = -\\frac{b}{2a}$.

**Step 2: Compute the axis.** With $a = -${u.g}$ and $b = ${v}$:${steps(peakTime(u.g, v, peak))}It is highest after $${num(peak)}$ seconds.

**Check.** The height is $${h0}$ at $t = 0$ and again at $t = ${twice}$:${steps(`h = ${evaluation(-u.g, v, h0, twice)}`)}The top is halfway between these two times: $\\frac{0 + ${twice}}{2} = ${num(peak)}$.`,
            `**第一步：确定最大值的位置。** $t^{2}$ 的系数 $-${u.g}$ 是负数，所以图象是开口向下的抛物线，最大值在顶点处，即对称轴 $t = -\\frac{b}{2a}$ 上。

**第二步：计算对称轴。** $a = -${u.g}$，$b = ${v}$：${steps(peakTime(u.g, v, peak))}$${num(peak)}$ 秒后最高。

**检验。** 在 $t = 0$ 时高度是 $${h0}$，在 $t = ${twice}$ 时又是：${steps(`h = ${evaluation(-u.g, v, h0, twice)}`)}最高点在这两个时刻的正中间：$\\frac{0 + ${twice}}{2} = ${num(peak)}$。`,
          ),
        });
      },
    },
    {
      id: "the-maximum-height",
      figure: algebraDrawings["modeling-upwards-vertical-motion#the-maximum-height"],
      title: t("The maximum height", "最大高度"),
      explanation: t(
        `The maximum height is the $h$-coordinate of the vertex. The formula $-\\frac{b}{2a}$ gives only the time of the vertex, so find that time first, then substitute it into the model. For $h = -16t^{2} + 64t + 5$:

$$t = -\\frac{64}{-32} = 2, \\qquad h = -16 \\cdot 2^{2} + 64 \\cdot 2 + 5 = -64 + 128 + 5 = 69$$

The maximum height is $69$ feet, reached after $2$ seconds.

> **Watch out.** The answer is the height $69$, not the time $2$. Substitute into **every** term: dropping $-16t^{2}$ gives $133$, and dropping the starting height $5$ gives $64$.`,
        `最大高度是顶点的 $h$ 坐标。公式 $-\\frac{b}{2a}$ 只给出顶点对应的时间，所以先求这个时间，再把它代入模型。对 $h = -16t^{2} + 64t + 5$：

$$t = -\\frac{64}{-32} = 2, \\qquad h = -16 \\cdot 2^{2} + 64 \\cdot 2 + 5 = -64 + 128 + 5 = 69$$

最大高度是 $69$ 英尺，在 $2$ 秒后达到。

> **注意。** 答案是高度 $69$，不是时间 $2$。要代入**每一项**：漏掉 $-16t^{2}$ 会得到 $133$，漏掉起始高度 $5$ 会得到 $64$。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const peak = u === feet ? Q.of(rng.int(1, 10), 2) : Q.of(rng.int(1, 6));
        const v = Q.of(2 * u.g).mul(peak);
        const h0 = rng.int(0, 40);
        const top = Q.of(u.g).mul(peak).mul(peak).add(Q.of(h0));
        const obj = rng.pick(motionObjects);
        const back = steps(
          chain(
            vertexForm(-u.g, peak, top, "t"),
            `${quad(-u.g, v, Q.of(-u.g).mul(peak).mul(peak), "t")}${tail(top)}`,
            quad(-u.g, v, h0, "t"),
          ),
        );
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. What is its maximum height?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它的最大高度是多少？`,
          ),
          answer: top,
          unit: u.unit,
          wrong: [top.sub(Q.of(h0)), peak, v.mul(peak).add(Q.of(h0)), Q.of(u.g).mul(peak).mul(peak).neg().add(Q.of(h0))],
          solution: t(
            `**Step 1: Find the time of the vertex.** With $a = -${u.g}$ and $b = ${num(v)}$:${steps(peakTime(u.g, v, peak))}**Step 2: Substitute that time.** Put $t = ${num(peak)}$ into every term:${steps(`h = ${evaluation(-u.g, v, h0, peak)}`)}The maximum height is $${num(top)}$ ${u.en}.

**Check.** In vertex form the model shows the top $(${num(peak)}, ${num(top)})$ directly, and it expands back to the given model:${back}`,
            `**第一步：求顶点对应的时间。** $a = -${u.g}$，$b = ${num(v)}$：${steps(peakTime(u.g, v, peak))}**第二步：代入这个时间。** 把 $t = ${num(peak)}$ 代入每一项：${steps(`h = ${evaluation(-u.g, v, h0, peak)}`)}最大高度是 $${num(top)}$ ${u.zh}。

**检验。** 写成顶点式，模型直接显示最高点 $(${num(peak)}, ${num(top)})$，展开后就是原来的模型：${back}`,
          ),
        });
      },
    },
    {
      id: "time-to-land",
      title: t("When it lands", "何时落地"),
      explanation: t(
        `The object lands when its height is $0$, so solve $h = 0$. Factor out the coefficient of $t^{2}$ and factor the rest:

$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$

The negative solution is a time before the throw, so the object lands after $3$ seconds. Thrown from the ground, $h_{0} = 0$ and one solution is $t = 0$, the moment of the throw.

> **Watch out.** Keep the solution that is a time **after** the throw: not the negative root, and not $t = 0$ when it is thrown from the ground. The time of the top, halfway, is not the landing time either.`,
        `物体落地时高度为 $0$，所以解 $h = 0$。提出 $t^{2}$ 的系数，再分解剩下的部分：

$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$

负数解是抛出之前的时间，所以物体在 $3$ 秒后落地。从地面抛出时 $h_{0} = 0$，有一个解是 $t = 0$，即抛出的时刻。

> **注意。** 保留抛出**之后**的那个时间：不是负根，从地面抛出时也不是 $t = 0$。到达最高点的时间（在中间）也不是落地时间。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const land = rng.int(2, 9);
        const s = rng.int(0, land - 1);
        const v = u.g * (land - s);
        const h0 = u.g * land * s;
        const obj = rng.pick(motionObjects);
        const factored = s === 0 ? `-${u.g}t(t - ${land})` : `-${u.g}(t - ${land})(t + ${s})`;
        const work = steps(`${quad(-u.g, v, h0, "t")} = 0`, `-${u.g}(${quad(1, -(land - s), -land * s, "t")}) = 0`, `${factored} = 0`);
        return numberProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. After how many seconds does it hit the ground?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它在多少秒后落地？`,
          ),
          answer: land,
          unit: "s",
          wrong: [-s, Q.of(land - s, 2), land - s, s],
          solution: t(
            `**Step 1: Set the height to $0$ and factor.** It lands when $h = 0$. Take out $-${u.g}$, then factor:${work}**Step 2: Choose the landing time.** So $t = ${land}$ or $t = ${s === 0 ? 0 : -s}$. ${s === 0 ? "At $t = 0$ it is thrown" : "The negative time is before the throw"}, so it lands after $${land}$ seconds.

**Check.** At $t = ${land}$ the height is $0$:${steps(`h = ${evaluation(-u.g, v, h0, land)}`)}`,
            `**第一步：令高度为 $0$ 并因式分解。** 落地时 $h = 0$。提出 $-${u.g}$，再分解：${work}**第二步：选出落地时间。** 所以 $t = ${land}$ 或 $t = ${s === 0 ? 0 : -s}$。${s === 0 ? "$t = 0$ 是抛出的时刻" : "负的时间在抛出之前"}，所以 $${land}$ 秒后落地。

**检验。** $t = ${land}$ 时高度为 $0$：${steps(`h = ${evaluation(-u.g, v, h0, land)}`)}`,
          ),
        });
      },
    },
    {
      id: "times-at-a-height",
      title: t("When it is at a given height", "何时位于某一高度"),
      explanation: t(
        `Below its maximum, the object passes each height twice: once going up and once coming down. A horizontal line below the vertex meets a downward parabola twice. Set $h$ equal to the height, bring everything to one side and solve:

$$-16t^{2} + 64t + 10 = 58 \\Rightarrow -16t^{2} + 64t - 48 = 0 \\Rightarrow -16(t - 1)(t - 3) = 0$$

It is at $58$ feet after $1$ second, going up, and after $3$ seconds, coming down. Both times count.

> **Watch out.** Give **both** times: the question asks for every time it is at that height. Move the height to the left side before factoring, so the equation equals $0$; then both roots are positive times.`,
        `在最大高度以下，物体会两次经过同一高度：一次上升，一次下降。顶点下方的水平直线与开口向下的抛物线有两个交点。令 $h$ 等于该高度，把所有项移到一边再求解：

$$-16t^{2} + 64t + 10 = 58 \\Rightarrow -16t^{2} + 64t - 48 = 0 \\Rightarrow -16(t - 1)(t - 3) = 0$$

它在 $1$ 秒后（上升时）和 $3$ 秒后（下降时）位于 $58$ 英尺高处。两个时间都符合。

> **注意。** **两个**时间都要写：题目问的是它位于该高度的所有时刻。因式分解前先把高度移到左边，使方程等于 $0$；这样两个根都是正的时间。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const t1 = rng.int(1, 4);
        const t2 = rng.int(t1 + 1, t1 + 4);
        const v = u.g * (t1 + t2);
        const h0 = rng.int(0, 20);
        const level = h0 + u.g * t1 * t2;
        const obj = rng.pick(motionObjects);
        const work = steps(
          `${quad(-u.g, v, h0, "t")} = ${level}`,
          `${quad(-u.g, v, h0 - level, "t")} = 0`,
          `-${u.g}(${quad(1, -(t1 + t2), t1 * t2, "t")}) = 0`,
          `-${u.g}(t - ${t1})(t - ${t2}) = 0`,
        );
        return solutionsProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. At what times is it $${level}$ ${u.en} high?`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。它在什么时刻位于 $${level}$ ${u.zh}高处？`,
          ),
          values: [String(t1), String(t2)],
          variable: "t",
          wrong: [[String(t1)], [String(t2)], [String(-t1), String(-t2)]],
          solution: t(
            `**Step 1: Set the height and factor.** Put $h = ${level}$, subtract $${level}$ from both sides, take out $-${u.g}$ and factor:${work}**Step 2: Keep both times.** Both roots are positive: it is at that height at $t = ${t1}$ (going up) and $t = ${t2}$ (coming down).

**Check.** Both times give the height $${level}$:${steps(`h = ${evaluation(-u.g, v, h0, t1)}`, `h = ${evaluation(-u.g, v, h0, t2)}`)}`,
            `**第一步：令高度相等并因式分解。** 令 $h = ${level}$，两边减去 $${level}$，提出 $-${u.g}$ 再分解：${work}**第二步：两个时间都保留。** 两个根都是正数：它在 $t = ${t1}$（上升时）和 $t = ${t2}$（下降时）位于该高度。

**检验。** 两个时刻的高度都是 $${level}$：${steps(`h = ${evaluation(-u.g, v, h0, t1)}`, `h = ${evaluation(-u.g, v, h0, t2)}`)}`,
          ),
        });
      },
    },
  ],
};

export const verticalMotion: TopicDef = {
  id: "vertical-motion",
  title: t("Vertical Motion", "竖直运动"),
  summary: t(
    "Write the model of an object moving vertically from its initial height and velocity, and answer questions about it with the quadratic formula.",
    "由初始高度和初速度写出竖直运动物体的模型，并用求根公式回答有关问题。",
  ),
  prerequisites: ["modeling-upwards-vertical-motion", "the-quadratic-formula"],
  encompasses: [
    { topic: "modeling-upwards-vertical-motion", weight: 0.5 },
    { topic: "the-quadratic-formula", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.HSF.IF.B.4"],
  intro: t(
    `Dropped, thrown down and thrown up, the objects of the last two lessons all follow one model. Only the sign and the size of the starting velocity $v_{0}$ change: it is $0$ for a drop, negative for a throw downward and positive for a throw upward. With $g$ the acceleration of gravity,

$$h(t) = -\\frac{1}{2}gt^{2} + v_{0}t + h_{0}$$

So we can write the model ourselves from a description. A ball thrown upward at $40$ feet per second from $6$ feet, with $g = 32$ ft/s², has $h(t) = -16t^{2} + 40t + 6$. When does it land? Setting $h(t) = 0$ gives $-16t^{2} + 40t + 6 = 0$, or $8t^{2} - 20t - 3 = 0$, which does not factor over the integers. The quadratic formula still solves it.

In this lesson we write the model of vertical motion, find how long an object stays above a height, and find landing times with the quadratic formula.`,
    `落下的、向下抛出的、向上抛出的，前两节课里的物体都遵循同一个模型。变化的只是初速度 $v_{0}$ 的符号和大小：自由落下时为 $0$，向下抛出时为负，向上抛出时为正。设 $g$ 为重力加速度，

$$h(t) = -\\frac{1}{2}gt^{2} + v_{0}t + h_{0}$$

所以我们可以根据描述自己写出模型。从 $6$ 英尺高处以每秒 $40$ 英尺的速度向上抛出的球，取 $g = 32$ ft/s²，有 $h(t) = -16t^{2} + 40t + 6$。它何时落地？令 $h(t) = 0$ 得 $-16t^{2} + 40t + 6 = 0$，即 $8t^{2} - 20t - 3 = 0$，它不能在整数范围内分解。求根公式仍然可以解它。

这节课我们写出竖直运动的模型，求物体高于某一高度的时长，并用求根公式求落地时间。`,
  ),
  knowledgePoints: [
    {
      id: "writing-the-model",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        `The height of an object moving only under gravity, with initial height $h_{0}$ and initial velocity $v_{0}$ (positive upward, negative downward), is

$$h(t) = -\\frac{1}{2}gt^{2} + v_{0}t + h_{0}$$

with $g = 32$ ft/s², giving $-16t^{2}$, or $g \\approx 10$ m/s², giving $-5t^{2}$. Each term has a meaning: $h_{0}$ is where the object starts, $v_{0}t$ is how far its starting speed alone would carry it, and $-\\frac{1}{2}gt^{2}$ is how far gravity pulls it back. Thrown upward at $40$ ft/s from $6$ ft: $h(t) = -16t^{2} + 40t + 6$, and $h(0) = 6$ is the starting height.

> **Watch out.** The coefficient of $t^{2}$ is **half** of $g$, with a minus sign: $-16$, not $-32$ or $+16$. A throw downward makes $v_{0}$ negative, and $h_{0}$ is the constant term, not the coefficient of $t$.`,
        `只受重力作用的物体，初始高度为 $h_{0}$、初速度为 $v_{0}$（向上为正，向下为负），它的高度是

$$h(t) = -\\frac{1}{2}gt^{2} + v_{0}t + h_{0}$$

其中 $g = 32$ ft/s²，得到 $-16t^{2}$；或 $g \\approx 10$ m/s²，得到 $-5t^{2}$。每一项都有含义：$h_{0}$ 是物体的起点，$v_{0}t$ 是仅凭初速度能移动的距离，$-\\frac{1}{2}gt^{2}$ 是重力把它拉回的距离。从 $6$ 英尺高处以 $40$ ft/s 向上抛出：$h(t) = -16t^{2} + 40t + 6$，而 $h(0) = 6$ 正是起始高度。

> **注意。** $t^{2}$ 的系数是 $g$ 的**一半**，并带负号：$-16$，不是 $-32$ 或 $+16$。向下抛出时 $v_{0}$ 为负；$h_{0}$ 是常数项，不是 $t$ 的系数。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const v = rng.int(1, 20) * (u === feet ? 4 : 2);
        const h0 = rng.int(0, 60);
        const up = rng.bool(0.7);
        const v0 = up ? v : -v;
        const obj = rng.pick(motionObjects);
        const from = h0 === 0 ? t("from the ground", "从地面") : t(`from a height of $${h0}$ ${u.en}`, `从 $${h0}$ ${u.zh}高处`);
        const model = quad(-u.g, v0, h0, "t");
        return expressionProblem({
          prompt: t(
            `${obj.en} is thrown ${up ? "upward" : "downward"} at $${v}$ ${u.en} per second ${from.en}. Using $g = ${u === feet ? "32 \\text{ ft/s}^{2}" : "10 \\text{ m/s}^{2}"}$, write its height $h(t)$ in ${u.en} after $t$ seconds.`,
            `${obj["zh-CN"]}${from["zh-CN"]}以每秒 $${v}$ ${u.zh}的速度向${up ? "上" : "下"}抛出。取 $g = ${u === feet ? "32 \\text{ ft/s}^{2}" : "10 \\text{ m/s}^{2}"}$，写出 $t$ 秒后它的高度 $h(t)$（单位：${u.zh}）。`,
          ),
          answer: model,
          prefix: "h(t) =",
          wrong: [quad(-2 * u.g, v0, h0, "t"), quad(u.g, v0, h0, "t"), quad(-u.g, -v0, h0, "t"), quad(-u.g, h0, v0, "t")],
          solution: t(
            `**Step 1: Find the coefficient of $t^{2}$.** It is $-\\frac{1}{2}g = -\\frac{1}{2} \\cdot ${2 * u.g} = -${u.g}$.

**Step 2: Read $v_{0}$ and $h_{0}$.** The object is thrown ${up ? "upward, so $v_{0}$ is positive" : "downward, so $v_{0}$ is negative"}: $v_{0} = ${v0}$. It starts ${h0 === 0 ? "on the ground, so $h_{0} = 0$" : `at $h_{0} = ${h0}$`}. So${steps(`h(t) = ${model}`)}**Check.** At $t = 0$ the model gives the starting height, $h(0) = ${h0}$. The $t$-term is ${up ? "positive, so the height first increases, as for a throw upward" : "negative, so the height decreases from the start, as for a throw downward"}.`,
            `**第一步：求 $t^{2}$ 的系数。** 它是 $-\\frac{1}{2}g = -\\frac{1}{2} \\cdot ${2 * u.g} = -${u.g}$。

**第二步：读出 $v_{0}$ 和 $h_{0}$。** 物体${up ? "向上抛出，所以 $v_{0}$ 为正" : "向下抛出，所以 $v_{0}$ 为负"}：$v_{0} = ${v0}$。它${h0 === 0 ? "从地面出发，所以 $h_{0} = 0$" : `从 $h_{0} = ${h0}$ 处出发`}。所以${steps(`h(t) = ${model}`)}**检验。** 在 $t = 0$ 时模型给出起始高度 $h(0) = ${h0}$。$t$ 的一次项${up ? "为正，所以高度先增大，符合向上抛出" : "为负，所以高度从一开始就减小，符合向下抛出"}。`,
          ),
        });
      },
    },
    {
      id: "time-above-a-height",
      title: t("How long it stays above a height", "高于某一高度的时长"),
      explanation: t(
        `A downward parabola is above a horizontal line between the two points where it crosses it. So an object thrown upward is above a height $H$ between the two times it passes $H$, going up and coming down. Solve $h(t) = H$ and subtract the times. For $h = -16t^{2} + 96t$ and $H = 128$:

$$-16t^{2} + 96t - 128 = 0 \\Rightarrow -16(t - 2)(t - 4) = 0$$

It is above $128$ feet from $t = 2$ to $t = 4$, for $4 - 2 = 2$ seconds.

> **Watch out.** The question asks for a **length** of time: subtract the two times. Neither time alone, nor their sum, is the answer.`,
        `开口向下的抛物线在它与一条水平直线的两个交点之间位于直线上方。所以向上抛出的物体在两次经过高度 $H$（上升一次、下降一次）之间高于 $H$。解 $h(t) = H$，再把两个时间相减。对 $h = -16t^{2} + 96t$，$H = 128$：

$$-16t^{2} + 96t - 128 = 0 \\Rightarrow -16(t - 2)(t - 4) = 0$$

它从 $t = 2$ 到 $t = 4$ 高于 $128$ 英尺，共 $4 - 2 = 2$ 秒。

> **注意。** 题目问的是一段**时长**：要把两个时间相减。单独一个时间或两个时间之和都不是答案。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        const t1 = Q.of(rng.int(1, 8), 2);
        const t2 = t1.add(Q.of(rng.int(1, 8), 2));
        const g = Q.of(u.g);
        const v = g.mul(t1.add(t2));
        const h0 = rng.int(0, 20);
        const level = g.mul(t1).mul(t2).add(Q.of(h0));
        if (!v.isInteger() || !level.isInteger()) {
          // Keep the coefficients integers: fall back to whole seconds.
          const a = rng.int(1, 3);
          const b = a + rng.int(1, 4);
          return aboveProblem(rng, u, Q.of(a), Q.of(b), h0);
        }
        return aboveProblem(rng, u, t1, t2, h0);
      },
    },
    {
      id: "landing-time-with-the-quadratic-formula",
      title: t("Landing times with the quadratic formula", "用求根公式求落地时间"),
      explanation: t(
        `When $h(t) = 0$ does not factor, the quadratic formula still gives its solutions. Divide by the coefficient of $t^{2}$ first to get simpler numbers. For $h = -5t^{2} + 5t + 20$:

$$-5(t^{2} - t - 4) = 0 \\Rightarrow t = \\frac{1 \\pm \\sqrt{1 + 16}}{2} = \\frac{1 \\pm \\sqrt{17}}{2}$$

Since $\\sqrt{17} > 1$, the solution with $-$ is negative, a time before the throw. Only $t = \\frac{1 + \\sqrt{17}}{2} \\approx 2.56$ is positive, so it lands after about $2.56$ seconds.

> **Watch out.** With $b = -1$ and $c = -4$, the formula has $-b = 1$ and $b^{2} - 4ac = 1 + 16$: the two minus signs make a plus. Give only the positive solution, the landing time.`,
        `当 $h(t) = 0$ 不能分解时，求根公式仍能给出它的解。先提出 $t^{2}$ 的系数，使数字更简单。对 $h = -5t^{2} + 5t + 20$：

$$-5(t^{2} - t - 4) = 0 \\Rightarrow t = \\frac{1 \\pm \\sqrt{1 + 16}}{2} = \\frac{1 \\pm \\sqrt{17}}{2}$$

因为 $\\sqrt{17} > 1$，取 $-$ 的解是负数，是抛出之前的时刻。只有 $t = \\frac{1 + \\sqrt{17}}{2} \\approx 2.56$ 是正数，所以大约 $2.56$ 秒后落地。

> **注意。** $b = -1$，$c = -4$，所以公式里 $-b = 1$，$b^{2} - 4ac = 1 + 16$：两个负号相乘得正。只写正数解，即落地时间。`,
      ),
      generate(rng) {
        const u = rng.pick([feet, meters]);
        let p: number;
        let q: number;
        do {
          p = rng.int(0, 7);
          q = rng.int(1, 12);
        } while (isSquare(p * p + 4 * q));
        const v = u.g * p;
        const h0 = u.g * q;
        const roots = rootsOf(1, -p, -q);
        const obj = rng.pick(motionObjects);
        const d = p * p + 4 * q;
        const exact = chain(p === 0 ? `\\sqrt{${q}}` : `\\frac{${p} + \\sqrt{${d}}}{2}`, roots[0]!);
        const divided = steps(`${quad(-u.g, v, h0, "t")} = 0`, `${quad(1, -p, -q, "t")} = 0`);
        const formula =
          p === 0
            ? steps(`t^{2} = ${q}`, `t = \\pm \\sqrt{${q}}`)
            : steps(`t = \\frac{${p} \\pm \\sqrt{${paren(-p)}^{2} - 4 \\cdot 1 \\cdot (-${q})}}{2} = \\frac{${p} \\pm \\sqrt{${d}}}{2}`);
        const sign =
          p === 0
            ? t("The solution with $-$ is negative", "取 $-$ 的解是负数")
            : t(
                `Since $\\sqrt{${d}} > \\sqrt{${p * p}} = ${p}$, the solution with $-$ is negative`,
                `因为 $\\sqrt{${d}} > \\sqrt{${p * p}} = ${p}$，取 $-$ 的解是负数`,
              );
        const check =
          p === 0
            ? t(
                `**Check.** Substituting $t = \\sqrt{${q}}$ gives height $0$:${steps(`h = -${u.g} \\cdot (\\sqrt{${q}})^{2} + ${h0} = -${u.g * q} + ${h0} = 0`)}`,
                `**检验。** 代入 $t = \\sqrt{${q}}$，高度为 $0$：${steps(`h = -${u.g} \\cdot (\\sqrt{${q}})^{2} + ${h0} = -${u.g * q} + ${h0} = 0`)}`,
              )
            : t(
                `**Check.** The two solutions of $${quad(1, -p, -q, "t")} = 0$ must add to $${p}$ and multiply to $${-q}$:${steps(`\\frac{${p} + \\sqrt{${d}}}{2} + \\frac{${p} - \\sqrt{${d}}}{2} = \\frac{${2 * p}}{2} = ${p}`, `\\frac{${p} + \\sqrt{${d}}}{2} \\cdot \\frac{${p} - \\sqrt{${d}}}{2} = \\frac{${p * p} - ${d}}{4} = \\frac{${-4 * q}}{4} = ${-q}`)}`,
                `**检验。** $${quad(1, -p, -q, "t")} = 0$ 的两个解之和应为 $${p}$，之积应为 $${-q}$：${steps(`\\frac{${p} + \\sqrt{${d}}}{2} + \\frac{${p} - \\sqrt{${d}}}{2} = \\frac{${2 * p}}{2} = ${p}`, `\\frac{${p} + \\sqrt{${d}}}{2} \\cdot \\frac{${p} - \\sqrt{${d}}}{2} = \\frac{${p * p} - ${d}}{4} = \\frac{${-4 * q}}{4} = ${-q}`)}`,
              );
        return solutionsProblem({
          prompt: t(
            `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${quad(-u.g, v, h0, "t")}$ ${u.en}. Find the exact time when it hits the ground.`,
            `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${quad(-u.g, v, h0, "t")}$ ${u.zh}。求它落地的准确时刻。`,
          ),
          values: [roots[0]!],
          variable: "t",
          wrong: [roots, [roots[1]!]],
          solution: t(
            `**Step 1: Set $h = 0$ and divide by $-${u.g}$.**${divided}**Step 2: ${p === 0 ? "Take square roots" : "Use the quadratic formula"}.** ${p === 0 ? "There is no $t$-term:" : `With $a = 1$, $b = ${-p}$ and $c = ${-q}$:`}${formula}**Step 3: Keep the positive solution.** ${sign.en}, a time before the throw. So it lands at $t = ${exact}$ seconds.

${check.en}`,
            `**第一步：令 $h = 0$，两边除以 $-${u.g}$。**${divided}**第二步：${p === 0 ? "开平方" : "用求根公式"}。** ${p === 0 ? "没有 $t$ 的一次项：" : `$a = 1$，$b = ${-p}$，$c = ${-q}$：`}${formula}**第三步：保留正数解。** ${sign["zh-CN"]}，是抛出之前的时刻。所以落地时刻是 $t = ${exact}$ 秒。

${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** aboveProblem asks how long an object thrown upward stays above the height it passes at times t1 < t2. */
function aboveProblem(rng: Rng, u: Units, t1: Q, t2: Q, h0: number) {
  const g = Q.of(u.g);
  const v = g.mul(t1.add(t2));
  const level = g.mul(t1).mul(t2).add(Q.of(h0));
  const obj = rng.pick(motionObjects);
  const span = t2.sub(t1);
  const h = quad(-u.g, v, h0, "t");
  const work = steps(
    `${h} = ${num(level)}`,
    `${quad(-u.g, v, Q.of(h0).sub(level), "t")} = 0`,
    `-${u.g}${factor(t1, "t")}${factor(t2, "t")} = 0`,
  );
  const check = steps(`h = ${evaluation(-u.g, v, h0, t1)}`, `h = ${evaluation(-u.g, v, h0, t2)}`);
  return numberProblem({
    prompt: t(
      `${obj.en} is thrown upward. Its height after $t$ seconds is $h = ${h}$ ${u.en}. For how many seconds is it higher than $${num(level)}$ ${u.en}?`,
      `${obj["zh-CN"]}被向上抛出，$t$ 秒后它的高度是 $h = ${h}$ ${u.zh}。它高于 $${num(level)}$ ${u.zh}的时间有多少秒？`,
    ),
    answer: span,
    unit: "s",
    wrong: [t2, t1, t1.add(t2)],
    solution: t(
      `**Step 1: Find when it passes that height.** Set $h = ${num(level)}$, bring everything to one side and factor:${work}So it is at $${num(level)}$ ${u.en} at $t = ${num(t1)}$, going up, and at $t = ${num(t2)}$, coming down.

**Step 2: Subtract the times.** Between them the object is higher, so it stays above that height for${steps(`${num(t2)} - ${num(t1)} = ${num(span)}`)}seconds.

**Check.** Both times give the height $${num(level)}$:${check}`,
      `**第一步：求它经过该高度的时刻。** 令 $h = ${num(level)}$，移到一边并因式分解：${work}所以它在 $t = ${num(t1)}$（上升时）和 $t = ${num(t2)}$（下降时）位于 $${num(level)}$ ${u.zh}处。

**第二步：把时间相减。** 在这两个时刻之间物体更高，所以它高于该高度的时长是${steps(`${num(t2)} - ${num(t1)} = ${num(span)}`)}秒。

**检验。** 两个时刻的高度都是 $${num(level)}$：${check}`,
    ),
  });
}

// Module: revenue, cost and profit.

const goods: readonly { en: string; zh: string }[] = [
  { en: "T-shirts", zh: "T恤" },
  { en: "cakes", zh: "蛋糕" },
  { en: "lamps", zh: "台灯" },
  { en: "backpacks", zh: "背包" },
  { en: "phone cases", zh: "手机壳" },
];

export const revenueCostAndProfitFunctions: TopicDef = {
  id: "revenue-cost-and-profit-functions",
  title: t("Revenue, Cost, and Profit Functions", "收入、成本与利润函数"),
  summary: t(
    "Use revenue and cost functions to compute profit, and find the profit function $P(x) = R(x) - C(x)$.",
    "用收入函数和成本函数计算利润，并求利润函数 $P(x) = R(x) - C(x)$。",
  ),
  prerequisites: ["arithmetic-of-functions", "modeling-with-linear-functions"],
  encompasses: [{ topic: "arithmetic-of-functions", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.A.1.B", "CCSS.HSA.CED.A.2"],
  intro: t(
    `We can model a quantity that grows at a constant rate with a linear function, and we can subtract one function from another. A business needs both. The money it takes in and the money it spends are two functions of the number of items it sells, and what it keeps is their difference.

Take a stall selling cups of lemonade at $\\$5$ each. Lemons and cups cost $\\$2$ per cup, and the stall costs $\\$60$ a day however much it sells. Selling $x$ cups brings in $R(x) = 5x$ and costs $C(x) = 2x + 60$, so it keeps

$$P(x) = 5x - (2x + 60) = 3x - 60$$

At $30$ cups that is $3 \\cdot 30 - 60 = 30$ dollars; at $10$ cups it is $-30$, a loss.

In this lesson we compute profit, find the profit function, and see how a price that depends on the number sold makes revenue quadratic.`,
    `我们会用一次函数为匀速变化的量建模，也会把两个函数相减。做生意两者都要用到。收进的钱和花出的钱都是售出件数的函数，留下的钱就是它们的差。

一个柠檬水摊每杯卖 $5$ 元。柠檬和杯子每杯花 $2$ 元，摊位每天要 $60$ 元，卖多少都一样。卖出 $x$ 杯，收入 $R(x) = 5x$，成本 $C(x) = 2x + 60$，所以留下

$$P(x) = 5x - (2x + 60) = 3x - 60$$

卖 $30$ 杯时是 $3 \\cdot 30 - 60 = 30$ 元；卖 $10$ 杯时是 $-30$ 元，即亏损。

这节课我们计算利润、求利润函数，并看到价格随销量变化时收入为什么是二次函数。`,
  ),
  knowledgePoints: [
    {
      id: "computing-profit",
      title: t("Computing profit", "计算利润"),
      explanation: t(
        `When a business makes and sells $x$ items:

- the **revenue** $R(x)$ is the money it takes in;
- the **cost** $C(x)$ is the money it spends, usually a **fixed cost** paid anyway plus a **variable cost** for each item;
- the **profit** is what is left: $P(x) = R(x) - C(x)$.

With $R(x) = 25x$ and $C(x) = 400 + 9x$, selling $30$ items gives $R(30) = 750$ and $C(30) = 670$, so the profit is $750 - 670 = 80$ dollars. Another way to see it: each item brings in $25 - 9 = 16$ dollars more than it costs, and $30 \\cdot 16 - 400 = 80$. A negative profit is a loss.

> **Watch out.** Subtract the **whole** cost, the fixed cost and the variable cost together, and subtract cost from revenue, not revenue from cost. Profit is never revenue plus cost.`,
        `企业生产并售出 $x$ 件商品时：

- **收入** $R(x)$ 是收进的钱；
- **成本** $C(x)$ 是花出的钱，通常是无论如何都要付的**固定成本**加上每件商品的**可变成本**；
- **利润**是剩下的钱：$P(x) = R(x) - C(x)$。

若 $R(x) = 25x$，$C(x) = 400 + 9x$，售出 $30$ 件时 $R(30) = 750$，$C(30) = 670$，利润是 $750 - 670 = 80$ 元。也可以这样看：每件收进的钱比它的成本多 $25 - 9 = 16$ 元，而 $30 \\cdot 16 - 400 = 80$。利润为负表示亏损。

> **注意。** 要减去**整个**成本，即固定成本和可变成本一起减；是收入减成本，不是成本减收入。利润也绝不是收入加成本。`,
      ),
      generate(rng) {
        const price = rng.int(8, 40);
        const variable = rng.int(2, price - 2);
        const fixed = rng.int(5, 60) * 10;
        const n = rng.int(5, 80);
        const R = price * n;
        const C = fixed + variable * n;
        const margin = price - variable;
        const check = steps(
          `${n} \\cdot (${price} - ${variable}) - ${fixed} = ${n} \\cdot ${margin} - ${fixed} = ${n * margin} - ${fixed} = ${R - C}`,
        );
        return numberProblem({
          prompt: t(
            `A company's revenue and cost, in dollars, for $x$ items are $R(x) = ${price}x$ and $C(x) = ${fixed} + ${variable}x$. Find its profit when it makes and sells $${n}$ items.`,
            `某公司生产并售出 $x$ 件商品的收入和成本（单位：元）为 $R(x) = ${price}x$，$C(x) = ${fixed} + ${variable}x$。求生产并售出 $${n}$ 件时的利润。`,
          ),
          answer: R - C,
          wrong: [R + C, R - fixed, R - variable * n, C - R],
          solution: t(
            `**Step 1: Find the revenue.**${steps(`R(${n}) = ${price} \\cdot ${n} = ${R}`)}**Step 2: Find the cost.** The fixed cost and the variable cost of $${n}$ items together:${steps(`C(${n}) = ${fixed} + ${variable} \\cdot ${n} = ${C}`)}**Step 3: Subtract the cost from the revenue.**${steps(`P(${n}) = ${R} - ${C} = ${R - C}`)}The profit is $${R - C}$ dollars${R - C < 0 ? ", a loss" : ""}.

**Check.** Each item brings in $${margin}$ dollars more than its variable cost, and the fixed cost comes off once:${check}`,
            `**第一步：求收入。**${steps(`R(${n}) = ${price} \\cdot ${n} = ${R}`)}**第二步：求成本。** 固定成本加上 $${n}$ 件的可变成本：${steps(`C(${n}) = ${fixed} + ${variable} \\cdot ${n} = ${C}`)}**第三步：收入减去成本。**${steps(`P(${n}) = ${R} - ${C} = ${R - C}`)}利润是 $${R - C}$ 元${R - C < 0 ? "，即亏损" : ""}。

**检验。** 每件收进的钱比它的可变成本多 $${margin}$ 元，固定成本只减一次：${check}`,
          ),
        });
      },
    },
    {
      id: "the-profit-function",
      title: t("The profit function", "利润函数"),
      explanation: t(
        `The profit function gives the profit for every number of items at once: $P(x) = R(x) - C(x)$. To find it, subtract the **whole** cost function, in parentheses, then combine like terms:

$$P(x) = (-2x^{2} + 90x) - (15x + 300) = -2x^{2} + 90x - 15x - 300 = -2x^{2} + 75x - 300$$

At $x = 10$: $R(10) - C(10) = 700 - 450 = 250$, and $P(10) = -200 + 750 - 300 = 250$ too.

> **Watch out.** The minus sign in front of the parentheses changes the sign of **every** term of $C(x)$, the fixed cost included: $-(15x + 300) = -15x - 300$, not $-15x + 300$.`,
        `利润函数一次给出所有件数下的利润：$P(x) = R(x) - C(x)$。求它时，要减去**整个**成本函数，加上括号，再合并同类项：

$$P(x) = (-2x^{2} + 90x) - (15x + 300) = -2x^{2} + 90x - 15x - 300 = -2x^{2} + 75x - 300$$

在 $x = 10$ 处：$R(10) - C(10) = 700 - 450 = 250$，而 $P(10) = -200 + 750 - 300 = 250$，也一样。

> **注意。** 括号前的减号使 $C(x)$ 的**每一项**都变号，包括固定成本：$-(15x + 300) = -15x - 300$，不是 $-15x + 300$。`,
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(30, 150);
        const m = rng.int(3, 25);
        const F = rng.int(5, 80) * 10;
        const R10 = -100 * a + 10 * b;
        const C10 = 10 * m + F;
        const work = steps(
          `P(x) = (${quad(-a, b, 0)}) - (${linear(m, F)})`,
          `P(x) = ${poly([-a, "x^{2}"], [b, "x"], [-m, "x"], [-F, ""])}`,
          `P(x) = ${quad(-a, b - m, -F)}`,
        );
        const check = steps(`R(10) - C(10) = ${R10} - ${C10} = ${R10 - C10}`, `P(10) = ${evaluation(-a, b - m, -F, 10)}`);
        return expressionProblem({
          prompt: t(
            `The revenue and cost of making and selling $x$ items are $R(x) = ${quad(-a, b, 0)}$ and $C(x) = ${linear(m, F)}$. Find the profit function $P(x)$.`,
            `生产并售出 $x$ 件商品的收入和成本为 $R(x) = ${quad(-a, b, 0)}$，$C(x) = ${linear(m, F)}$。求利润函数 $P(x)$。`,
          ),
          answer: quad(-a, b - m, -F),
          simplified: true,
          prefix: "P(x) =",
          wrong: [quad(-a, b - m, F), quad(-a, b + m, -F), quad(a, m - b, F), quad(-a, b, -F - m)],
          solution: t(
            `**Step 1: Subtract the whole cost function.** Put $C(x)$ in parentheses, then change the sign of each of its terms and combine the $x$-terms, $${b}x - ${m}x = ${b - m}x$:${work}**Check.** At $x = 10$, revenue minus cost and the profit function agree:${check}`,
            `**第一步：减去整个成本函数。** 把 $C(x)$ 放进括号，再把它的每一项变号，并合并含 $x$ 的项 $${b}x - ${m}x = ${b - m}x$：${work}**检验。** 在 $x = 10$ 处，收入减成本与利润函数的值相同：${check}`,
          ),
        });
      },
    },
    {
      id: "revenue-from-a-price-function",
      title: t("Revenue from price and demand", "由价格与需求求收入"),
      explanation: t(
        `Revenue is the price of each item times the number sold. If selling more items requires a lower price, the price is itself a function of $x$, such as $p(x) = 60 - 2x$, and

$$R(x) = x \\cdot p(x) = x(60 - 2x) = 60x - 2x^{2}$$

So revenue is a quadratic function of the number of items. For $10$ items the price is $60 - 20 = 40$ dollars each, and $R(10) = 10 \\cdot 40 = 400 = 600 - 200$.

> **Watch out.** $p(x)$ is the price of **one** item; the revenue is $x$ times it. Multiply both terms by $x$: $x \\cdot 60 = 60x$ and $x \\cdot (-2x) = -2x^{2}$.`,
        `收入等于每件商品的价格乘以售出的件数。若要多卖就得降价，价格本身就是 $x$ 的函数，例如 $p(x) = 60 - 2x$，于是

$$R(x) = x \\cdot p(x) = x(60 - 2x) = 60x - 2x^{2}$$

所以收入是件数的二次函数。卖 $10$ 件时每件价格是 $60 - 20 = 40$ 元，$R(10) = 10 \\cdot 40 = 400 = 600 - 200$。

> **注意。** $p(x)$ 是**一件**商品的价格；收入是它的 $x$ 倍。两项都要乘以 $x$：$x \\cdot 60 = 60x$，$x \\cdot (-2x) = -2x^{2}$。`,
      ),
      generate(rng) {
        const a = rng.int(20, 200);
        const b = rng.pick([1, 2, 3, 4, 5, Q.of(1, 2)]);
        const item = rng.pick(goods);
        const B = toQ(b);
        const price = poly([a, ""], [B.neg(), "x"]);
        const p2 = Q.of(a).sub(B.mul(Q.of(2)));
        const check = steps(`2 \\cdot p(2) = 2 \\cdot ${num(p2)} = ${num(p2.mul(Q.of(2)))}`, `R(2) = ${evaluation(B.neg(), a, 0, 2)}`);
        return expressionProblem({
          prompt: t(
            `A shop can sell $x$ ${item.en} per week when it sets the price at $p(x) = ${price}$ dollars each. Write its weekly revenue $R(x)$.`,
            `当每件${item.zh}定价 $p(x) = ${price}$ 元时，商店每周能卖出 $x$ 件。写出它每周的收入 $R(x)$。`,
          ),
          answer: quad(B.neg(), a, 0),
          simplified: true,
          prefix: "R(x) =",
          wrong: [linear(B.neg(), a), quad(B, a, 0), quad(B.neg(), 0, a), quad(0, toQ(a).sub(B), 0)],
          solution: t(
            `**Step 1: Multiply the price by the number sold.** Each of the $x$ items sells for $p(x)$:${steps(`R(x) = x \\cdot p(x) = x(${price})`)}**Step 2: Multiply both terms by $x$.** Then write the $x^{2}$-term first:${steps(`R(x) = ${quad(B.neg(), a, 0)}`)}**Check.** Selling $2$ items at $p(2) = ${num(p2)}$ dollars each brings in the same as $R(2)$:${check}`,
            `**第一步：价格乘以售出件数。** $x$ 件商品每件卖 $p(x)$：${steps(`R(x) = x \\cdot p(x) = x(${price})`)}**第二步：两项都乘以 $x$。** 再把 $x^{2}$ 项写在前面：${steps(`R(x) = ${quad(B.neg(), a, 0)}`)}**检验。** 以每件 $p(2) = ${num(p2)}$ 元卖出 $2$ 件，收入与 $R(2)$ 相同：${check}`,
          ),
        });
      },
    },
  ],
};

export const constructingRevenueCostAndProfitFunctions: TopicDef = {
  id: "constructing-revenue-cost-and-profit-functions",
  title: t("Constructing Revenue, Cost, and Profit Functions", "构建收入、成本与利润函数"),
  summary: t(
    "Write cost, profit and revenue functions from a description, including revenue when a price change changes the number sold.",
    "根据描述写出成本、利润和收入函数，包括价格变化影响销量时的收入函数。",
  ),
  prerequisites: ["revenue-cost-and-profit-functions", "constructing-linear-functions"],
  encompasses: [
    { topic: "revenue-cost-and-profit-functions", weight: 0.5 },
    { topic: "constructing-linear-functions", weight: 0.3 },
    { topic: "multiplying-binomials", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.1", "CCSS.HSA.CED.A.2"],
  intro: t(
    `So far the revenue and cost functions were given, and we computed with them. A real business starts from facts instead: what it pays every month, what each item costs to make, what it charges. Turning those facts into functions is what makes the questions answerable.

Take a bakery that pays $\\$1200$ a month in rent, spends $\\$4$ on ingredients per cake and sells each cake for $\\$10$. Making $x$ cakes costs $C(x) = 4x + 1200$, selling them brings in $R(x) = 10x$, and the profit is

$$P(x) = 10x - (4x + 1200) = 6x - 1200$$

Each cake adds $\\$6$, so the bakery needs $200$ cakes a month just to cover the rent.

In this lesson we write cost and profit functions from a description, and revenue functions when a change in price changes the number sold.`,
    `到目前为止，收入函数和成本函数都是给定的，我们只是用它们计算。真实的生意却从事实出发：每月要付多少钱，每件商品的制作成本是多少，售价是多少。把这些事实写成函数，问题才能回答。

一家面包店每月房租 $1200$ 元，每个蛋糕原料 $4$ 元，每个蛋糕售价 $10$ 元。做 $x$ 个蛋糕的成本是 $C(x) = 4x + 1200$，卖掉它们的收入是 $R(x) = 10x$，利润是

$$P(x) = 10x - (4x + 1200) = 6x - 1200$$

每个蛋糕带来 $6$ 元，所以面包店每月要卖 $200$ 个蛋糕才够付房租。

这节课我们根据描述写出成本函数和利润函数，并写出价格变化影响销量时的收入函数。`,
  ),
  knowledgePoints: [
    {
      id: "cost-functions",
      title: t("Cost functions", "成本函数"),
      explanation: t(
        `A cost function adds the fixed cost, paid however many items are made, to the variable cost of $x$ items, which is the cost per item times $x$. A bakery paying $\\$1200$ a month in rent and $\\$4$ in ingredients per cake has

$$C(x) = 4x + 1200$$

Making no cakes still costs $C(0) = 1200$, the rent, and each cake adds $4$.

> **Watch out.** The cost **per item** multiplies $x$; the fixed cost is the constant term. Swapping them, $1200x + 4$, would charge the rent for every cake.`,
        `成本函数等于固定成本（无论生产多少件都要付）加上 $x$ 件商品的可变成本，即每件的成本乘以 $x$。一家面包店每月房租 $1200$ 元，每个蛋糕原料 $4$ 元，则

$$C(x) = 4x + 1200$$

一个蛋糕都不做也要花 $C(0) = 1200$ 元房租，每多做一个蛋糕多花 $4$ 元。

> **注意。** **每件**的成本乘以 $x$；固定成本是常数项。把两者调换成 $1200x + 4$，就等于每个蛋糕都要付一次房租。`,
      ),
      generate(rng) {
        const item = rng.pick(goods);
        const fixed = rng.int(3, 90) * 50;
        const v = rng.int(2, 30);
        const check = steps(`C(0) = ${fixed}`, `C(10) = ${v} \\cdot 10 + ${fixed} = ${10 * v + fixed}`);
        return expressionProblem({
          prompt: t(
            `A workshop making ${item.en} pays $\\$${fixed}$ a month in fixed costs, and each of its ${item.en} costs $\\$${v}$ to make. Write the monthly cost $C(x)$ of making $x$ ${item.en}.`,
            `一家生产${item.zh}的工坊每月固定成本为 $${fixed}$ 元，每件${item.zh}的制作成本为 $${v}$ 元。写出每月生产 $x$ 件${item.zh}的成本 $C(x)$。`,
          ),
          answer: linear(v, fixed),
          prefix: "C(x) =",
          wrong: [linear(fixed, v), linear(v, -fixed), linear(v + fixed, 0), linear(v, 0)],
          solution: t(
            `**Step 1: Write the variable cost.** Each item costs $${v}$, so $x$ items cost $${v}x$.

**Step 2: Add the fixed cost.** The $${fixed}$ is paid however many are made:${steps(`C(x) = ${linear(v, fixed)}`)}**Check.** Making nothing costs only the fixed cost, and $10$ items cost $10$ times $${v}$ more:${check}`,
            `**第一步：写出可变成本。** 每件成本 $${v}$ 元，所以 $x$ 件的成本是 $${v}x$。

**第二步：加上固定成本。** 无论生产多少件都要付 $${fixed}$：${steps(`C(x) = ${linear(v, fixed)}`)}**检验。** 什么都不生产时只有固定成本，生产 $10$ 件时多出 $10$ 个 $${v}$：${check}`,
          ),
        });
      },
    },
    {
      id: "profit-functions",
      title: t("Profit functions from a description", "根据描述写利润函数"),
      explanation: t(
        `Build the revenue and the cost, then subtract: $P(x) = R(x) - C(x)$. Selling each lamp for $\\$35$, with $\\$500$ fixed costs and $\\$20$ per lamp, gives $R(x) = 35x$ and $C(x) = 20x + 500$, so

$$P(x) = 35x - (20x + 500) = 15x - 500$$

Each lamp adds $35 - 20 = 15$ dollars, and the fixed cost is subtracted once.

> **Watch out.** Subtract the fixed cost, do not add it: $-(20x + 500)$ gives $-500$. The coefficient of $x$ is the price **minus** the cost per item, not their sum.`,
        `先写出收入和成本，再相减：$P(x) = R(x) - C(x)$。每盏台灯售价 $35$ 元，固定成本 $500$ 元，每盏成本 $20$ 元，则 $R(x) = 35x$，$C(x) = 20x + 500$，所以

$$P(x) = 35x - (20x + 500) = 15x - 500$$

每盏台灯带来 $35 - 20 = 15$ 元，固定成本只减一次。

> **注意。** 固定成本要减去，不是加上：$-(20x + 500)$ 得到 $-500$。$x$ 的系数是售价**减去**每件成本，不是两者之和。`,
      ),
      generate(rng) {
        const item = rng.pick(goods);
        const fixed = rng.int(3, 60) * 50;
        const v = rng.int(2, 30);
        const p = v + rng.int(2, 30);
        const work = steps(`P(x) = ${p}x - (${linear(v, fixed)})`, `P(x) = ${p}x - ${v}x - ${fixed}`, `P(x) = ${linear(p - v, -fixed)}`);
        const check = steps(
          `R(10) - C(10) = ${10 * p} - ${10 * v + fixed} = ${10 * (p - v) - fixed}`,
          `P(10) = ${p - v} \\cdot 10 - ${fixed} = ${10 * (p - v)} - ${fixed} = ${10 * (p - v) - fixed}`,
        );
        return expressionProblem({
          prompt: t(
            `A company sells ${item.en} for $\\$${p}$ each. Its fixed costs are $\\$${fixed}$, and each item costs $\\$${v}$ to make. Write the profit $P(x)$ from making and selling $x$ ${item.en}.`,
            `某公司以每件 $${p}$ 元的价格出售${item.zh}。它的固定成本是 $${fixed}$ 元，每件的制作成本是 $${v}$ 元。写出生产并售出 $x$ 件${item.zh}的利润 $P(x)$。`,
          ),
          answer: linear(p - v, -fixed),
          prefix: "P(x) =",
          wrong: [linear(p - v, fixed), linear(p + v, -fixed), linear(p, -fixed - v), linear(p - v, 0)],
          solution: t(
            `**Step 1: Write the revenue and the cost.** Revenue is $R(x) = ${p}x$, and cost is $C(x) = ${linear(v, fixed)}$.

**Step 2: Subtract the whole cost.** Change the sign of both terms of $C(x)$ and combine the $x$-terms:${work}**Check.** At $x = 10$ the two ways agree:${check}`,
            `**第一步：写出收入和成本。** 收入是 $R(x) = ${p}x$，成本是 $C(x) = ${linear(v, fixed)}$。

**第二步：减去整个成本。** 把 $C(x)$ 的两项都变号，再合并含 $x$ 的项：${work}**检验。** 在 $x = 10$ 处两种算法一致：${check}`,
          ),
        });
      },
    },
    {
      id: "revenue-with-price-changes",
      title: t("Revenue when the price changes", "价格变化时的收入"),
      explanation: t(
        `When raising the price lowers the number sold, both the price and the quantity depend on the number of changes. Write each one as an expression first, then multiply them.

A theater sells $300$ tickets at $\\$12$. For each $\\$1$ increase in price it sells $15$ fewer tickets. After $n$ increases of $\\$1$ the price is $12 + n$ and the number sold is $300 - 15n$, so

$$R(n) = (12 + n)(300 - 15n) = 3600 - 180n + 300n - 15n^{2} = -15n^{2} + 120n + 3600$$

Revenue is price times number sold, so it is a quadratic function of $n$. At $n = 0$ it gives back $12 \\cdot 300 = 3600$.

> **Watch out.** The price goes **up**, $12 + n$, while the number sold goes **down**, $300 - 15n$. Multiply every term of one factor by every term of the other; the answer is not the linear $3600 - 15n$.`,
        `当提价使销量减少时，价格和销量都取决于提价的次数。先把它们各自写成式子，再相乘。

一家剧院以 $12$ 元的票价能卖出 $300$ 张票。票价每提高 $1$ 元，就少卖 $15$ 张。提价 $n$ 次（每次 $1$ 元）后，票价是 $12 + n$，售出 $300 - 15n$ 张，所以

$$R(n) = (12 + n)(300 - 15n) = 3600 - 180n + 300n - 15n^{2} = -15n^{2} + 120n + 3600$$

收入等于价格乘以销量，所以它是 $n$ 的二次函数。$n = 0$ 时得到 $12 \\cdot 300 = 3600$。

> **注意。** 价格**上升**，是 $12 + n$；销量**下降**，是 $300 - 15n$。一个因式的每一项都要乘以另一个因式的每一项；答案不是一次式 $3600 - 15n$。`,
      ),
      generate(rng) {
        const item = rng.pick(goods);
        const p = rng.int(5, 40);
        const k = rng.int(2, 20);
        const q = k * rng.int(5, 30);
        const price = poly([p, ""], [1, "n"]);
        const sold = poly([q, ""], [-k, "n"]);
        const answer = quad(-k, q - k * p, p * q, "n");
        const work = steps(
          `R(n) = (${price})(${sold})`,
          `R(n) = ${poly([p * q, ""], [-p * k, "n"], [q, "n"], [-k, "n^{2}"])}`,
          `R(n) = ${answer}`,
        );
        const check = steps(`${p + 1} \\cdot ${q - k} = ${(p + 1) * (q - k)}`, `R(1) = ${evaluation(-k, q - k * p, p * q, 1)}`);
        return expressionProblem({
          prompt: t(
            `A store sells $${q}$ ${item.en} a week at $\\$${p}$ each. For each $\\$1$ increase in price, it sells $${k}$ fewer. Write the weekly revenue $R(n)$ after $n$ increases of $\\$1$.`,
            `一家商店以每件 $${p}$ 元的价格每周卖出 $${q}$ 件${item.zh}。价格每提高 $1$ 元，就少卖 $${k}$ 件。写出提价 $n$ 次（每次 $1$ 元）后每周的收入 $R(n)$。`,
          ),
          answer,
          prefix: "R(n) =",
          wrong: [
            `(${poly([p, ""], [1, "n"])})(${poly([q, ""], [k, "n"])})`,
            `(${poly([p, ""], [-1, "n"])})(${poly([q, ""], [-k, "n"])})`,
            linear(-k, p * q, "n"),
            `(${poly([p, ""], [1, "n"])})(${q} - ${k})`,
          ],
          solution: t(
            `**Step 1: Write the price and the number sold.** After $n$ increases the price is $${price}$ dollars, and the number sold is $${sold}$.

**Step 2: Multiply and simplify.** Revenue is price times number sold; multiply each term of the first factor by each term of the second, then combine the $n$-terms:${work}**Check.** After one increase the store sells $${q - k}$ at $\\$${p + 1}$, and $R(1)$ gives the same revenue:${check}`,
            `**第一步：写出价格和销量。** 提价 $n$ 次后价格是 $${price}$ 元，销量是 $${sold}$。

**第二步：相乘并化简。** 收入等于价格乘以销量；第一个因式的每一项乘以第二个因式的每一项，再合并含 $n$ 的项：${work}**检验。** 提价一次后，商店以 $${p + 1}$ 元卖出 $${q - k}$ 件，$R(1)$ 给出同样的收入：${check}`,
          ),
        });
      },
    },
  ],
};

/** vertexAt writes x = −b / (2 · (−a)) = b / (2a) = h for a profit function −a x² + b x + c with a > 0. */
const vertexAt = (a: number, b: number) => `x = ${chain(`-\\frac{${b}}{2 \\cdot (-${a})}`, `\\frac{${b}}{${2 * a}}`, num(Q.of(b, 2 * a)))}`;

export const maximizingProfitAndBreakEvenPoints: TopicDef = {
  id: "maximizing-profit-and-break-even-points",
  title: t("Maximizing Profit and Break-Even Points", "利润最大化与盈亏平衡点"),
  summary: t(
    "Find the number of items that maximizes a quadratic profit function, the maximum profit, and the break-even points where profit is zero.",
    "求使二次利润函数最大的件数、最大利润，以及利润为零的盈亏平衡点。",
  ),
  prerequisites: ["constructing-revenue-cost-and-profit-functions", "the-average-of-the-roots-formula"],
  encompasses: [
    { topic: "the-axis-of-symmetry-of-a-parabola", weight: 0.4 },
    { topic: "roots-of-quadratic-functions", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSA.SSE.B.3"],
  intro: t(
    `When a lower price is needed to sell more, revenue is a quadratic function of the number sold, and so is profit. Its graph is a downward parabola, and everything we know about parabolas now answers business questions. The vertex is the **most profitable** quantity, and its height is the **maximum profit**. The roots are the **break-even points**, where profit is $0$. By the average of the roots formula, the vertex lies halfway between them.

Take $P(x) = -2x^{2} + 200x - 1800 = -2(x - 10)(x - 90)$. The business breaks even at $10$ and at $90$ items, and makes a profit in between. The best quantity is halfway, $\\frac{10 + 90}{2} = 50$, and the profit there is

$$P(50) = -2(50 - 10)(50 - 90) = -2 \\cdot 40 \\cdot (-40) = 3200$$

In this lesson we find the most profitable quantity, the maximum profit, the break-even points, and the quantities that make a profit.`,
    `当要降价才能多卖时，收入是销量的二次函数，利润也是。它的图象是开口向下的抛物线，我们对抛物线的了解现在可以回答经营问题。顶点给出**利润最大**的件数，顶点的高度就是**最大利润**。零点是利润为 $0$ 的**盈亏平衡点**。由根的平均值公式，顶点位于两个零点正中间。

取 $P(x) = -2x^{2} + 200x - 1800 = -2(x - 10)(x - 90)$。企业在 $10$ 件和 $90$ 件时盈亏平衡，介于两者之间时盈利。最好的件数在正中间，$\\frac{10 + 90}{2} = 50$，此时利润是

$$P(50) = -2(50 - 10)(50 - 90) = -2 \\cdot 40 \\cdot (-40) = 3200$$

这节课我们求利润最大的件数、最大利润、盈亏平衡点，以及能够盈利的件数。`,
  ),
  knowledgePoints: [
    {
      id: "the-most-profitable-quantity",
      figure: algebraDrawings["maximizing-profit-and-break-even-points#the-most-profitable-quantity"],
      title: t("The most profitable quantity", "利润最大时的件数"),
      explanation: t(
        `A profit function such as $P(x) = -2x^{2} + 160x - 1800$ has a negative coefficient of $x^{2}$, so its graph is a downward parabola and profit is greatest at the vertex, on the axis of symmetry:

$$x = -\\frac{b}{2a} = -\\frac{160}{2 \\cdot (-2)} = 40$$

Making and selling $40$ items gives the most profit. Producing more than that lowers the profit again: $P(39) = P(41) = 1398$, less than $P(40) = 1400$.

> **Watch out.** Divide by $2a = -4$, not by $a = -2$, and keep both minus signs, so the quantity comes out positive. The question asks for a number of items, $x$, not for the profit.`,
        `像 $P(x) = -2x^{2} + 160x - 1800$ 这样的利润函数，$x^{2}$ 的系数为负，图象是开口向下的抛物线，所以利润在顶点处、即对称轴上最大：

$$x = -\\frac{b}{2a} = -\\frac{160}{2 \\cdot (-2)} = 40$$

生产并售出 $40$ 件时利润最大。再多生产，利润反而会下降：$P(39) = P(41) = 1398$，比 $P(40) = 1400$ 小。

> **注意。** 要除以 $2a = -4$，不是除以 $a = -2$；两个负号都要保留，件数才是正数。题目问的是件数 $x$，不是利润。`,
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const h = rng.int(10, 90);
        const b = 2 * a * h;
        const F = rng.int(1, Math.floor((a * h * h) / 100)) * 50;
        const item = rng.pick(goods);
        const top = a * h * h - F;
        return numberProblem({
          prompt: t(
            `The weekly profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${quad(-a, b, -F)}$. How many ${item.en} should be made and sold each week to maximize the profit?`,
            `每周生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${quad(-a, b, -F)}$。每周应生产并售出多少件${item.zh}才能使利润最大？`,
          ),
          answer: h,
          wrong: [2 * h, -h, a * h * h - F, Q.of(b, a)],
          solution: t(
            `**Step 1: Find where the maximum is.** The coefficient of $x^{2}$ is $-${a}$, negative, so the parabola opens downward and the profit is greatest at the vertex.

**Step 2: Compute the axis of symmetry.** With $a = -${a}$ and $b = ${b}$:${steps(vertexAt(a, b))}So $${h}$ ${item.en} a week give the most profit.

**Check.** One item fewer or one more gives the same, smaller profit:${steps(`P(${h - 1}) = P(${h + 1}) = ${top - a} < ${top} = P(${h})`)}`,
            `**第一步：确定最大值的位置。** $x^{2}$ 的系数 $-${a}$ 是负数，所以抛物线开口向下，利润在顶点处最大。

**第二步：计算对称轴。** $a = -${a}$，$b = ${b}$：${steps(vertexAt(a, b))}所以每周 $${h}$ 件${item.zh}利润最大。

**检验。** 少一件或多一件，利润相同而且更小：${steps(`P(${h - 1}) = P(${h + 1}) = ${top - a} < ${top} = P(${h})`)}`,
          ),
        });
      },
    },
    {
      id: "the-maximum-profit",
      figure: algebraDrawings["maximizing-profit-and-break-even-points#the-maximum-profit"],
      title: t("The maximum profit", "最大利润"),
      explanation: t(
        `The maximum profit is the value of $P$ at the vertex: find the quantity of the vertex first, then substitute it into every term. For $P(x) = -2x^{2} + 160x - 1800$, the vertex is at $x = 40$:

$$P(40) = -2 \\cdot 40^{2} + 160 \\cdot 40 - 1800 = -3200 + 6400 - 1800 = 1400$$

The maximum profit is $\\$1400$.

> **Watch out.** The answer is a value of $P$, here $1400$ dollars, not the number of items $40$. Keep the fixed cost $-1800$ in the sum, and square $40$ before multiplying by $-2$.`,
        `最大利润是 $P$ 在顶点处的值：先求顶点对应的件数，再把它代入每一项。对 $P(x) = -2x^{2} + 160x - 1800$，顶点在 $x = 40$ 处：

$$P(40) = -2 \\cdot 40^{2} + 160 \\cdot 40 - 1800 = -3200 + 6400 - 1800 = 1400$$

最大利润是 $1400$ 元。

> **注意。** 答案是 $P$ 的值，这里是 $1400$ 元，不是件数 $40$。求和时不要漏掉固定成本 $-1800$，并且先把 $40$ 平方再乘以 $-2$。`,
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const h = rng.int(5, 60);
        const b = 2 * a * h;
        const F = rng.int(1, Math.max(1, Math.floor((a * h * h) / 50))) * 25;
        const top = a * h * h - F;
        const item = rng.pick(goods);
        const back = steps(chain(vertexForm(-a, h, top), `${quad(-a, b, -a * h * h)}${tail(top)}`, quad(-a, b, -F)));
        return numberProblem({
          prompt: t(
            `The monthly profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${quad(-a, b, -F)}$. What is the maximum monthly profit?`,
            `每月生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${quad(-a, b, -F)}$。每月的最大利润是多少？`,
          ),
          answer: top,
          wrong: [h, top + F, b * h - F, -a * h * h - b * h - F],
          solution: t(
            `**Step 1: Find the vertex.** The parabola opens downward, and with $a = -${a}$ and $b = ${b}$ its vertex is at${steps(vertexAt(a, b))}**Step 2: Substitute into every term.**${steps(`P(${h}) = ${evaluation(-a, b, -F, h)}`)}The maximum profit is $\\$${top}$.

**Check.** In vertex form the vertex $(${h}, ${top})$ shows directly, and the vertex form expands back to $P(x)$:${back}`,
            `**第一步：求顶点。** 抛物线开口向下，$a = -${a}$，$b = ${b}$，顶点在${steps(vertexAt(a, b))}**第二步：代入每一项。**${steps(`P(${h}) = ${evaluation(-a, b, -F, h)}`)}最大利润是 $${top}$ 元。

**检验。** 写成顶点式，顶点 $(${h}, ${top})$ 一目了然，而顶点式展开后就是 $P(x)$：${back}`,
          ),
        });
      },
    },
    {
      id: "break-even-points",
      title: t("Break-even points", "盈亏平衡点"),
      explanation: t(
        `A **break-even point** is a quantity where profit is $0$: revenue exactly covers cost. They are the roots of $P$, or the solutions of $R(x) = C(x)$. For $P(x) = -2x^{2} + 200x - 1800$, take out $-2$ and factor:

$$-2(x^{2} - 100x + 900) = 0 \\Rightarrow -2(x - 10)(x - 90) = 0$$

The business breaks even at $10$ and at $90$ items. The most profitable quantity is halfway between them, at the average of the roots: $\\frac{10 + 90}{2} = 50$.

> **Watch out.** There are **two** break-even points, and both are positive quantities: $(x - 10)$ gives $10$, not $-10$. Their average is the most profitable quantity, not a break-even point.`,
        `**盈亏平衡点**是利润为 $0$（收入恰好抵消成本）时的件数。它们是 $P$ 的零点，也是 $R(x) = C(x)$ 的解。对 $P(x) = -2x^{2} + 200x - 1800$，提出 $-2$ 再分解：

$$-2(x^{2} - 100x + 900) = 0 \\Rightarrow -2(x - 10)(x - 90) = 0$$

企业在 $10$ 件和 $90$ 件时盈亏平衡。利润最大的件数位于两者正中间，即两根的平均值：$\\frac{10 + 90}{2} = 50$。

> **注意。** 盈亏平衡点有**两个**，而且都是正的件数：$(x - 10)$ 给出 $10$，不是 $-10$。它们的平均值是利润最大的件数，不是盈亏平衡点。`,
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const r = rng.int(2, 40);
        const s = r + rng.int(4, 60);
        const viaRC = rng.bool();
        const item = rng.pick(goods);
        const values = [String(r), String(s)];
        const wrong = [[String(-r), String(-s)], [String(r)], [String(s)], [num(Q.of(r + s, 2))]];
        const factorLines = [`${front(-a)}(${quad(1, -(r + s), r * s)}) = 0`, `${front(-a)}(x - ${r})(x - ${s}) = 0`];
        if (viaRC) {
          const m = rng.int(3, 20);
          const F = a * r * s;
          const b = a * (r + s) + m;
          const work = steps(`${quad(-a, b, 0)} = ${linear(m, F)}`, `${quad(-a, b - m, -F)} = 0`, ...factorLines);
          return solutionsProblem({
            prompt: t(
              `The revenue and cost in dollars of making and selling $x$ ${item.en} are $R(x) = ${quad(-a, b, 0)}$ and $C(x) = ${linear(m, F)}$. Find the break-even points.`,
              `生产并售出 $x$ 件${item.zh}的收入和成本（单位：元）为 $R(x) = ${quad(-a, b, 0)}$，$C(x) = ${linear(m, F)}$。求盈亏平衡点。`,
            ),
            values,
            wrong,
            solution: t(
              `**Step 1: Set revenue equal to cost.** Move the cost to the left, take out $-${a}$ and factor:${work}**Step 2: Read the roots.** The break-even points are $x = ${r}$ and $x = ${s}$ ${item.en}.

**Check.** At $x = ${r}$ revenue and cost are equal:${steps(`R(${r}) = ${evaluation(-a, b, 0, r)}`, `C(${r}) = ${lineAt(m, F, r)}`)}`,
              `**第一步：令收入等于成本。** 把成本移到左边，提出 $-${a}$ 再分解：${work}**第二步：读出零点。** 盈亏平衡点是 $x = ${r}$ 和 $x = ${s}$ 件${item.zh}。

**检验。** 在 $x = ${r}$ 处收入等于成本：${steps(`R(${r}) = ${evaluation(-a, b, 0, r)}`, `C(${r}) = ${lineAt(m, F, r)}`)}`,
            ),
          });
        }
        const P = quad(-a, a * (r + s), -a * r * s);
        return solutionsProblem({
          prompt: t(
            `The profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${P}$. Find the break-even points.`,
            `生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${P}$。求盈亏平衡点。`,
          ),
          values,
          wrong,
          solution: t(
            `**Step 1: Set the profit equal to $0$ and factor.** Take out $-${a}$ first:${steps(`${P} = 0`, ...factorLines)}**Step 2: Read the roots.** The break-even points are $x = ${r}$ and $x = ${s}$ ${item.en}.

**Check.** The profit is $0$ at both:${steps(`P(${r}) = ${evaluation(-a, a * (r + s), -a * r * s, r)}`, `P(${s}) = ${evaluation(-a, a * (r + s), -a * r * s, s)}`)}`,
            `**第一步：令利润为 $0$ 并分解因式。** 先提出 $-${a}$：${steps(`${P} = 0`, ...factorLines)}**第二步：读出零点。** 盈亏平衡点是 $x = ${r}$ 和 $x = ${s}$ 件${item.zh}。

**检验。** 两处的利润都是 $0$：${steps(`P(${r}) = ${evaluation(-a, a * (r + s), -a * r * s, r)}`, `P(${s}) = ${evaluation(-a, a * (r + s), -a * r * s, s)}`)}`,
          ),
        });
      },
    },
    {
      id: "profitable-quantities",
      figure: algebraDrawings["maximizing-profit-and-break-even-points#profitable-quantities"],
      title: t("When the business makes a profit", "何时盈利"),
      explanation: t(
        `A downward profit parabola is above the $x$-axis between its roots and below it outside them. So the business makes a profit, $P(x) > 0$, exactly for quantities strictly between the two break-even points. With break-even points $10$ and $90$, it profits for $10 < x < 90$, the interval $(10, 90)$. For example $P(50) > 0$, while $P(100) < 0$.

> **Watch out.** Use **open** endpoints: at $10$ and $90$ the profit is $0$, not positive. And the profit lies **between** the roots, not outside them: outside, a downward parabola is below the axis.`,
        `开口向下的利润抛物线在两个零点之间位于 $x$ 轴上方，在两侧位于下方。所以企业盈利（$P(x) > 0$）恰好是件数严格位于两个盈亏平衡点之间的时候。若盈亏平衡点是 $10$ 和 $90$，则 $10 < x < 90$ 时盈利，即区间 $(10, 90)$。例如 $P(50) > 0$，而 $P(100) < 0$。

> **注意。** 端点要用**开**区间：在 $10$ 和 $90$ 处利润为 $0$，不是正数。盈利在两个零点**之间**，不在两侧：在两侧，开口向下的抛物线位于 $x$ 轴下方。`,
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const r = rng.int(2, 40);
        const s = r + rng.int(4, 60);
        const item = rng.pick(goods);
        const set = union({ lo: Q.of(r), hi: Q.of(s), loClosed: false, hiClosed: false });
        const P = quad(-a, a * (r + s), -a * r * s);
        const inside = steps(`P(${r + 1}) = ${front(-a)}(${r + 1} - ${r})(${r + 1} - ${s}) = ${a * (s - r - 1)}`);
        const outside = steps(`P(${s + 1}) = ${front(-a)}(${s + 1} - ${r})(${s + 1} - ${s}) = ${-a * (s + 1 - r)}`);
        return intervalProblem({
          prompt: t(
            `The profit in dollars from making and selling $x$ ${item.en} is $P(x) = ${P}$. For which values of $x$ is the profit positive?`,
            `生产并售出 $x$ 件${item.zh}的利润（单位：元）是 $P(x) = ${P}$。$x$ 取哪些值时利润为正？`,
          ),
          set,
          wrong: [
            union({ lo: Q.of(r), hi: Q.of(s), loClosed: true, hiClosed: true }),
            union({ hi: Q.of(r), loClosed: false, hiClosed: false }, { lo: Q.of(s), loClosed: false, hiClosed: false }),
            ray(r, true, false),
          ],
          solution: t(
            `**Step 1: Find the break-even points.** Take out $-${a}$ and factor:${steps(`P(x) = ${front(-a)}(${quad(1, -(r + s), r * s)})`, `P(x) = ${front(-a)}(x - ${r})(x - ${s})`)}The roots are $${r}$ and $${s}$.

**Step 2: Read where the parabola is above the axis.** It opens downward, so it is above the $x$-axis strictly between its roots: $${r} < x < ${s}$, the interval $${intervalLatex(set)}$.

**Check.** A quantity inside makes a profit, and one outside makes a loss:${inside}${outside}`,
            `**第一步：求盈亏平衡点。** 提出 $-${a}$ 再分解：${steps(`P(x) = ${front(-a)}(${quad(1, -(r + s), r * s)})`, `P(x) = ${front(-a)}(x - ${r})(x - ${s})`)}零点是 $${r}$ 和 $${s}$。

**第二步：看抛物线何时在 $x$ 轴上方。** 它开口向下，所以严格位于两个零点之间时在 $x$ 轴上方：$${r} < x < ${s}$，即区间 $${intervalLatex(set)}$。

**检验。** 区间内的件数盈利，区间外的件数亏损：${inside}${outside}`,
          ),
        });
      },
    },
  ],
};

/** quadraticFunctionTopics are the topics of the quadratic functions units, in teaching order. */
export const quadraticFunctionTopics: readonly TopicDef[] = [
  graphingElementaryQuadraticFunctions,
  verticalReflectionsOfQuadraticFunctions,
  graphsOfGeneralQuadraticFunctions,
  rootsOfQuadraticFunctions,
  theDiscriminantOfAQuadraticFunction,
  theAxisOfSymmetryOfAParabola,
  theAverageOfTheRootsFormula,
  theVertexFormOfAParabola,
  writingTheEquationOfAParabolaInVertexForm,
  domainAndRangeOfQuadraticFunctions,
  solvingSystemsOfNonlinearEquations,
  findingIntersectionsOfLinesAndQuadraticFunctions,
  modelingDownwardsVerticalMotion,
  modelingUpwardsVerticalMotion,
  verticalMotion,
  revenueCostAndProfitFunctions,
  constructingRevenueCostAndProfitFunctions,
  maximizingProfitAndBreakEvenPoints,
];
